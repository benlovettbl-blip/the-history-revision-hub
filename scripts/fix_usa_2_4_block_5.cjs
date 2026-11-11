const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Projects/the-history-revision-hub';

const newBlock5 = {
  title: "The Assassination of Dr Martin Luther King Jr. (4 April 1968)",
  theme_heading: "The Assassination of Dr Martin Luther King Jr. (4 April 1968)",
  theme: "The Assassination of Dr Martin Luther King Jr. (4 April 1968)",
  text: `<span class="para-ref">[5.1]</span> **The Assassination of Dr King (4 April 1968):** In April 1968, Dr Martin Luther King Jr. visited Memphis, Tennessee, to support striking Black sanitation workers. On 4 April 1968, while standing on the balcony of the Lorraine Motel, King was shot and assassinated by James Earl Ray. King's murder ignited the greatest wave of social unrest in modern American history.<br><br><span class="para-ref">[5.2]</span> **Nationwide Riots & The Fair Housing Act:** Riots erupted across more than 125 cities, leaving 46 dead and requiring 45,000 national guardsmen to restore order. In response to the crisis, President Lyndon B. Johnson signed the Civil Rights Act of 1968 (the Fair Housing Act), banning racial discrimination in the sale and rental of housing.`,
  content: `<span class="para-ref">[5.1]</span> **The Assassination of Dr King (4 April 1968):** In April 1968, Dr Martin Luther King Jr. visited Memphis, Tennessee, to support striking Black sanitation workers. On 4 April 1968, while standing on the balcony of the Lorraine Motel, King was shot and assassinated by James Earl Ray. King's murder ignited the greatest wave of social unrest in modern American history.<br><br><span class="para-ref">[5.2]</span> **Nationwide Riots & The Fair Housing Act:** Riots erupted across more than 125 cities, leaving 46 dead and requiring 45,000 national guardsmen to restore order. In response to the crisis, President Lyndon B. Johnson signed the Civil Rights Act of 1968 (the Fair Housing Act), banning racial discrimination in the sale and rental of housing.`
};

function applyFix(lessons) {
  const l = lessons.find(x => x.id === 'lesson_2_4');
  if (l && l.narrative_blocks && l.narrative_blocks[4]) {
    const b = l.narrative_blocks[4];
    b.title = newBlock5.title;
    b.theme_heading = newBlock5.theme_heading;
    b.theme = newBlock5.theme;
    b.text = newBlock5.text;
    b.content = newBlock5.content;
  }
}

// 1. data/usa.json
const jsonPath = path.join(ROOT, 'data/usa.json');
const usaData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
applyFix(usaData.lessons);
fs.writeFileSync(jsonPath, JSON.stringify(usaData, null, 2), 'utf8');

// 2. public/data/usa.json
const pubJsonPath = path.join(ROOT, 'public/data/usa.json');
if (fs.existsSync(pubJsonPath)) {
  fs.writeFileSync(pubJsonPath, JSON.stringify(usaData, null, 2), 'utf8');
}

// 3. units/usa/data.js
const unitJsPath = path.join(ROOT, 'units/usa/data.js');
if (fs.existsSync(unitJsPath)) {
  fs.writeFileSync(unitJsPath, 'window.unitData = ' + JSON.stringify(usaData, null, 2) + ';\nif (typeof module !== "undefined") { module.exports = window.unitData; }\n', 'utf8');
}

// 4. public/units/usa/data.js
const pubUnitJsPath = path.join(ROOT, 'public/units/usa/data.js');
if (fs.existsSync(pubUnitJsPath)) {
  fs.writeFileSync(pubUnitJsPath, 'window.unitData = ' + JSON.stringify(usaData, null, 2) + ';\nif (typeof module !== "undefined") { module.exports = window.unitData; }\n', 'utf8');
}

// 5. database.json & public/database.json
[path.join(ROOT, 'database.json'), path.join(ROOT, 'public/database.json')].forEach(p => {
  if (!fs.existsSync(p)) return;
  const db = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (db.usa && db.usa.data && db.usa.data.lessons) {
    applyFix(db.usa.data.lessons);
    fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
  } else if (db.usa && db.usa.lessons) {
    applyFix(db.usa.lessons);
    fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
  }
});

console.log('Fixed lesson_2_4 Block 5 across all 5 USA stores!');

