/**
 * src/spec_explorer_mindmap.js
 *
 * Interactive GCSE Specification Checklist & Left-to-Right Spotlight Mind Map.
 * Features:
 *  - Mode A: Vertical Tap-to-Expand Atomic Specification Checklist
 *  - Mode B: Left-to-Right "Spotlight" SVG + Column Mind Map (zero spider-web clutter)
 *  - Addition #2: Date-Fence Guardrails & Pre-Spec Context Boundary Notice
 *  - Addition #3: 20-Second "Prove-It Green" 3-Question Micro-Quiz (grounded in canonical lesson MCQs)
 *  - Test-Before-Reveal Active Recall Toggle
 *  - Slide-Over Exam Question & Grade 9 WAGOLL Drawer (zero lost place on map)
 *  - 1-Click Printable A4 Blank Skeleton Blurt Map
 */

import './spec_explorer_mindmap.css';
import { ensureUnitLoaded } from './storage.js';
import { resolveGcseExamUnitId } from './engine/mobile_exam_adapter.js';
import { renderSlideOverQuestionCards, stopExamTrainerAudioAndTimers } from './mobile_exam_trainer.js';
import {
  getSpecStatus,
  setSpecStatus,
  markSubTopicProvenGreen,
  computeSpecTreeProgress,
} from './spec_status_store.js';
import {
  mountTrueMindMapStudio,
  exitMindMapFullscreenIfOpen,
  openMindMapPrintModal,
} from './true_mindmap_engine.js';

const specTreeCache = new Map();

const explorerState = {
  unitId: 'cme_new',
  mountId: 'ehub-tab-spec-mount',
  specTree: null,
  unitData: null,
  viewMode: typeof window !== 'undefined' && window.innerWidth < 768 ? 'tree' : 'tree', // 'tree' | 'mindmap'
  testBeforeReveal: false,
  statusFilter: 'all', // 'all' | 'flagged' | 'unproven' | 'verified'
  searchQuery: '',
  collapsedKtIds: new Set(),
  openAnchorIds: new Set(),
  revealedAnchorIds: new Set(),
  openLensAnchorIds: new Set(),
  // Spotlight Mind Map active branch state
  mmSelectedKtId: null,
  mmSelectedStId: null,
  mmSelectedAnchorId: null,
  mmSubMode: 'spotlight', // 'spotlight' | 'overview'
  boardFullscreen: false,
  resizeObserver: null,
};

