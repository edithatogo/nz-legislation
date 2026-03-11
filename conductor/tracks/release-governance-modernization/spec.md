# Release Governance Modernization

## Overview

The NZ Legislation Tool has reached the point where release management is now part of the product surface, not just repository hygiene. The project has stable CLI capabilities, a newly published MCP server entry point, Australian expansion work in progress, and multiple partially overlapping automation paths for CI/CD and publishing.

The current state creates avoidable release risk:

- `main` is documented as the protected release branch, while active local work has been happening on `master`
- multiple GitHub Actions workflows can perform overlapping release or publish responsibilities
- Changesets is configured, but major feature work can land without a matching release intent
- there is no defined prerelease lane for the upcoming architecture expansion around additional APIs and provider plugins
- collaboration rules exist, but they are not yet tuned for a multi-contributor, multi-release workflow

This track defines a state-of-the-art release and collaboration model that treats versioning, branching, changelogs, tags, prereleases, contributor workflow, distribution boundaries, and operating-system integrations as one coherent operating system.

## Product Goals

1. Establish one authoritative stable release path for production npm and GitHub releases.
2. Define an explicit SemVer policy so major architectural shifts like the MCP-first platform direction are versioned intentionally.
3. Support a controlled prerelease lane for upcoming v3 work without destabilizing the stable line.
4. Reduce manual release work to release intent, approvals, and verification rather than bespoke commands.
5. Make collaboration safer by tightening branch protection, review ownership, required checks, and release documentation.
6. Clarify the product entry points so users immediately understand when to use the CLI versus the MCP server.
7. Prepare the project for a future split into dedicated CLI and MCP repositories without forcing an immediate migration.
8. Define the exact public compatibility boundaries so versioning decisions are based on written contracts rather than intuition.
9. Create an analysis-friendly integration surface so GPT-style consumers can reliably reference legislation with stable URLs or endpoints.

## Functional Requirements

### FR1: Single Stable Release Authority

The repository must have exactly one authoritative stable release workflow.

- stable releases must originate from one protected default branch
- npm publishing, tag creation, GitHub release generation, and changelog updates must be driven by one consistent automation path
- duplicate or conflicting release workflows must be removed, consolidated, or clearly demoted to non-release roles

### FR2: Explicit SemVer Release Policy

The project must define release classification rules that contributors can apply consistently.

- breaking architectural changes must require a major release classification
- backward-compatible feature additions must require a minor release classification
- fixes and internal corrections with no public surface break must require a patch release classification
- the policy must explicitly address the MCP server surface, CLI surface, plugin/provider interfaces, configuration format, output schemas, and API contracts

### FR2.1: Canonical Compatibility Boundary

The project must define one canonical version authority and the public contracts governed by that version.

- the npm package version must be the canonical version number
- the CLI contract and MCP contract must be treated as public surfaces under that version
- a breaking change to either CLI or MCP behavior must be eligible to trigger a major release
- internal implementation refactors must not trigger version changes unless they alter a public contract

### FR2.2: Compatibility Matrix

The project must maintain a compatibility matrix for each supported release line.

- the matrix must explicitly cover CLI commands, flags, install semantics, and output guarantees
- the matrix must explicitly cover MCP tool names, schemas, transport expectations, and configuration semantics
- the matrix must explicitly cover provider and plugin interfaces
- the matrix must distinguish stable guarantees from prerelease guarantees

### FR2.3: Contract Enforcement

Compatibility documentation alone is insufficient. The project must enforce public contracts in CI.

- the CLI surface must have contract tests for command names, critical flags, help output, and representative stable outputs
- the MCP surface must have contract tests for handshake behavior, tool names, tool schemas, and packaged-artifact smoke tests
- release workflows must fail if contract tests detect an unapproved breaking change
- the release policy must define how intentional breaking changes are acknowledged and approved

### FR3: Stable Branch Strategy

The branch model must be simplified and documented.

- one protected branch must be designated as the stable integration and release branch
- the current `main` versus `master` ambiguity must be resolved
- feature branches must be short-lived and merge into the stable branch through pull requests
- release tags must be created automatically from the stable release flow, not manually as the primary mechanism

### FR3.1: Stable Baseline Decision

The project must explicitly define the stable baseline before opening the next-major prerelease lane.

