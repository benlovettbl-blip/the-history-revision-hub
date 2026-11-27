/**
 * The History Revision Hub — Dual-Spread In-Page Digital Textbook Flipbook Reader
 *
 * Interactive two-page spread reader allowing pupils and teachers to read all 42 course
 * textbooks across all 26 curriculum units (KS2, KS3, and GCSE) with 1:1 reprographic
 * fidelity matching physical printed booklets.
 */

import { state } from './state.js';

function makeKs2TwelvePageBook(unitId, shortTitle, title, period, enquiryTitles) {
  return {
    unitTitle: title,
    shortTitle,
    unitCode: 'Key Stage 2 History',
    badgeColor: '#0284c7',
    lessonPageType: 'ks2_12p',
    keyTopics: {
      MAIN: {
        id: 'MAIN',
        title: `${shortTitle} (${period})`,
        shortTitle,
        period,
        htmlUrl: `/units/${unitId}/textbook.html`,
        pdfUrl: `/pdfs/${unitId}_textbook.pdf`,
        spreads: [
          { index: 0, pages: [1], label: 'Front Cover', subtitle: `${shortTitle} Overview`, isCover: true },
          { index: 1, pages: [2, 3], label: 'Spine & Map', subtitle: 'Chronological Steps & Historical Map' },
          { index: 2, pages: [4, 5], label: 'Enquiries 1–2', subtitle: `${enquiryTitles[0]} • ${enquiryTitles[1]}` },
          { index: 3, pages: [6, 7], label: 'Enquiries 3–4', subtitle: `${enquiryTitles[2]} • ${enquiryTitles[3]}` },
          { index: 4, pages: [8, 9], label: 'Enquiries 5–6', subtitle: `${enquiryTitles[4]} • ${enquiryTitles[5]}` },
          { index: 5, pages: [10, 11], label: 'Quiz & Words', subtitle: 'Knowledge Check & Phonetic Word Bank' },
          { index: 6, pages: [12], label: 'Back Cover', subtitle: '10 Key Turning Points Summary', isBackCover: true },
        ],
      },
    },
  };
}

function makeKs3EightPageBook(unitId, shortTitle, title, yearLabel, period, enquiryTitles) {
  return {
    unitTitle: title,
    shortTitle,
    unitCode: `Key Stage 3 • ${yearLabel}`,
    badgeColor: '#0284c7',
    lessonPageType: 'ks3_8p',
    keyTopics: {
      MAIN: {
        id: 'MAIN',
        title: `${shortTitle} (${period})`,
        shortTitle,
        period,
        htmlUrl: `/units/${unitId}/textbook.html`,
        pdfUrl: `/pdfs/${unitId}_textbook.pdf`,
        spreads: [
          { index: 0, pages: [1], label: 'Front Cover', subtitle: `${shortTitle} Overview`, isCover: true },
          { index: 1, pages: [2, 3], label: 'Spine & Enq 01', subtitle: `Turning Points • ${enquiryTitles[0]}` },
          { index: 2, pages: [4, 5], label: 'Enquiries 02–03', subtitle: `${enquiryTitles[1]} • ${enquiryTitles[2]}` },
          { index: 3, pages: [6, 7], label: 'Enquiries 04–05', subtitle: `${enquiryTitles[3]} • ${enquiryTitles[4]}` },
          { index: 4, pages: [8], label: 'Back Cover', subtitle: '25-Question Master Retrieval Quiz', isBackCover: true },
        ],
      },
    },
  };
}

function makeGcseFourEnquiryKtEdition(unitId, ktId, shortTitle, title, period, enquiryTitles) {
  return {
    id: ktId,
    title,
    shortTitle,
    period,
    htmlUrl: `/units/${unitId}/textbook_${ktId}_PUBLISHER.html`,
    pdfUrl: `/pdfs/${unitId}_textbook_${ktId}.pdf`,
    spreads: [
      { index: 0, pages: [1], label: 'Front Cover', subtitle: 'Overview & Canonical TOC', isCover: true },
      { index: 1, pages: [2, 3], label: 'Dossier & Spine', subtitle: 'Key Actors & Chronological Turning Points' },
      { index: 2, pages: [4, 5], label: 'Enquiry 01', subtitle: enquiryTitles[0] },
      { index: 3, pages: [6, 7], label: 'Enquiry 02', subtitle: enquiryTitles[1] },
      { index: 4, pages: [8, 9], label: 'Enquiry 03', subtitle: enquiryTitles[2] },
      { index: 5, pages: [10, 11], label: 'Enquiry 04', subtitle: enquiryTitles[3] },
      { index: 6, pages: [12], label: 'Back Cover', subtitle: '20-Question Retrieval Quiz', isBackCover: true },
    ],
  };
}

