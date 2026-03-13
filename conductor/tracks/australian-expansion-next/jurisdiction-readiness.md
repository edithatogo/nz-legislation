# Jurisdiction Readiness Matrix

| Jurisdiction | Official source | Identifier model | Search | Section retrieval | Version/history | Citation | CLI | MCP | Known gaps |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Queensland | Official Queensland Legislation API | `act-2006-060` | Implemented (Requires API Key) | Pending | Implemented (Versions) | Implemented (`australian`) | Implemented (`--jurisdiction`) | Implemented | Requires API key; Search implementation pending full pagination logic |
| Commonwealth | Official Federal Register API | `C2024A00124` | Implemented (Public) | Pending | Implemented (Versions) | Implemented (`australian`) | Implemented (`--jurisdiction`) | Implemented | Search implementation pending full scraper integration |

## Audit Summary

### Current Implementation Status (next branch)

- Commonwealth and Queensland are implemented as first-party providers in `src/providers/`.
- CLI and MCP routing are fully functional via the `--jurisdiction` flag.
- Citations support the new `australian` style.
- Integration and E2E tests prove jurisdiction routing and basic provider behavior.


### Readiness conclusion

- Commonwealth is the stronger first implementation target because the official Register API is public, OpenAPI-described, and does not require API keys.
- Queensland is viable, but it is operationally harder because the official API requires registration and is governed by its own access agreement.
- Commonwealth now has a meaningful implementation path on the feature branch, but neither jurisdiction is ready for prerelease promotion from the active codebase yet.

## Notes

- This matrix is now populated from the archived code audit plus current official source review.
- No jurisdiction should be promoted to release readiness while any public-path capability remains stub-only or undocumented.