function escapeHtml(val) {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripHtml(raw) {
  return String(raw || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Loads `/data/spec_trees/<unitId>.json` with an automatic resilient fallback synthesized
 * from `unitData.lessons` if offline or mid-build.
 */
export async function loadUnitSpecTree(rawUnitId) {
  const unitId = resolveGcseExamUnitId(rawUnitId);
  if (specTreeCache.has(unitId)) {
    return specTreeCache.get(unitId);
  }

  try {
    const resp = await fetch(`/data/spec_trees/${unitId}.json`);
    if (resp.ok) {
      const json = await resp.json();
      if (json && Array.isArray(json.keyTopics) && json.keyTopics.length > 0) {
        specTreeCache.set(unitId, json);
        return json;
      }
    }
  } catch (e) {}

  // Fallback synthesis from canonical unit lessons so UI never breaks
  const unitData = (await ensureUnitLoaded(unitId)) || {};
  const lessons = Array.isArray(unitData.lessons) ? unitData.lessons : [];
  const fallbackKt = {
    id: 'kt1',
    number: 1,
    title: unitData.title || 'Course Specification Topics',
    dateFence: '',
    outsideFenceWarning: '',
    subTopics: lessons.map((l, idx) => ({
      id: `st_${idx}`,
      code: `1.${idx + 1}`,
      title: l.title || `Lesson ${idx + 1}`,
      dateFence: '',
      outsideFenceTrap: '',
      linkedLessonIndices: [idx],
      anchors: (l.workbook_stages || []).slice(0, 4).map((st, sIdx) => ({
        id: `st_${idx}_a${sIdx}`,
        title: stripHtml(st.title || `Stage ${sIdx + 1}`),
        dateTag: '',
        lessonIndex: idx,
        recallPrompt: stripHtml(st.question || 'What happened at this turning point?'),
        facts: [stripHtml(st.summary || st.question || 'Review lesson narrative for core details.')],
        examLens: {
          lensType: 'Edexcel Exam Focus',
          points: [
            {
              label: 'Exam Application',
              text: 'Support analytical claims on this topic with specific dates and named individuals.',
            },
          ],
        },
        questionSearchTerm: stripHtml(st.title || ''),
      })),
    })),
  };

  const fallbackTree = {
    unitId,
    optionCode: '1HI0',
    paperLabel: 'GCSE History',
    courseTitle: unitData.title || unitId,
    examDateBoundary: '',
    disclaimer:
      'Aligned to Pearson Edexcel GCSE (9–1) History (1HI0). Independent educational resource — not endorsed by Pearson.',
    nonExaminedContextNote: null,
    rescueTop10: [],
    keyTopics: [fallbackKt],
  };
  return fallbackTree;
}

function getSubTopicEffectiveStatus(unitId, st) {
  const direct = getSpecStatus(unitId, st.id);
  if (direct === 'verified_green') return 'verified_green';
  const anchorStatuses = (st.anchors || []).map((a) => getSpecStatus(unitId, a.id));
  if (anchorStatuses.length > 0 && anchorStatuses.every((s) => s === 'verified_green')) {
    return 'verified_green';
  }
  if (direct === 'red' || anchorStatuses.includes('red')) return 'red';
  if (direct === 'amber' || anchorStatuses.includes('amber')) return 'amber';
  return 'none';
}

function anchorMatchesFilters(unitId, stStatus, anchor) {
  const aStatus = getSpecStatus(unitId, anchor.id);
  const effStatus = aStatus !== 'none' ? aStatus : stStatus;

  if (explorerState.statusFilter === 'flagged') {
    if (effStatus !== 'red' && effStatus !== 'amber') return false;
  } else if (explorerState.statusFilter === 'unproven') {
    if (effStatus === 'verified_green') return false;
  } else if (explorerState.statusFilter === 'verified') {
    if (effStatus !== 'verified_green') return false;
  }

  const q = explorerState.searchQuery.trim().toLowerCase();
  if (!q) return true;
  const hay = [
    anchor.title,
    anchor.dateTag,
    ...(anchor.facts || []),
    ...((anchor.examLens?.points || []).map((p) => `${p.label} ${p.text}`)),
  ]
    .join(' ')
    .toLowerCase();
  return q.split(/\s+/).every((tok) => hay.includes(tok));
}

function renderControlBarHTML(tree, progress) {
  return `
    <div class="sem-control-bar">
      <div class="sem-top-row">
        <div class="sem-progress-cluster">
          <div class="sem-progress-pill" title="Earn Verified Green ticks by passing each Sub-Topic's 20-second 3-question Prove-It check">
            <i class="fa-solid fa-shield-check"></i>
            <span>Proven Green: ${progress.verifiedSubTopics} / ${progress.totalSubTopics} (${progress.percentVerified}%)</span>
            <div class="sem-progress-track">
              <div class="sem-progress-fill" style="width:${progress.percentVerified}%;"></div>
            </div>
          </div>
          ${
            tree.examDateBoundary
              ? `<span style="font-size:0.76rem;font-weight:800;color:#475569;background:#f1f5f9;border:1px solid #cbd5e1;padding:4px 9px;border-radius:999px;">📅 Exam Period: ${escapeHtml(tree.examDateBoundary)}</span>`
              : ''
          }
        </div>

        <div class="sem-mode-cluster">
          <div class="sem-mode-switch" role="tablist" aria-label="Specification View Mode">
            <button
              type="button"
              class="sem-mode-btn ${explorerState.viewMode === 'tree' ? 'is-active' : ''}"
              data-sem-action="set-mode"
              data-mode="tree"
            >
              <i class="fa-solid fa-list-check"></i>
              <span>Spec Checklist</span>
            </button>
            <button
              type="button"
              class="sem-mode-btn ${explorerState.viewMode === 'mindmap' ? 'is-active' : ''}"
              data-sem-action="set-mode"
              data-mode="mindmap"
            >
              <i class="fa-solid fa-diagram-project"></i>
              <span>Mind Map Studio</span>
            </button>
          </div>

          ${
            explorerState.viewMode === 'tree'
              ? `<button
                  type="button"
                  class="sem-tool-btn ${explorerState.testBeforeReveal ? 'is-active' : ''}"
                  data-sem-action="toggle-recall-gate"
                  title="Ask yourself a recall prompt before revealing the 3 facts"
                >
                  <i class="fa-solid fa-brain"></i>
                  <span>Test-Before-Reveal: ${explorerState.testBeforeReveal ? 'ON' : 'OFF'}</span>
                </button>`
              : ''
          }

          <button
            type="button"
            class="sem-tool-btn"
            data-sem-action="print-skeleton-map"
            title="Print visual A4 / A3 Landscape Mind Map (Completed Revision Poster or Blank Write-On Blurt Map)"
          >
            <i class="fa-solid fa-print"></i>
            <span>Print Visual Mind Map</span>
          </button>
        </div>
      </div>

      ${
        explorerState.viewMode === 'tree'
          ? `<div class="sem-filter-search-row">
              <div class="sem-search-box">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input
                  type="search"
                  id="sem-search-input"
                  class="sem-search-input"
                  placeholder="Filter specification phrases, dates, treaties or leaders..."
                  value="${escapeHtml(explorerState.searchQuery)}"
                  autocomplete="off"
                />
              </div>

              <div class="sem-status-pills" role="group" aria-label="Filter by confidence status">
                ${[
                  { key: 'all', label: 'All Topics' },
                  { key: 'flagged', label: `🔴 Red / Shaky (${progress.redSubTopics + progress.amberSubTopics})` },
                  { key: 'unproven', label: `⚪ Not Yet Proven (${progress.totalSubTopics - progress.verifiedSubTopics})` },
                  { key: 'verified', label: `✅ Proven Green (${progress.verifiedSubTopics})` },
                ]
                  .map(
                    (f) => `
                    <button
                      type="button"
                      class="sem-status-chip ${explorerState.statusFilter === f.key ? 'is-active' : ''}"
                      data-sem-action="set-status-filter"
                      data-filter="${f.key}"
                    >
                      ${escapeHtml(f.label)}
                    </button>
                  `,
                  )
                  .join('')}
              </div>
            </div>`
          : ''
      }
    </div>
  `;
}

function renderAnchorDetailsInnerHTML(unitId, anchor) {
  const isGateHidden =
    explorerState.testBeforeReveal && !explorerState.revealedAnchorIds.has(anchor.id);
  const isLensOpen = explorerState.openLensAnchorIds.has(anchor.id);
  const aStatus = getSpecStatus(unitId, anchor.id);

  if (isGateHidden) {
    return `
      <div class="sem-recall-gate">
        <div class="sem-recall-q">🧠 Think first: ${escapeHtml(anchor.recallPrompt || `Name 2 key facts about ${anchor.title}`)}</div>
        <button
          type="button"
          class="sem-reveal-btn"
          data-sem-action="reveal-anchor-facts"
          data-anchor-id="${escapeHtml(anchor.id)}"
        >
          Reveal 3 Killer Facts
        </button>
      </div>
    `;
  }

  const factsHtml = (anchor.facts || [])
    .map((f) => `<li>${escapeHtml(f)}</li>`)
    .join('');

  const lensPointsHtml = (anchor.examLens?.points || [])
    .map(
      (pt) => `
        <div class="sem-lens-card">
          <span class="sem-lens-label">${escapeHtml(pt.label)}</span>
          <span>${escapeHtml(pt.text)}</span>
        </div>
      `,
    )
    .join('');

  return `
    <ul class="sem-facts-list">
      ${factsHtml}
    </ul>

    <div class="sem-step2-bar">
      <button
        type="button"
        class="sem-lens-toggle-btn ${isLensOpen ? 'is-open' : ''}"
        data-sem-action="toggle-exam-lens"
        data-anchor-id="${escapeHtml(anchor.id)}"
      >
        <i class="fa-solid fa-bullseye"></i>
        <span>${isLensOpen ? 'Hide Edexcel Exam Lens' : 'How Edexcel Examines This (Step 3) ▾'}</span>
      </button>

      <div style="display:inline-flex;align-items:center;gap:5px;flex-wrap:wrap;">
        <button
          type="button"
          class="sem-rag-mini ${aStatus === 'red' ? 'is-red' : ''}"
          data-sem-action="set-item-rag"
          data-item-id="${escapeHtml(anchor.id)}"
          data-rag="${aStatus === 'red' ? 'none' : 'red'}"
        >
          🔴 Need Help
        </button>
        <button
          type="button"
          class="sem-rag-mini ${aStatus === 'amber' ? 'is-amber' : ''}"
          data-sem-action="set-item-rag"
          data-item-id="${escapeHtml(anchor.id)}"
          data-rag="${aStatus === 'amber' ? 'none' : 'amber'}"
        >
          🟠 Shaky
        </button>
      </div>
    </div>

    ${
      isLensOpen
        ? `
          <div class="sem-exam-lens-box">
            <div class="sem-lens-grid">
              ${lensPointsHtml}
            </div>
            <div class="sem-action-row">
              <button
                type="button"
                class="sem-act-btn primary"
                data-sem-action="open-question-drawer"
                data-anchor-id="${escapeHtml(anchor.id)}"
                data-lesson-index="${anchor.lessonIndex ?? 0}"
                data-search="${escapeHtml(anchor.questionSearchTerm || anchor.title)}"
                data-open-mode="practise"
              >
                <i class="fa-solid fa-bolt"></i>
                <span>Practise Linked Question</span>
              </button>
              <button
                type="button"
                class="sem-act-btn wagoll"
                data-sem-action="open-question-drawer"
                data-anchor-id="${escapeHtml(anchor.id)}"
                data-lesson-index="${anchor.lessonIndex ?? 0}"
                data-search="${escapeHtml(anchor.questionSearchTerm || anchor.title)}"
                data-open-mode="wagoll"
              >
                <i class="fa-solid fa-award"></i>
                <span>Read Grade 9 Answer</span>
              </button>
              <button
                type="button"
                class="sem-act-btn"
                data-sem-action="jump-to-lesson"
                data-lesson-index="${anchor.lessonIndex ?? 0}"
              >
                <i class="fa-solid fa-book-open"></i>
                <span>Open Lesson</span>
              </button>
            </div>
          </div>
        `
        : ''
    }
  `;
}

function renderVerticalTreeHTML(tree) {
  const unitId = tree.unitId;
  const ctx = tree.nonExaminedContextNote;

  const contextHtml = ctx
    ? `
      <div class="sem-context-boundary">
        <div style="flex:1 1 320px;">
          <span class="sem-context-badge">${escapeHtml(ctx.badge)}</span>
          <div>${escapeHtml(ctx.summary)}</div>
        </div>
        ${
          typeof ctx.lessonIndex === 'number'
            ? `<button type="button" class="sem-act-btn" data-sem-action="jump-to-lesson" data-lesson-index="${ctx.lessonIndex}">
                <i class="fa-solid fa-book-open"></i> Open Background Lesson
              </button>`
            : ''
        }
      </div>
    `
    : '';

  const ktBlocks = (tree.keyTopics || [])
    .map((kt) => {
      const isCollapsed = explorerState.collapsedKtIds.has(kt.id);
      const subTopicCards = (kt.subTopics || [])
        .map((st) => {
          const stStatus = getSubTopicEffectiveStatus(unitId, st);
          const visibleAnchors = (st.anchors || []).filter((a) =>
            anchorMatchesFilters(unitId, stStatus, a),
          );
          if (visibleAnchors.length === 0) return '';

          const isProven = stStatus === 'verified_green';

          const anchorsHtml = visibleAnchors
            .map((a) => {
              const isOpen =
                explorerState.openAnchorIds.has(a.id) || Boolean(explorerState.searchQuery.trim());
              const aStatus = getSpecStatus(unitId, a.id);
              const dotIcon =
                aStatus === 'verified_green' || isProven
                  ? '✅'
                  : aStatus === 'red'
                    ? '🔴'
                    : aStatus === 'amber'
                      ? '🟠'
                      : '';

              return `
                <div class="sem-anchor-item ${isOpen ? 'is-open' : ''}" data-anchor-wrap="${escapeHtml(a.id)}">
                  <button
                    type="button"
                    class="sem-anchor-btn"
                    data-sem-action="toggle-anchor"
                    data-anchor-id="${escapeHtml(a.id)}"
                    aria-expanded="${isOpen ? 'true' : 'false'}"
                  >
                    <div class="sem-anchor-left">
                      <i class="fa-solid fa-chevron-right sem-anchor-chevron"></i>
                      <span class="sem-anchor-title">${dotIcon ? `${dotIcon} ` : ''}${escapeHtml(a.title)}</span>
                    </div>
                    ${a.dateTag ? `<span class="sem-anchor-date">${escapeHtml(a.dateTag)}</span>` : ''}
                  </button>
                  ${
                    isOpen
                      ? `<div class="sem-anchor-body">${renderAnchorDetailsInnerHTML(unitId, a)}</div>`
                      : ''
                  }
                </div>
              `;
            })
            .join('');

          return `
            <div class="sem-subtopic-card status-${escapeHtml(stStatus)}">
              <div class="sem-subtopic-head">
                <div>
                  <div class="sem-subtopic-title">
                    <span class="sem-subtopic-code">${escapeHtml(st.code)}</span>
                    <span>${escapeHtml(st.title)}</span>
                    ${st.dateFence ? `<span style="font-size:0.72rem;font-weight:700;color:#475569;">(${escapeHtml(st.dateFence)})</span>` : ''}
                  </div>
                  ${
                    st.outsideFenceTrap
                      ? `<div style="font-size:0.73rem;color:#991b1b;font-weight:600;margin-top:2px;">⚠️ Date-Fence Trap: ${escapeHtml(st.outsideFenceTrap)}</div>`
                      : ''
                  }
                </div>

                <div class="sem-subtopic-actions">
                  <button
                    type="button"
                    class="sem-prove-btn ${isProven ? 'is-proven' : ''}"
                    data-sem-action="open-prove-it"
                    data-st-id="${escapeHtml(st.id)}"
                  >
                    <i class="fa-solid ${isProven ? 'fa-circle-check' : 'fa-bolt'}"></i>
                    <span>${isProven ? 'Proven Green ✓' : 'Prove It (3 Qs)'}</span>
                  </button>
                  <button
                    type="button"
                    class="sem-rag-mini ${stStatus === 'red' ? 'is-red' : ''}"
                    data-sem-action="set-item-rag"
                    data-item-id="${escapeHtml(st.id)}"
                    data-rag="${stStatus === 'red' ? 'none' : 'red'}"
                    title="Flag Sub-Topic as Need Help"
                  >
                    🔴
                  </button>
                  <button
                    type="button"
                    class="sem-rag-mini ${stStatus === 'amber' ? 'is-amber' : ''}"
                    data-sem-action="set-item-rag"
                    data-item-id="${escapeHtml(st.id)}"
                    data-rag="${stStatus === 'amber' ? 'none' : 'amber'}"
                    title="Flag Sub-Topic as Shaky"
                  >
                    🟠
                  </button>
                </div>
              </div>
              <div class="sem-anchors-stack">
                ${anchorsHtml}
              </div>
            </div>
          `;
        })
        .filter(Boolean)
        .join('');

      if (!subTopicCards) return '';

      return `
        <section class="sem-kt-block">
          <div class="sem-kt-header" data-sem-action="toggle-kt" data-kt-id="${escapeHtml(kt.id)}">
            <div class="sem-kt-title-wrap">
              <i class="fa-solid fa-chevron-${isCollapsed ? 'right' : 'down'}" style="font-size:0.8rem;color:#93c5fd;"></i>
              <h3 class="sem-kt-title">${escapeHtml(kt.title)}</h3>
              ${kt.dateFence ? `<span class="sem-fence-pill">📅 ${escapeHtml(kt.dateFence)}</span>` : ''}
            </div>
            <span style="font-size:0.75rem;color:#cbd5e1;font-weight:700;">${isCollapsed ? 'Expand' : 'Collapse'}</span>
          </div>
          ${
            !isCollapsed && kt.outsideFenceWarning
              ? `<div class="sem-kt-outside-warn"><i class="fa-solid fa-shield-halved" style="margin-right:5px;"></i>${escapeHtml(kt.outsideFenceWarning)}</div>`
              : ''
          }
          ${!isCollapsed ? `<div class="sem-subtopic-list">${subTopicCards}</div>` : ''}
        </section>
      `;
    })
    .filter(Boolean)
    .join('');

  return `
    ${contextHtml}
    ${
      ktBlocks ||
      `<div style="background:#ffffff;border:1.5px dashed #cbd5e1;border-radius:12px;padding:28px;text-align:center;color:#475569;font-weight:700;">
        No specification topics match your current filter.
        <div style="margin-top:10px;">
          <button type="button" class="sem-act-btn primary" data-sem-action="reset-spec-filters">Show All Specification Topics</button>
        </div>
      </div>`
    }
  `;
}

function ensureMindMapDefaults(tree) {
  const kts = tree?.keyTopics || [];
  if (kts.length === 0) return;

  let activeKt = kts.find((k) => k.id === explorerState.mmSelectedKtId) || kts[0];
  explorerState.mmSelectedKtId = activeKt.id;

  const sts = activeKt.subTopics || [];
  let activeSt = sts.find((s) => s.id === explorerState.mmSelectedStId) || sts[0] || null;
  explorerState.mmSelectedStId = activeSt ? activeSt.id : null;

  const anchors = activeSt?.anchors || [];
  let activeAnchor =
    anchors.find((a) => a.id === explorerState.mmSelectedAnchorId) || anchors[0] || null;
  explorerState.mmSelectedAnchorId = activeAnchor ? activeAnchor.id : null;
}

function renderSpotlightMindMapHTML(tree) {
  ensureMindMapDefaults(tree);
  const unitId = tree.unitId;
  const kts = tree.keyTopics || [];
  const activeKt = kts.find((k) => k.id === explorerState.mmSelectedKtId) || kts[0];
  const sts = activeKt?.subTopics || [];
  const activeSt = sts.find((s) => s.id === explorerState.mmSelectedStId) || sts[0];
  const anchors = activeSt?.anchors || [];
  const activeAnchor =
    anchors.find((a) => a.id === explorerState.mmSelectedAnchorId) || anchors[0];

  const col1Html = kts
    .map((kt) => {
      const sel = kt.id === activeKt?.id;
      return `
        <button
          type="button"
          class="sem-mm-node ${sel ? 'is-selected' : 'is-dimmed'}"
          data-sem-action="mm-select-kt"
          data-kt-id="${escapeHtml(kt.id)}"
          data-mm-node="kt-${escapeHtml(kt.id)}"
        >
          <div class="sem-mm-node-eyebrow">
            <span>Key Topic ${kt.number}</span>
            ${kt.dateFence ? `<span>${escapeHtml(kt.dateFence)}</span>` : ''}
          </div>
          <div class="sem-mm-node-title">${escapeHtml(kt.title.replace(/^Key Topic\s*\d+\s*:\s*/i, ''))}</div>
        </button>
      `;
    })
    .join('');

  const col2Html = sts
    .map((st) => {
      const sel = st.id === activeSt?.id;
      const stStatus = getSubTopicEffectiveStatus(unitId, st);
      const icon =
        stStatus === 'verified_green'
          ? '✅'
          : stStatus === 'red'
            ? '🔴'
            : stStatus === 'amber'
              ? '🟠'
              : '▸';
      return `
        <button
          type="button"
          class="sem-mm-node ${sel ? 'is-selected' : 'is-dimmed'}"
          data-sem-action="mm-select-st"
          data-st-id="${escapeHtml(st.id)}"
          data-mm-node="st-${escapeHtml(st.id)}"
        >
          <div class="sem-mm-node-eyebrow">
            <span>Sub-Topic ${escapeHtml(st.code)}</span>
            <span>${icon}</span>
          </div>
          <div class="sem-mm-node-title">${escapeHtml(st.title)}</div>
        </button>
      `;
    })
    .join('');

  const col3Html = anchors
    .map((a) => {
      const sel = a.id === activeAnchor?.id;
      return `
        <button
          type="button"
          class="sem-mm-node ${sel ? 'is-selected' : 'is-dimmed'}"
          data-sem-action="mm-select-anchor"
          data-anchor-id="${escapeHtml(a.id)}"
          data-mm-node="an-${escapeHtml(a.id)}"
        >
          <div class="sem-mm-node-eyebrow">
            <span>Spec Anchor</span>
            ${a.dateTag ? `<span>${escapeHtml(a.dateTag)}</span>` : ''}
          </div>
          <div class="sem-mm-node-title">${escapeHtml(a.title)}</div>
        </button>
      `;
    })
    .join('');

  // Render Full-Width Docked Knowledge Panel (2-Column Split: Facts Left | Exam Lens & Actions Right)
  const isGateHidden =
    activeAnchor &&
    explorerState.testBeforeReveal &&
    !explorerState.revealedAnchorIds.has(activeAnchor.id);
  const aStatus = activeAnchor ? getSpecStatus(unitId, activeAnchor.id) : 'none';

  const dockedLeafHtml = activeAnchor
    ? `
      <div class="sem-mm-docked-leaf">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;border-bottom:1px solid rgba(148,163,184,0.3);padding-bottom:8px;">
          <div>
            <div style="font-size:0.7rem;font-weight:800;text-transform:uppercase;color:#2563eb;letter-spacing:0.04em;">
              ${escapeHtml(activeSt?.code || '')} &bull; ${escapeHtml(activeSt?.title || '')} ${activeAnchor.dateTag ? `(${escapeHtml(activeAnchor.dateTag)})` : ''}
            </div>
            <h4 class="sem-mm-leaf-title" style="margin:2px 0 0;">${escapeHtml(activeAnchor.title)}</h4>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            ${
              activeSt
                ? `<button type="button" class="sem-prove-btn ${getSubTopicEffectiveStatus(unitId, activeSt) === 'verified_green' ? 'is-proven' : ''}" data-sem-action="open-prove-it" data-st-id="${escapeHtml(activeSt.id)}">
                    <i class="fa-solid fa-bolt"></i>
                    <span>${getSubTopicEffectiveStatus(unitId, activeSt) === 'verified_green' ? 'Proven Green ✓' : `Prove ${escapeHtml(activeSt.code)} (3 Qs)`}</span>
                  </button>`
                : ''
            }
            <button type="button" class="sem-rag-mini ${aStatus === 'red' ? 'is-red' : ''}" data-sem-action="set-item-rag" data-item-id="${escapeHtml(activeAnchor.id)}" data-rag="${aStatus === 'red' ? 'none' : 'red'}">🔴 Need Help</button>
            <button type="button" class="sem-rag-mini ${aStatus === 'amber' ? 'is-amber' : ''}" data-sem-action="set-item-rag" data-item-id="${escapeHtml(activeAnchor.id)}" data-rag="${aStatus === 'amber' ? 'none' : 'amber'}">🟠 Shaky</button>
          </div>
        </div>

        <div class="sem-mm-docked-grid">
          <div>
            <div style="font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;color:#64748b;margin-bottom:4px;">3 Killer AO1 Facts</div>
            ${
              isGateHidden
                ? `<div class="sem-recall-gate">
                    <div class="sem-recall-q">🧠 Think first: ${escapeHtml(activeAnchor.recallPrompt || `Name 2 key facts about ${activeAnchor.title}`)}</div>
                    <button type="button" class="sem-reveal-btn" data-sem-action="reveal-anchor-facts" data-anchor-id="${escapeHtml(activeAnchor.id)}">Reveal 3 Killer Facts</button>
                  </div>`
                : `<ul class="sem-facts-list" style="margin:4px 0 0;">${(activeAnchor.facts || []).map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>`
            }
          </div>

          <div>
            <div style="font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;color:#d97706;margin-bottom:6px;">How Edexcel Examines This (AO2)</div>
            <div class="sem-lens-grid" style="margin-bottom:10px;">
              ${(activeAnchor.examLens?.points || [])
                .map(
                  (pt) => `
                    <div class="sem-lens-card">
                      <span class="sem-lens-label">${escapeHtml(pt.label)}</span>
                      <span>${escapeHtml(pt.text)}</span>
                    </div>
                  `,
                )
                .join('')}
            </div>
            <div class="sem-action-row">
              <button type="button" class="sem-act-btn primary" data-sem-action="open-question-drawer" data-anchor-id="${escapeHtml(activeAnchor.id)}" data-lesson-index="${activeAnchor.lessonIndex ?? 0}" data-search="${escapeHtml(activeAnchor.questionSearchTerm || activeAnchor.title)}" data-open-mode="practise">
                <i class="fa-solid fa-bolt"></i><span>Practise Linked Question</span>
              </button>
              <button type="button" class="sem-act-btn wagoll" data-sem-action="open-question-drawer" data-anchor-id="${escapeHtml(activeAnchor.id)}" data-lesson-index="${activeAnchor.lessonIndex ?? 0}" data-search="${escapeHtml(activeAnchor.questionSearchTerm || activeAnchor.title)}" data-open-mode="wagoll">
                <i class="fa-solid fa-award"></i><span>Read Grade 9 Answer</span>
              </button>
              <button type="button" class="sem-act-btn" data-sem-action="jump-to-lesson" data-lesson-index="${activeAnchor.lessonIndex ?? 0}">
                <i class="fa-solid fa-book-open"></i><span>Open Lesson</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `
    : '';

  const overviewGridHtml = `
    <div class="sem-rag-overview-grid">
      ${kts
        .map(
          (kt) => `
            <div class="sem-rag-kt-col">
              <div class="sem-rag-kt-head">
                <span>${escapeHtml(kt.title)}</span>
                ${kt.dateFence ? `<span style="font-size:0.7rem;color:#93c5fd;white-space:nowrap;">${escapeHtml(kt.dateFence)}</span>` : ''}
              </div>
              <div class="sem-rag-st-list">
                ${(kt.subTopics || [])
                  .map((st) => {
                    const stStatus = getSubTopicEffectiveStatus(unitId, st);
                    const badge =
                      stStatus === 'verified_green'
                        ? '✅ Proven Green'
                        : stStatus === 'red'
                          ? '🔴 Need Help'
                          : stStatus === 'amber'
                            ? '🟠 Shaky'
                            : '⚪ Unchecked';
                    return `
                      <button
                        type="button"
                        class="sem-rag-st-tile status-${escapeHtml(stStatus)}"
                        data-sem-action="mm-jump-from-overview"
                        data-kt-id="${escapeHtml(kt.id)}"
                        data-st-id="${escapeHtml(st.id)}"
                      >
                        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:3px;">
                          <strong style="font-size:0.75rem;">${escapeHtml(st.code)}</strong>
                          <span style="font-size:0.7rem;font-weight:800;">${badge}</span>
                        </div>
                        <div style="font-size:0.81rem;font-weight:700;line-height:1.3;">${escapeHtml(st.title)}</div>
                        <div style="font-size:0.71rem;opacity:0.78;margin-top:3px;">${(st.anchors || []).length} Spec Anchors &rarr; Tap to Unpack</div>
                      </button>
                    `;
                  })
                  .join('')}
              </div>
            </div>
          `,
        )
        .join('')}
    </div>
  `;

  return `
    <div class="sem-mindmap-stage">
      <div class="sem-mindmap-hint">
        <span><i class="fa-solid fa-wand-magic-sparkles" style="color:#2563eb;margin-right:6px;"></i><strong>${explorerState.mmSubMode === 'overview' ? 'Whole-Course RAG Radar:' : 'Spotlight Mind Map:'}</strong> ${explorerState.mmSubMode === 'overview' ? 'Spot every Red, Shaky, or Unchecked sub-topic across the entire course at a glance — tap any tile to unpack its branch.' : 'Click any branch left-to-right; its 3 killer facts and Edexcel exam angles appear full-width right underneath.'}</span>
        <div style="display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <button type="button" class="sem-tool-btn ${explorerState.mmSubMode === 'spotlight' ? 'is-active' : ''}" data-sem-action="mm-set-submode" data-submode="spotlight">🌿 Spotlight Tree</button>
          <button type="button" class="sem-tool-btn ${explorerState.mmSubMode === 'overview' ? 'is-active' : ''}" data-sem-action="mm-set-submode" data-submode="overview">🗺️ Whole-Course RAG Map</button>
          <button type="button" class="sem-tool-btn ${explorerState.boardFullscreen ? 'is-active' : ''}" data-sem-action="mm-toggle-board-mode" title="Hide sidebar for Smartboard projection or 13-inch laptops">${explorerState.boardFullscreen ? '✕ Exit Board Mode' : '⛶ Board Mode'}</button>
        </div>
      </div>

      ${
        explorerState.mmSubMode === 'overview'
          ? overviewGridHtml
          : `
            <div class="sem-mm-canvas" id="sem-mm-canvas">
              <svg class="sem-mm-svg" id="sem-mm-svg" aria-hidden="true"><g id="sem-mm-svg-g"></g></svg>

              <div class="sem-mm-col">
                <div class="sem-mm-col-label">1. Key Topics</div>
                ${col1Html}
              </div>

              <div class="sem-mm-col">
                <div class="sem-mm-col-label">2. Sub-Topics</div>
                ${col2Html}
              </div>

              <div class="sem-mm-col">
                <div class="sem-mm-col-label">3. Atomic Spec Anchors</div>
                ${col3Html}
              </div>
            </div>
            ${dockedLeafHtml}
          `
      }
    </div>
  `;
}

function drawMindMapConnectors() {
  if (explorerState.viewMode !== 'mindmap') return;
  const canvas = document.getElementById('sem-mm-canvas');
  const svgG = document.getElementById('sem-mm-svg-g');
  if (!canvas || !svgG) return;

  const cRect = canvas.getBoundingClientRect();
  if (cRect.width === 0) return;

  const paths = [];
  const connect = (fromSel, toSel, isHighlighted) => {
    const fromEl = canvas.querySelector(fromSel);
    const toEl = canvas.querySelector(toSel);
    if (!fromEl || !toEl) return;
    const f = fromEl.getBoundingClientRect();
    const t = toEl.getBoundingClientRect();
    const x1 = f.right - cRect.left;
    const y1 = f.top + f.height / 2 - cRect.top;
    const x2 = t.left - cRect.left;
    const y2 = t.top + Math.min(28, t.height / 2) - cRect.top;
    const dx = Math.max(24, (x2 - x1) * 0.52);
    const stroke = isHighlighted ? '#2563eb' : '#cbd5e1';
    const width = isHighlighted ? '2.4' : '1.3';
    paths.push(
      `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${(x1 + dx).toFixed(1)} ${y1.toFixed(1)}, ${(x2 - dx).toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" />`,
    );
  };

  const tree = explorerState.specTree;
  const activeKt = tree?.keyTopics?.find((k) => k.id === explorerState.mmSelectedKtId);
  const activeSt = activeKt?.subTopics?.find((s) => s.id === explorerState.mmSelectedStId);
  const activeAnchor = activeSt?.anchors?.find((a) => a.id === explorerState.mmSelectedAnchorId);

  if (activeKt) {
    (activeKt.subTopics || []).forEach((st) => {
      connect(
        `[data-mm-node="kt-${activeKt.id}"]`,
        `[data-mm-node="st-${st.id}"]`,
        st.id === activeSt?.id,
      );
    });
  }
  if (activeSt) {
    (activeSt.anchors || []).forEach((a) => {
      connect(
        `[data-mm-node="st-${activeSt.id}"]`,
        `[data-mm-node="an-${a.id}"]`,
        a.id === activeAnchor?.id,
      );
    });
  }
  if (activeAnchor) {
    connect(`[data-mm-node="an-${activeAnchor.id}"]`, `[data-mm-node="leaf-active"]`, true);
  }

  svgG.innerHTML = paths.join('');
}

function rerenderSpecExplorerDOM() {
  const mountEl = document.getElementById(explorerState.mountId);
  const tree = explorerState.specTree;
  if (!mountEl || !tree) return;

  const progress = computeSpecTreeProgress(tree);
  const bodyHtml = explorerState.viewMode === 'mindmap' ? '' : renderVerticalTreeHTML(tree);

  mountEl.innerHTML = `
    <div class="sem-root" id="sem-explorer-root">
      ${renderControlBarHTML(tree, progress)}
      <div id="sem-explorer-body">
        ${bodyHtml}
      </div>
      <div class="sem-disclaimer-foot">
        ${escapeHtml(tree.disclaimer || 'Aligned to Pearson Edexcel GCSE (9–1) History (1HI0). Independent educational resource — not endorsed by Pearson.')}
      </div>
    </div>
  `;

  attachSpecExplorerEvents(mountEl);

  if (explorerState.viewMode === 'mindmap') {
    const bodyEl = mountEl.querySelector('#sem-explorer-body');
    const urlParams =
      typeof window !== 'undefined' ? new URLSearchParams(window.location.search || '') : null;
    const startFs = urlParams?.get('fullscreen') === '1' || urlParams?.get('fullscreen') === 'true';
    mountTrueMindMapStudio(bodyEl, explorerState.unitId, {
      fallbackSpecTree: tree,
      onOpenQuestionDrawer: openSpecQuestionDrawer,
      startFullscreen: startFs,
    });
  } else {
    exitMindMapFullscreenIfOpen();
  }
}

function findAnchorAndSubTopic(tree, anchorId) {
  for (const kt of tree?.keyTopics || []) {
    for (const st of kt.subTopics || []) {
      for (const a of st.anchors || []) {
        if (a.id === anchorId) return { kt, st, anchor: a };
      }
    }
  }
  return null;
}

function findSubTopicById(tree, stId) {
  for (const kt of tree?.keyTopics || []) {
    for (const st of kt.subTopics || []) {
      if (st.id === stId) return { kt, st };
    }
  }
  return null;
}

/**
 * Opens the Slide-Over Question & Grade 9 WAGOLL Drawer over the Spec Explorer.
 */
async function openSpecQuestionDrawer({ title, lessonIndex, searchTerm, openMode }) {
  closeSpecOverlays();
  const backdrop = document.createElement('div');
  backdrop.className = 'sem-drawer-backdrop';
  backdrop.id = 'sem-question-drawer-backdrop';
  backdrop.innerHTML = `
    <div class="sem-drawer-panel" role="dialog" aria-modal="true" aria-label="Linked Exam Questions">
      <div class="sem-drawer-head">
        <div style="min-width:0;">
          <div style="font-size:0.68rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#93c5fd;">Linked Exam Practice &amp; Grade 9 WAGOLL</div>
          <div style="font-size:0.94rem;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(title)}</div>
        </div>
        <button type="button" id="sem-drawer-close-btn" style="background:#1e293b;color:#ffffff;border:1px solid #475569;border-radius:7px;padding:6px 11px;font-size:0.78rem;font-weight:800;cursor:pointer;flex-shrink:0;">
          <i class="fa-solid fa-xmark"></i> Close
        </button>
      </div>
      <div class="sem-drawer-body" id="sem-drawer-cards-mount">
        <div style="padding:24px;text-align:center;color:#64748b;"><i class="fa-solid fa-spinner fa-spin"></i> Loading questions...</div>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);

  const close = () => {
    stopExamTrainerAudioAndTimers();
    backdrop.remove();
  };
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });
  backdrop.querySelector('#sem-drawer-close-btn')?.addEventListener('click', close);

  const cardsMount = backdrop.querySelector('#sem-drawer-cards-mount');
  await renderSlideOverQuestionCards(cardsMount, explorerState.unitId, {
    lessonIndex,
    searchTerm,
    openMode,
  });
}

/**
 * Addition #3: 20-Second "Prove-It Green" 3-Question Micro-Quiz.
 * Pulls 3 verified MCQs from the linked canonical lesson(s) in `unitData.lessons`.
 */
function sampleProveItQuestions(st, unitData) {
  const lessons = Array.isArray(unitData?.lessons) ? unitData.lessons : [];
  const idxs = new Set(Array.isArray(st.linkedLessonIndices) ? st.linkedLessonIndices : []);
  (st.anchors || []).forEach((a) => {
    if (typeof a.lessonIndex === 'number') idxs.add(a.lessonIndex);
  });

  const keywords = [
    st.title,
    ...((st.anchors || []).map((a) => a.title)),
  ]
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4);

  const dateTriviaRx =
    /\b(on what (?:historic |exact )?date|what (?:exact )?date|which (?:exact )?date|on which (?:day|date)|what day (?:of|did|in)|which day (?:in|did|of))\b/i;

  const pool = [];
  idxs.forEach((lIdx) => {
    const lesson = lessons[lIdx];
    const quiz = Array.isArray(lesson?.quiz) ? lesson.quiz : [];
    quiz.forEach((q, qIdx) => {
      if (!q?.question || !Array.isArray(q.options) || q.options.length < 2) return;
      if (dateTriviaRx.test(String(q.question))) return;
      const correctIdx =
        typeof q.answer === 'number'
          ? q.answer
          : typeof q.correct === 'number'
            ? q.correct
            : q.options.findIndex((o) => o === q.correct_answer || o === q.answer);
      if (correctIdx < 0 || correctIdx >= q.options.length) return;

      const textLower = `${q.question} ${q.options.join(' ')}`.toLowerCase();
      let score = 0;
      keywords.forEach((kw) => {
        if (textLower.includes(kw)) score += 2;
      });
      pool.push({
        id: `l${lIdx}_q${qIdx}`,
        question: stripHtml(q.question),
        options: q.options.map((o) => stripHtml(o)),
        correctIdx,
        explanation: stripHtml(q.explanation || ''),
        score: score + Math.random() * 0.8,
      });
    });
  });

  pool.sort((a, b) => b.score - a.score);
  return pool.slice(0, 3);
}

async function openProveItModal(stId) {
  closeSpecOverlays();
  const hit = findSubTopicById(explorerState.specTree, stId);
  if (!hit) return;
  const { st } = hit;

  if (!explorerState.unitData) {
    explorerState.unitData = await ensureUnitLoaded(explorerState.unitId);
  }
  const questions = sampleProveItQuestions(st, explorerState.unitData);
  if (questions.length === 0) {
    markSubTopicProvenGreen(
      explorerState.unitId,
      st.id,
      (st.anchors || []).map((a) => a.id),
    );
    rerenderSpecExplorerDOM();
    return;
  }

  let step = 0;
  let score = 0;
  let answered = false;
  let pickedIdx = -1;

  const backdrop = document.createElement('div');
  backdrop.className = 'sem-modal-backdrop';
  backdrop.id = 'sem-prove-modal-backdrop';
  document.body.appendChild(backdrop);

  const renderModalStep = () => {
    if (step >= questions.length) {
      const passed = score === questions.length;
      if (passed) {
        markSubTopicProvenGreen(
          explorerState.unitId,
          st.id,
          (st.anchors || []).map((a) => a.id),
        );
      }
      backdrop.innerHTML = `
        <div class="sem-prove-modal" role="dialog" aria-modal="true">
          <div class="sem-prove-head" style="background:${passed ? '#065f46' : '#92400e'};">
            <strong>${passed ? '✅ Proven Green Unlocked!' : `Scored ${score} / ${questions.length}`}</strong>
            <button type="button" data-prove-close style="background:transparent;border:none;color:#fff;font-size:1rem;cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="sem-prove-body" style="text-align:center;">
            <p style="margin:0 0 14px;font-size:0.9rem;color:#1e293b;line-height:1.5;">
              ${
                passed
                  ? `Spot-on! <strong>${escapeHtml(st.code)} ${escapeHtml(st.title)}</strong> is now stamped <strong>Proven Green</strong> on your specification checklist.`
                  : `You need ${questions.length}/${questions.length} to earn a Verified Green tick. Review the 3 killer facts or try 3 fresh questions!`
              }
            </p>
            <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;">
              ${
                !passed
                  ? `<button type="button" data-prove-mark-amber class="sem-act-btn">🟠 Mark Shaky for Review</button>
                     <button type="button" data-prove-retry class="sem-act-btn primary">↻ Try 3 Fresh Questions</button>`
                  : `<button type="button" data-prove-done class="sem-act-btn primary">Continue Revising</button>`
              }
            </div>
          </div>
        </div>
      `;
      backdrop.querySelector('[data-prove-close]')?.addEventListener('click', () => {
        backdrop.remove();
        rerenderSpecExplorerDOM();
      });
      backdrop.querySelector('[data-prove-done]')?.addEventListener('click', () => {
        backdrop.remove();
        rerenderSpecExplorerDOM();
      });
      backdrop.querySelector('[data-prove-mark-amber]')?.addEventListener('click', () => {
        setSpecStatus(explorerState.unitId, st.id, 'amber');
        backdrop.remove();
        rerenderSpecExplorerDOM();
      });
      backdrop.querySelector('[data-prove-retry]')?.addEventListener('click', () => {
        backdrop.remove();
        openProveItModal(stId);
      });
      return;
    }

    const cur = questions[step];
    backdrop.innerHTML = `
      <div class="sem-prove-modal" role="dialog" aria-modal="true">
        <div class="sem-prove-head">
          <div>
            <div style="font-size:0.68rem;font-weight:800;text-transform:uppercase;color:#a7f3d0;">⚡ 20s Prove-It Check &bull; Question ${step + 1} of ${questions.length}</div>
            <div style="font-size:0.88rem;font-weight:800;">${escapeHtml(st.code)}: ${escapeHtml(st.title)}</div>
          </div>
          <button type="button" data-prove-close style="background:transparent;border:none;color:#fff;font-size:1rem;cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="sem-prove-body">
          <div style="font-size:0.92rem;font-weight:800;color:#0f172a;margin-bottom:12px;line-height:1.4;">${escapeHtml(cur.question)}</div>
          <div>
            ${cur.options
              .map((opt, idx) => {
                let cls = '';
                if (answered) {
                  if (idx === cur.correctIdx) cls = 'is-correct';
                  else if (idx === pickedIdx) cls = 'is-wrong';
                }
                return `<button type="button" class="sem-mcq-opt ${cls}" data-prove-opt="${idx}" ${answered ? 'disabled' : ''}>${escapeHtml(opt)}</button>`;
              })
              .join('')}
          </div>
          ${
            answered
              ? `
                ${cur.explanation ? `<div style="font-size:0.79rem;color:#334155;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px 10px;margin-bottom:10px;">${escapeHtml(cur.explanation)}</div>` : ''}
                <div style="display:flex;justify-content:flex-end;">
                  <button type="button" data-prove-next class="sem-act-btn primary">${step + 1 < questions.length ? 'Next Question →' : 'See Result →'}</button>
                </div>
              `
              : ''
          }
        </div>
      </div>
    `;

    backdrop.querySelector('[data-prove-close]')?.addEventListener('click', () => backdrop.remove());
    backdrop.querySelectorAll('[data-prove-opt]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (answered) return;
        pickedIdx = parseInt(btn.getAttribute('data-prove-opt'), 10);
        answered = true;
        if (pickedIdx === cur.correctIdx) score += 1;
        renderModalStep();
      });
    });
    backdrop.querySelector('[data-prove-next]')?.addEventListener('click', () => {
      step += 1;
      answered = false;
      pickedIdx = -1;
      renderModalStep();
    });
  };

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.remove();
  });
  renderModalStep();
}

/**
 * Opens a clean, print-ready A4 Blank Skeleton Blurt Sheet for classroom or home revision.
 */
function printBlankSkeletonBlurtMap(tree) {
  if (!tree || typeof window === 'undefined') return;
  const win = window.open('', '_blank');
  if (!win) return;

  const ktHtml = (tree.keyTopics || [])
    .map(
      (kt) => `
        <div class="kt-sec">
          <h2>${escapeHtml(kt.title)} ${kt.dateFence ? `<span>(${escapeHtml(kt.dateFence)})</span>` : ''}</h2>
          <div class="st-grid">
            ${(kt.subTopics || [])
              .map(
                (st) => `
                  <div class="st-box">
                    <div class="st-title"><strong>${escapeHtml(st.code)}</strong> ${escapeHtml(st.title)}</div>
                    <ul>
                      ${(st.anchors || [])
                        .map(
                          (a) => `
                            <li>
                              <div class="a-lbl">☐ ${escapeHtml(a.title)} ${a.dateTag ? `<em>(${escapeHtml(a.dateTag)})</em>` : ''}</div>
                              <div class="blurt-lines"></div>
                            </li>
                          `,
                        )
                        .join('')}
                    </ul>
                  </div>
                `,
              )
              .join('')}
          </div>
        </div>
      `,
    )
    .join('');

  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(tree.courseTitle)} — Blank Skeleton Blurt Map</title>
<style>
  @page { size: A4 portrait; margin: 10mm 12mm; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; color: #000; margin: 0; font-size: 8.6pt; }
  .head { border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: flex-end; }
  .head h1 { margin: 0; font-size: 13pt; }
  .instructions { background: #f8fafc; border: 1px solid #000; padding: 5px 8px; margin-bottom: 8px; font-size: 8pt; }
  .kt-sec { margin-bottom: 10px; break-inside: avoid; }
  .kt-sec h2 { margin: 0 0 5px; font-size: 9.8pt; background: #000; color: #fff; padding: 3px 8px; }
  .kt-sec h2 span { font-weight: 400; font-size: 8.2pt; opacity: 0.85; }
  .st-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
  .st-box { border: 1.2px solid #000; padding: 6px 8px; break-inside: avoid; }
  .st-title { font-size: 8.8pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 4px; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { margin-bottom: 5px; }
  .a-lbl { font-weight: 700; font-size: 8pt; }
  .blurt-lines { height: 22px; border-bottom: 1px dotted #64748b; }
  .foot { margin-top: 8px; font-size: 7pt; color: #475569; text-align: center; }
  @media screen { body { max-width: 820px; margin: 18px auto; padding: 0 14px; } }
</style>
</head>
<body>
  <div class="head">
    <div>
      <div style="font-size:7.2pt;font-weight:800;text-transform:uppercase;" data-department-name="The History Department"><span class="school-brand-target">The History Revision Hub</span> &bull; Skeleton Specification Blurt Map</div>
      <h1>${escapeHtml(tree.courseTitle)} (${escapeHtml(tree.optionCode)})</h1>
    </div>
    <div style="font-size:8pt;">Name: _______________________ &nbsp; Date: __________</div>
  </div>
  <div class="instructions">
    <strong>Active Blurt Instructions:</strong> Without looking at your notes, write 2–3 key dates, individuals, or consequences under each topic anchor in blue/black pen. Then check against the Specification Checklist in the app and add missed facts in a second colour!
  </div>
  ${ktHtml}
  <div class="foot">${escapeHtml(tree.disclaimer || '')}</div>
  <script>window.onload = () => setTimeout(() => window.print(), 250);</script>
</body>
</html>`);
  win.document.close();
}

export function closeSpecOverlays() {
  document.getElementById('sem-question-drawer-backdrop')?.remove();
  document.getElementById('sem-prove-modal-backdrop')?.remove();
  document.getElementById('tmm-print-modal-backdrop')?.remove();
  if (explorerState.boardFullscreen) {
    explorerState.boardFullscreen = false;
    document.body?.classList.remove('sem-board-fullscreen');
  }
}

function attachSpecExplorerEvents(mountEl) {
  const root = mountEl.querySelector('#sem-explorer-root');
  if (!root) return;

  const searchInput = root.querySelector('#sem-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      explorerState.searchQuery = e.target.value || '';
      const bodyEl = document.getElementById('sem-explorer-body');
      if (bodyEl && explorerState.specTree) {
        bodyEl.innerHTML =
          explorerState.viewMode === 'mindmap'
            ? renderSpotlightMindMapHTML(explorerState.specTree)
            : renderVerticalTreeHTML(explorerState.specTree);
        if (explorerState.viewMode === 'mindmap') {
          requestAnimationFrame(() => drawMindMapConnectors());
        }
      }
    });
  }

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-sem-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-sem-action');

    if (action === 'set-mode') {
      const nextMode = btn.getAttribute('data-mode') || 'tree';
      explorerState.viewMode = nextMode;
      rerenderSpecExplorerDOM();
      return;
    }

    if (action === 'toggle-recall-gate') {
      explorerState.testBeforeReveal = !explorerState.testBeforeReveal;
      explorerState.revealedAnchorIds.clear();
      rerenderSpecExplorerDOM();
      return;
    }

    if (action === 'print-skeleton-map') {
      openMindMapPrintModal(explorerState.unitId, explorerState.specTree);
      return;
    }

    if (action === 'set-status-filter') {
      explorerState.statusFilter = btn.getAttribute('data-filter') || 'all';
      rerenderSpecExplorerDOM();
      return;
    }

    if (action === 'reset-spec-filters') {
      explorerState.statusFilter = 'all';
      explorerState.searchQuery = '';
      rerenderSpecExplorerDOM();
      return;
    }

    if (action === 'toggle-kt') {
      const ktId = btn.getAttribute('data-kt-id');
      if (!ktId) return;
      if (explorerState.collapsedKtIds.has(ktId)) explorerState.collapsedKtIds.delete(ktId);
      else explorerState.collapsedKtIds.add(ktId);
      rerenderSpecExplorerDOM();
      return;
    }

    if (action === 'toggle-anchor') {
      const aId = btn.getAttribute('data-anchor-id');
      if (!aId) return;
      if (explorerState.openAnchorIds.has(aId)) explorerState.openAnchorIds.delete(aId);
      else explorerState.openAnchorIds.add(aId);
      rerenderSpecExplorerDOM();
      return;
    }

    if (action === 'reveal-anchor-facts') {
      const aId = btn.getAttribute('data-anchor-id');
      if (!aId) return;
      explorerState.revealedAnchorIds.add(aId);
      rerenderSpecExplorerDOM();
      return;
    }

    if (action === 'toggle-exam-lens') {
      const aId = btn.getAttribute('data-anchor-id');
      if (!aId) return;
      if (explorerState.openLensAnchorIds.has(aId)) explorerState.openLensAnchorIds.delete(aId);
      else explorerState.openLensAnchorIds.add(aId);
      rerenderSpecExplorerDOM();
      return;
    }

    if (action === 'set-item-rag') {
      e.stopPropagation();
      const itemId = btn.getAttribute('data-item-id');
      const rag = btn.getAttribute('data-rag') || 'none';
      if (itemId) {
        setSpecStatus(explorerState.unitId, itemId, rag);
        rerenderSpecExplorerDOM();
      }
      return;
    }

    if (action === 'open-prove-it') {
      e.stopPropagation();
      const stId = btn.getAttribute('data-st-id');
      if (stId) openProveItModal(stId);
      return;
    }

    if (action === 'open-question-drawer') {
      const aId = btn.getAttribute('data-anchor-id');
      const found = findAnchorAndSubTopic(explorerState.specTree, aId);
      const lessonIndex = parseInt(btn.getAttribute('data-lesson-index'), 10);
      const searchTerm = btn.getAttribute('data-search') || '';
      const openMode = btn.getAttribute('data-open-mode') || 'practise';
      openSpecQuestionDrawer({
        title: found?.anchor?.title || searchTerm || 'Exam Practice',
        lessonIndex: isNaN(lessonIndex) ? null : lessonIndex,
        searchTerm,
        openMode,
      });
      return;
    }

    if (action === 'jump-to-lesson') {
      const lessonIndex = parseInt(btn.getAttribute('data-lesson-index'), 10) || 0;
      if (typeof window !== 'undefined' && typeof window.switchView === 'function') {
        window.switchView('lessons', explorerState.unitId, false, { lessonIndex });
      }
      return;
    }

    // Spotlight Mind Map branch selection
    if (action === 'mm-select-kt') {
      const ktId = btn.getAttribute('data-kt-id');
      if (ktId && ktId !== explorerState.mmSelectedKtId) {
        explorerState.mmSelectedKtId = ktId;
        explorerState.mmSelectedStId = null;
        explorerState.mmSelectedAnchorId = null;
        rerenderSpecExplorerDOM();
      }
      return;
    }

    if (action === 'mm-select-st') {
      const stId = btn.getAttribute('data-st-id');
      if (stId && stId !== explorerState.mmSelectedStId) {
        explorerState.mmSelectedStId = stId;
        explorerState.mmSelectedAnchorId = null;
        rerenderSpecExplorerDOM();
      }
      return;
    }

    if (action === 'mm-select-anchor') {
      const aId = btn.getAttribute('data-anchor-id');
      if (aId && aId !== explorerState.mmSelectedAnchorId) {
        explorerState.mmSelectedAnchorId = aId;
        rerenderSpecExplorerDOM();
      }
      return;
    }

    if (action === 'mm-set-submode') {
      explorerState.mmSubMode = btn.getAttribute('data-submode') || 'spotlight';
      rerenderSpecExplorerDOM();
      return;
    }

    if (action === 'mm-jump-from-overview') {
      const ktId = btn.getAttribute('data-kt-id');
      const stId = btn.getAttribute('data-st-id');
      if (ktId) explorerState.mmSelectedKtId = ktId;
      if (stId) explorerState.mmSelectedStId = stId;
      explorerState.mmSelectedAnchorId = null;
      explorerState.mmSubMode = 'spotlight';
      rerenderSpecExplorerDOM();
      return;
    }

    if (action === 'mm-toggle-board-mode') {
      explorerState.boardFullscreen = !explorerState.boardFullscreen;
      document.body?.classList.toggle('sem-board-fullscreen', explorerState.boardFullscreen);
      rerenderSpecExplorerDOM();
    }
  });
}

