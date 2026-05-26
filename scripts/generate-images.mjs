#!/usr/bin/env node
// Generates in-brand abstract editorial imagery (gallery pairs + procedure
// category heroes + an about-page secondary image) using sharp. Each image
// is a layered gradient composition with subtle grain. Output: AVIF + JPG.
//
// To re-run:  node scripts/generate-images.mjs

import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT_GALLERY = join(ROOT, 'public/assets/gallery');
const OUT_PROC    = join(ROOT, 'public/assets/procedures');
const OUT_MISC    = join(ROOT, 'public/assets/misc');
for (const d of [OUT_GALLERY, OUT_PROC, OUT_MISC]) mkdirSync(d, { recursive: true });

// ── Palette ──────────────────────────────────────────────────
const ink       = '#1d0e25';
const inkDeep   = '#100617';
const auber     = '#2a1432';
const auberMid  = '#3a1f3d';
const auberLite = '#4a2d50';
const mauve     = '#6e4f7a';
const mauveLite = '#9c75a3';
const rose      = '#e8b1c3';
const roseSoft  = '#f1c8d3';
const roseDeep  = '#c47a92';
const gold      = '#d6a98b';
const goldLite  = '#e8c79f';

const noise = (seed = 1, opacity = 0.06) => `
  <filter id="n${seed}">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${seed}"/>
    <feColorMatrix values="0 0 0 0 1   0 0 0 0 0.9   0 0 0 0 0.95   0 0 0 ${opacity} 0"/>
  </filter>`;

