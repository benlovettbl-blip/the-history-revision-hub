/**
 * scripts/audit_all_mocks.cjs
 *
 * Comprehensive reprographics audit verifying that 100% of predicted mock exams
 * across all GCSE units have exact physical page counts matching official Pearson Edexcel standards:
 * - CME (Booklet P5): exactly 12 pages
 * - EEE (Booklet B4): exactly 12 pages
 * - Medicine (1HI0/11): exactly 16p QP, 4p SB, 20p Complete Pack
 * - Weimar (1HI0/31): exactly 16p QP, 4p SB, 20p Complete Pack
 * - USA (1HI0/33): exactly 16p QP, 4p SB, 20p Complete Pack
 */

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const BASE_DIR = path.join(__dirname, '..', 'public', 'pdfs', 'mocks');

const TARGETS = {
  cold_war: {
    mocks: ['cold_war_mock_a.pdf', 'cold_war_mock_b.pdf', 'cold_war_mock_c.pdf', 'cold_war_mock_radar.pdf'],
    expected: 12,
    type: 'Paper 2 Period Study (12p Booklet)'
  },
  cme_new: {
    mocks: ['cme_mock_a.pdf', 'cme_mock_b.pdf', 'cme_mock_c.pdf', 'cme_mock_d.pdf', 'cme_mock_e.pdf', 'cme_mock_radar.pdf'],
    expected: 12,
    type: 'Paper 2 Period Study (12p Booklet)'
  },
  eee: {
    mocks: ['eee_mock_2026.pdf', 'eee_mock_b.pdf', 'eee_mock_c.pdf', 'eee_mock_d.pdf', 'eee_notebook_1.pdf', 'eee_notebook_2.pdf', 'eee_notebook_3.pdf'],
    expected: 12,
    type: 'Paper 2 British Depth Study (12p Booklet)'
  },
  edexcel_medicine: {
    qp: ['mock_2025_clone_question_booklet.pdf', 'mock_a_2026_predict_question_booklet.pdf', 'mock_b_2026_predict_question_booklet.pdf', 'mock_c_2026_predict_question_booklet.pdf'],
    sb: ['mock_2025_clone_sources_booklet.pdf', 'mock_a_2026_predict_sources_booklet.pdf', 'mock_b_2026_predict_sources_booklet.pdf', 'mock_c_2026_predict_sources_booklet.pdf'],
    pack: ['mock_2025_clone.pdf', 'mock_a_2026_predict.pdf', 'mock_b_2026_predict.pdf', 'mock_c_2026_predict.pdf'],
    type: 'Paper 1 (16p QP + 4p SB = 20p Pack)'
  },
  weimar_nazi_germany: {
    qp: ['mock_notebook_1_question_booklet.pdf', 'mock_notebook_2_question_booklet.pdf', 'mock_notebook_3_question_booklet.pdf', 'mock_adapted_2026_question_booklet.pdf'],
    sb: ['mock_notebook_1_sources_booklet.pdf', 'mock_notebook_2_sources_booklet.pdf', 'mock_notebook_3_sources_booklet.pdf', 'mock_adapted_2026_sources_booklet.pdf'],
    pack: ['mock_notebook_1.pdf', 'mock_notebook_2.pdf', 'mock_notebook_3.pdf', 'mock_adapted_2026.pdf'],
    type: 'Paper 3 Modern Depth Study (16p QP + 4p SB = 20p Pack)'
  },
  usa: {
    qp: Array.from({ length: 13 }, (_, i) => `usa_mock_${i + 1}_question_booklet.pdf`),
    sb: Array.from({ length: 13 }, (_, i) => `usa_mock_${i + 1}_sources_booklet.pdf`),
    pack: Array.from({ length: 13 }, (_, i) => `usa_mock_${i + 1}.pdf`),
    type: 'Paper 3 Modern Depth Study (16p QP + 4p SB = 20p Pack)'
  }
};

