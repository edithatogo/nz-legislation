# Legislation Product Name Migration Plan

## Phase 1 — Due diligence

- [x] Task: Audit package, repository, binary, domain, registry, and marketplace collisions
- [x] Task: Document legal, discoverability, and impersonation risks
- [x] Task: Define the canonical display-name and identifier matrix

## Phase 2 — Additive compatibility

- [x] Task: Add legislation and legislation-mcp aliases where safe
- [x] Task: Add alias parity and packaging tests
- [x] Task: Update help, docs, metadata, and examples without removing old names

## Phase 3 — Migration policy and gate

- [x] Task: Define support window, warnings, rollback, and deprecation evidence
- [x] Task: Reconcile npm, GitHub, website, MCP, and marketplace plans
- [x] Task: Run compatibility, security, capability, and release validation
- [x] Task: Obtain explicit approval before any breaking rename or publication

## Validation evidence

- `gate:brand-migration`: passed (2 tests).
- Package and repository identifiers remain unchanged; no breaking rename or publication occurred.
