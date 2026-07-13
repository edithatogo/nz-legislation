# Plan: Queensland Provider

## Phase 0: Access and source-shape capture

**Status:** In progress (official source shape recorded; runtime remains disabled).

- [ ] Register for Queensland API access using maintainer-controlled
      credentials outside the repository.
- [ ] Capture current Swagger/OpenAPI documentation from the API base URL after maintainer registration.
- [ ] Record authentication, rate limits, licence terms, authoritative formats,
      and update cadence.
- [x] Record metadata-only official API source shape and URL/access boundaries;
      no legal records are stored in this repository.
- [ ] Capture real official API-shaped fixtures for representative legislation
      records after licensing and fixture review.

## Phase 1: Adapter design

**Status:** Blocked until registered API shape and fixtures are reviewed.

- [ ] Define Queensland provider adapter boundaries and unsupported feature
      behavior.
- [ ] Map official JSON, XML, HTML, and PDF surfaces to repository contracts.
- [ ] Decide how Queensland notes, annotations, and links are represented
      without treating them as legislation text.

## Phase 2: Runtime integration

**Status:** Blocked; runtime remains explicitly unsupported.

- [ ] Add jurisdiction-aware CLI provider routing for Queensland.
- [ ] Add provider-aware MCP routing for Queensland.
- [ ] Add export source cards and provenance metadata.
- [ ] Keep all incomplete capabilities behind structured unsupported errors.

## Phase 3: Tests and gates

**Status:** Source-shape tests added; runtime and live-source gates remain blocked.

- [ ] Add unit tests for API mapping and unsupported cases.
- [ ] Add no-placeholder legal-data tests using official-source fixtures.
- [ ] Add opt-in live smoke tests that respect API access terms.
- [x] Add metadata-only source-shape fixture and readiness tests with no legal
      records or fabricated data.
- [ ] Keep `pnpm typecheck`, `pnpm test:run`, `pnpm build`, and
      `pnpm gate:no-placeholder-legal-data` passing.

## Phase 4: Release readiness

**Status:** Blocked until provider runtime, provenance, and release gates pass.

- [ ] Update docs and release notes only after provider gates pass.
- [ ] Distinguish NZ stable support from Queensland prerelease support.
- [ ] Re-check package/listing copy before any public support claim.
