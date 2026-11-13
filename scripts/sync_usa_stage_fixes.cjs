const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const usaPath = path.join(ROOT_DIR, 'data', 'usa.json');
const usa = JSON.parse(fs.readFileSync(usaPath, 'utf8'));
const { USA_ENQUIRY_CONFIGS } = require('./components/usa_enquiry_configs.cjs');

// Update lesson_2_4
const l24 = usa.lessons.find(l => l.id === 'lesson_2_4');
const c24 = USA_ENQUIRY_CONFIGS.KT2.find(c => c.id === 'lesson_2_4');
c24.stages.forEach((st, idx) => {
  l24.workbook_stages[idx].heading = st.title;
  l24.workbook_stages[idx].title = st.title;
  l24.workbook_stages[idx].focus_clue = st.focusClue;
  l24.workbook_stages[idx].bullets = st.bullets;
  l24.workbook_stages[idx].words = st.bullets.map(b => ({ term: b, clue: b }));
  l24.workbook_stages[idx].key_terms = st.bullets.map(b => ({ term: b, clue: b }));
});

// Update lesson_3_2
const l32 = usa.lessons.find(l => l.id === 'lesson_3_2');
const c32 = USA_ENQUIRY_CONFIGS.KT3.find(c => c.id === 'lesson_3_2');
c32.stages.forEach((st, idx) => {
  l32.workbook_stages[idx].heading = st.title;
  l32.workbook_stages[idx].title = st.title;
  l32.workbook_stages[idx].focus_clue = st.focusClue;
  l32.workbook_stages[idx].bullets = st.bullets;
  l32.workbook_stages[idx].words = st.bullets.map(b => ({ term: b, clue: b }));
  l32.workbook_stages[idx].key_terms = st.bullets.map(b => ({ term: b, clue: b }));
});

// Update lesson_3_3
const l33 = usa.lessons.find(l => l.id === 'lesson_3_3');
const c33 = USA_ENQUIRY_CONFIGS.KT3.find(c => c.id === 'lesson_3_3');
c33.stages.forEach((st, idx) => {
  l33.workbook_stages[idx].heading = st.title;
  l33.workbook_stages[idx].title = st.title;
  l33.workbook_stages[idx].focus_clue = st.focusClue;
  l33.workbook_stages[idx].bullets = st.bullets;
  l33.workbook_stages[idx].words = st.bullets.map(b => ({ term: b, clue: b }));
  l33.workbook_stages[idx].key_terms = st.bullets.map(b => ({ term: b, clue: b }));
});

// Update lesson_4_4
const l44 = usa.lessons.find(l => l.id === 'lesson_4_4');
l44.narrative_blocks[2].title = 'Vietnamese Revolutionary Nationalism & Asymmetric Will';
l44.narrative_blocks[2].text = '<span class="para-ref">[3.1]</span> **Vietnamese Revolutionary Nationalism:** The primary reason for American defeat was the extraordinary national determination and asymmetric political will of the Vietnamese communists. Fighting on their own sacred ancestral homeland, the Vietcong and North Vietnamese Army (PAVN) viewed the conflict as an existential struggle for national liberation and unification after a century of French and Japanese colonial rule. Inspired by Ho Chi Minh and communist ideology, they were willing to absorb immense physical punishment and sacrifice millions of lives to outlast the foreign invader. In contrast, the US was waging a limited foreign intervention with divided domestic public support.';

l44.narrative_blocks[3].title = 'Failure of Industrial Military Tactics & Corruption in Saigon';
l44.narrative_blocks[3].text = '<span class="para-ref">[4.1]</span> **Military Inadequacy and Political Illegitimacy:** Second, **Failure of Conventional Tactics:** American high command relied on heavy industrial firepower, Search and Destroy operations, chemical defoliation, and massive aerial bombing. These tactics alienated the rural South Vietnamese peasantry, driving hundreds of thousands into the arms of the Vietcong, while completely failing to sever the underground tunnel complexes or the resilient Ho Chi Minh Trail. Third, **The Corruption of the Saigon Regime:** The South Vietnamese government remained an unpopular, authoritarian, and corrupt military junta that lacked genuine legitimacy among its own civilian population, leaving the ARVN brittle and prone to collapse without direct American air support.';

fs.writeFileSync(usaPath, JSON.stringify(usa, null, 2), 'utf8');
console.log('Successfully synced data/usa.json with realigned stages and blocks!');

