# Project Separation Summary

**Date:** 2026-03-11  
**Status:** ✅ Guardrails defined, ⏳ Awaiting implementation

---

## Two Separate Projects

### 1. NZ Legislation Tool (Software)

**Purpose:** General-purpose software tool for accessing and analyzing NZ legislation

**Output:** 
- CLI application (npm package)
- API client library
- MCP server

**Audience:** Developers, researchers, policy analysts

**Repository:** `nz-legislation-tool/` (existing)

**Conductor:** `conductor/` folder (existing)

**Status:** ✅ Technical infrastructure complete

---

### 2. NZ Health Legislation Research Programme (Academic Research)

**Purpose:** Academic research programme producing 5 NZMJ papers on health legislation

**Output:**
- 5 peer-reviewed journal articles
- Policy briefs
- Research data and code (shared on acceptance)

**Audience:** Medical professionals, policymakers, health researchers

**Repository:** `nz-health-legislation-research/` (NEW - to be created)

**Conductor:** `research-conductor/` folder (NEW - created in root)

**Status:** ⏳ Protocol defined, requires ethics approval

---

## Key Differences

| Aspect | Software Tool | Research Programme |
|--------|--------------|-------------------|
| **Nature** | Software product | Academic research |
| **Output** | npm package, CLI | NZMJ journal articles |
| **Timeline** | Ongoing development | 12-16 weeks per paper |
| **Ethics** | Not required | Required (ethics approval) |
| **Authorship** | Software contributors | Academic co-authors (ICMJE criteria) |
| **Funding** | Software development | Research grants |
| **Data** | Public code | Access-controlled until publication |
| **Review** | Code review | Peer review (NZMJ) |

---

## Guardrails Implemented

### ✅ Created

1. **PROJECT_SEPARATION_GUARDRAILS.md** - 10 guardrails defining separation
2. **research-conductor/protocol.md** - Research protocol for academic programme
3. **NZMJ_SUBMISSION_GUIDELINES.md** - Journal requirements (research-specific)
4. **NZMJ_FIT_CHECKLIST.md** - Pre-submission checklist (research-specific)
5. **PUBLICATION_PIPELINE.md** - Manuscript preparation workflow (research-specific)

### ⏳ To Implement

1. **Create separate repository** - `nz-health-legislation-research/`
2. **Move research tracks** - P1-P5 to research repository
3. **Submit ethics application** - For research programme
4. **Appoint Principal Investigator** - For research programme
5. **Create OSF project** - For pre-registration
6. **Set up access controls** - For research data and code

---

## Directory Structure After Separation

### Software Repository (Existing)
```
nz-legislation-tool/
├── src/                          # Software source code
├── tests/                        # Software tests
├── package.json                  # npm package
├── README.md                     # Software README
├── conductor/                    # Software development tracks
│   ├── product.md
│   ├── tech-stack.md
│   ├── workflow.md
│   └── tracks/
│       ├── typescript-cli-implementation/
│       ├── comprehensive-testing/
│       ├── code-hardening-maturation/
│       ├── cicd-automation-optimization/
│       ├── documentation-optimization/
│       ├── developer-experience-enhancement/
│       ├── performance-scalability/
│       ├── testing-warning-hardening/
│       ├── track-11-advanced-automation/
│       ├── track-12-australian-expansion/
│       └── australian-legislation-implementation/
└── docs/                         # Software documentation
    ├── DEVELOPER_GUIDE.md
    ├── API_REFERENCE.md
    └── MCP_GUIDE.md
```

### Research Repository (NEW - To Create)
```
nz-health-legislation-research/
├── research-conductor/           # Research programme management
│   ├── protocol.md               # Research methodology ✅ Created
│   ├── corpus.md                 # Corpus definition (to create)
│   ├── workflow.md               # Research workflow (to create)
│   └── tracks/                   # Research tracks (to move)
│       ├── p1-legislative-volatility/
│       ├── p2-accountability-drift/
│       ├── p3-governance-load/
│       ├── p4-rights-vs-coercion/
│       └── p5-maori-governance-equity/
├── data/                         # Research data (access-controlled)
├── analysis/                     # Analysis scripts (access-controlled)
├── manuscripts/                  # Draft manuscripts
├── supplements/                  # Supplementary materials
├── docs/                         # Research documentation
│   ├── RESEARCH_PROTOCOL.md      # Move from conductor/
│   ├── PUBLICATION_PIPELINE.md   # Move from conductor/
│   ├── NZMJ_SUBMISSION_GUIDELINES.md  # Move from conductor/
│   ├── NZMJ_FIT_CHECKLIST.md     # Move from conductor/
│   ├── NZMJ_CORRECTIONS_APPLIED.md  # Move from conductor/
│   ├── RESEARCH_IMPROVEMENTS.md  # Move from conductor/
│   └── HUMANIZER_CHECKLIST.md    # Create
├── ethics/                       # Ethics documentation
└── README.md                     # Research programme README
```

---

