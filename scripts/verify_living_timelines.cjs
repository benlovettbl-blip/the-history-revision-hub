#!/usr/bin/env node
/**
 * scripts/verify_living_timelines.cjs
 *
 * Automated Quality, Asset-Existence, Chronology & Period-Boundary Verifier for
 * Curated Living Timeline Sidecars (`data/timelines/<unit_id>.json` & `public/data/timelines/<unit_id>.json`).
 *
 * Usage:
 *   node scripts/verify_living_timelines.cjs <unit_id> [unit_id_2 ...]
 *   node scripts/verify_living_timelines.cjs --all
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const ALL_CURATED_TIMELINE_UNITS = [
  // 6 GCSE units
  'cme_new',
  'edexcel_medicine',
  'gcse_cold_war',
  'eee',
  'weimar_nazi_germany',
  'usa',
  // 12 KS3 units
  'medieval_england',
  'monarchy_religion_power',
  'water_and_sanitation',
  'first_british_empire',
  'industrialisation_and_empire',
  'second_british_empire',
  'australia',
  'great_war',
  'great_war_part2',
  'the_shoah',
  'cold_war',
  'post_war_britain',
  // 8 KS2 units
  'ks2_stone_to_iron_age',
  'ks2_ancient_egypt',
  'ks2_romans',
  'ks2_anglo_saxons_vikings',
  'ks2_ancient_greece',
  'ks2_early_islamic_baghdad',
  'ks2_maya_civilisation',
  'ks2_ww2',
];

const GCSE_DATE_FENCES = {
  gcse_cold_war: /\b(199[2-9]|20[0-2]\d)\b/g,
  eee: /\b(1589|159\d|16\d\d|17\d\d|18\d\d|19\d\d|20\d\d)\b/g,
  weimar_nazi_germany: /\b(194\d|195\d|20[0-2]\d)\b/g,
  usa: /\b(197[6-9]|198\d|199\d|20[0-2]\d)\b/g,
};

const WEIMAR_BANNED_TRAPS = [
  /aktion\s*t4/i,
  /red\s+orchestra/i,
  /white\s+rose/i,
  /stauffenberg/i,
  /final\s+solution/i,
];

function assetExistsInPublic(urlPath) {
  if (!urlPath || typeof urlPath !== 'string' || !urlPath.startsWith('/')) return false;
  const rel = urlPath.replace(/^\/+/, '').split('?')[0].split('#')[0];
  const pubFull = path.join(ROOT, 'public', rel);
  if (fs.existsSync(pubFull)) return true;
  const rootFull = path.join(ROOT, rel);
  return fs.existsSync(rootFull);
}

function verifyTimelineUnit(unitId) {
  const errors = [];
  const srcPath = path.join(ROOT, 'data', 'timelines', `${unitId}.json`);
  const pubPath = path.join(ROOT, 'public', 'data', 'timelines', `${unitId}.json`);
  const unitPath = path.join(ROOT, 'data', `${unitId}.json`);

  if (!fs.existsSync(srcPath)) {
    errors.push(`Missing canonical sidecar: data/timelines/${unitId}.json`);
    return { errors, stats: null };
  }
  if (!fs.existsSync(pubPath)) {
    errors.push(`Missing public mirror: public/data/timelines/${unitId}.json`);
  } else {
    const a = fs.readFileSync(srcPath, 'utf8').replace(/\r\n/g, '\n').trim();
    const b = fs.readFileSync(pubPath, 'utf8').replace(/\r\n/g, '\n').trim();
    if (a !== b) {
      errors.push(`Mirror drift: data/timelines/${unitId}.json !== public/data/timelines/${unitId}.json`);
    }
  }

  const rawText = fs.readFileSync(srcPath, 'utf8');
  let tl;
  try {
    tl = JSON.parse(rawText);
  } catch (e) {
    errors.push(`Invalid JSON in ${srcPath}: ${e.message}`);
    return { errors, stats: null };
  }

  const unitRaw = JSON.parse(fs.readFileSync(unitPath, 'utf8'));
  const lessons = (unitRaw.data || unitRaw).lessons || [];

  if (tl.unitId !== unitId) {
    errors.push(`unitId mismatch: expected "${unitId}", got "${tl.unitId || ''}"`);
  }
  if (tl.schemaVersion !== 'v1-curated-living-timeline') {
    errors.push(`schemaVersion must be "v1-curated-living-timeline"`);
  }

  const eras = Array.isArray(tl.eras) ? tl.eras : [];
  if (eras.length < 3 || eras.length > 5) {
    errors.push(`Expected 3..5 eras, found ${eras.length}`);
  }
  const eraIds = new Set();
  eras.forEach((e, idx) => {
    if (!e.id || !e.pillLabel || !e.badge || !e.title || !e.color) {
      errors.push(`Era #${idx + 1} missing required fields (id, pillLabel, badge, title, color)`);
    }
    if (String(e.pillLabel || '').length > 34 || /[…]$/.test(String(e.pillLabel || ''))) {
      errors.push(`Era pillLabel "${e.pillLabel}" exceeds 34 chars or ends with ellipsis`);
    }
    eraIds.add(e.id);
  });

  const ms = Array.isArray(tl.milestones) ? tl.milestones : [];
  const isKs2 = tl.cardProfile === 'ks2' || unitId.startsWith('ks2_');
  const isGcse = Boolean(GCSE_DATE_FENCES[unitId]) || unitId === 'cme_new' || unitId === 'edexcel_medicine';
  const minMs = isKs2 ? 9 : isGcse ? 22 : 14;
  if (ms.length < minMs || ms.length > 34) {
    errors.push(`Expected ${minMs}..34 milestones for ${unitId}, found ${ms.length}`);
  }

  // Period date fences & Weimar wartime traps
  const fence = GCSE_DATE_FENCES[unitId];
  if (fence) {
    const visibleDump = JSON.stringify(tl.milestones || []);
    const badDates = visibleDump.match(fence);
    if (badDates) {
      errors.push(`Out-of-period dates in ${unitId}: ${[...new Set(badDates)].join(', ')}`);
    }
  }
  if (unitId === 'weimar_nazi_germany') {
    const visibleDump = JSON.stringify(tl.milestones || []);
    for (const re of WEIMAR_BANNED_TRAPS) {
      if (re.test(visibleDump)) {
        errors.push(`Banned post-1939 wartime term matched ${re} in weimar_nazi_germany`);
      }
    }
  }

  const seenShortTitles = new Set();
  let mapCount = 0;

  ms.forEach((m, i) => {
    const labelRef = `Milestone #${i + 1} (${m.id || 'no-id'})`;
    if (m.num !== i + 1) {
      errors.push(`${labelRef}: expected num=${i + 1}, got ${m.num}`);
    }
    if (!eraIds.has(m.era)) {
      errors.push(`${labelRef}: unknown era "${m.era}" (valid: ${[...eraIds].join(', ')})`);
    }
    const sd = String(m.shortDate || '').trim();
    if (sd.length < 2 || sd.length > 16) {
      errors.push(`${labelRef}: shortDate "${sd}" must be 2..16 chars`);
    }
    const st = String(m.shortTitle || '').trim();
    if (st.length < 6 || st.length > 32 || st.includes('…') || st.endsWith('...')) {
      errors.push(`${labelRef}: shortTitle "${st}" (${st.length} chars) must be 6..32 chars with zero ellipsis`);
    }
    const normSt = st.toLowerCase();
    if (seenShortTitles.has(normSt)) {
      errors.push(`${labelRef}: duplicate shortTitle "${st}"`);
    }
    seenShortTitles.add(normSt);

    if (typeof m.lessonIndex !== 'number' || m.lessonIndex < 0 || m.lessonIndex >= lessons.length) {
      errors.push(`${labelRef}: lessonIndex ${m.lessonIndex} out of range (0..${lessons.length - 1})`);
    }

    if (!assetExistsInPublic(m.imageUrl)) {
      errors.push(`${labelRef}: imageUrl does not exist on disk -> "${m.imageUrl || ''}"`);
    }
    if (m.mapUrl) {
      if (!assetExistsInPublic(m.mapUrl)) {
        errors.push(`${labelRef}: mapUrl does not exist on disk -> "${m.mapUrl}"`);
      } else if (m.mapUrl !== m.imageUrl) {
        mapCount++;
      }
    }

    const maxBeatLen = unitId === 'edexcel_medicine' ? 720 : isKs2 ? 520 : 480;
    for (const beatKey of ['catalyst', 'turningPoint', 'impact']) {
      const val = String(m[beatKey] || '').trim();
      if (val.length < 30 || val.length > maxBeatLen) {
        errors.push(`${labelRef}: ${beatKey} length ${val.length} outside 30..${maxBeatLen} chars`);
      }
      if (/\[\d+\.\d+\]/.test(val) || /<span/i.test(val)) {
        errors.push(`${labelRef}: ${beatKey} contains raw [1.1] bracket or HTML tag`);
      }
    }

    if (i < ms.length - 1) {
      const br = String(m.bridgeToNext || '').trim();
      if (br.length < 25 || br.length > 340) {
        errors.push(`${labelRef}: bridgeToNext length ${br.length} outside 25..340 chars`);
      }
    }

    if (!isKs2) {
      if (!Array.isArray(m.keyTerms) || m.keyTerms.length < 2 || m.keyTerms.length > 6) {
        errors.push(`${labelRef}: expected 2..6 keyTerms objects`);
      } else {
        m.keyTerms.forEach((kt) => {
          if (!kt || !kt.term || !kt.definition) {
            errors.push(`${labelRef}: keyTerm missing term or definition`);
          }
        });
      }

      if (!Array.isArray(m.keyAgents) || m.keyAgents.length < 1 || m.keyAgents.length > 6) {
        errors.push(`${labelRef}: expected 1..6 keyAgents strings`);
      }
    } else if (!m.ks2 || !m.ks2.story || !m.ks2.significance || !m.ks2.childrenLife) {
      errors.push(`${labelRef}: KS2 milestone missing ks2.{story, significance, childrenLife}`);
    }
  });

  return {
    errors,
    stats: {
      eras: eras.length,
      milestones: ms.length,
      maps: mapCount,
    },
  };
}

function main() {
  const args = process.argv.slice(2);
  const runAll = args.includes('--all') || args.length === 0;
  const targets = runAll
    ? ALL_CURATED_TIMELINE_UNITS
    : args.filter((a) => !a.startsWith('-'));

  let failed = 0;
  for (const u of targets) {
    const { errors, stats } = verifyTimelineUnit(u);
    if (errors.length > 0) {
      failed++;
      console.error(`❌ [${u}] FAILED (${errors.length} issue(s)):`);
      errors.slice(0, 25).forEach((e) => console.error(`   - ${e}`));
    } else {
      console.log(
        `✅ [${u}] PASSED — ${stats.eras} Eras | ${stats.milestones} Curated Milestones | ${stats.maps} Synced Maps | 100% Verified Assets`,
      );
    }
  }

  if (failed > 0) process.exit(1);
}

main();
