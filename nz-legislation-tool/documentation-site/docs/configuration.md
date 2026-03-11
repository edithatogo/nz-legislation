---
sidebar_position: 2
---

# Configuration

This guide covers all configuration options for the NZ Legislation Tool.

## Quick Setup

### Set Your API Key

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
  Cache: enabled
```

## Configuration Options

### API Key

**Required:** Yes  
**Default:** None  
**Environment Variable:** `NZ_LEGISLATION_API_KEY`

```bash
# Set via command
nzlegislation config --key YOUR_API_KEY

# Set via environment variable
export NZ_LEGISLATION_API_KEY=your_api_key_here

# Check if configured
nzlegislation config --show
```

### Base URL

**Required:** No  
**Default:** `https://api.legislation.govt.nz`  
**Environment Variable:** `NZ_LEGISLATION_BASE_URL`

```bash
# Custom base URL (for testing)
nzlegislation config --base-url https://api-staging.legislation.govt.nz
```

### Timeout

**Required:** No  
**Default:** `30000` (30 seconds)  
**Environment Variable:** `NZ_LEGISLATION_TIMEOUT`

```bash
# Increase timeout for slow connections
nzlegislation config --timeout 60000
```

### Cache

**Required:** No  
**Default:** `enabled`

```bash
# Disable caching
nzlegislation config --cache false

# Clear cache
nzlegislation cache --clear
```

## Environment Variables

All configuration options can be set via environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `NZ_LEGISLATION_API_KEY` | Your API key | None |
| `NZ_LEGISLATION_BASE_URL` | API base URL | `https://api.legislation.govt.nz` |
| `NZ_LEGISLATION_TIMEOUT` | Request timeout (ms) | `30000` |

### Setting Environment Variables

**Linux/macOS:**
```bash
export NZ_LEGISLATION_API_KEY=your_api_key_here
export NZ_LEGISLATION_TIMEOUT=60000
```

**Windows (PowerShell):**
```powershell
$env:NZ_LEGISLATION_API_KEY="your_api_key_here"
$env:NZ_LEGISLATION_TIMEOUT="60000"
```

**Windows (Command Prompt):**
```cmd
set NZ_LEGISLATION_API_KEY=your_api_key_here
set NZ_LEGISLATION_TIMEOUT=60000
```

**Permanent (Linux/macOS):**
Add to `~/.bashrc` or `~/.zshrc`:
```bash
export NZ_LEGISLATION_API_KEY=your_api_key_here
```

**Permanent (Windows):**
```powershell
[System.Environment]::SetEnvironmentVariable('NZ_LEGISLATION_API_KEY', 'your_api_key_here', 'User')
```

## Configuration File Location

Configuration is stored in:

- **Linux/macOS:** `~/.config/nz-legislation-tool/config.json`
- **Windows:** `%APPDATA%\nz-legislation-tool\config.json`

### Manual Configuration Edit

You can edit the configuration file directly:

```json
{
  "apiKey": "your_api_key_here",
  "baseUrl": "https://api.legislation.govt.nz",
  "timeout": 30000,
  "cache": true
}
```

## Security Best Practices

### Protecting Your API Key

1. **Never commit API keys to version control**
   ```bash
   # Add to .gitignore
   echo ".env" >> .gitignore
   ```

2. **Use environment variables in production**
   ```bash
   # CI/CD secrets
   # GitHub Actions: Settings > Secrets > Actions
   # GitLab CI: Settings > CI/CD > Variables
   ```

3. **Use separate keys for development and production**
   ```bash
   # Development
   export NZ_LEGISLATION_API_KEY=dev_key_here
   
   # Production
   export NZ_LEGISLATION_API_KEY=prod_key_here
   ```

### Rate Limit Awareness

The NZ Legislation API has rate limits:
- **Daily:** 10,000 requests
- **Burst:** 2,000 requests per 5 minutes

The tool automatically tracks and respects these limits.

## Troubleshooting Configuration

### Error: API key not configured

```bash
# Check if API key is set
nzlegislation config --show

# Set API key
nzlegislation config --key YOUR_API_KEY
```

### Error: Invalid API key

1. Verify your API key is correct
2. Check if API key has expired
3. Contact NZ Legislation API support

### Error: Connection timeout

```bash
# Increase timeout
nzlegislation config --timeout 60000

# Check network connection
curl https://api.legislation.govt.nz
```

## Next Steps

- [Quick Start](./quick-start.md) - Run your first search
- [Searching](./user-guide/searching.md) - Learn search options
- [Exporting](./user-guide/exporting.md) - Export data to CSV/JSON

---

**Need Help?** Check the [FAQ](./troubleshooting/faq.md) or [Report an Issue](https://github.com/edithatogo/nz-legislation/issues).
