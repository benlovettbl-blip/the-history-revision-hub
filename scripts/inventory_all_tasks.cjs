const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '../data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !['all_units.json', 'database.json', 'package.json'].includes(f));

const taskSummary = {};
let totalTasks = 0;
const questionPatterns = {
  interpretation: [],
  source_utility: [],
  source_inference: [],
  essay_evaluative: [],
  causal_explanation: [],
  consequence: [],
  narrative_account: [],
  importance: [],
  similarity_difference: [],
  features: [],
  historian_enquiry: [],
  other: []
};

for (const file of files) {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const lessons = raw.lessons || (raw.curriculum && raw.curriculum.lessons) || (Array.isArray(raw) ? raw : []);
    for (const lesson of lessons) {
      const tasks = lesson.tasks || (lesson.practice_questions ? lesson.practice_questions : []);
      for (const t of (Array.isArray(tasks) ? tasks : [])) {
        totalTasks++;
        const type = t.type || 'UNDEFINED';
        const q = (t.question || t.title || '').trim();
        const tariff = t.tariff || t.marks || '';
        
        if (!taskSummary[type]) taskSummary[type] = { count: 0, examples: [] };
        taskSummary[type].count++;
        if (taskSummary[type].examples.length < 2) {
          taskSummary[type].examples.push({ unit: file.replace('.json', ''), q: q.slice(0, 100), tariff });
        }

        const lowerQ = q.toLowerCase();
        if (lowerQ.includes('interpretation') || type.includes('interpretation')) {
          questionPatterns.interpretation.push({ unit: file, q, type });
        } else if (lowerQ.includes('useful') || type.includes('utility')) {
          questionPatterns.source_utility.push({ unit: file, q, type });
        } else if (lowerQ.includes('infer') || type.includes('inference')) {
          questionPatterns.source_inference.push({ unit: file, q, type });
        } else if (lowerQ.includes('historian') || lowerQ.includes('historians')) {
          questionPatterns.historian_enquiry.push({ unit: file, q, type });
        } else if (lowerQ.includes('agree') || type.includes('evaluative') || lowerQ.includes('how far do you agree') || lowerQ.startsWith('\'') || lowerQ.startsWith('"') || lowerQ.startsWith('‘')) {
          questionPatterns.essay_evaluative.push({ unit: file, q, type });
        } else if (lowerQ.includes('explain why') || type.includes('causal')) {
          questionPatterns.causal_explanation.push({ unit: file, q, type });
        } else if (lowerQ.includes('consequence') || type.includes('consequence')) {
          questionPatterns.consequence.push({ unit: file, q, type });
        } else if (lowerQ.includes('narrative') || type.includes('narrative')) {
          questionPatterns.narrative_account.push({ unit: file, q, type });
        } else if (lowerQ.includes('importance') || type.includes('importance')) {
          questionPatterns.importance.push({ unit: file, q, type });
        } else if (lowerQ.includes('similar') || lowerQ.includes('differ') || type.includes('similarity')) {
          questionPatterns.similarity_difference.push({ unit: file, q, type });
        } else if (lowerQ.includes('feature') || type.includes('feature')) {
          questionPatterns.features.push({ unit: file, q, type });
        } else {
          questionPatterns.other.push({ unit: file, q, type });
        }
      }
    }
  } catch (e) {
    console.error('Error reading', file, e.message);
  }
}

console.log(`\n==================================================`);
console.log(`TOTAL TASKS AUDITED ACROSS CURRICULUM: ${totalTasks}`);
console.log(`==================================================\n`);

console.log('--- TASK DISTRIBUTION BY TYPE IN JSON ---');
for (const [type, data] of Object.entries(taskSummary).sort((a,b) => b[1].count - a[1].count)) {
  console.log(`\n[${type}] : ${data.count} tasks`);
  data.examples.forEach(ex => console.log(`   * [${ex.unit}] (${ex.tariff}): "${ex.q}"`));
}

console.log('\n\n--- QUESTION CATEGORIES & EXAM FORMATS ---');
for (const [cat, arr] of Object.entries(questionPatterns)) {
  console.log(`\nCategory: ${cat.toUpperCase()} (${arr.length} tasks)`);
  arr.slice(0, 3).forEach(item => {
    console.log(`   - [${item.unit}] type: ${item.type} | "${item.q.slice(0, 100)}"`);
  });
}

