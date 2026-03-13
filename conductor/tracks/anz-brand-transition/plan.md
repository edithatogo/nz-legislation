# Plan: ANZ Brand Transition

**Track ID:** anz-brand-transition  
**Status:** 🟡 PENDING  
**Priority:** 🔴 HIGH  
**Last Updated:** 2026-03-14

---

## Summary

This plan remediates the mismatch between the current NZ-only brand and the
tool's emerging Australia + New Zealand scope. It uses a staged migration so
the repository can move toward `anz-legislation` without breaking the current
package, CLI, documentation, or MCP install base.

---

## Phase 1: Naming Decision and Compatibility Policy

### Goals

- confirm the target public name as `ANZ Legislation`
- confirm the target repository name as `anz-legislation`
- define compatibility windows for package, CLI, and docs migration
- document what remains legacy versus what becomes canonical

### Outputs

- decision record for target names and migration principles
- deprecation policy for old package and binary names
- canonical list of renamed versus preserved public surfaces

### Automated Review Gate

- [ ] Run `node scripts/conductor-phase-review.mjs --track anz-brand-transition --phase 1`
- [ ] Update `index.md`, `plan.md`, and `metadata.json` with the approved naming policy
- [ ] Record any explicit exceptions before Phase 2 starts

---

## Phase 2: Internal Surface Abstraction

### Goals

- remove hard-coded NZ-only assumptions from product copy and metadata
- identify every source-controlled occurrence of repo/package/binary/site naming
- introduce a dual-branding implementation strategy where old and new names can coexist

### Outputs

- inventory of rename-sensitive files and runtime surfaces
- implementation rules for dual-branding and alias support
- updated internal references that should stop assuming NZ-only branding

### Automated Review Gate

- [ ] Run `node scripts/conductor-phase-review.mjs --track anz-brand-transition --phase 2`
- [ ] Update track artifacts with the internal migration inventory
- [ ] Confirm the remaining public rename work is sequenced and reversible

---

## Phase 3: Package and CLI Migration

### Goals

- define whether `anz-legislation` becomes the primary npm package or a meta/shim package first
- preserve the existing installation path of `nz-legislation-tool`
- introduce the future CLI command names without immediately removing `nzlegislation`

### Outputs

- package migration strategy
- CLI alias strategy
- release-note and deprecation messaging for current users

### Constraints

- no breaking CLI rename without a published compatibility window
- no package rename without an explicit install-path migration plan

### Automated Review Gate

- [ ] Run `node scripts/conductor-phase-review.mjs --track anz-brand-transition --phase 3`
- [ ] Update track artifacts with the chosen package and CLI migration strategy
- [ ] Verify the plan still preserves a working path for existing users

---

## Phase 4: Repository, Documentation, and Site Migration

### Goals

- rename the GitHub repository to `anz-legislation`
- update GitHub Pages paths, documentation links, badges, and edit URLs
- update MCP metadata, release docs, and maintainer guides to the new repo identity

### Outputs

- repo rename checklist
- docs/site migration checklist
- MCP metadata and support-link migration checklist

### Constraints

- GitHub Pages path changes must be coordinated with documentation deployment
- repository rename must account for branch protection, Actions links, and badges

### Automated Review Gate

- [ ] Run `node scripts/conductor-phase-review.mjs --track anz-brand-transition --phase 4`
- [ ] Update track artifacts with the repository and docs migration outcome
- [ ] Confirm no critical public links remain on the old repo path without redirects

---

## Phase 5: Deprecation and Legacy Cleanup

### Goals

- define the end of the compatibility window
- remove or retire legacy names only after published notice and working replacement paths
- ensure support and troubleshooting docs point to the new canonical identity

### Outputs

- deprecation completion checklist
- final cleanup list for old names in code, docs, workflows, and support materials
- closure criteria for the transition track

### Automated Review Gate

- [ ] Run `node scripts/conductor-phase-review.mjs --track anz-brand-transition --phase 5`
- [ ] Update track artifacts with final deprecation decisions
- [ ] Confirm whether the track can be marked complete or needs a follow-on cleanup track

---

## Immediate Recommendation

Proceed with `ANZ Legislation` and `anz-legislation` as the target public names,
but do not rename the npm package or CLI binaries in the same step as the repo
rename. The least risky order is:

1. agree naming policy
2. prepare dual-branding internally
3. introduce compatibility paths
4. rename repo and docs surfaces
5. deprecate old package and binary names later

---

## Exit Criteria

This track is complete when:

1. the repository identity is migrated to `anz-legislation`
2. the product identity is publicly presented as `ANZ Legislation`
3. package, CLI, MCP, and docs naming all have a documented canonical state
4. a compatibility window is executed rather than implied
5. each phase has been closed with the scripted Conductor review gate
