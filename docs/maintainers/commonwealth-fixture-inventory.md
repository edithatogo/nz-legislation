# Commonwealth Fixture Inventory

This inventory records the fixture preparation still required before Australian
Commonwealth runtime support can be enabled. It is a maintainer checklist only;
it does not change the current unsupported runtime posture.

The Commonwealth source validation identifies the Federal Register of
Legislation public API as the official source candidate. Current unit tests use
inline Commonwealth fixtures for client, adapter, and mapping coverage. Before
runtime support is enabled, those inline examples must be backed by captured
official API-shaped fixtures with provenance evidence and without placeholder
legal data.

## Required fixture categories

| Category                         | Required coverage                                                                                           | Status |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------ |
| Title search                     | Search/list responses with representative query, status, type, pagination, and empty-result shapes.         | Needed |
| Title by id                      | Single-title lookups for current, repealed, and invalid identifiers where the API exposes those shapes.     | Needed |
| Versions                         | Version/history responses that cover current, historical, and as-made metadata returned by the API.         | Needed |
| Documents, content, and download | Document metadata plus any supported content or download response shapes for HTML, PDF, XML, or other URLs. | Needed |
| Not-found and invalid responses  | Official 404, empty API value, validation, malformed query, and unsupported-parameter response shapes.      | Needed |
| Rate-limit and error responses   | Throttling, retry, service error, and transient failure shapes, including headers where available.          | Needed |

## Fixture rules

- Fixtures must come from official Federal Register of Legislation responses,
  documents, or metadata.
- Do not fabricate Acts, titles, versions, identifiers, dates, URLs, or document
  content.
- Redaction is allowed only for operational metadata that is not legal data
  and only when the original API shape remains clear.
- Keep Commonwealth runtime support gated until these fixtures are reviewed,
  wired into tests, and checked against the provider capability manifest.
- Keep the existing inline unit-test fixtures until official fixtures are ready
  to replace or supplement them.

## Opt-in live smoke-test evidence

Live capture should be explicitly opt-in because it contacts an official public
service. For each smoke-test run, record:

- opt-in flag or command used to permit live access
- capture date and time
- operator, CI job, or automation identifier
- base URL, endpoint path, method, and query parameters
- response status code, content type, and relevant cache/provenance headers
- rate-limit headers, retry-after headers, or observed throttling behavior
- fixture path, byte size, and SHA-256 digest
- OpenAPI document version or retrieval date used to interpret the response
- notes on any redaction applied

Use conservative request counts and stop when the service returns rate-limit or
retry-after signals. Do not use fixture capture to crawl the service broadly.
The goal is a small, representative, source-backed test set that proves API
shape handling without placing load on the official source.
