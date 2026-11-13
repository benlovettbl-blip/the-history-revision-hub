/**
 * scripts/render_eee_twopage_workbook.cjs
 *
 * Golden-Template Pupil Workbook Compiler for Early Elizabethan England, 1558–88
 * (Pearson Edexcel GCSE History Paper 2, Option B4 — 1HI0/B4).
 *
 * Compiles:
 *  - KT1: Queen, Government and Religion, 1558–69 (16 Pages)
 *  - KT2: Challenges to Elizabeth at Home and Abroad, 1569–88 (16 Pages)
 *  - KT3: Elizabethan Society in the Age of Exploration, 1558–88 (16 Pages)
 *  (Zero combined master workbook — strictly three 16-page A4 saddle-stitch booklets.)
 *
 * Usage:
 *   node scripts/render_eee_twopage_workbook.cjs KT1
 *   node scripts/render_eee_twopage_workbook.cjs KT2
 *   node scripts/render_eee_twopage_workbook.cjs KT3
 *   node scripts/render_eee_twopage_workbook.cjs all
 */

const { EEE_BOOKLETS } = require('./eee_workbook_master_data.cjs');
const {
  buildEeeGoldenBookletHtml,
  compileAndVerifyEeeBooklet,
} = require('./components/render_eee_golden_booklet.cjs');

async function run() {
  const arg = (process.argv[2] || 'all').toUpperCase();
  const targets = arg === 'ALL' ? ['KT1', 'KT2', 'KT3'] : [arg];

  for (const ktId of targets) {
    const booklet = EEE_BOOKLETS[ktId];
    if (!booklet) {
      throw new Error(`Unknown EEE Key Topic "${ktId}". Expected KT1, KT2, KT3, or all.`);
    }
    await compileAndVerifyEeeBooklet(ktId, booklet);
  }
}

if (require.main === module) {
  run().catch((err) => {
    console.error('❌ Failed to compile EEE Golden Pupil Workbook:', err);
    process.exit(1);
  });
}

module.exports = {
  KEY_TOPICS_DATA: EEE_BOOKLETS,
  EEE_BOOKLETS,
  buildEeeGoldenBookletHtml,
  compileAndVerifyEeeBooklet,
};
