# Specification: Documentation Site Completion

## Overview

Complete the NZ Legislation Tool documentation site based on Docusaurus v3.

## Scope

This track completes Phases 3-8 of the original Documentation Site (Phase 8) track:
- Search & Navigation configuration
- Complete content migration (API Reference, Developer Guide, Troubleshooting)
- CI/CD & Deployment setup
- Analytics & Monitoring
- Testing & Launch
- Maintenance Process

## Technical Requirements

### Platform
- **Framework:** Docusaurus v3.9.2+
- **Node.js:** 18.0+
- **Package Manager:** npm/pnpm

### Hosting (Recommended)
- **Option A:** GitHub Pages (free, integrated with GitHub)
- **Option B:** Vercel (free tier, faster builds)
- **Option C:** Netlify (free tier, easy setup)

### Search
- **Service:** Algolia DocSearch (free for open source)
- **Configuration:** appId, apiKey, indexName

### Analytics (Optional)
- **Option A:** Google Analytics 4 (comprehensive, privacy concerns)
- **Option B:** Plausible (privacy-focused, paid)
- **Option C:** Fathom (privacy-focused, paid)

### Monitoring (Optional)
- **Uptime:** UptimeRobot (free tier)
- **Errors:** Sentry (free tier)

## Deliverables

1. **Migrated Documentation**
   - API Reference (3+ pages)
   - Developer Guide (3+ pages)
   - Troubleshooting (3+ pages)
   - Commands (3+ pages)

2. **Search Configuration**
   - DocSearch integrated
   - Search bar in navbar
   - Contextual search enabled

3. **Versioning System**
   - v1.0 tagged
   - Version dropdown in navbar
   - Version comparison working

4. **Deployment Pipeline**
   - Auto-deploy on push to main
   - Preview builds for PRs
   - Custom domain (optional)

5. **Analytics Dashboard**
   - Page views tracked
   - Search analytics
   - User behavior insights

6. **Launch**
   - Site live at production URL
   - All links updated
   - Announcement made

## Acceptance Criteria

- [ ] All documentation migrated (20+ pages total)
- [ ] Zero broken links
- [ ] Search functional
- [ ] Versioning operational
- [ ] Auto-deployment working
- [ ] Analytics tracking active
- [ ] Site accessible at production URL
- [ ] Mobile-responsive design verified
- [ ] Cross-browser tested
- [ ] Performance score >90 (Lighthouse)

## Out of Scope

- Blog functionality (not needed for documentation)
- Multi-language support (English only for now)
- Custom theme development (use default Docusaurus theme)
- Video tutorials (future enhancement)

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| DocSearch approval delayed | Medium | Medium | Use built-in search as fallback |
| Content migration takes longer | Medium | Low | Prioritize critical docs first |
| Deployment issues | Low | High | Test in staging first |
| Analytics privacy concerns | Low | Low | Use privacy-focused option |

## Success Metrics

- **Content:** 100% migration complete
- **Quality:** 0 broken links, 0 build warnings
- **Performance:** <3s page load, >90 Lighthouse score
- **Usage:** Track page views, search queries, popular pages

---

**Created:** 2026-03-11  
**Version:** 1.0  
**Status:** ⏳ PENDING
