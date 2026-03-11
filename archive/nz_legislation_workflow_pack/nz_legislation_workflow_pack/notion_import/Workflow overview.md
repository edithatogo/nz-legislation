# NZ legislation corpus workflow for 2026 election-facing health policy work

## What the workflow looks like

The programme works best as a **single operating system** rather than five disconnected papers.

**Figma** holds the visual operating map: where each protocol sits, how shared methods feed each paper, and what the next milestones are.

**Notion** holds the knowledge base: protocol pages, decisions, coding rules, corpus notes, and manuscript plans.

**Linear** holds execution: milestones, issues, dependencies, due dates, and weekly work allocation.

The workflow is:

1. **Programme setup**
   - Create one programme hub with five protocol pages.
   - Define the common corpus, data model, naming rules, and manuscript target.
   - Decide the lead paper and reserve the others as sequenced studies.

2. **Corpus definition**
   - Set the legal boundary for each project.
   - Identify Acts, Bills, secondary legislation, and version ranges.
   - Record inclusion and exclusion rules.

3. **Acquisition and data build**
   - Use the legislation.govt.nz developer API to discover works and versions.
   - Pull XML and metadata into a dated corpus snapshot.
   - Build a reproducible metadata table.

4. **Shared methods layer**
   - Draft dictionaries, coding schemas, and variable definitions once.
   - Pilot on a small sample.
   - Refine before scaling.

5. **Project-specific analysis**
   - Run the protocol-specific extraction and descriptive analysis.
   - Create the project tables and figures.
   - Note interpretation limits early.

6. **Manuscript factory**
   - Draft NZMJ-style narrative around one clean result.
   - Reuse the shared methods appendix where possible.
   - Keep a short paper core and move technical detail into supplement.

7. **Review and dissemination**
   - Internal review.
   - Submission package.
   - Pre-election visual and policy brief outputs.

## Best practical sequence

### Phase 1: Stand up the operating system
Start with:
- programme hub
- issue backlog
- workflow board
- shared corpus specification

### Phase 2: Do the lead paper first
Lead with **policy whiplash / instability** because it is the most election-relevant and most naturally publishable in NZMJ.

### Phase 3: Reuse the same backbone
Once the corpus and coding layer exist, move in this order:
1. Policy whiplash and instability
2. Accountability drift
3. Governance load
4. Rights vs coercion
5. Māori governance and equity

## Division of labour by tool

| Tool | Role | What belongs there |
|---|---|---|
| Figma | Visual coordination | Workflow map, study sequence, publication pathway, figure concepts |
| Notion | Knowledge system | Protocols, definitions, decisions, meeting notes, corpus logs, manuscript plans |
| Linear | Delivery system | Initiative, epics, issues, dependencies, milestones, weekly sprint work |
| Code repo | Reproducibility | API queries, corpus scripts, extraction logic, tables, figures, supplements |

## Weekly rhythm

**Monday**
- choose the single analysis question for the week
- confirm the dependent issue chain in Linear

**Mid-week**
- build or update corpus
- test coding changes
- draft one table or figure

**Friday**
- write one manuscript section
- update decisions in Notion
- refresh the Figma map if sequencing changed

## Suggested outputs per protocol

Each protocol should produce:
- 1 protocol page
- 1 corpus definition note
- 1 coding schema note
- 1 analysis script folder
- 1 table shell set
- 1 figure shell set
- 1 manuscript outline
- 1 submission checklist

## Figma artefact

Primary workflow board:
https://www.figma.com/online-whiteboard/create-diagram/d9c7e1f2-13b0-49ea-a228-52f4c091b866?utm_source=chatgpt&utm_content=edit_in_figjam&oai_id=v1%2FE87hcmlHvm9PD9PI3UZiXeIWEToyQ6uDtqGvWbwS6CapQYxEkEGgkH&request_id=55aee38b-16c1-4898-b989-832e463813e4

## Constraint

I could not directly write into your live Notion workspace from this environment, so the package includes a **Notion-import-ready folder** that can be imported as Markdown pages.
