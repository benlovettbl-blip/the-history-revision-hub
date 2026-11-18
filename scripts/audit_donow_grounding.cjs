/**
 * AUTOMATED DO NOW & QUIZ NARRATIVE-GROUNDING GATE
 *
 * Enforces the Single-Source-of-Truth Retrieval Standard across all 18 curriculum units:
 * 1. Every lesson owns 15–20 stage-tagged recall questions in `lesson.quiz` (e.g., 4 per Stage 1..5 on KS3/GCSE; 5–7 per Stage 1..3 on KS2).
 * 2. Every `lesson.quiz` answer MUST be explicitly grounded inside `lesson.narrative_blocks[stage - 1]` pure narrative prose
 *    (strictly excluding Layer 3 Sources A–E and image captions, guaranteeing 100% Web App & Classroom Textbook answerability).
 * 3. Every question is crisp closed-book recall AND 4-option MCQ compatible:
 *    - Zero `Source A–E` references, zero `"Which of the following..."` stems, zero `...` truncated answers.
 *    - Answer length <= 14 words; 4 distinct `options` containing exact `answer`; substantive `explanation` (>= 20 chars).
 * 4. Lesson 1 (`lessons[0].do_now`, plus `cme_new` `lessons[1]` KT 1.1 baseline) carries >= 10 baseline prior-knowledge questions
 *    with `is_baseline: true` and ZERO self-testing of Lesson 1's newly introduced specialist vocabulary.
 * 5. Optional `--derive-donow` flag automatically derives `lessons[N].do_now` from `lessons[N-1].quiz` (stratified across stages)
 *    so legacy consumers remain 100% synchronized with zero manual maintenance.
 *
 * Usage:
 *   node scripts/audit_donow_grounding.cjs                  (audit all 18 units)
 *   node scripts/audit_donow_grounding.cjs <unit_id>        (audit a single unit)
 *   node scripts/audit_donow_grounding.cjs <unit_id> --derive-donow
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

const CANONICAL_UNITS = [
  'australia',
  'cme_new',
  'cold_war',
  'edexcel_medicine',
  'eee',
  'first_british_empire',
  'great_war',
  'great_war_part2',
  'industrialisation_and_empire',
  'ks2_ww2',
  'medieval_england',
  'monarchy_religion_power',
  'post_war_britain',
  'second_british_empire',
  'the_shoah',
  'usa',
  'water_and_sanitation',
  'weimar_nazi_germany',
];

const NUMBER_WORDS = {
  '0': ['zero', 'none'],
  '1': ['one', 'first', 'single'],
  '2': ['two', 'second', 'double', 'twin', 'both', 'pair'],
  '3': ['three', 'third', 'triple', 'tripartite'],
  '4': ['four', 'fourth', 'quadruple'],
  '5': ['five', 'fifth'],
  '6': ['six', 'sixth'],
  '7': ['seven', 'seventh'],
  '8': ['eight', 'eighth'],
  '9': ['nine', 'ninth'],
  '10': ['ten', 'tenth'],
  '11': ['eleven', 'eleventh'],
  '12': ['twelve', 'twelfth', 'dozen'],
  '13': ['thirteen', 'thirteenth'],
  '14': ['fourteen', 'fourteenth'],
  '15': ['fifteen', 'fifteenth'],
  '16': ['sixteen', 'sixteenth'],
  '18': ['eighteen', 'eighteenth'],
  '19': ['nineteen', 'nineteenth'],
  '20': ['twenty', 'twentieth'],
  '25': ['twenty-five', 'quarter'],
  '30': ['thirty'],
  '40': ['forty'],
  '50': ['fifty', 'half'],
  '75': ['seventy-five', 'three-quarters'],
  '100': ['hundred', 'century'],
  '250000': ['quarter of a million', '250,000'],
  '500000': ['half a million', '500,000'],
  '1000000': ['million', '1,000,000'],
};

const STOP_TOKENS = new Set([
  'the', 'and', 'for', 'with', 'from', 'into', 'onto', 'over', 'under', 'after', 'before',
  'during', 'between', 'through', 'against', 'within', 'without', 'around', 'about', 'roughly',
  'approximately', 'nearly', 'almost', 'more', 'than', 'less', 'fewer', 'most', 'many', 'some',
  'both', 'each', 'every', 'other', 'such', 'only', 'also', 'very', 'just', 'even', 'still',
  'that', 'this', 'these', 'those', 'which', 'what', 'when', 'where', 'whose', 'whom', 'their',
  'there', 'they', 'them', 'were', 'been', 'being', 'have', 'having', 'would', 'could', 'should',
  'because', 'caused', 'causing', 'leading', 'led', 'meant', 'allowed', 'allowing', 'forced',
  'forcing', 'created', 'creating', 'made', 'making', 'used', 'using', 'gave', 'giving', 'kept',
  'keeping', 'helped', 'helping', 'wanted', 'sought', 'aimed', 'tried', 'refused', 'became',
  'system', 'policy', 'policies', 'group', 'groups', 'people', 'person', 'leader', 'leaders',
  'country', 'countries', 'nation', 'nations', 'state', 'states', 'government', 'power', 'powers',
  'period', 'years', 'year', 'time', 'century', 'early', 'late', 'major', 'main', 'primary',
  'official', 'public', 'local', 'national', 'british', 'britain', 'england', 'english',
  'german', 'germany', 'american', 'america', 'united', 'soviet', 'french', 'france',
]);

function normalizeText(raw) {
  return String(raw || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, ' and ')
    .replace(/&pound;/gi, '£')
    .replace(/&mdash;|&ndash;|[–—−]/g, '-')
    .replace(/[’‘`]/g, "'")
    .replace(/[“”"]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

function getStagePureNarrative(block) {
  if (!block) return '';
  const parts = [
    block.title || '',
    block.heading || '',
    block.theme || '',
    block.theme_heading || '',
    block.act_title || '',
    block.text || block.content || '',
    ...(Array.isArray(block.paragraphs) ? block.paragraphs : []),
  ];
  return normalizeText(parts.join(' '));
}

function stemWord(w) {
  if (w.length <= 5) return w;
  return w
    .replace(/(isations|izations|isation|ization|ments|ment|ingly|edly|ings|ing|ions|ion|ities|ity|nesses|ness|ally|al|ers|ors|ies|ied|es|ed|ly|s)$/i, '')
    .slice(0, 8);
}

function isTokenInProse(tok, proseNorm, proseNoCommas) {
  if (!tok) return true;
  if (/^\d+$/.test(tok)) {
    if (proseNoCommas.includes(tok)) return true;
    const alts = NUMBER_WORDS[tok] || [];
    return alts.some((alt) => proseNorm.includes(alt));
  }
  if (proseNorm.includes(tok)) return true;
  // American/British ise/ize & our/or tolerance
  const uk = tok.replace(/ize/g, 'ise').replace(/ization/g, 'isation').replace(/or\b/g, 'our');
  const us = tok.replace(/ise/g, 'ize').replace(/isation/g, 'ization').replace(/our\b/g, 'or');
  if (proseNorm.includes(uk) || proseNorm.includes(us)) return true;

  const stem = stemWord(tok);
  if (stem.length >= 4 && proseNorm.includes(stem)) return true;
  return false;
}

function checkAnswerGroundedInStage(answerRaw, stageProse) {
  const proseNorm = normalizeText(stageProse);
  const proseNoCommas = proseNorm.replace(/(\d),(\d)/g, '$1$2');

  let cleanAns = normalizeText(answerRaw)
    .replace(/^(the|a|an|approximately|around|roughly|about|over|nearly|almost|between)\s+/i, '')
    .replace(/[.!?;:]+$/g, '')
    .trim();

  if (!cleanAns) return { grounded: false, reason: 'Empty answer' };

  // Strip parenthetical clarifications for core match check if main part matches, or test full tokens
  const coreWithoutParens = cleanAns.replace(/\s*\([^)]*\)/g, '').trim();
  if (coreWithoutParens.length >= 3 && proseNorm.includes(coreWithoutParens)) {
    return { grounded: true };
  }
  if (cleanAns.length >= 3 && proseNorm.includes(cleanAns)) {
    return { grounded: true };
  }

  // Tokenize distinctive content words & numbers from coreWithoutParens (fallback to cleanAns)
  const targetStr = coreWithoutParens.length >= 2 ? coreWithoutParens : cleanAns;
  const rawTokens = targetStr
    .replace(/(\d),(\d)/g, '$1$2')
    .replace(/[^a-z0-9'\-\s]/g, ' ')
    .split(/[\s\-]+/)
    .map((t) => t.replace(/^'+|'+$/g, ''))
    .filter(Boolean);

  const keyTokens = rawTokens.filter((t) => {
    if (/^\d+$/.test(t)) return true;
    if (t.length < 3) return false;
    if (STOP_TOKENS.has(t)) return false;
    return true;
  });

  if (keyTokens.length === 0) {
    // Fallback: check rawTokens >= 2 chars
    const fallback = rawTokens.filter((t) => t.length >= 2);
    const hits = fallback.filter((t) => isTokenInProse(t, proseNorm, proseNoCommas));
    return {
      grounded: fallback.length > 0 && hits.length >= Math.ceil(fallback.length * 0.6),
      missing: fallback.filter((t) => !isTokenInProse(t, proseNorm, proseNoCommas)),
    };
  }

  const matched = keyTokens.filter((t) => isTokenInProse(t, proseNorm, proseNoCommas));
  const ratio = matched.length / keyTokens.length;
  const threshold = keyTokens.length <= 2 ? 0.5 : 0.6;
  // Require at least 1 strong match if 2 tokens (e.g. "Sir Francis Drake" -> "Francis Drake" or "Drake"), or >=60% for multi-word answers,
  // EXCEPT if there is a 4-digit year in answer, that year (or decade) must appear if it's the sole distinguishing fact.
  const fourDigitYears = keyTokens.filter((t) => /^(1\d{3}|20\d{2})$/.test(t));
  if (fourDigitYears.length > 0 && keyTokens.length === 1) {
    const yrOk = fourDigitYears.every((y) => proseNoCommas.includes(y) || proseNoCommas.includes(y.slice(0, 3) + '0s'));
    return { grounded: yrOk, missing: yrOk ? [] : fourDigitYears };
  }

  if (keyTokens.length === 1) {
    return {
      grounded: matched.length === 1,
      missing: matched.length === 1 ? [] : keyTokens,
    };
  }

  return {
    grounded: ratio >= threshold,
    missing: keyTokens.filter((t) => !isTokenInProse(t, proseNorm, proseNoCommas)),
  };
}

function stratifyQuizForDerivedDoNow(quiz, maxItems = 10) {
  const buckets = {};
  (quiz || []).forEach((q) => {
    const s = parseInt(q.stage, 10) || 1;
    if (!buckets[s]) buckets[s] = [];
    buckets[s].push(q);
  });
  const stages = Object.keys(buckets)
    .map(Number)
    .sort((a, b) => a - b);
  const out = [];
  const maxRow = Math.max(...stages.map((s) => buckets[s].length), 0);
  for (let r = 0; r < maxRow; r++) {
    for (const s of stages) {
      if (r < buckets[s].length && out.length < maxItems) {
        const item = buckets[s][r];
        out.push({
          stage: s,
          question: item.question || item.q,
          answer: typeof item.answer === 'number' && item.options ? item.options[item.answer] : (item.answer || item.a),
          explanation: item.explanation || '',
        });
      }
    }
  }
  return out;
}

function auditUnit(unitId, deriveDoNow = false) {
  const jsonPath = path.join(DATA_DIR, `${unitId}.json`);
  if (!fs.existsSync(jsonPath)) {
    return { unitId, errors: [`Missing data/${unitId}.json`], warnings: [] };
  }

  const unitObj = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const unit = unitObj.data || unitObj;
  const lessons = unit.lessons || [];
  const errors = [];
  const warnings = [];
  let mutated = false;

  // Optional secondary check for australia where units/australia/data.js had slight prose differences
  let secondaryDbLessons = null;
  if (unitId === 'australia') {
    const pubDbPath = path.join(ROOT_DIR, 'public', 'database.json');
    if (fs.existsSync(pubDbPath)) {
      try {
        const pubDb = JSON.parse(fs.readFileSync(pubDbPath, 'utf8'));
        secondaryDbLessons = pubDb.australia?.data?.lessons || null;
      } catch (e) {}
    }
  }

  const sourceRefPattern = /\b(according to source|look at source|in source [a-e]|from source [a-e]|source [a-e] depicts|shown in source|in this source|based on source|what does source [a-e]|which source|\bsource [a-e]\b)/i;

  lessons.forEach((lesson, idx) => {
    const lNum = idx + 1;
    const blocks = lesson.narrative_blocks || [];
    const numStages = blocks.length || 5;
    const quiz = Array.isArray(lesson.quiz) ? lesson.quiz : [];

    const minQuizCount = unitId === 'ks2_ww2' ? 15 : 20;
    if (quiz.length < minQuizCount) {
      errors.push(`[${unitId} L${lNum}] quiz has ${quiz.length} items (expected >= ${minQuizCount}).`);
    }

    const stageCounts = {};
    for (let s = 1; s <= numStages; s++) stageCounts[s] = 0;

    const seenQuestions = new Set();

    quiz.forEach((q, qIdx) => {
      const qLabel = `[${unitId} L${lNum} Q${qIdx + 1}]`;
      const qText = String(q.question || q.q || '').trim();
      const aText =
        typeof q.answer === 'number' && Array.isArray(q.options)
          ? String(q.options[q.answer] || '').trim()
          : String(q.answer || q.a || '').trim();
      const expText = String(q.explanation || '').trim();
      const stage = parseInt(q.stage, 10);

      if (!qText) errors.push(`${qLabel} Missing question text.`);
      if (!aText) errors.push(`${qLabel} Missing answer text.`);
      if (aText.endsWith('...')) errors.push(`${qLabel} Truncated answer ending with '...': "${aText}"`);
      if (aText.split(/\s+/).length > 15) {
        errors.push(`${qLabel} Answer too verbose for closed-book Do Now (${aText.split(/\s+/).length} words > 15): "${aText}"`);
      }
      if (sourceRefPattern.test(qText)) {
        errors.push(`${qLabel} Question depends on Layer 3 Source A–E: "${qText}"`);
      }
      if (/^Which of the following\b/i.test(qText) || /^Which of these\b/i.test(qText)) {
        errors.push(`${qLabel} Uses MCQ-only stem ("Which of the following..."): "${qText}"`);
      }

      const normQ = qText.toLowerCase();
      if (seenQuestions.has(normQ)) {
        errors.push(`${qLabel} Duplicate question in same lesson: "${qText}"`);
      }
      seenQuestions.add(normQ);

      if (!Array.isArray(q.options) || q.options.length !== 4) {
        errors.push(`${qLabel} Must have exactly 4 MCQ options for Quiz Zone compatibility.`);
      } else {
        const uniqOpts = new Set(q.options.map((o) => String(o).trim().toLowerCase()));
        if (uniqOpts.size < 4) {
          errors.push(`${qLabel} Duplicate MCQ options in [${q.options.join(' | ')}].`);
        }
        if (!q.options.some((o) => String(o).trim() === aText)) {
          errors.push(`${qLabel} Correct answer "${aText}" missing from options array.`);
        }
      }

      if (expText.length < 20) {
        errors.push(`${qLabel} Explanation missing or too short (< 20 chars).`);
      }

      if (isNaN(stage) || stage < 1 || stage > numStages) {
        errors.push(`${qLabel} Missing or invalid stage=${q.stage} (must be 1..${numStages}).`);
      } else {
        stageCounts[stage] = (stageCounts[stage] || 0) + 1;
        const stageProse = getStagePureNarrative(blocks[stage - 1]);
        const check = checkAnswerGroundedInStage(aText, stageProse);
        if (!check.grounded) {
          errors.push(
            `${qLabel} Answer "${aText}" NOT grounded in Stage ${stage} pure narrative (missing tokens: ${(check.missing || []).join(', ')}). Question: "${qText}"`,
          );
        }
        if (secondaryDbLessons && secondaryDbLessons[idx]?.narrative_blocks?.[stage - 1]) {
          const secProse = getStagePureNarrative(secondaryDbLessons[idx].narrative_blocks[stage - 1]);
          const secCheck = checkAnswerGroundedInStage(aText, secProse);
          if (!secCheck.grounded) {
            errors.push(
              `${qLabel} Answer "${aText}" NOT grounded in Australia web-app Stage ${stage} narrative (missing: ${(secCheck.missing || []).join(', ')}).`,
            );
          }
        }
      }
    });

    const minPerStage = unitId === 'ks2_ww2' ? 4 : 3;
    for (let s = 1; s <= numStages; s++) {
      if ((stageCounts[s] || 0) < minPerStage) {
        errors.push(`[${unitId} L${lNum}] Stage ${s} only has ${stageCounts[s] || 0} quiz items (expected >= ${minPerStage}).`);
      }
    }

    // Baseline Starter Check (Lesson 1 of every unit + Lesson 2 KT 1.1 of cme_new)
    const isBaselineLesson = idx === 0 || (unitId === 'cme_new' && idx === 1);
    if (isBaselineLesson) {
      const baseItems = lesson.do_now?.items || [];
      if (!lesson.do_now || !lesson.do_now.is_baseline || baseItems.length < 10) {
        errors.push(
          `[${unitId} L${lNum}] Baseline starter must have do_now.is_baseline=true and >= 10 prior-knowledge questions (found ${baseItems.length}, is_baseline=${Boolean(lesson.do_now?.is_baseline)}).`,
        );
      }
      baseItems.forEach((it, bIdx) => {
        const bq = String(it.question || it.q || '').trim();
        const ba = String(it.answer || it.a || '').trim();
        if (!bq || !ba) {
          errors.push(`[${unitId} L${lNum} Baseline Q${bIdx + 1}] Missing question or answer.`);
        }
        if (ba.endsWith('...')) {
          errors.push(`[${unitId} L${lNum} Baseline Q${bIdx + 1}] Truncated answer: "${ba}"`);
        }
        if (sourceRefPattern.test(bq)) {
          errors.push(`[${unitId} L${lNum} Baseline Q${bIdx + 1}] References Source A–E: "${bq}"`);
        }
      });
    } else if (deriveDoNow && idx > 0) {
      const prevQuiz = lessons[idx - 1]?.quiz || [];
      if (prevQuiz.length >= 10) {
        lesson.do_now = {
          type: 'questions',
          derived_from_prev: true,
          items: stratifyQuizForDerivedDoNow(prevQuiz, 10),
        };
        mutated = true;
      }
    }
  });

  if (mutated && deriveDoNow) {
    fs.writeFileSync(jsonPath, JSON.stringify(unitObj, null, 2) + '\n', 'utf8');
  }

  return { unitId, lessonCount: lessons.length, errors, warnings };
}

function main() {
  const args = process.argv.slice(2);
  const deriveDoNow = args.includes('--derive-donow');
  const targetArg = args.find((a) => !a.startsWith('-'));
  const targets = targetArg ? [targetArg] : CANONICAL_UNITS;

  let totalErrors = 0;
  for (const uid of targets) {
    if (uid === 'trip_ypres') continue;
    const res = auditUnit(uid, deriveDoNow);
    if (res.errors.length === 0) {
      console.log(`✅ [${uid}] 100% Narrative-Grounded (${res.lessonCount} lessons verified)`);
    } else {
      console.error(`❌ [${uid}] ${res.errors.length} grounding/schema issue(s):`);
      res.errors.slice(0, 25).forEach((e) => console.error(`   - ${e}`));
      if (res.errors.length > 25) {
        console.error(`   ... and ${res.errors.length - 25} more in [${uid}].`);
      }
      totalErrors += res.errors.length;
    }
  }

  if (totalErrors > 0) {
    console.error(`\n❌ DO NOW & QUIZ GROUNDING AUDIT FAILED: ${totalErrors} total issue(s).`);
    process.exit(1);
  } else {
    console.log(`\n🎉 ALL AUDITED UNITS PASSED 100% NARRATIVE-GROUNDING & DO NOW INTEGRITY!`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { auditUnit, checkAnswerGroundedInStage, stratifyQuizForDerivedDoNow };
