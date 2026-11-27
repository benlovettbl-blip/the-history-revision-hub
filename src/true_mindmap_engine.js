/**
 * src/true_mindmap_engine.js
 *
 * True Centre-Out Radial / Unidirectional Zoomable 5-Ring Mind-Map & Outline Studio (v2).
 * Powered by a Single Source of Truth (`data/mindmaps/<unitId>.json`).
 *
 * v2 Specification-First & Exam-Calibrated Architecture:
 *  - Tier 0 (Centre) : Course Title & Option Code
 *  - Tier 1 (Ring 1) : Official Edexcel Key Topics (`KT1`–`KT3` / `KT4`)
 *  - Tier 2 (Ring 2) : Official Edexcel Numbered Sub-Topics (`1.1`–`3.3`, with Q2 Narrative Chain)
 *  - Tier 3 (Ring 3) : 🎯 Grades 4–5 — 100% of Atomic Edexcel Specification Stems
 *  - Tier 4 (Ring 4) : 🔥 Grades 6–8 — Tagged `[Cause]` / `[Event]` / `[Conseq]` / `[Importance]`
 *  - Tier 5 (Ring 5) : ★ Grade 9 Edge — Gold-Badged Precision Stats, Inquiries, Laws & Individuals
 *
 * Interactive & Classroom Capabilities:
 *  - Auto-Expand on Grade-Pill Tap (`🎯 Grades 4–5` / `🔥 Grades 6–8` / `★ Grade 9 Edge`) + `Unfold All`
 *  - 1-Click Branch Direction Switcher (`↔ Centre` · `→ Right` · `← Left`, persisted in `localStorage`)
 *  - `🙈 Blur Recall` Active-Testing Mode (keeps `[Conseq]`/`[Importance]`/`★` sharp, blurs answer until tapped)
 *  - `🔍 Find on Map` Live Search (auto-unfolds ancestors, highlights matches & glides camera)
 *  - True Vector A4 / A3 Landscape Visual Mind-Map Printer (`🖨️ Print` Modal — Completed Poster & Blank Write-On Blurt Map)
 *  - Multi-Touch 2-Finger Pinch-to-Zoom + True `100vw × 100vh` Full Screen + Deep-Link to `Lesson · Stage`
 */

import './true_mindmap_engine.css';
import { isSupportedGcseUnit, resolveGcseExamUnitId } from './engine/mobile_exam_adapter.js';

function resolveMindMapUnitId(rawUnitId) {
  const cleaned = String(rawUnitId || '').trim();
  if (!cleaned) return 'cme_new';
  if (isSupportedGcseUnit(cleaned)) {
    return resolveGcseExamUnitId(cleaned);
  }
  return cleaned.toLowerCase().replace(/[^a-z0-9_-]/g, '');
}

const mindmapCache = new Map();

const BRANCH_PALETTE = ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#d97706', '#db2777'];
const DIR_STORAGE_KEY = 'hh_tmm_direction_v1';

function readSavedDirection() {
  try {
    const v = typeof localStorage !== 'undefined' ? localStorage.getItem(DIR_STORAGE_KEY) : null;
    if (v === 'center' || v === 'right' || v === 'left') return v;
  } catch (_) {}
  return 'center';
}

function saveDirection(dir) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(DIR_STORAGE_KEY, dir);
    }
  } catch (_) {}
}

const studioState = {
  unitId: 'cme_new',
  mountEl: null,
  data: null,
  fallbackSpecTree: null,
  onOpenQuestionDrawer: null,
  displayMode: 'map', // 'map' | 'outline'
  directionMode: readSavedDirection(), // 'center' | 'right' | 'left'
  maxTier: 5, // No artificial grade ceiling — every node can always unfold 1 ring deeper on tap
  showCardDetail: false, // Used only when stepping to Level 5 on legacy 4-Ring Card maps
  expandedCardIds: new Set(), // Per-card detail toggle on legacy 4-Ring Card maps
  expandedIds: new Set(['root']),
  focusedNodeId: 'root',
  whisperDismissed: false,
  showOutlineGloss: true,
  isFullscreen: false,
  blurRecall: false,
  revealedNodeIds: new Set(),
  searchQuery: '',
  searchMatchIds: new Set(),
  // Camera transform
  zoom: 1,
  panX: 0,
  panY: 0,
  cameraInitialized: false,
};

