# Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) for versioning and releases.

## How to Add a Changeset

When making changes, run:

```bash
pnpm changeset
```

Follow the prompts to:

1. Select which packages changed (we have one package)
2. Choose version bump type (patch, minor, major)
3. Write a summary of changes

## Version Types

- **patch** (x.x.X) - Bug fixes, small improvements
- **minor** (x.X.x) - New features, backward compatible
- **major** (X.x.x) - Breaking changes

## Release Process

Releases are automated:

1. Changesets are added to PRs
2. When merged to main, a Release PR is created
3. When Release PR is merged:
   - Version is bumped
   - CHANGELOG.md is updated
   - Package is published to npm
   - GitHub release is created

## Manual Release

```bash
# Version packages
pnpm version

# Publish
pnpm release
```
