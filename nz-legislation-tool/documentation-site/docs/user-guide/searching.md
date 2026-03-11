---
sidebar_position: 1
---

# Searching Legislation

This guide covers all search options and techniques for finding legislation.

## Basic Search

### Simple Query

Search for legislation by keyword:

```bash
nzlegislation search --query "health"
```

Output:
```
┌─────────┬─────────────────────────────────────┬──────────┬─────────────┐
│ ID      │ Title                               │ Type     │ Status      │
├─────────┼─────────────────────────────────────┼──────────┼─────────────┤
│ act_... │ Health Act 1956                     │ Act      │ Repealed    │
│ act_... │ New Zealand Public Health and ...   │ Act      │ Current     │
│ ...     │ ...                                 │ ...      │ ...         │
└─────────┴─────────────────────────────────────┴──────────┴─────────────┘

Total: 123 results
```

### Limit Results

```bash
# Show only 5 results
nzlegislation search --query "health" --limit 5
```

### Pagination

```bash
# Get results 11-20 (page 2)
nzlegislation search --query "health" --limit 10 --offset 10
```

## Advanced Search

### Filter by Type

```bash
# Search only Acts
nzlegislation search --query "health" --type "act"

# Search only Regulations
nzlegislation search --query "health" --type "regulation"
```

### Filter by Status

```bash
# Current legislation only
nzlegislation search --query "health" --status "current"

# Repealed legislation
nzlegislation search --query "health" --status "repealed"
```

### Date Range Search

```bash
# Legislation from 2020 onwards
nzlegislation search --query "health" --from "2020-01-01"

# Legislation between dates
nzlegislation search --query "health" --from "2015-01-01" --to "2020-12-31"
```

### Exact Phrase Search

```bash
# Search for exact phrase
nzlegislation search --query "\"mental health act\""
```

### Boolean Operators

```bash
# AND (default)
nzlegislation search --query "health safety"

# OR
nzlegislation search --query "health OR medical"

# NOT
nzlegislation search --query "health -mental"
```

## Search Options Reference

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--query` | `-q` | Search query | Required |
| `--limit` | `-l` | Max results | 25 |
| `--offset` | `-o` | Results offset | 0 |
| `--type` | `-t` | Legislation type | All |
| `--status` | `-s` | Legislation status | All |
| `--from` | `-f` | From date | None |
| `--to` | `-T` | To date | None |
| `--output` | `-O` | Output format | table |

## Output Formats

```bash
# Table format (default)
nzlegislation search --query "health" --output table

# JSON format
nzlegislation search --query "health" --output json

# CSV format
nzlegislation search --query "health" --output csv
```

## Examples

### Example 1: Find All Current Health Acts

```bash
nzlegislation search --query "health" --type "act" --status "current" --limit 50
```

### Example 2: Search for Mental Health Legislation

```bash
nzlegislation search --query "\"mental health\"" --type "act"
```

### Example 3: Recent COVID-19 Legislation

```bash
nzlegislation search --query "covid" --from "2020-01-01" --to "2022-12-31"
```

### Example 4: Export Search Results

```bash
# Export to CSV for Excel analysis
nzlegislation search --query "public health" --output csv > results.csv

# Export to JSON for programmatic use
nzlegislation search --query "public health" --output json > results.json
```

## Tips for Effective Searching

### 1. Use Specific Keywords

```bash
# Too broad
nzlegislation search --query "act"

# More specific
nzlegislation search --query "health act 1956"
```

### 2. Combine Filters

```bash
# Find current regulations about food safety
nzlegislation search --query "food safety" --type "regulation" --status "current"
```

### 3. Use Quotation Marks for Exact Phrases

```bash
# Finds exact phrase
nzlegislation search --query "\"New Zealand Public Health\""
```

### 4. Save Frequently Used Searches

Create a script file:
```bash
#!/bin/bash
# search-health.sh
nzlegislation search --query "health" --type "act" --status "current" --limit 100
```

## Troubleshooting

### No Results Found

1. Check spelling
2. Try broader search terms
3. Remove filters one by one
4. Try alternative keywords

### Too Many Results

1. Add more specific keywords
2. Use date range filters
3. Filter by type or status
4. Use exact phrase search

### Search Timeout

```bash
# Reduce limit
nzlegislation search --query "health" --limit 10

# Use more specific query
nzlegislation search --query "health act 1956"
```

## Next Steps

- [Exporting Data](./exporting.md) - Export search results
- [Generating Citations](./citations.md) - Cite legislation
- [Research Workflow](./research-workflow.md) - Complete workflow

---

**Need Help?** Check the [FAQ](../troubleshooting/faq.md) or [Report an Issue](https://github.com/edithatogo/nz-legislation/issues).
