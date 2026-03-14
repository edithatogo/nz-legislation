# Legal Metadata Standards

This document defines the recommended standards frame for legislation metadata
across all supported jurisdictions in this repository.

## Current State

The codebase already has a clear internal cross-jurisdiction framework:

- providers normalize source systems into shared `search`, `work`, and
  `version` objects
- the CLI reads a single jurisdiction-agnostic provider interface
- output adapters translate provider results into the existing CLI-facing models

That is good application architecture, but it is not yet a standards-aligned
legal metadata model. The current shared model is product-local and optimized
for CLI behavior rather than long-term legal information interoperability.

## Recommended Model Strategy

Use two layers:

1. Keep the current provider and CLI model as the application layer.
2. Add a canonical metadata layer aligned to legal-information standards.

This avoids breaking the current user-facing interfaces while making future
jurisdictions, exports, and documentation metadata more coherent.

## Standards to Use

### Primary Standards

#### Akoma Ntoso

Use `Akoma Ntoso` as the structural reference for legislative documents and
their lifecycle semantics.

Use it for:

- document structure
- component naming
- lifecycle and event semantics
- relationship modeling between principal works and later expressions

Do not require immediate full XML conversion. Treat it as the canonical
reference model for concepts and naming.

#### FRBR Concepts

Use `FRBR` concepts to separate:

- `Work`
- `Expression`
- `Manifestation`

The current code already distinguishes a legislation work from its versions,
but it does so informally. Make that distinction explicit in canonical
metadata.

#### ELI-Style Identifiers

Use `ELI` patterns for stable identifiers and public metadata publication.

Use them for:

- canonical URIs
- legal resource identity across systems
- web-facing metadata records

This does not require formal participation in the European ELI program. The
value is the identifier and metadata pattern.

#### schema.org/Legislation

Use `schema.org/Legislation` for site and web metadata publication.

Use it for:

- public documentation pages
- search-engine discoverability
- structured metadata on legislation detail pages or future HTTP surfaces

### Secondary Standards

#### DCAT

Use `DCAT` for dataset-level publication only.

Good fit:

- bulk exports
- data catalogs
- dataset download metadata

Poor fit:

- modeling the core legal work/version abstraction

#### LegalRuleML

Treat `LegalRuleML` as a future-only standard unless the product starts
representing executable norms, obligations, logic, or compliance reasoning.

It is relevant, but not the first standard this tool should implement.

## Canonical Entity Frame

The project should introduce a canonical metadata model with three core layers.

### Canonical Work

Represents the enduring legal instrument.

Recommended fields:

- `canonical_id`
- `source_system`
- `source_id`
- `jurisdiction_code`
- `document_type`
- `title`
- `short_title`
- `language`
- `work_uri`
- `preferred_citation`
- `neutral_citation`

### Canonical Expression

Represents a dated legal expression or consolidated version of the work.

Recommended fields:

- `expression_uri`
- `work_uri`
- `expression_date`
- `publication_date`
- `commencement_date`
- `in_force_date`
- `repeal_date`
- `lifecycle_state`
- `is_current`
- `version_label`

### Canonical Manifestation

Represents a concrete published representation of an expression.

Recommended fields:

- `manifestation_uri`
- `expression_uri`
- `format`
- `media_type`
- `source_url`
- `hash`
- `retrieved_at`

## Relationship Model

The canonical layer should support structured relationships rather than leaving
them as free text.

Minimum relationship types:

- `amends`
- `amended_by`
- `repeals`
- `repealed_by`
- `commences`
- `commenced_by`
- `derived_from`
- `supersedes`
- `has_expression`
- `has_manifestation`

The currently implemented baseline relationships are `has_expression` and
`has_manifestation`. Richer legislative relationships remain intentionally
deferred until provider data quality is sufficient to populate them
deterministically.

## Mapping to Current Code

### Existing Internal Model

The current provider model already contains:

- `work_id`
- `title`
- `type`
- `year`
- `number`
- `jurisdiction`
- `status`
- `versions`
- `citations`

This should remain the CLI-facing shape for now.

### Needed Canonical Additions

The missing canonical concepts are:

- explicit work/expression/manifestation separation
- canonical URIs independent of source-specific IDs
- richer lifecycle dates
- relationship metadata
- language and expression metadata
- consistent status semantics across jurisdictions

The initial provider-side canonical mapper now lives in
`src/providers/canonical-metadata.ts`. It is intentionally additive: providers
can emit canonical records without changing the current CLI-facing adapter path.

## Recommended Implementation Order

1. Define canonical TypeScript and Zod schemas beside the existing provider
   types.
2. Add per-provider mapping into canonical work, expression, and manifestation
   entities.
3. Adapt existing provider outputs from canonical metadata into the current CLI
   model.
4. Add canonical metadata to exports and future HTTP or site metadata surfaces.
5. Add structured relationship support as source quality improves.

The first part of Step 3 is now implemented. The existing provider
`output-adapters` derive legacy CLI-facing work objects from canonical records
internally, while preserving the current CLI output shape.

The first part of Step 4 is also now implemented. JSON exports with
`--include-metadata` include additive `canonicalRecords` output plus a canonical
standards note in export metadata. CSV exports remain row-compatible and add
only metadata comments.

The first publication helper is now implemented in
`src/output/legal-metadata-publication.ts`, which projects canonical records
into `schema.org/Legislation` JSON-LD.

## Design Rules

- Do not replace the CLI-facing model in one step.
- Do not force every provider to emit full Akoma Ntoso XML.
- Do not treat source IDs as canonical IDs.
- Keep source-specific parsing isolated inside provider mappers.
- Make standards alignment explicit in tests and architecture docs.

## Relevant References

- Akoma Ntoso: <https://www.oasis-open.org/committees/legaldocml/>
- Akoma Ntoso core specification: <https://docs.oasis-open.org/legaldocml/akn-core/v1.0/>
- ELI overview: <https://eur-lex.europa.eu/eli-register/about.html>
- schema.org Legislation: <https://schema.org/Legislation>
