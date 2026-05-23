# Spec: Rust Migration Readiness

## Scope

Record future Rust migration readiness without starting a rewrite, splitting the
package, or creating a separate repository.

## Requirements

- Preserve language-neutral runtime, CLI, MCP, export, provider, and package
  contracts.
- Keep test parity expectations documented before any implementation language
  work begins.
- Keep compatibility names stable.

## Contracts

- **Runtime:** no Rust runtime is introduced by this track.
- **Compatibility:** any future implementation must preserve current CLI,
  package, MCP, export, and provider contracts.
- **Publication:** no Rust package, repository, or migration announcement until
  release governance explicitly approves it.
