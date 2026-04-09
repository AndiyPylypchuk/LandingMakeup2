# Anna Pylypchuk — Makeup Artist Landing Site (V2)

Production-ready Angular 19 SSR landing site with prerendering, SEO, funnel pages, and a Node.js/MariaDB back-end deployable to cPanel hosting via "Setup Node.js App".

**Live domain:** https://www.annapylypchuk.com/

---

## Table of Contents

1. [Local Development](#1-local-development)
2. [Project Structure](#2-project-structure)
3. [SEO & Prerender Overview](#3-seo--prerender-overview)
4. [Environment Configuration](#4-environment-configuration)
5. [cPanel Deployment — Static Prerendered Output](#5-cpanel-deployment--static-prerendered-output)
6. [cPanel Deployment — SSR Node App](#6-cpanel-deployment--ssr-node-app)
7. [Node.js API Endpoints](#7-nodejs-api-endpoints)
8. [MariaDB Setup via phpMyAdmin](#8-mariadb-setup-via-phpmyadmin)
9. [Funnel Pages (`/v/:slug`)](#9-funnel-pages-vslug)
10. [Adding / Removing a Prerendered Route](#10-adding--removing-a-prerendered-route)
11. [Local Mock Funnel Data](#11-local-mock-funnel-data)

---

## 1. Local Development

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20 LTS or later |
| npm | 9+ (bundled with Node) |
| Angular CLI | 19 (`npm i -g @angular/cli@19`) |

### Install & run

```bash
# Install dependencies
npm install

# Start development server (with HMR, no SSR)
npm start
# → http://localhost:4200

# Build for production (SSR + prerender)
npm run build

# Run the SSR Node server locally (after building)
npm run serve:ssr:landing-makeup
# → http://localhost:4000
```

### Run tests

```bash
npm test          # Karma unit tests (watch mode)
npm test -- --watch=false --browsers=ChromeHeadless   # CI / single run
```

---

## 2. Project Structure

```
.
├── angular.json              # Angular workspace config
├── prerender-routes.txt      # List of routes to pre-render at build time
├── src/
│   ├── app/
│   │   ├── pages/            # Route components (home, about, services, contacts, funnel, not-found)
│   │   ├── shared/           # Header, Footer components
│   │   ├── services/         # SeoService, FunnelService, ContactService, funnel.mock
│   │   ├── app.routes.ts     # Route definitions
│   │   ├── app.config.ts     # App-level providers (SSR, hydration, router)
│   │   └── app.config.server.ts
│   ├── environments/
│   │   ├── environment.ts           # Development defaults
│   │   └── environment.production.ts # Production values (swapped at build time)
│   ├── index.html
│   ├── main.ts / main.server.ts
│   ├── server.ts             # Express SSR entry point
│   └── styles.scss           # Global SCSS design system
├── public/
│   ├── robots.txt            # Allows all, disallows /v/
│   └── sitemap.xml           # Static sitemap for indexable routes
├── api/
│   ├── contact.php           # DEPRECATED — kept for reference only
│   └── funnel.php            # DEPRECATED — kept for reference only
└── database/
    └── schema.sql            # funnels table DDL + seed rows
```

> **API** is now served directly by the Express SSR server (`src/server.ts`):
> - `GET /api/funnel?slug=SLUG`
> - `POST /api/contact`

---

## 3. SEO & Prerender Overview

### How prerendering works

Angular CLI generates a static HTML snapshot at **build time** for every route listed in `prerender-routes.txt`.
These files land in `dist/landing-makeup/browser/` and are served as plain HTML — no JavaScript needed for the first paint,
so Google and social-media crawlers receive fully-rendered content immediately.

### Indexable routes (prerendered)

| Route | Prerendered | In sitemap | Robots |
|-------|-------------|------------|--------|
| `/` | ✅ | ✅ | index |
| `/about` | ✅ | ✅ | index |
| `/services` | ✅ | ✅ | index |
| `/contacts` | ✅ | ✅ | index |
| `/v/:slug` | ❌ | ❌ | noindex, nofollow |
| `/**` (404) | ❌ | ❌ | — |

### SEO features

- **SeoService** sets `<title>`, `<meta name="description">`, and `<link rel="canonical">` per route.
- **JSON-LD** Organization / LocalBusiness structured-data block on every page.
- **Open Graph** tags (`og:title`, `og:description`, `og:url`).
- **robots.txt** — `Disallow: /v/` keeps funnel URLs out of Google's index.
- **sitemap.xml** — lists only the four indexable routes.
- Funnel pages get `<meta name="robots" content="noindex,nofollow">` added at runtime.

---

## 4. Environment Configuration

Two environment files are used — the build toolchain swaps them automatically:

| File | Used when |
|------|-----------|
| `src/environments/environment.ts` | `ng serve` (development) |
| `src/environments/environment.production.ts` | `ng build` (production) |

Edit `src/environments/environment.production.ts` to change:

```ts
export const environment = {
  production: true,
  apiBase: '/api',                             // relative path to Node API endpoints
  canonicalBase: 'https://www.annapylypchuk.com', // canonical domain (no trailing slash)
};
```

> **`apiBase`** — keep `/api` when the Angular app and the Node.js server run on the same origin (the recommended setup). The API routes `/api/funnel` and `/api/contact` are served directly by the Express SSR server.

---

## 5. cPanel Deployment — Static Prerendered Output (Limited)

> **Note:** This mode serves pre-rendered HTML only. The contact form and funnel pages require the Node.js SSR server (§6) to function — without it, API calls will fail. Use §6 for a fully working production deployment.

### Steps

```bash
# 1. Build on your local machine (or CI)
npm run build
```

The build output is in `dist/landing-makeup/browser/`.

2. **Upload via cPanel File Manager** (or FTP/SFTP):
   - Upload the **contents** of `dist/landing-makeup/browser/` to `public_html/` (or your subdomain root).

3. **Create `.htaccess`** in `public_html/` (Angular handles routing client-side via the prerendered index fallback):

```apache
Options -MultiViews
RewriteEngine On

# Serve pre-rendered HTML for known routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

4. Verify `https://www.annapylypchuk.com/` loads from static HTML (view source should show full content).

---

## 6. cPanel Deployment — SSR Node App

**Recommended** — serves both the Angular SSR app and the Node.js API from a single Express process. Requires cPanel with **"Setup Node.js App"** (Node.js Selector).

### Build

```bash
npm run build
```

Output directories:
- `dist/landing-makeup/browser/` — static assets
- `dist/landing-makeup/server/` — SSR Node bundle (entry: `server.mjs`)

### cPanel Setup Node.js App

1. Log into cPanel → **Setup Node.js App** → **Create Application**.
2. Fill in:

   | Field | Value |
   |-------|-------|
   | Node.js version | 20.x (LTS) |
   | Application mode | Production |
   | Application root | `landing-makeup` (a folder in your home directory) |
   | Application URL | `yourdomain.com` |
   | Application startup file | `dist/landing-makeup/server/server.mjs` |

3. Click **Create**, then open the virtual environment terminal (or SSH) and run:

   ```bash
   cd ~/landing-makeup
   # Upload / extract build output here first, then:
   npm install --omit=dev
   ```

4. Set environment variables in the cPanel Node.js App panel:

   **Required — Database (MariaDB):**

   | Variable | Example value | Notes |
   |----------|---------------|-------|
   | `DB_HOST` | `localhost` | Usually `localhost` on cPanel |
   | `DB_PORT` | `3306` | Default MariaDB port |
   | `DB_NAME` | `cpaneluser_makeup` | Database name from cPanel |
   | `DB_USER` | `cpaneluser_dbuser` | Database user from cPanel |
   | `DB_PASS` | `your_db_password` | Database password |

   **Required — SMTP Email (Nodemailer):**

   | Variable | Example value | Notes |
   |----------|---------------|-------|
   | `SMTP_HOST` | `mail.annapylypchuk.com` | Your SMTP server hostname |
   | `SMTP_PORT` | `587` | 587 = STARTTLS, 465 = SSL |
   | `SMTP_SECURE` | `false` | `true` only for port 465 |
   | `SMTP_USER` | `noreply@annapylypchuk.com` | SMTP login |
   | `SMTP_PASS` | `your_smtp_password` | SMTP password |
   | `MAIL_TO` | `pylyp69de@gmail.com` | Recipient of contact form emails |

   > **If SMTP is not configured** the contact form POST will return a 500 error. Set at least `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` for email to work.

   **Other:**

   | Variable | Example value |
   |----------|---------------|
   | `NODE_ENV` | `production` |
   | `PORT` | assigned by cPanel automatically |

5. Create `.htaccess` in `public_html/` to proxy all traffic to the Node SSR server:

   ```apache
   RewriteEngine On

   # Proxy all requests to the Node SSR server (serves both the app and /api/*)
   RewriteRule ^(.*)$ http://127.0.0.1:<NODE_PORT>/$1 [P,L]
   ```

   > Replace `<NODE_PORT>` with the port shown in the cPanel Node.js App panel.

6. Click **Restart** in the Node.js App panel.

---

## 7. Node.js API Endpoints

Both API routes are implemented in `src/server.ts` and served by the Express SSR server.

### `GET /api/funnel?slug=SLUG`

Returns the funnel row as JSON, or `404` if the slug is missing or `is_active = 0`.

**Response shape:**

```json
{
  "slug": "test-offer",
  "title": "My Funnel Title",
  "youtube_id": "dQw4w9WgXcQ",
  "body_text": "Optional promo text.",
  "button_text": "Написати в Telegram",
  "button_url": "https://t.me/anna_makeup_ua",
  "is_active": true
}
```

**Database credentials** are read from environment variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`). See §6 for the full list.

### `POST /api/contact`

Accepts `application/json`.

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Required |
| `email` | string | Required, validated |
| `message` | string | Required, min 10 chars |
| `website` | string | Honeypot — must be empty |

Returns `{"success": true, "message": "..."}` or a 4xx/5xx error with `{"success": false, "message": "..."}`.

**SMTP credentials** are read from environment variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`, `MAIL_TO`). See §6 for the full list.

> **Note:** The `api/contact.php` and `api/funnel.php` files are kept for reference only and are **not** used by the application. Do not deploy them to `public_html/api/` — the Node.js server handles all `/api/*` requests.

---

## 8. MariaDB Setup via phpMyAdmin

1. In cPanel → **MySQL Databases**: create a database (e.g. `cpaneluser_makeup`) and a user, then grant the user **ALL PRIVILEGES** on that database.
2. Open **phpMyAdmin**, select the new database.
3. Click the **SQL** tab, paste the contents of `database/schema.sql`, and click **Go**.
   - This creates the `funnels` table and inserts two seed rows.
4. Confirm the table exists under the **Structure** tab.
5. Set the DB credentials as environment variables (see §6 above).

---

## 9. Funnel Pages (`/v/:slug`)

Funnel pages are **intentionally non-indexed**:

- `FunnelComponent` sets `<meta name="robots" content="noindex,nofollow">` via `SeoService`.
- `public/robots.txt` has `Disallow: /v/`.
- `public/sitemap.xml` does **not** include `/v/` URLs.
- Funnel routes are **not** listed in `prerender-routes.txt`.

### How `/v/:slug` works

1. The Angular router loads `FunnelComponent` for any `/v/<slug>` path.
2. On init, the component calls `GET /api/funnel?slug=<slug>` (served by the Express SSR server).
3. If the API returns 404 or the slug is inactive, the component redirects to the 404 page.
4. Otherwise it renders: YouTube embed, body text, and a CTA button linking to the Telegram URL stored in the DB.

### Adding a new funnel row

Run the following SQL in phpMyAdmin (or via SSH MySQL client):

```sql
INSERT INTO `funnels`
  (`slug`, `title`, `youtube_id`, `body_text`, `button_text`, `button_url`)
VALUES
  (
    'my-new-offer',
    'My New Offer Title',
    'YouTube11DigitID',
    'Your promotional text here.',
    'Написати в Telegram',
    'https://t.me/anna_makeup_ua'
  );
```

The page will be immediately accessible at `https://www.annapylypchuk.com/v/my-new-offer`.

### Deactivating a funnel page

```sql
UPDATE `funnels` SET `is_active` = 0 WHERE `slug` = 'my-new-offer';
```

Visitors will receive a 404 response from the API and be redirected to the 404 page.

---

## 10. Adding / Removing a Prerendered Route

Open `prerender-routes.txt` in the project root. Each line is one route to prerender:

```
/
/about
/services
/contacts
```

- **Add a route:** append a new line, e.g. `/gallery`.
- **Remove a route:** delete the corresponding line.
- **Never add** `/v/:slug` or dynamic routes — these are fetched at runtime, not build time.

After editing the file, rebuild:

```bash
npm run build
```

Re-deploy the updated `dist/landing-makeup/browser/` output to your server.

---

## 11. Local Mock Funnel Data

Testing funnel pages locally normally requires a running PHP back-end and a database. The dev environment ships with a mock dataset so you can preview funnel pages with `npm start` and no server setup at all.

### How to enable

Open `src/environments/environment.ts` and set:

```ts
mockFunnel: true,
```

This flag is already `true` in the development environment file and is explicitly set to `false` in the production environment file (`environment.production.ts`), so mocking is never active in production builds.

### Available mock slugs

| Slug | URL |
|------|-----|
| `test-offer` | `http://localhost:4200/v/test-offer` |

### How it works

- When `mockFunnel` is `true`, `FunnelService.getBySlug()` returns data from `src/app/services/funnel.mock.ts` via `of()` with a 300 ms simulated delay — no network request is made.
- Any slug that is **not** in the mock map triggers a simulated 404, causing `FunnelComponent` to display the "Not Found" page exactly as it would in production.

### Adding more mock slugs

Edit `src/app/services/funnel.mock.ts` and add an entry to the `MOCK_FUNNELS` map:

```ts
[
  'my-new-slug',
  {
    slug: 'my-new-slug',
    title: 'My New Offer',
    youtube_id: 'YouTube11CharID',
    body_text: 'Promo text here.',
    button_text: 'Написати в Telegram',
    button_url: 'https://t.me/anna_makeup_ua',
    is_active: true,
  },
],
```

Then visit `http://localhost:4200/v/my-new-slug`.

---

