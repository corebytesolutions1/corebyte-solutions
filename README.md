# CoreByte Solutions — corebytex.com

Corporate website for **CoreByte Solutions**: Custom Software • Web Development • AI • CFS & ICEGATE Solutions.

Built with **Node.js + Express + EJS**, modern CSS and vanilla JavaScript. No front-end framework, no build step. Deploys to **Vercel** (primary) and also runs on **cPanel Node.js hosting** or any VPS from the same code.

---

## 1. Project structure

```
corebyte-solutions/
├── server.js                 # Single entry: exports the Express app (Vercel) and listens (cPanel/local)
├── vercel.json               # Vercel: www→apex redirect, cache + security headers
├── package.json
├── .env.example              # Copy to .env (local/cPanel) or add in Vercel → Environment Variables
├── .gitignore
├── README.md
│
├── config/
│   └── site.js               # Company name, URL, contact placeholders, nav, clients, form options
├── data/
│   ├── services.js           # Service catalogue → pages, menus, sitemap, schema (add services here)
│   └── content.js            # Why CoreByte, process, tech stack, FAQ, trade categories, industries
├── lib/
│   ├── seo.js                # Meta tags + JSON-LD (Organization, ProfessionalService, Service, FAQ, Breadcrumb)
│   ├── emailjs.js            # Server-side EmailJS REST client (keys never reach the browser)
│   └── validate.js           # Input validation + sanitisation, honeypot
├── middleware/
│   └── security.js           # Helmet/CSP with nonce, rate limit, same-origin check, canonical host, trailing slash
├── routes/
│   ├── pages.js              # All HTML pages
│   ├── api.js                # POST /api/contact, POST /api/notify, GET /api/health
│   └── seo.js                # /robots.txt, /sitemap.xml, /site.webmanifest
├── scripts/
│   └── check-routes.js       # `npm run check` — smoke-tests every page
│
├── views/
│   ├── pages/                # home, solutions, services, service-detail, industries, about,
│   │                         # projects, contact, trade, privacy, 404
│   └── partials/             # head, navbar, footer, mode-overlay, hero-visual, trade-visual,
│                             # logo-mark, page-hero, cta, faq, process, clients, contact-form,
│                             # notify-form, trade-categories, disclaimer
└── public/                   # Static files (served by Vercel's CDN; by Express elsewhere)
    ├── css/  style.css · animations.css · responsive.css
    ├── js/   main.js · mode-switcher.js · animations.js · cursor.js · hero.js · contact.js
    ├── icons/sprite.svg      # Inline SVG icon set (no icon-font download)
    ├── images/ logo.svg · logo-mark.png · og-image.png
    ├── favicon/ favicon.svg · favicon.ico · apple-touch-icon.png · icon-192.png · icon-512.png
    └── favicon.ico
```

### Pages

| URL | Page |
|---|---|
| `/` | Home (Technology mode and Import/Export mode) |
| `/solutions` | CFS, ICEGATE/SCMTR, Weightment, Transport/Bilty |
| `/services` | All services |
| `/services/<slug>` | One page per service (10 pages, generated from `data/services.js`) |
| `/industries`, `/about`, `/projects`, `/contact`, `/privacy` | Company pages |
| `/trade` | Customs House Agent (CHA) services & Import/Export — Coming soon, with "Notify me" form |
| `/sitemap.xml`, `/robots.txt`, `/site.webmanifest` | Generated |
| `/api/contact`, `/api/notify`, `/api/health` | Form endpoints + health check |

---

## 2. Install and run locally

Requires **Node.js 20 or newer**.

```bash
cd corebyte-solutions
npm install
cp .env.example .env        # then fill in the EmailJS values (section 4)
npm run dev                 # http://localhost:3000, restarts on file changes
```

Other commands:

```bash
npm start                   # production start (node server.js)
npm run check               # requests every page and reports any that fail
```

**Page shows unstyled bullet lists?** Open http://localhost:3000 (not https), and keep `FORCE_HTTPS` unset or `false` on your computer. Then hard-refresh with Ctrl+Shift+R. If you opened the site earlier with HTTPS headers active, also clear the site data for localhost in Chrome (DevTools → Application → Clear site data).

