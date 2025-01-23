// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap(), mdx(), react()],
  site: 'https://kemono.dragonjay.top',
  adapter: vercel({
    webAnalytics: {
        enabled: true,
      },
}),
  output: 'server',
});