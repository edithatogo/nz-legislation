# Australian Legislation APIs - Initial Research

## Executive Summary

This document provides initial research on Australian legislation APIs for potential integration into the NZ Legislation Tool.

**Research Date:** 2026-03-09  
**Status:** INITIAL RESEARCH  
**Confidence Level:** Preliminary - requires verification

---

## Known APIs

### 1. Queensland Legislation API ✅ CONFIRMED

**URL:** https://www.legislation.qld.gov.au/

**Status:** API exists, requires investigation

**Known Information:**
- Queensland has modern legislation website
- API likely available (needs verification)
- Covers Queensland Acts and subordinate legislation
- Point-in-time versions available

**Next Steps:**
- [ ] Locate API documentation
- [ ] Test API endpoints
- [ ] Assess authentication requirements
- [ ] Evaluate data quality and coverage

**Priority:** HIGH (specifically requested)

---

### 2. AustLII API ✅ CONFIRMED

**URL:** https://www.austlii.edu.au/

**Status:** API exists, widely used

**Known Information:**
- Australian Legal Information Institute
- Covers ALL Australian jurisdictions (Commonwealth + States + Territories)
- Free access
- Well-established service
- Multiple data formats available

**Coverage:**
- Commonwealth legislation
- All 6 states (NSW, VIC, QLD, WA, SA, TAS)
- All 2 territories (ACT, NT)
- Case law
- Treaties
- Law reform materials

**Next Steps:**
- [ ] Review API documentation in detail
- [ ] Test API access
- [ ] Assess rate limits
- [ ] Evaluate data completeness
- [ ] Review licensing terms

**Priority:** HIGH (comprehensive coverage)

---

### 3. Federal Register of Legislation (Commonwealth) ✅ CONFIRMED

**URL:** https://www.legislation.gov.au/

**Status:** Official Commonwealth legislation website

**Known Information:**
- Official source for Commonwealth legislation
- Modern website with API capabilities
- Covers Acts, Legislative Instruments, etc.
- Point-in-time versions
- Official citations

**Next Steps:**
- [ ] Locate API documentation
- [ ] Test API endpoints
- [ ] Assess authentication
- [ ] Evaluate data quality

**Priority:** HIGH (federal coverage)

---

### 4. NSW Legislation ⏳ NEEDS VERIFICATION

**URL:** https://www.legislation.nsw.gov.au/

**Status:** Website exists, API unclear

**Known Information:**
- Modern legislation website
- API availability unknown
- Covers NSW Acts and subordinate legislation

**Next Steps:**
- [ ] Investigate API availability
- [ ] Contact NSW legislation team if needed
- [ ] Assess alternative access methods

**Priority:** MEDIUM (most populous state)

---

### 5. Victoria Legislation ⏳ NEEDS VERIFICATION

**URL:** https://www.legislation.vic.gov.au/

**Status:** Website exists, API unclear

**Known Information:**
- Modern legislation website
- API availability unknown

**Next Steps:**
- [ ] Investigate API availability
- [ ] Assess alternative access methods

**Priority:** MEDIUM (second most populous state)

---

### 6. Other States/Territories ⏳ NEEDS VERIFICATION

**Western Australia:**
- URL: https://www.legislation.wa.gov.au/
- API: Unknown
- Priority: LOW

**South Australia:**
- URL: https://www.legislation.sa.gov.au/
- API: Unknown
- Priority: LOW

**Tasmania:**
- URL: https://www.legislation.tas.gov.au/
- API: Unknown
- Priority: LOW

**Northern Territory:**
- URL: https://legislation.nt.gov.au/
- API: Unknown
- Priority: LOW

**ACT:**
- URL: https://www.legislation.act.gov.au/
- API: Unknown
- Priority: LOW (small jurisdiction)

---

## Integration Strategy Options

### Option 1: AustLII-First Approach ⭐ RECOMMENDED

**Strategy:** Start with AustLII API

**Pros:**
- ✅ Single API for all jurisdictions
- ✅ Well-established and stable
- ✅ Free access
- ✅ Comprehensive coverage
- ✅ Lower integration complexity

**Cons:**
- ❌ May have rate limits
- ❌ Less control over data format
- ❌ Dependent on third-party service

**Implementation:**
1. Integrate AustLII API
2. Add jurisdiction filter
3. Extend citation formats
4. Test with users

**Timeline:** 4-6 weeks

---

### Option 2: Direct API Integration

**Strategy:** Integrate each jurisdiction's API directly

**Pros:**
- ✅ Direct access to official sources
- ✅ More control over data
- ✅ Potentially better performance
- ✅ Official citations guaranteed accurate

**Cons:**
- ❌ Multiple integrations required
- ❌ Higher complexity
- ❌ More maintenance burden
- ❌ Inconsistent APIs

**Implementation:**
1. Start with Queensland (requested)
2. Add Commonwealth
3. Add other states as available
4. Create abstraction layer

**Timeline:** 12-16 weeks

---

### Option 3: Hybrid Approach

**Strategy:** Use AustLII as primary, direct APIs for specific needs

**Pros:**
- ✅ Best of both worlds
- ✅ Fallback options
- ✅ Official sources for critical data

