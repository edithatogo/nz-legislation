# Support Policy

## Purpose

This document defines which release lines are supported and how maintainers should think about fixes and user expectations.

## Supported Lines

### Stable line

The current stable line is the highest version published from `main` to npm `latest`.

Stable support includes:

- critical bug fixes
- regression fixes
- documentation corrections
- packaging and install fixes

### Prerelease line

The current prerelease line is the highest version published from `next` to npm `next`.

Prerelease support is best-effort and may include:

- breaking changes in progress
- incomplete next-major work
- temporary instability while validating future architecture

Prereleases are not guaranteed to remain backward compatible until promoted to stable.

## Support Expectations By Surface

### CLI

The stable CLI is a supported public surface. Breaking changes require a major version.

### MCP

The stable MCP surface is a supported public surface. Breaking changes to tool names, schemas, or documented behavior require a major version.

### Future HTTP/OpenAPI adapter

If released publicly, the HTTP adapter becomes a supported public surface subject to the same support and SemVer rules.

## Out of Scope

This support policy does not promise:

- indefinite support for old stable lines
- long-term support for prerelease builds
- support for private downstream modifications

## Maintainer Guidance

- Prefer fixing issues on the stable line first when they affect current users.
- Backport only when a user-facing stable issue justifies it.
- Do not treat prerelease instability as a stable-line incident unless it reproduces on `latest`.
