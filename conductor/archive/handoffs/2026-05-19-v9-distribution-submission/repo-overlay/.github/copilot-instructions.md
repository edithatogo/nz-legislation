# Copilot instructions for ANZ Legislation

This repository is a legal-research CLI/MCP project.

## Rules

- Do not fabricate legal data.
- Return source-backed data or structured unsupported errors.
- Preserve backwards compatibility for `nz-legislation-tool`, `nzlegislation`, and `nzlegislation-mcp`.
- Keep all integrations in this repository.
- Do not create separate repos.
- Do not start a Rust rewrite.
- Use provider capability manifest as the source of truth.
- Keep MCP/export provider-aware.
- Include source/provenance metadata in legal outputs.
