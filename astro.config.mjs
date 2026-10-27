import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://croydontouristboard.co.uk',
  integrations: [sitemap()],
  vite: {
    build: {
      modulePreload: { polyfill: false },
    },
  },
});
