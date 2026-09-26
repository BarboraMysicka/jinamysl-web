import { getCollection } from 'astro:content';

// Sitemap se generuje při buildu a sám zahrne i nově přidané projekty.
export async function GET() {
  const site = 'https://jinamysl.cz';
  const projekty = await getCollection('projekty');
  const cesty = [
    '/',
    '/o-nas/',
    '/lide-a-kontakty/',
    ...projekty.map((p) => `/projekty/${p.id}/`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cesty.map((c) => `  <url><loc>${site}${c}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
