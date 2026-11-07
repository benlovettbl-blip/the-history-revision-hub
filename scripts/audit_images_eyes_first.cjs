const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const usaMod = require(path.join(rootDir, 'units/usa/data.js'));
const usa = usaMod.default || usaMod;
const germanyMod = require(path.join(rootDir, 'units/weimar_nazi_germany/data.js'));
const germany = germanyMod.default || germanyMod;

function collectImages(data, unitName) {
  const list = [];
  data.lessons.forEach(l => {
    // Narrative blocks
    if (l.narrative_blocks) {
      l.narrative_blocks.forEach((b, idx) => {
        if (b.image) {
          list.push({
            unit: unitName,
            lessonId: l.id,
            section: 'narrative_block_' + idx,
            image: b.image,
            caption: b.caption || '',
            alt: b.image_alt || ''
          });
        }
      });
    }
    // Exam practice stimulus
    if (l.exam_practice && l.exam_practice.stimulus) {
      l.exam_practice.stimulus.forEach((s) => {
        if (s.image) {
          list.push({
            unit: unitName,
            lessonId: l.id,
            section: 'exam_stimulus_' + (s.id || s.title || ''),
            title: s.title || '',
            image: s.image,
            caption: s.archival_caption || s.caption || '',
            provenance: s.provenance || ''
          });
        }
      });
    }
    // Any sources A-E drawers if present
    if (l.sources) {
      l.sources.forEach((s) => {
        if (s.image) {
          list.push({
            unit: unitName,
            lessonId: l.id,
            section: 'lesson_source_' + (s.id || ''),
            title: s.title || '',
            image: s.image,
            caption: s.caption || s.archival_caption || '',
            provenance: s.provenance || ''
          });
        }
      });
    }
  });
  return list;
}

const all = [...collectImages(usa, 'usa'), ...collectImages(germany, 'germany')];

console.log(`Found ${all.length} image references in USA and Germany.`);

all.forEach((item, i) => {
  const diskPath = path.join(rootDir, 'public', item.image.replace(/^\//, ''));
  const exists = fs.existsSync(diskPath);
  let size = exists ? fs.statSync(diskPath).size : 0;
  console.log(`[${i+1}] [${item.unit}] [${item.lessonId}] [${item.section}]`);
  console.log(`    Image: ${item.image} (${exists ? size + ' bytes' : 'MISSING!'})`);
  console.log(`    Caption: ${(item.caption || item.title || '').substring(0, 100)}`);
});

