const fs = require('fs');
const eee = JSON.parse(fs.readFileSync('data/eee.json', 'utf8'));

const les1 = eee.lessons[0];
const tasks1 = les1.exam_practice.questions;

const les2 = eee.lessons[1];
const tasks2 = les2.exam_practice.questions;

// Patch logic
function getTaskStudioLabel(t, idx, isKs2, isKs3 = false) {
  const q = (t.question || t.prompt || t.text || t.title || '').trim();
  const text = (q + ' ' + (t.type || '') + ' ' + (t.tariff || '') + ' ' + (t.topic || '')).toLowerCase();
  
  const partMatch = q.match(/^([0-9]+(?:\([a-z]\))?|[a-z])\./i) || (t.tariff || '').match(/^([0-9]+(?:\([a-z]\))?|[a-z]):/i);
  const prefix = partMatch ? `Q${partMatch[1].toUpperCase()}` : `Q${idx + 1}`;

  // 1. Interpretations Evaluative Essay (16m)
  if (text.includes('interpretation') && (text.includes('agree') || text.includes('16 marks') || t.marks === 16)) {
    return isKs3 ? `${idx + 1}. Evaluative Essay (16m)` : `${prefix}: Evaluative Essay (16m)`;
  }

  // 2. Interpretations Difference (4m)
  if (text.includes('interpretation') && (text.includes('differ') || text.includes('difference')) && !text.includes('reason') && !text.includes('8 marks') && !text.includes('8m')) {
    return isKs3 ? `${idx + 1}. Interpretations Diff (4m)` : `${prefix}: Interpretations Diff (4m)`;
  }

  // 3. Interpretations Reason for Difference (4m)
  if (text.includes('interpretation') && (text.includes('reason') || text.includes('suggest one reason')) && (text.includes('4') || t.marks === 4)) {
    return isKs3 ? `${idx + 1}. Reason for Diff (4m)` : `${prefix}: Reason for Diff (4m)`;
  }

  // 4. Contrasting Interpretations (8m)
  if (text.includes('interpretation') && (text.includes('8') || t.type?.includes('interpretations'))) {
    return isKs3 ? `${idx + 1}. Interpretations (8m)` : `${prefix}: Interpretations (8m)`;
  }

  // 5. Source Follow-Up (4m)
  if (text.includes('follow up') || text.includes('find out more about')) {
    return isKs3 ? `${idx + 1}. Source Follow-Up (4m)` : `${prefix}: Source Follow-Up (4m)`;
  }

  // 6. Evaluative Essay (Statement + "How far do you agree?")
  if (text.includes('how far do you agree') || text.includes('how far do you') || t.type?.includes('evaluative') || t.type?.includes('judgement') || t.type?.includes('verdict') || /^['"‘“]/.test(q)) {
    const marks = text.includes('16') ? '16m' : '12m';
    return isKs3 ? `${idx + 1}. Evaluative Essay (${marks})` : `${prefix}: Evaluative Essay (${marks})`;
  }

  // 7. Check 2-mark feature drills (EXACT word boundary \b2\s*marks?\b so 12 marks does not trigger!)
  if (t.type === 'feature_2m' || /\b2\s*marks?\b/i.test(text) || text.includes('one key feature') || text.includes('describe one key feature')) {
    return isKs3 ? `${idx + 1}. Key Feature (2m)` : `${prefix}: Key Feature (2m)`;
  }

  // 8. Check consequences
  if (text.includes('consequence')) {
    const marks = (t.tariff && t.tariff.includes('8')) || text.includes('two consequences') ? '8m' : '4m';
    return isKs3 ? `${idx + 1}. Consequence (${marks})` : `${prefix}: Consequence (${marks})`;
  }

  // 9. Source inference
  if (text.includes('infer') || t.type === 'inference_4m' || (text.includes('source') && text.includes('4 mark'))) {
    return isKs3 ? `${idx + 1}. Source Inference (4m)` : `${prefix}: Source Inference (4m)`;
  }

  // 10. Two features
  if (text.includes('two features') || text.includes('feature_drills') || text.includes('two_features')) {
    return isKs3 ? `${idx + 1}. Two Features (4m)` : `${prefix}: Two Features (4m)`;
  }

  // 11. Comparison
  if (text.includes('similar') || text.includes('similarity_difference') || text.includes('explain one way')) {
    return isKs3 ? `${idx + 1}. Comparison (4m)` : `${prefix}: Comparison (4m)`;
  }

  // 12. Source Utility
  if (text.includes('useful') || text.includes('utility')) {
    return isKs3 ? `${idx + 1}. Source Utility (8m)` : `${prefix}: Source Utility (8m)`;
  }

  // 13. Narrative Account
  if (text.includes('narrative')) {
    return isKs3 ? `${idx + 1}. Narrative Account (8m)` : `${prefix}: Narrative Account (8m)`;
  }

  // 14. Explain Importance
  if (text.includes('importance')) {
    return isKs3 ? `${idx + 1}. Explain Importance (8m)` : `${prefix}: Explain Importance (8m)`;
  }

  // 15. 12-mark Causal Explanation
  if (text.includes('12 marks') || text.includes('causation') || text.includes('explain why')) {
    return isKs3 ? `${idx + 1}. Causal Explanation (12m)` : `${prefix}: Causal Explanation (12m)`;
  }
  
  if (t.tag) return isKs3 ? `${idx + 1}. ${t.tag}` : `${prefix}: ${t.tag}`;
  if (t.tariff) return isKs3 ? `${idx + 1}. ${t.tariff}` : `${prefix}: ${t.tariff}`;
  return isKs3 ? `Task ${idx + 1}` : `${prefix}`;
}

console.log('--- EEE Lesson 1 ---');
tasks1.forEach((t, idx) => {
  console.log(`Task ${idx}: "${t.question}" -> Pill: "${getTaskStudioLabel(t, idx, false, false)}"`);
});

console.log('\n--- EEE Lesson 2 ---');
tasks2.forEach((t, idx) => {
  console.log(`Task ${idx}: "${t.question}" -> Pill: "${getTaskStudioLabel(t, idx, false, false)}"`);
});
