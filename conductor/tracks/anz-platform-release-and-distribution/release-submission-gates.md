# Release and Submission Gates

These gates block every future external publication, deployment, marketplace
submission, registry submission, and public listing created from this track.

| Gate                                          | Status   | Required evidence                                                                                                                    |
| --------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| No-placeholder legal data                     | BLOCKING | Tests and review evidence show no placeholder Australian legal data is exposed as real support.                                      |
| Provider capability manifest                  | BLOCKING | A runtime manifest exists and records jurisdiction, provider, feature, and support status.                                           |
| Provider-aware MCP/export                     | BLOCKING | MCP tools and export paths check provider capability and return structured unsupported errors.                                       |
| Accurate package metadata                     | BLOCKING | `package.json`, README, registry metadata, binaries, aliases, and deprecation/prerelease language match runtime capability.          |
| Updated website/docs                          | BLOCKING | Website/docs install, capability, MCP, export, and ANZ transition pages match the manifest.                                          |
| Tested install snippets                       | BLOCKING | npm, npx, MCP stdio, GitHub Packages, Docker/GHCR, Homebrew, assistant, and IDE snippets are tested or explicitly marked unverified. |
| Security/provenance review                    | BLOCKING | Supply-chain, permissions, provenance, generated artifacts, release automation, and listing claims are reviewed.                     |
| NZ stable/Australian prerelease release notes | BLOCKING | Release notes clearly distinguish NZ stable support from Australian prerelease or planned support.                                   |

## Gate policy

- A channel cannot be submitted with a BLOCKING gate.
- A source-validation-required channel cannot be submitted until current official
  submission documentation has been verified.
- Public listing copy must not claim Australian runtime support until the
  no-placeholder legal-data and provider capability gates pass.
- Compatibility aliases must be described as aliases while the ANZ transition is
  incomplete.
- Gate evidence must be committed in this repository before a release PR is
  considered ready.

## Current import verdict

The v9 import is preparation-only. It adds the roadmap, integration folders, and
gate definitions, but it does not satisfy the release/submission gates.
