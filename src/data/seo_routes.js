/**
 * Canonical SEO Route Registry for The History Revision Hub
 * Shared between Vite build-time static HTML/sitemap generation (vite.config.js)
 * and client-side SPA path resolution (src/main.js, src/navigation.js).
 */

export const SITE_ORIGIN = 'https://historyrevisionhub.co.uk';

export const SCHOOLS_SEO_PAGE = {
  slug: 'schools',
  aliases: ['for-schools', 'departments', 'for-departments'],
  heading: 'For UK Schools & History Departments',
  seoTitle:
    'For Schools & History Departments | KS2, KS3 & Edexcel GCSE Curriculum Packs | The History Revision Hub',
  metaDescription:
    'Zero-login UK History curriculum and printable classroom booklets for Schools and History Departments across KS2, KS3, and Pearson Edexcel GCSE (9–1): Master Textbooks, Pupil Workbooks, Retrieval Companions, and Studio Audio.',
  priority: '0.9',
};

const SCHOOLS_SLUGS = new Set([SCHOOLS_SEO_PAGE.slug, ...SCHOOLS_SEO_PAGE.aliases]);

export function isSchoolsPathname(pathname) {
  if (!pathname || typeof pathname !== 'string') return false;
  const cleaned = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  return SCHOOLS_SLUGS.has(cleaned);
}

