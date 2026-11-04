const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log('Generating src/engine/mock_exam_bank_data.js from official mock papers...');

// ==========================================
// 1. USA (Option 33) Mapping & Extraction
// ==========================================

const usaMapping = {
  // lesson_1_1: Jim Crow & Segregation early 1950s
  'lesson_1_1': [
    { mock: 'usa_mock_1', q: '1' },
    { mock: 'usa_mock_1', q: '2' },
    { mock: 'usa_mock_1', q: '3a' },
    { mock: 'usa_mock_1', q: '3d' }
  ],
  // lesson_1_2: Brown v Board & Little Rock (1954-57)
  'lesson_1_2': [
    { mock: 'usa_mock_2', q: '1' },
    { mock: 'usa_mock_11', q: '1' },
    { mock: 'usa_mock_11', q: '2' },
    { mock: 'usa_mock_11', q: '3a' },
    { mock: 'usa_mock_11', q: '3d' }
  ],
  // lesson_1_3: Montgomery Bus Boycott (1955-56)
  'lesson_1_3': [
    { mock: 'usa_mock_3', q: '2' },
    { mock: 'usa_mock_7', q: '2' }
  ],
  // lesson_1_4: White resistance (1954-60)
  'lesson_1_4': [
    { mock: 'usa_mock_12', q: '1' },
    { mock: 'usa_mock_12', q: '2' },
    { mock: 'usa_mock_12', q: '3a' },
    { mock: 'usa_mock_12', q: '3d' }
  ],
  // lesson_2_1: Non-violent protests, Sit-ins, March on Washington, Freedom Summer
  'lesson_2_1': [
    { mock: 'usa_mock_3', q: '1' },
    { mock: 'usa_mock_10', q: '1' },
    { mock: 'usa_mock_5', q: '3a' },
    { mock: 'usa_mock_5', q: '3d' }
  ],
  // lesson_2_2: Birmingham, Selma, Civil Rights Act 1964, Voting Rights Act 1965
  'lesson_2_2': [
    { mock: 'usa_mock_9', q: '1' },
    { mock: 'usa_mock_9', q: '2' },
    { mock: 'usa_mock_9', q: '3a' },
    { mock: 'usa_mock_9', q: '3d' },
    { mock: 'usa_mock_10', q: '2' },
    { mock: 'usa_mock_10', q: '3a' },
    { mock: 'usa_mock_10', q: '3d' },
    { mock: 'usa_mock_2', q: '3a' },
    { mock: 'usa_mock_2', q: '3d' },
    { mock: 'usa_mock_6', q: '3a' },
    { mock: 'usa_mock_6', q: '3d' }
  ],
  // lesson_2_3: Black Power, Malcolm X, Black Panthers
  'lesson_2_3': [
    { mock: 'usa_mock_4', q: '3a' },
    { mock: 'usa_mock_4', q: '3d' }
  ],
  // lesson_2_4: Riots, Kerner Report, Challenges 1965-75
  'lesson_2_4': [
    { mock: 'usa_mock_13', q: '1' },
    { mock: 'usa_mock_13', q: '2' },
    { mock: 'usa_mock_13', q: '3a' },
    { mock: 'usa_mock_13', q: '3d' }
  ],
  // lesson_3_1: Diem, Strategic Hamlets (1961-63)
  'lesson_3_1': [
    { mock: 'usa_mock_5', q: '1' }
  ],
  // lesson_3_2: Escalation, Gulf of Tonkin, Combat troops (1964-65)
  'lesson_3_2': [
    { mock: 'usa_mock_7', q: '1' },
    { mock: 'usa_mock_7', q: '3a' },
    { mock: 'usa_mock_7', q: '3d' }
  ],
  // lesson_3_3: Tactics failure, Vietcong guerrillas, Agent Orange, Search & Destroy
  'lesson_3_3': [
    { mock: 'usa_mock_4', q: '1' },
    { mock: 'usa_mock_6', q: '2' },
    { mock: 'usa_mock_8', q: '1' },
    { mock: 'usa_mock_8', q: '2' },
    { mock: 'usa_mock_8', q: '3a' },
    { mock: 'usa_mock_8', q: '3d' }
  ],
  // lesson_3_4: Nixon, Vietnamisation, Nixon Doctrine
  'lesson_3_4': [
    { mock: 'usa_mock_2', q: '2' }
  ],
  // lesson_4_1: Anti-war movement, media, draft
  'lesson_4_1': [
    { mock: 'usa_mock_4', q: '2' }
  ],
  // lesson_4_3: Peace negotiations 1972-73, Fall of Saigon 1975
  'lesson_4_3': [
    { mock: 'usa_mock_5', q: '2' }
  ],
  // lesson_4_4: Synoptic evaluation of US failure
  'lesson_4_4': [
    { mock: 'usa_mock_3', q: '3a' },
    { mock: 'usa_mock_3', q: '3d' }
  ]
};

