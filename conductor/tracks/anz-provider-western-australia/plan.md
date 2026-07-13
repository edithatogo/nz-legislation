# Plan: Western Australia Provider Source-Shape and Adapter Track

## Phase 0: Source-shape discovery

**Status:** Complete for bounded source-shape discovery.

- [x] Capture official Western Australian legislation and Gazette entry points and access terms.
- [x] Record machine-readable source-shape details and version cues.
- [x] Mark ambiguous or unsupported cases explicitly instead of inferring placeholder behavior.

## Phase 1: Authoritative formats and adapter mapping

**Status:** Bounded mapping recorded; runtime remains unsupported.

- [x] Record that authoritative formats require verification before adapter work.
- [x] Map discovery, retrieval, versioning, export, and provenance behavior to the provider contract.
- [x] Record unsupported capability boundaries so the adapter can fail truthfully.

## Phase 2: Fixtures and tests

**Status:** Complete for metadata-only fixtures and gates.

- [x] Build a source-shaped metadata fixture; no legal text or fabricated records.
- [x] Add tests for source-shape boundaries and unsupported capability errors.
- [x] Add manifest/provider alignment checks for Western Australia.

## Phase 3: MCP/export and provenance

**Status:** Deferred until source-backed runtime evidence exists.

- [x] Define Western Australia source-card and provenance boundaries.
- [x] Confirm existing MCP/export provider-aware gates remain authoritative.
- [x] Keep Western Australia unsupported in the manifest until source-backed evidence is complete.

## Phase 4: Docs and release notes

**Status:** Complete for truthful readiness documentation.

- [x] Draft Western Australia-specific docs language that stays truthful about support state.
- [x] Draft release-note language distinguishing NZ stable support from Western Australia unsupported status.
- [x] Re-check the track against release gates before any public claim.
