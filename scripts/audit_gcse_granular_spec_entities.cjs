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

  let unitData;
  try {
    const cjsCode = raw
      .replace(/export\s+default\s+/, 'module.exports = ')
      .replace(/import\s+.*?from\s+.*?;/g, '');
    const m = { exports: {} };
    const fn = new Function('module', 'exports', cjsCode);
    fn(m, m.exports);
    unitData = m.exports;
  } catch (e) {}

  const lessons = [];

  if (unitData && Array.isArray(unitData.lessons)) {
    unitData.lessons.forEach(l => {
      const lessonTitle = l.title || l.id;
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
      lessons.push({ id: l.id, title: lessonTitle, blocks });
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

/**
 * Intelligent entity extractor that splits complex Edexcel specification lines
 * into specific historical targets to test.
 */
function extractHistoricalEntities(pt) {
  // Normalize punctuation that isn't sentence ending
  let normalized = pt
    .replace(/v\.\s+/gi, 'v ') // Brown v. Topeka -> Brown v Topeka
    .replace(/Lt\.\s+/gi, 'Lt ') // Lt. Calley -> Lt Calley
    .replace(/c\.\s+/gi, 'c ') // c. 1250 -> c 1250
    .replace(/e\.g\.\s+/gi, 'eg ');

  // Split on delimiters: semicolons, periods followed by space and capital, or "including"
  const rawParts = [];
  const sentences = normalized.split(/\.\s+(?=[A-Z])/);
  sentences.forEach(s => {
    const semiParts = s.split(/;\s*/);
    semiParts.forEach(sp => {
      if (sp.toLowerCase().includes(', including ')) {
        const incParts = sp.split(/,\s*including\s+/i);
        rawParts.push(incParts[0]);
        // The items inside including could be comma separated or "and" separated
        const listItems = incParts[1].split(/,\s*|\s+and\s+/i);
        listItems.forEach(li => rawParts.push(li));
      } else if (sp.toLowerCase().includes(': ')) {
        const colonParts = sp.split(/:\s*/);
        rawParts.push(colonParts[0]);
        const listItems = colonParts[1].split(/,\s*|\s+and\s+/i);
        listItems.forEach(li => rawParts.push(li));
      } else {
        rawParts.push(sp);
      }
    });
  });

  // Filter and clean each entity
  const entities = [];
  rawParts.forEach(rp => {
    let clean = rp.trim();
    if (clean.endsWith('.')) clean = clean.slice(0, -1);
    
    // Ignore pure syllabus boilerplates like "Period studies"
    if (clean.toLowerCase() === 'period studies' || clean.length < 3) return;

    entities.push(clean);
  });

  return entities;
}

console.log('========================================================================');
console.log('  GRANULAR GCSE SPECIFICATION HISTORICAL ENTITY AUDIT');
console.log('========================================================================\n');

const summaryStats = [];

GCSE_UNITS.forEach(unit => {
  const specPath = path.join(__dirname, '..', 'public', 'data', 'specifications', unit.specFile);
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const lessons = extractLessonsAndNarratives(unit.dataPath);

  let totalEntities = 0;
  let robustEntities = 0;
  let weakEntities = 0;
  let missingEntities = 0;
  const unitGaps = [];

  console.log(`\n========================================================================`);
  console.log(`📘 ${unit.name}`);
  console.log(`========================================================================`);

  spec.sections.forEach(sec => {
    sec.topics.forEach(top => {
      top.points.forEach((pt, ptIdx) => {
        const entities = extractHistoricalEntities(pt);
        entities.forEach(ent => {
          totalEntities++;

          // Search lessons for ent
          // Remove leading stopwords like "The", "Reasons for", "Impact of"
          const searchCore = ent.replace(/^(The\s+|Key\s+events\s+of\s+|Reasons\s+for\s+|Impact\s+of\s+|Nature\s+of\s+|Features\s+of\s+|Significance\s+of\s+|changing\s+|role\s+of\s+|extent\s+of\s+)/i, '').trim();
          
          // Identify significant words in searchCore
          const sigWords = searchCore
            .replace(/[()]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 2 && !['and', 'the', 'for', 'its', 'their', 'with', 'from', 'into', 'that', 'this', 'over', 'other', 'such', 'under'].includes(w.toLowerCase()));

          const matches = [];

          lessons.forEach(l => {
            l.blocks.forEach(b => {
              // Test how many sig words match
              let hits = 0;
              sigWords.forEach(w => {
                const re = new RegExp(`\\b${w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i');
                if (re.test(b.title) || re.test(b.text)) hits++;
              });

              if (sigWords.length === 1 && hits === 1) {
                matches.push({ lesson: l.title, block: b.title, words: b.wordCount, text: b.text });
              } else if (sigWords.length > 1 && hits >= Math.min(2, sigWords.length)) {
                // If it's a multi-word phrase like "King David Hotel", or "Brown v Topeka"
                // Check if the hits represent a substantial match
                const ratio = hits / sigWords.length;
                if (ratio >= 0.5 || hits >= 2) {
                  matches.push({ lesson: l.title, block: b.title, words: b.wordCount, text: b.text });
                }
              }
            });
          });

          let status = 'MISSING';
          if (matches.length > 0) {
            // Check if any matching block has substantial narrative (>= 50 words)
            const substantialMatches = matches.filter(m => m.words >= 50);
            if (substantialMatches.length > 0) {
              status = 'ROBUST';
              robustEntities++;
            } else {
              status = 'WEAK';
              weakEntities++;
            }
          } else {
            missingEntities++;
          }

          if (status === 'MISSING') {
            console.log(`🚨 [MISSING] "${ent}"`);
            console.log(`    From Point: "${pt}"`);
            unitGaps.push({ ent, pt, status: 'MISSING', topic: top.title, sec: sec.title });
          } else if (status === 'WEAK') {
            console.log(`⚠️  [WEAK]    "${ent}" (Found only in brief mentions <50 words)`);
            unitGaps.push({ ent, pt, status: 'WEAK', topic: top.title, sec: sec.title });
          } else {
            // console.log(`✅ [ROBUST]  "${ent}" -> ${matches[0].lesson} (${matches[0].block})`);
          }
        });
      });
    });
  });

  summaryStats.push({
    unitId: unit.unitId,
    name: unit.name,
    totalEntities,
    robustEntities,
    weakEntities,
    missingEntities,
    gaps: unitGaps
  });
});

console.log('\n\n========================================================================');
console.log('  EXECUTIVE SUMMARY OF GCSE ENTITY COVERAGE');
console.log('========================================================================\n');

summaryStats.forEach(s => {
  console.log(`📊 ${s.name}:`);
  console.log(`   Total Granular Spec Entities: ${s.totalEntities}`);
  console.log(`   ✅ Robust Narrative Coverage: ${s.robustEntities} (${Math.round(s.robustEntities/s.totalEntities*100)}%)`);
  console.log(`   ⚠️ Weak Coverage (<50 words): ${s.weakEntities}`);
  console.log(`   🚨 Missing / Omitted:         ${s.missingEntities}\n`);

  if (s.gaps.length > 0) {
    console.log(`   Audit Gaps for ${s.unitId}:`);
    s.gaps.forEach(g => {
      console.log(`   - [${g.status}] "${g.ent}" (${g.topic})`);
    });
    console.log('');
  }
});

