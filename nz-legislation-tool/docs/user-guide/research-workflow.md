# Research Workflow Guide

**Complete end-to-end workflow for legislative research**

---

## Overview

This guide walks you through a complete research workflow using the NZ Legislation Tool. Perfect for academics, policy analysts, and researchers working on health policy, social policy, or any legislation-related research.

**Time:** 30-60 minutes for a typical research project  
**Output:** Dataset ready for analysis, citations for your paper

---

## Scenario: Health Policy Research

Let's say you're researching health legislation reforms in New Zealand. Here's how to use the tool at each stage.

---

## Stage 1: Discovery (10 minutes)

### Step 1.1: Initial Search

Start broad to understand what's available:

```bash
nzlegislation search --query "health" --type act --status in-force
```

**What you'll see:**
```
┌────────────────────┬──────────────────────────────────────────┬────────┬──────────┬────────────┐
│ ID                 │ Title                                    │ Type   │ Status   │ Date       │
├────────────────────┼──────────────────────────────────────────┼────────┼──────────┼────────────┤
│ act/2020/67        │ Health Act 2020                          │ act    │ in-force │ 2020-11-15 │
│ act/1956/65        │ Health Act 1956                          │ act    │ in-force │ 1956-10-01 │
│ act/1981/118       │ Mental Health Act 1981                   │ act    │ in-force │ 1981-11-01 │
└────────────────────┴──────────────────────────────────────────┴────────┴──────────┴────────────┘

Total: 15 results (showing 15)
```

**Pro tip:** Start with broad searches, then narrow down.

---

### Step 1.2: Refine Your Search

Add filters based on your research question:

```bash
# Search for mental health legislation
nzlegislation search --query "mental health" --type act

# Search by date range (e.g., reforms from 2020-2024)
nzlegislation search --query "health reform" --from 2020-01-01 --to 2024-12-31

# Search for specific concepts
nzlegislation search --query "public health" --status in-force
```

**Pro tip:** Use quotes for exact phrases: `"Mental Health Act"`

---

### Step 1.3: Review Results

