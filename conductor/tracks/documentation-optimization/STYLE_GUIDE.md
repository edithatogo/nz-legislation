# Documentation Style Guide

**Date:** 2026-03-10  
**Track:** Documentation Optimization & Humanization  
**Phase:** 1 - Audit & Planning  
**Task:** 1.4

---

## Overview

This style guide defines the tone, voice, and writing standards for all NZ Legislation Tool documentation. Following these guidelines ensures consistency, clarity, and a humanized experience across all content.

---

## 1. Tone & Voice

### Core Personality

**We are:**
- 🤝 **Friendly** - Warm, approachable, like a helpful colleague
- 🎯 **Clear** - Direct, concise, no unnecessary jargon
- 💡 **Helpful** - Anticipate questions, provide solutions
- 🎓 **Expert** - Knowledgeable but not condescending
- ⚡ **Efficient** - Respect the reader's time

**We are NOT:**
- ❌ Cold or robotic
- ❌ Overly formal or legalistic
- ❌ Condescending or patronizing
- ❌ Vague or ambiguous
- ❌ Verbose or wordy

### Tone by Context

| Context | Tone | Example |
|---------|------|---------|
| **Quick Start** | Encouraging, energetic | "Let's get you up and running in 5 minutes!" |
| **Error Messages** | Empathetic, actionable | "Hmm, that API key doesn't look right. Let's fix it..." |
| **API Reference** | Precise, technical | "Returns `Promise<SearchResults>` with matching works." |
| **Troubleshooting** | Reassuring, methodical | "Don't worry, this is common. Here's how to fix it." |
| **Contributing** | Welcoming, inclusive | "We'd love your help! Here's how to get started..." |

---

## 2. Writing Guidelines

### 2.1 Use Active Voice

**✅ Active (preferred):**
```
"You can search for legislation using the search command."
"The CLI exports results to CSV format."
"We recommend installing with npm."
```

**❌ Passive (avoid):**
```
"Legislation can be searched for using the search command."
"Results are exported to CSV format by the CLI."
"It is recommended that installation be performed with npm."
```

### 2.2 Address the Reader as "You"

**✅ Second person:**
```
"You'll need an API key to get started."
"Run this command to search for legislation."
"If you get an error, check your API key."
```

**❌ Third person (avoid):**
```
"The user will need an API key to get started."
"Running this command will search for legislation."
"If an error occurs, the API key should be checked."
```

### 2.3 Use Contractions

**✅ Contractions (friendly):**
```
"You'll", "we're", "don't", "can't", "it's", "let's"
```

**❌ Full forms (too formal):**
```
"You will", "we are", "do not", "cannot", "it is", "let us"
```

**Exception:** Avoid contractions in API reference and technical specifications where precision is critical.

### 2.4 Keep Sentences Short

**Target:** 15-20 words per sentence average

**✅ Clear:**
```
"You need an API key first. Get yours from the NZ Legislation website. It's free and takes 2 minutes."
```

**❌ Complex:**
```
"Before you can begin using the tool effectively, you will need to obtain an API key from the official NZ Legislation website, which is a free process that typically takes approximately two minutes to complete."
```

### 2.5 Use Lists for Steps

**✅ Scannable:**
```
To install the tool:

1. Install Node.js 18+
2. Run: `npm install -g nz-legislation-tool`
3. Set your API key: `nzlegislation config --key YOUR_KEY`
4. Test it: `nzlegislation search --query "health"`
```

**❌ Wall of text:**
```
"To install the tool, first install Node.js 18 or later, then run the npm install command with the global flag, after which you should set your API key using the config command, and finally you can test it by running a search."
```

---

## 3. Formatting Standards

### 3.1 Headings

**Hierarchy:**
```markdown
# H1 - Page title (one per page)
## H2 - Major sections
### H3 - Subsections
#### H4 - Minor sections (use sparingly)
```

**Style:**
- ✅ **Sentence case** for headings: "How to search for legislation"
- ❌ **Title Case**: "How to Search for Legislation"
- ❌ **ALL CAPS**: "HOW TO SEARCH FOR LEGISLATION"

### 3.2 Code

**Inline code:** Use backticks for commands, file names, variables
```markdown
Run `nzlegislation search --query "health"` to search.
Edit the `.env` file in your project directory.
The `apiKey` variable stores your API key.
```

**Code blocks:** Use triple backticks with language
````markdown
```bash
npm install -g nz-legislation-tool
```

```typescript
const results = await searchWorks({ query: 'health' });
```

```json
{
  "total": 42,
  "results": []
}
```
````

### 3.3 Emphasis

**Bold:** Use for UI elements, important terms
```markdown
Click the **Install** button.
The **API key** is required for authentication.
```

