# Track: ANZ Brand Transition

## Context

- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Metadata](./metadata.json)

## Status

🟡 PENDING - Track created to govern the rename from NZ-only branding to an
ANZ-wide product identity

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
