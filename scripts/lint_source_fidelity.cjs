const fs = require('fs');
const path = require('path');

const units = [
  'usa',
  'weimar_nazi_germany',
  'edexcel_medicine',
  'cme_new',
  'eee'
];

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
  'eee', 'unit', 'lesson', 'assets', 'sources', 'images'
]);

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
      const keywords = extractKeywords(item.image);
      if (keywords.length > 0) {
        const searchableText = `${item.title} ${item.caption} ${item.alt} ${item.textSnippet}`.toLowerCase();
        
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
        if (matches.length === 0) {
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