**Italic:** Use for introductions, asides
```markdown
*Note: This process takes 2-3 minutes.*
*Tip: Save your API key somewhere safe.*
```

**Bold + Italic:** Use sparingly for critical warnings
```markdown
***Warning:*** *Never share your API key publicly.*
```

### 3.4 Links

**Descriptive link text:**
```markdown
✅ [Get your API key](https://api.legislation.govt.nz)
❌ [Click here](https://api.legislation.govt.nz)
```

**Internal links:** Use relative paths
```markdown
[Search Command](./commands/search.md)
[FAQ](../user-guide/faq.md)
```

**External links:** Use full URLs
```markdown
[NZ Legislation API](https://api.legislation.govt.nz)
```

---

## 4. Grammar & Mechanics

### 4.1 Spelling

**Use New Zealand English:**
- ✅ **organise**, ❌ organize
- ✅ **colour**, ❌ color
- ✅ **analyse**, ❌ analyze
- ✅ **behaviour**, ❌ behavior

**Exceptions:**
- Code, commands, and technical terms use US spelling (as per programming conventions)
- Package names, library names remain unchanged

### 4.2 Punctuation

**Oxford comma:** Use for clarity
```markdown
✅ "You need Node.js, npm, and an API key."
❌ "You need Node.js, npm and an API key."
```

**Em dash:** Use for asides—like this—without spaces
```markdown
"The tool is fast—really fast—and handles large datasets well."
```

**Colon:** Use to introduce lists
```markdown
"You need three things: Node.js, npm, and an API key."
```

### 4.3 Numbers

**Spell out 1-9, use numerals for 10+:**
```markdown
✅ "You need three things..."
✅ "The tool supports 15+ output formats."
✅ "Wait 5 minutes before retrying."
✅ "The rate limit is 10,000 requests per day."
```

**Always use numerals for:**
- Code versions: Node.js 18, TypeScript 5.5
- File sizes: 5MB, 2KB
- Percentages: 5%, 100%
- Commands: `--limit 25`

---

## 5. Documentation Components

### 5.1 Notes

Use for helpful asides:

```markdown
> **Note:** You'll need administrator access to install Node.js.
```

### 5.2 Tips

Use for pro tips and shortcuts:

```markdown
> **Tip:** Press `Tab` to autocomplete commands in most terminals.
```

### 5.3 Warnings

Use for important cautions:

```markdown
> **Warning:** Never commit your API key to version control. Add `.env` to your `.gitignore` file.
```

### 5.4 Examples

Use for copy-paste examples:

```markdown
**Example: Search for health-related Acts**

```bash
nzlegislation search --query "health" --type act --status in-force
```

**Expected output:**
```
┌────────────┬────────────────────────┬───────┬──────────┐
│ ID         │ Title                  │ Type  │ Status   │
├────────────┼────────────────────────┼───────┼──────────┤
│ act/2020/67│ Health Act 2020        │ act   │ in-force │
└────────────┴────────────────────────┴───────┴──────────┘
```
```

---

## 6. Command Documentation

### 6.1 Command Structure

Each command page should include:

```markdown
# `command` - Brief description

One-sentence overview of what the command does.

## When to Use This

Explain the use case in plain language.

## Usage

```bash
nzlegislation command [OPTIONS] <ARGUMENTS>
```

## Arguments

| Argument | Required | Description | Example |
|----------|----------|-------------|---------|
| `<id>`   | Yes      | What it is  | `act/2020/67` |

## Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--format` | `-f` | Output format | `table` |

## Examples

### Basic usage

```bash
nzlegislation command --query "health"
```

### With filters

```bash
nzlegislation command --query "health" --type act
```

### Advanced example

```bash
nzlegislation command --query "health" --from 2020-01-01 --to 2024-12-31 --format csv
```

## Troubleshooting

### Common error 1

**Error:** `API key not configured`

**Solution:** Run `nzlegislation config --key YOUR_KEY`

### Common error 2

**Error:** `Rate limit exceeded`

**Solution:** Wait 5 minutes and try again

## Related Commands

- [`search`](./search.md) - Search for legislation
- [`get`](./get.md) - Get legislation by ID
```

---

## 7. Error Message Writing

### 7.1 Error Message Structure

```
[Problem] + [Cause] + [Solution]
```

**Example:**
```
❌ "Authentication failed"

✅ "API key not recognized. This usually happens when the key is expired or typed incorrectly. Run `nzlegislation config --key YOUR_NEW_KEY` to update it."
```

### 7.2 Error Message Tone

**Empathetic, not blaming:**
```
✅ "Hmm, that API key doesn't look right."
❌ "You entered the wrong API key."

✅ "We couldn't connect to the API."
❌ "You have no internet connection."
```

**Actionable:**
```
✅ "Run `nzlegislation config --show` to check your configuration."
❌ "Configuration is incorrect."
```

### 7.3 Error Codes

Use consistent format:
```
ERROR_CODE_1234: Brief description

