const express = require('express');
const site = require('../config/site');
const { publicPaths } = require('./pages');

const router = express.Router();
const BUILD_DATE = new Date().toISOString().slice(0, 10);

router.get('/robots.txt', (req, res) => {
  // Keep preview deployments (e.g. *.vercel.app) out of search results.
  const host = (req.headers.host || '').toLowerCase();
  const isPreview = host.endsWith('.vercel.app') || process.env.VERCEL_ENV === 'preview';
  res.type('text/plain').set('Cache-Control', 'public, max-age=3600');
  if (isPreview) return res.send('User-agent: *\nDisallow: /\n');
  res.send(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site.url}/sitemap.xml\n`);
});

router.get('/sitemap.xml', (req, res) => {
  const priority = (p) => (p === '/' ? '1.0' : p.startsWith('/services/') ? '0.8' : p === '/privacy' ? '0.3' : '0.7');
  const urls = publicPaths()
    .map((p) => `  <url>\n    <loc>${site.url}${p === '/' ? '/' : p}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n    <priority>${priority(p)}</priority>\n  </url>`)
    .join('\n');
  res.type('application/xml').set('Cache-Control', 'public, max-age=3600');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
});

router.get('/site.webmanifest', (req, res) => {
  res.type('application/manifest+json').set('Cache-Control', 'public, max-age=86400');
  res.send(JSON.stringify({
    name: site.name,
    short_name: site.shortName,
    start_url: '/',
    display: 'standalone',
    background_color: '#070B17',
    theme_color: '#070B17',
    icons: [
      { src: '/favicon/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/favicon/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  }));
});

module.exports = router;
