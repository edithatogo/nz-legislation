# ANZ Platform Release and Distribution

**Track ID:** anz-platform-release-and-distribution  
**Status:** ACTIVE  
**Priority:** P0  
**Created:** 2026-05-19

## Summary

This is the umbrella delivery track for the single-repo ANZ Legislation platform.

It merges release reconciliation, provider hardening, capability truth, npm/site publishing, MCP registry submission, assistant/IDE integration pathways, and long-term Rust migration readiness.

## Single-repo rule

All integration artifacts remain in this repository. Do not create separate repos for MCP, Claude, Codex, Copilot, VS Code, Gemini, Qwen, or future Rust work.

## Exit criteria

- release branches reconciled
- no-placeholder legal data gate passes
- capability manifest implemented
- MCP/export provider-aware
- npm and website/docs surfaces accurate
- MCP registry submission package ready
- assistant/IDE integration artifacts documented
- submission gates defined and enforced
- Rust migration readiness preserved as future work
