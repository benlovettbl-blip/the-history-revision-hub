const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log('========================================================================');
console.log('🧪 COMPREHENSIVE PEDAGOGICAL & STRUCTURAL INTEGRITY AUDIT: ALL 34 MOCKS');
console.log('========================================================================\n');

let totalErrors = 0;
function logPass(msg) { console.log(`  ✅ ${msg}`); }
function logFail(msg) { console.error(`  ❌ ${msg}`); totalErrors++; }

// -----------------------------------------------------------------------------
// 1. Paper 2: Conflict in the Middle East (6 Mocks)
// -----------------------------------------------------------------------------
console.log('📌 [1/5] Auditing Paper 2: Conflict in the Middle East (6 Mocks)...');
const cmeMockFile = fs.readFileSync(path.join(__dirname, '../public/units/cme_new/mock_exams.js'), 'utf8');
const cmeMocks = new Function(cmeMockFile.replace('export const mock_exams =', 'return') + ';')();

if (cmeMocks.length !== 6) {
  logFail(`Expected 6 CME mocks, found ${cmeMocks.length}`);
} else {
  logPass(`Found all 6 CME mocks`);
}

cmeMocks.forEach(m => {
  const q1a = m.questions[0];
  const q1b = m.questions[1];
  const q2 = m.questions[2];
  const q3 = m.questions[3];

  if (!q1a || !q1a.text.startsWith('Explain one consequence')) logFail(`[${m.id}] Q1(a) malformed: ${q1a?.text}`);
  if (!q1b || !q1b.text.startsWith('Explain one consequence')) logFail(`[${m.id}] Q1(b) malformed: ${q1b?.text}`);
  if (!q2 || !q2.text.startsWith('Write a narrative account')) logFail(`[${m.id}] Q2 malformed: ${q2?.text}`);
  if (!q2.bullet_points || q2.bullet_points.length < 2) logFail(`[${m.id}] Q2 missing bullet points!`);
  else {
    logPass(`[${m.id}] Q2 narrative stimuli: ${JSON.stringify(q2.bullet_points)}`);
  }
  if (!q3 || !q3.options || q3.options.length < 3) logFail(`[${m.id}] Q3 missing 3 options!`);
});

// -----------------------------------------------------------------------------
// 2. Paper 2: Early Elizabethan England (7 Mocks)
// -----------------------------------------------------------------------------
console.log('\n📌 [2/5] Auditing Paper 2: Early Elizabethan England (7 Mocks)...');
const EEE_RAW_DIR = path.join(__dirname, '../data/raw_mocks/eee');
const eeeFiles = fs.readdirSync(EEE_RAW_DIR).filter(f => f.endsWith('.html'));

