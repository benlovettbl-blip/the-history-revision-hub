/**
 * Navigation & Routing Controller for GCSE History Study & Revision Portal
 */

import { appStore } from './engine/store.js';
import { state } from './state.js';
import { ensureUnitLoaded, ensureFullDatabaseLoaded } from './storage.js';
import {
  renderDashboard,
  renderInteractiveQuiz,
  renderTimeline,
  renderIndividualsView,
  renderBookletView,
  renderMockExamsView,
  renderLessonsView,
  renderMasterpieceView,
  renderDigitalReaderView,
  renderReadingView,
  renderMarkingView,
} from './views.js'; // Trigger HMR
import { jumpToKeyIndividual } from './key_individuals.js';
import { isStaffModeActive, getUnitCatalogEntry } from './data/unit_resources_catalog.js';
import {
  getCleanPathForUnit,
  getSeoRouteForUnit,
  resolveRouteFromPathname,
  resolveUnitIdFromPathname,
  resolveUnlistedPathname,
  isSchoolsPathname,
  SCHOOLS_SEO_PAGE,
  SITE_ORIGIN,
} from './data/seo_routes.js';
import {
  initMobileAppShell,
  syncMobileBottomNavActiveState,
  closeAnyOpenMobileModalOrDrawer,
} from './mobile_app_shell.js';

export { jumpToKeyIndividual };

const DEFAULT_DOCUMENT_TITLE =
  'The History Revision Hub | UK KS2, KS3 & Edexcel GCSE History Revision';
const DEFAULT_META_DESCRIPTION =
  'Interactive UK History learning and revision platform for Key Stage 2, Key Stage 3, and Pearson Edexcel GCSE (9–1) History—featuring primary sources, studio audio read-alouds, retrieval quizzes, and revision games.';

function syncDynamicSeoMetadata(viewName, unitId) {
  if (typeof document === 'undefined') return;
  const isSchools = viewName === 'schools';
  const route =
    !isSchools && viewName !== 'dashboard' && unitId ? getSeoRouteForUnit(unitId) : null;
  const nextTitle = isSchools
    ? SCHOOLS_SEO_PAGE.seoTitle
    : route
      ? route.seoTitle
      : DEFAULT_DOCUMENT_TITLE;
  const nextDesc = isSchools
    ? SCHOOLS_SEO_PAGE.metaDescription
    : route
      ? route.metaDescription
      : DEFAULT_META_DESCRIPTION;
  const nextCanonical = isSchools
    ? `${SITE_ORIGIN}/schools/`
    : route
      ? `${SITE_ORIGIN}/${route.slug}/`
      : `${SITE_ORIGIN}/`;

  document.title = nextTitle;
  const descEl = document.querySelector('meta[name="description"]');
  if (descEl) descEl.setAttribute('content', nextDesc);
  const canonicalEl = document.querySelector('link[rel="canonical"]');
  if (canonicalEl) canonicalEl.setAttribute('href', nextCanonical);
}

function isKs2UnitIdentifier(unitId, unitData = {}) {
  return Boolean(
    unitData?.is_ks2 ||
      unitData?.keyStage === 'KS2' ||
      unitData?.key_stage === 'KS2' ||
      String(unitId || unitData?.id || '').toLowerCase().startsWith('ks2_'),
  );
}

export function syncKs2PortalState(unitId = null, unitData = null, viewName = null) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  const urlParams = new URLSearchParams(window.location.search);
  const portalParam = (urlParams.get('portal') || '').toLowerCase();
  const isLockedKs2 =
    portalParam === 'ks2' &&
    (urlParams.get('locked') === 'true' ||
      urlParams.get('mode') === 'pupil' ||
      urlParams.get('safeguard') === 'true');

  if (!isLockedKs2) {
    try {
      sessionStorage.removeItem('hh_portal');
    } catch (e) {}
  }

  const activeView = viewName || appStore.state.currentView || state.currentView || urlParams.get('view') || 'dashboard';
  const isGlobalHubView =
    activeView === 'dashboard' ||
    activeView === 'schools' ||
    activeView === 'curriculum' ||
    activeView === 'department-portal' ||
    activeView === 'competitions' ||
    activeView === 'chess';

  const unitParam = isGlobalHubView
    ? null
    : unitId || urlParams.get('unit') || state.selectedUnitId || window.currentUnitId;
  const resolvedData = isGlobalHubView
    ? {}
    : unitData || state.activeUnitData || window.currentUnitData || {};

  const isKs2UnitContext = Boolean(
    isLockedKs2 || (!isGlobalHubView && isKs2UnitIdentifier(unitParam, resolvedData)),
  );

  if (document.body) {
    document.body.classList.toggle('ks2-mode-active', isKs2UnitContext);
  }

  // Keep search bar placeholder contextual when inside a KS2 unit, normal everywhere else
  const activeKs2Id = unitParam || (resolvedData && resolvedData.id) || '';
  const ks2PillHints = {
    ks2_stone_to_iron_age: 'Search Stone Age...',
    ks2_romans: 'Search Romans...',
    ks2_anglo_saxons_vikings: 'Search Saxons...',
    ks2_ancient_egypt: 'Search Egypt...',
    ks2_ancient_greece: 'Search Greece...',
    ks2_early_islamic_baghdad: 'Search Baghdad...',
    ks2_maya_civilisation: 'Search Maya...',
  };
  const ks2ModalHints = {
    ks2_stone_to_iron_age: 'Search Stonehenge, Skara Brae, Bronze Age, Hillforts...',
    ks2_romans: 'Search Romans, Celts, Boudicca, Hadrian...',
    ks2_anglo_saxons_vikings: 'Search Saxons, Vikings, Sutton Hoo, Alfred...',
    ks2_ancient_egypt: 'Search Nile, Pyramids, Hieroglyphs, Tutankhamun...',
    ks2_ancient_greece: 'Search Athens, Sparta, Olympics, Alexander...',
    ks2_early_islamic_baghdad: 'Search Baghdad, House of Wisdom, Silk Road, Astrolabe...',
    ks2_maya_civilisation: 'Search Tikal, Palenque, Maya Glyphs, Cacao, Chichén Itzá...',
  };
  const ks2SearchPillHint = ks2PillHints[activeKs2Id] || 'Search WWII...';
  const ks2SearchModalHint = ks2ModalHints[activeKs2Id] || 'Search WWII topics, evacuees, Blitz...';
  const searchPlaceholder = document.querySelector('#header-search-bar .search-placeholder');
  if (searchPlaceholder) {
    searchPlaceholder.textContent = isKs2UnitContext
      ? ks2SearchPillHint
      : 'Search hub...';
  }
  const searchModalInput = document.getElementById('keyword-search-input');
  if (searchModalInput) {
    searchModalInput.placeholder = isKs2UnitContext
      ? ks2SearchModalHint
      : 'Search keywords, lessons, concepts...';
  }

  updateHeaderBackBtn(activeView);

  const footer = document.getElementById('app-global-footer');
  if (footer) footer.style.display = isKs2UnitContext ? 'none' : '';

  return isKs2UnitContext;
}
window.syncKs2PortalState = syncKs2PortalState;

export function getUnitData(unitId) {
  const id =
    unitId ||
    state.selectedUnitId ||
    (typeof window !== 'undefined' && window.currentUnitId) ||
    (appStore && appStore.state && appStore.state.selectedUnitId);
  if (!id) {
    return (
      state.activeUnitData ||
      (typeof window !== 'undefined' && window.currentUnitData) ||
      {}
    );
  }
  if (
    state.selectedUnitId === id &&
    state.activeUnitData &&
    Array.isArray(state.activeUnitData.lessons)
  ) {
    return state.activeUnitData;
  }
  if (
    typeof window !== 'undefined' &&
    window.currentUnitId === id &&
    window.currentUnitData &&
    Array.isArray(window.currentUnitData.lessons)
  ) {
    return window.currentUnitData;
  }
  if (state.db && state.db[id]) {
    const payload = state.db[id];
    return payload.data || (payload.lessons ? payload : {});
  }
  return (
    state.activeUnitData ||
    (typeof window !== 'undefined' && window.currentUnitData) ||
    {}
  );
}
if (typeof window !== 'undefined') {
  window.getUnitData = getUnitData;
}

export function saveUnitReturnOrigin(customOrigin = null) {
  if (typeof window === 'undefined') return;
  const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;

  if (window.history && typeof window.history.replaceState === 'function') {
    try {
      const extraHistory = {};
      if (
        (window.currentView === 'timeline' || customOrigin?.view === 'timeline') &&
        typeof (customOrigin?.timelineMilestoneIdx ?? window._cmeActiveMilestoneIdx) === 'number'
      ) {
        extraHistory.timelineMilestoneIdx =
          customOrigin?.timelineMilestoneIdx ?? window._cmeActiveMilestoneIdx;
      }
      window.history.replaceState(
        { ...(window.history.state || {}), scrollY: currentScroll, ...extraHistory },
        '',
        window.location.href,
      );
    } catch (e) {}
  }

  if (customOrigin && typeof customOrigin === 'object') {
    window._unitReturnOrigin = {
      scrollY: currentScroll,
      ...customOrigin,
    };
    window._unitReturnOriginSavedTs = Date.now();
    window._unitReturnOriginCustomTs = Date.now();
    return;
  }

  if (
    window._unitReturnOrigin &&
    window._unitReturnOriginCustomTs &&
    Date.now() - window._unitReturnOriginCustomTs < 140
  ) {
    return;
  }

  const activeView =
    window.currentView ||
    (appStore && appStore.state && appStore.state.currentView) ||
    state.currentView ||
    'dashboard';
  const activeUnit =
    window.currentUnitId ||
    state.selectedUnitId ||
    (appStore && appStore.state && appStore.state.selectedUnitId);

  if (
    activeView === 'lessons' &&
    typeof window.currentLessonIndex === 'number' &&
    window.currentLessonIndex >= 0 &&
    activeUnit
  ) {
    const uData = getUnitData(activeUnit);
    const lessonsList = (uData && (uData.lessons || uData.subtopics)) || [];
    const lesson = lessonsList[window.currentLessonIndex] || null;
    const shortLabel =
      (lesson?.title?.match(/^(KT\s*\d+\.\d+|Lesson\s*\d+|Enquiry\s*\d+)/i)?.[0]) || 'Lesson';
    window._unitReturnOrigin = {
      view: 'lessons',
      unitId: activeUnit,
      lessonIndex: window.currentLessonIndex,
      slug: lesson?.slug || null,
      shortLabel,
      scrollY: currentScroll,
    };
    window._unitReturnOriginSavedTs = Date.now();
  } else if (activeView === 'timeline' && activeUnit) {
    window._unitReturnOrigin = {
      view: 'timeline',
      unitId: activeUnit,
      timelineMilestoneIdx: window._cmeActiveMilestoneIdx ?? 0,
      shortLabel: 'Living Chronology',
      scrollY: currentScroll,
    };
    window._unitReturnOriginSavedTs = Date.now();
  } else if (activeView === 'lessons' && activeUnit) {
    window._unitReturnOrigin = null;
  }
}
if (typeof window !== 'undefined') {
  window.saveUnitReturnOrigin = saveUnitReturnOrigin;
}

export function getReturnOriginLabel(unitId, fallback = 'Unit Overview') {
  const targetUnit =
    unitId ||
    state.selectedUnitId ||
    (typeof window !== 'undefined' && window.currentUnitId);
  if (
    typeof window !== 'undefined' &&
    window._unitReturnOrigin &&
    window._unitReturnOrigin.unitId === targetUnit &&
    window._unitReturnOrigin.shortLabel
  ) {
    return 'Back to ' + window._unitReturnOrigin.shortLabel;
  }
  return fallback;
}
if (typeof window !== 'undefined') {
  window.getReturnOriginLabel = getReturnOriginLabel;
}

