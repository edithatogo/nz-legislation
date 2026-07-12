# Plan: Rust Migration Readiness

## Phase 1: Readiness registration

**Status:** Complete.

- [x] Add Rust readiness contracts to `conductor/requirements.md`.
- [x] Add this Conductor track.
- [x] Inventory compatibility contracts in `docs/maintainers/rust-migration-compatibility.md`.

## Phase 2: Future migration controls

**Status:** In progress.

- [x] Define test parity requirements.
- [x] Define release governance required before cutover.
- [x] Add executable golden fixtures and contract tests.
- [x] Add a minimal Rust contract workspace behind the parity gates.
- [x] Consume the shared JSON compatibility fixture from Rust contract tests.
- [x] Add locked dependency-tree provenance validation to Rust CI.
- [x] Implement the first non-publishing Rust runtime component for contract validation.
- [ ] Run dual-runtime performance and security comparisons.
