# Western Australia provider readiness

The Western Australia provider remains `unsupported`. This record captures
official source entry points for a future adapter without enabling runtime
search, retrieval, export, MCP, publication, or stable support claims.

The [Western Australian Legislation website](https://www.legislation.wa.gov.au/)
is the official legislation entry point and hosts Western Australian Government
Gazettes. The [WA Government Gazette page](https://www.wa.gov.au/government/publications/government-gazette)
describes the publication role; it must not be conflated with legislation records.

Machine-readable formats, identifiers, authoritative document formats, licensing,
and version semantics were not verified in this discovery pass. The complete
bounded record is in [`wa-provider-source-shape.json`](./wa-provider-source-shape.json).

Search, retrieval, version handling, export, and MCP remain runtime unsupported
until a machine-readable contract and source-backed parser are verified. A
future adapter must distinguish legislation from Gazette notices and carry
source authority and format status in provenance. Unsupported operations must
use the existing structured `unsupported_provider_capability` response.

No Western Australia legal text is stored in this repository by this track.
