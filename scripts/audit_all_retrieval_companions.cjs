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
    name: 'KS2: World War II Quiz Pack',
    file: 'ks2_ww2_quiz_pack.pdf',
    expectedPages: 4,
    sheets: 1,
  },

  // Key Stage 3 (8 Pages)
  {
    tier: 'KS3',
    name: 'Causes of the Great War',
    file: 'Causes_of_the_Great_War_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'The Course of the Great War',
    file: 'The_Course_of_the_Great_War_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'Medieval England',
    file: 'Medieval_England_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'Crown, Church or Parliament',
    file: 'Crown_Church_or_Parliament_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'The First British Empire',
    file: 'The_First_British_Empire_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'The Second British Empire',
    file: 'The_Second_British_Empire_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'Industrialisation, Power & Protest',
    file: 'Industrialisation_Power_and_Protest_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'The Shoah / Holocaust',
    file: 'The_Shoah_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'Water & Sanitation Through Time',
    file: 'Water_and_Sanitation_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'Rights, Protest & Post-War Britain',
    file: 'Post_War_Britain_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'KS3',
    name: 'The History of Australia',
    file: 'History_of_Australia_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },

  // GCSE / Key Stage 4
  {
    tier: 'GCSE',
    name: 'Conflict in the Middle East',
    file: 'Conflict_in_the_Middle_East_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 16,
    sheets: 4,
  },
  {
    tier: 'GCSE',
    name: 'Weimar & Nazi Germany',
    file: 'Weimar_and_Nazi_Germany_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 16,
    sheets: 4,
  },
  {
    tier: 'GCSE',
    name: 'Early Elizabethan England',
    file: 'Early_Elizabethan_England_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 16,
    sheets: 4,
  },
  {
    tier: 'GCSE',
    name: 'Medicine Through Time (Thematic)',
    file: 'Medicine_Through_Time_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 16,
    sheets: 4,
  },
  {
    tier: 'GCSE',
    name: 'Medicine: Western Front Environment',
    file: 'Western_Front_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 8,
    sheets: 2,
  },
  {
    tier: 'GCSE',
    name: 'Superpower Relations & Cold War',
    file: 'Superpower_Relations_and_Cold_War_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 16,
    sheets: 4,
  },
  {
    tier: 'GCSE',
    name: 'USA: Conflict at Home & Abroad',
    file: 'USA_1954_1975_Master_Knowledge_Retrieval_Companion.pdf',
    expectedPages: 24,
    sheets: 6,
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
