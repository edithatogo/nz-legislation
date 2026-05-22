#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-$(pwd)}"
ZIP_NAME="${ZIP_NAME:-anz_legislation_handoff_v9_covering_prompt.zip}"
DOWNLOAD_ZIP="${DOWNLOAD_ZIP:-$HOME/Downloads/$ZIP_NAME}"
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
