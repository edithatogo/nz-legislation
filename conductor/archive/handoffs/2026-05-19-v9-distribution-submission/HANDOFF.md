# ANZ Legislation Handoff v9-covering-prompt

Created: 2026-05-19

## Objective

Add a comprehensive distribution/submission roadmap to the existing ANZ hardening plan while preserving the single-repo strategy.

The repo should not split into separate integration repositories. Instead, use one canonical repository with:

- `src/` for CLI/MCP/provider code
- `docs/` for maintainer and website-facing documentation
- `integrations/` for host-specific install/config/extension artifacts
- `conductor/` for merged roadmap and progress tracking
- future `crates/` only after Rust migration readiness gates pass

## Strategy

The previous v9 handoff focused on release reconciliation and no-placeholder legal data. v9 keeps those as the first phases and adds a consolidated launch/distribution track.

The track name is:

```text
anz-platform-release-and-distribution
```

This track merges:

- release reconciliation
- ANZ hardening
- provider capability truth
- npm / GitHub Packages / website publishing
- MCP registry submission
- assistant/IDE plugin and extension pathways
- long-term Rust migration readiness

## Single-repo rule

Do not create sibling repos for:

- MCP registry packaging
- Claude skill
- Codex prompts
- Copilot extension
- VS Code extension
- Gemini/Qwen tool wrappers
- Rust migration

Use subdirectories and package metadata in this repo.

Recommended integration tree:

```text
integrations/
  README.md
  mcp/
  claude/
  codex/
  github-copilot/
  vscode/
  gemini/
  qwen/
  jetbrains/
  generic-hosts/
```

## Submission readiness gates

No public submission should happen until:

1. no-placeholder legal data gate passes
2. capability manifest exists and is consumed by CLI/MCP/docs
3. provider-routed MCP/export passes tests
4. npm package metadata is accurate
5. website/docs are updated
6. install snippets are tested
7. security/trust review is complete
8. release notes clearly mark AU provider status

## Launch surfaces

P0:

- npm latest/next
- GitHub Releases
- GitHub Packages mirror
- website/docs
- MCP host config docs
- Smithery / MCP registries after security gate
- Claude Desktop / Claude Code local config
- Codex local AGENTS/prompt-pack workflow

P1:

- VS Code Marketplace
- Open VSX
- GitHub Copilot Extension
- ChatGPT / OpenAI app or GPT action route after official submission validation
- Gemini tool/OpenAPI route after official validation
- Qwen tool route after official validation

P2:

- JetBrains plugin
- Docker/GHCR
- Homebrew
- public plugin ecosystem
- Rust-native distribution

## What the ZIP contains

- covering prompt
- master Codex prompt
- local import/archive prompt
- distribution map
- registry submission checklist
- merged Conductor track
- repo overlay
- schemas and checklists
