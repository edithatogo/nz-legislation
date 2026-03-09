# NZ Legislation API - Credentials & Setup Complete! ✅

## API Credentials Found!

Successfully retrieved from your VUW email (Andrew Jacombs, PCO, dated 11 Feb 2026):

### Authentication
- **API Key:** `nzlapi3f4dd302e30beef18911`
- **Base URL:** `https://api.legislation.govt.nz`
- **Documentation:** https://api.legislation.govt.nz/docs/

### Rate Limits (from PCO)
- **Daily Limit:** 10,000 requests per key per day
- **Reset Time:** Midnight local time
- **Burst Limit:** 2,000 requests per IP per 5-minute period
- **Burst Reset:** 5 minutes after hitting limit

### API Endpoints (v0)
```
GET /v0/works                    - Search for legislation
GET /v0/works/{work_id}          - Get specific work
GET /v0/works/{work_id}/versions - Get all versions of a work
GET /v0/versions/{version_id}    - Get specific version
```

### Authentication Method
API key can be provided in:
- Query parameter: `?apikey=nzlapi3f4dd302e30beef18911`
- Request header: `Authorization: Bearer nzlapi3f4dd302e30beef18911`

---

## Project Status

### ✅ Completed (Phase 1)

1. **Rust Project Structure**
   - Cargo.toml with all dependencies
   - Module structure (commands, client, models, output, config, error)
   - .env configuration with API key

2. **CLI Framework (Clap)**
   - Three commands: `search`, `get`, `export`
   - Global flags: --format, --api-key, --base-url, --verbose
   - Type-safe argument parsing

3. **HTTP Client (reqwest)**
   - Async HTTP with tokio
   - API key authentication (query parameter)
   - Automatic retry logic (exponential backoff)
   - Timeout handling
   - Rate limit detection (429)

4. **Data Models (serde)**
   - LegislationWork - FRBR work model
   - Version - Version model
   - LegislationVersion - Full version with content
   - SearchResults - Paginated search results
   - WorkType, LegislationStatus enums

5. **Output Formatting**
   - Beautiful colored tables (comfy-table)
   - JSON output (pretty-printed)
   - CSV export for spreadsheets
   - Status-based color coding

6. **Error Handling (thiserror)**
   - 10+ specific error types
   - Clear error messages
   - Retryable error detection

### 📋 Configuration Files Created

- `.env` - API credentials (with your actual API key)
- `.env.example` - Template for sharing
- `Cargo.toml` - Project dependencies
- `README.md` - User documentation
- `INSTALL.md` - Installation guide
- `CONTRIBUTING.md` - Contributor guidelines
- `STATUS.md` - Project status

---

## Next Steps

### 1. Install Rust (Required)

```powershell
# Windows (PowerShell)
winget install Rustlang.Rustup

# Restart terminal after installation
```

### 2. Build the Project

```powershell
cd "C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\nz-legislation"

# Build in release mode
cargo build --release
```

### 3. Test the CLI

```powershell
# View help
.\target\release\nzlegislation.exe --help

# Test search
.\target\release\nzlegislation.exe search --query "health" --limit 5

# Get specific legislation
.\target\release\nzlegislation.exe get "act/2020/67"

# Export to CSV
.\target\release\nzlegislation.exe export --query "health" --output health.csv
```

### 4. Provide Feedback to PCO

From the PCO email:
> "Please let us know what you think: your feedback will inform future development"

They're particularly interested in:
- What you plan to build with their API
- What the API doesn't allow you to do that you'd like
- Annoying aspects that could be improved
- Core conceptual design feedback

---

## API Contact Information

**Technical Lead:** Andrew Jacombs  
**Organization:** Parliamentary Counsel Office (PCO)  
**Email:** andrew.jacombs@pco.govt.nz  
**Phone:** +64 22 165 6920  

**Website:**
- https://www.pco.govt.nz
- https://www.legislation.govt.nz
- https://policy-to-law.pco.govt.nz

---

## File Structure

```
nz-legislation/
├── src/
│   ├── main.rs           # CLI entry point (Clap)
│   ├── commands/
│   │   ├── mod.rs
│   │   ├── search.rs     # Search command
│   │   ├── get.rs        # Get command
│   │   └── export.rs     # Export command
│   ├── client.rs         # HTTP API client (reqwest)
│   ├── config.rs         # Configuration (dotenvy)
│   ├── error.rs          # Error types (thiserror)
│   ├── models.rs         # Data models (serde)
│   └── output.rs         # Output formatting (tables, CSV, JSON)
├── Cargo.toml            # Dependencies
├── .env                  # API credentials ✅ CONFIGURED
├── .env.example          # Config template
├── README.md             # Documentation
├── INSTALL.md            # Installation guide
├── CONTRIBUTING.md       # Contributor guide
└── STATUS.md             # Project status
```

---

## Key Design Decisions

### FRBR Model
The NZ Legislation API uses the FRBR (Functional Requirements for Bibliographic Records) model:
- **Work:** An Act, Bill, or legislative instrument
- **Version:** A specific version (as-at date, reprint, original)
- **Format:** XML, PDF, HTML

### API Version
Currently using **API v0** (beta):
> "We have made version 0 of our API available now for developers to test and provide us feedback."

### Authentication
Using **query parameter** authentication (simpler for CLI):
```
GET /v0/works?q=health&apikey=nzlapi3f4dd302e30beef18911
```

---

## Testing Checklist

Once Rust is installed, test:

- [ ] `cargo build --release` completes without errors
- [ ] `nzlegislation --help` shows help
- [ ] `nzlegislation search --query "health"` returns results
- [ ] `nzlegislation search --type act` filters by type
- [ ] `nzlegislation get "act/2020/67"` retrieves specific act
- [ ] `nzlegislation get "act/2020/67" --versions` shows version history
- [ ] `nzlegislation export --query "health" --output test.csv` exports data
- [ ] Rate limiting works (try many rapid requests)
- [ ] Error handling works (try invalid API key)

---

## Future Enhancements (Not Yet Implemented)

- [ ] Caching layer (reduce API calls)
- [ ] Client-side rate limiting
- [ ] Unit tests
- [ ] Integration tests
- [ ] CI/CD pipeline
- [ ] MCP server (if adoption increases)
- [ ] Plugin architecture
- [ ] PowerShell module

---

## Email Reference

**From:** Andrew Jacombs <andrew.jacombs@pco.govt.nz>  
**To:** Dylan Mordaunt  
**Date:** 11 Feb 2026 12:23 PM  
**Subject:** New Legislation API available now  

> "Thank you for filling out our survey or contacting us to express your interest in legislative data. We're excited to share with you today version 0 of the New Zealand Legislation API."

Full email content extracted and saved to your project directory.

---

**Ready to build! Install Rust and run `cargo build --release`** 🦀
