# NZ Legislation Tool

[![npm](https://img.shields.io/npm/v/nz-legislation-tool)](https://www.npmjs.com/package/nz-legislation-tool)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)

**Command-line interface for searching and retrieving New Zealand legislation data**

A fast, user-friendly CLI tool for researchers, legal professionals, and anyone working with NZ legislation. Built with TypeScript for ease of use and cross-platform compatibility.

---

## ✨ Features

- 🔍 **Search** - Full-text search with filters (type, status, date range)
- 📄 **Retrieve** - Get legislation by ID with version history
- 📤 **Export** - Export to CSV/JSON with reproducibility metadata
- 📚 **Cite** - Generate citations in NZMJ, BibTeX, RIS, APA styles
- ⚡ **Fast** - Instant startup, no compilation needed
- 🎨 **Beautiful Output** - Colored tables, formatted JSON, clean CSV
- 🔒 **Secure** - API key stored securely, never shared
- 📊 **Research-Ready** - Reproducible exports with metadata

---

## 🚀 Quick Start

### Try without installing (recommended for first-time users)

```bash
npx nz-legislation-tool search --query "health"
```

### Or install once

```bash
npm install -g nz-legislation-tool

# Then use anywhere
nzlegislation search --query "health"
```

---

## 📋 Requirements

- **Node.js** 18.0 or later ([Download](https://nodejs.org/))
- **NZ Legislation API Key** (Free, get yours below)

---

## 🔑 API Key Setup

### Get Your API Key

1. Visit: https://api.legislation.govt.nz/docs/
2. Sign up for a free API key
3. Copy your API key

### Configure the CLI

**Option 1: Interactive setup (recommended)**
```bash
nzlegislation config --key YOUR_API_KEY
```

**Option 2: Environment variable**
```bash
# Linux/macOS
export NZ_LEGISLATION_API_KEY=your_api_key_here

# Windows PowerShell
$env:NZ_LEGISLATION_API_KEY="your_api_key_here"

# Windows Command Prompt
set NZ_LEGISLATION_API_KEY=your_api_key_here
```

**Option 3: .env file**
```bash
# Create .env file in your project directory
NZ_LEGISLATION_API_KEY=your_api_key_here
```

---

## ⚙️ Configuration

### View Configuration
```bash
nzlegislation config --show
```

### Configure Rate Limits
Control API usage to match your needs:

```bash
# Set daily limit (default: 10,000)
nzlegislation config --daily-limit 5000

# Set burst limit (default: 2,000 per 5min)
nzlegislation config --burst-limit 1000

# Set safety margin 0-1 (default: 0.1 = 10%)
nzlegislation config --safety-margin 0.2
```

**Use Cases:**
- **Casual user:** `--daily-limit 1000 --safety-margin 0.2`
- **Power user:** `--daily-limit 10000 --safety-margin 0.05`
- **Shared API key:** `--daily-limit 2000 --burst-limit 500`

### Verbose Mode
Enable detailed logging for debugging:

```bash
nzlegislation search --query "health" --verbose
```

Logs are saved to `~/.nz-legislation-tool/logs/`

---

## 🔍 Troubleshooting

### Check for Updates
The CLI automatically checks for updates. Manual check:
```bash
nzlegislation --version
```

If update available, you'll see:
```
╔═══════════════════════════════════════════════════════════╗
║  ⚠️  New version available!                               ║
║  Current: 1.0.0        Latest:   1.1.0                   ║
║  Run: npm install -g nz-legislation-tool                  ║
╚═══════════════════════════════════════════════════════════╝
```

### View Error Logs
```bash
# Windows
notepad %USERPROFILE%\.nz-legislation-tool\logs\error-*.log

# macOS/Linux
cat ~/.nz-legislation-tool/logs/error-*.log
```

---

## 📖 Commands

### `search` - Search for legislation

```bash
# Basic search
nzlegislation search --query "health"

# Filter by type
nzlegislation search --query "health" --type act

# Filter by status
nzlegislation search --query "mental health" --status in-force

# Date range
nzlegislation search --query "health" --from 2020-01-01 --to 2024-12-31

# Output formats
nzlegislation search --query "health" --format json
nzlegislation search --query "health" --format csv

# Pagination
nzlegislation search --query "health" --limit 50 --offset 100
```

**Options:**
- `-q, --query <text>` - Search query (required)
- `-t, --type <type>` - Filter by type: act, bill, regulation, instrument
- `-s, --status <status>` - Filter by status: in-force, repealed, etc.
- `--from <date>` - Filter from date (YYYY-MM-DD)
- `--to <date>` - Filter to date (YYYY-MM-DD)
- `-l, --limit <number>` - Maximum results (default: 25, max: 100)
- `-o, --offset <number>` - Result offset for pagination
- `--format <format>` - Output format: table, json, csv (default: table)

### `get` - Get legislation by ID

```bash
# Get work details
nzlegislation get "act/2020/67"

# Get version history
nzlegislation get "act/2020/67" --versions

# JSON output
nzlegislation get "act/2020/67" --format json
```

**Arguments:**
- `<id>` - Work ID (e.g., `act/2020/67`)

**Options:**
- `--versions` - Show version history
- `--format <format>` - Output format: table, json, csv (default: table)

### `export` - Export search results to file

```bash
# Export to CSV
nzlegislation export --query "health" --output health.csv

# Export to JSON with metadata
nzlegislation export --query "health" --format json --output health.json --include-metadata

# Filtered export
nzlegislation export --query "mental health" --type act --status in-force --output mental_health_acts.csv
```

**Options:**
- `-q, --query <text>` - Search query (required)
- `-o, --output <file>` - Output file path (required)
- `-f, --format <format>` - Output format: csv, json (default: csv)
- `-t, --type <type>` - Filter by type
- `-s, --status <status>` - Filter by status
- `--from <date>` - Filter from date
- `--to <date>` - Filter to date
- `-l, --limit <number>` - Maximum results (default: 100)
- `--include-metadata` - Include export metadata for reproducibility

### `cite` - Generate citations

```bash
# NZMJ style (default)
nzlegislation cite "act/2020/67"

# BibTeX for LaTeX
nzlegislation cite "act/2020/67" --style bibtex

# RIS for reference managers
nzlegislation cite "act/2020/67" --style ris

# APA style
nzlegislation cite "act/2020/67" --style apa
```

**Arguments:**
- `<id>` - Work ID (e.g., `act/2020/67`)

**Options:**
- `-s, --style <style>` - Citation style: nzmj, bibtex, ris, apa (default: nzmj)

### `config` - View and manage configuration

```bash
# Show current configuration
nzlegislation config --show

# Set API key
nzlegislation config --key YOUR_API_KEY

# Clear all configuration
nzlegislation config --clear
```

**Options:**
- `--show` - Show current configuration
- `--key <key>` - Set API key
- `--clear` - Clear all configuration

---

## 📚 Examples

### Research Workflow Example

```bash
# 1. Search for health-related Acts
nzlegislation search --query "health" --type act --status in-force

# 2. Export results for analysis
nzlegislation export --query "health" --type act --output health_acts.csv --include-metadata

# 3. Get details on a specific Act
nzlegislation get "act/2020/67"

# 4. View version history
nzlegislation get "act/2020/67" --versions

# 5. Generate citation for paper
nzlegislation cite "act/2020/67" --style nzmj

# 6. Create bibliography
nzlegislation cite "act/1981/118" --style bibtex >> references.bib
nzlegislation cite "act/2020/67" --style bibtex >> references.bib
```

### Common Searches

```bash
# Mental Health Act
nzlegislation search --query "Mental Health Act" --type act

# Recent health legislation (2020-2024)
nzlegislation search --query "health" --from 2020-01-01 --to 2024-12-31

# All regulations
nzlegislation search --type regulation --limit 50

# Repealed legislation
nzlegislation search --query "health" --status repealed
```

---

## 🎨 Output Formats

### Table (Default)
```
┌────────────────────┬──────────────────────────────────────────┬────────┬──────────┬────────────┐
│ ID                 │ Title                                    │ Type   │ Status   │ Date       │
├────────────────────┼──────────────────────────────────────────┼────────┼──────────┼────────────┤
│ act/2020/67        │ Health Act 2020                          │ act    │ in-force │ 2020-11-15 │
│ act/1956/65        │ Health Act 1956                          │ act    │ repealed │ 1956-10-01 │
└────────────────────┴──────────────────────────────────────────┴────────┴──────────┴────────────┘

Total: 42 results (showing 25)
```

### JSON
```json
{
  "total": 42,
  "offset": 0,
  "limit": 25,
  "results": [
    {
      "id": "act/2020/67",
      "title": "Health Act 2020",
      "type": "act",
      "status": "in-force",
      "date": "2020-11-15"
    }
  ]
}
```

### CSV
```csv
id,title,shortTitle,type,status,date,url,versionCount
act/2020/67,Health Act 2020,Health Act 2020,act,in-force,2020-11-15,https://api.legislation.govt.nz/v0/works/act/2020/67,5
```

---

## 🔧 Configuration

### Configuration File Location

- **Windows:** `%APPDATA%\nz-legislation-tool\config.json`
- **macOS/Linux:** `~/.config/nz-legislation-tool/config.json`

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NZ_LEGISLATION_API_KEY` | Your API key | - |
| `NZ_LEGISLATION_BASE_URL` | API base URL | `https://api.legislation.govt.nz` |
| `NZ_LEGISLATION_TIMEOUT` | Request timeout (ms) | `30000` |

---

## ⚠️ Rate Limits

The NZ Legislation API has the following rate limits:

- **Daily Limit:** 10,000 requests per key per day
- **Burst Limit:** 2,000 requests per 5-minute period
- **Reset:** Daily limit resets at midnight local time

The CLI automatically handles rate limiting and will show helpful error messages if you exceed limits.

---

## 🐛 Troubleshooting

### "API key not configured"

**Solution:**
```bash
nzlegislation config --key YOUR_API_KEY
```

Or set environment variable:
```bash
export NZ_LEGISLATION_API_KEY=your_key_here
```

### "Authentication failed"

**Causes:**
- Invalid API key
- Expired API key

**Solution:**
1. Check your API key in the email from PCO
2. Re-run: `nzlegislation config --key YOUR_NEW_KEY`

### "Rate limit exceeded"

**Solution:**
- Wait 5 minutes for burst limit to reset
- Or wait until midnight for daily limit to reset
- Reduce request frequency

### "Resource not found"

**Causes:**
- Incorrect work ID format
- Work doesn't exist

**Solution:**
- Check work ID format (e.g., `act/2020/67`)
- Search first to find correct ID: `nzlegislation search --query "health"`

---

## 📦 Installation Options

### npm (Recommended)
```bash
npm install -g nz-legislation-tool
```

### npx (No install)
```bash
npx nz-legislation-tool search --query "health"
```

### From Source
```bash
git clone https://github.com/dylanmordaunt/nz-legislation-tool
cd nz-legislation-tool
npm install
npm run build
npm link  # Install globally
```

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
git clone https://github.com/dylanmordaunt/nz-legislation-tool
cd nz-legislation-tool
npm install
npm run dev  # Run in development mode
```

---

## 📄 License

Apache License 2.0 - See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- NZ Legislation API team (Parliamentary Counsel Office) for providing the API
- Victoria University of Wellington for research support
- Contributors and users providing feedback

---

## 📬 Support

- **Issues:** [GitHub Issues](https://github.com/dylanmordaunt/nz-legislation-tool/issues)
- **Discussions:** [GitHub Discussions](https://github.com/dylanmordaunt/nz-legislation-tool/discussions)
- **Email:** dylan.mordaunt@vuw.ac.nz
- **API Documentation:** https://api.legislation.govt.nz/docs/

---

<div align="center">

**Built with ❤️ for New Zealand research**

[npm](https://www.npmjs.com/package/nz-legislation-tool) | [GitHub](https://github.com/dylanmordaunt/nz-legislation-tool) | [API Docs](https://api.legislation.govt.nz/docs/)

</div>
