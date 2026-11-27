#!/usr/bin/env node
/**
 * KS2 & KS3 Literary Companion Atomic Synchronizer (`scripts/sync_literary_companion.cjs`)
 *
 * Safely synchronizes `data/literary_companions/<unit_id>.json` into the canonical
 * `units/<unit_id>/data.js` source of truth (preserving exact JS module wrappers)
 * and mirrors to `public/units/<unit_id>/data.js`, `data/<unit_id>.json`, and
 * `public/data/<unit_id>.json`.
 *
 * Usage:
 *   node scripts/sync_literary_companion.cjs --seed-existing
 *   node scripts/sync_literary_companion.cjs --strip-gcse
 *   node scripts/sync_literary_companion.cjs <unit_id> [--rebuild-db]
 *   node scripts/sync_literary_companion.cjs --all [--rebuild-db]
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync, execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const UNITS_DIR = path.join(ROOT, 'units');
const DATA_DIR = path.join(ROOT, 'data');
const PUBLIC_DATA_DIR = path.join(ROOT, 'public', 'data');
const PUBLIC_UNITS_DIR = path.join(ROOT, 'public', 'units');
const LC_DIR = path.join(DATA_DIR, 'literary_companions');

const KS2_KS3_UNITS = [
  'ks2_stone_to_iron_age',
  'ks2_ancient_egypt',
  'ks2_ancient_greece',
  'ks2_romans',
  'ks2_anglo_saxons_vikings',
  'ks2_early_islamic_baghdad',
  'ks2_maya_civilisation',
  'ks2_kingdom_of_benin',
  'ks2_victorian_britain',
  'ks2_crime_and_punishment',
  'ks2_local_history_detective',
  'ks2_ww2',
  'water_and_sanitation',
  'medieval_england',
  'monarchy_religion_power',
  'first_british_empire',
  'industrialisation_and_empire',
  'second_british_empire',
  'australia',
  'great_war',
  'great_war_part2',
  'the_shoah',
  'cold_war',
  'post_war_britain',
];

const GCSE_UNITS = [
  'edexcel_medicine',
  'eee',
  'gcse_cold_war',
  'cme_new',
  'weimar_nazi_germany',
  'usa',
];

async function loadUnitDataAndWrapper(unitId) {
  const dataJsPath = path.join(UNITS_DIR, unitId, 'data.js');
  if (!fs.existsSync(dataJsPath)) {
    throw new Error(`Missing units/${unitId}/data.js`);
  }
  const raw = fs.readFileSync(dataJsPath, 'utf8');

  let prefix = 'export default ';
  let suffix = ';\n';

  if (/^\s*window\.UNIT_DATA\s*=\s*/.test(raw)) {
    prefix = 'window.UNIT_DATA = ';
    if (/export\s+default\s+window\.UNIT_DATA\s*;?\s*$/.test(raw)) {
      suffix = ';\nexport default window.UNIT_DATA;\n';
    } else {
      suffix = ';\n';
    }
  } else {
    const constMatch = raw.match(/^\s*const\s+([A-Za-z0-9_]+)\s*=\s*/);
    if (constMatch) {
      const varName = constMatch[1];
      prefix = `const ${varName} = `;
      suffix = `;\nexport default ${varName};\n`;
    }
  }

  let unitObj = null;
  try {
    globalThis.window = {};
    const fileUrl = 'file:///' + dataJsPath.replace(/\\/g, '/') + '?t=' + Date.now();
    const mod = await import(fileUrl);
    unitObj =
      mod.default ||
      mod.unitData ||
      mod[unitId] ||
      globalThis.window.UNIT_DATA ||
      Object.values(globalThis.window).find((v) => v && Array.isArray(v.lessons));
  } catch (_) {}

  if (!unitObj) {
    const sandbox = { window: {}, module: { exports: {} }, exports: {} };
    vm.createContext(sandbox);
    const cleaned = raw
      .replace(/^\s*export\s+default\s+window\.UNIT_DATA\s*;?\s*$/gm, '')
      .replace(/^\s*export\s+default\s+([A-Za-z0-9_]+)\s*;?\s*$/gm, 'module.exports = $1;')
      .replace(/^\s*export\s+default\s+\{/, 'module.exports = {');
    vm.runInContext(cleaned, sandbox);
    unitObj = sandbox.window.UNIT_DATA || sandbox.module.exports;
  }

  if (!unitObj || typeof unitObj !== 'object') {
    throw new Error(`Failed to parse unit object from units/${unitId}/data.js`);
  }

  return { dataJsPath, unitObj, prefix, suffix };
}

