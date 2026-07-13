# Northern Territory Source Validation

Validated on 2026-07-13 against the official Northern Territory legislation
website.

## Official source

- Website and current legislation: <https://legislation.nt.gov.au/en>
- Acts and legislation browse surfaces: <https://legislation.nt.gov.au/en/LegislationPortal/Legislation/By-Title>
- Subordinate legislation by year: <https://legislation.nt.gov.au/en/LegislationPortal/Subordinate-Legislation/By-Year>
- Superseded reprints: <https://legislation.nt.gov.au/LegislationPortal/Superseded-Reprints>
- Help and collection definitions: <https://legislation.nt.gov.au/Footer/Help>

## Verified facts

- The official site provides Acts and subordinate legislation in force today,
  archives for past in-force dates, Bills, enacted Acts, and subordinate
  legislation as made.
- Browse surfaces expose title, year, parent-Act, status, Gazette, notification,
  commencement, reprint, and history cues.
- The site also exposes legislation information, gazettes, and Hansard
  collections.
- A public machine-readable API or feed was not verified in this discovery pass.

## Current repository posture

The source surface is recorded as a metadata-only provider candidate. No legal
records are stored in this repository, and the capability manifest must continue
returning structured `unsupported_provider_capability` responses for `au-nt`
until format authority, terms, stable routes, fixtures, provenance, and tests
are reviewed.

Before any runtime support claim, capture the current source contract, resolve
authoritative format precedence, add source-shaped fixtures without legal text,
and add opt-in live checks that respect official access terms.
