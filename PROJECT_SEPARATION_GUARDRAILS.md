# Project Separation Guardrails

**Date:** 2026-03-11  
**Purpose:** Ensure clear separation between NZ Legislation Tool (software) and NZ Health Legislation Research Programme (academic research)

---

## Critical Distinction

| Aspect | NZ Legislation Tool | Health Research Programme |
|--------|---------------------|--------------------------|
| **Nature** | Software product | Academic research |
| **Output** | CLI application, API client, MCP server | 5 NZMJ research papers |
| **Purpose** | General-purpose legislation analysis tool | Specific health policy analysis |
| **Audience** | Developers, researchers, policy analysts | Medical professionals, policymakers |
| **Publication** | npm package, GitHub repository | NZMJ journal articles |
| **Timeline** | Ongoing software development | 12-16 week research programme |
| **Funding** | Software development | Research grants (if applicable) |
| **Ethics** | No ethics approval needed | Requires ethics approval |
| **Authorship** | Software contributors | Academic co-authors |

---

## Guardrail 1: Separate Repository Structure

### NZ Legislation Tool (Software)
```
nz-legislation-tool/
├── src/                    # Source code
├── tests/                  # Software tests
├── package.json            # npm package config
├── README.md               # Software documentation
└── conductor/              # Software development tracks
    ├── tracks/
    │   ├── typescript-cli-implementation/
    │   ├── comprehensive-testing/
    │   └── ... (technical tracks)
```

### Health Research Programme (Academic)
```
nz-health-legislation-research/
├── conductor/              # Research programme management
│   ├── tracks/
│   │   ├── p1-legislative-volatility/
│   │   ├── p2-accountability-drift/
│   │   └── ... (research tracks)
│   ├── PUBLICATION_PIPELINE.md
│   ├── NZMJ_SUBMISSION_GUIDELINES.md
│   └── RESEARCH_PROTOCOL.md
├── data/                   # Research data (corpus, metadata)
├── analysis/               # Analysis scripts
├── manuscripts/            # Draft manuscripts
└── supplements/            # Supplementary materials
```

**Action Required:** Create separate repository for research programme

---

## Guardrail 2: Separate Conductor Configuration

### Software Conductor (Existing)
- **Product Definition:** `conductor/product.md` (software features)
- **Tech Stack:** `conductor/tech-stack.md` (Node.js, TypeScript, npm)
- **Workflow:** `conductor/workflow.md` (software development)
- **Tracks:** Software development tracks (CLI, testing, CI/CD, etc.)

### Research Conductor (New - Separate)
- **Research Protocol:** `research-conductor/protocol.md` (research methodology)
- **Corpus Definition:** `research-conductor/corpus.md` (legislation corpus)
- **Workflow:** `research-conductor/workflow.md` (research workflow)
- **Tracks:** Research tracks (P1-P5 NZMJ papers)

**Action Required:** Create `research-conductor/` folder with separate configuration

---

## Guardrail 3: Separate Documentation

### Software Documentation
- **README.md:** Software installation and usage
- **DEVELOPER_GUIDE.md:** Software development guide
- **API_REFERENCE.md:** Software API documentation
- **MCP_GUIDE.md:** MCP server usage

### Research Documentation
- **RESEARCH_PROTOCOL.md:** Research methodology
- **PUBLICATION_PIPELINE.md:** Manuscript preparation workflow
- **NZMJ_SUBMISSION_GUIDELINES.md:** Journal requirements
- **CODEBOOK.md:** Coding schema for analysis

**Action Required:** Move research-specific documentation to research repository

---

## Guardrail 4: Separate Data and Code

### Software Code
- **Location:** `src/`, `tests/`
- **License:** Open source (MIT/Apache)
- **Purpose:** General legislation analysis
- **Users:** Anyone installing npm package

### Research Code
- **Location:** `analysis/` (separate repository)
- **License:** Research-specific (may be embargoed until publication)
- **Purpose:** Specific health legislation analysis
- **Users:** Research team only (until publication)

