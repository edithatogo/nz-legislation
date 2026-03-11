# NZ Legislation Tool - Repository Extraction Plan

**Prepared:** 2026-03-11  
**Status:** Ready for Extraction  
**Target Repository:** `edithatogo/nz-legislation`

---

## Executive Summary

The `nz-legislation-tool` is a fully functional, production-ready CLI tool for querying and retrieving New Zealand legislation data. It has been developed as part of a larger health policy research project but is designed as a standalone, reusable tool that can be extracted into its own repository.

### Key Metrics

| Metric | Value |
|--------|-------|
| **Total Commits** | 17 commits |
| **Lines of Code** | ~8,000+ TypeScript |
| **Source Files** | 40+ files |
| **Dependencies** | 11 production, 20+ dev |
| **Test Coverage** | 43 tests (unit, integration, E2E, property, hypothesis) |
| **Documentation** | 1,800+ line function map |
| **TypeScript Errors** | 0 (all resolved) |

---

## Commit History Analysis

### Tool-Specific Commits (17 total)

| Commit | Date | Type | Description |
|--------|------|------|-------------|
| `cb37669` | 2026-03-11 | feat | Finalize MCP and plugin tooling updates |
| `be32a44` | 2026-03-11 | fix | Resolve all TypeScript errors (48 errors fixed) |
| `eef245c` | 2026-03-11 | fix | Apply review suggestions for Australian Legislation Implementation |
| `fa13b7d` | 2026-03-10 | fix | Fix vitest path alias resolution for Windows |
| `4fb3c56` | 2026-03-10 | fix | Sync package with remote API and CI updates |
| `dac7853` | 2026-03-10 | chore | Sync local workspace and conductor status metadata |
| `cd24664` | 2026-03-10 | chore | Complete Track 11 - Advanced Automation & Hardening |
| `b053c60` | 2026-03-10 | chore | Add Track 11 to registry and mark as in progress |
| `11449f3` | 2026-03-10 | docs | Current Schemas & Standards Analysis |
| `1987959` | 2026-03-10 | docs | Integrate Perplexity external research findings |
| `2724e86` | 2026-03-10 | docs | Track 12 Action Summary - Clear Next Steps |
| `c77f719` | 2026-03-10 | docs | Track 12 Phase 2 Planning Documents |
| `1a1718c` | 2026-03-10 | docs | Track 12 Phase 1 Research Complete - Australian API Documentation |
| `f346368` | 2026-03-10 | feat | Add Track 12 - Australian Legislation API Integration Feasibility |
| `76fd01e` | 2026-03-09 | feat | Add track improvements and new DX/Performance tracks |
| `a29e2a7` | 2026-03-09 | feat | Add 4 new tracks for CI/CD automation, code hardening, MCP server |
| `65ca0ea` | 2026-03-09 | feat | Add production improvements (CI/CD, tests, logging, versioning, rate limits) |

### Commits to Exclude from Extraction

The following commits reference "conductor", "track", or health research work and should be filtered or rewritten:

- `dac7853` - chore: sync local workspace and conductor status metadata
- `cd24664` - chore(conductor): Complete Track 11
- `b053c60` - chore(conductor): Add Track 11 to registry
- `11449f3` - docs: Current Schemas & Standards Analysis
- `1987959` - docs: Integrate Perplexity external research findings
- `2724e86` - docs: Track 12 Action Summary
- `c77f719` - docs: Track 12 Phase 2 Planning Documents
- `1a1718c` - docs: Track 12 Phase 1 Research Complete
- `f346368` - feat: Add Track 12 - Australian Legislation API Integration Feasibility
- `76fd01e` - feat: Add track improvements and new DX/Performance tracks
- `a29e2a7` - feat: Add 4 new tracks for CI/CD automation, code hardening, MCP server, and documentation

**Clean Commits for Extraction:** 6 commits
**Commits Requiring Message Rewrites:** 11 commits

---

## Function Catalog Summary

### Core Modules (8 files)

| Module | Functions | Classes | Interfaces | Purpose |
|--------|-----------|---------|------------|---------|
| `cli.ts` | 1 | - | - | Main CLI entry point with error handling |
| `client.ts` | 12 | 1 | 4 | API client with rate limiting, caching, retries |
| `config.ts` | 3 | 1 | 2 | Configuration management (env + persistent) |
| `errors.ts` | - | 6 | 1 | Error hierarchy (APIError, ConfigError, etc.) |
| `logger.ts` | 4 | 1 | 2 | Winston-based logging with daily rotation |
| `validation.ts` | 8 | - | 4 | Input validation with Zod schemas |
| `secure-config.ts` | 5 | - | - | Secure API key storage |
| `env-loader.ts` | 2 | - | 1 | Environment variable loading |

