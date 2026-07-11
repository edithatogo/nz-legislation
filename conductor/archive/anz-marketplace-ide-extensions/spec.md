# Spec: IDE Extension Marketplaces

## Scope

Prepare VS Code Marketplace, Open VSX, and JetBrains extension contracts without
implementing or submitting an extension.

## Requirements

- Define extension scope, permissions, command invocation, and package metadata
  before implementation.
- Keep VS Code Marketplace and Open VSX as separate publication paths.
- Keep JetBrains as readiness-only until extension scope is justified.

## Contracts

- **Artifact:** extension plans must define permissions, snippets, package
  metadata, provider capability, and security expectations.
- **Submission:** no IDE marketplace submission until extension safety,
  provenance, docs, and snippet gates pass.
- **Claims:** marketplace copy must preserve compatibility names and avoid
  unsupported Australian support claims.
