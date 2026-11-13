const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const medPath = path.join(ROOT_DIR, 'data', 'edexcel_medicine.json');
const med = JSON.parse(fs.readFileSync(medPath, 'utf8'));

// Update lesson_4_4
const l44 = med.lessons.find(l => l.id === 'lesson_4_4');
if (l44 && l44.workbook_stages) {
  // Stage 2
  l44.workbook_stages[1].heading = 'How did Florey and Chain overcome the challenge of purifying penicillin?';
  l44.workbook_stages[1].title = 'Florey & Chain at Oxford';
  l44.workbook_stages[1].focus_clue = 'How did Florey and Chain overcome the challenge of purifying penicillin?';
  l44.workbook_stages[1].bullets = [
    'Florey & Chain (Oxford)',
    'Purifying active penicillin',
    'Norman Heatley apparatus'
  ];
  l44.workbook_stages[1].words = [
    { term: 'Florey & Chain (Oxford)', clue: 'Howard Florey and Ernst Chain assembled a dedicated scientific team at Oxford University in 1938 to investigate penicillin.' },
    { term: 'Purifying active penicillin', clue: 'The team overcame the chemical instability of penicillin, using freeze-drying extraction to produce pure, stable yellow crystals.' },
    { term: 'Norman Heatley apparatus', clue: 'Biochemist Norman Heatley designed specialized ceramic vessels and modified hospital equipment to culture the mold.' }
  ];

  // Stage 4
  l44.workbook_stages[3].heading = 'How did US industrial mass-production transform wartime supply?';
  l44.workbook_stages[3].title = 'US Government & Mass Production';
  l44.workbook_stages[3].focus_clue = 'How did US industrial mass-production transform wartime supply?';
  l44.workbook_stages[3].bullets = [
    'US government funding',
    'Deep fermentation tanks',
    '2.3m D-Day doses'
  ];
  l44.workbook_stages[3].words = [
    { term: 'US government funding', clue: 'The US War Production Board designated penicillin production a top military priority, investing millions of dollars in pharmaceutical manufacturing.' },
    { term: 'Deep fermentation tanks', clue: 'American factories built giant 10,000-gallon deep-aeration fermentation tanks to culture massive quantities of mold.' },
    { term: '2.3m D-Day doses', clue: 'US industrial mass-production generated 2.3 million doses in time for Allied forces invading Normandy on D-Day in June 1944.' }
  ];
}

// Update lesson_4_1
const l41 = med.lessons.find(l => l.id === 'lesson_4_1');
if (l41 && l41.workbook_stages) {
  l41.workbook_stages[0].heading = 'Why did early doctors struggle to explain hereditary traits?';
  l41.workbook_stages[0].focus_clue = 'Why did early doctors struggle to explain hereditary traits?';
  l41.workbook_stages[0].bullets = [
    'Gregor Mendel genetics',
    'Chromosomes observed',
    'Unknown hereditary mechanism'
  ];
}

// Update lesson_4_5
const l45 = med.lessons.find(l => l.id === 'lesson_4_5');
if (l45 && l45.workbook_stages) {
  l45.workbook_stages[3].bullets = [
    'Tumour DNA sequencing',
    'Targeted pharmacotherapy',
    'Targeted immunotherapy'
  ];
}

fs.writeFileSync(medPath, JSON.stringify(med, null, 2), 'utf8');
console.log('Successfully updated data/edexcel_medicine.json for modern medicine lessons!');

