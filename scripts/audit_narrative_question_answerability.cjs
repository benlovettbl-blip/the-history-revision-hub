/**
 * scripts/audit_narrative_question_answerability.cjs
 *
 * AUTOMATED NARRATIVE QUESTION ANSWERABILITY, ACCESSIBILITY & PARITY GATE
 *
 * Enforces the 7 Sustainability & Year-Group Progression Invariants across curriculum units:
 *   1. 1-to-1 Stage Parity & Valid Enquiry Question (`?`, 15..82 chars, zero placeholders, zero duplicate-word typos).
 *   2. Single-Source-of-Truth App ↔ Workbook ↔ Compiled HTML Parity (`causal_domino_spine` === `workbook_stages` === `pupil_workbook.html`).
 *   3. Arcade Milestone Protection (`workbook_stages[i].title` MUST be a noun phrase, NEVER ending in `?`).
 *   4. Prose-Hash Drift Detection (`prose_hash` matches live `narrative_blocks[i].text`).
 *   5. 100% Answerability Grounding in `narrative_blocks[i].text` (Named Entities, 4-Digit Years, Trigger Bullets, Spine Answer Overlap, & Zero Off-by-One Stage Shifts).
 *   6. Zero-Echo Filter (Stage Question does not verbatim give away multi-word Workbook Trigger Bullets).
 *   7. Year-Group Progression Ceiling (KS2 → Year 7 → Year 8 → Year 9 → GCSE word-length & polysyllabic non-proper word caps + 5-Stage Stem Variety).
 *
 * Usage:
 *   node scripts/audit_narrative_question_answerability.cjs                       (report across all 18 units)
 *   node scripts/audit_narrative_question_answerability.cjs <unit_id>             (report on a single unit)
 *   node scripts/audit_narrative_question_answerability.cjs <unit_id> --strict    (exit 1 on any error)
 *   node scripts/audit_narrative_question_answerability.cjs --calibrated --strict (exit 1 on any calibrated unit error)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');

// Units calibrated under the Gold-Standard Narrative Question Progression Rollout.
// Expanded cohort-by-cohort as each unit passes teacher review & PDF verification.
const CALIBRATED_STAGE_UNITS = new Set([
  'ks2_ww2',
  'medieval_england',
  'monarchy_religion_power',
  'water_and_sanitation',
  'first_british_empire',
  'industrialisation_and_empire',
  'second_british_empire',
  'australia',
  'post_war_britain',
  'great_war',
  'great_war_part2',
  'the_shoah',
  'eee',
  'cme_new',
  'cold_war',
  'weimar_nazi_germany',
  'usa',
  'edexcel_medicine',
]);

const UNIT_COHORT_CONFIG = {
  ks2_ww2: { label: 'KS2 (Y5–6)', maxWords: 13, maxHardCommonWords: 2, hasPrintedStageBanners: false },
  medieval_england: { label: 'Year 7', maxWords: 13, maxHardCommonWords: 2, hasPrintedStageBanners: true },
  monarchy_religion_power: { label: 'Year 7', maxWords: 13, maxHardCommonWords: 2, hasPrintedStageBanners: true },
  water_and_sanitation: { label: 'Year 7', maxWords: 13, maxHardCommonWords: 2, hasPrintedStageBanners: true },
  first_british_empire: { label: 'Year 8', maxWords: 14, maxHardCommonWords: 3, hasPrintedStageBanners: true },
  industrialisation_and_empire: { label: 'Year 8', maxWords: 14, maxHardCommonWords: 3, hasPrintedStageBanners: true },
  second_british_empire: { label: 'Year 8', maxWords: 14, maxHardCommonWords: 3, hasPrintedStageBanners: true },
  australia: { label: 'Year 8', maxWords: 14, maxHardCommonWords: 3, hasPrintedStageBanners: true },
  great_war: { label: 'Year 9', maxWords: 15, maxHardCommonWords: 4, hasPrintedStageBanners: true },
  great_war_part2: { label: 'Year 9', maxWords: 15, maxHardCommonWords: 4, hasPrintedStageBanners: true },
  the_shoah: { label: 'Year 9', maxWords: 15, maxHardCommonWords: 4, hasPrintedStageBanners: true },
  post_war_britain: { label: 'Year 9', maxWords: 15, maxHardCommonWords: 4, hasPrintedStageBanners: true },
  edexcel_medicine: { label: 'GCSE (Y10–11)', maxWords: 15, maxHardCommonWords: 5, hasPrintedStageBanners: true },
  eee: { label: 'GCSE (Y10–11)', maxWords: 15, maxHardCommonWords: 5, hasPrintedStageBanners: true },
  cme_new: { label: 'GCSE (Y10–11)', maxWords: 15, maxHardCommonWords: 5, hasPrintedStageBanners: true },
  cold_war: { label: 'GCSE (Y10–11)', maxWords: 15, maxHardCommonWords: 5, hasPrintedStageBanners: true },
  weimar_nazi_germany: { label: 'GCSE (Y10–11)', maxWords: 15, maxHardCommonWords: 5, hasPrintedStageBanners: true },
  usa: { label: 'GCSE (Y10–11)', maxWords: 15, maxHardCommonWords: 5, hasPrintedStageBanners: true },
};

const DEMONYM_AND_BROAD_EQUIVALENTS = {
  anglo: ['saxon', 'english', 'england'],
  saxon: ['anglo', 'english', 'england'],
  saxons: ['anglo', 'english', 'england'],
  british: ['britain', 'england', 'english', 'royal', 'london', 'parliament', 'uk'],
  britain: ['british', 'england', 'english', 'london', 'parliament', 'uk'],
  english: ['england', 'britain', 'british', 'saxon', 'london', 'realm'],
  england: ['english', 'britain', 'british', 'kingdom', 'realm', 'london'],
  german: ['germany', 'reich', 'berlin', 'prussian', 'prussia', 'weimar', 'nazi'],
  germany: ['german', 'reich', 'berlin', 'prussian', 'prussia', 'weimar', 'nazi'],
  american: ['america', 'united states', 'us ', 'u.s.', 'washington', 'federal'],
  america: ['american', 'united states', 'us ', 'u.s.', 'washington', 'colonists', 'colonies'],
  french: ['france', 'paris', 'normandy'],
  france: ['french', 'paris', 'normandy'],
  soviet: ['ussr', 'kremlin', 'moscow', 'russian', 'communist'],
  christian: ['church', 'catholic', 'protestant', 'god', 'biblical', 'pope', 'priest', 'clergy'],
  catholic: ['pope', 'papal', 'rome', 'mass', 'church'],
  papal: ['pope', 'rome', 'catholic'],
  royal: ['king', 'queen', 'crown', 'monarch'],
  parliament: ['mps', 'house of commons', 'statute', 'act', 'law'],
  mp: ['parliament', 'politicians', 'commons'],
  mps: ['parliament', 'politicians', 'commons'],
  wwi: ['1914', '1915', '1916', '1917', '1918', 'western front', 'trenches', 'first world war', 'great war'],
  wwii: ['1939', '1940', '1941', '1942', '1943', '1944', '1945', 'second world war'],
  victorian: ['183', '184', '185', '186', '187', '188', '189', 'nineteenth', '19th', 'victoria'],
  medieval: ['middle ages', 'feudal', '11th', '12th', '13th', '14th', 'parish', 'manor'],
  allied: ['britain', 'allies', 'british', 'american', 'victory'],
};

const QUESTION_IGNORE_CAPS = new Set([
  'Why', 'How', 'What', 'When', 'Where', 'Who', 'Which', 'Whose', 'Did', 'Was', 'Were', 'Could', 'Should', 'In', 'To',
  'The', 'And', 'For', 'From', 'With', 'Into', 'Over', 'Under', 'After', 'Before', 'During', 'Between', 'Across',
  'King', 'Queen', 'Prince', 'Duke', 'Earl', 'Lord', 'Sir', 'Lady', 'President', 'Prime', 'Minister', 'General',
  'Bishop', 'Archbishop', 'Pope', 'Pastor', 'Doctor', 'Professor', 'Captain', 'Admiral',
  'Act', 'Law', 'Statute', 'Treaty', 'Charter', 'Bill', 'Order', 'Decree', 'Policy', 'Plan',
  'Battle', 'War', 'Revolt', 'Rebellion', 'Crisis', 'Revolution', 'Empire', 'Republic', 'State', 'Government',
  'North', 'South', 'East', 'West', 'Northern', 'Southern', 'Eastern', 'Western', 'Central', 'Middle', 'Great', 'New', 'Old', 'First', 'Second', 'Third',
]);

const STOPWORDS = new Set([
  'what', 'why', 'how', 'did', 'was', 'were', 'the', 'and', 'for', 'that', 'this', 'with', 'from', 'into',
  'their', 'they', 'them', 'have', 'had', 'has', 'been', 'being', 'which', 'when', 'where', 'who', 'whom',
  'whose', 'will', 'would', 'could', 'should', 'make', 'made', 'lead', 'led', 'cause', 'caused', 'force',
  'forced', 'shape', 'shaped', 'create', 'created', 'trigger', 'triggered', 'spark', 'sparked', 'affect',
  'affected', 'change', 'changed', 'transform', 'transformed', 'impact', 'factors', 'ways', 'extent',
  'between', 'during', 'after', 'before', 'under', 'over', 'through', 'across', 'against', 'within',
  'about', 'such', 'more', 'most', 'other', 'some', 'many', 'much', 'very', 'also', 'only', 'even',
  'than', 'then', 'there', 'here', 'upon', 'onto', 'both', 'each', 'every', 'become', 'became', 'allow',
  'allowed', 'enable', 'enabled', 'help', 'helped', 'prevent', 'prevented', 'stop', 'stopped', 'mean',
  'meant', 'result', 'resulted', 'turn', 'turned', 'use', 'used', 'using', 'role', 'play', 'played',
  'people', 'happen', 'happened', 'succeed', 'succeeded', 'fail', 'failed', 'start', 'started', 'end', 'ended',
]);

function stripHtml(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function computeProseHash(proseHtml) {
  return crypto.createHash('sha1').update(stripHtml(proseHtml), 'utf8').digest('hex').slice(0, 10);
}

function normalizeQuotes(s) {
  return String(s || '')
    .replace(/[‘’`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&rdquo;|&ldquo;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/\s+/g, ' ')
    .trim();
}

function countSyllables(word) {
  let w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = w.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

function stemWord(w) {
  let s = w.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (s.length > 5 && s.endsWith('ing')) s = s.slice(0, -3);
  else if (s.length > 5 && s.endsWith('ied')) s = s.slice(0, -3) + 'y';
  else if (s.length > 5 && s.endsWith('ies')) s = s.slice(0, -3) + 'y';
  else if (s.length > 4 && s.endsWith('ed')) s = s.slice(0, -2);
  else if (s.length > 4 && s.endsWith('es')) s = s.slice(0, -2);
  else if (s.length > 4 && s.endsWith('s') && !s.endsWith('ss')) s = s.slice(0, -1);
  return s.length >= 6 ? s.slice(0, Math.max(4, s.length - 1)) : s;
}

function wordMatchesProse(wordLower, proseLower) {
  if (proseLower.includes(wordLower)) return true;
  if (DEMONYM_AND_BROAD_EQUIVALENTS[wordLower]) {
    if (DEMONYM_AND_BROAD_EQUIVALENTS[wordLower].some((eq) => proseLower.includes(eq))) {
      return true;
    }
  }
  const stem = stemWord(wordLower);
  return stem.length >= 3 && proseLower.includes(stem);
}

function tokenizeContent(s) {
  return normalizeQuotes(stripHtml(s))
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
}

function extractOpeningStem(q) {
  const clean = normalizeQuotes(q).toLowerCase();
  if (clean.startsWith('in what ways')) return 'in_what_ways';
  if (clean.startsWith('to what extent')) return 'to_what_extent';
  const firstWord = clean.split(/\s+/)[0] || '';
  return firstWord;
}

function hasDuplicateRootTypo(q) {
  // Detects common-word root collisions like "permanent imperial permanence" while allowing proper nouns
  const rawTokens = normalizeQuotes(q).split(/\s+/).slice(1);
  const words = rawTokens
    .filter((tok) => !/^[A-Z]/.test(tok.replace(/^[^a-zA-Z]+/, '')))
    .map((tok) => tok.toLowerCase().replace(/[^a-z]/g, ''))
    .filter((w) => w.length >= 5 && !STOPWORDS.has(w));
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      const a = words[i];
      const b = words[j];
      if (a === b) return `"${a}" repeated`;
      if (a.length >= 6 && b.length >= 6 && a.slice(0, 6) === b.slice(0, 6)) {
        return `"${a}" / "${b}" duplicate root`;
      }
    }
  }
  return null;
}

function auditUnit(unitId) {
  const cfg = UNIT_COHORT_CONFIG[unitId];
  if (!cfg) return { unitId, errors: [`Unknown unitId "${unitId}"`], warnings: [], stagesChecked: 0 };

  const jsonPath = path.join(ROOT_DIR, 'data', `${unitId}.json`);
  if (!fs.existsSync(jsonPath)) {
    return { unitId, errors: [`Missing ${jsonPath}`], warnings: [], stagesChecked: 0 };
  }

  const rawJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const unitData = rawJson.data || rawJson;
  const lessons = unitData.lessons || [];

  const pubUnitDir = path.join(ROOT_DIR, 'public', 'units', unitId);
  const wbHtmlFiles = [];
  if (fs.existsSync(pubUnitDir)) {
    for (const f of fs.readdirSync(pubUnitDir)) {
      if (
        (f === 'pupil_workbook.html' || /^pupil_workbook_.+\.html$/i.test(f)) &&
        !/markscheme/i.test(f)
      ) {
        wbHtmlFiles.push(path.join(pubUnitDir, f));
      }
    }
  }
  const wbRawHtml = wbHtmlFiles.length
    ? wbHtmlFiles.map((fp) => fs.readFileSync(fp, 'utf8')).join('\n')
    : null;
  const wbHtmlNorm = wbRawHtml ? normalizeQuotes(stripHtml(wbRawHtml)) : null;

  const errors = [];
  const warnings = [];
  let stagesChecked = 0;

  if (CALIBRATED_STAGE_UNITS.has(unitId) && wbRawHtml && /<div\s+class=["']stage-trigger-col["']/i.test(wbRawHtml)) {
    errors.push(
      `[${unitId}]: Compiled pupil_workbook*.html still contains retired <div class="stage-trigger-col">! Strip 3-trigger column for full-width lines.`,
    );
  }

  lessons.forEach((lesson, lIdx) => {
    const lLabel = `[${unitId} L${lIdx + 1}]`;
    const nBlocks = Array.isArray(lesson.narrative_blocks) ? lesson.narrative_blocks : [];
    const cStages =
      lesson.causal_domino_spine && Array.isArray(lesson.causal_domino_spine.stages)
        ? lesson.causal_domino_spine.stages
        : [];
    const wStages = Array.isArray(lesson.workbook_stages) ? lesson.workbook_stages : [];

    if (nBlocks.length === 0) return;

    if (cStages.length !== nBlocks.length) {
      errors.push(
        `${lLabel}: causal_domino_spine has ${cStages.length} stages vs ${nBlocks.length} narrative_blocks.`,
      );
    }
    if (wStages.length > 0 && wStages.length !== nBlocks.length) {
      errors.push(
        `${lLabel}: workbook_stages has ${wStages.length} stages vs ${nBlocks.length} narrative_blocks.`,
      );
    }

    const lessonStems = [];

    nBlocks.forEach((block, sIdx) => {
      stagesChecked++;
      const sLabel = `${lLabel} S${sIdx + 1}`;
      const prose = stripHtml(block.text || block.content || '');
      const proseNorm = normalizeQuotes(prose);
      const proseLower = proseNorm.toLowerCase();

      const cs = cStages[sIdx] || {};
      const ws = wStages[sIdx] || {};

      const csQ = normalizeQuotes(cs.question || '');
      const wsQ = normalizeQuotes(ws.question || ws.questionHeading || ws.heading || '');
      const activeQ = csQ || wsQ;

      // 1. Valid Question Syntax & 82-char Print Width
      if (!activeQ) {
        errors.push(`${sLabel}: Missing stage question.`);
        return;
      }
      if (!activeQ.endsWith('?')) {
        errors.push(`${sLabel}: Question does not end with '?' -> "${activeQ}"`);
      }
      if (/why was this turning point critical\?/i.test(activeQ)) {
        errors.push(`${sLabel}: Generic placeholder question -> "${activeQ}"`);
      }
      if (activeQ.length < 18) {
        errors.push(`${sLabel}: Question too short (${activeQ.length} chars) -> "${activeQ}"`);
      }
      if (activeQ.length > 82) {
        errors.push(
          `${sLabel}: Question exceeds 82-char single-line print cap (${activeQ.length} chars) -> "${activeQ}"`,
        );
      }
      const dupTypo = hasDuplicateRootTypo(activeQ);
      if (dupTypo) {
        errors.push(`${sLabel}: Awkward repeated word/root (${dupTypo}) -> "${activeQ}"`);
      }

      // 2. App ↔ Workbook ↔ Compiled HTML Parity
      if (wStages.length > 0 && csQ && wsQ && csQ !== wsQ) {
        errors.push(
          `${sLabel}: App vs Workbook question mismatch!\n      App: "${csQ}"\n      WB : "${wsQ}"`,
        );
      }
      if (
        cfg.hasPrintedStageBanners &&
        wbHtmlNorm &&
        CALIBRATED_STAGE_UNITS.has(unitId) &&
        !(unitId === 'cme_new' && lesson.id === 'lesson_0') &&
        !/assessment|masterclass/i.test(lesson.title || '')
      ) {
        if (!wbHtmlNorm.includes(activeQ)) {
          errors.push(
            `${sLabel}: Compiled pupil_workbook*.html is out of sync (missing "${activeQ}"). Re-run workbook renderer.`,
          );
        }
      }

      // 3. Arcade Timeline Milestone Noun Title Safety
      if (wStages.length > 0) {
        const wsTitle = String(ws.title || '').trim();
        if (!wsTitle || wsTitle.endsWith('?')) {
          errors.push(
            `${sLabel}: workbook_stages.title must be a noun milestone (not empty or '?') to protect Arcade Timelines (got "${wsTitle}").`,
          );
        }
      }

      // 4. Prose-Hash Sustainability Drift Detection
      const liveHash = computeProseHash(block.text || block.content || '');
      const recordedHash = cs.prose_hash || ws.prose_hash || null;
      if (recordedHash && recordedHash !== liveHash) {
        errors.push(
          `${sLabel}: Narrative prose changed since Stage Question was calibrated (hash ${recordedHash} -> ${liveHash}). Re-verify question answerability & run sync_stage_questions.cjs!`,
        );
      }

      // 5. Named-Entity, Year & Off-by-One Answerability Grounding
      const strippedFirstWord = activeQ.replace(/^[A-Za-z'-]+\s+/, '');
      const namedCaps = (strippedFirstWord.match(/\b[A-Z][a-zA-Z]{2,}\b/g) || []).filter(
        (w) => !QUESTION_IGNORE_CAPS.has(w),
      );
      const missingCaps = namedCaps.filter((w) => !wordMatchesProse(w.toLowerCase(), proseLower));
      const years = activeQ.match(/\b1\d{3}\b/g) || [];
      const missingYears = years.filter((y) => !proseLower.includes(y));

      if (missingCaps.length > 0 || missingYears.length > 0) {
        errors.push(
          `${sLabel}: Question references entity/year NOT in narrative_blocks[${sIdx}] ([${[...missingCaps, ...missingYears].join(', ')}]) -> "${activeQ}"`,
        );
      }

      // Check Spine Answer & Question Off-by-One Shift
      const qTokens = [...new Set(tokenizeContent(activeQ))];
      const spineText = `${cs.trigger || cs.desc || ''} ${cs.connective || cs.therefore || ''}`;
      const spineTokens = [...new Set(tokenizeContent(spineText))];

      const curQHits = qTokens.filter((t) => wordMatchesProse(t, proseLower)).length;
      const curQRatio = qTokens.length > 0 ? curQHits / qTokens.length : 1;
      const curSpineHits = spineTokens.filter((t) => wordMatchesProse(t, proseLower)).length;
      const curSpineRatio = spineTokens.length > 0 ? curSpineHits / spineTokens.length : 1;

      if (spineTokens.length >= 4 && curSpineRatio < 0.25) {
        errors.push(
          `${sLabel}: Chronology Spine Reveal Answer has very low grounding (${(curSpineRatio * 100).toFixed(0)}%) in narrative_blocks[${sIdx}].`,
        );
      }

      nBlocks.forEach((otherB, oIdx) => {
        if (oIdx === sIdx) return;
        const otherLower = normalizeQuotes(stripHtml(otherB.text || otherB.content || '')).toLowerCase();
        const oQRatio =
          qTokens.length > 0
            ? qTokens.filter((t) => wordMatchesProse(t, otherLower)).length / qTokens.length
            : 0;
        const oSpineRatio =
          spineTokens.length > 0
            ? spineTokens.filter((t) => wordMatchesProse(t, otherLower)).length / spineTokens.length
            : 0;
        if (curQRatio < 0.35 && oQRatio >= curQRatio + 0.35 && oSpineRatio > curSpineRatio + 0.2) {
          errors.push(
            `${sLabel}: Likely Off-by-One Stage Shift! Stage ${sIdx + 1} question/spine matches Block ${oIdx + 1} much better than Block ${sIdx + 1}.`,
          );
        }
      });

      // 6. Year-Group Progression & Accessibility Ceiling
      const rawWords = activeQ.split(/\s+/).filter(Boolean);
      if (rawWords.length > cfg.maxWords) {
        errors.push(
          `${sLabel} [${cfg.label}]: Question too wordy (${rawWords.length} words > max ${cfg.maxWords}) -> "${activeQ}"`,
        );
      }

      // Count 3+ syllable NON-proper words (so proper names like "Canterbury", "Elizabeth", "NORMANDY" are never penalized!)
      const hardCommonWords = rawWords.slice(1).filter((w) => {
        const clean = w.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');
        if (!clean || /^[A-Z]/.test(clean)) return false; // Skip Proper Nouns
        return countSyllables(clean) >= 3;
      });
      if (hardCommonWords.length > cfg.maxHardCommonWords) {
        errors.push(
          `${sLabel} [${cfg.label}]: Too many complex 3+ syllable vocabulary words (${hardCommonWords.length} > max ${cfg.maxHardCommonWords}: [${hardCommonWords.join(', ')}]) -> "${activeQ}"`,
        );
      }

      lessonStems.push(extractOpeningStem(activeQ));
    });

    // Stem Variety Check across 5-stage lessons
    if (lessonStems.length >= 5) {
      const uniqueStems = new Set(lessonStems);
      if (uniqueStems.size < 2) {
        warnings.push(
          `${lLabel}: All ${lessonStems.length} stages start with the exact same stem ("${lessonStems[0]}"). Rotate Why / How / What across the 5 stages.`,
        );
      }
    }
  });

  return { unitId, cohort: cfg.label, stagesChecked, errors, warnings };
}

function main() {
  const args = process.argv.slice(2);
  const strictFlag = args.includes('--strict');
  const calibratedOnly = args.includes('--calibrated');
  const unitArg = args.find((a) => !a.startsWith('-'));

  let targets = [];
  if (unitArg) {
    targets = [unitArg];
  } else if (calibratedOnly) {
    targets = Array.from(CALIBRATED_STAGE_UNITS);
  } else {
    targets = Object.keys(UNIT_COHORT_CONFIG);
  }

  if (targets.length === 0) {
    console.log('ℹ️  No calibrated stage units registered yet (0 errors).');
    return;
  }

  console.log('========================================================================');
  console.log('🛡️  NARRATIVE QUESTION ANSWERABILITY, ACCESSIBILITY & PARITY AUDITOR');
  console.log('========================================================================');

  let totalStages = 0;
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const uid of targets) {
    const res = auditUnit(uid);
    totalStages += res.stagesChecked;
    totalErrors += res.errors.length;
    totalWarnings += res.warnings.length;

    const badge = res.errors.length === 0 ? '✅ PASS' : `❌ ${res.errors.length} ERROR(S)`;
    console.log(
      `\n▶ [${uid}] (${res.cohort || '?'}) — ${res.stagesChecked} stages | ${badge}${res.warnings.length ? ` | ⚠️ ${res.warnings.length} warning(s)` : ''}`,
    );
    res.errors.forEach((e) => console.log(`   ❌ ${e}`));
    res.warnings.forEach((w) => console.log(`   ⚠️ ${w}`));
  }

  console.log('\n------------------------------------------------------------------------');
  console.log(
    `📊 SUMMARY: ${targets.length} unit(s) | ${totalStages} stages | ${totalErrors} error(s) | ${totalWarnings} warning(s)`,
  );
  console.log('========================================================================');

  const shouldFail =
    totalErrors > 0 && (strictFlag || (unitArg && CALIBRATED_STAGE_UNITS.has(unitArg)));
  if (shouldFail) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { auditUnit, CALIBRATED_STAGE_UNITS, UNIT_COHORT_CONFIG };
