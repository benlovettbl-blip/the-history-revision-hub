const fs = require('fs');
const path = require('path');

const units = ['weimar_nazi_germany', 'edexcel_medicine', 'usa', 'cme_new', 'eee'];

const report = {};

units.forEach(unit => {
  const jsonPath = path.join(__dirname, '..', 'data', `${unit}.json`);
  if (!fs.existsSync(jsonPath)) return;
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const items = [];

  (data.lessons || []).forEach(l => {
    // Check exam stimuli
    if (l.exam_practice && Array.isArray(l.exam_practice.stimulus)) {
      l.exam_practice.stimulus.forEach((s, idx) => {
        const img = s.image || s.image_url;
        if (img) {
          items.push({
            type: 'Exam Stimulus',
            lessonId: l.id,
            lessonTitle: l.title,
            title: s.title || s.label || `Stimulus ${idx + 1}`,
            caption: s.caption || '',
            contentSnippet: (s.content || '').substring(0, 100),
            image: img
          });
        }
      });
    }

    // Check lesson primary sources
    (l.sources || []).forEach((s, idx) => {
      const img = s.image || s.image_url || s.src;
      if (img && (s.type === 'visual' || s.title?.toLowerCase().includes('photograph') || s.title?.toLowerCase().includes('poster') || s.title?.toLowerCase().includes('cartoon') || s.title?.toLowerCase().includes('source') || img.endsWith('.jpg') || img.endsWith('.png') || img.endsWith('.webp'))) {
        items.push({
          type: 'Lesson Source',
          lessonId: l.id,
          lessonTitle: l.title,
          letter: s.letter || s.id,
          title: s.title || `Source ${idx + 1}`,
          caption: s.caption || '',
          contentSnippet: (s.desc || s.content || s.context || '').substring(0, 100),
          image: img
        });
      }
    });
  });

  report[unit] = items;
});

fs.writeFileSync(path.join(__dirname, 'visual_audit_report.json'), JSON.stringify(report, null, 2));
console.log('Generated visual audit report with entries:');
Object.keys(report).forEach(k => console.log(`  ${k}: ${report[k].length} visual items`));
