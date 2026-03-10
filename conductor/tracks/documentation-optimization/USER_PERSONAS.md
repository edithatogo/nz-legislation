# User Personas: Documentation Optimization & Humanization

**Date:** 2026-03-10  
**Track:** Documentation Optimization & Humanization  
**Phase:** 1 - Audit & Planning

---

## Overview

This document defines the primary user personas for the NZ Legislation Tool documentation. All documentation should be written with these personas in mind, ensuring content is targeted, relevant, and accessible.

---

## Persona 1: Researcher Rachel 👩‍🔬

### Profile
- **Name:** Rachel Chen
- **Role:** Healthcare Policy Researcher
- **Organization:** University research institute or government agency
- **Experience:** PhD in Public Health, 5+ years research experience
- **Technical Skills:** Intermediate (Excel, SPSS, basic command line)

### Goals
- Find healthcare-related legislation for analysis
- Export data to CSV for statistical analysis
- Generate citations for academic papers (NZMJ format)
- Track legislative changes over time
- Reproduce research for peer review

### Pain Points
- ❌ Intimidated by command-line interfaces
- ❌ Needs clear, step-by-step instructions
- ❌ Doesn't understand technical jargon (API, JSON, endpoints)
- ❌ Worried about making mistakes
- ❌ Needs reassurance and examples
- ❌ Time-poor, needs quick answers

### Documentation Needs
- ✅ **Quick Start Guide** - "Get running in 10 minutes"
- ✅ **Copy-paste examples** - Ready-to-use commands
- ✅ **Screenshots** - Show what output should look like
- ✅ **Video tutorials** - 3-5 minute walkthroughs
- ✅ **Citation guide** - How to cite in papers
- ✅ **Troubleshooting** - "What if I get this error?"
- ✅ **FAQ** - Common questions answered simply

### Preferred Formats
1. Step-by-step tutorials with screenshots
2. Video walkthroughs
3. One-page quick reference cards
4. Annotated examples
5. "Common workflows" section

### User Journey: First-Time Setup

```
1. Hears about tool from colleague
   ↓
2. Visits GitHub repository
   ↓
3. Reads README (needs clear value prop in 30 seconds)
   ↓
4. Clicks "Quick Start" (needs to work in <10 min)
   ↓
5. Gets API key (needs clear, simple instructions)
   ↓
6. Runs first command (needs immediate success)
   ↓
7. Exports data (needs CSV format)
   ↓
8. Cites in paper (needs NZMJ format)
   ↓
9. Becomes regular user
```

### Quotes (Representative)
> "I just need to find all health-related Acts from the last 5 years and export them to Excel. Is that possible?"

> "I don't care how it works, I just need it to work."

> "Can you show me an example? I learn better when I can see what it should look like."

---

## Persona 2: Developer Dan 👨‍💻

### Profile
- **Name:** Dan Williams
- **Role:** Software Developer / Research Software Engineer
- **Organization:** University IT, tech startup, or research lab
- **Experience:** 3+ years professional development
- **Technical Skills:** Advanced (TypeScript, Python, APIs, Git)

### Goals
- Integrate NZ Legislation API into applications
- Automate legislative monitoring workflows
- Build custom tools for researchers
- Contribute to open-source project
- Understand architecture for debugging

### Pain Points
- ❌ Lack of API documentation
- ❌ No code examples for integration
- ❌ Unclear error handling patterns
- ❌ Missing architecture diagrams
- ❌ No contribution guidelines
- ❌ Can't find source code easily

### Documentation Needs
- ✅ **API Reference** - Complete endpoint documentation
- ✅ **Architecture diagrams** - System overview, data flow
- ✅ **Code examples** - Integration patterns
- ✅ **Error handling guide** - Error codes, recovery strategies
- ✅ **Contributing guide** - How to submit PRs
- ✅ **Testing guide** - How to run tests, write new tests
- ✅ **Deployment guide** - Production setup

### Preferred Formats
1. API reference with request/response examples
2. Architecture diagrams (Mermaid, draw.io)
3. Code snippets (TypeScript, Python)
4. Technical deep-dives
5. Troubleshooting runbooks

### User Journey: Integration

```
1. Needs legislation data for app
   ↓
2. Searches for NZ Legislation API
   ↓
3. Finds npm package
   ↓
4. Reads API documentation
   ↓
5. Tests API calls (needs working examples)
   ↓
6. Integrates into application
   ↓
7. Handles errors (needs error code reference)
   ↓
8. Deploys to production (needs deployment guide)
   ↓
9. Contributes bug fix back (needs contributing guide)
```

### Quotes (Representative)
> "I need to know what error codes the API can return and how to handle them."

> "Is there a TypeScript type definition for the response schema?"

> "Can I see the architecture? I want to understand how the caching layer works."

---

## Persona 3: Administrator Alex 🧑‍💼

### Profile
- **Name:** Alex Thompson
- **Role:** IT Administrator / Research Infrastructure Manager
- **Organization:** University, government department, research institute
- **Experience:** 5+ years IT management
- **Technical Skills:** Intermediate-Advanced (systems, security, deployment)

### Goals
- Install and configure tool for research team
- Manage API keys securely
- Ensure compliance with security policies
- Monitor usage and costs
- Troubleshoot production issues

### Pain Points
- ❌ Unclear system requirements
- ❌ No security documentation
- ❌ Missing deployment checklists
- ❌ No monitoring or logging guidance
- ❌ Unclear licensing terms
- ❌ No support contact information

