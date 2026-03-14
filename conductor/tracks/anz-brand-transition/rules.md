# Phase 2 Rules: Dual-Branding and Safe Early Edits

**Track ID:** `anz-brand-transition`  
**Phase:** `2`  
**Approved:** `2026-03-14`

## Purpose

These rules convert the raw Phase 2 inventory into implementation constraints
for future rename work. They define what can safely become ANZ-neutral early,
what must remain legacy until compatibility support exists, and how mixed-brand
states should be described to users.

## Dual-Branding Rules

### Rule 1: Product Copy Can Lead

User-facing descriptive copy may move from `NZ Legislation Tool` to
`ANZ Legislation` before package, CLI, MCP, repository, or config names change.

Examples:

- README headings and descriptive blurbs
- docs introductions and overview pages
- feature descriptions and support language

### Rule 2: Install and Invocation Paths Must Lag

Install commands and executable examples must keep using the currently
functional legacy names until replacement paths are shipped.

Keep legacy names for now:

- `npm install -g nz-legislation-tool`
- `npx nz-legislation-tool ...`
- `nzlegislation`
- `nzlegislation-mcp`

### Rule 3: Runtime Identifiers Need Explicit Migration Support

Do not rename these surfaces in-place without alias or fallback handling:

- npm package name
- CLI binary names
- MCP server name
- local config/log directory name
- HTTP user agent identifier
- environment variable names such as `NZ_LEGISLATION_API_KEY`

### Rule 4: Repo Links Must Match Actual GitHub Reality

Do not rewrite repository links to `edithatogo/anz-legislation` until the
repository has actually been renamed. Before that point:

- product copy may be `ANZ Legislation`
- repository links stay on `edithatogo/nz-legislation`
- docs should explain the naming transition when needed

### Rule 5: Historical Documents Must Be Reviewed, Not Normalized Blindly

Older release, publishing, and setup documents may reflect past operational
states. They should be classified before editing:

- current canonical guidance
- historical record
- obsolete material that can be archived or removed

## Safe Early Edit Set

The following edits are approved to happen before package and CLI migration:

### Safe Now

- change high-level product descriptions from NZ-only wording to
  `ANZ Legislation`
- add transition notes explaining that package and CLI names remain legacy for
  compatibility
- clean up stale support links that point to obviously wrong historical
  repositories
  where the correct current repo is still `edithatogo/nz-legislation`
- update Conductor, governance, and roadmap documents to use the approved ANZ
  transition language

### Not Safe Yet

- renaming `package.json.name`
- renaming CLI binary entries in `package.json`
- changing environment variables such as `NZ_LEGISLATION_API_KEY`
- renaming MCP server identifier in code
- changing `Conf` project name or default config path handling
- changing GitHub Pages base URLs before the repository rename is coordinated

## Phase 3 Handover Questions

Phase 3 should answer:

1. Should `anz-legislation` be introduced first as a new package, a shim
   package, or a later replacement?
2. Should the future CLI aliases ship in the same release as the package
   migration or earlier?
3. How should MCP naming and local config-path migration relate to package and
   binary alias support?
