# Archived Research Programme Analysis

**Date:** 2026-03-11
**Source:** Three extracted archives from `archive/` folder

---

## Overview

The archived materials contain a comprehensive **NZ Health Legislation Corpus Programme** aimed at producing 5 NZMJ-ready research papers analyzing New Zealand health legislation for health policy relevance ahead of the 2026 election.

---

## Core Research Tracks (5 Papers)

| Track | Title | Research Question |
|-------|-------|-------------------|
| **P1** | Policy Whiplash | How unstable is NZ health legislation across reform cycles? |
| **P2** | Accountability Drift | How have responsibilities shifted across institutions after Pae Ora? |
| **P3** | Governance Load | Has governance burden increased in NZ health legislation? |
| **P4** | Rights vs Coercion | Has rights language displaced coercive language in mental health legislation? |
| **P5** | Māori Governance Equity | How has Māori governance and equity language evolved in NZ health law? |

---

## Programme Structure

### Corpus Scope
- New Zealand health legislation and related instruments
- Versioned where relevant
- Time period: 2000-2026

### Shared Outputs (per track)
- 1 NZMJ manuscript
- Supplementary methods appendix
- Figures and tables
- Policy summary/brief

---

## Publication Pipeline (10 Stages)

1. **Define track and corpus** - Research question, election relevance, NZMJ fit
2. **Harvest legislation** - Records and versions from API
3. **Build XML corpus** - Download, parse, metadata tables
4. **Develop coding schema** - Codebook creation
5. **Run analysis** - Pilot coding, revise rules, full extraction
6. **Generate outputs** - Tables, figures, supplements
7. **Draft manuscript** - Abstract skeleton, argument outline, full draft
8. **Humanizer pass** - Remove AI artifacts, strengthen argumentative flow
9. **NZMJ fit pass** - Compression, style alignment
10. **Reviewer simulation** - Hostile reviewer pass, final style check
11. **Submission pack** - Manuscript, tables, figures, appendix, cover letter

---

## Stage Gates

### Gate 1: Framing
- Clear policy question
- Clear election relevance
- Realistic NZMJ fit
- No unresolvable data dependency

### Gate 2: Corpus
- Dated list of works
- Version list
- XML availability confirmed
- Metadata table generated

### Gate 3: Coding
- Codebook drafted
- Pilot completed
- Disagreements resolved
- Rules frozen for main run

### Gate 4: Analysis
- Primary outcomes computed
- Uncertainty and limitations stated
- Tables and figures drafted

### Gate 5: Drafting
- Abstract skeleton
- Argument outline
- First full draft
- Supplement draft

### Gate 6: Revision
- Humanizer pass
- NZMJ compression pass
- Hostile reviewer pass
- Final style pass

### Gate 7: Submission
- Manuscript docx
- Tables and figures
- Supplementary appendix
- Cover letter

---

## Humanizer Rules

**Preserve:**
- All factual content
- All caveats
- All technical terms that matter
- The author's voice and argument

**Remove:**
- Generic AI signposting
- Inflated transitions
- Empty summary lines
- Repetitive sentence structures
- Vague evaluative language

**Strengthen:**
- Paragraph openings
- Argumentative flow
- Specificity
- Concrete policy implications
- NZMJ readability

**Final Check:** Every paragraph should answer one of:
- What the corpus shows
- What it likely means
- Why it matters
- What it does not prove

---

## Technical Components

### Scripts (Python)
- `api_client.py` - Legislation API harvest
- `xml_parser.py` - XML parsing
- `build_metadata.py` - Metadata table building

### Templates
- `nzmj_manuscript_template.md` - NZMJ manuscript structure
- `supplement_template.md` - Supplementary appendix

### Workflow Tools
- Notion import structure (markdown pages)
- Linear seeds (initiatives, epics, issues)
- Figma/FigJam boards for visual workflow

---

## Key Risks (Identified)

1. **Overclaiming** from legal text alone
2. **Unstable corpus boundaries**
3. **Symbolic vs substantive language ambiguity**

---

## Integration Strategy

The archived programme should be integrated into the current conductor structure as:

1. **5 Research Tracks** in `conductor/tracks/`:
   - `p1-policy-whiplash`
   - `p2-accountability-drift`
   - `p3-governance-load`
   - `p4-rights-vs-coercion`
   - `p5-maori-governance-equity`

2. **Publication Pipeline** as shared workflow documentation

3. **Humanizer Rules** as part of product guidelines

4. **Stage Gates** integrated into track plans

---

## Next Steps

1. Create the 5 research tracks in `conductor/tracks/`
2. Update `conductor/tracks.md` registry
3. Integrate publication pipeline into workflow
4. Align with existing NZ Legislation Tool infrastructure
5. Begin Track P1 execution

---

**Archives Analyzed:**
- `nz_legislation_conductor_project.zip`
- `nz_legislation_publication_pipeline.zip`
- `nz_legislation_workflow_pack.zip`

**Status:** Ready for track creation
