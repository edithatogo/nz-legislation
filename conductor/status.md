# Conductor Status

Last reviewed: 2026-03-14

## Summary

This file is the authoritative Conductor workspace overview for this repository.
The workspace currently contains a mix of complete records, pending work, and
backlog/template material that has now been separated from active tracks.

See also:

- `README.md` for workspace operating rules
- `archive/README.md` for archived track inventory
- `backlog/README.md` for backlog promotion rules

## Active Track Inventory

| Track                              | Status   | Notes                                     |
| ---------------------------------- | -------- | ----------------------------------------- |
| `release-governance-modernization` | COMPLETE | Fully documented and marked complete      |
| `documentation-site-enhancements`  | PENDING  | Optional post-launch work not yet started |
| `documentation-site-completion`    | COMPLETE | Parent completion record restored         |
| `anz-brand-transition`             | PENDING  | Staged rename plan for product and repo   |

## Archived Tracks

Archived track count: `11`

The archive contains prior completed or retired efforts and should be treated as
historical context rather than active delivery scope.

## Backlog Entries

Backlog entry count: `4`

The backlog contains reserved track names that are not part of current active
delivery. One of them, `p1-legislative-volatility`, is intentionally tracked in
detail under `research-conductor` instead of this product-side Conductor tree.

## Current Read on Project State

- Conductor now has a clean active-track inventory.
- Two active tracks are explicitly complete.
- Two active tracks are explicitly pending.
- The documentation enhancement track no longer contradicts itself about launch
  status.
- The missing parent record for documentation site completion has been
  restored.
- The ANZ brand transition is now tracked as a separate staged migration rather
  than an implicit future rename.
- The former template track has been moved out of active inventory to
  `conductor/templates`.
- Former stub tracks have been moved out of active inventory to
  `conductor/backlog`.

## Recommended Next Cleanup

1. Track future status changes by updating `metadata.json` alongside each active
   track’s `index.md` and `plan.md`.
2. Promote backlog entries back into `conductor/tracks` only when they gain a
   real owner, scope, and plan.
3. Decide whether any archived tracks should be consolidated or indexed more
   explicitly for discovery.
