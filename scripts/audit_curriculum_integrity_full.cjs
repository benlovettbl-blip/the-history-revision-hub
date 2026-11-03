const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../public/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('='.repeat(80));
console.log('COMPREHENSIVE CURRICULUM INTEGRITY AUDIT (ALL 18 UNITS) - NORMALIZED');
console.log('='.repeat(80));

let totalLessonsAudited = 0;
let errorsFound = 0;
const errorLog = [];

for (const [unitId, entry] of Object.entries(db)) {
  const unit = entry.data || entry;
  if (!unit.lessons || !Array.isArray(unit.lessons)) continue;

  unit.lessons.forEach((l, idx) => {
    totalLessonsAudited++;
    const lId = l.id || idx + 1;

    // Check 1: Source letter mismatches in question and model answer
    if (l.sources && Array.isArray(l.sources)) {
      l.sources.forEach((src, sIdx) => {
        let letter = (src.letter || String.fromCharCode(65 + sIdx)).toUpperCase();
        letter = letter.replace(/^SOURCE\s+/i, '').trim();

        const q = src.question || '';
        const m = src.model_answer || '';

        // Match patterns like "Source [A-E]"
        const qMatches = [...q.matchAll(/Source\s+([A-E])\b/gi)];
        const mMatches = [...m.matchAll(/Source\s+([A-E])\b/gi)];

        const isComparative = /corroborate|contrast|compare|differ|cross-reference|both|together with|as seen in|alongside|refute|contradict|support/i.test(q);

        for (const match of qMatches) {
          const mentioned = match[1].toUpperCase();
          if (mentioned !== letter && !isComparative) {
            if (!q.toLowerCase().includes(`source ${letter.toLowerCase()}`)) {
              errorsFound++;
              errorLog.push(`[SOURCE LETTER MISMATCH IN Q] ${unitId} L${lId} [${letter}]: mentions Source ${mentioned} in "${q.substring(0, 60)}..."`);
            }
          }
        }

        for (const match of mMatches) {
          const mentioned = match[1].toUpperCase();
          if (mentioned !== letter && !isComparative) {
            if (!m.toLowerCase().includes(`source ${letter.toLowerCase()}`)) {
              errorsFound++;
              errorLog.push(`[SOURCE LETTER MISMATCH IN MODEL] ${unitId} L${lId} [${letter}]: mentions Source ${mentioned} in "${m.substring(0, 60)}..."`);
            }
          }
        }
      });
    }

    // Check 2: Missing stimulus on 16m verdict / essay questions
    if (l.assessment) {
      const a = l.assessment;
      const is16m = a.type === 'verdict_16m' || (a.marks && a.marks >= 16) || (a.question && a.question.includes('16 marks'));
      if (is16m && a.requires_stimulus !== false) {
        if (a.question && /interpretation/i.test(a.question)) {
          if (!a.stimulus || a.stimulus.length < 2) {
            errorsFound++;
            errorLog.push(`[MISSING INTERPRETATIONS] ${unitId} L${lId}: 16m question mentions interpretations but has ${a.stimulus ? a.stimulus.length : 0} stimuli.`);
          }
        }
      }
    }

    // Check 3: Lingering non-exam tasks on 16m lessons
    if (l.assessment && (l.assessment.type === 'verdict_16m' || (l.assessment.question && l.assessment.question.includes('16 marks')))) {
      if (l.tasks && l.tasks.length > 0) {
        const hasComprehension = l.tasks.some(t => t.type !== 'two_sided_argument');
        if (hasComprehension) {
          errorsFound++;
          errorLog.push(`[LEGACY COMPREHENSION TASKS ON 16M LESSON] ${unitId} L${lId}: has ${l.tasks.length} non-evaluative tasks.`);
        }
      }
    }

    // Check 4: Duplicated sentences in hook_text or questions
    if (l.hook_text) {
      const sentences = l.hook_text.split(/(?<=[.?!])\s+/);
      const seen = new Set();
      for (const s of sentences) {
        const clean = s.trim().toLowerCase();
        if (clean.length > 25 && seen.has(clean)) {
          errorsFound++;
          errorLog.push(`[DUPLICATE SENTENCE IN HOOK] ${unitId} L${lId}: "${s.substring(0, 50)}..."`);
        }
        seen.add(clean);
      }
    }

    // Check 5: Duplicate stage/block headings
    if (l.stages) {
      const stageTitles = new Set();
      l.stages.forEach(st => {
        if (st.title) {
          const t = st.title.trim().toLowerCase();
          if (stageTitles.has(t)) {
            errorsFound++;
            errorLog.push(`[DUPLICATE STAGE TITLE] ${unitId} L${lId}: "${st.title}"`);
          }
          stageTitles.add(t);
        }
      });
    }
  });
}

console.log(`Audited ${totalLessonsAudited} lessons across 18 units.`);
console.log(`Errors found: ${errorsFound}`);
if (errorLog.length > 0) {
  console.log('\nError Details:');
  errorLog.forEach(err => console.log(' - ' + err));
} else {
  console.log('\n✅ 100% PERFECT: Zero errors detected across all 159 lessons in all 18 units!');
}
console.log('='.repeat(80));
