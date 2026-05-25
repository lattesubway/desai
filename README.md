# Desai Plastic Surgery — Rebuild

A modern, editorial-hybrid static site for Dr. Urmen Desai's Beverly Hills practice. Built with **Astro**.

## Stack

- **Astro 4** — static-site generator (ships near-zero JS)
- **Vanilla CSS** with CSS custom properties (no Tailwind, no preprocessors)
- **@astrojs/sitemap** for automatic sitemap generation
- **Cormorant Garamond + Inter** via Google Fonts

## Features

- 🎨 Editorial Hybrid aesthetic — ivory + obsidian + champagne
- 🏥 18 individual procedure pages, auto-generated from `src/data/procedures.ts`
- 📸 Filterable before/after gallery with lightbox modal
- 📰 Media & press page with all CNN/ABC/NBC/Fox/CBS features
- ⭐ Reviews wall with platform links (Google, RealSelf, Yelp, Healthgrades)
- 📅 Multi-step consultation form with progress bar, validation, and photo upload (modeled after radyrahban.com)
- 📞 Contact page with embedded Google Map and hours
- 🔍 Full SEO: per-page meta, Open Graph, Twitter cards, JSON-LD Physician schema, sitemap, robots.txt
- ♿ Accessible: semantic HTML, keyboard-navigable, `prefers-reduced-motion` support
- 📱 Responsive across mobile, tablet, desktop

## Project Structure

## Local Development

```bash
npm install
npm run dev
```

Then open the URL shown (usually `http://localhost:4321`).

## Build for Production

```bash
npm run build
npm run preview
```

## Customization

### Update site info
Edit `src/consts.ts` — phone, address, doctor name, social links all live here.

### Add or edit procedures
Edit `src/data/procedures.ts`. To add a new procedure:
1. Add an entry to the array.
2. Create a new file `src/pages/procedures/your-slug.astro` containing only:
```astro
   ---
   import ProcedureLayout from '../../layouts/ProcedureLayout.astro';
   import { procedures } from '../../data/procedures';
   const procedure = procedures.find(p => p.slug === 'your-slug')!;
   ---
   <ProcedureLayout procedure={procedure} />
```

### Connect the forms
Both the consultation form and contact form post to a Formspree placeholder. Sign up at https://formspree.io, create a form, and replace `your-form-id` in:
- `src/pages/consultation.astro`
- `src/pages/contact.astro`

Alternatively, swap in your own backend, Netlify Forms, or Mailgun endpoint.

### Add real images
Drop images into `public/assets/`. Then reference them in components as `/assets/your-image.jpg`. Recommended:
- `public/assets/hero.jpg` (2000×1200, dark editorial)
- `public/assets/doctor-portrait.jpg` (1200×1600)
- `public/assets/gallery/*.jpg` (before/after pairs)
- `public/assets/og-default.jpg` (1200×630, for social sharing)

To use a real hero image, replace the `.art-frame` block in `src/components/Hero.astro` with an `<img>` tag.

### Change colors
All design tokens live at the top of `src/styles/global.css` under `:root`. Edit `--champagne`, `--obsidian`, `--ivory`, etc., and the entire site updates.

## Deploy

### Netlify (recommended — free, easiest)
1. Push to GitHub.
2. Connect repo at https://app.netlify.com → "Import from Git".
3. Build command: `npm run build`. Publish directory: `dist`.

### Vercel
1. Push to GitHub.
2. Import at https://vercel.com/new — auto-detects Astro.

### GitHub Pages
1. Add `output: 'static'` to `astro.config.mjs` (already implied).
2. Enable Pages in repo settings, source = GitHub Actions, use Astro's official Pages workflow.

## Models & Disclaimers

Photos referenced as "models" are not actual patients. Update gallery items to real before/after photos once available, and remove the disclaimer if all images are genuine patients (with written consent).

## License

© Desai Plastic Surgery. All rights reserved.