export const SEO_UNIT_ROUTES = [
  // Key Stage 4: Pearson Edexcel GCSE (9–1) History
  {
    unitId: 'edexcel_medicine',
    slug: 'edexcel-medicine',
    aliases: ['medicine-through-time', 'gcse-medicine'],
    keyStage: 'GCSE (9–1)',
    examBoard: 'Pearson Edexcel GCSE History (Paper 1)',
    heading: 'Medicine in Britain, c1250–present & The British Sector of the Western Front, 1914–18',
    seoTitle:
      'Medicine Through Time & Western Front | Edexcel GCSE History Revision | The History Revision Hub',
    metaDescription:
      'Complete Pearson Edexcel GCSE (9–1) History Paper 1 revision and classroom lessons for Medicine in Britain (c1250–present) and the Western Front (1914–18), featuring primary sources, studio audio read-alouds, and retrieval quizzes.',
    priority: '0.9',
  },
  {
    unitId: 'eee',
    slug: 'early-elizabethan-england',
    aliases: ['elizabethan-england'],
    keyStage: 'GCSE (9–1)',
    examBoard: 'Pearson Edexcel GCSE History (Paper 2)',
    heading: 'Early Elizabethan England, 1558–88',
    seoTitle:
      'Early Elizabethan England (1558–88) | Edexcel GCSE History Revision & Lessons | The History Revision Hub',
    metaDescription:
      'Interactive Pearson Edexcel GCSE (9–1) History Paper 2 revision and classroom lessons for Early Elizabethan England, 1558–88: Queen, government and religion, plots and Revolts, the Spanish Armada, and Elizabethan society.',
    priority: '0.9',
  },
  {
    unitId: 'gcse_cold_war',
    slug: 'gcse-cold-war-1941-1991',
    aliases: ['edexcel-cold-war', 'superpower-relations-1941-1991'],
    keyStage: 'GCSE (9–1)',
    examBoard: 'Pearson Edexcel GCSE History (Paper 2 • Option P4)',
    heading: 'Superpower Relations and the Cold War, 1941–91',
    seoTitle:
      'Superpower Relations & the Cold War (1941–91) | Edexcel GCSE History Paper 2 | The History Revision Hub',
    metaDescription:
      'Complete Pearson Edexcel GCSE (9–1) History Paper 2 Option P4 revision and classroom lessons for Superpower Relations and the Cold War, 1941–91: Grand Alliance, Berlin Crisis, Cuban Missile Crisis, Prague Spring, Détente, Afghanistan, Gorbachev, and the collapse of the Soviet Union.',
    priority: '0.9',
  },
  {
    unitId: 'cme_new',
    slug: 'conflict-in-the-middle-east',
    aliases: ['middle-east-1945-1995'],
    keyStage: 'GCSE (9–1)',
    examBoard: 'Pearson Edexcel GCSE History (Paper 2)',
    heading: 'Conflict in the Middle East, 1945–95',
    seoTitle:
      'Conflict in the Middle East (1945–95) | Edexcel GCSE History Revision & Lessons | The History Revision Hub',
    metaDescription:
      'Complete Pearson Edexcel GCSE (9–1) History Paper 2 Period Study revision and classroom lessons for Conflict in the Middle East, 1945–95: birth of Israel, Suez Crisis, Six-Day War, Yom Kippur, Camp David, and the Oslo Peace Accords.',
    priority: '0.9',
  },
  {
    unitId: 'weimar_nazi_germany',
    slug: 'weimar-nazi-germany',
    aliases: ['weimar-and-nazi-germany'],
    keyStage: 'GCSE (9–1)',
    examBoard: 'Pearson Edexcel GCSE History (Paper 3)',
    heading: 'Weimar and Nazi Germany, 1918–39',
    seoTitle:
      'Weimar and Nazi Germany (1918–39) | Edexcel GCSE History Revision & Lessons | The History Revision Hub',
    metaDescription:
      'Interactive Pearson Edexcel GCSE (9–1) History Paper 3 Modern Depth Study revision and lessons for Weimar and Nazi Germany, 1918–39: Weimar Republic, Hitler’s rise to power, Nazi dictatorship, primary sources, and interpretations.',
    priority: '0.9',
  },
  {
    unitId: 'usa',
    slug: 'usa-1954-1975',
    aliases: ['usa-conflict-home-and-abroad'],
    keyStage: 'GCSE (9–1)',
    examBoard: 'Pearson Edexcel GCSE History (Paper 3)',
    heading: 'Conflict at Home and Abroad: The USA, 1954–75',
    seoTitle:
      'The USA, 1954–75: Civil Rights & Vietnam | Edexcel GCSE History Revision | The History Revision Hub',
    metaDescription:
      'Complete Pearson Edexcel GCSE (9–1) History Paper 3 Modern Depth Study revision and classroom lessons for Conflict at Home and Abroad: The USA, 1954–75—US Civil Rights Movement, Martin Luther King Jr., Black Power, and the Vietnam War.',
    priority: '0.9',
  },

  // Key Stage 4: Cambridge OCR GCSE (9–1) Ancient History (J198)
  {
    unitId: 'ocr_persian_empire',
    slug: 'ocr-persian-empire',
    aliases: ['persian-empire-559-465-bc', 'j198-persian-empire'],
    keyStage: 'GCSE (9–1)',
    examBoard: 'Cambridge OCR GCSE Ancient History (J198/01 • Section A)',
    heading: 'The Persian Empire, 559–465 BC',
    seoTitle:
      'The Persian Empire (559–465 BC) | OCR GCSE Ancient History J198/01 Revision | The History Revision Hub',
    metaDescription:
      'Accessible Cambridge OCR GCSE (9–1) Ancient History J198/01 revision and lessons for The Persian Empire, 559–465 BC: Cyrus the Great, Cambyses II, Darius I, Xerxes I, unseen passage drills, and green-quoted full-mark model answers.',
    priority: '0.9',
  },
  {
    unitId: 'ocr_alexander',
    slug: 'ocr-alexander-the-great',
    aliases: ['alexander-the-great-356-323-bc', 'j198-alexander'],
    keyStage: 'GCSE (9–1)',
    examBoard: 'Cambridge OCR GCSE Ancient History (J198/01 • Section D)',
    heading: 'Alexander the Great, 356–323 BC',
    seoTitle:
      'Alexander the Great (356–323 BC) | OCR GCSE Ancient History J198 Prescribed Sources & Revision | The History Revision Hub',
    metaDescription:
      'Interactive Cambridge OCR GCSE (9–1) Ancient History J198/01 Depth Study for Alexander the Great, 356–323 BC—modern-English prescribed set sources (Plutarch, Arrian, Diodorus), 3D coin hotspots, and green-quoted WAGOLLs.',
    priority: '0.9',
  },
  {
    unitId: 'ocr_foundations_of_rome',
    slug: 'ocr-foundations-of-rome',
    aliases: ['foundations-of-rome-753-440-bc', 'j198-foundations-of-rome'],
    keyStage: 'GCSE (9–1)',
    examBoard: 'Cambridge OCR GCSE Ancient History (J198/02 • Section A)',
    heading: 'The Foundations of Rome: From Kingship to Republic, 753–440 BC',
    seoTitle:
      'The Foundations of Rome (753–440 BC) | OCR GCSE Ancient History J198/02 Revision | The History Revision Hub',
    metaDescription:
      'Complete Cambridge OCR GCSE (9–1) Ancient History J198/02 Longer Period Study for The Foundations of Rome, 753–440 BC: Legendary Kings, Etruscan Tarquins, Early Republic, Conflict of the Orders, and Myth vs Archaeology.',
    priority: '0.9',
  },
  {
    unitId: 'ocr_cleopatra',
    slug: 'ocr-cleopatra',
    aliases: ['cleopatra-rome-and-egypt-69-30-bc', 'j198-cleopatra'],
    keyStage: 'GCSE (9–1)',
    examBoard: 'Cambridge OCR GCSE Ancient History (J198/02 • Section C)',
    heading: 'Cleopatra: Rome and Egypt, 69–30 BC',
    seoTitle:
      'Cleopatra: Rome & Egypt (69–30 BC) | OCR GCSE Ancient History J198 Prescribed Sources & Revision | The History Revision Hub',
    metaDescription:
      'Interactive Cambridge OCR GCSE (9–1) Ancient History J198/02 Depth Study for Cleopatra: Rome and Egypt, 69–30 BC—modern-English prescribed set sources, Ptolemaic & Roman coinage hotspots, and green-quoted WAGOLLs.',
    priority: '0.9',
  },

  // Key Stage 3: UK National Curriculum History
  {
    unitId: 'medieval_england',
    slug: 'medieval-england',
    aliases: ['medieval-england-1066-1485'],
    keyStage: 'Key Stage 3',
    examBoard: 'UK National Curriculum Key Stage 3 History',
    heading: 'Medieval England: Power, Plague & Rebellion (1066–1485)',
    seoTitle:
      'Medieval England (1066–1485) | KS3 History Lessons, Sources & Revision | The History Revision Hub',
    metaDescription:
      'Interactive UK Key Stage 3 History lessons, archival primary sources, studio audio read-alouds, and retrieval quizzes for Medieval England (1066–1485): Norman Conquest, Thomas Becket, Magna Carta, the Black Death, and the Peasants’ Revolt.',
    priority: '0.85',
  },
  {
    unitId: 'monarchy_religion_power',
    slug: 'tudors-stuarts-parliament',
    aliases: ['monarchy-religion-power', 'crown-church-parliament'],
    keyStage: 'Key Stage 3',
    examBoard: 'UK National Curriculum Key Stage 3 History',
    heading: 'Crown, Church, or Parliament? Tudors & Stuarts (1517–1689)',
    seoTitle:
      'Crown, Church, or Parliament? Tudors & Stuarts (1517–1689) | KS3 History Revision | The History Revision Hub',
    metaDescription:
      'Interactive UK Key Stage 3 History lessons, authentic primary sources, audio read-alouds, and retrieval quizzes for Tudors and Stuarts (1517–1689): Henry VIII’s Break with Rome, Elizabeth I, the English Civil War, and the Glorious Revolution.',
    priority: '0.85',
  },
  {
    unitId: 'water_and_sanitation',
    slug: 'water-and-sanitation',
    aliases: ['public-health-through-time'],
    keyStage: 'Key Stage 3',
    examBoard: 'UK National Curriculum Key Stage 3 Thematic Study',
    heading: 'Water, Public Health & Sanitation Through Time',
    seoTitle:
      'Water and Sanitation Through Time | KS3 Thematic History Lessons & Revision | The History Revision Hub',
    metaDescription:
      'Interactive UK Key Stage 3 thematic History unit tracing water and public health from Roman aqueducts and medieval monasteries to John Snow’s 1854 cholera map, the Great Stink, and Joseph Bazalgette’s London sewers.',
    priority: '0.85',
  },
  {
    unitId: 'first_british_empire',
    slug: 'first-british-empire',
    aliases: ['british-empire-1600-1783'],
    keyStage: 'Key Stage 3',
    examBoard: 'UK National Curriculum Key Stage 3 History',
    heading: 'The First British Empire: Trade, Colonisation & Revolution (1600–1783)',
    seoTitle:
      'The First British Empire (1600–1783) | KS3 History Lessons & Revision | The History Revision Hub',
    metaDescription:
      'Interactive UK Key Stage 3 History lessons, archival sources, audio read-alouds, and retrieval quizzes on the First British Empire (1600–1783): early America, the East India Company, transatlantic slavery, resistance, and the American Revolution.',
    priority: '0.85',
  },
  {
    unitId: 'industrialisation_and_empire',
    slug: 'industrial-revolution',
    aliases: ['industrialisation-and-empire'],
    keyStage: 'Key Stage 3',
    examBoard: 'UK National Curriculum Key Stage 3 History',
    heading: 'The Industrial Revolution: Steam, Labour & Protest (1750–1872)',
    seoTitle:
      'The Industrial Revolution (1750–1872) | KS3 History Lessons & Revision | The History Revision Hub',
    metaDescription:
      'Interactive UK Key Stage 3 History lessons, primary sources, studio audio read-alouds, and retrieval quizzes on Britain’s Industrial Revolution (1750–1872): steam power, factory conditions, Peterloo, Chartism, and democratic reform.',
    priority: '0.85',
  },
  {
    unitId: 'second_british_empire',
    slug: 'second-british-empire',
    aliases: ['british-empire-1783-1914'],
    keyStage: 'Key Stage 3',
    examBoard: 'UK National Curriculum Key Stage 3 History',
    heading: 'The Second British Empire: Expansion, Resistance & Abolition (1783–1914)',
    seoTitle:
      'The Second British Empire (1783–1914) | KS3 History Lessons & Revision | The History Revision Hub',
    metaDescription:
      'Interactive UK Key Stage 3 History lessons, primary sources, and retrieval quizzes on the Second British Empire (1783–1914): abolitionism, the Indian Rebellion of 1857, the Scramble for Africa, and anti-colonial resistance.',
    priority: '0.85',
  },
  {
    unitId: 'australia',
    slug: 'history-of-australia',
    aliases: ['australia-1770-1901'],
    keyStage: 'Key Stage 3',
    examBoard: 'UK National Curriculum Key Stage 3 World History',
    heading: 'The History of Australia: First Nations, Colonisation & Resistance (1770–1901)',
    seoTitle:
      'The History of Australia (1770–1901) | KS3 History Lessons & Revision | The History Revision Hub',
    metaDescription:
      'Interactive UK Key Stage 3 History lessons, primary sources, and retrieval quizzes on Australia (1770–1901): 65,000 years of First Nations custodianship, Captain Cook, the First Fleet, Frontier Wars, Gold Rush, and Federation.',
    priority: '0.85',
  },
  {
    unitId: 'great_war',
    slug: 'causes-of-world-war-1',
    aliases: ['causes-of-the-great-war'],
    keyStage: 'Key Stage 3',
    examBoard: 'UK National Curriculum Key Stage 3 History',
    heading: 'Causes of the First World War (1871–1914)',
    seoTitle:
      'Causes of World War One (1871–1914) | KS3 History Lessons & Revision | The History Revision Hub',
    metaDescription:
      'Interactive UK Key Stage 3 History lessons, diplomatic primary sources, audio read-alouds, and retrieval quizzes on the Causes of the First World War: alliances, militarism, imperial rivalry, Sarajevo, and the July Crisis of 1914.',
    priority: '0.85',
  },
  {
    unitId: 'great_war_part2',
    slug: 'first-world-war-1914-1919',
    aliases: ['course-of-the-great-war'],
    keyStage: 'Key Stage 3',
    examBoard: 'UK National Curriculum Key Stage 3 History',
    heading: 'The First World War: Trenches, Empire & Aftermath (1914–1919)',
    seoTitle:
      'The First World War (1914–1919) | KS3 History Lessons, Sources & Revision | The History Revision Hub',
    metaDescription:
      'Interactive UK Key Stage 3 History lessons, archival sources, literary read-alouds, and retrieval quizzes on the First World War (1914–1919): trench warfare on the Western Front, troops of the British Empire, the Home Front, and Versailles.',
    priority: '0.85',
  },
  {
    unitId: 'the_shoah',
    slug: 'the-holocaust-shoah',
    aliases: ['the-shoah'],
    keyStage: 'Key Stage 3',
    examBoard: 'UK National Curriculum Key Stage 3 Mandatory Study',
    heading: 'The Shoah (The Holocaust, 1933–1945)',
    seoTitle:
      'The Shoah (The Holocaust, 1933–1945) | KS3 History Lessons & Primary Sources | The History Revision Hub',
    metaDescription:
      'Historical enquiry for UK Key Stage 3 History on the Shoah (Holocaust): pre-war Jewish life across Europe, Nazi persecution, ghettoisation, the Final Solution, Jewish resistance, liberation, and survivor testimony.',
    priority: '0.85',
  },
  {
    unitId: 'cold_war',
    slug: 'cold-war-1945-1991',
    aliases: ['ks3-cold-war', 'superpower-relations-cold-war'],
    keyStage: 'Key Stage 3',
    examBoard: 'UK National Curriculum Key Stage 3 History',
    heading: 'The Cold War: Ideologies, Flashpoints & Collapse (1945–1991)',
    seoTitle:
      'The Cold War (1945–1991) | KS3 History Lessons, Sources & Revision | The History Revision Hub',
    metaDescription:
      'Interactive UK Key Stage 3 History lessons, archival primary sources, studio audio read-alouds, and retrieval quizzes on the Cold War (1945–1991): Iron Curtain, Berlin Blockade and Wall, Cuban Missile Crisis, Vietnam, Détente, and the collapse of the USSR.',
    priority: '0.85',
  },
  {
    unitId: 'post_war_britain',
    slug: 'post-war-britain',
    aliases: ['modern-britain-1900-present'],
    keyStage: 'Key Stage 3',
    examBoard: 'UK National Curriculum Key Stage 3 History',
    heading: 'Rights, Protest & Post-War Britain (1900–Present)',
    seoTitle:
      'Rights, Protest & Post-War Britain (1900–Present) | KS3 History Revision | The History Revision Hub',
    metaDescription:
      'Interactive UK Key Stage 3 History lessons, primary sources, audio read-alouds, and retrieval quizzes on Modern & Post-War Britain: Suffragettes, creation of the Welfare State and NHS, the Windrush generation, and civil rights.',
    priority: '0.85',
  },

  // Key Stage 2: Primary History
  {
    unitId: 'ks2_stone_to_iron_age',
    slug: 'ks2-stone-age-to-iron-age',
    aliases: ['stone-age-to-iron-age-ks2', 'primary-stone-age-bronze-age-iron-age'],
    keyStage: 'Key Stage 2',
    examBoard: 'UK National Curriculum Key Stage 2 Primary History',
    heading: 'Stone Age to Iron Age Britain — Hunter-Gatherers to Hillforts (c. 800,000 BC–AD 43)',
    seoTitle:
      'KS2 Stone Age to Iron Age Britain | Skara Brae, Stonehenge, Must Farm & Hillforts | The History Revision Hub',
    metaDescription:
      'Age-calibrated UK Key Stage 2 Primary History lessons, classroom textbook, pupil workbook, and retrieval quizzes for Stone Age to Iron Age Britain: Doggerland, Star Carr, Skara Brae, Stonehenge, the Amesbury Archer, Must Farm, and Maiden Castle.',
    priority: '0.85',
  },
  {
    unitId: 'ks2_romans',
    slug: 'ks2-romans-in-britain',
    aliases: ['primary-romans-in-britain', 'romans-ks2'],
    keyStage: 'Key Stage 2',
    examBoard: 'UK National Curriculum Key Stage 2 Primary History',
    heading: 'The Romans in Britain: Invasion, Resistance & Legacy (55 BC–AD 410)',
    seoTitle:
      'KS2 Romans in Britain | Primary History Lessons, Artefacts & Quizzes | The History Revision Hub',
    metaDescription:
      'Age-calibrated UK Key Stage 2 Primary History lessons, commercial-safe museum artefacts, dual-scaffolded worksheets, and retrieval quizzes for Roman Britain: Iron Age Celts, Claudius AD 43, Boudicca, Hadrian\'s Wall, Vindolanda, Roman Baths, and Roman Legacy.',
    priority: '0.85',
  },
  {
    unitId: 'ks2_anglo_saxons_vikings',
    slug: 'ks2-anglo-saxons-and-vikings',
    aliases: ['anglo-saxons-vikings-ks2', 'primary-anglo-saxons-and-vikings'],
    keyStage: 'Key Stage 2',
    examBoard: 'UK National Curriculum Key Stage 2 Primary History',
    heading: 'Anglo-Saxons & Vikings — Struggle for the Kingdom of England (AD 410–1066)',
    seoTitle:
      'KS2 Anglo-Saxons & Vikings (AD 410–1066) | Sutton Hoo, Lindisfarne, Alfred the Great & 1066 | The History Revision Hub',
    metaDescription:
      'Complete UK Key Stage 2 Primary History lessons, classroom textbook, pupil workbook, and retrieval quizzes for Anglo-Saxons and Vikings (AD 410–1066): West Stow, Sutton Hoo, Lindisfarne AD 793, Alfred the Great, Jorvik, Athelstan, Cnut, and 1066.',
    priority: '0.85',
  },
  {
    unitId: 'ks2_ww2',
    slug: 'ks2-world-war-2',
    aliases: ['primary-ww2-home-front'],
    keyStage: 'Key Stage 2',
    examBoard: 'UK National Curriculum Key Stage 2 Primary History',
    heading: 'World War II & The Home Front (1939–1945)',
    seoTitle:
      'KS2 World War II & The Home Front | Primary History Lessons, Audio & Quizzes | The History Revision Hub',
    metaDescription:
      'Age-calibrated UK Key Stage 2 Primary History lessons, studio audio read-aloud stories, authentic visual sources, and retrieval quizzes for World War II: Evacuation, the Blitz, Rationing, Battle of Britain, Kindertransport, and VE Day.',
    priority: '0.85',
  },
  {
    unitId: 'ks2_ancient_egypt',
    slug: 'ks2-ancient-egypt',
    aliases: ['ancient-egypt-ks2', 'primary-ancient-egypt'],
    keyStage: 'Key Stage 2',
    examBoard: 'UK National Curriculum Key Stage 2 Primary History',
    heading: 'Ancient Egypt — The River Nile, Pyramids, Pharaohs & The Afterlife (c. 3100–30 BC)',
    seoTitle:
      'KS2 Ancient Egypt | River Nile, Giza Pyramids, Hieroglyphs & Tutankhamun | The History Revision Hub',
    metaDescription:
      'Complete UK Key Stage 2 Primary History lessons, classroom textbook, pupil workbook, and retrieval quizzes for Ancient Egypt (c. 3100–30 BC): River Nile, Giza Pyramids, Rosetta Stone, Mummies, Hatshepsut, Ramesses II, Tutankhamun, and Cleopatra.',
    priority: '0.85',
  },
  {
    unitId: 'ks2_ancient_greece',
    slug: 'ks2-ancient-greece',
    aliases: ['ancient-greece-ks2', 'primary-ancient-greece'],
    keyStage: 'Key Stage 2',
    examBoard: 'UK National Curriculum Key Stage 2 Primary History',
    heading: 'Ancient Greece — City-States, Democracy, Myths & Lasting Legacy (c. 800–146 BC)',
    seoTitle:
      'KS2 Ancient Greece | Athens vs Sparta, Olympic Games, Myths & Legacy | The History Revision Hub',
    metaDescription:
      'Complete UK Key Stage 2 Primary History lessons, classroom textbook, pupil workbook, and retrieval quizzes for Ancient Greece (c. 800–146 BC): Poleis, Athens vs Sparta, 776 BC Olympics, Marathon, Salamis, Socrates, Hippocrates, and Alexander the Great.',
    priority: '0.85',
  },
  {
    unitId: 'ks2_early_islamic_baghdad',
    slug: 'ks2-early-islamic-civilisation-baghdad',
    aliases: ['early-islamic-baghdad-ks2', 'baghdad-ad-900-ks2'],
    keyStage: 'Key Stage 2',
    examBoard: 'UK National Curriculum Key Stage 2 Primary History',
    heading: 'Early Islamic Civilisation — Round City of Baghdad, Silk Roads & House of Wisdom (c. AD 750–1258)',
    seoTitle:
      'KS2 Early Islamic Civilisation (Baghdad c. AD 900) | House of Wisdom & Silk Roads | The History Revision Hub',
    metaDescription:
      'Complete UK Key Stage 2 Primary History lessons, classroom textbook, pupil workbook, and retrieval quizzes for Early Islamic Civilisation c. AD 900: Round City of Baghdad, House of Wisdom, al-Khwarizmi, Astrolabes, Silk Roads, and Viking Dirhams.',
    priority: '0.85',
  },
  {
    unitId: 'ks2_maya_civilisation',
    slug: 'ks2-ancient-maya-civilisation',
    aliases: ['maya-civilisation-ks2', 'ancient-maya-ks2'],
    keyStage: 'Key Stage 2',
    examBoard: 'UK National Curriculum Key Stage 2 Primary History',
    heading: 'The Ancient Maya — Rainforest Cities, Calendar Maths, Cacao & Pok-ta-Pok (c. 2000 BC–AD 1500)',
    seoTitle:
      'KS2 Ancient Maya Civilisation | Tikal, Palenque, Glyphs, Cacao & Chichén Itzá | The History Revision Hub',
    metaDescription:
      'Complete UK Key Stage 2 Primary History lessons, classroom textbook, pupil workbook, and retrieval quizzes for the Ancient Maya: Rainforest Cenotes, King Pakal, Maya Glyphs & Zero, Cacao, Pok-ta-Pok, Chichén Itzá, and Living Maya Today.',
    priority: '0.85',
  },
  {
    unitId: 'ks2_crime_and_punishment',
    slug: 'ks2-crime-and-punishment',
    aliases: ['crime-and-punishment-ks2', 'crime-punishment-through-time-ks2'],
    keyStage: 'Key Stage 2',
    examBoard: 'UK National Curriculum Key Stage 2 Primary History',
    heading: 'Crime and Punishment Through Time — Roman Courts to Modern Forensics (AD 43–Present)',
    seoTitle:
      'KS2 Crime & Punishment Through Time | Roman Law, Saxon Wergild, 1829 Peelers & DNA | The History Revision Hub',
    metaDescription:
      'Complete UK Key Stage 2 Primary History lessons, classroom textbook, pupil workbook, and retrieval quizzes for Crime and Punishment Through Time (AD 43–Present): Roman Bath curse tablets, Anglo-Saxon wergild, 1215 Magna Carta, Guy Fawkes, the Bloody Code, Elizabeth Fry, 1829 Peelers, and 1984 DNA.',
    priority: '0.85',
  },
  {
    unitId: 'ks2_kingdom_of_benin',
    slug: 'ks2-kingdom-of-benin',
    aliases: ['kingdom-of-benin-ks2', 'benin-ad-900-ks2'],
    keyStage: 'Key Stage 2',
    examBoard: 'UK National Curriculum Key Stage 2 Primary History',
    heading: 'The Kingdom of Benin — Rainforest Earthworks, Royal Oba Court & Master Bronzes (c. AD 900–1897)',
    seoTitle:
      'KS2 Kingdom of Benin (c. AD 900–1897) | Oba Ewuare, Benin Bronzes & Queen Idia | The History Revision Hub',
    metaDescription:
      'Complete UK Key Stage 2 Primary History lessons, classroom textbook, pupil workbook, and retrieval quizzes for the Kingdom of Benin (southern Nigeria): Ogiso earthworks, Oba Ewuare, Igun lost-wax brass plaques, Queen Mother Idia, Portuguese trade, 1897 invasion, and modern restitution.',
    priority: '0.85',
  },
  {
    unitId: 'ks2_victorian_britain',
    slug: 'ks2-victorian-britain',
    aliases: ['victorian-britain-ks2', 'victorians-ks2'],
    keyStage: 'Key Stage 2',
    examBoard: 'UK National Curriculum Key Stage 2 Primary History',
    heading: 'Victorian Britain — Steam Railways, Factories, Workhouses & Classrooms (1837–1901)',
    seoTitle:
      'KS2 Victorian Britain (1837–1901) | Railways, Child Labour, Workhouses & Schools | The History Revision Hub',
    metaDescription:
      'Complete UK Key Stage 2 Primary History lessons, classroom textbook, pupil workbook, and retrieval quizzes for Victorian Britain (1837–1901): Queen Victoria, Brunel’s railways, Penny Black, cotton mills, coal mines, Workhouses, Lord Shaftesbury, Dr Barnardo, Board Schools, and the 1851 Great Exhibition.',
    priority: '0.85',
  },
  {
    unitId: 'ks2_local_history_detective',
    slug: 'ks2-local-history-detective',
    aliases: ['local-history-study-ks2', 'history-on-our-doorstep-ks2'],
    keyStage: 'Key Stage 2',
    examBoard: 'UK National Curriculum Key Stage 2 Primary History',
    heading: 'History on Our Doorstep — Local History Detective Toolkit (Roman Towns to Living Memory)',
    seoTitle:
      'KS2 Local History Study | Place-Names, OS Maps, High Streets, Census & War Memorials | The History Revision Hub',
    metaDescription:
      'Complete UK Key Stage 2 Primary Local History Toolkit, classroom textbook, pupil workbook, and retrieval quizzes: Roman, Saxon & Viking place-names, 1880s Ordnance Survey maps, Tudor to Victorian High Streets, 1881 Census & School Logbooks, canals & stations, CWGC War Memorials, and oral history.',
    priority: '0.85',
  },
];

