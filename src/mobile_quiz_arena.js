/**
 * Mobile Quiz Arena — Duolingo-Grade Zero-Jump (CLS = 0) Active Recall Workspace
 * Modes: Quick MCQ (default) · Gap Fill (Cloze) · Flashcards · Term Match · Mistakes · 60s Daily Bus Blitz
 * Zero Exam Clinic overlap, Zero PDFs, 100% Dark Mode & Mobile Safe-Area Compliant.
 */

import {
  getGamificationSummary,
  awardXp,
  renderShareableReceiptHTML,
} from './mobile_gamification.js';
import './mobile_quiz_arena.css';
import { state } from './state.js';
import {
  ensureUnitLoaded,
  generateQuestionId,
  recordQuestionResult,
  getWeakSpots,
} from './storage.js';
import {
  CANONICAL_COURSES,
  getPinnedUnits,
  pinSingleUnitQuick,
} from './mobile_app_shell.js';

const COURSE_LOOKUP = new Map(CANONICAL_COURSES.map((c) => [c.id, c]));

let activeRenderToken = 0;
let activeTimerInterval = null;
let activeAutoAdvanceTimeout = null;

const arenaSession = {
  unitId: '',
  unitData: null,
  lessonScope: 'all', // 'all' | number (lesson index)
  mode: 'mcq', // 'mcq' | 'cloze' | 'flashcards' | 'match' | 'mistakes' | 'blitz'
  mcq: null,
  cloze: null,
  flashcards: null,
  match: null,
};

function clearArenaTimers() {
  if (activeTimerInterval) {
    clearInterval(activeTimerInterval);
    activeTimerInterval = null;
  }
  if (activeAutoAdvanceTimeout) {
    clearTimeout(activeAutoAdvanceTimeout);
    activeAutoAdvanceTimeout = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

function escapeHtml(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Escapes HTML and cleanly converts **bold** / *italic* markdown so raw asterisks never render.
 */
function formatCleanHtml(val) {
  return escapeHtml(val)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
}

function stripPlainText(val) {
  return String(val ?? '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/<[^>]*>/g, '')
    .trim();
}

function shortenLessonTitle(rawTitle, idx) {
  const clean = stripPlainText(rawTitle);
  if (!clean) return `Lesson ${idx + 1}`;
  const stripped = clean.replace(/^(?:KT\d+\.\d+|Lesson\s*\d+|Enquiry\s*\d+)\s*:\s*/i, '').trim();
  return `L${idx + 1}: ${stripped || clean}`;
}

function createSeededRandom(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function nextRand() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    const t = (h ^= h >>> 16) >>> 0;
    return t / 4294967296;
  };
}

function shuffleWithRng(arr, rng = Math.random) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function getCachedUnitDataSync(unitId) {
  if (!unitId) return null;
  if (state.selectedUnitId === unitId && state.activeUnitData?.lessons) {
    return state.activeUnitData;
  }
  const entry = state.db && state.db[unitId];
  if (entry && !entry._isIndexStub) {
    const d = entry.data || entry;
    if (d && Array.isArray(d.lessons)) return d;
  }
  return null;
}

/**
 * Extracts pure retrieval MCQ items (strictly zero Exam Clinic overlap).
 */
function extractMcqPool(unitId, unitData, lessonScope = 'all') {
  const lessons = Array.isArray(unitData?.lessons) ? unitData.lessons : [];
  const targetLessons =
    typeof lessonScope === 'number' && lessons[lessonScope]
      ? [{ lesson: lessons[lessonScope], index: lessonScope }]
      : lessons.map((lesson, index) => ({ lesson, index }));

  const pool = [];
  const seenIds = new Set();
  const allFallbackAnswers = [];

  lessons.forEach((l) => {
    (l.vocab || []).forEach((v) => {
      if (v?.term) allFallbackAnswers.push(String(v.term).trim());
    });
  });

  targetLessons.forEach(({ lesson, index }) => {
    const lessonTitle = lesson.title || `Lesson ${index + 1}`;
    const lessonId = lesson.id || `lesson_${index + 1}`;
    const rawQuiz = lesson.quiz || lesson.quick_quiz || lesson.quiz_questions || [];

    const beforeLessonCount = pool.length;
    if (Array.isArray(rawQuiz)) {
      rawQuiz.forEach((q) => {
        const qText = stripPlainText(q.question || q.q);
        if (!qText || qText === 'Who is this historical figure?') return;
        let answerText = q.a ?? q.answer;
        if (Array.isArray(q.options) && typeof q.answer === 'number') {
          answerText = q.options[q.answer];
        }
        answerText = stripPlainText(answerText);
        if (!answerText) return;

        let opts = Array.isArray(q.options)
          ? q.options.map((o) => stripPlainText(o)).filter(Boolean)
          : [];

        if (opts.length < 2) return;
        if (!opts.includes(answerText)) {
          opts = [answerText, ...opts.slice(0, 3)];
        }

        const qId = generateQuestionId(unitId, lessonTitle, qText);
        if (seenIds.has(qId)) return;
        seenIds.add(qId);

        pool.push({
          id: qId,
          unitId,
          lessonIndex: index,
          lessonId,
          source: lessonTitle,
          q: qText,
          a: answerText,
          options: opts,
          explanation: stripPlainText(q.explanation || ''),
        });
      });
    }

    // Fallback: synthesize 4-option vocab MCQs if a lesson has vocab but zero quiz items
    if (pool.length === beforeLessonCount && Array.isArray(lesson.vocab) && lesson.vocab.length > 0) {
      lesson.vocab.forEach((v) => {
        const term = stripPlainText(v.term);
        const def = stripPlainText(v.definition || v.def);
        if (!term || !def) return;
        const distractors = shuffleWithRng(
          allFallbackAnswers.filter((t) => t && t.toLowerCase() !== term.toLowerCase()),
        ).slice(0, 3);
        if (distractors.length < 2) return;
        const qText = `Which historical term matches this definition: "${def}"?`;
        const qId = generateQuestionId(unitId, lessonTitle, qText);
        if (seenIds.has(qId)) return;
        seenIds.add(qId);
        pool.push({
          id: qId,
          unitId,
          lessonIndex: index,
          lessonId,
          source: lessonTitle,
          q: qText,
          a: term,
          options: [term, ...distractors],
          explanation: `${term}: ${def}`,
        });
      });
    }
  });

  return pool;
}

/**
 * Collects pending Mistakes from `getWeakSpots()` + `state.mastery` Box 1
 * across the active unit and pinned units.
 */
function collectMistakesPool(activeUnitId, activeUnitData) {
  const pinnedSet = new Set(getPinnedUnits());
  const allowedUnits = new Set([activeUnitId, ...pinnedSet].filter(Boolean));
  const itemsById = new Map();

  // Build quick lookup of hydrated MCQs across active + any hydrated pinned units
  const hydratedQuestionMap = new Map();
  const distractorAnswerPool = [];

  const indexUnitQuestions = (uId, uData) => {
    if (!uId || !uData) return;
    const mcqs = extractMcqPool(uId, uData, 'all');
    mcqs.forEach((item) => {
      hydratedQuestionMap.set(item.id, item);
      if (item.a) distractorAnswerPool.push(item.a);
    });
  };

  indexUnitQuestions(activeUnitId, activeUnitData);
  pinnedSet.forEach((pId) => {
    if (pId !== activeUnitId) {
      const cached = getCachedUnitDataSync(pId);
      if (cached) indexUnitQuestions(pId, cached);
    }
  });

  // 1. Pull from weakSpots ledger (prefer active + pinned units; include all if none pinned)
  const allWeak = getWeakSpots(null);
  allWeak.forEach((ws) => {
    if (!ws || !ws.id) return;
    const wsUnit = ws.unitId || activeUnitId;
    if (pinnedSet.size > 0 && !allowedUnits.has(wsUnit) && wsUnit !== 'general') {
      // Still include if activeUnit has 0 and wsUnit matches nothing else? Keep scoped to active + pinned!
      return;
    }
    const hydrated = hydratedQuestionMap.get(ws.id);
    const qText = stripPlainText(ws.q || hydrated?.q || '');
    const aText = stripPlainText(ws.a || hydrated?.a || '');
    if (!qText || !aText) return;

    let opts = Array.isArray(ws.options) && ws.options.length >= 2
      ? ws.options.map((o) => stripPlainText(o)).filter(Boolean)
      : hydrated?.options || [];

    if (opts.length < 2) {
      const decoys = shuffleWithRng(
        distractorAnswerPool.filter((ans) => ans && ans.toLowerCase() !== aText.toLowerCase()),
      ).slice(0, 3);
      opts = [aText, ...decoys];
    }
    if (opts.length < 2) return;

    itemsById.set(ws.id, {
      id: ws.id,
      unitId: wsUnit === 'general' ? activeUnitId : wsUnit,
      source: stripPlainText(ws.source || hydrated?.source || 'Targeted Review'),
      q: qText,
      a: aText,
      options: opts,
      explanation: stripPlainText(ws.explanation || hydrated?.explanation || ''),
      priority: ws.tier === 'red' ? 0 : 1,
    });
  });

  // 2. Pull Box 1 items from state.mastery for hydrated units
  let masteryMap = state.mastery;
  if (!masteryMap || Object.keys(masteryMap).length === 0) {
    try {
      const rawM = localStorage.getItem('history_mastery');
      masteryMap = rawM ? JSON.parse(rawM) : {};
    } catch (e) {
      masteryMap = {};
    }
  }

  Object.entries(masteryMap || {}).forEach(([qId, entry]) => {
    if (!entry || entry.leitnerBox !== 1 || itemsById.has(qId)) return;
    const hydrated = hydratedQuestionMap.get(qId);
    if (hydrated) {
      itemsById.set(qId, {
        ...hydrated,
        priority: 2,
      });
    }
  });

  const combined = [...itemsById.values()];
  // Sort: activeUnit first, then Red tier, then Amber/Box 1
  combined.sort((a, b) => {
    const aActive = a.unitId === activeUnitId ? 0 : 1;
    const bActive = b.unitId === activeUnitId ? 0 : 1;
    if (aActive !== bActive) return aActive - bActive;
    return (a.priority || 0) - (b.priority || 0);
  });

  return combined;
}

function buildMcqRoundState(questions, { isBlitz = false, isMistakes = false } = {}) {
  const rng = isBlitz ? createSeededRandom(`blitz_${getTodayIso()}`) : Math.random;
  let selected = isMistakes ? questions.slice(0, 10) : [];

  if (!isMistakes) {
    if (isBlitz) {
      selected = shuffleWithRng(questions, rng).slice(0, 8);
    } else {
      // Prioritise unseen or lower Leitner box questions so rounds feel fresh
      const mastery = state.mastery || {};
      const bucketUnseen = [];
      const bucketSeen = [];
      shuffleWithRng(questions).forEach((q) => {
        const box = mastery[q.id]?.leitnerBox || 0;
        if (box <= 1) bucketUnseen.push(q);
        else bucketSeen.push(q);
      });
      selected = [...bucketUnseen, ...bucketSeen].slice(0, 10);
    }
  }

  const prepared = selected.map((item) => ({
    ...item,
    shuffledOptions: shuffleWithRng(item.options, rng),
  }));

  return {
    questions: prepared,
    index: 0,
    correctCount: 0,
    combo: 0,
    maxCombo: 0,
    answered: false,
    selectedOpt: null,
    isCorrect: false,
    finished: false,
    xpAwarded: 0,
    isBlitz,
    isMistakes,
    secondsLeft: isBlitz ? 60 : 0,
    timerPaused: false,
  };
}

function buildClozeLessonState(unitData, targetIdx = 0) {
  const lessons = Array.isArray(unitData?.lessons) ? unitData.lessons : [];
  const validIndices = [];
  lessons.forEach((l, idx) => {
    if (typeof l?.vocab_cloze_text === 'string' && l.vocab_cloze_text.includes('[')) {
      validIndices.push(idx);
    }
  });

  if (validIndices.length === 0) return null;

  const resolvedIdx = validIndices.includes(targetIdx) ? targetIdx : validIndices[0];
  const lesson = lessons[resolvedIdx];
  const raw = String(lesson.vocab_cloze_text || '').trim();

  const segments = [];
  const answers = [];
  let lastIdx = 0;
  let slotCounter = 0;
  const regex = /\[([^\]]+)\]/g;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIdx) {
      segments.push({ type: 'text', value: raw.slice(lastIdx, match.index) });
    }
    const term = stripPlainText(match[1]);
    segments.push({ type: 'slot', index: slotCounter, answer: term });
    answers.push(term);
    slotCounter += 1;
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < raw.length) {
    segments.push({ type: 'text', value: raw.slice(lastIdx) });
  }
  if (answers.length === 0) return null;

  // Pull +2 decoy tiles dynamically from adjacent lessons
  const excludedLower = new Set([
    ...answers.map((a) => a.toLowerCase()),
    ...(lesson.vocab || []).map((v) => stripPlainText(v?.term || '').toLowerCase()),
  ]);
  const donorPool = [];
  const neighborIndices =
    resolvedIdx > 0
      ? [resolvedIdx - 1, resolvedIdx + 1, 0, resolvedIdx + 2]
      : [resolvedIdx + 1, resolvedIdx + 2, resolvedIdx + 3];

  neighborIndices.forEach((nIdx) => {
    const donor = lessons[nIdx];
    if (donor && donor !== lesson && Array.isArray(donor.vocab)) {
      donor.vocab.forEach((v) => {
        const t = stripPlainText(v?.term || '');
        if (t && !excludedLower.has(t.toLowerCase())) {
          excludedLower.add(t.toLowerCase());
          donorPool.push(t);
        }
      });
    }
  });

  const decoys = shuffleWithRng(donorPool).slice(0, 2);
  const chips = shuffleWithRng(
    [...answers, ...decoys].map((word, idx) => ({
      id: idx,
      word,
      isDecoy: idx >= answers.length,
    })),
  );

  const lessonId = lesson.id || `lesson_${resolvedIdx + 1}`;
  let previouslyMastered = false;
  try {
    previouslyMastered = localStorage.getItem(`history_cloze_${lessonId}`) === '1';
  } catch (e) {}

  return {
    validIndices,
    lessonIndex: resolvedIdx,
    lessonId,
    lessonTitle: shortenLessonTitle(lesson.title, resolvedIdx),
    segments,
    answers,
    decoysCount: decoys.length,
    chips,
    slots: new Array(answers.length).fill(null), // chip array index
    locked: new Array(answers.length).fill(false),
    wrongFlags: new Array(answers.length).fill(false),
    activeSlot: 0,
    completed: false,
    previouslyMastered,
    xpAwarded: 0,
    statusMsg: '',
    statusTone: '',
  };
}

