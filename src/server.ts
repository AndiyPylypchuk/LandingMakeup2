import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express, { Request, Response } from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

// ── Database connection pool ─────────────────────────────────────────────────
const pool = mysql.createPool({
  host:     process.env['DB_HOST'] ?? 'localhost',
  port:     parseInt(process.env['DB_PORT'] ?? '3306', 10),
  database: process.env['DB_NAME'] ?? '',
  user:     process.env['DB_USER'] ?? '',
  password: process.env['DB_PASS'] ?? '',
  waitForConnections: true,
  connectionLimit: 5,
  charset: 'utf8mb4',
});

// ── Nodemailer SMTP transport ────────────────────────────────────────────────
const smtpTransport = nodemailer.createTransport({
  host:   process.env['SMTP_HOST'] ?? 'localhost',
  port:   parseInt(process.env['SMTP_PORT'] ?? '587', 10),
  secure: process.env['SMTP_SECURE'] === 'true',
  ...(process.env['SMTP_USER']
    ? {
        auth: {
          user: process.env['SMTP_USER'],
          pass: process.env['SMTP_PASS'] ?? '',
        },
      }
    : {}),
});

const MAIL_TO   = process.env['MAIL_TO'] ?? 'pylyp69de@gmail.com';
const MAIL_FROM = process.env['SMTP_USER'] ?? 'noreply@annapylypchuk.com';
const SLUG_RE   = /^[a-z0-9-]{1,80}$/;

// Safe email validation — avoids catastrophic backtracking (ReDoS)
function isValidEmail(value: string): boolean {
  const atIdx = value.lastIndexOf('@');
  if (atIdx < 1) return false;
  const local  = value.slice(0, atIdx);
  const domain = value.slice(atIdx + 1);
  return local.length > 0 && domain.length > 2 && domain.includes('.');
}

// ── Rate limiting for API routes ─────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60,                   // max 60 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Parse JSON bodies for API routes ────────────────────────────────────────
app.use('/api', express.json());

// ── GET /api/funnel?slug=SLUG ────────────────────────────────────────────────
app.get('/api/funnel', apiLimiter, async (req: Request, res: Response) => {
  const slug = String(req.query['slug'] ?? '').trim();
  if (!slug || !SLUG_RE.test(slug)) {
    res.status(400).json({ success: false, message: 'Invalid slug' });
    return;
  }
  try {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(
      'SELECT slug, title, youtube_id, body_text, button_text, button_url, is_active FROM funnels WHERE slug = ? LIMIT 1',
      [slug],
    );
    const row = rows[0];
    if (!row || !row['is_active']) {
      res.status(404).json({ success: false, message: 'Not found' });
      return;
    }
    row['is_active'] = Boolean(row['is_active']);
    res.json(row);
  } catch (err) {
    console.error('[/api/funnel] Database error:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// ── POST /api/contact ────────────────────────────────────────────────────────
app.post('/api/contact', contactLimiter, async (req: Request, res: Response) => {
  const { name, email, message, website } = req.body ?? {};

  // Honeypot — bots fill the hidden "website" field
  if (website) {
    res.json({ success: true, message: 'OK' });
    return;
  }

  const nameTrimmed    = String(name    ?? '').trim();
  const emailTrimmed   = String(email   ?? '').trim();
  const messageTrimmed = String(message ?? '').trim();

  if (!nameTrimmed || !emailTrimmed || !messageTrimmed) {
    res.status(422).json({ success: false, message: 'Заповніть всі поля.' });
    return;
  }
  if (!isValidEmail(emailTrimmed)) {
    res.status(422).json({ success: false, message: 'Невірний email.' });
    return;
  }
  if (messageTrimmed.length < 10) {
    res.status(422).json({ success: false, message: 'Повідомлення занадто коротке.' });
    return;
  }

  try {
    await smtpTransport.sendMail({
      from:    `"Landing Form" <${MAIL_FROM}>`,
      to:      MAIL_TO,
      replyTo: emailTrimmed,
      subject: `Нове повідомлення від ${nameTrimmed}`,
      text:    `Ім'я: ${nameTrimmed}\nEmail: ${emailTrimmed}\n\nПовідомлення:\n${messageTrimmed}`,
    });
    res.json({ success: true, message: 'Повідомлення надіслано!' });
  } catch (err) {
    console.error('[/api/contact] SMTP error:', err);
    res.status(500).json({ success: false, message: 'Помилка відправки. Спробуйте пізніше.' });
  }
});

/**
 * Serve static files from /browser
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html'
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
