/**
 * Service catalogue. Every entry automatically gets:
 *   - a detail page at /services/<slug>
 *   - a sitemap.xml entry
 *   - Service + Breadcrumb structured data
 *   - a place in the navigation mega-menu for its group
 * To add a service, append an object with the same shape.
 *
 * group: 'solutions' = specialised industry solutions, 'services' = core services,
 *        'infrastructure' = domain / hosting / email.
 */
module.exports = [
  {
    slug: 'cfs-customs-software',
    formOption: 'CFS Software',
    group: 'solutions',
    highlight: true,
    icon: 'container',
    title: 'CFS & Customs Software',
    short: 'Container Freight Station operations, from gate-in to delivery, in one system.',
    seoTitle: 'CFS Management Software for Container Freight Stations',
    seoDescription:
      'CFS management software for import/export container handling: gate in, gate out, delivery, weighment, billing, transport and reports. Multi-PC/LAN ready. Built by CoreByte Solutions.',
    intro:
      'A Container Freight Station runs on movements, documents and charges that have to agree with each other. We build CFS software around how your yard and office actually work, so containers, vehicles, weights and bills stay connected from the moment a container arrives until it leaves.',
    features: [
      ['Import & export container management', 'Container register with status, size/type, line, party and location, searchable across the yard.'],
      ['Gate In / Gate Out', 'Fast gate entry with vehicle, container and seal details, and a full movement history.'],
      ['Delivery management', 'Delivery orders, out-of-charge tracking and delivery records tied to each container.'],
      ['Weighment', 'Weighbridge readings linked directly to containers and vehicles, with printed slips.'],
      ['Billing', 'Storage, handling and service charges calculated from the actual movement data.'],
      ['Transport management', 'Vehicle trips, drivers and transport charges recorded against each job.'],
      ['Reporting', 'Inventory, pendency, movement and billing reports, exportable for management and audit.'],
      ['Multi-PC / LAN operation', 'Gate, weighbridge and office terminals working on one shared database.'],
      ['Customs workflow automation', 'Data captured once and reused for customs-related messages and documents.']
    ],
    solves: [
      'Re-typing the same container details at the gate, weighbridge and billing desk',
      'Bills that do not match recorded movements',
      'Pendency and inventory reports assembled by hand',
      'Offline terminals drifting out of sync'
    ],
    keywords: ['CFS software', 'CFS management software', 'container management software']
  },
  {
    slug: 'icegate-scmtr-solutions',
    formOption: 'ICEGATE / SCMTR',
    group: 'solutions',
    highlight: true,
    icon: 'braces',
    title: 'ICEGATE / SCMTR Solutions',
    short: 'SCMTR CIM message filing tools: SF, ST, SFCN, ASR, DP, DT, AR and AT, filed in the right sequence.',
    seoTitle: 'ICEGATE API Integration & SCMTR CIM Message Software (SF, ASR, DP, DT, AR, AT)',
    seoDescription:
      'SCMTR CIM message software for export transshipment: SF, ST, SFCN, ASR, DP, DT, AR and AT message generation, ACK-gated filing sequence, CIM number tracking, JSON validators and ICEGATE message parsers via the ICEGATE API.',
    intro:
      'Solutions developed around applicable ICEGATE/SCMTR technical specifications and client workflows. Our tools cover the CIM message set used to record export transshipment movement between inland CFS/ICD locations and gateway ports, as described in ICEGATE Advisory 41/2026: each message built from data you already hold, checked against the Shipping Bill, filed through the ICEGATE API in the correct order, and its acknowledgement read back into your system.',
    features: [
      ['SF — Stuffing Report', 'Filed container-wise by the Custodian (ACU) after Let Export Order, with packages allocated to each container exactly as per the Shipping Bill.'],
      ['ST — Stripping Report', 'Filed container-wise when a stuffed container is opened for further examination or segregation, followed by a fresh SF.'],
      ['SFCN — Stuffing Cancellation', 'Cancels a stuffing report that has already been filed, with the reference carried from the original SF.'],
      ['ASR — Allowed for Shipment Request', 'Filed Shipping Bill-wise by the Transhipper (ATP) with mode of transshipment and next port of unloading, validated against SF data.'],
      ['DP — Export Departure Message', 'Filed by the Transhipper with vehicle or train number. The ACK returns the CIM number and date, which our tools store and share with the Custodian.'],
      ['DT — Departure Time Notification', 'Filed vehicle-wise by the Custodian against the CIM, recording the actual departure time.'],
      ['AR — Arrival at Next Unloading Station', 'Filed vehicle-wise by the Transhipper once the container enters the terminal gate at the next unloading station.'],
      ['AT — Arrival Time', 'Filed by the Terminal Operator (ATO) or Custodian against the CIM, recording the actual arrival time.'],
      ['ACK-gated filing sequence', 'The next message is only allowed after a positive ACK — SF must be acknowledged and officer-approved before ASR, and ASR acknowledged before DP.'],
      ['Shipping Bill cross-checks', 'Container numbers, package numbering and package details checked against the SB before SF is submitted, so errors are caught before filing.'],
      ['ICEGATE API filing & parser', 'Messages filed through the ICEGATE API using your generated API key; ACKs and CIM details parsed into readable records.'],
      ['JSON creators, validators & automation', 'Form-driven creators, structure validation as per the Message Implementation Guide (MIG), batch generation and archiving.']
    ],
    solves: [
      'Hand-edited JSON files and the errors that come with them',
      'ASR or DP rejected because an earlier SF was not acknowledged or approved',
      'Package numbers in SF that do not match the containers in the Shipping Bill',
      'CIM numbers and dates copied by hand into DT, AR and AT filings',
      'Custodian and Transhipper working from different copies of the same data'
    ],
    keywords: ['ICEGATE software', 'ICEGATE API integration', 'SCMTR software', 'SCMTR JSON', 'CIM message', 'SF stuffing report', 'ASR message', 'DP message', 'export transshipment', 'ICEGATE message parser'],
    disclaimer: true
  },
  {
    slug: 'weightment-software',
    formOption: 'Weightment Software',
    group: 'solutions',
    icon: 'scale',
    title: 'Weightment Software',
    short: 'Weighbridge software for gross, tare and net weight with printed slips.',
    seoTitle: 'Weightment & Weighbridge Software',
    seoDescription:
      'Weighbridge and weightment software for vehicles and containers: gross, tare and net weight, party and commodity details, weight slips, reports and multi-PC support.',
    intro:
      'Weighbridge software for operations where every reading has to be recorded, printed and traceable. Vehicle, container, party and commodity details are captured with the weight, and the slip comes out ready to hand over.',
    features: [
      ['Vehicle entry', 'Vehicle number, driver and trip details captured at entry.'],
      ['Weighment', 'First and second weighment recorded against the same ticket.'],
      ['Gross, tare & net weight', 'Net weight calculated automatically from gross and tare.'],
      ['Container details', 'Container number, size and type stored with the weighment.'],
      ['Party & commodity', 'Party and commodity masters for consistent records.'],
      ['Weight slips', 'Print-ready slips with serial numbering.'],
      ['Reports', 'Date-wise, party-wise and vehicle-wise weighment reports.'],
      ['Printer support', 'Works with standard office and slip printers.'],
      ['Database storage & multi-PC', 'Central database shared by more than one terminal.']
    ],
    solves: [
      'Handwritten registers and lost slips',
      'Net weight calculation mistakes',
      'No way to search past weighments quickly'
    ],
    keywords: ['weightment software', 'weighbridge software']
  },
  {
    slug: 'transport-bilty-software',
    formOption: 'Transport / Bilty Software',
    group: 'solutions',
    icon: 'truck',
    title: 'Transport & Bilty Software',
    short: 'Bookings, bilty generation, vehicles, drivers and freight in one place.',
    seoTitle: 'Transport & Bilty Software',
    seoDescription:
      'Transport and bilty software for booking, bilty generation, vehicle and driver management, party management, freight calculation, print-ready documents and reports.',
    intro:
      'For transporters who want bookings, bilties and freight under control. Enter a booking once and the bilty, freight and reports follow from it.',
    features: [
      ['Transport booking', 'Booking entry with consignor, consignee, route and goods details.'],
      ['Bilty generation', 'Bilty / lorry receipt generated from the booking, with serial numbering.'],
      ['Vehicle management', 'Vehicle records, documents and trip history.'],
      ['Driver management', 'Driver details and assignment to trips.'],
      ['Party management', 'Party masters for consignors, consignees and billing parties.'],
      ['Freight calculation', 'Freight worked out from your rate rules.'],
      ['Print-ready documents', 'Bilties and related documents formatted for printing.'],
      ['Reports & database', 'Booking, freight and party reports from one database.']
    ],
    solves: [
      'Bilty books filled in by hand',
      'Freight disputes caused by inconsistent calculation',
      'Scattered vehicle and driver records'
    ],
    keywords: ['transport bilty software', 'bilty software', 'transport management software']
  },
  {
    slug: 'custom-software-development',
    formOption: 'Custom Software',
    group: 'services',
    icon: 'cpu',
    title: 'Custom Software Development',
    short: 'Desktop and business applications shaped around your workflow.',
    seoTitle: 'Custom Software Development Company',
    seoDescription:
      'Custom software development for desktop applications, business management, billing, quotation and inventory systems, database-driven and multi-PC/LAN applications.',
    intro:
      'When off-the-shelf software forces your team to work around it, a custom application is the better fit. We build business software that follows your process, your terminology and your documents.',
    features: [
      ['Desktop applications', 'Fast, dependable Windows applications for daily operations.'],
      ['Business management software', 'Masters, transactions and reports for the way your business runs.'],
      ['Billing software', 'Invoices, tax-ready totals and payment tracking.'],
      ['Quotation software', 'Quotations built from item masters and rate rules, ready to print or send.'],
      ['Inventory systems', 'Stock in, stock out and real-time balances.'],
      ['Enterprise applications', 'Larger systems with roles, approvals and audit trails.'],
      ['Database-driven applications', 'Structured data that stays reliable as volumes grow.'],
      ['Multi-PC / LAN applications', 'Several users on one shared database across your office network.']
    ],
    solves: [
      'Spreadsheets doing the job of a system',
      'Generic software that does not match how you work',
      'Data spread across disconnected tools'
    ],
    keywords: ['custom software development', 'software development company', 'billing software', 'inventory software']
  },
  {
    slug: 'web-development',
    formOption: 'Web Development',
    group: 'services',
    icon: 'globe',
    title: 'Web Development',
    short: 'Business websites, web applications and admin dashboards.',
    seoTitle: 'Web Development Company — Websites & Web Applications',
    seoDescription:
      'Web development for business and corporate websites, responsive sites, custom web applications, admin dashboards, API-integrated websites and e-commerce.',
    intro:
      'From a fast company website to a full web application with an admin panel, we build for the web with performance, search visibility and maintainability in mind.',
    features: [
      ['Business & corporate websites', 'Clear, credible websites that explain what you do.'],
      ['Responsive websites', 'Layouts that work on phones, tablets and desktops.'],
      ['Custom web applications', 'Browser-based tools for your team or your customers.'],
      ['Admin dashboards', 'Manage content, enquiries and data without touching code.'],
      ['API-integrated websites', 'Sites connected to your software, payment or logistics APIs.'],
      ['E-commerce solutions', 'Online catalogues and stores sized to your business.']
    ],
    solves: [
      'Slow, outdated websites that do not convert',
      'Manual processes that could run in a browser',
      'Websites the business cannot update itself'
    ],
    keywords: ['web development company', 'website development', 'web application development']
  },
  {
    slug: 'ai-integration',
    formOption: 'AI Integration',
    group: 'services',
    icon: 'sparkles',
    title: 'AI Integration',
    short: 'Practical AI added to the tools your team already uses.',
    seoTitle: 'AI Integration Services for Business',
    seoDescription:
      'AI integration for business: AI-powered tools, chatbots, AI document processing, automation and AI-assisted workflows added to existing applications.',
    intro:
      'AI is most useful when it removes a specific piece of repetitive work. We integrate AI models into your applications and workflows where they save real time, with sensible checks around the output.',
    features: [
      ['AI-powered business tools', 'Internal tools that summarise, classify or draft for your team.'],
      ['AI chatbots', 'Assistants that answer from your own content and documents.'],
      ['AI document processing', 'Extracting fields from invoices, forms and shipping documents.'],
      ['AI automation', 'Routine steps handled automatically, with review where it matters.'],
      ['AI-assisted workflows', 'Suggestions and checks inside the screens people already use.'],
      ['Integration into existing apps', 'AI features added to your current software through APIs.']
    ],
    solves: [
      'Hours spent reading and re-keying documents',
      'Repeated questions answered by hand',
      'AI experiments that never reach daily use'
    ],
    keywords: ['AI integration', 'AI document processing', 'AI chatbot development']
  },
  {
    slug: 'domain-services',
    formOption: 'Domain / Hosting',
    group: 'infrastructure',
    icon: 'link',
    title: 'Domain Services',
    short: 'Domain purchase, setup, DNS, transfers and SSL.',
    seoTitle: 'Domain Registration, DNS & SSL Setup',
    seoDescription:
      'Domain registration and setup, DNS configuration, domain transfer assistance and SSL setup for businesses.',
    intro:
      'Professional digital infrastructure without unnecessary enterprise-level costs. We help you choose, register and configure domains correctly the first time.',
    features: [
      ['Domain purchase', 'Help choosing and registering the right domain.'],
      ['Domain setup', 'Pointing your domain to your website and services.'],
      ['DNS configuration', 'A, CNAME, MX, TXT, SPF and DKIM records set up correctly.'],
      ['Domain transfer assistance', 'Moving domains between registrars without downtime.'],
      ['SSL setup', 'HTTPS certificates installed and renewing automatically.']
    ],
    solves: ['Misconfigured DNS and email delivery problems', 'Expired SSL certificates', 'Domains stuck with a previous vendor'],
    keywords: ['domain registration', 'DNS configuration', 'SSL setup']
  },
  {
    slug: 'web-hosting',
    formOption: 'Domain / Hosting',
    group: 'infrastructure',
    icon: 'server',
    title: 'Web Hosting',
    short: 'Website, Node.js and cPanel hosting with deployment help.',
    seoTitle: 'Web Hosting, Node.js & cPanel Hosting',
    seoDescription:
      'Web hosting for business websites, Node.js and cPanel hosting, deployment assistance and website migration.',
    intro:
      'Reliable hosting sized for business websites and applications, set up and deployed by the same team that builds the software.',
    features: [
      ['Website hosting', 'Hosting for business and corporate websites.'],
      ['Node.js hosting', 'Environments for Node.js applications and APIs.'],
      ['cPanel hosting', 'Familiar cPanel management for your sites and files.'],
      ['Deployment assistance', 'Applications deployed, configured and verified.'],
      ['Website migration', 'Moving existing sites with minimal disruption.']
    ],
    solves: ['Websites that keep going down', 'No one to call when deployment breaks', 'Paying for capacity you never use'],
    keywords: ['web hosting', 'Node.js hosting', 'cPanel hosting']
  },
  {
    slug: 'business-email-hosting',
    formOption: 'Business Email',
    group: 'infrastructure',
    icon: 'mail',
    title: 'Business Email Hosting',
    short: 'Domain-based business email, configured and supported.',
    seoTitle: 'Business Email Hosting on Your Domain',
    seoDescription:
      'Business email hosting with professional domain-based email addresses, email configuration, SMTP setup and email migration support.',
    intro:
      'Email at your own domain looks professional and keeps your communication under your control. We set it up, connect your devices and help move existing mail.',
    features: [
      ['Professional business email', 'Addresses like name@yourcompany.com.'],
      ['Domain-based email', 'Mail tied to your domain, not a personal account.'],
      ['Email configuration', 'Phones, desktops and webmail set up correctly.'],
      ['SMTP setup', 'Reliable sending for applications and websites.'],
      ['Email migration & support', 'Existing mailboxes moved and supported.']
    ],
    solves: ['Business mail sent from personal addresses', 'Emails landing in spam', 'Mailboxes lost when staff change'],
    keywords: ['business email hosting', 'domain email', 'SMTP setup']
  }
];
