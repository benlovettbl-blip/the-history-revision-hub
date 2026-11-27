/**
 * scripts/fetch_ks2_crime_assets.cjs
 *
 * Queries Wikimedia Commons API for 100% commercially cleared (Public Domain / CC0 / CC BY / CC BY-SA)
 * historical plates for `ks2_crime_and_punishment`, renders the in-house Britain Crime & Punishment Map PNG,
 * downloads & sharp-normalizes all 44 assets into `public/units/ks2_crime_and_punishment/assets/` and
 * `units/ks2_crime_and_punishment/assets/`, and writes `scripts/ks2_crime_verified_assets.json`.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const PUB_DIR = path.join(ROOT, 'public', 'units', 'ks2_crime_and_punishment', 'assets');
const UNIT_DIR = path.join(ROOT, 'units', 'ks2_crime_and_punishment', 'assets');
fs.mkdirSync(PUB_DIR, { recursive: true });
fs.mkdirSync(UNIT_DIR, { recursive: true });

const SEARCH_PLAN = [
  ['banner_unit_hero.jpg', ['Old Bailey Central Criminal Court dome statue', 'Central Criminal Court Old Bailey London'], 1100],
  // L1 Roman
  ['roman_forum_basilica_law_court.jpg', ['Roman Forum Basilica Maxentius', 'Roman Forum ruins'], 800],
  ['roman_centurion_tombstone_britain.jpg', ['Colchester Marcus Favonius Facilis centurion', 'Roman soldier tombstone Britain', 'Roman legionary relief'], 800],
  ['aquae_sulis_great_roman_bath.jpg', ['Roman Baths in Bath Spa Great Bath', 'Great Bath Aquae Sulis'], 800],
  ['bath_roman_lead_curse_tablet.jpg', ['Bath curse tablet lead Roman', 'Roman curse tablet Bath'], 800],
  ['roman_bronze_steelyard_scales.jpg', ['Roman bronze scale balance museum', 'Roman steelyard bronze'], 800],
  ['caerleon_roman_amphitheatre_wales.jpg', ['Caerleon Roman amphitheatre', 'Chester Roman amphitheatre'], 800],
  // L2 Anglo-Saxon
  ['west_stow_anglo_saxon_village.jpg', ['West Stow Anglo Saxon Village', 'West Stow reconstructed hall'], 800],
  ['anglo_saxon_silver_pennies_hoard.jpg', ['Anglo-Saxon silver penny coin', 'King Alfred silver penny'], 800],
  ['anglo_saxon_escomb_stone_church.jpg', ['Escomb Saxon Church exterior', 'St Laurence Bradford on Avon Saxon church'], 800],
  ['anglo_saxon_law_code_manuscript.jpg', ['Textus Roffensis', 'Anglo-Saxon Chronicle manuscript page'], 800],
  ['medieval_horn_hue_and_cry.jpg', ['Hunter Blowing His Horn manuscript', 'Medieval ivory oliphant horn museum'], 800],
  ['trial_by_ordeal_medieval_manuscript.jpg', ['Ordeal by fire manuscript', 'Kunigunde ordeal ploughshares', 'Water ordeal engraving'], 800],
  // L3 Norman & Medieval
  ['new_forest_royal_deer_oaks.jpg', ['Fallow deer New Forest', 'Red deer Richmond Park oaks', 'New Forest ancient woodland deer'], 800],
  ['whaddon_folio_kings_bench_court.jpg', ['Whaddon King Bench', 'Court of King Bench medieval illumination', 'Medieval judge manuscript court'], 750],
  ['english_village_wooden_stocks.jpg', ['Stocks at Belstone', 'Village wooden stocks England'], 800],
  ['durham_cathedral_sanctuary_knocker.jpg', ['Sanctuary Knocker Durham Cathedral', 'Durham sanctuary knocker'], 800],
  ['magna_carta_1215_british_library.jpg', ['Magna Carta Cotton MS Augustus', 'Magna Carta 1215'], 800],
  ['medieval_wooden_pillory_engraving.jpg', ['Pillory print illustration', 'Man in pillory engraving'], 800],
  // L4 Tudor & Early Modern
  ['tudor_timber_street_england.jpg', ['Shambles York timber street', 'Little Moreton Hall Tudor', 'Lavenham Guildhall Tudor'], 800],
  ['tower_of_london_traitors_gate.jpg', ['Traitors Gate Tower of London', 'Tower of London watergate'], 800],
  ['medieval_tudor_ducking_stool.jpg', ['Leominster ducking stool Priory', 'Ducking stool engraving'], 750],
  ['tudor_vagrant_whipped_woodcut.jpg', ['Whipping post stocks England', 'Vagabond whipped woodcut', 'Holinshed woodcut'], 750],
  ['guy_fawkes_lantern_ashmolean.jpg', ['Guyfawkeslantern', 'Guy Fawkes lantern Ashmolean'], 800],
  ['matthew_hopkins_witches_1647_woodcut.jpg', ['Matthew Hopkins Discovery of Witches', 'Matthew Hopkins'], 800],
  // L5 Georgian Smugglers, Highwaymen & Bloody Code
  ['eighteenth_century_mail_stagecoach.jpg', ['Mail Coaches on the Road Louth London', 'Royal Mail coach painting'], 800],
  ['cornwall_smugglers_cove_coast.jpg', ['Polperro harbour Cornwall', 'Kynance Cove Cornwall'], 800],
  ['british_convict_prison_hulk_ship.jpg', ['Prison hulks Thames', 'HMS Warrior prison hulk', 'Discovery convict hulk Deptford'], 800],
  ['flintlock_highwayman_pistol.jpg', ['Flintlock Pistol MET DP163754', 'English flintlock pistol 18th century'], 800],
  ['newgate_prison_london_engraving.jpg', ['Engraving Of Newgate Prison', 'Newgate Prison facade'], 800],
  ['convict_leg_irons_transportation.jpg', ['Convict leg irons Port Arthur', 'Tasmanian convict uniform irons', 'Bill Thompson Tasmanian convict'], 800],
  // L6 Peelers, Victorian Prisons & Modern Forensics
  ['victorian_peeler_top_hat_bobby.jpg', ['Victorian policeman London', 'Metropolitan Police 19th century', 'Peeler policeman'], 750],
  ['pentonville_prison_interior_1842.jpg', ['Pentonville Prison London interior', 'Separate system prison cell', 'Newgate Prison exercise yard Dore'], 800],
  ['fingerprint_whorl_forensic_card.jpg', ['Fingerprint whorl ridge', 'Galton fingerprints 1892', 'Fingerprint arch loop whorl'], 750],
  ['victorian_police_rattle_truncheon.jpg', ['Police truncheon Victorian', 'Wooden police rattle', 'Bow Street truncheon'], 750],
  ['victorian_prison_treadwheel_engraving.jpg', ['Treadmill at Brixton Prison in London', 'Prison treadwheel'], 800],
  ['dna_forensic_laboratory_pipette.jpg', ['Laboratory micropipette DNA', 'Gel electrophoresis DNA', 'Forensic laboratory scientist'], 800],
  // 6 Key Individuals
  ['ki_alfred_the_great.jpg', ['Statue alfred the great winchester'], 800],
  ['ki_henry_ii.jpg', ['Henry II Fontevraud effigy', 'Abbaye de Fontevraud Les gisants'], 800],
  ['ki_guy_fawkes_conspirators.jpg', ['Gunpowder Plot Conspirators 1605 Crispijn van de Passe'], 800],
  ['ki_elizabeth_fry.jpg', ['Portrait of Elizabeth Fry Wellcome', 'Elizabeth Fry engraving'], 800],
  ['ki_robert_peel.jpg', ['Robert peel beskuret', 'Sir Robert Peel Lawrence'], 800],
  ['ki_alec_jeffreys.jpg', ['Alec Jeffreys'], 800],
];

function getJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent': 'TheHistoryRevisionHub/1.0 (https://historyrevisionhub.co.uk; contact@historyrevisionhub.co.uk)',
          },
        },
        (res) => {
          let d = '';
          res.on('data', (c) => (d += c));
          res.on('end', () => {
            try {
              resolve(JSON.parse(d));
            } catch (e) {
              reject(e);
            }
          });
        },
      )
      .on('error', reject);
  });
}

function downloadBuffer(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('Too many redirects'));
    https
      .get(
        url,
        {
          headers: {
            'User-Agent': 'TheHistoryRevisionHub/1.0 (https://historyrevisionhub.co.uk; contact@historyrevisionhub.co.uk)',
          },
        },
        (res) => {
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
        },
      )
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
      <stop offset="0%" stop-color="#f7fee7"/>
      <stop offset="100%" stop-color="#ecfccb"/>
    </linearGradient>
  </defs>
  <rect width="1400" height="980" fill="url(#sea)"/>
  <rect x="28" y="24" width="1344" height="86" rx="12" fill="#0f172a"/>
  <text x="54" y="62" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#ffffff">Crime and Punishment Across Britain (AD 43 – Present)</text>
  <text x="54" y="92" font-family="Arial, sans-serif" font-size="17" fill="#7dd3fc">Seven Landmark Sites Across 2,000 Years of Law, Courts, Policing and Forensics</text>

  <path d="M 470,150 L 560,145 L 610,185 L 580,235 L 635,275 L 620,335 L 680,395 L 725,470 L 765,545 L 825,585 L 835,645 L 785,685 L 835,730 L 805,780 L 710,805 L 620,820 L 535,845 L 445,875 L 395,855 L 455,805 L 515,785 L 540,740 L 470,725 L 430,685 L 490,635 L 435,595 L 465,540 L 525,525 L 535,465 L 480,425 L 505,365 L 455,310 L 480,235 Z"
        fill="url(#land)" stroke="#4d7c0f" stroke-width="4" stroke-linejoin="round"/>

  <circle cx="120" cy="210" r="44" fill="#ffffff" fill-opacity="0.92" stroke="#0f172a" stroke-width="2.5"/>
  <polygon points="120,172 130,210 120,202 110,210" fill="#dc2626"/>
  <polygon points="120,248 130,210 120,218 110,210" fill="#334155"/>
  <text x="120" y="160" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0f172a">N</text>

  <circle cx="655" cy="385" r="12" fill="#b91c1c" stroke="#ffffff" stroke-width="3"/>
  <line x1="667" y1="385" x2="860" y2="238" stroke="#b91c1c" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="860" y="192" width="490" height="84" rx="10" fill="#ffffff" stroke="#b91c1c" stroke-width="2.5"/>
  <text x="878" y="222" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#991b1b">1. Durham Cathedral (Medieval Sanctuary)</text>
  <text x="878" y="247" font-family="Arial, sans-serif" font-size="15" fill="#334155">Fugitives striking the bronze Sanctuary Knocker</text>
  <text x="878" y="267" font-family="Arial, sans-serif" font-size="15" fill="#334155">claimed 37 days of church safety before trial or exile.</text>

  <circle cx="685" cy="585" r="12" fill="#0284c7" stroke="#ffffff" stroke-width="3"/>
  <line x1="697" y1="585" x2="860" y2="342" stroke="#0284c7" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="860" y="298" width="490" height="84" rx="10" fill="#ffffff" stroke="#0284c7" stroke-width="2.5"/>
  <text x="878" y="328" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#0369a1">2. Leicester (1984 DNA Profiling Breakthrough)</text>
  <text x="878" y="353" font-family="Arial, sans-serif" font-size="15" fill="#334155">Sir Alec Jeffreys discovered genetic DNA fingerprinting</text>
  <text x="878" y="373" font-family="Arial, sans-serif" font-size="15" fill="#334155">at Leicester University, transforming modern policing.</text>

  <circle cx="805" cy="625" r="12" fill="#7c3aed" stroke="#ffffff" stroke-width="3"/>
  <line x1="817" y1="625" x2="860" y2="448" stroke="#7c3aed" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="860" y="404" width="490" height="84" rx="10" fill="#ffffff" stroke="#7c3aed" stroke-width="2.5"/>
  <text x="878" y="434" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#6d28d9">3. East Anglia (1645–1647 Witchcraft Trials)</text>
  <text x="878" y="459" font-family="Arial, sans-serif" font-size="15" fill="#334155">During Civil War panic, Matthew Hopkins questioned</text>
  <text x="878" y="479" font-family="Arial, sans-serif" font-size="15" fill="#334155">suspects across Essex and Suffolk before science grew.</text>

  <circle cx="745" cy="720" r="13" fill="#0f172a" stroke="#facc15" stroke-width="3.5"/>
  <line x1="758" y1="720" x2="860" y2="556" stroke="#0f172a" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="860" y="510" width="490" height="90" rx="10" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
  <text x="878" y="540" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#0f172a">4. London: Tower, Newgate and 1829 Peelers</text>
  <text x="878" y="565" font-family="Arial, sans-serif" font-size="15" fill="#334155">Home to the Tower of London, Elizabeth Fry’s Newgate</text>
  <text x="878" y="585" font-family="Arial, sans-serif" font-size="15" fill="#334155">reforms, and Sir Robert Peel’s 1829 Metropolitan Police.</text>

  <circle cx="705" cy="735" r="11" fill="#b45309" stroke="#ffffff" stroke-width="3"/>
  <line x1="715" y1="742" x2="860" y2="668" stroke="#b45309" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="860" y="622" width="490" height="84" rx="10" fill="#ffffff" stroke="#b45309" stroke-width="2.5"/>
  <text x="878" y="652" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#92400e">5. Runnymede (1215 Magna Carta and Fair Trial)</text>
  <text x="878" y="677" font-family="Arial, sans-serif" font-size="15" fill="#334155">King John sealed Magna Carta beside the River Thames,</text>
  <text x="878" y="697" font-family="Arial, sans-serif" font-size="15" fill="#334155">promising no free person could be jailed without lawful trial.</text>

  <circle cx="565" cy="735" r="12" fill="#059669" stroke="#ffffff" stroke-width="3"/>
  <line x1="553" y1="735" x2="395" y2="545" stroke="#059669" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="35" y="485" width="390" height="90" rx="10" fill="#ffffff" stroke="#059669" stroke-width="2.5"/>
  <text x="52" y="515" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#065f46">6. Aquae Sulis / Bath (Roman Britain)</text>
  <text x="52" y="540" font-family="Arial, sans-serif" font-size="15" fill="#334155">Over 130 scratched Roman lead curse tablets</text>
  <text x="52" y="560" font-family="Arial, sans-serif" font-size="15" fill="#334155">begged goddess Sulis Minerva to catch cloak thieves!</text>

  <circle cx="635" cy="795" r="12" fill="#ea580c" stroke="#ffffff" stroke-width="3"/>
  <line x1="623" y1="795" x2="425" y2="680" stroke="#ea580c" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="35" y="630" width="390" height="90" rx="10" fill="#ffffff" stroke="#ea580c" stroke-width="2.5"/>
  <text x="52" y="660" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#9a3412">7. New Forest and Smugglers’ Coasts</text>
  <text x="52" y="685" font-family="Arial, sans-serif" font-size="15" fill="#334155">Norman Forest Laws protected royal deer (1079);</text>
  <text x="52" y="705" font-family="Arial, sans-serif" font-size="15" fill="#334155">18th-century smugglers landed untaxed tea nearby.</text>

  <rect x="28" y="905" width="1344" height="50" rx="10" fill="#1e293b"/>
  <text x="700" y="936" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#f8fafc">Roman Courts (AD 43)  →  Saxon Wergild  →  Medieval Juries  →  Bloody Code  →  1829 Peelers  →  DNA Forensics</text>
</svg>`;

  const p1 = path.join(PUB_DIR, 'crime_punishment_britain_map_ks2.png');
  await sharp(Buffer.from(svg)).png().toFile(p1);
  fs.copyFileSync(p1, path.join(UNIT_DIR, 'crime_punishment_britain_map_ks2.png'));
}

(async () => {
  await renderInHouseMap();
  const manifest = {
    'crime_punishment_britain_map_ks2.png': {
      title: 'Map of Crime and Punishment Landmarks Across Britain (AD 43–Present)',
      date: '2026 (Historical Map: AD 43–Present)',
      creator: 'The History Revision Hub Cartography Studio',
      repository: 'The History Revision Hub Original Digital Cartography',
      accession_id: 'HRH-MAP-KS2-CRIME-01',
      rights_status: 'Original In-House Studio Creation — 100% Commercial Copyright Cleared',
      commercial_use_permitted: true,
      source_url: 'https://historyrevisionhub.co.uk',
    },
  };

  const usedCommonsTitles = new Set();
  const missing = [];

  for (const [targetFile, qList, minW] of SEARCH_PLAN) {
    let found = null;
    for (const q of qList) {
      const apiUrl =
        'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=' +
        encodeURIComponent(q + ' filetype:bitmap') +
        '&gsrlimit=12&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1450&format=json';
      const data = await getJson(apiUrl);
      const pages = Object.values(data.query?.pages || {});
      for (const p of pages) {
        if (usedCommonsTitles.has(p.title)) continue;
        if (/\.(svg|pdf|tif|tiff|gif|webm|ogv|xcf)$/i.test(p.title)) continue;
        const ii = p.imageinfo?.[0];
        if (!ii || ii.width < minW) continue;
        const meta = ii.extmetadata || {};
        const lic = (meta.LicenseShortName?.value || '').trim();
        const nonFree = /NC|NonCommercial|ND|NoDerivs|Fair use|Copyrighted/i.test(lic);
        const okLic = /^(Public domain|CC0|CC BY|CC-BY|CC BY-SA|CC-BY-SA|OGL)/i.test(lic) && !nonFree;
        if (!okLic) continue;
        found = {
          commonsTitle: p.title,
          width: ii.width,
          height: ii.height,
          downloadUrl: ii.thumburl || ii.url,
          pageUrl: ii.descriptionurl,
          license: lic,
          artist: (meta.Artist?.value || 'Wikimedia Commons Contributor')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 120),
          date: (meta.DateTimeOriginal?.value || meta.DateTime?.value || 'Historical / Museum Collection')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 80),
        };
        break;
      }
      if (found) break;
    }

    if (!found) {
      missing.push(targetFile);
      console.log(`❌ MISSING: ${targetFile}`);
      continue;
    }

    usedCommonsTitles.add(found.commonsTitle);
    try {
      const buf = await downloadBuffer(found.downloadUrl);
      const outPath = path.join(PUB_DIR, targetFile);
      await sharp(buf)
        .flatten({ background: '#ffffff' })
        .resize({ width: 1400, withoutEnlargement: true })
        .toColorspace('srgb')
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(outPath);
      fs.copyFileSync(outPath, path.join(UNIT_DIR, targetFile));
      manifest[targetFile] = {
        title: found.commonsTitle.replace(/^File:/, '').replace(/\.[^.]+$/, ''),
        date: found.date,
        creator: found.artist || 'Wikimedia Commons Contributor',
        repository: 'Wikimedia Commons',
        accession_id: found.commonsTitle,
        rights_status: `${found.license} (Commercial Use Permitted)`,
        commercial_use_permitted: true,
        source_url: found.pageUrl,
      };
      console.log(`✅ ${targetFile} <- ${found.commonsTitle} [${found.license}]`);
      await new Promise((r) => setTimeout(r, 250));
    } catch (err) {
      missing.push(targetFile);
      console.error(`❌ Failed downloading ${targetFile}: ${err.message}`);
    }
  }

  fs.writeFileSync(
    path.join(ROOT, 'scripts', 'ks2_crime_verified_assets.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );
  if (fs.existsSync(path.join(ROOT, 'temp_crime_commons_candidates.json'))) {
    fs.unlinkSync(path.join(ROOT, 'temp_crime_commons_candidates.json'));
  }
  console.log(`\nSummary: ${Object.keys(manifest).length} saved, ${missing.length} missing:`, missing);
})();
