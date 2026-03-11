# Testing

This document covers testing strategies and procedures for the NZ Legislation Tool.

## Testing Strategy

### Unit Tests
- **Location:** `tests/*.test.ts`
- **Framework:** Vitest
- **Coverage Target:** >80%

### Integration Tests
- MSW integration tests
- E2E tests
- Property-based tests (fast-check)
- Hypothesis tests

### Manual Testing

Before release, test:

```bash
# Search functionality
npm run dev -- search --query "health" --limit 5

# Get specific act
npm run dev -- get "act_public_1989_18"

# Export functionality
npm run dev -- export --query "health" --output test.csv

# Citations
npm run dev -- cite "act_public_1989_18" --style nzmj

# Config
npm run dev -- config --show
```

## Running Tests

```bash
# Watch mode
npm test

# Run once
npm run test:run

# With coverage
npm run test:coverage
```

## Quality Assurance

### Pre-Release Checklist

- [ ] All tests passing
- [ ] Type check passing
- [ ] Documentation updated
- [ ] No broken links
- [ ] Build succeeds

### Link Checking

```bash
# Build with strict link checking
npm run build -- --fail-on-errors
```

## Documentation Testing

### Usability Testing

- **Findability:** Can users find what they need in <30 seconds?
- **Comprehensibility:** Is the content easy to understand?
- **Task Completion:** Can users complete tasks successfully?

### Technical Accuracy

- [ ] Code examples execute correctly
- [ ] API responses match documentation
- [ ] Screenshots are current
- [ ] Version numbers are accurate

---

**Related:**
- [Architecture](./architecture.md)
- [Contributing](./contributing.md)
- [Error Reference](../troubleshooting/error-reference.md)
