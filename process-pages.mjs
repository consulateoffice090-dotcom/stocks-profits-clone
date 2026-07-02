/**
 * process-pages.mjs
 * Reads every HTML from scraped_pages/, strips broken CDN refs (temp/custom/*),
 * removes the inline Tailwind CDN + inline tailwind.config block,
 * removes the Alpine CDN script,
 * updates ALL internal navigation links to point to our local pages/,
 * and injects our Vite entry-point scripts.
 *
 * Run: node process-pages.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INPUT_DIR  = path.join(__dirname, 'scraped_pages');
const OUTPUT_DIR = path.join(__dirname, 'pages');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

// Map from original relative paths / route slugs -> our local page files
const LINK_MAP = {
  // absolute URL rewrites
  'https://stocks-profits.com/login':    '/pages/login.html',
  'https://stocks-profits.com/register': '/pages/register.html',
  'https://stocks-profits.com/forgot-password': '#',

  // relative-path rewrites (navigation hrefs scraped as slugs or relative paths)
  '"login"':          '"/pages/login.html"',
  '"register"':       '"/pages/register.html"',
  '"about"':          '"/pages/about.html"',
  '"automate"':       '"/pages/automate.html"',
  '"contacts"':       '"/pages/contacts.html"',
  '"copy"':           '"/pages/copy.html"',
  '"cryptocurrencies"': '"/pages/cryptocurrencies.html"',
  '"etfs"':           '"/pages/etfs.html"',
  '"faq"':            '"/pages/faq.html"',
  '"for-traders"':    '"/pages/for-traders.html"',
  '"forex"':          '"/pages/forex.html"',
  '"indices"':        '"/pages/indices.html"',
  '"regulation"':     '"/pages/regulation.html"',
  '"shares"':         '"/pages/shares.html"',
  '"trade"':          '"/pages/trade.html"',
  '"why-us"':         '"/pages/why-us.html"',
  // home
  '"/":':             '"/index.html":',
};

// Tailwind CDN script (and the inline tailwind.config script immediately after)
const CDN_TAILWIND = /<script src="https:\/\/cdn\.tailwindcss\.com"[^>]*><\/script>/gi;
const INLINE_TW_CONFIG = /<script>\s*\/\/ Set dark mode.*?tailwind\.config\s*=[\s\S]*?<\/script>/gi;

// Alpine CDN
const CDN_ALPINE = /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/alpinejs[^"]*"[^>]*><\/script>/gi;

// broken temp/custom references
const TEMP_CSS  = /<link[^>]*href="temp\/custom\/[^"]*"[^>]*>/gi;
const TEMP_JS   = /<script[^>]*src="temp\/custom\/[^"]*"[^>]*><\/script>/gi;

// gtranslate (external service we don't need)
const GTRANSLATE_DIV    = /<div class="gtranslate_wrapper"><\/div>/gi;
const GTRANSLATE_CONFIG = /<script>\s*window\.gtranslateSettings[\s\S]*?<\/script>/gi;
const GTRANSLATE_SRC    = /<script src="https:\/\/cdn\.gtranslate\.net[^"]*"[^>]*><\/script>/gi;

// service worker registration (points to missing /sw.js)
const SW_SCRIPT = /<script>\s*if\s*\('serviceWorker'\s*in\s*navigator\)[\s\S]*?<\/script>/gi;

// PWA iOS prompt block
const PWA_STYLE  = /<style>\s*\.pwa-ios-overlay[\s\S]*?<\/style>/gi;
const PWA_BLOCKS = /<div id="pwaIosOverlay"[\s\S]*?<\/div>\s*<div id="pwaIosPrompt"[\s\S]*?<\/div>\s*<\/div>/gi;
const PWA_SCRIPT = /<script>\s*\(function\s*\(\)\s*\{[\s\S]*?pwa_ios_dismissed[\s\S]*?\}\)[\s\S]*?<\/script>/gi;

// Vite entry injection — replace closing </head> with our scripts
const VITE_INJECTION = `  <script type="module" src="/main.js"></script>
</head>`;

// Also rewrite the form action on login / register forms
function rewriteFormActions(html, filename) {
  if (filename === 'login.html') {
    html = html.replace(
      /action="https:\/\/stocks-profits\.com\/login"/g,
      'id="login-form" action="#"'
    );
  }
  if (filename === 'register.html') {
    html = html.replace(
      /action="https:\/\/stocks-profits\.com\/register"/g,
      'id="register-form" action="#"'
    );
  }
  return html;
}

// Rewrite all internal hrefs that point back to stocks-profits.com
function rewriteInternalLinks(html) {
  // Rewrite absolute internal page links
  const pages = [
    'login','register','about','automate','contacts','copy',
    'cryptocurrencies','etfs','faq','for-traders','forex',
    'indices','regulation','shares','trade','why-us'
  ];

  for (const page of pages) {
    const re = new RegExp(`href="https://stocks-profits\\.com/${page}"`, 'g');
    html = html.replace(re, `href="/pages/${page}.html"`);
  }

  // Root link
  html = html.replace(/href="https:\/\/stocks-profits\.com\/?"/g, 'href="/index.html"');
  html = html.replace(/href="https:\/\/stocks-profits\.com"/g, 'href="/index.html"');

  // Bare relative slugs used in some nav hrefs like href="login"
  for (const page of pages) {
    const re = new RegExp(`href="${page}"`, 'g');
    html = html.replace(re, `href="/pages/${page}.html"`);
  }

  return html;
}

const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.html'));

for (const file of files) {
  const srcPath = path.join(INPUT_DIR, file);
  let html = fs.readFileSync(srcPath, 'utf8');

  // Strip CDNs / temp assets / clutter
  html = html.replace(CDN_TAILWIND, '');
  html = html.replace(INLINE_TW_CONFIG, '');
  html = html.replace(CDN_ALPINE, '');
  html = html.replace(TEMP_CSS, '');
  html = html.replace(TEMP_JS, '');
  html = html.replace(GTRANSLATE_DIV, '');
  html = html.replace(GTRANSLATE_CONFIG, '');
  html = html.replace(GTRANSLATE_SRC, '');
  html = html.replace(SW_SCRIPT, '');
  html = html.replace(PWA_STYLE, '');
  html = html.replace(PWA_SCRIPT, '');

  // Rewrite links
  html = rewriteInternalLinks(html);
  html = rewriteFormActions(html, file);

  // Inject Vite entry
  html = html.replace(/<\/head>/i, VITE_INJECTION);

  const destPath = path.join(OUTPUT_DIR, file);
  fs.writeFileSync(destPath, html, 'utf8');
  console.log(`✔  ${file} → pages/${file}`);
}

console.log(`\nDone! ${files.length} pages written to pages/`);
