/**
 * Classroom Desk-Locator Strip & Back-Row Stage Reading Spotlight Modal
 *
 * Paper-First Classroom Learning Flow (Zero Pupil/Teacher Typing):
 *   1. Read (Default): Max auto-fitted prose + Tap Sentence to Highlight + 30s Turn & Talk Timer
 *   2. Hints: Zero-spoiler 2–3 word retrieval prompts (tap any hint chip to peek 1 bullet, or keep hidden while writing)
 *   3. Stems: Writing Revolution analytical sentence starters (zero factual giveaways)
 *   4. Check Answers: Concise "Evidence → So What" bullets (Passage + Wider Context) + ⚠️ Watch Out Misconception Check
 */

import { UNIT_RESOURCES_CATALOG } from '../data/unit_resources_catalog.js';
import { isVerifiedPdf } from '../verified_pdf_manifest.js';
import { getWorkbookPageAnchor } from './workbook_page_map.js';
import {
  getLessonTextbookLocator,
  openDigitalTextbookReader,
} from '../digital_textbook_reader.js';

const stageAnswersUnitCache = {};

let activeLessonSpotlightState = {
  stages: [],
  meta: {},
  currentIndex: 0,
  fontScale: 'auto', // 'auto' | 'sm' | 'md' | 'lg'
  pedagogyMode: 'read', // 'read' | 'hints' | 'stems' | 'answers'
  highlightActive: true,
  showVisualPlate: true,
  peekedHintIndices: {},
  timerRemaining: 0,
  timerInterval: null,
  timerFinishedFlash: false,
  audioEl: null,
  audioPaused: false,
  ttsSpeaking: false,
};

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripTags(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Style the causal arrow `→` inside an `Evidence → So What` bullet so the causal link pops from the back row.
 */
function formatCausalBulletHTML(rawBullet) {
  const safe = escHtml(rawBullet);
  return safe.replace(
    /\s*(&rarr;|→|-&gt;)\s*/g,
    ' <span style="color: #38bdf8; font-weight: 900; padding: 0 2px;">&rarr;</span> ',
  );
}

async function ensureUnitStageAnswersLoaded(unitId) {
  if (!unitId) return null;
  if (stageAnswersUnitCache[unitId] !== undefined) {
    return stageAnswersUnitCache[unitId];
  }
  try {
    const res = await fetch(`/data/stage_answers/${encodeURIComponent(unitId)}.json`);
    if (!res.ok) {
      stageAnswersUnitCache[unitId] = null;
      return null;
    }
    const data = await res.json();
    stageAnswersUnitCache[unitId] = data || null;
    return stageAnswersUnitCache[unitId];
  } catch (e) {
    stageAnswersUnitCache[unitId] = null;
    return null;
  }
}

function quickBrowserProseFingerprint(str) {
  const s = String(str || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

function entryStillMatchesLiveStage(entry, stage) {
  if (!entry || !Array.isArray(entry.passage) || entry.passage.length === 0) return false;
  if (stage && stage.rawText && entry.prose_fp) {
    const liveFp = quickBrowserProseFingerprint(stage.rawText);
    if (entry.prose_fp === liveFp) return true; // Exact paragraph fingerprint match!
  } else if (!entry.prose_fp) {
    return true;
  }
  const hay = stripTags(stage.rawText || stage.htmlProse || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .toLowerCase();
  if (!hay) return true;
  let checked = 0;
  let matched = 0;
  for (const item of entry.passage) {
    const words = String(item.bullet || '')
      .toLowerCase()
      .replace(/[^a-z0-9£\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 5);
    for (const w of words.slice(0, 3)) {
      checked++;
      if (hay.includes(w.slice(0, Math.max(4, w.length - 1)))) matched++;
    }
  }
  return checked === 0 || matched / checked >= 0.35;
}

function resolveBespokeStageEntry(unitId, lessonId, lessonIndex, stageNum, stageObj) {
  const bank = stageAnswersUnitCache[unitId];
  if (!bank || !bank.lessons) return null;

  let list = null;
  if (lessonId && Array.isArray(bank.lessons[lessonId])) {
    list = bank.lessons[lessonId];
  } else if (Array.isArray(bank.lessonsByIndex) && Array.isArray(bank.lessonsByIndex[lessonIndex])) {
    list = bank.lessonsByIndex[lessonIndex];
  } else {
    const keys = Object.keys(bank.lessons);
    if (keys[lessonIndex] && Array.isArray(bank.lessons[keys[lessonIndex]])) {
      list = bank.lessons[keys[lessonIndex]];
    }
  }
  if (!Array.isArray(list)) return null;
  const found = list.find((s) => Number(s.stage) === Number(stageNum)) || list[stageNum - 1] || null;
  if (found && stageObj && !entryStillMatchesLiveStage(found, stageObj)) {
    return null; // Live narrative was heavily rewritten before sync: fall back to live passage automatically
  }
  return found;
}

export function injectClassroomLocatorAndSpotlightStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('hh-classroom-locator-spotlight-styles')) return;

  const style = document.createElement('style');
  style.id = 'hh-classroom-locator-spotlight-styles';
  style.textContent = `
    body.hh-mobile-pupil-mode:not(.staff-mode-active) .classroom-desk-locator-strip,
    body.hh-mobile-pupil-mode:not(.staff-mode-active) .stage-spotlight-btn {
      display: none !important;
    }
    @media (max-width: 932px) {
      body:not(.staff-mode-active) .classroom-desk-locator-strip,
      body:not(.staff-mode-active) .stage-spotlight-btn {
        display: none !important;
      }
    }

    .classroom-desk-locator-strip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px 12px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 4px solid #0284c7;
      border-radius: 8px;
      padding: 6px 12px;
      margin: 0 0 12px 0;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
    }

    .cdl-kicker {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.71rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #475569;
      white-space: nowrap;
    }

    .cdl-pills-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 7px;
    }

    .cdl-pill-group {
      display: inline-flex;
      align-items: stretch;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #bae6fd;
      background: #e0f2fe;
    }

    .cdl-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      font-size: 0.78rem;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
      white-space: nowrap;
      font-family: 'Inter', sans-serif;
      line-height: 1.25;
    }

    .cdl-pill-tb-main {
      background: #eff6ff;
      color: #1e3a8a;
      border: none;
      border-radius: 0;
    }
    .cdl-pill-tb-main:hover {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .cdl-pill-tb-pdf {
      background: #ffffff;
      color: #475569;
      border: none;
      border-left: 1px solid #bae6fd;
      padding: 4px 7px;
      font-size: 0.71rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 3px;
      text-decoration: none;
    }
    .cdl-pill-tb-pdf:hover {
      background: #f1f5f9;
      color: #dc2626;
    }

    .cdl-pill-wb {
      background: #fffbeb;
      color: #92400e;
      border: 1px solid #fde68a;
    }
    .cdl-pill-wb:hover {
      background: #fef3c7;
      color: #78350f;
    }

    .cdl-pill-ws {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
    }
    .cdl-pill-ws:hover {
      background: #dcfce7;
      color: #14532d;
    }

    .stage-spotlight-btn {
      background: rgba(255, 255, 255, 0.10);
      border: 1px solid rgba(148, 163, 184, 0.42);
      color: #e2e8f0;
      font-family: 'Inter', sans-serif;
      font-size: 0.68rem;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.16s ease;
      white-space: nowrap;
    }
    .stage-spotlight-btn:hover {
      background: #0284c7;
      border-color: #38bdf8;
      color: #ffffff;
    }
    .narrative-chunk-header .stage-spotlight-btn {
      background: #f1f5f9;
      border-color: #cbd5e1;
      color: #334155;
    }
    .narrative-chunk-header .stage-spotlight-btn:hover {
      background: #0284c7;
      border-color: #0284c7;
      color: #ffffff;
    }

    #stage-reading-spotlight-modal,
    #stage-reading-spotlight-modal * {
      box-sizing: border-box;
    }

    #stage-reading-spotlight-modal {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      z-index: 99990;
      background: #0b1120;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      overflow: hidden;
    }

    #global-glossary-popover,
    #global-dossier-popover {
      z-index: 100020 !important;
    }

    .srs-topbar {
      background: #0f172a;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      padding: 6px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: nowrap;
      gap: 8px;
      flex-shrink: 0;
      width: 100%;
      min-height: 44px;
    }
    @media (max-width: 980px) {
      .srs-topbar {
        flex-wrap: wrap;
      }
    }

    .srs-question-banner {
      background: linear-gradient(90deg, #0f172a 0%, #1e293b 100%);
      border-bottom: 2px solid #0284c7;
      padding: 8px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      flex-shrink: 0;
      width: 100%;
    }

    .srs-body {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      padding: 12px 20px;
      display: flex;
      align-items: stretch;
      justify-content: center;
      width: 100%;
    }

    .srs-grid {
      width: 100%;
      max-width: 1540px;
      height: 100%;
      display: grid;
      grid-template-columns: minmax(0, 1.42fr) minmax(320px, 1fr);
      gap: 18px;
      align-items: stretch;
    }
    @media (max-width: 960px) {
      .srs-body {
        overflow-y: auto;
      }
      .srs-grid {
        grid-template-columns: 1fr;
        height: auto;
      }
    }

    .srs-prose-card {
      background: #fffdf9;
      color: #0f172a;
      border-radius: 12px;
      padding: 16px 24px;
      border: 1px solid #cbd5e1;
      border-left: 6px solid #0284c7;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
      font-family: 'Lora', Georgia, serif;
      line-height: 1.5;
      min-width: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow-y: auto;
    }
    .srs-prose-card.scale-sm .srs-prose-content { font-size: 1.15rem; line-height: 1.52; }
    .srs-prose-card.scale-md .srs-prose-content { font-size: 1.36rem; line-height: 1.55; }
    .srs-prose-card.scale-lg .srs-prose-content { font-size: 1.60rem; line-height: 1.58; }
    .srs-prose-content p {
      margin: 0 0 0.58em 0;
    }
    .srs-prose-content p:last-child {
      margin-bottom: 0;
    }

    .srs-hl-sentence {
      border-radius: 4px;
      transition: background 0.14s ease, box-shadow 0.14s ease;
    }
    .srs-prose-card.hl-mode-on .srs-hl-sentence {
      cursor: pointer;
    }
    .srs-prose-card.hl-mode-on .srs-hl-sentence:hover {
      background: rgba(254, 240, 138, 0.45);
    }
    .srs-hl-sentence.is-highlighted {
      background: #fef08a;
      box-shadow: inset 0 -2px 0 #eab308;
      padding: 1px 3px;
    }

    .srs-right-panel {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 14px 16px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
      min-width: 0;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .srs-right-panel.is-visual-mode {
      background: #1e293b;
      text-align: center;
    }
    .srs-right-panel img.srs-stage-plate-img {
      max-width: 100%;
      max-height: 55vh;
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 8px;
      background: #ffffff;
      display: block;
      margin: 0 auto;
    }
    .srs-right-panel > .srs-dock-inner {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .srs-mode-pill {
      background: transparent;
      color: #94a3b8;
      border: none;
      border-radius: 5px;
      padding: 4px 9px;
      font-size: 0.72rem;
      font-weight: 800;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .srs-mode-pill:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
    }
    .srs-mode-pill.is-active {
      background: #0284c7;
      color: #ffffff;
    }
    .srs-mode-pill[data-srs-mode="answers"].is-active {
      background: #059669;
      color: #ffffff;
    }

    .srs-hint-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 11px;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
      border: 1px solid rgba(56, 189, 248, 0.4);
      background: rgba(14, 165, 233, 0.12);
      color: #e0f2fe;
    }
    .srs-hint-chip:hover {
      background: rgba(14, 165, 233, 0.24);
      border-color: #38bdf8;
    }
    .srs-hint-chip.is-context {
      border-color: rgba(251, 191, 36, 0.42);
      background: rgba(245, 158, 11, 0.12);
      color: #fef3c7;
    }
    .srs-hint-chip.is-context:hover {
      background: rgba(245, 158, 11, 0.24);
      border-color: #fbbf24;
    }
  `;
  document.head.appendChild(style);
}

function resolveWorkbookPdfForLesson(unitId, tbLoc) {
  const cat = UNIT_RESOURCES_CATALOG[unitId];
  if (!cat || !cat.workbook) return '';
  const wb = cat.workbook;
  if (Array.isArray(wb.editions) && wb.editions.length > 0) {
    const matched =
      (tbLoc && wb.editions.find((e) => e.id === tbLoc.ktId)) || wb.editions[0];
    if (matched) {
      if (matched.pdfUrl && isVerifiedPdf(matched.pdfUrl)) return matched.pdfUrl;
      return matched.htmlUrl || '';
    }
  }
  if (wb.pdfUrl && isVerifiedPdf(wb.pdfUrl)) return wb.pdfUrl;
  return wb.htmlUrl || '';
}

export function renderClassroomDeskLocatorHTML({
  unitId,
  lesson,
  currentIndex,
  isKs2 = false,
  isTrip = false,
}) {
  if (isTrip || !unitId || unitId === 'trip_ypres') return '';
  injectClassroomLocatorAndSpotlightStyles();

  const safeIdx = Math.max(0, Number(currentIndex) || 0);
  const tbLoc = getLessonTextbookLocator(unitId, safeIdx, lesson);
  const wbAnchor = getWorkbookPageAnchor(unitId, lesson, safeIdx);
  const wbUrl = resolveWorkbookPdfForLesson(unitId, tbLoc);

  if (!tbLoc && !wbAnchor) return '';

  const tbHtml = tbLoc
    ? `
      <span class="cdl-pill-group">
        <button type="button" class="cdl-pill-btn cdl-pill-tb-main" onclick="if(window.openDigitalTextbookReader){window.openDigitalTextbookReader('${tbLoc.unitId}', '${tbLoc.ktId}', ${tbLoc.spreadIndex}, ${tbLoc.page});}" title="Open Interactive 2-Page Flipbook Textbook directly at ${escHtml(tbLoc.pageLabel)}">
          <i class="fa-solid fa-book-open" style="color: #0284c7;"></i>
          <span>${escHtml(tbLoc.fullLabel)}</span>
          <span style="font-size: 0.66rem; font-weight: 800; background: #0284c7; color: #ffffff; padding: 1px 5px; border-radius: 4px; margin-left: 2px;">Flipbook</span>
        </button>
        ${
          tbLoc.pdfUrl
            ? `<a href="${tbLoc.pdfUrl}#page=${tbLoc.page}" target="_blank" rel="noopener" class="cdl-pill-tb-pdf" title="Open Printable Textbook PDF at ${escHtml(tbLoc.pageLabel)}">
                <i class="fa-solid fa-file-pdf" style="color: #dc2626;"></i> PDF
              </a>`
            : ''
        }
      </span>
    `
    : '';

  let wbDisplayLabel = '';
  if (wbAnchor) {
    const ktPrefix =
      tbLoc && tbLoc.ktId && tbLoc.ktId !== 'MAIN'
        ? tbLoc.ktId === 'western_front'
          ? 'WF '
          : tbLoc.ktId.startsWith('KT')
            ? `${tbLoc.ktId} `
            : ''
        : '';
    wbDisplayLabel = `${ktPrefix}Workbook: ${wbAnchor.shortLabel}`;
  }

  const wbHref =
    wbUrl && wbAnchor
      ? wbUrl.endsWith('.pdf')
        ? `${wbUrl}#page=${wbAnchor.page}`
        : wbUrl
      : wbUrl;

  const wbHtml =
    wbAnchor && wbHref
      ? `
        <a href="${wbHref}" target="_blank" rel="noopener" class="cdl-pill-btn cdl-pill-wb" title="Open Pupil Workbook at ${escHtml(wbAnchor.label)}">
          <i class="fa-solid fa-pen-to-square" style="color: #d97706;"></i>
          <span>${escHtml(wbDisplayLabel)}</span>
        </a>
      `
      : '';

  const wsHtml =
    isKs2 && lesson && lesson.id
      ? `
        <button type="button" class="cdl-pill-btn cdl-pill-ws" onclick="window.openKs2WorksheetModal && window.openKs2WorksheetModal('${escHtml(lesson.id)}', ${safeIdx})" title="Open Printable A4 Companion Worksheet for Lesson ${safeIdx + 1}">
          <i class="fa-solid fa-file-lines" style="color: #16a34a;"></i>
          <span>Worksheet: Lesson ${safeIdx + 1}</span>
        </button>
      `
      : '';

  return `
    <div class="classroom-desk-locator-strip no-print" role="region" aria-label="Classroom Desk Page Locator">
      <span class="cdl-kicker">
        <i class="fa-solid fa-compass" style="color: #0284c7;"></i>
        <span>Open Desk Copies To:</span>
      </span>
      <div class="cdl-pills-row">
        ${tbHtml}
        ${wbHtml}
        ${wsHtml}
      </div>
    </div>
  `;
}

export function renderStageSpotlightBtnHTML(stageIndex) {
  return `
    <button type="button" class="stage-spotlight-btn no-print" onclick="event.stopPropagation(); if(window.openStageReadingSpotlight){window.openStageReadingSpotlight(${stageIndex});}" title="Project this Stage in Back-Row Classroom Reading Spotlight">
      <i class="fa-solid fa-expand" style="font-size: 0.64rem;"></i>
      <span>Spotlight</span>
    </button>
  `;
}

export function registerActiveLessonStages(stages, meta = {}) {
  injectClassroomLocatorAndSpotlightStyles();
  activeLessonSpotlightState.stages = Array.isArray(stages) ? stages : [];
  activeLessonSpotlightState.meta = meta || {};
  activeLessonSpotlightState.pedagogyMode = 'read';
  activeLessonSpotlightState.peekedHintIndices = {};
  if (meta && meta.unitId) {
    ensureUnitStageAnswersLoaded(meta.unitId);
  }
  try {
    const savedScale = sessionStorage.getItem('hh_spotlight_font_scale');
    if (savedScale === 'auto' || savedScale === 'sm' || savedScale === 'md' || savedScale === 'lg') {
      activeLessonSpotlightState.fontScale = savedScale;
    }
  } catch (e) {}
}

function buildTwrStemsForQuestion(questionStr, stageTitle, stageNum = 1) {
  const q = String(questionStr || '').trim();
  const topic = String(stageTitle || 'this turning point')
    .replace(/^Stage\s*\d+\s*[:•-]\s*/i, '')
    .replace(/[()]/g, '')
    .trim();

  if (/^why\b/i.test(q)) {
    const whyVariants = [
      [
        {
          badge: 'COMPETING PRESSURES',
          stem: 'Pressured by ____________ on one side and ____________ on the other, ...',
        },
        {
          badge: 'UNDERLYING CAUSE',
          stem: 'The decisive reason was ____________, which meant that ____________.',
        },
        {
          badge: 'WIDER CONTEXT',
          stem: 'Alongside earlier pressures such as ____________, this forced...',
        },
      ],
      [
        {
          badge: 'MOTIVE & AIM',
          stem: 'Seeking to secure ____________ without provoking ____________, ...',
        },
        {
          badge: 'CATALYST',
          stem: 'Once ____________ emerged, ____________ became unavoidable because...',
        },
        {
          badge: 'WIDER CONTEXT',
          stem: 'Given contemporary concerns over ____________, this decision...',
        },
      ],
    ];
    return whyVariants[(Math.max(1, stageNum) - 1) % whyVariants.length];
  }
  if (/^how\b/i.test(q)) {
    const howVariants = [
      [
        {
          badge: 'KEY MECHANISM',
          stem: 'By introducing ____________ alongside ____________, this ensured that...',
        },
        {
          badge: 'CHANGE & LIMITS',
          stem: 'Although ____________ remained an obstacle, ____________ enabled...',
        },
        {
          badge: 'WIDER CONTEXT',
          stem: 'Against the wider backdrop of ____________, these measures...',
        },
      ],
      [
        {
          badge: 'ENFORCEMENT',
          stem: 'Enforcing ____________ across ____________ strengthened control by...',
        },
        {
          badge: 'BALANCE & CONTINUITY',
          stem: 'While banning ____________, retaining ____________ reassured...',
        },
        {
          badge: 'WIDER CONTEXT',
          stem: 'Drawing on wider circumstances such as ____________, this shaped...',
        },
      ],
    ];
    return howVariants[(Math.max(1, stageNum) - 1) % howVariants.length];
  }
  return [
    {
      badge: 'DEFINING FEATURE',
      stem: `A central feature of ${topic.toLowerCase()} was ____________, which led to...`,
    },
    {
      badge: 'CONSEQUENCE',
      stem: 'As a result of ____________, ____________ shifted decisively toward...',
    },
    {
      badge: 'WIDER CONTEXT',
      stem: 'Connecting this to wider developments in ____________ shows that...',
    },
  ];
}

/**
 * Fallback generator used only until a unit's bespoke stage_answers/<unitId>.json entry is loaded.
 */
function buildFallbackStageEntry(stage) {
  const raw = String(stage.rawText || stripTags(stage.htmlProse || ''))
    .replace(/\[\d+\.\d+\]\s*/g, '')
    .trim();
  const paras = raw.split(/\n\s*\n+/).filter(Boolean);
  const extractPair = (txt, idx) => {
    const clean = txt.replace(/<[^>]+>/g, '').trim();
    const boldMatch = clean.match(/\*\*([^*]+)\*\*/);
    const hint = boldMatch ? boldMatch[1] : `Key Point ${idx + 1}`;
    const sents = clean.match(/[^.!?]+[.!?]+/g) || [clean];
    const target =
      sents.find((s) => /\*\*[^*]+\*\*/.test(s)) || sents[Math.min(1, sents.length - 1)] || '';
    return {
      hint,
      bullet: target.replace(/\*\*([^*]+)\*\*/g, '$1').trim(),
    };
  };

  const passage = paras.slice(0, 2).map((p, i) => extractPair(p, i));
  if (stage.consequence) {
    passage.push({
      hint: 'Overall consequence',
      bullet: stage.consequence.replace(/<[^>]+>/g, '').trim(),
    });
  }
  return {
    passage: passage.filter((x) => x.bullet),
    context: stage.priorContext
      ? [{ hint: 'Wider context', bullet: stage.priorContext.replace(/^From\s+[^:]+:\s*/i, '') }]
      : [],
    watch_out: '',
  };
}

function enableInteractiveSentenceHighlighter(proseEl) {
  if (!proseEl || proseEl.dataset.hlWrapped === '1') return;
  proseEl.dataset.hlWrapped = '1';

  const paragraphs = proseEl.querySelectorAll('p');
  const targets = paragraphs.length > 0 ? Array.from(paragraphs) : [proseEl];

  targets.forEach((p) => {
    const html = p.innerHTML;
    const tokens = html.split(/(<[^>]+>)/g);
    let rebuilt = '<span class="srs-hl-sentence">';
    tokens.forEach((tok) => {
      if (tok.startsWith('<')) {
        rebuilt += tok;
      } else {
        rebuilt += tok.replace(/([.!?]+)(\s+)/g, '$1</span>$2<span class="srs-hl-sentence">');
      }
    });
    rebuilt += '</span>';
    p.innerHTML = rebuilt;
  });

  proseEl.addEventListener('click', (e) => {
    if (!activeLessonSpotlightState.highlightActive) return;
    if (
      e.target.closest(
        'button, a, .key-individual-inline-link, .vocab-word, .vocab-lens-term',
      )
    ) {
      return;
    }
    const sent = e.target.closest('.srs-hl-sentence');
    if (sent) {
      sent.classList.toggle('is-highlighted');
      refreshHighlightResetButton();
    }
  });
}

function refreshHighlightResetButton() {
  const modal = document.getElementById('stage-reading-spotlight-modal');
  if (!modal) return;
  const resetBtn = modal.querySelector('#srs-btn-hl-reset');
  if (!resetBtn) return;
  const count = modal.querySelectorAll('#srs-prose-content .srs-hl-sentence.is-highlighted').length;
  resetBtn.disabled = count === 0;
  resetBtn.style.opacity = count > 0 ? '1' : '0.42';
  resetBtn.style.cursor = count > 0 ? 'pointer' : 'default';
  resetBtn.innerHTML = `<i class="fa-solid fa-rotate-left"></i> <span>${count > 0 ? `Reset (${count})` : 'Reset'}</span>`;
}

function autoFitSpotlightProse() {
  const modal = document.getElementById('stage-reading-spotlight-modal');
  if (!modal) return;
  const body = modal.querySelector('.srs-body');
  const card = modal.querySelector('#srs-prose-card');
  const prose = modal.querySelector('#srs-prose-content');
  if (!body || !card || !prose) return;

  if (activeLessonSpotlightState.fontScale !== 'auto') {
    prose.style.fontSize = '';
    prose.style.lineHeight = '';
    card.style.overflowY = 'auto';
    card.style.justifyContent = card.scrollHeight > card.clientHeight ? 'flex-start' : 'center';
    return;
  }

  card.style.justifyContent = 'flex-start';
  const maxScrollH = card.clientHeight + 1;
  let low = 0.85;
  let high = 1.92;
  let best = low;

  for (let i = 0; i < 12; i++) {
    const mid = (low + high) / 2;
    prose.style.fontSize = `${mid.toFixed(3)}rem`;
    prose.style.lineHeight = mid > 1.42 ? '1.50' : mid > 1.15 ? '1.44' : '1.38';
    if (card.scrollHeight <= maxScrollH) {
      best = mid;
      low = mid;
    } else {
      high = mid;
    }
  }

  prose.style.fontSize = `${best.toFixed(3)}rem`;
  prose.style.lineHeight = best > 1.42 ? '1.50' : best > 1.15 ? '1.44' : '1.38';
  const overflows = card.scrollHeight > maxScrollH + 1;
  card.style.overflowY = overflows ? 'auto' : 'hidden';
  card.style.justifyContent = overflows ? 'flex-start' : 'center';
}

function autoFitPedagogyDock() {
  const dock = document.getElementById('srs-pedagogy-dock');
  if (!dock) return;
  const inner = dock.querySelector('.srs-dock-inner');
  if (!inner) return;

  inner.style.zoom = '1';
  dock.style.setProperty('--srs-rp-scale', '1');

  const mode = activeLessonSpotlightState.pedagogyMode;
  const availH = Math.max(140, dock.clientHeight - 28);

  if (mode === 'read') {
    dock.style.justifyContent = 'center';
    dock.style.overflowY = 'hidden';
    const img = dock.querySelector('img.srs-stage-plate-img');
    const cap = dock.querySelector('.srs-plate-caption');
    if (img) {
      const capH = cap ? cap.offsetHeight + 10 : 0;
      img.style.maxHeight = `${Math.max(120, availH - capH)}px`;
    }
    return;
  }

  // Proportional ceiling: keep right-hand bullets <= 80% of the main prose font size (and <= 1.42x)
  const proseEl = document.getElementById('srs-prose-content');
  const prosePx = proseEl ? parseFloat(getComputedStyle(proseEl).fontSize) || 24 : 24;
  const maxProportionalScale = Math.max(0.95, Math.min(1.42, (prosePx * 0.8) / 15));

  if (mode === 'hints') {
    // Pre-measure the exact largest scale where ALL hints expanded fill the right panel with 0 scroll,
    // then lock that scale so tapping individual hints NEVER resizes or glitches the other hints!
    dock.style.justifyContent = 'flex-start';
    const stages = activeLessonSpotlightState.stages;
    const stage = stages[activeLessonSpotlightState.currentIndex];
    const meta = activeLessonSpotlightState.meta || {};
    const entry = stage
      ? resolveBespokeStageEntry(meta.unitId, meta.lessonId, meta.lessonIndex, stage.stageNum, stage) ||
        buildFallbackStageEntry(stage)
      : null;

    const chips = Array.from(dock.querySelectorAll('[data-hint-peek]'));
    const savedHtml = [];
    if (entry && chips.length > 0) {
      chips.forEach((chip) => {
        const lbl = chip.querySelector('.srs-hint-label');
        const grp = chip.getAttribute('data-hint-group');
        const idx = Number(chip.getAttribute('data-hint-idx'));
        const list = grp === 'context' ? entry.context || [] : entry.passage || [];
        const item = list[idx];
        savedHtml.push(lbl ? lbl.innerHTML : '');
        if (lbl && item) lbl.innerHTML = formatCausalBulletHTML(item.bullet);
      });
    }

    let low = 0.72;
    let high = maxProportionalScale;
    let best = low;
    for (let i = 0; i < 11; i++) {
      const mid = (low + high) / 2;
      dock.style.setProperty('--srs-rp-scale', mid.toFixed(3));
      if (inner.scrollHeight <= availH) {
        best = mid;
        low = mid;
      } else {
        high = mid;
      }
    }
    dock.style.setProperty('--srs-rp-scale', best.toFixed(3));

    if (entry && chips.length > 0) {
      chips.forEach((chip, i) => {
        const lbl = chip.querySelector('.srs-hint-label');
        if (lbl) lbl.innerHTML = savedHtml[i];
      });
    }
    dock.style.overflowY = inner.scrollHeight > availH + 4 ? 'auto' : 'hidden';
    return;
  }

  dock.style.justifyContent = 'center';
  let low = 0.66;
  let high = maxProportionalScale;
  let best = low;

  for (let i = 0; i < 11; i++) {
    const mid = (low + high) / 2;
    dock.style.setProperty('--srs-rp-scale', mid.toFixed(3));
    if (inner.scrollHeight <= availH) {
      best = mid;
      low = mid;
    } else {
      high = mid;
    }
  }
  dock.style.setProperty('--srs-rp-scale', best.toFixed(3));
  dock.style.overflowY = inner.scrollHeight > availH + 2 ? 'auto' : 'hidden';
}

function dismissFloatingPopoversIfOpen() {
  let dismissedAny = false;
  const glossaryPop = document.getElementById('global-glossary-popover');
  if (glossaryPop && glossaryPop.classList.contains('visible')) {
    if (typeof window.hideVocabPopover === 'function') {
      window.hideVocabPopover(true);
    } else {
      glossaryPop.classList.remove('visible');
    }
    dismissedAny = true;
  }
  const dossierPop = document.getElementById('global-dossier-popover');
  if (dossierPop && dossierPop.classList.contains('visible')) {
    if (typeof window.hideDossierPopover === 'function') {
      window.hideDossierPopover();
    } else {
      dossierPop.classList.remove('visible');
    }
    dismissedAny = true;
  }
  return dismissedAny;
}

function updateSpotlightAudioButtonsUI(status = 'idle') {
  const modal = document.getElementById('stage-reading-spotlight-modal');
  if (!modal) return;
  const playBtn = modal.querySelector('#srs-btn-play-audio');
  const stopBtn = modal.querySelector('#srs-btn-stop-audio');
  if (playBtn) {
    if (status === 'playing') {
      playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> <span>Pause</span>';
      playBtn.style.background = '#fbbf24';
    } else if (status === 'paused') {
      playBtn.innerHTML = '<i class="fa-solid fa-play"></i> <span>Resume</span>';
      playBtn.style.background = '#38bdf8';
    } else {
      playBtn.innerHTML = '<i class="fa-solid fa-play"></i> <span>Listen</span>';
      playBtn.style.background = '#f59e0b';
    }
  }
  if (stopBtn) {
    const active = status === 'playing' || status === 'paused';
    stopBtn.disabled = !active;
    stopBtn.style.opacity = active ? '1' : '0.32';
    stopBtn.style.cursor = active ? 'pointer' : 'default';
  }
}

function stopSpotlightSpeechIfActive() {
  if (activeLessonSpotlightState.audioEl) {
    const oldAudio = activeLessonSpotlightState.audioEl;
    activeLessonSpotlightState.audioEl = null;
    try {
      oldAudio.onended = null;
      oldAudio.onerror = null;
      oldAudio.pause();
      oldAudio.removeAttribute('src');
    } catch (e) {}
  }
  activeLessonSpotlightState.audioPaused = false;
  if (activeLessonSpotlightState.ttsSpeaking && typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  activeLessonSpotlightState.ttsSpeaking = false;
  if (typeof window !== 'undefined' && typeof window.cancelSpeech === 'function') {
    try {
      window.cancelSpeech();
    } catch (e) {}
  }
  updateSpotlightAudioButtonsUI('idle');
}

function toggleSpotlightAudioPlayback(studioAudioUrl, proseEl) {
  // 1. Toggle active Studio Audio element in place (zero DOM mutation on #srs-prose-content!)
  if (activeLessonSpotlightState.audioEl) {
    if (!activeLessonSpotlightState.audioPaused) {
      activeLessonSpotlightState.audioEl.pause();
      activeLessonSpotlightState.audioPaused = true;
      updateSpotlightAudioButtonsUI('paused');
    } else {
      activeLessonSpotlightState.audioPaused = false;
      updateSpotlightAudioButtonsUI('playing');
      activeLessonSpotlightState.audioEl.play().catch(() => stopSpotlightSpeechIfActive());
    }
    return;
  }

  // 2. Toggle active browser SpeechSynthesis fallback
  if (activeLessonSpotlightState.ttsSpeaking && typeof window !== 'undefined' && window.speechSynthesis) {
    if (!activeLessonSpotlightState.audioPaused) {
      window.speechSynthesis.pause();
      activeLessonSpotlightState.audioPaused = true;
      updateSpotlightAudioButtonsUI('paused');
    } else {
      window.speechSynthesis.resume();
      activeLessonSpotlightState.audioPaused = false;
      updateSpotlightAudioButtonsUI('playing');
    }
    return;
  }

  // 3. Stop any background lesson narration first
  stopSpotlightSpeechIfActive();

  const startBrowserTtsFallback = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !proseEl) {
      stopSpotlightSpeechIfActive();
      return;
    }
    const clone = proseEl.cloneNode(true);
    clone.querySelectorAll('.print-only, .sr-only').forEach((n) => n.remove());
    const spoken = (clone.textContent || '').replace(/\s+/g, ' ').trim();
    if (!spoken) return;
    const utter = new SpeechSynthesisUtterance(spoken);
    const rate = typeof window.getSpeechRate === 'function' ? window.getSpeechRate() : 1.0;
    utter.rate = rate || 1.0;
    if (typeof window.getBestVoice === 'function') {
      const v = window.getBestVoice();
      if (v) utter.voice = v;
    }
    utter.onend = () => stopSpotlightSpeechIfActive();
    utter.onerror = () => stopSpotlightSpeechIfActive();
    activeLessonSpotlightState.ttsSpeaking = true;
    activeLessonSpotlightState.audioPaused = false;
    updateSpotlightAudioButtonsUI('playing');
    window.speechSynthesis.speak(utter);
  };

  if (studioAudioUrl) {
    const audio = new Audio(studioAudioUrl);
    const rate = typeof window.getSpeechRate === 'function' ? window.getSpeechRate() : 1.0;
    audio.playbackRate = rate || 1.0;
    activeLessonSpotlightState.audioEl = audio;
    activeLessonSpotlightState.audioPaused = false;
    updateSpotlightAudioButtonsUI('playing');
    audio.onended = () => {
      if (activeLessonSpotlightState.audioEl === audio) stopSpotlightSpeechIfActive();
    };
    audio.onerror = () => {
      if (activeLessonSpotlightState.audioEl !== audio) return;
      activeLessonSpotlightState.audioEl = null;
      startBrowserTtsFallback();
    };
    audio.play().catch(() => {
      if (activeLessonSpotlightState.audioEl !== audio) return;
      activeLessonSpotlightState.audioEl = null;
      startBrowserTtsFallback();
    });
  } else {
    startBrowserTtsFallback();
  }
}

function clearTurnAndTalkTimer() {
  if (activeLessonSpotlightState.timerInterval) {
    clearInterval(activeLessonSpotlightState.timerInterval);
    activeLessonSpotlightState.timerInterval = null;
  }
  activeLessonSpotlightState.timerRemaining = 0;
  activeLessonSpotlightState.timerFinishedFlash = false;
}

function updateTurnAndTalkButtonUI() {
  const modal = document.getElementById('stage-reading-spotlight-modal');
  if (!modal) return;
  const tpsBtn = modal.querySelector('#srs-btn-tps-timer');
  const lbl = modal.querySelector('#srs-tps-timer-lbl');
  if (!tpsBtn || !lbl) return;

  if (activeLessonSpotlightState.timerRemaining > 0) {
    tpsBtn.style.background = '#059669';
    tpsBtn.style.borderColor = '#34d399';
    lbl.textContent = `0:${String(activeLessonSpotlightState.timerRemaining).padStart(2, '0')} • Tap to Stop`;
  } else if (activeLessonSpotlightState.timerFinishedFlash) {
    tpsBtn.style.background = '#d97706';
    tpsBtn.style.borderColor = '#fbbf24';
    lbl.textContent = 'Time Up! • Reset';
  } else {
    tpsBtn.style.background = 'rgba(16,185,129,0.18)';
    tpsBtn.style.borderColor = '#34d399';
    lbl.textContent = '30s Turn & Talk';
  }
}

function renderRightPanelInnerHTML(stage, entry) {
  const mode = activeLessonSpotlightState.pedagogyMode;

  if (mode === 'read') {
    if (stage.imageUrl) {
      return `
        <div class="srs-dock-inner" style="align-items: center;">
          <img class="srs-stage-plate-img" src="${escHtml(stage.imageUrl)}" alt="${escHtml(stage.title || 'Stage Visual Plate')}" />
          ${
            stage.imageCaption
              ? `<div class="srs-plate-caption" style="margin-top: 6px; font-size: 0.82rem; color: #cbd5e1; line-height: 1.4; font-style: italic; text-align: left; width: 100%; padding: 0 4px;">${stage.imageCaption}</div>`
              : ''
          }
        </div>
      `;
    }
    return `
      <div class="srs-dock-inner" style="text-align: center; color: #94a3b8; padding: 24px 16px;">
        <i class="fa-solid fa-book-open-reader" style="font-size: 1.6rem; color: #38bdf8; margin-bottom: 8px;"></i>
        <div style="font-size: 0.96rem; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">Shared Reading &amp; Paper Workbook</div>
        <div style="font-size: 0.86rem; line-height: 1.45; color: #94a3b8;">Read the passage on the left and answer the Guiding Question on paper. Use <strong>2. Hints</strong>, <strong>3. Stems</strong>, or <strong>4. Check Answers</strong> above when ready.</div>
      </div>
    `;
  }

  if (mode === 'hints') {
    const passageItems = Array.isArray(entry.passage) ? entry.passage : [];
    const contextItems = Array.isArray(entry.context) ? entry.context : [];
    const peekMap = activeLessonSpotlightState.peekedHintIndices || {};
    const anyPeeked = Object.values(peekMap).some(Boolean);

    return `
      <div class="srs-dock-inner" style="text-align: left; gap: calc(11px * var(--srs-rp-scale, 1));">
        <div style="background: rgba(14, 165, 233, 0.08); border: 1px solid rgba(56, 189, 248, 0.32); border-left: 4px solid #38bdf8; border-radius: 9px; padding: calc(10px * var(--srs-rp-scale, 1)) calc(14px * var(--srs-rp-scale, 1));">
          <div style="font-size: calc(0.68rem * var(--srs-rp-scale, 1)); font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: #7dd3fc; margin-bottom: calc(8px * var(--srs-rp-scale, 1)); display: flex; justify-content: space-between; align-items: center;">
            <span><i class="fa-regular fa-lightbulb"></i> Look in the Passage For &bull; Tap to Peek</span>
            <button type="button" id="srs-btn-reset-hints" style="visibility: ${anyPeeked ? 'visible' : 'hidden'}; background: rgba(255,255,255,0.12); color: #e2e8f0; border: none; border-radius: 4px; padding: 2px 8px; font-size: 0.66rem; font-weight: 800; cursor: pointer;">Collapse All</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: calc(7px * var(--srs-rp-scale, 1));">
            ${passageItems
              .map((item, idx) => {
                const key = `p_${idx}`;
                const isPeeked = Boolean(peekMap[key]);
                return `
                  <button type="button" class="srs-hint-chip" data-hint-peek="${key}" data-hint-group="passage" data-hint-idx="${idx}" style="padding: calc(6px * var(--srs-rp-scale, 1)) calc(12px * var(--srs-rp-scale, 1)); font-size: calc(0.88rem * var(--srs-rp-scale, 1)); border-radius: 7px; text-align: left; line-height: 1.35; width: 100%; justify-content: flex-start;" title="Tap to peek or hide this point">
                    <i class="fa-solid ${isPeeked ? 'fa-check' : 'fa-magnifying-glass'}" style="font-size: calc(0.7rem * var(--srs-rp-scale, 1)); color: #38bdf8; flex-shrink: 0;"></i>
                    <span class="srs-hint-label">${isPeeked ? formatCausalBulletHTML(item.bullet) : escHtml(item.hint)}</span>
                  </button>
                `;
              })
              .join('')}
          </div>
        </div>

        ${
          contextItems.length > 0
            ? `
          <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(251, 191, 36, 0.35); border-left: 4px solid #f59e0b; border-radius: 9px; padding: calc(10px * var(--srs-rp-scale, 1)) calc(14px * var(--srs-rp-scale, 1));">
            <div style="font-size: calc(0.68rem * var(--srs-rp-scale, 1)); font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: #fcd34d; margin-bottom: calc(8px * var(--srs-rp-scale, 1));">
              <i class="fa-solid fa-link"></i> Wider Context Prompts &bull; Tap to Peek
            </div>
            <div style="display: flex; flex-direction: column; gap: calc(7px * var(--srs-rp-scale, 1));">
              ${contextItems
                .map((item, idx) => {
                  const key = `c_${idx}`;
                  const isPeeked = Boolean(peekMap[key]);
                  return `
                    <button type="button" class="srs-hint-chip is-context" data-hint-peek="${key}" data-hint-group="context" data-hint-idx="${idx}" style="padding: calc(6px * var(--srs-rp-scale, 1)) calc(12px * var(--srs-rp-scale, 1)); font-size: calc(0.88rem * var(--srs-rp-scale, 1)); border-radius: 7px; text-align: left; line-height: 1.35; width: 100%; justify-content: flex-start;" title="Tap to peek or hide wider context link">
                      <i class="fa-solid ${isPeeked ? 'fa-check' : 'fa-plus'}" style="font-size: calc(0.7rem * var(--srs-rp-scale, 1)); color: #fbbf24; flex-shrink: 0;"></i>
                      <span class="srs-hint-label">${isPeeked ? formatCausalBulletHTML(item.bullet) : escHtml(item.hint)}</span>
                    </button>
                  `;
                })
                .join('')}
            </div>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  if (mode === 'stems') {
    const stems =
      Array.isArray(entry.stems) && entry.stems.length > 0
        ? entry.stems
        : buildTwrStemsForQuestion(stage.question, stage.title, stage.stageNum);
    return `
      <div class="srs-dock-inner" style="text-align: left; gap: calc(11px * var(--srs-rp-scale, 1));">
        ${stems
          .map(
            (s, i) => `
          <div style="background: ${i === 2 ? 'rgba(245,158,11,0.09)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${i === 2 ? 'rgba(251,191,36,0.35)' : 'rgba(148,163,184,0.28)'}; border-left: 4px solid ${i === 0 ? '#38bdf8' : i === 1 ? '#a78bfa' : '#f59e0b'}; border-radius: 9px; padding: calc(11px * var(--srs-rp-scale, 1)) calc(14px * var(--srs-rp-scale, 1));">
            <div style="font-size: calc(0.68rem * var(--srs-rp-scale, 1)); font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: ${i === 0 ? '#7dd3fc' : i === 1 ? '#c4b5fd' : '#fcd34d'}; margin-bottom: calc(5px * var(--srs-rp-scale, 1));">
              ${escHtml(s.badge)}
            </div>
            <div style="font-family: 'Lora', Georgia, serif; font-style: italic; font-size: calc(1.00rem * var(--srs-rp-scale, 1)); color: #f8fafc; line-height: 1.45;">
              &ldquo;${escHtml(s.stem)}&rdquo;
            </div>
          </div>
        `,
          )
          .join('')}
      </div>
    `;
  }

  // Mode 4: 'answers' — Eye-Level Right-Hand Green-Pen Panel
  const passageItems = Array.isArray(entry.passage) ? entry.passage : [];
  const contextItems = Array.isArray(entry.context) ? entry.context : [];
  const watchOut = String(entry.watch_out || '').trim();

  return `
    <div class="srs-dock-inner" style="text-align: left; gap: calc(10px * var(--srs-rp-scale, 1));">
      <div style="background: rgba(16, 185, 129, 0.09); border: 1px solid rgba(52, 211, 153, 0.35); border-left: 4px solid #10b981; border-radius: 9px; padding: calc(10px * var(--srs-rp-scale, 1)) calc(14px * var(--srs-rp-scale, 1));">
        <div style="font-size: calc(0.68rem * var(--srs-rp-scale, 1)); font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: #6ee7b7; margin-bottom: calc(6px * var(--srs-rp-scale, 1));">
          <i class="fa-solid fa-pen-clip"></i> From the Passage &bull; Tick &amp; Upgrade in Green Pen
        </div>
        <ul style="margin: 0; padding-left: calc(18px * var(--srs-rp-scale, 1)); display: flex; flex-direction: column; gap: calc(6px * var(--srs-rp-scale, 1)); color: #f0fdf4; font-size: calc(0.94rem * var(--srs-rp-scale, 1)); line-height: 1.38;">
          ${passageItems
            .map(
              (item) => `
            <li>${formatCausalBulletHTML(item.bullet)}</li>
          `,
            )
            .join('')}
        </ul>
      </div>

      ${
        contextItems.length > 0
          ? `
        <div style="background: rgba(245, 158, 11, 0.09); border: 1px solid rgba(251, 191, 36, 0.38); border-left: 4px solid #f59e0b; border-radius: 9px; padding: calc(10px * var(--srs-rp-scale, 1)) calc(14px * var(--srs-rp-scale, 1));">
          <div style="font-size: calc(0.68rem * var(--srs-rp-scale, 1)); font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: #fcd34d; margin-bottom: calc(6px * var(--srs-rp-scale, 1));">
            <i class="fa-solid fa-plus-circle"></i> Wider Context &bull; Also Credit on Paper
          </div>
          <ul style="margin: 0; padding-left: calc(18px * var(--srs-rp-scale, 1)); display: flex; flex-direction: column; gap: calc(5px * var(--srs-rp-scale, 1)); color: #fef3c7; font-size: calc(0.91rem * var(--srs-rp-scale, 1)); line-height: 1.37;">
            ${contextItems
              .map(
                (item) => `
              <li>${formatCausalBulletHTML(item.bullet)}</li>
            `,
              )
              .join('')}
          </ul>
        </div>
      `
          : ''
      }

      ${
        watchOut
          ? `
        <div style="background: rgba(244, 63, 94, 0.12); border: 1px solid rgba(251, 113, 133, 0.4); border-left: 4px solid #f43f5e; border-radius: 8px; padding: calc(8px * var(--srs-rp-scale, 1)) calc(13px * var(--srs-rp-scale, 1)); font-size: calc(0.84rem * var(--srs-rp-scale, 1)); color: #ffe4e6; line-height: 1.35;">
          <strong style="color: #fda4af; text-transform: uppercase; font-size: calc(0.68rem * var(--srs-rp-scale, 1)); letter-spacing: 0.05em; margin-right: 5px;"><i class="fa-solid fa-triangle-exclamation"></i> Watch Out:</strong>
          ${escHtml(watchOut)}
        </div>
      `
          : ''
      }
    </div>
  `;
}

/**
 * Swap ONLY the right-hand column (`#srs-pedagogy-dock`) between Visual Plate, Hints, Stems,
 * and Check Answers — leaving the left Narrative Card 100% frozen at 0.00px jump.
 */
function updatePedagogyDockInPlace() {
  const modal = document.getElementById('stage-reading-spotlight-modal');
  if (!modal) return;
  const dock = modal.querySelector('#srs-pedagogy-dock');
  const stages = activeLessonSpotlightState.stages;
  const stage = stages[activeLessonSpotlightState.currentIndex];
  if (!dock || !stage) return;

  const meta = activeLessonSpotlightState.meta || {};
  const bespokeEntry =
    resolveBespokeStageEntry(meta.unitId, meta.lessonId, meta.lessonIndex, stage.stageNum, stage) ||
    buildFallbackStageEntry(stage);

  const mode = activeLessonSpotlightState.pedagogyMode;
  dock.classList.toggle('is-visual-mode', mode === 'read');
  modal.querySelectorAll('[data-srs-mode]').forEach((pill) => {
    pill.classList.toggle('is-active', pill.getAttribute('data-srs-mode') === mode);
  });

  dock.innerHTML = renderRightPanelInnerHTML(stage, bespokeEntry);

  const toggleSingleHintChipInPlace = (chip) => {
    const k = chip.getAttribute('data-hint-peek');
    const grp = chip.getAttribute('data-hint-group');
    const idx = Number(chip.getAttribute('data-hint-idx'));
    if (!k || !grp || Number.isNaN(idx)) return;

    const list = grp === 'context' ? bespokeEntry.context || [] : bespokeEntry.passage || [];
    const item = list[idx];
    if (!item) return;

    const nextPeeked = !activeLessonSpotlightState.peekedHintIndices[k];
    activeLessonSpotlightState.peekedHintIndices[k] = nextPeeked;

    const icon = chip.querySelector('i');
    const lbl = chip.querySelector('.srs-hint-label');
    if (icon) {
      icon.className = nextPeeked
        ? 'fa-solid fa-check'
        : grp === 'context'
          ? 'fa-solid fa-plus'
          : 'fa-solid fa-magnifying-glass';
    }
    if (lbl) {
      lbl.innerHTML = nextPeeked ? formatCausalBulletHTML(item.bullet) : escHtml(item.hint);
    }

    const collapseBtn = dock.querySelector('#srs-btn-reset-hints');
    if (collapseBtn) {
      const anyPeeked = Object.values(activeLessonSpotlightState.peekedHintIndices).some(Boolean);
      collapseBtn.style.visibility = anyPeeked ? 'visible' : 'hidden';
    }
    const inner = dock.querySelector('.srs-dock-inner');
    if (inner) {
      const availH = Math.max(140, dock.clientHeight - 28);
      dock.style.overflowY = inner.scrollHeight > availH + 4 ? 'auto' : 'hidden';
    }
  };

  dock.querySelectorAll('[data-hint-peek]').forEach((chip) => {
    chip.onclick = () => toggleSingleHintChipInPlace(chip);
  });

  const collapseHintsBtn = dock.querySelector('#srs-btn-reset-hints');
  if (collapseHintsBtn) {
    collapseHintsBtn.onclick = () => {
      dock.querySelectorAll('[data-hint-peek]').forEach((chip) => {
        const k = chip.getAttribute('data-hint-peek');
        if (k && activeLessonSpotlightState.peekedHintIndices[k]) {
          toggleSingleHintChipInPlace(chip);
        }
      });
    };
  }
  autoFitPedagogyDock();
}

export function renderActiveSpotlightStage() {
  const modal = document.getElementById('stage-reading-spotlight-modal');
  if (!modal) return;

  const stages = activeLessonSpotlightState.stages;
  const idx = activeLessonSpotlightState.currentIndex;
  const stage = stages[idx];
  if (!stage) return;

  stopSpotlightSpeechIfActive();

  const liveChunk = document.getElementById(`para-${idx + 1}`);
  const liveStudioWrap = liveChunk ? liveChunk.closest('[data-studio-audio]') : null;
  const resolvedStudioAudio =
    (liveStudioWrap && liveStudioWrap.getAttribute('data-studio-audio')) ||
    stage.studioAudioUrl ||
    '';
  const resolvedVoiceLabel =
    (liveStudioWrap && liveStudioWrap.getAttribute('data-studio-voice-label')) ||
    stage.studioVoiceLabel ||
    'Studio Historian';

  const hasVisual = Boolean(stage.imageUrl);
  const showVisual = hasVisual && activeLessonSpotlightState.showVisualPlate;
  const scaleClass =
    activeLessonSpotlightState.fontScale && activeLessonSpotlightState.fontScale !== 'auto'
      ? `scale-${activeLessonSpotlightState.fontScale}`
      : 'scale-auto';
  const mode = activeLessonSpotlightState.pedagogyMode;
  const hlClass = activeLessonSpotlightState.highlightActive ? 'hl-mode-on' : '';
  const total = stages.length;
  const meta = activeLessonSpotlightState.meta || {};

  const bespokeEntry =
    resolveBespokeStageEntry(meta.unitId, meta.lessonId, meta.lessonIndex, stage.stageNum, stage) ||
    buildFallbackStageEntry(stage);

  const sanitizedStageHtmlProse = String(stage.htmlProse || '').replace(/\s+id="[^"]*"/gi, '');

  const headerClassroomToolsHtml = `
    <div style="display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap;">
      <button type="button" id="srs-btn-hl-toggle" style="background: ${activeLessonSpotlightState.highlightActive ? '#eab308' : 'rgba(255,255,255,0.08)'}; color: ${activeLessonSpotlightState.highlightActive ? '#0f172a' : '#e2e8f0'}; border: 1px solid ${activeLessonSpotlightState.highlightActive ? '#facc15' : 'rgba(255,255,255,0.2)'}; border-radius: 6px; padding: 4px 9px; font-size: 0.72rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;" title="Click any sentence in the passage to highlight evidence in yellow">
        <i class="fa-solid fa-highlighter"></i> <span>Tap Sentence to Highlight</span>
      </button>
      <button type="button" id="srs-btn-hl-reset" disabled style="min-width: 78px; justify-content: center; background: rgba(255,255,255,0.08); color: #fde047; border: 1px solid rgba(250, 204, 21, 0.35); border-radius: 6px; padding: 4px 8px; font-size: 0.72rem; font-weight: 800; cursor: default; opacity: 0.42; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;" title="Clear all yellow sentence highlights back to 0">
        <i class="fa-solid fa-rotate-left"></i> <span>Reset</span>
      </button>
      <button type="button" id="srs-btn-tps-timer" style="min-width: 142px; justify-content: center; background: rgba(16,185,129,0.18); color: #ecfdf5; border: 1px solid #34d399; border-radius: 6px; padding: 4px 9px; font-size: 0.72rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;" title="Start or stop 30-second Turn & Talk discussion countdown">
        <i class="fa-regular fa-clock"></i> <span id="srs-tps-timer-lbl">30s Turn &amp; Talk</span>
      </button>
    </div>
  `;

  modal.innerHTML = `
    <header class="srs-topbar">
      <div style="display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; min-width: 0; overflow: hidden; flex: 1 1 auto;">
        <span style="background: #0284c7; color: #ffffff; font-size: 0.72rem; font-weight: 900; padding: 3px 7px; border-radius: 5px; letter-spacing: 0.04em; text-transform: uppercase; white-space: nowrap; flex-shrink: 0;">
          Stage ${stage.stageNum} of ${total}
        </span>
        ${
          stage.date
            ? `<span style="background: rgba(245, 158, 11, 0.18); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24; font-size: 0.72rem; font-weight: 800; padding: 3px 7px; border-radius: 5px; white-space: nowrap; flex-shrink: 0;"><i class="fa-regular fa-clock"></i> ${escHtml(stage.date)}</span>`
            : ''
        }
        ${
          meta.textbookLabel
            ? `<button type="button" id="srs-btn-open-tb" style="font-size: 0.69rem; font-weight: 700; color: #7dd3fc; background: rgba(2, 132, 199, 0.18); border: 1px solid rgba(56, 189, 248, 0.35); padding: 2px 7px; border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: ${meta.tbLocator ? 'pointer' : 'default'};" title="Open 2-Page Flipbook Textbook at ${escHtml(meta.textbookLabel)}"><i class="fa-solid fa-book-open" style="font-size: 0.64rem; margin-right: 3px;"></i>${escHtml(meta.textbookLabel)}</button>`
            : ''
        }
      </div>

      <!-- Paper-First 4-Step Learning Switcher -->
      <div role="tablist" aria-label="Spotlight Classroom Step" style="display: inline-flex; align-items: center; background: rgba(0,0,0,0.42); border: 1px solid rgba(255,255,255,0.16); border-radius: 7px; padding: 2px; gap: 2px; flex-shrink: 0;">
        <button type="button" class="srs-mode-pill ${mode === 'read' ? 'is-active' : ''}" data-srs-mode="read" title="Pure reading view — Shortcut: 1">1. Read</button>
        <button type="button" class="srs-mode-pill ${mode === 'hints' ? 'is-active' : ''}" data-srs-mode="hints" title="Zero-spoiler retrieval prompts while writing — Shortcut: 2">2. Hints</button>
        <button type="button" class="srs-mode-pill ${mode === 'stems' ? 'is-active' : ''}" data-srs-mode="stems" title="Sentence starters for paper workbooks — Shortcut: 3">3. Stems</button>
        <button type="button" class="srs-mode-pill ${mode === 'answers' ? 'is-active' : ''}" data-srs-mode="answers" title="Green-pen bulleted answers &amp; wider context — Shortcut: 4"><i class="fa-solid fa-check-double" style="font-size: 0.66rem; margin-right: 3px;"></i>4. Check Answers</button>
      </div>

      <div style="display: flex; align-items: center; gap: 5px; flex-wrap: nowrap; flex-shrink: 0;">
        <button type="button" id="srs-btn-play-audio" style="min-width: 78px; justify-content: center; background: #f59e0b; color: #0f172a; border: none; border-radius: 6px; padding: 5px 9px; font-size: 0.74rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;">
          <i class="fa-solid fa-play"></i> <span>Listen</span>
        </button>
        <button type="button" id="srs-btn-stop-audio" disabled style="opacity: 0.32; background: #ef4444; color: #ffffff; border: none; border-radius: 6px; padding: 5px 7px; font-size: 0.74rem; font-weight: 800; cursor: default; display: inline-flex; align-items: center;" title="Stop Audio">
          <i class="fa-solid fa-stop"></i>
        </button>

        <div role="group" aria-label="Classroom Text Size" style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.16); border-radius: 6px; padding: 2px;">
          <button type="button" data-srs-scale="auto" style="background: ${activeLessonSpotlightState.fontScale === 'auto' ? '#0284c7' : 'transparent'}; color: #ffffff; border: none; border-radius: 4px; padding: 3px 6px; font-size: 0.69rem; font-weight: 800; cursor: pointer;" title="Auto-Fit Whole Stage on Board">FIT</button>
          <button type="button" data-srs-scale="sm" style="background: ${activeLessonSpotlightState.fontScale === 'sm' ? '#0284c7' : 'transparent'}; color: #ffffff; border: none; border-radius: 4px; padding: 3px 6px; font-size: 0.71rem; font-weight: 800; cursor: pointer;">A-</button>
          <button type="button" data-srs-scale="md" style="background: ${activeLessonSpotlightState.fontScale === 'md' ? '#0284c7' : 'transparent'}; color: #ffffff; border: none; border-radius: 4px; padding: 3px 6px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">A</button>
          <button type="button" data-srs-scale="lg" style="background: ${activeLessonSpotlightState.fontScale === 'lg' ? '#0284c7' : 'transparent'}; color: #ffffff; border: none; border-radius: 4px; padding: 3px 6px; font-size: 0.82rem; font-weight: 900; cursor: pointer;">A+</button>
        </div>

        <button type="button" id="srs-btn-prev" ${idx <= 0 ? 'disabled' : ''} style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); color: #ffffff; border-radius: 6px; padding: 5px 8px; font-size: 0.74rem; font-weight: 700; cursor: ${idx <= 0 ? 'not-allowed' : 'pointer'}; opacity: ${idx <= 0 ? '0.35' : '1'}; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;">
          <i class="fa-solid fa-arrow-left"></i> Prev
        </button>
        <button type="button" id="srs-btn-next" ${idx >= total - 1 ? 'disabled' : ''} style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); color: #ffffff; border-radius: 6px; padding: 5px 8px; font-size: 0.74rem; font-weight: 700; cursor: ${idx >= total - 1 ? 'not-allowed' : 'pointer'}; opacity: ${idx >= total - 1 ? '0.35' : '1'}; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;">
          Next <i class="fa-solid fa-arrow-right"></i>
        </button>

        <button type="button" id="srs-btn-close" style="background: rgba(239, 68, 68, 0.18); border: 1px solid rgba(248, 113, 113, 0.45); color: #fecaca; border-radius: 6px; padding: 5px 9px; font-size: 0.74rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;" title="Close Spotlight (Esc)">
          <span>Esc</span> <span style="font-size: 1rem; line-height: 1;">&times;</span>
        </button>
      </div>
    </header>

    ${
      stage.question || stage.title
        ? `
      <div class="srs-question-banner">
        <div style="display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1 1 320px;">
          <span style="font-size: 0.68rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; color: #38bdf8; background: rgba(2, 132, 199, 0.2); border: 1px solid rgba(56, 189, 248, 0.35); padding: 3px 8px; border-radius: 4px; flex-shrink: 0;">
            Guiding Question
          </span>
          <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.30rem; font-weight: 700; color: #ffffff; line-height: 1.26;">
            ${escHtml(stage.question || stage.title)}
          </div>
        </div>
        ${headerClassroomToolsHtml}
      </div>
    `
        : ''
    }

    <main class="srs-body">
      <div class="srs-grid">
        <div class="srs-prose-card ${scaleClass} ${hlClass}" id="srs-prose-card">
          ${
            stage.title && stage.question
              ? `<div style="font-family: 'Inter', sans-serif; font-size: 0.77rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #0369a1; margin-bottom: 9px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0;">Stage ${stage.stageNum} &bull; ${escHtml(stage.title)}</div>`
              : ''
          }
          <div class="srs-prose-content narrative-text" id="srs-prose-content">
            ${sanitizedStageHtmlProse}
          </div>
        </div>

        <aside class="srs-right-panel ${mode === 'read' ? 'is-visual-mode' : ''}" id="srs-pedagogy-dock">
          ${renderRightPanelInnerHTML(stage, bespokeEntry)}
        </aside>
      </div>
    </main>
  `;

  const proseEl = modal.querySelector('#srs-prose-content');
  if (proseEl) {
    enableInteractiveSentenceHighlighter(proseEl);
  }

  modal.querySelectorAll('[data-srs-mode]').forEach((pill) => {
    pill.onclick = () => {
      activeLessonSpotlightState.pedagogyMode = pill.getAttribute('data-srs-mode') || 'read';
      updatePedagogyDockInPlace();
    };
  });

  modal.querySelectorAll('[data-hint-peek]').forEach((chip) => {
    chip.onclick = () => {
      const k = chip.getAttribute('data-hint-peek');
      if (!k) return;
      activeLessonSpotlightState.peekedHintIndices[k] =
        !activeLessonSpotlightState.peekedHintIndices[k];
      updatePedagogyDockInPlace();
    };
  });

  const hlBtn = modal.querySelector('#srs-btn-hl-toggle');
  if (hlBtn) {
    hlBtn.onclick = () => {
      activeLessonSpotlightState.highlightActive = !activeLessonSpotlightState.highlightActive;
      const card = modal.querySelector('#srs-prose-card');
      if (card) card.classList.toggle('hl-mode-on', activeLessonSpotlightState.highlightActive);
      hlBtn.style.background = activeLessonSpotlightState.highlightActive
        ? '#eab308'
        : 'rgba(255,255,255,0.08)';
      hlBtn.style.color = activeLessonSpotlightState.highlightActive ? '#0f172a' : '#e2e8f0';
    };
  }

  const hlResetBtn = modal.querySelector('#srs-btn-hl-reset');
  if (hlResetBtn) {
    hlResetBtn.onclick = () => {
      modal.querySelectorAll('#srs-prose-content .srs-hl-sentence.is-highlighted').forEach((el) => {
        el.classList.remove('is-highlighted');
      });
      refreshHighlightResetButton();
    };
  }

  const visualToggleBtn = modal.querySelector('#srs-btn-visual-toggle');
  if (visualToggleBtn) {
    visualToggleBtn.onclick = () => {
      activeLessonSpotlightState.showVisualPlate = !activeLessonSpotlightState.showVisualPlate;
      const on = activeLessonSpotlightState.showVisualPlate;
      const grid = modal.querySelector('.srs-grid');
      const vCard = modal.querySelector('#srs-visual-card');
      if (grid) grid.classList.toggle('text-only', !on);
      if (vCard) vCard.style.display = on ? 'block' : 'none';
      visualToggleBtn.style.background = on
        ? 'rgba(56, 189, 248, 0.16)'
        : 'rgba(255,255,255,0.07)';
      visualToggleBtn.style.color = on ? '#bae6fd' : '#94a3b8';
      visualToggleBtn.style.borderColor = on
        ? 'rgba(56, 189, 248, 0.4)'
        : 'rgba(255,255,255,0.18)';
      visualToggleBtn.innerHTML = `<i class="fa-regular fa-image"></i> <span>${on ? 'Visual: On' : 'Visual: Off'}</span>`;
      autoFitSpotlightProse();
    };
  }

  const openTbBtn = modal.querySelector('#srs-btn-open-tb');
  if (openTbBtn && meta.tbLocator) {
    openTbBtn.onclick = () => {
      const loc = meta.tbLocator;
      if (modal._closeSpotlight) modal._closeSpotlight();
      if (typeof window.openDigitalTextbookReader === 'function') {
        window.openDigitalTextbookReader(loc.unitId, loc.ktId, loc.spreadIndex, loc.page);
      }
    };
  }

  // Wire Turn & Talk Timer strictly in place (NEVER re-renders modal or disturbs prose!)
  const tpsBtn = modal.querySelector('#srs-btn-tps-timer');
  if (tpsBtn) {
    tpsBtn.onclick = () => {
      if (
        activeLessonSpotlightState.timerRemaining > 0 ||
        activeLessonSpotlightState.timerFinishedFlash
      ) {
        clearTurnAndTalkTimer();
        updateTurnAndTalkButtonUI();
        return;
      }
      activeLessonSpotlightState.timerRemaining = 30;
      activeLessonSpotlightState.timerFinishedFlash = false;
      updateTurnAndTalkButtonUI();
      activeLessonSpotlightState.timerInterval = setInterval(() => {
        activeLessonSpotlightState.timerRemaining -= 1;
        if (activeLessonSpotlightState.timerRemaining <= 0) {
          if (activeLessonSpotlightState.timerInterval) {
            clearInterval(activeLessonSpotlightState.timerInterval);
            activeLessonSpotlightState.timerInterval = null;
          }
          activeLessonSpotlightState.timerRemaining = 0;
          activeLessonSpotlightState.timerFinishedFlash = true;
          updateTurnAndTalkButtonUI();
        } else {
          updateTurnAndTalkButtonUI();
        }
      }, 1000);
    };
  }

  const playBtn = modal.querySelector('#srs-btn-play-audio');
  const stopBtn = modal.querySelector('#srs-btn-stop-audio');
  if (playBtn && proseEl) {
    playBtn.onclick = () => toggleSpotlightAudioPlayback(resolvedStudioAudio, proseEl);
  }
  if (stopBtn) {
    stopBtn.onclick = () => {
      if (!stopBtn.disabled) stopSpotlightSpeechIfActive();
    };
  }

  modal.querySelectorAll('[data-srs-scale]').forEach((btn) => {
    btn.onclick = () => {
      const sc = btn.getAttribute('data-srs-scale') || 'auto';
      activeLessonSpotlightState.fontScale = sc;
      try {
        sessionStorage.setItem('hh_spotlight_font_scale', sc);
      } catch (e) {}
      const card = modal.querySelector('#srs-prose-card');
      if (card) {
        card.classList.remove('scale-auto', 'scale-sm', 'scale-md', 'scale-lg');
        card.classList.add(`scale-${sc}`);
      }
      modal.querySelectorAll('[data-srs-scale]').forEach((b) => {
        b.style.background = b.getAttribute('data-srs-scale') === sc ? '#0284c7' : 'transparent';
      });
      autoFitSpotlightProse();
    };
  });

  const advanceToStage = (nextIdx) => {
    dismissFloatingPopoversIfOpen();
    clearTurnAndTalkTimer();
    activeLessonSpotlightState.currentIndex = nextIdx;
    // Safeguard: always reset to pure Read mode so advancing never flashes Stage N+1 answers prematurely
    activeLessonSpotlightState.pedagogyMode = 'read';
    activeLessonSpotlightState.peekedHintIndices = {};
    renderActiveSpotlightStage();
  };

  const prevBtn = modal.querySelector('#srs-btn-prev');
  const nextBtn = modal.querySelector('#srs-btn-next');
  if (prevBtn) {
    prevBtn.onclick = () => {
      if (activeLessonSpotlightState.currentIndex > 0) {
        advanceToStage(activeLessonSpotlightState.currentIndex - 1);
      }
    };
  }
  if (nextBtn) {
    nextBtn.onclick = () => {
      if (activeLessonSpotlightState.currentIndex < stages.length - 1) {
        advanceToStage(activeLessonSpotlightState.currentIndex + 1);
      }
    };
  }

  const closeBtn = modal.querySelector('#srs-btn-close');
  if (closeBtn && modal._closeSpotlight) {
    closeBtn.onclick = modal._closeSpotlight;
  }

  // Fit synchronously before paint so there is zero 1-frame font jump on open or stage advance
  autoFitSpotlightProse();
  autoFitPedagogyDock();
}

export async function openStageReadingSpotlight(stageIndex = 0) {
  if (typeof document === 'undefined') return;
  const stages = activeLessonSpotlightState.stages || [];
  if (stages.length === 0) return;

  const meta = activeLessonSpotlightState.meta || {};
  if (meta.unitId) {
    await ensureUnitStageAnswersLoaded(meta.unitId);
  }

  activeLessonSpotlightState.currentIndex = Math.max(
    0,
    Math.min(stages.length - 1, Number(stageIndex) || 0),
  );
  activeLessonSpotlightState.pedagogyMode = 'read';
  activeLessonSpotlightState.peekedHintIndices = {};

  const existing = document.getElementById('stage-reading-spotlight-modal');
  if (existing) existing.remove();

  const prevOverflow = document.body.style.overflow || '';
  document.body.style.overflow = 'hidden';

  const modal = document.createElement('div');
  modal.id = 'stage-reading-spotlight-modal';
  modal.className = 'no-print';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Classroom Stage Reading Spotlight');

  const onResize = () => {
    autoFitSpotlightProse();
    autoFitPedagogyDock();
  };

  const closeSpotlight = () => {
    dismissFloatingPopoversIfOpen();
    clearTurnAndTalkTimer();
    stopSpotlightSpeechIfActive();
    document.removeEventListener('keydown', onKeyDown, true);
    window.removeEventListener('resize', onResize);
    document.body.style.overflow = prevOverflow;
    modal.remove();
  };

  const onKeyDown = (e) => {
    if (!document.getElementById('stage-reading-spotlight-modal')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (dismissFloatingPopoversIfOpen()) {
        return; // First Esc closes open vocab/dossier popover rather than killing Spotlight
      }
      closeSpotlight();
    } else if (e.key === 'ArrowRight') {
      if (activeLessonSpotlightState.currentIndex < stages.length - 1) {
        e.preventDefault();
        dismissFloatingPopoversIfOpen();
        clearTurnAndTalkTimer();
        activeLessonSpotlightState.currentIndex += 1;
        activeLessonSpotlightState.pedagogyMode = 'read';
        activeLessonSpotlightState.peekedHintIndices = {};
        renderActiveSpotlightStage();
      }
    } else if (e.key === 'ArrowLeft') {
      if (activeLessonSpotlightState.currentIndex > 0) {
        e.preventDefault();
        dismissFloatingPopoversIfOpen();
        clearTurnAndTalkTimer();
        activeLessonSpotlightState.currentIndex -= 1;
        activeLessonSpotlightState.pedagogyMode = 'read';
        activeLessonSpotlightState.peekedHintIndices = {};
        renderActiveSpotlightStage();
      }
    } else if (e.key === '1') {
      activeLessonSpotlightState.pedagogyMode = 'read';
      updatePedagogyDockInPlace();
    } else if (e.key === '2') {
      activeLessonSpotlightState.pedagogyMode = 'hints';
      updatePedagogyDockInPlace();
    } else if (e.key === '3') {
      activeLessonSpotlightState.pedagogyMode = 'stems';
      updatePedagogyDockInPlace();
    } else if (e.key === '4') {
      activeLessonSpotlightState.pedagogyMode = 'answers';
      updatePedagogyDockInPlace();
    }
  };

  modal._closeSpotlight = closeSpotlight;
  document.addEventListener('keydown', onKeyDown, true);
  window.addEventListener('resize', onResize);
  document.body.appendChild(modal);
  renderActiveSpotlightStage();
}

if (typeof window !== 'undefined') {
  window.openStageReadingSpotlight = openStageReadingSpotlight;
  if (!window.openDigitalTextbookReader) {
    window.openDigitalTextbookReader = openDigitalTextbookReader;
  }
}
