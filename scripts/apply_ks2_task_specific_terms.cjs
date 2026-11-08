/**
 * apply_ks2_task_specific_terms.cjs
 * Equips every task in KS2 WW2 with dedicated, strictly relevant key_terms
 * eliminating irrelevant terms (like Neville Chamberlain on gas mask drills or blackouts).
 */

const fs = require('fs');
const path = require('path');

const TASK_SPECIFIC_TERMS = [
  // Lesson 1
  [
    ["rubber facepiece", "eyepieces", "gas mask drill"],
    ["poison gas", "38 million", "shoulder strap"],
    ["blackout curtains", "ARP warden", "light leak"],
    ["gas mask box", "blackout", "air raid drills"]
  ],
  // Lesson 2
  [
    ["luggage label", "identification", "pinned to coat"],
    ["countryside station", "billeting officer", "homesickness"],
    ["village hall", "foster family", "standing in line"],
    ["Operation Pied Piper", "evacuees", "separation"]
  ],
  // Lesson 3
  [
    ["identity card", "ship gangway", "passenger manifest"],
    ["small suitcase", "family photograph", "keepsakes"],
    ["foster family", "£50 guarantee", "compassion"],
    ["Kindertransport", "refugee children", "humanitarian rescue"]
  ],
  // Lesson 4
  [
    ["Anderson shelter", "corrugated steel", "earth and turf"],
    ["woollen blankets", "paraffin heater", "falling bombs"],
    ["Underground platform", "sheltering", "camaraderie"],
    ["The Blitz", "civilian resilience", "Blitz spirit"]
  ],
  // Lesson 5
  [
    ["Dig for Victory", "allotments", "propaganda poster"],
    ["ration book", "weekly coupons", "Woolton Pie"],
    ["wasting food", "merchant ships", "U-boat blockade"],
    ["fair shares for all", "rationing system", "public health"]
  ],
  // Lesson 6
  [
    ["Land Girls", "practical uniform", "outdoor farmwork"],
    ["Spitfire assembly", "munitions factory", "engineering skills"],
    ["farm barn", "early morning", "hard physical labour"],
    ["women's mobilization", "Home Front", "wartime industry"]
  ],
  // Lesson 7
  [
    ["football team", "ordinary childhood", "friendship"],
    ["pre-war life", "human dignity", "restoring identity"],
    ["anti-Jewish laws", "school ban", "isolation"],
    ["step-by-step discrimination", "civil rights", "escalation"]
  ],
  // Lesson 8
  [
    ["Enigma machine", "rotor wheels", "cipher combinations"],
    ["Alan Turing", "Bombe machine", "rapid computing"],
    ["Official Secrets Act", "wooden huts", "decades of silence"],
    ["Ultra intelligence", "Battle of the Atlantic", "shortened the war"]
  ],
  // Lesson 9
  [
    ["Nicholas Winton", "moral courage", "rescue initiative"],
    ["leather scrapbook", "foster records", "saving 669 children"],
    ["upstander", "bystander", "taking action"],
    ["ordinary heroes", "Trevor Chadwick", "standing up to injustice"]
  ],
  // Lesson 10
  [
    ["Trafalgar Square", "VE Day crowd", "collective relief"],
    ["street parties", "empty chairs", "personal loss"],
    ["post-war rationing", "rebuilding cities", "bankruptcy"],
    ["sacrifices", "remembrance", "democratic freedoms"]
  ],
  // Lesson 11
  [
    ["RAF bombers", "child survivors", "cautious relief"],
    ["liberated orphans", "Kindertransport contrast", "sanctuary"],
    ["Calgarth Estate", "red bicycles", "clean beds"],
    ["Dr Oscar Friedman", "healing trauma", "hope and friendship"]
  ]
];

function run() {
  const dataPath = path.join(__dirname, '..', 'data', 'ks2_ww2.json');
  const pubDataPath = path.join(__dirname, '..', 'public', 'data', 'ks2_ww2.json');
  const unitsDataPath = path.join(__dirname, '..', 'units', 'ks2_ww2', 'data.js');

  const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  raw.lessons.forEach((lesson, lIdx) => {
    if (lIdx < TASK_SPECIFIC_TERMS.length && Array.isArray(lesson.tasks)) {
      lesson.tasks.forEach((task, tIdx) => {
        if (tIdx < TASK_SPECIFIC_TERMS[lIdx].length) {
          task.key_terms = TASK_SPECIFIC_TERMS[lIdx][tIdx];
        }
      });
      console.log(`✅ Lesson ${lIdx + 1} (${lesson.id}) tasks updated with task-specific key_terms.`);
    }
  });

  const updatedJson = JSON.stringify(raw, null, 2);
  fs.writeFileSync(dataPath, updatedJson, 'utf8');
  fs.writeFileSync(pubDataPath, updatedJson, 'utf8');

  const unitsDataJs = `window.ks2Ww2Data = ${updatedJson};\nif (typeof module !== 'undefined') { module.exports = window.ks2Ww2Data; }`;
  fs.writeFileSync(unitsDataPath, unitsDataJs, 'utf8');

  // Also sync into database.json, public/database.json, dist/database.json
  const dbPaths = [
    path.join(__dirname, '..', 'database.json'),
    path.join(__dirname, '..', 'public', 'database.json'),
    path.join(__dirname, '..', 'dist', 'database.json')
  ];

  dbPaths.forEach(p => {
    if (fs.existsSync(p)) {
      const db = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (db.ks2_ww2) {
        db.ks2_ww2 = raw;
        fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
        console.log(`✅ Synced updated ks2_ww2 into ${p}`);
      }
    }
  });

  console.log('✨ All files updated with task-specific key terms!');
}

run();

