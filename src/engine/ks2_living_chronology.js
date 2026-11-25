/**
 * src/engine/ks2_living_chronology.js
 *
 * CME-Standard Dual-Mode Interactive Living Chronology Engine for all 8 Key Stage 2 Units.
 * Preserves 100% of each KS2 unit's primary-calibrated narrative (`story`, `significance`,
 * `childrenLife`, `quote`, `detectiveQuestion`, `detectiveAnswer`) while adding:
 *  1. Labelled Horizontal Milestone Highway Cards (`#1 c.450 BC · Celtic Hillforts`) + Range Scrubber
 *  2. Dual View Modes: `🧭 Explorer View` + `🗂️ All Milestones Grid` (matching CME!)
 *  3. 16px Live Search (`🔍 Find event, person, date...`) + Thematic Filter Pills
 *  4. Tap-to-Zoom Full-Screen Museum Lightbox on every archival photograph
 *  5. `📖 Open Enquiry Lesson` SPA jump (with `← Back to Living Timeline` memory) + Staff/Desktop PDFs
 *  6. `🙈 Recall All` Active-Testing Mode + `🖨️ Print Timeline` (Completed or Recall Sheet)
 *  7. Full Mobile `390px` Cold-Stranger Pupil Ergonomics & `[data-theme="space"]` Dark Mode.
 */

import { openTimelinePrintModal } from './timeline_print_helper.js';

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function deriveShortRailTitle(title) {
  const clean = String(title || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= 34) return clean;

  // 1. Natural major clause delimiters (: — –)
  for (const sep of [':', ' — ', ' – ']) {
    if (clean.includes(sep)) {
      const [left, right] = clean.split(sep).map((s) => s.trim());
      if (left.length >= 11 && left.length <= 34) return left;
      if (right && right.length >= 11 && right.length <= 34) return right;
    }
  }

  // 2. Clean verb/preposition phrase boundaries before secondary clauses
  for (const phrase of [
    ' Taken Away',
    ' Across the ',
    ' Inside ',
    ' Near ',
    ' With ',
    ' with ',
    ' vs. ',
    ' at ',
    ' on ',
    ' Cross ',
    ' Conquers ',
    ' Unite ',
  ]) {
    const idx = clean.indexOf(phrase);
    if (idx >= 14 && idx <= 34) {
      return clean.slice(0, idx).trim().replace(/,$/, '');
    }
  }

  // 3. Ampersand split when left side is a self-standing phrase (not mid 3-item comma list)
  if (clean.includes(' & ')) {
    const left = clean.split(' & ')[0].trim();
    if (!left.includes(',') && left.length >= 15 && left.length <= 34) {
      return left;
    }
  }

  // 4. Comma-separated noun clauses
  if (clean.includes(', ')) {
    const parts = clean.split(', ');
    const p0 = parts[0].trim();
    const p01 = `${parts[0]}, ${parts[1].split(' & ')[0]}`.trim();
    if (p01.length <= 34 && !/\b(\d+|The|A|An)$/i.test(p01)) return p01;
    if (p0.length >= 15 && p0.length <= 34) return p0;
  }

  // 5. Word-boundary fallback stripping trailing connectors, prepositions, articles, or bare numbers
  const STOP_TAIL = new Set([
    '&',
    'and',
    'or',
    'the',
    'a',
    'an',
    'of',
    'in',
    'on',
    'at',
    'to',
    'for',
    'from',
    'with',
    'near',
    'into',
    'across',
    'inside',
    'vs.',
    'vs',
    'by',
    'like',
    'around',
  ]);
  const words = clean.split(' ');
  const kept = [];
  for (const w of words) {
    const next = kept.length ? `${kept.join(' ')} ${w}` : w;
    if (next.length <= 34) {
      kept.push(w);
    } else {
      break;
    }
  }
  while (kept.length > 2) {
    const last = kept[kept.length - 1].replace(/[,:;—–]+$/, '');
    if (STOP_TAIL.has(last.toLowerCase()) || /^\d+(\.\d+)?$/.test(last)) {
      kept.pop();
    } else {
      kept[kept.length - 1] = last;
      break;
    }
  }
  return kept.join(' ');
}

function parseEnquiryLessonIndex(refTextbook = '', fallbackIdx = 0) {
  const m = String(refTextbook || '').match(/Enquiry\s*(\d+)/i);
  if (m) {
    return Math.max(0, parseInt(m[1], 10) - 1);
  }
  return fallbackIdx;
}

