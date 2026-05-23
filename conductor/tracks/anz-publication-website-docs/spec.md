# Spec: Website and Docs Publication

## Scope

Prepare website, documentation, install pages, capability tables, and `llms.txt`
without deploying any website.

## Requirements

- Align docs and install snippets with the provider capability manifest.
- Mark Commonwealth as prerelease and other Australian providers as planned or
  unsupported until their gates pass.
- Keep compatibility names and ANZ aliases clear in user-facing docs.

## Contracts

- **Artifact:** docs, website copy, install snippets, capability matrix, and
  `llms.txt` must match provider capability and release status.
- **Submission:** no website deployment until docs, snippets, security, and
  release-note gates pass.
- **Claims:** docs must distinguish NZ stable from Australian prerelease/planned
  support.
