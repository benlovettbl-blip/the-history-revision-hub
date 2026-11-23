#!/usr/bin/env node
/**
 * scripts/render_literary_companion_booklets.cjs
 *
 * THE HISTORY REVISION HUB — UNIFIED SADDLE-STITCH LITERARY COMPANION BOOKLET ENGINE
 * Compiles Optional Home Reading & Tutor-Time Anthology HTMLs + A3 Saddle-Stitch PDFs
 * across all 20 KS2 & KS3 units (119 authentic stories, poems, myths & eyewitness voices).
 *
 * Exact Saddle-Stitch Page Signatures (Zero Spillover • Zero Blank Pages):
 *   1. 5-Enquiry Units (8 KS3 units)   -> Exactly  8 Pages (2 folded A3 sheets)
 *   2. 6-Enquiry Units (9 KS2/KS3)     -> Exactly  8 Pages (2 folded A3 sheets)
 *   3. 7-Enquiry Units (2 KS3 units)   -> Exactly 12 Pages (3 folded A3 sheets)
 *   4. 11-Enquiry Unit (ks2_ww2)       -> Exactly 16 Pages (4 folded A3 sheets)
 *
 * Enforces:
 *   - Inline browser `autoFitPages()` calibration keeping story prose >= 10.2pt and 0px DOM overflow
 *   - `pdf-parse` physical page count assertion (`pdf.numpages === expectedPages`)
 *   - Scannable Audio QR codes (`qrcode`) per story (`https://historyrevisionhub.co.uk/?view=reading&unit=<id>&lesson=<n>`)
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

// Canonical 20 KS2 & KS3 units with Eyes-First verified cover plates & captions
const UNIT_ANTHOLOGY_CONFIG = {
  // --- KEY STAGE 2 (8 Units) ---
  ks2_stone_to_iron_age: {
    stage: 'KS2',
    stageLabel: 'Key Stage 2 Primary History',
    cleanTitle: 'Stone Age to Iron Age Britain',
    dates: 'c. 800,000 BC – AD 43',
    subtitle: 'Hunter-Gatherers, Skara Brae, Stonehenge, Bronze Age & Celtic Hillforts',
    heroImage: '/units/ks2_stone_to_iron_age/assets/banner_unit_hero.jpg',
    heroCaption:
      'Solstice sunrise shining directly between the giant sarsen trilithons and lintel stones at Stonehenge on Salisbury Plain.',
    expectedPages: 8,
  },
  ks2_ancient_egypt: {
    stage: 'KS2',
    stageLabel: 'Key Stage 2 Primary History',
    cleanTitle: 'Ancient Egypt',
    dates: 'c. 3100 – 30 BC',
    subtitle: 'The River Nile, Great Pyramids, Hieroglyphs, Pharaohs & The Afterlife',
    heroImage: '/units/ks2_ancient_egypt/assets/banner_unit_hero.jpg',
    heroCaption:
      'The three Great Pyramids of Giza (Khufu, Khafre, and Menkaure) rising beside smaller stepped queens’ pyramids on the desert plateau.',
    expectedPages: 8,
  },
  ks2_ancient_greece: {
    stage: 'KS2',
    stageLabel: 'Key Stage 2 Primary History',
    cleanTitle: 'Ancient Greece',
    dates: 'c. 800 – 146 BC',
    subtitle: 'City-States, Athenian Democracy, Myths, Persian Wars & Lasting Legacy',
    heroImage: '/units/ks2_ancient_greece/assets/banner_unit_hero.jpg',
    heroCaption:
      'The marble Doric columns of the Parthenon temple crowning the rocky Acropolis hill above Athens (5th century BC).',
    expectedPages: 8,
  },
  ks2_early_islamic_baghdad: {
    stage: 'KS2',
    stageLabel: 'Key Stage 2 Primary History',
    cleanTitle: 'Early Islamic Civilisation',
    dates: 'c. AD 750 – 1258',
    subtitle: 'The Round City of Baghdad, House of Wisdom, Silk Roads & Science',
    heroImage: '/units/ks2_early_islamic_baghdad/assets/banner_unit_hero.jpg',
    heroCaption:
      'Carved horseshoe arches and shimmering gold-leaf floral mosaics exemplifying the geometry and craftsmanship of the Early Islamic world.',
    expectedPages: 8,
  },
  ks2_maya_civilisation: {
    stage: 'KS2',
    stageLabel: 'Key Stage 2 Primary History',
    cleanTitle: 'The Ancient Maya',
    dates: 'c. 2000 BC – AD 1500',
    subtitle: 'Rainforest Cities, Step Pyramids, Calendar Maths, Cacao & Living Maya',
    heroImage: '/units/ks2_maya_civilisation/assets/banner_unit_hero.jpg',
    heroCaption:
      'The stepped limestone pyramid of El Castillo (Temple of Kukulcán) with carved serpent balustrades at Chichén Itzá, Mexico.',
    expectedPages: 8,
  },
  ks2_romans: {
    stage: 'KS2',
    stageLabel: 'Key Stage 2 Primary History',
    cleanTitle: 'The Romans in Britain',
    dates: '55 BC – AD 410',
    subtitle: 'Invasion, Queen Boudicca, Hadrian’s Wall, Roman Towns & Legacy',
    heroImage: '/units/ks2_romans/assets/banner_unit_hero.jpg',
    heroCaption:
      'Roman legionaries in segmented iron armour (lorica segmentata) locking curved rectangular scuta shields in battle formation.',
    expectedPages: 8,
  },
  ks2_anglo_saxons_vikings: {
    stage: 'KS2',
    stageLabel: 'Key Stage 2 Primary History',
    cleanTitle: 'Anglo-Saxons & Vikings',
    dates: 'AD 410 – 1066',
    subtitle: 'Mead-Halls, Sutton Hoo, Lindisfarne, Alfred the Great, Jorvik & 1066',
    heroImage: '/units/ks2_anglo_saxons_vikings/assets/banner_unit_hero.jpg',
    heroCaption:
      'Reconstructed clinker-built oak Viking longship gliding across coastal waters beneath a square red woollen sail.',
    expectedPages: 8,
  },
  ks2_ww2: {
    stage: 'KS2',
    stageLabel: 'Key Stage 2 Primary History',
    cleanTitle: 'World War II & The Home Front',
    dates: '1933 – 1945',
    subtitle: 'Evacuation, Kindertransport, The Blitz, Rationing, Bletchley Park & Peace',
    heroImage: '/units/ks2_ww2/assets/banner_unit_hero.jpg',
    heroCaption:
      'British schoolchildren wearing tie-on lapel labels carry satchels and suitcases into a railway station during the September 1939 evacuation.',
    expectedPages: 16,
  },

  // --- KEY STAGE 3 (12 Units) ---
  water_and_sanitation: {
    stage: 'KS3',
    stageLabel: 'Key Stage 3 Historical Studies',
    cleanTitle: 'Water & Sanitation Through Time',
    dates: 'c. 1250 – Present',
    subtitle: 'Roman Aqueducts, Medieval Conduits, King Cholera, John Snow & Bazalgette',
    heroImage: '/images/ks3_was/was_l5_s0_snow_cholera_spot_map_1854.jpg',
    heroCaption:
      'Dr John Snow’s 1854 Soho spot map plotting fatal cholera deaths as black bars clustered tightly around the Broad Street water pump.',
    expectedPages: 8,
  },
  medieval_england: {
    stage: 'KS3',
    stageLabel: 'Key Stage 3 Historical Studies',
    cleanTitle: 'Medieval England',
    dates: '1066 – 1485',
    subtitle: 'Hastings, Norman Control, Thomas Becket, Magna Carta, Black Death & 1381',
    heroImage: '/images/ks3_med7/med7_l1_s4_bayeux_harold_death_scene57.jpg',
    heroCaption:
      'Scene 57 of the 11th-century Bayeux Tapestry inscribed "HAROLD REX INTERFECTUS EST" ("King Harold is killed") at Hastings, 14 October 1066.',
    expectedPages: 8,
  },
  monarchy_religion_power: {
    stage: 'KS3',
    stageLabel: 'Key Stage 3 Historical Studies',
    cleanTitle: 'Crown, Church & Parliament',
    dates: '1517 – 1689',
    subtitle: 'Tudor Reformation, Spanish Armada, Civil War, Republic & 1689 Bill of Rights',
    heroImage: '/images/family_of_henry_viii_c1545.jpg',
    heroCaption:
      'The Family of Henry VIII (c. 1545, Royal Collection), depicting Henry VIII enthroned beside Prince Edward, Jane Seymour, Mary, and Elizabeth.',
    expectedPages: 8,
  },
  first_british_empire: {
    stage: 'KS3',
    stageLabel: 'Key Stage 3 Historical Studies',
    cleanTitle: 'The First British Empire',
    dates: '1600 – 1783',
    subtitle: 'Mughal India, Atlantic Enslavement, Resistance & The American Revolution',
    heroImage: '/images/first_british_empire/battle_of_plassey_1757.jpg',
    heroCaption:
      'Eighteenth-century engraved battle plan of the Battle of Plassey along the Bhagirathi River in Bengal (23 June 1757).',
    expectedPages: 8,
  },
  industrialisation_and_empire: {
    stage: 'KS3',
    stageLabel: 'Key Stage 3 Historical Studies',
    cleanTitle: 'Industrialisation, Power & Protest',
    dates: '1750 – 1900',
    subtitle: 'Steam Power, Factory Reform, Peterloo, Chartism & Industrial Britain',
    heroImage: '/images/ks3_ind/ind_l1_s0_coalbrookdale_by_night_1801.jpg',
    heroCaption:
      'Philipp Jakob Loutherbourg’s 1801 oil painting Coalbrookdale by Night, showing coke-fired blast furnaces lighting Ironbridge Gorge.',
    expectedPages: 8,
  },
  second_british_empire: {
    stage: 'KS3',
    stageLabel: 'Key Stage 3 Historical Studies',
    cleanTitle: 'The Second British Empire',
    dates: '1783 – 1914',
    subtitle: 'Abolition, The 1857 Indian Rebellion, Scramble for Africa & Imperial Legacies',
    heroImage: '/images/imperial_federation_map.jpg',
    heroCaption:
      'Walter Crane’s 1886 Graphic supplement map "Imperial Federation — Map of the World Showing the Extent of the British Empire in 1886."',
    expectedPages: 8,
  },
  australia: {
    stage: 'KS3',
    stageLabel: 'Key Stage 3 Historical Studies',
    cleanTitle: 'Invasion & Survival in Australia',
    dates: '1768 – 1901',
    subtitle: 'First Nations Country, Cook, Convict Hulks, Frontier Resistance & Federation',
    heroImage: '/images/prison_hulks.jpg',
    heroCaption:
      'Late 18th-century painting of decommissioned British naval prison hulks moored in harbour holding convicts prior to transportation.',
    expectedPages: 8,
  },
  great_war: {
    stage: 'KS3',
    stageLabel: 'Key Stage 3 Historical Studies',
    cleanTitle: 'Causes of the Great War',
    dates: '1871 – 1914',
    subtitle: 'Alliances, Imperial Rivalry, Dreadnoughts, Sarajevo & The July Crisis',
    heroImage: '/images/great_war_cover.jpg',
    heroCaption:
      'Royal Navy all-big-gun turbine battleship HMS Dreadnought (launched 1906) steaming at sea during the Anglo-German naval arms race.',
    expectedPages: 8,
  },
  great_war_part2: {
    stage: 'KS3',
    stageLabel: 'Key Stage 3 Historical Studies',
    cleanTitle: 'The Course of the Great War',
    dates: '1914 – 1919',
    subtitle: 'Recruitment, Western Front Trenches, Empire Troops, Home Front & Versailles',
    heroImage: '/images/sargent_gassed_1919.jpg',
    heroCaption:
      'John Singer Sargent’s 1919 canvas Gassed (Imperial War Museum), showing blinded British soldiers guided along duckboards in August 1918.',
    expectedPages: 8,
  },
  the_shoah: {
    stage: 'KS3',
    stageLabel: 'Key Stage 3 Historical Studies',
    cleanTitle: 'The Shoah',
    dates: '1933 – 1945',
    subtitle: 'Pre-War Jewish Life, Persecution, Ghettos, Resistance & Survivor Testimony',
    heroImage: '/images/the_shoah/shoah_gr0_vilna_yiddish_youth_journal_1926.jpg',
    heroCaption:
      'October 1926 cover of the illustrated Vilna Yiddish youth magazine Grininke beymelekh ("Little Green Trees", Issue No. 1, Wilno).',
    expectedPages: 12,
  },
  cold_war: {
    stage: 'KS3',
    stageLabel: 'Key Stage 3 Historical Studies',
    cleanTitle: 'The Cold War & Global Flashpoints',
    dates: '1945 – 1991',
    subtitle: 'Yalta & Potsdam, Berlin Blockade, Cuban Missiles, Détente & 1989 Collapse',
    heroImage: '/images/cold_war_cover.jpg',
    heroCaption:
      'The Berlin Wall in 1986: West Berlin graffiti covers the outer concrete wall while East German border guards patrol the inner "Death Strip."',
    expectedPages: 12,
  },
  post_war_britain: {
    stage: 'KS3',
    stageLabel: 'Key Stage 3 Historical Studies',
    cleanTitle: 'Rights, Protest & Post-War Britain',
    dates: '1900 – Present',
    subtitle: 'Suffragettes, The Welfare State & NHS, Windrush, Civil Rights & Social Change',
    heroImage: '/images/post_war_britain_cover.jpg',
    heroCaption:
      'Abram Games’s 1951 South Bank Exhibition guide cover for the Festival of Britain in London, celebrating post-war national renewal.',
    expectedPages: 8,
  },
};

const ALL_UNIT_IDS = Object.keys(UNIT_ANTHOLOGY_CONFIG);

const imageCache = new Map();
async function getOptimizedBase64Asset(relUrl, maxWidth = 640) {
  if (!relUrl) return '';
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
    const buf = await sharp(p)
      .flatten({ background: '#ffffff' })
      .resize({ width: maxWidth, withoutEnlargement: true })
      .jpeg({ quality: 84, mozjpeg: true })
      .toBuffer();
    const dataUri = `data:image/jpeg;base64,${buf.toString('base64')}`;
    imageCache.set(cacheKey, dataUri);
    return dataUri;
  } catch (err) {
    const ext = path.extname(p).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
    const rawUri = `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`;
    imageCache.set(cacheKey, rawUri);
    return rawUri;
  }
}

async function generateQrDataUri(url) {
  return QRCode.toDataURL(url, {
    width: 156,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#ffffff' },
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
    return { short: 'True Historical Story', full: 'True Historical Story' };
  }
  if (mode === 'verbatim_literature') {
    return { short: 'Classic Literature & Verse', full: 'Classic Literature, Myth & Verse' };
  }
  if (mode === 'scholarly_summary') {
    return { short: 'Historical Perspective', full: 'Historian & Archival Perspective' };
  }
  return { short: 'Eyewitness Voice', full: 'Eyewitness Diary, Letter & Speech' };
}

function cleanTabLabel(item, idx) {
  const raw = String(item.short_tab_title || item.book_title || `Story ${idx + 1}`)
    .replace(/^\d+\.\s*/, '')
    .replace(/^(?:Enquiry|Lesson)\s*\d+\s*[:\-–—.]\s*/i, '')
    .trim();
  return raw;
}

