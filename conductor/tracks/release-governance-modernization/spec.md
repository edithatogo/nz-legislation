# Specification: Release Governance Modernization

## Problem

The project had overlapping workflows, unclear release ownership, ambiguous
branch semantics, and no durable operating model for the package's multiple
public surfaces.

It also needed to separate:

- stable package release governance
- prerelease experimentation
- product-owned documentation and package policy
- research-owned work that should not drive product releases

## Scope

This track governs the package and release system for `nz-legislation-tool`.

In scope:

- branch and workflow topology
- stable and prerelease publication rules
- SemVer decision policy for CLI, MCP, and future HTTP/OpenAPI surfaces
- GitHub Packages visibility
- maintainer guides and architecture decision records
- product vs research boundary guardrails

Out of scope:

- implementing Australian jurisdiction support itself
- implementing the future HTTP adapter itself
- research methodology or publication work

## Required Outcomes

1. A canonical release topology exists and is documented.
2. Stable publishing works via trusted publishing and provenance.
3. Prerelease publishing is governed separately from stable.
4. The package version is the canonical product version.
5. MCP is treated as a governed public contract.
6. Product governance is separated from research governance.
7. The release policy matches actual shipped decisions.

## Acceptance Criteria

- `main` is the stable branch and `next` is the prerelease branch.
- `CI`, `Release Stable`, and `Release Next` are the canonical workflows.
- `nz-legislation-tool@1.2.0` is published as the stable MCP-enabled release.
- A GitHub release exists for `v1.2.0`.
- Stable publishing uses trusted publishing rather than ad hoc token-only logic.
- Governance docs exist for maintainers and contributors.
- The release policy states that MCP shipped as additive `1.2.0`.
- The archived `master` line is preserved for history and not treated as the
  live release branch.

## Evidence Sources

Primary evidence lives in the active tool repository and published package:

- `RELEASE_POLICY.md`
- `SUPPORT_POLICY.md`
- `docs/adr/0001-release-governance-topology.md`
- `docs/adr/0002-archive-legacy-master-branch.md`
- `docs/maintainers/release-captain-checklist.md`
- `docs/maintainers/release-aware-contributor-quickstart.md`
- `docs/maintainers/hotfix-process.md`
- `docs/maintainers/australian-release-readiness.md`
- `.github/workflows/ci.yml`
- `.github/workflows/release-stable.yml`
- `.github/workflows/release-next.yml`

## Follow-On Tracks

This track hands off implementation work for Australian prerelease scope to:

- `nz-legislation-tool/conductor/tracks/australian-expansion-next`
