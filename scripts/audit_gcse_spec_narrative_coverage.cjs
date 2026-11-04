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

function extractNarratives(relPath) {
  const fullPath = path.join(__dirname, '..', relPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  // Match narrative paragraphs or texts
  const paragraphs = [];
  
  // Extract text from narrative blocks
  // In data.js files, there are narrative_blocks arrays with paragraphs
  const paraRegex = /<span class=\\"para-ref\\">\[[\d\.]+\]<\/span>([\s\S]*?)(?:\"|\n)/g;
  let match;
  while ((match = paraRegex.exec(content)) !== null) {
    paragraphs.push(match[1].replace(/\\n/g, ' ').replace(/<[^>]+>/g, '').trim());
  }

  // Also extract raw text fields inside narrative_blocks
  const textRegex = /"text":\s*"([\s\S]*?)"(?=,\s*"sources")/g;
  while ((match = textRegex.exec(content)) !== null) {
    paragraphs.push(match[1].replace(/\\n/g, ' ').replace(/<[^>]+>/g, '').trim());
  }

  return paragraphs.join('\n\n');
}

console.log('Auditing 5 GCSE Units against canonical specifications...\n');

GCSE_UNITS.forEach(unit => {
  const specPath = path.join(__dirname, '..', 'public', 'data', 'specifications', unit.specFile);
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const allNarrativeText = extractNarratives(unit.dataPath);
  console.log(`================================================================`);
  console.log(`UNIT: ${unit.unitId} (${spec.code} - ${spec.shortTitle})`);
  console.log(`Total Narrative Words Extracted: ${allNarrativeText.split(/\s+/).length}`);
  console.log(`================================================================`);

  spec.sections.forEach(sec => {
    console.log(`\n--- ${sec.title} ---`);
    sec.topics.forEach(top => {
      console.log(`  Topic ${top.number}: ${top.title}`);
      top.points.forEach((pt, idx) => {
        // Let's break point into key terms / phrases
        // For example: "The creation of the Israeli Defence Forces and the Law of Return. US aid to Israel."
        // Check sub-clauses
        const subclauses = pt.split(/[\.;\n]+/).map(s => s.trim()).filter(s => s.length > 5);
        console.log(`    [${idx+1}] Spec Point: "${pt}"`);
        
        subclauses.forEach(clause => {
          // Extract keywords (words with length > 3, excluding stopwords)
          const words = clause
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(w => !['including', 'between', 'during', 'their', 'which', 'about', 'after', 'before', 'where', 'with', 'from', 'into', 'that', 'this'].includes(w.toLowerCase()) && w.length > 3);
          
          // Count occurrences of key words or search for exact phrase
          let matches = 0;
          words.forEach(w => {
            const re = new RegExp(`\\b${w}\\b`, 'i');
            if (re.test(allNarrativeText)) matches++;
          });
          const matchRatio = words.length > 0 ? (matches / words.length) : 1;
          const status = matchRatio >= 0.7 ? '✅' : matchRatio >= 0.4 ? '⚠️' : '❌';
          console.log(`       ${status} Subclause: "${clause}" (Keyword match: ${matches}/${words.length})`);
        });
      });
    });
  });
  console.log('\n');
});
