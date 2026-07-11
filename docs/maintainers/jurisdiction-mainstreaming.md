# Jurisdiction mainstreaming contract

The legislation product uses one provider-aware contract. Jurisdiction is
selected explicitly; unsupported or unverified providers never fall back to
New Zealand data. The machine-readable registry is
[`jurisdiction-source-registry.json`](./jurisdiction-source-registry.json).

The registry records source authority, access state, release maturity, and
licence-review state for every NZ and Australian lane. `unverified` and
`source-shape-only` are intentional blocking states, not support claims.

Commonwealth is the only Australian lane with source-backed prerelease runtime
coverage today. All other Australian jurisdictions remain planned until their
provider-specific source, licence, fixture, provenance, and conformance gates
pass.
