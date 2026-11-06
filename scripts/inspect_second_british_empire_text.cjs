const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');

// Load data.js
const dataPath = path.join(ROOT_DIR, 'units', 'second_british_empire', 'data.js');
let rawData = fs.readFileSync(dataPath, 'utf8');
rawData = rawData.replace(/^\s*export\s+default\s+/, 'var unitData = ');
const dataSandbox = { unitData: null };
vm.createContext(dataSandbox);
vm.runInContext(rawData, dataSandbox);
const data = dataSandbox.unitData;

// Extract enquiryConfigs
const wbPath = path.join(ROOT_DIR, 'scripts', 'render_second_british_empire_workbook.cjs');
const wbContent = fs.readFileSync(wbPath, 'utf8');
const startIdx = wbContent.indexOf('const enquiryConfigs = [');
const endIdx = wbContent.indexOf('\nfunction renderFooterStrip');
const cfgStr = wbContent.slice(startIdx, endIdx);

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(cfgStr.replace('const enquiryConfigs', 'var enquiryConfigs'), sandbox);
const enquiryConfigs = sandbox.enquiryConfigs;

enquiryConfigs.forEach((cfg, eIdx) => {
  const lesson = data.lessons.find(l => l.id === cfg.id) || data.lessons[eIdx];
  console.log(`\n======================================================`);
  console.log(`ENQUIRY ${eIdx + 1}: ${cfg.title}`);
  console.log(`======================================================`);
  cfg.stages.forEach((stg, sIdx) => {
    const block = lesson && lesson.narrative_blocks ? lesson.narrative_blocks[sIdx] : null;
    console.log(`\n--- Stage ${stg.step}: ${stg.questionHeading} [${stg.date}] ---`);
    console.log(`Triggers: ${stg.bullets.join(' | ')}`);
    console.log(`Current Block Text:\n${block ? block.text : 'MISSING BLOCK'}`);
  });
});

