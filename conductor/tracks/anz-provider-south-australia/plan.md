# Plan: South Australia Provider Source-Shape and Adapter Track

## Phase 0: Source-shape discovery

**Status:** Complete for bounded source-shape discovery.

- [x] Capture the official South Australian legislation source entry points
      and access terms.
- [x] Record machine-readable source-shape details: document types, URL
      patterns, identifiers, version cues, and provenance fields.
- [x] Mark ambiguous or unsupported cases explicitly instead of inferring
      placeholder behavior.

## Phase 1: Authoritative formats and adapter mapping

**Status:** Bounded mapping recorded; runtime remains unsupported.

- [x] Record that authoritative formats require verification before adapter work
      trust.
- [x] Map discovery, retrieval, versioning, export, and provenance behavior to
      the provider contract.
- [x] Record unsupported capability boundaries so the adapter can fail
      truthfully.

## Phase 2: Fixtures and tests

**Status:** Complete for metadata-only fixtures and gates.

- [x] Build source-shaped metadata fixture; no legal text or fabricated records
      shapes.
- [x] Add tests for source-shape boundaries and unsupported capability errors.
      unsupported capability errors.
- [x] Add manifest/provider alignment checks for South Australia.

## Phase 3: MCP/export and provenance

**Status:** Deferred until source-backed runtime evidence exists.

- [x] Define South Australia source-card and provenance boundaries
      output.
- [x] Confirm existing MCP/export provider-aware gates remain authoritative.
- [x] Keep South Australia unsupported in the manifest until source-backed
      evidence is complete.

## Phase 4: Docs and release notes

**Status:** Complete for truthful readiness documentation.

- [x] Draft South Australia-specific docs language that stays truthful about
      support state.
- [x] Draft release-note language that distinguishes NZ stable support from
      South Australia prerelease or unsupported status.
- [x] Re-check the track against the release gates before any public claim.
