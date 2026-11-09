const express = require('express');
const services = require('../data/services');
const content = require('../data/content');
const seo = require('../lib/seo');

const router = express.Router();
const bySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
const group = (g) => services.filter((s) => s.group === g);

router.get('/', (req, res) => {
  res.render('pages/home', {
    page: 'home',
    meta: seo.meta({
      path: '/',
      description:
        'CoreByte Solutions is a software development company in Ludhiana, Punjab building custom software, web applications, AI integrations, CFS management software, weighbridge software and ICEGATE/SCMTR JSON message tools for businesses across India.',
      schema: [seo.localBusiness(), seo.faqPage(content.faq)]
    }),
    services,
    solutions: group('solutions'),
    coreServices: group('services'),
    infra: group('infrastructure'),
    content
  });
});

router.get('/solutions', (req, res) => {
  res.render('pages/solutions', {
    page: 'solutions',
    meta: seo.meta({
      title: 'CFS, ICEGATE/SCMTR, Weighbridge & Transport Software',
      path: '/solutions',
      description:
        'Specialised software for logistics and customs-related operations: CFS management software, ICEGATE/SCMTR message tools, weightment software and transport bilty software.',
      breadcrumbs: [{ name: 'Solutions', path: '/solutions' }]
    }),
    solutions: group('solutions')
  });
});

router.get('/services', (req, res) => {
  res.render('pages/services', {
    page: 'services',
    meta: seo.meta({
      title: 'Software, Web, AI, Hosting & Domain Services',
      path: '/services',
      description:
        'Custom software development, web development, AI integration, CFS and ICEGATE solutions, weighbridge and transport software, domain, hosting and business email services.',
      breadcrumbs: [{ name: 'Services', path: '/services' }]
    }),
    solutions: group('solutions'),
    coreServices: group('services'),
    infra: group('infrastructure')
  });
});

router.get('/services/:slug', (req, res, next) => {
  const s = bySlug[req.params.slug];
  if (!s) return next();
  const parent = s.group === 'solutions' ? { name: 'Solutions', path: '/solutions' } : { name: 'Services', path: '/services' };
  const related = services.filter((x) => x.slug !== s.slug && x.group === s.group).slice(0, 3);
  res.render('pages/service-detail', {
    page: s.group === 'solutions' ? 'solutions' : 'services',
    meta: seo.meta({
      title: s.seoTitle,
      path: '/services/' + s.slug,
      description: s.seoDescription,
      breadcrumbs: [parent, { name: s.title, path: '/services/' + s.slug }],
      schema: [seo.service(s)]
    }),
    s,
    parent,
    related,
    content
  });
});

router.get('/industries', (req, res) => {
  res.render('pages/industries', {
    page: 'industries',
    meta: seo.meta({
      title: 'Industries We Build Software For',
      path: '/industries',
      description:
        'Software for container freight stations, customs and EXIM operations, transport and logistics, weighbridges, manufacturing, trading and growing businesses.',
      breadcrumbs: [{ name: 'Industries', path: '/industries' }]
    }),
    industries: content.industries,
    bySlug
  });
});

router.get('/about', (req, res) => {
  res.render('pages/about', {
    page: 'about',
    meta: seo.meta({
      title: 'About CoreByte Solutions — Software Company in Ludhiana, Punjab',
      path: '/about',
      description:
        'CoreByte Solutions is a software development company based in Ludhiana, Punjab, building practical software, web and AI solutions for businesses across India and beyond.',
      breadcrumbs: [{ name: 'About', path: '/about' }],
      schema: [seo.localBusiness()]
    }),
    content
  });
});

router.get('/projects', (req, res) => {
  res.render('pages/projects', {
    page: 'projects',
    meta: seo.meta({
      title: 'Client Projects',
      path: '/projects',
      description: 'Client projects by CoreByte Solutions, including WELEXPORTS and OWPL-CFS.',
      breadcrumbs: [{ name: 'Projects', path: '/projects' }]
    })
  });
});

router.get('/contact', (req, res) => {
  const pre = String(req.query.service || '');
  res.render('pages/contact', {
    page: 'contact',
    meta: seo.meta({
      title: 'Contact — Start a Software Project',
      path: '/contact',
      description:
        'Tell CoreByte Solutions about the workflow you want to improve. Enquire about custom software, web development, AI, CFS, ICEGATE/SCMTR, weighbridge, transport software or hosting.',
      breadcrumbs: [{ name: 'Contact', path: '/contact' }]
    }),
    preselect: pre,
    sent: req.query.sent === '1',
    failed: req.query.error === '1'
  });
});

router.get('/trade', (req, res) => {
  res.render('pages/trade', {
    page: 'trade',
    meta: seo.meta({
      title: 'Customs House Agent (CHA) & Import/Export Services — Coming Soon',
      path: '/trade',
      description:
        'CoreByte Solutions is preparing to offer Customs House Agent (CHA) services and selected import/export activities: household items, food items, used vehicles, general merchandise and miscellaneous goods. Coming soon.',
      breadcrumbs: [{ name: 'CHA & Import / Export', path: '/trade' }]
    }),
    content,
    notified: req.query.notified === '1'
  });
});

router.get('/privacy', (req, res) => {
  res.render('pages/privacy', {
    page: 'privacy',
    meta: seo.meta({
      title: 'Privacy Notice',
      path: '/privacy',
      description: 'How CoreByte Solutions handles information submitted through corebytex.com.',
      breadcrumbs: [{ name: 'Privacy', path: '/privacy' }]
    })
  });
});

module.exports = router;
module.exports.publicPaths = () => [
  '/', '/solutions', '/services', ...services.map((s) => '/services/' + s.slug),
  '/industries', '/about', '/projects', '/contact', '/trade', '/privacy'
];
