# Spec: Rust Migration Readiness

## Scope

Advance a staged Rust migration inside this repository without splitting the
package or creating a separate repository. The TypeScript implementation remains
the release authority until parity gates pass.

## Requirements

- Preserve language-neutral runtime, CLI, MCP, export, provider, and package
  contracts.
- Keep test parity expectations executable and documented before cutover.
- Keep compatibility names stable.

## Contracts

- **Runtime:** Rust work is staged behind parity gates; no production cutover is
  permitted until those gates pass.
- **Compatibility:** any future implementation must preserve current CLI,
  package, MCP, export, and provider contracts.
- **Publication:** no Rust package, repository, or migration announcement until
  release governance explicitly approves it.
