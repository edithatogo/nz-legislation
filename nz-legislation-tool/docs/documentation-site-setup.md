# Documentation Site Setup Guide

**How to set up and deploy the NZ Legislation Tool documentation website**

---

## Overview

This guide walks you through setting up a professional documentation website for the NZ Legislation Tool using Docusaurus v2, a modern static site generator optimized for documentation.

**Why Docusaurus?**
- ✅ Built for documentation
- ✅ Markdown support
- ✅ Full-text search
- ✅ Versioning support
- ✅ Dark mode
- ✅ Mobile-responsive
- ✅ SEO optimized
- ✅ Easy deployment

**Last Updated:** 2026-03-10  
**Version:** 1.0.0

---

## Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
npm run docs:setup

# Start development server
npm run docs:start
```

### Option 2: Manual Setup

```bash
# Create Docusaurus project
npx create-docusaurus@latest docs-site classic

# Install dependencies
cd docs-site
npm install

# Copy existing documentation
cp -r ../docs/* docs/

# Start development server
npm run start
```

---

## Platform Selection

### Recommended: Docusaurus v2

**Pros:**
- Built by Meta (Facebook)
- Excellent documentation features
- Built-in search (Algolia)
- Versioning support
- Dark mode out-of-the-box
- Easy deployment to GitHub Pages, Netlify, Vercel
- Active community

**Cons:**
- React-based (learning curve if unfamiliar)
- Build time for large sites

**Website:** https://docusaurus.io/

### Alternative: VitePress

**Pros:**
- Faster build times
- Vue-based
- Simpler configuration
- Great for smaller sites

**Cons:**
- Fewer features than Docusaurus
- Less mature ecosystem

**Website:** https://vitepress.dev/

### Decision

**We recommend Docusaurus** because:
1. Better suited for large documentation sets
2. More features (versioning, search, i18n)
3. Better for technical documentation
4. Easier deployment options

---

## Project Structure

### Directory Layout

```
nz-legislation-tool/
├── docs-site/                 # Docusaurus site
│   ├── docs/                  # Documentation files
│   │   ├── user-guide/        # User documentation
│   │   ├── developer-guide/   # Developer documentation
│   │   └── ...                # All existing docs
│   ├── src/
│   │   ├── components/        # Custom React components
│   │   ├── css/               # Custom CSS
│   │   └── pages/             # Custom pages
│   ├── static/
│   │   ├── img/               # Static images
│   │   └── favicon.ico        # Site favicon
│   ├── docusaurus.config.js   # Site configuration
│   ├── package.json           # Dependencies
│   └── sidebars.js            # Navigation sidebar
│
├── docs/                      # Source documentation
│   ├── user-guide/
│   ├── developer-guide/
│   └── ...
│
└── package.json               # Root package.json
```

---

## Step-by-Step Setup

### Step 1: Create Docusaurus Project

```bash
# Navigate to project root
cd nz-legislation-tool

# Create Docusaurus site
npx create-docusaurus@latest docs-site classic

# Choose:
# - Classic template
# - TypeScript (optional)
# - Install dependencies: Yes
```

### Step 2: Configure Site

Edit `docs-site/docusaurus.config.js`:

```javascript
// @ts-check
// Note: type annotation allows type checking
const { themes } = require('lightningcss');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'NZ Legislation Tool',
  tagline: 'Search and retrieve New Zealand legislation data',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://edithatogo.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/nz-legislation-tool/',

  // GitHub pages deployment
  organizationName: 'edithatogo',
  projectName: 'nz-legislation-tool',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you must use this option
  // It passes the i18n object to the theme
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to be your repository's URL
          editUrl:
            'https://github.com/edithatogo/nz-legislation-tool/tree/main/docs-site/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to be your repository's URL
          editUrl:
            'https://github.com/edithatogo/nz-legislation-tool/tree/main/docs-site/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'NZ Legislation Tool',
        logo: {
          alt: 'NZ Legislation Tool Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'userGuideSidebar',
            position: 'left',
            label: 'User Guide',
          },
          {
            type: 'docSidebar',
            sidebarId: 'developerGuideSidebar',
            position: 'left',
            label: 'Developer Guide',
          },
          {
            href: 'https://github.com/edithatogo/nz-legislation-tool',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'User Guide',
                to: '/docs/user-guide',
              },
              {
                label: 'Developer Guide',
                to: '/docs/developer-guide',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/edithatogo/nz-legislation-tool/discussions',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/edithatogo/nz-legislation-tool',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} NZ Legislation Tool. Built with Docusaurus.`,
      },
      prism: {
        theme: require('prism-react-renderer/themes/github'),
        darkTheme: require('prism-react-renderer/themes/dracula'),
      },
      // Algolia search (free for open source)
      algolia: {
        appId: 'YOUR_APP_ID',
        apiKey: 'YOUR_API_KEY',
        indexName: 'nz-legislation-tool',
        contextualSearch: true,
      },
    }),
};

module.exports = config;
```

### Step 3: Configure Sidebars

Edit `docs-site/sidebars.js`:

```javascript
// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  userGuideSidebar: [
    {
      type: 'category',
      label: 'User Guide',
      link: {
        type: 'doc',
        id: 'user-guide/index',
      },
      items: [
        'user-guide/faq',
        'user-guide/glossary',
        'user-guide/research-workflow',
        'user-guide/troubleshooting',
        'user-guide/accessibility-search',
      ],
    },
  ],
  
  developerGuideSidebar: [
    {
      type: 'category',
      label: 'Developer Guide',
      link: {
        type: 'doc',
        id: 'developer-guide/index',
      },
      items: [
        'developer-guide/architecture',
        'developer-guide/visual-diagrams',
        'developer-guide/api-reference',
        'developer-guide/error-reference',
        'developer-guide/contributing',
        'developer-guide/testing',
      ],
    },
  ],
};

module.exports = sidebars;
```

### Step 4: Copy Documentation

```bash
# Copy all existing documentation
cp -r docs/* docs-site/docs/

# Copy images
cp -r docs/images/* docs-site/static/img/ 2>/dev/null || true
```

### Step 5: Add Custom Styling

Create `docs-site/src/css/custom.css`:

```css
/**
 * Any CSS included here will be global.
 */