**Cons:**
- ❌ Most complex
- ❌ Higher maintenance

**Implementation:**
1. Start with AustLII
2. Add direct APIs for gaps
3. Implement smart routing

**Timeline:** 8-12 weeks

---

## Recommended Approach

**Recommendation:** **Option 1 (AustLII-First)** with Option 3 evolution

**Rationale:**
1. Fastest time to market
2. Lowest risk
3. Comprehensive coverage from day 1
4. Can add direct APIs later as needed
5. Proven track record (used by many Australian legal tech tools)

**Phased Rollout:**
- **Phase 1:** AustLII integration (4-6 weeks)
- **Phase 2:** Queensland direct API (if needed) (2-3 weeks)
- **Phase 3:** Commonwealth direct API (if needed) (2-3 weeks)
- **Phase 4:** Other jurisdictions (as needed)

---

## Technical Considerations

### Citation Format Extensions

**Current NZ Citations:**
- `act/YYYY/NN` format
- NZMJ style
- BibTeX, RIS, APA

**Australian Citation Requirements:**
- Commonwealth: `Act Name YYYY (Cth)`
- States: `Act Name YYYY (State)`
- Point-in-time citations
- Cross-jurisdiction citations

**Implementation:**
- Extend citation generator
- Add Australian styles
- Maintain NZ compatibility

### Search Enhancements

**Current:**
- NZ legislation only
- Single jurisdiction

**Required:**
- Multi-jurisdiction search
- Jurisdiction filters
- Commonwealth vs State distinction
- Improved relevance ranking

### Data Model Changes

**Current:**
- NZ-specific work types
- NZ status values

**Required:**
- Jurisdiction abstraction
- Extended work types
- Extended status values
- Multi-jurisdiction version tracking

---

## Licensing & Copyright

### Australian Government Copyright

**Commonwealth:**
- Generally Crown Copyright
- Non-commercial use typically allowed
- Attribution required
- Check specific terms

### State Copyright

**Varies by state:**
- Most allow non-commercial use
- Some more restrictive
- Attribution always required

### AustLII Licensing

**Status:** Free access
**Terms:** Non-commercial use
**Attribution:** Required
**Redistribution:** Check specific terms

**Next Steps:**
- [ ] Review AustLII terms of use
- [ ] Review Commonwealth copyright
- [ ] Review state-specific copyright
- [ ] Document requirements
- [ ] Ensure compliance

---

## Market Opportunity

### Potential Users

1. **Trans-Tasman Legal Professionals**
   - Law firms with AU/NZ practices
   - Corporate legal teams
   - Government agencies

2. **Researchers**
   - Comparative law research
   - Academic institutions
   - Policy analysts

3. **Australian Users**
   - Currently underserved
   - Existing tools expensive
   - Opportunity for free/low-cost alternative

4. **Existing NZ Users**
   - Expanded value proposition
   - Retention improvement

### Competitive Landscape

**Existing Australian Tools:**
- Lawlex (paid)
- TimeBase (paid)
- Legalwise (paid)
- AustLII (free, but basic)

**Opportunity:**
- Free/low-cost alternative
- Research-focused features
- Modern UX
- Cross-jurisdiction (NZ + AU)
- AI/MCP integration

---

## Next Steps

### Immediate (Week 1)
- [ ] Review AustLII API documentation
- [ ] Test AustLII API access
- [ ] Review Queensland legislation website for API
- [ ] Document API capabilities

### Short-term (Weeks 2-3)
- [ ] Create proof-of-concept integration
- [ ] Test with sample queries
- [ ] Assess data quality
- [ ] Review licensing terms

### Medium-term (Weeks 4-6)
- [ ] Design multi-jurisdiction architecture
- [ ] Create implementation plan
- [ ] Develop Go/No-Go recommendation
- [ ] Present findings

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Limited API availability | Low | Medium | AustLII fallback, web scraping |
| Licensing restrictions | Low | High | Early legal review, compliance |
| Data quality issues | Medium | Medium | Testing, validation, user feedback |
| Low adoption | Low | Medium | User research, phased rollout |
| High complexity | Medium | Medium | Modular design, phased approach |

---

## Success Metrics

### Research Phase
- [ ] Complete API inventory
- [ ] Working proof-of-concept
- [ ] Clear licensing understanding
- [ ] Architecture design complete
- [ ] Go/No-Go recommendation delivered

### Implementation Phase (if Go)
- [ ] AustLII integration working
- [ ] Queensland API integrated (if available)
- [ ] Multi-jurisdiction search working
- [ ] Australian citations working
- [ ] Users can access AU legislation

---

## Conclusion

**Preliminary Assessment:** ✅ **FEASIBLE**

**Recommended Path:**
1. Start with AustLII API (comprehensive, free, established)
2. Add Queensland direct API if needed/requested
3. Expand to other jurisdictions based on demand
4. Maintain NZ compatibility throughout

**Timeline:** 6-8 weeks research + 4-6 weeks implementation (if Go)

**Next Action:** Begin detailed API testing and documentation review

---

**Research Status:** INITIAL COMPLETE  
**Confidence:** MEDIUM (requires API testing)  
**Recommendation:** PROCEED TO DETAILED RESEARCH PHASE
