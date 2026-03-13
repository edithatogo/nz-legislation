# Error Message Reference

**Complete reference for all error messages and their solutions**

---

## Overview

This document provides a comprehensive reference for all error messages that may be encountered when using the NZ Legislation Tool. Each error includes:

- Error code
- Error message
- What it means
- Common causes
- How to fix it
- Prevention tips

**Last Updated:** 2026-03-10  
**Version:** 1.0.0

---

## Quick Reference

| Error Code                              | Message                 | Quick Fix          |
| --------------------------------------- | ----------------------- | ------------------ |
| [1001](#1001-config_api_key_missing)    | API key not configured  | Run `config --key` |
| [1002](#1002-config_not_found)          | Configuration not found | Run `config --key` |
| [2001](#2001-api_authentication_failed) | Authentication failed   | Check API key      |
| [2002](#2002-api_not_found)             | Resource not found      | Check ID format    |
| [2003](#2003-api_rate_limit_exceeded)   | Rate limit exceeded     | Wait and retry     |
| [2004](#2004-api_timeout)               | Request timeout         | Check connection   |
| [3001](#3001-validation_invalid_format) | Invalid format          | Check format       |
| [3002](#3002-validation_required_field) | Required field missing  | Add field          |
| [4001](#4001-file_not_found)            | File not found          | Check path         |
| [5001](#5001-network_error)             | Network error           | Check connection   |

---

## Configuration Errors (1000-1999)

### 1001: CONFIG_API_KEY_MISSING

**Message:** `API key not configured`

**What it means:** The tool cannot find your API key.

**Common Causes:**

- API key never set
- Configuration file deleted
- Environment variable not set

**How to Fix:**

1. **Set API key interactively:**

   ```bash
   nzlegislation config --key YOUR_API_KEY
   ```

2. **Or set as environment variable:**

   ```bash
   # Linux/macOS
   export NZ_LEGISLATION_API_KEY=YOUR_API_KEY

   # Windows PowerShell
   $env:NZ_LEGISLATION_API_KEY="YOUR_API_KEY"
   ```

3. **Or create .env file:**
   ```env
   NZ_LEGISLATION_API_KEY=YOUR_API_KEY
   ```

**Prevention:**

- Set API key once during initial setup
- Use environment variables for CI/CD
- Don't commit .env files to version control

**Related:** [1002 - Configuration not found](#1002-config_not_found)

---

### 1002: CONFIG_NOT_FOUND

**Message:** `Configuration file not found`

**What it means:** The configuration file doesn't exist.

**Common Causes:**

- First time using the tool
- Configuration file manually deleted
- Wrong user account

**How to Fix:**

1. **Run initial setup:**

   ```bash
   nzlegislation config --key YOUR_API_KEY
   ```

2. **Verify config file location:**
   - **Windows:** `%APPDATA%\nz-legislation-tool\config.json`
   - **macOS/Linux:** `~/.config/nz-legislation-tool/config.json`

3. **Check file permissions:**
   ```bash
   # Linux/macOS
   ls -la ~/.config/nz-legislation-tool/
   ```

**Prevention:**

- Don't manually delete config files
- Use environment variables as backup

**Related:** [1001 - API key not configured](#1001-config_api_key_missing)

---

## API Errors (2000-2999)

### 2001: API_AUTHENTICATION_FAILED

**Message:** `Authentication failed. Invalid API key.`

**What it means:** Your API key is being rejected by the server.

**Common Causes:**

- Typo in API key
- API key expired
- Wrong API key copied
- Extra spaces in key

**How to Fix:**

1. **Find your original API key email**
   - Search for "NZ Legislation API" or "PCO"

2. **Copy the key carefully:**
   - Select entire key
   - No spaces before or after
   - Paste into text editor first to verify

3. **Reconfigure:**

   ```bash
   nzlegislation config --key YOUR_NEW_KEY
   ```

4. **Test:**
   ```bash
   nzlegislation search --query "test" --limit 1
   ```

**Prevention:**

- Store API key in password manager
- Copy-paste carefully (no typos)
- Don't share API key publicly

**Still failing?** Contact API team: https://api.legislation.govt.nz/docs/contact

---

### 2002: API_NOT_FOUND

**Message:** `Resource not found` or `404 Not Found`

**What it means:** The work ID you provided doesn't exist.

**Common Causes:**

- Wrong ID format
- Typo in ID
- Legislation doesn't exist
- ID from different jurisdiction

**ID Format:**

```
✅ Correct: act/2020/67
❌ Wrong: 2020-67
❌ Wrong: act_2020_67
❌ Wrong: act/2020/067
```

**How to Fix:**

1. **Search to find correct ID:**

   ```bash
   nzlegislation search --query "health act"
   ```

2. **Copy exact ID from results:**

   ```
   ┌────────────────────┬──────────────────────────────────────────┐
   │ ID                 │ Title                                    │
   ├────────────────────┼──────────────────────────────────────────┤
   │ act/2020/67        │ Health Act 2020                          │
   └────────────────────┴──────────────────────────────────────────┘
        ↑ Copy this exactly
   ```

3. **Try again:**
   ```bash
   nzlegislation get "act/2020/67"
   ```

**Prevention:**

- Always search first to get correct ID
- Copy-paste IDs (don't type manually)
- Verify ID format matches `type/YYYY/NN`

---

### 2003: API_RATE_LIMIT_EXCEEDED

**Message:** `Rate limit exceeded. Please wait {seconds} seconds before retrying.`

**What it means:** You've made too many requests too quickly.

**Rate Limits:**

- **Daily:** 10,000 requests per day
- **Burst:** 2,000 requests per 5 minutes

**Common Causes:**

- Bulk export without delays
- Script making rapid requests
- Multiple users sharing one API key

**How to Fix:**

1. **Wait for limit to reset:**
   - Burst limit: Wait 5 minutes
   - Daily limit: Wait until midnight

2. **Retry after waiting:**
   ```bash
   # Wait 5 minutes, then retry
   nzlegislation search --query "health"
   ```

**Prevention:**

1. **Add delays in scripts:**

   ```bash
   #!/bin/bash
   for i in {0..10}; do
     offset=$((i * 100))
     nzlegislation search --query "health" --limit 100 --offset $offset
     sleep 2  # Wait 2 seconds between requests
   done
   ```

2. **Use smaller batch sizes:**

   ```bash
   # Export in chunks
   nzlegislation export --query "health" --limit 1000 --output part1.csv
   nzlegislation export --query "health" --limit 1000 --offset 1000 --output part2.csv
   ```

3. **Get separate API keys for team members**

**Need higher limits?** Contact API team for research exemptions.

---

### 2004: API_TIMEOUT

**Message:** `Request timeout. The API did not respond within 30 seconds.`

**What it means:** The API took too long to respond.

**Common Causes:**

- Slow internet connection
- API server busy
- Large result sets
- Network issues

**How to Fix:**

1. **Check your internet:**

   ```bash
   ping api.legislation.govt.nz
   ```

2. **Try a smaller request:**

   ```bash
   # Instead of 1000 results, try 25
   nzlegislation search --query "health" --limit 25
   ```

3. **Increase timeout (if needed):**

   ```bash
   # Set timeout to 60 seconds
   export NZ_LEGISLATION_TIMEOUT=60000
   ```

4. **Retry:**
   ```bash
   nzlegislation search --query "health"
   ```

**Prevention:**

- Use smaller limits for large queries
- Export in chunks
- Check API status: https://api.legislation.govt.nz/

---

## Validation Errors (3000-3999)

### 3001: VALIDATION_INVALID_FORMAT

**Message:** `Invalid format. Expected {format}.`

**What it means:** One of your parameters has the wrong format.

**Common Causes:**

- Wrong date format (should be YYYY-MM-DD)
- Invalid type value
- Invalid status value

**How to Fix:**

1. **Check date format:**

   ```bash
   # ✅ Correct
   --from 2020-01-01 --to 2024-12-31

   # ❌ Wrong
   --from 01/01/2020 --to 12/31/2024
   ```

2. **Check type values:**

   ```bash
   # ✅ Valid types: act, bill, regulation, instrument
   --type act

   # ❌ Invalid
   --type law
   ```

3. **Check status values:**

   ```bash
   # ✅ Valid statuses
   --status in-force
   --status repealed

   # ❌ Invalid
   --status active
   ```

**Prevention:**

- Use ISO date format (YYYY-MM-DD)
- Check valid values in documentation
- Use tab completion if available

---

### 3002: VALIDATION_REQUIRED_FIELD

**Message:** `{field} is required.`

**What it means:** A required parameter is missing.

**Common Causes:**

- Forgot to specify query
- Missing output file for export

**How to Fix:**

1. **For search:**

   ```bash
   # ✅ Include query
   nzlegislation search --query "health"

   # ❌ Missing query
   nzlegislation search
   ```

2. **For export:**

   ```bash
   # ✅ Include output
   nzlegislation export --query "health" --output results.csv

   # ❌ Missing output
   nzlegislation export --query "health"
   ```

**Prevention:**

- Check command help: `nzlegislation <command> --help`
- Required parameters are shown in usage

---

## File Errors (4000-4999)

### 4001: FILE_NOT_FOUND

**Message:** `File not found: {path}`

**What it means:** The specified file doesn't exist.

**Common Causes:**

- Wrong file path
- File was deleted
- Typo in filename

**How to Fix:**

1. **Check file exists:**

   ```bash
   # Linux/macOS
   ls -la results.csv

   # Windows
   dir results.csv
   ```

2. **Use absolute path:**

   ```bash
   # Instead of relative path
   nzlegislation export --query "health" --output /full/path/to/results.csv
   ```

3. **Check directory exists:**
   ```bash
   # Create directory if needed
   mkdir -p /path/to/directory
   ```

**Prevention:**

- Use tab completion for file paths
- Check file exists before using
- Use absolute paths in scripts

---

### 4002: FILE_WRITE_ERROR

**Message:** `Cannot write to file: {path}`

**What it means:** Cannot save to the specified file.

**Common Causes:**

- No write permissions
- Directory doesn't exist
- Disk full
- File is locked

**How to Fix:**

1. **Check permissions:**

   ```bash
   # Linux/macOS
   ls -la /path/to/

   # Windows - check file properties
   ```

2. **Create directory:**

   ```bash
   mkdir -p /path/to/directory
   ```

3. **Check disk space:**

   ```bash
   # Linux/macOS
   df -h

   # Windows
   wmic logicaldisk get size,freespace,caption
   ```

4. **Try different location:**
   ```bash
   nzlegislation export --query "health" --output ~/results.csv
   ```

---

## Network Errors (5000-5999)

### 5001: NETWORK_ERROR

**Message:** `Network error. Cannot connect to API.`

**What it means:** Cannot establish connection to the API server.

**Common Causes:**

- No internet connection
- Firewall blocking connection
- Proxy configuration issues
- API server down

**How to Fix:**

1. **Check internet connection:**

   ```bash
   ping google.com
   ```

2. **Check API status:**
   - Visit: https://api.legislation.govt.nz/
   - If website doesn't load, API may be down

3. **Check firewall:**
   - Corporate firewall may block API access
   - Contact IT department
   - Try from different network (e.g., mobile hotspot)

4. **Check proxy:**
   ```bash
   # If behind proxy, set proxy variables
   export HTTP_PROXY=http://proxy.example.com:8080
   export HTTPS_PROXY=http://proxy.example.com:8080
   ```

**Prevention:**

- Use stable internet connection
- Configure proxy if needed
- Check API status before bulk operations

---

### 5002: NETWORK_TIMEOUT

**Message:** `Connection timed out`

**What it means:** Connection attempt timed out.

**Common Causes:**

- Very slow connection
- Server not responding
- Network congestion

**How to Fix:**

1. **Increase timeout:**

   ```bash
   export NZ_LEGISLATION_TIMEOUT=60000
   ```

2. **Check connection speed:**

   ```bash
   # Install speedtest-cli
   npm install -g speedtest-cli
   speedtest
   ```

3. **Retry:**
   ```bash
   nzlegislation search --query "health"
   ```

---

## Error Handling Best Practices

### In Scripts

```bash
#!/bin/bash

# Enable strict mode
set -e

# Add error handler
trap 'echo "Error occurred. Exiting." >&2' ERR

# Your commands
nzlegislation search --query "health" --output results.csv

echo "Success!"
```

### In Node.js

```typescript
import { searchWorks } from '@client';
import { ApiError, RateLimitError } from '@errors';

async function safeSearch() {
  try {
    const results = await searchWorks({ query: 'health' });
    console.log(results);
  } catch (error) {
    if (error instanceof RateLimitError) {
      console.log(`Rate limited. Wait ${error.retryAfter}s`);
      await sleep(error.retryAfter * 1000);
      return safeSearch(); // Retry
    } else if (error instanceof ApiError) {
      console.log(`API error: ${error.message}`);
      if (error.suggestion) {
        console.log(`Tip: ${error.suggestion}`);
      }
    } else {
      console.log('Unknown error:', error);
    }
  }
}
```

---

## Getting Help

### Checklist

Before asking for help, try these:

- [ ] Read this error reference
- [ ] Check [FAQ](../user-guide/faq.md)
- [ ] Check [Troubleshooting Guide](../user-guide/troubleshooting.md)
- [ ] Verify API key is set
- [ ] Check internet connection
- [ ] Try with `--verbose` flag

### When Asking for Help

Include:

1. **Exact error message** (copy-paste)
2. **Command you ran** (copy-paste)
3. **What you were trying to do**
4. **Your operating system**
5. **Tool version** (`nzlegislation --version`)

**Example:**

```
Error: "Authentication failed. Invalid API key."

Command: nzlegislation search --query "health"

What I was trying to do: Search for health legislation

OS: Windows 11

Version: 1.0.0

I've already tried: Re-setting API key
```

### Where to Ask

- 🐛 **Bug reports:** [GitHub Issues](https://github.com/edithatogo/nz-legislation-tool/issues)
- 💬 **Questions:** [GitHub Discussions](https://github.com/edithatogo/nz-legislation-tool/discussions)
- 📧 **Email:** dylan.mordaunt@vuw.ac.nz

**Response time:** Within 2 business days

---

## Related Documentation

- [FAQ](../user-guide/faq.md) - Common questions
- [Troubleshooting Guide](../user-guide/troubleshooting.md) - Step-by-step fixes
- [Glossary](../user-guide/glossary.md) - Technical terms
- [API Reference](./api-reference.md) - Complete API docs

---

**Last Updated:** 2026-03-10  
**Version:** 1.0.0  
**Track:** Documentation Optimization & Humanization  
**Phase:** 7.5 - API Documentation & Troubleshooting