- the project must decide whether the current MCP-enabled line is designated `2.0.0`
- if `2.0.0` is adopted, that decision must be reflected in release policy, changelog framing, and the prerelease ancestry for `3.0.0-next.x`
- the stable baseline decision must be made before or during stable release-path consolidation, not deferred to final rollout

### FR4: Prerelease Strategy For v3

The project must support a clean incubation path for upcoming v3 work involving additional APIs and a broader provider architecture.

- prerelease work must not require a permanent fork of the stable release process
- the design must support a `next`-style prerelease branch or equivalent controlled mechanism
- prerelease builds must publish to a non-stable npm dist-tag such as `next`
- prerelease GitHub releases must be clearly marked as prerelease
- the process must support repeated `3.0.0-next.x` or equivalent versions until stable readiness

### FR4.1: Release Channel Semantics

Branch names alone are insufficient. The project must define release channels with explicit behavior.

- `main` must map to the stable release channel
- `next` must map to the prerelease channel for the next major line
- npm `latest` must represent stable releases
- npm `next` must represent prerelease releases
- tags, changelogs, and GitHub releases must reflect the channel semantics

### FR5: Release Intent Capture In Pull Requests

Contributor workflow must force explicit release intent before merge.

- every user-facing change must include a Changeset or an approved equivalent release note artifact
- pull requests must indicate whether the change is major, minor, patch, or release-neutral
- release intent must be visible during review
- merge should be blocked when a required release artifact is missing

### FR6: Collaboration Guardrails

The repository must be optimized for multi-contributor collaboration.

- protected branch rules must require the correct CI checks by exact workflow name
- CODEOWNERS and review rules must be aligned with the actual source tree and critical release files
- pull request templates must reflect the release model, including prerelease and breaking-change declarations
- maintainers must have a documented hotfix process
- release operations and branching rules must be understandable to a new contributor within one reading

### FR6.1: Governance Documents

The release model must be supported by durable governance documents.

- `RELEASE_POLICY.md` must define channels, classification, tagging, and ownership
- `SUPPORT_POLICY.md` must define which release lines are supported and for how long
- architecture decisions affecting release topology must be captured in ADRs or an equivalent decision log
- maintainer operations for hotfix, rollback, and prerelease promotion must be documented

### FR6.2: Release Environment Governance

Release safety must include environment and secret boundaries, not only branch and workflow rules.

- stable and prerelease publishing must use explicit GitHub environments
- secret usage must be scoped so stable and prerelease channels cannot accidentally reuse the wrong credentials or settings
- release workflows must be idempotent or clearly protected against unsafe reruns
- rollback and failed-release procedures must be documented and tested

### FR7: Operational Roadmap

The project must include a practical implementation roadmap.

- the roadmap must sequence branch normalization first
- stable release automation must be implemented before prerelease expansion
- collaboration and governance hardening must follow immediately after release-path consolidation
- rollout must include at least one dry run for stable release and one dry run for prerelease release

### FR8: Workspace Integration Model

The release operating model must define how work is coordinated across Notion, Figma, and Linear.

- Linear must be the execution system for release work, milestones, and issue tracking
- Notion must be the documentation and release-operations knowledge hub
- Figma must be the design source for homepage, launch assets, and onboarding clarity where a visual surface is involved
- the release workflow must specify which artifacts live in which system and how they link back to the repository

### FR8.1: Source Of Truth Rules

The operating model must avoid duplicated status ownership across tools.

- Linear must be the source of truth for execution status, milestones, and current release trains
- Notion must be the source of truth for durable release docs, runbooks, policies, and roadmap narrative
- Figma must be the source of truth for design assets and user-facing messaging artifacts only
- the project must avoid duplicating release state across all three systems

### FR9: Homepage and Onboarding Clarity

The project homepage and core docs must make the product surfaces obvious to a first-time visitor.

- the README or homepage must clearly present two primary entry points: CLI and MCP
- installation and quick-start guidance must be separate for CLI users and MCP users
- examples must show one concrete CLI workflow and one concrete MCP configuration workflow near the top of the page
- documentation must reduce ambiguity around package names, executable names, and intended audience

### FR10: Repository Topology Strategy

The project must define a roadmap for whether and how the tool is released into dedicated MCP and CLI repositories.

