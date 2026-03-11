# Research Programme Improvement Recommendations

**Date:** 2026-03-11  
**Purpose:** Enhance robustness of research methodology, publication pipeline, and conductor track structure

---

## Executive Summary

I recommend **15 improvements** across three categories:

| Category | Improvements | Priority |
|----------|--------------|----------|
| **Research Robustness** | 6 improvements | 🔴 High |
| **Pipeline Robustness** | 5 improvements | 🟡 Medium |
| **Conductor Track Robustness** | 4 improvements | 🟡 Medium |

All improvements are designed to be **lightweight** (minimal overhead) while significantly strengthening the research programme.

---

## Part 1: Research Robustness Improvements

### ✅ Implemented in P1 (Legislative Volatility)

The following have been added to the P1 track:

1. **Inter-rater Reliability** - 20% double-coding, κ > 0.7 target
2. **Sensitivity Analysis** - Alternative corpus, time periods, weightings
3. **Expert Review** - Health policy expert reviews coding sample
4. **Triangulation** - Compare findings with policy document analysis
5. **Pre-registration** - OSF registration before analysis
6. **Open Science** - Code and data shared publicly

### 🔴 Recommended for All Tracks (P1-P5)

#### 1. Inter-Rater Reliability (IRR)

**Why:** Ensures coding is reproducible and not researcher-dependent.

**Implementation:**
- Double-code 20% of corpus
- Calculate Cohen's kappa for each coding category
- Target κ > 0.7 for all categories
- Document disagreement resolution process

**Overhead:** ~5 hours per track

**Tools:**
- R: `irr` package (`kappa2()` function)
- Python: `sklearn.metrics.cohen_kappa_score`

**Gate:** Add to Gate 3 (Coding) - cannot proceed without κ > 0.7

---

#### 2. Sensitivity Analysis

**Why:** Tests whether findings are robust to methodological choices.

**Implementation:**
- **Corpus boundaries:** Test alternative inclusion/exclusion criteria
- **Time periods:** Test different reform cycle definitions (e.g., by election vs. by major reform Act)
- **Weighting:** Test alternative volatility index weightings

**Overhead:** ~3 hours per track

**Documentation:** Include sensitivity results in supplementary appendix

**Gate:** Add to Gate 4 (Analysis) - cannot proceed without sensitivity tests

---

#### 3. Expert Review

**Why:** Validates coding schema and interpretation with domain expertise.

**Implementation:**
- Identify 1-2 health policy experts (not co-authors)
- Share coding schema and 5-10% sample of coded provisions
- Request feedback on:
  - Face validity of coding categories
  - Interpretation of ambiguous provisions
  - Missing categories or concepts

**Overhead:** ~2 hours per track (plus expert time)

**Gate:** Add to Gate 3 (Coding) - expert feedback incorporated before main coding

---

#### 4. Triangulation

**Why:** Validates findings against independent data sources.

**Implementation:**
- Compare legislative change findings with:
  - Policy document analysis (e.g., government statements, white papers)
  - Media analysis (e.g., NZMJ news, Stuff, Herald coverage of reforms)
  - Parliamentary debates (Hansard references to key Acts)

**Overhead:** ~4 hours per track

**Documentation:** Include triangulation discussion in manuscript limitations

**Gate:** Add to Gate 4 (Analysis) - triangulation attempted before drafting

---

#### 5. Pre-Registration (OSF)

**Why:** Prevents HARKing (hypothesizing after results known), increases credibility.

**Implementation:**
- Register on Open Science Framework (osf.io)
- Register before Phase 4 (Analysis) begins
- Include:
  - Research question
  - Corpus definition
  - Primary outcomes
  - Analysis plan
  - Codebook (draft)

**Overhead:** ~2 hours per track

**Template:** Use OSF "Pre-Analysis Plan" template

**Gate:** Add to Gate 6 (Revision) - OSF registration required before submission

---

#### 6. Open Science (Code + Data Sharing)

**Why:** Enables reproducibility, increases citations, meets funder requirements.

**Implementation:**
- **Code:** GitHub/GitLab repository with:
  - Analysis scripts
  - Visualization code
  - README with usage instructions
  - License (MIT or GPL-3)
- **Data:** Zenodo or Figshare deposition with:
  - Corpus metadata (not full XML if licensing restrictions)
  - Derived data (metrics, coded dataset)
  - DOI for citation

**Overhead:** ~3 hours per track

**Timing:** Prepare during Phase 7 (Submission), release on acceptance

**Gate:** Add to Gate 7 (Submission) - code/data ready but embargoed until acceptance

---

### 🟡 Additional Recommendations

#### 7. Power Analysis (Optional)

**Why:** Ensures corpus size is adequate for detecting meaningful effects.

**Implementation:**
- For P1-P5, estimate expected effect sizes from prior literature
- Calculate minimum corpus size needed for 80% power
- Verify target corpus meets requirements

**Overhead:** ~2 hours (one-time for programme)

**Note:** May not be applicable for all tracks (descriptive vs. inferential)

---

#### 8. Temporal Validation (Optional)

