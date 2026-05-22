# Distribution and submission map v9

## Principle

One repo, many surfaces.

All integration surfaces should be generated, documented, or packaged from `edithatogo/nz-legislation`.
Package and listing metadata must describe the current NZ runtime. Do not claim
Australian runtime support until the provider gates pass. ANZ names remain
transitional aliases only; this PR does not rename packages, publish packages,
or submit listings.

## Channel matrix

| Channel                       | Pathway                                | Artifact                         | Status                     | Gate                    |
| ----------------------------- | -------------------------------------- | -------------------------------- | -------------------------- | ----------------------- |
| npm stable                    | npm registry                           | `nz-legislation-tool`            | Existing/stable            | release gate            |
| npm prerelease                | npm registry `next` tag                | `nz-legislation-tool@next`       | Existing/planned           | prerelease gate         |
| npm ANZ alias                 | npm registry                           | `anz-legislation`                | Transitional alias only    | AU truthfulness gate    |
| GitHub Packages               | GitHub Packages                        | scoped mirror                    | Preparation only           | release workflow gate   |
| GitHub Releases               | GitHub repo releases                   | tarballs, changelog              | Required                   | release gate            |
| Website/docs                  | GitHub Pages/docs site                 | docs, install, capability matrix | Required                   | docs gate               |
| MCP generic                   | repo/npm docs                          | stdio config                     | Required                   | MCP provider-aware gate |
| Smithery                      | MCP registry                           | registry metadata                | Validate current process   | security gate           |
| mcp.so                        | MCP directory                          | listing metadata                 | Validate current process   | security gate           |
| MCP Market                    | MCP directory                          | listing metadata                 | Validate current process   | security gate           |
| MCP Store                     | MCP directory                          | listing metadata                 | Validate current process   | security gate           |
| PulseMCP                      | MCP directory                          | listing metadata                 | Validate current process   | security gate           |
| Glama-style directories       | MCP directory                          | listing metadata                 | Validate current process   | security gate           |
| Claude Desktop                | local MCP config                       | JSON config snippets             | Required                   | MCP provider-aware gate |
| Claude Code                   | repo instructions                      | `CLAUDE.md`, prompt pack         | Required                   | docs gate               |
| Claude Skills                 | skill package                          | `skill.md`, scripts              | Validate current process   | skill security gate     |
| Codex                         | local coding-agent instructions        | `AGENTS.md`, prompts             | Required                   | docs gate               |
| ChatGPT/OpenAI app/GPT action | Apps/GPT action route                  | OpenAPI/MCP bridge               | Source-validation-required | official docs gate      |
| GitHub Copilot                | Copilot Extension                      | GitHub App / Marketplace listing | Source-validation-required | official docs gate      |
| VS Code                       | VS Code Marketplace                    | extension package                | P1                         | extension security gate |
| Open VSX                      | Open VSX registry                      | extension package                | P1                         | extension security gate |
| Gemini                        | Gemini API/AI Studio/Vertex tool route | OpenAPI/function declarations    | Source-validation-required | official docs gate      |
| Qwen                          | Qwen-Agent/Alibaba tool route          | tool schemas/prompts             | Source-validation-required | official docs gate      |
| JetBrains                     | JetBrains Marketplace                  | plugin                           | P2                         | plugin gate             |
| Docker/GHCR                   | GHCR                                   | container image                  | P2                         | supply-chain gate       |
| Homebrew                      | tap/formula                            | formula                          | P2                         | release gate            |

## Order

Do not submit to registries until the legal-data truthfulness gate passes.
GitHub Packages is preparation-only unless a release workflow publishes it.
