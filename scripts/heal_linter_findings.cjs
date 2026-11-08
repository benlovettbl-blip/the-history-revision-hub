const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');

// 1. Cold War Lesson 3 Source Utility data
const coldWarSourceA = {
  title: "Source A: Speech by Foreign Secretary Ernest Bevin to the House of Commons (30 June 1948)",
  badge: "Official Parliamentary Record • 1948",
  author: "Ernest Bevin, British Foreign Secretary, addressing Parliament (30 June 1948)",
  text: "The House will be aware of the grave situation which has arisen in Berlin. The Soviet authorities have cut off all rail and road traffic between the Western zones and Berlin. His Majesty's Government cannot be forced out of Berlin by starvation or coercion. We have put into operation an organized air service to carry essential flour, wheat, and coal into the British and American sectors. We are determined to prevent the 2.5 million inhabitants of West Berlin from being starved into political surrender."
};

const coldWarSourceB = {
  title: "Source B: Political Cartoon by David Low, Evening Standard (July 1948)",
  badge: "British Political Cartoon • 1948",
  author: "David Low, Evening Standard, London (July 1948)",
  text: "[Visual Cartoon: Depicts a massive Soviet barricade across the land highway to Berlin, while overhead, an unbroken stream of British and American cargo aircraft flies directly over the blockade carrying coal, flour, and medical supplies into Tempelhof Airport, leaving Soviet guards watching helplessly below.]"
};

// 2. Medieval England Lesson 2 Two Features model answer
const medievalFeaturesModel = "One key feature of Norman motte-and-bailey castles was the motte, an artificial raised earthen mound topped by a fortified wooden keep [2.1]. This elevated tower served as an impenetrable observation post and final military stronghold, allowing a small garrison of Norman knights to command the surrounding Saxon countryside.<br><br>A second key feature was the bailey, an enclosed courtyard at the base of the motte surrounded by a deep ditch and timber palisade [2.1]. The bailey housed essential military and living infrastructure, including barracks, stables, livestock, and workshops, enabling the garrison to withstand prolonged sieges and launch rapid counter-attacks.";

function patchTask(task) {
  let changed = false;
  if (task.id === 'cold_war_l3_source_utility_berlin_blockade') {
    task.source_a = coldWarSourceA;
    task.source_b = coldWarSourceB;
    task.sourceA = coldWarSourceA;
    task.sourceB = coldWarSourceB;
    changed = true;
  }
  if (task.id === 'me_l2_q1_features') {
    task.model_answer = medievalFeaturesModel;
    task.model = medievalFeaturesModel;
    changed = true;
  }
  return changed;
}

function patchUnit(unitData) {
  let changed = false;
  const lessons = unitData.lessons || (unitData.curriculum && unitData.curriculum.lessons) || [];
  lessons.forEach(l => {
    (l.tasks || []).forEach(t => {
      if (patchTask(t)) changed = true;
    });
  });
  return changed;
}

// 1. Update data/*.json and public/data/*.json
['data', 'public/data'].forEach(subDir => {
  ['cold_war.json', 'medieval_england.json'].forEach(fName => {
    const p = path.join(repoRoot, subDir, fName);
    if (fs.existsSync(p)) {
      const json = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (patchUnit(json)) {
        fs.writeFileSync(p, JSON.stringify(json, null, 2), 'utf8');
        console.log(`Patched ${subDir}/${fName}`);
      }
    }
  });
});

// 2. Update database.json and public/database.json
['database.json', 'public/database.json'].forEach(relPath => {
  const p = path.join(repoRoot, relPath);
  if (fs.existsSync(p)) {
    const json = JSON.parse(fs.readFileSync(p, 'utf8'));
    let changed = false;
    if (json.cold_war && patchUnit(json.cold_war)) changed = true;
    if (json.medieval_england && patchUnit(json.medieval_england)) changed = true;
    if (changed) {
      fs.writeFileSync(p, JSON.stringify(json, null, 2), 'utf8');
      console.log(`Patched ${relPath}`);
    }
  }
});

// 3. Update units/*/data.js and public/units/*/data.js
['units', 'public/units'].forEach(subDir => {
  ['cold_war', 'medieval_england'].forEach(uKey => {
    const p = path.join(repoRoot, subDir, uKey, 'data.js');
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      const jsonMatch = content.match(/window\.\w+\s*=\s*(\{[\s\S]*\});?\s*$/);
      if (jsonMatch) {
        try {
          const unitObj = JSON.parse(jsonMatch[1]);
          if (patchUnit(unitObj)) {
            const prefix = content.slice(0, content.indexOf(jsonMatch[1]));
            fs.writeFileSync(p, `${prefix}${JSON.stringify(unitObj, null, 2)};\n`, 'utf8');
            console.log(`Patched ${subDir}/${uKey}/data.js`);
          }
        } catch (e) {
          console.error(`Error parsing ${subDir}/${uKey}/data.js:`, e.message);
        }
      }
    }
  });
});

console.log('Done applying surgical patches for linter findings!');

