const fs = require('fs');
const vm = require('vm');

let raw = fs.readFileSync('c:/Projects/the-history-revision-hub/units/edexcel_medicine/data.js', 'utf8');
raw = raw.replace(/^\s*export\s+default\s+data;?/m, 'medData = data;');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(raw, ctx);
const d = ctx.medData;

const wbFiles = [
  { name: 'KT1: Medieval', file: 'c:/Projects/the-history-revision-hub/scripts/render_medicine_medieval_twopage_workbook.cjs', varName: 'medievalConfigs' },
  { name: 'KT2: Renaissance', file: 'c:/Projects/the-history-revision-hub/scripts/render_medicine_renaissance_twopage_workbook.cjs', varName: 'renaissanceConfigs' },
  { name: 'KT3: 18th/19th C', file: 'c:/Projects/the-history-revision-hub/scripts/render_medicine_18th_19th_twopage_workbook.cjs', varName: 'eighteenthNineteenthConfigs' },
  { name: 'KT4: Modern', file: 'c:/Projects/the-history-revision-hub/scripts/render_medicine_modern_twopage_workbook.cjs', varName: 'modernConfigs' },
  { name: 'KT5: Western Front', file: 'c:/Projects/the-history-revision-hub/scripts/render_medicine_western_front_twopage_workbook.cjs', varName: 'wfConfigs' },
];

console.log('=== EDEXCEL MEDICINE ALL-KT AUDIT ===\n');

const auditResults = {};

wbFiles.forEach(wb => {
  console.log('\n############################################################');
  console.log('  AUDITING: ' + wb.name);
  console.log('############################################################');
  
  const content = fs.readFileSync(wb.file, 'utf8');
  const startIdx = content.indexOf('const ' + wb.varName + ' = [');
  const endIdx = content.indexOf('\nfunction ', startIdx);
  
  let slice = content.slice(startIdx, endIdx);
  slice = slice.replace('const ' + wb.varName + ' =', 'configs =');
  const evalCtx = {};
  vm.createContext(evalCtx);
  vm.runInContext(slice, evalCtx);
  const configs = evalCtx.configs;
  
  auditResults[wb.name] = [];
  
  configs.forEach((cfg, lIdx) => {
    const lesson = d.lessons.find(l => l.id === cfg.id);
    console.log('\n------------------------------------------------------------');
    console.log('Lesson ' + (lIdx + 1) + ' [' + cfg.id + ']: ' + cfg.title);
    if (!lesson) {
      console.log('  ❌ Lesson not found in data.js!');
      return;
    }
    
    cfg.stages.forEach((st, sIdx) => {
      const block = (lesson.narrative_blocks || [])[sIdx];
      if (!block) {
        console.log('  ❌ Missing block ' + (sIdx + 1) + ' for stage ' + st.step);
        return;
      }
      
      const blockText = ((block.content || '') + ' ' + (block.text || '')).replace(/<[^>]+>/g, ' ');
      
      st.bullets.forEach(b => {
        // Words to look for
        const words = b.split(/[\s(&/,\-—]+/).filter(w => w.length > 2 && !['with', 'from', 'that', 'this', 'into', 'over', 'under'].includes(w.toLowerCase()));
        const missingWords = words.filter(w => !new RegExp('\\b' + w.replace(/[^a-zA-Z0-9]/g, '') + '\\b', 'i').test(blockText));
        
        if (missingWords.length === words.length) {
          console.log('  ❌ COMPLETELY MISSING: Stage ' + st.step + ' [' + b + '] -> missing all words: ' + missingWords.join(', '));
          auditResults[wb.name].push({ lessonId: cfg.id, stage: st.step, block: sIdx + 1, bullet: b, missing: missingWords, type: 'complete' });
        } else if (missingWords.length > 0 && missingWords.length >= words.length / 2) {
          console.log('  ⚠️ PARTIAL GAP: Stage ' + st.step + ' [' + b + '] -> missing: ' + missingWords.join(', '));
          auditResults[wb.name].push({ lessonId: cfg.id, stage: st.step, block: sIdx + 1, bullet: b, missing: missingWords, type: 'partial' });
        }
      });
    });
  });
});

console.log('\n================ AUDIT SUMMARY REPORT ================');
for (const [kt, issues] of Object.entries(auditResults)) {
  console.log(kt + ': ' + issues.length + ' potential gaps detected');
}
