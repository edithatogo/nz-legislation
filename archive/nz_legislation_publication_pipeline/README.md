# NZ legislation corpus publication pipeline

This package turns the five-paper programme into a Conductor-style publication workflow that can be run manually in ChatGPT now, and later adapted to Gemini CLI with Conductor and a humanizer pass.

## Folders
- `conductor/` programme charter, workflow, and per-track specs/plans
- `docs/` publication playbook, reviewer simulation, prompts, and working notes
- `scripts/` starter code for legislation API harvest, XML parsing, metadata building, and figure-ready outputs
- `templates/` manuscript and supplement templates
- `notion_import/` markdown pages ready to paste or import into Notion
- `linear_seed/` initiative, epic, and issue seed files
- `figma/` board references and diagram source
- `config/` codebooks and program settings

## Publication stages
1. Define track and corpus
2. Harvest legislation records and versions
3. Build XML corpus and metadata tables
4. Develop and validate coding schema
5. Run analysis
6. Generate tables and figures
7. Draft manuscript
8. Run humanizer and NZMJ fit passes
9. Simulate peer review
10. Build submission package