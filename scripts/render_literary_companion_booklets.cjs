#!/usr/bin/env node
/**
 * scripts/render_literary_companion_booklets.cjs
 *
 * THE HISTORY REVISION HUB — EDITORIAL SADDLE-STITCH LITERARY COMPANION ENGINE (v2)
 * Compiles Optional Home Reading & Tutor-Time Anthology HTMLs + A3 Saddle-Stitch PDFs
 * across all 20 KS2 & KS3 units (119 authentic stories, poems, myths & eyewitness voices).
 *
 * Exact Saddle-Stitch Page Signatures (Zero Spillover • Zero Blank Pages):
 *   1. 5-Enquiry Units (8 KS3 units)   -> Exactly  8 Pages (2 folded A3 sheets)
 *   2. 6-Enquiry Units (9 KS2/KS3)     -> Exactly  8 Pages (2 folded A3 sheets)
 *   3. 7-Enquiry Units (2 KS3 units)   -> Exactly 12 Pages (3 folded A3 sheets)
 *   4. 11-Enquiry Unit (ks2_ww2)       -> Exactly 16 Pages (4 folded A3 sheets)
 *
 * Key Editorial & Pedagogical Standards:
 *   - Era-curated full-colour editorial themes matched to the Master Textbook series
 *   - Aspect-aware Storybook Cover (Full-Width Landscape Hero Banner vs 2-Col Split Museum Plate)
 *   - Bi-directional `autoFitPages()` calibrator scaling KS2 story prose up to 12.5–14.2pt Lora
 *     (KS3 up to 11.2–13.0pt Lora) in a warm, open-measure parchment reading canvas (0 empty voids)
 *   - Spacious 2-page facing Story Check Quiz spreads on 7-lesson & 11-lesson units (0 micro-print)
 *   - Genuine 6-Story Quick Recall Check on 6-lesson units (0 phantom MCQ answer keys, 0 `…` truncations)
 *   - `pdf-parse` physical page count assertion (`pdf.numpages === expectedPages`)
 *   - Commercial School Cover Customizer (`?school=` + `.school-brand-target`) & 100% institutional neutrality
 *
 * Usage:
 *   node scripts/render_literary_companion_booklets.cjs            # Compiles all 20 KS2 & KS3 units
 *   node scripts/render_literary_companion_booklets.cjs <unit_id>  # Compiles specific unit(s)
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const pdfParse = require('pdf-parse');
const QRCode = require('qrcode');
const sharp = require('sharp');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const LC_DIR = path.join(DATA_DIR, 'literary_companions');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PUB_PDF_DIR = path.join(PUBLIC_DIR, 'pdfs');

fs.mkdirSync(PUB_PDF_DIR, { recursive: true });

// Canonical 20 KS2 & KS3 units with era palettes & Eyes-First verified cover plates
const UNIT_ANTHOLOGY_CONFIG = {
  // --- KEY STAGE 2 (8 Units) ---
  ks2_stone_to_iron_age: {
    stage: 'KS2',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 2 · Years 5 & 6 Home & Tutor-Time Anthology',
    cleanTitle: 'Stone Age to Iron Age Britain',
    dates: 'c. 800,000 BC – AD 43',
    subtitle: 'Hunter-Gatherers, Skara Brae, Stonehenge, Bronze Age & Celtic Hillforts',
    accent: '#b45309',
    accentDark: '#92400e',
    accentSoft: '#fef3c7',
    accentTint: '#fffbeb',
    heroBg: '#0f172a',
    heroImage: '/units/ks2_stone_to_iron_age/assets/banner_unit_hero.jpg',
    heroCaption:
      'Solstice sunrise shining directly between the giant sarsen trilithons and lintel stones at Stonehenge on Salisbury Plain.',
    expectedPages: 8,
  },
  ks2_ancient_egypt: {
    stage: 'KS2',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 2 · Years 5 & 6 Home & Tutor-Time Anthology',
    cleanTitle: 'Ancient Egypt',
    dates: 'c. 3100 – 30 BC',
    subtitle: 'The River Nile, Great Pyramids, Hieroglyphs, Pharaohs & The Afterlife',
    accent: '#1d4ed8',
    accentDark: '#1e3a8a',
    accentSoft: '#dbeafe',
    accentTint: '#eff6ff',
    heroBg: '#0f172a',
    heroImage: '/units/ks2_ancient_egypt/assets/banner_unit_hero.jpg',
    heroCaption:
      'The three Great Pyramids of Giza (Khufu, Khafre, and Menkaure) rising beside smaller stepped queens’ pyramids on the desert plateau.',
    expectedPages: 8,
  },
  ks2_ancient_greece: {
    stage: 'KS2',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 2 · Years 5 & 6 Home & Tutor-Time Anthology',
    cleanTitle: 'Ancient Greece',
    dates: 'c. 800 – 146 BC',
    subtitle: 'City-States, Athenian Democracy, Myths, Persian Wars & Lasting Legacy',
    accent: '#0369a1',
    accentDark: '#075985',
    accentSoft: '#e0f2fe',
    accentTint: '#f0f9ff',
    heroBg: '#0f172a',
    heroImage: '/units/ks2_ancient_greece/assets/banner_unit_hero.jpg',
    heroCaption:
      'The marble Doric columns of the Parthenon temple crowning the rocky Acropolis hill above Athens (5th century BC).',
    expectedPages: 8,
  },
  ks2_early_islamic_baghdad: {
    stage: 'KS2',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 2 · Years 5 & 6 Home & Tutor-Time Anthology',
    cleanTitle: 'Early Islamic Civilisation',
    dates: 'c. AD 750 – 1258',
    subtitle: 'The Round City of Baghdad, House of Wisdom, Silk Roads & Science',
    accent: '#047857',
    accentDark: '#065f46',
    accentSoft: '#d1fae5',
    accentTint: '#ecfdf5',
    heroBg: '#0f172a',
    heroImage: '/units/ks2_early_islamic_baghdad/assets/banner_unit_hero.jpg',
    heroCaption:
      'Carved horseshoe arches and shimmering gold-leaf floral mosaics exemplifying the geometry and craftsmanship of the Early Islamic world.',
    expectedPages: 8,
  },
  ks2_maya_civilisation: {
    stage: 'KS2',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 2 · Years 5 & 6 Home & Tutor-Time Anthology',
    cleanTitle: 'The Ancient Maya',
    dates: 'c. 2000 BC – AD 1500',
    subtitle: 'Rainforest Cities, Step Pyramids, Calendar Maths, Cacao & Living Maya',
    accent: '#0f766e',
    accentDark: '#115e59',
    accentSoft: '#ccfbf1',
    accentTint: '#f0fdfa',
    heroBg: '#0f172a',
    heroImage: '/units/ks2_maya_civilisation/assets/banner_unit_hero.jpg',
    heroCaption:
      'The stepped limestone pyramid of El Castillo (Temple of Kukulcán) with carved serpent balustrades at Chichén Itzá, Mexico.',
    expectedPages: 8,
  },
  ks2_crime_and_punishment: {
    stage: 'KS2',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 2 · Years 5 & 6 Home & Tutor-Time Anthology',
    cleanTitle: 'Crime and Punishment Through Time',
    dates: 'AD 43 – Present',
    subtitle: 'Roman Curse Tablets, Saxon Wergild, Robin Hood, 1605 Plot, Newgate & Forensic Science',
    accent: '#1d4ed8',
    accentDark: '#1e3a8a',
    accentSoft: '#dbeafe',
    accentTint: '#eff6ff',
    heroBg: '#0f172a',
    heroImage: '/units/ks2_crime_and_punishment/assets/banner_unit_hero.jpg',
    heroCaption:
      'Gilded bronze statue of Lady Justice holding an unsheathed sword and balance scales atop the Old Bailey Central Criminal Court in London.',
    expectedPages: 8,
  },
  ks2_kingdom_of_benin: {
    stage: 'KS2',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 2 · Years 5 & 6 Home & Tutor-Time Anthology',
    cleanTitle: 'The Kingdom of Benin',
    dates: 'c. AD 900 – 1897',
    subtitle: 'Rainforest Earthworks, Oba Ewuare, Igun Brass Casters, Queen Idia & 1897 Voices',
    accent: '#9a3412',
    accentDark: '#7c2d12',
    accentSoft: '#ffedd5',
    accentTint: '#fff7ed',
    heroBg: '#0f172a',
    heroImage: '/units/ks2_kingdom_of_benin/assets/banner_unit_hero.jpg',
    heroCaption:
      'Sixteenth-century royal Benin cast brass court plaque showing Edo chiefs wearing stacked coral-bead collars and ceremonial regalia.',
    expectedPages: 8,
  },
  ks2_victorian_britain: {
    stage: 'KS2',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 2 · Years 4 to 6 Home & Tutor-Time Anthology',
    cleanTitle: 'Victorian Britain',
    dates: '1837 – 1901',
    subtitle: 'Queen Victoria’s Train, Sarah Gooder’s Pit Testimony, Oliver Twist, Board Schools & 1851',
    accent: '#3730a3',
    accentDark: '#312e81',
    accentSoft: '#e0e7ff',
    accentTint: '#eef2ff',
    heroBg: '#0f172a',
    heroImage: '/units/ks2_victorian_britain/assets/banner_unit_hero.jpg',
    heroCaption:
      'William Powell Frith’s panoramic painting The Railway Station (1862), capturing Victorian families, porters, and detectives beneath Paddington’s iron roof.',
    expectedPages: 8,
  },
  ks2_local_history_detective: {
    stage: 'KS2',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 2 · Primary Home & Tutor-Time Anthology',
    cleanTitle: 'History on Our Doorstep',
    dates: 'AD 43 – Present',
    subtitle: 'Place-Name Clues, High Street Ghosts, 1881 Census, Adlestrop, Memorials & Living Memory',
    accent: '#0f766e',
    accentDark: '#115e59',
    accentSoft: '#ccfbf1',
    accentTint: '#f0fdfa',
    heroBg: '#0f172a',
    heroImage: '/units/ks2_local_history_detective/assets/banner_unit_hero.jpg',
    heroCaption:
      'Historic stone packhorse bridge and limestone cottages in Castle Combe, showing centuries of layered British local architecture.',
    expectedPages: 8,
  },
  ks2_romans: {
    stage: 'KS2',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 2 · Years 5 & 6 Home & Tutor-Time Anthology',
    cleanTitle: 'The Romans in Britain',
    dates: '55 BC – AD 410',
    subtitle: 'Invasion, Queen Boudicca, Hadrian’s Wall, Roman Towns & Legacy',
    accent: '#b91c1c',
    accentDark: '#991b1b',
    accentSoft: '#fee2e2',
    accentTint: '#fef2f2',
    heroBg: '#0f172a',
    heroImage: '/units/ks2_romans/assets/banner_unit_hero.jpg',
    heroCaption:
      'Roman legionaries in segmented iron armour (lorica segmentata) locking curved rectangular scuta shields in battle formation.',
    expectedPages: 8,
  },
  ks2_anglo_saxons_vikings: {
    stage: 'KS2',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 2 · Years 5 & 6 Home & Tutor-Time Anthology',
    cleanTitle: 'Anglo-Saxons & Vikings',
    dates: 'AD 410 – 1066',
    subtitle: 'Mead-Halls, Sutton Hoo, Lindisfarne, Alfred the Great, Jorvik & 1066',
    accent: '#991b1b',
    accentDark: '#7f1d1d',
    accentSoft: '#fee2e2',
    accentTint: '#fef2f2',
    heroBg: '#0f172a',
    heroImage: '/units/ks2_anglo_saxons_vikings/assets/banner_unit_hero.jpg',
    heroCaption:
      'Reconstructed clinker-built oak Viking longship gliding across coastal waters beneath a square red woollen sail.',
    expectedPages: 8,
  },
  ks2_ww2: {
    stage: 'KS2',
    unitWord: 'Lesson',
    stageLabel: 'Key Stage 2 · Years 5 & 6 Home & Tutor-Time Anthology',
    cleanTitle: 'World War II & The Home Front',
    dates: '1933 – 1945',
    subtitle: 'Evacuation, Kindertransport, The Blitz, Rationing, Bletchley Park & Peace',
    accent: '#1d4ed8',
    accentDark: '#1e3a8a',
    accentSoft: '#dbeafe',
    accentTint: '#eff6ff',
    heroBg: '#0f172a',
    heroImage: '/units/ks2_ww2/assets/banner_unit_hero.jpg',
    heroCaption:
      'Operation Pied Piper (September 1939) — British schoolchildren wearing tie-on lapel labels carry satchels and gas-mask boxes to evacuation trains.',
    expectedPages: 16,
  },

  // --- KEY STAGE 3 (12 Units) ---
  water_and_sanitation: {
    stage: 'KS3',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 3 · Year 7 Literary & Eyewitness Anthology',
    cleanTitle: 'Water & Sanitation Through Time',
    dates: 'c. AD 43 – 1900',
    subtitle: 'Roman Aqueducts, Medieval Conduits, King Cholera, John Snow & Bazalgette',
    accent: '#0f766e',
    accentDark: '#115e59',
    accentSoft: '#ccfbf1',
    accentTint: '#f0fdfa',
    heroBg: '#f8fafc',
    heroImage: '/images/ks3_was/was_l5_s0_snow_cholera_spot_map_1854.jpg',
    heroCaption:
      'Dr John Snow’s 1854 Soho spot map plotting fatal cholera deaths as black bars clustered tightly around the Broad Street water pump.',
    expectedPages: 8,
  },
  medieval_england: {
    stage: 'KS3',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 3 · Year 7 Literary & Eyewitness Anthology',
    cleanTitle: 'Medieval England',
    dates: '1066 – 1485',
    subtitle: 'Hastings, Norman Control, Thomas Becket, Magna Carta, Black Death & 1381',
    accent: '#991b1b',
    accentDark: '#7f1d1d',
    accentSoft: '#fee2e2',
    accentTint: '#fef2f2',
    heroBg: '#f5efe6',
    heroImage: '/images/ks3_med7/med7_l1_s4_bayeux_harold_death_scene57.jpg',
    heroCaption:
      'Scene 57 of the 11th-century Bayeux Tapestry inscribed "HAROLD REX INTERFECTUS EST" ("King Harold is killed") at Hastings, 14 October 1066.',
    expectedPages: 8,
  },
  monarchy_religion_power: {
    stage: 'KS3',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 3 · Year 8 Literary & Eyewitness Anthology',
    cleanTitle: 'Crown, Church & Parliament',
    dates: '1517 – 1689',
    subtitle: 'Tudor Reformation, Spanish Armada, Civil War, Republic & 1689 Bill of Rights',
    accent: '#9a3412',
    accentDark: '#7c2d12',
    accentSoft: '#ffedd5',
    accentTint: '#fff7ed',
    heroBg: '#1c1917',
    heroImage: '/images/family_of_henry_viii_c1545.jpg',
    heroCaption:
      'The Family of Henry VIII (c. 1545, Royal Collection), depicting Henry VIII enthroned beside Prince Edward, Jane Seymour, Mary, and Elizabeth.',
    expectedPages: 8,
  },
  first_british_empire: {
    stage: 'KS3',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 3 · Year 8 Literary & Eyewitness Anthology',
    cleanTitle: 'The First British Empire',
    dates: '1600 – 1783',
    subtitle: 'Mughal India, Atlantic Enslavement, Resistance & The American Revolution',
    accent: '#1e40af',
    accentDark: '#1e3a8a',
    accentSoft: '#dbeafe',
    accentTint: '#eff6ff',
    heroBg: '#f3ebdc',
    heroImage: '/images/first_british_empire/battle_of_plassey_1757.jpg',
    heroCaption:
      'Eighteenth-century engraved battle plan of the Battle of Plassey along the Bhagirathi River in Bengal (23 June 1757).',
    expectedPages: 8,
  },
  industrialisation_and_empire: {
    stage: 'KS3',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 3 · Year 8 Literary & Eyewitness Anthology',
    cleanTitle: 'Industrialisation, Power & Protest',
    dates: '1750 – 1900',
    subtitle: 'Steam Power, Factory Reform, Peterloo, Chartism & Industrial Britain',
    accent: '#b45309',
    accentDark: '#92400e',
    accentSoft: '#fef3c7',
    accentTint: '#fffbeb',
    heroBg: '#0f172a',
    heroImage: '/images/ks3_ind/ind_l1_s0_coalbrookdale_by_night_1801.jpg',
    heroCaption:
      'Philipp Jakob Loutherbourg’s 1801 oil painting Coalbrookdale by Night, showing coke-fired blast furnaces lighting Ironbridge Gorge.',
    expectedPages: 8,
  },
  second_british_empire: {
    stage: 'KS3',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 3 · Year 8 Literary & Eyewitness Anthology',
    cleanTitle: 'The Second British Empire',
    dates: '1783 – 1914',
    subtitle: 'Abolition, The 1857 Indian Rebellion, Scramble for Africa & Imperial Legacies',
    accent: '#881337',
    accentDark: '#4c0519',
    accentSoft: '#ffe4e6',
    accentTint: '#fff1f2',
    heroBg: '#f5efe2',
    heroImage: '/images/imperial_federation_map.jpg',
    heroCaption:
      'Walter Crane’s 1886 Graphic supplement map "Imperial Federation — Map of the World Showing the Extent of the British Empire in 1886."',
    expectedPages: 8,
  },
  australia: {
    stage: 'KS3',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 3 · Year 8 Literary & Eyewitness Anthology',
    cleanTitle: 'Invasion & Survival in Australia',
    dates: '1768 – 1901',
    subtitle: 'First Nations Country, Cook, Convict Hulks, Frontier Resistance & Federation',
    accent: '#0369a1',
    accentDark: '#075985',
    accentSoft: '#e0f2fe',
    accentTint: '#f0f9ff',
    heroBg: '#0f172a',
    heroImage: '/images/prison_hulks.jpg',
    heroCaption:
      'Late 18th-century painting of decommissioned British naval prison hulks moored in harbour holding convicts prior to transportation.',
    expectedPages: 8,
  },
  great_war: {
    stage: 'KS3',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 3 · Year 9 Literary & Eyewitness Anthology',
    cleanTitle: 'Causes of the Great War',
    dates: '1871 – 1914',
    subtitle: 'Alliances, Imperial Rivalry, Dreadnoughts, Sarajevo & The July Crisis',
    accent: '#0f766e',
    accentDark: '#115e59',
    accentSoft: '#ccfbf1',
    accentTint: '#f0fdfa',
    heroBg: '#f1f5f9',
    heroImage: '/images/great_war_cover.jpg',
    heroCaption:
      'Royal Navy all-big-gun turbine battleship HMS Dreadnought (launched 1906) steaming at sea during the Anglo-German naval arms race.',
    expectedPages: 8,
  },
  great_war_part2: {
    stage: 'KS3',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 3 · Year 9 Literary & Eyewitness Anthology',
    cleanTitle: 'The Course of the Great War',
    dates: '1914 – 1919',
    subtitle: 'Recruitment, Western Front Trenches, Empire Troops, Home Front & Versailles',
    accent: '#b91c1c',
    accentDark: '#991b1b',
    accentSoft: '#fee2e2',
    accentTint: '#fef2f2',
    heroBg: '#1c1917',
    heroImage: '/images/sargent_gassed_1919.jpg',
    heroCaption:
      'John Singer Sargent’s 1919 canvas Gassed (Imperial War Museum), showing blinded British soldiers guided along duckboards in August 1918.',
    expectedPages: 8,
  },
  the_shoah: {
    stage: 'KS3',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 3 · Year 9 Eyewitness & Testimony Anthology',
    cleanTitle: 'The Shoah',
    dates: '1933 – 1945',
    subtitle: 'Pre-War Jewish Life, Persecution, Ghettos, Resistance & Survivor Testimony',
    accent: '#1e3a8a',
    accentDark: '#172554',
    accentSoft: '#dbeafe',
    accentTint: '#eff6ff',
    heroBg: '#1c1917',
    heroImage: '/images/the_shoah/shoah_gr0_vilna_yiddish_youth_journal_1926.jpg',
    heroCaption:
      'October 1926 cover of the illustrated Vilna Yiddish youth magazine Grininke beymelekh ("Little Green Trees", Issue No. 1, Wilno).',
    expectedPages: 12,
  },
  cold_war: {
    stage: 'KS3',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 3 · Year 9 Literary & Eyewitness Anthology',
    cleanTitle: 'The Cold War & Global Flashpoints',
    dates: '1945 – 1991',
    subtitle: 'Yalta & Potsdam, Berlin Blockade, Cuban Missiles, Détente & 1989 Collapse',
    accent: '#0f766e',
    accentDark: '#115e59',
    accentSoft: '#ccfbf1',
    accentTint: '#f0fdfa',
    heroBg: '#0f172a',
    heroImage: '/images/cold_war_cover.jpg',
    heroCaption:
      'The Berlin Wall in 1986: West Berlin graffiti covers the outer concrete wall while East German border guards patrol the inner "Death Strip."',
    expectedPages: 12,
  },
  post_war_britain: {
    stage: 'KS3',
    unitWord: 'Enquiry',
    stageLabel: 'Key Stage 3 · Year 9 Literary & Eyewitness Anthology',
    cleanTitle: 'Rights, Protest & Post-War Britain',
    dates: '1900 – Present',
    subtitle: 'Suffragettes, The Welfare State & NHS, Windrush, Civil Rights & Social Change',
    accent: '#1d4ed8',
    accentDark: '#1e3a8a',
    accentSoft: '#dbeafe',
    accentTint: '#eff6ff',
    heroBg: '#f5efe2',
    heroImage: '/images/post_war_britain_cover.jpg',
    heroCaption:
      'Abram Games’s 1951 South Bank Exhibition guide cover for the Festival of Britain in London, celebrating post-war national renewal.',
    expectedPages: 8,
  },
};

const ALL_UNIT_IDS = Object.keys(UNIT_ANTHOLOGY_CONFIG);

const imageCache = new Map();
async function getOptimizedBase64Asset(relUrl, maxWidth = 760) {
  if (!relUrl) return { dataUri: '', aspectRatio: 1.5 };
  const cacheKey = `${relUrl}::${maxWidth}`;
  if (imageCache.has(cacheKey)) return imageCache.get(cacheKey);

  const clean = String(relUrl).replace(/^\//, '');
  let p = path.join(PUBLIC_DIR, clean);
  if (!fs.existsSync(p)) {
    p = path.join(ROOT_DIR, clean);
  }
  if (!fs.existsSync(p)) {
    throw new Error(`Missing visual asset on disk: ${relUrl}`);
  }

  try {
    const meta = await sharp(p).metadata();
    const aspectRatio =
      meta.width && meta.height ? +(meta.width / meta.height).toFixed(3) : 1.5;
    const buf = await sharp(p)
      .flatten({ background: '#ffffff' })
      .resize({ width: maxWidth, withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();
    const res = {
      dataUri: `data:image/jpeg;base64,${buf.toString('base64')}`,
      aspectRatio,
    };
    imageCache.set(cacheKey, res);
    return res;
  } catch (err) {
    const ext = path.extname(p).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
    const res = {
      dataUri: `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`,
      aspectRatio: 1.5,
    };
    imageCache.set(cacheKey, res);
    return res;
  }
}

async function generateQrDataUri(url) {
  return QRCode.toDataURL(url, {
    width: 168,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#0f172a', light: '#ffffff' },
  });
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/&lt;(\/?(?:strong|em|i|b))&gt;/gi, '<$1>')
    .replace(/&lt;br\s*\/?&gt;/gi, '<br>');
}

function formatInlineHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/\*\*\*([^*\n]+)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .trim();
}

function formatExtractHtml(rawExtract) {
  const cleaned = String(rawExtract || '')
    .replace(/<div class="reading-glossary"[\s\S]*?<\/div>/gi, '')
    .replace(/<div style="background: #f8fafc;[\s\S]*?<\/div>/gi, '')
    .trim();
  const normalized = formatInlineHtml(cleaned);
  const chunks = normalized
    .split(/(?:<br\s*\/?>\s*){2,}|\n\n+/)
    .map((c) => c.trim())
    .filter(Boolean);

  return chunks
    .map((chunk) => {
      if (/^<div\s+class=["']reading-stanza["']/i.test(chunk)) {
        return chunk;
      }
      return `<p class="story-para">${chunk}</p>`;
    })
    .join('\n');
}

function resolveVoiceBadge(item) {
  const mode = item.literary_mode || item.provenance_tier || '';
  if (mode === 'storied_micro_history') {
    return { short: 'True Story', medium: 'True Historical Story', full: 'True Historical Story' };
  }
  if (mode === 'verbatim_literature') {
    return { short: 'Literature & Verse', medium: 'Classic Literature & Verse', full: 'Classic Literature, Myth & Verse' };
  }
  if (mode === 'scholarly_summary') {
    return { short: 'Historical Lens', medium: 'Historical Perspective', full: 'Historian & Archival Perspective' };
  }
  return { short: 'Eyewitness', medium: 'Eyewitness Voice', full: 'Eyewitness Diary, Letter & Speech' };
}

function cleanTabLabel(item, idx) {
  return String(item.short_tab_title || item.book_title || `Story ${idx + 1}`)
    .replace(/^\d+\.\s*/, '')
    .replace(/^(?:Enquiry|Lesson)\s*\d+\s*[:\-–—.]\s*/i, '')
    .trim();
}

