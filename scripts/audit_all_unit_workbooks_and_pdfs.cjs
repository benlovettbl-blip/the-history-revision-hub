const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const ROOT_DIR = path.join(__dirname, '..');
const workbooksZonePath = path.join(ROOT_DIR, 'src', 'workbooks_zone.js');
const content = fs.readFileSync(workbooksZonePath, 'utf8');

// We will extract UNIT_PUBLICATIONS from src/workbooks_zone.js
// or parse the pdfUrl and pages entries.
async function audit() {
  console.log('=== AUDITING ALL UNIT PUBLICATIONS IN WORKBOOKS ZONE ===\n');

  // Let's find all pdfUrl and pages occurrences in workbooks_zone.js
  const lines = content.split('\n');
  const items = [];
  let currentUnit = 'unknown';
  let currentPillar = 'unknown';
  let currentId = 'unknown';
  let currentLabel = '';
  let currentPages = '';
  let currentPdfUrl = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const unitMatch = line.match(/^\s{2}([a-z0-9_]+):\s*\{/);
    if (unitMatch && !line.includes('pillar') && !line.includes('editions')) {
      currentUnit = unitMatch[1];
    }
    const pillarMatch = line.match(/^\s{4}(pillar[123]):\s*\{/);
    if (pillarMatch) {
      currentPillar = pillarMatch[1];
    }
    const idMatch = line.match(/id:\s*['"]([^'"]+)['"]/);
    if (idMatch) currentId = idMatch[1];
    const labelMatch = line.match(/label:\s*['"]([^'"]+)['"]/);
    if (labelMatch) currentLabel = labelMatch[1];
    const pagesMatch = line.match(/pages:\s*['"]([^'"]+)['"]/);
    if (pagesMatch) currentPages = pagesMatch[1];
    const pdfMatch = line.match(/pdfUrl:\s*['"]([^'"]+)['"]/);
    if (pdfMatch) {
      currentPdfUrl = pdfMatch[1];
      items.push({
        unit: currentUnit,
        pillar: currentPillar,
        id: currentId,
        label: currentLabel,
        declaredPages: currentPages,
        pdfUrl: currentPdfUrl
      });
      currentLabel = '';
      currentPages = '';
      currentPdfUrl = '';
    }
  }

  console.log(`Found ${items.length} publications declared in src/workbooks_zone.js:\n`);

  const issues = [];

  for (const item of items) {
    const filePath = path.join(ROOT_DIR, 'public', item.pdfUrl.replace(/^\//, ''));
    if (!fs.existsSync(filePath)) {
      console.log(`❌ [${item.unit}] [${item.pillar}] [${item.id}] FILE MISSING: ${item.pdfUrl}`);
      issues.push({ ...item, issue: 'FILE_MISSING' });
      continue;
    }

    try {
      const buf = fs.readFileSync(filePath);
      const parsed = await pdf(buf);
      const actualPages = parsed.numpages;
      const sizeMB = (buf.length / (1024 * 1024)).toFixed(2);

      // Check if declaredPages contains a number that doesn't match
      const declaredNum = (item.declaredPages.match(/\d+/) || [])[0];
      let mismatch = false;
      if (declaredNum && parseInt(declaredNum, 10) !== actualPages) {
        mismatch = true;
      }

      const status = mismatch ? '⚠️ MISMATCH' : '✅ OK';
      console.log(`${status} [${item.unit}] [${item.pillar}] [${item.id}] Declared: "${item.declaredPages}" | Actual: ${actualPages}p (${sizeMB} MB) | Path: ${item.pdfUrl}`);
      if (mismatch) {
        issues.push({ ...item, actualPages, issue: 'PAGE_COUNT_MISMATCH' });
      }

      // Check if a single KT workbook has suspicious huge page count (>30 pages)
      if (item.pillar === 'pillar2' && (item.id.startsWith('KT') || item.id === 'modern' || item.id === 'medieval') && actualPages > 30) {
        console.log(`🚨 SUSPICIOUS MONOLITH [${item.unit}] [${item.id}]: ${actualPages} pages in single topic workbook!`);
        issues.push({ ...item, actualPages, issue: 'SUSPICIOUS_MONOLITH' });
      }
    } catch (e) {
      console.log(`❌ ERROR reading PDF ${item.pdfUrl}: ${e.message}`);
      issues.push({ ...item, issue: 'CORRUPT_OR_UNREADABLE' });
    }
  }

  console.log('\n=== AUDITING PUBLIC/UNITS FOR STALE / LEGACY PDF FILES ===\n');
  const unitsDir = path.join(ROOT_DIR, 'public', 'units');
  if (fs.existsSync(unitsDir)) {
    const subdirs = fs.readdirSync(unitsDir);
    for (const sub of subdirs) {
      const subPath = path.join(unitsDir, sub);
      if (fs.statSync(subPath).isDirectory()) {
        const files = fs.readdirSync(subPath).filter(f => f.endsWith('.pdf'));
        for (const f of files) {
          const fullPath = path.join(subPath, f);
          const stat = fs.statSync(fullPath);
          const buf = fs.readFileSync(fullPath);
          try {
            const parsed = await pdf(buf);
            const pCount = parsed.numpages;
            const sizeMB = (buf.length / (1024 * 1024)).toFixed(2);
            // If page count > 30 or file modified before Sept 2026, flag for inspection
            const mtime = stat.mtime.toISOString().slice(0, 10);
            console.log(`  [units/${sub}/${f}] ${pCount}p | ${sizeMB} MB | mtime: ${mtime}`);
            if (pCount > 30 && (f.includes('KT') || f.includes('workbook'))) {
              console.log(`    ⚠️ Warning: legacy continuous file? (${pCount} pages)`);
            }
          } catch (e) {
            console.log(`  [units/${sub}/${f}] Error: ${e.message}`);
          }
        }
      }
    }
  }

  console.log('\n=== SUMMARY OF ISSUES FOUND ===');
  console.log(`Total issues: ${issues.length}`);
  for (const iss of issues) {
    console.log(`- [${iss.unit}] ${iss.pillar} (${iss.id}): declared "${iss.declaredPages}", actual ${iss.actualPages}p -> ${iss.pdfUrl} [${iss.issue}]`);
  }
}

audit();

