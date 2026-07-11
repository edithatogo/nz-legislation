# ACT provider readiness

The ACT provider remains `unsupported`. This record captures the official ACT
Legislation Register source shape for a future adapter without enabling runtime
search, retrieval, export, MCP, publication, or stable support claims.

## Source-backed discovery

The [ACT Legislation Register](https://www.legislation.act.gov.au/) is the
authoritative source entry point. The register describes authorised current
republications as PDF, while Word copies are provided for convenience and are
not authorised. HTML is a search and reading representation. The register
contains Acts, subordinate laws, disallowable and notifiable instruments,
commencement notices, Assembly resolutions, bills, notifications, and related
material.

Identifiers include `A1900-40` for Acts, `SL2023-21` for subordinate laws,
`DI2023-...`, `NI2025-686`, `CN...`, `AR...`, and `AF...` classes. Current
versions expose effective dates, republication numbers, and law-history or
commencement cues. Pre-12 September 2001 coverage is explicitly incomplete.

The complete machine-readable record is
[`act-provider-source-shape.json`](./act-provider-source-shape.json).

## Adapter boundary

- Search, retrieval, version handling, export, and MCP remain runtime
  unsupported until a machine-readable contract and source-backed parser are
  verified.
- Authorised PDF is the legal authority; Word and HTML must never be promoted
  to equivalent authority without explicit provenance.
- Any future output must carry jurisdiction, source authority, source URL,
  format, authority status, and retrieval timestamp.
- Unsupported operations must use the existing structured
  `unsupported_provider_capability` response.

No ACT legal text is stored in this repository by this track.
