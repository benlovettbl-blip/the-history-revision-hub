/**
 * Mobile App Shell v2: Adaptive 5-Tab Thumb Bar (Home · Learn · Quiz · Exam · Arcade),
 * Strict 1-Screen Mobile Home Fold, Course Pinning + Teacher QR, Offline Chunk Pre-Warm,
 * Reading Scroll Memory, iOS Keyboard Guard, and Dark/Light Quick Toggle.
 */

import './mobile_app_shell.css';
import { state } from './state.js';
import { getWeakSpots, ensureUnitLoaded } from './storage.js';

const STORAGE_PINNED_UNITS = 'hh_pinned_units';
const STORAGE_LAST_LESSON = 'hh_last_lesson';
const STORAGE_OFFLINE_UNITS = 'hh_offline_units';
const STORAGE_INSTALL_DISMISSED = 'hh_install_banner_dismissed';
const DYNAMIC_CACHE_FALLBACK = 'history-hub-dynamic-v20-gdpr';
const LIVE_HUB_ORIGIN = 'https://historyrevisionhub.co.uk';

export const CANONICAL_COURSES = [
  // GCSE (Edexcel 9–1 — Papers 1–3)
  { id: 'edexcel_medicine', title: 'Medicine Through Time (c.1250–Present)', group: 'gcse', badge: 'GCSE Paper 1' },
  { id: 'eee', title: 'Early Elizabethan England (1558–1588)', group: 'gcse', badge: 'GCSE Paper 2' },
  { id: 'gcse_cold_war', title: 'Superpower Relations & the Cold War (1941–1991)', group: 'gcse', badge: 'GCSE Paper 2' },
  { id: 'cme_new', title: 'Conflict in the Middle East (1945–1995)', group: 'gcse', badge: 'GCSE Paper 2' },
  { id: 'weimar_nazi_germany', title: 'Weimar & Nazi Germany (1918–1939)', group: 'gcse', badge: 'GCSE Paper 3' },
  { id: 'usa', title: 'USA: Conflict at Home & Abroad (1954–1975)', group: 'gcse', badge: 'GCSE Paper 3' },

  // Key Stage 3 (12 Units)
  { id: 'water_and_sanitation', title: 'Water & Sanitation (1250–Present)', group: 'ks3', badge: 'KS3 Thematic' },
  { id: 'medieval_england', title: 'Medieval England (1066–1485)', group: 'ks3', badge: 'KS3 Medieval' },
  { id: 'monarchy_religion_power', title: 'Crown, Church & Parliament (1517–1689)', group: 'ks3', badge: 'KS3 Early Modern' },
  { id: 'first_british_empire', title: 'The First British Empire (1600–1783)', group: 'ks3', badge: 'KS3 Empire' },
  { id: 'industrialisation_and_empire', title: 'The Industrial Revolution (1750–1872)', group: 'ks3', badge: 'KS3 Industry' },
  { id: 'second_british_empire', title: 'The Second British Empire (1783–1914)', group: 'ks3', badge: 'KS3 Empire' },
  { id: 'australia', title: 'Invasion & Survival in Australia', group: 'ks3', badge: 'KS3 World' },
  { id: 'great_war', title: 'Causes of the Great War (1890–1914)', group: 'ks3', badge: 'KS3 Modern' },
  { id: 'great_war_part2', title: 'The Great War (1914–1919)', group: 'ks3', badge: 'KS3 Modern' },
  { id: 'the_shoah', title: 'The Shoah (1933–1948)', group: 'ks3', badge: 'KS3 Holocaust' },
  { id: 'cold_war', title: 'The Cold War (1945–1991)', group: 'ks3', badge: 'KS3 Modern' },
  { id: 'post_war_britain', title: 'Rights, Protest & Post-War Britain', group: 'ks3', badge: 'KS3 Modern Britain' },

  // Key Stage 2 (8 Units)
  { id: 'ks2_stone_to_iron_age', title: 'Stone Age to Iron Age (c. 800,000 BC–AD 43)', group: 'ks2', badge: 'KS2 Prehistory' },
  { id: 'ks2_romans', title: 'The Romans in Britain (55 BC–AD 410)', group: 'ks2', badge: 'KS2 Roman Britain' },
  { id: 'ks2_anglo_saxons_vikings', title: 'Anglo-Saxons & Vikings (AD 410–1066)', group: 'ks2', badge: 'KS2 Early Medieval' },
  { id: 'ks2_ww2', title: 'World War II & The Home Front (1933–1945)', group: 'ks2', badge: 'KS2 Modern Study' },
  { id: 'ks2_ancient_egypt', title: 'Ancient Egypt (c. 3100–30 BC)', group: 'ks2', badge: 'KS2 Ancient World' },
  { id: 'ks2_ancient_greece', title: 'Ancient Greece (c. 800–146 BC)', group: 'ks2', badge: 'KS2 Ancient World' },
  { id: 'ks2_early_islamic_baghdad', title: 'Early Islamic Baghdad (c. AD 750–1258)', group: 'ks2', badge: 'KS2 World AD 900' },
  { id: 'ks2_maya_civilisation', title: 'The Ancient Maya (c. 2000 BC–AD 1500)', group: 'ks2', badge: 'KS2 World AD 900' },
];

const COURSE_MAP = new Map(CANONICAL_COURSES.map((c) => [c.id, c]));

const UNIT_ID_ALIASES = {
  gcse_middle_east_1945_1995_new: 'cme_new',
  gcse_middle_east_1945_1995: 'cme_new',
  middle_east: 'cme_new',
  gcse_usa_1954_1975: 'usa',
  gcse_usa: 'usa',
  gcse_elizabethan_england: 'eee',
  elizabethan_england: 'eee',
  great_war_v2: 'great_war',
  medicine: 'edexcel_medicine',
  weimar: 'weimar_nazi_germany',
};

let deferredInstallPrompt = null;
let showAllCoursesExpanded = false;
let urlPinChecked = false;
const pendingOfflineResolvers = new Map();

function escapeHtml(val) {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeUnitId(rawId) {
  const cleaned = String(rawId || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '');
  if (!cleaned) return '';
  return UNIT_ID_ALIASES[cleaned] || cleaned;
}

function isValidUnitId(unitId) {
  if (!unitId || !/^[a-z0-9_]+$/.test(unitId)) return false;
  if (COURSE_MAP.has(unitId)) return true;
  const dbObj = (typeof window !== 'undefined' && window.db) || state.db;
  return Boolean(dbObj && typeof dbObj === 'object' && dbObj[unitId]);
}

function isGcseCourseId(unitId) {
  const norm = normalizeUnitId(unitId);
  return COURSE_MAP.get(norm)?.group === 'gcse';
}

export function showMobileShellToast(message) {
  if (typeof document === 'undefined') return;
  let toast = document.getElementById('hh-shell-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'hh-shell-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#34d399;"></i><span>${escapeHtml(message)}</span>`;
  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });
  clearTimeout(window.__hhShellToastTimer);
  window.__hhShellToastTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2800);
}

export function applyUrlDeepLinkPins() {
  if (typeof window === 'undefined' || !window.location) return false;
  const params = new URLSearchParams(window.location.search || '');
  const rawParam = params.get('pin_units') || params.get('my_units');
  if (!rawParam) {
    urlPinChecked = true;
    return false;
  }

  const parsedIds = rawParam
    .split(',')
    .map((token) => normalizeUnitId(token))
    .filter((id, idx, arr) => id && isValidUnitId(id) && arr.indexOf(id) === idx);

  try {
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('pin_units');
    cleanUrl.searchParams.delete('my_units');
    if (window.history && typeof window.history.replaceState === 'function') {
      window.history.replaceState(window.history.state || {}, '', cleanUrl);
    }
  } catch (e) {}

  urlPinChecked = true;

  if (parsedIds.length > 0) {
    try {
      localStorage.setItem(STORAGE_PINNED_UNITS, JSON.stringify(parsedIds));
    } catch (e) {}
    showAllCoursesExpanded = false;
    setTimeout(() => {
      showMobileShellToast('Pinned your courses!');
    }, 120);
    return true;
  }
  return false;
}

