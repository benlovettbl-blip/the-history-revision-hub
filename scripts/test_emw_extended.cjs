const fs = require('fs');
const path = require('path');
const vm = require('vm');

const d = JSON.parse(fs.readFileSync('data/early_modern_world.json', 'utf8'));
const snippet = fs.readFileSync('scripts/viewer_replacement_snippet.js', 'utf8');

const sandbox = { console, document: { getElementById: () => null } };
vm.createContext(sandbox);
vm.runInContext(snippet + '; this.getTaskStudioLabel = getTaskStudioLabel; this.getTaskTypeInfo = getTaskTypeInfo;', sandbox);

const unitObj = { id: 'early_modern_world', keyStage: 'KS3', is_ks3: true, yearGroup: 'Year 8' };

d.lessons.forEach((les, idx) => {
  const t = les.extended;
  const label = sandbox.getTaskStudioLabel(t, 0, false, true);
  const info = sandbox.getTaskTypeInfo(t, unitObj, les);
  console.log(`\nLesson ${idx + 1}: ${les.title}`);
  console.log(`  Question: "${t?.question}"`);
  console.log(`  Label: "${label}"`);
  console.log(`  Type: "${info.type}"`);
  console.log(`  Starter: "${info.starter}"`);
  console.log(`  Pills:`, info.trackerTerms);
});

