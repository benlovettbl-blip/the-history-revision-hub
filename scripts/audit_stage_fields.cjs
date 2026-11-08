const fs = require('fs');
const units = fs.readdirSync('units');

console.log('================================================================');
console.log('INSPECTING WORKBOOK_STAGES FIELD NAMES ACROSS UNITS');
console.log('================================================================');

units.forEach(u => {
  const p = `data/${u}.json`;
  if (!fs.existsSync(p)) return;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const l1 = d.lessons?.[0];
  if (!l1) return;

  const stages = l1.workbook_stages || l1.stages || [];
  if (stages.length === 0) {
    console.log(`Unit: ${u.padEnd(28)} | No workbook_stages array on L1`);
    return;
  }

  const s1 = stages[0];
  const keys = Object.keys(s1);
  const titleField = s1.title ? 'title' : (s1.heading ? 'heading' : (s1.theme_heading ? 'theme_heading' : 'NONE'));
  const dateField = s1.dates ? 'dates' : (s1.date ? 'date' : 'NONE');
  console.log(`Unit: ${u.padEnd(28)} | Stages: ${stages.length} | titleField: ${titleField.padEnd(14)} | dateField: ${dateField.padEnd(8)} | keys: [${keys.slice(0, 6).join(', ')}]`);
});

