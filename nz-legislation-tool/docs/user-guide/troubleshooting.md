# Troubleshooting Guide

**Step-by-step solutions for common issues**

**Looking for quick answers?** Check our [FAQ](./faq.md) with 36 common questions.

---

## Quick Fix Finder

| Problem | Quick Fix |
|---------|-----------|
| API key errors | [Reset API key](#api-key-errors) |
| Rate limit exceeded | [Wait and retry](#rate-limit-errors) |
| Not found errors | [Check ID format](#not-found-errors) |
| Network errors | [Check connection](#network-errors) |
| Installation issues | [Reinstall](#installation-issues) |
| Output looks wrong | [Check terminal](#output-issues) |

---

## API Key Errors

### "API key not configured"

**What it means:** The tool can't find your API key.

**Quick fix:**
```bash
nzlegislation config --key YOUR_API_KEY
```

**Still not working?**

1. **Check if it's set:**
   ```bash
   nzlegislation config --show
   ```

2. **Verify the key format:**
   - Should look like: `nzlapi3f4dd302e30beef18911`
   - No spaces before or after
   - All lowercase

3. **Try environment variable instead:**
   ```bash
   # Linux/macOS
   export NZ_LEGISLATION_API_KEY=YOUR_KEY
   
   # Windows PowerShell
   $env:NZ_LEGISLATION_API_KEY="YOUR_KEY"
   
   # Windows Command Prompt
   set NZ_LEGISLATION_API_KEY=YOUR_KEY
   ```

---

### "Authentication failed"

**What it means:** Your API key is being rejected by the server.

**Common causes:**
- ❌ Typo in the API key
- ❌ Key expired (rare)
- ❌ Wrong key copied (partial key)
- ❌ Extra spaces or characters

**Fix it step-by-step:**

**Step 1: Find your original email**
- Search for "NZ Legislation API" or "PCO"
- The key should be in the welcome email

**Step 2: Copy carefully**
- Select the entire key
- No spaces before or after
- Paste into a text editor first to verify

**Step 3: Reconfigure**
```bash
nzlegislation config --key YOUR_KEY
```

**Step 4: Test**
```bash
nzlegislation search --query "test" --limit 1
```

**Still failing?** Contact the API team: [https://api.legislation.govt.nz/docs/contact](https://api.legislation.govt.nz/docs/contact)

---

## Rate Limit Errors

### "Rate limit exceeded"

**What it means:** You've made too many requests too quickly.

**The limits:**
- **Daily:** 10,000 requests per day
- **Burst:** 2,000 requests per 5 minutes

**When you see this:**
```
Error: Rate limit exceeded. Please wait 300 seconds before retrying.
```

**Fix it:**

**Option 1: Wait it out**
- Burst limit resets after 5 minutes
- Daily limit resets at midnight local time

**Option 2: Reduce request frequency**
```bash
# Instead of one big request, split into chunks
nzlegislation search --query "health" --limit 100 --offset 0
nzlegislation search --query "health" --limit 100 --offset 100
nzlegislation search --query "health" --limit 100 --offset 200
```

**Prevent it:**

**Add delays in scripts:**
```bash
#!/bin/bash
for i in {0..10}; do
  offset=$((i * 100))
  nzlegislation search --query "health" --limit 100 --offset $offset
  sleep 2  # Wait 2 seconds between requests
done
```

**Use smaller batch sizes:**
```bash
# Export in chunks of 1000
nzlegislation export --query "health" --limit 1000 --output part1.csv
nzlegislation export --query "health" --limit 1000 --offset 1000 --output part2.csv
```

---

## Not Found Errors

### "Resource not found" or "404"

**What it means:** The ID you provided doesn't exist.

**Common causes:**
- ❌ Wrong ID format
- ❌ Typo in the ID
- ❌ Legislation doesn't exist

**ID Format:**
```
✅ Correct: act/2020/67
❌ Wrong: 2020-67
❌ Wrong: act_2020_67
❌ Wrong: act/2020/067
```

**Fix it:**

**Step 1: Search to find the correct ID**
```bash
nzlegislation search --query "health act"
```

**Step 2: Copy the exact ID from results**
```
┌────────────────────┬──────────────────────────────────────────┬────────┬──────────┬────────────┐
│ ID                 │ Title                                    │ Type   │ Status   │ Date       │
├────────────────────┼──────────────────────────────────────────┼────────┼──────────┼────────────┤
│ act/2020/67        │ Health Act 2020                          │ act    │ in-force │ 2020-11-15 │
└────────────────────┴──────────────────────────────────────────┴────────┴──────────┴────────────┘
     ↑ Copy this exactly
```

**Step 3: Try again**
```bash
nzlegislation get "act/2020/67"
```

---

## Network Errors

### "Network error" or "Timeout"

**What it means:** Can't connect to the API server.

**Common causes:**
- ❌ No internet connection
- ❌ API server is down
- ❌ Firewall blocking the connection
- ❌ Proxy configuration issues

**Fix it step-by-step:**

**Step 1: Check your internet**
```bash
# Try pinging a website
ping google.com

# Or open a website in your browser
```

**Step 2: Check the API status**
Visit: [https://api.legislation.govt.nz/](https://api.legislation.govt.nz/)

If the website doesn't load, the API might be down.

**Step 3: Test the connection**
```bash
# Try with verbose output
nzlegislation search --query "test" --verbose
```

**Step 4: Check firewall/proxy**
- Corporate firewall might block API access
- Contact your IT department
- Try from a different network (e.g., mobile hotspot)

**Step 5: Increase timeout**
```bash
# Set longer timeout (in milliseconds)
export NZ_LEGISLATION_TIMEOUT=60000
nzlegislation search --query "health"
```

---

### "Connection refused"

**What it means:** The server actively rejected the connection.

**Possible causes:**
- API server is down for maintenance
- Your IP has been blocked (rare)
- Wrong API URL configured

**Fix it:**

1. **Check API status:** [https://api.legislation.govt.nz/](https://api.legislation.govt.nz/)
2. **Wait 10-15 minutes** and try again
3. **Contact support** if it persists

---

## Installation Issues

### "command not found" or "nzlegislation: command not found"

**What it means:** The tool isn't in your system PATH.

**Fix it:**

**For npm install:**

**Windows:**
```bash
# Reinstall with admin privileges
npm install -g nz-legislation-tool

# Then close and reopen your terminal
```

**macOS/Linux:**
```bash
# May need sudo
sudo npm install -g nz-legislation-tool

# Or fix npm permissions (recommended)
# See: https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally
```

**Find where it's installed:**

**Windows:**
```
C:\Users\YOUR_NAME\AppData\Roaming\npm\
```

**macOS/Linux:**
```
~/.npm-global/bin/
# or
/usr/local/bin/
```

**Add to PATH:**

**macOS/Linux:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export PATH=$HOME/.npm-global/bin:$PATH

# Then reload
source ~/.bashrc  # or source ~/.zshrc
```

---

### "npm is not recognized"

**What it means:** Node.js/npm isn't installed.

**Fix it:**

1. **Download Node.js:** [https://nodejs.org/](https://nodejs.org/)
2. **Install** (choose LTS version)
3. **Restart your terminal**
4. **Verify:**
   ```bash
   npm --version
   node --version
   ```

---

### Installation fails with errors

**Common causes:**
- Outdated npm
- Permission issues
- Corrupted cache

**Fix it:**

**Step 1: Update npm**
```bash
npm install -g npm@latest
```

**Step 2: Clear cache**
```bash
npm cache clean --force
```

**Step 3: Try again**
```bash
npm install -g nz-legislation-tool
```

**Still failing?** Try npx instead:
```bash
npx nz-legislation-tool search --query "health"
```

---

## Output Issues

### Table looks broken / garbled

**What it means:** Your terminal doesn't support box-drawing characters.

**Fix it:**

**Option 1: Use JSON or CSV format**
```bash
nzlegislation search --query "health" --format json
nzlegislation search --query "health" --format csv
```

**Option 2: Change terminal font**
- Use a monospace font (Consolas, Monaco, Courier New)
- Avoid proportional fonts

**Option 3: Widen your terminal**
- Make the window wider
- Some tables need 100+ characters width

---

### Colors not showing

**What it means:** Your terminal doesn't support colors or color is disabled.

**Fix it:**

**Force color output:**
```bash
# Some terminals support this
export FORCE_COLOR=1
nzlegislation search --query "health"
```

**Or use no-color mode:**
```bash
export NO_COLOR=1
nzlegislation search --query "health"
```

---

### CSV won't open in Excel

**Problem:** Double-clicking does nothing or shows garbled text.

**Fix it:**

**Method 1: Import through Excel**

1. Open Excel
2. Go to **Data** → **From Text/CSV**
3. Select your file
4. Choose **Comma** as delimiter
5. Click **Load**

**Method 2: Change file association**

**Windows:**
1. Right-click the `.csv` file
2. Choose "Open with"
3. Select Excel
4. Check "Always use this app"

**macOS:**
1. Right-click the `.csv` file
2. Choose "Get Info"
3. Under "Open with", select Excel
4. Click "Change All"

---

## Performance Issues

### Tool is slow

**Common causes:**
- Large result sets
- Slow internet connection
- API server busy

**Fix it:**

**Use smaller limits:**
```bash
# Instead of 1000 results at once
nzlegislation search --query "health" --limit 1000

# Get 100 at a time
nzlegislation search --query "health" --limit 100 --offset 0
nzlegislation search --query "health" --limit 100 --offset 100
```

**Use JSON format (faster than table):**
```bash
nzlegislation search --query "health" --format json
```

**Check your internet:**
```bash
# Test connection speed
speedtest-cli  # Install first: npm install -g speedtest-cli
```

---

### Export takes forever

**Why:** Large datasets take time to fetch and process.

**Fix it:**

**Split into chunks:**
```bash
# Instead of one big export
nzlegislation export --query "health" --output all.csv --limit 10000

# Export in parts
nzlegislation export --query "health" --limit 1000 --output part1.csv
nzlegislation export --query "health" --limit 1000 --offset 1000 --output part2.csv
nzlegislation export --query "health" --limit 1000 --offset 2000 --output part3.csv
```

**Then combine:**
```bash
# Linux/macOS
cat part1.csv part2.csv part3.csv > all.csv

# Windows PowerShell
Get-Content part1.csv, part2.csv, part3.csv | Set-Content all.csv
```

---

## Common Error Messages

### Error: "Invalid work ID format"

**Fix:** Use the correct format: `act/YYYY/NN`

```bash
# ✅ Correct
nzlegislation get "act/2020/67"

# ❌ Wrong
nzlegislation get "2020-67"
nzlegislation get "act_2020_67"
```

---

### Error: "Invalid date format"

**Fix:** Use ISO 8601 format: `YYYY-MM-DD`

```bash
# ✅ Correct
nzlegislation search --query "health" --from 2020-01-01 --to 2024-12-31

# ❌ Wrong
nzlegislation search --query "health" --from 01/01/2020 --to 12/31/2024
nzlegislation search --query "health" --from 1-1-2020 --to 31-12-2024
```

---

### Error: "Limit must be between 1 and 100"

**Fix:** Use a value between 1 and 100

```bash
# ✅ Correct
nzlegislation search --query "health" --limit 50

# ❌ Wrong
nzlegislation search --query "health" --limit 500
```

**For large exports, use offset:**
```bash
nzlegislation search --query "health" --limit 100 --offset 0
nzlegislation search --query "health" --limit 100 --offset 100
nzlegislation search --query "health" --limit 100 --offset 200
```

---

### Error: "Output file already exists"

**Fix:** Use a different filename or delete the existing file

```bash
# Use different name
nzlegislation export --query "health" --output health_results_v2.csv

# Or delete existing file first
rm health_results.csv  # Linux/macOS
del health_results.csv  # Windows
```

---

## Still Having Issues?

### Checklist

Before asking for help, try these:

- [ ] API key is set (`nzlegislation config --show`)
- [ ] Internet connection is working
- [ ] API website is accessible ([https://api.legislation.govt.nz/](https://api.legislation.govt.nz/))
- [ ] Using correct command syntax (check [README](../../README.md))
- [ ] Using correct ID format (`act/YYYY/NN`)
- [ ] Within rate limits (wait 5 minutes if exceeded)
- [ ] Latest version installed (`npm update -g nz-legislation-tool`)

---

### Get Help

**Still stuck?**

1. **Check the FAQ:** [faq.md](./faq.md) - 36 common questions answered
2. **Search issues:** [GitHub Issues](https://github.com/dylanmordaunt/nz-legislation-tool/issues)
3. **Ask in discussions:** [GitHub Discussions](https://github.com/dylanmordaunt/nz-legislation-tool/discussions)
4. **Email:** dylan.mordaunt@vuw.ac.nz

**When asking for help, include:**
- The exact command you ran
- The full error message
- Your operating system
- Tool version (`nzlegislation --version`)

---

## ♿ Accessibility

This documentation aims to meet WCAG 2.1 AA standards. If you encounter accessibility barriers, please [open an issue](https://github.com/dylanmordaunt/nz-legislation-tool/issues) or [contact us](mailto:dylan.mordaunt@vuw.ac.nz).

**Features:**
- ✅ Screen reader compatible
- ✅ Keyboard navigation supported
- ✅ High contrast text
- ✅ Descriptive link text

---

**Last Updated:** 2026-03-10
**Version:** 1.0.0
**Track:** Documentation Optimization & Humanization
**Phase:** 3 - User Documentation