- the design must evaluate the tradeoffs between one source repository with multiple release artifacts versus separate public repositories
- if separate repositories are chosen, the plan must define ownership of shared code, release synchronization, changelog strategy, and issue routing
- if separate repositories are deferred, the plan must define how the current repository still presents distinct CLI and MCP identities to users
- the strategy must include migration criteria rather than forcing an immediate split without operational readiness

### FR10.1: Packaging Strategy Evaluation

The track must evaluate packaging before repository splitting.

- the design must compare one repository and one package, one repository with multiple packages, and separate repositories
- one repository with multiple packages must be treated as a first-class option rather than skipped
- the chosen recommendation must consider discoverability, contributor overhead, shared-core reuse, issue routing, and release synchronization

### FR10.2: Candidate Package Topology

If a multi-package model is pursued, the track must define candidate package boundaries before repository splitting is considered.

- the project must evaluate a shared-core package such as `@nz-legislation/core`
- the project must evaluate distinct distribution packages such as `@nz-legislation/cli` and `@nz-legislation/mcp`
- the track must define which package owns docs, changelogs, and issue-routing responsibilities
- package naming and ownership rules must be documented before repo-split decisions are made

### FR10.3: Product and Research Separation Guardrails

The project must explicitly separate the productized legislation tool from the health research programme.

- tool release policy, versioning, packaging, and automation must be governed independently from research publication planning
- research outputs must not implicitly change tool release semantics or stable-channel behavior
- the repository must define path, ownership, and workflow guardrails so product and research work do not drift into the same operating lane
- any shared assets between product and research must be intentional, documented, and owned
- the project must evaluate whether Conductor context, track registries, and external workspace mapping should be split between product and research domains

### FR11: Analysis-Friendly Access Layer

The project should evaluate a lightweight HTTP or web-access surface specifically for GPT and analysis workflows.

- the design must consider stable, linkable endpoints such as `/search?q=`, `/act/{name}`, `/section/{act}/{section}`, and `/definitions/{act}`
- the endpoints must be optimized for reliable retrieval and citation in downstream analysis tools and custom GPTs
- the access layer must align with the compatibility matrix and release policy if it becomes a supported public surface
- the track must determine whether this access layer belongs in v3 scope, a separate package, or a separate service
- the access layer must be treated as a compatibility adapter over the existing legislation engine rather than a rewrite of the core retrieval and parsing system

### FR11.1: Core Navigation Endpoints

If the analysis-friendly access layer is adopted, it must first support reliable statutory navigation.

- the design must evaluate or implement `/search?q=`
- the design must evaluate or implement `/semantic-search?q=`
- the design must evaluate or implement `/act/{name}`
- the design must evaluate or implement `/toc/{act}`
- the design must evaluate or implement `/section/{act}/{section}`
- the design must evaluate or implement `/section/{act}/{section}/context`
- the design must evaluate or implement `/sections?act=&from=&to=`

The `section/context` model should support surrounding interpretive material such as:

- preceding section
- following section
- headings
- subclauses

### FR11.2: Interpretation and Citation Endpoints

The access layer should support legal interpretation, currency checks, and clean citation.

- the design must evaluate or implement `/definitions/{act}`
- the design must evaluate or implement `/definition/{act}/{term}`
- the design must evaluate or implement `/cite/{act}/{section}`
- the design must evaluate or implement `/status/{act}`
- the design must evaluate or implement `/related/{act}`
- responses should include `source_url` pointing to the official legislation source when available

### FR11.3: Structured JSON Responses

The access layer should return stable, analysis-friendly structured data.

- endpoints should return clean JSON rather than raw HTML where possible
- section payloads should expose heading, text, subsections, and metadata explicitly
- responses should be shaped for downstream reasoning and citation rather than presentation-only rendering
- stable response schemas must enter the compatibility matrix if the access layer becomes a supported public surface

### FR11.4: Investigation-Oriented Legal Signals

The access layer should evaluate higher-order legal signal extraction for investigation and recommendation workflows.

- the design must evaluate or implement `/duties/{act}`
- the design must evaluate or implement `/powers/{act}`
- the design must evaluate or implement `/offences/{act}`
- the design must evaluate whether a recommendation-oriented endpoint such as `/recommendation-context?q=` should exist
- the track must determine whether these endpoints are first-class public API features or a later domain-specific extension

### FR11.5: Operational and Discovery Endpoints

The access layer should support safe usage and operational introspection.

