# Specification: TypeScript CLI Implementation

## Overview

Build a production-ready TypeScript CLI tool for accessing New Zealand legislation data.

---

## Requirements

### Functional Requirements

1. **Search Legislation**
   - Full-text search with filters (type, status, date range)
   - Pagination support
   - Multiple output formats (table, JSON, CSV)

2. **Retrieve Legislation**
   - Get work by ID
   - Display work details
   - Show version history (when available)

3. **Export Data**
   - Export search results to CSV/JSON
   - Include reproducibility metadata
   - Support large exports (1000+ items)

4. **Generate Citations**
   - Multiple citation styles (NZMJ, BibTeX, RIS, APA)
   - Format-specific output

5. **Configuration Management**
   - API key storage
   - Rate limit configuration
   - Persistent settings

### Non-Functional Requirements

1. **Performance**
   - CLI startup: < 500ms
   - Search query: < 3s
   - Export 100 items: < 5s

2. **Reliability**
   - Graceful error handling
   - Rate limit compliance
   - Automatic retries

3. **Maintainability**
   - >80% test coverage
   - CI/CD pipeline
   - Comprehensive documentation

4. **Security**
   - Secure API key storage
   - No hardcoded secrets
   - Input validation

---

## Technical Specifications

### Technology Stack
- **Runtime:** Node.js 18+
- **Language:** TypeScript 5.5+
- **CLI Framework:** commander 12+
- **HTTP Client:** got 14+
- **Validation:** zod 3+
- **Testing:** vitest 2+

### API Integration
- **Base URL:** `https://api.legislation.govt.nz`
- **Endpoints:** `/v0/works`
- **Auth:** API key (query parameter)
- **Rate Limits:** 10,000/day, 2,000/5min burst

### Output Formats
- **Table:** Colored terminal tables (cli-table3)
- **JSON:** Pretty-printed
- **CSV:** Excel-compatible with headers

---

## Acceptance Criteria

### Must Have (MVP)
- [x] Search command working
- [x] Get command working
- [x] Export command working
- [x] Cite command working
- [x] Config command working
- [x] API integration functional
- [x] Error handling implemented

### Should Have
- [x] Test suite (>10 tests)
- [x] CI/CD pipeline configured
- [x] Error logging implemented
- [x] Version management implemented
- [x] Rate limits configurable

### Nice to Have
- [ ] Shell completions
- [ ] Interactive prompts
- [ ] Progress bars for exports
- [ ] Query history
- [ ] Docker support

---

## Success Metrics

1. **Functionality:** All commands working ✅
2. **Quality:** Tests passing (10/10) ✅
3. **Documentation:** README complete ✅
4. **CI/CD:** Pipeline configured ✅
5. **Code Review:** Approved for production ✅

---

**Version:** 1.0.0  
**Created:** 2026-03-08  
**Status:** ✅ **COMPLETED**
