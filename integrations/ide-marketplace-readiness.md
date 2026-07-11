# IDE Marketplace Readiness

Status: preparation-only. No VS Code Marketplace, Open VSX, or JetBrains
Marketplace submission is authorized.

Last verified: 2026-07-12

## Shared extension boundary

- Proposed extension scope is command invocation and user-facing results only.
- API keys must use VS Code SecretStorage or the host's equivalent secure store.
- No credentials in settings, source, logs, telemetry, bundled assets, or
  generated manifests.
- Commands invoke the packaged CLI/MCP surfaces and must report provider
  capability and provenance.
- NZ is stable; Commonwealth is prerelease; other Australian jurisdictions are
  planned or unsupported.
- The extension remains unimplemented and unpublished until the gates pass.

## Marketplace matrix

| Surface               | Local contract                                | Official evidence                                                                                                                                                     | Required submission evidence                                                                                                 | Status                            |
| --------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| VS Code Marketplace   | `integrations/vscode/extension-contract.json` | https://code.visualstudio.com/api/references/extension-manifest and https://code.visualstudio.com/api/working-with-extensions/publishing-extension                    | Manifest, unique publisher/name, VSIX package, HTTPS assets, secure publishing credential, extension smoke tests, provenance | Blocked                           |
| Open VSX              | `integrations/vscode/openvsx-contract.json`   | https://github.com/eclipse-openvsx/openvsx                                                                                                                            | Separate namespace/token, `ovsx` package, VSIX smoke test, registry URL, provenance, listing review                          | Blocked                           |
| JetBrains Marketplace | `integrations/jetbrains/plugin-contract.json` | https://plugins.jetbrains.com/docs/marketplace/uploading-a-new-plugin.html and https://plugins.jetbrains.com/docs/marketplace/publishing-and-listing-your-plugin.html | Justified plugin scope, vendor profile, plugin archive, EULA, compatibility matrix, manual review evidence                   | Not justified; readiness recorded |

## Submission boundaries

VS Code Marketplace and Open VSX are separate publication paths and must never
share credentials, namespace assumptions, or evidence. JetBrains remains
readiness-only until a separately approved scope exists. No listing may imply
first-party endorsement or a stable Australian capability classification.
