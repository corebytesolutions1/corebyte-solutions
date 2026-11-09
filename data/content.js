/**
 * Shared page content: edit text here instead of inside templates.
 */
module.exports = {
  why: [
    { icon: 'workflow', title: 'Built around your workflow', text: 'Not every business works the same way. We study the actual workflow first and build the software to follow it.' },
    { icon: 'anchor', title: 'Specialised industry knowledge', text: 'Experience with CFS, logistics, customs-related workflows and EXIM operations, so we speak the language of your floor and office.' },
    { icon: 'wallet', title: 'Affordable development', text: 'Practical technology without unnecessary enterprise-level overhead. You pay for what the business needs.' },
    { icon: 'layers', title: 'Scalable architecture', text: 'Solutions designed so they can grow with new users, locations and modules without starting over.' },
    { icon: 'zap', title: 'Automation first', text: 'Repetitive manual work is the first thing we look to remove, through software, APIs and automation.' },
    { icon: 'sliders', title: 'Direct customisation', text: 'No forcing you into a one-size-fits-all product. Screens, reports and documents are shaped to your requirements.' }
  ],

  process: [
    { title: 'Understand', text: 'We sit with the people who will use the software and map how work really moves today.' },
    { title: 'Plan', text: 'Scope, modules, data structure and milestones agreed in writing before development starts.' },
    { title: 'Design', text: 'Screens, documents and reports designed around the tasks people do most often.' },
    { title: 'Develop', text: 'Built in short iterations so you see working software early and can steer it.' },
    { title: 'Test', text: 'Checked against real scenarios and real data, including the awkward edge cases.' },
    { title: 'Deploy', text: 'Installed on your machines, network or hosting, with data migrated and users trained.' },
    { title: 'Support', text: 'Fixes, adjustments and new features as the business changes.' }
  ],

  stack: [
    { name: 'Node.js', group: 'Backend' },
    { name: 'JavaScript', group: 'Language' },
    { name: 'Python', group: 'Language' },
    { name: 'Electron', group: 'Desktop' },
    { name: 'PostgreSQL', group: 'Database' },
    { name: 'MySQL', group: 'Database' },
    { name: 'SQLite', group: 'Database' },
    { name: 'REST APIs', group: 'Integration' },
    { name: 'JSON', group: 'Integration' },
    { name: 'AI APIs', group: 'AI' },
    { name: 'HTML', group: 'Web' },
    { name: 'CSS', group: 'Web' },
    { name: 'Git', group: 'Tooling' },
    { name: 'GitHub', group: 'Tooling' },
    { name: 'Cloud & Hosting', group: 'Infrastructure' }
  ],

  faq: [
    {
      q: 'What kind of software does CoreByte Solutions build?',
      a: 'We build custom desktop and web applications, business management, billing, quotation and inventory systems, CFS and container management software, weighbridge (weightment) software, transport and bilty software, ICEGATE/SCMTR message tools and AI integrations.'
    },
    {
      q: 'Is CoreByte Solutions affiliated with ICEGATE, CBIC or Customs?',
      a: 'No. We are an independent software company. Our ICEGATE/SCMTR tools are developed around applicable technical documentation, client workflows and implementation requirements. We are not a government portal or agency.'
    },
    {
      q: 'Can you build SCMTR CIM message filing for export transshipment?',
      a: 'Yes. We build tools for the CIM message set — SF, ST, SFCN, ASR, DP, DT, AR and AT — that check SF data against the Shipping Bill, allow each message only after the previous one is acknowledged, and carry the CIM number and date from the DP acknowledgement into later filings. The tools follow the applicable ICEGATE advisories and Message Implementation Guide.'
    },
    {
      q: 'Does your software work on multiple computers over a LAN?',
      a: 'Yes. Our CFS, weightment, transport and business applications can run on several PCs sharing one central database across your office or yard network.'
    },
    {
      q: 'Do you only work with businesses in Ludhiana?',
      a: 'We are based in Ludhiana, Punjab, and work with businesses across India and beyond. Most of the work, from requirement discussions to deployment and support, can be done remotely.'
    },
    {
      q: 'Can you host our website and set up business email?',
      a: 'Yes. We handle domain registration, DNS, SSL, website and Node.js hosting, cPanel hosting and domain-based business email, including migration from your current provider.'
    },
    {
      q: 'Are your Customs House Agent and import/export services operational?',
      a: 'Not yet. CoreByte Solutions is preparing to offer Customs House Agent (CHA) services and to expand into selected import/export activities. CHA services will begin only after the applicable customs broker licence is obtained. Details will be announced soon, and you can register to be notified at launch.'
    }
  ],

  cha: {
    icon: 'file-check',
    title: 'Customs House Agent (CHA) services',
    text: 'Customs clearance support for exporters and importers, backed by our own CFS and ICEGATE/SCMTR experience. Services will begin only after the applicable customs broker licence is obtained.',
    items: ['Shipping Bill & Bill of Entry filing', 'Customs clearance at CFS / ICD', 'Examination & LEO coordination', 'Export documentation', 'Container stuffing & movement follow-up']
  },

  tradeCategories: [
    { icon: 'home', title: 'Household', text: 'Selected household items and home goods.' },
    { icon: 'wheat', title: 'Food items', text: 'Food products, subject to applicable regulations.' },
    { icon: 'car', title: 'Vehicles', text: 'Old and used vehicles, subject to applicable rules.' },
    { icon: 'package', title: 'General merchandise', text: 'A range of general consumer and trade goods.' },
    { icon: 'boxes', title: 'Miscellaneous goods', text: 'Other legally tradable commodities.' }
  ],

  industries: [
    { icon: 'container', title: 'Container Freight Stations', text: 'Gate operations, container inventory, weighment, billing and customs-related messaging for CFS operators.', links: ['cfs-customs-software', 'icegate-scmtr-solutions', 'weightment-software'] },
    { icon: 'anchor', title: 'Customs, EXIM & freight forwarding', text: 'Tools that prepare, validate and track structured customs messages and the documents around them.', links: ['icegate-scmtr-solutions', 'custom-software-development'] },
    { icon: 'truck', title: 'Transport & logistics', text: 'Bookings, bilties, vehicles, drivers and freight calculation for transport operators.', links: ['transport-bilty-software', 'web-development'] },
    { icon: 'scale', title: 'Weighbridges & industrial sites', text: 'Weighment recording, slips and reports for weighbridges at plants, yards and mandis.', links: ['weightment-software'] },
    { icon: 'factory', title: 'Manufacturing & trading', text: 'Billing, quotation, inventory and management software for SMEs and traders.', links: ['custom-software-development', 'ai-integration'] },
    { icon: 'briefcase', title: 'Exporters & growing businesses', text: 'Websites, business email, hosting and web applications that make a company credible online.', links: ['web-development', 'business-email-hosting', 'web-hosting'] }
  ]
};
