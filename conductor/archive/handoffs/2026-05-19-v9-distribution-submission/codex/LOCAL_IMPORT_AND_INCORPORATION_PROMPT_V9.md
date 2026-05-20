# Codex prompt — import v9 handoff, merge tracks, and incorporate distribution plan

You are working locally on the `edithatogo/nz-legislation` repository.

## Objective

Move the downloaded v9 handoff ZIP from `~/Downloads` into the repository archive folder, extract it safely, incorporate the provided `repo-overlay/`, and merge the roadmap/progress into one single-repo Conductor track.

## Preconditions

- You are in the repository root, or `REPO` is set to the repository root.
- The ZIP has been downloaded to `~/Downloads/anz_legislation_handoff_v9_covering_prompt.zip`.
- Do not delete or overwrite uncommitted local work.
- Do not publish packages.
- Do not rename the repository.
- Do not split integrations into separate repositories.
- Do not submit to external registries yet.

## Import steps

```bash
set -euo pipefail

REPO="${REPO:-$(pwd)}"
ZIP_NAME="anz_legislation_handoff_v9_covering_prompt.zip"
DOWNLOAD_ZIP="$HOME/Downloads/$ZIP_NAME"
ARCHIVE_DIR="$REPO/conductor/archive/handoffs/2026-05-19-v9-distribution-submission"
EXTRACT_DIR="$ARCHIVE_DIR/extracted"

if [ ! -d "$REPO/.git" ]; then
  echo "ERROR: REPO does not look like a git repository: $REPO" >&2
  exit 1
fi

if [ ! -f "$DOWNLOAD_ZIP" ]; then
  echo "ERROR: Expected handoff ZIP not found: $DOWNLOAD_ZIP" >&2
  exit 1
fi

if ! git -C "$REPO" diff --quiet || ! git -C "$REPO" diff --cached --quiet; then
  echo "ERROR: Repository has uncommitted changes. Commit/stash them before importing this handoff." >&2
  exit 1
fi

mkdir -p "$ARCHIVE_DIR"

# Move, not copy, as requested.
mv "$DOWNLOAD_ZIP" "$ARCHIVE_DIR/$ZIP_NAME"

rm -rf "$EXTRACT_DIR"
mkdir -p "$EXTRACT_DIR"
unzip -q "$ARCHIVE_DIR/$ZIP_NAME" -d "$EXTRACT_DIR"

cp "$EXTRACT_DIR/COVERING_PROMPT.md" "$ARCHIVE_DIR/COVERING_PROMPT.md"
cp "$EXTRACT_DIR/HANDOFF.md" "$ARCHIVE_DIR/HANDOFF.md"
cp "$EXTRACT_DIR/README.md" "$ARCHIVE_DIR/README.handoff.md"

rsync -a "$EXTRACT_DIR/repo-overlay/" "$REPO/"

cp -R "$EXTRACT_DIR/docs" "$ARCHIVE_DIR/docs"
cp -R "$EXTRACT_DIR/codex" "$ARCHIVE_DIR/codex"
cp -R "$EXTRACT_DIR/schemas" "$ARCHIVE_DIR/schemas"
cp -R "$EXTRACT_DIR/issues" "$ARCHIVE_DIR/issues"
cp -R "$EXTRACT_DIR/distribution" "$ARCHIVE_DIR/distribution"

git -C "$REPO" status --short
```

## Merge tracks and progress

After import:

1. Read current `conductor/status.md`.
2. Read all active track `metadata.json` files.
3. Keep existing track folders intact initially.
4. Add or update the consolidated umbrella track:
   - `conductor/tracks/anz-platform-release-and-distribution/`
5. Update `conductor/status.md` so it identifies `anz-platform-release-and-distribution` as the umbrella delivery track.
6. Preserve old tracks as subtracks or historical inputs; do not archive/delete them unless each is clearly complete and the maintainer approves.
7. Add a progress dashboard from `repo-overlay/conductor/status-addendum-v9.md`.
8. Ensure the track states do not contradict each other.

## Validation

Run:

```bash
pnpm install
pnpm typecheck
pnpm test:run
pnpm build
pnpm exec prettier --check .
```

## Output

Return:

- changed files
- validation results
- merged track summary
- remaining blockers
- recommended PR title