function restoreSavedScrollPosition(yVal) {
  if (typeof window === 'undefined') return;
  const targetTop = Math.max(0, Number(yVal) || 0);
  const applyScroll = () => {
    const docEl = document.documentElement;
    const prevBehavior = docEl ? docEl.style.scrollBehavior : '';
    if (docEl) docEl.style.scrollBehavior = 'auto';
    try {
      window.scrollTo({ top: targetTop, left: 0, behavior: 'instant' });
    } catch (e) {
      window.scrollTo(0, targetTop);
    }
    if (docEl) {
      docEl.scrollTop = targetTop;
      docEl.style.scrollBehavior = prevBehavior;
    }
    if (document.body) document.body.scrollTop = targetTop;
  };
  requestAnimationFrame(() => {
    applyScroll();
    requestAnimationFrame(applyScroll);
  });
  setTimeout(applyScroll, 150);
  setTimeout(applyScroll, 280);
}

export function returnToSavedOrigin(unitId) {
  const targetUnit =
    unitId ||
    state.selectedUnitId ||
    (typeof window !== 'undefined' && window.currentUnitId);

  if (
    typeof window !== 'undefined' &&
    window._unitReturnOrigin &&
    window._unitReturnOrigin.unitId === targetUnit
  ) {
    const orig = { ...window._unitReturnOrigin };
    window._unitReturnOrigin = null;
    window._unitReturnOriginCustomTs = 0;

    if (orig.view === 'lessons' && typeof orig.lessonIndex === 'number') {
      window._suppressLessonAutoScrollTop = true;
      switchView('lessons', orig.unitId, false, {
        skipScrollToTop: true,
        returningToOrigin: true,
      }).then(() => {
        if (typeof window.renderLessonByIndex === 'function') {
          window.renderLessonByIndex(orig.lessonIndex);
        } else if (typeof window.viewLessonDetail === 'function') {
          window.viewLessonDetail(orig.lessonIndex);
        }
        window._suppressLessonAutoScrollTop = false;
        updateHeaderBackBtn('lessons');
        restoreSavedScrollPosition(orig.scrollY || 0);
      });
      return true;
    }

    if (orig.view === 'timeline') {
      window._cmeRestoreMilestoneIdx = orig.timelineMilestoneIdx ?? 0;
      switchView('timeline', orig.unitId, false, {
        skipScrollToTop: Boolean(orig.scrollY),
        returningToOrigin: true,
      }).then(() => {
        updateHeaderBackBtn('timeline');
        restoreSavedScrollPosition(orig.scrollY || 0);
      });
      return true;
    }
  }

  if (typeof window !== 'undefined') {
    window._unitReturnOrigin = null;
    window.currentLessonIndex = null;
  }
  switchView('lessons', targetUnit);
  return false;
}
if (typeof window !== 'undefined') {
  window.returnToSavedOrigin = returnToSavedOrigin;
}

