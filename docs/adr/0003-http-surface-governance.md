# ADR 0003: Govern any future HTTP/OpenAPI surface through the prerelease lane first

## Status

Accepted

## Context

The project may add an AI-facing HTTP adapter in the future for GPT Actions,
Gemini, LangChain, LlamaIndex, and similar systems.

That surface would become a new public contract alongside:

- the CLI
- the MCP server

The repository now has a stable release line and a governed prerelease lane.
Any new HTTP surface needs an explicit entry rule so it does not bypass the
existing contract and release model.

## Decision

Any future HTTP/OpenAPI surface must:

- start on the `next` prerelease branch
- ship behind the governed prerelease workflow and `next` dist-tag
- publish an automatically generated OpenAPI schema
- add contract tests for routes, schemas, and stable response metadata before
  stable promotion
- undergo explicit SemVer review before moving to `main`

## Consequences

### Positive

- new external surfaces cannot bypass the prerelease lane
- OpenAPI becomes a governed contract rather than ad hoc implementation detail
- HTTP work is evaluated for CLI and MCP compatibility before stable release

### Negative

- future adapter work has a higher governance burden
- prerelease validation work must be completed before stable promotion
