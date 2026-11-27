/**
 * scripts/fetch_ks2_victorian_assets.cjs
 *
 * Renders 1 original in-house SVG->PNG map (`victorian_britain_railways_industry_map_ks2.png`, 1400x980)
 * and queries Wikimedia Commons API for 48 distinct, commercially cleared (Public Domain / CC0 / CC BY / CC BY-SA)
 * historical plates for `ks2_victorian_britain` (49 unique SHA-256 files total).
 * Saves into `public/units/ks2_victorian_britain/assets/` and `units/ks2_victorian_britain/assets/`,
 * and writes `scripts/ks2_victorian_verified_assets.json`.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const PUB_DIR = path.join(ROOT, 'public', 'units', 'ks2_victorian_britain', 'assets');
const UNIT_DIR = path.join(ROOT, 'units', 'ks2_victorian_britain', 'assets');
fs.mkdirSync(PUB_DIR, { recursive: true });
fs.mkdirSync(UNIT_DIR, { recursive: true });

const UA = 'TheHistoryRevisionHub/1.0 (https://historyrevisionhub.co.uk; contact@historyrevisionhub.co.uk)';

// [targetFile, queries[], minWidth, mustBeLandscape]
const SEARCH_PLAN = [
  // 1. Unit Hero Cover (>= 1000px landscape)
  [
    'banner_unit_hero.jpg',
    [
      'The Railway Station William Powell Frith',
      'William Powell Frith Railway Station Paddington',
      'Forth Bridge 1890 locomotive',
      'St Pancras Station Barlow train shed',
    ],
    1000,
    true,
  ],

  // 2. Six Dedicated Landscape Enquiry Banners (>= 850px, width >= height)
  [
    'banner_l1_paddington_railway_station.jpg',
    ['Rain Steam and Speed the Great Western Railway'],
    850,
    true,
  ],
  [
    'banner_l2_manchester_cottonopolis_mills.jpg',
    ['Manchester from Kersal Moor William Wyld'],
    850,
    true,
  ],
  [
    'banner_l3_ragged_school_workhouse_london.jpg',
    ['Over London by Rail Gustave Dore'],
    850,
    true,
  ],
  [
    'banner_l4_victorian_board_school_hall.jpg',
    ['Schoolroom in the Ragged School Museum 8019512'],
    850,
    true,
  ],
  [
    'banner_l5_crystal_palace_hyde_park_1851.jpg',
    ['Crystal Palace from the northeast from Dickinson'],
    850,
    true,
  ],
  [
    'banner_l6_blackpool_brighton_seaside_pier.jpg',
    ['The North Pier Blackpool England LCCN2002696392'],
    850,
    true,
  ],

  // 3. Layer 2 Narrative Plates (17 bitmaps + 1 in-house map = 18 total)
  // L1 (1.1 is victorian_britain_railways_industry_map_ks2.png)
  [
    'queen_victoria_coronation_1838_hayter.jpg',
    ['Coronation of Queen Victoria 28 June 1838 by Sir George Hayter'],
    800,
    false,
  ],
  [
    'brunel_clifton_suspension_bridge_bristol.jpg',
    ['Clifton Suspension Bridge Bristol Avon Gorge'],
    800,
    true,
  ],

  // L2
  [
    'industrial_mill_chimneys_lancashire.jpg',
    ['Baines 1835 A&G Murray'],
    650,
    true,
  ],
  [
    'quarry_bank_cotton_mill_spinning_mule.jpg',
    ['Baines 1835 Mule spinning.png'],
    650,
    true,
  ],
  [
    'south_wales_pithead_colliery_winding_gear.jpg',
    ['Big Pit National Coal Museum Blaenavon'],
    800,
    true,
  ],

  // L3
  [
    'southwell_workhouse_brick_wings.jpg',
    ['Workhouse Southwell.JPG'],
    800,
    true,
  ],
  [
    'saltaire_model_village_yorkshire.jpg',
    ['Saltaire Salts Mill 5235169'],
    800,
    true,
  ],
  [
    'ragged_school_museum_limehouse_london.jpg',
    ['Ragged School Museum Copperfield Rd 02'],
    800,
    false,
  ],

  // L4
  [
    'london_board_school_building_1870s.jpg',
    ['Mydellton school QE3 65'],
    800,
    false,
  ],
  [
    'victorian_wooden_school_desks_inkwells.jpg',
    ['Gallery Classroom British Schools Museum Hitchin 2261646'],
    800,
    false,
  ],
  [
    'victorian_children_drill_playground.jpg',
    ['Teacher on stage talking to audience of children 1837 Wellcome L0039146'],
    700,
    false,
  ],

  // L5
  [
    'opening_great_exhibition_1851_selous.jpg',
    ['The Opening of the Great Exhibition by Queen Victoria on 1 May 1851 Selous'],
    800,
    true,
  ],
  [
    'cragside_northumberland_hydroelectric_house.jpg',
    ['Cragside1.jpg'],
    800,
    true,
  ],
  [
    'babbage_analytical_engine_science_museum.jpg',
    ['BabbageDifferenceEngine.jpg'],
    750,
    false,
  ],

  // L6
  [
    'birmingham_back_to_backs_courtyard.jpg',
    ['Birmingham Back to Backs 1.jpg'],
    800,
    false,
  ],
  [
    'victorian_seaside_bathing_machines_beach.jpg',
    ['The beach and ladies bathing place Margate Kent England ca 1897'],
    800,
    true,
  ],
  [
    'queen_victoria_diamond_jubilee_1897_st_pauls.jpg',
    ['Queen Victoria Diamond Jubilee Service 22 June 1897'],
    800,
    false,
  ],

  // 4. Layer 3 Primary Sources (18 total: 3 per lesson)
  // L1 Sources
  [
    'src_l1_a_stephenson_rocket_locomotive.jpg',
    ['Stephenson Rocket 1.jpg'],
    800,
    false,
  ],
  [
    'src_l1_b_penny_black_postage_stamp_1840.jpg',
    ['Penny Black 1840 postage stamp'],
    600,
    false,
  ],
  [
    'src_l1_c_victorian_vr_pillar_postbox.jpg',
    ['VR Pillar box Hull.JPG'],
    700,
    false,
  ],

  // L2 Sources
  [
    'src_l2_a_lancashire_power_loom_weaving_shed.jpg',
    ['Baines 1835 Weaving Shed.png'],
    700,
    false,
  ],
  [
    'src_l2_b_1842_mines_commission_hurrier_woodcut.jpg',
    ['Hurrier Cobden 1853 v2'],
    600,
    false,
  ],
  [
    'src_l2_c_davy_miners_safety_lamp.jpg',
    ['Davy first safety lantern 1815 Science Museum'],
    650,
    false,
  ],

  // L3 Sources
  [
    'src_l3_a_victorian_workhouse_dining_hall.jpg',
    ['The Writings of Charles Dickens v4 p12 engraving'],
    700,
    false,
  ],
  [
    'src_l3_b_barnardo_children_archival_photo.jpg',
    ['Group portrait of children outside a Barnardo home Wellcome L0000901'],
    650,
    false,
  ],
  [
    'src_l3_c_ragged_school_engraving_london.jpg',
    ['Child welfare Ragged School Whitechapel Wellcome L0002066'],
    700,
    false,
  ],

  // L4 Sources
  [
    'src_l4_a_victorian_writing_slate_pencil.jpg',
    ['Schiefertafel Wien um 1900'],
    550,
    false,
  ],
  [
    'src_l4_b_victorian_classroom_children_photo.jpg',
    ['Orange Street School 1894 Wellcome L0024915'],
    700,
    false,
  ],
  [
    'src_l4_c_victorian_wooden_abacus_bell.jpg',
    ['Red Bead Abacus Display'],
    700,
    false,
  ],

  // L5 Sources
  [
    'src_l5_a_crystal_palace_transept_interior_1851.jpg',
    ['The great industrial exhibition of 1851 Plate 4 The transept LCCN2003665159'],
    800,
    false,
  ],
  [
    'src_l5_b_swan_edison_incandescent_lightbulb.jpg',
    ['The Edison Incandescent Lamp detached from and screwed in socket'],
    650,
    false,
  ],
  [
    'src_l5_c_cooke_wheatstone_electric_telegraph.jpg',
    ['Single needle telegraph Rankin Kennedy 1903'],
    700,
    false,
  ],

  // L6 Sources
  [
    'src_l6_a_victorian_penny_farthing_bicycle.jpg',
    ['Penny-farthing bicycle museum'],
    700,
    false,
  ],
  [
    'src_l6_b_early_victorian_fa_cup_football_team.jpg',
    ['RoyalEngineers1872.jpg'],
    700,
    false,
  ],
  [
    'src_l6_c_queen_victoria_jubilee_coin_medal.jpg',
    ['Great Britain half crown 1887 Victoria'],
    700,
    false,
  ],

  // 5. Six Key Individual Portraits (distinct from all lesson assets)
  [
    'ki_queen_victoria.jpg',
    [
      'Queen Victoria by Bassano 1882',
      'Queen Victoria Franz Xaver Winterhalter 1843',
      'Queen Victoria Diamond Jubilee portrait W and D Downey',
    ],
    700,
    false,
  ],
  [
    'ki_isambard_kingdom_brunel.jpg',
    [
      'Isambard Kingdom Brunel standing before the launching chains of the Leviathan Robert Howlett',
      'Brunel chains Robert Howlett 1857',
    ],
    700,
    false,
  ],
  [
    'ki_lord_shaftesbury.jpg',
    [
      'Anthony Ashley-Cooper 7th Earl of Shaftesbury portrait',
      '7th Earl of Shaftesbury John Collier',
      'Earl of Shaftesbury George Frederic Watts',
    ],
    650,
    false,
  ],
  [
    'ki_thomas_barnardo.jpg',
    [
      'Thomas John Barnardo portrait',
      'Dr Thomas Barnardo photograph',
    ],
    550,
    false,
  ],
  [
    'ki_mary_seacole.jpg',
    [
      'Mary Seacole by Albert Charles Challen',
      'Mary Seacole National Portrait Gallery',
    ],
    650,
    false,
  ],
  [
    'ki_ada_lovelace.jpg',
    [
      'Ada Lovelace portrait Margaret Sarah Carpenter',
      'Ada Byron Chalon portrait',
    ],
    650,
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
    if (redirects > 5) return reject(new Error('Too many redirects'));
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
    <linearGradient id="sea" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#dbeafe"/>
      <stop offset="100%" stop-color="#bae6fd"/>
    </linearGradient>
    <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fef9c3"/>
      <stop offset="55%" stop-color="#ecfccb"/>
      <stop offset="100%" stop-color="#dcfce7"/>
    </linearGradient>
  </defs>
  <rect width="1400" height="980" fill="url(#sea)"/>
  <rect x="28" y="22" width="1344" height="86" rx="12" fill="#1e1b4b"/>
  <text x="54" y="60" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#ffffff">Victorian Britain: Steam Railways, Factories and Reform (1837–1901)</text>
  <text x="54" y="90" font-family="Arial, sans-serif" font-size="17" fill="#fde68a">Seven Landmark Sites of Steam Power, Coal, Cotton Mills, Iron Ships and Royal Travel</text>

  <!-- Stylised Great Britain silhouette (Scotland to Cornwall) + Isle of Wight -->
  <path d="M 520,130 L 605,125 L 650,165 L 625,210 L 675,235 L 640,285 L 605,315 L 665,365 L 705,435 L 730,505 L 765,555 L 820,595 L 830,650 L 785,690 L 825,730 L 800,775 L 705,800 L 635,810 L 555,830 L 455,865 L 410,845 L 470,795 L 535,775 L 560,735 L 485,715 L 445,670 L 505,625 L 460,585 L 490,535 L 545,515 L 550,455 L 505,415 L 525,355 L 475,305 L 495,220 Z"
        fill="url(#land)" stroke="#3f6212" stroke-width="4" stroke-linejoin="round"/>
  <!-- Isle of Wight -->
  <polygon points="675,815 702,808 712,820 688,828" fill="#dcfce7" stroke="#3f6212" stroke-width="2.5"/>

  <!-- Main Trunk Steam Railway Network Lines (Red-gold dashed trunk tracks from London) -->
  <g stroke="#b91c1c" stroke-width="3.2" stroke-dasharray="9,5" fill="none" opacity="0.78">
    <!-- London to Bristol (GWR) -->
    <line x1="742" y1="728" x2="585" y2="732"/>
    <!-- Bristol to South Wales -->
    <line x1="585" y1="732" x2="520" y2="700"/>
    <!-- London to Manchester & Bradford -->
    <line x1="742" y1="728" x2="615" y2="520"/>
    <line x1="615" y1="520" x2="655" y2="485"/>
    <!-- North to Glasgow & Balmoral -->
    <line x1="615" y1="520" x2="545" y2="305"/>
    <line x1="655" y1="485" x2="635" y2="215"/>
    <!-- London to Southampton / Isle of Wight ferry -->
    <line x1="742" y1="728" x2="690" y2="808"/>
  </g>

  <!-- Compass Rose -->
  <circle cx="115" cy="195" r="42" fill="#ffffff" fill-opacity="0.94" stroke="#1e1b4b" stroke-width="2.5"/>
  <polygon points="115,158 125,195 115,187 105,195" fill="#dc2626"/>
  <polygon points="115,232 125,195 115,203 105,195" fill="#334155"/>
  <text x="115" y="147" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1e1b4b">N</text>

  <!-- Legend Box (Top Left below Compass) -->
  <rect x="36" y="258" width="380" height="78" rx="10" fill="#ffffff" fill-opacity="0.95" stroke="#1e1b4b" stroke-width="2"/>
  <line x1="56" y1="285" x2="112" y2="285" stroke="#b91c1c" stroke-width="3.5" stroke-dasharray="8,4"/>
  <text x="124" y="290" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#1e1b4b">Main Steam Railway Trunk Lines</text>
  <text x="56" y="317" font-family="Arial, sans-serif" font-size="14" fill="#334155">Standard "Railway Time" linked towns by 1850</text>

  <!-- LEFT COLUMN CALLOUTS -->
  <!-- 6. Glasgow and Clydebank (Iron Shipbuilding) -->
  <circle cx="545" cy="305" r="12" fill="#0369a1" stroke="#ffffff" stroke-width="3"/>
  <line x1="533" y1="305" x2="416" y2="395" stroke="#0369a1" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="36" y="354" width="380" height="88" rx="10" fill="#ffffff" stroke="#0369a1" stroke-width="2.5"/>
  <text x="54" y="382" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#075985">6. Glasgow and Clydebank</text>
  <text x="54" y="406" font-family="Arial, sans-serif" font-size="14.5" fill="#334155">Giant River Clyde yards hammered iron and</text>
  <text x="54" y="426" font-family="Arial, sans-serif" font-size="14.5" fill="#334155">steel steamships sailing across every ocean.</text>

  <!-- 4. Manchester and Lancashire ("Cottonopolis") -->
  <circle cx="615" cy="520" r="12" fill="#7c3aed" stroke="#ffffff" stroke-width="3"/>
  <line x1="603" y1="520" x2="416" y2="505" stroke="#7c3aed" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="36" y="460" width="380" height="88" rx="10" fill="#ffffff" stroke="#7c3aed" stroke-width="2.5"/>
  <text x="54" y="488" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#5b21b6">4. Manchester and Lancashire</text>
  <text x="54" y="512" font-family="Arial, sans-serif" font-size="14.5" fill="#334155">Nicknamed "Cottonopolis" — steam-powered</text>
  <text x="54" y="532" font-family="Arial, sans-serif" font-size="14.5" fill="#334155">cotton mills spun and wove cloth for the world.</text>

  <!-- 3. South Wales Valleys (Coal Mines & 1842 Mines Act) -->
  <circle cx="520" cy="700" r="12" fill="#334155" stroke="#ffffff" stroke-width="3"/>
  <line x1="508" y1="700" x2="416" y2="615" stroke="#334155" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="36" y="566" width="380" height="92" rx="10" fill="#ffffff" stroke="#334155" stroke-width="2.5"/>
  <text x="54" y="594" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#0f172a">3. South Wales Coal Valleys</text>
  <text x="54" y="618" font-family="Arial, sans-serif" font-size="14.5" fill="#334155">Deep coal pits fuelled Britain’s steam engines;</text>
  <text x="54" y="638" font-family="Arial, sans-serif" font-size="14.5" fill="#334155">the 1842 Mines Act banned children under ten.</text>

  <!-- 2. Bristol and GWR (Brunel's Clifton Bridge & Box Tunnel) -->
  <circle cx="585" cy="732" r="12" fill="#ea580c" stroke="#ffffff" stroke-width="3"/>
  <line x1="573" y1="736" x2="416" y2="730" stroke="#ea580c" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="36" y="676" width="380" height="92" rx="10" fill="#ffffff" stroke="#ea580c" stroke-width="2.5"/>
  <text x="54" y="704" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#9a3412">2. Bristol and Great Western Railway</text>
  <text x="54" y="728" font-family="Arial, sans-serif" font-size="14.5" fill="#334155">Brunel designed the Clifton Suspension Bridge,</text>
  <text x="54" y="748" font-family="Arial, sans-serif" font-size="14.5" fill="#334155">Box Tunnel, and iron steamship SS Great Britain.</text>

  <!-- RIGHT COLUMN CALLOUTS -->
  <!-- 7. Balmoral & Isle of Wight (Royal Rail & Seaside) -->
  <circle cx="635" cy="215" r="11" fill="#be123c" stroke="#ffffff" stroke-width="3"/>
  <circle cx="692" cy="816" r="11" fill="#be123c" stroke="#ffffff" stroke-width="3"/>
  <text x="722" y="823" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#9f1239">Osborne House (Wight)</text>
  <line x1="646" y1="215" x2="865" y2="232" stroke="#be123c" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="865" y="182" width="498" height="94" rx="10" fill="#ffffff" stroke="#be123c" stroke-width="2.5"/>
  <text x="883" y="211" font-family="Arial, sans-serif" font-size="17.5" font-weight="bold" fill="#9f1239">7. Balmoral (Scotland) and Osborne House</text>
  <text x="883" y="236" font-family="Arial, sans-serif" font-size="15" fill="#334155">Queen Victoria rode royal steam trains from London to</text>
  <text x="883" y="257" font-family="Arial, sans-serif" font-size="15" fill="#334155">Scottish Balmoral and seaside Osborne House on Wight.</text>

  <!-- 5. Bradford / Saltaire and Yorkshire (Factory Reform) -->
  <circle cx="655" cy="485" r="12" fill="#059669" stroke="#ffffff" stroke-width="3"/>
  <line x1="667" y1="485" x2="865" y2="365" stroke="#059669" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="865" y="312" width="498" height="94" rx="10" fill="#ffffff" stroke="#059669" stroke-width="2.5"/>
  <text x="883" y="341" font-family="Arial, sans-serif" font-size="17.5" font-weight="bold" fill="#065f46">5. Bradford, Saltaire and Yorkshire</text>
  <text x="883" y="366" font-family="Arial, sans-serif" font-size="15" fill="#334155">Woollen mill heartland where Lord Shaftesbury backed</text>
  <text x="883" y="387" font-family="Arial, sans-serif" font-size="15" fill="#334155">Factory Acts and Titus Salt built clean Saltaire village.</text>

  <!-- 1. London (1851 Crystal Palace, Westminster & Embankment) -->
  <circle cx="742" cy="728" r="13" fill="#1e1b4b" stroke="#facc15" stroke-width="3.5"/>
  <line x1="755" y1="728" x2="865" y2="515" stroke="#1e1b4b" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="865" y="458" width="498" height="104" rx="10" fill="#ffffff" stroke="#1e1b4b" stroke-width="2.8"/>
  <text x="883" y="488" font-family="Arial, sans-serif" font-size="17.5" font-weight="bold" fill="#1e1b4b">1. London: Westminster, 1851 Crystal Palace</text>
  <text x="883" y="513" font-family="Arial, sans-serif" font-size="15" fill="#334155">Capital of Parliament’s Factory and School Acts, Hyde</text>
  <text x="883" y="534" font-family="Arial, sans-serif" font-size="15" fill="#334155">Park’s 1851 Great Exhibition, and Bazalgette’s Embankment.</text>

  <!-- Seaside & Penny Post Summary Callout Box (Bottom Right) -->
  <rect x="865" y="608" width="498" height="104" rx="10" fill="#fffbeb" stroke="#b45309" stroke-width="2.5"/>
  <text x="883" y="637" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#92400e">Shrinking Britain (1837–1901)</text>
  <text x="883" y="662" font-family="Arial, sans-serif" font-size="14.8" fill="#334155">• 1840 Penny Black stamps carried letters anywhere for 1d.</text>
  <text x="883" y="684" font-family="Arial, sans-serif" font-size="14.8" fill="#334155">• 20,000+ miles of track took families to Blackpool and Brighton!</text>

  <rect x="28" y="905" width="1344" height="50" rx="10" fill="#1e1b4b"/>
  <text x="700" y="936" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#f8fafc">1837 Victoria Crowned  →  1840 Penny Black  →  1842 Mines Act  →  1851 Crystal Palace  →  1870 School Act  →  1897 Diamond Jubilee</text>
</svg>`;

  const p1 = path.join(PUB_DIR, 'victorian_britain_railways_industry_map_ks2.png');
  await sharp(Buffer.from(svg)).png().toFile(p1);
  fs.copyFileSync(p1, path.join(UNIT_DIR, 'victorian_britain_railways_industry_map_ks2.png'));
}

function cleanMeta(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

(async () => {
  await renderInHouseMap();
  const manifest = {
    'victorian_britain_railways_industry_map_ks2.png': {
      title: 'Map of Victorian Britain: Steam Railways, Industrial Heartland and Reform Landmarks (1837–1901)',
      date: '2026 (Historical Map: 1837–1901)',
      creator: 'The History Revision Hub Cartography Studio',
      repository: 'The History Revision Hub Original Digital Cartography',
      accession_id: 'HRH-MAP-KS2-VICTORIAN-01',
      rights_status: 'Original In-House Studio Creation — 100% Commercial Copyright Cleared',
      commercial_use_permitted: true,
      source_url: 'https://historyrevisionhub.co.uk',
    },
  };

  const usedCommonsTitles = new Set();
  const usedHashes = new Set();
  const mapHash = crypto.createHash('sha256').update(fs.readFileSync(path.join(PUB_DIR, 'victorian_britain_railways_industry_map_ks2.png'))).digest('hex');
  usedHashes.add(mapHash);

  const missing = [];

  // Reject American/unrelated keywords in Commons titles so British Victorian integrity stays high
  const REJECT_TITLE_RE = /\b(civil war|confederate|union pacific|pennsylvania|massachusetts|lewis hine|west virginia|alabama|georgia|new york|chicago|france|germany|russia|india|australia)\b/i;

  for (const [targetFile, qList, minW, mustBeLandscape] of SEARCH_PLAN) {
    let saved = false;
    for (const q of qList) {
      const apiUrl =
        'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=' +
        encodeURIComponent(q + ' filetype:bitmap') +
        '&gsrlimit=18&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1450&format=json';
      let data;
      try {
        data = await getJson(apiUrl);
      } catch (e) {
        continue;
      }
      const pages = Object.values(data.query?.pages || {});
      for (const p of pages) {
        if (usedCommonsTitles.has(p.title)) continue;
        if (/\.(svg|pdf|tif|tiff|gif|webm|ogv|xcf|djvu)$/i.test(p.title)) continue;
        if (REJECT_TITLE_RE.test(p.title)) continue;
        const ii = p.imageinfo?.[0];
        if (!ii || ii.width < minW) continue;
        if (mustBeLandscape && ii.width < ii.height) continue;
        const meta = ii.extmetadata || {};
        const lic = cleanMeta(meta.LicenseShortName?.value || '');
        const nonFree = /NC|NonCommercial|ND|NoDerivs|Fair use|Copyrighted/i.test(lic);
        const okLic = /^(Public domain|PD|CC0|CC BY|CC-BY|CC BY-SA|CC-BY-SA|OGL)/i.test(lic) && !nonFree;
        if (!okLic) continue;

        try {
          const buf = await downloadBuffer(ii.thumburl || ii.url);
          const outPath = path.join(PUB_DIR, targetFile);
          await sharp(buf)
            .flatten({ background: '#ffffff' })
            .resize({ width: 1400, height: 1100, fit: 'inside', withoutEnlargement: true })
            .toColorspace('srgb')
            .jpeg({ quality: 86, mozjpeg: true })
            .toFile(outPath);

          const fileHash = crypto.createHash('sha256').update(fs.readFileSync(outPath)).digest('hex');
          if (usedHashes.has(fileHash)) {
            fs.unlinkSync(outPath);
            continue;
          }

          const outMeta = await sharp(outPath).metadata();
          if (mustBeLandscape && outMeta.width < outMeta.height) {
            fs.unlinkSync(outPath);
            continue;
          }

          fs.copyFileSync(outPath, path.join(UNIT_DIR, targetFile));
          usedCommonsTitles.add(p.title);
          usedHashes.add(fileHash);

          manifest[targetFile] = {
            title: cleanMeta(meta.ObjectName?.value || p.title.replace(/^File:/, '').replace(/\.[^.]+$/, '')).slice(0, 160),
            date: cleanMeta(meta.DateTimeOriginal?.value || meta.DateTime?.value || '19th Century / Historical Collection').slice(0, 90),
            creator: cleanMeta(meta.Artist?.value || 'Wikimedia Commons Contributor').slice(0, 120) || 'Wikimedia Commons Contributor',
            repository: 'Wikimedia Commons',
            accession_id: p.title,
            rights_status: `${lic} (Commercial Use Permitted)`,
            commercial_use_permitted: true,
            source_url: ii.descriptionurl,
            width: outMeta.width,
            height: outMeta.height,
            sha256: fileHash,
          };
          console.log(`✅ ${targetFile} <- ${p.title} [${outMeta.width}x${outMeta.height}, ${lic}]`);
          saved = true;
          await new Promise((r) => setTimeout(r, 200));
          break;
        } catch (err) {
          continue;
        }
      }
      if (saved) break;
    }

    if (!saved) {
      missing.push(targetFile);
      console.log(`❌ MISSING: ${targetFile}`);
    }
  }

  fs.writeFileSync(
    path.join(ROOT, 'scripts', 'ks2_victorian_verified_assets.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );
  console.log(`\nSummary: ${Object.keys(manifest).length}/49 saved, ${missing.length} missing:`, missing);
})();