function buildSharedCss() {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: 210mm 297mm; margin: 0; }
    html, body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #0f172a;
      background: #cbd5e1;
    }
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .screen-toolbar {
      width: 100%;
      background: #0f172a;
      color: #ffffff;
      padding: 9px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      border-bottom: 2.5px solid #f59e0b;
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
      background: #b45309;
      border-color: #fbbf24;
    }

    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      background: #ffffff;
      color: #000000;
      margin: 7mm auto;
      padding: 9mm 11.5mm 8mm 11.5mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
      box-shadow: 0 8px 26px rgba(15, 23, 42, 0.18);
      position: relative;
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
      .vocab-card, .talk-item, .mcq-card, .guide-story-card, .voice-profile-row, .passport-card {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    }

    /* Running Header & Footer */
    .run-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.5px solid #000000;
      padding-bottom: 1.4mm;
      font-size: 7pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #000000;
      flex-shrink: 0;
    }
    .run-foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1.2px solid #000000;
      padding-top: 1.4mm;
      font-size: 7pt;
      font-weight: 700;
      color: #1e293b;
      flex-shrink: 0;
    }
    .pg-pill {
      background: #000000;
      color: #ffffff;
      font-weight: 800;
      font-size: 7pt;
      padding: 1px 7px;
      border-radius: 3px;
    }

    /* Cover Page */
    .cover-frame {
      border: 2px solid #000000;
      border-radius: 6px;
      padding: 4.2mm 5mm;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 2.2mm;
    }
    .cover-masthead {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.8px solid #000000;
      padding-bottom: 1.8mm;
      gap: 8px;
    }
    .cover-brand {
      font-size: 8pt;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #000000;
    }
    .cover-opt-pill {
      background: #000000;
      color: #ffffff;
      font-size: 6.8pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 2px 8px;
      border-radius: 3px;
      white-space: nowrap;
    }
    .cover-title-block {
      background: #f8fafc;
      border: 1.5px solid #000000;
      border-left: 5px solid #000000;
      border-radius: 5px;
      padding: 2.8mm 4mm;
    }
    .cover-kicker {
      font-size: 7.2pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #334155;
      margin-bottom: 0.6mm;
    }
    .cover-h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 17.5pt;
      font-weight: 900;
      line-height: 1.1;
      color: #000000;
    }
    .cover-dates-pill {
      display: inline-block;
      font-family: 'Inter', sans-serif;
      font-size: 8.5pt;
      font-weight: 800;
      background: #ffffff;
      border: 1.2px solid #000000;
      padding: 0.5px 7px;
      border-radius: 3px;
      vertical-align: middle;
      margin-left: 5px;
    }
    .cover-sub {
      font-family: 'Lora', Georgia, serif;
      font-style: italic;
      font-size: 8.6pt;
      color: #1e293b;
      margin-top: 0.8mm;
    }
    .cover-hero-grid {
      display: grid;
      grid-template-columns: 1.08fr 1fr;
      gap: 3mm;
      align-items: stretch;
    }
    .cover-art-box {
      border: 1.4px solid #000000;
      border-radius: 5px;
      padding: 1.6mm;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1.2mm;
    }
    .cover-art-img-wrap {
      width: 100%;
      height: 41mm;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .cover-art-img-wrap.compact-art {
      height: 33mm;
    }
    .cover-art-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .cover-art-cap {
      font-size: 6.6pt;
      line-height: 1.24;
      color: #1e293b;
    }
    .cover-howto-box {
      border: 1.4px solid #000000;
      border-radius: 5px;
      padding: 2.2mm 3mm;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .cover-howto-hdr {
      font-size: 7.4pt;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1px solid #000000;
      padding-bottom: 1mm;
      margin-bottom: 1.2mm;
    }
    .howto-step {
      font-size: 7.3pt;
      line-height: 1.28;
      color: #0f172a;
      margin-bottom: 1.1mm;
    }
    .howto-step:last-child { margin-bottom: 0; }
    .pupil-id-strip {
      border: 1.4px solid #000000;
      border-radius: 4px;
      padding: 1.8mm 3mm;
      background: #f8fafc;
      display: grid;
      grid-template-columns: 1.5fr 1fr 0.9fr;
      gap: 3mm;
      font-size: 7.8pt;
      font-weight: 800;
    }
    .blank-line {
      display: inline-block;
      border-bottom: 1.2px solid #000000;
      min-width: 28mm;
      height: 3.4mm;
    }

    /* Cover Contents / Passport Table */
    .passport-wrap {
      border: 1.5px solid #000000;
      border-radius: 5px;
      overflow: hidden;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .passport-hdr {
      background: #000000;
      color: #ffffff;
      padding: 1.4mm 3mm;
      font-size: 7.2pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: flex;
      justify-content: space-between;
    }
    .passport-table {
      width: 100%;
      border-collapse: collapse;
      flex: 1;
      font-size: 7.3pt;
    }
    .passport-table th {
      background: #f1f5f9;
      border-bottom: 1.2px solid #000000;
      padding: 1.2mm 2mm;
      text-align: left;
      font-size: 6.6pt;
      font-weight: 800;
      text-transform: uppercase;
    }
    .passport-table td {
      border-bottom: 1px solid #cbd5e1;
      padding: 1.3mm 2mm;
      vertical-align: middle;
      line-height: 1.22;
    }
    .passport-table tr:last-child td { border-bottom: none; }
    .passport-table.dense-11 td {
      padding: 0.75mm 1.8mm;
      font-size: 6.7pt;
      line-height: 1.16;
    }
    .voice-chip {
      display: inline-block;
      border: 1px solid #000000;
      border-radius: 3px;
      padding: 0.5px 4px;
      font-size: 6pt;
      font-weight: 800;
      text-transform: uppercase;
      background: #ffffff;
      white-space: nowrap;
    }

    /* Story Page (1 Full Spacious Page Per Story) */
    .story-top-grid {
      display: grid;
      grid-template-columns: 40mm 1fr 26mm;
      gap: 2.6mm;
      align-items: stretch;
      margin-top: 1.6mm;
      flex-shrink: 0;
    }
    .story-art-card {
      border: 1.2px solid #000000;
      border-radius: 4px;
      padding: 1.2mm;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1mm;
    }
    .story-art-frame {
      width: 100%;
      height: 24.5mm;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .story-art-frame img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .story-art-cap {
      font-size: 5.9pt;
      line-height: 1.18;
      color: #1e293b;
    }
    .story-meta-card {
      border: 1.2px solid #000000;
      border-left: 4px solid #000000;
      border-radius: 4px;
      padding: 1.8mm 2.6mm;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 0.9mm;
    }
    .story-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
    }
    .enq-badge {
      background: #000000;
      color: #ffffff;
      font-size: 6.4pt;
      font-weight: 800;
      text-transform: uppercase;
      padding: 1px 5px;
      border-radius: 2px;
    }
    .genre-badge {
      background: #f1f5f9;
      color: #000000;
      border: 1px solid #000000;
      font-size: 6.3pt;
      font-weight: 800;
      text-transform: uppercase;
      padding: 0.5px 5px;
      border-radius: 2px;
    }
    .story-h2 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 11.4pt;
      font-weight: 900;
      line-height: 1.14;
      color: #000000;
    }
    .story-author {
      font-size: 7.4pt;
      font-weight: 800;
      color: #1e293b;
    }
    .story-context-box {
      font-size: 7pt;
      line-height: 1.26;
      color: #0f172a;
      background: #f8fafc;
      border-top: 1px dashed #94a3b8;
      padding-top: 1mm;
    }
    .story-qr-card {
      border: 1.3px solid #000000;
      border-radius: 4px;
      padding: 1.2mm;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
    }
    .story-qr-card img {
      width: 20.5mm;
      height: 20.5mm;
      display: block;
    }
    .qr-caption {
      font-size: 5.9pt;
      font-weight: 800;
      line-height: 1.15;
      color: #000000;
    }

    /* Step 1 Vocabulary */
    .vocab-section {
      margin-top: 1.6mm;
      border: 1.2px solid #000000;
      border-radius: 4px;
      padding: 1.4mm 2.2mm;
      background: #f8fafc;
      flex-shrink: 0;
    }
    .sec-kicker {
      font-size: 6.7pt;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #000000;
      margin-bottom: 1mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .vocab-grid-4 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.2mm 2.2mm;
    }
    .vocab-grid-5 {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 1.2mm 2mm;
    }
    .vocab-grid-5 > .vocab-card:nth-child(1),
    .vocab-grid-5 > .vocab-card:nth-child(2) { grid-column: span 3; }
    .vocab-grid-5 > .vocab-card:nth-child(3),
    .vocab-grid-5 > .vocab-card:nth-child(4),
    .vocab-grid-5 > .vocab-card:nth-child(5) { grid-column: span 2; }

    .vocab-card {
      background: #ffffff;
      border: 1px solid #475569;
      border-left: 3px solid #000000;
      border-radius: 3px;
      padding: 1mm 1.8mm;
      font-size: 6.8pt;
      line-height: 1.22;
    }
    .pron-tag {
      font-family: 'Inter', sans-serif;
      font-size: 6.3pt;
      font-weight: 700;
      color: #1e293b;
      background: #f1f5f9;
      border: 1px solid #94a3b8;
      border-radius: 2px;
      padding: 0 3px;
      margin-left: 3px;
    }

    /* Step 2 Story Extract */
    .story-extract-box {
      flex: 1;
      margin: 1.8mm 0;
      padding: 2.4mm 3.6mm;
      border: 1.3px solid #000000;
      border-radius: 4px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 0;
    }
    .story-prose {
      font-family: 'Lora', Georgia, Cambria, serif;
      font-size: 10.6pt;
      line-height: 1.46;
      color: #000000;
    }
    .story-prose p.story-para {
      margin: 0 0 2mm 0;
    }
    .story-prose p.story-para:last-child {
      margin-bottom: 0;
    }
    .story-prose .reading-stanza {
      padding: 1.3mm 3.2mm;
      margin: 0 0 1.8mm 0;
      border-left: 2.8px solid #000000;
      background: #f8fafc;
      font-style: italic;
      line-height: 1.38;
    }
    .story-prose .reading-stanza:last-child {
      margin-bottom: 0;
    }

    /* Step 3 Talk Together */
    .talk-box {
      border: 1.3px solid #000000;
      border-left: 4px solid #000000;
      border-radius: 4px;
      padding: 1.6mm 2.5mm;
      background: #f8fafc;
      flex-shrink: 0;
    }
    .talk-item {
      font-size: 7.4pt;
      line-height: 1.26;
      color: #000000;
      margin-top: 0.8mm;
      display: flex;
      gap: 4px;
    }
    .talk-num {
      font-weight: 900;
      min-width: 11px;
    }
    .signoff-strip {
      margin-top: 1.4mm;
      margin-bottom: 1.2mm;
      border: 1px dashed #000000;
      border-radius: 3px;
      padding: 1mm 2.4mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 6.9pt;
      font-weight: 800;
      color: #000000;
      flex-shrink: 0;
    }

    /* Inside Front Cover (Page 2 on 7-lesson & 11-lesson units) */
    .ifc-voices-list {
      display: flex;
      flex-direction: column;
      gap: 1.6mm;
    }
    .voice-profile-row {
      border: 1.1px solid #000000;
      border-left: 3.5px solid #000000;
      border-radius: 4px;
      padding: 1.5mm 2.5mm;
      background: #f8fafc;
      font-size: 7.1pt;
      line-height: 1.25;
    }
    .ifc-vocab-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.4mm 2.4mm;
    }
    .passport-11-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.8mm 2.6mm;
      flex: 1;
      align-content: space-between;
    }
    .passport-card {
      border: 1.2px solid #000000;
      border-left: 3.5px solid #000000;
      border-radius: 4px;
      padding: 1.5mm 2.2mm;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1mm;
      font-size: 7pt;
      line-height: 1.22;
    }

    /* Story Check Quiz Pages */
    .quiz-group-stack {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1.8mm;
      flex: 1;
      margin: 1.5mm 0;
    }
    .quiz-story-block {
      border: 1.2px solid #000000;
      border-radius: 4px;
      padding: 1.4mm 2.2mm;
      background: #ffffff;
    }
    .quiz-story-hdr {
      font-size: 7.2pt;
      font-weight: 900;
      text-transform: uppercase;
      background: #f1f5f9;
      border-bottom: 1px solid #000000;
      margin: -1.4mm -2.2mm 1.2mm -2.2mm;
      padding: 1mm 2.2mm;
      display: flex;
      justify-content: space-between;
    }
    .mcq-row {
      margin-bottom: 1.1mm;
      font-size: 7.1pt;
      line-height: 1.22;
    }
    .mcq-row:last-child { margin-bottom: 0; }
    .mcq-opts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5mm 3mm;
      margin-top: 0.5mm;
      padding-left: 2mm;
      font-size: 6.7pt;
    }
    .tick-circle {
      display: inline-block;
      width: 9.5px;
      height: 9.5px;
      border: 1.1px solid #000000;
      border-radius: 50%;
      text-align: center;
      line-height: 8.5px;
      font-size: 5.5pt;
      font-weight: 800;
      margin-right: 2px;
    }
    .quiz-2col-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.6mm 2.4mm;
      flex: 1;
      margin: 1.4mm 0;
      align-content: space-between;
    }

    /* Parent, Carer & Tutor Conversation Guide & Answer Key */
    .guide-grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.6mm 2.4mm;
      flex: 1;
      margin: 1.4mm 0;
      align-content: space-between;
    }
    .guide-stack-1col {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 2mm;
      flex: 1;
      margin: 1.5mm 0;
    }
    .guide-story-card {
      border: 1.1px solid #000000;
      border-top: 2.5px solid #000000;
      border-radius: 4px;
      padding: 1.4mm 2mm;
      background: #ffffff;
      font-size: 6.8pt;
      line-height: 1.22;
    }
    .guide-story-title {
      font-size: 7.1pt;
      font-weight: 900;
      color: #000000;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 0.6mm;
      margin-bottom: 0.8mm;
    }
    .guide-qa {
      margin-bottom: 0.8mm;
    }
    .guide-qa:last-child { margin-bottom: 0; }
    .ans-key-box {
      border: 1.4px solid #000000;
      border-radius: 4px;
      padding: 1.5mm 2.2mm;
      background: #f8fafc;
      flex-shrink: 0;
    }
    .ans-key-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1mm 2.2mm;
      font-size: 6.4pt;
      line-height: 1.2;
      margin-top: 0.8mm;
    }
  `;
}

function renderCoverPageHtml(unitId, cfg, items, heroDataUri, totalPages) {
  const n = items.length;
  const isDense11 = n >= 10;
  const storyStartPage = n >= 7 ? 3 : 2;

  const rowsHtml = items
    .map((it, idx) => {
      const voice = resolveVoiceBadge(it);
      const pg = storyStartPage + idx;
      const shortTitle = escapeHtml(it.book_title || cleanTabLabel(it, idx));
      if (isDense11) {
        return `
          <tr>
            <td style="width:8mm;font-weight:800;">L${String(idx + 1).padStart(2, '0')}</td>
            <td><strong>${escapeHtml(cleanTabLabel(it, idx))}:</strong> ${shortTitle}</td>
            <td style="width:32mm;"><span class="voice-chip">${escapeHtml(voice.short)}</span></td>
            <td style="width:12mm;text-align:center;font-weight:800;">p. ${pg}</td>
          </tr>`;
      }
      return `
        <tr>
          <td style="width:9mm;font-weight:800;">0${idx + 1}</td>
          <td style="width:34mm;"><strong>${escapeHtml(it.lesson_label || `Enquiry ${idx + 1}`)}</strong><br><span class="voice-chip">${escapeHtml(voice.short)}</span></td>
          <td><strong>${shortTitle}</strong><br><span style="font-size:6.4pt;color:#334155;">${escapeHtml(it.author)}</span></td>
          <td style="width:11mm;text-align:center;font-weight:800;">p. ${pg}</td>
          <td style="width:20mm;color:#64748b;">____/____</td>
          <td style="width:22mm;color:#64748b;">__________</td>
        </tr>`;
    })
    .join('');

  return `
  <section class="page cover-page" data-page="1" data-page-kind="cover">
    <div class="cover-frame">
      <div class="cover-masthead">
        <div class="cover-brand">
          THE HISTORY REVISION HUB &bull; <span data-department-name="The History Department"><span class="school-brand-target" data-department-name="The History Department">The History Department</span></span>
        </div>
        <div class="cover-opt-pill">Optional Home Reading &amp; Tutor-Time Anthology</div>
      </div>

      <div class="cover-title-block">
        <div class="cover-kicker">${escapeHtml(cfg.stageLabel)} &bull; ${n} Read-Aloud Stories, Poems &amp; Eyewitness Voices</div>
        <h1 class="cover-h1">${escapeHtml(cfg.cleanTitle)} <span class="cover-dates-pill">${escapeHtml(cfg.dates)}</span></h1>
        <div class="cover-sub">${escapeHtml(cfg.subtitle)}</div>
      </div>

      <div class="cover-hero-grid">
        <div class="cover-art-box">
          <div class="cover-art-img-wrap ${isDense11 ? 'compact-art' : ''}">
            <img src="${heroDataUri}" alt="${escapeHtml(cfg.cleanTitle)}" />
          </div>
          <div class="cover-art-cap">${escapeHtml(cfg.heroCaption)}</div>
        </div>
        <div class="cover-howto-box">
          <div>
            <div class="cover-howto-hdr">How to Read Together at Home or in Tutor Time</div>
            <div class="howto-step"><strong>1. Check Key Words (1 min):</strong> Sound out the 4–5 pre-teach words and phonetic <em>[pronunciations]</em> before starting.</div>
            <div class="howto-step"><strong>2. Read or Listen Aloud (3–4 mins):</strong> Read together with a ruler, or scan the corner <strong>Audio QR Code</strong> with any phone camera to follow the UK Narrator (zero login needed).</div>
            <div class="howto-step"><strong>3. Talk Together &amp; Sign Off (2 mins):</strong> Chat through the 3 discussion prompts (talking points &amp; quiz answers are at the back of this booklet!).</div>
          </div>
          <div style="border-top:1px dashed #000;padding-top:1.2mm;margin-top:1.2mm;font-size:6.8pt;font-weight:800;display:flex;justify-content:space-between;">
            <span>A3 Saddle-Stitch Booklet (${totalPages} Pages)</span>
            <span> Answer Guide: p. ${totalPages === 8 ? '8' : `${totalPages - 1}–${totalPages}`}</span>
          </div>
        </div>
      </div>

      <div class="pupil-id-strip">
        <div>Pupil Name: <span class="blank-line" style="min-width:44mm;"></span></div>
        <div>Class / Tutor: <span class="blank-line" style="min-width:24mm;"></span></div>
        <div>Year / Term: <span class="blank-line" style="min-width:20mm;"></span></div>
      </div>

      <div class="passport-wrap">
        <div class="passport-hdr">
          <span>${isDense11 ? `${n}-Story Wartime Anthology Contents Directory (Passport on Page 2)` : `${n}-Story Contents &amp; Home Reading Sign-Off Passport`}</span>
          <span>Pages ${storyStartPage}–${storyStartPage + n - 1}</span>
        </div>
        <table class="passport-table ${isDense11 ? 'dense-11' : ''}">
          <thead>
            ${
              isDense11
                ? `<tr><th>No.</th><th>Wartime Story, Broadcast, Poem or Eyewitness Extract</th><th>Literary Voice</th><th style="text-align:center;">Page</th></tr>`
                : `<tr><th>#</th><th>Enquiry &amp; Voice</th><th>Story, Poem or Eyewitness Extract</th><th style="text-align:center;">Page</th><th>Date Read</th><th>Initials</th></tr>`
            }
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>

      <div class="run-foot" style="border-top:none;padding-top:0;">
        <span>The History Revision Hub &bull; Optional Home &amp; Tutor-Time Reading Anthology</span>
        <span class="pg-pill">Page 1 of ${totalPages}</span>
      </div>
    </div>
  </section>`;
}

function renderInsideCover7Html(cfg, items, totalPages) {
  const voicesHtml = items
    .map((it, idx) => {
      const v = resolveVoiceBadge(it);
      return `
      <div class="voice-profile-row">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:6px;">
          <div><strong>Enquiry ${idx + 1}: ${escapeHtml(it.book_title)}</strong></div>
          <span class="voice-chip">${escapeHtml(v.short)} &bull; p. ${idx + 3}</span>
        </div>
        <div style="color:#1e293b;margin-top:0.4mm;"><em>${escapeHtml(it.author)}</em> — ${escapeHtml(it.provenance_note)}</div>
      </div>`;
    })
    .join('');

  // Select 2 key phonetic terms per enquiry (14 total) for the Master Phonetic Vocabulary Guide
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
        <div>
          <strong>${escapeHtml(v.term)}</strong>
          ${v.pronunciation ? `<span class="pron-tag">[${escapeHtml(v.pronunciation)}]</span>` : ''}
          <span style="float:right;font-size:6pt;font-weight:800;color:#475569;">E${v.enq}</span>
        </div>
        <div style="color:#1e293b;margin-top:0.4mm;">${escapeHtml(v.def)}</div>
      </div>`
    )
    .join('');

  return `
  <section class="page ifc-page" data-page="2" data-page-kind="ifc">
    <div class="run-head">
      <span>${escapeHtml(cfg.cleanTitle)} &bull; Inside Front Cover</span>
      <span>Voices of the Era &amp; Master Phonetic Vocabulary Guide</span>
    </div>

    <div style="margin:1.5mm 0 1mm 0;">
      <div class="sec-kicker">Part A &bull; Meet the 7 Historical Voices &amp; Witnesses (Pages 3–9)</div>
      <div class="ifc-voices-list">
        ${voicesHtml}
      </div>
    </div>

    <div style="margin:1.5mm 0;flex:1;display:flex;flex-direction:column;justify-content:center;">
      <div class="sec-kicker">Part B &bull; Master Phonetic Vocabulary Guide (14 Essential Terms to Sound Out Aloud)</div>
      <div class="ifc-vocab-grid">
        ${vocabGridHtml}
      </div>
    </div>

    <div class="run-foot">
      <span>The History Revision Hub &bull; Optional Home Reading &amp; Tutor-Time Anthology</span>
      <span class="pg-pill">Page 2 of ${totalPages}</span>
    </div>
  </section>`;
}

