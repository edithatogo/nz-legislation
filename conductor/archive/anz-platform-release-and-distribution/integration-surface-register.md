# Integration Surface Register

This register keeps host-specific work inside the single repository and prevents
the v9 distribution/submission roadmap from becoming separate project trees.

| Surface              | Repo path                                                         | Role                                                        | Submission status |
| -------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------- | ----------------- |
| Generic MCP hosts    | `integrations/mcp/`, `integrations/generic-hosts/`                | MCP config snippets, registry checklist, generic host notes | Preparation only  |
| Claude               | `integrations/claude/`                                            | Claude Desktop and MCP configuration guidance               | Preparation only  |
| Codex                | `integrations/codex/`, `AGENTS.md`                                | Local import prompt-pack and repo operating guidance        | Preparation only  |
| GitHub Copilot       | `.github/copilot-instructions.md`, `integrations/github-copilot/` | Repository instructions and future extension planning       | Preparation only  |
| VS Code and Open VSX | `integrations/vscode/`                                            | Extension planning and publication pathway notes            | Preparation only  |
| Gemini               | `integrations/gemini/`                                            | Source-validation-required tool route notes                 | Preparation only  |
| Qwen                 | `integrations/qwen/`                                              | Source-validation-required tool route notes                 | Preparation only  |
| JetBrains            | `integrations/jetbrains/`                                         | Future plugin readiness notes                               | Preparation only  |
| Website/docs         | `docs/`, `docs/maintainers/`, `llms.txt`                          | Public documentation and maintainer publication guidance    | Preparation only  |
| Docker/GHCR          | Future repo-local files                                           | Container distribution readiness                            | Not started       |
| Homebrew             | Future repo-local files                                           | Formula/tap readiness                                       | Not started       |
| Rust migration       | Future repo-local ADRs and tests                                  | Long-term migration contract planning                       | Readiness only    |

## Repository rule

If a future artifact needs source files, manifests, snippets, scripts, or review
notes, add them under this repository and link them from the umbrella track. Do
not create a separate MCP, Claude, Codex, Copilot, VS Code, Gemini, Qwen,
website, Docker, Homebrew, JetBrains, or Rust repository from this work.
