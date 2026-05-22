# MCP registry submission checklist

Use this checklist before submitting the MCP server to Smithery, mcp.so, MCP
Market, MCP Store, PulseMCP, Glama-style directories, npm discovery surfaces, or
any official/community MCP registry path. Record the evidence in
`integrations/mcp/submission-evidence-template.md` or in a copied submission
evidence file for the release candidate.

## Candidate targets

- Smithery
- mcp.so
- MCP Market
- MCP Store
- PulseMCP
- Glama-style directories
- official/community MCP registry path, if available
- npm discoverability

## Required before submission

- Provider-aware MCP server is enabled only for supported runtime providers.
- Provider capability snapshot shows NZ as stable and AU as planned or
  unsupported until separately enabled.
- Source-card snapshot documents the official source, provenance, update
  expectations, and limits for each advertised provider.
- Install snippet has been verified from a clean client configuration, including
  package name, command, arguments, environment variables, and expected startup
  result.
- Security and provenance review covers credential handling, dependency/package
  provenance, maintainer identity, data-source trust, and unsupported community
  loading.
- Listing wording keeps NZ stable support separate from AU planned wording and
  avoids implying live AU support before the runtime gate allows it.
- No-placeholder legal data gate passes for the release candidate.
- MCP stdio configuration has been tested with the packaged command and recorded
  with client name, platform, command output, and date.
- API-key docs are current.
- Listing copy is complete.

## Listing copy must include

- package name
- install command
- supported jurisdictions
- capability matrix link
- official-source-first statement
- clear NZ stable versus AU planned or unsupported wording
- license
- maintainer/contact

## Submission gate

Do not submit to any registry or directory until every required evidence item is
complete and reviewed. A prepared checklist or template is not submission
approval and must not be described as a completed submission.