function renderInsideCover11Html(cfg, items, hubQrUri, totalPages) {
  const passportCards = items
    .map((it, idx) => {
      const v = resolveVoiceBadge(it);
      return `
      <div class="passport-card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;">
          <strong>Lesson ${idx + 1}: ${escapeHtml(cleanTabLabel(it, idx))}</strong>
          <span class="voice-chip">p. ${idx + 3}</span>
        </div>
        <div style="font-size:6.4pt;color:#334155;">${escapeHtml(v.short)} &bull; <em>${escapeHtml(it.author)}</em></div>
        <div style="border-top:1px dashed #94a3b8;padding-top:0.8mm;display:flex;justify-content:space-between;font-size:6.4pt;font-weight:800;">
          <span>[ &nbsp; ] Read &amp; Talked</span>
          <span>Date: _____</span>
          <span>Initials: ______</span>
        </div>
      </div>`;
    })
    .join('');

  return `
  <section class="page ifc-page" data-page="2" data-page-kind="ifc">
    <div class="run-head">
      <span>${escapeHtml(cfg.cleanTitle)} &bull; Inside Front Cover</span>
      <span>Home Reading Passport &amp; Wartime Voices Guide</span>
    </div>

    <div style="border:1.4px solid #000000;border-radius:5px;padding:2mm 3mm;margin:1.5mm 0;background:#f8fafc;display:grid;grid-template-columns:1fr 24mm;gap:3mm;align-items:center;">
      <div>
        <div style="font-size:7.8pt;font-weight:900;text-transform:uppercase;margin-bottom:0.8mm;">Wartime Voices &amp; Scannable UK Audio Guide</div>
        <p style="font-size:7pt;line-height:1.3;color:#0f172a;">
          Across Lessons 1–11 (pp. 3–13), pupils hear authentic Second World War broadcasts (Neville Chamberlain, Edward R. Murrow), true Operation Pied Piper and Bletchley Park micro-histories, Kindertransport and Windermere refugee testimonies, and Ministry of Food rhymes. Point any phone or tablet camera at the <strong>corner QR code on each page</strong> (or the master QR code opposite) to listen to the UK Studio Narrator with zero login!
        </p>
      </div>
      <div style="text-align:center;border:1px solid #000;background:#fff;padding:1mm;border-radius:4px;">
        <img src="${hubQrUri}" alt="Audio Hub QR" style="width:19mm;height:19mm;display:block;margin:0 auto;" />
        <div style="font-size:5.6pt;font-weight:800;margin-top:0.5mm;">All 11 Audio Tracks</div>
      </div>
    </div>

    <div class="sec-kicker">11-Lesson Home &amp; Tutor-Time Reading Sign-Off Passport</div>
    <div class="passport-11-grid">
      ${passportCards}
      <div class="passport-card" style="background:#f8fafc;border-style:dashed;">
        <div style="font-weight:900;font-size:7.2pt;">Complete Anthology Sign-Off!</div>
        <div style="font-size:6.5pt;color:#1e293b;">All 11 Wartime Voices read aloud + Page 14 Story Check completed (Score: ____ / 33).</div>
        <div style="border-top:1px solid #000;padding-top:0.8mm;font-size:6.5pt;font-weight:800;">Teacher / Tutor Stamp: ______________</div>
      </div>
    </div>

    <div class="run-foot" style="margin-top:1.5mm;">
      <span>The History Revision Hub &bull; Key Stage 2 Home Reading Passport</span>
      <span class="pg-pill">Page 2 of ${totalPages}</span>
    </div>
  </section>`;
}

