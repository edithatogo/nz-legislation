# Plan: Package Registries and GitHub Releases

## Phase 1: Contract registration

**Status:** Complete for local publication readiness; external publication remains gated.

- [x] Add package registry contracts to `conductor/requirements.md`.
- [x] Add this Conductor track.
- [x] Add release-note checks that reject premature Australian stable-support
      claims and require prerelease/planned language for AU-scoped changesets.
- [x] Add package metadata checks that preserve package identity, stable command
      names, transitional ANZ aliases, and NZ-stable/AU-prerelease claims.

## Phase 2: Publication readiness

**Status:** Complete for local readiness.

- [x] Verify npm stable and prerelease metadata.
- [x] Verify GitHub Packages provenance expectations.
- [x] Verify GitHub Release note template distinguishes NZ stable from AU
      prerelease support.

## Validation evidence

- Package metadata, release notes, and security/provenance gates passed.
- GitHub Packages provenance contract is documented in `docs/maintainers/package-registry-provenance.md`.
- No package or GitHub Release was published.