### Documentation Needs
- ✅ **Installation guide** - System requirements, dependencies
- ✅ **Security guide** - API key management, access control
- ✅ **Deployment checklist** - Production-ready configuration
- ✅ **Monitoring guide** - Logs, metrics, alerts
- ✅ **Troubleshooting runbook** - Common issues and fixes
- ✅ **License information** - Usage rights, restrictions
- ✅ **Support contacts** - Where to get help

### Preferred Formats
1. Checklists and runbooks
2. Security compliance matrices
3. Monitoring dashboards examples
4. Troubleshooting flowcharts
5. Contact information and SLAs

### User Journey: Team Deployment

```
1. Research team requests tool installation
   ↓
2. Reviews system requirements
   ↓
3. Installs on shared server
   ↓
4. Configures API keys (needs security guidance)
   ↓
5. Sets up monitoring (needs logging docs)
   ↓
6. Trains researchers (needs user guides)
   ↓
7. Monitors usage (needs rate limit tracking)
   ↓
8. Troubleshoots issues (needs runbook)
   ↓
9. Renews API key annually (needs reminder system)
```

### Quotes (Representative)
> "What are the system requirements? Do we need a dedicated server?"

> "How do we manage API keys for a team of 20 researchers?"

> "Is there a way to monitor usage so we don't exceed rate limits?"

---

## Persona 4: Student Sam 🎓

### Profile
- **Name:** Sam Patel
- **Role:** Undergraduate/Masters Student
- **Organization:** University
- **Experience:** Limited professional experience
- **Technical Skills:** Basic (word processing, web browsing, some coding)

### Goals
- Find legislation for assignment or thesis
- Learn how to use research tools
- Cite sources correctly
- Complete coursework efficiently

### Pain Points
- ❌ Never used command line before
- ❌ Doesn't understand technical terms
- ❌ Afraid of breaking something
- ❌ Needs lots of examples
- ❌ Limited time (assignment deadlines)
- ❌ May not have API key immediately

### Documentation Needs
- ✅ **"Explain Like I'm 5"** sections
- ✅ **Glossary** - Technical terms explained
- ✅ **Video tutorials** - Watch and follow along
- ✅ **Assignment examples** - Real use cases
- ✅ **Citation guide** - How to reference in assignments
- ✅ **Troubleshooting** - "I got this error, what do I do?"
- ✅ **Contact for help** - Who to ask when stuck

### Preferred Formats
1. Video tutorials with voiceover
2. Annotated screenshots
3. Simple language, no jargon
4. Step-by-step with checkmarks
5. "Common mistakes" section

### User Journey: First Assignment

```
1. Professor assigns legislation research task
   ↓
2. Searches for tools online
   ↓
3. Finds NZ Legislation Tool
   ↓
4. Reads documentation (needs to be simple)
   ↓
5. Gets API key (may need supervisor help)
   ↓
6. Follows tutorial (needs video)
   ↓
7. Runs first search (needs immediate success)
   ↓
8. Exports results (needs CSV for Excel)
   ↓
9. Cites in assignment (needs citation guide)
   ↓
10. Submits assignment
```

### Quotes (Representative)
> "I've never used the command line before. Is there a video I can watch?"

> "What does 'API key' mean? How do I get one?"

> "How do I cite this in my assignment? What format?"

---

## Documentation Mapping

### By Persona Priority

| Content Type | Rachel | Dan | Alex | Sam |
|--------------|--------|-----|------|-----|
| Quick Start | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| API Reference | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| Tutorials | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Troubleshooting | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Contributing | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ |
| Security Guide | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ |
| Citation Guide | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐⭐ |
| Architecture | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ |
| FAQ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Video Tutorials | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## Writing Guidelines by Persona

### For Rachel (Researcher)
- ✅ Use plain language, avoid jargon
- ✅ Provide copy-paste examples
- ✅ Show expected output
- ✅ Include "why" not just "how"
- ✅ Link to citation guides
- ✅ Add screenshots

### For Dan (Developer)
- ✅ Provide complete code examples
- ✅ Include error handling
- ✅ Link to source code
- ✅ Document edge cases
- ✅ Include performance notes
- ✅ Add architecture diagrams

### For Alex (Administrator)
- ✅ Use checklists and runbooks
- ✅ Include security considerations
- ✅ Provide monitoring guidance
- ✅ Document system requirements
- ✅ Add troubleshooting flowcharts
- ✅ Include contact information

### For Sam (Student)
- ✅ Explain technical terms
- ✅ Use "Explain Like I'm 5" sections
- ✅ Provide video tutorials
- ✅ Include assignment examples
- ✅ Add glossary
- ✅ Be encouraging and friendly

---

## Success Metrics

### For Each Persona

| Persona | Success Metric | Target |
|---------|---------------|--------|
| Rachel | Time to first successful export | <10 minutes |
| Dan | Time to integrate API | <1 hour |
| Alex | Time to deploy for team | <30 minutes |
| Sam | Assignment completed successfully | 100% pass rate |

### Documentation Analytics to Track
- Page views per persona section
- Time on page
- Bounce rate
- Search queries (what are they looking for?)
- Feedback ratings (thumbs up/down)
- Support tickets reduced

---

## Next Steps

1. **Validate personas** - Interview real users to confirm
2. **Create persona cards** - One-page summaries for team
3. **Map existing content** - Which docs serve which persona?
4. **Identify gaps** - What content is missing for each persona?
5. **Prioritize creation** - Start with highest-impact persona

---

**Prepared by:** AI Agent  
**Date:** 2026-03-10  
**Track:** Documentation Optimization & Humanization  
**Phase:** 1 - Audit & Planning
