# Provider Runtime

This repository has a single stable runtime provider today:

- New Zealand is the only runtime-supported stable provider.
- Australian providers remain planned or unsupported at runtime.
- The Commonwealth has a validated Federal Register of Legislation source card and adapter boundary, but its runtime posture is still gated and `runtimeEnabled` remains false.
- Maintainer guidance for source-card provenance is in `docs/maintainers/provider-source-cards.md`.

## Runtime posture

| Jurisdiction                                                                                     | Runtime posture                        | Notes                                                                                                           |
| ------------------------------------------------------------------------------------------------ | -------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| New Zealand                                                                                      | Stable and runtime-supported           | Existing NZ compatibility surface is the only enabled runtime path.                                             |
| Australian Commonwealth                                                                          | Planned, gated, unsupported at runtime | Source validation exists, but the provider adapter must still pass runtime and release gates before enablement. |
| Queensland, NSW, Victoria, South Australia, Western Australia, Tasmania, ACT, Northern Territory | Planned, unsupported                   | These providers remain backlog items and must stay behind capability/runtime gates.                             |

## Gate rules

- CLI, MCP, and export must consult the provider registry and runtime gates before exposing a jurisdiction.
- Unsupported or prerelease jurisdictions must return structured capability errors rather than falling back to NZ data.
- Australian runtime enablement requires the release/submission gates to pass before any public support claim.

## Compatibility names

Keep these stable compatibility names in place during the ANZ transition:

- `nz-legislation-tool`
- `nzlegislation`
- `nzlegislation-mcp`

Keep these as transitional aliases until migration policy changes:

- `anzlegislation`
- `anzlegislation-mcp`
