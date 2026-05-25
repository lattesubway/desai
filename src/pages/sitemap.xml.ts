import type { APIRoute } from 'astro';
import { SITE } from '../consts';
import { procedures } from '../data/procedures';

const staticPaths = [
  '/',
  '/about/',
  '/procedures/',
  '/gallery/',
  '/media/',
  '/reviews/',
  '/contact/',
  '/consultation/',
];

export const GET: APIRoute = () => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...staticPaths.map((p) => ({ loc: p, priority: p === '/' ? '1.0' : '0.8' })),
    ...procedures.map((p) => ({ loc: `/procedures/${p.slug}/`, priority: '0.7' })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, priority }) =>
      `  <url><loc>${SITE.url}${loc}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
