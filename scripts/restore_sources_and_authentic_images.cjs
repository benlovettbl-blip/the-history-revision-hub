const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function syncUnitToAllLayers(unitId, updateFn) {
  const dataPath = path.join(ROOT, 'data', `${unitId}.json`);
  const publicDataPath = path.join(ROOT, 'public', 'data', `${unitId}.json`);
  let unitData = null;

  if (fs.existsSync(dataPath)) {
    unitData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    updateFn(unitData);
    fs.writeFileSync(dataPath, JSON.stringify(unitData, null, 2), 'utf8');
    console.log(`✅ Updated data/${unitId}.json`);
  }

  if (fs.existsSync(publicDataPath)) {
    const pubData = JSON.parse(fs.readFileSync(publicDataPath, 'utf8'));
    updateFn(pubData);
    fs.writeFileSync(publicDataPath, JSON.stringify(pubData, null, 2), 'utf8');
    console.log(`✅ Updated public/data/${unitId}.json`);
  }

  ['database.json', 'public/database.json'].forEach(rel => {
    const fp = path.join(ROOT, rel);
    if (fs.existsSync(fp)) {
      const db = JSON.parse(fs.readFileSync(fp, 'utf8'));
      const target = db.units ? db.units[unitId] : db[unitId];
      if (target) {
        updateFn(target);
        fs.writeFileSync(fp, JSON.stringify(db, null, 2), 'utf8');
        console.log(`✅ Updated ${rel} [${unitId}]`);
      }
    }
  });

  const unitsDataJs = path.join(ROOT, 'units', unitId, 'data.js');
  if (fs.existsSync(unitsDataJs) && unitData) {
    fs.writeFileSync(unitsDataJs, 'export default ' + JSON.stringify(unitData, null, 2) + ';\n', 'utf8');
    console.log(`✅ Updated units/${unitId}/data.js`);
  }
}

