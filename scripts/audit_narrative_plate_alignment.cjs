const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to extract proper names (2 capitalized words like 'Joseph Lister', 'Alexander Fleming', etc.)
function extractProperNames(text) {
  if (!text) return [];
  // Match potential person names or prominent historical figures
  const cleaned = text.replace(/<[^>]+>/g, ' ');
  const matches = cleaned.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g) || [];
  return [...new Set(matches)];
}

// Known prominent historical figures across the units to specifically watch for
const WATCHLIST = [
  // Medicine
  'William Harvey', 'Andreas Vesalius', 'Thomas Sydenham', 'Edward Jenner', 'John Snow',
  'Edwin Chadwick', 'Florence Nightingale', 'James Simpson', 'Joseph Lister', 'Louis Pasteur',
  'Robert Koch', 'Paul Ehrlich', 'Gerhard Domagk', 'Alexander Fleming', 'Howard Florey',
  'Ernst Chain', 'Norman Heatley', 'Wilhelm Röntgen', 'Marie Curie', 'Harold Gillies',
  'Archibald McIndoe', 'Aneurin Bevan', 'William Beveridge', 'Francis Crick', 'James Watson',
  'Rosalind Franklin',

  // CME
  'David Ben-Gurion', 'Gamal Abdel Nasser', 'Yasser Arafat', 'King Hussein', 'Anwar Sadat',
  'Menachem Begin', 'Yitzhak Rabin', 'Shimon Peres', 'Ariel Sharon', 'Moshe Dayan',
  'Golda Meir', 'Jimmy Carter', 'Bill Clinton', 'Hafez al-Assad', 'Ehud Barak',

  // EEE
  'Queen Elizabeth', 'Mary Queen of Scots', 'William Cecil', 'Robert Dudley',
  'Francis Walsingham', 'Francis Drake', 'Walter Raleigh', 'King Philip', 'Duke of Norfolk',
  'Anthony Babington', 'Roberto di Ridolfi', 'Francis Throckmorton', 'Mary of Guise',
  'Lord Darnley', 'Earl of Bothwell', 'Archbishop Parker', 'Archbishop Grindal',
  'Archbishop Whitgift', 'Pope Pius', 'Duke of Medina Sidonia',

  // Weimar & Nazi Germany
  'Friedrich Ebert', 'Philipp Scheidemann', 'Karl Liebknecht', 'Rosa Luxemburg',
  'Wolfgang Kapp', 'Walther Rathenau', 'Gustav Stresemann', 'Paul von Hindenburg',
  'Adolf Hitler', 'Erich Ludendorff', 'Ernst Röhm', 'Heinrich Himmler', 'Joseph Goebbels',
  'Hermann Göring', 'Hjalmar Schacht', 'Walther Funk', 'Robert Ley', 'Sophie Scholl',
  'Hans Scholl', 'Claus von Stauffenberg', 'Martin Niemöller', 'Dietrich Bonhoeffer',
  'Reinhard Heydrich',

  // USA
  'Martin Luther King', 'Malcolm X', 'Rosa Parks', 'Linda Brown', 'Dwight Eisenhower',
  'John F. Kennedy', 'Lyndon B. Johnson', 'Richard Nixon', 'Gerald Ford', 'Stokely Carmichael',
  'Huey Newton', 'Bobby Seale', 'James Meredith', 'George Wallace', 'Orval Faubus',
  'Ho Chi Minh', 'Ngo Dinh Diem', 'Nguyen Van Thieu', 'William Westmoreland', 'Henry Kissinger'
];

async function loadUnitData(unitId) {
  const fullPath = path.join(ROOT_DIR, 'units', unitId, 'data.js');
  if (!fs.existsSync(fullPath)) return null;
  const mod = await import('file:///' + fullPath.replace(/\\/g, '/'));
  const d = mod.default || mod[unitId] || mod.unitData || mod.data;
  return d.lessons || (d.subtopics ? d.subtopics.flatMap(s => s.lessons) : []);
}

