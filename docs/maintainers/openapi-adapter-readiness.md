# OpenAPI adapter readiness

This repository records a future HTTP/OpenAPI contract without enabling an HTTP
service or implying a hosted API. The CLI and MCP transports remain the current
runtime surfaces.

## Existing response-contract inventory

| Existing surface                 | Contract source                                                         | Future adapter preservation requirement                                                                                 |
| -------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| CLI search/get/version commands  | `src/models/index.ts`, `src/client.ts`                                  | Preserve normalized `Work`, `Version`, `LegislationVersion`, and `SearchResults` shapes.                                |
| CLI export and citation commands | `src/output/index.ts`, `src/commands/export.ts`                         | Preserve reproducible `ExportMetadata`, citation styles, and provider provenance.                                       |
| MCP tools                        | `src/mcp/server.ts`                                                     | Preserve tool operation names, structured JSON text, and `isError` semantics.                                           |
| Provider capability discovery    | `src/providers/capability-manifest.ts`, `src/providers/source-cards.ts` | Derive availability and source-card metadata from the manifest; never infer support from route existence.               |
| Unsupported provider paths       | `src/providers/runtime.ts`                                              | Return `unsupported_provider_capability` with jurisdiction, provider, feature, status, source-backed flag, and message. |

The machine-readable route and security contract is
[`openapi-adapter-contract.json`](./openapi-adapter-contract.json). It is a
readiness artifact only; it is not an OpenAPI deployment document.

## Acceptance gates before implementation

1. Every route has runtime schemas and contract tests for success, validation,
   provider capability, and provenance boundaries.
2. The generated schema is checked against the provider capability manifest and
   source cards in CI.
3. Authentication, authorization, rate limiting, audit logging, HTTPS, and
   secret-redaction tests pass before any HTTP listener is enabled.
4. Compatibility tests cover stable NZ names and the ANZ transition aliases.
5. Documentation and release notes clearly state that the API is not hosted or
   publicly available until deployment and security gates pass.
