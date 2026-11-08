const fs = require('fs');
const path = require('path');

console.log('--- APPLYING SYSTEMIC SOURCE FIDELITY REFINEMENTS ---');

// 1. USA Refinements
const usaPath = path.join(__dirname, '..', 'data', 'usa.json');
const usa = JSON.parse(fs.readFileSync(usaPath, 'utf8'));

const usaL44 = usa.lessons.find(l => l.id === 'lesson_4_4');
if (usaL44) {
  const act3 = usaL44.narrative_blocks.find(b => b.act === 3);
  if (act3) {
    act3.caption = 'Plate 4.8: Exhausted American troops bogged down in hostile jungle terrain, resting against a tree line during a protracted search-and-destroy mission (1968).';
  }
  const srcA = usaL44.sources.find(s => s.id === 'usa_lesson_4_4_a');
  if (srcA) {
    srcA.caption = 'A young, exhausted US soldier patrolling through a swampy drainage canal in the Mekong Delta, resting in the mud following an intense firefight with Vietcong insurgents (1968).';
  }
}
fs.writeFileSync(usaPath, JSON.stringify(usa, null, 2), 'utf8');
console.log('✅ USA refinements applied.');

// 2. Medicine Refinements
const medPath = path.join(__dirname, '..', 'data', 'edexcel_medicine.json');
const med = JSON.parse(fs.readFileSync(medPath, 'utf8'));

// L1.5 Black death
const medL15 = med.lessons.find(l => l.id === 'lesson_1_5');
if (medL15) {
  const srcB = medL15.sources.find(s => s.id === 'med_l5_source_b');
  if (srcB) {
    srcB.caption = 'Woodcut illustrating a bedridden Black Death plague patient covered in dark pustules, with large inflamed buboes examined by physicians wearing protective gloves (1497).';
  }
}

// L5.2 Ramparts
const medL52 = med.lessons.find(l => l.id === 'lesson_5_2');
if (medL52) {
  const srcC = medL52.sources.find(s => s.id === 'med_l22_source_c');
  if (srcC) {
    srcC.caption = 'British wounded soldiers attended by RAMC medical staff outside an Advanced Dressing Station sheltered behind the earthwork ramparts near Boesinghe during the Battle of Pilckem Ridge (Passchendaele, 31 July 1917).';
  }
}

// L5.3 Shrapnel X-ray
const medL53 = med.lessons.find(l => l.id === 'lesson_5_3');
if (medL53) {
  const srcC = medL53.sources.find(s => s.id === 'med_l23_source_c');
  if (srcC) {
    srcC.caption = 'Clinical radiograph and diagnostic X-ray demonstrating metallic shrapnel bullet localisation within the cranium of a living soldier using a lead-wire localisation cage (RAMC, c.1916).';
  }
}
fs.writeFileSync(medPath, JSON.stringify(med, null, 2), 'utf8');
console.log('✅ Medicine refinements applied.');

// 3. CME Refinements
const cmePath = path.join(__dirname, '..', 'data', 'cme_new.json');
const cme = JSON.parse(fs.readFileSync(cmePath, 'utf8'));

// L3 Palestine 1949 map
const cmeL3 = cme.lessons.find(l => l.id === 'lesson_3');
if (cmeL3) {
  const srcC = cmeL3.sources.find(s => s.id === 'cme_l3_source_c');
  if (srcC) {
    srcC.caption = 'Cartographic map of former mandatory Palestine depicting the 1949 Armistice Agreements (Green Line): Israel expanded to 78% of the territory, while Jordan annexed the West Bank and Egypt administered the Gaza Strip.';
  }
}

// L7 Sinai peninsula & Tiran
const cmeL7 = cme.lessons.find(l => l.id === 'lesson_7');
if (cmeL7) {
  const srcB = cmeL7.sources.find(s => s.id === 'cme_l7_source_b');
  if (srcB) {
    srcB.caption = 'Strategic map of the Sinai Peninsula highlighting the maritime choke point at the Straits of Tiran and Sharm el-Sheikh, where Egyptian forces blockaded Israeli shipping in May 1967.';
  }
}

// L8 Palestine 1967 & Bar-Lev line
const cmeL8 = cme.lessons.find(l => l.id === 'lesson_8');
if (cmeL8) {
  const srcB = cmeL8.sources.find(s => s.id === 'cme_l8_source_b');
  if (srcB) {
    srcB.caption = 'Israeli military command map of mandatory Palestine territories detailing the administrative sub-districts (Jenin, Nablus, Ramallah, Hebron) established in the West Bank following the Six-Day War (1968).';
  }
}

// L10 Bar-Lev line breach (differentiation from L8)
const cmeL10 = cme.lessons.find(l => l.id === 'lesson_10');
if (cmeL10) {
  const srcA = cmeL10.sources.find(s => s.id === 'cme_l10_source_a');
  if (srcA) {
    srcA.caption = 'Tactical engineering blueprint of the Bar-Lev Line fortifications along the Suez Canal breached by Egyptian forces during Operation Badr on 6 October 1973, overcoming the massive sand ramparts with high-pressure water monitors.';
  }
}

fs.writeFileSync(cmePath, JSON.stringify(cme, null, 2), 'utf8');
console.log('✅ CME refinements applied.');

