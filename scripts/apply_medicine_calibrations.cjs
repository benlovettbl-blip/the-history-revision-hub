const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const dataJsPath = path.join(ROOT_DIR, 'units', 'edexcel_medicine', 'data.js');
const publicDataJsPath = path.join(ROOT_DIR, 'public', 'units', 'edexcel_medicine', 'data.js');

// 1. Create a fresh timestamped backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(ROOT_DIR, 'temp_backups');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
const backupPath = path.join(backupDir, `edexcel_medicine_data_${timestamp}.js`);
fs.copyFileSync(dataJsPath, backupPath);
console.log(`✅ Safety backup created at: ${backupPath}`);

// 2. Load calibration modules
const calDir = path.join(__dirname, 'medicine_calibrations');
const p1 = require(path.join(calDir, 'period1_medieval.cjs'));
const p2 = require(path.join(calDir, 'period2_renaissance.cjs'));
const p3 = require(path.join(calDir, 'period3_industrial.cjs'));
const p4 = require(path.join(calDir, 'period4_modern.cjs'));
const p5 = require(path.join(calDir, 'period5_western_front.cjs'));

const allCalibrations = { ...p1, ...p2, ...p3, ...p4, ...p5 };

// 3. Read and parse units/edexcel_medicine/data.js
const rawData = fs.readFileSync(dataJsPath, 'utf8');
const jsonStr = rawData.replace(/^\s*export\s+default\s+/, '').replace(/;\s*$/, '');
const unitData = JSON.parse(jsonStr);

if (!unitData.lessons || unitData.lessons.length !== 26) {
  throw new Error(`Expected 26 lessons, found ${unitData.lessons ? unitData.lessons.length : 0}`);
}

console.log('🔄 Applying calibrated narrative blocks across all 26 lessons...');

for (let i = 0; i < 26; i++) {
  const lesson = unitData.lessons[i];
  const calBlocks = allCalibrations[i];
  if (!calBlocks || calBlocks.length !== 5) {
    throw new Error(`Lesson ${i + 1} (${lesson.id}) missing calibrated blocks (expected 5, got ${calBlocks ? calBlocks.length : 0})`);
  }

  if (!lesson.narrative_blocks || lesson.narrative_blocks.length !== 5) {
    throw new Error(`Lesson ${i + 1} (${lesson.id}) narrative_blocks count is not 5`);
  }

  calBlocks.forEach((calB, bIdx) => {
    const targetB = lesson.narrative_blocks[bIdx];
    
    // Update narrative text & content
    targetB.text = calB.text;
    targetB.content = calB.text;

    // Update title and theme if provided
    if (calB.title) targetB.title = calB.title;
    if (calB.theme) targetB.theme = calB.theme;
    if (calB.theme_heading) targetB.theme_heading = calB.theme_heading;
  });

  // Anti-duplication check within the lesson
  const texts = lesson.narrative_blocks.map(b => b.text.replace(/<[^>]+>/g, '').trim());
  const uniqueTexts = new Set(texts);
  if (uniqueTexts.size !== 5) {
    throw new Error(`Fatal: Duplicate block text detected in Lesson ${i + 1} (${lesson.id})!`);
  }
}

// 4. Verify all 130 blocks have valid para-ref tags
let missingRefs = 0;
unitData.lessons.forEach((l, lIdx) => {
  l.narrative_blocks.forEach((b, bIdx) => {
    if (!/<span class=["']para-ref["']>\[\d+\.\d+\]<\/span>/.test(b.text)) {
      console.warn(`⚠️ Warning: Lesson ${lIdx + 1} Block ${bIdx + 1} lacks para-ref tag!`);
      missingRefs++;
    }
  });
});

if (missingRefs > 0) {
  throw new Error(`Fatal: ${missingRefs} blocks lack paragraph references!`);
}

// 5. Serialize and write out to both locations
const outputContent = `export default ${JSON.stringify(unitData, null, 2)};\n`;

fs.writeFileSync(dataJsPath, outputContent, 'utf8');
console.log(`✅ Successfully updated ${dataJsPath}`);

fs.writeFileSync(publicDataJsPath, outputContent, 'utf8');
console.log(`✅ Successfully updated ${publicDataJsPath}`);

console.log('🎉 Calibration application complete! All 26 lessons and 130 narrative blocks are now uniform.');