### Research Data
- **Location:** `data/` (separate repository, access-controlled)
- **Access:** Research team only (until publication)
- **Ethics:** Covered by research ethics approval
- **Sharing:** Deposited in repository on acceptance

**Action Required:** Create separate `analysis/` and `data/` folders in research repository

---

## Guardrail 5: Separate Ethics and Governance

### Software
- **Ethics Approval:** Not required (public data, no human participants)
- **Governance:** Software development best practices
- **Oversight:** Software maintainers

### Research Programme
- **Ethics Approval:** **REQUIRED** (human participants = legislation as social data)
- **Governance:** Research ethics, academic integrity
- **Oversight:** Principal Investigator, research ethics committee
- **Pre-registration:** OSF registration required

**Action Required:**
1. Submit ethics application for research programme
2. Identify Principal Investigator
3. Register on OSF before analysis begins

---

## Guardrail 6: Separate Authorship and Credit

### Software
- **Contributors:** Software developers
- **Credit:** GitHub contributors, npm package authors
- **Citation:** Software citation (cite software itself)

### Research Programme
- **Authors:** Academic researchers meeting authorship criteria
- **Credit:** Journal article authorship (NZMJ)
- **Citation:** Academic citation (journal article)
- **Criteria:** ICMJE authorship criteria

**ICMJE Authorship Criteria (all 4 required):**
1. Substantial contributions to conception/design, data acquisition, or analysis/interpretation
2. Drafting article or revising critically for important intellectual content
3. Final approval of version to be published
4. Agreement to be accountable for all aspects of work

**Action Required:** Document authorship agreements for each paper

---

## Guardrail 7: Separate Funding and Conflicts

### Software
- **Funding:** Software development funding (if any)
- **Conflicts:** Software-related conflicts declared

### Research Programme
- **Funding:** Research grants (if applicable)
- **Conflicts:** Academic conflicts declared to NZMJ
- **Disclosure:** ICMJE disclosure forms for all authors

**Action Required:** Separate funding declarations for research

---

## Guardrail 8: Separate Timelines and Milestones

### Software (Ongoing)
- **Sprints:** 2-week development sprints
- **Releases:** npm package releases
- **Roadmap:** Software feature roadmap

### Research Programme (12-16 weeks)
- **Phase 1:** Week 1-2 (Framing, corpus)
- **Phase 2:** Week 3-5 (Coding)
- **Phase 3:** Week 6-8 (Analysis)
- **Phase 4:** Week 9-11 (Drafting, revision)
- **Phase 5:** Week 12 (Submission)

**Action Required:** Create separate research timeline

---

## Guardrail 9: Separate Communication Channels

### Software
- **Issues:** GitHub issues (bugs, features)
- **Discussions:** GitHub discussions
- **Announcements:** npm package updates

### Research Programme
- **Team Meetings:** Research team meetings (weekly)
- **Co-author Communication:** Email, shared documents
- **Public Communication:** NZMJ publication, press releases (coordinated)

**Action Required:** Set up separate communication channels for research team

---

## Guardrail 10: Separate Branding and Identity

### Software
- **Name:** "NZ Legislation Tool"
- **Logo:** Software logo
- **Tagline:** "Research-grade access to NZ legislation"

### Research Programme
- **Name:** "NZ Health Legislation Corpus Programme" or distinct name
- **Logo:** Research programme logo (if needed)
- **Tagline:** "Analyzing NZ health law for evidence-based policy"

**Action Required:** Create distinct research programme identity

---

## Implementation Checklist

### Immediate Actions (Before P1 Phase 1)

- [ ] **Create separate repository** for research programme
- [ ] **Move research tracks** from `conductor/tracks/` to `research-conductor/tracks/`
- [ ] **Create research-conductor configuration** (protocol.md, corpus.md, workflow.md)
- [ ] **Move research documentation** to research repository
- [ ] **Set up access controls** for research data and code
- [ ] **Submit ethics application** for research programme
- [ ] **Identify Principal Investigator** for research programme
- [ ] **Create OSF project** for pre-registration

