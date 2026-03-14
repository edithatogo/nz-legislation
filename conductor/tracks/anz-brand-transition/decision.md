# Phase 1 Decision Record: Naming and Compatibility Policy

**Track ID:** `anz-brand-transition`  
**Phase:** `1`  
**Approved:** `2026-03-14`

## Approved Names

- Product name: `ANZ Legislation`
- Repository target: `anz-legislation`
- Preferred future npm package: `anz-legislation`
- Preferred future CLI binaries: `anzlegislation` and `anzlegislation-mcp`
- Preferred future MCP server name: `anz-legislation`

## Canonical vs Legacy Surface Policy

| Surface           | Current canonical state                   | Future canonical state                            | Phase 1 decision                                                                                |
| ----------------- | ----------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Product copy      | `NZ Legislation Tool` in many public docs | `ANZ Legislation`                                 | Public-facing copy may begin moving to `ANZ Legislation` before package and binary renames ship |
| GitHub repository | `edithatogo/nz-legislation`               | `edithatogo/anz-legislation`                      | Repository rename is approved in principle, but deferred to Phase 4                             |
| npm package       | `nz-legislation-tool`                     | `anz-legislation`                                 | `nz-legislation-tool` remains canonical until a dual-publish or migration path exists           |
| CLI binaries      | `nzlegislation`, `nzlegislation-mcp`      | `anzlegislation`, `anzlegislation-mcp`            | Existing binaries remain canonical until alias support ships                                    |
| MCP metadata      | `nz-legislation`                          | `anz-legislation`                                 | MCP rename is deferred until repo/docs/package strategy is coordinated                          |
| Local config path | `.nz-legislation-tool`                    | `.anz-legislation` or equivalent alias-aware path | Old config path must remain readable throughout the compatibility window                        |

## Compatibility Window

The compatibility window begins when a replacement public surface is first
shipped to users.

- Minimum duration: `90 days`
- Minimum release count: `2 minor releases`
- Old names must remain functional during that full window
- Old names must be documented as legacy aliases, not silently dropped
- Removal requires release notes, migration examples, and a passed Phase 5
  Conductor review

## Explicit Exceptions

- Public documentation may describe the product as `ANZ Legislation` before the
  npm package and CLI binary names change, but install commands must keep using
  the current package and binary names until replacements exist.
- The GitHub repository may be renamed before the npm package is renamed, as
  long as badges, docs links, workflow references, and support links are
  updated in the same migration phase.
- Local config and log handling must prefer backwards compatibility over naming
  purity during the transition.

## Phase 2 Entry Criteria

Phase 2 can begin now that:

- the target public names are approved
- the compatibility window is explicit rather than implied
- canonical versus legacy public surfaces are documented
- deferred decisions are identified for package, CLI, MCP, and local config
  migration
