/**
 * scripts/render_cme_twopage_workbook.cjs
 *
 * Compiles the 16-page (4 folded A3 sheets) Golden-Template Pupil Workbook for
 * Pearson Edexcel GCSE (9–1) History Paper 2 (Option P5 / 1HI0/P5):
 * Key Topic 2: The Escalating Conflict, 1963–73.
 */

const { CME_BOOKLETS } = require('./cme_workbook_master_data.cjs');
const {
  buildCmeGoldenBookletHtml,
  compileAndVerifyCmeBooklet,
} = require('./components/render_cme_golden_booklet.cjs');

const kt2Configs = CME_BOOKLETS.KT2.lessons.map((l, idx) => ({
  ...l,
  lessonIndex: idx,
  lessonNum: idx + 1,
  id: l.appLessonId,
  title: l.subTitle,
  stages: l.stages.map((s) => ({
    ...s,
    num: s.step,
    bullets: [],
    keywords: [],
    clue: s.questionHeading,
    title: s.questionHeading,
  })),
  consequenceA: l.q1,
  extendedPractice: l.extended,
}));

function buildCmeKt2TwoPageWorkbook() {
  return buildCmeGoldenBookletHtml(CME_BOOKLETS.KT2);
}

if (require.main === module) {
  compileAndVerifyCmeBooklet('KT2', CME_BOOKLETS.KT2).catch((err) => {
    console.error('❌ Failed to compile CME KT2 Pupil Workbook:', err);
    process.exit(1);
  });
}

module.exports = {
  buildCmeKt2TwoPageWorkbook,
  kt2Configs,
};
