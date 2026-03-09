# Installation Guide - NZ Legislation CLI

## Quick Start

This document will help you install Rust and build the NZ Legislation CLI tool.

---

## Step 1: Install Rust

### Windows (Recommended: winget)

```powershell
# Using winget (Windows Package Manager)
winget install Rustlang.Rustup

# Using chocolatey
choco install rust

# Or download from: https://rustup.rs/
# Run rustup-init.exe and follow prompts
```

### Windows (Manual Install)

1. Download rustup-init.exe from https://rustup.rs
2. Run the installer
3. Choose "Default Installation"
4. Restart your terminal

### Verify Installation

```powershell
rustc --version
cargo --version
```

You should see output like:
```
rustc 1.75.0 (82e1608df 2023-12-21)
cargo 1.75.0 (1d8b05cdd 2023-11-20)
```

---

## Step 2: Clone the Repository

```powershell
# Navigate to your project directory
cd "C:\Users\60217257\OneDrive - Flinders\Project - 2026.03 - NZ Legislation"

# The nz-legislation directory should already exist with the code
cd nz-legislation
```

---

## Step 3: Build the Project

```powershell
# Debug build (faster, includes debug symbols)
cargo build

# Release build (optimized, smaller binary)
cargo build --release
```

The first build will download all dependencies (may take 5-10 minutes).

### Build Output

After building, the binary will be at:

```
# Debug build
.\target\debug\nzlegislation.exe

# Release build (recommended)
.\target\release\nzlegislation.exe
```

---

## Step 4: Configure API Key

```powershell
# Copy the example environment file
copy .env.example .env

# Edit .env file and add your API key
notepad .env
```

Add your API key from your VUW email:

```env
NZ_LEGISLATION_API_KEY=your_actual_api_key_here
```

**Alternatively**, set as environment variable:

```powershell
# Current session only
$env:NZ_LEGISLATION_API_KEY="your_api_key_here"

# Permanently (user-level)
[System.Environment]::SetEnvironmentVariable('NZ_LEGISLATION_API_KEY', 'your_api_key_here', 'User')
```

---

## Step 5: Test the Installation

```powershell
# Run the CLI with --help
.\target\release\nzlegislation.exe --help

# Test search (requires valid API key)
.\target\release\nzlegislation.exe search --query "health" --limit 5
```

---

## Step 6: Add to PATH (Optional)

### Option A: Copy to existing PATH directory

```powershell
# Copy to Windows directory (requires admin)
Copy-Item .\target\release\nzlegislation.exe C:\Windows\

# Or copy to user directory
Copy-Item .\target\release\nzlegislation.exe $HOME\.cargo\bin\
```

### Option B: Add target directory to PATH

1. Open System Properties → Environment Variables
2. Under "User variables", edit `Path`
3. Add: `C:\path\to\nz-legislation\target\release`
4. Click OK
5. Restart your terminal

### Option C: Use cargo install (when published)

```powershell
# Once published to crates.io
cargo install nz-legislation

# Binary will be at:
# $HOME\.cargo\bin\nzlegislation.exe
```

---

## Troubleshooting

### "cargo: command not found"

**Solution:** Restart your terminal or add Cargo to PATH:

```powershell
# Add to current session
$env:Path += ";$HOME\.cargo\bin"

# Add permanently via Environment Variables dialog
```

### Build fails with linker error

**Solution:** Install Visual Studio Build Tools:

1. Download from: https://visualstudio.microsoft.com/downloads/
2. Install "Desktop development with C++"
3. Restart terminal
4. Try building again

### Download timeouts during build

**Solution:** Use a mirror or increase timeout:

```powershell
# Set cargo to use a mirror
$env:CARGO_NET_GIT_FETCH_WITH_CLI="true"

# Or increase timeout
$env:CARGO_HTTP_TIMEOUT="60000"
```

### ".env file not found"

**Solution:** Create .env file:

```powershell
copy .env.example .env
# Edit .env and add your API key
```

---

## Updating

```powershell
# Pull latest changes
git pull

# Rebuild
cargo build --release
```

---

## Uninstalling

```powershell
# Remove binary
Remove-Item C:\Windows\nzlegislation.exe -ErrorAction SilentlyContinue
# Or wherever you installed it

# Uninstall Rust (optional)
rustup self uninstall
```

---

## Next Steps

Once installed:

1. **Read the README:** `.\README.md`
2. **Try basic commands:** `nzlegislation --help`
3. **Search for legislation:** `nzlegislation search --query "health"`
4. **Export data:** `nzlegislation export --query "health" --output health.csv`

---

## Getting Help

- **Documentation:** See `README.md`
- **Issues:** https://github.com/dylanmordaunt/nz-legislation/issues
- **Email:** dylan.mordaunt@vuw.ac.nz

---

## System Requirements

- **OS:** Windows 10+, macOS 10.15+, Linux
- **RAM:** 2GB minimum (4GB recommended for building)
- **Disk:** 500MB for Rust toolchain + dependencies
- **Network:** Internet connection for API access

---

Good luck! 🦀