function cleanText(t) { return t ? t.replace(/\s+/g, ' ').replace(/\(\d+\)\s*⏱.*$/i, '').trim() : ''; }
function cleanStatement(t) {
  let s = cleanText(t);
  s = s.replace(/^[0-9]+\s*/, '');
  s = s.replace(/How far do you agree\?.*$/i, '').trim();
  s = s.replace(/^[\s"'“”‘’]+|[\s"'“”‘’]+$/g, '').trim();
  return s;
}

eeeFiles.forEach(f => {
  const rawHtml = fs.readFileSync(path.join(EEE_RAW_DIR, f), 'utf8');
  const dom = new JSDOM(rawHtml);
  const doc = dom.window.document;
  const qBlocks = doc.querySelectorAll('.question-block');

  if (qBlocks.length < 5) {
    logFail(`[${f}] only ${qBlocks.length} question blocks! Expected 5.`);
    return;
  }

  const q1a = cleanText(qBlocks[0].querySelector('.question-text')?.textContent);
  const q1b = cleanText(qBlocks[1].querySelector('.question-text')?.textContent);
  const q2 = cleanText(qBlocks[2].querySelector('.question-text')?.textContent);
  const q2Lis = Array.from(qBlocks[2].querySelectorAll('li')).map(li => li.textContent.trim());
  const q3 = cleanStatement(qBlocks[3].querySelector('.question-text')?.textContent);
  const q3Lis = Array.from(qBlocks[3].querySelectorAll('li')).map(li => li.textContent.trim());
  const q4 = cleanStatement(qBlocks[4].querySelector('.question-text')?.textContent);
  const q4Lis = Array.from(qBlocks[4].querySelectorAll('li')).map(li => li.textContent.trim());

  if (!q1a.includes('Describe one')) logFail(`[${f}] Q1(a) does not have 'Describe one'`);
  if (!q1b.includes('Describe one')) logFail(`[${f}] Q1(b) does not have 'Describe one'`);
  if (!q2.includes('Explain why')) logFail(`[${f}] Q2 does not have 'Explain why'`);
  if (q2Lis.length < 2) logFail(`[${f}] Q2 has < 2 bullets!`);
  if (q3Lis.length < 2) logFail(`[${f}] Q3 has < 2 bullets!`);
  if (q4Lis.length < 2) logFail(`[${f}] Q4 has < 2 bullets!`);

  logPass(`[${f}] Q2 Stimuli: ${JSON.stringify(q2Lis)} | Q3: ${JSON.stringify(q3Lis)} | Q4: ${JSON.stringify(q4Lis)}`);
});

// -----------------------------------------------------------------------------
// 3. Paper 1: Medicine in Britain (4 Mocks)
// -----------------------------------------------------------------------------
console.log('\n📌 [3/5] Auditing Paper 1: Medicine in Britain (4 Mocks)...');
const MED_RAW_DIR = path.join(__dirname, '../data/raw_mocks/edexcel_medicine');
const medFiles = ['mock_2025_clone.html', 'mock_a_2026_predict.html', 'mock_b_2026_predict.html', 'mock_c_2026_predict.html'];

medFiles.forEach(f => {
  const rawHtml = fs.readFileSync(path.join(MED_RAW_DIR, f), 'utf8');
  const dom = new JSDOM(rawHtml);
  const doc = dom.window.document;

  const qBlocks = doc.querySelectorAll('.question-block');
  let q4Bullets = [];
  let q5Bullets = [];
  let q6Bullets = [];

  qBlocks.forEach(qb => {
    const text = qb.textContent.replace(/\s+/g, ' ').trim();
    if (text.includes('Explain why there was rapid progress') || text.includes('Explain why medical treatments') || text.includes('Explain how the publication of the Germ Theory')) {
      const ul = qb.querySelector('ul');
      if (ul) q4Bullets = Array.from(ul.querySelectorAll('li')).map(li => li.textContent.trim());
    } else if (text.includes('Answer EITHER Question 5 OR Question 6')) {
      const uls = Array.from(qb.querySelectorAll('ul'));
      if (uls.length >= 1) q5Bullets = Array.from(uls[0].querySelectorAll('li')).map(li => li.textContent.trim());
      if (uls.length >= 2) q6Bullets = Array.from(uls[1].querySelectorAll('li')).map(li => li.textContent.trim());
    }
  });

  if (q4Bullets.length < 2) logFail(`[${f}] Q4 has < 2 bullets!`);
  if (q5Bullets.length < 2) logFail(`[${f}] Q5 has < 2 bullets!`);
  if (q6Bullets.length < 2) logFail(`[${f}] Q6 has < 2 bullets!`);

  logPass(`[${f}] Q4: ${JSON.stringify(q4Bullets)} | Q5: ${JSON.stringify(q5Bullets)} | Q6: ${JSON.stringify(q6Bullets)}`);
});

// -----------------------------------------------------------------------------
// 4. Paper 3: Weimar and Nazi Germany (4 Mocks)
// -----------------------------------------------------------------------------
console.log('\n📌 [4/5] Auditing Paper 3: Weimar and Nazi Germany (4 Mocks)...');
const WEIMAR_RAW_DIR = path.join(__dirname, '../data/raw_mocks/weimar_nazi_germany');
const weimarFiles = ['mock_notebook_1.html', 'mock_notebook_2.html', 'mock_notebook_3.html', 'mock_adapted_2026.html'];

weimarFiles.forEach(f => {
  const rawHtml = fs.readFileSync(path.join(WEIMAR_RAW_DIR, f), 'utf8');
  const q1Match = rawHtml.match(/Give two things you can infer from Source A about (.*?)\.\s*(?:\(4|<|\n)/i) ||
                  rawHtml.match(/Give two things you can infer from Source A about (.*?)\./i);
  const q2Match = rawHtml.match(/Explain why (.*?)\.\s*(?:\(12|<span|\n|<)/i);
  const boxMatch = rawHtml.match(/<div class="bullet-point-box">([\s\S]*?)<\/div>/i);
  let bullets = [];
  if (boxMatch) {
    const bItems = boxMatch[1].match(/<li>(.*?)<\/li>/gi) || [];
    bItems.forEach(b => bullets.push(b.replace(/<[^>]+>/g, '').trim()));
  }

  if (!q1Match) logFail(`[${f}] Q1 infer prompt missing!`);
  if (!q2Match) logFail(`[${f}] Q2 explain prompt missing!`);
  if (bullets.length < 2) logFail(`[${f}] Q2 has < 2 bullets!`);

  // Check no cross-unit leakage
  bullets.forEach(b => {
    if (b.toLowerCase().includes('vietnam') || b.toLowerCase().includes('civil rights') || b.toLowerCase().includes('elizabeth')) {
      logFail(`[${f}] Cross-unit leakage in Weimar bullets: ${b}`);
    }
  });

  logPass(`[${f}] Q1: "${q1Match ? q1Match[1].trim() : ''}" | Q2 Bullets: ${JSON.stringify(bullets)}`);
});

// -----------------------------------------------------------------------------
// 5. Paper 3: USA 1954–75 (13 Mocks)
// -----------------------------------------------------------------------------
console.log('\n📌 [5/5] Auditing Paper 3: USA 1954–75 (13 Mocks)...');
const USA_RAW_DIR = path.join(__dirname, '../data/raw_mocks/usa');

for (let i = 1; i <= 13; i++) {
  const f = `usa_mock_${i}.html`;
  const rawHtml = fs.readFileSync(path.join(USA_RAW_DIR, f), 'utf8');
  const q1Match = rawHtml.match(/Give two things you can infer from Source A about (.*?)\.\s*(?:\(4|<|\n)/i) ||
                  rawHtml.match(/Give two things you can infer from Source A about (.*?)\./i);
  const q2Match = rawHtml.match(/Explain why (.*?)\.\s*(?:\(12|<span|\n|<)/i);
  
  const q2Pos = rawHtml.indexOf('2. Explain why');
  let bullets = [];
  if (q2Pos !== -1) {
    const q2Sub = rawHtml.substring(q2Pos, q2Pos + 1500);
    const bulletsMatch = q2Sub.match(/<ul>([\s\S]*?)<\/ul>/i);
    if (bulletsMatch) {
      const bItems = bulletsMatch[1].match(/<li>(.*?)<\/li>/gi) || [];
      bItems.forEach(b => bullets.push(b.replace(/<[^>]+>/g, '').trim()));
    }
  }

  if (!q1Match) logFail(`[${f}] Q1 infer prompt missing!`);
  if (!q2Match) logFail(`[${f}] Q2 explain prompt missing!`);
  if (bullets.length < 2) logFail(`[${f}] Q2 has < 2 bullets!`);

  const q2Text = q2Match ? q2Match[1].trim() : '';

  // CRITICAL CHECK: ensure Vietnam questions have Vietnam bullets, and Civil Rights questions have Civil Rights bullets!
  const isVietnamQ2 = q2Text.toLowerCase().includes('vietnam') || q2Text.toLowerCase().includes('vietcong') || q2Text.toLowerCase().includes('nixon');
  if (isVietnamQ2) {
    bullets.forEach(b => {
      if (b.toLowerCase().includes('civil rights') || b.toLowerCase().includes('plessy') || b.toLowerCase().includes('selma') || b.toLowerCase().includes('montgomery') || b.toLowerCase().includes('king')) {
        logFail(`[${f}] CRITICAL ERROR: Vietnam Question 2 has Civil Rights stimulus point: "${b}"!`);
      }
    });
  }

  logPass(`[${f}] Q1: "${q1Match ? q1Match[1].trim() : ''}"`);
  logPass(`      Q2 Prompt: "Explain why ${q2Text}."`);
  logPass(`      Q2 Stimuli: ${JSON.stringify(bullets)}`);
}

console.log('\n========================================================================');
if (totalErrors === 0) {
  console.log('🎉 AUDIT COMPLETE: 0 ERRORS ACROSS ALL 34 MOCK PAPERS!');
} else {
  console.error(`💥 AUDIT FAILED: ${totalErrors} ERRORS DETECTED!`);
  process.exit(1);
}