// Composition templates — each takes a seed and returns an SVG string
const compositions = {
  // "Aurora" — radial blobs that bloom from one corner
  aurora: (seed, w, h, c1, c2, c3) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <defs>
        ${noise(seed, 0.06)}
        <radialGradient id="bg${seed}" cx="0.18" cy="0.22" r="0.95">
          <stop offset="0" stop-color="${c2}"/>
          <stop offset="0.55" stop-color="${c1}"/>
          <stop offset="1" stop-color="${inkDeep}"/>
        </radialGradient>
        <radialGradient id="halo${seed}" cx="0.82" cy="0.78" r="0.5">
          <stop offset="0" stop-color="${c3}" stop-opacity="0.5"/>
          <stop offset="1" stop-color="${c3}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#bg${seed})"/>
      <rect width="${w}" height="${h}" fill="url(#halo${seed})"/>
      <rect width="${w}" height="${h}" filter="url(#n${seed})"/>
    </svg>`,

  // "Veil" — soft vertical column of light on a dark field
  veil: (seed, w, h, c1, c2, c3) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <defs>
        ${noise(seed, 0.07)}
        <linearGradient id="bg${seed}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${ink}"/>
          <stop offset="0.6" stop-color="${c1}"/>
          <stop offset="1" stop-color="${inkDeep}"/>
        </linearGradient>
        <radialGradient id="col${seed}" cx="0.5" cy="0.55" r="0.45">
          <stop offset="0" stop-color="${c2}" stop-opacity="0.7"/>
          <stop offset="0.7" stop-color="${c3}" stop-opacity="0.18"/>
          <stop offset="1" stop-color="${c1}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#bg${seed})"/>
      <ellipse cx="${w*0.5}" cy="${h*0.55}" rx="${w*0.32}" ry="${h*0.6}" fill="url(#col${seed})"/>
      <rect width="${w}" height="${h}" filter="url(#n${seed})"/>
    </svg>`,

  // "Silk" — sweeping diagonal gradient with a thin gold horizon line
  silk: (seed, w, h, c1, c2, c3) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <defs>
        ${noise(seed, 0.07)}
        <linearGradient id="bg${seed}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${c1}"/>
          <stop offset="0.5" stop-color="${c2}"/>
          <stop offset="1" stop-color="${ink}"/>
        </linearGradient>
        <linearGradient id="horizon${seed}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="${gold}" stop-opacity="0"/>
          <stop offset="0.5" stop-color="${gold}" stop-opacity="0.55"/>
          <stop offset="1" stop-color="${gold}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#bg${seed})"/>
      <rect x="0" y="${h*0.58}" width="${w}" height="1.5" fill="url(#horizon${seed})"/>
      <circle cx="${w*0.7}" cy="${h*0.35}" r="${w*0.18}" fill="${c3}" opacity="0.18"/>
      <rect width="${w}" height="${h}" filter="url(#n${seed})"/>
    </svg>`,

  // "Marble" — abstract organic blobs (face-procedure friendly)
  marble: (seed, w, h, c1, c2, c3) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <defs>
        ${noise(seed, 0.08)}
        <linearGradient id="bg${seed}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${c1}"/>
          <stop offset="1" stop-color="${ink}"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#bg${seed})"/>
      <ellipse cx="${w*0.35}" cy="${h*0.42}" rx="${w*0.4}" ry="${h*0.35}" fill="${c2}" opacity="0.42"/>
      <ellipse cx="${w*0.68}" cy="${h*0.68}" rx="${w*0.28}" ry="${h*0.26}" fill="${c3}" opacity="0.32"/>
      <ellipse cx="${w*0.18}" cy="${h*0.82}" rx="${w*0.22}" ry="${h*0.18}" fill="${c2}" opacity="0.25"/>
      <rect width="${w}" height="${h}" filter="url(#n${seed})"/>
    </svg>`,

  // "Halo" — bright glow centered on a deep field (after-shot feel)
  halo: (seed, w, h, c1, c2, c3) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <defs>
        ${noise(seed, 0.05)}
        <radialGradient id="g${seed}" cx="0.5" cy="0.45" r="0.65">
          <stop offset="0" stop-color="${c3}" stop-opacity="0.9"/>
          <stop offset="0.45" stop-color="${c2}" stop-opacity="0.55"/>
          <stop offset="1" stop-color="${c1}" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="${ink}"/>
      <rect width="${w}" height="${h}" fill="url(#g${seed})"/>
      <rect width="${w}" height="${h}" filter="url(#n${seed})"/>
    </svg>`,
};

// Per-category color stops (c1, c2, c3) — c3 is the "warm" accent
const palettes = {
  Nose:   [auber,    mauve,     gold],
  Face:   [auberMid, mauveLite, roseSoft],
  Breast: [auberLite, roseDeep, rose],
  Body:   [auber,    mauveLite, goldLite],
  All:    [auber,    mauve,     rose],
};

// ── Render helpers ────────────────────────────────────────────
const render = async (svg, outBase) => {
  const buf = Buffer.from(svg);
  await Promise.all([
    sharp(buf).avif({ quality: 60, effort: 4 }).toFile(`${outBase}.avif`),
    sharp(buf).jpeg({ quality: 84, progressive: true }).toFile(`${outBase}.jpg`),
  ]);
};

// ── Gallery (12 pairs of before/after) ───────────────────────
const gallery = [
  { cat: 'Nose', slug: 'rhinoplasty-primary' },
  { cat: 'Nose', slug: 'rhinoplasty-revision' },
  { cat: 'Face', slug: 'facelift-necklift' },
  { cat: 'Face', slug: 'blepharoplasty' },
  { cat: 'Breast', slug: 'augmentation' },
  { cat: 'Breast', slug: 'mastopexy-aug' },
  { cat: 'Body', slug: 'tummy-tuck-lipo' },
  { cat: 'Body', slug: 'mommy-makeover' },
  { cat: 'Face', slug: 'stem-cell' },
  { cat: 'Body', slug: 'bbl' },
  { cat: 'Nose', slug: 'ethnic-rhinoplasty' },
  { cat: 'Breast', slug: 'reduction' },
];

const compName = ['marble', 'veil', 'silk', 'aurora', 'halo'];
const W = 1200, H = 900;

console.log('Rendering gallery pairs…');
for (let i = 0; i < gallery.length; i++) {
  const { cat, slug } = gallery[i];
  const [c1, c2, c3] = palettes[cat];
  // Before = darker template; After = halo/silk (warmer, brighter)
  const beforeSvg = compositions[compName[i % compName.length]](i * 11 + 1, W, H, ink, c1, c2);
  const afterSvg  = compositions.halo(i * 11 + 2, W, H, c1, c2, c3);
  await render(beforeSvg, join(OUT_GALLERY, `${slug}-before`));
  await render(afterSvg,  join(OUT_GALLERY, `${slug}-after`));
  process.stdout.write('.');
}
console.log('\nGallery done.');

// ── Procedure category heroes ────────────────────────────────
console.log('Rendering procedure category heroes…');
for (const cat of ['Face', 'Nose', 'Breast', 'Body', 'Non-Surgical']) {
  const pal = palettes[cat] || palettes.All;
  const svg = compositions.silk(cat.length * 17, 2000, 900, pal[0], pal[1], pal[2]);
  await render(svg, join(OUT_PROC, `hero-${cat.toLowerCase().replace(/\s/g, '-').replace('non-surgical', 'nonsurgical')}`));
  process.stdout.write('.');
}
console.log('\nProcedure heroes done.');

// ── Misc (about page secondary, CTA backdrop) ────────────────
console.log('Rendering misc imagery…');
await render(compositions.aurora(101, 1600, 1200, auber, mauve, rose),    join(OUT_MISC, 'about-secondary'));
await render(compositions.veil(202, 2400, 800, auber, auberMid, roseSoft), join(OUT_MISC, 'cta-backdrop'));
console.log('Misc done.');