async function auditUnit(unitId) {
  const lessons = await loadUnitData(unitId);
  if (!lessons) {
    console.log(`❌ Could not load unit: ${unitId}`);
    return;
  }

  console.log(`\n======================================================`);
  console.log(`🔍 AUDITING NARRATIVE PLATES: [${unitId}] (${lessons.length} lessons)`);
  console.log(`======================================================`);

  let totalPlates = 0;
  let missingFiles = 0;
  let duplicates = 0;
  let mismatches = [];

  lessons.forEach((lesson, lIdx) => {
    const lNum = lesson.lesson_number || (lIdx + 1);
    const lTitle = lesson.title || lesson.lesson_title || `Lesson ${lNum}`;
    const blocks = lesson.narrative_blocks || [];
    const lessonSources = [];

    // Collect all source images in this lesson to check duplicates
    if (lesson.sources) {
      lesson.sources.forEach(s => {
        if (s.image) lessonSources.push({ id: s.id || s.letter, img: s.image });
        if (s.image_url && s.image_url !== s.image) lessonSources.push({ id: s.id || s.letter, img: s.image_url });
      });
    }
    blocks.forEach(b => {
      if (b.sources) {
        b.sources.forEach(s => {
          if (s.image) lessonSources.push({ id: s.id || s.letter, img: s.image });
          if (s.image_url && s.image_url !== s.image) lessonSources.push({ id: s.id || s.letter, img: s.image_url });
        });
      }
    });

    blocks.forEach((block, bIdx) => {
      if (!block.image) return;
      totalPlates++;
      const actNum = block.act || (bIdx + 1);
      const actTitle = block.title || block.theme_heading || `Act ${actNum}`;
      const imgPath = block.image;

      // 1. File existence check
      const pubPath = path.join(ROOT_DIR, 'public', imgPath.startsWith('/') ? imgPath.slice(1) : imgPath);
      const rootPath = path.join(ROOT_DIR, imgPath.startsWith('/') ? imgPath.slice(1) : imgPath);
      if (!fs.existsSync(pubPath) && !fs.existsSync(rootPath)) {
        console.log(`❌ [L${lNum} Act ${actNum}] Missing file on disk: ${imgPath}`);
        missingFiles++;
      }

      // 2. Intra-lesson duplication check
      const dupSource = lessonSources.find(s => s.img === imgPath);
      if (dupSource) {
        console.log(`⚠️ [L${lNum} Act ${actNum}] DUPLICATE: Plate image is also used in Source ${dupSource.id} (${imgPath})`);
        duplicates++;
      }

      // 3. Semantic Person / Historical Entity Alignment
      const captionText = `${block.caption || ''} ${block.image_alt || ''}`;
      
      // Find which watchlisted figures are mentioned in the caption/alt
      const mentionedFigures = WATCHLIST.filter(fig => {
        // Match figure or last name if unique
        const regex = new RegExp(`\\b${fig}\\b`, 'i');
        return regex.test(captionText);
      });

      mentionedFigures.forEach(fig => {
        const figRegex = new RegExp(`\\b${fig}\\b`, 'i');
        const lastName = fig.split(' ').slice(-1)[0];
        const lastRegex = new RegExp(`\\b${lastName}\\b`, 'i');

        function getBlockContent(b) {
          const paraText = Array.isArray(b.paragraphs) ? b.paragraphs.join(' ') : '';
          return `${b.title || ''} ${b.theme_heading || ''} ${b.act_title || ''} ${b.text || ''} ${b.content || ''} ${paraText}`;
        }

        // Check if figure appears in the current block's text or title
        const currentBlockContent = getBlockContent(block);
        const inCurrentBlock = figRegex.test(currentBlockContent) || (lastName.length > 4 && lastRegex.test(currentBlockContent));

        if (!inCurrentBlock) {
          // Check if figure appears in another block of the SAME lesson
          const otherBlockMatches = [];
          blocks.forEach((ob, obIdx) => {
            if (obIdx === bIdx) return;
            const obContent = getBlockContent(ob);
            if (figRegex.test(obContent) || (lastName.length > 4 && lastRegex.test(obContent))) {
              otherBlockMatches.push({
                act: ob.act || (obIdx + 1),
                title: ob.title || ob.theme_heading || ob.act_title || `Act ${obIdx + 1}`
              });
            }
          });

          if (otherBlockMatches.length > 0) {
            mismatches.push({
              lesson: `L${lNum}: ${lTitle}`,
              plateAct: actNum,
              actTitle: actTitle,
              figure: fig,
              caption: block.caption,
              image: block.image,
              foundInActs: otherBlockMatches.map(m => `Act ${m.act} ("${m.title}")`).join(', ')
            });
          }
        }
      });
    });
  });

  console.log(`\n📊 RESULTS FOR [${unitId}]:`);
  console.log(`   Total Narrative Plates: ${totalPlates}`);
  console.log(`   Missing Files:          ${missingFiles}`);
  console.log(`   Intra-Lesson Duplicates:${duplicates}`);
  console.log(`   Semantic Mismatches:    ${mismatches.length}`);

  if (mismatches.length > 0) {
    console.log(`\n🚨 DETECTED SEMANTIC MISMATCHES:`);
    mismatches.forEach((m, idx) => {
      console.log(`\n[${idx + 1}] ${m.lesson}`);
      console.log(`    Current Placement: Act ${m.plateAct} ("${m.actTitle}")`);
      console.log(`    Historical Figure: ${m.figure}`);
      console.log(`    Plate Caption:     "${m.caption}"`);
      console.log(`    Plate Image:       ${m.image}`);
      console.log(`    Figure actually discussed in: ${m.foundInActs}`);
    });
  } else {
    console.log(`✅ All narrative plates are semantically aligned with their act's historical figures!`);
  }

  return { unitId, totalPlates, missingFiles, duplicates, mismatches };
}

(async () => {
  const unitsToAudit = process.argv.slice(2).length > 0 
    ? process.argv.slice(2) 
    : ['cme_new', 'eee', 'weimar_nazi_germany'];

  for (const u of unitsToAudit) {
    await auditUnit(u);
  }
})();