// Cache for mock QP and MS parsed documents
const usaMockCache = {};

function getUsaMockData(mockId) {
  if (usaMockCache[mockId]) return usaMockCache[mockId];

  const qpPath = path.join(__dirname, `../public/units/usa/${mockId}_question_booklet.html`);
  const sbPath = path.join(__dirname, `../public/units/usa/${mockId}_sources_booklet.html`);
  const msPath = path.join(__dirname, `../public/units/usa/${mockId}_mark_scheme.html`);

  const qpHtml = fs.existsSync(qpPath) ? fs.readFileSync(qpPath, 'utf8') : '';
  const sbHtml = fs.existsSync(sbPath) ? fs.readFileSync(sbPath, 'utf8') : '';
  const msHtml = fs.existsSync(msPath) ? fs.readFileSync(msPath, 'utf8') : '';

  const qpDom = new JSDOM(qpHtml);
  const sbDom = new JSDOM(sbHtml);
  const msDom = new JSDOM(msHtml);

  usaMockCache[mockId] = { qpDom, sbDom, msDom, qpHtml, sbHtml, msHtml };
  return usaMockCache[mockId];
}

function extractUsaQuestionDetails(mockId, qCode) {
  const { qpDom, sbDom, msDom, qpHtml, sbHtml, msHtml } = getUsaMockData(mockId);
  const mockNum = mockId.replace('usa_mock_', '');
  const title = `USA Mock Paper ${mockNum}`;
  const pdfUrl = `/pdfs/mocks/usa/${mockId}_question_booklet.pdf`;
  const mockUrl = `/units/usa/${mockId}_question_booklet.html`;

  let type = '';
  let marks = 0;
  let targetMins = 0;
  let questionText = '';
  let stimulus = [];
  let sourceExtract = '';
  let modelAnswer = '';

  if (qCode === '1') {
    type = '4-Mark Inference';
    marks = 4;
    targetMins = 6;
    const match = qpHtml.match(/Give two things you can infer from Source A about (.*?)\./i);
    questionText = match ? `Give two things you can infer from Source A about ${match[1].trim()}.` : 'Give two things you can infer from Source A.';
    
    // Source A from SB or QP
    const provEl = qpDom.window.document.querySelector('.provenance');
    const contentEl = qpDom.window.document.querySelector('.source-content .source-content');
    if (provEl && contentEl) {
      sourceExtract = `<div style="font-style: italic; margin-bottom: 6px; font-weight: 600;">${provEl.textContent.trim()}</div><div>${contentEl.textContent.trim()}</div>`;
    }

    // Model from MS
    const msCard = msDom.window.document.querySelector('.q-card');
    if (msCard) {
      const mb = msCard.querySelector('.model-box');
      if (mb) modelAnswer = mb.innerHTML.trim();
    }
  } else if (qCode === '2') {
    type = '12-Mark Causation';
    marks = 12;
    targetMins = 24;
    const match = qpHtml.match(/Explain why (.*?)\./i);
    questionText = match ? `Explain why ${match[1].trim()}.` : 'Explain why the event occurred.';

    // Stimulus
    const q2Pos = qpHtml.indexOf('Explain why');
    if (q2Pos !== -1) {
      const q2Sub = qpHtml.substring(q2Pos, q2Pos + 1500);
      const bMatch = q2Sub.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
      if (bMatch) {
        const lis = bMatch[1].match(/<li[^>]*>(.*?)<\/li>/gi) || [];
        stimulus = lis.map(li => li.replace(/<[^>]+>/g, '').trim());
      }
    }

    // Model from MS
    const qCards = msDom.window.document.querySelectorAll('.q-card');
    if (qCards.length >= 2) {
      const mb = qCards[1].querySelector('.model-box');
      if (mb) modelAnswer = mb.innerHTML.trim();
    }
  } else if (qCode === '3a') {
    type = '8-Mark Source Utility';
    marks = 8;
    targetMins = 14;
    const match = qpHtml.match(/How useful are Sources B and C for an enquiry into (.*?)\?/i);
    questionText = match ? `How useful are Sources B and C for an enquiry into ${match[1].trim()}? Explain your answer, using Sources B and C and your knowledge of the historical context.` : 'How useful are Sources B and C for an enquiry?';

    // Model from MS
    const qCards = msDom.window.document.querySelectorAll('.q-card');
    if (qCards.length >= 3) {
      const mb = qCards[2].querySelector('.model-box');
      if (mb) modelAnswer = mb.innerHTML.trim();
    }
  } else if (qCode === '3d') {
    type = '16+4 Mark Historical Interpretation';
    marks = 20;
    targetMins = 34;
    const match = qpHtml.match(/How far do you agree with Interpretation (?:1|2) about (.*?)\?/i);
    questionText = match ? `How far do you agree with Interpretation 2 about ${match[1].trim()}? Explain your answer, using both interpretations and your knowledge of the historical context.` : 'How far do you agree with Interpretation 2?';

    // Model from MS
    const qCards = msDom.window.document.querySelectorAll('.q-card');
    if (qCards.length >= 6) {
      const mb = qCards[5].querySelector('.model-box');
      if (mb) modelAnswer = mb.innerHTML.trim();
    }
  }

  return {
    id: `${mockId}_q${qCode}`,
    mockId,
    qCode,
    mockTitle: title,
    paperCode: 'Option 33 (1HI0/33)',
    type,
    marks,
    targetMins,
    questionText,
    stimulus,
    sourceExtract,
    modelAnswer,
    pdfUrl,
    mockUrl
  };
}


