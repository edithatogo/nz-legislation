# Information Architecture: Documentation Optimization & Humanization

**Date:** 2026-03-10  
**Track:** Documentation Optimization & Humanization  
**Phase:** 1 - Audit & Planning  
**Task:** 1.3

---

## Current State Analysis

### Problems Identified
1. **Scattered documentation** - Files in `conductor/`, `nz-legislation-tool/`, `nz-legislation/`
2. **Legacy confusion** - Rust vs TypeScript versions coexist
3. **No clear hierarchy** - Flat structure with 94 markdown files
4. **Mixed audiences** - Developer and end-user docs intermingled
5. **No navigation** - No table of contents or site structure
6. **Duplicate content** - Multiple status files, troubleshooting scattered

---

## Proposed Information Architecture

### Principle: Progressive Disclosure
- **Surface level:** Quick start, common tasks (for Rachel & Sam)
- **Middle layer:** User guides, tutorials (for all personas)
- **Deep dive:** API reference, architecture (for Dan & Alex)

### Structure Overview

```
nz-legislation-tool/
├── README.md                    # Main landing page (all personas)
├── docs/                        # Documentation root
│   ├── getting-started/         # First-time users
│   │   ├── index.md
│   │   ├── installation.md
│   │   ├── api-key-setup.md
│   │   ├── quick-start.md
│   │   └── video-tutorials.md
│   │
│   ├── user-guide/              # End users (Rachel, Sam)
│   │   ├── index.md
│   │   ├── commands/
│   │   │   ├── search.md
│   │   │   ├── get.md
│   │   │   ├── export.md
│   │   │   ├── cite.md
│   │   │   └── config.md
│   │   ├── examples/
│   │   │   ├── research-workflow.md
│   │   │   ├── common-searches.md
│   │   │   └── export-formats.md
│   │   ├── troubleshooting.md
│   │   └── faq.md
│   │
│   ├── developer-guide/         # Developers (Dan)
│   │   ├── index.md
│   │   ├── architecture.md
│   │   ├── contributing.md
│   │   ├── testing.md
│   │   ├── api-reference/
│   │   │   ├── overview.md
│   │   │   ├── client.md
│   │   │   ├── commands.md
│   │   │   └── types.md
│   │   └── deployment.md
│   │
│   ├── administrator-guide/     # Admins (Alex)
│   │   ├── index.md
│   │   ├── installation.md
│   │   ├── security.md
│   │   ├── monitoring.md
│   │   └── team-deployment.md
│   │
│   └── reference/               # All personas (reference material)
│       ├── index.md
│       ├── error-codes.md
│       ├── rate-limits.md
│       ├── changelog.md
│       ├── glossary.md
│       └── accessibility.md
│
├── CONTRIBUTING.md              # Contribution guidelines
├── TESTING.md                   # Testing guide
├── SECURITY.md                  # Security policy
├── CODE_OF_CONDUCT.md           # Community guidelines
└── LICENSE                      # License file
```

---

## Content Migration Plan

### Phase 1: Consolidation (Week 1)
1. **Archive legacy files**
   - Move `nz-legislation/` to `conductor/archive/legacy-rust/`
   - Keep only TypeScript version active

2. **Consolidate scattered docs**
   - Move `conductor/product.md` → `docs/reference/product-vision.md`
   - Move `conductor/tech-stack.md` → `docs/reference/tech-stack.md`
   - Move `conductor/workflow.md` → `docs/developer-guide/workflow.md`
   - Move `conductor/product-guidelines.md` → `docs/developer-guide/coding-standards.md`

3. **Create new structure**
   - Create `docs/` directory
   - Create subdirectories per IA
   - Set up navigation

### Phase 2: Creation (Week 2-3)
1. **Write new content**
   - FAQ (from common support questions)
   - Troubleshooting guide (consolidated)
   - Glossary (technical terms explained)
   - Error codes reference

2. **Create visual content**
   - Architecture diagram
   - Workflow flowcharts
   - Decision trees for troubleshooting

3. **Record videos**
   - Quick start (5 min)
   - API key setup (2 min)
   - Common workflows (3-5 min each)

### Phase 3: Enhancement (Week 4)
1. **Add search**
   - Implement Algolia or built-in search
   - Configure indexing
   - Add search analytics

