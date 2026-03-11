# Australian Legislation Implementation - Modular Architecture

**Track:** Australian Legislation Implementation  
**Approach:** Modular/Optional Jurisdictions  
**Status:** ✅ DESIGN DECISION

---

## Architecture Decision: Modular Jurisdictions

### Decision

✅ **Australian jurisdictions will be optional, modular plugins**

The core NZ Legislation Tool will remain NZ-focused, with Australian jurisdictions implemented as **optional plugin modules** that users can install/enable as needed.

---

## Benefits

### 1. **Core Stability**
- NZ functionality remains unchanged
- No breaking changes for existing users
- Australian bugs won't affect NZ users

### 2. **Flexibility**
- Users only install what they need
- Smaller initial install size
- Faster startup for NZ-only users

### 3. **Maintainability**
- Each jurisdiction is isolated
- Easier to test individual modules
- Scraper changes don't affect core

### 4. **Extensibility**
- Easy to add new jurisdictions later
- Community can contribute jurisdiction plugins
- Plugin marketplace potential

---

## Implementation Strategy

### Option 1: NPM Packages (Recommended)

```
nz-legislation-tool/           # Core (NZ only)
├── package.json               # nz-legislation-tool@2.0.0
└── src/
    ├── core/                  # NZ API, CLI framework
    └── plugins/               # Plugin loader

nz-legislation-queensland/     # Plugin 1
├── package.json               # @nz-legislation/queensland@1.0.0
└── src/
    └── QueenslandProvider.ts

nz-legislation-commonwealth/   # Plugin 2
├── package.json               # @nz-legislation/commonwealth@1.0.0
└── src/
    └── CommonwealthProvider.ts
```

**Usage:**
```bash
# Core installation (NZ only)
npm install -g nz-legislation-tool

# Add Queensland (optional)
npm install -g @nz-legislation/queensland

# Add Commonwealth (optional)
npm install -g @nz-legislation/commonwealth
```

### Option 2: Feature Flags

```json
{
  "jurisdictions": {
    "nz": true,
    "au-qld": false,
    "au-comm": false
  }
}
```

**Enable via config:**
```bash
nzlegislation config --enable-jurisdiction au-qld
```

---

## Plugin Interface

```typescript
// Core interface (defined in nz-legislation-tool)
interface LegislationProvider {
  // Metadata
  readonly jurisdiction: string;      // e.g., 'au-qld'
  readonly name: string;              // e.g., 'Queensland'
  readonly enabled: boolean;
  
  // Core operations
  search(params: SearchParams): Promise<SearchResults>;
  getWork(id: string): Promise<Work>;
  getVersions(id: string): Promise<Version[]>;
  
  // Citation
  getCitation(work: Work, style: string): string;
  
  // Health check
  healthCheck(): Promise<HealthStatus>;
}

// Plugin registration
function registerProvider(provider: LegislationProvider): void;
```

---

## Plugin Discovery

### Auto-Discovery

```typescript
// Core scans for installed plugins
const plugins = [
  '@nz-legislation/queensland',
  '@nz-legislation/commonwealth',
  '@nz-legislation/nsw',
  // ...
];

for (const plugin of plugins) {
  try {
    const provider = require(plugin);
    registerProvider(provider);
  } catch {
    // Plugin not installed - skip
  }
}
```

### Manual Registration

```bash
# List available plugins
nzlegislation plugins list

# Install plugin
nzlegislation plugins install @nz-legislation/queensland

# Enable/disable
nzlegislation plugins enable au-qld
nzlegislation plugins disable au-qld

# List active
nzlegislation plugins active
```

---

## Updated Implementation Plan

### Phase 1: Core Plugin System (2 weeks)

**Week 1:**
- [ ] Define LegislationProvider interface
- [ ] Create plugin loader infrastructure
- [ ] Add plugin discovery mechanism
- [ ] Create plugin CLI commands

**Week 2:**
- [ ] Plugin registration system
- [ ] Jurisdiction abstraction layer
- [ ] Multi-jurisdiction search
- [ ] Release v2.0.0-alpha (core only)

### Phase 2: Queensland Plugin (3 weeks)

**Week 3-4:**
- [ ] Create @nz-legislation/queensland package
- [ ] Implement Queensland scraper
- [ ] Implement QueenslandProvider
- [ ] Test as standalone plugin

