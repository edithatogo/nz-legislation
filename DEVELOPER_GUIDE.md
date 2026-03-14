# Developer Guide

Welcome to the ANZ Legislation development team. This guide will help you get set up and contributing in under 30 minutes. The repo is transitioning in public branding, but the package and CLI names remain on the current `nz-legislation-tool` path for compatibility.

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **VS Code** (Recommended IDE - [Download](https://code.visualstudio.com/))

### 2. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/edithatogo/nz-legislation.git
cd nz-legislation

# Install dependencies
npm install

# Copy environment example
cp .env.example .env

# Edit .env with your API key (get from https://api.legislation.govt.nz/docs/)
```

### 3. Verify Setup

```bash
# Run in development mode
npm run dev -- search --query "health" --limit 5

# Run tests
npm test

# Type check
npm run typecheck
```

✅ If all commands succeed, you're ready to contribute!

---

## 🛠 Development Workflows

### Running in Development Mode

```bash
# Hot reload enabled (auto-restarts on changes)
npm run dev -- <command>

# Examples
npm run dev -- search --query "health"
npm run dev -- get "act_public_1989_18"
npm run dev -- export --query "health" --output test.csv
npm run dev -- cite "act_public_1989_18" --style nzmj
npm run dev -- config --show
```

### Testing

```bash
# Run tests in watch mode (re-runs on changes)
npm test

# Run tests once
npm run test:run

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test -- tests/client.test.ts

# Run with mutation testing
npm run test:mutation
```

### Code Quality

```bash
# Type check (no emit)
npm run typecheck

# Lint with ESLint
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting (CI/CD)
npm run format:check
```

### Building

```bash
# Compile TypeScript to dist/
npm run build

# Analyze bundle size
npm run build:analyze
```

---

## 🐛 Debugging

### VS Code Debug Configuration

This project includes pre-configured debug setups in `.vscode/launch.json`:

- **Debug CLI - Search**: Debug search command
- **Debug CLI - Get**: Debug get command
- **Debug CLI - Export**: Debug export command
- **Debug CLI - Cite**: Debug cite command
- **Debug MCP Server**: Debug MCP server
- **Run Tests**: Debug test suite

**To debug:**

1. Set breakpoints in your code (click left of line number)
2. Press `F5` or go to Run and Debug panel
3. Select a debug configuration
4. Click the green play button

### Verbose Logging

```bash
# Enable verbose logging
npm run dev -- search --query "health" --verbose

# Or set environment variable
export DEBUG=nzlegislation:*
npm run dev -- search --query "health"
```

### Log Files

Error logs are stored at:

- **Linux/macOS:** `~/.nz-legislation-tool/logs/error-YYYY-MM-DD.log`
- **Windows:** `%USERPROFILE%\.nz-legislation-tool\logs\error-YYYY-MM-DD.log`

View recent logs:

```bash
cat ~/.nz-legislation-tool/logs/error-*.log
```

### Performance Profiling

```bash
# Run benchmarks
npm run bench

# Profile with clinic.js (advanced)
npx clinic doctor -- node dist/cli.js search --query "health"
```

---

## 📝 Contributing

### Branch Strategy

- **main**: Protected branch, auto-deploys to npm
- **feature/**: New features (e.g., `feature/add-filter-command`)
- **fix/**: Bug fixes (e.g., `fix/handle-timeout-errors`)
- **chore/**: Maintenance (e.g., `chore/update-dependencies`)

### Commit Message Format

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Tests
- `refactor:` Code refactoring
- `chore:` Maintenance
- `ci:` CI/CD
- `perf:` Performance

**Examples:**

```bash
feat: Add rate limit configuration
fix: Handle API timeout errors gracefully
docs: Update README with new features
test: Add tests for CSV export
refactor: Simplify logger clearOldLogs method
chore: Update dependencies
```

### Pull Request Process

1. **Create branch**

   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes** with hot reload

   ```bash
   npm run dev -- <command>
   ```

3. **Run tests**

   ```bash
   npm test
   ```

4. **Type check**

   ```bash
   npm run typecheck
   ```

5. **Lint and format**

   ```bash
   npm run lint:fix
   npm run format
   ```

6. **Commit** (pre-commit hooks run automatically)

   ```bash
   git add .
   git commit -m "feat: Your feature description"
   ```

7. **Push and create PR**
   ```bash
   git push origin feature/your-feature
   ```

### Pre-commit Hooks

This project uses Husky with lint-staged. On every commit:

- ESLint runs on staged `.ts` files with auto-fix
- TypeScript type checking runs
- Prettier formats `.json` and `.md` files

If hooks fail, fix the issues and try again.

---

## 🧪 Testing Guidelines

### Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  it('should expected_behavior', () => {
    // Arrange
    // Act
    // Assert
    expect(actual).toBe(expected);
  });
});
```

### Test Types

- **Unit Tests**: Test individual functions/modules
- **Integration Tests**: Test API interactions (MSW mocked)
- **E2E Tests**: Test full CLI commands (`execa`)
- **Property Tests**: Test invariants with fast-check
- **Hypothesis Tests**: Test consistency/reproducibility

### Running Specific Tests

```bash
# By file
npm test -- tests/client.test.ts

# By test name pattern
npm test -- -t "should handle empty results"

# By directory
npm test -- tests/integration/
```

---

## 🔧 Common Issues

### API Key Not Working

```bash
# Check configuration
nzlegislation config --show

# Re-set API key
nzlegislation config --key YOUR_API_KEY
```

### Tests Failing

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Re-run tests
npm run test:run
```

### Build Fails

```bash
# Clean and rebuild
rm -rf dist/ node_modules/
npm install
npm run build
```

### TypeScript Errors

```bash
# Check for type errors
npm run typecheck

# Fix common issues:
# - Missing return types
# - Import path issues (use @ aliases)
# - Zod schema mismatches
```

---

## 📚 Resources

- **[README.md](../README.md)**: User documentation
- **[TESTING.md](../TESTING.md)**: Comprehensive testing guide
- **[CONTRIBUTING.md](../CONTRIBUTING.md)**: Contribution guidelines
- **[MCP_GUIDE.md](../MCP_GUIDE.md)**: MCP server documentation
- **[API Documentation](https://api.legislation.govt.nz/docs/)**: NZ Legislation API

---

## 🎯 Development Environment Setup

### VS Code Extensions (Recommended)

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)
- **Vitest** (`vitest.explorer`)
- **GitLens** (`eamodio.gitlens`)

### DevContainer (Optional)

For a pre-configured environment:

1. Install [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open folder in VS Code
3. Press `F1` → "Dev Containers: Reopen in Container"

This sets up Node.js, dependencies, and extensions automatically.

---

## 🚀 Next Steps

1. ✅ Complete quick start
2. 📖 Read [CONTRIBUTING.md](../CONTRIBUTING.md)
3. 🐛 Pick a good first issue
4. 💬 Join discussions (GitHub Issues)
5. 🎉 Submit your first PR!

**Welcome aboard!** 🎉
