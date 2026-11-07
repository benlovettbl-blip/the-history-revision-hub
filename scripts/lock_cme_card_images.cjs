const fs = require('fs');
const path = require('path');

const cardImageMapping = {
  lesson_1: {
    card_image: '/images/cme_allenby_jerusalem_1917.jpg',
    card_position: 'center 20%'
  },
  lesson_2: {
    card_image: '/units/cme_new/assets/cme_david_ben_gurion__d597_087_.jpg',
    card_position: 'center 20%'
  },
  lesson_3: {
    card_image: '/images/cme_palestinian_refugees_1948.jpg',
    card_position: 'center 25%'
  },
  lesson_4: {
    card_image: '/images/cme_nasser_1956.jpg',
    card_position: 'center 20%'
  },
  lesson_6: {
    card_image: '/images/cme_cairo_summit_1964.jpg',
    card_position: 'center 25%'
  },
  lesson_7: {
    card_image: '/images/cme_six_day_war_airfield_1967.jpg',
    card_position: 'center 30%'
  },
  lesson_8: {
    card_image: '/units/cme_new/assets/conquered_territories_1967.png',
    card_position: 'center 30%'
  },
  lesson_9: {
    card_image: '/images/cme_munich_1972_balcony.jpg',
    card_position: 'center 25%'
  },
  lesson_10: {
    card_image: '/units/cme_new/assets/yom_kippur_crossing.png',
    card_position: 'center 30%'
  },
  lesson_11: {
    card_image: '/images/cme_camp_david_1978.jpg',
    card_position: 'center 20%'
  },
  lesson_12: {
    card_image: '/units/cme_new/assets/sharon_beirut_1982.jpg',
    card_position: 'center 25%'
  },
  lesson_13: {
    card_image: '/images/cme_oslo_handshake_1993.jpg',
    card_position: 'center 20%'
  }
};

const targetPaths = [
  path.join(__dirname, '..', 'units', 'cme_new', 'data.js'),
  path.join(__dirname, '..', 'public', 'units', 'cme_new', 'data.js')
];

