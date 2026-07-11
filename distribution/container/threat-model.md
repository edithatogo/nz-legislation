# Docker/GHCR Threat Model

Status: preparation-only; publication remains blocked.

## Assets

- Compiled CLI and MCP entry points
- Provider credentials supplied at runtime
- Source and package provenance
- User search/export data and generated files

## Threats and controls

| Threat                            | Required control                                                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Mutable or compromised base image | Pin a digest for a supported minimal Node image and review it before each release.                                             |
| Dependency or build tampering     | Use a frozen lockfile, reproducible build inputs, SBOM, signed/provenance-attested build, and reviewable source commit.        |
| Credential leakage                | Never bake API keys into layers, environment defaults, logs, labels, or examples; pass credentials only at runtime.            |
| Excess container privilege        | Run as non-root with a read-only filesystem, dropped capabilities, no host networking, and an explicit temporary directory.    |
| Unsupported legal-data claims     | Derive labels and documentation from the capability manifest; preserve structured unsupported-provider errors.                 |
| Malicious or oversized input      | Keep URL, query, output-path, and provider validation in the packaged CLI and apply resource/time limits at the host boundary. |
| Image drift after publication     | Verify digest, SBOM, provenance, vulnerability scan, and smoke-test evidence before any GHCR push.                             |

## Required pre-publication evidence

- Pinned base-image digest and review date
- Reproducible build transcript
- SBOM and vulnerability scan
- Build provenance attestation and immutable image digest
- Non-root/read-only smoke test
- Credential-negative test
- Provider capability and install-snippet gates

No Dockerfile, image push, GHCR publication, or stable Australian claim is
authorized by this document.
