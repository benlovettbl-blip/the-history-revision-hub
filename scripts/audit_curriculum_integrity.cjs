const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'public', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const publicDir = path.join(__dirname, '..', 'public');

const issues = {
  missingHistoricalSetting: [],
  missingLayer2Plates: [], // < 2 visual plates
  missingLayer3Sources: [], // < 5 sources
  deadImageLinks: [],
  intraLessonDuplicates: [],
  emptyNarrativeBlocks: []
};

let totalLessons = 0;
let totalImagesChecked = 0;

for (const [unitId, unitObj] of Object.entries(db)) {
  const data = unitObj.data || unitObj;
  const lessons = data.lessons || [];

  lessons.forEach((lesson, lIdx) => {
    totalLessons++;
    const lessonNum = lIdx + 1;
    const lessonTitle = lesson.title || lesson.id;
    const ref = `${unitId} L${lessonNum} ("${lessonTitle}")`;

    // 1. Historical Setting check
    const setting = lesson.prologue || lesson.hook_text || lesson.blurb;
    if (!setting || setting.trim().length === 0) {
      issues.missingHistoricalSetting.push(ref);
    }

    // 2. Layer 1 & 2 Narrative blocks check
    const blocks = lesson.narrative_blocks || lesson.blocks || [];
    if (blocks.length === 0) {
      issues.emptyNarrativeBlocks.push(ref);
    }

    const layer2Images = [];
    blocks.forEach((block, bIdx) => {
      if (block.image) {
        layer2Images.push({
          bIdx,
          image: block.image,
          caption: block.caption,
          alt: block.image_alt
        });
      }
    });

    if (layer2Images.length < 2) {
      issues.missingLayer2Plates.push(`${ref}: only ${layer2Images.length} plate(s)`);
    }

    // 3. Layer 3 Sources check
    const sources = lesson.sources || [];
    if (sources.length < 5) {
      issues.missingLayer3Sources.push(`${ref}: only ${sources.length} source(s)`);
    }

    const layer3Images = [];
    sources.forEach((src, sIdx) => {
      const img = src.image || src.src;
      if (img) {
        layer3Images.push({ sIdx, image: img, title: src.title });
      }
    });

    // 4. Intra-lesson duplication check (Layer 2 vs Layer 3)
    layer2Images.forEach(l2 => {
      layer3Images.forEach(l3 => {
        if (l2.image === l3.image) {
          issues.intraLessonDuplicates.push(
            `${ref}: image "${l2.image}" used in both Block ${l2.bIdx} and Source ${l3.sIdx}`
          );
        }
      });
    });

    // 5. Dead links check for all images in lesson (Layer 2, Layer 3, banner, card_image)
    const rawLessonImages = [
      ...layer2Images.map(x => x.image),
      ...layer3Images.map(x => x.image),
      lesson.banner,
      lesson.card_image,
      lesson.cover_image,
      lesson.hero_image
    ].filter(Boolean);

    rawLessonImages.forEach(rawImg => {
      let imgPath = typeof rawImg === 'string' ? rawImg : (rawImg.src || rawImg.url || rawImg.image || '');
      if (!imgPath || typeof imgPath !== 'string') return;
      if (imgPath.startsWith('data:') || imgPath.startsWith('http://') || imgPath.startsWith('https://')) return;

      totalImagesChecked++;
      // Clean query params or anchors if any
      let cleanPath = imgPath.split('?')[0].split('#')[0].trim();
      cleanPath = cleanPath.replace(/^\/?public\//, '');
      if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);

      // Check in publicDir, or public/images
      const resolvedPath = path.join(publicDir, cleanPath);
      const fallbackImagesPath = path.join(publicDir, 'images', cleanPath);

      if (!fs.existsSync(resolvedPath) && !fs.existsSync(fallbackImagesPath)) {
        issues.deadImageLinks.push(`${ref}: missing file on disk "${imgPath}" -> "${resolvedPath}"`);
      }
    });
  });
}

console.log('================ CURRICULUM INTEGRITY AUDIT REPORT ================');
console.log(`Total Units Inspected: ${Object.keys(db).length}`);
console.log(`Total Lessons Inspected: ${totalLessons}`);
console.log(`Total Image Asset References Checked: ${totalImagesChecked}`);
console.log('-------------------------------------------------------------------');
console.log(`Missing Historical Setting: ${issues.missingHistoricalSetting.length}`);
if (issues.missingHistoricalSetting.length) console.log(issues.missingHistoricalSetting);

console.log(`Missing Layer 2 Plates (<2): ${issues.missingLayer2Plates.length}`);
if (issues.missingLayer2Plates.length) console.log(issues.missingLayer2Plates);

console.log(`Missing Layer 3 Sources (<5): ${issues.missingLayer3Sources.length}`);
if (issues.missingLayer3Sources.length) console.log(issues.missingLayer3Sources);

console.log(`Empty Narrative Blocks: ${issues.emptyNarrativeBlocks.length}`);
if (issues.emptyNarrativeBlocks.length) console.log(issues.emptyNarrativeBlocks);

console.log(`Intra-Lesson Duplicates: ${issues.intraLessonDuplicates.length}`);
if (issues.intraLessonDuplicates.length) console.log(issues.intraLessonDuplicates);

console.log(`Dead Image Links (404s on disk): ${issues.deadImageLinks.length}`);
if (issues.deadImageLinks.length) console.log(issues.deadImageLinks);
console.log('===================================================================');
