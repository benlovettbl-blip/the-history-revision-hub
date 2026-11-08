const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

console.log('Scanning all data/*.json files...');

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    return;
  }

  let spurred = 0;
  let reflected = 0;
  let decisive = 0;
  let colons = 0;

  function scanStages(stages) {
    if (!Array.isArray(stages)) return;
    stages.forEach(s => {
      const ms = s.model_sentence || '';
      if (ms.includes('Spurred by') && ms.includes('activists and policymakers')) spurred++;
      if (ms.includes('reflected contemporary beliefs')) reflected++;
      if (ms.includes('decisive factor')) decisive++;

      const words = s.words || s.key_terms || [];
      if (Array.isArray(words)) {
        words.forEach(w => {
          const t = typeof w === 'string' ? w : (w.term || '');
          const c = typeof w === 'object' ? (w.clue || '') : '';
          if (t.trim().endsWith(':')) colons++;
          if (c.includes('Spurred by') && c.includes('activists and policymakers')) spurred++;
          if (c.includes('reflected contemporary beliefs')) reflected++;
          if (c.includes('decisive factor')) decisive++;
        });
      }
    });
  }

  function scanLessons(lessons) {
    if (!Array.isArray(lessons)) return;
    lessons.forEach(l => {
      scanStages(l.stages);
      scanStages(l.workbook_stages);
    });
  }

  if (Array.isArray(data)) {
    scanLessons(data);
  } else if (data && typeof data === 'object') {
    scanLessons(data.lessons);
    scanStages(data.stages);
    scanStages(data.workbook_stages);
  }

  if (spurred > 0 || reflected > 0 || decisive > 0 || colons > 0) {
    console.log(`[ALERT] ${file} -> Spurred: ${spurred}, Reflected: ${reflected}, Decisive: ${decisive}, Colons: ${colons}`);
  } else {
    console.log(`[CLEAN] ${file}`);
  }
});

