# Australian Release Readiness

## Current conclusion

Australian support is **not ready for release** from the current governed release branches.

## Basis for that conclusion

The current active release branches (`main` and `next`) do not ship Australian jurisdiction support in the runtime code path.

The Australian Commonwealth source has now been validated against the Federal
Register of Legislation public API documentation and OpenAPI document. That
validation confirms a viable official source, but it does not make Commonwealth
runtime support releaseable until an adapter is implemented and tested.

The other Australian jurisdiction entries now have a source inventory, not
runtime support. Queensland has a located official API service requiring
registration and source-shape work. NSW has a located XML/export surface. The
remaining state and territory entries have located official websites, but still
need machine-readable source-shape validation before any runtime or release
claim.

The archived legacy branch contains earlier Australian plugin/provider work, but that work is not release-ready:

- `nz-legislation-tool/plugins/commonwealth/CommonwealthProvider.ts` is mostly placeholder behavior
- `nz-legislation-tool/plugins/queensland/QueenslandProvider.ts` returns empty search results and throws `Not implemented - scraper pending` for version retrieval
- the plugin manifests target `peerDependencies` on `nz-legislation-tool: ^2.0.0`, which does not match the current governed release line

## Release recommendation

- keep the MCP-enabled NZ-only tool on the stable `1.2.x` line
- do not publish Australian support from the current repo state
- implement Commonwealth support from the validated Federal Register of
  Legislation API rather than reviving placeholder legacy behavior
- extract and modernize any useful archived Australian code only after it is
  reconciled with the current release topology and provider capability gates

## Next review gate

Australian support can be considered releaseable only after all of the following are true:

1. provider behavior is implemented rather than stubbed
2. runtime integration exists on an active release branch
3. CLI, MCP, and any future HTTP adapter contracts are tested
4. jurisdiction-specific documentation is added
5. versioning is aligned with the current governed package line

## Source validation records

- Australian Commonwealth:
  `docs/maintainers/commonwealth-source-validation.md`
- Other Australian jurisdictions:
  `docs/maintainers/australian-source-inventory.md`
