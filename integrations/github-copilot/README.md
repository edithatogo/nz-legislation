# GitHub Copilot integration

## Surfaces

- `.github/copilot-instructions.md`
- Copilot Extension via GitHub App, after current docs are verified
- GitHub Marketplace listing, if applicable

## First deliverable

Add repository instructions that help Copilot respect:

- no-placeholder legal data
- provider capability manifest
- single-repo rule
- release gates

Current local capability: `.github/copilot-instructions.md` plus the packaged
MCP stdio command. A future Copilot CLI plugin must include a reviewed
`plugin.json` and explicitly declare skills, agents, hooks, and MCP configuration
that it uses. See [`../assistant-marketplace-readiness.md`](../assistant-marketplace-readiness.md).
