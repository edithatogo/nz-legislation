# Frequently Asked Questions (FAQ)

**Last Updated:** 2026-03-10  
**Track:** Documentation Optimization & Humanization  
**Phase:** 3 - User Documentation

---

## Quick Navigation

- [Getting Started](#getting-started)
- [API Key](#api-key)
- [Installation](#installation)
- [Commands](#commands)
- [Output Formats](#output-formats)
- [Errors & Troubleshooting](#errors--troubleshooting)
- [Rate Limits](#rate-limits)
- [Contributing](#contributing)
- [Support](#support)

---

## Getting Started

### What is the NZ Legislation Tool?

It's a command-line tool that helps you search, retrieve, export, and cite New Zealand legislation. Perfect for researchers, legal professionals, and students who work with NZ laws.

**In a nutshell:** You type commands, it fetches legislation data from the official NZ Legislation API.

---

### How long does it take to set up?

About **5 minutes**:
- 2 minutes to get your API key
- 1 minute to install the tool
- 1 minute to configure your API key
- 30 seconds for your first search

See our [Quick Start Guide](../README.md#-quick-start-5-minutes) for step-by-step instructions.

---

### Do I need to know how to code?

**No!** You just need to copy and paste commands. If you can use a terminal or command prompt, you can use this tool.

**Example:**
```bash
nzlegislation search --query "health act"
```

That's it—no programming required.

---

### Is it free?

**Yes!** The tool itself is completely free (Apache 2.0 license).

You'll also need a free API key from the NZ Legislation API team. They offer:
- **Free tier:** 10,000 requests per day (plenty for most users)
- **No credit card required**

---

## API Key

### How do I get an API key?

1. Visit [https://api.legislation.govt.nz/docs/](https://api.legislation.govt.nz/docs/)
2. Fill out the sign-up form
3. Check your email for the API key
4. Copy it and run: `nzlegislation config --key YOUR_KEY`

**Takes about 2 minutes.** The API key is free.

---

### Where do I find my API key?

Check the welcome email from the Parliamentary Counsel Office (PCO). The subject line is usually something like "NZ Legislation API Key" or "API Access Granted".

**Can't find it?** Try:
1. Search your email for "legislation" or "API key"
2. Check your spam/junk folder
3. Request a new key from [the API website](https://api.legislation.govt.nz/docs/)

---

### Can I share my API key with my team?

**Technically yes, but we don't recommend it.** Each API key is tied to rate limits (10,000 requests/day). If your whole team uses one key, you'll hit the limit quickly.

**Better approach:** Each team member gets their own free API key.

---

### My API key stopped working. What do I do?

**Common causes:**
- Typo when copying (check for extra spaces)
- Key expired (rare, but happens)
- Wrong key copied (check you got the full key)

**Fix it:**
1. Find your original email
2. Copy the key carefully
3. Run: `nzlegislation config --key YOUR_NEW_KEY`
4. Test: `nzlegislation search --query "test"`

Still not working? [Contact the API team](https://api.legislation.govt.nz/docs/contact).

---

## Installation

### What do I need to install?

Just two things:
1. **Node.js 18+** ([Download here](https://nodejs.org/))
2. **NZ Legislation Tool** (installs automatically)

**Already have Node.js?** Then you only need one command:
```bash
npm install -g nz-legislation-tool
```

---

### Can I use it without installing?

**Yes!** Use `npx` to run without installing:

```bash
npx nz-legislation-tool search --query "health"
```

**Pros:** No installation, try before committing  
**Cons:** Slower (downloads each time), need to type `npx`

---

### Which is better: npm or npx?

| Use Case | Recommendation |
|----------|---------------|
| **First time / trying it out** | Use `npx` (no install) |
| **Regular use (weekly+)** | Use `npm install -g` |
| **Building an app** | Use `npm install` (local) |

---

### I'm getting "command not found" errors

**After npm install:**

The tool might not be in your PATH. Try:

**Windows:**
```bash
npm install -g nz-legislation-tool
```

Then close and reopen your terminal.

**macOS/Linux:**
You might need sudo:
```bash
sudo npm install -g nz-legislation-tool
```

**Still not working?** Try the full path:
```bash
# macOS/Linux
~/.npm-global/bin/nzlegislation search --query "health"

# Windows
C:\Users\YOUR_NAME\AppData\Roaming\npm\nzlegislation search --query "health"
```

---

## Commands

### What commands are available?

Five main commands:

| Command | What It Does | Example |
|---------|-------------|---------|
| `search` | Find legislation | `nzlegislation search --query "health"` |
| `get` | Get details by ID | `nzlegislation get "act/2020/67"` |
| `export` | Save to file | `nzlegislation export --query "health" --output results.csv` |
| `cite` | Generate citations | `nzlegislation cite "act/2020/67"` |
| `config` | Manage settings | `nzlegislation config --show` |

See the [README](../README.md#-commands-with-examples) for full details.

---

### How do I search for legislation?

**Basic search:**
```bash
nzlegislation search --query "health"
```

**With filters:**
```bash
# By type (act, bill, regulation, instrument)
nzlegislation search --query "health" --type act

# By status (in-force, repealed)
nzlegislation search --query "health" --status in-force

# By date range
nzlegislation search --query "health" --from 2020-01-01 --to 2024-12-31
```

**Pro tip:** Use quotes for exact phrases: `"Mental Health Act"`

---

### How do I export results to Excel?

Use CSV format:

```bash
nzlegislation export --query "health" --type act --output health_acts.csv
```

Then open `health_acts.csv` in Excel.

**Want to include metadata?**
```bash
nzlegislation export --query "health" --output results.csv --include-metadata
```

---

### How do I cite legislation in my paper?

**NZMJ style (default):**
```bash
nzlegislation cite "act/2020/67"
```

**APA style:**
```bash
nzlegislation cite "act/2020/67" --style apa
```

**BibTeX (for LaTeX):**
```bash
nzlegislation cite "act/2020/67" --style bibtex
```

**RIS (for EndNote, Mendeley, Zotero):**
```bash
nzlegislation cite "act/2020/67" --style ris
```

---

### Can I search by Māori terms?

**Yes!** The API supports te reo Māori searches.

**Examples:**
```bash
nzlegislation search --query "ture"  # "law" in Māori
nzlegislation search --query "whakature"  # "legislation" in Māori
```

**Note:** Most legislation titles are in English, but you can search for Māori concepts and keywords within the text.

---

## Output Formats

### What formats can I export to?

Three formats:

1. **Table** (default) - Pretty terminal output
2. **JSON** - For developers and automation
3. **CSV** - For Excel, R, Python, SPSS

**Change format:**
```bash
# JSON
nzlegislation search --query "health" --format json

# CSV
nzlegislation search --query "health" --format csv
```

---

### How do I read the JSON output?

**Example:**
```bash
nzlegislation search --query "health" --format json
```

**Output structure:**
```json
{
  "total": 42,           // Total matching results
  "offset": 0,           // Current position (for pagination)
  "limit": 25,           // Results per page
  "results": [           // Array of legislation items
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

**Parse in Node.js:**
```javascript
const results = JSON.parse(output);
console.log(`Found ${results.total} results`);
```

---

### What's in the CSV export?

CSV includes these columns:

| Column | Description |
|--------|-------------|
| `id` | Unique identifier (e.g., `act/2020/67`) |
| `title` | Full title |
| `shortTitle` | Short title |
| `type` | Type (act, bill, regulation, instrument) |
| `status` | Status (in-force, repealed, etc.) |
| `date` | Date enacted |
| `url` | API URL |
| `versionCount` | Number of versions |

**Open in Excel:** Just double-click the `.csv` file.

---

## Errors & Troubleshooting

**Quick fixes for common errors. For more detailed troubleshooting with 21+ error scenarios, see our [Troubleshooting Guide](./troubleshooting.md).**

### "API key not configured"

**Quick fix:**
```bash
nzlegislation config --key YOUR_API_KEY
```

**Check it's set:**
```bash
nzlegislation config --show
```

---

### "Authentication failed"

**What it means:** Your API key isn't being accepted.

**Common causes:**
- Typo in the key
- Key expired
- Wrong key copied

**Fix it:**
1. Find your original email
2. Copy the key carefully (no extra spaces)
3. Run: `nzlegislation config --key YOUR_KEY`
4. Test: `nzlegislation search --query "test"`

---

### "Rate limit exceeded"

**What happened:** You've made too many requests too quickly.

**Limits:**
- 10,000 requests per day
- 2,000 requests per 5 minutes (burst)

**Fix it:**
- Wait 5 minutes for burst limit
- Or wait until midnight for daily limit

**Prevent it:**
- Add pauses between bulk requests
- Use `--limit` to reduce batch sizes
- Export in chunks (e.g., 1000 at a time)

---

### "Resource not found"

**What it means:** The ID you provided doesn't exist.

**Common causes:**
- Wrong ID format (should be like `act/2020/67`)
- Typo in the ID
- Legislation doesn't exist

**Fix it:**
1. Search first to find the correct ID:
   ```bash
   nzlegislation search --query "health"
   ```
2. Copy the exact ID from results
3. Try again

---

### "Network error" or "Timeout"

**What happened:** Can't connect to the API.

**Fix it:**
1. Check your internet connection
2. Try the API website: https://api.legislation.govt.nz
3. If the API is down, wait and try later

**Still stuck?** Check [API status](https://api.legislation.govt.nz/) or [contact support](#support).

---

### The output looks weird / broken

**Possible causes:**
- Terminal window too narrow
- Font doesn't support box-drawing characters
- Output redirected to a file

**Fix it:**
1. Widen your terminal window
2. Try a different font (Consolas, Monaco, or other monospace)
3. Use `--format json` or `--format csv` instead

---

## Rate Limits

### What are the rate limits?

| Limit | Value | Reset |
|-------|-------|-------|
| **Daily** | 10,000 requests | Midnight local time |
| **Burst** | 2,000 requests per 5 minutes | Rolling window |

**Don't worry**—the CLI automatically handles rate limiting and will tell you when to try again.

---

### How many requests will I typically use?

**Typical usage:**

| Activity | Requests |
|----------|----------|
| Single search | 1 request |
| Export 100 results | 1-2 requests |
| Get details for one Act | 1 request |
| Generate citation | 1 request |

**Example:** If you search 10 times and export 5 times per day, that's ~15 requests. You'd need to make **667 searches per day** to hit the limit!

---

### Can I increase the rate limit?

The limits are set by the NZ Legislation API team. If you need higher limits for research purposes:

1. Contact the API team: [https://api.legislation.govt.nz/docs/contact](https://api.legislation.govt.nz/docs/contact)
2. Explain your use case
3. They may grant higher limits for academic research

---

## Contributing

### How can I contribute?

We welcome contributions! Here's how:

- 🐛 **Report bugs** - [Open an issue](https://github.com/dylanmordaunt/nz-legislation-tool/issues)
- 💡 **Suggest features** - [Start a discussion](https://github.com/dylanmordaunt/nz-legislation-tool/discussions)
- 📝 **Improve docs** - Submit a pull request
- 💻 **Fix code** - See [CONTRIBUTING.md](../CONTRIBUTING.md)

---

### Do I need to be a developer to contribute?

**No!** We especially need help with:
- Documentation improvements
- Bug reports from real users
- Feature suggestions
- Testing new releases

If you've used the tool and have feedback, that's valuable!

---

### How do I report a bug?

**Best way:** [Open an issue on GitHub](https://github.com/dylanmordaunt/nz-legislation-tool/issues)

**Include:**
1. What you were trying to do
2. What command you ran
3. What error you got (copy the full message)
4. Your operating system (Windows, macOS, Linux)
5. Tool version (`nzlegislation --version`)

**Example:**
```
I tried to export results to CSV but got an authentication error.

Command: nzlegislation export --query "health" --output test.csv
Error: "Authentication failed. Invalid API key."
OS: Windows 11
Version: 1.2.3

I've already tried re-setting my API key.
```

---

## Support

### I need help!

**Quick answers:** Check this FAQ or the [README](../README.md).

**Still stuck?**

- 🐛 **Found a bug?** [Open an issue](https://github.com/dylanmordaunt/nz-legislation-tool/issues)
- 💬 **Have a question?** [Start a discussion](https://github.com/dylanmordaunt/nz-legislation-tool/discussions)
- 📧 **Email:** dylan.mordaunt@vuw.ac.nz

**Response time:** We aim to respond within 2 business days.

---

### Where can I learn more?

**Documentation:**
- [README](../README.md) - Quick start and commands
- [User Guide](./user-guide/) - Detailed workflows
- [Troubleshooting](./troubleshooting.md) - Step-by-step fixes
- [Developer Guide](../docs/developer-guide/) - For contributors

**External:**
- [NZ Legislation API](https://api.legislation.govt.nz/)
- [Node.js Download](https://nodejs.org/)
- [npm Documentation](https://docs.npmjs.com/)

---

### Is there a community?

**Yes!** Join the conversation:

- [GitHub Discussions](https://github.com/dylanmordaunt/nz-legislation-tool/discussions) - Ask questions, share workflows
- [GitHub Issues](https://github.com/dylanmordaunt/nz-legislation-tool/issues) - Report bugs, request features

---

## Still Have Questions?

**Can't find what you're looking for?**

[Start a discussion](https://github.com/dylanmordaunt/nz-legislation-tool/discussions) and we'll help you out. We're always happy to answer questions and improve the documentation based on your feedback.

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
