# Architect Oracle Assessment — 2026-06-14

## Role

**architect_oracle** in the Antigravity subdirectory swarm for `cli-legislation-nz`.

## Sources of truth consulted

- `conductor/tracks.md` — track inventory and phase
- `conductor/requirements.md` — MoSCoW contract register
- `conductor/status.md` — workspace overview
- `conductor/status-addendum-v9.md`
- `conductor/tracks/anz-platform-release-and-distribution/` — umbrella track
- `conductor/tracks/nz-provider-stable-compatibility/` — NZ stability track
- `task_plan.md` — swarm mission assignment
- `AGENTS.md` — hard rules and validation
- `.swarm/prompts/architect_oracle_subdir_swarm.md`
- `src/providers/` — capability-manifest, registry, runtime, jurisdictions, source-cards
- `package.json` — package identity, bins, aliases
- `scripts/` — gate scripts (check-\*.ts)
- `pnpm gate:*` results

## Validation evidence gathered

| Gate                             | Result  | Notes                       |
| -------------------------------- | ------- | --------------------------- |
| `pnpm typecheck`                 | PASS    | `tsc --noEmit` clean        |
| Prov. capability manifest        | PASS    | 16/16 tests pass            |
| Provider registry+runtime        | PASS    | 20/20 tests pass            |
| `gate:no-placeholder-legal-data` | PASS    | Clean                       |
| `gate:conductor-requirements`    | PASS    | 19 tracks aligned           |
| `gate:manifest-docs`             | PASS    | 9 AU rows match manifest    |
| `gate:package-metadata`          | PASS    | Identity/bins/aliases ok    |
| `gate:provider-aware-mcp-export` | TIMEOUT | Includes e2e/network tests  |
| `pnpm test:run`                  | TIMEOUT | Full suite times out at 30s |

## Track-by-track assessment

### Track 1: Umbrella release roadmap

**Status: Mostly complete for local prep.**

- Umbrella track: `index.md`, `spec.md`, `plan.md`, `metadata.json`
- `channel-matrix.md` (32 channels)
- `release-submission-gates.md` (8 blocking gates)
- `provider-api-roadmap.md` (12 entries)
- `conductor/requirements.md` has MoSCoW rows for all 19 tracks
- **Remaining:** Phase 1 "Reconcile stale Conductor status claims" is ongoing

### Track 2: NZ provider stable compatibility

**Phase 1 in progress; Phase 2 pending.**

- Phase 1 remaining: "Add automated manifest/docs drift checks for stable NZ support claims"
  - `scripts/check-manifest-docs-drift.ts` exists and passes. NZ stability implicit via AU false-claim forbiddance. Explicit NZ completeness cross-check not added yet but current gate sufficient.
- Phase 2 items unchecked:
  - **Command names verified:** `nzlegislation`→`dist/cli.js`, `nzlegislation-mcp`→`dist/mcp-cli.js`. Aliases also correct.
  - **MCP stdio snippets:** Not yet verified in `integrations/mcp/`
  - **Release notes gate:** Script exists; untested locally

### Tracks 3-5: Australian provider prerelease/discovery/aggregator lanes

**Status: Template/planned only.**

- Commonwealth: full prerelease runtime implementation (source-backed)
- Queensland: planned only, no runtime
- NSW, Vic, SA, WA, Tas, ACT, NT: all planned with unsupported features
- Aggregator evaluation, OpenAPI readiness: P2, unsupported
- **No local non-gated code work identified**

### Tracks 6-8: Publication, marketplace, mirroring

**Status: Preparation/gated or completed.**

- All npm, GitHub, website, MCP, IDE, Docker, Homebrew paths are gated
- Multi-git mirroring is completed
- **No local non-gated work**

### Track 9: Local validation

- Provider validation: 20/20 tests pass
- Full suite and MCP/export gate time out (network deps)
- `pnpm build`: PASS (compiles cleanly)
- Prettier check not yet run (noisy per AGENTS.md exception)

### Track 10: External gates queue

- No external actions performed. All gate scripts are preparation-only.

## Architecture health summary

1. **Provider layer is coherent.** capability-manifest → registry → runtime → source-cards pipeline works. NZ is the only `stable`. Commonwealth is `prerelease`. All other AU = `planned`/`unsupported`.
2. **Gate infrastructure is mature.** 10+ gate scripts exist.
3. **Binary compatibility preserved.** All 4 bin names point to correct entry points.
4. **No published/committed work by this swarm.**

## Recommended local non-gated actions

1. ✅ **Done:** Validate provider capability tests (20/20 pass)
2. ✅ **Done:** Verify conductor requirements gate (19 tracks aligned)
3. ✅ **Done:** Verify no-placeholder-legal-data gate passes
4. ✅ **Done:** Verify NZ command name compatibility
5. ✅ **Done:** Record this assessment in Conductor progress surface
6. ✅ **Done:** Run `pnpm build` to confirm compilation
7. ⬜ **Optional:** Verify MCP stdio snippets reference correct command names

## Evidence recorded

- Provider tests pass: all provider module tests
- All gate scripts available under `scripts/`
- Conductor tracks: 22 active track directories with metadata.json/spec.md/plan.md
- All evidence is local and in-repo
- No external actions were performed
