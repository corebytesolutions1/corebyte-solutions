/**
 * Small, dependency-free validation and sanitisation helpers for form input.
 */
const site = require('../config/site');

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
const PHONE_RE = /^[+()\-.\s0-9]{6,20}$/;

/** Trim, strip control characters and HTML tags, collapse length. */
function clean(value, max = 500, { multiline = false } = {}) {
  if (value === undefined || value === null) return '';
  let s = String(value).replace(CONTROL_CHARS, '');
  s = s.replace(/<[^>]*>/g, '');           // drop any HTML tags
  s = s.replace(/[<>]/g, '');              // drop stray angle brackets
  if (!multiline) s = s.replace(/\s+/g, ' ');
  else s = s.replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n');
  return s.trim().slice(0, max);
}

function validateContact(body = {}) {
  const data = {
    name: clean(body.name, 100),
    company: clean(body.company, 120),
    email: clean(body.email, 160).toLowerCase(),
    phone: clean(body.phone, 20),
    service: clean(body.service, 60),
    message: clean(body.message, 4000, { multiline: true })
  };
  const errors = {};
  if (data.name.length < 2) errors.name = 'Enter your name.';
  if (!EMAIL_RE.test(data.email)) errors.email = 'Enter a valid email address, like name@company.com.';
  if (data.phone && !PHONE_RE.test(data.phone)) errors.phone = 'Use digits, spaces and + only.';
  if (!site.serviceOptions.includes(data.service)) errors.service = 'Choose the service you need.';
  if (data.message.length < 10) errors.message = 'Tell us a little more, at least 10 characters.';
  return { data, errors, ok: Object.keys(errors).length === 0 };
}

function validateNotify(body = {}) {
  const data = {
    name: clean(body.name, 100),
    email: clean(body.email, 160).toLowerCase(),
    interest: clean(body.interest, 60)
  };
  const errors = {};
  if (!EMAIL_RE.test(data.email)) errors.email = 'Enter a valid email address.';
  return { data, errors, ok: Object.keys(errors).length === 0 };
}

/** Honeypot: real users never fill the hidden "website" field. */
const isBot = (body = {}) => Boolean(body.website && String(body.website).trim());

module.exports = { clean, validateContact, validateNotify, isBot };
