# Track: ANZ Brand Transition

## Context

- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Phase 1 Decision Record](./decision.md)
- [Phase 2 Surface Inventory](./inventory.md)
- [Phase 2 Implementation Rules](./rules.md)
- [Phase 3 Package and CLI Strategy](./package-cli-strategy.md)
- [Phase 4 Repo and Docs Migration Checklist](./repo-docs-migration.md)
- [Phase 5 Deprecation Plan](./deprecation-plan.md)
- [Metadata](./metadata.json)

## Status

🟡 IN PROGRESS - Planning phases are complete; the track is now ready to move
from planning into implementation and rollout work

## Summary

Australian support means the product now has a mismatch between what it does
and what it is called. The rename should be staged rather than immediate,
because the repository name, npm package, CLI binary, GitHub Pages path,
documentation URLs, configuration directories, and MCP identity are all tied to
the existing `nz-legislation` / `nz-legislation-tool` naming.

This track treats `anz-legislation` as the target repository name and `ANZ
Legislation` as the target product identity. It deliberately separates the
decision, compatibility policy, public-surface migration, and eventual cleanup
so the transition can happen without breaking current users.

All planning phases are complete. The naming policy is recorded in `decision.md`, the
rename-sensitive inventory is in `inventory.md`, the dual-branding rules are in
`rules.md`, and the package/CLI migration strategy is in
`package-cli-strategy.md`. The repository, documentation, site, MCP, and
support-link migration checklist is in `repo-docs-migration.md`, and the
deprecation completion criteria are in `deprecation-plan.md`. The next step is
no longer planning. It is implementation: execute the rename in reversible
phases against these approved track artifacts.

## Intended Outcome

- the repository can be renamed to `anz-legislation`
- the product can be presented publicly as `ANZ Legislation`
- package and CLI migration can happen with an explicit compatibility window
- documentation, MCP, and website surfaces can be updated without orphaning the
  current install base
- every phase ends with a scripted Conductor review gate before work advances

## Review Automation

Use the phase-end review command at the end of each plan phase:

`node scripts/conductor-phase-review.mjs --track anz-brand-transition --phase <n>`

The command validates that the active track artifacts exist, that the named
phase exists in the plan, and that the phase contains its own review gate.

---

**Track ID:** `anz-brand-transition`
**Last Updated:** 2026-03-14