const SLUG_TO_ROUTE = new Map();
const UNIT_TO_ROUTE = new Map();

for (const route of SEO_UNIT_ROUTES) {
  UNIT_TO_ROUTE.set(route.unitId, route);
  SLUG_TO_ROUTE.set(route.slug.toLowerCase(), route);
  if (Array.isArray(route.aliases)) {
    for (const alias of route.aliases) {
      SLUG_TO_ROUTE.set(alias.toLowerCase(), route);
    }
  }
}

const UNLISTED_PATH_MAP = new Map([
  ['chess', 'chess'],
  ['chess-club', 'chess'],
  ['competitions', 'competitions'],
  ['awards', 'competitions'],
  ['young-historians', 'competitions'],
]);

/**
 * Resolves unlisted direct bookmark / QR pathnames (e.g. "/chess" or "/competitions")
 * to their SPA view name, keeping them off public navigation & search indexes.
 */
export function resolveUnlistedPathname(pathname) {
  if (!pathname || typeof pathname !== 'string') return null;
  const cleaned = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  return UNLISTED_PATH_MAP.get(cleaned) || null;
}

/**
 * Converts a raw lesson title/slug into a deterministic, dot-free kebab-case SEO slug.
 */
export function buildRawLessonSeoSlug(lesson, lessonIndex = 0) {
  const rawSource = String(lesson?.slug || lesson?.title || lesson?.id || `lesson-${lessonIndex + 1}`)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/gi, ' and ')
    .replace(/&/g, ' and ')
    .replace(/&ndash;|&mdash;|[–—]/gi, '-')
    .replace(/['’‘"“”]/g, '');

  let slug = rawSource
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) slug = `lesson-${lessonIndex + 1}`;
  if (slug.length > 74) {
    const trimmed = slug.slice(0, 74);
    const lastDash = trimmed.lastIndexOf('-');
    slug = lastDash > 28 ? trimmed.slice(0, lastDash) : trimmed.replace(/-+$/g, '');
  }
  return slug;
}

