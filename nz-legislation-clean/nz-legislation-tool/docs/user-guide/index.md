# User Guide

**Your complete guide to using the NZ Legislation Tool**

---

## Welcome!

This guide will help you get the most out of the NZ Legislation Tool. Whether you're a researcher, student, developer, or administrator, you'll find workflows and tips tailored to your needs.

**New to the tool?** Start with our [Quick Start Guide](../../README.md#-quick-start-5-minutes).

---

## 📚 What's Inside

### For Researchers
- [Research Workflow](./research-workflow.md) - Complete end-to-end workflow
- [Export for Analysis](./export-for-analysis.md) *(Coming Soon)*
- [Citation Guide](./citation-guide.md) *(Coming Soon)*

### For Students
- [Assignment Basics](./assignment-basics.md) *(Coming Soon)*
- [Common Searches](./common-searches.md) *(Coming Soon)*
- [Export to Excel](./export-to-excel.md) *(Coming Soon)*

### For Developers
- [JSON Parsing](./json-parsing.md) *(Coming Soon)*
- [Automation Scripts](./automation-scripts.md) *(Coming Soon)*
- [Integration Examples](./integration-examples.md) *(Coming Soon)*

### For Administrators
- [Team Setup](./team-setup.md) *(Coming Soon)*
- [API Key Management](./api-key-management.md) *(Coming Soon)*
- [Monitoring Usage](./monitoring-usage.md) *(Coming Soon)*

---

## 🎯 Quick Reference

### Common Tasks

| Task | Command | Example |
|------|---------|---------|
| **Search** | `nzlegislation search --query "..."` | `nzlegislation search --query "health"` |
| **Get details** | `nzlegislation get "ID"` | `nzlegislation get "act/2020/67"` |
| **Export to CSV** | `nzlegislation export --query "..." --output file.csv` | `nzlegislation export --query "health" --output results.csv` |
| **Generate citation** | `nzlegislation cite "ID"` | `nzlegislation cite "act/2020/67"` |
| **Check config** | `nzlegislation config --show` | (shows current settings) |

### Filters

| Filter | Option | Example |
|--------|--------|---------|
| **Type** | `--type` | `--type act` |
| **Status** | `--status` | `--status in-force` |
| **Date from** | `--from` | `--from 2020-01-01` |
| **Date to** | `--to` | `--to 2024-12-31` |
| **Limit** | `--limit` | `--limit 50` |

---

## 🎓 Tutorials

### Beginner Tutorials
1. [Your First Search](./tutorials/first-search.md) *(Coming Soon)*
2. [Export to Excel](./tutorials/export-to-excel.md) *(Coming Soon)*
3. [Create Citations](./tutorials/create-citations.md) *(Coming Soon)*

### Intermediate Tutorials
1. [Advanced Filtering](./tutorials/advanced-filtering.md) *(Coming Soon)*
2. [Batch Operations](./tutorials/batch-operations.md) *(Coming Soon)*
3. [Working with Dates](./tutorials/working-with-dates.md) *(Coming Soon)*

### Advanced Tutorials
1. [Automation Scripts](./tutorials/automation-scripts.md) *(Coming Soon)*
2. [API Integration](./tutorials/api-integration.md) *(Coming Soon)*
3. [Performance Optimization](./tutorials/performance-optimization.md) *(Coming Soon)*

---

## ❓ Need Help?

- **[FAQ](./faq.md)** - Common questions answered
- **[Troubleshooting](./troubleshooting.md)** - Step-by-step fixes
- **[Glossary](./glossary.md)** - Technical terms explained simply
- **[Accessibility](./accessibility-search.md)** - Accessibility features & search tips
- **[Command Reference](./commands/)** - Detailed command documentation
- **[GitHub Discussions](https://github.com/edithatogo/nz-legislation-tool/discussions)** - Ask the community

---

## ♿ Accessibility

This documentation aims to meet WCAG 2.1 AA standards for accessibility.

**Features:**
- ✅ Screen reader compatible structure
- ✅ Keyboard navigation supported
- ✅ High contrast text formatting
- ✅ Descriptive link text (no "click here")
- ✅ Clear heading hierarchy
- ✅ Plain language (Grade 8-10 reading level)

**Issues?** If you encounter accessibility barriers, please [open an issue](https://github.com/edithatogo/nz-legislation-tool/issues) or [contact us](mailto:dylan.mordaunt@vuw.ac.nz).

---

## 📖 Related Documentation

- **[README](../../README.md)** - Quick start and overview
- **[Developer Guide](../developer-guide/)** - For contributors
- **[API Reference](../developer-guide/api-reference/)** - Technical details
- **[Contributing](../../CONTRIBUTING.md)** - How to help

---

**Last Updated:** 2026-03-10  
**Version:** 1.0.0
