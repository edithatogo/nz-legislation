# Track: Legal Metadata Standards Alignment

## Context

- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Metadata](./metadata.json)
- [ADR 0004](../../../docs/adr/0004-standards-aligned-canonical-legal-metadata.md)
- [Developer Guide: Legal Metadata Standards](../../../docs/developer-guide/legal-metadata-standards.md)
- [Relationship and Publication Follow-Through](./relationship-publication-follow-through.md)

## Status

🟢 COMPLETE - Phases 1 through 5 are complete. The repository now has
documented standards alignment, canonical schemas, provider mapping,
canonical-backed adapters, additive export metadata, and a publication helper

## Summary

The repository already has a usable internal cross-jurisdiction provider model,
but it does not yet have a standards-aligned canonical legal metadata layer.
That gap will become more important as more jurisdictions, exports, public
metadata, and document relationships are added.

This track introduces a staged implementation path that keeps the current
provider and CLI model stable while adding a canonical metadata layer aligned
with Akoma Ntoso, FRBR-style work and expression separation, ELI-style
identifier patterns, and schema.org publication metadata.

Phases 1 through 5 are complete: the accepted standards set, canonical field
inventory, ADR decision, developer-facing guidance, canonical schemas, schema
tests, provider-side canonical mapping, canonical-backed legacy adapters,
additive export metadata, relationship baseline, and publication helper are now
in source control. Richer source-derived legal relationships and dataset-level
publication remain appropriate follow-on work rather than hidden scope.

## Intended Outcome

- provider data can be normalized into a standards-aligned canonical layer
- the current CLI-facing model remains stable during migration
- legal identifiers, lifecycle dates, and document relationships become
  explicit and portable
- future datasets, site metadata, and new jurisdictions can share a single
  canonical legal metadata frame

## Review Automation

Use the phase-end review command at the end of each plan phase:

`node scripts/conductor-phase-review.mjs --track legal-metadata-standards-alignment --phase <n>`

For informational checks before a phase is complete:

`node scripts/conductor-phase-review.mjs --track legal-metadata-standards-alignment --phase <n> --allow-open-tasks`

---

**Track ID:** `legal-metadata-standards-alignment`  
**Last Updated:** 2026-03-14
