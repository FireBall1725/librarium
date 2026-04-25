#!/usr/bin/env node
// Pre-build asset pass that runs against the source logo to produce:
//
//   • public/og.png       — 1200×630 social-share card composed from the
//                           logo, brand background, and tagline
//   • public/logo-192.png — small logo used by browser tabs / PWA / nav
//                           where shipping the 1024×1024 source is wasteful
//
// Idempotent and committed-output: the generated files are checked in, so
// GitHub Pages can serve them without running the script. Re-run this any
// time the source logo or brand copy changes:
//
//     node scripts/build-assets.mjs
//
// Uses `sharp`, which is already in node_modules via Astro's image pipeline
// — no extra dependency.

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const publicDir = resolve(root, 'public');
const sourceLogo = resolve(publicDir, 'logo.png');

// ── 1. logo-192.png ──────────────────────────────────────────────────────
//
// The source logo is 1024×1024 / ~57 KB and is rendered at 32–96 px in the
// nav and hero. Resize once at build time so the page stops shipping a
// 1024-square asset to every visitor.
await sharp(sourceLogo)
  .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile(resolve(publicDir, 'logo-192.png'));

// ── 2. og.png ────────────────────────────────────────────────────────────
//
// Hand-composited social-share card. Brand background + logo on the left,
// stacked title and tagline on the right. SVG keeps the type crisp at any
// downstream resize the platforms apply, then we rasterize once at the
// canonical 1200×630 OG size.
const ogWidth = 1200;
const ogHeight = 630;

const logoBuffer = await sharp(sourceLogo)
  .resize(280, 280, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

const textSVG = Buffer.from(`
<svg width="${ogWidth}" height="${ogHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
    <radialGradient id="glow" cx="20%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  <rect width="100%" height="100%" fill="url(#glow)" />

  <!-- Title -->
  <text x="400" y="240"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
        font-size="76" font-weight="800" fill="#ffffff"
        letter-spacing="-2">Librarium</text>

  <!-- Tagline line 1 -->
  <text x="400" y="320"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
        font-size="34" font-weight="500" fill="#cbd5e1">Self-hosted library tracker</text>

  <!-- Tagline line 2 -->
  <text x="400" y="370"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
        font-size="34" font-weight="500" fill="#cbd5e1">for books, manga &amp; comics</text>

  <!-- Footer chip -->
  <rect x="400" y="430" width="280" height="44" rx="22" fill="#6366f1" fill-opacity="0.15" stroke="#818cf8" stroke-opacity="0.4" stroke-width="1.5" />
  <text x="540" y="460" text-anchor="middle"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
        font-size="20" font-weight="600" fill="#a5b4fc"
        letter-spacing="2">OPEN SOURCE · AGPL 3.0</text>

  <!-- Domain -->
  <text x="400" y="540"
        font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
        font-size="22" font-weight="500" fill="#64748b">librarium.press</text>
</svg>
`);

await sharp(textSVG)
  .composite([
    {
      input: logoBuffer,
      top: 175,
      left: 80,
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile(resolve(publicDir, 'og.png'));

console.log('built: public/logo-192.png');
console.log('built: public/og.png');
