# Australian Commonwealth source validation

Validated on 2026-05-20 against the Federal Register of Legislation public
documentation and OpenAPI description.

## Official source

- Register: `https://www.legislation.gov.au`
- Data reuse/API guidance:
  `https://www.legislation.gov.au/help-and-resources/using-the-legislation-register/data-share-and-reuse`
- API endpoint: `https://api.prod.legislation.gov.au/v1/`
- Swagger UI: `https://api.prod.legislation.gov.au/swagger/index.html`
- OpenAPI JSON: `https://api.prod.legislation.gov.au/swagger/v1/swagger.json`

## Verified facts

- The Federal Register of Legislation is the authorised whole-of-government
  website for Commonwealth legislation and related documents.
- The Register API is a REST-style API using OpenAPI v3.0.1.
- The API returns JSON and documents.
- The API is free and does not require API keys.
- The published OpenAPI document exposes source-backed endpoints for titles,
  versions, documents, departments, agencies, portfolios, searches, and content
  document downloads.
- The API is live, but the Register notes that it may change as the service is
  enhanced.

## Current repository posture

The source is validated and Commonwealth runtime support is enabled only as a
source-backed prerelease surface for search, get-work, versions, export, and
MCP. Citation and single-version retrieval remain unsupported and must continue
returning structured `unsupported_provider_capability` responses.

## Implementation requirements

Before any expanded Commonwealth runtime support claim:

1. Add a Federal Register API client using `https://api.prod.legislation.gov.au/v1/`.
2. Map OpenAPI `Title`, `Version`, and `Document` records into repository models.
3. Implement provider-aware search, get-work, versions, export, and MCP paths
   without falling back to New Zealand data.
4. Add no-placeholder tests using official API-shaped fixtures.
5. Add live smoke tests that are opt-in and rate-limit respectful.
6. Update website/docs and release notes to distinguish NZ stable support from
   Commonwealth prerelease support.
7. Keep citation and single-version retrieval unsupported until official source
   mapping, fixtures, tests, provenance, and release gates cover those features.
