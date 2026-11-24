/**
 * Storage & Progress Management for GCSE History Study & Revision Portal
 */

import { state } from './state.js';

export function initData() {
  // Load state from local storage
  try {
    const storedMastery = localStorage.getItem('history_mastery');
    if (storedMastery) {
      state.mastery = JSON.parse(storedMastery);
    }

    const storedBookmarks = localStorage.getItem('history_bookmarks');
    if (storedBookmarks) {
      state.bookmarks = JSON.parse(storedBookmarks);
    }

    const storedWeak = localStorage.getItem('history_weak_spots');
    if (storedWeak) {
      state.weakSpots = JSON.parse(storedWeak);
    } else {
      state.weakSpots = {};
    }

    const storedTheme = localStorage.getItem('history_theme');
    if (storedTheme) {
      state.theme = storedTheme;
      document.documentElement.setAttribute('data-theme', storedTheme);
    }
  } catch (e) {
    console.error('Error loading data from localStorage:', e);
  }
}

export function saveProgress() {
  try {
    localStorage.setItem('history_mastery', JSON.stringify(state.mastery || {}));
    localStorage.setItem('history_bookmarks', JSON.stringify(state.bookmarks || []));
    localStorage.setItem('history_weak_spots', JSON.stringify(state.weakSpots || {}));
    localStorage.setItem('history_theme', state.theme);
  } catch (e) {
    console.error('LocalStorage save error:', e);
  }
}

export function getMasteryStatus(questionId) {
  const entry = state.mastery[questionId];
  if (!entry) return 'new';
  return entry.status || 'new';
}

export function updateLeitnerBox(questionId, isCorrect) {
  if (!state.mastery) state.mastery = {};

  let entry = state.mastery[questionId];
  const now = Date.now();

  if (!entry) {
    entry = {
      status: 'new',
      timestamp: now,
      leitnerBox: 1,
      nextReview: 0,
    };
  }

  if (isCorrect) {
    const currentBox = entry.leitnerBox || 1;
    const newBox = Math.min(5, currentBox + 1);

    // Spaced repetition review intervals:
    // Box 1: 4h, Box 2: 24h, Box 3: 3d, Box 4: 7d, Box 5: 14d
    const intervals = {
      1: 4 * 60 * 60 * 1000,
      2: 24 * 60 * 60 * 1000,
      3: 3 * 24 * 60 * 60 * 1000,
      4: 7 * 24 * 60 * 60 * 1000,
      5: 14 * 24 * 60 * 60 * 1000,
    };

    entry.leitnerBox = newBox;
    entry.nextReview = now + intervals[newBox];
    entry.status = newBox === 5 ? 'mastered' : 'secured';
    entry.timestamp = now;
  } else {
    // Demote to box 1 and review immediately
    entry.leitnerBox = 1;
    entry.nextReview = now;
    entry.status = 'new';
    entry.timestamp = now;
  }

  state.mastery[questionId] = entry;
  saveProgress();
}

export function toggleBookmark(questionId) {
  const index = state.bookmarks.indexOf(questionId);
  if (index === -1) {
    state.bookmarks.push(questionId);
  } else {
    state.bookmarks.splice(index, 1);
  }
  saveProgress();
}

/**
 * Deterministic hash-based unique ID generator for any lesson question/flashcard.
 */
export function generateQuestionId(unitId, source, qText) {
  const u = (unitId || 'general').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const s = (source || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 24);
  let hash = 0;
  const str = String(qText || '')
    .trim()
    .toLowerCase();
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const cleanHash = Math.abs(hash).toString(36);
  return `${u}__${s}__${cleanHash}`;
}

/**
 * Records an answer outcome in the spaced repetition Leitner box and personal weak spots ledger.
 * - Incorrect: Marked as 'red' (active weakness) and added to targeted recall pool.
 * - Correct: If in weak spots, promoted from 'red' -> 'amber' -> graduated (removed).
 */
