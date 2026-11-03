const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log('Generating src/engine/mock_exam_bank_data.js from official mock papers...');

// Lesson mapping table for USA Option 33
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
const mockCache = {};

function getMockData(mockId) {
  if (mockCache[mockId]) return mockCache[mockId];

  const qpPath = path.join(__dirname, `../public/units/usa/${mockId}_question_booklet.html`);
  const sbPath = path.join(__dirname, `../public/units/usa/${mockId}_sources_booklet.html`);
  const msPath = path.join(__dirname, `../public/units/usa/${mockId}_mark_scheme.html`);

  const qpHtml = fs.existsSync(qpPath) ? fs.readFileSync(qpPath, 'utf8') : '';
  const sbHtml = fs.existsSync(sbPath) ? fs.readFileSync(sbPath, 'utf8') : '';
  const msHtml = fs.existsSync(msPath) ? fs.readFileSync(msPath, 'utf8') : '';

  const qpDom = new JSDOM(qpHtml);
  const sbDom = new JSDOM(sbHtml);
  const msDom = new JSDOM(msHtml);

  mockCache[mockId] = { qpDom, sbDom, msDom, qpHtml, sbHtml, msHtml };
  return mockCache[mockId];
}

function extractQuestionDetails(mockId, qCode) {
  const { qpDom, sbDom, msDom, qpHtml, sbHtml, msHtml } = getMockData(mockId);
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

const finalDatabase = {
  usa: {}
};

for (const [lessonId, qList] of Object.entries(usaMapping)) {
  finalDatabase.usa[lessonId] = qList.map(item => extractQuestionDetails(item.mock, item.q));
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
console.log('✅ Generated src/engine/mock_exam_bank_data.js successfully!');
