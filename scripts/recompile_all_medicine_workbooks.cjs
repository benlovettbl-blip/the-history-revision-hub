const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const scripts = [
  'render_medicine_medieval_twopage_workbook.cjs',
  'render_medicine_renaissance_twopage_workbook.cjs',
  'render_medicine_18th_19th_twopage_workbook.cjs',
  'render_medicine_modern_twopage_workbook.cjs',
  'render_medicine_western_front_twopage_workbook.cjs',
  'merge_medicine_master_workbook.cjs'
];

console.log('🚀 Recompiling all 5 Edexcel Medicine Gold Standard Pupil Workbooks...');
for (const s of scripts) {
  const fullPath = path.join(ROOT, 'scripts', s);
  console.log(`\n▶ Running ${s}...`);
  execSync(`node "${fullPath}"`, { stdio: 'inherit', cwd: ROOT });
}
console.log('\n🎉 All 5 Medicine workbooks + Master merged successfully!');

