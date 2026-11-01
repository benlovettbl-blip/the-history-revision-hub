const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

async function auditCoverage() {
  const rootDir = path.join(__dirname, '..');
  const manifest = JSON.parse(fs.readFileSync(path.join(rootDir, 'scripts/all_lessons_manifest.json'), 'utf8'));

  const { ARENA_STANDOFF_REGISTRY } = await import(pathToFileURL(path.join(rootDir, 'src/engine/arena_standoff_registry.js')).href);
  const { ARENA_CORNERS_REGISTRY } = await import(pathToFileURL(path.join(rootDir, 'src/engine/arena_corners_registry.js')).href);

  console.log('================ UNIT COVERAGE REPORT ================');
  let totalLessons = 0;
  let totalStandoffs = 0;
  let totalCorners = 0;

  for (const [unitId, lessons] of Object.entries(manifest)) {
    const sReg = ARENA_STANDOFF_REGISTRY[unitId] || {};
    const cReg = ARENA_CORNERS_REGISTRY[unitId] || {};

    let sCount = 0;
    let cCount = 0;

    lessons.forEach(l => {
      totalLessons++;
      const hasS = Boolean(sReg[l.id] || sReg[`lesson_${l.index + 1}`] || sReg[String(l.index + 1)]);
      const hasC = Boolean(cReg[l.id] || cReg[`lesson_${l.index + 1}`] || cReg[String(l.index + 1)]);
      if (hasS) sCount++;
      if (hasC) cCount++;
    });

    totalStandoffs += sCount;
    totalCorners += cCount;

    console.log(`${unitId.padEnd(28)} | Total: ${String(lessons.length).padStart(2)} | Standoffs: ${String(sCount).padStart(2)}/${lessons.length} | Corners: ${String(cCount).padStart(2)}/${lessons.length}`);
  }

  console.log('------------------------------------------------------');
  console.log(`TOTALS: ${totalLessons} lessons | ${totalStandoffs} Standoffs curated | ${totalCorners} Corners curated`);
  console.log(`STILL NEEDED: ${totalLessons - totalStandoffs} Standoffs | ${totalLessons - totalCorners} Corners`);
  console.log('======================================================');
}

auditCoverage();

