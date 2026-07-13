# Plan: MCP Registry Directories

## Phase 1: Contract registration

**Status:** In progress.

- [x] Add MCP registry contracts to `conductor/requirements.md`.
- [x] Add this Conductor track.
- [x] Record local-only registry metadata contracts for Smithery and other MCP
      directories.
- [ ] Verify current Smithery and other MCP directory submission requirements
      before any external submission.

## Phase 2: Registry readiness

**Status:** Pending.

- [x] Test MCP stdio install/config snippets through the local package smoke
      gate.
- [x] Prepare guarded local listing metadata after provider-aware MCP/export
      gates were added.
- [x] Add `pnpm gate:channel-readiness` to enforce local-only registry metadata.
- [x] Add machine-readable blocked readiness status for assistant and MCP
      directory targets; keep external submission disabled.
- [ ] Record security/provenance review before submission.
