# Specification: Comprehensive Testing

## Overview

Implement comprehensive testing strategy for the NZ Legislation CLI tool to ensure production-readiness and research-grade quality.

---

## Testing Requirements

### 1. Integration Tests (CRITICAL)
**Purpose:** Verify API integration works correctly with real/mock API

**Coverage:**
- API client methods (search, get)
- Error handling (401, 404, 429, timeouts)
- Rate limiting behavior
- Response parsing and validation

**Tools:**
- **MSW (Mock Service Worker)** or **nock** for API mocking
- **Vitest** for test runner

**Target:** 10+ integration tests

---

### 2. End-to-End Tests (CRITICAL)
**Purpose:** Verify complete CLI workflows from user perspective

**Coverage:**
- All CLI commands (search, get, export, cite, config)
- Output format validation (table, JSON, CSV)
- File export verification
- Exit code verification
- Error message validation

**Tools:**
- **execa** for command execution
- **Vitest** for test runner

**Target:** 5+ E2E tests

---

### 3. Property-Based Tests (HIGH VALUE)
**Purpose:** Test invariants and edge cases automatically

**Coverage:**
- CSV generation invariants (always valid CSV)
- Citation format invariants (always valid BibTeX/RIS)
- Search result handling (any valid response)
- Input validation (any invalid input)

**Tools:**
- **fast-check** for property-based testing

**Target:** 5+ property tests

---

### 4. Mutation Testing (QUALITY GATE)
**Purpose:** Measure test effectiveness by introducing bugs

**Coverage:**
- All source code in `src/`
- Critical paths prioritized

**Tools:**
- **Stryker** for mutation testing

**Target:** >80% mutation score

---

### 5. Hypothesis Tests (RESEARCH-GRADE)
**Purpose:** Verify research-critical properties

**Coverage:**
- Export reproducibility (same query = same output)
- Citation consistency (same work = same citation)
- Metadata completeness (all exports include required fields)

**Tools:**
- Custom test utilities

**Target:** 3+ hypothesis tests

---

## Acceptance Criteria

### Must Have (Before Publishing)
- [ ] Integration tests passing (10+ tests)
- [ ] E2E tests passing (5+ tests)
- [ ] Property-based tests implemented (5+ tests)
- [ ] Mutation score >80%
- [ ] Test coverage >60%

### Should Have
- [ ] Hypothesis tests implemented (3+ tests)
- [ ] CI/CD integration (tests run on every PR)
- [ ] Coverage reporting (Codecov integration)

### Nice to Have
- [ ] Performance benchmarks
- [ ] Visual regression tests (for table output)
- [ ] Load testing (rate limit stress tests)

---

## Success Metrics

1. **Test Count:** 30+ total tests (currently 10)
2. **Coverage:** >60% line coverage (currently ~20%)
3. **Mutation Score:** >80% (not measured yet)
4. **CI/CD:** All tests run on every PR
5. **Quality Gate:** No publishing without passing all tests

---

## Technical Specifications

### Test Structure
```
tests/
├── unit/                    # Existing unit tests
│   ├── output.test.ts
│   └── client.test.ts
├── integration/             # NEW: Integration tests
│   ├── api.test.ts
│   └── rate-limit.test.ts
├── e2e/                     # NEW: E2E tests
│   ├── cli.test.ts
│   └── export.test.ts
├── property/                # NEW: Property-based tests
│   ├── csv.test.ts
│   └── citation.test.ts
└── hypothesis/              # NEW: Hypothesis tests
    ├── reproducibility.test.ts
    └── consistency.test.ts
```

### Dependencies to Add
```json
{
  "devDependencies": {
    "fast-check": "^3.0.0",
    "@stryker-mutator/core": "^8.0.0",
    "@stryker-mutator/vitest-runner": "^8.0.0",
    "execa": "^9.0.0",
    "msw": "^2.0.0"
  }
}
```

---

**Version:** 1.0.0  
**Created:** 2026-03-08  
**Status:** ⏳ **IN PROGRESS**
