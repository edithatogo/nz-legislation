# Phase 4 Checklist: Repository, Documentation, and Site Migration

**Track ID:** `anz-brand-transition`  
**Phase:** `4`  
**Approved:** `2026-03-14`

## Repository Rename Checklist

- rename GitHub repository from `edithatogo/nz-legislation` to
  `edithatogo/anz-legislation`
- verify branch protection survives the rename on `next`
- re-check required status checks after rename:
  - `Typecheck`
  - `Test (Node 18)`
  - `Test (Node 20)`
  - `Test (Node 22)`
  - `Require changeset for user-facing changes`
- preserve required review count of `1`
- preserve required conversation resolution and linear history
- verify issue, discussion, release, and Actions redirects work

## Docs and Site Migration Checklist

### Repository Links

Update current docs and support links that still point to:

- `edithatogo/nz-legislation-tool`
- `dylanmordaunt/nz-legislation-tool`
- older GitHub Pages paths derived from `nz-legislation-tool`

### README and Core Entry Docs

- `README.md`
  - badges
  - repository links
  - clone commands
  - issue/discussion/support links
- `CONTRIBUTING.md`
- `DEVELOPER_GUIDE.md`

### Documentation Site Material

- `docs/documentation-site-config.md`
  - `baseUrl`
  - `projectName`
  - edit URLs
  - social/support links
  - search index naming
- `docs/documentation-site-setup.md`
  - site URL examples
  - edit URLs
  - GitHub links
  - historical platform examples that mention `nz-legislation-tool`

### User and Developer Guides

- `docs/user-guide/`
  - issue/discussion/support links
  - accessibility/support references
- `docs/developer-guide/`
  - clone paths
  - upstream remote examples
  - issue/discussion links

## MCP and Support-Link Checklist

- update `src/mcp/server.ts` name field only when the coordinated rename release
  is ready
- update MCP startup banner after package and docs coordination is ready
- update support links in `src/cli.ts` and `src/commands/generate.ts`
- ensure support links point to the actual current repo at each migration stage

## Sequencing Rules

- repo rename and docs-link cleanup should happen in the same phase
- GitHub Pages path changes must be bundled with docs-site config updates
- MCP metadata rename should not precede repo/docs coordination
- package and CLI legacy names remain supported even after the repo rename

## Completion Standard

Phase 4 is considered planned and sequenced when:

- the repo rename prerequisites are explicit
- the docs/site files needing updates are named
- MCP and support-link migration points are identified
- no critical public surface is assumed to update automatically without
  verification