/**
 * Computes deterministic, collision-free SEO slugs for every lesson in a unit.
 */
export function getLessonSeoSlugList(lessons = []) {
  if (!Array.isArray(lessons)) return [];
  const used = new Set();
  return lessons.map((lesson, idx) => {
    const base = buildRawLessonSeoSlug(lesson, idx);
    let candidate = base;
    if (used.has(candidate)) {
      candidate = `${base}-${idx + 1}`;
    }
    used.add(candidate);
    return candidate;
  });
}

/**
 * Returns the canonical SEO slug for a single lesson within its unit lessons list.
 */
export function getLessonSeoSlug(lesson, lessonIndex = 0, allLessons = null) {
  if (Array.isArray(allLessons) && allLessons.length > lessonIndex && lessonIndex >= 0) {
    return getLessonSeoSlugList(allLessons)[lessonIndex];
  }
  return buildRawLessonSeoSlug(lesson, lessonIndex);
}

/**
 * Resolves a URL pathname (e.g. "/weimar-nazi-germany/" or "/weimar-nazi-germany/kt-1-1-.../")
 * into `{ unitId, lessonSlug }` or null if not an SEO course/lesson path.
 */
export function resolveRouteFromPathname(pathname) {
  if (!pathname || typeof pathname !== 'string') return null;
  const cleaned = pathname.replace(/^\/+|\/+$/g, '');
  if (!cleaned || cleaned.toLowerCase() === 'index.html') return null;
  const parts = cleaned.split('/').filter(Boolean);
  if (parts.length === 0 || parts.length > 2) return null;
  const route = SLUG_TO_ROUTE.get(parts[0].toLowerCase());
  if (!route) return null;
  return {
    unitId: route.unitId,
    courseSlug: route.slug,
    lessonSlug: parts[1] ? parts[1].toLowerCase() : null,
  };
}

