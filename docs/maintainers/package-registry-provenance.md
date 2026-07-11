# Package registry provenance contract

This repository prepares npm, GitHub Packages, and GitHub Release artifacts but
does not publish them by default. Publication requires explicit authorization
after every blocking release gate passes.

## npm

- Stable package identity: `nz-legislation-tool`.
- Stable support claim: New Zealand only.
- Release workflows must use npm provenance (`id-token: write` and
  `npm publish --provenance`) and the guarded publish switch.
- The local package remains private until release authorization is granted.

## GitHub Packages

- The mirror workflow requires `packages: write`, `GITHUB_TOKEN`, and the
  scoped `@edithatogo/nz-legislation-tool` manifest.
- It runs the no-placeholder, capability, provider-aware, metadata, docs,
  snippets, security/provenance, and release-note gates before publication.
- A private package exits successfully without publication; this is a gated
  readiness result, not a publication claim.

## GitHub Releases

- Release notes must distinguish NZ stable support from Australian prerelease or
  planned support.
- Release artifacts must identify the exact package version, commit, provenance,
  and checksums before any release is published.
- No release or tag is created by this readiness contract.
