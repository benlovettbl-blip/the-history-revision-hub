const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === '.gemini') continue;
    try {
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walk(filePath, fileList);
      } else if (file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.html') || file.endsWith('.cjs')) {
        fileList.push(filePath);
      }
    } catch(e) {}
  }
  return fileList;
}

const files = walk('.');
const pdfRegex = /['"\(](\/pdfs\/[^'"\)\s#\?]+\.pdf)['"\)]/g;
const brokenPdfs = new Map();
const foundPdfs = new Map();

for (const f of files) {
  if (f.includes('scripts' + path.sep + 'audit_all_links.cjs')) continue;
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = pdfRegex.exec(content)) !== null) {
    const url = match[1];
    const diskPath = path.join('public', url.replace(/^\//, ''));
    if (!fs.existsSync(diskPath)) {
      if (!brokenPdfs.has(url)) brokenPdfs.set(url, new Set());
      brokenPdfs.get(url).add(f);
    } else {
      if (!foundPdfs.has(url)) foundPdfs.set(url, new Set());
      foundPdfs.get(url).add(f);
    }
  }
}

console.log('=== BROKEN PDF LINKS AUDIT ===');
for (const [url, locations] of brokenPdfs.entries()) {
  console.log(`\n❌ BROKEN URL: ${url}`);
  locations.forEach(loc => console.log(`   in file: ${loc}`));
}
console.log(`\nTotal broken unique PDF URLs: ${brokenPdfs.size}`);
console.log(`Total valid unique PDF URLs: ${foundPdfs.size}`);

