# Implementation Plan: Release Governance Modernization

## Phase 1: Baseline and Decision Lock

- [ ] Task: Audit current release, publish, and CI workflows in `nz-legislation-tool/.github/workflows`
    - [ ] Identify which workflows currently publish, tag, create releases, or duplicate those responsibilities
    - [ ] Identify branch trigger mismatches between `main`, `master`, and local working practice
    - [ ] Identify current branch protection assumptions versus actual workflow names
- [ ] Task: Define the authoritative release model
    - [ ] Decide whether `main` becomes the only stable branch
    - [ ] Decide whether `next` is used as the only prerelease branch for v3 incubation
    - [ ] Decide whether tag-push releases are retained only as outputs, not operator inputs
- [ ] Task: Lock the stable baseline
    - [ ] Decide whether the current MCP-enabled product line is `2.0.0`
    - [ ] If yes, define that stable baseline before opening `3.0.0-next.x`
    - [ ] Reflect the decision in release framing, changelog expectations, and branch ancestry
- [ ] Task: Write release classification policy
    - [ ] Define major/minor/patch rules for CLI, MCP, provider interfaces, config, and exports
    - [ ] Add explicit examples including MCP-driven `2.0.0` and provider-platform `3.0.0-next.x`
- [ ] Task: Define canonical compatibility boundaries
    - [ ] Make the npm package version the canonical version authority
    - [ ] Define CLI and MCP as public contracts governed by that version
    - [ ] Define what remains internal and release-neutral
- [ ] Task: Create an initial compatibility matrix
    - [ ] Capture stable guarantees for CLI commands, flags, and outputs
    - [ ] Capture stable guarantees for MCP tools, schemas, and configuration
    - [ ] Capture provisional guarantees for provider and plugin interfaces
- [ ] Task: Design executable contract enforcement
    - [ ] Define CLI contract tests for commands, flags, help output, and representative outputs
    - [ ] Define MCP contract tests for handshake, tool list, schemas, and packaged smoke tests
    - [ ] Define how intentional breaking changes are approved in CI and release review
- [ ] Task: Audit external operating surfaces
    - [ ] Review README and top-level docs for CLI versus MCP clarity
    - [ ] Identify current use or planned use of Notion, Figma, and Linear for release operations
    - [ ] Capture the current repository topology and the need for future CLI and MCP repository separation
    - [ ] Evaluate the custom-GPT feedback suggesting stable endpoints such as `/search?q=`, `/act/{name}`, `/section/{act}/{section}`, `/section/{act}/{section}/context`, `/definitions/{act}`, `/definition/{act}/{term}`, `/toc/{act}`, `/cite/{act}/{section}`, `/status/{act}`, and `/related/{act}`
- [ ] Task: Audit product versus research boundary
    - [ ] Identify where `conductor/product.md`, `conductor/tracks.md`, and repo-level docs currently mix tool and research concerns
    - [ ] Identify which directories and workflows are product-owned versus research-owned
    - [ ] Document current boundary risks and separation gaps
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Baseline and Decision Lock' (Protocol in workflow.md)

## Phase 2: Stable Release Path Consolidation

- [ ] Task: Consolidate stable release automation around Changesets
    - [ ] Remove or retire overlapping publish workflows that can race stable releases
    - [ ] Ensure only one workflow can publish stable npm releases
    - [ ] Ensure the stable workflow creates tags and GitHub releases consistently
- [ ] Task: Reduce workflow surface area
    - [ ] Converge on one canonical CI workflow
    - [ ] Converge on one canonical stable release workflow
    - [ ] Separate docs and security concerns into clear non-publishing workflows
- [ ] Task: Normalize branch targeting
    - [ ] Update workflow triggers to the selected stable branch
    - [ ] Update Changesets base branch to the selected stable branch if needed
    - [ ] Update release documentation to match the actual branch model
- [ ] Task: Add stable release verification
    - [ ] Require lint, typecheck, tests, and build before stable publish
    - [ ] Validate release notes and package metadata generation
- [ ] Task: Add release environment governance
    - [ ] Define GitHub environments for stable and prerelease channels
    - [ ] Scope tokens and secrets appropriately
    - [ ] Define rerun safety, provenance, and rollback expectations
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Stable Release Path Consolidation' (Protocol in workflow.md)

## Phase 3: v3 Prerelease Lane

- [ ] Task: Design prerelease workflow for upcoming provider-platform work
    - [ ] Configure prerelease Changesets flow for `3.0.0-next.x`
    - [ ] Publish prereleases to npm `next` dist-tag
    - [ ] Mark GitHub prereleases clearly as non-stable
- [ ] Task: Define release channel semantics
    - [ ] Map `main` to stable and `next` to prerelease explicitly
    - [ ] Define `latest` and `next` npm dist-tag behavior
    - [ ] Define how tags and changelogs reflect the release channel
- [ ] Task: Define branch policy for prerelease development
    - [ ] Document when work belongs on `next` versus feature branches off `main`
    - [ ] Define merge and backport rules between `next` and `main`
    - [ ] Define exit criteria for promoting `next` to stable `3.0.0`
- [ ] Task: Dry run prerelease flow
    - [ ] Validate version numbering
    - [ ] Validate changelog output
    - [ ] Validate dist-tag separation from stable
- [ ] Task: Define distribution boundary for v3 incubation
    - [ ] Decide whether v3 incubation remains in the current repository or needs a separate public-facing MCP or CLI repo later
    - [ ] Define shared-core expectations if repository separation becomes necessary
- [ ] Task: Conductor - User Manual Verification 'Phase 3: v3 Prerelease Lane' (Protocol in workflow.md)

## Phase 4: Collaboration and Workspace Hardening

