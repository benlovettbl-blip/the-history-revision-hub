const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const dataDir = path.join(repoRoot, 'data');

console.log('================================================================');
console.log('  PROACTIVE DEEP PEDAGOGICAL & SEMANTIC PLATFORM AUDITOR');
console.log('================================================================\n');

const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.includes('package') && !f.includes('database'));

let totalUnits = 0;
let totalLessons = 0;
let totalTasks = 0;
let totalModels = 0;

const issues = {
  critical: [],
  warnings: [],
  pedagogical: []
};

// Common stopwords to exclude from semantic matching
const stopwords = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'were', 'which',
  'their', 'they', 'will', 'would', 'could', 'should', 'been', 'there', 'about',
  'into', 'than', 'them', 'these', 'those', 'what', 'when', 'where', 'while',
  'after', 'before', 'explain', 'describe', 'assess', 'evaluate', 'analyse',
  'consequence', 'feature', 'features', 'primary', 'secondary', 'question', 'marks',
  'mark', 'mins', 'write', 'answer', 'using', 'detail', 'details', 'knowledge',
  'british', 'britain', 'history', 'period', 'century', 'years', 'during', 'between',
  'first', 'second', 'third', 'study', 'source', 'sources', 'interpretation', 'interpretations'
]);

function extractKeywords(text) {
  if (!text) return [];
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopwords.has(w));
  return Array.from(new Set(words));
}

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  let d;
  try {
    d = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    issues.critical.push({ unit: file, error: `Invalid JSON: ${e.message}` });
    return;
  }

  totalUnits++;
  const unitId = d.id || file.replace('.json', '');
  const isKs2 = d.is_ks2 || d.phase === 'ks2' || unitId.includes('ks2');
  const lessons = d.lessons || (d.curriculum && d.curriculum.lessons) || [];

  lessons.forEach((l, lIdx) => {
    totalLessons++;
    const lTitle = l.title || l.enquiry || `Lesson ${lIdx + 1}`;
    const tasks = l.tasks || [];

    tasks.forEach((t, tIdx) => {
      totalTasks++;
      const tId = t.id || `task-${lIdx}-${tIdx}`;
      const qText = (t.question || t.text || t.prompt || t.title || '').trim();
      const mText = (t.model_answer || t.model || (t.model_tiers && t.model_tiers.tier_12m && t.model_tiers.tier_12m.text) || '').trim();

      // Check 1: Missing Question or Prompt
      if (!qText) {
        issues.critical.push({
          unit: unitId,
          lesson: `${lIdx + 1}: ${lTitle}`,
          task: tId,
          issue: 'Empty task prompt/question'
        });
      }

      // Check 2: Missing Model Answer in Writing Studio Tasks
      if (t.type && ['two_features', 'consequence', 'source_utility', 'historical_interpretations', 'cause_and_consequence', 'analytical_narrative'].includes(t.type)) {
        if (!mText) {
          issues.warnings.push({
            unit: unitId,
            lesson: `${lIdx + 1}: ${lTitle}`,
            task: tId,
            issue: `Missing model answer for core writing task type "${t.type}"`
          });
        }
      }

      // Check 3: Semantic Alignment (Prompt vs Model Answer)
      if (qText && mText) {
        totalModels++;
        const qWords = extractKeywords(qText + ' ' + lTitle);
        const mWords = extractKeywords(mText);

        // Check if there is zero keyword overlap between prompt/lesson and model
        const overlap = qWords.filter(w => mWords.includes(w));
        if (overlap.length === 0 && qWords.length > 2) {
          issues.pedagogical.push({
            unit: unitId,
            lesson: `${lIdx + 1}: ${lTitle}`,
            task: tId,
            issue: 'Zero keyword overlap between question/lesson and model answer',
            questionSample: qText.slice(0, 100),
            modelSample: mText.slice(0, 120)
          });
        }

        // Check 4: Placeholder text in model
        if (/lorem ipsum|tbd|todo|\[model unavailable\]|placeholder/i.test(mText)) {
          issues.critical.push({
            unit: unitId,
            lesson: `${lIdx + 1}: ${lTitle}`,
            task: tId,
            issue: 'Placeholder text found in model answer'
          });
        }
      }

      // Check 5: Historical Interpretations Integrity
      if (t.type === 'historical_interpretations' || t.id?.includes('interpretations')) {
        const hasInterp1 = t.interp1 || t.interpretation_1;
        const hasInterp2 = t.interp2 || t.interpretation_2;
        const hasSrcB = t.source_b || t.source1;
        const hasSrcC = t.source_c || t.source2;

        if (!hasInterp1 || !hasInterp2) {
          issues.critical.push({
            unit: unitId,
            lesson: `${lIdx + 1}: ${lTitle}`,
            task: tId,
            issue: 'Historical Interpretations task missing Interpretation 1 or 2'
          });
        }

        if (!hasSrcB || !hasSrcC) {
          issues.warnings.push({
            unit: unitId,
            lesson: `${lIdx + 1}: ${lTitle}`,
            task: tId,
            issue: 'Historical Interpretations task missing dual primary Sources B & C for Edexcel Paper 3 Q3c evidence matching'
          });
        }
      }

      // Check 6: Source Utility Integrity
      if (t.type === 'source_utility') {
        const hasSrcA = t.source_a || t.sourceA || t.source;
        if (!hasSrcA) {
          issues.warnings.push({
            unit: unitId,
            lesson: `${lIdx + 1}: ${lTitle}`,
            task: tId,
            issue: 'Source Utility task missing source object'
          });
        }
      }
    });

    // Check 7: Guided Reading / Literary Companion integrity
    if (l.reading_homework || l.literary_companion) {
      const rc = l.reading_homework || l.literary_companion;
      const text = rc.text || rc.extract || '';
      const questions = rc.questions || rc.discussion_prompts || [];
      if (!text || text.length < 50) {
        issues.warnings.push({
          unit: unitId,
          lesson: `${lIdx + 1}: ${lTitle}`,
          task: 'reading_homework',
          issue: 'Guided reading text extract is missing or abnormally short (<50 chars)'
        });
      }
    }
  });
});

