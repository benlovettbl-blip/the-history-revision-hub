const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'public', 'data', 'infographics_manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const cmeNewIdMap = {
  lesson_2: 'lesson_1',
  lesson_3: 'lesson_2',
  lesson_4: 'lesson_3',
  lesson_6: 'lesson_4',
  lesson_7: 'lesson_5',
  lesson_8: 'lesson_6',
  lesson_9: 'lesson_7',
  lesson_10: 'lesson_8',
  lesson_11: 'lesson_9',
  lesson_12: 'lesson_10',
  lesson_13: 'lesson_11'
};

if (manifest.cme_new) {
  manifest.cme_new.forEach(item => {
    if (item.lessonId && cmeNewIdMap[item.lessonId]) {
      item.legacyLessonId = item.lessonId;
      item.lessonId = cmeNewIdMap[item.lessonId];
    }
  });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('Successfully updated public/data/infographics_manifest.json');
} else {
  console.error('No cme_new found in manifest');
}