function resolveDistinctSubGenre(item, voice) {
  const raw = String(item.source_type_label || '').trim();
  if (!raw) return '';
  const normRaw = raw.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const normShort = voice.medium.toLowerCase();
  const normFull = voice.full.toLowerCase();
  if (normRaw === normShort || normRaw === normFull) return '';
  // If raw starts with "True Historical Story (October 1941)", extract just the date/qualifier!
  const parenMatch = raw.match(/^true historical story\s*\(([^)]+)\)$/i);
  if (parenMatch) return parenMatch[1].trim();
  return raw;
}

function buildSharedCss(cfg) {
  return `
    :root {
      --acc: ${cfg.accent};
      --acc-dark: ${cfg.accentDark};
      --acc-soft: ${cfg.accentSoft};
      --acc-tint: ${cfg.accentTint};
      --navy: #0f172a;
      --ink: #1e293b;
      --parchment: #fffdf9;
      --parchment-border: #dfd6c7;
      --gold: #f59e0b;
      --hero-bg: ${cfg.heroBg || '#0f172a'};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: 210mm 297mm; margin: 0; }
    html, body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: var(--navy);
      background: #cbd5e1;
    }
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .screen-toolbar {
      width: 100%;
      background: var(--navy);
      color: #ffffff;
      padding: 9px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      border-bottom: 3px solid var(--acc);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .screen-toolbar-actions { display: flex; gap: 7px; flex-wrap: wrap; align-items: center; }
    .screen-toolbar a, .screen-toolbar button {
      background: #1e293b;
      color: #ffffff;
      border: 1px solid #64748b;
      padding: 5px 11px;
      border-radius: 5px;
      font-size: 8.2pt;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .screen-toolbar a.primary-dl, .screen-toolbar button.primary-print {
      background: var(--acc);
      border-color: rgba(255,255,255,0.35);
    }

    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      background: #ffffff;
      color: var(--navy);
      margin: 7mm auto;
      padding: 9mm 12mm 8mm 12mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
      page-break-inside: avoid;
      break-inside: avoid;
      box-shadow: 0 8px 26px rgba(15, 23, 42, 0.18);
      position: relative;
    }
    .page:last-of-type {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }

    @media print {
      html, body { background: #ffffff !important; margin: 0 !important; padding: 0 !important; }
      .screen-toolbar { display: none !important; }
      .page {
        margin: 0 !important;
        box-shadow: none !important;
        page-break-after: always;
        break-after: page;
      }
      .page:last-of-type {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      .vocab-card, .talk-item, .quiz-story-block, .guide-story-card, .voice-profile-row, .passport-card {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    }

    /* Universal Footer & Subpage Headers */
    .ftr {
      height: 19px;
      flex: 0 0 19px;
      border-top: 1.5px solid var(--navy);
      padding-top: 3px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.3pt;
      color: #475569;
      font-weight: 600;
    }
    .ftr > span:first-child {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pg-pill {
      background: var(--navy);
      color: #ffffff;
      font-weight: 800;
      font-size: 7.1pt;
      padding: 1.5px 8px;
      border-radius: 999px;
      margin-left: 10px;
      flex-shrink: 0;
    }

    .subpage-hdr {
      display: flex;
      align-items: stretch;
      gap: 9px;
      margin-bottom: 6px;
      flex-shrink: 0;
    }
    .subpage-num {
      width: 58px;
      background: var(--acc);
      color: #ffffff;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3px 2px;
      flex-shrink: 0;
    }
    .subpage-num small { font-size: 5.9pt; font-weight: 800; letter-spacing: 0.08em; opacity: 0.92; text-transform: uppercase; }
    .subpage-num span { font-size: 16pt; font-weight: 900; line-height: 1.08; }
    .subpage-tt {
      flex: 1;
      min-width: 0;
      border-bottom: 3px solid var(--acc);
      padding-bottom: 3px;
    }
    .subpage-kicker {
      font-size: 6.9pt;
      font-weight: 800;
      letter-spacing: 0.07em;
      color: var(--acc-dark);
      text-transform: uppercase;
    }
    .subpage-tt h2 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 13.6pt;
      font-weight: 900;
      color: var(--navy);
      line-height: 1.15;
      margin-top: 1px;
    }
    .subpage-pill {
      align-self: center;
      background: var(--navy);
      color: #ffffff;
      font-size: 7.6pt;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 999px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* ================= PAGE 1: STORYBOOK COVER ================= */
    .cover-main {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 7px;
    }
    .cover-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.1pt;
      font-weight: 800;
      letter-spacing: 0.07em;
      color: var(--acc-dark);
      border-bottom: 2px solid var(--navy);
      padding-bottom: 4px;
      text-transform: uppercase;
      gap: 8px;
    }
    .cover-opt-badge {
      background: var(--acc-soft);
      color: var(--acc-dark);
      border: 1px solid var(--acc);
      padding: 1.5px 7px;
      border-radius: 4px;
      font-size: 6.6pt;
      font-weight: 900;
      letter-spacing: 0.06em;
      white-space: nowrap;
    }

    /* Wide Landscape Hero Mode */
    .cover-wide-banner {
      background: var(--navy);
      color: #ffffff;
      border-radius: 8px;
      padding: 11px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      border-bottom: 4px solid var(--acc);
    }
    .cover-kicker {
      font-size: 7.2pt;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #fbbf24;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .cover-h1 {
      font-family: 'Cinzel', 'Playfair Display', Georgia, serif;
      font-size: 20.5pt;
      font-weight: 900;
      line-height: 1.08;
      color: #ffffff;
    }
    .cover-period-inline {
      display: inline-block;
      font-family: 'Inter', sans-serif;
      font-size: 11pt;
      font-weight: 900;
      color: #38bdf8;
      margin-left: 6px;
    }
    .cover-sub {
      font-family: 'Lora', Georgia, serif;
      font-style: italic;
      font-size: 9.2pt;
      line-height: 1.32;
      color: #e2e8f0;
      margin-top: 4px;
    }
    .cover-stat-stack {
      display: flex;
      flex-direction: column;
      gap: 5px;
      flex-shrink: 0;
    }
    .cover-stat-chip {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.24);
      border-radius: 5px;
      padding: 4px 9px;
      font-size: 7.1pt;
      font-weight: 700;
      color: #f8fafc;
      white-space: nowrap;
      text-align: center;
    }
    .cover-wide-art {
      background: var(--navy);
      border-radius: 8px;
      overflow: hidden;
      border: 1.5px solid var(--navy);
    }
    .cover-wide-img-wrap {
      width: 100%;
      height: 58mm;
      background: var(--hero-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .cover-wide-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .cover-art-cap {
      background: var(--navy);
      color: #e2e8f0;
      font-size: 6.9pt;
      line-height: 1.3;
      padding: 5px 10px;
      border-top: 2px solid var(--acc);
    }

    /* Split Museum Hero Mode (Portrait / Square Archival Plates) */
    .cover-split-grid {
      display: grid;
      grid-template-columns: 1.06fr 0.94fr;
      gap: 10px;
      height: 78mm;
    }
    .cover-split-title-card {
      background: var(--navy);
      color: #ffffff;
      border-radius: 8px;
      padding: 13px 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-bottom: 4px solid var(--acc);
    }
    .cover-split-art-card {
      background: var(--navy);
      border-radius: 8px;
      overflow: hidden;
      border: 1.5px solid var(--navy);
      display: flex;
      flex-direction: column;
    }
    .cover-split-img-wrap {
      flex: 1;
      min-height: 0;
      background: var(--hero-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 4px;
    }
    .cover-split-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    /* How-to-Read 3-Step Ribbon + Pupil Strip */
    .cover-howto-ribbon {
      background: var(--parchment);
      border: 1.5px solid var(--parchment-border);
      border-left: 4.5px solid var(--acc);
      border-radius: 6px;
      padding: 7px 11px;
    }
    .howto-ribbon-hdr {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }
    .howto-ribbon-kicker {
      font-size: 7.2pt;
      font-weight: 900;
      letter-spacing: 0.08em;
      color: var(--acc-dark);
      text-transform: uppercase;
    }
    .howto-ribbon-sub {
      font-size: 6.9pt;
      font-weight: 700;
      color: #475569;
    }
    .howto-steps-3col {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .howto-step-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 5px 7px;
      font-size: 7.4pt;
      line-height: 1.28;
      color: var(--ink);
    }
    .howto-step-num {
      display: inline-block;
      background: var(--acc);
      color: #ffffff;
      font-size: 6.4pt;
      font-weight: 900;
      padding: 0.5px 5px;
      border-radius: 3px;
      margin-right: 4px;
      text-transform: uppercase;
    }

    .pupil-id-strip {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 5.5px 10px;
      display: grid;
      grid-template-columns: 1.45fr 1fr 0.9fr;
      gap: 10px;
      font-size: 8.0pt;
      font-weight: 800;
      color: var(--navy);
    }
    .blank-line {
      display: inline-block;
      border-bottom: 1.3px solid #334155;
      min-width: 26mm;
      height: 3.4mm;
    }

    /* Cover Directory (Table for 5–6 Stories; 2-Column Grid for 7–11 Stories) */
    .cover-dir-wrap {
      border: 1.5px solid var(--navy);
      border-radius: 6px;
      overflow: hidden;
      background: #ffffff;
    }
    .dir-banner {
      background: var(--navy);
      color: #ffffff;
      padding: 5.5px 11px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.4pt;
      font-weight: 800;
      letter-spacing: 0.07em;
      text-transform: uppercase;
    }
    .dir-banner-sub {
      font-size: 6.9pt;
      font-weight: 600;
      letter-spacing: 0;
      color: #cbd5e1;
      text-transform: none;
    }
    .dir-table {
      width: 100%;
      border-collapse: collapse;
    }
    .dir-table th {
      background: #f1f5f9;
      color: #334155;
      font-size: 6.8pt;
      font-weight: 800;
      letter-spacing: 0.05em;
      padding: 4.5px 9px;
      text-align: left;
      text-transform: uppercase;
      border-bottom: 1.5px solid #cbd5e1;
    }
    .dir-table td {
      padding: 7.5px 9px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: middle;
    }
    .dir-table tr:last-child td { border-bottom: none; }
    .dir-table tr:nth-child(even) td { background: #f8fafc; }

    .code-pill {
      display: inline-block;
      background: var(--acc);
      color: #ffffff;
      font-size: 6.9pt;
      font-weight: 900;
      letter-spacing: 0.03em;
      padding: 2px 6.5px;
      border-radius: 4px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .voice-chip {
      display: inline-block;
      background: var(--acc-tint);
      color: var(--acc-dark);
      border: 1px solid var(--acc);
      border-radius: 3px;
      padding: 1px 5px;
      font-size: 6.3pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      white-space: nowrap;
    }
    .dir-story-tt {
      font-size: 8.9pt;
      font-weight: 800;
      color: var(--navy);
      line-height: 1.22;
    }
    .dir-story-author {
      font-family: 'Lora', Georgia, serif;
      font-style: italic;
      font-size: 7.6pt;
      color: #475569;
      margin-top: 1px;
    }

    /* 2-Column Compact Directory Grid (7 & 11 Stories) */
    .dir-2col-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: #ffffff;
    }
    .dir-2col-item {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 6.5px 9px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
    }
    .dir-2col-item:nth-child(2n) { border-right: none; }
    .dir-2col-body {
      flex: 1;
      min-width: 0;
    }
    .dir-2col-tt {
      font-size: 8.1pt;
      font-weight: 800;
      color: var(--navy);
      line-height: 1.2;
    }
    .dir-2col-meta {
      font-size: 6.8pt;
      color: #475569;
      margin-top: 1.5px;
      display: flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
    }
    .dir-2col-pg {
      font-size: 7.8pt;
      font-weight: 900;
      color: var(--acc-dark);
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* ================= PAGE 2: INSIDE FRONT COVER ================= */
    .ifc-main {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 7px;
    }
    .ifc-audio-banner {
      background: var(--parchment);
      border: 1.5px solid var(--parchment-border);
      border-left: 4.5px solid var(--acc);
      border-radius: 6px;
      padding: 7px 11px;
      display: grid;
      grid-template-columns: 1fr 24mm;
      gap: 10px;
      align-items: center;
    }
    .passport-11-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 7px 9px;
    }
    .passport-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 3.5px solid var(--acc);
      border-radius: 5px;
      padding: 6.5px 9px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 4px;
    }
    .passport-card-tt {
      font-size: 8.3pt;
      font-weight: 800;
      color: var(--navy);
      line-height: 1.2;
    }
    .passport-card-sub {
      font-family: 'Lora', Georgia, serif;
      font-style: italic;
      font-size: 7.3pt;
      color: #475569;
      line-height: 1.22;
    }
    .passport-card-sign {
      border-top: 1px dashed #cbd5e1;
      padding-top: 3px;
      display: flex;
      justify-content: space-between;
      font-size: 6.9pt;
      font-weight: 700;
      color: var(--navy);
    }

    .ifc-sec-bar {
      background: var(--navy);
      color: #ffffff;
      font-size: 7.1pt;
      font-weight: 800;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 4px;
    }
    .ifc-voices-list {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .voice-profile-row {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 3.5px solid var(--acc);
      border-radius: 4px;
      padding: 5.5px 9px;
      font-size: 7.6pt;
      line-height: 1.26;
    }
    .ifc-vocab-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5.5px 8px;
    }

    /* ================= STORY PAGES (1 FULL SPACIOUS PAGE PER STORY) ================= */
    .story-main {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 6.5px;
    }
    .story-run-strip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--navy);
      padding-bottom: 3px;
      font-size: 7.1pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--acc-dark);
      flex-shrink: 0;
    }
    .story-top-grid {
      display: grid;
      grid-template-columns: 44mm 1fr 27mm;
      gap: 8px;
      align-items: stretch;
      flex-shrink: 0;
    }
    .story-art-card {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
      background: var(--navy);
      display: flex;
      flex-direction: column;
    }
    .story-art-frame {
      width: 100%;
      height: 29mm;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 2px;
    }
    .story-art-frame img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .story-art-cap {
      background: var(--navy);
      color: #f1f5f9;
      font-size: 6.6pt;
      line-height: 1.22;
      padding: 4px 6px;
      border-top: 2px solid var(--acc);
      flex: 1;
    }

    .story-meta-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 4px solid var(--acc);
      border-radius: 6px;
      padding: 7px 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 4px;
    }
    .story-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      align-items: center;
    }
    .enq-badge {
      background: var(--acc);
      color: #ffffff;
      font-size: 6.7pt;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 1.5px 6.5px;
      border-radius: 3px;
    }
    .genre-badge {
      background: var(--acc-soft);
      color: var(--acc-dark);
      border: 1px solid var(--acc);
      font-size: 6.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 1px 6px;
      border-radius: 3px;
    }
    .subgenre-pill {
      background: #eef2f7;
      color: #334155;
      border: 1px solid #cbd5e1;
      font-size: 6.4pt;
      font-weight: 700;
      padding: 1px 5.5px;
      border-radius: 3px;
    }
    .story-h2 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 13.0pt;
      font-weight: 900;
      line-height: 1.15;
      color: var(--navy);
      margin-top: 2px;
    }
    .story-author {
      font-size: 7.9pt;
      font-weight: 700;
      color: var(--acc-dark);
      margin-top: 1px;
    }
    .story-context-box {
      font-size: 7.8pt;
      line-height: 1.3;
      color: var(--ink);
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 4.5px 7px;
    }

    .story-qr-card {
      border: 1.5px solid var(--navy);
      border-radius: 6px;
      overflow: hidden;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
    }
    .qr-top-tag {
      width: 100%;
      background: var(--navy);
      color: #fbbf24;
      font-size: 6.1pt;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 2.5px 2px;
    }
    .story-qr-card img {
      width: 21.5mm;
      height: 21.5mm;
      display: block;
      margin: 2px auto 0 auto;
    }
    .qr-caption {
      font-size: 6.3pt;
      font-weight: 800;
      line-height: 1.16;
      color: var(--navy);
      padding: 0 3px 3.5px 3px;
    }

    /* Step 1 Vocabulary */
    .vocab-section {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 5.5px 9px;
      flex-shrink: 0;
    }
    .sec-kicker {
      font-size: 7.0pt;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--navy);
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sec-kicker-hint {
      font-weight: 700;
      font-size: 6.7pt;
      color: var(--acc-dark);
      text-transform: none;
      letter-spacing: 0;
    }
    .vocab-grid-4 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4.5px 8px;
    }
    .vocab-grid-5 {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 4.5px 7px;
    }
    .vocab-grid-5 > .vocab-card:nth-child(1),
    .vocab-grid-5 > .vocab-card:nth-child(2) { grid-column: span 3; }
    .vocab-grid-5 > .vocab-card:nth-child(3),
    .vocab-grid-5 > .vocab-card:nth-child(4),
    .vocab-grid-5 > .vocab-card:nth-child(5) { grid-column: span 2; }

    .vocab-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-left: 3px solid var(--acc);
      border-radius: 4px;
      padding: 4px 7px;
      font-size: 7.8pt;
      line-height: 1.26;
      color: var(--ink);
    }
    .vocab-term-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      flex-wrap: wrap;
    }
    .vocab-term-name {
      font-weight: 800;
      color: var(--navy);
    }
    .pron-tag {
      font-family: 'Inter', sans-serif;
      font-size: 6.9pt;
      font-weight: 700;
      color: var(--acc-dark);
      background: var(--acc-tint);
      border: 1px solid var(--acc);
      border-radius: 3px;
      padding: 0 4px;
      margin-left: 3px;
    }

    /* Step 2 Warm Storybook Reading Canvas */
    .story-extract-box {
      flex: 1;
      min-height: 0;
      padding: 10px 16px;
      border: 1.5px solid var(--parchment-border);
      border-left: 4.5px solid var(--acc);
      border-radius: 6px;
      background: var(--parchment);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .story-prose {
      width: 100%;
      max-width: 162mm;
      margin: 0 auto;
      font-family: 'Lora', Georgia, Cambria, serif;
      font-size: 11.6pt;
      line-height: 1.56;
      color: #0f172a;
    }
    .story-page[data-cohort="ks2"] .story-prose {
      max-width: 156mm;
      hyphens: none;
    }
    .story-prose p.story-para {
      margin: 0 0 8px 0;
    }
    .story-prose p.story-para:last-child {
      margin-bottom: 0;
    }
    .story-prose .reading-stanza {
      padding: 6px 13px;
      margin: 0 0 7px 0;
      border-left: 3.2px solid var(--acc);
      background: #ffffff;
      border-radius: 0 4px 4px 0;
      font-style: italic;
      line-height: 1.44;
    }
    .story-prose .reading-stanza:last-child {
      margin-bottom: 0;
    }

    /* Step 3 Talk Together + Integrated Sign-Off */
    .talk-box {
      background: var(--acc-tint);
      border: 1px solid var(--acc);
      border-left: 4.5px solid var(--acc);
      border-radius: 6px;
      padding: 6px 10px;
      flex-shrink: 0;
    }
    .talk-item {
      font-size: 8.2pt;
      line-height: 1.3;
      color: var(--navy);
      margin-top: 3.5px;
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .talk-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: var(--acc);
      color: #ffffff;
      font-size: 6.6pt;
      font-weight: 900;
      flex-shrink: 0;
    }
    .signoff-strip {
      margin-top: 5px;
      padding-top: 4.5px;
      border-top: 1px dashed rgba(15, 23, 42, 0.3);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.4pt;
      font-weight: 800;
      color: var(--navy);
    }

    /* ================= STORY CHECK QUIZ PAGES ================= */
    .quiz-main {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 7px;
    }
    .quiz-inst-bar {
      background: var(--acc-tint);
      border: 1px solid var(--acc);
      border-left: 4px solid var(--acc);
      border-radius: 5px;
      padding: 5.5px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.0pt;
      color: var(--navy);
      flex-shrink: 0;
    }
    .quiz-stack-1col {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .quiz-grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 9px;
      align-content: start;
    }
    .quiz-story-block {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 4px solid var(--acc);
      border-radius: 5px;
      padding: 6.5px 9px;
    }
    .quiz-story-hdr {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 3.5px;
      margin-bottom: 5px;
      font-size: 8.1pt;
      font-weight: 800;
      color: var(--navy);
    }
    .mcq-card {
      margin-bottom: 5px;
      font-size: 8.0pt;
      line-height: 1.28;
      color: var(--navy);
    }
    .mcq-card:last-child { margin-bottom: 0; }
    .mcq-q-stem {
      font-weight: 700;
      margin-bottom: 2px;
    }
    .mcq-opts-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2px 8px;
      padding-left: 3px;
      font-size: 7.5pt;
      color: var(--ink);
    }
    .mcq-opts-stack {
      display: flex;
      flex-direction: column;
      gap: 1.5px;
      padding-left: 3px;
      font-size: 7.5pt;
      color: var(--ink);
    }
    .tick-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 12px;
      height: 12px;
      border: 1.2px solid var(--navy);
      border-radius: 50%;
      font-size: 6.2pt;
      font-weight: 800;
      margin-right: 4px;
      background: #ffffff;
      color: var(--navy);
      vertical-align: middle;
      flex-shrink: 0;
    }

    /* ================= CONVERSATION GUIDE & ANSWER KEY PAGES ================= */
    .guide-main {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 6.5px;
    }
    .guide-tip-banner {
      background: var(--parchment);
      border: 1.5px solid var(--parchment-border);
      border-left: 4px solid var(--acc);
      border-radius: 5px;
      padding: 5px 10px;
      font-size: 7.7pt;
      line-height: 1.3;
      color: var(--ink);
      flex-shrink: 0;
    }
    .guide-grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6.5px 8.5px;
      align-content: start;
    }
    .guide-story-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-top: 2.5px solid var(--acc);
      border-radius: 5px;
      padding: 5.5px 8px;
      font-size: 7.6pt;
      line-height: 1.26;
      color: var(--ink);
    }
    .guide-story-title {
      font-size: 8.1pt;
      font-weight: 800;
      color: var(--navy);
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2.5px;
      margin-bottom: 3.5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 4px;
    }
    .guide-qa {
      margin-bottom: 3px;
    }
    .guide-qa:last-child { margin-bottom: 0; }
    .guide-q-tag {
      font-weight: 800;
      color: var(--acc-dark);
    }

    .ans-key-box {
      background: #f8fafc;
      border: 1.5px solid var(--navy);
      border-radius: 5px;
      padding: 6px 9px;
      flex-shrink: 0;
    }
    .ans-key-hdr {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 3px;
      margin-bottom: 4.5px;
      font-size: 7.1pt;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--navy);
    }
    .ans-key-grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3px 10px;
      font-size: 7.1pt;
      line-height: 1.24;
      color: var(--ink);
    }
  `;
}

