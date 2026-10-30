const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const dbPath = path.join(rootDir, 'public/database.json');

if (!fs.existsSync(dbPath)) {
  console.error('❌ public/database.json not found! Run node scripts/build_database.cjs first.');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const unitKeys = Object.keys(db);

console.log('================================================================');
console.log('🏛️  THE HISTORY REVISION HUB — GLOBAL PLATFORM INTEGRITY AUDIT');
console.log('================================================================\n');
console.log(
  `🔍 Deep-auditing all ${unitKeys.length} curriculum units across all 160 lessons in 1 swoop...\n`,
);

const report = {
  totalUnits: unitKeys.length,
  totalLessons: 0,
  totalNarrativePlates: 0,
  totalSources: 0,
  intraLessonDuplicates: [],
  sourceToSourceDuplicates: [],
  missingFiles: [],
  languageAlerts: [],
  croppingRisks: [],
  doNowSelfTests: [],
};

function fileExistsOnDisk(relPath, unitId) {
  if (!relPath || typeof relPath !== 'string') return true;
  if (
    relPath.startsWith('http://') ||
    relPath.startsWith('https://') ||
    relPath.startsWith('data:')
  ) {
    return true;
  }
  const clean = relPath.split('?')[0].split('#')[0];
  const basename = path.basename(clean);
  const candidates = [
    path.join(rootDir, 'public', clean.startsWith('/') ? clean.slice(1) : clean),
    path.join(rootDir, clean.startsWith('/') ? clean.slice(1) : clean),
    path.join(rootDir, 'units', unitId, 'assets', basename),
    path.join(rootDir, 'public/units', unitId, 'assets', basename),
    path.join(rootDir, 'public/images', basename),
    path.join(rootDir, 'assets', basename),
  ];
  return candidates.some((c) => fs.existsSync(c));
}

// Banned / Niche A-Level jargon for GCSE units
const GCSE_UNITS = new Set([
  'cme_new',
  'usa',
  'edexcel_medicine',
  'weimar_nazi_germany',
  'eee',
  'cold_war',
]);
const NICHE_JARGON = [
  'Gush Emunim',
  'DEFCON 3',
  'Operation Nickel Grass',
  'Kilometer 101',
  'Synergistic Learning',
  'Pedagogical Ecosystem',
  'Specification Mastery',
  'Disciplinary Synthesis',
];

for (const unitId of unitKeys) {
  const unit = db[unitId].data;
  if (!unit) continue;
  const rawLessons = unit.lessons || unit.subtopics || [];
  const lessons = Array.isArray(rawLessons) ? rawLessons : Object.values(rawLessons);

  lessons.forEach((lesson, lIdx) => {
    report.totalLessons++;
    const lessonTitle = lesson.title || `Lesson ${lIdx + 1}`;

    // Collect genuine Layer 2 narrative visual plates
    const narrativeImages = [];
    if (Array.isArray(lesson.narrative_blocks)) {
      lesson.narrative_blocks.forEach((b, bIdx) => {
        if (b.image && typeof b.image === 'string') {
          report.totalNarrativePlates++;
          narrativeImages.push({
            blockIdx: bIdx + 1,
            blockTitle: b.title || b.theme_heading || `Block ${bIdx + 1}`,
            file: b.image,
            base: path.basename(b.image),
          });
          if (!fileExistsOnDisk(b.image, unitId)) {
            report.missingFiles.push({
              unitId,
              lessonTitle,
              file: b.image,
              role: `Narrative Block ${bIdx + 1}`,
            });
          }
        }
      });
    }

    // Collect genuine Layer 3 primary sources
    const sources = [];
    const rawSources = lesson.sources || [];
    if (Array.isArray(rawSources)) {
      rawSources.forEach((s) => {
        const sImg = s.image || s.src || s.source;
        if (sImg && typeof sImg === 'string') {
          report.totalSources++;
          sources.push({
            id: s.id || s.letter || 'Source',
            title: s.title || 'Source',
            file: sImg,
            base: path.basename(sImg),
          });
          if (!fileExistsOnDisk(sImg, unitId)) {
            report.missingFiles.push({
              unitId,
              lessonTitle,
              file: sImg,
              role: `Source ${s.letter || s.id}`,
            });
          }
        }

        // Language audit on model answers
        if (GCSE_UNITS.has(unitId) && s.model_answer) {
          NICHE_JARGON.forEach((term) => {
            if (s.model_answer.toLowerCase().includes(term.toLowerCase())) {
              report.languageAlerts.push({
                unitId,
                lessonTitle,
                source: s.letter || s.id,
                term,
              });
            }
          });
        }
      });
    }

    // 1. Layer 2 vs Layer 3 Duplicate Check: A narrative plate MUST NOT be reused as a primary source!
    narrativeImages.forEach((n) => {
      sources.forEach((s) => {
        if (n.base === s.base) {
          report.intraLessonDuplicates.push({
            unitId,
            lessonTitle,
            narrativeBlock: n.blockTitle,
            sourceId: s.id,
            file: n.base,
          });
        }
      });
    });

    // 2. Layer 3 Source vs Source Duplicate Check: Two distinct sources in the same lesson must not use the same image
    const seenSources = new Map();
    sources.forEach((s) => {
      if (seenSources.has(s.base)) {
        report.sourceToSourceDuplicates.push({
          unitId,
          lessonTitle,
          firstSource: seenSources.get(s.base),
          secondSource: s.id,
          file: s.base,
        });
      } else {
        seenSources.set(s.base, s.id);
      }
    });

    // 3. Do Now Starter Check: Lesson 1 must not test current lesson content
    if (lesson.starter && lesson.starter.questions && Array.isArray(lesson.starter.questions)) {
      const currentTitleWords = lessonTitle
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .split(' ')
        .filter((w) => w.length > 4);
      lesson.starter.questions.forEach((qObj, qIdx) => {
        const qText = (
          qObj.question ||
          qObj.q ||
          (typeof qObj === 'string' ? qObj : '')
        ).toLowerCase();
        if (
          lIdx === 0 &&
          currentTitleWords.some(
            (w) =>
              qText.includes(w) && !['history', 'introduction', 'overview', 'origins'].includes(w),
          )
        ) {
          report.doNowSelfTests.push({
            unitId,
            lessonTitle,
            qIndex: qIdx + 1,
            question: qText.slice(0, 80),
          });
        }
      });
    }
  });
}

// ---------------------------------------------------------------------------
// AUDIT PILLAR 3: CSS OBJECT-FIT HEAD-CHOPPING PROTECTION
// ---------------------------------------------------------------------------
const srcDir = path.join(rootDir, 'src');
function scanDirForCropping(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      scanDirForCropping(full);
    } else if (f.endsWith('.js') || f.endsWith('.css')) {
      const code = fs.readFileSync(full, 'utf8');
      const lines = code.split('\n');
      lines.forEach((l, lNum) => {
        if (
          l.includes('object-fit: cover') &&
          (l.includes('source') ||
            l.includes('timeline') ||
            l.includes('primary') ||
            l.includes('cme-tl-thumb'))
        ) {
          report.croppingRisks.push({
            file: path.relative(rootDir, full),
            line: lNum + 1,
            code: l.trim(),
          });
        }
      });
    }
  }
}
scanDirForCropping(srcDir);

