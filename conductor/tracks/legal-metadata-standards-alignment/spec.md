# Specification: Legal Metadata Standards Alignment

**Track ID:** legal-metadata-standards-alignment  
**Type:** feature  
**Status:** 🟡 IN PROGRESS  
**Last Updated:** 2026-03-14

## Problem

The current provider abstraction is coherent inside the product, but it is not
formally aligned to a legal metadata standard. As a result:

- identifiers are source-specific and only loosely normalized
- work and version semantics are implicit rather than canonical
- jurisdiction expansion risks accumulating product-local metadata drift
- future exports and site metadata will be harder to standardize

## Goal

Add a standards-aligned canonical legal metadata layer without breaking the
existing CLI-facing provider contract.

## Scope

In scope:

- standards selection and documentation
- canonical TypeScript and Zod schemas
- provider-to-canonical mapping rules
- canonical-to-CLI adapter boundaries
- lifecycle and relationship field definitions
- tests that lock the canonical mapping shape

Out of scope:

- immediate full Akoma Ntoso XML generation
- a new public HTTP API
- full relationship extraction from every source in the first pass
- LegalRuleML implementation

## Standards Position

Primary standards:

- `Akoma Ntoso`
- `FRBR` concepts
- `ELI`-style identifiers
- `schema.org/Legislation`

Secondary standards:

- `DCAT` for dataset publication
- `LegalRuleML` for future rules modeling only

## Success Criteria

- canonical schemas exist and are documented
- at least the existing NZ, Commonwealth, and Queensland providers map into the
  canonical model
- the current CLI surface continues to work through adapters
- architecture docs explain the two-layer model clearly
- future jurisdictions have a clear canonical onboarding pattern
