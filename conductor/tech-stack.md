# Technology Stack

## Runtime and language

- Node.js 18 or later
- TypeScript 5.x in strict mode
- Native ES modules
- pnpm as the repository package manager

The exact supported runtime and dependency versions are defined by
`package.json` and `pnpm-lock.yaml`; those files take precedence over this
summary.

## Application architecture

- Single npm package and repository
- Command-line entry point in `src/cli.ts`
- MCP stdio entry point in `src/mcp-cli.ts`
- Provider-aware legislation clients and adapters under `src/`
- Build output under `dist/`
- Repository-local integrations under `integrations/`
- Documentation under `docs/` and `docs-site/`

## Principal tools

| Concern                | Tooling                                   |
| ---------------------- | ----------------------------------------- |
| CLI                    | Commander                                 |
| HTTP                   | Got                                       |
| Runtime validation     | Zod                                       |
| MCP                    | Model Context Protocol TypeScript SDK     |
| Build                  | TypeScript compiler and `tsc-alias`       |
| Tests and coverage     | Vitest with V8 coverage                   |
| Formatting             | Prettier                                  |
| Lint and static checks | ESLint, Oxlint, Biome, Markdownlint, Vale |
| Packaging              | pnpm, Changesets, tsup where configured   |
| Automation             | GitHub Actions                            |

## Public compatibility surfaces

- Package: `nz-legislation-tool`
- Stable executables: `nzlegislation`, `nzlegislation-mcp`
- Transition aliases: `anzlegislation`, `anzlegislation-mcp`

Changes to these surfaces require alignment with the requirements register and
the umbrella release/distribution track.

## Data and provider constraints

- New Zealand remains the stable provider lane.
- Australian Commonwealth is a source-backed prerelease lane where implemented.
- Other Australian jurisdictions remain gated by their provider track, source
  validation, licensing, provenance, and capability evidence.
- Provider responses and capability declarations must be validated; fabricated
  fallback legal records are prohibited.

## Distribution posture

The repository prepares npm, GitHub, website/docs, MCP registry, assistant, IDE,
container, and Homebrew surfaces. Preparation artifacts do not authorize an
external publish, deployment, or registry submission. The umbrella track's
release-submission gates control those actions.

## Future architecture

Rust work is limited to language-neutral contracts and migration-readiness
planning. No Rust rewrite or separate integration repository is in scope.
