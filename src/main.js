/**
 * Main Application Entry Point
 * Coordinates Authentication, Storage, Layout Binding, and Navigation routing.
 */

import { initAuth } from './auth.js';
import { initData } from './storage.js';
import { bindEvents } from './layout.js';
import { switchView, initNavigationUI } from './navigation.js';
import { state } from './state.js';
import { initEventDelegation } from './engine/events.js';
import { initSpeech, cancelSpeech } from './engine/speech.js';
import { initGlossaryPopover } from './engine/modals.js';
import * as staffAuthModule from './engine/staff_auth.js';
if (typeof window !== 'undefined') window.__staffAuthModule = staffAuthModule;
import {
  initKeywordSearch,
  openKeywordSearch,
  highlightTargetKeywordInLesson,
} from './keyword_search.js';
import './langemarck_myth.js';
import('./digital_textbook_reader.js');
import { initCmeMapHotkeys, renderFloatingCmeMapButton } from './cme_theater_map.js';
import './infographic_viewer.js';
import './engine/ks2_guidance.js';

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

    const passkeyValid =
      passkey === 'true' ||
      (passkey && typeof verifyStaffPasskeySync === 'function' && verifyStaffPasskeySync(passkey));

    const isAuthorized =
      isLocal ||
      hasStoredAuth ||
      params.get('role') === 'teacher' ||
      passkeyValid;

    if (isAuthorized) {
      localStorage.setItem('history_hub_teacher_mode', 'true');
      window.isTeacherMode = true;

      const showButtons = () => {
        const headerBtn = document.getElementById('btn-cover-modal');
        if (headerBtn) headerBtn.style.display = 'inline-flex';
        const sidebarBtn = document.getElementById('nav-cover-generator');
        if (sidebarBtn) sidebarBtn.style.display = 'flex';
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showButtons);
      } else {
        showButtons();
      }
    } else {
      window.isTeacherMode = false;
    }

    // Keyboard shortcut for staff: Ctrl + Shift + C or Ctrl + Shift + T
    window.addEventListener('keydown', (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === 'C' || e.key === 'c' || e.key === 'T' || e.key === 't')
      ) {
        e.preventDefault();
        if (window.isTeacherMode) {
          if (typeof window.openEmergencyCoverModal === 'function') {
            window.openEmergencyCoverModal();
          }
        } else {
          const code = prompt('History Department Staff Verification: Enter Passkey:');
          const { verifyStaffPasskeySync } = window.__staffAuthModule || {};
          if (code && typeof verifyStaffPasskeySync === 'function' && verifyStaffPasskeySync(code)) {
            localStorage.setItem('history_hub_teacher_mode', 'true');
            window.isTeacherMode = true;
            const headerBtn = document.getElementById('btn-cover-modal');
            if (headerBtn) headerBtn.style.display = 'inline-flex';
            const sidebarBtn = document.getElementById('nav-cover-generator');
            if (sidebarBtn) sidebarBtn.style.display = 'flex';
            if (typeof window.openEmergencyCoverModal === 'function') {
              window.openEmergencyCoverModal();
            }
          } else if (code !== null) {
            alert('Access denied.');
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
  initTeacherMode();

  // Bind global helper routing
  window.switchView = switchView;
  window.state = state;

  initAuth();
  initData();

  try {
    const res = await fetch(`/database.json?v=${Date.now()}`);
    state.db = await res.json();
    // Keep window.db temporarily for files not yet refactored
    window.db = state.db;
  } catch (err) {
    console.error('Failed to load database.json:', err);
    state.db = {};
    window.db = {};
  }

  // Initialize in-memory keyword & curriculum search
  initKeywordSearch(state.db);
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
  let view = urlParams.get('view');
  let unit = urlParams.get('unit');
  const initialLesson = urlParams.get('lesson');

  // Comprehensive view alias normalization for QR codes, links, and direct URLs
  const normalizeViewAndUnit = (v, u) => {
    let normView = (v || '').toLowerCase().trim();
    let normUnit = u;

    if (normView === 'usa' || normView === 'gcse_usa' || normView === 'gcse_usa_1954_1975') {
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

  const targetInitialLessonIndex =
    initialLesson !== null && !isNaN(parseInt(initialLesson, 10))
      ? parseInt(initialLesson, 10) > 0
        ? parseInt(initialLesson, 10) - 1
        : 0
      : undefined;

  switchView(view, unit, true, { lessonIndex: targetInitialLessonIndex }).then(() => {
    const resolveLessonTarget = (paramLesson, unitData) => {
      if (!unitData || !Array.isArray(unitData.lessons) || unitData.lessons.length === 0) {
        return { index: -1, lesson: null, id: null };
      }
      if (paramLesson !== null && paramLesson !== undefined && String(paramLesson).trim() !== '') {
        const rawStr = String(paramLesson).trim();
        // 1. Pure numeric index handling (supports 1-indexed e.g. 1 -> 0, or 0-indexed 0)
        // High priority: sequential lesson number parameter (e.g. ?lesson=10) represents the 10th lesson
        const hasLessonZero = (unitData.lessons[0] && (unitData.lessons[0].id === 'lesson_0' || (unitData.lessons[0].title && unitData.lessons[0].title.includes('KT 1.0'))));
        if (rawStr.toLowerCase() === 'intro' && hasLessonZero) {
          return { index: 0, lesson: unitData.lessons[0], id: unitData.lessons[0].id };
        }
        if (/^\d+$/.test(rawStr)) {
          const num = parseInt(rawStr, 10);
          const idx = hasLessonZero
            ? (num >= 0 && num < unitData.lessons.length ? num : -1)
            : (num >= 1 && num <= unitData.lessons.length ? num - 1 : num === 0 ? 0 : -1);
          if (idx !== -1 && unitData.lessons[idx]) {
            return { index: idx, lesson: unitData.lessons[idx], id: unitData.lessons[idx].id };
          }
        }
        // 2. Direct exact ID match (e.g. 'lesson_3_1', 'lesson_1_1', 'lesson_5_1')
        let idx = unitData.lessons.findIndex(
          (l) => l.id && l.id.toLowerCase() === rawStr.toLowerCase(),
        );
        if (idx !== -1) {
          return { index: idx, lesson: unitData.lessons[idx], id: unitData.lessons[idx].id };
        }
        // 3. Match by lesson number in ID prefix: e.g. 'lesson_2_trenches' or 'lesson_2' -> match 'lesson_2_trenches_haig'
        const numMatch = rawStr.match(/lesson[_-]?(\d+)/i) || rawStr.match(/^enquiry[_-]?(\d+)/i);
        if (numMatch) {
          const targetNum = parseInt(numMatch[1], 10);
          if (targetNum >= 1 && targetNum <= unitData.lessons.length) {
            const candidate = unitData.lessons[targetNum - 1];
            if (candidate) {
              return { index: targetNum - 1, lesson: candidate, id: candidate.id };
            }
          }
          idx = unitData.lessons.findIndex(
            (l) =>
              l.id &&
              (l.id.toLowerCase().startsWith(`lesson_${targetNum}_`) ||
                l.id.toLowerCase() === `lesson_${targetNum}`),
          );
          if (idx !== -1) {
            return { index: idx, lesson: unitData.lessons[idx], id: unitData.lessons[idx].id };
          }
        }
        // 4. Substring / partial match on ID
        idx = unitData.lessons.findIndex(
          (l) =>
            l.id &&
            (l.id.toLowerCase().includes(rawStr.toLowerCase()) ||
              rawStr.toLowerCase().includes(l.id.toLowerCase())),
        );
        if (idx !== -1) {
          return { index: idx, lesson: unitData.lessons[idx], id: unitData.lessons[idx].id };
        }
        // 5. Title match
        idx = unitData.lessons.findIndex(
          (l) => l.title && l.title.toLowerCase().includes(rawStr.toLowerCase()),
        );
        if (idx !== -1) {
          return { index: idx, lesson: unitData.lessons[idx], id: unitData.lessons[idx].id };
        }
      }
      return { index: -1, lesson: null, id: null };
    };

    if (view === 'lessons' && initialLesson !== null) {
      const unitDataObj =
        window.currentUnitData ||
        (window.appStore && window.appStore.state && window.appStore.state.activeUnitData);
      const resolved = resolveLessonTarget(initialLesson, unitDataObj);
      if (resolved.index !== -1 && typeof window.renderLessonByIndex === 'function') {
        window.renderLessonByIndex(resolved.index, true);
        const stageParam = urlParams.get('stage');
        if (stageParam && typeof window.jumpToNarrativeBlock === 'function') {
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
      setTimeout(() => {
        if (typeof window.openLessonInfographicModal === 'function') {
          window.openLessonInfographicModal(targetMat, uId);
        } else if (typeof window.openInfographicModal === 'function') {
          window.openInfographicModal({ slug: targetMat, unitId: uId });
        }
      }, 250);
    }

    if (window.location.hash && window.location.hash.includes('-section')) {
      setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  });

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
    const urlView = currentUrlParams.get('view');
    const urlUnit = currentUrlParams.get('unit');
    const urlLesson = currentUrlParams.get('lesson');
    const targetScrollY = e.state && typeof e.state.scrollY === 'number' ? e.state.scrollY : 0;

    let targetView = (e.state && e.state.view) || urlView;
    let targetUnit = e.state && e.state.unit !== undefined ? e.state.unit : urlUnit;

    const norm = normalizeViewAndUnit(targetView, targetUnit);
    targetView = norm.view;
    targetUnit = norm.unit;

    switchView(targetView, targetUnit, true, { skipScrollToTop: targetScrollY > 0 }).then(() => {
      // Restore lesson view if requested
      const lessonIdx =
        e.state && e.state.lessonIndex !== undefined
          ? e.state.lessonIndex
          : urlLesson !== null && !isNaN(parseInt(urlLesson, 10))
            ? parseInt(urlLesson, 10) >= 1
              ? parseInt(urlLesson, 10) - 1
              : parseInt(urlLesson, 10)
            : null;

      if (targetView === 'lessons') {
        if (lessonIdx !== null && typeof window.renderLessonByIndex === 'function') {
          window.renderLessonByIndex(lessonIdx, true);
        } else if (lessonIdx === null && typeof window.renderLessonsView === 'function') {
          window.renderLessonsView();
        }
      }

      // Restore custom tab if requested
      if (e.state && e.state.customTab) {
        const links = document.querySelectorAll('.lesson-link');
        links.forEach((l) => {
          if (l.innerText.toLowerCase().includes(e.state.customTab.replace('_', ' '))) {
            l.click();
          }
        });
      }

      // Restore scroll position smoothly
      if (targetScrollY > 0) {
        setTimeout(() => {
          window.scrollTo({ top: targetScrollY, behavior: 'instant' });
          const contentArea =
            document.getElementById('content-area') || document.getElementById('main-content');
          if (contentArea && contentArea.scrollTop !== undefined) {
            contentArea.scrollTop = targetScrollY;
          }
        }, 60);
      }
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

  // Hide the loading curtain smoothly
  setTimeout(() => {
    const curtain = document.getElementById('page-curtain');
    if (curtain) {
      curtain.classList.add('hidden');
    }
  }, 100);
});