### Command Modules (11 files)

| Command | Functions | Description |
|---------|-----------|-------------|
| `search.ts` | 3 | Search legislation with filters |
| `get.ts` | 3 | Retrieve specific work by ID |
| `export.ts` | 4 | Export to CSV/JSON formats |
| `cite.ts` | 4 | Generate citations (NZMJ, APA, OSCOLA) |
| `config.ts` | 5 | Configuration management CLI |
| `help.ts` | 3 | Interactive help system |
| `batch.ts` | 8 | Batch request processing |
| `cache.ts` | 5 | Cache management commands |
| `stream.ts` | 4 | Streaming exports for large datasets |
| `plugin.ts` | 6 | Plugin management (list, install, discover) |
| `generate.ts` | 3 | Code generation utilities |

### MCP Server (1 file)

| Tool/Resource | Description |
|---------------|-------------|
| `search_works` | Search legislation via MCP |
| `get_work` | Get work by ID via MCP |
| `get_work_versions` | Get versions via MCP |
| `get_version` | Get specific version via MCP |
| `export_works` | Export works via MCP |
| `list_jurisdictions` | List available jurisdictions |
| `resource://works/{id}` | Work details resource |

### Provider System (3 files)

| Module | Classes | Interfaces | Purpose |
|--------|---------|------------|---------|
| `legislation-provider.ts` | 2 | 7 | Base provider + registry |
| `plugin-loader.ts` | 1 | 3 | Dynamic plugin loading |
| `plugin-discovery.ts` | 1 | 2 | Plugin discovery |

### Utility Modules (15+ files)

| Module | Functions | Purpose |
|--------|-----------|---------|
| `batch.ts` | 8 | Batch request processing |
| `streaming.ts` | 6 | Streaming exports |
| `rate-limiter.ts` | 4 | Per-jurisdiction rate limiting |
| `health-monitor.ts` | 6 | Provider health monitoring |
| `fallback-strategy.ts` | 8 | Multi-strategy scraper fallback |
| `performance-budget.ts` | 7 | Performance budget enforcement |
| `scraper-cache.ts` | 10 | LRU caching for scrapers |
| `parallel-executor.ts` | 4 | Parallel task execution |
| `compatibility-matrix.ts` | 5 | Plugin compatibility checking |
| `plugin-marketplace.ts` | 6 | Plugin marketplace |
| `analytics.ts` | 5 | Opt-in analytics |
| `api-optimization.ts` | 7 | API request optimization |

---

## Extraction Steps

### Phase 1: Preparation (Current)

- [x] Map all functions and modules
- [x] Identify commit history
- [x] Resolve all TypeScript errors
- [x] Create FUNCTION_MAP.md
- [ ] Create standalone README.md
- [ ] Create EXTRACTION.md (this document)
- [ ] Verify all tests pass
- [ ] Clean up conductor/track references in commit messages

### Phase 2: Git Filter Creation

```bash
# Create filter-branch script to rewrite commit messages
git filter-branch --msg-filter '
  sed -e "s/(conductor)//g" \
      -e "s/Track [0-9]* - //g" \
      -e "s/Add track improvements and new DX\/Performance tracks/Improve developer experience and performance/g" \
      -e "s/sync local workspace and conductor status metadata/Update project metadata/g" \
      -e "s/Complete Track 11 - Advanced Automation & Hardening/Add advanced automation and hardening/g" \
      -e "s/Add Track 11 to registry and mark as in progress/Add automation track/g" \
      -e "s/Current Schemas & Standards Analysis/Update schemas and standards/g" \
      -e "s/Integrate Perplexity external research findings/Integrate external research/g" \
      -e "s/Track 12 Action Summary - Clear Next Steps/Update action items/g" \
      -e "s/Track 12 Phase 2 Planning Documents/Add planning documents/g" \
      -e "s/Track 12 Phase 1 Research Complete - Australian API Documentation/Document Australian API/g" \
      -e "s/Add Track 12 - Australian Legislation API Integration Feasibility/Add Australian legislation feasibility study/g"
' -- --all

# Filter to only include nz-legislation-tool/ directory
git filter-branch --subdirectory-filter nz-legislation-tool -- --all
```

### Phase 3: Repository Setup

1. **Create GitHub Repository**
   ```bash
   # Create new repository on GitHub
   # Name: nz-legislation
   # Description: CLI tool for searching and retrieving New Zealand legislation data
   # License: Apache-2.0
   ```

2. **Push Filtered History**
   ```bash
   cd nz-legislation-tool
   git remote add origin https://github.com/edithatogo/nz-legislation.git
   git push -u origin main
   ```

3. **Update Package Metadata**
   - Update `package.json` repository URL
   - Update `README.md` with standalone installation instructions
   - Add npm publish configuration

