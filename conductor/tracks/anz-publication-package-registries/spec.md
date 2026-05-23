# Spec: Package Registries and GitHub Releases

## Scope

Prepare npm, GitHub Packages, ANZ alias, prerelease, and GitHub Release
contracts without publishing or creating releases.

## Requirements

- Preserve stable package and binary compatibility names.
- Keep ANZ aliases transitional until migration policy changes.
- Verify package metadata, provenance, install snippets, and release notes
  before any publication.
- Keep GitHub Packages and GitHub Releases aligned with npm capability claims.

## Contracts

- **Artifact:** package metadata, `bin` entries, README, changesets, release
  notes, and provenance must match provider capability.
- **Submission:** no npm publish, GitHub Packages publish, or GitHub Release
  until all release gates pass.
- **Claims:** stable claims are NZ-only unless a provider is promoted through
  all gates.
