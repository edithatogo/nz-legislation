# Spec: MCP Registry Directories

## Scope

Prepare Smithery and other MCP directory submissions without submitting to any
registry.

## Requirements

- Listing copy must reflect provider-aware MCP behavior.
- Config snippets must use packaged commands and tested stdio behavior.
- Unsupported providers must be documented as structured capability errors, not
  hidden fallbacks.

## Contracts

- **Artifact:** MCP listing metadata, config snippets, and registry evidence
  must match MCP runtime behavior.
- **Submission:** no Smithery or other MCP directory submission until provider,
  snippet, provenance, and listing-truthfulness gates pass.
- **Claims:** listings must not claim unsupported providers or fabricated legal
  data.