export function updateHeaderBackBtn(explicitView = null) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const backBtn = document.getElementById('header-back-btn');
  const mobileBrand = document.getElementById('header-mobile-brand');
  const appHeader = document.querySelector('.app-header');
  if (!backBtn) return;

  const activeView =
    explicitView ||
    window.currentView ||
    (appStore && appStore.state && appStore.state.currentView) ||
    state.currentView ||
    'dashboard';
  const activeUnit =
    state.selectedUnitId ||
    window.currentUnitId ||
    (appStore && appStore.state && appStore.state.selectedUnitId);

  const urlParams = new URLSearchParams(window.location.search);
  const isLocked =
    urlParams.get('locked') === 'true' ||
    urlParams.get('mode') === 'pupil' ||
    urlParams.get('safeguard') === 'true';

    const isInsideActiveLesson =
    activeView === 'lessons' &&
    typeof window.currentLessonIndex === 'number' &&
    window.currentLessonIndex >= 0;

  if (
    isInsideActiveLesson &&
    activeUnit &&
    typeof sessionStorage !== 'undefined' &&
    !window._suppressLessonAutoScrollTop
  ) {
    // Save reading scroll slot helper on window
    window.__hhActiveLessonKey = `${activeUnit}__${window.currentLessonIndex}`;
  }

  const isUnitOverview = activeView === 'lessons' && !isInsideActiveLesson;

  if (isInsideActiveLesson && activeUnit) {
    window.hhRecordLastLesson?.({
      unitId: activeUnit,
      lessonIndex: window.currentLessonIndex,
    });
  }

  window.__hhLastCommittedNav = {
    view: activeView,
    unitId: activeUnit || null,
    lessonIndex: isInsideActiveLesson ? window.currentLessonIndex : null,
    href: window.location.href,
  };
  syncMobileBottomNavActiveState(activeView);

  if (activeView === 'dashboard' || (isUnitOverview && isLocked)) {
    backBtn.style.display = 'none';
    if (appHeader) appHeader.classList.remove('has-back-btn');
    if (mobileBrand) mobileBrand.style.display = '';
    return;
  }

  backBtn.style.display = 'flex';
  if (appHeader) appHeader.classList.add('has-back-btn');
  if (mobileBrand && window.innerWidth <= 768) {
    mobileBrand.style.display = 'none';
  }

  let labelText = 'Dashboard';
  if (isInsideActiveLesson) {
    if (
      activeUnit &&
      window._unitReturnOrigin &&
      window._unitReturnOrigin.view === 'timeline' &&
      window._unitReturnOrigin.unitId === activeUnit
    ) {
      labelText = getReturnOriginLabel(activeUnit, 'Unit Overview');
    } else {
      labelText = 'Unit Overview';
    }
  } else if (isUnitOverview) {
    labelText = 'Dashboard';
  } else if (
    activeUnit &&
    (activeView === 'timeline' ||
      activeView === 'individuals' ||
      activeView === 'mock-exams' ||
      activeView === 'exam-practice' ||
      activeView === 'exam-trainer' ||
      activeView === 'reading' ||
      activeView === 'guided-reading' ||
      activeView === 'interactive' ||
      activeView === 'arcade' ||
      activeView === 'marking' ||
      activeView === 'answers' ||
      activeView === 'reader' ||
      activeView === 'decisions' ||
      activeView === 'taboo')
  ) {
    labelText = getReturnOriginLabel(activeUnit, 'Unit Overview');
  } else {
    labelText = 'Dashboard';
  }

  const labelSpan = backBtn.querySelector('span');
  if (labelSpan) {
    labelSpan.textContent = labelText;
  } else {
    backBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> <span>${labelText}</span>`;
  }
  backBtn.title = `← ${labelText}`;
}
if (typeof window !== 'undefined') {
  window.updateHeaderBackBtn = updateHeaderBackBtn;
}

window.handleHeaderBackClick = function () {
  const activeView =
    window.currentView ||
    appStore.state.currentView ||
    state.currentView ||
    'dashboard';
  const activeUnit =
    state.selectedUnitId ||
    window.currentUnitId ||
    (appStore && appStore.state && appStore.state.selectedUnitId);

    const isInsideActiveLesson =
    activeView === 'lessons' &&
    typeof window.currentLessonIndex === 'number' &&
    window.currentLessonIndex >= 0;

  if (
    isInsideActiveLesson &&
    activeUnit &&
    typeof sessionStorage !== 'undefined' &&
    !window._suppressLessonAutoScrollTop
  ) {
    // Save reading scroll slot helper on window
    window.__hhActiveLessonKey = `${activeUnit}__${window.currentLessonIndex}`;
  }

  if (isInsideActiveLesson && activeUnit) {
    if (
      window._unitReturnOrigin &&
      window._unitReturnOrigin.view === 'timeline' &&
      window._unitReturnOrigin.unitId === activeUnit
    ) {
      returnToSavedOrigin(activeUnit);
      return;
    }
    window._unitReturnOrigin = null;
    window.currentLessonIndex = null;
    switchView('lessons', activeUnit);
    return;
  }

  if (
    activeUnit &&
    (activeView === 'timeline' ||
      activeView === 'individuals' ||
      activeView === 'mock-exams' ||
      activeView === 'exam-practice' ||
      activeView === 'exam-trainer' ||
      activeView === 'reading' ||
      activeView === 'guided-reading' ||
      activeView === 'interactive' ||
      activeView === 'arcade' ||
      activeView === 'marking' ||
      activeView === 'answers' ||
      activeView === 'reader' ||
      activeView === 'decisions' ||
      activeView === 'taboo')
  ) {
    returnToSavedOrigin(activeUnit);
    return;
  }

  window._unitReturnOrigin = null;
  window.currentLessonIndex = null;
  switchView('dashboard');
};

// Subscribe to state changes to handle DOM updates independently of the router
export function initNavigationUI() {
  initMobileAppShell();

  const initialBackBtn = document.getElementById('header-back-btn');
  if (initialBackBtn) {
    initialBackBtn.onclick = (e) => {
      e.preventDefault();
      window.handleHeaderBackClick();
    };
  }

  if (typeof window !== 'undefined' && !window.__hhNavPopstateBound) {
    window.__hhNavPopstateBound = true;

    // Seed clean back-stack on cold-boot deep links so Android Back steps Lesson -> Unit -> Home instead of exiting app
    setTimeout(() => {
      try {
        const params = new URLSearchParams(window.location.search || '');
        const isLockedBoot =
          params.get('locked') === 'true' ||
          params.get('mode') === 'pupil' ||
          params.get('safeguard') === 'true';
        const curView = window.currentView || appStore.state.currentView || state.currentView || 'dashboard';
        const curUnit = state.selectedUnitId || window.currentUnitId || null;
        const curLesson =
          curView === 'lessons' && typeof window.currentLessonIndex === 'number' && window.currentLessonIndex >= 0
            ? window.currentLessonIndex
            : null;

        if (
          !isLockedBoot &&
          curView !== 'dashboard' &&
          typeof sessionStorage !== 'undefined' &&
          !sessionStorage.getItem('hh_backstack_seeded')
        ) {
          sessionStorage.setItem('hh_backstack_seeded', '1');
          const activeHref = window.location.href;
          const activeState = {
            ...(window.history.state || {}),
            hhNav: true,
            view: curView,
            unit: curUnit,
            unitId: curUnit,
            lessonIndex: curLesson !== null ? curLesson : undefined,
            opts: curLesson !== null ? { lessonIndex: curLesson } : {},
          };

          window.history.replaceState(
            { hhNav: true, view: 'dashboard', unit: null, unitId: null, opts: {}, scrollY: 0 },
            '',
            '/',
          );
          if (curLesson !== null && curUnit) {
            const unitPath = getCleanPathForUnit(curUnit) || `/?view=lessons&unit=${curUnit}`;
            window.history.pushState(
              { hhNav: true, view: 'lessons', unit: curUnit, unitId: curUnit, opts: {}, scrollY: 0 },
              '',
              unitPath,
            );
          }
          window.history.pushState(activeState, '', activeHref);
        }
      } catch (err) {}
    }, 320);

    window.addEventListener('popstate', (e) => {
      if (window.__hhSuppressPopstateOnce) {
        window.__hhSuppressPopstateOnce = false;
        e.stopImmediatePropagation();
        return;
      }

      const prevNav = window.__hhLastCommittedNav ? { ...window.__hhLastCommittedNav } : null;
      const poppedState = e.state || {};

      // 1. Always close any open modal or mobile drawer first before navigating back
      const modalCloseResult = closeAnyOpenMobileModalOrDrawer();
      const didCloseLayer =
        typeof modalCloseResult === 'object' ? Boolean(modalCloseResult.closed) : Boolean(modalCloseResult);
      const layerHadHistoryEntry =
        typeof modalCloseResult === 'object' ? Boolean(modalCloseResult.hadHistoryEntry) : Boolean(poppedState.hhModal);
      if (didCloseLayer) {
        e.stopImmediatePropagation();
        if (!layerHadHistoryEntry && prevNav) {
          try {
            window.history.pushState(
              {
                hhNav: true,
                view: prevNav.view,
                unit: prevNav.unitId,
                unitId: prevNav.unitId,
                lessonIndex: prevNav.lessonIndex ?? undefined,
                opts: prevNav.lessonIndex !== null ? { lessonIndex: prevNav.lessonIndex } : {},
                scrollY: window.scrollY || 0,
              },
              '',
              prevNav.href || window.location.href,
            );
          } catch (err) {}
        }
        return;
      }

      // 2. Handle in-page section hash jumps cleanly
      if (window.location.hash && window.location.hash.includes('-section')) {
        const targetEl = document.querySelector(window.location.hash);
        if (targetEl) {
          e.stopImmediatePropagation();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }

      e.stopImmediatePropagation();

      const currentUrlParams = new URLSearchParams(window.location.search);
      const popRoute = resolveRouteFromPathname(window.location.pathname);
      const pathUnit = popRoute ? popRoute.unitId : resolveUnitIdFromPathname(window.location.pathname);
      const pathIsSchools = isSchoolsPathname(window.location.pathname);
      const pathUnlisted = resolveUnlistedPathname(window.location.pathname);
      const urlView = currentUrlParams.get('view') || (pathIsSchools ? 'schools' : pathUnlisted || null);
      const urlUnit = currentUrlParams.get('unit') || pathUnit;
      const urlLesson = currentUrlParams.get('lesson') ?? (popRoute ? popRoute.lessonSlug : null);
      const targetScrollY = typeof poppedState.scrollY === 'number' ? poppedState.scrollY : 0;

      let targetView = poppedState.view || urlView || (urlUnit ? 'lessons' : 'dashboard');
      let targetUnit =
        poppedState.unitId !== undefined
          ? poppedState.unitId
          : poppedState.unit !== undefined
            ? poppedState.unit
            : urlUnit;
      const targetOpts = poppedState.opts && typeof poppedState.opts === 'object' ? poppedState.opts : {};

      // 3. Enforce hierarchical step-back: Lesson -> Unit Overview -> Home Dashboard
      if (
        prevNav &&
        prevNav.view === 'lessons' &&
        typeof prevNav.lessonIndex === 'number' &&
        prevNav.lessonIndex >= 0 &&
        prevNav.unitId &&
        targetView === 'dashboard'
      ) {
        const stepUnit = prevNav.unitId;
        window.currentLessonIndex = null;
        window._unitReturnOrigin = null;
        const unitOverviewUrl = getCleanPathForUnit(stepUnit) || `/?view=lessons&unit=${stepUnit}`;
        try {
          window.history.pushState(
            { hhNav: true, view: 'lessons', unit: stepUnit, unitId: stepUnit, opts: {}, scrollY: 0 },
            '',
            unitOverviewUrl,
          );
        } catch (err) {}
        switchView('lessons', stepUnit, true);
        return;
      }

      if (targetView === 'timeline' && typeof poppedState.timelineMilestoneIdx === 'number') {
        window._cmeRestoreMilestoneIdx = poppedState.timelineMilestoneIdx;
      }

      if (targetScrollY > 0) {
        window._suppressLessonAutoScrollTop = true;
      }

      switchView(targetView, targetUnit, true, { ...targetOpts, skipScrollToTop: true }).then(() => {
        const unitDataObj = getUnitData(targetUnit);
        let lessonIdx = null;
        if (typeof poppedState.lessonIndex === 'number' && poppedState.lessonIndex >= 0) {
          lessonIdx = poppedState.lessonIndex;
        } else if (typeof targetOpts.lessonIndex === 'number' && targetOpts.lessonIndex >= 0) {
          lessonIdx = targetOpts.lessonIndex;
        } else if (urlLesson !== null && String(urlLesson).trim() !== '' && unitDataObj && Array.isArray(unitDataObj.lessons)) {
          const rawStr = String(urlLesson).trim().toLowerCase();
          const hasZero = Boolean(
            unitDataObj.lessons[0] &&
              (unitDataObj.lessons[0].id === 'lesson_0' ||
                (unitDataObj.lessons[0].title && unitDataObj.lessons[0].title.includes('KT 1.0'))),
          );
          if (/^\d+$/.test(rawStr)) {
            const num = parseInt(rawStr, 10);
            lessonIdx = hasZero ? num : Math.max(0, num - 1);
          } else {
            const found = unitDataObj.lessons.findIndex(
              (l) =>
                (l.slug && l.slug.toLowerCase() === rawStr) ||
                (l.id && l.id.toLowerCase() === rawStr),
            );
            if (found !== -1) lessonIdx = found;
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
            if (wasInLesson) {
              renderLessonsView();
            }
          }
          updateHeaderBackBtn('lessons');
        } else {
          window.currentLessonIndex = null;
          updateHeaderBackBtn(targetView);
        }

        window._suppressLessonAutoScrollTop = false;
        restoreSavedScrollPosition(targetScrollY);
      });
    });
  }

  appStore.subscribe('currentView', (viewName) => {
    if (typeof window !== 'undefined') {
      window.currentView = viewName;
    }
    syncKs2PortalState(state.selectedUnitId || window.currentUnitId, state.activeUnitData, viewName);
    updateHeaderBackBtn(viewName);
    syncMobileBottomNavActiveState(viewName);

    // Header Right
    const headerRight = document.querySelector('.header-right');
    if (headerRight) {
      headerRight.innerHTML = '';
      headerRight.style.display = 'none';
    }

    // Manage Breadcrumbs
    updateBreadcrumbs();

    // Update active sidebar nav
    document.querySelectorAll('.sidebar-nav .nav-item').forEach((item) => {
      item.classList.remove('active');
    });
    const isUnitBookletActive =
      viewName === 'booklet' && (state.selectedUnitId || window.currentUnitId);
    const activeNavId = isUnitBookletActive ? 'nav-unit-booklet' : `nav-${viewName}`;
    const navItem =
      document.getElementById(activeNavId) || document.getElementById(`nav-${viewName}`);
    if (navItem) navItem.classList.add('active');

    // Update active mobile bottom nav item
    document.querySelectorAll('.mobile-bottom-nav .mob-nav-item').forEach((item) => {
      item.classList.remove('active');
    });
    let activeMobId = null;
    if (viewName === 'dashboard') activeMobId = 'mob-nav-home';
    else if (
      viewName === 'lessons' ||
      viewName === 'timeline' ||
      viewName === 'booklet' ||
      viewName === 'mock-exams' ||
      viewName === 'exam-practice' ||
      viewName === 'individuals' ||
      viewName === 'reading' ||
      viewName === 'guided-reading' ||
      viewName === 'marking' ||
      viewName === 'decisions' ||
      viewName === 'taboo'
    ) {
      activeMobId = 'mob-nav-units';
    } else if (viewName === 'interactive' || viewName === 'arcade') {
      activeMobId = 'mob-nav-quizzing';
    }

    if (activeMobId) {
      const mobEl = document.getElementById(activeMobId);
      if (mobEl) mobEl.classList.add('active');
    }
  });
}

export function scrollToTop(instant = true) {
  const behavior = instant ? 'instant' : 'smooth';
  try {
    window.scrollTo({ top: 0, left: 0, behavior });
  } catch (e) {
    window.scrollTo(0, 0);
  }
  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;

  const selectors = [
    '#main-content',
    '.content-container',
    '#content-area',
    '.content-area',
    '.app-body',
    'main',
  ];
  selectors.forEach((sel) => {
    const el = document.querySelector(sel);
    if (el && el.scrollTop !== 0) {
      try {
        el.scrollTo({ top: 0, left: 0, behavior });
      } catch (e) {
        el.scrollTop = 0;
      }
    }
  });
}
window.scrollToTop = scrollToTop;

export function scrollToSection(sectionId) {
  const currentView =
    state.currentView ||
    (window.appStore && window.appStore.state && window.appStore.state.currentView) ||
    'dashboard';

  const performScroll = () => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const headerOffset = 24;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth',
    });
    el.classList.add('section-highlight');
    setTimeout(() => el.classList.remove('section-highlight'), 1800);
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#' + sectionId);
    }
  };

  if (currentView !== 'dashboard') {
    switchView('dashboard').then(() => {
      setTimeout(performScroll, 150);
    });
  } else {
    performScroll();
  }
}
window.scrollToSection = scrollToSection;

export function updateBreadcrumbs(customTrail = null) {
  const breadcrumbs = document.getElementById('header-breadcrumbs');
  if (!breadcrumbs) return;

  const viewName = appStore.state.currentView || state.currentView || 'dashboard';
  const unitId = appStore.state.selectedUnitId || state.selectedUnitId;
  const unitData = appStore.state.activeUnitData || state.activeUnitData || {};

  if (viewName === 'dashboard') {
    breadcrumbs.style.display = 'none';
    breadcrumbs.innerHTML = '';
    return;
  }

  let trail = [];

  const getUnitName = (id) => {
    if (!id) return '';
    if (id === 'ks2_stone_to_iron_age') return 'Stone Age to Iron Age';
    if (id === 'ks2_romans') return 'The Romans in Britain';
    if (id === 'ks2_anglo_saxons_vikings') return 'Anglo-Saxons & Vikings';
    if (id === 'ks2_ww2') return 'World War II & The Home Front';
    if (id === 'ks2_ancient_egypt') return 'Ancient Egypt';
    if (id === 'ks2_ancient_greece') return 'Ancient Greece';
    if (id === 'ks2_early_islamic_baghdad') return 'Baghdad c. AD 900';
    if (id === 'ks2_maya_civilisation') return 'The Ancient Maya';
    const activeUnit = unitData?.title ? unitData : appStore.state.activeUnitData || {};
    if (activeUnit && activeUnit.shortTitle) return activeUnit.shortTitle;
    if (activeUnit && activeUnit.title) {
      const clean = activeUnit.title.replace(/^(?:Paper \d+:?|KS2:?|KS3:?|GCSE[^:]*:?)\s*/i, '').trim();
      if (clean) return clean;
    }
    if (id === 'cme_new') return 'Conflict in the Middle East (1945–1995)';
    if (id === 'gcse_cold_war') return 'Superpower Relations & the Cold War (1941–1991)';
    if (id === 'edexcel_medicine') return 'Medicine Through Time';
    if (id === 'eee') return 'Early Elizabethan England (1558–1588)';
    if (id === 'weimar_nazi_germany') return 'Weimar and Nazi Germany (1918–1939)';
    if (id === 'usa') return 'Conflict at Home and Abroad: USA (1954–75)';
    if (id === 'great_war') return 'Causes of the Great War';
    if (id === 'ks2_ww2') return 'World War II & The Home Front (1933–1945)';
    return id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (Array.isArray(customTrail) && customTrail.length > 0) {
    trail = [...customTrail];
  } else {
    trail.push({ label: 'Dashboard', view: 'dashboard' });

    if (
      unitId &&
      (viewName === 'lessons' ||
        viewName === 'interactive' ||
        viewName === 'arcade' ||
        viewName === 'timeline' ||
        viewName === 'booklet' ||
        viewName === 'mock-exams' ||
        viewName === 'decisions' ||
        viewName === 'taboo' ||
        viewName === 'individuals' ||
        viewName === 'reading' ||
        viewName === 'guided-reading' ||
        viewName === 'marking' ||
        viewName === 'answers' ||
        viewName === 'reader' ||
        viewName === 'textbook-reader')
    ) {
      trail.push({ label: getUnitName(unitId), view: 'lessons', unit: unitId });
    }

    let currentSectionLabel = '';
    if (viewName === 'interactive') currentSectionLabel = 'Interactive Quizzing';
    else if (viewName === 'arcade') currentSectionLabel = 'Revision Arcade';
    else if (viewName === 'timeline') currentSectionLabel = 'Chronological Timeline';
    else if (viewName === 'booklet') currentSectionLabel = 'Printable Booklet';
    else if (viewName === 'mock-exams') currentSectionLabel = 'GCSE Mock Exams';
    else if (viewName === 'profile') currentSectionLabel = 'Student Profile';
    else if (viewName === 'curriculum') currentSectionLabel = 'Curriculum Map';
    else if (viewName === 'schools') currentSectionLabel = 'For Schools & Departments';
    else if (viewName === 'department-portal') currentSectionLabel = 'Department Portal';
    else if (viewName === 'competitions') currentSectionLabel = 'Competitions & Awards';
    else if (viewName === 'chess') currentSectionLabel = 'Chess Club';
    else if (viewName === 'decisions') currentSectionLabel = 'Decisions Game';
    else if (viewName === 'taboo') currentSectionLabel = 'Taboo Recall';
    else if (viewName === 'individuals') {
      const hasOrgs = Boolean(
        Array.isArray(unitData?.key_individuals) &&
          unitData.key_individuals.some((x) =>
            String(x?.entity_type || x?.type || '')
              .toLowerCase()
              .startsWith('org'),
          ),
      );
      currentSectionLabel = hasOrgs ? 'Key Individuals & Organisations' : 'Key Individuals';
    }
    else if (viewName === 'reading' || viewName === 'guided-reading') currentSectionLabel = 'Literary Companion';
    else if (viewName === 'marking' || viewName === 'answers') currentSectionLabel = 'Self-Checking Marking Bank';
    else if (viewName === 'masterpiece' || viewName === 'gallery')
      currentSectionLabel = 'Masterpiece Studio';
    else if (viewName === 'reader' || viewName === 'textbook-reader')
      currentSectionLabel = 'Dual-Spread Digital Reader';
    else if (
      viewName === 'gcse-tracker' ||
      viewName === 'spec-tracker' ||
      viewName === 'revision-builder' ||
      viewName === 'year11-tracker'
    )
      currentSectionLabel = 'GCSE Spec Tracker & Revision';

    if (currentSectionLabel) {
      trail.push({ label: currentSectionLabel });
    }
  }

  const urlParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isLocked =
    urlParams && (urlParams.get('locked') === 'true' || urlParams.get('mode') === 'pupil');

  // Guarantee root crumb unless locked
  if (isLocked) {
    trail = trail.filter((t) => t.view !== 'dashboard');
  } else if (trail.length === 0 || trail[0].view !== 'dashboard') {
    trail.unshift({ label: 'Dashboard', view: 'dashboard' });
  } else {
    trail[0].label = 'Dashboard';
  }

  const isDeepTrail = trail.length >= 3;
  if (typeof document !== 'undefined' && document.body) {
    document.body.classList.toggle('in-lesson-active', isDeepTrail);
  }

  let html = '';
  trail.forEach((item, idx) => {
    const isLast = idx === trail.length - 1;
    const isRoot = idx === 0;
    const isUnit = !isRoot && !isLast;

    if (idx > 0) {
      html += `<span class="breadcrumb-separator"><i class="fa-solid fa-chevron-right"></i></span>`;
    }
    if (isLast) {
      html += `<span class="breadcrumb-item active breadcrumb-lesson-active" title="${item.tooltip || item.label}">${item.label}</span>`;
    } else if (isRoot) {
      const rootIcon = `<i class="fa-solid fa-house" style="font-size: 0.8rem; margin-right: 4px;"></i>`;
      const rootText = `<span class="breadcrumb-root-text">${item.label}</span>`;
      if (item.action) {
        html += `<span class="breadcrumb-item clickable breadcrumb-root-item" title="${item.label}" onclick="(${item.action.toString()})()">${rootIcon}${rootText}</span>`;
      } else if (item.view) {
        const uParam = item.unit ? `'${item.unit}'` : 'null';
        html += `<span class="breadcrumb-item clickable breadcrumb-root-item" title="${item.label}" onclick="window.switchView('${item.view}', ${uParam})">${rootIcon}${rootText}</span>`;
      } else {
        html += `<span class="breadcrumb-item breadcrumb-root-item" title="${item.label}">${rootIcon}${rootText}</span>`;
      }
    } else if (isUnit) {
      const uParam = item.unit ? `'${item.unit}'` : 'null';
      if (item.action) {
        html += `<span class="breadcrumb-item clickable breadcrumb-unit-item" title="${item.label}" onclick="(${item.action.toString()})()">${item.label}</span>`;
      } else if (item.view) {
        html += `<span class="breadcrumb-item clickable breadcrumb-unit-item" title="${item.label}" onclick="window.switchView('${item.view}', ${uParam})">${item.label}</span>`;
      } else {
        html += `<span class="breadcrumb-item breadcrumb-unit-item" title="${item.label}">${item.label}</span>`;
      }
    } else {
      if (item.action) {
        html += `<span class="breadcrumb-item clickable" title="${item.label}" onclick="(${item.action.toString()})()">${item.label}</span>`;
      } else if (item.view) {
        const uParam = item.unit ? `'${item.unit}'` : 'null';
        html += `<span class="breadcrumb-item clickable" title="${item.label}" onclick="window.switchView('${item.view}', ${uParam})">${item.label}</span>`;
      } else {
        html += `<span class="breadcrumb-item" title="${item.label}">${item.label}</span>`;
      }
    }
  });

  breadcrumbs.innerHTML = html;
  breadcrumbs.style.display = 'inline-flex';
}
window.updateBreadcrumbs = updateBreadcrumbs;

export function initDraftPreservation(container = document, scopeKey = 'global') {
  if (!container) return;
  const inputs = container.querySelectorAll(
    '.student-answer-input, .student-task-input, #epz-user-answer, .form-control',
  );
  inputs.forEach((input, idx) => {
    const fieldId = input.id || input.name || `field_${idx}`;
    const storageKey = `hh_draft_${scopeKey}_${fieldId}`;
    input.dataset.draftKey = storageKey;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && saved.trim()) {
        input.value = saved;
        let badge = input.parentElement?.querySelector('.draft-restored-badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'draft-restored-badge';
          badge.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Draft restored';
          input.parentElement?.insertBefore(badge, input.nextSibling);
        }
      }
    } catch (err) {}

    let saveTimeout = null;
    input.addEventListener('input', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        try {
          if (input.value && input.value.trim()) {
            localStorage.setItem(storageKey, input.value);
            let badge = input.parentElement?.querySelector('.draft-restored-badge');
            if (badge) {
              badge.innerHTML = '<i class="fa-solid fa-check"></i> Auto-saved';
            }
          } else {
            localStorage.removeItem(storageKey);
          }
        } catch (err) {}
      }, 300);
    });
  });
}
window.initDraftPreservation = initDraftPreservation;

export function handleBrandClick() {
  const urlParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isLocked =
    urlParams &&
    (urlParams.get('locked') === 'true' ||
      urlParams.get('mode') === 'pupil' ||
      urlParams.get('safeguard') === 'true');
  const lockedUnit =
    (urlParams && urlParams.get('unit')) || state.selectedUnitId || window.currentUnitId;
  if (isLocked && lockedUnit) {
    switchView('lessons', lockedUnit);
  } else {
    switchView('dashboard');
  }
}
window.handleBrandClick = handleBrandClick;

export async function switchView(viewName, param = null, skipHistory = false, options = {}) {
  // Gracefully handle calls passing options object as 3rd parameter
  if (typeof skipHistory === 'object' && skipHistory !== null) {
    options = skipHistory;
    skipHistory = false;
  }

  // Comprehensive view alias normalization for QR codes, links, and direct URLs
  let rawView = (viewName || '').toLowerCase().trim();
  if (
    rawView === 'schools' ||
    rawView === 'for-schools' ||
    rawView === 'for_schools' ||
    rawView === 'departments' ||
    rawView === 'for-departments'
  ) {
    viewName = 'schools';
    param = null;
  } else if (rawView === 'usa' || rawView === 'gcse_usa' || rawView === 'gcse_usa_1954_1975') {
    viewName = 'lessons';
    param = 'usa';
  } else if (
    rawView === 'quiz' ||
    rawView === 'quizzes' ||
    rawView === 'quizzing' ||
    rawView === 'interactive_quiz' ||
    rawView === 'interactive-quiz' ||
    rawView === 'interactive' ||
    rawView === 'retrieval' ||
    rawView === 'practice-quizzes' ||
    rawView === 'practice_quizzes'
  ) {
    viewName = 'interactive';
    param = param || state.selectedUnitId || window.currentUnitId || 'great_war_part2';
  } else if (
    rawView === 'reading' ||
    rawView === 'guided-reading' ||
    rawView === 'guided_reading' ||
    rawView === 'literary' ||
    rawView === 'audio'
  ) {
    viewName = 'reading';
    param = param || state.selectedUnitId || window.currentUnitId || 'great_war_part2';
  } else if (
    rawView === 'marking' ||
    rawView === 'answers' ||
    rawView === 'marking-bank' ||
    rawView === 'marking_bank' ||
    rawView === 'self-check' ||
    rawView === 'self_check'
  ) {
    viewName = 'marking';
    param = param || state.selectedUnitId || window.currentUnitId || 'great_war_part2';
  } else if (
    rawView === 'booklets' ||
    rawView === 'workbooks' ||
    rawView === 'workbook' ||
    rawView === 'pdf' ||
    rawView === 'pdfs' ||
    rawView === 'textbook' ||
    rawView === 'textbooks'
  ) {
    viewName = 'booklet';
  } else if (rawView === 'lesson' || rawView === 'lessons' || rawView === 'unit') {
    viewName = 'lessons';
    param = param || state.selectedUnitId || window.currentUnitId || 'great_war_part2';
  } else if (rawView === 'trend-radar' || rawView === 'matrix' || rawView === 'exam-matrix') {
    viewName = 'mock-exams';
  } else if (
    rawView === 'exam' ||
    rawView === 'exam-trainer' ||
    rawView === 'exam_trainer' ||
    rawView === 'mobile-exam'
  ) {
    viewName = 'exam-trainer';
    param = param || state.selectedUnitId || window.currentUnitId || 'cme_new';
  } else if (rawView === 'department' || rawView === 'department_portal' || rawView === 'portal') {
    viewName = 'department-portal';
  } else if (rawView === 'curriculum_map' || rawView === 'curriculum') {
    viewName = 'curriculum';
  } else if (rawView === 'arena' || rawView === 'competitions' || rawView === 'competitions_zone') {
    viewName = 'competitions';
  } else if (
    rawView === 'revision_guides' ||
    rawView === 'revision-guides' ||
    rawView === 'exam_technique' ||
    rawView === 'exam-technique'
  ) {
    viewName = 'curriculum';
  } else if (rawView === 'gallery') {
    viewName = 'masterpiece';
  } else if (rawView === 'textbook-reader') {
    viewName = 'reader';
  }

  if (
    viewName !== 'lessons' &&
    typeof document !== 'undefined' &&
    document.body &&
    document.body.classList.contains('lesson-full-width')
  ) {
    document.body.classList.remove('lesson-full-width');
    try {
      sessionStorage.removeItem('hh_lesson_full_width');
    } catch (e) {}
  }

  // Safeguard lockdown mode enforcement
  const urlParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isLocked =
    urlParams &&
    (urlParams.get('locked') === 'true' ||
      urlParams.get('mode') === 'pupil' ||
      urlParams.get('safeguard') === 'true');
  const lockedUnit =
    (urlParams && urlParams.get('unit')) || state.selectedUnitId || window.currentUnitId;

    if (isLocked && lockedUnit) {
    const restrictedViews = [
      'dashboard',
      'schools',
      'profile',
      'curriculum',
      'department-portal',
      'competitions',
      'chess',
      'masterpiece',
      'gallery',
    ];
    if (restrictedViews.includes(viewName)) {
      console.warn(
        `[Safeguard Mode] Prevented exit to ${viewName} while locked to unit ${lockedUnit}`,
      );
      viewName = 'lessons';
      param = lockedUnit;
    } else if (param && param !== lockedUnit && param !== 'all') {
      console.warn(
        `[Safeguard Mode] Prevented switch to unit ${param} while locked to ${lockedUnit}`,
      );
      param = lockedUnit;
    }
  }

  // Route Mobile Pupil Exam Practice strictly to Zero-PDF Mobile Exam Trainer
  const isMobilePupilSession =
    typeof document !== 'undefined' &&
    document.body &&
    document.body.classList.contains('hh-mobile-pupil-mode') &&
    !isStaffModeActive();
  if (
    (viewName === 'mock-exams' || viewName === 'exam-practice') &&
    isMobilePupilSession &&
    !options?.forceDesktopMocks
  ) {
    viewName = 'exam-trainer';
    param = param || state.selectedUnitId || window.currentUnitId || 'cme_new';
  }

  // Stop active speech playback & close any stuck full-screen diagnostic overlay on view transition
  if (typeof window !== 'undefined' && typeof window.cancelSpeech === 'function') {
    window.cancelSpeech();
  }
  if (typeof window !== 'undefined' && typeof window.closeDiagnosticModal === 'function') {
    const diagEl = typeof document !== 'undefined' && document.getElementById('diagnostic-benchmark-modal');
    if (diagEl && diagEl.style.display !== 'none') {
      window.closeDiagnosticModal(true);
    }
  }
  if (typeof document !== 'undefined' && document.body && viewName !== 'arcade') {
    document.body.classList.remove('hh-arcade-playing');
  }

  // Capture outgoing view/unit/lesson context before mutating scroll or state
  const previousView =
    (typeof window !== 'undefined' && window.currentView) ||
    appStore.state.currentView ||
    state.currentView ||
    'dashboard';
  const previousUnit =
    state.selectedUnitId ||
    (typeof window !== 'undefined' && window.currentUnitId);

  // Snapshot current scroll position into the current state before leaving if history exists
  if (!skipHistory && typeof window !== 'undefined' && window.history) {
    const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
    const currentState = window.history.state || {};
    try {
      window.history.replaceState(
        { ...currentState, scrollY: currentScroll },
        '',
        window.location.href,
      );
    } catch (e) {}
  }

  // Clean up any running Revision Arcade game loop when leaving arcade view
  if (
    typeof window !== 'undefined' &&
    previousView === 'arcade' &&
    viewName !== 'arcade' &&
    typeof window.cleanupArcadeZone === 'function'
  ) {
    window.cleanupArcadeZone();
  }

  // Auto-save return origin when transitioning from an active lesson (or timeline) into a unit tool
  const isUnitToolTarget =
    viewName === 'timeline' ||
    viewName === 'individuals' ||
    viewName === 'mock-exams' ||
    viewName === 'exam-practice' ||
    viewName === 'exam-trainer' ||
    viewName === 'reading' ||
    viewName === 'guided-reading' ||
    viewName === 'interactive' ||
    viewName === 'arcade' ||
    viewName === 'marking';

  // Persist per-lesson reading scroll position when switching tabs from an active lesson
  if (
    typeof window !== 'undefined' &&
    previousView === 'lessons' &&
    typeof window.currentLessonIndex === 'number' &&
    window.currentLessonIndex >= 0 &&
    previousUnit &&
    isUnitToolTarget
  ) {
    try {
      const yNow = window.scrollY || document.documentElement.scrollTop || 0;
      sessionStorage.setItem(
        `hh_lesson_scroll_${previousUnit}_${window.currentLessonIndex}`,
        String(Math.max(0, Math.round(yNow))),
      );
    } catch (e) {}
  }

  if (
    !skipHistory &&
    !options.returningToOrigin &&
    typeof window !== 'undefined' &&
    isUnitToolTarget
  ) {
    const targetUnitForTool = param || previousUnit;
    const recentlySaved =
      window._unitReturnOriginSavedTs && Date.now() - window._unitReturnOriginSavedTs < 150;
    if (!recentlySaved && previousUnit && targetUnitForTool === previousUnit) {
      if (
        (previousView === 'lessons' &&
          typeof window.currentLessonIndex === 'number' &&
          window.currentLessonIndex >= 0) ||
        (previousView === 'timeline' && viewName !== 'timeline')
      ) {
        saveUnitReturnOrigin();
      } else if (previousView === 'lessons') {
        window._unitReturnOrigin = null;
      }
    }
  }

  // Clear stale return origin if switching to a different unit
  if (
    typeof window !== 'undefined' &&
    window._unitReturnOrigin &&
    param &&
    param !== 'all' &&
    window._unitReturnOrigin.unitId &&
    window._unitReturnOrigin.unitId !== param
  ) {
    window._unitReturnOrigin = null;
  }

  // Reset active lesson pointer when leaving lessons view
  if (typeof window !== 'undefined' && viewName !== 'lessons') {
    window.currentLessonIndex = null;
  }

  // Only reset scroll if not skipping scroll reset (e.g. restoring on popstate)
  if (!options.skipScrollToTop) {
    scrollToTop(true);
  }

  // Update state; the subscriber will handle UI changes
  if (typeof window !== 'undefined') {
    window.currentView = viewName;
  }
  if (typeof document !== 'undefined' && document.body) {
    document.body.setAttribute('data-active-view', viewName);
  }
  syncKs2PortalState(param || state.selectedUnitId, state.activeUnitData, viewName);
  syncDynamicSeoMetadata(viewName, param || state.selectedUnitId);
  appStore.state.currentView = viewName;

  if (!skipHistory) {
    const url = new URL(window.location);
    const isLockedSession =
      url.searchParams.get('locked') === 'true' ||
      url.searchParams.get('mode') === 'pupil' ||
      url.searchParams.get('safeguard') === 'true';
    const cleanUnitPath = getCleanPathForUnit(param);
    const isPureDashboard = viewName === 'dashboard' && !param && !isLockedSession;
    const isPureSchools = viewName === 'schools' && !isLockedSession;
    const isPureUnitOverview =
      viewName === 'lessons' &&
      Boolean(cleanUnitPath) &&
      (!options || typeof options.lessonIndex !== 'number') &&
      !isLockedSession;

    if (isPureDashboard) {
      url.pathname = '/';
      url.search = '';
    } else if (isPureSchools) {
      url.pathname = '/schools/';
      url.search = '';
    } else if (isPureUnitOverview) {
      url.pathname = cleanUnitPath;
      url.search = '';
    } else {
      url.pathname = '/';
      url.searchParams.set('view', viewName);
      url.searchParams.delete('stage');
      if (param) url.searchParams.set('unit', param);
      else url.searchParams.delete('unit');
      if (!isLockedSession) {
        url.searchParams.delete('portal');
      }
      if (viewName === 'arcade') {
        if (options?.game && options.game !== 'lobby') {
          url.searchParams.set('game', options.game);
        }
        if (options?.lessonScope !== undefined && String(options.lessonScope) !== 'all') {
          url.searchParams.set('arcadeLesson', String(options.lessonScope));
        }
      } else {
        url.searchParams.delete('game');
        url.searchParams.delete('arcadeLesson');
      }

      if (viewName === 'reading' || viewName === 'guided-reading') {
        if (options && options.rawLesson !== undefined) {
          url.searchParams.set('lesson', options.rawLesson);
        } else if (options && options.lessonIndex !== undefined) {
          url.searchParams.set('lesson', options.lessonIndex + 1);
        }
      } else if (viewName === 'lessons' && options && typeof options.lessonIndex === 'number') {
        const uData = getUnitData(param || previousUnit);
        const lList = (uData && (uData.lessons || uData.subtopics)) || [];
        const lObj = lList[options.lessonIndex];
        const hasZero = Boolean(
          lList[0] &&
            (lList[0].id === 'lesson_0' ||
              (lList[0].title && lList[0].title.includes('KT 1.0'))),
        );
        const lVal =
          (lObj && lObj.slug) ||
          (hasZero ? (options.lessonIndex === 0 ? '0' : options.lessonIndex) : options.lessonIndex + 1);
        url.searchParams.set('lesson', lVal);
      } else if (viewName !== 'reading' && viewName !== 'guided-reading') {
        url.searchParams.delete('lesson');
      }
    }
    const safeHistoryOpts = {};
    if (options && typeof options === 'object') {
      if (typeof options.lessonIndex === 'number') safeHistoryOpts.lessonIndex = options.lessonIndex;
      if (options.rawLesson !== undefined) safeHistoryOpts.rawLesson = options.rawLesson;
      if (options.game !== undefined) safeHistoryOpts.game = options.game;
      if (options.lessonScope !== undefined) safeHistoryOpts.lessonScope = options.lessonScope;
    }

    try {
      // When jumping directly from Dashboard (or another unit) into a specific lesson, insert Unit Overview step so Back goes Lesson -> Unit -> Home
      if (
        viewName === 'lessons' &&
        param &&
        typeof options?.lessonIndex === 'number' &&
        (previousView !== 'lessons' || previousUnit !== param)
      ) {
        const overviewHref = cleanUnitPath || `/?view=lessons&unit=${param}`;
        window.history.pushState(
          {
            hhNav: true,
            view: 'lessons',
            unit: param,
            unitId: param,
            opts: {},
            scrollY: 0,
          },
          '',
          overviewHref,
        );
      }

      window.history.pushState(
        {
          hhNav: true,
          view: viewName,
          unit: param,
          unitId: param,
          lesson: options?.lessonIndex,
          lessonIndex: options?.lessonIndex,
          opts: safeHistoryOpts,
          scrollY: 0,
        },
        '',
        url,
      );
      if (viewName === 'lessons' && (!options || typeof options.lessonIndex !== 'number')) {
        window._lastLessonsOverviewPushTs = Date.now();
      }
    } catch (e) {}
  }

  // Always close any open Middle East regional map modal on view transitions
  if (typeof window.closeCmeTheaterMapModal === 'function') {
    window.closeCmeTheaterMapModal();
  }

  // Clean up unit-specific sidebar navigation on global views
  const isGlobalView =
    viewName === 'dashboard' ||
    viewName === 'schools' ||
    viewName === 'profile' ||
    viewName === 'curriculum' ||
    viewName === 'department-portal' ||
    viewName === 'competitions' ||
    viewName === 'chess' ||
    viewName === 'masterpiece' ||
    viewName === 'gallery' ||
    viewName === 'gcse-tracker' ||
    viewName === 'spec-tracker' ||
    viewName === 'revision-builder' ||
    (viewName === 'booklet' && (!param || param === 'all'));

  if (isGlobalView) {
    if (typeof window !== 'undefined') {
      window._unitReturnOrigin = null;
      window.currentLessonIndex = null;
    }
    state.selectedUnitId = null;
    window.currentUnitId = null;
    state.activeUnitData = null;
    if (appStore && appStore.state) {
      appStore.state.selectedUnitId = null;
      appStore.state.activeUnitData = null;
    }
    if (typeof window.removeFloatingCmeMapButton === 'function') {
      window.removeFloatingCmeMapButton();
    }

    const globalNav = document.getElementById('sidebar-global-nav');
    const unitWorkspace = document.getElementById('sidebar-unit-workspace');
    if (globalNav) globalNav.style.display = 'flex';
    if (unitWorkspace) unitWorkspace.style.display = 'none';

    [
      'nav-lessons',
      'nav-interactive',
      'nav-arcade',
      'nav-unit-booklet',
      'nav-unit-infographics',
      'nav-timeline',
      'nav-mock-exams',
      'nav-decisions',
      'nav-taboo',
      'nav-individuals',
      'nav-reading',
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    if (typeof window.syncStaffUiState === 'function') {
      window.syncStaffUiState();
    }
    if (typeof window.highlightActiveSidebarUnit === 'function') {
      window.highlightActiveSidebarUnit(null);
    }
  }

  // Handle view rendering
  if (viewName === 'dashboard' || viewName === 'profile') {
    renderDashboard();
  } else if (viewName === 'schools') {
    const { renderSchoolsShowcase } = await import('./schools_showcase.js');
    renderSchoolsShowcase();
  } else if (viewName === 'arcade') {
    const targetUnit =
      param || state.selectedUnitId || window.currentUnitId || 'edexcel_medicine';
    await loadUnit(targetUnit);
    const { renderArcadeView } = await import('./arcade_zone.js');
    renderArcadeView({ ...(options || {}), unitId: targetUnit });
  } else if (viewName === 'interactive' || viewName === 'quiz') {
    const targetUnit = param || state.selectedUnitId || window.currentUnitId || 'edexcel_medicine';
    await loadUnit(targetUnit);
    if (
      typeof document !== 'undefined' &&
      document.body &&
      document.body.classList.contains('hh-mobile-pupil-mode') &&
      !isStaffModeActive() &&
      !options?.forceDesktopQuiz
    ) {
      const { renderMobileQuizArena } = await import('./mobile_quiz_arena.js');
      await renderMobileQuizArena(targetUnit, options || {});
    } else {
      renderInteractiveQuiz();
    }
  } else if (viewName === 'exam-trainer') {
    const targetUnit = param || state.selectedUnitId || window.currentUnitId || 'cme_new';
    await loadUnit(targetUnit);
    const { renderMobileExamTrainer } = await import('./mobile_exam_trainer.js');
    await renderMobileExamTrainer(targetUnit, options || {});
  } else if (viewName === 'timeline') {
    const targetUnit = param || state.selectedUnitId || window.currentUnitId || 'cme_new';
    await loadUnit(targetUnit);
    renderTimeline();
  } else if (viewName === 'individuals') {
    const targetUnit = param || state.selectedUnitId || window.currentUnitId || 'cme_new';
    await loadUnit(targetUnit);
    renderIndividualsView();
  } else if (viewName === 'booklet') {
    const targetUnit =
      param && param !== 'all'
        ? param
        : state.selectedUnitId || window.currentUnitId || 'edexcel_medicine';
    await switchView('lessons', targetUnit);
    setTimeout(() => {
      if (typeof window.openUnitResourceDrawer === 'function') {
        window.openUnitResourceDrawer(targetUnit, 'booklets');
      }
    }, 80);
    return;
  } else if (viewName === 'mock-exams' || viewName === 'exam-practice') {
    const targetUnit = param || state.selectedUnitId || window.currentUnitId;
    if (targetUnit === 'ks2_ww2') {
      await switchView('lessons', 'ks2_ww2');
      return;
    }
    if (targetUnit) await loadUnit(targetUnit);
    renderMockExamsView();
  } else if (viewName === 'lessons') {
    const targetUnit = param || state.selectedUnitId || window.currentUnitId || 'edexcel_medicine';
    await loadUnit(targetUnit);
    await renderLessonsView();
    if (options && typeof options.lessonIndex === 'number') {
      if (typeof window.viewLessonDetail === 'function') {
        window.viewLessonDetail(options.lessonIndex, null, true);
      } else if (typeof window.renderLessonByIndex === 'function') {
        window.renderLessonByIndex(options.lessonIndex, true);
      }
      window.hhRecordLastLesson?.({
        unitId: targetUnit,
        lessonIndex: options.lessonIndex,
      });
    }
  } else if (viewName === 'curriculum' || viewName === 'department-portal') {
    if (!isStaffModeActive()) {
      const unlocked =
        typeof window.promptStaffUnlock === 'function' ? window.promptStaffUnlock() : false;
      if (!unlocked) {
        await switchView('dashboard');
        return;
      }
    }
    await ensureFullDatabaseLoaded();
    const { renderDepartmentPortal } = await import('./department_portal.js');
    const portalTab = viewName === 'curriculum' ? 'curriculum' : param;
    await renderDepartmentPortal();
    if (portalTab && typeof window !== 'undefined' && typeof window.switchPortalTab === 'function') {
      window.switchPortalTab(portalTab);
    }
  } else if (viewName === 'competitions') {
    const { renderCompetitionsView } = await import('./competitions_zone.js');
    renderCompetitionsView();
  } else if (viewName === 'chess') {
    const { renderChessHubView } = await import('./chess_zone.js');
    renderChessHubView();
  } else if (viewName === 'masterpiece' || viewName === 'gallery') {
    await ensureFullDatabaseLoaded();
    await renderMasterpieceView();
  } else if (viewName === 'reader' || viewName === 'textbook-reader') {
    const unitTarget =
      (param && typeof param === 'string' && param.split(':')[0]) ||
      state.selectedUnitId ||
      window.currentUnitId ||
      'cme_new';
    if (unitTarget === 'ks2_ww2') {
      await loadUnit('ks2_ww2');
      await renderReadingView(options);
    } else {
      if (unitTarget && unitTarget !== state.selectedUnitId) {
        await loadUnit(unitTarget);
      }
      await renderDigitalReaderView(param);
    }
  } else if (viewName === 'reading' || viewName === 'guided-reading') {
    const targetUnit = param || state.selectedUnitId || window.currentUnitId || 'great_war_part2';
    await loadUnit(targetUnit);
    await renderReadingView(options);
  } else if (viewName === 'marking' || viewName === 'answers') {
    const targetUnit = param || state.selectedUnitId || window.currentUnitId || 'great_war_part2';
    await loadUnit(targetUnit);
    await renderMarkingView(options);
  } else if (
    viewName === 'gcse-tracker' ||
    viewName === 'spec-tracker' ||
    viewName === 'revision-builder' ||
    viewName === 'year11-tracker'
  ) {
    // Specification Tracker is temporarily paused. Gracefully redirect to GCSE dashboard.
    state.selectedUnitId = null;
    window.currentUnitId = null;
    appStore.state.currentView = 'dashboard';
    window.location.hash = '';
    renderDashboard();
  } else {
    const fallbackUnit = param || state.selectedUnitId || window.currentUnitId;
    if (fallbackUnit === 'ks2_ww2') {
      await switchView('lessons', 'ks2_ww2');
      return;
    }
    console.warn(`[Router] Unrecognized view '${viewName}', gracefully falling back to dashboard.`);
    state.selectedUnitId = null;
    window.currentUnitId = null;
    appStore.state.currentView = 'dashboard';
    renderDashboard();
  }

  // Update dynamic breadcrumbs, header back button & browser document.title
  updateBreadcrumbs();
  updateHeaderBackBtn(viewName);
  if (typeof document !== 'undefined') {
    const hasOpenLesson =
      viewName === 'lessons' &&
      options &&
      typeof options.lessonIndex === 'number' &&
      state.activeUnitData &&
      state.activeUnitData.lessons &&
      state.activeUnitData.lessons[options.lessonIndex];

    if (!hasOpenLesson) {
      const unitTitleClean =
        state.activeUnitData && state.activeUnitData.title
          ? state.activeUnitData.title.replace(/^(?:Paper \d+:?|KS3:?|GCSE[^:]*:?)\s*/i, '').trim()
          : '';
      if (viewName === 'dashboard') {
        document.title = 'The History Revision Hub';
      } else if (viewName === 'schools') {
        document.title = SCHOOLS_SEO_PAGE.seoTitle;
      } else if (viewName === 'mock-exams' || viewName === 'exam-practice') {
        document.title = unitTitleClean
          ? `Mock Exams & Mark Schemes — ${unitTitleClean}`
          : 'Mock Exams & Mark Schemes — The History Revision Hub';
      } else if (viewName === 'timeline') {
        document.title = unitTitleClean
          ? `Chronological Timeline — ${unitTitleClean}`
          : 'Chronological Timeline — The History Revision Hub';
      } else if (viewName === 'lessons' && unitTitleClean) {
        document.title = `${unitTitleClean} — The History Revision Hub`;
      }
    }
  }

  // Attach safe draft preservation to newly rendered container
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    initDraftPreservation(mainContent, `${param || viewName}`);
  }

  // Secondary tick to ensure newly injected DOM content stays at top if not restoring scroll
  if (!options.skipScrollToTop) {
    requestAnimationFrame(() => scrollToTop(true));
  }
}

// Dynamically fetch and parse the compiled JSON for a unit
async function loadUnit(unitId) {
  const currentLessons = state.activeUnitData
    ? state.activeUnitData.lessons || state.activeUnitData.subtopics
    : null;
  const isStub = Boolean(state.db && state.db[unitId] && state.db[unitId]._isIndexStub);
  const isAlreadyLoaded =
    !isStub && state.selectedUnitId === unitId && currentLessons && currentLessons.length > 0;

  if (!isAlreadyLoaded) {
    state.selectedUnitId = unitId;

    if (!state.db || !state.db[unitId] || state.db[unitId]._isIndexStub) {
      await ensureUnitLoaded(unitId);
    }

    if (state.db && state.db[unitId]) {
      const unitPayload = state.db[unitId];
      state.activeUnitData = unitPayload.data || (unitPayload.lessons ? unitPayload : {});
      window.currentUnitData = state.activeUnitData;
      window.currentUnitId = unitId;
      if (appStore && appStore.state) {
        appStore.state.activeUnitData = state.activeUnitData;
        appStore.state.selectedUnitId = unitId;
      }
    } else {
      console.error('Unit not found in database.json:', unitId);
      state.activeUnitData = {};
    }

    // Fallback: Dynamically generate quizData from lesson do_now quizzes if missing
    if (!state.activeUnitData.quizData) {
      const extractedQuizData = [];
      const lessonsList = state.activeUnitData.lessons || state.activeUnitData.subtopics || [];
      lessonsList.forEach((lesson, lIdx) => {
        const baseId = lesson.id || `lesson_${lIdx + 1}`;
        const rawQuizzes = lesson.quiz || lesson.quick_quiz || lesson.quiz_questions;
        if (rawQuizzes && Array.isArray(rawQuizzes)) {
          rawQuizzes.forEach((q, idx) => {
            const prompt = q.question || q.q;
            const ans = q.answer || q.a;
            if (prompt && ans && q.options && Array.isArray(q.options)) {
              extractedQuizData.push({
                id: `q_${baseId}_${idx}`,
                question: prompt,
                options: q.options,
                answer: ans,
                distractors: q.options.filter((opt) => opt !== ans),
                explanation:
                  q.explanation || `Core recall question from ${lesson.title || baseId}.`,
              });
            }
          });
        }
        if (lesson.do_now && lesson.do_now.type === 'quiz' && lesson.do_now.questions) {
          lesson.do_now.questions.forEach((q, idx) => {
            extractedQuizData.push({
              id: `q_${baseId}_${idx}`,
              question: q.question,
              options: q.options,
              answer: q.options[q.answer],
              distractors: q.options.filter((opt, i) => i !== q.answer),
              explanation: q.explanation || 'No further explanation provided.',
            });
          });
        }
        if (lesson.part3 && Array.isArray(lesson.part3)) {
          lesson.part3.forEach((stmt, idx) => {
            extractedQuizData.push({
              id: `q_${baseId}_p3_${idx}`,
              question: `True or False: ${stmt.text}`,
              options: ['True', 'False'],
              answer: 'True', // Historically they are all correct core statements
              distractors: ['False'],
              explanation: 'This is a core historical statement from the lesson.',
            });
          });
        }
      });
      if (extractedQuizData.length > 0) {
        state.activeUnitData.quizData = extractedQuizData;
      }
    }

    // Fallback: Map 'timeline' array to 'timelineEvents' if missing but 'timeline' exists
    if (
      !state.activeUnitData.timelineEvents &&
      state.activeUnitData.timeline &&
      Array.isArray(state.activeUnitData.timeline)
    ) {
      state.activeUnitData.timelineEvents = state.activeUnitData.timeline.map((t) => ({
        year: t.date || t.year,
        text: t.detail || t.description || t.text || '',
        title: t.title || t.event || '',
      }));
    }

    // CME Living Timeline Integration
    if (unitId === 'cme_new' || unitId === 'gcse_middle_east_1945_1995') {
      try {
        const cmeTl = await import('./data/cme/timeline_data.js');
        if (cmeTl && cmeTl.CME_TIMELINE_MILESTONES) {
          state.activeUnitData.timelineMilestones = cmeTl.CME_TIMELINE_MILESTONES;
          state.activeUnitData.eras = cmeTl.CME_ERAS;
          state.activeUnitData.timelineEvents = cmeTl.CME_TIMELINE_MILESTONES.map((m) => ({
            year: m.date,
            title: m.title,
            text: m.action || m.trigger || '',
            ...m,
          }));
        }
      } catch (err) {
        console.error('Failed to load CME timeline data:', err);
      }
    }

    // Medicine Living Timeline Integration
    if (unitId === 'edexcel_medicine') {
      try {
        const medTl = await import('./data/medicine/timeline_data.js');
        if (medTl && medTl.MEDICINE_TIMELINE_MILESTONES) {
          state.activeUnitData.timelineMilestones = medTl.MEDICINE_TIMELINE_MILESTONES;
          state.activeUnitData.eras = medTl.MED_ERAS;
          state.activeUnitData.timelineEvents = medTl.MEDICINE_TIMELINE_MILESTONES.map((m) => ({
            year: m.date,
            title: m.title,
            text: m.breakthrough || m.continuityContext || '',
            ...m,
          }));
        }
      } catch (err) {
        console.error('Failed to load Medicine timeline data:', err);
      }
    }

    // Add loaded questions to general index to support Leitner status mapping
    if (!state.allQuestions) state.allQuestions = [];
    if (state.activeUnitData.quizData) {
      state.activeUnitData.quizData.forEach((q) => {
        if (!state.allQuestions.some((existing) => existing.id === q.id)) {
          state.allQuestions.push(q);
        }
      });
    }
  }

  updateSidebarForUnit(unitId, state.activeUnitData);
  if (typeof window.renderFloatingCmeMapButton === 'function') {
    window.renderFloatingCmeMapButton();
  }
}

function updateSidebarForUnit(unitId, unitData = {}) {
  syncKs2PortalState(unitId, unitData, appStore.state.currentView || state.currentView);
  const globalNav = document.getElementById('sidebar-global-nav');
  const unitWorkspace = document.getElementById('sidebar-unit-workspace');
  if (globalNav) globalNav.style.display = 'none';
  if (unitWorkspace) unitWorkspace.style.display = 'flex';
  if (typeof window.syncStaffUiState === 'function') {
    window.syncStaffUiState();
  }

  // Handle classroom lockdown mode and KS2 portal navigation
  const unitBackBtn = document.getElementById('unit-nav-back');
  const urlParams = new URLSearchParams(window.location.search);
  const isLocked =
    urlParams.get('locked') === 'true' ||
    urlParams.get('mode') === 'pupil' ||
    urlParams.get('safeguard') === 'true';
  const isKs2Active =
    (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('hh_portal') === 'ks2') ||
    urlParams.get('portal') === 'ks2' ||
    isKs2UnitIdentifier(unitId, unitData);

  const sidebarUnitsContainer = document.getElementById('sidebar-unit-links');
  const sidebarUnitsHeader = document.getElementById('sidebar-units-header');

  if (isLocked) {
    if (unitBackBtn) unitBackBtn.style.display = 'none';
    if (sidebarUnitsContainer) {
      sidebarUnitsContainer.style.display = 'none';
      sidebarUnitsContainer.innerHTML = '';
    }
    if (sidebarUnitsHeader) sidebarUnitsHeader.style.display = 'none';

    // Inject visible Safeguard Active indicator
    let badge = document.getElementById('sidebar-safeguard-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'sidebar-safeguard-badge';
      badge.style.cssText =
        'margin: 6px 12px 10px 12px; background: rgba(30, 58, 138, 0.35); border: 1px solid rgba(96, 165, 250, 0.45); border-radius: 6px; padding: 6px 10px; font-size: 0.72rem; color: #93c5fd; display: flex; align-items: center; gap: 8px; font-family: Inter, sans-serif;';
      badge.innerHTML =
        '<i class="fa-solid fa-shield-halved" style="color: #60a5fa; font-size: 0.85rem;"></i><span><strong>Classroom Safeguard Active</strong></span>';
      const unitCard = document.getElementById('sidebar-unit-card');
      if (unitCard && unitCard.parentNode) {
        unitCard.parentNode.insertBefore(badge, unitCard.nextSibling);
      }
    }
  } else {
    const existingBadge = document.getElementById('sidebar-safeguard-badge');
    if (existingBadge) existingBadge.remove();

    if (unitBackBtn) {
      unitBackBtn.style.display = 'flex';
      unitBackBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i><span>Main Dashboard</span>';
      unitBackBtn.onclick = (e) => {
        if (e) e.preventDefault();
        switchView('dashboard');
      };
    }
    if (sidebarUnitsContainer) sidebarUnitsContainer.style.display = 'flex';
    if (sidebarUnitsHeader) sidebarUnitsHeader.style.display = 'block';
  }

  const navDecisions = document.getElementById('nav-decisions');
  const navTaboo = document.getElementById('nav-taboo');
  const navLessons = document.getElementById('nav-lessons');
  const navLessonsLabel = document.getElementById('nav-lessons-label');
  const navLessonsCountPill = document.getElementById('nav-lessons-count-pill');
  const navInteractive = document.getElementById('nav-interactive');
  const navArcade = document.getElementById('nav-arcade');
  const navTimeline = document.getElementById('nav-timeline');
  const navUnitBooklet = document.getElementById('nav-unit-booklet');
  const navUnitInfographics = document.getElementById('nav-unit-infographics');
  const navMockExams = document.getElementById('nav-mock-exams');
  const navIndividuals = document.getElementById('nav-individuals');
  const navReading = document.getElementById('nav-reading');

  const unitKeystage = document.getElementById('sidebar-unit-keystage');
  const unitTitleEl = document.getElementById('sidebar-unit-title');

  const isTrip = unitData && unitData.type === 'trip';

  // Set KeyStage badge
  let ksLabel = 'KS3 HISTORY';
  if (
    unitId.startsWith('gcse_') ||
    unitId === 'cme_new' ||
    unitId === 'weimar_nazi_germany' ||
    unitId === 'edexcel_medicine' ||
    unitId === 'eee' ||
    unitId === 'usa'
  ) {
    ksLabel = 'EDEXCEL GCSE';
  } else if (
    unitData.is_ks2 ||
    unitId.startsWith('ks2_') ||
    (unitData.keyStage && unitData.keyStage.toLowerCase().includes('stage 2'))
  ) {
    ksLabel = 'KEY STAGE 2';
  } else if (isTrip) {
    ksLabel = 'BATTLEFIELD TOUR';
  }
  if (unitKeystage) unitKeystage.textContent = ksLabel;

  // Set Unit Title
  if (unitTitleEl) {
    const title = unitData.title || (unitData.meta && unitData.meta.title) || 'Unit Scheme of Work';
    unitTitleEl.textContent = title;
  }

  // Wire Unit Card click handler (Smart Hybrid Navigation)
  const unitCard = document.getElementById('sidebar-unit-card');
  if (unitCard) {
    unitCard.setAttribute('role', 'button');
    unitCard.setAttribute('tabindex', '0');

    const updateUnitCardTitle = () => {
      const currentUrl = new URL(window.location.href);
      const hasLessonParam = currentUrl.searchParams.has('lesson');
      const isInsideLesson =
        hasLessonParam ||
        (typeof window.currentLessonIndex !== 'undefined' && window.currentLessonIndex !== null) ||
        Boolean(document.getElementById('lesson-detail-container'));
      const isNotLessonsView = appStore.state.currentView !== 'lessons';

      unitCard.title =
        isInsideLesson || isNotLessonsView
          ? 'Return to Unit Overview'
          : isKs2Active
            ? 'Return to KS2 Junior Hub'
            : 'Return to Main Dashboard';
    };

    updateUnitCardTitle();
    unitCard.onmouseenter = updateUnitCardTitle;

    const handleUnitCardClick = (e) => {
      if (e) e.preventDefault();
      const currentUrl = new URL(window.location.href);
      const hasLessonParam = currentUrl.searchParams.has('lesson');
      const isInsideLesson =
        hasLessonParam ||
        (typeof window.currentLessonIndex !== 'undefined' && window.currentLessonIndex !== null) ||
        Boolean(document.getElementById('lesson-detail-container'));
      const isNotLessonsView = appStore.state.currentView !== 'lessons';

      if (isInsideLesson || isNotLessonsView) {
        // Return to Unit Overview / Unit Homepage
        window._unitReturnOrigin = null;
        window.currentLessonIndex = null;
        switchView('lessons', unitId);
      } else {
        // Already on Unit Overview -> return to Main Dashboard / KS2 Junior Hub
        window._unitReturnOrigin = null;
        switchView('dashboard');
      }
    };

    unitCard.onclick = handleUnitCardClick;
    unitCard.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleUnitCardClick(e);
      }
    };
  }

  // Calculate and display Lesson Count Micro-Badge
  const lessons = unitData.lessons || unitData.subtopics || [];
  const lessonCount = lessons.length;
  if (navLessonsCountPill) {
    navLessonsCountPill.textContent = isTrip ? `${lessonCount} Stops` : `${lessonCount} Lessons`;
    navLessonsCountPill.style.display = lessonCount > 0 ? 'inline-block' : 'none';
  }

  if (isTrip) {
    if (typeof window.highlightActiveSidebarUnit === 'function') {
      window.highlightActiveSidebarUnit(unitId);
    }
    return;
  }

  // Standard Curriculum Unit: Configure consolidated tabs
  const topTree = document.getElementById('sidebar-lessons-tree');
  const chevron = document.getElementById('nav-lessons-chevron');

  if (navLessons) {
    navLessons.style.display = 'flex';
    delete navLessons.dataset.action;
    navLessons.dataset.view = 'lessons';
    navLessons.dataset.unit = unitId;
    if (navLessonsLabel)
      navLessonsLabel.textContent = isTrip ? 'Tour Itinerary' : 'Enquiry Lessons';

    // Populate Unit Workspace direct lesson tree
    const lessonsList = unitData.lessons || unitData.subtopics || [];
    if (topTree && lessonsList.length > 0) {
      topTree.innerHTML = '';
      const hasLessonZero = (lessonsList[0] && (lessonsList[0].id === 'lesson_0' || (lessonsList[0].title && lessonsList[0].title.includes('KT 1.0'))));
      lessonsList.forEach((sub, idx) => {
        const item = document.createElement('div');
        item.className = 'sidebar-lesson-item';
        item.setAttribute('data-lesson-index', idx);
        const rawTitle = sub.title || (hasLessonZero && idx === 0 ? 'Intro Lesson' : `Lesson ${hasLessonZero ? idx : idx + 1}`);
        const cleanTitle = rawTitle.replace(/^(?:Enquiry|Lesson)\s*\d+:\s*/i, '').trim();
        const badgeText = hasLessonZero ? (idx === 0 ? '0' : idx) : (idx + 1);
        item.innerHTML = `
          <span class="sidebar-lesson-badge">${badgeText}</span>
          <span class="sidebar-lesson-title-text" title="${cleanTitle.replace(/"/g, '&quot;')}">${cleanTitle}</span>
        `;
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          window._unitReturnOrigin = null;
          const currentActiveView = appStore.state.currentView || state.currentView;
          if (currentActiveView === 'lessons' && typeof window.viewLessonDetail === 'function') {
            window.viewLessonDetail(idx);
          } else {
            switchView('lessons', unitId, false, { lessonIndex: idx });
          }
          if (typeof window.highlightActiveSidebarLesson === 'function') {
            window.highlightActiveSidebarLesson(idx);
          }
          // Mobile drawer auto-close
          const sidebar = document.getElementById('app-sidebar');
          const overlay = document.querySelector('.sidebar-overlay');
          if (window.innerWidth <= 768 && sidebar && overlay) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
          }
        });
        topTree.appendChild(item);
      });

      // Show top tree by default when inside unit lessons workspace
      topTree.style.display = 'flex';
      if (chevron) {
        chevron.style.display = 'inline-block';
        chevron.style.transform = 'rotate(180deg)';
      }
      if (typeof window.highlightActiveSidebarLesson === 'function') {
        const curIdx =
          state && typeof state.activeLessonIndex === 'number' ? state.activeLessonIndex : null;
        window.highlightActiveSidebarLesson(curIdx);
      }
    } else if (topTree) {
      topTree.style.display = 'none';
      topTree.innerHTML = '';
      if (chevron) chevron.style.display = 'none';
    }

    // Toggle accordion interaction
    const toggleTree = (e) => {
      if (e) e.stopPropagation();
      if (!topTree || topTree.children.length === 0) return;
      const isHidden = topTree.style.display === 'none';
      topTree.style.display = isHidden ? 'flex' : 'none';
      if (chevron) chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    };

    if (chevron) {
      chevron.onclick = toggleTree;
    }

    navLessons.onclick = (e) => {
      if (e) e.stopPropagation();
      window._unitReturnOrigin = null;
      const isCurrentlyLessons =
        (appStore.state.currentView === 'lessons' || (state && state.currentView === 'lessons')) &&
        state.selectedUnitId === unitId;
      const isInsideActiveLesson =
        isCurrentlyLessons &&
        typeof window.currentLessonIndex === 'number' &&
        window.currentLessonIndex >= 0;
      if (isCurrentlyLessons && !isInsideActiveLesson && topTree && topTree.children.length > 0) {
        toggleTree(e);
      } else {
        window.currentLessonIndex = null;
        switchView('lessons', unitId);
      }
    };
  }

  // Living Chronological Timeline (promoted for Middle East, KS2 units, and units with timelines)
  const hasTimeline =
    unitId === 'cme_new' ||
    unitId === 'gcse_middle_east_1945_1995' ||
    unitId === 'ks2_ww2' ||
    unitId === 'ks2_stone_to_iron_age' ||
    unitId === 'ks2_romans' ||
    unitId === 'ks2_anglo_saxons_vikings' ||
    unitId === 'ks2_ancient_egypt' ||
    unitId === 'ks2_ancient_greece' ||
    unitId === 'ks2_early_islamic_baghdad' ||
    unitId === 'ks2_maya_civilisation' ||
    Boolean(unitData.timelineEvents && unitData.timelineEvents.length > 0) ||
    Boolean(unitData.timeline && unitData.timeline.length > 0);

  if (navTimeline && hasTimeline) {
    navTimeline.style.display = 'flex';
    delete navTimeline.dataset.action;
    navTimeline.dataset.view = 'timeline';
    navTimeline.dataset.unit = unitId;
    navTimeline.innerHTML =
      String(unitId || '').startsWith('ks2_')
        ? '<i class="fa-solid fa-sliders" style="color: #3b82f6;"></i><span>Milestones Slider</span>'
        : '<i class="fa-solid fa-clock-rotate-left" style="color: #10b981;"></i><span>Living Chronology</span>';
    navTimeline.onclick = (e) => {
      if (e) e.stopPropagation();
      saveUnitReturnOrigin();
      switchView('timeline', unitId);
    };
  } else if (navTimeline) {
    navTimeline.style.display = 'none';
  }

  // Universal 7-Game Revision Arcade (visible across all curriculum units)
  if (navArcade) {
    navArcade.style.display = 'flex';
    delete navArcade.dataset.action;
    navArcade.dataset.view = 'arcade';
    navArcade.dataset.unit = unitId;
    navArcade.innerHTML =
      '<i class="fa-solid fa-gamepad" style="color: #38bdf8;"></i><span>Revision Arcade</span>';
    navArcade.onclick = (e) => {
      if (e) e.stopPropagation();
      saveUnitReturnOrigin();
      switchView('arcade', unitId, false, { lessonScope: 'all', game: 'lobby' });
    };
  }

  // Interactive Quizzing & Flashcards
  if (navInteractive) {
    navInteractive.style.display = 'flex';
    delete navInteractive.dataset.action;
    navInteractive.dataset.view = 'interactive';
    navInteractive.dataset.unit = unitId;
    navInteractive.innerHTML =
      '<i class="fa-solid fa-bolt" style="color: #a78bfa;"></i><span>Quizzing &amp; Flashcards</span>';
    navInteractive.onclick = (e) => {
      if (e) e.stopPropagation();
      saveUnitReturnOrigin();
      switchView('interactive', unitId);
    };
  }

  // Unit PDFs & Booklets (opens single-home Booklets drawer on Unit Overview)
  const catalogEntry = getUnitCatalogEntry(unitId);
  if (navUnitBooklet && catalogEntry) {
    navUnitBooklet.style.display = 'flex';
    delete navUnitBooklet.dataset.action;
    navUnitBooklet.innerHTML =
      '<i class="fa-solid fa-file-pdf" style="color: #f59e0b;"></i><span>PDFs &amp; Booklets</span>';
    navUnitBooklet.onclick = async (e) => {
      if (e) e.stopPropagation();
      const curView = appStore.state.currentView || state.currentView;
      const inLesson = typeof window.currentLessonIndex === 'number' && window.currentLessonIndex >= 0;
      if (curView !== 'lessons' || inLesson) {
        window.currentLessonIndex = null;
        await switchView('lessons', unitId);
      }
      setTimeout(() => {
        if (typeof window.openUnitResourceDrawer === 'function') {
          window.openUnitResourceDrawer(unitId, 'booklets');
        }
      }, 60);
    };
  } else if (navUnitBooklet) {
    navUnitBooklet.style.display = 'none';
  }

  // Unit Infographics (opens single-home Infographics drawer ONLY when unit has infographics)
  const manifestInfos =
    typeof window !== 'undefined' &&
    window.__INFOGRAPHICS_MANIFEST__ &&
    Array.isArray(window.__INFOGRAPHICS_MANIFEST__[unitId])
      ? window.__INFOGRAPHICS_MANIFEST__[unitId].filter((it) => it && (it.image || it.interactiveUrl))
      : [];
  const hasCatalogInfographics = Boolean(
    !isKs2UnitIdentifier(unitId, unitData) &&
      ((catalogEntry &&
        Array.isArray(catalogEntry.courseInfographics) &&
        catalogEntry.courseInfographics.length > 0) ||
        manifestInfos.length > 0),
  );
  if (navUnitInfographics) {
    navUnitInfographics.style.display = hasCatalogInfographics ? 'flex' : 'none';
    delete navUnitInfographics.dataset.action;
    navUnitInfographics.innerHTML =
      '<i class="fa-solid fa-image" style="color: #34d399;"></i><span>Infographics</span>';
    navUnitInfographics.onclick = async (e) => {
      if (e) e.stopPropagation();
      const curView = appStore.state.currentView || state.currentView;
      const inLesson = typeof window.currentLessonIndex === 'number' && window.currentLessonIndex >= 0;
      if (curView !== 'lessons' || inLesson) {
        window.currentLessonIndex = null;
        await switchView('lessons', unitId);
      }
      setTimeout(() => {
        if (typeof window.openUnitResourceDrawer === 'function') {
          window.openUnitResourceDrawer(unitId, 'infographics');
        }
      }, 60);
    };
  }

  const isGcseUnitNav = ['edexcel_medicine', 'eee', 'gcse_cold_war', 'cme_new', 'weimar_nazi_germany', 'usa'].includes(unitId);

  // GCSE Exam Practice (visible only on GCSE assessment units)
  const hasMockExams = Boolean(
    isGcseUnitNav &&
      unitData.mock_exams &&
      Array.isArray(unitData.mock_exams) &&
      unitData.mock_exams.length > 0,
  );
  if (navMockExams && hasMockExams) {
    navMockExams.style.display = 'flex';
    delete navMockExams.dataset.action;
    navMockExams.dataset.view = 'mock-exams';
    navMockExams.dataset.unit = unitId;
    navMockExams.innerHTML =
      '<i class="fa-solid fa-file-signature" style="color: #6366f1;"></i><span>GCSE Exam Practice</span>';
    navMockExams.onclick = (e) => {
      if (e) e.stopPropagation();
      saveUnitReturnOrigin();
      switchView('mock-exams', unitId);
    };
  } else if (navMockExams) {
    navMockExams.style.display = 'none';
  }

  // Literary Companion (Guided Reading Extracts & Audio Studio — strictly KS2–KS3 only)
  const hasGuidedReading = Boolean(
    !isGcseUnitNav &&
      unitData.guided_reading &&
      Array.isArray(unitData.guided_reading) &&
      unitData.guided_reading.length > 0,
  );
  if (navReading && hasGuidedReading) {
    navReading.style.display = 'flex';
    delete navReading.dataset.action;
    navReading.dataset.view = 'reading';
    navReading.dataset.unit = unitId;
    navReading.innerHTML =
      '<i class="fa-solid fa-book-open-reader" style="color: #be185d;"></i><span>Literary Companion</span>';
    navReading.onclick = (e) => {
      if (e) e.stopPropagation();
      saveUnitReturnOrigin();
      switchView('reading', unitId);
    };
  } else if (navReading) {
    navReading.style.display = 'none';
  }

  // Key Individuals & Organisations Dossier Gallery (shown across KS2, KS3 & GCSE whenever unit defines key_individuals)
  const unitAgents = Array.isArray(unitData.key_individuals) ? unitData.key_individuals : [];
  const hasAgentsGallery = unitAgents.length > 0;
  if (navIndividuals && hasAgentsGallery) {
    const hasOrgDossiers = unitAgents.some((p) =>
      /^org/i.test(String(p?.entity_type || p?.entityType || p?.type || '').trim()),
    );
    navIndividuals.classList.add('nav-item');
    navIndividuals.style.setProperty('display', 'flex', 'important');
    delete navIndividuals.dataset.action;
    navIndividuals.dataset.view = 'individuals';
    navIndividuals.dataset.unit = unitId;
    navIndividuals.innerHTML = hasOrgDossiers
      ? '<i class="fa-solid fa-users-rectangle" style="color: #0d9488;"></i><span>People &amp; Organisations</span>'
      : '<i class="fa-solid fa-user-tie" style="color: #0d9488;"></i><span>Key Individuals</span>';
    navIndividuals.onclick = (e) => {
      if (e) e.stopPropagation();
      saveUnitReturnOrigin();
      switchView('individuals', unitId);
    };
  } else if (navIndividuals) {
    navIndividuals.style.setProperty('display', 'none', 'important');
  }

  // Hide secondary / fragmented tabs to preserve clean hierarchy
  if (navUnitBooklet) navUnitBooklet.style.display = 'none';
  if (navReading && !hasGuidedReading) navReading.style.display = 'none';
  if (navDecisions) navDecisions.style.display = 'none';
  if (navTaboo) navTaboo.style.display = 'none';

  // Re-sync active sidebar item for the current view (e.g. timeline, lessons, reading)
  const activeUnitView = appStore.state.currentView || state.currentView || 'lessons';
  document.querySelectorAll('#sidebar-unit-workspace .nav-item').forEach((el) => {
    el.classList.remove('active');
  });
  const activeUnitNavItem = document.getElementById(`nav-${activeUnitView}`);
  if (activeUnitNavItem) activeUnitNavItem.classList.add('active');

  // Highlight active unit in lower sidebar tree
  if (typeof window.highlightActiveSidebarUnit === 'function') {
    window.highlightActiveSidebarUnit(unitId);
  }
}

if (typeof window !== 'undefined') {
  window.jumpToKeyIndividual = jumpToKeyIndividual;
  window.launchUnitArcade = function (unitId, lessonIndex = 'all', gameId = 'lobby') {
    saveUnitReturnOrigin();
    const targetUnit =
      unitId || state.selectedUnitId || window.currentUnitId || 'edexcel_medicine';
    switchView('arcade', targetUnit, false, {
      lessonScope: lessonIndex,
      game: gameId,
    });
  };
}
