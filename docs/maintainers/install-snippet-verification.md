# Install snippet verification

This page is a maintainer gate for future publishing and submission work. It
does not authorize publishing to npm, submitting to MCP registries, publishing
IDE extensions, uploading containers, opening marketplace listings, or making
external package-manager submissions during this PR.

Before any future publishing or submission, maintainers must test every install
or configuration snippet that will be published for that surface. Record the
exact command, package source, host version, jurisdiction claim, result, and
evidence location before treating the snippet as release-ready.

## Claim boundaries

- New Zealand support is the stable baseline.
- Australian support is planned or unsupported unless the relevant provider
  gates have passed.
- AU snippets must not claim working runtime support, provider coverage, or
  legal-data availability until the provider capability, source validation,
  runtime routing, MCP/export, and release gates all pass.
- Snippets may describe future AU setup only when clearly labelled as planned
  or unsupported.
- Do not publish fabricated legal data or examples that look like verified AU
  output.

## Checklist

For each applicable surface, verify the published snippet from a clean shell or
fresh host profile:

- [ ] `npm install -g nz-legislation-tool`
- [ ] `npx -y --package nz-legislation-tool nzlegislation --help`
- [x] local package install from the built tarball or workspace package
- [ ] `npx -y --package nz-legislation-tool nzlegislation-mcp`
- [x] MCP stdio command and JSON config
- [ ] Claude Desktop MCP config
- [ ] Claude Code / project instruction snippet
- [ ] Codex `AGENTS.md` / MCP config snippet
- [ ] GitHub Copilot instructions or extension setup notes
- [ ] VS Code extension or command setup
- [ ] Open VSX package/install route
- [ ] Gemini function, OpenAPI, or tool-calling snippet
- [ ] Qwen / Qwen-Agent tool snippet
- [ ] JetBrains plugin setup notes
- [ ] Docker or GHCR image command
- [ ] Homebrew formula or tap command

Mark a surface `not applicable` only when no snippet for that surface will be
published in the release or submission packet.

## Evidence fields

Capture these fields for each checked snippet:

| Field                | Required evidence                                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Surface              | npm, npx, local package, MCP stdio, Claude, Codex, Copilot, VS Code, Open VSX, Gemini, Qwen, JetBrains, Docker, Homebrew, or other host |
| Snippet source       | File path, docs page, registry packet, marketplace draft, or release note                                                               |
| Exact snippet tested | Command or config block as published                                                                                                    |
| Package source       | npm version, local tarball path, workspace path, image digest, formula commit, or extension package                                     |
| Host environment     | OS, shell, Node version, host app/version, and clean-profile notes                                                                      |
| Jurisdiction claim   | `NZ stable`, `AU planned`, `AU unsupported`, or another explicit provider status                                                        |
| Provider gates       | Gate names and pass/fail status for any non-NZ claim                                                                                    |
| Result               | Pass, fail, blocked, or not applicable                                                                                                  |
| Evidence             | Log path, screenshot path, CI run URL, terminal transcript, or review packet path                                                       |
| Maintainer/date      | Reviewer name and verification date                                                                                                     |

## Minimum acceptance

A snippet is ready only when it installs or configures the intended package,
starts the intended command, and the user-facing copy matches the actual
provider support. Any failure, blocked host setup, missing provider gate, or
unclear jurisdiction claim keeps that surface out of the external publishing or
submission packet.

## Automated local evidence

`pnpm gate:install-snippets` now runs both text checks and a local package smoke
test. The smoke test builds the workspace, packs `nz-legislation-tool` into
`.tmp/install-snippet-smoke/pack/`, installs that tarball into a clean temporary
project, verifies the installed `nzlegislation --help` binary, and starts the
installed `nzlegislation-mcp` binary long enough to confirm MCP stdio startup
and answer an MCP `initialize` request.

This evidence is local-only. It does not install from npm, publish a package,
submit to an MCP registry, or prove host-specific marketplace setup. Future
external release or submission packets still need surface-specific evidence for
the exact published command or host configuration.