To run exactly as Vercel does (optional): `npm i -g vercel`, then `vercel dev`.

---

## 3. Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `SITE_URL` | yes | `https://corebytex.com` — used for canonical URLs, sitemap, Open Graph |
| `EMAILJS_SERVICE_ID` | yes | EmailJS service ID |
| `EMAILJS_TEMPLATE_ID` | yes | EmailJS template for project enquiries |
| `EMAILJS_NOTIFY_TEMPLATE_ID` | no | Separate template for "Notify me" (falls back to the enquiry template) |
| `EMAILJS_PUBLIC_KEY` | yes | EmailJS Public Key |
| `EMAILJS_PRIVATE_KEY` | yes | EmailJS Private Key — secret, server only |
| `NODE_ENV` | cPanel | `production` |
| `PORT` | cPanel/local | Port to listen on (cPanel sets this itself) |
| `CANONICAL_HOST` | cPanel only | `corebytex.com` — redirects `www` and other hosts to it. Leave empty on Vercel |
| `FORCE_HTTPS` | cPanel only | `true` to redirect http → https |

---

## 4. EmailJS setup (contact + "Notify me" forms)

The browser never talks to EmailJS. Forms post to `/api/contact` or `/api/notify`; the server validates and sanitises the input, then calls the EmailJS REST API with keys from environment variables. Nothing secret appears in the page source.

1. Create an account at **emailjs.com**.
2. **Email Services → Add New Service** → connect the mailbox that should receive enquiries (Gmail, Outlook, or SMTP for your business email). Copy the **Service ID**.
3. **Email Templates → Create New Template**. Use these variables:

   **Subject:**
   ```
   {{form_type}}: {{service}} — {{from_name}}
   ```
   **Content:**
   ```
   Type: {{form_type}}
   Name: {{from_name}}
   Company: {{company}}
   Email: {{from_email}}
   Phone: {{phone}}
   Service: {{service}}

   {{message}}

   Sent from: {{page}} at {{submitted_at}}
   ```
   In the template's settings set **To Email** to your inbox and **Reply To** to `{{reply_to}}`. Save and copy the **Template ID**.
   (Optional: create a second template for "Notify me" and use it as `EMAILJS_NOTIFY_TEMPLATE_ID`.)
4. **Account → General**: copy the **Public Key** and the **Private Key**.
5. **Account → Security**: turn on **"Allow EmailJS API for non-browser applications"**. This is required because the email is sent from the server.
6. Add the five values to `.env` (local/cPanel) or to Vercel's Environment Variables.
7. Check: open `/api/health` — it shows `"email":"configured"`. Then send a test enquiry from `/contact`.

Until EmailJS is configured, the form shows a clear message asking visitors to use phone or email instead.

---

## 5. Deploy to Vercel (recommended)

Vercel detects the Express app in `server.js` automatically and runs it as one Vercel Function. Files in `public/` are served from Vercel's CDN.

### Option A — from GitHub (best for ongoing updates)

1. Push this folder to a GitHub repository (`.env` is git-ignored — keep it that way).
2. In Vercel: **Add New → Project → Import** the repository.
3. Framework preset: leave **Other** (or Express if offered). No build command, no output directory.
4. **Environment Variables**: add `SITE_URL` and the five `EMAILJS_*` values for **Production** (and Preview if you want forms working there).
5. **Deploy**. Every push to the main branch redeploys automatically.

### Option B — from your computer with the CLI

```bash
npm i -g vercel
vercel login
cd corebyte-solutions
vercel              # first run: links/creates the project, makes a preview deployment
vercel env add EMAILJS_SERVICE_ID production      # repeat for each variable
vercel --prod       # production deployment
```

### Connect corebytex.com and www.corebytex.com