export function getPinnedUnits() {
  if (!urlPinChecked) {
    applyUrlDeepLinkPins();
  }
  try {
    const raw = localStorage.getItem(STORAGE_PINNED_UNITS);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((id) => normalizeUnitId(id))
      .filter((id, idx, self) => id && isValidUnitId(id) && self.indexOf(id) === idx);
  } catch (e) {
    return [];
  }
}

export function setPinnedUnits(unitIds) {
  const clean = Array.isArray(unitIds)
    ? unitIds
        .map((id) => normalizeUnitId(id))
        .filter((id, idx, self) => id && isValidUnitId(id) && self.indexOf(id) === idx)
    : [];
  try {
    if (clean.length > 0) {
      localStorage.setItem(STORAGE_PINNED_UNITS, JSON.stringify(clean));
      showAllCoursesExpanded = false;
    } else {
      localStorage.removeItem(STORAGE_PINNED_UNITS);
      showAllCoursesExpanded = true;
    }
  } catch (e) {}
  syncMobileBottomNavActiveState();
  return clean;
}

export function pinSingleUnitQuick(unitId) {
  const cleanId = normalizeUnitId(unitId);
  if (!cleanId || !isValidUnitId(cleanId)) return;
  const current = getPinnedUnits();
  if (!current.includes(cleanId)) {
    setPinnedUnits([...current, cleanId]);
    const title = COURSE_MAP.get(cleanId)?.title?.split('(')[0]?.trim() || 'Course';
    showMobileShellToast(`Pinned "${title}" to My Courses!`);
  } else {
    showMobileShellToast('Already in My Pinned Courses');
  }
}

export function isShowAllCoursesEnabled() {
  return Boolean(showAllCoursesExpanded);
}

function getSavedOfflineUnitsSet() {
  try {
    const raw = localStorage.getItem(STORAGE_OFFLINE_UNITS);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch (e) {
    return new Set();
  }
}

function markUnitSavedOfflineLocal(unitId) {
  try {
    const set = getSavedOfflineUnitsSet();
    set.add(unitId);
    localStorage.setItem(STORAGE_OFFLINE_UNITS, JSON.stringify([...set]));
  } catch (e) {}
}

export function getLastVisitedLesson() {
  try {
    const raw = localStorage.getItem(STORAGE_LAST_LESSON);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      !parsed.unitId ||
      !isValidUnitId(parsed.unitId) ||
      typeof parsed.lessonIndex !== 'number' ||
      parsed.lessonIndex < 0
    ) {
      return null;
    }
    return parsed;
  } catch (e) {
    return null;
  }
}

export function recordLastVisitedLesson({
  unitId,
  unitTitle = '',
  lessonIndex = 0,
  lessonId = '',
  lessonTitle = '',
} = {}) {
  const normUnitId = normalizeUnitId(unitId);
  if (!normUnitId || typeof lessonIndex !== 'number' || lessonIndex < 0) return null;

  const catalogMeta = COURSE_MAP.get(normUnitId);
  const unitData =
    (state.selectedUnitId === normUnitId && state.activeUnitData) ||
    (typeof window !== 'undefined' &&
      window.currentUnitId === normUnitId &&
      window.currentUnitData) ||
    (state.db && state.db[normUnitId] && (state.db[normUnitId].data || state.db[normUnitId])) ||
    {};

  const lessons = Array.isArray(unitData.lessons) ? unitData.lessons : [];
  const lessonObj = lessons[lessonIndex] || {};

  const resolvedUnitTitle =
    unitTitle ||
    catalogMeta?.title ||
    (unitData.title ? String(unitData.title).replace(/^(?:Paper \d+:?|KS3:?|KS2:?|GCSE[^:]*:?)\s*/i, '').trim() : normUnitId);

  const resolvedLessonTitle =
    lessonTitle || lessonObj.title || `Lesson ${lessonIndex + 1}`;

  const payload = {
    unitId: normUnitId,
    unitTitle: resolvedUnitTitle,
    lessonIndex,
    lessonId: lessonId || lessonObj.id || `lesson_${lessonIndex + 1}`,
    lessonTitle: resolvedLessonTitle,
    ts: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_LAST_LESSON, JSON.stringify(payload));
    localStorage.setItem(`hh_last_lesson_${normUnitId}`, String(lessonIndex));
  } catch (e) {}

  syncMobileBottomNavActiveState();
  return payload;
}

export function getDueWeakSpotSummary() {
  const now = Date.now();
  let masteryMap = state.mastery;
  if (!masteryMap || Object.keys(masteryMap).length === 0) {
    try {
      const stored = localStorage.getItem('history_mastery');
      masteryMap = stored ? JSON.parse(stored) : {};
    } catch (e) {
      masteryMap = {};
    }
  }

  const dueIds = new Set();
  const unitTallies = new Map();

  const bumpUnit = (rawUnit) => {
    const norm = normalizeUnitId(rawUnit);
    if (norm && isValidUnitId(norm)) {
      unitTallies.set(norm, (unitTallies.get(norm) || 0) + 1);
    }
  };

  Object.entries(masteryMap || {}).forEach(([qId, entry]) => {
    if (!entry || typeof entry !== 'object') return;
    const isBoxOne = entry.leitnerBox === 1;
    const isReviewDue = typeof entry.nextReview === 'number' && entry.nextReview <= now;
    if (isBoxOne || isReviewDue) {
      dueIds.add(qId);
      if (qId.includes('__')) {
        bumpUnit(qId.split('__')[0]);
      }
    }
  });

  const weakList = getWeakSpots();
  weakList.forEach((ws) => {
    if (ws && ws.id && !dueIds.has(ws.id)) {
      dueIds.add(ws.id);
    }
    if (ws && ws.unitId) {
      bumpUnit(ws.unitId);
    }
  });

  let topUnitId = null;
  let topCount = 0;
  unitTallies.forEach((count, uId) => {
    if (count > topCount) {
      topCount = count;
      topUnitId = uId;
    }
  });

  return {
    dueCount: dueIds.size,
    dueIds,
    topUnitId,
  };
}

function resolveBestTargetUnitId() {
  const current =
    state.selectedUnitId ||
    (typeof window !== 'undefined' && window.currentUnitId) ||
    '';
  if (current && isValidUnitId(current)) return current;
  const last = getLastVisitedLesson();
  if (last && last.unitId) return last.unitId;
  const pinned = getPinnedUnits();
  if (pinned.length > 0) return pinned[0];
  return '';
}

function resolveBestGcseTargetUnitId() {
  const current =
    state.selectedUnitId ||
    (typeof window !== 'undefined' && window.currentUnitId) ||
    '';
  if (current && isGcseCourseId(current)) return normalizeUnitId(current);
  const last = getLastVisitedLesson();
  if (last && last.unitId && isGcseCourseId(last.unitId)) return normalizeUnitId(last.unitId);
  const pinnedGcse = getPinnedUnits().find((id) => isGcseCourseId(id));
  if (pinnedGcse) return pinnedGcse;
  return 'cme_new';
}

function shouldShowMobileExamTab() {
  const current =
    state.selectedUnitId ||
    (typeof window !== 'undefined' && window.currentUnitId) ||
    '';
  if (current && isGcseCourseId(current)) return true;
  const pinned = getPinnedUnits();
  if (pinned.length === 0) return true; // Default 5-tab GCSE layout for cold / unpinned visitors
  return pinned.some((id) => isGcseCourseId(id));
}

function readLocalGamificationSnapshot() {
  try {
    if (typeof window !== 'undefined' && typeof window.hhGetGamificationSummary === 'function') {
      return window.hhGetGamificationSummary();
    }
    const raw = localStorage.getItem('hh_gamification_v1');
    if (raw) {
      const p = JSON.parse(raw);
      if (p && typeof p === 'object') {
        const xp = Math.max(0, Number(p.xp) || 0);
        const streak = Math.max(0, Number(p.streak) || 0);
        const rank =
          xp >= 2000
            ? 'Grade 9 Scholar'
            : xp >= 1000
              ? 'Spec Master'
              : xp >= 450
                ? 'Junior Historian'
                : xp >= 150
                  ? 'Archivist'
                  : 'History Novice';
        return { xp, streak, rank, freezes: Number(p.freezes) || 0 };
      }
    }
    const legacyRaw = localStorage.getItem('hh_revision_streak_v1');
    if (legacyRaw) {
      const lp = JSON.parse(legacyRaw);
      return { xp: 0, streak: Math.max(0, Number(lp?.streak) || 0), rank: 'History Novice', freezes: 0 };
    }
  } catch (e) {}
  return { xp: 0, streak: 0, rank: 'History Novice', freezes: 0 };
}

