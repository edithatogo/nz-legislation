# Victoria Source Validation

Validated on 2026-07-13 against the official Victorian legislation and Gazette
entry points.

## Official source

- Victorian legislation: `https://www.legislation.vic.gov.au/`
- Legislation in force: `https://www.legislation.vic.gov.au/in-force`
- Repealed or revoked legislation: `https://www.legislation.vic.gov.au/repealed-revoked`
- Legislative information: `https://www.legislation.vic.gov.au/legislative-information`
- Victoria Government Gazette: `https://www.gazette.vic.gov.au/`

## Verified boundaries

- The Victorian legislation website is the primary official source for current
  and superseded Acts and statutory rules.
- The website provides separate in-force and repealed/revoked collections and
  publishes legislation in HTML and PDF representations.
- A public machine-readable API or feed was not verified in this discovery
  pass. The future adapter must not infer one from page markup or download
  links.
- The Victoria Government Gazette is a separate official publication surface;
  Gazette ingestion remains a separate gated capability.

## Current repository posture

Victoria remains explicitly planned and unsupported. No runtime search,
retrieval, version, export, citation, or MCP capability is enabled, and this
change adds no legal records. The provider must continue returning structured
`unsupported_provider_capability` responses until source-backed adapter
fixtures, provenance, and live-access evidence exist.

## Before enabling runtime support

1. Capture and review an official machine-readable contract, if one becomes
   available, without committing credentials or private access details.
2. Map authoritative formats, version history, licensing, and update cadence
   into the provider contracts.
3. Add source-shaped fixtures with no placeholder legal text and provenance
   assertions.
4. Add opt-in live smoke tests that respect Victorian source terms and rate
   limits.
5. Update release notes to distinguish NZ stable support from Victoria gated
   support.