async function audit() {
  console.log('🔍 Auditing 100% of GCSE Mock Exam Reprographics Across All Units...\n');
  let totalChecked = 0;
  let totalPassed = 0;
  let errors = [];

  for (const [unitId, cfg] of Object.entries(TARGETS)) {
    console.log(`📦 [${unitId.toUpperCase()}] ${cfg.type}`);
    const unitDir = path.join(BASE_DIR, unitId);

    if (cfg.mocks) {
      for (const file of cfg.mocks) {
        totalChecked++;
        const p = path.join(unitDir, file);
        if (!fs.existsSync(p)) {
          errors.push(`Missing file: ${unitId}/${file}`);
          console.log(`  ❌ ${file} -> NOT FOUND`);
          continue;
        }
        const data = await pdf(fs.readFileSync(p));
        if (data.numpages === cfg.expected) {
          totalPassed++;
          console.log(`  ✅ ${file} -> ${data.numpages}p (OK)`);
        } else {
          errors.push(`${unitId}/${file} has ${data.numpages}p (expected ${cfg.expected}p)`);
          console.log(`  ❌ ${file} -> ${data.numpages}p (EXPECTED ${cfg.expected}p)`);
        }
      }
    } else {
      // QP (16p)
      for (const file of cfg.qp) {
        totalChecked++;
        const p = path.join(unitDir, file);
        if (!fs.existsSync(p)) {
          errors.push(`Missing file: ${unitId}/${file}`);
          console.log(`  ❌ QP ${file} -> NOT FOUND`);
          continue;
        }
        const data = await pdf(fs.readFileSync(p));
        if (data.numpages === 16) {
          totalPassed++;
          console.log(`  ✅ QP: ${file} -> ${data.numpages}p (OK)`);
        } else {
          errors.push(`${unitId}/${file} has ${data.numpages}p (expected 16p)`);
          console.log(`  ❌ QP: ${file} -> ${data.numpages}p (EXPECTED 16p)`);
        }
      }

      // SB (4p)
      for (const file of cfg.sb) {
        totalChecked++;
        const p = path.join(unitDir, file);
        if (!fs.existsSync(p)) {
          errors.push(`Missing file: ${unitId}/${file}`);
          console.log(`  ❌ SB ${file} -> NOT FOUND`);
          continue;
        }
        const data = await pdf(fs.readFileSync(p));
        if (data.numpages === 4) {
          totalPassed++;
          console.log(`  ✅ SB: ${file} -> ${data.numpages}p (OK)`);
        } else {
          errors.push(`${unitId}/${file} has ${data.numpages}p (expected 4p)`);
          console.log(`  ❌ SB: ${file} -> ${data.numpages}p (EXPECTED 4p)`);
        }
      }

      // Complete Pack (20p)
      for (const file of cfg.pack) {
        totalChecked++;
        const p = path.join(unitDir, file);
        if (!fs.existsSync(p)) {
          errors.push(`Missing file: ${unitId}/${file}`);
          console.log(`  ❌ Pack ${file} -> NOT FOUND`);
          continue;
        }
        const data = await pdf(fs.readFileSync(p));
        if (data.numpages === 20) {
          totalPassed++;
          console.log(`  ✅ Pack: ${file} -> ${data.numpages}p (OK)`);
        } else {
          errors.push(`${unitId}/${file} has ${data.numpages}p (expected 20p)`);
          console.log(`  ❌ Pack: ${file} -> ${data.numpages}p (EXPECTED 20p)`);
        }
      }
    }
    console.log('');
  }

  console.log(`==================================================`);
  console.log(`AUDIT SUMMARY: ${totalPassed}/${totalChecked} files PASSED`);
  if (errors.length > 0) {
    console.error(`🚨 ${errors.length} ERRORS DETECTED:`);
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  } else {
    console.log(`🎉 100% REPROGRAPHIC COMPLIANCE! All mocks strictly adhere to official Pearson page budgets.`);
  }
}

audit().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