function isStandaloneDisplayMode() {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.navigator.standalone === true ||
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches),
  );
}

function isIosSafariInstallCandidate() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  if (isStandaloneDisplayMode()) return false;
  const ua = navigator.userAgent || '';
  return /iPhone|iPad|iPod/i.test(ua);
}

function isInstallBannerDismissed() {
  try {
    return localStorage.getItem(STORAGE_INSTALL_DISMISSED) === '1';
  } catch (e) {
    return false;
  }
}

export function dismissInstallBanner() {
  try {
    localStorage.setItem(STORAGE_INSTALL_DISMISSED, '1');
  } catch (e) {}
  const el = document.getElementById('hh-install-banner');
  if (el) el.remove();
}

export async function triggerAppInstall() {
  if (!deferredInstallPrompt) return;
  try {
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    if (choice && choice.outcome === 'accepted') {
      deferredInstallPrompt = null;
      dismissInstallBanner();
      showMobileShellToast('App installed on your home screen!');
    }
  } catch (e) {}
}

/**
 * Offline Unit Pre-Save + Lazy Interactive Chunk Pre-Warm (Quiz Arena, Exam Trainer, Arcade)
 */
export async function saveUnitOffline(unitId, btnEl = null) {
  const cleanId = normalizeUnitId(unitId);
  if (!cleanId || !isValidUnitId(cleanId)) return false;

  if (btnEl) {
    btnEl.disabled = true;
    btnEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Saving...</span>';
  }

  let swSucceeded = false;

  try {
    // Pre-warm lazy JS chunks so Lessons, Quiz, Exam, Arcade & Timelines work 100% offline on the bus
    await Promise.allSettled([
      import('./mobile_quiz_arena.js'),
      import('./mobile_exam_trainer.js'),
      import('./arcade_zone.js'),
      import('./universal_living_timeline.js'),
      import('./engine/lesson_renderer.js'),
    ]);

    if (
      typeof navigator !== 'undefined' &&
      'serviceWorker' in navigator &&
      navigator.serviceWorker.controller
    ) {
      swSucceeded = await new Promise((resolve) => {
        const timer = setTimeout(() => {
          pendingOfflineResolvers.delete(cleanId);
          resolve(false);
        }, 6500);
        pendingOfflineResolvers.set(cleanId, (ok) => {
          clearTimeout(timer);
          resolve(Boolean(ok));
        });
        navigator.serviceWorker.controller.postMessage({
          type: 'SAVE_UNIT_OFFLINE',
          unitId: cleanId,
        });
      });
    }

    if (!swSucceeded) {
      await ensureUnitLoaded(cleanId);
      if (typeof window !== 'undefined' && 'caches' in window) {
        const cache = await window.caches.open(DYNAMIC_CACHE_FALLBACK);
        const urls = [
          `/data/${cleanId}.json`,
          `/data/timelines/${cleanId}.json`,
          `/data/mindmaps/${cleanId}.json`,
          '/data/database_index.json',
        ];
        await Promise.allSettled(
          urls.map(async (u) => {
            const res = await fetch(u, { cache: 'no-cache' });
            if (res.ok) await cache.put(u, res.clone());
          }),
        );
      }
      swSucceeded = true;
    }
  } catch (err) {
    console.warn('[OfflineSave] Unit cache warning:', err);
  }

  if (swSucceeded) {
    markUnitSavedOfflineLocal(cleanId);
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.classList.add('is-saved');
      btnEl.innerHTML = '<i class="fa-solid fa-check"></i> <span>Saved Offline</span>';
    }
    const courseTitle = COURSE_MAP.get(cleanId)?.title || cleanId;
    showMobileShellToast(
      `Saved "${courseTitle.split('(')[0].trim()}" lessons, quizzes & exam trainer offline!`,
    );
    return true;
  }

  if (btnEl) {
    btnEl.disabled = false;
    btnEl.innerHTML = '<i class="fa-solid fa-download"></i> <span>Save Offline</span>';
  }
  showMobileShellToast('Check connection and try saving offline again.');
  return false;
}

/**
 * 1-Tap Dark / Light Mode Toggle for Mobile Pupil Header
 */
export function toggleMobileDarkMode() {
  if (typeof document === 'undefined') return;
  const current = document.documentElement.getAttribute('data-theme') || state.theme || 'primary';
  const next = current === 'space' ? 'primary' : 'space';
  state.theme = next;
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem('history_theme', next);
  } catch (e) {}
  syncMobileDarkToggleIcon();
}

function syncMobileDarkToggleIcon() {
  if (typeof document === 'undefined') return;
  const icon = document.getElementById('hh-mobile-dark-icon');
  const btn = document.getElementById('btn-mobile-dark-toggle');
  if (!icon || !btn) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'space';
  icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  btn.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}

/**
 * Renders the Strict 1-Screen Fold Mobile Home Launchpad Card at top of renderDashboard()
 */
