# Provenance Wiring Test Plan

This maintainer plan records future test coverage needed before provenance
source cards are emitted in export or MCP outputs. It is a test plan only; it
does not enable runtime provenance output, Australian runtime support, or any
public release claim.

## Scope

Future provenance wiring tests must prove that source cards and related
metadata are emitted only when the provider is supported, source-backed, and
allowed by the provider capability/runtime gates.

## Required future coverage

| Area                        | Future test expectation                                                                                                                    | Status  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| Source-card inclusion       | Export and MCP success paths include source-card metadata for supported, source-backed providers.                                          | Planned |
| Unsupported-provider errors | Export and MCP requests for blocked or unsupported providers return structured capability errors and do not emit source cards.             | Planned |
| NZ stable metadata          | New Zealand outputs preserve stable provider metadata, compatibility names, and source provenance fields expected by downstream consumers. | Planned |
| AU blocked metadata         | Australian providers remain marked prerelease, planned, or blocked until runtime, fixture, capability, and release gates pass.             | Planned |
| Release note copy checks    | Release note tests or review checks confirm NZ stable support is not conflated with Australian prerelease or planned support.              | Planned |
| No-placeholder gate         | No-placeholder legal-data checks fail if source cards, MCP output, or exports expose fabricated legal data as real provider support.       | Planned |

## Acceptance notes

- Source-card tests must be added before provenance metadata is emitted from
  export or MCP runtime code.
- Unsupported-provider tests must assert that blocked Australian providers do
  not silently fall back to New Zealand data.
- Metadata assertions should continue to use the provider capability manifest
  as the runtime capability source of truth.
- Release note checks should align with
  `docs/maintainers/release-notes-anz-readiness-draft.md`.
- No-placeholder checks remain blocking for any public package, registry,
  website, or MCP directory submission.
