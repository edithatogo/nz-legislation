# MCP example configs

## Stdio via npm package

```json
{
  "mcpServers": {
    "anz-legislation": {
      "command": "npx",
      "args": ["-y", "--package", "nz-legislation-tool", "nzlegislation-mcp"],
      "env": {
        "NZ_LEGISLATION_API_KEY": "..."
      }
    }
  }
}
```

This uses the packaged `nzlegislation-mcp` binary. Before publishing
or submitting any MCP snippet, record the check in
`docs/maintainers/install-snippet-verification.md` and keep NZ stable support
separate from any AU planned or unsupported claims.