### Before P1 Analysis (Phase 4)

- [ ] **Complete ethics approval**
- [ ] **Register on OSF** with analysis plan
- [ ] **Document authorship agreements** for P1
- [ ] **Set up research team communication** channels

### Before P1 Submission (Phase 7)

- [ ] **Complete ICMJE disclosure forms** for all authors
- [ ] **Confirm funding declarations**
- [ ] **Prepare data sharing plan** (embargoed until acceptance)

---

## Directory Structure (After Separation)

### NZ Legislation Tool (Software Repository)
```
nz-legislation-tool/
├── src/                          # Software source code
├── tests/                        # Software tests
├── package.json                  # npm package
├── README.md                     # Software README
├── conductor/                    # Software development
│   ├── product.md
│   ├── tech-stack.md
│   ├── workflow.md
│   └── tracks/
│       ├── typescript-cli-implementation/
│       ├── comprehensive-testing/
│       ├── code-hardening-maturation/
│       └── ... (technical tracks only)
└── docs/                         # Software documentation
    ├── DEVELOPER_GUIDE.md
    ├── API_REFERENCE.md
    └── MCP_GUIDE.md
```

### NZ Health Legislation Research (Research Repository)
```
nz-health-legislation-research/
├── research-conductor/           # Research programme management
│   ├── protocol.md               # Research methodology
│   ├── corpus.md                 # Corpus definition
│   ├── workflow.md               # Research workflow
│   └── tracks/
│       ├── p1-legislative-volatility/
│       ├── p2-accountability-drift/
│       ├── p3-governance-load/
│       ├── p4-rights-vs-coercion/
│       └── p5-maori-governance-equity/
├── data/                         # Research data (access-controlled)
│   ├── corpus/                   # Legislation XML
│   ├── metadata/                 # Metadata tables
│   └── coded/                    # Coded dataset
├── analysis/                     # Analysis scripts (access-controlled)
│   ├── tempo_analysis.R
│   ├── accountability_analysis.R
│   └── ...
├── manuscripts/                  # Draft manuscripts
│   ├── p1-draft-1.md
│   ├── p1-draft-2.md
│   └── ...
├── supplements/                  # Supplementary materials
├── docs/                         # Research documentation
│   ├── RESEARCH_PROTOCOL.md
│   ├── PUBLICATION_PIPELINE.md
│   ├── NZMJ_SUBMISSION_GUIDELINES.md
│   ├── CODEBOOK.md
│   └── HUMANIZER_CHECKLIST.md
├── ethics/                       # Ethics documentation
│   ├── application.pdf
│   ├── approval.pdf
│   └── consent-forms/
└── README.md                     # Research programme README
```

---

## Why This Separation Matters

### Legal and Ethical Reasons
1. **Ethics approval** covers research activities, not software development
2. **Data access** must be controlled for research integrity
3. **Authorship** must follow academic criteria, not software contribution

### Practical Reasons
1. **Different audiences** - developers vs. medical professionals
2. **Different timelines** - ongoing software vs. 12-16 week research
3. **Different outputs** - software package vs. journal articles
4. **Different credit systems** - GitHub contributors vs. academic authors

### Risk Mitigation
1. **Prevents confusion** about what is software vs. research
2. **Protects research integrity** (blinded review, data access)
3. **Ensures proper attribution** (software citation vs. paper citation)
4. **Manages conflicts** (software conflicts vs. academic conflicts)

---

## Next Steps

1. **Acknowledge this guardrail document** - Confirm understanding of separation requirements
2. **Create research repository** - Set up separate GitHub repository
3. **Move research tracks** - Relocate P1-P5 to research repository
4. **Create research-conductor** - Set up research-specific configuration
5. **Begin ethics application** - Submit for research programme approval
6. **Identify PI** - Confirm Principal Investigator for research

---

**Created:** 2026-03-11  
**Status:** ⚠️ **AWAITING IMPLEMENTATION**  
**Action:** Review and implement before proceeding with P1 Phase 1
