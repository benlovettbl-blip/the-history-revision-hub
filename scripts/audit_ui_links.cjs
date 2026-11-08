const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(full));
    } else if (file.endsWith('.js')) {
      results.push(full);
    }
  });
  return results;
}

const jsFiles = getFiles('src');
const linkRegex = /href=["']([^"']+)["']/g;
const allLinks = [];

jsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];
    allLinks.push({ file, href });
  }
});

console.log(`Found ${allLinks.length} total href links in src/`);

// Group by type
const pdfLinks = allLinks.filter(l => l.href.includes('.pdf'));
const internalLinks = allLinks.filter(l => l.href.startsWith('/') && !l.href.includes('.pdf'));
const hashLinks = allLinks.filter(l => l.href.startsWith('#'));
const externalLinks = allLinks.filter(l => l.href.startsWith('http'));

console.log(`PDF links: ${pdfLinks.length}`);
console.log(`Internal route links: ${internalLinks.length}`);
console.log(`Hash links: ${hashLinks.length}`);
console.log(`External links: ${externalLinks.length}`);

// Audit PDF links against public/
console.log('\n=== AUDITING PDF LINKS IN src/ ===');
const missingPdfs = new Map();
pdfLinks.forEach(({ file, href }) => {
  // strip query / hash
  const cleanHref = href.split('?')[0].split('#')[0];
  if (cleanHref.includes('${')) return; // skip template literals for a moment
  const diskPath = path.join('public', cleanHref.replace(/^\//, ''));
  if (!fs.existsSync(diskPath)) {
    if (!missingPdfs.has(cleanHref)) missingPdfs.set(cleanHref, new Set());
    missingPdfs.get(cleanHref).add(file);
  }
});

for (const [pdf, sources] of missingPdfs.entries()) {
  console.log(`❌ Missing PDF: ${pdf}`);
  sources.forEach(s => console.log(`    used in: ${s}`));
}

// Audit Internal Routes
console.log('\n=== AUDITING INTERNAL ROUTE LINKS IN src/ ===');
const uniqueRoutes = [...new Set(internalLinks.map(l => l.href))];
console.log('Sample internal routes:', uniqueRoutes.slice(0, 30));

