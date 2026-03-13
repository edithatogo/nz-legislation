# ADR 0001: Release Governance Topology

## Status

Accepted

## Context

The repository had overlapping CI and release workflows, ambiguous release ownership, and no clean split between stable and prerelease publication paths.

The project also now has more than one meaningful public surface:

- CLI
- MCP
- future AI-facing HTTP/OpenAPI adapter

These surfaces need explicit release governance.

## Decision

The repository adopts the following governance topology:

- `main` is the stable branch
- `next` is the prerelease branch
- `CI` is the canonical validation workflow
- `Release Stable` is the canonical stable publish workflow
- `Release Next` is the canonical prerelease publish workflow
- legacy overlapping workflows are retained only as manual-only fallbacks until fully removed
- the npm package version is the canonical product version
- CLI and MCP are governed public contracts under that version

## Consequences

### Positive

- clearer release ownership
- clearer branch intent
- fewer workflow races
- easier future governance of a published OpenAPI surface

### Negative

- future external surfaces still require explicit governance work before stable release
- admin bypass needs to be handled intentionally at the branch protection layer