function renderStoryPageHtml(unitId, cfg, item, idx, totalItems, pageNum, totalPages, artUri, qrUri, guidePageRef) {
  const voice = resolveVoiceBadge(item);
  const enqLabel = item.lesson_label || `Enquiry ${idx + 1}`;
  const vocab = Array.isArray(item.vocabVault) ? item.vocabVault.slice(0, 5) : [];
  const vocabGridClass = vocab.length === 5 ? 'vocab-grid-5' : 'vocab-grid-4';
  const discussions = Array.isArray(item.parent_discussion) ? item.parent_discussion.slice(0, 3) : [];

  const vocabHtml = vocab
    .map(
      (v) => `
      <div class="vocab-card">
        <div>
          <strong>${escapeHtml(v.term)}</strong>${v.pronunciation ? `<span class="pron-tag">[${escapeHtml(v.pronunciation)}]</span>` : ''}
        </div>
        <div style="color:#1e293b;margin-top:0.3mm;">${formatInlineHtml(escapeHtml(v.def))}</div>
      </div>`
    )
    .join('');

  const talkHtml = discussions
    .map(
      (d, dIdx) => `
      <div class="talk-item">
        <span class="talk-num">${dIdx + 1}.</span>
        <span>${formatInlineHtml(escapeHtml(d.question))}</span>
      </div>`
    )
    .join('');

  return `
  <section class="page story-page" data-page="${pageNum}" data-page-kind="story">
    <div class="run-head">
      <span>${escapeHtml(cfg.cleanTitle)} (${escapeHtml(cfg.dates)})</span>
      <span>${escapeHtml(enqLabel)} of ${totalItems} &bull; ${escapeHtml(voice.short)}</span>
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
            <span class="genre-badge">${escapeHtml(voice.full)}</span>
            ${item.source_type_label ? `<span style="font-size:6.2pt;font-weight:700;color:#334155;">${escapeHtml(item.source_type_label)}</span>` : ''}
          </div>
          <h2 class="story-h2" style="margin-top:0.8mm;">${escapeHtml(item.book_title)}</h2>
          <div class="story-author">${escapeHtml(item.author)}</div>
        </div>
        <div class="story-context-box">
          <strong>Historical Context:</strong> ${formatInlineHtml(escapeHtml(item.author_context))}
        </div>
      </div>

      <div class="story-qr-card">
        <img src="${qrUri}" alt="Scan to Listen QR Code" />
        <div class="qr-caption">Scan to Listen<br><span style="font-weight:600;font-size:5.5pt;">(UK Narrator)</span></div>
      </div>
    </div>

    <div class="vocab-section">
      <div class="sec-kicker">
        <span>Step 1 &bull; Pre-Teach Key Words Before Reading</span>
        <span style="font-weight:700;font-size:6.2pt;text-transform:none;">Sound out [pronunciation] helpers aloud</span>
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
      <div class="sec-kicker" style="margin-bottom:0.4mm;">
        <span>Step 3 &bull; Talk Together (3 Discussion Questions)</span>
        <span style="font-weight:700;font-size:6.2pt;text-transform:none;">Parent / Tutor Guide: ${guidePageRef}</span>
      </div>
      ${talkHtml}
    </div>

    <div class="signoff-strip">
      <span>[ &nbsp; ] Read Aloud &amp; Discussed</span>
      <span>Date Read: _______________</span>
      <span>Parent / Carer / Tutor Initials: ____________</span>
    </div>

    <div class="run-foot">
      <span>The History Revision Hub &bull; Literary Companion Anthology</span>
      <span class="pg-pill">Page ${pageNum} of ${totalPages}</span>
    </div>
  </section>`;
}