**Why:** Tests whether model trained on earlier period predicts later period.

**Implementation:**
- Hold out most recent 2 years (2024-2026)
- Train volatility model on 2000-2023
- Test predictions against 2024-2026 data

**Overhead:** ~3 hours per track

**Note:** Only applicable if sufficient temporal variation exists

---

## Part 2: Pipeline Robustness Improvements

#### 9. Enhanced Stage Gates with Checklists

**Why:** Ensures consistent quality across all 5 tracks.

**Implementation:**

Create a **gate checklist** for each of the 7 gates:

**Example: Gate 3 (Coding) Checklist**
- [ ] Codebook drafted with all categories defined
- [ ] Pilot sample selected (20% of corpus)
- [ ] Second coder trained (or self-code with time separation)
- [ ] Pilot coding completed
- [ ] Cohen's kappa calculated for all categories
- [ ] κ > 0.7 achieved for all categories
- [ ] Disagreements documented and resolved
- [ ] Codebook revised based on pilot
- [ ] Expert review completed
- [ ] Coding rules frozen

**Overhead:** ~1 hour per track (checklist completion)

**Location:** Add to each track's `plan.md`

---

#### 10. Co-Author Review Protocol

**Why:** Ensures all co-authors have opportunity to review and approve.

**Implementation:**
- Identify co-authors in Phase 1
- Define review responsibilities:
  - **Content expert:** Review methods and interpretation
  - **Policy expert:** Review policy implications
  - **Methodologist:** Review statistical/analytic approach
- Schedule review checkpoints:
  - After Phase 5 (Drafting)
  - After Phase 6 (Revision)
  - Before Phase 7 (Submission)

**Overhead:** ~2 hours per track (coordination)

**Gate:** Add to Gate 5 and 6 - co-author sign-off required

---

#### 11. Hostile Reviewer Simulation

**Why:** Anticipates and addresses reviewer concerns before submission.

**Implementation:**

Assign one team member to play "hostile reviewer #2" and generate:

- **5 major criticisms** (methodology, interpretation, contribution)
- **10 minor criticisms** (clarity, formatting, references)
- **Recommendation:** Reject, Major Revision, or Accept

Then address all criticisms in revision.

**Overhead:** ~3 hours per track

**Template:** Use `conductor/reviewer_simulation_template.md` (create from archive)

**Gate:** Add to Gate 6 (Revision) - simulation completed before final revision

---

#### 12. Humanizer Pass Documentation

**Why:** Ensures consistent application of humanizer rules.

**Implementation:**

Create a **humanizer checklist** based on archived rules:

**Preserve (check each):**
- [ ] All factual content intact
- [ ] All caveats preserved
- [ ] Technical terms unchanged
- [ ] Author voice maintained

**Remove (check each):**
- [ ] No generic AI signposting ("this study demonstrates")
- [ ] No inflated transitions ("furthermore", "moreover")
- [ ] No empty summary lines
- [ ] No repetitive sentence structures
- [ ] No vague evaluative language ("important", "significant")

**Strengthen (check each):**
- [ ] Paragraph openings are strong
- [ ] Argumentative flow is clear
- [ ] Specific examples added
- [ ] Concrete policy implications stated
- [ ] NZMJ readability achieved

**Overhead:** ~2 hours per track

**Location:** Add to `conductor/PUBLICATION_PIPELINE.md`

---

#### 13. NZMJ Fit Pass Checklist

**Why:** Ensures manuscript aligns with journal requirements.

**Implementation:**

Create **NZMJ submission checklist**:

**Format:**
- [ ] Word count: 4000-6000 (main text)
- [ ] Abstract: Structured (Objective, Methods, Results, Conclusion)
- [ ] References: Vancouver style
- [ ] Figures: Max 4, high resolution
- [ ] Tables: Max 4, publication-ready

**Content:**
- [ ] Policy relevance clear
- [ ] NZ context explicit
- [ ] Clinical/practice implications stated
- [ ] Limitations acknowledged

**Overhead:** ~2 hours per track

**Location:** Add to `conductor/PUBLICATION_PIPELINE.md`

---

## Part 3: Conductor Track Robustness Improvements

#### 14. Track Dependency Mapping

**Why:** Identifies shared work and coordination opportunities.

**Implementation:**

Create **dependency matrix** for P1-P5:

| Shared Activity | Tracks Involved | Lead | Timeline |
|-----------------|-----------------|------|----------|
| Corpus harvesting | P1, P2, P3, P4, P5 | P1 lead | Weeks 2-3 |
| Codebook development | P1, P2, P3, P4, P5 | P1 lead | Weeks 4-5 |
| Inter-rater training | All tracks | P1 lead | Week 5 |
| Analysis scripts | P1, P3, P4, P5 | P1 lead | Weeks 6-7 |
| Māori expertise | P5 (lead), P1, P2, P3, P4 | P5 lead | All phases |

**Overhead:** ~1 hour (one-time)

**Location:** Add to `conductor/PUBLICATION_PIPELINE.md`

---

#### 15. Risk Register for Programme

**Why:** Proactively identifies and mitigates programme-level risks.

