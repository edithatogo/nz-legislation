# ANZ Platform Release and Distribution

**Track ID:** `anz-platform-release-and-distribution`  
**Status:** ACTIVE  
**Priority:** P0  
**Created:** 2026-05-19  
**Imported:** 2026-05-20  
**Source handoff:** `conductor/archive/handoffs/2026-05-19-v9-distribution-submission/anz_legislation_handoff_v9_covering_prompt.zip`

## Purpose

This is the umbrella delivery track for all release, distribution, submission,
assistant integration, IDE integration, packaging, documentation, and long-term
Rust-readiness work for the legislation platform.

The track keeps one repository as the source of truth. It absorbs the v9
distribution/submission handoff, release-governance work, ANZ brand-transition
planning, provider hardening, MCP/export routing, website/docs preparation, and
future marketplace submission pathways into a single delivery path.

## Single-repository rule

All artifacts stay in this repository. Do not create separate repositories for:

- MCP server or registry work
- Claude, Codex, GitHub Copilot, Gemini, Qwen, or other assistant work
- VS Code, Open VSX, JetBrains, or other IDE work
- website/docs work
- Docker/GHCR or Homebrew distribution work
- future Rust migration planning

Host-specific artifacts live under `integrations/`, maintainer guidance lives
under `docs/maintainers/`, and implementation changes remain in the existing
application/package tree.

## Compatibility contract

The current stable compatibility surface remains:

- package/CLI: `nz-legislation-tool`
- CLI alias: `nzlegislation`
- MCP compatibility naming: `nzlegislation-mcp`

During the incomplete ANZ transition, keep compatibility aliases available for:

- package/CLI alias: `anzlegislation`
- MCP alias: `anzlegislation-mcp`

No package rename, repository rename, public package publication, registry
submission, website deployment, or external marketplace submission is authorized
by this import.

## Merged inputs

This umbrella track supersedes separate distribution/submission planning lanes
without deleting their history. It treats the following as inputs:

- `release-governance-modernization`
- `anz-brand-transition`
- `legal-metadata-standards-alignment`
- `documentation-site-completion`
- `documentation-site-enhancements`
- v9 handoff distribution and submission roadmap
- v9 handoff assistant, IDE, MCP registry, Docker/GHCR, Homebrew, and Rust
  readiness checklists

## Required channels

The track covers these release and submission surfaces:

- npm stable, npm prerelease, and ANZ compatibility alias
- GitHub Packages and GitHub Releases
- website/docs
- MCP registries, including Smithery and other MCP directories
- Claude
- Codex
- GitHub Copilot
- VS Code Marketplace
- Open VSX
- Gemini
- Qwen
- JetBrains
- Docker/GHCR
- Homebrew
- long-term Rust migration readiness

The detailed channel status is maintained in `channel-matrix.md`.

## Release and submission gates

Before any later external submission, package publication, website deployment,
marketplace listing, or registry entry, all applicable gates in
`release-submission-gates.md` must pass:

- no-placeholder legal data
- provider capability manifest
- provider-aware MCP/export
- accurate package metadata
- updated website/docs
- tested install snippets
- security/provenance review
- release notes distinguishing NZ stable support from Australian prerelease
  support

## Provider API roadmap

Candidate legal-data providers and APIs are tracked in
`provider-api-roadmap.md`. That roadmap includes NZ compatibility, Australian
Commonwealth, Queensland, NSW, Victoria, South Australia, Western Australia,
Tasmania, ACT, Northern Territory, cross-jurisdiction aggregator evaluation, and
future HTTP/OpenAPI adapter readiness.

Those entries are source-validation-required backlog items only. They do not
mean the APIs are implemented, release-ready, or safe to describe as supported.

## Current state

- The v9 handoff ZIP is archived in-repo.
- The v9 `repo-overlay/` has been incorporated into the repository root.
- Integration folders and maintainer docs now exist as preparation surfaces.
- No publishing, deployment, registry submission, repository rename, package
  rename, or external submission has been performed.
- Australian support remains prerelease/planned until provider truth, legal-data
  quality, capability, docs, and security gates pass.

## Exit criteria

- A single coherent release/distribution roadmap exists in this track.
- Channel matrix and gate checklist are current and owned.
- Provider capability manifest is implemented and consumed by CLI, MCP, export,
  docs, and website surfaces.
- MCP/export behavior is provider-aware and fails truthfully for unsupported
  jurisdictions.
- Website/docs, package metadata, registry copy, and install snippets match the
  runtime capability manifest.
- Security/provenance review is complete for every submitted artifact.
- Release notes clearly separate NZ stable support from Australian prerelease
  support.
- Rust migration readiness is documented as future work without starting a
  rewrite in this track.
