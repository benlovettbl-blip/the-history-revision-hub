const fs = require('fs');
const path = require('path');

const GCSE_UNITS = [
  {
    unitId: 'cme_new',
    specFile: 'paper2_p5_middle_east.json',
    dataPath: 'units/cme_new/data.js',
    name: 'Conflict in the Middle East, 1945–95 (Option P5)'
  },
  {
    unitId: 'edexcel_medicine',
    specFile: 'paper1_11_medicine_britain.json',
    dataPath: 'units/edexcel_medicine/data.js',
    name: 'Medicine in Britain, c1250–present & Western Front (Option 11)'
  },
  {
    unitId: 'weimar_nazi_germany',
    specFile: 'paper3_31_weimar_nazi_germany.json',
    dataPath: 'units/weimar_nazi_germany/data.js',
    name: 'Weimar & Nazi Germany, 1918–39 (Option 31)'
  },
  {
    unitId: 'eee',
    specFile: 'paper2_b4_early_elizabethan_england.json',
    dataPath: 'units/eee/data.js',
    name: 'Early Elizabethan England, 1558–88 (Option B4)'
  },
  {
    unitId: 'usa',
    specFile: 'paper3_33_usa_conflict_home_abroad.json',
    dataPath: 'units/usa/data.js',
    name: 'The USA, 1954–75: Conflict at Home & Abroad (Option 33)'
  }
];

