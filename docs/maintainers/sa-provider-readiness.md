# South Australia provider readiness

The South Australia provider remains `unsupported`. This record captures
official source entry points for a future adapter without enabling runtime
search, retrieval, export, MCP, publication, or stable support claims.

## Source-backed discovery

The [South Australian Legislation website](https://www.legislation.sa.gov.au/)
is the official legislation entry point. The [South Australian Government
Gazette](https://governmentgazette.sa.gov.au/) is a separate official
publication surface and must not be conflated with legislation records.

Machine-readable formats, identifier patterns, authoritative document formats,
licensing details, and version semantics were not verified in this discovery
pass. The complete bounded record is in
[`sa-provider-source-shape.json`](./sa-provider-source-shape.json).

## Adapter boundary

- Search, retrieval, version handling, export, and MCP remain runtime
  unsupported until a machine-readable contract and source-backed parser are
  verified.
- A future adapter must distinguish legislation from Gazette notices and carry
  source authority and format status in provenance.
- Unsupported operations must use the existing structured
  `unsupported_provider_capability` response.

No South Australia legal text is stored in this repository by this track.
