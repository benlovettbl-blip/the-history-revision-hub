/**
 * scripts/components/resolve_unit_enquiries.cjs
 *
 * Unified Single-Source-of-Truth Lesson Title & Key Enquiry Resolver.
 * Guarantees that every Pupil Workbook, Master Textbook, KS2 Print Suite,
 * Mark Scheme, and Web View pulls its Key Enquiry directly from
 * `data/<unitId>.json` / `units/<unitId>/data.js` without hardcoded drift.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..', '..');

function resolveLessonEnquiry(lesson) {
  if (!lesson || typeof lesson !== 'object') return '';
  const candidates = [
    lesson.enquiry,
    lesson.enquiry_question,
    lesson.enquiryQuestion,
    lesson.inquiry_question,
  ];
  for (const val of candidates) {
    if (typeof val === 'string' && val.trim()) {
      return val.trim();
    }
  }
  return '';
}

function loadUnitDataSync(unitId) {
  const candidates = [
    path.join(ROOT_DIR, 'data', `${unitId}.json`),
    path.join(ROOT_DIR, 'public', 'data', `${unitId}.json`),
  ];
  for (const jsonPath of candidates) {
    if (fs.existsSync(jsonPath)) {
      try {
        return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      } catch (_) {}
    }
  }
  const dataJsPath = path.join(ROOT_DIR, 'units', unitId, 'data.js');
  if (fs.existsSync(dataJsPath)) {
    const raw = fs.readFileSync(dataJsPath, 'utf8');
    const transformed = raw
      .replace(/^\s*export\s+default\s+/, 'module.exports = ')
      .replace(/\n\s*export\s+default\s+([a-zA-Z0-9_]+)\s*;?\s*$/, '\nmodule.exports = $1;');
    const sandbox = { window: {}, module: { exports: {} }, exports: {} };
    vm.createContext(sandbox);
    vm.runInContext(transformed, sandbox);
    return sandbox.module.exports;
  }
  return null;
}

function normalizeUnitLessonEnquiries(unitData) {
  if (!unitData || !Array.isArray(unitData.lessons)) return unitData;
  for (const lesson of unitData.lessons) {
    const canonical = resolveLessonEnquiry(lesson);
    if (canonical) {
      lesson.enquiry = canonical;
      lesson.enquiry_question = canonical;
      lesson.enquiryQuestion = canonical;
    }
  }
  return unitData;
}

/**
 * Synchronizes a workbook script's `enquiryConfigs` (flat array or KT-grouped map)
 * in-place with the canonical `lesson.enquiry` stored in `data/<unitId>.json`.
 */
function syncWorkbookEnquiryConfigs(unitId, configsOrMap, options = {}) {
  const unitData = loadUnitDataSync(unitId);
  if (!unitData || !Array.isArray(unitData.lessons)) return configsOrMap;

  let lessons = unitData.lessons.slice();
  if (Array.isArray(options.slice)) {
    lessons = lessons.slice(options.slice[0], options.slice[1]);
  }

  const byId = new Map();
  lessons.forEach((l) => {
    if (l && l.id) byId.set(l.id, l);
  });

  const flatConfigs = Array.isArray(configsOrMap)
    ? configsOrMap
    : Object.values(configsOrMap || {}).flatMap((arr) => (Array.isArray(arr) ? arr : []));

  if (lessons.length > flatConfigs.length && !options.slice) {
    const filtered = lessons.filter(
      (l) => !/summative\s+assessment\s+masterclass/i.test(l.title || ''),
    );
    if (filtered.length === flatConfigs.length) {
      lessons = filtered;
    } else if (options.skipLessonZero && lessons[0] && lessons[0].id === 'lesson_0') {
      lessons = lessons.slice(1);
    }
  }

  flatConfigs.forEach((cfg, idx) => {
    if (!cfg || typeof cfg !== 'object') return;
    const explicitId = cfg.appLessonId || cfg.lessonId || cfg.id;
    const matchedLesson = (explicitId && byId.get(explicitId)) || lessons[idx];
    const liveEnq = resolveLessonEnquiry(matchedLesson);
    if (liveEnq) {
      cfg.enquiryQuestion = liveEnq;
    }
  });

  return configsOrMap;
}

module.exports = {
  resolveLessonEnquiry,
  loadUnitDataSync,
  normalizeUnitLessonEnquiries,
  syncWorkbookEnquiryConfigs,
};
