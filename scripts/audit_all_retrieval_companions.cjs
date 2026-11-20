/**
 * scripts/audit_all_retrieval_companions.cjs
 *
 * Master Knowledge Retrieval Companion Physical Print & Page Budget Audit
 *
 * Enforces Zero-Spillover Architecture across all Key Stages:
 * 1. Physical PDF inspection with `pdf-parse` (bypassing Skia print-engine traps).
 * 2. Strict adherence to folded-A3 saddle-stitch architecture:
 *    - Key Stage 2: Exactly 4 Pages (1 sheet)
 *    - Key Stage 3: Exactly 8 Pages (2 sheets)
 *    - GCSE / KS4: Exactly 8, 16, or 24 Pages (2, 4, or 6 sheets)
 * 3. Asserts 0 accidental trailing or overflow pages (`numpages % 4 === 0`).
 *
 * Usage:
 *   node scripts/audit_all_retrieval_companions.cjs
 */

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const ROOT_DIR = path.resolve(__dirname, '..');
const PDFS_DIR = path.join(ROOT_DIR, 'public', 'pdfs');

// Defined catalog of Master Knowledge Retrieval Companions & Quiz Packs
const COMPANIONS_CATALOG = [
  // Key Stage 2 (4 Pages)
  {
    tier: 'KS2',
    name: 'KS2: World War II Retrieval Companion',
    file: 'ks2_ww2_retrieval_companion.pdf',
    expectedPages: 4,
    sheets: 1,
  },

  // Key Stage 3 (8–12 Pages)
  {
    tier: 'KS3',
    name: 'Causes of the Great War',
    file: 'great_war_retrieval_companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'The Course of the Great War',
    file: 'great_war_part2_retrieval_companion.pdf',
    expectedPages: 12,
    sheets: 3,
  },
  {
    tier: 'KS3',
    name: 'Medieval England',
    file: 'medieval_england_retrieval_companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'Crown, Church or Parliament',
    file: 'monarchy_religion_power_retrieval_companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'The First British Empire',
    file: 'first_british_empire_retrieval_companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'The Second British Empire',
    file: 'second_british_empire_retrieval_companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'Industrialisation, Power & Protest',
    file: 'industrialisation_and_empire_retrieval_companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'The Shoah / Holocaust',
    file: 'the_shoah_retrieval_companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'Water & Sanitation Through Time',
    file: 'water_and_sanitation_retrieval_companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'Rights, Protest & Post-War Britain',
    file: 'post_war_britain_retrieval_companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'The History of Australia',
    file: 'australia_retrieval_companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },

  // GCSE / Key Stage 4
  {
    tier: 'GCSE',
    name: 'Conflict in the Middle East',
    file: 'cme_new_retrieval_companion.pdf',
    expectedPages: 16,
    sheets: 4,
  },
  {
    tier: 'GCSE',
    name: 'Medicine Through Time (Thematic)',
    file: 'edexcel_medicine_retrieval_companion.pdf',
    expectedPages: 16,
    sheets: 4,
  },
  {
    tier: 'GCSE',
    name: 'Medicine: Western Front Environment',
    file: 'edexcel_medicine_western_front_retrieval_companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'GCSE',
    name: 'Superpower Relations & Cold War',
    file: 'cold_war_retrieval_companion.pdf',
    expectedPages: 16,
    sheets: 4,
  },
];

async function runAudit() {
  console.log('='.repeat(88));
  console.log(
    '📚 THE HISTORY REVISION HUB — MASTER KNOWLEDGE RETRIEVAL COMPANION REPROGRAPHICS AUDIT',
  );
  console.log('='.repeat(88));

  const table = [];
  let allPassed = true;
  let totalPages = 0;
  let totalSheets = 0;

  for (const item of COMPANIONS_CATALOG) {
    const fullPath = path.join(PDFS_DIR, item.file);
    if (!fs.existsSync(fullPath)) {
      console.warn(`❌ Missing PDF: ${item.file}`);
      table.push({
        Tier: item.tier,
        Companion: item.name,
        'Page Budget': `0/${item.expectedPages}`,
        'Saddle-Stitch': 'Missing',
        Status: '❌ MISSING',
      });
      allPassed = false;
      continue;
    }

    const dataBuffer = fs.readFileSync(fullPath);
    const pdfData = await pdfParse(dataBuffer);
    const actualPages = pdfData.numpages;
    const actualSheets = actualPages / 4;
    const isMultipleOf4 = actualPages % 4 === 0;
    const pageCountPass = actualPages === item.expectedPages;

    const pass = isMultipleOf4 && pageCountPass;
    if (!pass) allPassed = false;

    totalPages += actualPages;
    totalSheets += actualSheets;

    table.push({
      Tier: item.tier,
      Companion: item.name,
      'Page Budget': `${actualPages}/${item.expectedPages}p`,
      'Saddle-Stitch': `✅ ${actualSheets} sheets`,
      Size: `${(dataBuffer.length / 1024).toFixed(0)} KB`,
      Status: pass ? '✅ OPTIMAL' : '❌ FAIL',
    });
  }

  console.table(table);
  console.log('='.repeat(88));
  console.log(`📊 AUDIT SUMMARY:`);
  console.log(`   Total Retrieval Companions Audited : ${COMPANIONS_CATALOG.length}`);
  console.log(`   Total Physical Pages Verified      : ${totalPages} pages`);
  console.log(`   Total Folded A3 Print Sheets       : ${totalSheets} sheets`);
  console.log(`   Zero-Spillover Architecture Status : ${allPassed ? '✅ 100% PASS' : '❌ FAIL'}`);
  console.log('='.repeat(88));

  if (!allPassed) {
    process.exit(1);
  }
}

if (require.main === module) {
  runAudit().catch((err) => {
    console.error('Fatal audit error:', err);
    process.exit(1);
  });
}

module.exports = { runAudit, COMPANIONS_CATALOG };
