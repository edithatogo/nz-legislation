# Security and submission gates v9

## Why

MCP registries and IDE/plugin marketplaces can expose users to supply-chain risk, prompt injection, overbroad permissions, and misleading source claims.

## Gate A — legal-data truthfulness

- no fabricated legal metadata
- source-backed results or structured unsupported errors
- source cards in responses

## Gate B — package provenance

- npm trusted publishing or equivalent
- GitHub release provenance
- reproducible build notes
- dependency audit

## Gate C — MCP safety

- least-privilege tools
- no shell execution
- no arbitrary file access
- clear API-key handling
- prompt-injection notes
- security.md updated

## Gate D — extension safety

- no hidden telemetry
- no credential exfiltration
- API keys stored through host-safe secret storage
- commands documented
- permission model documented

## Gate E — listing truthfulness

- capability matrix matches runtime manifest
- AU status clearly marked
- official-source-first claims supported
- no “production” wording until release gate
