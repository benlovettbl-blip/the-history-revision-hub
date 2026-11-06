/**
 * GCSE 3-MODE "DO NOW" STARTER RETRIEVAL ENGINE
 *
 * Implements the 3-tier cognitive retrieval architecture:
 * 1. "Previous": 10 questions strictly from the immediate previous lesson (Lesson N-1).
 *    - Lesson 1 edge case: Foundational baseline prior knowledge.
 * 2. "Unit": 10 questions interleaved across all prior lessons in the current unit (Lessons 1 to N-1).
 * 3. "All": 10 synoptic questions sampled across user-selected completed GCSE units.
 *    - Inline 1-click unit toggle chips with zero hidden menus and instant local storage persistence.
 *
 * Progressive Disclosure Architecture:
 * - Stage 1 (Starter View): Clean, fast, zero-clutter 1-line question for classroom whiteboard.
 * - Stage 2 (Reveal View): Clean answer badge with subtle jump pill to lesson narrative & specific narrative block.
 * - Stage 3 (Deep Dive on Demand): Click on answer badge expands a 1-sentence historical explanation
 *   and specification link with direct 1-click navigation to the exact narrative block (`para-X`).
 *
 * Adheres strictly to:
 * - Zero Same-Lesson Recall (Do Now never tests the current lesson).
 * - Full Q&A integrity (zero answer truncation, full explanations/answers).
 * - 100% School Anonymity & Commercial Neutrality.
 */

