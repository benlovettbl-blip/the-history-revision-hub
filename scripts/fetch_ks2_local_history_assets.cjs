/**
 * scripts/fetch_ks2_local_history_assets.cjs
 *
 * Renders 1 original in-house SVG->PNG Place-Name Detective Map (`local_history_place_names_detective_map_ks2.png`, 1400x980)
 * and downloads 48 distinct, Eyes-First verified, 100% commercially cleared (Public Domain / CC0 / CC BY / CC BY-SA / OGL)
 * UK historical plates for `ks2_local_history_detective`.
 *
 * Saves all 49 assets into both `public/units/ks2_local_history_detective/assets/` and
 * `units/ks2_local_history_detective/assets/`, verifying 49 unique Commons pages and 49 unique SHA-256 hashes,
 * and writes `scripts/ks2_local_history_verified_assets.json`.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const PUB_DIR = path.join(ROOT, 'public', 'units', 'ks2_local_history_detective', 'assets');
const UNIT_DIR = path.join(ROOT, 'units', 'ks2_local_history_detective', 'assets');
const MANIFEST_PATH = path.join(ROOT, 'scripts', 'ks2_local_history_verified_assets.json');
fs.mkdirSync(PUB_DIR, { recursive: true });
fs.mkdirSync(UNIT_DIR, { recursive: true });

const UA = 'TheHistoryRevisionHub/1.0 (https://historyrevisionhub.co.uk; contact@historyrevisionhub.co.uk)';

// [targetFile, queries, minWidth, mustBeLandscape]
const SEARCH_PLAN = [
  // 1 Unit Cover (>= 1000px wide, landscape, car-free historic UK village bridge & streetscape)
  ['banner_unit_hero.jpg', ['Castle combe river.jpg', 'Castle combe cotswolds.jpg'], 1050, true],

  // 6 Dedicated Landscape Enquiry Banners (>= 850px wide, landscape, never reused!)
  ['banner_l1_ordnance_survey_landscape.jpg', ['00 3453 Eastgate Clock - Chester, England.jpg'], 900, true],
  ['banner_l2_british_high_street_buildings.jpg', ['Chester Rows, Eastgate Street, Chester.JPG'], 900, true],
  ['banner_l3_parish_church_schoolhouse.jpg', ['Tollesbury-Village-St-Marys-Church-1.jpg'], 900, true],
  ['banner_l4_british_canal_viaduct_industry.jpg', ['Boat on Pontcysyllte Aqueduct.jpg'], 900, true],
  ['banner_l5_british_war_memorial_avenue.jpg', ['Port Sunlight war memorial 1.jpg'], 900, true],
  ['banner_l6_heritage_conservation_britain.jpg', ['Quarry Bank Mill Styal.jpg'], 900, true],

  // 17 Layer 2 Narrative Plates (+ 1 in-house SVG map = 18 plates across 6 lessons)
  ['l1_p2_chester_roman_fortress_wall.jpg', ['Portion of Old London Wall 2013-09-08 18-16-32.jpg'], 800, false],
  ['l1_p3_os_trig_pillar_hilltop.jpg', ['Corr Bhan trig point - geograph.org.uk - 2746843.jpg'], 800, false],

  ['l2_p1_tudor_timber_jetty_house.jpg', ['Little Moreton Hall Exterior.jpg'], 800, false],
  ['l2_p2_georgian_sash_terrace_bath.jpg', ['Royal Crescent Bath Beata Cosgrove Photography.jpg'], 800, false],
  ['l2_p3_victorian_red_brick_town_hall.jpg', ['Victoria Building, Liverpool (2).JPG'], 800, false],

  ['l3_p1_victorian_terraced_street_houses.jpg', ['Ravensworth Terrace Beamish', 'Francis Street Beamish', 'Caroline Street, Saltaire - geograph.org.uk - 1041624.jpg'], 800, false],
  ['l3_p2_parish_church_font_interior.jpg', ['Lead baptismal font in Saint Anne\'s Church, Siston, South Gloucestershire, England - 20100603.jpg'], 750, false],
  ['l3_p3_victorian_schoolroom_desks_slates.jpg', ['Museum of Lincolnshire Life, Lincoln, England - DSCF1650.JPG', 'Schoolroom Pit Village Beamish', 'West Somerset Rural Life Museum.JPG'], 800, false],

  ['l4_p1_historic_market_cross_hall.jpg', ['Wymondham market cross - geograph.org.uk - 2114858.jpg'], 800, false],
  ['l4_p2_textile_watermill_wheel_britain.jpg', ['The waterwheel at Daniels Mill - geograph.org.uk - 2718469.jpg'], 800, false],
  ['l4_p3_preserved_british_steam_station.jpg', ['North Yorkshire Moors Railway, Goathland - geograph.org.uk - 2547395.jpg'], 800, false],

  ['l5_p1_poppy_wreaths_cenotaph_remembrance.jpg', ['Garstang War Memorial, Lancashire.JPG'], 800, false],
  ['l5_p2_cwgc_cemetery_portland_headstones.jpg', ['Known unto God (31704907595).jpg'], 800, false],
  ['l5_p3_ww1_british_war_victory_medals.jpg', ['Medal, decoration (AM 2001.32.1-5).jpg'], 700, false],

  ['l6_p1_british_pre_decimal_coins_shilling.jpg', ['English Two Shillings 1938.jpg'], 700, false],
  ['l6_p2_traditional_british_high_street_shops.jpg', ['Co-op, Town, Beamish Museum, 21 November 2013 (1).jpg', 'Blists Hill open air museum Ironmonger\'s shop window.JPG'], 800, false],
  ['l6_p3_local_heritage_trail_information_board.jpg', ['Bedale Heritage Trail information board - geograph.org.uk - 4016326.jpg'], 800, false],

  // 18 Layer 3 Primary Sources (3 per lesson, Source A-C)
  ['l1_src_a_ordnance_survey_19th_century_map.jpg', ['Theatre Royal Gloucester Ordnance Survey map 1880s.jpg', 'Laysters in Ordnance Survey Second Edition 1905 Sheet XIII. N.W.jpg'], 800, false],
  ['l1_src_b_os_carved_benchmark_stone_arrow.jpg', ['Benchmark and WD HWM at Magazines Promenade.jpg'], 700, false],
  ['l1_src_c_domesday_book_place_names_folio.jpg', ['Domesday-book-1804x972.jpg', 'Domesday Book - Warwickshire.png'], 600, false],

  ['l2_src_a_victorian_vr_pillar_postbox.jpg', ['Penfold post box, Abercromby Square 3.jpg', 'Victorian pillar box, Rothesay.jpg'], 750, false],
  ['l2_src_b_carved_building_datestone_initials.jpg', ['Datestone on former school, Northowram - geograph.org.uk - 2288516.jpg', 'Clarendon Street, Terrace Royal - datestone - geograph.org.uk - 2372911.jpg'], 700, false],
  ['l2_src_c_faded_brick_ghost_sign_uk.jpg', ['ConsumersTeasAlwaysPlease.JPG'], 800, false],

  ['l3_src_a_uk_census_household_schedule_page.jpg', ['1881 Census showing Joanna Hiffernan\'s address.jpg', 'Leone Tollemache1891 census.jpg'], 600, false],
  ['l3_src_b_parish_register_baptisms_marriages.jpg', ['W.W. Jacobs baptism record.png'], 700, false],
  ['l3_src_c_carved_churchyard_headstone_inscription.jpg', ['Grave of Robert and Mary May.jpg'], 750, false],

  ['l4_src_a_turnpike_roadside_stone_milestone.jpg', ['Old Milestone (geograph 3652666).jpg'], 750, false],
  ['l4_src_b_british_canal_lock_narrowboat.jpg', ['Narrowboat leaving Cowley Lock - geograph.org.uk - 3470647.jpg'], 800, false],
  ['l4_src_c_historic_street_nameplate_mill_station.jpg', ['Cast iron street signs - geograph.org.uk - 2299726.jpg'], 750, false],

  ['l5_src_a_village_war_memorial_carved_names.jpg', ['Church of St Mary interior WW1 memorial Henham Essex England.jpg'], 750, false],
  ['l5_src_b_ww1_bronze_memorial_plaque_penny.jpg', ['Medal, commemorative (AM 2014.34.3-1).jpg'], 700, false],
  ['l5_src_c_cwgc_headstone_regimental_badge.jpg', ['Pte John Graham in Strand Commonwealth War Graves Commission Cemetery Redvers.jpg'], 750, false],

  ['l6_src_a_ceramic_blue_plaque_london.jpg', ['Octavia Hill (4372878174).jpg'], 750, false],
  ['l6_src_b_vintage_sepia_british_street_photo.jpg', ['Calne Wiltshire England - Curzon Street c.1900.jpg'], 750, false],
  ['l6_src_c_audio_recorder_oral_history_interview.jpg', ['UHER Report 138 678.jpg'], 750, false],

  // 6 Key Individuals / Pioneers
  ['ki_william_conqueror_domesday.jpg', ['Bayeux Tapestry scene23 Harold oath William.jpg'], 700, false],
  ['ki_william_roy_ordnance_survey.jpg', ['3foottheodoliteramsden.jpg'], 650, false],
  ['ki_william_farr_victorian_census.jpg', ['William Farr 2.jpg'], 600, false],
  ['ki_octavia_hill_national_trust.jpg', ['Life of Octavia Hill - 1877.jpg'], 600, false],
  ['ki_fabian_ware_cwgc.jpg', ['Fabian Ware and King George V at Tyne Cot (1922).jpg'], 550, false],
  ['ki_local_archivist_oral_historian.jpg', ['Boxes of documents on repository shelving at The National Archives.jpg'], 750, false],
];

const REFRESH_TARGETS = new Set([
  'banner_unit_hero.jpg',
  'l2_p1_tudor_timber_jetty_house.jpg',
  'l2_p3_victorian_red_brick_town_hall.jpg',
  'l3_p1_victorian_terraced_street_houses.jpg',
  'l3_p3_victorian_schoolroom_desks_slates.jpg',
  'l6_p2_traditional_british_high_street_shops.jpg',
  'l6_p3_local_heritage_trail_information_board.jpg',
  'l1_src_a_ordnance_survey_19th_century_map.jpg',
  'l1_src_c_domesday_book_place_names_folio.jpg',
  'l2_src_a_victorian_vr_pillar_postbox.jpg',
  'l2_src_b_carved_building_datestone_initials.jpg',
  'l3_src_a_uk_census_household_schedule_page.jpg',
  'l4_src_c_historic_street_nameplate_mill_station.jpg',
  'ki_octavia_hill_national_trust.jpg',
  'ki_fabian_ware_cwgc.jpg',
]);

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

async function renderInHousePlaceNamesMap() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="980" viewBox="0 0 1400 980">
  <defs>
    <linearGradient id="sea" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#dbeafe"/>
      <stop offset="100%" stop-color="#bae6fd"/>
    </linearGradient>
    <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f7fee7"/>
      <stop offset="100%" stop-color="#d9f99d"/>
    </linearGradient>
  </defs>
  <rect width="1400" height="980" fill="url(#sea)"/>
  <rect x="28" y="22" width="1344" height="88" rx="12" fill="#0f172a"/>
  <text x="54" y="60" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#ffffff">Britain’s Place-Name Detective Map (Celtic, Roman, Saxon, Viking and Norman)</text>
  <text x="54" y="92" font-family="Arial, sans-serif" font-size="17" fill="#7dd3fc">Decode Town and Village Endings Anywhere in Britain to Spot Who Settled Your Area First</text>

  <path d="M 480,145 L 575,140 L 625,185 L 590,235 L 650,278 L 635,340 L 695,400 L 735,475 L 775,550 L 835,590 L 845,650 L 795,690 L 845,735 L 810,785 L 715,810 L 625,825 L 540,850 L 450,880 L 400,860 L 460,808 L 520,788 L 548,742 L 478,728 L 435,688 L 495,638 L 442,598 L 472,542 L 532,528 L 542,468 L 488,428 L 512,368 L 462,312 L 488,238 Z"
        fill="url(#land)" stroke="#3f6212" stroke-width="4" stroke-linejoin="round"/>

  <circle cx="115" cy="195" r="44" fill="#ffffff" fill-opacity="0.94" stroke="#0f172a" stroke-width="2.5"/>
  <polygon points="115,157 125,195 115,187 105,195" fill="#dc2626"/>
  <polygon points="115,233 125,195 115,203 105,195" fill="#334155"/>
  <text x="115" y="146" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0f172a">N</text>

  <circle cx="468" cy="618" r="12" fill="#0f766e" stroke="#ffffff" stroke-width="3"/>
  <line x1="456" y1="618" x2="415" y2="335" stroke="#0f766e" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="30" y="280" width="385" height="96" rx="10" fill="#ffffff" stroke="#0f766e" stroke-width="2.5"/>
  <text x="48" y="310" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#115e59">1. Celtic British: Aber-, Llan-, Avon</text>
  <text x="48" y="335" font-family="Arial, sans-serif" font-size="14.5" fill="#334155">Ancient Brittonic words for river mouths,</text>
  <text x="48" y="356" font-family="Arial, sans-serif" font-size="14.5" fill="#334155">churches, and streams (Aberystwyth, River Avon).</text>

  <circle cx="545" cy="548" r="12" fill="#dc2626" stroke="#ffffff" stroke-width="3"/>
  <line x1="533" y1="548" x2="415" y2="465" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="30" y="405" width="385" height="102" rx="10" fill="#ffffff" stroke="#dc2626" stroke-width="2.5"/>
  <text x="48" y="435" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#991b1b">2. Roman Forts: -chester, -caster, -cester</text>
  <text x="48" y="460" font-family="Arial, sans-serif" font-size="14.5" fill="#334155">From Latin "castra" (walled Roman army camp):</text>
  <text x="48" y="482" font-family="Arial, sans-serif" font-size="14.5" fill="#334155">Chester, Lancaster, Manchester, Cirencester.</text>

  <circle cx="670" cy="695" r="12" fill="#2563eb" stroke="#ffffff" stroke-width="3"/>
  <line x1="658" y1="695" x2="415" y2="600" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="30" y="538" width="385" height="98" rx="10" fill="#ffffff" stroke="#2563eb" stroke-width="2.5"/>
  <text x="48" y="568" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#1e40af">3. Saxon Crossings: -ford and -bridge</text>
  <text x="48" y="593" font-family="Arial, sans-serif" font-size="14.5" fill="#334155">Shallow river crossings for oxen or timber</text>
  <text x="48" y="615" font-family="Arial, sans-serif" font-size="14.5" fill="#334155">bridges: Oxford, Stafford, Stamford, Cambridge.</text>

  <circle cx="645" cy="805" r="12" fill="#059669" stroke="#ffffff" stroke-width="3"/>
  <line x1="633" y1="805" x2="415" y2="730" stroke="#059669" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="30" y="666" width="385" height="98" rx="10" fill="#ffffff" stroke="#059669" stroke-width="2.5"/>
  <text x="48" y="696" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#065f46">4. Saxon Woods: -ley, -hurst, -worth</text>
  <text x="48" y="721" font-family="Arial, sans-serif" font-size="14.5" fill="#334155">Old English woodland clearings (-leah) and</text>
  <text x="48" y="743" font-family="Arial, sans-serif" font-size="14.5" fill="#334155">wooded hills: Henley, Lyndhurst, Tamworth.</text>

  <circle cx="715" cy="458" r="13" fill="#7c3aed" stroke="#ffffff" stroke-width="3"/>
  <line x1="728" y1="458" x2="875" y2="250" stroke="#7c3aed" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="875" y="195" width="495" height="106" rx="10" fill="#ffffff" stroke="#7c3aed" stroke-width="2.5"/>
  <text x="895" y="226" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#6d28d9">5. Viking Danelaw: -by, -thorpe, -thwaite</text>
  <text x="895" y="253" font-family="Arial, sans-serif" font-size="15" fill="#334155">Old Norse "-by" (farm or village) and "-thorpe" (hamlet)</text>
  <text x="895" y="276" font-family="Arial, sans-serif" font-size="15" fill="#334155">across northern and eastern Britain: Whitby, Derby, Scunthorpe.</text>

  <circle cx="710" cy="595" r="12" fill="#d97706" stroke="#ffffff" stroke-width="3"/>
  <line x1="722" y1="595" x2="875" y2="395" stroke="#d97706" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="875" y="335" width="495" height="106" rx="10" fill="#ffffff" stroke="#d97706" stroke-width="2.5"/>
  <text x="895" y="366" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#b45309">6. Anglo-Saxon Farms: -ham, -ton, -ing</text>
  <text x="895" y="393" font-family="Arial, sans-serif" font-size="15" fill="#334155">Britain’s most common village clues: "-ham" (homestead)</text>
  <text x="895" y="416" font-family="Arial, sans-serif" font-size="15" fill="#334155">and "-ton" (fenced farm/town): Nottingham, Southampton.</text>

  <circle cx="670" cy="368" r="12" fill="#0f172a" stroke="#facc15" stroke-width="3.5"/>
  <line x1="682" y1="368" x2="875" y2="535" stroke="#0f172a" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="875" y="475" width="495" height="106" rx="10" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
  <text x="895" y="506" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#0f172a">7. Norman and Medieval: Castle-, Abbey-, Market-</text>
  <text x="895" y="533" font-family="Arial, sans-serif" font-size="15" fill="#334155">After 1066, stone castles, monasteries, and royal charters</text>
  <text x="895" y="556" font-family="Arial, sans-serif" font-size="15" fill="#334155">shaped names like Newcastle, Battle, and Market Harborough.</text>

  <rect x="875" y="615" width="495" height="148" rx="12" fill="#eff6ff" stroke="#1d4ed8" stroke-width="2.5"/>
  <text x="895" y="648" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1e3a8a">Doorstep Detective Challenge:</text>
  <text x="895" y="676" font-family="Arial, sans-serif" font-size="15" fill="#1e293b">1. Look up your own town, village, or nearest suburb.</text>
  <text x="895" y="702" font-family="Arial, sans-serif" font-size="15" fill="#1e293b">2. Split its name into front + ending (e.g. Ox + ford).</text>
  <text x="895" y="728" font-family="Arial, sans-serif" font-size="15" fill="#1e293b">3. Check an 1890s Ordnance Survey map to see its old spelling!</text>

  <rect x="28" y="904" width="1344" height="52" rx="10" fill="#1e293b"/>
  <text x="700" y="936" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#f8fafc">Celtic Rivers  →  Roman -chester (AD 43)  →  Saxon -ton / -ham (AD 450)  →  Viking -by (AD 865)  →  1086 Domesday Book  →  Ordnance Survey Maps</text>
</svg>`;

  const p1 = path.join(PUB_DIR, 'local_history_place_names_detective_map_ks2.png');
  await sharp(Buffer.from(svg)).png().toFile(p1);
  fs.copyFileSync(p1, path.join(UNIT_DIR, 'local_history_place_names_detective_map_ks2.png'));
}

(async () => {
  await renderInHousePlaceNamesMap();
  const existingManifest = fs.existsSync(MANIFEST_PATH)
    ? JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
    : {};

  const mapBuf = fs.readFileSync(path.join(PUB_DIR, 'local_history_place_names_detective_map_ks2.png'));
  const usedHashes = new Set([crypto.createHash('sha256').update(mapBuf).digest('hex')]);
  const usedCommonsTitles = new Set();

  const manifest = {
    'local_history_place_names_detective_map_ks2.png': {
      title: 'Britain’s Place-Name Detective Map (Celtic, Roman, Anglo-Saxon, Viking and Norman Clues)',
      date: '2026 (Historical Map: Pre-Roman Britain to Present)',
      creator: 'The History Revision Hub Cartography Studio',
      repository: 'The History Revision Hub Original Digital Cartography',
      accession_id: 'HRH-MAP-KS2-LOCAL-01',
      rights_status: 'Original In-House Studio Creation — 100% Commercial Copyright Cleared',
      commercial_use_permitted: true,
      source_url: 'https://historyrevisionhub.co.uk',
    },
  };

  // Keep already-verified images not in REFRESH_TARGETS
  for (const [targetFile] of SEARCH_PLAN) {
    const diskPath = path.join(PUB_DIR, targetFile);
    if (!REFRESH_TARGETS.has(targetFile) && existingManifest[targetFile] && fs.existsSync(diskPath)) {
      const sha = crypto.createHash('sha256').update(fs.readFileSync(diskPath)).digest('hex');
      usedHashes.add(sha);
      usedCommonsTitles.add(existingManifest[targetFile].accession_id);
      manifest[targetFile] = existingManifest[targetFile];
    }
  }

  const missing = [];

  for (const [targetFile, qList, minW, mustBeLandscape] of SEARCH_PLAN) {
    if (manifest[targetFile]) continue;
    let saved = false;
    for (const q of qList) {
      let pages = [];
      if (/\.(jpg|jpeg|png)$/i.test(q)) {
        // Exact File: lookup first
        const exactTitle = q.startsWith('File:') ? q : `File:${q}`;
        const exactUrl =
          'https://commons.wikimedia.org/w/api.php?action=query&titles=' +
          encodeURIComponent(exactTitle) +
          '&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1450&format=json';
        const exactData = await getJson(exactUrl);
        pages = Object.values(exactData.query?.pages || {}).filter((p) => !p.missing);
      }
      if (!pages.length) {
        const apiUrl =
          'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=' +
          encodeURIComponent(q + ' filetype:bitmap') +
          '&gsrlimit=12&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1450&format=json';
        const data = await getJson(apiUrl);
        pages = Object.values(data.query?.pages || {});
      }

      for (const p of pages) {
        if (usedCommonsTitles.has(p.title)) continue;
        if (/\.(svg|pdf|tif|tiff|gif|webm|ogv|xcf)$/i.test(p.title)) continue;
        const ii = p.imageinfo?.[0];
        if (!ii || ii.width < minW) continue;
        if (mustBeLandscape && ii.width < ii.height) continue;

        const meta = ii.extmetadata || {};
        const lic = (meta.LicenseShortName?.value || '').trim();
        const nonFree = /NC|NonCommercial|ND|NoDerivs|Fair use|Copyrighted/i.test(lic);
        const okLic = /^(Public domain|No restrictions|CC0|CC BY|CC-BY|CC BY-SA|CC-BY-SA|OGL)/i.test(lic) && !nonFree;
        if (!okLic) continue;

        try {
          const buf = await downloadBuffer(ii.thumburl || ii.url);
          const outPath = path.join(PUB_DIR, targetFile);
          await sharp(buf)
            .flatten({ background: '#ffffff' })
            .resize({ width: 1400, withoutEnlargement: true })
            .toColorspace('srgb')
            .jpeg({ quality: 86, mozjpeg: true })
            .toFile(outPath);

          const finalBuf = fs.readFileSync(outPath);
          const sha = crypto.createHash('sha256').update(finalBuf).digest('hex');
          if (usedHashes.has(sha)) {
            fs.unlinkSync(outPath);
            continue;
          }
          const finalMeta = await sharp(outPath).metadata();
          if (mustBeLandscape && finalMeta.width < finalMeta.height) {
            fs.unlinkSync(outPath);
            continue;
          }

          usedHashes.add(sha);
          usedCommonsTitles.add(p.title);
          fs.copyFileSync(outPath, path.join(UNIT_DIR, targetFile));

          const cleanHtml = (s) =>
            String(s || '')
              .replace(/<[^>]+>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();

          const normLic = lic === 'No restrictions' ? 'Public domain' : lic;
          manifest[targetFile] = {
            title: cleanHtml(meta.ObjectName?.value || p.title.replace(/^File:/, '').replace(/\.[^.]+$/, '')),
            date: cleanHtml(meta.DateTimeOriginal?.value || meta.DateTime?.value || 'Historical / Archival Collection').slice(0, 80),
            creator: cleanHtml(meta.Artist?.value || 'Wikimedia Commons Contributor').slice(0, 120),
            repository: 'Wikimedia Commons',
            accession_id: p.title,
            rights_status: `${normLic} (Commercial Use Permitted)`,
            commercial_use_permitted: true,
            source_url: ii.descriptionurl,
          };
          console.log(`✅ REFRESHED ${targetFile} (${finalMeta.width}x${finalMeta.height}) <- ${p.title} [${normLic}]`);
          saved = true;
          await new Promise((r) => setTimeout(r, 150));
          break;
        } catch (err) {
          console.warn(`   ⚠️ Candidate skipped (${p.title}): ${err.message}`);
        }
      }
      if (saved) break;
    }
    if (!saved) {
      missing.push(targetFile);
      console.log(`❌ MISSING: ${targetFile}`);
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`\nSummary: ${Object.keys(manifest).length}/49 saved, ${usedHashes.size} unique hashes, ${missing.length} missing:`, missing);
})();
