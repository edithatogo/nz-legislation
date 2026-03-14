# Phase 3 Strategy: Package and CLI Migration

**Track ID:** `anz-brand-transition`  
**Phase:** `3`  
**Approved:** `2026-03-14`

## Registry Findings

- Current public npm package: `nz-legislation-tool@1.2.0`
- Current public dist-tag: `latest`
- Proposed future package `anz-legislation` is currently available on npm
- Scoped mirror package `@edithatogo/nz-legislation-tool` is not publicly
  installed from npmjs.com and should not be treated as the main migration path

## Chosen Strategy

### Package Strategy

Use **dual-publish**, not a pure shim package.

The recommended path is:

1. keep publishing `nz-legislation-tool`
2. introduce `anz-legislation` as a sibling package carrying the same release
   line
3. keep both packages functionally supported through the compatibility window
4. only after the compatibility window, decide whether `nz-legislation-tool`
   becomes a shim, remains supported longer, or is retired

### Why Not a Pure Shim First

A pure shim package is the wrong first move because:

- globally installed CLI binaries need to work directly
- npm dependency bins are not a clean user-facing replacement for global
  installs
- a shim complicates support and troubleshooting before the ANZ names are even
  established in the field

The least confusing user experience is to publish a real sibling package with
its own direct binaries.

## CLI Strategy

Introduce new binaries while preserving the old ones:

- legacy binaries remain supported:
  - `nzlegislation`
  - `nzlegislation-mcp`
- future binaries are introduced:
  - `anzlegislation`
  - `anzlegislation-mcp`

The first release that introduces `anz-legislation` should make the new binary
names available without removing the old ones.

## Release Sequencing

### First ANZ Migration Release

- package `nz-legislation-tool` still published
- package `anz-legislation` published for the first time
- release notes present `ANZ Legislation` as the product identity
- old install path remains documented as supported
- new install path is added as the preferred forward-looking path

### Compatibility Window Releases

- both package names remain supported
- both CLI naming paths remain documented
- support docs explicitly label `nz-legislation-tool` and `nzlegislation*` as
  legacy-compatible paths

### Post-Window Decision Point

At the end of the window, choose one of:

- retire `nz-legislation-tool`
- convert `nz-legislation-tool` into a shim
- extend dual-publish if migration uptake is too low

## Release-Note Messaging

The first ANZ migration release should say:

- the product is now presented publicly as `ANZ Legislation`
- existing users can continue using `nz-legislation-tool` and
  `nzlegislation*`
- new users may install `anz-legislation` and use `anzlegislation*`
- the old names are legacy-compatible and will remain supported for at least
  `90 days` and `2 minor releases`

## Deprecation Messaging

Deprecation messaging must begin when the new package and binaries actually
ship, not earlier.

Required message shape:

- "supported legacy path" rather than "obsolete"
- exact migration commands
- end-of-window criteria
- confirmation that local config and existing env vars still work

## Phase 4 Handover

Phase 4 can now plan the repository and docs migration with the following
assumption:

- product copy can be ANZ-first
- repo rename can happen before legacy package removal
- package and CLI migration no longer block repo/docs planning because the
  compatibility path is defined
