#!/usr/bin/env node
/**
 * scripts/verify_mindmaps.cjs
 *
 * Automated structural, cognitive-load, parity & domino-chain gate for all 26 unit Mind Maps
 * (`6` GCSE + `12` KS3 + `8` KS2) in `data/mindmaps/` and `public/data/mindmaps/`.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data', 'mindmaps');
const PUB_DIR = path.join(ROOT, 'public', 'data', 'mindmaps');
const TIMELINES_DIR = path.join(ROOT, 'public', 'data', 'timelines');

const EXPECTED_UNITS = fs
  .readdirSync(TIMELINES_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''))
  .sort();

let errors = 0;
let totalNodes = 0;
let totalTwigs = 0;
let totalDominoes = 0;

for (const u of EXPECTED_UNITS) {
  const p1 = path.join(DATA_DIR, `${u}.json`);
  const p2 = path.join(PUB_DIR, `${u}.json`);
  if (!fs.existsSync(p1)) {
    console.error(`❌ Missing data/mindmaps/${u}.json`);
    errors++;
    continue;
  }
  if (!fs.existsSync(p2)) {
    console.error(`❌ Missing public/data/mindmaps/${u}.json`);
    errors++;
    continue;
  }
  const raw1 = fs.readFileSync(p1, 'utf8');
  const raw2 = fs.readFileSync(p2, 'utf8');
  if (raw1.trim() !== raw2.trim()) {
    console.error(`❌ Mirror mismatch between data/mindmaps/${u}.json and public/data/mindmaps/${u}.json`);
    errors++;
  }

  let json;
  try {
    json = JSON.parse(raw1);
  } catch (e) {
    console.error(`❌ Invalid JSON in ${u}.json: ${e.message}`);
    errors++;
    continue;
  }

  if (json.schemaVersion !== 'v9-5ring-twigs') {
    console.error(`❌ ${u}: schemaVersion is '${json.schemaVersion}' (expected 'v9-5ring-twigs')`);
    errors++;
  }

  let t1 = 0,
    t2 = 0,
    t3 = 0,
    t4 = 0,
    t5 = 0,
    dominoCount = 0;
  const seenIds = new Set();

  function walk(n, expectedTier) {
    if (!n || typeof n !== 'object') return;
    if (!n.id || seenIds.has(n.id)) {
      console.error(`❌ ${u}: duplicate or missing node id '${n?.id}'`);
      errors++;
    }
    if (n.id) seenIds.add(n.id);

    if (n.tier !== expectedTier) {
      console.error(`❌ ${u} [${n.id}]: tier=${n.tier}, expected=${expectedTier}`);
      errors++;
    }
    totalNodes++;
    if (n.tier === 1) t1++;
    if (n.tier === 2) t2++;
    if (n.tier === 3) {
      t3++;
      const kids = n.children || [];
      if (kids.length === 0 || kids.length > 4) {
        console.error(`❌ ${u} [${n.id}]: Ring-3 node has ${kids.length} children (must be 1..4)`);
        errors++;
      }
    }
    if (n.tier === 4) {
      t4++;
      if ('detail' in n) {
        console.error(`❌ ${u} [${n.id}]: Ring-4 node still has legacy 'detail' field`);
        errors++;
      }
      if (String(n.label || '').includes('→')) dominoCount++;
      const kids = n.children || [];
      if (kids.length !== 2) {
        console.error(`❌ ${u} [${n.id}]: Ring-4 node has ${kids.length} twigs (expected 2)`);
        errors++;
      }
      if (String(n.label || '').length > 48) {
        console.error(`❌ ${u} [${n.id}]: Ring-4 label > 48 chars (${n.label.length}): "${n.label}"`);
        errors++;
      }
    }
    if (n.tier === 5) {
      t5++;
      totalTwigs++;
      if (String(n.label || '').length > 46) {
        console.error(`❌ ${u} [${n.id}]: Ring-5 twig > 46 chars (${n.label.length}): "${n.label}"`);
        errors++;
      }
    }
    (n.children || []).forEach((ch) => walk(ch, expectedTier + 1));
  }

  walk(json.root, 0);
  totalDominoes += dominoCount;
  if (dominoCount === 0) {
    console.error(`❌ ${u}: 0 Domino '→' links found on Ring 4`);
    errors++;
  }
  console.log(
    `✅ ${u.padEnd(28)} | KTs:${String(t1).padStart(2)} Lsns:${String(t2).padStart(2)} Evts:${String(t3).padStart(2)} Claims:${String(t4).padStart(3)} Twigs:${String(t5).padStart(3)} Dominoes:${String(dominoCount).padStart(2)}`,
  );
}

console.log('--------------------------------------------------------------------------------');
console.log(
  `📊 Mind-Map Audit: ${EXPECTED_UNITS.length} units | ${totalNodes} total nodes | ${totalTwigs} Ring-5 twigs | ${totalDominoes} Domino '→' links | ${errors} errors`,
);
if (errors > 0) process.exit(1);
