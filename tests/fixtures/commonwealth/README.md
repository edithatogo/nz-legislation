# Commonwealth fixture inventory

Commonwealth runtime support is not enabled from these fixtures. This directory
is reserved for official Federal Register of Legislation API-shaped captures
that can replace the inline Commonwealth unit-test fixtures once the provider
runtime gate is ready.

Do not add placeholder legal data. Fixtures must be captured from official
source responses or documents, reviewed for licensing/provenance, and sanitized
only where that does not change the API shape being tested.

## Fixture categories still needed

Capture representative official API-shaped fixtures for:

- title search responses
- title-by-id responses
- version/history responses
- document, content, and download responses or metadata
- not-found and invalid-request responses
- rate-limit and transient error responses

The current Commonwealth unit tests use inline fixtures in the test files. Those
fixtures are useful for mapping coverage, but they are not a substitute for this
official fixture set.

## Capture evidence fields

Each live smoke-test capture should include opt-in evidence in adjacent notes or
metadata:

- capture date and time
- operator or automation identifier
- request URL, query parameters, and method
- response status, content type, and relevant headers
- fixture filename and SHA-256 digest
- source API version or OpenAPI document reference, when visible
- rate-limit headers, retry-after values, or observed throttling behavior

Live capture must be opt-in and should use conservative request counts. Stop on
rate-limit responses, preserve the response shape for testing, and do not retry
aggressively against the official service.
