const fs = require('fs');
const path = require('path');

// 1. Medicine: med_l5_source_a (Black Death)
const medPath = path.join(__dirname, '..', 'data', 'edexcel_medicine.json');
const med = JSON.parse(fs.readFileSync(medPath, 'utf8'));
const medL15 = med.lessons.find(l => l.id === 'lesson_1_5');
if (medL15) {
  const srcA = medL15.sources.find(s => s.id === 'med_l5_source_a');
  if (srcA) {
    srcA.caption = 'Woodcut illustrating a bedridden Black Death plague patient covered in dark pustules, with large inflamed buboes visible in the groin and armpit, attended by a physician and weeping relatives (1497).';
    console.log('Fixed Medicine Black Death caption.');
  }
}
fs.writeFileSync(medPath, JSON.stringify(med, null, 2), 'utf8');

// 2. CME: Swap L7 Act 2 and Act 4 images, refine L8 and L10 Bar-Lev captions
const cmePath = path.join(__dirname, '..', 'data', 'cme_new.json');
const cme = JSON.parse(fs.readFileSync(cmePath, 'utf8'));

const cmeL7 = cme.lessons.find(l => l.id === 'lesson_7');
if (cmeL7) {
  const act2 = cmeL7.narrative_blocks.find(b => b.act === 2);
  const act4 = cmeL7.narrative_blocks.find(b => b.act === 4);
  if (act2 && act4) {
    act2.image = '/units/cme_new/assets/cme_sinai_peninsula_map.jpg';
    act2.caption = 'Strategic cartographic map of the Sinai Peninsula and the Straits of Tiran at Sharm el-Sheikh, where Egyptian forces evicted UN peacekeepers and imposed a naval blockade against Israel in May 1967.';

    act4.image = '/images/cme_six_day_war_airfield_1967.jpg';
    act4.caption = 'Operation Focus (5 June 1967): Israeli Air Force pre-emptive air strike destroying Egyptian combat aircraft on their airfield runways in the opening hours of the Six-Day War.';
    console.log('Fixed CME L7 Act 2 and Act 4 image swap.');
  }

  const srcB = cmeL7.sources.find(s => s.id === 'cme_l6_source_b');
  if (srcB) {
    srcB.caption = 'Strategic cartographic map of the Sinai Peninsula and Straits of Tiran, highlighting the maritime blockade at Sharm el-Sheikh that triggered the June 1967 war.';
    console.log('Fixed CME L7 Source B caption.');
  }
}

const cmeL8 = cme.lessons.find(l => l.id === 'lesson_8');
if (cmeL8) {
  const srcB = cmeL8.sources.find(s => s.id === 'cme_l7_source_b');
  if (srcB) {
    srcB.caption = 'Israeli military command map of former mandatory Palestine territories, detailing the administrative sub-districts established in the West Bank following the 1967 war.';
    console.log('Fixed CME L8 Source B caption.');
  }
}

const cmeL10 = cme.lessons.find(l => l.id === 'lesson_10');
if (cmeL10) {
  const srcA = cmeL10.sources.find(s => s.id === 'cme_l9_source_a');
  if (srcA) {
    srcA.caption = 'Tactical engineering blueprint of the Bar-Lev Line fortifications along the Suez Canal, breached by Egyptian troops during Operation Badr on 6 October 1973 with high-pressure water monitors.';
    console.log('Fixed CME L10 Source A Bar-Lev caption.');
  }
}

fs.writeFileSync(cmePath, JSON.stringify(cme, null, 2), 'utf8');
console.log('✅ Applied all Medicine & CME fixes.');

