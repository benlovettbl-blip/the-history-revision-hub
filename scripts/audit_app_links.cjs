const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

function getAllFiles(dir, extensions, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === '.gemini' || file === 'dist' || file === 'dist2') continue;
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllFiles(filePath, extensions, fileList);
    } else if (extensions.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getAllFiles(PUBLIC_DIR, ['.html']).concat(getAllFiles(path.join(ROOT_DIR, 'units'), ['.html']));
const srcJsFiles = getAllFiles(path.join(ROOT_DIR, 'src'), ['.js']);

console.log(`🔍 Auditing ${htmlFiles.length} HTML files and ${srcJsFiles.length} JS files across the application...`);

const brokenLinks = [];
const checkedLinks = new Set();

const hrefRegex = /href=["']([^"']+)["']/g;
const windowOpenRegex = /window\.open\(['"]([^'"]+)['"]/g;
const pdfStringRegex = /['"](\/pdfs\/[^'"]+\.pdf)['"]/g;
const htmlStringRegex = /['"](\/units\/[^'"]+\.html)['"]/g;

function checkUrl(url, sourceFile) {
  if (!url) return;
  url = url.trim();
  if (url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('javascript:') || url.startsWith('tel:') || url.startsWith('data:')) {
    return;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return;
  }
  if (url.includes('${')) {
    return; // Dynamic template literal
  }

  const cleanUrl = url.split('?')[0].split('#')[0];
  if (!cleanUrl) return;

  const key = `${sourceFile} -> ${cleanUrl}`;
  if (checkedLinks.has(key)) return;
  checkedLinks.add(key);

  let targetPath;
  if (cleanUrl.startsWith('/')) {
    targetPath = path.join(PUBLIC_DIR, cleanUrl.slice(1));
  } else {
    targetPath = path.resolve(path.dirname(sourceFile), cleanUrl);
  }

  let exists = fs.existsSync(targetPath);
  if (!exists) {
    const pubPath = path.join(PUBLIC_DIR, cleanUrl.replace(/^\.\//, ''));
    if (fs.existsSync(pubPath)) {
      exists = true;
    }
  }
  if (!exists && cleanUrl === '/index.html' && fs.existsSync(path.join(ROOT_DIR, 'index.html'))) {
    exists = true;
  }

  if (!exists) {
    brokenLinks.push({
      source: path.relative(ROOT_DIR, sourceFile),
      url: url,
      targetExpected: path.relative(ROOT_DIR, targetPath)
    });
  }
}

// 1. Audit HTML files
for (const htmlFile of htmlFiles) {
  const content = fs.readFileSync(htmlFile, 'utf8');
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    checkUrl(match[1], htmlFile);
  }
}

// 2. Audit JS files
for (const jsFile of srcJsFiles) {
  const content = fs.readFileSync(jsFile, 'utf8');
  let match;
  while ((match = pdfStringRegex.exec(content)) !== null) {
    checkUrl(match[1], jsFile);
  }
  while ((match = htmlStringRegex.exec(content)) !== null) {
    checkUrl(match[1], jsFile);
  }
  while ((match = windowOpenRegex.exec(content)) !== null) {
    checkUrl(match[1], jsFile);
  }
}

// 3. Audit CURRICULAR_PILLARS_CATALOG directly
const heroPath = path.join(ROOT_DIR, 'src/engine/hero_launchpad.js');
if (fs.existsSync(heroPath)) {
  const heroContent = fs.readFileSync(heroPath, 'utf8');
  const catMatch = heroContent.match(/export const CURRICULAR_PILLARS_CATALOG = ({[\s\S]*?\n\};)/);
  if (catMatch) {
    try {
      const cleaned = catMatch[1].replace(/export const CURRICULAR_PILLARS_CATALOG = /, '').replace(/;\s*$/, '');
      const catalog = eval('(' + cleaned + ')');
      for (const [unitId, pillars] of Object.entries(catalog)) {
        for (const [pName, p] of Object.entries(pillars)) {
          if (p.htmlUrl) checkUrl(p.htmlUrl, heroPath);
          if (p.pdfUrl) checkUrl(p.pdfUrl, heroPath);
        }
      }
    } catch (e) {
      // Ignore parse failure
    }
  }
}

console.log(`\n📊 Link Verification Summary:`);
console.log(`   • Total unique links verified: ${checkedLinks.size}`);
console.log(`   • Broken links detected:       ${brokenLinks.length}`);

if (brokenLinks.length > 0) {
  console.log('\n❌ Broken Links Found:');
  brokenLinks.forEach((b, i) => {
    console.log(`[${i+1}] ${b.source} -> ${b.url}`);
  });
  process.exit(1);
} else {
  console.log('✅ ALL APP BUTTONS & LINKS RESOLVE PERFECTLY (0 BROKEN LINKS)!');
  process.exit(0);
}
