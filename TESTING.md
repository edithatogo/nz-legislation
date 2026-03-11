# Testing Guide

## Overview

The NZ Legislation Tool uses a comprehensive testing strategy with **43+ tests** across 5 categories:

1. **Unit Tests** (10 tests) - Core logic testing
2. **Integration Tests** (5 tests) - API integration testing
3. **E2E Tests** (10+ tests) - Full CLI workflow testing
4. **Property-Based Tests** (10+ tests) - Invariant testing with fast-check
5. **Hypothesis Tests** (8+ tests) - Research-grade reproducibility testing

---

## Running Tests

### All Tests

```bash
# Run all tests
npm run test:all

# Run with coverage
npm run test:coverage
```

### By Category

```bash
# Unit tests
npm test

# Integration tests (requires MSW)
npm run test:integration

# E2E tests (requires file system access)
npm run test:e2e

# Property-based tests (requires fast-check)
npm run test:property

# Hypothesis tests
npm run test:hypothesis

# Mutation testing (requires Stryker)
npm run test:mutation
```

---

## Test Structure

```
tests/
├── unit/                    # Unit tests
│   ├── output.test.ts       # Output formatter tests
│   └── client.test.ts       # Rate limit tests
├── integration/             # Integration tests
│   └── api.test.ts          # API integration with MSW
├── e2e/                     # E2E tests
│   └── cli.test.ts          # CLI command testing
├── property/                # Property-based tests
│   └── output.test.ts       # Invariant testing
├── hypothesis/              # Hypothesis tests
│   └── reproducibility.test.ts  # Reproducibility testing
└── fixtures/                # Test fixtures
    └── (test files created during E2E tests)
```

---

## Writing Tests

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { worksToCsv } from '../src/output/index.js';

describe('Output Formatters', () => {
  it('should generate CSV with correct headers', () => {
    const csv = worksToCsv(mockResults);
    expect(csv).toContain('work_id,title,type');
  });
});
```

### Integration Tests (with MSW)

```typescript
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('https://api.legislation.govt.nz/v0/works', () => {
    return HttpResponse.json(mockSearchResponse);
  })
);

it('should search for legislation', async () => {
  const results = await searchWorks({ query: 'health' });
  expect(results.results).toHaveLength(1);
});
```

### Property-Based Tests (with fast-check)

```typescript
import * as fc from 'fast-check';

it('should always generate valid CSV', () => {
  fc.assert(
    fc.property(searchResultsArbitrary, results => {
      const csv = worksToCsv(results);
      expect(csv.split('\n')[0]).toBe('work_id,title,type');
    }),
    { numRuns: 100 }
  );
});
```

### E2E Tests (with execa)

```typescript
import { execa } from 'execa';

it('should display help text', async () => {
  const { stdout, exitCode } = await execa('tsx', [CLI_PATH, '--help']);
  expect(exitCode).toBe(0);
  expect(stdout).toContain('Search and retrieve');
});
```

---

## Mutation Testing

### What is Mutation Testing?

Mutation testing introduces small bugs ("mutants") into your code to verify that your tests catch them. A high mutation score indicates effective tests.

### Running Mutation Tests

```bash
npm run test:mutation
```

### Configuration

See `stryker.conf.json`:

```json
{
  "thresholds": {
    "high": 80,
    "low": 60
  }
}
```

### Target Score

- **>80%** - Excellent (target)
- **60-80%** - Good
- **<60%** - Needs improvement

---

## Coverage Thresholds

Configured in `vitest.config.ts`:

```typescript
coverage: {
  thresholds: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
}
```

**Target:** >60% coverage across all metrics

---

## CI/CD Integration

Tests run automatically on:

- **Push to main:** All tests + mutation testing
- **Pull Request:** All tests (mutation testing optional)

### GitHub Actions Workflow

See `.github/workflows/ci.yml`:

- Tests run on Node.js 18, 20, 22
- Coverage uploaded to Codecov
- Mutation report uploaded as artifact

---

## Test Best Practices

### ✅ DO:

- Use descriptive test names
- Test edge cases and error scenarios
- Use property-based testing for invariants
- Clean up after E2E tests (use `afterEach`)
- Mock external dependencies (API, file system)

### ❌ DON'T:

- Test implementation details
- Skip test cleanup
- Hardcode API keys in tests
- Test multiple things in one test
- Ignore failing tests

---

## Troubleshooting

### Tests Fail Randomly

```bash
# Run tests sequentially
npm run test:run --no-parallel

# Increase timeout
npm run test:run --testTimeout=60000
```

### Coverage Not Generated

```bash
# Clear cache
rm -rf node_modules/.vite

# Re-run with coverage
npm run test:coverage
```

### Mutation Score Low

1. Run mutation report: `npm run test:mutation`
2. Open `reports/mutation/mutation.html`
3. Find surviving mutants
4. Add tests to catch them

---

## Test Dependencies

| Package                   | Purpose                         |
| ------------------------- | ------------------------------- |
| **vitest**                | Test runner                     |
| **fast-check**            | Property-based testing          |
| **@stryker-mutator/core** | Mutation testing                |
| **msw**                   | API mocking (integration tests) |
| **execa**                 | Command execution (E2E tests)   |

---

## Quality Gates

Before merging a PR:

- [ ] All tests passing
- [ ] Coverage >60%
- [ ] Mutation score >80% (target)
- [ ] No flaky tests

---

**Last Updated:** 2026-03-08  
**Test Count:** 43+ tests  
**Coverage Target:** >60%  
**Mutation Target:** >80%
