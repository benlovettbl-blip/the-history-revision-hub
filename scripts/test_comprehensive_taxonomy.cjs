const fs = require('fs');
const path = require('path');

// Let's create an enhanced getTaskTypeInfo logic
function extractTopic(text, fallback) {
  if (!text) return fallback;
  text = text.replace(/\[\d+\s*marks?.*?\]/gi, '').trim();
  
  // Interpretation essay topic: "about the position of women..."
  let m = text.match(/about\s+(.*?)(?:\.|\?|Explain|$)/i);
  if (m && m[1].trim().length > 3) return m[1].trim();

  // Interpretation difference: "differ (?:about|on) ..."
  m = text.match(/differ\s+(?:about|on)\s+(.*?)(?:\s+and\s+suggest|\.|\?|$)/i);
  if (m && m[1].trim().length > 3) return m[1].trim();

  // Follow up: "find out more about ..."
  m = text.match(/find out more about\s+(.*?)(?:\.|\?|$)/i);
  if (m && m[1].trim().length > 3) return m[1].trim();

  // Feature: "feature of ..."
  m = text.match(/feature\s+of\s+(.*?)(?:\.|\?|$)/i);
  if (m && m[1].trim().length > 3) return m[1].trim();

  // Consequence: "consequence of ..."
  m = text.match(/consequence\s+of\s+(.*?)(?:\.|\?|$)/i);
  if (m && m[1].trim().length > 3) return m[1].trim();

  // Importance: "importance of ..."
  m = text.match(/importance\s+of\s+(.*?)(?:\.|\?|$)/i);
  if (m && m[1].trim().length > 3) return m[1].trim();

  return fallback;
}

function cleanCausalTopic(task, lesson) {
  let text = (task?.question || task?.prompt || task?.text || '').trim();
  if (text) {
    text = text.replace(/\[\d+\s*marks?.*?\]/gi, '').trim();
    text = text.replace(/^explain\s+/i, '').trim();
    if (/^why\s+/i.test(text)) {
      return text.replace(/[?.!]+$/, '').trim();
    }
  }
  let title = (lesson?.title || 'this development').trim();
  title = title.replace(/^\d{4}\s*(&|and|-|–)?\s*/i, '').trim();
  title = title.replace(/^KT\s*\d+(\.\d+)?:\s*/i, '').trim();
  title = title.replace(/^Key Topic\s*\d+(\.\d+)?:\s*/i, '').trim();
  title = title.replace(/^Enquiry\s*\d+:\s*/i, '').trim();
  return title.replace(/[?.!]+$/, '').trim();
}