export function renderKs2LivingChronology(
  container,
  {
    unitId,
    title,
    subtitle,
    heroGradient = 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)',
    accentColor = '#2563eb',
    textbookUrl = '',
    textbookLabel = 'Classroom Textbook',
    filters = [],
    milestones = [],
  } = {},
) {
  const mountEl =
    container || (typeof document !== 'undefined' ? document.getElementById('main-content') : null);
  if (!mountEl) return;

  if (typeof window !== 'undefined') {
    if (window._ks2LivingKeyHandler) {
      window.removeEventListener('keydown', window._ks2LivingKeyHandler);
      window._ks2LivingKeyHandler = null;
    }
    if (window._ks2LivingTourTimer) {
      clearInterval(window._ks2LivingTourTimer);
      window._ks2LivingTourTimer = null;
    }
  }

  const enriched = milestones.map((m, idx) => {
    const shortTitle = deriveShortRailTitle(m.title);
    const lessonIndex =
      typeof m.lessonIndex === 'number'
        ? m.lessonIndex
        : parseEnquiryLessonIndex(m.refTextbook, Math.min(5, Math.floor(idx / 2)));
    const enquiryNum = lessonIndex + 1;
    const resolvedTextbookUrl = m.textbookUrl || textbookUrl || `/units/${unitId}/textbook.html`;
    const searchHaystack = [
      m.year,
      m.month,
      m.title,
      m.categoryLabel,
      m.story,
      m.significance,
      m.childrenLife,
      m.quote,
      m.detectiveQuestion,
      m.detectiveAnswer,
    ]
      .join(' ')
      .toLowerCase();

    return {
      ...m,
      globalIdx: idx,
      num: idx + 1,
      shortTitle,
      lessonIndex,
      enquiryNum,
      resolvedTextbookUrl,
      searchHaystack,
    };
  });

  let activeGlobalIdx = 0;
  if (typeof window !== 'undefined' && typeof window._cmeRestoreMilestoneIdx === 'number') {
    activeGlobalIdx = Math.max(0, Math.min(enriched.length - 1, window._cmeRestoreMilestoneIdx));
    window._cmeRestoreMilestoneIdx = null;
  }
  if (typeof window !== 'undefined') {
    window._cmeActiveMilestoneIdx = activeGlobalIdx;
  }

  let viewMode = 'explorer'; // 'explorer' | 'grid'
  let activeFilter = 'all';
  let searchQuery = '';
  let isPlaying = false;
  let recallAll = false;
  const revealedDetectiveIds = new Set();
  const revealedWhyIds = new Set();

  function getFiltered() {
    const q = searchQuery.trim().toLowerCase();
    return enriched.filter((m) => {
      if (activeFilter !== 'all' && m.category !== activeFilter) return false;
      if (q && !m.searchHaystack.includes(q)) return false;
      return true;
    });
  }

  function ensureSelection(filtered) {
    if (filtered.length === 0) return -1;
    const pos = filtered.findIndex((m) => m.globalIdx === activeGlobalIdx);
    if (pos !== -1) return pos;
    activeGlobalIdx = filtered[0].globalIdx;
    if (typeof window !== 'undefined') window._cmeActiveMilestoneIdx = activeGlobalIdx;
    return 0;
  }

  function stopTour() {
    if (typeof window !== 'undefined' && window._ks2LivingTourTimer) {
      clearInterval(window._ks2LivingTourTimer);
      window._ks2LivingTourTimer = null;
    }
    isPlaying = false;
  }

  function jumpToEnquiryLesson(lessonIdx, globalIdx) {
    stopTour();
    if (typeof window === 'undefined') return;
    window._cmeActiveMilestoneIdx = globalIdx;
    const originPayload = {
      view: 'timeline',
      unitId,
      timelineMilestoneIdx: globalIdx,
      shortLabel: 'Living Timeline',
      scrollY: window.scrollY || 0,
    };
    window.saveUnitReturnOrigin?.(originPayload);
    if (typeof window.switchView === 'function') {
      Promise.resolve(
        window.switchView('lessons', unitId, false, { lessonIndex: lessonIdx }),
      ).then(() => {
        setTimeout(() => {
          if (window.currentLessonIndex !== lessonIdx && typeof window.renderLessonByIndex === 'function') {
            window.renderLessonByIndex(lessonIdx, false);
          }
          window.updateHeaderBackBtn?.('lessons');
        }, 35);
      });
    }
  }

  mountEl.innerHTML = `
    <style>
      .ks2-lc-root { max-width: 1280px; margin: 0 auto; padding: 8px 16px 56px; font-family: 'Inter', 'Outfit', system-ui, sans-serif; color: #0f172a; }
      .ks2-lc-root *, .ks2-lc-root *::before, .ks2-lc-root *::after { box-sizing: border-box; }
      .ks2-lc-hero {
        background: ${heroGradient};
        border-radius: 14px; padding: 18px 22px; color: #ffffff;
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.22); margin-bottom: 12px;
        display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;
      }
      .ks2-lc-badge {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(255, 255, 255, 0.16); border: 1px solid rgba(255, 255, 255, 0.32);
        color: #fef08a; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;
        letter-spacing: 0.06em; padding: 3px 10px; border-radius: 999px; margin-bottom: 6px;
      }
      .ks2-lc-hero h1 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.2rem, 2vw, 1.52rem); font-weight: 800; margin: 0 0 4px 0; color: #fff; }
      .ks2-lc-sub { font-size: 0.84rem; color: rgba(255,255,255,0.9); max-width: 680px; line-height: 1.42; margin: 0; }
      .ks2-lc-hdr-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .ks2-lc-seg { display: inline-flex; background: rgba(15,23,42,0.45); border: 1px solid rgba(255,255,255,0.28); border-radius: 8px; padding: 3px; gap: 3px; }
      .ks2-lc-seg-btn {
        background: transparent; color: #e2e8f0; border: none; border-radius: 6px;
        padding: 6px 11px; font-size: 0.77rem; font-weight: 800; cursor: pointer; white-space: nowrap;
      }
      .ks2-lc-seg-btn.active { background: #fbbf24; color: #0f172a; }
      .ks2-lc-hdr-btn {
        background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.34);
        border-radius: 8px; padding: 7px 12px; font-size: 0.77rem; font-weight: 800; cursor: pointer;
        display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
      }
      .ks2-lc-hdr-btn.active-toggle { background: #fde68a; color: #78350f; border-color: #fbbf24; }
      .ks2-lc-filter-bar {
        background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 10px 14px;
        margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;
      }
      .ks2-lc-chips { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; flex: 1 1 auto; }
      .ks2-lc-chip {
        background: #f8fafc; border: 1.5px solid #cbd5e1; color: #334155;
        padding: 6px 12px; border-radius: 999px; font-size: 0.76rem; font-weight: 700; cursor: pointer;
      }
      .ks2-lc-chip.active { background: ${accentColor}; border-color: ${accentColor}; color: #ffffff; }
      .ks2-lc-search { position: relative; flex: 0 1 265px; min-width: 210px; }
      .ks2-lc-search i { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 0.76rem; color: #64748b; pointer-events: none; }
      .ks2-lc-search input {
        width: 100%; padding: 6px 26px 6px 30px; border: 1.5px solid #cbd5e1; border-radius: 999px;
        font-size: 0.8rem; background: #f8fafc; color: #0f172a; outline: none;
      }
      @media (max-width: 932px) {
        .ks2-lc-search input { font-size: 16px; }
      }
      .ks2-lc-highway {
        background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 12px 16px;
        margin-bottom: 14px; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
      }
      .ks2-lc-hw-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
      .ks2-lc-hw-lbl { font-size: 0.76rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #1e293b; display: inline-flex; align-items: center; gap: 7px; }
      .ks2-lc-rail {
        display: flex; align-items: stretch; gap: 8px; overflow-x: auto; padding: 12px 4px 6px;
        scrollbar-width: none; -ms-overflow-style: none;
      }
      .ks2-lc-rail::-webkit-scrollbar { display: none; }
      .ks2-lc-rail-node {
        position: relative; flex: 0 0 auto; width: 182px; background: #f8fafc;
        border: 1.5px solid #e2e8f0; border-top: 3.5px solid var(--node-col, ${accentColor});
        border-radius: 8px; padding: 7px 10px 8px; text-align: left; cursor: pointer;
        display: flex; flex-direction: column; gap: 2px; transition: all 0.16s ease;
      }
      .ks2-lc-rail-node::before {
        content: ''; position: absolute; top: -9px; left: -6px; right: -6px; height: 2px; background: #cbd5e1; z-index: 1;
      }
      .ks2-lc-rail-node:first-child::before { left: 50%; }
      .ks2-lc-rail-node:last-child::before { right: 50%; }
      .ks2-lc-rail-dot {
        position: absolute; top: -13px; left: 50%; transform: translateX(-50%);
        width: 10px; height: 10px; border-radius: 50%; background: var(--node-col, ${accentColor});
        border: 2px solid #fff; box-shadow: 0 1px 3px rgba(15,23,42,0.25); z-index: 2;
      }
      .ks2-lc-rail-node.active {
        background: #eff6ff; border-color: var(--node-col, ${accentColor});
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
      }
      .ks2-lc-rail-node.active .ks2-lc-rail-dot { transform: translateX(-50%) scale(1.38); box-shadow: 0 0 0 3px rgba(245,158,11,0.4); }
      .ks2-lc-rail-meta { font-size: 0.67rem; font-weight: 800; color: var(--node-col, ${accentColor}); white-space: nowrap; }
      .ks2-lc-rail-title { font-size: 0.74rem; font-weight: 700; color: #1e293b; line-height: 1.25; min-height: 2.4em; }
      .ks2-lc-scrubber { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
      .ks2-lc-scrubber span { font-size: 0.68rem; font-weight: 800; color: #64748b; white-space: nowrap; }
      .ks2-lc-scrubber input[type="range"] { flex: 1; height: 6px; accent-color: ${accentColor}; cursor: pointer; }
      .ks2-lc-step-btn {
        background: #f8fafc; border: 1.5px solid #cbd5e1; color: #0f172a; border-radius: 6px;
        padding: 5px 11px; font-size: 0.76rem; font-weight: 800; cursor: pointer;
      }
      .ks2-lc-step-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      .ks2-lc-stage {
        background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 14px; overflow: hidden;
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08); display: grid; grid-template-columns: minmax(340px, 42%) 1fr;
      }
      @media (max-width: 960px) { .ks2-lc-stage { grid-template-columns: 1fr; } }
      .ks2-lc-left { background: #0b1120; display: flex; flex-direction: column; justify-content: space-between; border-right: 1.5px solid #cbd5e1; }
      .ks2-lc-mat {
        flex: 1; min-height: 300px; max-height: 410px; padding: 14px; display: flex; align-items: center; justify-content: center;
        background: radial-gradient(circle at center, #1e293b 0%, #090d16 100%); position: relative; cursor: zoom-in;
      }
      .ks2-lc-mat img { max-width: 100%; max-height: 365px; object-fit: contain; border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,0.45); }
      .ks2-lc-zoom-pill {
        position: absolute; bottom: 10px; right: 12px; background: rgba(15,23,42,0.84);
        border: 1px solid rgba(255,255,255,0.22); color: #fff; font-size: 0.7rem; font-weight: 700;
        padding: 4px 9px; border-radius: 999px; pointer-events: none;
      }
      .ks2-lc-cap { padding: 12px 16px; background: #111827; color: #e2e8f0; font-size: 0.8rem; line-height: 1.42; border-top: 1px solid rgba(255,255,255,0.12); }
      .ks2-lc-prov { font-size: 0.68rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-top: 5px; }
      .ks2-lc-right { padding: 20px 24px; background: #fdfbf7; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; }
      .ks2-lc-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.25rem, 1.9vw, 1.5rem); font-weight: 800; color: #0f172a; margin: 6px 0 8px; line-height: 1.25; }
      .ks2-lc-story { font-size: 0.92rem; line-height: 1.55; color: #1e293b; margin: 0 0 12px; }
      .ks2-lc-callouts { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; margin-bottom: 12px; }
      @media (max-width: 640px) { .ks2-lc-callouts { grid-template-columns: 1fr; } }
      .ks2-lc-callout { background: #fff; border: 1px solid #e2e8f0; border-left: 4px solid ${accentColor}; border-radius: 8px; padding: 10px 12px; }
      .ks2-lc-callout-hd { font-size: 0.71rem; font-weight: 800; text-transform: uppercase; color: ${accentColor}; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center; }
      .ks2-lc-callout-txt { font-size: 0.83rem; line-height: 1.44; color: #1e293b; }
      .ks2-lc-blurred { filter: blur(5.5px); user-select: none; cursor: pointer; transition: filter 0.18s ease; }
      .ks2-lc-quote { background: #fffbeb; border: 1px dashed #f59e0b; border-radius: 8px; padding: 9px 13px; font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 0.86rem; color: #78350f; margin-bottom: 12px; }
      .ks2-lc-detective { background: #fefce8; border: 1.5px solid #fde047; border-left: 4px solid #ca8a04; border-radius: 8px; padding: 10px 13px; }
      .ks2-lc-foot { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; border-top: 1px solid #e2e8f0; padding-top: 12px; }
      .ks2-lc-study-btn {
        background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); color: #fff; border: none;
        border-radius: 8px; padding: 7px 13px; font-size: 0.8rem; font-weight: 800; cursor: pointer;
        display: inline-flex; align-items: center; gap: 6px;
      }
      .ks2-lc-doc-link {
        background: #fff; border: 1.5px solid #cbd5e1; color: #334155; border-radius: 7px;
        padding: 6px 11px; font-size: 0.76rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;
      }
      /* Hide printable PDF/worksheet links on cold-stranger mobile pupil view */
      body.hh-mobile-pupil-mode:not(.staff-mode-active) .ks2-lc-staff-doc { display: none !important; }
      .ks2-lc-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
      @media (max-width: 840px) { .ks2-lc-grid { grid-template-columns: 1fr; } }
      .ks2-lc-gcard { background: #fff; border: 1.5px solid #cbd5e1; border-top: 4px solid var(--node-col, ${accentColor}); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
      .ks2-lc-gthumb { height: 185px; background: #0f172a; padding: 10px; display: flex; align-items: center; justify-content: center; cursor: zoom-in; position: relative; }
      .ks2-lc-gthumb img { max-width: 100%; max-height: 100%; object-fit: contain; }
      .ks2-lc-lightbox { position: fixed; inset: 0; z-index: 10020; background: rgba(9,13,22,0.88); display: none; align-items: center; justify-content: center; padding: 20px; }
      .ks2-lc-lightbox.open { display: flex; }
      [data-theme='space'] .ks2-lc-filter-bar,
      [data-theme='space'] .ks2-lc-highway,
      [data-theme='space'] .ks2-lc-stage,
      [data-theme='space'] .ks2-lc-gcard { background: #1e293b; border-color: #334155; color: #f8fafc; }
      [data-theme='space'] .ks2-lc-right { background: #152033; color: #f8fafc; }
      [data-theme='space'] .ks2-lc-title,
      [data-theme='space'] .ks2-lc-hw-lbl,
      [data-theme='space'] .ks2-lc-rail-title { color: #f8fafc; }
      [data-theme='space'] .ks2-lc-story,
      [data-theme='space'] .ks2-lc-callout-txt { color: #e2e8f0; }
      [data-theme='space'] .ks2-lc-callout,
      [data-theme='space'] .ks2-lc-rail-node { background: #0f172a; border-color: #334155; }
    </style>

    <div class="ks2-lc-root" id="ks2-lc-root">
      <header class="ks2-lc-hero">
        <div>
          <span class="ks2-lc-badge"><i class="fa-solid fa-compass"></i> Key Stage 2 Living Chronology &bull; ${enriched.length} Turning Points</span>
          <h1>${escapeHtml(title)}</h1>
          <p class="ks2-lc-sub">${escapeHtml(subtitle)}</p>
        </div>
        <div class="ks2-lc-hdr-controls">
          <div class="ks2-lc-seg" role="tablist" aria-label="Timeline view mode">
            <button type="button" class="ks2-lc-seg-btn active" data-ks2-mode="explorer">🧭 Explorer</button>
            <button type="button" class="ks2-lc-seg-btn" data-ks2-mode="grid">🗂️ All ${enriched.length} Grid</button>
          </div>
          <button type="button" class="ks2-lc-hdr-btn" id="ks2-lc-recall-btn" title="Blur 'Why It Mattered' to test your memory!">🙈 Recall Test</button>
          <button type="button" class="ks2-lc-hdr-btn" id="ks2-lc-tour-btn">▶ Classroom Tour</button>
          <button type="button" class="ks2-lc-hdr-btn ks2-lc-staff-doc" id="ks2-lc-print-btn">🖨️ Print</button>
        </div>
      </header>

      <div class="ks2-lc-filter-bar">
        <div class="ks2-lc-chips" id="ks2-lc-chips">
          ${filters
            .map(
              (f) => `
              <button type="button" class="ks2-lc-chip ${f.id === 'all' ? 'active' : ''}" data-ks2-filter="${escapeHtml(f.id)}">
                ${escapeHtml(f.label)}
              </button>
            `,
            )
            .join('')}
        </div>
        <div class="ks2-lc-search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="search" id="ks2-lc-search-input" placeholder="Find event, person, date..." aria-label="Search milestones" />
        </div>
      </div>

      <div id="ks2-lc-stage-slot"></div>

      <div class="ks2-lc-lightbox" id="ks2-lc-lightbox" role="dialog" aria-modal="true">
        <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.2);border-radius:12px;max-width:980px;width:100%;max-height:92vh;display:flex;flex-direction:column;overflow:hidden;">
          <div style="padding:12px 16px;background:#1e293b;color:#fff;display:flex;justify-content:space-between;align-items:center;">
            <strong id="ks2-lc-lb-title"></strong>
            <button type="button" id="ks2-lc-lb-close" style="background:rgba(255,255,255,0.14);border:none;color:#fff;border-radius:6px;padding:4px 10px;cursor:pointer;font-weight:800;">&times; Close</button>
          </div>
          <div style="padding:14px;background:#050811;display:flex;align-items:center;justify-content:center;max-height:72vh;">
            <img id="ks2-lc-lb-img" src="" alt="" style="max-width:100%;max-height:68vh;object-fit:contain;" />
          </div>
          <div id="ks2-lc-lb-cap" style="padding:11px 16px;background:#111827;color:#e2e8f0;font-size:0.84rem;"></div>
        </div>
      </div>
    </div>
  `;

  const root = mountEl.querySelector('#ks2-lc-root');
  const stageSlot = root.querySelector('#ks2-lc-stage-slot');
  const searchInput = root.querySelector('#ks2-lc-search-input');
  const lbEl = root.querySelector('#ks2-lc-lightbox');

  function openLightbox(gIdx) {
    const m = enriched[gIdx];
    if (!m || !lbEl) return;
    root.querySelector('#ks2-lc-lb-title').textContent = `${m.year} — ${m.title}`;
    const img = root.querySelector('#ks2-lc-lb-img');
    img.src = m.image;
    img.alt = m.title;
    root.querySelector('#ks2-lc-lb-cap').textContent = `${m.imageCaption || ''} (${m.provenance || ''})`;
    lbEl.classList.add('open');
  }

  function renderBody(smoothRail = true) {
    root.querySelectorAll('[data-ks2-mode]').forEach((b) =>
      b.classList.toggle('active', b.getAttribute('data-ks2-mode') === viewMode),
    );
    root.querySelectorAll('[data-ks2-filter]').forEach((b) =>
      b.classList.toggle('active', b.getAttribute('data-ks2-filter') === activeFilter),
    );
    const tourBtn = root.querySelector('#ks2-lc-tour-btn');
    if (tourBtn) {
      tourBtn.textContent = isPlaying ? '⏸ Pause Tour' : '▶ Classroom Tour';
      tourBtn.classList.toggle('active-toggle', isPlaying);
    }
    const recallBtn = root.querySelector('#ks2-lc-recall-btn');
    if (recallBtn) {
      recallBtn.textContent = recallAll ? '🙈 Recall ON' : '🙈 Recall Test';
      recallBtn.classList.toggle('active-toggle', recallAll);
    }

    const filtered = getFiltered();
    if (filtered.length === 0) {
      stageSlot.innerHTML = `
        <div style="background:#fff;border:1.5px dashed #cbd5e1;border-radius:12px;padding:32px;text-align:center;">
          <p style="font-weight:700;margin:0 0 10px;">No milestones matched "${escapeHtml(searchQuery)}".</p>
          <button type="button" class="ks2-lc-study-btn" data-ks2-act="reset">Show All ${enriched.length} Milestones</button>
        </div>
      `;
      return;
    }

    const pos = ensureSelection(filtered);
    if (viewMode === 'grid') {
      stageSlot.innerHTML = `
        <div class="ks2-lc-grid">
          ${filtered
            .map(
              (m) => `
              <article class="ks2-lc-gcard" style="--node-col:${escapeHtml(m.badgeColor || accentColor)};">
                <div style="padding:12px 15px 8px;">
                  <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:5px;">
                    <span style="background:${escapeHtml(m.badgeColor || accentColor)};color:#fff;font-size:0.68rem;font-weight:800;padding:3px 8px;border-radius:4px;">#${m.num} &bull; ${escapeHtml(m.year)}</span>
                    <span style="font-size:0.72rem;font-weight:700;color:#64748b;">${escapeHtml(m.refTextbook || '')}</span>
                  </div>
                  <h3 style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:1.05rem;font-weight:800;">${escapeHtml(m.title)}</h3>
                </div>
                <div class="ks2-lc-gthumb" data-ks2-act="zoom" data-gidx="${m.globalIdx}">
                  <img src="${escapeHtml(m.image)}" alt="${escapeHtml(m.title)}" loading="lazy" />
                  <span class="ks2-lc-zoom-pill"><i class="fa-solid fa-magnifying-glass-plus"></i> Zoom</span>
                </div>
                <div style="padding:12px 15px;display:flex;flex-direction:column;gap:8px;flex:1;">
                  <p style="margin:0;font-size:0.82rem;line-height:1.45;">${escapeHtml(m.story)}</p>
                  <div style="background:#f8fafc;border-left:3px solid ${escapeHtml(m.badgeColor || accentColor)};padding:7px 10px;border-radius:5px;font-size:0.79rem;">
                    <strong>Why It Mattered:</strong>
                    <span class="${recallAll && !revealedWhyIds.has(m.id) ? 'ks2-lc-blurred' : ''}" data-ks2-act="reveal-why" data-mid="${escapeHtml(m.id)}">${escapeHtml(m.significance)}</span>
                  </div>
                </div>
                <div style="padding:10px 15px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                  <button type="button" class="ks2-lc-step-btn" data-ks2-act="inspect" data-gidx="${m.globalIdx}">🧭 Inspect on Highway</button>
                  <button type="button" class="ks2-lc-study-btn" style="padding:5px 11px;font-size:0.75rem;" data-ks2-act="lesson" data-lidx="${m.lessonIndex}" data-gidx="${m.globalIdx}">📖 Enquiry ${m.enquiryNum} &rarr;</button>
                </div>
              </article>
            `,
            )
            .join('')}
        </div>
      `;
      return;
    }

    const cur = filtered[pos];
    const firstBound = filtered[0]?.year || '';
    const lastBound = filtered[filtered.length - 1]?.year || '';
    const detShown = revealedDetectiveIds.has(cur.id);
    const whyBlurred = recallAll && !revealedWhyIds.has(cur.id);

    stageSlot.innerHTML = `
      <section class="ks2-lc-highway">
        <div class="ks2-lc-hw-top">
          <div class="ks2-lc-hw-lbl">
            <i class="fa-solid fa-route" style="color:${accentColor};"></i>
            <span>Milestone Highway (${escapeHtml(firstBound)} &rarr; ${escapeHtml(lastBound)})</span>
          </div>
          <div style="display:inline-flex;align-items:center;gap:8px;">
            <button type="button" class="ks2-lc-step-btn" data-ks2-act="prev" ${pos <= 0 ? 'disabled' : ''}>&larr; Prev</button>
            <span style="font-size:0.76rem;font-weight:800;padding:4px 9px;background:#f1f5f9;border-radius:6px;color:#334155;">Milestone ${pos + 1} of ${filtered.length}</span>
            <button type="button" class="ks2-lc-step-btn" data-ks2-act="next" ${pos >= filtered.length - 1 ? 'disabled' : ''}>Next &rarr;</button>
          </div>
        </div>

        <div class="ks2-lc-rail" id="ks2-lc-rail">
          ${filtered
            .map(
              (item, idx) => `
              <button type="button" class="ks2-lc-rail-node ${idx === pos ? 'active' : ''}" data-ks2-act="pick" data-gidx="${item.globalIdx}" style="--node-col:${escapeHtml(item.badgeColor || accentColor)};">
                <span class="ks2-lc-rail-dot"></span>
                <span class="ks2-lc-rail-meta">#${item.num} &bull; ${escapeHtml(item.year)}</span>
                <span class="ks2-lc-rail-title">${escapeHtml(item.shortTitle)}</span>
              </button>
            `,
            )
            .join('')}
        </div>

        <div class="ks2-lc-scrubber">
          <span>${escapeHtml(firstBound)}</span>
          <input type="range" id="ks2-lc-range" min="0" max="${Math.max(0, filtered.length - 1)}" value="${pos}" step="1" aria-label="Milestone slider" />
          <span>${escapeHtml(lastBound)}</span>
        </div>
      </section>

      <article class="ks2-lc-stage">
        <div class="ks2-lc-left">
          <div class="ks2-lc-mat" data-ks2-act="zoom" data-gidx="${cur.globalIdx}">
            <img src="${escapeHtml(cur.image)}" alt="${escapeHtml(cur.title)}" />
            <span class="ks2-lc-zoom-pill"><i class="fa-solid fa-magnifying-glass-plus"></i> Tap to Zoom</span>
          </div>
          <div class="ks2-lc-cap">
            <div>${escapeHtml(cur.imageCaption)}</div>
            <div class="ks2-lc-prov"><i class="fa-solid fa-building-columns"></i> ${escapeHtml(cur.provenance || 'Archival Collection')}</div>
          </div>
        </div>

        <div class="ks2-lc-right">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
              <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;">
                <span style="background:${escapeHtml(cur.badgeColor || accentColor)};color:#fff;font-size:0.74rem;font-weight:800;padding:4px 10px;border-radius:5px;text-transform:uppercase;">${escapeHtml(cur.month || cur.year)}</span>
                ${cur.categoryLabel ? `<span style="background:#f1f5f9;border:1px solid #cbd5e1;color:#334155;font-size:0.72rem;font-weight:700;padding:3px 9px;border-radius:5px;">${escapeHtml(cur.categoryLabel)}</span>` : ''}
              </div>
              <button type="button" class="ks2-lc-study-btn" data-ks2-act="lesson" data-lidx="${cur.lessonIndex}" data-gidx="${cur.globalIdx}">
                <span>📖 Open Enquiry ${cur.enquiryNum} Lesson &rarr;</span>
              </button>
            </div>

            <h2 class="ks2-lc-title">${escapeHtml(cur.title)}</h2>
            <p class="ks2-lc-story">${escapeHtml(cur.story)}</p>

            <div class="ks2-lc-callouts">
              <div class="ks2-lc-callout">
                <div class="ks2-lc-callout-hd">
                  <span><i class="fa-solid fa-lightbulb"></i> Why It Mattered</span>
                  ${whyBlurred ? `<button type="button" data-ks2-act="reveal-why" data-mid="${escapeHtml(cur.id)}" style="background:#f59e0b;color:#fff;border:none;border-radius:4px;padding:2px 7px;font-size:0.66rem;font-weight:800;cursor:pointer;">Reveal</button>` : ''}
                </div>
                <div class="ks2-lc-callout-txt ${whyBlurred ? 'ks2-lc-blurred' : ''}" data-ks2-act="reveal-why" data-mid="${escapeHtml(cur.id)}">${escapeHtml(cur.significance)}</div>
              </div>
              <div class="ks2-lc-callout" style="border-left-color:#059669;">
                <div class="ks2-lc-callout-hd" style="color:#059669;">
                  <span><i class="fa-solid fa-children"></i> Life for Children</span>
                </div>
                <div class="ks2-lc-callout-txt">${escapeHtml(cur.childrenLife)}</div>
              </div>
            </div>

            ${cur.quote ? `<div class="ks2-lc-quote"><i class="fa-solid fa-quote-left" style="margin-right:6px;opacity:0.65;"></i>${escapeHtml(cur.quote)}</div>` : ''}

            <div class="ks2-lc-detective">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px;">
                <span style="font-size:0.74rem;font-weight:800;text-transform:uppercase;color:#92400e;"><i class="fa-solid fa-magnifying-glass"></i> Historical Detective Check</span>
                <button type="button" data-ks2-act="toggle-det" data-mid="${escapeHtml(cur.id)}" style="background:#ca8a04;color:#fff;border:none;border-radius:5px;padding:3px 9px;font-size:0.72rem;font-weight:800;cursor:pointer;">
                  ${detShown ? 'Hide Answer' : 'Reveal Answer'}
                </button>
              </div>
              <div style="font-size:0.85rem;font-weight:700;color:#1e293b;">${escapeHtml(cur.detectiveQuestion)}</div>
              ${
                detShown
                  ? `<div style="margin-top:6px;padding:6px 10px;background:#fffbeb;border:1px solid #fde047;border-radius:5px;font-size:0.82rem;color:#713f12;"><strong>Answer:</strong> ${escapeHtml(cur.detectiveAnswer)}</div>`
                  : ''
              }
            </div>
          </div>

          <div class="ks2-lc-foot">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              ${
                cur.resolvedTextbookUrl
                  ? `<a href="${escapeHtml(cur.resolvedTextbookUrl)}" target="_blank" class="ks2-lc-doc-link ks2-lc-staff-doc"><i class="fa-solid fa-book-open"></i> ${escapeHtml(textbookLabel)} (${escapeHtml((cur.refTextbook || '').split('•')[0].trim() || 'Read')})</a>`
                  : ''
              }
              ${
                cur.worksheetUrl
                  ? `<a href="${escapeHtml(cur.worksheetUrl)}" target="_blank" class="ks2-lc-doc-link ks2-lc-staff-doc"><i class="fa-solid fa-file-pen"></i> Worksheet</a>`
                  : ''
              }
            </div>
            <div style="display:inline-flex;align-items:center;gap:8px;">
              <button type="button" class="ks2-lc-step-btn" data-ks2-act="prev" ${pos <= 0 ? 'disabled' : ''}>&larr; Prev</button>
              <button type="button" class="ks2-lc-step-btn" data-ks2-act="next" ${pos >= filtered.length - 1 ? 'disabled' : ''}>Next &rarr;</button>
            </div>
          </div>
        </div>
      </article>
    `;

    const rangeEl = stageSlot.querySelector('#ks2-lc-range');
    if (rangeEl) {
      rangeEl.addEventListener('input', (ev) => {
        const idx = parseInt(ev.target.value, 10);
        const live = getFiltered();
        if (live[idx]) {
          activeGlobalIdx = live[idx].globalIdx;
          if (typeof window !== 'undefined') window._cmeActiveMilestoneIdx = activeGlobalIdx;
          renderBody(false);
        }
      });
    }

    const rail = stageSlot.querySelector('#ks2-lc-rail');
    const actNode = rail?.querySelector('.ks2-lc-rail-node.active');
    if (rail && actNode) {
      const targetLeft = actNode.offsetLeft - rail.clientWidth / 2 + actNode.offsetWidth / 2;
      rail.scrollTo({ left: Math.max(0, targetLeft), behavior: smoothRail ? 'smooth' : 'auto' });
    }
  }

  root.addEventListener('click', (e) => {
    const modeBtn = e.target.closest('[data-ks2-mode]');
    if (modeBtn) {
      viewMode = modeBtn.getAttribute('data-ks2-mode') || 'explorer';
      if (viewMode === 'grid') stopTour();
      renderBody(false);
      return;
    }

    const filterBtn = e.target.closest('[data-ks2-filter]');
    if (filterBtn) {
      activeFilter = filterBtn.getAttribute('data-ks2-filter') || 'all';
      renderBody(false);
      return;
    }

    if (e.target.closest('#ks2-lc-recall-btn')) {
      recallAll = !recallAll;
      revealedWhyIds.clear();
      renderBody(false);
      return;
    }

    if (e.target.closest('#ks2-lc-tour-btn')) {
      if (isPlaying) {
        stopTour();
      } else {
        viewMode = 'explorer';
        isPlaying = true;
        window._ks2LivingTourTimer = setInterval(() => {
          if (!document.body.contains(root)) {
            stopTour();
            return;
          }
          const live = getFiltered();
          if (live.length === 0) return;
          const pos = ensureSelection(live);
          const next = pos < live.length - 1 ? pos + 1 : 0;
          activeGlobalIdx = live[next].globalIdx;
          renderBody(true);
        }, 6000);
      }
      renderBody(false);
      return;
    }

    if (e.target.closest('#ks2-lc-print-btn')) {
      openTimelinePrintModal({
        courseTitle: title,
        subtitle: 'Key Stage 2 Living Chronology',
        colHeaders: ['Date & Theme', 'Turning Point', 'What Happened & Children’s Lives', 'Why It Mattered'],
        rows: enriched.map((m) => ({
          eraBadge: m.categoryLabel || 'KS2',
          date: m.year,
          title: m.title,
          terms: m.refTextbook || '',
          col3: `${m.story} ${m.childrenLife || ''}`,
          col4: m.significance,
        })),
      });
      return;
    }

    if (e.target.closest('#ks2-lc-lb-close') || e.target === lbEl) {
      lbEl.classList.remove('open');
      return;
    }

    const actEl = e.target.closest('[data-ks2-act]');
    if (!actEl) return;
    const act = actEl.getAttribute('data-ks2-act');
    const live = getFiltered();
    const pos = ensureSelection(live);

    if (act === 'pick') {
      activeGlobalIdx = parseInt(actEl.getAttribute('data-gidx'), 10) || 0;
      if (typeof window !== 'undefined') window._cmeActiveMilestoneIdx = activeGlobalIdx;
      renderBody(true);
    } else if (act === 'prev' && pos > 0) {
      activeGlobalIdx = live[pos - 1].globalIdx;
      renderBody(true);
    } else if (act === 'next' && pos < live.length - 1) {
      activeGlobalIdx = live[pos + 1].globalIdx;
      renderBody(true);
    } else if (act === 'zoom') {
      openLightbox(parseInt(actEl.getAttribute('data-gidx'), 10) || 0);
    } else if (act === 'toggle-det') {
      const mid = actEl.getAttribute('data-mid');
      if (revealedDetectiveIds.has(mid)) revealedDetectiveIds.delete(mid);
      else revealedDetectiveIds.add(mid);
      renderBody(false);
    } else if (act === 'reveal-why' && recallAll) {
      const mid = actEl.getAttribute('data-mid');
      if (mid && !revealedWhyIds.has(mid)) {
        revealedWhyIds.add(mid);
        renderBody(false);
      }
    } else if (act === 'inspect') {
      activeGlobalIdx = parseInt(actEl.getAttribute('data-gidx'), 10) || 0;
      viewMode = 'explorer';
      renderBody(true);
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (act === 'lesson') {
      jumpToEnquiryLesson(
        parseInt(actEl.getAttribute('data-lidx'), 10) || 0,
        parseInt(actEl.getAttribute('data-gidx'), 10) || 0,
      );
    } else if (act === 'reset') {
      activeFilter = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      renderBody(false);
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (ev) => {
      searchQuery = ev.target.value || '';
      renderBody(false);
    });
  }

  if (typeof window !== 'undefined') {
    const keyHandler = (ev) => {
      if (!document.body.contains(root)) {
        window.removeEventListener('keydown', keyHandler);
        return;
      }
      if (ev.key === 'Escape' && lbEl.classList.contains('open')) {
        lbEl.classList.remove('open');
        return;
      }
      const tag = ev.target?.tagName || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || viewMode !== 'explorer') return;
      const live = getFiltered();
      const pos = ensureSelection(live);
      if (ev.key === 'ArrowRight' && pos < live.length - 1) {
        ev.preventDefault();
        activeGlobalIdx = live[pos + 1].globalIdx;
        renderBody(true);
      } else if (ev.key === 'ArrowLeft' && pos > 0) {
        ev.preventDefault();
        activeGlobalIdx = live[pos - 1].globalIdx;
        renderBody(true);
      }
    };
    window._ks2LivingKeyHandler = keyHandler;
    window.addEventListener('keydown', keyHandler);
  }

  renderBody(false);
}