What happened: Explanation
What to do: Action steps
Learn more: Link to documentation
```

---

## 8. Accessibility Writing

### 8.1 Plain Language

**Target:** Grade 8-10 reading level

**Use simple words:**
```
✅ "get"     ❌ "obtain"
✅ "use"     ❌ "utilize"
✅ "start"   ❌ "initiate"
✅ "help"    ❌ "facilitate"
```

### 8.2 Avoid Idioms

**Culturally neutral:**
```
✅ "This works well."
❌ "This is a piece of cake."

✅ "Start now."
❌ "Hit the ground running."
```

### 8.3 Descriptive Links

**Screen reader friendly:**
```markdown
✅ [Download the installer](...)
❌ [Click here](...)

✅ [Read the API documentation](...)
❌ [More](...)
```

---

## 9. Grammar Checking

### Tools

**Recommended:**
- **Grammarly** - General grammar and spelling
- **Hemingway App** - Readability scoring
- **Vale** - Command-line linting for prose
- **write-good** - Passive voice detection

### Configuration (Vale)

Create `.vale.ini`:
```ini
StylesPath = .vale/styles
MinAlertLevel = suggestion
Packages = Google, write-good

[*.{md,mdx}]
BasedOnStyles = Vale, Google, write-good
```

---

## 10. Review Checklist

Before publishing any documentation:

### Content
- [ ] Clear, descriptive title
- [ ] Introduction explains "what" and "why"
- [ ] Examples for all commands
- [ ] Troubleshooting for common errors
- [ ] Links to related content
- [ ] Last updated date

### Style
- [ ] Active voice throughout
- [ ] Second person ("you") used
- [ ] Contractions used appropriately
- [ ] Sentences average 15-20 words
- [ ] Lists used for steps
- [ ] NZ English spelling

### Formatting
- [ ] Headings in sentence case
- [ ] Code in backticks
- [ ] Bold for UI elements
- [ ] Links are descriptive
- [ ] Notes/tips/warnings formatted consistently

### Accessibility
- [ ] Alt text for images
- [ ] Headings in hierarchical order
- [ ] Links make sense out of context
- [ ] No color-only information
- [ ] Reading level appropriate

---

## 11. Examples: Before & After

### Example 1: Installation Instructions

**❌ Before (formal, passive):**
```
The Node.js runtime environment must be installed prior to utilization of this tool. Installation can be accomplished by navigating to the Node.js website and downloading the appropriate installer for your operating system.
```

**✅ After (conversational, active):**
```
You'll need Node.js 18 or later. Head to [nodejs.org](https://nodejs.org) and download the installer for your system. It takes about 5 minutes.
```

### Example 2: Error Handling

**❌ Before (vague, unhelpful):**
```
Error: Authentication failed. Please check your credentials.
```

**✅ After (specific, actionable):**
```
Error: API key not recognized

This usually means:
- Your API key is expired
- There's a typo in the key
- You haven't set the key yet

Fix it:
1. Run: `nzlegislation config --key YOUR_KEY`
2. Check your email for the correct key
3. Try again

Still stuck? [Get a new API key](https://api.legislation.govt.nz)
```

### Example 3: Feature Description

**❌ Before (technical, dry):**
```
The export functionality facilitates the extraction of search results in comma-separated values (CSV) or JavaScript Object Notation (JSON) formats for subsequent analysis.
```

**✅ After (clear, benefit-focused):**
```
Export your search results to CSV or JSON format. Perfect for analyzing in Excel, importing into databases, or sharing with colleagues.
```

---

## 12. Voice & Tone Scale

Adjust tone based on user's emotional state:

| User State | Tone | Example |
|------------|------|---------|
| **Excited** (first use) | Enthusiastic, encouraging | "Awesome! Let's find some legislation!" |
| **Neutral** (learning) | Friendly, informative | "Here's how the search command works..." |
| **Frustrated** (error) | Empathetic, solution-focused | "Hmm, that's frustrating. Let's fix this..." |
| **Confident** (advanced) | Precise, efficient | "Use `--batch` for bulk operations." |

---

## Summary

**Remember:**
1. Write like you're talking to a colleague
2. Use "you" and active voice
3. Keep sentences short and clear
4. Provide examples for everything
5. Anticipate questions and answer them
6. Be empathetic when things go wrong

**Test your writing:**
- Read it aloud - does it sound natural?
- Ask a non-technical person to read it - do they understand?
- Time yourself - can you find info in <30 seconds?

---

**Prepared by:** AI Agent  
**Date:** 2026-03-10  
**Track:** Documentation Optimization & Humanization  
**Phase:** 1 - Audit & Planning  
**Task:** 1.4 - Style Guide Creation
