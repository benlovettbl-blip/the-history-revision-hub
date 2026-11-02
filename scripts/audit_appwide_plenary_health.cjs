const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

async function auditAllUnits() {
  const rootDir = path.join(__dirname, '..');
  const unitsDir = path.join(rootDir, 'units');
  const dirs = fs.readdirSync(unitsDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(d => d.name);

  console.log(`Inspecting ${dirs.length} units in units/...`);

  const { getArenaCornersData } = await import(pathToFileURL(path.join(rootDir, 'src/engine/arena_corners_registry.js')).href);
  const { getArenaStandoffPair } = await import(pathToFileURL(path.join(rootDir, 'src/engine/arena_standoff_registry.js')).href);

  let totalLessons = 0;
  let missingDomino = [];
  let oddStandoffs = [];
  let genericCorners = [];

  for (const unitId of dirs) {
    if (unitId === 'trip_ypres') continue;
    const dataJsPath = path.join(unitsDir, unitId, 'data.js');
    if (!fs.existsSync(dataJsPath)) continue;

    let unit;
    try {
      const mod = await import(pathToFileURL(dataJsPath).href);
      unit = mod.unitData || mod.default || mod[unitId];
    } catch (e) {
      console.warn(`Could not load ${unitId}: ${e.message}`);
      continue;
    }

    if (!unit || (!unit.lessons && !unit.subtopics)) continue;
    const lessons = unit.lessons || unit.subtopics;

    lessons.forEach((l, idx) => {
      totalLessons++;
      const lessonId = l.id || `l_${idx}`;

      // Check Standoff
      try {
        const standoff = getArenaStandoffPair(unitId, lessonId, l);
        if (!standoff || !standoff.roleA || !standoff.roleB) {
          oddStandoffs.push({ unitId, lessonId, reason: 'Missing roles' });
        } else {
          // Check for weird "&" combos or repetitive titles
          if (standoff.roleA.name.includes('&') && standoff.roleB.name.includes('&') && standoff.roleA.name.includes('vs')) {
            oddStandoffs.push({ unitId, lessonId, a: standoff.roleA.name, b: standoff.roleB.name });
          }
        }
      } catch (e) {
        oddStandoffs.push({ unitId, lessonId, error: e.message });
      }

      // Check Corners
      try {
        const corners = getArenaCornersData(unitId, lessonId, l);
        if (!corners || !corners.cornerItems || corners.cornerItems.length < 4) {
          genericCorners.push({ unitId, lessonId, reason: 'Fewer than 4 corners' });
        } else if (corners.enquiry.startsWith('Which historical factor') && !l.causal_domino_spine) {
          // generic fallback
        }
      } catch (e) {
        genericCorners.push({ unitId, lessonId, error: e.message });
      }

      // Check Domino stages
      const hasDomino = Boolean(
        (l.causal_domino_spine && l.causal_domino_spine.stages && l.causal_domino_spine.stages.length >= 3) ||
        (l.margin_spine && l.margin_spine.length >= 3) ||
        (l.narrative_blocks && l.narrative_blocks.length >= 3) ||
        (l.blocks && l.blocks.length >= 3)
      );
      if (!hasDomino) {
        missingDomino.push({ unitId, lessonId: l.id });
      }
    });
  }

  console.log(`\nAudit complete: ${totalLessons} lessons scanned.`);
  console.log(`- Lessons lacking domino milestones: ${missingDomino.length}`);
  console.log(`- Standoffs flagged for inspection: ${oddStandoffs.length}`);
  if (oddStandoffs.length > 0) {
    console.log('Sample flagged standoffs:', oddStandoffs.slice(0, 5));
  }
  console.log(`- Corners flagged for inspection: ${genericCorners.length}`);
}

auditAllUnits();