- the design must evaluate or implement `/info`
- the design must evaluate caching patterns for heavy retrieval paths
- if cache-aware endpoints are introduced, they must be treated as operational interfaces rather than arbitrary internal leaks
- the project must define rate-limit and caching strategy so GPT-style clients can use the surface safely

### FR11.6: REST Adapter Architecture

If the analysis-friendly access layer is implemented, it should use a minimal adapter architecture that preserves the existing engine.

- the preferred implementation should be a lightweight REST adapter module such as `api/server.py`, `api/routes.py`, and `api/adapters.py`
- the adapter should call existing legislation retrieval, parsing, and search logic internally wherever practical
- the adapter must not require a rewrite of the core legislation engine in order to expose AI-facing HTTP endpoints
- the architecture should explicitly describe the relationship between the legislation engine, CLI and MCP surfaces, and the REST layer
- the project should evaluate FastAPI as the preferred implementation for automatic OpenAPI generation and predictable JSON contracts

### FR11.7: AI Tool Ecosystem Compatibility

The access layer should be explicitly designed for external AI tool ecosystems.

- the API should work cleanly with GPT custom actions through OpenAPI discovery
- the API should be suitable for Gemini tool integrations, RAG pipelines, LangChain tools, LlamaIndex tools, and similar agent ecosystems
- responses should favor structured JSON, predictable field names, source metadata, and low-markup payloads over presentation-oriented output
- the API should support use cases including legal search, contextual retrieval, citation support, and tool-based reasoning

### FR11.8: OpenAPI and Local Development

If the REST adapter is implemented, it must support standard local API operation and schema discovery.

- the API should expose `/openapi.json`
- local development should support a straightforward launch path such as `uvicorn api.server:app --reload`
- the OpenAPI contract must be treated as a versioned public surface if published for third-party AI tools
- endpoint and schema changes must be reflected in the compatibility matrix and release policy

### FR12: Domain Operating Model

The project must define where product planning stops and research planning begins.

- the legislation tool must be managed as a software product with its own release lifecycle
- the health research programme must be managed as a separate programme with its own publication lifecycle
- the project must document how the research programme can consume the tool without becoming the owner of the tool roadmap
- the project must define path-based and workflow-based guardrails so product-only changes and research-only changes are easy to distinguish

### FR12.1: Workspace and Submodule Topology

The parent workspace must support separate product and research repositories without collapsing them back into one planning or release lane.

- the parent directory may remain a coordination workspace, but it must not be the implementation source of truth for both domains
- `nz-legislation-tool` must remain an independently releasable Git repository with its own Conductor root
- `research-conductor` must remain an independently managed Git repository with its own Conductor root
- if parent-level Git submodules are adopted, the migration must be sequenced so tracked-directory replacement does not occur while parallel work is modifying those paths
- submodule conversion must require an explicit readiness gate covering clean parent index state, coordinated contributor timing, and confirmed remotes
- the operating model must document when work is performed inside the submodule versus in the parent coordination workspace

## Non-Functional Requirements

### NFR1: Low Operational Overhead

Normal release work should take minutes, not hours, once changes are merged and approved.

### NFR2: Auditability

It must be possible to reconstruct why a version was released, what changed, and how it was classified.

### NFR3: Safety

The stable channel must be protected from accidental prerelease publication, duplicate publish attempts, and branch confusion.

### NFR4: Incremental Adoption

The new model must be adoptable without pausing current product work for an extended migration.

## Recommended Direction

The intended target model is:

- `main` becomes the single protected stable branch
- Changesets becomes the source of truth for release intent and version calculation
- one stable release workflow publishes from `main`
- one prerelease workflow publishes from `next` using prerelease mode and npm `next` dist-tag
- stable releases use normal SemVer tags like `v2.0.0`
- prereleases use tags like `v3.0.0-next.0`
- manual tag-push publishing is retired as the primary release path
- the homepage presents a clear choice between CLI and MCP setup paths
- release planning is coordinated through Linear, documented in Notion, and visually supported through Figma where needed

The repository automation should converge on a deliberately small workflow set:

- `ci.yml` for lint, typecheck, test, and build
- `release-stable.yml` for stable publish from `main`
- `release-next.yml` for prerelease publish from `next`
- `docs.yml` for documentation deployment
- `security.yml` for CodeQL and dependency review

Additional workflows should be folded into these or demoted to manual-only roles.