export function renderMobileHomeHeroHTML(units = []) {
  applyUrlDeepLinkPins();

  const pinnedIds = getPinnedUnits();
  const lastLesson = getLastVisitedLesson();
  const weakSummary = getDueWeakSpotSummary();
  const savedOfflineSet = getSavedOfflineUnitsSet();
  const gStats = readLocalGamificationSnapshot();
  const showExamQuickChip = shouldShowMobileExamTab();
  const bestGcseUnit = resolveBestGcseTargetUnitId();
  const bestQuizUnit = resolveBestTargetUnitId() || bestGcseUnit;

  const unitLookup = new Map();
  if (Array.isArray(units)) {
    units.forEach((u) => {
      if (u && u.id) unitLookup.set(u.id, u);
    });
  }

  const showIosInstall = !isInstallBannerDismissed() && isIosSafariInstallCandidate();
  const showAndroidInstall =
    !isInstallBannerDismissed() && Boolean(deferredInstallPrompt) && !isStandaloneDisplayMode();
  const hasAnyPersonalState =
    pinnedIds.length > 0 ||
    Boolean(lastLesson) ||
    weakSummary.dueCount > 0 ||
    gStats.xp > 0 ||
    showIosInstall ||
    showAndroidInstall;

  let installHtml = '';
  if (showAndroidInstall) {
    installHtml = `
      <div class="hh-install-banner" id="hh-install-banner">
        <div class="hh-install-banner-main">
          <div class="hh-install-icon"><i class="fa-solid fa-mobile-screen-button"></i></div>
          <div class="hh-install-copy">
            <strong>Install History Hub App</strong> &mdash; 1-tap launch &amp; offline study.
          </div>
        </div>
        <div class="hh-install-actions">
          <button type="button" class="hh-install-cta-btn" onclick="window.hhTriggerAppInstall && window.hhTriggerAppInstall()">
            <i class="fa-solid fa-download"></i> Install
          </button>
          <button type="button" class="hh-install-dismiss-btn" aria-label="Dismiss install banner" onclick="window.hhDismissInstallBanner && window.hhDismissInstallBanner()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    `;
  } else if (showIosInstall) {
    installHtml = `
      <div class="hh-install-banner" id="hh-install-banner">
        <div class="hh-install-banner-main">
          <div class="hh-install-icon"><i class="fa-solid fa-mobile-screen-button"></i></div>
          <div class="hh-install-copy">
            <strong>Add App:</strong> Tap <strong>Share</strong> <i class="fa-solid fa-share-from-square" style="margin: 0 2px;"></i> + <strong>Add to Home Screen</strong>.
          </div>
        </div>
        <div class="hh-install-actions">
          <button type="button" class="hh-install-dismiss-btn" aria-label="Dismiss install guide" onclick="window.hhDismissInstallBanner && window.hhDismissInstallBanner()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    `;
  }

  // Gamification Compact Status Strip (Streak + XP + Zero-Account Backup)
  const gamificationStripHtml = `
    <div class="hh-gami-strip">
      <div class="hh-gami-left">
        <span class="hh-gami-pill streak" title="Daily revision streak">
          <i class="fa-solid fa-fire"></i>
          <span>${gStats.streak > 0 ? `${gStats.streak}d Streak` : 'Start Streak'}</span>
        </span>
        <span class="hh-gami-pill xp" title="Total XP &amp; Rank">
          <i class="fa-solid fa-bolt"></i>
          <span>${gStats.xp} XP &middot; ${escapeHtml(gStats.rank)}</span>
        </span>
      </div>
      <button type="button" class="hh-gami-backup-btn" onclick="if(window.hhOpenProgressBackupModal){window.hhOpenProgressBackupModal();}else{import('/src/mobile_gamification.js').then(m=>m.openProgressBackupModal&&m.openProgressBackupModal());}" title="Copy or restore your progress backup code">
        <i class="fa-solid fa-cloud-arrow-up"></i>
        <span>Backup</span>
      </button>
    </div>
  `;

  // Primary Action Card: Compact Resume (when lastLesson exists) OR Choose Subjects (ONLY when 0 courses are pinned!)
  const primaryCardHtml = lastLesson
    ? `
      <div class="hh-lp-card hh-lp-card-resume">
        <div class="hh-lp-meta">
          <div class="hh-lp-eyebrow">
            <i class="fa-solid fa-book-open" style="color: #059669;"></i>
            <span>Continue Learning</span>
          </div>
          <div class="hh-lp-title" title="${escapeHtml(lastLesson.lessonTitle)}">${escapeHtml(lastLesson.lessonTitle)}</div>
          <div class="hh-lp-sub">${escapeHtml(lastLesson.unitTitle)}</div>
        </div>
        <button type="button" class="hh-lp-btn hh-lp-btn-green" onclick="window.hhResumeLastLesson && window.hhResumeLastLesson()">
          <i class="fa-solid fa-play"></i>
          <span>Resume</span>
        </button>
      </div>
    `
    : pinnedIds.length === 0
      ? `
      <div class="hh-lp-card hh-lp-card-setup">
        <div class="hh-lp-meta">
          <div class="hh-lp-eyebrow">
            <i class="fa-solid fa-thumbtack" style="color: #2563eb;"></i>
            <span>Personalise Your Hub</span>
          </div>
          <div class="hh-lp-title">Studying GCSE or KS3 History?</div>
          <div class="hh-lp-sub">Pin your exact 1&ndash;6 courses for 1-tap revision.</div>
        </div>
        <button type="button" class="hh-lp-btn hh-lp-btn-blue" onclick="window.hhOpenPinUnitsModal && window.hhOpenPinUnitsModal()">
          <i class="fa-solid fa-sliders"></i>
          <span>Choose</span>
        </button>
      </div>
    `
      : '';

  // Single-Row Quick Strip: 60s Blitz | 1 Exam Q | Review Mistakes (X) [HIDDEN when X === 0]
  const hasMistakes = weakSummary.dueCount > 0;
  const quickStripHtml = `
    <div class="hh-home-quick-strip" role="group" aria-label="Quick Revision Actions">
      <button type="button" class="hh-quick-chip blitz" onclick="window.switchView && window.switchView('interactive', '${escapeHtml(bestQuizUnit)}', false, { mode: 'blitz' })">
        <i class="fa-solid fa-bolt" style="color:#f59e0b;"></i>
        <span>60s Blitz</span>
      </button>
      ${
        showExamQuickChip
          ? `<button type="button" class="hh-quick-chip exam" onclick="window.switchView && window.switchView('exam-trainer', '${escapeHtml(bestGcseUnit)}')">
              <i class="fa-solid fa-bullseye" style="color:#6366f1;"></i>
              <span>1 Exam Q</span>
            </button>`
          : `<button type="button" class="hh-quick-chip gapfill" onclick="window.switchView && window.switchView('interactive', '${escapeHtml(bestQuizUnit)}', false, { mode: 'cloze' })">
              <i class="fa-solid fa-puzzle-piece" style="color:#0284c7;"></i>
              <span>Gap Fill</span>
            </button>`
      }
      ${
        hasMistakes
          ? `<button type="button" class="hh-quick-chip mistakes" onclick="window.hhLaunchWeakSpotsDrill && window.hhLaunchWeakSpotsDrill()">
              <i class="fa-solid fa-rotate-left" style="color:#dc2626;"></i>
              <span>Mistakes (${weakSummary.dueCount})</span>
            </button>`
          : `<button type="button" class="hh-quick-chip gapfill" onclick="window.switchView && window.switchView('interactive', '${escapeHtml(bestQuizUnit)}', false, { mode: 'cloze' })">
              <i class="fa-solid fa-puzzle-piece" style="color:#0284c7;"></i>
              <span>Gap Fill</span>
            </button>`
      }
    </div>
  `;

  // Shelf: My Pinned Courses Shelf
  let pinnedShelfHtml = '';
  if (pinnedIds.length > 0) {
    const totalCatalogueCount = Math.max(26, units.length || 26);
    const cardsHtml = pinnedIds
      .map((uId) => {
        const meta = COURSE_MAP.get(uId) || {
          id: uId,
          title: unitLookup.get(uId)?.title || uId,
          group: String(uId).startsWith('ks2_') ? 'ks2' : 'ks3',
          badge: 'History Course',
        };
        const liveUnit = unitLookup.get(uId) || {};
        const lessonCount = Array.isArray(liveUnit.lessons) ? liveUnit.lessons.length : 0;
        let savedLessonBadge = lessonCount > 0 ? `${lessonCount} Lessons` : 'Open Course';
        try {
          const lastIdxRaw = localStorage.getItem(`hh_last_lesson_${uId}`);
          if (lastIdxRaw !== null) {
            const idxNum = parseInt(lastIdxRaw, 10);
            if (!isNaN(idxNum) && idxNum >= 0) {
              savedLessonBadge = `Resume L${idxNum + 1}`;
            }
          }
        } catch (e) {}

        const isOfflineReady = savedOfflineSet.has(uId);
        return `
          <div class="hh-pinned-card" data-group="${escapeHtml(meta.group)}" onclick="window.launchSubApp ? window.launchSubApp('${escapeHtml(uId)}') : window.switchView('lessons', '${escapeHtml(uId)}')">
            <div>
              <div class="hh-pinned-card-top">
                <span class="hh-pinned-stage-tag">${escapeHtml(meta.badge)}</span>
                <span class="hh-pinned-resume-meta">${escapeHtml(savedLessonBadge)}</span>
              </div>
              <h4 class="hh-pinned-card-name">${escapeHtml(meta.title)}</h4>
            </div>
            <div class="hh-pinned-card-footer">
              <button
                type="button"
                class="hh-offline-pill ${isOfflineReady ? 'is-saved' : ''}"
                onclick="event.stopPropagation(); window.hhSaveUnitOffline && window.hhSaveUnitOffline('${escapeHtml(uId)}', this)"
                title="Save lessons, quizzes &amp; exam trainer for offline study"
              >
                <i class="fa-solid ${isOfflineReady ? 'fa-check' : 'fa-download'}"></i>
                <span>${isOfflineReady ? 'Saved Offline' : 'Save Offline'}</span>
              </button>
              <span class="hh-pinned-open-lbl">
                <span>Open</span>
                <i class="fa-solid fa-arrow-right" style="font-size: 0.66rem;"></i>
              </span>
            </div>
          </div>
        `;
      })
      .join('');

    pinnedShelfHtml = `
      <section class="hh-pinned-shelf" aria-label="My Pinned Courses">
        <div class="hh-pinned-header">
          <div class="hh-pinned-heading-group">
            <span class="hh-pinned-badge"><i class="fa-solid fa-thumbtack"></i> My Courses</span>
            <h3 class="hh-pinned-title">My Pinned Subjects (${pinnedIds.length})</h3>
          </div>
          <div class="hh-pinned-controls">
            <button type="button" class="hh-shelf-ctrl-btn primary-outline" onclick="window.hhOpenPinUnitsModal && window.hhOpenPinUnitsModal()">
              <i class="fa-solid fa-sliders"></i>
              <span>Edit</span>
            </button>
            <button type="button" class="hh-shelf-ctrl-btn" id="hh-btn-toggle-all-courses" onclick="window.hhToggleShowAllCourses && window.hhToggleShowAllCourses()">
              <i class="fa-solid ${showAllCoursesExpanded ? 'fa-chevron-up' : 'fa-layer-group'}"></i>
              <span>${showAllCoursesExpanded ? 'Hide Others' : `All ${totalCatalogueCount}`}</span>
            </button>
          </div>
        </div>
        <div class="hh-pinned-grid">
          ${cardsHtml}
        </div>
      </section>
    `;
  }

  return `
    <div id="hh-home-launchpad" class="hh-home-launchpad ${hasAnyPersonalState ? 'hh-launchpad-active' : 'hh-launchpad-empty'} no-print">
      ${installHtml}
      ${gamificationStripHtml}
      ${primaryCardHtml}
      ${quickStripHtml}
      ${pinnedShelfHtml}
    </div>
  `;
}