:root {
  --ifm-color-primary: #2e8555;
  --ifm-color-primary-dark: #29784c;
  --ifm-color-primary-darker: #277148;
  --ifm-color-primary-darkest: #205d3b;
  --ifm-color-primary-light: #33925d;
  --ifm-color-primary-lighter: #359962;
  --ifm-color-primary-lightest: #3cad6e;
  --ifm-code-font-size: 95%;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.1);
}

/* For readability concerns, you should choose a lighter one in dark mode. */
[data-theme='dark'] {
  --ifm-color-primary: #25c2a0;
  --ifm-color-primary-dark: #21af90;
  --ifm-color-primary-darker: #1fa588;
  --ifm-color-primary-darkest: #1a8870;
  --ifm-color-primary-light: #29d5b0;
  --ifm-color-primary-lighter: #32d8b4;
  --ifm-color-primary-lightest: #4fddbf;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.3);
}

/* Custom styles for NZ Legislation Tool */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.feature-card {
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

### Step 6: Add Package Scripts

Add to root `package.json`:

```json
{
  "scripts": {
    "docs:setup": "cd docs-site && npm install",
    "docs:start": "cd docs-site && npm run start",
    "docs:build": "cd docs-site && npm run build",
    "docs:deploy": "cd docs-site && npm run deploy"
  }
}
```

---

## Deployment

### Option 1: GitHub Pages (Recommended)

**Setup:**

1. **Enable GitHub Pages** in repository settings
2. **Configure deployment** in `docusaurus.config.js`:

```javascript
const config = {
  // ... other config
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
};
```

3. **Add deployment script** to `docs-site/package.json`:

```json
{
  "scripts": {
    "deploy": "docusaurus deploy"
  }
}
```

4. **Deploy:**

```bash
# Build and deploy
npm run docs:deploy
```

**URL:** `https://edithatogo.github.io/nz-legislation-tool/`

---

### Option 2: Netlify

**Setup:**

1. **Connect GitHub repository** to Netlify
2. **Configure build settings:**
   - **Build command:** `npm run docs:build`
   - **Publish directory:** `docs-site/build`
   - **Base directory:** `docs-site`

3. **Add netlify.toml:**

```toml
[build]
  base = "docs-site"
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**URL:** `https://nz-legislation-tool.netlify.app/`

---

### Option 3: Vercel

**Setup:**

1. **Connect GitHub repository** to Vercel
2. **Configure project:**
   - **Framework Preset:** Docusaurus
   - **Root Directory:** `docs-site`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

**URL:** `https://nz-legislation-tool.vercel.app/`

---

## Search Configuration

### Algolia DocSearch (Free for Open Source)

**Apply for DocSearch:**
1. Visit: https://docsearch.algolia.com/apply/
2. Fill out application form
3. Wait for approval (1-2 weeks)

**Configure in `docusaurus.config.js`:**

```javascript
themeConfig: {
  algolia: {
    appId: 'YOUR_APP_ID',
    apiKey: 'YOUR_API_KEY',
    indexName: 'nz-legislation-tool',
    contextualSearch: true,
    
    // Optional: Algolia search parameters
    searchParameters: {},
    
    // Optional: path for search page
    searchPagePath: 'search',
  },
}
```

**Alternative: Local Search**

If Algolia is not available, use `docusaurus-lunr-search`:

```bash
npm install --save docusaurus-lunr-search
```

Add to `docusaurus.config.js`:

```javascript
plugins: ['docusaurus-lunr-search'],
```

---

## Customization

### Add Custom Homepage

Create `docs-site/src/pages/index.js`:

```jsx
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/user-guide">
            Get Started (5 min)
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Documentation`}
      description="Search and retrieve New Zealand legislation data">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
