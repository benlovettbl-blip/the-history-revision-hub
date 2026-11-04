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

function loadUnitData(dataPath) {
  const p = path.join(__dirname, '..', dataPath);
  const raw = fs.readFileSync(p, 'utf8');
  const cjs = raw
    .replace(/^\s*import\s+.*?;\s*$/gm, '')
    .replace(/export\s+default\s+/, 'module.exports = ');
  const m = { exports: {} };
  const fn = new Function('module', 'exports', cjs);
  fn(m, m.exports);
  return m.exports;
}

function extractKeyHistoricalEntities(specPoint) {
  // Normalize abbreviations
  let text = specPoint
    .replace(/v\.\s+/gi, 'v ')
    .replace(/Lt\.\s+/gi, 'Lt ')
    .replace(/c\.\s+/gi, 'c ')
    .replace(/e\.g\.\s+/gi, 'eg ');

  const entities = [];

  // Split on primary delimiters: periods followed by capital or semicolons
  const parts = text.split(/(?:;\s*|\.\s+(?=[A-Z]))/);

  parts.forEach(part => {
    let clean = part.trim();
    if (clean.endsWith('.')) clean = clean.slice(0, -1);
    if (!clean || clean.length < 3) return;

    // Check if there is an "including" clause
    if (clean.toLowerCase().includes(', including ')) {
      const splitInc = clean.split(/,\s*including\s+/i);
      entities.push({ raw: splitInc[0].trim(), isAnchor: true });
      
      // Items inside including
      const subItems = splitInc[1].split(/,\s*(?:and\s+)?|\s+and\s+/i);
      subItems.forEach(si => {
        const itemClean = si.trim();
        if (itemClean.length > 2) {
          entities.push({ raw: itemClean, isAnchor: false });
        }
      });
    } else if (clean.toLowerCase().includes(': ')) {
      const splitColon = clean.split(/:\s*/);
      entities.push({ raw: splitColon[0].trim(), isAnchor: true });
      const subItems = splitColon[1].split(/,\s*(?:and\s+)?|\s+and\s+/i);
      subItems.forEach(si => {
        const itemClean = si.trim();
        if (itemClean.length > 2) {
          entities.push({ raw: itemClean, isAnchor: false });
        }
      });
    } else {
      entities.push({ raw: clean, isAnchor: true });
    }
  });

  return entities;
}

console.log('========================================================================');
console.log('  AUTHORITATIVE GCSE SPECIFICATION CROSS-REFERENCE AUDIT (5 UNITS)');
console.log('========================================================================\n');

const unitSummaries = [];

