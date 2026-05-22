# ANZ Readiness Release Notes Draft

## Draft language

This PR prepares the repository for a future ANZ-capable release path while
preserving the current stable New Zealand legislation support.

New Zealand support remains the stable, supported runtime surface for the
existing packages, CLIs, MCP server, exports, and compatibility aliases.
Australian support is prerelease/planned only. Australian capability work in
this PR is readiness and gating work; it must not be described as stable
runtime support until source validation, provider capability, no-placeholder
legal-data, documentation, security, provenance, and release-submission gates
all pass.

No packages are published by this PR. No npm, marketplace, assistant, IDE,
container, Homebrew, or other registry submissions are made by this PR. No
public website deployment is made by this PR.

## Maintainer note

Future external release notes must keep the distinction between stable New
Zealand support and Australian prerelease/planned support. Claims about
Australian runtime support require passing release evidence in this repository
before publication or submission.