// ====================================================
// 2. Weimar & Nazi Germany (Option 31) Mapping & Extraction
// ====================================================

const weimarMapping = {
  // KT1: The Weimar Republic 1918–29
  'lesson_1_1': [
    { mock: 'mock_notebook_3', q: '1' },
    { mock: 'mock_notebook_3', q: '2' },
    { mock: 'mock_notebook_1', q: '1' }
  ],
  'lesson_1_2': [
    { mock: 'mock_notebook_1', q: '2' },
    { mock: 'mock_notebook_3', q: '2_alt' },
    { mock: 'mock_adapted_2026', q: '3a' },
    { mock: 'mock_adapted_2026', q: '3d' }
  ],
  'lesson_1_3': [
    { mock: 'mock_notebook_1', q: '2_alt' },
    { canonical: true, index: 0 },
    { canonical: true, index: 1 }
  ],
  'lesson_1_4': [
    { mock: 'mock_notebook_2', q: '1' },
    { mock: 'mock_notebook_2', q: '2' }
  ],
  // KT2: Hitler's Rise to Power, 1919–33
  'lesson_2_1': [
    { canonical: true, index: 0 },
    { canonical: true, index: 1 }
  ],
  'lesson_2_2': [
    { mock: 'mock_notebook_2', q: '2_alt' },
    { canonical: true, index: 1 }
  ],
  'lesson_2_3': [
    { canonical: true, index: 0 },
    { canonical: true, index: 1 }
  ],
  'lesson_2_4': [
    { mock: 'mock_adapted_2026', q: '2_alt' },
    { canonical: true, index: 1 }
  ],
  // KT3: Nazi Control and Dictatorship, 1933–39
  'lesson_3_1': [
    { canonical: true, index: 0 },
    { canonical: true, index: 1 }
  ],
  'lesson_3_2': [
    { mock: 'mock_notebook_2', q: '3a' },
    { mock: 'mock_notebook_2', q: '3d' }
  ],
  'lesson_3_3': [
    { canonical: true, index: 0 },
    { canonical: true, index: 1 }
  ],
  'lesson_3_4': [
    { mock: 'mock_adapted_2026', q: '1' },
    { canonical: true, index: 1 }
  ],
  // KT4: Life in Nazi Germany, 1933–39
  'lesson_4_1': [
    { mock: 'mock_adapted_2026', q: '2' },
    { canonical: true, index: 1 }
  ],
  'lesson_4_2': [
    { mock: 'mock_notebook_3', q: '3a' },
    { mock: 'mock_notebook_3', q: '3d' }
  ],
  'lesson_4_3': [
    { canonical: true, index: 0 },
    { canonical: true, index: 1 }
  ],
  'lesson_4_4': [
    { mock: 'mock_notebook_1', q: '3a' },
    { mock: 'mock_notebook_1', q: '3d' }
  ]
};

