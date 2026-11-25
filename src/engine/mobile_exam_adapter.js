/**
 * src/engine/mobile_exam_adapter.js
 *
 * Mobile Exam Trainer Data Adapter & Drill Synthesizer for Pearson Edexcel GCSE (9–1) History.
 * Aggregates and normalizes canonical lesson exam questions, unseen mock bank items,
 * and past-paper curriculum benchmarks across all 6 GCSE courses into scannable
 * Key Topic directories, clean student tariff badges, segmented Grade 9 WAGOLLs,
 * and 4 zero-jump interactive exam drills.
 */

import { ensureUnitLoaded } from '../storage.js';
import {
  getCanonicalGcsePaperCode,
  getNonDuplicateExtraMockQuestions,
} from './lesson_exam_practice_panel.js';

const STORAGE_PINNED_UNITS = 'hh_pinned_units';

export const GCSE_EXAM_COURSES = [
  {
    id: 'cme_new',
    pillLabel: 'Middle East',
    shortTitle: 'Conflict in the Middle East',
    fullTitle: 'Conflict in the Middle East, 1945–95',
    paperLabel: 'Paper 2 · Period Study',
    optionCode: 'Option P5 (1HI0/P5)',
  },
  {
    id: 'edexcel_medicine',
    pillLabel: 'Medicine',
    shortTitle: 'Medicine Through Time',
    fullTitle: 'Medicine Through Time, c.1250–Present',
    paperLabel: 'Paper 1 · Thematic & Historic Environment',
    optionCode: 'Option 11 (1HI0/11)',
  },
  {
    id: 'weimar_nazi_germany',
    pillLabel: 'Weimar',
    shortTitle: 'Weimar & Nazi Germany',
    fullTitle: 'Weimar & Nazi Germany, 1918–39',
    paperLabel: 'Paper 3 · Modern Depth Study',
    optionCode: 'Option 31 (1HI0/31)',
  },
  {
    id: 'gcse_cold_war',
    pillLabel: 'Cold War',
    shortTitle: 'Superpower Relations & Cold War',
    fullTitle: 'Superpower Relations & the Cold War, 1941–91',
    paperLabel: 'Paper 2 · Period Study',
    optionCode: 'Option P4 (1HI0/P4)',
  },
  {
    id: 'eee',
    pillLabel: 'Elizabeth',
    shortTitle: 'Early Elizabethan England',
    fullTitle: 'Early Elizabethan England, 1558–88',
    paperLabel: 'Paper 2 · British Depth Study',
    optionCode: 'Option B4 (1HI0/B4)',
  },
  {
    id: 'usa',
    pillLabel: 'USA',
    shortTitle: 'USA: Conflict at Home & Abroad',
    fullTitle: 'USA: Conflict at Home & Abroad, 1954–75',
    paperLabel: 'Paper 3 · Modern Depth Study',
    optionCode: 'Option 33 (1HI0/33)',
  },
];

export const TARIFF_FILTERS = [
  { key: 'all', label: 'All' },
  { key: '4m', label: '4m' },
  { key: '8m', label: '8m' },
  { key: '12m', label: '12m' },
  { key: '16m', label: '16m' },
];

const GCSE_COURSE_MAP = new Map(GCSE_EXAM_COURSES.map((c) => [c.id, c]));

const GCSE_UNIT_ALIASES = {
  gcse_middle_east_1945_1995_new: 'cme_new',
  gcse_middle_east_1945_1995: 'cme_new',
  middle_east: 'cme_new',
  medicine: 'edexcel_medicine',
  medicine_through_time: 'edexcel_medicine',
  weimar: 'weimar_nazi_germany',
  germany: 'weimar_nazi_germany',
  gcse_elizabethan_england: 'eee',
  elizabethan_england: 'eee',
  elizabeth: 'eee',
  gcse_usa_1954_1975: 'usa',
  gcse_usa: 'usa',
};

const CANONICAL_KT_TITLES = {
  cme_new: {
    KT1: 'The Birth of Israel, 1945–57',
    KT2: 'Escalating Conflict, 1957–73',
    KT3: 'Attempts at Peace, 1973–95',
  },
  edexcel_medicine: {
    KT1: 'Medicine in Medieval England, c.1250–c.1500',
    KT2: 'The Medical Renaissance in England, c.1500–c.1700',
    KT3: 'Medicine in 18th & 19th-Century Britain, c.1700–c.1900',
    KT4: 'Medicine in Modern Britain, c.1900–Present',
    KT5: 'The British Sector of the Western Front, 1914–18',
  },
  weimar_nazi_germany: {
    KT1: 'The Weimar Republic, 1918–29',
    KT2: 'Hitler’s Rise to Power, 1919–33',
    KT3: 'Nazi Control & Dictatorship, 1933–39',
    KT4: 'Life in Nazi Germany, 1933–39',
  },
  gcse_cold_war: {
    KT1: 'Origins of the Cold War, 1941–58',
    KT2: 'Cold War Crises, 1958–70',
    KT3: 'The End of the Cold War, 1970–91',
  },
  eee: {
    KT1: 'Queen, Government & Religion, 1558–69',
    KT2: 'Challenges to Elizabeth at Home & Abroad, 1569–88',
    KT3: 'Elizabethan Society in the Age of Exploration, 1558–88',
  },
  usa: {
    KT1: 'Development of the Civil Rights Movement, 1954–60',
    KT2: 'Protest, Progress & Radicalism, 1960–75',
    KT3: 'US Involvement in the Vietnam War, 1954–75',
    KT4: 'Reactions to US Involvement in Vietnam, 1964–75',
  },
};

const directoryCache = new Map();

function normalizeAlias(rawId) {
  const cleaned = String(rawId || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '');
  if (!cleaned) return '';
  return GCSE_UNIT_ALIASES[cleaned] || cleaned;
}

export function isSupportedGcseUnit(unitId) {
  return GCSE_COURSE_MAP.has(normalizeAlias(unitId));
}

export function getPinnedGcseCourseIds() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_PINNED_UNITS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out = [];
    for (const item of parsed) {
      const norm = normalizeAlias(item);
      if (GCSE_COURSE_MAP.has(norm) && !out.includes(norm)) {
        out.push(norm);
      }
    }
    return out;
  } catch (e) {
    return [];
  }
}

export function resolveGcseExamUnitId(rawUnitId) {
  const norm = normalizeAlias(rawUnitId);
  if (GCSE_COURSE_MAP.has(norm)) return norm;
  const pinnedGcse = getPinnedGcseCourseIds();
  if (pinnedGcse.length > 0) return pinnedGcse[0];
  return 'cme_new';
}

export function getGcseCourseMeta(unitId) {
  const resolved = resolveGcseExamUnitId(unitId);
  return GCSE_COURSE_MAP.get(resolved) || GCSE_EXAM_COURSES[0];
}

function stripHtml(raw) {
  return String(raw || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&bull;/gi, '•')
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—')
    .replace(/&rsquo;/gi, '’')
    .replace(/&lsquo;/gi, '‘')
    .replace(/&ldquo;/gi, '“')
    .replace(/&rdquo;/gi, '”')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function convertMarkdownInlineToHtml(raw) {
  if (!raw) return '';
  let s = String(raw);
  // Convert **bold** and *italic* cleanly so raw asterisks never leak into HTML views
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s(>])\*([^*\n]+)\*(?=[\s.,;:!?)<]|$)/g, '$1<em>$2</em>');
  return s;
}

function cleanQuestionStem(rawQuestion) {
  let s = stripHtml(convertMarkdownInlineToHtml(rawQuestion || ''));
  // Remove leading numbering like "1.", "1(a).", "Question 3(a):" while keeping core wording
  s = s.replace(/^(?:question\s*\d+(?:\s*\([a-d]\))?[\s.:–-]*)/i, '');
  s = s.replace(/^(?:\d+\s*(?:\([a-d]\))?[\s.:–-]+)/i, '');
  // Remove trailing [4 marks], (8 marks), [16 marks (+4 SPaG)] etc.
  s = s.replace(/\s*[\[(]\s*\d+\s*(?:\+\s*\d+\s*)?marks?(?:\s*\(\+?\d+\s*spag\))?\s*[\])]\.?$/i, '');
  return s.replace(/\s+/g, ' ').trim();
}

/**
 * Normalizes any raw Edexcel GCSE question object into student-friendly tariff metadata.
 * Never exposes internal enum strings like `NARRATIVE_8` or `evaluative_essay_16m`.
 */
