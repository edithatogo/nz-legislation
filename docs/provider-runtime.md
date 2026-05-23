# Provider Runtime

This repository has one stable runtime provider and one source-backed prerelease
Australian runtime slice today:

- New Zealand is the stable runtime-supported provider.
- Australian Commonwealth is source-backed prerelease for search, get-work,
  versions, export, and MCP paths through the Federal Register of Legislation
  public API.
- Australian Commonwealth citation and single-version retrieval remain
  unsupported.
- Queensland, NSW, Victoria, South Australia, Western Australia, Tasmania, ACT,
  and Northern Territory remain planned or unsupported at runtime.
- Maintainer guidance for source-card provenance is in
  `docs/maintainers/provider-source-cards.md`.

## Runtime posture

| Jurisdiction                                                                                     | Runtime posture                  | Notes                                                                                                                                   |
| ------------------------------------------------------------------------------------------------ | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| New Zealand                                                                                      | Stable and runtime-supported     | Existing NZ compatibility surface remains the stable enabled runtime path.                                                              |
| Australian Commonwealth                                                                          | Source-backed prerelease runtime | Search, get-work, versions, export, and MCP are prerelease and source-backed; citation and single-version retrieval remain unsupported. |
| Queensland, NSW, Victoria, South Australia, Western Australia, Tasmania, ACT, Northern Territory | Planned, unsupported             | These providers remain backlog items and must stay behind capability/runtime gates.                                                     |

## Gate rules

- CLI, MCP, and export must consult the provider registry and runtime gates
  before exposing a jurisdiction.
- Unsupported jurisdictions must return structured capability errors rather than
  falling back to NZ data.
- Prerelease Australian runtime support must be described as prerelease until
  the release/submission gates pass for the relevant jurisdiction and channel.
- Australian stable runtime enablement requires the release/submission gates to
  pass before any public stable support claim.

## Compatibility names

Keep these stable compatibility names in place during the ANZ transition:

- `nz-legislation-tool`
- `nzlegislation`
- `nzlegislation-mcp`

Keep these as transitional aliases until migration policy changes:

- `anzlegislation`
- `anzlegislation-mcp`
