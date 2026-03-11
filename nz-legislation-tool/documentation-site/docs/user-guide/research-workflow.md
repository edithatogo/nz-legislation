---
sidebar_position: 4
---

# Research Workflow

This guide provides an end-to-end workflow for using the NZ Legislation Tool in academic research.

## Overview

A typical research workflow involves:

1. **Define Research Question** - What legislation are you studying?
2. **Search & Identify** - Find relevant legislation
3. **Export Data** - Export for analysis
4. **Analyze** - Statistical or qualitative analysis
5. **Cite** - Generate citations for publications
6. **Document** - Ensure reproducibility

## Step 1: Define Research Question

### Example Research Questions

- "What health-related Acts were passed between 2000-2020?"
- "How has mental health legislation evolved?"
- "What regulations were introduced during COVID-19?"

### Document Your Search Strategy

Create a research log:
```markdown
# Research Log

## Date: 2026-03-11

### Research Question
How has mental health legislation evolved in NZ?

### Search Strategy
- Query: "mental health"
- Type: Act
- Date Range: 1990-2026
- Status: All

### Notes
- Include both current and repealed Acts
- Track amendment frequency
```

## Step 2: Search & Identify

### Initial Search

```bash
# Broad search
nzlegislation search --query "mental health" --type "act" --limit 50
```

### Refine Search

```bash
# Add date range
nzlegislation search --query "mental health" --type "act" \
  --from "1990-01-01" --to "2026-12-31" --limit 100
```

### Review Results

```bash
# Export preliminary results
nzlegislation search --query "mental health" --type "act" \
  --output preliminary.csv
```

## Step 3: Export Data

### Export for Analysis

```bash
# CSV for Excel/R
nzlegislation export --query "mental health" --type "act" \
  --from "1990-01-01" --to "2026-12-31" \
  --output mental-health-data.csv
```

### Export Metadata

```bash
# JSON for programmatic use
nzlegislation export --query "mental health" --type "act" \
  --output mental-health.json --format json
```

## Step 4: Analyze

### Excel Analysis

1. Open `mental-health-data.csv` in Excel
2. Create pivot tables
3. Generate charts
4. Calculate statistics

### R Analysis

```r
# Load data
data <- read.csv("mental-health-data.csv")

# Summary statistics
summary(data)

# Timeline visualization
library(ggplot2)
ggplot(data, aes(x = date)) +
  geom_histogram(binwidth = 365) +
  labs(title = "Mental Health Legislation Over Time")
```

### Python Analysis

```python
import pandas as pd
import matplotlib.pyplot as plt

# Load data
df = pd.read_csv('mental-health-data.csv')

# Summary statistics
print(df.describe())

# Timeline
df['date'] = pd.to_datetime(df['date'])
df.set_index('date').resample('Y').size().plot()
plt.title('Mental Health Legislation Over Time')
plt.show()
```

## Step 5: Cite

### Generate Citations

```bash
# Generate citations for all Acts
for id in $(cut -d',' -f1 mental-health-data.csv | tail -n +2); do
    nzlegislation cite "$id" --style nzmj >> bibliography.txt
done
```

### Add to Paper

```
References:

Mental Health (Compulsory Assessment and Treatment) Act 1992, 
Public Act 1992 No 46 (NZ).

New Zealand Public Health and Disability Act 2000, 
Public Act 2000 No 91 (NZ).
```

## Step 6: Document

### Reproducibility Checklist

- [ ] Search query documented
- [ ] Date range specified
- [ ] Export files saved
- [ ] Analysis code saved
- [ ] Citations generated
- [ ] Version numbers recorded

### Create Reproducibility Package

```bash
# Create folder
mkdir -p research-package

# Copy data
cp mental-health-data.csv research-package/

# Copy analysis script
cp analysis.R research-package/

# Document versions
nzlegislation --version > research-package/versions.txt

# Create README
cat > research-package/README.md << EOF
# Research Package

## Date: $(date)

## Search Query
nzlegislation search --query "mental health" --type "act"

## Files
- mental-health-data.csv: Exported data
- analysis.R: Analysis script
- versions.txt: Tool versions

## Reproduce
1. Install nz-legislation-tool
2. Run analysis.R
EOF
```

## Best Practices

### 1. Save Your Searches

```bash
# Create search script
cat > searches.sh << EOF
#!/bin/bash
nzlegislation search --query "mental health" --type "act" --limit 100
nzlegislation search --query "health act" --type "act" --limit 100
EOF
chmod +x searches.sh
```

### 2. Use Consistent Naming

```bash
# Good naming convention
mental-health-acts-1990-2026.csv
mental-health-citations-nzmj.txt
mental-health-analysis.R
```

### 3. Document Everything

```markdown
# Research Notes

## 2026-03-11
- Ran search for "mental health"
- Found 47 Acts
- Exported to mental-health.csv
- Note: Some results may be duplicates
```

### 4. Version Your Exports

```bash
# Include date in filename
mental-health-2026-03-11.csv

# Or use version numbers
mental-health-v1.csv
mental-health-v2.csv
```

## Example: Complete Workflow

### Research Project: Mental Health Legislation Analysis

```bash
# 1. Setup
mkdir mental-health-research
cd mental-health-research

# 2. Search
nzlegislation search --query "mental health" --type "act" \
  --from "1990-01-01" --to "2026-12-31" \
  --limit 100

# 3. Export
nzlegislation export --query "mental health" --type "act" \
  --from "1990-01-01" --to "2026-12-31" \
  --output data.csv

# 4. Analyze (R script)
cat > analysis.R << EOF
data <- read.csv("data.csv")
summary(data)
EOF
Rscript analysis.R

# 5. Cite
nzlegislation cite "act_public_1992_46" --style nzmj

# 6. Document
cat > README.md << EOF
# Mental Health Legislation Research

## Search Query
"mental health" + type:act + 1990-2026

## Results
47 Acts found

## Files
- data.csv: Exported data
- analysis.R: Analysis script
EOF
```

## Troubleshooting

### Search Returns Too Few Results

1. Broaden search terms
2. Remove date filters
3. Try alternative keywords

### Export File is Too Large

1. Use NDJSON format
2. Export in batches
3. Use streaming export

### Citations Don't Match Style Guide

1. Verify style option
2. Check for updates
3. Manual formatting may be needed

## Next Steps

- [Searching Guide](./searching.md) - Advanced search techniques
- [Exporting Guide](./exporting.md) - Export formats
- [Citation Guide](./citations.md) - Citation styles

---

**Need Help?** Check the [FAQ](../troubleshooting/faq.md) or [Report an Issue](https://github.com/edithatogo/nz-legislation/issues).
