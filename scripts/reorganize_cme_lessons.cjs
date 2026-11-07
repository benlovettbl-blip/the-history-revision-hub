const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'units', 'cme_new', 'data.js');
const publicFilePath = path.join(__dirname, '..', 'public', 'units', 'cme_new', 'data.js');

let code = fs.readFileSync(filePath, 'utf8');

// 1. Remove exam_clinic and exam_practice from Lesson 0
// First, extract the clinic questions from Lesson 0
const data = require(filePath).default || require(filePath);
const l0Clinic = data.lessons[0].exam_clinic || [];

// Lesson IDs replacements
const idReplacements = [
  {
    target: '      "id": "lesson_1",\n      "specification_anchor": "The birth of the state of Israel and the 1948–49 War: historical background',
    replacement: '      "id": "lesson_0",\n      "alias_ids": ["lesson_0", "lesson_0_intro", "intro", "lesson_1_1"],\n      "specification_anchor": "The birth of the state of Israel and the 1948–49 War: historical background'
  },
  {
    target: '      "id": "lesson_2",\n      "specification_anchor": "The birth of the state of Israel and the 1948–49 War: the British withdrawal',
    replacement: '      "id": "lesson_1",\n      "alias_ids": ["lesson_2", "lesson_1_2"],\n      "specification_anchor": "The birth of the state of Israel and the 1948–49 War: the British withdrawal'
  },
  {
    target: '      "id": "lesson_3",\n      "specification_anchor": "The birth of the state of Israel and the 1948–49 War: the Arab-Israeli War of 1948–49',
    replacement: '      "id": "lesson_2",\n      "alias_ids": ["lesson_3", "lesson_1_3"],\n      "specification_anchor": "The birth of the state of Israel and the 1948–49 War: the Arab-Israeli War of 1948–49'
  },
  {
    target: '      "id": "lesson_4",\n      "specification_anchor": "The birth of the state of Israel and the 1948–49 War: the Suez Crisis',
    replacement: '      "id": "lesson_3",\n      "alias_ids": ["lesson_4", "lesson_1_4"],\n      "specification_anchor": "The birth of the state of Israel and the 1948–49 War: the Suez Crisis'
  },
  {
    target: '      "id": "lesson_6",\n      "specification_anchor": "The escalating conflict, 1956–73: rising tensions and causes of the 1967 War',
    replacement: '      "id": "lesson_4",\n      "alias_ids": ["lesson_6", "lesson_2_1"],\n      "specification_anchor": "The escalating conflict, 1956–73: rising tensions and causes of the 1967 War'
  },
  {
    target: '      "id": "lesson_7",\n      "specification_anchor": "The escalating conflict, 1956–73: the course of the Six-Day War',
    replacement: '      "id": "lesson_5",\n      "alias_ids": ["lesson_7", "lesson_2_2"],\n      "specification_anchor": "The escalating conflict, 1956–73: the course of the Six-Day War'
  },
  {
    target: '      "id": "lesson_8",\n      "specification_anchor": "The escalating conflict, 1956–73: consequences of the 1967 War',
    replacement: '      "id": "lesson_6",\n      "alias_ids": ["lesson_8", "lesson_2_3"],\n      "specification_anchor": "The escalating conflict, 1956–73: consequences of the 1967 War'
  },
  {
    target: '      "id": "lesson_9",\n      "specification_anchor": "The escalating conflict, 1956–73: Palestinian nationalism and resistance',
    replacement: '      "id": "lesson_7",\n      "alias_ids": ["lesson_9", "lesson_2_4"],\n      "specification_anchor": "The escalating conflict, 1956–73: Palestinian nationalism and resistance'
  },
  {
    target: '      "id": "lesson_10",\n      "specification_anchor": "The escalating conflict, 1956–73: the Yom Kippur War',
    replacement: '      "id": "lesson_8",\n      "alias_ids": ["lesson_10", "lesson_2_5"],\n      "specification_anchor": "The escalating conflict, 1956–73: the Yom Kippur War'
  },
  {
    target: '      "id": "lesson_11",\n      "specification_anchor": "Attempts at peace, 1974–95: search for peace after 1973',
    replacement: '      "id": "lesson_9",\n      "alias_ids": ["lesson_11", "lesson_3_1"],\n      "specification_anchor": "Attempts at peace, 1974–95: search for peace after 1973'
  },
  {
    target: '      "id": "lesson_12",\n      "specification_anchor": "Attempts at peace, 1974–95: continuing conflict and the Palestinian question',
    replacement: '      "id": "lesson_10",\n      "alias_ids": ["lesson_12", "lesson_3_2"],\n      "specification_anchor": "Attempts at peace, 1974–95: continuing conflict and the Palestinian question'
  },
  {
    target: '      "id": "lesson_13",\n      "specification_anchor": "Attempts at peace, 1974–95: peace process in the 1990s',
    replacement: '      "id": "lesson_11",\n      "alias_ids": ["lesson_13", "lesson_3_3"],\n      "specification_anchor": "Attempts at peace, 1974–95: peace process in the 1990s'
  }
];

let replacedCount = 0;
idReplacements.forEach((rep, idx) => {
  if (code.includes(rep.target)) {
    code = code.replace(rep.target, rep.replacement);
    replacedCount++;
  } else {
    console.error(`Target ${idx} not found!`);
  }
});

console.log(`Replaced ${replacedCount} / ${idReplacements.length} lesson IDs and added aliases.`);

// Now remove exam_clinic and exam_practice from Lesson 0
// In lesson 0, exam_clinic begins after the vocabulary block
const clinicStart = code.indexOf('      "exam_clinic": [\n        {\n          "question": "Explain the importance of the Suez Canal');
const clinicEnd = code.indexOf('      "enquiry": "Water, Faith, and Imperial Rulers:');

if (clinicStart !== -1 && clinicEnd !== -1 && clinicStart < clinicEnd) {
  code = code.slice(0, clinicStart) + code.slice(clinicEnd);
  console.log('Successfully removed exam_clinic from Lesson 0.');
} else {
  console.error('Could not locate exam_clinic bounds in Lesson 0!');
}

// In lesson 0, exam_practice begins after hook_text and ends before primary_source
const practiceStart = code.indexOf('      "exam_practice": {\n        "type": "consequence_and_extended"');
const practiceEnd = code.indexOf('      "primary_source": {\n        "title": "Source A: The Sykes-Picot');

if (practiceStart !== -1 && practiceEnd !== -1 && practiceStart < practiceEnd) {
  code = code.slice(0, practiceStart) + code.slice(practiceEnd);
  console.log('Successfully removed exam_practice from Lesson 0.');
} else {
  console.error('Could not locate exam_practice bounds in Lesson 0!');
}

fs.writeFileSync(filePath, code, 'utf8');
fs.writeFileSync(publicFilePath, code, 'utf8');

console.log('Successfully updated units/cme_new/data.js and public/units/cme_new/data.js');

