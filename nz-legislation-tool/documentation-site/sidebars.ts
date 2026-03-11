import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['index', 'quick-start', 'installation', 'configuration'],
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
  ],
};

export default sidebars;
