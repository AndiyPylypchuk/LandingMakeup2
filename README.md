# Anna Pylypchuk — Makeup Artist Landing Site (V2)

Angular 19 landing site with prerendering, SEO, funnel pages, and PHP API endpoints deployable to cPanel shared hosting.

**Live domain:** https://www.annapylypchuk.com/

---

## Table of Contents

1. [Local Development](#1-local-development)
2. [Project Structure](#2-project-structure)
3. [SEO & Prerender Overview](#3-seo--prerender-overview)
4. [Environment Configuration](#4-environment-configuration)
5. [cPanel Deployment — Static + PHP API](#5-cpanel-deployment--static--php-api)
6. [PHP API Endpoints](#6-php-api-endpoints)
7. [MariaDB Setup via phpMyAdmin](#7-mariadb-setup-via-phpmyadmin)
8. [Funnel Pages (`/v/:slug`)](#8-funnel-pages-vslug)
9. [Adding / Removing a Prerendered Route](#9-adding--removing-a-prerendered-route)
10. [Local Mock Funnel Data](#10-local-mock-funnel-data)

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

# Start development server (with HMR, uses mock funnel data — no server needed)
npm start
# → http://localhost:4200

# Build for production (static prerender output)
npm run build
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
│   │   ├── app.config.ts     # App-level providers (HttpClient, hydration, router)
│   │   └── app.config.server.ts
│   ├── environments/
│   │   ├── environment.ts            # Development defaults (mockFunnel: true)
│   │   └── environment.production.ts # Production values (swapped at build time)
│   ├── index.html
│   ├── main.ts / main.server.ts
│   ├── server.ts             # Angular SSR entry point (used at build time for prerender only)
│   └── styles.scss           # Global SCSS design system
├── public/
│   ├── robots.txt            # Allows all, disallows /v/
│   └── sitemap.xml           # Static sitemap for indexable routes
├── api/
│   ├── contact.php           # POST — contact form handler (PHP mail + validation)
│   └── funnel.php            # GET  — fetch funnel row by slug from MariaDB
└── database/
    └── schema.sql            # funnels table DDL + seed rows
```

> **API** is served by PHP files deployed to `public_html/api/` on cPanel:
> - `GET /api/funnel.php?slug=SLUG`
> - `POST /api/contact.php`

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

`src/environments/environment.production.ts`:

```ts
export const environment = {
  production: true,
  apiBase: '/api',                                // relative path to PHP API endpoints
  canonicalBase: 'https://www.annapylypchuk.com', // canonical domain (no trailing slash)
  mockFunnel: false,
};
```

> **`apiBase`** — keep `/api` when both the Angular static files and the PHP files are served from the same origin (the recommended cPanel setup).

---

## 5. cPanel Deployment — Static + PHP API

This deployment requires **no Node.js runtime** on the server — only PHP (available on all cPanel shared hosting plans). Total upload size is well under 50 MB.

### Overview

| What | Where on server |
|------|----------------|
| Angular browser build | `public_html/` (contents of `dist/landing-makeup/browser/`) |
| PHP endpoints | `public_html/api/contact.php`, `public_html/api/funnel.php` |
| `.htaccess` | `public_html/.htaccess` |
| MariaDB schema | imported via phpMyAdmin |

### Step 1 — Build locally

```bash
npm run build
```

Output will be in `dist/landing-makeup/browser/`.

### Step 2 — Upload the Angular browser build

Using cPanel **File Manager** (or FTP/SFTP):

- Upload the **contents** of `dist/landing-makeup/browser/` to `public_html/`.
- Make sure `public_html/index.html` exists after upload.

### Step 3 — Upload PHP endpoints

Create the `api/` subfolder in `public_html/` and upload both PHP files:

```
public_html/
  api/
    contact.php    ← from api/contact.php
    funnel.php     ← from api/funnel.php
```

### Step 4 — Configure PHP DB credentials

Open `public_html/api/funnel.php` in File Manager and update the fallback values, **or** set environment variables in your hosting control panel:

| Variable | Description |
|----------|-------------|
| `DB_HOST` | `localhost` (usually) |
| `DB_NAME` | Database name as shown in cPanel (e.g. `cpaneluser_makeup`) |
| `DB_USER` | Database user (e.g. `cpaneluser_dbuser`) |
| `DB_PASS` | Database password |

If your host doesn't support `getenv()` variables easily, edit the fallback defaults directly in `funnel.php`:

```php
$host = 'localhost';
$db   = 'cpaneluser_makeup';
$user = 'cpaneluser_dbuser';
$pass = 'your_db_password';
```

### Step 5 — Create `.htaccess` for SPA routing

Create (or edit) `public_html/.htaccess` with the following content:

```apache
Options -MultiViews
RewriteEngine On

# Don't rewrite real files or directories (including /api/*)
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Fall back to index.html for all other routes (Angular client-side routing)
RewriteRule ^ index.html [L]
```

### Step 6 — Verify

1. Visit `https://www.annapylypchuk.com/` — the site should load.
2. Navigate to `/about`, `/services`, `/contacts` — they should work (prerendered HTML is served directly).
3. Navigate to `/v/summer-offer` — should load the funnel page (PHP + DB query).
4. Submit the contact form — you should receive an email at `pylyp69de@gmail.com`.
5. View page source on `/` — you should see full HTML content (not just `<app-root>`).

---

## 6. PHP API Endpoints

### `GET /api/funnel.php?slug=SLUG`

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

**Database credentials** are read from environment variables (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`) with inline fallback defaults.

### `POST /api/contact.php`

Accepts `application/json` or `application/x-www-form-urlencoded`.

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Required |
| `email` | string | Required, validated |
| `message` | string | Required, min 10 chars |
| `website` | string | Honeypot — must be empty |

Returns `{"success": true, "message": "..."}` or a 4xx/5xx error with `{"success": false, "message": "..."}`.

Email is sent via PHP `mail()` to `pylyp69de@gmail.com`.

---

## 7. MariaDB Setup via phpMyAdmin

1. In cPanel → **MySQL Databases**: create a database (e.g. `cpaneluser_makeup`) and a user, then grant the user **ALL PRIVILEGES** on that database.
2. Open **phpMyAdmin**, select the new database.
3. Click the **SQL** tab, paste the contents of `database/schema.sql`, and click **Go**.
   - This creates the `funnels` table and inserts two seed rows.
4. Confirm the table exists under the **Structure** tab.
5. Update `public_html/api/funnel.php` with the correct DB credentials (see §5 Step 4).

---

## 8. Funnel Pages (`/v/:slug`)

Funnel pages are **intentionally non-indexed**:

- `FunnelComponent` sets `<meta name="robots" content="noindex,nofollow">` via Angular's `Meta` service.
- `public/robots.txt` has `Disallow: /v/`.
- `public/sitemap.xml` does **not** include `/v/` URLs.
- Funnel routes are **not** listed in `prerender-routes.txt`.

### How `/v/:slug` works

1. The Angular router loads `FunnelComponent` for any `/v/<slug>` path.
2. On init, the component calls `GET /api/funnel.php?slug=<slug>`.
3. If the API returns 404 or the slug is inactive, the component shows the 404 page.
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

Visitors will receive a 404 response from the API and be shown the 404 page.

---

## 9. Adding / Removing a Prerendered Route

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

Re-deploy the updated `dist/landing-makeup/browser/` output to `public_html/`.

---

## 10. Local Mock Funnel Data

Testing funnel pages locally against the real PHP back-end requires a database. However, the dev environment ships with a mock dataset so you can preview funnel pages with `npm start` without any server setup at all.

### How to enable

Open `src/environments/environment.ts` and set:

```ts
mockFunnel: true,
```

This flag is already `true` in the development environment file and is explicitly set to `false` in `environment.production.ts`, so mocking is never active in production builds.

### Available mock slugs

| Slug | URL |
|------|-----|
| `test-offer` | `http://localhost:4200/v/test-offer` |

### How it works

- When `mockFunnel` is `true`, `FunnelService.getBySlug()` returns data from `src/app/services/funnel.mock.ts` via `of()` with a 300 ms simulated delay — no network request is made.
- Any slug **not** in the mock map triggers a simulated 404, causing `FunnelComponent` to display the "Not Found" page exactly as it would in production.

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


