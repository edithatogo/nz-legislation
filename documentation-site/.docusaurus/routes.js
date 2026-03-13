import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/nz-legislation/',
    component: ComponentCreator('/nz-legislation/', '9f2'),
    routes: [
      {
        path: '/nz-legislation/',
        component: ComponentCreator('/nz-legislation/', '6f9'),
        routes: [
          {
            path: '/nz-legislation/',
            component: ComponentCreator('/nz-legislation/', '267'),
            routes: [
              {
                path: '/nz-legislation/configuration',
                component: ComponentCreator('/nz-legislation/configuration', '914'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/nz-legislation/installation',
                component: ComponentCreator('/nz-legislation/installation', '3ee'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/nz-legislation/quick-start',
                component: ComponentCreator('/nz-legislation/quick-start', '6cc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/nz-legislation/user-guide',
                component: ComponentCreator('/nz-legislation/user-guide', 'e48'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/nz-legislation/user-guide/citations',
                component: ComponentCreator('/nz-legislation/user-guide/citations', 'c6b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/nz-legislation/user-guide/exporting',
                component: ComponentCreator('/nz-legislation/user-guide/exporting', '714'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/nz-legislation/user-guide/research-workflow',
                component: ComponentCreator('/nz-legislation/user-guide/research-workflow', '247'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/nz-legislation/user-guide/searching',
                component: ComponentCreator('/nz-legislation/user-guide/searching', '421'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/nz-legislation/',
                component: ComponentCreator('/nz-legislation/', '10c'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
