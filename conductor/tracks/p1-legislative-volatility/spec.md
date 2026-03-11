# Specification: P1 - Legislative Volatility

## Title
Legislative Volatility and Reform Tempo in New Zealand Health Law

## Research Question
What is the tempo and pattern of legislative change in NZ health law across reform cycles, and does reform frequency outpace implementation capacity?

## Differentiation from Prior Work
This study differs from prior "policy whiplash" analyses by:
- **Focus:** Measuring legislative change tempo and implementation burden rather than political direction shifts
- **Method:** Quantitative corpus linguistics with implementation capacity modeling
- **Outcome:** Identifying optimal reform pacing rather than documenting political volatility

## Abstract (Draft)
New Zealand health policy has undergone multiple reform cycles since 2000, each accompanied by legislative change. This study quantifies legislative volatility in NZ health law using corpus linguistics methods applied to versioned legislation XML. We measure amendment frequency, textual change rates, reform cycle impacts, and implementation burden to inform policy debate ahead of the 2026 election. Unlike prior work on policy direction shifts, we focus on reform tempo and whether legislative change outpaces system capacity to implement.

---

## Corpus Scope

### Inclusion Criteria
- **Primary legislation:** Health-related Acts 2000-2026
- **Secondary legislation:** Regulations, orders, rules
- **Versions:** All published versions in scope period
- **Format:** XML where available, otherwise HTML/PDF

### Exclusion Criteria
- Non-health legislation
- Proposed bills not enacted
- Repealed provisions outside scope period

### Target Corpus Size
- ~50-100 Acts
- ~500-1000 versions total
- ~10,000+ sections/provisions

---

## Primary Outputs

1. **NZMJ Manuscript** (4000-6000 words)
   - Structured abstract
   - Introduction (policy context, differentiation from prior work)
   - Methods (corpus, coding, volatility metrics, implementation modeling)
   - Results (tempo patterns, reform cycles, implementation gaps)
   - Discussion (implications, limitations, comparison to prior framing)
   - Conclusion (policy recommendations for reform pacing)

2. **Supplementary Methods Appendix**
   - Full codebook
   - Corpus list
   - Technical methods
   - Volatility metric formulas
   - Additional tables

3. **Figures and Tables**
   - Figure 1: Amendment frequency over time (tempo visualization)
   - Figure 2: Reform cycle comparison
   - Figure 3: Implementation gap model
   - Table 1: Corpus characteristics
   - Table 2: Volatility metrics by Act
   - Table 3: Reform cycle summary
   - Table 4: Implementation burden indicators

4. **Policy Summary** (500 words)
   - Key findings on reform tempo
   - Implementation capacity implications
   - Recommendations for sustainable reform pacing

---

## Analysis Methods

### Primary Metrics

#### 1. Tempo Metrics
- **Amendment Rate:** Amendments per year per Act
- **Change Velocity:** Word-level diff rate between versions
- **Reform Density:** Changes per reform cycle normalized by cycle duration

#### 2. Pattern Metrics
- **Change Type Distribution:** Addition, deletion, modification, renumbering
- **Section Targeting:** Which provisions change most frequently
- **Clustering:** Do changes cluster around specific policy domains?

#### 3. Implementation Burden Metrics (NEW)
- **Notice Period:** Time between enactment and commencement
- **Transition Provisions:** Count of transitional/commencement clauses
- **Complexity Increase:** Net change in provision count/length
- **Cross-Reference Churn:** Changes to cross-referencing provisions

#### 4. Volatility Index (NEW)
Composite measure combining:
- Amendment frequency (normalized)
- Textual change magnitude (normalized)
- Implementation burden (normalized)
- Inverse of stability periods

### Coding Schema

#### Section Type
- Substantive vs procedural vs symbolic vs transitional

#### Change Type
- Addition, deletion, modification, renumbering, relocation

#### Policy Domain
- Service delivery, governance, funding, rights, workforce, accountability

#### Implementation Indicators (NEW)
- Commencement type (immediate, deferred, appointed day)
- Transition complexity (none, simple, complex)
- Guidance requirement (self-executing, requires regulations, requires guidance)

---

## Robustness Enhancements

### 1. Inter-Rater Reliability
- **Double-coding:** 20% sample coded independently by two researchers
- **Kappa statistic:** Target κ > 0.7 for all coding categories
- **Disagreement resolution:** Documented reconciliation process

### 2. Sensitivity Analysis
- **Corpus boundaries:** Test alternative inclusion criteria
- **Time periods:** Test different reform cycle definitions
- **Weighting:** Test alternative volatility index weightings

### 3. Validation
- **Expert review:** Have health policy experts review coding sample
- **Triangulation:** Compare findings with policy document analysis
- **Temporal validation:** Hold out recent period for validation

### 4. Transparency
- **Pre-registration:** OSF registration with analysis plan
- **Open code:** Publish analysis scripts with supplement
- **Audit trail:** Document all coding decisions

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Overclaiming from legal text | High | Conservative language, explicit limitations section |
| Unstable corpus boundaries | Medium | Early gate review, documented inclusion/exclusion rules |
| Symbolic vs substantive ambiguity | Medium | Dual coding passes, inter-rater reliability checks |
| Overlap with prior "policy whiplash" work | Medium | Clear differentiation in framing, methods, and discussion |
| Implementation burden inference | High | Conservative interpretation, acknowledge limitations |

---

## Success Criteria

- ✅ Clear differentiation from prior "policy whiplash" work
- ✅ Reproducible corpus with documented boundaries
- ✅ Validated coding schema with pilot testing and inter-rater reliability
- ✅ Robust volatility metrics with sensitivity analysis
- ✅ NZMJ-ready manuscript with supplementary materials
- ✅ Policy brief suitable for media/policymakers
- ✅ Pre-registered on OSF

---

## Ethics and Reproducibility

- **Ethics:** No human participants, public legislation only
- **Data:** All corpus data from public API
- **Code:** Analysis scripts to be published with supplement
- **Pre-registration:** OSF registration recommended before Phase 4 (Analysis)
- **Data sharing:** Corpus metadata and derived data to be deposited in open repository

---

**Created:** 2026-03-11  
**Reframed:** 2026-03-11 (to differentiate from prior "policy whiplash" work)  
**Archive Source:** `nz_legislation_publication_pipeline.zip`
