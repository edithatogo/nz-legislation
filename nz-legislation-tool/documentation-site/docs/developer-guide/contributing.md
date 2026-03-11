# Contributing to NZ Legislation Tool

Thank you for your interest in contributing to the NZ Legislation Tool!

## How to Contribute

### Reporting Issues

- Use GitHub Issues to report bugs or suggest features
- Include detailed steps to reproduce
- Provide environment information (Node.js version, OS, etc.)

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Commit Message Convention

We follow the Conventional Commits specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `test:` Test additions or changes
- `refactor:` Code refactoring (no behavior change)
- `chore:` Maintenance tasks
- `ci:` CI/CD changes
- `perf:` Performance improvements

Example:
```
feat: Add rate limit configuration

Add support for configurable API rate limits.

Closes #123
```

## Development Setup

```bash
# Clone repository
git clone <repository-url>
cd nz-legislation-tool

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API key

# Run in development mode
npm run dev -- search --query "health"
```

## Code Quality

```bash
# Type check
npm run typecheck

# Run tests
npm test

# Build
npm run build
```

## Documentation Contributions

When contributing documentation:

1. Edit files in `documentation-site/docs/`
2. Test locally: `npm run start` (in documentation-site folder)
3. Build to check for broken links: `npm run build`
4. Commit and push

## Review Process

- All PRs require at least 1 approval
- CI/CD must pass (lint, test, build)
- Address all review comments
- Squash and merge (for feature branches)

## Questions?

- Check existing [Issues](https://github.com/edithatogo/nz-legislation/issues)
- Read the [Developer Guide](./index.md)
- Contact maintainers via GitHub Discussions

---

**Related:**
- [Architecture](./architecture.md)
- [Testing](./testing.md)
- [Error Reference](../troubleshooting/error-reference.md)
