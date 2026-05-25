## Project: Desai Plastic Surgery — Astro 4 Static Site

### Stack
- **Framework**: Astro 4.16 (static output, no SSR)
- **Styling**: Vanilla CSS with scoped `<style>` blocks per component
- **Interactivity**: Vanilla JS `<script>` tags only — no UI framework (React/Vue/Svelte), no client directives
- **Data**: TypeScript files in `src/data/` — flat arrays with typed exports
- **Config**: `src/consts.ts` exports a single `SITE` object used across components

### File Conventions
| Category | Convention | Example |
|---|---|---|
| Components | PascalCase `.astro` | `CTASection.astro` |
| Pages | kebab-case `.astro` | `breast-augmentation.astro` |
| Layouts | PascalCase `.astro` | `BaseLayout.astro` |
| Data | kebab-case `.ts` | `procedures.ts` |
| CSS classes | kebab-case BEM-ish | `.service-card`, `.p-card-top` |
| CSS tokens | `--kebab-case` | `--aubergine-deep` |
| Slugs | kebab-case strings | `'revision-rhinoplasty'` |

### Design Tokens (Plum Atelier Palette)
Always use CSS custom properties from `src/styles/global.css`:

**Prefer semantic tokens** over raw palette tokens:
- Backgrounds: `--bg`, `--bg-warm`, `--bg-deep`
- Text: `--ink`, `--ink-soft`, `--text-dark`, `--text-light`, `--muted-dark`
- Accent: `--accent`, `--accent-deep`, `--accent-soft`
- Borders: `--border-light`, `--border-dark`

**Legacy aliases** (`--champagne`, `--obsidian`, `--ivory`, `--charcoal`, `--blush`, `--gold`) exist for backward compat. **Use canonical tokens** for new code.

**Typography**: `var(--font-display)` for headings/buttons, `var(--font-body)` for body text.
**Spacing**: `var(--container)` for max-width, `var(--gutter)` for padding, `var(--section-y)` for vertical section spacing.
**Motion**: `var(--ease)` for all transitions.

### Component Patterns
- **Section structure**: `<section class="[name] section"> → .container → .eyebrow + h2 + .lead → content grid`
- **Buttons**: `.btn` + `.btn-primary` / `.btn-outline` / `.btn-ghost`, pill-shaped (999px radius), uppercase Manrope
- **Reveal animation**: Add `.reveal` class; `IntersectionObserver` in BaseLayout handles the rest
- **Dark sections**: Use `.dark-section` class; buttons and eyebrows auto-invert
- **Cards**: Flex-column, hover inverts to dark bg, "Learn More →" at bottom

### Data Patterns
- `procedures.ts`: `Procedure` type with `slug`, `title`, `category`, `blurb`, `duration?`, `recovery?`
- Categories: `'Face' | 'Nose' | 'Breast' | 'Body' | 'Non-Surgical'`
- Procedure pages are thin wrappers around `ProcedureLayout`
- `testimonials.ts`: Array of `{ quote, author }`

### Rules
1. **No client frameworks** — use vanilla `<script>` for interactivity
2. **No new dependencies** without discussion
3. **All pages** must use `BaseLayout` (or a layout that wraps it)
4. **All colors/fonts/spacing** must use design tokens — no hardcoded hex values
5. **Responsive**: mobile-first, breakpoints at `560px` and `900px`
6. **Images**: always include `width`, `height`, `loading="lazy"`, descriptive `alt`
