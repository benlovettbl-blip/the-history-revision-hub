#!/usr/bin/env node
/**
 * KS2 & KS3 Literary Companion Engine Validator (`scripts/audit_literary_companions.cjs`)
 *
 * Enforces:
 * 1. 100% 1:1 lesson parity across all 20 KS2 & KS3 units (119 lessons) and 0 orphaned GCSE arrays.
 * 2. Age-calibrated oral readability ceilings (word budget, avg sentence length, max sentence length, FK Grade).
 * 3. 3-Voice Literary Diet rotation (True Historical Stories + Public-Domain Literature/Verse/Myth + Intimate Eyewitness).
 * 4. Required schema fields: vocabVault (with pronunciation at KS2), parent_discussion (3), story_check (3 MCQs), monday_cold_call.
 * 5. Visual & commercial rights integrity (`cover_image` exists on disk).
 *
 * Usage:
 *   node scripts/audit_literary_companions.cjs            # Audits all 20 KS2/KS3 units + 6 GCSE units
 *   node scripts/audit_literary_companions.cjs <unit_id>  # Audits a single unit
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const PUBLIC_DIR = path.join(ROOT, 'public');

const COHORT_SPECS = {
  ks2: {
    label: 'KS2 (Ages 9–11)',
    minWords: 140,
    maxWords: 215,
    maxAvgSent: 15.8,
    maxSingleSent: 26,
    maxFk: 8.2,
    requirePronunciation: true,
    units: [
      'ks2_stone_to_iron_age',
      'ks2_ancient_egypt',
      'ks2_ancient_greece',
      'ks2_romans',
      'ks2_anglo_saxons_vikings',
      'ks2_early_islamic_baghdad',
      'ks2_maya_civilisation',
      'ks2_ww2',
    ],
  },
  y7: {
    label: 'KS3 Year 7 (Ages 11–12)',
    minWords: 175,
    maxWords: 265,
    maxAvgSent: 18.2,
    maxSingleSent: 30,
    maxFk: 9.5,
    requirePronunciation: false,
    units: ['water_and_sanitation', 'medieval_england'],
  },
  y8: {
    label: 'KS3 Year 8 (Ages 12–13)',
    minWords: 190,
    maxWords: 285,
    maxAvgSent: 19.8,
    maxSingleSent: 32,
    maxFk: 10.5,
    requirePronunciation: false,
    units: [
      'monarchy_religion_power',
      'first_british_empire',
      'industrialisation_and_empire',
      'second_british_empire',
      'australia',
    ],
  },
  y9: {
    label: 'KS3 Year 9 (Ages 13–14)',
    minWords: 205,
    maxWords: 320,
    maxAvgSent: 21.8,
    maxSingleSent: 35,
    maxFk: 11.5,
    requirePronunciation: false,
    units: ['great_war', 'great_war_part2', 'the_shoah', 'cold_war', 'post_war_britain'],
  },
};

const GCSE_UNITS = [
  'edexcel_medicine',
  'eee',
  'gcse_cold_war',
  'cme_new',
  'weimar_nazi_germany',
  'usa',
];

function getCohortForUnit(unitId) {
  for (const [key, spec] of Object.entries(COHORT_SPECS)) {
    if (spec.units.includes(unitId)) return { key, ...spec };
  }
  return null;
}

function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

function analyzeProse(rawExtract) {
  const withoutGlossary = String(rawExtract || '')
    .replace(/<div class="reading-glossary"[\s\S]*?<\/div>/gi, '')
    .replace(/<div style="background: #f8fafc;[\s\S]*?<\/div>/gi, '')
    // Treat stanza line breaks ending without punctuation as clause pauses for oral cadence check
    .replace(/<br\s*\/?>/gi, '. ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = withoutGlossary.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w));
  const wordCount = words.length;

  // Protect common titles/initials before splitting sentences
  const norm = withoutGlossary
    .replace(/\b(Dr|Mr|Mrs|Ms|St| King|Queen|Prof|Gen|Adm|Capt|Sgt|Lt|Rev|No|Vol|c)\.\s+/gi, '$1_DOT_ ')
    .replace(/\b([A-Z])\.\s+/g, '$1_DOT_ ');

  const rawSentences = norm
    .split(/[.!?]+/)
    .map((s) => s.replace(/_DOT_/g, '.').trim())
    .filter((s) => s.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length >= 3);

  const sentLengths = rawSentences.map(
    (s) => s.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length
  );
  const sentCount = Math.max(1, sentLengths.length);
  const avgSent = +(wordCount / sentCount).toFixed(1);
  const maxSent = sentLengths.length ? Math.max(...sentLengths) : wordCount;

  let syllables = 0;
  for (const w of words) syllables += countSyllables(w);
  const fk = wordCount
    ? +(0.39 * (wordCount / sentCount) + 11.8 * (syllables / wordCount) - 15.59).toFixed(1)
    : 0;

  return { wordCount, avgSent, maxSent, fk };
}

function resolveImageExists(imgPath) {
  if (!imgPath) return false;
  const rel = String(imgPath).replace(/^\//, '');
  return (
    fs.existsSync(path.join(PUBLIC_DIR, rel)) ||
    fs.existsSync(path.join(ROOT, rel))
  );
}

function auditUnit(unitId, errors, summaryTable) {
  const cohort = getCohortForUnit(unitId);
  if (!cohort) {
    errors.push(`[${unitId}] Unknown KS2/KS3 unit ID.`);
    return;
  }

  const jsonPath = path.join(DATA_DIR, `${unitId}.json`);
  if (!fs.existsSync(jsonPath)) {
    errors.push(`[${unitId}] Missing data/${unitId}.json`);
    return;
  }

  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const lessons = Array.isArray(raw.lessons) ? raw.lessons : [];
  const gr = Array.isArray(raw.guided_reading) ? raw.guided_reading : [];

  if (gr.length !== lessons.length) {
    errors.push(
      `[${unitId}] Lesson parity failure: ${lessons.length} lessons vs ${gr.length} guided_reading items.`
    );
  }

  const modesUsed = new Set();
  const wordCounts = [];
  const avgSents = [];
  const fks = [];

  gr.forEach((item, idx) => {
    const tag = `[${unitId} L${idx + 1}]`;
    const mode = item.literary_mode || item.provenance_tier || '';
    if (!['storied_micro_history', 'verbatim_literature', 'intimate_eyewitness', 'verbatim_primary', 'adapted_primary', 'scholarly_summary'].includes(mode)) {
      errors.push(`${tag} Invalid or missing literary_mode / provenance_tier: "${mode}"`);
    }
    modesUsed.add(item.literary_mode || item.provenance_tier);

    for (const reqField of ['book_title', 'author', 'author_context', 'provenance_note', 'cover_image', 'cover_caption', 'extract']) {
      if (!item[reqField] || String(item[reqField]).trim().length < 5) {
        errors.push(`${tag} Missing or empty required field "${reqField}"`);
      }
    }

    if (item.cover_image && !resolveImageExists(item.cover_image)) {
      errors.push(`${tag} Missing cover_image on disk: ${item.cover_image}`);
    }

    if (/\*[^*\n]+\*/.test(item.extract || '')) {
      errors.push(`${tag} Raw markdown asterisks (*...*) found in extract — use <em>...</em> or <strong>...</strong> HTML tags instead`);
    }

    const vocab = Array.isArray(item.vocabVault) ? item.vocabVault : [];
    if (vocab.length < 4 || vocab.length > 6) {
      errors.push(`${tag} vocabVault must have 4–6 items (found ${vocab.length})`);
    }
    if (cohort.requirePronunciation) {
      const hasAnyPron = vocab.some((v) => v.pronunciation && String(v.pronunciation).trim().length > 1);
      if (!hasAnyPron) {
        errors.push(`${tag} KS2 companion must include phonetic "pronunciation" guides in vocabVault`);
      }
    }

    const pDisc = Array.isArray(item.parent_discussion) ? item.parent_discussion : [];
    if (pDisc.length !== 3) {
      errors.push(`${tag} parent_discussion must have exactly 3 items (found ${pDisc.length})`);
    }

    const sCheck = Array.isArray(item.story_check) ? item.story_check : [];
    if (sCheck.length !== 3) {
      errors.push(`${tag} story_check must have exactly 3 multiple-choice questions (found ${sCheck.length})`);
    } else {
      sCheck.forEach((q, qi) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length < 3 || typeof q.correctIndex !== 'number') {
          errors.push(`${tag} story_check[${qi}] invalid MCQ structure`);
        }
      });
    }

    // Kitchen-Table Extract-Grounding Gate:
    // Parents and pupils must be able to answer every parent_discussion and story_check item purely
    // from the read-aloud extract + vocabVault (zero unmentioned Scene/Chapter refs, unmentioned 4-digit
    // years, cover-picture quizzes, or intimidating "Why do historians..." stems).
    const storyCorpusLow = (
      String(item.extract || '').replace(/<[^>]+>/g, ' ') +
      ' ' +
      vocab.map((v) => `${v.term || ''} ${v.def || ''}`).join(' ')
    )
      .replace(/\s+/g, ' ')
      .toLowerCase();

    const BANNED_PARENT_STEM_RX =
      /\b(?:why do historians|how do historians|what do historians|why do archaeologists|how do archaeologists|what do archaeologists|historiograph\w*|corroborat\w*|security dilemma|look closely at the [^?]*cover|on the cover)\b/i;

    const checkKitchenTableText = (label, txt) => {
      const s = String(txt || '');
      const banned = s.match(BANNED_PARENT_STEM_RX);
      if (banned && !storyCorpusLow.includes(banned[0].toLowerCase())) {
        errors.push(`${tag} ${label} uses intimidating/external framing not in extract: "${banned[0]}"`);
      }
      const refs = [
        ...s.matchAll(/\b(?:Scene|Chapter|Folio|Clause|Article|Panel)\s+\d+|\b(1\d{3}|20\d{2})\b/gi),
      ];
      for (const m of refs) {
        if (!storyCorpusLow.includes(m[0].toLowerCase())) {
          errors.push(`${tag} ${label} references "${m[0]}" which does NOT appear in the read-aloud extract`);
        }
      }
    };

    pDisc.forEach((pd, qi) => {
      checkKitchenTableText(`parent_discussion[${qi}].question`, pd.question);
      checkKitchenTableText(`parent_discussion[${qi}].answer`, pd.answer);
    });
    sCheck.forEach((sc, qi) => {
      checkKitchenTableText(`story_check[${qi}].question`, sc.question);
      if (Array.isArray(sc.options) && typeof sc.correctIndex === 'number') {
        checkKitchenTableText(`story_check[${qi}].correctOption`, sc.options[sc.correctIndex]);
      }
    });

    if (!item.monday_cold_call || !item.monday_cold_call.question || !item.monday_cold_call.answer) {
      errors.push(`${tag} Missing monday_cold_call { question, answer }`);
    }

    const metrics = analyzeProse(item.extract);
    wordCounts.push(metrics.wordCount);
    avgSents.push(metrics.avgSent);
    fks.push(metrics.fk);

    if (metrics.wordCount < cohort.minWords || metrics.wordCount > cohort.maxWords) {
      errors.push(
        `${tag} Word count ${metrics.wordCount}w outside ${cohort.label} budget (${cohort.minWords}–${cohort.maxWords}w)`
      );
    }
    if (metrics.avgSent > cohort.maxAvgSent) {
      errors.push(
        `${tag} Avg sentence length ${metrics.avgSent}w exceeds ${cohort.label} ceiling (${cohort.maxAvgSent}w)`
      );
    }
    if (metrics.maxSent > cohort.maxSingleSent) {
      errors.push(
        `${tag} Single sentence of ${metrics.maxSent}w exceeds ${cohort.label} max (${cohort.maxSingleSent}w)`
      );
    }
    if (metrics.fk > cohort.maxFk) {
      errors.push(
        `${tag} Flesch-Kincaid Grade ${metrics.fk} exceeds ${cohort.label} ceiling (${cohort.maxFk})`
      );
    }
  });

  if (unitId !== 'the_shoah' && gr.length >= 5 && modesUsed.size < 2) {
    errors.push(
      `[${unitId}] Genre monoculture: unit uses only 1 literary mode (${Array.from(modesUsed).join(', ')}). Must mix at least 2 of the 3 Literary Companion voices.`
    );
  }

  const avg = (arr) => (arr.length ? +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0);
  summaryTable.push({
    unit: unitId,
    cohort: cohort.key.toUpperCase(),
    items: `${gr.length}/${lessons.length}`,
    avgWords: Math.round(avg(wordCounts)),
    avgSentW: avg(avgSents),
    avgFK: avg(fks),
    modes: Array.from(modesUsed).length,
  });
}

function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const errors = [];
  const summaryTable = [];

  if (args.length > 0) {
    for (const u of args) auditUnit(u, errors, summaryTable);
  } else {
    for (const spec of Object.values(COHORT_SPECS)) {
      for (const u of spec.units) auditUnit(u, errors, summaryTable);
    }
    for (const gcse of GCSE_UNITS) {
      const p = path.join(DATA_DIR, `${gcse}.json`);
      if (fs.existsSync(p)) {
        const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
        if (Array.isArray(raw.guided_reading) && raw.guided_reading.length > 0) {
          errors.push(`[${gcse}] Orphaned GCSE guided_reading array found (${raw.guided_reading.length} items) — run sync_literary_companion.cjs --strip-gcse`);
        }
      }
    }
  }

  console.table(summaryTable);
  if (errors.length > 0) {
    console.error(`\n❌ Literary Companion Audit Failed (${errors.length} issue(s)):`);
    errors.slice(0, 60).forEach((e) => console.error('  -', e));
    if (errors.length > 60) console.error(`  ...and ${errors.length - 60} more.`);
    process.exit(1);
  }
  console.log('\n✅ All audited Literary Companions passed parity, 3-Voice variety, schema, and oral readability gates!');
}

main();
