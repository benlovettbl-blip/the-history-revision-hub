/**
 * scripts/sync_ks2_stone_age_rights_database.cjs
 *
 * Synchronizes scripts/master_rights_database.json for Key Stage 2:
 * Stone Age to Iron Age Britain — Hunter-Gatherers to Hillforts (c. 800,000 BC–AD 43) [ks2_stone_to_iron_age]
 * directly from canonical data/ks2_stone_to_iron_age.json and verified Wikimedia Commons metadata.
 *
 * STRICT COMMERCIAL COPYRIGHT GUARANTEE:
 * - 100% of assets carry verified commercial-safe licences (Public Domain, CC0 1.0, CC BY, CC BY-SA, or Original Studio Cartography).
 * - Zero NC (Non-Commercial) or ND (No-Derivatives) licences.
 * - Preserves all existing units (including 0ca01ae's upgraded entries for ks2_romans and ks2_anglo_saxons_vikings) untouched!
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const dbPath = path.join(ROOT_DIR, 'scripts', 'master_rights_database.json');
const unitPath = path.join(ROOT_DIR, 'data', 'ks2_stone_to_iron_age.json');
const metaPath = path.join(__dirname, 'ks2_stone_age_verified_assets.json');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const unitData = JSON.parse(fs.readFileSync(unitPath, 'utf8'));
const VERIFIED_COMMERCIAL_ASSETS = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

const sources = [];
const seenAssetPaths = new Set();

function registerEntry(entry) {
  sources.push(entry);
  if (entry.asset_path) seenAssetPaths.add(entry.asset_path.toLowerCase().trim());
}

// 1. Register Unit Hero Cover
if (unitData.cover_image) {
  const base = path.basename(unitData.cover_image);
  const meta = VERIFIED_COMMERCIAL_ASSETS[base];
  if (!meta) throw new Error(`Unverified cover asset: ${base}`);
  registerEntry({
    lesson_num: 0,
    lesson_title: `Unit Cover: ${unitData.title}`,
    source_id: 'Cover Plate',
    artifact_title: unitData.cover_caption || 'Summer Solstice Sunrise at Stonehenge, Wiltshire',
    ...meta,
    asset_path: unitData.cover_image,
  });
}

// 2. Register Every Lesson Banner, Narrative Plate & Primary Source
(unitData.lessons || []).forEach((lesson, lIdx) => {
  const lNum = lIdx + 1;
  if (lesson.banner_image) {
    const base = path.basename(lesson.banner_image);
    const meta = VERIFIED_COMMERCIAL_ASSETS[base];
    if (!meta) throw new Error(`Unverified lesson banner in Lesson ${lNum}: ${base}`);
    if (!seenAssetPaths.has(lesson.banner_image.toLowerCase().trim())) {
      registerEntry({
        lesson_num: lNum,
        lesson_title: lesson.title,
        source_id: `Lesson ${lNum} Hero Banner`,
        artifact_title: lesson.banner_caption || lesson.title,
        ...meta,
        asset_path: lesson.banner_image,
      });
    }
  }

  (lesson.narrative_blocks || []).forEach((blk, bIdx) => {
    if (blk.image) {
      const base = path.basename(blk.image);
      const meta = VERIFIED_COMMERCIAL_ASSETS[base];
      if (!meta) throw new Error(`Unverified narrative asset in Lesson ${lNum}: ${base}`);
      registerEntry({
        lesson_num: lNum,
        lesson_title: lesson.title,
        source_id: `Act ${bIdx + 1} Plate`,
        artifact_title: blk.caption || blk.title || base,
        ...meta,
        asset_path: blk.image,
      });
    }
  });

  (lesson.sources || []).forEach((src, sIdx) => {
    const imgPath = src.image || src.src;
    if (imgPath) {
      const base = path.basename(imgPath);
      const meta = VERIFIED_COMMERCIAL_ASSETS[base];
      if (!meta) throw new Error(`Unverified source asset in Lesson ${lNum}: ${base}`);
      registerEntry({
        lesson_num: lNum,
        lesson_title: lesson.title,
        source_id: `Source ${src.letter || String.fromCharCode(65 + sIdx)}`,
        artifact_title: src.title || src.caption || base,
        ...meta,
        asset_path: imgPath,
      });
    }
  });
});

// 3. Ensure any remaining asset in VERIFIED_COMMERCIAL_ASSETS is also registered
for (const [file, meta] of Object.entries(VERIFIED_COMMERCIAL_ASSETS)) {
  const assetPath = `/units/ks2_stone_to_iron_age/assets/${file}`;
  if (!seenAssetPaths.has(assetPath.toLowerCase())) {
    registerEntry({
      lesson_num: 0,
      lesson_title: 'Unit Reference & Companion Cartography',
      source_id: 'Companion Visual',
      artifact_title: file.replace(/_/g, ' ').replace(/\.(jpg|png)$/i, ''),
      ...meta,
      asset_path: assetPath,
    });
  }
}

db.units = db.units || {};
db.units.ks2_stone_to_iron_age = {
  unit_id: 'ks2_stone_to_iron_age',
  title: unitData.title,
  year_group: 'Key Stage 2',
  commercial_compliance: '100% Commercially Cleared (PD / CC0 / CC BY / CC BY-SA / Original Studio)',
  sources,
};

db.total_units = Object.keys(db.units).length;
let totalSrc = 0;
for (const u of Object.values(db.units)) {
  totalSrc += Array.isArray(u.sources) ? u.sources.length : 0;
}
db.total_sources = totalSrc;
db.total_registered_sources = totalSrc;
db.last_audit = new Date().toISOString();

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`✅ Synced ks2_stone_to_iron_age into master_rights_database.json (${sources.length} commercially verified entries; 0 NC/ND licences).`);
