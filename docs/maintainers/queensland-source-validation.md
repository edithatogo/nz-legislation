# Queensland Source Validation

Validated on 2026-05-21 against the Queensland Legislation API service and
access agreement.

## Official source

- Website: `https://www.legislation.qld.gov.au/`
- API service page: `https://www.legislation.qld.gov.au/api`
- API base URL: `https://api.legislation.qld.gov.au/`
- API registration: `https://api.legislation.qld.gov.au/api/signup`
- API access agreement:
  `https://www.legislation.qld.gov.au/api/usage-guidelines`

## Verified facts

- The Queensland Legislation API is an official source created and developed by
  the State of Queensland through the Office of the Queensland Parliamentary
  Counsel.
- Access requires API account registration.
- The API service page identifies Swagger documentation at the API base URL.
- Response formats include JSON, XML, HTML, and PDF.
- Unless otherwise noted, content is licensed under CC BY 4.0 and remains
  subject to the Queensland Legislation copyright statement.
- The access agreement allows OQPC to change, suspend, rate-limit, restrict, or
  discontinue the API or parts of it.
- The agreement states that notes, annotations, and links are aids only and do
  not form part of the legislation.

## Current repository posture

The Queensland source surface is validated as an official API candidate, but no
runtime support is enabled. The provider capability manifest must continue
returning structured `unsupported_provider_capability` responses for `au-qld`
until access, Swagger shape, fixtures, provider mapping, provenance, and tests
are implemented in this repository.

## Implementation requirements

Before any Queensland runtime support claim:

1. Register for API access using repository-maintainer controlled credentials;
   do not commit credentials, tokens, or registration details.
2. Capture the current Swagger/OpenAPI shape from the API base URL.
3. Record rate limits, authentication mode, licence requirements, authoritative
   formats, and update cadence.
4. Map official API responses into repository `Work`, `Version`, export, and
   MCP contracts without placeholder legal data.
5. Add no-placeholder tests using official API-shaped fixtures.
6. Add opt-in live smoke tests that respect access terms and rate limits.
7. Update docs and release notes to distinguish NZ stable support from
   Queensland prerelease support.
