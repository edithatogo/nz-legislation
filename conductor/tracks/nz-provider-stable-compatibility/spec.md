# Spec: NZ Provider Stable Compatibility

## Scope

This track protects the existing New Zealand provider surface while Australian
provider work continues in prerelease or planned lanes.

## Requirements

- Preserve `nz-legislation-tool`, `nzlegislation`, and `nzlegislation-mcp` as
  stable compatibility names.
- Keep New Zealand CLI, library, MCP, and export behavior compatible with
  existing downstream users.
- Record New Zealand as the only stable provider claim until another provider
  passes all release gates.
- Ensure ANZ aliases remain transitional and do not replace stable NZ names.

## Contracts

- **Runtime:** NZ routes remain supported through the existing client and
  provider capability manifest entry.
- **Data:** NZ output must come from the existing NZ legislation source/client
  path, not Australian provider fallbacks.
- **Publication:** Public copy may claim stable NZ support only when current CI,
  package metadata, docs, and release notes pass.

## Non-goals

- Rename package or binary names.
- Publish a new package as part of provider planning.
- Treat Australian prerelease support as stable NZ compatibility.
