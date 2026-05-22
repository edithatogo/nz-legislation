# Conductor Status

Last reviewed: 2026-05-20 (supersession reconciliation)

## Summary

This file is the authoritative Conductor workspace overview for this repository.
The workspace currently contains a mix of complete records, pending work, and
backlog/template material that has now been separated from active tracks.

See also:

- `README.md` for workspace operating rules
- `archive/README.md` for archived track inventory
- `backlog/README.md` for backlog promotion rules
- `status-reconciliation-2026-05-20.md` for the 2026-05-20 Conductor track
  reconciliation and OneDrive/Git validation limits
- `completion-supersession-review-2026-05-20.md` for the decision record on
  superseded root-level completion files
- `archive/top-level-completion-files-archive-2026-05-20.md` for retained
  substance from the retired root-level completion files
- `supersession-staging-boundary-2026-05-20.md` for the narrow staging and
  commit boundary used for the supersession work
- `status-addendum-v9.md` for the v9 distribution/submission import note
- `tracks/anz-platform-release-and-distribution/` for the active umbrella
  release, distribution, submission, and integration track

## Active Track Inventory

| Track                                                | Status     | Notes                                                                                                                       |
| ---------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| `anz-platform-release-and-distribution`              | ACTIVE     | Umbrella track for v9 distribution/submission import; preparation-only until gates pass                                     |
| `release-governance-modernization`                   | COMPLETE   | Fully documented and marked complete                                                                                        |
| `documentation-site-enhancements`                    | PENDING    | Optional post-launch work not yet started                                                                                   |
| `documentation-site-completion`                      | COMPLETE   | Parent completion record restored                                                                                           |
| `anz-brand-transition`                               | ACTIVE     | Compatibility window active; repo/package migration is live                                                                 |
| `legal-metadata-standards-alignment`                 | COMPLETE   | Canonical standards layer documented and implemented additively                                                             |
| `manuscript-submission-preparation`                  | SUPERSEDED | Session 4 corrections applied; superseded by verification track                                                             |
| `manuscript-verification-improvement`                | PLANNING   | Comprehensive fact-check, analysis verification, and improvement planning for all 3 manuscripts                             |
| `manuscript-pipeline-certification`                  | COMPLETE   | Strict end-to-end certification track now records all 3 live manuscripts as certified on staged local evidence surfaces     |
| `submission-package-audit-remediation`               | COMPLETE   | Canonical package artefacts and control docs now align to the certified source state across all 3 manuscripts               |
| `substack-adaptation-and-visuals`                    | ACTIVE     | Conversational reframing and non-journal visual strategy now advanced into concrete Substack post briefs and image guidance |
| `citation-compliance-remediation`                    | REVIEWED   | Citation and source remediation record added in the expanded manuscript evidence set                                        |
| `journal-target-and-open-access-alignment`           | REVIEWED   | Journal-target and open-access alignment artefacts added for manuscript routing                                             |
| `publication-surface-integrity-and-provenance-audit` | REVIEWED   | Publication-surface and provenance audit artefacts added for claim integrity review                                         |
| `study-red-team-and-devils-advocate-review`          | REVIEWED   | Red-team and attack-register artefacts added for pre-publication critique                                                   |
| `submission-artefact-reconciliation`                 | REVIEWED   | Canonical submission artefact reconciliation and source-lineage records added                                               |

## Archived Tracks

Archived track count: `11`

The archive contains prior completed or retired efforts and should be treated as
historical context rather than active delivery scope.

## Backlog Entries

Backlog entry count: `4`

The backlog contains reserved track names that are not part of current active
delivery. One of them, `p1-legislative-volatility`, is intentionally tracked in
detail under `research-conductor` instead of this product-side Conductor tree.

## Current Read on Project State

### 2026-05-20 v9 Distribution/Submission Import

- The v9 handoff archive is now stored under
  `conductor/archive/handoffs/2026-05-19-v9-distribution-submission/`.
- The v9 `repo-overlay/` has been incorporated into the repository root as
  repository-local preparation material.
- The active umbrella track is
  `conductor/tracks/anz-platform-release-and-distribution/`.
- The import keeps a single repository. It does not authorize or perform package
  publishing, website deployment, repository renaming, package renaming,
  marketplace submission, MCP registry submission, Docker/GHCR publishing, or
  Homebrew publishing.
- Future external release or submission work is blocked until the umbrella
  track's release/submission gates pass, including no-placeholder legal data,
  provider capability manifest, provider-aware MCP/export, accurate package
  metadata, updated website/docs, tested install snippets, security/provenance
  review, and release notes that distinguish NZ stable support from Australian
  prerelease support.
- Compatibility with `nz-legislation-tool`, `nzlegislation`, and
  `nzlegislation-mcp` remains required. `anzlegislation` and
  `anzlegislation-mcp` are transition aliases while ANZ support is incomplete.
- Candidate legal-data APIs are tracked in
  `conductor/tracks/anz-platform-release-and-distribution/provider-api-roadmap.md`
  as source-validation-required backlog items, including Australian Commonwealth,
  Queensland, NSW, Victoria, South Australia, Western Australia, Tasmania, ACT,
  Northern Territory, aggregator evaluation, and future HTTP/OpenAPI adapter
  readiness.

### 2026-05-20 Supersession Reconciliation

- The old root-level completion helper files are now superseded by Conductor
  records and archived rather than treated as unexplained deletions:
  `FINAL_STATUS.md`, `PROJECT_COMPLETE.md`, `release-commit-msg.txt`, and
  `test_export.csv`.
- Their retained substance is summarized in
  `conductor/archive/top-level-completion-files-archive-2026-05-20.md`.
- The root completion files were historical NZ-only or transient helper/output
  surfaces and no longer serve as the active project source of truth.
