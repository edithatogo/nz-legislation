# Australian Release Readiness

## Current conclusion

Australian support is **not ready for stable release** from the current governed
release branches. Australian Commonwealth is a source-backed prerelease runtime
surface for search, get-work, versions, export, and MCP. Citation and
single-version retrieval remain unsupported.

## Basis for that conclusion

The current active release branches (`main` and `next`) distinguish stable New
Zealand support from prerelease or planned Australian support in the runtime
capability manifest.

The Australian Commonwealth source has now been validated against the Federal
Register of Legislation public API documentation and OpenAPI document. That
validation confirms a viable official source. The repository now keeps
Commonwealth runtime support prerelease and source-backed for search, get-work,
versions, export, and MCP while keeping citation and single-version retrieval
unsupported.

The other Australian jurisdiction entries now have a source inventory, not
runtime support. Queensland has a validated official API candidate requiring
registration, Swagger capture, fixtures, and provider mapping. NSW has a
validated XML/export candidate requiring an export/download adapter design. The
remaining state and territory entries have official-source validation records,
but still need machine-readable source-shape validation before any runtime or
release claim.

The archived legacy branch contains earlier Australian plugin/provider work, but that work is not release-ready:

- `nz-legislation-tool/plugins/commonwealth/CommonwealthProvider.ts` is mostly placeholder behavior
- `nz-legislation-tool/plugins/queensland/QueenslandProvider.ts` returns empty search results and throws `Not implemented - scraper pending` for version retrieval
- the plugin manifests target `peerDependencies` on `nz-legislation-tool: ^2.0.0`, which does not match the current governed release line

## Release recommendation

- keep the MCP-enabled NZ-only tool on the stable `1.2.x` line
- do not publish stable Australian support from the current repo state
- implement Commonwealth support from the validated Federal Register of
  Legislation API rather than reviving placeholder legacy behavior
- extract and modernize any useful archived Australian code only after it is
  reconciled with the current release topology and provider capability gates

## Next review gate

Australian support can be considered releaseable only after all of the following are true:

1. provider behavior is implemented rather than stubbed
2. runtime integration exists on an active release branch for the claimed
   capability
3. CLI, MCP, and any future HTTP adapter contracts are tested
4. jurisdiction-specific documentation is added
5. versioning is aligned with the current governed package line
6. stable Australian support is promoted only after every release/submission
   gate passes

## Source validation records

- Australian Commonwealth:
  `docs/maintainers/commonwealth-source-validation.md`
- Other Australian jurisdictions:
  `docs/maintainers/australian-source-inventory.md`
- Queensland:
  `docs/maintainers/queensland-source-validation.md`
- New South Wales:
  `docs/maintainers/nsw-source-validation.md`
- Victoria, South Australia, Western Australia, Tasmania, ACT, and Northern
  Territory:
  `docs/maintainers/state-territory-source-validation.md`
