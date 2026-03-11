---
sidebar_position: 3
---

# Generating Citations

This guide covers generating citations in various academic formats.

## Supported Citation Styles

| Style | Use Case | Example |
|-------|----------|---------|
| NZMJ | New Zealand Medical Journal | `New Zealand Public Health and Disability Act 2000, Public Act 2000 No 91 (NZ).` |
| APA | American Psychological Association | `New Zealand Public Health and Disability Act 2000 (NZ).` |
| BibTeX | LaTeX/BibTeX | `@legislation{...}` |
| RIS | Reference managers (EndNote, Zotero) | `TY - STAT` |

## Basic Citation

```bash
nzlegislation cite "act_public_1989_18"
```

Default output (NZMJ format):
```
New Zealand Public Health and Disability Act 2000, Public Act 2000 No 91 (NZ).
```

## Citation Styles

### NZMJ Format

```bash
nzlegislation cite "act_public_1989_18" --style nzmj
```

Output:
```
New Zealand Public Health and Disability Act 2000, Public Act 2000 No 91 (NZ).
```

### APA Format

```bash
nzlegislation cite "act_public_1989_18" --style apa
```

Output:
```
New Zealand Public Health and Disability Act 2000 (NZ).
```

### BibTeX Format

```bash
nzlegislation cite "act_public_1989_18" --style bibtex
```

Output:
```bibtex
@legislation{nz-public-health-2000,
  title = {New Zealand Public Health and Disability Act 2000},
  year = {2000},
  number = {91},
  type = {Public Act},
  country = {NZ}
}
```

### RIS Format

```bash
nzlegislation cite "act_public_1989_18" --style ris
```

Output:
```
TY  - STAT
TI  - New Zealand Public Health and Disability Act 2000
PY  - 2000
PB  - New Zealand
ER  -
```

## Citation Options

| Option | Description | Default |
|--------|-------------|---------|
| `--style` | Citation style | nzmj |
| `--output` | Output file | stdout |

## Examples

### Example 1: Cite in Paper (NZMJ)

```bash
# Generate citation
nzlegislation cite "act_public_1989_18" --style nzmj

# Copy to clipboard (macOS)
nzlegislation cite "act_public_1989_18" --style nzmj | pbcopy

# Copy to clipboard (Windows)
nzlegislation cite "act_public_1989_18" --style nzmj | clip
```

### Example 2: Add to BibTeX File

```bash
# Append to references.bib
nzlegislation cite "act_public_1989_18" --style bibtex >> references.bib
```

### Example 3: Export to Reference Manager

```bash
# Export to RIS file
nzlegislation cite "act_public_1989_18" --style ris > citation.ris

# Import into Zotero, EndNote, or Mendeley
```

### Example 4: Cite Multiple Acts

```bash
# Create bibliography
for id in act_public_1989_18 act_public_1956_68; do
    nzlegislation cite "$id" --style nzmj
done
```

## Citation Components

### Full Title

The complete title of the legislation:
```
New Zealand Public Health and Disability Act 2000
```

### Short Title

Abbreviated title (if available):
```
Public Health Act
```

### Year

Year of enactment:
```
2000
```

### Act Number

Official act number:
```
Public Act 2000 No 91
```

### Jurisdiction

Country code:
```
(NZ)
```

## Style Guides

### NZMJ Style Guide

**Format:**
```
[Act Title] [Year], Public Act [Year] No [Number] (NZ).
```

**Example:**
```
New Zealand Public Health and Disability Act 2000, Public Act 2000 No 91 (NZ).
```

### APA Style Guide

**Format:**
```
[Act Title] [Year] ([Jurisdiction]).
```

**Example:**
```
New Zealand Public Health and Disability Act 2000 (NZ).
```

## Tips for Academic Writing

### 1. First Citation

Include full citation on first mention:
```
The New Zealand Public Health and Disability Act 2000, Public Act 2000 No 91 (NZ), 
establishes the framework for...
```

### 2. Subsequent Citations

Use short form:
```
The Act (2000) provides...
```

### 3. Multiple Citations

```
Several acts govern health policy (Health Act 1956; New Zealand Public Health 
and Disability Act 2000).
```

## Troubleshooting

### Citation Not Found

```bash
# Verify work ID
nzlegislation get "act_public_1989_18"

# Check spelling
nzlegislation cite "act_public_1989_18"
```

### Incorrect Format

```bash
# Specify style explicitly
nzlegislation cite "act_public_1989_18" --style apa
```

## Next Steps

- [Research Workflow](./research-workflow.md) - Complete workflow
- [Exporting Data](./exporting.md) - Export search results
- [Searching Legislation](./searching.md) - Find legislation

---

**Need Help?** Check the [FAQ](../troubleshooting/faq.md) or [Report an Issue](https://github.com/edithatogo/nz-legislation/issues).
