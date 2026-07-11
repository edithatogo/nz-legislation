# Plan: OpenAPI Adapter Readiness

## Phase 1: Readiness registration

**Status:** Complete.

- [x] Add OpenAPI readiness to the requirements contract register (`f490b1b`).
- [x] Add this Conductor track for the roadmap entry (`f490b1b`).
- [x] Inventory existing CLI, MCP, and export response contracts that a future
      OpenAPI surface would need to preserve.

## Phase 2: Future contract design

**Status:** Complete.

- [x] Draft schema and route acceptance criteria in `docs/maintainers/openapi-adapter-contract.json` and `docs/maintainers/openapi-adapter-readiness.md` (`f490b1b`).
- [x] Add contract tests before any implementation begins (`tests/openapi-adapter-contract.test.ts`, `f490b1b`).

## Validation evidence

- `gate:openapi-adapter-contract`: passed (5 tests).
- `gate:conductor-requirements`: passed.
- TypeScript strict typecheck: passed.
- Scoped Prettier check: passed.
- No HTTP service, route, package split, deployment, or publication was added.
- Latest branch Docs workflow passed: run `29156280691`.

## Review evidence - 2026-07-12

- [x] Applied review fixes to strengthen manifest-wide feature coverage, route uniqueness, and source-reference checks (`be6900a`).
