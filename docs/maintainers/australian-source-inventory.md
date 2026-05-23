# Australian Source Inventory

This inventory records official source surfaces located for Australian providers.
It is a roadmap control only. Runtime status must match the provider capability
manifest and does not by itself authorize stable release claims.

## Inventory

| Jurisdiction                 | Located official source                                                               | Current interpretation                                                                                                                                                                                                                              | Runtime status |
| ---------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Australian Commonwealth      | Federal Register of Legislation public API, `https://api.prod.legislation.gov.au/v1/` | Source validation is recorded separately in `commonwealth-source-validation.md`. Runtime routing is enabled for source-backed prerelease search, get-work, versions, export, and MCP paths; citation and single-version support remain unsupported. | Prerelease     |
| Queensland                   | Queensland Legislation API service, `https://www.legislation.qld.gov.au/api`          | Source validation is recorded separately in `queensland-source-validation.md`. Official API exists, requires registration, documents a base URL, points to Swagger, and returns JSON, XML, HTML, and PDF.                                           | Planned        |
| New South Wales              | NSW legislation XML export, `https://legislation.nsw.gov.au/help/export`              | Source validation is recorded separately in `nsw-source-validation.md`. Official XML and bulk export routes exist for In force and Repealed collections, including JSON listing output for export URLs.                                             | Planned        |
| Victoria                     | Victorian legislation website, `https://www.legislation.vic.gov.au/`                  | Source validation is recorded in `state-territory-source-validation.md`. Official primary source located; machine-readable discovery remains required.                                                                                              | Planned        |
| South Australia              | South Australian Legislation website, `https://legislation.sa.gov.au/`                | Source validation is recorded in `state-territory-source-validation.md`. Official source located with browse, search, index, legislation lists, and a CC BY 4.0 site-content notice.                                                                | Planned        |
| Western Australia            | Western Australian Legislation website, `https://www.legislation.wa.gov.au/`          | Source validation is recorded in `state-territory-source-validation.md`. Official source located with Acts, subsidiary legislation, legislation information, gazettes, search, and notification feeds.                                              | Planned        |
| Tasmania                     | Tasmanian Legislation Online, `https://www.legislation.tas.gov.au/`                   | Source validation is recorded in `state-territory-source-validation.md`. Official source located with free public access, consolidated and as-made legislation, point-in-time coverage, and search.                                                 | Planned        |
| Australian Capital Territory | ACT Legislation Register, `https://www.legislation.act.gov.au/`                       | Source validation is recorded in `state-territory-source-validation.md`. Official authorised electronic statute book located; PDF authoritative status remains an adapter design constraint.                                                        | Planned        |
| Northern Territory           | Northern Territory legislation website, `https://legislation.nt.gov.au/`              | Source validation is recorded in `state-territory-source-validation.md`. Official source located with Bills, Acts, subordinate legislation, legislation information, gazettes, search, and archive paths.                                           | Planned        |

## Gates before provider implementation

1. Re-check the current official source page and terms immediately before
   implementation work starts.
2. Record access requirements, rate limits, licence terms, authoritative format,
   and update cadence.
3. Add provider-specific fixtures from real official-source responses or
   documents.
4. Keep capability manifest entries planned or unsupported until the provider
   maps search, work, version, export, citation, and MCP behavior without
   placeholder legal data. Commonwealth is the current prerelease exception for
   source-backed search, get-work, versions, export, and MCP paths.
5. Add source cards/provenance metadata before public docs, package metadata,
   website, MCP registry, IDE, or marketplace claims.