export function normalizeExamTariff(qObj = {}) {
  const rawType = String(qObj.type || qObj.questionType || '').toLowerCase();
  const rawTariff = String(qObj.tariff || '').toLowerCase();
  const rawText = String(qObj.question || qObj.questionText || qObj.drivingQuestion || qObj.text || '').toLowerCase();
  const combined = `${rawType} ${rawTariff} ${rawText}`;

  const parsedNum =
    parseInt(qObj.marks, 10) ||
    parseInt(qObj.tariff, 10) ||
    ((rawTariff.match(/(\d+)/) || [])[1] ? parseInt(rawTariff.match(/(\d+)/)[1], 10) : 0);

  const hasSpag =
    Boolean(qObj.spagMarks || qObj.spag_marks) ||
    /spag|16\s*\+\s*4/.test(combined);

  // 16-mark Judgement / Interpretation Essay
  if (
    parsedNum >= 16 ||
    rawType.includes('16') ||
    rawType.includes('verdict') ||
    rawType.includes('evaluative') ||
    /\bhow\s+far\s+do\s+you\s+agree\b/.test(rawText)
  ) {
    const isInterp =
      rawType.includes('interp') ||
      /\binterpretation\s+[12]\b/.test(rawText);
    return {
      marks: 16,
      rawMarks: parsedNum || 16,
      spagMarks: hasSpag ? 4 : 0,
      tariffKey: '16m',
      badgeLabel: '16m Judgement Essay',
      minsSuggested: 28,
      family: isInterp ? 'interp_verdict' : 'verdict',
    };
  }

  // 12-mark Explain Why
  if (
    parsedNum === 12 ||
    rawType.includes('12') ||
    rawType.includes('explain_why') ||
    rawType.includes('causation') ||
    /\bexplain\s+why\b/.test(rawText)
  ) {
    return {
      marks: 12,
      rawMarks: 12,
      spagMarks: 0,
      tariffKey: '12m',
      badgeLabel: '12m Explain Why',
      minsSuggested: 18,
      family: 'causation',
    };
  }

  // 8-mark families
  if (rawType.includes('narrative') || /\bnarrative\s+account\b|\banalytical\s+narrative\b/.test(combined)) {
    return {
      marks: 8,
      rawMarks: 8,
      spagMarks: 0,
      tariffKey: '8m',
      badgeLabel: '8m Narrative Account',
      minsSuggested: 15,
      family: 'narrative',
    };
  }

  if (rawType.includes('utility') || /\bhow\s+useful\s+(?:is|are)\s+sources?\b/.test(combined)) {
    return {
      marks: 8,
      rawMarks: 8,
      spagMarks: 0,
      tariffKey: '8m',
      badgeLabel: '8m Source Utility',
      minsSuggested: 14,
      family: 'utility',
    };
  }

  if (
    rawType.includes('importance') ||
    /\bexplain\s+the\s+importance\s+of\b|\banalyse\s+the\s+significance\s+of\b/.test(combined)
  ) {
    return {
      marks: 8,
      rawMarks: 8,
      spagMarks: 0,
      tariffKey: '8m',
      badgeLabel: '8m Importance',
      minsSuggested: 12,
      family: 'importance',
    };
  }

  if (
    /\btwo\s+(?:distinct\s+)?consequences\b/.test(combined) ||
    (parsedNum === 8 && combined.includes('consequence'))
  ) {
    return {
      marks: 8,
      rawMarks: 8,
      spagMarks: 0,
      tariffKey: '8m',
      badgeLabel: '8m Consequence',
      minsSuggested: 12,
      family: 'consequence_8',
    };
  }

  // 4-mark (and 2-mark sub-part) families
  if (rawType.includes('follow_up') || rawType.includes('followup') || /\bfollow\s+up\s+source\b/.test(combined)) {
    return {
      marks: 4,
      rawMarks: 4,
      spagMarks: 0,
      tariffKey: '4m',
      badgeLabel: '4m Source Follow-Up',
      minsSuggested: 6,
      family: 'followup',
    };
  }

  if (rawType.includes('inference') || /\btwo\s+things\s+you\s+can\s+infer\b|\binfer\s+from\s+source\b/.test(combined)) {
    return {
      marks: 4,
      rawMarks: 4,
      spagMarks: 0,
      tariffKey: '4m',
      badgeLabel: '4m Source Inference',
      minsSuggested: 6,
      family: 'inference',
    };
  }

  if (
    rawType.includes('interp_diff') ||
    /\bmain\s+difference\s+between\s+(?:these|the)\s+views\b/.test(combined)
  ) {
    return {
      marks: 4,
      rawMarks: 4,
      spagMarks: 0,
      tariffKey: '4m',
      badgeLabel: '4m Interpretation Diff',
      minsSuggested: 6,
      family: 'interp_diff',
    };
  }

  if (
    rawType.includes('interp_why') ||
    /\bone\s+reason\s+why\s+interpretations?\s+1\s+and\s+2\s+give\s+different\s+views\b/.test(combined)
  ) {
    return {
      marks: 4,
      rawMarks: 4,
      spagMarks: 0,
      tariffKey: '4m',
      badgeLabel: '4m Why Views Differ',
      minsSuggested: 6,
      family: 'interp_why',
    };
  }

  if (
    rawType.includes('similarity') ||
    rawType.includes('difference') ||
    /\bexplain\s+one\s+way\s+in\s+which\b/.test(combined)
  ) {
    return {
      marks: 4,
      rawMarks: 4,
      spagMarks: 0,
      tariffKey: '4m',
      badgeLabel: '4m Comparison',
      minsSuggested: 6,
      family: 'comparison',
    };
  }

  if (
    rawType.includes('feature') ||
    /\bdescribe\s+(?:one|two)\s+features?\s+of\b|\boutline\s+two\s+key\s+characteristics\b/.test(combined)
  ) {
    return {
      marks: 4,
      rawMarks: parsedNum === 2 ? 2 : 4,
      spagMarks: 0,
      tariffKey: '4m',
      badgeLabel: '4m Feature',
      minsSuggested: 5,
      family: 'features',
    };
  }

  if (combined.includes('consequence')) {
    return {
      marks: 4,
      rawMarks: 4,
      spagMarks: 0,
      tariffKey: '4m',
      badgeLabel: '4m Consequence',
      minsSuggested: 5,
      family: 'consequence_4',
    };
  }

  if (parsedNum === 8) {
    return {
      marks: 8,
      rawMarks: 8,
      spagMarks: 0,
      tariffKey: '8m',
      badgeLabel: '8m Extended Question',
      minsSuggested: 12,
      family: 'importance',
    };
  }

  return {
    marks: 4,
    rawMarks: parsedNum || 4,
    spagMarks: 0,
    tariffKey: '4m',
    badgeLabel: '4m Short Question',
    minsSuggested: 5,
    family: 'features',
  };
}

function parseLessonKeyTopicMeta(unitId, lesson, lessonIndex, groupings = []) {
  const title = String(lesson?.title || `Lesson ${lessonIndex + 1}`).trim();
  const ktField = String(lesson?.key_topic || lesson?.topic || '').trim();
  const lessonId = String(lesson?.id || `lesson_${lessonIndex + 1}`);

  // Match "KT 2.3" or "KT5.1" in lesson title or key_topic
  const codeMatch =
    title.match(/^(KT\s*(\d+)\.(\d+))\s*[:–-]\s*(.+)$/i) ||
    ktField.match(/^(KT\s*(\d+))\s*[:–-]\s*(.+)$/i);

  let ktNum = 1;
  let lessonCode = '';
  let cleanTitle = title;

  const titleKtMatch = title.match(/^KT\s*(\d+)\.(\d+)\s*[:–-]\s*(.+)$/i);
  if (titleKtMatch) {
    ktNum = parseInt(titleKtMatch[1], 10) || 1;
    lessonCode = `KT ${titleKtMatch[1]}.${titleKtMatch[2]}`;
    cleanTitle = titleKtMatch[3].trim();
  } else {
    const idKtMatch = lessonId.match(/lesson_(\d+)_(\d+)/i);
    if (idKtMatch) {
      ktNum = parseInt(idKtMatch[1], 10) || 1;
      lessonCode = `KT ${idKtMatch[1]}.${idKtMatch[2]}`;
    } else if (ktField) {
      const kfMatch = ktField.match(/KT\s*(\d+)/i);
      if (kfMatch) ktNum = parseInt(kfMatch[1], 10) || 1;
    }
    cleanTitle = title.replace(/^KT\s*\d+(?:\.\d+)?\s*[:–-]\s*/i, '').trim();
  }

  const ktId = `KT${ktNum}`;
  const isWesternFront = unitId === 'edexcel_medicine' && ktNum === 5;
  const ktBadge = isWesternFront ? 'Western Front' : `KT ${ktNum}`;

  const groupingMatch = Array.isArray(groupings)
    ? groupings.find((g) => String(g?.prefix || '').toUpperCase() === ktId)
    : null;

  const canonicalTitle =
    CANONICAL_KT_TITLES[unitId]?.[ktId] ||
    (groupingMatch?.name
      ? String(groupingMatch.name).replace(/^Key\s+Topic\s+\d+\s*[:–-]\s*/i, '').trim()
      : '') ||
    (ktField ? ktField.replace(/^KT\s*\d+\s*[:–-]\s*/i, '').trim() : `Key Topic ${ktNum}`);

  const ktLabel = isWesternFront
    ? `Western Front: ${canonicalTitle}`
    : `KT ${ktNum}: ${canonicalTitle}`;

  return {
    ktNum,
    ktId,
    ktBadge,
    ktTitle: canonicalTitle,
    ktLabel,
    lessonCode: lessonCode || `L${lessonIndex + 1}`,
    lessonTitle: lessonCode ? `${lessonCode}: ${cleanTitle}` : title,
    cleanTitle,
  };
}