### Phase 4: Integration Documentation

Create documentation for how the health research project uses the tool:

```markdown
## Using nz-legislation-tool in Health Research

### Installation

```bash
# Clone the tool
git clone https://github.com/edithatogo/nz-legislation.git
cd nz-legislation
pnpm install
pnpm build

# Use via npx
npx nzlegislation search --query "health" --limit 10

# Or install globally
pnpm install -g nz-legislation
nzlegislation search --query "health"
```

### API Usage

```typescript
import { searchWorks, getWork } from 'nz-legislation-tool';

// Search
const results = await searchWorks({ query: 'health', limit: 10 });

// Get specific work
const work = await getWork('act_public_1989_18');
```
```

---

## Files to Include in Extraction

### Source Files (40+)

```
nz-legislation-tool/
├── src/
│   ├── cli.ts                          ✅
│   ├── client.ts                       ✅
│   ├── config.ts                       ✅
│   ├── errors.ts                       ✅
│   ├── logger.ts                       ✅
│   ├── validation.ts                   ✅
│   ├── secure-config.ts                ✅
│   ├── env-loader.ts                   ✅
│   ├── version.ts                      ✅
│   ├── commands/
│   │   ├── search.ts                   ✅
│   │   ├── get.ts                      ✅
│   │   ├── export.ts                   ✅
│   │   ├── cite.ts                     ✅
│   │   ├── config.ts                   ✅
│   │   ├── help.ts                     ✅
│   │   ├── batch.ts                    ✅
│   │   ├── cache.ts                    ✅
│   │   ├── stream.ts                   ✅
│   │   ├── plugin.ts                   ✅
│   │   └── generate.ts                 ✅
│   ├── mcp/
│   │   └── server.ts                   ✅
│   ├── models/
│   │   └── index.ts                    ✅
│   ├── output/
│   │   └── index.ts                    ✅
│   ├── providers/
│   │   ├── legislation-provider.ts     ✅
│   │   ├── plugin-loader.ts            ✅
│   │   └── plugin-discovery.ts         ✅
│   └── utils/
│       ├── index.ts                    ✅
│       ├── batch.ts                    ✅
│       ├── streaming.ts                ✅
│       ├── rate-limiter.ts             ✅
│       ├── health-monitor.ts           ✅
│       ├── fallback-strategy.ts        ✅
│       ├── performance-budget.ts       ✅
│       ├── scraper-cache.ts            ✅
│       ├── parallel-executor.ts        ✅
│       ├── compatibility-matrix.ts     ✅
│       ├── plugin-marketplace.ts       ✅
│       ├── analytics.ts                ✅
│       ├── api-optimization.ts         ✅
│       └── ...                         ✅
├── tests/                              ✅
├── benchmarks/                         ✅
├── docs/                               ✅
├── scripts/                            ✅
├── plugins/                            ✅
├── package.json                        ✅
├── tsconfig.json                       ✅
├── vitest.config.ts                    ✅
├── .github/workflows/                  ✅
└── README.md                           ✅ (needs update)
```

### Files to Exclude

```
conductor/                              ❌ (health research tracks)
archive/                                ❌ (health research tracks)
*.md (root level)                       ❌ (health research docs)
```

---

## Post-Extraction Tasks

### For nz-legislation Repository

1. Update README with standalone installation
2. Add npm publish workflow
3. Add release automation
4. Update LICENSE file
5. Add CONTRIBUTING.md
6. Add CODE_OF_CONDUCT.md

### For Health Research Repository

1. Add nz-legislation as git submodule or dependency
2. Update documentation to reference external tool
3. Remove duplicate tool files
4. Focus on health policy analysis

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Lost commit history | Low | Medium | Use git filter-branch carefully, backup first |
| Broken imports | Low | High | Test build after extraction |
| Missing dependencies | Low | High | Verify package.json has all deps |
| Test failures | Medium | Medium | Run full test suite post-extraction |
| Documentation gaps | Medium | Low | Create comprehensive README |

---

## Timeline

| Phase | Duration | Target Date |
|-------|----------|-------------|
| Preparation | 1 day | 2026-03-11 |
| Git Filter Creation | 1 day | 2026-03-12 |
| Repository Setup | 1 day | 2026-03-13 |
| Integration Documentation | 1 day | 2026-03-14 |
| **Total** | **4 days** | |

---

## Success Criteria

- [ ] All 40+ source files extracted
- [ ] 17 commits preserved (with cleaned messages)
- [ ] Zero TypeScript errors
- [ ] All 43 tests passing
- [ ] npm package publishable
- [ ] Standalone README complete
- [ ] Health research project can use tool via npm/git

---

**Status:** Ready for Phase 2 (Git Filter Creation)
