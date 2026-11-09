// scripts/apply_paper2_calibrations.cjs
// Applies calibrated models and 3-tier mark scheme ladders to Early Elizabethan England and Cold War
const fs = require('fs');
const { eee2m } = require('./calibrate_eee_features.cjs');
const { eee12m } = require('./calibrate_eee.cjs');
const { eee16m } = require('./calibrate_eee_16m.cjs');
const { cw4m } = require('./calibrate_cw_consequences.cjs');
const { narrative_8, importance_8 } = require('./calibrate_cw_8m.cjs');

// ==========================================
// 1. EARLY ELIZABETHAN ENGLAND (eee.json)
// ==========================================
console.log('Applying Early Elizabethan England calibrations...');
const eee = JSON.parse(fs.readFileSync('data/eee.json', 'utf8'));
let eee2mCount = 0;
let eee12mCount = 0;
let eee16mCount = 0;

eee.lessons.forEach(l => {
  if (!l.exam_practice || !l.exam_practice.questions) return;
  const lId = l.id;

  l.exam_practice.questions.forEach((q, idx) => {
    // 2-mark feature questions (Q1 and Q2 in all 12 lessons)
    if (idx === 0 || idx === 1) {
      const key = `${lId}_q${idx + 1}`;
      if (eee2m[key]) {
        q.model_tiers = eee2m[key];
        q.model = eee2m[key].tier_2m.text;
        eee2mCount++;
      }
    }
    // Q3: 12-mark causation OR 16-mark essay
    else if (idx === 2) {
      if (q.marks === 12 || q.tariff?.includes('12')) {
        if (eee12m[lId]) {
          q.model_tiers = eee12m[lId];
          q.model = eee12m[lId].tier_12m.text;
          eee12mCount++;
        }
      } else if (q.marks === 16 || q.tariff?.includes('16')) {
        if (eee16m[lId]) {
          q.model_tiers = eee16m[lId];
          q.model = eee16m[lId].tier_16m.text;
          eee16mCount++;
        }
      }
    }
  });
});

fs.writeFileSync('data/eee.json', JSON.stringify(eee, null, 2), 'utf8');
console.log(`[EEE] Applied: ${eee2mCount} 2m features, ${eee12mCount} 12m causation, ${eee16mCount} 16m essays.`);

// ==========================================
// 2. SUPERPOWER RELATIONS & COLD WAR (cold_war.json)
// ==========================================
console.log('\nApplying Cold War calibrations...');
const cw = JSON.parse(fs.readFileSync('data/cold_war.json', 'utf8'));
let cw4mCount = 0;
let cwNarrativeCount = 0;
let cwImportanceCount = 0;

const narrativeMap = {
  'lesson_1': 'cw_1_3',
  'lesson_2': 'cw_2_3',
  'lesson_3': 'cw_3_3',
  'lesson_4': 'cw_4_3',
  'lesson_5': 'cw_5_3',
  'lesson_6': 'cw_6_3'
};

const importanceMap = {
  'lesson_3_q4': 'cw_3_4',
  'lesson_4_q4': 'cw_4_4',
  'lesson_5_q4': 'cw_5_4',
  'lesson_6_q4': 'cw_6_4',
  'lesson_7_q3': 'cw_7_3',
  'lesson_7_q4': 'cw_7_4'
};

cw.lessons.forEach(l => {
  if (!l.exam_practice || !l.exam_practice.questions) return;
  const lId = l.id;

  l.exam_practice.questions.forEach((q, idx) => {
    // 4-mark consequence questions (Q1 and Q2)
    if (idx === 0 || idx === 1) {
      const key = `${lId}_q${idx + 1}`;
      if (cw4m[key]) {
        q.model_tiers = cw4m[key];
        q.model = cw4m[key].tier_4m.text;
        cw4mCount++;
      }
    }
    // Narrative account (8 marks)
    else if (q.type === 'narrative_8' || (idx === 2 && narrativeMap[lId])) {
      const refKey = narrativeMap[lId];
      if (refKey && narrative_8[refKey]) {
        const cal = narrative_8[refKey];
        const nTiers = cal.tiers;
        q.model_tiers = {
          tier_2m: {
            title: "2/8 Simple Narrative",
            score: "2 / 8 Marks",
            level: "Level 1 (Simple Narrative)",
            text: `<p>${nTiers[0].text}</p>`,
            verdict: nTiers[0].commentary
          },
          tier_5m: {
            title: "5/8 Descriptive Narrative",
            score: "5 / 8 Marks",
            level: "Level 2 (Descriptive Narrative)",
            text: `<p>${nTiers[1].text.replace(/<br><br>/g, '</p><p>')}</p>`,
            verdict: nTiers[1].commentary
          },
          tier_8m: {
            title: "8/8 Grade 9 Exam ★",
            score: "8 / 8 Marks",
            level: "Level 3 Top (Pearson Exam Standard)",
            badge: "Edexcel Benchmark",
            text: `<p>${nTiers[2].text.replace(/<br><br>/g, '</p><p>')}</p>`,
            verdict: nTiers[2].commentary
          }
        };
        q.model = q.model_tiers.tier_8m.text;
        cwNarrativeCount++;
      }
    }
    // Importance question (8 marks)
    else if (q.type === 'importance_8' || (idx >= 2 && q.marks === 8)) {
      const qNumKey = `${lId}_q${idx + 1}`;
      const refKey = importanceMap[qNumKey];
      if (refKey && importance_8[refKey]) {
        const cal = importance_8[refKey];
        const iTiers = cal.tiers;
        q.model_tiers = {
          tier_2m: {
            title: "2/8 Simple Identification",
            score: "2 / 8 Marks",
            level: "Level 1 (Simple Identification)",
            text: `<p>${iTiers[0].text}</p>`,
            verdict: iTiers[0].commentary
          },
          tier_5m: {
            title: "5/8 Descriptive Explanation",
            score: "5 / 8 Marks",
            level: "Level 2 (Descriptive Explanation)",
            text: `<p>${iTiers[1].text.replace(/<br><br>/g, '</p><p>')}</p>`,
            verdict: iTiers[1].commentary
          },
          tier_8m: {
            title: "8/8 Grade 9 Exam ★",
            score: "8 / 8 Marks",
            level: "Level 3 Top (Pearson Exam Standard)",
            badge: "Edexcel Benchmark",
            text: `<p>${iTiers[2].text.replace(/<br><br>/g, '</p><p>')}</p>`,
            verdict: iTiers[2].commentary
          }
        };
        q.model = q.model_tiers.tier_8m.text;
        cwImportanceCount++;
      }
    }
  });
});

fs.writeFileSync('data/cold_war.json', JSON.stringify(cw, null, 2), 'utf8');
console.log(`[Cold War] Applied: ${cw4mCount} 4m consequences, ${cwNarrativeCount} 8m narratives, ${cwImportanceCount} 8m importance.`);
