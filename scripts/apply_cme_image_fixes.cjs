const fs = require('fs');
const path = require('path');

const targetFiles = [
  'units/cme_new/data.js',
  'public/units/cme_new/data.js'
];

targetFiles.forEach(relPath => {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) {
    console.error('File not found:', fullPath);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');

  // 1. Replace AI drawing oslo_cover.png
  content = content.replace(
    /\/units\/cme_new\/assets\/oslo_cover\.png/g,
    '/images/cme_nobel_peace_prize_oslo_1994.jpg'
  );

  // 2. Replace black_september.svg
  content = content.replace(
    /\/units\/cme_new\/assets\/black_september\.svg/g,
    '/images/cme_king_hussein_black_september_1970.png'
  );

  // 3. Replace fatahland.svg
  content = content.replace(
    /\/units\/cme_new\/assets\/fatahland\.svg/g,
    '/images/cme_fatah_fedayeen_lebanon_1979.jpg'
  );

  // 4. Replace sinai_returned.svg
  content = content.replace(
    /\/units\/cme_new\/assets\/sinai_returned\.svg/g,
    '/images/cme_sinai_withdrawal_zones_cia_1979.jpg'
  );

  // 5. Replace sabra_shatila.svg
  content = content.replace(
    /\/units\/cme_new\/assets\/sabra_shatila\.svg/g,
    '/units/cme_new/assets/sharon_beirut_1982.jpg'
  );

  // 6. Replace allon_plan_1967_map.svg
  content = content.replace(
    /\/units\/cme_new\/assets\/allon_plan_1967_map\.svg/g,
    '/images/cme_allon_plan_1967_map.jpg'
  );

  // 7. Replace israel_national_water_carrier_1964_map.svg
  content = content.replace(
    /\/units\/cme_new\/assets\/israel_national_water_carrier_1964_map\.svg/g,
    '/images/cme_banias_spring_headwaters_1967.jpg'
  );

  // 8. Update captions / descriptions for replaced sources
  content = content.replace(
    'Plenary assembly of the Madrid Middle East Peace Conference co-chaired by President George H.W. Bush and President Mikhail Gorbachev, October 1991',
    'The 1994 Nobel Peace Prize Laureates in Oslo (10 December 1994): PLO Chairman Yasser Arafat, Israeli Foreign Minister Shimon Peres, and Prime Minister Yitzhak Rabin display their Nobel diplomas and gold medals in Oslo, Norway, honoring the historic compromise of the Oslo Accords.'
  );

  content = content.replace(
    'Flowchart illustrating the escalation of tensions in Jordan: PLO border operations provoking Israeli retaliation, King Hussein\'s crackdown during Black September (1970), and the expulsion of the PLO leadership to Lebanon.',
    'King Hussein Meets Military Commanders During Black September (17 September 1970): King Hussein of Jordan conferring with senior army officers on 17 September 1970 as Jordanian armoured divisions entered Amman to reassert royal authority against armed PLO fedayeen.'
  );

  content = content.replace(
    'Source B: Topographical Map of the Sabra and Shatila Camps (September 1982)',
    'Source B: Defence Minister Ariel Sharon Overlooking West Beirut from IDF Observation Post (August 1982)'
  );
  content = content.replace(
    'Topographical overview showing the perimeter of Sabra and Shatila refugee camps in West Beirut, Israeli observation posts, and Lebanese Phalangist militia entry routes (16-18 September 1982).',
    'Israeli Defence Minister Ariel Sharon surveying West Beirut and surrounding refugee camp sectors from an IDF rooftop command post with military operational maps, August 1982.'
  );
  content = content.replace(
    'Investigative map produced for the Kahan Commission of Inquiry.',
    'Archival photograph of Ariel Sharon directing operations overlooking West Beirut, August 1982.'
  );

  content = content.replace(
    'Source D: Cartographic Map of \'Fatahland\' in Southern Lebanon',
    'Source D: Fatah Fedayeen Fighters on Parade in Lebanon (January 1979)'
  );
  content = content.replace(
    'Cartographic map detailing PLO operational bases, weapons caches, and Katyusha rocket launch zones across the Arkoub region (\'Fatahland\') along the Lebanese-Israeli border.',
    'Uniformed Palestinian Fatah fedayeen fighters, wearing keffiyehs and military fatigues, marching with Palestinian flags in Lebanon following the PLO’s relocation from Jordan into southern Lebanon (\'Fatahland\').'
  );
  content = content.replace(
    'Strategic military map of PLO military build-up in southern Lebanon.',
    'Archival photograph of uniformed Fatah fedayeen militia in Lebanon.'
  );

  content = content.replace(
    'Source E: Map of the Phased Israeli Withdrawal from Sinai (1979–1982)',
    'Source E: Official CIA Map of Sinai Demilitarized Security Zones (March 1979)'
  );
  content = content.replace(
    'Cartographic diagram displaying the three-stage withdrawal of the IDF from the Sinai Peninsula (1979-1982) and the creation of demilitarized security zones monitored by the Multinational Force and Observers (MFO).',
    'Official Central Intelligence Agency cartographic map detailing the phased withdrawal zones (Zones A, B, C, and D) and UN peacekeeping positions across the Sinai Peninsula under the 1979 Egypt-Israel Peace Treaty.'
  );

  content = content.replace(
    'Source D: The Arab Headwaters Diversion Plan Schematic (1964–1966)',
    'Source D: Israeli Tank Guarding the Disputed Banias River Headwaters (1967)'
  );
  content = content.replace(
    'Schematic flow chart illustrating the Arab League plan to divert the Hasbani and Banyas tributaries away from the Jordan River basin into the Yarmouk River in Jordan.',
    'An Israeli Super Sherman tank deployed above the natural pools and waterfalls of the Banias springs on the Syrian border, guarding the critical northern headwaters of the Jordan River basin against Syrian diversion works.'
  );
  content = content.replace(
    'Cartographic flow diagram of the disputed Jordan River headwaters.',
    'Archival photograph of Israeli tank at the Banias river headwaters on the Syrian border.'
  );

  content = content.replace(
    'Source E: The Allon Plan Settlement Strategy Blueprint (1967–1968)',
    'Source E: Strategic Cartographic Map of the Allon Plan (1967–1968)'
  );
  content = content.replace(
    'Strategic cartographic map of the Allon Plan proposed by Labor Minister Yigal Allon: annexing a 10–15km security strip along the Jordan River while returning densely populated Arab highland enclaves to Jordanian civil control.',
    'Historical map illustrating Labor Minister Yigal Allon\'s settlement strategy: annexing a 10–15km defensive perimeter along the Jordan River (blue) while returning Arab population centres (green) to Jordanian civil administration.'
  );

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated replacements in ${relPath}`);
});

