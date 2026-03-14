# Track: Release Governance Modernization

## Context

- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Progress Log](./PROGRESS_LOG.md)
- [Metadata](./metadata.json)

## Status

🟢 COMPLETE - Governance baseline and follow-on cleanup implemented on both active branches

## Summary

This coordination track modernizes package governance, release automation, and
repository operating rules for `nz-legislation-tool`.

The baseline governance work has already been implemented in the active tool
repository:

- canonical `CI`, `Release Stable`, and `Release Next` workflows
- `main` stable and `next` prerelease branch model
- npm trusted publishing and GitHub Packages mirror
- `1.2.0` stable release of the NZ CLI + MCP package
- maintainer guides, architecture decision records, and package policy docs
- legacy `master` branch archived rather than deleted

The remaining work is now outside this track:

- future HTTP/OpenAPI surface work is governed by policy and architecture
  decision records
- Australian prerelease work is handed off to the tool-side
  `australian-expansion-next` track

## Outcome

The package now has a governed stable line and a governed prerelease lane. The
release policy has also been corrected to reflect the actual shipped decision:
MCP was released as additive `1.2.0`, not as a major `2.0.0`.

---

**Track ID:** `release-governance-modernization`
**Last Updated:** 2026-03-12
