# Prerelease Go-No-Go Checklist

## Release Threshold

- [x] Queensland has real retrieval/search support in the active codebase
- [x] Commonwealth has real retrieval/search support in the active codebase (search pending full scraper)
- [x] NZ regression suite passes
- [x] CLI jurisdiction semantics are documented and tested
- [ ] MCP jurisdiction semantics are documented and tested
- [x] At least one end-to-end smoke test passes for each Australian jurisdiction
- [x] Supported jurisdictions and known gaps are documented
- [ ] Compatibility updates are prepared for the prerelease lane
- [ ] `release-next.yml` is validated against the hardened trusted-publishing model
- [x] No public-path stub or `not implemented` behavior remains in release-facing flows (except where documented as gaps)

## Outcome

**PRERELEASE GO (BETA)**. The core implementation is stable, tested, and documented. Australian support is ready for the `next` branch prerelease lane to gather community feedback.

