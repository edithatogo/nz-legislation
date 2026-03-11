# Conductor Architecture

**Date:** 2026-03-11  
**Purpose:** Define conductor system architecture across NZ Legislation ecosystem

---

## Overview

Three separate conductor systems:

```
┌─────────────────────────────────────────────────────────────┐
│                    BASE CONDUCTOR                           │
│  (Shared patterns, templates, best practices)               │
│  Location: .qwen/extensions/conductor/                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ References/extends
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌──────────────────┐      ┌────────────────────────────┐
│  TOOL CONDUCTOR  │      │  RESEARCH CONDUCTOR        │
│  (Software dev)  │      │  (Academic research)       │
│                  │      │                            │
│  nz-legislation/ │      │  nz-health-research/       │
│  conductor/      │      │  conductor/                │
└──────────────────┘      └────────────────────────────┘
```

---

## 1. Base Conductor (Shared Patterns)

**Location:** `.qwen/extensions/conductor/` (CLI extension)

**Purpose:** Shared patterns, templates, and best practices

**Contents:**
- Track templates
- Stage gate patterns
- Review checklists
- Common workflows

**Usage:** Both Tool and Research conductors reference these patterns

---

## 2. Tool Conductor (Software Development)

**Location:** `nz-legislation/conductor/`

**Purpose:** Software development workflow for NZ Legislation Tool

**Tracks:**
- TypeScript CLI implementation ✅
- Comprehensive testing ✅
- Code hardening & maturation ✅
- CI/CD automation ✅
- Documentation optimization ✅
- Developer experience ✅
- Performance & scalability ✅
- Australian legislation implementation 🔄

**Workflow:** Software development sprints, npm releases

**Output:** npm package, GitHub releases

---

## 3. Research Conductor (Academic Research)

**Location:** `nz-health-legislation-research/conductor/` (NEW)

**Purpose:** Research programme management for 5 NZMJ papers

**Tracks:**
- P1: Legislative Volatility ⏳
- P2: Accountability Drift ⏳
- P3: Governance Load ⏳
- P4: Rights vs Coercion ⏳
- P5: Māori Governance Equity ⏳

**Workflow:** Research phases (Framing → Corpus → Coding → Analysis → Drafting → Revision → Submission)

**Output:** NZMJ journal articles, policy briefs

---

## Key Differences

| Aspect | Tool Conductor | Research Conductor |
|--------|---------------|-------------------|
| **Location** | `nz-legislation/conductor/` | `nz-health-research/conductor/` |
| **Tracks** | Software development | Research papers (P1-P5) |
| **Phases** | Development sprints | Research phases (7 gates) |
| **Output** | npm package | Journal articles |
| **Review** | Code review | Peer review (NZMJ) |
| **Ethics** | Not required | Required |

---

## File Structure

### Tool Conductor (`nz-legislation/conductor/`)
```
conductor/
├── index.md                    # Project context
├── product.md                  # Software product definition
├── tech-stack.md               # Node.js, TypeScript, npm
├── workflow.md                 # Software development workflow
├── tracks.md                   # Software track registry
└── tracks/
    ├── typescript-cli-implementation/
    ├── comprehensive-testing/
    ├── code-hardening-maturation/
    └── ... (software tracks)
```

### Research Conductor (`nz-health-research/conductor/`)
```
conductor/
├── index.md                    # Research programme context
├── protocol.md                 # Research methodology
├── corpus.md                   # Legislation corpus definition
├── workflow.md                 # Research workflow (7 phases)
├── tracks.md                   # Research track registry (P1-P5)
├── NZMJ_SUBMISSION_GUIDELINES.md
├── NZMJ_FIT_CHECKLIST.md
├── PUBLICATION_PIPELINE.md
├── RESEARCH_IMPROVEMENTS.md
└── tracks/
    ├── p1-legislative-volatility/
    ├── p2-accountability-drift/
    ├── p3-governance-load/
    ├── p4-rights-vs-coercion/
    └── p5-maori-governance-equity/
```

---

## Shared Patterns (from Base Conductor)

Both conductors can reference:

1. **Track Structure Template**
   - `index.md` - Track overview
   - `spec.md` - Specification
   - `plan.md` - Implementation plan

2. **Stage Gate Pattern**
   - Gate 1: Framing
   - Gate 2-6: Phase-specific reviews
   - Gate 7: Submission/Release

3. **Review Checklists**
   - Code review (Tool)
   - Manuscript review (Research)

4. **Documentation Patterns**
   - README structure
   - Specification format
   - Plan format

---

## Implementation

### Step 1: Keep Tool Conductor As-Is

The existing `conductor/` in the NZ Legislation repository stays where it is, focused on software development.

### Step 2: Create Research Conductor

Create new `conductor/` folder in the research repository with research-specific configuration.

### Step 3: Reference Base Patterns

Both conductors reference shared patterns from the base conductor extension.

---

## Benefits

1. **Clean Separation** - No mixing of software and research tracks
2. **Independent Evolution** - Each conductor evolves for its purpose
3. **Shared Best Practices** - Both benefit from base conductor patterns
4. **Clear Ownership** - Software maintainers vs. research team
5. **Separate Ethics** - Research ethics isolated from software development

---

**Created:** 2026-03-11  
**Status:** ✅ Architecture defined
