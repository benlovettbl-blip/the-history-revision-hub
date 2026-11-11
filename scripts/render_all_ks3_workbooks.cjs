const { execSync } = require('child_process');
const path = require('path');

const scripts = [
  'render_the_shoah_workbook.cjs',
  'render_medieval_england_workbook.cjs',
  'render_monarchy_religion_power_workbook.cjs',
  'render_industrialisation_workbook.cjs',
  'render_first_british_empire_workbook.cjs',
  'render_second_british_empire_workbook.cjs',
  'render_great_war_twopage_workbook.cjs',
  'render_great_war_part2_twopage_workbook.cjs',
  'render_post_war_britain_twopage_workbook.cjs',
  'render_australia_workbook.cjs',
  'render_water_and_sanitation_twopage_workbook.cjs'
];

for (const s of scripts) {
  const fullPath = path.resolve('c:/Projects/the-history-revision-hub/scripts', s);
  console.log(`\n========================================`);
  console.log(`Running ${s}...`);
  try {
    const out = execSync(`node "${fullPath}"`, { encoding: 'utf8' });
    console.log(out.trim());
  } catch (err) {
    console.error(`Error in ${s}:`, err.stdout || err.message);
  }
}
console.log(`\n========================================`);
console.log(`Completed rendering all 11 KS3 workbooks!`);