- [ ] Task: Tighten repository governance for collaboration
    - [ ] Update branch protection to require the exact canonical CI workflows
    - [ ] Make branch protection strict where appropriate
    - [ ] Align CODEOWNERS with critical release, workflow, and provider files
    - [ ] Add path-based ownership rules that distinguish `nz-legislation-tool` product work from research-programme work
- [ ] Task: Improve pull request governance
    - [ ] Update PR template to require release intent and breaking-change declaration
    - [ ] Require changesets for user-facing changes
    - [ ] Add labels or automation for `major`, `minor`, `patch`, `release-neutral`, and `prerelease`
- [ ] Task: Document maintainer operations
    - [ ] Add hotfix process for urgent stable fixes
    - [ ] Add release captain checklist
    - [ ] Add contributor quickstart for release-aware development
- [ ] Task: Add governance documents
    - [ ] Create `RELEASE_POLICY.md`
    - [ ] Create `SUPPORT_POLICY.md`
    - [ ] Add ADRs or equivalent for release topology decisions
- [ ] Task: Define Notion, Figma, and Linear integration
    - [ ] Create a Linear model for release epics, milestones, and prerelease trains
    - [ ] Define the Notion release hub structure for roadmap, runbooks, and launch checklists
    - [ ] Define the Figma responsibilities for homepage messaging, diagrams, and launch assets
    - [ ] Document repository-to-workspace linking conventions across all three systems
- [ ] Task: Define source-of-truth rules
    - [ ] Make Linear the owner of execution state
    - [ ] Make Notion the owner of durable release documentation
    - [ ] Make Figma the owner of design assets only
    - [ ] Define anti-duplication rules for status and release state
- [ ] Task: Define product-versus-research operating guardrails
    - [ ] Decide whether product and research should have separate Linear projects
    - [ ] Decide whether product and research should have separate Notion hubs or databases
    - [ ] Decide whether Conductor should keep one registry or split product and research registries
    - [ ] Define how shared findings flow from research into product without collapsing the boundary
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Collaboration and Workspace Hardening' (Protocol in workflow.md)

## Phase 5: Homepage, Packaging, and Repository Strategy

- [ ] Task: Redesign top-of-funnel documentation
    - [ ] Rewrite README opening section to present CLI and MCP as separate entry points
    - [ ] Add dedicated quick-start blocks for CLI and MCP
    - [ ] Ensure package names, executable names, and install commands are unambiguous
- [ ] Task: Define homepage information architecture
    - [ ] Decide the first-screen layout for CLI versus MCP users
    - [ ] Define one concrete CLI journey and one concrete MCP journey for the homepage
    - [ ] Define how the future provider-platform direction is messaged without confusing current users
- [ ] Task: Define packaging and repository roadmap
    - [ ] Compare one repository and one package versus one repository and multiple packages
    - [ ] Evaluate one-repo versus split-repo release models for CLI and MCP
    - [ ] Treat one repository and multiple packages as the preferred intermediate option if clearer surface ownership is needed
    - [ ] Evaluate candidate package topology such as `@nz-legislation/core`, `@nz-legislation/cli`, and `@nz-legislation/mcp`
    - [ ] Define package naming, shared-core boundaries, and issue-routing ownership
    - [ ] Define migration triggers for splitting into dedicated repositories
    - [ ] Define how changelogs, issues, and releases are coordinated if a split occurs
- [ ] Task: Define product and research boundary architecture
    - [ ] Decide the target directory and documentation boundary for `nz-legislation-tool`
    - [ ] Decide the target directory and planning boundary for health research work
    - [ ] Add workflow guardrails so research-only changes do not trigger product release logic
    - [ ] Add documentation guardrails so product homepages and package docs are not rewritten into research artefacts
- [ ] Task: Evaluate analysis-friendly access layer
    - [ ] Decide whether GPT-oriented stable endpoints belong in v3 scope
    - [ ] Define whether the access layer should be a package, service, or docs-only integration pattern
    - [ ] If adopted, define compatibility ownership for routes such as `/search?q=`, `/semantic-search?q=`, `/act/{name}`, `/toc/{act}`, `/section/{act}/{section}`, `/section/{act}/{section}/context`, `/sections?act=&from=&to=`, `/definitions/{act}`, `/definition/{act}/{term}`, `/related/{act}`, `/cite/{act}/{section}`, `/status/{act}`, and `/info`
    - [ ] Prioritize foundation endpoints before domain-specific extraction endpoints
    - [ ] Require structured JSON payloads and `source_url` support in the recommended design
    - [ ] Evaluate optional legal-signal endpoints such as `/duties/{act}`, `/powers/{act}`, `/offences/{act}`, and `/recommendation-context?q=` as advanced scope
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Homepage, Packaging, and Repository Strategy' (Protocol in workflow.md)

## Phase 6: Rollout and Migration

- [ ] Task: Plan migration from current state to target state
    - [ ] Sequence `master` to `main` normalization if required
    - [ ] Protect current users from accidental package disruption during migration
    - [ ] Incorporate public communication inputs such as launch announcements and release posts
    - [ ] Migrate product and research guardrails into the final operating model
- [ ] Task: Execute and validate rollout
    - [ ] Run one stable release dry run
    - [ ] Run one prerelease dry run
    - [ ] Confirm documentation, workflows, branch protection, and workspace integrations all match
    - [ ] Confirm product and research boundaries are visible and enforceable
- [ ] Task: Create final release roadmap summary
    - [ ] Capture immediate next action for `2.0.0`
    - [ ] Capture `3.0.0-next` incubation plan
    - [ ] Capture follow-on work for collaboration, homepage clarity, and repository separation
    - [ ] Capture the final product-versus-research operating model and guardrails
- [ ] Task: Conductor - User Manual Verification 'Phase 6: Rollout and Migration' (Protocol in workflow.md)