1. Vercel → Project → **Settings → Domains** → add `corebytex.com`, then add `www.corebytex.com`.
2. When adding `www`, choose **Redirect to corebytex.com** (308). `corebytex.com` is the canonical address used in every canonical tag and the sitemap. (`vercel.json` contains the same redirect as a backup.)
3. At your domain registrar's DNS panel, add the records Vercel shows on the Domains page. They are typically:

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `76.76.21.21` (or the IP shown in your Domains page) |
   | CNAME | `www` | the project-specific target shown in your Domains page |

   Remove any old A/AAAA/CNAME records for `@` and `www` that point elsewhere. Do **not** touch MX/TXT records used by your business email.
   Alternatively, switch the domain's nameservers to Vercel and it creates the records for you.
4. SSL: Vercel issues and renews HTTPS certificates automatically once DNS verifies (usually within minutes). Nothing to install.

### Vercel notes

- `robots.txt` automatically returns `Disallow: /` on `*.vercel.app` preview URLs so they are never indexed.
- Rate limiting in `middleware/security.js` is per function instance. For stricter protection, add a rate-limit rule for `/api/*` in **Vercel → Firewall**.
- If a deployment ever reports a missing view (`Failed to lookup view`), add this to `vercel.json` and redeploy:
  ```json
  "functions": { "server.js": { "includeFiles": "views/**" } }
  ```

---

## 6. Deploy to cPanel (Node.js hosting)

1. **cPanel → Setup Node.js App → Create Application**
   - Node.js version: 20 or newer
   - Application mode: Production
   - Application root: `corebyte-solutions` (folder in your home directory)
   - Application URL: `corebytex.com`
   - Application startup file: `server.js`
2. Upload the project (without `node_modules`) to the application root using File Manager (upload the zip and Extract) or Git.
3. In the app's **Environment variables** section add: `NODE_ENV=production`, `SITE_URL=https://corebytex.com`, `CANONICAL_HOST=corebytex.com`, `FORCE_HTTPS=true` and the `EMAILJS_*` values. (Or create `.env` in the application root.)
4. Click **Run NPM Install**, then **Restart**.
5. **SSL:** cPanel → **SSL/TLS Status** → select `corebytex.com` and `www.corebytex.com` → **Run AutoSSL**.
6. **www → apex:** with `CANONICAL_HOST=corebytex.com` the app sends a 301 from `www.corebytex.com` (and from http) to `https://corebytex.com`. Make sure `www` has a DNS record (CNAME `www` → `corebytex.com`) and is covered by the SSL certificate.
7. After changing code, upload the files and click **Restart** in Setup Node.js App.

---

## 7. SEO checklist (implemented)

- Semantic HTML: `header`, `nav`, `main`, `section`, `article`, `footer`, ordered/definition lists, one `h1` per page, `h2`/`h3` hierarchy
- Unique `<title>` and meta description on every page; canonical URL on every page (always `https://corebytex.com/...`, no trailing slash; trailing-slash URLs 301 to the clean URL)
- Open Graph and Twitter/X card tags with a 1200×630 image (`public/images/og-image.png`)
- `robots.txt` with sitemap reference; `/api/` disallowed; previews blocked
- `sitemap.xml` generated from the page list and `data/services.js`
- JSON-LD: Organization, WebSite, ProfessionalService (LocalBusiness subtype, locality-level address only: Ludhiana, Punjab, IN), Service (each service page), FAQPage (home), BreadcrumbList (inner pages)
- Natural keyword coverage: custom software development, web development company, AI integration, CFS management software, ICEGATE API integration, SCMTR JSON, SCMTR CIM messages (SF, ST, SFCN, ASR, DP, DT, AR, AT), ICEGATE message parser, weightment/weighbridge software, transport bilty software, domain registration, web hosting, business email hosting, Ludhiana/Punjab
- Fast pages: no framework, no icon font, deferred scripts, SVG/CSS visuals instead of video or images, cached static assets, `font-display: swap`
- ICEGATE disclaimer on the home spotlight, the ICEGATE service page, solutions page, FAQ and footer

After launch: add the site to **Google Search Console** and **Bing Webmaster Tools**, submit `https://corebytex.com/sitemap.xml`, and create a **Google Business Profile** for local search.

