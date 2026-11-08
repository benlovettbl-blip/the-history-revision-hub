const fs = require('fs');

// We simulate the exact getTaskStudioLabel and getTaskTypeInfo from viewer.html
function cleanCausalTopic(task, lesson) {
  let text = (task?.question || task?.prompt || '').trim();
  if (text) {
    text = text.replace(/\[\d+\s*marks?.*?\]/gi, '').trim();
    text = text.replace(/^explain\s+/i, '').trim();
    if (/^why\s+/i.test(text)) {
      return text.replace(/[?.!]+$/, '').trim();
    }
  }
  let title = (lesson?.title || 'this development').trim();
  title = title.replace(/^\d{4}\s*(&|and|-|–)?\s*/i, '').trim();
  if (/why did\s+/i.test(title)) {
    const m = title.match(/why did\s+([a-zA-Z\s]+?)\s+(\w+)\??$/i);
    if (m) {
      const subject = m[1].trim();
      const verb = m[2].trim();
      const pastVerb = verb === 'win' ? 'won' : (verb === 'lose' ? 'lost' : (verb.endsWith('e') ? verb + 'd' : verb + 'ed'));
      return `why ${subject} ${pastVerb}`;
    }
  }
  return title.replace(/[?.!]+$/, '').trim();
}

function getTaskStudioLabel(t, idx, isKs2, isKs3 = false) {
  if (isKs2) {
    const isBigQ = idx === 3 || (t.tag && t.tag.toLowerCase().includes('challenge')) || (t.type && t.type.toLowerCase().includes('big'));
    const defaultLabel = isBigQ ? '★ 4. The Big Question' : `Task ${idx + 1}`;
    return t.tag ? `${idx + 1}. ${t.tag}` : defaultLabel;
  }
  
  const text = ((t.question || t.prompt || '') + ' ' + (t.type || '') + ' ' + (t.tariff || '') + ' ' + (t.topic || '')).toLowerCase();

  if (isKs3) {
    if (t.tag) return `${idx + 1}. ${t.tag}`;
    if (text.includes('infer')) return `${idx + 1}. Source Inference (4m)`;
    if (text.includes('two features') || text.includes('feature_drills') || text.includes('two_features')) return `${idx + 1}. Two Features (4m)`;
    if (text.includes('similar') || text.includes('difference') || text.includes('similarity_difference')) return `${idx + 1}. Comparison (4m)`;
    if (text.includes('consequence')) return `${idx + 1}. Consequence (4m)`;
    if (text.includes('useful') || text.includes('utility')) return `${idx + 1}. Source Utility (8m)`;
    if (text.includes('narrative')) return `${idx + 1}. Narrative Account (8m)`;
    if (text.includes('importance')) return `${idx + 1}. Explain Importance (8m)`;
    if (text.includes('16 marks') || text.includes('16+4') || text.includes('judgement') || text.includes('verdict')) return `${idx + 1}. Evaluative Essay (16m)`;
    if (text.includes('12 marks') || text.includes('causation') || text.includes('explain why')) return `${idx + 1}. Causal Explanation (12m)`;
    if (t.tariff) return `${idx + 1}. ${t.tariff}`;
    return `Task ${idx + 1}`;
  }

  if (t.tag) return `${idx + 1}. ${t.tag}`;
  const qNum = `Q${idx + 1}`;

  if (text.includes('infer')) return `${qNum}: Source Inference (4m)`;
  if (text.includes('two features') || text.includes('feature_drills') || text.includes('two_features')) return `${qNum}: Two Features (4m)`;
  if (text.includes('similar') || text.includes('difference') || text.includes('similarity_difference')) return `${qNum}: Comparison (4m)`;
  if (text.includes('consequence')) return `${qNum}: Consequence (4m)`;
  if (text.includes('useful') || text.includes('utility')) return `${qNum}: Source Utility (8m)`;
  if (text.includes('narrative')) return `${qNum}: Narrative Account (8m)`;
  if (text.includes('importance')) return `${qNum}: Explain Importance (8m)`;
  if (text.includes('16 marks') || text.includes('16+4') || text.includes('judgement') || text.includes('verdict')) return `${qNum}: Evaluative Essay (16m)`;
  if (text.includes('12 marks') || text.includes('causation') || text.includes('explain why')) return `${qNum}: Causal Explanation (12m)`;
  
  if (t.tariff) return `${qNum}: ${t.tariff}`;
  return `Task ${idx + 1}`;
}

const targetUnits = ['edexcel_medicine', 'eee', 'cme_new', 'usa', 'cold_war', 'the_shoah'];

console.log('================================================================');
console.log('SIMULATING MULTI-TASK PILL LABELS FOR TARGET UNITS');
console.log('================================================================');

targetUnits.forEach(u => {
  const p = `data/${u}.json`;
  if (!fs.existsSync(p)) return;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const isKs2 = d.is_ks2 === true || (d.keyStage || '').toLowerCase().includes('ks2');
  const isKs3 = !isKs2 && (d.is_ks3 === true || (d.yearGroup || '').toLowerCase().includes('year') || (d.keyStage || '').toLowerCase().includes('ks3'));

  console.log(`\nUNIT: ${u} (isKs2: ${isKs2}, isKs3: ${isKs3})`);
  (d.lessons || []).slice(0, 3).forEach((l, lIdx) => {
    let tasks = [];
    if (l.exam_practice?.questions && l.exam_practice.questions.length > 0) {
      tasks = l.exam_practice.questions;
    } else if (l.tasks && l.tasks.length > 0) {
      tasks = l.tasks;
    } else if (l.extended_writing) {
      tasks = [l.extended_writing];
    } else if (l.extended) {
      tasks = [l.extended];
    }

    console.log(`  Lesson ${lIdx + 1} (${l.id}) - ${tasks.length} task(s):`);
    tasks.forEach((t, tIdx) => {
      const pillLabel = getTaskStudioLabel(t, tIdx, isKs2, isKs3);
      const questionText = (t.question || t.prompt || '').slice(0, 70);
      console.log(`    [Button ${tIdx + 1}] "${pillLabel}" -> Q: ${questionText}...`);
    });
  });
});

