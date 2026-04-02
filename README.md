# mcp-deckofcards

MCP server for drawing and shuffling playing cards via [Deck of Cards API](https://deckofcardsapi.com). No authentication required.

## Tools

| Tool | Description |
|------|-------------|
| `new_deck` | Create and shuffle a new deck (or multiple decks) of playing cards |
| `draw_cards` | Draw one or more cards from an existing deck |
| `shuffle_deck` | Shuffle (or re-shuffle) an existing deck |

## Quickstart via Pipeworx Gateway

Call any tool through the hosted gateway with zero setup:

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "deckofcards_new_deck",
      "arguments": { "count": 1 }
    }
  }'
```

## License

MIT
