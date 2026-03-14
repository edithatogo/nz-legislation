# Track: Documentation Site - Post-Launch Enhancements

**Track ID:** documentation-site-enhancements  
**Parent:** Documentation Site Completion ✅  
**Status:** ⏳ PENDING (post-launch enhancements not yet started)  
**Priority:** 🟡 MEDIUM  
**Timeline:** 2-4 weeks post-launch

---

## Summary

This track handles post-launch enhancements to the documentation site, including search functionality, analytics, and continuous improvements. These items are **not required for launch** and can be implemented after the site is live.

---

## Phase 1: Search Implementation (1-2 weeks)

**Dependency:** DocSearch application approval (external, 1-2 weeks)

### Tasks

- [ ] **1.1** Apply for Algolia DocSearch
  - Submit application at https://docsearch.algolia.com/apply/
  - URL: `https://edithatogo.github.io/nz-legislation/`
  - Repository: `https://github.com/edithatogo/nz-legislation`
  - **Timeline:** 10 minutes to apply

- [ ] **1.2** Wait for approval
  - **Timeline:** 1-2 weeks (external dependency)
  - **Status:** ⏳ BLOCKED (cannot proceed until DocSearch approval is granted)

- [ ] **1.3** Configure DocSearch credentials
  - Add to `documentation-site/.env`:
    ```bash
    ALGOLIA_APP_ID=<provided_by_algolia>
    ALGOLIA_API_KEY=<provided_by_algolia>
    ```
  - Verify config in `docusaurus.config.ts`:
    ```typescript
    algolia: {
      appId: process.env.ALGOLIA_APP_ID || 'temp_app_id',
      apiKey: process.env.ALGOLIA_API_KEY || 'temp_api_key',
      indexName: 'nz-legislation',
      contextualSearch: true,
    },
    ```

- [ ] **1.4** Test search functionality
  - Test basic search queries
  - Verify search results accuracy
  - Test keyboard navigation
  - Test mobile search

- [ ] **1.5** Deploy search-enabled site
  - Commit and push changes
  - Verify search works in production

**Outputs:**

- ✅ Search bar functional
- ✅ Search results accurate
- ✅ Mobile search working

---

## Phase 2: Analytics & Monitoring (1-2 hours)

### Tasks

- [ ] **2.1** Create Google Analytics 4 property
  - Visit https://analytics.google.com/
  - Create property: "NZ Legislation Tool"
  - Get Measurement ID (format: G-XXXXXXXXXX)
  - **Timeline:** 15 minutes

- [ ] **2.2** Configure analytics
  - Add to `documentation-site/.env`:
    ```bash
    GA_TRACKING_ID=G-XXXXXXXXXX
    ```
  - Enable in `docusaurus.config.ts`:
    ```typescript
    googleAnalytics: {
      trackingID: process.env.GA_TRACKING_ID || 'G-XXXXXXXXXX',
      anonymizeIP: true,
    },
    ```

- [ ] **2.3** Verify analytics working
  - Deploy changes
  - Check GA real-time reporting
  - Verify page views tracked

- [ ] **2.4** Set up uptime monitoring (OPTIONAL)
  - Create UptimeRobot account
  - Add monitor for `https://edithatogo.github.io/nz-legislation/`
  - Configure email alerts
  - **Timeline:** 20 minutes

- [ ] **2.5** Configure error tracking (OPTIONAL/FUTURE)
  - Evaluate Sentry.io
  - Add error tracking script
  - Configure error alerts
  - **Timeline:** 1 hour

**Outputs:**

- ✅ Google Analytics tracking
- ✅ Uptime monitoring (optional)
- ✅ Error tracking (optional/future)

---

## Phase 3: User Feedback Collection (2-3 hours)

### Tasks

- [ ] **3.1** Add feedback widget
  - Option A: Simple GitHub link
    ```jsx
    <p>
      Was this page helpful?
      <a href="https://github.com/edithatogo/nz-legislation/issues">Report an issue</a>
    </p>
    ```
  - Option B: Feedback form service (for example, Google Forms)
  - Option C: Dedicated feedback tool (Canny, UserVoice)
  - **Timeline:** 30 minutes