export const GCSE_RETRIEVAL_UNITS = [
  { id: 'cme_new', label: 'Middle East', title: 'Conflict in the Middle East, 1945–1995', bg: '#f0f9ff', border: '#bae6fd', text: '#0369a1' },
  { id: 'usa', label: 'USA 1954–75', title: 'The USA, 1954–1975', bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
  { id: 'weimar_nazi_germany', label: 'Weimar Germany', title: 'Weimar & Nazi Germany, 1918–1939', bg: '#fef2f2', border: '#fecaca', text: '#b91c1c' },
  { id: 'edexcel_medicine', label: 'Medicine', title: 'Medicine in Britain, c1250–present', bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' },
  { id: 'eee', label: 'Elizabeth', title: 'Early Elizabethan England, 1558–1588', bg: '#fffbeb', border: '#fde68a', text: '#b45309' },
  { id: 'cold_war', label: 'Cold War', title: 'Superpower Relations & The Cold War', bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
];

const LOCAL_STORAGE_KEY_SELECTED_UNITS = 'history_hub_selected_gcse_units';
const LOCAL_STORAGE_KEY_ACTIVE_MODE = 'history_hub_gcse_donow_mode';

function cleanSearchTokens(str) {
  return String(str || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[*_#`"'\(\)\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

/**
 * Automatically computes the best matching narrative block (1-5) for a given retrieval question.
 */
export function findMatchingBlockIndex(questionObj, blocks) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return 1;

  const qText = cleanSearchTokens(questionObj.question || questionObj.q || '');
  let aRaw = questionObj.answer !== undefined ? questionObj.answer : questionObj.a;
  if (typeof aRaw === 'number' && Array.isArray(questionObj.options)) {
    aRaw = questionObj.options[aRaw] || '';
  }
  const aText = cleanSearchTokens(aRaw);
  const aTextNoArticle = aText.replace(/^(the|a|an)\s+/i, '');
  const expText = cleanSearchTokens(
    questionObj.explanation || questionObj.desc || questionObj.context || '',
  );

  const stopWords = new Set([
    'what', 'which', 'when', 'where', 'whom', 'whose', 'this', 'that', 'with', 'from', 'into',
    'during', 'after', 'before', 'their', 'there', 'about', 'under', 'were', 'have', 'been',
    'would', 'could', 'should', 'between', 'according', 'source', 'state', 'term', 'name',
    'take', 'place', 'following', 'called', 'became', 'first', 'second', 'years', 'over'
  ]);
  const words = (qText + ' ' + aText + ' ' + expText)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !stopWords.has(w));

  let bestIdx = 0;
  let bestScore = -1;

  blocks.forEach((b, bIdx) => {
    const rawContent = cleanSearchTokens(
      (b.title || '') + ' ' +
      (b.heading || '') + ' ' +
      (b.content || b.text || '') + ' ' +
      (Array.isArray(b.paragraphs) ? b.paragraphs.join(' ') : '') + ' ' +
      (b.caption || '')
    );

    let score = 0;
    // Exact answer string match gives supreme confidence
    if (aText.length >= 3 && rawContent.includes(aText)) {
      score += 100;
    } else if (aTextNoArticle.length >= 3 && rawContent.includes(aTextNoArticle)) {
      score += 90;
    }

    // Direct title / theme matches
    const bTitle = cleanSearchTokens(b.title || b.heading || '');
    if (aTextNoArticle.length >= 4 && bTitle.includes(aTextNoArticle)) {
      score += 40;
    }

    words.forEach((w) => {
      if (rawContent.includes(w)) score += 5;
    });

    if (score > bestScore) {
      bestScore = score;
      bestIdx = bIdx;
    }
  });

  return bestIdx + 1;
}

/**
 * Normalizes and extracts clean question, answer, and explanation text from various database schemas.
 */
export function extractCleanQA(
  q,
  fallbackUnitLabel = '',
  fallbackLessonNum = null,
  lessonTitle = '',
  unitId = '',
  stageNum = 1,
) {
  if (!q) return null;
  let question = (q.question || q.q || q.event || '').trim();
  let answer = '';

  if (typeof q.answer === 'string') {
    answer = q.answer;
  } else if (typeof q.a === 'string') {
    answer = q.a;
  } else if (typeof q.answer === 'number' && Array.isArray(q.options) && q.options[q.answer] !== undefined) {
    answer = String(q.options[q.answer]);
  } else if (typeof q.a === 'number' && Array.isArray(q.options) && q.options[q.a] !== undefined) {
    answer = String(q.options[q.a]);
  } else if (q.year) {
    answer = String(q.year);
  }

  question = String(question).trim();
  answer = String(answer).trim();

  if (!question || !answer) return null;

  // STRICT PEDAGOGICAL GATE 1: Exclude source-dependent questions (Sources A-E).
  // Do Now retrieval tasks are closed-book recall starters; pupils do NOT have visual/documentary sources visible.
  const sourcePattern = /\b(according to source|look at source|in source [a-e]|from source [a-e]|source [a-e] depicts|shown in source|in this source|based on source|what does source [a-e]|which source|\bsource [a-e]\b)/i;
  if (sourcePattern.test(question)) {
    return null;
  }

  // Strip obsolete retrieval metadata phrases
  question = question
    .replace(/\s*\((Last Lesson|Last Week|Prior Topic|Prior Unit|Earlier in Unit|Last Term|Last Year|Synoptic|Immediate Previous Lesson|Prior Learning|Foundational Context)\)\s*$/i, '')
    .replace(/^PAST TOPIC:\s*/i, '')
    .replace(/^(Question|Task|Q)\s*\d+[:.]\s*/i, '')
    .trim();

  // Strip leading numbering or letter markers from answers
  answer = answer.replace(/^[A-D]\)\s*/i, '').trim();

  const finalUnitId = q.unitId || unitId || '';
  const finalLessonNum = q.lessonNum || fallbackLessonNum || 1;
  const finalLessonTitle = q.lessonTitle || lessonTitle || '';
  const finalUnitLabel = q.unitLabel || fallbackUnitLabel || '';
  const finalStageNum = q.stageNum || stageNum || 1;

  // STRICT PEDAGOGICAL GATE 2: Extract authentic historical explanation without tautological echo fallbacks.
  let rawExplanation = (q.explanation || q.desc || q.context || '').trim();
  if (rawExplanation) {
    rawExplanation = rawExplanation
      .replace(/^(?:Hinge Question|Discussion Prompt|Discussion Question|Question)[:.]?\s*/i, '')
      .replace(/^Context:\s*/i, '')
      .trim();
  }

  let hasSubstantiveExplanation = false;
  let explanation = '';

  if (rawExplanation) {
    const cleanAnswer = answer.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanExp = rawExplanation.toLowerCase().replace(/[^a-z0-9]/g, '');
    // An explanation is tautological if it simply repeats or echoes the answer without adding substantive context
    const isTautological = cleanExp === cleanAnswer ||
      (cleanExp.startsWith(cleanAnswer) && (cleanExp.length - cleanAnswer.length < 25)) ||
      (cleanAnswer.startsWith(cleanExp) && (cleanAnswer.length - cleanExp.length < 25));

    if (!isTautological && rawExplanation.length >= 20) {
      hasSubstantiveExplanation = true;
      explanation = rawExplanation;
    }
  }

  return {
    question,
    answer,
    explanation,
    hasSubstantiveExplanation,
    unitLabel: finalUnitLabel,
    lessonNum: finalLessonNum,
    lessonTitle: finalLessonTitle,
    unitId: finalUnitId,
    stageNum: finalStageNum,
  };
}

/**
 * Deterministic pseudo-random or timestamp-seeded shuffle to ensure fresh variety.
 */
export function shuffleArray(arr, seed = null) {
  const copy = [...arr];
  if (seed !== null && typeof seed === 'number') {
    // Linear congruential generator for reproducible shuffle
    let s = seed;
    for (let i = copy.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const rnd = s / 233280;
      const j = Math.floor(rnd * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Gets currently selected GCSE units from localStorage or returns sensible defaults.
 */
export function getSelectedGcseUnits(activeUnitId = '') {
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_SELECTED_UNITS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (activeUnitId && !parsed.includes(activeUnitId)) {
            parsed.push(activeUnitId);
          }
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Could not read selected GCSE units:', e);
  }
  // Default: active unit plus first 2 canonical GCSE units
  const defaults = activeUnitId ? [activeUnitId] : ['cme_new'];
  if (!defaults.includes('cme_new')) defaults.push('cme_new');
  if (!defaults.includes('usa')) defaults.push('usa');
  return defaults;
}

/**
 * Saves selected GCSE units to localStorage.
 */
export function saveSelectedGcseUnits(units) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY_SELECTED_UNITS, JSON.stringify([...new Set(units)]));
    }
  } catch (e) {
    console.warn('Could not save selected GCSE units:', e);
  }
}

/**
 * Gets preferred active mode ('previous', 'unit', 'all') from localStorage.
 */
export function getSavedDoNowMode() {
  try {
    if (typeof localStorage !== 'undefined') {
      const mode = localStorage.getItem(LOCAL_STORAGE_KEY_ACTIVE_MODE);
      if (mode && ['previous', 'unit', 'all'].includes(mode)) return mode;
    }
  } catch (e) {}
  return 'previous';
}

/**
 * Saves preferred active mode to localStorage.
 */
export function saveDoNowMode(mode) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE_MODE, mode);
    }
  } catch (e) {}
}

