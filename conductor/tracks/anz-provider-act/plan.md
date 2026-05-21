# Plan: ACT Provider Source-Shape and Adapter Track

## Phase 0: Source-shape discovery

**Status:** Not started.

- [ ] Capture the official ACT legislation source entry points and access
      terms.
- [ ] Record machine-readable source-shape details: document types, URL
      patterns, identifiers, version cues, and provenance fields.
- [ ] Mark ambiguous or unsupported cases explicitly instead of inferring
      placeholder behavior.

## Phase 1: Authoritative formats and adapter mapping

**Status:** Not started.

- [ ] Choose the authoritative formats the future ACT adapter will trust.
- [ ] Map discovery, retrieval, versioning, export, and provenance behavior to
      the provider contract.
- [ ] Record unsupported capability boundaries so the adapter can fail
      truthfully.

## Phase 2: Fixtures and tests

**Status:** Not started.

- [ ] Build source-backed fixtures that reflect the recorded ACT shapes.
- [ ] Add tests for no-placeholder legal data, parsing, normalization, and
      unsupported capability errors.
- [ ] Add manifest/provider alignment checks for the ACT.

## Phase 3: MCP/export and provenance

**Status:** Not started.

- [ ] Define ACT source cards and provenance metadata for export output.
- [ ] Route MCP/export behavior through provider-aware gates.
- [ ] Keep the ACT unsupported in the manifest until source-backed evidence
      is complete.

## Phase 4: Docs and release notes

**Status:** Not started.

- [ ] Draft ACT-specific docs language that stays truthful about support
      state.
- [ ] Draft release-note language that distinguishes NZ stable support from
      ACT prerelease or unsupported status.
- [ ] Re-check the track against the release gates before any public claim.