// ----------------------------------------------------------------------
// 1. Medieval England: Restore Authentic Sources & Plates for L2, L3, L5
// ----------------------------------------------------------------------
syncUnitToAllLayers('medieval_england', (u) => {
  // --- Lesson 2: Castles, Terror & Domesday ---
  const l2 = u.lessons.find(l => l.id === 'lesson_2');
  if (l2 && l2.sources && l2.sources.length >= 5) {
    const srcMap = {};
    l2.sources.forEach(s => { srcMap[s.id] = s; });

    // Block 1: Motte & Bailey Blitz -> Source A (Berkhamsted)
    if (l2.narrative_blocks[0]) {
      l2.narrative_blocks[0].image = '/images/medieval_england/plate_2_1_bayeux_castle_building.jpg';
      l2.narrative_blocks[0].image_alt = 'Bayeux Tapestry Motte-and-Bailey Construction';
      l2.narrative_blocks[0].caption = 'Scene from the Bayeux Tapestry showing Norman troops constructing a timber motte-and-bailey castle at Hastings.';
      l2.narrative_blocks[0].sources = [srcMap['medieval_england_l2_src_a'] || l2.sources[0]];
    }

    // Block 2: Harrying of the North -> Source C (Peterborough Chronicle)
    if (l2.narrative_blocks[1]) {
      delete l2.narrative_blocks[1].image;
      l2.narrative_blocks[1].sources = [srcMap['medieval_england_l2_src_c'] || l2.sources[2]];
    }

    // Block 3: Stone Keeps & Portchester -> Source D (Portchester Castle)
    if (l2.narrative_blocks[2]) {
      l2.narrative_blocks[2].image = '/images/medieval_england/plate_2_2_portchester_castle_keep.jpg';
      l2.narrative_blocks[2].image_alt = 'Portchester Castle Norman Keep';
      l2.narrative_blocks[2].caption = 'Portchester Castle: The 12th-century limestone keep standing inside the surviving 3rd-century Roman walls.';
      l2.narrative_blocks[2].sources = [srcMap['medieval_england_l2_src_d'] || l2.sources[3]];
    }

    // Block 4: Domesday Book -> Source B (Great Domesday Book Folio)
    if (l2.narrative_blocks[3]) {
      delete l2.narrative_blocks[3].image;
      l2.narrative_blocks[3].sources = [srcMap['medieval_england_l2_src_b'] || l2.sources[1]];
    }

    // Block 5: Feudal System & Great Seal -> Source E (Great Seal of William I)
    if (l2.narrative_blocks[4]) {
      delete l2.narrative_blocks[4].image;
      l2.narrative_blocks[4].sources = [srcMap['medieval_england_l2_src_e'] || l2.sources[4]];
    }
    console.log('  re-linked authentic sources and plates for medieval_england lesson 2');
  }

  // --- Lesson 3: Crown vs Church (Henry II & Becket) ---
  const l3 = u.lessons.find(l => l.id === 'lesson_3');
  if (l3 && l3.sources && l3.sources.length >= 5) {
    const srcMap = {};
    l3.sources.forEach(s => { srcMap[s.id] = s; });

    // Block 1 -> Source A (Henry exiles Becket's kin)
    if (l3.narrative_blocks[0]) {
      delete l3.narrative_blocks[0].image;
      l3.narrative_blocks[0].sources = [srcMap['medieval_england_l3_src_a'] || l3.sources[0]];
    }
    // Block 2 -> Plate 3.1 & Source B (Murder in Cathedral)
    if (l3.narrative_blocks[1]) {
      l3.narrative_blocks[1].image = '/images/medieval_england/plate_3_1_henry_becket_dispute.jpg';
      l3.narrative_blocks[1].sources = [srcMap['medieval_england_l3_src_b'] || l3.sources[1]];
    }
    // Block 3 -> Source C (Becket Excommunicating)
    if (l3.narrative_blocks[2]) {
      delete l3.narrative_blocks[2].image;
      l3.narrative_blocks[2].sources = [srcMap['medieval_england_l3_src_c'] || l3.sources[2]];
    }
    // Block 4 -> Source D (Pilgrim's Ampulla)
    if (l3.narrative_blocks[3]) {
      delete l3.narrative_blocks[3].image;
      l3.narrative_blocks[3].sources = [srcMap['medieval_england_l3_src_d'] || l3.sources[3]];
    }
    // Block 5 -> Plate 3.2 & Source E (Limoges Chasse / Penance)
    if (l3.narrative_blocks[4]) {
      l3.narrative_blocks[4].image = '/images/medieval_england/plate_3_2_henry_ii_penance_becket.jpg';
      l3.narrative_blocks[4].sources = [srcMap['medieval_england_l3_src_e'] || l3.sources[4]];
    }
    console.log('  re-linked authentic sources and plates for medieval_england lesson 3');
  }

  // --- Lesson 5: Black Death & Peasants' Revolt ---
  const l5 = u.lessons.find(l => l.id === 'lesson_5');
  if (l5 && l5.sources && l5.sources.length >= 5) {
    const srcMap = {};
    l5.sources.forEach(s => { srcMap[s.id] = s; });

    // Block 1 -> Plate 5.1 & Source A (Knighton Chronicle)
    if (l5.narrative_blocks[0]) {
      l5.narrative_blocks[0].image = '/images/medieval_england/plate_5_1_black_death_burial.jpg';
      l5.narrative_blocks[0].sources = [srcMap['medieval_england_l5_src_a'] || l5.sources[0]];
    }
    // Block 2 -> Source C (John Ball Preaching)
    if (l5.narrative_blocks[1]) {
      delete l5.narrative_blocks[1].image;
      l5.narrative_blocks[1].sources = [srcMap['medieval_england_l5_src_c'] || l5.sources[2]];
    }
    // Block 3 -> Source D (Richard II Meeting Rebels)
    if (l5.narrative_blocks[2]) {
      delete l5.narrative_blocks[2].image;
      l5.narrative_blocks[2].sources = [srcMap['medieval_england_l5_src_d'] || l5.sources[3]];
    }
    // Block 4 -> Plate 5.2 & Source B (Wat Tyler Smithfield)
    if (l5.narrative_blocks[3]) {
      l5.narrative_blocks[3].image = '/images/medieval_england/plate_5_2_wat_tyler_john_ball.jpg';
      l5.narrative_blocks[3].sources = [srcMap['medieval_england_l5_src_b'] || l5.sources[1]];
    }
    // Block 5 -> Source E (Walworth Dagger)
    if (l5.narrative_blocks[4]) {
      delete l5.narrative_blocks[4].image;
      l5.narrative_blocks[4].sources = [srcMap['medieval_england_l5_src_e'] || l5.sources[4]];
    }
    console.log('  re-linked authentic sources and plates for medieval_england lesson 5');
  }
});