/**
 * Mode 1: "Previous" (10 questions strictly from the immediate previous lesson).
 */
export function getPreviousLessonQuestions(activeUnit, currentLesson, seed = null) {
  const lessons = activeUnit?.lessons || [];
  const currentIndex = lessons.findIndex(
    (l) => (l.id && l.id === currentLesson.id) || l.title === currentLesson.title,
  );

  // Lesson 1 edge case: No prior lesson in unit. Fallback to foundational baseline items.
  if (currentIndex <= 0) {
    const baseItems =
      currentLesson.do_now?.items ||
      currentLesson.do_now?.questions ||
      currentLesson.do_now?.tasks ||
      (Array.isArray(currentLesson.do_now) ? currentLesson.do_now : []);
    const items = baseItems
      .map((it) => {
        const stage = findMatchingBlockIndex(it, currentLesson.narrative_blocks);
        return extractCleanQA(it, 'Foundational', 1, currentLesson.title, activeUnit?.id, stage);
      })
      .filter(Boolean);
    return {
      mode: 'previous',
      subtitle: 'Lesson 1: Foundational Baseline • Core Prior Knowledge',
      questions: items.slice(0, 10),
      isLessonOne: true,
    };
  }

  const prevLesson = lessons[currentIndex - 1];
  const pool = [];

  // 1. Pull from prevLesson.quiz (20 questions testing prevLesson)
  if (Array.isArray(prevLesson.quiz)) {
    prevLesson.quiz.forEach((q) => {
      const stage = findMatchingBlockIndex(q, prevLesson.narrative_blocks);
      const qa = extractCleanQA(q, 'Last Lesson', currentIndex, prevLesson.title, activeUnit?.id, stage);
      if (qa) {
        qa.unitId = activeUnit?.id || '';
        pool.push(qa);
      }
    });
  }

  // 2. Supplement from prevLesson.do_now if quiz had fewer than 10
  if (pool.length < 10) {
    const baseItems =
      prevLesson.do_now?.items ||
      prevLesson.do_now?.questions ||
      prevLesson.do_now?.tasks ||
      (Array.isArray(prevLesson.do_now) ? prevLesson.do_now : []);
    baseItems.forEach((it) => {
      const stage = findMatchingBlockIndex(it, prevLesson.narrative_blocks);
      const qa = extractCleanQA(it, 'Last Lesson', currentIndex, prevLesson.title, activeUnit?.id, stage);
      if (qa && !pool.some((p) => p.question === qa.question)) {
        qa.unitId = activeUnit?.id || '';
        pool.push(qa);
      }
    });
  }

  // 3. Supplement from flashcards if needed
  if (pool.length < 10 && Array.isArray(prevLesson.flashcards)) {
    prevLesson.flashcards.forEach((fc) => {
      const stage = findMatchingBlockIndex(fc, prevLesson.narrative_blocks);
      const qa = extractCleanQA(
        { question: fc.front || fc.term || fc.q, answer: fc.back || fc.definition || fc.a, explanation: fc.definition || fc.back },
        'Last Lesson',
        currentIndex,
        prevLesson.title,
        activeUnit?.id,
        stage,
      );
      if (qa && !pool.some((p) => p.question === qa.question)) {
        qa.unitId = activeUnit?.id || '';
        pool.push(qa);
      }
    });
  }

  const shuffled = shuffleArray(pool, seed).slice(0, 10);
  const prevTitle = (prevLesson.title || `Lesson ${currentIndex}`).split(':')[0].trim();

  return {
    mode: 'previous',
    subtitle: `Immediate Recall • 10 Questions from Lesson ${currentIndex}: ${prevTitle}`,
    questions: shuffled,
    isLessonOne: false,
  };
}

/**
 * Mode 2: "Unit" (10 questions interleaved across all prior lessons 1 to N-1).
 */