The stable baseline should be made explicit early. If the MCP-enabled product line is judged to be a real public-surface expansion, the current stable line should be normalized as `2.0.0` before `3.0.0-next.x` is opened.

Under this model, the MCP release can be treated as a `2.0.0` major release if the project is intentionally repositioning from a CLI-only tool to a dual-surface CLI plus MCP platform with changed public expectations and release semantics.

The upcoming additional-API/provider architecture should be incubated on `next` as `3.0.0-next.x` until the compatibility story and plugin contracts are stable.

The eventual split into dedicated CLI and MCP repositories should be treated as a second-order distribution decision, not the first move. The first move is to establish clean release boundaries and documentation in the current repository. Once the surfaces, ownership, and release cadence are stable, the project can decide whether to:

- keep one source repository and publish distinct packages and docs
- keep one source repository but add dedicated public mirror repositories for discoverability
- move to separate source repositories with a shared core package

The preferred evaluation order is:

1. one source repository, one package, clearer docs and release channels
2. one source repository, multiple packages for clearer surface ownership
3. separate source repositories only if release cadence and contributor ownership truly diverge

For domain separation, the preferred evaluation order is:

1. keep one repository but split product and research operating contexts clearly
2. enforce path-based CODEOWNERS, workflow filters, and documentation boundaries
3. only then decide whether product and research need separate repositories or separate Conductor registries

For workspace separation, the preferred operating model is:

1. parent workspace as a coordination shell only
2. standalone Git repositories for `nz-legislation-tool` and `research-conductor`, each with its own `conductor/`
3. parent-level submodule wiring only after the parent index is ready and parallel work is coordinated
4. no shared parent `conductor/` as the implementation source of truth for both child repositories

If GPT-oriented analysis access becomes important, the preferred progression is:

1. document the current CLI and MCP surfaces clearly
2. add a small, read-only analysis-friendly access layer with stable URLs or endpoints
3. prioritize core navigation, context, definitions, status, citation, and source URLs before domain-specific legal signal extraction
4. only then consider whether that access layer warrants a separate service or repository

## Out of Scope

- implementing the Australian provider logic itself
- redesigning core CLI or MCP features unrelated to release governance
- migrating to a monorepo unless the release design proves it is necessary
- introducing external release platforms beyond GitHub and npm in this track
- building the full website redesign itself beyond the release and onboarding scope required for clarity

## Success Metrics

- one stable release workflow remains enabled for publishing
- one documented prerelease workflow exists for v3 incubation
- `main` and `master` ambiguity is eliminated
- missing required Changesets can block merge
- branch protection requires the actual CI workflow names
- contributors can identify release type and branch target from documentation alone
- first-time visitors can identify whether they need the CLI or the MCP server within the first screen of the homepage or README
- a documented decision tree exists for staying in one repo versus splitting CLI and MCP into separate repositories
- maintainers can classify a proposed change against a written compatibility matrix without ad hoc debate
- contract tests protect stable CLI and MCP surfaces from accidental breakage
- the release model includes environment, rerun, and rollback safety
- the roadmap includes a concrete decision on whether a GPT-friendly HTTP surface should exist
- the roadmap defines a prioritized endpoint set for any supported GPT-friendly access layer
- the roadmap explicitly separates tool-release governance from research-programme governance

## Acceptance Criteria

- a release strategy document exists and matches actual repository automation
- repository automation has one canonical stable release path
- a documented and tested prerelease path exists for `next`
- branch protection and review configuration match the documented workflow
- the repo contains contributor guidance for stable releases, prereleases, and hotfixes
- the roadmap is phased, prioritized, and ready for implementation work
- the roadmap defines the role of Notion, Figma, and Linear in release execution
- the roadmap defines how CLI and MCP usage is surfaced clearly from the homepage or README
- the roadmap includes a decision framework for separate CLI and MCP repositories
- the roadmap explicitly evaluates one-repo and multi-package as a likely intermediate target before any repo split
- the roadmap defines source-of-truth rules across Linear, Notion, and Figma
- the roadmap evaluates whether to add stable analysis-friendly endpoints for GPT-style consumers
- the roadmap prioritizes core legal navigation and interpretation endpoints ahead of investigation-specific or recommendation-specific endpoints
- the roadmap defines guardrails that keep `nz-legislation-tool` separate from the health research programme
- the roadmap defines readiness gates and a safe migration sequence for eventual parent-level submodule conversion