// ----------------------------------------------------------------------
// 2. Edexcel Medicine: Restore Authentic Sources & Plates for L2, L5, L7, L8
// ----------------------------------------------------------------------
syncUnitToAllLayers('edexcel_medicine', (u) => {
  // --- Lesson 2 (lesson_1_2): Rational Explanations ---
  const l2 = u.lessons.find(l => l.id === 'lesson_1_2');
  if (l2 && l2.sources && l2.sources.length >= 5) {
    const srcMap = {};
    l2.sources.forEach(s => { srcMap[s.id] = s; });

    if (l2.narrative_blocks[0]) {
      l2.narrative_blocks[0].image = '/images/hippocrates_portrait.jpg';
      l2.narrative_blocks[0].sources = [srcMap['med_l2_source_a'] || l2.sources[0]];
    }
    if (l2.narrative_blocks[1]) {
      delete l2.narrative_blocks[1].image;
      l2.narrative_blocks[1].sources = [srcMap['med_l2_source_c'] || l2.sources[1]];
    }
    if (l2.narrative_blocks[2]) {
      l2.narrative_blocks[2].image = '/images/zodiac_man.jpg';
      l2.narrative_blocks[2].sources = [srcMap['med_l2_source_b'] || l2.sources[2]];
    }
    if (l2.narrative_blocks[3]) {
      delete l2.narrative_blocks[3].image;
      l2.narrative_blocks[3].sources = [srcMap['med_l2_source_d'] || l2.sources[3]];
    }
    if (l2.narrative_blocks[4]) {
      delete l2.narrative_blocks[4].image;
      l2.narrative_blocks[4].sources = [srcMap['med_l2_source_e'] || l2.sources[4]];
    }
    console.log('  re-linked authentic sources and plates for edexcel_medicine lesson 1_2');
  }

  // --- Lesson 5 (lesson_1_5): Black Death ---
  const l5 = u.lessons.find(l => l.id === 'lesson_1_5');
  if (l5 && l5.sources && l5.sources.length >= 5) {
    const srcMap = {};
    l5.sources.forEach(s => { srcMap[s.id] = s; });

    if (l5.narrative_blocks[0]) {
      l5.narrative_blocks[0].image = '/images/medieval_trading_cog_ship.jpg';
      l5.narrative_blocks[0].sources = [srcMap['med_l5_source_d'] || l5.sources[0]];
    }
    if (l5.narrative_blocks[1]) {
      delete l5.narrative_blocks[1].image;
      l5.narrative_blocks[1].sources = [srcMap['med_l5_source_a'] || l5.sources[1]];
    }
    if (l5.narrative_blocks[2]) {
      delete l5.narrative_blocks[2].image;
      l5.narrative_blocks[2].sources = [srcMap['med_l5_source_c'] || l5.sources[2]];
    }
    if (l5.narrative_blocks[3]) {
      delete l5.narrative_blocks[3].image;
      l5.narrative_blocks[3].sources = [srcMap['med_l5_source_e'] || l5.sources[3]];
    }
    if (l5.narrative_blocks[4]) {
      l5.narrative_blocks[4].image = '/images/plague_burial.jpg';
      l5.narrative_blocks[4].sources = [srcMap['med_l5_source_b'] || l5.sources[4]];
    }
    console.log('  re-linked authentic sources and plates for edexcel_medicine lesson 1_5');
  }

  // --- Lesson 7 (lesson_2_2): Thomas Sydenham ---
  const l7 = u.lessons.find(l => l.id === 'lesson_2_2');
  if (l7 && l7.sources && l7.sources.length >= 5) {
    const srcMap = {};
    l7.sources.forEach(s => { srcMap[s.id] = s; });

    if (l7.narrative_blocks[0]) {
      delete l7.narrative_blocks[0].image;
      l7.narrative_blocks[0].sources = [srcMap['med_l7_source_a'] || l7.sources[0]];
    }
    if (l7.narrative_blocks[1]) {
      l7.narrative_blocks[1].image = '/images/thomas_sydenham_portrait.jpg';
      l7.narrative_blocks[1].sources = [srcMap['med_l7_source_b'] || l7.sources[1]];
    }
    if (l7.narrative_blocks[2]) {
      l7.narrative_blocks[2].image = '/images/cinchona_bark_specimen.jpg';
      l7.narrative_blocks[2].sources = [srcMap['med_l7_source_d'] || l7.sources[3]];
    }
    if (l7.narrative_blocks[3]) {
      delete l7.narrative_blocks[3].image;
      l7.narrative_blocks[3].sources = [srcMap['med_l7_source_e'] || l7.sources[2]];
    }
    if (l7.narrative_blocks[4]) {
      delete l7.narrative_blocks[4].image;
      l7.narrative_blocks[4].sources = [srcMap['med_l7_source_c'] || l7.sources[4]];
    }
    console.log('  re-linked authentic sources and plates for edexcel_medicine lesson 2_2');
  }

  // --- Lesson 8 (lesson_2_3): Andreas Vesalius ---
  const l8 = u.lessons.find(l => l.id === 'lesson_2_3');
  if (l8 && l8.sources && l8.sources.length >= 5) {
    const srcMap = {};
    l8.sources.forEach(s => { srcMap[s.id] = s; });

    if (l8.narrative_blocks[0]) {
      delete l8.narrative_blocks[0].image;
      l8.narrative_blocks[0].sources = [srcMap['med_l8_source_a'] || l8.sources[0]];
    }
    if (l8.narrative_blocks[1]) {
      l8.narrative_blocks[1].image = '/images/vesalius_dissection_wide.jpg';
      l8.narrative_blocks[1].sources = [srcMap['med_l8_source_b'] || l8.sources[1]];
    }
    if (l8.narrative_blocks[2]) {
      delete l8.narrative_blocks[2].image;
      l8.narrative_blocks[2].sources = [srcMap['med_l8_source_c'] || l8.sources[2]];
    }
    if (l8.narrative_blocks[3]) {
      l8.narrative_blocks[3].image = '/images/vesalius_muscle_men.jpg';
      l8.narrative_blocks[3].sources = [srcMap['med_l8_source_d'] || l8.sources[3]];
    }
    if (l8.narrative_blocks[4]) {
      delete l8.narrative_blocks[4].image;
      l8.narrative_blocks[4].sources = [srcMap['med_l8_source_e'] || l8.sources[4]];
    }
    console.log('  re-linked authentic sources and plates for edexcel_medicine lesson 2_3');
  }
});

