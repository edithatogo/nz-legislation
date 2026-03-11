# MCP Server Guide

## Overview

The NZ Legislation MCP (Model Context Protocol) Server provides AI assistants with tools to interact with the New Zealand Legislation API.

## Installation

```bash
npm install -g nz-legislation-tool
```

## Usage

### As MCP Server

The MCP server runs on stdio and communicates with AI assistants:

```bash
nzlegislation-mcp
```

Or with npx:

```bash
npx nzlegislation-mcp
```

### Configuration in AI Assistants

Add to your AI assistant's MCP configuration:

```json
{
  "mcpServers": {
    "nz-legislation": {
      "command": "nzlegislation-mcp"
    }
  }
}
```

## Available Tools

### 1. `search_legislation`

Search for New Zealand legislation by query.

**Parameters:**

- `query` (required): Search query text
- `type` (optional): Filter by type (act, bill, regulation, instrument)
- `status` (optional): Filter by status
- `from` (optional): Filter from date (YYYY-MM-DD)
- `to` (optional): Filter to date (YYYY-MM-DD)
- `limit` (optional): Maximum results (1-100, default: 25)

**Example:**

```
search_legislation(query="health and safety", type="act", limit=10)
```

### 2. `get_legislation`

Get details of a specific legislation work by ID.

**Parameters:**

- `workId` (required): Work ID (e.g., "act/2020/67")

**Example:**

```
get_legislation(workId="act/2020/67")
```

### 3. `get_legislation_versions`

Get all versions of a specific legislation work.

**Parameters:**

- `workId` (required): Work ID

**Example:**

```
get_legislation_versions(workId="act/2020/67")
```

### 4. `generate_citation`

Generate citation for legislation in various styles.

**Parameters:**

- `workId` (required): Work ID
- `style` (optional): Citation style (nzmj, bibtex, ris, apa)

**Example:**

```
generate_citation(workId="act/2020/67", style="nzmj")
```

### 5. `export_legislation`

Export legislation search results to CSV or JSON format.

**Parameters:**

- `query` (required): Search query
- `format` (optional): Export format (csv, json)
- `limit` (optional): Maximum results

**Example:**

```
export_legislation(query="health", format="csv", limit=50)
```

### 6. `get_config`

Get current API configuration status.

**Parameters:** None

**Example:**

```
get_config()
```

## Available Resources

### Legislation Resource

Access individual legislation works via resource URI:

```
legislation://{workId}
```

**Example:**

```
legislation://act/2020/67
```

Returns JSON representation of the legislation work.

## Error Handling

The MCP server returns structured errors:

- Authentication errors (invalid API key)
- Not found errors (invalid work ID)
- Rate limit errors (too many requests)
- Network errors (API unavailable)

All errors include descriptive messages to help diagnose issues.

## Configuration

The MCP server uses the same configuration as the CLI:

1. **API Key:** Set via `nzlegislation config --key <key>` or `NZ_LEGISLATION_API_KEY` environment variable
2. **Base URL:** Default is `https://api.legislation.govt.nz`
3. **Timeout:** Default is 30 seconds

## Development

Run MCP server in development mode:

```bash
npm run dev:mcp
```

Build for production:

```bash
npm run build
npm run start:mcp
```

## Examples

### Search and Cite

```
1. search_legislation(query="privacy", type="act", limit=5)
2. get_legislation(workId="act/2020/67")
3. generate_citation(workId="act/2020/67", style="apa")
```

### Export Data

```
export_legislation(query="employment", format="json", limit=100)
```

### Check Configuration

```
get_config()
```

## Support

For issues or questions:

- GitHub: https://github.com/edithatogo/nz-legislation/issues
- npm: https://www.npmjs.com/package/nz-legislation-tool

## License

Apache 2.0 - See LICENSE file for details.
