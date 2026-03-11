# NZMJ Publication Pipeline

**Purpose:** Transform the five-paper NZ health legislation research programme into NZMJ-ready submissions.

**Target:** 2026 election policy relevance

**NZMJ Guidelines:** See `NZMJ_SUBMISSION_GUIDELINES.md` and `NZMJ_FIT_CHECKLIST.md` for detailed requirements

---

## NZMJ Submission Requirements Summary

| Manuscript Type | Word Limit | Reference Limit | Abstract | Figures/Tables |
|-----------------|------------|-----------------|----------|----------------|
| **Articles** (Original Research) | 3,000 | 30 | 200 words (structured, 4 headings) | Insert in text; attach high-res separately |
| **Viewpoints** | 3,000 | 30 | Not required | Insert in text |
| **Editorials** | 1,200 | 12 | Not required | Insert in text |

**Our research tracks (P1-P5) will use:** **Articles** format

**Reference Style:** Vancouver (superscript, Index Medicus abbreviations)  
**Abstract Format:** Structured (Aims, Methods, Results, Conclusions) - 200 words max  
**Author Rules:** ≤4 authors list all; >4 authors = first 3 + "et al."  
**Reporting Guidelines:** STROBE (observational), PRISMA (systematic reviews)

**Submission System:** https://nzmj.manuscriptmanager.net

---

## Overview

This pipeline provides a reproducible workflow for producing NZMJ manuscripts from legislation corpus analysis. Each of the 5 research tracks (P1-P5) follows this pipeline from concept to submission.

---

## The 5 Research Tracks

| Track | Title | Research Question |
|-------|-------|-------------------|
| **P1** | Policy Whiplash | How unstable is NZ health legislation across reform cycles? |
| **P2** | Accountability Drift | How have responsibilities shifted across institutions after Pae Ora? |
| **P3** | Governance Load | Has governance burden increased in NZ health legislation? |
| **P4** | Rights vs Coercion | Has rights language displaced coercive language in mental health legislation? |
| **P5** | Māori Governance Equity | How has Māori governance and equity language evolved in NZ health law? |

---

## Publication Stages (10 Steps)

### 1. Define Track and Corpus
- Select research track
- Confirm research question
- Confirm election relevance
- Assess NZMJ fit

### 2. Harvest Legislation
- Query NZ Legislation API
- Retrieve works and versions
- Download XML where available
- Document corpus boundaries

### 3. Build XML Corpus
- Parse legislation XML
- Build metadata tables
- Create version history
- Confirm data availability

### 4. Develop Coding Schema
- Create codebook
- Define section types
- Define change types
- Define policy domains

### 5. Run Analysis
- Pilot coding (10% sample)
- Revise coding rules
- Run full extraction
- Compute metrics

### 6. Generate Tables and Figures
- Draft publication-ready tables
- Create visualizations
- Prepare supplementary data

### 7. Draft Manuscript
- Write structured abstract
- Create argument outline
- Draft full manuscript
- Write supplementary appendix

### 8. Humanizer Pass
- Remove AI artifacts
- Strengthen argumentative flow
- Add concrete policy implications
- Apply humanizer rules (see `HUMANIZER_CHECKLIST.md`)

### 9. NZMJ Fit Pass

**Use:** `conductor/NZMJ_FIT_CHECKLIST.md`

**Word Count:**
- [ ] Maximum 3,000 words (excludes abstract, references, tables, figures)

**Abstract:**
- [ ] Maximum 200 words
- [ ] Four headings: Aims, Methods, Results, Conclusions

**References:**
- [ ] Maximum 30 references
- [ ] Vancouver style (superscript numbers)
- [ ] Index Medicus journal abbreviations
- [ ] ≤4 authors: list all; >4 authors: first 3 + "et al."

**Figures/Tables:**
- [ ] Inserted in text where first mentioned
- [ ] High-resolution versions attached separately (.jpg, .tiff, .png, .eps)
- [ ] Total count stated on title page

**Other Requirements:**
- [ ] Ethics approval stated (if applicable)
- [ ] Reporting guideline checklist completed (STROBE for observational studies)
- [ ] NZ relevance clearly established
- [ ] NZ spelling convention (e.g., "randomised" not "randomized")
- [ ] "Pacific" terminology used correctly (not "Pasifika" for general Pacific population)
- [ ] Cover letter prepared with required statements
- [ ] Title page prepared (separate file)
- [ ] Blinded manuscript prepared (no author names)
- [ ] Conflicts of interest listed at end of manuscript

### 10. Reviewer Simulation
- Run hostile reviewer pass
- Identify weaknesses
- Address concerns
- Final style check

### 11. Submission Pack
- Manuscript (docx)
- Tables and figures
- Supplementary appendix
- Cover letter
- Submit to NZMJ

---

## Stage Gates

Each track must pass 7 gates before proceeding:

| Gate | Criteria | Week |
|------|----------|------|
| **1: Framing** | Policy question, election relevance, NZMJ fit | 1 |
| **2: Corpus** | Works list, versions, XML, metadata | 3 |
| **3: Coding** | Codebook, pilot, frozen rules | 5 |
| **4: Analysis** | Outcomes, limitations, tables/figures | 7 |
| **5: Drafting** | Abstract, outline, full draft, supplement | 9 |
| **6: Revision** | Humanizer, NZMJ fit, reviewer simulation | 11 |
| **7: Submission** | Complete submission package | 12 |

---

## Humanizer Rules

Apply these rules after analytic content is stable.

### Preserve
- ✅ All factual content
- ✅ All caveats
- ✅ All technical terms that matter
- ✅ The author's voice and argument

### Remove
- ❌ Generic AI signposting
- ❌ Inflated transitions
- ❌ Empty summary lines
- ❌ Repetitive sentence structures
- ❌ Vague evaluative language

### Strengthen
- 💪 Paragraph openings
- 💪 Argumentative flow
- 💪 Specificity
- 💪 Concrete policy implications
- 💪 NZMJ readability

### Final Check
Every paragraph should answer one of:
- What the corpus shows
- What it likely means
- Why it matters
- What it does not prove

---

## Technical Resources

### Scripts (from archive)
- `api_client.py` - Legislation API harvest
- `xml_parser.py` - XML parsing
- `build_metadata.py` - Metadata table building

### Templates (from archive)
- `nzmj_manuscript_template.md` - Manuscript structure
- `supplement_template.md` - Supplementary appendix

### Existing Tools
- NZ Legislation API client ✅ (existing)
- Citation generation ✅ (existing)
- Export functionality ✅ (existing)
- XML parsing ✅ (existing scripts)

---

## Timeline

**Per Track:** 10-12 weeks

**Parallel Execution:**
- Tracks can run in parallel
- Shared corpus harvesting (Phase 2)
- Shared coding schema development (Phase 3)
- Individual analysis and drafting (Phases 4-7)

**Total Programme:** 12-16 weeks (with parallel execution)

---

## Success Criteria

- ✅ All 5 manuscripts submitted to NZMJ
- ✅ Policy briefs published for election relevance
- ✅ Reproducible methods documented
- ✅ All stage gates passed
- ✅ Māori co-authorship on P5

---

## Archive Sources

This pipeline was reconstructed from:
- `nz_legislation_conductor_project.zip`
- `nz_legislation_publication_pipeline.zip`
- `nz_legislation_workflow_pack.zip`

**Extracted:** 2026-03-11
**Integrated:** 2026-03-11

---

**Created:** 2026-03-11
**Status:** Ready for Track P1 initiation
