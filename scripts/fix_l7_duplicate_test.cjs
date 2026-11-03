const fs = require('fs');

['units/cme_new/data.js', 'public/units/cme_new/data.js'].forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Block 2 image and caption in lesson_7
  const oldBlock = `"image": "/images/cme_six_day_war_airfield_1967.jpg",\n  "image_alt": "Burned out Egyptian MiG-21 jet fighters destroyed on tarmac runways during the pre-emptive air strike, 5 June 1967",\n  "caption": "the pre-emptive air strike (5 June 1967): The Israeli Air Force destroyed over 300 Egyptian combat aircraft on the ground in three hours, securing absolute air supremacy."`;

  const newBlock = `"image": "/images/cme_six_day_war_sinai_armour_1967.jpg",\n  "image_alt": "Israeli 14th Armored Brigade tanks advancing across the Sinai desert, June 1967",\n  "caption": "Sinai armored offensive (June 1967): IDF armored columns advancing across the Sinai desert towards the Suez Canal following the opening breakthrough."`;

  if (content.includes('/images/cme_six_day_war_airfield_1967.jpg')) {
    // We only want to replace it in block 2, not in Source D
    // In block 2, it is immediately followed by image_alt with "Burned out Egyptian"
    content = content.replace(
      '\"image\": \"/images/cme_six_day_war_airfield_1967.jpg\",\n  \"image_alt\": \"Burned out Egyptian MiG-21 jet fighters',
      '\"image\": \"/images/cme_six_day_war_sinai_armour_1967.jpg\",\n  \"image_alt\": \"Israeli 14th Armored Brigade tanks advancing across the Sinai desert, June 1967\",\n  \"caption\": \"Sinai armored offensive (June 1967): IDF armored columns advancing across the Sinai desert towards the Suez Canal following the opening air breakthrough.\",\n  \"old_caption_replaced\": true,\n  \"old_junk\": \"'
    );
    // Let's also check if caption is duplicated
  }
  fs.writeFileSync(filePath, content, 'utf8');
});