// Complete 26-Unit Curriculum Registry (All 42 Published Classroom Textbooks)
export const TEXTBOOK_CATALOG = {
  // =========================================================================
  // KEY STAGE 2 (8 UNITS)
  // =========================================================================
  ks2_stone_to_iron_age: makeKs2TwelvePageBook(
    'ks2_stone_to_iron_age',
    'Stone Age to Iron Age',
    'Stone Age to Iron Age Britain (c. 800,000 BC–AD 43)',
    'c. 800,000 BC–AD 43',
    [
      'Ice Age Hunters & Doggerland',
      'First Farmers & Skara Brae',
      'Secrets of Stonehenge',
      'Bronze Age & Beaker People',
      'Must Farm ("Britain\'s Pompeii")',
      'Iron Age Celts & Hillforts',
    ],
  ),
  ks2_ancient_egypt: makeKs2TwelvePageBook(
    'ks2_ancient_egypt',
    'Ancient Egypt',
    'Ancient Egypt: River Nile, Pyramids & Pharaohs (c. 3100–30 BC)',
    'c. 3100–30 BC',
    [
      'River Cradles & Gift of the Nile',
      'Pyramids of Giza & Great Sphinx',
      'Scribes, Hieroglyphs & Daily Life',
      'Gods, Mummies & Afterlife',
      'Hatshepsut, Nefertiti & Ramesses II',
      'Tutankhamun & Cleopatra VII',
    ],
  ),
  ks2_ancient_greece: makeKs2TwelvePageBook(
    'ks2_ancient_greece',
    'Ancient Greece',
    'Ancient Greece: City-States, Democracy & Legacy (c. 800–146 BC)',
    'c. 800–146 BC',
    [
      'Mountains & Rival City-States',
      'Growing Up in Athens & Sparta',
      'Olympian Gods & Ancient Olympics',
      'Marathon, Thermopylae & Salamis',
      'Theatre, Philosophy & Medicine',
      'Alexander & Greek Legacy',
    ],
  ),
  ks2_early_islamic_baghdad: makeKs2TwelvePageBook(
    'ks2_early_islamic_baghdad',
    'Early Islamic Baghdad',
    'Early Islamic Civilisation: Round City of Baghdad (c. AD 750–1258)',
    'c. AD 750–1258',
    [
      'Building the Round City of Baghdad',
      'Paper & The House of Wisdom',
      'Zero, Astrolabes & Hospitals',
      'Silk Roads, Dhows & Viking Coins',
      'Courtyards, Tilework & Chess',
      '1258 Siege & Surviving Ideas',
    ],
  ),
  ks2_maya_civilisation: makeKs2TwelvePageBook(
    'ks2_maya_civilisation',
    'The Ancient Maya',
    'The Ancient Maya: Rainforest Cities, Glyphs & Cacao (c. 2000 BC–AD 1500)',
    'c. 2000 BC–AD 1500',
    [
      'Rainforest Cities & Cenotes',
      'Step Pyramids & King Pakal',
      'Maya Glyphs, Codices & Zero',
      'Tortillas, Cacao & Pok-ta-Pok',
      'Maize Gods & Chichén Itzá',
      'AD 900 Mystery & Living Maya',
    ],
  ),
  ks2_crime_and_punishment: makeKs2TwelvePageBook(
    'ks2_crime_and_punishment',
    'Crime and Punishment',
    'Crime and Punishment Through Time: Roman Courts to Modern Forensics (AD 43–Present)',
    'AD 43–Present',
    [
      'Roman Law & Bath Curse Tablets',
      'Saxon Tithings, Wergild & Ordeals',
      'Norman Forest Laws & 1215 Juries',
      'Tudor Vagrants, 1605 Plot & Witches',
      'Smugglers, Highwaymen & Bloody Code',
      '1829 Bobbies, Prisons & 1984 DNA',
    ],
  ),
  ks2_kingdom_of_benin: makeKs2TwelvePageBook(
    "ks2_kingdom_of_benin",
    "Kingdom of Benin",
    "The Kingdom of Benin: Rainforest Earthworks, Oba Court & Bronzes (c. AD 900–1897)",
    "c. AD 900–1897",
    [
      "Rainforest Kingdom",
      "From Ogiso to Oba",
      "Lost-Wax Masterpieces",
      "Sacred Court Rituals",
      "Global Traders",
      "1897 British Invasion, Looted Bronze",
    ],
  ),
  ks2_victorian_britain: makeKs2TwelvePageBook(
    "ks2_victorian_britain",
    "Victorian Britain",
    "Victorian Britain: Steam Railways, Factories, Workhouses & Classrooms (1837–1901)",
    "1837–1901",
    [
      "Young Queen Victoria, Steam Railways",
      "Chimneys, Cotton Mills and Children",
      "Workhouses, Ragged Schools and Champ",
      "Inside a Victorian Classroom",
      "Workshop of the World",
      "Rich and Poor Homes, Seaside Holiday",
    ],
  ),
  ks2_local_history_detective: makeKs2TwelvePageBook(
    "ks2_local_history_detective",
    "Local History Detective",
    "History on Our Doorstep: Local History Detective Toolkit (AD 43–Present)",
    "AD 43–Present",
    [
      "Secret Code in Place-Names and Old O",
      "Reading Buildings on the High Street",
      "Voices From Number 12 — Censuses, Pa",
      "How Our Town Earned Its Living",
      "Names Carved in Stone",
      "Living Memory, Oral History and Savi",
    ],
  ),
  ks2_romans: makeKs2TwelvePageBook(
    'ks2_romans',
    'The Romans in Britain',
    'The Romans in Britain: Invasion, Resistance & Legacy (55 BC–AD 410)',
    '55 BC–AD 410',
    [
      'Celtic Britain Before Rome',
      'Claudius Invades Britain (AD 43)',
      'Boudicca\'s Iceni Rebellion',
      'Hadrian\'s Wall & Frontier Life',
      'Roman Towns, Roads & Villas',
      'AD 410 & Roman Legacy',
    ],
  ),
  ks2_anglo_saxons_vikings: makeKs2TwelvePageBook(
    'ks2_anglo_saxons_vikings',
    'Anglo-Saxons & Vikings',
    'Anglo-Saxons & Vikings: Struggle for England (AD 410–1066)',
    'AD 410–1066',
    [
      'Angles, Saxons & Jutes Settle',
      'Sutton Hoo & Monasteries',
      'Lindisfarne & Heathen Army',
      'Alfred the Great & Danelaw',
      'Everyday Life in Viking Jorvik',
      'Athelstan, Cnut & 1066',
    ],
  ),
  ks2_ww2: {
    unitTitle: 'World War II & The Home Front (1933–1945)',
    shortTitle: 'WWII & The Home Front',
    unitCode: 'Key Stage 2 History',
    badgeColor: '#0284c7',
    lessonPageType: 'ks2_16p',
    keyTopics: {
      MAIN: {
        id: 'MAIN',
        title: 'World War II & The Home Front (1933–1945)',
        shortTitle: 'WWII & Home Front',
        period: '1933–1945',
        htmlUrl: '/units/ks2_ww2/textbook.html',
        pdfUrl: '/pdfs/ks2_ww2_textbook.pdf',
        spreads: [
          { index: 0, pages: [1], label: 'Front Cover', subtitle: 'Overview & 11-Enquiry Directory', isCover: true },
          { index: 1, pages: [2, 3], label: 'Spine & Enq 01', subtitle: '12 Key Moments • Outbreak 1939 & Gas Masks' },
          { index: 2, pages: [4, 5], label: 'Enquiries 02–03', subtitle: 'Operation Pied Piper • Pre-War Jewish Life' },
          { index: 3, pages: [6, 7], label: 'Enquiries 04–05', subtitle: 'Kindertransport • Rescuing 669 Children' },
          { index: 4, pages: [8, 9], label: 'Enquiries 06–07', subtitle: 'The Blitz & Shelters • Dig for Victory' },
          { index: 5, pages: [10, 11], label: 'Enquiries 08–09', subtitle: 'Women at War • Bletchley Codebreakers' },
          { index: 6, pages: [12, 13], label: 'Enquiries 10–11', subtitle: 'VE Day 1945 • The Windermere Children' },
          { index: 7, pages: [14, 15], label: 'Partner Quiz', subtitle: '55-Question Knowledge Retrieval Check' },
          { index: 8, pages: [16], label: 'Back Cover', subtitle: 'Key Historical Vocabulary Bank', isBackCover: true },
        ],
      },
    },
  },

  // =========================================================================
  // KEY STAGE 3 (12 UNITS)
  // =========================================================================
  water_and_sanitation: makeKs3EightPageBook(
    'water_and_sanitation',
    'Water & Sanitation',
    'Water & Sanitation Through Time (AD 43–1900)',
    'Year 7',
    'AD 43–1900',
    [
      'Roman Aqueducts, Baths & Sewers',
      'Medieval Towns & Monasteries',
      'Early Modern Cesspits & Plague',
      'Industrial Slums, Cholera & Great Stink',
      'John Snow, Germ Theory & 1875 Act',
    ],
  ),
  medieval_england: makeKs3EightPageBook(
    'medieval_england',
    'Medieval England',
    'Medieval England: Power, Church & Crisis (1066–1381)',
    'Year 7',
    '1066–1381',
    [
      '1066 & Battle of Hastings',
      'Castles, Terror & Domesday Book',
      'Henry II & Thomas Becket',
      'King John & Magna Carta',
      'Black Death & Peasants\' Revolt',
    ],
  ),
  monarchy_religion_power: makeKs3EightPageBook(
    'monarchy_religion_power',
    'Crown, Church & Parliament',
    'Crown, Church & Parliament (1517–1689)',
    'Year 8',
    '1517–1689',
    [
      'Reformation & Break with Rome',
      'Elizabeth I & The Middle Way',
      'Spanish Armada & Naval Warfare',
      'Civil War, Regicide & Bill of Rights',
      'Shifting Power: Crown & Parliament',
    ],
  ),
  first_british_empire: makeKs3EightPageBook(
    'first_british_empire',
    'First British Empire',
    'The First British Empire (1600–1783)',
    'Year 8',
    '1600–1783',
    [
      'East India Company & Mughal Bengal',
      'Transatlantic Slave Trade',
      'Plantation Reality & Maroon Resistance',
      'Thirteen Colonies & Boston Tea Party',
      'American Revolution & Black Loyalists',
    ],
  ),
  industrialisation_and_empire: makeKs3EightPageBook(
    'industrialisation_and_empire',
    'Industrialisation & Protest',
    'Industrialisation, Power & Protest (1750–1872)',
    'Year 8',
    '1750–1872',
    [
      'Steam, Coal & Cort\'s Iron Revolution',
      'Factory Mills & 1833 Factory Act',
      'Boomtowns, Cholera & Reform',
      'Luddites, Peterloo & Tolpuddle',
      'Rotten Boroughs & Chartism',
    ],
  ),
  second_british_empire: makeKs3EightPageBook(
    'second_british_empire',
    'Second British Empire',
    'The Second British Empire (1783–1914)',
    'Year 8',
    '1783–1914',
    [
      'Engines of Empire & Naval Hegemony',
      'De-industrialisation of India',
      '1857 Indian Rebellion & The Raj',
      'Scramble for Africa & Ideology',
      'The Imperial Verdict',
    ],
  ),
  australia: makeKs3EightPageBook(
    'australia',
    'History of Australia',
    'Invasion & Survival in Australia (1768–1901)',
    'Year 8',
    '1768–1901',
    [
      'Cook, Tupaia & Terra Nullius',
      'First Fleet & Penal Colony',
      'Smallpox, Bennelong & Pemulwuy',
      'Frontier Wars & The Black War',
      'Gold Rush, Eureka & Legacy',
    ],
  ),
  great_war: makeKs3EightPageBook(
    'great_war',
    'Causes of the Great War',
    'Causes of the Great War (1871–1914)',
    'Year 9',
    '1871–1914',
    [
      'German Unification & Bismarck',
      'Imperial Rivalry & Moroccan Crises',
      'Anglo-German Naval Arms Race',
      'Alliance Systems & Balkan Powder Keg',
      'Sarajevo & The July Crisis (1914)',
    ],
  ),
  great_war_part2: makeKs3EightPageBook(
    'great_war_part2',
    'The Great War 1914–1919',
    'The Great War: Fronts, Home Front & Peace (1914–1919)',
    'Year 9',
    '1914–1919',
    [
      '1914 & Rush to the Colours',
      'Trench Warfare & Haig Debate',
      'Global Empire & Forgotten Fronts',
      'Home Front & Women\'s Total War',
      'Treaty of Versailles (1919)',
    ],
  ),
  the_shoah: {
    unitTitle: 'The Shoah / The Holocaust (1933–1948)',
    shortTitle: 'The Shoah (1933–1948)',
    unitCode: 'Key Stage 3 • Year 9',
    badgeColor: '#0284c7',
    lessonPageType: 'ks3_12p',
    keyTopics: {
      MAIN: {
        id: 'MAIN',
        title: 'The Shoah / The Holocaust (1933–1948)',
        shortTitle: 'The Shoah (1933–48)',
        period: '1933–1948',
        htmlUrl: '/units/the_shoah/textbook.html',
        pdfUrl: '/pdfs/the_shoah_textbook.pdf',
        spreads: [
          { index: 0, pages: [1], label: 'Front Cover', subtitle: 'Overview & 7-Enquiry Directory', isCover: true },
          { index: 1, pages: [2, 3], label: 'Spine & Enq 01', subtitle: 'Turning Points • Pre-War Jewish Life' },
          { index: 2, pages: [4, 5], label: 'Enquiries 02–03', subtitle: 'Kristallnacht • WWII & Ghettoisation' },
          { index: 3, pages: [6, 7], label: 'Enquiries 04–05', subtitle: 'Holocaust by Bullets • Resistance' },
          { index: 4, pages: [8, 9], label: 'Enquiries 06–07', subtitle: 'Complicity & Rescue • Liberation & Memory' },
          { index: 5, pages: [10, 11], label: 'Dossier & Quiz I', subtitle: 'Key Figures & Retrieval Qs 1–20' },
          { index: 6, pages: [12], label: 'Back Cover', subtitle: 'Retrieval Quiz Part II (Qs 21–35)', isBackCover: true },
        ],
      },
    },
  },
  cold_war: {
    unitTitle: 'The Cold War: Superpower Relations (1945–1991)',
    shortTitle: 'The Cold War (KS3)',
    unitCode: 'Key Stage 3 • Year 9',
    badgeColor: '#1d4ed8',
    lessonPageType: 'ks3_16p_spreads',
    keyTopics: {
      MAIN: {
        id: 'MAIN',
        title: 'The Cold War: Superpower Relations (1945–1991)',
        shortTitle: 'Cold War (1945–91)',
        period: '1945–1991',
        htmlUrl: '/units/cold_war/textbook.html',
        pdfUrl: '/pdfs/cold_war_textbook.pdf',
        spreads: [
          { index: 0, pages: [1], label: 'Front Cover', subtitle: 'Overview & Canonical TOC', isCover: true },
          { index: 1, pages: [2, 3], label: 'Dossier & Spine', subtitle: 'Key Leaders & 12 Pivotal Flashpoints' },
          { index: 2, pages: [4, 5], label: 'Enquiry 01', subtitle: 'Ideological Clash: Capitalism vs Communism' },
          { index: 3, pages: [6, 7], label: 'Enquiry 02', subtitle: 'Yalta to Potsdam: End of Grand Alliance' },
          { index: 4, pages: [8, 9], label: 'Enquiry 03', subtitle: 'Iron Curtain & Berlin Blockade (1946–49)' },
          { index: 5, pages: [10, 11], label: 'Enquiry 04', subtitle: 'Cuban Missile Crisis (1962)' },
          { index: 6, pages: [12, 13], label: 'Enquiry 05', subtitle: 'Cold War Proxy Wars: Korea & Vietnam' },
          { index: 7, pages: [14, 15], label: 'Enquiry 06', subtitle: 'Berlin Wall & Collapse of the USSR' },
          { index: 8, pages: [16], label: 'Back Cover', subtitle: '30-Question Master Retrieval Quiz', isBackCover: true },
        ],
      },
    },
  },
  post_war_britain: makeKs3EightPageBook(
    'post_war_britain',
    'Post-War Britain',
    'Rights, Protest & Post-War Britain (1900–Present)',
    'Year 9',
    '1900–Present',
    [
      'Votes for Women: Suffragettes & 1918',
      '1945: Welfare State & Birth of NHS',
      'Empire Windrush & Pioneers',
      'Bristol Bus Boycott & Race Laws',
      'Nuclear Fear, CND & Cold War Britain',
    ],
  ),

  // =========================================================================
  // GCSE / KEY STAGE 4 (6 COURSES • 22 BOOKLETS)
  // =========================================================================
  edexcel_medicine: {
    unitTitle: 'Medicine in Britain, c1250–present & The Western Front, 1914–18',
    shortTitle: 'Medicine in Britain',
    unitCode: 'Option 11 (Paper 1)',
    badgeColor: '#0284c7',
    lessonPageType: 'medicine_eras',
    keyTopics: {
      medieval: {
        id: 'medieval',
        pillLabel: 'KT1: Medieval',
        title: 'KT1: Medicine in Medieval England (c1250–c1500)',
        shortTitle: 'KT1: Medieval Medicine',
        period: 'c1250–c1500',
        htmlUrl: '/units/edexcel_medicine/textbook_medieval_PUBLISHER.html',
        pdfUrl: '/pdfs/edexcel_medicine_textbook_medieval.pdf',
        spreads: [
          { index: 0, pages: [1], label: 'Front Cover', subtitle: 'Overview & Medieval Spine', isCover: true },
          { index: 1, pages: [2, 3], label: 'KT 1.1', subtitle: 'Supernatural & Religious Explanations' },
          { index: 2, pages: [4, 5], label: 'KT 1.2', subtitle: 'Hippocrates, Galen & Four Humours' },
          { index: 3, pages: [6, 7], label: 'KT 1.3', subtitle: 'Prevention & Treatment: Bleeding & Purging' },
          { index: 4, pages: [8, 9], label: 'KT 1.4', subtitle: 'Care Providers & Monastic Hospitals' },
          { index: 5, pages: [10, 11], label: 'KT 1.5', subtitle: 'Case Study: The Black Death (1348–49)' },
          { index: 6, pages: [12], label: 'Back Cover', subtitle: 'Master Knowledge Retrieval Quiz', isBackCover: true },
        ],
      },
      renaissance: {
        id: 'renaissance',
        pillLabel: 'KT2: Renaissance',
        title: 'KT2: The Medical Renaissance in England (c1500–c1700)',
        shortTitle: 'KT2: Medical Renaissance',
        period: 'c1500–c1700',
        htmlUrl: '/units/edexcel_medicine/textbook_renaissance_PUBLISHER.html',
        pdfUrl: '/pdfs/edexcel_medicine_textbook_renaissance.pdf',
        spreads: [
          { index: 0, pages: [1], label: 'Front Cover', subtitle: 'Overview & Renaissance Spine', isCover: true },
          { index: 1, pages: [2, 3], label: 'KT 2.1', subtitle: 'Humanism, Printing Press & Royal Society' },
          { index: 2, pages: [4, 5], label: 'KT 2.2', subtitle: 'Thomas Sydenham & Bedside Observation' },
          { index: 3, pages: [6, 7], label: 'KT 2.3', subtitle: 'Andreas Vesalius & Anatomy (1543)' },
          { index: 4, pages: [8, 9], label: 'KT 2.4', subtitle: 'William Harvey & Blood Circulation (1628)' },
          { index: 5, pages: [10, 11], label: 'KT 2.5', subtitle: 'Case Study: Great Plague of London (1665)' },
          { index: 6, pages: [12], label: 'Back Cover', subtitle: 'Master Knowledge Retrieval Quiz', isBackCover: true },
        ],
      },
      '18th_19th': {
        id: '18th_19th',
        pillLabel: 'KT3: 18th–19th C.',
        title: 'KT3: Medicine in 18th & 19th-Century Britain (c1700–c1900)',
        shortTitle: 'KT3: 18th–19th C. Medicine',
        period: 'c1700–c1900',
        htmlUrl: '/units/edexcel_medicine/textbook_18th_19th_PUBLISHER.html',
        pdfUrl: '/pdfs/edexcel_medicine_textbook_18th_19th.pdf',
        spreads: [
          { index: 0, pages: [1], label: 'Front Cover', subtitle: 'Overview & Industrial Medicine Spine', isCover: true },
          { index: 1, pages: [2, 3], label: 'KT 3.1', subtitle: 'Pasteur\'s Germ Theory & Koch\'s Microbes' },
          { index: 2, pages: [4, 5], label: 'KT 3.2', subtitle: 'Edward Jenner & Smallpox Vaccination' },
          { index: 3, pages: [6, 7], label: 'KT 3.3', subtitle: 'Nightingale, Seacole & Hospital Reform' },
          { index: 4, pages: [8, 9], label: 'KT 3.4', subtitle: 'Simpson, Lister & Surgical Revolution' },
          { index: 5, pages: [10, 11], label: 'KT 3.5', subtitle: 'John Snow, Cholera & 1875 Public Health Act' },
          { index: 6, pages: [12], label: 'Back Cover', subtitle: 'Master Knowledge Retrieval Quiz', isBackCover: true },
        ],
      },
      modern: {
        id: 'modern',
        pillLabel: 'KT4: Modern',
        title: 'KT4: Medicine in Modern Britain (c1900–present)',
        shortTitle: 'KT4: Modern Medicine',
        period: 'c1900–present',
        htmlUrl: '/units/edexcel_medicine/textbook_modern_PUBLISHER.html',
        pdfUrl: '/pdfs/edexcel_medicine_textbook_modern.pdf',
        spreads: [
          { index: 0, pages: [1], label: 'Front Cover', subtitle: 'Overview & Modern Medicine Spine', isCover: true },
          { index: 1, pages: [2, 3], label: 'KT 4.1', subtitle: 'Genetics, DNA & Human Genome Project' },
          { index: 2, pages: [4, 5], label: 'KT 4.2', subtitle: 'Lifestyle Factors & Diagnostic Tech' },
          { index: 3, pages: [6, 7], label: 'KT 4.3', subtitle: 'Magic Bullets, High-Tech Care & The NHS' },
          { index: 4, pages: [8, 9], label: 'KT 4.4', subtitle: 'Fleming, Florey, Chain & Penicillin' },
          { index: 5, pages: [10, 11], label: 'KT 4.5', subtitle: 'Public Health & Fight Against Lung Cancer' },
          { index: 6, pages: [12], label: 'Back Cover', subtitle: 'Master Knowledge Retrieval Quiz', isBackCover: true },
        ],
      },
      western_front: {
        id: 'western_front',
        pillLabel: 'KT5: Western Front',
        title: 'Section A: The British Sector of the Western Front (1914–1918)',
        shortTitle: 'Western Front (1914–18)',
        period: '1914–1918',
        htmlUrl: '/units/edexcel_medicine/textbook_western_front_PUBLISHER.html',
        pdfUrl: '/pdfs/edexcel_medicine_textbook_western_front.pdf',
        spreads: [
          { index: 0, pages: [1], label: 'Front Cover', subtitle: 'Western Front Overview & TOC', isCover: true },
          { index: 1, pages: [2], label: 'Turning Points', subtitle: '12 Pivotal Turning Points of Trauma & Surgery' },
          { index: 2, pages: [3, 4], label: 'KT 5.1', subtitle: 'British Sector, Ypres, Somme, Arras & Cambrai' },
          { index: 3, pages: [5, 6], label: 'KT 5.2', subtitle: 'Trench Mud, Trench Foot & Trench Fever' },
          { index: 4, pages: [7, 8], label: 'KT 5.3', subtitle: 'Shrapnel, Gas Attacks & Wound Infection' },
          { index: 5, pages: [9, 10], label: 'KT 5.4', subtitle: 'Chain of Evacuation: RAP, ADS, MDS & CCS' },
          { index: 6, pages: [11, 12], label: 'KT 5.5', subtitle: 'Thomas Splint, Carrel-Dakin & Mobile X-Rays' },
          { index: 7, pages: [13, 14], label: 'KT 5.6', subtitle: 'Cambrai Blood Bank, Brain & Plastic Surgery' },
          { index: 8, pages: [15, 16], label: 'Atlas & Quiz', subtitle: 'RAMC Evacuation Atlas & Retrieval Quiz' },
        ],
      },
    },
  },

  eee: {
    unitTitle: 'Early Elizabethan England, 1558–1588',
    shortTitle: 'Early Elizabethan England',
    unitCode: 'Option B4 (Paper 2)',
    badgeColor: '#0284c7',
    lessonPageType: 'gcse_kt_4',
    keyTopics: {
      KT1: makeGcseFourEnquiryKtEdition(
        'eee',
        'KT1',
        'KT1: Queen, Gov & Religion',
        'Key Topic 1: Queen, Government & Religion (1558–69)',
        '1558–1569',
        [
          'Situation on Elizabeth\'s Accession (1558)',
          'The \'Settlement\' of Religion (1559)',
          'Challenge to the Religious Settlement',
          'The Problem of Mary, Queen of Scots (1568–69)',
        ],
      ),
      KT2: makeGcseFourEnquiryKtEdition(
        'eee',
        'KT2',
        'KT2: Challenges (1569–88)',
        'Key Topic 2: Challenges to Elizabeth at Home & Abroad (1569–88)',
        '1569–1588',
        [
          'Plots and Revolts at Home (1569–87)',
          'Relations with Spain (1569–85)',
          'Outbreak of War with Spain (1585–88)',
          'The Spanish Armada: Strategy & Defeat (1588)',
        ],
      ),
      KT3: makeGcseFourEnquiryKtEdition(
        'eee',
        'KT3',
        'KT3: Society & Exploration',
        'Key Topic 3: Elizabethan Society in the Age of Exploration (1558–88)',
        '1558–1588',
        [
          'Education and Leisure in Elizabethan England',
          'The Problem of the Poor and Vagabondage',
          'Exploration and Voyages of Discovery',
          'Raleigh and the Colonisation of Virginia',
        ],
      ),
    },
  },

  cme_new: {
    unitTitle: 'Conflict in the Middle East, 1945–1995',
    shortTitle: 'Conflict in the Middle East',
    unitCode: 'Option P5 (Paper 2)',
    badgeColor: '#0284c7',
    lessonPageType: 'cme_kt',
    keyTopics: {
      KT1: {
        id: 'KT1',
        title: 'Key Topic 1: Birth of Israel & Suez (1945–63)',
        shortTitle: 'KT1: Birth of Israel',
        period: '1945–1963',
        htmlUrl: '/units/cme_new/textbook_KT1_PUBLISHER.html',
        pdfUrl: '/pdfs/cme_new_textbook_KT1.pdf',
        spreads: [
          { index: 0, pages: [1], label: 'Front Cover', subtitle: 'Overview & Canonical TOC', isCover: true },
          { index: 1, pages: [2, 3], label: 'Dossier & Spine', subtitle: 'Key Actors & Chronological Turning Points' },
          { index: 2, pages: [4, 5], label: 'Enquiry 01', subtitle: 'Broken Promises & Imperial Borders (1915–39)' },
          { index: 3, pages: [6, 7], label: 'Enquiry 02', subtitle: 'End of the Mandate & Partition (1945–49)' },
          { index: 4, pages: [8, 9], label: 'Enquiry 03', subtitle: '1948–49 War & Palestinian Refugee Crisis' },
          { index: 5, pages: [10, 11], label: 'Enquiry 04', subtitle: 'Nasser & the 1956 Suez Crisis' },
          { index: 6, pages: [12], label: 'Back Cover', subtitle: '20-Question Retrieval Quiz', isBackCover: true },
        ],
      },
      KT2: {
        id: 'KT2',
        title: 'Key Topic 2: The Escalating Conflict (1963–73)',
        shortTitle: 'KT2: Escalating Conflict',
        period: '1963–1973',
        htmlUrl: '/units/cme_new/textbook_KT2_PUBLISHER.html',
        pdfUrl: '/pdfs/cme_new_textbook_KT2.pdf',
        spreads: [
          { index: 0, pages: [1], label: 'Front Cover', subtitle: 'Overview & Canonical TOC', isCover: true },
          { index: 1, pages: [2, 3], label: 'Dossier & Spine', subtitle: 'Key Actors & Chronological Turning Points' },
          { index: 2, pages: [4, 5], label: 'Enquiry 01', subtitle: 'Water, Raids & Road to 1967 (1964–67)' },
          { index: 3, pages: [6, 7], label: 'Enquiry 02', subtitle: 'The Six-Day War (May–June 1967)' },
          { index: 4, pages: [8, 9], label: 'Enquiry 03', subtitle: 'Occupied Territories & UN Resolution 242' },
          { index: 5, pages: [10, 11], label: 'Enquiry 04', subtitle: 'PLO, Black September & Munich (1968–72)' },
          { index: 6, pages: [12, 13], label: 'Enquiry 05', subtitle: 'War of Attrition & Yom Kippur War (1969–73)' },
          { index: 7, pages: [14, 15], label: 'Glossary & Quiz I', subtitle: 'Specification Terms & Recall Qs 1–18' },
          { index: 8, pages: [16], label: 'Back Cover', subtitle: 'Recall Quiz Part II (Qs 19–30)', isBackCover: true },
        ],
      },
      KT3: {
        id: 'KT3',
        title: 'Key Topic 3: Attempts at a Solution (1974–95)',
        shortTitle: 'KT3: Attempts at a Solution',
        period: '1974–1995',
        htmlUrl: '/units/cme_new/textbook_KT3_PUBLISHER.html',
        pdfUrl: '/pdfs/cme_new_textbook_KT3.pdf',
        spreads: [
          { index: 0, pages: [1], label: 'Front Cover', subtitle: 'Overview & Canonical TOC', isCover: true },
          { index: 1, pages: [2, 3], label: 'Dossier & Spine', subtitle: 'Key Actors & Chronological Turning Points' },
          { index: 2, pages: [4, 5], label: 'Enquiry 01', subtitle: 'Shuttle Diplomacy to Camp David (1974–79)' },
          { index: 3, pages: [6, 7], label: 'Enquiry 02', subtitle: 'Lebanon, Sabra-Shatila & First Intifada' },
          { index: 4, pages: [8, 9], label: 'Enquiry 03', subtitle: 'Madrid to the Oslo Accords (1988–95)' },
          { index: 5, pages: [10, 11], label: 'Glossary & Quiz I', subtitle: 'Specification Terms & Recall Qs 1–12' },
          { index: 6, pages: [12], label: 'Back Cover', subtitle: 'Recall Quiz Part II (Qs 13–24)', isBackCover: true },
        ],
      },
    },
  },

  gcse_cold_war: {
    unitTitle: 'Superpower Relations and the Cold War, 1941–91',
    shortTitle: 'Superpower Relations & Cold War',
    unitCode: 'Option P4 (Paper 2)',
    badgeColor: '#1d4ed8',
    lessonPageType: 'gcse_kt_4',
    keyTopics: {
      KT1: makeGcseFourEnquiryKtEdition(
        'gcse_cold_war',
        'KT1',
        'KT1: Origins (1941–58)',
        'Key Topic 1: The Origins of the Cold War (1941–58)',
        '1941–1958',
        [
          'Grand Alliance & Wartime Conferences (1941–45)',
          'Telegrams, Satellite States & Containment (1946–48)',
          'Berlin Blockade, NATO & Arms Race (1948–55)',
          'Hungarian Uprising of 1956 (1953–58)',
        ],
      ),
      KT2: makeGcseFourEnquiryKtEdition(
        'gcse_cold_war',
        'KT2',
        'KT2: Crises (1958–70)',
        'Key Topic 2: Cold War Crises (1958–70)',
        '1958–1970',
        [
          'Berlin Crisis, Summits & Berlin Wall (1958–63)',
          'Cuba, Bay of Pigs & Thirteen Days (1959–68)',
          'Opposition & Dubček\'s Prague Spring (1968)',
          'Soviet Invasion & Brezhnev Doctrine (1968–70)',
        ],
      ),
      KT3: makeGcseFourEnquiryKtEdition(
        'gcse_cold_war',
        'KT3',
        'KT3: End of Cold War (1970–91)',
        'Key Topic 3: The End of the Cold War (1970–91)',
        '1970–1991',
        [
          'Détente: SALT 1, Helsinki & SALT 2 (1970–79)',
          'Afghanistan, Boycotts & Reagan\'s SDI (1979–85)',
          'Gorbachev\'s New Thinking & Summits (1985–89)',
          'Fall of Berlin Wall & Collapse of USSR (1989–91)',
        ],
      ),
    },
  },

  weimar_nazi_germany: {
    unitTitle: 'Weimar and Nazi Germany, 1918–1939',
    shortTitle: 'Weimar & Nazi Germany',
    unitCode: 'Option 31 (Paper 3)',
    badgeColor: '#0284c7',
    lessonPageType: 'gcse_kt_4',
    keyTopics: {
      KT1: makeGcseFourEnquiryKtEdition(
        'weimar_nazi_germany',
        'KT1',
        'KT1: Weimar Republic',
        'Key Topic 1: The Weimar Republic (1918–29)',
        '1918–1929',
        [
          'Origins of the Republic (1918–19)',
          'Early Challenges to the Republic (1919–23)',
          'Recovery of the Republic (1924–29)',
          'Changes in Society (1924–29)',
        ],
      ),
      KT2: makeGcseFourEnquiryKtEdition(
        'weimar_nazi_germany',
        'KT2',
        'KT2: Rise of Hitler',
        'Key Topic 2: Hitler\'s Rise to Power (1919–33)',
        '1919–1933',
        [
          'Early Development of the Nazi Party (1919–22)',
          'Munich Putsch & The Lean Years (1923–29)',
          'Growth of Nazi Support (1929–32)',
          'Hitler\'s Appointment as Chancellor (1932–33)',
        ],
      ),
      KT3: makeGcseFourEnquiryKtEdition(
        'weimar_nazi_germany',
        'KT3',
        'KT3: Nazi Dictatorship',
        'Key Topic 3: Nazi Control & Dictatorship (1933–39)',
        '1933–1939',
        [
          'Creation of a Dictatorship (1933–34)',
          'The Police State and Religion (1933–39)',
          'Controlling and Influencing Attitudes',
          'Opposition, Resistance and Conformity',
        ],
      ),
      KT4: makeGcseFourEnquiryKtEdition(
        'weimar_nazi_germany',
        'KT4',
        'KT4: Life in Nazi Germany',
        'Key Topic 4: Life in Nazi Germany (1933–39)',
        '1933–1939',
        [
          'Nazi Policies Towards Women (1933–39)',
          'Nazi Policies Towards the Young (1933–39)',
          'Employment and Living Standards (1933–39)',
          'The Persecution of Minorities (1933–39)',
        ],
      ),
    },
  },

  usa: {
    unitTitle: 'The USA, 1954–75: Conflict at Home and Abroad',
    shortTitle: 'The USA, 1954–1975',
    unitCode: 'Option 33 (Paper 3)',
    badgeColor: '#0284c7',
    lessonPageType: 'gcse_kt_4',
    keyTopics: {
      KT1: makeGcseFourEnquiryKtEdition(
        'usa',
        'KT1',
        'KT1: Civil Rights (1954–60)',
        'Key Topic 1: Development of Civil Rights (1954–60)',
        '1954–1960',
        [
          'Segregation & Early Civil Rights (c.1950–54)',
          'Education: Brown v. Topeka & Little Rock',
          'The Montgomery Bus Boycott (1955–56)',
          'Southern White Resistance & The KKK',
        ],
      ),
      KT2: makeGcseFourEnquiryKtEdition(
        'usa',
        'KT2',
        'KT2: Protest & Radicalism',
        'Key Topic 2: Protest, Progress & Radicalism (1960–75)',
        '1960–1975',
        [
          'Sit-Ins, Freedom Rides & James Meredith',
          'Birmingham, Selma & 1964–65 Laws',
          'Malcolm X, Black Power & Black Panthers',
          'Urban Riots, King\'s Assassination & 1975',
        ],
      ),
      KT3: makeGcseFourEnquiryKtEdition(
        'usa',
        'KT3',
        'KT3: US in Vietnam',
        'Key Topic 3: US Involvement in the Vietnam War (1954–75)',
        '1954–1975',
        [
          'Early US Involvement & Ngo Dinh Diem',
          'Escalation Under Johnson & Gulf of Tonkin',
          'Vietcong Guerrilla Tactics vs US Warfare',
          'Tet Offensive, Nixon & Vietnamisation',
        ],
      ),
      KT4: makeGcseFourEnquiryKtEdition(
        'usa',
        'KT4',
        'KT4: Opposition & Exit',
        'Key Topic 4: Reactions & End of US Involvement (1964–75)',
        '1964–1975',
        [
          'Growing Opposition: Media, My Lai & Kent State',
          'Support for the War & \'Silent Majority\'',
          'Paris Peace Accords & Fall of Saigon',
          'Explaining US Failure in Vietnam',
        ],
      ),
    },
  },
};