function escapeHtml(val) {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function shortenPhrase(str, maxWords = 4) {
  const clean = String(str || '')
    .replace(/^Key Topic\s*\d+\s*:\s*/i, '')
    .replace(/^\d+\.\d+\s*/, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const words = clean.split(' ').filter(Boolean);
  if (words.length <= maxWords) return clean;
  return words.slice(0, maxWords).join(' ');
}

/**
 * Maps `node.tag` onto exam-calibrated visual styling across Paper 1, Paper 2B, Paper 2P, and Paper 3.
 */
export function resolveNodeRoleMeta(rawTag, rawForTheme = '') {
  if (!rawTag) return null;
  const t = String(rawTag).trim();
  const lower = t.toLowerCase();
  const theme = String(rawForTheme || '').trim();

  if (
    lower === 'conseq' ||
    lower === 'consequence' ||
    lower === 'result' ||
    lower === 'view 2'
  ) {
    return {
      label: lower === 'view 2' ? '20m View 2' : lower === 'result' ? 'Result' : 'Conseq',
      roleClass: 'role-conseq',
      tagClass: 'tag-conseq',
      svgBg: '#f5f3ff',
      svgBorder: '#8b5cf6',
      svgBadgeBg: '#6d28d9',
      svgText: '#3b0764',
    };
  }
  if (
    lower === 'importance' ||
    lower === 'significance' ||
    lower === 'why it mattered' ||
    lower === 'impact' ||
    lower === 'agree' ||
    lower === 'view 1' ||
    lower === 'solution'
  ) {
    const lbl =
      lower === 'agree'
        ? '16m Agree'
        : lower === 'solution'
          ? 'Solution'
          : lower === 'view 1'
            ? '20m View 1'
            : lower === 'impact'
              ? '16m Impact'
              : lower === 'why it mattered'
                ? 'Why It Mattered'
                : lower === 'significance'
                  ? 'Significance'
                  : theme
                    ? `Q3 Imp → ${theme}`
                    : 'Q3 Importance';
    return {
      label: lbl,
      roleClass: 'role-importance',
      tagClass: 'tag-importance',
      svgBg: '#ecfdf5',
      svgBorder: '#10b981',
      svgBadgeBg: '#047857',
      svgText: '#064e3b',
    };
  }
  if (lower === 'cause' || lower === 'why' || lower === 'factor' || lower === 'problem') {
    const lbl =
      lower === 'why'
        ? '12m Why'
        : lower === 'problem'
          ? 'Problem'
          : lower === 'factor'
            ? theme
              ? `Factor · ${theme}`
              : '12m Factor'
            : 'Cause';
    return {
      label: lbl,
      roleClass: 'role-cause',
      tagClass: 'tag-cause',
      svgBg: '#fff7ed',
      svgBorder: '#f97316',
      svgBadgeBg: '#c2410c',
      svgText: '#7c2d12',
    };
  }
  if (lower === 'continuity' || lower === 'source check' || lower === 'source context') {
    return {
      label: lower === 'continuity' ? 'Continuity' : 'Source Check',
      roleClass: 'role-continuity',
      tagClass: 'tag-continuity',
      svgBg: '#eef2ff',
      svgBorder: '#6366f1',
      svgBadgeBg: '#4338ca',
      svgText: '#312e81',
    };
  }
  if (lower === 'follow-up' || lower === 'followup' || lower === 'follow-up record') {
    return {
      label: 'Follow-Up',
      roleClass: 'role-followup',
      tagClass: 'tag-followup',
      svgBg: '#fffbeb',
      svgBorder: '#f59e0b',
      svgBadgeBg: '#b45309',
      svgText: '#78350f',
    };
  }
  if (
    lower === 'debate' ||
    lower === 'interpretation' ||
    lower === 'counter' ||
    lower === 'limit' ||
    lower === 'limitation'
  ) {
    const lbl =
      lower === 'counter'
        ? '16m Counter'
        : lower === 'limit' || lower === 'limitation'
          ? 'Limitation'
          : 'Debate';
    return {
      label: lbl,
      roleClass: 'role-debate',
      tagClass: 'tag-debate',
      svgBg: '#fdf2f8',
      svgBorder: '#ec4899',
      svgBadgeBg: '#be185d',
      svgText: '#831843',
    };
  }
  const eventLbl =
    lower === 'feature'
      ? '4m Feature'
      : lower === 'change'
        ? 'Change'
        : lower === 'evidence'
          ? 'Evidence'
          : t;
  return {
    label: eventLbl,
    roleClass: 'role-event',
    tagClass: 'tag-event',
    svgBg: '#f0f9ff',
    svgBorder: '#0ea5e9',
    svgBadgeBg: '#0369a1',
    svgText: '#0c4a6e',
  };
}

function getPaperLegendMeta(data) {
  const code = String(data?.optionCode || '').toUpperCase();
  const pType = String(data?.paperType || '').toLowerCase();
  if (code === 'KS2' || pType === 'ks2') {
    return {
      isGcse: false,
      r2Badge: '🧭 Lesson Milestones',
      modalTagSummary: '[Cause], [Result] & [Why It Mattered]',
      pillsHtml:
        '<span class="tmm-role-tag tag-cause">Cause</span><span class="tmm-role-tag tag-event">Event</span><span class="tmm-role-tag tag-conseq">Result</span><span class="tmm-role-tag tag-importance">Why It Mattered</span>',
      printPillsHtml:
        '<b class="lp c">CAUSE</b><b class="lp e">EVENT</b><b class="lp q1">RESULT</b><b class="lp q3">WHY IT MATTERED</b>',
    };
  }
  if (code === 'KS3' || pType === 'ks3') {
    return {
      isGcse: false,
      r2Badge: '🧭 Enquiry Turning Points',
      modalTagSummary: '[Cause], [Conseq] & [Significance]',
      pillsHtml:
        '<span class="tmm-role-tag tag-cause">Cause</span><span class="tmm-role-tag tag-event">Event</span><span class="tmm-role-tag tag-conseq">Conseq</span><span class="tmm-role-tag tag-importance">Significance</span>',
      printPillsHtml:
        '<b class="lp c">CAUSE</b><b class="lp e">EVENT</b><b class="lp q1">CONSEQ</b><b class="lp q3">SIGNIFICANCE</b>',
    };
  }
  if (code.includes('31') || code.includes('33') || pType.includes('paper 3') || pType.includes('modern depth')) {
    return {
      isGcse: true,
      r2Badge: '⚖️ Q3d Core Debate',
      modalTagSummary: '[12m Why], [20m View 1] & [20m View 2]',
      pillsHtml:
        '<span class="tmm-role-tag tag-cause">12m Why</span><span class="tmm-role-tag tag-event">Evidence</span><span class="tmm-role-tag tag-importance">20m View 1</span><span class="tmm-role-tag tag-conseq">20m View 2</span>',
      printPillsHtml:
        '<b class="lp c">12M WHY</b><b class="lp e">EVIDENCE</b><b class="lp q3">20M VIEW 1</b><b class="lp q1">20M VIEW 2</b>',
    };
  }
  if (code.includes('B4') || pType.includes('paper 2b') || pType.includes('british depth')) {
    return {
      isGcse: true,
      r2Badge: '⚖️ 16m Essay & Causation Lens',
      modalTagSummary: '[4m Feature], [12m Why], [16m Agree] & [16m Counter]',
      pillsHtml:
        '<span class="tmm-role-tag tag-event">4m Feature</span><span class="tmm-role-tag tag-cause">12m Why</span><span class="tmm-role-tag tag-importance">16m Agree</span><span class="tmm-role-tag tag-debate">16m Counter</span>',
      printPillsHtml:
        '<b class="lp e">4M FEATURE</b><b class="lp c">12M WHY</b><b class="lp q3">16M AGREE</b><b class="lp d">16M COUNTER</b>',
    };
  }
  if (code.includes('11') || pType.includes('paper 1') || pType.includes('thematic')) {
    return {
      isGcse: true,
      r2Badge: '🔄 Era Pattern & Enquiry Lens',
      modalTagSummary: '[4m Feature / Change], [Source Check / Follow-Up], [12m Factor] & [16m Impact]',
      pillsHtml:
        '<span class="tmm-role-tag tag-event">4m Feature / Change</span><span class="tmm-role-tag tag-continuity">Continuity / Source</span><span class="tmm-role-tag tag-cause">12m Factor</span><span class="tmm-role-tag tag-importance">16m Impact</span>',
      printPillsHtml:
        '<b class="lp e">FEATURE / CHANGE</b><b class="lp c">12M FACTOR</b><b class="lp q3">16M IMPACT</b><b class="lp d">LIMITATION</b>',
    };
  }
  return {
    isGcse: true,
    r2Badge: '🔗 Q2 Narrative Chain',
    modalTagSummary: '[Cause], [Conseq] & [Importance → Theme]',
    pillsHtml:
      '<span class="tmm-role-tag tag-cause">Cause</span><span class="tmm-role-tag tag-conseq">Q1 Conseq</span><span class="tmm-role-tag tag-importance">Q3 Importance → Theme</span>',
    printPillsHtml:
      '<b class="lp c">CAUSE</b><b class="lp q1">Q1 CONSEQ</b><b class="lp q3">Q3 IMPORTANCE → THEME</b>',
  };
}

/**
 * Resilient 5-Ring fallback converter if a unit is offline or mid-build.
 */
function synthesizeMindMapFromSpecTree(specTree) {
  const kts = specTree?.keyTopics || [];
  const children = [];
  let colorIdx = 0;

  kts.forEach((kt, ktIdx) => {
    const side = ktIdx % 2 === 0 ? 'left' : 'right';
    const color = BRANCH_PALETTE[colorIdx++ % BRANCH_PALETTE.length];
    const stNodes = (kt.subTopics || []).map((st) => ({
      id: st.id,
      code: st.code || '',
      label: `${st.code ? `${st.code} ` : ''}${shortenPhrase(st.title, 4)}`.trim(),
      dateChip: st.dateFence || '',
      tier: 2,
      lessonIndex: st.linkedLessonIndices?.[0] ?? 0,
      stageIndex: 0,
      searchTerm: shortenPhrase(st.title, 3),
      gloss: `${st.title}${st.dateFence ? ` (${st.dateFence})` : ''}.`,
      children: (st.anchors || []).map((a, aIdx) => ({
        id: a.id,
        label: shortenPhrase(a.title, 4),
        dateChip: a.dateTag || '',
        tier: 3,
        lessonIndex: a.lessonIndex ?? 0,
        stageIndex: aIdx % 5,
        searchTerm: a.questionSearchTerm || shortenPhrase(a.title, 3),
        gloss: (a.facts && a.facts[0]) || a.title,
        children: (a.facts || []).slice(0, 2).map((f, fIdx) => ({
          id: `${a.id}_g${fIdx}`,
          tag: fIdx === 0 ? 'Cause' : 'Conseq',
          label: shortenPhrase(f, 4),
          tier: 4,
          lessonIndex: a.lessonIndex ?? 0,
          stageIndex: aIdx % 5,
          searchTerm: a.questionSearchTerm || shortenPhrase(a.title, 3),
          gloss: f,
          children:
            a.facts && a.facts[2] && fIdx === 0
              ? [
                  {
                    id: `${a.id}_m0`,
                    label: shortenPhrase(a.facts[2], 4),
                    tier: 5,
                    lessonIndex: a.lessonIndex ?? 0,
                    stageIndex: aIdx % 5,
                    searchTerm: a.questionSearchTerm || shortenPhrase(a.title, 3),
                    gloss: a.facts[2],
                  },
                ]
              : [],
        })),
      })),
    }));

    children.push({
      id: kt.id,
      keyTopicNumber: kt.number || ktIdx + 1,
      label: shortenPhrase(kt.title, 4),
      dateChip: kt.dateFence || '',
      side,
      color,
      tier: 1,
      lessonIndex: stNodes[0]?.lessonIndex ?? 0,
      stageIndex: 0,
      gloss: kt.outsideFenceWarning || kt.title,
      children: stNodes,
    });
  });

  return {
    unitId: specTree?.unitId || 'cme_new',
    optionCode: specTree?.optionCode || '1HI0',
    courseTitle: specTree?.courseTitle || 'GCSE History',
    disclaimer:
      specTree?.disclaimer ||
      'Aligned to Pearson Edexcel GCSE (9–1) History (1HI0). Independent educational resource — not endorsed by Pearson.',
    root: {
      id: 'root',
      tier: 0,
      label: shortenPhrase(specTree?.courseTitle || 'GCSE Course', 4),
      subLabel: specTree?.examDateBoundary || specTree?.optionCode || '',
      gloss: specTree?.courseTitle || '',
      children,
    },
  };
}

export function clearMindMapCache(unitId = null) {
  if (unitId) {
    mindmapCache.delete(resolveMindMapUnitId(unitId));
  } else {
    mindmapCache.clear();
  }
}

export async function loadMindMapSingleSource(rawUnitId, fallbackSpecTree = null) {
  const unitId = resolveMindMapUnitId(rawUnitId);
  if (mindmapCache.has(unitId)) {
    return mindmapCache.get(unitId);
  }

  try {
    const resp = await fetch(`/data/mindmaps/${unitId}.json`);
    if (resp.ok) {
      const json = await resp.json();
      if (json && json.root && Array.isArray(json.root.children)) {
        mindmapCache.set(unitId, json);
        return json;
      }
    }
  } catch (_) {}

  return synthesizeMindMapFromSpecTree(fallbackSpecTree);
}

function findNodeById(node, targetId, parentContext = null) {
  if (!node) return null;
  const ctx = {
    node,
    color: node.color || parentContext?.color || '#2563eb',
    lessonIndex:
      typeof node.lessonIndex === 'number' ? node.lessonIndex : parentContext?.lessonIndex ?? 0,
    stageIndex:
      typeof node.stageIndex === 'number' ? node.stageIndex : parentContext?.stageIndex ?? null,
    searchTerm: node.searchTerm || parentContext?.searchTerm || node.label,
  };
  if (node.id === targetId) return ctx;
  for (const ch of node.children || []) {
    const found = findNodeById(ch, targetId, ctx);
    if (found) return found;
  }
  return null;
}

function getTreeMaxDepth(node) {
  if (!node || !Array.isArray(node.children) || node.children.length === 0) {
    return node?.tier || 0;
  }
  let m = node.tier || 0;
  for (const ch of node.children) {
    const cm = getTreeMaxDepth(ch);
    if (cm > m) m = cm;
  }
  return m;
}

function isFourRingCardMap(data) {
  if (!data?.root) return false;
  if (data.schemaVersion === 'v8-4ring-cards') return true;
  return getTreeMaxDepth(data.root) <= 4;
}

/**
 * Inspects currently visible nodes in `expandedIds` to determine:
 *  - `currentLevel` (`1..5`)
 *  - `shallowestClosedParentTier` (for `+ Ring` 1-level step up)
 *  - `deepestExpandedParentTier` (for `− Ring` 1-level step down)
 */
function computeRingStepperInfo(root, fourRing = false) {
  const activeMaxTier = studioState.maxTier || 5;
  let deepestVisibleTier = 1;
  let shallowestClosedParentTier = Infinity;
  let deepestExpandedParentTier = 0;

  function walkVisible(node) {
    if (!node) return;
    const tier = typeof node.tier === 'number' ? node.tier : 0;
    if (tier > deepestVisibleTier) deepestVisibleTier = tier;

    const hasKids =
      Array.isArray(node.children) && node.children.length > 0 && tier + 1 <= activeMaxTier;
    const isOpen = node.id === 'root' || studioState.expandedIds.has(node.id);

    if (hasKids) {
      if (isOpen) {
        if (tier >= 1 && tier > deepestExpandedParentTier) {
          deepestExpandedParentTier = tier;
        }
        node.children.forEach(walkVisible);
      } else if (tier >= 1 && tier < shallowestClosedParentTier) {
        shallowestClosedParentTier = tier;
      }
    } else if (
      fourRing &&
      activeMaxTier >= 5 &&
      tier === 4 &&
      node.detail &&
      !studioState.showCardDetail &&
      !studioState.expandedCardIds.has(node.id)
    ) {
      if (4 < shallowestClosedParentTier) shallowestClosedParentTier = 4;
    }
  }

  walkVisible(root);

  let currentLevel = deepestVisibleTier;
  if (
    fourRing &&
    activeMaxTier >= 5 &&
    deepestVisibleTier >= 4 &&
    (studioState.showCardDetail || studioState.expandedCardIds.size > 0)
  ) {
    currentLevel = 5;
  }

  const canStepDown =
    deepestExpandedParentTier >= 1 ||
    studioState.showCardDetail ||
    studioState.expandedCardIds.size > 0;
  const canStepUp = isFinite(shallowestClosedParentTier);

  return {
    currentLevel,
    totalLevels: activeMaxTier,
    shallowestClosedParentTier,
    deepestExpandedParentTier,
    canStepDown,
    canStepUp,
  };
}

function stepRingUp(root, fourRing = false) {
  const activeMaxTier = studioState.maxTier || 5;
  const info = computeRingStepperInfo(root, fourRing);
  if (!info.canStepUp) return false;

  if (fourRing && activeMaxTier >= 5 && info.shallowestClosedParentTier === 4) {
    studioState.showCardDetail = true;
    return true;
  }

  const toExpand = [];
  function walkVisible(node) {
    if (!node) return;
    const tier = typeof node.tier === 'number' ? node.tier : 0;
    const hasKids =
      Array.isArray(node.children) && node.children.length > 0 && tier + 1 <= activeMaxTier;
    const isOpen = node.id === 'root' || studioState.expandedIds.has(node.id);
    if (hasKids && !isOpen && tier === info.shallowestClosedParentTier) {
      toExpand.push(node.id);
      return;
    }
    if (hasKids && isOpen) {
      node.children.forEach(walkVisible);
    }
  }
  walkVisible(root);
  toExpand.forEach((id) => studioState.expandedIds.add(id));
  return toExpand.length > 0;
}

function stepRingDown(root, fourRing = false) {
  const info = computeRingStepperInfo(root, fourRing);
  if (!info.canStepDown) return false;

  if (
    fourRing &&
    (studioState.showCardDetail || studioState.expandedCardIds.size > 0)
  ) {
    studioState.showCardDetail = false;
    studioState.expandedCardIds.clear();
    return true;
  }

  function pruneAtOrAbove(node) {
    if (!node) return;
    const tier = typeof node.tier === 'number' ? node.tier : 0;
    if (node.id !== 'root' && tier >= info.deepestExpandedParentTier) {
      studioState.expandedIds.delete(node.id);
    }
    (node.children || []).forEach(pruneAtOrAbove);
  }
  pruneAtOrAbove(root);
  studioState.expandedIds.add('root');
  return true;
}

function isNodeBlurredInRecall(node) {
  if (!studioState.blurRecall) return false;
  if ((node.tier || 0) < 4) return false;
  return !studioState.revealedNodeIds.has(node.id);
}

/**
 * Computes deterministic, non-overlapping (x, y) coordinates around `(0, 0)`
 * across `center`, `right`, or `left` branch direction modes.
 */
export function computeBidirectionalLayout(root, opts = null) {
  const maxTier = opts?.maxTier ?? studioState.maxTier ?? 5;
  const showCardDetail = opts?.showCardDetail ?? studioState.showCardDetail;
  const expandedCardIds = opts?.expandedCardIds ?? studioState.expandedCardIds;
  const expandedIds = opts?.expandedIds ?? studioState.expandedIds;
  const expandAll = Boolean(opts?.expandAll);
  const directionMode = opts?.directionMode || studioState.directionMode || 'center';
  const anyCardDetailOpen = showCardDetail || (expandedCardIds && expandedCardIds.size > 0);
  const stepTable =
    opts?.stepTable ||
    (anyCardDetailOpen
      ? { 1: 295, 2: 635, 3: 1015, 4: 1515, 5: 1805 }
      : { 1: 280, 2: 590, 3: 940, 4: 1325, 5: 1695 });
  const slotTable =
    opts?.slotTable ||
    (anyCardDetailOpen
      ? { 1: 66, 2: 56, 3: 48, 4: 78, 5: 39 }
      : { 1: 60, 2: 50, 3: 44, 4: 40, 5: 29 });

  const placedNodes = [];
  const placedLinks = [];

  function visChildrenOf(node, depthFromRoot) {
    if (!node || !Array.isArray(node.children) || node.children.length === 0) return [];
    const nextSemanticTier = typeof node.tier === 'number' ? node.tier + 1 : depthFromRoot + 1;
    if (nextSemanticTier > maxTier) return [];
    if (!expandAll && depthFromRoot > 0 && !expandedIds.has(node.id)) return [];
    return node.children;
  }

  function hiddenCountOf(node, depthFromRoot) {
    if (!node || !Array.isArray(node.children) || node.children.length === 0) return 0;
    const nextSemanticTier = typeof node.tier === 'number' ? node.tier + 1 : depthFromRoot + 1;
    if (nextSemanticTier > maxTier) return 0;
    if (expandAll || depthFromRoot === 0 || expandedIds.has(node.id)) return 0;
    return node.children.length;
  }

  function measureSpan(node, depthFromRoot) {
    const vis = visChildrenOf(node, depthFromRoot);
    const tierKey = node.tier || depthFromRoot;
    if (vis.length === 0) {
      node._span = slotTable[tierKey] || 39;
      return node._span;
    }
    let sum = 0;
    vis.forEach((ch) => {
      sum += measureSpan(ch, depthFromRoot + 1);
    });
    if (depthFromRoot === 1 && vis.length > 0) {
      sum += 14;
    }
    node._span = Math.max(slotTable[tierKey] || 42, sum);
    return node._span;
  }

  function assignPositions(
    node,
    depthFromRoot,
    side,
    topY,
    inheritedColor,
    inheritedLesson,
    inheritedStage,
    inheritedSearch,
  ) {
    const color = node.color || inheritedColor || '#2563eb';
    const lessonIdx = typeof node.lessonIndex === 'number' ? node.lessonIndex : inheritedLesson;
    const stageIdx = typeof node.stageIndex === 'number' ? node.stageIndex : inheritedStage;
    const searchTerm = node.searchTerm || inheritedSearch || node.label;
    const dir = side === 'left' ? -1 : 1;
    const x = dir * (stepTable[depthFromRoot] || depthFromRoot * 310);

    const vis = visChildrenOf(node, depthFromRoot);
    let y = topY + node._span / 2;

    if (vis.length > 0) {
      const childrenTotal = vis.reduce((acc, c) => acc + c._span, 0);
      let cursorY = topY + (node._span - childrenTotal) / 2;
      const childCoords = [];
      vis.forEach((ch) => {
        const cy = assignPositions(
          ch,
          depthFromRoot + 1,
          side,
          cursorY,
          color,
          lessonIdx,
          stageIdx,
          searchTerm,
        );
        childCoords.push({ ch, cy });
        cursorY += ch._span;
      });
      y = (childCoords[0].cy + childCoords[childCoords.length - 1].cy) / 2;

      childCoords.forEach(({ ch, cy }) => {
        const childDepth = depthFromRoot + 1;
        const childX = dir * (stepTable[childDepth] || childDepth * 310);
        placedLinks.push({
          x1: x,
          y1: y,
          x2: childX,
          y2: cy,
          tier: ch.tier || childDepth,
          depthFromRoot: childDepth,
          color,
        });
      });
    }

    placedNodes.push({
      id: node.id,
      label: node.label,
      detail: node.detail || '',
      tag: node.tag || '',
      forTheme: node.forTheme || '',
      code: node.code || '',
      dateChip: node.dateChip || '',
      tier: typeof node.tier === 'number' ? node.tier : depthFromRoot,
      depthFromRoot,
      side,
      color,
      x,
      y,
      hiddenCount: hiddenCountOf(node, depthFromRoot),
      isExpanded: (expandAll || expandedIds.has(node.id)) && vis.length > 0,
      hasExpandableWithinCap:
        Array.isArray(node.children) &&
        node.children.length > 0 &&
        (typeof node.tier === 'number' ? node.tier + 1 : depthFromRoot + 1) <= maxTier,
      lessonIndex: lessonIdx,
      stageIndex: stageIdx,
      searchTerm,
    });

    return y;
  }

  placedNodes.push({
    id: root.id,
    label: root.label,
    subLabel: root.subLabel || '',
    tier: 0,
    depthFromRoot: 0,
    x: 0,
    y: 0,
    color: root.color || '#2563eb',
    hiddenCount: 0,
    isExpanded: true,
    hasExpandableWithinCap: true,
  });

  const trunks = root.children || [];
  let leftTrunks = [];
  let rightTrunks = [];

  if (directionMode === 'right') {
    rightTrunks = [...trunks];
  } else if (directionMode === 'left') {
    leftTrunks = [...trunks];
  } else {
    leftTrunks = trunks.filter((t, idx) => (t.side ? t.side === 'left' : idx % 2 === 0));
    rightTrunks = trunks.filter((t, idx) => (t.side ? t.side === 'right' : idx % 2 === 1));
  }

  const layoutSide = (list, side) => {
    if (list.length === 0) return;
    const TRUNK_GAP = 24;
    let totalSpan = 0;
    list.forEach((t, i) => {
      totalSpan += measureSpan(t, 1);
      if (i > 0) totalSpan += TRUNK_GAP;
    });
    let cursorY = -totalSpan / 2;
    list.forEach((t) => {
      const defaultLesson = typeof t.lessonIndex === 'number' ? t.lessonIndex : 0;
      const ty = assignPositions(t, 1, side, cursorY, t.color, defaultLesson, null, t.label);
      const dir = side === 'left' ? -1 : 1;
      placedLinks.push({
        x1: dir * 74,
        y1: 0,
        x2: dir * stepTable[1],
        y2: ty,
        tier: t.tier || 1,
        depthFromRoot: 1,
        color: t.color || '#2563eb',
      });
      cursorY += t._span + TRUNK_GAP;
    });
  };

  layoutSide(leftTrunks, 'left');
  layoutSide(rightTrunks, 'right');

  // Tight bounding box around actual placed nodes (so unidirectional `→ Right` / `← Left` trees use 100% of screen width!)
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let focMinX = Infinity;
  let focMaxX = -Infinity;
  let focMinY = Infinity;
  let focMaxY = -Infinity;
  const hasDeepNodes = placedNodes.some((n) => n.tier >= 3);

  placedNodes.forEach((n) => {
    const padX =
      n.depthFromRoot === 0
        ? 135
        : n.tier === 4 && showCardDetail
          ? 174
          : n.tier >= 4
            ? 168
            : n.tier === 3
              ? 165
              : n.tier === 2
                ? 152
                : 138;
    const padY = n.tier === 4 && showCardDetail ? 44 : n.tier === 5 ? 20 : 32;
    if (n.x - padX < minX) minX = n.x - padX;
    if (n.x + padX > maxX) maxX = n.x + padX;
    if (n.y - padY < minY) minY = n.y - padY;
    if (n.y + padY > maxY) maxY = n.y + padY;

    // Smart Focus Bounds: when exploring 1 Sub-Topic (Focus Mode), frame the deep nodes + active trunk + root!
    if (hasDeepNodes && (n.depthFromRoot === 0 || n.tier >= 3 || (n.tier <= 2 && n.isExpanded))) {
      if (n.x - padX < focMinX) focMinX = n.x - padX;
      if (n.x + padX > focMaxX) focMaxX = n.x + padX;
      if (n.y - padY < focMinY) focMinY = n.y - padY;
      if (n.y + padY > focMaxY) focMaxY = n.y + padY;
    }
  });
  if (!isFinite(minX)) {
    minX = -160;
    maxX = 160;
    minY = -100;
    maxY = 100;
  }
  const fullBounds = { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
  const focusBounds = isFinite(focMinX)
    ? {
        minX: focMinX,
        maxX: focMaxX,
        minY: focMinY,
        maxY: focMaxY,
        width: focMaxX - focMinX,
        height: focMaxY - focMinY,
      }
    : fullBounds;

  return {
    nodes: placedNodes,
    links: placedLinks,
    bounds: fullBounds,
    focusBounds,
  };
}

function renderSvgLinksHTML(links) {
  const OFFSET = 8000;
  const strokeWidths = { 1: 3.6, 2: 2.4, 3: 1.8, 4: 1.45, 5: 1.2 };
  return links
    .map((lk) => {
      const x1 = lk.x1 + OFFSET;
      const y1 = lk.y1 + OFFSET;
      const x2 = lk.x2 + OFFSET;
      const y2 = lk.y2 + OFFSET;
      const dx = (x2 - x1) * 0.52;
      const sw = strokeWidths[lk.tier] || 1.4;
      return `<path class="tmm-branch-path" d="M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${(x1 + dx).toFixed(1)} ${y1.toFixed(1)}, ${(x2 - dx).toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${escapeHtml(lk.color)}" stroke-width="${sw}" stroke-opacity="0.82" />`;
    })
    .join('');
}

function renderMapNodesHTML(nodes) {
  const hasActiveSearch = studioState.searchQuery.trim().length >= 2 && studioState.searchMatchIds.size > 0;

  return nodes
    .map((n) => {
      if (n.tier === 0) {
        return `
          <button
            type="button"
            class="tmm-node tier-0 ${studioState.focusedNodeId === n.id ? 'is-focused' : ''}"
            style="left:${n.x.toFixed(1)}px;top:${n.y.toFixed(1)}px;"
            data-tmm-node="${escapeHtml(n.id)}"
          >
            ${n.subLabel ? `<span class="tmm-root-sub">${escapeHtml(n.subLabel)}</span>` : ''}
            <span>${escapeHtml(n.label)}</span>
          </button>
        `;
      }

      const roleMeta = n.tier === 4 ? resolveNodeRoleMeta(n.tag, n.forTheme) : null;
      const roleTagHtml = roleMeta
        ? `<span class="tmm-role-tag ${roleMeta.tagClass}">${escapeHtml(roleMeta.label)}</span>`
        : '';
      const countBadge =
        n.hiddenCount > 0 ? `<span class="tmm-count-dot">+${n.hiddenCount}</span>` : '';
      const dateHtml = n.dateChip
        ? `<span class="tmm-date-chip">${escapeHtml(n.dateChip)}</span>`
        : '';
      const masteryStar =
        n.tier === 5 ? `<span class="tmm-twig-dot" aria-hidden="true"></span>` : '';

      const isFleshedCard =
        n.tier === 4 &&
        (studioState.showCardDetail || studioState.expandedCardIds.has(n.id)) &&
        Boolean(n.detail);
      const isBlurred = isNodeBlurredInRecall(n);
      const isMatch = hasActiveSearch && studioState.searchMatchIds.has(n.id);
      const isDimmed = hasActiveSearch && !isMatch && n.tier >= 3;

      const extraClasses = [
        `tier-${n.tier}`,
        isFleshedCard ? 'is-fleshed-card' : '',
        roleMeta ? roleMeta.roleClass : '',
        n.isExpanded ? 'is-expanded' : '',
        studioState.focusedNodeId === n.id ? 'is-focused' : '',
        isBlurred ? 'is-blurred-recall' : '',
        isMatch ? 'is-search-match' : '',
        isDimmed ? 'is-search-dimmed' : '',
      ]
        .filter(Boolean)
        .join(' ');

      if (isFleshedCard) {
        return `
          <button
            type="button"
            class="tmm-node ${extraClasses}"
            style="left:${n.x.toFixed(1)}px;top:${n.y.toFixed(1)}px;--branch-color:${escapeHtml(n.color)};"
            data-tmm-node="${escapeHtml(n.id)}"
          >
            <span class="tmm-card-head">
              ${roleTagHtml}
              <span class="tmm-node-text">${escapeHtml(n.label)}</span>
              ${dateHtml}
            </span>
            <span class="tmm-card-detail">${escapeHtml(n.detail)}</span>
          </button>
        `;
      }

      return `
        <button
          type="button"
          class="tmm-node ${extraClasses}"
          style="left:${n.x.toFixed(1)}px;top:${n.y.toFixed(1)}px;--branch-color:${escapeHtml(n.color)};"
          data-tmm-node="${escapeHtml(n.id)}"
        >
          ${roleTagHtml}
          ${masteryStar}
          <span class="tmm-node-text">${escapeHtml(n.label)}</span>
          ${dateHtml}
          ${countBadge}
        </button>
      `;
    })
    .join('');
}

function formatLessonStageRef(unitId, lessonIndex, stageIndex) {
  if (typeof lessonIndex !== 'number') return '';
  const displayLessonNum = unitId === 'cme_new' ? lessonIndex : lessonIndex + 1;
  if (displayLessonNum <= 0) return '';
  const stagePart = typeof stageIndex === 'number' ? ` · Stage ${stageIndex + 1}` : '';
  return `Lesson ${displayLessonNum}${stagePart}`;
}

function openFocusedLessonStage(unitId, lessonIndex, stageIndex) {
  if (typeof window === 'undefined' || typeof lessonIndex !== 'number') return;

  if (studioState.isFullscreen && document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
  studioState.isFullscreen = false;
  if (typeof document !== 'undefined') {
    document.body.classList.remove('tmm-fullscreen-active');
  }

  window._unitReturnOrigin = {
    unitId,
    view: 'mock-exams',
    tab: 'mindmap',
    scrollY: window.scrollY || 0,
  };
  window._unitReturnOriginCustomTs = Date.now();

  if (typeof window.switchView === 'function') {
    window.switchView('lessons', unitId).then(() => {
      if (typeof window.renderLessonByIndex === 'function') {
        window.renderLessonByIndex(lessonIndex);
      } else if (typeof window.viewLessonDetail === 'function') {
        window.viewLessonDetail(lessonIndex);
      }
      if (typeof stageIndex === 'number' && stageIndex >= 0) {
        setTimeout(() => {
          const blocks = document.querySelectorAll(
            '.narrative-visual-row, .narrative-block-card, [data-stage-index]',
          );
          const target = blocks[stageIndex];
          if (target && target.scrollIntoView) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 260);
      }
    });
    return;
  }

  const stageParam = typeof stageIndex === 'number' ? `&stage=${stageIndex + 1}` : '';
  window.location.href = `/?unit=${encodeURIComponent(unitId)}&view=lessons&lesson=${lessonIndex}${stageParam}`;
}

function renderOutlineBranchHTML(node, color, inheritedLesson = 0, inheritedStage = null) {
  const nextTier = (node.tier || 0) + 1;
  const canHaveChildren =
    Array.isArray(node.children) && node.children.length > 0 && nextTier <= studioState.maxTier;
  const isOpen = studioState.expandedIds.has(node.id);
  const lessonIdx = typeof node.lessonIndex === 'number' ? node.lessonIndex : inheritedLesson;
  const stageIdx = typeof node.stageIndex === 'number' ? node.stageIndex : inheritedStage;

  const roleMeta = node.tier === 4 ? resolveNodeRoleMeta(node.tag, node.forTheme) : null;
  const roleTagHtml = roleMeta
    ? `<span class="tmm-role-tag ${roleMeta.tagClass}">${escapeHtml(roleMeta.label)}</span>`
    : '';

  const tierBadge =
    node.tier === 2
      ? '<span class="tmm-out-tier-badge t2">Sub-Topic</span>'
      : node.tier === 3
        ? '<span class="tmm-out-tier-badge t3">Spec Event</span>'
        : node.tier === 4 && !roleMeta
          ? '<span class="tmm-out-tier-badge t4">Key Point</span>'
          : node.tier === 5
            ? '<span class="tmm-out-tier-badge t5">Fact</span>'
            : '';

  const caret = canHaveChildren ? (isOpen ? '▾' : '▸') : '•';
  const isFocused = studioState.focusedNodeId === node.id;
  const isBlurred = isNodeBlurredInRecall(node);
  const isSearchMatch =
    studioState.searchQuery.trim().length >= 2 && studioState.searchMatchIds.has(node.id);
  const refLabel =
    node.tier >= 2 ? formatLessonStageRef(studioState.unitId, lessonIdx, stageIdx) : '';

  const childrenHtml =
    canHaveChildren && isOpen
      ? `<ul class="tmm-out-ul">${node.children.map((c) => `<li>${renderOutlineBranchHTML(c, color, lessonIdx, stageIdx)}</li>`).join('')}</ul>`
      : '';

  return `
    <div>
      <div class="tmm-out-row ${isFocused ? 'is-focused-row' : ''} ${isBlurred ? 'is-blurred-recall' : ''} ${isSearchMatch ? 'is-search-match' : ''}" data-tmm-outline-toggle="${escapeHtml(node.id)}">
        <span class="tmm-out-caret">${caret}</span>
        ${roleTagHtml}
        <span class="tmm-out-label" style="white-space:nowrap;">${escapeHtml(node.label)}</span>
        ${node.dateChip ? `<span style="font-size:0.71rem;font-weight:700;color:#2563eb;white-space:nowrap;flex-shrink:0;">(${escapeHtml(node.dateChip)})</span>` : ''}
        ${tierBadge}
        ${
          studioState.showOutlineGloss && node.gloss
            ? `<span class="tmm-out-gloss">&mdash; ${escapeHtml(node.gloss)}</span>`
            : ''
        }
        ${
          isFocused && refLabel
            ? `<button type="button" class="tmm-out-jump-btn" data-tmm-action="open-node-lesson" data-lesson="${lessonIdx}" data-stage="${stageIdx ?? ''}">📖 ${escapeHtml(refLabel)}</button>`
            : ''
        }
      </div>
      ${childrenHtml}
    </div>
  `;
}

function renderOutlineViewHTML(root) {
  const trunks = root.children || [];
  const isKs2Outline = String(studioState.unitId || '').toLowerCase().startsWith('ks2_');
  return `
    <div class="tmm-outline-card">
      <div class="tmm-outline-toolbar">
        <div>
          <strong style="font-size:0.95rem;">${escapeHtml(root.label)} &mdash; ${isKs2Outline ? 'Story &amp; Key Clues Outline' : 'Specification-First 5-Ring Outline'}</strong>
          <div style="font-size:0.76rem;color:#64748b;">${isKs2Outline ? 'Tap any enquiry or milestone to explore the key events and clues in our story.' : 'Powered by the exact same Single Source of Truth as your Mind Map. Reading down Ring 3 inside any Sub-Topic gives the Q2 Narrative Chain; Ring 4 gives Q1 Consequences &amp; Q3 Importance.'}</div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <button type="button" class="tmm-action-pill" data-tmm-action="toggle-outline-gloss">
            💬 ${studioState.showOutlineGloss ? 'Keywords Only (Hide Notes)' : 'Show 1-Line Notes'}
          </button>
          <button type="button" class="tmm-action-pill" data-tmm-action="expand-all-visible">Unfold All</button>
          <button type="button" class="tmm-action-pill" data-tmm-action="reset-map">Collapse All</button>
        </div>
      </div>

      ${trunks
        .map(
          (tr) => `
            <div class="tmm-out-trunk" style="--branch-color:${escapeHtml(tr.color || '#2563eb')};">
              ${renderOutlineBranchHTML(tr, tr.color || '#2563eb', tr.lessonIndex ?? 0, null)}
            </div>
          `,
        )
        .join('')}
    </div>
  `;
}

function applyWorldTransform(glide = false) {
  const world = studioState.mountEl?.querySelector('#tmm-world');
  const zoomLbl = studioState.mountEl?.querySelector('#tmm-zoom-lbl');
  if (!world) return;
  if (glide) {
    world.classList.add('is-gliding');
    setTimeout(() => world.classList.remove('is-gliding'), 340);
  }
  world.style.transform = `translate(${studioState.panX.toFixed(1)}px, ${studioState.panY.toFixed(1)}px) scale(${studioState.zoom.toFixed(3)})`;
  if (zoomLbl) {
    zoomLbl.textContent = `${Math.round(studioState.zoom * 100)}%`;
  }
}

function fitCameraToBounds(bounds, glide = true) {
  const vp = studioState.mountEl?.querySelector('#tmm-viewport');
  if (!vp || !bounds) return;
  const rect = vp.getBoundingClientRect();
  const vw = rect.width || 960;
  const vh = rect.height || 620;

  const padX = 84;
  const topSafe = studioState.isFullscreen ? 104 : 46;
  const botSafe = !studioState.whisperDismissed ? 98 : 42;
  const padY = topSafe + botSafe;
  const scaleX = (vw - padX) / Math.max(320, bounds.width);
  const scaleY = (vh - padY) / Math.max(240, bounds.height);
  const nextZoom = Math.max(0.26, Math.min(1.14, Math.min(scaleX, scaleY)));

  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;
  const midSafeY = topSafe + (vh - padY) / 2;

  studioState.zoom = nextZoom;
  studioState.panX = vw / 2 - centerX * nextZoom;
  studioState.panY = midSafeY - centerY * nextZoom;
  studioState.cameraInitialized = true;
  applyWorldTransform(glide);
}

function panSlightlyTowardNode(nodeCoord, targetMinZoom = null) {
  const vp = studioState.mountEl?.querySelector('#tmm-viewport');
  if (!vp || !nodeCoord) return;
  const rect = vp.getBoundingClientRect();
  const vw = rect.width || 960;
  const vh = rect.height || 620;

  if (typeof targetMinZoom === 'number' && studioState.zoom < targetMinZoom) {
    studioState.zoom = targetMinZoom;
  }

  const screenX = studioState.panX + nodeCoord.x * studioState.zoom;
  const screenY = studioState.panY + nodeCoord.y * studioState.zoom;

  const marginX = vw * 0.22;
  const marginY = vh * 0.22;
  let nextPanX = studioState.panX;
  let nextPanY = studioState.panY;

  if (targetMinZoom || screenX < marginX || screenX > vw - marginX) {
    nextPanX = vw / 2 - nodeCoord.x * studioState.zoom;
  }
  if (targetMinZoom || screenY < marginY || screenY > vh - marginY) {
    nextPanY = vh / 2 - nodeCoord.y * studioState.zoom;
  }

  studioState.panX = nextPanX;
  studioState.panY = nextPanY;
  applyWorldTransform(true);
}

function expandNextRing(root) {
  const toAdd = [];
  function walk(n) {
    const nextTier = (n.tier || 0) + 1;
    if (!Array.isArray(n.children) || n.children.length === 0 || nextTier > studioState.maxTier) {
      return;
    }
    if (n.id !== 'root' && !studioState.expandedIds.has(n.id)) {
      toAdd.push(n.id);
      return;
    }
    n.children.forEach(walk);
  }
  walk(root);
  toAdd.forEach((id) => studioState.expandedIds.add(id));
}

function expandAllWithinCap(root, targetCap = studioState.maxTier) {
  function walk(n) {
    const nextTier = (n.tier || 0) + 1;
    if (!Array.isArray(n.children) || n.children.length === 0 || nextTier > targetCap) {
      return;
    }
    studioState.expandedIds.add(n.id);
    n.children.forEach(walk);
  }
  walk(root);
}

function pruneSubtreeExpanded(node) {
  if (!node) return;
  studioState.expandedIds.delete(node.id);
  (node.children || []).forEach(pruneSubtreeExpanded);
}

function expandSubtreeToTier(node, targetTier) {
  if (!node || !Array.isArray(node.children) || node.children.length === 0) return;
  if ((node.tier || 0) + 1 > targetTier) return;
  studioState.expandedIds.add(node.id);
  node.children.forEach((ch) => expandSubtreeToTier(ch, targetTier));
}

function findContainingSubTopic(root, targetNodeId) {
  for (const kt of root?.children || []) {
    for (const st of kt.children || []) {
      if (st.id === targetNodeId || findNodeById(st, targetNodeId)) {
        return { kt, st };
      }
    }
  }
  return null;
}

function seedInitialFocusState(root, focusLessonIdx = null) {
  studioState.expandedIds = new Set(['root']);
  studioState.showCardDetail = false;
  studioState.expandedCardIds.clear();
  const kts = root?.children || [];
  kts.forEach((kt) => studioState.expandedIds.add(kt.id));
  studioState.focusedNodeId = 'root';

  // When launched directly from a specific lesson's Launchpad `Mind Map` pill,
  // auto-unfold that exact lesson's Sub-Topic branch by 1 ring so its milestones pop right out!
  if (typeof focusLessonIdx === 'number' && focusLessonIdx >= 0) {
    let matchedSt = null;
    for (const kt of kts) {
      for (const st of kt.children || []) {
        const directMatch = st.lessonIndex === focusLessonIdx;
        const childMatch = (st.children || []).some((ev) => ev.lessonIndex === focusLessonIdx);
        if (directMatch || childMatch) {
          studioState.expandedIds.add(kt.id);
          studioState.expandedIds.add(st.id);
          if (!matchedSt) matchedSt = st;
        }
      }
    }
    if (matchedSt) {
      studioState.focusedNodeId = matchedSt.id;
    }
  }
}

/**
 * Live Search across `label`, `dateChip`, `gloss`, `searchTerm`, and `tag`.
 * Auto-unfolds ancestors so matches appear immediately.
 */
function computeAndApplySearchMatches(root, rawQuery) {
  studioState.searchMatchIds.clear();
  const q = String(rawQuery || '').trim().toLowerCase();
  if (q.length < 2 || !root) return null;

  let firstLabelHit = null;
  let firstAnyHit = null;

  function walk(node, ancestors) {
    if (node.id !== 'root') {
      const hayLabel = `${node.label || ''} ${node.dateChip || ''} ${node.tag || ''}`.toLowerCase();
      const hayFull = `${hayLabel} ${node.detail || ''} ${node.gloss || ''} ${node.searchTerm || ''}`.toLowerCase();
      if (hayFull.includes(q)) {
        studioState.searchMatchIds.add(node.id);
        ancestors.forEach((ancId) => studioState.expandedIds.add(ancId));
        if (!firstAnyHit) firstAnyHit = node.id;
        if (!firstLabelHit && hayLabel.includes(q)) firstLabelHit = node.id;
      }
    }
    const nextAnc = [...ancestors, node.id];
    (node.children || []).forEach((ch) => walk(ch, nextAnc));
  }

  walk(root, []);
  return firstLabelHit || firstAnyHit;
}

function rerenderStudio({ autoFit = false, pinNode = null, focusNodeId = null, focusMinZoom = null } = {}) {
  const mountEl = studioState.mountEl;
  const data = studioState.data;
  if (!mountEl || !data?.root) return;

  // Preserve search input focus & caret across DOM rerender
  let restoreSearchCaret = null;
  if (typeof document !== 'undefined' && document.activeElement?.id === 'tmm-search-input') {
    restoreSearchCaret = {
      start: document.activeElement.selectionStart ?? studioState.searchQuery.length,
      end: document.activeElement.selectionEnd ?? studioState.searchQuery.length,
    };
  }

  const fourRing = isFourRingCardMap(data);
  const ringInfo = computeRingStepperInfo(data.root, fourRing);

  const layout =
    studioState.displayMode === 'map' ? computeBidirectionalLayout(data.root) : null;

  const focusedCtx = findNodeById(data.root, studioState.focusedNodeId) || {
    node: data.root,
    lessonIndex: studioState.unitId === 'cme_new' ? 1 : 0,
    stageIndex: null,
    searchTerm: data.root.label,
  };

  const paperLegend = getPaperLegendMeta(data);

  const ringDesc =
    ringInfo.currentLevel === 1
      ? paperLegend.isGcse
        ? 'Key Topics'
        : 'Parts / Themes'
      : ringInfo.currentLevel === 2
        ? paperLegend.isGcse
          ? 'Sub-Topics'
          : 'Enquiry Lessons'
        : ringInfo.currentLevel === 3
          ? paperLegend.isGcse
            ? 'Official Spec Events'
            : 'Key Milestones'
          : ringInfo.currentLevel === 4
            ? paperLegend.isGcse
              ? 'Causes, Consequences & Importance'
              : 'Causes, Consequences & Significance'
            : fourRing
              ? 'Full Detail Cards'
              : '+ Supporting Fact Twigs';
  const depthLabel = `Ring ${ringInfo.currentLevel} of ${ringInfo.totalLevels} · ${ringDesc}`;

  const lessonStageLabel =
    focusedCtx.node.id !== 'root'
      ? formatLessonStageRef(studioState.unitId, focusedCtx.lessonIndex, focusedCtx.stageIndex)
      : '';

  const focusedIsBlurred = isNodeBlurredInRecall(focusedCtx.node);

  // Compact Action Chip ONLY (Zero duplicate prose box — fixes Sweller Split-Attention!)
  const whisperHtml =
    !studioState.whisperDismissed &&
    focusedCtx.node.id !== 'root' &&
    (lessonStageLabel || studioState.onOpenQuestionDrawer || focusedIsBlurred)
      ? `
        <div class="tmm-whisper-pill" style="max-width:fit-content;padding:6px 11px;gap:10px;">
          ${
            focusedIsBlurred
              ? `<span style="font-size:0.78rem;">🙈 <strong>Recall Check:</strong> Say this point aloud, then tap the blurred branch to reveal!</span>`
              : `<span style="font-size:0.78rem;font-weight:800;color:#93c5fd;white-space:nowrap;">📍 ${escapeHtml(focusedCtx.node.label)}${focusedCtx.node.dateChip ? ` (${escapeHtml(focusedCtx.node.dateChip)})` : ''}</span>`
          }
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
            ${
              lessonStageLabel
                ? `<button type="button" class="tmm-whisper-readbtn" data-tmm-action="open-focused-lesson" title="Open ${escapeHtml(lessonStageLabel)}">📖 ${escapeHtml(lessonStageLabel)}</button>`
                : ''
            }
            ${
              studioState.onOpenQuestionDrawer
                ? `<button type="button" class="tmm-whisper-qbtn" data-tmm-action="practise-focused">⚡ Exam Q</button>`
                : ''
            }
            <button type="button" data-tmm-action="dismiss-whisper" title="Close" style="background:transparent;border:none;color:#94a3b8;cursor:pointer;font-size:0.85rem;padding:2px 4px;"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>
      `
      : '';

  if (typeof document !== 'undefined') {
    document.body.classList.toggle('tmm-fullscreen-active', studioState.isFullscreen);
  }

  const searchActive = studioState.searchQuery.trim().length >= 2;

  mountEl.innerHTML = `
    <div class="tmm-wrapper ${studioState.isFullscreen ? 'is-true-fullscreen' : ''}" id="tmm-studio-wrapper">
      <div class="tmm-studio-bar">
        <div class="tmm-bar-cluster">
          <div class="tmm-seg-group" role="tablist" aria-label="Mind Map vs Outline List">
            <button type="button" class="tmm-seg-btn ${studioState.displayMode === 'map' ? 'is-active' : ''}" data-tmm-action="set-display" data-display="map">
              <i class="fa-solid fa-diagram-project"></i><span>Map</span>
            </button>
            <button type="button" class="tmm-seg-btn ${studioState.displayMode === 'outline' ? 'is-active' : ''}" data-tmm-action="set-display" data-display="outline">
              <i class="fa-solid fa-list-ul"></i><span>Outline</span>
            </button>
          </div>

          <div class="tmm-seg-group" role="group" aria-label="Expand or Collapse One Ring at a Time">
            <button type="button" class="tmm-seg-btn ring-step-btn" data-tmm-action="step-ring-down" ${!ringInfo.canStepDown ? 'disabled' : ''} title="Shrink map inward by 1 ring">
              − Ring
            </button>
            <span class="tmm-ring-stepper-status">Ring ${ringInfo.currentLevel} / ${ringInfo.totalLevels}</span>
            <button type="button" class="tmm-seg-btn ring-step-btn" data-tmm-action="step-ring-up" ${!ringInfo.canStepUp ? 'disabled' : ''} title="Expand map outward by 1 ring">
              + Ring
            </button>
          </div>
          ${
            String(studioState.unitId || '').toLowerCase().startsWith('ks2_')
              ? `<button type="button" class="tmm-action-pill ${studioState.maxTier >= 5 ? 'is-toggled-on' : ''}" data-tmm-action="toggle-ks2-extra-clues" title="Show or hide Extra Detective Clues (Rings 4 &amp; 5)">
                   <span>${studioState.maxTier >= 5 ? '🔍 Extra Clues: ON' : '🔍 Extra Clues'}</span>
                 </button>`
              : ''
          }

          ${
            studioState.displayMode === 'map'
              ? `
                <div class="tmm-seg-group" role="group" aria-label="Branch Direction">
                  <button type="button" class="tmm-seg-btn ${studioState.directionMode === 'center' ? 'is-active' : ''}" data-tmm-action="set-direction" data-dir="center" title="Centre-out radial map branching left and right">↔ Centre</button>
                  <button type="button" class="tmm-seg-btn ${studioState.directionMode === 'right' ? 'is-active' : ''}" data-tmm-action="set-direction" data-dir="right" title="All branches flow left-to-right chronologically">→ Right</button>
                  <button type="button" class="tmm-seg-btn ${studioState.directionMode === 'left' ? 'is-active' : ''}" data-tmm-action="set-direction" data-dir="left" title="All branches flow right-to-left">← Left</button>
                </div>
              `
              : ''
          }
        </div>

        <div class="tmm-bar-cluster">
          <div class="tmm-search-wrap">
            <i class="fa-solid fa-magnifying-glass tmm-search-icon" aria-hidden="true"></i>
            <input
              type="search"
              id="tmm-search-input"
              class="tmm-search-input"
              placeholder="Find topic / person..."
              value="${escapeHtml(studioState.searchQuery)}"
              autocomplete="off"
              aria-label="Find topic, person, treaty or event on Mind Map"
            />
            ${
              searchActive
                ? `<span class="tmm-search-count">${studioState.searchMatchIds.size}</span>
                   <button type="button" class="tmm-search-clear" data-tmm-action="clear-search" title="Clear search">&times;</button>`
                : ''
            }
          </div>

          <button type="button" class="tmm-action-pill ${studioState.blurRecall ? 'is-toggled-on' : ''}" data-tmm-action="toggle-blur-recall" title="Blur outer branches while keeping role tags sharp — tap any pill to test & reveal!">
            <span>${studioState.blurRecall ? '🙈 Blur ON' : '🙈 Blur Recall'}</span>
          </button>
          ${
            studioState.blurRecall
              ? `<button type="button" class="tmm-action-pill" data-tmm-action="reveal-all-blur" title="Reveal all blurred pills">👁️ Reveal All</button>`
              : ''
          }

          <button type="button" class="tmm-action-pill" data-tmm-action="reset-map" title="Reset to Sub-Topic overview (Ring 2)">Reset</button>

          <button type="button" class="tmm-action-pill print-cta" data-tmm-action="open-print-modal" title="Print visual A4 / A3 Landscape Mind Map (Completed Poster or Blank Write-On Blurt Branches)">
            <i class="fa-solid fa-print"></i><span>Print Map</span>
          </button>

          <button type="button" class="tmm-action-pill fullscreen-cta ${studioState.isFullscreen ? 'is-exit' : ''}" data-tmm-action="toggle-fullscreen">
            <i class="fa-solid ${studioState.isFullscreen ? 'fa-compress' : 'fa-expand'}"></i>
            <span>${studioState.isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
          </button>
        </div>
      </div>

      ${
        studioState.displayMode === 'outline'
          ? renderOutlineViewHTML(data.root)
          : `
            <div class="tmm-viewport" id="tmm-viewport">
              <div class="tmm-ring-legend">
                <span>${escapeHtml(depthLabel)}</span>
                ${ringInfo.currentLevel >= 4 ? paperLegend.pillsHtml : ''}
              </div>

              <div class="tmm-world" id="tmm-world">
                <svg class="tmm-links-svg" aria-hidden="true">
                  <g>${renderSvgLinksHTML(layout.links)}</g>
                </svg>
                ${renderMapNodesHTML(layout.nodes)}
              </div>

              ${whisperHtml}

              <div class="tmm-zoom-hud">
                <button type="button" class="tmm-zoom-btn" data-tmm-action="zoom-out" title="Zoom out">−</button>
                <span class="tmm-zoom-lbl" id="tmm-zoom-lbl">100%</span>
                <button type="button" class="tmm-zoom-btn" data-tmm-action="zoom-in" title="Zoom in">+</button>
                <button type="button" class="tmm-zoom-btn" data-tmm-action="zoom-fit" title="Fit map to screen">⌖</button>
              </div>
            </div>
          `
      }
    </div>
  `;

  bindStudioInteractions(layout);

  if (studioState.isFullscreen) {
    requestAnimationFrame(() => {
      const bar = mountEl.querySelector('.tmm-studio-bar');
      const leg = mountEl.querySelector('.tmm-ring-legend');
      if (bar && leg) {
        leg.style.top = `${bar.offsetTop + bar.offsetHeight + 10}px`;
      }
    });
  }

  if (restoreSearchCaret) {
    const inp = mountEl.querySelector('#tmm-search-input');
    if (inp) {
      inp.focus({ preventScroll: true });
      try {
        inp.setSelectionRange(restoreSearchCaret.start, restoreSearchCaret.end);
      } catch (_) {}
    }
  }

  if (studioState.displayMode === 'map' && layout) {
    if (!studioState.cameraInitialized || autoFit) {
      requestAnimationFrame(() => fitCameraToBounds(layout.bounds, autoFit));
    } else if (pinNode) {
      // Pin tapped node at its exact screen pixel (0% zoom change, 0px vertical jump!),
      // nudging ONLY if newly revealed children would otherwise spawn off the edge of the canvas.
      const newCoord = layout.nodes.find((n) => n.id === pinNode.id);
      if (newCoord) {
        studioState.panX = pinNode.screenX - newCoord.x * studioState.zoom;
        studioState.panY = pinNode.screenY - newCoord.y * studioState.zoom;

        if (pinNode.revealedChildIds && pinNode.revealedChildIds.length > 0) {
          const vp = mountEl.querySelector('#tmm-viewport');
          const vw = vp?.clientWidth || 960;
          const vh = vp?.clientHeight || 620;
          const childCoords = layout.nodes.filter((n) => pinNode.revealedChildIds.includes(n.id));
          if (childCoords.length > 0) {
            const halfW = 148 * studioState.zoom;
            const halfH = 22 * studioState.zoom;
            const minSX = Math.min(...childCoords.map((c) => studioState.panX + c.x * studioState.zoom - halfW));
            const maxSX = Math.max(...childCoords.map((c) => studioState.panX + c.x * studioState.zoom + halfW));
            const minSY = Math.min(...childCoords.map((c) => studioState.panY + c.y * studioState.zoom - halfH));
            const maxSY = Math.max(...childCoords.map((c) => studioState.panY + c.y * studioState.zoom + halfH));

            if (minSX < 22) {
              studioState.panX += 22 - minSX;
            } else if (maxSX > vw - 22) {
              studioState.panX -= maxSX - (vw - 22);
            }
            if (maxSY - minSY < vh - 96) {
              if (minSY < 48) {
                studioState.panY += 48 - minSY;
              } else if (maxSY > vh - 56) {
                studioState.panY -= maxSY - (vh - 56);
              }
            }
          }
        }
      }
      applyWorldTransform(false);
    } else if (focusNodeId) {
      applyWorldTransform(false);
      const hitCoord = layout.nodes.find((n) => n.id === focusNodeId);
      if (hitCoord) {
        requestAnimationFrame(() => panSlightlyTowardNode(hitCoord, focusMinZoom));
      }
    } else {
      applyWorldTransform(false);
    }
  }
}

function toggleTrueFullscreen(forceVal = null) {
  const next = typeof forceVal === 'boolean' ? forceVal : !studioState.isFullscreen;
  studioState.isFullscreen = next;

  if (typeof document !== 'undefined') {
    if (next && document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (!next && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }

  rerenderStudio({ autoFit: true });
}

function bindStudioInteractions(layout) {
  const wrapper = studioState.mountEl?.querySelector('#tmm-studio-wrapper');
  if (!wrapper) return;

  let suppressClickUntil = 0;

  const searchInput = wrapper.querySelector('#tmm-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      studioState.searchQuery = e.target.value || '';
      const bestHitId = computeAndApplySearchMatches(studioState.data?.root, studioState.searchQuery);
      if (bestHitId) {
        studioState.focusedNodeId = bestHitId;
        studioState.whisperDismissed = false;
        rerenderStudio({ focusNodeId: bestHitId, focusMinZoom: 0.62 });
      } else {
        rerenderStudio({});
      }
    });
  }

  wrapper.addEventListener(
    'click',
    (e) => {
      if (Date.now() < suppressClickUntil && e.target.closest('[data-tmm-node]')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const actBtn = e.target.closest('[data-tmm-action]');
      if (actBtn) {
        e.stopPropagation();
        const action = actBtn.getAttribute('data-tmm-action');

        if (action === 'set-display') {
          const nextDisp = actBtn.getAttribute('data-display') || 'map';
          studioState.displayMode = nextDisp;
          if (nextDisp === 'outline' && studioState.expandedIds.size <= 1) {
            (studioState.data?.root?.children || []).forEach((t) =>
              studioState.expandedIds.add(t.id),
            );
          }
          rerenderStudio({ autoFit: nextDisp === 'map' });
          return;
        }

        if (action === 'step-ring-up') {
          const changed = stepRingUp(studioState.data.root, isFourRingCardMap(studioState.data));
          if (changed) rerenderStudio({ autoFit: true });
          return;
        }

        if (action === 'step-ring-down') {
          const changed = stepRingDown(studioState.data.root, isFourRingCardMap(studioState.data));
          if (changed) rerenderStudio({ autoFit: true });
          return;
        }

        if (action === 'toggle-ks2-extra-clues') {
          if (studioState.maxTier < 5) {
            studioState.maxTier = 5;
            stepRingUp(studioState.data.root, isFourRingCardMap(studioState.data));
          } else {
            studioState.maxTier = 3;
            studioState.showCardDetail = false;
            studioState.expandedCardIds.clear();
            studioState.blurRecall = false;
            for (const expId of [...studioState.expandedIds]) {
              if (expId === 'root') continue;
              const hit = findNodeById(studioState.data.root, expId);
              if (hit && (hit.node?.tier || 0) >= 3) {
                studioState.expandedIds.delete(expId);
              }
            }
          }
          rerenderStudio({ autoFit: true });
          return;
        }

        if (action === 'set-direction') {
          const nextDir = actBtn.getAttribute('data-dir') || 'center';
          studioState.directionMode = nextDir;
          saveDirection(nextDir);
          rerenderStudio({ autoFit: true });
          return;
        }

        if (action === 'toggle-blur-recall') {
          if (studioState.maxTier < 5 && String(studioState.unitId || '').toLowerCase().startsWith('ks2_')) {
            studioState.maxTier = 5;
          }
          studioState.blurRecall = !studioState.blurRecall;
          studioState.revealedNodeIds.clear();
          if (studioState.blurRecall) {
            const info = computeRingStepperInfo(
              studioState.data.root,
              isFourRingCardMap(studioState.data),
            );
            // Ensure at least Ring 4 is visible if user toggles Blur Recall from Ring 1–3
            if (info.currentLevel < 4) {
              while (
                computeRingStepperInfo(
                  studioState.data.root,
                  isFourRingCardMap(studioState.data),
                ).currentLevel < 4 &&
                stepRingUp(studioState.data.root, isFourRingCardMap(studioState.data))
              ) {
                // stepped up one ring
              }
              rerenderStudio({ autoFit: true });
              return;
            }
          }
          rerenderStudio({});
          return;
        }

        if (action === 'reveal-all-blur') {
          function collectAll(n) {
            if ((n.tier || 0) >= 4) studioState.revealedNodeIds.add(n.id);
            (n.children || []).forEach(collectAll);
          }
          collectAll(studioState.data.root);
          rerenderStudio({});
          return;
        }

        if (action === 'clear-search') {
          studioState.searchQuery = '';
          studioState.searchMatchIds.clear();
          rerenderStudio({});
          return;
        }

        if (action === 'open-print-modal') {
          openMindMapPrintModal(studioState.unitId, studioState.fallbackSpecTree);
          return;
        }

        if (action === 'expand-ring') {
          expandNextRing(studioState.data.root);
          rerenderStudio({ autoFit: true });
          return;
        }

        if (action === 'expand-all-visible') {
          expandAllWithinCap(studioState.data.root, 5);
          if (isFourRingCardMap(studioState.data)) studioState.showCardDetail = true;
          rerenderStudio({ autoFit: true });
          return;
        }

        if (action === 'reset-map') {
          seedInitialFocusState(studioState.data.root);
          studioState.searchQuery = '';
          studioState.searchMatchIds.clear();
          rerenderStudio({ autoFit: true });
          return;
        }

        if (action === 'toggle-outline-gloss') {
          studioState.showOutlineGloss = !studioState.showOutlineGloss;
          rerenderStudio({});
          return;
        }

        if (action === 'toggle-fullscreen') {
          toggleTrueFullscreen();
          return;
        }

        if (action === 'zoom-in') {
          const vp = wrapper.querySelector('#tmm-viewport');
          const rect = vp?.getBoundingClientRect() || { width: 900, height: 600 };
          zoomAroundViewportPoint(vp, 1.24, rect.width / 2, rect.height / 2);
          return;
        }

        if (action === 'zoom-out') {
          const vp = wrapper.querySelector('#tmm-viewport');
          const rect = vp?.getBoundingClientRect() || { width: 900, height: 600 };
          zoomAroundViewportPoint(vp, 1 / 1.24, rect.width / 2, rect.height / 2);
          return;
        }

        if (action === 'zoom-fit' && layout) {
          fitCameraToBounds(layout.bounds, true);
          return;
        }

        if (action === 'dismiss-whisper') {
          studioState.whisperDismissed = true;
          rerenderStudio({});
          return;
        }

        if (action === 'open-focused-lesson') {
          const ctx = findNodeById(studioState.data.root, studioState.focusedNodeId);
          if (ctx) {
            openFocusedLessonStage(studioState.unitId, ctx.lessonIndex, ctx.stageIndex);
          }
          return;
        }

        if (action === 'open-node-lesson') {
          const lIdx = parseInt(actBtn.getAttribute('data-lesson'), 10);
          const rawStage = actBtn.getAttribute('data-stage');
          const sIdx = rawStage !== null && rawStage !== '' ? parseInt(rawStage, 10) : null;
          if (!isNaN(lIdx)) {
            openFocusedLessonStage(studioState.unitId, lIdx, isNaN(sIdx) ? null : sIdx);
          }
          return;
        }

        if (action === 'practise-focused' && studioState.onOpenQuestionDrawer) {
          const ctx = findNodeById(studioState.data.root, studioState.focusedNodeId);
          if (ctx) {
            if (
              studioState.isFullscreen &&
              document.fullscreenElement &&
              document.exitFullscreen
            ) {
              document.exitFullscreen().catch(() => {});
            }
            studioState.isFullscreen = false;
            rerenderStudio({});
            studioState.onOpenQuestionDrawer({
              title: ctx.node.label,
              lessonIndex: ctx.lessonIndex,
              searchTerm: ctx.searchTerm,
              openMode: 'practise',
            });
          }
          return;
        }
        return;
      }

      const nodeBtn = e.target.closest('[data-tmm-node]');
      if (nodeBtn) {
        const nodeId = nodeBtn.getAttribute('data-tmm-node');
        const hitCtx = findNodeById(studioState.data.root, nodeId);
        studioState.focusedNodeId = nodeId;
        studioState.whisperDismissed = false;

        // Pin clicked node at its exact screen pixel so expanding/collapsing NEVER jumps!
        const oldCoord = layout?.nodes?.find((n) => n.id === nodeId);
        const pinNode = oldCoord
          ? {
              id: nodeId,
              screenX: studioState.panX + oldCoord.x * studioState.zoom,
              screenY: studioState.panY + oldCoord.y * studioState.zoom,
            }
          : null;

        if (hitCtx && isNodeBlurredInRecall(hitCtx.node)) {
          studioState.revealedNodeIds.add(nodeId);
          rerenderStudio({ pinNode });
          return;
        }

        if (nodeId !== 'root' && hitCtx) {
          const clickedNode = hitCtx.node;
          const fourRing = isFourRingCardMap(studioState.data);

          if (
            fourRing &&
            clickedNode.tier === 4 &&
            (!Array.isArray(clickedNode.children) || clickedNode.children.length === 0) &&
            clickedNode.detail
          ) {
            if (studioState.expandedCardIds.has(nodeId)) {
              studioState.expandedCardIds.delete(nodeId);
            } else {
              studioState.expandedCardIds.add(nodeId);
            }
          } else if (studioState.expandedIds.has(nodeId)) {
            pruneSubtreeExpanded(clickedNode);
          } else if (Array.isArray(clickedNode.children) && clickedNode.children.length > 0) {
            // Strictly 1 ring deeper on THIS branch only — never explode sub-rings or collapse siblings!
            studioState.expandedIds.add(nodeId);
            if (pinNode) {
              pinNode.revealedChildIds = clickedNode.children.map((c) => c.id);
            }
          }
        }
        rerenderStudio({ pinNode });
        return;
      }

      const outlineRow = e.target.closest('[data-tmm-outline-toggle]');
      if (outlineRow) {
        const nodeId = outlineRow.getAttribute('data-tmm-outline-toggle');
        const hitCtx = findNodeById(studioState.data.root, nodeId);
        studioState.focusedNodeId = nodeId;

        if (hitCtx && isNodeBlurredInRecall(hitCtx.node)) {
          studioState.revealedNodeIds.add(nodeId);
          studioState.expandedIds.add(nodeId);
          rerenderStudio({});
          return;
        }

        if (studioState.expandedIds.has(nodeId)) {
          studioState.expandedIds.delete(nodeId);
        } else {
          studioState.expandedIds.add(nodeId);
        }
        rerenderStudio({});
      }
    },
    true,
  );

  // Pan, Wheel Zoom, 2-Finger Multi-Touch Pinch-to-Zoom & Double-Tap Zoom inside `.tmm-viewport`
  const vp = wrapper.querySelector('#tmm-viewport');
  if (!vp) return;

  function zoomAroundViewportPoint(vpEl, factor, cx, cy, glide = false) {
    if (!vpEl) return;
    const prevZoom = studioState.zoom;
    const nextZoom = Math.max(0.22, Math.min(2.8, prevZoom * factor));
    const ratio = nextZoom / prevZoom;
    studioState.panX = cx - (cx - studioState.panX) * ratio;
    studioState.panY = cy - (cy - studioState.panY) * ratio;
    studioState.zoom = nextZoom;
    applyWorldTransform(glide);
  }

  vp.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const rect = vp.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      zoomAroundViewportPoint(vp, factor, cx, cy, false);
    },
    { passive: false },
  );

  const activePointers = new Map();
  let isPanning = false;
  let wasMultiTouch = false;
  let movedBeyondTapSlop = false;
  let panStartX = 0;
  let panStartY = 0;
  let originPanX = 0;
  let originPanY = 0;
  let lastPinchDist = 0;
  let lastPinchMidX = 0;
  let lastPinchMidY = 0;
  let lastBgTapTime = 0;
  let lastBgTapX = 0;
  let lastBgTapY = 0;

  function getTwoPointerMetrics() {
    const pts = Array.from(activePointers.values());
    if (pts.length < 2) return null;
    const [p1, p2] = pts;
    const rect = vp.getBoundingClientRect();
    return {
      dist: Math.max(8, Math.hypot(p2.x - p1.x, p2.y - p1.y)),
      midX: (p1.x + p2.x) / 2 - rect.left,
      midY: (p1.y + p2.y) / 2 - rect.top,
    };
  }

  vp.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.tmm-zoom-hud') || e.target.closest('.tmm-whisper-pill')) return;

    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.size === 1) {
      wasMultiTouch = false;
      movedBeyondTapSlop = false;
      isPanning = false;
      panStartX = e.clientX;
      panStartY = e.clientY;
      originPanX = studioState.panX;
      originPanY = studioState.panY;
    } else if (activePointers.size >= 2) {
      wasMultiTouch = true;
      isPanning = false;
      const m = getTwoPointerMetrics();
      if (m) {
        lastPinchDist = m.dist;
        lastPinchMidX = m.midX;
        lastPinchMidY = m.midY;
      }
      vp.classList.add('is-dragging');
    }
  });

  vp.addEventListener('pointermove', (e) => {
    if (!activePointers.has(e.pointerId)) return;
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.size >= 2) {
      const m = getTwoPointerMetrics();
      if (m && lastPinchDist > 0) {
        studioState.panX += m.midX - lastPinchMidX;
        studioState.panY += m.midY - lastPinchMidY;
        const factor = m.dist / lastPinchDist;
        zoomAroundViewportPoint(vp, factor, m.midX, m.midY, false);
        lastPinchDist = m.dist;
        lastPinchMidX = m.midX;
        lastPinchMidY = m.midY;
      }
      return;
    }

    if (activePointers.size === 1 && !wasMultiTouch) {
      const dx = e.clientX - panStartX;
      const dy = e.clientY - panStartY;
      if (!movedBeyondTapSlop && Math.hypot(dx, dy) > 7) {
        movedBeyondTapSlop = true;
        isPanning = true;
        vp.classList.add('is-dragging');
      }
      if (isPanning) {
        studioState.panX = originPanX + dx;
        studioState.panY = originPanY + dy;
        applyWorldTransform(false);
      }
    }
  });

  const finishPointer = (e) => {
    const hadPointer = activePointers.has(e.pointerId);
    activePointers.delete(e.pointerId);
    if (!hadPointer) return;

    if (activePointers.size >= 2) {
      const m = getTwoPointerMetrics();
      if (m) {
        lastPinchDist = m.dist;
        lastPinchMidX = m.midX;
        lastPinchMidY = m.midY;
      }
      return;
    }

    if (activePointers.size === 0) {
      vp.classList.remove('is-dragging');
      if (wasMultiTouch || movedBeyondTapSlop) {
        suppressClickUntil = Date.now() + 260;
      } else if (!e.target.closest('button')) {
        const now = Date.now();
        if (
          now - lastBgTapTime < 340 &&
          Math.hypot(e.clientX - lastBgTapX, e.clientY - lastBgTapY) < 32
        ) {
          const rect = vp.getBoundingClientRect();
          const cx = e.clientX - rect.left;
          const cy = e.clientY - rect.top;
          if (studioState.zoom > 1.75 && layout) {
            fitCameraToBounds(layout.bounds, true);
          } else {
            zoomAroundViewportPoint(vp, 1.45, cx, cy, true);
          }
          lastBgTapTime = 0;
        } else {
          lastBgTapTime = now;
          lastBgTapX = e.clientX;
          lastBgTapY = e.clientY;
        }
      }
      isPanning = false;
      lastPinchDist = 0;
    }
  };

  vp.addEventListener('pointerup', finishPointer);
  vp.addEventListener('pointercancel', finishPointer);
  vp.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse' && activePointers.has(e.pointerId)) {
      finishPointer(e);
    }
  });

  // Safety net: clear activePointers if pointer releases outside #tmm-viewport (touch/pen/mouse) or window blurs
  const onGlobalPointerEnd = (e) => {
    if (!document.body.contains(vp)) {
      window.removeEventListener('pointerup', onGlobalPointerEnd, true);
      window.removeEventListener('pointercancel', onGlobalPointerEnd, true);
      window.removeEventListener('blur', onWindowBlurReset);
      return;
    }
    if (activePointers.has(e.pointerId)) {
      finishPointer(e);
    }
  };
  const onWindowBlurReset = () => {
    if (!document.body.contains(vp)) {
      window.removeEventListener('pointerup', onGlobalPointerEnd, true);
      window.removeEventListener('pointercancel', onGlobalPointerEnd, true);
      window.removeEventListener('blur', onWindowBlurReset);
      return;
    }
    if (activePointers.size > 0) {
      activePointers.clear();
      isPanning = false;
      wasMultiTouch = false;
      movedBeyondTapSlop = false;
      lastPinchDist = 0;
      vp.classList.remove('is-dragging');
    }
  };
  window.addEventListener('pointerup', onGlobalPointerEnd, true);
  window.addEventListener('pointercancel', onGlobalPointerEnd, true);
  window.addEventListener('blur', onWindowBlurReset);

  let gestureBaseZoom = 1;
  vp.addEventListener(
    'gesturestart',
    (e) => {
      e.preventDefault();
      gestureBaseZoom = studioState.zoom;
    },
    { passive: false },
  );
  vp.addEventListener(
    'gesturechange',
    (e) => {
      e.preventDefault();
      if (typeof e.scale === 'number' && e.scale > 0 && activePointers.size < 2) {
        const rect = vp.getBoundingClientRect();
        const targetZoom = gestureBaseZoom * e.scale;
        const factor = targetZoom / studioState.zoom;
        zoomAroundViewportPoint(
          vp,
          factor,
          (e.clientX || rect.left + rect.width / 2) - rect.left,
          (e.clientY || rect.top + rect.height / 2) - rect.top,
          false,
        );
      }
    },
    { passive: false },
  );
}