## Why Separation Matters

### 1. Ethics and Governance
- Research requires ethics approval; software does not
- Different governance structures (PI vs. maintainers)
- Different oversight (ethics committee vs. community)

### 2. Data Access
- Research data must be controlled until publication
- Software code is open source immediately
- Different access requirements

### 3. Authorship
- Research: ICMJE academic authorship criteria
- Software: GitHub contributors, npm authors
- Different credit systems

### 4. Publication
- Research: NZMJ peer review
- Software: npm release, GitHub releases
- Different review processes

### 5. Funding and Conflicts
- Research: Research grants, ICMJE disclosures
- Software: Development funding, different conflicts
- Different declaration requirements

---

## Implementation Checklist

### Phase 1: Repository Setup (Week 1)

- [ ] **Create GitHub repository** - `nz-health-legislation-research/`
- [ ] **Set up access controls** - Research team only
- [ ] **Create directory structure** - As shown above
- [ ] **Move research tracks** - P1-P5 from `conductor/tracks/` to `research-conductor/tracks/`
- [ ] **Move documentation** - Research docs from `conductor/` to `research/docs/`
- [ ] **Create README.md** - Research programme overview

### Phase 2: Ethics and Governance (Week 1-2)

- [ ] **Appoint Principal Investigator** - Confirm PI for research programme
- [ ] **Submit ethics application** - To appropriate ethics committee
- [ ] **Create OSF project** - For pre-registration
- [ ] **Document authorship criteria** - ICMJE criteria for all tracks
- [ ] **Set up communication channels** - Research team meetings

### Phase 3: Pre-Registration (Before P1 Phase 4)

- [ ] **Complete ethics approval** - Receive approval letter
- [ ] **Register on OSF** - With analysis plan for P1
- [ ] **Document authorship agreements** - For P1 co-authors
- [ ] **Set up data management** - Secure storage for research data

### Phase 4: Ongoing (Throughout Research)

- [ ] **Weekly team meetings** - Research team check-ins
- [ ] **Milestone reviews** - At each stage gate
- [ ] **Co-author meetings** - At drafting and revision phases
- [ ] **Data access logging** - Track who accesses research data

---

## Current State vs. Target State

### Current State (Mixed)
```
Project Root/
├── conductor/
│   ├── tracks/
│   │   ├── p1-legislative-volatility/     ← Research track
│   │   ├── p2-accountability-drift/       ← Research track
│   │   ├── p3-governance-load/            ← Research track
│   │   ├── p4-rights-vs-coercion/         ← Research track
│   │   ├── p5-maori-governance-equity/    ← Research track
│   │   ├── typescript-cli-implementation/ ← Software track ✅
│   │   └── ...                            ← Software tracks ✅
│   ├── PUBLICATION_PIPELINE.md            ← Research doc (should move)
│   ├── NZMJ_SUBMISSION_GUIDELINES.md      ← Research doc (should move)
│   └── ...                                ← Mixed docs
└── research-conductor/
    └── protocol.md                        ← Research protocol ✅
```

### Target State (Separated)
```
nz-legislation-tool/                       ← Software repository
└── conductor/
    └── tracks/
        └── (software tracks only)         ← Software only ✅

nz-health-legislation-research/            ← Research repository (NEW)
├── research-conductor/
│   ├── protocol.md                        ← Research protocol ✅
│   └── tracks/
│       └── (P1-P5 research tracks)        ← Research only ✅
├── data/                                  ← Research data
├── analysis/                              ← Research code
└── docs/                                  ← Research docs
```

---

## Next Steps

### Immediate (Before P1 Phase 1)

1. **Review and acknowledge guardrails** - Confirm understanding of separation
2. **Create research repository** - Set up `nz-health-legislation-research/`
3. **Move research tracks** - Relocate P1-P5 to research repository
4. **Move research documentation** - Relocate research docs
5. **Appoint Principal Investigator** - Confirm PI
6. **Begin ethics application** - Submit for approval

### Before P1 Analysis (Phase 4)

1. **Complete ethics approval** - Receive approval letter
2. **OSF pre-registration** - Register P1 analysis plan
3. **Authorship agreements** - Document for P1

---

## Questions for Consideration

1. **Who will be Principal Investigator?** - Need to identify before ethics application
2. **Which ethics committee?** - NZ Health and Disability Ethics Committee or university ethics?
3. **Funding sources?** - Any research grants to declare?
4. **Māori co-authors for P5?** - Early identification needed
5. **Data repository?** - Where to deposit data on acceptance (Zenodo, Figshare, institutional)?

---

**Summary:** Clear guardrails have been defined to separate the NZ Legislation Tool (software) from the NZ Health Legislation Research Programme (academic research). Implementation requires creating a separate repository and moving research tracks and documentation.

**Created:** 2026-03-11  
**Status:** ✅ Guardrails defined, ⏳ Awaiting implementation  
**Next Action:** Review guardrails and confirm before proceeding with P1 Phase 1
