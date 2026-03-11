---
sidebar_position: 2
---

# Exporting Data

This guide covers exporting search results to various formats for analysis.

## Export Formats

The NZ Legislation Tool supports three export formats:

| Format | Use Case | File Size |
|--------|----------|-----------|
| CSV | Excel, statistical analysis | Small |
| JSON | Programmatic processing | Medium |
| NDJSON | Streaming, large datasets | Smallest |

## CSV Export

### Basic Export

```bash
nzlegislation export --query "health" --output results.csv
```

### CSV Format

The CSV includes these columns:
- `id` - Legislation ID
- `title` - Full title
- `shortTitle` - Short title (if available)
- `type` - Act or Regulation
- `status` - Current or Repealed
- `date` - Date enacted
- `url` - Link to legislation
- `versionCount` - Number of versions

### Example Output

```csv
id,title,shortTitle,type,status,date,url,versionCount
act_public_1989_18,"New Zealand Public Health and Disability Act 2000",,Act,Current,2000-11-08,https://...,15
```

## JSON Export

### Basic Export

```bash
nzlegislation export --query "health" --output results.json --format json
```

### JSON Format

```json
{
  "exportedAt": "2026-03-11T12:00:00Z",
  "query": "health",
  "total": 123,
  "results": [
    {
      "id": "act_public_1989_18",
      "title": "New Zealand Public Health and Disability Act 2000",
      "type": "Act",
      "status": "Current",
      ...
    }
  ]
}
```

## NDJSON Export

NDJSON (Newline Delimited JSON) is ideal for streaming large datasets:

```bash
nzlegislation export --query "health" --output results.ndjson --format ndjson
```

### NDJSON Format

Each line is a valid JSON object:
```json
{"id":"act_public_1989_18","title":"..."}
{"id":"act_public_2000_91","title":"..."}
```

## Export Options

| Option | Description | Default |
|--------|-------------|---------|
| `--query` | Search query | Required |
| `--output` | Output file path | Required |
| `--format` | Output format (csv/json/ndjson) | csv |
| `--limit` | Max results to export | All |

## Large Exports

### Export with Limit

```bash
# Export first 1000 results
nzlegislation export --query "health" --output results.csv --limit 1000
```

### Streaming Export

For very large exports (10,000+ results):

```bash
nzlegislation stream --query "health" --output large-export.csv
```

## Examples

### Example 1: Export for Excel Analysis

```bash
nzlegislation export --query "mental health" --output mental-health.csv
```

Open in Excel:
1. Open Excel
2. File → Open → Browse to `mental-health.csv`
3. Data will be automatically parsed into columns

### Example 2: Export for Python Analysis

```bash
nzlegislation export --query "health" --output results.json --format json
```

Load in Python:
```python
import json

with open('results.json') as f:
    data = json.load(f)

print(f"Total results: {data['total']}")
for result in data['results']:
    print(result['title'])
```

### Example 3: Export for R Analysis

```bash
nzlegislation export --query "health" --output results.csv
```

Load in R:
```r
results <- read.csv("results.csv")
summary(results)
```

### Example 4: Export All Results

```bash
# Export all results (may take time)
nzlegislation export --query "health" --output all-health.csv --limit 10000
```

## Tips for Large Exports

### 1. Use Streaming for Very Large Exports

```bash
nzlegislation stream --query "health" --output massive-export.csv
```

### 2. Export in Batches

```bash
# Export in chunks of 1000
for offset in 0 1000 2000 3000; do
    nzlegislation export --query "health" --output "batch-$offset.csv" --limit 1000 --offset $offset
done
```

### 3. Monitor Progress

The tool shows progress during export:
```
Exporting: 500/10000 (5%) - ETA: 2m 30s
```

## Troubleshooting

### Export File is Empty

1. Check if query returns results first
2. Verify output path is writable
3. Check for error messages

### Export Takes Too Long

1. Reduce limit
2. Use more specific query
3. Use streaming export
4. Export in batches

### CSV Won't Open in Excel

1. Ensure file has `.csv` extension
2. Try opening with Data → From Text/CSV
3. Check encoding (should be UTF-8)

## Next Steps

- [Generating Citations](./citations.md) - Cite legislation
- [Research Workflow](./research-workflow.md) - Complete workflow
- [Batch Operations](../commands/batch.md) - Process multiple works

---

**Need Help?** Check the [FAQ](../troubleshooting/faq.md) or [Report an Issue](https://github.com/edithatogo/nz-legislation/issues).