function extractLessonsAndNarratives(dataPath) {
  const fullPath = path.join(__dirname, '..', dataPath);
  const raw = fs.readFileSync(fullPath, 'utf8');

  // We want to parse out each lesson and its narrative blocks
  const lessons = [];
  
  // Find all lesson blocks
  // In data.js, each lesson has "id": "lesson_..." and "title": "..." and "narrative_blocks": [...]
  // Let's use a regex or evaluation to get the lessons safely
  let unitData;
  try {
    // If it's ES module `export default { ... }`, convert to CommonJS
    const cjsCode = raw
      .replace(/export\s+default\s+/, 'module.exports = ')
      .replace(/import\s+.*?from\s+.*?;/g, '');
    
    // Evaluate in a safe sandboxed function or module
    const m = { exports: {} };
    const fn = new Function('module', 'exports', cjsCode);
    fn(m, m.exports);
    unitData = m.exports;
  } catch (e) {
    // Fallback regex parsing if evaluation fails
    // console.warn(`Fallback parsing for ${dataPath}:`, e.message);
  }

  if (unitData && Array.isArray(unitData.lessons)) {
    unitData.lessons.forEach(l => {
      const lessonTitle = l.title || l.id;
      const lessonId = l.id;
      const blocks = [];
      if (Array.isArray(l.narrative_blocks)) {
        l.narrative_blocks.forEach(nb => {
          const blockTitle = nb.title || nb.theme_heading || '';
          const paras = Array.isArray(nb.paragraphs) ? nb.paragraphs : [];
          const text = (nb.text || '') + ' ' + paras.join(' ');
          const cleanText = text
            .replace(/<span[^>]*>.*?<\/span>/g, '')
            .replace(/<[^>]+>/g, '')
            .replace(/\\"/g, '"')
            .replace(/\s+/g, ' ')
            .trim();
          blocks.push({
            title: blockTitle,
            text: cleanText,
            wordCount: cleanText.split(/\s+/).filter(w => w.length > 0).length
          });
        });
      }
      lessons.push({
        id: lessonId,
        title: lessonTitle,
        blocks
      });
    });
  } else {
    // Regex fallback
    const lessonSplits = raw.split(/\{\s*["']id["']:\s*["'](lesson_\d+|[a-zA-Z0-9_\-]+)["']/g);
    for (let i = 1; i < lessonSplits.length; i += 2) {
      const lId = lessonSplits[i];
      const lBody = lessonSplits[i+1];
      const tMatch = lBody.match(/["']title["']:\s*["']([^"']+)["']/);
      const lTitle = tMatch ? tMatch[1] : lId;
      
      const blocks = [];
      const blockRegex = /\{\s*["']title["']:\s*["']([^"']+)["'][\s\S]*?["']paragraphs["']:\s*\[([\s\S]*?)\]/g;
      let bm;
      while ((bm = blockRegex.exec(lBody)) !== null) {
        const bTitle = bm[1];
        const pRaw = bm[2];
        const pMatches = pRaw.match(/["']([\s\S]*?)["']/g) || [];
        const cleanP = pMatches.map(p => p.replace(/<[^>]+>/g, '').replace(/["']/g, '')).join(' ');
        blocks.push({
          title: bTitle,
          text: cleanP,
          wordCount: cleanP.split(/\s+/).filter(w => w.length > 0).length
        });
      }
      lessons.push({ id: lId, title: lTitle, blocks });
    }
  }

  return lessons;
}

console.log('========================================================================');
console.log('  FORENSIC GCSE SPECIFICATION CROSS-REFERENCE & NARRATIVE AUDIT  ');
console.log('========================================================================\n');

const auditResults = [];

GCSE_UNITS.forEach(unit => {
  const specPath = path.join(__dirname, '..', 'public', 'data', 'specifications', unit.specFile);
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const lessons = extractLessonsAndNarratives(unit.dataPath);

  let totalPoints = 0;
  let robustPoints = 0;
  let weakPoints = 0;
  let missingPoints = 0;

  const unitFindings = [];

  console.log(`\n========================================================================`);
  console.log(`📘 ${unit.name} (${spec.code})`);
  console.log(`   Indexed Lessons: ${lessons.length} lessons`);
  const totalWords = lessons.reduce((acc, l) => acc + l.blocks.reduce((bAcc, b) => bAcc + b.wordCount, 0), 0);
  console.log(`   Total Narrative Words: ${totalWords.toLocaleString()} words`);
  console.log(`========================================================================`);

  spec.sections.forEach(sec => {
    sec.topics.forEach(top => {
      top.points.forEach((pt, idx) => {
        totalPoints++;
        
        // Deconstruct the specification statement into distinct required historical entities / events
        // E.g.: "The creation of the Israeli Defence Forces and the Law of Return. US aid to Israel."
        // E.g.: "Nuremberg Laws, Kristallnacht and the ghettos"
        // E.g.: "The significance of the bombing of the King David Hotel and UN Resolution 181"
        const clauses = pt.split(/[\.;\n]+/).map(c => c.trim()).filter(c => c.length > 3);

        const clauseResults = [];

        clauses.forEach(clause => {
          // Identify key entities in this clause
          // Clean out generic filler
          const cleanClause = clause.replace(/^(The\s+|Key\s+events\s+of\s+|Reasons\s+for\s+|Impact\s+of\s+|Nature\s+of\s+|Features\s+of\s+|Significance\s+of\s+|including\s+|and\s+|their\s+|its\s+)/i, '');
          
          // Let's search all lessons and blocks
          const matchedLocations = [];

          lessons.forEach(l => {
            l.blocks.forEach((b, bIdx) => {
              // Check how well clause items appear in b.title or b.text
              // We'll search for the core substantive nouns / proper nouns
              // Extract significant words (>3 chars)
              const words = cleanClause
                .replace(/[(),]/g, ' ')
                .split(/\s+/)
                .filter(w => w.length > 3 && !['including', 'between', 'during', 'their', 'which', 'about', 'after', 'before', 'where', 'with', 'from', 'into', 'that', 'this', 'over', 'other', 'such', 'under'].includes(w.toLowerCase()));
              
              if (words.length === 0) return;

              let wordHits = 0;
              words.forEach(w => {
                const re = new RegExp(`\\b${w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i');
                if (re.test(b.title) || re.test(b.text)) {
                  wordHits++;
                }
              });

              const hitRatio = wordHits / words.length;
              if (hitRatio >= 0.5 || (words.length <= 2 && wordHits >= 1)) {
                matchedLocations.push({
                  lessonId: l.id,
                  lessonTitle: l.title,
                  blockTitle: b.title,
                  wordsCovered: wordHits,
                  totalWordsInClause: words.length,
                  blockWordCount: b.wordCount,
                  sampleText: b.text.substring(0, 160) + '...'
                });
              }
            });
          });

          // Evaluate depth
          if (matchedLocations.length === 0) {
            clauseResults.push({
              clause,
              status: 'MISSING',
              locations: []
            });
          } else {
            // Check if any matching block has substantial narrative (>= 50 words)
            const hasSubstantialBlock = matchedLocations.some(m => m.blockWordCount >= 60);
            if (hasSubstantialBlock) {
              clauseResults.push({
                clause,
                status: 'ROBUST',
                locations: matchedLocations
              });
            } else {
              clauseResults.push({
                clause,
                status: 'WEAK',
                locations: matchedLocations
              });
            }
          }
        });

        // Overall status of the spec point
        const hasMissing = clauseResults.some(cr => cr.status === 'MISSING');
        const hasWeak = clauseResults.some(cr => cr.status === 'WEAK');

        let pointStatus = 'ROBUST';
        if (hasMissing) {
          pointStatus = 'MISSING';
          missingPoints++;
        } else if (hasWeak) {
          pointStatus = 'WEAK';
          weakPoints++;
        } else {
          robustPoints++;
        }

        const icon = pointStatus === 'ROBUST' ? '✅' : pointStatus === 'WEAK' ? '⚠️' : '🚨';
        console.log(`${icon} [${sec.id || 'SEC'}.${top.number}.${idx+1}] ${pt}`);
        
        clauseResults.forEach(cr => {
          if (cr.status === 'MISSING') {
            console.log(`   🚨 OMISSION: Clause "${cr.clause}" has 0 matching narrative blocks!`);
            unitFindings.push({
              sec: sec.title,
              top: top.title,
              point: pt,
              clause: cr.clause,
              status: 'MISSING'
            });
          } else if (cr.status === 'WEAK') {
            console.log(`   ⚠️ WEAK: Clause "${cr.clause}" only appears in brief/passing blocks (< 60 words).`);
            unitFindings.push({
              sec: sec.title,
              top: top.title,
              point: pt,
              clause: cr.clause,
              status: 'WEAK'
            });
          } else {
            // Robust
            const topLoc = cr.locations[0];
            // console.log(`   ✅ "${cr.clause}" -> ${topLoc.lessonTitle} (${topLoc.blockTitle})`);
          }
        });
      });
    });
  });

  auditResults.push({
    unitId: unit.unitId,
    name: unit.name,
    totalPoints,
    robustPoints,
    weakPoints,
    missingPoints,
    findings: unitFindings
  });
});

console.log('\n\n========================================================================');
console.log('  EXECUTIVE SUMMARY OF GCSE SPECIFICATION CROSS-REFERENCE AUDIT  ');
console.log('========================================================================\n');

auditResults.forEach(res => {
  console.log(`📊 ${res.name}:`);
  console.log(`   Total Specification Points Audited: ${res.totalPoints}`);
  console.log(`   ✅ Fully Robust Narrative Coverage: ${res.robustPoints} (${Math.round(res.robustPoints/res.totalPoints*100)}%)`);
  console.log(`   ⚠️ Weak / Passing Mentions:          ${res.weakPoints}`);
  console.log(`   🚨 Complete Omissions (Missing):     ${res.missingPoints}\n`);

  if (res.findings.length > 0) {
    console.log(`   Detailed Gaps for ${res.unitId}:`);
    res.findings.forEach(f => {
      console.log(`   - [${f.status}] ${f.sec} > ${f.top} > "${f.clause}"`);
    });
    console.log('');
  }
});

