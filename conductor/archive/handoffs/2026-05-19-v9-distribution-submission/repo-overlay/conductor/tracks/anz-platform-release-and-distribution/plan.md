# Plan: ANZ Platform Release and Distribution

## Phase 1 — merge tracks and progress

- Import v9 handoff.
- Add this umbrella track.
- Update `conductor/status.md` to show this as the active umbrella track.
- Preserve existing tracks as subtracks or historical inputs.

## Phase 2 — release reconciliation

- Account for PR #23.
- Reconcile `main` and `next`.
- Restore build consistency.
- Keep legacy package and binary compatibility.

## Phase 3 — provider truthfulness

- Remove placeholder AU provider behavior.
- Add structured unsupported errors.
- Add no-placeholder legal data tests.

## Phase 4 — capability manifest

- Add runtime capability manifest.
- Use it in CLI, MCP, docs, and website.
- Fail tests on manifest/provider mismatch.

## Phase 5 — MCP/export hardening

- Route MCP through providers.
- Route export through providers.
- Add source cards and provenance.

## Phase 6 — npm, website, and docs

- Verify npm metadata.
- Publish prerelease only when gates pass.
- Update website/docs.
- Add install pages and `llms.txt`.

## Phase 7 — MCP registries

- Prepare registry metadata.
- Verify current registry-specific submission requirements.
- Submit after security gate.

## Phase 8 — assistant/coding-agent integrations

- Claude config and skill/prompt artifacts.
- Codex AGENTS/prompt-pack workflow.
- GitHub Copilot instructions and extension plan.
- Gemini/Qwen tool routes after verification.

## Phase 9 — IDE extensions

- VS Code extension scaffold.
- Open VSX publishing path.
- JetBrains as P2.

## Phase 10 — maintenance and migration readiness

- Registry submission tracker.
- Source drift monitoring.
- Security/advisory process.
- Rust migration readiness gates.
