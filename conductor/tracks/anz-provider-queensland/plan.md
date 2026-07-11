# Plan: Queensland Provider

## Phase 0: Access and source-shape capture

**Status:** Not started.

- [ ] Register for Queensland API access using maintainer-controlled
      credentials outside the repository.
- [ ] Capture current Swagger/OpenAPI documentation from the API base URL.
- [ ] Record authentication, rate limits, licence terms, authoritative formats,
      and update cadence.
- [ ] Capture real official API-shaped fixtures for representative legislation
      records.

## Phase 1: Adapter design

**Status:** Not started.

- [ ] Define Queensland provider adapter boundaries and unsupported feature
      behavior.
- [ ] Map official JSON, XML, HTML, and PDF surfaces to repository contracts.
- [ ] Decide how Queensland notes, annotations, and links are represented
      without treating them as legislation text.

## Phase 2: Runtime integration

**Status:** Not started.

- [ ] Add jurisdiction-aware CLI provider routing for Queensland.
- [ ] Add provider-aware MCP routing for Queensland.
- [ ] Add export source cards and provenance metadata.
- [ ] Keep all incomplete capabilities behind structured unsupported errors.

## Phase 3: Tests and gates

**Status:** Not started.

- [ ] Add unit tests for API mapping and unsupported cases.
- [ ] Add no-placeholder legal-data tests using official-source fixtures.
- [ ] Add opt-in live smoke tests that respect API access terms.
- [ ] Keep `pnpm typecheck`, `pnpm test:run`, `pnpm build`, and
      `pnpm gate:no-placeholder-legal-data` passing.

## Phase 4: Release readiness

**Status:** Not started.

- [ ] Update docs and release notes only after provider gates pass.
- [ ] Distinguish NZ stable support from Queensland prerelease support.
- [ ] Re-check package/listing copy before any public support claim.