2. **Accessibility audit**
   - WCAG 2.1 AA compliance
   - Alt text for images
   - Color contrast check
   - Keyboard navigation test

3. **Mobile optimization**
   - Responsive design
   - Mobile testing
   - Touch-friendly navigation

---

## Navigation Hierarchy

### Primary Navigation (Top Level)
```
Home | Getting Started | User Guide | Developer Guide | Admin Guide | Reference
```

### Secondary Navigation (Contextual)
Based on current section, show relevant subsections.

### Breadcrumb Navigation
```
Home > User Guide > Commands > Search
```

### Footer Navigation
```
- GitHub
- npm
- API Documentation
- Issues
- Discussions
- License
- Accessibility
```

---

## Cross-Linking Strategy

### Internal Links
- **Related commands:** Each command page links to related commands
- **Prerequisites:** Link to setup guides where needed
- **Examples:** Link from concepts to practical examples
- **Troubleshooting:** Link from error messages to solutions

### External Links
- **API docs:** Link to official NZ Legislation API
- **npm package:** Link to npm registry
- **GitHub:** Link to repository, issues, discussions

### Link Conventions
```markdown
✅ Use relative links for internal docs: `[Search Command](./commands/search.md)`
✅ Use absolute links for external resources: `[NZ Legislation API](https://api.legislation.govt.nz)`
✅ Open external links in new tab: `[API Docs](https://...){target="_blank"}`
❌ Avoid: `[Click here](...)` - use descriptive link text
```

---

## Content Organization Principles

### By User Goal (Not Feature)
**Instead of:**
- Search Command
- Get Command
- Export Command

**Use:**
- Find Legislation (search)
- View Specific Act (get)
- Export Data for Analysis (export)

### By Task Complexity
**Beginner:**
- Quick Start
- Installation
- First Search
- Basic Export

**Intermediate:**
- Advanced Filters
- Citation Styles
- Batch Operations
- Rate Limiting

**Advanced:**
- API Integration
- Custom Workflows
- Performance Tuning
- Contributing

### By Persona
Each section clearly indicates intended audience:
- 👤 **For Researchers** - User Guide
- 👨‍💻 **For Developers** - Developer Guide
- 🧑‍💼 **For Administrators** - Admin Guide
- 🎓 **For Students** - Getting Started (simplified path)

---

## Search Strategy

### Search Implementation
1. **Tool:** Algolia DocSearch (free for open source)
2. **Configuration:**
   - Index all markdown files
   - Weight by section (headings > body)
   - Include synonyms (e.g., "install" = "setup")
3. **Features:**
   - Full-text search
   - Faceted filtering (by section, persona)
   - Search analytics
   - "No results" tracking

### Search Optimization
- **Frontmatter:** Add metadata to each file
  ```yaml
  ---
  title: Search Command
  description: How to search for NZ legislation
  personas: [researcher, student]
  commands: [search]
  ---
  ```
- **Keywords:** Include common search terms naturally
- **Headings:** Use clear, descriptive headings (H1, H2, H3)

---

## URL Structure

### Clean URLs
```
✅ /docs/getting-started/installation
✅ /docs/user-guide/commands/search
✅ /docs/developer-guide/architecture

❌ /docs/getting-started/installation.md
❌ /docs/user-guide/commands/search.html
```

### Redirects (for legacy URLs)
If any files are moved or renamed, set up redirects:
```
/old-troubleshooting.md → /docs/user-guide/troubleshooting
/README-old.md → /
```

---

## Metadata & Tagging

### Frontmatter Schema
```yaml
---
title: "Page Title"
description: "One-sentence description for SEO"
personas:
  - researcher
  - student
commands:
  - search
  - export
related:
  - /docs/user-guide/examples/research-workflow
lastUpdated: 2026-03-10
---
```

### Tags
- **Commands:** search, get, export, cite, config
- **Personas:** researcher, developer, administrator, student
- **Topics:** installation, configuration, troubleshooting, examples
- **Difficulty:** beginner, intermediate, advanced

---

## Visual Design

### Page Layout
```
┌─────────────────────────────────────┐
│  Logo    Navigation      Search     │
├─────────────────────────────────────┤
│ Breadcrumb                          │
├──────────────┬──────────────────────┤
│ Sidebar      │ Main Content         │
│ (TOC)        │                      │
│              │  H1 Title            │
│ - Section 1  │  Introduction        │
│ - Section 2  │                      │
│ - Section 3  │  H2 Heading          │
│              │  Content...          │
│              │                      │
│              │  H2 Heading          │
│              │  Content...          │
├──────────────┴──────────────────────┤
│ Footer: Links, License, Accessibility│
└─────────────────────────────────────┘
```

### Responsive Breakpoints
- **Desktop (>1024px):** Full layout with sidebar
- **Tablet (768-1024px):** Collapsible sidebar
- **Mobile (<768px):** Hamburger menu, stacked content

---

## Accessibility Considerations

### WCAG 2.1 AA Compliance
1. **Perceivable**
   - Alt text for all images
   - Captions for videos
   - Sufficient color contrast (4.5:1 minimum)
   - Responsive text sizing

2. **Operable**
   - Keyboard navigation throughout
   - Skip to main content link
   - No time limits
   - Clear focus indicators

3. **Understandable**
   - Plain language (grade 8-10 reading level)
   - Consistent navigation
   - Clear headings hierarchy
   - Glossary for technical terms

4. **Robust**
   - Semantic HTML
   - ARIA labels where needed
   - Compatible with screen readers
   - Test with multiple browsers

### Accessibility Statement
Include in `/docs/reference/accessibility.md`:
- Commitment to accessibility
- Conformance level (WCAG 2.1 AA)
- Contact for accessibility issues
- Known limitations and workarounds

---

## Implementation Checklist

### Week 1: Structure
- [ ] Create `docs/` directory structure
- [ ] Archive legacy Rust documentation
- [ ] Move existing files to new locations
- [ ] Set up redirects for old URLs
- [ ] Create index pages for each section

### Week 2: Content
- [ ] Write FAQ (20+ questions)
- [ ] Consolidate troubleshooting guide
- [ ] Create glossary (50+ terms)
- [ ] Write error codes reference
- [ ] Create architecture diagrams

### Week 3: Visual & Video
- [ ] Record 5 video tutorials
- [ ] Add screenshots to all command docs
- [ ] Create flowcharts for workflows
- [ ] Design quick reference card (PDF)
- [ ] Add alt text to all images

### Week 4: Search & Accessibility
- [ ] Implement search (Algolia)
- [ ] Configure search analytics
- [ ] Accessibility audit
- [ ] Fix contrast issues
- [ ] Test with screen reader
- [ ] Mobile responsiveness testing

### Week 5: Launch
- [ ] Soft launch to beta testers
- [ ] Gather feedback
- [ ] Fix critical issues
- [ ] Full launch announcement
- [ ] Monitor analytics

---

## Success Metrics

### Quantitative
- **Time on page:** >2 minutes average
- **Bounce rate:** <40%
- **Search success rate:** >80%
- **Support tickets:** 50% reduction
- **Page views:** 1000+/month

### Qualitative
- **User feedback:** 4.5/5 average rating
- **Findability:** Users can find info in <30 seconds
- **Clarity:** "This was easy to understand" (survey)
- **Completeness:** "Found what I needed" (survey)

---

## Tools & Technologies

### Documentation Platform
**Option 1: Docusaurus (Recommended)**
- React-based
- Built-in search (Algolia)
- Versioning support
- Blog integration
- Easy deployment

**Option 2: VitePress**
- Vue-based
- Fast build times
- Simple configuration
- Good for smaller docs

**Option 3: GitBook**
- Hosted solution
- Easy collaboration
- Built-in analytics
- Paid for advanced features

### Search
- **Algolia DocSearch** (free for open source)
- **Built-in search** (Docusaurus/VitePress)
- **Lunr.js** (client-side, offline)

### Diagrams
- **Mermaid** (markdown-compatible)
- **Draw.io** (export to PNG/SVG)
- **Excalidraw** (hand-drawn style)

### Video Hosting
- **YouTube** (free, widely accessible)
- **Vimeo** (ad-free, professional)
- **GitHub Releases** (self-hosted)

---

**Prepared by:** AI Agent  
**Date:** 2026-03-10  
**Track:** Documentation Optimization & Humanization  
**Phase:** 1 - Audit & Planning  
**Task:** 1.3 - Information Architecture
