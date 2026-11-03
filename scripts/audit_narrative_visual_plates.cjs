const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'public', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const allPlates = [];
const intraLessonDupes = [];
const suspiciousPlates = [];

for (const [unitId, unitObj] of Object.entries(db)) {
  const lessons = unitObj?.data?.lessons || [];
  lessons.forEach((l, lIdx) => {
    const blocks = l.narrative_blocks || l.blocks || [];
    const sources = l.sources || [];

    const sourceImages = new Set();
    sources.forEach((s) => {
      if (s.image) sourceImages.add(path.basename(s.image).toLowerCase());
      if (s.src) sourceImages.add(path.basename(s.src).toLowerCase());
    });

    blocks.forEach((b, bIdx) => {
      if (b.image) {
        const plateBasename = path.basename(b.image).toLowerCase();
        const plate = {
          unitId,
          lessonId: l.id || `L${lIdx + 1}`,
          lessonTitle: l.title || '',
          act: b.act || bIdx + 1,
          theme: b.theme_heading || b.title || '',
          image: b.image,
          image_alt: b.image_alt || '',
          caption: b.caption || '',
          text: (b.text || b.content || '').replace(/<[^>]+>/g, ' '),
        };
        allPlates.push(plate);

        // 1. Intra-lesson duplication
        if (sourceImages.has(plateBasename)) {
          intraLessonDupes.push({
            reason: `Narrative plate image ${plateBasename} is also used in a Source drawer within the same lesson!`,
            ...plate,
          });
        }

        // 2. Name checking: if caption starts with or strongly features "Person X" but narrative text doesn't mention them at all
        const capMatch = plate.caption.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/);
        if (capMatch) {
          const person = capMatch[1];
          // Check if person's last name is in the narrative text
          const parts = person.split(/\s+/);
          const lastName = parts[parts.length - 1];
          const textLower = plate.text.toLowerCase();
          const themeLower = plate.theme.toLowerCase();
          if (lastName.length > 3 && !textLower.includes(lastName.toLowerCase()) && !themeLower.includes(lastName.toLowerCase())) {
            suspiciousPlates.push({
              reason: `Caption names "${person}" (${lastName}) but neither block text nor theme heading mentions "${lastName}"!`,
              ...plate,
            });
          }
        }
      }
    });
  });
}

console.log(`Audited ${allPlates.length} visual plates across ${Object.keys(db).length} units.`);
console.log(`\nIntra-lesson duplicates detected: ${intraLessonDupes.length}`);
intraLessonDupes.forEach((d) => {
  console.log(`- [${d.unitId}] ${d.lessonId} (Act ${d.act}): ${d.image}`);
});

console.log(`\nSuspicious name/subject mismatches detected: ${suspiciousPlates.length}`);
suspiciousPlates.forEach((s) => {
  console.log(`- [${s.unitId}] ${s.lessonId} (Act ${s.act}):`);
  console.log(`  Theme: ${s.theme}`);
  console.log(`  Reason: ${s.reason}`);
  console.log(`  Image: ${s.image}`);
  console.log(`  Caption: ${s.caption.slice(0, 100)}...`);
});