---

## 8. Responsive testing checklist

Every page was rendered in headless Chromium at **320, 375, 390, 414, 768, 1024, 1280, 1366, 1440 and 1920 px**, in both Technology and Import/Export modes, checking for:

- [x] No horizontal scrolling and no element extending past the viewport
- [x] Mobile drawer: opens/closes, locks background scroll, closes on link tap, scrim tap and Escape, submenus expand as accordions
- [x] Desktop mega menus: open on hover, click and keyboard; close on Escape and outside click
- [x] First-visit mode overlay appears once, keeps keyboard focus inside, choice saved in localStorage, not shown again
- [x] Floating Tech/Trade switch works on every page (navigates to `/trade` or `/` where needed)
- [x] Contact form: client-side errors, server-side validation (422), unconfigured EmailJS message, no-JavaScript POST fallback
- [x] No JavaScript errors on any page
- [x] Reduced-motion: loader skipped, animations and typing disabled, content fully visible
- [x] Cursor effects only on mouse/trackpad devices; none on touch

Still worth checking by hand on real devices after deployment: iPhone Safari (notch/safe areas and the address bar), an Android phone in Chrome, and Firefox on desktop.

---

## 9. Replacing content, logo and images

| What | Where |
|---|---|
| Email, phone, WhatsApp, address (currently marked "to be added") | `config/site.js` → `contact` |
| Social profile links | `config/site.js` → `social` |
| Client projects | `config/site.js` → `clients` |
| Service text, features, SEO titles | `data/services.js` |
| FAQ, process steps, tech stack, trade categories, industries | `data/content.js` |
| Logo | `views/partials/logo-mark.ejs` (inline SVG used in header/footer/loader) and `public/images/logo.svg`, `logo-mark.png` |
| Favicons | `public/favicon/*` and `public/favicon.ico` |
| Social share image | `public/images/og-image.png` (1200×630) |
| Colours | `public/css/style.css` → `:root` (Technology) and `html[data-mode='trade']` (Import/Export) |
| Fonts | `views/partials/head.ejs` (Google Fonts link) and `--f-*` variables in `style.css` |
| Sample JSON in the hero terminal (illustrative only) | `public/js/hero.js` → `SAMPLES` |
| Icons | `public/icons/sprite.svg` — add a `<symbol id="name">` and use `icon('name')` in templates |

After changing CSS/JS, bump `"version"` in `package.json` on cPanel so browsers fetch the new files (Vercel uses the commit hash automatically).

---

## 10. Future expansion

The code is organised so new features slot in without restructuring:

- **New service or product page:** add an object to `data/services.js`. Its page, menu entry, sitemap URL and schema are created automatically.
- **New page type** (case studies, blog, docs, downloads): add a route in `routes/pages.js` (or a new router file mounted in `server.js`), a view in `views/pages/`, and its path in `publicPaths()` so it appears in the sitemap.
- **Database (PostgreSQL/MySQL):** add a `lib/db.js` connection module and read from it in routes instead of `data/*.js`. Keep connection strings in environment variables.
- **Authentication, customer login, client/support portal, admin dashboard, enquiry management, CRM:** mount a new router such as `routes/admin.js` at `/admin` or `/portal` with its own session/auth middleware in `middleware/`. The public site is unaffected.
- **Quotation system, payment gateway, AI chatbot:** add API routes under `routes/api.js` (or `routes/api/*.js`) and a front-end script in `public/js/`. Remember to allow any new third-party domain in the Content-Security-Policy in `middleware/security.js`.

---

## Notes

- The ICEGATE/SCMTR content describes independent software development. CoreByte Solutions is not presented anywhere as affiliated with ICEGATE, CBIC or Customs.
- CHA services and the Import/Export business are shown as **Coming soon** everywhere; CHA services are stated to begin only after the applicable customs broker licence is obtained.
- ICEGATE/SCMTR message content follows ICEGATE Advisory 41/2026 (SCMTR – CIM message filing process for export transshipment).
- No employee counts, years in business, certifications, partnerships, awards or testimonials are claimed.
