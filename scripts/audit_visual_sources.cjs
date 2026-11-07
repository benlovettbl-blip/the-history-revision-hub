const fs = require('fs');
const path = require('path');

const units = ['weimar_nazi_germany', 'edexcel_medicine', 'usa', 'cme_new', 'eee'];

console.log('=== AUDIT OF ALL VISUAL EXAM STIMULI & PRIMARY SOURCES ===\n');

units.forEach(unit => {
  const jsonPath = path.join(__dirname, '..', 'data', `${unit}.json`);
  if (!fs.existsSync(jsonPath)) return;
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  console.log(`\n==================================================`);
  console.log(`UNIT: ${unit.toUpperCase()} (${data.lessons?.length || 0} lessons)`);
  console.log(`==================================================`);

  let examVisuals = [];
  let lessonVisuals = [];

  (data.lessons || []).forEach(l => {
    // Exam practice sources
    const ep = l.exam_practice;
    if (ep && Array.isArray(ep.stimulus)) {
      ep.stimulus.forEach(s => {
        const img = s.image || s.image_url;
        if (img) {
          examVisuals.push({
            lessonId: l.id,
            lessonTitle: l.title,
            title: s.title || s.label || 'Stimulus',
            image: img,
            caption: s.caption || '',
            content: s.content || '',
            provenance: s.provenance || ''
          });
        }
      });
    }

    // Primary sources
    (l.sources || []).forEach(s => {
      const img = s.image || s.image_url;
      if (img) {
        lessonVisuals.push({
          lessonId: l.id,
          title: s.title || s.label || 'Source',
          image: img,
          caption: s.caption || '',
          content: s.content || ''
        });
      }
    });
  });

  console.log(`Total Visual Exam Stimuli: ${examVisuals.length}`);
  console.log(`Total Visual Lesson Sources: ${lessonVisuals.length}`);

  if (examVisuals.length > 0) {
    console.log(`\n--- EXAM STIMULI DETAILS (${unit}) ---`);
    examVisuals.forEach(v => {
      console.log(`[L${v.lessonId}] Img: ${v.image}`);
      console.log(`  Title: ${v.title}`);
      console.log(`  Caption: ${v.caption}`);
      if (v.content) console.log(`  Content: ${v.content.substring(0, 100)}...`);
    });
  }
});
