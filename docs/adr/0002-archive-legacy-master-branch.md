# ADR 0002: Archive the legacy `master` branch instead of deleting it

## Status

Accepted

## Context

The repository currently has three notable remote branches:

- `main`
- `next`
- `master`

Review of `master` showed that it is not a simple predecessor of `main`:

- `master` has no merge base with `main`
- `master` contains a legacy workspace layout rather than the current extracted tool repository layout
- `master` includes nested `nz-legislation-tool` trees and older Australian plugin/provider work

That means deleting `master` as if it were a stale release branch would risk losing relevant historical implementation context.

## Decision

- create an archive branch named `archive/legacy-workspace-master`
- keep `master` intact until a deliberate extraction or disposal review is completed
- treat `master` as legacy workspace history, not as an active product release line

## Consequences

### Positive

- preserves historical implementation context
- preserves older Australian/Commonwealth plugin work for later review
- removes ambiguity about whether `master` is a supported release branch

### Negative

- branch inventory remains larger until final cleanup
- maintainers must avoid using `master` as a working branch

## Follow-up

Before deleting `master`, maintainers should:

1. confirm whether any Australian/provider work should be extracted from the archived legacy line
2. record the extraction or discard decision
3. then remove `master` only after the archive branch is verified
