// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://librarium.press',
  trailingSlash: 'ignore',
  integrations: [
    // Generates /sitemap-index.xml and /sitemap-0.xml at build time. Lists
    // every Astro page (currently just /) with a sane priority and lastmod
    // so search engines pick up new content quickly.
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