const weimarMockCache = {};

function getWeimarMockData(mockId) {
  if (weimarMockCache[mockId]) return weimarMockCache[mockId];

  const qpPath = path.join(__dirname, `../public/units/weimar_nazi_germany/${mockId}_question_booklet.html`);
  const sbPath = path.join(__dirname, `../public/units/weimar_nazi_germany/${mockId}_sources_booklet.html`);
  const msPath = path.join(__dirname, `../public/units/weimar_nazi_germany/${mockId}_mark_scheme.html`);

  const qpHtml = fs.existsSync(qpPath) ? fs.readFileSync(qpPath, 'utf8') : '';
  const sbHtml = fs.existsSync(sbPath) ? fs.readFileSync(sbPath, 'utf8') : '';
  const msHtml = fs.existsSync(msPath) ? fs.readFileSync(msPath, 'utf8') : '';

  const qpDom = new JSDOM(qpHtml);
  const sbDom = sbHtml ? new JSDOM(sbHtml) : null;
  const msDom = new JSDOM(msHtml);

  weimarMockCache[mockId] = { qpDom, sbDom, msDom, qpHtml, sbHtml, msHtml };
  return weimarMockCache[mockId];
}

const weimarMockTitles = {
  'mock_notebook_1': 'Weimar Mock Paper 1 (Constitution & Disabled Persecution)',
  'mock_notebook_2': 'Weimar Mock Paper 2 (Golden Age Culture & Church Resistance)',
  'mock_notebook_3': 'Weimar Mock Paper 3 (German Revolution & Nazi Youth)',
  'mock_adapted_2026': 'Weimar Mock Paper 4 (1923 Crisis, Hitler Chancellor & Women)'
};

