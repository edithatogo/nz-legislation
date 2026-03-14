# Progress Log: Release Governance Modernization

## 2026-03-12

### Implemented baseline governance

- Canonical release topology established around `main`, `next`, `CI`,
  `Release Stable`, and `Release Next`
- Stable and prerelease workflows hardened
- npm trusted publishing enabled for stable publishing
- GitHub Packages mirror configured
- `nz-legislation-tool@1.2.0` published as the stable MCP-enabled package
- GitHub release `v1.2.0` created

### Documented governance

- Added release policy and support policy
- Added maintainer guides and release-captain checklist
- Added release topology ADR
- Added legacy master branch ADR
- Added Australian release readiness note

### Corrected policy drift

- Updated policy to reflect the actual shipped decision that MCP was an
  additive `1.2.0` release, not a major `2.0.0`
- Updated prerelease language so `next` is treated as a governed lane rather
  than automatically the next major line

### Track repair

- Rebuilt this Conductor track folder after discovering the directory existed
  but contained no files
- Re-linked the track to the actual governance outputs that were implemented in
  the active tool repository

### Completed remainder of governance cleanup

- Removed obsolete legacy workflow files from both `main` and `next`
- Added ADR `0003-http-surface-governance`
- Updated dependency review workflow to the supported configuration
- Restored strict branch governance on both `main` and `next` after controlled
  PR-based cleanup merges
- Confirmed both active branches now have the same governed workflow inventory
- Handed Australian prerelease work off to the tool-side
  `australian-expansion-next` track
