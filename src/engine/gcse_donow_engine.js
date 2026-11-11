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

export const KS3_RETRIEVAL_UNITS = [
  { id: 'medieval_england', label: 'Medieval England', title: 'Medieval England, 1066–1509', bg: '#fafaf9', border: '#e7e5e4', text: '#44403c' },
  { id: 'monarchy_religion_power', label: 'Monarchy & Power', title: 'Monarchy, Religion & Power, 1509–1745', bg: '#fff7ed', border: '#ffedd5', text: '#9a3412' },
  { id: 'great_war', label: 'The Great War', title: 'The Great War, 1914–1918', bg: '#fef2f2', border: '#fee2e2', text: '#991b1b' },
  { id: 'great_war_part2', label: 'Great War Part 2', title: 'The Great War Part 2, 1916–1918', bg: '#fef2f2', border: '#fee2e2', text: '#991b1b' },
  { id: 'industrialisation_and_empire', label: 'Industrialisation', title: 'Industrialisation & Empire, 1745–1901', bg: '#f0fdf4', border: '#dcfce7', text: '#166534' },
  { id: 'the_shoah', label: 'The Holocaust', title: 'The Holocaust & Nazi Persecution', bg: '#f8fafc', border: '#e2e8f0', text: '#1e293b' },
  { id: 'first_british_empire', label: '1st British Empire', title: 'The First British Empire', bg: '#eff6ff', border: '#dbeafe', text: '#1e40af' },
  { id: 'second_british_empire', label: '2nd British Empire', title: 'The Second British Empire', bg: '#f5f3ff', border: '#ede9fe', text: '#5b21b6' },
  { id: 'post_war_britain', label: 'Post-War Britain', title: 'Post-War Britain, 1945–1997', bg: '#fdf2f8', border: '#fce7f3', text: '#9d174d' },
  { id: 'australia', label: 'Australia', title: 'Indigenous & Colonial Australia', bg: '#fffbeb', border: '#fef3c7', text: '#92400e' },
  { id: 'water_and_sanitation', label: 'Water & Sanitation', title: 'Water & Sanitation Through Time', bg: '#f0fdfa', border: '#ccfbf1', text: '#0f766e' },
  { id: 'early_modern_world', label: 'Early Modern', title: 'The Early Modern World, c1450–1750', bg: '#faf5ff', border: '#f3e8ff', text: '#6b21a8' },
];

export const ALL_RETRIEVAL_UNITS = [...GCSE_RETRIEVAL_UNITS, ...KS3_RETRIEVAL_UNITS];

const LOCAL_STORAGE_KEY_SELECTED_UNITS = 'history_hub_selected_gcse_units';
const LOCAL_STORAGE_KEY_ACTIVE_MODE = 'history_hub_gcse_donow_mode';
const LOCAL_STORAGE_KEY_SELECTED_TARGET = 'history_hub_selected_retrieval_target';
const LOCAL_STORAGE_KEY_SELECTED_KS3_TARGET = 'history_hub_selected_ks3_retrieval_target';
const SESSION_STORAGE_KEY_COUNT_OVERRIDE = 'history_hub_donow_count_override';

/**
 * Accurately determines if a unit belongs to Key Stage 3.
 */
export function isKs3Unit(unit, unitId = '') {
  const uid = unitId || unit?.id || (typeof window !== 'undefined' ? window.currentUnitId : '');
  if (unit?.key_stage === 'KS3' || unit?.category === 'KS3') return true;
  if (['cme_new', 'usa', 'weimar_nazi_germany', 'edexcel_medicine', 'eee', 'cold_war'].includes(uid)) return false;
  if (uid.startsWith('gcse_') || unit?.category === 'GCSE' || unit?.key_stage === 'KS4') return false;
  return true;
}

/**
 * Gets active question count based on key stage and retrieval scope.
 * Smart defaults:
 * - KS3: 5 questions for 'previous', 'current', and 'unit' (5-minute lesson starter); 10 questions for 'other'/'all' (broad synoptic mix).
 * - GCSE: 10 questions across all modes.
 * User manual toggle (5 Qs | 10 Qs | 15 Qs | 20 Qs) explicitly overrides this for the current lesson session.
 */
export function getSavedQuestionCount(isKs3 = false, activeMode = 'previous') {
  if (typeof window !== 'undefined' && window.currentDoNowCountOverride) {
    const val = parseInt(window.currentDoNowCountOverride, 10);
    if ([5, 10, 15, 20].includes(val)) return val;
  }

  if (isKs3) {
    if (activeMode === 'other' || activeMode === 'all') {
      return 10;
    }
    return 5;
  }
  return 10;
}

/**
 * Saves explicit question count toggle preference (5, 10, 15, or 20) in memory for the active lesson session.
 */