/**
 * Main entrypoint mounted by Tab 2 (`Spec & Mind Map`) of `src/gcse_exam_spec_hub.js`.
 */
export async function renderSpecExplorerMindMap(rawUnitId, { mountId = 'ehub-tab-spec-mount', initialMode = null } = {}) {
  const unitId = resolveGcseExamUnitId(rawUnitId);
  const switchedUnit = explorerState.unitId !== unitId;
  explorerState.unitId = unitId;
  explorerState.mountId = mountId;

  if (switchedUnit) {
    explorerState.searchQuery = '';
    explorerState.statusFilter = 'all';
    explorerState.mmSelectedKtId = null;
    explorerState.mmSelectedStId = null;
    explorerState.mmSelectedAnchorId = null;
  }

  if (initialMode === 'mindmap' || initialMode === 'tree') {
    explorerState.viewMode = initialMode;
  } else if (typeof window !== 'undefined' && window.innerWidth < 768 && switchedUnit) {
    explorerState.viewMode = 'tree';
  }

  const mountEl = typeof document !== 'undefined' ? document.getElementById(mountId) : null;
  if (mountEl) {
    mountEl.innerHTML = `
      <div style="padding:28px;text-align:center;color:#64748b;">
        <i class="fa-solid fa-spinner fa-spin"></i> Loading Specification &amp; Mind Map...
      </div>
    `;
  }

  const [tree, unitData] = await Promise.all([
    loadUnitSpecTree(unitId),
    ensureUnitLoaded(unitId),
  ]);

  explorerState.specTree = tree;
  explorerState.unitData = unitData;

  rerenderSpecExplorerDOM();

  if (typeof window !== 'undefined' && !window.__semEscResizeBound) {
    window.__semEscResizeBound = true;
    window.addEventListener('resize', () => {
      if (explorerState.viewMode === 'mindmap') {
        requestAnimationFrame(() => drawMindMapConnectors());
      }
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSpecOverlays();
    });
  }
}
