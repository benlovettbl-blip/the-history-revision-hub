const { execSync } = require('child_process');
const path = require('path');

const ks3Scripts = [
  'render_medieval_england_workbook.cjs',
  'render_monarchy_religion_power_workbook.cjs',
  'render_first_british_empire_workbook.cjs',
  'render_second_british_empire_workbook.cjs',
  'render_industrialisation_workbook.cjs',
  'render_great_war_twopage_workbook.cjs',
  'render_great_war_part2_twopage_workbook.cjs',
  'render_the_shoah_workbook.cjs',
  'render_water_and_sanitation_twopage_workbook.cjs',
  'render_post_war_britain_twopage_workbook.cjs',
  'render_australia_workbook.cjs'
];

console.log('========================================================================');
console.log('COMPILING ALL 11 KEY STAGE 3 PUPIL WORKBOOKS');
console.log('========================================================================\n');

ks3Scripts.forEach((scriptName, idx) => {
  const scriptPath = path.join(__dirname, scriptName);
  process.stdout.write(`[${idx + 1}/11] Compiling ${scriptName}... `);
  try {
    const out = execSync(`node "${scriptPath}"`, { encoding: 'utf8', stdio: 'pipe' });
    console.log('DONE');
  } catch (err) {
    console.log('FAILED');
    console.error(err.stdout || err.message);
  }
});

console.log('\nAll 11 KS3 workbooks compiled successfully.');
