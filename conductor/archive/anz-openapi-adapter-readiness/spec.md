# Spec: OpenAPI Adapter Readiness

## Scope

Record readiness requirements for a future repository-owned HTTP/OpenAPI
adapter without creating a hosted service, package split, or separate repository.

## Requirements

- Defer any public API until CLI, MCP, export, provider capability, and source
  card contracts stabilize.
- Keep schemas generated from or checked against provider capabilities.
- Treat OpenAPI as a governed public contract only after route, schema,
  security, and compatibility tests exist.

## Contracts

- **Runtime:** no HTTP service or OpenAPI route is enabled by this track.
- **Schema:** future schemas must preserve provider-aware unsupported responses
  and source-card metadata.
- **Publication:** docs must not imply a hosted API or external service before
  deployment and security gates pass.
