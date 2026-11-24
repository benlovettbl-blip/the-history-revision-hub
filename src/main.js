/**
 * Main Application Entry Point
 * Coordinates Authentication, Storage, Layout Binding, and Navigation routing.
 */

import {
  initData,
  loadDatabaseIndex,
  ensureUnitLoaded,
  ensureFullDatabaseLoaded,
} from './storage.js';
import { bindEvents } from './layout.js';
import { switchView, initNavigationUI } from './navigation.js';
import { state } from './state.js';
import { initEventDelegation } from './engine/events.js';
import { initSpeech, cancelSpeech } from './engine/speech.js';
import { initGlossaryPopover } from './engine/modals.js';
import { initDossierPopover } from './engine/narrative_annotator.js';
import * as staffAuthModule from './engine/staff_auth.js';
if (typeof window !== 'undefined') window.__staffAuthModule = staffAuthModule;
import {
  initKeywordSearch,
  openKeywordSearch,
  highlightTargetKeywordInLesson,
} from './keyword_search.js';
import { initCmeMapHotkeys, renderFloatingCmeMapButton } from './cme_theater_map.js';
import { isStaffModeActive } from './data/unit_resources_catalog.js';
import {
  resolveUnitIdFromPathname,
  resolveRouteFromPathname,
  resolveUnlistedPathname,
  isSchoolsPathname,
  getLessonSeoSlugList,
} from './data/seo_routes.js';
import { initShareUtilsGlobals } from './engine/share_utils.js';
import { openUnifiedTeacherGuidance } from './engine/teacher_guidance_modal.js';
import { initMobileAppShell } from './mobile_app_shell.js';
import './mobile_app_shell.css';
import './mobile_revision_tools.css';
import './mobile_media_touch.css';
initShareUtilsGlobals();
if (typeof window !== 'undefined') {
  window.openUnifiedTeacherGuidance = openUnifiedTeacherGuidance;
}

function purgeGDPRHistoricalCache() {
  try {
    const PURGE_KEY = 'history_hub_gdpr_cache_purged_v2';
    if (!localStorage.getItem(PURGE_KEY)) {
      if (typeof caches !== 'undefined' && caches.keys) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      }
      const keysToRemove = [
        'history_chess_club_v5',
        'history_chess_master_archive',
        'history_chess_backup_snapshot',
        'history_chess_active_session',
        'history_chess_export_history',
        'history_chess_teacher_auth',
        'history_chess_active_players',
      ];
      keysToRemove.forEach((k) => {
        try {
          localStorage.removeItem(k);
        } catch (e) {}
      });
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.includes('chess') || key.includes('leaderboard'))) {
          try {
            localStorage.removeItem(key);
          } catch (e) {}
        }
      }
      if (typeof sessionStorage !== 'undefined') {
        try {
          sessionStorage.clear();
        } catch (e) {}
      }
      if (typeof indexedDB !== 'undefined' && indexedDB.deleteDatabase) {
        try {
          indexedDB.deleteDatabase('HistoryChessDB');
        } catch (e) {}
      }
      if ('serviceWorker' in navigator && navigator.serviceWorker.getRegistrations) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const r of registrations) r.unregister();
        });
      }
      localStorage.setItem(PURGE_KEY, 'true');
    }
  } catch (err) {
    console.warn('GDPR cache purge notice:', err);
  }
}