/* ==========================================================================
   True Vector A4 / A3 Landscape Visual Mind-Map Printer (Completed & Blank Blurt)
   ========================================================================== */

function cloneNodeTree(node) {
  return {
    ...node,
    children: Array.isArray(node.children) ? node.children.map(cloneNodeTree) : [],
  };
}

function buildKtSheetRoot(ktNode, courseTitle) {
  const sts = (ktNode.children || []).map((st, idx) => ({
    ...cloneNodeTree(st),
    side: idx % 2 === 0 ? 'left' : 'right',
    color: ktNode.color || '#2563eb',
  }));
  return {
    id: `sheet_${ktNode.id}`,
    tier: 0,
    color: ktNode.color || '#2563eb',
    label: ktNode.label,
    subLabel: `${courseTitle}${ktNode.dateChip ? ` • ${ktNode.dateChip}` : ''}`,
    children: sts,
  };
}

function wrapSvgLines(text, maxChars = 58) {
  const words = String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return [];
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!cur) {
      cur = w;
    } else if (cur.length + 1 + w.length <= maxChars || lines.length >= 1) {
      cur += ` ${w}`;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 2);
}

function renderSingleVectorSvg(
  sheetRoot,
  {
    maxTier = 4,
    showCardDetail = false,
    directionMode = 'center',
    styleMode = 'completed',
    expandedIds = null,
    expandAll = true,
  } = {},
) {
  const isBlurt = styleMode === 'blurt';
  const useFleshedCards = Boolean(showCardDetail) && !isBlurt;

  const stepTable = useFleshedCards
    ? sheetRoot.id.startsWith('sheet_')
      ? { 1: 285, 2: 640, 3: 1085, 4: 1510, 5: 1800 }
      : { 1: 290, 2: 635, 3: 1020, 4: 1495, 5: 1790 }
    : sheetRoot.id.startsWith('sheet_')
      ? { 1: 290, 2: 635, 3: 1020, 4: 1395, 5: 1730 }
      : { 1: 290, 2: 620, 3: 985, 4: 1375, 5: 1725 };

  const slotTable = isBlurt
    ? { 1: 58, 2: 48, 3: 42, 4: 49, 5: 32 }
    : useFleshedCards
      ? { 1: 58, 2: 48, 3: 42, 4: 55, 5: 36 }
      : { 1: 52, 2: 44, 3: 38, 4: 34, 5: 25 };

  const layout = computeBidirectionalLayout(sheetRoot, {
    maxTier,
    showCardDetail: useFleshedCards,
    expandedIds: expandedIds || studioState.expandedIds,
    expandAll,
    directionMode,
    stepTable,
    slotTable,
  });

  // Compute exact SVG viewBox over all pill boxes
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  const pillMetrics = layout.nodes.map((n) => {
    const isBlankTier = isBlurt && n.tier >= 4;
    const isFleshedSvgCard = useFleshedCards && n.tier === 4 && Boolean(n.detail);
    const roleMeta = n.tier === 4 ? resolveNodeRoleMeta(n.tag, n.forTheme) : null;
    const tagTxt = roleMeta ? roleMeta.label.toUpperCase() : n.tier === 5 ? '★ G9' : '';

    let w = 180;
    let h = 30;
    if (n.depthFromRoot === 0) {
      const titleW = (n.label.length + 4) * 8.6;
      const subW = n.subLabel ? n.subLabel.length * 6.35 + 32 : 0;
      w = Math.max(225, Math.min(390, Math.max(titleW, subW)));
      h = 48;
    } else if (isBlankTier) {
      w = n.tier === 4 ? 334 : 225;
      h = 42;
    } else if (isFleshedSvgCard) {
      const badgeEst = roleMeta ? Math.max(44, roleMeta.label.length * 5.7 + 10) : 0;
      const headNeed = (badgeEst ? badgeEst + 11 : 8) + n.label.length * 5.95 + 10;
      w = Math.max(384, Math.min(436, headNeed));
      h = 48;
    } else {
      const charW = n.tier <= 2 ? 7.2 : n.tier === 3 ? 6.8 : 6.6;
      const baseTextLen =
        n.label.length + (n.dateChip && n.tier <= 3 ? n.dateChip.length * 0.8 + 3 : 0);
      const tagExtra = roleMeta
        ? Math.max(46, roleMeta.label.length * 5.8 + 14) + 12
        : n.tier === 5
          ? 20
          : 0;
      w = Math.max(132, Math.min(355, baseTextLen * charW + tagExtra + 26));
      h = n.tier === 1 ? 36 : n.tier === 2 ? 32 : n.tier === 3 ? 29 : 26;
    }

    if (n.x - w / 2 - 18 < minX) minX = n.x - w / 2 - 18;
    if (n.x + w / 2 + 18 > maxX) maxX = n.x + w / 2 + 18;
    if (n.y - h / 2 - 14 < minY) minY = n.y - h / 2 - 14;
    if (n.y + h / 2 + 14 > maxY) maxY = n.y + h / 2 + 14;

    return { n, w, h, roleMeta, tagTxt, isBlankTier, isFleshedSvgCard };
  });

  const vbW = Math.max(400, maxX - minX);
  const vbH = Math.max(260, maxY - minY);

  const linkPaths = layout.links
    .map((lk) => {
      const dx = (lk.x2 - lk.x1) * 0.52;
      const stroke = isBlurt && lk.tier >= 4 ? '#475569' : lk.color;
      const dash = isBlurt && lk.tier >= 4 ? ' stroke-dasharray="4 3"' : '';
      const sw = lk.depthFromRoot === 1 ? 3.2 : lk.depthFromRoot === 2 ? 2.1 : 1.5;
      return `<path d="M ${lk.x1.toFixed(1)} ${lk.y1.toFixed(1)} C ${(lk.x1 + dx).toFixed(1)} ${lk.y1.toFixed(1)}, ${(lk.x2 - dx).toFixed(1)} ${lk.y2.toFixed(1)}, ${lk.x2.toFixed(1)} ${lk.y2.toFixed(1)}" fill="none" stroke="${escapeHtml(stroke)}" stroke-width="${sw}" stroke-opacity="0.85"${dash} />`;
    })
    .join('');

  const nodeBoxes = pillMetrics
    .map(({ n, w, h, roleMeta, tagTxt, isBlankTier, isFleshedSvgCard }) => {
      const rx = n.depthFromRoot === 0 || n.tier === 1 ? h / 2 : 7;
      const left = n.x - w / 2;
      const top = n.y - h / 2;

      if (n.depthFromRoot === 0) {
        return `
          <g>
            <rect x="${left.toFixed(1)}" y="${top.toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="${rx}" fill="#0f172a" stroke="${escapeHtml(n.color || '#2563eb')}" stroke-width="2.6" />
            ${
              n.subLabel
                ? `<text x="${n.x.toFixed(1)}" y="${(n.y - 7).toFixed(1)}" text-anchor="middle" fill="#93c5fd" font-size="9.5" font-weight="800">${escapeHtml(n.subLabel)}</text>
                   <text x="${n.x.toFixed(1)}" y="${(n.y + 10).toFixed(1)}" text-anchor="middle" fill="#ffffff" font-size="13.5" font-weight="900">${escapeHtml(n.label)}</text>`
                : `<text x="${n.x.toFixed(1)}" y="${(n.y + 5).toFixed(1)}" text-anchor="middle" fill="#ffffff" font-size="13.5" font-weight="900">${escapeHtml(n.label)}</text>`
            }
          </g>
        `;
      }

      if (isBlankTier) {
        const badgeW = tagTxt ? Math.max(46, tagTxt.length * 5.8 + 12) : 36;
        const line1Start = left + badgeW + 10;
        const lineEnd = left + w - 9;
        return `
          <g>
            <rect x="${left.toFixed(1)}" y="${top.toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="6.5" fill="#ffffff" stroke="#0f172a" stroke-width="1.35" />
            <rect x="${(left + 4.5).toFixed(1)}" y="${(top + 4.5).toFixed(1)}" width="${badgeW.toFixed(1)}" height="15.5" rx="3.5" fill="#0f172a" />
            <text x="${(left + 4.5 + badgeW / 2).toFixed(1)}" y="${(top + 15.1).toFixed(1)}" text-anchor="middle" fill="#ffffff" font-size="8.2" font-weight="900">${escapeHtml(tagTxt || 'POINT')}</text>
            <line x1="${line1Start.toFixed(1)}" y1="${(top + 17.5).toFixed(1)}" x2="${lineEnd.toFixed(1)}" y2="${(top + 17.5).toFixed(1)}" stroke="#64748b" stroke-width="1" stroke-dasharray="2.5 2.5" />
            <line x1="${(left + 7).toFixed(1)}" y1="${(top + 34.5).toFixed(1)}" x2="${lineEnd.toFixed(1)}" y2="${(top + 34.5).toFixed(1)}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2.5 2.5" />
          </g>
        `;
      }

      let fill = '#ffffff';
      let stroke = n.color || '#2563eb';
      let textCol = '#0f172a';
      let sw = n.tier <= 2 ? 2.0 : 1.5;

      if (n.tier === 3) {
        fill = '#f8fafc';
      } else if (n.tier === 4 && roleMeta) {
        fill = roleMeta.svgBg;
        stroke = roleMeta.svgBorder;
        textCol = roleMeta.svgText;
        sw = 1.45;
      } else if (n.tier === 5) {
        fill = '#ffffff';
        stroke = '#cbd5e1';
        textCol = '#334155';
        sw = 1.1;
      }

      if (isFleshedSvgCard) {
        const badgeW = roleMeta ? Math.max(44, roleMeta.label.length * 5.7 + 10) : 0;
        const headX = left + (badgeW ? badgeW + 11 : 8);
        const detailLines = wrapSvgLines(n.detail, Math.max(58, Math.floor((w - 14) / 5.15)));
        return `
          <g>
            <rect x="${left.toFixed(1)}" y="${top.toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="7.5" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" />
            ${
              roleMeta
                ? `<rect x="${(left + 5).toFixed(1)}" y="${(top + 4.5).toFixed(1)}" width="${badgeW.toFixed(1)}" height="15" rx="3.5" fill="${roleMeta.svgBadgeBg}" />
                   <text x="${(left + 5 + badgeW / 2).toFixed(1)}" y="${(top + 14.8).toFixed(1)}" text-anchor="middle" fill="#ffffff" font-size="8.1" font-weight="900">${escapeHtml(roleMeta.label.toUpperCase())}</text>`
                : ''
            }
            <text x="${headX.toFixed(1)}" y="${(top + 15.2).toFixed(1)}" text-anchor="start" fill="${textCol}" font-size="10.2" font-weight="800">${escapeHtml(n.label)}</text>
            ${
              detailLines[0]
                ? `<text x="${(left + 7).toFixed(1)}" y="${(top + 29.5).toFixed(1)}" text-anchor="start" fill="#334155" font-size="8.7" font-weight="600">${escapeHtml(detailLines[0])}</text>`
                : ''
            }
            ${
              detailLines[1]
                ? `<text x="${(left + 7).toFixed(1)}" y="${(top + 40.5).toFixed(1)}" text-anchor="start" fill="#334155" font-size="8.7" font-weight="600">${escapeHtml(detailLines[1])}</text>`
                : ''
            }
          </g>
        `;
      }

      const fSize = n.tier === 1 ? 12.2 : n.tier === 2 ? 11.4 : n.tier === 3 ? 10.7 : n.tier === 5 ? 9.3 : 10.1;
      const dispText =
        n.tier === 5
          ? `• ${n.label}`
          : `${n.label}${n.dateChip && n.tier <= 3 ? ` (${n.dateChip})` : ''}`;

      if (n.tier === 4 && roleMeta) {
        const badgeW = Math.max(42, roleMeta.label.length * 5.7 + 10);
        const textCenterX = left + badgeW + 6 + (w - badgeW - 10) / 2;
        return `
          <g>
            <rect x="${left.toFixed(1)}" y="${top.toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" />
            <rect x="${(left + 4).toFixed(1)}" y="${(top + 4).toFixed(1)}" width="${badgeW.toFixed(1)}" height="${(h - 8).toFixed(1)}" rx="3.5" fill="${roleMeta.svgBadgeBg}" />
            <text x="${(left + 4 + badgeW / 2).toFixed(1)}" y="${(n.y + 3.3).toFixed(1)}" text-anchor="middle" fill="#ffffff" font-size="8.2" font-weight="900">${escapeHtml(roleMeta.label.toUpperCase())}</text>
            <text x="${textCenterX.toFixed(1)}" y="${(n.y + 3.6).toFixed(1)}" text-anchor="middle" fill="${textCol}" font-size="${fSize}" font-weight="800">${escapeHtml(n.label)}</text>
          </g>
        `;
      }

      return `
        <g>
          <rect x="${left.toFixed(1)}" y="${top.toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" />
          <text x="${n.x.toFixed(1)}" y="${(n.y + 3.9).toFixed(1)}" text-anchor="middle" fill="${textCol}" font-size="${fSize}" font-weight="800">${escapeHtml(dispText)}</text>
        </g>
      `;
    })
    .join('');

  return `<svg viewBox="${minX.toFixed(1)} ${minY.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;font-family:'Segoe UI','Inter',system-ui,sans-serif;"><g style="opacity:1 !important;">${linkPaths}${nodeBoxes}</g></svg>`;
}

