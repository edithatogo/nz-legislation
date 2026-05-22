# Submission pathways v9

## npm

Current package: `nz-legislation-tool`.

Tasks:

- ensure package metadata reflects ANZ prerelease honestly
- preserve legacy binaries
- add `anzlegislation` aliases only where already supported
- publish prerelease using `next` dist-tag
- publish stable only after provider truthfulness gate
- reserve or prepare `anz-legislation` as a future sibling/alias package only after AU support is credible

## Website

Tasks:

- publish capability matrix
- publish source authority cards
- publish install snippets for each host
- add `llms.txt`
- add MCP server config page
- add roadmap/status page
- ensure npm, GitHub, and docs links agree

## MCP registries

Candidate registries/directories:

- official/community MCP registry path, if available
- Smithery
- mcp.so
- MCP Market
- MCP Store
- PulseMCP
- Glama-style MCP directories
- npm discoverability

For each:

1. verify current submission docs
2. create listing metadata
3. verify install command
4. test stdio config
5. document API-key requirements
6. declare capabilities honestly
7. run security review
8. submit only after gate

## Claude

Artifacts:

- Claude Desktop MCP config snippet
- Claude Code setup docs
- optional `CLAUDE.md`
- optional skill package under `integrations/claude/skill/`

Do not call this a public Claude plugin until the current Anthropic submission path is verified.

## Codex

Artifacts:

- root `AGENTS.md`
- `integrations/codex/prompts/`
- MCP config snippet
- local task prompts for provider implementation

Do not claim a public Codex plugin marketplace unless current official OpenAI docs confirm it.

## GitHub Copilot

Artifacts:

- `.github/copilot-instructions.md`
- GitHub App / Copilot Extension plan
- Marketplace submission checklist

Verify current GitHub Copilot Extension docs before implementation.

## VS Code

Artifacts:

- extension scaffold under `integrations/vscode/`
- extension manifest
- commands:
  - search legislation
  - get provision
  - insert citation
  - configure API keys
  - start/stop MCP server
- publish to Visual Studio Marketplace and Open VSX after extension gate

## Gemini

Artifacts:

- OpenAPI/function-calling schema
- Google AI Studio/Vertex-compatible examples
- Gemini prompt pack

Verify current Google/Gemini extension submission path before claiming marketplace support.

## Qwen

Artifacts:

- tool schema/function-calling examples
- Qwen-Agent compatible wrapper
- ModelScope/Alibaba Cloud notes

Verify current Qwen submission path before claiming marketplace support.
