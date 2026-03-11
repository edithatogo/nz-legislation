# Submodule Migration Runbook

## Purpose

This runbook records the safe path for moving the parent workspace from tracked child directories to explicit Git submodules without disrupting active work in `nz-legislation-tool` or `research-conductor`.

It exists because the current workspace is in a transition state:

- `nz-legislation-tool` is already an independent Git repository
- `research-conductor` has now been initialized as an independent Git repository
- both child repositories now have their own `conductor/` roots
- the parent repository still tracks child paths as normal files rather than gitlinks
- another agent is working in parallel, so parent index surgery is currently unsafe

## Current Safe Operating Model

Until submodule conversion is explicitly approved and prepared:

- use the parent directory as a coordination shell only
- do implementation work inside `nz-legislation-tool/`
- do research-planning and research-implementation work inside `research-conductor/`
- treat parent `conductor/` as portfolio or migration coordination only
- do not run parent-level commands that replace tracked child directories with gitlinks

## Readiness Gates

Do not perform parent-level submodule conversion until all of the following are true:

1. The parent repository index is ready.
   - Parent `git status --short` is understood and either clean or deliberately staged for the migration.
   - There are no unknown concurrent edits in child paths that would be lost by removing tracked parent entries.

2. Parallel work is coordinated.
   - No other agent or contributor is actively editing `nz-legislation-tool/` or `research-conductor/` through the parent repository view.
   - The migration window is explicitly treated as exclusive for parent index changes.

3. Child repositories are stable.
   - `nz-legislation-tool` has its intended remote and branch model confirmed.
   - `research-conductor` has its intended remote and branch model confirmed.
   - Each child repository has at least one baseline commit that captures its own Conductor bootstrap and local docs.

4. Coordination documents are updated.
   - Parent release and boundary docs reflect the target topology.
   - Contributors know that implementation happens inside child repositories, not in parent tracked copies.

## Target Topology

The intended topology is:

- parent workspace remains a convenience shell
- `nz-legislation-tool/` is a Git submodule in the parent repository
- `research-conductor/` is a Git submodule in the parent repository
- each child repository owns its own `conductor/`
- parent `conductor/` is limited to cross-project coordination and migration planning

## Planned Migration Sequence

The following sequence is the safe conversion path once the readiness gates are satisfied.

1. Freeze parent-level edits touching child paths.
   - Announce the migration window.
   - Confirm no parallel child-path edits are still running.

2. Verify child repositories directly.
   - Run `git -C nz-legislation-tool status --short`
   - Run `git -C research-conductor status --short`
   - Confirm remotes with `git -C <repo> remote -v`
   - Confirm the intended default branches

3. Commit or intentionally preserve child state.
   - Make sure each child repository has the commits needed for the migration baseline.
   - Do not rely on unstaged working-tree state as the only source of truth.

4. Remove parent tracking of child directories from the index only.
   - Use index-removal commands that preserve working-tree files.
   - Do not delete child repositories from disk.

5. Add the child repositories back as submodules.
   - Add `nz-legislation-tool` using its canonical remote URL.
   - Add `research-conductor` using its canonical remote URL.
   - Confirm `.gitmodules` is correct.

6. Validate parent repository state.
   - Parent `git status --short` should show `.gitmodules` and gitlinks, not full tracked child file trees.
   - `git submodule status` should show both child repositories correctly.

7. Update contributor guidance.
   - Document clone and update steps.
   - Document where to run Conductor commands for each project.

## Do-Not-Do List

Do not do any of the following while the workspace is contested or partially understood:

- do not convert child directories to submodules while another agent is editing them
- do not use destructive cleanup commands such as `git reset --hard`
- do not remove child directories from disk as part of index cleanup
- do not claim separation is complete until the parent repository shows actual gitlinks

## Validation Checklist

Submodule conversion is only complete when:

- `git submodule status` in the parent repository shows both child repositories
- `git ls-files --stage nz-legislation-tool research-conductor` shows gitlinks for the child roots
- parent `git status --short` no longer shows the full child trees as tracked parent content
- contributors can work from inside each child repository without depending on parent-tracked copies
