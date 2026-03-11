# Australian Release Readiness

## Current conclusion

Australian support is **not ready for release** from the current governed release branches.

## Basis for that conclusion

The current active release branches (`main` and `next`) do not ship Australian jurisdiction support in the runtime code path.

The archived legacy branch contains earlier Australian plugin/provider work, but that work is not release-ready:

- `nz-legislation-tool/plugins/commonwealth/CommonwealthProvider.ts` is mostly placeholder behavior
- `nz-legislation-tool/plugins/queensland/QueenslandProvider.ts` returns empty search results and throws `Not implemented - scraper pending` for version retrieval
- the plugin manifests target `peerDependencies` on `nz-legislation-tool: ^2.0.0`, which does not match the current governed release line

## Release recommendation

- keep the MCP-enabled NZ-only tool on the stable `1.2.x` line
- do not publish Australian support from the current repo state
- extract and modernize the archived Australian code into the current release topology before assigning it a release version

## Next review gate

Australian support can be considered releaseable only after all of the following are true:

1. provider behavior is implemented rather than stubbed
2. runtime integration exists on an active release branch
3. CLI, MCP, and any future HTTP adapter contracts are tested
4. jurisdiction-specific documentation is added
5. versioning is aligned with the current governed package line
