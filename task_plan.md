# Swarm Mission: cli-legislation-nz Conductor Work

## Swarm Assignment

Run the local, non-gated Conductor work for `cli-legislation-nz` from this
subdirectory. Use `conductor/tracks.md` as the source of truth and preserve the
current repository boundaries.

## Source of Truth

- `conductor/tracks.md`
- `conductor/requirements.md`
- Each `conductor/tracks/<track_id>/spec.md` and `plan.md` when present
- Local source, test, package, docs, and workflow files in this subdirectory

## Gates

Do not perform these actions unless the user explicitly approves the specific
gate:

- publish, deploy, submit, rename, package-release, registry, marketplace, npm,
  GitHub Packages, GitHub Releases, Docker/GHCR, Homebrew, Smithery, extension
  marketplace, or assistant marketplace actions
- git commit, push, remote mirroring, or archive mutation
- credential, token, `.env`, OAuth, account, browser-profile, or Chrome work
- claims of stable Australian jurisdiction support before the umbrella track
  authorizes them

## Track 1: Umbrella release and distribution roadmap

- [ ] Task: Reconcile `anz-platform-release-and-distribution` against
      `conductor/requirements.md` and identify all local preparation work that can
      proceed without publication, deployment, registry submission, renaming, or
      external writes.

## Track 2: Stable NZ provider compatibility

- [ ] Task: Validate and preserve stable New Zealand provider compatibility for
      package, CLI, MCP, and export surfaces while Australian provider work remains
      prerelease or readiness-only.

## Track 3: P0 Australian provider prerelease lanes

- [ ] Task: Advance local, source-backed prerelease readiness for
      `anz-provider-commonwealth`, `anz-provider-queensland`, and related P0
      provider contracts without publishing or making stable support claims.

## Track 4: P1 Australian provider discovery lanes

- [ ] Task: Advance local source-shape discovery and adapter mapping for New
      South Wales, Victoria, South Australia, Western Australia, Tasmania, ACT, and
      Northern Territory without external account or publication actions.

## Track 5: P2 aggregator and OpenAPI readiness

- [ ] Task: Review and document local evaluation/readiness work for
      `anz-provider-aggregator-evaluation` and `anz-openapi-adapter-readiness`,
      keeping all source, provenance, licence, and API-contract findings
      preparation-only.

## Track 6: Publication and registry preparation

- [ ] Task: Advance local preparation contracts for npm, GitHub Packages,
      GitHub Releases, website/docs, install pages, `llms.txt`, Smithery, and MCP
      directories without publishing, deploying, submitting, or renaming anything.

## Track 7: Marketplace and distribution preparation

- [ ] Task: Advance local preparation contracts for assistant integrations, IDE
      extensions, Docker/GHCR, Homebrew, and future Rust migration readiness without
      marketplace submission, package publication, image push, or external writes.

## Track 8: Multi-git archive mirroring evidence

- [ ] Task: Confirm the completed `anz-multi-git-archive-mirroring` state from
      local workflow/configuration evidence and record any remaining gated mirror or
      push actions without performing them.

## Track 9: Local validation and evidence

- [ ] Task: Run only the relevant local validation slices for files changed by
      swarm agents and record exact commands/results in the relevant Conductor
      progress or plan surface.

## Track 10: External gates queue

- [ ] Task: Queue, but do not perform, every remaining publication, deployment,
      registry, marketplace, package-release, mirror, push, Chrome, browser-profile,
      credential, `.env`, OAuth, or account-dependent item.