export function syncStaffUiState() {
  const active = isStaffModeActive();
  const isPreviewPupil =
    typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem('hh_preview_as_pupil') === 'true';

  if (typeof document !== 'undefined' && document.body) {
    document.body.classList.remove('teacher-mode-active');
    document.body.classList.toggle('staff-mode-active', Boolean(active));
    document.querySelectorAll('.teacher-only-plenary-btn').forEach((btn) => {
      btn.style.display = active ? 'inline-flex' : 'none';
    });
    document.querySelectorAll('.btn-teacher-guidance-launcher').forEach((btn) => {
      btn.style.display = active ? 'inline-flex' : 'none';
    });
    document.querySelectorAll('.teacher-only-guidance-drawer').forEach((det) => {
      det.style.display = active ? 'block' : 'none';
    });
  }
  try {
    localStorage.removeItem('teacherMode');
  } catch (e) {}

  const staffSection = document.getElementById('sidebar-staff-section');
  if (staffSection) staffSection.style.display = active ? 'flex' : 'none';

  const unitWorkspace = document.getElementById('sidebar-unit-workspace');
  const unitShortcut = document.getElementById('nav-staff-portal-shortcut');
  if (unitShortcut) {
    const inUnit = unitWorkspace && unitWorkspace.style.display !== 'none';
    unitShortcut.style.display = active && inUnit ? 'flex' : 'none';
  }

  const headerBtn = document.getElementById('btn-cover-modal');
  if (headerBtn) headerBtn.style.display = active ? 'inline-flex' : 'none';
  const copyClassBtn = document.getElementById('btn-copy-class-link');
  if (copyClassBtn) {
    copyClassBtn.style.display = active ? 'inline-flex' : 'none';
    copyClassBtn.classList.toggle('staff-hidden', !active);
  }
  const sidebarBtn = document.getElementById('nav-cover-generator');
  if (sidebarBtn) sidebarBtn.style.display = active ? 'flex' : 'none';

  const toggleBtn = document.getElementById('btn-sidebar-staff-toggle');
  const toggleLabel = document.getElementById('sidebar-staff-toggle-label');
  const toggleSub = document.getElementById('sidebar-staff-toggle-sub');
  const headerStaffBtn = document.getElementById('btn-header-staff-toggle');
  const urlParams = new URLSearchParams(window.location.search || '');
  const isSafeguardLocked =
    urlParams.get('locked') === 'true' ||
    urlParams.get('mode') === 'pupil' ||
    urlParams.get('safeguard') === 'true';
  const isLocalHost =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (toggleBtn && isSafeguardLocked) {
    toggleBtn.style.display = 'none';
  } else if (toggleBtn && toggleLabel) {
    toggleBtn.style.display = 'flex';
    if (active) {
      toggleBtn.style.borderColor = 'rgba(52, 211, 153, 0.45)';
      toggleBtn.style.background = 'rgba(16, 185, 129, 0.16)';
      toggleBtn.style.color = '#ecfdf5';
      toggleBtn.title = isLocalHost
        ? 'Teacher Mode active — click to preview exact Pupil View'
        : 'Teacher Mode active — click to lock back to Pupil View';
      toggleLabel.innerHTML =
        '<i class="fa-solid fa-unlock-keyhole" style="margin-right: 6px; color: #34d399"></i>Teacher Mode ON';
      if (toggleSub) toggleSub.textContent = isLocalHost ? 'Pupil View' : 'Lock';
    } else {
      toggleBtn.style.borderColor = 'rgba(148, 163, 184, 0.28)';
      toggleBtn.style.background = 'rgba(255, 255, 255, 0.06)';
      toggleBtn.style.color = 'rgba(241, 245, 249, 0.85)';
      toggleBtn.title =
        isPreviewPupil && isLocalHost
          ? 'Currently previewing Pupil View — click to resume Teacher Mode'
          : 'Teacher / Staff Mode (Lesson Plans, Answer Keys & Schemes of Work)';
      toggleLabel.innerHTML =
        '<i class="fa-solid fa-lock" style="margin-right: 6px; font-size: 0.72rem; color: #cbd5e1"></i>Teacher / Staff Mode';
      if (toggleSub) toggleSub.textContent = isPreviewPupil && isLocalHost ? 'Pupil Preview' : '';
    }
  }

  const syncCompactStaffBtn = (btn) => {
    if (!btn) return;
    if (isSafeguardLocked) {
      btn.style.display = 'none';
      btn.classList.add('staff-hidden');
      btn.classList.remove('is-staff-active');
      return;
    }
    btn.classList.remove('staff-hidden');
    if (btn.id === 'btn-header-staff-toggle') {
      btn.style.display = 'inline-flex';
    }
    btn.classList.toggle('is-staff-active', Boolean(active));
    if (active) {
      btn.title = isLocalHost
        ? 'Teacher Mode ON — click to preview exact Pupil View'
        : 'Teacher Mode ON — click to lock back to Pupil View';
      btn.innerHTML =
        '<i class="fa-solid fa-unlock-keyhole"></i> <span class="btn-text">Teacher ON</span>';
    } else {
      btn.title =
        isPreviewPupil && isLocalHost
          ? 'Currently previewing Pupil View — click to resume Teacher Mode'
          : 'Teacher / Staff Mode (Lesson Plans, Answer Keys & Schemes of Work)';
      btn.innerHTML =
        '<i class="fa-solid fa-chalkboard-user"></i> <span class="btn-text">Teacher</span>';
    }
  };

  syncCompactStaffBtn(headerStaffBtn);
  if (typeof document !== 'undefined') {
    document.querySelectorAll('.btn-fullwidth-staff-toggle').forEach(syncCompactStaffBtn);
  }
  if (typeof syncStaffAddressBarSeed === 'function') syncStaffAddressBarSeed();
}

export function promptStaffUnlock() {
  const isLocal =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (
    isLocal &&
    typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem('hh_preview_as_pupil') === 'true'
  ) {
    sessionStorage.removeItem('hh_preview_as_pupil');
    window.isTeacherMode = true;
    syncStaffUiState();
    return true;
  }

  const code = prompt('History Department Staff Login — Enter Passkey:');
  const { verifyStaffPasskeySync } = window.__staffAuthModule || {};
  if (code && typeof verifyStaffPasskeySync === 'function' && verifyStaffPasskeySync(code)) {
    localStorage.setItem('history_hub_teacher_mode', 'true');
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('hh_preview_as_pupil');
    }
    window.isTeacherMode = true;
    syncStaffUiState();
    return true;
  }
  if (code !== null) {
    alert('Staff passkey not recognised.');
  }
  return false;
}

