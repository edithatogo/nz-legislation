# Docusaurus Configuration for NZ Legislation Tool

**Ready-to-use configuration for documentation site**

---

## docusaurus.config.js

```javascript
// @ts-check
// `@type` JSDoc annotations allow type checking
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
          routeBasePath: '/', // Serve docs at root
        },
        blog: false, // Disable blog for documentation-only site
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
            type: 'doc',
            docId: 'documentation-site-setup',
            position: 'left',
            label: 'Setup Guide',
          },
          {
            href: 'https://github.com/edithatogo/nz-legislation-tool',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'User Docs',
            items: [
              {
                label: 'Quick Start',
                to: '/docs/user-guide',
              },
              {
                label: 'FAQ',
                to: '/docs/user-guide/faq',
              },
              {
                label: 'Troubleshooting',
                to: '/docs/user-guide/troubleshooting',
              },
              {
                label: 'Glossary',
                to: '/docs/user-guide/glossary',
              },
            ],
          },
          {
            title: 'Developer Docs',
            items: [
              {
                label: 'Architecture',
                to: '/docs/developer-guide/architecture',
              },
              {
                label: 'API Reference',
                to: '/docs/developer-guide/api-reference',
              },
              {
                label: 'Error Reference',
                to: '/docs/developer-guide/error-reference',
              },
              {
                label: 'Contributing',
                to: '/docs/developer-guide/contributing',
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
              {
                label: 'GitHub Issues',
                href: 'https://github.com/edithatogo/nz-legislation-tool/issues',
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
              {
                label: 'NZ Legislation API',
                href: 'https://api.legislation.govt.nz/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} NZ Legislation Tool. Built with Docusaurus.`,
      },
      prism: {
        theme: require('prism-react-renderer/themes/github'),
        darkTheme: require('prism-react-renderer/themes/dracula'),
        additionalLanguages: ['bash', 'typescript', 'r', 'python'],
      },
      // Algolia search (free for open source)
      // Apply at: https://docsearch.algolia.com/apply/
      algolia: {
        // After approval, replace with your credentials
        appId: 'YOUR_APP_ID',
        apiKey: 'YOUR_API_KEY',
        indexName: 'nz-legislation-tool',
        contextualSearch: true,
        
        // Optional: Algolia search parameters
        searchParameters: {},
        
        // Optional: path for search page
        searchPagePath: 'search',
      },
      // Color mode configuration
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      // Table of contents configuration
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 5,
      },
    }),
  
  // Plugins
  plugins: [
    // Optional: Add local search if Algolia not available
    // 'docusaurus-lunr-search',
    
    // Optional: Add Google Analytics
    // [
    //   '@docusaurus/plugin-google-analytics',
    //   {
    //     trackingID: 'UA-XXXXXXXXX-X',
    //     anonymizeIP: true,
    //   },
    // ],
  ],
  
  // Themes
  themes: [
    // Optional: Add Mermaid diagram support
    // '@docusaurus/theme-mermaid',
  ],
  
  // Markdown configuration
  markdown: {
    mermaid: true,
  },
};

module.exports = config;
```

---

## sidebars.js

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
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'user-guide/faq',
          label: 'FAQ',
        },
        {
          type: 'doc',
          id: 'user-guide/glossary',
          label: 'Glossary',
        },
        {
          type: 'doc',
          id: 'user-guide/research-workflow',
          label: 'Research Workflow',
        },
        {
          type: 'doc',
          id: 'user-guide/troubleshooting',
          label: 'Troubleshooting',
        },
        {
          type: 'doc',
          id: 'user-guide/accessibility-search',
          label: 'Accessibility & Search',
        },
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
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'developer-guide/architecture',
          label: 'Architecture',
        },
        {
          type: 'doc',
          id: 'developer-guide/visual-diagrams',
          label: 'Visual Diagrams',
        },
        {
          type: 'doc',
          id: 'developer-guide/api-reference',
          label: 'API Reference',
        },
        {
          type: 'doc',
          id: 'developer-guide/error-reference',
          label: 'Error Reference',
        },
        {
          type: 'category',
          label: 'Contributing',
          items: [
            {
              type: 'doc',
              id: 'developer-guide/contributing',
              label: 'Contributing Guide',
            },
            {
              type: 'doc',
              id: 'developer-guide/testing',
              label: 'Testing Guide',
            },
          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;
```

---

## package.json (docs-site)

```json
{
  "name": "nz-legislation-tool-docs",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "docusaurus": "docusaurus",
    "start": "docusaurus start",
    "build": "docusaurus build",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy",
    "clear": "docusaurus clear",
    "serve": "docusaurus serve",
    "write-translations": "docusaurus write-translations",
    "write-heading-ids": "docusaurus write-heading-ids"
  },
  "dependencies": {
    "@docusaurus/core": "3.0.0",
    "@docusaurus/preset-classic": "3.0.0",
    "@docusaurus/theme-mermaid": "3.0.0",
    "@mdx-js/react": "^3.0.0",
    "clsx": "^2.0.0",
    "docusaurus-lunr-search": "^3.3.0",
    "prism-react-renderer": "^2.3.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@docusaurus/module-type-aliases": "3.0.0",
    "@docusaurus/types": "3.0.0"
  },
  "browserslist": {
    "production": [
      ">0.5%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "engines": {
    "node": ">=18.0"
  }
}
```

