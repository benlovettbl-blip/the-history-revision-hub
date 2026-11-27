/**
 * scripts/fetch_ks2_benin_assets.cjs
 *
 * Renders 1 original in-house SVG->PNG map (`benin_west_africa_edo_map_ks2.png`, 1400x980)
 * and queries Wikimedia Commons API for 48 distinct, commercially cleared
 * (Public domain / CC0 / CC BY / CC BY-SA ONLY — zero NC, zero ND, zero AI)
 * historical plates for `ks2_kingdom_of_benin`, normalized via `sharp` into:
 *   - `public/units/ks2_kingdom_of_benin/assets/`
 *   - `units/ks2_kingdom_of_benin/assets/`
 * and writes `scripts/ks2_benin_verified_assets.json` (49 unique SHA-256 hashes).
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const PUB_DIR = path.join(ROOT, 'public', 'units', 'ks2_kingdom_of_benin', 'assets');
const UNIT_DIR = path.join(ROOT, 'units', 'ks2_kingdom_of_benin', 'assets');
fs.mkdirSync(PUB_DIR, { recursive: true });
fs.mkdirSync(UNIT_DIR, { recursive: true });

const UA = 'TheHistoryRevisionHub/1.0 (https://historyrevisionhub.co.uk; contact@historyrevisionhub.co.uk)';

// [targetFile, candidateTitlesOrQueries, minWidth, requireLandscape]
const ASSET_PLAN = [
  // 1. Unit Cover (>= 1000px wide)
  [
    'banner_unit_hero.jpg',
    [
      'File:British Museum Room 25 Cast brass plaque from Benin City 17022019 5040.jpg',
      'File:Benin plaque in the Ethnological Museum, Berlin - 010.JPG',
    ],
    1100,
    true,
  ],

  // 2. Six Dedicated Landscape Enquiry Banners (width >= 850, width >= height)
  [
    'banner_l1_rainforest_nigeria_canopy.jpg',
    [
      'File:Boshi extension, Okwangwo Division of Cross River National Park.2.jpg',
      'File:Khaya senegalensis MS 2037.JPG',
    ],
    850,
    true,
  ],
  [
    'banner_l2_dapper_benin_city_panorama.jpg',
    [
      'File:AMH-6859-KB View of the city of Benin.jpg',
    ],
    850,
    true,
  ],
  [
    'banner_l3_british_museum_benin_plaques_wall.jpg',
    [
      'File:Benin bronzes british museum 2023.JPG',
      'File:Benin Bronzes.jpg',
      'File:Benin bronzes at Mueum of Archaeology & Anthropology, Cambridge.jpg',
    ],
    850,
    true,
  ],
  [
    'banner_l4_benin_leopard_pair_display.jpg',
    [
      'File:Leopard aquamanile, Nigeria, Benin Kingdom, 17th century AD, brass - Ethnological Museum, Berlin - DSC02208.JPG',
      'File:Leopard aquamanile Benin Berlin Beyond compare 03052018 1.jpg',
    ],
    850,
    true,
  ],
  [
    'banner_l5_portuguese_caravel_ships_maritime.jpg',
    [
      'File:Lisbon - Lisbonne - Lisboa 1572.png',
      'File:Santa Bernada Caravelo (7).jpg',
    ],
    850,
    true,
  ],
  [
    'banner_l6_benin_city_modern_edo_nigeria.jpg',
    [
      'File:Royal Palace of the Oba of Benin.jpg',
      'File:Ring Road Benin City.jpg',
    ],
    850,
    true,
  ],

  // 3. Seventeen Layer 2 Narrative Plates (+ 1 in-house map = 18 Layer 2 plates)
  // L1 (Block 1 = benin_west_africa_edo_map_ks2.png)
  [
    'benin_red_earth_moat_iya.jpg',
    [
      'File:Benin city, inner city Iya. Photo from 1954-1957.png',
      'File:Benin wallsss.jpg',
      'File:Benin Moat 1.png',
    ],
    750,
    false,
  ],
  [
    'anglo_saxon_west_stow_contrast.jpg',
    [
      'File:Anglo Saxon Village West Stow - geograph.org.uk - 509180.jpg',
      'File:Anglo-Saxon Village re-construction, West Stow - geograph.org.uk - 6442982.jpg',
    ],
    800,
    false,
  ],
  // L2
  [
    'ife_brass_royal_head_nigeria.jpg',
    [
      'File:Cabeza de rey (ciudad yoruba).jpg',
      'File:Ife commemorative head-73.1996.1.4-DSC00301-black.jpg',
    ],
    800,
    false,
  ],
  [
    'benin_palace_oba_dignitaries_plaque.jpg',
    [
      'File:MARKK C2305 Oba with two Dignitaries DSC-1179.jpg',
      'File:British Museum Room 25 Cast brass plaque from Benin City 17022019 5040.jpg',
    ],
    800,
    false,
  ],
  [
    'benin_coral_bead_crown_collar.jpg',
    [
      'File:Brooklyn Museum 1998.38 Waist Pendant with Oba and Two Attendants.jpg',
      'File:MARKK C2340 Oni Uhunmwun Elao DSC-1104.jpg',
    ],
    800,
    false,
  ],
  // L3
  [
    'beeswax_honeycomb_lost_wax.jpg',
    [
      'File:Burr comb.jpg',
      'File:Rahmen Bienenwabe gedrahtet 11a.jpg',
      'File:Beeswax foundation.jpg',
    ],
    800,
    false,
  ],
  [
    'benin_brass_commemorative_oba_head.jpg',
    [
      'File:Ùhúnmwèlaò (head of an ọ́bà), front view.jpg',
      'File:Gedenkkopf oba EthnM IIIC8177.jpg',
    ],
    800,
    false,
  ],
  [
    'benin_carved_altar_ivory_tusk.jpg',
    [
      'File:Carved tusk, c. 1820, Benin Kingdom, Cleveland Museum of Art.jpg',
      'File:Carved tusks (Edo, Benin City, Nigeria), World Museum Liverpool (2).JPG',
      'File:Altar tusk - 1888-1897 - Benin empire.jpg',
    ],
    800,
    false,
  ],
  // L4
  [
    'benin_oba_mudfish_legs_plaque.jpg',
    [
      'File:Bronze plaque, mudfish, Edo, Benin, Nigeria, 18th century CE, MAA Cambridge.jpg',
      'File:Roi oba-Musée ethnologique de Berlin.jpg',
    ],
    800,
    false,
  ],
  [
    'benin_ancestral_altar_shrine_1891.jpg',
    [
      'File:Ancestral shrine Royal Palace, Benin City, 1891.jpg',
      'File:At the Metropolitan Museum of Art, New York 2017 80 - Benin Bronzes.jpg',
    ],
    800,
    false,
  ],
  [
    'west_african_yams_harvest.jpg',
    [
      'File:Tubers of Yam for sale.jpg',
      'File:Tubers of Yam 1.jpg',
    ],
    800,
    false,
  ],
  // L5
  [
    'benin_portuguese_soldier_musket_plaque.jpg',
    [
      'File:MARKK C2946 Relief Plaque Portuguese wiht Match Pike and Sword DSC-1198.jpg',
      'File:Plaque au Portugais.jpg',
    ],
    800,
    false,
  ],
  [
    'west_african_brass_manillas_ring.jpg',
    [
      'File:Post-medieval manilla (FindID 856102).jpg',
      'File:Manilla West African currency up to 1940.jpg',
      'File:Post Medieval manilla (FindID 262246).jpg',
    ],
    800,
    false,
  ],
  [
    'monetaria_moneta_cowrie_shells.jpg',
    [
      'File:Tropenmuseum Royal Tropical Institute Objectnumber 3215-64a Kaurischelp, gebruikt als ruilmiddel,.jpg',
      'Cypraea moneta shells',
      'Monetaria moneta shell',
    ],
    650,
    false,
  ],
  // L6
  [
    'british_punitive_expedition_1897_troops.jpg',
    [
      'File:C. J. Staniland the brigade of the HMS St George in Benin.jpg',
      'File:Benin Expedition 1897 H0061-L351324225.jpg',
    ],
    800,
    false,
  ],
  [
    'horniman_cambridge_benin_bronzes_museum.jpg',
    [
      'File:Benin Bronzes, Horniman Museum.jpg',
      'File:Display of Benin bronzes at Museum of Archaeology & Anthropology, Cambridge, March 2022.jpg',
    ],
    800,
    false,
  ],
  [
    'modern_benin_city_national_museum_edo.jpg',
    [
      'File:Nat Museum, Benin.jpg',
      'File:Traditional high priests procession for coronation of a new king photo1.jpg',
    ],
    800,
    false,
  ],

  // 4. Eighteen Layer 3 Primary Sources (Source A-C x 6 lessons)
  // L1 Sources
  [
    'benin_terracotta_head_early.jpg',
    [
      'File:British Museum Room 25 Terracotta head Brasscaster Benin Nigeria 17022019 5152.jpg',
      'File:Head MET DT6554.jpg',
    ],
    800,
    false,
  ],
  [
    'benin_ceremonial_eben_swords.jpg',
    [
      'File:MARKK C29438 C2904 Two Eben Ceremonial Swords DSC-1197.jpg',
    ],
    800,
    false,
  ],
  [
    'oil_palm_fruit_west_africa.jpg',
    [
      'File:Freshly harvested palm fruit.jpg',
      'File:Oil Palm fruits.jpg',
    ],
    800,
    false,
  ],
  // L2 Sources
  [
    'benin_oba_attendants_plaque.jpg',
    [
      'File:Benin kingdom - Warrior and attendants.jpg',
      'File:British Museum Room 25 Cast brass plaque from Benin City 17022019 5035.jpg',
    ],
    800,
    false,
  ],
  [
    'benin_hornblower_musician_figure.jpg',
    [
      'File:Figure- Horn Player MET DT10214.jpg',
      'File:Brooklyn Museum 55.87 Figure of a Hornblower (4).jpg',
    ],
    800,
    false,
  ],
  [
    'benin_city_sketch_walls_1897.jpg',
    [
      'File:H. Ling Roth - Benin City 1897.png',
      'File:Drawing of Benin City made by an English officer 1897.jpg',
    ],
    600,
    false,
  ],
  // L3 Sources
  [
    'benin_warrior_chief_shield_plaque.jpg',
    [
      'File:British Museum Room 25 Cast brass plaque from Benin City 17022019 5035.jpg',
      'File:Two warriors, single warrior, Benin bronzes at MFA.agr.jpg',
    ],
    800,
    false,
  ],
  [
    'benin_brass_cockerel_okpa.jpg',
    [
      'File:Rooster Figure MET 50.145.47 b.jpeg',
      'File:At the British Museum 2024 238.jpg',
    ],
    800,
    false,
  ],
  [
    'benin_ivory_armlet_cuff.jpg',
    [
      'File:Benin ivory armlet with two interlocking cylinders carved from a single block of ivory.jpg',
      'File:Antique Works of Art from Benin 32.jpg',
    ],
    800,
    false,
  ],
  // L4 Sources
  [
    'queen_mother_idia_ivory_mask_bm.jpg',
    [
      'File:Queen Mother Pendant Mask- Iyoba MET DP231460.jpg',
      'File:Idia mask BM Af1910 5-13 1.jpg',
    ],
    800,
    false,
  ],
  [
    'benin_royal_brass_leopard.jpg',
    [
      'File:Brass Leopard from the Kingdom of Benin in the Cambridge University Museum of Archaeology and Anthropology.jpg',
      'File:Leopard aquamanile Benin Berlin Beyond compare 03052018 1.jpg',
    ],
    800,
    false,
  ],
  [
    'benin_brass_bell_eroro.jpg',
    [
      'File:MARKK C2306 Altar Bell with Human Face DSC-1226.jpg',
      'File:Brooklyn Museum 58.160 Double Bell Egogo.jpg',
    ],
    800,
    false,
  ],
  // L5 Sources
  [
    'benin_portuguese_merchant_manilla_plaque.jpg',
    [
      'File:Plaque- Two Portuguese with Manillas MET DT6559.jpg',
      'File:Plaque- Two Portuguese Merchants MET DT6560.jpg',
    ],
    800,
    false,
  ],
  [
    'benin_ivory_saltcellar_portuguese.jpg',
    [
      'File:Saltcellar- Portuguese Figures MET DT10918.jpg',
      'File:Afro-Portugees tafelsiervat, anoniem, ca 1550, MAS.jpg',
    ],
    800,
    false,
  ],
  [
    'dapper_1668_oba_procession_engraving.jpg',
    [
      'File:King of Benin with Soldiers in late 1600s.jpg',
      'File:Ancient Benin city.JPG',
    ],
    650,
    false,
  ],
  // L6 Sources
  [
    'british_officers_looted_benin_bronzes_1897.jpg',
    [
      "File:Interior of Oba's compound burnt during siege of Benin City, 1897.jpg",
    ],
    800,
    false,
  ],
  [
    'oba_palace_compound_1897_photo.jpg',
    [
      "File:Oba's compound during the attack on Benin City.jpg",
      'File:Benin Expedition 1897 H0061-L351324225.jpg',
    ],
    800,
    false,
  ],
  [
    'returned_benin_regalia_restitution.jpg',
    [
      'File:MARKK C2021-23-1 Return of Looted Coral Regalia to Oba Akenzua II 1938 DSC-1241.jpg',
      'File:Benin bronzes at Mueum of Archaeology & Anthropology, Cambridge.jpg',
    ],
    800,
    false,
  ],

  // 5. Six Key Individual / Royal Guild Portraits (ki_*.jpg)
  [
    'ki_oba_ewuare_the_great.jpg',
    [
      'File:MARKK C2436 Figure of an Oba with Eben Sword DSC-1124.jpg',
      'File:Roi oba-Musée ethnologique de Berlin.jpg',
    ],
    800,
    false,
  ],
  [
    'ki_queen_mother_idia.jpg',
    [
      'File:Head of a Queen Mother (Iyoba) MET DP104851.jpg',
      'File:Bronze queen head.jpg',
    ],
    800,
    false,
  ],
  [
    'ki_oba_esigie.jpg',
    [
      'File:Roi oba (2)-Musée ethnologique de Berlin.jpg',
      'File:British Museum Room 25 Cast brass plaque from Benin City 17022019 5076.jpg',
    ],
    800,
    false,
  ],
  [
    'ki_igun_brass_casters_guild.jpg',
    [
      'File:MARKK C2910 Commemorative Head from Igun Eronmwon DSC-1145.jpg',
      'File:MARKK C2382 Commemorative Head of a King Uhunmwu Elao DSC-1099.jpg',
    ],
    800,
    false,
  ],
  [
    'ki_oba_ovonramwen.jpg',
    [
      'File:Uvorama (Overami) Nabeshi, The Last King (Oba) Of Benin.jpg',
    ],
    750,
    false,
  ],
  [
    'ki_oba_ewuare_ii_edo_heritage.jpg',
    [
      'File:Igue festival (Ọba of Benin).jpg',
      'File:Traditional high priests procession for coronation of a new king photo2.jpg',
    ],
    800,
    false,
  ],
];

function getJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': UA } }, (res) => {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(d));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

function downloadBuffer(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 6) return reject(new Error('Too many redirects'));
    https
      .get(url, { headers: { 'User-Agent': UA } }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          const nextUrl = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, url).toString();
          res.resume();
          return resolve(downloadBuffer(nextUrl, redirects + 1));
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

async function renderInHouseMap() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="980" viewBox="0 0 1400 980">
  <defs>
    <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <linearGradient id="savanna" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="100%" stop-color="#fde68a"/>
    </linearGradient>
    <linearGradient id="rainforest" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#dcfce7"/>
      <stop offset="50%" stop-color="#86efac"/>
      <stop offset="100%" stop-color="#4ade80"/>
    </linearGradient>
    <linearGradient id="delta" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6ee7b7"/>
      <stop offset="100%" stop-color="#2dd4bf"/>
    </linearGradient>
  </defs>

  <!-- Ocean Background -->
  <rect width="1400" height="980" fill="url(#ocean)"/>

  <!-- Savanna Belt (North) -->
  <path d="M 0,110 L 1400,110 L 1400,320 Q 1050,340 700,315 Q 350,295 0,325 Z" fill="url(#savanna)"/>

  <!-- Tropical Rainforest Belt (Heartland of Edo / Southern Nigeria) -->
  <path d="M 0,320 Q 350,290 700,315 Q 1050,340 1400,315 L 1400,670 Q 1180,685 960,725 L 820,785 Q 725,815 645,780 L 535,710 Q 380,655 180,650 L 0,645 Z"
        fill="url(#rainforest)" stroke="#15803d" stroke-width="4"/>

  <!-- Niger Delta Mangrove Fan -->
  <path d="M 555,610 L 735,555 L 905,710 Q 825,800 680,795 Q 585,760 535,710 Z"
        fill="url(#delta)" fill-opacity="0.72" stroke="#0f766e" stroke-width="2.5" stroke-dasharray="6,4"/>

  <!-- Rivers: River Niger, Benue, Benin River & Delta Channels -->
  <path d="M 650,115 Q 690,235 725,355 Q 745,455 725,565 L 690,788" fill="none" stroke="#0284c7" stroke-width="11" stroke-linecap="round"/>
  <path d="M 1060,255 Q 890,325 730,365" fill="none" stroke="#0284c7" stroke-width="8" stroke-linecap="round"/>
  <path d="M 725,565 L 610,735 M 725,565 L 785,765 M 725,565 L 845,735" fill="none" stroke="#0284c7" stroke-width="5"/>
  <!-- Benin River to Gwato (Ughoton) -->
  <path d="M 535,710 Q 515,635 475,560 Q 495,520 520,495" fill="none" stroke="#0369a1" stroke-width="6" stroke-linecap="round"/>

  <!-- Header Banner -->
  <rect x="28" y="22" width="1344" height="86" rx="12" fill="#271203"/>
  <text x="54" y="60" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#fef3c7">The Kingdom of Benin (Edo) in West Africa (c. AD 900 – 1897)</text>
  <text x="54" y="90" font-family="Arial, sans-serif" font-size="17" fill="#fcd34d">Rainforest Heartland in Modern Southern Nigeria • Giant Iya Earthworks • Ife • Gwato River Port • Trade Routes</text>

  <!-- Compass Rose -->
  <circle cx="105" cy="195" r="42" fill="#ffffff" fill-opacity="0.94" stroke="#271203" stroke-width="2.5"/>
  <polygon points="105,158 115,195 105,187 95,195" fill="#dc2626"/>
  <polygon points="105,232 115,195 105,203 95,195" fill="#334155"/>
  <text x="105" y="148" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#271203">N</text>

  <!-- Geographic Zone Labels -->
  <text x="195" y="195" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#92400e" letter-spacing="1.2">NORTHERN SAVANNA TRADE ROUTES</text>
  <text x="75" y="438" font-family="Arial, sans-serif" font-size="19" font-weight="bold" fill="#14532d" letter-spacing="1.2">TROPICAL RAINFOREST BELT</text>
  <text x="75" y="462" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#166534">(Oil Palms • Yams • Ivory • Mahogany • Pepper)</text>
  <text x="742" y="472" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0369a1" transform="rotate(82 742,472)">RIVER NIGER</text>
  <text x="692" y="695" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0f172a">NIGER DELTA</text>
  <text x="692" y="715" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#1e293b">(Creeks &amp; Lagoons)</text>
  <text x="355" y="805" text-anchor="middle" font-family="Georgia, serif" font-size="24" font-style="italic" font-weight="bold" fill="#0c4a6e">Bight of Benin (Atlantic Ocean)</text>

  <!-- Trade Arrows -->
  <!-- Overland Savanna Trade -->
  <path d="M 555,445 Q 565,310 540,225" fill="none" stroke="#b45309" stroke-width="4" stroke-dasharray="9,6"/>
  <polygon points="540,215 531,234 550,233" fill="#b45309"/>
  <!-- Maritime Portuguese / European Trade (from 1485) -->
  <path d="M 165,755 Q 345,750 485,685 Q 515,650 482,578" fill="none" stroke="#991b1b" stroke-width="4.5" stroke-dasharray="10,6"/>
  <polygon points="478,568 474,588 492,582" fill="#991b1b"/>
  <rect x="72" y="725" width="250" height="44" rx="8" fill="#fef2f2" stroke="#991b1b" stroke-width="2"/>
  <text x="197" y="745" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#991b1b">European Ships (from AD 1485)</text>
  <text x="197" y="762" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#7f1d1d">Brass Manillas &amp; Cowries →</text>

  <!-- Concentric Benin Iya Earthwork Rings around Edo / Benin City -->
  <circle cx="555" cy="495" r="58" fill="#fde68a" fill-opacity="0.32" stroke="#9a3412" stroke-width="3.5" stroke-dasharray="8,5"/>
  <circle cx="555" cy="495" r="36" fill="#fed7aa" fill-opacity="0.48" stroke="#9a3412" stroke-width="4"/>

  <!-- Site 1: Benin City / Edo -->
  <circle cx="555" cy="495" r="14" fill="#b91c1c" stroke="#fef08a" stroke-width="4"/>
  <line x1="569" y1="490" x2="885" y2="295" stroke="#b91c1c" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="885" y="242" width="482" height="94" rx="10" fill="#ffffff" stroke="#b91c1c" stroke-width="3"/>
  <text x="903" y="271" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#991b1b">1. Edo / Benin City (Royal Capital)</text>
  <text x="903" y="295" font-family="Arial, sans-serif" font-size="15" fill="#334155">Walled rainforest capital of the sacred Oba, home to broad</text>
  <text x="903" y="316" font-family="Arial, sans-serif" font-size="15" fill="#334155">avenues, coral court rituals, and Igun Street brass-casters.</text>

  <!-- Site 2: Benin Iya Earthworks -->
  <circle cx="608" cy="472" r="10" fill="#9a3412" stroke="#ffffff" stroke-width="2.5"/>
  <line x1="618" y1="472" x2="885" y2="402" stroke="#9a3412" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="885" y="352" width="482" height="94" rx="10" fill="#ffffff" stroke="#9a3412" stroke-width="2.5"/>
  <text x="903" y="381" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#9a3412">2. Giant Benin Iya Earthworks (16,000 km)</text>
  <text x="903" y="405" font-family="Arial, sans-serif" font-size="15" fill="#334155">Deep red-clay moats and high ramparts dug around Edo</text>
  <text x="903" y="426" font-family="Arial, sans-serif" font-size="15" fill="#334155">and 500+ surrounding rainforest villages from c. AD 900.</text>

  <!-- Site 3: Sacred City of Ife (North-West) -->
  <circle cx="368" cy="368" r="12" fill="#7c3aed" stroke="#ffffff" stroke-width="3"/>
  <path d="M 380,375 Q 465,425 540,485" fill="none" stroke="#7c3aed" stroke-width="3" stroke-dasharray="6,4"/>
  <line x1="368" y1="356" x2="885" y2="508" stroke="#7c3aed" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="885" y="462" width="482" height="94" rx="10" fill="#ffffff" stroke="#7c3aed" stroke-width="2.5"/>
  <text x="903" y="491" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#6d28d9">3. Sacred City of Ife (North-West Neighbour)</text>
  <text x="903" y="515" font-family="Arial, sans-serif" font-size="15" fill="#334155">Yoruba spiritual centre from which Prince Oranmiyan came</text>
  <text x="903" y="536" font-family="Arial, sans-serif" font-size="15" fill="#334155">around AD 1180 to found Benin’s royal dynasty of Obas.</text>

  <!-- Site 4: Gwato (Ughoton) River Port -->
  <circle cx="475" cy="560" r="11" fill="#0369a1" stroke="#ffffff" stroke-width="3"/>
  <line x1="486" y1="560" x2="885" y2="618" stroke="#0369a1" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="885" y="572" width="482" height="94" rx="10" fill="#ffffff" stroke="#0369a1" stroke-width="2.5"/>
  <text x="903" y="601" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#0369a1">4. Gwato / Ughoton River Port</text>
  <text x="903" y="625" font-family="Arial, sans-serif" font-size="15" fill="#334155">Busy Benin River harbour where Portuguese merchants (from</text>
  <text x="903" y="646" font-family="Arial, sans-serif" font-size="15" fill="#334155">1485) unloaded brass manillas and loaded pepper and cloth.</text>

  <!-- Site 5: Northern Savanna Trade Box -->
  <circle cx="540" cy="212" r="11" fill="#b45309" stroke="#ffffff" stroke-width="3"/>
  <line x1="551" y1="212" x2="885" y2="182" stroke="#b45309" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="885" y="132" width="482" height="94" rx="10" fill="#ffffff" stroke="#b45309" stroke-width="2.5"/>
  <text x="903" y="161" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#92400e">5. Inland Savanna Caravan Routes</text>
  <text x="903" y="185" font-family="Arial, sans-serif" font-size="15" fill="#334155">Long before ocean ships arrived, Edo traded forest goods</text>
  <text x="903" y="206" font-family="Arial, sans-serif" font-size="15" fill="#334155">northwards for copper, rock salt, beads, and horses.</text>

  <!-- Map Caution Box: Historic Kingdom vs Modern Republic of Benin -->
  <rect x="34" y="510" width="388" height="118" rx="10" fill="#fffbeb" stroke="#d97706" stroke-width="3"/>
  <text x="52" y="538" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#92400e">Geography Detective Tip!</text>
  <text x="52" y="562" font-family="Arial, sans-serif" font-size="14" fill="#1e293b">The historic Kingdom of Benin lay in Edo State</text>
  <text x="52" y="582" font-family="Arial, sans-serif" font-size="14" fill="#1e293b">in modern southern NIGERIA — NOT inside the</text>
  <text x="52" y="602" font-family="Arial, sans-serif" font-size="14" fill="#1e293b">modern country called Republic of Benin further west!</text>

  <!-- Bottom Chronology Strip -->
  <rect x="28" y="904" width="1344" height="52" rx="10" fill="#271203"/>
  <text x="700" y="936" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#fef3c7">Ogiso &amp; Iya Moats (c. AD 900)  →  Oba Dynasty (c. 1180)  →  Ewuare &amp; Bronzes (1440+)  →  Global Trade (1485+)  →  1897 &amp; Restitution Today</text>
</svg>`;

  const p1 = path.join(PUB_DIR, 'benin_west_africa_edo_map_ks2.png');
  await sharp(Buffer.from(svg)).png().toFile(p1);
  fs.copyFileSync(p1, path.join(UNIT_DIR, 'benin_west_africa_edo_map_ks2.png'));
}

async function resolveCommonsPage(candidate, usedTitles, minW, requireLandscape) {
  if (candidate.startsWith('File:')) {
    if (usedTitles.has(candidate)) return null;
    const apiUrl =
      'https://commons.wikimedia.org/w/api.php?action=query&titles=' +
      encodeURIComponent(candidate) +
      '&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1500&format=json';
    const data = await getJson(apiUrl);
    const pages = Object.values(data.query?.pages || {});
    const p = pages[0];
    if (!p || p.missing !== undefined) return null;
    const ii = p.imageinfo?.[0];
    if (!ii || ii.width < minW) return null;
    if (requireLandscape && ii.width < ii.height) return null;
    if (/AI[-_ ]?Restored|Midjourney|DALL/i.test(p.title)) return null;
    const meta = ii.extmetadata || {};
    const lic = (meta.LicenseShortName?.value || '').trim();
    const nonFree = /NC|NonCommercial|ND|NoDerivs|Fair use|Copyrighted/i.test(lic);
    const okLic = /^(Public domain|CC0|CC BY|CC-BY|CC BY-SA|CC-BY-SA|OGL)/i.test(lic) && !nonFree;
    if (!okLic) return null;
    return { p, ii, meta, lic };
  }

  // Fallback search query
  const apiUrl =
    'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=' +
    encodeURIComponent(candidate + ' filetype:bitmap') +
    '&gsrlimit=12&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1500&format=json';
  const data = await getJson(apiUrl);
  for (const p of Object.values(data.query?.pages || {})) {
    if (usedTitles.has(p.title)) continue;
    if (/\.(svg|pdf|tif|tiff|gif|webm|ogv|xcf)$/i.test(p.title)) continue;
    if (/AI[-_ ]?Restored|Midjourney|DALL/i.test(p.title)) continue;
    const ii = p.imageinfo?.[0];
    if (!ii || ii.width < minW) continue;
    if (requireLandscape && ii.width < ii.height) continue;
    const meta = ii.extmetadata || {};
    const lic = (meta.LicenseShortName?.value || '').trim();
    const nonFree = /NC|NonCommercial|ND|NoDerivs|Fair use|Copyrighted/i.test(lic);
    const okLic = /^(Public domain|CC0|CC BY|CC-BY|CC BY-SA|CC-BY-SA|OGL)/i.test(lic) && !nonFree;
    if (!okLic) continue;
    return { p, ii, meta, lic };
  }
  return null;
}

const cleanHtml = (s) =>
  String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

(async () => {
  await renderInHouseMap();
  const mapBuf = fs.readFileSync(path.join(PUB_DIR, 'benin_west_africa_edo_map_ks2.png'));
  const seenHashes = new Map();
  seenHashes.set(crypto.createHash('sha256').update(mapBuf).digest('hex'), 'benin_west_africa_edo_map_ks2.png');

  const manifest = {
    'benin_west_africa_edo_map_ks2.png': {
      title: 'Map of the Kingdom of Benin (Edo), Iya Earthworks, Rainforest Belt, Ife, Gwato Port and Trade Routes (c. AD 900–1897)',
      date: '2026 (Historical Map: c. AD 900–1897)',
      creator: 'The History Revision Hub Cartography Studio',
      repository: 'The History Revision Hub Original Digital Cartography',
      accession_id: 'HRH-MAP-KS2-BENIN-01',
      rights_status: 'Original In-House Studio Creation — 100% Commercial Copyright Cleared',
      commercial_use_permitted: true,
      source_url: 'https://historyrevisionhub.co.uk',
    },
  };

  const usedCommonsTitles = new Set();
  const missing = [];

  for (const [targetFile, candidates, minW, requireLandscape] of ASSET_PLAN) {
    let chosen = null;
    for (const cand of candidates) {
      chosen = await resolveCommonsPage(cand, usedCommonsTitles, minW, requireLandscape);
      if (chosen) break;
    }

    if (!chosen) {
      missing.push(targetFile);
      console.error(`❌ MISSING: ${targetFile}`);
      continue;
    }

    usedCommonsTitles.add(chosen.p.title);
    try {
      const dlUrl = chosen.ii.thumburl || chosen.ii.url;
      const buf = await downloadBuffer(dlUrl);
      const outPath = path.join(PUB_DIR, targetFile);
      await sharp(buf)
        .flatten({ background: '#ffffff' })
        .resize({ width: 1400, withoutEnlargement: true })
        .toColorspace('srgb')
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(outPath);
      fs.copyFileSync(outPath, path.join(UNIT_DIR, targetFile));

      const outBuf = fs.readFileSync(outPath);
      const sha = crypto.createHash('sha256').update(outBuf).digest('hex');
      if (seenHashes.has(sha)) {
        throw new Error(`Duplicate SHA-256 collision with ${seenHashes.get(sha)}!`);
      }
      seenHashes.set(sha, targetFile);

      manifest[targetFile] = {
        title: cleanHtml(chosen.meta.ObjectName?.value || chosen.p.title.replace(/^File:/, '').replace(/\.[^.]+$/, '')).slice(0, 180),
        date: cleanHtml(chosen.meta.DateTimeOriginal?.value || chosen.meta.DateTime?.value || 'Historical / Museum Collection').slice(0, 80),
        creator: cleanHtml(chosen.meta.Artist?.value || 'Museum / Wikimedia Commons Photographer').slice(0, 120),
        repository: 'Wikimedia Commons',
        accession_id: chosen.p.title,
        rights_status: `${chosen.lic} (Commercial Use Permitted)`,
        commercial_use_permitted: true,
        source_url: chosen.ii.descriptionurl,
        sha256: sha,
      };
      console.log(`✅ ${targetFile} <- ${chosen.p.title} [${chosen.ii.width}x${chosen.ii.height}, ${chosen.lic}]`);
      await new Promise((r) => setTimeout(r, 180));
    } catch (err) {
      missing.push(targetFile);
      console.error(`❌ ERROR on ${targetFile}: ${err.message}`);
    }
  }

  fs.writeFileSync(
    path.join(ROOT, 'scripts', 'ks2_benin_verified_assets.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );
  console.log(`\nSummary: ${Object.keys(manifest).length}/49 saved, ${seenHashes.size} unique SHA-256 hashes, ${missing.length} missing:`, missing);
  if (missing.length > 0) process.exit(1);
})();