// ----------------------------------------------------------------------
// 3. Weimar & Nazi Germany: Restore Authentic Sources & Plates for L14, L16
// ----------------------------------------------------------------------
syncUnitToAllLayers('weimar_nazi_germany', (u) => {
  // --- Lesson 14 (lesson_4_2): Nazi Youth ---
  const l14 = u.lessons.find(l => l.id === 'lesson_4_2');
  if (l14 && l14.sources && l14.sources.length >= 5) {
    const srcMap = {};
    l14.sources.forEach(s => { srcMap[s.id] = s; });

    if (l14.narrative_blocks[0]) {
      l14.narrative_blocks[0].image = '/images/weimar_individuals/bernhard_rust.jpg';
      l14.narrative_blocks[0].sources = [srcMap['weimar_l14_source_d'] || l14.sources[0]];
    }
    if (l14.narrative_blocks[1]) {
      l14.narrative_blocks[1].image = '/images/hitler_youth_march_1930s.jpg';
      l14.narrative_blocks[1].sources = [srcMap['weimar_l14_source_b'] || l14.sources[1]];
    }
    if (l14.narrative_blocks[2]) {
      delete l14.narrative_blocks[2].image;
      l14.narrative_blocks[2].sources = [srcMap['weimar_l14_source_a'] || l14.sources[2]];
    }
    if (l14.narrative_blocks[3]) {
      delete l14.narrative_blocks[3].image;
      l14.narrative_blocks[3].sources = [srcMap['weimar_l14_source_c'] || l14.sources[3]];
    }
    if (l14.narrative_blocks[4]) {
      delete l14.narrative_blocks[4].image;
      l14.narrative_blocks[4].sources = [srcMap['weimar_l14_source_e'] || l14.sources[4]];
    }
    console.log('  re-linked authentic sources and plates for weimar_nazi_germany lesson 4_2');
  }

  // --- Lesson 16 (lesson_4_4): Persecution of Minorities ---
  const l16 = u.lessons.find(l => l.id === 'lesson_4_4');
  if (l16 && l16.sources && l16.sources.length >= 5) {
    const srcMap = {};
    l16.sources.forEach(s => { srcMap[s.id] = s; });

    if (l16.narrative_blocks[0]) {
      delete l16.narrative_blocks[0].image;
      l16.narrative_blocks[0].sources = [srcMap['weimar_l16_source_racial_biology'] || l16.sources[0]];
    }
    if (l16.narrative_blocks[1]) {
      l16.narrative_blocks[1].image = '/images/weimar_individuals/julius_streicher.jpg';
      l16.narrative_blocks[1].sources = [srcMap['weimar_l16_source_a'] || l16.sources[1]];
    }
    if (l16.narrative_blocks[2]) {
      delete l16.narrative_blocks[2].image;
      l16.narrative_blocks[2].sources = [srcMap['weimar_l16_source_c'] || l16.sources[2]];
    }
    if (l16.narrative_blocks[3]) {
      l16.narrative_blocks[3].image = '/images/kristallnacht_berlin_aftermath_1938.jpg';
      l16.narrative_blocks[3].sources = [srcMap['weimar_l16_source_d'] || l16.sources[3]];
    }
    if (l16.narrative_blocks[4]) {
      delete l16.narrative_blocks[4].image;
      l16.narrative_blocks[4].sources = [srcMap['weimar_l16_source_e'] || l16.sources[4]];
    }
    console.log('  re-linked authentic sources and plates for weimar_nazi_germany lesson 4_4');
  }
});

console.log('\n🎉 Finished restoring authentic sources and images across all lessons!');

