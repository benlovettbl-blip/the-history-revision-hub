/**
 * Canonical SEO Route Registry for The History Revision Hub
 * Shared between Vite build-time static HTML/sitemap generation (vite.config.js)
 * and client-side SPA path resolution (src/main.js, src/navigation.js).
 */

export const SITE_ORIGIN = 'https://historyrevisionhub.co.uk';

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

  // Key Stage 3: Years 7–9 UK National Curriculum History
  {
    unitId: 'medieval_england',
    slug: 'medieval-england',
    aliases: ['medieval-england-1066-1485'],
    keyStage: 'Key Stage 3 (Year 7)',
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
    keyStage: 'Key Stage 3 (Year 8)',
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
    keyStage: 'Key Stage 3 (Year 7)',
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
    keyStage: 'Key Stage 3 (Year 8)',
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
    keyStage: 'Key Stage 3 (Year 8)',
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
    keyStage: 'Key Stage 3 (Year 8)',
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
    keyStage: 'Key Stage 3 (Year 8)',
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
    keyStage: 'Key Stage 3 (Year 9)',
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
    keyStage: 'Key Stage 3 (Year 9)',
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
    keyStage: 'Key Stage 3 (Year 9)',
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
    aliases: ['superpower-relations-cold-war'],
    keyStage: 'Key Stage 3 & GCSE',
    examBoard: 'UK Key Stage 3 & GCSE Modern World History',
    heading: 'Superpower Relations & The Cold War (1945–1991)',
    seoTitle:
      'The Cold War & Superpower Flashpoints (1945–1991) | KS3 & GCSE History Revision | The History Revision Hub',
    metaDescription:
      'Interactive History lessons, archival primary sources, studio audio read-alouds, and retrieval quizzes on the Cold War (1945–1991): Iron Curtain, Berlin Blockade and Wall, Cuban Missile Crisis, Détente, and the collapse of the USSR.',
    priority: '0.85',
  },
  {
    unitId: 'post_war_britain',
    slug: 'post-war-britain',
    aliases: ['modern-britain-1900-present'],
    keyStage: 'Key Stage 3 (Year 9)',
    examBoard: 'UK National Curriculum Key Stage 3 History',
    heading: 'Rights, Protest & Post-War Britain (1900–Present)',
    seoTitle:
      'Rights, Protest & Post-War Britain (1900–Present) | KS3 History Revision | The History Revision Hub',
    metaDescription:
      'Interactive UK Key Stage 3 History lessons, primary sources, audio read-alouds, and retrieval quizzes on Modern & Post-War Britain: Suffragettes, creation of the Welfare State and NHS, the Windrush generation, and civil rights.',
    priority: '0.85',
  },

  // Key Stage 2: Years 5–6 Primary History
  {
    unitId: 'ks2_ww2',
    slug: 'ks2-world-war-2',
    aliases: ['primary-ww2-home-front'],
    keyStage: 'Key Stage 2 (Years 5–6)',
    examBoard: 'UK National Curriculum Key Stage 2 Primary History',
    heading: 'World War II & The Home Front (1939–1945)',
    seoTitle:
      'KS2 World War II & The Home Front | Primary History Lessons, Audio & Quizzes | The History Revision Hub',
    metaDescription:
      'Age-calibrated UK Key Stage 2 Primary History lessons, studio audio read-aloud stories, authentic visual sources, and retrieval quizzes for World War II: Evacuation, the Blitz, Rationing, Battle of Britain, Kindertransport, and VE Day.',
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

/**
 * Resolves a URL pathname (e.g. "/weimar-nazi-germany" or "/weimar-nazi-germany/")
 * to a canonical unitId, or null if not an SEO unit path.
 */
export function resolveUnitIdFromPathname(pathname) {
  if (!pathname || typeof pathname !== 'string') return null;
  const cleaned = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!cleaned || cleaned === 'index.html') return null;
  const route = SLUG_TO_ROUTE.get(cleaned);
  return route ? route.unitId : null;
}

/**
 * Returns the canonical clean path (e.g. "/weimar-nazi-germany") for a unitId, or null.
 */
export function getCleanPathForUnit(unitId) {
  if (!unitId) return null;
  const route = UNIT_TO_ROUTE.get(unitId);
  return route ? `/${route.slug}` : null;
}

/**
 * Returns full SEO metadata object for a unitId, or null.
 */
export function getSeoRouteForUnit(unitId) {
  if (!unitId) return null;
  return UNIT_TO_ROUTE.get(unitId) || null;
}
