# Plan: ANZ Platform Release and Distribution

## Phase 0: Import v9 handoff

**Status:** Complete for local import.

- [x] Move the v9 ZIP into
      `conductor/archive/handoffs/2026-05-19-v9-distribution-submission/`.
- [x] Extract the ZIP in the archive folder.
- [x] Retain `COVERING_PROMPT.md`, `HANDOFF.md`, and `README.md` in the archive
      folder.
- [x] Copy `repo-overlay/` into the repository root.
- [x] Preserve one repository and avoid external publishing, deployment,
      renaming, or submission.

## Phase 1: Merge tracks and progress

**Status:** Complete for local reconciliation; external release work remains gated.

- [x] Promote this track as the umbrella Conductor release/distribution track.
- [x] Fold v9 roadmap, submission pathways, security gates, integration folders,
      and channel coverage into the umbrella plan.
- [x] Record compatibility naming for `nz-legislation-tool`, `nzlegislation`,
      `nzlegislation-mcp`, `anzlegislation`, and `anzlegislation-mcp`.
- [x] Capture the provider registry foundation and Commonwealth adapter slices
      in the umbrella progress docs.
- [x] Add a channel matrix and release/submission gate checklist.
- [x] Add `conductor/requirements.md` as the MoSCoW requirements and contract
      register for provider, publication, registry, integration, and migration
      tracks.
- [x] Add dedicated Conductor tracks for present NZ compatibility, aggregator
      evaluation, OpenAPI readiness, package registries, website/docs, MCP
      registries, assistant integrations, IDE marketplaces, Docker/GHCR,
      Homebrew, and Rust readiness.
- [x] Reconcile stale Commonwealth, website/docs, registry, IDE, Docker/GHCR,
      and Homebrew status claims against the current repository state.
- [x] Reconcile stale Conductor status claims against the current repository
      remote, GitHub releases/packages, npm registry, and branch state before
      future public release work (`pending-commit`).

Evidence: `docs/maintainers/release-reconciliation-2026-07-12.md`.

## Phase 2: Release reconciliation

**Status:** Blocked until branch and registry state are verified.

- Account for existing release-governance decisions and any pending PR work.
- Reconcile `main`, `next`, and any governed prerelease lane.
- Confirm package metadata for stable NZ support and Australian prerelease
  language.
- Keep legacy package and binary compatibility.
- [x] Add an executable release notes gate that distinguishes NZ stable from
      Australian prerelease support.

## Phase 3: Provider truthfulness

**Status:** In progress for Commonwealth prerelease runtime; blocked for stable
Australian release claims and remaining jurisdictions.

- Use `provider-api-roadmap.md` as the concrete source-validation backlog for
  legal-data providers and APIs.
- Remove or quarantine placeholder Australian legal-data behavior.
- Add structured unsupported capability errors for incomplete provider features.
- [x] Add no-placeholder legal-data tests for Commonwealth runtime fixtures.
- Confirm Australian support is described only as prerelease until the gate
  passes.
- Prioritize Australian Commonwealth and Queensland provider replacement before
  adding NSW, Victoria, South Australia, Western Australia, Tasmania, ACT,
  Northern Territory, aggregator, or future HTTP/OpenAPI adapter claims.

## Phase 4: Capability manifest

**Status:** In progress.

- [x] Implement a provider capability manifest.
- [x] Use the manifest in CLI, MCP, export metadata, docs, and website surfaces.
- [x] Add tests that fail on manifest/provider mismatch.
- Require every listing or install page to match manifest-backed claims.
- Run pnpm gate:conductor-requirements when requirements or track coverage
  changes.

## Phase 5: MCP and export hardening

**Status:** In progress. Runtime gates now block unsupported providers through
the provider registry; Commonwealth prerelease runtime and provenance are wired
for search, get-work, versions, export, and MCP while install-snippet
verification remains.

- [x] Route MCP tools through provider-aware capability checks.
- [x] Route export paths through provider-aware capability checks.
- [x] Add provider/source cards and provenance metadata.
- [ ] Use `docs/maintainers/provenance-wiring-test-plan.md` as the future
      provenance test checklist before emitting source cards in export or MCP
      outputs.
- [x] Add runtime provider gates under `src/providers/runtime.ts` and companion
      tests while keeping Commonwealth runtime support prerelease and other
      incomplete features blocked.
- [x] Verify stdio install/config snippets against the packaged command.

## Phase 6: npm, GitHub Packages, website, and docs

**Status:** Preparation only.

- [x] Verify npm package metadata and package entry points through the package
      metadata gate.
- [x] Verify GitHub Packages publishing workflow and provenance through the
      security/provenance gate.
- [x] Update website/docs install pages, capability matrix, and `llms.txt`.
- [x] Add a website/docs gate to keep public docs aligned with runtime claims.
- [x] Test install snippets locally from a built package tarball before
      publishing or deploying.
- Do not publish or deploy until all gates pass.

## Phase 7: MCP registries

**Status:** Preparation only.

- [x] Prepare local-only registry metadata for Smithery and other MCP
      directories.
- [x] Add a channel readiness gate for MCP registry metadata.
- Verify current submission requirements before relying on any registry process.
- Confirm provider-aware MCP behavior and no-placeholder legal data before
  submission.
- Do not submit until security/provenance and listing-truthfulness gates pass.

## Phase 8: Assistant and coding-agent integrations

**Status:** Preparation only.

- Maintain Claude integration guidance under `integrations/claude/`.
- Maintain Codex local import and AGENTS guidance under `integrations/codex/`
  and repository AGENTS surfaces.
- Maintain GitHub Copilot instruction and extension planning surfaces under
  `integrations/github-copilot/`.
- Maintain Gemini and Qwen pathways as source-validation-required until current
  provider submission routes are verified.

## Phase 9: IDE extensions

**Status:** Preparation only.

- [x] Keep VS Code extension planning and local-only contract metadata under
      `integrations/vscode/`.
- [x] Add a channel readiness gate for IDE extension contract metadata.
- Track Open VSX as a separate publication path from VS Code Marketplace.
- Keep JetBrains as P2 readiness until the runtime contract and security review
  justify extension work.

## Phase 10: Docker/GHCR, Homebrew, and maintenance

**Status:** Preparation only.

- [x] Define local-only Docker/GHCR artifact expectations before any image is
      built or pushed.
- [x] Define local-only Homebrew formula expectations before any tap or formula
      is published.
- [x] Add a channel readiness gate for container and Homebrew contracts.
- Maintain a registry/listing tracker with review dates and renewal dates.
- Monitor upstream source drift and legal-data provider status.
- [x] Keep all release automation guarded by provenance, docs, install, and
      release note checks.

## Phase 11: Long-term Rust migration readiness

**Status:** Future readiness only.

- Record runtime contracts that a future Rust implementation would need to
  preserve.
- Keep tests and compatibility expectations language-neutral where practical.
- Do not start a rewrite or create a Rust repository in this track.
