import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://www.desaiplasticsurgery.com',
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [
    icon({
      // Only ship the lucide icons we actually use
      include: {
        lucide: [
          'search', 'x', 'phone', 'sun', 'moon', 'chevron-down',
          'arrow-right', 'arrow-up', 'menu',
          'instagram', 'facebook', 'youtube', 'linkedin', 'mail',
        ],
      },
    }),
    compress({
      CSS: true,
      HTML: { 'html-minifier-terser': { removeComments: true, collapseWhitespace: true, minifyCSS: true, minifyJS: true } },
      Image: false,
      JavaScript: true,
      SVG: true,
    }),
  ],
});