targetPaths.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return;
  }

  delete require.cache[require.resolve(filePath)];
  let cmeData = require(filePath).default || require(filePath);

  cmeData.lessons.forEach(l => {
    if (cardImageMapping[l.id]) {
      l.card_image = cardImageMapping[l.id].card_image;
      l.card_position = cardImageMapping[l.id].card_position;
      console.log(`Locked card_image for ${l.id}: ${l.card_image}`);
    }

    // Fix narrative blocks in lesson_13
    if (l.id === 'lesson_13') {
      l.narrative_blocks.forEach((b, idx) => {
        if (b.image && b.image.includes('oslo_cover')) {
          b.image = '/images/cme_nobel_peace_prize_oslo_1994.jpg';
          b.caption = 'The 1994 Nobel Peace Prize Laureates in Oslo (10 December 1994): PLO Chairman Yasser Arafat, Israeli Foreign Minister Shimon Peres, and Prime Minister Yitzhak Rabin display their Nobel diplomas and gold medals in Oslo, Norway, honoring the historic compromise of the Oslo Accords.';
          b.image_alt = 'Yasser Arafat, Shimon Peres, and Yitzhak Rabin receiving the 1994 Nobel Peace Prize in Oslo.';
          console.log(`Replaced oslo_cover.png in lesson_13 block ${idx}`);
        }
      });
    }

    // Fix narrative blocks in lesson_9
    if (l.id === 'lesson_9') {
      l.narrative_blocks.forEach((b, idx) => {
        if (b.image && b.image.includes('black_september.svg')) {
          b.image = '/images/cme_king_hussein_black_september_1970.png';
          b.caption = 'King Hussein Meets Military Commanders During Black September (17 September 1970): King Hussein of Jordan conferring with senior army officers on 17 September 1970 as Jordanian armoured divisions entered Amman to reassert royal authority against armed PLO fedayeen.';
          b.image_alt = 'King Hussein of Jordan conferring with military commanders in September 1970.';
          console.log(`Replaced black_september.svg in lesson_9 block ${idx}`);
        }
      });

      // Also check sources in lesson_9
      if (l.sources) {
        l.sources.forEach(s => {
          if (s.src && s.src.includes('fatahland.svg')) {
            s.src = '/images/cme_fatah_fedayeen_lebanon_1979.jpg';
            s.image = '/images/cme_fatah_fedayeen_lebanon_1979.jpg';
            s.source = '/images/cme_fatah_fedayeen_lebanon_1979.jpg';
            s.title = 'Source D: Fatah Fedayeen Fighters on Parade in Lebanon (January 1979)';
            s.caption = 'Uniformed Palestinian Fatah fedayeen fighters, wearing keffiyehs and military fatigues, marching with Palestinian flags in Lebanon following the PLO’s relocation from Jordan into southern Lebanon (\'Fatahland\').';
            s.desc = 'Archival photograph of uniformed Fatah fedayeen militia in Lebanon.';
            console.log('Replaced fatahland.svg in lesson_9 Source D');
          }
        });
      }
    }

    // Check lesson_11 for sinai_returned.svg
    if (l.id === 'lesson_11' && l.sources) {
      l.sources.forEach(s => {
        if (s.src && s.src.includes('sinai_returned.svg')) {
          s.src = '/images/cme_sinai_withdrawal_zones_cia_1979.jpg';
          s.image = '/images/cme_sinai_withdrawal_zones_cia_1979.jpg';
          s.source = '/images/cme_sinai_withdrawal_zones_cia_1979.jpg';
          s.title = 'Source E: Official CIA Map of Sinai Demilitarized Security Zones (March 1979)';
          s.caption = 'Official Central Intelligence Agency cartographic map detailing the phased withdrawal zones (Zones A, B, C, and D) and UN peacekeeping positions across the Sinai Peninsula under the 1979 Egypt-Israel Peace Treaty.';
          console.log('Replaced sinai_returned.svg in lesson_11 Source E');
        }
      });
    }

    // Check lesson_12 for sabra_shatila.svg
    if (l.id === 'lesson_12' && l.sources) {
      l.sources.forEach(s => {
        if (s.src && s.src.includes('sabra_shatila.svg')) {
          s.src = '/units/cme_new/assets/sharon_beirut_1982.jpg';
          s.image = '/units/cme_new/assets/sharon_beirut_1982.jpg';
          s.source = '/units/cme_new/assets/sharon_beirut_1982.jpg';
          s.title = 'Source B: Defence Minister Ariel Sharon Overlooking West Beirut from IDF Observation Post (August 1982)';
          s.caption = 'Israeli Defence Minister Ariel Sharon surveying West Beirut and surrounding refugee camp sectors from an IDF rooftop command post with military operational maps, August 1982.';
          s.desc = 'Archival photograph of Ariel Sharon directing operations overlooking West Beirut, August 1982.';
          console.log('Replaced sabra_shatila.svg in lesson_12 Source B');
        }
      });
    }

    // Check lesson_8 for allon_plan_1967_map.svg
    if (l.id === 'lesson_8' && l.sources) {
      l.sources.forEach(s => {
        if (s.src && s.src.includes('allon_plan_1967_map.svg')) {
          s.src = '/images/cme_allon_plan_1967_map.jpg';
          s.image = '/images/cme_allon_plan_1967_map.jpg';
          s.source = '/images/cme_allon_plan_1967_map.jpg';
          s.title = 'Source E: Strategic Cartographic Map of the Allon Plan (1967–1968)';
          s.caption = 'Historical map illustrating Labor Minister Yigal Allon\'s settlement strategy: annexing a 10–15km defensive perimeter along the Jordan River (blue) while returning Arab population centres (green) to Jordanian civil administration.';
          console.log('Replaced allon_plan_1967_map.svg in lesson_8 Source E');
        }
      });
    }
  });

  const fileBanner = `// Conflict in the Middle East, 1945-1995 (Edexcel GCSE Paper 2)
// Curriculum data with 5-Block Narrative & 1-to-1 Chronological Primary Source Alignment

const cme_new_data = `;

  const fileFooter = `;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = cme_new_data;
}

export default cme_new_data;
`;

  const serialized = fileBanner + JSON.stringify(cmeData, null, 2) + fileFooter;
  fs.writeFileSync(filePath, serialized, 'utf8');
  console.log(`✅ Saved clean updated file: ${filePath}`);
});