function extractWeimarQuestionDetails(mockId, qCode) {
  const { qpDom, sbDom, msDom, qpHtml, sbHtml, msHtml } = getWeimarMockData(mockId);
  const title = weimarMockTitles[mockId] || `Weimar Mock Paper (${mockId})`;
  const pdfUrl = `/pdfs/mocks/weimar_nazi_germany/${mockId}_question_booklet.pdf`;
  const mockUrl = `/units/weimar_nazi_germany/${mockId}_question_booklet.html`;

  let type = '';
  let marks = 0;
  let targetMins = 0;
  let questionText = '';
  let stimulus = [];
  let sourceExtract = '';
  let modelAnswer = '';

  const modelAnswers = msDom.window.document.querySelectorAll('.model-answer');

  if (qCode === '1') {
    type = '4-Mark Inference';
    marks = 4;
    targetMins = 6;
    const match = qpHtml.match(/Give two things you can infer from Source A about (.*?)[.<]/i);
    questionText = match ? `Give two things you can infer from Source A about ${match[1].trim()}.` : 'Give two things you can infer from Source A.';
    
    // Source A
    const srcContent = qpDom.window.document.querySelector('.source-content');
    if (srcContent) {
      sourceExtract = `<div style="font-weight: 700; color: #b45309; margin-bottom: 6px;">Source A:</div><div>${srcContent.innerHTML.trim()}</div>`;
    }

    if (modelAnswers.length >= 1) {
      modelAnswer = modelAnswers[0].innerHTML.trim();
    }
  } else if (qCode === '2') {
    type = '12-Mark Causation';
    marks = 12;
    targetMins = 24;
    const match = qpHtml.match(/Explain why (.*?)[.<]/i);
    questionText = match ? `Explain why ${match[1].trim()}.` : 'Explain why the event occurred.';

    // Stimulus from QP ul li (last 2 items)
    const lis = qpDom.window.document.querySelectorAll('ul li');
    if (lis.length >= 2) {
      stimulus = [lis[lis.length - 2].textContent.trim(), lis[lis.length - 1].textContent.trim()];
    }

    if (modelAnswers.length >= 2) {
      modelAnswer = modelAnswers[1].innerHTML.trim();
    }
  } else if (qCode === '2_alt') {
    type = '12-Mark Causation';
    marks = 12;
    targetMins = 24;
    
    if (mockId === 'mock_notebook_1') {
      questionText = 'Explain why the German economy recovered in the years 1924–29.';
      stimulus = ['Gustav Stresemann', 'The Rentenmark'];
    } else if (mockId === 'mock_notebook_2') {
      questionText = 'Explain why the Nazi Party was reorganised in the years 1924–28.';
      stimulus = ['The Munich Putsch (1923)', 'The Bamberg Conference (1926)'];
    } else if (mockId === 'mock_notebook_3') {
      questionText = 'Explain why the German economy collapsed into hyperinflation in 1923.';
      stimulus = ['The occupation of the Ruhr', 'Passive resistance'];
    } else if (mockId === 'mock_adapted_2026') {
      questionText = 'Explain why Adolf Hitler was appointed Chancellor in 1933.';
      stimulus = ['The Great Depression / Unemployment', 'Political scheming / Franz von Papen'];
    }

    if (modelAnswers.length >= 3) {
      modelAnswer = modelAnswers[2].innerHTML.trim();
    }
  } else if (qCode === '3a') {
    type = '8-Mark Source Utility';
    marks = 8;
    targetMins = 14;
    const match = qpHtml.match(/How useful are Sources B and C for an enquiry into (.*?)[?<]/i);
    questionText = match ? `How useful are Sources B and C for an enquiry into ${match[1].trim()}? Explain your answer, using Sources B and C and your knowledge of the historical context.` : 'How useful are Sources B and C for an enquiry?';

    // Extract Sources B & C from sbDom
    if (sbDom) {
      const cards = sbDom.window.document.querySelectorAll('div[style*="border: 1.2px solid #000"], div[style*="border: 1.5px solid"]');
      let srcB = '', srcC = '';
      cards.forEach(c => {
        const txt = c.textContent;
        if (txt.includes('Source B') && !srcB) srcB = c.innerHTML.trim();
        else if (txt.includes('Source C') && !srcC) srcC = c.innerHTML.trim();
      });
      if (srcB && srcC) {
        sourceExtract = `<div style="margin-bottom: 12px;">${srcB}</div><div>${srcC}</div>`;
      }
    }

    if (modelAnswers.length >= 4) {
      const parts = modelAnswers[3].innerHTML.split(/\*\*\s*3\([a-d]\)\s*Answer:\s*\*\*/i);
      if (parts.length >= 2) {
        modelAnswer = parts[1].trim().replace(/^<br\s*\/?>/i, '').trim();
      }
    }
  } else if (qCode === '3d') {
    type = '16+4 Mark Historical Interpretation';
    marks = 20;
    targetMins = 34;
    const match = qpHtml.match(/How far do you agree with (?:Interpretation 2|Interpretation 1|<strong>Interpretation 2<\/strong>|<strong>Interpretation 1<\/strong>) about (.*?)[?<]/i);
    questionText = match ? `How far do you agree with Interpretation 2 about ${match[1].trim()}? Explain your answer, using both interpretations and your knowledge of the historical context.` : 'How far do you agree with Interpretation 2?';

    // Extract Interpretations 1 & 2 from sbDom
    if (sbDom) {
      const cards = sbDom.window.document.querySelectorAll('div[style*="border: 1.2px solid #000"], div[style*="border: 1.5px solid"]');
      let int1 = '', int2 = '';
      cards.forEach(c => {
        const txt = c.textContent;
        if (txt.includes('Interpretation 1') && !int1) int1 = c.innerHTML.trim();
        else if (txt.includes('Interpretation 2') && !int2) int2 = c.innerHTML.trim();
      });
      if (int1 && int2) {
        sourceExtract = `<div style="margin-bottom: 12px;">${int1}</div><div>${int2}</div>`;
      }
    }

    if (modelAnswers.length >= 4) {
      const parts = modelAnswers[3].innerHTML.split(/\*\*\s*3\([a-d]\)\s*Answer:\s*\*\*/i);
      if (parts.length >= 5) {
        modelAnswer = parts[4].trim().replace(/^<br\s*\/?>/i, '').trim();
      }
    }
  }

  return {
    id: `${mockId}_q${qCode}`,
    mockId,
    qCode: qCode === '2_alt' ? '2 (Alternative)' : (qCode === '3a' ? '3(a)' : (qCode === '3d' ? '3(d)' : qCode)),
    mockTitle: title,
    paperCode: 'Option 31 (1HI0/31)',
    type,
    marks,
    targetMins,
    questionText,
    stimulus,
    sourceExtract,
    modelAnswer,
    pdfUrl,
    mockUrl
  };
}

