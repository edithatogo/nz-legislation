# State and Territory Source Validation

Validated on 2026-05-21 against official source websites for Victoria, South
Australia, Western Australia, Tasmania, the Australian Capital Territory, and
the Northern Territory.

This record validates official source locations only. It does not validate a
machine-readable API shape, runtime adapter, or release-ready provider for any
of these jurisdictions.

## Official sources

| Jurisdiction                 | Official source                       | Validated source facts                                                                                                                                                                                                                                        | Remaining blocker                                                                                                 |
| ---------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Victoria                     | `https://www.legislation.vic.gov.au/` | The site describes itself as the primary source for Victorian legislation and exposes in-force, as-made, bills, repealed/revoked, legislative information, search, authorised PDF, and version history surfaces.                                              | Determine stable machine-readable list/detail/download routes and authoritative document formats.                 |
| South Australia              | `https://legislation.sa.gov.au/`      | The site exposes Acts, regulations and rules, policies, proclamations and notices, bills, indexes, legislation lists, and a CC BY 4.0 site-content notice except where otherwise noted.                                                                       | Determine whether browse/search/list pages can supply stable fixtures and authoritative downloadable formats.     |
| Western Australia            | `https://www.legislation.wa.gov.au/`  | The site exposes Acts, subsidiary legislation, legislation information, government gazettes, text search, notification feeds, and parliamentary bills links.                                                                                                  | Determine stable machine-readable paths for acts, subsidiary legislation, reprints, gazettes, and search results. |
| Tasmania                     | `https://www.legislation.tas.gov.au/` | The site provides free public access, consolidated and as-made Acts and statutory rules, point-in-time searching, browse paths, search, and current update lists.                                                                                             | Determine stable machine-readable list/detail/download routes and licence requirements.                           |
| Australian Capital Territory | `https://www.legislation.act.gov.au/` | The register is an authorised electronic statute book. Authorised versions are PDF documents; Word versions are unauthorised but available for search/copying. The register exposes browse/search, notifications, gazettes, and point-in-time republications. | Treat authoritative PDF status as a design constraint and determine stable metadata/download routes.              |
| Northern Territory           | `https://legislation.nt.gov.au/`      | The site exposes Bills, Acts, subordinate legislation, legislation information, gazettes, advanced search, notification account paths, and archives for past in-force dates.                                                                                  | Determine stable machine-readable list/detail/download routes and terms of use.                                   |

## Current repository posture

These jurisdictions remain unsupported in runtime code. The provider capability
manifest must continue returning structured `unsupported_provider_capability`
responses for `au-vic`, `au-sa`, `au-wa`, `au-tas`, `au-act`, and `au-nt`.

## Implementation requirements

Before any runtime support claim for these jurisdictions:

1. Re-check the current official source and terms immediately before
   implementation starts.
2. Identify authoritative formats and distinguish authorised PDF documents from
   convenience formats such as Word, HTML, or search result text.
3. Capture real source fixtures for list, detail, version/history, and document
   download paths.
4. Add provider-specific mapping tests and no-placeholder legal-data tests.
5. Add source cards/provenance metadata for CLI, MCP, and export outputs.
6. Keep release notes explicit that NZ is stable and Australian support remains
   prerelease until all provider gates pass.
