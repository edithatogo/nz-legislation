# Australian Source Inventory

This inventory records official source surfaces located for planned Australian
providers. It is a roadmap control only. It does not mark any provider as
runtime-supported, source-backed, or release-ready.

## Inventory

| Jurisdiction                 | Located official source                                                               | Current interpretation                                                                                                                                                                                    | Runtime status |
| ---------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Australian Commonwealth      | Federal Register of Legislation public API, `https://api.prod.legislation.gov.au/v1/` | Source validation is recorded separately in `commonwealth-source-validation.md`. A mapping and injected client wrapper exist, but runtime routing is still disabled.                                      | Unsupported    |
| Queensland                   | Queensland Legislation API service, `https://www.legislation.qld.gov.au/api`          | Source validation is recorded separately in `queensland-source-validation.md`. Official API exists, requires registration, documents a base URL, points to Swagger, and returns JSON, XML, HTML, and PDF. | Unsupported    |
| New South Wales              | NSW legislation XML export, `https://legislation.nsw.gov.au/help/export`              | Source validation is recorded separately in `nsw-source-validation.md`. Official XML and bulk export routes exist for In force and Repealed collections, including JSON listing output for export URLs.   | Unsupported    |
| Victoria                     | Victorian legislation website, `https://www.legislation.vic.gov.au/`                  | Source validation is recorded in `state-territory-source-validation.md`. Official primary source located; machine-readable discovery remains required.                                                    | Unsupported    |
| South Australia              | South Australian Legislation website, `https://legislation.sa.gov.au/`                | Source validation is recorded in `state-territory-source-validation.md`. Official source located with browse, search, index, legislation lists, and a CC BY 4.0 site-content notice.                      | Unsupported    |
| Western Australia            | Western Australian Legislation website, `https://www.legislation.wa.gov.au/`          | Source validation is recorded in `state-territory-source-validation.md`. Official source located with Acts, subsidiary legislation, legislation information, gazettes, search, and notification feeds.    | Unsupported    |
| Tasmania                     | Tasmanian Legislation Online, `https://www.legislation.tas.gov.au/`                   | Source validation is recorded in `state-territory-source-validation.md`. Official source located with free public access, consolidated and as-made legislation, point-in-time coverage, and search.       | Unsupported    |
| Australian Capital Territory | ACT Legislation Register, `https://www.legislation.act.gov.au/`                       | Source validation is recorded in `state-territory-source-validation.md`. Official authorised electronic statute book located; PDF authoritative status remains an adapter design constraint.              | Unsupported    |
| Northern Territory           | Northern Territory legislation website, `https://legislation.nt.gov.au/`              | Source validation is recorded in `state-territory-source-validation.md`. Official source located with Bills, Acts, subordinate legislation, legislation information, gazettes, search, and archive paths. | Unsupported    |

## Gates before provider implementation

1. Re-check the current official source page and terms immediately before
   implementation work starts.
2. Record access requirements, rate limits, licence terms, authoritative format,
   and update cadence.
3. Add provider-specific fixtures from real official-source responses or
   documents.
4. Keep capability manifest entries unsupported until the provider maps search,
   work, version, export, citation, and MCP behavior without placeholder legal
   data.
5. Add source cards/provenance metadata before public docs, package metadata,
   website, MCP registry, IDE, or marketplace claims.
