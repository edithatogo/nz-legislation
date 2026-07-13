# Tasmania Source Validation

Validated on 2026-07-13 against the official Tasmanian legislation and Gazette entry points.

## Official source

- Tasmanian Legislation Online: `https://www.legislation.tas.gov.au/`
- In-force legislation: `https://www.legislation.tas.gov.au/browse/inforce`
- Legislative tables: `https://www.legislation.tas.gov.au/tables`
- Tasmanian Government Gazette: `https://www.gazette.tas.gov.au/`
- Gazette edition search: `https://www.gazette.tas.gov.au/editions/search`

## Verified boundaries

- Tasmanian Legislation Online is the official source for current, historical,
  consolidated, and sessional legislation.
- HTML and PDF representations are published, with version and commencement
  history cues; Gazette publication is a separate official surface.
- A public machine-readable API or feed was not verified in this discovery pass.

## Current repository posture

Tasmania remains explicitly planned and unsupported. This change adds only
source metadata and no legal records. Runtime search, retrieval, version,
export, citation, and MCP operations remain blocked with structured
`unsupported_provider_capability` responses.

## Before enabling runtime support

1. Capture and review an official machine-readable contract, if one becomes available.
2. Add source-shaped fixtures, provenance assertions, and opt-in live smoke tests.
3. Reconfirm licensing, rate limits, version semantics, and Gazette boundaries.
4. Update release notes to distinguish NZ stable support from Tasmania gated support.
