const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const eeeJsonPath = path.join(ROOT, 'data', 'eee.json');
const pubEeeJsonPath = path.join(ROOT, 'public', 'data', 'eee.json');
const eeeJsPath = path.join(ROOT, 'units', 'eee', 'data.js');
const dbPath = path.join(ROOT, 'database.json');
const pubDbPath = path.join(ROOT, 'public', 'database.json');

console.log('Restoring clean narrative blocks for Early Elizabethan England (eee) from HEAD...');

const headRaw = cp.execSync('git show HEAD:data/eee.json', { maxBuffer: 30 * 1024 * 1024 }).toString();
const headData = JSON.parse(headRaw);
const currData = JSON.parse(fs.readFileSync(eeeJsonPath, 'utf8'));

let restoredBlocks = 0;
currData.lessons.forEach((l, li) => {
  const headL = headData.lessons[li];
  if (!headL) return;

  (l.narrative_blocks || []).forEach((b, bi) => {
    const headB = headL.narrative_blocks?.[bi];
    if (!headB) return;

    // Use clean text from HEAD
    const cleanText = headB.text || headB.content;
    if (cleanText) {
      b.content = cleanText;
      b.text = cleanText;
      restoredBlocks++;
    }
  });
});

console.log(`✅ Restored ${restoredBlocks} narrative blocks in eee from pristine git HEAD!`);

// Save to data/eee.json
fs.writeFileSync(eeeJsonPath, JSON.stringify(currData, null, 2), 'utf8');
console.log(`✅ Saved ${eeeJsonPath}`);

// Save to public/data/eee.json
if (fs.existsSync(pubEeeJsonPath)) {
  fs.writeFileSync(pubEeeJsonPath, JSON.stringify(currData, null, 2), 'utf8');
  console.log(`✅ Saved ${pubEeeJsonPath}`);
}

// Update database.json
if (fs.existsSync(dbPath)) {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  db.eee = currData;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log('✅ Updated eee in database.json');
}

// Update public/database.json
if (fs.existsSync(pubDbPath)) {
  const pdb = JSON.parse(fs.readFileSync(pubDbPath, 'utf8'));
  pdb.eee = currData;
  fs.writeFileSync(pubDbPath, JSON.stringify(pdb, null, 2), 'utf8');
  console.log('✅ Updated eee in public/database.json');
}

// Update units/eee/data.js if it exists
if (fs.existsSync(eeeJsPath)) {
  const jsContent = `export default ${JSON.stringify(currData, null, 2)};\n`;
  fs.writeFileSync(eeeJsPath, jsContent, 'utf8');
  console.log(`✅ Saved ${eeeJsPath}`);
}

console.log('🎉 EEE narrative restoration completed successfully!');

