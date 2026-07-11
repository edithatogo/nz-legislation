# Provider API Roadmap

This roadmap records candidate legal-data providers and APIs for future runtime
work. It distinguishes stable, prerelease, planned, and source-validation
required surfaces. Every expanded provider claim remains source-validation
required until current official documentation, access terms, coverage, rate
limits, and data quality are verified.

## Policy

- Prefer official source APIs or official source downloads before aggregator
  APIs.
- Use aggregators only when official sources are absent, incomplete, or needed
  for cross-jurisdiction discovery.
- Do not expose placeholder legal data as real support.
- Add provider capability manifest entries before enabling CLI, MCP, export,
  docs, website, or listing claims.
- Return structured unsupported capability errors for incomplete providers.
- Keep API keys and tokens out of repository content and route them through
  host-safe secret storage.

## Candidate API/provider backlog

| Jurisdiction/scope                   | Candidate source or API                                                   | Priority | Status                                                                                                            | Roadmap action                                                                                                             |
| ------------------------------------ | ------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| New Zealand                          | Existing legislation.govt.nz-backed NZ provider surface                   | P0       | Stable compatibility surface; verify current docs before new release claims                                       | Keep `nz-legislation-tool`, `nzlegislation`, and `nzlegislation-mcp` stable while capability manifest is added.            |
| Australian Commonwealth              | Federal Register of Legislation public API and OpenAPI document           | P0       | Source-backed prerelease for search, get-work, versions, export, and MCP; citation and single-version unsupported | Finish provenance, fixtures, release gates, and unsupported-feature coverage before any stable claim.                      |
| Queensland                           | Queensland Legislation API service                                        | P0       | Source surface validated; account registration, Swagger capture, and test fixtures still required                 | Replace empty/stub Queensland provider behavior with source-backed support or explicit unsupported errors.                 |
| New South Wales                      | NSW legislation XML export and bulk download surface                      | P1       | Source surface validated; XML/export adapter shape still required                                                 | Add export/download adapter spike, access review, capability manifest entry, and provider tests before runtime enablement. |
| Victoria                             | Victorian legislation website                                             | P1       | Official source surface validated; machine-readable source shape still required                                   | Add discovery spike, access review, capability manifest entry, and provider tests before runtime enablement.               |
| South Australia                      | South Australian Legislation website                                      | P1       | Official source surface validated; machine-readable source shape still required                                   | Add discovery spike, access review, capability manifest entry, and provider tests before runtime enablement.               |
| Western Australia                    | Western Australian Legislation website                                    | P1       | Official source surface validated; machine-readable source shape still required                                   | Add discovery spike, access review, capability manifest entry, and provider tests before runtime enablement.               |
| Tasmania                             | Tasmanian Legislation Online                                              | P1       | Official source surface validated; machine-readable source shape still required                                   | Add discovery spike, access review, capability manifest entry, and provider tests before runtime enablement.               |
| Australian Capital Territory         | ACT Legislation Register                                                  | P1       | Official source surface validated; machine-readable source shape still required                                   | Add discovery spike, access review, capability manifest entry, and provider tests before runtime enablement.               |
| Northern Territory                   | Northern Territory legislation website                                    | P1       | Official source surface validated; machine-readable source shape still required                                   | Add discovery spike, access review, capability manifest entry, and provider tests before runtime enablement.               |
| Cross-jurisdiction Australian search | AustLII or other lawful aggregator surfaces                               | P2       | Source-validation-required                                                                                        | Evaluate as discovery/provenance aid only; do not use to bypass official-source-first policy.                              |
| Citation and metadata enrichment     | Wikidata, schema.org, citation resolvers, and other open metadata sources | P2       | Source-validation-required                                                                                        | Use only as supplemental metadata after source authority and provenance are explicit.                                      |
| Future HTTP/OpenAPI adapter          | Repository-owned API adapter generated from provider capability manifest  | P2       | Not started                                                                                                       | Keep as a distribution/integration surface after CLI/MCP/export contracts stabilize.                                       |

## Required implementation sequence

1. Verify current official source documentation and access terms.
2. Record the candidate in the provider capability manifest as unsupported,
   prerelease, or supported.
3. Implement provider routing with no placeholder output.
4. Add provider-specific unit/integration tests and no-placeholder tests.
5. Add MCP/export source cards and provenance metadata.
6. Update docs, website, install snippets, and release notes.
7. Pass the release/submission gates before any public claim or listing.

## Provider implementation tracks

| Jurisdiction/scope           | Track                                               |
| ---------------------------- | --------------------------------------------------- |
| Australian Commonwealth      | `conductor/tracks/anz-provider-commonwealth/`       |
| Queensland                   | `conductor/tracks/anz-provider-queensland/`         |
| New South Wales              | `conductor/tracks/anz-provider-nsw/`                |
| Victoria                     | `conductor/tracks/anz-provider-victoria/`           |
| South Australia              | `conductor/tracks/anz-provider-south-australia/`    |
| Western Australia            | `conductor/tracks/anz-provider-western-australia/`  |
| Tasmania                     | `conductor/tracks/anz-provider-tasmania/`           |
| Australian Capital Territory | `conductor/tracks/anz-provider-act/`                |
| Northern Territory           | `conductor/tracks/anz-provider-northern-territory/` |

## Current import verdict

The v9 import did not implement these APIs by itself. Subsequent single-repo
work has enabled Commonwealth as source-backed prerelease for search, get-work,
versions, export, and MCP, while citation and single-version retrieval remain
unsupported. Queensland, NSW, and state/territory source validation records
confirm official source surfaces but remain planned or source-validation
required until provider routing, fixtures, provenance, and release gates land
inside the single repository.
