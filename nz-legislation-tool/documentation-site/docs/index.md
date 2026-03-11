---
sidebar_position: 1
---

# NZ Legislation Tool Documentation

Welcome to the **NZ Legislation Tool** documentation - your comprehensive guide to researching and analyzing New Zealand healthcare legislation.

## 🎯 What is the NZ Legislation Tool?

A research-grade CLI tool that leverages the New Zealand Legislation API to analyze, track, and visualize healthcare-related legislation and regulatory changes. Designed for healthcare researchers, policy analysts, and academics.

## 🚀 Quick Start

Get started in 5 minutes:

```bash
# Install globally
npm install -g nz-legislation-tool

# Configure your API key
nzlegislation config --key YOUR_API_KEY

# Search for health-related legislation
nzlegislation search --query "health" --limit 10
```

## 📚 Documentation Sections

### Getting Started
- [Quick Start](./quick-start.md) - Install and run your first search
- [Installation](./installation.md) - Detailed installation guide
- [Configuration](./configuration.md) - API key setup and options

### User Guide
- [Searching Legislation](./user-guide/searching.md) - Find relevant legislation
- [Exporting Data](./user-guide/exporting.md) - Export to CSV, JSON
- [Generating Citations](./user-guide/citations.md) - NZMJ, BibTeX, APA formats
- [Research Workflow](./user-guide/research-workflow.md) - End-to-end research process

### CLI Commands
- [`search`](./commands/search.md) - Search legislation
- [`get`](./commands/get.md) - Get work details
- [`export`](./commands/export.md) - Export search results
- [`cite`](./commands/cite.md) - Generate citations
- [`config`](./commands/config.md) - Manage configuration
- [`batch`](./commands/batch.md) - Batch operations
- [`stream`](./commands/stream.md) - Stream large exports

### API Reference
- [Client API](./api-reference/client.md) - Programmatic access
- [Data Models](./api-reference/models.md) - TypeScript types
- [Error Handling](./api-reference/errors.md) - Error types and codes

### Developer Guide
- [Architecture](./developer-guide/architecture.md) - System overview
- [Contributing](./developer-guide/contributing.md) - How to contribute
- [Testing](./developer-guide/testing.md) - Running tests

### Troubleshooting
- [Common Issues](./troubleshooting/common-issues.md) - FAQs
- [Error Reference](./troubleshooting/error-reference.md) - Error codes
- [FAQ](./troubleshooting/faq.md) - Frequently asked questions

## 🎓 Research Programme

This tool supports a five-paper research programme analyzing NZ health legislation for 2026 election policy relevance, with target publication in the **New Zealand Medical Journal (NZMJ)**.

## 📊 Key Features

- ✅ **API Integration**: Seamless connection to NZ Legislation API
- ✅ **Healthcare Filtering**: Specialized queries for health statutes
- ✅ **Data Export**: CSV, JSON, NDJSON formats
- ✅ **Citation Support**: NZMJ, BibTeX, APA, RIS formats
- ✅ **Batch Operations**: Process multiple works efficiently
- ✅ **Streaming**: Handle large exports without memory issues
- ✅ **Rate Limiting**: Respects API quotas automatically
- ✅ **Caching**: Reduces redundant API calls

## 🔗 Quick Links

- [GitHub Repository](https://github.com/edithatogo/nz-legislation)
- [NZ Legislation API](https://api.legislation.govt.nz)
- [Report an Issue](https://github.com/edithatogo/nz-legislation/issues)
- [npm Package](https://www.npmjs.com/package/nz-legislation-tool)

---

**Last Updated:** March 11, 2026  
**Version:** 1.1.0