/**
 * Resolve exact physical textbook page/spread anchor for any lesson across all 26 units.
 */
export function getLessonTextbookLocator(unitId, lessonIndex = 0, lesson = null) {
  const unitCfg = TEXTBOOK_CATALOG[unitId];
  if (!unitCfg) return null;

  const idx = Math.max(0, Number(lessonIndex) || 0);
  const type = unitCfg.lessonPageType;

  const buildResult = (ktId, page, endPage, spreadIndex, prefixOverride = '') => {
    const ktData = unitCfg.keyTopics[ktId];
    if (!ktData) return null;
    const pageLabel = endPage && endPage !== page ? `pp. ${page}–${endPage}` : `Page ${page}`;
    const prefix = prefixOverride || (ktId === 'MAIN' ? 'Textbook' : `${ktId} Textbook`);
    return {
      unitId,
      ktId,
      page,
      endPage: endPage || page,
      pageLabel,
      fullLabel: `${prefix}: ${pageLabel}`,
      spreadIndex,
      htmlUrl: ktData.htmlUrl,
      pdfUrl: ktData.pdfUrl,
    };
  };

  if (type === 'ks2_12p') {
    const page = Math.min(9, idx + 4);
    const spreadIdx = Math.floor(page / 2); // 4,5 -> 2; 6,7 -> 3; 8,9 -> 4
    return buildResult('MAIN', page, page, spreadIdx, 'Textbook');
  }

  if (type === 'ks2_16p') {
    const page = Math.min(13, idx + 3);
    const spreadIdx = Math.floor(page / 2); // 3 -> 1; 4,5 -> 2 ... 12,13 -> 6
    return buildResult('MAIN', page, page, spreadIdx, 'Textbook');
  }

  if (type === 'ks3_8p') {
    if (idx >= 5 || /assessment\s+masterclass|synoptic\s+assessment/i.test(lesson?.title || '')) {
      return buildResult('MAIN', 8, 8, 4, 'Textbook Quiz');
    }
    const page = idx + 3; // 3..7
    const spreadIdx = Math.floor(page / 2); // 3 -> 1; 4,5 -> 2; 6,7 -> 3
    return buildResult('MAIN', page, page, spreadIdx, 'Textbook');
  }

  if (type === 'ks3_12p') {
    const page = Math.min(9, idx + 3); // 3..9
    const spreadIdx = Math.floor(page / 2);
    return buildResult('MAIN', page, page, spreadIdx, 'Textbook');
  }

  if (type === 'ks3_16p_spreads') {
    if (idx >= 6 || /synoptic\s+assessment/i.test(lesson?.title || '')) {
      return buildResult('MAIN', 16, 16, 8, 'Textbook Quiz');
    }
    const page = 4 + idx * 2;
    return buildResult('MAIN', page, page + 1, 2 + idx, 'Textbook');
  }

  if (type === 'cme_kt') {
    if (idx <= 3) {
      const k = idx;
      return buildResult('KT1', 4 + k * 2, 5 + k * 2, 2 + k, 'KT1 Textbook');
    }
    if (idx <= 8) {
      const k = idx - 4;
      return buildResult('KT2', 4 + k * 2, 5 + k * 2, 2 + k, 'KT2 Textbook');
    }
    const k = Math.min(2, idx - 9);
    return buildResult('KT3', 4 + k * 2, 5 + k * 2, 2 + k, 'KT3 Textbook');
  }

  if (type === 'gcse_kt_4') {
    const ktNum = Math.floor(idx / 4) + 1;
    const ktId = `KT${ktNum}`;
    const k = idx % 4;
    if (!unitCfg.keyTopics[ktId]) return null;
    return buildResult(ktId, 4 + k * 2, 5 + k * 2, 2 + k, `${ktId} Textbook`);
  }

  if (type === 'medicine_eras') {
    if (idx <= 4) {
      const k = idx;
      return buildResult('medieval', 2 + k * 2, 3 + k * 2, 1 + k, 'KT1 Textbook');
    }
    if (idx <= 9) {
      const k = idx - 5;
      return buildResult('renaissance', 2 + k * 2, 3 + k * 2, 1 + k, 'KT2 Textbook');
    }
    if (idx <= 14) {
      const k = idx - 10;
      return buildResult('18th_19th', 2 + k * 2, 3 + k * 2, 1 + k, 'KT3 Textbook');
    }
    if (idx <= 19) {
      const k = idx - 15;
      return buildResult('modern', 2 + k * 2, 3 + k * 2, 1 + k, 'KT4 Textbook');
    }
    const k = Math.min(5, idx - 20);
    return buildResult('western_front', 3 + k * 2, 4 + k * 2, 2 + k, 'Western Front Textbook');
  }

  return null;
}

