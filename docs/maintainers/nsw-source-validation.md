# NSW Source Validation

Validated on 2026-05-21 against the NSW legislation export documentation and
NSW Parliamentary Counsel's Office access guidance.

## Official source

- NSW legislation website: `https://legislation.nsw.gov.au/`
- XML/export help: `https://legislation.nsw.gov.au/help/export`
- Access guidance:
  `https://pco.nsw.gov.au/accessing-legislation.html`

## Verified facts

- The NSW legislation website is identified by the NSW Parliamentary Counsel's
  Office as the official NSW government site for online access to NSW
  legislation and as the authoritative source for New South Wales legislation.
- XML files are available for all versions in the In force and Repealed
  collections, including historical versions of titles.
- Current and historical single-title XML URLs follow documented
  `view/html/.../xml` URL patterns.
- Bulk XML data can be accessed through export query URLs.
- Standard export queries include day and week update windows.
- Custom export queries support documented fields such as type, year, number,
  title, repealed status, last updated, and point-in-time validity.
- Export listings can return JSON by appending `?format=json`.
- The XML data reflects progressively updated In force and Repealed pages, and
  the export help asks automated users to run scripted processing outside normal
  NSW business hours.

## Current repository posture

The NSW source surface is validated as an official XML/export candidate, but no
runtime support is enabled. It should be treated as an export/download surface
until adapter work proves whether it can satisfy search, get-work, version,
citation, export, and MCP contracts without falling back to New Zealand data.

The provider capability manifest must continue returning structured
`unsupported_provider_capability` responses for `au-nsw`.

## Implementation requirements

Before any NSW runtime support claim:

1. Design a source adapter around the XML/export surface instead of assuming a
   conventional JSON search API.
2. Capture representative XML and JSON-listing fixtures from official export
   URLs.
3. Record licence terms, update cadence, automation timing expectations, and
   authoritative formats.
4. Map official XML/export records into repository `Work`, `Version`, export,
   and MCP contracts without placeholder legal data.
5. Add no-placeholder tests using official source fixtures.
6. Add opt-in live smoke tests that run outside normal NSW business hours when
   practical.
7. Update docs and release notes to distinguish NZ stable support from NSW
   prerelease support.
