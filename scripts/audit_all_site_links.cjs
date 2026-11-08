const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist') res = res.concat(walk(p));
    } else if (f.endsWith('.js') || f.endsWith('.html')) {
      res.push(p);
    }
  });
  return res;
}

const files = [...walk('src'), 'index.html'];
const regex = /href=["']([^"']+)["']/g;
const missing = new Map();

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = regex.exec(content)) !== null) {
    const raw = m[1].trim();
    if (!raw || raw.startsWith('#') || raw.startsWith('http') || raw.startsWith('mailto:') || raw.startsWith('javascript:')) continue;
    if (raw.startsWith('?view=') || raw.startsWith('/?view=')) continue;
    if (raw.includes('${')) continue; // dynamic templates checked separately

    const clean = raw.split('?')[0].split('#')[0];
    const pubPath = path.join('public', clean.replace(/^\//, ''));
    const rootPath = clean.replace(/^\//, '');

    if (!fs.existsSync(pubPath) && !fs.existsSync(rootPath)) {
      if (!missing.has(raw)) missing.set(raw, []);
      missing.get(raw).push(f);
    }
  }
});

console.log('Total static broken hrefs found:', missing.size);
for (const [href, inFiles] of missing.entries()) {
  console.log('❌ Broken:', href);
  console.log('   in:', inFiles.join(', '));
}

