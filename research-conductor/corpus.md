# Corpus Definition

**Programme:** NZ Health Legislation Corpus Programme  
**Version:** 1.0  
**Date:** 2026-03-11  
**Status:** ⚠️ DRAFT - Requires ethics approval

---

## 1. Overview

This document defines the legislation corpus for the NZ Health Legislation Corpus Programme.

**Data Source:** NZ Legislation API (https://api.legislation.govt.nz)  
**Time Period:** 2000-2026  
**Format:** XML where available, HTML/PDF as fallback

---

## 2. Inclusion Criteria

### 2.1 Primary Legislation
- Acts with health-related provisions
- All amendments and revisions
- All published versions within scope period

### 2.2 Secondary Legislation
- Regulations
- Orders
- Rules
- Other legislative instruments with health-related provisions

### 2.3 Scope Period
- **Start Date:** 1 January 2000
- **End Date:** 31 December 2026 (or date of analysis)
- **All versions** published within this period

---

## 3. Exclusion Criteria

- Non-health legislation
- Proposed bills not enacted
- Repealed provisions outside scope period
- Provisions without health-related content

---

## 4. Target Corpus Size

| Category | Estimated Count |
|----------|-----------------|
| **Acts** | 50-100 |
| **Versions** | 500-1,000 |
| **Sections/Provisions** | 10,000+ |
| **Regulations** | 100-200 |

---

## 5. Key Legislation

### 5.1 Core Health Acts
- Health Act 1956
- New Zealand Public Health and Disability Act 2000
- Pae Ora (Healthy Futures) Act 2022
- Mental Health (Compulsory Assessment and Treatment) Act 1992
- Health and Disability Commissioner Act 1994
- Accident Compensation Act 2001
- Medicines Act 1981
- Smoke-free Environments Act 1990

### 5.2 Related Legislation
- Education Act 1989 (health-related provisions)
- Social Security Act 2018 (health-related provisions)
- Local Government Act 2002 (health-related provisions)
- Resource Management Act 1991 (health-related provisions)

---

## 6. Data Collection

### 6.1 API Endpoints

**Search Works:**
```
GET /v0/works?q={query}&limit={limit}
```

**Get Work Details:**
```
GET /v0/works/{work_id}
```

**Get Work Versions:**
```
GET /v0/works/{work_id}/versions
```

### 6.2 Search Queries

**Health-related keywords:**
- health, medical, clinical
- hospital, primary care, public health
- mental health, disability
- medicines, pharmaceutical
- smoking, tobacco, alcohol
- nutrition, food safety
- environmental health
- Māori health, health equity

### 6.3 Metadata Fields

For each work:
- work_id
- title
- legislation_type (Act, Regulation, etc.)
- legislation_status
- date_enacted
- date_repealed (if applicable)
- latest_version_id
- version_history

For each version:
- version_id
- title
- date_published
- formats (XML, HTML, PDF URLs)
- is_consolidated

---

## 7. Data Storage

### 7.1 Directory Structure

```
data/
├── raw/
│   ├── works/           # Raw API responses
│   └── versions/        # Version metadata
├── xml/
│   ├── acts/            # Act XML files
│   └── regulations/     # Regulation XML files
├── metadata/
│   ├── works_metadata.csv
│   ├── versions_metadata.csv
│   └── corpus_summary.csv
└── coded/
    ├── pilot/           # Pilot coding data
    └── main/            # Main coding data
```

### 7.2 Access Controls

- **Raw data:** Research team only
- **XML corpus:** Research team only
- **Metadata:** Research team only
- **Coded data:** Research team only (until publication)
- **On publication:** Metadata and derived data shared

---

## 8. Data Quality

### 8.1 Completeness Checks

- All identified health Acts included
- All versions within scope period captured
- XML availability confirmed for each version
- Metadata complete for all works

### 8.2 Version Control

- Track API access dates
- Record API version used
- Document any API changes during collection
- Maintain audit trail of data collection

### 8.3 Backup

- Daily backups during collection phase
- Version-controlled metadata files
- Secure cloud storage with redundancy

---

## 9. Ethics and Licensing

### 9.1 Ethics

- **Human Participants:** No (public legislation only)
- **Ethics Approval:** Required for research programme
- **Data Sensitivity:** Low (public documents)

### 9.2 Licensing

- **Legislation:** Crown copyright
- **API Data:** Terms of use apply
- **Research Data:** Shared on acceptance (CC-BY-NC-ND)

---

## 10. Corpus Boundaries (Sensitivity Analysis)

### 10.1 Primary Definition
- Health-related Acts and regulations, 2000-2026
- All versions included

### 10.2 Alternative Definitions (for sensitivity)

**Narrow:**
- Core health Acts only (Health Act, NZPHD Act, Pae Ora, Mental Health Act)
- Consolidated versions only

**Broad:**
- Any Act with health-related provisions
- All versions including non-consolidated

---

## 11. Timeline

| Phase | Activity | Duration |
|-------|----------|----------|
| **Week 2** | API harvesting | 1 week |
| **Week 3** | Metadata table creation | 1 week |
| **Week 3** | Corpus boundary documentation | 2-3 days |
| **Week 3** | Gate 2: Corpus review | 1 day |

---

## 12. References

1. NZ Legislation API Documentation. https://api.legislation.govt.nz/
2. Crown Copyright Guidelines. https://www.govt.nz/copyright/
3. NZMJ Data Sharing Policy. https://www.nzmj.org.nz/

---

**Status:** ⚠️ DRAFT - Requires ethics approval before implementation  
**Next Action:** Begin API harvesting (Phase 2) after ethics approval
