# Specification: Testing Warning Hardening

## Overview

This track resolves the remaining test-suite debt after the comprehensive testing rollout. The goal is to eliminate avoidable test warnings, restore meaningful integration coverage for API error paths, and ensure the project can be validated without local workarounds or skipped instability.

## Goals

1. Remove runtime warnings emitted during automated test execution.
2. Replace brittle integration error-path coverage with deterministic, fast tests.
3. Improve configuration and client testability without weakening production validation.
4. Ensure the default project test command reflects the true health of the package.

## In Scope

- Test runtime warning investigation and remediation.
- Client/config refactors needed to support deterministic testing.
- Replacement or redesign of hanging integration tests for non-2xx API responses.
- Test command and config cleanup so the suite runs without ad hoc manual adjustments.
- Final verification of warnings, failures, and skip rationale.

## Out of Scope

- New end-user CLI features.
- Expanding test coverage into unrelated domains.
- Large architectural rewrites unrelated to test stability.

## Functional Requirements

### 1. Warning-Free Test Execution

- The package test suite must run without emitting the current `--localstorage-file` warning.
- Test-only configuration must not rely on hidden environment state or manual operator cleanup.

### 2. Deterministic Error-Path Coverage

- API authentication, not-found, and rate-limit behaviors must be tested in a deterministic way.
- Error-path tests must complete quickly and must not hang on retry loops or transport edge cases.
- If MSW remains unsuitable for a subset of cases, those cases must be covered by a more direct client-level strategy.

### 3. Testability Improvements

- Configuration loading must be testable without forcing invalid fallback parsing paths.
- HTTP client construction must be injectable or otherwise controllable in tests where transport behavior matters.
- The default Vitest setup must understand project path aliases on Windows.

### 4. Reliable Validation

- The package must provide at least one documented, repo-local test command that succeeds from a clean checkout.
- The final suite should not leave unexplained skips for the issues addressed by this track.

## Acceptance Criteria

- [ ] `nz-legislation-tool` tests run successfully from a repo-local command without failures.
- [ ] The test run completes without the current Node warning about `--localstorage-file`.
- [ ] Authentication, not-found, and rate-limit error paths are covered by passing automated tests.
- [ ] No temporary skip markers remain for the targeted integration error cases.
- [ ] Conductor track plan is updated to reflect the implemented fixes and validation steps.

## Risks and Constraints

- `got` retry behavior can mask or delay mocked error responses if transport control is too indirect.
- Config persistence libraries may emit runtime warnings during module initialization, especially under Node 25.
- Windows command resolution must be explicit in tests to avoid PATH-dependent behavior.

## Success Metrics

1. Zero failing tests for the package suite.
2. Zero known test runtime warnings in the validated command path.
3. Zero skipped tests for the targeted API error-path scenarios.
4. No dependency on manually created local config state for passing tests.

---

**Track ID:** `testing-warning-hardening`
**Created:** 2026-03-10
**Status:** ⏳ PENDING
