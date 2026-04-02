/**
 * Deck of Cards MCP — wraps deckofcardsapi.com (free, no auth)
 *
 * Tools:
 * - new_deck: Create and shuffle a new deck of cards
 * - draw_cards: Draw one or more cards from an existing deck
 * - shuffle_deck: Shuffle (or re-shuffle) an existing deck
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://deckofcardsapi.com/api/deck';

type RawCard = {
  code: string;
  image: string;
  value: string;
  suit: string;
};

type RawDeckResponse = {
  success: boolean;
  deck_id: string;
  shuffled: boolean;
  remaining: number;
};

type RawDrawResponse = {
  success: boolean;
  deck_id: string;
  cards: RawCard[];
  remaining: number;
};

function formatCard(c: RawCard) {
  return {
    code: c.code,
    value: c.value,
    suit: c.suit,
    image: c.image,
  };
}

const tools: McpToolExport['tools'] = [
  {
    name: 'new_deck',
    description:
      'Create and shuffle a new deck (or multiple decks) of playing cards. Returns a deck_id for subsequent draws.',
    inputSchema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Number of standard 52-card decks to combine and shuffle. Defaults to 1.',
        },
      },
    },
  },
  {
    name: 'draw_cards',
    description:
      'Draw one or more cards from an existing deck. Requires the deck_id returned by new_deck.',
    inputSchema: {
      type: 'object',
      properties: {
        deck_id: {
          type: 'string',
          description: 'The deck ID returned by new_deck (e.g. "3p40paa87x90").',
        },
        count: {
          type: 'number',
          description: 'Number of cards to draw. Defaults to 1.',
        },
      },
      required: ['deck_id'],
    },
  },
  {
    name: 'shuffle_deck',
    description:
      'Shuffle (or re-shuffle) an existing deck, returning all drawn cards back into it.',
    inputSchema: {
      type: 'object',
      properties: {
        deck_id: {
          type: 'string',
          description: 'The deck ID to shuffle (e.g. "3p40paa87x90").',
        },
      },
      required: ['deck_id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'new_deck':
      return newDeck((args.count as number | undefined) ?? 1);
    case 'draw_cards':
      return drawCards(args.deck_id as string, (args.count as number | undefined) ?? 1);
    case 'shuffle_deck':
      return shuffleDeck(args.deck_id as string);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function newDeck(count: number) {
  const res = await fetch(`${BASE_URL}/new/shuffle/?deck_count=${count}`);
  if (!res.ok) throw new Error(`Deck of Cards API error: ${res.status}`);

  const data = (await res.json()) as RawDeckResponse;
  if (!data.success) throw new Error('Deck of Cards API returned success: false');

  return {
    deck_id: data.deck_id,
    shuffled: data.shuffled,
    remaining: data.remaining,
  };
}

async function drawCards(deckId: string, count: number) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(deckId)}/draw/?count=${count}`);
  if (!res.ok) throw new Error(`Deck of Cards API error: ${res.status}`);

  const data = (await res.json()) as RawDrawResponse;
  if (!data.success) throw new Error('Deck of Cards API returned success: false');

  return {
    deck_id: data.deck_id,
    cards: data.cards.map(formatCard),
    remaining: data.remaining,
  };
}

async function shuffleDeck(deckId: string) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(deckId)}/shuffle/`);
  if (!res.ok) throw new Error(`Deck of Cards API error: ${res.status}`);

  const data = (await res.json()) as RawDeckResponse;
  if (!data.success) throw new Error('Deck of Cards API returned success: false');

  return {
    deck_id: data.deck_id,
    shuffled: data.shuffled,
    remaining: data.remaining,
  };
}

export default { tools, callTool } satisfies McpToolExport;
