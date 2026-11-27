/**
 * KS2 World War II & The Home Front ("The Suitcase on Platform Four")
 * IWM Archival Evidence Desk + Authentic 1939–1945 British Government Posters & Diagrams
 *
 * Zero childish clip-art or stick-figure SVGs: every stage pairs a full, uncropped
 * Imperial War Museums archival photograph or Ministry of Information diagram with
 * tactile 1940s inspection cards, blackout switches, and coupon stamps.
 */

function escapeAttr(str) {
  return String(str || '').replace(/"/g, '&quot;');
}

function renderEvidenceHeroPlate({ img, alt, badge, caption, statusPill = '' }) {
  return `
    <div class="ww2-desk-hero-frame">
      <img src="${img}" alt="${escapeAttr(alt)}" class="ww2-desk-hero-img" />
      <div class="ww2-desk-hero-bar">
        <span class="ww2-desk-hero-badge">📷 ${badge}</span>
        ${statusPill ? `<span class="ww2-desk-status-pill">${statusPill}</span>` : ''}
      </div>
    </div>
    <p class="ww2-desk-hero-caption">${caption}</p>
  `;
}

function renderArtifactTile({ img, alt, title, sub, dataAttr, hzKey, done = false, warn = false, stampText = '' }) {
  const cls = done ? 'is-found' : warn ? 'is-warn' : '';
  const stamp = stampText || (done ? '✓ RECORDED' : warn ? '✗ TOO HEAVY' : 'INSPECT');
  return `
    <button type="button" class="ww2-artifact-tile ${cls}" ${dataAttr} data-hz-key="${hzKey}">
      <div class="ww2-artifact-thumb">
        <img src="${img}" alt="${escapeAttr(alt || title)}" loading="lazy" />
      </div>
      <div class="ww2-artifact-copy">
        <div class="ww2-artifact-title">${title}</div>
        <div class="ww2-artifact-sub">${sub}</div>
      </div>
      <span class="ww2-artifact-stamp">${stamp}</span>
    </button>
  `;
}

/**
 * STAGE 1A (beat0:pack): Platform Four — IWM Photograph + 1939 Ministry Packing Desk
 */
export function renderPlatformEvidenceDeskHTML({
  packedItems = new Set(),
  gramophoneTried = false,
  stationExtrasFound = new Set(),
} = {}) {
  return `
    <div class="ww2-evidence-desk">
      ${renderEvidenceHeroPlate({
        img: '/units/ks2_ww2/assets/evacuees_railway_1939.jpg',
        alt: 'September 1939 photograph of British evacuee children carrying cardboard gas-mask boxes and small suitcases on a railway platform',
        badge: 'IWM Archive • Operation Pied Piper (1 Sept 1939)',
        caption: 'Over 1.5 million British children and mothers were evacuated from cities in three days—carrying only what one child could lift onto a train.',
        statusPill: `${packedItems.size}/4 Official Items Packed`,
      })}

      <div class="ww2-desk-section-label">🧳 Tap Real 1939 Artefacts &amp; Witness Clips on the Platform Desk:</div>
      <div class="ww2-artifact-grid">
        ${renderArtifactTile({
          img: '/units/ks2_ww2/assets/gas_mask_box_1939.jpg',
          title: 'Cardboard Gas-Mask Box',
          sub: 'Carried on a string over the shoulder everywhere',
          dataAttr: 'data-pack-item="gasmask"',
          hzKey: 'pack_gasmask',
          done: packedItems.has('gasmask'),
          stampText: packedItems.has('gasmask') ? '✓ PACKED' : 'PACK ITEM',
        })}
        ${renderArtifactTile({
          img: '/units/ks2_ww2/assets/evacuee_luggage_tag.jpg',
          title: 'Spare Jumper, Mug & Label',
          sub: 'Name tag pinned to coat + warm woollens & tin mug',
          dataAttr: 'data-pack-item="clothes_wash"',
          hzKey: 'pack_clothes_wash',
          done: packedItems.has('clothes_wash'),
          stampText: packedItems.has('clothes_wash') ? '✓ PACKED' : 'PACK ITEM',
        })}
        ${renderArtifactTile({
          img: '/units/ks2_ww2/assets/evacuation_poster_inf3_87_1939.jpg',
          title: 'Train Rations & Apple',
          sub: 'Sandwiches and an apple for the long steam journey',
          dataAttr: 'data-pack-item="sandwiches"',
          hzKey: 'pack_sandwiches',
          done: packedItems.has('sandwiches'),
          stampText: packedItems.has('sandwiches') ? '✓ PACKED' : 'PACK ITEM',
        })}
        ${renderArtifactTile({
          img: '/units/ks2_ww2/assets/evacuees_station_1940_hu36871.jpg',
          title: 'One Small Toy & Postcard',
          sub: 'A pocket keepsake and pre-addressed card for Mum',
          dataAttr: 'data-pack-item="teddy"',
          hzKey: 'pack_teddy',
          done: packedItems.has('teddy'),
          stampText: packedItems.has('teddy') ? '✓ PACKED' : 'PACK ITEM',
        })}
      </div>

      <div class="ww2-desk-witness-row">
        <button type="button" class="ww2-witness-btn ${gramophoneTried ? 'is-warn' : ''}" data-pack-item="gramophone" data-hz-key="pack_gramophone">
          📯 Test Decoy: Heavy Brass Gramophone ${gramophoneTried ? '✗' : ''}
        </button>
        <button type="button" class="ww2-witness-btn ${stationExtrasFound.has('guard') ? 'is-found' : ''}" data-b0-extra="guard" data-hz-key="b0_guard">
          🎙️ Hear Guard Mr Higgins ${stationExtrasFound.has('guard') ? '✓' : '🔊'}
        </button>
        <button type="button" class="ww2-witness-btn ${stationExtrasFound.has('carriage') ? 'is-found' : ''}" data-b0-extra="carriage" data-hz-key="b0_carriage">
          🚂 Evacuee Special Train ${stationExtrasFound.has('carriage') ? '✓' : '🔊'}
        </button>
      </div>
    </div>
  `;
}

/**
 * STAGE 2 (beat1): Country Billet & Kindertransport Archival Comparison Board
 */
export function renderCountryBilletDeskHTML({ billetSpotsFound = new Set() } = {}) {
  return `
    <div class="ww2-evidence-desk">
      ${renderEvidenceHeroPlate({
        img: '/units/ks2_ww2/assets/evacuee_feeding_farm_pigs_devon_1941.jpg',
        alt: '1941 archival photograph of British evacuee children helping feed pigs on a rural Devon farm',
        badge: 'IWM Archive • Rural Devon Farm Billet (1941)',
        caption: 'Compare British city evacuees billeted on countryside farms with nearly 10,000 Kindertransport refugee children escaping Nazi Europe alone.',
        statusPill: `${billetSpotsFound.size}/5 Evidence Files Inspected`,
      })}

      <div class="ww2-desk-section-label">📂 Inspect Paired Evacuation &amp; Kindertransport Primary Records:</div>
      <div class="ww2-artifact-grid">
        ${renderArtifactTile({
          img: '/units/ks2_ww2/assets/kindertransport_harwich_dec1938.jpg',
          title: 'Lotte from Prague (Kindertransport)',
          sub: 'Dec 1938–Sept 1939: Nearly 10,000 child refugees arrived alone',
          dataAttr: 'data-billet-spot="lotte"',
          hzKey: 'b1_lotte',
          done: billetSpotsFound.has('lotte'),
        })}
        ${renderArtifactTile({
          img: '/units/ks2_ww2/assets/kindertransport_hilfsverein_tag_pd.jpg',
          title: 'Kindertransport Numbered Tag #412',
          sub: 'One small suitcase allowed—families could not travel with them',
          dataAttr: 'data-billet-spot="lotte_case"',
          hzKey: 'b1_case',
          done: billetSpotsFound.has('lotte_case'),
        })}
        ${renderArtifactTile({
          img: '/units/ks2_ww2/assets/evacuees_devon_arrival.jpg',
          title: 'Farmer Mr Oakley’s Billeting Slip',
          sub: 'Country hosts received 10s 6d weekly from the government',
          dataAttr: 'data-billet-spot="farmer"',
          hzKey: 'b1_farmer',
          done: billetSpotsFound.has('farmer'),
        })}
        ${renderArtifactTile({
          img: '/units/ks2_ww2/assets/dig_for_victory_allotment_london_1942.jpg',
          title: 'Country Farmyard & Orchard',
          sub: 'Many city children saw cows, pigs, and orchards for the first time',
          dataAttr: 'data-billet-spot="orchard"',
          hzKey: 'b1_orchard',
          done: billetSpotsFound.has('orchard'),
        })}
      </div>

      <div class="ww2-desk-witness-row">
        <button type="button" class="ww2-witness-btn ${billetSpotsFound.has('horse') ? 'is-found' : ''}" data-billet-spot="horse" data-hz-key="b1_horse">
          🐴 Hear About Farm Life &amp; Shire Horses ${billetSpotsFound.has('horse') ? '✓' : '🔊'}
        </button>
      </div>
    </div>
  `;
}

/**
 * STAGE 3 (beat2): 1940 Blitz — Authentic IWM Shelter Photos + Official 1941 Morrison Cutaway + ARP Control Switchboard
 */
export function renderBlitzEvidenceDeskHTML({ blitzChecks = new Set(), blackoutShut = false } = {}) {
  return `
    <div class="ww2-evidence-desk ${blackoutShut ? 'is-blackout-sealed' : 'is-blackout-alert'}">
      <div class="ww2-paired-plates">
        <div class="ww2-paired-plate-card">
          <div class="ww2-paired-img-wrap">
            <img src="/units/ks2_ww2/assets/anderson_shelter_family.jpg" alt="1940 archival photograph of a British family outside their corrugated-steel garden Anderson shelter" />
          </div>
          <div class="ww2-paired-cap"><strong>Garden Anderson Shelter (1940):</strong> Curved steel buried under soil to absorb bomb blasts.</div>
        </div>
        <div class="ww2-paired-plate-card">
          <div class="ww2-paired-img-wrap">
            <img src="/units/ks2_ww2/assets/morrison_shelter_indoor_1941.jpg" alt="1941 Ministry of Information official technical cutaway drawing of an indoor steel-topped Morrison table shelter" />
          </div>
          <div class="ww2-paired-cap"><strong>Official 1941 Morrison Diagram:</strong> Indoor steel table-cage for city flats with no garden.</div>
        </div>
      </div>

      <div class="ww2-arp-switchboard">
        <div class="ww2-arp-switchboard-head">
          <span>🔦 ARP WARDEN’S 1940 NIGHT SAFETY SWITCHBOARD</span>
          <span class="ww2-arp-status-badge ${blackoutShut ? 'is-ok' : 'is-alert'}">
            ${blackoutShut ? '🔒 BLACKOUT SEALED' : '⚠️ LIGHT LEAKING!'}
          </span>
        </div>

        <div class="ww2-artifact-grid">
          ${renderArtifactTile({
            img: '/units/ks2_ww2/assets/blackout_kerb_precautions_london_1941.jpg',
            title: blackoutShut ? 'Blackout Blind Pulled Shut' : 'Pull Leaking Blackout Blind!',
            sub: 'Heavy black curtains hid city streets from night bombers',
            dataAttr: 'data-blitz-check="blackout"',
            hzKey: 'b2_blackout',
            done: blitzChecks.has('blackout'),
            stampText: blackoutShut ? '🔒 SEALED' : 'PULL SHUT',
          })}
          ${renderArtifactTile({
            img: '/units/ks2_ww2/assets/arp_warden_duty_1941.jpg',
            title: 'Crisscross Window Blast Tape',
            sub: 'Gummed paper strips reduced flying shattered glass',
            dataAttr: 'data-blitz-check="tape"',
            hzKey: 'b2_tape',
            done: blitzChecks.has('tape'),
            stampText: blitzChecks.has('tape') ? '✓ CHECKED' : 'INSPECT',
          })}
          ${renderArtifactTile({
            img: '/units/ks2_ww2/assets/blitz_bomb_damage_london_1940.jpg',
            title: 'Red Stirrup-Pump & Bucket',
            sub: 'Street fire-watchers doused incendiary sparks fast',
            dataAttr: 'data-blitz-check="stirrup"',
            hzKey: 'b2_stirrup',
            done: blitzChecks.has('stirrup'),
            stampText: blitzChecks.has('stirrup') ? '✓ READY' : 'INSPECT',
          })}
          ${renderArtifactTile({
            img: '/units/ks2_ww2/assets/tube_station_shelter_1940.jpg',
            title: 'Anderson & Underground Shelters',
            sub: 'Garden shelters, Morrison cages, and London Tube platforms',
            dataAttr: 'data-blitz-check="anderson"',
            hzKey: 'b2_anderson',
            done: blitzChecks.has('anderson'),
            stampText: blitzChecks.has('anderson') ? '✓ CHECKED' : 'INSPECT',
          })}
        </div>
      </div>
    </div>
  `;
}

/**
 * STAGE 4 (beat3): 1941 Village Grocer — IWM Photo + Ministry of Food Posters & Ration Stamp Cards
 */
export function renderRationEvidenceDeskHTML({
  rationBasket = new Set(),
  rationExtrasFound = new Set(),
} = {}) {
  return `
    <div class="ww2-evidence-desk">
      <div class="ww2-paired-plates">
        <div class="ww2-paired-plate-card">
          <div class="ww2-paired-img-wrap">
            <img src="/units/ks2_ww2/assets/housewife_ration_book_grocer_1941.jpg" alt="1941 Imperial War Museums photograph of a British shopper presenting her ration book to a village grocer" />
          </div>
          <div class="ww2-paired-cap"><strong>IWM 1941 Grocer Counter:</strong> Shoppers registered at one shop so scarce food was shared fairly.</div>
        </div>
        <div class="ww2-paired-plate-card">
          <div class="ww2-paired-img-wrap">
            <img src="/units/ks2_ww2/assets/dig_for_victory_poster.jpg" alt="Official British Ministry of Agriculture Dig for Victory wartime poster" />
          </div>
          <div class="ww2-paired-cap"><strong>Official Ministry Poster:</strong> Home-grown carrots &amp; potatoes stayed unrationed throughout the war.</div>
        </div>
      </div>

      <div class="ww2-desk-section-label">📔 Ministry of Food Counter — Stamp Each Weekly Adult Portion:</div>
      <div class="ww2-artifact-grid">
        ${renderArtifactTile({
          img: '/units/ks2_ww2/assets/ration_book_coupons_1940.jpg',
          title: '1 Single Fresh Egg / Week',
          sub: 'Supplemented by tins of American dried egg powder',
          dataAttr: 'data-ration-item="egg"',
          hzKey: 'rat_egg',
          done: rationBasket.has('egg'),
          stampText: rationBasket.has('egg') ? '✓ SNIPPED' : 'STAMP',
        })}
        ${renderArtifactTile({
          img: '/units/ks2_ww2/assets/ministry_of_food_wartime_guide_1941.jpg',
          title: '2oz Butter & 4oz Bacon',
          sub: 'Tiny weekly dairy and meat shares per ration book',
          dataAttr: 'data-ration-item="butter_bacon"',
          hzKey: 'rat_butter_bacon',
          done: rationBasket.has('butter_bacon'),
          stampText: rationBasket.has('butter_bacon') ? '✓ SNIPPED' : 'STAMP',
        })}
        ${renderArtifactTile({
          img: '/units/ks2_ww2/assets/atlantic_convoy_iwm_1943.jpg',
          title: '8oz Sugar & 2oz Tea',
          sub: 'Imported across U-boat-hunted Atlantic sea lanes',
          dataAttr: 'data-ration-item="sugar_tea"',
          hzKey: 'rat_sugar_tea',
          done: rationBasket.has('sugar_tea'),
          stampText: rationBasket.has('sugar_tea') ? '✓ SNIPPED' : 'STAMP',
        })}
        ${renderArtifactTile({
          img: '/units/ks2_ww2/assets/doctor_carrot_poster_1941.jpg',
          title: 'Carrots & Woolton Pie',
          sub: 'Home-grown allotment vegetables — ZERO coupons needed!',
          dataAttr: 'data-ration-item="woolton_veg"',
          hzKey: 'rat_woolton_veg',
          done: rationBasket.has('woolton_veg'),
          stampText: rationBasket.has('woolton_veg') ? '✓ UNRATIONED' : 'COLLECT',
        })}
      </div>

      <div class="ww2-desk-witness-row">
        <button type="button" class="ww2-witness-btn ${rationExtrasFound.has('wireless') ? 'is-found' : ''}" data-b3-extra="wireless" data-hz-key="b3_wireless">
          📻 BBC Kitchen Front Wireless ${rationExtrasFound.has('wireless') ? '✓' : '🔊'}
        </button>
        <button type="button" class="ww2-witness-btn ${rationExtrasFound.has('grocer') ? 'is-found' : ''}" data-b3-extra="grocer" data-hz-key="b3_grocer">
          🎙️ Hear Mrs Wilkins (Grocer) ${rationExtrasFound.has('grocer') ? '✓' : '🔊'}
        </button>
        <button type="button" class="ww2-witness-btn ${rationExtrasFound.has('book') ? 'is-found' : ''}" data-b3-extra="book" data-hz-key="b3_book">
          📔 Inspect Ration Book Rules ${rationExtrasFound.has('book') ? '✓' : '🔊'}
        </button>
      </div>
    </div>
  `;
}

/**
 * STAGE 5 (beat4): Bletchley Park Hut 8 — Real WRNS, Bombe & Enigma Rotor Archival Board
 */
export function renderBletchleyEvidenceDeskHTML({
  bletchleySpotsFound = new Set(),
  solvedCount = 0,
} = {}) {
  return `
    <div class="ww2-evidence-desk">
      ${renderEvidenceHeroPlate({
        img: '/units/ks2_ww2/assets/bletchley_park_wrens.jpg',
        alt: 'Wartime archival photograph of WRNS Wrens operating electromechanical Bombe codebreaking drums at Bletchley Park',
        badge: 'Bletchley Park Archive • WRNS Bombe Operators (Hut 8)',
        caption: 'Over 75% of Bletchley Park’s 10,000 staff were women—cracking naval Enigma ciphers to steer Atlantic food convoys past U-boats.',
        statusPill: `${solvedCount}/3 Cipher Steps Decoded`,
      })}

      <div class="ww2-desk-section-label">🔐 Top-Secret Hut 8 Archival Files (Click to Inspect &amp; Hear Briefings):</div>
      <div class="ww2-artifact-grid">
        ${renderArtifactTile({
          img: '/units/ks2_ww2/assets/bombe_bletchley_park.jpg',
          title: 'Turing-Welchman Bombe Drums',
          sub: 'Tested thousands of Enigma rotor settings automatically',
          dataAttr: 'data-bletchley-spot="bombe"',
          hzKey: 'b4_bombe',
          done: bletchleySpotsFound.has('bombe'),
        })}
        ${renderArtifactTile({
          img: '/units/ks2_ww2/assets/enigma_rotors_detail_bletchley.jpg',
          title: '6:00 AM Weather Crib & Rotors',
          sub: 'Daily predictable German forecasts exposed daily keys',
          dataAttr: 'data-bletchley-spot="cipher"',
          hzKey: 'b4_cipher',
          done: bletchleySpotsFound.has('cipher'),
        })}
        ${renderArtifactTile({
          img: '/units/ks2_ww2/assets/bletchley_park_hut_8_office.jpg',
          title: 'Leading Wren Miss Bennett',
          sub: 'Official Secrets Act kept Bletchley hidden until the 1970s',
          dataAttr: 'data-bletchley-spot="wren"',
          hzKey: 'b4_wren',
          done: bletchleySpotsFound.has('wren'),
        })}
        ${renderArtifactTile({
          img: '/units/ks2_ww2/assets/ve_day_street_party_1945.jpg',
          title: '8 May 1945: VE Day Dispatch',
          sub: 'Church bells rang across Britain when war in Europe ended',
          dataAttr: 'data-bletchley-spot="veday_door"',
          hzKey: 'b4_veday_door',
          done: bletchleySpotsFound.has('veday_door'),
        })}
      </div>
    </div>
  `;
}
