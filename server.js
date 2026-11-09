/**
 * CoreByte Solutions — corebytex.com
 *
 * One entry file for every host:
 *  - Vercel: detects this Express app and runs it as a single Vercel Function
 *    (the app is exported below). Files in /public are served by Vercel's CDN.
 *  - cPanel / VPS / local: `node server.js` starts an HTTP server and serves /public itself.
 */
require('dotenv').config();

const path = require('path');
const express = require('express');
const compression = require('compression');

const site = require('./config/site');
const services = require('./data/services');
const { nonce, securityHeaders, canonicalHost, trailingSlash } = require('./middleware/security');
const pageRoutes = require('./routes/pages');
const apiRoutes = require('./routes/api');
const seoRoutes = require('./routes/seo');
const seo = require('./lib/seo');

const IS_VERCEL = Boolean(process.env.VERCEL);
const IS_PROD = process.env.NODE_ENV === 'production' || IS_VERCEL;
const VIEWS_DIR = path.join(__dirname, 'views');
const PUBLIC_DIR = path.join(__dirname, 'public');

const app = express();

app.set('view engine', 'ejs');
app.set('views', VIEWS_DIR);
app.set('trust proxy', 1);
app.disable('x-powered-by');
if (IS_PROD) app.set('view cache', true);

// ---------- template helpers ----------
const ASSET_VERSION = (process.env.VERCEL_GIT_COMMIT_SHA || require('./package.json').version).slice(0, 8);
app.locals.site = site;
app.locals.allServices = services;
app.locals.v = ASSET_VERSION;
app.locals.year = new Date().getFullYear();
app.locals.icon = (name, cls = '') =>
  `<svg class="i ${cls}" aria-hidden="true" focusable="false"><use href="/icons/sprite.svg?v=${ASSET_VERSION}#${name}"></use></svg>`;
app.locals.placeholder = (value, label) =>
  value ? value : `<span class="placeholder" title="Add this in config/site.js">[${label} — to be added]</span>`;

// ---------- middleware ----------
app.use(canonicalHost);
app.use(trailingSlash);
app.use(nonce);
app.use(securityHeaders());
if (!IS_VERCEL) app.use(compression()); // Vercel compresses at the edge

// Static files. Ignored on Vercel (its CDN serves /public directly), used everywhere else.
app.use(
  express.static(PUBLIC_DIR, {
    maxAge: IS_PROD ? '7d' : 0,
    setHeaders(res, filePath) {
      if (/\/(favicon|images|icons)\//.test(filePath.replace(/\\/g, '/'))) {
        res.setHeader('Cache-Control', 'public, max-age=2592000');
      }
    }
  })
);

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// ---------- routes ----------
app.use('/', seoRoutes);
app.use('/api', apiRoutes);
app.use('/', pageRoutes);

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).render('pages/404', {
    page: '404',
    meta: seo.meta({ title: 'Page not found', path: req.path, noindex: true })
  });
});

// ---------- errors ----------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[error]', err);
  if (res.headersSent) return;
  res.status(500);
  if (req.path.startsWith('/api/')) return res.json({ ok: false, message: 'Server error' });
  try {
    res.render('pages/404', {
      page: '500',
      error: true,
      meta: seo.meta({ title: 'Something went wrong', path: req.path, noindex: true })
    });
  } catch (e) {
    res.send('Something went wrong. Please refresh the page.');
  }
});

// ---------- start (non-Vercel) ----------
// cPanel's Passenger loads this file through its own loader, so we can't rely on
// require.main === module; set NO_LISTEN=1 only when importing the app in scripts/tests.
if (!IS_VERCEL && process.env.NO_LISTEN !== '1') {
  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, () => console.log(`CoreByte Solutions running on http://localhost:${PORT}`));
}

module.exports = app;
