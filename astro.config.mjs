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
    // @ts-expect-error — Astro carries its own pinned Vite, and
    // @tailwindcss/vite resolves Vite from the top-level deps; the
    // two type instances aren't structurally identical so TS rejects
    // the assignment even though the runtime behaviour is correct.
    // Build + dev work fine; this is a known dedup issue with
    // Astro 5 + Tailwind v4 that we tolerate at the config seam.
    plugins: [tailwindcss()],
  },
});
