// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Project site lives at https://fireball1725.github.io/librarium/
  // when the repo name is `librarium`. Change `base` (and delete it entirely)
  // once a custom `.app` domain is wired up.
  site: 'https://fireball1725.github.io',
  base: '/librarium',
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()],
  },
});
