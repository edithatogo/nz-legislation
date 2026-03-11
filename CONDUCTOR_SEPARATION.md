# Conductor System Separation

**Date:** 2026-03-11  
**Status:** ✅ Architecture defined

---

## Overview

Three conductor systems with clean separation:

```
┌─────────────────────────────────────────────────────────────┐
│                    BASE CONDUCTOR                           │
│  (.qwen/extensions/conductor/)                              │
│  Shared patterns, templates, track structure                │
└─────────────────────┬───────────────────────────────────────┘
                      │ extends
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌──────────────────┐      ┌────────────────────────────┐
│  TOOL CONDUCTOR  │      │  RESEARCH CONDUCTOR        │
│                  │      │                            │
│  nz-legislation/ │      │  nz-health-research/       │
│  conductor/      │      │  conductor/                │
│                  │      │                            │
│  Software dev    │      │  Academic research         │
│  9 tracks ✅     │      │  5 tracks ⏳               │
│  npm releases    │      │  NZMJ papers               │
└──────────────────┘      └────────────────────────────┘
```

---

## 1. Base Conductor (Shared)

**Location:** `.qwen/extensions/conductor/`

**Purpose:** Shared patterns and templates

**Contents:**
- Track structure templates (`index.md`, `spec.md`, `plan.md`)
- Stage gate patterns
- Review checklists
- Common workflows

**Used By:** Both Tool and Research conductors

---

## 2. Tool Conductor (Software)

**Location:** `nz-legislation/conductor/`

**Repository:** `nz-legislation/` (existing)

**Purpose:** Software development workflow

### Configuration Files
- `index.md` - Project context
- `product.md` - Software product definition
- `tech-stack.md` - Node.js, TypeScript, npm
- `workflow.md` - Software development workflow
- `tracks.md` - Software track registry

### Tracks (9 total)
| Track | Status |
|-------|--------|
| TypeScript CLI Implementation | ✅ Complete |
| Comprehensive Testing | ✅ Complete |
| Code Hardening & Maturation | ✅ Complete |
| CI/CD Automation Optimization | ✅ Complete |
| Documentation Optimization | ✅ Complete |
| Developer Experience Enhancement | ✅ Complete |
| Performance & Scalability | ✅ Complete |
| Testing Warning Hardening | ✅ Complete |
| Australian Legislation Implementation | 🔄 In Progress |

### Output
- npm package releases
- GitHub releases
- Software documentation

---

## 3. Research Conductor (Academic)

**Location:** `nz-health-research/conductor/` (NEW - to be created)

**Repository:** `nz-health-research/` (NEW - to be created)

**Purpose:** 5-paper NZMJ research programme

### Configuration Files
- `index.md` - Research programme context
- `protocol.md` - Research methodology ✅ Created
- `corpus.md` - Legislation corpus definition (to create)
- `workflow.md` - Research workflow (to create)
- `tracks.md` - Research track registry (to create)

### Documentation
- `NZMJ_SUBMISSION_GUIDELINES.md` ✅ Created
- `NZMJ_FIT_CHECKLIST.md` ✅ Created
- `PUBLICATION_PIPELINE.md` ✅ Created
- `RESEARCH_IMPROVEMENTS.md` ✅ Created

### Tracks (5 total)
| Track | Research Question | Status |
|-------|-------------------|--------|
| **P1** | Legislative Volatility | ✅ Reframed, ready |
| **P2** | Accountability Drift | ⏳ Needs enhancement |
| **P3** | Governance Load | ⏳ Needs enhancement |
| **P4** | Rights vs Coercion | ⏳ Needs enhancement |
| **P5** | Māori Governance Equity | ⏳ Needs enhancement + Māori co-authors |

### Output
- 5 NZMJ journal articles
- Policy briefs
- Research data (shared on acceptance)

---

## Key Differences

| Aspect | Tool Conductor | Research Conductor |
|--------|---------------|-------------------|
| **Location** | `nz-legislation/conductor/` | `nz-health-research/conductor/` |
| **Repository** | `nz-legislation/` | `nz-health-research/` |
| **Purpose** | Software development | Academic research |
| **Tracks** | 9 software tracks | 5 research tracks |
| **Workflow** | Development sprints | 7-phase research workflow |
| **Output** | npm package | NZMJ articles |
| **Review** | Code review | Peer review |
| **Ethics** | Not required | Required |
| **Authorship** | Software contributors | Academic co-authors (ICMJE) |
| **Timeline** | Ongoing | 12-16 weeks per paper |

