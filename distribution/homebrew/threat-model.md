# Homebrew Threat Model

Status: preparation-only; tap and formula publication remain blocked.

## Assets

- Release tarball and checksum
- Formula source and tap commit
- CLI and MCP executable entry points
- User configuration and API credentials

## Threats and controls

| Threat                          | Required control                                                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Tarball substitution            | Use an immutable GitHub release asset, verified SHA-256, and provenance review.                                 |
| Formula command injection       | Keep formula Ruby declarative, avoid network or shell evaluation, and review every URL and resource.            |
| Untrusted post-install behavior | No post-install network calls, credential collection, or automatic configuration.                               |
| Binary drift                    | Test the installed formula's version, help, aliases, and MCP stdio startup from the exact tarball.              |
| Unsupported provider claims     | Formula and caveats must describe NZ stable and Australian prerelease/planned maturity accurately.              |
| Tap compromise                  | Require protected branches, reviewed changes, release ownership, and signed/provenance-backed source artifacts. |

## Required pre-publication evidence

- Exact release asset URL and SHA-256
- Formula audit and clean-host install transcript
- Version/help/MCP smoke tests
- Provenance and vulnerability review
- Credential-negative test
- Package metadata, capability, and install-snippet gates

No tap commit, formula publication, or external Homebrew submission is
authorized by this document.
