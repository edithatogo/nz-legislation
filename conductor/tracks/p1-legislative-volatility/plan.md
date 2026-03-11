# Implementation Plan: P1 - Legislative Volatility

**Track:** P1 - Legislative Volatility  
**Duration:** 10-12 weeks  
**Status:** ⏳ PENDING

---

## Phase 1: Framing (Week 1) 🚧

**Gate 1: Framing** - Clear research question, differentiation from prior work, election relevance, NZMJ fit

### Tasks
- [ ] **1.1** Document differentiation from prior "policy whiplash" work
- [ ] **1.2** Define research question refinement (tempo + implementation)
- [ ] **1.3** Document election relevance (2026 context)
- [ ] **1.4** Assess NZMJ fit (scope, audience, timing)
- [ ] **1.5** Identify data dependencies
- [ ] **1.6** Create framing document for Gate 1 review
- [ ] **1.7** **NEW:** OSF pre-registration preparation

**Deliverable:** Framing document approved, OSF registration draft

**Robustness Check:** Clear differentiation from prior work documented

---

## Phase 2: Corpus (Weeks 2-3) 🚧

**Gate 2: Corpus** - Dated works list, versions, XML confirmed, metadata generated

### Tasks
- [ ] **2.1** Define inclusion/exclusion rules
- [ ] **2.2** Harvest works from NZ Legislation API
- [ ] **2.3** Retrieve version history for each work
- [ ] **2.4** Download XML for available versions
- [ ] **2.5** Build metadata table (work_id, version, dates, status)
- [ ] **2.6** Document corpus boundaries
- [ ] **2.7** Create corpus summary statistics
- [ ] **2.8** **NEW:** Sensitivity analysis - alternative corpus definitions

**Deliverable:** Corpus metadata table, XML archive, sensitivity notes

**Robustness Check:** Corpus boundaries tested with alternative definitions

---

## Phase 3: Coding (Weeks 4-5) 🚧

**Gate 3: Coding** - Codebook drafted, pilot completed, inter-rater reliability confirmed, rules frozen