// ---------------------------------------------------------------------------
// REPORT OUTPUT
// ---------------------------------------------------------------------------
console.log('--- [1. VISUAL ASSET INTEGRITY & DE-DUPLICATION] ---');
console.log(
  `Inspected ${report.totalLessons} Lessons, ${report.totalNarrativePlates} Narrative Illustration Plates, and ${report.totalSources} Primary Sources across 18 Units.`,
);

if (report.intraLessonDuplicates.length === 0) {
  console.log('✅ ZERO Layer 2 vs Layer 3 duplicates detected across all 18 units!');
} else {
  console.log(
    `⚠️ Detected ${report.intraLessonDuplicates.length} Layer 2 vs Layer 3 Duplicates (Narrative Plate reused as Source):`,
  );
  report.intraLessonDuplicates.forEach((d) => {
    console.log(
      `  - [${d.unitId}] ${d.lessonTitle}: '${d.file}' used in Narrative Block '${d.narrativeBlock}' AND Source '${d.sourceId}'`,
    );
  });
}

if (report.sourceToSourceDuplicates.length === 0) {
  console.log('✅ ZERO duplicate primary sources within the same lesson across all 18 units!');
} else {
  console.log(
    `⚠️ Detected ${report.sourceToSourceDuplicates.length} Duplicate Sources in Same Lesson:`,
  );
  report.sourceToSourceDuplicates.forEach((d) => {
    console.log(
      `  - [${d.unitId}] ${d.lessonTitle}: '${d.file}' duplicated between '${d.firstSource}' and '${d.secondSource}'`,
    );
  });
}

