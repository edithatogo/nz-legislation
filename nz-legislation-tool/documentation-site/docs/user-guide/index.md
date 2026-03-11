---
sidebar_position: 1
---

# User Guide

Welcome to the NZ Legislation Tool User Guide. This section covers all features and workflows.

## Quick Reference

### Common Tasks

| Task | Command |
|------|---------|
| Search legislation | `nzlegislation search --query "health"` |
| Get work details | `nzlegislation get "act_public_1989_18"` |
| Export to CSV | `nzlegislation export --query "health" --output results.csv` |
| Generate citation | `nzlegislation cite "act_public_1989_18" --style nzmj` |
| Show config | `nzlegislation config --show` |

## Documentation Sections

### Searching
- [Basic Search](./searching.md) - Simple queries and filters
- [Advanced Search](./searching.md#advanced-search) - Complex queries, date ranges
- [Search Examples](./searching.md#examples) - Common search patterns

### Exporting
- [CSV Export](./exporting.md#csv-format) - Excel-compatible format
- [JSON Export](./exporting.md#json-format) - Machine-readable format
- [NDJSON Export](./exporting.md#ndjson-format) - Streaming format

### Citations
- [NZMJ Format](./citations.md#nzmj) - New Zealand Medical Journal
- [APA Format](./citations.md#apa) - American Psychological Association
- [BibTeX Format](./citations.md#bibtex) - LaTeX/BibTeX
- [RIS Format](./citations.md#ris) - Reference manager format

### Research Workflow
- [End-to-End Workflow](./research-workflow.md) - Complete research process
- [Best Practices](./research-workflow.md#best-practices) - Tips and tricks
- [Reproducibility](./research-workflow.md#reproducibility) - Ensure reproducible results

## Command Reference

For detailed command documentation:

- [`search`](../commands/search.md) - Search legislation
- [`get`](../commands/get.md) - Get work details
- [`export`](../commands/export.md) - Export search results
- [`cite`](../commands/cite.md) - Generate citations
- [`config`](../commands/config.md) - Manage configuration
- [`batch`](../commands/batch.md) - Batch operations
- [`stream`](../commands/stream.md) - Stream large exports

## Getting Help

```bash
# General help
nzlegislation --help

# Command-specific help
nzlegislation search --help

# Interactive help menu
nzlegislation help-interactive
```

## Next Steps

- [Searching Legislation](./searching.md) - Learn to search effectively
- [Exporting Data](./exporting.md) - Export for analysis
- [Research Workflow](./research-workflow.md) - Complete workflow guide

---

**Need Help?** Check the [FAQ](../troubleshooting/faq.md) or [Report an Issue](https://github.com/edithatogo/nz-legislation/issues).
