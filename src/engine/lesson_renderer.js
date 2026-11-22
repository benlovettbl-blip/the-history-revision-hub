import { cleanQuestionText } from '../data_parser.js';
import { generateKeyIndividualEmbedHTML } from '../key_individuals.js';
import { appStore } from './store.js';
import { getAssetUrl } from './assets.js';
import { WORKBOOK_PAGE_MAP, getWorkbookPageAnchor } from './workbook_page_map.js';
import { renderAudioPlaybackBar } from './speech.js';
import {
  parseDurationToSeconds,
  formatShortDuration,
  formatProminentDuration,
  cleanVideoDisplayTitle,
  getSortedLessonVideos,
  formatInteractiveTimestamps,
} from './video_utils.js';
import { isStaffModeActive } from '../data/unit_resources_catalog.js';
import { renderConsolidateStationHTML, initConsolidateStation } from './lesson_consolidate_station.js';
import {
  renderLessonExamPracticeHTML,
  initLessonExamPractice,
  registerUnifiedExamQuestion,
  getNonDuplicateExtraMockQuestions,
  getCanonicalGcsePaperCode,
  getRecommendedExamMins,
} from './lesson_exam_practice_panel.js';
import { getLessonMockQuestions } from './mock_exam_bank_data.js';
import { buildComprehensiveVocabDict, highlightGlossaryInProse } from './disciplinary_glossary.js';
import {
  createLessonNarrativeAnnotator,
  formatVisualPlateCaption,
} from './narrative_annotator.js';
import { renderGcseDoNowPanelHTML, initGcseDoNowEngine } from './gcse_donow_engine.js';
import { getLessonInfographicCount, getLessonInfographicsSync } from '../infographic_viewer.js';

import {
  KS2_CANONICAL_UNITS,
  KS3_CANONICAL_UNITS,
  GCSE_CANONICAL_UNITS,
  isGCSEInteractiveUnit,
  getWbThinStripStylesHTML,
  cleanStemForStripSummary,
  extractEmbeddedStimulusBullets,
  decodeBasicHtmlEntities,
  parseMockSourceExtractToStimuli,
  shortenWorkbookOriginLabel,
  checkIsKs2,
  checkIsKs3,
  checkIsGCSE,
  formatBold,
  isPoetryOrVerse,
  parsePoetryStanzas,
  renderArchivalVerseHtml,
  renderArchivalSourceBody,
  toggleThinkDiscuss,
  jumpToNarrativeBlock,
  jumpToSpineCard,
  jumpToSourceDrawer,
  getFallbackDiscussionIdeas,
  getArchivalSourceDiscussionComponents,
  renderArchivalSourceDiscussionBox,
  getGoldenSentenceExemplar,
  getOddOneOutExemplars,
  isPaintingSource,
  getRetrievalStarterActions,
  renderDoNowInlineTimerHTML,
  renderDoNowHeaderWithTimerHTML,
  renderDoNowTimerBarHTML,
  parseDurationMinutes,
  resolveVideoPathway,
  renderCausalDominoSpine,
  renderLessonNoteScaffold,
  renderLessonVideos,
  extractLearningObjectivesData,
  renderLearningObjectivesSidebarHTML,
  renderLearningObjectivesPanelHTML,
  renderLaunchpadInfographicPanelHTML,
  renderLessonLaunchpad,
  renderSourceUtilityTaskHTML,
  renderHistoricalInterpretationsTaskHTML,
  renderBecauseButSoTaskHTML,
  renderTextbookSpotlightDrawers,
  injectArchivalAudioButtons,
  openHotspotWhiteboardModal,
  initCrummackInteractiveFeatures,
  assignQuestionNumbers,
  renderPoetryDossiersHTML,
  toggleAllAnswers,
  ensureSourceEnquiryGlobalsAndStyles,
  resolveSourceEnquiryMode,
  WEIMAR_WORKBOOK_INTERPRETATIONS,
  buildUnifiedEdexcelSourceHeader,
  isVocabTermPresentInStimulus,
  escStimAttr,
  renderSingleStimulus,
  renderProjectorPane,
  initLessonTripMap,
} from './lesson_renderer_helpers.js';
export * from './lesson_renderer_helpers.js';

var isGCSE = false;


window.renderLessonByIndex = function (index, skipHistory = false) {
  if (typeof window !== 'undefined' && typeof window.cancelSpeech === 'function') {
    window.cancelSpeech();
  }

  const unitDataObj =
    (appStore && appStore.state && appStore.state.activeUnitData) ||
    (typeof window !== 'undefined' && window.currentUnitData) ||
    (typeof window !== 'undefined' && typeof window.getUnitData === 'function'
      ? window.getUnitData(window.currentUnitId)
      : null);

  if (unitDataObj && unitDataObj.lessons && unitDataObj.lessons[index]) {
    const unitId =
      (appStore && appStore.state && appStore.state.selectedUnitId) ||
      (typeof window !== 'undefined' && window.currentUnitId) ||
      unitDataObj.id;
    const lesson = unitDataObj.lessons[index];

    if (typeof window !== 'undefined') {
      window.currentLessonIndex = index;
      window.currentView = 'lessons';
    }
    if (appStore && appStore.state) {
      appStore.state.activeLessonIndex = index;
    }

    if (!skipHistory && typeof window !== 'undefined' && window.history) {
      try {
        const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
        const currentState = window.history.state || {};
        const currentUrlObj = new URL(window.location.href);
        const shouldMergeOverviewPush = Boolean(
          window._lastLessonsOverviewPushTs &&
            Date.now() - window._lastLessonsOverviewPushTs < 220 &&
            currentUrlObj.searchParams.get('view') === 'lessons' &&
            !currentUrlObj.searchParams.get('lesson'),
        );

        if (!shouldMergeOverviewPush) {
          const recentOriginScroll =
            window._unitReturnOriginSavedTs &&
            Date.now() - window._unitReturnOriginSavedTs < 300 &&
            typeof window._unitReturnOrigin?.scrollY === 'number'
              ? window._unitReturnOrigin.scrollY
              : null;
          const preservedScroll =
            recentOriginScroll !== null && currentScroll === 0
              ? recentOriginScroll
              : currentScroll;
          const extraOutgoing = {};
          if (
            currentState.view === 'timeline' &&
            typeof window._unitReturnOrigin?.timelineMilestoneIdx === 'number'
          ) {
            extraOutgoing.timelineMilestoneIdx = window._unitReturnOrigin.timelineMilestoneIdx;
          }
          window.history.replaceState(
            {
              ...currentState,
              scrollY: preservedScroll,
              ...extraOutgoing,
            },
            '',
            window.location.href,
          );
        }

        const url = new URL(window.location);
        url.pathname = '/';
        url.searchParams.set('view', 'lessons');
        const hasLessonZero =
          unitDataObj.lessons[0] &&
          (unitDataObj.lessons[0].id === 'lesson_0' ||
            (unitDataObj.lessons[0].title &&
              unitDataObj.lessons[0].title.includes('KT 1.0')));
        url.searchParams.set(
          'lesson',
          lesson.slug || (hasLessonZero ? (index === 0 ? '0' : index) : index + 1),
        );
        if (unitId) url.searchParams.set('unit', unitId);

        const nextState = {
          view: 'lessons',
          unit: unitId,
          lessonIndex: index,
          scrollY: 0,
        };

        if (shouldMergeOverviewPush) {
          window._lastLessonsOverviewPushTs = 0;
          window.history.replaceState(nextState, '', url);
        } else {
          window.history.pushState(nextState, '', url);
        }
      } catch (e) {
        console.warn('History routing disabled (e.g. file:// protocol):', e);
      }
    }

    if (typeof document !== 'undefined') {
      const unitTitleRaw = unitDataObj.title || 'The History Revision Hub';
      const cleanUnitName = unitTitleRaw
        .replace(/^(?:Paper \d+:?|KS3:?|KS2:?|GCSE[^:]*:?)\s*/i, '')
        .trim();
      document.title = `${(lesson.title || `Lesson ${index + 1}`).trim()} — ${cleanUnitName}`;
    }

    if (typeof window.updateBreadcrumbs === 'function') {
      const rawTitle = lesson.title || `Lesson ${index + 1}`;
      let shortLabel = rawTitle;
      const matchPrefix = rawTitle.match(/^(KT\s*\d+\.\d+|Enquiry\s+\d+|Lesson\s+\d+|Stage\s+\d+)/i);
      if (matchPrefix) {
        shortLabel = matchPrefix[1];
      } else if (rawTitle.length > 25) {
        shortLabel = `Lesson ${index + 1}`;
      }
      let unitTitle = unitDataObj.title
        ? unitDataObj.title.replace(/^(?:Paper \d+:?|KS3:?|KS2:?|GCSE[^:]*:?)\s*/i, '').trim()
        : 'Unit';
      if (unitId === 'ks2_romans') {
        unitTitle = 'The Romans in Britain';
      } else if (unitId === 'ks2_anglo_saxons_vikings') {
        unitTitle = 'Anglo-Saxons & Vikings';
      } else if (unitId === 'ks2_ww2') {
        unitTitle = 'Britain at War (WWII)';
      }
      window.updateBreadcrumbs([
        { label: 'Dashboard', view: 'dashboard' },
        { label: unitTitle, view: 'lessons', unit: unitId },
        { label: shortLabel, tooltip: rawTitle },
      ]);
    }

    if (typeof window.highlightActiveSidebarLesson === 'function') {
      window.highlightActiveSidebarLesson(index);
    }

    document.querySelectorAll('.lesson-link').forEach((l) => l.classList.remove('active'));
    // Try to activate the corresponding sidebar link
    const matchLink = document.querySelector(`.lesson-link[data-index="${index}"]`);
    if (matchLink) {
      matchLink.classList.add('active');
    } else {
      const links = document.querySelectorAll('.lesson-link');
      const isKS3 = unitDataObj.title && unitDataObj.title.includes('KS3');
      if (!isKS3 && links.length > index + 1) {
        // +1 because the first link is Unit Homepage
        links[index + 1].classList.add('active');
      }
    }

    renderLesson(lesson);

    if (typeof window.updateHeaderBackBtn === 'function') {
      window.updateHeaderBackBtn('lessons');
    }

    // Auto-save student draft inputs for this lesson
    if (typeof window.initDraftPreservation === 'function') {
      window.initDraftPreservation(
        document.getElementById('content-area') || document,
        `${unitId}_${lesson.id || index}`,
      );
    }

    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const hasStageJump = (urlParams && urlParams.get('stage')) || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('hh_pending_narrative_jump'));

    if (!hasStageJump && !window._suppressLessonAutoScrollTop) {
      if (window.scrollToTop) window.scrollToTop(true);
      else
        (document.getElementById('content-area') || window).scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
};

export function renderLesson(lesson) {
  if (window.doNowTimers) {
    Object.values(window.doNowTimers).forEach((t) => {
      if (t && t.interval) clearInterval(t.interval);
    });
    window.doNowTimers = {};
  }
  window.postRenderHooks = [];

  // Defensive Normalization: ensure all narrative blocks have consistent text & heading properties
  if (lesson && Array.isArray(lesson.narrative_blocks)) {
    lesson.narrative_blocks.forEach((b) => {
      if (!b.text && b.content) b.text = b.content;
      if (!b.content && b.text) b.content = b.text;
      if (!b.theme_heading && (b.theme || b.title)) b.theme_heading = b.theme || b.title;
      if (!b.theme && b.theme_heading) b.theme = b.theme_heading;
      if (!b.title && b.theme_heading) b.title = b.theme_heading;
    });
  }

  const activeUnit =
    window.currentUnitData || (appStore && appStore.state && appStore.state.activeUnitData) || {};
  if (typeof window !== 'undefined' && Array.isArray(activeUnit.lessons) && lesson) {
    const foundLessonIdx = activeUnit.lessons.findIndex(
      (l) => l === lesson || (l && lesson.id && l.id === lesson.id),
    );
    if (foundLessonIdx !== -1) {
      window.currentLessonIndex = foundLessonIdx;
      if (appStore && appStore.state) appStore.state.activeLessonIndex = foundLessonIdx;
    }
  }
  const unitId =
    activeUnit.id ||
    (typeof window !== 'undefined' && window.location && window.location.search
      ? new URLSearchParams(window.location.search).get('id') ||
      new URLSearchParams(window.location.search).get('unit')
      : null) ||
    window.currentUnitId;
  const isCme =
    unitId === 'cme_new' ||
    (typeof window !== 'undefined' && window.currentUnitId === 'cme_new');
  const isKs2 = checkIsKs2(unitId, activeUnit);
  const isKs3 = checkIsKs3(unitId, activeUnit);
  const isGCSE = checkIsGCSE(unitId, activeUnit);
  if (typeof window !== 'undefined') {
    window.unifiedLessonExamRegistry = {};
    ensureSourceEnquiryGlobalsAndStyles();
  }

  let sourceEnquiryCounter = 0;

  const resolveSourceEnquiryBadge = (srcObj, promptText) => {
    if (srcObj && srcObj.perspective_pair && typeof srcObj.perspective_pair === 'object') {
      const explicitPairBadge = String((srcObj && srcObj.question_badge) || '').trim();
      return explicitPairBadge && !/utility|inference|reliab/i.test(explicitPairBadge)
        ? explicitPairBadge
        : 'Competing Perspectives';
    }
    const isCmeUnit =
      isCme ||
      unitId === 'cme_new' ||
      (typeof window !== 'undefined' && window.currentUnitId === 'cme_new');
    if (isCmeUnit) {
      const explicitBadge = String((srcObj && srcObj.question_badge) || '').trim();
      if (explicitBadge && !/utility|inference|reliab/i.test(explicitBadge)) {
        return explicitBadge;
      }
      return 'Historical Insight';
    }
    return (
      (srcObj && (srcObj.question_badge || srcObj.question_type)) ||
      (() => {
        const p = String(promptText || '');
        if (/what can you infer|what does .* reveal|what does .* show/i.test(p))
          return 'Source Inference';
        if (/why was|why did|purpose|intended|motive|propaganda/i.test(p))
          return 'Author’s Purpose';
        if (/differ|support|challenge|corroborat|contrast|counter/i.test(p))
          return 'Cross-Referencing';
        if (/reliable|convincing|trustworthy|provenance|weight/i.test(p))
          return 'Reliability & Provenance';
        if (/how useful/i.test(p)) return 'Source Utility';
        if (/significance|commemorat|myth/i.test(p)) return 'Historical Significance';
        return 'Enquiry Question';
      })()
    );
  };

  const renderSourceEnquiryBox = ({ srcObj, promptText, contextVal = '', renderedBullets = '' }) => {
    const enqIdx = sourceEnquiryCounter++;
    const dynamicBadge = resolveSourceEnquiryBadge(srcObj, promptText);
    const modeCfg = resolveSourceEnquiryMode(srcObj, promptText);
    const fmt = (txt) =>
      typeof window !== 'undefined' && window.formatBold ? window.formatBold(txt) : txt;

    let answerContentHtml = '';
    if (renderedBullets) {
      answerContentHtml = `
        <div style="background: ${modeCfg.softBg}; border-left: 3.5px solid ${modeCfg.accent}; padding: 9px 13px; border-radius: 0 4px 4px 0;">
          <strong class="source-enquiry-reveal-heading" style="color: ${modeCfg.headingColor}; display: block; margin-bottom: 5px; font-size: 0.80rem; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid ${modeCfg.iconClass}" style="color: ${modeCfg.accent}; margin-right: 6px;"></i>${modeCfg.heading}</strong>
          <ul style="margin: 0; padding-left: 18px;">
            ${renderedBullets}
          </ul>
        </div>
      `;
    } else if (srcObj && srcObj.model_answer) {
      answerContentHtml = `
        <div style="background: ${modeCfg.softBg}; border-left: 3.5px solid ${modeCfg.accent}; padding: 9px 13px; border-radius: 0 4px 4px 0;">
          <strong class="source-enquiry-reveal-heading" style="color: ${modeCfg.headingColor}; display: block; margin-bottom: 4px; font-size: 0.80rem; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid ${modeCfg.iconClass}" style="color: ${modeCfg.accent}; margin-right: 6px;"></i>${modeCfg.heading}</strong>
          <div style="font-size: 0.90rem; color: #1e293b; line-height: 1.55;">${fmt(srcObj.model_answer)}</div>
        </div>
      `;
    } else if (
      srcObj &&
      Array.isArray(srcObj.discussion_ideas) &&
      srcObj.discussion_ideas.length > 0
    ) {
      answerContentHtml = `
        <div style="background: ${modeCfg.softBg}; border-left: 3.5px solid ${modeCfg.accent}; padding: 9px 13px; border-radius: 0 4px 4px 0;">
          <strong class="source-enquiry-reveal-heading" style="color: ${modeCfg.headingColor}; display: block; margin-bottom: 4px; font-size: 0.80rem; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid ${modeCfg.iconClass}" style="color: ${modeCfg.accent}; margin-right: 6px;"></i>${modeCfg.heading}</strong>
          <ul style="margin: 0; padding-left: 18px; font-size: 0.88rem; color: #1e293b; line-height: 1.5;">
            ${srcObj.discussion_ideas.map((d) => `<li style="margin-bottom: 5px;">${fmt(d)}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    const fallbackContextHtml =
      !answerContentHtml && contextVal
        ? `
          <div style="background: #f8fafc; border-left: 3.5px solid #64748b; padding: 9px 13px; border-radius: 0 4px 4px 0;">
            <strong style="color: #334155; display: block; margin-bottom: 4px; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.5px;">Historical Context &amp; Guidance:</strong>
            <div style="font-size: 0.88rem; color: #334155; line-height: 1.52;">${fmt(contextVal)}</div>
          </div>
        `
        : '';

    const teacherSourceCribHtml = (() => {
      if (!srcObj) return '';
      const tnSc = lesson?.teacher_notes?.source_context;
      const sLtr = String(
        srcObj.letter ||
          ((srcObj.title || '').match(/(?:Source|Map|Diagram)\s+([A-E])\b/i) || [])[1] ||
          '',
      ).toUpperCase();
      let tnLookup = '';
      if (tnSc && typeof tnSc === 'object') {
        tnLookup =
          (srcObj.id && tnSc[srcObj.id]) ||
          (sLtr && tnSc[`Source ${sLtr}`]) ||
          (sLtr && tnSc[sLtr]) ||
          (sLtr && tnSc[`source_${sLtr.toLowerCase()}`]) ||
          '';
      }
      let rawCtx = String(contextVal || srcObj.source_context || srcObj.context || tnLookup || '').trim();
      let rawHinge = String(srcObj.hinge_question || '').trim();
      if (/\*{0,2}(?:Hinge Question|Discussion Prompt|Discussion Question):\*{0,2}/i.test(rawCtx)) {
        const parts = rawCtx.split(/\*{0,2}(?:Hinge Question|Discussion Prompt|Discussion Question):\*{0,2}/i);
        rawCtx = (parts[0] || '').trim();
        if (!rawHinge && parts[1]) rawHinge = parts[1].trim();
      } else if (!rawHinge && tnLookup && /\*{0,2}Hinge Question:\*{0,2}/i.test(tnLookup)) {
        const parts = String(tnLookup).split(/\*{0,2}Hinge Question:\*{0,2}/i);
        if (parts[1]) rawHinge = parts[1].trim();
      }
      if (rawHinge && promptText && rawHinge.toLowerCase() === String(promptText).trim().toLowerCase()) {
        rawHinge = '';
      }
      const showCtx = Boolean(answerContentHtml && rawCtx);
      if (!showCtx && !rawHinge) return '';
      return `
        <div class="teacher-only-source-crib no-print" style="margin-top: 8px; padding: 9px 13px; background: #fffbeb; border: 1px solid #fde68a; border-left: 3.5px solid #d97706; border-radius: 0 5px 5px 0;">
          <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.45px; color: #92400e; margin-bottom: 4px; display: flex; align-items: center; gap: 5px;">
            <i class="fa-solid fa-user-tie" style="color: #d97706;"></i> Teacher Source Crib${rawHinge ? ' &amp; Hinge Question' : ''}
          </div>
          ${showCtx ? `<div style="font-size: 0.85rem; color: #334155; line-height: 1.48; margin-bottom: ${rawHinge ? '6px' : '0'};">${fmt(rawCtx)}</div>` : ''}
          ${rawHinge ? `<div style="font-size: 0.86rem; color: #78350f; font-weight: 700; line-height: 1.42;"><span style="text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.35px; color: #b45309; margin-right: 4px;">Hinge Question:</span>${fmt(rawHinge)}</div>` : ''}
        </div>
      `;
    })();

    return `
      <details id="source-enquiry-det-${enqIdx}" class="source-enquiry-reveal ${modeCfg.detailsClass}" data-enquiry-idx="${enqIdx}" data-enquiry-mode="${modeCfg.mode}" ontoggle="if(window.syncSourceAnswerToggle){window.syncSourceAnswerToggle(${enqIdx}, this.open);}">
        <summary class="source-enquiry-single-row-summary" style="padding: 8px 12px; cursor: pointer; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; list-style: none; user-select: none; background: ${modeCfg.softBg}; transition: background 0.15s ease; box-sizing: border-box; width: 100%;">
          <div class="source-enquiry-left-wrap" style="display: flex; align-items: center; gap: 9px; flex: 1 1 auto; min-width: 0; flex-wrap: wrap;">
            <span class="source-enquiry-mode-badge" style="font-size: 0.66rem; font-weight: 800; text-transform: uppercase; color: ${modeCfg.badgeText}; background: ${modeCfg.badgeBg}; border: 1px solid ${modeCfg.badgeBorder}; padding: 2px 7px; border-radius: 10px; letter-spacing: 0.45px; flex-shrink: 0; white-space: nowrap;">${dynamicBadge}</span>
            <div class="source-enquiry-prompt" style="font-family: 'Playfair Display', Georgia, serif; font-size: 0.94rem; color: ${modeCfg.promptColor}; font-weight: 700; line-height: 1.38; flex: 1 1 240px; min-width: 0; white-space: normal; word-break: normal; overflow-wrap: break-word;">${fmt(promptText)}</div>
          </div>
          <span id="ans-btn-${enqIdx}" class="reveal-answer-pill" role="button" aria-expanded="false" data-enquiry-idx="${enqIdx}" data-enquiry-mode="${modeCfg.mode}" data-closed-label="${modeCfg.closedLabel}" data-open-label="${modeCfg.openLabel}" style="flex-shrink: 0;">
            <i class="fa-solid ${modeCfg.iconClass}" style="color: ${modeCfg.accent};"></i>
            <span class="reveal-text-closed">${modeCfg.closedLabel}</span>
            <span class="reveal-text-open">${modeCfg.openLabel}</span>
          </span>
        </summary>
        <div class="source-enquiry-answer-body" style="padding: 10px 14px; background: #ffffff; border-top: 1.5px solid ${modeCfg.border};">
          ${fallbackContextHtml}
          ${answerContentHtml}
          ${teacherSourceCribHtml}
        </div>
      </details>
    `;
  };

  const hasInlineNarrativeSources =
    (Array.isArray(lesson.narrative_blocks) &&
      lesson.narrative_blocks.some((b) => b && (b.source || b.sources))) ||
    (Array.isArray(lesson.narrative_blocks) &&
      Array.isArray(lesson.sources) &&
      lesson.sources.length > 0);
  let htmlDoNow = '',
    htmlDoNowInner = '',
    htmlVocabInner = '',
    htmlSpineInner = '',
    htmlLearningObjectives = '',
    objectivesData = null,
    htmlPrimary = '',
    htmlSources1 = '',
    htmlNarrative = '',
    htmlSpotlightDrawers = '',
    htmlVideo = '',
    htmlPairShare = '',
    htmlHistorian = '',
    htmlTasks = '',
    htmlExamPractice = '',
    htmlVocabDeck = '',
    htmlExtended = '';
  const formatBold = window.formatBold;
  let globalQuestionNum = 1;
  const formatQuestion = (qText, prependNumber = true) => {
    if (!qText) return '';
    let cleaned = cleanQuestionText(qText);
    if (prependNumber) return `Question ${globalQuestionNum++}: ${formatBold(cleaned)}`;
    return formatBold(cleaned);
  };
  lesson = JSON.parse(JSON.stringify(lesson));
  if (!lesson.vocab && lesson.vocabulary) {
    lesson.vocab = lesson.vocabulary;
  }
  assignQuestionNumbers(lesson, unitId);
  objectivesData = extractLearningObjectivesData(lesson);

  // Normalize do_now format
  if (Array.isArray(lesson.do_now)) {
    lesson.do_now = {
      type: 'retrieval_starter',
      title: 'Recall & Retrieval',
      instructions: 'Answer these questions in full sentences.',
      items: lesson.do_now.map((t) => ({ question: t.q || t.question, answer: t.a || t.answer })),
    };
  } else if (
    lesson.do_now &&
    (lesson.do_now.type === 'questions' || lesson.do_now.type === 'retrieval_starter') &&
    lesson.do_now.tasks
  ) {
    lesson.do_now.items = lesson.do_now.tasks.map((t) => ({
      question: t.q || t.question,
      answer: t.a || t.answer,
    }));
  }

  // Extract exam tasks from tasks array so they are not rendered inline
  let extractedExamTasks = [];
  const isSpecialTaskType = (t) =>
    t &&
    (t.type === 'source_utility' ||
      t.taskType === 'source_utility' ||
      t.type === 'historical_interpretations' ||
      t.taskType === 'historical_interpretations' ||
      t.type === 'two_sided_argument' ||
      t.source_a ||
      t.sourceA ||
      t.interp1 ||
      t.interpretation_1);

  if (lesson.narrative_blocks) {
    lesson.narrative_blocks.forEach((block) => {
      if (block.tasks) {
        const eTasks = block.tasks.filter(
          (t) => !isSpecialTaskType(t) && (t.text || t.question || '').includes('marks)'),
        );
        extractedExamTasks.push(...eTasks);
        block.tasks = block.tasks.filter(
          (t) => isSpecialTaskType(t) || !(t.text || t.question || '').includes('marks)'),
        );
      }
    });
  }
  if (!isKs3 && lesson.tasks) {
    const eTasks = lesson.tasks.filter(
      (t) => !isSpecialTaskType(t) && (t.text || t.question || '').includes('marks)'),
    );
    extractedExamTasks.push(...eTasks);
    lesson.tasks = lesson.tasks.filter(
      (t) => isSpecialTaskType(t) || !(t.text || t.question || '').includes('marks)'),
    );
  }

  if (lesson.exam_practice && Array.isArray(lesson.exam_practice)) {
    // Duplication removed: exam_practice is rendered directly below.
  }

  assignQuestionNumbers(lesson, unitId);
  objectivesData = extractLearningObjectivesData(lesson);
  lesson.unitId = unitId;
  window.currentActiveLesson = lesson;

  // Tabs container logic
  let heroImage = '';
  if (lesson.banner) {
    if (typeof lesson.banner === 'string') {
      heroImage = lesson.banner;
    } else if (typeof lesson.banner === 'object' && lesson.banner !== null) {
      heroImage = lesson.banner.image || lesson.banner.url || lesson.banner.src || '';
    }
  }
  if (!heroImage && lesson.banner_image) {
    heroImage =
      typeof lesson.banner_image === 'string'
        ? lesson.banner_image
        : lesson.banner_image.image || lesson.banner_image.url || '';
  }
  if (!heroImage && lesson.hero_image) {
    heroImage =
      typeof lesson.hero_image === 'string'
        ? lesson.hero_image
        : lesson.hero_image.image || lesson.hero_image.url || '';
  }
  if (!heroImage && lesson.cover_image) {
    heroImage =
      typeof lesson.cover_image === 'string'
        ? lesson.cover_image
        : lesson.cover_image.image ||
        (Array.isArray(lesson.cover_image) ? lesson.cover_image[0] : '');
  }

  const isTrip =
    (window.currentUnitData && window.currentUnitData.type === 'trip') ||
    (appStore.state.activeUnitData && appStore.state.activeUnitData.type === 'trip') ||
    window.currentUnitId === 'trip_ypres' ||
    appStore.state.selectedUnitId === 'trip_ypres' ||
    lesson.cwgc_data !== undefined ||
    lesson.id === 'day_0' ||
    (lesson.id && (lesson.id.startsWith('day_') || lesson.id.startsWith('hero_')));
  let lessonPrefix = 'Lesson';
  let ktMatch = lesson.title ? lesson.title.match(/^(?:KT|Key Topic)\s*([\d\.]+)/i) : null;

  if (!heroImage) {
    if (window.currentUnitId === 'cme_new' && ktMatch) {
      if (ktMatch[1].startsWith('1')) heroImage = '/assets/cme_new_kt1_cover.png';
      else if (ktMatch[1].startsWith('2')) heroImage = '/assets/cme_new_kt2_cover.png';
      else if (ktMatch[1].startsWith('3')) heroImage = '/assets/cme_new_kt3_cover.png';
    } else if (window.currentUnitId === 'edexcel_medicine' && ktMatch) {
      if (ktMatch[1].startsWith('1')) heroImage = '/images/banner_medicine_medieval.jpg';
      else if (ktMatch[1].startsWith('2')) heroImage = '/images/banner_medicine_renaissance.jpg';
      else if (ktMatch[1].startsWith('3')) heroImage = '/images/banner_medicine_18th_19th.jpg';
      else if (ktMatch[1].startsWith('4')) heroImage = '/images/banner_medicine_modern.jpg';
      else if (ktMatch[1].startsWith('5')) heroImage = '/images/banner_medicine_western_front.jpg';
    } else if (window.currentUnitId === 'usa' && ktMatch) {
      if (ktMatch[1].startsWith('1'))
        heroImage = '/units/usa/assets/sources/airborne-little-rock-patrol.jpg';
      else if (ktMatch[1].startsWith('2'))
        heroImage = '/units/usa/assets/sources/birmingham-protests-dogs-1963.jpg';
      else if (ktMatch[1].startsWith('3'))
        heroImage = '/units/usa/assets/sources/us-soldier-patrolling-swamp.jpg';
      else if (ktMatch[1].startsWith('4'))
        heroImage = '/units/usa/assets/sources/antiwar-pentagon-protest-1967.jpg';
    } else {
      heroImage = window.currentUnitData?.homepage_background || '';
    }
  }

  if (isTrip) {
    if (lesson.id === 'day_0') {
      lessonPrefix = 'Expedition Briefing';
    } else if (lesson.id && lesson.id.startsWith('day_')) {
      lessonPrefix = `Day ${lesson.id.split('_')[1]} · Field Guide`;
    } else if (lesson.id === 'hero_crummack') {
      lessonPrefix = 'Pupil Family Archive · Year 10 Family';
    } else if (lesson.id && lesson.id.startsWith('hero_lowry_')) {
      lessonPrefix = 'Home Front Memorial · Manor Way Grange';
    } else if (lesson.id && lesson.id.startsWith('hero_')) {
      lessonPrefix = 'Local Hero · Fallen of the Salient';
    }
  } else if (ktMatch) {
    lessonPrefix = `KT ${ktMatch[1]}`;
  } else if (lesson.id && lesson.id.startsWith('lesson_')) {
    const parts = lesson.id.split('_');
    const rawNum = parseInt(parts[1], 10);
    const lessonNum = isNaN(rawNum) || rawNum === 0 ? 1 : rawNum;
    if (parts.length > 2) {
      lessonPrefix = `Lesson ${lessonNum}.${parts.slice(2).join('.')}`;
    } else {
      lessonPrefix = `Lesson ${lessonNum}`;
    }
  }

  let contentArea = document.getElementById('content-area');
  if (!contentArea) {
    const mainContent =
      document.getElementById('main-content') ||
      document.querySelector('.content-container') ||
      document.body;
    contentArea = document.createElement('div');
    contentArea.id = 'content-area';
    contentArea.style.cssText =
      'animation: fadeInUp 0.3s ease-out; background-color: var(--bg-app); min-height: 100vh;';
    mainContent.innerHTML = '';
    mainContent.appendChild(contentArea);
  }
  if (contentArea) contentArea.style.paddingTop = '0'; // Fix gap

  let html = `<div class="lesson-content">`;
  let wbStylesEmitted = false;
  const emitWbStylesOnce = () => {
    if (wbStylesEmitted) return '';
    wbStylesEmitted = true;
    return getWbThinStripStylesHTML();
  };

  let headerEnquiry = lesson.enquiry || lesson.enquiry_question || lesson.inquiry_question;
  let targetText = headerEnquiry || lesson.title || '';
  if (targetText && targetText.length > 90) {
    targetText = lesson.title || targetText;
  }
  // Sticky Header (Clean spatial curriculum anchor with streamlined Classroom Tools)
  const allUnitLessons =
    (appStore.state.activeUnitData && appStore.state.activeUnitData.lessons) ||
    (window.currentUnitData && window.currentUnitData.lessons) ||
    [];
  const currentIndex = allUnitLessons.findIndex(
    (l) => l.title === lesson.title || (lesson.id && l.id === lesson.id),
  );
  // Guided Reading / Literary Companion is strictly a KS2–KS3 literacy feature (never shown on GCSE units)
  const grEntry = isGCSE
    ? null
    : (activeUnit.guided_reading || []).find((gr) => gr.lesson_index === currentIndex || (lesson && gr.lesson_id === lesson.id)) ||
      ((window.currentUnitData && window.currentUnitData.guided_reading) || []).find(
        (gr) => gr.lesson_index === currentIndex || (lesson && gr.lesson_id === lesson.id),
      );

  const isTeacherActive =
    typeof document !== 'undefined' && document.body.classList.contains('teacher-mode-active');
  const isWbActive =
    typeof document !== 'undefined' && document.body.classList.contains('whiteboard-mode-active');
  const hasActiveTool = isTeacherActive || isWbActive;

  const hasLessonZero = allUnitLessons.length > 0 && (allUnitLessons[0].id === 'lesson_0' || (allUnitLessons[0].title && allUnitLessons[0].title.includes('KT 1.0')));
  const isLessonZero = hasLessonZero && (currentIndex === 0 || lesson.id === 'lesson_0' || (lesson.title && lesson.title.includes('KT 1.0')));
  const isGCSEUnit = isGCSE;
  let stickyCountLabel = '';
  if (allUnitLessons.length > 0) {
    if (isLessonZero) {
      stickyCountLabel = 'Introductory Context Lesson';
    } else if (hasLessonZero) {
      stickyCountLabel = isGCSEUnit
        ? `Lesson ${currentIndex} of ${allUnitLessons.length - 1}`
        : `Enquiry ${currentIndex} of ${allUnitLessons.length - 1}`;
    } else {
      stickyCountLabel = isGCSEUnit
        ? `Lesson ${currentIndex + 1} of ${allUnitLessons.length}`
        : `Enquiry ${currentIndex + 1} of ${allUnitLessons.length}`;
    }
  } else {
    stickyCountLabel = lesson.title || '';
  }

  let stickyAnchorText = '';
  if (isTrip) {
    stickyAnchorText = `${lessonPrefix}: ${lesson.title.split('(')[0].trim()}`;
  } else if (isGCSEUnit && ktMatch) {
    if (isLessonZero) {
      stickyAnchorText = `<span class="sticky-lesson-prefix" style="color: #1e3a8a; font-weight: 800; font-family: 'Inter', sans-serif; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px;">${lessonPrefix}</span> <span style="color: #94a3b8; margin: 0 4px;">&bull;</span> <span class="sticky-lesson-enquiry-count" style="color: #475569; font-weight: 600; font-family: 'Inter', sans-serif; font-size: 0.92rem;">Introductory Context Lesson</span>`;
    } else {
      const lessonNum = hasLessonZero ? currentIndex : currentIndex + 1;
      const totalCount = hasLessonZero ? allUnitLessons.length - 1 : allUnitLessons.length;
      stickyAnchorText = `<span class="sticky-lesson-prefix" style="color: #1e3a8a; font-weight: 800; font-family: 'Inter', sans-serif; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px;">${lessonPrefix}</span> <span style="color: #94a3b8; margin: 0 4px;">&bull;</span> <span class="sticky-lesson-enquiry-count" style="color: #475569; font-weight: 600; font-family: 'Inter', sans-serif; font-size: 0.92rem;">Lesson ${lessonNum} of ${totalCount}</span>`;
    }
  } else {
    stickyAnchorText = `<span class="sticky-lesson-enquiry-count" style="color: #1e3a8a; font-weight: 800; font-family: 'Inter', sans-serif; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px;">${stickyCountLabel}</span>`;
  }

  let isFullWidth = false;
  if (typeof document !== 'undefined' && document.body) {
    try {
      if (sessionStorage.getItem('hh_lesson_full_width') === 'true') {
        document.body.classList.add('lesson-full-width');
      }
    } catch (e) { }
    isFullWidth = document.body.classList.contains('lesson-full-width');
  }

  html += `
      <div class="sticky-lesson-header">
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 0 1 auto;">
            <button type="button" class="btn-fullwidth-unit-back no-print" onclick="window.exitFullWidthToUnit()" title="Return to Unit Overview">
              <i class="fa-solid fa-arrow-left" style="font-size: 0.74rem; color: #2563eb;"></i>
              <span>Unit</span>
            </button>
            <h4 class="sticky-lesson-title" title="${(lesson.title || '').replace(/"/g, '&quot;')}">
              ${stickyAnchorText}
            </h4>
          </div>
          <div class="sticky-lesson-actions">
          ${isTrip
      ? ''
      : `
              ${isKs2
        ? `
                    <button type="button" class="btn btn-ks2-worksheet-launcher" onclick="window.openKs2WorksheetModal('${lesson.id}', ${currentIndex})" style="padding: 6px 12px; font-size: 0.88rem; background: #eff6ff; color: #1e3a8a; border: 1.5px solid #bfdbfe; font-weight: 700; border-radius: 6px; box-shadow: 0 1px 3px rgba(30, 58, 138, 0.1); display: inline-flex; align-items: center; gap: 6px; cursor: pointer;" title="Open A4 Companion Worksheet (PDF & Print)"><i class="fa-solid fa-file-pdf" style="color: #2563eb;"></i> <span>Enquiry Worksheet</span></button>
                    ${
                      isStaffModeActive()
                        ? `
                    <button type="button" class="btn btn-ks2-teacher-launcher" onclick="window.openKs2TeacherGuidanceModal('${lesson.id}', ${currentIndex})" style="padding: 6px 12px; font-size: 0.88rem; background: #fdf2f8; color: #9d174d; border: 1.5px solid #fbcfe8; font-weight: 700; border-radius: 6px; box-shadow: 0 1px 3px rgba(157, 23, 77, 0.1); display: inline-flex; align-items: center; gap: 6px; cursor: pointer;" title="Staff Only: Walk-In Primary Teacher Guidance & Model Answers"><i class="fa-solid fa-chalkboard-user" style="color: #be185d;"></i> <span>Teacher Guidance</span></button>
                    <button type="button" class="btn btn-ks2-teacher-mode btn-teacher-mode-toggle ${typeof document !== 'undefined' && document.body.classList.contains('teacher-mode-active') ? 'active' : ''}" onclick="window.toggleTeacherMode()" style="padding: 6px 12px; font-size: 0.88rem; background: #f5f3ff; color: #5b21b6; border: 1.5px solid #ddd6fe; font-weight: 700; border-radius: 6px; box-shadow: 0 1px 3px rgba(91, 33, 182, 0.1); display: inline-flex; align-items: center; gap: 6px; cursor: pointer;" title="Staff Only: Reveal all Do Now, Source, Writing & Quiz answers on this page"><i class="fa-solid ${typeof document !== 'undefined' && document.body.classList.contains('teacher-mode-active') ? 'fa-eye-slash' : 'fa-eye'}" style="color: #7c3aed;"></i> <span class="teacher-btn-label">${typeof document !== 'undefined' && document.body.classList.contains('teacher-mode-active') ? 'Teacher Mode: Answers ON' : 'Teacher Mode: Reveal Answers'}</span></button>
                    `
                        : ''
                    }
                    <a href="/pdfs/${unitId || 'ks2_ww2'}_pupil_workbook.pdf" target="_blank" class="btn btn-ks2-workbook-launcher" style="padding: 6px 12px; font-size: 0.88rem; background: #f0fdf4; color: #166534; border: 1.5px solid #bbf7d0; font-weight: 700; text-decoration: none; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: inline-flex; align-items: center; gap: 6px;" title="Open complete Pupil Workbook (PDF)"><i class="fa-solid fa-book-bookmark" style="color: #16a34a;"></i> <span>Pupil Workbook (PDF)</span></a>
                    <button type="button" class="btn btn-ks2-quiz-jump" onclick="if(window.consolidateStations && window.consolidateStations['${lesson.id}'] && !window.consolidateStations['${lesson.id}'].isOpen){ window.switchConsolidateTab('${lesson.id}', 'quiz'); } else if(window.consolidateStations && window.consolidateStations['${lesson.id}'] && window.consolidateStations['${lesson.id}'].mode !== 'quiz'){ window.switchConsolidateTab('${lesson.id}', 'quiz'); } const qb = document.getElementById('tab-btn-quiz-${lesson.id}'); if(qb) qb.scrollIntoView({ behavior: 'smooth', block: 'start' });" style="padding: 6px 12px; font-size: 0.88rem; background: #fffbeb; color: #92400e; border: 1.5px solid #fde68a; font-weight: 700; border-radius: 6px; box-shadow: 0 1px 3px rgba(146, 64, 14, 0.1); display: inline-flex; align-items: center; gap: 6px; cursor: pointer;" title="Jump straight to the 5-Question Lesson Quiz"><i class="fa-solid fa-circle-question" style="color: #d97706;"></i> <span>Lesson Quiz</span></button>
                  `
        : ''
      }
              ${grEntry
        ? `<button type="button" class="btn btn-guided-reading-launcher" onclick="if(window.saveUnitReturnOrigin){window.saveUnitReturnOrigin();} if(window.switchView){ window.switchView('reading', '${unitId}', false, { rawLesson: '${grEntry.lesson_key || grEntry.lesson_id || (currentIndex + 1)}', lessonIndex: ${currentIndex} }); } else { window.location.href = '/?view=reading&unit=${unitId}&lesson=${grEntry.lesson_key || grEntry.lesson_id || (currentIndex + 1)}'; }" style="padding: 6px 12px; font-size: 0.86rem; background: #fdf2f8; color: #9d174d; border: 1.5px solid #fbcfe8; font-weight: 700; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: inline-flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap; transition: all 0.15s ease;" onmouseover="this.style.background='#fce7f3';" onmouseout="this.style.background='#fdf2f8';" title="Open Literary Companion &amp; Audio Read-Aloud: ${String(grEntry.book_title || '').replace(/"/g, '&quot;')}"><i class="fa-solid fa-book-open-reader" style="color: #be185d;"></i> <span>Guided Reading</span></button>`
        : ''
      }
              ${lesson.note_scaffold
        ? `<button class="btn btn-note-scaffold-jump" onclick="const sc = document.getElementById('lesson-note-scaffold'); if(sc) { sc.open = true; sc.scrollIntoView({ behavior: 'smooth' }); }" style="padding: 6px 12px; font-size: 0.88rem; background: #f0fdf4; color: #166534; border: 1.5px solid #86efac; font-weight: 700; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: inline-flex; align-items: center; gap: 6px; cursor: pointer;" title="Jump directly to the Active Lesson Task"><i class="fa-solid fa-pen-to-square" style="color: #16a34a;"></i> Core Lesson Task</button>`
        : ''
      }
              <button type="button" class="btn btn-lesson-arcade-launcher" onclick="window.launchUnitArcade && window.launchUnitArcade('${unitId}', ${currentIndex}, 'lobby')" style="padding: 6px 12px; font-size: 0.86rem; background: #0f172a; color: #38bdf8; border: 1.5px solid #334155; font-weight: 700; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;" title="Launch the 7-Game Revision Arcade for this lesson"><i class="fa-solid fa-gamepad" style="color: #38bdf8;"></i> <span>Arcade</span></button>
              <button type="button" class="btn teacher-only-plenary-btn" onclick="window.openTeacherPlenaryProjector && window.openTeacherPlenaryProjector('${lesson.id}')" style="display: ${typeof document !== 'undefined' && document.body.classList.contains('teacher-mode-active') ? 'inline-flex' : 'none'}; padding: 6px 12px; font-size: 0.86rem; background: #ea580c; color: #ffffff; border: 1.5px solid #f97316; font-weight: 800; border-radius: 6px; align-items: center; gap: 6px; cursor: pointer;" title="Open Full-Screen Smartboard Plenary Projector (Hot Seat Taboo, 60s Standoff, Four Corners)"><i class="fa-solid fa-tv"></i> <span>Plenary Projector</span></button>

            `
    }
          <button type="button" class="btn-fullwidth-toggle no-print ${isFullWidth ? 'active' : ''}" onclick="window.toggleLessonFullWidth()" title="${isFullWidth ? 'Restore outer sidebar and top bar' : 'Hide outer sidebar and top bar for full-width classroom view'}">
            <i class="fa-solid ${isFullWidth ? 'fa-compress' : 'fa-expand'}"></i>
            <span class="fw-btn-label">${isFullWidth ? 'Restore Sidebar' : 'Full-Width View'}</span>
          </button>
        </div>
      </div>
    `;
  let bannerPosition =
    lesson.banner_position ||
    (typeof lesson.banner === 'object' && lesson.banner ? lesson.banner.position : null);

  if (!bannerPosition) bannerPosition = isKs2 ? 'center 20%' : 'center center';
  const isFamilyHero =
    lesson.id &&
    (lesson.id.startsWith('hero_') ||
      lesson.title?.includes('Pupil Family Hero') ||
      lesson.title?.includes('Local Hero'));
  const heroExtraClass = isFamilyHero ? ' family-archive-hero' : '';

  const existingFloatingBtn = document.getElementById('floating-stop-navigator-btn');
  if (existingFloatingBtn) existingFloatingBtn.remove();

  const resolvedHeroImage = getAssetUrl(heroImage);

  // Contextual Gallery Launcher Button on Hero Banner (Only shown for authentic historical paintings / artworks)
  let bannerGalleryBtn = '';
  if (resolvedHeroImage) {
    const bannerCaption =
      typeof lesson.banner === 'object' && lesson.banner ? lesson.banner.caption || '' : '';
    const isBannerArtwork = isPaintingSource(
      typeof lesson.banner === 'object' && lesson.banner
        ? lesson.banner
        : { title: lesson.title, caption: bannerCaption, image: resolvedHeroImage },
      lesson.title,
    );

    if (isBannerArtwork) {
      bannerGalleryBtn = `
        <button class="btn-banner-gallery" data-action="open-masterpiece" data-banner-lesson="${lesson.id}" style="position: absolute; bottom: 16px; right: 4rem; z-index: 10;" title="Launch Art Spotlight">
          <i class="fa-solid fa-palette" style="color: #fbbf24; font-size: 0.9rem;"></i>
          <span>Art Spotlight</span>
        </button>
      `;
    }
  }

  // Full-Bleed Hero Image (Calibrated Height: 210px for KS2, 164px for Secondary/GCSE panoramic banners)
  const heroBannerHeight = isKs2 ? '210px' : '164px';
  const cleanLessonHeading = (lesson.title || '')
    .replace(/^(?:Enquiry|Lesson)\s*\d+:\s*/i, '')
    .trim();

  const isHeadingAQuestion =
    /\?\s*$/.test(cleanLessonHeading) ||
    /^(?:How|Why|Who|What|Where|When|Was|Were|To what extent)\b/i.test(cleanLessonHeading);

  const enquiryText =
    lesson.enquiryQuestion || lesson.enquiry_question || lesson.inquiry_question || lesson.enquiry || '';

  let enquirySubtitle = '';
  if (isKs2 && enquiryText) {
    enquirySubtitle = `<p class="lesson-hero-enquiry-sub" style="font-family: 'Lora', Georgia, serif; font-style: italic; color: #fef08a; font-size: 0.96rem; margin: 0.35rem 0 0 0; line-height: 1.35; text-shadow: 0 1px 4px rgba(0,0,0,0.85);"><i class="fa-solid fa-circle-question" style="color: #fde047; font-size: 0.82rem; margin-right: 6px;"></i>Key Enquiry: &ldquo;${enquiryText}&rdquo;</p>`;
  } else if (isHeadingAQuestion && lesson.subtitle) {
    enquirySubtitle = `<p class="lesson-hero-subtitle" style="font-family: 'Inter', sans-serif; color: #f1f5f9; font-size: 0.9rem; font-weight: 500; margin: 0.35rem 0 0 0; line-height: 1.35; text-shadow: 0 1px 4px rgba(0,0,0,0.8);"><i class="fa-solid fa-compass" style="color: #60a5fa; font-size: 0.8rem; margin-right: 6px;"></i>${lesson.subtitle}</p>`;
  } else if (enquiryText && enquiryText !== cleanLessonHeading && !isHeadingAQuestion) {
    enquirySubtitle = `<p class="lesson-hero-enquiry-sub" style="font-family: 'Lora', Georgia, serif; font-style: italic; color: #fef08a; font-size: 0.95rem; margin: 0.35rem 0 0 0; line-height: 1.35; text-shadow: 0 1px 3px rgba(0,0,0,0.8);"><i class="fa-solid fa-circle-question" style="color: #fde047; font-size: 0.82rem; margin-right: 6px;"></i>Key Enquiry: &ldquo;${enquiryText}&rdquo;</p>`;
  } else if (lesson.subtitle) {
    enquirySubtitle = `<p class="lesson-hero-subtitle" style="font-family: 'Inter', sans-serif; color: #e2e8f0; font-size: 0.88rem; margin: 0.3rem 0 0 0; line-height: 1.3; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">${lesson.subtitle}</p>`;
  }

  const unitBadgeTitle = activeUnit?.title
    ? activeUnit.title.replace(/\s*\([\d–\-]+\)/, '').trim()
    : 'Curriculum Unit';
  const heroLessonLabel = isLessonZero
    ? 'Introductory Context Lesson'
    : hasLessonZero
      ? isGCSE
        ? 'Lesson ' + currentIndex
        : 'Enquiry ' + currentIndex
      : isGCSE
        ? 'Lesson ' + (currentIndex + 1)
        : 'Enquiry ' + (currentIndex + 1);
  const heroEyebrow = isTrip
    ? lessonPrefix
    : `${unitBadgeTitle} &bull; ${heroLessonLabel}`;

  let specPillHtml = '';
  if (lesson.specification_anchor) {
    const specPaperBadge =
      unitId === 'edexcel_medicine'
        ? 'Edexcel Paper 1'
        : unitId === 'cme_new'
          ? 'Edexcel Paper 2'
          : unitId === 'eee'
            ? 'Edexcel Paper 2'
            : unitId === 'weimar_nazi_germany'
                ? 'Edexcel Paper 3'
                : unitId === 'usa'
                  ? 'Edexcel Paper 3'
                  : isKs3
                    ? 'Key Stage 3'
                    : isKs2
                      ? 'Key Stage 2'
                      : 'Edexcel GCSE';

    const safeSpec = encodeURIComponent(lesson.specification_anchor);
    const safeTitle = encodeURIComponent(cleanLessonHeading);

    specPillHtml = `
      <button type="button"
        class="spec-anchor-btn"
        onclick="window.showLessonSpecModal('${safeSpec}', '${specPaperBadge}', '${safeTitle}')"
        style="background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(148, 163, 184, 0.45); color: #93c5fd; padding: 4px 12px; border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 0.74rem; font-weight: 700; letter-spacing: 0.4px; display: inline-flex; align-items: center; gap: 6px; backdrop-filter: blur(6px); cursor: pointer; transition: all 0.2s;"
        onmouseover="this.style.background='rgba(30, 41, 59, 0.9)'; this.style.borderColor='#60a5fa'; this.style.color='#bfdbfe';"
        onmouseout="this.style.background='rgba(15, 23, 42, 0.75)'; this.style.borderColor='rgba(148, 163, 184, 0.45)'; this.style.color='#93c5fd';"
        title="Click to view official syllabus specification anchor">
        <i class="fa-solid fa-bookmark" style="color: #60a5fa; font-size: 0.75rem;"></i>
        <span>${specPaperBadge} Spec Anchor</span>
        <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.65rem; opacity: 0.8; margin-left: 2px;"></i>
      </button>
    `;
  }

  const heroContainerStyle = isKs2
    ? `position: relative; width: 100%; margin-left: 0; margin-top: 0.25rem; height: ${heroBannerHeight}; background: url('${resolvedHeroImage}') ${bannerPosition}/cover no-repeat; margin-bottom: 0.6rem; border-radius: 12px; overflow: hidden; border: 1px solid rgba(15,23,42,0.12); box-shadow: 0 6px 18px rgba(15,23,42,0.12);`
    : `position: relative; width: 100%; margin-left: 0; margin-right: 0; margin-top: 0.25rem; height: ${heroBannerHeight}; background: #0f172a url('${resolvedHeroImage}') ${bannerPosition}/cover no-repeat; margin-bottom: 0.5rem; border-radius: 10px; overflow: hidden; border: 1px solid rgba(15,23,42,0.14); box-shadow: 0 4px 16px rgba(0,0,0,0.08);`;
  const heroOverlayStyle = isKs2
    ? `position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(15,23,42,0.16) 0%, rgba(15,23,42,0.54) 55%, rgba(15,23,42,0.88) 100%);`
    : `position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(15,23,42,0.26) 0%, rgba(15,23,42,0.66) 55%, rgba(15,23,42,0.92) 100%);`;
  const heroContentPadding = isKs2 ? '0.9rem 1.75rem' : '0.72rem 1.5rem';

  html += `
      <div class="lesson-hero${heroExtraClass}" style="${heroContainerStyle}">
        <div style="${heroOverlayStyle}"></div>
        <div class="lesson-hero-content" style="position: absolute; bottom: 0; left: 0; width: 100%; padding: ${heroContentPadding}; box-sizing: border-box;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 1px;">
            <span style="color: #e2e8f0; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: 0.76rem; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">${heroEyebrow}</span>
            ${specPillHtml}
          </div>
          <h2 style="font-family: 'Playfair Display', serif; color: white; font-size: 1.55rem; margin: 0.15rem 0 0 0; line-height: 1.18; text-shadow: 0 2px 8px rgba(0,0,0,0.75);">${cleanLessonHeading}</h2>
          ${enquirySubtitle}
        </div>
        ${bannerGalleryBtn}
      </div>
    `;

  html += `
      <div id="progress-container" style="background: rgba(226,232,240,0.5); height: 4px; width: 100%; margin-bottom: 8px; border-radius: 2px; overflow: hidden; backdrop-filter: blur(5px);">
        <div id="progress-bar" style="background: #10b981; height: 100%; width: 0%; transition: width 0.3s;"></div>
      </div>
    `;

  // -----------------------------------------------------
  // TEACHER-MODE-ONLY GUIDANCE & 2-LESSON DELIVERY DRAWER
  // -----------------------------------------------------
  if (lesson.teacher_notes && (lesson.teacher_notes.primer || lesson.teacher_notes.delivery_plan)) {
    const tn = lesson.teacher_notes;
    const dp = tn.delivery_plan;
    const renderDpLessonCard = (lObj, fallbackLabel) => {
      if (!lObj || !Array.isArray(lObj.phases) || lObj.phases.length === 0) return '';
      const heading = lObj.title || (lObj.focus ? `${fallbackLabel}: ${lObj.focus}` : fallbackLabel);
      const rows = lObj.phases
        .map((p) => {
          let tBadge = p.time || '';
          let pLabel = p.label || p.phase || '';
          const pInstr = p.instruction || p.activity || '';
          if (!tBadge && pLabel) {
            const tm = pLabel.match(/\(([^)]*(?:min|m)[^)]*)\)/i);
            if (tm) {
              tBadge = tm[1].replace(/\s*mins?\b/i, 'm');
              pLabel = pLabel.replace(/\s*\([^)]*\)\s*/, '').replace(/^Phase\s+\d+:\s*/i, '').trim();
            }
          }
          return `
            <div style="display: flex; gap: 8px; font-size: 0.81rem; line-height: 1.45; margin-bottom: 5px;">
              ${tBadge ? `<span style="background: #e0f2fe; color: #0369a1; font-weight: 800; padding: 1px 6px; border-radius: 3px; font-family: monospace; white-space: nowrap; height: fit-content;">${tBadge}</span>` : ''}
              <div style="color: #334155;">${pLabel ? `<strong style="color: #0f172a;">${pLabel}:</strong> ` : ''}${pInstr}</div>
            </div>
          `;
        })
        .join('');
      return `
        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; flex: 1 1 300px; min-width: 260px;">
          <div style="font-weight: 800; color: #0284c7; font-size: 0.83rem; margin-bottom: 7px;">
            <i class="fa-regular fa-clock"></i> ${heading}
          </div>
          ${rows}
        </div>
      `;
    };

    const hasDeliveryCards = Boolean(dp && (dp.lesson_1 || dp.lesson_2));
    html += `
      <details class="teacher-only-guidance-drawer no-print" style="margin: 0 0 10px 0; border: 1.5px solid #f59e0b; border-radius: 8px; background: #fffbeb; overflow: hidden; box-shadow: 0 2px 6px rgba(217, 119, 6, 0.08);">
        <summary style="padding: 7px 14px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 10px; list-style: none; user-select: none; background: linear-gradient(90deg, #fef3c7 0%, #fffbeb 100%);">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span style="background: #1b365d; color: #facc15; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 2px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 5px;">
              <i class="fa-solid fa-user-tie"></i> Teacher Mode
            </span>
            <span style="font-size: 0.86rem; font-weight: 800; color: #78350f;">
              Lesson Briefing${hasDeliveryCards ? ' &amp; 2-Lesson Delivery Plan' : ''}
            </span>
            ${dp?.format ? `<span style="font-size: 0.75rem; font-weight: 600; color: #92400e;">&bull; ${dp.format}</span>` : ''}
          </div>
          <span style="font-size: 0.76rem; font-weight: 700; color: #92400e; white-space: nowrap;">
            <span class="tgd-lbl-closed">Open Plan &#9662;</span>
            <span class="tgd-lbl-open">Hide Plan &#9652;</span>
          </span>
        </summary>
        <div style="padding: 12px 16px; background: #f8fafc; border-top: 1px solid #fde68a;">
          ${
            tn.primer
              ? `
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-left: 4px solid #1b365d; border-radius: 5px; padding: 9px 13px; margin-bottom: ${hasDeliveryCards ? '10px' : '0'}; font-size: 0.85rem; color: #1e293b; line-height: 1.52;">
              <strong style="color: #1b365d; text-transform: uppercase; font-size: 0.73rem; letter-spacing: 0.45px; display: block; margin-bottom: 3px;">Pedagogical Primer:</strong>
              ${tn.primer}
            </div>
          `
              : ''
          }
          ${
            hasDeliveryCards
              ? `
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              ${dp.lesson_1 ? renderDpLessonCard(dp.lesson_1, 'Lesson 1') : ''}
              ${dp.lesson_2 ? renderDpLessonCard(dp.lesson_2, 'Lesson 2') : ''}
            </div>
          `
              : ''
          }
        </div>
      </details>
    `;
  }

  const activeUnitData =
    (appStore && appStore.state && appStore.state.activeUnitData) ||
    window.currentUnitData ||
    {};
  const vocabDict = buildComprehensiveVocabDict(lesson, activeUnitData);

  const highlightGlossary = (text, maxPerBlock = 3) => {
    return highlightGlossaryInProse(text, vocabDict, maxPerBlock);
  };

  const narrativeAnnotator = createLessonNarrativeAnnotator({
    lesson,
    unitData: activeUnitData,
    unitId: window.currentUnitId || unitId || activeUnitData?.id || 'unit',
    vocabDict,
    formatBoldFn: formatBold,
  });

  // Note: Teacher Guidance, Pedagogical Primers, and Hinge Questions
  // are routed to the Departmental Portal (?view=department-portal) for staff lesson planning.

  if (
    lesson.sources &&
    lesson.sources.length > 0 &&
    unitId !== 'cme_new' &&
    !hasInlineNarrativeSources
  ) {
    htmlSources1 += `<div class="sources-grid" style="margin-top: 20px;">`;
    lesson.sources.forEach((source, sIdx) => {
      const sLetterMatch = (source.title || '').match(/(?:Source|Map|Diagram)\s+([A-Z0-9]+)/i);
      const sLetter = sLetterMatch ? sLetterMatch[1].toUpperCase() : '';
      const isInteractiveSourceUnit =
        isGCSEInteractiveUnit(window.currentUnitId || unitId) ||
        window.currentUnitId === 'monarchy_religion_power' ||
        unitId === 'monarchy_religion_power' ||
        window.currentUnitId === 'first_british_empire' ||
        unitId === 'first_british_empire' ||
        window.currentUnitId === 'medieval_england' ||
        unitId === 'medieval_england' ||
        window.currentUnitId === 'industrialisation_and_empire' ||
        unitId === 'industrialisation_and_empire' ||
        window.currentUnitId === 'great_war' ||
        unitId === 'great_war' ||
        window.currentUnitId === 'great_war_part2' ||
        unitId === 'great_war_part2';
      const cardIdAttr =
        sLetter && isInteractiveSourceUnit
          ? `id="source-card-${sLetter}" data-source-letter="${sLetter}"`
          : '';
      const qClassAttr =
        sLetter && isInteractiveSourceUnit ? 'source-inquiry-box source-inquiry-interactive' : '';
      const qDataAttr =
        sLetter && isInteractiveSourceUnit
          ? `data-target-source="${sLetter}" title="Hover or click to highlight Source ${sLetter}"`
          : '';

      if (
        isGCSEInteractiveUnit(window.currentUnitId || unitId) ||
        unitId === 'monarchy_religion_power' ||
        window.currentUnitId === 'monarchy_religion_power' ||
        unitId === 'first_british_empire' ||
        window.currentUnitId === 'first_british_empire' ||
        unitId === 'medieval_england' ||
        window.currentUnitId === 'medieval_england' ||
        unitId === 'industrialisation_and_empire' ||
        window.currentUnitId === 'industrialisation_and_empire' ||
        unitId === 'great_war' ||
        window.currentUnitId === 'great_war' ||
        unitId === 'great_war_part2' ||
        window.currentUnitId === 'great_war_part2'
      ) {
        const displayTitle = source.title
          ? source.title.replace(/^(?:Source|Map|Diagram)\s+[A-Z0-9]+[:\s-]*/i, '').trim()
          : source.caption || 'Archival Evidence';
        const rawSrc = source.image || source.src || source.source;
        const sourceImgUrl = rawSrc ? getAssetUrl(rawSrc) : '';
        const sourceText = (source.text || source.content || '').trim();
        let contextText = source.source_context || source.context || '';
        let hingeText = source.hinge_question || source.question || '';
        if (
          /\*{0,2}(?:Hinge Question|Discussion Prompt|Discussion Question|Question):\*{0,2}/i.test(
            contextText,
          )
        ) {
          const parts = contextText.split(
            /\*{0,2}(?:Hinge Question|Discussion Prompt|Discussion Question|Question):\*{0,2}/i,
          );
          contextText = parts[0].trim();
          if (!hingeText && parts[1]) {
            hingeText = parts[1].trim();
          }
        }
        const citationText = source.citation || source.provenance || '';

        const sourceEnquiryHtml =
          source.question || source.enquiry_question || source.how_useful_question || source.prompt || (source.model_answer && source.hinge_question ? source.hinge_question : '')
            ? (() => {
              const qPrompt =
                source.question || source.enquiry_question || source.how_useful_question || source.prompt || source.hinge_question;
              return renderSourceEnquiryBox({
                srcObj: source,
                promptText: qPrompt,
                contextVal: contextText,
              });
            })()
            : '';

        const isSourceArtwork = isPaintingSource(source, displayTitle);
        const sourceSpotlightBtn = isSourceArtwork
          ? `
                    <button class="btn-source-spotlight-launch btn-art-spotlight-launch" data-action="open-masterpiece" data-lesson-id="${lesson.id}" data-source-index="${sIdx}" title="Launch Art Spotlight">
                      <i class="fa-solid fa-palette" style="color: #fbbf24;"></i>
                      <span>Art Spotlight</span>
                    </button>
          `
          : '';

        const standaloneAudioHtml = sourceText
          ? renderAudioPlaybackBar('Read Aloud Primary Source Excerpt', 'source-audio-bar')
          : '';

        const standaloneStudioAttr = source.studio_audio
          ? ` data-studio-source-audio="${String(source.studio_audio).replace(/"/g, '&quot;')}" data-studio-voice-label="${String(source.studio_voice_label || 'Living Archive').replace(/"/g, '&quot;')}"`
          : '';
        const standaloneVoicePill =
          source.studio_audio && source.studio_voice_label
            ? `<span class="living-archive-voice-pill" style="font-size: 0.67rem; font-weight: 700; color: #0f766e; background: #f0fdfa; border: 1px solid #99f6e4; padding: 2px 7px; border-radius: 999px; white-space: nowrap;">${String(source.studio_voice_label).replace(/</g, '&lt;')}</span>`
            : '';

        htmlSources1 += `
          <details class="cme-source-drawer eee-source-drawer archival-drawer gcse-source-container archival-source-box" ${cardIdAttr}${standaloneStudioAttr} style="margin: 6px 0; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02); transition: all 0.25s ease;">
            <summary style="padding: 4px 10px; min-height: 28px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: #f8fafc; color: #0f172a; list-style: none; user-select: none; transition: background 0.15s ease;">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-width: 0; flex: 1; margin-right: 8px;">
                <span class="archival-meta-tag" style="background: #1e40af; color: #ffffff; padding: 2px 6px; border-radius: 3px; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.4px; line-height: 1.2; white-space: nowrap; flex-shrink: 0;">${sLetter ? `SOURCE ${sLetter}` : 'ARCHIVAL EVIDENCE'}</span>
                <span class="archival-drawer-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 0.84rem; color: #1e293b; font-weight: 700; line-height: 1.35; white-space: normal; overflow-wrap: break-word;">${displayTitle}</span>
                ${standaloneVoicePill}
              </div>
              <div style="display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;">
                ${standaloneAudioHtml}
                <span class="drawer-toggle-indicator" style="font-size: 0.68rem; color: #64748b; display: inline-flex; align-items: center; gap: 4px; font-weight: 600; flex-shrink: 0; white-space: nowrap;">
                  <span class="drawer-state-expand">View Source</span><span class="drawer-state-collapse">Close</span> <span class="drawer-caret">&#9660;</span>
                </span>
              </div>
            </summary>
            <div class="eee-source-content" style="padding: 10px 14px; background: #ffffff; border-top: 1px solid #e2e8f0;">
              ${sourceImgUrl
            ? (() => {
              const disc = getArchivalSourceDiscussionComponents(
                hingeText,
                source,
                isKs2,
                '10px',
              );
              return `
                <div class="archival-source-split-layout">
                  <div class="archival-source-media-col${isKs2 ? ' ks2-source-media-col' : ''}">
                    <div style="position: relative; width: 100%; display: flex; justify-content: center;">
                      <img src="${sourceImgUrl}" alt="${displayTitle}" data-action="open-modal" data-src="${sourceImgUrl}" style="cursor: zoom-in; width: auto; max-width: 100%; max-height: ${isKs2 ? '380px' : '350px'}; object-fit: contain; display: block; border-radius: 6px;">
                    </div>
                    ${sourceSpotlightBtn}
                    ${!isKs2 && citationText
                  ? `<div class="archival-media-provenance" style="margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.14); padding-top: 8px; font-size: 0.74rem; line-height: 1.35; color: #94a3b8; text-align: left;">
                            <strong style="color: #cbd5e1;">Provenance:</strong> ${citationText}
                          </div>`
                  : ''
                }
                  </div>
                  <div class="archival-source-details-col" style="display: flex; flex-direction: column; justify-content: flex-start; gap: 10px;">
                    <div>
                      ${(() => {
                        const cap = source.caption || (source.title ? source.title.replace(/^Source\s+[A-Z0-9]+[:\s-]*/i, '').trim() : '') || source.attribution || '';
                        return cap ? `<div style="font-size: 0.95rem; color: #475569; margin-bottom: 12px; font-style: italic; line-height: 1.5;">${cap}</div>` : '';
                      })()}
                      ${sourceText
                  ? renderArchivalSourceBody(sourceText, source, { maxHeight: '250px', fontSize: '0.95rem', lineHeight: '1.6', padding: '10px 14px', marginBottom: '12px', accentColor: '#1e3a8a' })
                  : ''
                }
                      ${contextText
                  ? `
                        <div style="background: #f8fafc; border-left: 4px solid #64748b; padding: 12px 16px; border-radius: 0 4px 4px 0; margin-bottom: 12px; color: #334155; font-size: 0.98rem; line-height: 1.6;">
                          <strong>${isKs2 ? 'What this tells us:' : 'Historical Context:'}</strong> ${typeof window !== 'undefined' && window.formatBold ? window.formatBold(contextText) : contextText}
                        </div>
                      `
                  : ''
                }
                      ${disc.promptHtml}
                    </div>
                    ${sourceEnquiryHtml
                  ? `<div class="archival-source-inline-enquiry" style="width: 100%; margin-top: 6px;">${sourceEnquiryHtml}</div>`
                  : ''
                }
                  </div>
                </div>
                ${disc.panelHtml}
              `;
            })()
            : `
                <div>
                  ${sourceText
              ? renderArchivalSourceBody(sourceText, source, { maxHeight: '350px', marginBottom: '4px', accentColor: '#1e3a8a' })
              : ''
            }
                  ${!isKs2 && citationText && citationText.trim().toLowerCase() !== displayTitle.trim().toLowerCase()
              ? `<div class="archival-citation-footer" style="font-size: 0.76rem; color: #64748b; font-style: italic; text-align: right; margin-top: 3px; margin-bottom: 6px; padding-top: 0; line-height: 1.35;">
                          &mdash; <span style="font-style: normal; font-weight: 600; color: #475569;">Provenance:</span> ${citationText}
                        </div>`
              : ''
            }
                  ${!sourceEnquiryHtml
              ? renderArchivalSourceDiscussionBox(hingeText, source, isKs2, '8px')
              : `<div class="archival-source-fullwidth-enquiry" style="width: 100%; margin-top: 6px;">${sourceEnquiryHtml}</div>`
            }
                </div>
              `
          }
            </div>
          </details>
        `;
        return;
      }

      if (unitId === 'edexcel_medicine') {
        const sLetterMatch = (source.title || '').match(/(?:Source|Map|Diagram)\s+([A-Z])/i);
        const sLetter = sLetterMatch ? sLetterMatch[1].toUpperCase() : '';
        const isMap = /map/i.test(source.title);
        const isDiagram = /diagram/i.test(source.title);
        const metaTag = isMap
          ? 'Cartographic Record'
          : isDiagram
            ? 'Historical Diagram'
            : 'Primary Source';
        const displayTitle = source.title
          ? source.title.includes(':')
            ? source.title.split(':').slice(1).join(':').trim()
            : source.title
          : 'Historical Document';
        const prefix = source.title
          ? source.title.split(':')[0].trim()
          : sLetter
            ? `Source ${sLetter}`
            : 'Document';

        htmlSources1 += `
          <div class="archival-source-box accent-amber" style="background: #fffdfa; border: 1px solid #cbd5e1; border-top: 3.5px solid ${isMap ? '#059669' : '#1e3a8a'}; border-radius: 8px; padding: 22px 26px; margin-bottom: 24px; text-align: left; box-shadow: 0 3px 10px rgba(0,0,0,0.04);">
            <div class="archival-source-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; padding-bottom: 12px; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0;">
              <div>
                <h4 class="archival-source-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.35;">
                  ${source.title || displayTitle}
                </h4>
              </div>
            </div>
            ${source.image || source.src || source.source
            ? `
              <div class="archival-source-split-layout">
                <div class="archival-source-media-col${isKs2 ? ' ks2-source-media-col' : ''}">
                  <div style="position: relative; width: 100%; display: flex; justify-content: center;">
                    <img src="${getAssetUrl(source.image || source.src || source.source)}" alt="${source.title || 'Source Image'}" data-action="open-modal" data-src="${getAssetUrl(source.image || source.src || source.source)}" style="cursor: zoom-in; width: auto; max-width: 100%; max-height: ${isKs2 ? '380px' : '280px'}; object-fit: contain; display: block; border-radius: 6px;">
                  </div>
                </div>
                <div class="archival-source-details-col">
                  <div>
                    ${source.text
              ? renderArchivalSourceBody(source.text, source, { maxHeight: '280px', fontSize: '1.02rem', lineHeight: '1.65', padding: '12px 16px', marginBottom: '14px', accentColor: '#b45309' })
              : ''
            }
                    ${source.caption
              ? `
                      <div style="font-size: 0.95rem; color: #334155; margin-bottom: 12px; line-height: 1.6; font-style: italic; background: #f8fafc; padding: 12px 16px; border-left: 3px solid #64748b; border-radius: 0 4px 4px 0;">
                        ${source.caption}
                      </div>
                    `
              : ''
            }
                    ${source.context
              ? `
                      <div style="font-size: 0.95rem; color: #1e293b; margin-bottom: 12px; line-height: 1.65; background: rgba(2, 132, 199, 0.06); padding: 14px 18px; border-left: 4px solid #0284c7; border-radius: 0 6px 6px 0;">
                        <strong style="color: #0369a1; display: block; margin-bottom: 5px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;"><span class="archival-meta-tag" style="color: #0284c7; margin-right: 6px;">HISTORICAL CONTEXT</span></strong>
                        ${typeof window !== 'undefined' && window.formatBold ? window.formatBold(source.context) : source.context}
                      </div>
                    `
              : ''
            }
                  </div>
                  ${source.citation || source.provenance
              ? `
                    <div class="archival-citation-footer" style="font-size: 0.8rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: auto;">
                      <strong>Provenance:</strong> ${source.citation || source.provenance}
                    </div>
                  `
              : ''
            }
                </div>
              </div>
            `
            : `
              ${source.text
              ? renderArchivalSourceBody(source.text, source, { maxHeight: '350px', fontSize: '1.05rem', lineHeight: '1.7', padding: '16px 20px', marginBottom: '14px', accentColor: '#b45309' })
              : ''
            }
              ${source.caption
              ? `
                <div style="font-size: 0.95rem; color: #334155; margin: 12px 0; line-height: 1.6; font-style: italic; background: #f8fafc; padding: 12px 16px; border-left: 3px solid #64748b; border-radius: 0 4px 4px 0;">
                  ${source.caption}
                </div>
              `
              : ''
            }
              ${source.context
              ? `
                <div style="font-size: 0.95rem; color: #1e293b; margin: 14px 0; line-height: 1.65; background: rgba(2, 132, 199, 0.06); padding: 14px 18px; border-left: 4px solid #0284c7; border-radius: 0 6px 6px 0;">
                  <strong style="color: #0369a1; display: block; margin-bottom: 5px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;"><span class="archival-meta-tag" style="color: #0284c7; margin-right: 6px;">HISTORICAL CONTEXT</span></strong>
                  ${typeof window !== 'undefined' && window.formatBold ? window.formatBold(source.context) : source.context}
                </div>
              `
              : ''
            }
              ${source.citation || source.provenance
              ? `
                <div class="archival-citation-footer" style="font-size: 0.8rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 12px;">
                  <strong>Provenance:</strong> ${source.citation || source.provenance}
                </div>
              `
              : ''
            }
            `
          }
            ${source.question || source.hinge_question
            ? `
              <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-left: 5px solid #1e40af; padding: 14px 18px; border-radius: 4px; text-align: left; margin-top: 14px; box-shadow: 0 2px 5px rgba(30,58,138,0.06);">
                <p style="margin-bottom: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.02rem; color: #1e3a8a; line-height: 1.5; font-weight: 600;">
                  <strong>${source.qNum ? `Q${source.qNum}. ` : ''}${formatQuestion(cleanQuestionText(source.question || source.hinge_question), !source.qNum)}</strong>
                </p>
              </div>
            `
            : ''
          }
          </div>
        `;
        return;
      }

      htmlSources1 += `
            <div class="source-card" ${cardIdAttr} style="background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px; text-align: center; transition: all 0.3s ease;">
              ${source.title ? `<h4 style="color: var(--primary); margin-top: 0; text-align: left;">${source.title}</h4>` : ''}
              
              ${source.image || source.src || source.source
          ? `
                <div style="display: inline-flex; flex-direction: column; position: relative; max-width: 100%; text-align: left; margin: 15px 0;">
                  <div style="position: relative;">
                    <img src="${getAssetUrl(source.image || source.src || source.source)}" alt="Source Image" style="max-width: 100%; max-height: 400px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #cbd5e1; cursor: zoom-in; display: block;" data-action="open-modal" data-src="${getAssetUrl(source.image || source.src || source.source)}">
                  </div>
                  ${source.caption
            ? `
                    <div class="source-info-panel" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; font-size: 0.95rem; color: #334155; margin-top: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative;">
                      <strong style="color: #0f172a; margin-bottom: 5px; display: block;">
                        <i class="fa-solid fa-circle-info" style="color: #10b981; margin-right: 5px;"></i>
                        About this source
                      </strong>
                      ${source.caption}
                    </div>
                  `
            : ''
          }
                </div>
              `
          : source.caption
            ? `
                <div style="text-align: left; margin-top: 15px; font-size: 1.05rem; color: #334155; line-height: 1.5; padding: 15px; background: #f8fafc; border-left: 4px solid #10b981; border-radius: 4px;">
                  ${source.caption}
                </div>
              `
            : ''
        }
              
              ${source.content ? `<div style="text-align: left; margin-top: 10px; font-style: italic; color: #334155; font-size: 1.05rem; line-height: 1.5;">${source.content}</div>` : ''}
              ${source.question
          ? `
                <div class="${qClassAttr}" ${qDataAttr} style="background: #ebf8ff; border-left: 4px solid #3182ce; padding: 15px; border-radius: 0 4px 4px 0; text-align: left; margin-top: 15px;">
                  <p style="margin-bottom: 0; font-size: 1.1rem; color: #1e3a8a;"><strong>${source.qNum ? `Q${source.qNum}. ` : ''}${formatQuestion(source.question, !source.qNum)}</strong></p>
                </div>
              `
          : ''
        }
            </div>
          `;
    });
    htmlSources1 += `</div>`;
  }

  // ==========================================
  // TAB 1: PREPARATION
  // ==========================================
  htmlSources1 += ``;

  if (lesson.primary_source) {
    let rawSrcs = lesson.primary_source.src || lesson.primary_source.image;
    let srcs = rawSrcs ? (Array.isArray(rawSrcs) ? rawSrcs.filter(Boolean) : [rawSrcs]) : [];
    if (unitId === 'great_war') {
      const pTitle = lesson.primary_source.title || 'Primary Archival Source';
      const displayTitle = pTitle.includes(':')
        ? pTitle.split(':').slice(1).join(':').trim()
        : pTitle;
      const prefix = pTitle.includes(':') ? pTitle.split(':')[0].trim() : 'Source A';

      htmlPrimary += `
        <div class="phase-card">
          <div class="archival-source-box accent-amber" style="background: #fffdfa; border: 1px solid #cbd5e1; border-top: 3.5px solid #1e3a8a; border-radius: 8px; padding: 22px 26px; margin-bottom: 24px; text-align: left; box-shadow: 0 3px 10px rgba(0,0,0,0.04);">
            <div class="archival-source-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; padding-bottom: 12px; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0;">
              <div>
                <span class="archival-meta-tag" style="display: block; margin-bottom: 4px; color: #1e3a8a; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase;">
                  Primary Archival Evidence · ${prefix}
                </span>
                <h4 class="archival-source-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.2rem; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.35;">
                  ${displayTitle}
                </h4>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="archival-shelfmark-stamp">${lesson.primary_source.shelfmark || 'IWM ARCHIVES / REF-GW-1914'}</span>
              </div>
            </div>
            ${srcs.length > 0
          ? `
              <div class="archival-source-split-layout">
                <div class="archival-source-media-col">
                  ${srcs.map((src) => `<img src="${getAssetUrl(src)}" alt="${lesson.primary_source.title}" data-action="open-modal" data-src="${getAssetUrl(src)}" style="cursor: zoom-in;">`).join('')}
                </div>
                <div class="archival-source-details-col">
                  <div>
                    ${lesson.primary_source.caption
            ? `
                      <div style="font-size: 0.95rem; color: #334155; margin-bottom: 12px; line-height: 1.6; font-style: italic; background: #f8fafc; padding: 12px 16px; border-left: 3px solid #64748b; border-radius: 0 4px 4px 0;">
                        ${lesson.primary_source.caption}
                      </div>
                    `
            : ''
          }
                    ${lesson.primary_source.context
            ? `
                      <div style="font-size: 0.95rem; color: #1e293b; margin-bottom: 12px; line-height: 1.65; background: rgba(2, 132, 199, 0.06); padding: 14px 18px; border-left: 4px solid #0284c7; border-radius: 0 6px 6px 0;">
                        <strong style="color: #0369a1; display: block; margin-bottom: 5px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;"><span class="archival-meta-tag" style="color: #0284c7; margin-right: 6px;">HISTORICAL CONTEXT</span></strong>
                        ${typeof window !== 'undefined' && window.formatBold ? window.formatBold(lesson.primary_source.context) : lesson.primary_source.context}
                      </div>
                    `
            : ''
          }
                  </div>
                  ${lesson.primary_source.citation || lesson.primary_source.provenance
            ? `
                    <div class="archival-citation-footer" style="font-size: 0.8rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: auto;">
                      <strong>Provenance:</strong> ${lesson.primary_source.citation || lesson.primary_source.provenance}
                    </div>
                  `
            : ''
          }
                </div>
              </div>
            `
          : ''
        }
            ${lesson.primary_source.quote ? `<blockquote style="border-left: 4px solid #3b82f6; background: #f8fafc; padding: 14px 18px; margin: 15px 0; border-radius: 0 8px 8px 0; font-style: italic; color: #1e293b; text-align: left; font-size: 1rem; line-height: 1.6;">&ldquo;${lesson.primary_source.quote}&rdquo;</blockquote>` : ''}
            ${lesson.primary_source.citation || lesson.primary_source.provenance
          ? `
              <div class="archival-citation-footer" style="font-size: 0.8rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 14px;">
                <strong>Provenance:</strong> ${lesson.primary_source.citation || lesson.primary_source.provenance}
              </div>
            `
          : ''
        }
            ${lesson.primary_source.question
          ? `
              <div style="background: #eff6ff; border-left: 4px solid #1e40af; padding: 16px 20px; border-radius: 0 6px 6px 0; text-align: left; margin-top: 20px; box-shadow: 0 2px 5px rgba(30,58,138,0.05);">
                <p style="margin-bottom: 0; font-size: 1.05rem; color: #1e3a8a; line-height: 1.5;"><strong>${lesson.primary_source.qNum ? `Q${lesson.primary_source.qNum}. ` : ''}${formatQuestion(lesson.primary_source.question, !lesson.primary_source.qNum)}</strong></p>
              </div>
            `
          : ''
        }
          </div>
        </div>
      `;
    } else {
      htmlPrimary += `
        <div class="phase-card">
          <div class="source-card" style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px; text-align: center;">
            ${srcs.length > 0
          ? `
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-bottom: 15px;">
              ${srcs.map((src) => `<img src="${getAssetUrl(src)}" alt="Source" style="max-height: 500px; max-width: ${srcs.length > 1 ? '45%' : '100%'}; object-fit: contain; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">`).join('')}
            </div>
            `
          : ''
        }
            <div style="font-weight: bold; margin-bottom: 10px; font-size: 1.1rem; color: var(--primary);">${lesson.primary_source.title}</div>
            ${lesson.primary_source.context ? `<div style="color: #64748b; margin-bottom: 12px; font-size: 0.9rem; text-align: left; font-style: italic;"><strong>Context:</strong> ${lesson.primary_source.context}</div>` : ''}
            ${lesson.primary_source.quote ? `<blockquote style="border-left: 4px solid #3b82f6; background: #f8fafc; padding: 14px 18px; margin: 15px 0; border-radius: 0 8px 8px 0; font-style: italic; color: #1e293b; text-align: left; font-size: 1rem; line-height: 1.6;">&ldquo;${lesson.primary_source.quote}&rdquo;</blockquote>` : ''}
            ${lesson.primary_source.caption ? `<div style="color: #475569; margin-bottom: 15px; font-size: 0.95rem; text-align: left;">${lesson.primary_source.caption}</div>` : ''}
            ${lesson.primary_source.question
          ? `
              <div style="background: #ebf8ff; border-left: 4px solid #3182ce; padding: 15px; border-radius: 0 4px 4px 0; text-align: left; margin-top: 20px;">
                <p style="margin-bottom: 0; font-size: 1.1rem; color: #1e3a8a;"><strong>${lesson.primary_source.qNum ? `Q${lesson.primary_source.qNum}. ` : ''}${formatQuestion(lesson.primary_source.question, !lesson.primary_source.qNum)}</strong></p>
              </div>
            `
          : ''
        }
          </div>
        </div>
      `;
    }
  }

  const isMedicineUnit =
    (typeof window !== 'undefined' && window.currentUnitId === 'edexcel_medicine') ||
    (lesson.id && /^lesson_[1-5]_\d+$/.test(lesson.id));
  if (
    !isMedicineUnit &&
    lesson.starters &&
    lesson.starters.length > 0 &&
    typeof lesson.starters[0] === 'object' &&
    lesson.starters[0].source
  ) {
    htmlPrimary += `
          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 8px; margin-bottom: 20px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <div style="padding: 15px 20px; background: linear-gradient(to right, #1e3a8a, #3b82f6); color: white; font-weight: bold; font-size: 1.2rem; display: flex; align-items: center;">
              <i class="fa-solid fa-image" style="margin-right: 10px;"></i> Historical Sources: Think & Wonder
            </div>
            <div style="padding: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start;">
        `;
    lesson.starters.forEach((starter, index) => {
      htmlPrimary += `
              <div style="display: flex; flex-direction: column; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 15px; height: 100%;">
                <h4 style="margin: 0 0 15px 0; color: #0f172a; font-size: 1.1rem; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">Source ${String.fromCharCode(65 + index)}: ${starter.title}</h4>
                <div style="width: 100%; height: 250px; background-color: #000; border-radius: 4px; overflow: hidden; margin-bottom: 15px; display: flex; justify-content: center; align-items: center;">
                  <img src="${getAssetUrl(starter.source || starter.src || starter.image)}" style="max-width: 100%; max-height: 100%; object-fit: contain; cursor: zoom-in;" data-action="open-modal" data-src="${getAssetUrl(starter.source || starter.src || starter.image)}">
                </div>
                <div style="font-size: 0.95rem; color: #475569; margin-bottom: 15px; font-style: italic;">
                  ${starter.caption}
                </div>
                <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; border-radius: 0 4px 4px 0; margin-top: auto;">
                  <div style="font-weight: 700; color: #1e40af; margin-bottom: 5px; font-size: 0.95rem;"><i class="fa-solid fa-lightbulb" style="color: #fbbf24; margin-right: 5px;"></i> Think & Wonder</div>
                  <div style="font-size: 0.95rem; color: #1e40af;">${starter.think_wonder}</div>
                </div>
              </div>
          `;
    });
    htmlPrimary += `
            </div>
          </div>
        `;
  }

  if (lesson.utility_starters && lesson.utility_starters.sources) {
    htmlPrimary += `
          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 8px; margin-bottom: 20px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <div style="padding: 15px 20px; background: linear-gradient(to right, #475569, #334155); color: white; font-weight: bold; font-size: 1.2rem; display: flex; align-items: center;">
              <i class="fa-solid fa-scale-balanced" style="margin-right: 10px;"></i> Historical Sources: Utility
            </div>
            <div class="utility-sources-grid">
        `;
    lesson.utility_starters.sources.forEach((source, index) => {
      let sourceContentHtml = '';
      if (source.type === 'written') {
        sourceContentHtml = `
               <div class="utility-source-written">
                 <i class="fa-solid fa-quote-left" style="color: #facc15; font-size: 1.5rem; margin-bottom: 10px; display: block;"></i>
                 ${source.content}
               </div>
             `;
      } else {
        const utilSourceSrc = getAssetUrl(source.image || source.source || source.src);
        sourceContentHtml = `
                <div class="utility-source-visual">
                  <img class="utility-source-img" src="${utilSourceSrc}" alt="${source.title || 'Historical Source'}" data-action="open-modal" data-src="${utilSourceSrc}">
                </div>
                ${source.caption ? `<div style="font-size: 0.95rem; color: #475569; margin-bottom: 15px; font-style: italic;">${source.caption}</div>` : ''}
             `;
      }

      htmlPrimary += `
              <div class="utility-source-card">
                <h4 class="utility-source-title">${source.title}</h4>
                ${sourceContentHtml}
                
                <details style="background: #f1f5f9; border-left: 4px solid #64748b; border-radius: 0 4px 4px 0; margin-top: auto; overflow: hidden;">
                  <summary style="padding: 12px; cursor: pointer; font-weight: 700; color: #334155; font-size: 0.95rem; list-style: none; display: flex; align-items: center;">
                    <i class="fa-solid fa-key" style="color: #fbbf24; margin-right: 8px;"></i> Reveal Provenance Clue
                  </summary>
                  <div style="padding: 0 12px 12px 12px; font-size: 0.95rem; color: #475569; border-top: 1px dashed #cbd5e1; margin-top: 4px; padding-top: 8px;">
                    ${source.provenance_clue}
                  </div>
                </details>
              </div>
          `;
    });
    htmlPrimary += `
            </div>
            <div style="padding: 15px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <h3 style="margin: 0; color: #0f172a; font-size: 1.15rem; font-family: 'Playfair Display', serif;">
                How useful are Sources A and B for an enquiry into ${lesson.utility_starters.enquiry}? (8 marks)
              </h3>
            </div>
          </div>
        `;
  }

  if (lesson.do_now && lesson.do_now.type === 'timeline' && lesson.do_now.events) {
    if (isTrip) {
      htmlDoNowInner += `
          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 6px; margin-bottom: 20px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
              <div style="padding: 18px;">
                <div style="margin-bottom: 16px; font-size: 1.15rem; color: #1e3a8a;"><strong>${lesson.do_now.prediction_question || ''}</strong></div>
                <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between;">
        `;
      lesson.do_now.events.forEach((ev, idx) => {
        htmlDoNowInner += `
            <div style="width: 45%; border: 2px solid #cbd5e1; border-radius: 8px; padding: 15px; background: #fff; box-shadow: 2px 2px 0px #94a3b8; margin-bottom: 15px;">
              <div style="font-weight: 800; color: #1e40af; font-size: 1.2rem; margin-bottom: 5px;"><i class="fa-regular fa-clock" style="margin-right: 6px;"></i>${ev.year}</div>
              <div style="font-weight: 600; color: #0f172a; margin-bottom: 8px;">${ev.title}</div>
              <div style="font-size: 0.95rem; color: #475569;">${ev.detail}</div>
              ${ev.img ? `<div style="text-align: center; margin-top: 15px;"><img src="${getAssetUrl(ev.img)}" style="max-width: 40%; border-radius: 4px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>` : ''}
            </div>
          `;
      });
      htmlDoNowInner += `</div></div></div>`;

      // Add Map Container
      const eventsWithLoc = lesson.do_now.events.filter((e) => e.lat && e.lng);
      if (eventsWithLoc.length > 0) {
        htmlDoNowInner += `
            <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 20px;">
              <div style="padding: 12px 18px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-weight: bold; font-size: 1.05rem; color: #1e293b;">
                <i class="fa-solid fa-map-location-dot" style="color: #ef4444; margin-right: 8px;"></i> Interactive Trip Map
              </div>
              <div id="trip-map-container" style="height: 500px; width: 100%;"></div>
            </div>
          `;
      }
    } else {
      htmlDoNowInner += `
          <div class="donow-panel-content">
            ${renderDoNowHeaderWithTimerHTML({
        timerId: 'donow-timeline-timer',
        title: 'Timeline Starter',
        badgeText: 'Chronological Sequence',
        icon: 'fa-solid fa-clock-rotate-left',
        showRevealAll: false,
      })}
            <div style="margin-bottom: 14px; font-size: 1rem; color: #1e3a8a;"><strong>${lesson.do_now.prediction_question || ''}</strong></div>
            <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between;">
      `;
      lesson.do_now.events.forEach((ev, idx) => {
        htmlDoNowInner += `
            <div style="width: 48%; border: 1.5px solid #cbd5e1; border-radius: 6px; padding: 12px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.03); margin-bottom: 10px;">
              <div style="font-weight: 800; color: #0284c7; font-size: 1.05rem; margin-bottom: 4px;"><i class="fa-regular fa-clock" style="margin-right: 6px;"></i>${ev.year}</div>
              <div style="font-weight: 600; color: #0f172a; margin-bottom: 6px; font-size: 0.92rem;">${ev.title}</div>
              <div style="font-size: 0.88rem; color: #475569; line-height: 1.35;">${ev.detail}</div>
              ${ev.img ? `<div style="text-align: center; margin-top: 10px;"><img src="${getAssetUrl(ev.img)}" style="max-width: 40%; border-radius: 4px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.08);"></div>` : ''}
            </div>
          `;
      });
      htmlDoNowInner += `</div></div>`;
    }
  } else if (
    !isTrip &&
    ((lesson.do_now &&
      (lesson.do_now.items || lesson.do_now.questions || lesson.do_now.tasks)) ||
      (Array.isArray(lesson.quiz) && lesson.quiz.length > 0))
  ) {
    const headerHtml = renderDoNowHeaderWithTimerHTML({
      timerId: 'donow-timer',
      title: 'Do Now',
      badgeText: '',
      icon: 'fa-solid fa-list-check',
      showRevealAll: true,
      includeTimer: true,
    });
    const timerHtml = '';
    const currentDb =
      typeof window !== 'undefined'
        ? window.db || (appStore && appStore.state && appStore.state.db)
        : null;
    htmlDoNowInner = renderGcseDoNowPanelHTML({
      lesson,
      activeUnit,
      unitId,
      db: currentDb,
      headerHtml,
      timerHtml,
      isKs3: !isGCSE && !isKs2,
      isKs2,
    });
    window.postRenderHooks.push(() => {
      initGcseDoNowEngine(
        lesson,
        activeUnit,
        typeof window !== 'undefined'
          ? window.db || (appStore && appStore.state && appStore.state.db)
          : null,
        !isGCSE && !isKs2,
        isKs2,
      );
    });
  }
  htmlDoNow = htmlDoNowInner;

  const hasVocab = lesson.vocab && lesson.vocab.length > 0;
  if (hasVocab) {
    htmlVocabInner += `
        <div class="vocab-panel-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; gap: 8px;">
              <span style="font-weight: 800; font-size: 0.95rem; color: #b45309; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-spell-check" style="color: #b45309;"></i> Key Vocabulary Mastery &bull; Match &amp; Cognitive Drill
              </span>
            </div>
            <div style="padding: 4px 0;">
              <p style="color: #475569; margin-bottom: 16px; font-size: 0.95rem;"><strong>Vocabulary Practice:</strong> Tap a term on the left, then tap its matching definition on the right to master the key vocabulary.</p>
              <div id="vocab-match-game" class="vocab-match-asymmetric">
                <div class="match-terms">
      `;

    lesson.vocab.forEach((v, idx) => {
      htmlVocabInner += `<button class="btn btn-secondary match-term-btn" data-idx="${idx}">${v.term}</button>`;
    });

    htmlVocabInner += `</div><div class="match-defs">`;

    let defs = lesson.vocab.map((v, idx) => ({ def: v.definition || v.def || '', idx: idx }));
    if (defs.length > 1) {
      // Guaranteed derangement shuffle: ensures NO definition starts on the same horizontal row as its matching term
      let attempts = 0;
      let hasFixedPoint = true;
      while (hasFixedPoint && attempts < 50) {
        attempts++;
        for (let i = defs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [defs[i], defs[j]] = [defs[j], defs[i]];
        }
        hasFixedPoint = defs.some((d, i) => d.idx === i);
      }
      if (hasFixedPoint) {
        defs = defs.map((_, i) => defs[(i + 1) % defs.length]);
      }
    }

    defs.forEach((d) => {
      htmlVocabInner += `<button class="btn btn-secondary match-def-btn" data-idx="${d.idx}">${d.def}</button>`;
    });

    htmlVocabInner += `
                </div>
              </div>
              <div id="unlock-success" style="display: none; margin-top: 20px; padding: 15px; background: #ecfdf5; border: 2px solid #10b981; border-radius: 8px; color: #047857; font-weight: bold; text-align: center; font-size: 1.2rem;">
                <i class="fa-solid fa-star"></i> Vocabulary Mastered!
              </div>
    `;

    // Rotating cognitive vocabulary challenge widget
    let currentLessonIdx = typeof currentIndex === 'number' && currentIndex >= 0 ? currentIndex : 0;
    if (currentLessonIdx === 0 && activeUnit && Array.isArray(activeUnit.lessons)) {
      const foundIdx = activeUnit.lessons.findIndex((l) =>
        l.id && lesson.id ? l.id === lesson.id : l.title === lesson.title,
      );
      if (foundIdx >= 0) currentLessonIdx = foundIdx;
    }
    const currentUnitId =
      (appStore && appStore.state && appStore.state.currentUnitId) || window.currentUnitId || '';
    const pageAnchor = getWorkbookPageAnchor(currentUnitId, lesson, currentLessonIdx);
    const vocabStyle = currentLessonIdx % 4;
    const vocabTermsList = lesson.vocab.map((v) => (v.term || '').trim()).filter(Boolean);

    const wbAnchorBadge = pageAnchor
      ? `<span class="wb-page-pill" style="font-size: 0.8rem; font-weight: 700; color: #0369a1; background: #e0f2fe; border: 1px solid #bae6fd; padding: 3px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 5px;" title="Corresponding page in printed pupil workbook"><i class="fa-solid fa-book-open"></i> ${pageAnchor.booklet && pageAnchor.booklet !== 'Workbook' ? pageAnchor.label : 'Workbook ' + pageAnchor.label}</span>`
      : '';

    const wbDrillBtnHtml = `
      <div style="display: flex; align-items: center; gap: 8px;">
        ${wbAnchorBadge}
        <button type="button" class="btn btn-secondary" data-action="open-vocab-whiteboard" style="font-size: 0.82rem; padding: 4px 10px; background: #eff6ff; color: #1e40af; border: 1.5px solid #bfdbfe; border-radius: 6px; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 5px; transition: all 0.15s ease;" title="Project this vocabulary challenge on the classroom smartboard">
          <i class="fa-solid fa-chalkboard-user"></i> Starter Drill
        </button>
      </div>
    `;

    if (vocabStyle === 0) {
      // Style 0: The Odd One Out
      const oddExemplars = getOddOneOutExemplars(lesson, vocabTermsList, isKs2);
      const oddBtnShowLbl = isKs2 ? 'Show Partner Clues' : 'Show Model Debates';
      const oddBtnHideLbl = isKs2 ? 'Hide Partner Clues' : 'Hide Model Debates';
      const oddBoxHeading = isKs2
        ? 'Partner Discussion Ideas (Real Objects, People &amp; Big Ideas):'
        : 'High-Tariff Discussion Exemplars:';
      const oddBoxPill = isKs2 ? 'Partner Talk Guide' : 'Teacher Debrief Guide';
      htmlVocabInner += `
        <div id="vocab-cognitive-challenge" style="margin-top: 25px; padding-top: 20px; border-top: 1px dashed #cbd5e1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 700; color: #1e3a8a; font-size: 1.05rem;">
                <i class="fa-solid fa-shapes" style="color: #3b82f6; margin-right: 6px;"></i> Vocabulary Challenge: The Odd One Out
              </span>
              <span style="font-size: 0.8rem; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 12px; font-weight: 600;">${isKs2 ? 'Grouping Historical Clues' : 'Conceptual Categorisation'}</span>
            </div>
            ${wbDrillBtnHtml}
          </div>
          <p style="color: #475569; font-size: 0.95rem; margin-bottom: 12px; line-height: 1.5;">
            Click <strong>ONE</strong> term that does not belong with the others.<br>
            <strong>Explain your reasoning:</strong> What historical connection links the other terms, and why is your chosen term different?
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px;">
            ${vocabTermsList
          .map(
            (t) =>
              `<button type="button" class="btn btn-secondary odd-term-btn" onclick="document.querySelectorAll('.odd-term-btn').forEach(b=>{b.style.borderColor='#cbd5e1'; b.style.backgroundColor='#ffffff';}); this.style.borderColor='#2563eb'; this.style.backgroundColor='#eff6ff'; document.getElementById('odd-choice').value='${t.replace(/'/g, "\\'")}'; document.getElementById('odd-reasoning-box').style.display='block';" style="padding: 6px 14px; font-size: 0.9rem; border-radius: 20px; border: 2px solid #cbd5e1; font-weight: 600; cursor: pointer; transition: all 0.2s; background: #ffffff; color: #1e293b;">${t}</button>`,
          )
          .join('')}
          </div>
          <input type="hidden" id="odd-choice" value="">
          <div id="odd-reasoning-box" style="display: none; margin-top: 10px;">
            <textarea placeholder="Explain your historical reasoning: Why is your chosen word the 'Odd One Out' compared to the others?" style="width: 100%; min-height: 70px; padding: 10px; border-radius: 6px; border: 1.5px solid #94a3b8; font-family: inherit; font-size: 0.95rem; box-sizing: border-box;"></textarea>
            <div style="margin-top: 8px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <button type="button" class="btn btn-primary" onclick="this.parentElement.nextElementSibling.style.display='block'; this.style.display='none';" style="font-size: 0.9rem; padding: 6px 14px; background: #1e40af; color: white; border: none; border-radius: 6px; cursor: pointer;">
                <i class="fa-solid fa-check"></i> Submit Justification
              </button>
              <button type="button" class="btn btn-secondary" onclick="const box = document.getElementById('odd-model-box'); const isVis = box.style.display === 'block'; box.style.display = isVis ? 'none' : 'block'; this.innerHTML = isVis ? '<i class=\\'fa-solid fa-eye\\'></i> ${oddBtnShowLbl}' : '<i class=\\'fa-solid fa-eye-slash\\'></i> ${oddBtnHideLbl}';" style="font-size: 0.9rem; padding: 6px 14px; background: #ffffff; color: #92400e; border: 1.5px solid #fde68a; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s;">
                <i class="fa-solid fa-eye"></i> ${oddBtnShowLbl}
              </button>
            </div>
            <div style="display: none; margin-top: 10px; padding: 12px; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 6px; color: #166534; font-size: 0.95rem;">
              <strong>Historical Reflection:</strong> Compare your chosen word and reasoning with a partner! Can they challenge your historical link or offer an alternative Odd One Out?
            </div>
            <div id="odd-model-box" style="display: none; margin-top: 10px; padding: 14px 16px; background: #fefce8; border: 1.5px solid #facc15; border-radius: 8px; color: #713f12; font-size: 0.95rem; line-height: 1.6; box-shadow: 0 2px 8px rgba(234, 179, 8, 0.15);">
              <div style="font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; color: #854d0e;">
                <span><i class="fa-solid fa-star" style="color: #eab308;"></i> ${oddBoxHeading}</span>
                <span style="font-size: 0.75rem; background: #fef08a; padding: 2px 8px; border-radius: 10px; text-transform: uppercase;">${oddBoxPill}</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${oddExemplars
          .map(
            (ex, idx) => `
                  <div style="background: #ffffff; border: 1px solid #fde047; border-radius: 6px; padding: 10px 14px;">
                    <div style="font-size: 0.8rem; font-weight: 800; color: #b45309; text-transform: uppercase;">
                      ${isKs2 ? `Idea ${idx + 1}` : `Option ${String.fromCharCode(65 + idx)}`}: ${ex.title || 'Historical Link'}
                    </div>
                    <div style="font-size: 0.92rem; color: #1e293b; margin: 3px 0;">
                      <strong>${isKs2 ? 'Words:' : 'Trio:'}</strong> ${Array.isArray(ex.trio) ? ex.trio.join(', ') : ex.trio} · <strong>Odd One Out:</strong> <span style="color: #b91c1c; font-weight: 700; background: #fee2e2; padding: 1px 6px; border-radius: 4px;">${ex.odd}</span>
                    </div>
                    <div style="font-size: 0.88rem; color: #334155;">
                      <strong>Why:</strong> ${ex.reason}
                    </div>
                  </div>
                `,
          )
          .join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (vocabStyle === 1) {
      // Style 1: The Golden Sentence (Connect Two)
      const goldenExemplar = getGoldenSentenceExemplar(lesson, vocabTermsList);
      htmlVocabInner += `
        <div id="vocab-cognitive-challenge" style="margin-top: 25px; padding-top: 20px; border-top: 1px dashed #cbd5e1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 700; color: #1e3a8a; font-size: 1.05rem;">
                <i class="fa-solid fa-pen-fancy" style="color: #3b82f6; margin-right: 6px;"></i> Vocabulary Challenge: The Golden Sentence
              </span>
              <span style="font-size: 0.8rem; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 12px; font-weight: 600;">${isKs2 ? 'Connecting Clues' : 'Syntactic Precision'}</span>
            </div>
            ${wbDrillBtnHtml}
          </div>
          <p style="color: #475569; font-size: 0.95rem; margin-bottom: 12px;">
            Choose <strong>TWO</strong> terms from the word bank below. Write <strong>ONE</strong> ${isKs2 ? 'clear historical sentence connecting them using a joining word (<strong>because</strong>, <strong>although</strong>, or <strong>so that</strong>):' : 'single, grammatically sophisticated historical sentence connecting them using a causal conjunction (<strong>because</strong>, <strong>although</strong>, or <strong>consequently</strong>):'}
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
            ${vocabTermsList
          .map(
            (t) =>
              `<span style="background: #ffffff; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; color: #1e293b;">${t}</span>`,
          )
          .join('')}
          </div>
          <textarea id="golden-sentence-input" placeholder="${isKs2 ? 'Write your Golden Sentence here using because, although, or so that...' : 'Write your Golden Sentence here using because, although, or consequently...'}" style="width: 100%; min-height: 70px; padding: 10px; border-radius: 6px; border: 1.5px solid #94a3b8; font-family: inherit; font-size: 0.95rem; box-sizing: border-box;"></textarea>
          <div style="margin-top: 8px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <button type="button" class="btn btn-primary" onclick="const val = (document.getElementById('golden-sentence-input').value || '').toLowerCase(); const feedback = document.getElementById('golden-feedback'); feedback.style.display='block'; if (val.includes('because') || val.includes('although') || val.includes('consequently') || val.includes('so that')) { feedback.style.background='#f0fdf4'; feedback.style.borderColor='#86efac'; feedback.style.color='#166534'; feedback.innerHTML='<strong>Great Historian Sentence!</strong> You connected two key ideas clearly using a strong joining word.'; } else { feedback.style.background='#fffbeb'; feedback.style.borderColor='#fde68a'; feedback.style.color='#92400e'; feedback.innerHTML='<strong>Tip:</strong> Include one of the joining words — <em>because</em>, <em>although</em>, or <em>${isKs2 ? 'so that' : 'consequently'}</em> — to show how your two words link together.'; }" style="font-size: 0.9rem; padding: 6px 14px; background: #1e40af; color: white; border: none; border-radius: 6px; cursor: pointer;">
              <i class="fa-solid fa-sparkles"></i> Check Sentence
            </button>
            <button type="button" class="btn btn-secondary" onclick="const box = document.getElementById('golden-model-box'); const isVis = box.style.display === 'block'; box.style.display = isVis ? 'none' : 'block'; this.innerHTML = isVis ? '<i class=\\'fa-solid fa-eye\\'></i> Show Model Sentence' : '<i class=\\'fa-solid fa-eye-slash\\'></i> Hide Model Sentence';" style="font-size: 0.9rem; padding: 6px 14px; background: #ffffff; color: #92400e; border: 1.5px solid #fde68a; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s;">
              <i class="fa-solid fa-eye"></i> Show Model Sentence
            </button>
          </div>
          <div id="golden-feedback" style="display: none; margin-top: 10px; padding: 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 0.95rem;"></div>
          <div id="golden-model-box" style="display: none; margin-top: 10px; padding: 14px 16px; background: #fefce8; border: 1.5px solid #facc15; border-radius: 6px; color: #713f12; font-size: 0.95rem; line-height: 1.6; box-shadow: 0 2px 6px rgba(234, 179, 8, 0.15);">
            <div style="font-weight: 700; margin-bottom: 4px; display: flex; align-items: gap: 6px; color: #854d0e;">
              <i class="fa-solid fa-star" style="color: #eab308;"></i> Model Golden Sentence:
            </div>
            <div style="font-style: italic; font-family: 'Playfair Display', Georgia, serif; font-size: 1.05rem; color: #1e293b;">
              "${goldenExemplar}"
            </div>
            <div style="margin-top: 6px; font-size: 0.82rem; color: #a16207;">
              <strong>Teacher Note:</strong> ${isKs2 ? 'Shows pupils how to join two historical key terms in one clear sentence.' : 'Demonstrates syntactic embedding of two curriculum terms connected by a causal conjunction.'}
            </div>
          </div>
        </div>
      `;
    } else if (vocabStyle === 2) {
      // Style 2: Conceptual Binary Sort
      const sortCat1Title = isKs2 ? 'War, Rules &amp; Leaders' : 'Power, Governance & Warfare';
      const sortCat2Title = isKs2 ? 'Everyday Life &amp; Safety' : 'Economy, Trade & Society';
      htmlVocabInner += `
        <div id="vocab-cognitive-challenge" style="margin-top: 25px; padding-top: 20px; border-top: 1px dashed #cbd5e1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 700; color: #1e3a8a; font-size: 1.05rem;">
                <i class="fa-solid fa-layer-group" style="color: #3b82f6; margin-right: 6px;"></i> Vocabulary Challenge: ${isKs2 ? 'Sort the Key Words' : 'Conceptual Classification'}
              </span>
              <span style="font-size: 0.8rem; background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; font-weight: 600;">${isKs2 ? 'Two-Group Sort' : 'Conceptual Sorting'}</span>
            </div>
            ${wbDrillBtnHtml}
          </div>
          <p style="color: #475569; font-size: 0.95rem; margin-bottom: 12px;">
            Click on each term below to sort it into <strong>${sortCat1Title}</strong> or <strong>${sortCat2Title}</strong>:
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
            <div id="sort-cat-power" style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 8px; padding: 12px; min-height: 120px;">
              <div style="font-weight: bold; color: #1e3a8a; font-size: 0.95rem; border-bottom: 1.5px solid #bfdbfe; padding-bottom: 6px; margin-bottom: 10px; text-align: center;">
                ${sortCat1Title}
              </div>
              <div class="sort-bucket-items" style="display: flex; flex-direction: column; gap: 6px;"></div>
            </div>
            <div id="sort-cat-economy" style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px; padding: 12px; min-height: 120px;">
              <div style="font-weight: bold; color: #166534; font-size: 0.95rem; border-bottom: 1.5px solid #bbf7d0; padding-bottom: 6px; margin-bottom: 10px; text-align: center;">
                ${sortCat2Title}
              </div>
              <div class="sort-bucket-items" style="display: flex; flex-direction: column; gap: 6px;"></div>
            </div>
          </div>
          <div id="sort-token-container" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px;">
            ${vocabTermsList
          .map(
            (t) =>
              `<button type="button" class="btn btn-secondary sort-token-btn" onclick="const b1 = document.querySelector('#sort-cat-power .sort-bucket-items'); const b2 = document.querySelector('#sort-cat-economy .sort-bucket-items'); const root = document.getElementById('sort-token-container'); if(this.dataset.assigned === 'power'){ this.dataset.assigned='economy'; b2.appendChild(this); this.style.background='#dcfce7'; this.style.borderColor='#86efac'; } else if(this.dataset.assigned === 'economy'){ this.dataset.assigned='unassigned'; root.appendChild(this); this.style.background='#ffffff'; this.style.borderColor='#94a3b8'; } else { this.dataset.assigned='power'; b1.appendChild(this); this.style.background='#dbeafe'; this.style.borderColor='#93c5fd'; }" data-assigned="unassigned" style="padding: 5px 12px; font-size: 0.85rem; border-radius: 12px; border: 1.5px solid #94a3b8; background: #ffffff; color: #1e293b; cursor: pointer; font-weight: 600; transition: all 0.2s;">${t} &rarr;</button>`,
          )
          .join('')}
          </div>
          <p style="font-size: 0.8rem; color: #64748b; margin-top: 8px; font-style: italic;">Click a word button to move it between Group 1 (blue), Group 2 (green), and unassigned.</p>
        </div>
      `;
    } else if (vocabStyle === 3) {
      // Style 3: Spot the Deliberate Historical Error!
      const errorStatement = lesson.vocab_deliberate_error
        ? lesson.vocab_deliberate_error
        : isKs2
          ? `A visitor claimed that ${vocabTermsList[0] || 'this key idea'} and ${vocabTermsList[1] || 'this wartime event'} made no difference at all to children and families during World War II.`
          : `A modern historical commentator claimed that ${vocabTermsList[0] || 'the main concept'} and ${vocabTermsList[1] || 'the event'} were completely trivial, playing no role in shaping the political outcome of this era.`;

      htmlVocabInner += `
        <div id="vocab-cognitive-challenge" style="margin-top: 25px; padding-top: 20px; border-top: 1px dashed #cbd5e1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 700; color: #1e3a8a; font-size: 1.05rem;">
                <i class="fa-solid fa-triangle-exclamation" style="color: #ef4444; margin-right: 6px;"></i> Vocabulary Challenge: Spot the Deliberate Error!
              </span>
              <span style="font-size: 0.8rem; background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 12px; font-weight: 600;">Critical Reading</span>
            </div>
            ${wbDrillBtnHtml}
          </div>
          <p style="color: #475569; font-size: 0.95rem; margin-bottom: 12px;">
            The statement below contains a <strong>deliberate historical misconception</strong>. Identify the false claim and write the accurate historical correction below:
          </p>
          <div style="border-left: 4px solid #ef4444; background: #fef2f2; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-bottom: 12px; font-size: 0.95rem; line-height: 1.6; color: #7f1d1d; font-style: italic;">
            "${errorStatement}"
          </div>
          <textarea id="deliberate-correction-input" placeholder="Explain the historical misconception and provide the accurate historical reality using evidence from the lesson..." style="width: 100%; min-height: 70px; padding: 10px; border-radius: 6px; border: 1.5px solid #94a3b8; font-family: inherit; font-size: 0.95rem; box-sizing: border-box;"></textarea>
          <div style="margin-top: 8px;">
            <button type="button" class="btn btn-primary" onclick="document.getElementById('error-correction-feedback').style.display='block'; this.style.display='none';" style="font-size: 0.9rem; padding: 6px 14px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer;">
              <i class="fa-solid fa-eye"></i> Reveal Historical Truth & Reflection
            </button>
          </div>
          <div id="error-correction-feedback" style="display: none; margin-top: 10px; padding: 12px; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 6px; color: #166534; font-size: 0.95rem; line-height: 1.5;">
            <strong>Historical Analysis:</strong> Historians must constantly interrogate statements for bias, oversimplification, and factual inaccuracies. Review your correction to ensure you contrasted the false claim with specific historical evidence from the lesson!
          </div>
        </div>
      `;
    }

    // Note: Lesson Summary Cloze is now rendered uniformly at the end of every lesson inside lesson_consolidate_station.js

    htmlVocabInner += `
            </div>
          </div>
      `;
  }

  // ==========================================
  // TAB 2: THE HISTORY
  // ==========================================

  // Note: Learning objectives are now integrated directly into the Launchpad bar
  // (dedicated tab) and docked side-by-side to the left of the Do Now retrieval starter.
  // This keeps the Historical Narrative 100% clean and eliminates bulky vertical spacing.

  let videos = [];
  if (lesson.video) {
    videos = videos.concat(Array.isArray(lesson.video) ? lesson.video : [lesson.video]);
  }
  if (lesson.extra_videos && Array.isArray(lesson.extra_videos)) {
    videos = videos.concat(lesson.extra_videos);
  }
  if (lesson.video_append && Array.isArray(lesson.video_append)) {
    const seenVideoUrls = new Set(videos.map((v) => v && v.url).filter(Boolean));
    lesson.video_append.forEach((v) => {
      if (v && (!v.url || !seenVideoUrls.has(v.url))) {
        videos.push(v);
        if (v.url) seenVideoUrls.add(v.url);
      }
    });
  }

  if (videos.length > 0) {
    htmlVideo = renderLessonVideos(videos, lesson, unitId);
  }

  if (lesson.narrative_blocks && lesson.narrative_blocks.length > 0) {
    htmlNarrative += `
        <div class="phase-card">
      `;

    const rawPrologue = lesson.prologue || lesson.hook_text || lesson.blurb;
    if (rawPrologue) {
      const prologueText = rawPrologue.trim().replace(/(^|[.!?\n]\s*)([A-Z0-9"“'‘][^.!?\r\n]*?\?)/g, (fullMatch, prefix, q) => {
        if (q.includes('<em>') || q.includes('<i>')) return fullMatch;
        return `${prefix}<em class="historical-setting-question">${q}</em>`;
      });
      const prologueStudioAudio = lesson.prologue_audio || '';
      const prologueVoiceLabel = lesson.prologue_voice_label || 'Studio Historian';
      const prologueStudioAttrs = prologueStudioAudio
        ? ` data-studio-audio="${prologueStudioAudio.replace(/"/g, '&quot;')}" data-studio-voice-label="${prologueVoiceLabel.replace(/"/g, '&quot;')}"`
        : '';
      const prologueVoiceBadge = prologueStudioAudio
        ? `<span class="prologue-studio-badge" style="font-size: 0.68rem; font-weight: 700; color: #0369a1; background: #e0f2fe; border: 1px solid #bae6fd; padding: 2px 8px; border-radius: 999px; text-transform: none; letter-spacing: 0;">${prologueVoiceLabel}</span>`
        : '';
      htmlNarrative += `
        <div class="historical-editorial-lede"${prologueStudioAttrs}>
          <div class="lede-eyebrow" style="display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;">
            <div style="display: inline-flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-compass"></i>
              <span>The Historical Setting</span>
            </div>
            <div style="display: inline-flex; align-items: center; gap: 8px;">
              ${prologueVoiceBadge}
              ${renderAudioPlaybackBar('Listen to Historical Setting', 'prologue-audio-bar')}
            </div>
          </div>
          <p class="historical-editorial-lede-text">
            ${prologueText}
          </p>
        </div>
      `;
    }

    if (lesson.note_scaffold) {
      htmlNarrative += renderLessonNoteScaffold(lesson, unitId);
      window.postRenderHooks.push(() => {
        if (lesson.note_scaffold && Array.isArray(lesson.note_scaffold.blocks)) {
          lesson.note_scaffold.blocks.forEach((_, idx) => {
            const textarea = document.getElementById(`note-text-${lesson.id}-${idx}`);
            if (textarea) {
              const saved = localStorage.getItem(`med_note_${lesson.id}_${idx}`);
              if (saved) textarea.value = saved;
            }
          });
        }
      });
    }

    if (Array.isArray(lesson.contested_terms) && lesson.contested_terms.length > 0) {
      const escCt = (val) =>
        String(val || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      const termCount = lesson.contested_terms.length;
      htmlNarrative += `
        <details class="contested-terms-strip" id="contested-terms-${lesson.id || 'current'}">
          <summary class="contested-terms-summary">
            <div class="contested-terms-summary-left">
              <span class="contested-terms-badge">
                <i class="fa-solid fa-language"></i>
                <span>One Land, Two Vocabularies</span>
              </span>
              <span class="contested-terms-subtitle">
                ${termCount} paired historical ${termCount === 1 ? 'term' : 'terms'} &middot; Why historians encounter different names for the same events
              </span>
            </div>
            <span class="contested-terms-toggle">
              <span class="ct-lbl-closed">View Guide</span>
              <span class="ct-lbl-open">Close</span>
              <span class="ct-caret">&#9662;</span>
            </span>
          </summary>
          <div class="contested-terms-body">
            ${lesson.contested_terms
              .map(
                (ct) => `
              <div class="contested-term-item">
                <div class="contested-term-pair-grid">
                  <div class="contested-term-box">
                    ${ct.used_by_a ? `<span class="contested-used-by">${escCt(ct.used_by_a)}</span>` : ''}
                    <div class="contested-term-label">${escCt(ct.term_a || '')}</div>
                  </div>
                  <div class="contested-term-arrow" aria-hidden="true">&harr;</div>
                  <div class="contested-term-box">
                    ${ct.used_by_b ? `<span class="contested-used-by">${escCt(ct.used_by_b)}</span>` : ''}
                    <div class="contested-term-label">${escCt(ct.term_b || '')}</div>
                  </div>
                </div>
                ${ct.note ? `<p class="contested-term-note">${typeof formatBold === 'function' ? formatBold(escCt(ct.note)) : escCt(ct.note)}</p>` : ''}
              </div>
            `,
              )
              .join('')}
          </div>
        </details>
      `;
    }

    // --- UNIVERSAL TWO-BEAT CHRONOLOGY SPINE (KS2, KS3, GCSE) ---
    let spineItems = [];
    if (
      lesson.causal_domino_spine &&
      Array.isArray(lesson.causal_domino_spine.stages) &&
      lesson.causal_domino_spine.stages.length > 0
    ) {
      spineItems = lesson.causal_domino_spine.stages.map((s, i) => {
        let catalystText = s.trigger || s.desc || '';
        if (s.because && !catalystText.includes(s.because)) {
          if (catalystText && !/[.?!]$/.test(catalystText.trim())) {
            catalystText = catalystText.trim() + '.';
          }
          catalystText = catalystText ? `${catalystText} ${s.because}` : s.because;
        }
        return {
          step: s.step || i + 1,
          date: s.date || '',
          title: s.title || '',
          desc: s.trigger || s.desc || '',
          actor: s.actor || '',
          tag: s.tag || '',
          catalyst: catalystText,
          consequence: s.therefore || s.outcome || s.significance || '',
          question: s.question || s.workbook_question || '',
          para_ref: s.para_ref || s.paraRef || '',
          connective: s.connective || '',
        };
      });
    } else if (
      lesson.workbook_stages &&
      Array.isArray(lesson.workbook_stages) &&
      lesson.workbook_stages.length > 0
    ) {
      spineItems = lesson.workbook_stages.map((st, i) => {
        const bulletText = st.bullets && Array.isArray(st.bullets) ? st.bullets.join('. ') : '';
        let catalystText = bulletText || st.desc || st.focus_clue || '';
        if (st.focus_clue && !catalystText.includes(st.focus_clue)) {
          catalystText = catalystText ? `${catalystText}. ${st.focus_clue}` : st.focus_clue;
        }
        return {
          step: st.step || i + 1,
          date: st.date || '',
          title: st.heading || st.questionHeading || `Enquiry Stage ${i + 1}`,
          desc: bulletText || st.desc || '',
          actor: st.actor || '',
          tag: '',
          catalyst: catalystText,
          consequence: st.therefore || st.outcome || st.significance || '',
          question: st.question || st.prompt || '',
          para_ref: st.para_ref || st.paraRef || '',
          connective: st.connective || '',
        };
      });
    } else if (
      lesson.timeline_anchor &&
      Array.isArray(lesson.timeline_anchor) &&
      lesson.timeline_anchor.length > 0
    ) {
      spineItems = lesson.timeline_anchor.map((a, i) => ({
        step: i + 1,
        date: a.date || '',
        title: a.title || '',
        desc: a.desc || '',
        actor: '',
        tag: '',
        catalyst: a.desc || a.trigger || '',
        consequence: a.therefore || a.outcome || a.significance || '',
        question: a.question || '',
        para_ref: a.para_ref || a.paraRef || '',
        connective: '',
      }));
    }

    if (spineItems.length > 0) {
      let lIdx = 0;
      if (typeof unitData !== 'undefined' && unitData && Array.isArray(unitData.lessons)) {
        lIdx = unitData.lessons.findIndex((l) =>
          l.id && lesson.id ? l.id === lesson.id : l.title === lesson.title,
        );
        if (lIdx === -1) lIdx = 0;
      }
      const pageAnchor = getWorkbookPageAnchor(
        unitId || (typeof window !== 'undefined' ? window.currentUnitId : ''),
        lesson,
        lIdx,
      );

      htmlSpineInner += `
        <div id="lesson-chronology-spine" class="timeline-anchor-details cme-chronology-spine universal-chronology-spine" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-top: 4px solid #0284c7; border-radius: 8px; margin-bottom: 36px; box-shadow: 0 2px 6px rgba(0,0,0,0.04); overflow: hidden;">
          <!-- Master Header Bar -->
          <div style="padding: 12px 18px; font-weight: 700; color: #0f172a; display: flex; align-items: center; justify-content: space-between; user-select: none; background: #f8fafc; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <span style="background: #0284c7; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 0.68rem; font-weight: 800; padding: 2.5px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Chronology Spine</span>
              <span style="font-weight: 800; font-size: 0.98rem; color: #0f172a; font-family: 'Inter', sans-serif;">Key Turning Points &amp; Causal Dominoes</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              ${pageAnchor ? `<span style="font-size: 0.74rem; font-weight: 700; color: #0369a1; background: #f0f9ff; border: 1px solid #bae6fd; padding: 2px 8px; border-radius: 12px;"><i class="fa-solid fa-book-open" style="color: #0284c7; margin-right: 4px;"></i> Workbook Spread: ${pageAnchor.label}</span>` : ''}
              <button type="button" class="btn btn-toggle-all-stages btn-toggle-all-consequences" onclick="event.stopPropagation(); window.toggleAllSpineStages(this);" style="font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 700; color: #0369a1; background: #ffffff; border: 1.2px solid #bae6fd; padding: 3px 12px; border-radius: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); transition: all 0.15s ease;" title="Expand or collapse all historical answer stages across all cards">
                <i class="fa-solid fa-eye" style="font-size: 0.70rem;"></i> <span class="toggle-stage-text toggle-consequence-text">Reveal All Stages</span>
              </button>
              ${unitId === 'cme_new' ||
          (typeof window !== 'undefined' &&
            (window.currentUnitId === 'cme_new' ||
              window.currentUnitId === 'gcse_middle_east_1945_1995'))
          ? `
              <button type="button" class="btn btn-timeline-jump" onclick="event.stopPropagation(); if(typeof window.saveUnitReturnOrigin==='function'){window.saveUnitReturnOrigin();} if(typeof window.switchView==='function'){window.switchView('timeline', 'cme_new');}else if(typeof window.navigateTo==='function'){window.navigateTo('timeline');}" style="font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 700; color: #1e3a8a; background: #eff6ff; border: 1.2px solid #bfdbfe; padding: 3px 12px; border-radius: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); transition: all 0.15s ease;" title="Jump to interactive chronological Living Timeline">
                <i class="fa-solid fa-clock-rotate-left" style="color: #2563eb;"></i> Full Living Timeline &rarr;
              </button>
              `
          : ''
        }
              <span style="font-size: 0.74rem; font-weight: 700; color: #475569; background: #e2e8f0; padding: 2px 8px; border-radius: 12px;">${spineItems.length} Milestones</span>
            </div>
          </div>

          <!-- Dynamic Columns Grid -->
          <div class="cme-chronology-spine-grid" style="--spine-cols: ${spineItems.length};">
            ${spineItems
          .map((item, idx) => {
            const isLast = idx === spineItems.length - 1;
            const displayDate = item.date
              ? item.date.replace('October–November', 'Oct–Nov')
              : '';
            const hasConsequence = Boolean(
              item.consequence && item.consequence.trim().length > 0,
            );
            const cleanQ = item.question ? item.question.replace(/^"|"$/g, '').trim() : '';
            const targetParaMatch = item.para_ref && item.para_ref.match(/\d+\.\d+/);
            const targetFirstPara = targetParaMatch ? targetParaMatch[0] : `${item.step}.1`;
            const dominoTooltip = item.connective
              ? item.connective
              : `Stage ${item.step} triggers Stage ${item.step + 1}`;

            return `
                <div class="cme-spine-card universal-spine-card" data-stage="${item.step}">
                  ${!isLast
                ? `
                  <div class="cme-domino-pipeline-node" title="${dominoTooltip}">
                    <i class="fa-solid fa-arrow-right"></i>
                  </div>`
                : ''
              }

                  <!-- Dedicated Stage Top Bar: Step Node + Date Badge -->
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #f1f5f9;">
                    <span class="spine-stage-number-node" onclick="event.stopPropagation(); if(window.jumpToNarrativeBlock){window.jumpToNarrativeBlock(${item.step});}" title="Stage ${item.step} (Click to jump to reading)" style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #0284c7; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 900; line-height: 1; flex-shrink: 0; box-shadow: 0 1px 3px rgba(2, 132, 199, 0.3); cursor: pointer; transition: transform 0.15s ease;">
                      ${item.step}
                    </span>
                    ${displayDate
                ? `
                    <span class="cme-spine-date-badge" style="font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 800; color: #0369a1; background: #e0f2fe; padding: 2px 7px; border-radius: 4px; white-space: nowrap;" title="${item.date}">${displayDate}</span>
                  `
                : ''
              }
                  </div>

                  <!-- Historical Actor Row -->
                  ${item.actor
                ? `
                  <div style="margin-bottom: 6px; font-family: 'Inter', sans-serif; font-size: 0.66rem; font-weight: 700; color: #475569; display: flex; align-items: flex-start; gap: 5px; line-height: 1.28; min-height: 28px;" title="Historical Actor: ${item.actor}">
                    <i class="fa-solid fa-users" style="color: #0284c7; font-size: 0.60rem; flex-shrink: 0; margin-top: 2px;"></i>
                    <span style="line-height: 1.28; word-break: normal;">${item.actor}</span>
                  </div>`
                : ''
              }

                  <!-- Milestone Title -->
                  <h5 class="cme-spine-title" style="margin: 0 0 8px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 0.94rem; font-weight: 800; color: #0f172a; line-height: 1.30;">
                    ${item.title}
                  </h5>

                  <!-- Interactive Enquiry Question Card (Click to Reveal Turning Point & Consequence) -->
                  ${cleanQ
                ? `
                  <button type="button" class="spine-question-toggle-card" onclick="event.stopPropagation(); window.toggleCardSpineStage(this);" aria-expanded="false" style="width: 100%; text-align: left; background: #f8fafc; border: 1.2px solid #cbd5e1; border-left: 4px solid #0284c7; padding: 8px 10px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; margin-bottom: 8px; display: flex; flex-direction: column; gap: 5px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);" title="Click to test your memory and reveal the turning point &amp; consequence">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                      <span style="display: inline-flex; align-items: center; gap: 5px; font-family: 'Inter', sans-serif; font-size: 0.64rem; font-weight: 800; color: #0284c7; letter-spacing: 0.4px;">
                        <i class="fa-solid fa-circle-question" style="font-size: 0.68rem;"></i>
                        <span>Key Enquiry</span>
                      </span>
                      <span class="stage-toggle-indicator" style="font-size: 0.66rem; font-weight: 800; color: #0284c7; background: #e0f2fe; padding: 1.5px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;">
                        <span class="stage-toggle-label">Reveal</span> <i class="fa-solid fa-chevron-down stage-chevron" style="font-size: 0.58rem; transition: transform 0.2s ease;"></i>
                      </span>
                    </div>
                    <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 0.83rem; color: #0f284e; line-height: 1.40; font-style: italic;">
                      "${cleanQ}"
                    </div>
                  </button>`
                : ''
              }

                  <!-- Collapsible Stage Answer Body (Action, Motive & Consequence) -->
                  <div class="spine-stage-body" style="display: none; animation: spineSlideDown 0.22s ease-out; flex-direction: column; gap: 8px; margin-top: auto;">
                    <!-- Beat 1: The Turning Point / Catalyst -->
                    <div class="spine-catalyst-block" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px;">
                      <div style="font-family: 'Inter', sans-serif; font-size: 0.63rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                        <i class="fa-solid fa-play" style="color: #0284c7; font-size: 0.55rem;"></i> The Turning Point
                      </div>
                      <div style="font-size: 0.81rem; color: #334155; line-height: 1.46;">
                        ${item.catalyst}
                      </div>
                    </div>

                    <!-- Beat 2: Consequence & Significance (Amber Dual-Coding Identity) -->
                    ${hasConsequence
                ? `
                    <div class="spine-consequence-block" style="background: #fffdf5; border: 1px solid #fef3c7; border-left: 3.5px solid #d97706; border-radius: 6px; padding: 8px 10px;">
                      <div style="font-family: 'Inter', sans-serif; font-size: 0.63rem; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                        <i class="fa-solid fa-bolt" style="color: #d97706; font-size: 0.60rem;"></i> Consequence &amp; Significance
                      </div>
                      <div style="font-size: 0.81rem; color: #451a03; line-height: 1.45;">
                        ${item.consequence}
                      </div>
                    </div>`
                : ''
              }
                  </div>
                </div>
                ${!isLast
                ? `
                <div class="cme-domino-vertical-connector" title="${dominoTooltip}">
                  <div class="cme-connector-line"></div>
                  <div class="cme-connector-badge">
                    <i class="fa-solid fa-arrow-down"></i>
                    <span>Next Stage</span>
                  </div>
                  <div class="cme-connector-line"></div>
                </div>`
                : ''
              }
                `;
          })
          .join('')}
          </div>
        </div>
      `;
    }

    let renderedKeyIndividual = false;
    let renderedOralHinge = false;
    let visualPlateCounter = 0;

    const escHtmlSafe = (v) =>
      String(v || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    const escAttrSafe = (v) => escHtmlSafe(v).replace(/"/g, '&quot;');

    const bindSlideCompareInstance = (rootEl, scMeta = {}) => {
      if (!rootEl || rootEl.dataset.scBound === '1') return;
      rootEl.dataset.scBound = '1';
      const stage = rootEl.querySelector('.slide-compare-stage');
      const beforeImg = rootEl.querySelector('.slide-compare-before-img');
      const divider = rootEl.querySelector('.slide-compare-divider');
      const rangeInput = rootEl.querySelector('.slide-compare-range');
      const enlargeBtn = rootEl.querySelector('.slide-compare-enlarge-btn');
      const presetBtns = rootEl.querySelectorAll('[data-sc-preset]');
      const leftPill = rootEl.querySelector('.sc-stage-pill.is-left');
      const rightPill = rootEl.querySelector('.sc-stage-pill.is-right');
      if (!stage || !beforeImg || !divider) return;

      let currentSplit = 50;
      const setSplit = (pct) => {
        const clamped = Math.max(0, Math.min(100, Number.isFinite(Number(pct)) ? Number(pct) : 50));
        currentSplit = clamped;
        const clipVal = `inset(0 ${100 - clamped}% 0 0)`;
        beforeImg.style.clipPath = clipVal;
        beforeImg.style.webkitClipPath = clipVal;
        divider.style.left = `${clamped}%`;
        stage.setAttribute('aria-valuenow', String(Math.round(clamped)));
        if (rangeInput) rangeInput.value = String(Math.round(clamped));
        if (leftPill) leftPill.style.opacity = clamped < 22 ? '0' : '1';
        if (rightPill) rightPill.style.opacity = clamped > 78 ? '0' : '1';
        presetBtns.forEach((btn) => {
          const pVal = Number(btn.dataset.scPreset);
          btn.classList.toggle('is-active', Math.abs(clamped - pVal) <= 4);
        });
      };

      const updateFromClientX = (clientX) => {
        const rect = stage.getBoundingClientRect();
        if (!rect || rect.width <= 0) return;
        const pct = ((clientX - rect.left) / rect.width) * 100;
        setSplit(pct);
      };

      let isDragging = false;
      const onWinMove = (ev) => {
        if (!isDragging) return;
        updateFromClientX(ev.clientX);
      };
      const onWinUp = () => {
        if (!isDragging) return;
        isDragging = false;
        window.removeEventListener('pointermove', onWinMove);
        window.removeEventListener('pointerup', onWinUp);
        window.removeEventListener('pointercancel', onWinUp);
      };

      stage.addEventListener('pointerdown', (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        isDragging = true;
        updateFromClientX(e.clientX);
        try {
          stage.focus({ preventScroll: true });
        } catch (_) {
          stage.focus();
        }
        window.addEventListener('pointermove', onWinMove);
        window.addEventListener('pointerup', onWinUp);
        window.addEventListener('pointercancel', onWinUp);
      });

      let touchStartX = 0;
      let touchStartY = 0;
      stage.addEventListener(
        'touchstart',
        (e) => {
          if (!e.touches || !e.touches[0]) return;
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          updateFromClientX(touchStartX);
        },
        { passive: true },
      );
      stage.addEventListener(
        'touchmove',
        (e) => {
          if (!e.touches || !e.touches[0]) return;
          const dx = Math.abs(e.touches[0].clientX - touchStartX);
          const dy = Math.abs(e.touches[0].clientY - touchStartY);
          if (dx >= dy) {
            if (e.cancelable) e.preventDefault();
            updateFromClientX(e.touches[0].clientX);
          }
        },
        { passive: false },
      );

      const onKey = (e) => {
        const step = e.shiftKey ? 10 : 5;
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setSplit(currentSplit - step);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          setSplit(currentSplit + step);
        } else if (e.key === 'Home') {
          e.preventDefault();
          setSplit(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          setSplit(100);
        } else if (e.key === 'Enter' && scMeta.allowEnlarge) {
          e.preventDefault();
          openSlideCompareLightboxModal(scMeta);
        }
      };
      stage.addEventListener('keydown', onKey);

      if (rangeInput) {
        rangeInput.addEventListener('input', () => setSplit(Number(rangeInput.value)));
        rangeInput.addEventListener('change', () => setSplit(Number(rangeInput.value)));
      }

      presetBtns.forEach((btn) => {
        btn.addEventListener('click', () => setSplit(Number(btn.dataset.scPreset)));
      });

      if (enlargeBtn && scMeta.allowEnlarge) {
        enlargeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openSlideCompareLightboxModal(scMeta);
        });
      }
      if (scMeta.allowEnlarge) {
        stage.addEventListener('dblclick', () => openSlideCompareLightboxModal(scMeta));
      }
      setSplit(50);
    };

    const openSlideCompareLightboxModal = (scMeta) => {
      if (typeof document === 'undefined' || !scMeta) return;
      const existing = document.getElementById('slide-compare-lightbox');
      if (existing) existing.remove();
      const prevOverflow = document.body.style.overflow || '';
      document.body.style.overflow = 'hidden';

      const shortSideName = (lbl) => String(lbl || '').replace(/\s*\([^)]*\)\s*/g, '').trim();
      const beforeShort = shortSideName(scMeta.beforeLabel || 'Before');
      const afterShort = shortSideName(scMeta.afterLabel || 'After');

      const modal = document.createElement('div');
      modal.id = 'slide-compare-lightbox';
      modal.className = 'slide-compare-lightbox no-print';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', scMeta.title || 'Slide-Across Comparison');
      modal.innerHTML = `
        <div class="sc-lightbox-header">
          <div class="sc-lightbox-title-wrap">
            <span class="sc-lightbox-badge"><i class="fa-solid fa-arrows-left-right"></i> ${escHtmlSafe(scMeta.eyebrow || 'Slide-Across Comparison')}</span>
            <h2 class="sc-lightbox-title">${escHtmlSafe(scMeta.title || '')}</h2>
          </div>
          <div class="sc-lightbox-actions">
            <div class="sc-preset-group" role="group" aria-label="Comparison Presets">
              <button type="button" class="sc-preset-btn" data-sc-preset="100">Full ${escHtmlSafe(beforeShort)}</button>
              <button type="button" class="sc-preset-btn is-active" data-sc-preset="50">50 / 50 Split</button>
              <button type="button" class="sc-preset-btn" data-sc-preset="0">Full ${escHtmlSafe(afterShort)}</button>
            </div>
            <button type="button" class="sc-lightbox-close-btn" title="Close (Esc)">
              <span>Esc</span> <span style="font-size: 1.15rem; line-height: 1;">&times;</span>
            </button>
          </div>
        </div>
        <div class="sc-lightbox-body">
          <div class="slide-compare-viewport is-lightbox">
            <div class="slide-compare-stage" tabindex="0" role="slider" aria-label="${escAttrSafe(scMeta.title || 'Visual comparison')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
              <img src="${scMeta.afterUrl}" alt="${escAttrSafe(scMeta.afterLabel || 'After')}" class="archival-image slide-compare-img slide-compare-after-img" draggable="false" />
              <img src="${scMeta.beforeUrl}" alt="${escAttrSafe(scMeta.beforeLabel || 'Before')}" class="archival-image slide-compare-img slide-compare-before-img" draggable="false" style="clip-path: inset(0 50% 0 0); -webkit-clip-path: inset(0 50% 0 0);" />
              <span class="sc-stage-pill is-left no-print">LEFT: ${escHtmlSafe(beforeShort)}</span>
              <span class="sc-stage-pill is-right no-print">RIGHT: ${escHtmlSafe(afterShort)}</span>
              <div class="slide-compare-divider" style="left: 50%;">
                <div class="slide-compare-handle" title="Drag curtain left/right or use ArrowLeft / ArrowRight keys">
                  <i class="fa-solid fa-arrows-left-right"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="slide-compare-controls-bar is-lightbox">
            <span class="slide-compare-side-label is-before"><i class="fa-solid fa-arrow-left"></i> Slide left for ${escHtmlSafe(afterShort)}</span>
            <input type="range" min="0" max="100" value="50" step="1" class="slide-compare-range" aria-label="Drag curtain between ${escAttrSafe(scMeta.beforeLabel || 'Before')} and ${escAttrSafe(scMeta.afterLabel || 'After')}" />
            <span class="slide-compare-side-label is-after">Slide right for ${escHtmlSafe(beforeShort)} <i class="fa-solid fa-arrow-right"></i></span>
          </div>
          ${scMeta.caption ? `<p class="slide-compare-caption is-lightbox">${typeof formatBold === 'function' ? formatBold(escHtmlSafe(scMeta.caption)) : escHtmlSafe(scMeta.caption)}</p>` : ''}
        </div>
      `;
      document.body.appendChild(modal);

      const closeModal = () => {
        document.removeEventListener('keydown', onEsc);
        document.body.style.overflow = prevOverflow;
        modal.remove();
      };
      const onEsc = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeModal();
        }
      };
      document.addEventListener('keydown', onEsc);
      modal.querySelector('.sc-lightbox-close-btn')?.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      bindSlideCompareInstance(modal, { ...scMeta, allowEnlarge: false });
      const lbStage = modal.querySelector('.slide-compare-stage');
      if (lbStage) {
        try {
          lbStage.focus({ preventScroll: true });
        } catch (_) {
          lbStage.focus();
        }
      }
    };

    const renderSlideCompareHTML = (scBlock, sIndex) => {
      if (!scBlock || typeof scBlock !== 'object') return '';
      const beforeObj = scBlock.before || {};
      const afterObj = scBlock.after || {};
      const rawBefore = beforeObj.image || beforeObj.src || scBlock.before_image || '';
      const rawAfter = afterObj.image || afterObj.src || scBlock.after_image || '';
      if (!rawBefore || !rawAfter) return '';

      const beforeUrl = getAssetUrl(rawBefore);
      const afterUrl = getAssetUrl(rawAfter);
      const beforeLabel = beforeObj.label || scBlock.before_label || 'Before';
      const afterLabel = afterObj.label || scBlock.after_label || 'After';
      const beforeShort = String(beforeLabel).replace(/\s*\([^)]*\)\s*/g, '').trim();
      const afterShort = String(afterLabel).replace(/\s*\([^)]*\)\s*/g, '').trim();
      const scTitle = scBlock.title || `${beforeLabel} \u2194 ${afterLabel}`;
      const scCaption = scBlock.caption || '';
      const scEyebrow = scBlock.eyebrow || 'Slide-Across Map Comparison';
      const scId = `slide-compare-${String((lesson && lesson.id) || 'lesson').replace(/[^a-zA-Z0-9_-]/g, '-')}-${sIndex}`;

      window.postRenderHooks.push(() => {
        const el = document.getElementById(scId);
        if (el) {
          bindSlideCompareInstance(el, {
            title: scTitle,
            eyebrow: scEyebrow,
            beforeUrl,
            afterUrl,
            beforeLabel,
            afterLabel,
            caption: scCaption,
            allowEnlarge: true,
          });
        }
      });

      return `
        <div class="slide-compare-card" id="${scId}">
          <div class="slide-compare-header">
            <div class="slide-compare-title-group">
              <span class="slide-compare-eyebrow">
                <i class="fa-solid fa-arrows-left-right"></i> ${escHtmlSafe(scEyebrow)}
              </span>
              <h3 class="slide-compare-title">${escHtmlSafe(scTitle)}</h3>
            </div>
            <button type="button" class="hotspot-whiteboard-btn slide-compare-enlarge-btn no-print" title="Enlarge Slide-Across Comparison for Whiteboard">
              <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
              <span>Enlarge</span>
            </button>
          </div>
          <div class="sc-inline-presets no-print" role="group" aria-label="Quick view buttons">
            <button type="button" class="sc-preset-btn" data-sc-preset="100">Full ${escHtmlSafe(beforeShort)}</button>
            <button type="button" class="sc-preset-btn is-active" data-sc-preset="50">50 / 50 Split</button>
            <button type="button" class="sc-preset-btn" data-sc-preset="0">Full ${escHtmlSafe(afterShort)}</button>
          </div>
          <div class="slide-compare-viewport">
            <div class="slide-compare-stage" tabindex="0" role="slider" aria-label="${escAttrSafe(scTitle)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" title="Drag curtain left/right or press ArrowLeft / ArrowRight">
              <img src="${afterUrl}" alt="${escAttrSafe(afterLabel)}" class="archival-image slide-compare-img slide-compare-after-img" draggable="false" />
              <img src="${beforeUrl}" alt="${escAttrSafe(beforeLabel)}" class="archival-image slide-compare-img slide-compare-before-img" draggable="false" style="clip-path: inset(0 50% 0 0); -webkit-clip-path: inset(0 50% 0 0);" />
              <span class="sc-stage-pill is-left no-print">LEFT: ${escHtmlSafe(beforeShort)}</span>
              <span class="sc-stage-pill is-right no-print">RIGHT: ${escHtmlSafe(afterShort)}</span>
              <div class="slide-compare-divider no-print" style="left: 50%;">
                <div class="slide-compare-handle">
                  <i class="fa-solid fa-arrows-left-right"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="slide-compare-controls-bar">
            <span class="slide-compare-side-label is-before"><i class="fa-solid fa-arrow-left"></i> Slide left: ${escHtmlSafe(afterShort)}</span>
            <input type="range" min="0" max="100" value="50" step="1" class="slide-compare-range no-print" aria-label="Slide curtain between ${escAttrSafe(beforeLabel)} and ${escAttrSafe(afterLabel)}" />
            <span class="slide-compare-side-label is-after">Slide right: ${escHtmlSafe(beforeShort)} <i class="fa-solid fa-arrow-right"></i></span>
          </div>
          ${scCaption ? `<p class="slide-compare-caption">${typeof formatBold === 'function' ? formatBold(escHtmlSafe(scCaption)) : escHtmlSafe(scCaption)}</p>` : ''}
        </div>
      `;
    };

    const getConceptWidgetSignpostGlyph = (glyphKey) => {
      const map = {
        leader: 'fa-solid fa-crown',
        language: 'fa-solid fa-book-open',
        church: 'fa-solid fa-place-of-worship',
        clothes: 'fa-solid fa-shirt',
        law: 'fa-solid fa-scale-balanced',
        people: 'fa-solid fa-users',
      };
      return map[glyphKey] || 'fa-solid fa-circle-dot';
    };

    const bindConceptWidgetInstance = (rootEl, cwBlock, allowEnlarge = true) => {
      if (!rootEl || !cwBlock) return;
      const wType = cwBlock.type || 'spectrum_slider';

      if (wType === 'spectrum_slider') {
        const stops = Array.isArray(cwBlock.stops) ? cwBlock.stops : [];
        if (!stops.length) return;
        const btns = rootEl.querySelectorAll('[data-cw-stop]');
        const rangeEl = rootEl.querySelector('.cw-spectrum-range');
        const summaryEl = rootEl.querySelector('.cw-active-summary');
        const gridEl = rootEl.querySelector('.cw-trait-grid');

        const setStop = (idx) => {
          const safeIdx = Math.max(0, Math.min(stops.length - 1, Number(idx) || 0));
          const stop = stops[safeIdx];
          const accent = stop.color || '#38bdf8';
          const accentBg = stop.bg_color || 'rgba(56, 189, 248, 0.18)';
          rootEl.style.setProperty('--cw-accent', accent);
          rootEl.style.setProperty('--cw-accent-bg', accentBg);

          btns.forEach((b, bi) => {
            const active = bi === safeIdx;
            b.classList.toggle('is-active', active);
            b.setAttribute('aria-pressed', active ? 'true' : 'false');
          });
          if (rangeEl) rangeEl.value = String(safeIdx);
          if (summaryEl) {
            summaryEl.innerHTML = `<strong>${escHtmlSafe(stop.label)}:</strong> ${escHtmlSafe(stop.summary || '')}`;
          }
          if (gridEl && Array.isArray(stop.traits)) {
            gridEl.innerHTML = stop.traits
              .map(
                (tr) => `
              <div class="cw-trait-card">
                <div class="cw-trait-icon" aria-hidden="true"><i class="${escAttrSafe(getConceptWidgetSignpostGlyph(tr.glyph || tr.icon))}"></i></div>
                <div class="cw-trait-meta">
                  <div class="cw-trait-cat">${escHtmlSafe(tr.category || '')}</div>
                  <div class="cw-trait-val">${escHtmlSafe(tr.value || '')}</div>
                </div>
              </div>
            `,
              )
              .join('');
          }
        };

        btns.forEach((b) => {
          b.addEventListener('click', () => setStop(Number(b.getAttribute('data-cw-stop'))));
        });
        if (rangeEl) {
          rangeEl.addEventListener('input', () => setStop(Number(rangeEl.value)));
        }
        const defaultIdx =
          typeof cwBlock.default_index === 'number'
            ? cwBlock.default_index
            : Math.floor(stops.length / 2);
        setStop(defaultIdx);
      } else if (wType === 'profile_deck') {
        const items = Array.isArray(cwBlock.items) ? cwBlock.items : [];
        if (!items.length) return;
        const tabs = rootEl.querySelectorAll('[data-cw-tab]');
        const stageEl = rootEl.querySelector('.cw-deck-stage');

        const setItem = (idx) => {
          const safeIdx = Math.max(0, Math.min(items.length - 1, Number(idx) || 0));
          const it = items[safeIdx];
          const accent = it.color || '#f59e0b';
          const accentBg = it.bg_color || 'rgba(245, 158, 11, 0.2)';
          rootEl.style.setProperty('--cw-accent', accent);
          rootEl.style.setProperty('--cw-accent-bg', accentBg);

          tabs.forEach((t, ti) => {
            const active = ti === safeIdx;
            t.classList.toggle('is-active', active);
            t.setAttribute('aria-selected', active ? 'true' : 'false');
          });
          if (stageEl) {
            const metricsHtml = (it.metrics || [])
              .map(
                (m) => `
              <div class="cw-deck-metric">
                <div class="cw-deck-metric-lbl">${escHtmlSafe(m.label || '')}</div>
                <div class="cw-deck-metric-val">${escHtmlSafe(m.value || '')}</div>
              </div>
            `,
              )
              .join('');
            const portraitHtml = it.portrait
              ? `<div class="cw-deck-portrait"><img src="${getAssetUrl(it.portrait)}" alt="${escAttrSafe(it.title || '')}" /></div>`
              : `<div class="cw-deck-num-badge">${safeIdx + 1}</div>`;
            stageEl.innerHTML = `
              <div class="cw-deck-top">
                ${portraitHtml}
                <div class="cw-deck-heading-wrap">
                  <div class="cw-deck-title-row">
                    <h4 class="cw-deck-name">${escHtmlSafe(it.title || '')}</h4>
                    ${it.badge ? `<span class="cw-deck-fate-pill">${escHtmlSafe(it.badge)}</span>` : ''}
                  </div>
                  ${it.dates ? `<div class="cw-deck-dates">${escHtmlSafe(it.dates)}</div>` : ''}
                </div>
              </div>
              <div class="cw-deck-metrics">${metricsHtml}</div>
              <div class="cw-deck-takeaway">${escHtmlSafe(it.takeaway || '')}</div>
            `;
          }
        };

        tabs.forEach((t) => {
          t.addEventListener('click', () => setItem(Number(t.getAttribute('data-cw-tab'))));
        });
        setItem(cwBlock.default_index || 0);
      } else if (wType === 'power_seesaw') {
        const eras = Array.isArray(cwBlock.eras) ? cwBlock.eras : [];
        if (!eras.length) return;
        const tabs = rootEl.querySelectorAll('[data-cw-era]');
        const barsEl = rootEl.querySelector('.cw-power-bars');
        const summaryEl = rootEl.querySelector('.cw-active-summary');

        const setEra = (idx) => {
          const safeIdx = Math.max(0, Math.min(eras.length - 1, Number(idx) || 0));
          const era = eras[safeIdx];
          const accent = era.color || '#38bdf8';
          rootEl.style.setProperty('--cw-accent', accent);

          tabs.forEach((t, ti) => {
            const active = ti === safeIdx;
            t.classList.toggle('is-active', active);
            t.setAttribute('aria-pressed', active ? 'true' : 'false');
          });
          if (barsEl && Array.isArray(era.pillars)) {
            barsEl.innerHTML = era.pillars
              .map(
                (p) => `
              <div class="cw-power-row">
                <div class="cw-power-row-top">
                  <span>${escHtmlSafe(p.actor)}</span>
                  <span>${Number(p.share) || 0}% — ${escHtmlSafe(p.status || '')}</span>
                </div>
                <div class="cw-power-track">
                  <div class="cw-power-fill" style="width: ${Math.max(2, Number(p.share) || 0)}%; background: ${escAttrSafe(p.color || '#38bdf8')};"></div>
                </div>
              </div>
            `,
              )
              .join('');
          }
          if (summaryEl) {
            summaryEl.innerHTML = `<strong>${escHtmlSafe(era.year)} (${escHtmlSafe(era.headline || '')}):</strong> ${escHtmlSafe(era.summary || '')}`;
          }
        };

        tabs.forEach((t) => {
          t.addEventListener('click', () => setEra(Number(t.getAttribute('data-cw-era'))));
        });
        setEra(typeof cwBlock.default_index === 'number' ? cwBlock.default_index : eras.length - 1);
      }

      const enlargeBtn = rootEl.querySelector('.cw-enlarge-btn');
      if (allowEnlarge && enlargeBtn) {
        enlargeBtn.addEventListener('click', () => {
          const existing = document.getElementById('concept-widget-lightbox');
          if (existing) existing.remove();
          const prevOverflow = document.body.style.overflow || '';
          document.body.style.overflow = 'hidden';
          const modal = document.createElement('div');
          modal.id = 'concept-widget-lightbox';
          modal.className = 'slide-compare-lightbox concept-widget-lightbox no-print';
          modal.setAttribute('role', 'dialog');
          modal.setAttribute('aria-modal', 'true');
          modal.innerHTML = `
            <div class="sc-lightbox-header">
              <div class="sc-lightbox-title-wrap">
                <span class="sc-lightbox-badge"><i class="fa-solid fa-sliders"></i> ${escHtmlSafe(cwBlock.eyebrow || 'Interactive Concept Explorer')}</span>
                <h2 class="sc-lightbox-title">${escHtmlSafe(cwBlock.title || '')}</h2>
              </div>
              <div class="sc-lightbox-actions">
                <button type="button" class="sc-lightbox-close-btn" data-cw-close="1" title="Close (Esc)">
                  <span>Esc</span> <span style="font-size: 1.15rem; line-height: 1;">&times;</span>
                </button>
              </div>
            </div>
            <div class="sc-lightbox-body">
              <div id="cw-lightbox-mount" class="concept-widget-card cw-is-enlarged"></div>
            </div>
          `;
          document.body.appendChild(modal);
          const mount = modal.querySelector('#cw-lightbox-mount');
          if (mount) {
            mount.innerHTML = buildConceptWidgetBodyHTML(cwBlock);
            bindConceptWidgetInstance(mount, cwBlock, false);
          }
          const closeModal = () => {
            document.removeEventListener('keydown', onEsc);
            document.body.style.overflow = prevOverflow;
            modal.remove();
          };
          const onEsc = (ev) => {
            if (ev.key === 'Escape') {
              ev.preventDefault();
              closeModal();
            }
          };
          document.addEventListener('keydown', onEsc);
          modal.querySelectorAll('[data-cw-close]').forEach((c) =>
            c.addEventListener('click', closeModal),
          );
          modal.addEventListener('click', (ev) => {
            if (ev.target === modal) closeModal();
          });
        });
      }
    };

    const buildConceptWidgetBodyHTML = (cwBlock) => {
      const wType = cwBlock.type || 'spectrum_slider';
      if (wType === 'spectrum_slider') {
        const stops = Array.isArray(cwBlock.stops) ? cwBlock.stops : [];
        return `
          <div class="concept-widget-body">
            <div class="cw-spectrum-stops" role="group" aria-label="${escAttrSafe(cwBlock.title || 'Spectrum stops')}">
              ${stops
                .map(
                  (st, si) => `
                <button type="button" class="cw-stop-btn" data-cw-stop="${si}" aria-pressed="false">
                  ${escHtmlSafe(st.short_label || st.label)}
                </button>
              `,
                )
                .join('')}
            </div>
            <div class="cw-spectrum-range-row no-print">
              <span style="font-size:0.68rem;font-weight:800;color:#94a3b8;">◀</span>
              <input type="range" class="cw-spectrum-range" min="0" max="${Math.max(0, stops.length - 1)}" step="1" value="1" aria-label="Slide across ${escAttrSafe(cwBlock.title || 'spectrum')}" />
              <span style="font-size:0.68rem;font-weight:800;color:#94a3b8;">▶</span>
            </div>
            <div class="cw-active-summary"></div>
            <div class="cw-trait-grid"></div>
          </div>
          ${cwBlock.caption ? `<p class="concept-widget-caption">${escHtmlSafe(cwBlock.caption)}</p>` : ''}
        `;
      }
      if (wType === 'profile_deck') {
        const items = Array.isArray(cwBlock.items) ? cwBlock.items : [];
        return `
          <div class="concept-widget-body">
            <div class="cw-deck-tabs" role="tablist" aria-label="${escAttrSafe(cwBlock.title || 'Comparison tabs')}">
              ${items
                .map(
                  (it, ii) => `
                <button type="button" role="tab" class="cw-deck-tab" data-cw-tab="${ii}" aria-selected="false">
                  ${escHtmlSafe(it.tab_label || it.title)}
                </button>
              `,
                )
                .join('')}
            </div>
            <div class="cw-deck-stage" role="tabpanel"></div>
          </div>
          ${cwBlock.caption ? `<p class="concept-widget-caption">${escHtmlSafe(cwBlock.caption)}</p>` : ''}
        `;
      }
      if (wType === 'power_seesaw') {
        const eras = Array.isArray(cwBlock.eras) ? cwBlock.eras : [];
        return `
          <div class="concept-widget-body">
            <div class="cw-deck-tabs" role="group" aria-label="${escAttrSafe(cwBlock.title || 'Chronological milestones')}">
              ${eras
                .map(
                  (er, ei) => `
                <button type="button" class="cw-deck-tab" data-cw-era="${ei}" aria-pressed="false">
                  ${escHtmlSafe(er.year)}
                </button>
              `,
                )
                .join('')}
            </div>
            <div class="cw-power-bars"></div>
            <div class="cw-active-summary" style="margin-bottom:0;"></div>
          </div>
          ${cwBlock.caption ? `<p class="concept-widget-caption">${escHtmlSafe(cwBlock.caption)}</p>` : ''}
        `;
      }
      return '';
    };

    const renderConceptWidgetHTML = (cwBlock, sIndex) => {
      if (!cwBlock || typeof cwBlock !== 'object') return '';
      const cwId = `concept-widget-${String((lesson && lesson.id) || 'lesson').replace(/[^a-zA-Z0-9_-]/g, '-')}-${sIndex}`;
      const eyebrow = cwBlock.eyebrow || 'Interactive Concept Diagram';

      window.postRenderHooks.push(() => {
        const el = document.getElementById(cwId);
        if (el) {
          bindConceptWidgetInstance(el, cwBlock, true);
        }
      });

      return `
        <div class="concept-widget-card" id="${cwId}">
          <div class="concept-widget-header">
            <div class="slide-compare-title-group">
              <span class="concept-widget-eyebrow">
                <i class="fa-solid fa-sliders"></i> ${escHtmlSafe(eyebrow)}
              </span>
              <h3 class="concept-widget-title">${escHtmlSafe(cwBlock.title || '')}</h3>
            </div>
            <button type="button" class="hotspot-whiteboard-btn cw-enlarge-btn no-print" title="Enlarge Interactive Concept Diagram for Whiteboard">
              <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
              <span>Enlarge</span>
            </button>
          </div>
          ${buildConceptWidgetBodyHTML(cwBlock)}
        </div>
      `;
    };

    const renderStopTheClockHingeHTML = (ps, afterStageNum) => {
      if (!ps || typeof ps !== 'object') return '';
      const timerSecs = Number(ps.timer_seconds) || 90;
      const altSecs = timerSecs === 60 ? 90 : 60;
      const firstSecs = Math.min(timerSecs, altSecs);
      const secondSecs = Math.max(timerSecs, altSecs);
      const promptText = ps.prompt || '';
      const ds = ps.dilemma_scale && typeof ps.dilemma_scale === 'object' ? ps.dilemma_scale : null;
      const starters = Array.isArray(ps.starters) ? ps.starters.filter(Boolean).slice(0, 2) : [];
      const connectives = Array.isArray(ps.connectives) ? ps.connectives.filter(Boolean) : [];

      return `
        <details class="oral-hinge-strip stop-the-clock-hinge no-print" id="oral-hinge-${String((lesson && lesson.id) || 'current').replace(/[^a-zA-Z0-9_-]/g, '-')}-s${afterStageNum}" data-after-stage="${afterStageNum}">
          <summary class="oral-hinge-summary">
            <div class="oral-hinge-summary-main">
              <span class="oral-hinge-badge">\uD83D\uDCAC Stop-the-Clock &middot; Turn &amp; Talk</span>
              <span class="oral-hinge-duration-chip">${timerSecs}s</span>
              <span class="oral-hinge-prompt">${typeof formatBold === 'function' ? formatBold(escHtmlSafe(promptText)) : escHtmlSafe(promptText)}</span>
            </div>
            <span class="oral-hinge-toggle">
              <span class="hinge-lbl-closed">Open Debate Scale</span>
              <span class="hinge-lbl-open">Collapse</span>
              <span class="hinge-caret">&#9662;</span>
            </span>
          </summary>
          <div class="oral-hinge-body">
            <div class="oral-hinge-toolbar">
              <div class="oral-hinge-expanded-prompt">
                ${typeof formatBold === 'function' ? formatBold(escHtmlSafe(promptText)) : escHtmlSafe(promptText)}
              </div>
              <div class="oral-hinge-timers">
                <button type="button" class="oral-hinge-timer-btn ${timerSecs === firstSecs ? 'is-primary' : ''}" data-action="start-tps-timer" data-seconds="${firstSecs}">
                  <i class="fa-regular fa-clock"></i> ${firstSecs}s
                </button>
                <button type="button" class="oral-hinge-timer-btn ${timerSecs === secondSecs ? 'is-primary' : ''}" data-action="start-tps-timer" data-seconds="${secondSecs}">
                  <i class="fa-regular fa-clock"></i> ${secondSecs}s
                </button>
              </div>
            </div>
            ${
              ds && ds.side_a && ds.side_b
                ? `
              <div class="oral-hinge-scale">
                ${ds.title ? `<div class="oral-hinge-scale-title"><i class="fa-solid fa-scale-balanced"></i> <span>${escHtmlSafe(ds.title)}</span></div>` : ''}
                <div class="oral-hinge-scale-grid">
                  <div class="oral-hinge-side side-a">
                    <div class="oral-hinge-side-hdr">
                      <strong class="oral-hinge-actor">${escHtmlSafe(ds.side_a.actor || '')}</strong>
                      ${ds.side_a.tag ? `<span class="oral-hinge-tag">${escHtmlSafe(ds.side_a.tag)}</span>` : ''}
                    </div>
                    ${
                      Array.isArray(ds.side_a.points) && ds.side_a.points.length > 0
                        ? `<ul class="oral-hinge-points">${ds.side_a.points.map((pt) => `<li>${typeof formatBold === 'function' ? formatBold(escHtmlSafe(pt)) : escHtmlSafe(pt)}</li>`).join('')}</ul>`
                        : ''
                    }
                  </div>
                  <div class="oral-hinge-side side-b">
                    <div class="oral-hinge-side-hdr">
                      <strong class="oral-hinge-actor">${escHtmlSafe(ds.side_b.actor || '')}</strong>
                      ${ds.side_b.tag ? `<span class="oral-hinge-tag">${escHtmlSafe(ds.side_b.tag)}</span>` : ''}
                    </div>
                    ${
                      Array.isArray(ds.side_b.points) && ds.side_b.points.length > 0
                        ? `<ul class="oral-hinge-points">${ds.side_b.points.map((pt) => `<li>${typeof formatBold === 'function' ? formatBold(escHtmlSafe(pt)) : escHtmlSafe(pt)}</li>`).join('')}</ul>`
                        : ''
                    }
                  </div>
                </div>
                ${ds.pivot ? `<div class="oral-hinge-pivot"><strong>Pivot:</strong> ${typeof formatBold === 'function' ? formatBold(escHtmlSafe(ds.pivot)) : escHtmlSafe(ds.pivot)}</div>` : ''}
              </div>
            `
                : ''
            }
            ${
              starters.length > 0 || connectives.length > 0
                ? `
              <div class="oral-hinge-scaffolds">
                ${
                  starters.length > 0
                    ? `
                  <div class="oral-hinge-starters">
                    <div class="oral-hinge-subhdr">Oral Sentence Stems</div>
                    <ul>
                      ${starters.map((st) => `<li>&ldquo;${typeof formatBold === 'function' ? formatBold(escHtmlSafe(st)) : escHtmlSafe(st)}&rdquo;</li>`).join('')}
                    </ul>
                  </div>
                `
                    : ''
                }
                ${
                  connectives.length > 0
                    ? `
                  <div class="oral-hinge-connectives">
                    <div class="oral-hinge-subhdr">Causal Connectives</div>
                    <div class="oral-hinge-chips">
                      ${connectives.map((c) => `<span class="oral-hinge-chip">${escHtmlSafe(c)}</span>`).join('')}
                    </div>
                  </div>
                `
                    : ''
                }
              </div>
            `
                : ''
            }
          </div>
        </details>
      `;
    };

    const renderInteractiveHotspotMapHTML = (mapBlock, mIndex, opts = {}) => {
      const isStageHook = Boolean(opts && opts.isStageHook);
      const escMapAttr = (v) =>
        String(v || '')
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      const mapId = String(
        mapBlock.id || `hotspot-map-${mIndex}${isStageHook ? '-hook' : ''}`,
      ).replace(/[^a-zA-Z0-9_-]/g, '-');
      const mapImgSrc = getAssetUrl(mapBlock.image || mapBlock.src || mapBlock.image_url || '');
      const hotspots = (Array.isArray(mapBlock.hotspots) ? mapBlock.hotspots : []).map(
        (s, sIdx) => ({
          ...s,
          id: String(s.id || `spot-${sIdx + 1}`),
          num: sIdx + 1,
          x: Number.isFinite(Number(s.x)) ? Number(s.x) : 50,
          y: Number.isFinite(Number(s.y)) ? Number(s.y) : 50,
          color: s.color || '#0284c7',
          label:
            s.label ||
            (s.title ? String(s.title).split(':')[0].trim() : `Location ${sIdx + 1}`),
          badge: s.badge || 'Historical Flashpoint',
          date: s.date || '',
          title: s.title || s.label || `Location ${sIdx + 1}`,
          details: s.details || s.description || s.summary || '',
          hinge: s.hinge || s.hinge_question || s.question || '',
          align: s.align || '',
        }),
      );
      const initialSpot = hotspots[0] || null;
      const viewportMaxH = isStageHook ? '360px' : '520px';
      const viewportMinH = isStageHook ? '200px' : '320px';
      const stageImgMaxH = isStageHook ? '340px' : '492px';

      const renderInlineIntelHtml = (spot) => {
        if (!spot) return '';
        const cleanHinge = spot.hinge
          ? String(spot.hinge)
              .replace(
                /^(?:Hinge Question|Discussion Prompt|Discussion Question|Question):\s*/i,
                '',
              )
              .trim()
          : '';
        return `
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 6px; margin-bottom: ${isStageHook ? '6px' : '8px'};">
            <div style="min-width: 0; flex: 1;">
              <div style="display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="background: ${spot.color}; color: #ffffff; font-size: 0.66rem; font-weight: 800; padding: 2px 7px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.5px;">Pin ${spot.num} &middot; ${spot.badge}</span>
                ${spot.date ? `<span style="font-size: 0.76rem; font-weight: 800; color: #fbbf24;">${spot.date}</span>` : ''}
              </div>
              <h4 style="margin: 4px 0 0 0; font-size: ${isStageHook ? '1.02rem' : '1.15rem'}; color: #ffffff; font-family: 'Playfair Display', Georgia, serif; line-height: 1.3;">${spot.title}</h4>
            </div>
          </div>
          <p style="margin: 0 ${cleanHinge ? '0 8px 0' : '0'}; font-size: ${isStageHook ? '0.88rem' : '0.95rem'}; line-height: ${isStageHook ? '1.52' : '1.6'}; color: #cbd5e1;">${spot.details}</p>
          ${cleanHinge ? `<div style="background: rgba(245, 158, 11, 0.14); border-left: 3px solid #f59e0b; padding: ${isStageHook ? '6px 10px' : '8px 12px'}; border-radius: 4px; font-size: ${isStageHook ? '0.82rem' : '0.88rem'}; color: #fde68a; line-height: 1.45;"><strong style="color: #fbbf24; font-style: normal; font-family: 'Inter', sans-serif; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; margin-right: 5px;">Hinge Question:</strong><span style="font-style: italic;">${cleanHinge}</span></div>` : ''}
        `;
      };

      let mapHtml = `
        <div class="interactive-hotspot-map-container${isStageHook ? ' stage-hook-map-card' : ''}" id="${mapId}-wrapper" style="margin: ${isStageHook ? '0' : '32px 0'}; background: #0f172a; border: 1.5px solid #334155; border-radius: ${isStageHook ? '10px' : '12px'}; padding: ${isStageHook ? '14px 16px' : '22px'}; color: #f8fafc; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.35);">
          <div class="hotspot-map-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: ${isStageHook ? '10px' : '12px'}; margin-bottom: ${isStageHook ? '12px' : '16px'}; flex-wrap: wrap; gap: 10px;">
            <div style="flex: 1 1 220px; min-width: 0;">
              <span style="display: inline-flex; align-items: center; gap: 5px; background: rgba(14, 165, 233, 0.2); border: 1px solid #0ea5e9; color: #38bdf8; padding: 2px 9px; border-radius: 4px; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                <i class="fa-solid fa-map-location-dot"></i> ${isStageHook ? 'Interactive Hook Map' : 'Interactive Primary Map'}
              </span>
              <h3 style="margin: 5px 0 0 0; font-size: ${isStageHook ? '1.12rem' : '1.35rem'}; font-family: 'Playfair Display', Georgia, serif; color: #ffffff; line-height: 1.28;">${mapBlock.title || 'Historical Map'}</h3>
              ${mapBlock.subtitle ? `<div style="font-size: ${isStageHook ? '0.77rem' : '0.85rem'}; color: #94a3b8; margin-top: 3px; line-height: 1.35;">${mapBlock.subtitle}</div>` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0; flex-wrap: wrap;">
              ${mapBlock.shelfmark ? `<span style="font-family: monospace; font-size: 0.68rem; color: #94a3b8; background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1);">${mapBlock.shelfmark}</span>` : ''}
              <button type="button" class="hotspot-whiteboard-btn no-print" id="${mapId}-whiteboard-btn" title="Open Fullscreen Classroom Whiteboard Mode">
                <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
                <span>Enlarge Whiteboard Map</span>
              </button>
            </div>
          </div>

          <!-- Map Viewport with Numbered Hotspots -->
          <div class="hotspot-map-viewport" id="${mapId}-viewport" title="Tap a numbered pin or click map to open Classroom Whiteboard Mode" style="position: relative; width: 100%; min-height: ${viewportMinH}; max-height: ${viewportMaxH}; background: #1e293b; border-radius: 8px; overflow: hidden; border: 1px solid #334155; margin-bottom: ${isStageHook ? '12px' : '16px'}; display: flex; justify-content: center; align-items: center; padding: ${isStageHook ? '10px 8px' : '14px 10px'}; cursor: zoom-in; box-sizing: border-box;">
            <div class="hotspot-map-stage" style="position: relative; display: inline-block; max-width: 100%; max-height: ${stageImgMaxH}; line-height: 0; cursor: zoom-in;">
              <img src="${mapImgSrc}" alt="${escMapAttr(mapBlock.title || 'Historical Map')}" class="archival-image hotspot-stage-img" style="max-height: ${stageImgMaxH}; max-width: 100%; width: auto; height: auto; object-fit: contain; display: block; border-radius: 6px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); user-select: none; -webkit-user-drag: none;" />
              ${hotspots
                .map((spot, sIdx) => {
                  const isFirst = sIdx === 0;
                  const isLeftAligned = spot.x > 66 || spot.align === 'left';
                  return `
                <button type="button" class="map-hotspot-pin numbered-hotspot-pin ${isFirst ? 'active-pin' : ''} ${isLeftAligned ? 'pin-align-left' : ''}" id="${mapId}-pin-${spot.id}" data-spot-id="${escMapAttr(spot.id)}" data-spot-num="${spot.num}" aria-label="Pin ${spot.num}: ${escMapAttr(spot.label)}" style="left: ${spot.x}%; top: ${spot.y}%;" title="${escMapAttr(spot.title)}">
                  <span class="pin-pulse" style="background: ${spot.color};"></span>
                  <span class="pin-marker" style="background: ${spot.color};">${spot.num}</span>
                  <span class="pin-label">${spot.label}</span>
                </button>
                `;
                })
                .join('')}
            </div>
          </div>

          <!-- Hotspot Dispatch Banner -->
          <div id="${mapId}-intel-card" class="hotspot-intel-card" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); border-left: 4px solid ${initialSpot ? initialSpot.color : '#38bdf8'}; border-radius: 8px; padding: ${isStageHook ? '12px 14px' : '16px 20px'};">
            ${renderInlineIntelHtml(initialSpot)}
          </div>

          <!-- Hotspot Buttons Row -->
          <div class="hotspot-nav-pills-row no-print" style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: ${isStageHook ? '10px' : '14px'}; justify-content: center;">
            ${hotspots
              .map((spot, sIdx) => {
                const isFirst = sIdx === 0;
                return `
              <button type="button" class="btn btn-sm ${mapId}-nav-btn hotspot-location-pill" data-spot-id="${escMapAttr(spot.id)}" style="background: ${isFirst ? spot.color : 'rgba(255,255,255,0.08)'}; color: #ffffff; border: 1px solid ${isFirst ? '#ffffff' : 'rgba(255,255,255,0.18)'}; border-radius: 20px; padding: ${isStageHook ? '3px 10px' : '4px 12px'}; font-size: ${isStageHook ? '0.71rem' : '0.74rem'}; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s ease;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; background: ${spot.color}; color: #fff; font-size: 0.64rem; font-weight: 900; border: 1px solid rgba(255,255,255,0.75); flex-shrink: 0;">${spot.num}</span>
                <span>${spot.label}</span>
              </button>
              `;
              })
              .join('')}
          </div>
        </div>
      `;

      window.postRenderHooks.push(() => {
        if (!document.getElementById('crummack-interactive-styles')) {
          initCrummackInteractiveFeatures();
        }
        const container = document.getElementById(`${mapId}-wrapper`);
        if (!container) return;
        const pins = container.querySelectorAll('.map-hotspot-pin');
        const navBtns = container.querySelectorAll(`.${mapId}-nav-btn`);
        const card = document.getElementById(`${mapId}-intel-card`);
        const wbBtn = document.getElementById(`${mapId}-whiteboard-btn`);
        const viewportEl = document.getElementById(`${mapId}-viewport`);

        const spotMap = {};
        hotspots.forEach((s) => {
          spotMap[s.id] = s;
        });

        let activeSpotId = initialSpot ? initialSpot.id : null;
        const exploredIds = new Set(activeSpotId ? [activeSpotId] : []);

        function selectSpot(spotId) {
          const spot = spotMap[spotId];
          if (!spot || !card) return;
          activeSpotId = spotId;
          exploredIds.add(spotId);

          pins.forEach((p) => p.classList.toggle('active-pin', p.dataset.spotId === spotId));
          navBtns.forEach((b) => {
            const active = b.dataset.spotId === spotId;
            const bSpot = spotMap[b.dataset.spotId];
            b.style.background = active
              ? (bSpot ? bSpot.color : spot.color)
              : 'rgba(255,255,255,0.08)';
            b.style.borderColor = active ? '#ffffff' : 'rgba(255,255,255,0.18)';
          });

          card.style.borderLeftColor = spot.color || '#38bdf8';
          card.innerHTML = renderInlineIntelHtml(spot);
        }

        const launchWhiteboard = () => {
          openHotspotWhiteboardModal(
            {
              ...mapBlock,
              id: mapId,
              imageUrl: mapImgSrc,
              hotspots,
            },
            {
              getActiveSpotId: () => activeSpotId,
              getExploredIds: () => exploredIds,
              onSelectSpot: (spotId) => selectSpot(spotId),
            },
          );
        };

        pins.forEach((p) => {
          p.addEventListener('click', (e) => {
            e.stopPropagation();
            selectSpot(p.dataset.spotId);
          });
        });
        navBtns.forEach((b) => {
          b.addEventListener('click', () => selectSpot(b.dataset.spotId));
        });
        if (wbBtn) {
          wbBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            launchWhiteboard();
          });
        }
        if (viewportEl) {
          viewportEl.addEventListener('click', (e) => {
            if (e.target.closest('.map-hotspot-pin')) return;
            launchWhiteboard();
          });
        }
      });

      return mapHtml;
    };

    const renderPhotoSliderHTML = (sliderBlock) => {
      const sliderId = 'slider-' + Math.random().toString(36).substr(2, 9);
      const hasSat = !!sliderBlock.satellite_image;
      const isCollapsible = !!sliderBlock.collapsible;

      let sliderHtml = `
          <div class="photo-slider-container" id="${sliderId}-container" style="margin: ${isCollapsible ? '16px 0 8px 0' : '32px 0'}; background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 24px; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 6px;">
              <span class="archival-meta-tag" style="background: #e0e7ff; color: #3730a3; padding: 3px 10px; border-radius: 4px; font-weight: 700; font-size: 0.72rem; letter-spacing: 0.05em; text-transform: uppercase;">${sliderBlock.tag || 'Cartographic Analysis'}</span>
            </div>
            <h3 style="margin: 6px 0 10px 0; color: #0f172a; font-family: 'Playfair Display', Georgia, serif; font-size: 1.45rem;">
              <i class="fa-solid fa-map-location-dot" style="margin-right: 8px; color: #1e3a8a;"></i> ${sliderBlock.title || 'Then & Now: Map Slider'}
            </h3>
            ${sliderBlock.description ? `<p style="font-size: 0.92rem; color: #475569; margin: 0 auto 16px auto; max-width: 760px; line-height: 1.5;">${sliderBlock.description}</p>` : ''}
            
            ${hasSat
          ? `
            <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 14px;">
              <button type="button" class="btn btn-sm" id="${sliderId}-btn-street" onclick="
                const container = document.getElementById('${sliderId}-container');
                const baseImg = container.querySelector('.slider-base-img');
                baseImg.src = '${getAssetUrl(sliderBlock.after_image)}';
                container.querySelector('#${sliderId}-after-text').innerHTML = '${sliderBlock.after_label || 'Modern Street Map'} <i class=\\'fa-solid fa-arrow-right\\' style=\\'margin-left: 4px;\\'></i>';
                this.style.background = '#1e3a8a'; this.style.color = '#fff';
                document.getElementById('${sliderId}-btn-sat').style.background = '#f1f5f9';
                document.getElementById('${sliderId}-btn-sat').style.color = '#475569';
              " style="padding: 6px 14px; font-size: 0.82rem; font-weight: 700; border-radius: 6px; background: #1e3a8a; color: #ffffff; border: 1px solid #1e3a8a; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;">
                <i class="fa-solid fa-road"></i> Modern Street Map
              </button>
              <button type="button" class="btn btn-sm" id="${sliderId}-btn-sat" onclick="
                const container = document.getElementById('${sliderId}-container');
                const baseImg = container.querySelector('.slider-base-img');
                baseImg.src = '${getAssetUrl(sliderBlock.satellite_image)}';
                container.querySelector('#${sliderId}-after-text').innerHTML = '${sliderBlock.satellite_label || 'Modern Satellite Aerial'} <i class=\\'fa-solid fa-arrow-right\\' style=\\'margin-left: 4px;\\'></i>';
                this.style.background = '#1e3a8a'; this.style.color = '#fff';
                document.getElementById('${sliderId}-btn-street').style.background = '#f1f5f9';
                document.getElementById('${sliderId}-btn-street').style.color = '#475569';
              " style="padding: 6px 14px; font-size: 0.82rem; font-weight: 700; border-radius: 6px; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;">
                <i class="fa-solid fa-satellite"></i> Satellite Aerial Photo
              </button>
            </div>`
          : ''
        }

            <!-- Viewport -->
            <div style="position: relative; width: 100%; max-width: 720px; aspect-ratio: ${sliderBlock.aspect_ratio || '1 / 1'}; margin: 0 auto; overflow: hidden; border-radius: 10px; border: 2px solid #94a3b8; background: #0f172a; box-shadow: 0 4px 14px rgba(0,0,0,0.18); user-select: none;">
              <!-- After (Base) Image -->
              <img class="slider-base-img" src="${getAssetUrl(sliderBlock.after_image)}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: ${sliderBlock.object_fit || 'cover'}; pointer-events: none;" alt="${sliderBlock.after_label || 'After'}">
              
              <!-- Before (Top) Image clipped -->
              <img class="slider-before-img" src="${getAssetUrl(sliderBlock.before_image)}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: ${sliderBlock.object_fit || 'cover'}; pointer-events: none; clip-path: inset(0 50% 0 0); -webkit-clip-path: inset(0 50% 0 0);" alt="${sliderBlock.before_label || 'Before'}">
              
              <!-- Center Divider Line -->
              <div class="slider-divider" style="position: absolute; top: 0; bottom: 0; left: 50%; width: 3px; background: #2563eb; box-shadow: 0 0 10px rgba(0,0,0,0.6); pointer-events: none; z-index: 2;"></div>

              <!-- Slider Handle Visual -->
              <div class="slider-handle" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 44px; height: 44px; background: #ffffff; border: 2.5px solid #2563eb; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 3px 12px rgba(0,0,0,0.45); pointer-events: none; z-index: 3;">
                <i class="fa-solid fa-arrows-left-right" style="color: #2563eb; font-size: 15px;"></i>
              </div>

              <!-- Invisible Range Input covering entire viewport -->
              <input type="range" min="0" max="100" value="50" class="photo-range-slider" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: ew-resize; z-index: 4; margin: 0; padding: 0;" oninput="
                const p = this.parentElement;
                const before = p.querySelector('.slider-before-img');
                const div = p.querySelector('.slider-divider');
                const h = p.querySelector('.slider-handle');
                const v = this.value;
                before.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
                before.style.webkitClipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
                div.style.left = v + '%';
                h.style.left = v + '%';
              ">
            </div>

            <!-- Labels Bar -->
            <div style="display: flex; justify-content: space-between; max-width: 720px; margin: 12px auto 0 auto; color: #1e293b; font-size: 0.88rem; font-weight: 700;">
              <span style="color: #1e3a8a;"><i class="fa-solid fa-arrow-left" style="margin-right: 4px;"></i> ${sliderBlock.before_label || 'Before'}</span>
              <span id="${sliderId}-after-text" style="color: #0f172a;">${sliderBlock.after_label || 'After'} <i class="fa-solid fa-arrow-right" style="margin-left: 4px;"></i></span>
            </div>

            ${sliderBlock.links && sliderBlock.links.length
          ? `
            <div style="margin-top: 16px; padding-top: 14px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
              ${sliderBlock.links
            .map(
              (l) => `
                <a href="${l.url}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 600; color: #1e3a8a; background: #eff6ff; border: 1px solid #bfdbfe; padding: 6px 12px; border-radius: 6px; text-decoration: none; transition: all 0.15s ease;" onmouseover="this.style.background='#dbeafe';" onmouseout="this.style.background='#eff6ff';">
                  <i class="${l.icon || 'fa-solid fa-arrow-up-right-from-square'}"></i> ${l.label}
                </a>
              `,
            )
            .join('')}
            </div>`
          : ''
        }
          </div>
      `;

      if (isCollapsible) {
        return `
          <details class="local-study-accordion" style="margin: 24px 0; background: #ffffff; border: 1.5px solid #cbd5e1; border-left: 4px solid #16a34a; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); overflow: hidden;">
            <summary style="padding: 14px 20px; font-weight: 700; color: #166534; cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none; background: #f0fdf4;">
              <span style="display: flex; align-items: center; gap: 10px; font-size: 0.98rem; text-transform: uppercase; letter-spacing: 0.5px;">
                <i class="fa-solid fa-location-dot" style="color: #16a34a;"></i> ${sliderBlock.accordion_title || 'Local Fieldwork Study &bull; Interactive Cartography'}
              </span>
              <span style="font-size: 0.82rem; font-weight: 600; color: #15803d; display: inline-flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-map"></i> View Map &amp; Links <i class="fa-solid fa-chevron-down"></i>
              </span>
            </summary>
            <div style="padding: 8px 16px 16px 16px;">
              ${sliderHtml}
            </div>
          </details>
        `;
      }
      return sliderHtml;
    };

    const renderedSourceKeys = new Set();
    let sequentialSourceCounter = 0;
    const getSourceMatchKeys = (src) => {
      if (!src) return [];
      const keys = [];
      if (src.id) keys.push(`id:${String(src.id).trim().toLowerCase()}`);
      if (src.letter) keys.push(`letter:${String(src.letter).trim().toUpperCase()}`);
      const tMatch = String(src.title || '').match(/(?:Source|Map|Diagram)\s+([A-Z0-9]+)/i);
      if (tMatch) keys.push(`letter:${tMatch[1].toUpperCase()}`);
      const imgKey = src.image || src.src || src.source;
      if (imgKey) keys.push(`img:${String(imgKey).split('/').pop().toLowerCase()}`);
      if (src.title) keys.push(`title:${String(src.title).trim().toLowerCase()}`);
      return keys;
    };

    lesson.narrative_blocks.forEach((block, index) => {
      if (block.type === 'interactive_hotspot_map') {
        htmlNarrative += renderInteractiveHotspotMapHTML(block, index);
        return;
      }

      if (block.type === 'causal_diagram') {
        htmlNarrative += `
          <div class="causal-diagram-container" style="margin: 35px 0; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 12px; padding: 25px; color: #f8fafc; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.25); border: 1px solid #334155;">
            <div style="text-align: center; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
              <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(14, 165, 233, 0.2); border: 1px solid #0ea5e9; color: #38bdf8; padding: 4px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                <i class="fa-solid fa-code-fork"></i> Interactive Causal Convergence
              </div>
              <h3 style="margin: 0; font-size: 1.5rem; font-family: 'Playfair Display', serif; color: #ffffff;">${block.title}</h3>
              <p style="margin: 8px auto 0 auto; max-width: 650px; font-size: 0.95rem; color: #94a3b8; font-style: italic;">"${block.lead}"</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 25px;">
              ${block.branches
            .map(
              (b) => `
                <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-top: 4px solid ${b.color}; border-radius: 8px; padding: 14px; display: flex; flex-direction: column;">
                  <div style="font-weight: 700; font-size: 0.9rem; color: ${b.color}; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">${b.category}</div>
                  <ul style="margin: 0; padding-left: 18px; font-size: 0.84rem; line-height: 1.5; color: #cbd5e1; flex-grow: 1;">
                    ${b.steps.map((s) => `<li style="margin-bottom: 8px;">${s}</li>`).join('')}
                  </ul>
                  <div style="text-align: center; margin-top: 10px; color: ${b.color}; font-size: 1.1rem;">
                    <i class="fa-solid fa-arrow-down"></i>
                  </div>
                </div>
              `,
            )
            .join('')}
            </div>

            <div style="background: rgba(2, 132, 199, 0.15); border: 2px solid #0284c7; border-radius: 10px; padding: 18px 24px; text-align: center; max-width: 700px; margin: 0 auto; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.2);">
              <div style="font-size: 0.8rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Point of Causal Convergence &bull; ${block.convergence.date}</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #ffffff; margin-bottom: 6px; font-family: 'Playfair Display', serif;">${block.convergence.title}</div>
              <p style="margin: 0; font-size: 0.92rem; line-height: 1.5; color: #e2e8f0;">${block.convergence.desc}</p>
            </div>
          </div>
        `;
        return;
      }

      if (block.type === 'interactive_map') {
        htmlNarrative += `
            <div class="interactive-map-container" style="margin: 30px 0; background: #f8fafc; border: 2px solid #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <h3 style="margin-top: 0; color: #1e293b; font-family: 'Playfair Display', serif;"><i class="fa-solid fa-compass" style="color: #1e3a8a; margin-right: 8px;"></i> ${block.title || 'Interactive Historical Map & Eyewitness Record'}</h3>
              <div class="map-img-wrapper" style="position: relative; height: 500px; width: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden; margin-bottom: 20px; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0;">
          `;

        block.maps.forEach((m, idx) => {
          htmlNarrative += `<img src="${getAssetUrl(m.src)}" id="map-img-${m.id}" data-action="open-modal" data-src="${getAssetUrl(m.src)}" alt="${m.label}" style="position: absolute; max-width: 100%; max-height: 100%; object-fit: contain; opacity: ${idx === 0 ? '1' : '0'}; pointer-events: ${idx === 0 ? 'auto' : 'none'}; transition: opacity 0.6s ease-in-out; border-radius: 6px; cursor: zoom-in;" title="Click to enlarge map">`;
        });

        htmlNarrative += `
              </div>
              <div id="map-caption-display" style="font-size: 1.1rem; font-style: italic; color: #334155; min-height: 3em; margin-bottom: 20px;">${block.maps[0].caption}</div>
              <div class="map-controls" style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
          `;

        block.maps.forEach((m, idx) => {
          const activeClass = idx === 0 ? 'active-map-btn' : '';
          const activeStyle =
            idx === 0
              ? 'background-color: #1e40af; color: #ffffff; border: 1px solid #1e40af;'
              : 'background-color: #f1f5f9; color: #334155; border: 1px solid #cbd5e1;';
          htmlNarrative += `
                <button class="btn btn-secondary map-toggle-btn ${activeClass}" data-map-id="${m.id}" data-caption="${m.caption.replace(/"/g, '&quot;')}" data-action="toggle-map" style="border-radius: 30px; padding: 8px 18px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; ${activeStyle}">
                  ${m.year} ${m.label}
                </button>
            `;
        });

        htmlNarrative += `
              </div>
            </div>
          `;
        return;
      }

      if (block.type === 'photo_slider') {
        htmlNarrative += renderPhotoSliderHTML(block);
        return;
      }

      if (block.type === 'flip_card_gallery') {
        const searchId = 'search-cards-' + Math.random().toString(36).substr(2, 9);

        htmlNarrative += `
            <div class="flip-card-gallery-wrapper" style="margin: 40px 0; background: #1e293b; border: 2px solid #0f172a; border-radius: 12px; padding: 25px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);">
              <h3 style="margin-top: 0; color: #f8fafc; font-family: 'Playfair Display', serif; text-align: center; border-bottom: 1px solid #475569; padding-bottom: 15px; margin-bottom: 20px;">
                <i class="fa-solid fa-users-viewfinder"></i> The Fallen
              </h3>
              ${block.cards && block.cards.length > 10
            ? `
              <div style="text-align: center; margin-bottom: 30px;">
                <input type="text" id="${searchId}" placeholder="Search names..." onkeyup="
                  const filter = this.value.toUpperCase();
                  const gallery = this.parentElement.nextElementSibling;
                  const cards = gallery.getElementsByClassName('flip-card-wrapper');
                  for (let i = 0; i < cards.length; i++) {
                    const name = cards[i].getAttribute('data-name');
                    if (name.toUpperCase().indexOf(filter) > -1) {
                      cards[i].style.display = '';
                    } else {
                      cards[i].style.display = 'none';
                    }
                  }
                " style="padding: 12px 20px; width: 80%; max-width: 400px; border-radius: 25px; border: 1px solid #334155; background: #0f172a; color: white; outline: none; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
              </div>`
            : ''
          }
              
              <div class="flip-card-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px;">
          `;

        if (block.cards && Array.isArray(block.cards)) {
          block.cards.forEach((card) => {
            htmlNarrative += `
                <div class="flip-card-wrapper" data-name="${card.name.replace(/"/g, '&quot;')}" style="background-color: transparent; height: 350px; perspective: 1000px; cursor: pointer;" data-action="flip-card">
                  <div class="flip-card-inner" style="position: relative; width: 100%; height: 100%; text-align: center; transition: transform 0.8s; transform-style: preserve-3d;">
                    
                    <!-- Front of card -->
                    <div class="flip-card-front" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background-color: #334155; color: white; border-radius: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.4); border: 1px solid #475569;">
                      <h4 style="margin: 0 0 15px 0; font-size: 1.4rem; font-family: 'Playfair Display', serif; color: #f8fafc; border-bottom: 2px solid #1e293b; padding-bottom: 10px; width: 100%;">${card.name}</h4>
                      <p style="font-size: 1.05rem; font-style: italic; color: #cbd5e1; margin: 0;">${card.background}</p>
                      <div style="margin-top: auto; color: #94a3b8; font-size: 0.85rem;"><i class="fa-solid fa-hand-pointer"></i> Tap to flip</div>
                    </div>
                    
                    <!-- Back of card -->
                    <div class="flip-card-back" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background-color: #0f172a; color: white; transform: rotateY(180deg); border-radius: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 2px solid #065f46; overflow-y: auto;">
                      <i class="fa-solid fa-cross" style="color: #059669; font-size: 2rem; margin-bottom: 15px;"></i>
                      <p style="font-size: 1rem; line-height: 1.5; color: #e2e8f0; margin: 0;">${card.story}</p>
                    </div>
                    
                  </div>
                </div>
              `;
          });
        }

        htmlNarrative += `
              </div>
            </div>
          `;
        return;
      }

      const bg = index % 2 === 0 ? '#ffffff' : '#f0f9ff';

      const rawKiText = block.text || block.content || '';
      if (
        typeof rawKiText === 'string' &&
        rawKiText.match(/^\[Key (?:Individual|Organisation|Organization):\s*(.+)\]$/i)
      ) {
        const kiMatch = rawKiText.match(
          /^\[Key (?:Individual|Organisation|Organization):\s*(.+)\]$/i,
        );
        const personName = kiMatch[1].trim();
        let person = null;
        if (window.db && window.currentUnitId) {
          const unitDb = window.db[window.currentUnitId];
          person = unitDb.data?.key_individuals?.find((p) =>
            p.name.toLowerCase().includes(personName.toLowerCase()),
          );
          if (!person)
            person = unitDb.biographies?.find((p) =>
              p.name.toLowerCase().includes(personName.toLowerCase()),
            );
        }
        if (
          !person &&
          typeof appStore !== 'undefined' &&
          appStore?.state?.activeUnitData?.key_individuals
        ) {
          person = appStore.state.activeUnitData.key_individuals.find((p) =>
            p.name.toLowerCase().includes(personName.toLowerCase()),
          );
        }
        if (person) {
          const cardHtml = generateKeyIndividualEmbedHTML
            ? generateKeyIndividualEmbedHTML(person)
            : `<div>${person.name}</div>`;
          htmlNarrative += `
               <div class="key-individual-embed" style="margin: 6px 0;">
                 ${cardHtml}
               </div>
             `;
          if (block.tasks && block.tasks.length > 0) {
            htmlNarrative += `<div class="embedded-tasks-container" style="margin-bottom: 25px; padding: 15px; background: #fffbeb; border: 2px dashed #fcd34d; border-radius: 6px;">`;
            block.tasks.forEach((task, tIdx) => {
              if (task.type === 'source_utility' || task.taskType === 'source_utility') {
                htmlNarrative += renderSourceUtilityTaskHTML(
                  task,
                  index,
                  task.qNum || tIdx,
                  unitId,
                );
                return;
              }
              if (
                task.type === 'historical_interpretations' ||
                task.taskType === 'historical_interpretations'
              ) {
                htmlNarrative += renderHistoricalInterpretationsTaskHTML(
                  task,
                  index,
                  task.qNum || tIdx,
                  unitId,
                );
                return;
              }
              if (task.type === 'two_sided_argument') {
                const qNumPrefix = task.qNum ? `Q${task.qNum}. ` : '';
                const adv = task.advancement || {};
                const lim = task.limitations || {};
                const advTitle = adv.title || 'Advancement & Progress (Change)';
                const limTitle = lim.title || 'Critical Limitations & Stagnation (Continuity)';
                const advPoints = adv.points || [];
                const limPoints = lim.points || [];
                const advStarter = adv.starter || adv.sentence_starter || '';
                const limStarter = lim.starter || lim.sentence_starter || '';
                const synthesisPrompt =
                  task.synthesis_prompt ||
                  (isKs3
                    ? 'Write a balanced analytical paragraph evaluating both sides.'
                    : isKs2
                      ? 'Write your historian explanation evaluating both sides.'
                      : 'Write a balanced GCSE exam paragraph evaluating both sides.');
                const connectives = task.synthesis_connectives || [
                  'Although...',
                  'However, in practical terms...',
                  'Consequently...',
                  'Overall...',
                ];
                const modelAnswer =
              task.model_answer || task.model || task.exemplar || task.wagoll || task.answer || '';

                htmlNarrative += `
                  <div class="task-box two-sided-argument-interactive" style="margin-bottom: 16px; background: #ffffff; padding: 16px; border-radius: 8px; border: 2px solid #0f766e; box-shadow: 0 3px 10px rgba(15, 118, 110, 0.08);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #ccfbf1; padding-bottom: 8px;">
                      <h4 style="margin: 0; color: #0f766e; font-size: 1.1rem;"><i class="fa-solid fa-scale-balanced" style="margin-right: 8px;"></i> ${qNumPrefix}${task.topic || task.text || 'Two-Sided Argument Analysis'}</h4>
                      <span style="background: #0f766e; color: #ffffff; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">${isKs3 ? 'KS3 Two-Sided Argument' : isKs2 ? 'Historian Argument' : 'GCSE Two-Sided Argument'}</span>
                    </div>
                    ${task.instruction ? `<p style="font-size: 0.95rem; color: #475569; font-style: italic; margin-top: 0; margin-bottom: 14px;">${task.instruction}</p>` : ''}
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-bottom: 14px;">
                      <!-- Side 1: Advancement / Progress -->
                      <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 6px; padding: 12px;">
                        <h5 style="margin: 0 0 8px 0; color: #166534; font-size: 0.95rem; border-bottom: 1.5px solid #86efac; padding-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                          <i class="fa-solid fa-arrow-trend-up"></i> ${advTitle}
                        </h5>
                        <ul style="margin: 0 0 10px 0; padding-left: 16px; color: #1e293b; font-size: 0.88rem; line-height: 1.45;">
                          ${advPoints.map((pt) => `<li style="margin-bottom: 5px;">${pt}</li>`).join('')}
                        </ul>
                        ${advStarter ? `<div style="padding: 6px 8px; background: #ffffff; border-left: 3px solid #22c55e; border-radius: 4px; font-size: 0.82rem; color: #15803d; font-style: italic;"><strong>Evidence Stem:</strong> &ldquo;${advStarter}&rdquo;</div>` : ''}
                      </div>

                      <!-- Side 2: Limitations / Continuity -->
                      <div style="background: #fff1f2; border: 1.5px solid #fecdd3; border-radius: 6px; padding: 12px;">
                        <h5 style="margin: 0 0 8px 0; color: #9f1239; font-size: 0.95rem; border-bottom: 1.5px solid #fecdd3; padding-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                          <i class="fa-solid fa-hand"></i> ${limTitle}
                        </h5>
                        <ul style="margin: 0 0 10px 0; padding-left: 16px; color: #1e293b; font-size: 0.88rem; line-height: 1.45;">
                          ${limPoints.map((pt) => `<li style="margin-bottom: 5px;">${pt}</li>`).join('')}
                        </ul>
                        ${limStarter ? `<div style="padding: 6px 8px; background: #ffffff; border-left: 3px solid #f43f5e; border-radius: 4px; font-size: 0.82rem; color: #be123c; font-style: italic;"><strong>Counter-Stem:</strong> &ldquo;${limStarter}&rdquo;</div>` : ''}
                      </div>
                    </div>

                    <!-- Synthesis: Paragraph Builder -->
                    <div style="background: #fffbeb; border: 1.5px solid #fcd34d; border-radius: 6px; padding: 12px;">
                      <h5 style="margin: 0 0 6px 0; color: #92400e; font-size: 0.95rem; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-pen-nib"></i> ${isKs3 ? 'Paragraph Builder: Evaluative Synthesis' : isKs2 ? 'Historian Paragraph Builder' : 'GCSE Paragraph Builder: Evaluative Synthesis'}
                      </h5>
                      <p style="font-size: 0.9rem; color: #78350f; font-weight: 600; margin: 0 0 8px 0;">${synthesisPrompt}</p>
                      
                      <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; align-items: center;">
                        <span style="font-size: 0.75rem; font-weight: 700; color: #92400e; text-transform: uppercase;">Connectives:</span>
                        ${connectives.map((c) => `<span style="background: #ffffff; border: 1px solid #fde68a; color: #b45309; padding: 2px 7px; border-radius: 10px; font-size: 0.78rem; font-weight: 600;">${c}</span>`).join('')}
                      </div>

                      <textarea class="interactive-textarea" style="width: 100%; box-sizing: border-box; min-height: 80px; padding: 8px; border: 1px solid #fde68a; border-radius: 5px; font-size: 0.9rem; font-family: inherit; resize: vertical;" placeholder="${isKs3 ? 'Combine the evidence and counter-evidence above to write your complex, balanced analytical paragraph...' : isKs2 ? 'Write your historian answer using the evidence above...' : 'Combine the evidence and counter-evidence above to write your complex, balanced GCSE exam paragraph...'}"></textarea>

                      ${modelAnswer
                    ? `
                        <details style="margin-top: 8px;">
                          <summary style="cursor: pointer; color: #b45309; font-weight: 600; font-size: 0.85rem;"><i class="fa-solid fa-eye"></i> View Level 4 Model Paragraph</summary>
                          <div class="scaffold-box model-box" style="margin-top: 6px; padding: 10px 12px; background: #ffffff; border-left: 3px solid #f59e0b; border-radius: 4px; font-size: 0.9rem; color: #78350f; line-height: 1.5;">
                            ${modelAnswer}
                          </div>
                        </details>
                      `
                    : ''
                  }
                    </div>
                  </div>
                `;
                return;
              }

              const qNumPrefix = task.qNum ? `Q${task.qNum}. ` : '';
              const taskPrompt =
                task.text || task.question || task.instructions || task.prompt || '';
              const cleanTaskText = taskPrompt.replace(/^Q\d+[\.\:]\s*/i, '');
              const taskTitle =
                task.title && task.title !== taskPrompt && !cleanTaskText.startsWith(task.title)
                  ? task.title
                  : '';
              const titleHtml = taskTitle
                ? `<div style="font-weight: 800; font-size: 0.88rem; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">${taskTitle}</div>`
                : '';
              const taskStarter =
                task.starter ||
                task.sentence_starter ||
                (task.scaffolding &&
                  (task.scaffolding.starter || task.scaffolding.sentence_starter));
              const taskModel = task.model || task.model_answer || task.answer;
              htmlNarrative += `
                <div class="task-box" style="margin-bottom: 12px; background: white; padding: 12px 15px; border-radius: 6px; border: 1px solid #fde68a;">
                  ${titleHtml}
                  <strong style="color: #92400e; font-size: 1.05rem;">${qNumPrefix}${cleanTaskText}</strong>
                  ${taskStarter ? `<details style="margin-top: 8px;"><summary style="cursor: pointer; color: #0284c7; font-weight: 600; font-size: 0.9rem;"><i class="fa-solid fa-pen"></i> Sentence Starter</summary><div class="scaffold-box starter-box" style="margin-top: 8px; padding: 10px; background: #f0f9ff; border-left: 3px solid #0284c7; border-radius: 4px; font-size: 0.95rem; color: #0c4a6e; font-style: italic;">${taskStarter}</div></details>` : ''}
                  ${taskModel ? `<details style="margin-top: 8px;"><summary style="cursor: pointer; color: #b45309; font-weight: 600; font-size: 0.9rem;"><i class="fa-solid fa-eye"></i> View Model Answer</summary><div class="scaffold-box model-box" style="margin-top: 8px; padding: 10px; background: #fef3c7; border-left: 3px solid #b45309; border-radius: 4px; font-size: 0.95rem; color: #78350f;">${taskModel}</div></details>` : ''}
                </div>
              `;
            });
            htmlNarrative += `</div>`;
          }
          if (block.hinge_question) {
            const hingeId = `hinge-${index}`;
            const hingeQuestionText = block.hinge_question.text || block.hinge_question.question;
            const correctIndex =
              block.hinge_question.correct_index !== undefined
                ? block.hinge_question.correct_index
                : block.hinge_question.answer;
            htmlNarrative += `
                <div class="hinge-question-container no-print" style="margin-bottom: 25px; margin-top: -5px;">
                  <button class="btn btn-secondary" id="btn-${hingeId}" data-action="reveal-hinge" data-target="${hingeId}" style="background: #0ea5e9; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: background 0.2s;"><i class="fa-solid fa-person-circle-question" style="margin-right: 6px;"></i> Reveal Discussion Prompt</button>
                  <div id="${hingeId}" style="display: none; background: #f0f9ff; border: 2px solid #38bdf8; padding: 15px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div style="color: #0284c7; font-weight: bold; font-size: 0.9rem; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-circle-question"></i> Interactive Discussion Question</div>
                    <div style="color: #0f172a; font-size: 1.1rem; font-weight: bold; margin-bottom: 15px;">"${hingeQuestionText}"</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                      ${block.hinge_question.options
                .map(
                  (opt, i) => `
                        <button data-action="hinge-mcq-select" data-correct="${correctIndex}" data-index="${i}" style="text-align: left; background: white; border: 1px solid #bae6fd; padding: 12px 15px; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-size: 1rem; color: #334155;">
                          <strong>${String.fromCharCode(65 + i)}:</strong> ${opt}
                        </button>
                      `,
                )
                .join('')}
                    </div>
                    <div style="display: none; margin-top: 15px; padding: 12px; background: #dcfce7; border-left: 4px solid #22c55e; color: #166534; font-size: 1rem; border-radius: 0 6px 6px 0;">
                      <strong>Explanation:</strong> ${block.hinge_question.explanation}
                    </div>
                  </div>
                </div>
              `;
          }
          return;
        }
      }

      const blockText = block.text || block.content || '';
      const isQuote = typeof blockText === 'string' && blockText.startsWith('"');

      // Decimal reference and paragraph number resolution
      const rawTextForMatch = block.text || block.content || '';
      const paraMatch = rawTextForMatch.match(/\[\s*(\d+\.\d+)\s*\]/);
      let decimalRef = '';
      if (paraMatch) {
        decimalRef = paraMatch[1];
      } else {
        let lNum = 1;
        if (lesson && lesson.id && lesson.id.startsWith('lesson_')) {
          const parsed = parseInt(lesson.id.split('_')[1], 10);
          if (!isNaN(parsed)) lNum = parsed;
        } else if (lesson && typeof lesson.lesson_number === 'number') {
          lNum = lesson.lesson_number;
        }
        decimalRef = `${lNum}.${index + 1}`;
      }

      const showParaNumber = Boolean(
        rawTextForMatch &&
        rawTextForMatch.trim() &&
        !(typeof rawTextForMatch === 'string' && rawTextForMatch.includes('side-quest-box')) &&
        !(block.title && block.title.toLowerCase().includes('lesson reflection')),
      );

      // Unified Stage 1–5 Architecture: Strip legacy [X.Y] / para-ref decimals so App, Textbook & Workbook all align on Stage 1–5
      const formatParagraphPills = (str) => {
        if (!str || typeof str !== 'string') return str;
        // 1. Strip <span class="para-ref">[3.1]</span> while preserving an invisible anchor for deep links
        str = str.replace(
          /<span\s+class=["']para-ref["']>\s*\[?\s*([\d\.]+)\s*\]?\s*<\/span>\s*/gi,
          (match, num) => `<span id="para-${num.replace('.', '-')}" data-para="${num}" style="display:none;"></span>`,
        );
        // 2. Strip raw [X.Y] bracket numbers at the start of paragraphs/tags
        str = str.replace(
          /(^|>|\s)\[\s*(\d+\.\d+)\s*\]\s*/g,
          (match, prefix, num) => `${prefix}<span id="para-${num.replace('.', '-')}" data-para="${num}" style="display:none;"></span>`,
        );
        return str;
      };

      let themeHeadingHtml = '';
      const rawHeading = block.theme_heading || block.theme || block.title;

      const stagesList =
        (lesson &&
          lesson.causal_domino_spine &&
          Array.isArray(lesson.causal_domino_spine.stages) &&
          lesson.causal_domino_spine.stages) ||
        [];

      // Prefer canonical 1:1 index alignment when stages count matches narrative blocks count
      let matchedStage = null;
      if (stagesList.length === (lesson?.narrative_blocks?.length || 0)) {
        matchedStage = stagesList[index] || null;
      } else if (decimalRef) {
        matchedStage =
          stagesList.find(
            (s) =>
              (s.para_ref &&
                (s.para_ref === decimalRef ||
                  s.para_ref === `[${decimalRef}]` ||
                  s.para_ref.includes(`[${decimalRef}]`))) ||
              (s.paraRef &&
                (s.paraRef === decimalRef ||
                  s.paraRef === `[${decimalRef}]` ||
                  s.paraRef.includes(`[${decimalRef}]`))),
          ) ||
          stagesList[index] ||
          null;
      } else {
        matchedStage = stagesList[index] || null;
      }

      // Synchronize 1:1 with lesson.workbook_stages for pupil workbook alignment
      const wbStagesList =
        (lesson &&
          lesson.workbook_stages &&
          Array.isArray(lesson.workbook_stages) &&
          lesson.workbook_stages) ||
        [];

      let matchedWbStage = null;
      if (wbStagesList.length === (lesson?.narrative_blocks?.length || 0)) {
        matchedWbStage = wbStagesList[index] || null;
      } else if (decimalRef) {
        matchedWbStage =
          wbStagesList.find(
            (s) =>
              (s.para_ref &&
                (s.para_ref === decimalRef ||
                  s.para_ref === `[${decimalRef}]` ||
                  s.para_ref.includes(`[${decimalRef}]`))) ||
              (s.paraRef &&
                (s.paraRef === decimalRef ||
                  s.paraRef === `[${decimalRef}]` ||
                  s.paraRef.includes(`[${decimalRef}]`))) ||
              (s.step && s.step === index + 1),
          ) ||
          wbStagesList[index] ||
          null;
      } else {
        matchedWbStage = wbStagesList[index] || null;
      }

      // Unified Narrative Annotation Engine (App-Wide: Dossier Pills + Lesson-Scoped Vocab + Balanced Bolding)
      let contentStr = narrativeAnnotator.annotateBlock(blockText, {
        wbStage: matchedWbStage,
        isQuote,
        isExtension: false,
      });
      contentStr = contentStr.replace(
        /src=["'](\.\/)?assets\//g,
        'src="/units/' + window.currentUnitId + '/assets/',
      );
      contentStr = formatParagraphPills(contentStr);
      let styledContent = contentStr;

      let l4StyledContent = '';
      if (block.level_4) {
        let l4ContentStr = narrativeAnnotator.annotateBlock(block.level_4, {
          wbStage: matchedWbStage,
          isQuote,
          isExtension: true,
        });
        l4ContentStr = formatParagraphPills(l4ContentStr);
        l4StyledContent = l4ContentStr;
      }

      let stageDateVal = (matchedStage && matchedStage.date) || (matchedWbStage && (matchedWbStage.date || matchedWbStage.dates)) || '';
      const stageObj = matchedStage;
      const stageNum = stageObj ? (stageObj.step || index + 1) : index + 1;
      let cleanHeadingTitle = '';
      let headingAnchorId = '';

      if (rawHeading) {
        let displayHeading = rawHeading;
        if (/^Act\s*\d+/i.test(rawHeading)) {
          const bracketMatch = rawHeading.match(/\(([^)]+)\)/);
          if (bracketMatch) {
            displayHeading = bracketMatch[1].trim();
          } else {
            displayHeading = displayHeading
              .replace(/^Act\s*\d+\s*:\s*[^:\-–—]+[:\-–—]\s*/i, '')
              .replace(/^Act\s*\d+\s*:\s*/i, '')
              .trim();
          }
        }

        // Date deduplication: If stageDateVal is present or heading ends with parenthesised date
        cleanHeadingTitle = displayHeading;
        const trailingDateMatch = displayHeading.match(/\s*\(([^)]*\d{2,4}[^)]*)\)\s*$/);
        if (stageDateVal) {
          cleanHeadingTitle = cleanHeadingTitle.replace(/\s*\([^)]*\d{2,4}[^)]*\)\s*$/, '').trim();
        } else if (trailingDateMatch) {
          stageDateVal = trailingDateMatch[1].trim();
          cleanHeadingTitle = cleanHeadingTitle.replace(/\s*\([^)]*\d{2,4}[^)]*\)\s*$/, '').trim();
        }

        headingAnchorId = cleanHeadingTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        themeHeadingHtml = `<h4 class="narrative-heading" id="${headingAnchorId}" style="margin: 0; color: #1e3a8a; font-size: 1.05rem; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; white-space: normal; overflow-wrap: break-word;"><i class="fa-solid fa-bookmark" style="color: #64748b; font-size: 0.90rem;"></i><span>${cleanHeadingTitle}</span></h4>`;
      }

      let imageHtml = '';
      if (block.images && Array.isArray(block.images) && block.images.length > 0) {
        const galleryData = encodeURIComponent(
          JSON.stringify(
            block.images.map((img) => ({
              src: getAssetUrl(img.src || img.image),
              alt: img.alt || img.image_alt || '',
            })),
          ),
        ).replace(/'/g, '%27');
        imageHtml = `
             <style>
               .image-hint-caption {
                 font-size: 0.9rem; color: #64748b; margin-top: 8px; font-style: italic; cursor: pointer; user-select: none; transition: all 0.3s ease; padding: 4px; border-radius: 4px; display: inline-block;
               }
               .image-hint-caption:hover {
                 background: rgba(0,0,0,0.02);
               }
               .image-hint-caption.blurred {
                 color: transparent !important; text-shadow: 0 0 10px rgba(100,116,139,0.8) !important;
               }
             </style>
             <div class="narrative-images-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 20px 0;">
               ${block.images
            .map((img, idx) => {
              if (img.image_context) {
                const isWeimar =
                  window.currentUnitId === 'weimar_nazi_germany' ||
                  unitId === 'weimar_nazi_germany';

                let contextText = img.image_context || '';
                let hingeText = '';
                if (
                  /\*{0,2}(?:Hinge Question|Discussion Prompt|Discussion Question|Question):\*{0,2}/i.test(
                    contextText,
                  )
                ) {
                  const parts = contextText.split(
                    /\*{0,2}(?:Hinge Question|Discussion Prompt|Discussion Question|Question):\*{0,2}/i,
                  );
                  contextText = parts[0].trim();
                  hingeText = parts[1].trim();
                } else if (contextText.includes('Hinge Question:')) {
                  const parts = contextText.split('Hinge Question:');
                  contextText = parts[0].trim();
                  hingeText = parts[1].trim();
                }

                if (isWeimar) {
                  const displayCaption =
                    img.caption || img.image_caption || 'Archival Primary Record';
                  const imgSrc = getAssetUrl(img.src || img.image);
                  return `
                       <div style="width: 100%; grid-column: 1 / -1; margin: 6px 0;">
                         <details class="cme-source-drawer weimar-source-drawer archival-drawer gcse-source-container archival-source-box" id="source-card-A" data-source-letter="A" style="margin: 0; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02); transition: all 0.25s ease;">
                           <summary style="padding: 5px 12px; min-height: 40px; padding: 7px 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: #f1f5f9; color: #0f172a; list-style: none; user-select: none; transition: background 0.15s ease;">
                             <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                               <span class="archival-meta-tag" style="background: #1e40af; color: #ffffff; padding: 2px 6px; border-radius: 3px; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.4px; line-height: 1.2;">PRIMARY VISUAL RECORD</span>
                               <span class="archival-drawer-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 0.84rem; color: #1e293b; font-weight: 700; line-height: 1.2;">${displayCaption}</span>
                             </div>
                             <span class="drawer-toggle-indicator" style="font-size: 0.68rem; color: #64748b; display: inline-flex; align-items: center; gap: 4px; font-weight: 600; flex-shrink: 0;">
                               Archival Evidence &bull; Expand <span class="drawer-caret">&#9660;</span>
                             </span>
                           </summary>
                           <div class="weimar-source-content" style="padding: 18px; background: #ffffff; border-top: 1px solid #e2e8f0;">
                             ${(() => {
                      const disc = getArchivalSourceDiscussionComponents(
                        hingeText,
                        img,
                        isKs2,
                        '10px',
                      );
                      return `
                             <div class="archival-source-split-layout">
                               <div class="archival-source-media-col">
                                 <img src="${imgSrc}" alt="${displayCaption}" style="width: 100%; max-height: 380px; object-fit: contain; background: #fff; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.08); border: 1px solid #cbd5e1; cursor: zoom-in;" data-action="open-gallery" data-gallery="${galleryData}" data-index="${idx}">
                                 ${!isKs2
                          ? `<div class="archival-media-provenance" style="margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.14); padding-top: 8px; font-size: 0.74rem; line-height: 1.35; color: #94a3b8; text-align: left;">
                                   <strong style="color: #cbd5e1;">Accession:</strong> Edexcel GCSE Paper 3 Primary Visual Evidence
                                 </div>`
                          : ''
                        }
                               </div>
                               <div class="archival-source-details-col">
                                 ${displayCaption ? `<div style="font-size: 0.95rem; color: #475569; margin-bottom: 12px; font-style: italic;">${displayCaption}</div>` : ''}
                                 ${contextText
                          ? `
                                   <div style="background: #f8fafc; border-left: 4px solid #64748b; padding: 12px 16px; border-radius: 0 4px 4px 0; margin-bottom: 12px; color: #334155; font-size: 0.98rem; line-height: 1.6;">
                                     <strong>${isKs2 ? 'What this tells us:' : 'Historical Context:'}</strong> ${typeof window !== 'undefined' && window.formatBold ? window.formatBold(contextText) : contextText}
                                   </div>
                                 `
                          : ''
                        }
                                 ${disc.promptHtml}
                               </div>
                             </div>
                             ${disc.panelHtml}
                             `;
                    })()}
                           </div>
                         </details>
                       </div>
                       `;
                }

                return `
                     <div style="display: flex; flex-wrap: wrap; gap: 20px; align-items: stretch; justify-content: center; margin: 20px 0; width: 100%; grid-column: 1 / -1;">
                       <div style="flex: 1 1 300px; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                         <img src="${getAssetUrl(img.src || img.image)}" alt="${img.alt || img.image_alt || 'Narrative Image'}" style="width: 100%; max-height: 400px; object-fit: contain; background: #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #cbd5e1; cursor: zoom-in;" data-action="open-gallery" data-gallery="${galleryData}" data-index="${idx}">
                         ${img.caption || img.image_caption || img.alt || img.image_alt ? `<div class="narrative-plate-caption" style="font-size: 0.82rem; color: #64748b; margin-top: 8px; font-style: italic; line-height: 1.45;">${formatVisualPlateCaption(img.caption || img.image_caption || img.alt || img.image_alt, img.source_letter)}</div>` : ''}
                       </div>
                       <div style="flex: 1 1 300px; background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: center;">
                         <h4 style="margin-top: 0; margin-bottom: 12px; color: #b45309; display: flex; align-items: center; gap: 8px; font-size: 1.1rem;">
                           <i class="fa-solid fa-magnifying-glass-plus"></i> Historical Context
                         </h4>
                         <p style="margin: 0; font-size: 1rem; color: #334155; line-height: 1.6;">
                           ${img.image_context.replace(/\*\*(?:Hinge Question|Discussion Prompt|Discussion Question|Question):\*\*/gi, '<br><br><strong style="color: #b45309;">Discussion Prompt:</strong>')}
                         </p>
                       </div>
                     </div>
                   `;
              } else {
                return `
                     <div class="narrative-image-container" style="text-align: center;">
                       <img src="${getAssetUrl(img.src || img.image)}" alt="${img.alt || img.image_alt || 'Narrative Image'}" style="width: 100%; max-height: 400px; object-fit: contain; background: #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #cbd5e1; cursor: zoom-in;" data-action="open-gallery" data-gallery="${galleryData}" data-index="${idx}">
                       ${img.caption || img.image_caption || img.alt || img.image_alt ? `<div class="narrative-plate-caption" style="font-size: 0.82rem; color: #64748b; margin-top: 8px; font-style: italic; line-height: 1.45;">${formatVisualPlateCaption(img.caption || img.image_caption || img.alt || img.image_alt, img.source_letter)}</div>` : ''}
                     </div>
                   `;
              }
            })
            .join('')}
             </div>
           `;
      } else if (
        typeof block.image === 'string' &&
        block.image.trim() &&
        block.image.trim() !== 'undefined' &&
        block.image.trim() !== 'null' &&
        !(window.currentUnitId === 'water_and_sanitation' && block.source_letter)
      ) {
        let containerStyle = block.image_context
          ? 'display: flex; flex-wrap: wrap; gap: 20px; align-items: stretch; justify-content: center; margin: 20px 0;'
          : 'text-align: center; margin: 20px 0;';
        let imgWrapperStyle = block.image_context
          ? 'flex: 1 1 300px; text-align: center; display: flex; flex-direction: column; justify-content: center;'
          : '';
        let contextHtml = block.image_context
          ? `
               <div style="flex: 1 1 300px; background: #f8fafc; padding: 18px 20px; border-radius: 8px; border-left: 4px solid #f59e0b; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: center;">
                 <p style="margin: 0; color: #334155; line-height: 1.65; font-size: 0.98rem;">${block.image_context.replace(/\*\*(?:Hinge Question|Discussion Prompt|Discussion Question|Question):\*\*/gi, '<br><br><strong style="color: #b45309;"><i class="fa-solid fa-circle-question" style="margin-right: 5px;"></i>Discussion Prompt:</strong> ')}</p>
               </div>
               `
          : '';

        imageHtml = `
             <div class="narrative-image-container" style="${containerStyle}">
               <div style="${imgWrapperStyle}">
                 <img src="${getAssetUrl(block.image)}" alt="${block.image_alt || 'Narrative Image'}" style="max-width: 100%; max-height: 240px; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #cbd5e1; cursor: zoom-in; display: block; margin: 0 auto;" data-action="open-modal" data-src="${getAssetUrl(block.image)}">
                 ${block.caption || block.image_caption || block.image_alt ? `<div class="narrative-plate-caption" style="font-size: 0.82rem; color: #64748b; margin-top: 8px; font-style: italic; line-height: 1.45;">${formatVisualPlateCaption(block.caption || block.image_caption || block.image_alt, block.source_letter)}</div>` : ''}

               </div>
               ${contextHtml}
             </div>
           `;
      }

      const renderSingleArchivalSource = (rawSource) => {
        if (!rawSource) return '';
        const rawImgSrc =
          (typeof rawSource.image === 'string' &&
            rawSource.image.trim() &&
            rawSource.image !== 'undefined'
            ? rawSource.image.trim()
            : '') ||
          (typeof rawSource.src === 'string' &&
            rawSource.src.trim() &&
            rawSource.src !== 'undefined'
            ? rawSource.src.trim()
            : '') ||
          (typeof rawSource.source === 'string' &&
            rawSource.source.trim() &&
            rawSource.source !== 'undefined'
            ? rawSource.source.trim()
            : '') ||
          '';

        const sourceText = (rawSource.content || rawSource.text || '').trim();
        const hasImage = Boolean(rawImgSrc);

        const isWrittenSource =
          rawSource.type === 'written' || (!hasImage && Boolean(sourceText)) || !hasImage;

        getSourceMatchKeys(rawSource).forEach((k) => renderedSourceKeys.add(k));
        const bLetterMatch = (rawSource.title || '').match(/(?:Source|Map|Diagram)\s+([A-Z0-9]+)/i);
        const autoLetter = String.fromCharCode(65 + sequentialSourceCounter);
        sequentialSourceCounter += 1;
        const bLetter = bLetterMatch
          ? bLetterMatch[1].toUpperCase()
          : rawSource.letter
            ? String(rawSource.letter).toUpperCase()
            : autoLetter;
        renderedSourceKeys.add(`letter:${bLetter}`);

        const isInteractiveSourceUnit =
          isGCSEInteractiveUnit(window.currentUnitId || unitId) || isKs3 || isKs2;
        const bCardIdAttr =
          bLetter && isInteractiveSourceUnit
            ? `id="source-card-${bLetter}" data-source-letter="${bLetter}"`
            : '';
        const bQClassAttr =
          bLetter && isInteractiveSourceUnit ? 'source-inquiry-box source-inquiry-interactive' : '';
        const bQDataAttr =
          bLetter && isInteractiveSourceUnit
            ? `data-target-source="${bLetter}" title="Hover or click to highlight Source ${bLetter}"`
            : '';

        const sourceTitle =
          rawSource.title ||
          rawSource.caption ||
          (bLetter ? `Source ${bLetter}: Archival Record` : '');
        const sourceAudioBtnHtml =
          Boolean(sourceText) && !(rawSource && rawSource.perspective_pair)
            ? renderAudioPlaybackBar('Read Aloud Primary Source Excerpt', 'source-audio-bar')
            : '';

        const sourceHeaderHtml = sourceTitle
          ? `
            <div class="archival-source-header" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; padding-bottom: 8px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0;">
              <h4 class="archival-source-title" style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.12rem; font-weight: 700; color: #0f172a;">${sourceTitle}</h4>
              ${sourceAudioBtnHtml}
            </div>
          `
          : isWrittenSource && sourceAudioBtnHtml
            ? `
            <div class="archival-source-header" style="display: flex; justify-content: flex-end;">
              ${sourceAudioBtnHtml}
            </div>
          `
            : '';

        let rawContextVal = rawSource.source_context || rawSource.context || '';
        let cleanContextVal = rawContextVal;
        if (
          /\*{0,2}(?:Hinge Question|Discussion Prompt|Discussion Question|Question):\*{0,2}/i.test(
            cleanContextVal,
          )
        ) {
          const parts = cleanContextVal.split(
            /\*{0,2}(?:Hinge Question|Discussion Prompt|Discussion Question|Question):\*{0,2}/i,
          );
          cleanContextVal = parts[0].trim();
          if (
            !rawSource.hinge_question &&
            !rawSource.question &&
            !rawSource.source_question &&
            parts[1]
          ) {
            rawSource.hinge_question = parts[1].trim();
          }
        }

        // Pre-build utility enquiry / guidance card if present
        const utilityCardHtml = (() => {
          const utilityObj = rawSource.utility_enquiry || rawSource.utilityEnquiry;
          if (
            utilityObj &&
            (utilityObj.is_exam_rubric === true ||
              (!rawSource.model_answer && (utilityObj.bullet_points || utilityObj.key_points)))
          ) {
            const uPrompt =
              utilityObj.question ||
              utilityObj.prompt ||
              utilityObj.enquiry ||
              rawSource.question ||
              '';

            // Check if explicit exam rubric is requested (e.g. designated mock exam units)
            const isExamRubric = utilityObj.is_exam_rubric === true;

            if (isExamRubric) {
              const uInferences =
                utilityObj.content_inferences || utilityObj.inferences || utilityObj.content || '';
              const uProv = utilityObj.provenance_evaluation || utilityObj.provenance || '';
              const uContext =
                utilityObj.context_limitations ||
                utilityObj.limitations ||
                utilityObj.context ||
                '';

              const isMedicineWesternFront =
                (unitId === 'edexcel_medicine' || window.currentUnitId === 'edexcel_medicine') &&
                (lesson.historic_environment || (lesson.title && lesson.title.includes('KT5')));
              const isPaper3 =
                unitId === 'weimar_nazi_germany' ||
                window.currentUnitId === 'weimar_nazi_germany' ||
                unitId === 'usa' ||
                window.currentUnitId === 'usa';
              const isPaper2 =
                unitId === 'cme_new' ||
                window.currentUnitId === 'cme_new' ||
                unitId === 'eee' ||
                window.currentUnitId === 'eee';
              const examBadgeTitle =
                utilityObj.exam_label ||
                (isMedicineWesternFront
                  ? 'Edexcel Paper 1 &bull; Q2(a) Source Utility Enquiry [8 Marks]'
                  : isPaper3
                    ? 'Edexcel Paper 3 &bull; Q3(a) Source Utility Enquiry [8 Marks]'
                    : isPaper2
                      ? 'Edexcel Paper 2 &bull; Primary Disciplinary Evidence Enquiry'
                      : isKs3
                        ? 'KS3 Primary Source Enquiry'
                        : isKs2
                          ? 'Key Stage 2 Historian Enquiry'
                          : 'GCSE Source Utility Enquiry [8 Marks]');

              return `
                <details class="source-enquiry-reveal mode-exam edexcel-paper3-utility-card">
                  <summary class="source-enquiry-single-row-summary" style="padding: 8px 12px; cursor: pointer; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; list-style: none; user-select: none; background: #f0fdf4; transition: background 0.15s ease; box-sizing: border-box; width: 100%;">
                    <div class="source-enquiry-left-wrap" style="display: flex; align-items: center; gap: 9px; flex: 1 1 auto; min-width: 0; flex-wrap: wrap;">
                      <span style="font-size: 0.66rem; font-weight: 800; text-transform: uppercase; color: #166534; background: #dcfce7; border: 1px solid #bbf7d0; padding: 2px 7px; border-radius: 10px; letter-spacing: 0.45px; flex-shrink: 0; white-space: nowrap;">${examBadgeTitle}</span>
                      <div class="source-enquiry-prompt" style="font-family: 'Playfair Display', Georgia, serif; font-size: 0.94rem; color: #14532d; font-weight: 700; line-height: 1.38; flex: 1 1 240px; min-width: 0; white-space: normal; word-break: normal; overflow-wrap: break-word;">${typeof window !== 'undefined' && window.formatBold ? window.formatBold(uPrompt) : uPrompt}</div>
                    </div>
                    <span class="reveal-answer-pill" style="flex-shrink: 0;">
                      <i class="fa-solid fa-lightbulb" style="color: #16a34a;"></i>
                      <span class="reveal-text-closed">Reveal Exam Guidance</span>
                      <span class="reveal-text-open">Hide Exam Guidance</span>
                      <span class="reveal-arrow">&#9660;</span>
                    </span>
                  </summary>
                  <div class="source-enquiry-answer-body" style="padding: 12px 16px; background: #ffffff; border-top: 1.5px solid #86efac;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-top: 4px;">
                      ${uInferences ? `<div style="background: #f8fafc; border: 1px solid #bbf7d0; border-radius: 5px; padding: 10px 12px;"><div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #166534; margin-bottom: 5px;"><i class="fa-solid fa-magnifying-glass" style="color: #16a34a;"></i> 1. Content &amp; Inferences</div><div style="font-size: 0.86rem; color: #1e293b; line-height: 1.5;">${typeof window !== 'undefined' && window.formatBold ? window.formatBold(uInferences) : uInferences}</div></div>` : ''}
                      ${uProv ? `<div style="background: #f8fafc; border: 1px solid #bbf7d0; border-radius: 5px; padding: 10px 12px;"><div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #166534; margin-bottom: 5px;"><i class="fa-solid fa-stamp" style="color: #16a34a;"></i> 2. Provenance (NOP)</div><div style="font-size: 0.86rem; color: #1e293b; line-height: 1.5;">${typeof window !== 'undefined' && window.formatBold ? window.formatBold(uProv) : uProv}</div></div>` : ''}
                      ${uContext ? `<div style="background: #f8fafc; border: 1px solid #bbf7d0; border-radius: 5px; padding: 10px 12px;"><div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #166534; margin-bottom: 5px;"><i class="fa-solid fa-book-bookmark" style="color: #16a34a;"></i> 3. Context &amp; Limitations</div><div style="font-size: 0.86rem; color: #1e293b; line-height: 1.5;">${typeof window !== 'undefined' && window.formatBold ? window.formatBold(uContext) : uContext}</div></div>` : ''}
                    </div>
                  </div>
                </details>
              `;
            }

            // DEFAULT CHILD-FRIENDLY MODEL: 2 to 3 direct bullet points
            let points =
              utilityObj.bullet_points ||
              utilityObj.key_points ||
              utilityObj.model_answers ||
              utilityObj.answers;
            if (!points || !Array.isArray(points) || points.length === 0) {
              const uInferences =
                utilityObj.content_inferences || utilityObj.inferences || utilityObj.content || '';
              const uProv = utilityObj.provenance_evaluation || utilityObj.provenance || '';
              const uContext =
                utilityObj.context_limitations ||
                utilityObj.limitations ||
                utilityObj.context ||
                '';
              points = [];
              if (uInferences) points.push({ label: 'What the Source Shows', text: uInferences });
              if (uProv) points.push({ label: 'Historical Meaning', text: uProv });
              if (uContext && !uContext.toLowerCase().includes('does not show'))
                points.push({ label: 'Deeper Context', text: uContext });
            }

            const renderedBullets = points
              .map((pt) => {
                let lbl = '';
                let txt = '';
                if (typeof pt === 'string') {
                  txt = pt;
                } else if (pt && typeof pt === 'object') {
                  if (pt.label) {
                    const cleanLabel = (pt.label || '').toLowerCase();
                    if (
                      ![
                        'what the source shows',
                        'historical context',
                        'key takeaway',
                        'takeaway',
                        'point 1',
                        'point 2',
                        'point 3',
                      ].includes(cleanLabel)
                    ) {
                      lbl = `<strong style="color: #166534;">${pt.label}:</strong> `;
                    }
                  }
                  txt = pt.text || pt.content || pt.answer || '';
                }
                const formattedTxt =
                  typeof window !== 'undefined' && window.formatBold ? window.formatBold(txt) : txt;
                return `<li style="margin-bottom: 8px; line-height: 1.55; color: #1e293b; font-size: 0.88rem;">${lbl}${formattedTxt}</li>`;
              })
              .join('');

            return renderSourceEnquiryBox({
              srcObj: rawSource,
              promptText: uPrompt,
              contextVal: cleanContextVal,
              renderedBullets,
            });
          } else if (
            rawSource.question ||
            rawSource.enquiry_question ||
            rawSource.how_useful_question
          ) {
            const qPrompt =
              rawSource.question || rawSource.enquiry_question || rawSource.how_useful_question;
            return renderSourceEnquiryBox({
              srcObj: rawSource,
              promptText: qPrompt,
              contextVal: cleanContextVal,
            });
          }
          return '';
        })();

        const hasUtilityCard = Boolean(utilityCardHtml);

        const orientingIntro =
          rawSource.intro ||
          rawSource.caption ||
          '';

        const ppObj =
          rawSource &&
          rawSource.perspective_pair &&
          typeof rawSource.perspective_pair === 'object' &&
          rawSource.perspective_pair.side_a &&
          rawSource.perspective_pair.side_b
            ? rawSource.perspective_pair
            : null;
        const hasPerspectivePair = Boolean(ppObj);

        let sourceBodyHtml = '';
        if (hasPerspectivePair) {
          const cleanSideImg = (obj) => {
            if (!obj || typeof obj !== 'object') return '';
            const cand = obj.image || obj.src || '';
            return typeof cand === 'string' &&
              cand.trim() &&
              cand.trim() !== 'undefined' &&
              cand.trim() !== 'null'
              ? cand.trim()
              : '';
          };
          const sideARawImg = cleanSideImg(ppObj.side_a);
          const sideBRawImg = cleanSideImg(ppObj.side_b);
          const sideAImgUrl = sideARawImg ? getAssetUrl(sideARawImg) : '';
          const sideBImgUrl = sideBRawImg ? getAssetUrl(sideBRawImg) : '';
          const rawSourceImgUrl = rawImgSrc ? getAssetUrl(rawImgSrc) : '';
          const hasDistinctSharedImg = Boolean(
            rawSourceImgUrl &&
              rawSourceImgUrl !== sideAImgUrl &&
              rawSourceImgUrl !== sideBImgUrl,
          );

          const renderPerspectiveSideCard = (side, sideSlot) => {
            if (!side || typeof side !== 'object') return '';
            const actorBadge = side.actor_badge || side.actor || '';
            const sideDate = side.date || '';
            const sideTitle = side.title || '';
            const sideText = String(side.text || side.content || '').trim();
            const rawType = String(side.text_type || 'summary').trim().toLowerCase();
            const isVerbatim = rawType === 'verbatim';
            const typeLabel = isVerbatim ? 'Extract' : 'Summary of stated position';
            const sideProv = side.provenance || side.citation || '';
            const sRawImg = cleanSideImg(side);
            const sImgUrl = sRawImg ? getAssetUrl(sRawImg) : '';
            const sAlt =
              side.image_alt || sideTitle || actorBadge || 'Historical perspective archive plate';

            return `
              <article class="perspective-pair-card perspective-${sideSlot}">
                <div class="perspective-card-meta-row">
                  <div class="perspective-card-meta-left">
                    ${actorBadge ? `<span class="perspective-actor-badge">${escHtmlSafe(actorBadge)}</span>` : ''}
                    ${sideDate ? `<span class="perspective-date-badge">${escHtmlSafe(sideDate)}</span>` : ''}
                  </div>
                  <span class="perspective-type-badge ${isVerbatim ? 'is-verbatim' : 'is-summary'}">${typeLabel}</span>
                </div>
                ${sideTitle ? `<h5 class="perspective-card-title">${escHtmlSafe(sideTitle)}</h5>` : ''}
                ${
                  sImgUrl
                    ? `
                  <div class="perspective-card-thumb-wrap">
                    <img src="${sImgUrl}" alt="${escAttrSafe(sAlt)}" class="archival-image perspective-card-thumb" data-action="open-modal" data-src="${sImgUrl}" />
                  </div>
                `
                    : ''
                }
                ${
                  sideText
                    ? `<div class="perspective-card-text ${isVerbatim ? 'is-verbatim' : 'is-summary'}">${typeof formatBold === 'function' ? formatBold(escHtmlSafe(sideText)) : escHtmlSafe(sideText)}</div>`
                    : ''
                }
                ${
                  sideProv
                    ? `<div class="perspective-card-provenance"><span class="perspective-prov-label">Provenance:</span> ${escHtmlSafe(sideProv)}</div>`
                    : ''
                }
              </article>
            `;
          };

          const sharedMediaHtml = hasDistinctSharedImg
            ? `
              <div class="perspective-shared-media">
                <div class="perspective-shared-img-wrap">
                  <img src="${rawSourceImgUrl}" alt="${escAttrSafe(rawSource.image_alt || sourceTitle || 'Historical Source')}" class="archival-image perspective-shared-img" data-action="open-modal" data-src="${rawSourceImgUrl}" />
                </div>
                ${
                  rawSource.caption || rawSource.citation || rawSource.provenance
                    ? `
                  <div class="perspective-shared-caption-wrap">
                    ${rawSource.caption ? `<div class="perspective-shared-caption">${escHtmlSafe(rawSource.caption)}</div>` : ''}
                    ${
                      rawSource.citation || rawSource.provenance
                        ? `<div class="perspective-shared-provenance"><strong>Provenance:</strong> ${escHtmlSafe(rawSource.citation || rawSource.provenance)}</div>`
                        : ''
                    }
                  </div>
                `
                    : ''
                }
              </div>
            `
            : '';

          const sharedEnquiryHtml = utilityCardHtml
            ? `<div class="archival-source-fullwidth-enquiry perspective-shared-enquiry">${utilityCardHtml}</div>`
            : renderArchivalSourceDiscussionBox(
                rawSource.hinge_question || rawSource.question || rawSource.source_question,
                rawSource,
                isKs2,
                '10px',
              );

          sourceBodyHtml = `
            <div class="perspective-pair-container">
              ${sharedMediaHtml}
              ${
                ppObj.framing_note
                  ? `
                <div class="perspective-pair-framing">
                  <span class="perspective-framing-label">Historical Framing</span>
                  <p class="perspective-framing-text">${typeof formatBold === 'function' ? formatBold(escHtmlSafe(ppObj.framing_note)) : escHtmlSafe(ppObj.framing_note)}</p>
                </div>
              `
                  : ''
              }
              <div class="perspective-pair-grid">
                ${renderPerspectiveSideCard(ppObj.side_a, 'side-a')}
                ${renderPerspectiveSideCard(ppObj.side_b, 'side-b')}
              </div>
              ${sharedEnquiryHtml}
            </div>
          `;
        } else if (isWrittenSource) {
          const provenanceText = (rawSource.citation || rawSource.provenance || '').trim();
          const summaryNorm = (rawSource.title || '')
            .replace(/^(?:Source|Map|Diagram)\s+[A-Z0-9]+[:\s-]*/i, '')
            .trim()
            .toLowerCase();
          const provenanceHtml =
            !isKs2 && provenanceText && provenanceText.toLowerCase() !== summaryNorm
              ? `<div class="archival-citation-footer" style="font-size: 0.76rem; color: #64748b; font-style: italic; text-align: right; margin-top: 3px; margin-bottom: 5px; padding-top: 0; line-height: 1.35;">
                  &mdash; <span style="font-style: normal; font-weight: 600; color: #475569;">Provenance:</span> ${provenanceText}
                </div>`
              : '';

          sourceBodyHtml = `
            ${sourceText
              ? renderArchivalSourceBody(sourceText, rawSource, { maxHeight: '350px', marginBottom: '4px', accentColor: '#1e3a8a' })
              : ''
            }
            ${provenanceHtml}
            ${utilityCardHtml ? `<div class="archival-source-fullwidth-enquiry" style="width: 100%; margin-top: 6px;">${utilityCardHtml}</div>` : renderArchivalSourceDiscussionBox(rawSource.hinge_question || rawSource.question || rawSource.source_question, rawSource, isKs2, '6px')}
          `;
        } else {
          const rawSourceImgUrl = getAssetUrl(rawImgSrc);
          const isExamSrcArtwork = isPaintingSource(rawSource, sourceTitle);
          const examSpotlightBtn = isExamSrcArtwork
            ? `
                <button class="btn-source-spotlight-launch btn-art-spotlight-launch" data-action="open-masterpiece" data-src="${rawSourceImgUrl}" data-title="${sourceTitle || 'Historical Artwork'}" data-caption="${rawSource.caption || ''}" title="Launch Art Spotlight">
                  <i class="fa-solid fa-palette" style="color: #fbbf24;"></i>
                  <span>Art Spotlight</span>
                </button>
            `
            : '';

          const primaryProvenanceHtml =
            !isKs2 && (rawSource.citation || rawSource.provenance)
              ? `<div class="archival-media-provenance" style="margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.14); padding-top: 8px; font-size: 0.74rem; line-height: 1.35; color: #94a3b8; text-align: left;">
                  <strong style="color: #cbd5e1;">Provenance:</strong> ${rawSource.citation || rawSource.provenance}
                </div>`
              : '';

          let mediaColHtml = '';
          if (Array.isArray(rawSource.plates) && rawSource.plates.length > 0) {
            mediaColHtml = `
              <div class="archival-source-media-col dual-plates-col${isKs2 ? ' ks2-source-media-col' : ''}" style="flex: 0 0 380px; max-width: 440px; display: flex; flex-direction: column; gap: 14px;">
                ${rawSource.plates
                .map((plate, pIdx) => {
                  const plateImgUrl = getAssetUrl(plate.image || plate.src);
                  return `
                    <div class="archival-plate-card" style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
                      <div style="font-size: 0.65rem; font-weight: 800; color: #1e40af; letter-spacing: 0.5px; margin-bottom: 6px; text-transform: uppercase;">
                        ${plate.label || `PLATE ${pIdx + 1}`}
                      </div>
                      <div style="position: relative; width: 100%; display: flex; justify-content: center; background: #f8fafc; border-radius: 4px; overflow: hidden;">
                        <img src="${plateImgUrl}" alt="${plate.title || `Plate ${pIdx + 1}`}" data-action="open-modal" data-src="${plateImgUrl}" style="cursor: zoom-in; width: auto; max-width: 100%; max-height: 200px; object-fit: contain; display: block; border-radius: 4px;">
                      </div>
                      ${plate.caption ? `<div style="font-size: 0.78rem; color: #475569; margin-top: 6px; line-height: 1.35; font-style: italic;">${plate.caption}</div>` : ''}
                    </div>
                  `;
                })
                .join('')}
                ${primaryProvenanceHtml}
              </div>
            `;
          } else {
            mediaColHtml = `
              <div class="archival-source-media-col${isKs2 ? ' ks2-source-media-col' : ''}">
                <div style="position: relative; width: 100%; display: flex; justify-content: center;">
                  <img src="${rawSourceImgUrl}" alt="${sourceTitle || 'Source'}" data-action="open-modal" data-src="${rawSourceImgUrl}" ${rawSource.default_zoom || rawSource.defaultZoom || (rawSourceImgUrl && rawSourceImgUrl.includes('vesalius_fabrica_frontispiece')) ? `data-default-zoom="${rawSource.default_zoom || rawSource.defaultZoom || '2x'}"` : ''} style="cursor: zoom-in; width: auto; max-width: 100%; max-height: ${isKs2 ? '380px' : '350px'}; object-fit: contain; display: block; border-radius: 6px;">
                </div>
                ${examSpotlightBtn}
                ${primaryProvenanceHtml}

              </div>
            `;
          }

          const primaryDisc = getArchivalSourceDiscussionComponents(
            rawSource.hinge_question || rawSource.question || rawSource.source_question,
            rawSource,
            isKs2,
            '10px',
          );

          const inlineEnquiryHtml = utilityCardHtml
            ? `<div class="archival-source-inline-enquiry" style="width: 100%; margin-top: 6px;">${utilityCardHtml}</div>`
            : !hasUtilityCard && (primaryDisc.promptHtml || primaryDisc.panelHtml)
              ? `<div class="archival-source-inline-enquiry" style="width: 100%; margin-top: 6px;">${primaryDisc.promptHtml || ''}${primaryDisc.panelHtml || ''}</div>`
              : '';

          sourceBodyHtml = `
            <div class="archival-source-split-layout" style="margin-bottom: 0;">
              ${mediaColHtml}
              <div class="archival-source-details-col" style="display: flex; flex-direction: column; justify-content: flex-start; gap: 8px;">
                ${(() => {
                  const cap = rawSource.caption || (rawSource.title ? rawSource.title.replace(/^Source\s+[A-Z0-9]+[:\s-]*/i, '').trim() : '') || rawSource.attribution || '';
                  return cap ? `<div style="font-size: 0.95rem; color: #475569; margin-bottom: 2px; font-style: italic; line-height: 1.5;">${cap}</div>` : '';
                })()}
                ${sourceText
              ? renderArchivalSourceBody(sourceText, rawSource, { maxHeight: '250px', fontSize: '0.95rem', lineHeight: '1.6', padding: '10px 14px', marginBottom: '4px', accentColor: '#1e3a8a' })
              : ''
            }
                ${rawSource.provenance_clue
              ? `
                  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 10px 14px; margin-bottom: 4px;">
                    <strong style="color: #166534; display: block; margin-bottom: 2px;"><span class="archival-meta-tag accent-emerald" style="margin-right: 6px;">PROVENANCE CLUE</span></strong>
                    <span style="color: #15803d; font-size: 0.90rem;">${typeof window !== 'undefined' && window.formatBold ? window.formatBold(rawSource.provenance_clue) : rawSource.provenance_clue}</span>
                  </div>
                `
              : ''
            }
                ${inlineEnquiryHtml}
              </div>
            </div>
          `;
        }

        const isAccordionUnit = true;

        if (isAccordionUnit) {
          const sLetter = bLetter;
          const displayTitle = rawSource.title
            ? rawSource.title.replace(/^(?:Source|Map|Diagram)\s+[A-Z0-9]+[:\s-]*/i, '').trim()
            : rawSource.caption || 'Archival Primary Record';

          const drawerPillLabel = hasPerspectivePair
            ? sLetter
              ? `SOURCE ${sLetter} \u00b7 COMPETING PERSPECTIVES`
              : 'COMPETING PERSPECTIVES'
            : sLetter
              ? `SOURCE ${sLetter}`
              : 'ARCHIVAL EVIDENCE';

          const studioSrcAudioAttr = rawSource.studio_audio
            ? ` data-studio-source-audio="${String(rawSource.studio_audio).replace(/"/g, '&quot;')}" data-studio-voice-label="${String(rawSource.studio_voice_label || 'Living Archive').replace(/"/g, '&quot;')}"`
            : '';
          const studioSrcVoicePill =
            rawSource.studio_audio && rawSource.studio_voice_label
              ? `<span class="living-archive-voice-pill" style="font-size: 0.67rem; font-weight: 700; color: #0f766e; background: #f0fdfa; border: 1px solid #99f6e4; padding: 2px 7px; border-radius: 999px; white-space: nowrap;">${String(rawSource.studio_voice_label).replace(/</g, '&lt;')}</span>`
              : '';

          return `
            <details class="cme-source-drawer medicine-source-drawer eee-source-drawer weimar-source-drawer usa-source-drawer cold-war-source-drawer gcse-source-drawer archival-drawer gcse-source-container archival-source-box${hasPerspectivePair ? ' has-perspective-pair' : ''}" ${bCardIdAttr}${studioSrcAudioAttr} style="margin: 5px 0 0 0; border: 1px solid #cbd5e1; border-radius: 8px; background: #f8fafc; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02); transition: all 0.25s ease;">
              <summary style="padding: 5px 12px; min-height: 32px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: #f1f5f9; color: #0f172a; list-style: none; user-select: none; transition: background 0.15s ease;">
                <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; margin-right: 10px; flex-wrap: wrap;">
                  <span class="archival-meta-tag${hasPerspectivePair ? ' is-competing-perspectives' : ''}" style="background: #1e40af; color: #ffffff; padding: 2px 7px; border-radius: 4px; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.4px; line-height: 1.2; white-space: nowrap; flex-shrink: 0;">${drawerPillLabel}</span>
                  <span class="archival-drawer-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 0.85rem; color: #1e293b; font-weight: 700; line-height: 1.35; white-space: normal; overflow-wrap: break-word;">${displayTitle}</span>
                </div>
                <div style="display: inline-flex; align-items: center; gap: 7px; flex-shrink: 0;">
                  ${studioSrcVoicePill}
                  ${sourceAudioBtnHtml}
                  <span class="drawer-toggle-indicator" style="cursor: pointer;">
                    <span class="drawer-state-expand">View Source</span><span class="drawer-state-collapse">Close</span> <span class="drawer-caret">&#9660;</span>
                  </span>
                </div>
              </summary>
              <div class="cme-source-content" style="padding: 10px 14px; background: #ffffff; border-top: 1px solid #e2e8f0;">
                ${sourceBodyHtml}
              </div>
            </details>
          `;
        } else {
          const studioSrcAudioAttr = rawSource.studio_audio
            ? ` data-studio-source-audio="${String(rawSource.studio_audio).replace(/"/g, '&quot;')}" data-studio-voice-label="${String(rawSource.studio_voice_label || 'Living Archive').replace(/"/g, '&quot;')}"`
            : '';
          return `
            <div class="gcse-source-container archival-source-box" ${bCardIdAttr}${studioSrcAudioAttr} style="text-align: left; transition: all 0.3s ease; margin: 20px 0;">
              ${sourceHeaderHtml}
              ${sourceBodyHtml}
            </div>
          `;
        }
      };

      const rawSourcesList = [];
      const mergeWithLessonSource = (src) => {
        if (!src || !lesson || !Array.isArray(lesson.sources)) return src;
        const matched = lesson.sources.find(
          (ls) => (src.id && ls.id === src.id) || (src.letter && ls.letter === src.letter)
        );
        if (!matched) return src;
        return {
          ...matched,
          ...src,
          text: src.text || matched.text || '',
          content: src.content || matched.content || '',
          caption: src.caption || matched.caption || '',
          attribution: src.attribution || matched.attribution || '',
          citation: src.citation || matched.citation || '',
          source_context: src.source_context || matched.source_context || '',
          text_type: src.text_type || matched.text_type || '',
          perspective_pair: src.perspective_pair || matched.perspective_pair || null,
          studio_audio: src.studio_audio || matched.studio_audio || '',
          studio_voice_label: src.studio_voice_label || matched.studio_voice_label || '',
        };
      };

      if (Array.isArray(block.sources)) {
        rawSourcesList.push(...block.sources.map(mergeWithLessonSource));
      } else if (Array.isArray(block.source)) {
        rawSourcesList.push(...block.source.map(mergeWithLessonSource));
      } else if (block.source) {
        rawSourcesList.push(mergeWithLessonSource(block.source));
      } else if (block.archival_source) {
        rawSourcesList.push({
          type: 'written',
          title: block.archival_source.title,
          shelfmark: block.archival_source.shelfmark,
          content: block.archival_source.text || block.archival_source.content || '',
          citation: block.archival_source.citation || '',
          source_context:
            block.archival_source.source_context || block.archival_source.context || '',
          question: block.archival_source.question || '',
          qNum: block.archival_source.qNum || '',
        });
      } else if (
        window.currentUnitId === 'water_and_sanitation' &&
        block.source_letter &&
        block.image
      ) {
        rawSourcesList.push({
          type: 'visual',
          src: block.image,
          source: block.image,
          title: `Source ${block.source_letter}: ${block.image_alt || block.theme_heading || 'Primary Historical Evidence'}`,
          shelfmark: block.shelfmark || `SOURCE ${block.source_letter}`,
          caption: block.caption || block.image_caption || '',
          citation: block.citation || 'Archaeological / Primary Archive Evidence',
          source_context: block.image_context || '',
          question: block.source_question || '',
        });
      } else if (Array.isArray(lesson.sources) && lesson.sources.length > 0) {
        if (lesson.sources[index]) {
          rawSourcesList.push(lesson.sources[index]);
        }
        // If this is the final narrative block, append any extra sources so nothing is ever dropped
        if (
          index === lesson.narrative_blocks.length - 1 &&
          lesson.sources.length > lesson.narrative_blocks.length
        ) {
          for (let extra = lesson.narrative_blocks.length; extra < lesson.sources.length; extra++) {
            rawSourcesList.push(lesson.sources[extra]);
          }
        }
      }

      let blockSourceHtml = rawSourcesList.map((s) => renderSingleArchivalSource(s)).join('');

      // Ensure ALL lesson.sources are rendered (e.g. Sources D & E when blocks 0..2 rendered inline A, B, C)
      if (
        index === lesson.narrative_blocks.length - 1 &&
        Array.isArray(lesson.sources) &&
        lesson.sources.length > 0
      ) {
        const remainingLessonSources = lesson.sources.filter((ls) => {
          const keys = getSourceMatchKeys(ls);
          return keys.length > 0 && !keys.some((k) => renderedSourceKeys.has(k));
        });
        if (remainingLessonSources.length > 0) {
          const extraSourcesHtml = remainingLessonSources
            .map((s) => renderSingleArchivalSource(s))
            .join('');
          blockSourceHtml += `
            <div class="further-primary-sources-section" style="margin-top: 16px; padding-top: 12px; border-top: 1.5px dashed #cbd5e1;">
              <div style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #1e40af; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-folder-open"></i> Further Primary Sources (${remainingLessonSources.length})
              </div>
              ${extraSourcesHtml}
            </div>
          `;
        }
      }

      const isSourceAfter =
        window.currentUnitId === 'monarchy_religion_power' ||
        unitId === 'monarchy_religion_power' ||
        window.currentUnitId === 'first_british_empire' ||
        unitId === 'first_british_empire';

      let effectiveImage =
        typeof block.image === 'string' &&
        block.image.trim() &&
        block.image.trim() !== 'undefined' &&
        block.image.trim() !== 'null'
          ? block.image.trim()
          : '';
      let effectiveCaption = block.caption || block.image_caption || block.image_alt || '';
      let effectiveAlt = block.image_alt || 'Archival Plate';

      const hasStageHookMap = Boolean(
        block.stage_hook_map &&
          typeof block.stage_hook_map === 'object' &&
          (block.stage_hook_map.image || block.stage_hook_map.src || block.stage_hook_map.image_url),
      );
      const hasSlideCompare = Boolean(
        block.slide_compare &&
          typeof block.slide_compare === 'object' &&
          ((block.slide_compare.before &&
            (block.slide_compare.before.image || block.slide_compare.before.src)) ||
            block.slide_compare.before_image) &&
          ((block.slide_compare.after &&
            (block.slide_compare.after.image || block.slide_compare.after.src)) ||
            block.slide_compare.after_image),
      );
      const hasConceptWidget = Boolean(
        block.concept_widget && typeof block.concept_widget === 'object' && block.concept_widget.type,
      );
      const hasPureVisual = Boolean(
        !hasStageHookMap &&
          !hasSlideCompare &&
          !hasConceptWidget &&
          effectiveImage &&
          (!block.image_context || isCme),
      );
      const hasSideMedia = hasPureVisual || hasStageHookMap || hasSlideCompare || hasConceptWidget;
      const isReversed = hasSideMedia ? visualPlateCounter++ % 2 === 1 : index % 2 === 1;

      let stageQ = stageObj ? (stageObj.question || '') : '';
      if (!stageQ && matchedWbStage) {
        stageQ =
          matchedWbStage.question ||
          matchedWbStage.focus_clue ||
          matchedWbStage.prompt ||
          matchedWbStage.heading ||
          matchedWbStage.title ||
          '';
      }
      const matchingLetter = ['A', 'B', 'C', 'D', 'E'][index];
      const isFiveBlockUnit = [
        'cme_new',
        'usa',
        'weimar_nazi_germany',
        'eee',
        'cold_war',
        'edexcel_medicine',
      ].includes(window.currentUnitId || unitId);

      // Uniform App-Wide Standard: Slim 1-Row Dark Stage Question Bar + Compact White-Box Section Eyebrow
      const isHeaderUnified = Boolean(stageQ);

      let headerBlockHtml = '';
      if (isHeaderUnified) {
        const cleanStageQ = String(stageQ).replace(/^[“"']+|[”"']+$/g, '').trim();
        headerBlockHtml = `
          <div class="workbook-stage-question-banner unified-stage-header-card slim-stage-banner" id="stage-banner-${stageNum}" style="margin-bottom: 6px; background: #0f172a; border: 1px solid #334155; border-left: 4px solid #0284c7; border-radius: 7px; padding: 7px 12px; color: #ffffff; box-shadow: 0 2px 5px rgba(15,23,42,0.10);">
            <div class="stage-header-single-row" style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
              <div class="stage-header-meta" onclick="if(window.jumpToSpineCard){window.jumpToSpineCard(${stageNum});}" style="flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; cursor: pointer;">
                <span class="stage-decimal-pill" style="background: #0284c7; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 900; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.3px; flex-shrink: 0; white-space: nowrap;">
                  Stage ${stageNum}
                </span>
                ${stageDateVal ? `<span class="stage-date-badge" style="font-family: 'Inter', sans-serif; font-size: 0.70rem; font-weight: 800; color: #fbbf24; background: rgba(245,158,11,0.18); border: 1px solid rgba(245,158,11,0.35); padding: 2px 7px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0; white-space: nowrap;"><i class="fa-regular fa-clock" style="font-size: 0.65rem;"></i> ${stageDateVal}</span>` : ''}
                <span class="stage-banner-question" style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.0rem; font-weight: 700; color: #f8fafc; line-height: 1.32; flex: 1 1 260px; min-width: 0; white-space: normal; word-break: normal; overflow-wrap: break-word;">${cleanStageQ}</span>
              </div>
              <div class="narrative-chunk-audio" style="flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px;">
                ${
                  matchingLetter && isFiveBlockUnit && !blockSourceHtml.trim()
                    ? `
                  <button type="button" class="stage-source-jump-btn" onclick="event.stopPropagation(); if(window.jumpToSourceDrawer){window.jumpToSourceDrawer('${matchingLetter}');}" style="background: rgba(2, 132, 199, 0.22); border: 1px solid rgba(56, 189, 248, 0.45); color: #7dd3fc; font-family: 'Inter', sans-serif; font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s ease; white-space: nowrap;" title="Jump directly to Source ${matchingLetter} Evidence Drawer below">
                    <i class="fa-solid fa-scroll" style="color: #38bdf8;"></i> Source ${matchingLetter}
                  </button>
                `
                    : ''
                }
                ${renderAudioPlaybackBar('Read Aloud Paragraph')}
              </div>
            </div>
          </div>
        `;
      } else {
        headerBlockHtml = `
          <div class="narrative-chunk-header" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 8px;">
            <div class="narrative-chunk-meta" style="flex: 1 1 auto; min-width: 0; display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span class="stage-header-title-row" style="display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                ${showParaNumber ? `<span class="stage-decimal-pill" style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; font-family: 'Inter', sans-serif; font-size: 0.74rem; font-weight: 900; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.3px;">Stage ${stageNum}</span>` : ''}
                ${themeHeadingHtml}
              </span>
              ${stageDateVal ? `<span class="stage-date-badge" style="font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 800; color: #b45309; background: #fffbeb; border: 1px solid #fde68a; padding: 2px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-regular fa-clock" style="font-size: 0.68rem;"></i> ${stageDateVal}</span>` : ''}
            </div>
            <div class="narrative-chunk-audio" style="flex-shrink: 0; margin-left: 6px; margin-top: 1px; display: inline-flex; align-items: center; gap: 6px;">
              ${renderAudioPlaybackBar('Read Aloud Paragraph')}
            </div>
          </div>
        `;
      }

      const stageEyebrowHtml =
        isHeaderUnified && cleanHeadingTitle
          ? `<div class="narrative-stage-eyebrow"${headingAnchorId ? ` id="${headingAnchorId}"` : ''}>${cleanHeadingTitle}</div>`
          : '';

      const hasHookOrSlideCol = hasStageHookMap || hasSlideCompare || hasConceptWidget;
      const narrativeChunkHtml = `
              <div id="para-${index + 1}" class="narrative-chunk ${hasSideMedia ? '' : 'standalone-narrative-chunk'}${hasHookOrSlideCol ? ' stage-hook-narrative-chunk' : ''}" style="display: flex; flex-direction: column; margin-bottom: ${hasSideMedia ? '0' : '6px'}; padding: 14px 18px; background: ${bg}; border-radius: 8px; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; transition: all 0.3s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.04); flex: ${hasHookOrSlideCol ? '1 1 46%' : '1 1 58%'}; min-width: 0;">
                ${isHeaderUnified ? stageEyebrowHtml : headerBlockHtml}
                <div class="narrative-text" style="width: 100%; ${hasSideMedia ? '' : 'max-width: 880px;'} line-height: ${hasSideMedia ? '1.68' : '1.70'}; color: #0f172a; font-size: 1.13rem;">${styledContent}</div>
              </div>
      `;

      let topNarrativeHtml = '';
      if (hasStageHookMap && hasSlideCompare) {
        const hookMapHtml = renderInteractiveHotspotMapHTML(block.stage_hook_map, index, {
          isStageHook: true,
        });
        const slideCompareHtml = renderSlideCompareHTML(block.slide_compare, index);
        const dualHookId = `dual-stage-hook-${String((lesson && lesson.id) || 'lesson').replace(/[^a-zA-Z0-9_-]/g, '-')}-${index}`;

        window.postRenderHooks.push(() => {
          const wrap = document.getElementById(dualHookId);
          if (!wrap || wrap.dataset.modeBound === '1') return;
          wrap.dataset.modeBound = '1';
          const btns = wrap.querySelectorAll('[data-hook-mode-btn]');
          const panes = wrap.querySelectorAll('[data-hook-mode-pane]');
          btns.forEach((btn) => {
            btn.addEventListener('click', () => {
              const targetMode = btn.getAttribute('data-hook-mode-btn');
              btns.forEach((b) => {
                const active = b.getAttribute('data-hook-mode-btn') === targetMode;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-pressed', active ? 'true' : 'false');
              });
              panes.forEach((p) => {
                const show = p.getAttribute('data-hook-mode-pane') === targetMode;
                p.classList.toggle('is-hidden', !show);
                if (show) {
                  p.removeAttribute('hidden');
                } else {
                  p.setAttribute('hidden', 'hidden');
                }
              });
              if (targetMode === 'slide') {
                const scStage = wrap.querySelector('.slide-compare-stage');
                if (scStage) {
                  try {
                    scStage.focus({ preventScroll: true });
                  } catch (_) {
                    scStage.focus();
                  }
                }
              }
            });
          });
        });

        topNarrativeHtml = `
          ${isHeaderUnified ? headerBlockHtml : ''}
          <div class="stage-hook-map-row has-dual-hook-modes">
            ${narrativeChunkHtml}
            <div class="stage-hook-map-col" id="${dualHookId}">
              <div class="stage-hook-mode-bar no-print" role="group" aria-label="Stage visual mode">
                <button type="button" class="stage-hook-mode-btn is-active" data-hook-mode-btn="pins" aria-pressed="true">Interactive pins</button>
                <span class="stage-hook-mode-sep" aria-hidden="true">|</span>
                <button type="button" class="stage-hook-mode-btn" data-hook-mode-btn="slide" aria-pressed="false">Slide-across</button>
              </div>
              <div class="stage-hook-mode-pane" data-hook-mode-pane="pins">
                ${hookMapHtml}
              </div>
              <div class="stage-hook-mode-pane is-hidden" data-hook-mode-pane="slide" hidden="hidden">
                ${slideCompareHtml}
              </div>
            </div>
          </div>
        `;
      } else if (hasStageHookMap) {
        const hookMapHtml = renderInteractiveHotspotMapHTML(block.stage_hook_map, index, {
          isStageHook: true,
        });
        topNarrativeHtml = `
          ${isHeaderUnified ? headerBlockHtml : ''}
          <div class="stage-hook-map-row">
            ${narrativeChunkHtml}
            <div class="stage-hook-map-col">
              ${hookMapHtml}
            </div>
          </div>
        `;
      } else if (hasSlideCompare) {
        const slideCompareHtml = renderSlideCompareHTML(block.slide_compare, index);
        topNarrativeHtml = `
          ${isHeaderUnified ? headerBlockHtml : ''}
          <div class="stage-hook-map-row slide-compare-only-row" style="${isReversed ? 'flex-direction: row-reverse;' : ''}">
            ${narrativeChunkHtml}
            <div class="stage-hook-map-col slide-compare-col">
              ${slideCompareHtml}
            </div>
          </div>
        `;
      } else if (hasConceptWidget) {
        const conceptWidgetHtml = renderConceptWidgetHTML(block.concept_widget, index);
        topNarrativeHtml = `
          ${isHeaderUnified ? headerBlockHtml : ''}
          <div class="stage-hook-map-row concept-widget-only-row" style="${isReversed ? 'flex-direction: row-reverse;' : ''}">
            ${narrativeChunkHtml}
            <div class="stage-hook-map-col concept-widget-col">
              ${conceptWidgetHtml}
            </div>
          </div>
        `;
      } else if (hasPureVisual) {
        const rawContent = (block.content || block.text || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const rawWordCount = rawContent.split(/\s+/).filter(Boolean).length;
        const hasMultipleParagraphs = /<br\s*\/?>\s*<br\s*\/?>|<\/p>\s*<p>/i.test(block.content || block.text || '');
        const isSvgPlate = /\.svg(?:[?#]|$)/i.test(effectiveImage);
        const isCompactNarrative = !isSvgPlate && (!hasMultipleParagraphs || rawWordCount < 165);
        const plateMaxImgHeight = isSvgPlate ? '360px' : isCompactNarrative ? '240px' : '270px';
        const plateFlexBasis = isSvgPlate ? '380px' : isCompactNarrative ? '320px' : '360px';
        const plateMaxWidth = isSvgPlate ? '420px' : isCompactNarrative ? '355px' : '400px';
        const platePadding = isCompactNarrative ? '12px 14px' : '14px 16px';
        const plateClass = `${isCompactNarrative ? 'narrative-visual-plate plate-compact' : 'narrative-visual-plate plate-standard'}${isSvgPlate ? ' plate-svg-map' : ''}`;

        const visualPlateHtml = `
          <div class="${plateClass}" style="flex: 0 0 ${plateFlexBasis}; max-width: ${plateMaxWidth}; display: flex; flex-direction: column; justify-content: center; align-items: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: ${platePadding}; box-shadow: 0 2px 5px rgba(0,0,0,0.04); text-align: center;">
            <img class="archival-image" src="${getAssetUrl(effectiveImage)}" alt="${escAttrSafe(effectiveAlt)}" style="max-width: 100%; max-height: ${plateMaxImgHeight}; object-fit: contain; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.12); border: 1px solid #cbd5e1; cursor: zoom-in; display: block; margin: 0 auto;" data-action="open-modal" data-src="${getAssetUrl(effectiveImage)}">
            ${effectiveCaption ? `<div class="narrative-plate-caption" style="font-size: 0.80rem; color: #64748b; margin-top: 8px; font-style: italic; line-height: 1.4; user-select: none;">${formatVisualPlateCaption(effectiveCaption)}</div>` : ''}
          </div>
        `;
        topNarrativeHtml = `
          ${isHeaderUnified ? headerBlockHtml : ''}
          <div class="narrative-visual-row ${isReversed ? 'row-reversed' : ''}" style="display: flex; gap: 18px; align-items: flex-start; margin-bottom: 6px; ${isReversed ? 'flex-direction: row-reverse;' : ''}">
            ${narrativeChunkHtml}
            ${visualPlateHtml}
          </div>
        `;
      } else {
        topNarrativeHtml = `
          ${isHeaderUnified ? headerBlockHtml : ''}
          ${narrativeChunkHtml}
          ${imageHtml}
        `;
      }

      const resolvedStudioUnit = String(window.currentUnitId || unitId || '').trim();
      const resolvedStudioLesson = lesson && lesson.id ? String(lesson.id).trim() : '';
      const studioAudioAttr =
        resolvedStudioUnit && resolvedStudioLesson
          ? ` data-studio-audio="/audio/lessons/${encodeURIComponent(resolvedStudioUnit)}/${encodeURIComponent(resolvedStudioLesson)}_b${index + 1}.mp3"`
          : '';

      htmlNarrative += `
            <div class="standard-narrative-container"${studioAudioAttr} style="margin-bottom: 20px;">
              ${topNarrativeHtml}
              ${blockSourceHtml}
            </div>
          `;

      let extrasHtml = '';
      if (block.level_4) {
        extrasHtml += `
            <div class="level4-narrative-container" style="display: none;">
              <div id="para-l4-${index + 1}" class="narrative-chunk" style="display: flex; flex-direction: column; margin-bottom: 15px; padding: 16px 18px; background: ${bg}; border-radius: 8px; border: 1px solid #e2e8f0; border-left: 4px solid #10b981; transition: all 0.3s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.04);">
                <div class="narrative-chunk-header" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 10px;">
                  <div class="narrative-chunk-meta" style="flex: 1 1 auto; min-width: 0; display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="stage-decimal-pill" style="background:#ecfdf5; color:#047857; border: 1px solid #a7f3d0; font-family: 'Inter', sans-serif; font-size: 0.74rem; font-weight: 900; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.3px;">${decimalRef}</span>
                    <h4 class="narrative-heading" style="margin: 0; color: #065f46; font-size: 1.05rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-bookmark" style="color: #10b981; font-size: 0.88rem;"></i><span>${cleanHeadingTitle}</span></h4>
                    <span style="font-family: 'Inter', sans-serif; font-size: 0.68rem; font-weight: 800; background: #d1fae5; color: #047857; padding: 2px 6px; border-radius: 3px; text-transform: uppercase;">Extension Tier</span>
                  </div>
                  <div class="narrative-chunk-audio" style="flex-shrink: 0; margin-left: 6px; margin-top: 1px;">
                    ${renderAudioPlaybackBar('Read Aloud Paragraph (Level 4)')}
                  </div>
                </div>
                <div class="narrative-text" style="width: 100%; line-height: 1.65; font-size: 1.15rem; color:#1e293b;">${l4StyledContent}</div>
              </div>
            </div>
          `;
      }

      if (block.hinge_question) {
        const hingeId = `hinge-${index}`;
        const hingeQuestionText = block.hinge_question.text || block.hinge_question.question;
        const correctIndex =
          block.hinge_question.correct_index !== undefined
            ? block.hinge_question.correct_index
            : block.hinge_question.answer;
        extrasHtml += `
            <div class="hinge-question-container no-print" style="margin-left: 40px; margin-bottom: 25px; margin-top: -5px;">
              <button class="btn btn-secondary" id="btn-${hingeId}" data-action="reveal-hinge" data-target="${hingeId}" style="background: #0ea5e9; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: background 0.2s;"><i class="fa-solid fa-person-circle-question" style="margin-right: 6px;"></i> Reveal Discussion Prompt</button>
              <div id="${hingeId}" style="display: none; background: #f0f9ff; border: 2px solid #38bdf8; padding: 15px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="color: #0284c7; font-weight: bold; font-size: 0.9rem; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-circle-question"></i> Interactive Discussion Question</div>
                <div style="color: #0f172a; font-size: 1.1rem; font-weight: bold; margin-bottom: 15px;">"${hingeQuestionText}"</div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${block.hinge_question.options
            .map(
              (opt, i) => `
                    <button data-action="hinge-mcq-select" data-correct="${correctIndex}" data-index="${i}" style="text-align: left; background: white; border: 1px solid #bae6fd; padding: 12px 15px; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-size: 1rem; color: #334155;">
                      <strong>${String.fromCharCode(65 + i)}:</strong> ${opt}
                    </button>
                  `,
            )
            .join('')}
                </div>
                <div style="display: none; margin-top: 15px; padding: 12px; background: #dcfce7; border-left: 4px solid #22c55e; color: #166534; font-size: 1rem; border-radius: 0 6px 6px 0;">
                  <strong>Explanation:</strong> ${block.hinge_question.explanation}
                </div>
              </div>
            </div>
          `;
      }

      if (block.tasks && block.tasks.length > 0) {
        extrasHtml += `<div class="embedded-tasks-container" style="margin-left: 40px; margin-bottom: 25px; margin-top: -5px; padding: 15px; background: #fffbeb; border: 2px dashed #fcd34d; border-radius: 6px;">`;
        block.tasks.forEach((task, tIdx) => {
          if (task.type === 'source_utility' || task.taskType === 'source_utility') {
            extrasHtml += renderSourceUtilityTaskHTML(task, index, tIdx, unitId);
            return;
          }
          if (
            task.type === 'historical_interpretations' ||
            task.taskType === 'historical_interpretations'
          ) {
            extrasHtml += renderHistoricalInterpretationsTaskHTML(task, index, tIdx, unitId);
            return;
          }
          if (task.type === 'convict_game') {
            const gameId = `convict-game-emb-${index}-${tIdx}`;
            extrasHtml += `<div id="${gameId}" style="margin-bottom: 20px;"></div>`;
            window.postRenderHooks.push(() => {
              import('../convict_game.js').then((mod) => {
                mod.initConvictGame(document.getElementById(gameId), task);
              });
            });
            return;
          }
          if (task.type === 'physician_game') {
            const gameId = `physician-game-emb-${index}-${tIdx}`;
            extrasHtml += `<div id="${gameId}" style="margin-bottom: 20px;"></div>`;
            window.postRenderHooks.push(() => {
              import('../physician_game.js').then((mod) => {
                mod.initPhysicianGame(document.getElementById(gameId), task);
              });
            });
            return;
          }
          if (task.type === 'drag_drop_timeline') {
            const timelineId = `dd-timeline-emb-${index}-${tIdx}`;
            extrasHtml += `<div id="${timelineId}" style="margin-bottom: 20px;"></div>`;
            window.postRenderHooks.push(() => {
              import('../drag_drop_timeline.js').then((mod) => {
                mod.initDragDropTimeline(document.getElementById(timelineId), task);
              });
            });
            return;
          }
          if (task.type === 'interactive_map') {
            const mapId = `interactive-map-emb-${index}-${tIdx}`;
            extrasHtml += `<div id="${mapId}" style="margin-bottom: 20px;"></div>`;
            window.postRenderHooks.push(() => {
              import('../interactive_map.js').then((mod) => {
                mod.initInteractiveMap(document.getElementById(mapId), task);
              });
            });
            return;
          }
          if (task.type === 'spectrum_mapper') {
            const spectrumId = `spectrum-emb-${index}-${tIdx}`;
            extrasHtml += `<div id="${spectrumId}" style="margin-bottom: 20px;"></div>`;
            window.postRenderHooks.push(() => {
              import('../spectrum_mapper.js').then((mod) => {
                mod.initSpectrumMapper(document.getElementById(spectrumId), task);
              });
            });
            return;
          }
          if (task.type === 'multiple_choice') {
            const mcPrefix = task.qNum ? `Q${task.qNum}. ` : '';
            extrasHtml += `<div style="margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                 <h4 style="margin-top:0; color:#0f172a;"><i class="fa-solid fa-list-check"></i> ${mcPrefix}${task.text || task.question || ''}</h4>
                 ${task.questions
                .map(
                  (q, qIdx) => `
                   <div style="margin-top: 15px;">
                     <strong>${q.q}</strong>
                     <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">
                       ${q.options
                      .map(
                        (opt, oIdx) => `
                         <label style="cursor:pointer; display:flex; align-items:center; gap:8px;">
                           <input type="radio" name="mc-${index}-${tIdx}-${qIdx}" value="${oIdx}">
                           <span>${opt}</span>
                         </label>
                       `,
                      )
                      .join('')}
                     </div>
                   </div>
                 `,
                )
                .join('')}
               </div>`;
            return;
          }
          if (task.type === 'sorting') {
            extrasHtml += `<div style="margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                 <h4 style="margin-top:0; color:#0f172a;"><i class="fa-solid fa-arrow-down-1-9"></i> ${task.text || task.question || ''}</h4>
                 <div style="display:flex; flex-direction:column; gap:10px; margin-top:10px;">
                   ${task.events
                .map(
                  (ev, eIdx) => `
                     <div style="display:flex; align-items:center; gap:10px;">
                       <input type="number" min="1" max="${task.events.length}" style="width:50px; padding:5px; border:1px solid #ccc; border-radius:4px;">
                       <span>${ev}</span>
                     </div>
                   `,
                )
                .join('')}
                 </div>
               </div>`;
            return;
          }
          if (task.type === 'cloze') {
            let renderedCloze = task.cloze_text.replace(
              /\[([^\]]+)\]/g,
              '<input type="text" placeholder="..." style="border:none; border-bottom:2px solid #3b82f6; background:transparent; width:100px; text-align:center; margin:0 5px;" />',
            );
            extrasHtml += `<div style="margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                 <h4 style="margin-top:0; color:#0f172a;"><i class="fa-solid fa-pen-clip"></i> ${task.text || task.question || ''}</h4>
                 <div style="margin-bottom: 15px; padding:10px; background:#e0f2fe; border-radius:6px; font-weight:bold; color:#0369a1;">Word Bank: ${task.words.join(' | ')}</div>
                 <p style="line-height:1.8; font-size:1.05rem;">${renderedCloze}</p>
               </div>`;
            return;
          }
          if (task.type === 'matching') {
            extrasHtml += `<div style="margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                 <h4 style="margin-top:0; color:#0f172a;"><i class="fa-solid fa-link"></i> ${task.text}</h4>
                 <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:15px;">
                   <div style="display:flex; flex-direction:column; gap:10px;">
                     ${task.pairs.map((p) => `<div style="padding:10px; background:white; border:1px solid #cbd5e1; border-radius:6px; font-weight:bold;">${p.left}</div>`).join('')}
                   </div>
                   <div style="display:flex; flex-direction:column; gap:10px;">
                     ${[...task.pairs]
                .sort(() => Math.random() - 0.5)
                .map(
                  (p) =>
                    `<div style="padding:10px; background:white; border:1px solid #cbd5e1; border-radius:6px;">${p.right}</div>`,
                )
                .join('')}
                   </div></div></div>`;
            return;
          }
          if (task.type === 'table_planner') {
            extrasHtml += `<div style="margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; overflow-x:auto;">
                  <h4 style="margin-top:0; color:#0f172a;"><i class="fa-solid fa-table"></i> ${task.text || task.question || 'Planner'}</h4>
                 <table style="width:100%; border-collapse:collapse; margin-top:10px; background:white;">
                   <thead><tr>${task.columns.map((c) => `<th style="border:1px solid #cbd5e1; padding:10px; background:#e2e8f0; color:#1e293b; text-align:left;">${c}</th>`).join('')}</tr></thead>
                   <tbody>
                     ${Array.from({ length: task.rows })
                .map(
                  () =>
                    `<tr>${task.columns.map(() => `<td style="border:1px solid #cbd5e1; padding:10px;"><textarea style="width:100%; min-height:60px; border:none; resize:vertical; outline:none;" placeholder="Type here..."></textarea></td>`).join('')}</tr>`,
                )
                .join('')}
                   </tbody>
                 </table>
               </div>`;
            return;
          }
          if (task.type === 'think_pair_share') {
            return;
          }
          if (task.type === 'drawing') {
            const drawPrefix = task.qNum ? `Q${task.qNum}. ` : '';
            extrasHtml += `<div style="margin-bottom: 20px; background: #fffbeb; padding: 15px; border-radius: 8px; border: 2px dashed #f59e0b; text-align:center;">
                 <h4 style="margin-top:0; color:#b45309;"><i class="fa-solid fa-palette"></i> ${drawPrefix}Drawing Task</h4>
                 <p style="font-weight:bold; color:#0f172a; font-size:1.05rem;">${task.text || task.question}</p>
                 <div style="margin:20px auto; width:80%; height:200px; background:white; border:1px solid #d1d5db; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#9ca3af; font-style:italic;">
                   [Draw your response in your workbook]
                 </div>
               </div>`;
            return;
          }
          if (task.type === 'visual_annotation' || task.type === 'diagram_annotation') {
            const rawImg = task.image || task.src || (block && block.image ? block.image : null);
            const imgSrc = rawImg ? getAssetUrl(rawImg) : '';
            extrasHtml += `
              <div class="task-box visual-annotation-interactive" style="margin-bottom: 25px; background: #ffffff; padding: 20px; border-radius: 10px; border: 2px solid #0f172a; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                  <h4 style="margin: 0; color: #0f172a; font-size: 1.15rem;"><i class="fa-solid fa-microscope" style="color: #0284c7; margin-right: 8px;"></i> ${task.text || task.question || 'Visual Blueprint & Archival Anatomy'}</h4>
                  <span style="background: #0f172a; color: #ffffff; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Visual Anatomy</span>
                </div>
                ${task.instruction ? `<p style="font-size: 0.95rem; color: #475569; font-style: italic; margin-top: 0; margin-bottom: 15px;">${task.instruction}</p>` : ''}
                ${imgSrc
                ? `
                  <div style="text-align: center; margin-bottom: 20px; background: #0f172a; border-radius: 8px; padding: 10px; position: relative;">
                    <img src="${imgSrc}" alt="Historical Diagram" style="max-height: 380px; max-width: 100%; object-fit: contain; border-radius: 4px; cursor: zoom-in;" data-action="open-modal" data-src="${imgSrc}" title="Click to zoom">
                    ${task.caption ? `<div style="color: #94a3b8; font-size: 0.85rem; font-style: italic; margin-top: 8px;">${task.caption}</div>` : ''}
                  </div>
                `
                : ''
              }
                ${task.annotations && task.annotations.length > 0
                ? `
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
                    ${task.annotations
                  .map((ann, aIdx) => {
                    const num = ann.num || aIdx + 1;
                    return `
                        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 14px;">
                          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <span style="background: #0f172a; color: #ffffff; font-weight: 800; font-size: 0.85rem; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">${num}</span>
                            <strong style="color: #1e293b; font-size: 0.95rem;">${ann.label || ann.target || 'Feature ' + num}</strong>
                          </div>
                          <p style="font-size: 0.88rem; color: #475569; margin: 0 0 10px 0; line-height: 1.4;">${ann.prompt || ann.question || 'Identify and explain significance:'}</p>
                          <textarea style="width: 100%; box-sizing: border-box; min-height: 55px; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem; font-family: inherit; resize: vertical;" placeholder="${ann.starter || 'Type your notes / label here...'}"></textarea>
                          ${ann.model
                        ? `
                            <details style="margin-top: 8px;">
                              <summary style="cursor: pointer; color: #b45309; font-weight: 600; font-size: 0.82rem;"><i class="fa-solid fa-eye"></i> View Expert Historical Note</summary>
                              <div style="margin-top: 6px; padding: 8px 10px; background: #fef3c7; border-left: 3px solid #b45309; border-radius: 4px; font-size: 0.85rem; color: #78350f;">${ann.model}</div>
                            </details>
                          `
                        : ''
                      }
                        </div>
                      `;
                  })
                  .join('')}
                  </div>
                `
                : ''
              }
              </div>
            `;
            return;
          }
          if (task.type === 'causal_domino') {
            extrasHtml += `
              <div class="task-box causal-domino-interactive" style="margin-bottom: 25px; background: #f0f9ff; padding: 20px; border-radius: 10px; border: 2px solid #0284c7; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #bae6fd; padding-bottom: 10px;">
                  <h4 style="margin: 0; color: #0369a1; font-size: 1.15rem;"><i class="fa-solid fa-cubes-stacked" style="color: #0284c7; margin-right: 8px;"></i> ${task.text || task.question || 'Causal Domino Chain'}</h4>
                  <span style="background: #0284c7; color: #ffffff; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Causal Chain</span>
                </div>
                ${task.instruction ? `<p style="font-size: 0.95rem; color: #075985; font-style: italic; margin-top: 0; margin-bottom: 15px;">${task.instruction}</p>` : ''}
                ${task.steps && task.steps.length > 0
                ? `
                  <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${task.steps
                  .map(
                    (step, sIdx) => `
                      <div style="background: #ffffff; border: 1.5px solid ${step.blank ? '#0284c7' : '#cbd5e1'}; border-left: 5px solid ${sIdx === 0 ? '#0284c7' : sIdx === task.steps.length - 1 ? '#0369a1' : '#0ea5e9'}; border-radius: 8px; padding: 14px; display: flex; align-items: flex-start; gap: 14px;">
                        <div style="background: #e0f2fe; color: #0369a1; font-weight: 800; font-size: 0.9rem; padding: 4px 10px; border-radius: 6px; white-space: nowrap;">
                          ${step.stage || 'Step ' + (sIdx + 1)}
                        </div>
                        <div style="flex: 1;">
                          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <strong style="color: #0f172a; font-size: 1rem;">${step.title || ''}</strong>
                            ${step.year ? `<span style="font-size: 0.85rem; color: #64748b; font-weight: 600;">${step.year}</span>` : ''}
                          </div>
                          ${step.desc ? `<p style="margin: 0 0 8px 0; font-size: 0.92rem; color: #475569; line-height: 1.4;">${step.desc}</p>` : ''}
                          ${step.blank
                        ? `
                            <textarea style="width: 100%; box-sizing: border-box; min-height: 50px; padding: 8px; border: 1.5px dashed #0284c7; border-radius: 6px; font-size: 0.9rem; font-family: inherit; resize: vertical; background: #f8fafc;" placeholder="${step.prompt || 'Explain the causal link connecting this step...'}"></textarea>
                          `
                        : ''
                      }
                        </div>
                      </div>
                    `,
                  )
                  .join('')}
                  </div>
                `
                : ''
              }
              </div>
            `;
            return;
          }
          if (task.type === 'word_scalpel' || task.type === 'forensic_autopsy') {
            extrasHtml += `
              <div class="task-box word-scalpel-interactive" style="margin-bottom: 25px; background: #fffbeb; padding: 20px; border-radius: 10px; border: 2px solid #d97706; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #fed7aa; padding-bottom: 10px;">
                  <h4 style="margin: 0; color: #92400e; font-size: 1.15rem;"><i class="fa-solid fa-scissors" style="color: #d97706; margin-right: 8px;"></i> ${task.text || task.question || 'Forensic Scalpel: Micro-Quotation Extraction'}</h4>
                  <span style="background: #d97706; color: #ffffff; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Forensic Scalpel</span>
                </div>
                ${task.instruction ? `<p style="font-size: 0.95rem; color: #78350f; font-style: italic; margin-top: 0; margin-bottom: 12px;">${task.instruction}</p>` : ''}
                ${task.source_excerpt
                ? `
                  <div style="font-family: Georgia, serif; font-size: 1rem; color: #1e293b; font-style: italic; background: #ffffff; border-left: 4px solid #d97706; padding: 12px 16px; margin-bottom: 15px; border-radius: 0 6px 6px 0; line-height: 1.6;">
                    &ldquo;${task.source_excerpt}&rdquo;
                  </div>
                `
                : ''
              }
                <div style="background: #ffffff; border: 2px dashed #b45309; border-radius: 8px; padding: 14px; margin-bottom: 14px;">
                  <div style="font-size: 0.88rem; font-weight: 700; color: #92400e; margin-bottom: 6px;">Extract the Exact 3–6 Word "Smoking Gun" Quote:</div>
                  <input type="text" style="width: 100%; box-sizing: border-box; padding: 10px 14px; font-family: Georgia, serif; font-size: 1.05rem; border: 1px solid #fed7aa; border-radius: 6px; color: #1e293b;" placeholder='e.g. "[ . . . 3 to 6 words . . . ]"'>
                </div>
                ${task.justification_prompt
                ? `
                  <div style="margin-bottom: 10px;">
                    <label style="display: block; font-size: 0.9rem; font-weight: 700; color: #78350f; margin-bottom: 6px;">Why is this phrase decisive? ${task.justification_prompt}</label>
                    <textarea style="width: 100%; box-sizing: border-box; min-height: 60px; padding: 8px; border: 1px solid #fed7aa; border-radius: 6px; font-size: 0.9rem; font-family: inherit; resize: vertical;" placeholder="${task.starter || 'Type your justification here...'}"></textarea>
                  </div>
                `
                : ''
              }
                ${task.model_quote
                ? `
                  <details style="margin-top: 10px;">
                    <summary style="cursor: pointer; color: #b45309; font-weight: 600; font-size: 0.85rem;"><i class="fa-solid fa-eye"></i> Reveal Historian's Scalpel Selection</summary>
                    <div style="margin-top: 6px; padding: 10px 14px; background: #fef3c7; border-left: 3px solid #b45309; border-radius: 4px; font-size: 0.92rem; color: #78350f;">
                      <strong>Smoking Gun:</strong> <em>&ldquo;${task.model_quote}&rdquo;</em><br>
                      ${task.model_answer ? `<span style="font-size: 0.88rem; display: block; margin-top: 4px;">${task.model_answer}</span>` : ''}
                    </div>
                  </details>
                `
                : ''
              }
              </div>
            `;
            return;
          }
          if (task.type === 'ledger_audit' || task.type === 'balance_sheet') {
            const col1 = task.col1 || { title: 'Column A' };
            const col2 = task.col2 || { title: 'Column B' };
            const rowCount = task.rows || 3;
            extrasHtml += `
              <div class="task-box ledger-audit-interactive" style="margin-bottom: 25px; background: #f8fafc; padding: 20px; border-radius: 10px; border: 2px solid #475569; box-shadow: 0 4px 12px rgba(71, 85, 105, 0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">
                  <h4 style="margin: 0; color: #1e293b; font-size: 1.15rem;"><i class="fa-solid fa-scale-balanced" style="color: #475569; margin-right: 8px;"></i> ${task.text || task.question || 'Forensic Ledger'}</h4>
                  <span style="background: #475569; color: #ffffff; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Forensic Ledger</span>
                </div>
                ${task.instruction ? `<p style="font-size: 0.95rem; color: #475569; font-style: italic; margin-top: 0; margin-bottom: 15px;">${task.instruction}</p>` : ''}
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                  <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px;">
                    <h5 style="margin: 0 0 10px 0; color: #0f172a; font-size: 1rem; border-bottom: 2px solid #cbd5e1; padding-bottom: 6px;">${col1.title}</h5>
                    ${Array.from({ length: rowCount })
                .map(
                  (_, r) => `
                      <input type="text" style="width: 100%; box-sizing: border-box; margin-bottom: 8px; padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 0.88rem;" placeholder="${col1.hints && col1.hints[r] ? col1.hints[r] : 'Evidence point ' + (r + 1)}">
                    `,
                )
                .join('')}
                  </div>
                  <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px;">
                    <h5 style="margin: 0 0 10px 0; color: #0f172a; font-size: 1rem; border-bottom: 2px solid #cbd5e1; padding-bottom: 6px;">${col2.title}</h5>
                    ${Array.from({ length: rowCount })
                .map(
                  (_, r) => `
                      <input type="text" style="width: 100%; box-sizing: border-box; margin-bottom: 8px; padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 0.88rem;" placeholder="${col2.hints && col2.hints[r] ? col2.hints[r] : 'Evidence point ' + (r + 1)}">
                    `,
                )
                .join('')}
                  </div>
                </div>
              </div>
            `;
            return;
          }
          if (task.type === 'two_sided_argument') {
            const qNumPrefix = task.qNum ? `Q${task.qNum}. ` : '';
            const adv = task.advancement || {};
            const lim = task.limitations || {};
            const advTitle = adv.title || 'Advancement & Progress (Change)';
            const limTitle = lim.title || 'Critical Limitations & Stagnation (Continuity)';
            const advPoints = adv.points || [];
            const limPoints = lim.points || [];
            const advStarter = adv.starter || adv.sentence_starter || '';
            const limStarter = lim.starter || lim.sentence_starter || '';
            const synthesisPrompt =
              task.synthesis_prompt ||
              (isKs3
                ? 'Write a balanced analytical paragraph evaluating both sides.'
                : isKs2
                  ? 'Write your historian explanation evaluating both sides.'
                  : 'Write a balanced GCSE exam paragraph evaluating both sides.');
            const connectives = task.synthesis_connectives || [
              'Although...',
              'However, in practical terms...',
              'Consequently...',
              'Overall...',
            ];
            const modelAnswer =
              task.model_answer || task.model || task.exemplar || task.wagoll || task.answer || '';

            extrasHtml += `
              <div class="task-box two-sided-argument-interactive" style="margin-bottom: 25px; background: #ffffff; padding: 20px; border-radius: 10px; border: 2px solid #0f766e; box-shadow: 0 4px 12px rgba(15, 118, 110, 0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #ccfbf1; padding-bottom: 10px;">
                  <h4 style="margin: 0; color: #0f766e; font-size: 1.15rem;"><i class="fa-solid fa-scale-balanced" style="margin-right: 8px;"></i> ${qNumPrefix}${task.topic || task.text || 'Two-Sided Argument Analysis'}</h4>
                  <span style="background: #0f766e; color: #ffffff; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-bullseye" style="color: #5eead4;"></i> ${isKs3 ? 'Target: Key Stage 3 Evaluative Essay' : isKs2 ? 'Target: Key Stage 2 Historian Enquiry' : 'Target: Paper 1 Q5/Q6 Evaluative Essay [16+4 Marks]'}</span>
                </div>
                ${task.instruction ? `<p style="font-size: 0.95rem; color: #475569; font-style: italic; margin-top: 0; margin-bottom: 15px;">${task.instruction}</p>` : ''}
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 16px;">
                  <!-- Side 1: Advancement / Progress -->
                  <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; padding: 14px;">
                    <h5 style="margin: 0 0 10px 0; color: #166534; font-size: 1rem; border-bottom: 2px solid #86efac; padding-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                      <i class="fa-solid fa-arrow-trend-up"></i> ${advTitle}
                    </h5>
                    <ul style="margin: 0 0 12px 0; padding-left: 18px; color: #1e293b; font-size: 0.9rem; line-height: 1.45;">
                      ${advPoints.map((pt) => `<li style="margin-bottom: 6px;">${pt}</li>`).join('')}
                    </ul>
                    ${advStarter ? `<div style="padding: 8px 10px; background: #ffffff; border-left: 3px solid #22c55e; border-radius: 4px; font-size: 0.85rem; color: #15803d; font-style: italic;"><strong>Evidence Stem:</strong> &ldquo;${advStarter}&rdquo;</div>` : ''}
                  </div>

                  <!-- Side 2: Limitations / Continuity -->
                  <div style="background: #fff1f2; border: 1.5px solid #fecdd3; border-radius: 8px; padding: 14px;">
                    <h5 style="margin: 0 0 10px 0; color: #9f1239; font-size: 1rem; border-bottom: 2px solid #fecdd3; padding-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                      <i class="fa-solid fa-hand"></i> ${limTitle}
                    </h5>
                    <ul style="margin: 0 0 12px 0; padding-left: 18px; color: #1e293b; font-size: 0.9rem; line-height: 1.45;">
                      ${limPoints.map((pt) => `<li style="margin-bottom: 6px;">${pt}</li>`).join('')}
                    </ul>
                    ${limStarter ? `<div style="padding: 8px 10px; background: #ffffff; border-left: 3px solid #f43f5e; border-radius: 4px; font-size: 0.85rem; color: #be123c; font-style: italic;"><strong>Counter-Stem:</strong> &ldquo;${limStarter}&rdquo;</div>` : ''}
                  </div>
                </div>

                <!-- Synthesis: Paragraph Builder -->
                <div style="background: #fffbeb; border: 1.5px solid #fcd34d; border-radius: 8px; padding: 14px;">
                  <h5 style="margin: 0 0 8px 0; color: #92400e; font-size: 1rem; display: flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-pen-nib"></i> ${isKs3 ? 'Paragraph Builder: Evaluative Synthesis' : isKs2 ? 'Historian Paragraph Builder' : 'GCSE Paragraph Builder: Evaluative Synthesis'}
                  </h5>
                  <p style="font-size: 0.92rem; color: #78350f; font-weight: 600; margin: 0 0 10px 0;">${synthesisPrompt}</p>
                  
                  <details class="support-connectives-drawer no-print" style="margin-bottom: 12px; background: #ffffff; border: 1px solid #fde68a; border-radius: 6px; padding: 6px 12px;" closed>
                    <summary style="cursor: pointer; font-size: 0.8rem; font-weight: 700; color: #92400e; display: flex; align-items: center; justify-content: space-between; user-select: none;">
                      <span><i class="fa-solid fa-lightbulb"></i> Analytical Connectives (Click to Expand)</span>
                      <span style="font-size: 0.72rem; color: #b45309;"><i class="fa-solid fa-chevron-down"></i> Expand</span>
                    </summary>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
                      ${connectives.map((c) => `<button type="button" class="connective-chip" data-connective="${c.replace(/"/g, '&quot;')}" style="background: #fffbeb; border: 1px solid #fde68a; color: #b45309; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease;" title="Click to insert at cursor">${c}</button>`).join('')}
                    </div>
                  </details>

                  <textarea class="interactive-textarea" style="width: 100%; box-sizing: border-box; min-height: 90px; padding: 10px; border: 1px solid #fde68a; border-radius: 6px; font-size: 0.92rem; font-family: inherit; resize: vertical;" placeholder="${isKs3 ? 'Combine the evidence and counter-evidence above to write your complex, balanced analytical paragraph...' : isKs2 ? 'Write your historian answer using the evidence above...' : 'Combine the evidence and counter-evidence above to write your complex, balanced GCSE exam paragraph...'}"></textarea>

                  ${modelAnswer
                ? `
                    <details class="model-paragraph-reveal" style="margin-top: 12px; border: 1px dashed #d97706; border-radius: 6px; padding: 8px 12px; background: #fffbeb;">
                      <summary style="cursor: pointer; color: #b45309; font-weight: 700; font-size: 0.88rem; outline: none; display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-eye"></i> ${isKs2 ? '[ Show Model Historian Answer ]' : isKs3 ? '[ Show Model Analytical Response ]' : '[ Show Examiner-Grade Model Paragraph ]'}</summary>
                      <div class="scaffold-box model-box" style="margin-top: 10px; padding: 12px 15px; background: #ffffff; border-left: 3px solid #f59e0b; border-radius: 4px; font-size: 0.92rem; color: #78350f; line-height: 1.6; border: 1px solid #fde68a;">
                        ${modelAnswer}
                      </div>
                    </details>
                  `
                : ''
              }
                </div>
              </div>
            `;
            return;
          }
          if (task.type === 'historiographical_spectrum' || task.type === 'spectrum') {
            const leftPole = task.pole_left || 'Interpretation A';
            const rightPole = task.pole_right || 'Interpretation B';
            const specId = `spec-slider-${index}-${tIdx}`;
            extrasHtml += `
              <div class="task-box spectrum-interactive" style="margin-bottom: 25px; background: #faf5ff; padding: 20px; border-radius: 10px; border: 2px solid #7c3aed; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #ddd6fe; padding-bottom: 10px;">
                  <h4 style="margin: 0; color: #5b21b6; font-size: 1.15rem;"><i class="fa-solid fa-arrows-left-right" style="color: #7c3aed; margin-right: 8px;"></i> ${task.text || task.question || 'Historiographical Spectrum'}</h4>
                  <span style="background: #7c3aed; color: #ffffff; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Interpretation Spectrum</span>
                </div>
                ${task.instruction ? `<p style="font-size: 0.95rem; color: #6b21a8; font-style: italic; margin-top: 0; margin-bottom: 15px;">${task.instruction}</p>` : ''}
                <div style="background: #ffffff; border: 1px solid #ddd6fe; border-radius: 8px; padding: 18px; margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: 700; color: #4c1d95; margin-bottom: 12px;">
                    <span style="max-width: 45%;">${leftPole}</span>
                    <span style="max-width: 45%; text-align: right;">${rightPole}</span>
                  </div>
                  <input type="range" min="0" max="100" value="50" id="${specId}" style="width: 100%; cursor: pointer;" oninput="document.getElementById('${specId}-val').innerText = this.value + '%';">
                  <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #6b7280; margin-top: 6px;">
                    <span>0%</span><span>25%</span><span id="${specId}-val" style="font-weight: bold; color: #7c3aed;">50%</span><span>75%</span><span>100%</span>
                  </div>
                </div>
                <div style="margin-bottom: 10px;">
                  <label style="display: block; font-size: 0.9rem; font-weight: 700; color: #5b21b6; margin-bottom: 6px;">Justify your placement along this spectrum:</label>
                  <textarea style="width: 100%; box-sizing: border-box; min-height: 55px; padding: 8px; border: 1px solid #ddd6fe; border-radius: 6px; font-size: 0.9rem; font-family: inherit; resize: vertical;" placeholder="${task.starter || 'I have placed this at... because...'}"></textarea>
                </div>
              </div>
            `;
            return;
          }
          if (task.type === 'crucible_fork') {
            extrasHtml += `
              <div class="task-box crucible-fork-interactive" style="margin-bottom: 25px; background: #fff7ed; padding: 20px; border-radius: 10px; border: 2px solid #ea580c; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #fed7aa; padding-bottom: 10px;">
                  <h4 style="margin: 0; color: #9a3412; font-size: 1.15rem;"><i class="fa-solid fa-code-branch" style="color: #ea580c; margin-right: 8px;"></i> ${task.text || task.question || 'The Crucible Fork: Decision Dilemma'}</h4>
                  <span style="background: #ea580c; color: #ffffff; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Decision Dilemma</span>
                </div>
                ${task.instruction ? `<p style="font-size: 0.95rem; color: #c2410c; font-style: italic; margin-top: 0; margin-bottom: 15px;">${task.instruction}</p>` : ''}
                ${task.options && task.options.length > 0
                ? `
                  <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                    ${task.options
                  .map(
                    (opt, oIdx) => `
                      <label style="background: #ffffff; border: 1.5px solid #fed7aa; border-radius: 8px; padding: 12px; display: flex; align-items: flex-start; gap: 10px; cursor: pointer; transition: all 0.2s ease;">
                        <input type="radio" name="fork-${index}-${tIdx}" value="${oIdx}" style="margin-top: 3px;">
                        <div>
                          <strong style="color: #9a3412; font-size: 0.95rem;">Option ${String.fromCharCode(65 + oIdx)}: ${opt.title}</strong>
                          <p style="margin: 4px 0 0 0; font-size: 0.88rem; color: #475569; line-height: 1.4;">${opt.desc}</p>
                        </div>
                      </label>
                    `,
                  )
                  .join('')}
                  </div>
                `
                : ''
              }
                ${task.risk_prompt
                ? `
                  <div style="margin-bottom: 10px;">
                    <label style="display: block; font-size: 0.9rem; font-weight: 700; color: #9a3412; margin-bottom: 6px;">Calculated Risk: ${task.risk_prompt}</label>
                    <textarea style="width: 100%; box-sizing: border-box; min-height: 50px; padding: 8px; border: 1px solid #fed7aa; border-radius: 6px; font-size: 0.9rem; font-family: inherit; resize: vertical;" placeholder="${task.starter || 'The primary risk of this decision was...'}"></textarea>
                  </div>
                `
                : ''
              }
                ${task.historical_outcome
                ? `
                  <details style="margin-top: 10px;">
                    <summary style="cursor: pointer; color: #ea580c; font-weight: 600; font-size: 0.85rem;"><i class="fa-solid fa-clock-rotate-left"></i> Reveal Historical Reality</summary>
                    <div style="margin-top: 6px; padding: 10px 14px; background: #ffedd5; border-left: 3px solid #ea580c; border-radius: 4px; font-size: 0.92rem; color: #9a3412;">
                      <strong>What Actually Happened:</strong> ${task.historical_outcome}
                    </div>
                  </details>
                `
                : ''
              }
              </div>
            `;
            return;
          }
          if (
            task.type === 'significance_diamond' ||
            task.type === 'priority_matrix' ||
            task.type === 'factor_hierarchy'
          ) {
            extrasHtml += `
              <div class="task-box significance-diamond-interactive" style="margin-bottom: 25px; background: #ecfdf5; padding: 20px; border-radius: 10px; border: 2px solid #059669; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #a7f3d0; padding-bottom: 10px;">
                  <h4 style="margin: 0; color: #065f46; font-size: 1.15rem;"><i class="fa-solid fa-gem" style="color: #059669; margin-right: 8px;"></i> ${task.text || task.question || 'The Significance Diamond: Prioritising Catalysts'}</h4>
                  <span style="background: #059669; color: #ffffff; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Priority Diamond</span>
                </div>
                ${task.instruction ? `<p style="font-size: 0.95rem; color: #047857; font-style: italic; margin-top: 0; margin-bottom: 15px;">${task.instruction}</p>` : ''}
                ${task.factors && task.factors.length > 0
                ? `
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div style="background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 8px; padding: 12px;">
                      <strong style="color: #065f46; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">Historical Factors Bank:</strong>
                      <div style="display: flex; flex-direction: column; gap: 6px;">
                        ${task.factors
                  .map(
                    (f, fIdx) => `
                          <div style="background: #f0fdf4; border: 1px solid #6ee7b7; border-radius: 6px; padding: 8px 10px; display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #065f46;">
                            <span style="background: #059669; color: #ffffff; font-weight: bold; font-size: 0.75rem; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">${String.fromCharCode(65 + fIdx)}</span>
                            <span>${typeof f === 'string' ? f : f.title || f.name}</span>
                          </div>
                        `,
                  )
                  .join('')}
                      </div>
                    </div>
                    <div style="background: #ffffff; border: 1.5px solid #a7f3d0; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
                      <div style="text-align: center; width: 100%;">
                        <div style="font-size: 0.72rem; font-weight: 700; color: #047857; text-transform: uppercase;">Top Catalyst (#1 Decisive)</div>
                        <div style="max-width: 180px; margin: 4px auto 0 auto; height: 32px; border: 2px solid #059669; background: #d1fae5; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #065f46; font-size: 0.88rem;">#1 (Slot Factor)</div>
                      </div>
                      <div style="display: flex; gap: 10px; width: 100%; justify-content: center;">
                        <div style="text-align: center; flex: 1;">
                          <div style="font-size: 0.7rem; color: #047857;">Contributing Factor</div>
                          <div style="height: 30px; border: 1.5px dashed #059669; background: #f0fdf4; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; color: #047857;">#2</div>
                        </div>
                        <div style="text-align: center; flex: 1;">
                          <div style="font-size: 0.7rem; color: #047857;">Contributing Factor</div>
                          <div style="height: 30px; border: 1.5px dashed #059669; background: #f0fdf4; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; color: #047857;">#3</div>
                        </div>
                      </div>
                      <div style="text-align: center; width: 100%;">
                        <div style="font-size: 0.7rem; color: #64748b;">Marginal / Secondary Factor</div>
                        <div style="max-width: 180px; margin: 4px auto 0 auto; height: 30px; border: 1.5px dashed #94a3b8; background: #f8fafc; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; color: #64748b;">#4</div>
                      </div>
                    </div>
                  </div>
                `
                : ''
              }
                <div style="margin-top: 10px;">
                  <label style="display: block; font-size: 0.9rem; font-weight: 700; color: #065f46; margin-bottom: 6px;">Evaluative Justification: ${task.justification_prompt || 'Explain why your #1 factor outweighs the others:'}</label>
                  <textarea style="width: 100%; box-sizing: border-box; min-height: 55px; padding: 8px; border: 1px solid #a7f3d0; border-radius: 6px; font-size: 0.9rem; font-family: inherit; resize: vertical;" placeholder="${task.starter || 'Factor A was the decisive catalyst because...'}"></textarea>
                </div>
              </div>
            `;
            return;
          }
          if (task.type === 'extended_writing' && task.scaffolding) {
            const ansId = `ans-emb-${index}-${tIdx}`;
            const scaf = task.scaffolding || {};
            const structureStrip =
              scaf.structure_strip && scaf.structure_strip.length > 0
                ? scaf.structure_strip
                : task.hints && task.hints.length > 0
                  ? task.hints.map((h) => ({
                    col: h.label || 'PEEL Step',
                    prompt: h.prompt || h.text || h,
                  }))
                  : (scaf.matrix || []).map((m) => ({ col: m.col, prompt: m.text || m.prompt }));
            const starters = scaf.sentence_starters || [];
            const rawConnectives = scaf.connective_bank || scaf.causal_connectives || [];
            const connectives = Array.isArray(rawConnectives)
              ? rawConnectives
              : typeof rawConnectives === 'string'
                ? rawConnectives
                  .split('•')
                  .map((s) => s.trim())
                  .filter(Boolean)
                : [];
            const words = scaf.word_bank || [];
            const criteria = scaf.evaluative_criteria || [];
            const isLocalKs2 = checkIsKs2(unitId, activeUnit);
            const isLocalKs3 = checkIsKs3(unitId, activeUnit);
            const badgeText = isLocalKs2
              ? 'Key Stage 2 Historian Challenge'
              : isLocalKs3
                ? 'KS3 Analytical Masterclass'
                : 'GCSE Analytical Masterclass';
            const vocabBadgeText = isLocalKs2
              ? 'Historian Word Bank'
              : isLocalKs3
                ? 'Core Disciplinary Vocabulary'
                : 'GCSE Key Vocabulary Bank';
            const questionTitle =
              task.title ||
              task.question ||
              task.text ||
              (isKs2 ? 'Historian Writing Challenge' : 'Extended Analytical Writing');
            const actualPrompt = task.prompt || task.question || task.text || '';

            extrasHtml += `
              <div class="task-box extended-writing-box" style="margin-bottom: 25px; background: #ffffff; padding: 22px; border-radius: 10px; border: 2px solid #0284c7; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.12);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 2px solid #e0f2fe; padding-bottom: 12px;">
                  <h4 style="margin: 0; color: #0369a1; font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-feather-pointed" style="color: #0284c7;"></i>
                    <span>${window.formatBold ? window.formatBold(questionTitle) : questionTitle}</span>
                  </h4>
                  <span style="background: #0284c7; color: #ffffff; font-size: 0.72rem; font-weight: 800; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">${badgeText}</span>
                </div>

                ${actualPrompt
                ? `
                  <div class="extended-writing-prompt" style="font-size: 1.08rem; font-weight: 700; color: #0f172a; margin-bottom: 16px; line-height: 1.5; background: #f0f9ff; padding: 14px 18px; border-left: 4px solid #0284c7; border-radius: 6px;">
                    <span style="display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #0284c7; margin-bottom: 4px; font-weight: 800;">Enquiry Question:</span>
                    <div>${window.formatBold ? window.formatBold(actualPrompt) : actualPrompt}</div>
                    ${task.stimulus && task.stimulus.length > 0
                  ? `
                      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 10px; font-size: 0.85rem; color: #334155;">
                        <strong style="color: #0369a1; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.5px;">Stimulus:</strong>
                        ${task.stimulus.map((st) => `<span style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.82rem;">${st}</span>`).join('')}
                        <span style="font-style: italic; font-size: 0.78rem; color: #64748b;">(You must also use information of your own)</span>
                      </div>
                    `
                  : ''
                }
                  </div>
                `
                : ''
              }

                ${scaf.guidance ? `<p style="font-size: 0.95rem; color: #334155; margin-top: 0; margin-bottom: 16px; line-height: 1.5;">${scaf.guidance}</p>` : ''}

                ${structureStrip.length > 0
                ? `
                  <div style="margin-bottom: 18px;">
                    <div style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #0284c7; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                      <i class="fa-solid fa-layer-group"></i> Analytical Structure Strip
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px;">
                      ${structureStrip
                  .map((step, sIdx) => {
                    const isScholar =
                      step.col && (step.col.includes('Scholar') || step.col.includes('★'));
                    const borderCol = isScholar
                      ? '#8b5cf6'
                      : sIdx === 0
                        ? '#0284c7'
                        : sIdx === 1
                          ? '#059669'
                          : '#d97706';
                    const bgCol = isScholar ? '#fbf7ff' : '#f8fafc';
                    const badgeCol = isScholar ? '#7c3aed' : borderCol;
                    return `
                          <div style="background: ${bgCol}; border: 1.5px solid ${borderCol}; border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                              <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: ${badgeCol}; margin-bottom: 4px;">
                                ${step.col}
                              </div>
                              <div style="font-size: 0.84rem; color: #1e293b; line-height: 1.4; margin-bottom: 8px;">
                                ${step.prompt || step.text}
                              </div>
                            </div>
                            ${step.starter
                        ? `
                              <div style="font-size: 0.78rem; font-style: italic; color: #475569; border-left: 2px solid ${badgeCol}; padding-left: 6px; margin-top: 4px;">
                                "${step.starter}"
                              </div>
                            `
                        : ''
                      }
                          </div>
                        `;
                  })
                  .join('')}
                    </div>
                  </div>
                `
                : ''
              }

                ${criteria.length > 0
                ? `
                  <div style="margin-bottom: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px;">
                    <strong style="display: block; font-size: 0.78rem; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; margin-bottom: 6px;">
                      <i class="fa-solid fa-scale-balanced" style="color: #0284c7; margin-right: 6px;"></i> Evaluative Criteria &amp; Evidence Checklist
                    </strong>
                    <ul style="margin: 0; padding-left: 18px; font-size: 0.85rem; color: #334155; line-height: 1.5;">
                      ${criteria.map((c) => `<li style="margin-bottom: 4px;">${window.formatBold ? window.formatBold(c) : c}</li>`).join('')}
                    </ul>
                  </div>
                `
                : ''
              }

                ${starters.length > 0 || connectives.length > 0 || words.length > 0
                ? `
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; margin-bottom: 16px;">
                    ${words.length > 0
                  ? `
                      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px;">
                        <strong style="display: block; font-size: 0.75rem; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; margin-bottom: 6px;">
                          ${vocabBadgeText}
                        </strong>
                        <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                          ${words.map((w) => `<span style="background: #e2e8f0; color: #1e293b; font-size: 0.74rem; font-weight: 600; padding: 2px 7px; border-radius: 4px;">${w}</span>`).join('')}
                        </div>
                      </div>
                    `
                  : ''
                }
                    ${connectives.length > 0
                  ? `
                      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 12px;">
                        <strong style="display: block; font-size: 0.75rem; text-transform: uppercase; color: #15803d; letter-spacing: 0.5px; margin-bottom: 6px;">
                          Causal Connectives Bank
                        </strong>
                        <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                          ${connectives.map((c) => `<span style="background: #dcfce7; color: #166534; font-size: 0.74rem; font-weight: 600; padding: 2px 7px; border-radius: 4px;">${c}</span>`).join('')}
                        </div>
                      </div>
                    `
                  : ''
                }
                  </div>
                `
                : ''
              }

                ${starters.length > 0
                ? `
                  <details style="margin-bottom: 14px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 8px 12px;">
                    <summary style="cursor: pointer; font-size: 0.84rem; font-weight: 700; color: #1d4ed8;"><i class="fa-solid fa-pen-fancy"></i> Expand Master Sentence Starters Bank (${starters.length} prompts)</summary>
                    <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 0.85rem; color: #1e40af; line-height: 1.5;">
                      ${starters.map((s) => `<li style="margin-bottom: 4px;">${s}</li>`).join('')}
                    </ul>
                  </details>
                `
                : ''
              }

                <div style="margin-bottom: 14px;">
                  <label style="display: block; font-size: 0.88rem; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Pupil Extended Writing Area:</label>
                  <textarea style="width: 100%; box-sizing: border-box; min-height: 130px; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; line-height: 1.6; font-family: inherit; resize: vertical;" placeholder="Compose your 3-paragraph historical evaluation here using the structure strip and connectives..."></textarea>
                </div>

                <div>
                  <button class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-reveal" data-action="toggle-element" data-target-id="${ansId}"><i class="fa-solid fa-eye"></i> Reveal Master Model Answer</button>
                  <div class="answer" id="${ansId}" style="display: none; margin-top: 12px; background: #fffbeb; padding: 14px 16px; border-left: 4px solid #b45309; border-radius: 4px; color: #451a03; line-height: 1.7; font-size: 0.95rem;">
                    <div style="font-weight: 800; font-size: 0.8rem; text-transform: uppercase; color: #92400e; margin-bottom: 6px; letter-spacing: 0.5px;">Master Model Answer:</div>
                    ${task.model_answer || task.model || task.answer || ''}
                  </div>
                </div>
              </div>
            `;
            return;
          }
          const qPrefix = task.qNum ? `Q${task.qNum}. ` : '';
          const taskPrompt = task.text || task.question || task.instructions || task.prompt || '';
          const cleanTaskText = taskPrompt.replace(/^Q\d+[\.\:]\s*/i, '');
          const taskTitle =
            task.title && task.title !== taskPrompt && !cleanTaskText.startsWith(task.title)
              ? task.title
              : '';
          const titleHtml = taskTitle
            ? `<div style="font-weight: 800; font-size: 0.92rem; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">${window.formatBold(taskTitle)}</div>`
            : '';
          const ansId = `ans-emb-${index}-${tIdx}`;
          const starterText =
            task.starter ||
            task.sentence_starter ||
            (task.scaffolding && (task.scaffolding.starter || task.scaffolding.sentence_starter));
          const starterBtn = starterText
            ? `<button class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-starter" data-action="toggle-element" data-target-id="starter-${ansId}"><i class="fa-solid fa-pen"></i> Starter</button>`
            : '';
          const starterDiv = starterText
            ? `<div class="starter-box" id="starter-${ansId}" style="display: none; margin-top: 8px; background: #f0f9ff; padding: 10px; border-left: 3px solid #0284c7; font-style: italic; color: #0c4a6e; transition: all 0.3s ease;">${starterText}</div>`
            : '';
          let flowchartHtml = '';
          if (task.flowchart) {
            const fc = task.flowchart;
            flowchartHtml = `
              <div class="dual-coding-flowchart" style="margin: 10px 0 16px 0; padding: 12px 14px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px;">
                <div style="font-weight: 800; font-size: 0.92rem; color: #0f172a; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                  <span>${fc.title}</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                  ${fc.steps
                .map(
                  (s, sIdx) => `
                    <div style="background: white; border: 1px solid #cbd5e1; border-top: 3.5px solid ${sIdx === 0 ? '#0284c7' : sIdx === 1 ? '#d97706' : '#dc2626'}; border-radius: 6px; padding: 10px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <span style="font-weight: 800; font-size: 0.78rem; background: #f1f5f9; color: #334155; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">${s.num}</span>
                        <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: ${sIdx === 0 ? '#0284c7' : sIdx === 1 ? '#d97706' : '#dc2626'}; background: #f8fafc; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0;">${s.badge}</span>
                      </div>
                      <div style="font-weight: 700; font-size: 0.85rem; color: #0f172a; margin-bottom: 3px;">${s.title}</div>
                      <div style="font-size: 0.78rem; color: #475569; line-height: 1.35;">${s.desc}</div>
                    </div>
                  `,
                )
                .join('')}
                </div>
              </div>
            `;
          }
          extrasHtml += `
               <div style="margin-bottom: 14px;">
                 ${flowchartHtml}
                 ${titleHtml}
                 <div style="font-size: 1.05rem; line-height: 1.6; color: #1e293b; margin-bottom: 8px;">${window.formatBold(qPrefix + cleanTaskText)}</div>
                 <button class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-reveal" data-action="toggle-element" data-target-id="${ansId}"><i class="fa-solid fa-eye"></i> Show</button>
                 ${starterBtn}
                 ${starterDiv}
                 <div class="answer" id="${ansId}" style="display: none; margin-top: 8px; background: white; padding: 10px; border-left: 3px solid #b45309; font-style: italic; color: #451a03; line-height: 1.6;">${window.formatBold(task.model || task.model_answer || task.answer || '')}</div>
               </div>
             `;
        });
        extrasHtml += `</div>`;

        if (block.flashcards && block.flashcards.length > 0) {
          extrasHtml += `<div style="margin-top: 20px; padding: 20px; background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px;"><div class="flashcard-deck">`;
          block.flashcards.forEach((fc) => {
            let t = fc.term || fc.word || fc.title || '';
            let d = fc.definition || fc.meaning || fc.desc || '';
            extrasHtml += `
                <div class="flashcard-wrapper" data-action="flip-card-wrapper">
                  <div class="flashcard-inner">
                    <div class="flashcard-face flashcard-front">
                      <h4>${t}</h4>
                      <p style="font-size: 0.9rem; margin-top: 10px;">Tap to reveal</p>
                    </div>
                    <div class="flashcard-face flashcard-back">
                      ${d}
                    </div>
                  </div>
                </div>
              `;
          });
          extrasHtml += `</div></div>`;
        }
      }

      let isSideQuest =
        styledContent.includes('</details>') && block.title && block.title.includes('Side Quest');
      if (isSideQuest) {
        styledContent = styledContent.replace('</details>', extrasHtml + '</details>');
        extrasHtml = '';
        // Rewrite the actual styledContent in the narrative chunk manually below
      }

      htmlNarrative += extrasHtml;

      // REC-002: Act-Level Anchoring of Key Figures
      if (lesson.key_individual && !renderedKeyIndividual) {
        const ki = lesson.key_individual;
        const totalBlocks = lesson.narrative_blocks.length;
        let isAnchor = false;
        if (
          ki.anchor_act &&
          (ki.anchor_act === index + 1 ||
            (index + 1 === totalBlocks && ki.anchor_act > totalBlocks))
        ) {
          isAnchor = true;
        } else if (ki.anchor_block && ki.anchor_block === index + 1) {
          isAnchor = true;
        } else if (
          ki.anchor_title &&
          block.title &&
          block.title.toLowerCase().includes(ki.anchor_title.toLowerCase())
        ) {
          isAnchor = true;
        } else if (index === totalBlocks - 1 && !ki.anchor_act && !ki.anchor_block) {
          isAnchor = true;
        }

        if (isAnchor) {
          const kiCardHtml = generateKeyIndividualEmbedHTML
            ? generateKeyIndividualEmbedHTML(ki, ki.anchor_title)
            : `<div>${ki.name}</div>`;
          htmlNarrative += `
            <div class="key-individual-lesson-section" data-anchor-act="${index + 1}" style="margin: 6px 0;">
              <div class="key-individual-embed" style="margin: 0;">
                ${kiCardHtml}
              </div>
            </div>
          `;
          renderedKeyIndividual = true;
        }
      }

      if (block.interactive_hotspot_map && !block.stage_hook_map) {
        htmlNarrative += renderInteractiveHotspotMapHTML(block.interactive_hotspot_map, index);
      }
      if (block.photo_slider) {
        htmlNarrative += renderPhotoSliderHTML(block.photo_slider);
      }

      // Stop-the-Clock Oral Hinge between narrative stage N and N+1 when lesson.pair_share.after_stage is set
      if (
        !renderedOralHinge &&
        lesson.pair_share &&
        typeof lesson.pair_share === 'object' &&
        Number.isFinite(Number(lesson.pair_share.after_stage)) &&
        Number(lesson.pair_share.after_stage) >= 1 &&
        lesson.narrative_blocks.length > 1
      ) {
        const clampedAfterStage = Math.min(
          Math.max(1, Math.round(Number(lesson.pair_share.after_stage))),
          lesson.narrative_blocks.length - 1,
        );
        if (index + 1 === clampedAfterStage) {
          htmlNarrative += renderStopTheClockHingeHTML(lesson.pair_share, clampedAfterStage);
          renderedOralHinge = true;
        }
      }
    });
    htmlNarrative += '</div>';

    if (lesson.key_individual && !renderedKeyIndividual) {
      const ki = lesson.key_individual;
      const kiCardHtml = generateKeyIndividualEmbedHTML
        ? generateKeyIndividualEmbedHTML(ki, ki.anchor_title)
        : `<div>${ki.name}</div>`;
      htmlNarrative += `
        <div class="key-individual-lesson-section" style="margin: 6px 0;">
          <div class="key-individual-embed" style="margin: 0;">
            ${kiCardHtml}
          </div>
        </div>
      `;
    }

    if (!isTrip) {
      if (lesson.tasks && lesson.tasks.length > 0) {
        const hasModels = lesson.tasks.some(
          (t) =>
            !!(
              t.model ||
              t.model_answer ||
              t.answer ||
              (t.feature_1 && t.feature_1.model) ||
              (t.because && t.because.model)
            ),
        );

        const revealBtn = hasModels
          ? `<button type="button" class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-model" data-action="reveal-all-models" style="padding: 5px 10px; font-size: 0.78rem;"><i class="fa-solid fa-magnifying-glass"></i> Reveal Models</button>`
          : '';

        const isWorkbookTask =
          !lesson.exam_practice &&
          (isKs2 ||
            isKs3 ||
            (!isGCSE &&
              lesson.tasks.some(
                (t) =>
                  t.type === 'extended_writing' ||
                  (t.topic && (t.topic.includes('Marks') || t.topic.includes('Disciplinary'))) ||
                  (t.question && t.question.includes('Explain why')),
              )));

        const stationTitle = isKs2
          ? 'Historian Writing Challenges &bull; Key Stage 2'
          : isKs3
            ? 'Pupil Workbook Activities &bull; Key Stage 3'
            : 'Pupil Workbook Activities';

        const wbMapEntry =
          WORKBOOK_PAGE_MAP?.[unitId]?.[lesson.id] ||
          WORKBOOK_PAGE_MAP?.[unitId]?.[`lesson_${currentIndex + 1}`];
        const wbPageNum = wbMapEntry?.page
          ? wbMapEntry.page + 1
          : isKs2
            ? 3 + currentIndex * 2
            : isKs3
              ? (currentIndex < 3 ? 3 + currentIndex * 2 : 5 + currentIndex * 2)
              : null;

        htmlTasks += `
          ${emitWbStylesOnce()}
          <div class="wb-unified-station phase-card">
            <div class="wb-station-header">
              <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1 1 auto;">
                <div style="width: 34px; height: 34px; border-radius: 8px; background: #10b981; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.98rem; flex-shrink: 0; box-shadow: 0 2px 5px rgba(16, 185, 129, 0.25);">
                  <i class="fa-solid fa-book-open"></i>
                </div>
                <div style="min-width: 0;">
                  <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.05rem; font-weight: 800; color: #0f172a; line-height: 1.2;">${stationTitle}</div>
                  <div style="font-size: 0.73rem; color: #64748b; font-weight: 600;">${isKs2 ? 'Click any Historian Challenge below to open your writing space, clues &amp; helpful sentence starters' : 'Select any workbook task strip below to open writing space &amp; scaffolding'}</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex-shrink: 0;">
                <span class="wb-origin-pill wb-origin-green">
                  <i class="fa-solid fa-book-open"></i> ${isKs2 ? `${lesson.tasks.length} Writing Challenges` : `${lesson.tasks.length} in Workbook`}
                </span>
                ${revealBtn}
                <button type="button" onclick="window.toggleAllWorkbookStrips && window.toggleAllWorkbookStrips(this)" style="background: #ffffff; color: #334155; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 10px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
                  <i class="fa-solid fa-expand"></i> Expand All
                </button>
              </div>
            </div>
            <div class="wb-strips-stack">
        `;

        const renderSingleKs3TaskBody = (task, tIdx) => {
          let htmlTasks = '';
          (() => {
          if (task.type === 'because_but_so' || task.type === 'sentence_expansion') {
            htmlTasks += renderBecauseButSoTaskHTML(task, currentIndex, tIdx, unitId);
            return;
          }
          if (task.type === 'source_utility' || task.taskType === 'source_utility') {
            htmlTasks += renderSourceUtilityTaskHTML(task, currentIndex, tIdx, unitId, lesson);
            return;
          }
          if (
            task.type === 'historical_interpretations' ||
            task.taskType === 'historical_interpretations'
          ) {
            htmlTasks += renderHistoricalInterpretationsTaskHTML(
              task,
              currentIndex,
              tIdx,
              unitId,
              lesson,
            );
            return;
          }
          if (task.type === 'drag_drop_timeline') {
            const timelineId = `dd-timeline-lesson-${tIdx}`;
            htmlTasks += `<div id="${timelineId}" style="margin-bottom: 20px;"></div>`;
            window.postRenderHooks.push(() => {
              import('../drag_drop_timeline.js').then((mod) => {
                mod.initDragDropTimeline(document.getElementById(timelineId), task);
              });
            });
            return;
          }
          if (task.type === 'interactive_map') {
            const mapId = `interactive-map-lesson-${tIdx}`;
            htmlTasks += `<div id="${mapId}" style="margin-bottom: 20px;"></div>`;
            window.postRenderHooks.push(() => {
              import('../interactive_map.js').then((mod) => {
                mod.initInteractiveMap(document.getElementById(mapId), task);
              });
            });
            return;
          }
          if (task.type === 'two_sided_argument') {
            const hasTaskPrefix = task.topic && /^Task\s*\d+/i.test(task.topic);
            const isLocalKs2 = checkIsKs2(unitId, activeUnit);
            const isLocalKs3 = checkIsKs3(unitId, activeUnit);
            const qNumPrefix =
              task.qNum && !hasTaskPrefix && !isLocalKs3 && !isLocalKs2 ? `Q${task.qNum}. ` : '';
            const adv = task.advancement || {};
            const lim = task.limitations || {};
            const advTitle =
              adv.title ||
              (isLocalKs2 ? 'Successes & Advances' : 'Advancement & Progress (Change)');
            const limTitle =
              lim.title ||
              (isLocalKs2
                ? 'Challenges & Obstacles'
                : 'Critical Limitations & Stagnation (Continuity)');
            const advPoints = adv.points || [];
            const limPoints = lim.points || [];
            const advStarter = adv.starter || adv.sentence_starter || '';
            const limStarter = lim.starter || lim.sentence_starter || '';
            const synthesisPrompt =
              task.synthesis_prompt ||
              task.question ||
              (isLocalKs2
                ? 'Write your historian answer weighing up both sides.'
                : 'Write a balanced analytical paragraph evaluating both sides.');
            const connectives =
              task.synthesis_connectives ||
              (isLocalKs2
                ? [
                  'On the one hand...',
                  'For example...',
                  'On the other hand...',
                  'This was important because...',
                  'Overall, I think that...',
                ]
                : [
                  'On the one hand...',
                  'For example...',
                  'On the other hand...',
                  'Consequently...',
                  'Overall, while...',
                ]);
            const modelAnswer =
              task.model_answer || task.model || task.exemplar || task.wagoll || task.answer || '';
            const targetBadge = isLocalKs2
              ? `<span style="background: #1e3a8a; color: #ffffff; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-award" style="color: #93c5fd;"></i> Key Stage 2 Historian Investigation</span>`
              : isLocalKs3
                ? `<span style="background: #0f766e; color: #ffffff; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-bridge" style="color: #5eead4;"></i> Planning Bridge &bull; Evidence Extraction</span>`
                : `<span style="background: #0f766e; color: #ffffff; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-bullseye" style="color: #5eead4;"></i> Target: Paper 1 Q5/Q6 Evaluative Essay [16+4 Marks]</span>`;
            const synthesisTitle = isLocalKs2
              ? `<i class="fa-solid fa-pen-nib"></i> Paragraph Builder: Historian Writing`
              : isLocalKs3
                ? `<i class="fa-solid fa-pen-nib"></i> Paragraph Builder &bull; Evaluative Synthesis`
                : `<i class="fa-solid fa-pen-nib"></i> GCSE Paragraph Builder: Evaluative Synthesis`;
            const placeholderText = isLocalKs2
              ? 'Use the clues and evidence above to write your historian explanation...'
              : isLocalKs3
                ? 'Combine the evidence and counter-evidence above to write your complex, balanced analytical paragraph...'
                : 'Combine the evidence and counter-evidence above to write your complex, balanced GCSE exam paragraph...';

            htmlTasks += `
              <div class="task-box two-sided-argument-interactive" style="margin-bottom: 4px; background: #ffffff; padding: 4px 0 0 0;">
                <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                  <button type="button" class="btn-reveal-all-t3 no-print" onclick="window.toggleTask3Mask && window.toggleTask3Mask(this)" style="background: #ecfdf5; border: 1.5px solid #6ee7b7; color: #065f46; font-size: 0.78rem; font-weight: 700; padding: 4px 10px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;">
                    <i class="fa-solid fa-chalkboard-user"></i> <span>Teacher Whiteboard Key</span>
                  </button>
                </div>
                ${task.instruction ? `<p style="font-size: 0.92rem; color: #475569; font-style: italic; margin-top: 0; margin-bottom: 12px;">${task.instruction}</p>` : ''}
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 16px;">
                  <!-- Side 1: Advancement / Progress -->
                  <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; padding: 14px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #86efac; padding-bottom: 6px; margin-bottom: 10px;">
                      <h5 style="margin: 0; color: #166534; font-size: 1rem; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-arrow-trend-up"></i> ${advTitle}
                      </h5>
                      <span style="font-size: 0.72rem; color: #15803d; font-weight: 700; text-transform: uppercase;">Tap to Reveal</span>
                    </div>
                    <ul style="margin: 0 0 12px 0; padding: 0; list-style: none;">
                      ${advPoints
                .map(
                  (pt, pIdx) => `
                        <li class="t3-evidence-item" onclick="window.toggleSingleEvidence && window.toggleSingleEvidence(this)" style="margin-bottom: 8px; cursor: pointer; transition: all 0.15s ease;">
                          <div style="background: #ffffff; border: 1.5px dashed #86efac; border-radius: 6px; padding: 8px 10px; display: flex; align-items: flex-start; gap: 8px;">
                            <span style="background: #dcfce7; color: #166534; font-size: 0.75rem; font-weight: 800; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">${pIdx + 1}</span>
                            <div style="flex: 1;">
                              <span class="t3-evidence-prompt" style="font-size: 0.85rem; font-weight: 700; color: #15803d; display: flex; align-items: center; justify-content: space-between;">
                                <span>Evidence Point ${pIdx + 1} &bull; Click to Reveal</span>
                                <i class="fa-solid fa-eye" style="font-size: 0.8rem; opacity: 0.7;"></i>
                              </span>
                              <div class="t3-evidence-revealed" style="display: none; font-size: 0.9rem; color: #1e293b; line-height: 1.45;">
                                ${pt}
                              </div>
                            </div>
                          </div>
                        </li>
                      `,
                )
                .join('')}
                    </ul>
                    ${advStarter
                ? `
                      <div class="t3-starter-box" onclick="window.toggleSingleStarter && window.toggleSingleStarter(this)" style="cursor: pointer; padding: 8px 10px; background: #ffffff; border-left: 3px solid #22c55e; border-radius: 4px; font-size: 0.85rem; color: #15803d; font-style: italic; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
                        <span class="t3-starter-prompt" style="font-weight: 700; display: flex; align-items: center; justify-content: space-between;">
                          <span><i class="fa-solid fa-pen"></i> Evidence Sentence Stem (Click to Reveal)</span>
                          <i class="fa-solid fa-eye" style="font-size: 0.8rem;"></i>
                        </span>
                        <span class="t3-starter-revealed" style="display: none;"><strong>Evidence Stem:</strong> &ldquo;${advStarter}&rdquo;</span>
                      </div>
                    `
                : ''
              }
                  </div>

                  <!-- Side 2: Limitations / Continuity -->
                  <div style="background: #fff1f2; border: 1.5px solid #fecdd3; border-radius: 8px; padding: 14px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #fecdd3; padding-bottom: 6px; margin-bottom: 10px;">
                      <h5 style="margin: 0; color: #9f1239; font-size: 1rem; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-hand"></i> ${limTitle}
                      </h5>
                      <span style="font-size: 0.72rem; color: #be123c; font-weight: 700; text-transform: uppercase;">Tap to Reveal</span>
                    </div>
                    <ul style="margin: 0 0 12px 0; padding: 0; list-style: none;">
                      ${limPoints
                .map(
                  (pt, pIdx) => `
                        <li class="t3-evidence-item" onclick="window.toggleSingleEvidence && window.toggleSingleEvidence(this)" style="margin-bottom: 8px; cursor: pointer; transition: all 0.15s ease;">
                          <div style="background: #ffffff; border: 1.5px dashed #fecdd3; border-radius: 6px; padding: 8px 10px; display: flex; align-items: flex-start; gap: 8px;">
                            <span style="background: #ffe4e6; color: #9f1239; font-size: 0.75rem; font-weight: 800; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">${pIdx + 1}</span>
                            <div style="flex: 1;">
                              <span class="t3-evidence-prompt" style="font-size: 0.85rem; font-weight: 700; color: #be123c; display: flex; align-items: center; justify-content: space-between;">
                                <span>Counter-Evidence ${pIdx + 1} &bull; Click to Reveal</span>
                                <i class="fa-solid fa-eye" style="font-size: 0.8rem; opacity: 0.7;"></i>
                              </span>
                              <div class="t3-evidence-revealed" style="display: none; font-size: 0.9rem; color: #1e293b; line-height: 1.45;">
                                ${pt}
                              </div>
                            </div>
                          </div>
                        </li>
                      `,
                )
                .join('')}
                    </ul>
                    ${limStarter
                ? `
                      <div class="t3-starter-box" onclick="window.toggleSingleStarter && window.toggleSingleStarter(this)" style="cursor: pointer; padding: 8px 10px; background: #ffffff; border-left: 3px solid #f43f5e; border-radius: 4px; font-size: 0.85rem; color: #be123c; font-style: italic; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
                        <span class="t3-starter-prompt" style="font-weight: 700; display: flex; align-items: center; justify-content: space-between;">
                          <span><i class="fa-solid fa-pen"></i> Counter-Sentence Stem (Click to Reveal)</span>
                          <i class="fa-solid fa-eye" style="font-size: 0.8rem;"></i>
                        </span>
                        <span class="t3-starter-revealed" style="display: none;"><strong>Counter-Stem:</strong> &ldquo;${limStarter}&rdquo;</span>
                      </div>
                    `
                : ''
              }
                  </div>
                </div>

                <!-- Synthesis: Paragraph Builder -->
                <div style="background: #fffbeb; border: 1.5px solid #fcd34d; border-radius: 8px; padding: 14px;">
                  <h5 style="margin: 0 0 8px 0; color: #92400e; font-size: 1rem; display: flex; align-items: center; gap: 6px;">
                    ${synthesisTitle}
                  </h5>
                  <p style="font-size: 0.92rem; color: #78350f; font-weight: 600; margin: 0 0 10px 0;">${synthesisPrompt}</p>
                  
                  <details class="support-connectives-drawer no-print" style="margin-bottom: 12px; background: #ffffff; border: 1px solid #fde68a; border-radius: 6px; padding: 6px 12px;" closed>
                    <summary style="cursor: pointer; font-size: 0.8rem; font-weight: 700; color: #92400e; display: flex; align-items: center; justify-content: space-between; user-select: none;">
                      <span><i class="fa-solid fa-lightbulb"></i> Analytical Connectives (Click to Expand)</span>
                      <span style="font-size: 0.72rem; color: #b45309;"><i class="fa-solid fa-chevron-down"></i> Expand</span>
                    </summary>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
                      ${connectives.map((c) => `<button type="button" class="connective-chip" data-connective="${c.replace(/"/g, '&quot;')}" style="background: #fffbeb; border: 1px solid #fde68a; color: #b45309; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease;" title="Click to insert at cursor">${c}</button>`).join('')}
                    </div>
                  </details>

                  <textarea class="interactive-textarea" style="width: 100%; box-sizing: border-box; min-height: 90px; padding: 10px; border: 1px solid #fde68a; border-radius: 6px; font-size: 0.92rem; font-family: inherit; resize: vertical;" placeholder="${placeholderText}"></textarea>

                  ${modelAnswer
                ? `
                    <details class="model-paragraph-reveal" style="margin-top: 12px; border: 1px dashed #d97706; border-radius: 6px; padding: 8px 12px; background: #fffbeb;">
                      <summary style="cursor: pointer; color: #b45309; font-weight: 700; font-size: 0.88rem; outline: none; display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-eye"></i> ${isLocalKs2 ? '[ Show Model Historian Answer ]' : isLocalKs3 ? '[ Show Model Analytical Response ]' : '[ Show Examiner-Grade Model Paragraph ]'}</summary>
                      <div class="scaffold-box model-box" style="margin-top: 10px; padding: 12px 15px; background: #ffffff; border-left: 3px solid #f59e0b; border-radius: 4px; font-size: 0.92rem; color: #78350f; line-height: 1.6; border: 1px solid #fde68a;">
                        ${modelAnswer}
                      </div>
                    </details>
                  `
                : ''
              }
                </div>
              </div>
            `;
            return;
          }
          if (task.type === 'two_features') {
            const taskTitle =
              task.tariff ||
              task.title ||
              task.topic ||
              'Short Historical Focus • Two Key Features (2 Sentences • 5 mins)';
            const f1 = task.feature_1 || {
              prompt:
                'Feature 1: Identify one key feature and provide supporting historical detail.',
              starter: 'One key feature was... Specifically, this involved...',
              model: '',
            };
            const f2 = task.feature_2 || {
              prompt:
                'Feature 2: Identify a second key feature and provide supporting historical detail.',
              starter: 'A second key feature was... For example, this meant that...',
              model: '',
            };

            htmlTasks += `
              <div class="task-box two-features-task-card" style="margin-bottom: 4px; background: #ffffff;">
                <!-- Feature 1 -->
                <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 14px;">
                  <div style="font-weight: 800; color: #0369a1; font-size: 0.92rem; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                    <span style="background: #0284c7; color: #fff; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem;">1</span>
                    ${f1.prompt || 'Feature 1: Identify one key feature and provide supporting historical detail.'}
                  </div>
                  ${f1.starter ? `<div style="font-size: 0.82rem; color: #64748b; font-style: italic; margin-bottom: 6px;"><strong>Starter:</strong> &ldquo;${f1.starter}&rdquo;</div>` : ''}
                  <textarea class="interactive-textarea student-answer-input" style="width: 100%; box-sizing: border-box; min-height: 75px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.92rem; line-height: 1.5;" placeholder="${f1.starter || 'One key feature was... Specifically, this involved...'}"></textarea>
                  ${f1.model
                ? `
                    <details class="two-features-model" style="margin-top: 8px;">
                      <summary style="cursor: pointer; color: #0369a1; font-weight: 700; font-size: 0.82rem;"><i class="fa-solid fa-eye"></i> [ Reveal Feature 1 Model ]</summary>
                      <div style="margin-top: 6px; padding: 10px; background: #ffffff; border-left: 3px solid #0284c7; border-radius: 4px; font-size: 0.88rem; color: #1e293b; line-height: 1.5;">${formatBold ? formatBold(f1.model) : f1.model}</div>
                    </details>
                  `
                : ''
              }
                </div>

                <!-- Feature 2 -->
                <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 14px;">
                  <div style="font-weight: 800; color: #0369a1; font-size: 0.92rem; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                    <span style="background: #0284c7; color: #fff; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem;">2</span>
                    ${f2.prompt || 'Feature 2: Identify a second key feature and provide supporting historical detail.'}
                  </div>
                  ${f2.starter ? `<div style="font-size: 0.82rem; color: #64748b; font-style: italic; margin-bottom: 6px;"><strong>Starter:</strong> &ldquo;${f2.starter}&rdquo;</div>` : ''}
                  <textarea class="interactive-textarea student-answer-input" style="width: 100%; box-sizing: border-box; min-height: 75px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.92rem; line-height: 1.5;" placeholder="${f2.starter || 'A second key feature was... For example, this meant that...'}"></textarea>
                  ${f2.model
                ? `
                    <details class="two-features-model" style="margin-top: 8px;">
                      <summary style="cursor: pointer; color: #0369a1; font-weight: 700; font-size: 0.82rem;"><i class="fa-solid fa-eye"></i> [ Reveal Feature 2 Model ]</summary>
                      <div style="margin-top: 6px; padding: 10px; background: #ffffff; border-left: 3px solid #0284c7; border-radius: 4px; font-size: 0.88rem; color: #1e293b; line-height: 1.5;">${formatBold ? formatBold(f2.model) : f2.model}</div>
                    </details>
                  `
                : ''
              }
                </div>
              </div>
            `;
            return;
          }
          if (
            isKs2 ||
            task.type === 'extended_writing' ||
            task.type === 'narrative_account' ||
            task.type === 'narrative_account_8m' ||
            task.type === 'causation_12m' ||
            task.type === 'consequence_4m' ||
            task.type === 'evaluative_essay_12m' ||
            task.type === 'source_clues' ||
            task.type === 'historical_explanation' ||
            task.type === 'living_history' ||
            task.type === 'big_question'
          ) {
            const hasTaskPrefix = task.topic && /^Task\s*\d+/i.test(task.topic);
            const isLocalKs2 = checkIsKs2(unitId, activeUnit);
            const isLocalKs3 = checkIsKs3(unitId, activeUnit);
            const qNumPrefix =
              task.qNum && !hasTaskPrefix && !isLocalKs3 && !isLocalKs2 ? `Q${task.qNum}. ` : '';
            const taskTitle =
              task.tariff ||
              task.title ||
              task.topic ||
              (isLocalKs2
                ? 'Historian Writing Challenge'
                : isLocalKs3
                  ? 'Enquiry Writing Task'
                  : 'Task 4: Analytical Synthesis & Historical Essay');
            const badgeText =
              task.badge ||
              (isLocalKs2
                ? 'Key Stage 2 Historian Challenge'
                : isLocalKs3
                  ? task.type === 'narrative_account' || task.type === 'narrative_account_8m'
                    ? 'KS3 CHRONOLOGICAL NARRATIVE &bull; 3 PARAGRAPHS'
                    : /how\s+far|agree|evaluative/i.test(
                          `${task.type || ''} ${task.topic || ''} ${task.question || ''}`,
                        )
                      ? 'KS3 EVALUATIVE ESSAY &bull; BALANCED JUDGEMENT'
                      : 'KS3 ENQUIRY WRITING &bull; CAUSAL EXPLANATION'
                  : 'GCSE Analytical Masterclass');
            const questionPrompt = task.question || task.text || task.prompt || '';
            const hints = Array.isArray(task.hints) ? task.hints : [];
            const modelAnswer =
              task.model_answer || task.model || task.exemplar || task.wagoll || task.answer || '';
            const ks2Connectives = [
              'In the beginning, ...',
              'This was important because ...',
              'The evidence shows that ...',
              'Another reason was ...',
              'Overall, I think that ...',
            ];
            const essayConnectives =
              (task.scaffolding && task.scaffolding.connective_bank) ||
              (isKs2
                ? ks2Connectives
                : [
                  'To a large extent, it can be argued that...',
                  'In particular, a decisive factor was...',
                  'Furthermore, this created severe consequences because...',
                  'On the other hand, an alternative perspective is that...',
                  'In conclusion, the decisive reason why...',
                ]);

            const taskScaf = task.scaffolding || {};
            const structureStrip = Array.isArray(taskScaf.structure_strip) ? taskScaf.structure_strip : [];
            const sentenceStarters =
              Array.isArray(taskScaf.sentence_starters) && taskScaf.sentence_starters.length > 0
                ? taskScaf.sentence_starters
                : Array.isArray(task.sentence_starters) && task.sentence_starters.length > 0
                  ? task.sentence_starters
                  : typeof task.starter === 'string' && task.starter.trim()
                    ? [task.starter.trim()]
                    : [];
            const wordBank =
              Array.isArray(taskScaf.word_bank) && taskScaf.word_bank.length > 0
                ? taskScaf.word_bank
                : Array.isArray(taskScaf.vocab_bank) && taskScaf.vocab_bank.length > 0
                  ? taskScaf.vocab_bank
                  : Array.isArray(task.word_bank) && task.word_bank.length > 0
                    ? task.word_bank
                    : Array.isArray(task.key_terms) && task.key_terms.length > 0
                      ? task.key_terms
                      : Array.isArray(lesson?.vocab) && lesson.vocab.length > 0
                        ? lesson.vocab
                            .map((v) => (typeof v === 'object' ? v.term : v))
                            .filter(Boolean)
                        : [];
            const criteria = Array.isArray(taskScaf.evaluative_criteria) ? taskScaf.evaluative_criteria : [];
            const stimulusList =
              Array.isArray(task.stimulus) && task.stimulus.length > 0
                ? task.stimulus
                : extractEmbeddedStimulusBullets(questionPrompt) || [];

            let stimulusHtml = '';
            if (stimulusList.length > 0) {
              stimulusHtml = `
                <div class="edexcel-stimulus-bullet-box" style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-left: 4px solid #0284c7; border-radius: 6px; padding: 10px 14px; margin: 0 0 12px 0; font-size: 0.88rem; color: #0c4a6e;">
                  <strong style="text-transform: uppercase; font-size: 0.74rem; letter-spacing: 0.5px; color: #0284c7; display: block; margin-bottom: 5px;"><i class="fa-solid fa-list-check" style="margin-right: 5px;"></i> You may use the following in your answer:</strong>
                  <ul style="margin: 0; padding-left: 20px; line-height: 1.5;">
                    ${stimulusList.map((st) => `<li>${formatBold ? formatBold(st) : st}</li>`).join('')}
                  </ul>
                  <span style="display: block; font-size: 0.78rem; font-style: italic; color: #64748b; margin-top: 4px;">You must also use information of your own.</span>
                </div>
              `;
            }

            let peelHtml = '';
            if (hints.length > 0) {
              const isNarrative = task.type === 'narrative_account';
              const ks2Colors = [
                { letter: '1', label: 'Clue 1', bg: '#eff6ff', border: '#93c5fd', text: '#1e40af' },
                { letter: '2', label: 'Clue 2', bg: '#f0fdf4', border: '#86efac', text: '#166534' },
                { letter: '3', label: 'Clue 3', bg: '#fefce8', border: '#fde047', text: '#854d0e' },
                { letter: '4', label: 'Clue 4', bg: '#faf5ff', border: '#d8b4fe', text: '#6b21a8' },
              ];
              const peelColors = [
                { letter: 'P', label: 'Point', bg: '#eff6ff', border: '#93c5fd', text: '#1e40af' },
                {
                  letter: 'E',
                  label: 'Evidence',
                  bg: '#f0fdf4',
                  border: '#86efac',
                  text: '#166534',
                },
                {
                  letter: 'E',
                  label: 'Explanation',
                  bg: '#fefce8',
                  border: '#fde047',
                  text: '#854d0e',
                },
                { letter: 'L', label: 'Link', bg: '#faf5ff', border: '#d8b4fe', text: '#6b21a8' },
              ];
              const narrativeColors = [
                {
                  letter: '1',
                  label: 'Beginning (1819)',
                  bg: '#eff6ff',
                  border: '#93c5fd',
                  text: '#1e40af',
                },
                {
                  letter: '2',
                  label: 'Middle (1830)',
                  bg: '#fffbeb',
                  border: '#fcd34d',
                  text: '#b45309',
                },
                {
                  letter: '3',
                  label: 'End (1834)',
                  bg: '#f0fdf4',
                  border: '#86efac',
                  text: '#166534',
                },
              ];
              const cfgList = isKs2 ? ks2Colors : isNarrative ? narrativeColors : peelColors;
              peelHtml = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px;">
                  ${hints
                  .map((hint, hIdx) => {
                    const cfg = cfgList[hIdx % cfgList.length];
                    let cleanHint =
                      typeof hint === 'string'
                        ? hint
                        : hint.prompt || hint.text || hint.desc || '';
                    let label = typeof hint === 'object' && hint.label ? hint.label : cfg.label;
                    if (typeof hint === 'string' && typeof hint.match === 'function') {
                      const splitMatch = hint.match(
                        /^(Point|Evidence|Explanation|Link|Beginning|Middle|End)(?:\s*\([^)]*\))?:\s*(.*)/i,
                      );
                      if (splitMatch) {
                        label = isNarrative ? cfg.label : splitMatch[1];
                        cleanHint = splitMatch[2];
                      }
                    }
                    return `
                      <div style="background: ${cfg.bg}; border: 1.5px solid ${cfg.border}; border-radius: 6px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px;">
                        <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 0.82rem; color: ${cfg.text}; text-transform: uppercase;">
                          <span style="background: ${cfg.text}; color: #ffffff; width: 18px; height: 18px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.72rem;">${cfg.letter}</span>
                          ${label}
                        </div>
                        <div style="font-size: 0.88rem; color: #1e293b; line-height: 1.45;">
                          ${cleanHint}
                        </div>
                      </div>
                    `;
                  })
                  .join('')}
                </div>
              `;
            }

            let scaffoldingItemsHtml = '';

            // 1. Structure Strip or PEEL Hints
            if (structureStrip.length > 0) {
              scaffoldingItemsHtml += `
                <div>
                  <div style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: #0284c7; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-layer-group"></i> Analytical Structure Strip (Paragraph Progression)
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 7px;">
                    ${structureStrip
                  .map((step) => {
                    const stepText = typeof step === 'string' ? step : (step.prompt || step.text || '');
                    return `
                        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #0284c7; border-radius: 4px; padding: 8px 12px; font-size: 0.86rem; color: #1e293b; line-height: 1.5;">
                          ${formatBold ? formatBold(stepText) : stepText}
                        </div>
                      `;
                  })
                  .join('')}
                  </div>
                </div>
              `;
            } else if (peelHtml) {
              scaffoldingItemsHtml += `
                <div>
                  <div style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: #0284c7; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-layer-group"></i> ${isKs2 ? 'Historian Writing Scaffolds' : task.type === 'narrative_account' ? 'Chronological Narrative Sequence (Beginning, Middle, End)' : 'PEEL Analytical Writing Steps'}
                  </div>
                  ${peelHtml}
                </div>
              `;
            }

            // 2. Evaluative Criteria & Evidence Checklist (if present)
            if (criteria.length > 0) {
              scaffoldingItemsHtml += `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px;">
                  <strong style="display: block; font-size: 0.78rem; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; margin-bottom: 6px;">
                    <i class="fa-solid fa-scale-balanced" style="color: #0284c7; margin-right: 6px;"></i> Evaluative Criteria &amp; Evidence Checklist
                  </strong>
                  <ul style="margin: 0; padding-left: 18px; font-size: 0.85rem; color: #334155; line-height: 1.5;">
                    ${criteria.map((c) => `<li style="margin-bottom: 4px;">${formatBold ? formatBold(c) : c}</li>`).join('')}
                  </ul>
                </div>
              `;
            }

            // 3. Sentence Starters Bank (if present)
            if (sentenceStarters.length > 0) {
              scaffoldingItemsHtml += `
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 10px 14px;">
                  <strong style="display: block; font-size: 0.78rem; text-transform: uppercase; color: #1d4ed8; letter-spacing: 0.5px; margin-bottom: 6px;">
                    <i class="fa-solid fa-pen-fancy" style="margin-right: 6px;"></i> Sentence Starters Bank (${sentenceStarters.length} prompts)
                  </strong>
                  <ul style="margin: 0; padding-left: 18px; font-size: 0.86rem; color: #1e40af; line-height: 1.55;">
                    ${sentenceStarters.map((s) => `<li style="margin-bottom: 4px;">${formatBold ? formatBold(s) : s}</li>`).join('')}
                  </ul>
                </div>
              `;
            }

            // 4. Analytical Connectives Bank (Click to Insert)
            if (essayConnectives.length > 0) {
              scaffoldingItemsHtml += `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px;">
                  <div style="font-size: 0.78rem; font-weight: 700; color: #0369a1; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-arrow-right-arrow-left"></i> ${isKs2 ? 'Helpful Sentence Starters (Click to Insert):' : task.type === 'narrative_account' ? 'Chronological &amp; Causal Connectives (Click to Insert):' : 'Analytical Connectives (Click to Insert):'}
                  </div>
                  <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${essayConnectives.map((c) => `<button type="button" class="connective-chip" data-connective="${c.replace(/"/g, '&quot;')}" style="background: #ffffff; border: 1px solid #bfdbfe; color: #1e40af; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease;" title="Click to insert at cursor">${c}</button>`).join('')}
                  </div>
                </div>
              `;
            }

            const ks3TaskUid = `ks3_ext_${String(lesson.id || currentIndex).replace(/[^a-zA-Z0-9_-]/g, '_')}_${tIdx}`;
            const wbTitleLabel = isKs2
              ? 'Historian Word Bank'
              : isLocalKs3
                ? 'Core Disciplinary Vocabulary Bank'
                : 'GCSE Key Vocabulary Bank';
            const ks3WbBtnHtml =
              wordBank.length > 0
                ? `<button type="button" class="btn btn-pedagogy btn-pedagogy-sm" data-action="toggle-element" data-target-id="ks3-wb-${ks3TaskUid}" style="background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-tags" style="color: #0d9488;"></i> Word Bank <i class="fa-solid fa-chevron-down wb-dd-chevron" style="font-size: 0.68rem; opacity: 0.75;"></i></button>`
                : '';
            const ks3ScafBtnLabel =
              structureStrip.length > 0 || Boolean(peelHtml)
                ? 'Sentence Starters &amp; Structure'
                : 'Sentence Starters';
            const ks3ScafBtnHtml = scaffoldingItemsHtml
              ? `<button type="button" class="btn btn-pedagogy btn-pedagogy-sm" data-action="toggle-element" data-target-id="ks3-scaf-${ks3TaskUid}" style="background: #f1f5f9; color: #1e3a8a; border: 1px solid #cbd5e1; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-wand-magic-sparkles" style="color: #2563eb;"></i> ${ks3ScafBtnLabel} <i class="fa-solid fa-chevron-down wb-dd-chevron" style="font-size: 0.68rem; opacity: 0.75;"></i></button>`
              : '';

            const ks3WbDrawerHtml =
              wordBank.length > 0
                ? `<div id="ks3-wb-${ks3TaskUid}" class="scaffold-box" style="display: none; background: #f8fafc; border: 1.5px solid #99f6e4; border-radius: 8px; padding: 11px 14px; margin-top: 8px;">
                    <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: baseline; margin-bottom: 6px;">
                      <span style="font-size: 0.78rem; font-weight: 800; color: #0f766e; text-transform: uppercase;">${wbTitleLabel}:</span>
                      <span style="font-size: 0.72rem; font-weight: 600; color: #64748b;">Tap to cross off</span>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                      ${wordBank.map((w) => `<span class="wb-interactive-chip" data-action="toggle-wb-chip" role="button" tabindex="0" title="Tap to cross off once used" style="background: #f0fdfa; border: 1px solid #99f6e4; color: #115e59; font-size: 0.79rem; font-weight: 700; padding: 2.5px 9px; border-radius: 12px;">${w}</span>`).join('')}
                    </div>
                  </div>`
                : '';

            const ks3ScafDrawerHtml = scaffoldingItemsHtml
              ? `<div id="ks3-scaf-${ks3TaskUid}" class="scaffold-box" style="display: none; background: #f8fafc; border: 1.5px solid #93c5fd; border-radius: 8px; padding: 14px; margin-top: 8px;">
                  <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${scaffoldingItemsHtml}
                  </div>
                </div>`
              : '';

            const ks3ModelBtnLabel = isKs2
              ? 'Reveal Model Historian Answer'
              : isLocalKs3
                ? 'Reveal Model Response'
                : 'Reveal Examiner Model Response';

            const ks3ModelBtnHtml = modelAnswer
              ? `<button type="button" class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-model" data-action="toggle-element" data-target-id="ks3-model-${ks3TaskUid}" title="${ks3ModelBtnLabel}" style="background: #f0fdf4; color: #166534; border: 1px solid #86efac; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-eye" style="color: #16a34a;"></i> ${ks3ModelBtnLabel}</button>`
              : '';

            const ks3ModelDrawerHtml = modelAnswer
              ? `<div id="ks3-model-${ks3TaskUid}" class="scaffold-box model-box" style="display: none; margin-top: 8px; padding: 14px 16px; background: #f8fafc; border-left: 4px solid #0284c7; border-radius: 6px; font-size: 0.95rem; color: #1e293b; line-height: 1.65; border: 1px solid #e2e8f0; font-family: 'Georgia', serif;">
                  ${modelAnswer.includes('\n\n')
                    ? modelAnswer
                        .split(/\n\s*\n/)
                        .map(
                          (p) =>
                            `<p style="margin: 0 0 10px 0; line-height: 1.65;">${formatBold ? formatBold(p) : p}</p>`,
                        )
                        .join('')
                    : formatBold
                      ? formatBold(modelAnswer)
                      : modelAnswer
                  }
                </div>`
              : '';

            const ks3WritingStudioBtnHtml = isKs2
              ? ''
              : `<button type="button" class="btn-open-writing-studio no-print" onclick="event.stopPropagation(); if(window.openLessonInfographicModalToPart){window.openLessonInfographicModalToPart(3, '${lesson.id || currentIndex}', '${unitId}');}else if(window.openWritingStudioFromTask){window.openWritingStudioFromTask();}else if(window.openLessonInfographicModal){window.openLessonInfographicModal('${lesson.id || currentIndex}', '${unitId}');}" style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; border: none; font-size: 0.78rem; font-weight: 700; padding: 6px 12px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 5px rgba(2, 132, 199, 0.22); transition: transform 0.15s ease;" title="Open Writing Studio and Clue Ladder for right page task"><i class="fa-solid fa-pen-nib"></i> Writing Studio &amp; Clue Ladder</button>`;

            const customPlaceholder = isKs2
              ? 'Write your historian answer using the clues and key words above...'
              : task.type === 'narrative_account'
                ? 'Write your 3-paragraph narrative account following the chronological sequence (Beginning: Peterloo ➔ Middle: Swing Riots ➔ End: Tolpuddle)...'
                : 'Compose your analytical argument here. Open Word Bank or Sentence Starters above if needed...';

            const ks2FullPromptHtml =
              isKs2 && questionPrompt
                ? `<div class="ks2-writing-prompt-box" style="background: #f0f9ff; border: 1.5px solid #bae6fd; border-left: 4px solid #0284c7; border-radius: 8px; padding: 12px 14px; margin: 0 0 12px 0;">
                    <div style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #0369a1; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                      <i class="fa-solid fa-compass-drafting"></i> ${taskTitle}
                    </div>
                    <div style="font-size: 0.96rem; color: #0f172a; font-weight: 600; line-height: 1.55;">
                      ${formatBold ? formatBold(questionPrompt) : questionPrompt}
                    </div>
                  </div>`
                : '';

            htmlTasks += `
              <div class="task-box extended-writing-task-card" style="margin-bottom: 4px; background: #ffffff;">
                ${ks2FullPromptHtml}
                ${stimulusHtml}

                <div class="peel-scaffolding-drawer no-print" style="margin-bottom: 6px;">
                  <div class="wb-unified-control-bar" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; padding-top: 2px;">
                    <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px;">
                      ${ks3WbBtnHtml}
                      ${ks3ScafBtnHtml}
                    </div>
                    <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-left: auto;">
                      ${ks3ModelBtnHtml}
                      ${ks3WritingStudioBtnHtml}
                    </div>
                  </div>
                  ${ks3WbDrawerHtml}
                  ${ks3ScafDrawerHtml}
                  ${ks3ModelDrawerHtml}
                </div>

                <div class="laptop-only-response-box" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; margin-top: 10px;">
                  <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #1e293b; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">${isKs2 ? 'Your Historian Response:' : task.type === 'narrative_account' ? 'Student Response &bull; Chronological 3-Paragraph Narrative Account (Beginning, Middle, End):' : 'Student Response &bull; Structured Historical Argument:'}</label>
                  <textarea class="interactive-textarea student-answer-input" style="width: 100%; box-sizing: border-box; min-height: 130px; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; line-height: 1.6; font-family: inherit; resize: vertical; margin-bottom: 0;" placeholder="${customPlaceholder}" oninput="window.updateProgress()"></textarea>
                </div>
              </div>
            `;
            return;
          }
          let rawQText = typeof task === 'string' ? task : task.question || task.text || '';
          let cleaned = rawQText.replace(/^(Enquiry:|Q\d+:|Task \d+:|Question \d+[a-z]?:)\s*/i, '');
          let qText = typeof formatBold !== 'undefined' ? formatBold(cleaned) : cleaned;
          let clueParaMatch = qText.match(/\((P|Para\s*)(\d+)\)$/i);
          let clueBtn = '';
          if (clueParaMatch) {
            clueBtn = `<button class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-clue" title="Find Evidence" data-action="scroll-to-para" data-target="para-${clueParaMatch[2]}"><i class="fa-solid fa-magnifying-glass"></i> Find Evidence</button>`;
          }
          const hasPedagogyBtns = Boolean(
            clueBtn || task.starter || task.clue || task.model || task.model_answer || task.answer,
          );

          htmlTasks += `
            <div class="do-now-card" style="background: #ffffff; border: none; padding: 0; margin: 0;">
              <textarea class="student-answer-input" placeholder="Write your response here..." oninput="window.updateProgress()"></textarea>
              ${
                hasPedagogyBtns
                  ? `
                <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
                  ${clueBtn}
                  ${task.starter ? `<button class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-starter" title="Sentence Starter" data-action="toggle-element" data-target-id="starter-${tIdx}"><i class="fa-solid fa-pen"></i> Sentence Starter</button>` : ''}
                  ${task.clue ? `<button class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-clue" title="Clue" data-action="toggle-element" data-target-id="clue-${tIdx}"><i class="fa-solid fa-lightbulb"></i> Clue</button>` : ''}
                  ${task.model || task.model_answer || task.answer ? `<button class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-model" title="Reveal Model Answer" data-action="toggle-element" data-target-id="model-${tIdx}"><i class="fa-solid fa-eye"></i> Reveal Model Answer</button>` : ''}
                </div>
              `
                  : ''
              }
              ${task.starter ? `<div id="starter-${tIdx}" class="scaffold-box starter-box" style="display:none;"><strong>Sentence Starter:</strong> ${task.starter}</div>` : ''}
              ${task.clue ? `<div id="clue-${tIdx}" class="scaffold-box clue-box" style="display:none;"><strong>Clue Hint:</strong> ${task.clue}</div>` : ''}
              ${task.model || task.model_answer || task.answer ? `<div id="model-${tIdx}" class="scaffold-box model-box" style="display:none;">${formatBold(task.model || task.model_answer || task.answer)}</div>` : ''}
            </div>
          `;
          })();
          return htmlTasks;
        };

        lesson.tasks.forEach((task, tIdx) => {
          const bodyHtml = renderSingleKs3TaskBody(task, tIdx);
          const rawHeader = String(task.tariff || task.title || task.topic || '');
          const marksMatch =
            rawHeader.match(/(\d+)\s*marks?/i) ||
            String(task.question || task.text || '').match(/\[\s*(\d+)\s*marks?\s*\]/i);
          const minsMatch = rawHeader.match(/(\d+)\s*mins?/i);
          const rawQLower = `${rawHeader} ${task.type || ''} ${task.question || task.text || ''}`.toLowerCase();
          const ks3SkillLabel =
            task.type === 'two_features' || /describe\s+(?:one|two)\s+(?:key\s+)?features?/.test(rawQLower)
              ? 'Two Key Features'
              : task.type === 'narrative_account' ||
                  task.type === 'narrative_account_8m' ||
                  /narrative\s+account/.test(rawQLower)
                ? 'Narrative Account'
                : /how\s+far\s+do\s+you\s+agree|evaluative/.test(rawQLower)
                  ? 'Evaluative Judgement'
                  : /explain\s+the\s+importance|significance/.test(rawQLower)
                    ? 'Historical Importance'
                    : /explain\s+(?:one|two)\s+consequences?|consequence/.test(rawQLower)
                      ? 'Consequence'
                      : /useful|source\s+[a-z]|inference/.test(rawQLower)
                        ? 'Source Enquiry'
                        : task.type === 'two_sided_argument'
                          ? 'Evidence Balance'
                          : /explain\s+why|causation/.test(rawQLower)
                            ? 'Causal Explanation'
                            : 'Enquiry Writing';
          const tariffTag = isKs2
            ? `Task ${tIdx + 1}`
            : isKs3 || !isGCSE
              ? `Task ${tIdx + 1} • ${ks3SkillLabel}`
              : marksMatch
                ? `Task ${tIdx + 1} • ${marksMatch[1]}m`
                : `Task ${tIdx + 1}`;
          const minsPillHtml = minsMatch
            ? `<span class="wb-mins-pill"><i class="fa-regular fa-clock"></i> ${minsMatch[1]}m</span>`
            : '';
          const originShort = isKs2
            ? `Mission ${String(currentIndex + 1).padStart(2, '0')}${wbPageNum ? ` • p. ${wbPageNum}` : ''}`
            : wbPageNum
              ? `Workbook • p. ${wbPageNum}`
              : 'Workbook';
          const stemPreview = cleanStemForStripSummary(
            task.question || task.stem || task.text || task.title || task.topic || `Workbook Activity ${tIdx + 1}`,
          );

          htmlTasks += `
            <details class="wb-question-strip wb-thin-strip wb-strip-green">
              <summary>
                <div class="wb-strip-left">
                  <span class="wb-origin-pill wb-origin-green" title="${isWorkbookTask ? 'Printed in Pupil Workbook' : 'Workbook Activity'}">
                    <i class="fa-solid fa-book-open"></i> ${originShort}
                  </span>
                  <span class="wb-tariff-pill">${tariffTag}</span>
                  <span class="wb-stem-preview wb-strip-stem">${stemPreview}</span>
                </div>
                <div class="wb-strip-right">
                  ${minsPillHtml}
                  <span class="wb-strip-toggle-txt">
                    <span class="wb-lbl-closed">Answer</span><span class="wb-lbl-open">Close</span>
                    <i class="fa-solid fa-chevron-down wb-strip-caret"></i>
                  </span>
                </div>
              </summary>
              <div class="wb-strip-body">
                ${bodyHtml}
              </div>
            </details>
          `;
        });

        htmlTasks += `</div></div>`;
      }
    }

    if (lesson.essay_planning) {
      const ep = lesson.essay_planning;
      htmlHistorian += `
        <div class="phase-card essay-planning-card" style="margin-top: 30px; border: 2px solid #2563eb; border-radius: 10px; background: #ffffff; overflow: hidden; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: #ffffff; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.25rem;">⚖️</span>
              <div>
                <h3 style="margin: 0; font-size: 1.15rem; font-family: 'Playfair Display', serif; color: #ffffff;">16-Mark Essay Planning Matrix (2&times;2)</h3>
                <span style="font-size: 0.75rem; color: #bfdbfe; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Edexcel Paper 1 &bull; Section B (Q5/Q6) &bull; ${ep.marks || '16 Marks + 4 SPaG'}</span>
              </div>
            </div>
            <span style="background: rgba(255, 255, 255, 0.2); color: #ffffff; font-size: 0.78rem; font-weight: 800; padding: 4px 10px; border-radius: 20px;">Target: Level 4 (13–16 Marks)</span>
          </div>

          <div style="padding: 20px;">
            <div style="background: #f8fafc; border-left: 4px solid #2563eb; border-radius: 0 6px 6px 0; padding: 12px 16px; margin-bottom: 18px;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Statement to Evaluate:</div>
              <div style="font-size: 1.05rem; font-weight: 700; color: #0f172a; line-height: 1.4;">${ep.statement}</div>
              ${ep.stimulus && ep.stimulus.length > 0 ? `<div style="font-size: 0.85rem; color: #475569; margin-top: 6px;"><strong>Stimulus points provided:</strong> ${ep.stimulus.join(' &bull; ')} <em>(You must also use information of your own)</em></div>` : ''}
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px;">
              <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; padding: 16px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; border-bottom: 1.5px solid #bbf7d0; padding-bottom: 8px;">
                  <span style="background: #16a34a; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 900;">✓</span>
                  <strong style="color: #166534; font-size: 0.92rem; text-transform: uppercase; letter-spacing: 0.5px;">Factors Supporting Statement (Agree)</strong>
                </div>
                <ul style="margin: 0; padding-left: 18px; color: #14532d; font-size: 0.9rem; line-height: 1.55;">
                  ${(ep.supporting_factors || []).map((f) => `<li style="margin-bottom: 8px;">${formatBold(f)}</li>`).join('')}
                </ul>
              </div>

              <div style="background: #eff6ff; border: 1.5px solid #93c5fd; border-radius: 8px; padding: 16px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; border-bottom: 1.5px solid #bfdbfe; padding-bottom: 8px;">
                  <span style="background: #2563eb; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 900;">⇄</span>
                  <strong style="color: #1e40af; font-size: 0.92rem; text-transform: uppercase; letter-spacing: 0.5px;">Counter-Factors / Other Factors (Disagree)</strong>
                </div>
                <ul style="margin: 0; padding-left: 18px; color: #1e3a8a; font-size: 0.9rem; line-height: 1.55;">
                  ${(ep.counter_factors || []).map((f) => `<li style="margin-bottom: 8px;">${formatBold(f)}</li>`).join('')}
                </ul>
              </div>
            </div>

            ${ep.criteria_prompt
          ? `
            <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="color: #b45309; font-weight: bold;">⚖️</span>
                <strong style="color: #92400e; font-size: 0.88rem; text-transform: uppercase; letter-spacing: 0.5px;">Level 4 Evaluative Judgment Criteria:</strong>
              </div>
              <p style="margin: 0; font-size: 0.9rem; color: #78350f; line-height: 1.5; font-style: italic;">
                ${formatBold(ep.criteria_prompt)}
              </p>
            </div>`
          : ''
        }

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #475569; margin-bottom: 6px;">
                <i class="fa-solid fa-pen-to-square"></i> Student Planning Scratchpad (Prioritize your factor hierarchy &amp; concluding judgment):
              </label>
              <textarea class="student-answer-input" placeholder="Jot down your 3 paragraph themes (1 agree, 2 other factors) and your overall criteria-based verdict here..." style="min-height: 80px; width: 100%; box-sizing: border-box;"></textarea>
            </div>
          </div>
        </div>
      `;
    }
  }

  if (false && lesson.pair_share) {
    const ps = lesson.pair_share;
    const thinkText = ps.think || 'Consider the key historical factors discussed in this lesson.';
    const pairText =
      ps.pair ||
      'Discuss your ideas with your partner. Compare your reasons and evidence, and refine your explanation.';
    const shareText =
      ps.share ||
      'Be prepared to share your argument with the class using analytical sentence starters.';
    const startersHtml =
      ps.starters && ps.starters.length > 0
        ? `<div style="margin-top: 15px; background: white; padding: 12px 16px; border-radius: 6px; border-left: 4px solid #10b981; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
             <strong style="color: #065f46; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">Sentence Starters:</strong>
             ${ps.starters.map((s) => `<div style="font-size: 0.95rem; color: #166534; margin-top: 4px;">• <em>${s}</em></div>`).join('')}
           </div>`
        : '';
    htmlPairShare += `
        <details style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 6px; margin-bottom: 15px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.05);" closed>
            <summary style="padding: 10px 15px; cursor: pointer; color: #059669; font-weight: bold; font-size: 1.05rem; background: #ecfdf5; list-style: none; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #a7f3d0;">
              <span><i class="fa-solid fa-users" style="color: #059669; margin-right: 10px;"></i> Think, Pair, Share</span>
            </summary>
            <div style="padding: 20px; background: #ecfdf5;">
              <p style="font-size: 1.15rem; font-weight: 700; color: #065f46; margin-top: 0;">${ps.qNum ? `Q${ps.qNum}. ` : ''}${ps.prompt}</p>
              ${ps.dilemma_scale
        ? `
                <div class="dilemma-scale-box" style="margin: 15px 0 20px 0; background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
                  <div style="text-align: center; font-weight: 800; color: #1e3a8a; font-size: 1rem; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fa-solid fa-scale-balanced" style="color: #0284c7;"></i> ${ps.dilemma_scale.title}
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; align-items: stretch;">
                    <div style="background: #fef2f2; border: 1px solid #fecaca; border-top: 3px solid #ef4444; border-radius: 6px; padding: 12px;">
                      <div style="font-weight: 700; color: #b91c1c; font-size: 0.92rem; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
                        <span>${ps.dilemma_scale.side_a.actor}</span>
                        <span style="font-size: 0.75rem; background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px;">${ps.dilemma_scale.side_a.tag}</span>
                      </div>
                      <ul style="margin: 6px 0 0 0; padding-left: 16px; font-size: 0.85rem; color: #7f1d1d; line-height: 1.45;">
                        ${ps.dilemma_scale.side_a.points.map((p) => `<li style="margin-bottom: 4px;">${p}</li>`).join('')}
                      </ul>
                    </div>
                    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-top: 3px solid #3b82f6; border-radius: 6px; padding: 12px;">
                      <div style="font-weight: 700; color: #1d4ed8; font-size: 0.92rem; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
                        <span>${ps.dilemma_scale.side_b.actor}</span>
                        <span style="font-size: 0.75rem; background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px;">${ps.dilemma_scale.side_b.tag}</span>
                      </div>
                      <ul style="margin: 6px 0 0 0; padding-left: 16px; font-size: 0.85rem; color: #1e3a8a; line-height: 1.45;">
                        ${ps.dilemma_scale.side_b.points.map((p) => `<li style="margin-bottom: 4px;">${p}</li>`).join('')}
                      </ul>
                    </div>
                  </div>
                  <div style="text-align: center; margin-top: 10px; font-size: 0.82rem; font-weight: 700; color: #64748b;">
                    <i class="fa-solid fa-arrows-split-up-and-left" style="color: #0f172a; margin-right: 4px;"></i> Pivot: ${ps.dilemma_scale.pivot}
                  </div>
                </div>
              `
        : ''
      }
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
                <div style="background: white; padding: 15px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="font-weight: bold; color: #059669; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <span><i class="fa-solid fa-brain"></i> 1. Think</span>
                    <button data-action="start-tps-timer" style="background: #10b981; color: white; border: none; border-radius: 4px; padding: 3px 8px; cursor: pointer; font-size: 0.85rem; font-weight: bold;"><i class="fa-regular fa-clock"></i> 60s</button>
                  </div>
                  <p style="margin: 0; font-size: 0.95rem; color: #475569;">${thinkText}</p>
                </div>
                <div style="background: white; padding: 15px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="font-weight: bold; color: #059669; margin-bottom: 8px;"><i class="fa-solid fa-comments"></i> 2. Pair</div>
                  <p style="margin: 0; font-size: 0.95rem; color: #475569;">${pairText}</p>
                </div>
                <div style="background: white; padding: 15px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="font-weight: bold; color: #059669; margin-bottom: 8px;"><i class="fa-solid fa-users"></i> 3. Share</div>
                  <p style="margin: 0; font-size: 0.95rem; color: #475569;">${shareText}</p>
                 </div>
              </div>
              ${startersHtml}
            </div>
          </details>
      `;
  }

  // In KS3 units, lesson.tasks already renders the canonical Pupil Workbook Activity (Recto) accordion.
  // We only render htmlExamPractice for KS3 if lesson.tasks is absent or empty as a fallback.
  const hasRenderableTasks = Array.isArray(lesson.tasks) && lesson.tasks.length > 0;
  const preFetchedExtraMocks =
    isGCSE && (!isKs3 || !hasRenderableTasks)
      ? getNonDuplicateExtraMockQuestions(
          unitId,
          lesson,
          Array.isArray(lesson.exam_practice)
            ? lesson.exam_practice
            : lesson.exam_practice?.questions || [],
        )
      : [];

  if ((lesson.exam_practice || preFetchedExtraMocks.length > 0) && (!isKs3 || !hasRenderableTasks)) {
    let epQuestions = [];
    let epStimulus = [];
    if (Array.isArray(lesson.exam_practice)) {
      epQuestions = lesson.exam_practice;
    } else if (lesson.exam_practice) {
      epQuestions = lesson.exam_practice.questions || [];
      epStimulus = lesson.exam_practice.stimulus || [];
    }

    const normalizedExtraMocks = preFetchedExtraMocks.map((mq, mIdx) => ({
      ...mq,
      _isExtraMock: true,
      id: mq.id || `extra_${lesson?.id || 'l'}_${mIdx}`,
      question: mq.questionText || mq.question || '',
      tariff: mq.type ? `${mq.type} [${mq.marks || 4} marks]` : `${mq.marks || 4} marks`,
      type: mq.type || '',
      marks: mq.marks || 4,
      targetMins:
        mq.targetMins ||
        getRecommendedExamMins(mq.marks, `${mq.type || ''} ${mq.questionText || mq.question || ''}`),
      stimulus: Array.isArray(mq.stimulus) ? mq.stimulus : [],
      sourceExtract: mq.sourceExtract || '',
      model: mq.modelAnswer || mq.model || '',
      model_tiers: mq.model_tiers || null,
      mockTitle: mq.mockTitle || 'Extra Unseen Mock Question',
      paperCode: mq.paperCode || getCanonicalGcsePaperCode(unitId),
      qCode: mq.qCode || '',
      pdfUrl: mq.pdfUrl || '',
    }));

    if (epQuestions.length > 0 || normalizedExtraMocks.length > 0) {
      const isKs3Unit = isKs3;

      const practiceHeading = isKs3Unit
        ? 'Pupil Workbook Activities &bull; Key Stage 3'
        : 'Pupil Workbook &amp; GCSE Exam Practice';
      const practiceIcon = isKs3Unit ? 'fa-book-open-reader' : 'fa-graduation-cap';
      const paperCodeSub = isGCSE
        ? `Pearson Edexcel GCSE &bull; ${getCanonicalGcsePaperCode(unitId)} &bull; Select any strip to view sources, guidance, timers &amp; model answers`
        : 'Select any workbook strip below to view scaffolding &amp; model answers';

      htmlExamPractice += `
          ${emitWbStylesOnce()}
          <div class="wb-unified-station phase-card">
            <div class="wb-station-header">
              <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1 1 auto;">
                <div style="width: 34px; height: 34px; border-radius: 8px; background: #10b981; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.98rem; flex-shrink: 0; box-shadow: 0 2px 5px rgba(16, 185, 129, 0.25);">
                  <i class="fa-solid ${practiceIcon}"></i>
                </div>
                <div style="min-width: 0;">
                  <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.05rem; font-weight: 800; color: #0f172a; line-height: 1.2;">${practiceHeading}</div>
                  <div style="font-size: 0.73rem; color: #64748b; font-weight: 600;">${paperCodeSub}</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex-shrink: 0;">
                __WB_COUNT_PILLS_PLACEHOLDER__
                <button type="button" class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-model" data-action="reveal-all-models" style="padding: 5px 10px; font-size: 0.78rem;"><i class="fa-solid fa-magnifying-glass"></i> Reveal Models</button>
                <button type="button" onclick="window.toggleAllWorkbookStrips && window.toggleAllWorkbookStrips(this)" style="background: #ffffff; color: #334155; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 10px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
                  <i class="fa-solid fa-expand"></i> Expand All
                </button>
              </div>
            </div>
            <div class="wb-strips-stack">
        `;
      const isPaper3Weimar =
        (typeof unitId !== 'undefined' &&
          (unitId === 'weimar_nazi_germany' || unitId === 'germany' || unitId === 'usa')) ||
        (typeof activeUnit !== 'undefined' &&
          activeUnit &&
          (activeUnit.id === 'weimar_nazi_germany' || activeUnit.id === 'usa')) ||
        (typeof window !== 'undefined' &&
          (window.currentUnitId === 'weimar_nazi_germany' ||
            window.currentUnitId === 'usa' ||
            (window.location &&
              window.location.search &&
              (window.location.search.includes('weimar_nazi_germany') ||
                window.location.search.includes('usa')))));

      const getWorkbookTaskMeta = (unitId, lessonId, qObj, qText, qIdx, lesson) => {
        if (qObj && qObj.inWorkbook === true && qObj.workbook_badge) {
          return {
            inWorkbook: true,
            label: qObj.workbook_badge,
            note: qObj.workbook_note || '',
          };
        }
        if (qObj && qObj.inWorkbook === false) {
          return {
            inWorkbook: false,
            label:
              qObj.workbook_badge || 'Digital Interactive Extension • Not in Printed Workbook',
            note: qObj.workbook_note || '',
          };
        }

        const type = (qObj?.type || '').toLowerCase();
        const text = (qText || '').toLowerCase();
        const tariff = (qObj?.tariff || '').toLowerCase();

        // Parse lesson ID format: e.g. "lesson_1_3" -> kt=1, num=3 or "lesson_7" -> kt=1, num=7
        const idMatch = (lessonId || '').match(/lesson_([0-9]+)_([0-9]+)/i);
        const singleMatch = !idMatch ? (lessonId || '').match(/^lesson_([0-9]+)$/i) : null;
        const ktNum = idMatch ? parseInt(idMatch[1], 10) : 1;
        const lNum = idMatch
          ? parseInt(idMatch[2], 10)
          : singleMatch
            ? parseInt(singleMatch[1], 10)
            : 1;

        // 1. EDEXCEL MEDICINE
        if (unitId === 'edexcel_medicine') {
          // Key Topic 5: Western Front (4-page spreads, 28-page saddle stitch booklet)
          if (ktNum === 5) {
            const startPg = 4 + (lNum - 1) * 4;
            const endPg = startPg + 3;

            if (type.includes('features') || text.includes('describe one feature')) {
              return { inWorkbook: true, label: `In Printed Workbook • Page ${endPg}` };
            }
            if (lNum % 2 === 1) {
              if (type.includes('utility') || text.includes('how useful is source')) {
                return {
                  inWorkbook: true,
                  label: `In Printed Workbook • Pages ${startPg}–${endPg}`,
                };
              }
              if (type.includes('follow_up') || text.includes('follow up source')) {
                const nextPractice =
                  lNum === 5 ? 'Lesson 4 (KT5.4)' : `Lesson ${lNum + 1} (KT5.${lNum + 1})`;
                return {
                  inWorkbook: false,
                  label: 'Digital Extension • Not in Printed Workbook',
                  note: `This follow-up enquiry is provided as an optional digital extension. In the printed workbook, Question 2(b) is practiced in ${nextPractice}.`,
                };
              }
            } else {
              if (type.includes('follow_up') || text.includes('follow up source')) {
                return {
                  inWorkbook: true,
                  label: `In Printed Workbook • Pages ${startPg}–${endPg}`,
                };
              }
              if (type.includes('utility') || text.includes('how useful is source')) {
                const prevPractice = `Lesson ${lNum - 1} (KT5.${lNum - 1})`;
                return {
                  inWorkbook: false,
                  label: 'Digital Extension • Not in Printed Workbook',
                  note: `This source utility enquiry is provided as an optional digital extension. In the printed workbook, Question 2(a) is practiced in ${prevPractice}.`,
                };
              }
            }
            return { inWorkbook: true, label: `In Printed Workbook • Pages ${startPg}–${endPg}` };
          }

          // Key Topics 1–4: Medieval, Renaissance, 18th/19th, Modern (20-page booklets, 3-page spreads)
          if (ktNum >= 1 && ktNum <= 4) {
            const part1Pg = 4 + (lNum - 1) * 3 + 1;
            const part2Pg = part1Pg + 1;

            if (
              type.includes('similarity') ||
              type.includes('difference') ||
              tariff.includes('4 mark') ||
              type.includes('4m')
            ) {
              return { inWorkbook: true, label: `In Printed Workbook • Page ${part2Pg}` };
            }
            if (
              type.includes('causal') ||
              type.includes('essay') ||
              tariff.includes('12 mark') ||
              tariff.includes('16 mark') ||
              type.includes('12m') ||
              type.includes('16m')
            ) {
              return {
                inWorkbook: true,
                label: `In Printed Workbook • Pages ${part1Pg}–${part2Pg}`,
              };
            }
            return { inWorkbook: true, label: `In Printed Workbook • Pages ${part1Pg}–${part2Pg}` };
          }
        }

        // 2. EARLY ELIZABETHAN ENGLAND (eee — 16-page Golden KT1/KT2/KT3 Booklets)
        if (unitId === 'eee') {
          if (qObj?.workbook_badge) {
            return { inWorkbook: true, label: qObj.workbook_badge };
          }
          const mapEntry =
            WORKBOOK_PAGE_MAP?.eee?.[lessonId] ||
            WORKBOOK_PAGE_MAP?.eee?.[`lesson_${ktNum}_${lNum}`];
          const examPg = mapEntry?.endPage || (lNum === 4 ? 11 : 1 + lNum * 2);
          const booklet = mapEntry?.booklet || `Key Topic ${ktNum} Booklet (16p)`;

          if (qIdx === 1 && (type.includes('feature') || type.includes('2m') || tariff.includes('2 mark'))) {
            return {
              inWorkbook: true,
              label: `In Printed Workbook • Page 13 (${booklet})`,
            };
          }
          return {
            inWorkbook: true,
            label: `In Printed Workbook • Page ${examPg} (${booklet})`,
          };
        }

        // 3. WEIMAR & NAZI GERMANY (weimar_nazi_germany)
        if (unitId === 'weimar_nazi_germany') {
          const startPg = 2 + lNum * 2;
          const endPg = startPg + 1;

          if (type.includes('inference') || text.includes('two things you can infer')) {
            return { inWorkbook: true, label: `In Printed Workbook • Page ${endPg}` };
          }
          if (
            type.includes('causation') ||
            type.includes('explain_why') ||
            tariff.includes('12 mark') ||
            type.includes('12m')
          ) {
            return { inWorkbook: true, label: `In Printed Workbook • Pages ${startPg}–${endPg}` };
          }
          const isWeimarUtility =
            type.includes('utility') ||
            text.includes('how useful') ||
            /\b3\s*\(\s*a\s*\)/i.test(text);
          if (isWeimarUtility) {
            const isPrintedWeimarQ3a =
              qObj?.inWorkbook === true ||
              (ktNum === 1 && lNum === 2) ||
              (ktNum === 2 && lNum === 3) ||
              (ktNum === 3 && lNum === 3) ||
              (ktNum === 4 && lNum === 3);
            if (isPrintedWeimarQ3a) {
              return {
                inWorkbook: true,
                label: qObj?.workbook_badge || 'In Printed Workbook • Pages 16–17',
              };
            }
            return {
              inWorkbook: false,
              label:
                qObj?.workbook_badge || 'Digital Interactive Extension • Not in Printed Workbook',
              note:
                qObj?.workbook_note ||
                'In the printed pupil workbook, Question 2 (12 marks) is the core causation essay. This 8-mark source utility enquiry is provided as an interactive digital extension.',
            };
          }
          if (type.includes('verdict') || tariff.includes('16 mark') || type.includes('16m')) {
            return { inWorkbook: true, label: `In Printed Workbook • Pages ${startPg}–${endPg}` };
          }
          if (tariff.includes('4 mark') || type.includes('4m') || type.includes('interp')) {
            return { inWorkbook: true, label: `In Printed Workbook • Page ${endPg}` };
          }
          return { inWorkbook: true, label: `In Printed Workbook • Pages ${startPg}–${endPg}` };
        }

        // 4. CONFLICT IN THE MIDDLE EAST (cme_new)
        if (unitId === 'cme_new') {
          const mapEntry =
            WORKBOOK_PAGE_MAP?.cme_new?.[lessonId] ||
            WORKBOOK_PAGE_MAP?.cme_new?.[`lesson_${lNum}`] ||
            WORKBOOK_PAGE_MAP?.cme_new?.[`lesson_${ktNum}_${lNum}`];
          const examStartPg =
            mapEntry?.examPage || mapEntry?.endPage || (mapEntry?.page ? mapEntry.page + 1 : 3);
          const booklet = mapEntry?.booklet || 'Key Topic Booklet';
          if (mapEntry?.examEndPage && mapEntry.examEndPage > examStartPg) {
            return {
              inWorkbook: true,
              label: `In Printed Workbook • Pages ${examStartPg}–${mapEntry.examEndPage} (${booklet})`,
            };
          }
          return {
            inWorkbook: true,
            label: `In Printed Workbook • Page ${examStartPg} (${booklet})`,
          };
        }

        // 5. USA: CONFLICT AT HOME AND ABROAD (usa)
        if (unitId === 'usa') {
          const startPg = 2 + lNum * 2;
          const endPg = startPg + 1;
          const isUsaUtility =
            type.includes('utility') ||
            text.includes('how useful') ||
            /\b3\s*\(\s*a\s*\)/i.test(text);
          if (isUsaUtility) {
            const isPrintedUsaQ3a =
              qObj?.inWorkbook === true ||
              (ktNum === 1 && lNum === 3) ||
              (ktNum === 2 && lNum === 4) ||
              (ktNum === 3 && lNum === 3) ||
              (ktNum === 4 && lNum === 1);
            if (isPrintedUsaQ3a) {
              return {
                inWorkbook: true,
                label: qObj?.workbook_badge || 'In Printed Workbook • Pages 16–17',
              };
            }
            return {
              inWorkbook: false,
              label:
                qObj?.workbook_badge || 'Digital Interactive Extension • Not in Printed Workbook',
              note:
                qObj?.workbook_note ||
                'This 8-mark source utility enquiry is provided as an interactive digital extension alongside the printed Key Topic workbook.',
            };
          }
          if (tariff.includes('4 mark') || type.includes('inference_4m')) {
            return { inWorkbook: true, label: `In Printed Workbook • Page ${endPg}` };
          }
          if (
            tariff.includes('8 mark') ||
            tariff.includes('12 mark') ||
            tariff.includes('16 mark')
          ) {
            return { inWorkbook: true, label: `In Printed Workbook • Pages ${startPg}–${endPg}` };
          }
          return { inWorkbook: true, label: `In Printed Workbook • Pages ${startPg}–${endPg}` };
        }

        // 6. COLD WAR & OTHER UNITS WITH COMPANION WORKBOOKS
        if (unitId === 'cold_war') {
          const mapEntry =
            WORKBOOK_PAGE_MAP?.cold_war?.[lessonId] ||
            WORKBOOK_PAGE_MAP?.cold_war?.[`lesson_${lNum}`];
          if (mapEntry?.page) {
            const booklet = mapEntry.booklet || 'Pupil Workbook';
            return {
              inWorkbook: true,
              label: `In Printed Workbook • Page ${mapEntry.page + 1} (${booklet})`,
            };
          }
        }

        const unitsWithWorkbooks = [
          'cold_war',
          'medieval_england',
          'great_war',
          'great_war_part2',
          'industrialisation_and_empire',
          'the_shoah',
          'monarchy_religion_power',
          'first_british_empire',
          'second_british_empire',
          'water_and_sanitation',
          'australia',
          'ks2_romans',
          'ks2_ww2',
        ];

        if (unitsWithWorkbooks.includes(unitId)) {
          return { inWorkbook: true, label: 'In Printed Workbook • Companion Spread' };
        }

        if (qObj && qObj.inWorkbook === true) {
          return {
            inWorkbook: true,
            label: 'In Printed Workbook',
            note: qObj.workbook_note || '',
          };
        }

        return null;
      };

      const validEpStimulus = (epStimulus || []).filter((s) => {
        if (!s) return false;
        const txt = typeof s === 'string' ? s : s.content || s.text || s.extract || '';
        const hasImg = typeof s === 'object' && !!(s.image || s.src || s.image_url || s.asset_path);
        if (/^contemporary archival extract\.?$/i.test(String(txt).trim())) return false;
        return Boolean(String(txt).trim() || hasImg);
      });

      const formatStimulusForProjector = (stimList, opts = {}) => {
        if (opts && Array.isArray(opts.quadSources) && opts.quadSources.length > 0) {
          const topInterps = (stimList || []).slice(0, 2).map(ensureInterpItem).filter(Boolean);
          const botSources = opts.quadSources
            .slice(0, 2)
            .map(ensureSupportSourceItem)
            .filter(Boolean);
          const seamLabel =
            opts.seamMode === 'q3c'
              ? '🔗 Evidence Pairing: Left = Interp 1 ↔ Source B  •  Right = Interp 2 ↔ Source C'
              : '📎 Supporting Enquiry Booklet: Left = Interp 1 ↔ Source B  •  Right = Interp 2 ↔ Source C';
          return `
            <div class="proj-quad-matrix">
              <div class="proj-quad-top">
                ${topInterps.map((st, idx) => renderProjectorPane(st, idx)).join('')}
              </div>
              <div class="proj-quad-seam">
                <span>${seamLabel}</span>
                <button type="button" onclick="window.toggleProjectorQuadSources && window.toggleProjectorQuadSources(this)" style="background: #ffffff; color: #1e3a8a; border: 1px solid #93c5fd; border-radius: 5px; padding: 2px 9px; font-size: 0.76rem; font-weight: 700; cursor: pointer;">Hide Sources B &amp; C ▴</button>
              </div>
              <div class="proj-quad-bottom">
                ${botSources.map((st, idx) => renderProjectorPane(st, idx)).join('')}
              </div>
            </div>
          `;
        }
        if (!Array.isArray(stimList) || stimList.length === 0) return '';
        if (stimList.length >= 2) {
          return `<div class="proj-pair-grid">${stimList
            .map((st, idx) => renderProjectorPane(st, idx))
            .join('')}</div>`;
        }
        return `<div class="proj-single-card">${renderProjectorPane(stimList[0], 0)}</div>`;
      };

      const renderStimulusCollection = (items, uid) => {
        if (!Array.isArray(items) || items.length === 0) return '';
        const gridClass = items.length >= 2 ? 'p3-adjoined-pair' : 'exam-stimulus-single';
        return `<div class="${gridClass}">${items
          .map((st, sIdx) => renderSingleStimulus(st, sIdx, uid))
          .join('')}</div>`;
      };

      const ensureInterpItem = (item, idx) => {
        if (!item) return null;
        if (typeof item === 'string') {
          return /Interpretation\s+[0-9]+/i.test(item)
            ? item
            : `**Interpretation ${idx + 1}**: ${item}`;
        }
        const m = String(item.title || item.label || item.id || '').match(
          /(?:Interpretation|interp[_-\s]*)\s*([0-9]+)/i,
        );
        return {
          ...item,
          isInterp: true,
          interpNum: item.interpNum || (m ? m[1] : `${idx + 1}`),
        };
      };

      const ensureSupportSourceItem = (item, idx) => {
        if (!item) return null;
        const defaultLtr = idx === 0 ? 'B' : idx === 1 ? 'C' : String.fromCharCode(66 + idx);
        if (typeof item === 'string') {
          return /^Source\s+[A-Z]/i.test(item.replace(/^\*\*/, '').trim())
            ? item
            : `**Source ${defaultLtr}**: ${item}`;
        }
        const m = String(item.title || item.label || item.id || '').match(
          /(?:^Source\s+|^source[_-\s]*)([A-E])\b/i,
        );
        const ltr =
          (item.letter ? String(item.letter).trim().toUpperCase() : '') ||
          (m ? m[1].toUpperCase() : defaultLtr);
        return {
          ...item,
          isInterp: false,
          letter: ltr,
        };
      };

      const renderQuadMatrix = (interps, supportSources, seamMode, uid) => {
        const normInterps = (interps || []).slice(0, 2).map(ensureInterpItem).filter(Boolean);
        const normSources = (supportSources || [])
          .slice(0, 2)
          .map(ensureSupportSourceItem)
          .filter(Boolean);
        if (normInterps.length === 0 && normSources.length === 0) return '';
        if (normSources.length === 0) {
          return renderStimulusCollection(normInterps, `${uid}_interp`);
        }
        const seamText =
          seamMode === 'q3c'
            ? '🔗 Evidence Pairing: Left = Interp 1 ↔ Source B  •  Right = Interp 2 ↔ Source C'
            : '📎 Supporting Enquiry Booklet: Left = Interp 1 ↔ Source B  •  Right = Interp 2 ↔ Source C (Contextual support — evaluate Interps 1 &amp; 2 + Own Knowledge)';
        return `
          <div class="p3-quad-matrix" data-seam-mode="${seamMode}">
            <div class="p3-quad-top-row">
              ${normInterps.map((st, sIdx) => renderSingleStimulus(st, sIdx, `${uid}_i${sIdx + 1}`)).join('')}
            </div>
            <div class="p3-quad-seam no-print">
              <span class="p3-quad-seam-text">${seamText}</span>
              <div class="p3-quad-seam-actions">
                <button type="button" class="p3-seam-btn" aria-expanded="true" onclick="window.toggleP3QuadSources && window.toggleP3QuadSources(this)">Hide Sources B &amp; C ▴</button>
              </div>
            </div>
            <div class="p3-quad-bottom-row">
              ${normSources.map((st, sIdx) => renderSingleStimulus(st, sIdx, `${uid}_s${sIdx + 1}`)).join('')}
            </div>
          </div>
        `;
      };

      const findSourceItemByLetter = (
        letter,
        { preferLessonSources = false, qObj = null } = {},
      ) => {
        const L = String(letter || '').trim().toUpperCase();
        if (!L) return null;

        const matchesLetter = (s) => {
          if (!s) return false;
          if (typeof s === 'object') {
            if (s.letter && String(s.letter).trim().toUpperCase() === L) return true;
            const rawId = String(s.id || '').trim();
            if (
              rawId.toUpperCase() === L ||
              new RegExp(`^source[_\\-\\s]*${L}$`, 'i').test(rawId)
            ) {
              return true;
            }
          }
          const t = typeof s === 'string' ? s : s.title || s.label || s.id || '';
          return new RegExp(`^(?:\\*\\*)?Source\\s+${L}\\b`, 'i').test(String(t).trim());
        };

        const normalizeSource = (s) => {
          if (!s) return null;
          if (typeof s === 'string') return s;
          const rawTitle = String(s.title || s.label || s.id || '').trim();
          const normalizedTitle = rawTitle
            ? /^Source\s+/i.test(rawTitle)
              ? rawTitle
              : `Source ${L}: ${rawTitle}`
            : `Source ${L}`;
          return {
            ...s,
            isInterp: false,
            letter: L,
            title: normalizedTitle,
            content: s.content || s.text || s.extract || '',
            provenance: s.provenance || s.attribution || s.citation || '',
          };
        };

        // 1. Always check question-level sources / supporting_sources / stimulus first if explicitly provided on qObj
        if (qObj && typeof qObj === 'object') {
          if (Array.isArray(qObj.sources)) {
            const fromQSrcs = qObj.sources.find(matchesLetter);
            if (fromQSrcs) return normalizeSource(fromQSrcs);
          }
          if (Array.isArray(qObj.supporting_sources)) {
            const fromQSup = qObj.supporting_sources.find(matchesLetter);
            if (fromQSup) return normalizeSource(fromQSup);
          }
          if (Array.isArray(qObj.stimulus)) {
            const fromQStim = qObj.stimulus.find(matchesLetter);
            if (fromQStim) return normalizeSource(fromQStim);
          }
        }

        // 2. Check lesson.exam_practice.sources and lesson.exam_practice.supporting_sources
        const epSrcList = Array.isArray(lesson?.exam_practice?.sources)
          ? lesson.exam_practice.sources
          : [];
        const fromEpSrcs = epSrcList.find(matchesLetter);
        if (fromEpSrcs) return normalizeSource(fromEpSrcs);

        const epSupList = Array.isArray(lesson?.exam_practice?.supporting_sources)
          ? lesson.exam_practice.supporting_sources
          : [];
        const fromEpSup = epSupList.find(matchesLetter);
        if (fromEpSup) return normalizeSource(fromEpSup);

        const lookupInLessonSources = () => {
          const lSrcs = Array.isArray(lesson?.sources) ? lesson.sources : [];
          const byMatch = lSrcs.find(matchesLetter);
          if (byMatch) return normalizeSource(byMatch);

          const posIdx = L.charCodeAt(0) - 65;
          if (posIdx >= 0 && posIdx < lSrcs.length) {
            const candidate = lSrcs[posIdx];
            const candLetter = String(candidate?.letter || '').trim().toUpperCase();
            const candTitle = String(candidate?.title || candidate?.label || '').trim();
            const hasConflictingLetter =
              (candLetter && candLetter !== L) ||
              (/^Source\s+[A-Z]\b/i.test(candTitle) &&
                !new RegExp(`^Source\\s+${L}\\b`, 'i').test(candTitle));
            if (!hasConflictingLetter) {
              return normalizeSource(candidate);
            }
          }
          return null;
        };

        const lookupInEpStimulus = () => {
          const fromEp = validEpStimulus.find(matchesLetter);
          return fromEp ? normalizeSource(fromEp) : null;
        };

        // 3. Multi-source enquiries (Q3a / Q3c / Q3d) prefer lesson.sources BEFORE validEpStimulus;
        //    single-source Q1 Inference checks validEpStimulus BEFORE lesson.sources.
        if (preferLessonSources) {
          return lookupInLessonSources() || lookupInEpStimulus();
        }
        return lookupInEpStimulus() || lookupInLessonSources();
      };

      const extractRequestedSourceLetters = (rawStr) => {
        const letters = [];
        const add = (ch) => {
          const up = String(ch || '').trim().toUpperCase();
          if (up && !letters.includes(up)) letters.push(up);
        };
        const text = String(rawStr || '');
        for (const m of text.matchAll(/\bSources\s+([A-E])\s+(?:and|&)\s+([A-E])\b/gi)) {
          add(m[1]);
          add(m[2]);
        }
        for (const m of text.matchAll(/\bSource\s+([A-E])\b/gi)) {
          add(m[1]);
        }
        return letters;
      };

      const resolveLessonInterpretations = (qObj) => {
        const epCanonicalInterps = Array.isArray(lesson?.exam_practice?.interpretations)
          ? lesson.exam_practice.interpretations
          : [];
        const enrichWithCanonicalAudio = (list) =>
          list.map((it, idx) => {
            if (!it || typeof it !== 'object' || it.studio_audio) return it;
            const num = String(it.interpNum || idx + 1);
            const match = epCanonicalInterps.find(
              (c, cIdx) => String(c?.interpNum || cIdx + 1) === num && c?.studio_audio,
            );
            return match
              ? {
                  ...it,
                  studio_audio: match.studio_audio,
                  studio_voice_label: match.studio_voice_label || 'Studio Historian',
                }
              : it;
          });

        if (Array.isArray(qObj?.interpretations) && qObj.interpretations.length > 0) {
          return enrichWithCanonicalAudio(qObj.interpretations.map(ensureInterpItem).filter(Boolean));
        }
        if (
          Array.isArray(qObj?.stimulus) &&
          qObj.stimulus.some((s) =>
            /interpretation/i.test(typeof s === 'string' ? s : s.title || s.label || s.id || ''),
          )
        ) {
          return qObj.stimulus
            .filter((s) =>
              /interpretation/i.test(typeof s === 'string' ? s : s.title || s.label || s.id || ''),
            )
            .map(ensureInterpItem)
            .filter(Boolean);
        }
        if (
          Array.isArray(lesson?.exam_practice?.interpretations) &&
          lesson.exam_practice.interpretations.length > 0
        ) {
          return lesson.exam_practice.interpretations.map(ensureInterpItem).filter(Boolean);
        }
        const epInterps = validEpStimulus.filter((s) =>
          /interpretation/i.test(typeof s === 'string' ? s : s.title || s.label || s.id || ''),
        );
        if (epInterps.length > 0) return epInterps.map(ensureInterpItem).filter(Boolean);
        if (Array.isArray(lesson?.interpretations) && lesson.interpretations.length > 0) {
          return lesson.interpretations.map(ensureInterpItem).filter(Boolean);
        }
        if (
          unitId === 'weimar_nazi_germany' &&
          lesson?.id &&
          WEIMAR_WORKBOOK_INTERPRETATIONS[lesson.id]
        ) {
          return WEIMAR_WORKBOOK_INTERPRETATIONS[lesson.id].map(ensureInterpItem).filter(Boolean);
        }
        return [];
      };

      const resolvePaper3Q3dSupportingSources = (qObj, inlineParsedSources = []) => {
        // 1. Inline non-interpretation blocks from qObj.sourceExtract (>= 2 sources)
        if (inlineParsedSources.length >= 2) {
          return inlineParsedSources.slice(0, 2).map(ensureSupportSourceItem).filter(Boolean);
        }
        // 2. Explicit qObj.supporting_sources or qObj.sources array on the question itself
        if (Array.isArray(qObj?.supporting_sources) && qObj.supporting_sources.length > 0) {
          return qObj.supporting_sources.slice(0, 2).map(ensureSupportSourceItem).filter(Boolean);
        }
        if (Array.isArray(qObj?.sources) && qObj.sources.length > 0) {
          return qObj.sources.slice(0, 2).map(ensureSupportSourceItem).filter(Boolean);
        }
        // 3. Sibling q3a mock in getLessonMockQuestions sharing the same mockId (when qObj._isExtraMock)
        if (qObj?._isExtraMock) {
          const allLessonMocks = getLessonMockQuestions(unitId, lesson?.id) || [];
          const idPrefix = String(qObj.id || '').replace(/_q3[a-d]$/i, '');
          const isQ3aSibling = (m) =>
            m &&
            m.id !== qObj.id &&
            m.sourceExtract &&
            (/q3a$/i.test(String(m.id || '')) ||
              /3\s*\(\s*a\s*\)/i.test(String(m.qCode || '')) ||
              /how useful are sources/i.test(String(m.questionText || '')) ||
              /utility/i.test(String(m.type || '')));
          const samePaperSibling = qObj.mockId
            ? allLessonMocks.find((m) => m.mockId === qObj.mockId && isQ3aSibling(m))
            : idPrefix
              ? allLessonMocks.find(
                  (m) => String(m.id || '').startsWith(idPrefix) && isQ3aSibling(m),
                )
              : allLessonMocks.find(isQ3aSibling);
          if (samePaperSibling) {
            const sibParsed = parseMockSourceExtractToStimuli(samePaperSibling.sourceExtract).filter(
              (it) => !it.isInterp,
            );
            if (sibParsed.length > 0) {
              return sibParsed.slice(0, 2).map(ensureSupportSourceItem).filter(Boolean);
            }
          }
        }
        // 4. Sibling Q3(a) in lesson.exam_practice.questions or lesson.exam_practice.supporting_sources / sources
        if (!qObj?._isExtraMock) {
          const siblingQ3a = (epQuestions || []).find((cand) => {
            if (!cand || cand === qObj) return false;
            const cStr = `${cand.qCode || ''} ${cand.type || ''} ${cand.question || cand.prompt || ''}`;
            return /\b3\s*\(\s*a\s*\)/i.test(cStr) || /how\s+useful\s+are\s+sources/i.test(cStr);
          });
          if (siblingQ3a) {
            const sibArr =
              (Array.isArray(siblingQ3a.supporting_sources) &&
                siblingQ3a.supporting_sources.length > 0 &&
                siblingQ3a.supporting_sources) ||
              (Array.isArray(siblingQ3a.sources) &&
                siblingQ3a.sources.length > 0 &&
                siblingQ3a.sources) ||
              null;
            if (sibArr) {
              return sibArr.slice(0, 2).map(ensureSupportSourceItem).filter(Boolean);
            }
          }
          if (
            Array.isArray(lesson?.exam_practice?.supporting_sources) &&
            lesson.exam_practice.supporting_sources.length > 0
          ) {
            return lesson.exam_practice.supporting_sources
              .slice(0, 2)
              .map(ensureSupportSourceItem)
              .filter(Boolean);
          }
          if (
            Array.isArray(lesson?.exam_practice?.sources) &&
            lesson.exam_practice.sources.length >= 2
          ) {
            const bcFromEp = ['B', 'C']
              .map((ltr) => findSourceItemByLetter(ltr, { preferLessonSources: false, qObj }))
              .filter(Boolean);
            if (bcFromEp.length >= 2) return bcFromEp;
          }
        }
        if (inlineParsedSources.length === 1) {
          const singleSrc = ensureSupportSourceItem(inlineParsedSources[0], 0);
          const missingLtr = singleSrc?.letter === 'B' ? 'C' : 'B';
          const fallbackOther = findSourceItemByLetter(missingLtr, {
            preferLessonSources: true,
            qObj,
          });
          return fallbackOther
            ? singleSrc?.letter === 'B'
              ? [singleSrc, fallbackOther]
              : [fallbackOther, singleSrc]
            : [singleSrc];
        }
        // 5. Fallback to lesson.sources ('B' and 'C')
        return ['B', 'C']
          .map((ltr) => findSourceItemByLetter(ltr, { preferLessonSources: true, qObj }))
          .filter(Boolean);
      };

      const resolveEmbeddedQuestionStimulus = (q, qIdx, qUid) => {
        const qRaw = String(q.question || q.prompt || '');
        const qLower = qRaw.toLowerCase();
        const qTypeLower = String(q.type || '').toLowerCase();
        const codeAndText = `${q.qCode || ''} ${qRaw}`;
        const isPaper3Unit = ['weimar_nazi_germany', 'usa'].includes(unitId);

        const isPaper3Q3b =
          /main\s+difference\s+between\s+(?:these\s+|the\s+)?views/i.test(qRaw) ||
          (isPaper3Unit &&
            (/\b3\s*\(\s*b\s*\)/i.test(codeAndText) ||
              qTypeLower.includes('3b') ||
              qTypeLower.includes('diff_views') ||
              qTypeLower.includes('interp_diff')));

        const isPaper3Q3c =
          /suggest\s+one\s+reason\s+why\s+interpretations/i.test(qRaw) ||
          /why\s+interpretations\s+1\s+and\s+2\s+give\s+different/i.test(qRaw) ||
          (isPaper3Unit &&
            (/\b3\s*\(\s*c\s*\)/i.test(codeAndText) ||
              qTypeLower.includes('3c') ||
              qTypeLower.includes('why_differ') ||
              qTypeLower.includes('interp_why')));

        const isPaper3Q3d =
          /how\s+far\s+do\s+you\s+agree\s+with\s+interpretation/i.test(qRaw) ||
          (isPaper3Unit &&
            (/\b3\s*\(\s*d\s*\)/i.test(codeAndText) ||
              qTypeLower.includes('3d') ||
              qTypeLower.includes('verdict') ||
              ((parseInt(q.marks, 10) || 0) >= 16 &&
                (qTypeLower.includes('interp') || qLower.includes('interpretation')))));

        // 1. Paper 3 Q3(c) & Q3(d): Adjoined 2 × 2 Quad-Pane Matrix (Interps 1 & 2 on top + Sources B & C below)
        if (isPaper3Q3c || isPaper3Q3d) {
          let interps = [];
          let inlineSources = [];

          const applyMockInterpAudio = (list) => {
            if (!q?.interpretations_audio || !Array.isArray(list)) return list;
            return list.map((it, idx) => {
              const numKey = String(it?.interpNum || idx + 1);
              const meta = q.interpretations_audio[numKey];
              if (!meta || !meta.studio_audio) return it;
              return {
                ...it,
                studio_audio: meta.studio_audio,
                studio_voice_label: meta.studio_voice_label || 'Studio Historian',
              };
            });
          };

          if (q._isExtraMock && q.sourceExtract && String(q.sourceExtract).trim()) {
            const parsed = parseMockSourceExtractToStimuli(q.sourceExtract);
            interps = parsed.filter((it) => it.isInterp);
            inlineSources = parsed.filter((it) => !it.isInterp);
            if (interps.length === 0 && parsed.length >= 2) {
              interps = parsed.slice(0, 2).map((it, idx) => ({
                ...it,
                isInterp: true,
                interpNum: `${idx + 1}`,
              }));
              inlineSources = parsed.slice(2);
            }
            interps = applyMockInterpAudio(interps);
          }
          if (interps.length === 0) {
            interps = resolveLessonInterpretations(q);
          }

          const supportSources = resolvePaper3Q3dSupportingSources(q, inlineSources);
          const seamMode = isPaper3Q3c ? 'q3c' : 'q3d';

          return {
            html: renderQuadMatrix(interps, supportSources, seamMode, qUid),
            projectorHtml: formatStimulusForProjector(interps, {
              quadSources: supportSources,
              seamMode,
            }),
          };
        }

        // 2. Paper 3 Q3(b): Adjoined 1 × 2 Shared-Border Pair of Interpretations 1 & 2
        if (isPaper3Q3b) {
          let interps = [];
          if (q._isExtraMock && q.sourceExtract && String(q.sourceExtract).trim()) {
            const parsed = parseMockSourceExtractToStimuli(q.sourceExtract);
            interps = parsed.filter((it) => it.isInterp);
            if (interps.length === 0 && parsed.length >= 2) {
              interps = parsed.slice(0, 2).map((it, idx) => ({
                ...it,
                isInterp: true,
                interpNum: `${idx + 1}`,
              }));
            }
            if (q.interpretations_audio) {
              interps = interps.map((it, idx) => {
                const numKey = String(it?.interpNum || idx + 1);
                const meta = q.interpretations_audio[numKey];
                if (!meta || !meta.studio_audio) return it;
                return {
                  ...it,
                  studio_audio: meta.studio_audio,
                  studio_voice_label: meta.studio_voice_label || 'Studio Historian',
                };
              });
            }
          }
          if (interps.length === 0) {
            interps = resolveLessonInterpretations(q);
          }
          if (interps.length > 0) {
            return {
              html: renderStimulusCollection(interps.slice(0, 2), qUid),
              projectorHtml: formatStimulusForProjector(interps.slice(0, 2)),
            };
          }
        }

        // 3. Extra Mock Question with HTML sourceExtract (strictly source/interpretation questions only)
        const isMockStimulusQuestion =
          /\bSources?\s+[A-E]\b/i.test(qRaw) ||
          /\bInterpretations?\b/i.test(qRaw) ||
          /\binfer\b|how\s+useful|follow\s+up/i.test(qRaw) ||
          /inference|utility|follow[-_\s]?up|interp/i.test(qTypeLower);
        if (
          q._isExtraMock &&
          isMockStimulusQuestion &&
          q.sourceExtract &&
          String(q.sourceExtract).trim()
        ) {
          let parsedItems = parseMockSourceExtractToStimuli(q.sourceExtract);
          const reqLetters = extractRequestedSourceLetters(qRaw);
          if (
            reqLetters.length === 1 &&
            parsedItems.length === 1 &&
            !parsedItems[0].isInterp &&
            parsedItems[0].letter !== reqLetters[0]
          ) {
            parsedItems[0] = {
              ...parsedItems[0],
              letter: reqLetters[0],
              title: String(parsedItems[0].title || '').replace(
                /^Source\s+[A-Z0-9]+/i,
                `Source ${reqLetters[0]}`,
              ),
            };
          } else if (
            reqLetters.length >= 2 &&
            parsedItems.filter((it) => !it.isInterp).length < reqLetters.length
          ) {
            const existingLetters = new Set(
              parsedItems
                .filter((it) => !it.isInterp)
                .map((it) => String(it.letter || '').toUpperCase()),
            );
            reqLetters.forEach((ltr) => {
              if (!existingLetters.has(ltr)) {
                const fallbackSrc = findSourceItemByLetter(ltr, {
                  preferLessonSources: true,
                  qObj: q,
                });
                if (fallbackSrc) parsedItems.push(fallbackSrc);
              }
            });
          }
          if (parsedItems.length > 0) {
            return {
              html: renderStimulusCollection(parsedItems, qUid),
              projectorHtml: formatStimulusForProjector(parsedItems),
            };
          }
        }

        // 4. Other Interpretation Questions
        const needsInterps =
          /\binterpretation[s]?\s*[12]\b/i.test(qRaw) || qTypeLower.includes('interp');

        if (needsInterps) {
          const interps = resolveLessonInterpretations(q);
          if (interps.length > 0) {
            return {
              html: renderStimulusCollection(interps, qUid),
              projectorHtml: formatStimulusForProjector(interps),
            };
          }
        }

        // 5. Primary Source Questions (Source A, Sources B and C, Sources A and B, Follow-up, Inference, Utility)
        const requestedLetters = extractRequestedSourceLetters(qRaw);
        if (requestedLetters.length > 0) {
          const preferLesson =
            requestedLetters.length >= 2 ||
            qTypeLower.includes('utility') ||
            qLower.includes('how useful');
          const resolvedSrcs = requestedLetters
            .map((ltr) =>
              findSourceItemByLetter(ltr, { preferLessonSources: preferLesson, qObj: q }),
            )
            .filter(Boolean);
          if (resolvedSrcs.length > 0) {
            return {
              html: renderStimulusCollection(resolvedSrcs, qUid),
              projectorHtml: formatStimulusForProjector(resolvedSrcs),
            };
          }
          if (Array.isArray(q.sources) && q.sources.length > 0) {
            return {
              html: renderStimulusCollection(q.sources, qUid),
              projectorHtml: formatStimulusForProjector(q.sources),
            };
          }
          if (Array.isArray(q.supporting_sources) && q.supporting_sources.length > 0) {
            return {
              html: renderStimulusCollection(q.supporting_sources, qUid),
              projectorHtml: formatStimulusForProjector(q.supporting_sources),
            };
          }
        }

        // 6. Fallback if a source-based question carries explicit non-bullet q.sources, q.stimulus, or validEpStimulus
        const isUnnamedSourceQuestion =
          qTypeLower.includes('inference') ||
          qTypeLower.includes('utility') ||
          qTypeLower.includes('follow_up') ||
          qLower.includes('how useful') ||
          qLower.includes('follow up');
        if (isUnnamedSourceQuestion) {
          if (Array.isArray(q.sources) && q.sources.length > 0) {
            return {
              html: renderStimulusCollection(q.sources, qUid),
              projectorHtml: formatStimulusForProjector(q.sources),
            };
          }
          if (
            Array.isArray(q.stimulus) &&
            q.stimulus.length > 0 &&
            q.stimulus.some(
              (s) => typeof s === 'object' || /^(?:\*\*)?Source\b/i.test(String(s).trim()),
            )
          ) {
            return {
              html: renderStimulusCollection(q.stimulus, qUid),
              projectorHtml: formatStimulusForProjector(q.stimulus),
            };
          }
          if (validEpStimulus.length > 0) {
            return {
              html: renderStimulusCollection(validEpStimulus, qUid),
              projectorHtml: formatStimulusForProjector(validEpStimulus),
            };
          }
        }

        return { html: '', projectorHtml: '' };
      };

      const inferQuestionMarksAndCode = (q, qIdx) => {
        const qRaw = String(q.question || '');
        const qTariff = String(q.tariff || '');
        const qType = String(q.type || '');
        const combined = `${qTariff} ${qType} ${qRaw}`;
        const isPaper3Unit = ['weimar_nazi_germany', 'usa'].includes(unitId);

        let marks = parseInt(q.marks, 10) || 0;
        if (!marks) {
          if (/16\s*(?:\+|\(\+)\s*4|verdict_16m|16\s*marks?/i.test(combined)) marks = 16;
          else if (/12\s*marks?|12m|causation|explain\s+why/i.test(combined)) marks = 12;
          else if (
            /8\s*marks?|8m|utility|narrative\s+account|importance\s+of|explain\s+two\s+consequences/i.test(
              combined,
            )
          )
            marks = 8;
          else if (/^2\s*marks?$|feature_2m/i.test(qTariff) || qType === 'feature_2m') marks = 2;
          else marks = 4;
        }
        const cleanMarks = marks === 20 ? 16 : marks;
        const hasSpag =
          ['edexcel_medicine', 'weimar_nazi_germany', 'usa'].includes(unitId) &&
          (/16\s*(?:\+|\(\+)\s*4|verdict_16m/i.test(combined) || marks === 16 || marks === 20);
        const marksDisplay = hasSpag ? '16+4m' : `${cleanMarks}m`;
        const projectorMarksLabel = hasSpag ? '16 Marks + 4 SPaG' : `${cleanMarks} Marks`;

        let qCode = String(q.qCode || '').trim();
        if (/^3([a-d])$/i.test(qCode)) {
          qCode = `3(${qCode[1].toLowerCase()})`;
        } else if (/^2([a-b])$/i.test(qCode)) {
          qCode = `2(${qCode[1].toLowerCase()})`;
        } else if (/^1([a-b])$/i.test(qCode)) {
          qCode = `1(${qCode[1].toLowerCase()})`;
        }

        if (!qCode) {
          const m3 = qRaw.match(/^(?:(?:Question|Q)\s*)?(?:\d+[\.:\s]+)*(3\s*\([a-d]\))/i);
          const m2 = qRaw.match(/^(?:(?:Question|Q)\s*)?(?:\d+[\.:\s]+)*(2\s*\([a-b]\))/i);
          const m1 = qRaw.match(/^(?:(?:Question|Q)\s*)?(?:\d+[\.:\s]+)*(1\s*\([a-b]\))/i);
          const mQ = qRaw.match(/^(?:Question|Q)\s*(\d+(?:\([a-d]\))?)/i);
          const mLeadNum = qRaw.match(/^(\d+(?:\([a-d]\))?)\.\s+/i);
          const mTariffQ = qTariff.match(/(?:Question|Q)\s*(\d+(?:\([a-d]\))?)/i);
          if (m3) qCode = m3[1].replace(/\s+/g, '');
          else if (m2) qCode = m2[1].replace(/\s+/g, '');
          else if (m1) qCode = m1[1].replace(/\s+/g, '');
          else if (mQ) qCode = mQ[1];
          else if (mLeadNum) qCode = mLeadNum[1];
          else if (mTariffQ) qCode = mTariffQ[1];
          else if (isPaper3Unit) {
            if (
              /main\s+difference\s+between\s+(?:these\s+|the\s+)?views/i.test(qRaw) ||
              /3b|diff_views|interp_diff/i.test(qType)
            ) {
              qCode = '3(b)';
            } else if (
              /suggest\s+one\s+reason\s+why\s+interpretations/i.test(qRaw) ||
              /why\s+interpretations\s+1\s+and\s+2\s+give\s+different/i.test(qRaw) ||
              /3c|why_differ|interp_why/i.test(qType)
            ) {
              qCode = '3(c)';
            } else if (
              /how\s+far\s+do\s+you\s+agree\s+with\s+interpretation/i.test(qRaw) ||
              /3d|verdict/i.test(qType)
            ) {
              qCode = '3(d)';
            } else if (/how\s+useful\s+are\s+sources/i.test(qRaw) || /utility/i.test(qType)) {
              qCode = '3(a)';
            } else if (/give\s+two\s+things\s+you\s+can\s+infer/i.test(qRaw) || /inference/i.test(qType)) {
              qCode = '1';
            } else if (/explain\s+why/i.test(qRaw) || /causation/i.test(qType)) {
              qCode = '2';
            } else if (!q._isExtraMock) {
              qCode = `${qIdx + 1}`;
            }
          } else if (unitId === 'edexcel_medicine') {
            if (/describe\s+(?:two|one)\s+features?/i.test(qRaw) || /features/i.test(qType)) {
              qCode = '1';
            } else if (/how\s+useful/i.test(qRaw) || /utility/i.test(qType)) {
              qCode = '2(a)';
            } else if (/follow\s+up/i.test(qRaw) || /follow_up/i.test(qType)) {
              qCode = '2(b)';
            } else if (/explain\s+one\s+way\s+in\s+which/i.test(qRaw) || /similarity|difference/i.test(qType)) {
              qCode = '3';
            } else if (/explain\s+why/i.test(qRaw) || cleanMarks === 12) {
              qCode = '4';
            } else if (/how\s+far\s+do\s+you\s+agree/i.test(qRaw) || cleanMarks >= 16) {
              qCode = '5';
            } else if (!q._isExtraMock) {
              qCode = `${qIdx + 1}`;
            }
          } else if (unitId === 'cme_new') {
            if (/narrative\s+account/i.test(qRaw) || /narrative/i.test(qType)) {
              qCode = '2';
            } else if (/explain\s+the\s+importance/i.test(qRaw) || /importance/i.test(qType)) {
              qCode = '3';
            } else if (/consequence/i.test(qRaw) || /consequence/i.test(qType)) {
              qCode = '1';
            } else if (!q._isExtraMock) {
              qCode = `${qIdx + 1}`;
            }
          } else if (unitId === 'eee') {
            if (/describe\s+(?:one|two)\s+features?/i.test(qRaw) || /feature/i.test(qType)) {
              qCode = '1';
            } else if (/explain\s+why/i.test(qRaw) || cleanMarks === 12) {
              qCode = '2';
            } else if (/how\s+far\s+do\s+you\s+agree/i.test(qRaw) || cleanMarks >= 16) {
              qCode = '3';
            } else if (!q._isExtraMock) {
              qCode = `${qIdx + 1}`;
            }
          } else if (!q._isExtraMock) {
            qCode = `${qIdx + 1}`;
          }
        }

        if (
          unitId === 'cme_new' &&
          /^3\([ab]\)$/i.test(qCode) &&
          (/explain\s+the\s+importance/i.test(qRaw) || /importance/i.test(qType))
        ) {
          qCode = '3';
        }

        const pillLabel = qCode ? `Q${qCode} • ${marksDisplay}` : marksDisplay;
        return { marks: cleanMarks, marksDisplay, projectorMarksLabel, qCode, pillLabel };
      };

      const renderQuestion = (q, qIdx, wbMetaOverride = null) => {
        const qUid = q._isExtraMock
          ? String(q.id || `extra_${qIdx}`).replace(/[^a-zA-Z0-9_-]/g, '_')
          : `ep_${String(lesson?.id || 'l').replace(/[^a-zA-Z0-9_-]/g, '_')}_${qIdx}`;
        const qText = (q.question || '').toLowerCase();
        const qTariff = (q.tariff || '').toLowerCase();
        const qType = (q.type || '').toLowerCase();
        const isGcseCleanExam = [
          'eee',
          'edexcel_medicine',
          'cme_new',
          'weimar_nazi_germany',
          'usa',
        ].includes(unitId);

        const isConsequence =
          !isPaper3Weimar &&
          !qTariff.includes('8 mark') &&
          !qTariff.includes('12 mark') &&
          !qTariff.includes('16 mark') &&
          !qType.includes('utility') &&
          !qType.includes('causation') &&
          !qType.includes('verdict') &&
          !qText.includes('how useful') &&
          !qText.includes('infer') &&
          !qText.includes('3(a)') &&
          !qText.includes('3(b)') &&
          !qText.includes('3(c)') &&
          !qText.includes('3(d)') &&
          (qType.includes('consequence') ||
            qType === 'consequence_4m' ||
            /explain\s+(?:one\s+|two\s+)?consequences?/i.test(qText));

        const isSpoilerPrompt =
          (q.prompt || '').includes('Point (') ||
          (q.prompt || '').includes('Fact (') ||
          isConsequence;
        const showSpoilerPromptInDrawer = !isGcseCleanExam && isSpoilerPrompt && q.prompt;

        const embeddedStim = resolveEmbeddedQuestionStimulus(q, qIdx, qUid);

        let scaffoldBtnsHtml = '';
        let scaffoldDrawersHtml = '';
        if (q.scaffolding) {
          const sc = q.scaffolding;
          const stepsHtml = (sc.steps || [])
            .map(
              (step) => `
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-left: 4px solid #2563eb; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="background: #1e40af; color: #ffffff; font-weight: 800; font-size: 0.8rem; padding: 2px 8px; border-radius: 4px; font-family: monospace;">${step.letter}</span>
                <strong style="color: #0f172a; font-size: 0.95rem;">${step.name}</strong>
              </div>
              <div style="font-size: 0.9rem; color: #334155; margin-bottom: 4px;">${step.prompt}</div>
              ${step.starter ? `<div style="font-size: 0.85rem; color: #1e40af; font-style: italic; background: #f0f9ff; padding: 4px 8px; border-radius: 4px;"><strong>Starter:</strong> "${step.starter}"</div>` : ''}
            </div>
          `,
            )
            .join('');

          const cleanGuidance =
            sc.guidance && !/[×+]|\[1m\]/i.test(String(sc.guidance)) ? sc.guidance : '';
          const hasHeaderAboveStarters = !!(
            cleanGuidance ||
            showSpoilerPromptInDrawer ||
            (sc.steps && sc.steps.length > 0)
          );
          const startersHtml =
            sc.sentence_starters && sc.sentence_starters.length > 0
              ? `
            <div style="margin-top: ${hasHeaderAboveStarters ? '10px' : '0'};">
              <strong style="font-size: 0.85rem; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-pen-fancy" style="color: #3b82f6;"></i> Sentence Starters:</strong>
              <ul style="margin: 6px 0 0 0; padding-left: 20px; font-size: 0.9rem; color: #334155; line-height: 1.5;">
                ${sc.sentence_starters.map((st) => `<li><em>"${st}"</em></li>`).join('')}
              </ul>
            </div>
          `
              : '';

          const connectivesHtml =
            sc.connectives_bank && sc.connectives_bank.length > 0
              ? `
            <div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
              <span style="font-size: 0.8rem; font-weight: bold; color: #64748b; text-transform: uppercase;">${sc.connectives_label || 'Causal Connective Bank'}:</span>
              ${sc.connectives_bank.map((conn) => `<span class="wb-interactive-chip" data-action="toggle-wb-chip" role="button" tabindex="0" title="Tap to cross off once used" style="background: #e2e8f0; border: 1px solid #cbd5e1; color: #1e293b; font-size: 0.8rem; font-weight: 600; padding: 2px 8px; border-radius: 12px;">${conn}</span>`).join('')}
            </div>
          `
              : '';

          const resolvedVocabBank =
            Array.isArray(sc.vocab_bank) && sc.vocab_bank.length > 0
              ? sc.vocab_bank
              : Array.isArray(sc.word_bank) && sc.word_bank.length > 0
                ? sc.word_bank
                : isKs3Unit
                  ? (lesson?.tasks || []).find(
                      (t) =>
                        Array.isArray(t?.scaffolding?.word_bank) &&
                        t.scaffolding.word_bank.length > 0,
                    )?.scaffolding.word_bank ||
                    (Array.isArray(lesson?.vocab)
                      ? lesson.vocab
                          .map((v) => (typeof v === 'object' ? v.term : v))
                          .filter(Boolean)
                      : [])
                  : [];

          const hasStimulusForVocab = Boolean(embeddedStim && embeddedStim.html);
          const wbSectionHeading = isKs3Unit
            ? 'Core Vocabulary Bank:'
            : 'Specification Word Bank:';
          let vocabBankInnerHtml = '';
          if (resolvedVocabBank.length > 0) {
            if (hasStimulusForVocab) {
              const classified = resolvedVocabBank.map((term) => ({
                term,
                inSource: isVocabTermPresentInStimulus(term, embeddedStim.html),
              }));
              const ownTerms = classified.filter((x) => !x.inSource);
              const srcTerms = classified.filter((x) => x.inSource);
              const ordered = [...ownTerms, ...srcTerms];
              const hasBoth = ownTerms.length > 0 && srcTerms.length > 0;
              const legendHtml = hasBoth
                ? `<span style="font-size: 0.72rem; font-weight: 600; color: #64748b; margin-left: 2px;"><span style="color: #0f766e; font-weight: 700;">&#9679; Own Knowledge</span> &bull; <span style="color: #1d4ed8; font-weight: 700;">&#9679; In Source</span> &bull; Tap to cross off</span>`
                : `<span style="font-size: 0.72rem; font-weight: 600; color: #64748b; margin-left: 2px;">Tap to cross off</span>`;
              vocabBankInnerHtml = `
                <div>
                  <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: baseline; margin-bottom: 6px;">
                    <span style="font-size: 0.78rem; font-weight: 800; color: #0f766e; text-transform: uppercase;">${wbSectionHeading}</span>
                    ${legendHtml}
                  </div>
                  <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                    ${ordered
                      .map((item) =>
                        item.inSource
                          ? `<span class="wb-interactive-chip" data-action="toggle-wb-chip" role="button" tabindex="0" title="In Source / Provenance (useful for quotes &amp; NOP — tap to cross off)" style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; font-size: 0.8rem; font-weight: 700; padding: 2px 9px; border-radius: 12px;">${item.term}</span>`
                          : `<span class="wb-interactive-chip" data-action="toggle-wb-chip" role="button" tabindex="0" title="External Own Knowledge (beyond the source — tap to cross off)" style="background: #f0fdfa; border: 1px solid #99f6e4; color: #115e59; font-size: 0.8rem; font-weight: 700; padding: 2px 9px; border-radius: 12px;">${item.term}</span>`,
                      )
                      .join('')}
                  </div>
                </div>
              `;
            } else {
              vocabBankInnerHtml = `
                <div>
                  <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: baseline; margin-bottom: 6px;">
                    <span style="font-size: 0.78rem; font-weight: 800; color: #0f766e; text-transform: uppercase;">${wbSectionHeading}</span>
                    <span style="font-size: 0.72rem; font-weight: 600; color: #64748b; margin-left: 2px;">Tap to cross off</span>
                  </div>
                  <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                    ${resolvedVocabBank.map((term) => `<span class="wb-interactive-chip" data-action="toggle-wb-chip" role="button" tabindex="0" title="Tap to cross off once used" style="background: #f0fdfa; border: 1px solid #99f6e4; color: #115e59; font-size: 0.8rem; font-weight: 700; padding: 2px 9px; border-radius: 12px;">${term}</span>`).join('')}
                  </div>
                </div>
              `;
            }
          }

          const redFlagsHtml =
            sc.red_flags && sc.red_flags.length > 0
              ? `
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 10px 12px; margin-top: 12px;">
              <strong style="font-size: 0.85rem; color: #b91c1c; text-transform: uppercase; display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-triangle-exclamation"></i> Examiner Red Flags:</strong>
              <ul style="margin: 6px 0 0 0; padding-left: 18px; font-size: 0.85rem; color: #991b1b; line-height: 1.4;">
                ${sc.red_flags.map((rf) => `<li>${rf}</li>`).join('')}
              </ul>
            </div>
          `
              : '';

          const checklistHtml =
            sc.checklist && sc.checklist.length > 0
              ? `
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 10px 12px; margin-top: 10px;">
              <strong style="font-size: 0.85rem; color: #15803d; text-transform: uppercase; display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-square-check"></i> Self-Audit Checklist:</strong>
              <ul style="margin: 6px 0 0 0; padding-left: 18px; font-size: 0.85rem; color: #166534; line-height: 1.4;">
                ${sc.checklist.map((cl) => `<li>${cl}</li>`).join('')}
              </ul>
            </div>
          `
              : '';

          const hasWordBankDropdown = Boolean(vocabBankInnerHtml);
          const hasStartersDropdown = !!(
            cleanGuidance ||
            showSpoilerPromptInDrawer ||
            (sc.steps && sc.steps.length > 0) ||
            (sc.sentence_starters && sc.sentence_starters.length > 0) ||
            (sc.connectives_bank && sc.connectives_bank.length > 0) ||
            (sc.red_flags && sc.red_flags.length > 0) ||
            (sc.checklist && sc.checklist.length > 0)
          );

          const startersBtnLabel =
            sc.steps && sc.steps.length > 0
              ? 'Sentence Starters &amp; Steps'
              : 'Sentence Starters';

          scaffoldBtnsHtml = [
            hasWordBankDropdown
              ? `<button type="button" class="btn btn-pedagogy btn-pedagogy-sm" data-action="toggle-element" data-target-id="ep-wordbank-${qUid}" style="background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4; padding: 5px 11px; border-radius: 7px; font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; gap: 5px; margin: 0;">
                  <i class="fa-solid fa-tags" style="color: #0d9488;"></i> Word Bank <i class="fa-solid fa-chevron-down wb-dd-chevron" style="font-size: 0.66rem; opacity: 0.75;"></i>
                </button>`
              : '',
            hasStartersDropdown
              ? `<button type="button" class="btn btn-pedagogy btn-pedagogy-sm" data-action="toggle-element" data-target-id="ep-scaffold-${qUid}" style="background: #f1f5f9; color: #1e3a8a; border: 1px solid #cbd5e1; padding: 5px 11px; border-radius: 7px; font-size: 0.8rem; font-weight: 600; display: inline-flex; align-items: center; gap: 5px; margin: 0;">
                  <i class="fa-solid fa-wand-magic-sparkles" style="color: #2563eb;"></i> ${startersBtnLabel} <i class="fa-solid fa-chevron-down wb-dd-chevron" style="font-size: 0.66rem; opacity: 0.75;"></i>
                </button>`
              : '',
          ]
            .filter(Boolean)
            .join('');

          scaffoldDrawersHtml =
            hasWordBankDropdown || hasStartersDropdown
              ? `
              ${
                hasWordBankDropdown
                  ? `<div id="ep-wordbank-${qUid}" class="scaffold-box no-print" style="display: none; background: #f8fafc; border: 1.5px solid #99f6e4; border-radius: 8px; padding: 10px 14px; margin-top: 8px;">
                      ${vocabBankInnerHtml}
                    </div>`
                  : ''
              }
              ${
                hasStartersDropdown
                  ? `<div id="ep-scaffold-${qUid}" class="scaffold-box no-print" style="display: none; background: #f8fafc; border: 1.5px solid #93c5fd; border-radius: 8px; padding: 12px 15px; margin-top: 8px;">
                      ${cleanGuidance ? `<p style="font-size: 0.88rem; color: #475569; margin: 0 0 10px 0; font-style: italic;">${cleanGuidance}</p>` : ''}
                      ${showSpoilerPromptInDrawer ? `<div style="font-size: 0.88rem; color: #334155; margin: 0 0 12px 0; background: #ffffff; border: 1px solid #cbd5e1; border-left: 3px solid #64748b; padding: 8px 12px; border-radius: 4px;"><strong><i class="fa-solid fa-circle-info" style="color: #3b82f6;"></i> Guidance:</strong> ${q.prompt}</div>` : ''}
                      ${stepsHtml}
                      ${startersHtml}
                      ${connectivesHtml}
                      ${redFlagsHtml}
                      ${checklistHtml}
                    </div>`
                  : ''
              }
            `
              : '';
        }

        const isInference =
          qText.includes('infer') ||
          qType.includes('inference') ||
          /give two things you can infer/i.test(q.question || '');

        const isInterpDiff =
          qText.includes('difference between these views') ||
          qText.includes('difference between the views') ||
          qType.includes('3b') ||
          qType.includes('diff_views') ||
          qType.includes('interp_diff') ||
          /\b3\s*\(\s*b\s*\)/i.test(`${q.qCode || ''} ${q.question || ''}`);

        const isInterpWhy =
          qText.includes('reason why interpretations') ||
          qText.includes('why interpretations 1 and 2 give different') ||
          qType.includes('3c') ||
          qType.includes('why_differ') ||
          qType.includes('interp_why') ||
          /\b3\s*\(\s*c\s*\)/i.test(`${q.qCode || ''} ${q.question || ''}`);

        const isFollowUp = qText.includes('follow up source') || qType.includes('follow_up');

        const isFeatures = qText.includes('describe two features') || qType.includes('features');

        const isImportance =
          !isConsequence &&
          (qType.includes('importance') ||
            qText.includes('explain the importance') ||
            /\bimportance of\b/i.test(qText));

        const isNarrative =
          !isConsequence &&
          !isImportance &&
          (qType.includes('narrative') ||
            qText.includes('narrative account') ||
            /\bnarrative account\b/i.test(qText));

        const isCausation12 =
          !isConsequence &&
          !isImportance &&
          !isNarrative &&
          (qType.includes('causation') ||
            qType.includes('explain_why') ||
            qTariff.includes('12 mark') ||
            qType.includes('12m') ||
            /explain why/i.test(q.question || ''));

        const isVerdict16 =
          qType.includes('verdict') ||
          qTariff.includes('16 mark') ||
          qType.includes('16m') ||
          /how far do you agree with interpretation/i.test(q.question || '');

        const isUtility =
          !isConsequence &&
          !isFeatures &&
          !isInference &&
          !isInterpDiff &&
          !isInterpWhy &&
          !isFollowUp &&
          !isImportance &&
          !isNarrative &&
          !isCausation12 &&
          !isVerdict16 &&
          (qType.includes('utility') ||
            qText.includes('how useful') ||
            qText.includes('source utility') ||
            (qTariff.includes('8 mark') && !isCme && !isImportance && !isNarrative));

        let stampHtml = '';
        if (isConsequence) {
          stampHtml = `
            <div class="edexcel-peel-stamp" style="margin: 10px 0 16px 0; border: 2px solid #0284c7; border-radius: 8px; background: #f0f9ff; padding: 12px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1.5px solid #bae6fd; padding-bottom: 6px;">
                <span style="font-weight: 800; font-size: 0.92rem; color: #0369a1; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-stamp" style="margin-right: 6px;"></i> Edexcel 4-Mark Consequence PEE Structure Strip</span>
                <span style="background: #0284c7; color: white; font-size: 0.78rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">[4 marks &bull; 5 mins]</span>
              </div>
              <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 0.88rem; line-height: 1.4; color: #0f172a;">
                <span style="background: #0284c7; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">P</span>
                <div><strong>Point (Consequence):</strong> <em>"One significant consequence of [Event] was..."</em> (Directly state the resulting change)</div>
                <span style="background: #0284c7; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">E</span>
                <div><strong>Evidence (Historical Detail):</strong> <em>"Specifically, [names, dates, treaties, or figures]..."</em> (Deploy precise factual proof)</div>
                <span style="background: #0284c7; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">E</span>
                <div><strong>Explanation (Causal Impact):</strong> <em>"This resulted in... / Consequently, this led to..."</em> (Explain the ongoing historical effect)</div>
                <div style="grid-column: 1 / -1; margin-top: 6px; padding: 6px 10px; background: #e0f2fe; border-left: 3px solid #0284c7; border-radius: 4px; font-size: 0.8rem; color: #0369a1; font-weight: 600;">
                  <i class="fa-solid fa-lightbulb"></i> <strong>Examiner Tip:</strong> Only write ONE consequence. Explaining two separate consequences wastes time and gains zero extra marks.
                </div>
                ${
                  q.examiner_tip
                    ? `
                  <div style="grid-column: 1 / -1; margin-top: 4px; padding: 6px 10px; background: #fff1f2; border-left: 3px solid #e11d48; border-radius: 4px; font-size: 0.8rem; color: #9f1239; font-weight: 600;">
                    <i class="fa-solid fa-triangle-exclamation"></i> <strong>Topic Trap Alert:</strong> ${q.examiner_tip}
                  </div>
                `
                    : ''
                }
              </div>
            </div>
          `;
        } else if (isImportance) {
          stampHtml = `
            <div class="edexcel-peel-stamp" style="margin: 10px 0 16px 0; border: 2px solid #059669; border-radius: 8px; background: #ecfdf5; padding: 12px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1.5px solid #a7f3d0; padding-bottom: 6px;">
                <span style="font-weight: 800; font-size: 0.92rem; color: #065f46; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-scale-balanced" style="margin-right: 6px;"></i> Edexcel 8-Mark Importance Structure Strip (Paper 2 Q3)</span>
                <span style="background: #059669; color: white; font-size: 0.78rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">[8 marks &bull; 16 mins]</span>
              </div>
              <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 0.88rem; line-height: 1.4; color: #0f172a;">
                <span style="background: #059669; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">A1</span>
                <div><strong>Aspect 1 (Direct Impact &amp; Cause) [4m]:</strong> <em>"One key reason [Event] was important for [Outcome] was that..."</em> (Deploy precise factual evidence and explain the direct mechanism of change)</div>
                <span style="background: #059669; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">A2</span>
                <div><strong>Aspect 2 (Long-Term / Broader Impact) [4m]:</strong> <em>"Furthermore, [Event] was decisive for [Outcome] because..."</em> (Explain a second distinct causal development or long-term consequence)</div>
                <div style="grid-column: 1 / -1; margin-top: 6px; padding: 6px 10px; background: #d1fae5; border-left: 3px solid #059669; border-radius: 4px; font-size: 0.8rem; color: #065f46; font-weight: 600;">
                  <i class="fa-solid fa-lightbulb"></i> <strong>Examiner Tip:</strong> Zero marks are awarded for introductions or conclusions. Dive straight into 2 distinct paragraphs explaining what difference X made to Y.
                </div>
                ${
                  q.examiner_tip
                    ? `
                  <div style="grid-column: 1 / -1; margin-top: 4px; padding: 6px 10px; background: #fff1f2; border-left: 3px solid #e11d48; border-radius: 4px; font-size: 0.8rem; color: #9f1239; font-weight: 600;">
                    <i class="fa-solid fa-triangle-exclamation"></i> <strong>Topic Trap Alert:</strong> ${q.examiner_tip}
                  </div>
                `
                    : ''
                }
              </div>
            </div>
          `;
        } else if (isNarrative) {
          stampHtml = `
            <div class="edexcel-peel-stamp" style="margin: 10px 0 16px 0; border: 2px solid #b45309; border-radius: 8px; background: #fffbeb; padding: 12px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1.5px solid #fde68a; padding-bottom: 6px;">
                <span style="font-weight: 800; font-size: 0.92rem; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-timeline" style="margin-right: 6px;"></i> Edexcel 8-Mark Narrative Account Structure Strip (Paper 2 Q2)</span>
                <span style="background: #b45309; color: white; font-size: 0.78rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">[8 marks &bull; 16 mins]</span>
              </div>
              <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 0.88rem; line-height: 1.4; color: #0f172a;">
                <span style="background: #b45309; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">N1</span>
                <div><strong>Beginning / Catalyst [2–3m]:</strong> State the initial cause or starting condition with precise historical evidence.</div>
                <span style="background: #b45309; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">N2</span>
                <div><strong>Development / Causal Link [3–4m]:</strong> <em>"This directly led to..."</em> (Use chronological connectives to bridge to the next turning point)</div>
                <span style="background: #b45309; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">N3</span>
                <div><strong>Outcome / Consequence [2–3m]:</strong> <em>"Consequently, the decisive result was..."</em> (Explain the final outcome and its immediate consequence)</div>
                <div style="grid-column: 1 / -1; margin-top: 6px; padding: 6px 10px; background: #fef3c7; border-left: 3px solid #b45309; border-radius: 4px; font-size: 0.8rem; color: #92400e; font-weight: 600;">
                  <i class="fa-solid fa-lightbulb"></i> <strong>Examiner Tip:</strong> Do not just tell a descriptive story. You must cover at least 3 chronological phases and use explicit causal bridges to link them.
                </div>
                ${
                  q.examiner_tip
                    ? `
                  <div style="grid-column: 1 / -1; margin-top: 4px; padding: 6px 10px; background: #fff1f2; border-left: 3px solid #e11d48; border-radius: 4px; font-size: 0.8rem; color: #9f1239; font-weight: 600;">
                    <i class="fa-solid fa-triangle-exclamation"></i> <strong>Topic Trap Alert:</strong> ${q.examiner_tip}
                  </div>
                `
                    : ''
                }
              </div>
            </div>
          `;
        } else if (isCausation12) {
          const causationPaperLabel = unitId === 'edexcel_medicine' ? 'Paper 1 Q5/Q6' : unitId === 'eee' ? 'Paper 2 Q2' : 'Paper 3 Q2';
          const p1Copy =
            unitId === 'eee'
              ? `<strong>Paragraph 1 — First Analytical Reason [PEEL]:</strong> State a clear historical reason (you may use Stimulus 1), support with precise names and dates, and explain <em>how</em> it caused the outcome in the question.`
              : `<strong>Aspect 1 (Content &amp; Cause 1) [PEEL]:</strong> Point stating cause &bull; Specific historical evidence (names, dates, data) &bull; Explanation of mechanism &bull; Link directly back to question stem.`;
          const p2Copy =
            unitId === 'eee'
              ? `<strong>Paragraph 2 — Second Analytical Reason [PEEL]:</strong> Develop a second distinct reason (you may use Stimulus 2) with specific Tudor detail and explicit causal explanation.`
              : `<strong>Aspect 2 (Content &amp; Cause 2) [PEEL]:</strong> Second distinct historical cause with precise own knowledge, analysing how it generated change.`;
          const p3Copy =
            unitId === 'eee'
              ? `<strong>Paragraph 3 — Own Knowledge Beyond Stimulus [PEEL]:</strong> Explain a third distinct reason entirely from <strong>your own knowledge</strong> (mandatory to break the Level 2 cap at 6/12 and reach Level 4!).`
              : `<strong>Aspect 3 (Content &amp; Cause 3) [PEEL]:</strong> Third distinct historical aspect (crucial ceiling requirement to access Level 4!).`;
          const tipCopy12 =
            unitId === 'eee'
              ? `Under Pearson Edexcel Paper 2 rules, answers relying solely on the two printed stimulus prompts are <strong>capped at Level 2 (max 6/12)</strong>. Explain 3 distinct reasons (including independent own knowledge) to access Level 4 (10–12 marks). Skip intros and conclusions!`
              : `You MUST cover at least 3 distinct aspects of content to access Level 4 (10–12 marks). Answers with only 2 aspects are capped at 8 marks. Causes do NOT need to be prioritized or linked together, and zero marks are awarded for intros/conclusions!`;
          stampHtml = `
            <div class="edexcel-peel-stamp" style="margin: 10px 0 16px 0; border: 2px solid #0369a1; border-radius: 8px; background: #f0f9ff; padding: 12px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1.5px solid #bae6fd; padding-bottom: 6px;">
                <span style="font-weight: 800; font-size: 0.92rem; color: #075985; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-sitemap" style="margin-right: 6px;"></i> Edexcel 12-Mark ‘Explain Why’ Structure Strip (${causationPaperLabel})</span>
                <span style="background: #0284c7; color: white; font-size: 0.78rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">[12 marks &bull; 18 mins]</span>
              </div>
              <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 0.88rem; line-height: 1.4; color: #0f172a;">
                <span style="background: #0284c7; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">P1</span>
                <div>${p1Copy}</div>
                <span style="background: #0284c7; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">P2</span>
                <div>${p2Copy}</div>
                <span style="background: #0284c7; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">P3</span>
                <div>${p3Copy}</div>
                <div style="grid-column: 1 / -1; margin-top: 6px; padding: 6px 10px; background: #e0f2fe; border-left: 3px solid #0284c7; border-radius: 4px; font-size: 0.8rem; color: #0369a1; font-weight: 600;">
                  <i class="fa-solid fa-lightbulb"></i> <strong>Examiner Tip:</strong> ${tipCopy12}
                </div>
                ${
                  q.examiner_tip
                    ? `
                  <div style="grid-column: 1 / -1; margin-top: 4px; padding: 6px 10px; background: #fff1f2; border-left: 3px solid #e11d48; border-radius: 4px; font-size: 0.8rem; color: #9f1239; font-weight: 600;">
                    <i class="fa-solid fa-triangle-exclamation"></i> <strong>Topic Trap Alert:</strong> ${q.examiner_tip}
                  </div>
                `
                    : ''
                }
              </div>
            </div>
          `;
        } else if (isVerdict16) {
          const isThematicEssay = unitId === 'edexcel_medicine' || unitId === 'eee';
          if (isThematicEssay) {
            const verdictPaperLabel = unitId === 'edexcel_medicine' ? 'Paper 1 Q7/Q8' : 'Paper 2 Q3/Q4';
            const marksLabel = unitId === 'eee' ? '16 marks • Zero SPaG • 25 mins' : '16+4 SPaG &bull; 25 mins';
            const criteriaExample =
              unitId === 'eee'
                ? `(e.g. underlying root cause vs short-term trigger; scale of domestic vs foreign threat; breadth of impact across social ranks)`
                : `(e.g. immediate acute clinical treatment vs long-term population-wide prevention; scale vs durability of impact)`;
            const examinerTipHtml =
              unitId === 'edexcel_medicine'
                ? `You <strong>CANNOT</strong> reach Level 4 without bringing in substantial historical evidence from beyond the stimulus points! Zero marks are awarded for pure narrative storytelling; your conclusion must weigh the factors against clear criteria rather than simply stating "both were equally important". Deploy precise medical terminology (e.g. <em>laparotomy, computed tomography, epidemiology, non-invasive, carcinogens</em>) to secure the full 4/4 SPaG.`
                : `Answers confined strictly to the two stimulus bullets are <strong>capped at Level 2 (max 8/16)</strong>. Level 4 requires weighing both sides, integrating independent own knowledge beyond the stimulus, and reaching a criteria-led judgement (note: Paper 2 Option B4 carries <strong>zero SPaG marks</strong>).`;

            stampHtml = `
              <div class="edexcel-peel-stamp" style="margin: 10px 0 16px 0; border: 2px solid #7c3aed; border-radius: 8px; background: #faf5ff; padding: 12px 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1.5px solid #e9d5ff; padding-bottom: 6px;">
                  <span style="font-weight: 800; font-size: 0.92rem; color: #6b21a8; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-scale-unbalanced-flip" style="margin-right: 6px;"></i> Edexcel 16-Mark Evaluative Essay Structure Strip (${verdictPaperLabel})</span>
                  <span style="background: #7c3aed; color: white; font-size: 0.78rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">[${marksLabel}]</span>
                </div>
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 0.88rem; line-height: 1.4; color: #0f172a;">
                  <span style="background: #7c3aed; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">E1</span>
                  <div><strong>Case For the Statement [PEEL]:</strong> Analyse the stated factor in the question using precise dates, figures, and mechanisms to show why it was significant.</div>
                  <span style="background: #7c3aed; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">E2</span>
                  <div><strong>Counter-Argument (Rival Factor) [PEEL]:</strong> Weigh a strong rival factor (using the second stimulus prompt if helpful) to construct a balanced argument.</div>
                  <span style="background: #7c3aed; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">E3</span>
                  <div><strong>Independent Own Knowledge [PEEL]:</strong> Introduce and evaluate a third distinct factor entirely from <strong>your own knowledge</strong> (mandatory to unlock Level 3/4 above 8/16!).</div>
                  <span style="background: #7c3aed; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">E4</span>
                  <div><strong>Criteria-Led Historical Verdict:</strong> Reach a sustained judgement answering <em>"How far do you agree?"</em> using explicit weighing criteria ${criteriaExample}.</div>
                  <div style="grid-column: 1 / -1; margin-top: 6px; padding: 6px 10px; background: #f3e8ff; border-left: 3px solid #7c3aed; border-radius: 4px; font-size: 0.8rem; color: #6b21a8; font-weight: 600;">
                    <i class="fa-solid fa-lightbulb"></i> <strong>Examiner Tip (Level 4 Discriminator):</strong> ${examinerTipHtml}
                  </div>
                  ${
                    q.examiner_tip
                      ? `
                    <div style="grid-column: 1 / -1; margin-top: 4px; padding: 6px 10px; background: #fff1f2; border-left: 3px solid #e11d48; border-radius: 4px; font-size: 0.8rem; color: #9f1239; font-weight: 600;">
                      <i class="fa-solid fa-triangle-exclamation"></i> <strong>Topic Trap Alert:</strong> ${q.examiner_tip}
                    </div>
                  `
                      : ''
                  }
                </div>
              </div>
            `;
          } else {
            // Paper 3 Q3(d) Interpretations Evaluative Essay (Weimar Germany & USA 1954–1975)
            const verdictPaperLabel = 'Paper 3 Q3d';
            stampHtml = `
              <div class="edexcel-peel-stamp" style="margin: 10px 0 16px 0; border: 2px solid #7c3aed; border-radius: 8px; background: #faf5ff; padding: 12px 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1.5px solid #e9d5ff; padding-bottom: 6px;">
                  <span style="font-weight: 800; font-size: 0.92rem; color: #6b21a8; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-scale-unbalanced-flip" style="margin-right: 6px;"></i> Edexcel 16-Mark Evaluative Verdict Structure Strip (${verdictPaperLabel})</span>
                  <span style="background: #7c3aed; color: white; font-size: 0.78rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">[16+4 SPaG &bull; 25 mins]</span>
                </div>
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 0.88rem; line-height: 1.4; color: #0f172a;">
                  <span style="background: #7c3aed; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">V1</span>
                  <div><strong>Interpretation 2 (Core Focus):</strong> Evaluate the named interpretation’s claim, citing specific details from the extract and deploying precise contextual knowledge to test its validity.</div>
                  <span style="background: #7c3aed; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">V2</span>
                  <div><strong>Interpretation 1 (Counter-Perspective):</strong> Evaluate the alternative interpretation, deploying supporting evidence from the text and precise contextual knowledge to provide balance.</div>
                  <span style="background: #7c3aed; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">V3</span>
                  <div><strong>How Views Are Conveyed (Level 4 Key):</strong> Analyse <em>how</em> the authors convey different views through tone, emphasis, or selection of historical evidence.</div>
                  <span style="background: #7c3aed; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">V4</span>
                  <div><strong>Substantiated Historical Verdict:</strong> Provide a sustained overall judgement based on reasoned criteria (e.g. short-term vs long-term, scale of impact). Deploy specialist terminology for the full 4 marks SPaG.</div>
                  <div style="grid-column: 1 / -1; margin-top: 6px; padding: 6px 10px; background: #f3e8ff; border-left: 3px solid #7c3aed; border-radius: 4px; font-size: 0.8rem; color: #6b21a8; font-weight: 600;">
                    <i class="fa-solid fa-lightbulb"></i> <strong>Examiner Tip (Level 4 Discriminator):</strong> Top marks require explicitly showing <em>how</em> the different views are conveyed (tone/language/selection). Use specialist vocabulary (e.g. <em>hyperinflation, putsch, Reichstag, segregation</em>) to secure 4/4 SPaG.
                  </div>
                  ${
                    q.examiner_tip
                      ? `
                    <div style="grid-column: 1 / -1; margin-top: 4px; padding: 6px 10px; background: #fff1f2; border-left: 3px solid #e11d48; border-radius: 4px; font-size: 0.8rem; color: #9f1239; font-weight: 600;">
                      <i class="fa-solid fa-triangle-exclamation"></i> <strong>Topic Trap Alert:</strong> ${q.examiner_tip}
                    </div>
                  `
                      : ''
                  }
                </div>
              </div>
            `;
          }
        } else if (isInterpDiff) {
          stampHtml = `
            <div class="edexcel-peel-stamp" style="margin: 10px 0 16px 0; border: 2px solid #8b5cf6; border-radius: 8px; background: #f5f3ff; padding: 12px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1.5px solid #ddd6fe; padding-bottom: 6px;">
                <span style="font-weight: 800; font-size: 0.92rem; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-code-compare" style="margin-right: 6px;"></i> Edexcel 4-Mark Interpretation Difference Structure Strip (Paper 3 Q3b)</span>
                <span style="background: #8b5cf6; color: white; font-size: 0.78rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">[4 marks &bull; 5 mins]</span>
              </div>
              <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 0.88rem; line-height: 1.4; color: #0f172a;">
                <span style="background: #8b5cf6; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">D</span>
                <div><strong>Identify Main Difference [1–2m]:</strong> <em>"The main difference between Interpretation 1 and Interpretation 2 is that Interpretation 1 suggests [Overall Focus/View X], whereas Interpretation 2 emphasizes [Overall Focus/View Y]..."</em></div>
                <span style="background: #8b5cf6; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">I1</span>
                <div><strong>Evidence from Interpretation 1 [1m]:</strong> <em>"Interpretation 1 supports this by stating that '[Quote or detail 1]'..."</em></div>
                <span style="background: #8b5cf6; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">I2</span>
                <div><strong>Evidence from Interpretation 2 [1m]:</strong> <em>"In contrast, Interpretation 2 states that '[Quote or detail 2]'..."</em></div>
                <div style="grid-column: 1 / -1; margin-top: 6px; padding: 6px 10px; background: #ede9fe; border-left: 3px solid #8b5cf6; border-radius: 4px; font-size: 0.8rem; color: #6d28d9; font-weight: 600;">
                  <i class="fa-solid fa-lightbulb"></i> <strong>Examiner Tip:</strong> Marked by Level of Response, not points. Identify the overall difference of view/attitude/focus, not just surface factual quotes.
                </div>
                ${
                  q.examiner_tip
                    ? `
                  <div style="grid-column: 1 / -1; margin-top: 4px; padding: 6px 10px; background: #fff1f2; border-left: 3px solid #e11d48; border-radius: 4px; font-size: 0.8rem; color: #9f1239; font-weight: 600;">
                    <i class="fa-solid fa-triangle-exclamation"></i> <strong>Topic Trap Alert:</strong> ${q.examiner_tip}
                  </div>
                `
                    : ''
                }
              </div>
            </div>
          `;
        } else if (isInterpWhy) {
          stampHtml = `
            <div class="edexcel-peel-stamp" style="margin: 10px 0 16px 0; border: 2px solid #8b5cf6; border-radius: 8px; background: #f5f3ff; padding: 12px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1.5px solid #ddd6fe; padding-bottom: 6px;">
                <span style="font-weight: 800; font-size: 0.92rem; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-scale-balanced" style="margin-right: 6px;"></i> Edexcel 4-Mark Why Interpretations Differ Structure Strip (Paper 3 Q3c)</span>
                <span style="background: #8b5cf6; color: white; font-size: 0.78rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">[4 marks &bull; 5 mins]</span>
              </div>
              <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 0.88rem; line-height: 1.4; color: #0f172a;">
                <span style="background: #8b5cf6; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">R</span>
                <div><strong>Identify Valid Reason [1–2m]:</strong> <em>"One reason why Interpretations 1 and 2 give different views is that the historians have used different sources / focused on different aspects [such as X vs Y]..."</em></div>
                <span style="background: #8b5cf6; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">E</span>
                <div><strong>Explain with Context &amp; Sources [3–4m]:</strong> <em>"Interpretation 1 draws upon [Source/Context] showing that..., whereas Interpretation 2 emphasizes [Source/Context] because..."</em></div>
                <div style="grid-column: 1 / -1; margin-top: 6px; padding: 6px 10px; background: #ede9fe; border-left: 3px solid #8b5cf6; border-radius: 4px; font-size: 0.8rem; color: #6d28d9; font-weight: 600;">
                  <i class="fa-solid fa-lightbulb"></i> <strong>Examiner Tip (Level 2 Key):</strong> Suggest ONE reason based on the historians' research process (e.g. author of Interp 1 gave weight to Source B, while author of Interp 2 gave weight to Source C). To score Level 2 (3–4 marks), you MUST show which specific details from the sources support each interpretation. Do NOT repeat 3(b) and do NOT evaluate the reliability or dates of the historians!
                </div>
                ${
                  q.examiner_tip
                    ? `
                  <div style="grid-column: 1 / -1; margin-top: 4px; padding: 6px 10px; background: #fff1f2; border-left: 3px solid #e11d48; border-radius: 4px; font-size: 0.8rem; color: #9f1239; font-weight: 600;">
                    <i class="fa-solid fa-triangle-exclamation"></i> <strong>Topic Trap Alert:</strong> ${q.examiner_tip}
                  </div>
                `
                    : ''
                }
              </div>
            </div>
          `;
        } else if (isInference) {
          stampHtml = `
            <div class="edexcel-peel-stamp" style="margin: 10px 0 16px 0; border: 2px solid #059669; border-radius: 8px; background: #ecfdf5; padding: 12px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1.5px solid #a7f3d0; padding-bottom: 6px;">
                <span style="font-weight: 800; font-size: 0.92rem; color: #065f46; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-magnifying-glass" style="margin-right: 6px;"></i> Edexcel 4-Mark Source Inference Structure Strip (Paper 3 Q1)</span>
                <span style="background: #059669; color: white; font-size: 0.78rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">[4 marks &bull; 5 mins]</span>
              </div>
              <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 0.88rem; line-height: 1.4; color: #0f172a;">
                <span style="background: #059669; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">I1</span>
                <div><strong>Inference 1 [2 Marks]:</strong> <em>"What I can infer from Source A is [clear active deduction]..."</em> [1m] + <em>"Details in the source that tell me this are '[Quote or specific detail]'..."</em> [1m]</div>
                <span style="background: #059669; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">I2</span>
                <div><strong>Inference 2 [2 Marks]:</strong> <em>"Another thing I can infer from Source A is [second distinct deduction]..."</em> [1m] + <em>"Details in the source that tell me this are '[Different quote or detail]'..."</em> [1m]</div>
                <div style="grid-column: 1 / -1; margin-top: 6px; padding: 6px 10px; background: #d1fae5; border-left: 3px solid #059669; border-radius: 4px; font-size: 0.8rem; color: #065f46; font-weight: 600;">
                  <i class="fa-solid fa-lightbulb"></i> <strong>Examiner Tip (Avoid the 'Dealt vs. Felt' Trap):</strong> Answers stating how opponents <em>felt</em> (e.g. scared, intimidated) score 0. Focus strictly on what authorities <em>did</em> to deal with opposition. Avoid literal lifts (e.g. 'came for'); use active analytical words ('targeted', 'eliminated', 'suppressed').
                </div>
                ${
                  q.examiner_tip
                    ? `
                  <div style="grid-column: 1 / -1; margin-top: 4px; padding: 6px 10px; background: #fff1f2; border-left: 3px solid #e11d48; border-radius: 4px; font-size: 0.8rem; color: #9f1239; font-weight: 600;">
                    <i class="fa-solid fa-triangle-exclamation"></i> <strong>Topic Trap Alert:</strong> ${q.examiner_tip}
                  </div>
                `
                    : ''
                }
              </div>
            </div>
          `;
        } else if (isFollowUp) {
          stampHtml = `
            <div class="edexcel-peel-stamp" style="margin: 10px 0 16px 0; border: 2px solid #0d9488; border-radius: 8px; background: #f0fdfa; padding: 12px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1.5px solid #99f6e4; padding-bottom: 6px;">
                <span style="font-weight: 800; font-size: 0.92rem; color: #115e59; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-compass" style="margin-right: 6px;"></i> Edexcel 4-Step Follow-Up Enquiry Structure Strip (Paper 1 Q2b)</span>
                <span style="background: #0d9488; color: white; font-size: 0.78rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">[4 marks &bull; 5 mins]</span>
              </div>
              <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 0.88rem; line-height: 1.4; color: #0f172a;">
                <span style="background: #0d9488; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">1</span>
                <div><strong>Detail to Follow Up [1m]:</strong> Quote or select one specific historical detail from the source directly linked to the enquiry.</div>
                <span style="background: #0d9488; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">2</span>
                <div><strong>Question to Ask [1m]:</strong> Pose a focused, precise historical question directly arising from that detail.</div>
                <span style="background: #0d9488; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">3</span>
                <div><strong>Type of Source [1m]:</strong> Name a realistic, authentic contemporary primary record (e.g. medical register, war diary, dispatch log).</div>
                <span style="background: #0d9488; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">4</span>
                <div><strong>How Source Helps [1m]:</strong> Explain specifically how this record answers the question and deepens understanding.</div>
              </div>
            </div>
          `;
        } else if (isFeatures) {
          stampHtml = `
            <div class="edexcel-peel-stamp" style="margin: 10px 0 16px 0; border: 2px solid #0284c7; border-radius: 8px; background: #f0f9ff; padding: 12px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1.5px solid #bae6fd; padding-bottom: 6px;">
                <span style="font-weight: 800; font-size: 0.92rem; color: #0369a1; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-list-check" style="margin-right: 6px;"></i> Edexcel 4-Mark 'Describe Two Features' Structure Strip</span>
                <span style="background: #0284c7; color: white; font-size: 0.78rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">[4 marks &bull; 5 mins]</span>
              </div>
              <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 0.88rem; line-height: 1.4; color: #0f172a;">
                <span style="background: #0284c7; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">F1</span>
                <div><strong>Feature 1 [2 Marks]:</strong> <em>"One key feature was [name feature]..."</em> [1m] + <em>"Specifically, [supporting historical factual detail]..."</em> [1m]</div>
                <span style="background: #0284c7; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">F2</span>
                <div><strong>Feature 2 [2 Marks]:</strong> <em>"A second key feature was [name feature]..."</em> [1m] + <em>"Specifically, [supporting historical factual detail]..."</em> [1m]</div>
              </div>
            </div>
          `;
        } else if (isUtility) {
          stampHtml = `
            <div class="edexcel-peel-stamp" style="margin: 10px 0 16px 0; border: 2px solid #2563eb; border-radius: 8px; background: #eff6ff; padding: 12px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1.5px solid #bfdbfe; padding-bottom: 6px;">
                <span style="font-weight: 800; font-size: 0.92rem; color: #1e40af; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-magnifying-glass-chart" style="margin-right: 6px;"></i> Edexcel 8-Mark Source Utility Structure Strip (Paper 1 Q2a &amp; Paper 3 Q3a)</span>
                <span style="background: #2563eb; color: white; font-size: 0.78rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">[8 marks &bull; 10–12 mins &bull; ~180–195 words]</span>
              </div>
              <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; font-size: 0.88rem; line-height: 1.4; color: #0f172a;">
                <span style="background: #2563eb; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">U1</span>
                <div><strong>Paragraph 1: Source B Dual-Anchor Evaluation (~90 words):</strong><br>
                  &bull; <strong>Quote 1 (Content):</strong> <em>"Source B is useful for investigating [enquiry] because it highlights/shows that '[Quote 1]'..."</em><br>
                  &bull; <strong>Contextual Knowledge Validation:</strong> Deploy precise factual evidence to validate or substantiate the claim.<br>
                  &bull; <strong>Quote 2 + 1-Aspect NOP:</strong> Bridge using <em>"'[Quote 2]' demonstrates the author's purpose/perspective, as it was produced by..."</em> (Evaluate ONE aspect of author or purpose and show <em>how</em> it affects usefulness).
                </div>
                <span style="background: #2563eb; color: white; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-family: monospace; text-align: center; height: fit-content;">U2</span>
                <div><strong>Paragraph 2: Source C Dual-Anchor Evaluation (~90 words):</strong><br>
                  &bull; <strong>Quote 1 (Content):</strong> <em>"Source C is equally useful because it reveals that '[Quote 1]'..."</em><br>
                  &bull; <strong>Contextual Knowledge Validation:</strong> Substantiate with precise historical facts.<br>
                  &bull; <strong>Quote 2 + 1-Aspect NOP:</strong> Bridge using <em>"'[Quote 2]' reflects the author's perspective/aim, as it was..."</em> (Evaluate ONE aspect of author or purpose).
                </div>
                <div style="grid-column: 1 / -1; margin-top: 6px; padding: 8px 12px; background: #dbeafe; border-left: 3px solid #2563eb; border-radius: 4px; font-size: 0.82rem; color: #1e40af; font-weight: 600; line-height: 1.45;">
                  <i class="fa-solid fa-stopwatch"></i> <strong>The '2-Quote Dual Anchor' Rule (10–12 Mins Budget):</strong> Write exactly TWO short paragraphs (Source B, then Source C). Each paragraph weaves 2 direct quotes: Quote 1 anchors what the source literally says; Quote 2 bridges into your historical validation and ONE aspect of provenance (author or purpose). <strong>Zero marks for introductions, comparisons between sources, or conclusions!</strong>
                </div>
                ${
                  q.examiner_tip
                    ? `
                  <div style="grid-column: 1 / -1; margin-top: 4px; padding: 6px 10px; background: #fff1f2; border-left: 3px solid #e11d48; border-radius: 4px; font-size: 0.8rem; color: #9f1239; font-weight: 600;">
                    <i class="fa-solid fa-triangle-exclamation"></i> <strong>Topic Trap Alert:</strong> ${q.examiner_tip}
                  </div>
                `
                    : ''
                }
              </div>
            </div>
          `;
        }

        const promptHtml =
          q.prompt && !isSpoilerPrompt
            ? `
          <div style="font-size: 0.95rem; color: #334155; margin-bottom: 12px; line-height: 1.5; background: #f8fafc; padding: 10px 14px; border-left: 3px solid #64748b; border-radius: 4px;">
            <strong><i class="fa-solid fa-circle-info" style="color: #3b82f6; margin-right: 6px;"></i> Guidance:</strong> ${q.prompt}
          </div>
        `
            : '';

        const modelAns =
          q.model ||
          q.model_answer ||
          q.model_tiers?.tier_16m?.text ||
          q.model_tiers?.tier_12m?.text ||
          q.model_tiers?.tier_8m?.text ||
          q.model_tiers?.tier_4m?.text ||
          '';
        let modelBoxHtml = '';

        if (q.model_tiers) {
          const tiers = q.model_tiers;
          const tierKeys = Object.keys(tiers);
          const defaultKey = tiers.tier_16m
            ? 'tier_16m'
            : tiers.tier_12m
            ? 'tier_12m'
            : tiers.tier_8m
            ? 'tier_8m'
            : tiers.tier_4m
            ? 'tier_4m'
            : tiers.tier_2m
            ? 'tier_2m'
            : tierKeys[tierKeys.length - 1];

          const tabButtonsHtml = tierKeys
            .map((key, idx) => {
              const t = tiers[key];
              const isActive = key === defaultKey;
              const isTop = (key === defaultKey);
              const isMiddle = (!isTop && idx > 0 && idx < tierKeys.length - 1);
              const btnBg = isActive ? '#0f172a' : '#ffffff';
              const btnColor = isActive ? '#ffffff' : '#334155';
              const btnBorder = isActive ? '#0f172a' : '#cbd5e1';
              const btnWeight = isActive ? '700' : '600';
              const badgeIcon = isTop
                ? 'fa-star'
                : isMiddle
                ? 'fa-list-check'
                : 'fa-pen-to-square';
              return `
              <button type="button" class="btn model-tier-tab-btn ${isActive ? 'active' : ''}" data-action="switch-model-tier" data-target-tier="tier-${key}-${qUid}" style="padding: 6px 12px; font-size: 0.8rem; font-weight: ${btnWeight}; border-radius: 6px; border: 1.5px solid ${btnBorder}; background: ${btnBg}; color: ${btnColor}; cursor: pointer; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-solid ${badgeIcon}"></i> ${t.title || key}
              </button>
            `;
            })
            .join('');

          const panesHtml = tierKeys
            .map((key, idx) => {
              const t = tiers[key];
              const isActive = key === defaultKey;
              const isTop = key === defaultKey;
              const isMiddle = !isTop && idx > 0;
              const hasDualOptions = Array.isArray(t.options) && t.options.length > 0;
              const wordCount = (t.text || '').trim().split(/\s+/).filter(Boolean).length;

              let themeBorder = '#fed7aa';
              let themeBadgeBg = '#ffedd5';
              let themeBadgeColor = '#c2410c';
              let verdictBorder = '#f97316';
              let verdictBg = '#fffaf5';
              let verdictColor = '#9a3412';

              if (isTop) {
                themeBorder = '#bbf7d0';
                themeBadgeBg = '#dcfce7';
                themeBadgeColor = '#15803d';
                verdictBorder = '#10b981';
                verdictBg = '#f0fdf4';
                verdictColor = '#065f46';
              } else if (isMiddle) {
                themeBorder = '#bae6fd';
                themeBadgeBg = '#e0f2fe';
                themeBadgeColor = '#0369a1';
                verdictBorder = '#0284c7';
                verdictBg = '#f0f9ff';
                verdictColor = '#075985';
              }

              const dualOptionsBodyHtml = hasDualOptions
                ? `
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; margin-bottom: 12px;">
                    ${t.options
                      .map((opt, oIdx) => {
                        const optWords = String(opt.text || '')
                          .trim()
                          .split(/\s+/)
                          .filter(Boolean).length;
                        return `
                          <div style="background: #f8fafc; border: 1.5px solid #bbf7d0; border-top: 3.5px solid #10b981; border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                              <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #dcfce7;">
                                <span style="font-size: 0.76rem; font-weight: 800; color: #065f46; text-transform: uppercase; letter-spacing: 0.3px;">
                                  ${opt.label || `Option ${String.fromCharCode(65 + oIdx)} (4/4)`}
                                </span>
                                <span style="font-size: 0.72rem; font-weight: 700; color: #047857; background: #ecfdf5; padding: 1.5px 7px; border-radius: 9999px; border: 1px solid #a7f3d0; white-space: nowrap;">
                                  ${optWords} words
                                </span>
                              </div>
                              <div style="font-size: 0.94rem; line-height: 1.58; color: #0f172a;">
                                ${typeof formatBold !== 'undefined' ? formatBold(opt.text) : opt.text}
                              </div>
                            </div>
                          </div>
                        `;
                      })
                      .join('')}
                  </div>
                `
                : `
                  <div style="font-size: 0.98rem; line-height: 1.6; color: #0f172a; margin-bottom: 12px;">
                    ${typeof formatBold !== 'undefined' ? formatBold(t.text) : t.text}
                  </div>
                `;

              const wordCountPillText = hasDualOptions
                ? `${t.options.length} Full-Mark Angles (~${Math.round(
                    t.options.reduce(
                      (acc, o) =>
                        acc +
                        String(o.text || '')
                          .trim()
                          .split(/\s+/)
                          .filter(Boolean).length,
                      0,
                    ) / t.options.length,
                  )}w each)`
                : `${wordCount} words`;

              return `
              <div id="tier-${key}-${qUid}" class="model-tier-pane" style="display: ${isActive ? 'block' : 'none'};">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid ${themeBorder};">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: ${themeBadgeBg}; color: ${themeBadgeColor}; font-weight: 800; font-size: 0.78rem; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.5px; text-transform: uppercase;">
                      ${t.score || t.level}
                    </span>
                    <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">
                      ${t.level || ''}
                    </span>
                  </div>
                  <span style="font-size: 0.78rem; font-weight: 700; color: #64748b; background: #ffffff; padding: 2px 8px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    ${wordCountPillText}
                  </span>
                </div>
                ${dualOptionsBodyHtml}
                ${
                  t.verdict
                    ? `
                  <div style="background: ${verdictBg}; border-left: 3.5px solid ${verdictBorder}; padding: 10px 14px; border-radius: 0 6px 6px 0; font-size: 0.86rem; line-height: 1.5; color: ${verdictColor};">
                    <strong style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.4px;">
                      <i class="fa-solid fa-clipboard-check"></i> Examiner-Style Assessment Verdict:
                    </strong>
                    <div>${typeof formatBold !== 'undefined' ? formatBold(t.verdict) : t.verdict}</div>
                  </div>
                `
                    : ''
                }
              </div>
            `;
            })
            .join('');

          modelBoxHtml = `
            <div id="ep-model-${qUid}" class="scaffold-box model-box model-tier-container" style="display:none; margin-top: 15px; background: #ffffff; border: 1.5px solid #10b981; border-radius: 10px; padding: 16px; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.08);">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
                <span style="font-weight: 800; font-size: 0.82rem; color: #065f46; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-scale-balanced" style="color: #10b981;"></i> ${tierKeys.length}-Tier Exam-Style Mark Scheme Ladder
                </span>
                <span style="font-size: 0.74rem; font-weight: 600; color: #64748b;">
                  Toggle rungs to analyze mark boundaries
                </span>
              </div>
              <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 5px; border-radius: 8px;">
                ${tabButtonsHtml}
              </div>
              ${panesHtml}
            </div>
          `;
        } else if (modelAns) {
          const flatWordCount = String(modelAns)
            .replace(/<[^>]+>/g, ' ')
            .trim()
            .split(/\s+/)
            .filter(Boolean).length;
          modelBoxHtml = `
            <div id="ep-model-${qUid}" class="scaffold-box model-box" style="display:none; margin-top: 15px; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #bbf7d0;">
                <span style="background: #16a34a; color: #ffffff; font-size: 0.74rem; font-weight: 800; padding: 3px 9px; border-radius: 5px; letter-spacing: 0.04em; text-transform: uppercase;">
                  <i class="fa-solid fa-star"></i> Examiner Model Answer (Grade 8/9)
                </span>
                <span style="font-size: 0.76rem; font-weight: 700; color: #065f46; background: #ffffff; padding: 2px 8px; border-radius: 12px; border: 1px solid #a7f3d0;">
                  ${flatWordCount} words
                </span>
              </div>
              <div style="font-size: 0.96rem; line-height: 1.65; color: #14532d;">
                ${(typeof formatBold !== 'undefined' ? formatBold(String(modelAns)) : String(modelAns)).replace(/\n/g, '<br>')}
              </div>
            </div>
          `;
        }

        const wbMeta = q._isExtraMock
          ? {
              inWorkbook: false,
              label: `Extra Exam Practice • ${q.mockTitle || 'Unseen Mock Bank'}`,
            }
          : wbMetaOverride || getWorkbookTaskMeta(unitId, lesson?.id, q, q.question, qIdx, lesson);

        const inWorkbook = !wbMeta || wbMeta.inWorkbook !== false;

        const isPaper3InterpVerdict =
          /how far do you agree with interpretation/i.test(q.question || '') ||
          (['weimar_nazi_germany', 'usa'].includes(unitId) && isVerdict16);

        const bulletItems =
          Array.isArray(q.bullet_points) && q.bullet_points.length > 0
            ? q.bullet_points
            : isGcseCleanExam &&
                !isPaper3InterpVerdict &&
                Array.isArray(q.stimulus) &&
                q.stimulus.length > 0 &&
                q.stimulus.every(
                  (s) =>
                    typeof s === 'string' &&
                    s.length < 120 &&
                    !/^(?:\*\*)?(?:Source|Interpretation)\b/i.test(s.trim()),
                )
              ? q.stimulus
              : !isPaper3InterpVerdict
                ? extractEmbeddedStimulusBullets(q.question)
                : null;

        let bulletHtml = '';
        if (bulletItems) {
          bulletHtml = `
            <div class="edexcel-stimulus-bullet-box" style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-left: 4px solid #1e3a8a; border-radius: 6px; padding: 10px 14px; margin: 6px 0 12px 0;">
              <div style="font-size: 0.8rem; font-weight: 700; color: #1e3a8a; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.45px;">
                <i class="fa-solid fa-list-check" style="margin-right: 5px;"></i> You may use the following in your answer:
              </div>
              <ul style="margin: 0; padding-left: 22px; font-size: 0.92rem; color: #0f172a; font-weight: 600; line-height: 1.5;">
                ${bulletItems.map((b) => `<li>${b}</li>`).join('')}
              </ul>
              <div style="font-size: 0.8rem; color: #475569; font-weight: 600; margin-top: 5px; font-style: italic;">
                You must also use information of your own.
              </div>
            </div>
          `;
        }

        const effectiveStampHtml = isGcseCleanExam ? '' : stampHtml;
        const effectivePromptHtml = isGcseCleanExam ? '' : promptHtml;

        const { marks, projectorMarksLabel, qCode, pillLabel } = inferQuestionMarksAndCode(q, qIdx);
        const targetMins =
          parseInt(q.targetMins, 10) ||
          getRecommendedExamMins(marks, `${q.type || ''} ${q.tariff || ''} ${q.question || ''}`);
        const paperCode = q.paperCode || getCanonicalGcsePaperCode(unitId);

        if (isGCSE) {
          registerUnifiedExamQuestion(qUid, {
            id: qUid,
            qCode,
            type: q.type || q.tariff || 'Edexcel Exam Question',
            marks,
            marksDisplay: projectorMarksLabel,
            targetMins,
            paperCode,
            inWorkbook,
            mockTitle: inWorkbook ? wbMeta?.label || 'In Printed Workbook' : q.mockTitle || wbMeta?.label || 'Extra Exam Practice',
            questionText: String(q.question || '').replace(/\n/g, '<br>'),
            stimulus: bulletItems || [],
            sourceExtract: embeddedStim.projectorHtml || '',
          });
        }

        const mockNumMatch =
          q._isExtraMock && q.mockTitle
            ? String(q.mockTitle).match(/\bMock(?:\s+Paper)?\s+(\d+)\b/i)
            : null;
        const originShort = inWorkbook
          ? shortenWorkbookOriginLabel(wbMeta?.label, true)
          : q._isExtraMock
            ? mockNumMatch
              ? `Extra • Mock ${mockNumMatch[1]}`
              : 'Extra Mock'
            : 'Extension';
        const stemPreview = cleanStemForStripSummary(q.question);
        const hasAnyModel = Boolean(modelAns || q.model_tiers);

        const timerBarHtml = isGCSE
          ? `
            <div id="exam-timer-bar-${qUid}" style="display: none; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; background: #0f172a; color: #ffffff; padding: 10px 16px; border-radius: 8px; margin-top: 12px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-stopwatch" style="color: #38bdf8; font-size: 1.05rem;"></i>
                <span style="font-size: 0.84rem; font-weight: 600; color: #cbd5e1;">Timed Exam Mode:</span>
                <span id="exam-timer-display-${qUid}" style="font-family: 'Courier New', monospace; font-size: 1.2rem; font-weight: 800; color: #38bdf8; letter-spacing: 0.05em;">
                  ${String(targetMins).padStart(2, '0')}:00
                </span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <button type="button" id="exam-timer-toggle-btn-${qUid}" onclick="window.toggleExamCardTimer('${qUid}', ${targetMins})" style="background: #2563eb; color: #ffffff; border: none; padding: 5px 12px; border-radius: 6px; font-weight: 700; font-size: 0.78rem; cursor: pointer;">
                  Pause
                </button>
                <button type="button" onclick="window.resetExamCardTimer('${qUid}', ${targetMins})" style="background: #334155; color: #e2e8f0; border: none; padding: 5px 10px; border-radius: 6px; font-weight: 600; font-size: 0.78rem; cursor: pointer;">
                  Reset
                </button>
              </div>
            </div>
          `
          : '';

        const mockPdfLinkHtml =
          q._isExtraMock && q.pdfUrl && String(q.pdfUrl).includes('/mocks/')
            ? `
              <a href="${getAssetUrl(q.pdfUrl)}" target="_blank" rel="noopener noreferrer" style="background: #ffffff; color: #334155; border: 1.5px solid #cbd5e1; padding: 6px 12px; border-radius: 7px; font-weight: 600; font-size: 0.81rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; margin-left: auto;">
                <i class="fa-regular fa-file-pdf" style="color: #dc2626;"></i> Mock Booklet PDF
              </a>
            `
            : '';

        const actionBarHtml = `
          <div class="wb-unified-control-bar no-print" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
            ${
              scaffoldBtnsHtml
                ? `<div style="display: flex; align-items: center; flex-wrap: wrap; gap: 7px;">${scaffoldBtnsHtml}</div>`
                : ''
            }
            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 7px; margin-left: ${scaffoldBtnsHtml ? 'auto' : '0'};">
              ${
                hasAnyModel
                  ? `
                <button type="button" id="exam-model-btn-${qUid}" onclick="window.toggleExamCardModelAnswer('${qUid}')" style="background: #f0fdf4; color: #166534; border: 1.5px solid #86efac; padding: 5px 11px; border-radius: 7px; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
                  <i class="fa-regular fa-eye" style="color: #16a34a;"></i> Model Answer &amp; Mark Scheme
                </button>
              `
                  : ''
              }
              ${
                isGCSE
                  ? `
                <button type="button" onclick="window.toggleExamCardTimer('${qUid}', ${targetMins})" style="background: #eff6ff; color: #1d4ed8; border: 1.5px solid #bfdbfe; padding: 5px 10px; border-radius: 7px; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
                  <i class="fa-regular fa-clock" style="color: #2563eb;"></i> Timer (${targetMins}m)
                </button>
                <button type="button" onclick="window.openExamCardProjector('${qUid}')" style="background: #f8fafc; color: #0f172a; border: 1.5px solid #cbd5e1; padding: 5px 10px; border-radius: 7px; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
                  <i class="fa-solid fa-expand" style="color: #475569;"></i> Projector
                </button>
              `
                  : ''
              }
              ${mockPdfLinkHtml}
            </div>
          </div>
        `;

        return `
          <details class="wb-question-strip wb-thin-strip ${inWorkbook ? 'wb-strip-green' : 'wb-strip-blue'}">
            <summary>
              <div class="wb-strip-left">
                <span class="wb-origin-pill ${inWorkbook ? 'wb-origin-green' : 'wb-origin-blue'}" title="${escStimAttr(wbMeta?.label || '')}">
                  <i class="fa-solid ${inWorkbook ? 'fa-book-open' : 'fa-layer-group'}"></i> ${originShort}
                </span>
                <span class="wb-tariff-pill">${pillLabel}</span>
                <span class="wb-stem-preview wb-strip-stem">${stemPreview}</span>
              </div>
              <div class="wb-strip-right">
                <span class="wb-mins-pill"><i class="fa-regular fa-clock"></i> ${targetMins}m</span>
                <span class="wb-strip-toggle-txt">
                  <span class="wb-lbl-closed">Open</span><span class="wb-lbl-open">Close</span>
                  <i class="fa-solid fa-chevron-down wb-strip-caret"></i>
                </span>
              </div>
            </summary>
            <div class="wb-strip-body">
              ${embeddedStim.html}
              <div class="wb-writing-workspace">
                ${bulletHtml}
                ${effectiveStampHtml}
                ${effectivePromptHtml}
                ${actionBarHtml}
                ${scaffoldDrawersHtml}
                ${timerBarHtml}
                ${modelBoxHtml}
              </div>
            </div>
          </details>
        `;
      };

      const greenQuestionEntries = [];
      const blueQuestionEntries = [];
      const seenEpStems = new Set();

      epQuestions.forEach((q, qIdx) => {
        const rawStem = String(q?.question || q?.prompt || '').trim();
        const isStimulusBased = /\b(?:Sources?\s+[A-E]|Interpretations?\s*[12]|infer|how\s+useful|follow\s+up)\b/i.test(rawStem);
        const normEpStem = rawStem
          .replace(/^(?:q(?:uestion)?\s*)?\d+\s*(?:\([a-d]\))?[\.:\s-]*/i, '')
          .replace(/\[\s*\d+[^\]]*\]|\(\s*\d+\s*marks?\s*\)/gi, '')
          .replace(/[^a-z0-9]+/gi, ' ')
          .trim()
          .toLowerCase();
        if (!isStimulusBased && normEpStem.length >= 12) {
          if (seenEpStems.has(normEpStem)) return;
          seenEpStems.add(normEpStem);
        }

        const meta = getWorkbookTaskMeta(
          unitId,
          lesson?.id,
          q,
          q.question || q.prompt || '',
          qIdx,
          lesson,
        );
        if (meta && meta.inWorkbook === false) {
          blueQuestionEntries.push({ q, qIdx, meta });
        } else {
          greenQuestionEntries.push({ q, qIdx, meta });
        }
      });

      normalizedExtraMocks.forEach((mq, mIdx) => {
        blueQuestionEntries.push({
          q: mq,
          qIdx: epQuestions.length + mIdx,
          meta: {
            inWorkbook: false,
            label: `Extra Exam Practice • ${mq.mockTitle || 'Unseen Mock Bank'}`,
          },
        });
      });

      const countPillsHtml = [
        greenQuestionEntries.length > 0
          ? `<span class="wb-origin-pill wb-origin-green"><i class="fa-solid fa-book-open"></i> ${greenQuestionEntries.length} in Workbook</span>`
          : '',
        blueQuestionEntries.length > 0
          ? `<span class="wb-origin-pill wb-origin-blue"><i class="fa-solid fa-layer-group"></i> ${blueQuestionEntries.length} Extra Practice</span>`
          : '',
      ]
        .filter(Boolean)
        .join('');

      htmlExamPractice = htmlExamPractice.replace(
        '__WB_COUNT_PILLS_PLACEHOLDER__',
        countPillsHtml,
      );

      greenQuestionEntries.forEach(({ q, qIdx, meta }) => {
        htmlExamPractice += renderQuestion(q, qIdx, meta);
      });
      blueQuestionEntries.forEach(({ q, qIdx, meta }) => {
        htmlExamPractice += renderQuestion(q, qIdx, meta);
      });

      htmlExamPractice += `</div></div>`;
    }
  }

  // Note: Legacy static "Consolidation & Recall" vocabulary grid removed.
  // End-of-lesson vocabulary consolidation is now handled cleanly by the unified
  // Consolidate Station terminal (renderConsolidateStationHTML -> Vocab Cards tab).

  if (lesson.extended || lesson.debate_prep) {
    let extHtml = `
        <div class="phase-card">
          <div style="display: flex; justify-content: flex-start; align-items: center; margin-bottom: 20px;">
            <div class="phase-title" style="border-bottom: none; margin-bottom: 0; padding-bottom: 0;">Extended Scholarship</div>
          </div>
      `;

    if (lesson.debate_prep) {
      const dp = lesson.debate_prep;
      const allArgs = [
        ...dp.arguments_for.map((a) => ({ t: a, s: 'for' })),
        ...dp.arguments_against.map((a) => ({ t: a, s: 'against' })),
      ].sort(() => Math.random() - 0.5);
      const argsHtml = allArgs
        .map(
          (arg, idx) =>
            `<div class="debate-card" draggable="true" ondragstart="window.dragDebate(event)" id="debate-arg-${lesson.id}-${idx}" data-side="${arg.s}" style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; margin-bottom: 8px; border-radius: 6px; cursor: grab;">${arg.t}</div>`,
        )
        .join('');

      extHtml += `
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <h3 style="margin-top: 0; color: #1e3a8a;"><i class="fa-solid fa-scale-balanced"></i> Debate Prep: ${dp.question}</h3>
            <p style="color: #475569; font-size: 0.95rem;">Drag and drop the evidence cards below into the correct columns to prepare your arguments before writing your essay.</p>
            
            <div id="debate-bank-${lesson.id}" class="debate-dropzone" ondragover="window.allowDrop(event)" ondrop="window.dropDebate(event)" style="background: white; border: 2px dashed #94a3b8; padding: 15px; border-radius: 8px; margin-bottom: 20px; min-height: 80px;">
              ${argsHtml}
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <h4 style="text-align: center; color: #16a34a; margin-top: 0;">Agree</h4>
                <div id="debate-for-${lesson.id}" class="debate-dropzone" data-target="for" ondragover="window.allowDrop(event)" ondrop="window.dropDebate(event)" style="background: white; border: 2px dashed #86efac; padding: 15px; border-radius: 8px; min-height: 150px;"></div>
              </div>
              <div>
                <h4 style="text-align: center; color: #dc2626; margin-top: 0;">Disagree</h4>
                <div id="debate-against-${lesson.id}" class="debate-dropzone" data-target="against" ondragover="window.allowDrop(event)" ondrop="window.dropDebate(event)" style="background: white; border: 2px dashed #fca5a5; padding: 15px; border-radius: 8px; min-height: 150px;"></div>
              </div>
            </div>
            <div style="text-align: center; margin-top: 15px;">
              <button class="btn-pedagogy-primary" data-action="check-debate" data-id="${lesson.id}">Check Answers</button>
              <div id="debate-feedback-${lesson.id}" style="margin-top: 10px; font-weight: bold;"></div>
            </div>
          </div>
        `;
    }

    if (lesson.extended && lesson.extended.paragraphs) {
      if (lesson.extended.title) {
        extHtml += `<h3 style="color: #0f172a;">${lesson.extended.title}</h3>`;
      }
      lesson.extended.paragraphs.forEach((p) => {
        extHtml += `<p style="color: #334155; font-size: 1.05rem; line-height: 1.6;">${formatBold(p)}</p>`;
      });
    }
    extHtml += `</div>`;

    if (lesson.debate_prep || (lesson.extended && lesson.extended.paragraphs)) {
      htmlExtended += extHtml;
    }
  }

  let htmlCwgc = '';
  if (isTrip && lesson.cwgc_data) {
    const cd = lesson.cwgc_data;
    htmlCwgc = `
      <div class="cwgc-plaque-container" style="margin-bottom: 25px; background: #fff; border: 2px solid #b45309; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(180, 83, 9, 0.12);">
        <div style="background: linear-gradient(135deg, #78350f, #92400e); color: white; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fa-solid fa-monument" style="font-size: 1.4rem; color: #fde68a;"></i>
            <div>
              <div style="font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: #fde68a; font-weight: 700;">Commonwealth War Graves Commission</div>
              <div style="font-size: 1.15rem; font-weight: 700; font-family: 'Playfair Display', serif;">Official Record of the Fallen · Ypres Salient</div>
            </div>
          </div>
          <div style="background: rgba(254, 243, 199, 0.15); border: 1px solid rgba(253, 230, 138, 0.4); color: #fde68a; font-weight: 600; font-size: 0.82rem; padding: 6px 14px; border-radius: 20px; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-cross"></i> <span>CWGC Memorial Record</span>
          </div>
        </div>
        <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; background: #fff;">
          <div style="border-left: 3px solid #b45309; padding-left: 12px;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #78350f; font-weight: 700;">Rank &amp; Service Number</div>
            <div style="font-size: 1rem; color: #1e293b; font-weight: 600; margin-top: 2px;">${cd.rank || 'Private'} · #${cd.service_number}</div>
          </div>
          <div style="border-left: 3px solid #b45309; padding-left: 12px;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #78350f; font-weight: 700;">Regiment &amp; Battalion</div>
            <div style="font-size: 1rem; color: #1e293b; font-weight: 600; margin-top: 2px;">${cd.regiment}</div>
          </div>
          <div style="border-left: 3px solid #b45309; padding-left: 12px;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #78350f; font-weight: 700;">Date of Death &amp; Age</div>
            <div style="font-size: 1rem; color: #1e293b; font-weight: 600; margin-top: 2px;">${cd.date_of_death} (Age ${cd.age})</div>
          </div>
          <div style="border-left: 3px solid #dc2626; padding-left: 12px; background: #fef2f2; border-radius: 0 6px 6px 0; padding-top: 6px; padding-bottom: 6px;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #991b1b; font-weight: 700;">Official Memorial Location</div>
            <div style="font-size: 1.02rem; color: #7f1d1d; font-weight: 700; margin-top: 2px;">${cd.memorial} · <span style="background: #dc2626; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.85rem;">${cd.panel}</span></div>
          </div>
          ${cd.hometown
        ? `
          <div style="border-left: 3px solid #64748b; padding-left: 12px; grid-column: 1 / -1;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #475569; font-weight: 700;">Home Connection</div>
            <div style="font-size: 0.95rem; color: #334155; margin-top: 2px;">${cd.hometown} ${cd.parents ? `(Son of ${cd.parents})` : ''}</div>
          </div>`
        : ''
      }
          ${cd.tablet_inscription
        ? `
          <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 12px; grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div>
              <span style="font-size: 0.82rem; font-weight: 700; color: #1e3a8a;"><i class="fa-solid fa-church" style="margin-right: 6px;"></i>Holy Rood Church Crofton Parish Memorial Tablet:</span>
              <span style="font-family: 'Courier New', monospace; font-weight: 700; background: #e2e8f0; padding: 2px 8px; border-radius: 4px; margin-left: 8px; font-size: 1rem; color: #0f172a;">${cd.tablet_inscription}</span>
            </div>
            <span style="font-size: 0.8rem; color: #64748b;"><i class="fa-solid fa-location-dot" style="margin-right: 4px;"></i>Stubbington Village Center</span>
          </div>`
        : ''
      }
        </div>
      </div>
    `;
  }

  let htmlPoetry = '';
  if (isTrip && lesson.poetry_dossiers && lesson.poetry_dossiers.length > 0) {
    htmlPoetry = renderPoetryDossiersHTML(lesson.poetry_dossiers);
  }

  if (!htmlSpotlightDrawers) {
    htmlSpotlightDrawers = renderTextbookSpotlightDrawers(lesson);
  }

  const htmlObjectivesInner = renderLearningObjectivesPanelHTML(objectivesData, lesson);

  const hasDoNow = Boolean(
    (lesson &&
      lesson.do_now &&
      ((lesson.do_now.items && lesson.do_now.items.length > 0) ||
        (lesson.do_now.questions && lesson.do_now.questions.length > 0) ||
        (lesson.do_now.tasks && lesson.do_now.tasks.length > 0) ||
        (lesson.do_now.events && lesson.do_now.events.length > 0))) ||
    (htmlDoNowInner && htmlDoNowInner.trim().length > 0),
  );

  // Closed by default so lessons load with launchpad collapsed
  const defaultTab = '';

  const htmlLaunchpad = renderLessonLaunchpad({
    lesson,
    unitId,
    lessonIndex: currentIndex,
    videos,
    htmlVideo,
    htmlDoNowInner,
    htmlVocabInner,
    htmlSpineInner,
    htmlObjectivesInner,
    defaultTab,
  });

  if (isTrip) {
    html +=
      htmlCwgc +
      htmlNarrative +
      htmlSpotlightDrawers +
      htmlLaunchpad +
      htmlPoetry +
      htmlPrimary +
      htmlSources1 +
      htmlPairShare +
      htmlExamPractice +
      htmlExtended +
      htmlHistorian;
  } else if (
    unitId === 'great_war' ||
    unitId === 'great_war_part2' ||
    unitId === 'water_and_sanitation' ||
    unitId === 'medieval_england' ||
    unitId === 'industrialisation_and_empire' ||
    Boolean(typeof unit !== 'undefined' && unit && unit.is_ks3)
  ) {
    // Universal KS3 Unified Engine Layout
    html +=
      htmlLaunchpad +
      htmlNarrative +
      htmlSpotlightDrawers +
      (lesson.narrative_blocks && lesson.narrative_blocks.length > 0 ? '' : htmlPrimary) +
      (typeof isGCSE !== 'undefined' && isGCSE ? '' : htmlSources1) +
      htmlExamPractice +
      htmlTasks +
      htmlExtended +
      htmlPairShare +
      htmlHistorian;
  } else {
    // Universal GCSE Unified Layout
    let htmlDominoSpine = '';

    html +=
      htmlLaunchpad +
      htmlNarrative +
      htmlSpotlightDrawers +
      (lesson.narrative_blocks && lesson.narrative_blocks.length > 0 ? '' : htmlPrimary) +
      htmlSources1 +
      htmlExamPractice +
      htmlDominoSpine +
      htmlTasks +
      htmlExtended +
      htmlPairShare +
      htmlHistorian;
  }
  const hasExamPractice = !!(
    lesson.exam_practice &&
    (Array.isArray(lesson.exam_practice)
      ? lesson.exam_practice.length > 0
      : (lesson.exam_practice.questions && lesson.exam_practice.questions.length > 0) ||
      (lesson.exam_practice.stimulus && lesson.exam_practice.stimulus.length > 0))
  );
  const shouldRenderGcseTask = !!(lesson.gcse_task && !hasExamPractice);

  if (
    shouldRenderGcseTask ||
    (!isKs3 && lesson.extended && lesson.extended.question) ||
    extractedExamTasks.length > 0
  ) {
    const gcseStripItems = [];
    let gcseHtml = '';

    if (lesson.extended && lesson.extended.question) {
      let hintsHtml = '';
      if (lesson.extended.hints && lesson.extended.hints.length > 0) {
        hintsHtml = `<div style="margin-top: 15px; padding: 10px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px;"><strong style="color: #d97706;">Hints &amp; Structure Guide:</strong><ul style="margin: 5px 0 0 0; padding-left: 20px; color: #92400e;">${lesson.extended.hints.map((h) => `<li>${formatBold(h)}</li>`).join('')}</ul></div>`;
      }
      if (
        lesson.extended.teacher_guidance &&
        lesson.extended.teacher_guidance.tiered_stems &&
        lesson.extended.teacher_guidance.tiered_stems.length > 0
      ) {
        hintsHtml += `
          <div style="margin-top: 12px; padding: 12px 16px; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 6px;">
            <strong style="color: #166534; display: flex; align-items: center; gap: 8px; font-size: 0.95rem;">
              <i class="fa-solid fa-pen-fancy"></i> Sentence Starters:
            </strong>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #15803d; line-height: 1.6; font-size: 0.92rem;">
              ${lesson.extended.teacher_guidance.tiered_stems.map((s) => `<li>${formatBold(s)}</li>`).join('')}
            </ul>
          </div>`;
      }

      let wordBankHtml = '';
      if (lesson.extended.word_bank && lesson.extended.word_bank.length > 0) {
        wordBankHtml = `
          <div style="margin-top: 12px; padding: 10px 14px; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 6px;">
            <strong style="color: #166534; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">
              Key Word Bank:
            </strong>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${lesson.extended.word_bank.map((w) => `<span style="background: white; border: 1px solid #bbf7d0; color: #14532d; font-size: 0.85rem; font-weight: 600; padding: 2px 8px; border-radius: 4px;">${w}</span>`).join('')}
            </div>
          </div>
        `;
      }

      let connectivesHtml = '';
      if (lesson.extended.connective_bank && lesson.extended.connective_bank.length > 0) {
        connectivesHtml = `
          <div style="margin-top: 10px; padding: 10px 14px; background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 6px;">
            <strong style="color: #1e40af; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">
              Causal Connective Bank:
            </strong>
            <div style="font-size: 0.85rem; color: #1e3a8a; font-style: italic; line-height: 1.5;">
              ${lesson.extended.connective_bank.map((c) => `&ldquo;${c}&rdquo;`).join(' &bull; ')}
            </div>
          </div>
        `;
      }

      let startersHtml = '';
      if (lesson.extended.sentence_starters && lesson.extended.sentence_starters.length > 0) {
        startersHtml = `
          <div style="margin-top: 10px; padding: 10px 14px; background: #faf5ff; border: 1.5px solid #d8b4fe; border-radius: 6px;">
            <strong style="color: #6b21a8; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">
              Model Sentence Starters:
            </strong>
            <ul style="margin: 0; padding-left: 20px; font-size: 0.88rem; color: #581c87; line-height: 1.5;">
              ${lesson.extended.sentence_starters.map((st) => `<li><em>"${st}"</em></li>`).join('')}
            </ul>
          </div>
        `;
      }

      let sourceHtml = '';
      if (lesson.extended.source_a || lesson.extended.source_b) {
        sourceHtml = `<div style="display: flex; flex-wrap: wrap; gap: 20px; margin: 15px 0;">`;
        if (lesson.extended.source_a) {
          const prov =
            typeof lesson.extended.source_a === 'string' ? '' : lesson.extended.source_a.provenance;
          const content =
            typeof lesson.extended.source_a === 'string'
              ? lesson.extended.source_a
              : lesson.extended.source_a.content;
          const isImageA =
            typeof content === 'string' &&
            (content.toLowerCase().endsWith('.png') ||
              content.toLowerCase().endsWith('.jpg') ||
              content.toLowerCase().endsWith('.jpeg') ||
              content.toLowerCase().endsWith('.webp'));
          const renderedA = isImageA
            ? `<div style="text-align: center;"><img src="${getAssetUrl(content)}" style="max-width: 100%; max-height: 480px; object-fit: contain; border-radius: 6px; border: 1.5px solid #cbd5e1;" alt="Source A"></div>`
            : content.replace(/\n/g, '<br>');
          sourceHtml += `
               <div style="flex: 1 1 250px; display: flex; flex-direction: column; font-size: 0.95rem; line-height: 1.5;">
                 <strong style="color: #1e3a8a; display: block; margin-bottom: 8px; font-size: 1.1rem;">Source A</strong>
                 ${prov ? `<span style="color: #334155; display: block; margin-bottom: 15px; font-style: italic;">${prov}</span>` : ''}
                 <div style="border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 20px; background: #ffffff; color: #0f172a; flex-grow: 1;">
                   ${renderedA}
                 </div>
               </div>`;
        }
        if (lesson.extended.source_b) {
          const prov =
            typeof lesson.extended.source_b === 'string' ? '' : lesson.extended.source_b.provenance;
          const content =
            typeof lesson.extended.source_b === 'string'
              ? lesson.extended.source_b
              : lesson.extended.source_b.content;
          const isImageB =
            typeof content === 'string' &&
            (content.toLowerCase().endsWith('.png') ||
              content.toLowerCase().endsWith('.jpg') ||
              content.toLowerCase().endsWith('.jpeg') ||
              content.toLowerCase().endsWith('.webp'));
          const renderedB = isImageB
            ? `<div style="text-align: center;"><img src="${getAssetUrl(content)}" style="max-width: 100%; max-height: 480px; object-fit: contain; border-radius: 6px; border: 1.5px solid #cbd5e1;" alt="Source B"></div>`
            : content.replace(/\n/g, '<br>');
          sourceHtml += `
               <div style="flex: 1 1 250px; display: flex; flex-direction: column; font-size: 0.95rem; line-height: 1.5;">
                 <strong style="color: #1e3a8a; display: block; margin-bottom: 8px; font-size: 1.1rem;">Source B</strong>
                 ${prov ? `<span style="color: #334155; display: block; margin-bottom: 15px; font-style: italic;">${prov}</span>` : ''}
                 <div style="border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 20px; background: #ffffff; color: #0f172a; flex-grow: 1;">
                   ${renderedB}
                 </div>
               </div>`;
        }
        sourceHtml += `</div>`;
        if (lesson.extended.provenance_clue) {
          sourceHtml += `<details style="margin-top: 15px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; overflow: hidden;">
              <summary style="padding: 12px; cursor: pointer; color: #166534; font-weight: bold; list-style: none;">
                <i class="fa-solid fa-magnifying-glass" style="margin-right: 5px;"></i> Click to Reveal Provenance Scaffolding Clues
              </summary>
              <div style="padding: 0 12px 12px 12px; color: #15803d; border-top: 1px solid #bbf7d0; margin-top: 5px; padding-top: 12px;">
                ${lesson.extended.provenance_clue}
              </div>
            </details>`;
        }
      }

      gcseStripItems.push({
        tariffTag:
          lesson.extended.title && /map\s*task/i.test(lesson.extended.title)
            ? 'Map Task 1'
            : 'Task 1',
        stemPreview: cleanStemForStripSummary(
          lesson.extended.title || lesson.extended.question || 'Workbook Activity 1',
        ),
        bodyHtml: `
          <div class="do-now-card" style="background: #ffffff; border: 1px solid #e2e8f0; margin-bottom: 0;">
            <div style="font-weight: 700; margin-bottom: 12px; font-size: 1.06rem; color: #0f172a;">
              ${lesson.extended.qNum ? `Q${lesson.extended.qNum}. ` : ''}${formatQuestion(lesson.extended.question, !lesson.extended.qNum)}
              <span style="display: inline-flex; vertical-align: middle; gap: 6px;">
                ${lesson.extended.model || lesson.extended.model_answer || lesson.extended.answer ? `<button class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-icon-only btn-pedagogy-model" title="Reveal Model Answer" data-action="toggle-element" data-target-id="extended-model-${lesson.id}"><i class="fa-solid fa-eye"></i></button>` : ''}
                ${lesson.extended.answer_image ? `<button class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-model" title="Reveal Reference Map" data-action="toggle-element" data-target-id="extended-map-answer-${lesson.id}"><i class="fa-solid fa-map-location-dot"></i> Reveal Reference Map</button>` : ''}
                ${lesson.extended.title && lesson.extended.title.toLowerCase().includes('map task') ? `<button class="btn btn-pedagogy btn-pedagogy-sm" style="background: #0284c7; color: #ffffff; border: 1px solid #0369a1;" title="Interactive Classroom Map" data-action="toggle-element" data-target-id="extended-map-interactive-${lesson.id}"><i class="fa-solid fa-earth-americas"></i> Interactive Classroom Map</button>` : ''}
              </span>
            </div>
            ${sourceHtml}
            ${(() => {
              const extUid = `ext_${String(lesson.id || currentIndex).replace(/[^a-zA-Z0-9_-]/g, '_')}`;
              const hasExtWb =
                Array.isArray(lesson.extended.word_bank) && lesson.extended.word_bank.length > 0;
              const extScafBody = `${startersHtml}${connectivesHtml}${hintsHtml}`.trim();
              const hasExtScaf = Boolean(extScafBody);
              if (!hasExtWb && !hasExtScaf) return '';
              return `
                <div class="no-print" style="margin: 10px 0 6px 0;">
                  <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px;">
                    ${hasExtWb ? `<button type="button" class="btn btn-pedagogy btn-pedagogy-sm" data-action="toggle-element" data-target-id="ext-wb-${extUid}" style="background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-tags" style="color: #0d9488;"></i> Word Bank <i class="fa-solid fa-chevron-down wb-dd-chevron" style="font-size: 0.68rem; opacity: 0.75;"></i></button>` : ''}
                    ${hasExtScaf ? `<button type="button" class="btn btn-pedagogy btn-pedagogy-sm" data-action="toggle-element" data-target-id="ext-scaf-${extUid}" style="background: #f1f5f9; color: #1e3a8a; border: 1px solid #cbd5e1; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-wand-magic-sparkles" style="color: #2563eb;"></i> Sentence Starters <i class="fa-solid fa-chevron-down wb-dd-chevron" style="font-size: 0.68rem; opacity: 0.75;"></i></button>` : ''}
                  </div>
                  ${
                    hasExtWb
                      ? `<div id="ext-wb-${extUid}" class="scaffold-box" style="display: none; background: #f8fafc; border: 1.5px solid #99f6e4; border-radius: 8px; padding: 11px 14px; margin-top: 8px;">
                          <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: baseline; margin-bottom: 6px;">
                            <span style="font-size: 0.78rem; font-weight: 800; color: #0f766e; text-transform: uppercase;">Key Word Bank:</span>
                            <span style="font-size: 0.72rem; font-weight: 600; color: #64748b;">Tap to cross off</span>
                          </div>
                          <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                            ${lesson.extended.word_bank.map((w) => `<span class="wb-interactive-chip" data-action="toggle-wb-chip" role="button" tabindex="0" title="Tap to cross off once used" style="background: #f0fdfa; border: 1px solid #99f6e4; color: #115e59; font-size: 0.8rem; font-weight: 700; padding: 2px 9px; border-radius: 12px;">${w}</span>`).join('')}
                          </div>
                        </div>`
                      : ''
                  }
                  ${
                    hasExtScaf
                      ? `<div id="ext-scaf-${extUid}" class="scaffold-box" style="display: none; background: #f8fafc; border: 1.5px solid #93c5fd; border-radius: 8px; padding: 12px 14px; margin-top: 8px;">${extScafBody}</div>`
                      : ''
                  }
                </div>
              `;
            })()}
            ${lesson.extended.answer_image
          ? `
              <div id="extended-map-answer-${lesson.id}" class="scaffold-box model-box" style="display:none; margin-top: 15px; border: 2px solid #16a34a; border-radius: 8px; padding: 15px; background: #f0fdf4;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <strong style="color: #166534; font-size: 1.05rem;"><i class="fa-solid fa-circle-check"></i> Authoritative Reference Map (CIA World Factbook):</strong>
                  <a href="https://www.google.com/maps/@31.2,35.2,6z" target="_blank" rel="noopener noreferrer" style="font-size: 0.85rem; color: #166534; font-weight: 600; text-decoration: none; background: #dcfce7; padding: 3px 8px; border-radius: 4px; border: 1px solid #86efac;">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Google Maps Satellite
                  </a>
                </div>
                <div style="text-align: center;"><img src="${getAssetUrl(lesson.extended.answer_image)}" style="max-width: 100%; max-height: 520px; object-fit: contain; border-radius: 6px; border: 1px solid #86efac;" /></div>
              </div>
            `
          : ''
        }
            ${lesson.extended.title && lesson.extended.title.toLowerCase().includes('map task')
          ? `
              <div id="extended-map-interactive-${lesson.id}" style="display:none; margin-top: 15px; border: 2px solid #0284c7; border-radius: 8px; padding: 15px; background: #f0f9ff;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <strong style="color: #0369a1; font-size: 1.05rem;"><i class="fa-solid fa-earth-americas"></i> Interactive Whiteboard Explorer (Middle East):</strong>
                  <div style="display: flex; gap: 8px;">
                    <a href="https://www.google.com/maps/@31.2,35.2,6z" target="_blank" rel="noopener noreferrer" style="font-size: 0.85rem; color: #0284c7; font-weight: 600; text-decoration: none; background: #e0f2fe; padding: 4px 10px; border-radius: 4px; border: 1px solid #7dd3fc;">
                      <i class="fa-brands fa-google"></i> Google Maps Fullscreen
                    </a>
                  </div>
                </div>
                <p style="font-size: 0.85rem; color: #475569; margin: 0 0 10px 0;">Use mouse wheel or touch to zoom in/out on national borders, the Suez Canal, Straits of Tiran, Jerusalem, and regional waterways during classroom discussion.</p>
                <div style="width: 100%; height: 420px; border-radius: 6px; overflow: hidden; border: 1.5px solid #0284c7; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                  <iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=25.0%2C20.0%2C55.0%2C38.0&amp;layer=mapnik&amp;marker=31.5%2C35.0" style="border: 0;"></iframe>
                </div>
              </div>
            `
          : ''
        }
            <textarea class="student-answer-input" style="min-height: 160px;" placeholder="Write your extended response here..." oninput="window.updateProgress && window.updateProgress()"></textarea>
            ${lesson.extended.model || lesson.extended.model_answer || lesson.extended.answer ? `<div id="extended-model-${lesson.id}" class="scaffold-box model-box" style="display:none; margin-top: 15px;">${formatBold(lesson.extended.model || lesson.extended.model_answer || lesson.extended.answer)}</div>` : ''}
          </div>
        `,
      });
    }

    if (lesson.secondary_map) {
      const sm = lesson.secondary_map;
      let smContent = sm.source_a
        ? typeof sm.source_a === 'string'
          ? sm.source_a
          : sm.source_a.content
        : '';
      let smHints = '';
      if (sm.hints && sm.hints.length > 0) {
        smHints = `<div style="margin-top: 15px; padding: 10px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px;"><strong style="color: #d97706;">Hints:</strong><ul style="margin: 5px 0 0 0; padding-left: 20px; color: #92400e;">${sm.hints.map((h) => `<li>${formatBold(h)}</li>`).join('')}</ul></div>`;
      }
      gcseStripItems.push({
        tariffTag: 'Map Task 2',
        stemPreview: cleanStemForStripSummary(sm.title || sm.instructions || sm.question || 'Map Task 2'),
        bodyHtml: `
        <div class="do-now-card" style="background: #ffffff; border: 1px solid #e2e8f0; margin-bottom: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
            <div style="font-weight: 700; font-size: 1.08rem; color: #1e3a8a;">
              ${sm.title}
            </div>
            ${sm.answer_image ? `<button class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-model" data-action="toggle-element" data-target-id="secondary-map-answer-${lesson.id}"><i class="fa-solid fa-map-location-dot"></i> Reveal Reference Map</button>` : ''}
          </div>
          <p style="font-size: 0.95rem; color: #334155; line-height: 1.5; margin-bottom: 15px;">${formatBold(sm.instructions || sm.question)}</p>
          ${smContent
          ? `
            <div style="text-align: center; margin: 15px 0; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 15px; background: #f8fafc;">
              <img src="${getAssetUrl(smContent)}" style="max-width: 100%; max-height: 500px; object-fit: contain; border-radius: 4px;" alt="${sm.title}">
            </div>
          `
          : ''
        }
          ${smHints}
          ${sm.answer_image
          ? `
            <div id="secondary-map-answer-${lesson.id}" class="scaffold-box model-box" style="display:none; margin-top: 15px; border: 2px solid #16a34a; border-radius: 8px; padding: 15px; background: #f0fdf4;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="color: #166534; font-size: 1rem;"><i class="fa-solid fa-circle-check"></i> Model Answer & Reference Maps</strong>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; margin-top: 10px;">
                <div style="flex: 1 1 300px; text-align: center;">
                  <div style="font-size: 0.85rem; font-weight: 700; color: #166534; margin-bottom: 6px;">Israel & Occupied Territories Reference</div>
                  <img src="${getAssetUrl(sm.answer_image)}" style="max-width: 100%; max-height: 480px; object-fit: contain; border-radius: 6px; border: 1px solid #bbf7d0;" alt="Reference Map">
                </div>
                ${sm.macro_map
            ? `
                  <div style="flex: 1 1 300px; text-align: center;">
                    <div style="font-size: 0.85rem; font-weight: 700; color: #166534; margin-bottom: 6px;">1967 Six-Day War Territorial Shift</div>
                    <img src="${getAssetUrl(sm.macro_map)}" style="max-width: 100%; max-height: 480px; object-fit: contain; border-radius: 6px; border: 1px solid #bbf7d0;" alt="Six-Day War Macro Map">
                  </div>
                `
            : ''
          }
              </div>
              ${sm.historical_notes
            ? `
                <div style="margin-top: 12px; padding: 10px; background: #ffffff; border: 1px solid #86efac; border-radius: 6px; font-size: 0.9rem; color: #14532d; line-height: 1.45;">
                  <strong>Historical Context:</strong> ${sm.historical_notes}
                </div>
              `
            : ''
          }
            </div>
          `
          : ''
        }
        </div>
      `,
      });
    }

    if (shouldRenderGcseTask) {
      if (lesson.gcse_task.tasks) {
        lesson.gcse_task.tasks.forEach((task, tIdx) => {
          const taskPrompt = task.stem || task.text || task.question || '';
          const taskModel = task.model_answer || task.model || '';
          const isUtility =
            (task.tariff && task.tariff.includes('2(a)')) || /utility|how useful/i.test(taskPrompt);
          const isFollowUp =
            (task.tariff && task.tariff.includes('2(b)')) ||
            /follow up/i.test(taskPrompt) ||
            !!task.table;

          let matrixHtml = '';
          if (isUtility) {
            matrixHtml = `
              <!-- 3-Step Utility Planning Matrix: Content • Provenance • Limitations -->
              <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 12px 14px; margin: 12px 0 14px 0;">
                <div style="font-weight: 700; font-size: 0.85rem; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-table-columns"></i> 3-Step Utility Planning Matrix: Content &bull; Provenance &bull; Limitations
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                  <div style="background: #ffffff; border: 1px solid #94a3b8; border-top: 3px solid #1e3a8a; border-radius: 6px; padding: 10px;">
                    <strong style="color: #1e3a8a; font-size: 0.84rem; display: block; margin-bottom: 4px;">1. CONTENT &amp; UTILITY</strong>
                    <div style="font-size: 0.8rem; color: #475569; line-height: 1.4;">Analyse what specific historical details the source reveals about the enquiry topic and corroborate with facts.</div>
                  </div>
                  <div style="background: #ffffff; border: 1px solid #94a3b8; border-top: 3px solid #1e3a8a; border-radius: 6px; padding: 10px;">
                    <strong style="color: #1e3a8a; font-size: 0.84rem; display: block; margin-bottom: 4px;">2. PROVENANCE &amp; MOTIVE</strong>
                    <div style="font-size: 0.8rem; color: #475569; line-height: 1.4;">Evaluate the author, origin, date, and purpose of the source to judge its reliability and typicality.</div>
                  </div>
                  <div style="background: #ffffff; border: 1px solid #94a3b8; border-top: 3px solid #1e3a8a; border-radius: 6px; padding: 10px;">
                    <strong style="color: #1e3a8a; font-size: 0.84rem; display: block; margin-bottom: 4px;">3. CONTEXT &amp; LIMITATIONS</strong>
                    <div style="font-size: 0.8rem; color: #475569; line-height: 1.4;">Cross-reference with own contextual knowledge to identify what crucial aspects the source omits.</div>
                  </div>
                </div>
              </div>
            `;
          }

          let tableHtml = '';
          if (task.table && Array.isArray(task.table)) {
            tableHtml = `
              <div style="margin: 12px 0 14px 0; overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #0f172a; font-size: 0.88rem; background: #ffffff;">
                  <thead>
                    <tr style="background: #0f172a; color: #ffffff;">
                      <th style="padding: 8px 12px; text-align: left; width: 36%;">Official Prompt</th>
                      <th style="padding: 8px 12px; text-align: left;">Your Response / Target Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${task.table
                .map(
                  (row, rIdx) => `
                      <tr style="border-bottom: 1px solid #cbd5e1;">
                        <td style="padding: 8px 12px; font-weight: 700; background: #f8fafc; border-right: 1.5px solid #0f172a;">${row.row}</td>
                        <td style="padding: 6px 10px;">
                          <input type="text" class="student-answer-input" style="width: 100%; margin: 0; padding: 6px 8px; font-size: 0.86rem;" placeholder="Complete prompt...">
                          ${row.model ? `<div id="row-model-${tIdx}-${rIdx}" class="scaffold-box model-box" style="display:none; margin-top: 6px; font-size: 0.82rem;"><strong>Model:</strong> ${row.model}</div>` : ''}
                        </td>
                      </tr>
                    `,
                )
                .join('')}
                  </tbody>
                </table>
              </div>
            `;
          }

          gcseHtml += `
              <div class="do-now-card" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 8px; margin-bottom: 20px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                  ${task.tariff ? `<span style="background: #1e3a8a; color: #ffffff; font-size: 0.76rem; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">${task.tariff}</span>` : ''}
                  <span style="display: inline-flex; vertical-align: middle;">
                    ${taskModel ? `<button class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-icon-only btn-pedagogy-model" title="Reveal Model Answer" data-action="toggle-element" data-target-id="gcse-model-${tIdx}"><i class="fa-solid fa-eye"></i></button>` : ''}
                  </span>
                </div>
                <div style="font-weight: 700; margin-bottom: 10px; font-size: 1.05rem; color: #0f172a; line-height: 1.45;">
                  ${lesson.gcse_task.qNum && tIdx === 0 ? `Q${lesson.gcse_task.qNum}. ` : ''}${formatQuestion(taskPrompt, !(lesson.gcse_task.qNum && tIdx === 0))}
                </div>
                ${task.provenance_clue
              ? `
                  <div style="padding: 10px 14px; background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 4px; font-size: 0.88rem; color: #1e40af; margin: 10px 0 14px 0; line-height: 1.45;">
                    <strong style="color: #1e3a8a;"><i class="fa-solid fa-lightbulb"></i> Provenance Clue:</strong> ${task.provenance_clue}
                  </div>
                `
              : ''
            }
                ${matrixHtml}
                ${tableHtml}
                ${!task.table ? `<textarea class="student-answer-input" style="min-height: ${taskPrompt.includes('12 marks') || taskPrompt.includes('16 marks') ? '200px' : '110px'};" placeholder="Write your examination response here..." oninput="window.updateProgress()"></textarea>` : ''}
                ${taskModel ? `<div id="gcse-model-${tIdx}" class="scaffold-box model-box" style="display:none; margin-top: 15px; padding: 12px 16px; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 6px; color: #166534; font-size: 0.92rem; line-height: 1.5;">${formatBold(taskModel)}</div>` : ''}
              </div>
            `;
        });
      } else if (lesson.gcse_task.sources) {
        let topicText = lesson.gcse_task.topic || '';
        let isNarrative = topicText.toLowerCase().includes('write a narrative account');

        if (isNarrative) {
          gcseHtml += `<p style="font-weight: bold; font-size: 1.15rem; color: #1e3a8a;">${lesson.gcse_task.qNum ? `Q${lesson.gcse_task.qNum}. ` : ''}${topicText}</p>`;
          gcseHtml += `<p style="font-size: 1rem; color: #475569; margin-bottom: 10px;"><em>Read the historical sources below before writing your narrative account:</em></p>`;
        } else {
          gcseHtml += `<p style="font-weight: bold; font-size: 1.15rem; color: #1e3a8a;">${lesson.gcse_task.qNum ? `Q${lesson.gcse_task.qNum}. ` : ''}How useful are Sources A and B for an enquiry into ${topicText}?</p>`;
        }

        gcseHtml += `<div style="display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">`;
        lesson.gcse_task.sources.forEach((srcObj) => {
          gcseHtml += `<div style="flex: 1; min-width: 300px; background: white; border: 1px solid #cbd5e1; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">`;
          if (srcObj.type === 'visual') {
            gcseHtml += `<img src="${getAssetUrl(srcObj.src)}" style="max-width: 100%; max-height: 250px; border-radius: 4px; margin-bottom: 10px;">`;
          } else {
            gcseHtml += `<blockquote style="font-size: 1.05rem; font-style: italic; color: #475569; margin: 0 0 15px 0; border-left: 4px solid #94a3b8; padding-left: 10px;">${formatBold(srcObj.text)}</blockquote>`;
          }
          gcseHtml += `<p style="font-size: 0.95rem; font-weight: bold; color: #334155; margin: 0;">${srcObj.title}</p>`;
          gcseHtml += `</div>`;
        });
        gcseHtml += `</div>`;

        if (lesson.gcse_task.scaffolding) {
          const sc = lesson.gcse_task.scaffolding;
          gcseHtml += `
            <div class="provenance-scaffold-box" style="margin: 15px 0 20px 0; padding: 14px 18px; background: #fffbeb; border: 1.5px solid #fcd34d; border-left: 5px solid #d97706; border-radius: 6px;">
              <strong style="color: #92400e; display: flex; align-items: center; gap: 8px; font-size: 1rem; margin-bottom: 8px;">
                <i class="fa-solid fa-magnifying-glass"></i> Provenance Clues &amp; Utility Stems (Edexcel 8-Mark Focus)
              </strong>
              ${sc.provenance_clues && sc.provenance_clues.length > 0
              ? `
                <div style="margin-bottom: 10px;">
                  <span style="font-weight: 700; color: #b45309; font-size: 0.88rem; text-transform: uppercase; letter-spacing: 0.5px;">Provenance Clues (Nature, Origin, Purpose):</span>
                  <ul style="margin: 4px 0 0 0; padding-left: 20px; color: #78350f; font-size: 0.92rem; line-height: 1.5;">
                    ${sc.provenance_clues.map((c) => `<li>${formatBold(c)}</li>`).join('')}
                  </ul>
                </div>
              `
              : ''
            }
              ${sc.utility_stems && sc.utility_stems.length > 0
              ? `
                <div>
                  <span style="font-weight: 700; color: #b45309; font-size: 0.88rem; text-transform: uppercase; letter-spacing: 0.5px;">Tiered Sentence Starters:</span>
                  <ul style="margin: 4px 0 0 0; padding-left: 20px; color: #92400e; font-size: 0.92rem; line-height: 1.5;">
                    ${sc.utility_stems.map((s) => `<li>${formatBold(s)}</li>`).join('')}
                  </ul>
                </div>
              `
              : ''
            }
            </div>
          `;
        }

        let placeholder = isNarrative
          ? 'Write your 8-mark narrative account here...'
          : 'Type your 8-mark utility evaluation here...';
        gcseHtml += `<textarea class="student-answer-input" style="min-height: 200px;" placeholder="${placeholder}" oninput="window.updateProgress()"></textarea>`;

        const gcseModel = lesson.gcse_task.model || lesson.gcse_task.model_answer;
        if (gcseModel) {
          gcseHtml += `<div style="margin-top: 15px;"><button class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-model" data-action="toggle-element" data-target-id="gcse-model-src"><i class="fa-solid fa-eye"></i> Reveal Model Answer</button></div>`;
          gcseHtml += `<div id="gcse-model-src" class="scaffold-box model-box" style="display:none; margin-top: 15px;">${formatBold(gcseModel)}</div>`;
        }
      } else if (lesson.gcse_task.question || lesson.gcse_task.prompt) {
        const renderGcseExamCard = (gt, cardSuffix = '') => {
          const qText = gt.question || gt.prompt || '';
          const qNum = gt.qNum ? `Q${gt.qNum}. ` : '';
          const typeStr = (gt.type || '').toLowerCase();
          let tariffBadge = 'GCSE Exam Practice';
          if (gt.tariff) {
            tariffBadge = gt.tariff;
          } else if (typeStr.includes('12_mark') || qText.includes('12 marks')) {
            tariffBadge = 'Edexcel Paper 1: Explain Why [12 Marks]';
          } else if (
            typeStr.includes('16_mark') ||
            qText.includes('16 marks') ||
            qText.includes('16+4 marks')
          ) {
            tariffBadge = 'Edexcel Paper 1: Evaluative Essay [16+4 Marks]';
          } else if (typeStr.includes('difference') || qText.toLowerCase().includes('different')) {
            tariffBadge = 'Edexcel Paper 1: Explain One Difference [4 Marks]';
          } else if (typeStr.includes('similarity') || qText.toLowerCase().includes('similar')) {
            tariffBadge = 'Edexcel Paper 1: Explain One Similarity [4 Marks]';
          } else if (typeStr.includes('4_mark') || qText.includes('4 marks')) {
            tariffBadge = 'Edexcel GCSE: Explain One Feature [4 Marks]';
          }

          const stimulusList = Array.isArray(gt.stimulus) ? gt.stimulus : [];
          const structureStrip = Array.isArray(gt.structure_strip) ? gt.structure_strip : [];
          const rawConnectives =
            gt.causal_connectives || gt.connective_bank || gt.sentence_stems || gt.stems || [];
          const connectives = Array.isArray(rawConnectives) ? rawConnectives : [];
          const vocabList = Array.isArray(gt.word_bank)
            ? gt.word_bank
            : Array.isArray(gt.vocab_bank)
              ? gt.vocab_bank
              : Array.isArray(lesson.vocab)
                ? lesson.vocab.map((v) => (typeof v === 'object' ? v.term : v)).filter(Boolean)
                : [];
          const modelAns = gt.model_answer || gt.model || '';
          const minHeight =
            typeStr.includes('12_mark') ||
              typeStr.includes('16_mark') ||
              qText.includes('12 marks') ||
              qText.includes('16 marks')
              ? '240px'
              : '140px';
          const cardId = `gcse-model-task-${lesson.id}${cardSuffix ? '-' + cardSuffix : ''}`;

          return `
          <div class="gcse-exam-task-box" style="background: #ffffff; border: 2px solid #1e3a8a; border-radius: 10px; padding: 22px; margin-bottom: 25px; box-shadow: 0 4px 14px rgba(30, 58, 138, 0.08);">
            <!-- Card Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 2px solid #e0f2fe; padding-bottom: 12px; flex-wrap: wrap; gap: 8px;">
              <h4 style="margin: 0; color: #1e3a8a; font-size: 1.18rem; font-weight: 800; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-book-open" style="color: #2563eb;"></i>
                <span>${qNum}Pupil Workbook &bull; Edexcel Exam Practice</span>
              </h4>
              <span style="background: #1e3a8a; color: #ffffff; font-size: 0.75rem; font-weight: 800; padding: 4px 12px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-award" style="color: #93c5fd;"></i> ${tariffBadge}
              </span>
            </div>

            <!-- Question Stem -->
            <div style="background: #f8fafc; border-left: 4px solid #1e3a8a; padding: 14px 18px; border-radius: 6px; margin-bottom: 16px;">
              <div style="font-size: 1.1rem; font-weight: 700; color: #0f172a; line-height: 1.5; margin-bottom: ${stimulusList.length > 0 ? '12px' : '0'};">
                ${formatBold(qText)}
              </div>
              ${stimulusList.length > 0
              ? `
                <div style="background: #ffffff; border: 1.2px solid #cbd5e1; border-radius: 6px; padding: 10px 14px;">
                  <div style="font-size: 0.8rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-circle-info" style="color: #3b82f6;"></i> Edexcel Stimulus Points (You must also use information of your own):
                  </div>
                  <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    ${stimulusList
                .map(
                  (s) =>
                    `<span style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; font-size: 0.88rem; font-weight: 600; padding: 4px 10px; border-radius: 4px;">• ${s}</span>`,
                )
                .join('')}
                  </div>
                </div>
              `
              : ''
            }
            </div>

            <!-- Pedagogical Guidance / Clue Box (if present) -->
            ${gt.hint || gt.clue
              ? `
              <div style="margin-bottom: 16px; background: #fffbeb; border: 1.2px solid #fde68a; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 12px 16px;">
                <div style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #b45309; letter-spacing: 0.5px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-lightbulb" style="color: #f59e0b;"></i> Pedagogical Examination Guidance &amp; Clue:
                </div>
                <div style="font-size: 0.92rem; color: #78350f; line-height: 1.5;">${formatBold(gt.hint || gt.clue)}</div>
              </div>
            `
              : ''
            }

            <!-- Word Bank & Sentence Starters Dropdowns -->
            ${(() => {
              const gtUid = String(cardId).replace(/[^a-zA-Z0-9_-]/g, '_');
              const hasGtWb = vocabList.length > 0;
              const hasGtScaf = structureStrip.length > 0 || connectives.length > 0;
              if (!hasGtWb && !hasGtScaf) return '';
              return `
              <div class="no-print" style="margin-bottom: 14px;">
                <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px;">
                  ${hasGtWb ? `<button type="button" class="btn btn-pedagogy btn-pedagogy-sm" data-action="toggle-element" data-target-id="gt-wb-${gtUid}" style="background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-tags" style="color: #0d9488;"></i> Word Bank <i class="fa-solid fa-chevron-down wb-dd-chevron" style="font-size: 0.68rem; opacity: 0.75;"></i></button>` : ''}
                  ${hasGtScaf ? `<button type="button" class="btn btn-pedagogy btn-pedagogy-sm" data-action="toggle-element" data-target-id="gt-scaf-${gtUid}" style="background: #f1f5f9; color: #1e3a8a; border: 1px solid #cbd5e1; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-wand-magic-sparkles" style="color: #2563eb;"></i> Sentence Starters &amp; Structure <i class="fa-solid fa-chevron-down wb-dd-chevron" style="font-size: 0.68rem; opacity: 0.75;"></i></button>` : ''}
                </div>
                ${
                  hasGtWb
                    ? `<div id="gt-wb-${gtUid}" class="scaffold-box" style="display: none; background: #f8fafc; border: 1.5px solid #99f6e4; border-radius: 8px; padding: 11px 14px; margin-top: 8px;">
                        <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: baseline; margin-bottom: 6px;">
                          <span style="font-size: 0.78rem; font-weight: 800; color: #0f766e; text-transform: uppercase;">GCSE Key Vocabulary Bank:</span>
                          <span style="font-size: 0.72rem; font-weight: 600; color: #64748b;">Tap to cross off</span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                          ${vocabList.map((w) => `<span class="wb-interactive-chip" data-action="toggle-wb-chip" role="button" tabindex="0" title="Tap to cross off once used" style="background: #f0fdfa; border: 1px solid #99f6e4; color: #115e59; font-size: 0.8rem; font-weight: 700; padding: 2px 9px; border-radius: 12px;">${w}</span>`).join('')}
                        </div>
                      </div>`
                    : ''
                }
                ${
                  hasGtScaf
                    ? `<div id="gt-scaf-${gtUid}" class="scaffold-box" style="display: none; background: #f8fafc; border: 1.5px solid #93c5fd; border-radius: 8px; padding: 13px 16px; margin-top: 8px;">
                        ${
                          structureStrip.length > 0
                            ? `<div style="margin-bottom: ${connectives.length > 0 ? '12px' : '0'};">
                                <div style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #0369a1; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                                  <i class="fa-solid fa-layer-group"></i> Analytical Structure Strip (Paragraph Breakdown):
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
                                  ${structureStrip
                                    .map(
                                      (st, sIdx) => `
                                    <div style="background: #ffffff; border: 1.2px solid #bae6fd; border-radius: 6px; padding: 10px 12px;">
                                      <div style="font-size: 0.8rem; font-weight: 800; color: #0369a1; text-transform: uppercase; margin-bottom: 4px; border-bottom: 1px solid #e0f2fe; padding-bottom: 3px;">
                                        ${st.para || `Paragraph ${sIdx + 1}`}
                                      </div>
                                      <div style="font-size: 0.85rem; color: #1e293b; line-height: 1.4;">
                                        ${st.focus || st.detail || ''}
                                      </div>
                                    </div>
                                  `,
                                    )
                                    .join('')}
                                </div>
                              </div>`
                            : ''
                        }
                        ${
                          connectives.length > 0
                            ? `<div>
                                <div style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #15803d; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                                  <i class="fa-solid fa-pen-fancy"></i> Causal Connective Bank &amp; Tiered Sentence Starters:
                                </div>
                                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                                  ${connectives.map((c) => `<span class="wb-interactive-chip" data-action="toggle-wb-chip" role="button" tabindex="0" title="Tap to cross off once used" style="background: #ffffff; border: 1px solid #86efac; color: #166534; font-size: 0.81rem; font-weight: 600; padding: 3px 9px; border-radius: 12px;">${c}</span>`).join('')}
                                </div>
                              </div>`
                            : ''
                        }
                      </div>`
                    : ''
                }
              </div>`;
            })()}

            <!-- Student Response Textarea -->
            <div style="margin-bottom: 14px;">
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 6px;">
                Your Examination Response:
              </label>
              <textarea class="student-answer-input" style="width: 100%; box-sizing: border-box; min-height: ${minHeight}; padding: 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 0.95rem; line-height: 1.6; font-family: inherit; resize: vertical;" placeholder="Write your full exam response here..." oninput="if(window.updateProgress) window.updateProgress()"></textarea>
            </div>

            <!-- Model Answer Reveal -->
            ${modelAns
              ? `
              <div style="margin-top: 14px;">
                <button class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-model" data-action="toggle-element" data-target-id="${cardId}">
                  <i class="fa-solid fa-eye"></i> Reveal Examiner Model Answer
                </button>
                <div id="${cardId}" class="scaffold-box model-box" style="display:none; margin-top: 14px; background: #f8fafc; border: 1.5px solid #94a3b8; border-radius: 8px; padding: 16px; font-size: 0.95rem; line-height: 1.6; color: #0f172a;">
                  <div style="font-weight: 800; color: #1e3a8a; margin-bottom: 8px; text-transform: uppercase; font-size: 0.82rem; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-award"></i> Examiner-Grade Model Answer:
                  </div>
                  <div>${formatBold(modelAns)}</div>
                </div>
              </div>
            `
              : ''
            }
          </div>
        `;
        };

        if (lesson.four_mark_task) {
          gcseHtml += renderGcseExamCard(lesson.four_mark_task, 'q3');
        }
        gcseHtml += renderGcseExamCard(lesson.gcse_task, 'q4');
      }
    }

    if (extractedExamTasks.length > 0) {
      extractedExamTasks.forEach((task, tIdx) => {
        gcseHtml += `
            <div class="do-now-card" style="background: #ffffff; border: 1px solid #e2e8f0; margin-bottom: 20px;">
              <div style="font-weight: 700; margin-bottom: 12px; font-size: 1.1rem; color: #0f172a;">
                ${formatQuestion(task.text || task.question)}
                <span style="display: inline-flex; vertical-align: middle;">
                  ${task.model ? `<button class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-icon-only btn-pedagogy-model" title="Reveal Model Answer" data-action="toggle-element" data-target-id="extracted-model-${tIdx}"><i class="fa-solid fa-eye"></i></button>` : ''}
                </span>
              </div>
              <textarea class="student-answer-input" style="min-height: 200px;" placeholder="Write your response here..." oninput="window.updateProgress()"></textarea>
              ${task.model ? `<div id="extracted-model-${tIdx}" class="scaffold-box model-box" style="display:none; margin-top: 15px;">${formatBold(task.model)}</div>` : ''}
            </div>
          `;
      });
    }
    if (gcseHtml.trim()) {
      gcseStripItems.push({
        tariffTag: `Task ${gcseStripItems.length + 1}`,
        stemPreview: cleanStemForStripSummary(
          lesson.gcse_task?.question ||
            lesson.gcse_task?.prompt ||
            lesson.gcse_task?.topic ||
            extractedExamTasks[0]?.question ||
            'Workbook Assessment Practice',
        ),
        bodyHtml: gcseHtml,
      });
    }

    if (gcseStripItems.length > 0) {
      const stationHeading =
        lesson.extended && lesson.extended.title && /map\s*task/i.test(lesson.extended.title)
          ? 'Pupil Workbook Activities &bull; Geographical Foundation'
          : 'Pupil Workbook Activities &bull; Assessment Practice';

      html += `
        ${emitWbStylesOnce()}
        <div class="wb-unified-station phase-card">
          <div class="wb-station-header">
            <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1 1 auto;">
              <div style="width: 34px; height: 34px; border-radius: 8px; background: #10b981; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.98rem; flex-shrink: 0; box-shadow: 0 2px 5px rgba(16, 185, 129, 0.25);">
                <i class="fa-solid fa-book-open"></i>
              </div>
              <div style="min-width: 0;">
                <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.05rem; font-weight: 800; color: #0f172a; line-height: 1.2;">${stationHeading}</div>
                <div style="font-size: 0.73rem; color: #64748b; font-weight: 600;">Select any workbook strip below to open interactive maps, writing space &amp; reference keys</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex-shrink: 0;">
              <span class="wb-origin-pill wb-origin-green">
                <i class="fa-solid fa-book-open"></i> ${gcseStripItems.length} in Workbook
              </span>
              <button type="button" class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-model" data-action="reveal-all-models" style="padding: 5px 10px; font-size: 0.78rem;"><i class="fa-solid fa-magnifying-glass"></i> Reveal Models</button>
              <button type="button" onclick="window.toggleAllWorkbookStrips && window.toggleAllWorkbookStrips(this)" style="background: #ffffff; color: #334155; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 10px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-solid fa-expand"></i> Expand All
              </button>
            </div>
          </div>
          <div class="wb-strips-stack">
            ${gcseStripItems
              .map(
                (st) => `
              <details class="wb-question-strip wb-strip-green">
                <summary>
                  <div class="wb-strip-left">
                    <span class="wb-origin-pill wb-origin-green">
                      <i class="fa-solid fa-book-open"></i> Workbook
                    </span>
                    <span class="wb-tariff-pill">${st.tariffTag}</span>
                    <span class="wb-stem-preview">${st.stemPreview}</span>
                  </div>
                  <div class="wb-strip-right">
                    <span class="wb-strip-toggle-txt">
                      <span class="wb-lbl-closed">Open</span><span class="wb-lbl-open">Close</span>
                      <i class="fa-solid fa-chevron-down wb-strip-caret"></i>
                    </span>
                  </div>
                </summary>
                <div class="wb-strip-body">
                  ${st.bodyHtml}
                </div>
              </details>
            `,
              )
              .join('')}
          </div>
        </div>
      `;
    }
  }

  // Extension Task
  if (lesson.extension_task) {
    html += `
        <div class="phase-card extension-task-card no-print" style="padding: 25px; background: linear-gradient(to right, #f8fafc, #f1f5f9); border: 2px dashed #cbd5e1; border-radius: 8px; margin-bottom: 30px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); position: relative; overflow: hidden;">
          <div style="position: absolute; top: -15px; right: -15px; opacity: 0.05; font-size: 10rem; color: #1e3a8a;"><i class="fa-solid fa-laptop-code"></i></div>
          <div style="position: relative; z-index: 2;">
            <h3 style="margin-top: 0; color: #1e3a8a; font-size: 1.3rem; display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <i class="fa-solid fa-magnifying-glass-plus" style="color: #facc15;"></i> ${lesson.extension_task.title}
            </h3>
            <p style="color: #334155; font-size: 1.05rem; line-height: 1.6; margin-bottom: 20px;">
              ${lesson.extension_task.instructions}
            </p>
            ${lesson.extension_task.search_terms && lesson.extension_task.search_terms.length > 0
        ? `
            <div style="background: white; border: 1px solid #cbd5e1; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
              <strong style="color: #0f172a; display: block; margin-bottom: 8px;"><i class="fa-brands fa-google" style="color: #ea4335; margin-right: 5px;"></i> Suggested Search Terms:</strong>
              <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                ${lesson.extension_task.search_terms.map((t) => `<span style="background: #f1f5f9; padding: 4px 10px; border-radius: 4px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 0.95rem; color: #475569; user-select: all;">"${t}"</span>`).join('')}
              </div>
            </div>
            `
        : ''
      }
            ${lesson.extension_task.hyperlinks && lesson.extension_task.hyperlinks.length > 0
        ? `
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              ${lesson.extension_task.hyperlinks.map((l) => `<a href="${l.url}" target="_blank" class="btn btn-secondary" style="text-decoration: none; display: inline-flex; align-items: center; gap: 8px; border: 1px solid #94a3b8;"><i class="fa-solid fa-arrow-up-right-from-square" style="color: #3b82f6;"></i> ${l.text}</a>`).join('')}
            </div>
            `
        : ''
      }
          </div>
        </div>
    `;
  }

  // --- EMBEDDED CHECK & CONSOLIDATE STATION (Quick Check 5 Qs / Deep Challenge 20 Qs / Vocab Flip Cards) ---
  if (appStore.state.activeUnitData.type !== 'trip') {
    html += renderConsolidateStationHTML(lesson);
  }

  // Further Reading Cover-Card Row ('Further reading: two narratives')
  if (Array.isArray(lesson.reading_shelf) && lesson.reading_shelf.length > 0) {
    const escShelf = (v) =>
      String(v || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    const escShelfAttr = (v) => escShelf(v).replace(/"/g, '&quot;');
    const shelfCardsHtml = lesson.reading_shelf
      .filter((item) => item && (item.title || item.cover))
      .map((item) => {
        const coverUrl = item.cover ? getAssetUrl(item.cover) : '';
        return `
          <article class="reading-shelf-item">
            ${
              coverUrl
                ? `
              <div class="reading-shelf-cover-wrap">
                <img src="${coverUrl}" alt="${escShelfAttr(item.title || 'Book cover')}" class="archival-image reading-shelf-cover" data-action="open-modal" data-src="${coverUrl}" />
              </div>
            `
                : ''
            }
            <div class="reading-shelf-meta">
              ${item.title ? `<h4 class="reading-shelf-book-title">${escShelf(item.title)}</h4>` : ''}
              ${item.author ? `<div class="reading-shelf-author">${escShelf(item.author)}</div>` : ''}
              ${item.perspective_note ? `<p class="reading-shelf-note">${escShelf(item.perspective_note)}</p>` : ''}
            </div>
          </article>
        `;
      })
      .join('');

    if (shelfCardsHtml) {
      html += `
        <section class="phase-card reading-shelf-card" aria-label="Further reading: two narratives">
          <div class="reading-shelf-header">
            <span class="reading-shelf-eyebrow">Historiography &amp; Memoir</span>
            <h3 class="reading-shelf-heading">Further reading: two narratives</h3>
          </div>
          <div class="reading-shelf-grid">
            ${shelfCardsHtml}
          </div>
        </section>
      `;
    }
  }

  // Note: Exit Ticket is now unified directly into the Consolidate Station terminal above.

  // Previous / Next Lesson Navigation Buttons
  if (currentIndex !== -1) {
    html += `<div style="display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; margin-bottom: 40px;">`;

    if (currentIndex > 0) {
      const prevLesson = allUnitLessons[currentIndex - 1];
      let prevLabel = 'Previous Lesson';
      if (isTrip && prevLesson) {
        if (prevLesson.id === 'day_0') {
          prevLabel = 'Pre-Trip Briefing';
        } else if (prevLesson.id && prevLesson.id.startsWith('day_')) {
          prevLabel = `Previous Day (${prevLesson.title.split(':')[0]})`;
        } else if (prevLesson.id === 'hero_crummack') {
          prevLabel = 'Pupil Family Hero: 2nd Lt Crummack';
        } else if (prevLesson.id && prevLesson.id.startsWith('hero_lowry_')) {
          prevLabel = `Previous Study: ${prevLesson.title.split('(')[0].trim()}`;
        } else if (prevLesson.id && prevLesson.id.startsWith('hero_')) {
          prevLabel = `Previous Hero: ${prevLesson.title.split('(')[0].trim()}`;
        } else {
          prevLabel = 'Previous';
        }
      }
      html += `<button class="btn btn-secondary" data-action="render-lesson" data-index="${currentIndex - 1}"><i class="fa-solid fa-arrow-left"></i> ${prevLabel}</button>`;
    } else {
      html += `<div></div>`;
    }

    if (currentIndex < allUnitLessons.length - 1) {
      const nextLesson = allUnitLessons[currentIndex + 1];
      let nextLabel = 'Next Lesson';
      if (isTrip && nextLesson) {
        if (nextLesson.id === 'day_0') {
          nextLabel = 'Pre-Trip Briefing';
        } else if (nextLesson.id && nextLesson.id.startsWith('day_')) {
          nextLabel = `Next Day (${nextLesson.title.split(':')[0]})`;
        } else if (nextLesson.id === 'hero_crummack') {
          nextLabel = 'Family Hero: 2nd Lt Crummack';
        } else if (nextLesson.id && nextLesson.id.startsWith('hero_lowry_')) {
          nextLabel = `Home Front: ${nextLesson.title.split('(')[0].trim()}`;
        } else if (nextLesson.id && nextLesson.id.startsWith('hero_')) {
          nextLabel = `Local Hero: ${nextLesson.title.split('(')[0].trim()}`;
        } else {
          nextLabel = 'Next';
        }
      }
      html += `<button class="btn-pedagogy-primary" data-action="render-lesson" data-index="${currentIndex + 1}">${nextLabel} <i class="fa-solid fa-arrow-right"></i></button>`;
    } else if (isKs2) {
      html += `<button type="button" class="btn-pedagogy-primary btn-ks2-complete-unit" onclick="if(window.switchView){ window.switchView('quiz', '${unitId}'); }" style="background: linear-gradient(135deg, #059669 0%, #047857 100%); border-color: #10b981;"><i class="fa-solid fa-trophy" style="color: #fde047; margin-right: 6px;"></i> Complete Unit &amp; Open Quiz Challenge <i class="fa-solid fa-arrow-right" style="margin-left: 4px;"></i></button>`;
    } else {
      html += `<div></div>`;
    }

    html += `</div>`;
  }

  const activeUnitEdition = (activeUnit && activeUnit.edition) || '2026.1';
  const hubPrefix = isKs2
    ? 'The History Revision Hub &bull; Key Stage 2 History'
    : isKs3
      ? 'The History Revision Hub &bull; Key Stage 3'
      : 'GCSE History Hub';
  html += `
    <div class="lesson-footer-meta" style="text-align: center; margin-top: 50px; padding: 16px; font-size: 0.8rem; color: #94a3b8; border-top: 1px solid #e2e8f0; font-family: 'Inter', sans-serif;">
      ${hubPrefix} &bull; Unit: ${activeUnit?.shortTitle || activeUnit?.title || unitId} &bull; Edition ${activeUnitEdition}
    </div>
  `;

  html += `</div>`; // End lesson-content wrapper

  contentArea.innerHTML = html;

  try {
    initConsolidateStation(lesson);
    initLessonExamPractice(unitId, lesson);
  } catch (err) {
    console.error('Failed to initialize consolidate station:', err);
  }

  window.vocabMatchesFound = 0;
  if (window.resetVocabSelection) window.resetVocabSelection();
  if (typeof document !== 'undefined' && document.body.classList.contains('teacher-mode-active')) {
    if (typeof window.syncTeacherButtons === 'function') window.syncTeacherButtons(true);
    if (typeof window.applyTeacherModeToLessonDOM === 'function') window.applyTeacherModeToLessonDOM(true);
  }
  setTimeout(() => {
    if (window.mermaid) {
      try {
        mermaid.init(undefined, document.querySelectorAll('.mermaid'));
      } catch (e) {
        console.error('Mermaid render error:', e);
      }
    }
    if (window.postRenderHooks) {
      window.postRenderHooks.forEach((hook) => hook());
      window.postRenderHooks = [];
    }

    // Execute pending narrative block jump if set (one-shot, immediately scrubbed from URL/sessionStorage)
    try {
      let stageToJump = null;
      if (typeof window !== 'undefined') {
        const cleanUrl = new URL(window.location.href);
        const urlStage = cleanUrl.searchParams.get('stage');
        if (urlStage) {
          stageToJump = parseInt(urlStage, 10);
          cleanUrl.searchParams.delete('stage');
          try {
            window.history.replaceState(window.history.state || {}, '', cleanUrl);
          } catch (err) {}
        }
        const pendingJump = sessionStorage.getItem('hh_pending_narrative_jump');
        if (pendingJump) {
          sessionStorage.removeItem('hh_pending_narrative_jump');
          const parsed = JSON.parse(pendingJump);
          if (parsed && parsed.stageNum) {
            stageToJump = parsed.stageNum;
          }
        }
      }
      if (stageToJump) {
        setTimeout(() => {
          if (typeof window.jumpToNarrativeBlock === 'function') {
            window.jumpToNarrativeBlock(stageToJump);
          }
        }, 150);
      }
    } catch (e) {}

    if (typeof window.renderFloatingCmeMapButton === 'function') {
      window.renderFloatingCmeMapButton();
    }

    initLessonTripMap(lesson);

    // Initialize Crummack Lesson 13 Interactive Map Pins & Paleography Features
    if (unitId === 'trip_ypres' && lesson.id === 'hero_crummack') {
      initCrummackInteractiveFeatures();
    }

    // Auto-inject read-aloud buttons into all primary source excerpt cards
    injectArchivalAudioButtons();
  }, 100);
}

