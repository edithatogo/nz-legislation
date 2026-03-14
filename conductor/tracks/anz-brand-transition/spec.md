# Specification: ANZ Brand Transition

## Position

Yes, the rename should begin now, but as a staged migration rather than a
single-step switch.

`anz-legislation` is a coherent target repository name because the product now
serves both New Zealand and Australian legislation. It is broad enough to cover
the current scope without pretending to be global. It also keeps the public
surface concise and legible.

The migration must still preserve continuity for existing users of:

- the GitHub repository `edithatogo/nz-legislation`
- the npm package `nz-legislation-tool`
- the CLI binaries `nzlegislation` and `nzlegislation-mcp`
- the current documentation and GitHub Pages URLs
- the current local config and log directories under `.nz-legislation-tool`

## Problem

The product name currently implies New Zealand-only scope while the product now
contains Australian jurisdiction support. That mismatch creates friction in:

- repository visibility for users
- documentation credibility
- package naming and install expectations
- CLI help and setup language
- future jurisdiction expansion planning

At the same time, renaming all public surfaces immediately would create
avoidable user breakage and release confusion.

## Scope

This track governs the rename strategy and execution plan for:

- product name
- repository name
- documentation and website naming
- npm package naming strategy
- CLI binary naming strategy
- MCP server naming and metadata
- local config/log directory strategy
- backwards-compatibility and deprecation policy

Out of scope:

- implementing new jurisdictions
- changing legal citation semantics
- redesigning the CLI surface beyond naming/migration concerns

## Target Naming

The default target names for planning are:

- Product name: `ANZ Legislation`
- Repository name: `anz-legislation`
- Preferred future package name: `anz-legislation`
- Preferred future CLI binaries: `anzlegislation` and `anzlegislation-mcp`

Legacy names remain valid during the compatibility window:

- `nz-legislation-tool`
- `nzlegislation`
- `nzlegislation-mcp`
- repo references to `edithatogo/nz-legislation`

## Compatibility Window Policy

The compatibility window begins when a replacement public surface is first
available to users.

- minimum duration: `90 days`
- minimum release count: `2 minor releases`
- legacy package and CLI names must remain functional during the full window
- documentation must label the old names as legacy aliases while replacements
  are introduced
- removal of old names requires published migration notes and a passed Phase 5
  Conductor review gate

## Canonical Surface Policy

During the migration, the canonical state for each public surface is:

- product copy can move first to `ANZ Legislation`
- repository rename to `anz-legislation` is approved, but deferred until Phase 4
- npm package remains canonically `nz-legislation-tool` until a dual-publish or
  migration path exists
- CLI binaries remain canonically `nzlegislation` and `nzlegislation-mcp` until
  alias support is implemented
- MCP metadata remains canonically `nz-legislation` until package, docs, and
  repo transitions can move together
- local config and log paths must continue reading the existing
  `.nz-legislation-tool` state throughout the compatibility window

## Required Outcomes

1. A canonical rename policy exists before public renaming starts.
2. The repository rename to `anz-legislation` is planned and executed safely.
3. A package migration strategy exists that does not strand the existing npm
   install base.
4. CLI naming migration is staged and documented.
5. Docs, GitHub Pages, and MCP metadata are updated consistently.
6. Legacy names have an explicit deprecation window and removal criteria.
7. Every implementation phase is gated by a scripted Conductor review step.

## Acceptance Criteria

- A new active Conductor track documents the ANZ rename strategy.
- The plan names `anz-legislation` as the repository target.
- The plan explicitly distinguishes product rename, package rename, CLI rename,
  repo rename, and docs/site rename.
- The plan preserves legacy install paths during a compatibility window instead
  of forcing immediate breakage.
- Each phase in the plan has an `Automated Review Gate` subsection.
- The repository contains a reusable review command:
  `node scripts/conductor-phase-review.mjs --track anz-brand-transition --phase <n>`.
- Conductor workspace summary includes this track in active inventory.

## Risks

- npm package rename can break install scripts and automation if executed
  without alias or shim strategy.
- GitHub Pages path and docs search indexes may break if the repo name changes
  without parallel updates.
- Existing references in docs and workflows are widespread and require
  deliberate sequencing.
- `ANZ` branding is appropriate for current scope, but the decision should be
  revisited if the product expands beyond Australia and New Zealand.

## Evidence Sources

Primary evidence for migration scope includes:

- `package.json`
- `README.md`
- `src/cli.ts`
- `src/mcp/server.ts`
- `src/config.ts`
- `src/utils/logger.ts`
- `src/utils/secure-config.ts`
- `src/utils/version.ts`
- `docs/`
- `.github/workflows/`

## Follow-On Execution

This track is the planning and control surface for the rename. Implementation
work should be delivered phase by phase against this plan rather than through a
single mass rename commit.
