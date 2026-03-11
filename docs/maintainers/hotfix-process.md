# Hotfix Process

## When to use this

Use a hotfix only for a stable-line issue that materially affects current users, such as:

- install failures
- broken CLI or MCP behavior
- packaging regressions
- severe correctness issues

## Procedure

1. Branch from `main`.
2. Keep the change as small as possible.
3. Add or update tests where feasible.
4. Add a changeset with patch intent unless the change is truly release-neutral.
5. Open a PR and mark it as urgent.
6. Require `CI` to pass.
7. Merge to `main`.
8. Let `Release Stable` publish the patch.

## Do not do

- do not bypass the stable workflow with ad hoc tag pushes unless the normal path is unavailable
- do not bundle unrelated cleanup into the hotfix
- do not use the `next` branch for stable hotfixes
