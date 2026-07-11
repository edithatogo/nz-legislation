# IDE Extension Threat Model

Status: preparation-only; extension implementation and submission are blocked.

| Threat                            | Control                                                                                                                            |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| API key disclosure                | Host SecretStorage only; never settings, logs, telemetry, source, or package assets.                                               |
| Extension supply-chain tampering  | Reproducible VSIX/plugin archives, frozen dependencies, SBOM/provenance, signed marketplace artifacts, and reviewable source tags. |
| Over-privileged command execution | Use explicit command allowlists; do not execute arbitrary shell input or permit arbitrary filesystem paths.                        |
| Provider overclaiming             | Read capability manifest at runtime and render stable/prerelease/planned/unsupported state explicitly.                             |
| Marketplace asset attack          | HTTPS-only images, no untrusted SVGs, reviewed README/badges, and no remote executable assets.                                     |
| Cross-marketplace drift           | Maintain separate VS Code, Open VSX, and JetBrains metadata and evidence; never infer one marketplace's approval from another.     |
| Malicious update                  | Pin/review release inputs, verify package checksums/provenance, and document rollback/unpublish procedures.                        |

## Required evidence

- Extension manifest and permission review
- SecretStorage negative test
- CLI/MCP invocation smoke tests
- VSIX/plugin archive inspection
- SBOM, vulnerability, and provenance evidence
- Marketplace-specific publisher and listing review
- NZ/AU capability-copy review
