# Contributing to NZ Legislation Tool

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## 🎯 Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to maintain a welcoming and inclusive community.

## 📋 Quick Start

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linter (`npm run lint`)
6. Commit your changes (pre-commit hooks will auto-format)
7. Push to your fork
8. Open a Pull Request

## 🚀 Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/nz-legislation.git

# Navigate to project
cd nz-legislation-tool

# Install dependencies
npm install

# Set up API key (for testing)
export NZ_LEGISLATION_API_KEY=your_key_here

# Run in development mode
npm run dev -- search --query "health"
```

## 📝 Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style (auto-formatted by Prettier)
- [ ] All tests pass (`npm test`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Commit messages are clear and descriptive
- [ ] Updated documentation if applicable

### PR Template

Use the provided [PR template](.github/PULL_REQUEST_TEMPLATE.md) which includes:

- Description of changes
- Related issues
- Type of change checklist
- Testing checklist
- Additional notes

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test tests/specific.test.ts

# Run benchmarks
npm run bench
```

## 📦 Dependencies

```bash
# Add new dependency
npm install package-name

# Add dev dependency
npm install -D package-name

# Check for unused dependencies
npx depcheck
```

## 🔧 Maintenance

The repository has automated maintenance:

- **Pre-commit hooks:** Auto-format and lint staged files
- **CI/CD:** Runs tests, lint, and typecheck on every PR
- **Renovate:** Automatically updates dependencies
- **Weekly maintenance:** Automated security and quality checks

## 📖 Documentation

- **README.md** - Main documentation
- **MAINTENANCE_GUIDE.md** - Maintenance procedures
- **MCP_GUIDE.md** - MCP server documentation
- **API Documentation** - Generated from TypeScript types

## 🐛 Reporting Issues

- Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug-report.yml)
- Search existing issues first
- Provide reproduction steps
- Include environment details (Node version, OS, package version)

## 💡 Feature Requests

- Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature-request.yml)
- Describe the problem you're solving
- Provide usage examples
- Indicate priority

## 🏷️ Issue Labels

| Label              | Description                |
| ------------------ | -------------------------- |
| `bug`              | Something isn't working    |
| `enhancement`      | New feature or request     |
| `documentation`    | Documentation improvements |
| `good first issue` | Good for newcomers         |
| `help wanted`      | Extra attention needed     |
| `maintenance`      | Repository maintenance     |
| `security`         | Security-related           |

## 📜 License

By contributing, you agree that your contributions will be licensed under the [Apache 2.0 License](LICENSE).

## ❓ Questions?

- Check existing [documentation](README.md)
- Search [closed issues](https://github.com/edithatogo/nz-legislation/issues?q=is%3Aissue+is%3Aclosed)
- Open a new issue for questions

---

Thank you for contributing to NZ Legislation Tool! 🎉
