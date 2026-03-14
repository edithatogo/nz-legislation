# ADR 0004: Add a Standards-Aligned Canonical Legal Metadata Layer

## Status

Accepted

## Context

The current codebase has a clear internal cross-jurisdiction provider model for
search, work retrieval, versions, citations, caching, and health monitoring.
That model is intentionally product-oriented and normalizes New Zealand,
Commonwealth, and Queensland sources into a common TypeScript interface.

What it does not currently provide is a standards-aligned canonical metadata
layer for legislation that can be reused across jurisdictions, published
externally, or mapped cleanly to future legal XML and metadata ecosystems.

As more jurisdictions are added, the absence of a canonical standards layer
creates three problems:

- identifiers and version semantics remain product-local rather than portable
- relationships such as amendment, repeal, commencement, and consolidation stay
  ad hoc
- future interoperability with bulk datasets, site metadata, and legal document
  exchange formats becomes harder

## Decision

The project will keep the existing provider interface as its application-facing
domain model, but add a standards-aligned canonical metadata layer beneath it.

The canonical layer should align to the following standards in order of
importance:

- `Akoma Ntoso` for legislative document structure and lifecycle semantics
- `FRBR` concepts for work, expression, and manifestation separation
- `ELI`-style identifiers and metadata publication patterns for stable legal
  resource identity
- `schema.org/Legislation` for web-facing discoverability

The following standards are relevant but secondary:

- `DCAT` for dataset publication and catalog metadata, not core document
  modeling
- `LegalRuleML` for machine-readable norms and reasoning, only if the project
  later models executable legal rules

The canonical layer should introduce explicit fields for:

- source identity: `source_system`, `source_id`, `source_url`
- canonical identity: `canonical_id`, `work_uri`, `expression_uri`,
  `manifestation_uri`
- legal classification: `jurisdiction_code`, `document_type`,
  `lifecycle_state`, `language`
- temporal metadata: `publication_date`, `commencement_date`,
  `in_force_date`, `repeal_date`
- versioning metadata: `version_date`, `is_current`, `expression_date`
- citation metadata: `preferred_citation`, `neutral_citation`
- relationship metadata: amendment, repeal, commencement, and derivation links

## Consequences

### Positive

- future jurisdictions can map into a durable legal metadata frame
- the product can support richer legal relationships without bloating the
  CLI-facing model
- XML, web metadata, and export work can align to recognized legal information
  standards
- site and API metadata can become more interoperable without rewriting the
  application surface

### Negative

- provider implementations will need an extra normalization layer
- some source systems will not map perfectly to Akoma Ntoso or ELI patterns
- the project will need explicit governance to prevent standards drift

### Non-Goals

- immediate conversion of all source content to full Akoma Ntoso XML
- immediate exposure of a public standards-based HTTP API
- implementation of LegalRuleML in the current release cycle