export function toggleShowAllCourses() {
  showAllCoursesExpanded = !showAllCoursesExpanded;
  const dash = document.querySelector('.homepage-dashboard-container');
  const pinned = getPinnedUnits();
  if (dash) {
    dash.classList.toggle('hh-pinned-only-mode', pinned.length > 0 && !showAllCoursesExpanded);
  }
  const btn = document.getElementById('hh-btn-toggle-all-courses');
  if (btn) {
    btn.innerHTML = `
      <i class="fa-solid ${showAllCoursesExpanded ? 'fa-chevron-up' : 'fa-layer-group'}"></i>
      <span>${showAllCoursesExpanded ? 'Hide Others' : 'All 26'}</span>
    `;
  }
}

export function openPinUnitsModal(options = {}) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('hh-pin-units-modal');
  if (existing) existing.remove();

  const selectedSet = new Set(getPinnedUnits());
  const onCompleteAction = options.onCompleteAction || null;

  if (typeof window !== 'undefined' && window.history && typeof window.history.pushState === 'function') {
    try {
      window.history.pushState(
        { ...(window.history.state || {}), hhModal: 'pin-units' },
        '',
        window.location.href,
      );
      window.__hhPinModalPushedHistory = true;
    } catch (e) {}
  }

  const renderGroup = (groupKey, groupTitle) => {
    const list = CANONICAL_COURSES.filter((c) => c.group === groupKey);
    return `
      <div class="hh-modal-group-title">
        <span>${escapeHtml(groupTitle)}</span>
        <span>${list.length} Courses</span>
      </div>
      <div class="hh-pin-options-grid">
        ${list
          .map((c) => {
            const checked = selectedSet.has(c.id);
            return `
              <label class="hh-pin-option ${checked ? 'is-checked' : ''}" data-unit-option="${escapeHtml(c.id)}">
                <input type="checkbox" value="${escapeHtml(c.id)}" ${checked ? 'checked' : ''} />
                <span style="min-width:0;flex:1;line-height:1.25;">
                  <span style="display:block;font-size:0.65rem;text-transform:uppercase;color:#64748b;font-weight:800;">${escapeHtml(c.badge)}</span>
                  <span>${escapeHtml(c.title)}</span>
                </span>
              </label>
            `;
          })
          .join('')}
      </div>
    `;
  };

  const backdrop = document.createElement('div');
  backdrop.id = 'hh-pin-units-modal';
  backdrop.className = 'hh-modal-backdrop no-print';
  backdrop.innerHTML = `
    <div class="hh-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="hh-pin-modal-title">
      <div class="hh-modal-header">
        <div>
          <div style="font-size:0.68rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#2563eb;margin-bottom:3px;">
            <i class="fa-solid fa-thumbtack"></i> My Courses &amp; Class QR Setup
          </div>
          <h3 id="hh-pin-modal-title" style="margin:0;font-size:1.12rem;font-weight:800;color:#0f172a;">
            ${onCompleteAction === 'arcade' ? 'Pick a Course to Launch Arcade' : 'Choose Your History Courses'}
          </h3>
          <p style="margin:3px 0 0 0;font-size:0.78rem;color:#64748b;">
            Tick your 1&ndash;6 courses for 1-tap access, or generate a Teacher QR setup link.
          </p>
        </div>
        <button type="button" id="hh-pin-modal-close" aria-label="Close modal" style="background:#f1f5f9;border:1px solid #cbd5e1;border-radius:50%;width:36px;height:36px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;color:#334155;font-size:0.95rem;flex-shrink:0;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="hh-modal-body">
        ${renderGroup('gcse', 'Edexcel GCSE (9–1) — Years 10 & 11')}
        ${renderGroup('ks3', 'Key Stage 3 — Years 7 to 9')}
        ${renderGroup('ks2', 'Key Stage 2 — Primary History')}
        <div id="hh-modal-qr-slot"></div>
      </div>

      <div class="hh-modal-footer">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span id="hh-pin-selected-count" style="font-size:0.78rem;font-weight:800;color:#1e293b;">
            ${selectedSet.size} selected
          </span>
          <button type="button" id="hh-pin-clear-btn" style="background:none;border:none;color:#64748b;font-size:0.76rem;font-weight:700;text-decoration:underline;cursor:pointer;padding:4px;">
            Clear all
          </button>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <button type="button" id="hh-pin-qr-btn" style="background:#ffffff;color:#0f172a;border:1.5px solid #cbd5e1;border-radius:9px;padding:8px 12px;font-size:0.78rem;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
            <i class="fa-solid fa-qrcode" style="color:#2563eb;"></i>
            <span>Class QR</span>
          </button>
          <button type="button" id="hh-pin-save-btn" style="background:#2563eb;color:#ffffff;border:none;border-radius:9px;padding:9px 16px;font-size:0.82rem;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 12px rgba(37,99,235,0.28);">
            <i class="fa-solid fa-check"></i>
            <span>${onCompleteAction === 'arcade' ? 'Save & Play' : 'Save Courses'}</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const closeModal = (fromPopstate = false) => {
    const el = document.getElementById('hh-pin-units-modal');
    if (el) el.remove();
    if (!fromPopstate && window.__hhPinModalPushedHistory) {
      window.__hhPinModalPushedHistory = false;
      try {
        if (window.history && window.history.state && window.history.state.hhModal === 'pin-units') {
          window.__hhSuppressPopstateOnce = true;
          window.history.back();
        }
      } catch (e) {}
    } else {
      window.__hhPinModalPushedHistory = false;
    }
  };

  const countLabel = backdrop.querySelector('#hh-pin-selected-count');
  const updateCountUI = () => {
    if (countLabel) countLabel.textContent = `${selectedSet.size} selected`;
  };

  backdrop.querySelectorAll('.hh-pin-option input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener('change', () => {
      const id = cb.value;
      const card = cb.closest('.hh-pin-option');
      if (cb.checked) {
        selectedSet.add(id);
        if (card) card.classList.add('is-checked');
      } else {
        selectedSet.delete(id);
        if (card) card.classList.remove('is-checked');
      }
      updateCountUI();
    });
  });

  backdrop.querySelector('#hh-pin-clear-btn')?.addEventListener('click', () => {
    selectedSet.clear();
    backdrop.querySelectorAll('.hh-pin-option').forEach((lbl) => {
      lbl.classList.remove('is-checked');
      const cb = lbl.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = false;
    });
    updateCountUI();
  });

  backdrop.querySelector('#hh-pin-qr-btn')?.addEventListener('click', async () => {
    const ids = [...selectedSet];
    if (ids.length === 0) {
      showMobileShellToast('Tick at least 1 course first to create a class setup link!');
      return;
    }
    const isLocal =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseOrigin = isLocal ? LIVE_HUB_ORIGIN : window.location.origin;
    const shareUrl = `${baseOrigin}/?pin_units=${ids.join(',')}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch (e) {}

    let qrImgHtml = '';
    try {
      const QRCodeMod = await import('qrcode');
      const QRCode = QRCodeMod.default || QRCodeMod;
      const dataUrl = await QRCode.toDataURL(shareUrl, {
        width: 210,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
      });
      qrImgHtml = `<img src="${dataUrl}" alt="Class Setup QR Code" style="width:176px;height:176px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;padding:6px;display:inline-block;" />`;
    } catch (e) {
      qrImgHtml = '';
    }

    const slot = backdrop.querySelector('#hh-modal-qr-slot');
    if (slot) {
      slot.innerHTML = `
        <div class="hh-modal-qr-drawer">
          <div style="font-size:0.74rem;font-weight:800;color:#059669;margin-bottom:6px;">
            <i class="fa-solid fa-circle-check"></i> Class Setup Link Copied to Clipboard!
          </div>
          ${qrImgHtml}
          <div style="font-size:0.76rem;color:#475569;margin:6px 0 8px 0;">
            Pupils scan once or click this link in Google Classroom / Teams to pin these exact ${ids.length} ${ids.length === 1 ? 'course' : 'courses'}:
          </div>
          <div style="background:#ffffff;border:1px solid #cbd5e1;border-radius:7px;padding:7px 10px;font-family:monospace;font-size:0.73rem;color:#0f172a;overflow-x:auto;white-space:nowrap;text-align:left;">
            ${escapeHtml(shareUrl)}
          </div>
        </div>
      `;
      slot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    showMobileShellToast('Setup link copied & Teacher QR ready!');
  });

  backdrop.querySelector('#hh-pin-save-btn')?.addEventListener('click', () => {
    const saved = setPinnedUnits([...selectedSet]);
    closeModal(false);
    if (onCompleteAction === 'arcade' && saved.length > 0 && typeof window.switchView === 'function') {
      window.switchView('arcade', saved[0], false, { lessonScope: 'all', game: 'lobby' });
      return;
    }
    const activeView =
      (typeof window !== 'undefined' && window.currentView) || state.currentView || 'dashboard';
    if (activeView === 'dashboard' && typeof window.switchView === 'function') {
      window.switchView('dashboard', null, true);
    }
    showMobileShellToast(
      saved.length > 0 ? `Pinned ${saved.length} ${saved.length === 1 ? 'course' : 'courses'}!` : 'Showing all 26 courses.',
    );
  });

  backdrop.querySelector('#hh-pin-modal-close')?.addEventListener('click', () => closeModal(false));
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal(false);
  });
}

