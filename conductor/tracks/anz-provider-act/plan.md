# Plan: ACT Provider Source-Shape and Adapter Track

## Phase 0: Source-shape discovery

**Status:** Complete.

- [x] Capture the official ACT legislation source entry points and access
      terms.
- [x] Record machine-readable source-shape details: document types, URL
      patterns, identifiers, version cues, and provenance fields.
- [x] Mark ambiguous or unsupported cases explicitly instead of inferring
      placeholder behavior.

## Phase 1: Authoritative formats and adapter mapping

**Status:** Complete.

- [x] Choose the authoritative formats the future ACT adapter will trust.
- [x] Map discovery, retrieval, versioning, export, and provenance behavior to
      the provider contract.
- [x] Record unsupported capability boundaries so the adapter can fail
      truthfully.

## Phase 2: Fixtures and tests

**Status:** Complete for metadata-only readiness; runtime remains unsupported.

- [x] Build a metadata-only source-shape fixture that reflects the recorded ACT shapes; no legal text is stored.
- [x] Add tests for no-placeholder legal data, parsing, normalization, and
      unsupported capability errors.
- [x] Add manifest/provider alignment checks for the ACT.

## Phase 3: MCP/export and provenance

**Status:** Complete for gated unsupported behavior.

- [x] Define ACT source-card and provenance requirements for future export output.
- [x] Route MCP/export behavior through existing provider-aware gates.
- [x] Keep the ACT unsupported in the manifest until source-backed evidence
      is complete.

## Phase 4: Docs and release notes

**Status:** Complete for truthful readiness language.

- [x] Draft ACT-specific docs language that stays truthful about support
      state.
- [x] Draft release-note language that distinguishes NZ stable support from
      ACT prerelease or unsupported status.
- [x] Re-check the track against the release gates before any public claim.

## Validation evidence

- `gate:act-provider-readiness`: passed (2 tests).
- `gate:conductor-requirements`: passed.
- TypeScript strict typecheck and scoped Prettier: passed.
- ACT runtime remains `planned`/unsupported; no publication or deployment is authorized.