function buildFlashcardsDeck(unitId, unitData, lessonScope = 'all') {
  const lessons = Array.isArray(unitData?.lessons) ? unitData.lessons : [];
  const targetLessons =
    typeof lessonScope === 'number' && lessons[lessonScope]
      ? [{ lesson: lessons[lessonScope], index: lessonScope }]
      : lessons.map((lesson, index) => ({ lesson, index }));

  const cards = [];
  const seenFronts = new Set();

  targetLessons.forEach(({ lesson, index }) => {
    const lessonId = lesson.id || `lesson_${index + 1}`;
    const sourceTitle = shortenLessonTitle(lesson.title, index);

    if (Array.isArray(lesson.vocab)) {
      lesson.vocab.forEach((v) => {
        const term = stripPlainText(v?.term);
        const def = stripPlainText(v?.definition || v?.def);
        if (!term || !def) return;
        const key = term.toLowerCase();
        if (seenFronts.has(key)) return;
        seenFronts.add(key);
        cards.push({
          id: generateQuestionId(unitId, lesson.title || lessonId, term),
          front: term,
          back: def,
          phonetic: stripPlainText(v?.phonetic || v?.pronunciation || ''),
          source: sourceTitle,
          lessonId,
        });
      });
    }

    if (Array.isArray(lesson.flashcards)) {
      lesson.flashcards.forEach((fc) => {
        const front = stripPlainText(fc?.front || fc?.question || fc?.q);
        const back = stripPlainText(fc?.back || fc?.answer || fc?.a);
        if (!front || !back) return;
        const key = front.toLowerCase();
        if (seenFronts.has(key)) return;
        seenFronts.add(key);
        cards.push({
          id: generateQuestionId(unitId, lesson.title || lessonId, front),
          front,
          back,
          phonetic: '',
          source: sourceTitle,
          lessonId,
        });
      });
    }
  });

  // Fallback to quiz Q&As if unit has zero vocab/flashcards
  if (cards.length === 0) {
    const mcqs = extractMcqPool(unitId, unitData, lessonScope);
    mcqs.forEach((m) => {
      cards.push({
        id: m.id,
        front: m.q,
        back: m.a,
        phonetic: '',
        source: m.source,
        lessonId: m.lessonId,
      });
    });
  }

  const deck = shuffleWithRng(cards).slice(0, 12);
  return {
    totalInitial: deck.length,
    queue: [...deck],
    gotItCount: 0,
    stillLearningCount: 0,
    flipped: false,
    finished: false,
    xpAwarded: 0,
  };
}

