# NZ Legislation CLI

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Rust](https://img.shields.io/badge/Rust-1.75+-orange.svg)](https://www.rust-lang.org)
[![Status](https://img.shields.io/badge/status-alpha-yellow.svg)](https://github.com/dylanmordaunt/nz-legislation)

**A robust, type-safe command-line tool for accessing New Zealand legislation data.**

Built with Rust for performance, safety, and reliability.

---

## Features

- 🔍 **Search** - Full-text search with filters (type, status, date range)
- 📄 **Retrieve** - Get legislation by ID with metadata
- 📤 **Export** - Export results to CSV or JSON
- 🎨 **Output Formats** - Beautiful tables, JSON, or CSV
- ⚡ **Fast** - Instant startup, async HTTP with connection pooling
- 🔒 **Safe** - Type-safe, compile-time error checking
- 🔄 **Resilient** - Automatic retries, rate limiting, timeout handling

---

## Installation

### Prerequisites

Install Rust from [rustup.rs](https://rustup.rs):

```bash
# Windows (PowerShell)
winget install Rustlang.Rustup

# macOS (Homebrew)
brew install rustup

# Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Build from Source

```bash
# Clone the repository
git clone https://github.com/dylanmordaunt/nz-legislation
cd nz-legislation

# Build in release mode
cargo build --release

# The binary will be at:
# ./target/release/nzlegislation
```

### Add to PATH (Optional)

```bash
# Copy binary to your PATH
cp target/release/nzlegislation ~/.local/bin/  # Linux/macOS
copy target\release\nzlegislation.exe C:\Windows\  # Windows
```

---

## Quick Start

### 1. Set Your API Key

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your API key
# Or set as environment variable:
export NZ_LEGISLATION_API_KEY=your_api_key_here  # Linux/macOS
set NZ_LEGISLATION_API_KEY=your_api_key_here  # Windows
```

### 2. Search for Legislation

```bash
# Basic search
nzlegislation search --query "health act"

# With filters
nzlegislation search --query "health" --type act --status in-force

# JSON output
nzlegislation search --query "mental health" --format json

# CSV output
nzlegislation search --query "health" --format csv
```

### 3. Get Legislation by ID

```bash
# Get specific legislation
nzlegislation get 2020-67

# With JSON output
nzlegislation get 2020-67 --format json
```

### 4. Export Results

```bash
# Export to CSV
nzlegislation export --query "health" --output health_legislation.csv

# Export to JSON
nzlegislation export --query "health" --format json --output health_legislation.json
```

---

## Commands

### `search` - Search for legislation

```bash
nzlegislation search [OPTIONS] --query <QUERY>

Options:
  -q, --query <QUERY>      Search query (required)
  -t, --type <TYPE>        Filter by type (act, regulation, bill, instrument)
  -s, --status <STATUS>    Filter by status (in-force, repealed, etc.)
      --from <DATE>        Filter from date (YYYY-MM-DD)
      --to <DATE>          Filter to date (YYYY-MM-DD)
  -l, --limit <LIMIT>      Maximum results (default: 25, max: 100)
  -o, --offset <OFFSET>    Result offset for pagination
  -f, --format <FORMAT>    Output format (table, json, csv)
  -v, --verbose            Enable verbose output
```

### `get` - Get legislation by ID

```bash
nzlegislation get [OPTIONS] <ID>

Arguments:
  <ID>  Legislation ID (required)

Options:
  -f, --format <FORMAT>    Output format (table, json, csv)
  -v, --verbose            Enable verbose output
```

### `export` - Export search results to file

```bash
nzlegislation export [OPTIONS] --query <QUERY> --output <FILE>

Options:
  -q, --query <QUERY>      Search query (required)
  -o, --output <FILE>      Output file path (required)
  -f, --format <FORMAT>    Output format (json, csv) [default: csv]
  -t, --type <TYPE>        Filter by type
  -s, --status <STATUS>    Filter by status
  -l, --limit <LIMIT>      Maximum results to export (default: 1000)
```

---

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NZ_LEGISLATION_API_KEY` | API key (required) | - |
| `NZ_LEGISLATION_BASE_URL` | API base URL | `https://api.legislation.govt.nz` |
| `NZ_LEGISLATION_TIMEOUT` | Request timeout (seconds) | `30` |
| `NZ_LEGISLATION_MAX_RETRIES` | Maximum retry attempts | `3` |
| `NZ_LEGISLATION_RATE_LIMIT` | Requests per minute | `60` |

### .env File

Create a `.env` file in the project directory:

```env
NZ_LEGISLATION_API_KEY=your_api_key_here
NZ_LEGISLATION_TIMEOUT=30
```

---

## Examples

### Search for all health-related Acts

```bash
nzlegislation search --query "health" --type act --status in-force --limit 50
```

### Export all regulations to CSV

```bash
nzlegislation export --query "" --type regulation --output regulations.csv --limit 1000
```

### Get legislation with JSON output

```bash
nzlegislation get 2020-67 --format json
```

### Search with date range

```bash
nzlegislation search --query "mental health" --from 2020-01-01 --to 2024-12-31
```

---

## Development

### Build

```bash
# Debug build
cargo build

# Release build (optimized)
cargo build --release
```

### Run Tests

```bash
cargo test
```

### Format Code

```bash
cargo fmt
```

### Lint

```bash
cargo clippy -- -D warnings
```

---

## Error Handling

The CLI handles common errors gracefully:

- **Authentication errors** - Invalid or missing API key
- **Rate limiting** - Automatic retry with backoff
- **Timeouts** - Configurable timeout with retries
- **Network errors** - Automatic retry for transient failures

---

## Output Formats

### Table (Default)

Beautiful, color-coded tables with status indicators:

```
┌────────────┬────────────────────────┬───────┬──────────┬────────────┐
│ ID         │ Title                  │ Type  │ Status   │ Date       │
├────────────┼────────────────────────┼───────┼──────────┼────────────┤
│ 2020-67    │ Health Act 2020        │ Act   │ InForce  │ 2020-11-15 │
│ 1956-65    │ Health Act 1956        │ Act   │ Repealed │ 1956-10-01 │
└────────────┴────────────────────────┴───────┴──────────┴────────────┘
```

### JSON

Structured JSON for programmatic use:

```bash
nzlegislation search --query "health" --format json
```

### CSV

CSV for spreadsheet analysis:

```bash
nzlegislation search --query "health" --format csv
```

---

## License

Apache License 2.0 - See [LICENSE](LICENSE) for details.

---

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

---

## Support

- **Issues:** [GitHub Issues](https://github.com/dylanmordaunt/nz-legislation/issues)
- **Discussions:** [GitHub Discussions](https://github.com/dylanmordaunt/nz-legislation/discussions)
- **Email:** dylan.mordaunt@vuw.ac.nz

---

<div align="center">

**Built with ❤️ in Rust for New Zealand research**

</div>
