# Plan: Legal Metadata Standards Alignment

**Track ID:** legal-metadata-standards-alignment  
**Status:** 🟡 IN PROGRESS  
**Priority:** 🔴 HIGH  
**Last Updated:** 2026-03-14

## Summary

This plan adds a canonical legal metadata layer aligned with recognized legal
information standards while preserving the current provider and CLI behavior.

## Phase 1: Standards Decision and Canonical Field Inventory

### Goals

- confirm the standards set the project will align to
- define the minimum canonical entities and fields
- document non-goals and migration constraints

### Outputs

- accepted ADR
- developer-guide standards document
- canonical field inventory linked to current provider concepts

### Phase 1 Outcome

- `ADR 0004` accepts the standards-aligned canonical metadata direction
- the developer guide now documents the selected standards and canonical entity
  frame
- no exceptions were recorded before schema work starts

### Automated Review Gate

- [x] Run `node scripts/conductor-phase-review.mjs --track legal-metadata-standards-alignment --phase 1`
- [x] Confirm the standards set and canonical fields are documented
- [x] Record any exceptions before schema work starts

## Phase 2: Canonical Schema Introduction

### Goals

- add canonical TypeScript and Zod schemas
- define work, expression, manifestation, and relationship entities
- separate canonical and CLI-facing model responsibilities

### Outputs

- canonical schemas in source control
- unit tests for the canonical schemas
- architecture documentation updated for the two-layer model

### Phase 2 Outcome

- canonical work, expression, manifestation, relationship, and record schemas
  now exist in `src/models/canonical.ts`
- focused unit coverage exists for canonical schema validation
- the architecture guide now links the application-facing provider model to the
  standards-aligned canonical layer

### Automated Review Gate

- [x] Run `node scripts/conductor-phase-review.mjs --track legal-metadata-standards-alignment --phase 2`
- [x] Verify canonical schemas cover current jurisdiction needs
- [x] Confirm no CLI contract regressions have been introduced

## Phase 3: Provider Mapping

### Goals

- map NZ, Commonwealth, and Queensland providers into canonical entities
- isolate source-specific parsing inside provider mappers
- keep adapters deterministic and testable

### Outputs

- per-provider canonical mapping implementation
- fixture-backed tests for mapping behavior
- canonical identifier and lifecycle derivation rules

### Phase 3 Outcome

- provider-side canonical mapping now exists in `src/providers/canonical-metadata.ts`
- current jurisdiction fixtures are covered by focused canonical mapping tests
- canonical work, expression, manifestation, and relationship identifiers are
  now derived consistently from provider data

### Automated Review Gate

- [x] Run `node scripts/conductor-phase-review.mjs --track legal-metadata-standards-alignment --phase 3`
- [x] Verify each provider maps into canonical entities
- [x] Confirm adapters remain reversible and auditable

## Phase 4: CLI and Export Integration

### Goals

- adapt the current CLI-facing model from canonical metadata
- expose canonical metadata selectively in exports
- prepare future web or API metadata publication paths

### Outputs

- canonical-to-CLI adapters
- export metadata improvements
- documentation for migration-safe public exposure

### Phase 4 Outcome

- the legacy CLI-facing provider adapters now derive from canonical records
  internally
- export metadata can now include additive canonical records without changing
  the default export shape
- focused tests cover canonical-backed adapter behavior and canonical export
  metadata generation

### Automated Review Gate

- [x] Run `node scripts/conductor-phase-review.mjs --track legal-metadata-standards-alignment --phase 4`
- [x] Verify the CLI output remains stable unless explicitly expanded
- [x] Confirm export changes are documented and tested

## Phase 5: Relationship and Publication Follow-Through

### Goals

- add structured legal relationships where the source quality allows
- define publication patterns for schema.org and dataset metadata
- establish the closure standard for the standards-alignment track

### Outputs

- relationship model coverage plan
- publication metadata guidance
- closure criteria or follow-on backlog entries

### Phase 5 Outcome

- baseline canonical relationships are explicitly limited to safe structural
  links
- schema.org publication guidance is implemented and documented
- deferred relationship extraction and dataset publication work is recorded as
  follow-on scope rather than left ambiguous

### Automated Review Gate

- [x] Run `node scripts/conductor-phase-review.mjs --track legal-metadata-standards-alignment --phase 5`
- [x] Confirm publication and relationship follow-through is documented
- [x] Decide whether the track can close or should split into follow-on work
