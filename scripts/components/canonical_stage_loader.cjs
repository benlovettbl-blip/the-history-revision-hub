/**
 * scripts/components/canonical_stage_loader.cjs
 *
 * Shared Single-Source-of-Truth loader for all `scripts/render_*_workbook.cjs` compilers.
 * Overlays canonical stage questions, dates, paragraph references, and trigger bullets
 * from `data/<unitId>.json` onto workbook renderer stage configs so printed booklets
 * can NEVER drift from the web app's Chronology Spine and Narrative Block banners.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..', '..');

function loadCanonicalUnitLessons(unitId) {
  const jsonPath = path.join(ROOT_DIR, 'data', `${unitId}.json`);
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`[canonical_stage_loader] Missing canonical JSON: ${jsonPath}`);
  }
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  return (raw.data || raw).lessons || [];
}

/**
 * Overlays canonical stage metadata from `data/<unitId>.json` onto an array of
 * workbook lesson/enquiry config objects (supporting `enquiryConfigs`, `LESSONS`, etc.).
 *
 * @param {string} unitId - Canonical unit ID (e.g. 'medieval_england')
 * @param {Array<Object>} lessonConfigs - Workbook renderer lesson configuration array
 * @param {Object} [options]
 * @param {number} [options.lessonOffset=0] - Starting lesson index in `data/<unitId>.json` (for multi-KT booklets)
 * @returns {Array<Object>} Mutated lessonConfigs for convenience
 */
function applyCanonicalStageOverrides(unitId, lessonConfigs, options = {}) {
  const { lessonOffset = 0 } = options;
  const canonicalLessons = loadCanonicalUnitLessons(unitId);

  lessonConfigs.forEach((cfg, idx) => {
    // Match by explicit lesson id / appLessonId first, else by lessonIndex, else by lessonNum - 1, else by offset + idx
    let cLesson = null;
    const targetId = cfg.id || cfg.appLessonId;
    if (targetId) {
      cLesson = canonicalLessons.find((l) => l.id === targetId) || null;
    }
    if (!cLesson && typeof cfg.lessonIndex === 'number') {
      cLesson = canonicalLessons[cfg.lessonIndex] || null;
    }
    if (!cLesson && typeof cfg.lessonNum === 'number') {
      cLesson = canonicalLessons[cfg.lessonNum - 1] || null;
    }
    if (!cLesson) {
      cLesson = canonicalLessons[lessonOffset + idx] || null;
    }
    if (!cLesson || !Array.isArray(cfg.stages)) return;

    const wbStages = Array.isArray(cLesson.workbook_stages) ? cLesson.workbook_stages : [];
    const spineStages =
      cLesson.causal_domino_spine && Array.isArray(cLesson.causal_domino_spine.stages)
        ? cLesson.causal_domino_spine.stages
        : [];

    cfg.stages.forEach((st, sIdx) => {
      const ws = wbStages[sIdx] || {};
      const cs = spineStages[sIdx] || {};
      const canonicalQ = (
        cs.question ||
        ws.question ||
        ws.questionHeading ||
        ws.heading ||
        ''
      ).trim();

      if (canonicalQ && canonicalQ.endsWith('?')) {
        if (
          'questionHeading' in st ||
          !('heading' in st || 'prompt' in st || 'question' in st || 'focusClue' in st)
        ) {
          st.questionHeading = canonicalQ;
        }
        if ('focusClue' in st) st.focusClue = canonicalQ;
        if ('heading' in st) st.heading = canonicalQ;
        if ('question' in st) st.question = canonicalQ;
        if ('prompt' in st) st.prompt = canonicalQ;
      }

      const canonicalDate = (cs.date || ws.date || ws.dates || '').trim();
      if (canonicalDate && canonicalDate !== 'Key Event') {
        if ('dates' in st) st.dates = canonicalDate;
        if ('date' in st || !('dates' in st)) st.date = canonicalDate;
      }

      const canonicalPara = (ws.para_ref || ws.paraRef || cs.para_ref || cs.paraRef || '').trim();
      if (canonicalPara) {
        if ('paraRef' in st || !('para_ref' in st)) st.paraRef = canonicalPara;
        if ('para_ref' in st) st.para_ref = canonicalPara;
      }
    });
  });

  return lessonConfigs;
}

module.exports = {
  loadCanonicalUnitLessons,
  applyCanonicalStageOverrides,
};
