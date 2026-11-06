const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const dataPath = path.join(ROOT_DIR, 'units', 'australia', 'data.js');
let rawData = fs.readFileSync(dataPath, 'utf8');
rawData = rawData.replace(/^\s*export\s+default\s+/, 'var unitData = ');
const dataSandbox = { unitData: null };
vm.createContext(dataSandbox);
vm.runInContext(rawData, dataSandbox);
const data = dataSandbox.unitData;

data.lessons.forEach((l, eIdx) => {
  console.log(`\n======================================================`);
  console.log(`ENQUIRY ${eIdx + 1}: ${l.title}`);
  console.log(`======================================================`);
  (l.workbook_stages || []).forEach((stg, sIdx) => {
    const block = l.narrative_blocks ? l.narrative_blocks[sIdx] : null;
    console.log(`\n--- Stage ${stg.step}: ${stg.questionHeading} [${stg.date}] ---`);
    console.log(`Triggers: ${stg.bullets.join(' | ')}`);
    console.log(`Current Block Text:\n${block ? block.text : 'MISSING BLOCK'}`);
  });
});

