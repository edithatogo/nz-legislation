# Research Protocol

**Programme:** NZ Health Legislation Corpus Programme  
**Version:** 1.0  
**Date:** 2026-03-11  
**Status:** ⚠️ DRAFT - Requires ethics approval

**Conductor Architecture:**
- This research conductor: `nz-health-research/conductor/`
- Tool conductor (separate): `nz-legislation/conductor/`
- Base patterns: `.qwen/extensions/conductor/`

---

## 1. Programme Overview

### 1.1 Purpose
To analyze New Zealand health legislation using corpus linguistics methods to inform health policy debate ahead of the 2026 election.

### 1.2 Outputs
Five peer-reviewed research papers for publication in the New Zealand Medical Journal (NZMJ):
- P1: Legislative Volatility
- P2: Accountability Drift
- P3: Governance Load
- P4: Rights vs Coercion
- P5: Māori Governance Equity

### 1.3 Timeline
- **Duration:** 12-16 weeks (with parallel execution)
- **Start Date:** [To be determined]
- **Target Submission:** [To be determined - align with 2026 election cycle]

---

## 2. Research Methodology

### 2.1 Study Design
Corpus linguistics analysis of versioned legislation XML.

### 2.2 Data Source
- **Primary:** NZ Legislation API (https://api.legislation.govt.nz)
- **Corpus:** Health-related Acts and regulations, 2000-2026
- **Format:** XML where available, HTML/PDF as fallback

### 2.3 Inclusion Criteria
- Primary legislation with health-related provisions
- Secondary legislation (regulations, orders, rules)
- All published versions within scope period (2000-2026)

### 2.4 Exclusion Criteria
- Non-health legislation
- Proposed bills not enacted
- Repealed provisions outside scope period

### 2.5 Ethics Considerations
- **Human Participants:** No (public legislation only)
- **Ethics Approval:** Required (research involving analysis of policy documents)
- **Pre-registration:** OSF registration before analysis
- **Data Sharing:** Metadata and derived data on acceptance

---

## 3. Research Tracks

### 3.1 P1: Legislative Volatility

**Research Question:** What is the tempo and pattern of legislative change in NZ health law across reform cycles, and does reform frequency outpace implementation capacity?

**Methods:**
- Amendment frequency analysis
- Textual change rate measurement
- Reform cycle impact assessment
- Implementation burden indicators

**Primary Metrics:**
- Amendments per year per Act
- Word-level diff between versions
- Reform density (changes per cycle)
- Implementation burden index

**Status:** ✅ Protocol defined, ready for Phase 1

---

### 3.2 P2: Accountability Drift

**Research Question:** How have responsibilities shifted across institutions after Pae Ora?

**Methods:**
- Institutional responsibility coding
- Accountability mechanism tracking
- Before/after Pae Ora comparison

**Primary Metrics:**
- Responsibility attribution counts
- Accountability mechanism frequency
- Institutional change index

**Status:** ⏳ Protocol draft, needs enhancement

---

### 3.3 P3: Governance Load

**Research Question:** Has governance burden increased in NZ health legislation?

**Methods:**
- Reporting requirement counts
- Compliance provision analysis
- Administrative complexity measurement

**Primary Metrics:**
- Reporting requirements per Act
- Compliance obligation frequency
- Governance burden index

**Status:** ⏳ Protocol draft, needs enhancement

---

### 3.4 P4: Rights vs Coercion

**Research Question:** Has rights language displaced coercive language in mental health legislation?

**Methods:**
- Rights language frequency analysis
- Coercive language frequency analysis
- Balance ratio calculation

**Primary Metrics:**
- Rights language count (rights, autonomy, consent, choice)
- Coercive language count (compulsory, detain, restrain, mandate)
- Rights/coercion ratio over time

**Status:** ⏳ Protocol draft, needs enhancement

---

### 3.5 P5: Māori Governance Equity

**Research Question:** How has Māori governance and equity language evolved in NZ health law?

**Methods:**
- Te Tiriti reference tracking
- Māori governance language analysis
- Equity language evolution

**Primary Metrics:**
- Te Tiriti mention frequency
- Māori governance provision counts
- Equity language frequency

**Cultural Considerations:**
- Requires Māori co-authorship
- Te Tiriti principles applied to research
- Appropriate cultural interpretation

**Status:** ⏳ Protocol draft, needs enhancement + Māori co-author identification

---

## 4. Quality Assurance

### 4.1 Inter-Rater Reliability
- **Requirement:** 20% of corpus double-coded
- **Target:** Cohen's kappa κ > 0.7 for all categories
- **Process:** Independent coding by two researchers

### 4.2 Sensitivity Analysis
- **Corpus boundaries:** Test alternative inclusion criteria
- **Time periods:** Test different reform cycle definitions
- **Weighting:** Test alternative index weightings

### 4.3 Expert Review
- **Reviewers:** 1-2 health policy experts (not co-authors)
- **Sample:** 5-10% of coded provisions
- **Focus:** Face validity, coding categories, interpretation

### 4.4 Triangulation
- **Sources:** Policy documents, media analysis, parliamentary debates
- **Purpose:** Validate findings against independent data

### 4.5 Pre-Registration
- **Platform:** Open Science Framework (osf.io)
- **Timing:** Before Phase 4 (Analysis)
- **Content:** Research question, corpus, outcomes, analysis plan

### 4.6 Open Science
- **Code:** GitHub repository with analysis scripts
- **Data:** Zenodo/Figshare deposition (metadata, derived data)
- **Timing:** On journal acceptance

---

## 5. Authorship and Contributions

### 5.1 Authorship Criteria
ICMJE criteria (all 4 required):
1. Substantial contributions to conception/design, data acquisition, or analysis/interpretation
2. Drafting article or revising critically for important intellectual content
3. Final approval of version to be published
4. Agreement to be accountable for all aspects of work

### 5.2 Contribution Roles (CRediT Taxonomy)
- Conceptualization
- Data curation
- Formal analysis
- Investigation
- Methodology
- Project administration
- Resources
- Software
- Supervision
- Validation
- Visualization
- Writing – original draft
- Writing – review & editing

### 5.3 Authorship Agreements
- **Timing:** Before Phase 5 (Drafting)
- **Format:** Written agreement for each paper
- **Content:** Author order, contributions, responsibilities

---

## 6. Ethics and Compliance

### 6.1 Ethics Approval
- **Status:** ⚠️ Application required
- **Committee:** [To be determined - e.g., NZ Health and Disability Ethics Committee]
- **Reference:** [To be assigned]

### 6.2 Data Management
- **Storage:** Secure, access-controlled repository
- **Access:** Research team only (until publication)
- **Retention:** 5 years post-publication (per NZMJ requirements)

### 6.3 Conflicts of Interest
- **Disclosure:** ICMJE Uniform Disclosure Form for all authors
- **Timing:** At submission
- **Publication:** Included in published article

### 6.4 Funding
- **Sources:** [To be declared]
- **Role:** [To be declared - funder role in study]

---

## 7. Publication Strategy

### 7.1 Target Journal
- **Primary:** New Zealand Medical Journal (NZMJ)
- **Format:** Articles (3,000 words, 30 references)
- **Abstract:** 200 words, structured (Aims, Methods, Results, Conclusions)

### 7.2 Supplementary Materials
- Codebook
- Corpus list
- Analysis scripts
- Additional tables/figures

### 7.3 Press and Media
- **Coordination:** With NZMJ editorial office
- **Embargo:** Standard journal embargo policy
- **Spokespeople:** Lead author, Principal Investigator

### 7.4 Policy Briefs
- **Format:** 500-word summaries
- **Audience:** Policymakers, media
- **Timing:** Coordinated with publication

---

## 8. Governance

### 8.1 Principal Investigator
- **Name:** [To be appointed]
- **Role:** Overall responsibility for research programme
- **Contact:** [To be provided]

### 8.2 Research Team
- **Lead Researchers:** One per track (P1-P5)
- **Co-authors:** As per authorship agreements
- **Advisors:** Health policy experts, Māori advisors (for P5)

### 8.3 Meetings
- **Team Meetings:** Weekly during active phases
- **Co-author Meetings:** At key milestones (drafting, revision)
- **Advisor Meetings:** As needed (especially P5)

### 8.4 Decision-Making
- **Research Design:** Principal Investigator + Lead Researchers
- **Analysis Decisions:** Lead Researcher per track
- **Authorship Disputes:** Resolved per ICMJE guidelines

---

## 9. Risk Management

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Ethics approval delayed | Medium | High | Early application, clear scope |
| Māori co-author not secured (P5) | Medium | High | Early outreach, leverage networks |
| Inter-rater reliability fails | Medium | Medium | Early pilot, revise codebook |
| API rate limits exceeded | Low | Medium | Batch requests, caching |
| Timeline slippage | Medium | Medium | Parallel execution, buffer time |
| Journal rejection | Low | High | Pre-submission inquiry, rigorous review |

---

## 10. Timeline

### Phase 1: Framing (Week 1)
- Research question refinement
- OSF pre-registration preparation
- Gate 1: Framing review

### Phase 2: Corpus (Weeks 2-3)
- Harvest legislation from API
- Build metadata tables
- Gate 2: Corpus review

### Phase 3: Coding (Weeks 4-5)
- Draft codebook
- Pilot coding (20% for IRR)
- Freeze coding rules
- Gate 3: Coding review

### Phase 4: Analysis (Weeks 6-7)
- Run full coding
- Calculate metrics
- Sensitivity analysis
- Gate 4: Analysis review

### Phase 5: Drafting (Weeks 8-9)
- Write manuscript
- Compile supplement
- Gate 5: Drafting review

### Phase 6: Revision (Weeks 10-11)
- Humanizer pass
- NZMJ fit pass
- Reviewer simulation
- Gate 6: Revision review

### Phase 7: Submission (Week 12)
- Format and submit
- Policy brief
- Gate 7: Submission complete

---

## 11. References

1. NZMJ Instructions to Authors. https://www.nzmj.org.nz/contribute
2. ICMJE Recommendations. http://www.icmje.org/recommendations/
3. EQUATOR Network. https://www.equator-network.org/
4. STROBE Statement. https://www.strobe-statement.org/
5. OSF Pre-Registration. https://osf.io/

---

## 12. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-11 | [Author] | Initial draft |

---

**Status:** ⚠️ DRAFT - Requires ethics approval before implementation  
**Next Action:** Submit ethics application, appoint Principal Investigator
