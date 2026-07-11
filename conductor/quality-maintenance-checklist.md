# Quality and Maintenance Tooling Baseline — `cli-legislation-nz`

## Purpose
Use this checklist to standardize quality, prose, dependency maintenance, coverage, and profiling tooling across each owning subrepo without forcing irrelevant tools into repos that do not need them.

## Classification Values
- `required`: must be present and enforced in this repo.
- `conditional`: must be present when the repo emits the relevant artifact or metric.
- `optional`: useful but not a maturity blocker.
- `deferred`: desirable but blocked by CI, dependency, permissions, or priority.
- `not_applicable`: not relevant to this repo.

## Baseline Policy
- Vale is required for every repo with Markdown or prose.
- A markdown style file is required for every repo with Markdown, either repo-local or inherited through a documented root template.
- Renovate is required for every real GitHub repo unless dependency updates are intentionally managed elsewhere.
- Codecov is conditional: required when CI produces coverage and coverage is a meaningful quality signal.
- Scalene is conditional: required for Python data, ingestion, NLP, or performance-sensitive repos; not required for TypeScript-only or lightweight orchestration repos.

## Checklist

| Tool | Classification | Required files/config | Required evidence | Notes |
|---|---|---|---|---|
| Vale prose linter | required | `.vale.ini`, `.github/styles/` or documented inherited style path | docs/prose lint command or CI workflow | Present. Extends root `.vale.ini`; StylesPath=`../.github/styles` (shared root styles). MinAlertLevel=error, uses write-good package, Vocab=NZLegislation. |
| Markdown style | required | `.markdownlint.json` or documented equivalent | markdownlint command or CI workflow | Created from root template. Extends default; MD013 line_length=160, MD033/041 disabled, MD024/046/048 customized. |
| Renovate | required | `renovate.json` or inherited org config reference | enabled Renovate app or workflow evidence | Present. Weekly schedule (Pacific/Auckland), auto-merge minor/patch, major requires review, GitHub Actions auto-merge, Node.js auto-merge. |
| Codecov | conditional | `codecov.yml` plus CI coverage upload | coverage artifact and upload step | Present. Threshold 70% project / 80% patch, component management for CLI commands, API client, output formatting. |
| Scalene | not_applicable | — | — | TypeScript CLI — no Python performance-sensitive code. |

## Recommended Defaults By Repo Type

| Repo type | Vale | Markdown style | Renovate | Codecov | Scalene |
|---|---|---|---|---|---|
| TypeScript CLI/MCP | required | required | required | conditional | not_applicable |

## Adoption Steps
1. Inventory current files and CI workflows.
2. Classify each tool with rationale.
3. Add missing config from the shared template.
4. Add or update CI only after local commands are known.
5. Commit each repo-local adoption separately.
6. Push and check GitHub Actions after each phase.

## Guardrails
- Do not add Codecov without a coverage-producing CI job.
- Do not add Scalene to repos where no profiling target exists.
- Do not rely only on root config unless the subrepo CI explicitly reads it.
- Keep generated coverage/profiling outputs out of source control unless they are reviewed evidence artifacts.
