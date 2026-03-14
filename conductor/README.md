# Conductor Workspace

This directory is the local source of truth for project-side Conductor records
in this repository.

## Layout

- `status.md`
  Authoritative overview of current active, archived, backlog, and template
  state.
- `tracks/`
  Active tracks only. A track belongs here only when it has current ownership
  and real Conductor artifacts.
- `backlog/`
  Reserved or deferred track names that should not appear as active work yet.
- `templates/`
  Reusable template material that should not appear in active inventory.
- `archive/`
  Historical completed or retired tracks retained for context.

## Active Track Standard

Each active track should have:

1. `index.md`
2. `plan.md`
3. `metadata.json`

Optional supporting files such as `spec.md` or `PROGRESS_LOG.md` are encouraged
when they materially improve traceability.

## Current Active Tracks

- `release-governance-modernization`
- `documentation-site-completion`
- `documentation-site-enhancements`
- `anz-brand-transition`

## Operating Rule

If a named effort does not yet have a real owner, scope, and plan, keep it in
`backlog/` rather than `tracks/`.
