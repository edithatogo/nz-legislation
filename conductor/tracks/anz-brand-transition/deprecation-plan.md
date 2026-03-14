# Phase 5 Plan: Deprecation and Legacy Cleanup

**Track ID:** `anz-brand-transition`  
**Phase:** `5`  
**Approved:** `2026-03-14`

## Deprecation Window End Criteria

Legacy names may only be retired after all of the following are true:

- `anz-legislation` has been publicly shipped
- `anzlegislation` and `anzlegislation-mcp` have been publicly shipped
- the compatibility window has lasted at least `90 days`
- the compatibility window has covered at least `2 minor releases`
- docs and support materials include exact migration commands
- local config and environment-variable compatibility has been verified

## Legacy Surface Retirement Order

1. stop presenting old names as preferred defaults in docs
2. keep old package and binary names functional but clearly labeled legacy
3. after the window, decide whether `nz-legislation-tool` becomes a shim,
   remains supported longer, or is retired
4. only then consider retirement of:
   - `nzlegislation`
   - `nzlegislation-mcp`
   - MCP legacy naming
   - legacy config-path naming where safe fallback exists

## Final Cleanup Checklist

- remove or archive stale docs that reference the pre-ANZ repo path
- remove obsolete badges and support links that point to retired names
- update maintainer docs so the canonical identity is only `ANZ Legislation`
- confirm release automation, issue templates, and support tooling no longer
  imply NZ-only branding where that is no longer true
- verify the old names are either intentionally supported or intentionally
  retired, with no accidental half-state

## Track Closure Standard

The ANZ brand transition track can be marked complete only when:

- the repository identity has actually moved to `anz-legislation`
- package and CLI migration has been executed, not just planned
- repo/docs/site/MCP updates are live
- deprecation messaging has been published
- the compatibility window has been honored
- legacy cleanup decisions have been executed and verified

## Implementation Handover

This planning track is complete in governance terms once implementation begins
against these approved artifacts. Actual rename work should proceed through
reviewed PRs and release steps rather than by editing the planning documents
further unless decisions change.