---

## .github/workflows/deploy-docs.yml

```yaml
name: Deploy Documentation to GitHub Pages

on:
  push:
    branches:
      - main
    paths:
      - 'docs/**'
      - 'docs-site/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: docs-site
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: docs-site/package-lock.json
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build website
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: docs-site/build

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

---

## netlify.toml (for Netlify deployment)

```toml
[build]
  base = "docs-site"
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

# Cache static assets
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## vercel.json (for Vercel deployment)

```json
{
  "outputDirectory": "docs-site/build",
  "installCommand": "cd docs-site && npm install",
  "buildCommand": "cd docs-site && npm run build",
  "devCommand": "cd docs-site && npm run start",
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "status": 200,
      "dest": "/index.html"
    }
  ]
}
```

---

## src/css/custom.css

```css
/**
 * Any CSS included here will be global.
 */

:root {
  /* Primary colors - NZ inspired */
  --ifm-color-primary: #00247d; /* NZ blue */
  --ifm-color-primary-dark: #00206e;
  --ifm-color-primary-darker: #001d63;
  --ifm-color-primary-darkest: #001852;
  --ifm-color-primary-light: #00288c;
  --ifm-color-primary-lighter: #002b97;
  --ifm-color-primary-lightest: #0033b3;
  
  /* Secondary colors - Fern green */
  --ifm-color-secondary: #008951;
  
  --ifm-code-font-size: 95%;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.1);
  
  /* Spacing */
  --ifm-spacing-horizontal: 1rem;
  
  /* Typography */
  --ifm-font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --ifm-font-family-monospace: 'Fira Code', 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace;
}

/* For readability concerns, you should choose a lighter one in dark mode. */
[data-theme='dark'] {
  --ifm-color-primary: #4d88ff;
  --ifm-color-primary-dark: #447ae6;
  --ifm-color-primary-darker: #4072d9;
  --ifm-color-primary-darkest: #355fb3;
  --ifm-color-primary-light: #5696ff;
  --ifm-color-primary-lighter: #5f9fff;
  --ifm-color-primary-lightest: #80b3ff;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.3);
}

/* Custom hero section */
.hero {
  background: linear-gradient(135deg, #00247d 0%, #008951 100%);
  color: white;
  padding: 4rem 2rem;
}

.hero__title {
  font-size: 3rem;
  font-weight: 800;
}

.hero__subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
}

/* Feature cards */
.feature-card {
  border-radius: 8px;
  padding: 24px;
  margin: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

/* Code blocks */
code {
  border-radius: 4px;
  padding: 0.2em 0.4em;
}

pre code {
  padding: 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Tables */
table {
  border-radius: 8px;
  overflow: hidden;
}

/* Navigation */
.navbar {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Sidebar */
.menu {
  padding: 0.5rem 0;
}

/* Search bar */
.DocSearch {
  --docsearch-primary-color: var(--ifm-color-primary);
  --docsearch-searchbox-background: var(--ifm-background-color);
  --docsearch-searchbox-focus-background: var(--ifm-background-color);
}

/* Footer */
.footer {
  padding: 2rem 0;
  background-color: var(--ifm-footer-background-color);
}

/* Accessibility improvements */
a:focus-visible {
  outline: 2px solid var(--ifm-color-primary);
  outline-offset: 2px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .hero__title {
    font-size: 2rem;
  }
  
  .hero__subtitle {
    font-size: 1.2rem;
  }
  
  .feature-card {
    margin: 8px;
  }
}

/* Print styles */
@media print {
  .navbar,
  .footer,
  .menu,
  .theme-edit-this-page {
    display: none !important;
  }
  
  main {
    padding: 0 !important;
  }
}
```

---

## Usage Instructions

### 1. Create docs-site Directory

```bash
# Create Docusaurus project
npx create-docusaurus@latest docs-site classic

# Replace configuration files
cp docusaurus.config.js docs-site/
cp sidebars.js docs-site/
cp package.json docs-site/
cp -r src/ docs-site/
cp .github/workflows/deploy-docs.yml .github/workflows/
```

### 2. Install Dependencies

```bash
cd docs-site
npm install
```

### 3. Copy Documentation

```bash
# Copy all existing documentation
cp -r ../docs/* docs/
```

### 4. Start Development Server

```bash
npm run start
```

### 5. Build for Production

```bash
npm run build
```

### 6. Deploy

**GitHub Pages:**
```bash
npm run deploy
```

**Netlify:**
- Connect GitHub repository
- Configure build settings
- Auto-deploy on push

**Vercel:**
- Import project
- Auto-detect Docusaurus
- Deploy

---

**Last Updated:** 2026-03-10  
**Version:** 1.0.0  
**Track:** Documentation Optimization & Humanization  
**Phase:** 8 - Documentation Site
