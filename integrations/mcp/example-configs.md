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

Update this once the actual packaged MCP command is verified.
