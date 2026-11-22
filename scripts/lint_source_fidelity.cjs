const fs = require('fs');
const path = require('path');

const ALL_UNITS = [
  'ks2_ww2',
  'medieval_england',
  'monarchy_religion_power',
  'water_and_sanitation',
  'first_british_empire',
  'industrialisation_and_empire',
  'second_british_empire',
  'australia',
  'great_war',
  'great_war_part2',
  'the_shoah',
  'cold_war',
  'post_war_britain',
  'edexcel_medicine',
  'eee',
  'gcse_cold_war',
  'cme_new',
  'weimar_nazi_germany',
  'usa',
];

const targetUnitArg = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : null;
const units = targetUnitArg ? [targetUnitArg] : ALL_UNITS;

console.log('====================================================');
console.log('🛡️  SOURCE FIDELITY & SEMANTIC CROSS-LINTER');
console.log('====================================================\n');

let totalErrors = 0;
let totalWarnings = 0;
let totalChecked = 0;

// Common stopwords to ignore when analyzing filename stems
const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'a', 'an', 'in', 'on', 'at', 'to', 'of',
  'by', 'or', 'as', 'is', 'are', 'was', 'were', 'c', 'circa', 'v', 'vs', 'de',
  'new', 'old', 'part', 'plate', 'source', 'img', 'image', 'photo', 'photograph',
  'picture', 'map', 'diagram', 'chart', 'poster', 'cartoon', 'figure', 'doc',
  'document', 'archive', 'archival', 'weimar', 'usa', 'edexcel', 'medicine', 'cme',
  'eee', 'unit', 'lesson', 'assets', 'sources', 'images', 'med', 'stage', 'ks', 'ww',
  'gw', 'shoah', 'mrp', 'ws', 'fbe', 'sbe', 'iae', 'pwb', 'clean', 'wide', 'banner'
]);

// Eyes-First Visually Verified Filename Stems (read_file confirmed 20 Nov 2026)
// Maps legacy/abbreviated filenames to verified literal visual terms so genuine matches do not false-positive.
const VERIFIED_EYES_FIRST_STEMS = {
  'keep_calm_poster_1939.jpg': ['ministry of information', 'morale poster', '1939'],
  'evacuation_poster_inf3_87_1939.jpg': ['leave hitler to me', 'ministry of health'],
  'evacuee_luggage_tag.jpg': ['schoolchildren', 'stepney', 'evacuation labels'],
  'prewar_children_holiday.jpg': ['jewish youth football team', 'striped'],
  'land_army_poster_1941.jpg': ['victory harvest', 'fields'],
  'was_military_matrix.png': ['chain of friendship', 'alliance'],
  'gw_clc.jpg': ['chinese labour corps', 'boulogne'],
  'extermination_camps_poland_map.png': ['birkenau', 'rail logistics'],
  'cme_six_day_war_airfield_1967.jpg': ['operation focus', 'destroyed egyptian combat jet'],
  'bdm_domestic_skills.jpg': ['league of german girls', 'bund deutscher'],
  'us-troops-bogged-down.jpg': ['wading', 'swamp'],
};

function extractKeywords(filename) {
  const base = path.basename(filename, path.extname(filename)).toLowerCase();
  // split on _, -, numbers, and non-alphanumeric
  const words = base.split(/[^a-z]+/);
  return words.filter(w => w.length > 2 && !STOPWORDS.has(w));
}

