#!/usr/bin/env node
/**
 * sync_medicine_only.cjs
 *
 * Strictly isolated sync script for `edexcel_medicine` ONLY.
 * Updates:
 *  - public/data/edexcel_medicine.json
 *  - units/edexcel_medicine/data.js
 *  - public/units/edexcel_medicine/data.js
 *  - public/units/edexcel_medicine/data.json
 *  - public/units/edexcel_medicine/biographies.json
 *  - database.json['edexcel_medicine'] (preserving every other unit byte-for-byte in memory)
 *  - public/database.json['edexcel_medicine']
 *
 * NEVER touches ks2_ww2, cme_new, index.html, or chess_* files.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const srcJsonPath = path.join(ROOT, 'data', 'edexcel_medicine.json');

if (!fs.existsSync(srcJsonPath)) {
  console.error('ERROR: Missing data/edexcel_medicine.json');
  process.exit(1);
}

const rawText = fs.readFileSync(srcJsonPath, 'utf8');
const medData = JSON.parse(rawText);
const prettyJson = JSON.stringify(medData, null, 2) + '\n';
const dataJsContent = 'window.unitData = ' + JSON.stringify(medData, null, 2) + ';\n';

// 1. Sync standalone JSON & JS unit mirrors
const jsonTargets = [
  path.join(ROOT, 'public', 'data', 'edexcel_medicine.json'),
  path.join(ROOT, 'public', 'units', 'edexcel_medicine', 'data.json'),
];
for (const p of jsonTargets) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, prettyJson, 'utf8');
  console.log('Synced:', path.relative(ROOT, p));
}

const jsTargets = [
  path.join(ROOT, 'units', 'edexcel_medicine', 'data.js'),
  path.join(ROOT, 'public', 'units', 'edexcel_medicine', 'data.js'),
];
for (const p of jsTargets) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, dataJsContent, 'utf8');
  console.log('Synced:', path.relative(ROOT, p));
}

// 2. Sync biographies.json mirror for static pages
if (Array.isArray(medData.key_individuals)) {
  const bioPath = path.join(ROOT, 'public', 'units', 'edexcel_medicine', 'biographies.json');
  const bios = medData.key_individuals.map((k) => ({
    id: k.id,
    entity_type: k.entity_type || 'person',
    name: k.name,
    lifespan: k.lifespan || k.active_dates || '',
    role: k.role || '',
    group: k.group || '',
    origins: k.origins || '',
    bio: k.bio || k.significance || '',
    image: k.image || k.image_url || '',
    image_url: k.image || k.image_url || '',
  }));
  fs.writeFileSync(bioPath, JSON.stringify(bios, null, 2) + '\n', 'utf8');
  console.log('Synced:', path.relative(ROOT, bioPath));
}

// 3. Patch ONLY `edexcel_medicine` inside database.json & public/database.json
for (const relDb of ['database.json', 'public/database.json']) {
  const dbPath = path.join(ROOT, relDb);
  if (!fs.existsSync(dbPath)) continue;
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  db.edexcel_medicine = medData;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2) + '\n', 'utf8');
  console.log(`Updated ['edexcel_medicine'] only in ${relDb}`);
}

console.log('Isolated edexcel_medicine sync complete.');
