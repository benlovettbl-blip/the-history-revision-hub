/**
 * SURGICAL DO NOW & QUIZ MIRROR SYNCHRONIZER
 *
 * Propagates ONLY `lesson.quiz` and `lesson.do_now` from canonical `data/<unit>.json`
 * into:
 *   - `public/data/<unit>.json`
 *   - `units/<unit>/data.js`
 *   - `public/units/<unit>/data.js`
 *   - `database.json` & `public/database.json` (preserving all 20 entries including micro_histories & key_individuals)
 *
 * Uses string-aware brace matching so trailing `if (typeof window ...)` footers stay 100% intact.
 */

const fs = require('fs');
const path = require('path');
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

function findTopLevelObjectBounds(raw) {
  let i = 0;
  const n = raw.length;
  let firstBrace = -1;

  while (i < n) {
    // Skip single-line comments
    if (raw[i] === '/' && raw[i + 1] === '/') {
      while (i < n && raw[i] !== '\n') i++;
      continue;
    }
    // Skip multi-line comments
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
      if (ch === inStr) {
        inStr = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inStr = ch;
      continue;
    }
    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return { firstBrace, closeBrace: j };
      }
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

function syncUnitMirrors(unitId) {
  const srcJsonPath = path.join(ROOT_DIR, 'data', `${unitId}.json`);
  const pubJsonPath = path.join(ROOT_DIR, 'public', 'data', `${unitId}.json`);
  const unitJsPath = path.join(ROOT_DIR, 'units', unitId, 'data.js');
  const pubUnitJsPath = path.join(ROOT_DIR, 'public', 'units', unitId, 'data.js');

  const srcJson = JSON.parse(fs.readFileSync(srcJsonPath, 'utf8'));
  const srcLessons = (srcJson.data || srcJson).lessons || [];

  // 1. Sync public/data/<unit>.json
  if (fs.existsSync(pubJsonPath)) {
    const pubJson = JSON.parse(fs.readFileSync(pubJsonPath, 'utf8'));
    const pubLessons = (pubJson.data || pubJson).lessons || [];
    srcLessons.forEach((sl, idx) => {
      if (pubLessons[idx]) {
        pubLessons[idx].quiz = sl.quiz;
        pubLessons[idx].do_now = sl.do_now;
      }
    });
    fs.writeFileSync(pubJsonPath, JSON.stringify(pubJson, null, 2) + '\n', 'utf8');
  } else {
    fs.copyFileSync(srcJsonPath, pubJsonPath);
  }

  // 2. Sync units/<unit>/data.js & public/units/<unit>/data.js
  for (const jsTarget of [unitJsPath, pubUnitJsPath]) {
    if (!fs.existsSync(jsTarget)) continue;
    const { obj, prefix, suffix } = parseUnitDataJs(jsTarget);
    if (!obj || !Array.isArray(obj.lessons)) {
      throw new Error(`Could not parse lessons array in ${jsTarget}`);
    }
    srcLessons.forEach((sl, idx) => {
      if (obj.lessons[idx]) {
        obj.lessons[idx].quiz = sl.quiz;
        obj.lessons[idx].do_now = sl.do_now;
      }
    });
    const serialized = prefix + JSON.stringify(obj, null, 2) + suffix;
    fs.writeFileSync(jsTarget, serialized, 'utf8');
    execSync(`node --check "${jsTarget}"`, { stdio: 'pipe' });
  }

  console.log(`✅ Synced quiz & do_now mirrors for [${unitId}] (${srcLessons.length} lessons)`);
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
            dbUnit.lessons[idx].quiz = sl.quiz;
            dbUnit.lessons[idx].do_now = sl.do_now;
          }
        });
      }
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  }
  console.log(`✅ Updated database.json & public/database.json cleanly across ${targets.length} unit(s).`);
}

function main() {
  const args = process.argv.slice(2);
  const skipDb = args.includes('--skip-db');
  const targetArg = args.find((a) => !a.startsWith('-'));
  const targets = targetArg ? [targetArg] : CANONICAL_UNITS;

  for (const uid of targets) {
    syncUnitMirrors(uid);
  }

  if (!skipDb) {
    updateDatabaseJsonFiles(targets);
  }
}

main();