function renderQuizPage5Html(cfg, items, pageNum, totalPages) {
  const letters = ['A', 'B', 'C', 'D'];
  const blocksHtml = items
    .map((it, idx) => {
      const qs = (it.story_check || []).slice(0, 3);
      const qRows = qs
        .map((q, qIdx) => {
          const globalNum = idx * 3 + qIdx + 1;
          const opts = (q.options || [])
            .slice(0, 4)
            .map(
              (opt, oIdx) =>
                `<div><span class="tick-circle">${letters[oIdx]}</span>${escapeHtml(opt)}</div>`
            )
            .join('');
          return `
          <div class="mcq-row mcq-card">
            <div><strong>Q${globalNum}.</strong> ${escapeHtml(q.question)}</div>
            <div class="mcq-opts-grid">${opts}</div>
          </div>`;
        })
        .join('');

      return `
      <div class="quiz-story-block">
        <div class="quiz-story-hdr">
          <span>Enquiry ${idx + 1}: ${escapeHtml(cleanTabLabel(it, idx))} (p. ${idx + 2})</span>
          <span>Score: ___ / 3</span>
        </div>
        ${qRows}
      </div>`;
    })
    .join('');

  return `
  <section class="page quiz-page" data-page="${pageNum}" data-page-kind="quiz">
    <div class="run-head">
      <span>${escapeHtml(cfg.cleanTitle)} &bull; Comprehension &amp; Story Check Quiz</span>
      <span>15 Multiple-Choice Questions (3 Per Story)</span>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;border:1.2px solid #000;border-radius:4px;padding:1.2mm 2.5mm;margin-top:1.4mm;background:#f8fafc;font-size:7.2pt;">
      <span><strong>Instructions:</strong> Shade or tick <strong>[A] [B] [C]</strong> or <strong>[D]</strong> after reading each story, then check Page ${totalPages}!</span>
      <span style="font-weight:900;">Total: _____ / 15</span>
    </div>

    <div class="quiz-group-stack">
      ${blocksHtml}
    </div>

    <div class="run-foot">
      <span>The History Revision Hub &bull; Screen-Free Homework &amp; Tutor-Time Check</span>
      <span class="pg-pill">Page ${pageNum} of ${totalPages}</span>
    </div>
  </section>`;
}

