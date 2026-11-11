const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const PDFS = path.join(ROOT_DIR, 'public', 'pdfs');
const UNITS = path.join(ROOT_DIR, 'public', 'units');

function copy(srcRel, destRel) {
  const src = path.join(ROOT_DIR, srcRel);
  const dest = path.join(ROOT_DIR, destRel);
  if (!fs.existsSync(src)) {
    console.error(`❌ Source missing: ${srcRel}`);
    return;
  }
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  const sz = (fs.statSync(dest).size / (1024 * 1024)).toFixed(2);
  console.log(`✅ ${srcRel} -> ${destRel} (${sz} MB)`);
}

function remove(fileRel) {
  const f = path.join(ROOT_DIR, fileRel);
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log(`🗑️ Removed stale file: ${fileRel}`);
  }
}

console.log('=== SYNCHRONIZING ALL UNIT WORKBOOK MIRRORS ===\n');

// 1. Edexcel Medicine
remove('public/units/edexcel_medicine/workbook_${periodName}.pdf');
remove('public/units/edexcel_medicine/workbook_key_individuals.pdf');
copy('public/pdfs/edexcel_medicine_pupil_workbook_master.pdf', 'public/units/edexcel_medicine/workbook.pdf');
copy('public/pdfs/edexcel_medicine_pupil_workbook_master.pdf', 'public/units/edexcel_medicine/pupil_workbook_master.pdf');
copy('public/pdfs/edexcel_medicine_pupil_workbook_medieval.pdf', 'public/units/edexcel_medicine/pupil_workbook_medieval.pdf');
copy('public/pdfs/edexcel_medicine_pupil_workbook_medieval.pdf', 'public/units/edexcel_medicine/workbook_KT1.pdf');
copy('public/pdfs/edexcel_medicine_pupil_workbook_medieval.pdf', 'public/units/edexcel_medicine/workbook_medieval.pdf');
copy('public/pdfs/edexcel_medicine_pupil_workbook_renaissance.pdf', 'public/units/edexcel_medicine/pupil_workbook_renaissance.pdf');
copy('public/pdfs/edexcel_medicine_pupil_workbook_renaissance.pdf', 'public/units/edexcel_medicine/workbook_KT2.pdf');
copy('public/pdfs/edexcel_medicine_pupil_workbook_renaissance.pdf', 'public/units/edexcel_medicine/workbook_renaissance.pdf');
copy('public/pdfs/edexcel_medicine_pupil_workbook_18th_19th.pdf', 'public/units/edexcel_medicine/pupil_workbook_18th_19th.pdf');
copy('public/pdfs/edexcel_medicine_pupil_workbook_18th_19th.pdf', 'public/units/edexcel_medicine/workbook_18th_19th.pdf');
copy('public/pdfs/edexcel_medicine_pupil_workbook_modern.pdf', 'public/units/edexcel_medicine/pupil_workbook_modern.pdf');
copy('public/pdfs/edexcel_medicine_pupil_workbook_modern.pdf', 'public/units/edexcel_medicine/workbook_modern.pdf');
copy('public/pdfs/edexcel_medicine_pupil_workbook_western_front.pdf', 'public/units/edexcel_medicine/pupil_workbook_western_front.pdf');
copy('public/pdfs/edexcel_medicine_pupil_workbook_western_front.pdf', 'public/units/edexcel_medicine/workbook_western_front.pdf');

// 2. Early Elizabethan England (eee)
copy('public/pdfs/eee_pupil_workbook_master.pdf', 'public/units/eee/workbook.pdf');
copy('public/pdfs/eee_pupil_workbook_master.pdf', 'public/units/eee/pupil_workbook.pdf');
copy('public/pdfs/eee_pupil_workbook_master.pdf', 'public/units/eee/pupil_workbook_master.pdf');
copy('public/pdfs/eee_pupil_workbook_KT1.pdf', 'public/units/eee/pupil_workbook_kt1.pdf');
copy('public/pdfs/eee_pupil_workbook_KT1.pdf', 'public/units/eee/workbook_KT1.pdf');
copy('public/pdfs/eee_pupil_workbook_KT2.pdf', 'public/units/eee/pupil_workbook_kt2.pdf');
copy('public/pdfs/eee_pupil_workbook_KT2.pdf', 'public/units/eee/workbook_KT2.pdf');
copy('public/pdfs/eee_pupil_workbook_KT3.pdf', 'public/units/eee/pupil_workbook_kt3.pdf');
copy('public/pdfs/eee_pupil_workbook_KT3.pdf', 'public/units/eee/workbook_KT3.pdf');

// 3. Weimar & Nazi Germany
copy('public/pdfs/weimar_nazi_germany_pupil_workbook_master.pdf', 'public/units/weimar_nazi_germany/workbook.pdf');
copy('public/pdfs/weimar_nazi_germany_pupil_workbook_master.pdf', 'public/units/weimar_nazi_germany/pupil_workbook_master.pdf');
copy('public/pdfs/weimar_nazi_germany_pupil_workbook_KT1.pdf', 'public/units/weimar_nazi_germany/workbook_KT1.pdf');
copy('public/pdfs/weimar_nazi_germany_pupil_workbook_KT2.pdf', 'public/units/weimar_nazi_germany/workbook_KT2.pdf');
copy('public/pdfs/weimar_nazi_germany_pupil_workbook_KT3.pdf', 'public/units/weimar_nazi_germany/workbook_KT3.pdf');
copy('public/pdfs/weimar_nazi_germany_pupil_workbook_KT4.pdf', 'public/units/weimar_nazi_germany/workbook_KT4.pdf');

// 4. USA (1954–1975)
copy('public/pdfs/usa_pupil_workbook_master.pdf', 'public/units/usa/workbook.pdf');
copy('public/pdfs/usa_pupil_workbook_master.pdf', 'public/units/usa/pupil_workbook_master.pdf');
copy('public/pdfs/usa_pupil_workbook_KT1.pdf', 'public/units/usa/workbook_KT1.pdf');
copy('public/pdfs/usa_pupil_workbook_KT2.pdf', 'public/units/usa/workbook_KT2.pdf');
copy('public/pdfs/usa_pupil_workbook_KT3.pdf', 'public/units/usa/workbook_KT3.pdf');
copy('public/pdfs/usa_pupil_workbook_KT4.pdf', 'public/units/usa/workbook_KT4.pdf');

// 5. Great War
copy('public/pdfs/great_war_pupil_workbook.pdf', 'public/units/great_war/workbook.pdf');
copy('public/pdfs/great_war_pupil_workbook.pdf', 'public/units/great_war/workbook_KT1.pdf');
copy('public/pdfs/great_war_part2_pupil_workbook.pdf', 'public/units/great_war/workbook_KT2.pdf');

// 6. Water and Sanitation
copy('public/pdfs/water_and_sanitation_pupil_workbook.pdf', 'public/units/water_and_sanitation/workbook.pdf');

// 7. Industrialisation and Empire
copy('public/pdfs/industrialisation_and_empire_pupil_workbook.pdf', 'public/units/industrialisation_and_empire/workbook.pdf');

console.log('\n🎉 ALL UNIT WORKBOOK MIRRORS SYNCHRONIZED!');
