const express = require('express');
const { validateContact, validateNotify, isBot } = require('../lib/validate');
const emailjs = require('../lib/emailjs');
const { formLimiter, sameOrigin } = require('../middleware/security');

const router = express.Router();
const wantsJson = (req) => (req.get('accept') || '').includes('application/json') || req.is('application/json');

router.use(express.json({ limit: '20kb' }));
router.use(express.urlencoded({ extended: false, limit: '20kb' }));

async function handle(req, res, { validate, sendFn, okRedirect, errRedirect }) {
  const json = wantsJson(req);

  // Bots that fill the honeypot get a fake success and nothing is sent.
  if (isBot(req.body)) return json ? res.json({ ok: true }) : res.redirect(303, okRedirect);

  const { data, errors, ok } = validate(req.body);
  if (!ok) {
    return json
      ? res.status(422).json({ ok: false, message: 'Check the highlighted fields.', errors })
      : res.redirect(303, errRedirect);
  }

  try {
    await sendFn(data, { page: String(req.get('referer') || '').slice(0, 200) });
    return json ? res.json({ ok: true }) : res.redirect(303, okRedirect);
  } catch (err) {
    console.error('[form]', err.code || '', err.message);
    const message = err.code === 'EMAIL_NOT_CONFIGURED'
      ? 'The contact form is not connected yet. Please reach us by phone or email instead.'
      : 'Your message could not be sent. Try again in a minute.';
    return json ? res.status(502).json({ ok: false, message }) : res.redirect(303, errRedirect);
  }
}

router.post('/contact', formLimiter, sameOrigin, (req, res) =>
  handle(req, res, {
    validate: validateContact,
    sendFn: emailjs.sendContact,
    okRedirect: '/contact?sent=1#enquiry',
    errRedirect: '/contact?error=1#enquiry'
  })
);

router.post('/notify', formLimiter, sameOrigin, (req, res) =>
  handle(req, res, {
    validate: validateNotify,
    sendFn: emailjs.sendNotify,
    okRedirect: '/trade?notified=1#notify',
    errRedirect: '/trade#notify'
  })
);

router.get('/health', (req, res) => {
  res.set('Cache-Control', 'no-store').json({ ok: true, email: emailjs.isConfigured() ? 'configured' : 'missing' });
});

// Unknown API routes
router.use((req, res) => res.status(404).json({ ok: false, message: 'Not found' }));

module.exports = router;