function renderQuizPageCompactGridHtml(cfg, items, pageNum, totalPages, startStoryPage) {
  const letters = ['A', 'B', 'C', 'D'];
  const totalQs = items.length * 3;
  const is33 = items.length >= 10;

  const cardsHtml = items
    .map((it, idx) => {
      const qs = (it.story_check || []).slice(0, 3);
      const qRows = qs
        .map((q, qIdx) => {
          const globalNum = idx * 3 + qIdx + 1;
          const opts = (q.options || [])
            .slice(0, 4)
            .map(
              (opt, oIdx) =>
                `<span><span class="tick-circle">${letters[oIdx]}</span>${escapeHtml(opt)}</span>`
            )
            .join(' &nbsp; ');
          return `
          <div class="mcq-card" style="margin-bottom:${is33 ? '0.6mm' : '1mm'};font-size:${is33 ? '6.1pt' : '6.6pt'};line-height:1.18;">
            <div><strong>${globalNum}.</strong> ${escapeHtml(q.question)}</div>
            <div style="margin-top:0.3mm;color:#1e293b;display:flex;flex-wrap:wrap;gap:1px 6px;">${opts}</div>
          </div>`;
        })
        .join('');

      return `
      <div class="quiz-story-block" style="padding:${is33 ? '1mm 1.6mm' : '1.3mm 2mm'};">
        <div class="quiz-story-hdr" style="margin:${is33 ? '-1mm -1.6mm 0.8mm -1.6mm' : '-1.3mm -2mm 1mm -2mm'};padding:${is33 ? '0.6mm 1.6mm' : '0.9mm 2mm'};font-size:${is33 ? '6.3pt' : '6.8pt'};">
          <span>${is33 ? `L${idx + 1}` : `Enquiry ${idx + 1}`}: ${escapeHtml(cleanTabLabel(it, idx))} (p.${startStoryPage + idx})</span>
          <span>___/3</span>
        </div>
        ${qRows}
      </div>`;
    })
    .join('');

  const summaryBox = `
    <div class="quiz-story-block" style="background:#f8fafc;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:2mm;">
      <div style="font-size:8pt;font-weight:900;text-transform:uppercase;">Whole-Anthology Score</div>
      <div style="font-size:13pt;font-weight:900;margin:1.5mm 0;">______ / ${totalQs}</div>
      <div style="font-size:6.5pt;color:#334155;line-height:1.25;">Check your answers using the Answer Key on Page ${totalPages}!</div>
    </div>`;

  return `
  <section class="page quiz-page" data-page="${pageNum}" data-page-kind="quiz">
    <div class="run-head">
      <span>${escapeHtml(cfg.cleanTitle)} &bull; ${totalQs}-Question Story Check Quiz</span>
      <span>Screen-Free Comprehension Check (3 Per Story)</span>
    </div>

    <div class="quiz-2col-grid" style="${is33 ? 'gap:1.1mm 2mm;' : ''}">
      ${cardsHtml}
      ${items.length % 2 === 1 ? summaryBox : ''}
    </div>

    <div class="run-foot">
      <span>The History Revision Hub &bull; Tick [A] [B] [C] or [D] for every question</span>
      <span class="pg-pill">Page ${pageNum} of ${totalPages}</span>
    </div>
  </section>`;
}