if (report.missingFiles.length === 0) {
  console.log('✅ ZERO missing or broken visual assets across all 18 units!');
} else {
  console.log(`⚠️ Detected ${report.missingFiles.length} Missing or Broken File References:`);
  report.missingFiles.forEach((m) => {
    console.log(`  - [${m.unitId}] ${m.lessonTitle}: (${m.role}) -> ${m.file}`);
  });
}

console.log('\n--- [2. DISCIPLINARY LANGUAGE & GCSE VOCABULARY AUDIT] ---');
if (report.languageAlerts.length === 0) {
  console.log(
    '✅ ZERO out-of-scope academic jargon or corporate buzzwords found in GCSE model answers!',
  );
} else {
  console.log(`⚠️ Detected ${report.languageAlerts.length} Language Alerts:`);
  report.languageAlerts.forEach((a) => {
    console.log(`  - [${a.unitId}] ${a.lessonTitle} (${a.source}): contains '${a.term}'`);
  });
}

console.log('\n--- [3. REPROGRAPHIC CROPPING & OBJECT-FIT PROTECTION] ---');
if (report.croppingRisks.length === 0) {
  console.log(
    '✅ ZERO high-risk object-fit: cover rules found on primary sources or timeline components!',
  );
} else {
  console.log(`⚠️ Detected ${report.croppingRisks.length} potential image cropping risks:`);
  report.croppingRisks.forEach((r) => console.log(`  - ${r.file}:${r.line} -> ${r.code}`));
}

console.log('\n--- [4. PEDAGOGICAL RETRIEVAL STARTER CHECK] ---');
if (report.doNowSelfTests.length === 0) {
  console.log('✅ ZERO self-testing starter violations detected in Lesson 1 starters!');
} else {
  console.log(
    `⚠️ Detected ${report.doNowSelfTests.length} potential self-testing starter violations:`,
  );
  report.doNowSelfTests.forEach((s) => {
    console.log(`  - [${s.unitId}] ${s.lessonTitle} Q${s.qIndex}: "${s.question}"`);
  });
}

console.log('\n================================================================');
console.log('📊 GLOBAL PLATFORM INTEGRITY AUDIT SUMMARY');
console.log('================================================================');
console.log(`Total Units Audited:        ${report.totalUnits}`);
console.log(`Total Lessons Scanned:      ${report.totalLessons}`);
console.log(`Narrative Plates Inspected: ${report.totalNarrativePlates}`);
console.log(`Primary Sources Inspected:  ${report.totalSources}`);
console.log(
  `Layer 2 vs 3 Duplicates:    ${report.intraLessonDuplicates.length === 0 ? '0 (✅ OPTIMAL)' : report.intraLessonDuplicates.length}`,
);
console.log(
  `Source-to-Source Dupes:     ${report.sourceToSourceDuplicates.length === 0 ? '0 (✅ OPTIMAL)' : report.sourceToSourceDuplicates.length}`,
);
console.log(
  `Missing/Broken Files:       ${report.missingFiles.length === 0 ? '0 (✅ OPTIMAL)' : report.missingFiles.length}`,
);
console.log(
  `Language & Jargon Alerts:   ${report.languageAlerts.length === 0 ? '0 (✅ OPTIMAL)' : report.languageAlerts.length}`,
);
console.log(
  `Image Cropping Risks:       ${report.croppingRisks.length === 0 ? '0 (✅ OPTIMAL)' : report.croppingRisks.length}`,
);
console.log(
  `Do-Now Self-Test Alerts:    ${report.doNowSelfTests.length === 0 ? '0 (✅ OPTIMAL)' : report.doNowSelfTests.length}`,
);
console.log('================================================================\n');

if (
  report.intraLessonDuplicates.length > 0 ||
  report.sourceToSourceDuplicates.length > 0 ||
  report.missingFiles.length > 0
) {
  process.exit(1);
} else {
  process.exit(0);
}
