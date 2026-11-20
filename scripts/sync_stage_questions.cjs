/**
 * scripts/sync_stage_questions.cjs
 *
 * SINGLE-SOURCE-OF-TRUTH STAGE QUESTION & PROSE-HASH SYNCHRONIZER
 *
 * Ensures 100% alignment across:
 *   1. `data/<unit>.json` (canonical source: `narrative_blocks`, `causal_domino_spine`, `workbook_stages`)
 *   2. `public/data/<unit>.json`
 *   3. `units/<unit>/data.js` & `public/units/<unit>/data.js`
 *   4. `database.json` & `public/database.json` (preserving `micro_histories` & `key_individuals`)
 *
 * Key Sustainability Actions per Stage (1..N):
 *   - Unifies `causal_domino_spine.stages[i].question` and `workbook_stages[i]` (`question`, `questionHeading`, `heading`)
 *     to ONE canonical enquiry question ending in `?`.
 *   - Protects Arcade Timeline Games (`src/arcade/arcade_data_adapter.js`) by ensuring `workbook_stages[i].title`
 *     is ALWAYS a clean noun-phrase milestone title (never a `?` question).
 *   - Stamps a deterministic 10-char `prose_hash` of `narrative_blocks[i].text` onto both `workbook_stages[i]`
 *     and `causal_domino_spine.stages[i]` so future narrative edits are immediately detected by `sync_unit.cjs`.
 *
 * Usage:
 *   node scripts/sync_stage_questions.cjs <unit_id>
 *   node scripts/sync_stage_questions.cjs <unit_id> --skip-db
 *   node scripts/sync_stage_questions.cjs --all
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');

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

function stripHtmlNormalized(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function computeProseHash(proseHtml) {
  const clean = stripHtmlNormalized(proseHtml);
  return crypto.createHash('sha1').update(clean, 'utf8').digest('hex').slice(0, 10);
}

function cleanMilestoneNounTitle(rawTitle, fallbackIdx) {
  let t = String(rawTitle || '')
    .replace(/^\[\d+\.\d+\]\s*/, '')
    .replace(/^Act\s*\d+\s*:\s*/i, '')
    .replace(/\s*\([^)]*\d{3,4}[^)]*\)\s*$/, '')
    .trim();
  if (t.endsWith('?') && t.includes(':')) {
    t = t.split(':')[0].trim();
  }
  if (!t || t.endsWith('?')) {
    return `Stage ${fallbackIdx + 1} Milestone`;
  }
  return t;
}

