const { isVerifiedPdf } = require('../src/verified_pdf_manifest.js');
const fs = require('fs');
const path = require('path');

const heroPath = path.join(__dirname, '..', 'src', 'engine', 'hero_launchpad.js');
const heroCode = fs.readFileSync(heroPath, 'utf8');

// Match all pdfUrl: '...' in hero_launchpad.js
const matches = [...heroCode.matchAll(/pdfUrl:\s*['"]([^'"]+)['"]/g)];
console.log(`Checking ${matches.length} pdfUrls from hero_launchpad.js:`);

const missing = [];
for (const m of matches) {
  const url = m[1];
  const ok = isVerifiedPdf(url);
  const exists = fs.existsSync(path.join(__dirname, '..', 'public', url.replace(/^\//, '')));
  console.log(`  ${ok ? '✅' : '❌'} ${url} (exists on disk: ${exists})`);
  if (!ok) missing.push(url);
}

console.log(`\nTotal unverified in manifest: ${missing.length}`);
if (missing.length) {
  console.log('Unverified URLs:', missing);
}
