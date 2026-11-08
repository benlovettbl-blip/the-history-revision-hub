const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('src/workbooks_zone.js', 'utf8');

// Match readUrl: '...' and pdfUrl: '...'
const readUrlMatches = [...content.matchAll(/readUrl:\s*['"`]([^'"`]+)['"`]/g)].map(m => m[1]);
const pdfUrlMatches = [...content.matchAll(/pdfUrl:\s*['"`]([^'"`]+)['"`]/g)].map(m => m[1]);

console.log('=== AUDITING WORKBOOKS ZONE READ URLS ===');
const missingReadUrls = new Set();
readUrlMatches.forEach(url => {
  if (url.includes('${')) return;
  const diskPath = path.join('public', url.replace(/^\//, ''));
  const rootPath = url.replace(/^\//, '');
  if (!fs.existsSync(diskPath) && !fs.existsSync(rootPath)) {
    missingReadUrls.add(url);
  }
});
console.log('Missing readUrls count:', missingReadUrls.size);
missingReadUrls.forEach(u => console.log('  ❌ Missing readUrl:', u));

console.log('\n=== AUDITING WORKBOOKS ZONE PDF URLS ===');
const missingPdfUrls = new Set();
pdfUrlMatches.forEach(url => {
  if (url.includes('${')) return;
  const diskPath = path.join('public', url.replace(/^\//, ''));
  if (!fs.existsSync(diskPath)) {
    missingPdfUrls.add(url);
  }
});
console.log('Missing pdfUrls count:', missingPdfUrls.size);
missingPdfUrls.forEach(u => console.log('  ❌ Missing pdfUrl:', u));

