# Covering prompt — import v9 handoff and merge the single-repo distribution roadmap

You are Codex working locally in the `edithatogo/nz-legislation` repository.

## Mission

Import the v9 handoff ZIP from the user’s Downloads folder, archive it inside the repository, incorporate the included `repo-overlay/`, and merge the roadmap/progress into one coherent single-repo delivery track.

This is not a publishing run. Do not publish to npm, deploy the website, rename the repo, submit to registries, or create external marketplace listings during the import. Instead, incorporate the planning artifacts, add the integration directories/checklists, and leave clear release/submission gates that can be executed later by the maintainer.

## Hard constraints

- Keep one repository. Do not create separate repositories for MCP, Claude, Codex, Copilot, VS Code, Gemini, Qwen, website, or Rust migration work.
- Preserve compatibility with `nz-legislation-tool`, `nzlegislation`, and `nzlegislation-mcp`.
- Keep `anzlegislation` and `anzlegislation-mcp` as aliases while the ANZ transition is incomplete.
- Do not publish fabricated legal data. If a provider is unsupported or incomplete, return a structured capability/unsupported error rather than invented metadata.
- Do not submit to external registries until the security, provenance, and capability gates pass.
- Do not begin a Rust rewrite. Keep Rust as a future migration-readiness track after provider, MCP, export, indexing, evaluation, and packaging work stabilise.

## Import the ZIP

Run this from the repo root, or set `REPO` to the repo root first:

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
  echo "ERROR: Repository has uncommitted changes. Commit or stash them before importing this handoff." >&2
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

1. Read `conductor/status.md` and all active track `metadata.json` files.
2. Keep existing track folders intact initially.
3. Add or update the umbrella track `conductor/tracks/anz-platform-release-and-distribution/`.
4. Treat existing tracks as subtracks or historical inputs; do not archive/delete them unless they are clearly complete and the maintainer has explicitly approved that cleanup.
5. Update `conductor/status.md` with the imported status addendum and make the umbrella track the main coordination point for ANZ release/distribution.
6. Ensure track states do not contradict one another.
7. Keep distribution and integration artifacts under `integrations/`, `docs/maintainers/`, and `.github/` inside this repository.

## Incorporate the distribution/submission roadmap

Merge these pathways into the umbrella track and maintainer docs:

- npm stable and `next` publishing
- future `anz-legislation` alias/sibling package readiness
- GitHub Packages mirror
- GitHub Releases
- website/docs/GitHub Pages publishing
- `llms.txt` and AI-facing install docs
- MCP registry/directory submissions, including Smithery and other MCP directories
- Claude Desktop/Claude Code MCP setup and optional skill/prompt-pack artifacts
- Codex `AGENTS.md`, local prompt pack, and MCP setup
- GitHub Copilot instructions and future Copilot Extension/GitHub App path
- VS Code Marketplace and Open VSX extension path
- Gemini/OpenAPI/function-calling/tool path
- Qwen/Qwen-Agent/ModelScope-style tool path
- JetBrains, Docker/GHCR, Homebrew, and other later distribution channels

Do not claim that any external submission has happened unless you actually perform it in a later, separate, maintainer-approved release/submission run.

## Release and submission gates

Before any external submission or publication, require:

1. no-placeholder legal data gate passes
2. provider capability manifest exists and is consumed by CLI, MCP, README, docs, and website
3. MCP and export are provider-aware rather than NZ-client-only
4. package metadata is accurate and compatibility-preserving
5. website/docs pages are updated and link-consistent
6. security/provenance review is complete
7. install snippets are tested for each host
8. release notes clearly mark NZ stable vs Australian prerelease status
9. submission target docs are re-verified locally because registry/plugin processes may have changed

## Validation

Run the repo’s normal checks after applying the overlay:

```bash
pnpm install
pnpm typecheck
pnpm test:run
pnpm build
pnpm exec prettier --check .
```

If full formatting is noisy because of existing repo state, run the scoped checks used by the repository’s current workflows and document the exception.

## Output expected from Codex

Return a concise implementation summary with:

- files changed
- tracks merged or updated
- validation commands run and results
- remaining blockers
- whether the repo is ready for a PR
- the next recommended PR title