export function getUnitInterleavedQuestions(activeUnit, currentLesson, seed = null) {
  const lessons = activeUnit?.lessons || [];
  const currentIndex = lessons.findIndex(
    (l) => (l.id && l.id === currentLesson.id) || l.title === currentLesson.title,
  );

  if (currentIndex <= 0) {
    return getPreviousLessonQuestions(activeUnit, currentLesson, seed);
  }

  const priorLessons = lessons.slice(0, currentIndex);
  const qPerLesson = Math.max(1, Math.ceil(10 / priorLessons.length));
  const pool = [];

  priorLessons.forEach((pl, pIdx) => {
    const lPool = [];
    if (Array.isArray(pl.quiz)) {
      pl.quiz.forEach((q) => {
        const stage = findMatchingBlockIndex(q, pl.narrative_blocks);
        const qa = extractCleanQA(q, `Lesson ${pIdx + 1}`, pIdx + 1, pl.title, activeUnit?.id, stage);
        if (qa) {
          qa.unitId = activeUnit?.id || '';
          lPool.push(qa);
        }
      });
    }
    if (lPool.length === 0 && pl.do_now) {
      const items = pl.do_now.items || pl.do_now.questions || [];
      items.forEach((it) => {
        const stage = findMatchingBlockIndex(it, pl.narrative_blocks);
        const qa = extractCleanQA(it, `Lesson ${pIdx + 1}`, pIdx + 1, pl.title, activeUnit?.id, stage);
        if (qa) {
          qa.unitId = activeUnit?.id || '';
          lPool.push(qa);
        }
      });
    }
    const sampled = shuffleArray(lPool, seed).slice(0, qPerLesson);
    pool.push(...sampled);
  });

  const finalQuestions = shuffleArray(pool, seed).slice(0, 10);

  return {
    mode: 'unit',
    subtitle: `Unit Interleaving • 10 Questions across Lessons 1–${currentIndex}`,
    questions: finalQuestions,
    isLessonOne: false,
  };
}

/**
 * Mode 3: "All" (10 synoptic questions sampled across user-selected GCSE units).
 */
export function getSynopticGcseQuestions(activeUnit, currentLesson, db, selectedUnitIds, seed = null) {
  const allGcseMeta = GCSE_RETRIEVAL_UNITS;
  const currentUnitId = activeUnit?.id || (typeof window !== 'undefined' ? window.currentUnitId : '');

  let selected = Array.isArray(selectedUnitIds) && selectedUnitIds.length > 0
    ? [...selectedUnitIds]
    : [currentUnitId || 'cme_new'];

  // Resolve unit objects
  const validUnits = selected
    .map((uid) => {
      const uObj = db?.[uid]?.data || db?.[uid];
      const meta = allGcseMeta.find((m) => m.id === uid) || { label: uid, id: uid, bg: '#f1f5f9', border: '#cbd5e1', text: '#334155' };
      return uObj ? { unitData: uObj, meta } : null;
    })
    .filter(Boolean);

  if (validUnits.length === 0) {
    return getUnitInterleavedQuestions(activeUnit, currentLesson, seed);
  }

  // Allocate target question counts across selected units
  let collected = [];
  const qPerUnit = Math.max(1, Math.ceil(10 / validUnits.length));

  validUnits.forEach(({ unitData, meta }) => {
    const isCurrent = meta.id === currentUnitId;
    const lessons = unitData.lessons || [];
    const currIdx = lessons.findIndex(
      (l) => (l.id && l.id === currentLesson.id) || l.title === currentLesson.title,
    );
    // For current unit, only draw up to current lesson to respect Zero Same-Lesson Recall!
    const availableLessons = isCurrent && currIdx > 0 ? lessons.slice(0, currIdx) : lessons;

    const unitPool = [];
    availableLessons.forEach((l, lIdx) => {
      if (Array.isArray(l.quiz)) {
        l.quiz.forEach((q) => {
          const stage = findMatchingBlockIndex(q, l.narrative_blocks);
          const qa = extractCleanQA(q, meta.label, lIdx + 1, l.title, meta.id, stage);
          if (qa) {
            qa.unitId = meta.id;
            qa.unitMeta = meta;
            unitPool.push(qa);
          }
        });
      }
    });

    if (unitPool.length === 0 && availableLessons.length > 0) {
      availableLessons.forEach((l, lIdx) => {
        const items = l.do_now?.items || l.do_now?.questions || [];
        items.forEach((it) => {
          const stage = findMatchingBlockIndex(it, l.narrative_blocks);
          const qa = extractCleanQA(it, meta.label, lIdx + 1, l.title, meta.id, stage);
          if (qa) {
            qa.unitId = meta.id;
            qa.unitMeta = meta;
            unitPool.push(qa);
          }
        });
      });
    }

    const sampled = shuffleArray(unitPool, seed).slice(0, qPerUnit);
    collected.push(...sampled);
  });

  const finalQuestions = shuffleArray(collected, seed).slice(0, 10);
  const unitLabels = validUnits.map((v) => v.meta.label).join(' &bull; ');

  return {
    mode: 'all',
    subtitle: `Synoptic GCSE Mix • 10 Questions across ${unitLabels}`,
    questions: finalQuestions,
    isLessonOne: false,
  };
}

