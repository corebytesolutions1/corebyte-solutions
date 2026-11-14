/**
 * Server-side EmailJS client.
 *
 * The browser never sees any EmailJS key: forms post to /api/contact and
 * /api/notify, and this module calls the EmailJS REST API from the server
 * using the Public Key plus the Private Key (access token) from environment
 * variables. In the EmailJS dashboard, enable
 *   Account → Security → "Allow EmailJS API for non-browser applications".
 */
const ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

function config() {
  return {
    serviceId: process.env.EMAILJS_SERVICE_ID || 'service_1t7yl56',
    contactTemplateId: process.env.EMAILJS_TEMPLATE_ID || 'template_h6f2wbo',
    notifyTemplateId: process.env.EMAILJS_NOTIFY_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID || 'template_h6f2wbo',
    publicKey: process.env.EMAILJS_PUBLIC_KEY || '8t_obtLIkkufY4g-d',
    privateKey: process.env.EMAILJS_PRIVATE_KEY || 'HvZVZVTY9ELA-e8_XQL0i'
  };
}

function isConfigured() {
  const c = config();
  return Boolean(c.serviceId && c.contactTemplateId && c.publicKey && c.privateKey);
}

async function send(templateId, params) {
  const c = config();
  if (!isConfigured()) {
    const err = new Error('EmailJS is not configured. Set the EMAILJS_* environment variables.');
    err.code = 'EMAIL_NOT_CONFIGURED';
    throw err;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: c.serviceId,
        template_id: templateId,
        user_id: c.publicKey,
        accessToken: c.privateKey,
        template_params: params
      }),
      signal: controller.signal
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const err = new Error(`EmailJS responded ${res.status}: ${text.slice(0, 200)}`);
      err.code = 'EMAIL_SEND_FAILED';
      throw err;
    }
    return true;
  } finally {
    clearTimeout(timer);
  }
}

function sendContact(data, meta = {}) {
  return send(config().contactTemplateId, {
    form_type: 'Project enquiry',
    from_name: data.name,
    company: data.company || '—',
    reply_to: data.email,
    from_email: data.email,
    phone: data.phone || '—',
    service: data.service,
    message: data.message,
    page: meta.page || '',
    submitted_at: new Date().toISOString()
  });
}

function sendNotify(data, meta = {}) {
  return send(config().notifyTemplateId, {
    form_type: 'CHA & Import / Export launch notification',
    from_name: data.name || 'Not provided',
    company: '—',
    reply_to: data.email,
    from_email: data.email,
    phone: '—',
    service: 'CHA / Import / Export' + (data.interest ? ` — ${data.interest}` : ''),
    message: 'Please notify this visitor when CoreByte Solutions launches CHA services or import/export operations.',
    page: meta.page || '',
    submitted_at: new Date().toISOString()
  });
}

module.exports = { isConfigured, sendContact, sendNotify };
