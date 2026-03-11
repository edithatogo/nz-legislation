# Research Programme Integration Complete

**Date:** 2026-03-11  
**Status:** ✅ INTEGRATED

---

## Summary

I have successfully extracted, analyzed, and integrated the archived research programme into the conductor system. The three zip archives contained a comprehensive **NZ Health Legislation Corpus Programme** aimed at producing 5 NZMJ-ready research papers.

---

## What Was Extracted

### Three Archives Analyzed

1. **nz_legislation_conductor_project.zip**
   - Conductor track structure
   - 5 research track specs and plans
   - Product definition

2. **nz_legislation_publication_pipeline.zip**
   - Complete publication workflow
   - 10-stage pipeline
   - 7 stage gates
   - Humanizer rules
   - NZMJ fit pass
   - Reviewer simulation
   - Scripts and templates

3. **nz_legislation_workflow_pack.zip**
   - Workflow documentation
   - Notion import structure
   - Linear seeds
   - Figma links
   - Code templates

---

## What Was Created

### 5 Research Tracks (in `conductor/tracks/`)

| Track | Folder | Status |
|-------|--------|--------|
| **P1 - Policy Whiplash** | `p1-policy-whiplash/` | ⏳ PENDING |
| **P2 - Accountability Drift** | `p2-accountability-drift/` | ⏳ PENDING |
| **P3 - Governance Load** | `p3-governance-load/` | ⏳ PENDING |
| **P4 - Rights vs Coercion** | `p4-rights-vs-coercion/` | ⏳ PENDING |
| **P5 - Māori Governance Equity** | `p5-maori-governance-equity/` | ⏳ PENDING |

Each track contains:
- `index.md` - Track overview
- `spec.md` - Research specification
- `plan.md` - Implementation plan (7 phases, 12 weeks)

### Documentation

1. **ARCHIVE_ANALYSIS.md** - Complete analysis of archived materials
2. **PUBLICATION_PIPELINE.md** - Integrated publication workflow
3. **tracks.md** - Updated registry (now 17 tracks total)

---

## Research Programme Structure

### 5 Papers for NZMJ Submission

All tracks follow the same 10-stage publication pipeline:

1. Define track and corpus
2. Harvest legislation
3. Build XML corpus
4. Develop coding schema
5. Run analysis
6. Generate tables/figures
7. Draft manuscript
8. Humanizer pass
9. NZMJ fit pass
10. Reviewer simulation
11. Submission pack

### Timeline

- **Per Track:** 10-12 weeks
- **Parallel Execution:** 12-16 weeks total
- **Target:** 2026 election policy relevance

---

## Key Features

### Stage Gates (7)

Each track must pass 7 gates:
1. Framing
2. Corpus
3. Coding
4. Analysis
5. Drafting
6. Revision
7. Submission

### Humanizer Rules

Preserve factual content, remove AI artifacts, strengthen argumentative flow.

### Cultural Considerations (P5)

P5 requires Māori co-authorship and Te Tiriti principles applied throughout.

---

## Technical Integration

### Existing Infrastructure (✅ Complete)

The research programme leverages existing technical infrastructure:
- NZ Legislation API client ✅
- Citation generation ✅
- Export functionality ✅
- XML parsing ✅

### New Resources (from archive)

- `api_client.py` - Enhanced API harvest
- `xml_parser.py` - Legislation XML parsing
- `build_metadata.py` - Metadata table generation
- `nzmj_manuscript_template.md` - Manuscript template
- `supplement_template.md` - Supplement template

---

## Next Steps

### Immediate (This Week)

1. **Review the integrated tracks** - Familiarize yourself with the 5 research tracks
2. **Select first track** - Recommend starting with P1 (Policy Whiplash)
3. **Initiate P1** - Begin Phase 1 (Framing)

### Short Term (Next 2 Weeks)

1. **P1 Phase 1-2** - Complete framing and corpus harvesting
2. **Identify co-authors** - Especially for P5 (Māori governance)
3. **Set up OSF** - Consider pre-registration for methods

### Medium Term (Next Month)

1. **P1 coding and analysis** - Weeks 4-7
2. **P2 initiation** - Start P2 framing while P1 in analysis
3. **Parallel execution** - Run multiple tracks in parallel

---

## Archive Location

Original extracted archives remain in:
```
archive/nz_legislation_conductor_project/
archive/nz_legislation_publication_pipeline/
archive/nz_legislation_workflow_pack/
```

These can be referenced for additional details, scripts, and templates.

---

## Metrics

| Metric | Value |
|--------|-------|
| **Total Tracks** | 17 (was 12, now 17) |
| **Research Tracks** | 5 (new) |
| **Technical Tracks** | 9 (complete) |
| **In Progress** | 1 (Australian implementation) |
| **Pending** | 7 (5 research + 2 optional) |
| **Overall Progress** | ~56% (technical complete, research pending) |

---

## Files Created/Updated

### New Files
- `conductor/ARCHIVE_ANALYSIS.md`
- `conductor/PUBLICATION_PIPELINE.md`
- `conductor/tracks/p1-policy-whiplash/index.md`
- `conductor/tracks/p1-policy-whiplash/spec.md`
- `conductor/tracks/p1-policy-whiplash/plan.md`
- `conductor/tracks/p2-accountability-drift/index.md`
- `conductor/tracks/p2-accountability-drift/spec.md`
- `conductor/tracks/p2-accountability-drift/plan.md`
- `conductor/tracks/p3-governance-load/index.md`
- `conductor/tracks/p3-governance-load/spec.md`
- `conductor/tracks/p3-governance-load/plan.md`
- `conductor/tracks/p4-rights-vs-coercion/index.md`
- `conductor/tracks/p4-rights-vs-coercion/spec.md`
- `conductor/tracks/p4-rights-vs-coercion/plan.md`
- `conductor/tracks/p5-maori-governance-equity/index.md`
- `conductor/tracks/p5-maori-governance-equity/spec.md`
- `conductor/tracks/p5-maori-governance-equity/plan.md`

### Updated Files
- `conductor/tracks.md` - Added 5 research tracks

---

## Ready to Begin

The research programme is now fully integrated and ready for execution. 

**Recommended first action:** Begin P1 (Policy Whiplash) Phase 1 (Framing) by reviewing the spec and plan in `conductor/tracks/p1-policy-whiplash/`.

---

**Integration Complete:** 2026-03-11  
**Archive Sources:** 3 zip files  
**Tracks Created:** 5  
**Documentation:** 3 new files
