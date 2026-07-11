# Multi-Git and Registry Mirror Readiness

Status: local workflow complete; external mirror and publication verification
blocked pending explicit credentials and release authorization.

## Mirror workflow contract

The mirror workflow runs on pushes to `main` and `master` and via manual
dispatch. It exits successfully without external writes unless all three
repository secrets are present:

- `GIT_MIRROR_URL`
- `GIT_MIRROR_SSH_PRIVATE_KEY`
- `GIT_MIRROR_KNOWN_HOSTS`

The pinned known-hosts secret is required. The workflow deliberately does not
call `ssh-keyscan` at runtime, preventing trust-on-first-use host-key injection.
The private key is written only to the ephemeral runner with mode 600. Force and
prune behavior is retained because the mirror is a replica, but the target URL,
host key, branch scope, and repository ownership require maintainer review.

## Registry redundancy contract

- npm publication remains controlled by the stable/prerelease release workflows
  and their release gates.
- GitHub Packages publication uses the package mirror workflow and
  `GITHUB_TOKEN`; it must not silently publish a package whose metadata or
  capability claims differ from npm.
- No package publication is authorized while `package.json` is private or while
  release, provenance, install, capability, and security gates are incomplete.
- Verification must record exact package name, version, registry URL, digest or
  tarball evidence, and the clean-host install result.

## Current evidence

- Workflow file exists and has push/manual triggers.
- Empty-secret skip path is implemented.
- Known-host pinning is required before any mirror write.
- Repository secret inventory currently lacks all three mirror secrets.
- Package publication cannot be verified from this checkout while the package is
  private and no explicit release authorization exists.
