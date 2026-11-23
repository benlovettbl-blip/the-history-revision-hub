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
    heading: 'The Industrial Revolution: Steam, Labour & Protest (1750–1900)',
    seoTitle:
      'The Industrial Revolution (1750–1900) | KS3 History Lessons & Revision | The History Revision Hub',
    metaDescription:
      'Interactive UK Key Stage 3 History lessons, primary sources, studio audio read-alouds, and retrieval quizzes on Britain’s Industrial Revolution (1750–1900): steam power, factory conditions, Peterloo, Chartism, and democratic reform.',
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
