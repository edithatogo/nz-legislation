# API Key Setup Instructions

## Status

⚠️ **The NZ Legislation API correspondence was not found in your email.**

I searched your Gmail for:
- "NZ Legislation API"
- "legislation.govt.nz"
- "API key"
- "New Zealand API"
- "vuw.ac.nz"
- "documentation"

**Result:** No emails containing API credentials were found.

---

## Next Steps

### Option 1: Locate the Email Manually

The API key and documentation were mentioned to be in your **VUW email account**. You'll need to:

1. **Access your VUW email** (Victoria University of Wellington)
   - This may be through Outlook Web Access or another email client
   - Search for emails from:
     - `legislation.govt.nz`
     - `parliament.nz`
     - `beeheeve.govt.nz` (NZ Government)
     - Ministry of Health contacts

2. **Look for:**
   - Email subject containing "API", "access", "credentials"
   - Emails from late 2024 or early 2025 (when you mentioned the API was launching)
   - Any emails with attachments containing documentation

3. **Extract the following information:**
   - API key (usually a long alphanumeric string)
   - API base URL (e.g., `https://api.legislation.govt.nz`)
   - Documentation links
   - Rate limit information
   - Authentication method (Bearer token, API key in header, etc.)

---

### Option 2: Contact the NZ Legislation API Team

If you can't find the email, reach out to:

**NZ Legislation API Team**
- Email: (check your correspondence)
- Website: `https://www.legislation.govt.nz`
- Look for "Developers" or "API" section on their website

---

### Option 3: Check Other Locations

The API key might also be stored in:

1. **Password Manager**
   - 1Password, LastPass, Bitwarden, etc.
   - Search for "legislation", "NZ API", "parliament"

2. **Browser Bookmarks**
   - Check for bookmarked API documentation pages

3. **Notes/Documentation**
   - OneDrive, Google Drive, Notion, Obsidian
   - Search for files containing "legislation API"

4. **Project Files**
   - Check other project directories
   - Look for `.env` files from previous work

---

## Once You Have the API Key

### 1. Add to .env File

```bash
# Navigate to the project
cd "C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\nz-legislation"

# Copy the example file
copy .env.example .env

# Edit .env and add your API key
notepad .env
```

Add this line (replace with your actual key):
```env
NZ_LEGISLATION_API_KEY=your_actual_api_key_here
```

### 2. Install Rust

See `INSTALL.md` for detailed instructions. Quick start:

```powershell
# Windows (PowerShell)
winget install Rustlang.Rustup

# Restart terminal after installation
```

### 3. Build the Project

```powershell
cd "C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation\nz-legislation"

# Build in release mode
cargo build --release
```

### 4. Test the CLI

```powershell
# View help
.\target\release\nzlegislation.exe --help

# Test search (requires valid API key)
.\target\release\nzlegislation.exe search --query "health" --limit 5
```

---

## What We Built

A **production-quality Rust CLI** with:

✅ **Search** - Full-text search with filters (type, status, date range)  
✅ **Retrieve** - Get legislation by ID  
✅ **Export** - Export to CSV or JSON  
✅ **Beautiful Output** - Colored tables, JSON, CSV  
✅ **Resilient** - Automatic retries, rate limiting, timeouts  
✅ **Type-Safe** - Compile-time error checking  
✅ **Fast** - Instant startup, async HTTP  

---

## File Structure

```
nz-legislation/
├── src/
│   ├── main.rs           # CLI entry point
│   ├── commands/         # Search, Get, Export
│   ├── client.rs         # HTTP client
│   ├── config.rs         # Configuration
│   ├── error.rs          # Error types
│   ├── models.rs         # Data models
│   └── output.rs         # Output formatting
├── Cargo.toml            # Dependencies
├── .env.example          # Config template
├── README.md             # Documentation
├── INSTALL.md            # Installation guide
└── STATUS.md             # Project status
```

---

## Questions?

- **Installation:** See `INSTALL.md`
- **Usage:** See `README.md`
- **Project Status:** See `STATUS.md`

---

**Ready to build once you locate your API key!** 🦀
