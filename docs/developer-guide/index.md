# Developer Guide

**For contributors and developers building with the NZ Legislation Tool**

---

## Welcome!

This guide is for developers who want to:

- Contribute to the NZ Legislation Tool
- Integrate the API into their own applications
- Understand the architecture and codebase
- Set up a development environment

**New to the tool?** Start with the [User Guide](../user-guide/) first.

---

## 📚 What's Inside

### Getting Started

- [Development Setup](./development-setup.md) - Set up your dev environment
- [Architecture Overview](./architecture.md) - System design and structure
- [Code Style Guide](./code-style.md) - Coding standards and conventions

### API Reference

- [API Reference](./api-reference.md) - Complete API documentation
- [Error Reference](./error-reference.md) - Error messages and solutions
- [Models & Types](./api-reference.md#models--types) - TypeScript types and schemas
- [Output Formatters](./api-reference.md#output-formatters) - Formatting utilities

### Contributing

- [Contributing Guide](./contributing.md) - How to contribute
- [Testing Guide](./testing.md) - Running and writing tests
- [Code Review](./code-review.md) - Review process and standards

### Advanced Topics

- [Module Documentation](./modules/) - Detailed module docs
- [MCP Server](./mcp-server.md) - Model Context Protocol integration
- [Performance](./performance.md) - Optimization tips

---

## 🚀 Quick Start for Developers

### 1. Clone the Repository

```bash
git clone https://github.com/edithatogo/nz-legislation-tool
cd nz-legislation-tool
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your API key
# Get your free API key from: https://api.legislation.govt.nz/docs/
```

### 4. Run in Development Mode

```bash
# Run with live reload
npm run dev -- search --query "health"

# Run tests in watch mode
npm test

# Type check
npm run typecheck
```

---

## 🏗️ Architecture Overview

The NZ Legislation Tool is built with TypeScript using modern ES modules.

### High-Level Structure

```
nz-legislation-tool/
├── src/
│   ├── cli.ts              # Main CLI entry point
│   ├── client.ts           # API client (HTTP requests)
│   ├── config.ts           # Configuration management
│   ├── errors.ts           # Error classes and handling
│   ├── commands/           # CLI commands
│   │   ├── search.ts
│   │   ├── get.ts
│   │   ├── export.ts
│   │   ├── cite.ts
│   │   └── config.ts
│   ├── models/             # Zod schemas & types
│   ├── output/             # Output formatters
│   └── utils/              # Utility functions
├── tests/                  # Test files
├── docs/                   # Documentation
└── .github/                # CI/CD workflows
```

### Key Design Patterns

1. **Command Pattern** - Each CLI command is a separate module
2. **Schema Validation** - Zod for runtime type checking
3. **Error Boundaries** - Centralized error handling
4. **Output Separation** - Formatters decoupled from logic

For detailed architecture, see [Architecture Overview](./architecture.md).

---

## 📖 API Reference

### Search for Legislation

```typescript
import { searchWorks } from '@client';

const results = await searchWorks({
  query: 'health',
  type: 'act',
  status: 'in-force',
  limit: 25,
});

console.log(`Found ${results.total} results`);
```

### Get Legislation by ID

```typescript
import { getWork } from '@client';

const work = await getWork('act/2020/67');
console.log(work.title);
```

### Export to CSV

```typescript
import { worksToCsv } from '@output/formatters';

const csv = worksToCsv(results);
console.log(csv);
```

### Generate Citation

```typescript
import { generateCitation } from '@output/citations';

const citation = generateCitation(work, 'nzmj');
console.log(citation);
```

For complete API reference, see [API Reference](./api-reference/).

---

## 🧪 Testing

### Run Tests

```bash
# All tests in watch mode
npm test

# Run once
npm run test:run

# With coverage
npm run test:coverage

# Specific test file
npm run test:run -- tests/client.test.ts
```

### Test Categories

- **Unit Tests** - Core logic testing
- **Integration Tests** - API integration (with MSW mocking)
- **E2E Tests** - Full CLI workflows
- **Property Tests** - Invariant testing (fast-check)
- **Hypothesis Tests** - Reproducibility testing

For detailed testing guide, see [Testing Guide](./testing.md).

---

## 🔧 Development Tools

### Available Scripts

```bash
# Development
npm run dev          # Run in development mode
npm run build        # Build for production
npm run typecheck    # Type check only

# Testing
npm test             # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run with coverage

# Code Quality
npm run lint         # Lint code
npm run format       # Format with Prettier
npm run lint:fix     # Fix lint issues

# Utilities
npm run bench        # Run benchmarks
npm run clean        # Clean build artifacts
```

### IDE Setup

**VS Code (Recommended):**

Install these extensions:

- ESLint
- Prettier
- Vitest UI

**Settings:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 1. Find an Issue

Look for issues labeled:

- [`good first issue`](https://github.com/edithatogo/nz-legislation-tool/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- [`help wanted`](https://github.com/edithatogo/nz-legislation-tool/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)

### 2. Fork and Clone

```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR_USERNAME/nz-legislation-tool
cd nz-legislation-tool
git remote add upstream https://github.com/edithatogo/nz-legislation-tool
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Make Changes

Follow the [Code Style Guide](./code-style.md) and write tests.

### 5. Submit a PR

```bash
git push origin feature/your-feature-name
# Then create a pull request on GitHub
```

For complete contributing guide, see [Contributing Guide](./contributing.md).

---

## 📚 Related Documentation

### User Documentation

- [User Guide](../user-guide/) - For end users
- [FAQ](../user-guide/faq.md) - Common questions
- [Troubleshooting](../user-guide/troubleshooting.md) - Error fixes

### External Resources

- [NZ Legislation API](https://api.legislation.govt.nz/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Node.js Documentation](https://nodejs.org/)
- [Commander.js](https://github.com/tj/commander.js)
- [Zod Documentation](https://zod.dev/)

---

## 📬 Need Help?

**Developer Questions:**

- 🐛 **Found a bug?** [Open an issue](https://github.com/edithatogo/nz-legislation-tool/issues)
- 💡 **Suggest a feature** - [Start a discussion](https://github.com/edithatogo/nz-legislation-tool/discussions)
- 📧 **Email:** dylan.mordaunt@vuw.ac.nz

**Response time:** We aim to respond within 2 business days.

---

## ♿ Accessibility

This documentation aims to meet WCAG 2.1 AA standards. If you encounter accessibility barriers, please [open an issue](https://github.com/edithatogo/nz-legislation-tool/issues) or [contact us](mailto:dylan.mordaunt@vuw.ac.nz).

**Features:**

- ✅ Screen reader compatible
- ✅ Keyboard navigation supported
- ✅ High contrast text
- ✅ Descriptive link text

---

**Last Updated:** 2026-03-10  
**Version:** 1.0.0  
**Track:** Documentation Optimization & Humanization  
**Phase:** 4 - Developer Documentation
