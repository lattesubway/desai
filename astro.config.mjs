import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.desaiplasticsurgery.com',
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: true,
});
