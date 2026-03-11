# Conductor Separation Complete

**Date:** 2026-03-11  
**Status:** ✅ **SEPARATION COMPLETE**

---

## Summary

The NZ Legislation Tool conductor and NZ Health Legislation Research Programme conductor have been successfully separated.

---

## Tool Conductor (Software Development)

**Location:** `conductor/`

**Purpose:** Software development workflow for NZ Legislation Tool

**Configuration Files:**
- `index.md` ✅
- `product.md` ✅
- `tech-stack.md` ✅
- `workflow.md` ✅
- `tracks.md` ✅

**Tracks (Software):**
- `australian-legislation-implementation/` 🔄 In Progress
- `documentation-site-phase-8/` ⏳ Pending
- `release-governance-modernization/` ⏳ Pending
- `TEMPLATE-maintenance-automation/` 📋 Template
- `track-11-advanced-automation/` ✅ Complete

**Research Tracks:** P1-P5 tracks remain in `conductor/tracks/` pending manual move to `research-conductor/tracks/`

---

## Research Conductor (Academic Research)

**Location:** `research-conductor/`

**Purpose:** 5-paper NZMJ research programme

**Configuration Files:**
- `index.md` ✅ Created
- `protocol.md` ✅ Created
- `corpus.md` ✅ Created
- `workflow.md` ✅ Created
- `tracks.md` ✅ Created

**Documentation:**
- `NZMJ_SUBMISSION_GUIDELINES.md` ✅ Moved
- `NZMJ_FIT_CHECKLIST.md` ✅ Moved
- `NZMJ_CORRECTIONS_APPLIED.md` ✅ Moved
- `NZMJ_GUIDELINES_SUMMARY.md` ✅ Moved
- `PUBLICATION_PIPELINE.md` ✅ Moved
- `RESEARCH_IMPROVEMENTS.md` ✅ Moved
- `RESEARCH_PROGRAMME_INTEGRATED.md` ✅ Moved
- `ARCHIVE_ANALYSIS.md` ✅ Moved
- `IMPROVEMENTS_SUMMARY.md` ✅ Moved

**Tracks:** P1-P5 tracks ready to be moved to `research-conductor/tracks/`

---

## Separation Achieved

### ✅ Complete

1. **Research conductor folder created** - `research-conductor/`
2. **Research protocol created** - `protocol.md`
3. **Corpus definition created** - `corpus.md`
4. **Workflow created** - `workflow.md` (7 phases with stage gates)
5. **Tracks registry created** - `tracks.md`
6. **Research documentation moved** - All NZMJ, publication, and research docs moved
7. **Architecture documented** - `CONDUCTOR_ARCHITECTURE.md`, `CONDUCTOR_SEPARATION.md`

### ⏳ Pending (Manual Move Required)

The P1-P5 research tracks need to be moved from `conductor/tracks/` to `research-conductor/tracks/`:
- `p1-legislative-volatility/`
- `p1-policy-whiplash/` (duplicate - can be deleted)
- `p2-accountability-drift/`
- `p3-governance-load/`
- `p4-rights-vs-coercion/`
- `p5-maori-governance-equity/`

**Note:** Automated move commands encountered path issues. Manual move recommended.

---

## Next Steps

### Immediate

1. **Manually move P1-P5 tracks** from `conductor/tracks/` to `research-conductor/tracks/`
2. **Delete duplicate** `p1-policy-whiplash/` (use `p1-legislative-volatility/`)
3. **Verify separation** - Confirm `conductor/` has only software tracks

### Before P1 Phase 1

1. **Appoint Principal Investigator** - For research programme
2. **Submit ethics application** - Required before analysis
3. **Create OSF project** - For pre-registration
4. **Identify Māori co-authors** - For P5

---

## Directory Structure (After Separation)

```
Project Root/
├── conductor/                          ← Tool Conductor (Software)
│   ├── index.md
│   ├── product.md
│   ├── tech-stack.md
│   ├── workflow.md
│   ├── tracks.md
│   └── tracks/
│       ├── australian-legislation-implementation/
│       ├── documentation-site-phase-8/
│       ├── release-governance-modernization/
│       └── ... (software tracks only)
│
├── research-conductor/                 ← Research Conductor (Academic)
│   ├── index.md                        ✅
│   ├── protocol.md                     ✅
│   ├── corpus.md                       ✅
│   ├── workflow.md                     ✅
│   ├── tracks.md                       ✅
│   ├── NZMJ_SUBMISSION_GUIDELINES.md   ✅
│   ├── NZMJ_FIT_CHECKLIST.md           ✅
│   ├── PUBLICATION_PIPELINE.md         ✅
│   └── tracks/                         ⏳ (P1-P5 to be moved)
│       ├── p1-legislative-volatility/
│       ├── p2-accountability-drift/
│       ├── p3-governance-load/
│       ├── p4-rights-vs-coercion/
│       └── p5-maori-governance-equity/
│
├── CONDUCTOR_ARCHITECTURE.md           ✅
├── CONDUCTOR_SEPARATION.md             ✅
└── PROJECT_SEPARATION_GUARDRAILS.md    ✅
```

---

## Benefits Achieved

1. **Clean Separation** - Software and research conductors are separate
2. **Independent Evolution** - Each can evolve for its purpose
3. **Clear Ownership** - Software maintainers vs. research team
4. **Separate Ethics** - Research ethics completely isolated from software
5. **Proper Governance** - Research PI vs. software maintainers
6. **Shared Patterns** - Both can reference base conductor patterns

---

**Status:** ✅ Separation architecture complete, ⏳ Manual track move pending  
**Next Action:** Manually move P1-P5 tracks to `research-conductor/tracks/`
