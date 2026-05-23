# Capability Matrix

This matrix is the public documentation view of the provider capability manifest.
Runtime and release claims must stay aligned with `src/providers/capability-manifest.ts`.

| Jurisdiction                 | Provider ID                       | Release channel | Search                   | Get work                 | Versions                 | Single version           | Citation                 | Export                   | MCP                      |
| ---------------------------- | --------------------------------- | --------------- | ------------------------ | ------------------------ | ------------------------ | ------------------------ | ------------------------ | ------------------------ | ------------------------ |
| New Zealand                  | `legislation-govt-nz`             | Stable          | Supported, source-backed | Supported, source-backed | Supported, source-backed | Supported, source-backed | Supported, source-backed | Supported, source-backed | Supported, source-backed |
| Australian Commonwealth      | `federal-register-of-legislation` | Prerelease      | Supported, source-backed | Supported, source-backed | Supported, source-backed | Unsupported              | Unsupported              | Supported, source-backed | Supported, source-backed |
| Queensland                   | `queensland-legislation`          | Planned         | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              |
| New South Wales              | `nsw-legislation`                 | Planned         | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              |
| Victoria                     | `victorian-legislation`           | Planned         | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              |
| South Australia              | `south-australian-legislation`    | Planned         | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              |
| Western Australia            | `western-australian-legislation`  | Planned         | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              |
| Tasmania                     | `tasmanian-legislation`           | Planned         | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              |
| Australian Capital Territory | `act-legislation`                 | Planned         | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              |
| Northern Territory           | `northern-territory-legislation`  | Planned         | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              | Unsupported              |

## Release posture

New Zealand is the stable supported runtime surface. Australian Commonwealth is
source-backed prerelease for search, get-work, versions, export, and MCP paths.
All other Australian jurisdictions remain planned and unsupported until official
source-backed provider implementations and release/submission gates pass.

Commonwealth citation and single-version support: unsupported.

Do not use this matrix to describe Australia as stable.