---

## Implementation Status

### ✅ Complete

1. **Tool Conductor** - Fully operational in `nz-legislation/conductor/`
2. **Research Protocol** - Created at `research-conductor/protocol.md`
3. **NZMJ Guidelines** - Verified and integrated
4. **Conductor Architecture** - Documented

### ⏳ To Implement

1. **Create research repository** - `nz-health-research/`
2. **Move research tracks** - P1-P5 to `research-conductor/tracks/`
3. **Move research documentation** - To `research-conductor/docs/`
4. **Create corpus.md** - Define legislation corpus
5. **Create workflow.md** - Research workflow (7 phases)
6. **Create tracks.md** - Research track registry
7. **Submit ethics application** - Required before analysis
8. **Appoint Principal Investigator** - For research programme
9. **Create OSF project** - For pre-registration

---

## Directory Structure

### Current (Mixed)
```
Project Root/
├── conductor/
│   ├── tracks/
│   │   ├── p1-legislative-volatility/     ← Research (should move)
│   │   ├── p2-accountability-drift/       ← Research (should move)
│   │   ├── p3-governance-load/            ← Research (should move)
│   │   ├── p4-rights-vs-coercion/         ← Research (should move)
│   │   ├── p5-maori-governance-equity/    ← Research (should move)
│   │   └── ... (software tracks)          ← Software ✅
│   ├── PUBLICATION_PIPELINE.md            ← Research (should move)
│   ├── NZMJ_SUBMISSION_GUIDELINES.md      ← Research (should move)
│   └── ... (mixed)
└── research-conductor/
    └── protocol.md                        ✅ Created
```

### Target (Separated)
```
nz-legislation/                            ← Software repository
└── conductor/
    ├── index.md
    ├── product.md
    ├── tech-stack.md
    ├── workflow.md
    ├── tracks.md
    └── tracks/
        └── (software tracks only)         ← Software only ✅

nz-health-research/                        ← Research repository (NEW)
├── conductor/
│   ├── index.md
│   ├── protocol.md                        ✅ Created
│   ├── corpus.md                          ← To create
│   ├── workflow.md                        ← To create
│   ├── tracks.md                          ← To create
│   ├── NZMJ_SUBMISSION_GUIDELINES.md      ← Move here
│   ├── NZMJ_FIT_CHECKLIST.md              ← Move here
│   ├── PUBLICATION_PIPELINE.md            ← Move here
│   ├── RESEARCH_IMPROVEMENTS.md           ← Move here
│   └── tracks/
│       ├── p1-legislative-volatility/     ← Move here
│       ├── p2-accountability-drift/       ← Move here
│       ├── p3-governance-load/            ← Move here
│       ├── p4-rights-vs-coercion/         ← Move here
│       └── p5-maori-governance-equity/    ← Move here
├── data/                                  ← Research data
├── analysis/                              ← Analysis scripts
├── manuscripts/                           ← Draft papers
└── README.md                              ← Research programme README
```

---

## Benefits of This Architecture

1. **Clean Separation** - No mixing of software and research
2. **Independent Evolution** - Each conductor evolves for its purpose
3. **Shared Best Practices** - Both benefit from base conductor patterns
4. **Clear Ownership** - Software maintainers vs. research team
5. **Separate Ethics** - Research ethics completely isolated
6. **Separate Repositories** - Different access controls, different audiences
7. **Proper Attribution** - Software citation vs. paper citation

---

## Next Steps

### Before P1 Phase 1

1. **Acknowledge architecture** - Confirm this separation is correct
2. **Create research repository** - `nz-health-research/`
3. **Move research tracks** - P1-P5 to research repository
4. **Move documentation** - Research docs to research repository
5. **Create remaining conductor files** - `corpus.md`, `workflow.md`, `tracks.md`
6. **Appoint Principal Investigator** - For ethics application
7. **Submit ethics application** - Required before analysis

### Before P1 Phase 4 (Analysis)

1. **Complete ethics approval** - Receive approval letter
2. **OSF pre-registration** - Register P1 analysis plan
3. **Authorship agreements** - Document for P1

---

**Summary:** Clean conductor architecture with Tool Conductor (`nz-legislation/conductor/`) separate from Research Conductor (`nz-health-research/conductor/`), both referencing shared Base Conductor patterns.

**Created:** 2026-03-11  
**Status:** ✅ Architecture defined, ⏳ Awaiting implementation
