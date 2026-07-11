# Plan: Container and Homebrew Distribution

## Phase 1: Contract registration

**Status:** In progress.

- [x] Add container/Homebrew contracts to `conductor/requirements.md`.
- [x] Add this Conductor track.
- [x] Define local-only image and formula contract boundaries.
- [x] Expand image and formula threat model before publication.

## Phase 2: Distribution readiness

**Status:** Pending.

- [x] Define Docker/GHCR artifact expectations.
- [x] Define Homebrew formula expectations.
- [x] Add `pnpm gate:channel-readiness` to enforce local-only contract metadata.
- [x] Add snippet verification before any publication.
