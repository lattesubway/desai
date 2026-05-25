import { defineConfig } from 'astro/config';
import compress from 'astro-compress';

export default defineConfig({
  site: 'https://www.desaiplasticsurgery.com',
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [
    compress({
      CSS: true,
      HTML: { 'html-minifier-terser': { removeComments: true, collapseWhitespace: true, minifyCSS: true, minifyJS: true } },
      Image: false, // Astro's <Image> already handles this
      JavaScript: true,
      SVG: true,
    }),
  ],
});
