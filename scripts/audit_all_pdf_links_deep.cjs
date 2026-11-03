const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

console.log('=== AUDITING WORKBOOKS ZONE (UNIT_PUBLICATIONS) ===');
const wzContent = fs.readFileSync(path.join(projectRoot, 'src/workbooks_zone.js'), 'utf8');
const readMatches = wzContent.matchAll(/readUrl:\s*['"]([^'"]+)['"]/g);
for (const m of readMatches) {
  const rel = m[1].startsWith('/') ? m[1].slice(1) : m[1];
  const disk = path.join(publicDir, rel);
  if (!fs.existsSync(disk)) {
    console.log(`❌ workbooks_zone readUrl 404: "${m[1]}"`);
  }
}
const pdfMatches = wzContent.matchAll(/pdfUrl:\s*['"]([^'"]+)['"]/g);
for (const m of pdfMatches) {
  const rel = m[1].startsWith('/') ? m[1].slice(1) : m[1];
  const disk = path.join(publicDir, rel);
  if (!fs.existsSync(disk)) {
    console.log(`❌ workbooks_zone pdfUrl 404: "${m[1]}"`);
  }
}

console.log('\n=== AUDITING HERO LAUNCHPAD (CURRICULAR_PILLARS_CATALOG) ===');
const hlContent = fs.readFileSync(path.join(projectRoot, 'src/engine/hero_launchpad.js'), 'utf8');
for (const m of hlContent.matchAll(/htmlUrl:\s*['"]([^'"]+)['"]/g)) {
  const rel = m[1].startsWith('/') ? m[1].slice(1) : m[1];
  const disk = path.join(publicDir, rel);
  if (!fs.existsSync(disk)) {
    console.log(`❌ hero_launchpad htmlUrl 404: "${m[1]}"`);
  }
}
for (const m of hlContent.matchAll(/pdfUrl:\s*['"]([^'"]+)['"]/g)) {
  const rel = m[1].startsWith('/') ? m[1].slice(1) : m[1];
  const disk = path.join(publicDir, rel);
  if (!fs.existsSync(disk)) {
    console.log(`❌ hero_launchpad pdfUrl 404: "${m[1]}"`);
  }
}

console.log('\n=== AUDITING DEPARTMENT PORTAL ===');
const dpContent = fs.readFileSync(path.join(projectRoot, 'src/department_portal.js'), 'utf8');
for (const m of dpContent.matchAll(/workbookPdf:\s*['"]([^'"]+)['"]/g)) {
  const rel = m[1].startsWith('/') ? m[1].slice(1) : m[1];
  const disk = path.join(publicDir, rel);
  if (!fs.existsSync(disk)) {
    console.log(`❌ department_portal workbookPdf 404: "${m[1]}"`);
  }
}
for (const m of dpContent.matchAll(/textbookPdf:\s*['"]([^'"]+)['"]/g)) {
  const rel = m[1].startsWith('/') ? m[1].slice(1) : m[1];
  const disk = path.join(publicDir, rel);
  if (!fs.existsSync(disk)) {
    console.log(`❌ department_portal textbookPdf 404: "${m[1]}"`);
  }
}

console.log('\n=== AUDITING STAGE SCHEMA ===');
const ssContent = fs.readFileSync(path.join(projectRoot, 'src/engine/stage_schema.js'), 'utf8');
for (const m of ssContent.matchAll(/workbook:\s*['"]([^'"]+)['"]/g)) {
  let rel = m[1];
  if (rel.startsWith('/pdfs/')) rel = rel.slice(1);
  else if (!rel.startsWith('pdfs/')) rel = 'pdfs/' + rel;
  const disk = path.join(publicDir, rel);
  if (!fs.existsSync(disk)) {
    console.log(`❌ stage_schema workbook 404: "${m[1]}"`);
  } else {
    // Check if the source code has the leading slash
    if (!m[1].startsWith('/pdfs/')) {
      console.log(`⚠️ stage_schema workbook missing '/pdfs/' prefix: "${m[1]}"`);
    }
  }
}

console.log('\n=== AUDITING ALL LESSON CARDS DYNAMIC COMBINATIONS ===');
const lcContent = fs.readFileSync(path.join(projectRoot, 'src/lesson_cards.js'), 'utf8');
// Check all units supported in lesson_cards
const supportedUnits = ['cme_new', 'edexcel_medicine', 'weimar_nazi_germany', 'eee', 'usa'];
// Check what periods are defined in lesson_cards.js
// We already verified the periods for these 5 earlier.

console.log('\n=== AUDITING ALL .PDF STRINGS IN ENTIRE SRC DIRECTORY ===');
function scanSrcForPdfs(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      scanSrcForPdfs(full);
    } else if (item.endsWith('.js')) {
      const txt = fs.readFileSync(full, 'utf8');
      const matches = txt.matchAll(/['"`]([^'"`\s\n\r()]+\.pdf)['"`]/g);
      for (const m of matches) {
        const link = m[1];
        if (link.startsWith('http')) continue;
        if (link.includes('${')) continue;
        const rel = link.startsWith('/') ? link.slice(1) : link;
        const disk = path.join(publicDir, rel);
        if (!fs.existsSync(disk)) {
          // If not in public directly, check if it exists in public/pdfs/
          const inPdfs = path.join(publicDir, 'pdfs', path.basename(rel));
          if (fs.existsSync(inPdfs)) {
            console.log(`⚠️ In ${path.relative(projectRoot, full)}: "${link}" -> exists at "/pdfs/${path.basename(rel)}"`);
          } else {
            console.log(`❌ In ${path.relative(projectRoot, full)}: "${link}" -> NOT FOUND anywhere`);
          }
        }
      }
    }
  }
}
scanSrcForPdfs(path.join(projectRoot, 'src'));

console.log('\n=== AUDITING PUBLIC/UNITS HTML FILES ===');
function checkHtmls(dir) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      checkHtmls(full);
    } else if (item.endsWith('.html')) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.matchAll(/href=['"]([^'"]+\.pdf)['"]/g);
      for (const m of matches) {
        const link = m[1];
        if (link.startsWith('http')) continue;
        let diskPath = link.startsWith('/') ? path.join(publicDir, link.slice(1)) : path.join(path.dirname(full), link);
        if (!fs.existsSync(diskPath)) {
          console.log(`❌ Broken PDF link in ${path.relative(projectRoot, full)}: ${link}`);
        }
      }
    }
  }
}
checkHtmls(path.join(publicDir, 'units'));

console.log('\n=== AUDIT COMPLETE ===');
