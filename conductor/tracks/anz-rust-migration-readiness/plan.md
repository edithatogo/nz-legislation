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
- [x] Implement provider capability and structured unsupported-capability contracts.
- [x] Implement gated Rust CLI command and output-format contract parsing.
- [x] Implement gated Rust MCP request/response and provenance contracts.
- [x] Add shared MCP tool and provenance fixture parity tests against the TypeScript server.
- [x] Add a network-free Rust provider request planner with URL allowlisting and identifier validation.
- [x] Add a non-publishing Rust CLI contract binary for executable command/output parity.
- [x] Add a source-backed Rust provider capability manifest for the staged provider inventory.
- [x] Establish a traceable dual-runtime performance/security comparison harness and explicit no-cutover gate; full Rust runtime comparison remains pending until a Rust runtime exists.
