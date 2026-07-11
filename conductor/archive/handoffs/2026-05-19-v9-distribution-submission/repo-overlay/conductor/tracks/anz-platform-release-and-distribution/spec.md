# Spec: ANZ Platform Release and Distribution

## Requirements

### R1: One repo

All distribution and integration artifacts must live in this repo.

### R2: Runtime truth before submission

No registry or marketplace submission until no-placeholder and capability gates pass.

### R3: Capability manifest as source of truth

Docs, website, CLI, MCP, export metadata, and listing copy must align with runtime capabilities.

### R4: Host-specific integration folders

Use:

```text
integrations/mcp
integrations/claude
integrations/codex
integrations/github-copilot
integrations/vscode
integrations/gemini
integrations/qwen
```

### R5: Submission matrix

Maintain a matrix that records:

- target
- artifact
- owner
- current status
- current docs verified date
- submission URL/process
- security gate
- submitted date
- approved/listed date
- next renewal/review date

### R6: Long-term Rust readiness

Keep Rust planning in repo, but do not begin the rewrite in this track.

## Non-goals

- immediate repository rename
- immediate package rename
- public community plugin ecosystem
- unverified marketplace claims
- Rust rewrite
