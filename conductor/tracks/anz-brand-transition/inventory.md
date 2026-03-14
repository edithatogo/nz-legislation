# Phase 2 Inventory: Rename-Sensitive Surfaces

**Track ID:** `anz-brand-transition`  
**Phase:** `2`  
**Captured:** `2026-03-14`

## Summary

The repository still contains a wide spread of NZ-only naming across package
metadata, runtime identifiers, documentation, support links, and historical
release material.

The key Phase 2 conclusion is that public-facing copy can move earlier than
package, binary, MCP, environment-variable, and config-path names. Those latter
surfaces are embedded deeply enough that they need explicit compatibility
handling rather than a blind string replacement.

## Canonical Rename-Sensitive Surface Groups

### Package and Repository Metadata

- `package.json`
  - package name is `nz-legislation-tool`
  - repository URL is `edithatogo/nz-legislation`
  - bugs/homepage fields still point to the old repo path
  - CLI binaries are `nzlegislation` and `nzlegislation-mcp`
- `CHANGELOG.md`
  - title still uses `nz-legislation-tool`
- `CHANGESETS.md`
  - GitHub changelog repo still targets `edithatogo/nz-legislation`

### Runtime and Protocol Surfaces

- `src/config.ts`
  - `Conf` project name is `nz-legislation-tool`
  - comments and effective config path still assume `.nz-legislation-tool`
- `src/mcp/server.ts`
  - MCP server name is `nz-legislation`
  - startup banner still prints `NZ Legislation MCP Server`
- `src/client.ts`
  - error messaging still references the current env var
  - HTTP user agent still sends `nz-legislation-tool/1.0.0`
- `src/utils/api-optimization.ts`
  - user agent still sends `nz-legislation-tool/1.0.0`
- `src/cli.ts`
  - help/support output still points to an older repo URL and NZ-only copy
- `src/commands/generate.ts`
  - support links still reference the older `dylanmordaunt/nz-legislation-tool` repo

### Legacy Compatibility Surfaces That Must Not Change Early

- CLI binaries
  - `nzlegislation`
  - `nzlegislation-mcp`
- npm package install path
  - `nz-legislation-tool`
- environment variable
  - `NZ_LEGISLATION_API_KEY`
- local config and log path
  - `.nz-legislation-tool`

These remain compatibility-critical and should be preserved until the package
and CLI migration strategy is implemented.

### Public Documentation Surfaces

- `README.md`
  - package badges, package links, install commands, clone commands, issue links,
    and support links still point to NZ-only names
- `docs/user-guide/`
  - user-facing install and support docs still use `nz-legislation-tool` and
    `nzlegislation`
- `docs/developer-guide/`
  - contributor setup, repo URLs, config paths, and architecture docs still use
    NZ-only names
- `docs/documentation-site-config.md`
  - Docusaurus config examples still use `nz-legislation-tool` for base URL,
    project name, GitHub links, and Algolia index naming
- `docs/documentation-site-setup.md`
  - site setup guidance still assumes `nz-legislation-tool` repo and docs paths

### Workflow, Templates, and Historical Operational Docs

- `.github/ISSUE_TEMPLATE/bug-report.yml`
  - version prompt still refers to `nz-legislation-tool`
- `AUTO_PUBLISH.md`
  - contains an older release path that assumes `nz-legislation` or
    `nz-legislation-tool` in multiple combinations and will need deliberate
    cleanup rather than search-replace
- `CONTRIBUTING.md`, `DEVELOPER_GUIDE.md`
  - clone paths and support links still reflect pre-ANZ naming

## Initial Phase 2 Implementation Rules

- Product-copy surfaces can become `ANZ Legislation` first.
- Package name, binary names, MCP name, env vars, and config paths stay legacy
  until alias or migration support exists.
- Repo-link cleanup should prefer `edithatogo/nz-legislation` until the actual
  GitHub rename happens, even if product copy becomes ANZ-first.
- Historical release and operational documents should be triaged rather than
  blindly rewritten, because some reflect past states rather than current
  canonical guidance.

## Immediate Next Step

Use this inventory to decide which internal references can become ANZ-neutral in
Phase 2 without breaking installs, configs, MCP integrations, or automation.
