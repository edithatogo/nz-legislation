# Codex master prompt v9 — single-repo ANZ platform release and distribution

You are working in `edithatogo/nz-legislation`.

## Mission

Merge the release, provider, MCP, website, npm, registry-submission, assistant-extension, IDE-extension, and Rust-readiness tracks into one coherent single-repo roadmap.

Do not create additional repositories.

## Context

The repo already has ANZ prerelease architecture on `next`, but Australian provider behavior and some surfaces are not release-ready. v9 adds the launch/distribution layer, but distribution must not outrun truthfulness.

## Work order

### Phase 0 — import and merge tracks

- Import v9 handoff into `conductor/archive/handoffs/2026-05-19-v9-distribution-submission/`.
- Add `anz-platform-release-and-distribution` as umbrella Conductor track.
- Merge progress from existing tracks into the umbrella track and status addendum.

### Phase 1 — release truthfulness first

- Reconcile `main`, `next`, and PR #23.
- Restore build/release consistency.
- Remove placeholder legal data.
- Add capability manifest.
- Route MCP/export through providers.

### Phase 2 — npm and website readiness

- Verify package metadata.
- Keep `nz-legislation-tool` stable.
- Decide when `anz-legislation` alias/sibling package becomes appropriate.
- Update README, docs site, GitHub Pages, `llms.txt`, and install pages.
- Publish only after release gate.

### Phase 3 — MCP registry readiness

- Prepare generic MCP server metadata.
- Add install snippets for stdio and remote/HTTP if supported.
- Prepare registry submissions for Smithery and other MCP directories only after security gate.
- Verify each registry’s current submission process locally before submitting.

### Phase 4 — assistant and coding-agent integrations

- Claude: MCP config, Claude Code docs, skill/prompt pack.
- Codex: `AGENTS.md`, prompt pack, MCP config; treat public plugin/app submission as source-validation-required until verified.
- GitHub Copilot: `.github/copilot-instructions.md`, possible Copilot Extension via GitHub App after current docs are verified.
- Gemini: tool/OpenAPI/function-calling route after current Google docs are verified.
- Qwen: tool schema / Qwen-Agent route after current Qwen docs are verified.

### Phase 5 — IDE/editor integrations

- VS Code extension in same repo under `integrations/vscode/`.
- Publish to VS Code Marketplace after tests and security review.
- Publish to Open VSX after Marketplace readiness.
- JetBrains plugin as P2.

### Phase 6 — maintenance and monitoring

- Registry submission tracker.
- Website analytics/readiness.
- Source drift monitoring.
- Security advisories and provenance.
- Rust migration readiness remains future work.

## Hard constraints

- One repo.
- No public submission before gate.
- No fabricated legal data.
- No Rust rewrite yet.
- No community plugin marketplace without trust model.