/**
 * Resolves a URL pathname (e.g. "/weimar-nazi-germany" or "/weimar-nazi-germany/lesson-slug/")
 * to a canonical unitId, or null if not an SEO unit path.
 */
export function resolveUnitIdFromPathname(pathname) {
  const match = resolveRouteFromPathname(pathname);
  return match ? match.unitId : null;
}

/**
 * Returns the canonical clean path (e.g. "/weimar-nazi-germany/") for a unitId, or null.
 */
export function getCleanPathForUnit(unitId) {
  if (!unitId) return null;
  const route = UNIT_TO_ROUTE.get(unitId);
  return route ? `/${route.slug}/` : null;
}

/**
 * Returns the canonical clean path (e.g. "/weimar-nazi-germany/hyperinflation-1923/") for a lesson, or null.
 */
export function getCleanPathForLesson(unitId, lesson, lessonIndex = 0, allLessons = null) {
  if (!unitId || !lesson) return null;
  const route = UNIT_TO_ROUTE.get(unitId);
  if (!route) return null;
  const lessonSlug = getLessonSeoSlug(lesson, lessonIndex, allLessons);
  return `/${route.slug}/${lessonSlug}/`;
}

/**
 * Returns full SEO metadata object for a unitId, or null.
 */
export function getSeoRouteForUnit(unitId) {
  if (!unitId) return null;
  return UNIT_TO_ROUTE.get(unitId) || null;
}

