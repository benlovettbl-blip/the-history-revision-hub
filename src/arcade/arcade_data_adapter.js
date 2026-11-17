/**
 * Universal Revision Arcade — Curriculum Data Adapter (v2 — Play-Tested & Zero-Truncation)
 * Dynamically extracts clean, unambiguous, zero-truncation pools for all 7 Arcade Games
 * across all 18 KS2, KS3, and GCSE units.
 */

import { generateQuestionId } from '../storage.js';
import { getAssetUrl } from '../engine/assets.js';

const MONTH_OFFSETS = {
  jan: 0.01,
  feb: 0.02,
  mar: 0.03,
  apr: 0.04,
  may: 0.05,
  jun: 0.06,
  jul: 0.07,
  aug: 0.08,
  sep: 0.09,
  sept: 0.09,
  oct: 0.1,
  nov: 0.11,
  dec: 0.12,
};

export function stripCleanText(raw) {
  if (!raw) return '';
  return String(raw)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[\d+\.\d+(?:[–\-]\d+\.\d+)?\]/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&lsquo;|&rsquo;|&#39;/g, "'")
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&bull;/g, '•')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function cleanLessonTitle(rawTitle, fallbackIndex = 0) {
  const clean = stripCleanText(rawTitle || `Enquiry ${fallbackIndex + 1}`);
  return (
    clean
      .replace(/^(?:Key\s*Topic\s*\d+(?:\.\d+)?|KT\s*\d+\.\d+|Topic\s*\d+\.\d+|Enquiry\s*\d+|Lesson\s*\d+)\s*[:\-–—]\s*/i, '')
      .trim() || clean
  );
}