export function saveQuestionCount(count) {
  if (typeof window !== 'undefined') {
    window.currentDoNowCountOverride = count;
  }
}

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

  // Check for explicit source letter mentions in question: 'Source A', 'Source B', etc.
  const sourceMatch = qText.match(/\bsource\s+([a-e])\b/i);
  const targetSourceLetter = sourceMatch ? sourceMatch[1].toUpperCase() : null;

  let bestIdx = 0;
  let bestScore = -1;

  blocks.forEach((b, bIdx) => {
    const bTitleTheme = cleanSearchTokens(
      (b.title || '') + ' ' +
      (b.heading || '') + ' ' +
      (b.theme || '') + ' ' +
      (b.theme_heading || '') + ' ' +
      (b.act_title || '')
    );
    const rawContent = cleanSearchTokens(
      bTitleTheme + ' ' +
      (b.content || b.text || '') + ' ' +
      (Array.isArray(b.paragraphs) ? b.paragraphs.join(' ') : '') + ' ' +
      (b.caption || '') + ' ' +
      (b.image_alt || '')
    );

    let score = 0;

    // Direct match for explicit source letter
    if (targetSourceLetter) {
      if (Array.isArray(b.sources)) {
        const hasLetter = b.sources.some(
          (s) =>
            (s.letter && s.letter.toUpperCase() === targetSourceLetter) ||
            (s.id && s.id.toUpperCase().includes('SOURCE_' + targetSourceLetter)) ||
            (s.title && s.title.toUpperCase().includes('SOURCE ' + targetSourceLetter))
        );
        if (hasLetter) score += 120;
      }
      const letterIdx = targetSourceLetter.charCodeAt(0) - 65;
      if (bIdx === letterIdx) score += 60;
    }

    // Exact answer string match gives supreme confidence
    if (aText.length >= 3 && rawContent.includes(aText)) {
      score += 100;
    } else if (aTextNoArticle.length >= 3 && rawContent.includes(aTextNoArticle)) {
      score += 90;
    }

    // Direct title / theme matches for answer
    if (aTextNoArticle.length >= 4 && bTitleTheme.includes(aTextNoArticle)) {
      score += 50;
    }

    // Keyword matches
    words.forEach((w) => {
      if (bTitleTheme.includes(w)) {
        score += 20; // High bonus for matching heading/theme
      } else if (rawContent.includes(w)) {
        score += 5;
      }
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

  // STRICT PEDAGOGICAL GATE 1B: Exclude out-of-specification pre-1945 introductory questions (Theodor Herzl, Sykes-Picot, McMahon-Hussein, etc.)
  // or overly obscure tactical/geographic minutiae (Hasbani, Banias, Ammunition Hill) that are inaccessible for GCSE pupils.
  // Edexcel GCSE Conflict in the Middle East strictly spans 1945–1995. Pre-1945 intro topics must NEVER be tested in Do Now recall.
  const outOfSpecIntroPattern = /\b(herzl|sykes[\s–-]picot|mcmahon[\s–-]hussein|judenstaat|dreyfus|sharif of mecca|1897\s+basel|peel commission|1939\s+white paper|hasbani|banias|ammunition hill|givat)\b/i;
  if (outOfSpecIntroPattern.test(question) || outOfSpecIntroPattern.test(answer)) {
    return null;
  }

  // STRICT PEDAGOGICAL GATE 1C: Exclude negative multiple-choice questions without options (e.g. "Which of the following was NOT...")
  if (/\b(?:which of (?:the following|these))\s+(?:was|were|is|are)\s+NOT\b/i.test(question)) {
    return null;
  }

  // Strip obsolete retrieval metadata phrases
  question = question
    .replace(/\s*\((Last Lesson|Last Week|Prior Topic|Prior Unit|Earlier in Unit|Last Term|Last Year|Synoptic|Immediate Previous Lesson|Prior Learning|Foundational Context)\)\s*$/i, '')
    .replace(/^PAST TOPIC:\s*/i, '')
    .replace(/^(Question|Task|Q)\s*\d+[:.]\s*/i, '')
    .trim();

  // Clean multiple-choice stems into natural, direct recall questions
  question = question
    .replace(/^Which of the following best explains why\b/i, 'What best explains why')
    .replace(/^Which of the following explains why\b/i, 'What explains why')
    .replace(/^Which of the following was the primary consequence of\b/i, 'What was the primary consequence of')
    .replace(/^Which of the following was the most significant consequence of\b/i, 'What was the most significant consequence of')
    .replace(/^Which of the following was a key consequence of\b/i, 'What was a key consequence of')
    .replace(/^Which of the following was the primary cause of\b/i, 'What was the primary cause of')
    .replace(/^Which of the following was the main cause for\b/i, 'What was the main cause for')
    .replace(/^Which of the following was a primary cause for\b/i, 'What was a primary cause for')
    .replace(/^Which of the following was a primary cause of\b/i, 'What was a primary cause of')
    .replace(/^Which of the following best explains the primary cause of\b/i, 'What was the primary cause of')
    .replace(/^Which of the following best explains the main objective of\b/i, 'What was the main objective of')
    .replace(/^Which of the following was the primary reason for\b/i, 'What was the primary reason for')
    .replace(/^Which of the following was the primary reason why\b/i, 'What was the primary reason why')
    .replace(/^Which of the following is the most significant reason why\b/i, 'What was the most significant reason why')
    .replace(/^Which of the following best describes the historical significance of\b/i, 'What was the significance of')
    .replace(/^Which of the following best describes the significance of\b/i, 'What was the significance of')
    .replace(/^Which of the following best describes\b/i, 'What best describes')
    .replace(/^Which of the following best explains\b/i, 'What best explains')
    .replace(/^Which of the following patient groups was\b/i, 'Which patient groups were')
    .replace(/^Which of the following was a mandatory requirement\b/i, 'What was a mandatory requirement')
    .replace(/^Which of the following is a primary lifestyle cause\b/i, 'What is a primary lifestyle cause')
    .replace(/^Which of the following was\b/i, 'What was')
    .replace(/^Which of the following were\b/i, 'What were')
    .replace(/^Which of the following is\b/i, 'What is')
    .replace(/^Which of the following are\b/i, 'What are')
    .replace(/^Which of the following\b/i, 'Which')
    .replace(/^Which of these\b/i, 'Which')
    .trim();

  // Strip leading numbering, letter markers, or 'Option X' from answers
  answer = answer
    .replace(/^(?:Option\s+[A-D][:.]?\s*|[A-D][\)\.\:\s]\s*|\([a-d]\)\s*)/i, '')
    .trim();

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
 * CRITICAL: When seed is null, returns canonical array order untouched (100% deterministic).
 */
export function shuffleArray(arr, seed = null) {
  if (seed === null || seed === undefined) {
    return [...arr];
  }
  const copy = [...arr];
  let s = typeof seed === 'number' ? seed : 123456789;
  // Linear congruential generator for reproducible shuffle
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const rnd = s / 233280;
    const j = Math.floor(rnd * (i + 1));
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
 * Gets currently selected retrieval target ('all_gcse', 'all_ks3', or a specific unit ID) from localStorage.
 */
export function getSelectedRetrievalTarget(isKs3 = false) {
  try {
    if (typeof localStorage !== 'undefined') {
      const key = isKs3 ? LOCAL_STORAGE_KEY_SELECTED_KS3_TARGET : LOCAL_STORAGE_KEY_SELECTED_TARGET;
      const stored = localStorage.getItem(key);
      if (stored) return stored;
    }
  } catch (e) {}
  return isKs3 ? 'all_ks3' : 'all_gcse';
}

/**
 * Saves selected retrieval target to localStorage.
 */
export function saveSelectedRetrievalTarget(targetId, isKs3 = false) {
  try {
    if (typeof localStorage !== 'undefined') {
      const key = isKs3 ? LOCAL_STORAGE_KEY_SELECTED_KS3_TARGET : LOCAL_STORAGE_KEY_SELECTED_TARGET;
      localStorage.setItem(key, targetId);
    }
  } catch (e) {}
}

/**
 * Gets active retrieval mode ('current', 'previous', 'unit', 'other').
 * In-memory per lesson session; defaults to 'previous' on initial load.
 */
export function getSavedDoNowMode() {
  if (typeof window !== 'undefined' && window.currentDoNowMode) {
    return window.currentDoNowMode;
  }
  return 'previous';
}

/**
 * Saves active retrieval mode in memory for the current session.
 */
export function saveDoNowMode(mode) {
  if (typeof window !== 'undefined') {
    window.currentDoNowMode = mode === 'all' ? 'other' : mode;
  }
}

/**
 * Mode 0: "This Lesson" (questions directly on the active lesson for pupil self-study).
 */
export function getCurrentLessonQuestions(activeUnit, currentLesson, seed = null, targetCount = null) {
  const isKs3 = isKs3Unit(activeUnit);
  const count = targetCount || getSavedQuestionCount(isKs3, 'current');
  const lessons = activeUnit?.lessons || [];
  const currentIndex = lessons.findIndex(
    (l) => (l.id && l.id === currentLesson.id) || l.title === currentLesson.title,
  );
  const lessonNum = currentIndex >= 0 ? currentIndex + 1 : 1;
  const pool = [];

  // 1. Pull from currentLesson.quiz (20 questions testing currentLesson)
  if (Array.isArray(currentLesson.quiz)) {
    currentLesson.quiz.forEach((q) => {
      const stage = findMatchingBlockIndex(q, currentLesson.narrative_blocks);
      const qa = extractCleanQA(q, 'This Lesson', lessonNum, currentLesson.title, activeUnit?.id, stage);
      if (qa) {
        qa.unitId = activeUnit?.id || '';
        pool.push(qa);
      }
    });
  }

  // 2. Supplement from currentLesson.do_now if quiz had fewer than count
  if (pool.length < count) {
    const baseItems =
      currentLesson.do_now?.items ||
      currentLesson.do_now?.questions ||
      currentLesson.do_now?.tasks ||
      (Array.isArray(currentLesson.do_now) ? currentLesson.do_now : []);
    baseItems.forEach((it) => {
      const stage = findMatchingBlockIndex(it, currentLesson.narrative_blocks);
      const qa = extractCleanQA(it, 'This Lesson', lessonNum, currentLesson.title, activeUnit?.id, stage);
      if (qa && !pool.some((p) => p.question === qa.question)) {
        qa.unitId = activeUnit?.id || '';
        pool.push(qa);
      }
    });
  }

  // 3. Supplement from flashcards if needed
  if (pool.length < count && Array.isArray(currentLesson.flashcards)) {
    currentLesson.flashcards.forEach((fc) => {
      const stage = findMatchingBlockIndex(fc, currentLesson.narrative_blocks);
      const qa = extractCleanQA(
        { question: fc.front || fc.term || fc.q, answer: fc.back || fc.definition || fc.a, explanation: fc.definition || fc.back },
        'This Lesson',
        lessonNum,
        currentLesson.title,
        activeUnit?.id,
        stage,
      );
      if (qa && !pool.some((p) => p.question === qa.question)) {
        qa.unitId = activeUnit?.id || '';
        pool.push(qa);
      }
    });
  }

  // Deterministic canonical order on load (seed === null); randomized when seed provided
  const finalQuestions = (seed !== null ? shuffleArray(pool, seed) : pool).slice(0, count);
  const cleanTitle = (currentLesson.title || `Lesson ${lessonNum}`).split(':')[0].trim();

  return {
    mode: 'current',
    subtitle: `Current Lesson Recall • ${finalQuestions.length} Questions from Lesson ${lessonNum}: ${cleanTitle}`,
    questions: finalQuestions,
    isLessonOne: false,
  };
}

/**
 * Mode 1: "Previous" (questions strictly from the immediate previous lesson).
 */
export function getPreviousLessonQuestions(activeUnit, currentLesson, seed = null, targetCount = null) {
  const isKs3 = isKs3Unit(activeUnit);
  const count = targetCount || getSavedQuestionCount(isKs3, 'previous');
  const lessons = activeUnit?.lessons || [];
  const currentIndex = lessons.findIndex(
    (l) => (l.id && l.id === currentLesson.id) || l.title === currentLesson.title,
  );

  const isCme = activeUnit?.id === 'cme_new' || currentLesson?.unitId === 'cme_new';

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

    // If extended drill requested (10, 15, or 20 Qs), supplement from currentLesson.quiz
    if (items.length < count && Array.isArray(currentLesson.quiz)) {
      currentLesson.quiz.forEach((q) => {
        const stage = findMatchingBlockIndex(q, currentLesson.narrative_blocks);
        const qa = extractCleanQA(q, 'Foundational', 1, currentLesson.title, activeUnit?.id, stage);
        if (qa && !items.some((it) => it.question === qa.question)) {
          qa.unitId = activeUnit?.id || '';
          items.push(qa);
        }
      });
    }

    const finalItems = (seed !== null ? shuffleArray(items, seed) : items).slice(0, count);
    return {
      mode: 'previous',
      subtitle: `Lesson 1: Foundational Baseline • ${finalItems.length} Core Questions`,
      questions: finalItems,
      isLessonOne: true,
    };
  }

  const prevLesson = lessons[currentIndex - 1];
  const pool = [];

  // 1. If currentLesson has dedicated do_now items specifically written for this starter, prioritize them for exact homework parity!
  const currentDoNowItems =
    currentLesson.do_now?.items ||
    currentLesson.do_now?.questions ||
    currentLesson.do_now?.tasks ||
    (Array.isArray(currentLesson.do_now) ? currentLesson.do_now : []);

  if (Array.isArray(currentDoNowItems) && currentDoNowItems.length >= count) {
    currentDoNowItems.forEach((it) => {
      const stage = findMatchingBlockIndex(it, prevLesson.narrative_blocks);
      const qa = extractCleanQA(it, 'Last Lesson', currentIndex, prevLesson.title, activeUnit?.id, stage);
      if (qa && !pool.some((p) => p.question === qa.question)) {
        qa.unitId = activeUnit?.id || '';
        pool.push(qa);
      }
    });
  }

  // 2. Otherwise, pull from prevLesson.quiz (20 questions testing prevLesson)
  if (pool.length < count && Array.isArray(prevLesson.quiz)) {
    prevLesson.quiz.forEach((q) => {
      const stage = findMatchingBlockIndex(q, prevLesson.narrative_blocks);
      const qa = extractCleanQA(q, 'Last Lesson', currentIndex, prevLesson.title, activeUnit?.id, stage);
      if (qa && !pool.some((p) => p.question === qa.question)) {
        qa.unitId = activeUnit?.id || '';
        pool.push(qa);
      }
    });
  }

  // 2. Supplement from prevLesson.do_now if quiz had fewer than count
  if (pool.length < count) {
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
  if (pool.length < count && Array.isArray(prevLesson.flashcards)) {
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

  const finalQuestions = (seed !== null ? shuffleArray(pool, seed) : pool).slice(0, count);
  const prevTitle = (prevLesson.title || `Lesson ${currentIndex}`).split(':')[0].trim();

  return {
    mode: 'previous',
    subtitle: `Immediate Recall • ${finalQuestions.length} Questions from Lesson ${currentIndex}: ${prevTitle}`,
    questions: finalQuestions,
    isLessonOne: false,
  };
}

/**
 * Mode 2: "Unit" (questions interleaved across all prior lessons 1 to N-1).
 */
export function getUnitInterleavedQuestions(activeUnit, currentLesson, seed = null, targetCount = null) {
  const isKs3 = isKs3Unit(activeUnit);
  const count = targetCount || getSavedQuestionCount(isKs3, 'unit');
  const lessons = activeUnit?.lessons || [];
  const currentIndex = lessons.findIndex(
    (l) => (l.id && l.id === currentLesson.id) || l.title === currentLesson.title,
  );

  const isCme = activeUnit?.id === 'cme_new' || currentLesson?.unitId === 'cme_new';
  const startIdx = isCme ? 1 : 0; // Exclude pre-1945 intro lesson (KT 1.0) for CME

  if (currentIndex <= startIdx) {
    return getPreviousLessonQuestions(activeUnit, currentLesson, seed, count);
  }

  const priorLessons = lessons.slice(startIdx, currentIndex);
  const qPerLesson = Math.max(1, Math.ceil(count / priorLessons.length));
  const pool = [];

  priorLessons.forEach((pl, relativeIdx) => {
    const actualLessonNum = isCme ? relativeIdx + 2 : relativeIdx + 1;
    const lPool = [];
    if (Array.isArray(pl.quiz)) {
      pl.quiz.forEach((q) => {
        const stage = findMatchingBlockIndex(q, pl.narrative_blocks);
        const qa = extractCleanQA(q, `Lesson ${actualLessonNum}`, actualLessonNum, pl.title, activeUnit?.id, stage);
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
        const qa = extractCleanQA(it, `Lesson ${actualLessonNum}`, actualLessonNum, pl.title, activeUnit?.id, stage);
        if (qa) {
          qa.unitId = activeUnit?.id || '';
          lPool.push(qa);
        }
      });
    }
    const sampled = seed !== null ? shuffleArray(lPool, seed).slice(0, qPerLesson) : lPool.slice(0, qPerLesson);
    pool.push(...sampled);
  });

  const finalQuestions = (seed !== null ? shuffleArray(pool, seed) : pool).slice(0, count);

  return {
    mode: 'unit',
    subtitle: `Unit Interleaving • ${finalQuestions.length} Questions across Lessons 1–${currentIndex}`,
    questions: finalQuestions,
    isLessonOne: false,
  };
}

/**
 * Mode 3: "Other Units" (questions sampled from selected target unit or synoptic mix).
 */
export function getSynopticGcseQuestions(activeUnit, currentLesson, db, target = null, seed = null, targetCount = null) {
  const currentUnitId = activeUnit?.id || (typeof window !== 'undefined' ? window.currentUnitId : '');
  const isKs3 = isKs3Unit(activeUnit, currentUnitId);
  const count = targetCount || getSavedQuestionCount(isKs3, 'other');
  const resolvedTarget = target || getSelectedRetrievalTarget(isKs3);

  let selectedUnitIds = [];
  let isAllGcse = false;
  let isAllKs3 = false;

  if (resolvedTarget === 'all_ks3') {
    isAllKs3 = true;
    selectedUnitIds = KS3_RETRIEVAL_UNITS.map((u) => u.id);
  } else if (!resolvedTarget || resolvedTarget === 'all_gcse') {
    if (isKs3 && (!resolvedTarget || resolvedTarget === 'all_ks3')) {
      isAllKs3 = true;
      selectedUnitIds = KS3_RETRIEVAL_UNITS.map((u) => u.id);
    } else {
      isAllGcse = true;
      selectedUnitIds = GCSE_RETRIEVAL_UNITS.map((u) => u.id);
    }
  } else if (Array.isArray(resolvedTarget)) {
    selectedUnitIds = resolvedTarget;
  } else if (typeof resolvedTarget === 'string') {
    selectedUnitIds = [resolvedTarget];
  }

  // Resolve unit objects
  const validUnits = selectedUnitIds
    .map((uid) => {
      const uObj = db?.[uid]?.data || db?.[uid];
      const meta = ALL_RETRIEVAL_UNITS.find((m) => m.id === uid) || { label: uid, id: uid, title: uid, bg: '#f1f5f9', border: '#cbd5e1', text: '#334155' };
      return uObj ? { unitData: uObj, meta } : null;
    })
    .filter(Boolean);

  if (validUnits.length === 0) {
    return getUnitInterleavedQuestions(activeUnit, currentLesson, seed, count);
  }

  // Allocate target question counts across selected units
  let collected = [];
  const qPerUnit = Math.max(1, Math.ceil(count / validUnits.length));

  validUnits.forEach(({ unitData, meta }) => {
    const isCurrent = meta.id === currentUnitId;
    const lessons = unitData.lessons || [];
    const currIdx = lessons.findIndex(
      (l) => (l.id && l.id === currentLesson.id) || l.title === currentLesson.title,
    );
    // For current unit, only draw up to current lesson to respect Zero Same-Lesson Recall!
    let availableLessons = isCurrent && currIdx > 0 ? lessons.slice(0, currIdx) : lessons;
    if (meta.id === 'cme_new') {
      // Exclude pre-1945 intro lesson (KT 1.0) so no intro questions appear in GCSE synoptic quizzes
      availableLessons = availableLessons.filter((l, idx) => idx > 0 && !String(l.title || '').includes('KT 1.0'));
    }

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

    const sampled = seed !== null ? shuffleArray(unitPool, seed).slice(0, qPerUnit) : unitPool.slice(0, qPerUnit);
    collected.push(...sampled);
  });

  const finalQuestions = (seed !== null ? shuffleArray(collected, seed) : collected).slice(0, count);
  
  let subtitleText = '';
  if (validUnits.length === 1) {
    const singleMeta = validUnits[0].meta;
    subtitleText = `${singleMeta.label} Retrieval &bull; ${finalQuestions.length} Questions from ${singleMeta.title}`;
  } else if (isAllKs3) {
    subtitleText = `Synoptic KS3 Mix &bull; ${finalQuestions.length} Questions across All KS3 Units`;
  } else if (isAllGcse) {
    subtitleText = `Synoptic GCSE Mix &bull; ${finalQuestions.length} Questions across All GCSE Units`;
  } else {
    const unitLabels = validUnits.map((v) => v.meta.label).join(' &bull; ');
    subtitleText = `Synoptic Retrieval &bull; ${finalQuestions.length} Questions across ${unitLabels}`;
  }

  return {
    mode: 'other',
    subtitle: subtitleText,
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

    // Origin badge for 'other' or 'unit'
    let originBadge = '';
    if ((mode === 'other' || mode === 'all') && item.unitMeta) {
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
    if (mode === 'current') {
      jumpLabel = `Stage ${stageNum} Narrative`;
    } else if ((mode === 'other' || mode === 'all') && item.unitMeta) {
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
 * Renders the unit filter chips bar when "Other Units" mode is active.
 */
export function renderGcseUnitChipsHTML(activeTarget = '', isKs3 = false) {
  const currentTarget = activeTarget || getSelectedRetrievalTarget(isKs3);

  if (isKs3) {
    const isAll = !currentTarget || currentTarget === 'all_ks3';
    const ks3Chips = KS3_RETRIEVAL_UNITS.map((u) => {
      const isSelected = currentTarget === u.id;
      return `
        <button type="button"
          class="btn-donow-unit-chip ${isSelected ? 'selected' : ''}"
          data-unit-id="${u.id}"
          onclick="event.stopPropagation(); window.selectGcseDoNowTarget('${u.id}');"
          title="Retrieve questions from ${u.title}">
          <i class="fa-solid ${isSelected ? 'fa-check' : 'fa-book-bookmark'}" style="font-size: 0.65rem;"></i>
          <span>${u.label}</span>
        </button>
      `;
    }).join('');

    const gcseOptions = GCSE_RETRIEVAL_UNITS.map((g) => {
      const isSelected = currentTarget === g.id;
      return `<option value="${g.id}" ${isSelected ? 'selected' : ''}>${g.label}</option>`;
    }).join('');

    return `
      <div class="donow-unit-chips-bar" style="margin: 0 0 10px 0; padding: 10px 14px; background: #f0fdf4; border: 1.2px solid #bbf7d0; border-radius: 8px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
          <span style="font-size: 0.72rem; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-graduation-cap" style="color: #16a34a; font-size: 0.82rem;"></i> Choose Starter Era / Unit:
          </span>
          <span style="font-size: 0.7rem; color: #15803d; font-weight: 600;">
            Select any Key Stage 3 topic to load retrieval questions
          </span>
        </div>
        <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
          <button type="button"
            class="btn-donow-unit-chip ${isAll ? 'selected' : ''}"
            data-unit-id="all_ks3"
            onclick="event.stopPropagation(); window.selectGcseDoNowTarget('all_ks3');"
            title="Questions synoptically sampled across all KS3 units">
            <i class="fa-solid ${isAll ? 'fa-check' : 'fa-sparkles'}" style="font-size: 0.65rem;"></i>
            <span>✨ All KS3 (Synoptic Mix)</span>
          </button>
          ${ks3Chips}
          <div style="display: inline-flex; align-items: center; margin-left: 2px;">
            <select class="donow-ks3-select"
              onchange="event.stopPropagation(); if (this.value) window.selectGcseDoNowTarget(this.value);"
              title="Retrieve questions from cross-phase GCSE units"
              style="padding: 4px 10px; font-size: 0.74rem; font-weight: 700; border-radius: 12px; border: 1.2px solid #cbd5e1; background: #ffffff; color: #475569; cursor: pointer; outline: none; transition: all 0.15s ease;">
              <option value="" style="background: #ffffff; color: #475569;">Cross-Phase GCSE Units ▾</option>
              ${gcseOptions}
            </select>
          </div>
        </div>
      </div>
    `;
  }

  // GCSE Mode
  const isAllGcse = !currentTarget || currentTarget === 'all_gcse';
  const isKs3Active = KS3_RETRIEVAL_UNITS.some((k) => k.id === currentTarget);

  const gcseChips = GCSE_RETRIEVAL_UNITS.map((u) => {
    const isSelected = currentTarget === u.id;
    return `
      <button type="button"
        class="btn-donow-unit-chip ${isSelected ? 'selected' : ''}"
        data-unit-id="${u.id}"
        onclick="event.stopPropagation(); window.selectGcseDoNowTarget('${u.id}');"
        title="Retrieve questions from ${u.title}">
        <i class="fa-solid ${isSelected ? 'fa-check' : 'fa-book-bookmark'}" style="font-size: 0.65rem;"></i>
        <span>${u.label}</span>
      </button>
    `;
  }).join('');

  const ks3Options = KS3_RETRIEVAL_UNITS.map((k) => {
    const isSelected = currentTarget === k.id;
    return `<option value="${k.id}" ${isSelected ? 'selected' : ''}>${k.label}</option>`;
  }).join('');

  return `
    <div class="donow-unit-chips-bar" style="margin: 0 0 10px 0; padding: 10px 14px; background: #f0fdf4; border: 1.2px solid #bbf7d0; border-radius: 8px;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
        <span style="font-size: 0.72rem; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-graduation-cap" style="color: #16a34a; font-size: 0.82rem;"></i> Choose Starter Unit:
        </span>
        <span style="font-size: 0.7rem; color: #15803d; font-weight: 600;">
          Select any unit to load recall questions
        </span>
      </div>
      <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
        <button type="button"
          class="btn-donow-unit-chip ${isAllGcse ? 'selected' : ''}"
          data-unit-id="all_gcse"
          onclick="event.stopPropagation(); window.selectGcseDoNowTarget('all_gcse');"
          title="Questions synoptically sampled across all GCSE units">
          <i class="fa-solid ${isAllGcse ? 'fa-check' : 'fa-sparkles'}" style="font-size: 0.65rem;"></i>
          <span>✨ All GCSE (Synoptic Mix)</span>
        </button>
        ${gcseChips}
        <div style="display: inline-flex; align-items: center; margin-left: 2px;">
          <select class="donow-ks3-select"
            onchange="event.stopPropagation(); if (this.value) window.selectGcseDoNowTarget(this.value);"
            title="Retrieve questions from prior Key Stage 3 units"
            style="padding: 4px 10px; font-size: 0.74rem; font-weight: 700; border-radius: 12px; border: 1.2px solid ${isKs3Active ? '#0284c7' : '#cbd5e1'}; background: ${isKs3Active ? '#0284c7' : '#ffffff'}; color: ${isKs3Active ? '#ffffff' : '#475569'}; cursor: pointer; outline: none; transition: all 0.15s ease;">
            <option value="" style="background: #ffffff; color: #475569;">Prior KS3 Units ▾</option>
            ${ks3Options}
          </select>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the complete 3-mode Do Now panel HTML for KS3 and GCSE.
 */
export function renderGcseDoNowPanelHTML({
  activeUnit,
  lesson,
  unitId = '',
  db = null,
  headerHtml = '',
  timerHtml = '',
  isKs3 = null,
}) {
  const currentUnitId = unitId || activeUnit?.id || (typeof window !== 'undefined' ? window.currentUnitId : '');
  const isKs3Effective = isKs3 !== null ? isKs3 : isKs3Unit(activeUnit, currentUnitId);
  // Default mode for a lesson starter is ALWAYS 'previous' so teachers and pupils are always in sync on lesson load
  const activeMode = 'previous';
  const currentTarget = isKs3Effective ? 'all_ks3' : 'all_gcse';
  const activeCount = isKs3Effective ? 5 : 10;

  // Compute initial questions for active mode
  let result;
  if (activeMode === 'current') {
    result = getCurrentLessonQuestions(activeUnit, lesson, null, activeCount);
  } else if (activeMode === 'unit') {
    result = getUnitInterleavedQuestions(activeUnit, lesson, null, activeCount);
  } else if (activeMode === 'other' || activeMode === 'all') {
    result = getSynopticGcseQuestions(activeUnit, lesson, db || (typeof window !== 'undefined' ? window.db : {}), currentTarget, null, activeCount);
  } else {
    result = getPreviousLessonQuestions(activeUnit, lesson, null, activeCount);
  }

  const rowsHtml = renderDoNowRowsHTML(result.questions, activeMode, currentUnitId);
  const chipsHtml = renderGcseUnitChipsHTML(currentTarget, isKs3Effective);

  return `
    <div class="donow-panel-content gcse-3mode-donow" data-unit-id="${currentUnitId}" data-lesson-id="${lesson.id || ''}" data-is-ks3="${isKs3Effective ? 'true' : 'false'}">
      ${headerHtml}

      <!-- Scope Control Deck with Timer on the Right -->
      <div class="donow-mode-deck" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin: 8px 0 10px 0; padding: 6px 12px; background: #f8fafc; border: 1.2px solid #e2e8f0; border-radius: 10px;">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span style="font-size: 0.72rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.6px; display: inline-flex; align-items: center; gap: 5px; user-select: none;">
            <i class="fa-solid fa-sliders" style="color: #0284c7;"></i> Scope:
          </span>
          <div class="donow-mode-btn-group" style="display: inline-flex; align-items: center; background: #e2e8f0; padding: 3px; border-radius: 999px; gap: 2px; border: 1px solid #cbd5e1; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); flex-wrap: wrap;">
            <button type="button"
              class="btn-donow-mode ${activeMode === 'previous' ? 'active' : ''}"
              data-donow-mode="previous"
              onclick="event.stopPropagation(); window.setGcseDoNowMode('previous');"
              title="Questions strictly from the immediate previous lesson"
              style="padding: 4px 11px; font-size: 0.74rem; font-weight: 700; border-radius: 999px; border: none; outline: none; appearance: none; -webkit-appearance: none; background: ${activeMode === 'previous' ? '#0284c7' : 'transparent'}; color: ${activeMode === 'previous' ? '#ffffff' : '#475569'}; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; box-shadow: ${activeMode === 'previous' ? '0 1px 3px rgba(2, 132, 199, 0.4)' : 'none'}; transition: all 0.18s ease; user-select: none;">
              <i class="fa-solid fa-arrow-rotate-left"></i> Previous
            </button>
            <button type="button"
              class="btn-donow-mode ${activeMode === 'current' ? 'active' : ''}"
              data-donow-mode="current"
              onclick="event.stopPropagation(); window.setGcseDoNowMode('current');"
              title="Questions directly on this current lesson"
              style="padding: 4px 11px; font-size: 0.74rem; font-weight: 700; border-radius: 999px; border: none; outline: none; appearance: none; -webkit-appearance: none; background: ${activeMode === 'current' ? '#0284c7' : 'transparent'}; color: ${activeMode === 'current' ? '#ffffff' : '#475569'}; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; box-shadow: ${activeMode === 'current' ? '0 1px 3px rgba(2, 132, 199, 0.4)' : 'none'}; transition: all 0.18s ease; user-select: none;">
              <i class="fa-solid fa-book-open"></i> This Lesson
            </button>
            <button type="button"
              class="btn-donow-mode ${activeMode === 'unit' ? 'active' : ''}"
              data-donow-mode="unit"
              onclick="event.stopPropagation(); window.setGcseDoNowMode('unit');"
              title="Questions interleaved across this unit up to now"
              style="padding: 4px 11px; font-size: 0.74rem; font-weight: 700; border-radius: 999px; border: none; outline: none; appearance: none; -webkit-appearance: none; background: ${activeMode === 'unit' ? '#0284c7' : 'transparent'}; color: ${activeMode === 'unit' ? '#ffffff' : '#475569'}; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; box-shadow: ${activeMode === 'unit' ? '0 1px 3px rgba(2, 132, 199, 0.4)' : 'none'}; transition: all 0.18s ease; user-select: none;">
              <i class="fa-solid fa-layer-group"></i> Unit
            </button>
            <button type="button"
              class="btn-donow-mode ${activeMode === 'other' || activeMode === 'all' ? 'active' : ''}"
              data-donow-mode="other"
              onclick="event.stopPropagation(); window.setGcseDoNowMode('other');"
              title="Questions from another unit or synoptic mix"
              style="padding: 4px 11px; font-size: 0.74rem; font-weight: 700; border-radius: 999px; border: none; outline: none; appearance: none; -webkit-appearance: none; background: ${activeMode === 'other' || activeMode === 'all' ? '#0284c7' : 'transparent'}; color: ${activeMode === 'other' || activeMode === 'all' ? '#ffffff' : '#475569'}; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; box-shadow: ${activeMode === 'other' || activeMode === 'all' ? '0 1px 3px rgba(2, 132, 199, 0.4)' : 'none'}; transition: all 0.18s ease; user-select: none;">
              <i class="fa-solid fa-earth-americas"></i> All
            </button>
          </div>

          <!-- Question Count Pill Toggle: 5 Qs | 10 Qs | 15 Qs | 20 Qs -->
          <div class="donow-count-btn-group" style="display: inline-flex; align-items: center; background: #e2e8f0; padding: 2px; border-radius: 999px; gap: 2px; border: 1px solid #cbd5e1; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); user-select: none;">
            <button type="button"
              class="btn-donow-count ${activeCount === 5 ? 'active' : ''}"
              data-donow-count="5"
              onclick="event.stopPropagation(); window.setDoNowQuestionCount(5);"
              title="Set to 5 recall questions (standard 5-minute starter)"
              style="padding: 3px 8px; font-size: 0.72rem; font-weight: 700; border-radius: 999px; border: none; outline: none; appearance: none; -webkit-appearance: none; background: ${activeCount === 5 ? '#0284c7' : 'transparent'}; color: ${activeCount === 5 ? '#ffffff' : '#475569'}; cursor: pointer; display: inline-flex; align-items: center; box-shadow: ${activeCount === 5 ? '0 1px 3px rgba(2, 132, 199, 0.4)' : 'none'}; transition: all 0.15s ease;">
              5 Qs
            </button>
            <button type="button"
              class="btn-donow-count ${activeCount === 10 ? 'active' : ''}"
              data-donow-count="10"
              onclick="event.stopPropagation(); window.setDoNowQuestionCount(10);"
              title="Set to 10 recall questions (standard retrieval drill)"
              style="padding: 3px 8px; font-size: 0.72rem; font-weight: 700; border-radius: 999px; border: none; outline: none; appearance: none; -webkit-appearance: none; background: ${activeCount === 10 ? '#0284c7' : 'transparent'}; color: ${activeCount === 10 ? '#ffffff' : '#475569'}; cursor: pointer; display: inline-flex; align-items: center; box-shadow: ${activeCount === 10 ? '0 1px 3px rgba(2, 132, 199, 0.4)' : 'none'}; transition: all 0.15s ease;">
              10 Qs
            </button>
            <button type="button"
              class="btn-donow-count ${activeCount === 15 ? 'active' : ''}"
              data-donow-count="15"
              onclick="event.stopPropagation(); window.setDoNowQuestionCount(15);"
              title="Set to 15 recall questions (extended retrieval drill)"
              style="padding: 3px 8px; font-size: 0.72rem; font-weight: 700; border-radius: 999px; border: none; outline: none; appearance: none; -webkit-appearance: none; background: ${activeCount === 15 ? '#0284c7' : 'transparent'}; color: ${activeCount === 15 ? '#ffffff' : '#475569'}; cursor: pointer; display: inline-flex; align-items: center; box-shadow: ${activeCount === 15 ? '0 1px 3px rgba(2, 132, 199, 0.4)' : 'none'}; transition: all 0.15s ease;">
              15 Qs
            </button>
            <button type="button"
              class="btn-donow-count ${activeCount === 20 ? 'active' : ''}"
              data-donow-count="20"
              onclick="event.stopPropagation(); window.setDoNowQuestionCount(20);"
              title="Set to 20 recall questions (full topic mastery challenge)"
              style="padding: 3px 8px; font-size: 0.72rem; font-weight: 700; border-radius: 999px; border: none; outline: none; appearance: none; -webkit-appearance: none; background: ${activeCount === 20 ? '#0284c7' : 'transparent'}; color: ${activeCount === 20 ? '#ffffff' : '#475569'}; cursor: pointer; display: inline-flex; align-items: center; box-shadow: ${activeCount === 20 ? '0 1px 3px rgba(2, 132, 199, 0.4)' : 'none'}; transition: all 0.15s ease;">
              20 Qs
            </button>
          </div>

          <button type="button"
            class="btn-donow-shuffle"
            onclick="event.stopPropagation(); window.refreshCurrentGcseDoNow(true);"
            title="Roll a fresh randomized set of questions for this scope"
            style="padding: 4px 11px; font-size: 0.74rem; font-weight: 700; border-radius: 999px; border: 1px solid #cbd5e1; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); color: #0369a1; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: all 0.15s ease;">
            <i class="fa-solid fa-arrows-rotate" style="color: #0284c7;"></i> Shuffle
          </button>
        </div>

        ${timerHtml ? `<div class="donow-mode-timer-slot" style="display: inline-flex; align-items: center;">${timerHtml}</div>` : ''}
      </div>

      <!-- Subtitle Row -->
      <div style="margin: 4px 0 8px 0;">
        <div id="donow-mode-subtitle" style="font-size: 0.75rem; font-weight: 700; color: #0369a1; background: #e0f2fe; border: 1px solid #bae6fd; padding: 3px 12px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-bullseye" style="color: #0284c7; font-size: 0.7rem;"></i>
          <span id="donow-mode-subtitle-text">${result.subtitle}</span>
        </div>
      </div>

      <!-- Unit Chips Bar (Visible when 'Other Units' is active) -->
      <div id="donow-gcse-unit-chips-wrapper" style="display: ${activeMode === 'other' || activeMode === 'all' ? 'block' : 'none'};">
        ${chipsHtml}
      </div>

      <!-- Questions Container -->
      <div class="donow-rows-container" id="donow-rows-container" style="display: flex; flex-direction: column; gap: 0; margin-top: 6px; background: #ffffff; border: 1.2px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);">
        ${rowsHtml}
      </div>
    </div>
  `;
}

/**
 * Initializes global window event handlers for dynamic mode switching, unit toggling, question count switching,
 * shuffling, explanation drawers, and direct narrative block navigation.
 */
export function initGcseDoNowEngine(currentLesson, activeUnit, db, isKs3 = null) {
  if (typeof window === 'undefined') return;

  // Reset session overrides to guarantee fresh canonical lesson default state on load
  window.currentDoNowMode = 'previous';
  window.currentDoNowCountOverride = null;

  window.currentGcseLesson = currentLesson;
  window.currentGcseActiveUnit = activeUnit;
  window.currentGcseDb = db || window.db || {};
  const isKs3Effective = isKs3 !== null ? isKs3 : isKs3Unit(activeUnit);
  window.isCurrentUnitKs3 = isKs3Effective;

  window.setDoNowQuestionCount = function (count) {
    saveQuestionCount(count);
    document.querySelectorAll('.btn-donow-count').forEach((btn) => {
      const isCur = parseInt(btn.dataset.donowCount, 10) === count;
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
    window.refreshCurrentGcseDoNow(false);
  };

  window.setGcseDoNowMode = function (mode) {
    const cleanMode = mode === 'all' ? 'other' : mode;
    saveDoNowMode(cleanMode);

    // 1. Update button active states and inline styles
    document.querySelectorAll('.btn-donow-mode').forEach((btn) => {
      const isCur = btn.dataset.donowMode === cleanMode || (cleanMode === 'other' && btn.dataset.donowMode === 'all');
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
      chipsWrapper.style.display = cleanMode === 'other' ? 'block' : 'none';
    }

    // 3. Sync count button active states (in case smart default adjusted)
    const isCurKs3 = !!window.isCurrentUnitKs3;
    const curCount = getSavedQuestionCount(isCurKs3, cleanMode);
    document.querySelectorAll('.btn-donow-count').forEach((btn) => {
      const isCur = parseInt(btn.dataset.donowCount, 10) === curCount;
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

    // 4. Re-generate questions in canonical deterministic order
    window.refreshCurrentGcseDoNow(false);
  };

  window.selectGcseDoNowTarget = function (targetId) {
    const isCurKs3 = !!window.isCurrentUnitKs3;
    saveSelectedRetrievalTarget(targetId, isCurKs3);

    // Update chips HTML
    const chipsWrapper = document.getElementById('donow-gcse-unit-chips-wrapper');
    if (chipsWrapper) {
      chipsWrapper.innerHTML = renderGcseUnitChipsHTML(targetId, isCurKs3);
    }

    // Re-generate questions in canonical deterministic order
    window.refreshCurrentGcseDoNow(false);
  };

  window.toggleGcseDoNowUnit = function (toggledUnitId) {
    window.selectGcseDoNowTarget(toggledUnitId);
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

    // If the student or teacher is ALREADY viewing this lesson, jump smoothly without opening a tab
    const curUnitId = window.currentUnitId || window.currentGcseActiveUnit?.id;
    const curLessonIdx = (typeof window.currentLessonIndex === 'number')
      ? window.currentLessonIndex
      : (window.appStore && window.appStore.state ? window.appStore.state.currentLessonIndex : -1);

    if (curUnitId === cleanUnitId && curLessonIdx === lessonIdx) {
      if (typeof window.jumpToNarrativeBlock === 'function') {
        window.jumpToNarrativeBlock(targetStage);
      }
      return;
    }

    const targetUrl = `?view=lessons&unit=${cleanUnitId}&lesson=${lessonIdx + 1}&stage=${targetStage}`;
    
    // Store in sessionStorage so it is preserved across tab opening or navigation
    try {
      sessionStorage.setItem('hh_pending_narrative_jump', JSON.stringify({ stageNum: targetStage }));
    } catch (e) {}

    // Always open in a separate tab so the student or teacher NEVER loses their place,
    // countdown timer, or revealed answers on their active Do Now retrieval starter!
    const newWin = window.open(targetUrl, '_blank');
    if (newWin) {
      newWin.focus();
    } else {
      window.location.href = targetUrl;
    }
  };

  window.refreshCurrentGcseDoNow = function (forceShuffle = false) {
    const lesson = window.currentGcseLesson;
    const activeUnit = window.currentGcseActiveUnit;
    const db = window.currentGcseDb || window.db || {};
    const curUnitId = activeUnit?.id || window.currentUnitId;
    const isCurKs3 = !!window.isCurrentUnitKs3 || isKs3Unit(activeUnit, curUnitId);
    const mode = getSavedDoNowMode();
    const target = getSelectedRetrievalTarget(isCurKs3);
    const count = getSavedQuestionCount(isCurKs3, mode);
    const seed = forceShuffle ? Math.floor(Math.random() * 1000000) : null;

    let result;
    if (mode === 'current') {
      result = getCurrentLessonQuestions(activeUnit, lesson, seed, count);
    } else if (mode === 'unit') {
      result = getUnitInterleavedQuestions(activeUnit, lesson, seed, count);
    } else if (mode === 'other' || mode === 'all') {
      result = getSynopticGcseQuestions(activeUnit, lesson, db, target, seed, count);
    } else {
      result = getPreviousLessonQuestions(activeUnit, lesson, seed, count);
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
