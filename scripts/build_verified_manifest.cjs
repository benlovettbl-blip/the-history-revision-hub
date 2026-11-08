const fs = require('fs');
const path = require('path');

function getPdfs(dir) {
  let res = [];
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      res = res.concat(getPdfs(full));
    } else if (f.endsWith('.pdf')) {
      const rel = '/' + full.split(path.sep).join('/').replace(/^public\//, '');
      res.push(rel);
    }
  });
  return res;
}

const list = getPdfs('public');
console.log('Total verified PDFs in public/:', list.length);

const code = `// Auto-generated verified static PDF manifest
export const VERIFIED_PDFS = new Set(${JSON.stringify(list, null, 2)});

export function isVerifiedPdf(url) {
  if (!url || typeof url !== 'string' || url.endsWith('.html') || url === '#') return false;
  const clean = '/' + url.replace(/^\\//, '').split('?')[0].split('#')[0];
  return VERIFIED_PDFS.has(clean);
}
`;

fs.writeFileSync('src/verified_pdf_manifest.js', code);
console.log('Successfully written src/verified_pdf_manifest.js');

