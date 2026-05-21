# Plan: Australian Commonwealth Provider

## Phase 0: Source and fixture baseline

**Status:** In progress.

- [x] Validate the Federal Register API and OpenAPI document.
- [x] Add source validation notes under `docs/maintainers/`.
- [x] Add mapping and injected client-wrapper foundation.
- [ ] Capture additional official API-shaped fixtures for title, version,
      document, search, and content download paths.
- [ ] Record live-smoke-test limits and opt-in execution rules.

## Phase 1: Runtime provider adapter

**Status:** Not started.

- [ ] Add a provider adapter boundary for `au-commonwealth`.
- [ ] Map Federal Register title, version, document, and search responses into
      repository models without placeholder fields.
- [ ] Keep unsupported capabilities explicit when a Federal Register endpoint
      cannot satisfy a repository contract.

## Phase 2: Provider-aware CLI, MCP, and export

**Status:** Not started.

- [ ] Route Commonwealth CLI paths through jurisdiction-aware provider
      selection.
- [ ] Route Commonwealth MCP paths through the provider capability manifest.
- [ ] Add source cards and provenance metadata to export output.
- [ ] Preserve structured unsupported errors for incomplete features.

## Phase 3: Tests and gates

**Status:** Not started.

- [ ] Add unit tests for mapper, adapter, unsupported cases, and provenance.
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
