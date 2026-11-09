/**
 * SEO helpers: page meta and schema.org JSON-LD builders.
 */
const site = require('../config/site');

const abs = (p = '/') => site.url + (p.startsWith('/') ? p : '/' + p);

function organization() {
  const org = {
    '@type': 'Organization',
    '@id': abs('/#organization'),
    name: site.name,
    url: site.url,
    logo: abs('/images/logo-mark.png'),
    description: site.description,
    areaServed: 'IN',
    knowsAbout: [
      'Custom software development', 'Web development', 'AI integration',
      'CFS management software', 'ICEGATE API integration', 'SCMTR JSON messages',
      'Weighbridge software', 'Transport and bilty software', 'Web hosting', 'Business email hosting'
    ]
  };
  const sameAs = Object.values(site.social).filter(Boolean);
  if (sameAs.length) org.sameAs = sameAs;
  if (site.contact.email) org.email = site.contact.email;
  if (site.contact.phone) org.telephone = site.contact.phone;
  return org;
}

// ProfessionalService (a LocalBusiness subtype). Only locality-level address,
// because no street address has been published.
function localBusiness() {
  const lb = {
    '@type': 'ProfessionalService',
    '@id': abs('/#business'),
    name: site.name,
    url: site.url,
    image: abs('/images/og-image.png'),
    parentOrganization: { '@id': abs('/#organization') },
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.location.city,
      addressRegion: site.location.region,
      addressCountry: site.location.countryCode
    },
    areaServed: [{ '@type': 'Country', name: 'India' }]
  };
  if (site.contact.address) lb.address.streetAddress = site.contact.address;
  if (site.contact.phone) lb.telephone = site.contact.phone;
  return lb;
}

function website() {
  return {
    '@type': 'WebSite',
    '@id': abs('/#website'),
    url: site.url,
    name: site.name,
    publisher: { '@id': abs('/#organization') },
    inLanguage: 'en-IN'
  };
}

function breadcrumb(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path)
    }))
  };
}

function service(s) {
  return {
    '@type': 'Service',
    name: s.title,
    serviceType: s.title,
    description: s.seoDescription,
    url: abs('/services/' + s.slug),
    provider: { '@id': abs('/#organization') },
    areaServed: { '@type': 'Country', name: 'India' }
  };
}

function faqPage(faq) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
}

function graph(nodes) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) })
    .replace(/</g, '\\u003c');
}

/**
 * Build the meta object every page receives.
 */
function meta({ title, description, path = '/', type = 'website', noindex = false, breadcrumbs, schema = [] }) {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} — Custom Software, Web, AI & CFS/ICEGATE Solutions`;
  const crumbs = breadcrumbs && breadcrumbs.length ? breadcrumb([{ name: 'Home', path: '/' }, ...breadcrumbs]) : null;
  return {
    title: fullTitle,
    description: description || site.description,
    canonical: abs(path === '/' ? '/' : path.replace(/\/+$/, '')),
    ogType: type,
    ogImage: abs('/images/og-image.png'),
    noindex,
    breadcrumbs: breadcrumbs || [],
    jsonLd: graph([organization(), website(), crumbs, ...schema])
  };
}

module.exports = { meta, abs, organization, localBusiness, website, breadcrumb, service, faqPage };
