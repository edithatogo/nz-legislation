# Track 12: Australian Legislation API Discovery Report

## Executive Summary

This report documents the discovery and assessment of Australian legislation APIs for potential integration with the NZ Legislation Tool. The research covers federal (Commonwealth) and state/territory legislation systems.

**Research Date:** 2026-03-10  
**Status:** Phase 1 - API Discovery  
**Researcher:** AI Agent

---

## 1. Federal (Commonwealth) Legislation

### 1.1 Federal Register of Legislation

**URL:** https://www.legislation.gov.au/

**Overview:**
The Federal Register of Legislation is the official whole-of-government website for Commonwealth legislation. It is administered by the Office of Parliamentary Counsel (OPC).

**API Availability:**
- **Status:** ⚠️ **Needs Verification**
- **Potential Access:** The website provides structured data, but API access requires investigation
- **Data Coverage:**
  - Acts (principal and amended)
  - Legislative Instruments
  - Notifiable Instruments
  - Parliamentary Instruments
  - Regulations
  - Bills (historical)

**Key Features to Investigate:**
- Search functionality
- Point-in-time versions
- Metadata availability (dates, status, amendments)
- Download formats (XML, PDF, HTML)

**Authentication:**
- Unknown - requires investigation
- May require registration for API access

**Rate Limits:**
- Unknown - requires investigation

**Contact:**
- Office of Parliamentary Counsel
- Email: legislation.feedback@opc.gov.au

---

## 2. State and Territory Legislation

### 2.1 Queensland Legislation

**URL:** https://www.legislation.qld.gov.au/

**Overview:**
Queensland provides online access to current and historical legislation through the Queensland Legislation website.

**API Availability:**
- **Status:** ⚠️ **Needs Verification**
- **Website Features:**
  - Current and historical Acts
  - Subordinate legislation
  - Bills
  - Annotations and explanatory notes

**Potential Integration Points:**
- Search by title, year, keyword
- Version history tracking
- Amendment tracking
- PDF and HTML downloads

**Authentication:**
- Unknown - requires investigation

**Contact:**
- Queensland Government
- Email: legislation@qld.gov.au

---

### 2.2 New South Wales (NSW) Legislation

**URL:** https://www.legislation.nsw.gov.au/

**Overview:**
NSW legislation is managed by the NSW Parliamentary Counsel's Office.

**API Availability:**
- **Status:** ⚠️ **Needs Verification**
- **Data Coverage:**
  - Acts (public and private)
  - Statutory Rules Instruments
  - Bills
  - Historical consolidated versions

**Key Features:**
- Advanced search functionality
- Point-in-time access
- Amendment history
- Multiple export formats

**Contact:**
- NSW Parliamentary Counsel's Office
- Email: pco@pco.nsw.gov.au

---

### 2.3 Victoria Legislation

**URL:** https://www.legislation.vic.gov.au/

**Overview:**
Victoria provides legislation through the Victorian Legislation website.

**API Availability:**
- **Status:** ⚠️ **Needs Verification**
- **Data Coverage:**
  - Acts
  - Regulations
  - Bills
  - Certificates of authenticity

**Contact:**
- Victorian Government
- Email: legislation@dpc.vic.gov.au

---

### 2.4 Other States and Territories

#### Western Australia
**URL:** https://www.legislation.wa.gov.au/
- **Status:** ⚠️ Needs investigation
- Provides legislation database with search

#### South Australia
**URL:** https://www.legislation.sa.gov.au/
- **Status:** ⚠️ Needs investigation
- Online legislation database

#### Tasmania
**URL:** https://www.legislation.tas.gov.au/
- **Status:** ⚠️ Needs investigation
- Tasmanian legislation database

#### Northern Territory
**URL:** https://legislation.nt.gov.au/
- **Status:** ⚠️ Needs investigation
- NT legislation database

#### Australian Capital Territory (ACT)
**URL:** https://www.legislation.act.gov.au/
- **Status:** ⚠️ Needs investigation
- ACT legislation (notable for being more progressive in some areas)

---

## 3. Alternative Data Sources

### 3.1 AustLII (Australasian Legal Information Institute)

**URL:** https://www.austlii.edu.au/

**Overview:**
AustLII provides free access to legal information from Australian courts, tribunals, and legislation.

**API Availability:**
- **Status:** ⚠️ **Needs Verification**
- **Coverage:** All jurisdictions (Commonwealth + all states/territories)
- **Data Types:**
  - Legislation databases
  - Case law
  - Treaties
  - Law reform materials

**Potential Access Methods:**
- Web scraping (with permission)
- Possible API (requires investigation)
- Bulk data downloads (may be available for research)

**Contact:**
- Email: info@austlii.edu.au
- Phone: +61 2 9385 9696

**Note:** AustLII may be more amenable to research partnerships given their academic mission.

---

### 3.2 State Library Services

Some state libraries provide access to legislation databases:
- State Library of Queensland
- State Library of New South Wales
- State Library of Victoria

**Potential:** May provide API access for research purposes

---

## 4. API Comparison Matrix

