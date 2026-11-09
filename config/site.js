/**
 * Central site configuration.
 * Edit this file to change company details, contact placeholders and navigation.
 * Values left as empty strings render as clearly marked placeholders on the site.
 */
const SITE_URL = (process.env.SITE_URL || 'https://corebytex.com').replace(/\/+$/, '');

module.exports = {
  url: SITE_URL,
  domain: 'corebytex.com',
  name: 'CoreByte Solutions',
  shortName: 'CoreByte',
  tagline: 'Custom Software • Web • AI • Automation',
  positioning: 'Custom Software • Web Development • AI • CFS & ICEGATE Solutions',
  description:
    'CoreByte Solutions builds custom software, web applications, AI integrations and specialised CFS, weighbridge and ICEGATE/SCMTR tools for businesses across India and beyond.',
  locale: 'en_IN',
  location: {
    city: 'Ludhiana',
    region: 'Punjab',
    country: 'India',
    countryCode: 'IN'
  },
  areaServed: 'Serving businesses across India and beyond',

  // ---- Contact details: fill these in. Empty values show a marked placeholder. ----
  contact: {
    email: 'hello@corebytex.com',        // e.g. 'hello@corebytex.com'
    phone: '',        // e.g. '+91 00000 00000'
    whatsapp: '',     // digits only, e.g. '910000000000'
    address: 'Ludhiana, Punjab'       // full street address, only if you want it public
  },

  social: {
    Instagram: 'corebytesolutions',
    linkedin: '',
    github: '',
    x: ''
  },

  clients: [
    {
      name: 'WELEXPORTS',
      url: 'https://www.welexports.com',
      display: 'www.welexports.com',
      category: 'Export / Business Website',
      summary:
        'A business website for an export company, presenting the organisation and its offering clearly to buyers and partners.'
    },
    {
      name: 'OWPL-CFS',
      url: 'https://www.owpl-cfs.com',
      display: 'www.owpl-cfs.com',
      category: 'CFS / Logistics / Customs Operations',
      summary:
        'Digital presence and operations software for a Container Freight Station, built around container handling and customs-related workflows.'
    }
  ],

  nav: [
    { label: 'Home', href: '/' },
    {
      label: 'Solutions',
      href: '/solutions',
      menu: 'solutions'
    },
    {
      label: 'Services',
      href: '/services',
      menu: 'services'
    },
    { label: 'Industries', href: '/industries' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Contact', href: '/contact' }
  ],

  serviceOptions: [
    'Custom Software',
    'Web Development',
    'AI Integration',
    'CFS Software',
    'ICEGATE / SCMTR',
    'Weightment Software',
    'Transport / Bilty Software',
    'Domain / Hosting',
    'Business Email',
    'Customs House Agent (CHA)',
    'Import / Export',
    'Other'
  ],

  icegateDisclaimer:
    'CoreByte Solutions develops software and integration utilities based on applicable technical documentation, client workflows and implementation requirements. CoreByte Solutions is not an official government portal or government agency.'
};