/**
 * Closes any open modal, overlay, active arcade game, or mobile drawer before back-stepping navigation.
 */
export function closeAnyOpenMobileModalOrDrawer() {
  if (typeof document === 'undefined') return { closed: false, hadHistoryEntry: false };

  // 1. Pin Units or Backup Modal
  const pinModal = document.getElementById('hh-pin-units-modal');
  if (pinModal) {
    const hadHistoryEntry = Boolean(window.__hhPinModalPushedHistory);
    window.__hhPinModalPushedHistory = false;
    pinModal.remove();
    return { closed: true, hadHistoryEntry };
  }

  const backupModal = document.getElementById('hh-backup-modal');
  if (backupModal) {
    backupModal.remove();
    return { closed: true, hadHistoryEntry: false };
  }

  // 2. Global Zoom Image Lightbox (#global-image-modal)
  const globalImgModal = document.getElementById('global-image-modal');
  if (globalImgModal) {
    globalImgModal.remove();
    return { closed: true, hadHistoryEntry: false };
  }

  // 3. Story Cards / Infographic Modal (#hub-infographic-modal)
  const infoModal = document.getElementById('hub-infographic-modal');
  if (infoModal && window.getComputedStyle(infoModal).display !== 'none') {
    if (typeof window.closeInfographicModal === 'function') {
      window.closeInfographicModal();
    } else {
      infoModal.style.display = 'none';
      document.body.style.overflow = '';
    }
    return { closed: true, hadHistoryEntry: false };
  }

  // 4. Diagnostic Benchmark Modal (#diagnostic-benchmark-modal)
  const diagModal = document.getElementById('diagnostic-benchmark-modal');
  if (diagModal && window.getComputedStyle(diagModal).display !== 'none') {
    if (typeof window.closeDiagnosticModal === 'function') {
      window.closeDiagnosticModal(true);
    } else {
      diagModal.style.display = 'none';
      document.body.style.overflow = '';
    }
    return { closed: true, hadHistoryEntry: false };
  }

  // 5. Active Arcade Game -> Step back cleanly to Arcade Lobby instead of leaving Arcade
  if (
    document.body.classList.contains('hh-arcade-playing') &&
    typeof window.__hhExitArcadeGameToLobby === 'function'
  ) {
    window.__hhExitArcadeGameToLobby();
    return { closed: true, hadHistoryEntry: false };
  }

  // 6. Keyword Search Modal
  const searchModal =
    document.getElementById('keyword-search-modal') ||
    document.getElementById('keyword-search-overlay');
  if (searchModal && window.getComputedStyle(searchModal).display !== 'none') {
    if (typeof window.closeKeywordSearch === 'function') {
      window.closeKeywordSearch();
    } else {
      searchModal.style.display = 'none';
    }
    return { closed: true, hadHistoryEntry: false };
  }

  // 7. Mobile Slide-Out Sidebar Drawer
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar && sidebar.classList.contains('mobile-open')) {
    sidebar.classList.remove('mobile-open');
    document.querySelector('.sidebar-overlay')?.classList.remove('active');
    return { closed: true, hadHistoryEntry: false };
  }

  // 8. Unit Sticky Resource Drawer
  const unitDrawer = document.getElementById('unit-sticky-drawer-shell');
  if (
    unitDrawer &&
    unitDrawer.getAttribute('data-open-panel') &&
    window.getComputedStyle(unitDrawer).display !== 'none'
  ) {
    if (typeof window.toggleUnitResourceDrawer === 'function') {
      window.toggleUnitResourceDrawer('');
    } else {
      unitDrawer.setAttribute('data-open-panel', '');
      unitDrawer.style.display = 'none';
    }
    return { closed: true, hadHistoryEntry: false };
  }

  // 9. Teacher Guidance, Mind Map Print, Video Cinema & Dynamic Fullscreen Modals
  const removableModals = [
    'unifiedTeacherGuidanceModalOverlay',
    'tmm-print-modal-backdrop',
    'teacherPrintPreviewModal',
    'emergencyCoverModal',
    'teacherGuideModal',
    'parentBriefingModal',
    'ks2WorksheetModalOverlay',
    'ks2GuidanceModalOverlay',
    'langemarckModal',
    'hotspot-whiteboard-lightbox',
    'ehub-q-drawer-backdrop',
    'ehub-rescue-backdrop',
    'reading-qr-modal-overlay',
    'task-whiteboard-modal',
    'vocab-whiteboard-modal',
    'curriculum-modal',
  ];
  for (const id of removableModals) {
    const el = document.getElementById(id);
    if (el && window.getComputedStyle(el).display !== 'none') {
      if (id === 'task-whiteboard-modal' || id === 'vocab-whiteboard-modal') {
        el.classList.remove('visible');
        el.style.display = 'none';
      } else {
        el.remove();
      }
      document.body.style.overflow = '';
      return { closed: true, hadHistoryEntry: false };
    }
  }

  const dynamicClassOverlays = document.querySelectorAll(
    '.video-theater-overlay, .slide-compare-lightbox, .cw-fullscreen-lightbox, .sem-modal-backdrop, .masterpiece-projector-overlay, .donow-speedrun-overlay',
  );
  for (const el of dynamicClassOverlays) {
    if (window.getComputedStyle(el).display !== 'none') {
      el.remove();
      document.body.style.overflow = '';
      return { closed: true, hadHistoryEntry: false };
    }
  }

  // 10. Persistent Singleton Modals (#quizModal, #debateModal, #milestoneModal)
  if (typeof window.closeQuizModal === 'function') {
    const qm = document.getElementById('quizModal');
    if (qm && window.getComputedStyle(qm).display !== 'none' && window.getComputedStyle(qm).opacity !== '0') {
      window.closeQuizModal();
      return { closed: true, hadHistoryEntry: false };
    }
  }
  if (typeof window.closeDebateModal === 'function') {
    const dm = document.getElementById('debateModal');
    if (dm && window.getComputedStyle(dm).display !== 'none' && window.getComputedStyle(dm).opacity !== '0') {
      window.closeDebateModal();
      return { closed: true, hadHistoryEntry: false };
    }
  }
  if (typeof window.closeMilestoneModal === 'function') {
    const mm = document.getElementById('milestoneModal');
    if (mm && window.getComputedStyle(mm).display !== 'none' && window.getComputedStyle(mm).opacity !== '0') {
      window.closeMilestoneModal();
      return { closed: true, hadHistoryEntry: false };
    }
  }

  // 11. Mind Map True Fullscreen Mode -> Exit fullscreen before stepping back view
  if (document.body.classList.contains('tmm-fullscreen-active')) {
    document.body.classList.remove('tmm-fullscreen-active');
    document.querySelector('.tmm-wrapper.is-true-fullscreen')?.classList.remove('is-true-fullscreen');
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    return { closed: true, hadHistoryEntry: false };
  }

  if (typeof window.closeCmeTheaterMapModal === 'function') {
    const cmeModal = document.getElementById('cme-theater-map-modal');
    if (cmeModal && window.getComputedStyle(cmeModal).display !== 'none') {
      window.closeCmeTheaterMapModal();
      return { closed: true, hadHistoryEntry: false };
    }
  }

  const previewConsole = document.getElementById('inpage-preview-console');
  if (previewConsole && window.getComputedStyle(previewConsole).display !== 'none') {
    previewConsole.style.display = 'none';
    return { closed: true, hadHistoryEntry: false };
  }

  const genericLightbox = document.querySelector(
    '#image-modal[style*="flex"], #image-modal.active, .modal-overlay.active',
  );
  if (genericLightbox && window.getComputedStyle(genericLightbox).display !== 'none') {
    genericLightbox.classList.remove('active');
    genericLightbox.style.display = 'none';
    return { closed: true, hadHistoryEntry: false };
  }

  return { closed: false, hadHistoryEntry: false };
}