function classifyTask(task, unit, lesson) {
  const isKs2 = unit.is_ks2 === true || (unit.keyStage || '').toLowerCase().includes('ks2');
  const isKs3 = !isKs2 && (unit.is_ks3 === true || (unit.keyStage || '').toLowerCase().includes('ks3') || /year\s*[789]\b/i.test(unit.year_group || unit.yearGroup || ''));
  if (isKs2) return { type: 'ks2' };

  const qRaw = (task.question || task.prompt || task.text || task.title || '').trim();
  const tariffStr = (task.tariff || (task.marks ? `${task.marks} marks` : '') || '').toLowerCase();
  const typeStr = (task.type || '').toLowerCase();
  const qCombined = (qRaw + ' ' + tariffStr + ' ' + typeStr).toLowerCase();

  // 1. Edexcel Paper 3 / USA Q3(d): Evaluative Essay on Interpretations (16m + 4 SPaG)
  if ((qCombined.includes('interpretation') || qCombined.includes('interpretations')) &&
      (qCombined.includes('how far do you agree') || qCombined.includes('agree with interpretation') || qCombined.includes('16 marks') || task.marks === 16)) {
    const topic = extractTopic(qRaw, lesson.title || 'this historical debate');
    return {
      type: 'interpretation_evaluative_16m',
      name: 'Interpretations Evaluative Essay (16m)',
      starter: `Interpretation 2 argues that ${topic} because... On the other hand, Interpretation 1 offers an alternative view, suggesting that...`,
      pills: ['Interpretation 2', 'Interpretation 1', 'Contextual Knowledge', 'Final Judgement']
    };
  }

  // 2. Edexcel Paper 3 Q3(b) / KS3: Difference between Interpretations (4m)
  if ((qCombined.includes('interpretation') || qCombined.includes('interpretations')) &&
      (qCombined.includes('differ') || qCombined.includes('difference')) &&
      !qCombined.includes('suggest one reason') &&
      !qCombined.includes('why they differ') &&
      (tariffStr.includes('4') || task.marks === 4 || !tariffStr.includes('8'))) {
    const topic = extractTopic(qRaw, 'this historical issue');
    return {
      type: 'interpretation_diff_4m',
      name: 'Interpretations Difference (4m)',
      starter: `The main difference between Interpretations 1 and 2 is that Interpretation 1 suggests that..., whereas Interpretation 2 argues that...`,
      pills: ['Main Difference', 'Interpretation 1', 'Interpretation 2']
    };
  }

  // 3. Edexcel Paper 3 Q3(c) / KS3: Reason for Difference between Interpretations (4m)
  if ((qCombined.includes('interpretation') || qCombined.includes('interpretations')) &&
      (qCombined.includes('suggest one reason') || qCombined.includes('why') || qCombined.includes('reason why')) &&
      (tariffStr.includes('4') || task.marks === 4)) {
    const topic = extractTopic(qRaw, 'this development');
    return {
      type: 'interpretation_reason_4m',
      name: 'Interpretations Reason for Difference (4m)',
      starter: `One reason why Interpretations 1 and 2 differ is that the historians have focused on different aspects of ${topic}, with Interpretation 1 emphasizing..., while Interpretation 2 focuses on...`,
      pills: ['Reason for Difference', 'Different Focus', 'Supporting Reference']
    };
  }

  // 4. Combined Contrasting Interpretations (8m)
  if ((qCombined.includes('interpretation') || qCombined.includes('interpretations')) &&
      (tariffStr.includes('8') || typeStr.includes('interpretations') || qCombined.includes('contrasting interpretations'))) {
    const topic = extractTopic(qRaw, 'this historical issue');
    return {
      type: 'interpretation_contrasting_8m',
      name: 'Contrasting Interpretations (8m)',
      starter: `Interpretations 1 and 2 differ fundamentally on ${topic} because Interpretation 1 argues that..., whereas Interpretation 2 suggests that... A key reason for this disagreement is that...`,
      pills: ['Difference in Views', 'Interpretation 1', 'Interpretation 2', 'Reason for Difference']
    };
  }

  // 5. Edexcel Paper 1 Historic Environment Follow-up (4m)
  if (qCombined.includes('follow up') || qCombined.includes('find out more about')) {
    const topic = extractTopic(qRaw, 'this medical condition');
    return {
      type: 'source_followup_4m',
      name: 'Source Follow-Up (4m)',
      starter: `Detail in Source that I would follow up: "..."\nQuestion I would ask: ...\nType of source I would look for: ...\nHow this would help: This would help me understand...`,
      pills: ['Detail to Follow Up', 'Historical Question', 'Specific Source Type', 'Historical Explanation']
    };
  }

  // 6. Evaluative Statement Essay (12m / 16m)
  if (qCombined.includes('how far do you agree') || qCombined.includes('how far do you') ||
      typeStr.includes('evaluative') || typeStr.includes('judgement') || typeStr.includes('two_sided_argument') ||
      /^['"‘“]/.test(qRaw.trim()) || qRaw.includes('How far do you agree')) {
    const statementMatch = qRaw.match(/['"‘“](.*?)['"’”]/);
    const stmt = statementMatch ? statementMatch[1].trim() : (lesson.title || 'this view');
    return {
      type: 'essay_evaluative',
      name: 'Evaluative Statement Essay',
      starter: `It can be argued that ${stmt} because... However, an alternative view is that...`,
      pills: ['Thesis Statement', 'Named Factor', 'Alternative Factor', 'Final Judgement']
    };
  }

  // 7. One Key Feature (2m)
  if (typeStr === 'feature_2m' || tariffStr.includes('2 mark') || qCombined.includes('one key feature') || qCombined.includes('one feature') || (task.marks === 2 && qCombined.includes('feature'))) {
    const topic = extractTopic(qRaw, lesson.title || 'this feature');
    return {
      type: 'feature_2m',
      name: 'Key Feature (2m)',
      starter: `One key feature of ${topic} was that... For example, ...`,
      pills: ['Key Feature', 'Supporting Detail']
    };
  }

  // 8. Source Inference (4m)
  if (qCombined.includes('infer') || typeStr.includes('inference') || (task.marks === 4 && qCombined.includes('source') && !qCombined.includes('useful'))) {
    const srcMatch = qRaw.match(/Source\s+([A-Z])/i);
    const src = srcMatch ? `Source ${srcMatch[1].toUpperCase()}` : 'Source A';
    return {
      type: 'inference_4m',
      name: 'Source Inference (4m)',
      starter: `One thing I can infer from ${src} is that... Details in the source that tell me this are: "..."`,
      pills: ['First Inference', 'Quote 1', 'Second Inference', 'Quote 2']
    };
  }

  // 9. Two Features (4m)
  if (qCombined.includes('two features') || typeStr.includes('two_features') || typeStr.includes('feature_drills') || (task.marks === 4 && qCombined.includes('feature'))) {
    const topic = extractTopic(qRaw, lesson.title || 'this development');
    return {
      type: 'features_4m',
      name: 'Two Features (4m)',
      starter: `One key feature of ${topic} was... Another key feature was...`,
      pills: ['Feature 1', 'Detail 1', 'Feature 2', 'Detail 2']
    };
  }

  // 10. Consequence (4m or 8m)
  if (qCombined.includes('consequence') || typeStr.includes('consequence')) {
    const isDouble = qCombined.includes('two consequences') || tariffStr.includes('8') || typeStr.includes('8');
    const topic = extractTopic(qRaw, lesson.title || 'this event');
    return {
      type: isDouble ? 'consequences_8m' : 'consequences_4m',
      name: `Consequence (${isDouble ? '8m' : '4m'})`,
      starter: `One significant consequence of ${topic} was that...`,
      pills: isDouble ? ['Consequence 1', 'Causal Impact 1', 'Consequence 2', 'Causal Impact 2'] : ['Consequence', 'Factual Detail', 'Historical Impact']
    };
  }

  // 11. Comparison / Similarity & Difference (4m)
  if (qCombined.includes('similar') || qCombined.includes('differ') || typeStr.includes('similarity')) {
    const isDiff = qCombined.includes('differ');
    const compWord = isDiff ? 'different' : 'similar';
    const topic = extractTopic(qRaw, 'ideas in these two periods');
    return {
      type: 'comparison_4m',
      name: 'Comparison (4m)',
      starter: `One way in which ${topic} were ${compWord} was that...`,
      pills: ['Comparative Claim', 'Period 1 Evidence', 'Period 2 Evidence', 'Direct Synthesis']
    };
  }

  // 12. Source Utility (8m)
  if (qCombined.includes('useful') || qCombined.includes('utility') || typeStr.includes('utility')) {
    return {
      type: 'utility_8m',
      name: 'Source Utility (8m)',
      starter: `Source A is useful to an historian studying this enquiry because it shows...`,
      pills: ['Source Content', 'Own Knowledge', 'Provenance', 'Overall Utility']
    };
  }

  // 13. Narrative Account (8m)
  if (qCombined.includes('narrative') || typeStr.includes('narrative')) {
    return {
      type: 'narrative_8m',
      name: 'Narrative Account (8m)',
      starter: `The chain of events began when... This directly led to...`,
      pills: ['Catalyst Event', 'Causal Link 1', 'Causal Link 2', 'Outcome']
    };
  }

  // 14. Explain Importance (8m)
  if (qCombined.includes('importance') || typeStr.includes('importance')) {
    const topic = extractTopic(qRaw, lesson.title || 'this historical event');
    return {
      type: 'importance_8m',
      name: 'Explain Importance (8m)',
      starter: `The importance of ${topic} was that...`,
      pills: ['First Impact', 'Factual Detail', 'Second Impact', 'Significance']
    };
  }

  // 15. Causal Explanation (12m)
  if (qCombined.includes('explain why') || qCombined.includes('12 marks') || task.marks === 12 || typeStr.includes('caus') || typeStr.includes('12')) {
    const topic = cleanCausalTopic(task, lesson);
    return {
      type: 'causal_12m',
      name: 'Causal Explanation (12m)',
      starter: `A decisive factor explaining ${topic} was...`,
      pills: ['Causal Factor 1', 'Causal Factor 2', 'Own Knowledge']
    };
  }

  return {
    type: 'general_secondary',
    name: 'General Secondary',
    starter: `A decisive factor explaining ${cleanCausalTopic(task, lesson)} was...`,
    pills: ['Historical Claim', 'Factual Evidence', 'Explanation']
  };
}

// Test against all tasks
const dataDir = path.resolve(__dirname, '../data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !['all_units.json', 'database.json', 'package.json'].includes(f));

const typeCounts = {};
let totalTasks = 0;
const remainingFallthrough = [];

for (const file of files) {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const isKs2 = raw.is_ks2 === true || (raw.keyStage || '').toLowerCase().includes('ks2');
    const isKs3 = !isKs2 && (raw.is_ks3 === true || (raw.keyStage || '').toLowerCase().includes('ks3') || /year\s*[789]\b/i.test(raw.year_group || raw.yearGroup || ''));
    const unitObj = { is_ks2: isKs2, is_ks3: isKs3, keyStage: raw.keyStage, yearGroup: raw.year_group || raw.yearGroup };

    const lessons = raw.lessons || (raw.curriculum && raw.curriculum.lessons) || (Array.isArray(raw) ? raw : []);
    lessons.forEach((les, lIdx) => {
      const taskSources = [
        ...(Array.isArray(les.tasks) ? les.tasks : []),
        ...(les.exam_practice?.questions && Array.isArray(les.exam_practice.questions) ? les.exam_practice.questions : []),
        ...(les.gcse_task?.tasks && Array.isArray(les.gcse_task.tasks) ? les.gcse_task.tasks : []),
        ...(Array.isArray(les.writing_tasks) ? les.writing_tasks : [])
      ];

      const seen = new Set();
      taskSources.forEach((t) => {
        const q = (t.question || t.prompt || t.text || t.title || '').trim();
        if (!q || seen.has(q)) return;
        seen.add(q);
        totalTasks++;

        const res = classifyTask(t, unitObj, les);
        typeCounts[res.type] = (typeCounts[res.type] || 0) + 1;
        if (res.type === 'general_secondary') {
          remainingFallthrough.push({ unit: file.replace('.json', ''), q: q.slice(0, 80), tariff: t.tariff || t.marks });
        }
      });
    });
  } catch (e) {}
}

console.log(`\n======================================================`);
console.log(`CLASSIFICATION RESULTS OVER ALL ${totalTasks} UNIQUE TASKS:`);
console.log(`======================================================\n`);
for (const [type, count] of Object.entries(typeCounts).sort((a,b) => b[1] - a[1])) {
  console.log(`- ${type.padEnd(30)} : ${count} tasks`);
}

console.log(`\nRemaining 'general_secondary' fallthrough: ${remainingFallthrough.length}`);
remainingFallthrough.forEach(r => console.log(`  * [${r.unit}] (${r.tariff}): "${r.q}"`));