- The active source of truth for the supersession decision is now the trio of:
  `status-reconciliation-2026-05-20.md`,
  `completion-supersession-review-2026-05-20.md`, and
  `supersession-staging-boundary-2026-05-20.md`.
- Generated automation and temporary conversion outputs are now excluded from
  future status noise through `.gitignore`; durable manuscript, submission,
  journal, and Conductor track artefacts still need their own review boundary
  before staging.

### nz-legislation-tool Development Tracks

- Conductor now has a clean active-track inventory.
- Four active tracks are explicitly complete.
- One active track is explicitly pending.
- Two active tracks are explicitly in progress.
- Two active manuscript tracks are now separated by responsibility:
  `manuscript-verification-improvement` covers research validity and
  `submission-package-audit-remediation` covers package integrity.
- The documentation enhancement track no longer contradicts itself about launch
  status.
- The missing parent record for documentation site completion has been
  restored.
- The ANZ brand transition is now tracked as a separate staged migration rather
  than an implicit future rename.
- ANZ transition planning is complete across naming policy, inventory, package
  strategy, repo/docs migration, and deprecation criteria.
- The repository now lives at `edithatogo/anz-legislation`.
- Both npm package names are now published at `1.2.1`:
  `nz-legislation-tool` and `anz-legislation`.
- GitHub release `v1.2.1` now exists for the new repository.
- Trusted publishing is configured for future automated releases.
- Legal metadata standards alignment is now tracked as an explicit architecture
  effort rather than an implicit future refactor.
- Legal metadata standards alignment now has an accepted ADR, canonical
  schemas, provider mapping, canonical-backed legacy adapters, additive export
  metadata, and a schema.org publication helper.
- The product still ships on the legacy-compatible `nz-legislation-tool` path,
  but `anz-legislation` is now also published and supported.
- The provider model is coherent internally, and a standards-aligned canonical
  legal metadata layer now exists additively without breaking the CLI surface.
- The former template track has been moved out of active inventory to
  `conductor/templates`.
- Former stub tracks have been moved out of active inventory to
  `conductor/backlog`.

### Manuscript Submission Preparation Track

- Session 4 corrections applied (2026-03-25): citation format cleanup, M1 placeholder fixes, M2 JEL code fix, M3 intra-rater correction
- Track superseded by `manuscript-verification-improvement` for ongoing work
- All DOCX files versioned: M1→v3, M2→v2, M3→v5
- M1 coverage date inconsistency identified and flagged (abstract: "1956–2026"; actual windows: P0: 2004–2026, P1: 2000–2026, P3: 2014–2026)

### Manuscript Verification & Improvement Track (NEW — 2026-03-25)

- **PURPOSE:** Independently verify all analysis, fact-check every claim in manuscripts and supplements
- **SCOPE:** All 3 manuscripts (M1/M2/M3) + associated supplements and analysis scripts
- **STATUS:** PLANNING — see `conductor/tracks/manuscript-verification-improvement/`

### Manuscript Pipeline Certification Track (NEW — 2026-03-28)

- **PURPOSE:** Issue strict certification verdicts for M1, M2, and M3 based on
  end-to-end reconciliation of live claims, processed inputs, scripts, rerun
  outputs, and reliability artefacts
- **SCOPE:** Only the current live manuscript pipelines; package sufficiency is
  not enough for this track
- **STATUS:** COMPLETE — see
  `conductor/tracks/manuscript-pipeline-certification/`
- **CURRENT STATE:** M1, M2, and M3 are certified on staged local
  machine-readable evidence surfaces; the unsupported M3 reliability claim has
  been removed from canonical live materials

### Submission Package Audit Remediation Track (NEW — 2026-03-26)

- **PURPOSE:** Audit and remediate package-level inconsistencies across source
  markdown, DOCX artefacts, supplements, references, cover letters, and
  project-management package docs
- **SCOPE:** All 3 manuscripts (M1/M2/M3) + package status files and upload
  candidates
- **STATUS:** COMPLETE — see
  `conductor/tracks/submission-package-audit-remediation/`
- **CURRENT BASELINE:** `manuscripts/project-management/SUBMISSION-PACKAGE-AUDIT-2026-03-26.md`
- **CURRENT STATE:** canonical manuscript, supplement, and cover-letter DOCX
  artefacts now align to the certified source state for M1, M2, and M3

### Substack Adaptation and Visuals Track (NEW — 2026-03-28)

- **PURPOSE:** Reframe the certified manuscript findings for a more
  conversational Substack audience and propose supporting non-publication
  visuals
- **SCOPE:** M1, M2, and M3 as public-facing newsletter material rather than
  journal submissions
- **STATUS:** ACTIVE — see
  `conductor/tracks/substack-adaptation-and-visuals/`
- **CURRENT STATE:** portfolio thesis, synthesis-essay brief, and per-post
  M1/M3/M2 deep-dive briefs now exist with concrete hooks, takeaway logic,
  methods-box constraints, and non-journal image guidance; first-draft prose
  now exists for the synthesis essay and all three deep dives; a ranked image
  commissioning shortlist also exists for practical execution

## Recommended Next Cleanup

1. Track the ANZ compatibility window explicitly, including when legacy package
   and binary names can be retired.
2. Keep `metadata.json`, `index.md`, and `plan.md` aligned as the transition
   moves from migration to deprecation.
3. Use `submission-package-audit-remediation` as the package source of truth for
   manuscript upload readiness until package and verification blockers are
   resolved.
4. Promote backlog entries back into `conductor/tracks` only when they gain a
   real owner, scope, and plan.
5. Open a follow-on track only when source-derived legal relationship extraction
   or dataset-level publication metadata becomes a concrete delivery need.
