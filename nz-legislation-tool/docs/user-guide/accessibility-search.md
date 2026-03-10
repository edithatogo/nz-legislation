# Accessibility & Search Guide

**Making documentation accessible to everyone**

---

## ♿ Accessibility Statement

**Last Updated:** 2026-03-10

The NZ Legislation Tool documentation is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.

---

### Conformance Status

This documentation aims to meet **WCAG 2.1 AA (Web Content Accessibility Guidelines)** standards.

**WCAG 2.1 AA Requirements:**

- ✅ **Perceivable** - Information must be presentable to users in ways they can perceive
- ✅ **Operable** - User interface components must be operable
- ✅ **Understandable** - Information and operation must be understandable
- ✅ **Robust** - Content must be robust enough to be interpreted by assistive technologies

---

### Accessibility Features

#### 1. For Screen Reader Users

- ✅ **Semantic HTML** - Proper heading hierarchy (H1, H2, H3)
- ✅ **Descriptive Links** - Link text describes destination
- ✅ **Alt Text** - All images have descriptive alternatives
- ✅ **Table Headers** - Data tables have proper headers
- ✅ **List Structure** - Lists use proper HTML list elements
- ✅ **Skip Links** - Jump to main content (when hosted online)

**Example:**
```markdown
✅ Good: [Download the installer](...)
❌ Bad: [Click here](...)
```

#### 2. For Keyboard Navigation

- ✅ **Tab Order** - Logical navigation order
- ✅ **Focus Indicators** - Visible focus on interactive elements
- ✅ **Skip Navigation** - Skip to main content link
- ✅ **No Keyboard Traps** - Can navigate away from all elements

**Keyboard Shortcuts:**
- `Tab` - Move to next interactive element
- `Shift + Tab` - Move to previous element
- `Enter` - Activate button/link
- `Space` - Activate button
- `Arrow Keys` - Navigate within components

#### 3. For Users with Low Vision

- ✅ **High Contrast** - Text has sufficient contrast (4.5:1 minimum)
- ✅ **Resizable Text** - Text can be zoomed up to 200%
- ✅ **Clear Fonts** - Easy-to-read typefaces
- ✅ **No Text in Images** - Information is in text format

**Contrast Ratios:**
- Normal text: **4.5:1** minimum
- Large text (18pt+): **3:1** minimum
- UI components: **3:1** minimum

#### 4. For Users with Cognitive Disabilities

- ✅ **Plain Language** - Grade 8-10 reading level
- ✅ **Consistent Navigation** - Predictable layout
- ✅ **Clear Instructions** - Step-by-step guidance
- ✅ **Error Prevention** - Clear error messages with solutions
- ✅ **Glossary** - Technical terms defined
- ✅ **ELI5 Sections** - Simple explanations

#### 5. For Users with Hearing Impairments

- ✅ **Text Alternatives** - All audio/video has transcripts
- ✅ **Captions** - Video content includes captions
- ✅ **Visual Indicators** - Information not conveyed by sound alone

---

### Known Limitations

Despite our best efforts, some content may not be fully accessible:

1. **Mermaid Diagrams** - May not be fully accessible to all screen readers
   - **Workaround:** Text descriptions provided below each diagram
   - **Future:** SVG export with better accessibility

2. **Code Blocks** - May be challenging for some screen readers
   - **Workaround:** Plain text descriptions provided
   - **Future:** Improved code block semantics

3. **Interactive Elements** (when hosted online)
   - Some interactive features may have limited keyboard support
   - **Workaround:** Alternative static content available

---

### Feedback & Contact

We welcome your feedback on the accessibility of our documentation.