const TRAILING_SLUG_STOPWORDS = new Set([
  'of',
  'at',
  'the',
  'to',
  'in',
  'on',
  'for',
  'and',
  'with',
  'from',
  'by',
  'into',
  'a',
  'an',
]);

export function slugifyReadingSegment(rawStr, maxLen = 52) {
  let s = String(rawStr || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;|&/gi, ' and ')
    .replace(/&ndash;|&mdash;|[–—]/gi, '-')
    .replace(/['’‘"“”]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (s.length > maxLen) {
    const trimmed = s.slice(0, maxLen);
    const lastDash = trimmed.lastIndexOf('-');
    s = lastDash > 16 ? trimmed.slice(0, lastDash) : trimmed.replace(/-+$/g, '');
  }
  const parts = s.split('-').filter(Boolean);
  while (parts.length > 3 && TRAILING_SLUG_STOPWORDS.has(parts[parts.length - 1])) {
    parts.pop();
  }
  return parts.join('-');
}

/**
 * Builds a clean, short literary permalink slug for a Guided Reading / Literary Companion item
 * (e.g. '"Dulce et Decorum Est": Answering the Recruitment Lie (1917)' -> 'dulce-et-decorum-est').
 */
export function buildShortReadingSeoSlug(reading, readingIndex = 0) {
  if (reading && reading.slug) {
    return slugifyReadingSegment(reading.slug, 60) || `reading-${readingIndex + 1}`;
  }
  const rawTitle = String(reading?.book_title || reading?.title || `reading-${readingIndex + 1}`).trim();
  const noTrailingParens = rawTitle.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const primaryPart = noTrailingParens
    .split(/\s*(?::|—|–)\s*/)[0]
    .replace(/\s*\([^)]*\)\s*$/, '')
    .trim();
  const primarySlug = slugifyReadingSegment(primaryPart, 48);
  if (
    primarySlug.length >= 8 &&
    /[a-z]{3}/.test(primarySlug) &&
    !/^\d+-\d+-a-m/.test(primarySlug)
  ) {
    return primarySlug;
  }
  return slugifyReadingSegment(noTrailingParens, 52) || `reading-${readingIndex + 1}`;
}

