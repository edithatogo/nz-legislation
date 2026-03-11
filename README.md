# NZ Legislation Tool

[![npm](https://img.shields.io/npm/v/nz-legislation-tool)](https://www.npmjs.com/package/nz-legislation-tool)
[![npm](https://img.shields.io/npm/dm/nz-legislation-tool)](https://www.npmjs.com/package/nz-legislation-tool)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![CI/CD](https://github.com/edithatogo/nz-legislation/actions/workflows/ci.yml/badge.svg)](https://github.com/edithatogo/nz-legislation/actions/workflows/ci.yml)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/edithatogo/nz-legislation/graphs/commit-activity)

**Search, retrieve, and cite New Zealand legislation in seconds.**

A fast, friendly command-line tool for researchers, legal professionals, and anyone working with NZ legislation. Get your research done faster—with less copying and pasting.

**Package links:** [npm package](https://www.npmjs.com/package/nz-legislation-tool) · [GitHub repository](https://github.com/edithatogo/nz-legislation)

---

## 📦 Package Registries

- **Primary npm package:** [`nz-legislation-tool`](https://www.npmjs.com/package/nz-legislation-tool)
- **GitHub Packages mirror:** `@edithatogo/nz-legislation-tool`

The GitHub repository "Packages" area is populated by GitHub Packages publishes, not by the public npmjs.com listing. This repository includes a workflow to publish a scoped GitHub Packages mirror so the repo can show a package entry there as well.

---

## 🚪 Choose Your Interface

### CLI

Use the CLI if you want direct terminal access for search, retrieval, export, and citation.

```bash
npm install -g nz-legislation-tool
nzlegislation search --query "health act"
```

### MCP Server

Use the MCP server if you want to connect the tool to an AI assistant or tool-calling environment.

```bash
npm install -g nz-legislation-tool
nzlegislation-mcp
```

Example MCP command configuration:

```json
{
  "command": "nzlegislation-mcp",
  "env": {
    "NZ_LEGISLATION_API_KEY": "your-api-key"
  }
}
```

---

## ✨ What You Can Do

- 🔍 **Search** - Find legislation by keyword, type, status, or date range
- 📄 **Retrieve** - Get full details and version history by ID
- 📤 **Export** - Download to CSV or JSON for analysis
- 📚 **Cite** - Generate citations in NZMJ, BibTeX, RIS, or APA style
- 🤖 **AI Integration** - Connect to AI assistants for automated research
- 🎨 **Beautiful Output** - Clean tables, formatted JSON, ready-to-use CSV
- 🔒 **Secure** - Your API key stays safe on your machine
- 📊 **Research-Ready** - Reproducible exports with full metadata
- 🧪 **Battle-Tested** - 43+ automated tests catch issues before you do

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Your API Key (2 minutes)

1. Visit [https://api.legislation.govt.nz/docs/](https://api.legislation.govt.nz/docs/)
2. Sign up for a free API key
3. Copy the key from your email

### Step 2: Install the Tool (1 minute)

**Option A: Try without installing (recommended for first time)**

```bash
npx nz-legislation-tool search --query "health"
```

**Option B: Install globally (recommended for regular use)**

```bash
npm install -g nz-legislation-tool
```

### Step 3: Set Your API Key (1 minute)

```bash
nzlegislation config --key YOUR_API_KEY_HERE
```

### Step 4: Your First Search (30 seconds)

```bash
nzlegislation search --query "health act"
```

**You should see:**

```
┌────────────────────┬──────────────────────────────────────────┬────────┬──────────┬────────────┐
│ ID                 │ Title                                    │ Type   │ Status   │ Date       │
├────────────────────┼──────────────────────────────────────────┼────────┼──────────┼────────────┤
│ act/2020/67        │ Health Act 2020                          │ act    │ in-force │ 2020-11-15 │
│ act/1956/65        │ Health Act 1956                          │ act    │ repealed │ 1956-10-01 │
└────────────────────┴──────────────────────────────────────────┴────────┴──────────┴────────────┘

Total: 42 results (showing 25)
```

🎉 **That's it! You're ready to go.**

---

## 📋 What You Need

- **Node.js** 18.0 or later ([Download here](https://nodejs.org/))
- **NZ Legislation API Key** (Free - [get yours](https://api.legislation.govt.nz/docs/))

---

## 📖 Commands (With Examples)

### `search` - Find Legislation

Search the entire NZ legislation database.

```bash
# Basic search
nzlegislation search --query "health"

# Filter by type (act, bill, regulation, instrument)
nzlegislation search --query "health" --type act

# Filter by status (in-force, repealed, etc.)
nzlegislation search --query "mental health" --status in-force

# Search by date range
nzlegislation search --query "health" --from 2020-01-01 --to 2024-12-31

# Export results to CSV
nzlegislation search --query "health" --format csv --output results.csv
```

**All options:**

| Option     | Short | Description                               | Default |
| ---------- | ----- | ----------------------------------------- | ------- |
| `--query`  | `-q`  | Search query (required)                   | -       |
| `--type`   | `-t`  | Filter: act, bill, regulation, instrument | -       |
| `--status` | `-s`  | Filter: in-force, repealed, etc.          | -       |
| `--from`   | -     | From date (YYYY-MM-DD)                    | -       |
| `--to`     | -     | To date (YYYY-MM-DD)                      | -       |
| `--limit`  | `-l`  | Max results (1-100)                       | `25`    |
| `--offset` | `-o`  | For pagination                            | `0`     |
| `--format` | `-f`  | Output: table, json, csv                  | `table` |

👉 **Pro tip:** Use quotes for multi-word searches: `"Mental Health Act"`

---

### `get` - View Specific Legislation

Get full details for a specific Act or regulation.

```bash
# Get details by ID
nzlegislation get "act/2020/67"

# Include version history
nzlegislation get "act/2020/67" --versions

# Output as JSON
nzlegislation get "act/2020/67" --format json
```

**Where do I find the ID?**

Run a search first, then copy the ID from the results:

```bash
nzlegislation search --query "health act"
# Copy "act/2020/67" from the results
```

---

### `export` - Download Results to File

Perfect for analysis in Excel, R, or Python.

```bash
# Export to CSV (most common)
nzlegislation export --query "health" --output health.csv

# Export to JSON (for developers)
nzlegislation export --query "health" --format json --output health.json

# Filtered export (e.g., only active Acts)
nzlegislation export --query "mental health" --type act --status in-force --output mental_health_acts.csv

# Include metadata for reproducibility
nzlegislation export --query "health" --output health.csv --include-metadata
```

**All options:**

| Option               | Short | Description                 | Default |
| -------------------- | ----- | --------------------------- | ------- |
| `--query`            | `-q`  | Search query (required)     | -       |
| `--output`           | `-o`  | Output file path (required) | -       |
| `--format`           | `-f`  | Output: csv, json           | `csv`   |
| `--type`             | `-t`  | Filter by type              | -       |
| `--status`           | `-s`  | Filter by status            | -       |
| `--from`             | -     | From date                   | -       |
| `--to`               | -     | To date                     | -       |
| `--limit`            | `-l`  | Max results                 | `100`   |
| `--include-metadata` | -     | Add export metadata         | `false` |

---

### `cite` - Generate Citations

Create citations for papers, theses, or reports.

```bash
# NZMJ style (default - for New Zealand Medical Journal)
nzlegislation cite "act/2020/67"

# BibTeX (for LaTeX papers)
nzlegislation cite "act/2020/67" --style bibtex

# RIS (for EndNote, Mendeley, Zotero)
nzlegislation cite "act/2020/67" --style ris

# APA style
nzlegislation cite "act/2020/67" --style apa
```

**Build a bibliography:**

```bash
# Append multiple citations to a .bib file
nzlegislation cite "act/1981/118" --style bibtex >> references.bib
nzlegislation cite "act/2020/67" --style bibtex >> references.bib
```

---

### `config` - Manage Settings

View and update your configuration.

```bash
# Show current settings
nzlegislation config --show

# Update API key
nzlegislation config --key YOUR_NEW_KEY

# Clear all settings (start fresh)
nzlegislation config --clear
```

---

## 🎯 Real-World Examples

### Example 1: Researcher Rachel's Workflow

Rachel is writing a paper on health policy reform.

```bash
# 1. Find all active health Acts
nzlegislation search --query "health" --type act --status in-force

# 2. Export for analysis in Excel
nzlegislation export --query "health" --type act --output health_acts.csv

# 3. Get details on a specific Act
nzlegislation get "act/2020/67"

# 4. Generate citation for her paper
nzlegislation cite "act/2020/67" --style nzmj
```

### Example 2: Developer Dan's Integration

Dan is building a research dashboard.

```bash
# Get data in JSON format for his app
nzlegislation search --query "health" --format json --limit 100

# Parse in Node.js:
const results = JSON.parse(output);
console.log(`Found ${results.total} results`);
```

### Example 3: Student Sam's Assignment

Sam needs legislation for a coursework essay.

```bash
# Search for the Mental Health Act
nzlegislation search --query "Mental Health Act" --type act

# Get the full details
nzlegislation get "act/1992/100"

# Generate APA citation for the bibliography
nzlegislation cite "act/1992/100" --style apa
```

### Example 4: Administrator Alex's Team Setup

Alex is deploying for a research team.

```bash
# Install on shared server
npm install -g nz-legislation-tool

# Configure API key for the team
nzlegislation config --key $TEAM_API_KEY

# Test it works
nzlegislation search --query "test" --limit 1

# Set up monitoring (check rate limits)
nzlegislation config --show
```

---

## 🎨 Output Formats

### Table Format (Default)

Beautiful, readable tables right in your terminal:

```
┌────────────────────┬──────────────────────────────────────────┬────────┬──────────┬────────────┐
│ ID                 │ Title                                    │ Type   │ Status   │ Date       │
├────────────────────┼──────────────────────────────────────────┼────────┼──────────┼────────────┤
│ act/2020/67        │ Health Act 2020                          │ act    │ in-force │ 2020-11-15 │
│ act/1956/65        │ Health Act 1956                          │ act    │ repealed │ 1956-10-01 │
└────────────────────┴──────────────────────────────────────────┴────────┴──────────┴────────────┘
```

### JSON Format

For developers and automation:

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

### CSV Format

Ready for Excel, R, Python, or SPSS:

```csv
id,title,shortTitle,type,status,date,url,versionCount
act/2020/67,Health Act 2020,Health Act 2020,act,in-force,2020-11-15,https://api.legislation.govt.nz/v0/works/act/2020/67,5
```

---

## ⚠️ Rate Limits

The NZ Legislation API has fair use limits:

| Limit     | Value                        | Reset               |
| --------- | ---------------------------- | ------------------- |
| **Daily** | 10,000 requests              | Midnight local time |
| **Burst** | 2,000 requests per 5 minutes | Rolling window      |

**Don't worry**—the CLI automatically handles rate limiting. If you hit a limit, you'll see a friendly message telling you when to try again.

---

## 🐛 Troubleshooting

### "API key not configured"

**Quick fix:**

```bash
nzlegislation config --key YOUR_API_KEY
```

**Still not working?** Check if it's set correctly:

```bash
nzlegislation config --show
```

---

### "Authentication failed"

**Common causes:**

- Typo in the API key
- API key expired
- Wrong key copied

**Fix it:**

1. Check your email for the original API key
2. Re-run: `nzlegislation config --key YOUR_KEY`
3. Test: `nzlegislation search --query "test"`

---

### "Rate limit exceeded"

**What happened:** You've made too many requests too quickly.

**Fix it:**

- Wait 5 minutes for the burst limit to reset
- Or wait until midnight for the daily limit to reset

**Prevent it:**

- Add pauses between bulk requests
- Use `--limit` to reduce batch sizes

---

### "Resource not found"

**Common causes:**

- Wrong ID format (should be like `act/2020/67`)
- The legislation doesn't exist

**Fix it:**

1. Search first to find the correct ID:
   ```bash
   nzlegislation search --query "health"
   ```
2. Copy the exact ID from results
3. Try again with the correct ID

---

### "Network error" or "Timeout"

**What happened:** Can't connect to the API.

**Fix it:**

1. Check your internet connection
2. Try the API website directly: https://api.legislation.govt.nz
3. If the API is down, wait and try again later

**Still stuck?** Check the [API status](https://api.legislation.govt.nz/) or [contact support](#support).

---

## 📦 Installation Options

### Option 1: npm (Recommended for regular use)

```bash
npm install -g nz-legislation-tool
```

**Pros:** Use anywhere, no need to type `npx`  
**Cons:** Takes up disk space (~50MB)

---

### Option 2: npx (Try before installing)

```bash
npx nz-legislation-tool search --query "health"
```

**Pros:** No installation, try before committing  
**Cons:** Slower (downloads each time), need to type `npx`

---

### Option 3: From Source (For contributors)

```bash
git clone https://github.com/edithatogo/nz-legislation-tool
cd nz-legislation-tool
npm install
npm run build
npm link  # Install globally
```

**Pros:** Latest features, can contribute changes  
**Cons:** Requires build step, for advanced users

---

## 🤝 Contributing

We'd love your help! This project is open source and welcomes contributions from everyone.

**Ways to contribute:**

- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 💻 Submit code fixes

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get started.

### Quick Development Setup

```bash
# Clone the repo
git clone https://github.com/edithatogo/nz-legislation-tool
cd nz-legislation-tool

# Install dependencies
npm install

# Run in development mode
npm run dev -- search --query "health"

# Run tests
npm test
```

---

## 📚 Documentation

Need more help? Check out these guides:

- **[User Guide](docs/user-guide/index.md)** - Detailed command reference
- **[FAQ](docs/user-guide/faq.md)** - Common questions answered
- **[Troubleshooting](docs/user-guide/troubleshooting.md)** - Step-by-step fixes
- **[Developer Guide](docs/developer-guide/index.md)** - For contributors
- **[API Reference](docs/developer-guide/api-reference.md)** - Technical details

---

## 🤖 Automation & Maintenance

This repository runs itself with minimal manual intervention:

| Automation                | Frequency    | What It Does               |
| ------------------------- | ------------ | -------------------------- |
| 🔒 **Security Audit**     | Weekly       | Scans for vulnerabilities  |
| ✨ **Code Quality**       | Every commit | Linting, type checking     |
| 📦 **Dependency Updates** | Weekly       | Auto-updates safe packages |
| 🧪 **Tests**              | Every commit | 43+ automated tests        |
| ⚡ **Benchmarks**         | Weekly       | Performance tracking       |
| 🗑️ **Stale Cleanup**      | Daily        | Closes inactive issues     |

**Manual maintenance:** ~0 hours/month ✅

See [MAINTENANCE_GUIDE.md](MAINTENANCE_GUIDE.md) for details.

---

## 🙏 Acknowledgments

- **NZ Legislation API team** (Parliamentary Counsel Office) for providing the API
- **Victoria University of Wellington** for research support
- **All contributors** who make this project better

---

## 📬 Support

Need help? We're here for you.

- 🐛 **Found a bug?** [Open an issue](https://github.com/edithatogo/nz-legislation-tool/issues)
- 💬 **Have a question?** [Start a discussion](https://github.com/edithatogo/nz-legislation-tool/discussions)
- 📧 **Email:** dylan.mordaunt@vuw.ac.nz
- 📖 **API docs:** https://api.legislation.govt.nz/docs/

**Response time:** We aim to respond within 2 business days.

---

## 📄 License

Apache License 2.0 - See [LICENSE](LICENSE) for details.

**TL;DR:** Free to use, modify, and distribute. Just give credit and don't hold us liable.

---

<div align="center">

**Built with ❤️ for New Zealand researchers, by researchers.**

[npm](https://www.npmjs.com/package/nz-legislation-tool) ·
[GitHub](https://github.com/edithatogo/nz-legislation) ·
[API Docs](https://api.legislation.govt.nz/docs/) ·
[Documentation](docs/user-guide/index.md)

</div>
