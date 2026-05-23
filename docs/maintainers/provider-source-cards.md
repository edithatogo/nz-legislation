# Provider source cards

`src/providers/source-cards.ts` builds preparation and provenance metadata from
the provider registry and capability manifest. Maintainers should treat these
cards as a generated view of provider posture, not as a separate source of truth.

Source cards are intended to make future export, MCP, and documentation surfaces
explain where a provider's source claims come from and which capabilities are
source-backed. They do not override provider gates, authorize registry
submissions, or authorize stable publishing claims.

## Current posture

- New Zealand is allowed because it is stable and runtime-supported.
- Australian Commonwealth may include Federal Register of Legislation source
  metadata and is runtime-supported for source-backed prerelease search,
  get-work, versions, export, and MCP paths.
- Australian Commonwealth citation and single-version retrieval remain
  unsupported.
- Australian Commonwealth citation and single-version support: unsupported.
- Queensland, NSW, Victoria, South Australia, Western Australia, Tasmania, ACT,
  and Northern Territory remain blocked until each provider has source-backed
  runtime support and passes the release/submission gates.

The generated `releaseGate` and `submissionGate` values must stay aligned with
that posture. A card with official source metadata still represents a blocked or
prerelease provider if the registry entry is not stable and fully promoted.

## Maintainer use

Use source cards when preparing provenance metadata for outputs that need to
explain provider readiness:

- derive cards from `getProviderSourceCards()` or `getProviderSourceCard()`;
- display `sourceAuthority`, `releaseChannel`, `runtimeSupported`, and
  `runtimeKind` as provenance fields;
- show `sourceBackedFeatureSummary` to distinguish source-backed capabilities
  from planned or unsupported capabilities;
- respect `releaseGate` and `submissionGate` before public release or registry
  submission claims;
- treat optional `sourceMetadata` as descriptive source information only.

Do not use source cards to bypass unsupported-provider errors or imply that
Australia is stable.

## Future export and MCP checklist

Before broadening source-card output in export or MCP responses:

1. Read the provider registry and capability manifest, then build source cards
   from those entries.
2. Attach the card or selected provenance fields to responses without changing
   runtime routing.
3. Return structured unsupported-capability errors for blocked providers instead
   of falling back to NZ data.
4. Verify NZ output remains allowed and runtime-supported.
5. Verify Australian output remains blocked or prerelease according to the
   capability manifest unless the provider has passed runtime, release, and
   submission gates.
6. Update public docs only after the generated cards match the claimed runtime
   posture.
