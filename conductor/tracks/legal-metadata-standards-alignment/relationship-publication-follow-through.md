# Relationship and Publication Follow-Through

## Purpose

This document closes Phase 5 of the legal metadata standards alignment track.
It records what relationship and publication work is already implemented, what
is deferred, and why the current track can close without pretending that all
possible legal relationship extraction has been solved.

## Implemented Now

### Relationship Baseline

The canonical layer now emits structural relationships that are always safe and
derivable from current provider data:

- `has_expression`
- `has_manifestation`

These are emitted in provider-side canonical mapping and give every canonical
record an explicit work-expression-manifestation chain.

### Publication Baseline

The repository now has a direct publication helper for
`schema.org/Legislation`:

- `src/output/legal-metadata-publication.ts`

This provides a stable projection from canonical records into web-facing
metadata suitable for future documentation pages, HTTP surfaces, or generated
site markup.

### Export Baseline

JSON exports with `--include-metadata` now include additive `canonicalRecords`
output. CSV exports keep row compatibility and only add metadata comments.

## Deferred Relationship Coverage

The following relationship families are still relevant, but remain source-data
dependent and should not be faked:

- `amends`
- `amended_by`
- `repeals`
- `repealed_by`
- `commences`
- `commenced_by`
- `derived_from`
- `supersedes`

These should move into a follow-on implementation only when the underlying
provider data is reliable enough to populate them deterministically.

## Deferred Publication Follow-Through

The following publication tasks are intentionally deferred:

- dataset-level `DCAT` publication for bulk exports
- automatic JSON-LD embedding in generated documentation pages
- public HTTP metadata surfaces governed under the HTTP/OpenAPI ADR
- richer citation and jurisdiction publication metadata beyond the current
  canonical baseline

## Closure Standard

This standards-alignment track can be marked complete because it now has:

- a documented standards decision
- canonical schemas
- provider-side canonical mapping
- canonical-backed legacy adapters
- additive canonical export metadata
- a publication helper for `schema.org/Legislation`
- an explicit record of deferred relationship and publication work

## Recommended Follow-On Work

If future jurisdictions or source APIs expose structured legislative
relationships, open a follow-on track for:

1. relationship extraction by provider
2. relationship test fixtures
3. dataset-level `DCAT` publication
4. JSON-LD embedding on public documentation or future HTTP surfaces