function renderCoverPageHtml(unitId, cfg, items, heroAsset, totalPages) {
  const n = items.length;
  const isCompactGrid = n >= 7;
  const storyStartPage = n >= 7 ? 3 : 2;
  const isWideHero = heroAsset.aspectRatio >= 1.82;
  const unitWord = cfg.unitWord || 'Enquiry';

  const guideLabel =
    totalPages === 8 ? 'Page 8' : n === 11 ? 'Page 16' : 'Pages 11–12';

  const heroHtml = isWideHero
    ? `
      <div class="cover-wide-banner">
        <div>
          <div class="cover-kicker">${escapeHtml(cfg.stageLabel)}</div>
          <h1 class="cover-h1">${escapeHtml(cfg.cleanTitle)} <span class="cover-period-inline">${escapeHtml(cfg.dates)}</span></h1>
          <div class="cover-sub">${escapeHtml(cfg.subtitle)}</div>
        </div>
        <div class="cover-stat-stack">
          <div class="cover-stat-chip">${n} Authentic Voices</div>
          <div class="cover-stat-chip">UK Studio Audio QR</div>
        </div>
      </div>

      <div class="cover-wide-art">
        <div class="cover-wide-img-wrap">
          <img src="${heroAsset.dataUri}" alt="${escapeHtml(cfg.cleanTitle)}" />
        </div>
        <div class="cover-art-cap">${escapeHtml(cfg.heroCaption)}</div>
      </div>`
    : `
      <div class="cover-split-grid">
        <div class="cover-split-title-card">
          <div>
            <div class="cover-kicker">${escapeHtml(cfg.stageLabel)}</div>
            <h1 class="cover-h1" style="font-size:19.5pt;">${escapeHtml(cfg.cleanTitle)}</h1>
            <div style="font-size:12pt;font-weight:900;color:#38bdf8;margin-top:3px;">${escapeHtml(cfg.dates)}</div>
            <div class="cover-sub" style="margin-top:6px;">${escapeHtml(cfg.subtitle)}</div>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:8px;">
            <span class="cover-stat-chip">${n} Authentic Voices</span>
            <span class="cover-stat-chip">UK Narrator QR</span>
            <span class="cover-stat-chip">Parent Guide (${guideLabel})</span>
          </div>
        </div>
        <div class="cover-split-art-card">
          <div class="cover-split-img-wrap">
            <img src="${heroAsset.dataUri}" alt="${escapeHtml(cfg.cleanTitle)}" />
          </div>
          <div class="cover-art-cap">${escapeHtml(cfg.heroCaption)}</div>
        </div>
      </div>`;

  let directoryInnerHtml = '';
  if (isCompactGrid) {
    const cells = items
      .map((it, idx) => {
        const voice = resolveVoiceBadge(it);
        const pg = storyStartPage + idx;
        const cleanTitle = escapeHtml(it.book_title || cleanTabLabel(it, idx));
        const pillCode =
          unitWord === 'Lesson'
            ? `Lesson ${idx + 1}`
            : `Enquiry ${idx + 1}`;
        return `
        <div class="dir-2col-item">
          <span class="code-pill">${pillCode}</span>
          <div class="dir-2col-body">
            <div class="dir-2col-tt">${cleanTitle}</div>
            <div class="dir-2col-meta">
              <span class="voice-chip">${escapeHtml(voice.short)}</span>
              <span>${escapeHtml(it.author)}</span>
            </div>
          </div>
          <span class="dir-2col-pg">p. ${pg}</span>
        </div>`;
      })
      .join('');

    const filler =
      items.length % 2 === 1
        ? `
        <div class="dir-2col-item" style="background:var(--acc-tint);justify-content:space-between;">
          <div class="dir-2col-body">
            <div class="dir-2col-tt" style="color:var(--acc-dark);">Story Check Quiz &amp; Parent Talking Points</div>
            <div class="dir-2col-meta"><span>${n * 3} comprehension questions + full model answers</span></div>
          </div>
          <span class="dir-2col-pg">pp. ${totalPages - 2}–${totalPages}</span>
        </div>`
        : '';

    directoryInnerHtml = `<div class="dir-2col-grid">${cells}${filler}</div>`;
  } else {
    const rows = items
      .map((it, idx) => {
        const voice = resolveVoiceBadge(it);
        const pg = storyStartPage + idx;
        const cleanTitle = escapeHtml(it.book_title || cleanTabLabel(it, idx));
        const pillCode = `${unitWord} 0${idx + 1}`;
        return `
        <tr>
          <td style="width:24mm;"><span class="code-pill">${pillCode}</span></td>
          <td>
            <div class="dir-story-tt">${cleanTitle}</div>
            <div class="dir-story-author">${escapeHtml(it.author)}</div>
          </td>
          <td style="width:32mm;"><span class="voice-chip">${escapeHtml(voice.medium)}</span></td>
          <td style="width:13mm;text-align:center;font-weight:900;font-size:8.4pt;color:var(--navy);">p. ${pg}</td>
          <td style="width:34mm;font-size:7.2pt;color:#64748b;white-space:nowrap;">____/____ &nbsp; _______</td>
        </tr>`;
      })
      .join('');

    directoryInnerHtml = `
      <table class="dir-table">
        <thead>
          <tr>
            <th>${escapeHtml(unitWord)}</th>
            <th>Story, Poem, Myth or Eyewitness Extract</th>
            <th>Literary Voice</th>
            <th style="text-align:center;">Page</th>
            <th>Date &amp; Initials</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  return `
  <section class="page cover-page" data-page="1" data-page-kind="cover">
    <div class="cover-main">
      <div class="cover-top-bar">
        <span>THE HISTORY REVISION HUB &middot; <span data-department-name="The History Department"><span class="school-brand-target" data-department-name="The History Department">The History Department</span></span></span>
        <span class="cover-opt-badge">Optional Home &amp; Tutor-Time Anthology</span>
      </div>

      ${heroHtml}

      <div class="cover-howto-ribbon">
        <div class="howto-ribbon-hdr">
          <span class="howto-ribbon-kicker">How to Read Together at Home or in Tutor Time (5–7 Minutes)</span>
          <span class="howto-ribbon-sub">Parent &amp; Tutor Guide: ${guideLabel}</span>
        </div>
        <div class="howto-steps-3col">
          <div class="howto-step-card"><span class="howto-step-num">Step 1</span><strong>Key Words:</strong> Sound out the 4–5 pre-teach terms and phonetic <em>[helpers]</em> aloud.</div>
          <div class="howto-step-card"><span class="howto-step-num">Step 2</span><strong>Read or Listen:</strong> Read together, or scan the page <strong>QR code</strong> for the UK Narrator.</div>
          <div class="howto-step-card"><span class="howto-step-num">Step 3</span><strong>Chat &amp; Sign:</strong> Talk through the 3 prompts using the helpful guide at the back!</div>
        </div>
      </div>

      <div class="pupil-id-strip">
        <div>Pupil Name: <span class="blank-line" style="min-width:44mm;"></span></div>
        <div>Class / Tutor: <span class="blank-line" style="min-width:24mm;"></span></div>
        <div>Year / Term: <span class="blank-line" style="min-width:19mm;"></span></div>
      </div>

      <div class="cover-dir-wrap">
        <div class="dir-banner">
          <span>${isCompactGrid ? `${n}-Story Reading Anthology Contents Directory` : `${n}-Story Contents &amp; Home Reading Sign-Off Passport`}</span>
          <span class="dir-banner-sub">Stories: Pages ${storyStartPage}–${storyStartPage + n - 1} &middot; ${totalPages}-Page Booklet</span>
        </div>
        ${directoryInnerHtml}
      </div>
    </div>

    <footer class="ftr">
      <span>The History Revision Hub &middot; ${escapeHtml(cfg.cleanTitle)} (${escapeHtml(cfg.dates)}) &middot; Literary Companion Anthology</span>
      <span class="pg-pill">Page 1 / ${totalPages}</span>
    </footer>
  </section>`;
}

function renderInsideCover7Html(cfg, items, totalPages) {
  const voicesHtml = items
    .map((it, idx) => {
      const v = resolveVoiceBadge(it);
      return `
      <div class="voice-profile-row">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;">
          <div style="font-weight:800;color:var(--navy);">Enquiry ${idx + 1}: ${escapeHtml(it.book_title)}</div>
          <span class="voice-chip">${escapeHtml(v.medium)} &middot; p. ${idx + 3}</span>
        </div>
        <div style="color:#334155;margin-top:2px;"><em>${escapeHtml(it.author)}</em> — ${escapeHtml(it.provenance_note)}</div>
      </div>`;
    })
    .join('');

  const selectedVocab = [];
  items.forEach((it, idx) => {
    (it.vocabVault || []).slice(0, 2).forEach((vv) => {
      selectedVocab.push({ enq: idx + 1, ...vv });
    });
  });

  const vocabGridHtml = selectedVocab
    .slice(0, 14)
    .map(
      (v) => `
      <div class="vocab-card">
        <div class="vocab-term-head">
          <span>
            <span class="vocab-term-name">${escapeHtml(v.term)}</span>${v.pronunciation ? `<span class="pron-tag">[${escapeHtml(v.pronunciation)}]</span>` : ''}
          </span>
          <span style="font-size:6.5pt;font-weight:800;color:var(--acc-dark);background:var(--acc-soft);padding:0.5px 5px;border-radius:3px;">E${v.enq}</span>
        </div>
        <div style="color:var(--ink);margin-top:2px;">${escapeHtml(v.def)}</div>
      </div>`
    )
    .join('');

  return `
  <section class="page ifc-page" data-page="2" data-page-kind="ifc">
    <div class="ifc-main">
      <div class="subpage-hdr">
        <div class="subpage-num">
          <small>VOICES</small>
          <span>07</span>
        </div>
        <div class="subpage-tt">
          <div class="subpage-kicker">${escapeHtml(cfg.cleanTitle)} &middot; Inside Front Cover</div>
          <h2>Voices of the Era &amp; Phonetic Vocabulary Guide</h2>
        </div>
        <div class="subpage-pill">${escapeHtml(cfg.dates)}</div>
      </div>

      <div class="ifc-sec-bar">Part A &middot; Meet the 7 Historical Voices &amp; Eyewitnesses (Pages 3–9)</div>
      <div class="ifc-voices-list">
        ${voicesHtml}
      </div>

      <div class="ifc-sec-bar" style="margin-top:2px;">Part B &middot; Master Phonetic Vocabulary Guide (14 Key Terms to Sound Out Aloud)</div>
      <div class="ifc-vocab-grid">
        ${vocabGridHtml}
      </div>
    </div>

    <footer class="ftr">
      <span>The History Revision Hub &middot; ${escapeHtml(cfg.cleanTitle)} &middot; Voices &amp; Phonetic Guide</span>
      <span class="pg-pill">Page 2 / ${totalPages}</span>
    </footer>
  </section>`;
}

function renderInsideCover11Html(cfg, items, hubQrUri, totalPages) {
  const passportCards = items
    .map((it, idx) => {
      const v = resolveVoiceBadge(it);
      return `
      <div class="passport-card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
          <span class="passport-card-tt">Lesson ${idx + 1}: ${escapeHtml(cleanTabLabel(it, idx))}</span>
          <span class="code-pill" style="font-size:6.5pt;padding:1.5px 6px;">Page ${idx + 3}</span>
        </div>
        <div class="passport-card-sub">${escapeHtml(v.medium)} &middot; ${escapeHtml(it.author)}</div>
        <div class="passport-card-sign">
          <span>&#9744; Read &amp; Discussed</span>
          <span>Date: _______</span>
          <span>Initials: _______</span>
        </div>
      </div>`;
    })
    .join('');

  return `
  <section class="page ifc-page" data-page="2" data-page-kind="ifc">
    <div class="ifc-main">
      <div class="subpage-hdr">
        <div class="subpage-num">
          <small>PASSPORT</small>
          <span>11</span>
        </div>
        <div class="subpage-tt">
          <div class="subpage-kicker">${escapeHtml(cfg.cleanTitle)} &middot; Inside Front Cover</div>
          <h2>Home &amp; Tutor-Time Reading Passport</h2>
        </div>
        <div class="subpage-pill">${escapeHtml(cfg.dates)}</div>
      </div>

      <div class="ifc-audio-banner">
        <div>
          <div style="font-size:8.2pt;font-weight:900;color:var(--acc-dark);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:3px;">Wartime Voices &amp; Zero-Login UK Narrator Audio</div>
          <p style="font-size:7.8pt;line-height:1.34;color:var(--ink);">
            Across Lessons 1–11 (pp. 3–13), read authentic wartime radio broadcasts (Neville Chamberlain, Edward R. Murrow, Winston Churchill), true Operation Pied Piper and Bletchley Park stories, Kindertransport and Windermere testimonies, and Kitchen Front rhymes. Scan any page’s corner QR code—or this master QR code—to listen aloud with zero login!
          </p>
        </div>
        <div style="text-align:center;border:1.2px solid var(--navy);background:#ffffff;padding:3px;border-radius:5px;">
          <img src="${hubQrUri}" alt="Audio Hub QR" style="width:19.5mm;height:19.5mm;display:block;margin:0 auto;" />
          <div style="font-size:5.9pt;font-weight:800;color:var(--navy);margin-top:2px;">All 11 Audio Tracks</div>
        </div>
      </div>

      <div class="passport-11-grid">
        ${passportCards}
        <div class="passport-card" style="background:var(--acc-tint);border-color:var(--acc);border-left-width:4px;">
          <div class="passport-card-tt" style="color:var(--acc-dark);">Complete Wartime Anthology Sign-Off!</div>
          <div class="passport-card-sub" style="font-style:normal;color:var(--navy);">All 11 Wartime Voices read aloud + Pages 14–15 Story Quiz completed (Score: ____ / 33).</div>
          <div class="passport-card-sign" style="border-top-color:var(--acc);">
            <span>Teacher / Tutor Praise Stamp: _______________________</span>
          </div>
        </div>
      </div>
    </div>

    <footer class="ftr">
      <span>The History Revision Hub &middot; ${escapeHtml(cfg.cleanTitle)} &middot; Home Reading Sign-Off Passport</span>
      <span class="pg-pill">Page 2 / ${totalPages}</span>
    </footer>
  </section>`;
}

function renderStoryPageHtml(unitId, cfg, item, idx, totalItems, pageNum, totalPages, artUri, qrUri, guidePageRef) {
  const voice = resolveVoiceBadge(item);
  const unitWord = cfg.unitWord || 'Enquiry';
  const enqLabel = unitWord === 'Lesson' ? `Lesson ${idx + 1}` : item.lesson_label || `Enquiry ${idx + 1}`;
  const subGenre = resolveDistinctSubGenre(item, voice);
  const cohortAttr = cfg.stage === 'KS2' ? 'ks2' : 'ks3';

  const vocab = Array.isArray(item.vocabVault) ? item.vocabVault.slice(0, 5) : [];
  const vocabGridClass = vocab.length === 5 ? 'vocab-grid-5' : 'vocab-grid-4';
  const discussions = Array.isArray(item.parent_discussion) ? item.parent_discussion.slice(0, 3) : [];

  const vocabHtml = vocab
    .map(
      (v) => `
      <div class="vocab-card">
        <div>
          <span class="vocab-term-name">${escapeHtml(v.term)}</span>${v.pronunciation ? `<span class="pron-tag">[${escapeHtml(v.pronunciation)}]</span>` : ''}
        </div>
        <div style="margin-top:1.5px;">${formatInlineHtml(escapeHtml(v.def))}</div>
      </div>`
    )
    .join('');

  const talkHtml = discussions
    .map(
      (d, dIdx) => `
      <div class="talk-item">
        <span class="talk-num">${dIdx + 1}</span>
        <span>${formatInlineHtml(escapeHtml(d.question))}</span>
      </div>`
    )
    .join('');

  return `
  <section class="page story-page" data-page="${pageNum}" data-page-kind="story" data-cohort="${cohortAttr}">
    <div class="story-main">
      <div class="story-run-strip">
        <span>${escapeHtml(cfg.cleanTitle)} (${escapeHtml(cfg.dates)})</span>
        <span>${escapeHtml(enqLabel)} of ${totalItems} &middot; ${escapeHtml(voice.medium)}</span>
      </div>

      <div class="story-top-grid">
        <div class="story-art-card">
          <div class="story-art-frame">
            <img src="${artUri}" alt="${escapeHtml(item.book_title)}" />
          </div>
          <div class="story-art-cap">${escapeHtml(item.cover_caption)}</div>
        </div>

        <div class="story-meta-card">
          <div>
            <div class="story-badges">
              <span class="enq-badge">${escapeHtml(enqLabel)}</span>
              <span class="genre-badge">${escapeHtml(voice.medium)}</span>
              ${subGenre ? `<span class="subgenre-pill">${escapeHtml(subGenre)}</span>` : ''}
            </div>
            <h2 class="story-h2">${escapeHtml(item.book_title)}</h2>
            <div class="story-author">${escapeHtml(item.author)}</div>
          </div>
          <div class="story-context-box">
            <strong>Historical Context:</strong> ${formatInlineHtml(escapeHtml(item.author_context))}
          </div>
        </div>

        <div class="story-qr-card">
          <div class="qr-top-tag">Listen Aloud</div>
          <img src="${qrUri}" alt="Scan to Listen QR Code" />
          <div class="qr-caption">Scan Camera<br><span style="font-weight:600;color:#475569;">UK Narrator</span></div>
        </div>
      </div>

      <div class="vocab-section">
        <div class="sec-kicker">
          <span>Step 1 &middot; Key Words to Sound Out Before Reading</span>
          <span class="sec-kicker-hint">Practise [pronunciation] helpers aloud together</span>
        </div>
        <div class="${vocabGridClass}">
          ${vocabHtml}
        </div>
      </div>

      <div class="story-extract-box">
        <div class="story-prose">
          ${formatExtractHtml(item.extract)}
        </div>
      </div>

      <div class="talk-box">
        <div class="sec-kicker" style="margin-bottom:2px;">
          <span>Step 3 &middot; Talk Together After Reading</span>
          <span class="sec-kicker-hint">Talking Points &amp; Answers: ${guidePageRef}</span>
        </div>
        ${talkHtml}
        <div class="signoff-strip">
          <span>&#9744; Read Aloud &amp; Discussed Together</span>
          <span>Date Read: ______________</span>
          <span>Parent / Carer / Tutor Initials: ___________</span>
        </div>
      </div>
    </div>

    <footer class="ftr">
      <span>The History Revision Hub &middot; ${escapeHtml(cfg.cleanTitle)} &middot; ${escapeHtml(enqLabel)}</span>
      <span class="pg-pill">Page ${pageNum} / ${totalPages}</span>
    </footer>
  </section>`;
}

function renderQuizSlicePageHtml({
  cfg,
  itemsSlice,
  startItemIdx,
  startStoryPage,
  pageNum,
  totalPages,
  totalQuizQuestions,
  partLabel,
  twoColumn = false,
  showScoreBox = false,
  answerKeyPageRef,
}) {
  const letters = ['A', 'B', 'C', 'D'];
  const unitWord = cfg.unitWord || 'Enquiry';

  const blocksHtml = itemsSlice
    .map((it, localIdx) => {
      const idx = startItemIdx + localIdx;
      const qs = (it.story_check || []).slice(0, 3);
      const qRows = qs
        .map((q, qIdx) => {
          const globalNum = idx * 3 + qIdx + 1;
          const optsList = (q.options || []).slice(0, 4);
          const maxOptLen = Math.max(0, ...optsList.map((o) => String(o || '').length));
          const optGridClass = twoColumn && maxOptLen > 38 ? 'mcq-opts-stack' : 'mcq-opts-2col';
          const opts = optsList
            .map(
              (opt, oIdx) =>
                `<div><span class="tick-circle">${letters[oIdx]}</span>${escapeHtml(opt)}</div>`
            )
            .join('');
          return `
          <div class="mcq-card">
            <div class="mcq-q-stem">Q${globalNum}. ${escapeHtml(q.question)}</div>
            <div class="${optGridClass}">${opts}</div>
          </div>`;
        })
        .join('');

      return `
      <div class="quiz-story-block">
        <div class="quiz-story-hdr">
          <span><span class="code-pill" style="margin-right:5px;">${unitWord === 'Lesson' ? `L${idx + 1}` : `E${idx + 1}`}</span>${escapeHtml(cleanTabLabel(it, idx))} <span style="font-weight:600;color:#64748b;">(p. ${startStoryPage + idx})</span></span>
          <span style="color:var(--acc-dark);">___ / 3</span>
        </div>
        ${qRows}
      </div>`;
    })
    .join('');

  const scoreCardHtml = showScoreBox
    ? `
      <div class="quiz-story-block" style="background:var(--parchment);border-color:var(--acc);display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:12px;">
        <div style="font-size:7.6pt;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;color:var(--acc-dark);">Whole-Anthology Score</div>
        <div style="font-family:'Playfair Display',Georgia,serif;font-size:19pt;font-weight:900;color:var(--navy);margin:6px 0;">______ / ${totalQuizQuestions}</div>
        <div style="font-size:7.6pt;color:var(--ink);line-height:1.32;">Check your answers together using the complete Answer Key on <strong>${answerKeyPageRef}</strong>!</div>
      </div>`
    : '';

  return `
  <section class="page quiz-page" data-page="${pageNum}" data-page-kind="quiz">
    <div class="quiz-main">
      <div class="subpage-hdr">
        <div class="subpage-num">
          <small>QUIZ</small>
          <span>${totalQuizQuestions}</span>
        </div>
        <div class="subpage-tt">
          <div class="subpage-kicker">${escapeHtml(cfg.cleanTitle)} &middot; Screen-Free Comprehension Check</div>
          <h2>${escapeHtml(partLabel)}</h2>
        </div>
        <div class="subpage-pill">3 Per Story</div>
      </div>

      <div class="quiz-inst-bar">
        <span><strong>How to Complete:</strong> Tick or shade <strong>&#9398; &#9399; &#9400;</strong> or <strong>&#9401;</strong> after reading each passage, then check <strong>${answerKeyPageRef}</strong>.</span>
        ${!showScoreBox ? `<span style="font-weight:900;white-space:nowrap;margin-left:8px;">Score: _____ / ${totalQuizQuestions}</span>` : ''}
      </div>

      <div class="${twoColumn ? 'quiz-grid-2col' : 'quiz-stack-1col'}">
        ${blocksHtml}
        ${scoreCardHtml}
      </div>
    </div>

    <footer class="ftr">
      <span>The History Revision Hub &middot; ${escapeHtml(cfg.cleanTitle)} &middot; Story Comprehension Quiz</span>
      <span class="pg-pill">Page ${pageNum} / ${totalPages}</span>
    </footer>
  </section>`;
}

function formatFullCorrectOption(q) {
  const letters = ['A', 'B', 'C', 'D'];
  const idx = typeof q.correctIndex === 'number' ? q.correctIndex : 0;
  const letter = letters[idx] || 'A';
  const opt = String((q.options && q.options[idx]) || '').trim();
  return `<strong>${letter}</strong> (${escapeHtml(opt)})`;
}

function renderSinglePageGuideHtml({
  cfg,
  items,
  pageNum,
  totalPages,
  startStoryPage,
  hasPrintedQuizPage,
  quizPageRefLabel = '',
}) {
  const unitWord = cfg.unitWord || 'Enquiry';
  const shortPrefix = unitWord === 'Lesson' ? 'L' : 'E';
  const totalQs = items.length * 3;

  const cardsHtml = items
    .map((it, idx) => {
      const discs = (it.parent_discussion || []).slice(0, 3);
      const qaHtml = discs
        .map(
          (d, dIdx) =>
            `<div class="guide-qa"><span class="guide-q-tag">Q${dIdx + 1}:</span> ${formatInlineHtml(escapeHtml(d.answer))}</div>`
        )
        .join('');
      return `
      <div class="guide-story-card">
        <div class="guide-story-title">
          <span>${unitWord} ${idx + 1}: ${escapeHtml(cleanTabLabel(it, idx))}</span>
          <span style="font-size:6.9pt;color:var(--acc-dark);">p. ${startStoryPage + idx}</span>
        </div>
        ${qaHtml}
      </div>`;
    })
    .join('');

  const oddTipCard =
    items.length % 2 === 1
      ? `
      <div class="guide-story-card" style="background:var(--parchment);border-top-color:var(--navy);display:flex;flex-direction:column;justify-content:center;">
        <div class="guide-story-title"><span>Reading Aloud Tip for Home &amp; Tutor Time</span></div>
        <p style="line-height:1.34;">Take turns reading one paragraph each, or scan any story’s corner QR code to follow the UK Studio Narrator aloud together with zero login.</p>
      </div>`
      : '';

  // For 6-enquiry booklets (where all 8 pages are Cover + 6 Stories + Guide, so no printed MCQ page exists),
  // print a genuine 6-Story Quick Recall Check (Question + Answer from monday_cold_call) instead of phantom A/B/C letters!
  let bottomBoxHtml = '';
  if (hasPrintedQuizPage) {
    const keyCellsHtml = items
      .map((it, idx) => {
        const qs = (it.story_check || []).slice(0, 3);
        const line = qs
          .map((q, qIdx) => `Q${idx * 3 + qIdx + 1}: ${formatFullCorrectOption(q)}`)
          .join(' &middot; ');
        return `<div><strong>${shortPrefix}${idx + 1}:</strong> ${line}</div>`;
      })
      .join('');

    bottomBoxHtml = `
      <div class="ans-key-box">
        <div class="ans-key-hdr">
          <span>Complete ${totalQs}-Question Story Quiz Answer Key (${quizPageRefLabel})</span>
          <span>3 Answers Per ${escapeHtml(unitWord)}</span>
        </div>
        <div class="ans-key-grid-2col">
          ${keyCellsHtml}
        </div>
      </div>`;
  } else {
    const quickRecallHtml = items
      .map((it, idx) => {
        const cc = it.monday_cold_call || {};
        return `<div><strong>${shortPrefix}${idx + 1}:</strong> ${escapeHtml(cc.question)} &rarr; <strong>${escapeHtml(cc.answer)}</strong></div>`;
      })
      .join('');

    bottomBoxHtml = `
      <div class="ans-key-box">
        <div class="ans-key-hdr">
          <span>Bonus 6-Story Quick Recall Check (Ask Aloud After Reading!)</span>
          <span>18 Interactive Quiz Qs via Page QR Codes</span>
        </div>
        <div class="ans-key-grid-2col">
          ${quickRecallHtml}
        </div>
      </div>`;
  }

  return `
  <section class="page guide-page" data-page="${pageNum}" data-page-kind="guide">
    <div class="guide-main">
      <div class="subpage-hdr">
        <div class="subpage-num">
          <small>GUIDE</small>
          <span>KEY</span>
        </div>
        <div class="subpage-tt">
          <div class="subpage-kicker">${escapeHtml(cfg.cleanTitle)} &middot; Support for Families &amp; Tutors</div>
          <h2>Parent, Carer &amp; Tutor Conversation Guide</h2>
        </div>
        <div class="subpage-pill">Model Talking Points</div>
      </div>

      <div class="guide-tip-banner">
        <strong>No Specialist History Knowledge Needed:</strong> Children never need word-for-word answers—praise curiosity and listen for these core ideas during your 3-minute chat!
      </div>

      <div class="guide-grid-2col">
        ${cardsHtml}
        ${oddTipCard}
      </div>

      ${bottomBoxHtml}
    </div>

    <footer class="ftr">
      <span>The History Revision Hub &middot; ${escapeHtml(cfg.cleanTitle)} &middot; Parent, Carer &amp; Tutor Guide</span>
      <span class="pg-pill">Page ${pageNum} / ${totalPages}</span>
    </footer>
  </section>`;
}

function renderSplitQuizAndGuideFor7Html(cfg, items, startStoryPage, totalPages) {
  // Pages 10, 11, 12 for 7-enquiry units (`the_shoah`, `cold_war` -> 12 pages):
  //   Page 10: Quiz Part I (Enquiries 1–4, Q1–Q12) — 4 spacious cards
  //   Page 11: Top = Quiz Part II (Enquiries 5–7, Q13–Q21, 2-col with Score Box);
  //            Bottom = Conversation Guide Part I (Enquiries 1–2) — balanced 95% fill!
  //   Page 12: Conversation Guide Part II (Enquiries 3–7) + Full Untruncated 21-Q Answer Key
  const page10 = renderQuizSlicePageHtml({
    cfg,
    itemsSlice: items.slice(0, 4),
    startItemIdx: 0,
    startStoryPage,
    pageNum: 10,
    totalPages,
    totalQuizQuestions: 21,
    partLabel: 'Story Check Quiz · Part I (Enquiries 1–4 · Questions 1–12)',
    twoColumn: false,
    showScoreBox: false,
    answerKeyPageRef: 'Page 12',
  });

  const letters = ['A', 'B', 'C', 'D'];
  const part2QuizCards = items
    .slice(4, 7)
    .map((it, localIdx) => {
      const idx = 4 + localIdx;
      const qs = (it.story_check || []).slice(0, 3);
      const qRows = qs
        .map((q, qIdx) => {
          const globalNum = idx * 3 + qIdx + 1;
          const optsList = (q.options || []).slice(0, 4);
          const maxOptLen = Math.max(0, ...optsList.map((o) => String(o || '').length));
          const optGridClass = maxOptLen > 38 ? 'mcq-opts-stack' : 'mcq-opts-2col';
          const opts = optsList
            .map(
              (opt, oIdx) =>
                `<div><span class="tick-circle">${letters[oIdx]}</span>${escapeHtml(opt)}</div>`
            )
            .join('');
          return `
          <div class="mcq-card">
            <div class="mcq-q-stem">Q${globalNum}. ${escapeHtml(q.question)}</div>
            <div class="${optGridClass}">${opts}</div>
          </div>`;
        })
        .join('');

      return `
      <div class="quiz-story-block">
        <div class="quiz-story-hdr">
          <span><span class="code-pill" style="margin-right:5px;">E${idx + 1}</span>${escapeHtml(cleanTabLabel(it, idx))} <span style="font-weight:600;color:#64748b;">(p. ${startStoryPage + idx})</span></span>
          <span style="color:var(--acc-dark);">___ / 3</span>
        </div>
        ${qRows}
      </div>`;
    })
    .join('');

  const guidePart1Cards = items
    .slice(0, 2)
    .map((it, idx) => {
      const discs = (it.parent_discussion || []).slice(0, 3);
      const qaHtml = discs
        .map(
          (d, dIdx) =>
            `<div class="guide-qa"><span class="guide-q-tag">Q${dIdx + 1}:</span> ${formatInlineHtml(escapeHtml(d.answer))}</div>`
        )
        .join('');
      return `
      <div class="guide-story-card">
        <div class="guide-story-title">
          <span>Enquiry ${idx + 1}: ${escapeHtml(cleanTabLabel(it, idx))}</span>
          <span style="font-size:6.9pt;color:var(--acc-dark);">p. ${startStoryPage + idx}</span>
        </div>
        ${qaHtml}
      </div>`;
    })
    .join('');

  const page11 = `
  <section class="page guide-page" data-page="11" data-page-kind="guide">
    <div class="guide-main">
      <div class="subpage-hdr">
        <div class="subpage-num">
          <small>QUIZ</small>
          <span>II</span>
        </div>
        <div class="subpage-tt">
          <div class="subpage-kicker">${escapeHtml(cfg.cleanTitle)} &middot; Quiz Part II &amp; Conversation Guide (Enquiries 1–2)</div>
          <h2>Questions 13–21 &amp; Parent/Tutor Guide (Part 1)</h2>
        </div>
        <div class="subpage-pill">Score: ___ / 21</div>
      </div>

      <div class="quiz-grid-2col">
        ${part2QuizCards}
        <div class="quiz-story-block" style="background:var(--parchment);border-color:var(--acc);display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:10px;">
          <div style="font-size:7.4pt;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;color:var(--acc-dark);">Whole-Anthology Score</div>
          <div style="font-family:'Playfair Display',Georgia,serif;font-size:18pt;font-weight:900;color:var(--navy);margin:5px 0;">______ / 21</div>
          <div style="font-size:7.3pt;color:var(--ink);line-height:1.3;">Complete 21-Question Answer Key overleaf on <strong>Page 12</strong>!</div>
        </div>
      </div>

      <div class="ifc-sec-bar" style="margin-top:2px;">Parent, Carer &amp; Tutor Conversation Guide &middot; Part 1 (Enquiries 1–2 Talking Points)</div>
      <div class="guide-grid-2col">
        ${guidePart1Cards}
      </div>
    </div>

    <footer class="ftr">
      <span>The History Revision Hub &middot; ${escapeHtml(cfg.cleanTitle)} &middot; Quiz Part II &amp; Guide</span>
      <span class="pg-pill">Page 11 / ${totalPages}</span>
    </footer>
  </section>`;

  const guidePart2Cards = items
    .slice(2, 7)
    .map((it, localIdx) => {
      const idx = 2 + localIdx;
      const discs = (it.parent_discussion || []).slice(0, 3);
      const qaHtml = discs
        .map(
          (d, dIdx) =>
            `<div class="guide-qa"><span class="guide-q-tag">Q${dIdx + 1}:</span> ${formatInlineHtml(escapeHtml(d.answer))}</div>`
        )
        .join('');
      return `
      <div class="guide-story-card">
        <div class="guide-story-title">
          <span>Enquiry ${idx + 1}: ${escapeHtml(cleanTabLabel(it, idx))}</span>
          <span style="font-size:6.9pt;color:var(--acc-dark);">p. ${startStoryPage + idx}</span>
        </div>
        ${qaHtml}
      </div>`;
    })
    .join('');

  const keyCellsHtml = items
    .map((it, idx) => {
      const qs = (it.story_check || []).slice(0, 3);
      const line = qs
        .map((q, qIdx) => `Q${idx * 3 + qIdx + 1}: ${formatFullCorrectOption(q)}`)
        .join(' &middot; ');
      return `<div><strong>E${idx + 1}:</strong> ${line}</div>`;
    })
    .join('');

  const page12 = `
  <section class="page guide-page" data-page="12" data-page-kind="guide">
    <div class="guide-main">
      <div class="subpage-hdr">
        <div class="subpage-num">
          <small>GUIDE</small>
          <span>KEY</span>
        </div>
        <div class="subpage-tt">
          <div class="subpage-kicker">${escapeHtml(cfg.cleanTitle)} &middot; Enquiries 3–7 Talking Points &amp; Answer Key</div>
          <h2>Conversation Guide (Part 2) &amp; 21-Question Answer Key</h2>
        </div>
        <div class="subpage-pill">Pages 10–11 Key</div>
      </div>

      <div class="guide-grid-2col">
        ${guidePart2Cards}
        <div class="guide-story-card" style="background:var(--parchment);border-top-color:var(--navy);display:flex;flex-direction:column;justify-content:center;">
          <div class="guide-story-title"><span>Using These Model Talking Points</span></div>
          <p style="line-height:1.34;">Praise thoughtful reflection rather than testing memory—every passage is designed to spark honest conversation at home or in tutor time.</p>
        </div>
      </div>

      <div class="ans-key-box">
        <div class="ans-key-hdr">
          <span>Complete 21-Question Story Quiz Answer Key (Pages 10–11)</span>
          <span>3 Answers Per Enquiry</span>
        </div>
        <div class="ans-key-grid-2col">
          ${keyCellsHtml}
        </div>
      </div>
    </div>

    <footer class="ftr">
      <span>The History Revision Hub &middot; ${escapeHtml(cfg.cleanTitle)} &middot; Conversation Guide &amp; Answer Key</span>
      <span class="pg-pill">Page 12 / ${totalPages}</span>
    </footer>
  </section>`;

  return `${page10}\n${page11}\n${page12}`;
}

function buildClientAutoFitAndSchoolScript() {
  return `
  <script>
    (function () {
      // 1. Commercial School Cover Customizer (?school=School+Name)
      try {
        var params = new URLSearchParams(window.location.search);
        var customSchool = (params.get('school') || '').trim();
        if (customSchool) {
          var targets = document.querySelectorAll('.school-brand-target');
          for (var i = 0; i < targets.length; i++) {
            targets[i].textContent = customSchool;
          }
        }
      } catch (e) {}

      // 2. Bi-Directional Editorial Auto-Fit Engine (Scales UP to eliminate dead space, locks 0px overflow)
      window.autoFitPages = function () {
        var pages = document.querySelectorAll('.page');
        for (var p = 0; p < pages.length; p++) {
          var page = pages[p];
          var kind = page.getAttribute('data-page-kind') || '';
          var ftr = page.querySelector('.ftr');
          if (!ftr) continue;

          if (kind === 'cover') {
            var main = page.querySelector('.cover-main');
            var wideImg = page.querySelector('.cover-wide-img-wrap');
            var splitGrid = page.querySelector('.cover-split-grid');
            var dirTds = page.querySelectorAll('.dir-table td');
            var dirItems = page.querySelectorAll('.dir-2col-item');
            var dirTts = page.querySelectorAll('.dir-2col-tt, .dir-story-tt');
            var stepCards = page.querySelectorAll('.howto-step-card');

            var bestCover = null;
            for (var step = 0; step <= 26; step++) {
              var t = step / 26;
              var gapPx = (5.0 + t * 5.5).toFixed(1);
              main.style.gap = gapPx + 'px';

              if (wideImg) {
                var minH = dirItems.length >= 10 ? 44 : 52;
                var maxH = dirItems.length >= 10 ? 68 : 82;
                wideImg.style.height = (minH + t * (maxH - minH)).toFixed(1) + 'mm';
              }
              if (splitGrid) {
                var minS = dirItems.length >= 7 ? 66 : 72;
                var maxS = dirItems.length >= 7 ? 88 : 96;
                splitGrid.style.height = (minS + t * (maxS - minS)).toFixed(1) + 'mm';
              }
              for (var d = 0; d < dirTds.length; d++) {
                dirTds[d].style.padding = (5.0 + t * 6.5).toFixed(1) + 'px 9px';
              }
              for (var di = 0; di < dirItems.length; di++) {
                dirItems[di].style.padding = (4.2 + t * 5.2).toFixed(1) + 'px 9px';
              }
              for (var dt = 0; dt < dirTts.length; dt++) {
                var baseTt = dirItems.length ? 7.6 : 8.4;
                dirTts[dt].style.fontSize = (baseTt + t * 1.4).toFixed(2) + 'pt';
              }
              for (var sc = 0; sc < stepCards.length; sc++) {
                stepCards[sc].style.fontSize = (7.1 + t * 1.0).toFixed(2) + 'pt';
                stepCards[sc].style.padding = (4.0 + t * 3.5).toFixed(1) + 'px 7px';
              }

              var clr = ftr.getBoundingClientRect().top - main.lastElementChild.getBoundingClientRect().bottom;
              if (page.scrollHeight <= page.clientHeight + 1 && clr >= 10) {
                bestCover = step;
              }
            }
            if (bestCover !== null) {
              var bt = bestCover / 26;
              main.style.gap = (5.0 + bt * 5.5).toFixed(1) + 'px';
              if (wideImg) {
                var bMinH = dirItems.length >= 10 ? 44 : 52;
                var bMaxH = dirItems.length >= 10 ? 68 : 82;
                wideImg.style.height = (bMinH + bt * (bMaxH - bMinH)).toFixed(1) + 'mm';
              }
              if (splitGrid) {
                var bMinS = dirItems.length >= 7 ? 66 : 72;
                var bMaxS = dirItems.length >= 7 ? 88 : 96;
                splitGrid.style.height = (bMinS + bt * (bMaxS - bMinS)).toFixed(1) + 'mm';
              }
              for (var d2 = 0; d2 < dirTds.length; d2++) {
                dirTds[d2].style.padding = (5.0 + bt * 6.5).toFixed(1) + 'px 9px';
              }
              for (var di2 = 0; di2 < dirItems.length; di2++) {
                dirItems[di2].style.padding = (4.2 + bt * 5.2).toFixed(1) + 'px 9px';
              }
              for (var dt2 = 0; dt2 < dirTts.length; dt2++) {
                var bBaseTt = dirItems.length ? 7.6 : 8.4;
                dirTts[dt2].style.fontSize = (bBaseTt + bt * 1.4).toFixed(2) + 'pt';
              }
              for (var sc2 = 0; sc2 < stepCards.length; sc2++) {
                stepCards[sc2].style.fontSize = (7.1 + bt * 1.0).toFixed(2) + 'pt';
                stepCards[sc2].style.padding = (4.0 + bt * 3.5).toFixed(1) + 'px 7px';
              }
            }
          } else if (kind === 'story') {
            var isKs2 = page.getAttribute('data-cohort') === 'ks2';
            var sMain = page.querySelector('.story-main');
            var prose = page.querySelector('.story-prose');
            var paras = page.querySelectorAll('.story-para');
            var stanzas = page.querySelectorAll('.reading-stanza');
            var artFrame = page.querySelector('.story-art-frame');
            var ctx = page.querySelector('.story-context-box');
            var vocabCards = page.querySelectorAll('.vocab-card');
            var talkItems = page.querySelectorAll('.talk-item');
            var extractBox = page.querySelector('.story-extract-box');

            // Temporarily disable flex-grow so we measure true natural content height!
            if (sMain) sMain.style.flex = '0 0 auto';
            if (extractBox) extractBox.style.flex = '0 0 auto';

            var minPt = 10.25;
            var maxPt = isKs2 ? 14.2 : 13.0;
            var chosen = null;

            for (var sStep = 0; sStep <= 38; sStep++) {
              var u = sStep / 38;
              var pt = minPt + u * (maxPt - minPt);
              var lh = 1.36 + u * (isKs2 ? 0.38 : 0.32);
              var pMb = 4.0 + u * 9.0;
              var artMm = 23.0 + u * 12.0;
              var vocPt = 7.1 + u * 1.9;
              var talkPt = 7.5 + u * 1.8;
              var ctxPt = 7.2 + u * 1.5;
              var gapS = 4.5 + u * 5.0;

              sMain.style.gap = gapS.toFixed(1) + 'px';
              if (artFrame) artFrame.style.height = artMm.toFixed(1) + 'mm';
              if (ctx) {
                ctx.style.fontSize = ctxPt.toFixed(2) + 'pt';
                ctx.style.lineHeight = (1.22 + u * 0.14).toFixed(2);
              }
              if (extractBox) {
                extractBox.style.padding = (7.0 + u * 11.0).toFixed(1) + 'px ' + (12.0 + u * 8.0).toFixed(1) + 'px';
              }
              if (prose) {
                prose.style.fontSize = pt.toFixed(2) + 'pt';
                prose.style.lineHeight = lh.toFixed(2);
              }
              for (var pa = 0; pa < paras.length; pa++) {
                paras[pa].style.marginBottom = pa === paras.length - 1 ? '0px' : pMb.toFixed(1) + 'px';
              }
              for (var st = 0; st < stanzas.length; st++) {
                stanzas[st].style.padding = (4.0 + u * 5.5).toFixed(1) + 'px 13px';
                stanzas[st].style.marginBottom = st === stanzas.length - 1 ? '0px' : (4.0 + u * 6.0).toFixed(1) + 'px';
                stanzas[st].style.lineHeight = (1.30 + u * 0.24).toFixed(2);
              }
              for (var vc = 0; vc < vocabCards.length; vc++) {
                vocabCards[vc].style.fontSize = vocPt.toFixed(2) + 'pt';
                vocabCards[vc].style.padding = (3.2 + u * 3.2).toFixed(1) + 'px 7.5px';
              }
              for (var ti = 0; ti < talkItems.length; ti++) {
                talkItems[ti].style.fontSize = talkPt.toFixed(2) + 'pt';
                talkItems[ti].style.marginTop = (2.0 + u * 3.5).toFixed(1) + 'px';
              }

              var sClr = ftr.getBoundingClientRect().top - sMain.lastElementChild.getBoundingClientRect().bottom;
              if (page.scrollHeight <= page.clientHeight + 1 && sClr >= 10) {
                chosen = sStep;
              }
            }

            var finalStep = chosen !== null ? chosen : 0;
            var fu = finalStep / 38;
            sMain.style.gap = (4.5 + fu * 5.0).toFixed(1) + 'px';
            if (artFrame) artFrame.style.height = (23.0 + fu * 12.0).toFixed(1) + 'mm';
            if (ctx) {
              ctx.style.fontSize = (7.2 + fu * 1.5).toFixed(2) + 'pt';
              ctx.style.lineHeight = (1.22 + fu * 0.14).toFixed(2);
            }
            if (extractBox) {
              extractBox.style.padding = (7.0 + fu * 11.0).toFixed(1) + 'px ' + (12.0 + fu * 8.0).toFixed(1) + 'px';
            }
            if (prose) {
              prose.style.fontSize = (minPt + fu * (maxPt - minPt)).toFixed(2) + 'pt';
              prose.style.lineHeight = (1.36 + fu * (isKs2 ? 0.38 : 0.32)).toFixed(2);
            }
            for (var pa2 = 0; pa2 < paras.length; pa2++) {
              paras[pa2].style.marginBottom = pa2 === paras.length - 1 ? '0px' : (4.0 + fu * 9.0).toFixed(1) + 'px';
            }
            for (var st2 = 0; st2 < stanzas.length; st2++) {
              stanzas[st2].style.padding = (4.0 + fu * 5.5).toFixed(1) + 'px 13px';
              stanzas[st2].style.marginBottom = st2 === stanzas.length - 1 ? '0px' : (4.0 + fu * 6.0).toFixed(1) + 'px';
              stanzas[st2].style.lineHeight = (1.30 + fu * 0.24).toFixed(2);
            }
            for (var vc2 = 0; vc2 < vocabCards.length; vc2++) {
              vocabCards[vc2].style.fontSize = (7.1 + fu * 1.9).toFixed(2) + 'pt';
              vocabCards[vc2].style.padding = (3.2 + fu * 3.2).toFixed(1) + 'px 7.5px';
            }
            for (var ti2 = 0; ti2 < talkItems.length; ti2++) {
              talkItems[ti2].style.fontSize = (7.5 + fu * 1.8).toFixed(2) + 'pt';
              talkItems[ti2].style.marginTop = (2.0 + fu * 3.5).toFixed(1) + 'px';
            }

            // Restore flex-grow so the warm reading canvas absorbs the small residual clearance cleanly
            if (sMain) sMain.style.flex = '1 1 auto';
            if (extractBox) extractBox.style.flex = '1 1 auto';
          } else {
            // IFC, Quiz & Guide pages: bi-directional sweep to fill cleanly with 0px overflow
            var gMain = page.querySelector('.ifc-main, .quiz-main, .guide-main');
            if (!gMain) continue;
            gMain.style.flex = '0 0 auto';
            var cards = page.querySelectorAll(
              '.passport-card, .voice-profile-row, .vocab-card, .quiz-story-block, .guide-story-card'
            );
            var stems = page.querySelectorAll(
              '.mcq-card, .guide-story-card, .voice-profile-row, .vocab-card, .passport-card-sub'
            );
            var opts = page.querySelectorAll('.mcq-opts-2col, .mcq-opts-stack, .ans-key-grid-2col');
            var grids = page.querySelectorAll(
              '.passport-11-grid, .ifc-voices-list, .ifc-vocab-grid, .quiz-grid-2col, .quiz-stack-1col, .guide-grid-2col'
            );

            var bestG = null;
            for (var gStep = 0; gStep <= 32; gStep++) {
              var w = gStep / 32;
              var stemPt = 6.9 + w * 2.6;
              var optPt = 6.6 + w * 2.2;
              var cPad = 3.8 + w * 8.2;
              var gGap = 4.0 + w * 7.5;

              gMain.style.gap = (4.5 + w * 6.0).toFixed(1) + 'px';
              for (var gr = 0; gr < grids.length; gr++) {
                grids[gr].style.gap = gGap.toFixed(1) + 'px 8.5px';
              }
              for (var c = 0; c < cards.length; c++) {
                cards[c].style.padding = cPad.toFixed(1) + 'px 8.5px';
              }
              for (var sm = 0; sm < stems.length; sm++) {
                stems[sm].style.fontSize = stemPt.toFixed(2) + 'pt';
                stems[sm].style.lineHeight = (1.20 + w * 0.18).toFixed(2);
              }
              for (var op = 0; op < opts.length; op++) {
                opts[op].style.fontSize = optPt.toFixed(2) + 'pt';
                opts[op].style.lineHeight = (1.18 + w * 0.16).toFixed(2);
              }

              var gClr = ftr.getBoundingClientRect().top - gMain.lastElementChild.getBoundingClientRect().bottom;
              if (page.scrollHeight <= page.clientHeight + 1 && gClr >= 10) {
                bestG = gStep;
              }
            }

            var fStep = bestG !== null ? bestG : 0;
            var fw = fStep / 32;
            gMain.style.gap = (4.5 + fw * 6.0).toFixed(1) + 'px';
            for (var gr2 = 0; gr2 < grids.length; gr2++) {
              grids[gr2].style.gap = (4.0 + fw * 7.5).toFixed(1) + 'px 8.5px';
            }
            for (var c2 = 0; c2 < cards.length; c2++) {
              cards[c2].style.padding = (3.8 + fw * 8.2).toFixed(1) + 'px 8.5px';
            }
            for (var sm2 = 0; sm2 < stems.length; sm2++) {
              stems[sm2].style.fontSize = (6.9 + fw * 2.6).toFixed(2) + 'pt';
              stems[sm2].style.lineHeight = (1.20 + fw * 0.18).toFixed(2);
            }
            for (var op2 = 0; op2 < opts.length; op2++) {
              opts[op2].style.fontSize = (6.6 + fw * 2.2).toFixed(2) + 'pt';
              opts[op2].style.lineHeight = (1.18 + fw * 0.16).toFixed(2);
            }
            gMain.style.flex = '1 1 auto';
          }
        }
      };

      if (document.readyState === 'complete') {
        window.autoFitPages();
      } else {
        window.addEventListener('load', window.autoFitPages);
      }
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(window.autoFitPages);
      }
    })();
  </script>`;
}

async function buildUnitAnthologyHtml(unitId) {
  const cfg = UNIT_ANTHOLOGY_CONFIG[unitId];
  if (!cfg) throw new Error(`Unknown unitId: ${unitId}`);

  const lcPath = path.join(LC_DIR, `${unitId}.json`);
  if (!fs.existsSync(lcPath)) throw new Error(`Missing literary companion JSON: ${lcPath}`);

  const items = JSON.parse(fs.readFileSync(lcPath, 'utf8'));
  const n = items.length;
  const totalPages = cfg.expectedPages;

  const heroAsset = await getOptimizedBase64Asset(cfg.heroImage, 1100);
  const { getCleanPathForReading, getSeoRouteForUnit } = await import('../src/data/seo_routes.js');
  const unitSeoRoute = getSeoRouteForUnit(unitId);
  const hubUrl = unitSeoRoute
    ? `https://historyrevisionhub.co.uk/${unitSeoRoute.slug}/reading/`
    : `https://historyrevisionhub.co.uk/?view=reading&unit=${unitId}`;
  const hubQrUri = await generateQrDataUri(hubUrl);

  const pages = [];

  // Page 1: Master Storybook Anthology Cover
  pages.push(renderCoverPageHtml(unitId, cfg, items, heroAsset, totalPages));

  // Page 2 (for 7-lesson & 11-lesson units)
  if (n === 7) {
    pages.push(renderInsideCover7Html(cfg, items, totalPages));
  } else if (n === 11) {
    pages.push(renderInsideCover11Html(cfg, items, hubQrUri, totalPages));
  }

  // Story Pages (1 full spacious page per story)
  const startStoryPage = n >= 7 ? 3 : 2;
  const guidePageRef =
    totalPages === 8 ? 'Page 8' : n === 11 ? 'Page 16' : 'Pages 11–12';

  for (let i = 0; i < n; i++) {
    const it = items[i];
    const artAsset = await getOptimizedBase64Asset(it.cover_image, 620);
    const cleanReadingPath = getCleanPathForReading(unitId, it, i, items);
    const storyUrl = cleanReadingPath
      ? `https://historyrevisionhub.co.uk${cleanReadingPath}`
      : `https://historyrevisionhub.co.uk/?view=reading&unit=${unitId}&lesson=${i + 1}`;
    const qrUri = await generateQrDataUri(storyUrl);
    pages.push(
      renderStoryPageHtml(
        unitId,
        cfg,
        it,
        i,
        n,
        startStoryPage + i,
        totalPages,
        artAsset.dataUri,
        qrUri,
        guidePageRef
      )
    );
  }

  // Rear Quiz + Parent/Carer/Tutor Conversation Guide & Answer Key Pages
  if (n === 5) {
    // Page 7: 15-Q Quiz; Page 8: Conversation Guide + 15-Q Untruncated Answer Key
    pages.push(
      renderQuizSlicePageHtml({
        cfg,
        itemsSlice: items,
        startItemIdx: 0,
        startStoryPage: 2,
        pageNum: 7,
        totalPages: 8,
        totalQuizQuestions: 15,
        partLabel: '15-Question Story Comprehension Check',
        twoColumn: false,
        showScoreBox: false,
        answerKeyPageRef: 'Page 8',
      })
    );
    pages.push(
      renderSinglePageGuideHtml({
        cfg,
        items,
        pageNum: 8,
        totalPages: 8,
        startStoryPage: 2,
        hasPrintedQuizPage: true,
        quizPageRefLabel: 'Page 7 Quiz',
      })
    );
  } else if (n === 6) {
    // Page 8: Conversation Guide + Genuine 6-Story Quick Recall Check
    pages.push(
      renderSinglePageGuideHtml({
        cfg,
        items,
        pageNum: 8,
        totalPages: 8,
        startStoryPage: 2,
        hasPrintedQuizPage: false,
      })
    );
  } else if (n === 7) {
    // Pages 10–12: Spacious Split Quiz (pp. 10–11) + Full Conversation Guide & 21-Q Key (pp. 11–12)
    pages.push(renderSplitQuizAndGuideFor7Html(cfg, items, 3, 12));
  } else if (n === 11) {
    // Pages 14–15: Facing 2-Page 33-Question Story Quiz Spread; Page 16: Parent Guide + 33-Q Key
    pages.push(
      renderQuizSlicePageHtml({
        cfg,
        itemsSlice: items.slice(0, 6),
        startItemIdx: 0,
        startStoryPage: 3,
        pageNum: 14,
        totalPages: 16,
        totalQuizQuestions: 33,
        partLabel: 'Story Check Quiz · Part I (Lessons 1–6 · Questions 1–18)',
        twoColumn: true,
        showScoreBox: false,
        answerKeyPageRef: 'Page 16',
      })
    );
    pages.push(
      renderQuizSlicePageHtml({
        cfg,
        itemsSlice: items.slice(6, 11),
        startItemIdx: 6,
        startStoryPage: 3,
        pageNum: 15,
        totalPages: 16,
        totalQuizQuestions: 33,
        partLabel: 'Story Check Quiz · Part II (Lessons 7–11 · Questions 19–33)',
        twoColumn: true,
        showScoreBox: true,
        answerKeyPageRef: 'Page 16',
      })
    );
    pages.push(
      renderSinglePageGuideHtml({
        cfg,
        items,
        pageNum: 16,
        totalPages: 16,
        startStoryPage: 3,
        hasPrintedQuizPage: true,
        quizPageRefLabel: 'Pages 14–15 Quiz',
      })
    );
  } else {
    throw new Error(`Unsupported lesson count ${n} for unit ${unitId}`);
  }

  const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(cfg.cleanTitle)} • Literary Companion Anthology (${totalPages} Pages) | The History Revision Hub</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
  <style>${buildSharedCss(cfg)}</style>
