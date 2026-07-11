import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://edithatogo.github.io',
  base: '/cli-legislation-nz/',
  integrations: [
    starlight({
      title: 'NZ Legislation CLI',
      description: 'Legal NZ documentation portal for NZ Legislation CLI.',
      sidebar: [
        { label: 'Start', items: ['index', 'docs-tooling-audit'] },
      ],
    }),
    mdx(),
    sitemap(),
  ],
});
