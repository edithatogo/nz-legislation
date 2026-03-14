# Plan: Release Governance Modernization

**Track ID:** release-governance-modernization  
**Status:** 🟢 COMPLETE  
**Priority:** 🔴 HIGH  
**Last Updated:** 2026-03-12

---

## Summary

The governance baseline has been implemented. This plan now serves as a
coordination record of what is complete, what was corrected after shipping, and
what remains open.

---

## Phase 1: Canonical Release Topology

### Completed

- [x] Establish `main` as the stable branch
- [x] Establish `next` as the prerelease branch
- [x] Define `CI` as the canonical validation workflow
- [x] Define `Release Stable` as the canonical stable publish workflow
- [x] Define `Release Next` as the canonical prerelease publish workflow
- [x] Demote overlapping legacy workflows to fallback/manual status
- [x] Publish ADR `0001-release-governance-topology`

### Evidence

- `docs/adr/0001-release-governance-topology.md`
- `.github/workflows/ci.yml`
- `.github/workflows/release-stable.yml`
- `.github/workflows/release-next.yml`

---

## Phase 2: Publishing and Registry Governance

### Completed

- [x] Configure npm trusted publishing for stable releases
- [x] Harden stable release workflow with provenance
- [x] Harden prerelease workflow for the `next` lane
- [x] Publish the GitHub Packages mirror
- [x] Publish `nz-legislation-tool@1.2.0`
- [x] Create GitHub release `v1.2.0`

### Evidence

- npm package `nz-legislation-tool@1.2.0`
- GitHub release `v1.2.0`
- `.github/workflows/release-stable.yml`
- `.github/workflows/release-next.yml`
- `.github/workflows/publish-github-packages.yml`

---

## Phase 3: Governance Documents and Contributor Guardrails

### Completed

- [x] Add package release policy
- [x] Add support policy
- [x] Add maintainer checklists and hotfix process
- [x] Add release-aware contributor guidance
- [x] Clarify package registry policy
- [x] Clarify CLI vs MCP positioning

### Corrective Work Completed

- [x] Update release policy to reflect the actual `1.2.0` MCP release decision
- [x] Remove the stale assumption that MCP implied `v2.0.0`
- [x] Align prerelease language so `next` is treated as a governed lane rather
      than automatically the next major

### Evidence

- `RELEASE_POLICY.md`
- `SUPPORT_POLICY.md`
- `docs/maintainers/release-captain-checklist.md`
- `docs/maintainers/release-aware-contributor-quickstart.md`
- `docs/maintainers/hotfix-process.md`
- `docs/maintainers/australian-release-readiness.md`

---

## Phase 4: Branch History and Legacy Preservation

### Completed

- [x] Review the old `master` branch
- [x] Determine it is legacy history, not the active release line
- [x] Preserve it through `archive/legacy-workspace-master`
- [x] Add ADR `0002-archive-legacy-master-branch`

### Evidence

- `docs/adr/0002-archive-legacy-master-branch.md`
- remote branch `archive/legacy-workspace-master`

---

## Phase 5: Product vs Research Boundary

### Completed

- [x] Establish product-owned governance docs
- [x] Separate active tool-side Conductor from research-side Conductor
- [x] Keep research work out of stable package release policy

### Follow-On Work

- [ ] convert child repositories to true submodules once the parent workspace is
      no longer contested

---

## Phase 6: Remaining Cleanup

- [x] remove or fully retire legacy manual-only workflows
- [x] reduce direct admin pushes by tightening branch governance
- [x] decide how future HTTP/OpenAPI governance enters the stable policy
- [x] hand Australian prerelease work off to the tool-side
      `australian-expansion-next` track

---

## Exit Criteria

This track is complete now that:

1. legacy workflow cleanup has been applied on both `main` and `next`
2. both governed branches enforce review, conversation resolution, and admin
   protection again after the controlled cleanup merges
3. forward-looking multi-jurisdiction work is formally handed off to the
   tool-side Australian track without ambiguity