const weimarData = require(path.join(__dirname, '../units/weimar_nazi_germany/data.js')).default;

function extractCanonicalWeimarQuestion(lessonId, index) {
  const lesson = weimarData.lessons.find(l => l.id === lessonId);
  if (!lesson || !lesson.exam_practice || !lesson.exam_practice.questions) return null;
  const q = lesson.exam_practice.questions[index];
  if (!q) return null;

  let qCode = '1';
  let type = '4-Mark Inference';
  let marks = 4;
  let targetMins = 6;

  if (q.tariff.includes('16') || (q.type && q.type.includes('16')) || q.question.includes('How far do you agree')) {
    qCode = '3(d)';
    type = '16+4 Mark Historical Interpretation';
    marks = 20;
    targetMins = 34;
  } else if (q.tariff.includes('12') || (q.type && q.type.includes('12')) || q.question.includes('Explain why')) {
    qCode = '2';
    type = '12-Mark Causation';
    marks = 12;
    targetMins = 24;
  } else if (q.tariff.includes('8') || (q.type && q.type.includes('8')) || q.question.includes('How useful')) {
    qCode = '3(a)';
    type = '8-Mark Source Utility';
    marks = 8;
    targetMins = 14;
  }

  let sourceExtract = '';
  if (lesson.exam_practice.stimulus && lesson.exam_practice.stimulus[0]) {
    const s = lesson.exam_practice.stimulus[0];
    sourceExtract = `<div style="font-weight: 700; color: #b45309; margin-bottom: 6px;">${s.provenance || s.title || 'Source A'}</div><div>${s.content || ''}</div>`;
  }

  let stimulus = [];
  if (q.stimulus && Array.isArray(q.stimulus)) {
    stimulus = q.stimulus;
  } else if (q.bullet_points && Array.isArray(q.bullet_points)) {
    stimulus = q.bullet_points;
  }

  return {
    id: `${lessonId}_can_q${index + 1}`,
    mockId: 'canonical_exam_station',
    qCode,
    mockTitle: 'Official Edexcel Syllabus Practice Station',
    paperCode: 'Option 31 (1HI0/31)',
    type,
    marks,
    targetMins,
    questionText: q.question,
    stimulus,
    sourceExtract,
    modelAnswer: q.model,
    pdfUrl: '/pdfs/weimar_nazi_germany/weimar_nazi_germany_textbook_UNIFIED.pdf',
    mockUrl: `/units/weimar_nazi_germany/`
  };
}


// ==========================================
// 3. Assemble and Compile Final Database
// ==========================================

const finalDatabase = {
  usa: {},
  weimar_nazi_germany: {}
};

// Build USA
for (const [lessonId, qList] of Object.entries(usaMapping)) {
  finalDatabase.usa[lessonId] = qList.map(item => extractUsaQuestionDetails(item.mock, item.q));
}

// Build Weimar & Nazi Germany
for (const [lessonId, qList] of Object.entries(weimarMapping)) {
  finalDatabase.weimar_nazi_germany[lessonId] = qList.map(item => {
    if (item.canonical) {
      return extractCanonicalWeimarQuestion(lessonId, item.index);
    } else {
      return extractWeimarQuestionDetails(item.mock, item.q);
    }
  }).filter(Boolean);
}

const fileContent = `/**
 * src/engine/mock_exam_bank_data.js
 *
 * Indexed official GCSE Mock Examination Questions mapped strictly to
 * their culminating syllabus lessons (ensuring pupils have been taught all prerequisite knowledge).
 */

export const UNIT_LESSON_MOCK_QUESTIONS = ${JSON.stringify(finalDatabase, null, 2)};

export function getLessonMockQuestions(unitId, lessonId) {
  if (!unitId || !lessonId) return [];
  const unitMap = UNIT_LESSON_MOCK_QUESTIONS[unitId];
  if (!unitMap) return [];
  return unitMap[lessonId] || [];
}
`;

fs.writeFileSync(path.join(__dirname, '../src/engine/mock_exam_bank_data.js'), fileContent, 'utf8');
console.log('✅ Generated src/engine/mock_exam_bank_data.js successfully with USA and Weimar & Nazi Germany!');
