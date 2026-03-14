# Conductor Status

Last reviewed: 2026-03-14

## Summary

This file is the current Conductor overview for the repository branch.

See also:

- `README.md` for workspace rules
- `tracks/anz-brand-transition/` for the active rename-planning track

## Active Track Inventory

| Track                  | Status | Notes                                                       |
| ---------------------- | ------ | ----------------------------------------------------------- |
| `anz-brand-transition` | ACTIVE | Planning complete; implementation and rollout work now next |

## Current Read on Project State

- The repository now has an explicit Conductor track for ANZ rename planning.
- Phase 1 is complete: target names, compatibility window, and canonical versus
  legacy public surfaces are now documented.
- Phase 2 is complete: rename-sensitive surfaces, dual-branding rules, and safe
  early-edit boundaries are now documented.
- Phase 3 is complete: package migration, CLI aliasing, and deprecation
  messaging now have a chosen strategy.
- Phase 4 is complete: repository, docs, site, MCP, and support-link migration
  points now have an explicit checklist.
- Phase 5 is complete: deprecation criteria, legacy retirement order, and track
  closure conditions are now defined.
- The product still ships as `nz-legislation-tool`, and package or binary
  renaming has not started yet.
- Planning is complete. The active tracked work here is now implementation and
  rollout against the approved ANZ transition artifacts.

## Recommended Next Step

1. Start implementation with the first operational PR: safe ANZ-first product-copy edits that do not rename package, CLI, MCP, env vars, or config paths.
2. After that, execute the package/CLI migration and repo/docs migration in reviewed rollout phases rather than further planning-only edits.