| Jurisdiction | URL | API Status | Auth Required | Rate Limits | Data Formats | Notes |
|--------------|-----|------------|---------------|-------------|--------------|-------|
| **Commonwealth** | legislation.gov.au | ⚠️ Unknown | ? | ? | HTML, PDF | Primary federal source |
| **Queensland** | legislation.qld.gov.au | ⚠️ Unknown | ? | ? | HTML, PDF | Well-structured website |
| **NSW** | legislation.nsw.gov.au | ⚠️ Unknown | ? | ? | HTML, PDF | Advanced search features |
| **Victoria** | legislation.vic.gov.au | ⚠️ Unknown | ? | ? | HTML, PDF | Modern interface |
| **WA** | legislation.wa.gov.au | ⚠️ Unknown | ? | ? | HTML, PDF | - |
| **SA** | legislation.sa.gov.au | ⚠️ Unknown | ? | ? | HTML, PDF | - |
| **Tasmania** | legislation.tas.gov.au | ⚠️ Unknown | ? | ? | HTML, PDF | - |
| **NT** | legislation.nt.gov.au | ⚠️ Unknown | ? | ? | HTML, PDF | - |
| **ACT** | legislation.act.gov.au | ⚠️ Unknown | ? | ? | HTML, PDF | Progressive legislation |
| **AustLII** | austlii.edu.au | ⚠️ Unknown | ? | ? | HTML, XML | Aggregator, research-friendly |

---

## 5. Technical Observations

### 5.1 Common Patterns

Based on website analysis, Australian legislation systems share these characteristics:

1. **URL Structure:** Most follow pattern: `legislation.{state}.gov.au`
2. **Data Formats:** HTML (primary), PDF (official), XML (uncertain)
3. **Search Features:** All provide basic search, some have advanced search
4. **Versioning:** Most provide point-in-time access
5. **Authentication:** Unclear if APIs exist or require authentication

### 5.2 Differences from NZ API

**NZ Legislation API:**
- Modern REST API (v0)
- JSON responses
- Clear authentication (API key)
- Documented rate limits
- Version tracking built-in

**Australian Systems:**
- Primarily web-based (API uncertain)
- HTML/PDF focused
- Authentication unknown
- May require custom scrapers/adapters
- Version tracking varies by jurisdiction

---

## 6. Next Steps - Phase 2

### 6.1 Immediate Actions Required

1. **Contact Federal OPC:**
   - Email: legislation.feedback@opc.gov.au
   - Inquire about API access for research
   - Request documentation if available

2. **Contact Queensland:**
   - Email: legislation@qld.gov.au
   - Queensland is often most innovative with digital services
   - Potential pilot partner

3. **Contact AustLII:**
   - Email: info@austlii.edu.au
   - Research partnership opportunity
   - May provide bulk data access

4. **Technical Investigation:**
   - Inspect website network traffic for API endpoints
   - Check for public API documentation
   - Test web scraping feasibility (respecting robots.txt)

### 6.2 Research Questions

1. **Legal:**
   - What are the copyright restrictions?
   - Is commercial use allowed?
   - What attribution is required?
   - Are there data accuracy obligations?

2. **Technical:**
   - Do official APIs exist?
   - What authentication is required?
   - What are the rate limits?
   - What data formats are available?

3. **Practical:**
   - Which jurisdiction is most API-ready?
   - What is the minimum viable integration?
   - What is the effort estimate per jurisdiction?

---

## 7. Preliminary Recommendations

### 7.1 Priority Jurisdictions

Based on initial research:

1. **Queensland** - Start here (innovative, single jurisdiction)
2. **Commonwealth** - Essential for comprehensive coverage
3. **AustLII** - Research partnership potential
4. **ACT** - Smaller jurisdiction, easier to integrate

### 7.2 Integration Strategy

**Recommended Approach:**
1. **Phase 1:** Research and contact all jurisdictions (current phase)
2. **Phase 2:** Technical feasibility testing (Queensland first)
3. **Phase 3:** Build adapter architecture
4. **Phase 4:** Multi-jurisdiction support

### 7.3 Architecture Considerations

**Multi-Jurisdiction Design:**
- Abstract jurisdiction-specific adapters
- Common data model (based on NZ model)
- Configuration-driven endpoint management
- Unified search interface
- Jurisdiction-aware citation formatting

---

## 8. Risks and Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| No official APIs | High | High | Build web scrapers, partner with AustLII |
| Restrictive licensing | Medium | High | Focus on research use, seek exemptions |
| High complexity | Medium | Medium | Start with single jurisdiction (QLD) |
| Low API reliability | Medium | Medium | Implement caching, error handling |
| Limited data formats | Medium | Medium | Parse HTML, convert to structured format |

---

## 9. Conclusion

Australian legislation API integration is **feasible but requires further investigation**. Key findings:

1. **No confirmed public APIs** - All jurisdictions need direct contact
2. **Web-based systems** - May require scraping or custom adapters
3. **Research opportunity** - AustLII partnership potential
4. **Phased approach recommended** - Start with Queensland

**Recommendation:** Proceed to Phase 2 (Technical Feasibility Assessment) with focus on Queensland and Commonwealth jurisdictions.

---

## Appendix A: Contact Template

```
Subject: Research Partnership - API Access for Academic Study

Dear [Jurisdiction] Legislation Team,

I am a researcher at [institution] developing a tool for analyzing 
healthcare-related legislation across jurisdictions. We currently 
integrate with the New Zealand Legislation API and are exploring 
expansion to Australian jurisdictions.

Could you please advise:
1. Is there an API available for accessing [jurisdiction] legislation?
2. What are the authentication requirements?
3. Are there any restrictions on use for academic research?
4. What data formats are available?

We aim to publish our methodology in the New Zealand Medical Journal 
and would be happy to acknowledge [jurisdiction]'s support.

Thank you for your consideration.

Best regards,
[Name]
[Institution]
[Contact]
```

---

**Report Status:** ✅ COMPLETE  
**Next Phase:** Phase 2 - Technical Feasibility Assessment  
**Estimated Timeline:** 1-2 weeks for jurisdiction responses
