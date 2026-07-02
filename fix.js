import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// Broadly match any script tag that contains "temp/"
html = html.replace(/<script[^>]*temp\/[^>]*><\/script>/gi, '');

// Save it back
fs.writeFileSync('index.html', html);
console.log('Cleaned temp scripts from index.html');
