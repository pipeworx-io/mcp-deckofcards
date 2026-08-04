# mcp-deckofcards

Deck of Cards MCP — wraps deckofcardsapi.com (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `new_deck` | Create a shuffled deck of playing cards. Returns deck_id and remaining count. Use deck_count to combine multiple decks (e.g., 2 for 104 cards). |
| `draw_cards` | Draw cards from a deck. Returns card details (suit, value) and remaining count. Specify count to draw multiple cards at once. |
| `shuffle_deck` | Reshuffle a deck and reset all drawn cards back in. Returns updated remaining card count. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "deckofcards": {
      "url": "https://gateway.pipeworx.io/deckofcards/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Deckofcards data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
