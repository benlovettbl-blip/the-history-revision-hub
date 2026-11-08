const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist') res = res.concat(walk(p));
    } else if (f.endsWith('.js')) {
      res.push(p);
    }
  });
  return res;
}

const files = walk('src');
const dynamicRegex = /href=["']([^"']*\$\{[^"']*)["']/g;
const dynamicLinks = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = dynamicRegex.exec(content)) !== null) {
    dynamicLinks.push({ file: f, link: m[1] });
  }
});

console.log('Found dynamic template links:', dynamicLinks.length);
dynamicLinks.forEach(d => {
  console.log(`${d.file}: ${d.link}`);
});