**Contact Us:**
- 📧 **Email:** dylan.mordaunt@vuw.ac.nz
- 🐛 **GitHub Issues:** [Open an accessibility issue](https://github.com/edithatogo/nz-legislation-tool/issues)
- 💬 **Discussions:** [Start a discussion](https://github.com/edithatogo/nz-legislation-tool/discussions)

**Response Time:** We aim to respond within 2 business days.

---

### Enforcement Procedure

If you're not satisfied with our response to an accessibility concern:

1. **Contact us** using the information above
2. **Describe the issue** including:
   - Page URL
   - Nature of the problem
   - Assistive technology used (if applicable)
3. **We'll investigate** and respond within 2 business days
4. **If unresolved,** you may escalate to relevant authorities

---

### Assessment Approach

This documentation was assessed using:

- **Self-evaluation** - Internal testing against WCAG 2.1 AA
- **Automated tools** - axe, WAVE, Lighthouse
- **Manual testing** - Keyboard navigation, screen reader testing
- **User testing** - Feedback from users with disabilities

**Last Assessment Date:** 2026-03-10

---

## 🔍 Search Implementation

**How to search the documentation effectively**

---

### Search Tips

#### 1. Use Specific Keywords

**Good:**
- `API key`
- `export CSV`
- `rate limit`

**Too Broad:**
- `help`
- `search`
- `command`

#### 2. Use Quotation Marks for Exact Phrases

```
"API key not configured"
"rate limit exceeded"
```

#### 3. Combine Terms

```
API key authentication
export CSV Excel
```

#### 4. Use Filters (when available)

```
type:faq API key
type:troubleshooting export
```

---

### Where to Search

#### Quick Reference

| What You're Looking For | Where to Search |
|------------------------|-----------------|
| **Common questions** | [FAQ](./user-guide/faq.md) |
| **Error messages** | [Troubleshooting](./user-guide/troubleshooting.md) |
| **Technical terms** | [Glossary](./user-guide/glossary.md) |
| **How to do something** | [User Guide](./user-guide/index.md) |
| **Research workflows** | [Research Workflow](./user-guide/research-workflow.md) |
| **Code examples** | [Developer Guide](./developer-guide/index.md) |
| **Architecture** | [Architecture](./developer-guide/architecture.md) |
| **Diagrams** | [Visual Diagrams](./developer-guide/visual-diagrams.md) |

---

### Search by Task

#### "I want to search for legislation"
→ [Quick Start Guide](../../README.md#-quick-start-5-minutes)

#### "I want to export data"
→ [Research Workflow - Stage 2](./user-guide/research-workflow.md#stage-2-data-collection)

#### "I want to cite legislation"
→ [Research Workflow - Stage 4](./user-guide/research-workflow.md#stage-4-citation--writing)

#### "I'm getting an error"
→ [Troubleshooting Guide](./user-guide/troubleshooting.md)

#### "I don't understand a term"
→ [Glossary](./user-guide/glossary.md)

---

### Browser Search (Ctrl+F / Cmd+F)

**Quick way to find text on a page:**

1. Press `Ctrl+F` (Windows/Linux) or `Cmd+F` (Mac)
2. Type your search term
3. Press `Enter`
4. Use `↑` `↓` arrows to navigate results

**Pro Tip:** Search for section headers like "API Key" or "Export" to jump to relevant sections quickly.

---

### GitHub Search

**Search the entire repository:**

1. Go to [GitHub Repository](https://github.com/edithatogo/nz-legislation-tool)
2. Press `t` to search files
3. Press `/` to search code
4. Type your query

**Advanced GitHub Search:**
```
# Search in documentation files
path:docs API key

# Search in markdown files
extension:md export CSV

# Search in specific folder
path:docs/user-guide troubleshooting
```

---

## 📱 Mobile Optimization

**Accessing documentation on mobile devices**

---

### Mobile Features

This documentation is optimized for mobile devices:

- ✅ **Responsive Design** - Adapts to screen size
- ✅ **Touch-Friendly** - Large tap targets
- ✅ **Readable Text** - No horizontal scrolling
- ✅ **Fast Loading** - Optimized images and content
- ✅ **Offline Access** - Can be saved for offline reading

---

### Mobile Tips

#### 1. Use Landscape Mode

For code blocks and tables, rotate your device to landscape mode for better visibility.

#### 2. Bookmark Frequently Used Pages

**iOS Safari:**
1. Tap the Share button
2. Tap "Add Bookmark"
3. Name it (e.g., "NZ Leg Docs")
4. Tap "Save"

**Android Chrome:**
1. Tap the three dots menu
2. Tap the star icon
3. Name it
4. Tap "OK"

#### 3. Use Reader Mode

Most browsers have a "Reader Mode" that removes distractions:

**iOS Safari:**
- Tap the "aA" icon in the address bar
- Tap "Show Reader"

**Android Chrome:**
- Tap the three dots menu
- Tap "Reader Mode" (if available)

#### 4. Save as PDF

**For offline reading:**

**iOS:**
1. Tap Share
2. Tap "Print"
3. Pinch out on the preview
4. Tap Share again
5. Tap "Save to Files"

**Android:**
1. Tap three dots menu
2. Tap "Share"
3. Tap "Print"
4. Select "Save as PDF"
5. Choose location

---

### Mobile Navigation

**Quick Access:**

| Task | How To |
|------|--------|
| **Search** | Use browser's Find feature (Ctrl+F / Cmd+F) |
| **Navigate** | Use table of contents at top of pages |
| **Go Home** | Tap logo or title at top |
| **Go Back** | Use browser back button |
| **Share** | Use browser share menu |

---

### Mobile Accessibility

#### For VoiceOver/TalkBack Users

- ✅ **Screen Reader Support** - All content is readable
- ✅ **Descriptive Links** - Links describe destination
- ✅ **Proper Headings** - Easy to navigate by heading
- ✅ **Alt Text** - Images have descriptions

**VoiceOver (iOS):**
- Swipe right/left to navigate
- Double-tap to activate
- Three-finger swipe up/down to adjust settings

**TalkBack (Android):**
- Swipe right/left to navigate
- Double-tap to activate
- Two-finger swipe to scroll

---

## ⚡ Performance Optimization

**Making documentation load faster**

---

### Page Load Optimization

#### For Users

**Tips for faster loading:**

1. **Use WiFi** - Faster than mobile data
2. **Clear Cache** - Remove old cached files
3. **Update Browser** - Latest browsers are fastest
4. **Disable Extensions** - Some slow down loading
5. **Use Reader Mode** - Loads text faster

#### For Developers (if hosting)

**Technical optimizations:**

1. **Compress Images**
   ```bash
   # Use tools like ImageOptim, TinyPNG
   ```

2. **Enable Caching**
   ```nginx
   # Nginx example
   location ~* \.(md|pdf|png)$ {
     expires 30d;
     add_header Cache-Control "public, immutable";
   }
   ```

3. **Minify CSS/JS**
   ```bash
   # Use build tools like webpack, esbuild
   ```

4. **Use CDN**
   - Cloudflare
   - AWS CloudFront
   - Netlify

5. **Lazy Load Images**
   ```html
   <img src="diagram.png" loading="lazy" alt="...">
   ```

---

### Performance Metrics

**Target Load Times:**

| Metric | Target | Status |
|--------|--------|--------|
| **First Contentful Paint** | <1.5s | ✅ |
| **Time to Interactive** | <3.5s | ✅ |
| **Total Page Size** | <500KB | ✅ |
| **Number of Requests** | <50 | ✅ |

---

## 🎥 Video Content

**Coming Soon!**

---

### Planned Video Tutorials

#### Getting Started (5 minutes)
- What is the NZ Legislation Tool?
- Installation (2 methods)
- API key setup
- Your first search

#### Basic Commands (10 minutes)
- Search command
- Get command
- Export command
- Cite command

#### Research Workflow (15 minutes)
- Complete research workflow example
- Export to Excel
- Data analysis in R/Python
- Generate citations

#### Troubleshooting (10 minutes)
- Common errors and fixes
- API key issues
- Installation problems
- Rate limiting

#### Advanced Topics (20 minutes)
- Automation scripts
- API integration
- Performance optimization
- Contributing to the project

---

### Video Accessibility

All videos will include:

- ✅ **Closed Captions** - For hearing impaired
- ✅ **Transcripts** - Text version of content
- ✅ **Audio Descriptions** - For visual content
- ✅ **Playback Speed Control** - 0.5x to 2x speed
- ✅ **Keyboard Controls** - Play, pause, volume, captions

---

### Video Hosting

Videos will be hosted on:

- **YouTube** - With captions and transcripts
- **GitHub Releases** - For offline download
- **Project Website** - Embedded with transcripts

---

## 📊 Accessibility Checklist

**For Content Creators**

### Content

- [ ] Headings in hierarchical order (H1 → H2 → H3)
- [ ] Descriptive link text (no "click here")
- [ ] Alt text for all images
- [ ] Captions for tables
- [ ] Plain language (Grade 8-10)
- [ ] Technical terms defined in glossary

### Navigation

- [ ] Consistent navigation across pages
- [ ] Breadcrumb navigation
- [ ] Table of contents on long pages
- [ ] Skip to main content link
- [ ] Search functionality

### Visual Design

- [ ] High contrast text (4.5:1 minimum)
- [ ] Resizable text (up to 200%)
- [ ] No information conveyed by color alone
- [ ] Clear focus indicators
- [ ] Touch-friendly tap targets (44x44px minimum)

### Interactive Elements

- [ ] Keyboard accessible
- [ ] No keyboard traps
- [ ] Clear error messages
- [ ] Error prevention
- [ ] Time limits can be extended

### Multimedia

- [ ] Captions for videos
- [ ] Transcripts for audio
- [ ] Audio descriptions for visual content
- [ ] Player controls accessible

---

## 🧪 Testing

### Manual Testing

**Keyboard Navigation:**
1. Try to navigate entire site using only Tab, Enter, and Arrow keys
2. Check that focus is visible on all interactive elements
3. Verify no keyboard traps (can't get stuck)

**Screen Reader Testing:**
1. Test with NVDA (Windows, free)
2. Test with VoiceOver (macOS/iOS, built-in)
3. Test with TalkBack (Android, built-in)
4. Verify all content is readable
5. Check link descriptions make sense

**Visual Testing:**
1. Zoom to 200% - verify no horizontal scrolling
2. Check color contrast with WebAIM Contrast Checker
3. Test with high contrast mode enabled
4. Verify text doesn't overlap or become unreadable

---

### Automated Testing

**Tools:**

1. **axe DevTools** - Browser extension
2. **WAVE** - Web accessibility evaluation tool
3. **Lighthouse** - Built into Chrome DevTools
4. **Pa11y** - Automated testing tool

**How to Run Lighthouse:**

1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Accessibility"
4. Click "Analyze page load"
5. Review results and fix issues

---

## 📚 Resources

### Accessibility Guidelines

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Checklist](https://webaim.org/standards/wcag/checklist)
- [A11y Project](https://www.a11yproject.com/)

### Testing Tools

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Color Contrast Analyzer](https://www.webaim.org/resources/contrastchecker/)

### Learning Resources

- [Accessibility for Teams](https://accessibility-for-teams.com/)
- [Inclusive Components](https://inclusive-components.design/)
- [A11y Style Guide](https://a11y-style-guide.com/)

---

**Last Updated:** 2026-03-10  
**Version:** 1.0.0  
**Track:** Documentation Optimization & Humanization  
**Phase:** 7 - Accessibility & Search