/**
 * Generates a 100% standalone, zero-spillover Vector Landscape HTML document for A4 or A3 printing.
 */
export function buildPrintableMindMapDocumentHTML(
  data,
  {
    paperSize = 'A3',
    pageScope = 'per-kt', // 'per-kt' | 'whole-course' | 'current-view'
    maxTier = 5,
    directionMode = 'center',
    styleMode = 'completed', // 'completed' | 'blurt'
  } = {},
) {
  const fourRing = isFourRingCardMap(data);
  const rawMaxTier = styleMode === 'blurt' && maxTier < 4 ? 4 : maxTier;
  const effectiveMaxTier = fourRing && rawMaxTier >= 5 ? 4 : rawMaxTier;
  const showCardDetail = fourRing && rawMaxTier >= 5 && styleMode !== 'blurt';
  const courseTitle = data?.courseTitle || data?.root?.label || 'GCSE History';
  const optionCode = data?.optionCode || '1HI0';
  const disclaimer =
    data?.disclaimer ||
    'Aligned to Pearson Edexcel GCSE (9–1) History (1HI0). Independent educational resource — not endorsed by Pearson.';

  const sheets = [];
  const paperLegend = getPaperLegendMeta(data);
  if (pageScope === 'per-kt') {
    (data?.root?.children || []).forEach((kt, idx) => {
      const isWfSheet = kt.id === 'kt5' || /Western Front/i.test(kt.label || '');
      sheets.push({
        heading: `${courseTitle} (${optionCode}) — ${kt.label}${kt.dateChip ? ` (${kt.dateChip})` : ''}`,
        pageBadge: `Sheet ${idx + 1} of ${(data?.root?.children || []).length}`,
        legendHtml: isWfSheet
          ? '<b class="lp e">4M FEATURE</b><b class="lp c">PROBLEM</b><b class="lp q3">SOLUTION</b>'
          : paperLegend.printPillsHtml,
        svg: renderSingleVectorSvg(buildKtSheetRoot(kt, courseTitle), {
          maxTier: effectiveMaxTier,
          showCardDetail,
          directionMode,
          styleMode,
          expandAll: true,
        }),
      });
    });
  } else if (pageScope === 'current-view') {
    sheets.push({
      heading: `${courseTitle} (${optionCode}) — Custom Unfolded Mind Map`,
      pageBadge: 'Sheet 1 of 1',
      legendHtml: paperLegend.printPillsHtml,
      svg: renderSingleVectorSvg(cloneNodeTree(data.root), {
        maxTier: effectiveMaxTier,
        showCardDetail,
        directionMode,
        styleMode,
        expandedIds: studioState.expandedIds,
        expandAll: false,
      }),
    });
  } else {
    sheets.push({
      heading: `${courseTitle} (${optionCode}) — Whole-Course Specification Mind Map`,
      pageBadge: 'Sheet 1 of 1',
      legendHtml: paperLegend.printPillsHtml,
      svg: renderSingleVectorSvg(cloneNodeTree(data.root), {
        maxTier: effectiveMaxTier,
        showCardDetail,
        directionMode,
        styleMode,
        expandAll: true,
      }),
    });
  }

  const isA3 = paperSize === 'A3';
  const sheetH = isA3 ? '279mm' : '194mm';
  const tierSummary =
    rawMaxTier <= 3
      ? 'Ring 3 (Official Spec Events)'
      : rawMaxTier === 4
        ? 'Ring 4 (Causes, Consequences & Importance)'
        : fourRing
          ? 'Ring 5 (Full Detail Cards)'
          : 'Ring 5 (Full Map + Supporting Fact Twigs)';

  const sheetsHtml = sheets
    .map(
      (sh) => `
        <section class="print-sheet">
          <header class="sheet-head">
            <div>
              <div class="brand-line" data-department-name="The History Department">
                <span class="school-brand-target">The History Revision Hub</span> &bull; ${styleMode === 'blurt' ? 'Active Recall Write-On Blurt Mind Map' : 'Specification-First Visual Mind Map'} &bull; ${escapeHtml(tierSummary)}
              </div>
              <h1>${escapeHtml(sh.heading)}</h1>
            </div>
            <div class="head-right">
              ${
                styleMode === 'blurt'
                  ? `<span class="pupil-fill">Name: ______________________ &nbsp; Class: ________</span>`
                  : effectiveMaxTier >= 4
                    ? `<span class="legend-pills">${sh.legendHtml}</span>`
                    : ''
              }
              <span class="sheet-num">${escapeHtml(sh.pageBadge)}</span>
            </div>
          </header>
          <div class="svg-stage">${sh.svg}</div>
          <footer class="sheet-foot">
            <span>${
              styleMode === 'blurt'
                ? 'Blurt Task: Fill in each tagged branch from memory in blue/black pen, then check against the interactive Mind Map and add missed points in green pen!'
                : escapeHtml(disclaimer)
            }</span>
            <span>historyrevisionhub.co.uk</span>
          </footer>
        </section>
      `,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(courseTitle)} — Printable ${escapeHtml(paperSize)} Landscape Mind Map</title>
<style>
  @page { size: ${isA3 ? 'A3' : 'A4'} landscape; margin: 8mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  html, body { margin: 0; padding: 0; font-family: 'Segoe UI', 'Inter', system-ui, sans-serif; color: #0f172a; background: #ffffff; }
  svg g { opacity: 1 !important; }
  .screen-bar { display: none; }
  .print-sheet {
    width: 100%;
    height: ${sheetH};
    max-height: ${sheetH};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    page-break-after: always;
    break-after: page;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .print-sheet:last-of-type {
    page-break-after: avoid !important;
    break-after: avoid !important;
  }
  .sheet-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1.8px solid #0f172a;
    padding-bottom: 3.5px;
    margin-bottom: 4px;
    flex-shrink: 0;
  }
  .brand-line { font-size: 7pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; color: #334155; }
  .sheet-head h1 { margin: 1px 0 0; font-size: ${isA3 ? '12pt' : '10.2pt'}; font-weight: 900; color: #0f172a; }
  .head-right { display: flex; align-items: center; gap: 8px; font-size: 7.5pt; font-weight: 700; flex-shrink: 0; }
  .legend-pills { display: inline-flex; gap: 4px; }
  .lp { padding: 1.5px 5px; border-radius: 3px; font-size: 6.4pt; color: #fff; }
  .lp.c { background: #c2410c; }
  .lp.e { background: #0369a1; }
  .lp.q1 { background: #6d28d9; }
  .lp.q3 { background: #047857; }
  .lp.d { background: #be185d; }
  .lp.co { background: #4338ca; }
  .lp.fu { background: #b45309; }
  .lp.g9 { background: #b45309; }
  .sheet-num { background: #0f172a; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 6.8pt; font-weight: 800; }
  .svg-stage { flex: 1 1 auto; min-height: 0; width: 100%; overflow: hidden; }
  .sheet-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #cbd5e1;
    padding-top: 2.5px;
    margin-top: 3px;
    font-size: 6.6pt;
    color: #475569;
    flex-shrink: 0;
  }
  @media screen {
    body { background: #e2e8f0; padding: 48px 16px 24px; }
    .screen-bar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 99;
      background: #0f172a; color: #fff; padding: 9px 18px;
      display: flex; align-items: center; justify-content: space-between;
      font-size: 13px; font-weight: 700;
    }
    .screen-bar button {
      background: #2563eb; color: #fff; border: none; border-radius: 6px;
      padding: 6px 14px; font-weight: 800; cursor: pointer;
    }
    .print-sheet {
      background: #fff;
      max-width: ${isA3 ? '1380px' : '1080px'};
      height: ${isA3 ? '920px' : '720px'};
      max-height: none;
      margin: 0 auto 20px;
      padding: 16px 20px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.16);
    }
  }
</style>
</head>
<body>
  <div class="screen-bar">
    <span>🖨️ ${escapeHtml(paperSize)} Landscape Vector Mind Map Preview (${sheets.length} ${sheets.length === 1 ? 'Sheet' : 'Sheets'} — Set Printer Layout to "${escapeHtml(paperSize)}" &amp; "Landscape")</span>
    <button type="button" onclick="window.print()">Print / Save as PDF</button>
  </div>
  ${sheetsHtml}
</body>
</html>`;
}

export async function openMindMapPrintModal(rawUnitId = null, fallbackSpecTree = null) {
  if (typeof document === 'undefined') return;
  document.getElementById('tmm-print-modal-backdrop')?.remove();

  const unitId = resolveMindMapUnitId(rawUnitId || studioState.unitId || 'cme_new');
  const data =
    studioState.data && studioState.unitId === unitId
      ? studioState.data
      : await loadMindMapSingleSource(unitId, fallbackSpecTree || studioState.fallbackSpecTree);

  const fourRing = isFourRingCardMap(data);
  const ktCount = (data?.root?.children || []).length || 3;
  const paperLegend = getPaperLegendMeta(data);

  const opts = {
    paperSize: 'A3',
    pageScope: 'per-kt',
    maxTier: 5,
    directionMode: 'center',
    styleMode: 'completed',
  };

  const backdrop = document.createElement('div');
  backdrop.className = 'tmm-print-backdrop';
  backdrop.id = 'tmm-print-modal-backdrop';
  document.body.appendChild(backdrop);

  const stemWord = paperLegend.isGcse ? 'Spec Events' : 'Key Milestones';
  const ktWord = paperLegend.isGcse ? 'Key Topic' : 'Part';

  const renderModal = () => {
    const sheetCount = opts.pageScope === 'per-kt' ? ktCount : 1;
    const g89Short = fourRing
      ? 'Ring 5 Full Detail Cards'
      : 'Ring 5 (+ Supporting Fact Twigs)';
    const recommendation =
      opts.styleMode === 'blurt'
        ? `✏️ Prints ${sheetCount} ${opts.paperSize} Landscape write-on Mind-Map ${sheetCount === 1 ? 'sheet' : 'sheets'} with ${stemWord} on Ring 3 and roomy 2-line ${paperLegend.modalTagSummary} boxes on Ring 4 for pupils to write both the point and supporting detail.`
        : `📖 Prints ${sheetCount} crisp vector ${opts.paperSize} Landscape Mind-Map ${sheetCount === 1 ? 'poster' : 'posters'} (${opts.maxTier === 3 ? `Ring 3 ${stemWord}` : opts.maxTier === 4 ? `Ring 4 ${paperLegend.modalTagSummary}` : g89Short}) with zero page spillover.`;

    backdrop.innerHTML = `
      <div class="tmm-print-modal" role="dialog" aria-modal="true" aria-label="Print Visual Mind Map">
        <div class="tmm-print-head">
          <div>
            <div style="font-size:0.68rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#93c5fd;">Vector Classroom Reprographics</div>
            <div style="font-size:1rem;font-weight:900;">🖨️ Print Visual Revision Mind Map</div>
          </div>
          <button type="button" data-print-close style="background:transparent;border:none;color:#fff;font-size:1.1rem;cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="tmm-print-body">
          <div>
            <div class="tmm-print-field-lbl">1. Classroom Mode</div>
            <div class="tmm-print-grid">
              <button type="button" class="tmm-print-choice ${opts.styleMode === 'completed' ? 'is-picked' : ''}" data-opt-key="styleMode" data-opt-val="completed">
                <strong>📖 Completed Revision Map</strong>
                <span>Full ${escapeHtml(stemWord.toLowerCase())}, ${escapeHtml(paperLegend.modalTagSummary)} &amp; supporting facts printed</span>
              </button>
              <button type="button" class="tmm-print-choice ${opts.styleMode === 'blurt' ? 'is-picked' : ''}" data-opt-key="styleMode" data-opt-val="blurt">
                <strong>✏️ Blank Write-On Blurt Map</strong>
                <span>Prints ${escapeHtml(stemWord)} + empty ${escapeHtml(paperLegend.modalTagSummary)} boxes to fill by hand</span>
              </button>
            </div>
          </div>

          <div>
            <div class="tmm-print-field-lbl">2. Paper Size &amp; Page Scope</div>
            <div class="tmm-print-grid">
              <button type="button" class="tmm-print-choice ${opts.paperSize === 'A3' ? 'is-picked' : ''}" data-opt-key="paperSize" data-opt-val="A3">
                <strong>A3 Landscape (420 × 297 mm)</strong>
                <span>Best for Ring 4–5 full detail &amp; Write-On Blurt boxes</span>
              </button>
              <button type="button" class="tmm-print-choice ${opts.paperSize === 'A4' ? 'is-picked' : ''}" data-opt-key="paperSize" data-opt-val="A4">
                <strong>A4 Landscape (297 × 210 mm)</strong>
                <span>Best for Ring 3 ${escapeHtml(stemWord)} or 1 ${escapeHtml(ktWord)} per sheet</span>
              </button>
            </div>
            <div class="tmm-print-grid" style="margin-top:8px;">
              <button type="button" class="tmm-print-choice ${opts.pageScope === 'per-kt' ? 'is-picked' : ''}" data-opt-key="pageScope" data-opt-val="per-kt">
                <strong>1 ${escapeHtml(ktWord)} per Page (${ktCount} Sheets)</strong>
                <span>Recommended — maximum font legibility across every branch</span>
              </button>
              <button type="button" class="tmm-print-choice ${opts.pageScope === 'whole-course' ? 'is-picked' : ''}" data-opt-key="pageScope" data-opt-val="whole-course">
                <strong>Whole Unit on 1 Sheet</strong>
                <span>Master overview poster of all ${ktCount} ${escapeHtml(ktWord)}s together</span>
              </button>
              <button type="button" class="tmm-print-choice ${opts.pageScope === 'current-view' ? 'is-picked' : ''}" data-opt-key="pageScope" data-opt-val="current-view">
                <strong>Current Open View (1 Sheet)</strong>
                <span>Prints the exact branches currently unfolded on your screen</span>
              </button>
            </div>
          </div>

          <div>
            <div class="tmm-print-field-lbl">3. Ring Depth &amp; Branch Flow</div>
            <div class="tmm-print-grid">
              <button type="button" class="tmm-print-choice ${opts.maxTier === 3 ? 'is-picked' : ''}" data-opt-key="maxTier" data-opt-val="3">
                <strong>Ring 3 (${escapeHtml(stemWord)})</strong>
                <span>Core milestones &amp; turning points</span>
              </button>
              <button type="button" class="tmm-print-choice ${opts.maxTier === 4 ? 'is-picked' : ''}" data-opt-key="maxTier" data-opt-val="4">
                <strong>Ring 4 (Claims)</strong>
                <span>1-line ${escapeHtml(paperLegend.modalTagSummary)}</span>
              </button>
              <button type="button" class="tmm-print-choice ${opts.maxTier === 5 ? 'is-picked' : ''}" data-opt-key="maxTier" data-opt-val="5">
                <strong>${fourRing ? 'Ring 5 (Full Cards)' : 'Ring 5 (+ Fact Twigs)'}</strong>
                <span>${fourRing ? 'Headlines + full detail lines' : 'Claims + 2 supporting-fact mini-twigs each'}</span>
              </button>
            </div>
            <div class="tmm-print-grid" style="margin-top:8px;">
              <button type="button" class="tmm-print-choice ${opts.directionMode === 'center' ? 'is-picked' : ''}" data-opt-key="directionMode" data-opt-val="center">
                <strong>↔ Centre-Out Spider</strong>
                <span>Balanced left &amp; right — fills landscape paper best</span>
              </button>
              <button type="button" class="tmm-print-choice ${opts.directionMode === 'right' ? 'is-picked' : ''}" data-opt-key="directionMode" data-opt-val="right">
                <strong>→ Left-to-Right Tree</strong>
                <span>All branches flow strictly to the right</span>
              </button>
            </div>
          </div>

          <div class="tmm-print-summary">${escapeHtml(recommendation)}</div>
        </div>

        <div class="tmm-print-foot">
          <button type="button" class="tmm-action-pill" data-print-close>Cancel</button>
          <button type="button" class="tmm-action-pill fullscreen-cta" data-print-launch>
            <i class="fa-solid fa-print"></i>
            <span>Open ${escapeHtml(opts.paperSize)} Print Preview (${sheetCount} ${sheetCount === 1 ? 'Sheet' : 'Sheets'})</span>
          </button>
        </div>
      </div>
    `;

    backdrop.querySelectorAll('[data-print-close]').forEach((b) =>
      b.addEventListener('click', () => backdrop.remove()),
    );

    backdrop.querySelectorAll('[data-opt-key]').forEach((b) => {
      b.addEventListener('click', () => {
        const k = b.getAttribute('data-opt-key');
        const raw = b.getAttribute('data-opt-val');
        opts[k] = k === 'maxTier' ? parseInt(raw, 10) : raw;
        if (k === 'styleMode' && opts.styleMode === 'blurt' && opts.maxTier < 4) {
          opts.maxTier = 4;
        }
        renderModal();
      });
    });

    backdrop.querySelector('[data-print-launch]')?.addEventListener('click', () => {
      const html = buildPrintableMindMapDocumentHTML(data, opts);
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => {
          try {
            win.focus();
            win.print();
          } catch (_) {}
        }, 320);
      }
      backdrop.remove();
    });
  };

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.remove();
  });
  renderModal();
}

if (typeof window !== 'undefined') {
  window.__buildPrintableMindMapDocumentHTML = buildPrintableMindMapDocumentHTML;
  window.__loadMindMapSingleSource = loadMindMapSingleSource;
}

/**
 * Mounts the True Radial Mind-Map & Outline Studio into `mountEl`.
 */
export async function mountTrueMindMapStudio(
  mountEl,
  rawUnitId,
  { fallbackSpecTree = null, onOpenQuestionDrawer = null, startFullscreen = false, focusLessonIndex = null } = {},
) {
  if (!mountEl) return;
  const unitId = resolveMindMapUnitId(rawUnitId);
  const switchedUnit = studioState.unitId !== unitId;
  const pendingLessonFocus =
    typeof focusLessonIndex === 'number'
      ? focusLessonIndex
      : typeof window !== 'undefined' && typeof window._tmmFocusLessonIdx === 'number'
        ? window._tmmFocusLessonIdx
        : null;
  if (typeof window !== 'undefined') {
    window._tmmFocusLessonIdx = null;
  }

  studioState.unitId = unitId;
  studioState.mountEl = mountEl;
  studioState.fallbackSpecTree = fallbackSpecTree;
  studioState.onOpenQuestionDrawer = onOpenQuestionDrawer;

  const isKs2Unit = String(unitId || '').toLowerCase().startsWith('ks2_');
  if (switchedUnit) {
    studioState.maxTier = isKs2Unit ? 3 : 5;
    studioState.expandedIds = new Set(['root']);
    studioState.focusedNodeId = 'root';
    studioState.cameraInitialized = false;
    studioState.whisperDismissed = false;
    studioState.blurRecall = false;
    studioState.revealedNodeIds.clear();
    studioState.searchQuery = '';
    studioState.searchMatchIds.clear();
  } else if (isKs2Unit && studioState.expandedIds.size <= 1) {
    studioState.maxTier = 3;
  }
  if (startFullscreen) {
    studioState.isFullscreen = true;
  }

  if (typeof document !== 'undefined') {
    document.body.classList.toggle('tmm-fullscreen-active', studioState.isFullscreen);
  }

  mountEl.innerHTML = `
    <div style="padding:36px;text-align:center;color:#64748b;">
      <i class="fa-solid fa-spinner fa-spin"></i> Loading ${isKs2Unit ? 'Topic' : 'Specification'} Mind Map...
    </div>
  `;

  studioState.data = await loadMindMapSingleSource(unitId, fallbackSpecTree);
  if (switchedUnit || studioState.expandedIds.size <= 1 || typeof pendingLessonFocus === 'number') {
    seedInitialFocusState(studioState.data.root, pendingLessonFocus);
    studioState.cameraInitialized = false;
    studioState.whisperDismissed = false;
  }
  rerenderStudio({ autoFit: !studioState.cameraInitialized });

  if (typeof window !== 'undefined' && !window.__tmmEscListenerBound) {
    window.__tmmEscListenerBound = true;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const printModal = document.getElementById('tmm-print-modal-backdrop');
        if (printModal) {
          printModal.remove();
          return;
        }
        if (studioState.isFullscreen) {
          toggleTrueFullscreen(false);
        }
      }
    });
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && studioState.isFullscreen) {
        studioState.isFullscreen = false;
        rerenderStudio({ autoFit: true });
      }
    });
  }
}

export function exitMindMapFullscreenIfOpen() {
  if (studioState.isFullscreen) {
    studioState.isFullscreen = false;
  }
  if (typeof document !== 'undefined') {
    document.body.classList.remove('tmm-fullscreen-active');
  }
}