/**
 * Computes deterministic, globally collision-free slugs for Guided Reading items.
 * Pass `globalUsedSet` when generating across all units so every `/reading/<slug>/` is 100% unique.
 */
export function getReadingSeoSlugList(readings = [], unitId = '', globalUsedSet = null) {
  if (!Array.isArray(readings)) return [];
  const localUsed = globalUsedSet || new Set();
  const unitSuffix = unitId ? slugifyReadingSegment(unitId.replace(/^ks2_/, ''), 20) : '';
  return readings.map((reading, idx) => {
    const base = buildShortReadingSeoSlug(reading, idx);
    let candidate = base;
    if (localUsed.has(candidate) && unitSuffix) {
      candidate = `${base}-${unitSuffix}`;
    }
    if (localUsed.has(candidate)) {
      candidate = `${candidate}-${idx + 1}`;
    }
    localUsed.add(candidate);
    return candidate;
  });
}

export function getReadingSeoSlug(reading, readingIndex = 0, allReadings = null, unitId = '') {
  if (
    unitId &&
    typeof window !== 'undefined' &&
    window.state &&
    window.state.db &&
    typeof window.state.db === 'object'
  ) {
    const dbMap = window.state.db;
    const globalUsed = new Set();
    const orderedUnits = [
      ...SEO_UNIT_ROUTES.map((r) => r.unitId),
      ...Object.keys(dbMap).filter((k) => !UNIT_TO_ROUTE.has(k)),
    ];
    for (const uid of orderedUnits) {
      const wrapper = dbMap[uid];
      const uData = (wrapper && (wrapper.data || wrapper)) || null;
      const gr =
        uid === unitId && Array.isArray(allReadings) && allReadings.length
          ? allReadings
          : uData && Array.isArray(uData.guided_reading)
            ? uData.guided_reading
            : null;
      if (!gr || gr.length === 0) continue;
      const slugs = getReadingSeoSlugList(gr, uid, globalUsed);
      if (uid === unitId && slugs[readingIndex]) {
        return slugs[readingIndex];
      }
    }
  }
  if (Array.isArray(allReadings) && allReadings.length > readingIndex && readingIndex >= 0) {
    return getReadingSeoSlugList(allReadings, unitId)[readingIndex];
  }
  return buildShortReadingSeoSlug(reading, readingIndex);
}

