# Specification: P1 - Policy Whiplash

## Title
Policy Whiplash and Legislative Instability

## Research Question
How unstable is New Zealand health legislation across reform cycles?

## Abstract (Draft)
New Zealand health policy has undergone multiple reform cycles since 2000, each accompanied by legislative change. This study quantifies legislative instability in NZ health law using corpus linguistics methods applied to versioned legislation XML. We measure amendment frequency, textual change rates, and reform cycle impacts to inform policy debate ahead of the 2026 election.

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
   - Introduction (policy context)
   - Methods (corpus, coding, analysis)
   - Results (instability metrics, reform cycles)
   - Discussion (implications, limitations)
   - Conclusion (policy recommendations)

2. **Supplementary Methods Appendix**
   - Full codebook
   - Corpus list
   - Technical methods
   - Additional tables

3. **Figures and Tables**
   - Figure 1: Amendment frequency over time
   - Figure 2: Reform cycle visualization
   - Table 1: Corpus characteristics
   - Table 2: Instability metrics by Act
   - Table 3: Reform cycle summary

4. **Policy Summary** (500 words)
   - Key findings
   - Election relevance
   - Recommendations

---

## Analysis Methods

### Primary Metrics
1. **Amendment Rate:** Amendments per year per Act
2. **Textual Change:** Word-level diff between versions
3. **Reform Impact:** Change magnitude per reform cycle
4. **Stability Index:** Composite measure (inverse of instability)

### Coding Schema
- **Section type:** Substantive vs procedural vs symbolic
- **Change type:** Addition, deletion, modification, renumbering
- **Policy domain:** Service delivery, governance, funding, rights, etc.

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Overclaiming from legal text | High | Conservative language, explicit limitations section |
| Unstable corpus boundaries | Medium | Early gate review, documented inclusion/exclusion rules |
| Symbolic vs substantive ambiguity | Medium | Dual coding passes, inter-rater reliability checks |
| XML availability gaps | Low | Fallback to HTML/PDF, document gaps |

---

## Success Criteria

- ✅ Clear policy question with election relevance
- ✅ Reproducible corpus with documented boundaries
- ✅ Validated coding schema with pilot testing
- ✅ NZMJ-ready manuscript with supplementary materials
- ✅ Policy brief suitable for media/policymakers

---

## Ethics and Reproducibility

- **Ethics:** No human participants, public legislation only
- **Data:** All corpus data from public API
- **Code:** Analysis scripts to be published with supplement
- **Pre-registration:** Consider OSF pre-registration for methods

---

**Created:** 2026-03-11
**Archive Source:** `nz_legislation_publication_pipeline.zip`
