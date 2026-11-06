const fs = require('fs');
const path = require('path');

const unitsDir = path.resolve(__dirname, '../units');
const unitDirs = fs.readdirSync(unitsDir).filter(d => fs.statSync(path.join(unitsDir, d)).isDirectory());

console.log('Scanning for truncated do_now answers across all units...\n');

let totalTruncated = 0;

for (const unit of unitDirs) {
  const dataPath = path.join(unitsDir, unit, 'data.js');
  if (!fs.existsSync(dataPath)) continue;

  const content = fs.readFileSync(dataPath, 'utf8');
  let data;
  try {
    // If it's window.curriculumData = { ... } or similar
    const jsonStr = content.replace(/^[\s\S]*?(?:window\.\w+\s*=\s*|const\s+\w+\s*=\s*)/, '').replace(/;\s*$/, '');
    data = JSON.parse(jsonStr);
  } catch (e) {
    // fallback regex search
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('"answer":') && (line.includes('...') || line.includes('…') || line.endsWith('to..."') || line.length < 25)) {
        console.log(`[${unit}] Line ${idx + 1}: ${line.trim()}`);
        totalTruncated++;
      }
    });
    continue;
  }

  if (data.lessons) {
    data.lessons.forEach((l, lIdx) => {
      if (l.do_now && l.do_now.items) {
        l.do_now.items.forEach((item, qIdx) => {
          const ans = item.answer || '';
          if (ans.includes('...') || ans.includes('…') || ans.endsWith('to') || ans.endsWith('that')) {
            console.log(`[${unit}] Lesson ${l.id || lIdx + 1} Q${qIdx + 1}:`);
            console.log(`  Question: ${item.question}`);
            console.log(`  Answer:   ${ans}\n`);
            totalTruncated++;
          }
        });
      }
    });
  }
}

console.log(`Total truncated do_now answers found: ${totalTruncated}`);