export function shuffleList(arr) {
  const copy = [...(arr || [])];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Strips parenthetical translations/dates ("Lebensborn (Spring of Life)" -> "Lebensborn",
 * "The Enabling Act (1933)" -> "Enabling Act") so Arcade blocks, tiles, and letter slots stay punchy.
 */
export function extractCoreKeyword(rawTerm, stripLeadingArticle = true) {
  if (!rawTerm) return '';
  let t = stripCleanText(rawTerm);
  // If formatted like "DAP (German Workers' Party)" where before-paren is a tiny 2-4 char acronym,
  // keep the short acronym for Tetris, or allow caller to choose.
  const withoutParen = t.replace(/\s*\([^)]*\)/g, '').trim();
  if (withoutParen.length >= 2) {
    t = withoutParen;
  }
  // Remove surrounding quotes
  t = t.replace(/^["']+|["']+$/g, '').trim();
  if (stripLeadingArticle) {
    t = t.replace(/^(?:The|A|An)\s+/i, '').trim();
  }
  return t;
}

/**
 * For Redacted! SPaG dossiers, if a term is a tiny 2-3 letter acronym with a full name in parens
 * like "DAP (German Workers' Party)" or "DNA (Deoxyribonucleic Acid)", prefer a real spellable word
 * or skip tiny acronyms.
 */
function extractSpellableTerm(rawTerm) {
  if (!rawTerm) return '';
  const clean = stripCleanText(rawTerm);
  let candidate = clean.replace(/\s*\([^)]*\)/g, '').trim();
  candidate = candidate.replace(/^["']+|["']+$/g, '').replace(/^(?:The|A|An)\s+/i, '').trim();

  // Reject if contains digits or weird symbols (only letters, spaces, hyphens allowed in spelling boxes)
  if (/[^a-zA-Z\s\-]/.test(candidate)) return '';
  const words = candidate.split(/\s+/).filter(Boolean);
  const lettersOnly = candidate.replace(/[^a-zA-Z]/g, '');
  if (lettersOnly.length < 5 || candidate.length > 20 || words.length > 3) return '';
  return candidate;
}

export function parseHistoricalDate(rawDate) {
  if (!rawDate) return null;
  const text = stripCleanText(rawDate);
  if (!text) return null;

  const yearMatch = text.match(/\b(1\d{3}|20\d{2}|[5-9]\d{2})\b/);
  if (!yearMatch) return null;

  const baseYear = parseInt(yearMatch[1], 10);
  if (isNaN(baseYear) || baseYear < 400 || baseYear > 2035) return null;

  let offset = 0;
  const monthMatch = text
    .toLowerCase()
    .match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sept|sep|oct|nov|dec)[a-z]*\b/);
  if (monthMatch && MONTH_OFFSETS[monthMatch[1]]) {
    offset += MONTH_OFFSETS[monthMatch[1]];
    const dayMatch = text.match(
      /\b([1-2]?\d|3[01])\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    );
    if (dayMatch) {
      offset += parseInt(dayMatch[1], 10) * 0.00025;
    }
  }

  return {
    numeric: Number((baseYear + offset).toFixed(5)),
    baseYear,
    display: text.length > 22 ? String(baseYear) : text,
  };
}

export function maskDatesInText(text) {
  if (!text) return '';
  let out = stripCleanText(text)
    // Remove parenthetical dates like (1348), (June 1967), (c.1250–1500)
    .replace(
      /\(\s*(?:c\.?\s*)?(?:(?:\d{1,2}\s+)?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s*)?(?:1\d{3}|20\d{2}|[5-9]\d{2})(?:\s*[–\-—]\s*(?:1\d{3}|20\d{2}|\d{2,3}))?\s*\)/gi,
      '',
    )
    // Remove leading/inline prepositional full dates like "On 15 June 1215, " or "In September 1939 "
    .replace(
      /\b(?:On|In|During|By|From|After|Before)\s+(?:c\.?\s*)?(?:\d{1,2}\s+)?(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(?:1\d{3}|20\d{2})\s*,?\s*/gi,
      '',
    )
    // Remove standalone month + year like "15 June 1215" or "September 1939"
    .replace(
      /\b(?:\d{1,2}\s+)?(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(?:1\d{3}|20\d{2})\b/gi,
      '',
    )
    // Remove year ranges like 1914–1918
    .replace(/\b(?:c\.?\s*)?(?:1\d{3}|20\d{2})\s*[–\-—]\s*(?:1\d{3}|20\d{2}|\d{2})\b/g, '')
    // Remove leading/inline prepositional years like "In 1066, " or "in 1348"
    .replace(/\b(?:In|By|During|After|Before|Since|From)\s+(?:c\.?\s*)?(?:1\d{3}|20\d{2})\s*,?\s*/gi, '')
    // Remove any remaining standalone 4-digit years (1000–2029) so zero date spoilers leak
    .replace(/\b(?:c\.?\s*)?(?:1\d{3}|20[0-2]\d)\b/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/^[,;:\-–—\s]+/, '')
    .trim();

  if (out.length > 0) {
    out = out.charAt(0).toUpperCase() + out.slice(1);
  }
  return out;
}

/**
 * Extracts ONE complete, grammatically intact sentence (ZERO mid-word or mid-sentence chopping!).
 */
export function extractCompleteSentence(rawText) {
  const clean = maskDatesInText(rawText);
  if (!clean) return '';
  const protectedStr = clean
    .replace(/(\d)\.(\d)/g, '$1_DOT_$2')
    .replace(/\b(c|ca|Dr|Prof|St|Mr|Mrs|Gen|Lt|Col|Capt|Sgt|No|Nr|Cmd|Vol|e\.g|i\.e|vs)\.\s+/gi, '$1_DOT_ ')
    .replace(/\b([A-Z])\.\s+/g, '$1_DOT_ ');

  const match = protectedStr.match(/^([^.!?]+[.!?])/);
  if (match) {
    return match[1].replace(/_DOT_/g, '.').trim();
  }
  return clean.endsWith('.') ? clean : `${clean}.`;
}

/**
 * Cleans lesson title for Timeline Blitz so it NEVER leaks years like "(1348)" or "(1381)" or ": How did..."!
 */
function cleanSpoilerFreeTopic(lessonTitle) {
  const withoutQuestion = String(lessonTitle || '').split(':')[0];
  return maskDatesInText(withoutQuestion).replace(/[?]+$/, '').trim() || 'Historical Turning Point';
}

export function maskTermInClue(clue, rawTerm, coreTerm = '') {
  if (!clue) return '';
  let out = stripCleanText(clue);
  const targets = [rawTerm, coreTerm].filter(Boolean);
  targets.forEach((t) => {
    const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (escaped.length >= 3) {
      out = out.replace(new RegExp(escaped, 'gi'), '[REDACTED]');
    }
    t.split(/[\s\-()]+/)
      .filter((w) => w.length >= 5 && !/^(party|act|law|war|group|system|theory|court)$/i.test(w))
      .forEach((word) => {
        const wEsc = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        out = out.replace(new RegExp(`\\b${wEsc}\\b`, 'gi'), '[REDACTED]');
      });
  });
  return out;
}

function isQuestionOrVagueHeading(title) {
  if (!title) return true;
  const t = title.trim();
  if (t.endsWith('?')) return true;
  if (/^(?:How|Why|What|Were|Did|Was|Who|Which|To what extent)\b/i.test(t)) return true;
  if (/^(?:Overview|Introduction|Summary|Conclusion|Key Event)$/i.test(t)) return true;
  return false;
}

function normalizeLessonQuizItem(rawQ, unitId, lessonTitle) {
  const qText = stripCleanText(rawQ.question || rawQ.q || '');
  if (!qText || qText === 'Who is this historical figure?') return null;

  let options = Array.isArray(rawQ.options)
    ? rawQ.options.map((o) => stripCleanText(o)).filter(Boolean)
    : [];
  let correctText = '';

  const rawAns = rawQ.answer !== undefined ? rawQ.answer : rawQ.a;
  if (typeof rawAns === 'number' && options[rawAns]) {
    correctText = options[rawAns];
  } else if (typeof rawAns === 'string') {
    correctText = stripCleanText(rawAns);
    if (options.length === 0 && Array.isArray(rawQ.distractors)) {
      options = shuffleList([
        correctText,
        ...rawQ.distractors.map((d) => stripCleanText(d)).filter(Boolean),
      ]);
    }
  }

  if (!correctText) return null;
  if (options.length > 0 && !options.some((o) => o.toLowerCase() === correctText.toLowerCase())) {
    options = [correctText, ...options.slice(0, 3)];
  }
  const distractors = options.filter((o) => o.toLowerCase() !== correctText.toLowerCase());
  if (distractors.length === 0) return null;

  return {
    id: generateQuestionId(unitId, lessonTitle, qText),
    q: qText,
    a: correctText,
    distractors: distractors.slice(0, 3),
    options: [correctText, ...distractors.slice(0, 3)],
    explanation: stripCleanText(rawQ.explanation || rawQ.historian_explanation || ''),
    source: lessonTitle,
  };
}

export function buildArcadePools(unitData, unitId = 'unit', scopeLesson = 'all') {
  const allLessons = (unitData && (unitData.lessons || unitData.subtopics)) || [];
  const isSingleLesson =
    scopeLesson !== 'all' &&
    scopeLesson !== null &&
    scopeLesson !== undefined &&
    !isNaN(parseInt(scopeLesson, 10)) &&
    Boolean(allLessons[parseInt(scopeLesson, 10)]);

  const selectedLessons = isSingleLesson
    ? [{ lesson: allLessons[parseInt(scopeLesson, 10)], idx: parseInt(scopeLesson, 10) }]
    : allLessons.map((lesson, idx) => ({ lesson, idx }));

  const unitWideVocab = [];
  allLessons.forEach((l, idx) => {
    const lTitle = cleanLessonTitle(l.title, idx);
    (l.vocab || []).forEach((v) => {
      const term = stripCleanText(v.term || v.word || '');
      const coreTerm = extractCoreKeyword(term, true);
      const def = stripCleanText(v.definition || v.def || '');
      if (term && coreTerm && def) {
        unitWideVocab.push({
          term,
          coreTerm,
          definition: def,
          syllables: stripCleanText(v.syllables || ''),
          lessonTitle: lTitle,
          lessonIdx: idx,
        });
      }
    });
  });

  const scopedVocab = [];
  const rawSprintQuiz = [];

  selectedLessons.forEach(({ lesson, idx }) => {
    const lTitle = cleanLessonTitle(lesson.title, idx);
    (lesson.vocab || []).forEach((v) => {
      const term = stripCleanText(v.term || v.word || '');
      const coreTerm = extractCoreKeyword(term, true);
      const def = stripCleanText(v.definition || v.def || '');
      if (term && coreTerm && def) {
        scopedVocab.push({
          id: generateQuestionId(unitId, lTitle, `vocab_${term}`),
          term,
          coreTerm,
          definition: def,
          syllables: stripCleanText(v.syllables || ''),
          lessonTitle: lTitle,
          lessonIdx: idx,
        });
      }
    });

    const rawQuizzes = [
      ...(lesson.quiz || lesson.quick_quiz || lesson.quiz_questions || []),
      ...(lesson.exam_clinic || []),
    ];
    rawQuizzes.forEach((rq) => {
      const norm = normalizeLessonQuizItem(rq, unitId, lTitle);
      if (norm) rawSprintQuiz.push({ ...norm, lessonIdx: idx });
    });
  });

  const uniqueVocab = scopedVocab.filter(
    (v, i, arr) => arr.findIndex((x) => x.coreTerm.toLowerCase() === v.coreTerm.toLowerCase()) === i,
  );
  const uniqueQuiz = rawSprintQuiz.filter(
    (q, i, arr) => arr.findIndex((x) => x.q.toLowerCase() === q.q.toLowerCase()) === i,
  );

  // =========================================================
  // GAME 1 POOL: KEYWORD STACK ("HISTORY TETRIS" — ZERO TRUNCATION)
  // Uses pure core keywords (<= 22 chars, max 3 words) so blocks NEVER truncate!
  // =========================================================
  const validBlockKeywords = unitWideVocab
    .map((v) => v.coreTerm)
    .filter((k, i, arr) => {
      const words = k.split(/\s+/);
      return (
        k.length >= 2 &&
        k.length <= 22 &&
        words.length <= 3 &&
        words.every((w) => w.length <= 15) &&
        arr.findIndex((x) => x.toLowerCase() === k.toLowerCase()) === i
      );
    });

  const tetrisVocabSource = uniqueVocab.length >= 5 ? uniqueVocab : unitWideVocab.map((v) => ({
    ...v,
    id: generateQuestionId(unitId, v.lessonTitle, `vocab_${v.term}`),
  }));

  const tetrisPool = [];
  tetrisVocabSource.forEach((v) => {
    const words = v.coreTerm.split(/\s+/);
    if (v.coreTerm.length >= 2 && v.coreTerm.length <= 22 && words.length <= 3 && words.every((w) => w.length <= 15)) {
      const distractors = shuffleList(
        validBlockKeywords.filter((t) => t.toLowerCase() !== v.coreTerm.toLowerCase()),
      ).slice(0, 3);
      if (distractors.length >= 2) {
        tetrisPool.push({
          id: v.id,
          q: maskTermInClue(v.definition, v.term, v.coreTerm),
          a: v.term,
          correctBlock: v.coreTerm.toUpperCase(),
          distractorBlocks: distractors.map((d) => d.toUpperCase()),
          explanation: `${v.term}: ${v.definition}`,
          source: v.lessonTitle,
        });
      }
    }
  });

  // =========================================================
  // GAME 2 POOL: TIMELINE BLITZ (1 DISTINCT EVENT PER YEAR — NO QUESTIONS)
  // =========================================================
  const rawMilestones = [];
  const timelineLessonSource = isSingleLesson
    ? [
        ...selectedLessons,
        ...allLessons.map((lesson, idx) => ({ lesson, idx, isUnitBonus: true })),
      ]
    : selectedLessons;

  timelineLessonSource.forEach(({ lesson, idx, isUnitBonus }) => {
    const lTitle = cleanLessonTitle(lesson.title, idx);
    const safeTopic = cleanSpoilerFreeTopic(lTitle);

    (lesson.timeline_anchor || []).forEach((ta) => {
      const parsed = parseHistoricalDate(ta.year || ta.date);
      const title = maskDatesInText(ta.title || ta.event || '');
      const detail = extractCompleteSentence(ta.summary || ta.desc || '');
      if (parsed && title && !isQuestionOrVagueHeading(title)) {
        rawMilestones.push({
          id: generateQuestionId(unitId, lTitle, `tl_${parsed.baseYear}_${title}`),
          numeric: parsed.baseYear,
          baseYear: parsed.baseYear,
          dateDisplay: String(parsed.baseYear),
          title,
          detail,
          lessonTitle: safeTopic,
          priority: isUnitBonus ? 2 : 1,
        });
      }
    });

    const dominoStages = lesson.causal_domino_spine?.stages || [];
    dominoStages.forEach((ds) => {
      const parsed = parseHistoricalDate(ds.date);
      const title = maskDatesInText(ds.title || '');
      const detail = extractCompleteSentence(ds.trigger || ds.desc || '');
      if (parsed && title && !isQuestionOrVagueHeading(title)) {
        rawMilestones.push({
          id: generateQuestionId(unitId, lTitle, `dom_${parsed.baseYear}_${title}`),
          numeric: parsed.baseYear,
          baseYear: parsed.baseYear,
          dateDisplay: String(parsed.baseYear),
          title,
          detail,
          lessonTitle: safeTopic,
          priority: isUnitBonus ? 2 : 1,
        });
      }
    });

    (lesson.workbook_stages || []).forEach((ws) => {
      const parsed =
        parseHistoricalDate(ws.date || ws.dates) ||
        parseHistoricalDate(ws.title || ws.heading);
      const title = maskDatesInText(ws.title || ws.heading || '');
      const wordTerms = (ws.bullets || (ws.words || []).map((w) => w.term || w)).filter(Boolean);
      const detail = maskDatesInText(wordTerms.join(' • '));
      if (parsed && title && !isQuestionOrVagueHeading(title)) {
        rawMilestones.push({
          id: generateQuestionId(unitId, lTitle, `wb_${parsed.baseYear}_${title}`),
          numeric: parsed.baseYear,
          baseYear: parsed.baseYear,
          dateDisplay: String(parsed.baseYear),
          title,
          detail,
          lessonTitle: safeTopic,
          priority: isUnitBonus ? 2 : 1,
        });
      }
    });

    (lesson.narrative_blocks || []).forEach((nb) => {
      const rawHead = nb.title || nb.heading || nb.theme || '';
      const parsed =
        parseHistoricalDate(rawHead) ||
        parseHistoricalDate((nb.text || nb.content || '').slice(0, 140));
      const title = maskDatesInText(rawHead);
      if (parsed && title && title.length >= 5 && !isQuestionOrVagueHeading(title)) {
        rawMilestones.push({
          id: generateQuestionId(unitId, lTitle, `nb_${parsed.baseYear}_${title}`),
          numeric: parsed.baseYear,
          baseYear: parsed.baseYear,
          dateDisplay: String(parsed.baseYear),
          title,
          detail: '',
          lessonTitle: safeTopic,
          priority: isUnitBonus ? 3 : 2,
        });
      }
    });
  });

  // Deduplicate strictly by calendar year (`baseYear`) so players NEVER face unfair "Sept 1 1939 vs Autumn 1939" clashes!
  const seenYears = new Set();
  const timelinePool = [];
  rawMilestones
    .sort((a, b) => a.priority - b.priority)
    .forEach((m) => {
      if (m.title.length < 5 || seenYears.has(m.baseYear)) return;
      seenYears.add(m.baseYear);
      timelinePool.push(m);
    });

  // =========================================================
  // GAME 3 POOL: CONNECTIONS WALL (PURE VOCAB ACROSS 4 SPACED ENQUIRIES)
  // =========================================================
  const connectionsBoards = buildCleanConnectionsBoards(allLessons);

  // =========================================================
  // GAME 4 POOL: REDACTED! (CLEAN A–Z KEYWORDS ONLY, NO YEARS OR PARENS)
  // =========================================================
  const redactedSource =
    uniqueVocab.length >= 4
      ? uniqueVocab
      : unitWideVocab.map((v) => ({
          ...v,
          id: generateQuestionId(unitId, v.lessonTitle, `vocab_${v.term}`),
        }));

  const redactedPool = redactedSource
    .map((v) => {
      const spellable = extractSpellableTerm(v.term);
      if (!spellable) return null;
      return {
        id: v.id,
        term: spellable.toUpperCase(),
        displayTerm: v.term,
        cluePrimary: maskTermInClue(v.definition, v.term, spellable),
        clueTopic: `Enquiry Topic: ${v.lessonTitle}`,
        clueStructure: v.syllables
          ? `Syllable Guide: ${v.syllables}`
          : `Starts with "${spellable[0].toUpperCase()}" • Ends with "${spellable[spellable.length - 1].toUpperCase()}"`,
        fullDefinition: v.definition,
        source: v.lessonTitle,
      };
    })
    .filter(Boolean);

  // =========================================================
  // GAME 5 POOL: 60s BOSS SPRINT (SNAPPY <= 95 CHAR OPTIONS ONLY)
  // =========================================================
  const sprintPool = uniqueQuiz.filter((q) => q.options.every((o) => o.length <= 95));
  uniqueVocab.forEach((v) => {
    if (v.coreTerm.length <= 32) {
      const wrongTerms = shuffleList(
        unitWideVocab
          .filter((uv) => uv.coreTerm.toLowerCase() !== v.coreTerm.toLowerCase() && uv.coreTerm.length <= 32)
          .map((uv) => uv.coreTerm),
      ).slice(0, 3);
      if (wrongTerms.length === 3) {
        sprintPool.push({
          id: v.id,
          q: `Which key term matches: "${maskTermInClue(v.definition, v.term, v.coreTerm)}"?`,
          a: v.coreTerm,
          distractors: wrongTerms,
          options: [v.coreTerm, ...wrongTerms],
          explanation: `${v.term}: ${v.definition}`,
          source: v.lessonTitle,
        });
      }
    }
  });

  // =========================================================
  // GAME 6 POOL: ARCHIVE DETECTIVE (ZERO MID-WORD TRUNCATION)
  // =========================================================
  const detectivePool = buildArchiveDetectivePool(allLessons, selectedLessons, unitId);

  // =========================================================
  // GAME 7 POOL: FACT OR FALLACY (ZERO [████] MASKS, CRISP STRUCTURE)
  // =========================================================
  const mythPool = buildMythbusterPool(uniqueVocab, unitWideVocab, sprintPool, unitId);

  return {
    unitId,
    unitTitle: stripCleanText(unitData?.title || 'History Revision'),
    scopeLesson,
    isSingleLesson,
    lessonsList: allLessons.map((l, idx) => ({
      index: idx,
      id: l.id || `lesson_${idx + 1}`,
      title: cleanLessonTitle(l.title, idx),
    })),
    tetrisPool,
    timelinePool,
    connectionsBoards,
    redactedPool,
    sprintPool,
    detectivePool,
    mythPool,
  };
}

function buildCleanConnectionsBoards(allLessons) {
  const boards = [];
  const palette = [
    { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.16)', border: '#f59e0b' },
    { color: '#10b981', bg: 'rgba(16, 185, 129, 0.16)', border: '#10b981' },
    { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.16)', border: '#3b82f6' },
    { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.16)', border: '#a855f7' },
  ];

  const lessonBuckets = [];
  allLessons.forEach((l, idx) => {
    const lTitle = cleanLessonTitle(l.title, idx);
    const terms = [];

    // Primary: authentic lesson.vocab terms (clean, recognisable historical concepts)
    (l.vocab || []).forEach((v) => {
      const cleanT = extractCoreKeyword(v.term || v.word || '', false);
      if (cleanT.length >= 2 && cleanT.length <= 32 && !terms.includes(cleanT)) {
        terms.push(cleanT);
      }
    });

    // Fallback only if a lesson has < 4 vocab items: pull named `workbook_stages.words[].term` (never Anchor dates or bullets)
    if (terms.length < 4) {
      (l.workbook_stages || []).forEach((ws) => {
        (ws.words || []).forEach((w) => {
          const cleanW = extractCoreKeyword(w.term || '', false);
          if (cleanW.length >= 3 && cleanW.length <= 30 && !terms.includes(cleanW)) {
            terms.push(cleanW);
          }
        });
      });
    }

    if (terms.length >= 4) {
      lessonBuckets.push({ title: lTitle, pool: terms, lessonIdx: idx });
    }
  });

  if (lessonBuckets.length < 4) return boards;

  // Pick well-spaced lessons across the unit so adjacent overlapping topics aren't mixed on the same wall
  for (let bIdx = 0; bIdx < 6; bIdx++) {
    const step = Math.max(1, Math.floor(lessonBuckets.length / 4));
    const orderedCandidates = [];
    for (let k = 0; k < lessonBuckets.length; k++) {
      orderedCandidates.push(lessonBuckets[(bIdx + k * step) % lessonBuckets.length]);
    }

    const usedTileStrings = new Set();
    const usedWords = new Set();
    const usedLessonIndices = new Set();
    const groups = [];

    for (const lb of orderedCandidates) {
      if (usedLessonIndices.has(lb.lessonIdx)) continue;
      const uniqueItems = shuffleList(lb.pool)
        .filter((item) => {
          const low = item.toLowerCase();
          if (usedTileStrings.has(low)) return false;
          // Prevent confusing cross-group word collisions (e.g. "Anton Drexler" in two groups)
          const sigWords = low.split(/\s+/).filter((w) => w.length >= 6);
          if (sigWords.some((w) => usedWords.has(w))) return false;
          return true;
        })
        .slice(0, 4);

      if (uniqueItems.length === 4) {
        usedLessonIndices.add(lb.lessonIdx);
        uniqueItems.forEach((item) => {
          const low = item.toLowerCase();
          usedTileStrings.add(low);
          low
            .split(/\s+/)
            .filter((w) => w.length >= 6)
            .forEach((w) => usedWords.add(w));
        });
        groups.push({
          title: lb.title,
          items: uniqueItems,
        });
        if (groups.length === 4) break;
      }
    }

    if (groups.length === 4) {
      boards.push(groups.map((g, idx) => ({ ...g, ...palette[idx] })));
    }
  }

  return boards;
}

function isValidRasterOrSvgPath(rawPath) {
  if (!rawPath || typeof rawPath !== 'string') return false;
  const clean = rawPath.split('?')[0].toLowerCase();
  return /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(clean);
}

/**
 * Formats a clean, COMPLETE visual plate title with ZERO mid-word or mid-parenthesis chopping!
 */
function balanceParentheses(str) {
  if (!str) return '';
  let s = str.trim();
  const opens = (s.match(/\(/g) || []).length;
  const closes = (s.match(/\)/g) || []).length;
  if (opens > closes) {
    const lastOpen = s.lastIndexOf('(');
    if (lastOpen !== -1) s = s.slice(0, lastOpen).trim();
  }
  return s.replace(/[,;:\-–—]+$/, '').trim();
}

function formatCompletePlateLabel(rawTitle, fallbackCaption = '') {
  let s = stripCleanText(rawTitle || '');
  s = s
    .replace(/^Source\s+[A-Z]\d*\s*(?:\([^)]+\))?\s*[:\-–—]\s*/i, '')
    .replace(/^Reference\s+Map\s*[:\-–—]\s*/i, 'Map: ')
    .trim();

  if (s.length > 95 && s.includes(' — ')) {
    const left = s.split(' — ')[0].trim();
    if (left.length >= 18) s = left;
  }

  if (s.length > 120 && s.includes(': ') && s.indexOf(': ') >= 18 && s.indexOf(': ') <= 90) {
    s = s.split(': ')[0].trim();
  }

  s = balanceParentheses(s);

  if (!s && fallbackCaption) {
    return extractShortCaptionSubject(fallbackCaption);
  }
  return s;
}

function extractShortCaptionSubject(caption) {
  const clean = stripCleanText(caption || '');
  if (!clean) return '';

  // Remove long parenthetical archive shelfmarks first so periods inside "(c. 1488, MS 3026C, f. 16r)" never break sentences
  let stripped = clean.replace(/\s*\([^)]*\)/g, '').trim();

  // Protect common abbreviations before splitting on sentence end
  const protectedStr = stripped
    .replace(/\b(c|ca|Dr|Prof|St|Mr|Mrs|Gen|Lt|Col|Capt|Sgt|No|Nr|Cmd|Vol|Fig|p|pp|f|fol)\.\s+/gi, '$1_DOT_ ')
    .replace(/\b([A-Z])\.\s+/g, '$1_DOT_ ');

  let first = protectedStr.split(/[.;]\s+/)[0].replace(/_DOT_/g, '.').trim();
  if (first.length > 95) {
    const clauseBreak = first.search(/,\s+(?:showing|depicting|illustrating|published|printed|painted|photographed|where|which)\b/i);
    if (clauseBreak > 16) first = first.slice(0, clauseBreak).trim();
  }
  return formatCompletePlateLabel(first, '');
}

function buildArchiveDetectivePool(allLessons, selectedLessons, unitId) {
  const extractPlatesFromLessons = (lessonEntries) => {
    const plates = [];
    const seenUrls = new Set();

    lessonEntries.forEach(({ lesson, idx }) => {
      const lTitle = cleanLessonTitle(lesson.title, idx);

      // 1. Primary Archival Visual Sources (Sources A–E) — highest visual specificity!
      (lesson.sources || []).forEach((s) => {
        const rawImg = s.image || s.src || s.img || s.image_url;
        const resolved = getAssetUrl(rawImg, unitId);
        if (!isValidRasterOrSvgPath(resolved) || seenUrls.has(resolved)) return;
        const rawTitle = stripCleanText(s.title || '');
        if (!rawTitle || /^Reference Map/i.test(rawTitle)) return;

        const caption = stripCleanText(s.caption || s.provenance || s.source_context || s.desc || '');
        const label = formatCompletePlateLabel(rawTitle, caption);
        if (!label || label.length < 6) return;

        seenUrls.add(resolved);
        plates.push({
          id: generateQuestionId(unitId, lTitle, `srcplate_${resolved}`),
          imageUrl: resolved,
          label,
          caption: caption || `${label} (${lTitle})`,
          lessonTitle: lTitle,
        });
      });

      // 2. Narrative Visual Support Plates — use literal caption subject (NOT literary section metaphors!)
      (lesson.narrative_blocks || []).forEach((b) => {
        const rawImg = b.image || b.img;
        const resolved = getAssetUrl(rawImg, unitId);
        if (!isValidRasterOrSvgPath(resolved) || seenUrls.has(resolved)) return;
        const caption = stripCleanText(b.caption || b.image_alt || '');
        if (!caption) return;

        const label = extractShortCaptionSubject(caption);
        if (!label || label.length < 8) return;

        seenUrls.add(resolved);
        plates.push({
          id: generateQuestionId(unitId, lTitle, `plate_${resolved}`),
          imageUrl: resolved,
          label,
          caption,
          lessonTitle: lTitle,
        });
      });
    });

    return plates;
  };

  const allUnitPlates = extractPlatesFromLessons(
    allLessons.map((lesson, idx) => ({ lesson, idx })),
  );
  let activePlates = extractPlatesFromLessons(selectedLessons);
  if (activePlates.length < 4) activePlates = allUnitPlates;

  const allLabels = allUnitPlates
    .map((p) => p.label)
    .filter((lbl, i, arr) => arr.findIndex((x) => x.toLowerCase() === lbl.toLowerCase()) === i);

  return activePlates
    .map((plate) => {
      const distractors = shuffleList(
        allLabels.filter((lbl) => lbl.toLowerCase() !== plate.label.toLowerCase()),
      ).slice(0, 3);
      if (distractors.length < 3) return null;
      return {
        ...plate,
        q: `Archive Detective: Identify this primary visual plate (${plate.lessonTitle})`,
        a: plate.label,
        options: shuffleList([plate.label, ...distractors]),
        explanation: plate.caption,
        source: plate.lessonTitle,
      };
    })
    .filter(Boolean);
}

function buildMythbusterPool(uniqueVocab, unitWideVocab, sprintPool, unitId) {
  const cards = [];
  const vocabSource = uniqueVocab.length >= 4 ? uniqueVocab : unitWideVocab;

  // 1. Vocab Definition Check Cards (Zero [████] redaction artifacts!)
  vocabSource.forEach((v, idx) => {
    cards.push({
      id: generateQuestionId(unitId, v.lessonTitle, `myth_true_${v.term}`),
      kind: 'vocab',
      topic: v.lessonTitle,
      promptLabel: 'DOES THIS DEFINITION MATCH THE TERM?',
      headline: v.term,
      claimText: v.definition,
      isFact: true,
      q: `True or False — "${v.term}": ${v.definition}`,
      a: 'FACT (True)',
      options: ['FACT (True)', 'FALLACY (Myth)'],
      explanation: `Verified Specification Fact — ${v.term}: ${v.definition}`,
      source: v.lessonTitle,
    });

    // Pick a foil whose definition does NOT mention its own term name (so it doesn't give itself away!)
    const others = unitWideVocab.filter(
      (o) =>
        o.coreTerm.toLowerCase() !== v.coreTerm.toLowerCase() &&
        !o.definition.toLowerCase().includes(o.coreTerm.toLowerCase()),
    );
    if (others.length > 0) {
      const foil = others[(idx * 3 + 1) % others.length];
      cards.push({
        id: generateQuestionId(unitId, v.lessonTitle, `myth_false_${v.term}_${foil.term}`),
        kind: 'vocab',
        topic: v.lessonTitle,
        promptLabel: 'DOES THIS DEFINITION MATCH THE TERM?',
        headline: v.term,
        claimText: foil.definition,
        isFact: false,
        q: `True or False — "${v.term}": ${foil.definition}`,
        a: 'FALLACY (Myth)',
        options: ['FACT (True)', 'FALLACY (Myth)'],
        explanation: `Myth Busted! That definition actually describes "${foil.term}". "${v.term}" means: ${v.definition}`,
        source: v.lessonTitle,
      });
    }
  });

  // 2. Quiz Claim Check Cards (Clean Question + Proposed Answer Box)
  sprintPool
    .filter((q) => !q.q.startsWith('Which key term matches:'))
    .slice(0, 24)
    .forEach((q, idx) => {
      const makeTrue = idx % 2 === 0;
      const proposed = makeTrue ? q.a : q.distractors?.[0];
      if (!proposed) return;
      cards.push({
        id: generateQuestionId(unitId, q.source, `myth_q_${makeTrue}_${q.q}`),
        kind: 'quiz',
        topic: q.source,
        promptLabel: 'IS THIS PROPOSED EXAM ANSWER ACCURATE?',
        headline: q.q,
        claimText: `Proposed Answer: "${proposed}"`,
        isFact: makeTrue,
        q: `${q.q} — Proposed Answer: "${proposed}"`,
        a: makeTrue ? 'FACT (True)' : 'FALLACY (Myth)',
        options: ['FACT (True)', 'FALLACY (Myth)'],
        explanation: makeTrue
          ? q.explanation || `Confirmed: "${q.a}" is historically accurate.`
          : `Myth Busted! "${proposed}" is incorrect. The true answer is "${q.a}". ${q.explanation || ''}`.trim(),
        source: q.source,
      });
    });

  return shuffleList(cards);
}
