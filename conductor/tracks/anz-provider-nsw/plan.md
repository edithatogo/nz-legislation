# Plan: NSW Provider

## Phase 0: XML/export source-shape discovery

**Status:** Not started.

- [ ] Capture representative XML fixtures for in-force, repealed, historical,
      and point-in-time legislation records.
- [ ] Capture representative JSON export listings.
- [ ] Record URL patterns, query fields, identifier rules, version cues, update
      cadence, and automation guidance.

## Phase 1: Adapter design

**Status:** Not started.

- [ ] Design NSW as an export/download adapter before claiming search support.
- [ ] Map XML/export records to repository `Work`, `Version`, export, and MCP
      contracts where source data supports them.
- [ ] Record unsupported runtime boundaries where source data does not support a
      feature.

## Phase 2: Runtime integration

**Status:** Not started.

- [ ] Add jurisdiction-aware CLI provider routing for NSW.
- [ ] Add provider-aware MCP routing for NSW.
- [ ] Add export provenance that records source URLs and export query metadata.
- [ ] Keep incomplete features behind structured unsupported errors.

## Phase 3: Tests and gates

**Status:** Not started.

- [ ] Add XML parsing, normalization, unsupported-boundary, and provenance
      tests.
- [ ] Add no-placeholder legal-data tests using official fixtures.
- [ ] Add opt-in live smoke tests that avoid normal NSW business hours where
      practical.
- [ ] Keep `pnpm typecheck`, `pnpm test:run`, `pnpm build`, and
      `pnpm gate:no-placeholder-legal-data` passing.

## Phase 4: Release readiness

**Status:** Not started.

- [ ] Update docs and release notes only after provider gates pass.
- [ ] Distinguish NZ stable support from NSW prerelease support.
- [ ] Re-check package/listing copy before any public support claim.