### Tasks
- [ ] **3.1** Draft initial codebook (section types, change types, domains, implementation indicators)
- [ ] **3.2** Select pilot sample (20% for inter-rater reliability)
- [ ] **3.3** Train second coder (if available) or self-code with time separation
- [ ] **3.4** Run pilot coding
- [ ] **3.5** Calculate inter-rater reliability (Cohen's kappa)
- [ ] **3.6** Target κ > 0.7 for all categories
- [ ] **3.7** Resolve coding disagreements
- [ ] **3.8** Revise codebook
- [ ] **3.9** Freeze coding rules for main run
- [ ] **3.10** **NEW:** Expert review of coding sample

**Deliverable:** Frozen codebook, pilot results, inter-rater reliability report

**Robustness Check:** κ > 0.7 achieved, expert review completed

---

## Phase 4: Analysis (Weeks 6-7) 🚧

**Gate 4: Analysis** - Outcomes computed, sensitivity analysis complete, limitations stated, tables/figures drafted

### Tasks
- [ ] **4.1** Run full coding on corpus
- [ ] **4.2** Calculate tempo metrics (amendment rate, change velocity, reform density)
- [ ] **4.3** Compute pattern metrics (change type distribution, section targeting, clustering)
- [ ] **4.4** Calculate implementation burden metrics (NEW)
- [ ] **4.5** Generate volatility index (NEW)
- [ ] **4.6** Run sensitivity analysis (alternative corpus, time periods, weightings)
- [ ] **4.7** Draft tables (corpus characteristics, metrics, implementation burden)
- [ ] **4.8** Draft figures (tempo time series, reform cycles, implementation gap model)
- [ ] **4.9** Document limitations and uncertainty
- [ ] **4.10** **NEW:** Triangulation with policy document analysis

**Deliverable:** Analysis results, sensitivity analysis, draft tables/figures

**Robustness Check:** Sensitivity analysis complete, triangulation attempted

---

## Phase 5: Drafting (Weeks 8-9) 🚧

**Gate 5: Drafting** - Abstract, outline, first draft, supplement

### Tasks
- [ ] **5.1** Write structured abstract skeleton
- [ ] **5.2** Create argument outline
- [ ] **5.3** Draft Introduction (policy context, differentiation from prior work)
- [ ] **5.4** Draft Methods (corpus, coding, volatility metrics, implementation modeling)
- [ ] **5.5** Draft Results (tempo patterns, implementation burden, sensitivity)
- [ ] **5.6** Draft Discussion (implications, limitations, comparison to prior framing)
- [ ] **5.7** Draft Conclusion (recommendations for reform pacing)
- [ ] **5.8** Compile supplementary appendix (codebook, data, scripts)
- [ ] **5.9** Internal review and revision
- [ ] **5.10** **NEW:** Co-author review

**Deliverable:** First full draft, supplement draft

**Robustness Check:** Co-author review completed

---

## Phase 6: Revision (Weeks 10-11) 🚧

**Gate 6: Revision** - Humanizer, NZMJ fit, reviewer simulation, final style

### Tasks
- [ ] **6.1** Humanizer pass (remove AI artifacts, strengthen flow)
- [ ] **6.2** NZMJ compression pass (word count, style alignment)
- [ ] **6.3** Hostile reviewer simulation (identify weaknesses)
- [ ] **6.4** Address reviewer concerns
- [ ] **6.5** Final style pass (references, formatting)
- [ ] **6.6** Co-author review
- [ ] **6.7** Final revisions
- [ ] **6.8** **NEW:** OSF pre-registration (if not done earlier)

**Deliverable:** Revision-complete manuscript, OSF registration

**Robustness Check:** Reviewer simulation addressed, OSF registered

---

## Phase 7: Submission (Week 12) 🚧

**Gate 7: Submission** - Manuscript, tables, figures, appendix, cover letter

### Tasks
- [ ] **7.1** Format manuscript as NZMJ docx
- [ ] **7.2** Prepare tables (publication-ready)
- [ ] **7.3** Prepare figures (publication-ready)
- [ ] **7.4** Finalize supplementary appendix
- [ ] **7.5** Write cover letter (highlight differentiation from prior work)
- [ ] **7.6** Complete NZMJ submission forms
- [ ] **7.7** Submit to NZMJ
- [ ] **7.8** Prepare policy brief for release
- [ ] **7.9** **NEW:** Publish analysis code and data to open repository

**Deliverable:** Submission complete, policy brief published, code/data shared

**Robustness Check:** Open science practices completed

---

## Stage Gates Summary

| Gate | Criteria | Week | Status | Robustness Check |
|------|----------|------|--------|------------------|
| **1: Framing** | Research question, differentiation, election relevance, NZMJ fit | 1 | ⏳ | Prior work differentiation |
| **2: Corpus** | Works list, versions, XML, metadata, sensitivity | 3 | ⏳ | Alternative corpus definitions |
| **3: Coding** | Codebook, pilot, κ > 0.7, expert review | 5 | ⏳ | Inter-rater reliability |
| **4: Analysis** | Outcomes, sensitivity, triangulation, tables/figures | 7 | ⏳ | Sensitivity + triangulation |
| **5: Drafting** | Abstract, outline, full draft, supplement, co-author | 9 | ⏳ | Co-author review |
| **6: Revision** | Humanizer, NZMJ fit, reviewer simulation, OSF | 11 | ⏳ | Reviewer simulation |
| **7: Submission** | Complete submission, code/data sharing | 12 | ⏳ | Open science |

---

## Resources Required

### Technical
- NZ Legislation API access ✅
- XML parsing tools (existing scripts from archive)
- Python/R for analysis
- Citation management
- **NEW:** Statistical software for inter-rater reliability (R `irr` package or Python)

### Human
- Lead researcher (coding, analysis, drafting)
- **NEW:** Second coder for inter-rater reliability (can be co-author)
- **NEW:** Health policy expert for coding review
- Co-author (review, policy context)

### Time
- 10-12 weeks total
- ~10-15 hours/week
- **NEW:** Additional time for inter-rater reliability (~5 hours)

### Open Science
- **NEW:** OSF account for pre-registration
- **NEW:** GitHub/GitLab for code sharing
- **NEW:** Zenodo/Figshare for data deposition

---

## Success Metrics

- ✅ Manuscript submitted to NZMJ by target date
- ✅ Policy brief published for election relevance
- ✅ Reproducible methods documented
- ✅ All stage gates passed
- ✅ **NEW:** Inter-rater reliability κ > 0.7
- ✅ **NEW:** Sensitivity analysis completed
- ✅ **NEW:** OSF pre-registration completed
- ✅ **NEW:** Code and data shared openly
- ✅ Clear differentiation from prior "policy whiplash" work

---

## Robustness Enhancements Summary

### Research Robustness
1. **Inter-rater reliability** - 20% double-coded, κ > 0.7 target
2. **Sensitivity analysis** - Alternative corpus, time periods, weightings
3. **Expert review** - Health policy expert reviews coding sample
4. **Triangulation** - Compare with policy document analysis
5. **Pre-registration** - OSF registration before analysis
6. **Open science** - Code and data shared publicly

### Pipeline Robustness
1. **Enhanced stage gates** - Each gate has explicit robustness check
2. **Co-author review** - Built into drafting phase
3. **Reviewer simulation** - Hostile reviewer pass before submission
4. **Documentation** - Audit trail for all coding decisions

### Conductor Track Robustness
1. **Clear differentiation** - Explicit documentation of difference from prior work
2. **Risk mitigation** - Specific mitigation for overlap risk
3. **Success criteria** - Includes open science and robustness metrics
4. **Resource planning** - Accounts for additional robustness activities

---

**Created:** 2026-03-11  
**Reframed:** 2026-03-11 (to differentiate from prior "policy whiplash" work)  
**Enhanced:** 2026-03-11 (with robustness improvements)  
**Archive Source:** `nz_legislation_publication_pipeline.zip`