function parseMockSourceExtract(rawHtml = '') {
  if (!rawHtml || !String(rawHtml).trim()) return [];
  const parts = String(rawHtml)
    .split(/<hr[^>]*>/i)
    .map((p) => p.trim())
    .filter(Boolean);

  return parts.map((chunk, idx) => {
    const plain = stripHtml(chunk);
    const isInterp = /\binterpretation\s*[12]\b/i.test(plain);
    const labelMatch = plain.match(/^(Source\s+[A-E]|Interpretation\s+[12])\s*[:–-]?\s*([^\n.]*)/i);
    let label = labelMatch ? labelMatch[1] : isInterp ? `Interpretation ${idx + 1}` : `Source ${String.fromCharCode(65 + idx)}`;
    let provenance = '';
    let body = plain;

    // Try extracting italic header div if present
    const headerDivMatch = chunk.match(/<div[^>]*font-style:\s*italic[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*>([\s\S]*?)<\/div>/i);
    if (headerDivMatch) {
      provenance = stripHtml(headerDivMatch[1]);
      body = stripHtml(headerDivMatch[2]);
      const pMatch = provenance.match(/^(Source\s+[A-E]|Interpretation\s+[12])\s*[:–-]?\s*(.*)$/i);
      if (pMatch) {
        label = pMatch[1];
        provenance = pMatch[2].trim();
      }
    } else if (labelMatch) {
      const firstNl = plain.indexOf('\n');
      if (firstNl > 0 && firstNl < 220) {
        provenance = plain.slice(0, firstNl).replace(/^(Source\s+[A-E]|Interpretation\s+[12])\s*[:–-]?\s*/i, '').trim();
        body = plain.slice(firstNl + 1).trim();
      }
    }

    return {
      label,
      title: label,
      provenance,
      contentHtml: `<p>${escapeHtml(body)}</p>`,
      image: '',
      isInterp,
    };
  });
}

function normalizeSourceItem(src, fallbackLabel = 'Source', forceInterp = false) {
  if (!src) return null;
  if (typeof src === 'string') {
    const clean = stripHtml(src);
    if (!clean) return null;
    return {
      label: fallbackLabel,
      title: fallbackLabel,
      provenance: '',
      contentHtml: `<p>${escapeHtml(clean)}</p>`,
      image: '',
      isInterp: forceInterp || /interpretation/i.test(fallbackLabel),
    };
  }

  const isInterp =
    forceInterp ||
    Boolean(src.isInterp || src.interpNum) ||
    /^interpretation\s*\d/i.test(String(src.title || src.label || ''));

  const letter = src.letter ? `Source ${String(src.letter).toUpperCase()}` : '';
  const interpLabel = src.interpNum ? `Interpretation ${src.interpNum}` : '';
  const rawTitle = stripHtml(src.title || src.label || interpLabel || letter || fallbackLabel);
  const provenance = stripHtml(src.provenance || src.attribution || src.caption || '');
  const bodyRaw =
    src.content || src.extract || src.text || src.quote || src.description || src.desc || '';
  const bodyClean = stripHtml(convertMarkdownInlineToHtml(bodyRaw));
  const image = src.image || src.image_url || src.src || src.asset_path || '';

  if (!bodyClean && !image && !provenance) return null;

  return {
    label: interpLabel || letter || rawTitle.split(':')[0].trim() || fallbackLabel,
    title: rawTitle,
    provenance: provenance !== rawTitle ? provenance : '',
    contentHtml: bodyClean ? `<p>${escapeHtml(bodyClean)}</p>` : '',
    image,
    isInterp,
  };
}

function extractRequestedSourceLetters(questionText) {
  const letters = [];
  const add = (ch) => {
    const up = String(ch || '').trim().toUpperCase();
    if (up && !letters.includes(up)) letters.push(up);
  };
  const text = String(questionText || '');
  for (const m of text.matchAll(/\bSources\s+([A-E])\s+(?:and|&)\s+([A-E])\b/gi)) {
    add(m[1]);
    add(m[2]);
  }
  for (const m of text.matchAll(/\bSource\s+([A-E])\b/gi)) {
    add(m[1]);
  }
  return letters;
}

function resolveQuestionStimulusAndSources(qObj, lesson, epContainer, siblingQuestions = []) {
  const stimulusBullets = [];
  const resolvedSources = [];

  // 1. Collect bullet-point stimulus hints (for 8m Narrative, 12m Explain Why, 16m Essay)
  const rawBullets = [];
  if (Array.isArray(qObj.bullet_points)) {
    rawBullets.push(...qObj.bullet_points);
  }
  if (Array.isArray(qObj.stimulus)) {
    qObj.stimulus.forEach((item) => {
      if (typeof item === 'string') {
        rawBullets.push(item);
      }
    });
  } else if (typeof qObj.stimulus === 'string' && qObj.stimulus.trim()) {
    qObj.stimulus
      .split(/\n|•/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => rawBullets.push(s));
  }

  for (const b of rawBullets) {
    const cleaned = stripHtml(b)
      .replace(/^[-•*]\s*/, '')
      .replace(/^optional\s+focus\s*:\s*/i, '')
      .trim();
    if (
      cleaned &&
      cleaned.length < 160 &&
      !/you\s+must\s+also\s+use|information\s+of\s+your\s+own|additional\s+historical\s+knowledge/i.test(
        cleaned,
      ) &&
      !stimulusBullets.includes(cleaned)
    ) {
      stimulusBullets.push(cleaned);
    }
  }

  // 2. If mock question has inline `sourceExtract`, parse directly
  if (qObj.sourceExtract && String(qObj.sourceExtract).trim()) {
    const parsed = parseMockSourceExtract(qObj.sourceExtract);
    resolvedSources.push(...parsed);
    return { stimulusBullets, sources: resolvedSources };
  }

  const qRawText = String(qObj.question || qObj.prompt || qObj.questionText || '');
  const needsInterps =
    /\binterpretations?\s+1\b|\binterpretation\s+[12]\b/i.test(qRawText) ||
    /interp|verdict_16m/i.test(String(qObj.type || ''));

  // 3. Resolve Interpretations 1 & 2 if needed
  if (needsInterps) {
    const interpPool =
      (Array.isArray(qObj.interpretations) && qObj.interpretations.length > 0 && qObj.interpretations) ||
      (Array.isArray(epContainer?.interpretations) &&
        epContainer.interpretations.length > 0 &&
        epContainer.interpretations) ||
      (Array.isArray(lesson?.interpretations) &&
        lesson.interpretations.length > 0 &&
        lesson.interpretations) ||
      [];
    interpPool.slice(0, 2).forEach((it, idx) => {
      const norm = normalizeSourceItem(it, `Interpretation ${idx + 1}`, true);
      if (norm) resolvedSources.push(norm);
    });
  }

  // 4. Resolve specific Primary Sources (Source A, Sources B and C, etc.)
  const requestedLetters = extractRequestedSourceLetters(qRawText);
  if (requestedLetters.length > 0) {
    const matchesLetter = (item, letter) => {
      if (!item || typeof item !== 'object') return false;
      if (String(item.letter || '').trim().toUpperCase() === letter) return true;
      const header = String(item.title || item.label || item.caption || item.id || '');
      return new RegExp(`\\bSource\\s+${letter}\\b`, 'i').test(header);
    };

    const epStimObjects = Array.isArray(epContainer?.stimulus)
      ? epContainer.stimulus.filter((x) => x && typeof x === 'object')
      : [];
    const qStimObjects = Array.isArray(qObj?.stimulus)
      ? qObj.stimulus.filter((x) => x && typeof x === 'object')
      : [];

    // Also check sibling Q3(a) sources if Q3(c)/Q3(d) references Sources B and C
    const siblingSrcs = [];
    siblingQuestions.forEach((sib) => {
      if (Array.isArray(sib?.sources)) siblingSrcs.push(...sib.sources);
      if (Array.isArray(sib?.supporting_sources)) siblingSrcs.push(...sib.supporting_sources);
    });

    for (const ltr of requestedLetters) {
      const pools = [
        qObj.sources || [],
        qObj.supporting_sources || [],
        qStimObjects,
        epContainer?.sources || [],
        epContainer?.supporting_sources || [],
        epStimObjects,
        siblingSrcs,
        lesson?.sources || [],
      ];
      let found = null;
      for (const pool of pools) {
        if (!Array.isArray(pool)) continue;
        const hit = pool.find((item) => matchesLetter(item, ltr));
        if (hit) {
          found = normalizeSourceItem(hit, `Source ${ltr}`, false);
          if (found) break;
        }
      }
      // Positional fallback in lesson.sources (A=0, B=1, C=2) if letters aren't explicitly keyed
      if (!found && Array.isArray(lesson?.sources)) {
        const pos = ltr.charCodeAt(0) - 65;
        if (pos >= 0 && pos < lesson.sources.length) {
          found = normalizeSourceItem(lesson.sources[pos], `Source ${ltr}`, false);
        }
      }
      if (found) resolvedSources.push(found);
    }
  } else if (Array.isArray(qObj.sources) && qObj.sources.length > 0) {
    qObj.sources.forEach((s, idx) => {
      const norm = normalizeSourceItem(s, `Source ${String.fromCharCode(65 + idx)}`, false);
      if (norm) resolvedSources.push(norm);
    });
  }

  return {
    stimulusBullets,
    sources: resolvedSources,
  };
}

function splitSentencesSafe(text) {
  const clean = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return [];
  // Protect common abbreviations before splitting
  const protectedStr = clean
    .replace(/\b(c|ca|vs|v|Dr|Mr|Mrs|St|No|Fig|Gen|Pres|Gov|Lt|Col|Sgt|approx|e\.g|i\.e)\./gi, '$1__DOT__')
    .replace(/(\d)\.(\d)/g, '$1__DOT__$2');

  const rawParts = protectedStr.split(/(?<=[.!?])\s+(?=[A-Z0-9"“‘'(])/);
  return rawParts
    .map((p) => p.replace(/__DOT__/g, '.').trim())
    .filter((p) => p.length > 0);
}

function extractModelHtmlAndPlain(qObj) {
  let rawModel =
    qObj.model ||
    qObj.model_answer ||
    qObj.modelAnswer ||
    qObj.wagoll ||
    qObj.exemplar ||
    qObj.answer ||
    '';

  if (!rawModel && qObj.model_tiers) {
    const tierKeys = ['tier_16m', 'tier_12m', 'tier_8m', 'tier_4m', 'tier_2m'];
    for (const tk of tierKeys) {
      if (qObj.model_tiers[tk]?.text) {
        rawModel = qObj.model_tiers[tk].text;
        break;
      }
    }
  }

  if (!rawModel && Array.isArray(qObj.features) && qObj.features.length > 0) {
    rawModel = qObj.features
      .map((f, idx) => `<p><strong>Feature ${idx + 1} (${escapeHtml(f.name || '')}):</strong> ${escapeHtml(f.answer || '')}</p>`)
      .join('');
  }

  // Clean stray header lines like "Exemplar Model Answer (Level 3 — 8 Marks):"
  let html = convertMarkdownInlineToHtml(rawModel)
    .replace(/<strong>\s*(?:Exemplar\s+Model\s+Answer|Sample\s+Acceptable\s+Inferences)[^<]*<\/strong>\s*(?:<br\s*\/?>)?/gi, '')
    .trim();

  const plain = stripHtml(html);
  return { html, plain };
}

/**
 * Wraps historical dates, numbers, and key terms inside text nodes of an HTML snippet
 * with `.met-recall-chip` spans so toggling "Hide Key Dates & Terms" causes 0px reflow.
 */
function wrapActiveRecallTokensInHtml(htmlSnippet, vocabTerms = []) {
  if (!htmlSnippet) return '';

  const structuralSkip = /^(?:(?:\([ivx0-9a-z]+\)|[ivx0-9]+\.)\s*)?(source\s+[a-e]|sources\s+[a-e]\s+and\s+[a-e]|interpretation\s+[12]|feature\s+[12]|inference\s+[12]|what\s+i\s+can\s+infer.*|details\s+in\s+the\s+source.*|overall|in\s+conclusion|firstly|secondly|furthermore|however)$/i;

  const cleanVocab = vocabTerms
    .map((v) => String(v?.term || v || '').trim())
    .filter((t) => t.length >= 4 && !structuralSkip.test(t))
    .sort((a, b) => b.length - a.length)
    .slice(0, 14);

  const escapedVocabAlternation = cleanVocab
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  // 1. Convert non-structural <strong>...</strong> phrases directly into recall chips
  let processed = String(htmlSnippet).replace(/<strong>([\s\S]*?)<\/strong>/gi, (full, inner) => {
    const plainInner = stripHtml(inner).replace(/^(?:\([ivx0-9a-z]+\)|[ivx0-9]+\.)\s*/i, '').trim();
    if (!plainInner || plainInner.length > 52 || structuralSkip.test(plainInner) || plainInner.endsWith(':')) {
      return full;
    }
    return `<span class="met-recall-chip" data-recall-chip="1" role="button" tabindex="0"><strong>${inner}</strong></span>`;
  });

  // 2. Tokenize remaining plain-text nodes (dates, stats, quoted source evidence, proper-noun terms & vocab)
  const parts = processed.split(/(<span class="met-recall-chip"[\s\S]*?<\/span>|<[^>]+>)/gi);
  const dateOrStatPattern =
    '(?:c\\.?\\s*\\d{4}(?:[–-]\\d{2,4})?|\\b(?:1[0-9]{3}|20[0-2][0-9])(?:[–-](?:\\d{2}|\\d{4}))?s?\\b|(?:£|\\$)\\d+(?:[.,]\\d+)?(?:\\s*(?:million|billion))?|\\b\\d{1,3}(?:,\\d{3})+(?:\\s+(?:troops|soldiers|deaths|refugees|flights|ships|men|citizens))?\\b|\\b\\d+(?:\\.\\d+)?%|&quot;[^&]{8,72}&quot;)';

  const combinedRegex = new RegExp(
    escapedVocabAlternation
      ? `(${dateOrStatPattern}|\\b(?:${escapedVocabAlternation})\\b)`
      : `(${dateOrStatPattern})`,
    'gi',
  );

  return parts
    .map((part) => {
      if (!part || part.startsWith('<')) return part;
      return part.replace(combinedRegex, (match) => {
        if (!match || match.trim().length < 2) return match;
        return `<span class="met-recall-chip" data-recall-chip="1" role="button" tabindex="0">${match}</span>`;
      });
    })
    .join('');
}

function classifySentenceRole(sentence, idx, totalInPara, isFinalJudgementPara, family) {
  const lower = sentence.toLowerCase();
  if (
    isFinalJudgementPara ||
    /^(?:overall|ultimately|in\s+conclusion|on\s+balance|therefore,?\s+while|to\s+conclude)\b/.test(lower)
  ) {
    return 'JUDGEMENT';
  }
  if (idx === 0) {
    return 'POINT';
  }
  if (
    /\b(?:this\s+meant\s+that|consequently|as\s+a\s+result|this\s+led\s+directly\s+to|this\s+was\s+(?:vital|crucial|important|decisive)\s+because|this\s+proved\s+that|this\s+made\s+the\s+source\s+useful|proving\s+that|forcing|accelerating|which\s+convinced|thereby)\b/.test(
      lower,
    ) ||
    (idx === totalInPara - 1 && totalInPara >= 3 && family !== 'inference')
  ) {
    return 'EXPLAIN';
  }
  return 'EVIDENCE';
}

function buildWagollSegments(modelHtml, vocabChips, family) {
  if (!modelHtml) return [];
  const rawParas = modelHtml
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '\n\n')
    .replace(/^<p[^>]*>|<\/p>$/gi, '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const segments = [];
  rawParas.forEach((paraHtml, pIdx) => {
    const plainPara = stripHtml(paraHtml);
    if (!plainPara) return;

    const isFinalJudgementPara =
      rawParas.length >= 3 &&
      pIdx === rawParas.length - 1 &&
      (family === 'verdict' ||
        family === 'interp_verdict' ||
        /^(?:overall|ultimately|in\s+conclusion|on\s+balance)/i.test(plainPara));

    const sentences = splitSentencesSafe(plainPara);
    if (sentences.length <= 1) {
      const role = isFinalJudgementPara ? 'JUDGEMENT' : pIdx === 0 ? 'POINT' : 'EXPLAIN';
      segments.push({
        paraIndex: pIdx,
        role,
        text: plainPara,
        html: wrapActiveRecallTokensInHtml(escapeHtml(plainPara), vocabChips),
      });
      return;
    }

    // Group sentences into clean POINT -> EVIDENCE -> EXPLAIN / JUDGEMENT blocks per paragraph
    sentences.forEach((sent, sIdx) => {
      const role = classifySentenceRole(sent, sIdx, sentences.length, isFinalJudgementPara, family);
      const prev = segments[segments.length - 1];
      if (prev && prev.paraIndex === pIdx && prev.role === role) {
        prev.text = `${prev.text} ${sent}`;
        prev.html = wrapActiveRecallTokensInHtml(escapeHtml(prev.text), vocabChips);
      } else {
        segments.push({
          paraIndex: pIdx,
          role,
          text: sent,
          html: wrapActiveRecallTokensInHtml(escapeHtml(sent), vocabChips),
        });
      }
    });
  });

  // Guarantee every WAGOLL has at least 2 active-recall chips even on dateless descriptive extracts
  const totalChipCount = segments.reduce(
    (sum, seg) => sum + (seg.html.match(/class="met-recall-chip"/g) || []).length,
    0,
  );
  if (totalChipCount < 2) {
    let added = totalChipCount;
    for (const seg of segments) {
      if (added >= 2) break;
      if (seg.html.includes('class="met-recall-chip"')) continue;
      // Match a capitalized proper noun phrase or a concrete 2-word historical noun phrase
      const fallbackReplaced = seg.html.replace(
        /\b([A-Z][a-z]{3,}(?:\s+[A-Z][a-z]{3,})?|[a-z]{5,}\s+(?:deprivation|poverty|starvation|blockade|infection|rebellion|censorship|propaganda|opposition|sanitation|authority|resistance|casualties))\b/,
        (m) => {
          if (/^(?:What|Details|Source|Sources|Interpretation|Feature|First|Second|Overall|During|However)\b/.test(m)) {
            return m;
          }
          added += 1;
          return `<span class="met-recall-chip" data-recall-chip="1" role="button" tabindex="0">${m}</span>`;
        },
      );
      seg.html = fallbackReplaced;
    }
  }

  return segments;
}

function splitSentenceAtPivot(sentence) {
  const pivots = [
    ', consequently ',
    ', directly ',
    ', prompting ',
    ', forcing ',
    ', leading ',
    ', meaning ',
    ', proving ',
    ', which ',
    '; ',
    ' because ',
    ' while ',
  ];
  const lower = sentence.toLowerCase();
  for (const piv of pivots) {
    const pos = lower.indexOf(piv);
    if (pos >= 28 && pos <= sentence.length - 28) {
      const left = sentence.slice(0, pos).trim() + '.';
      let right = sentence.slice(pos + (piv.startsWith(',') || piv.startsWith(';') ? 2 : 1)).trim();
      right = right.charAt(0).toUpperCase() + right.slice(1);
      return [left, right];
    }
  }
  const commaMid = sentence.indexOf(', ', Math.floor(sentence.length * 0.38));
  if (commaMid >= 24 && commaMid <= sentence.length - 24) {
    const left = sentence.slice(0, commaMid).trim() + '.';
    const rest = sentence.slice(commaMid + 2).trim();
    return [left, rest.charAt(0).toUpperCase() + rest.slice(1)];
  }
  return [sentence];
}

/**
 * Builds Drill 1: PEEL Builder (4 ordered structural tiles + 2–3 tap-to-fill spec chips).
 */
function buildPeelDrill(plainModel, questionStem, vocabChips = [], lessonStages = []) {
  const paras = String(plainModel || '')
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 35);

  // Choose the best body paragraph with rich factual & causal structure
  const bestPara =
    paras.find((p) => splitSentencesSafe(p).length >= 3) ||
    paras[0] ||
    String(plainModel || '').replace(/\s+/g, ' ').trim();

  let sentences = splitSentencesSafe(bestPara);
  if (sentences.length < 4 && paras.length >= 2) {
    const combined = splitSentencesSafe(`${paras[0]} ${paras[1]}`);
    if (combined.length >= 4) sentences = combined.slice(0, 4);
  }

  // Expand < 4 sentences cleanly via pivot splitting
  while (sentences.length < 4 && sentences.length > 0) {
    let splitDone = false;
    let longestIdx = 0;
    sentences.forEach((s, idx) => {
      if (s.length > sentences[longestIdx].length) longestIdx = idx;
    });
    const pair = splitSentenceAtPivot(sentences[longestIdx]);
    if (pair.length === 2) {
      sentences.splice(longestIdx, 1, pair[0], pair[1]);
      splitDone = true;
    }
    if (!splitDone) break;
  }

  // Collapse > 4 sentences into 4 balanced tiles
  if (sentences.length > 4) {
    const first = sentences[0];
    const last = sentences[sentences.length - 1];
    const penult = sentences[sentences.length - 2];
    const mid = sentences.slice(1, sentences.length - 2).join(' ');
    sentences = [first, mid, penult, last];
  }

  // Pad to 4 if still short
  const topicFocus = questionStem
    .replace(/^(?:explain\s+one\s+consequence\s+of|explain\s+why|describe\s+(?:one|two)\s+features?\s+of|explain\s+the\s+importance\s+of)\s+/i, '')
    .replace(/[?.!]+$/, '')
    .trim();

  while (sentences.length < 4) {
    if (sentences.length === 1) {
      sentences.push(`Specifically, key historical evidence from ${topicFocus || 'this period'} demonstrates how rapidly events developed.`);
    } else if (sentences.length === 2) {
      sentences.push('Consequently, this directly reshaped the political and social situation at the time.');
    } else {
      sentences.push(`Therefore, this was a decisive turning point in ${topicFocus.slice(0, 70) || 'the period'}.`);
    }
  }

  const roles = ['POINT', 'EVIDENCE', 'EXPLAIN', 'LINK / JUDGEMENT'];

  // Extract 2–3 high-tariff dates or spec terms from the 4 tiles to turn into tap-to-fill blanks
  const blanks = [];
  const usedAnswersLower = new Set();

  const candidateTerms = [
    ...vocabChips.map((v) => v.term).filter((t) => t && t.length >= 4 && t.length <= 28),
    ...lessonStages.map((s) => s.title).filter((t) => t && t.length >= 4 && t.length <= 26),
  ];

  const tiles = sentences.map((rawSent, idx) => {
    let textWithBlanks = rawSent;
    const blankIds = [];

    if (blanks.length < 3) {
      // Prefer a 4-digit year first, then a matching vocab term, then a capitalized historical proper noun
      let chosen = null;
      const yearMatch = textWithBlanks.match(/\b(1[2-9]\d{2}|20[0-2]\d)\b/);
      if (yearMatch && !usedAnswersLower.has(yearMatch[1].toLowerCase())) {
        chosen = yearMatch[1];
      }

      if (!chosen) {
        for (const term of candidateTerms) {
          const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const rx = new RegExp(`\\b(${escaped})\\b`, 'i');
          const m = textWithBlanks.match(rx);
          if (m && !usedAnswersLower.has(m[1].toLowerCase())) {
            chosen = m[1];
            break;
          }
        }
      }

      if (!chosen) {
        const properMatches = [
          ...textWithBlanks.matchAll(/\b([A-Z][a-zA-Z'-]{3,}(?:\s+[A-Z][a-zA-Z'-]{2,})?)\b/g),
        ];
        const skipWords = new Set([
          'One', 'First', 'Firstly', 'Second', 'Secondly', 'Furthermore', 'However', 'Moreover',
          'Consequently', 'Therefore', 'Overall', 'Ultimately', 'Specifically', 'Source',
          'Sources', 'Interpretation', 'Interpretations', 'While', 'When', 'After', 'Before',
          'During', 'Because', 'Although', 'Despite', 'Under', 'Between', 'Following',
        ]);
        for (const pm of properMatches) {
          const cand = pm[1].trim();
          const firstWord = cand.split(/\s+/)[0];
          if (
            !skipWords.has(firstWord) &&
            cand.length >= 4 &&
            cand.length <= 26 &&
            !usedAnswersLower.has(cand.toLowerCase()) &&
            pm.index > 0
          ) {
            chosen = cand;
            break;
          }
        }
      }

      if (chosen) {
        const blankId = `b${blanks.length + 1}`;
        const escChosen = chosen.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        textWithBlanks = textWithBlanks.replace(new RegExp(`\\b${escChosen}\\b`), `[[${blankId}]]`);
        if (textWithBlanks.includes(`[[${blankId}]]`)) {
          usedAnswersLower.add(chosen.toLowerCase());
          blanks.push({
            blankId,
            answer: chosen,
            normalizedAnswer: chosen.toLowerCase(),
          });
          blankIds.push(blankId);
        }
      }
    }

    return {
      id: `tile_${idx}`,
      orderIndex: idx,
      role: roles[idx],
      rawText: rawSent,
      textWithBlanks,
      blankIds,
    };
  });

  // Build chip bank: correct answers + 2 plausible distractors from lesson vocab/stages
  const chipBank = blanks.map((b) => b.answer);
  for (const v of vocabChips) {
    if (chipBank.length >= blanks.length + 2) break;
    const t = String(v?.term || '').trim();
    if (t && t.length <= 26 && !usedAnswersLower.has(t.toLowerCase())) {
      usedAnswersLower.add(t.toLowerCase());
      chipBank.push(t);
    }
  }
  const fallbackDistractors = ['1921', '1952', 'Treaty Clause', 'Local Council'];
  for (const fd of fallbackDistractors) {
    if (chipBank.length >= blanks.length + 2) break;
    if (!usedAnswersLower.has(fd.toLowerCase())) {
      usedAnswersLower.add(fd.toLowerCase());
      chipBank.push(fd);
    }
  }

  return {
    tiles,
    blanks,
    chipBank,
  };
}

/**
 * Builds Drill 2: 60s Plan (Analytical Factor Selector + Lesson Evidence Chips + Sustained Judgement).
 */
function buildPlanDrill(qInfo, lesson, unitLessons = []) {
  const paras = String(qInfo.plainModelText || '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 25);

  const strongFactors = [];

  if (Array.isArray(qInfo.indicativeContent) && qInfo.indicativeContent.length >= 2) {
    qInfo.indicativeContent.slice(0, 3).forEach((ic) => {
      const concise = splitSentencesSafe(stripHtml(ic))[0] || stripHtml(ic);
      if (concise) strongFactors.push(concise.slice(0, 125));
    });
  }

  if (strongFactors.length < 2) {
    paras.slice(0, 3).forEach((p) => {
      const firstSent = splitSentencesSafe(p)[0] || p;
      if (firstSent && !/^(?:overall|in\s+conclusion|ultimately)\b/i.test(firstSent)) {
        strongFactors.push(firstSent.slice(0, 125));
      }
    });
  }

  if (strongFactors.length < 2 && Array.isArray(lesson?.workbook_stages)) {
    lesson.workbook_stages.slice(0, 3).forEach((st) => {
      if (st?.title && strongFactors.length < 3) {
        strongFactors.push(`${st.title}: direct impact on the enquiry focus`);
      }
    });
  }

  while (strongFactors.length < 2) {
    strongFactors.push('Focused analytical point supported by precise dates and historical evidence.');
  }

  const targetCount = Math.min(3, Math.max(2, strongFactors.length));
  const selectedStrong = strongFactors.slice(0, targetCount);

  // Pull 2 plausible off-topic distractors from distant lessons in the same course
  const distractors = [];
  const totalLessons = unitLessons.length;
  if (totalLessons > 2) {
    const farIndices = [
      (qInfo.lessonIndex + Math.floor(totalLessons / 2)) % totalLessons,
      (qInfo.lessonIndex + Math.max(2, totalLessons - 2)) % totalLessons,
    ];
    for (const fIdx of farIndices) {
      if (fIdx === qInfo.lessonIndex) continue;
      const farLesson = unitLessons[fIdx];
      const farStage = farLesson?.workbook_stages?.[0]?.title || farLesson?.vocab?.[0]?.term;
      if (farStage && distractors.length < 2) {
        distractors.push(`${farStage} (from a separate period/topic outside this question’s dates)`);
      }
    }
  }
  while (distractors.length < 2) {
    distractors.push(
      distractors.length === 0
        ? 'Pure chronological storytelling of background events without linking to the question stem.'
        : 'Unsupported generalisation with no specific dates, names, or policies.',
    );
  }

  const factors = [
    ...selectedStrong.map((text, idx) => ({
      id: `f_strong_${idx}`,
      text: text.replace(/^\([ivx]+\)\s*/i, ''),
      isStrong: true,
    })),
    ...distractors.slice(0, 2).map((text, idx) => ({
      id: `f_weak_${idx}`,
      text: text.replace(/\s*\(from a separate period.*$/i, ''),
      isStrong: false,
    })),
  ];

  // Evidence chips from lesson vocab + stimulus bullets
  const evidenceChips = [];
  (lesson?.vocab || []).slice(0, 4).forEach((v, idx) => {
    if (v?.term) {
      evidenceChips.push({
        id: `ev_${idx}`,
        label: v.term,
        detail: String(v.definition || '').slice(0, 110),
      });
    }
  });
  if (evidenceChips.length < 4 && Array.isArray(lesson?.workbook_stages)) {
    lesson.workbook_stages.slice(0, 4 - evidenceChips.length).forEach((st, idx) => {
      if (st?.title) {
        evidenceChips.push({
          id: `ev_st_${idx}`,
          label: st.title,
          detail: String(st.question || st.summary || '').slice(0, 110),
        });
      }
    });
  }

  // Sustained Judgement / Clincher options
  const lastPara = paras[paras.length - 1] || qInfo.plainModelText || '';
  const lastSentences = splitSentencesSafe(lastPara);
  const genuineClincher =
    lastSentences[lastSentences.length - 1] ||
    'Overall, the most decisive factor was the underlying catalyst that triggered and sustained the others across the whole period.';

  const conclusions = [
    {
      id: 'conc_best',
      text:
        genuineClincher.length <= 210
          ? genuineClincher
          : `${genuineClincher.slice(0, 205).trim()}...`,
      isBest: true,
      feedback:
        'Top-band clincher: reaches a clear, substantiated verdict directly tied to the analytical focus of the question.',
    },
    {
      id: 'conc_fence',
      text: 'Overall, all of these different points were equally important in their own way, so it is impossible to decide which mattered more.',
      isBest: false,
      feedback:
        'Examiner trap: sitting on the fence ("all equally important") caps evaluative essays because it avoids applying clear judgement criteria.',
    },
    {
      id: 'conc_vague',
      text: 'In conclusion, many dramatic events happened during these years that made people very angry and changed life for everyone.',
      isBest: false,
      feedback:
        'Examiner trap: vague assertion with zero specific historical terminology or causal link back to the question.',
    },
  ];

  return {
    targetFactorCount: targetCount,
    factors,
    evidenceChips,
    conclusions,
  };
}

/**
 * Builds Drill 3: Be the Examiner (Authentic Grade 4/5 descriptive attempt + flaw diagnosis + Grade 9 upgrade).
 */
function buildExaminerDrill(rawQObj, qInfo) {
  const tiers = rawQObj?.model_tiers || null;
  let pickedTier = null;

  if (tiers && typeof tiers === 'object') {
    const preferredOrder = [
      'tier_6m',
      'tier_5m',
      'tier_4m',
      'tier_3m',
      'tier_2m',
      'tier_1m',
    ];
    // Do not pick tier_4m on a 4-mark question (that's the full-mark answer!)
    for (const key of preferredOrder) {
      if (qInfo.marks <= 4 && key === 'tier_4m') continue;
      if (qInfo.rawMarks === 2 && key === 'tier_2m') continue;
      if (tiers[key] && tiers[key].text) {
        pickedTier = tiers[key];
        break;
      }
    }
  }

  let attemptBadge = `Grade 4/5 Script · ${Math.max(1, Math.floor(qInfo.marks / 2))} / ${qInfo.marks} Marks`;
  let studentPlain = '';
  let examinerVerdict = '';

  if (pickedTier) {
    attemptBadge = `${pickedTier.title || 'Mid-Level Attempt'} · ${pickedTier.score || attemptBadge}`;
    studentPlain = stripHtml(pickedTier.text);
    examinerVerdict = stripHtml(pickedTier.verdict || pickedTier.critique || '');
  } else {
    // Synthesize a realistic descriptive student paragraph from the opening topic without causal explanation
    const firstSentences = splitSentencesSafe(qInfo.plainModelText);
    const baseSent =
      firstSentences[0] ||
      `During this period, important events took place regarding ${qInfo.lessonShortTag}.`;
    studentPlain = `${baseSent} Many people were affected at the time and events happened one after another, which was very significant.`;
    examinerVerdict =
      'Identifies a valid point on the topic, but drifts into general description without precise supporting facts or explicit causal explanation.';
  }

  const vLower = `${examinerVerdict} ${qInfo.family}`.toLowerCase();
  let correctId = 'flaw_causal';

  if (
    qInfo.family === 'inference' ||
    /unsupported|quotation|quote\s+from\s+the\s+source|omits\s+supporting|zero\s+specific|lacks\s+specific|add\s+one\s+specific\s+fact/.test(
      vLower,
    )
  ) {
    correctId = 'flaw_detail';
  } else if (
    (qInfo.family === 'verdict' || qInfo.family === 'interp_verdict') &&
    /unbalanced|one-sided|criteria|sustained\s+judgement|both\s+interpretations/.test(vLower)
  ) {
    correctId = 'flaw_judgement';
  } else {
    correctId = 'flaw_causal';
  }

  const options = [
    {
      id: 'flaw_causal',
      label: 'Describes events chronologically instead of explaining causation, consequence, or significance',
      isCorrect: correctId === 'flaw_causal',
    },
    {
      id: 'flaw_detail',
      label: 'Makes a general assertion without precise dates, specialist terms, or supporting source evidence',
      isCorrect: correctId === 'flaw_detail',
    },
    {
      id: 'flaw_judgement',
      label: 'Lacks balanced evaluation across arguments and has no sustained judgement criteria',
      isCorrect: correctId === 'flaw_judgement',
    },
  ];

  // Extract a crisp Grade 9 upgrade snippet
  const upgradeParas = String(qInfo.modelHtml || '')
    .split(/<br\s*\/?>\s*<br\s*\/?>|<\/p>\s*<p[^>]*>/i)
    .map((p) => stripHtml(p))
    .filter(Boolean);
  const upgradeText = upgradeParas[0] || qInfo.plainModelText;

  return {
    attemptBadge,
    studentTextHtml: `<p>${escapeHtml(studentPlain)}</p>`,
    options,
    examinerVerdict:
      examinerVerdict ||
      'To reach the top mark band, support every analytical claim with precise factual evidence and link it directly back to the question focus.',
    upgradeSnippetHtml: `<p>${escapeHtml(upgradeText)}</p>`,
  };
}

/**
 * Builds Drill 4: Speak / Blurt (Specification keyword & date matcher + missed high-tariff suggestions).
 */
function buildBlurtDrill(qInfo, lesson) {
  const targets = [];
  const seenLower = new Set();

  const addTarget = (label, category, hint = '') => {
    const clean = String(label || '')
      .replace(/\s*\([^)]*\)\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!clean || clean.length < 3 || clean.length > 36) return;
    const low = clean.toLowerCase();
    if (seenLower.has(low)) return;
    seenLower.add(low);

    const variants = [low];
    // Allow matching surname/core word on multi-word names (e.g. "David Ben-Gurion" -> "ben-gurion")
    const tokens = low.split(/\s+/).filter((t) => t.length >= 5);
    if (tokens.length >= 2) {
      const last = tokens[tokens.length - 1];
      if (!['treaty', 'crisis', 'revolt', 'policy', 'system', 'period', 'britain', 'germany', 'america'].includes(last)) {
        variants.push(last);
      }
    }

    targets.push({
      label: clean,
      variants,
      category,
      hint: hint || 'Key specification detail used in top-band answers.',
    });
  };

  // 1. Dates in the Grade 9 Model Answer
  const dateMatches = [...String(qInfo.plainModelText || '').matchAll(/\b(1[2-9]\d{2}|20[0-2]\d)\b/g)];
  dateMatches.slice(0, 4).forEach((m) => {
    addTarget(m[1], 'date', `Anchor your explanation chronologically using ${m[1]}.`);
  });

  // 2. Bolded terms inside modelHtml (filtering out structural rubric labels like "(i) What I can infer:")
  const boldMatches = [...String(qInfo.modelHtml || '').matchAll(/<strong>([^<]{3,34})<\/strong>/gi)];
  boldMatches.forEach((m) => {
    const clean = stripHtml(m[1])
      .replace(/^(?:\([ivx0-9a-z]+\)|[ivx0-9]+\.)\s*/i, '')
      .replace(/:$/, '')
      .trim();
    if (
      clean.length >= 3 &&
      !/^(?:source|sources|interpretation|feature|inference|what\s+i\s+can|details\s+in|point|evidence|explain|judgement|reason|factor|aspect|follow[- ]up|question\s+i\s+would|type\s+of\s+source|how\s+this\s+might)/i.test(
        clean,
      )
    ) {
      addTarget(clean, 'term', 'High-tariff historical evidence from the Grade 9 exemplar.');
    }
  });

  // 3. Lesson vocab terms that appear in the model answer (first), then general lesson vocab
  const modelLower = String(qInfo.plainModelText || '').toLowerCase();
  const lessonVocab = Array.isArray(lesson?.vocab) ? lesson.vocab : [];
  lessonVocab.forEach((v) => {
    if (v?.term && modelLower.includes(String(v.term).toLowerCase())) {
      addTarget(v.term, 'term', stripHtml(v.definition || ''));
    }
  });
  lessonVocab.slice(0, 6).forEach((v) => {
    if (targets.length < 10 && v?.term) {
      addTarget(v.term, 'term', stripHtml(v.definition || ''));
    }
  });

  // 4. Workbook stages milestones if still < 6 targets
  if (targets.length < 6 && Array.isArray(lesson?.workbook_stages)) {
    lesson.workbook_stages.forEach((st) => {
      if (targets.length < 8 && st?.title) {
        addTarget(st.title, 'concept', stripHtml(st.question || ''));
      }
    });
  }

  const checklistPoints =
    Array.isArray(qInfo.indicativeContent) && qInfo.indicativeContent.length > 0
      ? qInfo.indicativeContent.slice(0, 4)
      : splitSentencesSafe(qInfo.plainModelText).slice(0, 3);

  const starterHint =
    qInfo.starterSentence ||
    'Speak or bullet-point key dates, names, and causal links — then tap Instant Self-Mark!';

  return {
    starterHint,
    specTargets: targets.slice(0, 10),
    checklistPoints,
  };
}

function defaultExaminerTipForFamily(family, marks) {
  switch (family) {
    case 'features':
      return 'Give a clear feature in your first sentence, then add a second sentence of precise supporting detail (dates, names, or facts).';
    case 'inference':
      return 'Write two supported inferences: pair each valid deduction directly with a short quotation or specific detail from the source.';
    case 'followup':
      return 'Choose a specific detail from the source, ask a focused historical enquiry question, and name a contemporary archive record (e.g. RAMC hospital admission registers).';
    case 'comparison':
      return 'Identify one clear similarity or difference and support it with specific factual detail from BOTH named historical periods.';
    case 'interp_diff':
      return 'Contrast the overall claim/message of Interpretation 1 against Interpretation 2, backing each with a short quote.';
    case 'interp_why':
      return 'Explain that the historians gave weight to different primary evidence (linking Interpretation 1 to Source B and Interpretation 2 to Source C) or focused on different aspects.';
    case 'consequence_4':
      return 'State one clear consequence in sentence 1, then explain the specific historical impact it caused in 2–3 crisp sentences.';
    case 'consequence_8':
      return 'Write two separate 4-mark paragraphs—each identifying a distinct consequence and explaining its knock-on effect with accurate detail.';
    case 'narrative':
      return 'Organise 3 chronological paragraphs (Beginning → Catalyst/Development → Outcome) joined by causal connectives like "Consequently" and "As a direct result".';
    case 'importance':
      return 'Write two analytical paragraphs explaining WHY X mattered for Y—never just tell the story of X without linking to the second half of the question.';
    case 'utility':
      return 'Judge each source on BOTH Content (tested against your own contextual knowledge) and Provenance (author, date, purpose, audience).';
    case 'causation':
      return 'Write 3 thematic PEEL paragraphs explaining WHY change/events happened, including own knowledge beyond the two stimulus bullets.';
    case 'interp_verdict':
    case 'verdict':
      return `Evaluate arguments FOR and AGAINST the statement across 3 paragraphs using own knowledge${family === 'interp_verdict' ? ' and BOTH interpretations' : ''}, finishing with a sustained judgement applying clear criteria.`;
    default:
      return `Support every analytical point with accurate dates and terminology tailored to this ${marks}-mark question.`;
  }
}

/**
 * Addition #1: Second-Half Stem Highlighter & Edexcel Question Trap Decoder.
 * Visually splits Edexcel question stems into [TOPIC / EVENT] vs [MUST LINK TO / ENQUIRY LENS]
 * so Year 11 pupils stop storytelling and ignoring the second half of the stem.
 */
export function parseStemHighlight(questionStem, family) {
  const s = String(questionStem || '').trim();
  if (!s) {
    return { html: '', trapWarning: '' };
  }

  // 1. 8m Importance (Paper 2 Period Study Q3: "Explain the importance of X for Y.")
  const impMatch = s.match(
    /^(Explain\s+the\s+importance\s+of\s+|Analyse\s+the\s+significance\s+of\s+)(.+?)(\s+(?:for|in|to)\s+.+?)(\.?)$/i,
  );
  if (impMatch || family === 'importance') {
    if (impMatch) {
      return {
        html: `${escapeHtml(impMatch[1])}<span class="met-stem-topic">${escapeHtml(impMatch[2])}</span> <span class="met-stem-lens">${escapeHtml(impMatch[3].trim())}${escapeHtml(impMatch[4])}</span>`,
        trapWarning: `Second-Half Rule: Don’t just tell the story of ${impMatch[2].replace(/the\s+/i, '')} — every paragraph MUST link directly "${impMatch[3].trim()}".`,
      };
    }
  }

  // 2. 8m Source Utility (Paper 1A Q2a / Paper 3 Q3a: "How useful are Sources B and C for an enquiry into X?")
  const utilMatch = s.match(
    /^(How\s+useful\s+(?:is|are)\s+)(Sources?\s+[A-Z](?:\s+and\s+(?:Source\s+)?[A-Z])?)(\s+for\s+an\s+enquiry\s+into\s+.+?)(\??)$/i,
  );
  if (utilMatch) {
    return {
      html: `${escapeHtml(utilMatch[1])}<span class="met-stem-topic">${escapeHtml(utilMatch[2])}</span> <span class="met-stem-lens">${escapeHtml(utilMatch[3].trim())}${escapeHtml(utilMatch[4] || '?')}</span>`,
      trapWarning:
        'Enquiry Lens Rule: Judge how useful each source is FOR THIS EXACT ENQUIRY (Content + Provenance + Own Knowledge) — avoid generic reliability claims.',
    };
  }

  // 3. 16m Paper 3 Interpretation Verdict ("How far do you agree with Interpretation 2 about X?")
  const interpVerdictMatch = s.match(
    /^(How\s+far\s+do\s+you\s+agree\s+with\s+)(Interpretation\s+[12])(\s+about\s+[^?]+)(\??)(.*)$/i,
  );
  if (interpVerdictMatch) {
    const trailing = (interpVerdictMatch[5] || '')
      .replace(/\s*\[?\s*16\s*marks?(?:\s*\+\s*4\s*SPaG)?\s*\]?\.?$/i, '')
      .trim();
    return {
      html: `${escapeHtml(interpVerdictMatch[1])}<span class="met-stem-topic">${escapeHtml(interpVerdictMatch[2])}</span> <span class="met-stem-lens">${escapeHtml(interpVerdictMatch[3].trim())}${escapeHtml(interpVerdictMatch[4] || '?')}</span>${trailing ? ` <span style="opacity:0.78;font-weight:600;">${escapeHtml(trailing)}</span>` : ''}`,
      trapWarning:
        'Paper 3 Essay Rule: Quote & evaluate BOTH Interpretation 2 and Interpretation 1 alongside detailed own knowledge + reach a sustained verdict.',
    };
  }

  // 4. 16m Quoted Statement Essay (Paper 1 Q5/Q6 & Paper 2B Q3/Q4)
  const quoteVerdictMatch = s.match(
    /^([‘'“"].+?[’'”"]\.?\s*)(How\s+far\s+do\s+you\s+agree\??.*)$/i,
  );
  if (quoteVerdictMatch) {
    return {
      html: `<span class="met-stem-topic">${escapeHtml(quoteVerdictMatch[1].trim())}</span> <span class="met-stem-lens">${escapeHtml(quoteVerdictMatch[2].trim())}</span>`,
      trapWarning:
        'Judgement Rule: Weigh the named factor in the quote AGAINST at least two alternative factors using clear criteria before your final verdict.',
    };
  }

  // 5. 8m Analytical Narrative ("Write a narrative account analysing the key events of X in the years Y.")
  const narrMatch = s.match(
    /^(Write\s+a\s+narrative\s+account\s+analysing\s+)(.+?)(\s+in\s+the\s+(?:years|period)\s+.+?)(\.?)$/i,
  );
  if (narrMatch) {
    return {
      html: `${escapeHtml(narrMatch[1])}<span class="met-stem-topic">${escapeHtml(narrMatch[2])}</span> <span class="met-stem-lens">${escapeHtml(narrMatch[3].trim())}${escapeHtml(narrMatch[4])}</span>`,
      trapWarning:
        'Causal Chain Rule: Sequence 3 stages (Beginning → Catalyst → Outcome) joined by causal links ("Consequently", "This triggered") strictly inside the date range.',
    };
  }

  // 6. 12m Explain Why ("Explain why X in the years Y.")
  const whyMatch = s.match(
    /^(Explain\s+why\s+)(.+?)(\s+in\s+the\s+(?:years|period)\s+.+?)?(\.?)$/i,
  );
  if (whyMatch && family === 'causation') {
    const periodSpan = whyMatch[3]
      ? ` <span class="met-stem-lens">${escapeHtml(whyMatch[3].trim())}${escapeHtml(whyMatch[4])}</span>`
      : escapeHtml(whyMatch[4]);
    return {
      html: `${escapeHtml(whyMatch[1])}<span class="met-stem-topic">${escapeHtml(whyMatch[2])}</span>${periodSpan}`,
      trapWarning:
        '3-Reason PEEL Rule: Explain 3 distinct reasons WHY (including own knowledge beyond the 2 prompt bullets) — do not write a chronological story.',
    };
  }

  // 7. 4m / 8m Consequence ("Explain one/two consequences of X.")
  const consMatch = s.match(
    /^(Explain\s+(?:one|two)\s+(?:distinct\s+)?consequences?\s+of\s+)(.+?)(\.?)$/i,
  );
  if (consMatch) {
    return {
      html: `${escapeHtml(consMatch[1])}<span class="met-stem-topic">${escapeHtml(consMatch[2])}</span> <span class="met-stem-lens">[Focus: What happened AS A RESULT]</span>`,
      trapWarning:
        'Aftermath Rule: Explain what changed AFTER and BECAUSE of this event — score 0 if you only describe causes or what happened during the event itself.',
    };
  }

  // 8. 4m Thematic Comparison ("Explain one way in which X was similar/different in A and B.")
  const compMatch = s.match(
    /^(Explain\s+one\s+way\s+in\s+which\s+)(.+?)(\s+(?:was|were)\s+(?:similar|different).+?)(\.?)$/i,
  );
  if (compMatch) {
    return {
      html: `${escapeHtml(compMatch[1])}<span class="met-stem-topic">${escapeHtml(compMatch[2])}</span> <span class="met-stem-lens">${escapeHtml(compMatch[3].trim())}${escapeHtml(compMatch[4])}</span>`,
      trapWarning:
        'Both-Periods Rule: Give specific factual evidence from BOTH named eras — naming only one period caps you at 2/4.',
    };
  }

  return {
    html: escapeHtml(s),
    trapWarning: '',
  };
}

/**
 * Addition #2: Date-Fence Guardrail Builder.
 * Detects year spans in the question or lesson and shows Year 11 pupils which canonical events
 * sit INSIDE the fence (valid marks) vs OUTSIDE the fence (0 marks if used as a main paragraph).
 */
function parseYearRangeFromText(str) {
  const s = String(str || '');
  // Match c1250–c1500, 1964–67, 1948–1949, 1918-39
  const rangeMatch = s.match(/\bc?\.?(\d{4})\s*[–-]\s*c?\.?(\d{2,4})\b/i);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    let endRaw = rangeMatch[2];
    let end = parseInt(endRaw, 10);
    if (endRaw.length === 2) {
      end = Math.floor(start / 100) * 100 + end;
    }
    if (end >= start && start >= 1000 && end <= 2030) {
      return { label: `${rangeMatch[0].replace(/\s+/g, '')}`, start, end };
    }
  }
  const singleMatch = s.match(/\b(1[2-9]\d{2}|20[0-2]\d)\b/);
  if (singleMatch) {
    const yr = parseInt(singleMatch[1], 10);
    return { label: String(yr), start: yr, end: yr };
  }
  return null;
}

function buildQuestionDateFence(questionStem, lesson, lessonMeta, rawLessons) {
  const stemRange = parseYearRangeFromText(questionStem);
  const lessonRange = parseYearRangeFromText(lessonMeta?.lessonTitle || '');
  const activeRange = stemRange || lessonRange;
  if (!activeRange) return null;

  const insideItems = [];
  const stages = Array.isArray(lesson?.workbook_stages) ? lesson.workbook_stages : [];
  stages.forEach((st) => {
    const t = stripHtml(st?.title || '').trim();
    if (t && insideItems.length < 2) insideItems.push(t);
  });

  // Find a tempting neighbouring lesson strictly outside the date range
  let outsideExample = '';
  for (let i = 0; i < rawLessons.length; i++) {
    if (i === lessonMeta.lessonIndex) continue;
    const otherTitle = String(rawLessons[i]?.title || '');
    const otherRange = parseYearRangeFromText(otherTitle);
    if (
      otherRange &&
      (otherRange.end < activeRange.start - 1 || otherRange.start > activeRange.end + 1)
    ) {
      const cleanOther = otherTitle.replace(/^KT\s*\d+\.\d+\s*[:–-]\s*/i, '').trim();
      if (cleanOther) {
        outsideExample = `${cleanOther} (${otherRange.label})`;
        break;
      }
    }
  }

  if (insideItems.length === 0 && !outsideExample) return null;

  return {
    fenceLabel: activeRange.label,
    insideText: insideItems.join(' · '),
    outsideText: outsideExample,
  };
}

/**
 * Hydrates and normalizes the full Key Topic & Lesson Exam Directory for a GCSE course.
 */
export async function buildUnitExamDirectory(rawUnitId, { forceRefresh = false } = {}) {
  const unitId = resolveGcseExamUnitId(rawUnitId);
  if (!forceRefresh && directoryCache.has(unitId)) {
    return directoryCache.get(unitId);
  }

  const unitData = (await ensureUnitLoaded(unitId)) || {};
  const courseMeta = getGcseCourseMeta(unitId);
  const paperCode = getCanonicalGcsePaperCode(unitId);
  const rawLessons = Array.isArray(unitData.lessons) ? unitData.lessons : [];
  const groupings = Array.isArray(unitData.groupings) ? unitData.groupings : [];

  const ktMap = new Map();
  const normalizedLessons = [];
  const allQuestions = [];
  const tariffCounts = {
    all: 0,
    '4m': 0,
    '8m': 0,
    '12m': 0,
    '16m': 0,
  };

  rawLessons.forEach((lesson, lessonIndex) => {
    const lessonMeta = {
      ...parseLessonKeyTopicMeta(unitId, lesson, lessonIndex, groupings),
      lessonIndex,
    };

    const epContainer =
      lesson?.exam_practice && !Array.isArray(lesson.exam_practice) ? lesson.exam_practice : null;

    // Exclude pre-1945 background-only Lesson 0 (KT 1.0: 1915–39) on CME Option P5
    // so pupils never practise non-examined pre-specification exam questions.
    const isNonExaminedCmeBackground =
      unitId === 'cme_new' &&
      (lessonIndex === 0 || lesson?.id === 'lesson_0' || /^KT\s*1\.0\b/i.test(lesson?.title || ''));

    let rawPrimaryQs = isNonExaminedCmeBackground
      ? []
      : Array.isArray(lesson?.exam_practice)
        ? lesson.exam_practice
        : Array.isArray(lesson?.exam_practice?.questions)
          ? lesson.exam_practice.questions
          : [];

    const extraMocks = isNonExaminedCmeBackground
      ? []
      : getNonDuplicateExtraMockQuestions(unitId, lesson, rawPrimaryQs) || [];
    const combinedRaw = [
      ...rawPrimaryQs.map((q) => ({ ...q, _sourceOrigin: 'canonical' })),
      ...extraMocks.map((mq) => ({
        ...mq,
        _sourceOrigin: 'mock_bank',
        _isExtraMock: true,
        question: mq.questionText || mq.question || '',
        model: mq.modelAnswer || mq.model || '',
      })),
    ];

    const vocabChips = Array.isArray(lesson?.vocab)
      ? lesson.vocab
          .filter((v) => v && v.term)
          .map((v) => ({
            term: String(v.term).trim(),
            definition: stripHtml(v.definition || v.meaning || ''),
          }))
      : [];

    const lessonStages = Array.isArray(lesson?.workbook_stages) ? lesson.workbook_stages : [];

    const lessonQuestions = combinedRaw
      .map((rawQ, qIdx) => {
        const questionStem = cleanQuestionStem(
          rawQ.question || rawQ.questionText || rawQ.prompt || rawQ.text || '',
        );
        if (!questionStem) return null;

        const tariffMeta = normalizeExamTariff(rawQ);
        const { html: modelHtml, plain: plainModelText } = extractModelHtmlAndPlain(rawQ);
        if (!plainModelText) return null;

        const { stimulusBullets, sources } = resolveQuestionStimulusAndSources(
          rawQ,
          lesson,
          epContainer,
          rawPrimaryQs,
        );

        const indicativeContent = Array.isArray(rawQ.indicativeContent)
          ? rawQ.indicativeContent
          : Array.isArray(rawQ.mark_scheme)
            ? rawQ.mark_scheme
            : [];

        const starterSentence = rawQ?.scaffolding?.sentence_starters?.[0] || '';

        const examinerTip = stripHtml(
          rawQ.examiner_tip ||
            rawQ.examinerTips ||
            rawQ?.scaffolding?.guidance ||
            defaultExaminerTipForFamily(tariffMeta.family, tariffMeta.marks),
        );

        const lessonQuestionNum = qIdx + 1;
        const wagollSegments = buildWagollSegments(modelHtml, vocabChips, tariffMeta.family);

        const shortCleanTitle =
          lessonMeta.cleanTitle.length > 34
            ? `${lessonMeta.cleanTitle.slice(0, 32).trim()}…`
            : lessonMeta.cleanTitle;

        const stemHighlight = parseStemHighlight(questionStem, tariffMeta.family);
        const dateFence = buildQuestionDateFence(questionStem, lesson, lessonMeta, rawLessons);

        const baseInfo = {
          id: `${unitId}_l${lessonIndex}_q${lessonQuestionNum}`,
          unitId,
          lessonIndex,
          lessonId: lesson?.id || `lesson_${lessonIndex + 1}`,
          lessonCode: lessonMeta.lessonCode,
          lessonTitle: lessonMeta.lessonTitle,
          cleanLessonTitle: lessonMeta.cleanTitle,
          lessonShortTag: `${lessonMeta.lessonCode} · ${shortCleanTitle}`,
          ktId: lessonMeta.ktId,
          ktBadge: lessonMeta.ktBadge,
          ktLabel: lessonMeta.ktLabel,
          lessonQuestionNum,
          question: questionStem,
          stemHighlight,
          dateFence,
          marks: tariffMeta.marks,
          rawMarks: tariffMeta.rawMarks,
          spagMarks: tariffMeta.spagMarks,
          tariffKey: tariffMeta.tariffKey,
          badgeLabel: tariffMeta.badgeLabel,
          minsSuggested: tariffMeta.minsSuggested,
          family: tariffMeta.family,
          isExtraPractice: Boolean(rawQ._isExtraMock),
          stimulusBullets,
          sources,
          modelHtml,
          plainModelText,
          wagollSegments,
          examinerTip,
          starterSentence,
          indicativeContent,
          vocabChips,
        };

        const drills = {
          peel: buildPeelDrill(plainModelText, questionStem, vocabChips, lessonStages),
          plan: buildPlanDrill(baseInfo, lesson, rawLessons),
          examiner: buildExaminerDrill(rawQ, baseInfo),
          blurt: buildBlurtDrill(baseInfo, lesson),
        };

        const searchHaystack = [
          questionStem,
          lessonMeta.lessonTitle,
          lessonMeta.ktLabel,
          tariffMeta.badgeLabel,
          ...stimulusBullets,
          ...vocabChips.map((v) => v.term),
        ]
          .join(' ')
          .toLowerCase();

        return {
          ...baseInfo,
          drills,
          searchHaystack,
        };
      })
      .filter(Boolean);

    lessonQuestions.forEach((nq, idx) => {
      nq.lessonQuestionNum = idx + 1;
      nq.id = `${unitId}_l${lessonIndex}_q${idx + 1}`;
      tariffCounts.all += 1;
      if (tariffCounts[nq.tariffKey] !== undefined) {
        tariffCounts[nq.tariffKey] += 1;
      }
      allQuestions.push(nq);
    });

    const lessonEntry = {
      lessonIndex,
      lessonId: lesson?.id || `lesson_${lessonIndex + 1}`,
      lessonCode: lessonMeta.lessonCode,
      lessonTitle: lessonMeta.lessonTitle,
      cleanTitle: lessonMeta.cleanTitle,
      ktId: lessonMeta.ktId,
      ktBadge: lessonMeta.ktBadge,
      ktLabel: lessonMeta.ktLabel,
      questionCount: lessonQuestions.length,
      questions: lessonQuestions,
    };

    normalizedLessons.push(lessonEntry);

    if (!ktMap.has(lessonMeta.ktId)) {
      ktMap.set(lessonMeta.ktId, {
        ktId: lessonMeta.ktId,
        ktBadge: lessonMeta.ktBadge,
        ktTitle: lessonMeta.ktTitle,
        ktLabel: lessonMeta.ktLabel,
        lessons: [],
      });
    }
    ktMap.get(lessonMeta.ktId).lessons.push(lessonEntry);
  });

  const directory = {
    unitId,
    courseMeta,
    paperCode,
    totalQuestions: allQuestions.length,
    tariffCounts,
    keyTopics: Array.from(ktMap.values()),
    lessons: normalizedLessons,
    allQuestions,
  };

  directoryCache.set(unitId, directory);
  return directory;
}