Look through the results and note:
- Relevant Acts (copy the IDs)
- Date ranges (when were key laws enacted?)
- Gaps (what's missing from your search?)

**Example IDs to note:**
- `act/2020/67` - Health Act 2020
- `act/1981/118` - Mental Health Act 1981
- `act/2000/7` - New Zealand Public Health and Disability Act 2000

---

## Stage 2: Data Collection (15 minutes)

### Step 2.1: Export Full Dataset

Export all relevant results for analysis:

```bash
# Export all active health Acts
nzlegislation export --query "health" --type act --status in-force --output health_acts.csv --include-metadata
```

**What you get:**
- CSV file with all search results
- Metadata including search timestamp, query, and API version
- Ready to open in Excel, R, Python, or SPSS

---

### Step 2.2: Get Detailed Information

For key legislation, get full details:

```bash
# Get details on a specific Act
nzlegislation get "act/2020/67"

# Include version history
nzlegislation get "act/2020/67" --versions

# Export as JSON for analysis
nzlegislation get "act/2020/67" --format json
```

**Why?** Version history shows how the Act has changed over time—crucial for policy analysis.

---

### Step 2.3: Batch Export Multiple Acts

Create a list of IDs and export them:

```bash
# Create a text file with IDs (one per line)
cat > ids.txt << EOF
act/2020/67
act/1981/118
act/2000/7
EOF

# Then use a script to loop through (see Automation Scripts)
```

**Pro tip:** For large batches, export in chunks of 100 to avoid rate limits.

---

## Stage 3: Analysis (15-30 minutes)

### Step 3.1: Open in Excel

**For CSV files:**
1. Double-click the `.csv` file
2. Excel opens automatically
3. Data is ready to sort, filter, and analyze

**Columns you'll have:**
- `id` - Unique identifier
- `title` - Full title
- `shortTitle` - Short title
- `type` - Act, bill, regulation, etc.
- `status` - In-force, repealed, etc.
- `date` - Date enacted
- `url` - Link to full text
- `versionCount` - Number of amendments

---

### Step 3.2: Analyze in R or Python

**In R:**
```r
# Load the data
health_acts <- read.csv("health_acts.csv")

# Summary statistics
summary(health_acts)

# Filter by date
recent_acts <- subset(health_acts, date >= "2020-01-01")

# Plot by year
library(ggplot2)
ggplot(health_acts, aes(x = substr(date, 1, 4))) +
  geom_bar() +
  labs(title = "Health Acts by Year", x = "Year", y = "Count")
```

**In Python:**
```python
import pandas as pd

# Load the data
df = pd.read_csv('health_acts.csv')

# Summary statistics
print(df.describe())

# Filter by date
recent = df[df['date'] >= '2020-01-01']

# Plot by year
import matplotlib.pyplot as plt
df['year'] = df['date'].str[:4]
df['year'].value_counts().sort_index().plot(kind='bar')
plt.title('Health Acts by Year')
plt.xlabel('Year')
plt.ylabel('Count')
plt.show()
```

---

### Step 3.3: Track Legislative Changes

Use version history to analyze amendments:

```bash
# Get version history
nzlegislation get "act/2020/67" --versions --format json > health_act_versions.json
```

**Analyze:**
- How many amendments?
- What sections changed?
- When were major reforms enacted?

---

## Stage 4: Citation & Writing (10 minutes)

### Step 4.1: Generate Citations

Create citations for your paper:

```bash
# NZMJ style (for New Zealand Medical Journal)
nzlegislation cite "act/2020/67" --style nzmj

# APA style (for social sciences)
nzlegislation cite "act/2020/67" --style apa

# BibTeX (for LaTeX papers)
nzlegislation cite "act/2020/67" --style bibtex
```

**Example output (NZMJ):**
```
Health Act 2020 (NZ) 2020/67.
```

**Example output (APA):**
```
Health Act 2020, Public Act 2020/67 (New Zealand).
```

---

### Step 4.2: Build Your Bibliography

Append multiple citations to a `.bib` file:

```bash
# Create bibliography
nzlegislation cite "act/1981/118" --style bibtex >> references.bib
nzlegislation cite "act/2020/67" --style bibtex >> references.bib
nzlegislation cite "act/2000/7" --style bibtex >> references.bib
```

**Then in LaTeX:**
```latex
\bibliographystyle{plain}
\bibliography{references}
```

---

### Step 4.3: Document Your Methods

For reproducibility, include:

```markdown
## Data Sources

Legislation data was retrieved from the NZ Legislation API 
(https://api.legislation.govt.nz/) using the NZ Legislation Tool 
(version 1.2.3) on 2026-03-10.

Search query: "health" --type act --status in-force
Total results: 15 Acts
Export format: CSV with metadata
```

**Pro tip:** The `--include-metadata` flag adds this information automatically to your CSV.

---

## Complete Workflow Example

Here's the full workflow in one script:

```bash
#!/bin/bash
# research-workflow.sh - Complete research workflow

echo "=== Stage 1: Discovery ==="
nzlegislation search --query "health" --type act --status in-force

echo -e "\n=== Stage 2: Data Collection ==="
nzlegislation export --query "health" --type act --status in-force \
  --output health_acts.csv --include-metadata

echo -e "\n=== Stage 3: Get Key Legislation Details ==="
nzlegislation get "act/2020/67" --versions --format json > health_act_versions.json

echo -e "\n=== Stage 4: Generate Citations ==="
echo "NZMJ Style:"
nzlegislation cite "act/2020/67" --style nzmj

echo -e "\nAPA Style:"
nzlegislation cite "act/2020/67" --style apa

echo -e "\n=== Workflow Complete ==="
echo "Files created:"
echo "  - health_acts.csv (dataset)"
echo "  - health_act_versions.json (version history)"
```

**Run it:**
```bash
bash research-workflow.sh
```

---

## Tips for Specific Research Types

### Health Policy Research

```bash
# Search for health-related Acts
nzlegislation search --query "health" --type act

# Find mental health legislation
nzlegislation search --query "mental health" --type act

# Search for public health laws
nzlegislation search --query "public health" --type act
```

**Key Acts to cite:**
- Health Act 2020 (`act/2020/67`)
- Mental Health Act 1981 (`act/1981/118`)
- New Zealand Public Health and Disability Act 2000 (`act/2000/7`)

---

### Social Policy Research

```bash
# Search for social welfare legislation
nzlegislation search --query "social welfare" --type act

# Find children's legislation
nzlegislation search --query "children" --type act

# Search by date (e.g., welfare reforms)
nzlegislation search --query "welfare reform" --from 2010-01-01 --to 2024-12-31
```

---

### Legal Research

```bash
# Find all Acts on a topic
nzlegislation search --query "contract law" --type act

# Include repealed legislation (for historical research)
nzlegislation search --query "employment" --status repealed

# Get full version history
nzlegislation get "act/1981/118" --versions
```

---

## Troubleshooting

### "I'm not finding relevant results"

**Try:**
- Broader search terms (e.g., "health" instead of "health reform")
- Removing filters (search all types, not just Acts)
- Checking spelling (use Māori and English terms)

---

### "I hit the rate limit"

**Solution:**
- Wait 5 minutes for burst limit to reset
- Or wait until midnight for daily limit
- Reduce batch sizes (export 100 at a time)

---

### "The CSV won't open in Excel"

**Fix it:**
1. Open Excel first
2. Go to Data → From Text/CSV
3. Select your file
4. Choose "Comma" as delimiter
5. Click Load

---

## Next Steps

**Ready for more?**

- [FAQ](./faq.md) - Common questions answered
- [Troubleshooting](./troubleshooting.md) - Step-by-step fixes for 21+ error scenarios
- [Export for Analysis](./export-for-analysis.md) *(Coming Soon)*
- [Citation Guide](./citation-guide.md) *(Coming Soon)*
- [Automation Scripts](./tutorials/automation-scripts.md) *(Coming Soon)*

**Need help?**

- [FAQ](./faq.md) - Common questions
- [Troubleshooting](./troubleshooting.md) - Step-by-step fixes

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
