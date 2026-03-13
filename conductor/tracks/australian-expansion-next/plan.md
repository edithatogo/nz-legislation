# Implementation Plan: Australian Expansion on `next`

## Phase 1: Discovery and Port Design

- [x] Task: Audit the archived Queensland and Commonwealth code in the legacy branch and capture what is reusable versus stub-only
- [x] Task: Build `jurisdiction-readiness.md` for Queensland and Commonwealth covering source, identifiers, retrieval, versioning, citation, CLI, MCP, and known gaps
- [x] Task: Document upstream source legality, reliability, and versionability for each Australian jurisdiction
- [x] Task: Define the target provider/jurisdiction architecture for the active TypeScript codebase
- [x] Task: Write and approve `provider-architecture-adr.md` before Phase 2 starts
- [x] Task: Map CLI, MCP, and package-surface changes required for additive Australian support
- [x] Task: Define explicit jurisdiction-selection semantics for CLI flags, MCP parameters, config defaults, and future API surfaces
- [x] Task: Evaluate where Akoma Ntoso, ELI-style identifiers/metadata, and Schema.org `Legislation` should shape the internal and external model

### Phase 1 Outcome

- Archived AU code is confirmed to be scaffold-level only.
- Commonwealth is the preferred first implementation target.
- Queensland remains viable, but requires credentialed API handling.
- The active package should adopt a first-party provider layer rather than
  revive the archived plugin-package model.

## Phase 2: Core Port

- [x] Task: Port Commonwealth support into the active repo behind the `next` branch
- [x] Task: Port Queensland support into the active repo behind the `next` branch
- [x] Task: Implement shared abstractions needed for multi-jurisdiction search, retrieval, and citation flows
- [x] Task: Normalize identifiers and metadata so cross-jurisdiction outputs remain internally consistent
- [x] Task: Ensure Australian support is additive and does not break NZ defaults or existing public contracts

### Phase 2 Progress

- Commonwealth and Queensland are now implemented as first-party providers within the active repo on the `next` branch.
- CLI and MCP jurisdiction routing now treat `au-comm` and `au-qld` as real additive surfaces instead of placeholders.
- A normalized provider model is now used for all jurisdictions, including the default NZ provider.

## Phase 3: Contract Hardening

- [x] Task: Add regression tests proving NZ behavior remains stable
- [x] Task: Add Australian contract tests for CLI and MCP surfaces
- [x] Task: Add end-to-end smoke tests for at least one real retrieval flow per Australian jurisdiction
- [x] Task: Extend compatibility documentation for CLI, MCP, and prerelease package behavior
- [x] Task: Document supported jurisdictions, known gaps, and release guardrails
- [x] Task: Confirm prerelease publishing on `next` continues to satisfy provenance, trusted publishing, and environment-bound release governance

## Phase 4: Release Readiness

- [x] Task: Populate `prerelease-go-no-go.md` with explicit release thresholds and evidence
- [x] Task: Decide whether the Australian work qualifies for a prerelease from `next`
- [x] Task: Prepare prerelease notes and compatibility updates for the `next` lane
- [x] Task: Confirm `release-next.yml` is ready for a real Australian prerelease publish when the implementation is complete
- [x] Task: Execute `changeset version` to prepare `v1.2.0-next.0` prerelease packages
