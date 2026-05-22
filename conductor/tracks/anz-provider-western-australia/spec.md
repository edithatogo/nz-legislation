# Spec: Western Australia Provider Source-Shape and Adapter Track

## Purpose

This track records the machine-readable source-shape discovery and adapter
boundary for the Western Australian legislation provider. It keeps Western
Australia in the single repository as an unsupported/prerelease Australian
provider until the runtime, fixtures, tests, and provenance evidence are
actually source-backed.

The track is about authoritative discovery and truthful gating, not about
claiming support early.

## Requirements

### R1: Single repository

All work stays in this repository. Do not create a separate Western Australia
repo, a separate provider repo, or any out-of-tree adapter project.

### R2: Compatibility preservation

The current stable compatibility surface remains:

- `nz-legislation-tool`
- `nzlegislation`
- `nzlegislation-mcp`

The ANZ aliases remain transitional compatibility aliases:

- `anzlegislation`
- `anzlegislation-mcp`

Western Australia work must not break NZ stable compatibility or rename
package and MCP surfaces.

### R3: No placeholder legal data

Western Australia must stay unsupported until source-backed behavior exists.
The track must not normalize placeholder records, dummy acts, fabricated
citations, or stubbed search/export output as if they were real support.

### R4: Source-shape discovery

Identify and record the Western Australian legislation source shape in a
machine-readable form. Capture:

- authoritative source entry points
- document and page formats
- URL and identifier patterns
- machine-readable feeds or downloads if present
- versioning and consolidation cues
- citation and provenance fields
- unsupported or ambiguous edge cases

The source-shape record must be sufficient for an adapter implementation to
map discovery, fetch, parse, and version handling without guesswork.

### R5: Authoritative formats and adapter mapping

Choose and record the authoritative formats that the future adapter will use.
Document how Western Australia maps from source shape to provider contract for:

- search
- retrieval
- version/history handling
- export
- provenance metadata
- unsupported capability errors

Adapter mapping must be explicit about what is supported, what is not, and what
remains blocked on source evidence.

### R6: Provider manifest and unsupported status

Western Australia must appear in the provider capability manifest with truthful
status. Until the source-backed adapter and tests land, the manifest must show
Western Australia as unsupported, prerelease, or otherwise gated, never as
fully supported.

### R7: Fixtures and tests

Add fixtures that reflect real Western Australia source shapes and use them to
test:

- no-placeholder legal data
- parsing and normalization
- adapter mapping
- unsupported capability errors
- manifest/provider alignment

Tests must fail if Western Australia is described as supported without the
required source-backed evidence.

### R8: Provider-aware MCP/export and provenance

Western Australia-facing MCP and export paths must be provider-aware.
Exported output must carry provenance/source cards and must not omit source
identity, jurisdiction, or format assumptions.

### R9: Docs and release notes

Track the docs and release-note language needed to describe Western Australia
truthfully once the gate passes. Do not publish support copy before the
manifest, tests, and provenance records are complete.

## Non-goals

- public Western Australia support claims
- publication or deployment
- external registry submission
- repository split
- Rust rewrite
- placeholder data or fabricated fixtures

## Exit criteria

- Western Australia source shape is recorded in a machine-readable artifact.
- Authoritative formats and adapter mappings are documented.
- Fixtures and tests cover the Western Australia source-backed path and
  unsupported path.
- The provider manifest records Western Australia truthfully.
- MCP/export provenance cards are defined.
- Release notes and docs language are ready for a gated future enablement.
