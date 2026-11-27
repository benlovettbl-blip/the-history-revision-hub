/**
 * scripts/build_ks2_victorian_rights_entries.cjs
 *
 * Generates `scripts/ks2_victorian_rights_entries.json` matching the exact unit object schema
 * of `scripts/master_rights_database.json` for `ks2_victorian_britain` (49 commercial-cleared assets).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'ks2_victorian_verified_assets.json'), 'utf8'));
const unitData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'ks2_victorian_britain.json'), 'utf8'));

function entryFromAsset(lessonNum, lessonTitle, sourceId, assetPath, artifactTitle) {
  const file = path.basename(assetPath);
  const m = manifest[file];
  if (!m) {
    throw new Error(`Missing verified manifest entry for ${file}`);
  }
  return {
    lesson_num: lessonNum,
    lesson_title: lessonTitle,
    source_id: sourceId,
    artifact_title: artifactTitle,
    date: m.date,
    creator: m.creator,
    repository: m.repository,
    accession_id: m.accession_id,
    rights_status: m.rights_status,
    commercial_use_permitted: true,
    source_url: m.source_url,
    asset_path: `/units/ks2_victorian_britain/assets/${file}`,
  };
}

const sources = [];

// 1. Unit Cover (1)
sources.push(
  entryFromAsset(
    0,
    'Unit Cover: Victorian Britain — Steam Railways, Factories, Workhouses and Classrooms (1837–1901)',
    'Cover Plate',
    unitData.cover_image,
    unitData.cover_caption,
  ),
);

// 2. Lessons 1..6: 1 Banner + 3 Narrative Plates + 3 Primary Sources each (6 * 7 = 42)
unitData.lessons.forEach((l, lIdx) => {
  const lNum = lIdx + 1;
  sources.push(entryFromAsset(lNum, l.title, 'Banner Plate', l.hero_image, l.banner_caption));

  l.narrative_blocks.forEach((b, bIdx) => {
    sources.push(entryFromAsset(lNum, l.title, `Plate ${lNum}.${bIdx + 1}`, b.image, b.caption));
  });

  l.sources.forEach((s) => {
    sources.push(entryFromAsset(lNum, l.title, `Source ${s.letter}`, s.image, `${s.title} — ${s.caption}`));
  });
});

// 3. Key Individuals Portraits (6)
unitData.key_individuals.forEach((ki, kIdx) => {
  sources.push(
    entryFromAsset(
      0,
      'Key Individuals Dossiers: Victorian Britain (1837–1901)',
      `Portrait ${kIdx + 1}`,
      ki.image,
      `${ki.name} — ${ki.role}.`,
    ),
  );
});

const rightsObj = {
  unit_id: 'ks2_victorian_britain',
  unit_title: unitData.title,
  key_stage: 'Key Stage 2',
  exam_board: 'Key Stage 2 National Curriculum (History)',
  total_lessons: 6,
  total_sources: sources.length,
  sources,
};

const outPath = path.join(ROOT, 'scripts', 'ks2_victorian_rights_entries.json');
fs.writeFileSync(outPath, JSON.stringify(rightsObj, null, 2) + '\n');
console.log(`✅ Wrote scripts/ks2_victorian_rights_entries.json with ${sources.length} commercial-cleared entries!`);