/**
 * Action Handlers for Launchpad & Adaptive 5-Tab Mobile Bottom Bar
 */
export function resumeLastVisitedLesson() {
  const activeView =
    (typeof window !== 'undefined' && window.currentView) || state.currentView || 'dashboard';
  const activeUnit =
    state.selectedUnitId || (typeof window !== 'undefined' && window.currentUnitId) || '';

  // 1. If returning to Learn from Quiz/Exam/Arcade with a saved origin & scrollY, restore exact spot!
  if (
    activeView !== 'lessons' &&
    typeof window !== 'undefined' &&
    window._unitReturnOrigin &&
    window._unitReturnOrigin.view === 'lessons' &&
    typeof window.returnToSavedOrigin === 'function'
  ) {
    window.returnToSavedOrigin(window._unitReturnOrigin.unitId);
    return;
  }

  // 2. Resume last visited lesson (and restore saved reading scrollY if available)
  const last = getLastVisitedLesson();
  if (last && last.unitId && typeof window.switchView === 'function') {
    let savedScroll = 0;
    try {
      savedScroll = parseInt(
        sessionStorage.getItem(`hh_lesson_scroll_${last.unitId}_${last.lessonIndex}`) || '0',
        10,
      );
    } catch (e) {}
    window.switchView('lessons', last.unitId, false, {
      lessonIndex: last.lessonIndex,
      skipScrollToTop: savedScroll > 60,
    });
    if (savedScroll > 60) {
      setTimeout(() => {
        try {
          window.scrollTo({ top: savedScroll, left: 0, behavior: 'instant' });
        } catch (e) {
          window.scrollTo(0, savedScroll);
        }
      }, 180);
    }
    return;
  }

  // 3. Cold deep-link visitor currently on a unit
  if (activeUnit && typeof window.switchView === 'function') {
    window.switchView('lessons', activeUnit);
    return;
  }

  // 4. First pinned course
  const pinned = getPinnedUnits();
  if (pinned.length > 0 && typeof window.switchView === 'function') {
    window.switchView('lessons', pinned[0]);
    return;
  }

  openPinUnitsModal();
}

export function launchWeakSpotsPractice() {
  const summary = getDueWeakSpotSummary();
  const targetUnit = summary.topUnitId || resolveBestTargetUnitId() || 'edexcel_medicine';
  if (typeof window.switchView === 'function') {
    window.switchView('interactive', targetUnit, false, { mode: 'mistakes' });
  }
}

function getContextualLessonIndexForTool(targetUnit) {
  const activeView =
    (typeof window !== 'undefined' && window.currentView) || state.currentView || 'dashboard';
  const curUnit =
    state.selectedUnitId || (typeof window !== 'undefined' && window.currentUnitId) || '';
  if (
    activeView === 'lessons' &&
    curUnit &&
    normalizeUnitId(curUnit) === normalizeUnitId(targetUnit) &&
    typeof window !== 'undefined' &&
    typeof window.currentLessonIndex === 'number' &&
    window.currentLessonIndex >= 0
  ) {
    return window.currentLessonIndex;
  }
  return undefined;
}

function handleBottomNavQuickQuiz() {
  const targetUnit = resolveBestTargetUnitId() || 'edexcel_medicine';
  const lessonIndex = getContextualLessonIndexForTool(targetUnit);
  if (typeof window.switchView === 'function') {
    window.switchView('interactive', targetUnit, false, {
      mode: 'mcq',
      lessonIndex,
    });
  }
}

function handleBottomNavExamTrainer() {
  const targetUnit = resolveBestGcseTargetUnitId();
  const lessonIndex = getContextualLessonIndexForTool(targetUnit);
  if (typeof window.switchView === 'function') {
    window.switchView('exam-trainer', targetUnit, false, {
      lessonIndex,
    });
  }
}

function handleBottomNavArcade() {
  const targetUnit = resolveBestTargetUnitId() || 'cme_new';
  const lessonIndex = getContextualLessonIndexForTool(targetUnit);
  if (typeof window.switchView === 'function') {
    window.switchView('arcade', targetUnit, false, {
      lessonScope: typeof lessonIndex === 'number' ? lessonIndex : 'all',
      game: 'lobby',
    });
  }
}

export function syncMobileBottomNavActiveState(explicitView = null) {
  if (typeof document === 'undefined') return;
  const nav = document.getElementById('hh-mobile-bottom-nav');
  if (!nav) return;

  const showExam = shouldShowMobileExamTab();
  nav.classList.toggle('hh-bnav-4col', !showExam);

  const view =
    explicitView ||
    (typeof window !== 'undefined' && window.currentView) ||
    state.currentView ||
    'dashboard';

  let activeKey = 'home';
  if (view === 'arcade') {
    activeKey = 'arcade';
  } else if (view === 'exam-trainer' || view === 'mock-exams' || view === 'exam-practice') {
    activeKey = showExam ? 'exam' : 'lesson';
  } else if (view === 'interactive' || view === 'quiz' || view === 'donow') {
    activeKey = 'quiz';
  } else if (
    view === 'lessons' ||
    view === 'timeline' ||
    view === 'reading' ||
    view === 'guided-reading' ||
    view === 'individuals' ||
    view === 'reader' ||
    view === 'marking'
  ) {
    activeKey = 'lesson';
  }

  nav.querySelectorAll('.hh-bnav-btn').forEach((btn) => {
    const isAct = btn.getAttribute('data-nav-key') === activeKey;
    btn.classList.toggle('active', isAct);
    btn.setAttribute('aria-current', isAct ? 'page' : 'false');
  });

  const resumeDot = document.getElementById('hh-bnav-resume-dot');
  if (resumeDot) {
    resumeDot.style.display = getLastVisitedLesson() ? 'block' : 'none';
  }
}

