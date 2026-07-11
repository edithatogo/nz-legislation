# Plan: NZ Provider Stable Compatibility

## Phase 1: Contract registration

**Status:** Complete for local compatibility gates.

- [x] Add NZ stable compatibility to `conductor/requirements.md`.
- [x] Add this Conductor track as the present stable provider track.
- [x] Add automated manifest/docs drift checks for stable NZ support claims.

## Phase 2: Compatibility verification

**Status:** Pending.

- [x] Verify stable command names and package binaries before the next release. (Verified 2026-06-14: `nzlegislation`→`dist/cli.js`, `nzlegislation-mcp`→`dist/mcp-cli.js`, aliases correct)
- [x] Verify MCP stdio snippets continue using supported command names.
      Verified 2026-06-14: `integrations/mcp/example-configs.md` uses
      `npx -y --package nz-legislation-tool nzlegislation-mcp`, and
      `pnpm gate:provider-aware-mcp-export` passed outside the sandbox after a
      sandboxed `esbuild` spawn `EPERM`.
- [x] Verify release notes distinguish NZ stable support from Australian
      prerelease support. Verified 2026-06-14:
      `docs/maintainers/release-notes-anz-readiness-draft.md` keeps New Zealand
      stable and Australian support prerelease/planned; `pnpm gate:release-notes`
      passed outside the sandbox after a sandboxed `esbuild` spawn `EPERM`.

## Validation evidence

- `gate:nz-stable-compatibility`: passed.
- Existing provider capability, MCP/export, release-notes, and install checks remain required before publication.
