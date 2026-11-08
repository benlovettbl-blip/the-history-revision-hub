const fs = require('fs');
const path = require('path');

const dbs = ['database.json', 'public/database.json'];

const badPatterns = [
  'decisive factor and primary evidence',
  'reflected contemporary beliefs about health, pathology',
  'activists and policymakers mobilised',
  'landmark catalyst for change',
  'Confronted by the crisis of'
];

dbs.forEach(dbFile => {
  const filePath = path.join(__dirname, '..', dbFile);
  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${dbFile} not found.`);
    return;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  console.log(`\n=== Auditing ${dbFile} (File size: ${(raw.length / 1024 / 1024).toFixed(2)} MB) ===`);

  badPatterns.forEach(bp => {
    let count = 0;
    let pos = 0;
    while ((pos = raw.indexOf(bp, pos)) !== -1) {
      count++;
      pos += bp.length;
    }
    if (count > 0) {
      console.log(`  [ALERT] Found ${count} occurrences of "${bp}"`);
    } else {
      console.log(`  [CLEAN] 0 occurrences of "${bp}"`);
    }
  });

  const parsed = JSON.parse(raw);
  let colonTerms = 0;
  for (const unitKey of Object.keys(parsed)) {
    const unit = parsed[unitKey];
    const lessons = Array.isArray(unit) ? unit : (unit.lessons || []);
    lessons.forEach((l, li) => {
      const stages = l.workbook_stages || l.stages || [];
      stages.forEach((s, si) => {
        const words = s.words || s.key_terms || [];
        words.forEach(w => {
          const t = typeof w === 'string' ? w : (w.term || '');
          if (t.trim().endsWith(':')) {
            colonTerms++;
            console.log(`  [COLON] [${unitKey}] L${li+1}S${si+1}: "${t}"`);
          }
        });
      });
    });
  }
  console.log(`  Trailing colon terms in stages: ${colonTerms}`);
});

