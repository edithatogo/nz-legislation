# Release-Aware Contributor Quickstart

## Before you open a PR

1. Decide whether your change affects:
   - CLI behavior
   - MCP behavior
   - packaging or install behavior
   - docs only
2. Add a changeset for user-facing changes with `pnpm changeset`.
3. Run:

```bash
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
```

## Branch intent

- Use `main` as the stable branch target.
- Use `next` only for explicitly prerelease or next-major work.

## Release intent expectations

- `patch` for fixes
- `minor` for backward-compatible additions
- `major` for breaking CLI, MCP, or future OpenAPI contract changes
- `release-neutral` for pure docs or governance work

## Public surfaces

The following are treated as governed product surfaces:

- CLI
- MCP
- future published HTTP/OpenAPI adapter, if shipped

If you change one of those surfaces, document it clearly and add the correct release intent.
