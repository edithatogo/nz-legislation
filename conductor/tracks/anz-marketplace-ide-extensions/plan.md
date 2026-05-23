# Plan: IDE Extension Marketplaces

## Phase 1: Contract registration

**Status:** In progress.

- [x] Add IDE marketplace contracts to `conductor/requirements.md`.
- [x] Add this Conductor track.
- [x] Define local-only VS Code/Open VSX extension command boundary.
- [ ] Expand extension threat model before packaging or submission.

## Phase 2: Marketplace readiness

**Status:** Pending.

- [x] Add VS Code/Open VSX contract metadata for local-only planning.
- [ ] Verify VS Code Marketplace and Open VSX requirements separately before
      any external submission.
- [x] Add `pnpm gate:channel-readiness` to enforce extension contract metadata.
- [ ] Verify JetBrains plugin requirements if extension scope becomes justified.
