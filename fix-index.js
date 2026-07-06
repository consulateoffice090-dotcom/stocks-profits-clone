import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const pages = [
  'login','register','about','automate','contacts','copy',
  'cryptocurrencies','etfs','faq','for-traders','forex',
  'indices','regulation','shares','trade','why-us', 'dashboard'
];

for (const page of pages) {
  const re = new RegExp(`href="${page}"`, 'g');
  html = html.replace(re, `href="/pages/${page}.html"`);
  
  const re2 = new RegExp(`href="https://stocks-profits\\.com/${page}"`, 'g');
  html = html.replace(re2, `href="/pages/${page}.html"`);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed index.html links');
