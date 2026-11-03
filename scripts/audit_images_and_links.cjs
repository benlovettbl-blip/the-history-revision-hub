const fs = require('fs');
const path = require('path');

console.log('========================================================================');
console.log('🖼️ AUDIT 1: VERIFYING ALL IMAGE ASSETS IN MOCK PAPERS');
console.log('========================================================================');

const rawDirs = [
  'data/raw_mocks/usa',
  'data/raw_mocks/weimar_nazi_germany',
  'data/raw_mocks/edexcel_medicine',
  'data/raw_mocks/cme_new',
  'data/raw_mocks/eee'
];

let totalImgs = 0;
let missingImgs = 0;

for (const dir of rawDirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  for (const f of files) {
    const html = fs.readFileSync(path.join(dir, f), 'utf8');
    const regex = /<img[^>]+src=["']([^"']+)["']/gi;
    let m;
    while ((m = regex.exec(html)) !== null) {
      totalImgs++;
      let src = m[1];
      src = src.replace(/^http:\/\/localhost:\d+\/?/, '');
      src = src.replace(/^\/+/, '');
      const localPath = path.join('public', src);
      if (!fs.existsSync(localPath)) {
        console.log(`❌ MISSING IMAGE in ${f}: "${src}" -> expected at ${localPath}`);
        missingImgs++;
      } else {
        const sz = fs.statSync(localPath).size;
        console.log(`  ✅ Image found: ${f} -> ${src} (${sz} bytes)`);
      }
    }
  }
}
console.log(`Image check complete. Total images: ${totalImgs}, Missing: ${missingImgs}\n`);

console.log('========================================================================');
console.log('🔗 AUDIT 2: VERIFYING IN-APP DOWNLOAD LINKS FOR ALL MOCKS');
console.log('========================================================================');

// Look at src/mock_exam_data.js or department_portal.js or where mock links are defined
const searchPaths = [
  'src/data/mock_exam_papers.js',
  'src/mock_exam_data.js',
  'src/components/DepartmentPortal.jsx',
  'src/components/department_portal.js',
  'data/mock_exam_registry.json',
  'scripts/mock_registry.json'
];

let deadLinks = 0;
let checkedLinks = 0;

function checkTextForLinks(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  // Match any /pdfs/mocks/... or pdfs/mocks/...
  const linkRegex = /(?:\/)?pdfs\/mocks\/[a-zA-Z0-9_\-\.\/]+\.pdf/g;
  const matches = text.match(linkRegex) || [];
  for (const m of matches) {
    checkedLinks++;
    const clean = m.replace(/^\/+/, '');
    const full = path.join('public', clean);
    if (!fs.existsSync(full)) {
      console.log(`❌ DEAD LINK in ${filePath}: ${m} -> File does not exist on disk!`);
      deadLinks++;
    }
  }
}

for (const p of searchPaths) {
  checkTextForLinks(p);
}

// Also check all files in src/
function walkSrc(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) walkSrc(full);
    else if (it.isFile() && (it.name.endsWith('.js') || it.name.endsWith('.jsx') || it.name.endsWith('.ts') || it.name.endsWith('.tsx') || it.name.endsWith('.html'))) {
      checkTextForLinks(full);
    }
  }
}
walkSrc('src');

console.log(`Link check complete. Checked links: ${checkedLinks}, Dead links: ${deadLinks}\n`);
