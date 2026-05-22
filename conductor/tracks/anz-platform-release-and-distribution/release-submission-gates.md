# Release and Submission Gates

These gates block every future external publication, deployment, marketplace
submission, registry submission, and public listing created from this track.

| Gate                                          | Status   | Required evidence                                                                                                                    |
| --------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| No-placeholder legal data                     | BLOCKING | `pnpm gate:no-placeholder-legal-data` and review evidence show no placeholder Australian legal data is exposed as real support.      |
| Provider capability manifest                  | BLOCKING | A runtime manifest exists and records jurisdiction, provider, feature, and support status.                                           |
| Provider-aware MCP/export                     | BLOCKING | MCP tools and export paths check provider capability and return structured unsupported errors.                                       |
| Accurate package metadata                     | BLOCKING | `package.json`, README, registry metadata, binaries, aliases, and deprecation/prerelease language match runtime capability.          |
| Updated website/docs                          | BLOCKING | Website/docs install, capability, MCP, export, and ANZ transition pages match the manifest.                                          |
| Tested install snippets                       | BLOCKING | npm, npx, MCP stdio, GitHub Packages, Docker/GHCR, Homebrew, assistant, and IDE snippets are tested or explicitly marked unverified. |
| Security/provenance review                    | BLOCKING | Supply-chain, permissions, provenance, generated artifacts, release automation, and listing claims are reviewed.                     |
| NZ stable/Australian prerelease release notes | BLOCKING | Release notes clearly distinguish NZ stable support from Australian prerelease or planned support.                                   |

## Gate policy

- A channel cannot be submitted with a BLOCKING gate.
- A source-validation-required channel cannot be submitted until the release
  owner verifies the current official registry or marketplace submission guide,
  required metadata, authentication requirements, and review criteria.
- Public listing copy may only claim Australian runtime support after the
  no-placeholder legal-data and provider capability gates pass for that
  jurisdiction; external submission still requires every BLOCKING gate to pass.
- Compatibility aliases must be described as aliases while the ANZ transition is
  incomplete.
- Gate evidence must be committed in this repository before a release PR is
  considered ready.

## Current import verdict

The v9 import is still blocked from any external release or submission. It adds
the roadmap, integration folders, and gate definitions, and the current branch
also reflects Commonwealth source validation, client/mapping, adapter, and
provider registry progress, but it does not satisfy the release/submission
gates. Runtime provider gates now block unsupported providers through the
registry, and the blocked gates remain blocked until provider selection,
fixtures, docs, testing, provenance, and release-note work all pass.