**Implementation:**

Create **programme risk register**:

| Risk | Tracks Affected | Likelihood | Impact | Mitigation | Owner |
|------|-----------------|------------|--------|------------|-------|
| Māori co-author not secured | P5 | Medium | High | Early outreach, leverage networks | P5 lead |
| API rate limits exceeded | All | Low | Medium | Batch requests, caching | Technical lead |
| Inter-rater reliability fails | All | Medium | High | Early pilot, revise codebook | All leads |
| Overlap with prior work | P1 | High | Medium | Clear differentiation documented | P1 lead |
| Timeline slippage | All | Medium | Medium | Parallel execution, buffer time | Programme lead |

**Overhead:** ~2 hours (one-time, review monthly)

**Location:** Create `conductor/PROGRAMME_RISK_REGISTER.md`

---

## Summary: Recommended Improvements

### Research Robustness (6 improvements)

| # | Improvement | Overhead | Priority | Status |
|---|-------------|----------|----------|--------|
| 1 | Inter-rater reliability | ~5 hrs/track | 🔴 High | ✅ Added to P1 |
| 2 | Sensitivity analysis | ~3 hrs/track | 🔴 High | ✅ Added to P1 |
| 3 | Expert review | ~2 hrs/track | 🔴 High | ✅ Added to P1 |
| 4 | Triangulation | ~4 hrs/track | 🟡 Medium | ✅ Added to P1 |
| 5 | Pre-registration (OSF) | ~2 hrs/track | 🔴 High | ✅ Added to P1 |
| 6 | Open science | ~3 hrs/track | 🔴 High | ✅ Added to P1 |

### Pipeline Robustness (5 improvements)

| # | Improvement | Overhead | Priority | Status |
|---|-------------|----------|----------|--------|
| 7 | Enhanced stage gates | ~1 hr/track | 🔴 High | ⏳ Recommended |
| 8 | Co-author review protocol | ~2 hrs/track | 🔴 High | ⏳ Recommended |
| 9 | Hostile reviewer simulation | ~3 hrs/track | 🟡 Medium | ⏳ Recommended |
| 10 | Humanizer pass checklist | ~2 hrs/track | 🟡 Medium | ⏳ Recommended |
| 11 | NZMJ fit checklist | ~2 hrs/track | 🔴 High | ⏳ Recommended |

### Conductor Track Robustness (4 improvements)

| # | Improvement | Overhead | Priority | Status |
|---|-------------|----------|----------|--------|
| 12 | Track dependency mapping | ~1 hr total | 🟡 Medium | ⏳ Recommended |
| 13 | Programme risk register | ~2 hrs total | 🔴 High | ⏳ Recommended |
| 14 | P1 reframing (done) | - | ✅ Done | ✅ Complete |
| 15 | Robustness gates | ~1 hr/track | 🔴 High | ✅ Added to P1 |

---

## Total Overhead Estimate

| Phase | One-Time | Per Track | Total (5 tracks) |
|-------|----------|-----------|------------------|
| Research Robustness | 0 hrs | 19 hrs | 95 hrs |
| Pipeline Robustness | 0 hrs | 10 hrs | 50 hrs |
| Conductor Robustness | 3 hrs | 1 hr | 8 hrs |
| **Total** | **3 hrs** | **30 hrs** | **153 hrs** |

**Per track:** ~30 hours additional (spread over 12 weeks = ~2.5 hrs/week)

**Programme-level:** ~3 hours one-time

---

## Implementation Priority

### Immediate (Before P1 Phase 1)
- [ ] Create programme risk register
- [ ] Create track dependency map
- [ ] Set up OSF project structure
- [ ] Identify potential expert reviewers

### Early (P1 Phase 1-2)
- [ ] Apply all robustness improvements to P1
- [ ] Create checklists for gates
- [ ] Recruit second coder for IRR
- [ ] Identify Māori co-author for P5

### Mid (P1 Phase 3-4)
- [ ] Complete IRR for P1
- [ ] Run sensitivity analysis for P1
- [ ] Expert review for P1
- [ ] Begin P2 with lessons from P1

### Late (P1 Phase 5-7)
- [ ] Complete OSF registration for P1
- [ ] Prepare code/data sharing for P1
- [ ] Apply improvements to P2-P5
- [ ] Programme-level review

---

## Files to Create

1. `conductor/PROGRAMME_RISK_REGISTER.md` - Risk register
2. `conductor/TRACK_DEPENDENCIES.md` - Dependency mapping
3. `conductor/GATE_CHECKLISTS.md` - Stage gate checklists
4. `conductor/HUMANIZER_CHECKLIST.md` - Humanizer pass checklist
5. `conductor/NZMJ_FIT_CHECKLIST.md` - NZMJ submission checklist
6. `conductor/REVIEWER_SIMULATION_TEMPLATE.md` - Hostile reviewer template
7. `osf.io/[project_id]` - OSF pre-registration (external)

---

**Created:** 2026-03-11  
**Status:** Recommendations for programme enhancement  
**Next Action:** Review and prioritize improvements before P1 initiation