// Internal Cache for Parsed Textbook Documents
const parsedBookCache = new Map();

// Active Reader State
let currentReader = {
  unitId: 'cme_new',
  ktId: 'KT1',
  spreadIndex: 1,
  viewMode: 'dual', // 'dual' | 'single'
  userForcedMode: false,
  singlePageIndex: 2, // 1-indexed page number
  zoomLevel: 1.0,
  panX: 0,
  panY: 0,
  isAudioPlaying: false,
  isAudioPaused: false,
  audioUtterance: null,
  iframeLoaded: false,
  returnView: 'lessons',
  returnLessonIndex: null,
};

function getDefaultKtId(unitId) {
  const keys = Object.keys(TEXTBOOK_CATALOG[unitId]?.keyTopics || {});
  return keys[0] || 'MAIN';
}

function findSpreadIndexForPage(ktData, pageNum) {
  if (!ktData || !Array.isArray(ktData.spreads)) return 0;
  const match = ktData.spreads.find((s) => Array.isArray(s.pages) && s.pages.includes(pageNum));
  if (match) return match.index;
  if (pageNum <= 1) return 0;
  return ktData.spreads.length - 1;
}

function isMobileReaderSingleDefault() {
  if (typeof window === 'undefined') return false;
  const isPortraitNarrow = window.innerWidth < 768 && window.innerHeight >= window.innerWidth;
  return isPortraitNarrow || window.innerWidth < 900;
}

