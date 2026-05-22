# Plan: Australian Commonwealth Provider

## Phase 0: Source and fixture baseline

**Status:** In progress. Source validation, client wrapper, mapping, adapter source metadata, and registry-facing wiring are complete; fixture expansion and opt-in smoke-test rules remain.

- [x] Validate the Federal Register API and OpenAPI document.
- [x] Add source validation notes under `docs/maintainers/`.
- [x] Add mapping and injected client-wrapper foundation.
- [x] Carry Federal Register source metadata through the adapter boundary.
- [ ] Capture additional official API-shaped fixtures for title, version,
      document, search, and content download paths.
- [ ] Record live-smoke-test limits and opt-in execution rules.

## Phase 1: Runtime provider adapter

**Status:** Complete for the adapter slice.

- [x] Add a provider adapter boundary for `au-commonwealth`.
- [x] Map Federal Register title, version, document, and search responses into
      repository models without placeholder fields.
- [x] Keep unsupported capabilities explicit when a Federal Register endpoint
      cannot satisfy a repository contract.

## Phase 2: Provider-aware CLI, MCP, and export

**Status:** In progress. Shared runtime gates now block unsupported providers;
Commonwealth provider selection and provenance output are still not enabled.

- [ ] Route Commonwealth CLI paths through jurisdiction-aware provider
      selection.
- [x] Route Commonwealth MCP/export unsupported paths through shared runtime
      provider gates.
- [ ] Add source cards and provenance metadata to export output.
- [ ] Preserve structured unsupported errors for incomplete features.

## Phase 3: Tests and gates

**Status:** In progress.

- [x] Add unit tests for mapper, adapter, and unsupported runtime cases.
- [ ] Add unit tests for provenance output.
- [ ] Add no-placeholder legal-data tests for Commonwealth fixtures.
- [ ] Add opt-in live smoke tests that are rate-limit respectful.
- [ ] Keep `pnpm typecheck`, `pnpm test:run`, `pnpm build`, and
      `pnpm gate:no-placeholder-legal-data` passing.

## Phase 4: Release readiness

**Status:** Not started.

- [ ] Update docs, install snippets, and release notes only after runtime gates
      pass.
- [ ] Distinguish NZ stable support from Commonwealth prerelease support.
- [ ] Re-check package metadata and registry copy before any public claim.
