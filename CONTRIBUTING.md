# Contributing to ANZ Legislation

Thank you for your interest in contributing to ANZ Legislation. This document provides guidelines and instructions for contributing to the project. The published package and CLI names remain on the legacy `nz-legislation-tool` path during the transition.

## 🎯 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Release Process](#release-process)
- [Questions?](#questions)

---

## 🤝 Code of Conduct

Please be respectful and constructive in your interactions. We're committed to providing a welcoming and inspiring community for all.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS versions: 18, 20, 22)
- **`pnpm`** 9+ (package manager)
- **Git** for version control
- **GitHub account** for contributing

### Setup

1. **Fork the repository**

   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/nz-legislation.git
   cd nz-legislation
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment**

   ```bash
   cp .env.example .env
   # Edit .env with your NZ Legislation API key
   ```

4. **Verify setup**
   ```bash
   pnpm dev -- --help
   pnpm test:run
   ```

---

## 🔄 Development Workflow

### Branch Strategy

- **main** - Production-ready code (protected)
- **feature/** - New features (e.g., `feature/add-csv-export`)
- **fix/** - Bug fixes (e.g., `fix/rate-limiting-error`)
- **chore/** - Maintenance (e.g., `chore/update-dependencies`)
- **docs/** - Documentation updates
- **test/** - Test additions/updates

### Creating a Branch

```bash
# Always branch from main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name
```

---

## ✏️ Making Changes

### 1. Make Your Changes

Edit the code, add features, fix bugs, etc.

### 2. Create a Changeset

For any user-facing changes, create a changeset:

```bash
pnpm changeset
```

Follow the prompts to:

- Select the package (nz-legislation-tool)
- Choose version bump type (major/minor/patch)
- Add a descriptive message

**Examples:**

- Patch: "Fix rate limiting configuration error"
- Minor: "Add CSV export format for search results"
- Major: "Change authentication method from query parameter to header"

### 3. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "type: description"

# Examples:
git commit -m "feat: add CSV export functionality"
git commit -m "fix: resolve rate limiting configuration issue"
git commit -m "docs: update installation instructions"
git commit -m "test: add integration tests for search API"
```

**Commit Types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `test:` - Tests
- `refactor:` - Code refactoring
- `chore:` - Maintenance
- `perf:` - Performance improvement
- `style:` - Formatting/style
- `ci:` - CI/CD changes

---

## 📬 Pull Request Process

### Before Submitting

1. **Update your branch**

   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run quality checks**

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm format
   pnpm test:run
   ```

3. **Verify changeset exists**
   ```bash
   ls .changeset/
   ```

### Submitting the PR

1. **Push your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR on GitHub**
   - Go to https://github.com/edithatogo/nz-legislation
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template completely

3. **PR Title Format**

   ```
   type: description

   Examples:
   feat: add CSV export functionality
   fix: resolve rate limiting issue
   ```

### PR Review Process

- ✅ All CI/CD checks must pass
- ✅ At least 1 approval required
- ✅ Address all review comments
- ✅ Keep PR focused and reasonably sized

---

## 💻 Coding Standards

### TypeScript

- Use strict mode (`strict: true` in tsconfig.json)
- No `any` types - use proper type definitions
- Export types and interfaces for public APIs
- Use async/await for asynchronous code

**Example:**

```typescript
// ✅ Good
export interface SearchParams {
  query: string;
  limit?: number;
}

export async function searchWorks(params: SearchParams): Promise<SearchResults> {
  // Implementation
}

// ❌ Avoid
export async function searchWorks(params: any): Promise<any> {
  // Implementation
}
```

### Error Handling

- Use custom error classes for domain-specific errors
- Provide helpful error messages with suggestions
- Log errors with appropriate context

**Example:**

```typescript
// ✅ Good
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public suggestion?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

throw new APIError('Rate limit exceeded', 429, 'Wait 60 seconds before retrying');
```

### Code Organization

- Group related functionality in modules
- Use path aliases for imports (`@utils`, `@models`, etc.)
- Keep files focused and reasonably sized (<500 lines)

**Example:**

```typescript
import { searchWorks } from '@client';
import { formatAsCSV } from '@output/formatters';
import type { Work } from '@models/work';
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test src/client.test.ts
```

### Writing Tests

- Use Vitest test framework
- Name test files: `*.test.ts`
- Place tests in `tests/` or alongside source (`src/*.test.ts`)
- Use descriptive test names

**Example:**

```typescript
import { describe, it, expect } from 'vitest';
import { searchWorks } from '../client';

describe('searchWorks', () => {
  it('should return works matching the query', async () => {
    const results = await searchWorks({ query: 'health', limit: 5 });

    expect(results).toBeDefined();
    expect(results.works).toBeInstanceOf(Array);
    expect(results.works.length).toBeLessThanOrEqual(5);
  });
});
```

### Test Coverage

- Aim for >80% coverage
- Test happy path and error cases
- Include edge cases and boundary conditions

---

## 📚 Documentation

### README Updates

Update the README.md if you:

- Add new features or commands
- Change installation steps
- Modify configuration options
- Add or change examples

### Code Comments

- Add JS doc comments for exported functions
- Explain complex logic
- Document parameters and return values

**Example:**

```typescript
/**
 * Search for legislation works matching the query.
 *
 * @param params - Search parameters
 * @param params.query - Search query string
 * @param params.limit - Maximum number of results (default: 10)
 * @returns Search results with matching works
 * @throws {APIError} If the API request fails
 */
export async function searchWorks(params: SearchParams): Promise<SearchResults> {
  // Implementation
}
```

---

## 🚀 Release Process

### Automated Releases

This project uses Changesets for automated releases:

1. **Contributors create changesets** with their PRs
2. **When PR is merged to main**, Changesets action runs
3. **Version Packages PR is created** automatically
4. **When Version PR is merged**, release is published to npm

### Manual Release (Maintainers Only)

```bash
# 1. Ensure all changesets are committed
git pull origin main

# 2. Bump versions and update changelog
pnpm changeset:version

# 3. Review changes
git diff

# 4. Commit and push
git commit -m "chore: version packages"
git push origin main

# 5. Publish to npm
pnpm changeset:publish
```

---

## ❓ Questions?

### Common Issues

**Q: How do I get an API key?**
A: Contact the NZ Legislation API team or check the README for setup instructions.

**Q: Tests are failing locally**
A: Ensure your `.env` file has a valid API key and run `pnpm install` to update dependencies.

**Q: How do I add a new command?**
A: Create a new file in `src/commands/`, export the command function, and register it in `src/cli.ts`.

### Getting Help

- 📖 Check the [README](README.md) for setup and usage
- 📚 Review the [CHANGESETS.md](CHANGESETS.md) for versioning
- 🐛 Open an issue for bugs or feature requests
- 💬 Discuss in GitHub Discussions

---

## 🎉 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

**Happy coding! 🚀**

---

**Last Updated:** 2026-03-10
**License:** Apache 2.0
