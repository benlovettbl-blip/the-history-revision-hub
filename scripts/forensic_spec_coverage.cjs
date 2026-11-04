const fs = require('fs');
const path = require('path');

const GCSE_UNITS = [
  {
    unitId: 'cme_new',
    specFile: 'paper2_p5_middle_east.json',
    dataPath: 'units/cme_new/data.js'
  },
  {
    unitId: 'edexcel_medicine',
    specFile: 'paper1_11_medicine_britain.json',
    dataPath: 'units/edexcel_medicine/data.js'
  },
  {
    unitId: 'weimar_nazi_germany',
    specFile: 'paper3_31_weimar_nazi_germany.json',
    dataPath: 'units/weimar_nazi_germany/data.js'
  },
  {
    unitId: 'eee',
    specFile: 'paper2_b4_early_elizabethan_england.json',
    dataPath: 'units/eee/data.js'
  },
  {
    unitId: 'usa',
    specFile: 'paper3_33_usa_conflict_home_abroad.json',
    dataPath: 'units/usa/data.js'
  }
];

function loadUnitLessons(relPath) {
  const fullPath = path.join(__dirname, '..', relPath);
  const content = fs.readFileSync(fullPath, 'utf8');

  // Let's parse the lessons out
  // Match each lesson object
  // In our units, data.js exports default or module.exports an object with lessons array or properties
  // Let's extract narrative blocks per lesson
  const lessons = [];
  
  // Use a regex to extract lesson objects or narrative blocks
  const lessonMatches = content.split(/\{\s*\"id\":\s*\"(lesson_\d+|[a-zA-Z0-9_\-]+)\"/g);
  
  // Alternative: match all narrative_blocks
  const blockRegex = /\{\s*\"title\":\s*\"([^\"]+)\"[\s\S]*?\"paragraphs\":\s*\[([\s\S]*?)\]/g;
  let match;
  const blocks = [];
  while ((match = blockRegex.exec(content)) !== null) {
    const title = match[1];
    const parasRaw = match[2];
    const paras = [];
    const pRegex = /\"([\s\S]*?)\"/g;
    let pm;
    while ((pm = pRegex.exec(parasRaw)) !== null) {
      const cleanP = pm[1]
        .replace(/<span[^>]*>.*?<\/span>/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\\"/g, '"')
        .replace(/\\n/g, ' ')
        .trim();
      if (cleanP.length > 20) {
        paras.push(cleanP);
      }
    }
    blocks.push({
      title,
      text: paras.join('\n\n')
    });
  }

  return { content, blocks };
}

console.log('=== FORENSIC GCSE SPECIFICATION COVERAGE AUDIT ===\n');

const potentialGaps = [];

GCSE_UNITS.forEach(unit => {
  const specPath = path.join(__dirname, '..', 'public', 'data', 'specifications', unit.specFile);
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const { content, blocks } = loadUnitLessons(unit.dataPath);
  
  console.log(`\n================================================================`);
  console.log(`UNIT: ${unit.unitId.toUpperCase()} (${spec.code} - ${spec.shortTitle})`);
  console.log(`Total Narrative Blocks Found: ${blocks.length}`);
  console.log(`Total Raw Characters: ${content.length}`);
  console.log(`================================================================`);

  spec.sections.forEach(sec => {
    sec.topics.forEach(top => {
      top.points.forEach((pt, ptIdx) => {
        // Evaluate specific named entities and historical terms in the specification point
        // Look for named entities, dates, acts, events
        const terms = [];
        
        // Extract phrases in parentheses (often crucial dates or events, e.g. "(1948–49)", "(July 1946)")
        const parenMatches = pt.match(/\(([^)]+)\)/g);
        if (parenMatches) {
          parenMatches.forEach(p => terms.push(p.replace(/[\(\)]/g, '')));
        }
        
        // Extract capitalized multi-word phrases or key historical nouns
        const cleanPt = pt.replace(/\([^)]+\)/g, '');
        const segments = cleanPt.split(/[,;\.]/).map(s => s.trim()).filter(s => s.length > 0);
        
        // Check for specific core concepts
        segments.forEach(seg => {
          // Clean segment of generic words
          const cleanSeg = seg.replace(/^(The\s+|Key\s+events\s+of\s+|Reasons\s+for\s+|Impact\s+of\s+|Nature\s+of\s+|Features\s+of\s+|Significance\s+of\s+|including\s+|and\s+|their\s+|its\s+)/i, '').trim();
          if (cleanSeg.length > 3) {
            terms.push(cleanSeg);
          }
        });

        // Let's search for how well this point is covered in narrative blocks
        const matchingBlocks = [];
        let totalMentions = 0;
        
        blocks.forEach((b, bIdx) => {
          let blockMatches = 0;
          terms.forEach(t => {
            // Test if term or key words of term appear in block text or title
            const searchWords = t.split(/[\s–\-\/]+/).filter(w => w.length > 3);
            const termRegex = new RegExp(searchWords.join('.*?'), 'i');
            if (termRegex.test(b.title) || termRegex.test(b.text)) {
              blockMatches++;
            }
          });
          if (blockMatches > 0) {
            matchingBlocks.push({ blockIdx: bIdx + 1, title: b.title, blockMatches });
            totalMentions += blockMatches;
          }
        });

        const isWeak = matchingBlocks.length === 0 || totalMentions < 2;
        const statusSymbol = matchingBlocks.length >= 2 ? '✅' : matchingBlocks.length === 1 ? '⚠️' : '❌';

        console.log(`${statusSymbol} [${sec.id.replace('key-topic-', 'KT')}.${top.number}.${ptIdx+1}] ${pt}`);
        if (matchingBlocks.length > 0) {
          console.log(`   └─ Found in ${matchingBlocks.length} block(s): ${matchingBlocks.map(m => `"${m.title}"`).slice(0, 3).join(', ')}`);
        } else {
          console.log(`   └─ 🚨 ZERO DIRECT NARRATIVE MATCHES FOUND!`);
          potentialGaps.push({
            unit: unit.unitId,
            point: pt,
            section: sec.title,
            topic: top.title
          });
        }
      });
    });
  });
});

console.log('\n\n================================================================');
console.log(`AUDIT COMPLETE: Potential Gaps / Zero Matches: ${potentialGaps.length}`);
console.log('================================================================');
potentialGaps.forEach(g => {
  console.log(`- [${g.unit}] ${g.section} > ${g.topic} > "${g.point}"`);
});