function formatShortCorrectOption(q) {
  const letters = ['A', 'B', 'C', 'D'];
  const idx = typeof q.correctIndex === 'number' ? q.correctIndex : 0;
  const letter = letters[idx] || 'A';
  let opt = String((q.options && q.options[idx]) || '').trim();
  if (opt.length > 42) opt = opt.slice(0, 40).trim() + '…';
  return `<strong>${letter}</strong> (${escapeHtml(opt)})`;
}

function renderSinglePageGuideAndKeyHtml(cfg, items, pageNum, totalPages, startStoryPage) {
  const totalQs = items.length * 3;
  const is6 = items.length === 6;

  const cardsHtml = items
    .map((it, idx) => {
      const discs = (it.parent_discussion || []).slice(0, 3);
      const qaHtml = discs
        .map(
          (d, dIdx) =>
            `<div class="guide-qa"><strong>Q${dIdx + 1}:</strong> ${formatInlineHtml(escapeHtml(d.answer))}</div>`
        )
        .join('');
      return `
      <div class="guide-story-card">
        <div class="guide-story-title">
          Enquiry ${idx + 1} (p. ${startStoryPage + idx}): ${escapeHtml(cleanTabLabel(it, idx))}
        </div>
        ${qaHtml}
      </div>`;
    })
    .join('');

  const keyCellsHtml = items
    .map((it, idx) => {
      const qs = (it.story_check || []).slice(0, 3);
      const line = qs
        .map((q, qIdx) => {
          const qLabel = is6 ? `${qIdx + 1}:` : `Q${idx * 3 + qIdx + 1}:`;
          return `${qLabel} ${formatShortCorrectOption(q)}`;
        })
        .join(' &bull; ');
      return `<div><strong>E${idx + 1}:</strong> ${line}</div>`;
    })
    .join('');

  return `
  <section class="page guide-page" data-page="${pageNum}" data-page-kind="guide">
    <div class="run-head">
      <span>Parent, Carer &amp; Tutor Conversation Guide &amp; Answer Key</span>
      <span>${escapeHtml(cfg.cleanTitle)}</span>
    </div>

    <div style="margin-top:1.2mm;font-size:6.8pt;color:#1e293b;background:#f8fafc;border:1px solid #000;border-radius:3px;padding:1mm 2mm;">
      <strong>No Specialist History Knowledge Needed:</strong> Pupils do not need word-for-word answers—praise curiosity and listen for these core historical ideas during your 3-minute chat!
    </div>

    <div class="guide-grid-2col">
      ${cardsHtml}
      ${
        items.length === 5
          ? `<div class="guide-story-card" style="background:#f8fafc;display:flex;flex-direction:column;justify-content:center;">
              <div class="guide-story-title">Reading Aloud Tip for Home &amp; Form Time</div>
              <p style="font-size:6.8pt;line-height:1.3;">Take turns reading one paragraph each, or scan any page’s corner QR code to hear the UK Studio Narrator read aloud while tracking the text together.</p>
            </div>`
          : ''
      }
    </div>

    <div class="ans-key-box">
      <div class="sec-kicker" style="margin-bottom:0.4mm;">
        <span>${totalQs}-Question Story Check Quick-Answer Key ${is6 ? '(Digital &amp; Oral Check)' : `(For Page ${pageNum - 1} Quiz)`}</span>
        <span>3 Answers Per Story</span>
      </div>
      <div class="ans-key-grid" style="grid-template-columns: 1fr 1fr;">
        ${keyCellsHtml}
      </div>
    </div>

    <div class="run-foot" style="margin-top:1.2mm;">
      <span>The History Revision Hub &bull; 100% Commercially Cleared Curriculum Anthology</span>
      <span class="pg-pill">Page ${pageNum} of ${totalPages}</span>
    </div>
  </section>`;
}

