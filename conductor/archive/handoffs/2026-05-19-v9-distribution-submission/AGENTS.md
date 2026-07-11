# AGENTS.md — ANZ Legislation v9

## Mission

Keep one repository and build a merged release/distribution roadmap.

## Hard rules

- Preserve `nz-legislation-tool`, `nzlegislation`, and `nzlegislation-mcp` compatibility.
- Keep `anzlegislation` and `anzlegislation-mcp` as aliases until migration policy says otherwise.
- Do not create separate repos for integrations.
- Do not submit to registries until security and capability gates pass.
- Do not publish fabricated legal data.
- Do not start a Rust rewrite.
- Do not expose community plugin loading until a trust model exists.

## Work priority

1. Reconcile branches and release posture.
2. Remove placeholder legal data.
3. Add capability manifest.
4. Make MCP/export provider-aware.
5. Publish npm/docs/website surfaces accurately.
6. Add integration artifacts under `integrations/`.
7. Submit to registries only after readiness checks.
8. Keep Rust migration readiness as future work in this repo.

## Validation

Run:

```bash
pnpm install
pnpm typecheck
pnpm test:run
pnpm build
pnpm exec prettier --check .
```

If full formatting is noisy because of existing repo state, run the repo’s current scoped checks and document the exception.