export function recordQuestionResult(qId, isCorrect, questionObj = null, unitId = '') {
  if (!state.weakSpots) state.weakSpots = {};
  const effectiveUnit = unitId || window.currentUnitId || 'general';

  if (!qId && questionObj) {
    qId = generateQuestionId(effectiveUnit, questionObj.source, questionObj.q);
  }
  if (!qId) return;

  const now = Date.now();

  if (!isCorrect) {
    // Demote in Leitner system
    updateLeitnerBox(qId, false);

    // Save/update weak spot snapshot
    const existing = state.weakSpots[qId];
    state.weakSpots[qId] = {
      id: qId,
      unitId: effectiveUnit,
      tier: 'red', // 'red' = needs urgent recall review, 'amber' = reviewed once correctly
      q: questionObj?.q || existing?.q || 'Question',
      a: questionObj?.a || existing?.a || 'Answer',
      options: questionObj?.options || existing?.options || null,
      img: questionObj?.img || existing?.img || null,
      source: questionObj?.source || existing?.source || '',
      explanation: questionObj?.explanation || existing?.explanation || '',
      missCount: (existing?.missCount || 0) + 1,
      correctCount: existing?.correctCount || 0,
      lastMistakeTime: now,
    };
  } else {
    // Advance in Leitner box
    updateLeitnerBox(qId, true);

    // Review promotion in weak spots
    if (state.weakSpots[qId]) {
      const entry = state.weakSpots[qId];
      if (entry.tier === 'red') {
        entry.tier = 'amber';
        entry.correctCount = (entry.correctCount || 0) + 1;
        entry.lastReviewTime = now;
      } else {
        // Mastered after repeated recall success!
        delete state.weakSpots[qId];
      }
    }
  }

  saveProgress();
}

/**
 * Returns active weak spots (Red and Amber) filtered by unit, sorted with most missed/recent first.
 */
export function getWeakSpots(unitId = null) {
  if (!state.weakSpots) {
    try {
      const stored = localStorage.getItem('history_weak_spots');
      state.weakSpots = stored ? JSON.parse(stored) : {};
    } catch (e) {
      state.weakSpots = {};
    }
  }

  const all = Object.values(state.weakSpots || {});
  let filtered = all;
  if (unitId) {
    filtered = all.filter((item) => !item.unitId || item.unitId === unitId);
  }

  // Sort: Red first, then highest missCount, then most recent mistake
  return filtered.sort((a, b) => {
    if (a.tier === 'red' && b.tier !== 'red') return -1;
    if (b.tier === 'red' && a.tier !== 'red') return 1;
    if ((b.missCount || 0) !== (a.missCount || 0)) {
      return (b.missCount || 0) - (a.missCount || 0);
    }
    return (b.lastMistakeTime || 0) - (a.lastMistakeTime || 0);
  });
}

/**
 * Clears weak spots for a specific unit or globally.
 */
export function clearWeakSpots(unitId = null) {
  if (!state.weakSpots) state.weakSpots = {};
  if (!unitId) {
    state.weakSpots = {};
  } else {
    Object.keys(state.weakSpots).forEach((k) => {
      if (!state.weakSpots[k].unitId || state.weakSpots[k].unitId === unitId) {
        delete state.weakSpots[k];
      }
    });
  }
  saveProgress();
}

// ============================================================================
// Progressive Curriculum Loader (~5 KB Instant Index + On-Demand Unit JSON)
// ============================================================================
const unitLoadPromises = new Map();
let fullDbPromise = null;
let isFullDbHydrated = false;

export function isFullDatabaseHydrated() {
  return isFullDbHydrated;
}

