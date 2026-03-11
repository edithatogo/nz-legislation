# Release Policy

## Purpose

This document defines how `nz-legislation-tool` is versioned, released, and communicated.

The npm package version is the canonical product version. Public contracts governed by that version include:

- the CLI surface
- the MCP surface
- any future published HTTP or OpenAPI surface

## Release Channels

### Stable

- Branch: `main`
- Workflow: `Release Stable`
- npm dist-tag: `latest`
- Intended audience: all users

### Prerelease

- Branch: `next`
- Workflow: `Release Next`
- npm dist-tag: `next`
- Intended audience: early adopters and maintainers validating the next major line

## Versioning Rules

### Major

Use a major release when a change breaks a supported public contract, including:

- CLI command names or removal of supported flags
- output contract changes that break documented stable usage
- MCP tool name, schema, or behavioral breaks
- future published OpenAPI endpoint or schema breaks

### Minor

Use a minor release for backward-compatible feature additions, including:

- new CLI functionality
- new MCP tools or additive MCP fields
- additive API adapter endpoints or fields

### Patch

Use a patch release for fixes that do not break a supported public contract, including:

- bug fixes
- internal refactors
- documentation corrections
- performance improvements that preserve behavior

## Release Artifacts

Every user-facing change should include a changeset unless it is explicitly release-neutral.

The canonical workflow set is:

- `CI`
- `Release Stable`
- `Release Next`
- `docs.yml`
- `publish-github-packages.yml`
- security workflows

Legacy release and CI workflows are retained as manual-only paths until they are fully removed.

## Package Registry Policy

- Canonical public npm package: `nz-legislation-tool`
- GitHub Packages mirror: `@edithatogo/nz-legislation-tool`

The GitHub Packages mirror exists for repository package visibility and ecosystem convenience. npm remains the canonical installation target unless this policy is revised.

## Release Checklist

Before stable release:

1. Merge approved changes to `main`.
2. Ensure changesets correctly reflect release intent.
3. Confirm CI is green.
4. Let `Release Stable` create the release PR or publish.

Before prerelease:

1. Merge approved next-major work to `next`.
2. Confirm prerelease intent and branch scope.
3. Confirm CI is green.
4. Let `Release Next` publish to the `next` dist-tag.

## Hotfix Policy

Urgent stable fixes should target `main` and use the stable release path. Do not bypass the stable workflow with ad hoc tag pushes unless the stable workflow is unavailable and the fallback is explicitly documented.
