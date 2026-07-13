# Plan: Tasmania Provider Source-Shape and Adapter Track

## Phase 0: Source-shape discovery

**Status:** Complete for source-shape discovery; runtime adapter remains gated.

- [x] Capture the official Tasmanian legislation source entry points and access
      terms.
- [x] Record machine-readable source-shape details: document types, URL
      patterns, identifiers, version cues, and provenance fields.
- [x] Mark ambiguous or unsupported cases explicitly instead of inferring
      placeholder behavior.

## Phase 1: Authoritative formats and adapter mapping

**Status:** Documented; implementation remains blocked on machine-readable evidence.

- [x] Choose the authoritative formats the future Tasmania adapter will trust.
- [x] Map discovery, retrieval, versioning, export, and provenance behavior to
      the provider contract.
- [x] Record unsupported capability boundaries so the adapter can fail
      truthfully.

## Phase 2: Fixtures and tests

**Status:** Complete for metadata-only fixtures and unsupported-path tests.

- [x] Build source-backed fixtures that reflect the recorded Tasmania shapes.
- [x] Add tests for no-placeholder legal data, parsing, normalization, and
      unsupported capability errors.
- [x] Add manifest/provider alignment checks for Tasmania.

## Phase 3: MCP/export and provenance

**Status:** Gated; provider-aware unsupported boundaries are covered.

- [x] Define Tasmania source cards and provenance metadata for export output.
- [x] Route MCP/export behavior through provider-aware gates.
- [x] Keep Tasmania unsupported in the manifest until source-backed evidence
      is complete.

## Phase 4: Docs and release notes

**Status:** Complete for gated docs and release-note posture.

- [x] Draft Tasmania-specific docs language that stays truthful about support
      state.
- [x] Draft release-note language that distinguishes NZ stable support from
      Tasmania prerelease or unsupported status.
- [x] Re-check the track against the release gates before any public claim.
