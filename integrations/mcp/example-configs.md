# MCP example configs

## Stdio via npm package

```json
{
  "mcpServers": {
    "anz-legislation": {
      "command": "npx",
      "args": ["-y", "nz-legislation-tool", "mcp"],
      "env": {
        "NZ_LEGISLATION_API_KEY": "..."
      }
    }
  }
}
```

Update this once the actual packaged MCP command is verified. Before publishing
or submitting any MCP snippet, record the check in
`docs/maintainers/install-snippet-verification.md` and keep NZ stable support
separate from any AU planned or unsupported claims.