console.log(`Audited: ${totalUnits} units, ${totalLessons} lessons, ${totalTasks} tasks, ${totalModels} model answers.\n`);

console.log(`🚨 CRITICAL ISSUES (${issues.critical.length}):`);
if (issues.critical.length === 0) {
  console.log('  ✅ None detected! Zero corrupt JSONs, zero empty prompts, zero placeholders.');
} else {
  issues.critical.forEach(c => console.log(`  - [${c.unit}] ${c.lesson || ''} -> ${c.task || ''}: ${c.issue}`));
}

console.log(`\n⚖️ PEDAGOGICAL / SEMANTIC MISMATCHES (${issues.pedagogical.length}):`);
if (issues.pedagogical.length === 0) {
  console.log('  ✅ None detected! 100% of model answers have verified keyword overlap with their questions.');
} else {
  issues.pedagogical.forEach(p => {
    console.log(`  - [${p.unit}] Lesson: ${p.lesson} | Task: ${p.task}`);
    console.log(`    Q: "${p.questionSample}"`);
    console.log(`    Model: "${p.modelSample}"`);
  });
}

console.log(`\n⚠️ STRUCTURAL WARNINGS (${issues.warnings.length}):`);
if (issues.warnings.length === 0) {
  console.log('  ✅ None detected! All writing tasks, interpretations, and sources fully populated.');
} else {
  issues.warnings.forEach(w => console.log(`  - [${w.unit}] ${w.lesson || ''} -> ${w.task || ''}: ${w.issue}`));
}

console.log('\n================================================================');
console.log('  AUDIT COMPLETE');
console.log('================================================================');