export function toggleGlobalStaffMode() {
  const refreshCurrent = () => {
    const curView = (window.state && window.state.currentView) || 'dashboard';
    const curUnit = (window.state && window.state.selectedUnitId) || window.currentUnitId;
    if (!isStaffModeActive() && (curView === 'department-portal' || curView === 'curriculum')) {
      switchView('dashboard');
      return;
    }
    if (curView === 'lessons' && curUnit) {
      if (typeof window.currentLessonIndex === 'number' && window.currentLessonIndex >= 0 && typeof window.viewLessonDetail === 'function') {
        window.viewLessonDetail(window.currentLessonIndex);
      } else {
        switchView('lessons', curUnit);
      }
    } else if (curView === 'mock-exams' && curUnit) {
      switchView('mock-exams', curUnit);
    }
  };

  if (isStaffModeActive()) {
    const isLocal =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('hh_preview_as_pupil', 'true');
      }
    } else {
      try {
        localStorage.removeItem('history_hub_teacher_mode');
        localStorage.removeItem('history_chess_teacher_auth');
      } catch (e) {}
    }
    window.isTeacherMode = false;
    syncStaffUiState();
    refreshCurrent();
  } else if (promptStaffUnlock()) {
    refreshCurrent();
  }
}

if (typeof window !== 'undefined') {
  window.syncStaffUiState = syncStaffUiState;
  window.promptStaffUnlock = promptStaffUnlock;
  window.toggleGlobalStaffMode = toggleGlobalStaffMode;
}

const SILENT_PUPIL_PASS_DIGESTS = new Set([
  '758389736dfb9975c2b44d6065ceb6a5b8b7424ce6215a6b403ce25be0c4477a',
  '704e0f0a489214d1c02423d8557f3a8fbe977fea0c617e02d76d48dfb6edf80b',
]);

function getStaffPupilSeedToken() {
  return String.fromCharCode(55, 52, 57, 50);
}

function syncStaffAddressBarSeed() {
  if (typeof window === 'undefined' || !window.history || !window.history.replaceState) return;
  const host = window.location.hostname;
  const isProdDomain = host === 'historyrevisionhub.co.uk' || host === 'www.historyrevisionhub.co.uk';
  if (!isProdDomain || !isStaffModeActive()) return;
  try {
    const u = new URL(window.location.href);
    const seed = getStaffPupilSeedToken();
    if (u.searchParams.get('s') !== seed) {
      u.searchParams.set('s', seed);
      window.__bypassStaffHistoryHook = true;
      window.history.replaceState(window.history.state || {}, '', u);
      window.__bypassStaffHistoryHook = false;
    }
  } catch (e) {
    window.__bypassStaffHistoryHook = false;
  }
}

function installStaffHistoryUrlAutoSeeder() {
  if (typeof window === 'undefined' || !window.history || window.__staffHistoryHookInstalled) return;
  window.__staffHistoryHookInstalled = true;

  const wrap = (origFn) =>
    function (stateObj, unused, urlArg) {
      let nextUrl = urlArg;
      const host = window.location.hostname;
      const isProdDomain =
        host === 'historyrevisionhub.co.uk' || host === 'www.historyrevisionhub.co.uk';
      if (!window.__bypassStaffHistoryHook && isProdDomain && isStaffModeActive() && urlArg) {
        try {
          const parsed = new URL(String(urlArg), window.location.origin);
          if (parsed.origin === window.location.origin) {
            parsed.searchParams.set('s', getStaffPupilSeedToken());
            nextUrl = parsed.pathname + parsed.search + parsed.hash;
          }
        } catch (e) {}
      }
      return origFn.call(this, stateObj, unused, nextUrl);
    };

  window.history.pushState = wrap(window.history.pushState);
  window.history.replaceState = wrap(window.history.replaceState);
}

if (typeof window !== 'undefined') {
  window.getStaffPupilSeedToken = getStaffPupilSeedToken;
  window.copyStaffClassLink = function (btnEl) {
    try {
      const u = new URL(window.location.href);
      const isLocal = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
      const baseOrigin = isLocal ? 'https://historyrevisionhub.co.uk' : u.origin;
      const shareUrl = new URL(u.pathname + u.search + u.hash, baseOrigin);
      shareUrl.searchParams.delete('preview');
      shareUrl.searchParams.delete('staff');
      shareUrl.searchParams.delete('passkey');
      shareUrl.searchParams.set('s', getStaffPupilSeedToken());
      const finalLink = shareUrl.toString();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(finalLink).then(() => {
          const lbl = (btnEl && btnEl.querySelector('#copy-class-link-label')) || document.getElementById('copy-class-link-label');
          if (lbl) {
            const prev = lbl.textContent;
            lbl.textContent = 'Copied!';
            setTimeout(() => {
              lbl.textContent = prev;
            }, 1800);
          }
        });
      }
      return finalLink;
    } catch (e) {
      return '';
    }
  };
}

