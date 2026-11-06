const fs = require('fs');
const vm = require('vm');

let raw = fs.readFileSync('units/cme_new/data.js', 'utf8');
raw = raw.replace(/^\s*export\s+default\s+/m, 'cmeData = ');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(raw, ctx);
const d = ctx.cmeData;

console.log('Unit title:', d.title || d.unit_title);
console.log('Total lessons:', d.lessons.length);
d.lessons.forEach(l => {
  console.log(l.id, l.title, 'blocks:', (l.narrative_blocks || []).length);
});

