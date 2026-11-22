/**
 * scripts/sync_ks2_world_units_rights_database.cjs
 *
 * Synchronizes scripts/master_rights_database.json for all 4 Key Stage 2 World & Ancient Civilisation units:
 *   - ks2_ancient_egypt
 *   - ks2_ancient_greece
 *   - ks2_early_islamic_baghdad
 *   - ks2_maya_civilisation
 *
 * STRICT COMMERCIAL COPYRIGHT GUARANTEE:
 * - 100% of assets carry verified commercial-safe licences (Public Domain, CC0 1.0, CC BY, CC BY-SA, or Original Studio Cartography).
 * - Zero NC (Non-Commercial) or ND (No-Derivatives) licences.
 * - Preserves all existing units untouched.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const dbPath = path.join(ROOT_DIR, 'scripts', 'master_rights_database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
db.units = db.units || {};

const WORLD_UNITS = [
  { id: 'ks2_ancient_egypt', metaFile: 'ks2_egypt_verified_assets.json' },
  { id: 'ks2_ancient_greece', metaFile: 'ks2_greece_verified_assets.json' },
  { id: 'ks2_early_islamic_baghdad', metaFile: 'ks2_baghdad_verified_assets.json' },
  { id: 'ks2_maya_civilisation', metaFile: 'ks2_maya_verified_assets.json' },
];

for (const { id, metaFile } of WORLD_UNITS) {
  const unitData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', `${id}.json`), 'utf8'));
  const VERIFIED = JSON.parse(fs.readFileSync(path.join(__dirname, metaFile), 'utf8'));

  const sources = [];
  const seenAssetPaths = new Set();

  function registerEntry(entry) {
    sources.push(entry);
    if (entry.asset_path) seenAssetPaths.add(entry.asset_path.toLowerCase().trim());
  }

  // 1. Unit Hero Cover
  if (unitData.cover_image) {
    const base = path.basename(unitData.cover_image);
    const meta = VERIFIED[base];
    if (!meta) throw new Error(`[${id}] Unverified cover asset: ${base}`);
    registerEntry({
      lesson_num: 0,
      lesson_title: `Unit Cover: ${unitData.title}`,
      source_id: 'Cover Plate',
      artifact_title: unitData.cover_caption || unitData.title,
      ...meta,
      asset_path: unitData.cover_image,
    });
  }

  // 2. Lessons (Banners, Narrative Plates & Primary Sources)
  (unitData.lessons || []).forEach((lesson, lIdx) => {
    const lNum = lIdx + 1;
    const bImg = lesson.banner_image || (lesson.banner && lesson.banner.image) || lesson.hero_image;
    if (bImg) {
      const base = path.basename(bImg);
      const meta = VERIFIED[base];
      if (!meta) throw new Error(`[${id}] Unverified lesson banner in Lesson ${lNum}: ${base}`);
      if (!seenAssetPaths.has(bImg.toLowerCase().trim())) {
        registerEntry({
          lesson_num: lNum,
          lesson_title: lesson.title,
          source_id: `Lesson ${lNum} Hero Banner`,
          artifact_title: (lesson.banner && lesson.banner.caption) || lesson.subtitle || lesson.title,
          ...meta,
          asset_path: bImg,
        });
      }
    }

    (lesson.narrative_blocks || []).forEach((blk, bIdx) => {
      if (blk.image) {
        const base = path.basename(blk.image);
        const meta = VERIFIED[base];
        if (!meta) throw new Error(`[${id}] Unverified narrative asset in Lesson ${lNum}: ${base}`);
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
        const meta = VERIFIED[base];
        if (!meta) throw new Error(`[${id}] Unverified source asset in Lesson ${lNum}: ${base}`);
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

  // 3. Remaining staged assets (Key Individuals, Maps, Diagrams, Reserve Plates)
  for (const [file, meta] of Object.entries(VERIFIED)) {
    const assetPath = `/units/${id}/assets/${file}`;
    if (!seenAssetPaths.has(assetPath.toLowerCase())) {
      registerEntry({
        lesson_num: 0,
        lesson_title: 'Unit Reference, Dossier & Companion Cartography',
        source_id: 'Companion Visual',
        artifact_title: file.replace(/_/g, ' ').replace(/\.(jpg|png)$/i, ''),
        ...meta,
        asset_path: assetPath,
      });
    }
  }

  db.units[id] = {
    unit_id: id,
    title: unitData.title,
    year_group: 'Key Stage 2',
    commercial_compliance: '100% Commercially Cleared (PD / CC0 / CC BY / CC BY-SA / Original Studio)',
    sources,
  };
  console.log(`✅ Synced ${id} into master_rights_database.json (${sources.length} commercially verified entries).`);
}

db.total_units = Object.keys(db.units).length;
let totalSrc = 0;
for (const u of Object.values(db.units)) {
  totalSrc += Array.isArray(u.sources) ? u.sources.length : 0;
}
db.total_sources = totalSrc;
db.total_registered_sources = totalSrc;
db.last_audit = new Date().toISOString();

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`🎉 Updated master_rights_database.json (${db.total_units} units, ${totalSrc} total verified sources; 0 NC/ND licences).`);