- [ ] **3.2** Add "Edit this page" links
  - Configure in `docusaurus.config.ts`:
    ```typescript
    editUrl: 'https://github.com/edithatogo/nz-legislation/tree/main/nz-legislation-tool/documentation-site/docs',
    ```
  - Verify links work on all pages

- [ ] **3.3** Set up feedback review process
  - Weekly review of feedback
  - Triage into GitHub issues
  - Respond to users

**Outputs:**

- ✅ Feedback mechanism in place
- ✅ Review process documented

---

## Phase 4: Continuous Improvement (Ongoing)

### Tasks

- [ ] **4.1** Monthly analytics review
  - Review top pages
  - Identify drop-off points
  - Track user flow
  - **Frequency:** Monthly

- [ ] **4.2** Quarterly content audit
  - Check for outdated information
  - Update screenshots
  - Verify all links
  - **Frequency:** Quarterly

- [ ] **4.3** Accessibility improvements
  - Run Lighthouse audit
  - Fix accessibility issues
  - Target: WCAG 2.1 AA compliance
  - **Frequency:** Quarterly

- [ ] **4.4** Performance optimization
  - Run Lighthouse performance audit
  - Optimize images
  - Improve load time
  - Target: >90 performance score
  - **Frequency:** Quarterly

- [ ] **4.5** User feedback implementation
  - Review feedback from Phase 3
  - Prioritize improvements
  - Implement high-impact changes
  - **Frequency:** Ongoing

**Outputs:**

- ✅ Monthly analytics reports
- ✅ Quarterly improvement updates

---

## Phase 5: Version Management (As Needed)

### Tasks

- [ ] **5.1** Create version management documentation
  - Create `docs/VERSIONING.md`
  - Document when to create versions
  - Document how to create versions
  - **Timeline:** 30 minutes

- [ ] **5.2** Create new documentation version (when needed)
  - Run: `npm run docusaurus docs:version 2.0.0`
  - Update `versions.json`
  - Test version switching
  - **Trigger:** Major releases

- [ ] **5.3** Maintain versioned documentation
  - Update current version continuously
  - Archive old versions as needed
  - Document breaking changes

**Outputs:**

- ✅ Version management process documented
- ✅ Versions created as needed

---

## Success Criteria

| Criterion     | Target     | Measurement            |
| ------------- | ---------- | ---------------------- |
| Search        | Functional | DocSearch working      |
| Analytics     | Configured | GA tracking active     |
| Feedback      | Accessible | Link on every page     |
| Uptime        | >99%       | UptimeRobot monitoring |
| Performance   | >90        | Lighthouse score       |
| Accessibility | AA         | Lighthouse audit       |

---

## Timeline

| Phase                | Duration  | Dependencies      |
| -------------------- | --------- | ----------------- |
| Phase 1: Search      | 1-2 weeks | Site must be live |
| Phase 2: Analytics   | 1-2 hours | None              |
| Phase 3: Feedback    | 2-3 hours | None              |
| Phase 4: Improvement | Ongoing   | Phases 1-3        |
| Phase 5: Versioning  | As needed | Major releases    |

**Total Time:** 4-6 hours + 1-2 week wait for DocSearch

---

## Resources

### Configuration Files

- `docusaurus.config.ts` - Main config
- `.env.example` - Environment template
- `sidebars.ts` - Navigation

### External Services

- [Algolia DocSearch](https://docsearch.algolia.com/)
- [Google Analytics](https://analytics.google.com/)
- [UptimeRobot](https://uptimerobot.com/)
- [Sentry](https://sentry.io/)

### Documentation

- [Docusaurus Search](https://docusaurus.io/docs/search)
- [Docusaurus Analytics](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-analytics)
- [Docusaurus Versioning](https://docusaurus.io/docs/versioning)

---

## Relationship to Parent Track

**Parent Track:** Documentation Site Completion ✅

This enhancement track is **optional** and **not required for launch**. The documentation site can launch successfully without:

- ❌ Search functionality (users can navigate via sidebar)
- ❌ Analytics (can be added later)
- ❌ Feedback widgets (can use GitHub issues directly)

**Recommendation:** The parent launch is treated as complete. Implement these
enhancements only when post-launch polish becomes a priority.

---

**Created:** 2026-03-11  
**Status:** ⏳ PENDING (post-launch enhancements not yet started)  
**Priority:** 🟡 MEDIUM