**Week 5:**
- [ ] Documentation
- [ ] Release @nz-legislation/queensland@1.0.0
- [ ] Release v2.0.0 (core + Queensland plugin)

### Phase 3: Additional Plugins (6 weeks)

**Commonwealth (2 weeks):**
- [ ] @nz-legislation/commonwealth package
- [ ] Scraper implementation
- [ ] Release

**Major States (4 weeks):**
- [ ] @nz-legislation/nsw package
- [ ] @nz-legislation/victoria package
- [ ] Release v2.1.0

### Phase 4: Remaining Jurisdictions (5 weeks)

**Week 9-13:**
- [ ] WA, SA, TAS, NT, ACT plugins
- [ ] Release v2.2.0 (all jurisdictions)

---

## Package Structure

### Core Package

```json
{
  "name": "nz-legislation-tool",
  "version": "2.0.0",
  "description": "New Zealand legislation CLI (core)",
  "peerDependencies": {
    "@nz-legislation/queensland": "^1.0.0",
    "@nz-legislation/commonwealth": "^1.0.0"
  },
  "peerDependenciesMeta": {
    "@nz-legislation/queensland": {
      "optional": true
    },
    "@nz-legislation/commonwealth": {
      "optional": true
    }
  }
}
```

### Plugin Package

```json
{
  "name": "@nz-legislation/queensland",
  "version": "1.0.0",
  "description": "Queensland legislation plugin for nz-legislation-tool",
  "main": "dist/QueenslandProvider.js",
  "dependencies": {
    "cheerio": "^1.0.0",
    "puppeteer": "^21.0.0"
  },
  "peerDependencies": {
    "nz-legislation-tool": "^2.0.0"
  }
}
```

---

## CLI Changes

### Current (Single Package)

```bash
nzlegislation search --query "health"
# Searches all enabled jurisdictions
```

### New (Modular)

```bash
# NZ only (default)
nzlegislation search --query "health"

# Specific jurisdiction
nzlegislation search --query "health" --jurisdiction au-qld

# All installed
nzlegislation search --query "health" --all

# List jurisdictions
nzlegislation jurisdictions list

# Enable/disable
nzlegislation jurisdictions enable au-qld
```

---

## Configuration

```json
{
  "jurisdictions": {
    "nz": {
      "enabled": true,
      "priority": 1
    },
    "au-qld": {
      "enabled": true,
      "priority": 2
    },
    "au-comm": {
      "enabled": false
    }
  },
  "defaultJurisdiction": "nz",
  "searchAll": false
}
```

---

## Migration Path

### From v1.x (Monolithic) to v2.x (Modular)

**v1.x:**
```json
{
  "name": "nz-legislation-tool",
  "version": "1.1.0"
  // Everything included
}
```

**v2.x:**
```json
{
  "name": "nz-legislation-tool",
  "version": "2.0.0"
  // Core only (NZ)
}
```

**Migration:**
```bash
# Users who want Australian support
npm install -g @nz-legislation/queensland
npm install -g @nz-legislation/commonwealth
# etc.
```

---

## Decision Rationale

### Why Modular?

1. **Separation of Concerns:** NZ and Australian legislation are different legal systems
2. **Independent Release Cycles:** Australian plugins can update independently
3. **Reduced Risk:** Scraper changes in one jurisdiction don't affect others
4. **Community Contributions:** Easier for others to add new jurisdictions
5. **Performance:** Users only load what they need

### Why Not Monolithic?

1. **Bloat:** All users pay for features they don't use
2. **Fragility:** One broken scraper affects all users
3. **Complexity:** Harder to test and maintain
4. **Release Coupling:** All jurisdictions tied to same version

---

## Next Steps

1. **Refactor Core:** Extract jurisdiction interface
2. **Create Plugin System:** Plugin loader and discovery
3. **Split Australian Code:** Move to separate plugin packages
4. **Update Documentation:** Reflect modular architecture
5. **Release v2.0.0:** Core + plugin system
6. **Release Plugins:** Queensland, Commonwealth, etc.

---

**Decision Date:** 2026-03-10  
**Architecture:** Modular/Optional  
**Core Focus:** NZ Legislation  
**Extensions:** Australian jurisdictions as plugins

---

*This architecture decision record supersedes the previous monolithic implementation plan.*
