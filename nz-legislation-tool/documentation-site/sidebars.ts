import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['index', 'quick-start', 'installation', 'configuration', 'deployment-guide'],
    },
    {
      type: 'category',
      label: 'User Guide',
      items: [
        'user-guide/index',
        'user-guide/searching',
        'user-guide/exporting',
        'user-guide/citations',
        'user-guide/research-workflow',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-reference/index',
        'api-reference/client',
        'api-reference/models',
        'api-reference/errors',
      ],
    },
    {
      type: 'category',
      label: 'Developer Guide',
      items: [
        'developer-guide/index',
        'developer-guide/architecture',
        'developer-guide/testing',
        'developer-guide/contributing',
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: [
        'troubleshooting/index',
        'troubleshooting/common-issues',
        'troubleshooting/error-reference',
        'troubleshooting/faq',
      ],
    },
  ],
};

export default sidebars;
