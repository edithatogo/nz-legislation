---
sidebar_position: 2
---

# Quick Start

Get up and running with the NZ Legislation Tool in 5 minutes.

## Prerequisites

- **Node.js** 18+ (LTS versions: 18, 20, 22)
- **npm** 10+ or **pnpm**
- **NZ Legislation API Key** (free, from https://api.legislation.govt.nz)

## Installation

### Option 1: Global Installation (Recommended)

```bash
npm install -g nz-legislation-tool
```

### Option 2: Run without Installation

```bash
npx nz-legislation-tool search --query "health"
```

## Configuration

### Get Your API Key

1. Visit https://api.legislation.govt.nz
2. Create an account
3. Request an API key
4. Copy your key

### Set API Key

```bash
nzlegislation config --key YOUR_API_KEY
```

### Verify Configuration

```bash
nzlegislation config --show
```

Expected output:
```
Configuration:
  API Key: •••••••••••••••• (configured)
  Base URL: https://api.legislation.govt.nz
  Timeout: 30000ms
```

## Your First Search

Search for health-related legislation:

```bash
nzlegislation search --query "health" --limit 5
```

Expected output:
```
┌─────────┬─────────────────────────────────────┬──────────┬─────────────┐
│ ID      │ Title                               │ Type     │ Status      │
├─────────┼─────────────────────────────────────┼──────────┼─────────────┤
│ act_... │ Health Act 1956                     │ Act      │ Repealed    │
│ act_... │ New Zealand Public Health and ...   │ Act      │ Current     │
│ ...     │ ...                                 │ ...      │ ...         │
└─────────┴─────────────────────────────────────┴──────────┴─────────────┘

Total: 123 results
```

## Export Results

Export search results to CSV:

```bash
nzlegislation export --query "mental health" --output mental-health.csv
```

## Generate Citations

Generate a citation in NZMJ format:

```bash
nzlegislation cite "act_public_1989_18" --style nzmj
```

Output:
```
New Zealand Public Health and Disability Act 2000, Public Act 2000 No 91 (NZ).
```

## Next Steps

- [Installation Guide](./installation.md) - Detailed installation options
- [User Guide](./user-guide/searching.md) - Learn all search features
- [CLI Commands](../commands/search.md) - Full command reference
- [Research Workflow](./user-guide/research-workflow.md) - End-to-end research process

## Getting Help

```bash
# General help
nzlegislation --help

# Command-specific help
nzlegislation search --help

# Interactive help
nzlegislation help-interactive
```

---

**Need Help?** Check the [FAQ](./troubleshooting/faq.md) or [Report an Issue](https://github.com/edithatogo/nz-legislation/issues).