function truncateDef(str, maxChars = 115) {
  const clean = stripPlainText(str);
  if (clean.length <= maxChars) return clean;
  const cut = clean.slice(0, maxChars - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${lastSpace > 60 ? cut.slice(0, lastSpace) : cut}\u2026`;
}

function buildTermMatchState(unitData, lessonScope = 'all') {
  const lessons = Array.isArray(unitData?.lessons) ? unitData.lessons : [];
  const pairs = [];
  const seenTerms = new Set();

  const collectFromLesson = (lesson) => {
    if (!lesson || !Array.isArray(lesson.vocab)) return;
    lesson.vocab.forEach((v) => {
      const term = stripPlainText(v?.term);
      const def = truncateDef(v?.definition || v?.def, 112);
      if (!term || !def) return;
      const key = term.toLowerCase();
      if (seenTerms.has(key)) return;
      seenTerms.add(key);
      pairs.push({ pairId: pairs.length, term, def });
    });
  };

  if (typeof lessonScope === 'number' && lessons[lessonScope]) {
    collectFromLesson(lessons[lessonScope]);
    // Supplement from adjacent lessons if fewer than 5 terms
    if (pairs.length < 5) {
      lessons.forEach((l, idx) => {
        if (idx !== lessonScope) collectFromLesson(l);
      });
    }
  } else {
    lessons.forEach((l) => collectFromLesson(l));
  }

  const chosen = shuffleWithRng(pairs).slice(0, 5);
  return {
    pairs: chosen,
    leftTerms: shuffleWithRng(chosen.map((p) => ({ pairId: p.pairId, text: p.term }))),
    rightDefs: shuffleWithRng(chosen.map((p) => ({ pairId: p.pairId, text: p.def }))),
    matchedIds: new Set(),
    selectedTermId: null,
    selectedDefId: null,
    mismatchPair: null,
    combo: 0,
    mistakes: 0,
    startedAt: Date.now(),
    elapsedTenths: 0,
    finished: false,
    xpAwarded: 0,
  };
}

function speakUkText(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;
  try {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const utter = new SpeechSynthesisUtterance(stripPlainText(text));
    utter.lang = 'en-GB';
    utter.rate = 0.96;
    const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    const ukVoice =
      voices.find((v) => v.lang === 'en-GB' && /Google|Libby|Sonia|Ryan|Daniel|Martha/i.test(v.name)) ||
      voices.find((v) => v.lang && v.lang.startsWith('en-GB'));
    if (ukVoice) utter.voice = ukVoice;
    window.speechSynthesis.speak(utter);
  } catch (e) {}
}

function renderControlAndModeBarHTML(container) {
  const activeUnitId = arenaSession.unitId;
  const unitData = arenaSession.unitData || {};
  const lessons = Array.isArray(unitData.lessons) ? unitData.lessons : [];
  const pinnedIds = getPinnedUnits();
  const pinnedSet = new Set(pinnedIds);
  const isPinned = pinnedSet.has(activeUnitId);

  const buildCourseOptions = () => {
    let html = '';
    if (pinnedIds.length > 0) {
      html += '<optgroup label="My Pinned Courses">';
      pinnedIds.forEach((id) => {
        const meta = COURSE_LOOKUP.get(id);
        const title = meta ? meta.title : id;
        html += `<option value="${escapeHtml(id)}" ${id === activeUnitId ? 'selected' : ''}>${escapeHtml(title)}</option>`;
      });
      html += '</optgroup>';
    }

    const groups = [
      { key: 'gcse', label: 'GCSE History (Edexcel 9–1)' },
      { key: 'ks3', label: 'Key Stage 3 History' },
      { key: 'ks2', label: 'Key Stage 2 Primary' },
    ];

    groups.forEach((grp) => {
      const unpinnedInGroup = CANONICAL_COURSES.filter(
        (c) => c.group === grp.key && !pinnedSet.has(c.id),
      );
      if (unpinnedInGroup.length > 0) {
        html += `<optgroup label="${escapeHtml(grp.label)}">`;
        unpinnedInGroup.forEach((c) => {
          html += `<option value="${escapeHtml(c.id)}" ${c.id === activeUnitId ? 'selected' : ''}>${escapeHtml(c.title)}</option>`;
        });
        html += '</optgroup>';
      }
    });

    if (!COURSE_LOOKUP.has(activeUnitId) && !pinnedSet.has(activeUnitId)) {
      const fallbackTitle = stripPlainText(unitData.title || activeUnitId);
      html = `<option value="${escapeHtml(activeUnitId)}" selected>${escapeHtml(fallbackTitle)}</option>${html}`;
    }

    return html;
  };

  const buildTopicOptions = () => {
    const isAll = arenaSession.lessonScope === 'all';
    let html = `<option value="all" ${isAll ? 'selected' : ''}>All Topics (Mixed)</option>`;
    lessons.forEach((l, idx) => {
      const sel = arenaSession.lessonScope === idx ? 'selected' : '';
      html += `<option value="${idx}" ${sel}>${escapeHtml(shortenLessonTitle(l.title, idx))}</option>`;
    });
    return html;
  };

  const mistakesPool = collectMistakesPool(activeUnitId, unitData);
  const mistakesCount = mistakesPool.length;
  const mode = arenaSession.mode;

  const hasClozeInUnit = lessons.some(
    (l) => typeof l?.vocab_cloze_text === 'string' && l.vocab_cloze_text.includes('['),
  );

  return `
    <div class="hh-mqa-controls">
      <div class="hh-mqa-course-row">
        <select id="hh-mqa-course-select" class="hh-mqa-select" aria-label="Select History Course">
          ${buildCourseOptions()}
        </select>
        ${
          !isPinned && COURSE_LOOKUP.has(activeUnitId)
            ? `<button type="button" id="hh-mqa-pin-btn" class="hh-mqa-pin-chip" title="Pin this course to My Courses">
                <span>\uD83D\uDCCC Pin</span>
              </button>`
            : ''
        }
      </div>
      ${
        mode !== 'blitz'
          ? `<select id="hh-mqa-topic-select" class="hh-mqa-select topic-select" aria-label="Select Topic or Lesson Scope">
              ${buildTopicOptions()}
            </select>`
          : ''
      }
    </div>

    <div class="hh-mqa-mode-bar" role="tablist" aria-label="Quiz Practice Modes">
      <button type="button" role="tab" aria-selected="${mode === 'mcq'}" class="hh-mqa-mode-pill ${mode === 'mcq' ? 'is-active' : ''}" data-mqa-mode="mcq">
        <span>\u26A1 Quick MCQ</span>
      </button>
      ${
        hasClozeInUnit
          ? `<button type="button" role="tab" aria-selected="${mode === 'cloze'}" class="hh-mqa-mode-pill ${mode === 'cloze' ? 'is-active' : ''}" data-mqa-mode="cloze">
              <span>\uD83E\uDDE9 Gap Fill</span>
            </button>`
          : ''
      }
      <button type="button" role="tab" aria-selected="${mode === 'flashcards'}" class="hh-mqa-mode-pill ${mode === 'flashcards' ? 'is-active' : ''}" data-mqa-mode="flashcards">
        <span>\uD83C\uDCCF Flashcards</span>
      </button>
      <button type="button" role="tab" aria-selected="${mode === 'match'}" class="hh-mqa-mode-pill ${mode === 'match' ? 'is-active' : ''}" data-mqa-mode="match">
        <span>\uD83D\uDD17 Term Match</span>
      </button>
      ${
        mistakesCount > 0
          ? `<button type="button" role="tab" aria-selected="${mode === 'mistakes'}" class="hh-mqa-mode-pill is-mistakes ${mode === 'mistakes' ? 'is-active' : ''}" data-mqa-mode="mistakes">
              <span>\uD83C\uDFAF Mistakes (${mistakesCount})</span>
            </button>`
          : ''
      }
      ${
        mode === 'blitz'
          ? `<button type="button" role="tab" aria-selected="true" class="hh-mqa-mode-pill is-active" data-mqa-mode="blitz">
              <span>\uD83D\uDE8C 60s Blitz</span>
            </button>`
          : ''
      }
    </div>

    <div id="hh-mqa-stage"></div>
    <div id="hh-mqa-feedback-sheet" class="hh-mqa-feedback-sheet no-print" role="region" aria-live="polite"></div>
  `;
}

function getScopedLessonId() {
  const lessons = Array.isArray(arenaSession.unitData?.lessons)
    ? arenaSession.unitData.lessons
    : [];
  if (typeof arenaSession.lessonScope === 'number' && lessons[arenaSession.lessonScope]) {
    return lessons[arenaSession.lessonScope].id || `lesson_${arenaSession.lessonScope + 1}`;
  }
  return '';
}

function updateMistakesPillLive(rootEl) {
  if (!rootEl) return;
  const bar = rootEl.querySelector('.hh-mqa-mode-bar');
  if (!bar) return;
  const count = collectMistakesPool(arenaSession.unitId, arenaSession.unitData).length;
  const existingPill = bar.querySelector('[data-mqa-mode="mistakes"]');

  if (count === 0) {
    if (existingPill && arenaSession.mode !== 'mistakes') {
      existingPill.remove();
    } else if (existingPill) {
      existingPill.innerHTML = '<span>\uD83C\uDFAF Mistakes (0)</span>';
    }
  } else if (existingPill) {
    existingPill.innerHTML = `<span>\uD83C\uDFAF Mistakes (${count})</span>`;
  } else {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', 'false');
    btn.className = 'hh-mqa-mode-pill is-mistakes';
    btn.setAttribute('data-mqa-mode', 'mistakes');
    btn.innerHTML = `<span>\uD83C\uDFAF Mistakes (${count})</span>`;
    btn.addEventListener('click', () => switchArenaMode(rootEl, 'mistakes'));
    bar.appendChild(btn);
  }
}

/* ==========================================================================
   STAGE RENDERERS (MCQ / BLITZ / MISTAKES / CLOZE / FLASHCARDS / MATCH)
   ========================================================================== */

function renderMcqStage(rootEl) {
  const stageEl = rootEl.querySelector('#hh-mqa-stage');
  const sheetEl = rootEl.querySelector('#hh-mqa-feedback-sheet');
  if (!stageEl || !sheetEl) return;

  const mcq = arenaSession.mcq;
  if (!mcq || mcq.questions.length === 0) {
    sheetEl.className = 'hh-mqa-feedback-sheet no-print';
    sheetEl.innerHTML = '';

    if (arenaSession.mode === 'mistakes') {
      stageEl.innerHTML = `
        <div class="hh-mqa-empty-card">
          <div style="font-size:2.4rem;margin-bottom:8px;">\uD83C\uDF89</div>
          <h3 style="margin:0 0 6px 0;font-size:1.15rem;font-weight:800;">Zero Mistakes Pending! \uD83C\uDF89</h3>
          <p style="margin:0 0 16px 0;font-size:0.86rem;color:var(--mqa-text-sub);line-height:1.45;">
            You have cleared every missed question across your revision radar. Keep your streak rolling with a Quick MCQ round!
          </p>
          <button type="button" class="hh-mqa-btn-primary" id="hh-mqa-zero-mistakes-cta" style="width:100%;">
            <span>\u26A1 Launch Quick MCQ</span>
          </button>
        </div>
      `;
      stageEl.querySelector('#hh-mqa-zero-mistakes-cta')?.addEventListener('click', () => {
        switchArenaMode(rootEl, 'mcq');
      });
      return;
    }

    stageEl.innerHTML = `
      <div class="hh-mqa-empty-card">
        <p style="margin:0 0 12px 0;font-size:0.9rem;color:var(--mqa-text-sub);">
          No multiple-choice questions found for this selection. Try switching to Flashcards or Gap Fill!
        </p>
      </div>
    `;
    return;
  }

  // Round Finished -> Award XP & Render Receipt
  if (mcq.finished || mcq.index >= mcq.questions.length) {
    clearArenaTimers();
    sheetEl.className = 'hh-mqa-feedback-sheet no-print';
    sheetEl.innerHTML = '';

    if (!mcq.xpAwarded) {
      const total = mcq.questions.length;
      const base = mcq.isBlitz
        ? Math.max(15, mcq.correctCount * 4 + mcq.maxCombo * 2 + Math.floor(mcq.secondsLeft / 6))
        : Math.max(10, mcq.correctCount * 3 + (mcq.correctCount === total ? 10 : 0));
      mcq.xpAwarded = base;
      awardXp({
        amount: base,
        source: mcq.isBlitz ? 'blitz' : 'quiz',
        unitId: arenaSession.unitId,
        lessonId: getScopedLessonId(),
      });
    }

    const mistakesLeft = collectMistakesPool(arenaSession.unitId, arenaSession.unitData).length;
    const courseTitle =
      COURSE_LOOKUP.get(arenaSession.unitId)?.title ||
      stripPlainText(arenaSession.unitData?.title || 'History Recall');

    const receiptTitle = mcq.isBlitz
      ? '\uD83D\uDE8C Daily Bus Blitz Complete!'
      : mcq.isMistakes
        ? '\uD83C\uDFAF Mistakes Drill Complete!'
        : 'Quick Quiz Complete!';

    const receiptSubtitle = mcq.isBlitz
      ? `${mcq.secondsLeft > 0 ? `${60 - mcq.secondsLeft}s sprint` : '60s time up'} \u00B7 Max Combo x${Math.max(1, mcq.maxCombo)}`
      : courseTitle;

    const hasCloze = Array.isArray(arenaSession.unitData?.lessons) &&
      arenaSession.unitData.lessons.some(
        (l) => typeof l?.vocab_cloze_text === 'string' && l.vocab_cloze_text.includes('['),
      );

    stageEl.innerHTML = `
      ${renderShareableReceiptHTML({
        title: receiptTitle,
        subtitle: receiptSubtitle,
        score: mcq.correctCount,
        total: mcq.questions.length,
        xpEarned: mcq.xpAwarded,
        unitId: arenaSession.unitId,
        lessonIndex: typeof arenaSession.lessonScope === 'number' ? arenaSession.lessonScope : null,
        onReplayJS: 'window.__hhMqaReplayRound && window.__hhMqaReplayRound()',
        onMistakesJS: 'window.__hhMqaGoMistakes && window.__hhMqaGoMistakes()',
        mistakesCount: mistakesLeft,
      })}
      ${
        hasCloze
          ? `<div style="max-width:540px;margin:10px auto 0 auto;">
              <button type="button" class="hh-mqa-btn-secondary" id="hh-mqa-try-cloze-cta" style="width:100%;">
                \uD83E\uDDE9 Try Topic Gap Fill (+25 XP)
              </button>
            </div>`
          : ''
      }
    `;

    stageEl.querySelector('#hh-mqa-try-cloze-cta')?.addEventListener('click', () => {
      switchArenaMode(rootEl, 'cloze');
    });
    return;
  }

  // Active Question Render
  const qItem = mcq.questions[mcq.index];
  const total = mcq.questions.length;
  const gSummary = getGamificationSummary();
  const progressPct = mcq.isBlitz
    ? Math.max(0, Math.min(100, Math.round((mcq.secondsLeft / 60) * 100)))
    : Math.round(((mcq.index + (mcq.answered ? 1 : 0)) / total) * 100);

  const courseTag = mcq.isBlitz
    ? COURSE_LOOKUP.get(qItem.unitId)?.title?.split('(')[0]?.trim() || qItem.source
    : qItem.source;

  const letters = ['A', 'B', 'C', 'D'];

  stageEl.innerHTML = `
    <div class="hh-mqa-card">
      <div class="hh-mqa-hud">
        <span>${mcq.isBlitz ? `\uD83D\uDE8C Q ${mcq.index + 1}/${total}` : `Q ${mcq.index + 1}/${total}`}</span>
        <div class="hh-mqa-hud-badges">
          ${
            mcq.isBlitz
              ? `<span class="hh-mqa-badge combo" id="hh-mqa-blitz-timer">\u23F1 ${mcq.secondsLeft}s</span>
                 <span class="hh-mqa-badge combo">x${Math.max(1, mcq.combo)}</span>`
              : `<span class="hh-mqa-badge">\u2713 ${mcq.correctCount}</span>
                 <span class="hh-mqa-badge streak">\uD83D\uDD25 ${Math.max(0, gSummary.streak)}d</span>`
          }
        </div>
      </div>

      <div class="hh-mqa-progress-track">
        <div class="hh-mqa-progress-fill ${mcq.isBlitz ? 'blitz' : ''}" id="hh-mqa-prog-bar" style="width:${progressPct}%;"></div>
      </div>

      <div class="hh-mqa-topic-tag">${escapeHtml(courseTag)}</div>
      <h2 class="hh-mqa-stem">${formatCleanHtml(qItem.q)}</h2>

      <div class="hh-mqa-options">
        ${qItem.shuffledOptions
          .slice(0, 4)
          .map((opt, idx) => {
            let stateClass = '';
            if (mcq.answered) {
              if (opt === qItem.a) {
                stateClass = 'is-correct';
              } else if (opt === mcq.selectedOpt && !mcq.isCorrect) {
                stateClass = 'is-wrong';
              } else {
                stateClass = 'is-dimmed';
              }
            }
            return `
              <button
                type="button"
                class="hh-mqa-opt-btn ${stateClass}"
                data-opt-idx="${idx}"
                ${mcq.answered ? 'disabled' : ''}
              >
                <span class="hh-mqa-opt-letter">${letters[idx] || idx + 1}</span>
                <span class="hh-mqa-opt-text">${formatCleanHtml(opt)}</span>
              </button>
            `;
          })
          .join('')}
      </div>
    </div>
  `;

  // Sync Pinned Zero-Jump Bottom Feedback Sheet
  if (mcq.answered) {
    const isLast = mcq.index + 1 >= total;
    const toneClass = mcq.isCorrect ? 'tone-correct' : 'tone-wrong';
    const headline = mcq.isCorrect
      ? mcq.combo >= 2
        ? `\u2713 Spot On! (${mcq.combo} in a row \uD83D\uDD25)`
        : '\u2713 Spot On!'
      : `\u2717 Correct Answer: ${escapeHtml(qItem.a)}`;
    const explText =
      qItem.explanation ||
      (mcq.isCorrect
        ? `Locked in: ${qItem.a}.`
        : `Remember for next time: ${qItem.a}.`);

    sheetEl.className = `hh-mqa-feedback-sheet no-print is-open ${toneClass}`;
    sheetEl.innerHTML = `
      <div class="hh-mqa-feedback-inner">
        <div class="hh-mqa-feedback-head">${headline}</div>
        <p class="hh-mqa-feedback-expl">${formatCleanHtml(explText)}</p>
        <button type="button" class="hh-mqa-continue-btn" id="hh-mqa-next-btn">
          <span>${isLast ? 'See Results \u2192' : 'Continue \u2192'}</span>
        </button>
      </div>
    `;

    sheetEl.querySelector('#hh-mqa-next-btn')?.addEventListener('click', () => {
      if (activeAutoAdvanceTimeout) {
        clearTimeout(activeAutoAdvanceTimeout);
        activeAutoAdvanceTimeout = null;
      }
      mcq.index += 1;
      mcq.answered = false;
      mcq.selectedOpt = null;
      mcq.timerPaused = false;
      if (mcq.index >= mcq.questions.length) {
        mcq.finished = true;
      }
      renderMcqStage(rootEl);
    });
  } else {
    sheetEl.className = 'hh-mqa-feedback-sheet no-print';
    sheetEl.innerHTML = '';
  }

  // Bind Option Tap Handlers
  stageEl.querySelectorAll('.hh-mqa-opt-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (mcq.answered) return;
      const optIdx = parseInt(btn.getAttribute('data-opt-idx') || '0', 10);
      const chosen = qItem.shuffledOptions[optIdx];
      const isRight = chosen === qItem.a;

      mcq.answered = true;
      mcq.selectedOpt = chosen;
      mcq.isCorrect = isRight;
      mcq.timerPaused = true;

      if (isRight) {
        mcq.correctCount += 1;
        mcq.combo += 1;
        if (mcq.combo > mcq.maxCombo) mcq.maxCombo = mcq.combo;
      } else {
        mcq.combo = 0;
      }

      recordQuestionResult(
        qItem.id,
        isRight,
        {
          q: qItem.q,
          a: qItem.a,
          options: qItem.options,
          source: qItem.source,
          explanation: qItem.explanation,
        },
        qItem.unitId || arenaSession.unitId,
      );

      updateMistakesPillLive(rootEl);
      renderMcqStage(rootEl);

      // In 60s Blitz, auto-advance swiftly on correct answers if user hasn't tapped Continue
      if (mcq.isBlitz && isRight) {
        activeAutoAdvanceTimeout = setTimeout(() => {
          if (arenaSession.mode === 'blitz' && arenaSession.mcq === mcq && mcq.answered) {
            mcq.index += 1;
            mcq.answered = false;
            mcq.selectedOpt = null;
            mcq.timerPaused = false;
            if (mcq.index >= mcq.questions.length) mcq.finished = true;
            renderMcqStage(rootEl);
          }
        }, 680);
      }
    });
  });
}

function startBlitzCountdown(rootEl) {
  clearArenaTimers();
  activeTimerInterval = setInterval(() => {
    if (!document.body.contains(rootEl) || arenaSession.mode !== 'blitz') {
      clearArenaTimers();
      return;
    }
    const mcq = arenaSession.mcq;
    if (!mcq || mcq.finished) {
      clearArenaTimers();
      return;
    }
    if (mcq.timerPaused) return;

    mcq.secondsLeft = Math.max(0, mcq.secondsLeft - 1);
    const timerBadge = rootEl.querySelector('#hh-mqa-blitz-timer');
    const progBar = rootEl.querySelector('#hh-mqa-prog-bar');
    if (timerBadge) timerBadge.textContent = `\u23F1 ${mcq.secondsLeft}s`;
    if (progBar) progBar.style.width = `${Math.round((mcq.secondsLeft / 60) * 100)}%`;

    if (mcq.secondsLeft <= 0) {
      mcq.finished = true;
      clearArenaTimers();
      renderMcqStage(rootEl);
    }
  }, 1000);
}

/* ==========================================================================
   GAP FILL (CLOZE) STAGE
   ========================================================================== */

function renderClozeStage(rootEl) {
  const stageEl = rootEl.querySelector('#hh-mqa-stage');
  const sheetEl = rootEl.querySelector('#hh-mqa-feedback-sheet');
  if (!stageEl) return;
  if (sheetEl) {
    sheetEl.className = 'hh-mqa-feedback-sheet no-print';
    sheetEl.innerHTML = '';
  }

  const cloze = arenaSession.cloze;
  if (!cloze) {
    stageEl.innerHTML = `
      <div class="hh-mqa-empty-card">
        <p style="margin:0;font-size:0.9rem;color:var(--mqa-text-sub);">
          No Gap Fill summaries available for this course yet. Try Quick MCQ or Flashcards!
        </p>
      </div>
    `;
    return;
  }

  const posInValid = cloze.validIndices.indexOf(cloze.lessonIndex);
  const hasPrev = posInValid > 0;
  const hasNext = posInValid >= 0 && posInValid < cloze.validIndices.length - 1;

  const usedChipIndices = new Set(cloze.slots.filter((v) => v !== null));
  const filledCount = cloze.slots.filter((v) => v !== null).length;
  const totalSlots = cloze.answers.length;

  const passageHtml = cloze.segments
    .map((seg) => {
      if (seg.type === 'text') {
        return formatCleanHtml(seg.value);
      }
      const sIdx = seg.index;
      const chipIdx = cloze.slots[sIdx];
      const isFilled = chipIdx !== null && cloze.chips[chipIdx];
      const isLocked = cloze.locked[sIdx];
      const isWrong = cloze.wrongFlags[sIdx];
      const isActive = !cloze.completed && cloze.activeSlot === sIdx;

      const classes = [
        'hh-mqa-cloze-slot',
        isFilled ? 'is-filled' : '',
        isLocked ? 'is-locked' : '',
        isWrong ? 'is-wrong' : '',
        isActive ? 'is-active' : '',
      ]
        .filter(Boolean)
        .join(' ');

      const label = isFilled
        ? `${isLocked ? '\u2713 ' : ''}${escapeHtml(cloze.chips[chipIdx].word)}`
        : `[ ${sIdx + 1} ]`;

      return `<button type="button" class="${classes}" data-slot-idx="${sIdx}" ${isLocked ? 'disabled' : ''}>${label}</button>`;
    })
    .join('');

  stageEl.innerHTML = `
    <div class="hh-mqa-card">
      <div class="hh-mqa-cloze-nav">
        <button type="button" class="hh-mqa-cloze-step-btn" id="hh-mqa-cloze-prev" ${!hasPrev ? 'disabled' : ''}>
          \u25C0 Prev
        </button>
        <div class="hh-mqa-cloze-title-wrap">
          <div class="hh-mqa-cloze-eyebrow">
            Summary ${posInValid + 1} of ${cloze.validIndices.length}
            ${cloze.previouslyMastered || cloze.completed ? ' \u00B7 <span style="color:#10b981;">\u2713 Mastered</span>' : ''}
          </div>
          <div class="hh-mqa-cloze-title">${escapeHtml(cloze.lessonTitle)}</div>
        </div>
        <button type="button" class="hh-mqa-cloze-step-btn" id="hh-mqa-cloze-next" ${!hasNext ? 'disabled' : ''}>
          Next \u25B6
        </button>
      </div>

      <div class="hh-mqa-cloze-passage">${passageHtml}</div>

      <div class="hh-mqa-tray-box">
        <div class="hh-mqa-tray-header">
          <span>Tap a word tile (${filledCount}/${totalSlots} filled)</span>
          ${
            cloze.decoysCount > 0
              ? `<span class="hh-mqa-decoy-badge">+${cloze.decoysCount} Decoy Tiles</span>`
              : ''
          }
        </div>
        <div class="hh-mqa-tray-chips">
          ${cloze.chips
            .map((chip, cIdx) => {
              const isUsed = usedChipIndices.has(cIdx);
              return `
                <button
                  type="button"
                  class="hh-mqa-word-chip ${isUsed ? 'is-used' : ''}"
                  data-chip-idx="${cIdx}"
                  ${isUsed || cloze.completed ? 'disabled' : ''}
                >
                  ${escapeHtml(chip.word)}
                </button>
              `;
            })
            .join('')}
        </div>
      </div>

      ${
        cloze.statusMsg
          ? `<div style="margin-bottom:10px;padding:9px 12px;border-radius:10px;font-size:0.82rem;font-weight:800;background:${cloze.statusTone === 'success' ? 'var(--mqa-correct-bg)' : 'var(--mqa-wrong-bg)'};color:${cloze.statusTone === 'success' ? 'var(--mqa-correct-text)' : 'var(--mqa-wrong-text)'};border:1px solid ${cloze.statusTone === 'success' ? 'var(--mqa-correct-border)' : 'var(--mqa-wrong-border)'};">
              ${escapeHtml(cloze.statusMsg)}
            </div>`
          : ''
      }

      <div class="hh-mqa-cloze-actions">
        <button type="button" class="hh-mqa-btn-secondary" id="hh-mqa-cloze-reset">
          Reset
        </button>
        ${
          cloze.completed && hasNext
            ? `<button type="button" class="hh-mqa-btn-primary" id="hh-mqa-cloze-next-cta" style="background:#059669;">
                <span>Next Lesson Gap Fill \u2192</span>
              </button>`
            : `<button type="button" class="hh-mqa-btn-primary" id="hh-mqa-cloze-check" ${filledCount < totalSlots || cloze.completed ? 'disabled' : ''}>
                <span>${cloze.completed ? '\u2713 All Correct (+25 XP)' : 'Check Answers \u2713'}</span>
              </button>`
        }
      </div>
    </div>
  `;

  const jumpToClozeLesson = (newLessonIdx) => {
    arenaSession.lessonScope = newLessonIdx;
    const topicSelect = rootEl.querySelector('#hh-mqa-topic-select');
    if (topicSelect) topicSelect.value = String(newLessonIdx);
    arenaSession.cloze = buildClozeLessonState(arenaSession.unitData, newLessonIdx);
    renderClozeStage(rootEl);
  };

  stageEl.querySelector('#hh-mqa-cloze-prev')?.addEventListener('click', () => {
    if (hasPrev) jumpToClozeLesson(cloze.validIndices[posInValid - 1]);
  });

  stageEl.querySelector('#hh-mqa-cloze-next')?.addEventListener('click', () => {
    if (hasNext) jumpToClozeLesson(cloze.validIndices[posInValid + 1]);
  });

  stageEl.querySelector('#hh-mqa-cloze-next-cta')?.addEventListener('click', () => {
    if (hasNext) jumpToClozeLesson(cloze.validIndices[posInValid + 1]);
  });

  // Slot Tap: Tap filled unlocked slot to remove word, or tap empty slot to focus it
  stageEl.querySelectorAll('.hh-mqa-cloze-slot').forEach((slotBtn) => {
    slotBtn.addEventListener('click', () => {
      if (cloze.completed) return;
      const sIdx = parseInt(slotBtn.getAttribute('data-slot-idx') || '0', 10);
      if (cloze.locked[sIdx]) return;

      if (cloze.slots[sIdx] !== null) {
        cloze.slots[sIdx] = null;
        cloze.wrongFlags[sIdx] = false;
        cloze.statusMsg = '';
      }
      cloze.activeSlot = sIdx;
      renderClozeStage(rootEl);
    });
  });

  // Word Chip Tap: Place into activeSlot & advance activeSlot to next empty unlocked slot
  stageEl.querySelectorAll('.hh-mqa-word-chip').forEach((chipBtn) => {
    chipBtn.addEventListener('click', () => {
      if (cloze.completed) return;
      const cIdx = parseInt(chipBtn.getAttribute('data-chip-idx') || '0', 10);

      let targetSlot = cloze.activeSlot;
      if (targetSlot === null || targetSlot < 0 || cloze.locked[targetSlot]) {
        targetSlot = cloze.slots.findIndex((val, i) => val === null && !cloze.locked[i]);
      }
      if (targetSlot < 0) return;

      cloze.slots[targetSlot] = cIdx;
      cloze.wrongFlags[targetSlot] = false;
      cloze.statusMsg = '';

      let nextEmpty = -1;
      for (let offset = 1; offset <= totalSlots; offset++) {
        const cand = (targetSlot + offset) % totalSlots;
        if (cloze.slots[cand] === null && !cloze.locked[cand]) {
          nextEmpty = cand;
          break;
        }
      }
      cloze.activeSlot = nextEmpty >= 0 ? nextEmpty : targetSlot;
      renderClozeStage(rootEl);
    });
  });

  stageEl.querySelector('#hh-mqa-cloze-reset')?.addEventListener('click', () => {
    arenaSession.cloze = buildClozeLessonState(arenaSession.unitData, cloze.lessonIndex);
    renderClozeStage(rootEl);
  });

  stageEl.querySelector('#hh-mqa-cloze-check')?.addEventListener('click', () => {
    let rightCount = 0;
    let firstWrongIdx = -1;

    for (let i = 0; i < totalSlots; i++) {
      const chipIdx = cloze.slots[i];
      const chosenWord = chipIdx !== null && cloze.chips[chipIdx] ? cloze.chips[chipIdx].word : '';
      if (chosenWord.toLowerCase() === cloze.answers[i].toLowerCase()) {
        cloze.locked[i] = true;
        cloze.wrongFlags[i] = false;
        rightCount += 1;
      } else {
        cloze.wrongFlags[i] = true;
        if (firstWrongIdx === -1) firstWrongIdx = i;
      }
    }

    if (rightCount === totalSlots) {
      cloze.completed = true;
      cloze.previouslyMastered = true;
      cloze.statusTone = 'success';
      cloze.statusMsg = '100% Spot On! Every key term locked into place (+25 XP).';
      try {
        localStorage.setItem(`history_cloze_${cloze.lessonId}`, '1');
      } catch (e) {}
      if (!cloze.xpAwarded) {
        cloze.xpAwarded = 25;
        awardXp({
          amount: 25,
          source: 'cloze',
          unitId: arenaSession.unitId,
          lessonId: cloze.lessonId,
        });
      }
    } else {
      cloze.activeSlot = firstWrongIdx >= 0 ? firstWrongIdx : 0;
      cloze.statusTone = 'error';
      cloze.statusMsg = `${rightCount}/${totalSlots} correct — tap any red slot to swap it out!`;
    }

    renderClozeStage(rootEl);
  });
}

/* ==========================================================================
   FLASHCARDS STAGE (LOCKED 220px + PINNED THUMB ROW)
   ========================================================================== */

function renderFlashcardsStage(rootEl) {
  const stageEl = rootEl.querySelector('#hh-mqa-stage');
  const sheetEl = rootEl.querySelector('#hh-mqa-feedback-sheet');
  if (!stageEl) return;
  if (sheetEl) {
    sheetEl.className = 'hh-mqa-feedback-sheet no-print';
    sheetEl.innerHTML = '';
  }

  const fc = arenaSession.flashcards;
  if (!fc || fc.totalInitial === 0) {
    stageEl.innerHTML = `
      <div class="hh-mqa-empty-card">
        <p style="margin:0;font-size:0.9rem;color:var(--mqa-text-sub);">
          No flashcards available for this topic yet.
        </p>
      </div>
    `;
    return;
  }

  if (fc.finished || fc.queue.length === 0) {
    if (!fc.xpAwarded) {
      fc.xpAwarded = 20;
      awardXp({
        amount: 20,
        source: 'quiz',
        unitId: arenaSession.unitId,
        lessonId: getScopedLessonId(),
      });
    }
    stageEl.innerHTML = renderShareableReceiptHTML({
      title: '\uD83C\uDCCF Flashcard Deck Mastered!',
      subtitle: `${fc.totalInitial} cards secured`,
      score: fc.totalInitial,
      total: fc.totalInitial,
      xpEarned: fc.xpAwarded,
      unitId: arenaSession.unitId,
      lessonIndex: typeof arenaSession.lessonScope === 'number' ? arenaSession.lessonScope : null,
      onReplayJS: 'window.__hhMqaReplayRound && window.__hhMqaReplayRound()',
      onMistakesJS: 'window.__hhMqaGoMistakes && window.__hhMqaGoMistakes()',
      mistakesCount: collectMistakesPool(arenaSession.unitId, arenaSession.unitData).length,
    });
    return;
  }

  const currentCard = fc.queue[0];
  const progressPct = Math.round((fc.gotItCount / Math.max(1, fc.totalInitial)) * 100);
  const gSummary = getGamificationSummary();

  stageEl.innerHTML = `
    <div class="hh-mqa-card">
      <div class="hh-mqa-hud">
        <span>Secured ${fc.gotItCount}/${fc.totalInitial}</span>
        <div class="hh-mqa-hud-badges">
          <span class="hh-mqa-badge">${fc.queue.length} left</span>
          <span class="hh-mqa-badge streak">\uD83D\uDD25 ${Math.max(0, gSummary.streak)}d</span>
        </div>
      </div>

      <div class="hh-mqa-progress-track">
        <div class="hh-mqa-progress-fill" style="width:${progressPct}%;"></div>
      </div>

      <div class="hh-mqa-fc-stage ${fc.flipped ? 'is-flipped' : ''}" id="hh-mqa-fc-card" role="button" tabindex="0" aria-label="Tap flashcard to flip">
        <div class="hh-mqa-fc-top">
          <span class="hh-mqa-fc-side-lbl">${fc.flipped ? 'Definition / Answer' : 'Key Term / Prompt'}</span>
          <button type="button" class="hh-mqa-fc-listen-btn" id="hh-mqa-fc-listen">
            <span>\uD83D\uDD0A Listen</span>
          </button>
        </div>

        <div class="hh-mqa-fc-body">
          <p class="hh-mqa-fc-main-text">
            ${formatCleanHtml(fc.flipped ? currentCard.back : currentCard.front)}
          </p>
          ${
            !fc.flipped && currentCard.phonetic
              ? `<div class="hh-mqa-fc-phonetic">${escapeHtml(currentCard.phonetic)}</div>`
              : ''
          }
        </div>

        <div class="hh-mqa-fc-hint">
          ${fc.flipped ? 'Tap card to view term' : 'Tap card to flip'}
        </div>
      </div>

      <div class="hh-mqa-fc-actions">
        <button type="button" class="hh-mqa-fc-btn learning" id="hh-mqa-fc-again">
          <span>Still Learning</span>
        </button>
        <button type="button" class="hh-mqa-fc-btn gotit" id="hh-mqa-fc-gotit">
          <span>Got It \u2713</span>
        </button>
      </div>
    </div>
  `;

  stageEl.querySelector('#hh-mqa-fc-listen')?.addEventListener('click', (e) => {
    e.stopPropagation();
    speakUkText(fc.flipped ? currentCard.back : currentCard.front);
  });

  stageEl.querySelector('#hh-mqa-fc-card')?.addEventListener('click', () => {
    fc.flipped = !fc.flipped;
    renderFlashcardsStage(rootEl);
  });

  stageEl.querySelector('#hh-mqa-fc-again')?.addEventListener('click', () => {
    const card = fc.queue.shift();
    if (card) {
      const insertAt = Math.min(fc.queue.length, 3);
      fc.queue.splice(insertAt, 0, card);
    }
    fc.stillLearningCount += 1;
    fc.flipped = false;
    renderFlashcardsStage(rootEl);
  });

  stageEl.querySelector('#hh-mqa-fc-gotit')?.addEventListener('click', () => {
    fc.queue.shift();
    fc.gotItCount += 1;
    fc.flipped = false;
    if (fc.queue.length === 0) {
      fc.finished = true;
    }
    renderFlashcardsStage(rootEl);
  });
}

/* ==========================================================================
   TERM MATCH STAGE (5-PAIR SPEED MATCHING)
   ========================================================================== */

function startMatchTimer(rootEl) {
  clearArenaTimers();
  activeTimerInterval = setInterval(() => {
    if (!document.body.contains(rootEl) || arenaSession.mode !== 'match') {
      clearArenaTimers();
      return;
    }
    const m = arenaSession.match;
    if (!m || m.finished) {
      clearArenaTimers();
      return;
    }
    m.elapsedTenths = Math.floor((Date.now() - m.startedAt) / 100);
    const timerEl = rootEl.querySelector('#hh-mqa-match-timer');
    if (timerEl) {
      timerEl.textContent = `\u23F1 ${(m.elapsedTenths / 10).toFixed(1)}s`;
    }
  }, 100);
}

function renderTermMatchStage(rootEl) {
  const stageEl = rootEl.querySelector('#hh-mqa-stage');
  const sheetEl = rootEl.querySelector('#hh-mqa-feedback-sheet');
  if (!stageEl) return;
  if (sheetEl) {
    sheetEl.className = 'hh-mqa-feedback-sheet no-print';
    sheetEl.innerHTML = '';
  }

  const m = arenaSession.match;
  if (!m || m.pairs.length < 2) {
    stageEl.innerHTML = `
      <div class="hh-mqa-empty-card">
        <p style="margin:0;font-size:0.9rem;color:var(--mqa-text-sub);">
          Not enough key terms in this scope for Term Match. Switch to All Topics!
        </p>
      </div>
    `;
    return;
  }

  if (m.finished) {
    clearArenaTimers();
    const totalSecs = Math.max(1, (m.elapsedTenths / 10).toFixed(1));
    if (!m.xpAwarded) {
      m.xpAwarded = 20 + (m.mistakes === 0 ? 5 : 0);
      awardXp({
        amount: m.xpAwarded,
        source: 'quiz',
        unitId: arenaSession.unitId,
        lessonId: getScopedLessonId(),
      });
    }

    const totalAttempts = m.pairs.length + m.mistakes;
    stageEl.innerHTML = renderShareableReceiptHTML({
      title: '\uD83D\uDD17 Term Match Cleared!',
      subtitle: `Matched ${m.pairs.length} pairs in ${totalSecs}s \u00B7 ${m.mistakes === 0 ? 'Flawless Run!' : `${m.mistakes} slip${m.mistakes === 1 ? '' : 's'}`}`,
      score: m.pairs.length,
      total: m.mistakes === 0 ? m.pairs.length : totalAttempts,
      xpEarned: m.xpAwarded,
      unitId: arenaSession.unitId,
      lessonIndex: typeof arenaSession.lessonScope === 'number' ? arenaSession.lessonScope : null,
      onReplayJS: 'window.__hhMqaReplayRound && window.__hhMqaReplayRound()',
      onMistakesJS: 'window.__hhMqaGoMistakes && window.__hhMqaGoMistakes()',
      mistakesCount: collectMistakesPool(arenaSession.unitId, arenaSession.unitData).length,
    });
    return;
  }

  const matchedCount = m.matchedIds.size;
  const totalPairs = m.pairs.length;
  const progressPct = Math.round((matchedCount / totalPairs) * 100);

  stageEl.innerHTML = `
    <div class="hh-mqa-card">
      <div class="hh-mqa-hud">
        <span>Pairs ${matchedCount}/${totalPairs}</span>
        <div class="hh-mqa-hud-badges">
          <span class="hh-mqa-badge" id="hh-mqa-match-timer">\u23F1 ${(m.elapsedTenths / 10).toFixed(1)}s</span>
          <span class="hh-mqa-badge combo">\uD83D\uDD25 x${Math.max(1, m.combo)}</span>
        </div>
      </div>

      <div class="hh-mqa-progress-track">
        <div class="hh-mqa-progress-fill" style="width:${progressPct}%;"></div>
      </div>

      <div class="hh-mqa-match-grid">
        <div class="hh-mqa-match-col">
          ${m.leftTerms
            .map((t) => {
              const isMatched = m.matchedIds.has(t.pairId);
              const isSel = m.selectedTermId === t.pairId;
              const isMis = m.mismatchPair && m.mismatchPair.termId === t.pairId;
              return `
                <button
                  type="button"
                  class="hh-mqa-match-tile term-tile ${isMatched ? 'is-matched' : ''} ${isSel ? 'is-selected' : ''} ${isMis ? 'is-mismatch' : ''}"
                  data-term-id="${t.pairId}"
                  ${isMatched ? 'disabled' : ''}
                >
                  <span>${escapeHtml(t.text)}</span>
                  ${isMatched ? '<span>\u2713</span>' : ''}
                </button>
              `;
            })
            .join('')}
        </div>

        <div class="hh-mqa-match-col">
          ${m.rightDefs
            .map((d) => {
              const isMatched = m.matchedIds.has(d.pairId);
              const isSel = m.selectedDefId === d.pairId;
              const isMis = m.mismatchPair && m.mismatchPair.defId === d.pairId;
              return `
                <button
                  type="button"
                  class="hh-mqa-match-tile def-tile ${isMatched ? 'is-matched' : ''} ${isSel ? 'is-selected' : ''} ${isMis ? 'is-mismatch' : ''}"
                  data-def-id="${d.pairId}"
                  ${isMatched ? 'disabled' : ''}
                >
                  <span>${escapeHtml(d.text)}</span>
                </button>
              `;
            })
            .join('')}
        </div>
      </div>
    </div>
  `;

  const evaluateMatchSelection = () => {
    if (m.selectedTermId === null || m.selectedDefId === null) {
      renderTermMatchStage(rootEl);
      return;
    }

    const tId = m.selectedTermId;
    const dId = m.selectedDefId;

    if (tId === dId) {
      m.matchedIds.add(tId);
      m.selectedTermId = null;
      m.selectedDefId = null;
      m.combo += 1;
      if (m.matchedIds.size >= m.pairs.length) {
        m.finished = true;
      }
      renderTermMatchStage(rootEl);
    } else {
      m.combo = 0;
      m.mistakes += 1;
      m.mismatchPair = { termId: tId, defId: dId };
      m.selectedTermId = null;
      m.selectedDefId = null;
      renderTermMatchStage(rootEl);

      setTimeout(() => {
        if (arenaSession.match === m && m.mismatchPair) {
          m.mismatchPair = null;
          renderTermMatchStage(rootEl);
        }
      }, 380);
    }
  };

  stageEl.querySelectorAll('[data-term-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (m.mismatchPair) return;
      const id = parseInt(btn.getAttribute('data-term-id') || '0', 10);
      m.selectedTermId = m.selectedTermId === id ? null : id;
      evaluateMatchSelection();
    });
  });

  stageEl.querySelectorAll('[data-def-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (m.mismatchPair) return;
      const id = parseInt(btn.getAttribute('data-def-id') || '0', 10);
      m.selectedDefId = m.selectedDefId === id ? null : id;
      evaluateMatchSelection();
    });
  });
}

/* ==========================================================================
   MODE INITIALISATION & CONTROLLER WIRING
   ========================================================================== */

async function prepareAndRenderActiveMode(rootEl) {
  clearArenaTimers();
  const mode = arenaSession.mode;
  const unitId = arenaSession.unitId;
  const unitData = arenaSession.unitData;
  const scope = arenaSession.lessonScope;

  if (mode === 'blitz') {
    const pinned = getPinnedUnits();
    const blitzUnitIds = pinned.length > 0 ? pinned : [unitId];
    const combinedQuestions = [];

    const loadedUnits = await Promise.all(
      blitzUnitIds.map(async (uId) => {
        const data = await ensureUnitLoaded(uId);
        return { uId, data };
      }),
    );

    loadedUnits.forEach(({ uId, data }) => {
      if (data) {
        combinedQuestions.push(...extractMcqPool(uId, data, 'all'));
      }
    });

    arenaSession.mcq = buildMcqRoundState(combinedQuestions, { isBlitz: true });
    renderMcqStage(rootEl);
    startBlitzCountdown(rootEl);
    return;
  }

  if (mode === 'mistakes') {
    const mistakes = collectMistakesPool(unitId, unitData);
    arenaSession.mcq = buildMcqRoundState(mistakes, { isMistakes: true });
    renderMcqStage(rootEl);
    return;
  }

  if (mode === 'cloze') {
    const startIdx = typeof scope === 'number' ? scope : 0;
    arenaSession.cloze = buildClozeLessonState(unitData, startIdx);
    renderClozeStage(rootEl);
    return;
  }

  if (mode === 'flashcards') {
    arenaSession.flashcards = buildFlashcardsDeck(unitId, unitData, scope);
    renderFlashcardsStage(rootEl);
    return;
  }

  if (mode === 'match') {
    arenaSession.match = buildTermMatchState(unitData, scope);
    renderTermMatchStage(rootEl);
    startMatchTimer(rootEl);
    return;
  }

  // Default: 'mcq'
  const mcqPool = extractMcqPool(unitId, unitData, scope);
  arenaSession.mcq = buildMcqRoundState(mcqPool, { isBlitz: false, isMistakes: false });
  renderMcqStage(rootEl);
}

function switchArenaMode(rootEl, nextMode) {
  arenaSession.mode = nextMode;
  mountArenaShell(rootEl.parentElement || document.getElementById('main-content'));
}

function mountArenaShell(container) {
  if (!container) return;
  container.innerHTML = `<div class="hh-mqa-root" id="hh-mqa-root">${renderControlAndModeBarHTML(container)}</div>`;
  const rootEl = container.querySelector('#hh-mqa-root');
  if (!rootEl) return;

  // Course Selector
  rootEl.querySelector('#hh-mqa-course-select')?.addEventListener('change', (e) => {
    const newUnitId = e.target.value;
    if (newUnitId && newUnitId !== arenaSession.unitId) {
      const nextMode = arenaSession.mode === 'blitz' ? 'mcq' : arenaSession.mode;
      renderMobileQuizArena(newUnitId, { mode: nextMode });
    }
  });

  // Pin Button
  rootEl.querySelector('#hh-mqa-pin-btn')?.addEventListener('click', () => {
    const pinFn = (typeof window !== 'undefined' && window.hhPinSingleUnit) || pinSingleUnitQuick;
    pinFn(arenaSession.unitId);
    mountArenaShell(container);
  });

  // Topic / Lesson Scope Selector
  rootEl.querySelector('#hh-mqa-topic-select')?.addEventListener('change', (e) => {
    const val = e.target.value;
    arenaSession.lessonScope = val === 'all' ? 'all' : parseInt(val, 10);
    prepareAndRenderActiveMode(rootEl);
  });

  // Segmented Mode Pills
  rootEl.querySelectorAll('.hh-mqa-mode-pill[data-mqa-mode]').forEach((pill) => {
    pill.addEventListener('click', () => {
      const targetMode = pill.getAttribute('data-mqa-mode') || 'mcq';
      if (targetMode !== arenaSession.mode) {
        switchArenaMode(rootEl, targetMode);
      }
    });
  });

  // Receipt Action Hooks
  if (typeof window !== 'undefined') {
    window.__hhMqaReplayRound = () => {
      if (document.body.contains(rootEl)) {
        prepareAndRenderActiveMode(rootEl);
      }
    };
    window.__hhMqaGoMistakes = () => {
      if (document.body.contains(rootEl)) {
        switchArenaMode(rootEl, 'mistakes');
      }
    };
  }

  prepareAndRenderActiveMode(rootEl);
}

/**
 * Primary Entrypoint wired into navigation.js (`renderMobileQuizArena(unitId, options)`).
 */
export async function renderMobileQuizArena(unitId, options = {}) {
  clearArenaTimers();
  const token = ++activeRenderToken;

  const container =
    options.container ||
    (typeof document !== 'undefined' ? document.getElementById('main-content') : null);
  if (!container) return;

  const pinned = getPinnedUnits();
  const resolvedUnitId =
    unitId ||
    state.selectedUnitId ||
    (typeof window !== 'undefined' && window.currentUnitId) ||
    pinned[0] ||
    'edexcel_medicine';

  state.selectedUnitId = resolvedUnitId;
  if (typeof window !== 'undefined') {
    window.currentUnitId = resolvedUnitId;
  }
  if (typeof document !== 'undefined' && document.body) {
    document.body.setAttribute('data-active-view', 'interactive');
  }

  let unitData = getCachedUnitDataSync(resolvedUnitId);
  if (!unitData) {
    container.innerHTML = `
      <div class="hh-mqa-root">
        <div class="hh-mqa-skeleton" aria-busy="true" aria-label="Loading quiz">
          <div class="hh-mqa-skel-bar" style="width:65%;height:18px;"></div>
          <div class="hh-mqa-skel-bar" style="width:100%;height:38px;"></div>
          <div class="hh-mqa-skel-bar" style="width:92%;height:22px;margin-top:16px;"></div>
          <div class="hh-mqa-skel-bar" style="width:100%;height:52px;"></div>
          <div class="hh-mqa-skel-bar" style="width:100%;height:52px;"></div>
          <div class="hh-mqa-skel-bar" style="width:100%;height:52px;"></div>
          <div class="hh-mqa-skel-bar" style="width:100%;height:52px;margin-bottom:0;"></div>
        </div>
      </div>
    `;
    unitData = await ensureUnitLoaded(resolvedUnitId);
  }

  if (token !== activeRenderToken) return;

  if (unitData) {
    state.activeUnitData = unitData;
    if (typeof window !== 'undefined') {
      window.currentUnitData = unitData;
    }
  }

  const validModes = new Set(['mcq', 'cloze', 'flashcards', 'match', 'mistakes', 'blitz']);
  const requestedMode = String(options.mode || 'mcq').toLowerCase();
  const initialMode = validModes.has(requestedMode) ? requestedMode : 'mcq';

  const lessons = Array.isArray(unitData?.lessons) ? unitData.lessons : [];
  const initialScope =
    typeof options.lessonIndex === 'number' &&
    options.lessonIndex >= 0 &&
    options.lessonIndex < lessons.length
      ? options.lessonIndex
      : 'all';

  arenaSession.unitId = resolvedUnitId;
  arenaSession.unitData = unitData || { lessons: [] };
  arenaSession.mode = initialMode;
  arenaSession.lessonScope = initialScope;

  mountArenaShell(container);
}

if (typeof window !== 'undefined') {
  window.renderMobileQuizArena = renderMobileQuizArena;
}
