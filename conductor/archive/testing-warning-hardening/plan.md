# Implementation Plan: Testing Warning Hardening

## Phase 1: Track Remaining Failures Precisely

- [x] Task: Capture the current warning and error-path failures
  - [x] Reproduce the package test run with the current command path.
  - [x] Confirm the exact source of the `--localstorage-file` warning.
  - [x] Confirm why non-2xx integration tests hang under the current transport/mocking setup.

## Phase 2: Remove Test Runtime Warnings

- [x] Task: Isolate config persistence from warning-prone initialization
  - [x] Inspect `src/config.ts` and its dependencies for eager side effects during import.
  - [x] Refactor config storage creation so tests can run without the warning-producing path.
  - [x] Add or update tests to verify config behavior still works after the refactor.

## Phase 3: Restore Deterministic Error-Path Coverage

- [x] Task: Make API client error handling directly testable
  - [x] Refactor client creation so retry and transport behavior can be controlled in tests.
  - [x] Replace hanging non-2xx integration cases with deterministic tests at the right layer.
  - [x] Re-enable targeted coverage for 401, 404, and 429 paths without skip markers.

## Phase 4: Normalize the Validation Path

- [x] Task: Make the project-local test command reliable
  - [x] Ensure Vitest config resolves project aliases consistently.
  - [x] Remove any remaining one-off test harness workarounds that are no longer needed.
  - [x] Validate the intended repo-local test command from the package directory.

## Phase 5: Verify and Close

- [x] Task: Run full validation and update Conductor artifacts
  - [x] Run the full package test suite and confirm no failures.
  - [x] Confirm the warning is gone from the validated run.
  - [x] Mark completed work in this plan and summarize the final outcome in track metadata if needed.
