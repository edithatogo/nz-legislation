# Spec: Australian Commonwealth Provider

## Purpose

Implement Australian Commonwealth legislation support from the official Federal
Register of Legislation API inside this repository, without changing the stable
New Zealand support contract or enabling unsupported Australian runtime claims.

## Requirements

### R1: Source-backed provider only

Commonwealth runtime support must use the Federal Register of Legislation public
API and official API-shaped fixtures. It must not revive placeholder legacy
plugin behavior or infer legal records that are not present in source data.

### R2: Compatibility and naming

The existing `nz-legislation-tool`, `nzlegislation`, and `nzlegislation-mcp`
surfaces remain stable. `anzlegislation` and `anzlegislation-mcp` remain
transition aliases while Australian support is incomplete.

### R3: Capability gate

`au-commonwealth` must remain unsupported in the provider capability manifest
until search, get-work, versions, citation, export, MCP, source cards,
documentation, and no-placeholder tests all pass.

### R4: Provider-aware runtime

When enabled later, CLI, MCP, and export paths must route through explicit
jurisdiction/provider selection and must never fall back to New Zealand data for
Commonwealth requests.

### R5: Provenance

Every Commonwealth export or MCP response must be able to identify the Federal
Register as the source authority and preserve useful source identifiers,
versions, document URLs, and retrieval metadata.

## Non-goals

- publishing packages
- submitting registry listings
- renaming the repository or package
- starting a Rust rewrite
- enabling live Commonwealth runtime support before the release gates pass
