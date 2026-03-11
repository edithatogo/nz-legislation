---
sidebar_position: 1
---

# Installation

This guide covers all installation options for the NZ Legislation Tool.

## Prerequisites

Before installing, ensure you have:

- **Node.js** 18+ (LTS versions: 18, 20, 22)
- **npm** 10+ or **pnpm** 8+
- **NZ Legislation API Key** (free registration required)

### Check Your Environment

```bash
# Check Node.js version (must be 18+)
node --version

# Check npm version
npm --version
```

## Installation Options

### Option 1: Global Installation (Recommended)

Install the tool globally for system-wide access:

```bash
npm install -g nz-legislation-tool
```

**After installation:**

```bash
# Verify installation
nzlegislation --version

# Expected output: 1.1.0 (or latest version)
```

### Option 2: Run Without Installation

Use `npx` to run without installing:

```bash
npx nz-legislation-tool search --query "health"
```

**Pros:**
- No installation required
- Always uses latest version

**Cons:**
- Slower startup (downloads each time)
- Requires internet connection

### Option 3: Local Project Installation

Install as a project dependency:

```bash
# In your project directory
npm install nz-legislation-tool

# Use with npx
npx nzlegislation search --query "health"

# Or add to package.json scripts
{
  "scripts": {
    "legislation": "nzlegislation"
  }
}
```

## Platform-Specific Notes

### Windows

**PowerShell:**
```powershell
# May need to run PowerShell as Administrator
npm install -g nz-legislation-tool
```

**If you encounter permission errors:**
```powershell
# Set npm global prefix to user directory
npm config set prefix $env:APPDATA\npm

# Add to PATH: %APPDATA%\npm
```

### macOS

**If you encounter permission errors:**
```bash
# Option 1: Use sudo (not recommended)
sudo npm install -g nz-legislation-tool

# Option 2: Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

### Linux

**Ubuntu/Debian:**
```bash
# Ensure Node.js is installed
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install globally
npm install -g nz-legislation-tool
```

## Troubleshooting Installation

### Error: EACCES permission denied

**Cause:** npm doesn't have permission to write to global directory

**Solution:**
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc  # or ~/.zshrc
source ~/.bashrc
npm install -g nz-legislation-tool
```

### Error: Command not found

**Cause:** Global npm bin directory not in PATH

**Solution:**
```bash
# Find npm global bin directory
npm bin -g

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH=$(npm bin -g):$PATH
```

### Error: Node version incompatible

**Cause:** Node.js version is below 18

**Solution:**
```bash
# Check current version
node --version

# Update Node.js (use nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

## Next Steps

After installation:

1. [Configure API Key](./configuration.md) - Set up your API credentials
2. [Quick Start](./quick-start.md) - Run your first search
3. [User Guide](./user-guide/searching.md) - Learn all features

---

**Need Help?** Check the [FAQ](./troubleshooting/faq.md) or [Report an Issue](https://github.com/edithatogo/nz-legislation/issues).
