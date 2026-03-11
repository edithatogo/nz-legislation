// @ts-check
// Docusaurus configuration for NZ Legislation Tool Documentation

import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'NZ Legislation Tool',
  tagline: 'Research-grade tool for analyzing New Zealand healthcare legislation',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://edithatogo.github.io',
  baseUrl: '/nz-legislation/',

  // GitHub Pages deployment
  organizationName: 'edithatogo',
  projectName: 'nz-legislation',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/edithatogo/nz-legislation/tree/main/nz-legislation-tool/',
          routeBasePath: '/',
          // Versioning configuration
          versions: {
            current: {
              label: 'Development 🔧',
            },
            '1.0': {
              label: 'v1.0 (Stable)',
            },
          },
        },
        blog: false,
        // Google Analytics configuration
        // To enable: Create account at analytics.google.com, get your Measurement ID (G-XXXXXXXXXX)
        // Then add to .env: GA_TRACKING_ID=G-XXXXXXXXXX
        // googleAnalytics: {
        //   trackingID: process.env.GA_TRACKING_ID || 'G-XXXXXXXXXX',
        //   anonymizeIP: true,
        // },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'NZ Legislation Tool',
      logo: {
        alt: 'NZ Legislation Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClass: 'dropdown-active',
        },
        {
          href: 'https://github.com/edithatogo/nz-legislation',
          label: 'GitHub',
          position: 'right',
        },
        // DocSearch search bar (enabled after approval)
        {
          type: 'search',
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
              label: 'Quick Start',
              to: '/docs/quick-start',
            },
            {
              label: 'User Guide',
              to: '/docs/user-guide',
            },
            {
              label: 'API Reference',
              to: '/docs/api-reference',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Issues',
              href: 'https://github.com/edithatogo/nz-legislation/issues',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/edithatogo/nz-legislation',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} NZ Legislation Tool. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
    // Algolia DocSearch configuration
    // Apply at https://docsearch.algolia.com/ for free open source search
    algolia: {
      // DocSearch credentials (apply at https://docsearch.algolia.com/)
      appId: process.env.ALGOLIA_APP_ID || 'temp_app_id',
      apiKey: process.env.ALGOLIA_API_KEY || 'temp_api_key',
      indexName: 'nz-legislation',
      contextualSearch: true,
      
      // Optional: Algolia insights
      insights: false,
      
      // Optional: Replace with a function to determine if search results should be displayed
      // transformItems(items) {
      //   return items.map(item => {
      //     return {
      //       ...item,
      //       url: item.url.replace('https://edithatogo.github.io', 'https://edithatogo.github.io/nz-legislation'),
      //     };
      //   });
      // },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
