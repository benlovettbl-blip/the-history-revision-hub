const fs = require('fs');
const path = require('path');

const targetFiles = [
  'units/cme_new/data.js',
  'public/units/cme_new/data.js'
];

const lessonBanners = {
  lesson_1: { banner: '/images/cme_allenby_jerusalem_1917.jpg' },
  lesson_2: { banner: '/images/cme_bengurion_declaration_1948.jpg' },
  lesson_3: { banner: '/images/cme_palestinian_refugees_1948.jpg' },
  lesson_4: { banner: '/images/cme_port_said_british_troops_1956.jpg' },
  lesson_6: { banner: '/images/cme_cairo_summit_1964.jpg' },
  lesson_7: { banner: '/images/cme_paratroopers_western_wall_1967.jpg', card_image: '/images/cme_six_day_war_airfield_1967.jpg' },
  lesson_8: { banner: '/images/cme_bar_lev_line_fortifications_1970.jpg' },
  lesson_9: { banner: '/images/cme_munich_1972_balcony.jpg', card_image: '/images/cme_king_hussein_black_september_1970.png' },
  lesson_10: { banner: '/images/cme_egyptians_crossing_suez_1973.jpg' },
  lesson_11: { banner: '/images/cme_camp_david_1978.jpg' },
  lesson_12: { banner: '/units/cme_new/assets/sharon_beirut_1982.jpg' },
  lesson_13: { banner: '/images/cme_oslo_handshake_1993.jpg', card_image: '/images/cme_oslo_handshake_1993.jpg' }
};

targetFiles.forEach(relPath => {
  const fullPath = path.resolve(relPath);
  let content = fs.readFileSync(fullPath, 'utf8');

  for (const [lessonId, meta] of Object.entries(lessonBanners)) {
    // Locate the lesson object
    const marker = `"id": "${lessonId}"`;
    const idx = content.indexOf(marker);
    if (idx === -1) {
      console.error(`Lesson ${lessonId} not found in ${relPath}`);
      continue;
    }

    // Insert banner and card_image right after "id": "..."
    let insertion = `,\n      "banner": "${meta.banner}"`;
    if (meta.card_image) {
      insertion += `,\n      "card_image": "${meta.card_image}"`;
    }

    // Check if banner already exists nearby
    const slice = content.substring(idx, idx + 200);
    if (!slice.includes('"banner":')) {
      content = content.substring(0, idx + marker.length) + insertion + content.substring(idx + marker.length);
      console.log(`Injected banner for ${lessonId} in ${relPath}`);
    } else {
      console.log(`Banner already exists for ${lessonId}`);
    }
  }

  fs.writeFileSync(fullPath, content, 'utf8');
});