function syncPupilMobileChromeClass() {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !document.body) return;
  const isNarrow =
    window.innerWidth < 933 ||
    (isStandaloneDisplayMode() && window.innerWidth <= 1024);
  const isStaff = document.body.classList.contains('staff-mode-active');
  const shouldPupilMode = Boolean(isNarrow && !isStaff);

  if (document.body.classList.contains('hh-mobile-pupil-mode') !== shouldPupilMode) {
    document.body.classList.toggle('hh-mobile-pupil-mode', shouldPupilMode);
  }
  if (document.body.classList.contains('hh-has-bottom-nav') !== isNarrow) {
    document.body.classList.toggle('hh-has-bottom-nav', isNarrow);
  }
  syncMobileDarkToggleIcon();
}

function initVirtualKeyboardGuard() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__hhKeyboardGuardBound) return;
  window.__hhKeyboardGuardBound = true;

  const isTextInput = (el) => {
    if (!el || !el.tagName) return false;
    const tag = el.tagName.toUpperCase();
    if (tag === 'TEXTAREA') return true;
    if (tag === 'INPUT') {
      const type = String(el.type || 'text').toLowerCase();
      return !['checkbox', 'radio', 'button', 'submit', 'range', 'file', 'color'].includes(type);
    }
    return Boolean(el.isContentEditable);
  };

  document.addEventListener(
    'focusin',
    (e) => {
      if (window.innerWidth < 933 && isTextInput(e.target)) {
        document.body?.classList?.add('hh-keyboard-open');
      }
    },
    true,
  );

  document.addEventListener(
    'focusout',
    () => {
      setTimeout(() => {
        if (!isTextInput(document.activeElement)) {
          document.body?.classList?.remove('hh-keyboard-open');
        }
      }, 90);
    },
    true,
  );
}

function injectMobileBottomBar() {
  if (typeof document === 'undefined' || !document.body) return;

  const legacyBar = document.getElementById('mobile-bottom-nav');
  if (legacyBar) legacyBar.remove();

  if (document.getElementById('hh-mobile-bottom-nav')) {
    syncMobileBottomNavActiveState();
    return;
  }

  const nav = document.createElement('nav');
  nav.id = 'hh-mobile-bottom-nav';
  nav.className = 'hh-mobile-bottom-nav mobile-bottom-nav no-print';
  nav.setAttribute('aria-label', 'Primary Mobile Navigation');

  nav.innerHTML = `
    <button type="button" class="hh-bnav-btn active" id="hh-bnav-home" data-nav-key="home" title="Home">
      <i class="fa-solid fa-house"></i>
      <span class="hh-bnav-label">Home</span>
    </button>
    <button type="button" class="hh-bnav-btn" id="hh-bnav-lesson" data-nav-key="lesson" title="Learn &amp; Read Lessons">
      <span class="hh-bnav-dot" id="hh-bnav-resume-dot" style="display:none;"></span>
      <i class="fa-solid fa-book-open"></i>
      <span class="hh-bnav-label">Learn</span>
    </button>
    <button type="button" class="hh-bnav-btn" id="hh-bnav-quiz" data-nav-key="quiz" title="Quick Quiz &amp; Gap Fill">
      <i class="fa-solid fa-bolt"></i>
      <span class="hh-bnav-label">Quiz</span>
    </button>
    <button type="button" class="hh-bnav-btn" id="hh-bnav-exam" data-nav-key="exam" title="GCSE Exam Questions &amp; Grade 9 Answers">
      <i class="fa-solid fa-bullseye"></i>
      <span class="hh-bnav-label">Exam</span>
    </button>
    <button type="button" class="hh-bnav-btn" id="hh-bnav-arcade" data-nav-key="arcade" title="Revision Arcade Games">
      <i class="fa-solid fa-gamepad"></i>
      <span class="hh-bnav-label">Arcade</span>
    </button>
  `;

  document.body.appendChild(nav);

  nav.querySelector('#hh-bnav-home')?.addEventListener('click', () => {
    closeAnyOpenMobileModalOrDrawer();
    if (typeof window.switchView === 'function') {
      window.switchView('dashboard');
    }
  });

  nav.querySelector('#hh-bnav-lesson')?.addEventListener('click', () => {
    closeAnyOpenMobileModalOrDrawer();
    resumeLastVisitedLesson();
  });

  nav.querySelector('#hh-bnav-quiz')?.addEventListener('click', () => {
    closeAnyOpenMobileModalOrDrawer();
    handleBottomNavQuickQuiz();
  });

  nav.querySelector('#hh-bnav-exam')?.addEventListener('click', () => {
    closeAnyOpenMobileModalOrDrawer();
    handleBottomNavExamTrainer();
  });

  nav.querySelector('#hh-bnav-arcade')?.addEventListener('click', () => {
    closeAnyOpenMobileModalOrDrawer();
    handleBottomNavArcade();
  });

  syncMobileBottomNavActiveState();
}

export function initMobileAppShell() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (window.__hhMobileShellInitialized) {
    applyUrlDeepLinkPins();
    injectMobileBottomBar();
    syncPupilMobileChromeClass();
    syncMobileBottomNavActiveState();
    return;
  }
  window.__hhMobileShellInitialized = true;

  window.hhRecordLastLesson = recordLastVisitedLesson;
  window.hhOpenPinUnitsModal = openPinUnitsModal;
  window.hhPinSingleUnit = pinSingleUnitQuick;
  window.hhSaveUnitOffline = saveUnitOffline;
  window.hhResumeLastLesson = resumeLastVisitedLesson;
  window.hhLaunchWeakSpotsDrill = launchWeakSpotsPractice;
  window.hhToggleShowAllCourses = toggleShowAllCourses;
  window.hhDismissInstallBanner = dismissInstallBanner;
  window.hhTriggerAppInstall = triggerAppInstall;
  window.hhSyncMobileBottomNav = syncMobileBottomNavActiveState;
  window.hhToggleMobileDarkMode = toggleMobileDarkMode;

  const didPinFromUrl = applyUrlDeepLinkPins();

  const bootDom = () => {
    injectMobileBottomBar();
    syncPupilMobileChromeClass();
    initVirtualKeyboardGuard();
    if (
      didPinFromUrl &&
      ((window.currentView || state.currentView || 'dashboard') === 'dashboard') &&
      typeof window.switchView === 'function' &&
      window.db
    ) {
      window.switchView('dashboard', null, true);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootDom, { once: true });
  } else {
    bootDom();
  }

  window.addEventListener('resize', syncPupilMobileChromeClass, { passive: true });
  if (document.body && typeof MutationObserver !== 'undefined') {
    const obs = new MutationObserver(() => {
      syncPupilMobileChromeClass();
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const curView = window.currentView || state.currentView || 'dashboard';
    if (
      curView === 'dashboard' &&
      !isInstallBannerDismissed() &&
      typeof window.switchView === 'function' &&
      window.db
    ) {
      window.switchView('dashboard', null, true);
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    dismissInstallBanner();
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      const msg = event.data;
      if (msg && msg.type === 'UNIT_SAVED_OFFLINE' && msg.unitId) {
        const resolver = pendingOfflineResolvers.get(msg.unitId);
        if (resolver) {
          pendingOfflineResolvers.delete(msg.unitId);
          resolver(Boolean(msg.ok));
        }
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('hh-pin-units-modal')) {
      closeAnyOpenMobileModalOrDrawer();
    }
  });
}

if (typeof window !== 'undefined') {
  window.hhRecordLastLesson = recordLastVisitedLesson;
  window.hhOpenPinUnitsModal = openPinUnitsModal;
  window.hhPinSingleUnit = pinSingleUnitQuick;
  window.hhSaveUnitOffline = saveUnitOffline;
  window.hhResumeLastLesson = resumeLastVisitedLesson;
  window.hhLaunchWeakSpotsDrill = launchWeakSpotsPractice;
  window.hhToggleShowAllCourses = toggleShowAllCourses;
  window.hhDismissInstallBanner = dismissInstallBanner;
  window.hhTriggerAppInstall = triggerAppInstall;
  window.hhToggleMobileDarkMode = toggleMobileDarkMode;
}
