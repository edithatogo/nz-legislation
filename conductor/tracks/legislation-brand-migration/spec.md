# Legislation Product Name Migration

## Goal

Adopt **legislation** as the jurisdiction-neutral product identity while
preserving every existing package and executable until an approved deprecation
policy permits retirement.

## Contract

- Product display name: legislation.
- Proposed neutral aliases: legislation and legislation-mcp.
- nz-legislation-tool, nzlegislation, and nzlegislation-mcp remain supported.
- anzlegislation and anzlegislation-mcp remain transition aliases.
- Package, repository, executable, documentation, and registry renames are
  separate gated decisions.
- Namespace availability must be verified live.

## Acceptance criteria

- A collision and ownership audit covers npm, GitHub, binaries, domains, MCP
  directories, and marketplaces.
- Neutral aliases are additive and have parity tests.
- Documentation distinguishes product identity from package identifiers.
- A support window, rollback plan, and explicit approval gate precede removal.