function renderTwoPageGuideAndKeyHtml(cfg, items, page1Num, page2Num, totalPages, startStoryPage, splitCount) {
  const part1Items = items.slice(0, splitCount);
  const part2Items = items.slice(splitCount);
  const totalQs = items.length * 3;
  const is11 = items.length >= 10;

  const renderDetailCard = (it, idx) => {
    const discs = (it.parent_discussion || []).slice(0, 3);
    const qaHtml = discs
      .map(
        (d, dIdx) => `
        <div class="guide-qa">
          <div style="font-weight:700;color:#0f172a;">${dIdx + 1}. ${escapeHtml(d.question)}</div>
          <div style="color:#1e293b;padding-left:2.5mm;">&rarr; ${formatInlineHtml(escapeHtml(d.answer))}</div>
        </div>`
      )
      .join('');
    return `
      <div class="guide-story-card">
        <div class="guide-story-title">
          ${is11 ? `Lesson ${idx + 1}` : `Enquiry ${idx + 1}`} (p. ${startStoryPage + idx}): ${escapeHtml(cleanTabLabel(it, idx))}
        </div>
        ${qaHtml}
      </div>`;
  };

  const part1Html = part1Items.map((it, i) => renderDetailCard(it, i)).join('');
  const part2Html = part2Items.map((it, i) => renderDetailCard(it, splitCount + i)).join('');

  const keyCellsHtml = items
    .map((it, idx) => {
      const qs = (it.story_check || []).slice(0, 3);
      const line = qs
        .map((q, qIdx) => `Q${idx * 3 + qIdx + 1}: ${formatShortCorrectOption(q)}`)
        .join(' &bull; ');
      return `<div><strong>${is11 ? `L${idx + 1}` : `E${idx + 1}`}:</strong> ${line}</div>`;
    })
    .join('');

  return `
  <section class="page guide-page" data-page="${page1Num}" data-page-kind="guide">
    <div class="run-head">
      <span>Parent, Carer &amp; Tutor Conversation Guide (Part 1 of 2)</span>
      <span>${escapeHtml(cfg.cleanTitle)} &bull; ${is11 ? `Lessons 1–${splitCount}` : `Enquiries 1–${splitCount}`}</span>
    </div>

    <div style="margin-top:1.2mm;font-size:6.8pt;color:#1e293b;background:#f8fafc;border:1px solid #000;border-radius:3px;padding:1mm 2mm;">
      <strong>How to Use This Conversation Guide:</strong> Ask the 3 questions aloud after reading each passage. Praise thoughtful historical reasoning using the model talking points below!
    </div>

    <div class="${is11 ? 'guide-grid-2col' : 'guide-stack-1col'}">
      ${part1Html}
    </div>

    <div class="run-foot">
      <span>The History Revision Hub &bull; Parent, Carer &amp; Tutor Guide</span>
      <span class="pg-pill">Page ${page1Num} of ${totalPages}</span>
    </div>
  </section>

  <section class="page guide-page" data-page="${page2Num}" data-page-kind="guide">
    <div class="run-head">
      <span>Conversation Guide (Part 2) &amp; ${totalQs}-Question Answer Key</span>
      <span>${escapeHtml(cfg.cleanTitle)} &bull; ${is11 ? `Lessons ${splitCount + 1}–${items.length}` : `Enquiries ${splitCount + 1}–${items.length}`}</span>
    </div>

    <div class="${is11 ? 'guide-grid-2col' : 'guide-stack-1col'}" style="flex:1;">
      ${part2Html}
    </div>

    <div class="ans-key-box" style="margin-top:1.4mm;">
      <div class="sec-kicker" style="margin-bottom:0.5mm;">
        <span>Complete ${totalQs}-Question Story Check Answer Key (For Page ${page1Num - 1} Quiz)</span>
        <span>3 Answers Per ${is11 ? 'Lesson' : 'Enquiry'}</span>
      </div>
      <div class="ans-key-grid" style="grid-template-columns: 1fr 1fr;">
        ${keyCellsHtml}
      </div>
    </div>

    <div class="run-foot" style="margin-top:1.2mm;">
      <span>The History Revision Hub &bull; 100% Commercially Cleared Curriculum Anthology</span>
      <span class="pg-pill">Page ${page2Num} of ${totalPages}</span>
    </div>
  </section>`;
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

      // 2. Reprographics Zero-Overflow Auto-Fit Calibrator (keeps story prose >= 10.2pt!)
      window.autoFitPages = function () {
        var pages = document.querySelectorAll('.page');
        for (var p = 0; p < pages.length; p++) {
          var page = pages[p];
          var kind = page.getAttribute('data-page-kind') || '';
          var guard = 0;

          if (kind === 'story') {
            var prose = page.querySelector('.story-prose');
            var ctx = page.querySelector('.story-context-box');
            var artFrame = page.querySelector('.story-art-frame');
            var talkItems = page.querySelectorAll('.talk-item');
            var vocabCards = page.querySelectorAll('.vocab-card');
            var stanzas = page.querySelectorAll('.reading-stanza');
            var paras = page.querySelectorAll('.story-para');
            var extractBox = page.querySelector('.story-extract-box');

            var prosePt = 10.6;
            var proseLh = 1.46;
            var artMm = 24.5;
            var subScale = 1.0;

            while (page.scrollHeight > page.clientHeight && guard < 28) {
              guard++;
              if (guard <= 8) {
                // Step 1: Gently tighten non-prose spacing & artwork frame height first
                artMm = Math.max(18.5, artMm - 0.8);
                if (artFrame) artFrame.style.height = artMm.toFixed(1) + 'mm';
                if (extractBox) {
                  extractBox.style.padding = '1.6mm 3mm';
                  extractBox.style.margin = '1.1mm 0';
                }
                for (var s = 0; s < stanzas.length; s++) {
                  stanzas[s].style.padding = '0.8mm 2.6mm';
                  stanzas[s].style.marginBottom = '1.1mm';
                  stanzas[s].style.lineHeight = '1.3';
                }
                for (var pa = 0; pa < paras.length; pa++) {
                  paras[pa].style.marginBottom = pa === paras.length - 1 ? '0' : '1.2mm';
                }
              } else if (guard <= 16) {
                // Step 2: Step story prose gently toward 10.2pt floor & line-height 1.34
                prosePt = Math.max(10.2, prosePt - 0.05);
                proseLh = Math.max(1.33, proseLh - 0.018);
                if (prose) {
                  prose.style.fontSize = prosePt.toFixed(2) + 'pt';
                  prose.style.lineHeight = proseLh.toFixed(2);
                }
              } else {
                // Step 3: Trim surrounding card font/padding while strictly locking story prose >= 10.2pt!
                subScale = Math.max(0.84, subScale - 0.02);
                if (ctx) {
                  ctx.style.fontSize = (7.0 * subScale).toFixed(2) + 'pt';
                  ctx.style.lineHeight = '1.18';
                }
                for (var v = 0; v < vocabCards.length; v++) {
                  vocabCards[v].style.fontSize = (6.8 * subScale).toFixed(2) + 'pt';
                  vocabCards[v].style.padding = '0.6mm 1.4mm';
                  vocabCards[v].style.lineHeight = '1.15';
                }
                for (var t = 0; t < talkItems.length; t++) {
                  talkItems[t].style.fontSize = (7.4 * subScale).toFixed(2) + 'pt';
                  talkItems[t].style.lineHeight = '1.18';
                  talkItems[t].style.marginTop = '0.4mm';
                }
                page.style.paddingTop = '7.2mm';
                page.style.paddingBottom = '6.8mm';
              }
            }
          } else {
            // Cover, IFC, Quiz & Answer Key pages: step down typography/padding cleanly until 0px overflow
            var scale = 1.0;
            var targets = page.querySelectorAll(
              '.guide-story-card, .guide-qa, .ans-key-grid, .mcq-card, .mcq-row, .mcq-opts-grid, .voice-profile-row, .vocab-card, .passport-card, .passport-table td, .howto-step, .cover-art-cap'
            );
            var basePts = [];
            for (var k = 0; k < targets.length; k++) {
              var computedPx = parseFloat(window.getComputedStyle(targets[k]).fontSize) || 9.5;
              basePts.push(computedPx);
            }
            while (page.scrollHeight > page.clientHeight && guard < 24) {
              guard++;
              scale = Math.max(0.76, scale - 0.02);
              for (var m = 0; m < targets.length; m++) {
                targets[m].style.fontSize = (basePts[m] * scale).toFixed(2) + 'px';
                targets[m].style.lineHeight = Math.max(1.13, 1.24 * scale + 0.08).toFixed(2);
              }
              if (guard > 8) {
                var cards = page.querySelectorAll('.guide-story-card, .quiz-story-block, .voice-profile-row, .passport-card');
                for (var c = 0; c < cards.length; c++) {
                  cards[c].style.paddingTop = '0.8mm';
                  cards[c].style.paddingBottom = '0.8mm';
                }
              }
              if (guard > 14) {
                page.style.paddingTop = '7mm';
                page.style.paddingBottom = '6.5mm';
              }
            }
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

  const heroDataUri = await getOptimizedBase64Asset(cfg.heroImage, 920);
  const hubUrl = `https://historyrevisionhub.co.uk/?view=reading&unit=${unitId}`;
  const hubQrUri = await generateQrDataUri(hubUrl);

  const pages = [];

  // Page 1: Master Anthology Cover
  pages.push(renderCoverPageHtml(unitId, cfg, items, heroDataUri, totalPages));

  // Page 2 (for 7-lesson & 11-lesson units)
  if (n === 7) {
    pages.push(renderInsideCover7Html(cfg, items, totalPages));
  } else if (n === 11) {
    pages.push(renderInsideCover11Html(cfg, items, hubQrUri, totalPages));
  }

  // Story Pages (1 full spacious page per story)
  const startStoryPage = n >= 7 ? 3 : 2;
  const guidePageRef =
    totalPages === 8 ? 'Page 8' : `Pages ${totalPages - 1}–${totalPages}`;

  for (let i = 0; i < n; i++) {
    const it = items[i];
    const artUri = await getOptimizedBase64Asset(it.cover_image, 520);
    const storyUrl = `https://historyrevisionhub.co.uk/?view=reading&unit=${unitId}&lesson=${i + 1}`;
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
        artUri,
        qrUri,
        guidePageRef
      )
    );
  }

  // Rear Quiz + Parent/Carer/Tutor Conversation Guide & Answer Key Pages
  if (n === 5) {
    // Page 7: 15-Q Quiz; Page 8: Conversation Guide + 15-Q Answer Key
    pages.push(renderQuizPage5Html(cfg, items, 7, 8));
    pages.push(renderSinglePageGuideAndKeyHtml(cfg, items, 8, 8, 2));
  } else if (n === 6) {
    // Page 8: Conversation Guide + 18-Q Quick-Answer Key
    pages.push(renderSinglePageGuideAndKeyHtml(cfg, items, 8, 8, 2));
  } else if (n === 7) {
    // Page 10: 21-Q Quiz; Pages 11–12: Conversation Guide + 21-Q Answer Key
    pages.push(renderQuizPageCompactGridHtml(cfg, items, 10, 12, 3));
    pages.push(renderTwoPageGuideAndKeyHtml(cfg, items, 11, 12, 12, 3, 4));
  } else if (n === 11) {
    // Page 14: 33-Q Quiz; Pages 15–16: Conversation Guide + 33-Q Answer Key
    pages.push(renderQuizPageCompactGridHtml(cfg, items, 14, 16, 3));
    pages.push(renderTwoPageGuideAndKeyHtml(cfg, items, 15, 16, 16, 3, 6));
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
  <style>${buildSharedCss()}</style>
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
      return {
        domPages: els.length,
        minStoryPt: proseFonts.length ? Math.min(...proseFonts) : 10.6,
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

    if (metrics.minStoryPt < 10.15) {
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
      minStoryPt: metrics.minStoryPt,
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
      `📚 Compiling Saddle-Stitch Literary Companion Anthologies for ${targetUnits.length} unit(s)...`
    );
    for (const unitId of targetUnits) {
      const res = await compileUnitBooklet(browser, unitId);
      results.push(res);
      console.log(
        `   ✅ ${res.unit.padEnd(28)} | ${String(res.lessons).padStart(2)} lessons | ${String(res.actualPdfPages).padStart(2)}/${String(res.expectedPages).padStart(2)} PDF pages | maxOverflow: ${res.maxOverflowPx}px | minProse: ${res.minStoryPt}pt | ${res.sizeKb} KB`
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
