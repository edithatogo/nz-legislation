# ADR 0007: Keep Distribution and Integration Surfaces in One Repository

## Status

Proposed

## Context

The project needs npm publishing, website publishing, MCP registry submission, assistant/coding-agent integrations, IDE extensions, and future Rust migration planning.

Splitting each integration into a separate repository would create coordination overhead and make capability drift more likely.

## Decision

Keep one canonical repository.

Add integration artifacts under `integrations/` and manage distribution through one capability manifest and one Conductor umbrella track.

## Consequences

- All public surfaces share the same source of truth.
- Website, npm, MCP, and extension copy can be checked for consistency.
- Future Rust migration can use the same fixtures and schemas.
- The repo needs clear folder governance to avoid clutter.