/**
 * Renders the rows container HTML for a given list of questions and mode.
 */
export function renderDoNowRowsHTML(questions, mode = 'previous', unitId = '') {
  if (!questions || questions.length === 0) {
    return `
      <div style="padding: 20px; text-align: center; color: #64748b; font-size: 0.9rem;">
        <i class="fa-solid fa-circle-info" style="color: #0284c7; margin-right: 6px;"></i>
        No retrieval questions available for this mode.
      </div>
    `;
  }

  let html = '';
  questions.forEach((item, index) => {
    let qText = item.question;
    let aText = item.answer;
    let expText = item.explanation || '';

    if (unitId) {
      qText = qText.replace(/src=['"]assets\//g, `src="/units/${unitId}/assets/`);
      aText = aText.replace(/src=['"]assets\//g, `src="/units/${unitId}/assets/`);
      expText = expText.replace(/src=['"]assets\//g, `src="/units/${unitId}/assets/`);
    }

    const cardId = `donow-card-${mode}-${index}`;
    const expId = `donow-exp-${mode}-${index}`;
    const badgeId = `donow-badge-${mode}-${index}`;
    const caretId = `donow-caret-${mode}-${index}`;
    const isLast = index === questions.length - 1;

    // Origin badge for 'all' or 'unit'
    let originBadge = '';
    if (mode === 'all' && item.unitMeta) {
      originBadge = `
        <span class="donow-source-badge" style="background: ${item.unitMeta.bg}; border: 1px solid ${item.unitMeta.border}; color: ${item.unitMeta.text};">
          ${item.unitMeta.label}
        </span>
      `;
    } else if (mode === 'unit' && item.lessonNum) {
      originBadge = `
        <span class="donow-source-badge" style="background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569;">
          Lesson ${item.lessonNum}
        </span>
      `;
    }

    // Target unit, lesson, and narrative block (stage)
    const targetUnitId = item.unitId || unitId;
    const lessonNum = item.lessonNum || 1;
    const stageNum = item.stageNum || 1;
    const jumpUrl = `?view=lessons&unit=${targetUnitId}&lesson=${lessonNum}&stage=${stageNum}`;

    let jumpLabel = `Lesson ${lessonNum} • Stage ${stageNum}`;
    if (mode === 'all' && item.unitMeta) {
      jumpLabel = `${item.unitMeta.label} • L${lessonNum} (Stage ${stageNum})`;
    }

    const cleanLessonTitle = (item.lessonTitle || '')
      .replace(/^(?:KT\s*\d+\.\d+:?|Lesson\s*\d+:?)\s*/i, '')
      .trim();

    html += `
      <div class="donow-sentence-row do-now-card" id="do-now-card-${index}" data-action="toggle-element" data-target-id="${cardId}" title="Tap row to reveal answer • Tap answer badge for explanation" style="display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; background: #ffffff; border: none; ${!isLast ? 'border-bottom: 1px solid #f1f5f9;' : ''} border-radius: 0; margin: 0; padding: 8px 14px; min-height: 40px; box-sizing: border-box; cursor: pointer; box-shadow: none;">
        <div style="display: flex; align-items: flex-start; gap: 10px; flex: 1 1 auto; min-width: 0;">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 4px; background: #f0f9ff; color: #0284c7; font-size: 0.74rem; font-weight: 800; flex-shrink: 0; border: 1px solid #bae6fd; line-height: 1; margin-top: 1px;">${index + 1}</span>
          <div style="display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 0;">
            <div style="display: flex; align-items: baseline; flex-wrap: wrap; gap: 8px;">
              ${originBadge}
              <span class="donow-q-text" style="font-size: 0.88rem; line-height: 1.38; color: #1e293b; font-weight: 600;">${qText}</span>
            </div>

            <!-- Revealed Answer & Explanation Block -->
            <div class="answer donow-inline-answer" id="${cardId}" style="display: none; margin: 4px 0 0 0; padding: 0; background: transparent; width: 100%;">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                ${item.hasSubstantiveExplanation ? `
                  <span class="donow-answer-badge has-explanation" id="${badgeId}" 
                        onclick="event.stopPropagation(); window.toggleDoNowExplanation('${expId}', '${badgeId}', '${caretId}');" 
                        title="Click to view/hide historical explanation">
                    <i class="fa-solid fa-circle-check" style="color: #2563eb; font-size: 0.75rem; flex-shrink: 0;"></i>
                    <span>${aText}</span>
                    <i class="fa-solid fa-chevron-down donow-exp-caret" id="${caretId}" style="font-size: 0.65rem; color: #3b82f6; margin-left: 2px;"></i>
                  </span>
                ` : `
                  <span class="donow-answer-badge" id="${badgeId}">
                    <i class="fa-solid fa-circle-check" style="color: #2563eb; font-size: 0.75rem; flex-shrink: 0;"></i>
                    <span>${aText}</span>
                  </span>
                `}

                <a href="${jumpUrl}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="btn-donow-jump-pill" 
                   onclick="event.stopPropagation();" 
                   title="Open Stage ${stageNum} narrative in Lesson ${lessonNum} in a new tab">
                  <i class="fa-solid fa-book-open" style="font-size: 0.68rem; color: #0284c7;"></i>
                  <span>${jumpLabel}</span>
                  <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.6rem; opacity: 0.75;"></i>
                </a>
              </div>

              ${item.hasSubstantiveExplanation ? `
                <!-- Collapsible Micro-Explanation Drawer -->
                <div class="donow-explanation-drawer" id="${expId}" style="display: none;">
                  <div class="donow-exp-header">
                    <i class="fa-solid fa-lightbulb" style="color: #0284c7; font-size: 0.8rem; margin-top: 2px; flex-shrink: 0;"></i>
                    <div style="flex: 1; min-width: 0;">
                      <div class="donow-exp-text">${expText}</div>
                      <div class="donow-exp-meta">
                        <span class="donow-exp-spec-tag">Specification Context:</span>
                        <span class="donow-exp-unit-lesson">${item.unitLabel} &bull; Lesson ${lessonNum} (Stage ${stageNum})${cleanLessonTitle ? `: ${cleanLessonTitle}` : ''}</span>
                        <a href="${jumpUrl}" 
                           target="_blank"
                           rel="noopener noreferrer"
                           class="donow-exp-inline-link"
                           onclick="event.stopPropagation();"
                           title="Open Stage ${stageNum} narrative in a new tab">
                           Read Stage ${stageNum} Narrative &rarr;
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
        <div class="donow-right-status-box" style="display: flex; align-items: center; justify-content: flex-end; flex-shrink: 0; margin-left: 8px;">
          <span class="donow-reveal-pill" style="font-size: 0.72rem; font-weight: 700; color: #0284c7; background: #f0f9ff; border: 1px solid #bae6fd; padding: 2px 8px; border-radius: 12px; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;">
            <i class="fa-solid fa-eye" style="font-size: 0.65rem;"></i> Reveal
          </span>
          <span class="donow-revealed-pill" style="display: none; font-size: 0.72rem; font-weight: 700; color: #0284c7; background: #eff6ff; border: 1px solid #93c5fd; padding: 2px 8px; border-radius: 12px; align-items: center; gap: 4px; white-space: nowrap;">
            <i class="fa-solid fa-check" style="font-size: 0.7rem;"></i> Answered
          </span>
        </div>
      </div>
    `;
  });
  return html;
}

/**
 * Renders the unit filter chips bar when "All" mode is active.
 */
export function renderGcseUnitChipsHTML(selectedUnitIds = []) {
  const allUnits = GCSE_RETRIEVAL_UNITS;
  const chips = allUnits.map((u) => {
    const isSelected = selectedUnitIds.includes(u.id);
    return `
      <button type="button"
        class="btn-donow-unit-chip ${isSelected ? 'selected' : ''}"
        data-unit-id="${u.id}"
        onclick="event.stopPropagation(); window.toggleGcseDoNowUnit('${u.id}');"
        title="Toggle ${u.title} in synoptic mix">
        <i class="fa-solid ${isSelected ? 'fa-check' : 'fa-plus'}" style="font-size: 0.65rem;"></i>
        <span>${u.label}</span>
      </button>
    `;
  }).join('');

  return `
    <div class="donow-unit-chips-bar">
      <span style="font-size: 0.7rem; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.4px; display: inline-flex; align-items: center; gap: 4px;">
        <i class="fa-solid fa-filter" style="font-size: 0.65rem;"></i> Active Units:
      </span>
      <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 5px;">
        ${chips}
      </div>
    </div>
  `;
}

/**
 * Renders the complete GCSE 3-mode Do Now panel HTML.
 */
export function renderGcseDoNowPanelHTML({
  activeUnit,
  lesson,
  unitId = '',
  db = null,
  headerHtml = '',
}) {
  const currentUnitId = unitId || activeUnit?.id || (typeof window !== 'undefined' ? window.currentUnitId : '');
  const activeMode = getSavedDoNowMode();
  const selectedUnits = getSelectedGcseUnits(currentUnitId);

  // Compute initial questions for active mode
  let result;
  if (activeMode === 'previous') {
    result = getPreviousLessonQuestions(activeUnit, lesson);
  } else if (activeMode === 'unit') {
    result = getUnitInterleavedQuestions(activeUnit, lesson);
  } else {
    result = getSynopticGcseQuestions(activeUnit, lesson, db || (typeof window !== 'undefined' ? window.db : {}), selectedUnits);
  }

  const rowsHtml = renderDoNowRowsHTML(result.questions, activeMode, currentUnitId);
  const chipsHtml = renderGcseUnitChipsHTML(selectedUnits);

  return `
    <div class="donow-panel-content gcse-3mode-donow" data-unit-id="${currentUnitId}" data-lesson-id="${lesson.id || ''}">
      ${headerHtml}

      <!-- 3-Mode Scope Control Deck -->
      <div class="donow-mode-deck" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin: 8px 0 10px 0; padding: 6px 12px; background: #f8fafc; border: 1.2px solid #e2e8f0; border-radius: 10px;">
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span style="font-size: 0.72rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.6px; display: inline-flex; align-items: center; gap: 5px; user-select: none;">
            <i class="fa-solid fa-sliders" style="color: #0284c7;"></i> Scope:
          </span>
          <div class="donow-mode-btn-group" style="display: inline-flex; align-items: center; background: #e2e8f0; padding: 3px; border-radius: 999px; gap: 2px; border: 1px solid #cbd5e1; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);">
            <button type="button"
              class="btn-donow-mode ${activeMode === 'previous' ? 'active' : ''}"
              data-donow-mode="previous"
              onclick="event.stopPropagation(); window.setGcseDoNowMode('previous');"
              title="10 Questions strictly from the immediate previous lesson"
              style="padding: 4px 14px; font-size: 0.76rem; font-weight: 700; border-radius: 999px; border: none; outline: none; appearance: none; -webkit-appearance: none; background: ${activeMode === 'previous' ? '#0284c7' : 'transparent'}; color: ${activeMode === 'previous' ? '#ffffff' : '#475569'}; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: ${activeMode === 'previous' ? '0 1px 3px rgba(2, 132, 199, 0.4)' : 'none'}; transition: all 0.18s ease; user-select: none;">
              <i class="fa-solid fa-arrow-rotate-left"></i> Previous
            </button>
            <button type="button"
              class="btn-donow-mode ${activeMode === 'unit' ? 'active' : ''}"
              data-donow-mode="unit"
              onclick="event.stopPropagation(); window.setGcseDoNowMode('unit');"
              title="10 Questions interleaved across this unit up to now"
              style="padding: 4px 14px; font-size: 0.76rem; font-weight: 700; border-radius: 999px; border: none; outline: none; appearance: none; -webkit-appearance: none; background: ${activeMode === 'unit' ? '#0284c7' : 'transparent'}; color: ${activeMode === 'unit' ? '#ffffff' : '#475569'}; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: ${activeMode === 'unit' ? '0 1px 3px rgba(2, 132, 199, 0.4)' : 'none'}; transition: all 0.18s ease; user-select: none;">
              <i class="fa-solid fa-layer-group"></i> Unit
            </button>
            <button type="button"
              class="btn-donow-mode ${activeMode === 'all' ? 'active' : ''}"
              data-donow-mode="all"
              onclick="event.stopPropagation(); window.setGcseDoNowMode('all');"
              title="10 Questions synoptically sampled across all selected GCSE units"
              style="padding: 4px 14px; font-size: 0.76rem; font-weight: 700; border-radius: 999px; border: none; outline: none; appearance: none; -webkit-appearance: none; background: ${activeMode === 'all' ? '#0284c7' : 'transparent'}; color: ${activeMode === 'all' ? '#ffffff' : '#475569'}; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: ${activeMode === 'all' ? '0 1px 3px rgba(2, 132, 199, 0.4)' : 'none'}; transition: all 0.18s ease; user-select: none;">
              <i class="fa-solid fa-globe"></i> All
            </button>
          </div>
          <button type="button"
            class="btn-donow-shuffle"
            onclick="event.stopPropagation(); window.refreshCurrentGcseDoNow();"
            title="Roll a fresh randomized set of 10 questions for this scope"
            style="padding: 4px 12px; font-size: 0.76rem; font-weight: 700; border-radius: 999px; border: 1px solid #cbd5e1; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); color: #0369a1; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: all 0.15s ease;">
            <i class="fa-solid fa-arrows-rotate" style="color: #0284c7;"></i> Shuffle
          </button>
        </div>

        <div id="donow-mode-subtitle" style="font-size: 0.75rem; font-weight: 700; color: #0369a1; background: #e0f2fe; border: 1px solid #bae6fd; padding: 3px 12px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-bullseye" style="color: #0284c7; font-size: 0.7rem;"></i>
          <span id="donow-mode-subtitle-text">${result.subtitle}</span>
        </div>
      </div>

      <!-- Unit Chips Bar (Visible when 'All' is active) -->
      <div id="donow-gcse-unit-chips-wrapper" style="display: ${activeMode === 'all' ? 'block' : 'none'};">
        ${chipsHtml}
      </div>

      <!-- 10 Questions Container -->
      <div class="donow-rows-container" id="donow-rows-container" style="display: flex; flex-direction: column; gap: 0; margin-top: 6px; background: #ffffff; border: 1.2px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);">
        ${rowsHtml}
      </div>
    </div>
  `;
}

/**
 * Initializes global window event handlers for dynamic mode switching, unit toggling, shuffling,
 * explanation drawers, and direct narrative block navigation.
 */
export function initGcseDoNowEngine(currentLesson, activeUnit, db) {
  if (typeof window === 'undefined') return;

  window.currentGcseLesson = currentLesson;
  window.currentGcseActiveUnit = activeUnit;
  window.currentGcseDb = db || window.db || {};

  window.setGcseDoNowMode = function (mode) {
    saveDoNowMode(mode);

    // 1. Update button active states and inline styles
    document.querySelectorAll('.btn-donow-mode').forEach((btn) => {
      const isCur = btn.dataset.donowMode === mode;
      if (isCur) {
        btn.classList.add('active');
        btn.style.background = '#0284c7';
        btn.style.color = '#ffffff';
        btn.style.boxShadow = '0 1px 3px rgba(2, 132, 199, 0.4)';
      } else {
        btn.classList.remove('active');
        btn.style.background = 'transparent';
        btn.style.color = '#475569';
        btn.style.boxShadow = 'none';
      }
    });

    // 2. Toggle unit chips visibility
    const chipsWrapper = document.getElementById('donow-gcse-unit-chips-wrapper');
    if (chipsWrapper) {
      chipsWrapper.style.display = mode === 'all' ? 'block' : 'none';
    }

    // 3. Re-generate questions
    window.refreshCurrentGcseDoNow();
  };

  window.toggleGcseDoNowUnit = function (toggledUnitId) {
    const curUnitId = window.currentGcseActiveUnit?.id || window.currentUnitId;
    let selected = getSelectedGcseUnits(curUnitId);

    if (selected.includes(toggledUnitId)) {
      // Don't allow deselecting all units
      if (selected.length > 1) {
        selected = selected.filter((id) => id !== toggledUnitId);
      }
    } else {
      selected.push(toggledUnitId);
    }

    saveSelectedGcseUnits(selected);

    // Update chips HTML
    const chipsWrapper = document.getElementById('donow-gcse-unit-chips-wrapper');
    if (chipsWrapper) {
      chipsWrapper.innerHTML = renderGcseUnitChipsHTML(selected);
    }

    // Re-generate questions
    window.refreshCurrentGcseDoNow();
  };

  window.toggleDoNowExplanation = function (expId, badgeId, caretId) {
    const expEl = document.getElementById(expId);
    const caretEl = document.getElementById(caretId);
    const badgeEl = document.getElementById(badgeId);
    if (!expEl) return;

    const isHidden = expEl.style.display === 'none' || !expEl.style.display;
    if (isHidden) {
      expEl.style.display = 'block';
      if (caretEl) caretEl.style.transform = 'rotate(180deg)';
      if (badgeEl) badgeEl.classList.add('expanded');
    } else {
      expEl.style.display = 'none';
      if (caretEl) caretEl.style.transform = 'rotate(0deg)';
      if (badgeEl) badgeEl.classList.remove('expanded');
    }
  };

  window.jumpToLessonFromDoNow = function (targetUnitId, lessonNum, stageNum = 1) {
    const lessonIdx = Math.max(0, parseInt(lessonNum, 10) - 1);
    const targetStage = parseInt(stageNum, 10) || 1;
    const cleanUnitId = targetUnitId || window.currentGcseActiveUnit?.id || window.currentUnitId || 'cme_new';
    const targetUrl = `?view=lessons&unit=${cleanUnitId}&lesson=${lessonIdx + 1}&stage=${targetStage}`;
    
    // Always open in a separate tab so the student or teacher NEVER loses their place,
    // countdown timer, or revealed answers on their active Do Now retrieval starter!
    const newWin = window.open(targetUrl, '_blank');
    if (newWin) {
      newWin.focus();
    } else {
      window.location.href = targetUrl;
    }
  };

  window.refreshCurrentGcseDoNow = function () {
    const lesson = window.currentGcseLesson;
    const activeUnit = window.currentGcseActiveUnit;
    const db = window.currentGcseDb || window.db || {};
    const curUnitId = activeUnit?.id || window.currentUnitId;
    const mode = getSavedDoNowMode();
    const selectedUnits = getSelectedGcseUnits(curUnitId);

    let result;
    if (mode === 'previous') {
      result = getPreviousLessonQuestions(activeUnit, lesson);
    } else if (mode === 'unit') {
      result = getUnitInterleavedQuestions(activeUnit, lesson);
    } else {
      result = getSynopticGcseQuestions(activeUnit, lesson, db, selectedUnits);
    }

    // Update subtitle
    const subTextEl = document.getElementById('donow-mode-subtitle-text');
    if (subTextEl) subTextEl.innerHTML = result.subtitle;

    // Update rows container
    const rowsContainer = document.getElementById('donow-rows-container');
    if (rowsContainer) {
      rowsContainer.innerHTML = renderDoNowRowsHTML(result.questions, mode, curUnitId);
    }

    // Reset Reveal All button state if present
    const revealAllBtn = document.querySelector('[data-action="toggle-all-answers"]');
    if (revealAllBtn) {
      revealAllBtn.innerHTML = '<i class="fa-solid fa-eye" style="color: #0284c7; font-size: 0.72rem;"></i> <span>Reveal All Answers</span>';
    }
  };
}
