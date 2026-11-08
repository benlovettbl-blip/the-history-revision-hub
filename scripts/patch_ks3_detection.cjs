const fs = require('fs');
const path = require('path');

let snippet = fs.readFileSync(path.resolve(__dirname, 'viewer_replacement_snippet.js'), 'utf8');

const targetStr = "const isKs3 = !isKs2 && (unit.is_ks3 === true || (unit.keyStage || '').toLowerCase().includes('ks3') || /year\\s*[789]\\b/i.test(unit.year_group || unit.yearGroup || ''));";
const replacementStr = "const isKs3 = !isKs2 && (unit.is_ks3 === true || (unit.keyStage || '').toLowerCase().includes('ks3') || (unit.category || '').toLowerCase().includes('ks3') || (unit.title || '').toLowerCase().includes('ks3') || /year\\s*[789]\\b/i.test(unit.year_group || unit.yearGroup || '') || ['australia', 'early_modern_world', 'first_british_empire', 'great_war', 'great_war_part2', 'industrialisation_and_empire', 'medieval_england', 'monarchy_religion_power', 'post_war_britain', 'second_british_empire', 'the_shoah', 'water_and_sanitation'].includes(unit.id || ''));";

snippet = snippet.replaceAll(targetStr, replacementStr);

fs.writeFileSync(path.resolve(__dirname, 'viewer_replacement_snippet.js'), snippet, 'utf8');
console.log('✅ Updated KS3 detection in viewer_replacement_snippet.js');