```

---

### Add Analytics

**Google Analytics:**

```javascript
// docusaurus.config.js
plugins: [
  [
    '@docusaurus/plugin-google-analytics',
    {
      trackingID: 'UA-XXXXXXXXX-X',
      anonymizeIP: true,
    },
  ],
],
```

**Plausible Analytics (Privacy-friendly):**

```javascript
// docusaurus.config.js
headTags: [
  {
    tagName: 'script',
    attributes: {
      defer: 'true',
      'data-domain': 'nz-legislation-tool.io',
      src: 'https://plausible.io/js/script.js',
    },
  },
],
```

---

## Maintenance

### Update Documentation

1. **Edit markdown files** in `docs/`
2. **Copy to site:** `cp -r docs/* docs-site/docs/`
3. **Build:** `npm run docs:build`
4. **Deploy:** `npm run docs:deploy`

### Add New Version

```bash
# Create new version
cd docs-site
npm run docusaurus docs:version 2.0.0
```

### Check for Broken Links

```bash
# Build with strict link checking
cd docs-site
npm run build -- --fail-on-missing-links
```

---

## Troubleshooting

### Build Fails

**Error:** `Module not found`

**Solution:**
```bash
cd docs-site
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Search Not Working

**Check:**
1. Algolia credentials are correct
2. Site is indexed (takes 24-48 hours)
3. Build completed successfully

### Deployment Fails

**GitHub Pages:**
```bash
# Clear deployment cache
cd docs-site
rm -rf build
npm run deploy
```

---

## Resources

### Documentation
- [Docusaurus Docs](https://docusaurus.io/docs)
- [Docusaurus API](https://docusaurus.io/docs/api)
- [Docusaurus Themes](https://docusaurus.io/docs/styling-layout)

### Community
- [Docusaurus Discord](https://discord.gg/docusaurus)
- [Stack Overflow](https://stackoverflow.com/questions/tagled/docusaurus)
- [GitHub Discussions](https://github.com/facebook/docusaurus/discussions)

### Tools
- [Algolia DocSearch](https://docsearch.algolia.com/)
- [Netlify](https://netlify.com/)
- [Vercel](https://vercel.com/)
- [GitHub Pages](https://pages.github.com/)

---

## Next Steps

1. ✅ **Choose platform** - Docusaurus recommended
2. ✅ **Set up project** - Follow Step-by-Step Setup
3. ✅ **Configure site** - Edit docusaurus.config.js
4. ✅ **Copy documentation** - All existing docs
5. ✅ **Customize theme** - Add branding
6. ✅ **Set up search** - Algolia or local
7. ✅ **Deploy** - GitHub Pages, Netlify, or Vercel
8. ✅ **Add analytics** - Track usage
9. ✅ **Monitor** - Check for broken links

---

**Last Updated:** 2026-03-10  
**Version:** 1.0.0  
**Track:** Documentation Optimization & Humanization  
**Phase:** 8 - Documentation Site
