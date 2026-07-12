# Rust migration compatibility contract

This document is the migration boundary for a future Rust implementation. The
TypeScript implementation remains the release authority until every contract
below has an executable Rust parity test and the release gates pass.

## Public contracts

| Surface       | Required compatibility                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Package       | Preserve `nz-legislation-tool` metadata, install instructions, and semver policy.                                         |
| CLI binaries  | Preserve `nzlegislation`, `anzlegislation`, and `legislation`; retain the MCP binary aliases.                             |
| Commands      | Preserve help, search, get, export, cite, batch, cache, capabilities, config, generate, and stream behavior.              |
| MCP           | Preserve tool names, structured errors, provider capability checks, provenance fields, and unsupported-provider behavior. |
| Providers     | Preserve jurisdiction identifiers, capability states, source cards, and no-placeholder-data guarantees.                   |
| Output        | Preserve table, JSON, CSV, and metadata output schemas, including exit-code semantics.                                    |
| Configuration | Preserve environment variables, config-file locations, secure-secret handling, and redaction behavior.                    |

## Required parity evidence

Before Rust becomes a release candidate, the migration must provide:

1. Golden CLI fixtures for every compatibility binary and command.
2. Contract tests for MCP request/response schemas and structured failures.
3. Provider fixture tests for NZ, Commonwealth, Queensland, and every later
   jurisdiction admitted by the capability manifest.
4. Output snapshots for table, JSON, CSV, and provenance metadata.
5. Security tests covering input validation, URL policy, secret redaction,
   cache boundaries, and dependency audit results.
6. A performance comparison against the TypeScript baseline, with no regression
   in correctness or provenance.

## Migration gates

- No package split or second repository.
- No removal of TypeScript compatibility aliases.
- No publication of a Rust artifact until parity, security, provenance, and
  release checks pass in CI.
- The TypeScript implementation remains the fallback until a documented,
  reversible cutover decision is approved.

The Rust workspace includes a non-publishing `legislation-contract` binary. It
validates command and output-format compatibility only; it does not fetch legal
data, expose MCP, or authorize runtime cutover.