function writeUnitEverywhere(unitId, unitObj, prefix, suffix) {
  const dataJsPath = path.join(UNITS_DIR, unitId, 'data.js');
  const jsonBody = JSON.stringify(unitObj, null, 2);
  const jsOut = `${prefix}${jsonBody}${suffix}`;

  fs.writeFileSync(dataJsPath, jsOut, 'utf8');
  execFileSync(process.execPath, ['--check', dataJsPath], { stdio: 'inherit' });

  const pubUnitDir = path.join(PUBLIC_UNITS_DIR, unitId);
  if (fs.existsSync(pubUnitDir)) {
    fs.writeFileSync(path.join(pubUnitDir, 'data.js'), jsOut, 'utf8');
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, `${unitId}.json`), jsonBody + '\n', 'utf8');

  if (fs.existsSync(PUBLIC_DATA_DIR)) {
    fs.writeFileSync(path.join(PUBLIC_DATA_DIR, `${unitId}.json`), jsonBody + '\n', 'utf8');
  }
}

async function seedExisting() {
  fs.mkdirSync(LC_DIR, { recursive: true });
  let count = 0;
  for (const unitId of KS2_KS3_UNITS) {
    const { unitObj } = await loadUnitDataAndWrapper(unitId);
    const arr = Array.isArray(unitObj.guided_reading) ? unitObj.guided_reading : [];
    const target = path.join(LC_DIR, `${unitId}.json`);
    if (!fs.existsSync(target)) {
      fs.writeFileSync(target, JSON.stringify(arr, null, 2) + '\n', 'utf8');
      console.log(`Seeded ${target} (${arr.length} items)`);
      count++;
    }
  }
  console.log(`Done seeding ${count} unit literary companion JSON files.`);
}

async function stripGcse() {
  for (const unitId of GCSE_UNITS) {
    const { unitObj, prefix, suffix } = await loadUnitDataAndWrapper(unitId);
    if ('guided_reading' in unitObj) {
      const removed = Array.isArray(unitObj.guided_reading) ? unitObj.guided_reading.length : 0;
      delete unitObj.guided_reading;
      writeUnitEverywhere(unitId, unitObj, prefix, suffix);
      console.log(`Stripped ${removed} orphaned GCSE guided_reading item(s) from ${unitId}`);
    } else {
      console.log(`No guided_reading present on GCSE unit ${unitId}`);
    }
  }
}

async function syncSingleUnit(unitId) {
  const lcPath = path.join(LC_DIR, `${unitId}.json`);
  if (!fs.existsSync(lcPath)) {
    throw new Error(`Missing ${lcPath} — create it first.`);
  }
  const lcArr = JSON.parse(fs.readFileSync(lcPath, 'utf8'));
  if (!Array.isArray(lcArr)) {
    throw new Error(`${lcPath} must contain a JSON array.`);
  }

  const { unitObj, prefix, suffix } = await loadUnitDataAndWrapper(unitId);
  const lessonsCount = Array.isArray(unitObj.lessons) ? unitObj.lessons.length : 0;
  if (lcArr.length !== lessonsCount) {
    throw new Error(
      `Lesson count mismatch in ${unitId}: unit has ${lessonsCount} lessons, but literary_companions/${unitId}.json has ${lcArr.length} items.`
    );
  }

  // Normalize canonical audio_file & studio_audio links
  unitObj.guided_reading = lcArr.map((item, idx) => {
    const lesson = unitObj.lessons[idx] || {};
    const lessonIdx = typeof item.lesson_index === 'number' ? item.lesson_index : idx;
    const defaultAudio = `/audio/reading/${unitId}/r${lessonIdx}.mp3`;
    return {
      ...item,
      lesson_index: lessonIdx,
      lesson_id: item.lesson_id || lesson.id || `lesson_${lessonIdx + 1}`,
      lesson_label: item.lesson_label || `Enquiry ${lessonIdx + 1}`,
      audio_file: item.studio_audio || item.audio_file || defaultAudio,
      studio_audio: item.studio_audio || item.audio_file || defaultAudio,
    };
  });

  writeUnitEverywhere(unitId, unitObj, prefix, suffix);
  console.log(`✅ Synced Literary Companions (${lcArr.length}/${lessonsCount}) -> units/${unitId}/data.js & JSON mirrors`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--seed-existing')) {
    await seedExisting();
    return;
  }
  if (args.includes('--strip-gcse')) {
    await stripGcse();
  }

  const rebuildDb = args.includes('--rebuild-db');
  const syncAll = args.includes('--all');
  const positional = args.filter((a) => !a.startsWith('-'));

  if (syncAll) {
    for (const unitId of KS2_KS3_UNITS) {
      const lcPath = path.join(LC_DIR, `${unitId}.json`);
      if (fs.existsSync(lcPath)) {
        const arr = JSON.parse(fs.readFileSync(lcPath, 'utf8'));
        if (arr.length > 0) await syncSingleUnit(unitId);
      }
    }
  } else if (positional.length > 0) {
    for (const unitId of positional) {
      await syncSingleUnit(unitId);
    }
  }

  if (rebuildDb) {
    console.log('\nRebuilding global database.json & public/database.json...');
    execSync('node scripts/build_database.cjs', { cwd: ROOT, stdio: 'inherit' });
  }
}

main().catch((err) => {
  console.error('❌ sync_literary_companion error:', err.message);
  process.exit(1);
});