/**
 * Builds the clean smart-paste display title for a Literary Companion
 * (e.g. 'Dulce et Decorum Est (Wilfred Owen) — Read-Aloud Companion').
 */
export function buildCleanReadingPageTitle(reading) {
  const rawTitle = String(reading?.book_title || reading?.title || 'Literary Companion')
    .replace(/<[^>]+>/g, '')
    .replace(/^["“']+|["”']+$/g, '')
    .replace(/["“”]/g, '')
    .trim();
  const shortMain = rawTitle.split(/\s*:\s*/)[0].trim() || rawTitle;
  const rawAuthor = String(reading?.author || '')
    .replace(/<[^>]+>/g, '')
    .split(/\s*[•·(]\s*/)[0]
    .trim();
  const hasAuthor =
    rawAuthor &&
    rawAuthor.length <= 36 &&
    !/history revision hub|narrative archive|traditional/i.test(rawAuthor) &&
    !shortMain.toLowerCase().includes(rawAuthor.toLowerCase().split(' ').pop());
  return hasAuthor
    ? `${shortMain} (${rawAuthor}) — Read-Aloud Companion`
    : `${shortMain} — Read-Aloud Companion`;
}

/**
 * Returns the canonical clean path (e.g. "/reading/dulce-et-decorum-est/") for a reading item.
 */
export function getCleanPathForReading(unitId, reading = null, readingIndex = 0, allReadings = null) {
  if (reading || (Array.isArray(allReadings) && allReadings[readingIndex])) {
    const target = reading || allReadings[readingIndex];
    const slug = getReadingSeoSlug(target, readingIndex, allReadings, unitId);
    if (slug) return `/reading/${slug}/`;
  }
  const route = unitId ? UNIT_TO_ROUTE.get(unitId) : null;
  return route ? `/${route.slug}/reading/` : null;
}

/**
 * Resolves "/reading/<slug>/" or "/<course-slug>/reading/" into `{ unitId, readingIndex, readingSlug }`.
 */
export function resolveReadingPathname(pathname, dbMap = null) {
  if (!pathname || typeof pathname !== 'string') return null;
  const cleaned = pathname.replace(/^\/+|\/+$/g, '');
  if (!cleaned) return null;
  const parts = cleaned.split('/').filter(Boolean);

  // Case 1: /<course-slug>/reading/
  if (parts.length === 2 && parts[1].toLowerCase() === 'reading') {
    const route = SLUG_TO_ROUTE.get(parts[0].toLowerCase());
    if (route) {
      return { unitId: route.unitId, readingIndex: 0, readingSlug: null };
    }
  }

  // Case 2: /reading/<reading-slug>/
  if (parts.length === 2 && parts[0].toLowerCase() === 'reading') {
    const targetSlug = parts[1].toLowerCase();
    // Check pre-rendered boot global first if available
    if (
      typeof window !== 'undefined' &&
      window.__initialReadingRoute &&
      window.__initialReadingRoute.slug === targetSlug
    ) {
      return {
        unitId: window.__initialReadingRoute.unitId,
        readingIndex: window.__initialReadingRoute.readingIndex || 0,
        readingSlug: targetSlug,
      };
    }
    // Otherwise scan dbMap (database_index.json or full database.json) in deterministic SEO_UNIT_ROUTES order
    if (dbMap && typeof dbMap === 'object') {
      const globalUsed = new Set();
      const orderedUnits = [
        ...SEO_UNIT_ROUTES.map((r) => r.unitId),
        ...Object.keys(dbMap).filter((k) => !UNIT_TO_ROUTE.has(k)),
      ];
      for (const uid of orderedUnits) {
        const wrapper = dbMap[uid];
        const uData = (wrapper && (wrapper.data || wrapper)) || null;
        const gr = uData && Array.isArray(uData.guided_reading) ? uData.guided_reading : null;
        if (!gr || gr.length === 0) continue;
        const slugs = getReadingSeoSlugList(gr, uid, globalUsed);
        const matchIdx = slugs.findIndex((s) => s === targetSlug);
        if (matchIdx !== -1) {
          return { unitId: uid, readingIndex: matchIdx, readingSlug: targetSlug };
        }
      }
    }
  }
  return null;
}
