# Assistant Integration Readiness

Status: preparation-only. No assistant marketplace, plugin directory, or
first-party submission is authorized by this document.

Last verified: 2026-07-11

## Shared capability contract

All targets use the same repository package and MCP behavior:

- Package: `nz-legislation-tool`
- Stable CLI: `nzlegislation`
- Stable MCP stdio binary: `nzlegislation-mcp`
- Transition aliases: `anzlegislation`, `anzlegislation-mcp`
- Neutral aliases: `legislation`, `legislation-mcp`
- Credential: runtime-only `NZ_LEGISLATION_API_KEY`
- New Zealand: stable, source-backed
- Australian Commonwealth: source-backed prerelease for the declared runtime
  operations
- Other Australian jurisdictions: planned or unsupported
- No write actions, community plugin loading, fabricated legal data, or implied
  first-party endorsement

## Target matrix

| Target         | Repository artifact                     | Current official surface                                                     | Evidence status                                                       | Submission status                                          |
| -------------- | --------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| Claude         | `integrations/claude/README.md`         | Claude Desktop/Code MCP; Anthropic MCP connector                             | Local MCP guidance verified; public marketplace route not established | Blocked pending target-specific review                     |
| Codex          | `integrations/codex/README.md`          | Workspace-controlled plugins containing skills/apps; local MCP/app review    | Official plugin permission and app-boundary guidance verified         | Blocked pending workspace/plugin approval                  |
| GitHub Copilot | `integrations/github-copilot/README.md` | Copilot CLI plugin with `plugin.json`, skills, agents, hooks, and MCP config | Plugin structure and marketplace model verified                       | Blocked pending manifest, review, and marketplace decision |
| Gemini         | `integrations/gemini/README.md`         | Gemini API tools/function calling and MCP-capable tool integrations          | Tool-call route verified; no generic extension claim made             | Blocked pending target API and hosting review              |
| Qwen           | `integrations/qwen/README.md`           | Qwen-Agent tools, function calling, and MCP configuration                    | Official Qwen-Agent MCP/tool route verified                           | Blocked pending package/runtime and distribution review    |

## Evidence register

| Target         | Official source                                                  | Verified fact                                                                                                           | Required next evidence                                                                                                                      |
| -------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude         | https://docs.anthropic.com/en/docs/mcp                           | Claude products support MCP clients and servers; local and remote surfaces differ                                       | Verify current directory/marketplace route, MCP transport, auth, listing, and security requirements immediately before submission           |
| Codex          | https://help.openai.com/en/articles/20001256-plugins-in-codex    | Codex plugins package skills and may depend on approved apps; app permissions and write actions are reviewed separately | Define plugin manifest/skill package, app dependency (if any), read-only behavior, approval group, and pilot evidence                       |
| GitHub Copilot | https://docs.github.com/en/copilot/concepts/agents/about-plugins | Copilot plugins require a `plugin.json` and may include skills, agents, hooks, and MCP/LSP configuration                | Add a repository-local plugin manifest only after package/MCP smoke tests and security review; verify marketplace registration requirements |
| Gemini         | https://ai.google.dev/gemini-api/docs/tools                      | Gemini uses tool declarations and tool results to drive tool calls                                                      | Verify hosting, auth, schema, quotas, and current Google distribution route; do not call this an extension marketplace submission           |
| Qwen           | https://github.com/QwenLM/Qwen-Agent                             | Qwen-Agent supports function calling and MCP configuration                                                              | Verify Python wrapper contract, MCP transport, credential handling, and ModelScope/Alibaba publication requirements                         |

## Submission gate

Before any target-specific external action, all of the following must be
recorded in a release evidence packet:

1. Exact target requirements and source URL, rechecked immediately before action.
2. Package, binary, MCP transport, capability, provenance, and credential map.
3. Clean-host install/configuration transcript for the exact published snippet.
4. Security review covering tools, permissions, data flow, auth, and write actions.
5. Listing copy review proving NZ stable and AU prerelease/planned language.
6. Maintainer approval for the target and the exact external action.

Until then, the target remains preparation-only.