function isMobileTouchOrStandalonePrintFallback() {
  if (typeof window === 'undefined') return false;
  const isStandalone =
    Boolean(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator?.standalone === true;
  const isMobileUa = /Android|iPhone|iPad|iPod/i.test(window.navigator?.userAgent || '');
  const isNarrowTouch =
    window.innerWidth < 933 && ('ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0);
  const printMissing = typeof window.print !== 'function';
  return isStandalone || isMobileUa || isNarrowTouch || printMissing;
}

function showReaderToast(message, sharePayload = null) {
  const root = document.getElementById('digital-reader-root');
  if (!root) return;
  let toast = document.getElementById('reader-mobile-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'reader-mobile-toast';
    toast.className = 'reader-mobile-toast';
    root.appendChild(toast);
  }
  const canShare = Boolean(sharePayload && typeof navigator !== 'undefined' && navigator.share);
  toast.innerHTML = `
    <span><i class="fa-solid fa-file-pdf"></i> ${message}</span>
    ${canShare ? '<button type="button" id="reader-toast-share-btn" class="reader-toast-share-btn"><i class="fa-solid fa-share-nodes"></i> Share</button>' : ''}
  `;
  toast.classList.add('is-visible');
  if (canShare) {
    const shareBtn = toast.querySelector('#reader-toast-share-btn');
    if (shareBtn) {
      shareBtn.onclick = () => {
        navigator.share(sharePayload).catch(() => {});
      };
    }
  }
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 4200);
}

function openOrShareTextbookPdfFallback() {
  const unitConfig = TEXTBOOK_CATALOG[currentReader.unitId];
  const ktData = unitConfig?.keyTopics?.[currentReader.ktId];
  const pdfUrl = ktData?.pdfUrl || document.getElementById('reader-btn-download')?.getAttribute('href');
  if (!pdfUrl || pdfUrl === '#') return;

  const absUrl = new URL(pdfUrl, window.location.origin).href;
  const sharePayload = {
    title: `${unitConfig?.unitTitle || 'History Textbook'} — ${ktData?.shortTitle || currentReader.ktId}`,
    url: absUrl,
  };

  const isStandalone =
    Boolean(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator?.standalone === true;

  const openedWin = window.open(pdfUrl, '_blank', 'noopener');
  if (!openedWin && isStandalone && typeof navigator !== 'undefined' && navigator.share) {
    navigator.share(sharePayload).catch(() => {
      window.location.href = pdfUrl;
    });
    return;
  }
  showReaderToast('Opened high-res PDF for mobile printing or saving', sharePayload);
}

/**
 * Fetch and extract pages and CSS styles from any published textbook HTML file
 * across Unified Engine (.textbook-page), KS2 Print Suite (.tb-page), and Medicine (div.page).
 */
async function loadTextbookData(unitId, ktId) {
  const cacheKey = `${unitId}_${ktId}`;
  if (parsedBookCache.has(cacheKey)) {
    return parsedBookCache.get(cacheKey);
  }

  const unitConfig = TEXTBOOK_CATALOG[unitId];
  if (!unitConfig || !unitConfig.keyTopics[ktId]) {
    throw new Error(`Textbook configuration not found for ${unitId} (${ktId})`);
  }

  const ktData = unitConfig.keyTopics[ktId];
  const response = await fetch(ktData.htmlUrl);
  if (!response.ok) {
    throw new Error(`Failed to load textbook HTML (${response.status}) from ${ktData.htmlUrl}`);
  }

  const htmlText = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');

  const fontLinks = Array.from(
    doc.querySelectorAll('link[rel="stylesheet"], link[rel="preconnect"]'),
  )
    .map((el) => el.outerHTML)
    .join('\n');

  const styleContents = Array.from(doc.querySelectorAll('style'))
    .map((el) => el.textContent)
    .join('\n');

  // Support all 3 page container classes while preserving outer attributes, classes & cover gradients
  let rawPages = Array.from(doc.querySelectorAll('.textbook-page'));
  if (rawPages.length === 0) {
    rawPages = Array.from(doc.querySelectorAll('.tb-page'));
  }
  if (rawPages.length === 0) {
    rawPages = Array.from(doc.body.children).filter(
      (el) => el.classList && el.classList.contains('page'),
    );
  }
  if (rawPages.length === 0) {
    rawPages = Array.from(doc.querySelectorAll('section.page, div.page'));
  }

  const pagesHtml = rawPages.map((pageEl) => {
    const clone = pageEl.cloneNode(true);
    clone
      .querySelectorAll('.screen-toolbar, .no-print-toolbar, .print-bar')
      .forEach((t) => t.remove());
    return clone.outerHTML;
  });

  const bundle = {
    unitId,
    ktId,
    fontLinks,
    styleContents,
    pagesHtml,
    pageCount: pagesHtml.length,
    ktData,
  };

  parsedBookCache.set(cacheKey, bundle);
  return bundle;
}

/**
 * Primary View Renderer for the Dual-Spread Digital Reader
 */
export async function renderDigitalReaderView(param, targetContainer = null) {
  const contentArea = targetContainer || document.getElementById('main-content');
  if (!contentArea) return;

  // Parse param: "unitId:ktId:spreadIndex:pageNum"
  let initialUnit = state.selectedUnitId && TEXTBOOK_CATALOG[state.selectedUnitId]
    ? state.selectedUnitId
    : 'cme_new';
  let initialKT = getDefaultKtId(initialUnit);
  let initialSpread = 0;
  let explicitPage = null;

  let resolvedParam = param;
  if (
    resolvedParam &&
    !String(resolvedParam).includes(':') &&
    typeof window !== 'undefined'
  ) {
    const bookParam = new URLSearchParams(window.location.search).get('book');
    if (bookParam) {
      resolvedParam = `${resolvedParam}:${bookParam}`;
    }
  }

  if (resolvedParam) {
    const parts = String(resolvedParam).split(':');
    if (parts[0] && TEXTBOOK_CATALOG[parts[0]]) {
      initialUnit = parts[0];
      initialKT = getDefaultKtId(initialUnit);
    }
    if (parts[1] && TEXTBOOK_CATALOG[initialUnit]?.keyTopics?.[parts[1]]) {
      initialKT = parts[1];
    }
    if (parts[2] !== undefined && parts[2] !== '' && !isNaN(parseInt(parts[2], 10))) {
      initialSpread = parseInt(parts[2], 10);
    }
    if (parts[3] !== undefined && parts[3] !== '' && !isNaN(parseInt(parts[3], 10))) {
      explicitPage = parseInt(parts[3], 10);
    }
  }

  const unitConfig = TEXTBOOK_CATALOG[initialUnit];
  const ktData = unitConfig.keyTopics[initialKT];
  const clampedSpread = Math.max(0, Math.min(ktData.spreads.length - 1, initialSpread));

  currentReader.unitId = initialUnit;
  currentReader.ktId = initialKT;
  currentReader.spreadIndex = explicitPage
    ? findSpreadIndexForPage(ktData, explicitPage)
    : clampedSpread;
  const activeSpreadObj = ktData.spreads[currentReader.spreadIndex] || ktData.spreads[0];
  currentReader.singlePageIndex = explicitPage || activeSpreadObj.pages[0] || 1;
  currentReader.zoomLevel = 1.0;
  currentReader.panX = 0;
  currentReader.panY = 0;
  currentReader.userForcedMode = false;

  if (isMobileReaderSingleDefault()) {
    currentReader.viewMode = 'single';
  } else {
    currentReader.viewMode = 'dual';
  }

  const ktEntries = Object.values(unitConfig.keyTopics);
  const hasMultipleEditions = ktEntries.length > 1;
  const exitBtnLabel =
    typeof currentReader.returnLessonIndex === 'number' && currentReader.returnLessonIndex >= 0
      ? 'Back to Lesson'
      : currentReader.returnView === 'department-portal'
        ? 'Portal'
        : 'Unit';

  contentArea.innerHTML = `
    <div id="digital-reader-root" style="display: flex; flex-direction: column; width: 100%; height: calc(100vh - 70px); max-height: calc(100vh - 70px); background: #090d16; color: #f8fafc; font-family: 'Inter', system-ui, -apple-system, sans-serif; position: relative; overflow: hidden; box-sizing: border-box;">
      
      <!-- Top Archival Navigation & Toolstrip -->
      <header style="background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 6px 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; z-index: 40; box-shadow: 0 4px 20px rgba(0,0,0,0.4); flex-shrink: 0;">
        
        <!-- Left: Back Button & Topic Selector -->
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: nowrap;">
          <button id="reader-btn-exit" type="button" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); color: #cbd5e1; border-radius: 6px; padding: 5px 10px; font-size: 0.76rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.15s ease; white-space: nowrap;" title="Exit Textbook Reader">
            <i class="fa-solid fa-arrow-left"></i> ${exitBtnLabel}
          </button>

          <div style="height: 22px; width: 1px; background: rgba(255, 255, 255, 0.15);"></div>

          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 0.62rem; font-weight: 900; letter-spacing: 0.06em; text-transform: uppercase; background: rgba(2, 132, 199, 0.2); color: #38bdf8; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.35); white-space: nowrap;">
              FLIPBOOK READER
            </span>

            ${
              hasMultipleEditions
                ? `
              <div id="reader-topic-pills" style="display: flex; align-items: center; background: rgba(0, 0, 0, 0.35); padding: 2px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.08); gap: 3px; flex-wrap: wrap;">
                ${ktEntries
                  .map(
                    (ed) => `
                  <button type="button" data-kt="${ed.id}" class="reader-kt-pill" style="background: ${currentReader.ktId === ed.id ? '#0284c7' : 'transparent'}; color: ${currentReader.ktId === ed.id ? '#ffffff' : '#94a3b8'}; border: none; border-radius: 4px; padding: 3px 8px; font-size: 0.72rem; font-weight: 800; cursor: pointer; transition: all 0.15s ease; white-space: nowrap;">
                    ${ed.pillLabel || ed.id}
                  </button>
                `,
                  )
                  .join('')}
              </div>
            `
                : `
              <span style="font-size: 0.78rem; font-weight: 800; color: #e2e8f0; white-space: nowrap;">
                ${unitConfig.shortTitle || unitConfig.unitTitle}
              </span>
            `
            }
          </div>
        </div>

        <!-- Center: Current Spread Title & Pagination -->
        <div style="display: flex; flex-direction: column; align-items: center; text-align: center; min-width: 0; flex: 1 1 160px;">
          <div id="reader-spread-badge" style="font-size: 0.68rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.04em;">
            Loading Textbook...
          </div>
          <div id="reader-spread-title" style="font-size: 0.86rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em; max-width: clamp(160px, 26vw, 420px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            Preparing Archival Spread...
          </div>
        </div>

        <!-- Right: Audio, View Mode, Zoom & PDF Tools -->
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          
          <button id="reader-btn-audio" type="button" style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; border-radius: 6px; padding: 6px 12px; font-size: 0.76rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;" title="Read Active Page or Spread Aloud">
            <i class="fa-solid fa-volume-high"></i> <span id="reader-audio-label">${currentReader.viewMode === 'single' ? 'Read Page' : 'Read Spread'}</span>
          </button>

          <div style="display: flex; align-items: center; background: rgba(0, 0, 0, 0.35); padding: 3px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.08); gap: 2px;">
            <button id="reader-btn-mode-dual" type="button" style="background: ${currentReader.viewMode === 'dual' ? '#334155' : 'transparent'}; color: ${currentReader.viewMode === 'dual' ? '#ffffff' : '#94a3b8'}; border: none; border-radius: 4px; padding: 4px 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer;" title="Two-Page Spread Mode">
              <i class="fa-solid fa-book-open"></i> Spread
            </button>
            <button id="reader-btn-mode-single" type="button" style="background: ${currentReader.viewMode === 'single' ? '#334155' : 'transparent'}; color: ${currentReader.viewMode === 'single' ? '#ffffff' : '#94a3b8'}; border: none; border-radius: 4px; padding: 4px 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer;" title="Single Page Mode">
              <i class="fa-solid fa-file"></i> Page
            </button>
          </div>

          <div style="display: flex; align-items: center; background: rgba(0, 0, 0, 0.35); padding: 3px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.08); gap: 4px;">
            <button id="reader-btn-zoom-out" type="button" style="background: transparent; border: none; color: #cbd5e1; padding: 4px 8px; cursor: pointer; font-size: 0.8rem;" title="Zoom Out">-</button>
            <button id="reader-btn-zoom-fit" type="button" style="background: transparent; border: none; color: #38bdf8; padding: 2px 6px; cursor: pointer; font-size: 0.72rem; font-weight: 800;" title="Reset Zoom to Fit">FIT</button>
            <button id="reader-btn-zoom-in" type="button" style="background: transparent; border: none; color: #cbd5e1; padding: 4px 8px; cursor: pointer; font-size: 0.8rem;" title="Zoom In">+</button>
          </div>

          <button id="reader-btn-print" type="button" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); color: #cbd5e1; border-radius: 6px; padding: 6px 10px; font-size: 0.76rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;" title="Print Active Spread">
            <i class="fa-solid fa-print"></i>
          </button>
          
          <a id="reader-btn-download" href="#" target="_blank" download style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); color: #34d399; border-radius: 6px; padding: 6px 12px; font-size: 0.76rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;" title="Download Official High-Res PDF">
            <i class="fa-solid fa-file-arrow-down"></i> PDF
          </a>

          <button id="reader-btn-fullscreen" type="button" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); color: #cbd5e1; border-radius: 6px; width: 32px; height: 32px; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center;" title="Toggle Fullscreen">
            <i class="fa-solid fa-expand"></i>
          </button>

        </div>
      </header>

      <!-- Main Stage Viewport -->
      <main id="reader-viewport" style="flex: 1; min-height: 0; position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at center, #131d31 0%, #080c14 100%); overflow: hidden; touch-action: none;">
        
        <div id="reader-loader" style="position: absolute; display: flex; flex-direction: column; align-items: center; gap: 14px; color: #94a3b8; font-size: 0.95rem; font-weight: 600; z-index: 10;">
          <div style="width: 44px; height: 44px; border: 3px solid rgba(56, 189, 248, 0.2); border-top-color: #38bdf8; border-radius: 50%; animation: readerSpin 0.8s linear infinite;"></div>
          <span>Loading Classroom Textbook...</span>
        </div>

        <button id="reader-arrow-prev" type="button" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; border-radius: 50%; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.15); color: #ffffff; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 30; transition: all 0.2s ease; box-shadow: 0 4px 16px rgba(0,0,0,0.5);" title="Previous Spread (Left Arrow)">
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <button id="reader-arrow-next" type="button" style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; border-radius: 50%; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.15); color: #ffffff; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 30; transition: all 0.2s ease; box-shadow: 0 4px 16px rgba(0,0,0,0.5);" title="Next Spread (Right Arrow)">
          <i class="fa-solid fa-chevron-right"></i>
        </button>

        <iframe id="readerStageIframe" src="about:blank" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; background: transparent; opacity: 0; transition: opacity 0.25s ease; z-index: 5;"></iframe>

      </main>

      <!-- Bottom Filmstrip -->
      <footer style="background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-top: 1px solid rgba(255, 255, 255, 0.1); padding: 8px 16px; display: flex; align-items: center; justify-content: center; z-index: 40; box-shadow: 0 -4px 20px rgba(0,0,0,0.3); flex-shrink: 0;">
        <div id="reader-filmstrip" style="display: flex; align-items: center; gap: 8px; overflow-x: auto; max-width: 100%; padding: 4px 2px; scrollbar-width: thin;"></div>
      </footer>

      <style>
        #digital-reader-root:fullscreen,
        #digital-reader-root:-webkit-full-screen {
          height: 100vh !important;
          max-height: 100vh !important;
        }
        @keyframes readerSpin {
          to { transform: rotate(360deg); }
        }
        .reader-kt-pill:hover {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.1) !important;
        }
        .reader-filmstrip-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 6px 12px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          user-select: none;
        }
        .reader-filmstrip-tab:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.2);
        }
        .reader-filmstrip-tab.active {
          background: #0284c7;
          border-color: #38bdf8;
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(2, 132, 199, 0.4);
        }
        .reader-filmstrip-tab.active span.badge {
          background: #ffffff;
          color: #0369a1;
        }
        #reader-arrow-prev:hover, #reader-arrow-next:hover {
          background: #0284c7 !important;
          border-color: #38bdf8 !important;
          transform: translateY(-50%) scale(1.08) !important;
        }
        @keyframes pulseEqualizer {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.04); }
        }
        .audio-playing {
          animation: pulseEqualizer 1.5s ease-in-out infinite;
          background: #d97706 !important;
          color: #ffffff !important;
          border-color: #f59e0b !important;
        }
      </style>
    </div>
  `;

  attachReaderEvents();
  await loadAndDisplaySpread();
}

function attachReaderEvents() {
  const btnExit = document.getElementById('reader-btn-exit');
  if (btnExit) {
    btnExit.onclick = () => {
      stopAudioNarration();
      const targetUnit = currentReader.unitId;
      const savedLessonIdx = currentReader.returnLessonIndex;
      const savedView = currentReader.returnView;
      currentReader.returnLessonIndex = null;
      currentReader.returnView = 'lessons';

      if (savedView === 'department-portal' && window.switchView) {
        window.switchView('department-portal');
        return;
      }
      if (window.switchView) {
        Promise.resolve(window.switchView('lessons', targetUnit)).then(() => {
          if (
            typeof savedLessonIdx === 'number' &&
            savedLessonIdx >= 0 &&
            typeof window.viewLessonDetail === 'function'
          ) {
            setTimeout(() => {
              window.viewLessonDetail(savedLessonIdx);
            }, 60);
          }
        });
      }
    };
  }

  const topicPills = document.querySelectorAll('.reader-kt-pill');
  topicPills.forEach((pill) => {
    pill.onclick = async () => {
      const kt = pill.dataset.kt;
      if (kt && kt !== currentReader.ktId) {
        stopAudioNarration();
        currentReader.ktId = kt;
        currentReader.spreadIndex = 0;
        currentReader.singlePageIndex = 1;
        updateTopicPillsUI();
        await loadAndDisplaySpread();
      }
    };
  });

  const btnPrev = document.getElementById('reader-arrow-prev');
  const btnNext = document.getElementById('reader-arrow-next');
  if (btnPrev) btnPrev.onclick = () => navigateSpread(-1);
  if (btnNext) btnNext.onclick = () => navigateSpread(1);

  const btnDual = document.getElementById('reader-btn-mode-dual');
  const btnSingle = document.getElementById('reader-btn-mode-single');
  const syncModeButtonsUI = () => {
    const isDual = currentReader.viewMode === 'dual';
    if (btnDual) {
      btnDual.style.background = isDual ? '#334155' : 'transparent';
      btnDual.style.color = isDual ? '#ffffff' : '#94a3b8';
    }
    if (btnSingle) {
      btnSingle.style.background = !isDual ? '#334155' : 'transparent';
      btnSingle.style.color = !isDual ? '#ffffff' : '#94a3b8';
    }
    if (!currentReader.isAudioPlaying) {
      const audioLabel = document.getElementById('reader-audio-label');
      if (audioLabel) audioLabel.textContent = isDual ? 'Read Spread' : 'Read Page';
    }
  };
  if (btnDual) {
    btnDual.onclick = () => {
      currentReader.userForcedMode = true;
      if (currentReader.viewMode !== 'dual') {
        currentReader.viewMode = 'dual';
        const ktData = TEXTBOOK_CATALOG[currentReader.unitId]?.keyTopics?.[currentReader.ktId];
        if (ktData) {
          currentReader.spreadIndex = findSpreadIndexForPage(ktData, currentReader.singlePageIndex);
        }
        syncModeButtonsUI();
        renderSpreadInIframe();
      }
    };
  }
  if (btnSingle) {
    btnSingle.onclick = () => {
      currentReader.userForcedMode = true;
      if (currentReader.viewMode !== 'single') {
        currentReader.viewMode = 'single';
        syncModeButtonsUI();
        renderSpreadInIframe();
      }
    };
  }

  const btnZoomIn = document.getElementById('reader-btn-zoom-in');
  const btnZoomOut = document.getElementById('reader-btn-zoom-out');
  const btnZoomFit = document.getElementById('reader-btn-zoom-fit');

  if (btnZoomIn) {
    btnZoomIn.onclick = () => {
      currentReader.zoomLevel = Math.min(currentReader.zoomLevel + 0.2, 3.2);
      applyIframeZoom();
    };
  }
  if (btnZoomOut) {
    btnZoomOut.onclick = () => {
      currentReader.zoomLevel = Math.max(currentReader.zoomLevel - 0.2, 0.5);
      if (currentReader.zoomLevel <= 1.02) {
        currentReader.panX = 0;
        currentReader.panY = 0;
      }
      applyIframeZoom();
    };
  }
  if (btnZoomFit) {
    btnZoomFit.onclick = () => {
      currentReader.zoomLevel = 1.0;
      currentReader.panX = 0;
      currentReader.panY = 0;
      applyIframeZoom(true);
    };
  }

  const btnAudio = document.getElementById('reader-btn-audio');
  if (btnAudio) {
    btnAudio.onclick = () => toggleAudioNarration();
  }

  const btnPrint = document.getElementById('reader-btn-print');
  if (btnPrint) {
    btnPrint.onclick = () => {
      const iframe = document.getElementById('readerStageIframe');
      const canPrintIframe =
        iframe &&
        iframe.contentWindow &&
        typeof iframe.contentWindow.print === 'function' &&
        !isMobileTouchOrStandalonePrintFallback();
      if (!canPrintIframe) {
        openOrShareTextbookPdfFallback();
        return;
      }
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        openOrShareTextbookPdfFallback();
      }
    };
  }

  const btnFullscreen = document.getElementById('reader-btn-fullscreen');
  if (btnFullscreen) {
    btnFullscreen.onclick = () => {
      const root = document.getElementById('digital-reader-root');
      if (!document.fullscreenElement) {
        if (root && root.requestFullscreen) root.requestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    };
  }

  const readerViewport = document.getElementById('reader-viewport');
  if (readerViewport) {
    bindZoomAndPanGestures(readerViewport);
  }

  if (!window.__hhReaderFullscreenBound) {
    window.__hhReaderFullscreenBound = true;
    document.addEventListener('fullscreenchange', () => {
      if (!document.getElementById('digital-reader-root')) return;
      setTimeout(() => applyIframeZoom(currentReader.zoomLevel <= 1.02), 60);
    });
  }

  window.onkeydown = (e) => {
    if (!document.getElementById('digital-reader-root')) return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      navigateSpread(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      navigateSpread(-1);
    } else if (e.key === ' ' && !e.target.matches('input, textarea')) {
      e.preventDefault();
      navigateSpread(1);
    } else if (e.key === 'f' || e.key === 'F') {
      if (btnFullscreen) btnFullscreen.click();
    } else if (e.key === 'Escape' && document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  window.onresize = () => {
    if (!document.getElementById('digital-reader-root')) return;
    if (!currentReader.userForcedMode) {
      const wantSingle = isMobileReaderSingleDefault();
      const targetMode = wantSingle ? 'single' : 'dual';
      if (currentReader.viewMode !== targetMode) {
        currentReader.viewMode = targetMode;
        syncModeButtonsUI();
        renderSpreadInIframe();
        return;
      }
    }
    applyIframeZoom(true);
  };
}

function updateTopicPillsUI() {
  const topicPills = document.querySelectorAll('.reader-kt-pill');
  topicPills.forEach((pill) => {
    const isTarget = pill.dataset.kt === currentReader.ktId;
    pill.style.background = isTarget ? '#0284c7' : 'transparent';
    pill.style.color = isTarget ? '#ffffff' : '#94a3b8';
  });
}

function navigateSpread(direction) {
  stopAudioNarration();
  currentReader.zoomLevel = 1.0;
  currentReader.panX = 0;
  currentReader.panY = 0;

  const unitConfig = TEXTBOOK_CATALOG[currentReader.unitId];
  const ktData = unitConfig.keyTopics[currentReader.ktId];
  const maxSpread = ktData.spreads.length - 1;

  if (currentReader.viewMode === 'single') {
    const cacheKey = `${currentReader.unitId}_${currentReader.ktId}`;
    const lastPages = ktData.spreads[maxSpread].pages;
    const maxPages = parsedBookCache.get(cacheKey)?.pageCount || lastPages[lastPages.length - 1] || 12;
    const newPage = currentReader.singlePageIndex + direction;
    if (newPage >= 1 && newPage <= maxPages) {
      currentReader.singlePageIndex = newPage;
      currentReader.spreadIndex = findSpreadIndexForPage(ktData, newPage);
      renderSpreadInIframe();
    }
  } else {
    const newSpread = currentReader.spreadIndex + direction;
    if (newSpread >= 0 && newSpread <= maxSpread) {
      currentReader.spreadIndex = newSpread;
      currentReader.singlePageIndex = ktData.spreads[newSpread].pages[0] || 1;
      renderSpreadInIframe();
    }
  }
}

async function loadAndDisplaySpread() {
  const loader = document.getElementById('reader-loader');
  const iframe = document.getElementById('readerStageIframe');
  if (loader) loader.style.display = 'flex';
  if (iframe) iframe.style.opacity = '0';

  try {
    const bundle = await loadTextbookData(currentReader.unitId, currentReader.ktId);

    const btnDownload = document.getElementById('reader-btn-download');
    if (btnDownload) {
      btnDownload.href = bundle.ktData.pdfUrl;
      const dlSuffix = currentReader.ktId === 'MAIN' ? '' : `_${currentReader.ktId}`;
      btnDownload.download = `${currentReader.unitId}_textbook${dlSuffix}.pdf`;
    }

    renderFilmstrip(bundle.ktData);
    renderSpreadInIframe(bundle);
  } catch (err) {
    console.error('Failed to render textbook spread:', err);
    if (loader) {
      loader.innerHTML = `
        <i class="fa-solid fa-triangle-exclamation" style="color: #ef4444; font-size: 2rem;"></i>
        <span style="color: #f87171;">Failed to load textbook: ${err.message}</span>
        <button type="button" onclick="window.renderDigitalReaderView('${currentReader.unitId}:${currentReader.ktId}')" style="background: #0284c7; color: #fff; border: none; padding: 6px 14px; border-radius: 4px; font-weight: 700; cursor: pointer;">
          Retry Loading
        </button>
      `;
    }
  }
}

function renderFilmstrip(ktData) {
  const filmstrip = document.getElementById('reader-filmstrip');
  if (!filmstrip) return;

  filmstrip.innerHTML = ktData.spreads
    .map((spread) => {
      const isActive = spread.index === currentReader.spreadIndex;
      const pageLabel =
        spread.pages.length === 1
          ? `p. ${spread.pages[0]}`
          : `pp. ${spread.pages[0]}–${spread.pages[1]}`;

      return `
      <div class="reader-filmstrip-tab ${isActive ? 'active' : ''}" data-index="${spread.index}" onclick="window.jumpToSpread(${spread.index})">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
          <span style="font-size: 0.62rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;">${spread.label}</span>
          <span class="badge" style="font-size: 0.6rem; font-weight: 800; padding: 1px 4px; border-radius: 2px; background: rgba(255, 255, 255, 0.15); color: inherit;">
            ${pageLabel}
          </span>
        </div>
        <span style="font-size: 0.68rem; opacity: 0.85; max-width: 155px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${spread.subtitle}
        </span>
      </div>
    `;
    })
    .join('');
}

window.jumpToSpread = function (index) {
  stopAudioNarration();
  currentReader.zoomLevel = 1.0;
  currentReader.panX = 0;
  currentReader.panY = 0;
  const ktData = TEXTBOOK_CATALOG[currentReader.unitId]?.keyTopics?.[currentReader.ktId];
  currentReader.spreadIndex = index;
  currentReader.singlePageIndex = ktData?.spreads?.[index]?.pages?.[0] || (index === 0 ? 1 : index * 2);
  renderSpreadInIframe();
};

function renderSpreadInIframe(preloadedBundle = null) {
  const cacheKey = `${currentReader.unitId}_${currentReader.ktId}`;
  const bundle = preloadedBundle || parsedBookCache.get(cacheKey);
  if (!bundle) return;

  const iframe = document.getElementById('readerStageIframe');
  const loader = document.getElementById('reader-loader');
  const spreadTitleEl = document.getElementById('reader-spread-title');
  const spreadBadgeEl = document.getElementById('reader-spread-badge');
  const btnPrev = document.getElementById('reader-arrow-prev');
  const btnNext = document.getElementById('reader-arrow-next');

  if (!iframe) return;

  const ktData = bundle.ktData;
  const currentSpread = ktData.spreads[currentReader.spreadIndex] || ktData.spreads[0];
  const isOnePageSpread = currentSpread.pages.length === 1;

  if (spreadBadgeEl) {
    if (currentReader.viewMode === 'single') {
      spreadBadgeEl.textContent = `${bundle.ktData.shortTitle} • Page ${currentReader.singlePageIndex} of ${bundle.pageCount}`;
    } else {
      spreadBadgeEl.textContent = `${bundle.ktData.shortTitle} • ${isOnePageSpread ? `Page ${currentSpread.pages[0]}` : `Pages ${currentSpread.pages[0]}–${currentSpread.pages[1]}`} of ${bundle.pageCount}`;
    }
  }
  if (spreadTitleEl) {
    spreadTitleEl.textContent = currentSpread.subtitle;
  }

  if (btnPrev) {
    const isFirst =
      currentReader.viewMode === 'single'
        ? currentReader.singlePageIndex <= 1
        : currentReader.spreadIndex <= 0;
    btnPrev.style.opacity = isFirst ? '0.3' : '1';
    btnPrev.style.pointerEvents = isFirst ? 'none' : 'auto';
  }
  if (btnNext) {
    const isLast =
      currentReader.viewMode === 'single'
        ? currentReader.singlePageIndex >= bundle.pageCount
        : currentReader.spreadIndex >= ktData.spreads.length - 1;
    btnNext.style.opacity = isLast ? '0.3' : '1';
    btnNext.style.pointerEvents = isLast ? 'none' : 'auto';
  }

  const tabs = document.querySelectorAll('.reader-filmstrip-tab');
  tabs.forEach((tab) => {
    const idx = parseInt(tab.dataset.index, 10);
    if (idx === currentReader.spreadIndex) tab.classList.add('active');
    else tab.classList.remove('active');
  });

  let leftPageContent = '';
  let rightPageContent = '';
  let isSingleCard = false;

  if (currentReader.viewMode === 'single') {
    const pIndex = Math.max(0, Math.min(bundle.pageCount - 1, currentReader.singlePageIndex - 1));
    rightPageContent = bundle.pagesHtml[pIndex] || '';
    isSingleCard = true;
  } else if (isOnePageSpread) {
    const pIndex = Math.max(0, Math.min(bundle.pageCount - 1, (currentSpread.pages[0] || 1) - 1));
    rightPageContent = bundle.pagesHtml[pIndex] || '';
    isSingleCard = true;
  } else {
    const leftPageNum = currentSpread.pages[0];
    const rightPageNum = currentSpread.pages[1];
    leftPageContent = bundle.pagesHtml[leftPageNum - 1] || '';
    rightPageContent = bundle.pagesHtml[rightPageNum - 1] || '';
    isSingleCard = false;
  }

  const baseHref = new URL(bundle.ktData.htmlUrl, window.location.origin).href;

  const iframeDocHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <base href="${baseHref}">
      ${bundle.fontLinks}
      <style>
        ${bundle.styleContents}

        *, *:before, *:after { box-sizing: border-box; }

        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: transparent !important;
          overflow: hidden !important;
          touch-action: none !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          user-select: text;
        }

        #spread-scaler-stage {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          transform-origin: center center;
          transition: transform 0.16s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        #spread-scaler-stage.is-gesturing {
          transition: none !important;
        }

        .page-card {
          width: 210mm;
          height: 297mm;
          max-height: 297mm;
          background: #ffffff;
          padding: 0 !important;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          box-sizing: border-box;
        }

        .page-card.left-page {
          box-shadow: -12px 20px 45px rgba(0, 0, 0, 0.55);
          border-radius: 4px 2px 2px 4px;
        }
        .page-card.left-page::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 22px;
          background: linear-gradient(to left, rgba(15, 23, 42, 0.12), transparent);
          pointer-events: none;
          z-index: 20;
        }

        .page-card.right-page {
          box-shadow: 12px 20px 45px rgba(0, 0, 0, 0.55);
          border-radius: 2px 4px 4px 2px;
        }
        .page-card.right-page::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 22px;
          background: linear-gradient(to right, rgba(15, 23, 42, 0.12), transparent);
          pointer-events: none;
          z-index: 20;
        }

        .page-card.single-page {
          box-shadow: 0 25px 55px rgba(0, 0, 0, 0.65);
          border-radius: 6px;
        }

        /* Let all 3 textbook page families render with native padding, covers & flexbox */
        .page-card > .textbook-page,
        .page-card > .tb-page,
        .page-card > .page {
          width: 210mm !important;
          height: 297mm !important;
          min-height: 297mm !important;
          max-height: 297mm !important;
          margin: 0 !important;
          box-shadow: none !important;
          page-break-after: unset !important;
          break-after: unset !important;
        }
      </style>
    </head>
    <body>
      <div id="spread-scaler-stage">
        ${leftPageContent ? `<div class="page-card left-page">${leftPageContent}</div>` : ''}
        ${rightPageContent ? `<div class="page-card ${isSingleCard ? 'single-page' : 'right-page'}">${rightPageContent}</div>` : ''}
      </div>
    </body>
    </html>
  `;

  iframe.srcdoc = iframeDocHtml;

  iframe.onload = () => {
    try {
      const doc = iframe.contentDocument;
      if (doc) {
        // Gentle screen auto-fit guard for KS2 .tb-page single-column reading pages
        doc.querySelectorAll('.page-card > .tb-page').forEach((pg) => {
          let steps = 0;
          while (pg.scrollHeight > pg.clientHeight + 2 && steps < 8) {
            steps++;
            const scale = 1 - steps * 0.02;
            pg.querySelectorAll('.prose-para, .single-reading-col p').forEach((p) => {
              p.style.fontSize = `${(12 * scale).toFixed(2)}pt`;
              p.style.lineHeight = `${Math.max(1.42, 1.62 - steps * 0.025).toFixed(2)}`;
            });
          }
        });
      }
    } catch (e) {}

    if (loader) loader.style.display = 'none';
    iframe.style.opacity = '1';
    currentReader.iframeLoaded = true;
    applyIframeZoom(true);

    try {
      const doc = iframe.contentDocument;
      const win = iframe.contentWindow;
      if (doc) {
        bindZoomAndPanGestures(doc);
      }
      if (win && isMobileTouchOrStandalonePrintFallback()) {
        win.print = () => openOrShareTextbookPdfFallback();
      }
    } catch (e) {}
  };
}

/**
 * Bind two-finger touchscreen pinch-to-zoom, laptop trackpad pinch (Ctrl+Wheel),
 * double-tap/double-click quick zoom, drag-to-pan when zoomed, and swipe-to-turn-page.
 * Works identically in normal view AND native Fullscreen mode.
 */
function bindZoomAndPanGestures(targetEl) {
  if (!targetEl || targetEl.__hhZoomGesturesBound) return;
  targetEl.__hhZoomGesturesBound = true;

  let isPinching = false;
  let isPanningTouch = false;
  let isPanningMouse = false;
  let pinchStartDist = 0;
  let pinchStartZoom = 1.0;
  let pinchStartMidX = 0;
  let pinchStartMidY = 0;
  let pinchStartPanX = 0;
  let pinchStartPanY = 0;

  let singleStartX = 0;
  let singleStartY = 0;
  let panOriginX = 0;
  let panOriginY = 0;
  let lastTapTime = 0;

  const setGesturing = (active) => {
    const iframe = document.getElementById('readerStageIframe');
    const stage = iframe?.contentDocument?.getElementById('spread-scaler-stage');
    if (stage) stage.classList.toggle('is-gesturing', Boolean(active));
  };

  // 1. Touch: Two-finger Pinch-to-Zoom + One-finger Pan (zoomed) / Swipe (unzoomed) + Double-Tap Zoom
  targetEl.addEventListener(
    'touchstart',
    (e) => {
      if (!e.touches) return;
      if (e.touches.length === 2) {
        e.preventDefault();
        isPinching = true;
        isPanningTouch = false;
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        pinchStartDist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY) || 1;
        pinchStartZoom = currentReader.zoomLevel;
        pinchStartMidX = (t0.clientX + t1.clientX) / 2;
        pinchStartMidY = (t0.clientY + t1.clientY) / 2;
        pinchStartPanX = currentReader.panX;
        pinchStartPanY = currentReader.panY;
        setGesturing(true);
      } else if (e.touches.length === 1) {
        isPinching = false;
        singleStartX = e.touches[0].clientX;
        singleStartY = e.touches[0].clientY;
        if (currentReader.zoomLevel > 1.02) {
          isPanningTouch = true;
          panOriginX = currentReader.panX;
          panOriginY = currentReader.panY;
          setGesturing(true);
        } else {
          isPanningTouch = false;
        }
      }
    },
    { passive: false },
  );

  targetEl.addEventListener(
    'touchmove',
    (e) => {
      if (!e.touches) return;
      if (isPinching && e.touches.length === 2) {
        e.preventDefault();
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY) || 1;
        const midX = (t0.clientX + t1.clientX) / 2;
        const midY = (t0.clientY + t1.clientY) / 2;
        const nextZoom = Math.max(0.6, Math.min(3.2, pinchStartZoom * (dist / pinchStartDist)));
        currentReader.zoomLevel = nextZoom;
        if (nextZoom <= 1.02) {
          currentReader.panX = 0;
          currentReader.panY = 0;
        } else {
          currentReader.panX = pinchStartPanX + (midX - pinchStartMidX);
          currentReader.panY = pinchStartPanY + (midY - pinchStartMidY);
        }
        applyIframeZoom(false, true);
      } else if (isPanningTouch && e.touches.length === 1 && currentReader.zoomLevel > 1.02) {
        e.preventDefault();
        currentReader.panX = panOriginX + (e.touches[0].clientX - singleStartX);
        currentReader.panY = panOriginY + (e.touches[0].clientY - singleStartY);
        applyIframeZoom(false, true);
      }
    },
    { passive: false },
  );

  targetEl.addEventListener(
    'touchend',
    (e) => {
      if (isPinching) {
        if (!e.touches || e.touches.length < 2) {
          isPinching = false;
          setGesturing(false);
          if (currentReader.zoomLevel < 1.04) {
            currentReader.zoomLevel = 1.0;
            currentReader.panX = 0;
            currentReader.panY = 0;
            applyIframeZoom(true);
          }
        }
        return;
      }

      if (isPanningTouch) {
        isPanningTouch = false;
        setGesturing(false);
      }

      if (!e.changedTouches || e.changedTouches.length !== 1) return;
      const dx = e.changedTouches[0].clientX - singleStartX;
      const dy = e.changedTouches[0].clientY - singleStartY;

      // Double-tap quick zoom toggle (1.0x <-> 1.85x)
      if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
        const now = Date.now();
        if (now - lastTapTime < 280) {
          lastTapTime = 0;
          if (currentReader.zoomLevel > 1.15) {
            currentReader.zoomLevel = 1.0;
            currentReader.panX = 0;
            currentReader.panY = 0;
            applyIframeZoom(true);
          } else {
            currentReader.zoomLevel = 1.85;
            currentReader.panX = 0;
            currentReader.panY = 0;
            applyIframeZoom(false);
          }
          return;
        }
        lastTapTime = now;
        return;
      }

      // Single-finger horizontal swipe to turn spreads when at fit zoom
      if (currentReader.zoomLevel <= 1.05 && Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        navigateSpread(dx < 0 ? 1 : -1);
      }
    },
    { passive: true },
  );

  // 2. Laptop Trackpad Pinch & Ctrl/Cmd + Mouse Wheel Zoom (and Scroll-Pan when zoomed)
  targetEl.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const factor = Math.exp(-e.deltaY * 0.008);
        const nextZoom = Math.max(0.6, Math.min(3.2, currentReader.zoomLevel * factor));
        currentReader.zoomLevel = nextZoom;
        if (nextZoom <= 1.02) {
          currentReader.panX = 0;
          currentReader.panY = 0;
        }
        applyIframeZoom(false, true);
      } else if (currentReader.zoomLevel > 1.02) {
        e.preventDefault();
        currentReader.panX -= e.deltaX;
        currentReader.panY -= e.deltaY;
        applyIframeZoom(false, true);
      }
    },
    { passive: false },
  );

  // 3. Mouse Click-and-Drag Pan when zoomed in + Double-Click Zoom Toggle
  targetEl.addEventListener('mousedown', (e) => {
    if (e.button !== 0 || currentReader.zoomLevel <= 1.02) return;
    isPanningMouse = true;
    singleStartX = e.clientX;
    singleStartY = e.clientY;
    panOriginX = currentReader.panX;
    panOriginY = currentReader.panY;
    setGesturing(true);
    if (targetEl.body) targetEl.body.style.cursor = 'grabbing';
  });

  targetEl.addEventListener('mousemove', (e) => {
    if (!isPanningMouse) return;
    e.preventDefault();
    currentReader.panX = panOriginX + (e.clientX - singleStartX);
    currentReader.panY = panOriginY + (e.clientY - singleStartY);
    applyIframeZoom(false, true);
  });

  const endMousePan = () => {
    if (!isPanningMouse) return;
    isPanningMouse = false;
    setGesturing(false);
    if (targetEl.body) targetEl.body.style.cursor = currentReader.zoomLevel > 1.02 ? 'grab' : '';
  };
  targetEl.addEventListener('mouseup', endMousePan);
  targetEl.addEventListener('mouseleave', endMousePan);

  targetEl.addEventListener('dblclick', (e) => {
    if (e.target && e.target.closest && e.target.closest('button, a')) return;
    if (currentReader.zoomLevel > 1.15) {
      currentReader.zoomLevel = 1.0;
      currentReader.panX = 0;
      currentReader.panY = 0;
      applyIframeZoom(true);
    } else {
      currentReader.zoomLevel = 1.85;
      currentReader.panX = 0;
      currentReader.panY = 0;
      applyIframeZoom(false);
    }
  });
}

function applyIframeZoom(isAutoFit = false, immediate = false) {
  const iframe = document.getElementById('readerStageIframe');
  if (!iframe || !iframe.contentDocument) return;

  const stage = iframe.contentDocument.getElementById('spread-scaler-stage');
  if (!stage) return;

  const viewport = document.getElementById('reader-viewport');
  if (!viewport) return;

  const viewportWidth = viewport.clientWidth;
  const viewportHeight = viewport.clientHeight;

  const pxPerMm = 3.779527559;
  const singlePageWidthPx = 210 * pxPerMm;
  const pageHeightPx = 297 * pxPerMm;

  const ktData = TEXTBOOK_CATALOG[currentReader.unitId]?.keyTopics?.[currentReader.ktId];
  const currentSpread = ktData?.spreads?.[currentReader.spreadIndex];

  let naturalSpreadWidth = singlePageWidthPx;
  if (
    currentReader.viewMode === 'dual' &&
    currentSpread &&
    Array.isArray(currentSpread.pages) &&
    currentSpread.pages.length > 1
  ) {
    naturalSpreadWidth = singlePageWidthPx * 2 + 10;
  }

  const isCompactMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const paddingX = isCompactMobile ? 14 : 80;
  const paddingY = isCompactMobile ? 14 : 34;
  const fitScaleX = (viewportWidth - paddingX) / naturalSpreadWidth;
  const fitScaleY = (viewportHeight - paddingY) / pageHeightPx;
  const baseFitScale = Math.min(fitScaleX, fitScaleY, 1.25);

  if (isAutoFit) {
    currentReader.zoomLevel = 1.0;
    currentReader.panX = 0;
    currentReader.panY = 0;
  }

  const finalScale = baseFitScale * currentReader.zoomLevel;

  // Clamp pan offsets so the zoomed spread never drifts off-screen
  const scaledW = naturalSpreadWidth * finalScale;
  const scaledH = pageHeightPx * finalScale;
  const maxPanX = Math.max(0, (scaledW - viewportWidth) / 2 + 60);
  const maxPanY = Math.max(0, (scaledH - viewportHeight) / 2 + 60);
  currentReader.panX = Math.max(-maxPanX, Math.min(maxPanX, currentReader.panX));
  currentReader.panY = Math.max(-maxPanY, Math.min(maxPanY, currentReader.panY));

  if (immediate) stage.classList.add('is-gesturing');
  stage.style.transform = `translate3d(${currentReader.panX.toFixed(1)}px, ${currentReader.panY.toFixed(1)}px, 0) scale(${finalScale.toFixed(3)})`;

  if (iframe.contentDocument.body) {
    iframe.contentDocument.body.style.cursor = currentReader.zoomLevel > 1.02 ? 'grab' : '';
  }

  const btnFit = document.getElementById('reader-btn-zoom-fit');
  if (btnFit) {
    btnFit.textContent =
      Math.abs(currentReader.zoomLevel - 1.0) < 0.03
        ? 'FIT'
        : `${Math.round(currentReader.zoomLevel * 100)}%`;
  }
}

function toggleAudioNarration() {
  const btnAudio = document.getElementById('reader-btn-audio');
  const audioLabel = document.getElementById('reader-audio-label');

  if (!('speechSynthesis' in window)) {
    alert('Audio read-aloud is not supported on this web browser.');
    return;
  }

  if (currentReader.isAudioPlaying) {
    if (currentReader.isAudioPaused) {
      window.speechSynthesis.resume();
      currentReader.isAudioPaused = false;
      if (audioLabel) audioLabel.textContent = 'Reading...';
      if (btnAudio) btnAudio.classList.add('audio-playing');
    } else {
      window.speechSynthesis.pause();
      currentReader.isAudioPaused = true;
      if (audioLabel) audioLabel.textContent = 'Paused';
      if (btnAudio) btnAudio.classList.remove('audio-playing');
    }
    return;
  }

  const iframe = document.getElementById('readerStageIframe');
  if (!iframe || !iframe.contentDocument) return;

  const doc = iframe.contentDocument;
  const readableNodes = Array.from(
    doc.querySelectorAll(
      '.hdr-h2, .tb-lesson-banner h2, .enquiry-main-title, .lesson-title, .eq-txt, .tb-eq-line, .block-title, .act-kicker, .tb-act-title, .spread-stage-q, .tb-stage-q, .block-workbook-question, .prose-p, .prose-para, .single-reading-col p, .numbered-para, .section-title, .archival-body, .overview-blurb p, .cover-lead',
    ),
  )
    .map((el) => el.textContent.replace(/\s+/g, ' ').trim())
    .filter((txt) => txt.length > 0);

  const fullText = readableNodes.join('. ');
  if (!fullText) {
    alert('No readable narrative prose found on this page.');
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(fullText);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const gbVoice = voices.find((v) => v.lang.includes('en-GB') || v.lang.includes('en_GB'));
  if (gbVoice) utterance.voice = gbVoice;

  utterance.onstart = () => {
    currentReader.isAudioPlaying = true;
    currentReader.isAudioPaused = false;
    if (btnAudio) btnAudio.classList.add('audio-playing');
    if (audioLabel) audioLabel.textContent = 'Reading...';
  };

  utterance.onend = () => stopAudioNarration();
  utterance.onerror = () => stopAudioNarration();

  currentReader.audioUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

function stopAudioNarration() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentReader.isAudioPlaying = false;
  currentReader.isAudioPaused = false;
  currentReader.audioUtterance = null;

  const btnAudio = document.getElementById('reader-btn-audio');
  const audioLabel = document.getElementById('reader-audio-label');
  if (btnAudio) btnAudio.classList.remove('audio-playing');
  if (audioLabel) {
    audioLabel.textContent = currentReader.viewMode === 'single' ? 'Read Page' : 'Read Spread';
  }
}

/**
 * Global Helper to Open the Flipbook Reader from anywhere in the application
 * (Lesson Desk-Locator Strip, Unit Booklets Drawer, or Department Portal)
 */
export function openDigitalTextbookReader(
  unitId = 'cme_new',
  ktId = '',
  spreadIndex = 0,
  targetPage = null,
) {
  const safeUnit = TEXTBOOK_CATALOG[unitId] ? unitId : 'cme_new';
  const safeKt =
    ktId && TEXTBOOK_CATALOG[safeUnit]?.keyTopics?.[ktId]
      ? ktId
      : getDefaultKtId(safeUnit);

  if (typeof window !== 'undefined') {
    currentReader.returnView = state.currentView !== 'reader' ? state.currentView || 'lessons' : 'lessons';
    currentReader.returnLessonIndex =
      state.currentView === 'lessons' && typeof window.currentLessonIndex === 'number'
        ? window.currentLessonIndex
        : null;
  }

  const pageSuffix = targetPage ? `:${targetPage}` : '';
  if (window.switchView) {
    window.switchView('reader', `${safeUnit}:${safeKt}:${spreadIndex}${pageSuffix}`);
  }
}

if (typeof window !== 'undefined') {
  window.openDigitalReader = openDigitalTextbookReader;
  window.openDigitalTextbookReader = openDigitalTextbookReader;
  window.getLessonTextbookLocator = getLessonTextbookLocator;
}
