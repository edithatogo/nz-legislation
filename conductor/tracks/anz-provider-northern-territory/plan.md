# Plan: Northern Territory Provider Source-Shape and Adapter Track

## Phase 0: Source-shape discovery

**Status:** Complete for metadata-only discovery; runtime remains blocked.

- [x] Capture the official Northern Territory legislation source entry points
      and access terms.
- [x] Record machine-readable source-shape details: document types, URL
      patterns, identifiers, version cues, and provenance fields.
- [x] Mark ambiguous or unsupported cases explicitly instead of inferring
      placeholder behavior.

## Phase 1: Authoritative formats and adapter mapping

**Status:** Mapped with unsupported boundaries; runtime remains blocked.

- [x] Choose the authoritative formats the future Northern Territory adapter
      will trust.
- [x] Map discovery, retrieval, versioning, export, and provenance behavior to
      the provider contract.
- [x] Record unsupported capability boundaries so the adapter can fail
      truthfully.

## Phase 2: Fixtures and tests

**Status:** Metadata-only fixture and readiness tests added; runtime remains blocked.

- [x] Build source-backed fixtures that reflect the recorded Northern Territory
      shapes.
- [x] Add tests for no-placeholder legal data, parsing, normalization, and
      unsupported capability errors.
- [x] Add manifest/provider alignment checks for the Northern Territory.

## Phase 3: MCP/export and provenance

**Status:** Source card is gated; runtime remains unsupported.

- [x] Define Northern Territory source cards and provenance metadata for
      export output.
- [x] Route MCP/export behavior through provider-aware gates.
- [x] Keep the Northern Territory unsupported in the manifest until
      source-backed evidence is complete.

## Phase 4: Docs and release notes

**Status:** Validation and release posture documented; public support remains blocked.

- [x] Draft Northern Territory-specific docs language that stays truthful
      about support state.
- [x] Draft release-note language that distinguishes NZ stable support from
      Northern Territory prerelease or unsupported status.
- [x] Re-check the track against the release gates before any public claim.
