# Release v1.1.0 - Instructions

## Quick Release (Recommended)

Run the release script:

```bash
cd nz-legislation-tool
bash scripts/release-v1.1.0.sh
```

## Manual Release

If you prefer to run commands manually:

```bash
cd nz-legislation-tool

# 1. Stage all changes
git add .

# 2. Commit release
git commit -m "chore: Release v1.1.0 - Performance and Scalability"

# 3. Version with changesets
npx changeset version

# 4. Publish to npm
npx changeset publish

# 5. Push tags
git push --follow-tags
```

## Verify Release

1. Check npm: https://www.npmjs.com/package/nz-legislation-tool
2. Check GitHub releases: https://github.com/edithatogo/nz-legislation/releases
3. Test installation: `npm install -g nz-legislation-tool@latest`

## Release Notes

See `RELEASE_v1.1.0.md` for full release notes.

## What's New in v1.1.0

### New Commands
- `nzlegislation batch` - Bulk operations
- `nzlegislation stream` - Streaming exports
- `npm run bench:audit` - Performance audit
- `npx tsx scripts/bundle-analyze.ts` - Bundle analysis

### Performance Improvements
- API optimization (pooling, retry, deduplication)
- Load testing infrastructure (k6)
- Performance monitoring dashboard
- Comprehensive scorecards

### Documentation
- Performance dashboard
- Scorecards system
- Metrics interpretation guide

---

**Release Date:** 2026-03-10  
**Previous Version:** v1.0.1  
**Type:** Minor Release (New Features)
