# Spec: ANZ Platform Release and Distribution

## Requirements

### R1: Single repository

All distribution, submission, assistant, IDE, website/docs, Docker/GHCR,
Homebrew, and Rust-readiness artifacts must live in this repository. The import
must not create sibling repositories or imply that separate repositories are
required later.

### R2: Compatibility preservation

The existing stable names remain supported while the ANZ transition is
incomplete:

- `nz-legislation-tool`
- `nzlegislation`
- `nzlegislation-mcp`

The ANZ aliases remain compatibility aliases during transition:

- `anzlegislation`
- `anzlegislation-mcp`

Any future package metadata, docs, registry copy, and release notes must state
which names are stable, which names are aliases, and which surfaces are
prerelease.

### R3: No external side effects from import

This import may add planning artifacts, checklists, integration folders,
security gates, and submission roadmap material only. It must not:

- publish to npm or GitHub Packages
- deploy the website/docs site
- rename the repository
- rename packages
- submit to MCP registries or marketplaces
- submit to VS Code Marketplace, Open VSX, JetBrains, Claude, Codex, GitHub
  Copilot, Gemini, or Qwen directories
- push Docker/GHCR images
- publish a Homebrew formula

### R4: Release and submission gates

Before any future publication, listing, deployment, marketplace submission, or
registry submission, the applicable gate record must show passing evidence for:

- no-placeholder legal data
- provider capability manifest
- provider-aware MCP/export
- accurate package metadata
- updated website/docs
- tested install snippets
- security/provenance review
- release notes distinguishing NZ stable from Australian prerelease support

### R4a: MoSCoW requirements and contracts

Maintain `conductor/requirements.md` as the single MoSCoW requirements and
contract register for:

- provider tracks, including present stable NZ support, present Commonwealth
  prerelease support, planned Australian jurisdictions, aggregator evaluation,
  and future HTTP/OpenAPI readiness
- publication and registry tracks, including npm, GitHub Packages, website/docs,
  MCP directories, assistant integrations, IDE marketplaces, Docker/GHCR,
  Homebrew, and Rust migration readiness
- global compatibility, no-placeholder, and release/submission gate contracts

Every provider, publication, registry, integration, and migration row in the
requirements register must have a matching Conductor track with `metadata.json`,
`spec.md`, and `plan.md`.

### R5: Capability manifest as source of truth

Runtime capability must be represented in a provider capability manifest. CLI,
MCP, export metadata, docs, website, package metadata, install snippets, and
listing copy must derive from or be checked against that manifest.

The manifest must make unsupported or prerelease provider capability explicit
instead of relying on placeholder data or silent fallback behavior.

### R6: Provider-aware MCP and export behavior

MCP tools and export paths must route through provider-aware capability checks.
Unsupported legal data must fail with structured unsupported capability errors.
Export output must include source/provenance metadata appropriate to the
provider.

### R7: Provider API roadmap

Maintain `provider-api-roadmap.md` as the source-validation-required backlog for
future legal-data providers and APIs. The roadmap must include, at minimum:

- existing New Zealand compatibility provider surface
- Australian Commonwealth
- Queensland
- New South Wales
- Victoria
- South Australia
- Western Australia
- Tasmania
- Australian Capital Territory
- Northern Territory
- cross-jurisdiction aggregator evaluation
- future HTTP/OpenAPI adapter readiness

No roadmap entry is release-ready until official source documentation, access
terms, provider behavior, tests, provenance, and capability manifest entries are
complete.

### R8: Host-specific integration folders

Integration folders are repository-local preparation surfaces:

```text
integrations/mcp
integrations/claude
integrations/codex
integrations/github-copilot
integrations/vscode
integrations/gemini
integrations/qwen
integrations/jetbrains
integrations/generic-hosts
```

Any future Docker/GHCR, Homebrew, website/docs, or Rust-readiness files also
remain in this repository and must be referenced from this umbrella track.

### R9: Submission matrix

Maintain `channel-matrix.md` with:

- target channel
- artifact or listing
- repo-local source path
- priority
- current status
- required gate
- current documentation verification state
- external submission/publishing status
- next action

### R10: Security and provenance

Each channel must have a security/provenance review before submission. Reviews
must cover package provenance, registry/listing claims, command snippets,
permissions, generated artifacts, release notes, and supply-chain implications.

### R11: Rust migration readiness

Rust work remains long-term readiness only in this track. Planning may record
boundary contracts, test expectations, package compatibility, and release gates,
but this track must not start a rewrite or introduce a second implementation
repository.

## Non-goals

- immediate repository rename
- immediate package rename
- public package publication during import
- website deployment during import
- marketplace or registry submission during import
- unverified listing claims
- public community plugin ecosystem
- Rust rewrite
