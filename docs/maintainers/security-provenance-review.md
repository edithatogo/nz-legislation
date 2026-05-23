# Security and Provenance Review

This review is a blocking release/submission gate for package publishing,
website deployment, registry submission, marketplace listing, Docker/GHCR,
Homebrew, assistant integration, IDE extension, and any other external
publication surface.

## Current verdict

Status: blocked for external submission and publication until a release owner
records target-specific evidence for the channel being released.

The repository may prepare tracks, docs, manifests, and local validation gates,
but this document does not authorize publication, deployment, marketplace
submission, registry submission, package renaming, repository renaming, or a Rust
rewrite.

## Required evidence

For each release or submission channel, record:

| Evidence area           | Required evidence                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Package provenance      | npm trusted publishing or `npm publish --provenance`, GitHub Packages provenance notes, package name, version, registry, and tag.                                                          |
| Workflow permissions    | GitHub Actions permissions are least-privilege for the channel and reviewed before publish.                                                                                                |
| Release automation      | Release workflows run typecheck, tests, build, no-placeholder legal data, Conductor requirements, manifest/docs drift, install snippets, and this security/provenance gate before publish. |
| Dependency posture      | `pnpm audit` or GitHub dependency review result is recorded, with accepted residual risk documented.                                                                                       |
| Secret handling         | API keys, npm tokens, GitHub tokens, MCP host secrets, and assistant/IDE credentials are not committed and are stored through host-appropriate secret storage.                             |
| Generated artifacts     | Generated files, bundled outputs, packages, archives, images, formulae, and listing metadata are reproducible or reviewed before release.                                                  |
| Listing claims          | README, docs, package metadata, registry copy, marketplace text, and release notes match the provider capability manifest.                                                                 |
| Legal-data truthfulness | No placeholder legal data is exposed as real support; unsupported providers return structured unsupported capability errors.                                                               |
| Prompt/tool safety      | MCP and assistant integration docs describe provider limits, avoid shell/file-system expansion claims, and do not expose community plugin loading without a trust model.                   |

## Channel review checklist

- [ ] npm stable package
- [ ] npm prerelease package
- [ ] GitHub Packages mirror
- [ ] GitHub Releases
- [ ] website/docs deployment
- [ ] MCP generic host docs
- [ ] Smithery and other MCP directories
- [ ] Claude integration
- [ ] Codex integration
- [ ] GitHub Copilot integration
- [ ] Gemini integration
- [ ] Qwen integration
- [ ] VS Code Marketplace
- [ ] Open VSX
- [ ] JetBrains Marketplace
- [ ] Docker/GHCR
- [ ] Homebrew

Mark channels not included in the release as not applicable in the release PR.

## Security posture notes

- Stable support remains New Zealand only unless a provider-specific promotion
  passes all gates.
- Australian Commonwealth support is prerelease and source-backed only for the
  capabilities listed in the provider capability manifest.
- Remaining Australian providers are planned until source validation, runtime,
  provenance, docs, install, and release gates pass.
- Public listing copy must not claim unsupported Australian coverage.
- External submissions must be rechecked against the current target-specific
  submission rules immediately before submission.