function findTopLevelObjectBounds(raw) {
  let i = 0;
  const n = raw.length;
  let firstBrace = -1;

  while (i < n) {
    if (raw[i] === '/' && raw[i + 1] === '/') {
      while (i < n && raw[i] !== '\n') i++;
      continue;
    }
    if (raw[i] === '/' && raw[i + 1] === '*') {
      i += 2;
      while (i < n && !(raw[i] === '*' && raw[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    if (raw[i] === '{') {
      firstBrace = i;
      break;
    }
    i++;
  }

  if (firstBrace === -1) {
    throw new Error('Could not find opening { in data.js');
  }

  let depth = 0;
  let inStr = null;
  for (let j = firstBrace; j < n; j++) {
    const ch = raw[j];
    if (inStr) {
      if (ch === '\\') {
        j++;
        continue;
      }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inStr = ch;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return { firstBrace, closeBrace: j };
    }
  }
  throw new Error('Unbalanced braces in data.js');
}

function parseUnitDataJs(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { firstBrace, closeBrace } = findTopLevelObjectBounds(raw);
  const prefix = raw.slice(0, firstBrace);
  const suffix = raw.slice(closeBrace + 1);
  const objectLiteral = raw.slice(firstBrace, closeBrace + 1);

  const sandbox = { window: {}, globalThis: {} };
  vm.createContext(sandbox);
  const obj = vm.runInContext('(' + objectLiteral + ')', sandbox);
  return { obj, prefix, suffix };
}

function normalizeUnitStagesInPlace(unitObj) {
  const lessons = unitObj.lessons || [];
  let syncedStages = 0;

  lessons.forEach((lesson) => {
    const nBlocks = Array.isArray(lesson.narrative_blocks) ? lesson.narrative_blocks : [];
    if (nBlocks.length === 0) return;

    // Ensure causal_domino_spine & workbook_stages exist where expected
    const cStages =
      lesson.causal_domino_spine && Array.isArray(lesson.causal_domino_spine.stages)
        ? lesson.causal_domino_spine.stages
        : [];
    const wStages = Array.isArray(lesson.workbook_stages) ? lesson.workbook_stages : [];

    nBlocks.forEach((block, idx) => {
      // Keep block.content & block.text + title aliases strictly aligned so web app never renders shadowed text
      if (block.text && block.content !== block.text) block.content = block.text;
      if (!block.text && block.content) block.text = block.content;

      const pHash = computeProseHash(block.text || block.content || '');
      const cs = cStages[idx];
      const ws = wStages[idx];

      // Determine canonical question (prefer causal_domino_spine.question if valid ?, else workbook_stages question)
      const csQ = cs && cs.question ? String(cs.question).trim() : '';
      const wsQ = ws
        ? String(ws.question || ws.questionHeading || ws.heading || '').trim()
        : '';

      let canonicalQ = '';
      if (csQ && csQ.endsWith('?')) {
        canonicalQ = csQ;
      } else if (wsQ && wsQ.endsWith('?') && wsQ !== 'Why was this turning point critical?') {
        canonicalQ = wsQ;
      } else {
        canonicalQ = csQ || wsQ;
      }

      if (cs) {
        if (canonicalQ) cs.question = canonicalQ;
        cs.step = idx + 1;
        cs.prose_hash = pHash;
        if (!cs.title || cs.title.trim().endsWith('?')) {
          cs.title = cleanMilestoneNounTitle(block.title || block.theme_heading, idx);
        }
      }

      if (ws) {
        ws.step = idx + 1;
        if ('stage' in ws) ws.stage = idx + 1;
        if (canonicalQ) {
          ws.question = canonicalQ;
          ws.questionHeading = canonicalQ;
          ws.heading = canonicalQ;
        }
        // Protect Arcade Timeline Milestone Title: MUST be a noun phrase, NEVER a question!
        if (!ws.title || String(ws.title).trim().endsWith('?')) {
          const fallbackNoun =
            (cs && cs.title && !String(cs.title).trim().endsWith('?') ? cs.title : '') ||
            block.title ||
            block.theme_heading ||
            '';
          ws.title = cleanMilestoneNounTitle(fallbackNoun, idx);
        }
        if (cs && cs.date && (!ws.date || ws.date === 'Key Event')) {
          ws.date = cs.date;
          ws.dates = cs.date;
        }
        if (cs && (cs.para_ref || cs.paraRef) && !ws.para_ref && !ws.paraRef) {
          ws.para_ref = cs.para_ref || cs.paraRef;
          ws.paraRef = cs.para_ref || cs.paraRef;
        }
        ws.prose_hash = pHash;
      }

      syncedStages++;
    });
  });

  return syncedStages;
}

function writeFileSafe(targetPath, content) {
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      fs.writeFileSync(targetPath, content, 'utf8');
      return;
    } catch (err) {
      if (attempt === 6) throw err;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 80 * attempt);
    }
  }
}

function syncUnitStageMirrors(unitId) {
  const srcJsonPath = path.join(ROOT_DIR, 'data', `${unitId}.json`);
  const pubJsonPath = path.join(ROOT_DIR, 'public', 'data', `${unitId}.json`);
  const unitJsPath = path.join(ROOT_DIR, 'units', unitId, 'data.js');
  const pubUnitJsPath = path.join(ROOT_DIR, 'public', 'units', unitId, 'data.js');

  if (!fs.existsSync(srcJsonPath)) {
    throw new Error(`Missing canonical JSON file: ${srcJsonPath}`);
  }

  const srcJson = JSON.parse(fs.readFileSync(srcJsonPath, 'utf8'));
  const unitPayload = srcJson.data || srcJson;
  const stageCount = normalizeUnitStagesInPlace(unitPayload);

  // 1. Write back canonical data/<unit>.json and public/data/<unit>.json
  const serializedJson = JSON.stringify(srcJson, null, 2) + '\n';
  writeFileSafe(srcJsonPath, serializedJson);
  writeFileSafe(pubJsonPath, serializedJson);

  // 2. Mirror narrative_blocks, workbook_stages, and causal_domino_spine into units/<unit>/data.js & public/units/<unit>/data.js
  const srcLessons = unitPayload.lessons || [];
  for (const jsTarget of [unitJsPath, pubUnitJsPath]) {
    if (!fs.existsSync(jsTarget)) continue;
    const { obj, prefix, suffix } = parseUnitDataJs(jsTarget);
    if (!obj || !Array.isArray(obj.lessons)) {
      throw new Error(`Could not parse lessons array in ${jsTarget}`);
    }
    srcLessons.forEach((sl, idx) => {
      if (obj.lessons[idx]) {
        obj.lessons[idx].narrative_blocks = sl.narrative_blocks;
        if (sl.workbook_stages) obj.lessons[idx].workbook_stages = sl.workbook_stages;
        if (sl.causal_domino_spine) obj.lessons[idx].causal_domino_spine = sl.causal_domino_spine;
        if (sl.visual_story_sheet) obj.lessons[idx].visual_story_sheet = sl.visual_story_sheet;
      }
    });
    const serializedJs = prefix + JSON.stringify(obj, null, 2) + suffix;
    writeFileSafe(jsTarget, serializedJs);
    execSync(`node --check "${jsTarget}"`, { stdio: 'pipe' });
  }

  console.log(
    `✅ Synced canonical stage questions, noun titles & prose_hash for [${unitId}] (${srcLessons.length} lessons, ${stageCount} stages)`,
  );
}

function updateDatabaseJsonFiles(targets) {
  const dbPaths = [
    path.join(ROOT_DIR, 'public', 'database.json'),
    path.join(ROOT_DIR, 'database.json'),
  ];
  for (const dbPath of dbPaths) {
    if (!fs.existsSync(dbPath)) continue;
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    for (const unitId of targets) {
      const srcJsonPath = path.join(ROOT_DIR, 'data', `${unitId}.json`);
      if (!fs.existsSync(srcJsonPath) || !db[unitId]) continue;
      const srcJson = JSON.parse(fs.readFileSync(srcJsonPath, 'utf8'));
      const srcLessons = (srcJson.data || srcJson).lessons || [];
      const dbUnit = db[unitId].data || db[unitId];
      if (Array.isArray(dbUnit.lessons)) {
        srcLessons.forEach((sl, idx) => {
          if (dbUnit.lessons[idx]) {
            dbUnit.lessons[idx].narrative_blocks = sl.narrative_blocks;
            if (sl.workbook_stages) dbUnit.lessons[idx].workbook_stages = sl.workbook_stages;
            if (sl.causal_domino_spine) {
              dbUnit.lessons[idx].causal_domino_spine = sl.causal_domino_spine;
            }
            if (sl.visual_story_sheet) {
              dbUnit.lessons[idx].visual_story_sheet = sl.visual_story_sheet;
            }
          }
        });
      }
    }
    writeFileSafe(dbPath, JSON.stringify(db, null, 2));
  }
  console.log(
    `✅ Updated database.json & public/database.json stage mirrors across ${targets.length} unit(s).`,
  );
}

function main() {
  const args = process.argv.slice(2);
  const skipDb = args.includes('--skip-db');
  const runAll = args.includes('--all');
  const targetArg = args.find((a) => !a.startsWith('-'));

  if (!runAll && !targetArg) {
    console.error(
      'Usage: node scripts/sync_stage_questions.cjs <unit_id> [--skip-db] | --all',
    );
    process.exit(1);
  }

  const targets = runAll ? CANONICAL_UNITS : [targetArg];
  for (const uid of targets) {
    syncUnitStageMirrors(uid);
  }
  if (!skipDb) {
    updateDatabaseJsonFiles(targets);
  }
}

if (require.main === module) {
  main();
}

module.exports = { computeProseHash, stripHtmlNormalized, syncUnitStageMirrors };