GCSE_UNITS.forEach(uConfig => {
  const specPath = path.join(__dirname, '..', 'public', 'data', 'specifications', uConfig.specFile);
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const unitData = loadUnitData(uConfig.dataPath);

  // Index all narrative blocks
  const narrativeCorpus = [];
  (unitData.lessons || []).forEach(l => {
    (l.narrative_blocks || []).forEach((b, bIdx) => {
      let fullText = (b.title || '') + ' ' + (b.theme_heading || '') + ' ' + (b.text || '') + ' ' + (b.content || '');
      if (Array.isArray(b.paragraphs)) {
        fullText += ' ' + b.paragraphs.join(' ');
      }
      const clean = fullText.replace(/<[^>]+>/g, '').replace(/\\"/g, '"').replace(/\s+/g, ' ').trim();
      narrativeCorpus.push({
        lessonId: l.id,
        lessonTitle: l.title || l.id,
        blockNum: bIdx + 1,
        blockTitle: b.title || b.theme_heading || `Block ${bIdx + 1}`,
        cleanText: clean,
        wordCount: clean.split(/\s+/).filter(w => w.length > 0).length
      });
    });
  });

  let totalEntitiesChecked = 0;
  let robustCount = 0;
  let weakCount = 0;
  let missingCount = 0;
  const gaps = [];

  console.log(`\n========================================================================`);
  console.log(`📘 ${uConfig.name}`);
  console.log(`   Indexed Lessons: ${unitData.lessons.length} | Narrative Blocks: ${narrativeCorpus.length}`);
  console.log(`========================================================================`);

  spec.sections.forEach(sec => {
    sec.topics.forEach(top => {
      top.points.forEach((pt, ptIdx) => {
        const entities = extractKeyHistoricalEntities(pt);

        entities.forEach(entObj => {
          totalEntitiesChecked++;
          const ent = entObj.raw;
          
          // Strip syllabus framing words like "The", "Key events of", "Reasons for", etc.
          const searchCore = ent.replace(/^(The\s+|Key\s+events\s+of\s+|Reasons\s+for\s+|Impact\s+of\s+|Nature\s+of\s+|Features\s+of\s+|Significance\s+of\s+|changing\s+|role\s+of\s+|extent\s+of\s+|approaches\s+to\s+|dealing\s+with\s+|new\s+approaches\s+to\s+|advances\s+in\s+)/i, '').trim();

          // Extract key words (> 2 chars, omitting small grammatical tokens)
          const keywords = searchCore
            .replace(/[(),:;]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 2 && !['and', 'the', 'for', 'its', 'their', 'with', 'from', 'into', 'that', 'this', 'over', 'other', 'such', 'under', 'during', 'between', 'used'].includes(w.toLowerCase()));

          // If keywords are empty (e.g. pure stopwords), skip
          if (keywords.length === 0) return;

          // Find matches in narrative blocks
          const matchedBlocks = [];

          narrativeCorpus.forEach(b => {
            let hitCount = 0;
            keywords.forEach(kw => {
              const kwEsc = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
              const re = new RegExp(`\\b${kwEsc}`, 'i');
              if (re.test(b.cleanText)) {
                hitCount++;
              }
            });

            // Consider it a match if:
            // 1 keyword and it matches
            // 2 keywords and both match (or at least 1 if keyword is very specific, e.g. "Topeka", "Sèvres")
            // >2 keywords and at least 50% match
            if (keywords.length === 1 && hitCount === 1) {
              matchedBlocks.push(b);
            } else if (keywords.length === 2 && hitCount >= 1) {
              // If it's a 2-word phrase, check if words appear in close proximity or exact phrase
              const exactRe = new RegExp(keywords.map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('.*?'), 'i');
              if (exactRe.test(b.cleanText) || hitCount === 2) {
                matchedBlocks.push(b);
              }
            } else if (keywords.length > 2 && hitCount >= Math.ceil(keywords.length * 0.5)) {
              matchedBlocks.push(b);
            }
          });

          let status = 'MISSING';
          if (matchedBlocks.length > 0) {
            // Check word count and depth of matching blocks
            const substantial = matchedBlocks.filter(b => b.wordCount >= 60);
            if (substantial.length > 0) {
              status = 'ROBUST';
              robustCount++;
            } else {
              status = 'WEAK';
              weakCount++;
            }
          } else {
            missingCount++;
          }

          if (status === 'MISSING') {
            console.log(`🚨 [MISSING] "${ent}"`);
            console.log(`    └─ In Spec Point: "${pt}"`);
            console.log(`    └─ Section/Topic: ${sec.title} > ${top.title}\n`);
            gaps.push({
              status: 'MISSING',
              entity: ent,
              point: pt,
              section: sec.title,
              topic: top.title
            });
          } else if (status === 'WEAK') {
            console.log(`⚠️  [WEAK]    "${ent}" (Only brief passing reference <60 words)`);
            console.log(`    └─ In Spec Point: "${pt}"\n`);
            gaps.push({
              status: 'WEAK',
              entity: ent,
              point: pt,
              section: sec.title,
              topic: top.title,
              location: matchedBlocks[0] ? `${matchedBlocks[0].lessonTitle} (${matchedBlocks[0].blockTitle})` : ''
            });
          }
        });
      });
    });
  });

  unitSummaries.push({
    unitId: uConfig.unitId,
    name: uConfig.name,
    totalEntitiesChecked,
    robustCount,
    weakCount,
    missingCount,
    gaps
  });
});

console.log('\n\n========================================================================');
console.log('  FINAL EXECUTIVE SUMMARY: ALL 5 GCSE UNITS');
console.log('========================================================================\n');

unitSummaries.forEach(s => {
  const pct = Math.round((s.robustCount / s.totalEntitiesChecked) * 100);
  console.log(`📊 ${s.name}:`);
  console.log(`   Total Granular Spec Requirements: ${s.totalEntitiesChecked}`);
  console.log(`   ✅ Robust Narrative Coverage:      ${s.robustCount} (${pct}%)`);
  console.log(`   ⚠️ Weak / Passing Coverage:         ${s.weakCount}`);
  console.log(`   🚨 Complete Omissions (Missing):    ${s.missingCount}\n`);

  if (s.gaps.length > 0) {
    console.log(`   Actionable Gaps for ${s.unitId}:`);
    s.gaps.forEach(g => {
      console.log(`   - [${g.status}] "${g.entity}" (${g.section} > ${g.topic})`);
    });
    console.log('');
  }
});

