const crypto = require('crypto');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

// HTTPS-only headers (upgrade-insecure-requests, HSTS) are sent only when the site
// is actually served over HTTPS. Sending them on http://localhost makes the browser
// rewrite /css and /js requests to https://localhost, which fails and leaves the page unstyled.
const httpsOnly = Boolean(process.env.VERCEL) || process.env.FORCE_HTTPS === 'true';

/** Per-request nonce for the single small inline script (mode/theme bootstrap). */
function nonce(req, res, next) {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
}

function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        styleSrc: ["'self'", 'https://fonts.googleapis.com'],
        styleSrcAttr: ["'unsafe-inline'"],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        upgradeInsecureRequests: httpsOnly ? [] : null
      }
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: httpsOnly ? { maxAge: 31536000, includeSubDomains: true } : false
  });
}

/**
 * Canonical host + HTTPS redirect for hosts that don't do it at the edge (cPanel).
 * On Vercel, configure the www → apex redirect in the Domains settings instead;
 * this middleware skips *.vercel.app preview URLs and localhost.
 */
function canonicalHost(req, res, next) {
  const canonical = (process.env.CANONICAL_HOST || '').toLowerCase();
  const host = (req.headers.host || '').toLowerCase().split(':')[0];
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host.endsWith('.vercel.app') || !host;
  if (isLocal || !canonical) return next();

  const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'http').split(',')[0].trim();
  const forceHttps = process.env.FORCE_HTTPS === 'true' && proto !== 'https';
  if (host !== canonical || forceHttps) {
    return res.redirect(301, `https://${canonical}${req.originalUrl}`);
  }
  next();
}

/** Remove trailing slashes so every page has exactly one URL. */
function trailingSlash(req, res, next) {
  if ((req.method === 'GET' || req.method === 'HEAD') && req.path.length > 1 && req.path.endsWith('/')) {
    const q = req.originalUrl.slice(req.path.length);
    return res.redirect(301, req.path.replace(/\/+$/, '') + q);
  }
  next();
}

/** Rate limit for form endpoints (per instance; Vercel Firewall can add edge limits). */
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => {
    const msg = 'Too many messages from this connection. Wait 15 minutes and try again.';
    if (req.accepts(['json', 'html']) === 'json') return res.status(429).json({ ok: false, message: msg });
    res.status(429).send(msg);
  }
});

/** Only accept form posts that originate from this site. */
function sameOrigin(req, res, next) {
  const origin = req.headers.origin;
  if (!origin) return next(); // non-browser or same-origin navigations without Origin
  try {
    const o = new URL(origin).host.toLowerCase();
    const h = (req.headers['x-forwarded-host'] || req.headers.host || '').toLowerCase();
    if (o === h) return next();
  } catch (e) { /* fall through */ }
  return res.status(403).json({ ok: false, message: 'Request blocked: form posted from another site.' });
}

module.exports = { nonce, securityHeaders, canonicalHost, trailingSlash, formLimiter, sameOrigin };