units.forEach(unit => {
  const jsonPath = path.join(__dirname, '..', 'data', `${unit}.json`);
  if (!fs.existsSync(jsonPath)) return;
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  console.log(`\n🔍 Auditing Unit: [${unit.toUpperCase()}] (${data.lessons?.length || 0} lessons)...`);

  const captionsSeen = new Map();
  const unitIssues = [];

  (data.lessons || []).forEach((lesson, lIdx) => {
    // Collect all visual items in this lesson
    const visualItems = [];

    // 1. Narrative blocks
    (lesson.narrative_blocks || []).forEach((block, bIdx) => {
      if (block.image) {
        visualItems.push({
          isPlate: true,
          context: `Lesson ${lesson.id} (Act ${block.act || bIdx + 1})`,
          title: block.title || `Act ${block.act}`,
          caption: block.caption || '',
          image: block.image,
          alt: block.image_alt || '',
          textSnippet: (block.text || '').substring(0, 150)
        });
      }
    });

    // 2. Lesson sources
    (lesson.sources || []).forEach((s, sIdx) => {
      const img = s.image || s.image_url || s.src;
      if (img) {
        visualItems.push({
          context: `Lesson ${lesson.id} Source ${s.letter || s.id || sIdx + 1}`,
          title: s.title || `Source ${sIdx + 1}`,
          caption: s.caption || '',
          image: img,
          alt: s.image_alt || '',
          textSnippet: (s.desc || s.content || s.context || s.text || '').substring(0, 150)
        });
      }
    });

    // 3. Exam practice stimuli
    if (lesson.exam_practice && Array.isArray(lesson.exam_practice.stimulus)) {
      lesson.exam_practice.stimulus.forEach((s, stIdx) => {
        const img = s.image || s.image_url;
        if (img) {
          visualItems.push({
            context: `Lesson ${lesson.id} Exam Stimulus ${stIdx + 1}`,
            title: s.title || `Stimulus ${stIdx + 1}`,
            caption: s.caption || '',
            image: img,
            alt: '',
            textSnippet: (s.content || '').substring(0, 150)
          });
        }
      });
    }

    // Now analyze each visual item
    visualItems.forEach(item => {
      totalChecked++;

      // Check 1: File exists on disk
      const cleanImgPath = item.image.replace(/^\//, '');
      const fullDiskPath = path.join(__dirname, '..', 'public', cleanImgPath);
      if (!fs.existsSync(fullDiskPath)) {
        unitIssues.push({
          type: 'ERROR',
          message: `Missing image file on disk: ${item.image} (${item.context})`
        });
        totalErrors++;
        return;
      }

      // Check 1b: Narrative plate must have an authentic historical caption
      if (item.isPlate && (!item.caption || item.caption.trim().length < 10)) {
        unitIssues.push({
          type: 'MISSING_CAPTION',
          message: `Missing historical caption on Layer 2 Narrative Plate in ${item.context}: ${item.image} ("${item.title}")`
        });
        totalWarnings++;
      }

      // Check 2: Duplicate caption check
      if (item.caption && item.caption.trim().length > 25) {
        const trimmedCap = item.caption.trim();
        if (captionsSeen.has(trimmedCap)) {
          const prev = captionsSeen.get(trimmedCap);
          // If in different lessons, flag as suspicious
          if (prev.context !== item.context) {
            unitIssues.push({
              type: 'WARNING',
              message: `Duplicate caption detected across items:\n    Item 1: ${prev.context} (${prev.title})\n    Item 2: ${item.context} (${item.title})\n    Caption: "${trimmedCap.substring(0, 80)}..."`
            });
            totalWarnings++;
          }
        } else {
          captionsSeen.set(trimmedCap, item);
        }
      }

      // Check 3: Filename vs Caption/Title semantic agreement
      const baseFile = path.basename(item.image);
      const verifiedHints = VERIFIED_EYES_FIRST_STEMS[baseFile] || [];
      const keywords = extractKeywords(item.image);
      if (keywords.length > 0) {
        const rawSearchable = `${item.title} ${item.caption} ${item.alt} ${item.textSnippet}`.toLowerCase();
        const germanAscii = rawSearchable
          .replace(/ß/g, 'ss')
          .replace(/ä/g, 'ae')
          .replace(/ö/g, 'oe')
          .replace(/ü/g, 'ue');
        const searchableText = `${rawSearchable} ${germanAscii}`;
        const hasVerifiedHint = verifiedHints.some((h) => searchableText.includes(h));

        // Count how many keywords match
        const matches = keywords.filter(kw => {
          // simple stemming check
          return searchableText.includes(kw) ||
                 (kw.endsWith('s') && searchableText.includes(kw.slice(0, -1))) ||
                 searchableText.includes(kw + 's') ||
                 searchableText.includes(kw + 'ed') ||
                 searchableText.includes(kw + 'ing');
        });

        // If zero keywords match, flag for human verification
        if (!hasVerifiedHint && matches.length === 0) {
          unitIssues.push({
            type: 'SEMANTIC_DISCREPANCY',
            message: `Potential image-to-text semantic mismatch in ${item.context}:\n    Image: ${item.image}\n    Keywords extracted: [${keywords.join(', ')}]\n    Title: "${item.title}"\n    Caption: "${item.caption ? item.caption.substring(0, 100) + '...' : 'NONE'}"`
          });
          totalWarnings++;
        }
      }
    });
  });

  if (unitIssues.length === 0) {
    console.log(`  ✅ 100% CLEAN: All visual sources verified for [${unit}].`);
  } else {
    console.log(`  ⚠️ Issues flagged for [${unit}] (${unitIssues.length}):`);
    unitIssues.forEach(issue => {
      console.log(`  [${issue.type}] ${issue.message}\n`);
    });
  }
});

console.log('====================================================');
console.log(`📊 AUDIT SUMMARY: Checked ${totalChecked} visual items.`);
console.log(`   Errors (Missing Files): ${totalErrors}`);
console.log(`   Warnings (Semantic / Duplicates): ${totalWarnings}`);
console.log('====================================================');

if (totalErrors > 0) {
  process.exit(1);
}