export async function loadDatabaseIndex() {
  try {
    const preflight =
      typeof window !== 'undefined' && window.__dbIndexBootPromise
        ? await window.__dbIndexBootPromise
        : null;
    const indexJson =
      preflight ||
      (await fetch('/data/database_index.json', { cache: 'no-cache' }).then((r) =>
        r.ok ? r.json() : null,
      ));

    if (indexJson && typeof indexJson === 'object' && Object.keys(indexJson).length > 0) {
      if (!state.db || Object.keys(state.db).length === 0) {
        state.db = indexJson;
      } else {
        for (const [k, val] of Object.entries(indexJson)) {
          if (!state.db[k]) state.db[k] = val;
        }
      }
      if (typeof window !== 'undefined') window.db = state.db;
      return state.db;
    }
  } catch (err) {
    console.warn('[FastBoot] Course index fetch fell back to full database.json:', err);
  }
  return ensureFullDatabaseLoaded();
}

export async function ensureUnitLoaded(unitId) {
  if (!unitId || unitId === 'all') return null;

  const existing = state.db && state.db[unitId];
  if (existing && !existing._isIndexStub) {
    return existing.data || (existing.lessons ? existing : null);
  }

  if (unitLoadPromises.has(unitId)) {
    return unitLoadPromises.get(unitId);
  }

  const p = (async () => {
    try {
      const bootMap = typeof window !== 'undefined' ? window.__initialUnitBootMap : null;
      const preflight = bootMap && bootMap[unitId] ? await bootMap[unitId] : null;
      const isLocalDev =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const raw =
        (!isLocalDev && preflight) ||
        (await fetch(
          `/data/${encodeURIComponent(unitId)}.json`,
          isLocalDev ? { cache: 'no-store' } : undefined,
        ).then((r) => (r.ok ? r.json() : null)));

      if (raw && typeof raw === 'object') {
        const unitData = raw.data || raw;
        if (!state.db) state.db = {};
        state.db[unitId] = { data: unitData };
        if (typeof window !== 'undefined') window.db = state.db;
        return unitData;
      }
    } catch (err) {
      console.warn(`[FastBoot] Per-unit load for ${unitId} fell back to CacheStorage / full DB:`, err);
      if (typeof window !== 'undefined' && 'caches' in window) {
        try {
          const cachedRes = await window.caches.match(`/data/${encodeURIComponent(unitId)}.json`);
          if (cachedRes && cachedRes.ok) {
            const cachedJson = await cachedRes.json();
            const unitData = cachedJson?.data || cachedJson;
            if (unitData && typeof unitData === 'object') {
              if (!state.db) state.db = {};
              state.db[unitId] = { data: unitData };
              window.db = state.db;
              return unitData;
            }
          }
        } catch (_) {}
      }
    }

    await ensureFullDatabaseLoaded();
    const afterFull = state.db && state.db[unitId];
    return afterFull ? afterFull.data || afterFull : null;
  })().finally(() => {
    unitLoadPromises.delete(unitId);
  });

  unitLoadPromises.set(unitId, p);
  return p;
}

export async function ensureFullDatabaseLoaded() {
  if (isFullDbHydrated && state.db && Object.keys(state.db).length > 0) {
    return state.db;
  }
  if (fullDbPromise) return fullDbPromise;

  fullDbPromise = (async () => {
    try {
      const res = await fetch('/database.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const fullDb = await res.json();
      if (!state.db) state.db = {};
      for (const [k, val] of Object.entries(fullDb)) {
        // Preserve already-hydrated live unit objects so activeUnitData references never orphan
        if (!state.db[k] || state.db[k]._isIndexStub) {
          state.db[k] = val;
        }
      }
      isFullDbHydrated = true;
      if (typeof window !== 'undefined') {
        window.db = state.db;
        window.__isFullDbHydrated = true;
        if (typeof window.__refreshKeywordSearchIndex === 'function') {
          window.__refreshKeywordSearchIndex(state.db);
        }
      }
      return state.db;
    } catch (err) {
      console.error('Failed to hydrate full database.json:', err);
      if (!state.db) state.db = {};
      if (typeof window !== 'undefined') window.db = state.db;
      return state.db;
    } finally {
      fullDbPromise = null;
    }
  })();

  return fullDbPromise;
}

if (typeof window !== 'undefined') {
  window.ensureUnitLoaded = ensureUnitLoaded;
  window.ensureFullDatabaseLoaded = ensureFullDatabaseLoaded;
}