</head>
<body>
  <div class="screen-toolbar">
    <div>
      <strong style="font-size:9.2pt;">${escapeHtml(cfg.cleanTitle)} • Literary Companion Anthology</strong>
      <span style="margin-left:8px;font-size:7.6pt;color:#fde68a;font-weight:700;">Optional Home Reading &amp; Tutor-Time Booklet • ${totalPages} Pages (A3 Saddle-Stitch)</span>
    </div>
    <div class="screen-toolbar-actions">
      <a href="/?view=reading&amp;unit=${unitId}">🎧 Digital Audio Companion</a>
      <a href="/?view=lessons&amp;unit=${unitId}">← Back to Unit Hub</a>
      <a href="/pdfs/${unitId}_literary_companion.pdf" download class="primary-dl">⬇ Download PDF (${totalPages}p)</a>
      <button type="button" onclick="window.print()" class="primary-print">🖨 Print A3 Booklet</button>
    </div>
  </div>

  ${pages.join('\n')}

  ${buildClientAutoFitAndSchoolScript()}
</body>
</html>`;

  return { html, lessonsCount: n, expectedPages: totalPages };
}

async function compileUnitBooklet(browser, unitId) {
  const { html, lessonsCount, expectedPages } = await buildUnitAnthologyHtml(unitId);

  const pubUnitDir = path.join(PUBLIC_DIR, 'units', unitId);
  const srcUnitDir = path.join(ROOT_DIR, 'units', unitId);
  fs.mkdirSync(pubUnitDir, { recursive: true });
  fs.mkdirSync(srcUnitDir, { recursive: true });

  const pubHtmlPath = path.join(pubUnitDir, 'literary_companion.html');
  const srcHtmlPath = path.join(srcUnitDir, 'literary_companion.html');
  const pdfPath = path.join(PUB_PDF_DIR, `${unitId}_literary_companion.pdf`);

  fs.writeFileSync(pubHtmlPath, html, 'utf8');
  fs.writeFileSync(srcHtmlPath, html, 'utf8');

  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.evaluateHandle('document.fonts.ready');
    await page.evaluate(() => {
      if (typeof window.autoFitPages === 'function') window.autoFitPages();
    });

    const metrics = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('.page'));
      const proseFonts = Array.from(document.querySelectorAll('.story-prose')).map((el) => {
        const px = parseFloat(window.getComputedStyle(el).fontSize) || 14;
        return +(px * 0.75).toFixed(2);
      });
      const quizFonts = Array.from(document.querySelectorAll('.mcq-card')).map((el) => {
        const px = parseFloat(window.getComputedStyle(el).fontSize) || 10;
        return +(px * 0.75).toFixed(2);
      });
      return {
        domPages: els.length,
        minStoryPt: proseFonts.length ? Math.min(...proseFonts) : 11.0,
        maxStoryPt: proseFonts.length ? Math.max(...proseFonts) : 11.0,
        minQuizPt: quizFonts.length ? Math.min(...quizFonts) : null,
        pages: els.map((el, i) => ({
          page: i + 1,
          kind: el.getAttribute('data-page-kind'),
          clientH: el.clientHeight,
          scrollH: el.scrollHeight,
          overflowPx: Math.max(0, el.scrollHeight - el.clientHeight),
        })),
      };
    });

    if (metrics.domPages !== expectedPages) {
      throw new Error(
        `[${unitId}] DOM page count mismatch: expected ${expectedPages}, found ${metrics.domPages}`
      );
    }

    const maxOverflowPx = Math.max(0, ...metrics.pages.map((p) => p.overflowPx));
    const badPages = metrics.pages.filter((p) => p.overflowPx > 2);
    if (badPages.length > 0) {
      throw new Error(
        `[${unitId}] DOM overflow > 2px detected: ${JSON.stringify(badPages)}`
      );
    }

    if (metrics.minStoryPt < 10.2) {
      throw new Error(
        `[${unitId}] Story prose dropped below 10.2pt floor (found ${metrics.minStoryPt}pt)`
      );
    }

    const pdfUint8 = await page.pdf({
      format: 'A4',
      landscape: false,
      printBackground: true,
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
    });

    const pdfBuf = Buffer.from(pdfUint8);
    const parsedPdf = await pdfParse(pdfBuf);
    const actualPdfPages = parsedPdf.numpages;

    if (actualPdfPages !== expectedPages) {
      throw new Error(
        `[${unitId}] FATAL Skia PDF spillover/page-count mismatch! Expected ${expectedPages} physical pages, pdf-parse found ${actualPdfPages}`
      );
    }

    fs.writeFileSync(pdfPath, pdfBuf);

    return {
      unit: unitId,
      lessons: lessonsCount,
      expectedPages,
      actualPdfPages,
      maxOverflowPx,
      storyPt: `${metrics.minStoryPt}–${metrics.maxStoryPt}pt`,
      quizPt: metrics.minQuizPt ? `${metrics.minQuizPt}pt` : '—',
      sizeKb: Math.round(pdfBuf.length / 1024),
    };
  } finally {
    await page.close();
  }
}

async function main() {
  const cliUnits = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const targetUnits = cliUnits.length > 0 ? cliUnits : ALL_UNIT_IDS;

  const CHROME_EXEC_PATH =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    ].find((p) => fs.existsSync(p));

  const browser = await puppeteer.launch({
    headless: 'new',
    ...(CHROME_EXEC_PATH ? { executablePath: CHROME_EXEC_PATH } : {}),
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const results = [];
  try {
    console.log(
      `📚 Compiling Editorial Saddle-Stitch Literary Companion Anthologies for ${targetUnits.length} unit(s)...`
    );
    for (const unitId of targetUnits) {
      const res = await compileUnitBooklet(browser, unitId);
      results.push(res);
      console.log(
        `   ✅ ${res.unit.padEnd(28)} | ${String(res.lessons).padStart(2)} stories | ${String(res.actualPdfPages).padStart(2)}/${String(res.expectedPages).padStart(2)}p | overflow: ${res.maxOverflowPx}px | prose: ${res.storyPt.padEnd(13)} | quiz: ${String(res.quizPt).padEnd(6)} | ${res.sizeKb} KB`
      );
    }

    console.log('\n📊 FULL VERIFICATION SUMMARY:');
    console.table(results);
    console.log(
      `\n🎉 SUCCESS: All ${results.length} Literary Companion Anthologies compiled with EXACT saddle-stitch page signatures and 0 spillover!`
    );
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('\n❌ LITERARY COMPANION ANTHOLOGY BUILD FAILED:', err);
  process.exit(1);
});
