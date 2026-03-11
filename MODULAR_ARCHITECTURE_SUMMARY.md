# Modular Architecture Decision - Summary

**Date:** 2026-03-10  
**Decision:** ✅ Australian APIs will be **optional, modular plugins**

---

## The Question

> "I wonder whether the Australian APIs could be considered optional, so that the wrapper is modular?"

## The Answer

**Yes!** This is the correct architectural approach. Australian jurisdictions will be implemented as **optional plugin modules** that users install separately from the core NZ tool.

---

## Architecture

### Before (Monolithic)
```
nz-legislation-tool (v1.x)
├── NZ Legislation ✅
├── Queensland ✅
├── Commonwealth ✅
├── NSW ✅
└── ... (all bundled)
```

### After (Modular)
```
nz-legislation-tool (v2.0.0)     # Core - NZ only
├── @nz-legislation/queensland   # Optional plugin
├── @nz-legislation/commonwealth # Optional plugin
├── @nz-legislation/nsw          # Optional plugin
└── ... (install as needed)
```

---

## Benefits

### For Users

| Benefit | Description |
|---------|-------------|
| **Smaller Install** | Core is NZ-only (~1MB vs ~10MB) |
| **Faster Startup** | Only load what you use |
| **Choice** | Install only needed jurisdictions |
| **Stability** | Australian bugs don't affect NZ |

### For Development

| Benefit | Description |
|---------|-------------|
| **Isolation** | Each jurisdiction is separate |
| **Testing** | Test plugins independently |
| **Maintenance** | Fix one without breaking others |
| **Extensibility** | Easy to add new jurisdictions |
| **Community** | Others can contribute plugins |

---

## Usage

### Installation

```bash
# Core (NZ only) - always installed
npm install -g nz-legislation-tool

# Add Australian jurisdictions as needed
npm install -g @nz-legislation/queensland
npm install -g @nz-legislation/commonwealth
```

### Commands

```bash
# NZ only (default)
nzlegislation search --query "health"

# Specific jurisdiction
nzlegislation search --query "health" --jurisdiction au-qld

# List available
nzlegislation jurisdictions list

# Show installed plugins
nzlegislation plugins list
```

---

## Implementation Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 1. Core Plugin System | 2 weeks | Plugin infrastructure |
| 2. Queensland Plugin | 3 weeks | First Australian plugin |
| 3. Major States | 4 weeks | Commonwealth, NSW, VIC |
| 4. Remaining | 4 weeks | All 9 jurisdictions |

**Total:** 13 weeks (reduced from 16)

---

## Technical Details

### Plugin Interface

```typescript
interface LegislationProvider {
  readonly jurisdiction: string;  // 'au-qld'
  readonly name: string;          // 'Queensland'
  readonly enabled: boolean;
  
  search(params: SearchParams): Promise<SearchResults>;
  getWork(id: string): Promise<Work>;
  getVersions(id: string): Promise<Version[]>;
  getCitation(work: Work, style: string): string;
}
```

### Plugin Discovery

```typescript
// Auto-discover installed plugins
const plugins = [
  '@nz-legislation/queensland',
  '@nz-legislation/commonwealth',
  // ...
];

for (const plugin of plugins) {
  try {
    const provider = require(plugin);
    registerProvider(provider);
  } catch {
    // Not installed - skip
  }
}
```

---

## Migration Path

### Current Users (v1.x)

```bash
# After v2.0.0 release
npm install -g nz-legislation-tool@latest

# If you need Australian support
npm install -g @nz-legislation/queensland
```

### New Users

```bash
# NZ only (default)
npm install -g nz-legislation-tool

# Add Australian as needed
npm install -g @nz-legislation/queensland
```

---

## Package Structure

### Core Package

```json
{
  "name": "nz-legislation-tool",
  "version": "2.0.0",
  "description": "New Zealand legislation CLI (core)",
  "peerDependenciesMeta": {
    "@nz-legislation/queensland": { "optional": true },
    "@nz-legislation/commonwealth": { "optional": true }
  }
}
```

### Plugin Package

```json
{
  "name": "@nz-legislation/queensland",
  "version": "1.0.0",
  "description": "Queensland legislation plugin",
  "peerDependencies": {
    "nz-legislation-tool": "^2.0.0"
  }
}
```

---

## Why This Approach?

### Separation of Concerns
- NZ and Australian are different legal systems
- Different data sources (API vs scraping)
- Different update cycles

### Risk Mitigation
- Scraper changes don't affect core
- Australian bugs don't break NZ
- Independent testing

### Future-Proof
- Easy to add Pacific jurisdictions (Fiji, Samoa, etc.)
- Community can contribute plugins
- Plugin marketplace potential

---

## Next Steps

1. **Refactor Core:** Extract jurisdiction interface (Week 1)
2. **Create Plugin System:** Plugin loader (Week 1)
3. **Split Australian Code:** Move to separate packages (Week 2-3)
4. **Release v2.0.0:** Core + plugin system (Week 4)
5. **Release Plugins:** Queensland, Commonwealth, etc. (Week 5-13)

---

## Decision Record

**Architecture Decision Record (ADR):** `conductor/tracks/australian-legislation-implementation/ARCHITECTURE_DECISION.md`

**Updated Plan:** `conductor/tracks/australian-legislation-implementation/plan.md`

**Phase 1 Plan:** `conductor/tracks/australian-legislation-implementation/PHASE_1_PLAN.md`

---

**Decision:** ✅ Modular/Optional  
**Core:** NZ Legislation  
**Extensions:** Australian plugins  
**Timeline:** 13 weeks

---

*This is the correct architectural approach - modular, optional, and maintainable.*