function initSilentPupilPassPreseed() {
  try {
    installStaffHistoryUrlAutoSeeder();
    const params = new URLSearchParams(window.location.search);
    const raw = (params.get('s') || params.get('access') || '').trim().toLowerCase();
    if (raw && typeof staffAuthModule.sha256HexSync === 'function') {
      const digest = staffAuthModule.sha256HexSync('hrh_pupil_pass_v1:' + raw);
      if (SILENT_PUPIL_PASS_DIGESTS.has(digest)) {
        localStorage.setItem(
          'hh_school_pupil_licence_v1',
          JSON.stringify({ digest, scope: 'all', ts: Date.now() }),
        );
        // Strip ?s= from pupil/public address bar; keep it in Staff Mode on live domain for effortless Ctrl+C
        if (!isStaffModeActive() && window.history && window.history.replaceState) {
          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete('s');
          cleanUrl.searchParams.delete('access');
          window.history.replaceState(window.history.state || {}, '', cleanUrl);
        }
      }
    }
    syncStaffAddressBarSeed();
  } catch (e) {}
}

export function initTeacherMode() {
  try {
    const { verifyStaffPasskeySync } = window.__staffAuthModule || {};
    const isLocal =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const params = new URLSearchParams(window.location.search);
    const passkey = (params.get('passkey') || params.get('staff') || params.get('teacher') || '')
      .toLowerCase()
      .trim();

    const hasStoredAuth =
      localStorage.getItem('history_hub_teacher_mode') === 'true' ||
      localStorage.getItem('history_chess_teacher_auth') === 'true';

    const passkeyValid = Boolean(
      passkey && typeof verifyStaffPasskeySync === 'function' && verifyStaffPasskeySync(passkey),
    );

    const isPreviewPupil =
      typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem('hh_preview_as_pupil') === 'true';

    const isAuthorized = !isPreviewPupil && (isLocal || hasStoredAuth || passkeyValid);

    if (isAuthorized) {
      localStorage.setItem('history_hub_teacher_mode', 'true');
      window.isTeacherMode = true;
    } else {
      window.isTeacherMode = false;
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', syncStaffUiState);
    } else {
      syncStaffUiState();
    }

    // Keyboard shortcut for staff: Ctrl + Shift + C or Ctrl + Shift + T
    window.addEventListener('keydown', (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === 'C' || e.key === 'c' || e.key === 'T' || e.key === 't')
      ) {
        e.preventDefault();
        if (isStaffModeActive()) {
          if (typeof window.openEmergencyCoverModal === 'function') {
            window.openEmergencyCoverModal();
          }
        } else if (promptStaffUnlock()) {
          if (typeof window.openEmergencyCoverModal === 'function') {
            window.openEmergencyCoverModal();
          }
        }
      }
    });
  } catch (err) {
    console.warn('Teacher mode initialization warning:', err);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  // Execute GDPR cache, storage, and service worker scrub
  purgeGDPRHistoricalCache();

  // Initialize UI subscribers
  initNavigationUI();
  initEventDelegation();
  initSpeech();
  initGlossaryPopover();
  initDossierPopover();
  initTeacherMode();
  initSilentPupilPassPreseed();

  // Bind global helper routing
  window.switchView = switchView;
  window.state = state;

  initData();

  // Load ~5 KB course index immediately (plus target unit JSON in parallel on direct unit URLs)
  const bootUrlParams = new URLSearchParams(window.location.search);
  const bootTargetUnit =
    bootUrlParams.get('unit') || resolveUnitIdFromPathname(window.location.pathname);

  await Promise.all([
    loadDatabaseIndex(),
    bootTargetUnit ? ensureUnitLoaded(bootTargetUnit) : Promise.resolve(),
    String(bootTargetUnit || '').startsWith('ks2_')
      ? import('./engine/ks2_guidance.js')
      : Promise.resolve(),
  ]);

  // Register Ctrl+K / '/' search shortcut immediately; full curriculum index builds in idle time
  initKeywordSearch(state.db, { deferIndex: true });
  window.openKeywordSearch = openKeywordSearch;
  window.highlightTargetKeywordInLesson = highlightTargetKeywordInLesson;

  // Initialize Middle East Strategic Theater Map shortcuts
  initCmeMapHotkeys();
  renderFloatingCmeMapButton();

  bindEvents();

  // Set default theme styling active button state
  const currentTheme = state.theme || 'desert';
  const themeBtn = document.querySelector(`.theme-btn[data-theme="${currentTheme}"]`);
  if (themeBtn) {
    themeBtn.classList.add('active');
  }

  // Load view based on URL or fallback to dashboard
  const urlParams = new URLSearchParams(window.location.search);
  const isLockedBoot =
    urlParams.get('locked') === 'true' ||
    urlParams.get('mode') === 'pupil' ||
    urlParams.get('safeguard') === 'true';
  if (!isLockedBoot && urlParams.has('portal')) {
    urlParams.delete('portal');
    try {
      const cleanedBootUrl = new URL(window.location.href);
      cleanedBootUrl.searchParams.delete('portal');
      if ((cleanedBootUrl.searchParams.get('view') || 'dashboard') === 'dashboard') {
        cleanedBootUrl.searchParams.delete('stage');
        urlParams.delete('stage');
      }
      window.history.replaceState(window.history.state || {}, '', cleanedBootUrl);
    } catch (e) {}
  }
  const pathRoute = resolveRouteFromPathname(window.location.pathname);
  const pathUnit = pathRoute ? pathRoute.unitId : resolveUnitIdFromPathname(window.location.pathname);
  const pathLessonSlug = pathRoute ? pathRoute.lessonSlug : null;
  const pathIsSchools = isSchoolsPathname(window.location.pathname);
  const pathUnlistedView = resolveUnlistedPathname(window.location.pathname);
  let view = urlParams.get('view') || (pathIsSchools ? 'schools' : pathUnlistedView || null);
  let unit = urlParams.get('unit') || pathUnit;
  const initialLesson = urlParams.get('lesson') ?? pathLessonSlug;

  // Comprehensive view alias normalization for QR codes, links, and direct URLs
  const normalizeViewAndUnit = (v, u) => {
    let normView = (v || '').toLowerCase().trim();
    let normUnit = u;

    if (
      normView === 'schools' ||
      normView === 'for-schools' ||
      normView === 'for_schools' ||
      normView === 'departments' ||
      normView === 'for-departments'
    ) {
      normView = 'schools';
      normUnit = null;
    } else if (normView === 'usa' || normView === 'gcse_usa' || normView === 'gcse_usa_1954_1975') {
      normView = 'lessons';
      normUnit = 'usa';
    } else if (
      normView === 'quiz' ||
      normView === 'quizzes' ||
      normView === 'quizzing' ||
      normView === 'interactive_quiz' ||
      normView === 'interactive-quiz' ||
      normView === 'interactive' ||
      normView === 'retrieval' ||
      normView === 'practice-quizzes' ||
      normView === 'practice_quizzes'
    ) {
      normView = 'interactive';
      normUnit = normUnit || 'great_war_part2';
    } else if (
      normView === 'reading' ||
      normView === 'guided-reading' ||
      normView === 'guided_reading' ||
      normView === 'literary' ||
      normView === 'audio'
    ) {
      normView = 'reading';
      normUnit = normUnit || 'great_war_part2';
    } else if (
      normView === 'marking' ||
      normView === 'answers' ||
      normView === 'marking-bank' ||
      normView === 'marking_bank' ||
      normView === 'self-check' ||
      normView === 'self_check'
    ) {
      normView = 'marking';
      normUnit = normUnit || 'great_war_part2';
    } else if (
      normView === 'booklets' ||
      normView === 'workbooks' ||
      normView === 'workbook' ||
      normView === 'pdf' ||
      normView === 'pdfs' ||
      normView === 'textbook' ||
      normView === 'textbooks'
    ) {
      normView = 'booklet';
    } else if (normView === 'lesson' || normView === 'lessons' || normView === 'unit') {
      normView = 'lessons';
      normUnit = normUnit || 'great_war_part2';
    } else if (normView === 'trend-radar' || normView === 'matrix' || normView === 'exam-matrix') {
      normView = 'mock-exams';
    } else if (normView === 'department' || normView === 'department_portal' || normView === 'portal') {
      normView = 'department-portal';
    } else if (normView === 'curriculum_map' || normView === 'curriculum') {
      normView = 'curriculum';
    } else if (normView === 'arena' || normView === 'competitions' || normView === 'competitions_zone') {
      normView = 'competitions';
    } else if (
      normView === 'revision_guides' ||
      normView === 'revision-guides' ||
      normView === 'exam_technique' ||
      normView === 'exam-technique'
    ) {
      normView = 'curriculum';
    } else if (normView === 'gallery') {
      normView = 'masterpiece';
    } else if (normView === 'textbook-reader') {
      normView = 'reader';
    } else if (!normView && normUnit) {
      normView = 'lessons';
    } else if (!normView) {
      normView = 'dashboard';
    }

    return { view: normView, unit: normUnit };
  };

  const initialNorm = normalizeViewAndUnit(view, unit);
  view = initialNorm.view;
  unit = initialNorm.unit;

  // Seed the initial history state so e.state is never null on popstate back to initial landing
  if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
    try {
      window.history.replaceState(
        {
          view: view,
          unit: unit,
          lessonIndex:
            initialLesson !== null && !isNaN(parseInt(initialLesson, 10))
              ? parseInt(initialLesson, 10)
              : undefined,
          scrollY: window.scrollY || 0,
        },
        '',
        window.location.href,
      );
    } catch (err) {}
  }

  // Global draft preservation flush before navigation or page unload
  const flushDraftState = () => {
    try {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.classList?.contains('student-answer-input') ||
          activeEl.classList?.contains('student-task-input') ||
          activeEl.id === 'epz-user-answer' ||
          activeEl.classList?.contains('form-control'))
      ) {
        const key = activeEl.dataset.draftKey || activeEl.id;
        if (key && activeEl.value) {
          localStorage.setItem(key, activeEl.value);
        }
      }
    } catch (err) {}
  };
  window.addEventListener('beforeunload', () => {
    cancelSpeech();
    flushDraftState();
  });

  // Shared URL lesson resolver (supports slugs like 'kt1.1-end-of-mandate', 'intro', hasLessonZero-aware numbers, IDs & aliases)
  const resolveLessonTarget = (paramLesson, unitData) => {
    if (!unitData || !Array.isArray(unitData.lessons) || unitData.lessons.length === 0) {
      return { index: -1, lesson: null, id: null };
    }
    if (paramLesson !== null && paramLesson !== undefined && String(paramLesson).trim() !== '') {
      const rawStr = String(paramLesson).trim();
      const hasLessonZero = Boolean(
        unitData.lessons[0] &&
          (unitData.lessons[0].id === 'lesson_0' ||
            (unitData.lessons[0].title && unitData.lessons[0].title.includes('KT 1.0'))),
      );
      if (rawStr.toLowerCase() === 'intro' && hasLessonZero) {
        return { index: 0, lesson: unitData.lessons[0], id: unitData.lessons[0].id };
      }
      // 1. Pure numeric index handling (hasLessonZero-aware)
      if (/^\d+$/.test(rawStr)) {
        const num = parseInt(rawStr, 10);
        const idx = hasLessonZero
          ? num >= 0 && num < unitData.lessons.length
            ? num
            : -1
          : num >= 1 && num <= unitData.lessons.length
            ? num - 1
            : num === 0
              ? 0
              : -1;
        if (idx !== -1 && unitData.lessons[idx]) {
          return { index: idx, lesson: unitData.lessons[idx], id: unitData.lessons[idx].id };
        }
      }
      // 2. Direct exact ID, readable slug, computed SEO slug, or alias_ids match
      const lowerRaw = rawStr.toLowerCase();
      const computedSeoSlugs = getLessonSeoSlugList(unitData.lessons);
      let idx = unitData.lessons.findIndex(
        (l, lIdx) =>
          computedSeoSlugs[lIdx] === lowerRaw ||
          (l.id && l.id.toLowerCase() === lowerRaw) ||
          (l.slug && l.slug.toLowerCase() === lowerRaw) ||
          (Array.isArray(l.alias_ids) &&
            l.alias_ids.some((a) => String(a).toLowerCase() === lowerRaw)),
      );
      if (idx !== -1) {
        return { index: idx, lesson: unitData.lessons[idx], id: unitData.lessons[idx].id };
      }
      // 3. Match by lesson number in ID prefix: e.g. 'lesson_2_trenches' or 'lesson_2'
      const numMatch = rawStr.match(/lesson[_-]?(\d+)/i) || rawStr.match(/^enquiry[_-]?(\d+)/i);
      if (numMatch) {
        const targetNum = parseInt(numMatch[1], 10);
        idx = unitData.lessons.findIndex(
          (l) =>
            l.id &&
            (l.id.toLowerCase().startsWith(`lesson_${targetNum}_`) ||
              l.id.toLowerCase() === `lesson_${targetNum}`),
        );
        if (idx !== -1) {
          return { index: idx, lesson: unitData.lessons[idx], id: unitData.lessons[idx].id };
        }
        const fallbackIdx = hasLessonZero ? targetNum : targetNum - 1;
        if (fallbackIdx >= 0 && fallbackIdx < unitData.lessons.length && unitData.lessons[fallbackIdx]) {
          return {
            index: fallbackIdx,
            lesson: unitData.lessons[fallbackIdx],
            id: unitData.lessons[fallbackIdx].id,
          };
        }
      }
      // 4. Substring / partial match on ID or slug
      idx = unitData.lessons.findIndex(
        (l) =>
          (l.id &&
            (l.id.toLowerCase().includes(lowerRaw) || lowerRaw.includes(l.id.toLowerCase()))) ||
          (l.slug &&
            (l.slug.toLowerCase().includes(lowerRaw) || lowerRaw.includes(l.slug.toLowerCase()))),
      );
      if (idx !== -1) {
        return { index: idx, lesson: unitData.lessons[idx], id: unitData.lessons[idx].id };
      }
      // 5. Title match
      idx = unitData.lessons.findIndex(
        (l) => l.title && l.title.toLowerCase().includes(lowerRaw),
      );
      if (idx !== -1) {
        return { index: idx, lesson: unitData.lessons[idx], id: unitData.lessons[idx].id };
      }
    }
    return { index: -1, lesson: null, id: null };
  };

  await switchView(view, unit, true);

  if (view === 'lessons' && initialLesson !== null) {
    const unitDataObj =
      window.currentUnitData ||
      (window.appStore && window.appStore.state && window.appStore.state.activeUnitData) ||
      (typeof window.getUnitData === 'function' ? window.getUnitData(unit) : null);
    const resolved = resolveLessonTarget(initialLesson, unitDataObj);
    if (resolved.index !== -1) {
      if (window.currentLessonIndex !== resolved.index) {
        if (typeof window.viewLessonDetail === 'function') {
          window.viewLessonDetail(resolved.index, null, true);
        } else if (typeof window.renderLessonByIndex === 'function') {
          window.renderLessonByIndex(resolved.index, true);
        }
      }
      try {
        window.history.replaceState(
          {
            ...(window.history.state || {}),
            view: 'lessons',
            unit: unit,
            lessonIndex: resolved.index,
          },
          '',
          window.location.href,
        );
      } catch (err) {}
      if (typeof window.updateHeaderBackBtn === 'function') {
        window.updateHeaderBackBtn('lessons');
      }
      const stageParam = urlParams.get('stage');
      if (stageParam && typeof window.jumpToNarrativeBlock === 'function') {
        try {
          const cleanStageUrl = new URL(window.location.href);
          cleanStageUrl.searchParams.delete('stage');
          window.history.replaceState(window.history.state || {}, '', cleanStageUrl);
        } catch (e) {}
        setTimeout(() => {
          window.jumpToNarrativeBlock(stageParam);
        }, 220);
      }
    }
  }

  // Direct Fullscreen Mobile QR Quiz Experience
  const quizParam = (urlParams.get('quiz') || '').toLowerCase();
  const isQuizRequested =
    quizParam === 'true' ||
    quizParam === '1' ||
    quizParam === 'kt1' ||
    quizParam === 'kt2' ||
    quizParam === 'kt3' ||
    quizParam.startsWith('lesson');

  if (isQuizRequested && typeof window.startQuiz === 'function') {
    const unitData =
      window.currentUnitData ||
      (window.appStore && window.appStore.state && window.appStore.state.activeUnitData);
    const resolved = resolveLessonTarget(initialLesson, unitData);
    let targetLesson = resolved.lesson;
    let lessonId = resolved.id;

    if (
      !targetLesson &&
      unitData &&
      Array.isArray(unitData.lessons) &&
      unitData.lessons.length > 0
    ) {
      const fallbackIdx = quizParam === 'kt2' ? 4 : quizParam === 'kt3' ? 9 : 0;
      targetLesson = unitData.lessons[fallbackIdx] || unitData.lessons[0];
      lessonId = targetLesson ? targetLesson.id : `lesson_${fallbackIdx + 1}`;
    }

    if (lessonId) {
      setTimeout(() => {
        window.startQuiz(lessonId, true);
      }, 120);
    }
  }

  // Direct Emergency Cover Generator Modal Experience
  const isCoverRequested =
    urlParams.get('cover') === 'true' ||
    urlParams.get('cover') === '1' ||
    urlParams.get('view') === 'cover';

  if (isCoverRequested && typeof window.openEmergencyCoverModal === 'function') {
    const uId = unit || 'cme_new';
    setTimeout(() => {
      window.openEmergencyCoverModal(uId);
    }, 150);
  }

  // Direct Infographic / Revision Mat Modal Experience
  const matParam = urlParams.get('mat') || urlParams.get('infographic');
  if (matParam) {
    const uId = unit || 'edexcel_medicine';
    const targetMat =
      matParam === 'true' || matParam === '1'
        ? initialLesson || 'lesson_3_5'
        : matParam;
    import('./infographic_viewer.js').then(() => {
      setTimeout(() => {
        if (typeof window.openLessonInfographicModal === 'function') {
          window.openLessonInfographicModal(targetMat, uId);
        } else if (typeof window.openInfographicModal === 'function') {
          window.openInfographicModal({ slug: targetMat, unitId: uId });
        }
      }, 120);
    });
  }

  if (window.location.hash && window.location.hash.includes('-section')) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }

  // Intelligent Popstate Handler: URL-Aware & Scroll-Restoring
  window.addEventListener('popstate', (e) => {
    flushDraftState();

    // Check if triggered by an in-page hash jump (e.g. #year11-section)
    if (window.location.hash && window.location.hash.includes('-section')) {
      const targetEl = document.querySelector(window.location.hash);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    const currentUrlParams = new URLSearchParams(window.location.search);
    const popRoute = resolveRouteFromPathname(window.location.pathname);
    const pathUnit = popRoute ? popRoute.unitId : resolveUnitIdFromPathname(window.location.pathname);
    const pathIsSchools = isSchoolsPathname(window.location.pathname);
    const pathUnlisted = resolveUnlistedPathname(window.location.pathname);
    const urlView = currentUrlParams.get('view') || (pathIsSchools ? 'schools' : pathUnlisted || null);
    const urlUnit = currentUrlParams.get('unit') || pathUnit;
    const urlLesson = currentUrlParams.get('lesson') ?? (popRoute ? popRoute.lessonSlug : null);
    const targetScrollY = e.state && typeof e.state.scrollY === 'number' ? e.state.scrollY : 0;

    let targetView = (e.state && e.state.view) || urlView;
    let targetUnit = e.state && e.state.unit !== undefined ? e.state.unit : urlUnit;

    const norm = normalizeViewAndUnit(targetView, targetUnit);
    targetView = norm.view;
    targetUnit = norm.unit;

    if (
      targetView === 'timeline' &&
      e.state &&
      typeof e.state.timelineMilestoneIdx === 'number'
    ) {
      window._cmeRestoreMilestoneIdx = e.state.timelineMilestoneIdx;
    }

    if (targetScrollY > 0) {
      window._suppressLessonAutoScrollTop = true;
    }

    switchView(targetView, targetUnit, true, { skipScrollToTop: true }).then(() => {
      const unitDataObj =
        window.currentUnitData ||
        (window.appStore && window.appStore.state && window.appStore.state.activeUnitData) ||
        (typeof window.getUnitData === 'function' ? window.getUnitData(targetUnit) : null);

      let lessonIdx = null;
      if (e.state && typeof e.state.lessonIndex === 'number' && e.state.lessonIndex >= 0) {
        lessonIdx = e.state.lessonIndex;
      } else if (urlLesson !== null && String(urlLesson).trim() !== '') {
        const resolved = resolveLessonTarget(urlLesson, unitDataObj);
        if (resolved.index !== -1) {
          lessonIdx = resolved.index;
        }
      }

      if (targetView === 'lessons') {
        if (lessonIdx !== null && lessonIdx >= 0) {
          if (window.currentLessonIndex !== lessonIdx) {
            if (typeof window.renderLessonByIndex === 'function') {
              window.renderLessonByIndex(lessonIdx, true);
            } else if (typeof window.viewLessonDetail === 'function') {
              window.viewLessonDetail(lessonIdx, null, true);
            }
          }
          window.currentLessonIndex = lessonIdx;
        } else {
          const wasInLesson = typeof window.currentLessonIndex === 'number';
          window.currentLessonIndex = null;
          window._unitReturnOrigin = null;
          if (wasInLesson && typeof window.renderLessonsView === 'function') {
            window.renderLessonsView();
          }
        }
        if (typeof window.updateHeaderBackBtn === 'function') {
          window.updateHeaderBackBtn('lessons');
        }
      } else {
        window.currentLessonIndex = null;
        if (typeof window.updateHeaderBackBtn === 'function') {
          window.updateHeaderBackBtn(targetView);
        }
      }

      window._suppressLessonAutoScrollTop = false;

      // Restore custom tab if requested
      if (e.state && e.state.customTab) {
        const links = document.querySelectorAll('.lesson-link');
        links.forEach((l) => {
          if (l.innerText.toLowerCase().includes(e.state.customTab.replace('_', ' '))) {
            l.click();
          }
        });
      }

      // Restore scroll position reliably after view/lesson layout via rAF + 180ms timeout
      const applyPopScroll = () => {
        const docEl = document.documentElement;
        const prevBehavior = docEl ? docEl.style.scrollBehavior : '';
        if (docEl) docEl.style.scrollBehavior = 'auto';
        try {
          window.scrollTo({ top: targetScrollY, left: 0, behavior: 'instant' });
        } catch (err) {
          window.scrollTo(0, targetScrollY);
        }
        if (docEl) {
          docEl.scrollTop = targetScrollY;
          docEl.style.scrollBehavior = prevBehavior;
        }
        if (document.body) document.body.scrollTop = targetScrollY;
        const contentArea =
          document.getElementById('content-area') || document.getElementById('main-content');
        if (contentArea && contentArea.scrollTop !== undefined && contentArea !== document.body) {
          const style = window.getComputedStyle(contentArea);
          if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
            contentArea.scrollTop = targetScrollY;
          }
        }
      };

      requestAnimationFrame(() => {
        applyPopScroll();
        requestAnimationFrame(applyPopScroll);
      });
      setTimeout(applyPopScroll, 180);
    });
  });

  // Offline / Online Connectivity Indicator for Battlefield Tour
  const updateNetworkStatus = () => {
    let offlinePill = document.getElementById('offline-status-pill');
    if (!navigator.onLine) {
      if (!offlinePill) {
        offlinePill = document.createElement('div');
        offlinePill.id = 'offline-status-pill';
        offlinePill.className = 'offline-status-pill no-print';
        offlinePill.innerHTML =
          '<i class="fa-solid fa-plane-slash"></i> <span>Offline Mode · Field Guide Available</span>';
        document.body.appendChild(offlinePill);
      }
      offlinePill.style.display = 'flex';
    } else if (offlinePill) {
      offlinePill.innerHTML = '<i class="fa-solid fa-check"></i> <span>Online Reconnected</span>';
      offlinePill.style.background = '#059669';
      setTimeout(() => {
        if (offlinePill) offlinePill.style.display = 'none';
      }, 2500);
    }
  };

  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  if (!navigator.onLine) updateNetworkStatus();

  // Lift the loading curtain on the very next paint frame once initial view is rendered
  requestAnimationFrame(() => {
    const curtain = document.getElementById('page-curtain');
    if (curtain) {
      curtain.classList.add('hidden');
    }

    // Pre-warm full search corpus only if the user hovers/focuses the header search bar
    const headerSearchEl = document.getElementById('header-search-bar');
    if (headerSearchEl) {
      const warmSearchOnce = () => {
        ensureFullDatabaseLoaded();
        headerSearchEl.removeEventListener('mouseenter', warmSearchOnce);
        headerSearchEl.removeEventListener('focus', warmSearchOnce);
      };
      headerSearchEl.addEventListener('mouseenter', warmSearchOnce, { passive: true });
      headerSearchEl.addEventListener('focus', warmSearchOnce, { passive: true });
    }

    // Schedule lightweight UI tool chunks after page settles (never auto-downloads 20.7 MB database.json)
    const runIdleWarmup = () => {
      import('./infographic_viewer.js');
      import('./digital_textbook_reader.js');
      import('./engine/ks2_guidance.js');
      import('./langemarck_myth.js');
    };
    setTimeout(() => {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(runIdleWarmup, { timeout: 3000 });
      } else {
        runIdleWarmup();
      }
    }, 1800);
  });
});
