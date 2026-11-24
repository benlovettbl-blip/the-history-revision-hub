/**
 * src/spec_status_store.js
 *
 * Unified Year 11 GCSE Specification Confidence & "Prove-It Green" Store.
 * Shared across:
 *  - Tab 1: Paper Blueprint & Quick Questions ("Red / Unverified Topics" filter)
 *  - Tab 2: Vertical Specification Checklist & Left-to-Right Spotlight Mind Map
 *
 * Status values per sub-topic / anchor ID:
 *  - 'red'            : Pupil flagged "Need Help"
 *  - 'amber'          : Pupil flagged "Shaky / Review"
 *  - 'verified_green' : Earned by scoring 3/3 on the 20-second "Prove-It" micro-check
 */

const STORAGE_KEY = 'hh_gcse_spec_status_v1';
const LEGACY_RAG_KEY = 'gcse_spec_rag_audit_v2';

let memoryCache = null;

function loadStore() {
  if (memoryCache) return memoryCache;
  memoryCache = {};
  if (typeof localStorage === 'undefined') return memoryCache;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        memoryCache = parsed;
        return memoryCache;
      }
    }
  } catch (e) {}

  // One-time best-effort migration of any red/amber flags from legacy RAG store
  try {
    const legacyRaw = localStorage.getItem(LEGACY_RAG_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      if (legacy && typeof legacy === 'object') {
        Object.entries(legacy).forEach(([k, val]) => {
          if (val === 'red' || val === 'amber') {
            memoryCache[`legacy::${k}`] = val;
          }
        });
      }
    }
  } catch (e) {}

  return memoryCache;
}

function persistStore() {
  if (typeof localStorage === 'undefined' || !memoryCache) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryCache));
  } catch (e) {}
}

function makeKey(unitId, itemId) {
  return `${String(unitId || '').trim()}::${String(itemId || '').trim()}`;
}

export function getSpecStatus(unitId, itemId) {
  const store = loadStore();
  return store[makeKey(unitId, itemId)] || 'none';
}

export function setSpecStatus(unitId, itemId, status) {
  const store = loadStore();
  const key = makeKey(unitId, itemId);
  if (!status || status === 'none') {
    delete store[key];
  } else {
    store[key] = status;
  }
  persistStore();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('hh:spec-status-updated', { detail: { unitId, itemId, status } }),
    );
  }
}

export function markSubTopicProvenGreen(unitId, subTopicId, anchorIds = []) {
  const store = loadStore();
  store[makeKey(unitId, subTopicId)] = 'verified_green';
  anchorIds.forEach((aId) => {
    store[makeKey(unitId, aId)] = 'verified_green';
  });
  persistStore();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('hh:spec-status-updated', {
        detail: { unitId, itemId: subTopicId, status: 'verified_green' },
      }),
    );
  }
}

/**
 * Computes unit-wide specification completion & identifies lessons with Red/Amber or unverified anchors.
 */
export function computeSpecTreeProgress(specTree) {
  if (!specTree || !Array.isArray(specTree.keyTopics)) {
    return {
      totalSubTopics: 0,
      verifiedSubTopics: 0,
      redSubTopics: 0,
      amberSubTopics: 0,
      percentVerified: 0,
      redOrAmberLessonIndices: new Set(),
      unverifiedLessonIndices: new Set(),
    };
  }

  const unitId = specTree.unitId;
  let totalSubTopics = 0;
  let verifiedSubTopics = 0;
  let redSubTopics = 0;
  let amberSubTopics = 0;
  const redOrAmberLessonIndices = new Set();
  const unverifiedLessonIndices = new Set();

  specTree.keyTopics.forEach((kt) => {
    (kt.subTopics || []).forEach((st) => {
      totalSubTopics += 1;
      const stStatus = getSpecStatus(unitId, st.id);
      const anchorStatuses = (st.anchors || []).map((a) => getSpecStatus(unitId, a.id));

      const isVerified =
        stStatus === 'verified_green' ||
        (anchorStatuses.length > 0 && anchorStatuses.every((s) => s === 'verified_green'));
      const hasRed = stStatus === 'red' || anchorStatuses.includes('red');
      const hasAmber = !hasRed && (stStatus === 'amber' || anchorStatuses.includes('amber'));

      const linkedLessons = Array.isArray(st.linkedLessonIndices) ? st.linkedLessonIndices : [];
      (st.anchors || []).forEach((a) => {
        if (typeof a.lessonIndex === 'number' && !linkedLessons.includes(a.lessonIndex)) {
          linkedLessons.push(a.lessonIndex);
        }
      });

      if (isVerified) {
        verifiedSubTopics += 1;
      } else {
        linkedLessons.forEach((idx) => unverifiedLessonIndices.add(idx));
      }

      if (hasRed) {
        redSubTopics += 1;
        linkedLessons.forEach((idx) => redOrAmberLessonIndices.add(idx));
      } else if (hasAmber) {
        amberSubTopics += 1;
        linkedLessons.forEach((idx) => redOrAmberLessonIndices.add(idx));
      }
    });
  });

  const percentVerified =
    totalSubTopics > 0 ? Math.round((verifiedSubTopics / totalSubTopics) * 100) : 0;

  return {
    totalSubTopics,
    verifiedSubTopics,
    redSubTopics,
    amberSubTopics,
    percentVerified,
    redOrAmberLessonIndices,
    unverifiedLessonIndices,
  };
}
