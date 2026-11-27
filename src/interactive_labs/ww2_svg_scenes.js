/**
 * KS2 World War II & The Home Front ("The Suitcase on Platform Four")
 * Custom 16:9 Vector Cutaway & Interactive Artefact Scenes (100% Original Hub IP — Zero AI Images)
 * Paired with Framed Imperial War Museums (IWM) Archival Evidence Cards.
 */

function ww2PillSVG(x, y, label, found = false, warn = false) {
  const w = Math.max(92, Math.round(label.length * 6.7 + 26));
  const half = Math.round(w / 2);
  const bg = found ? 'rgba(20, 83, 45, 0.94)' : warn ? 'rgba(127, 29, 29, 0.92)' : 'rgba(15, 23, 42, 0.92)';
  const stroke = found ? '#4ade80' : warn ? '#f87171' : '#fbbf24';
  const textCol = found ? '#dcfce7' : warn ? '#fee2e2' : '#fef3c7';
  const prefix = found ? '✓ ' : warn ? '✗ ' : '';
  return `
    <g class="ww2-svg-pill" transform="translate(${x}, ${y})">
      <rect x="${-half}" y="-13" width="${w}" height="24" rx="12" fill="${bg}" stroke="${stroke}" stroke-width="2" />
      <text x="0" y="3" text-anchor="middle" fill="${textCol}" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="800">${prefix}${label}</text>
    </g>
  `;
}

export function renderWw2ArchivalCardHTML({ img, kicker, caption, alt }) {
  return `
    <div class="ww2-archival-card">
      <div class="ww2-archival-thumb-wrap">
        <img src="${img}" alt="${alt || kicker}" class="archival-image ww2-archival-thumb" loading="lazy" />
      </div>
      <div>
        <div class="ww2-archival-kicker">📷 ${kicker}</div>
        <p class="ww2-archival-caption">${caption}</p>
      </div>
    </div>
  `;
}

/**
 * STAGE 1A (beat0:pack): Platform Four Trolley & Open 1939 Evacuee Suitcase
 */
export function renderPlatformTrolleySVG({
  packedItems = new Set(),
  gramophoneTried = false,
  stationExtrasFound = new Set(),
} = {}) {
  return `
    <svg viewBox="0 0 800 450" class="ww2-vector-scene" role="img" aria-label="1939 Platform Four luggage trolley showing an open evacuee suitcase with cardboard gas-mask box, spare jumper and mug, sandwiches and apple, teddy bear, and a heavy brass gramophone beside Railway Guard Higgins">
      <!-- Railway canopy & crimson steam train carriages -->
      <rect x="0" y="0" width="800" height="270" fill="#1e293b" />
      <rect x="0" y="68" width="800" height="158" fill="#7f1d1d" stroke="#fbbf24" stroke-width="3" />
      <rect x="0" y="226" width="800" height="224" fill="#334155" />

      <!-- Train Carriage Windows -->
      <g class="ww2-svg-hit ${stationExtrasFound.has('carriage') ? 'is-found' : ''}" data-b0-extra="carriage" data-hz-key="b0_carriage" tabindex="0" role="button" aria-label="Check 1939 Operation Pied Piper train carriages">
        <rect x="260" y="92" width="110" height="74" rx="6" fill="#bae6fd" stroke="#fde68a" stroke-width="2.5" />
        <rect x="396" y="92" width="110" height="74" rx="6" fill="#bae6fd" stroke="#fde68a" stroke-width="2.5" />
        <rect x="532" y="92" width="110" height="74" rx="6" fill="#bae6fd" stroke="#fde68a" stroke-width="2.5" />
        <rect x="382" y="176" width="138" height="24" rx="4" fill="#fef3c7" stroke="#78350f" stroke-width="1.5" />
        <text x="451" y="192" text-anchor="middle" fill="#7c2d12" font-size="11" font-weight="900">EVACUEE SPECIAL • 1939</text>
      </g>

      <!-- Railway Guard Mr Higgins (Left) -->
      <g class="ww2-svg-hit ${stationExtrasFound.has('guard') ? 'is-found' : ''}" data-b0-extra="guard" data-hz-key="b0_guard" tabindex="0" role="button" aria-label="Speak with Railway Guard Mr Higgins">
        <path d="M68 378 L80 232 Q116 220 152 232 L164 378 Z" fill="#0f172a" stroke="#93c5fd" stroke-width="2" />
        <circle cx="116" cy="204" r="22" fill="#fed7aa" stroke="#78350f" stroke-width="2" />
        <rect x="90" y="178" width="52" height="14" rx="4" fill="#1e3a8a" stroke="#fbbf24" stroke-width="2" />
        <polygon points="154,288 192,268 192,306" fill="#16a34a" stroke="#fef08a" stroke-width="1.8" />
        ${ww2PillSVG(118, 402, 'Guard Higgins', stationExtrasFound.has('guard'))}
      </g>

      <!-- Wooden Platform Trolley & Open Leather Suitcase -->
      <rect x="215" y="346" width="540" height="22" rx="5" fill="#78350f" stroke="#d97706" stroke-width="2" />
      <circle cx="275" cy="396" r="26" fill="#1e293b" stroke="#94a3b8" stroke-width="5" />
      <circle cx="685" cy="396" r="26" fill="#1e293b" stroke="#94a3b8" stroke-width="5" />
      <!-- Open Suitcase Base & Lid -->
      <rect x="234" y="218" width="356" height="128" rx="10" fill="#92400e" stroke="#fde68a" stroke-width="3" />
      <rect x="246" y="228" width="332" height="108" rx="6" fill="#fef3c7" opacity="0.18" />

      <!-- ITEM 1: Cardboard Gas-Mask Box -->
      <g class="ww2-svg-hit ${packedItems.has('gasmask') ? 'is-found' : ''}" data-pack-item="gasmask" data-hz-key="pack_gasmask" tabindex="0" role="button" aria-label="Pack cardboard gas-mask box">
        <rect x="264" y="250" width="70" height="62" rx="5" fill="#a16207" stroke="#fef08a" stroke-width="2.5" />
        <path d="M268 250 Q299 218 330 250" fill="none" stroke="#e2e8f0" stroke-width="3" />
        <text x="299" y="285" text-anchor="middle" fill="#fef9c3" font-size="10.5" font-weight="900">GAS MASK</text>
        ${ww2PillSVG(299, 332, 'Gas-Mask Box', packedItems.has('gasmask'))}
      </g>

      <!-- ITEM 2: Rolled Jumper, Toothbrush & Tin Mug -->
      <g class="ww2-svg-hit ${packedItems.has('clothes_wash') ? 'is-found' : ''}" data-pack-item="clothes_wash" data-hz-key="pack_clothes_wash" tabindex="0" role="button" aria-label="Pack spare jumper, toothbrush, and tin mug">
        <rect x="358" y="246" width="76" height="44" rx="12" fill="#2563eb" stroke="#bfdbfe" stroke-width="2.2" />
        <rect x="412" y="266" width="24" height="28" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="2" />
        ${ww2PillSVG(398, 232, 'Jumper & Mug', packedItems.has('clothes_wash'))}
      </g>

      <!-- ITEM 3: Sandwiches & Red Apple -->
      <g class="ww2-svg-hit ${packedItems.has('sandwiches') ? 'is-found' : ''}" data-pack-item="sandwiches" data-hz-key="pack_sandwiches" tabindex="0" role="button" aria-label="Pack packet of sandwiches and apple">
        <rect x="366" y="296" width="62" height="32" rx="5" fill="#fde68a" stroke="#b45309" stroke-width="2" />
        <circle cx="442" cy="312" r="13" fill="#dc2626" stroke="#fecaca" stroke-width="1.8" />
        ${ww2PillSVG(412, 356, 'Lunch & Apple', packedItems.has('sandwiches'))}
      </g>

      <!-- ITEM 4: Small Teddy & Postcard -->
      <g class="ww2-svg-hit ${packedItems.has('teddy') ? 'is-found' : ''}" data-pack-item="teddy" data-hz-key="pack_teddy" tabindex="0" role="button" aria-label="Pack one small teddy and postcard for Mum">
        <circle cx="520" cy="264" r="16" fill="#b45309" stroke="#fde68a" stroke-width="2" />
        <circle cx="507" cy="251" r="6" fill="#b45309" /><circle cx="533" cy="251" r="6" fill="#b45309" />
        <ellipse cx="520" cy="294" rx="18" ry="20" fill="#b45309" stroke="#fde68a" stroke-width="2" />
        <rect x="540" y="286" width="32" height="22" rx="3" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" />
        ${ww2PillSVG(526, 332, 'Teddy & Postcard', packedItems.has('teddy'))}
      </g>

      <!-- DECOY ITEM: Heavy Brass Horn Gramophone (Too Heavy!) -->
      <g class="ww2-svg-hit ${gramophoneTried ? 'is-found' : ''}" data-pack-item="gramophone" data-hz-key="pack_gramophone" tabindex="0" role="button" aria-label="Inspect heavy brass gramophone on trolley">
        <rect x="628" y="298" width="92" height="48" rx="6" fill="#5c3a21" stroke="#fbbf24" stroke-width="2" />
        <polygon points="668,292 626,216 718,204 686,292" fill="#eab308" stroke="#fef08a" stroke-width="2.5" />
        ${ww2PillSVG(674, 366, 'Heavy Gramophone', false, gramophoneTried)}
      </g>

      <rect x="14" y="12" width="360" height="28" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke="#f59e0b" stroke-width="1.5" />
      <text x="26" y="30" fill="#fde68a" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="800">Platform Four Trolley • Pack All 4 Official Items!</text>
    </svg>
  `;
}

/**
 * STAGE 2 (beat1): Meadowbrook Farm Gate — British Evacuees & Kindertransport Refugee Lotte
 */
export function renderCountryBilletSVG({ billetSpotsFound = new Set() } = {}) {
  return `
    <svg viewBox="0 0 800 450" class="ww2-vector-scene" role="img" aria-label="1939 Devon country farmyard showing Shire horse, Farmer Mr Oakley, apple orchard, Kindertransport refugee Lotte from Prague, and her numbered suitcase">
      <rect x="0" y="0" width="800" height="215" fill="#1d4ed8" />
      <path d="M0 190 Q240 135 500 175 T800 155 L800 450 L0 450 Z" fill="#15803d" />
      <path d="M0 320 L800 305 L800 450 L0 450 Z" fill="#4d7c0f" />

      <!-- Orchard & Stone Barn -->
      <g class="ww2-svg-hit ${billetSpotsFound.has('orchard') ? 'is-found' : ''}" data-billet-spot="orchard" data-hz-key="b1_orchard" tabindex="0" role="button" aria-label="Inspect farmhouse barn and apple orchard">
        <rect x="440" y="114" width="136" height="72" fill="#b45309" stroke="#fef3c7" stroke-width="2" />
        <polygon points="430,114 508,74 586,114" fill="#991b1b" stroke="#fef3c7" stroke-width="2" />
        <circle cx="645" cy="128" r="36" fill="#166534" stroke="#86efac" stroke-width="2" />
        <circle cx="635" cy="122" r="5" fill="#ef4444" /><circle cx="658" cy="134" r="5" fill="#ef4444" />
        ${ww2PillSVG(535, 198, 'Farm Barn & Orchard', billetSpotsFound.has('orchard'))}
      </g>

      <!-- Shire Horse -->
      <g class="ww2-svg-hit ${billetSpotsFound.has('horse') ? 'is-found' : ''}" data-billet-spot="horse" data-hz-key="b1_horse" tabindex="0" role="button" aria-label="Inspect friendly farm Shire horse">
        <ellipse cx="145" cy="292" rx="54" ry="30" fill="#78350f" stroke="#fde68a" stroke-width="2" />
        <path d="M182 276 L208 228 L228 242 L198 292 Z" fill="#78350f" stroke="#fde68a" stroke-width="2" />
        <line x1="108" y1="318" x2="108" y2="378" stroke="#451a03" stroke-width="9" />
        <line x1="176" y1="318" x2="176" y2="378" stroke="#451a03" stroke-width="9" />
        ${ww2PillSVG(148, 398, 'Farm Shire Horse', billetSpotsFound.has('horse'))}
      </g>

      <!-- Farmer Mr Oakley -->
      <g class="ww2-svg-hit ${billetSpotsFound.has('farmer') ? 'is-found' : ''}" data-billet-spot="farmer" data-hz-key="b1_farmer" tabindex="0" role="button" aria-label="Speak with Farmer Mr Oakley">
        <path d="M312 378 L324 246 Q356 234 388 246 L400 378 Z" fill="#365314" stroke="#bef264" stroke-width="2" />
        <circle cx="356" cy="218" r="21" fill="#fed7aa" stroke="#78350f" stroke-width="2" />
        <ellipse cx="356" cy="198" rx="28" ry="8" fill="#854d0e" />
        ${ww2PillSVG(356, 400, 'Farmer Oakley', billetSpotsFound.has('farmer'))}
      </g>

      <!-- Lotte from Prague (Kindertransport) -->
      <g class="ww2-svg-hit ${billetSpotsFound.has('lotte') ? 'is-found' : ''}" data-billet-spot="lotte" data-hz-key="b1_lotte" tabindex="0" role="button" aria-label="Speak with Lotte, Kindertransport refugee from Prague">
        <path d="M518 378 L530 264 Q558 254 586 264 L598 378 Z" fill="#1e3a8a" stroke="#bfdbfe" stroke-width="2" />
        <circle cx="558" cy="238" r="19" fill="#fed7aa" stroke="#78350f" stroke-width="2" />
        <rect x="542" y="284" width="32" height="20" rx="3" fill="#fef3c7" stroke="#b45309" stroke-width="1.5" />
        <text x="558" y="298" text-anchor="middle" fill="#7c2d12" font-size="9.5" font-weight="900">#412</text>
        ${ww2PillSVG(554, 400, 'Lotte (Prague Refugee)', billetSpotsFound.has('lotte'))}
      </g>

      <!-- Lotte's Single Suitcase -->
      <g class="ww2-svg-hit ${billetSpotsFound.has('lotte_case') ? 'is-found' : ''}" data-billet-spot="lotte_case" data-hz-key="b1_case" tabindex="0" role="button" aria-label="Inspect Lotte's single Kindertransport suitcase">
        <rect x="662" y="324" width="92" height="58" rx="7" fill="#7c2d12" stroke="#fde047" stroke-width="2.5" />
        <rect x="684" y="340" width="48" height="22" rx="3" fill="#fef3c7" />
        <text x="708" y="355" text-anchor="middle" fill="#7c2d12" font-size="9.5" font-weight="900">PRAGUE</text>
        ${ww2PillSVG(708, 302, 'Kindertransport Case', billetSpotsFound.has('lotte_case'))}
      </g>

      <rect x="14" y="12" width="376" height="28" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke="#f59e0b" stroke-width="1.5" />
      <text x="26" y="30" fill="#fde68a" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="800">Meadowbrook Farm (1939) • Two Very Different Suitcases</text>
    </svg>
  `;
}

/**
 * STAGE 3 (beat2): Sept 1940 Blitz Night Garden & House Cutaway (Dynamic Blackout Curtain!)
 */
export function renderBlitzGardenCutawaySVG({ blitzChecks = new Set() } = {}) {
  const blackoutShut = blitzChecks.has('blackout');
  const tapeDone = blitzChecks.has('tape');
  const stirrupDone = blitzChecks.has('stirrup');
  const andersonDone = blitzChecks.has('anderson');

  return `
    <svg viewBox="0 0 800 450" class="ww2-vector-scene" role="img" aria-label="1940 Blitz night garden cutaway showing terraced brick house with blackout curtain, crisscross window tape, red ARP stirrup-pump, and earth-covered corrugated-steel Anderson garden shelter">
      <!-- Night sky & searchlight beams -->
      <rect x="0" y="0" width="800" height="310" fill="#090d1a" />
      <polygon points="430,310 560,0 635,0 475,310" fill="#fef08a" opacity="0.12" />
      <polygon points="640,310 470,0 535,0 685,310" fill="#bae6fd" opacity="0.1" />
      <rect x="0" y="305" width="800" height="145" fill="#143322" />

      <!-- Brick Terrace House (Left) -->
      <rect x="46" y="88" width="290" height="248" fill="#7c2d12" stroke="#94a3b8" stroke-width="2.5" />
      <polygon points="34,88 191,26 348,88" fill="#334155" stroke="#94a3b8" stroke-width="2.5" />

      <!-- CHECK 1: Upstairs Blackout Curtain Window (Closes Dynamically!) -->
      <g class="ww2-svg-hit ${blackoutShut ? 'is-found' : ''}" data-blitz-check="blackout" data-hz-key="b2_blackout" tabindex="0" role="button" aria-label="Pull the leaking blackout curtain shut">
        <rect x="92" y="114" width="96" height="76" rx="4" fill="${blackoutShut ? '#0f172a' : '#fde047'}" stroke="#f8fafc" stroke-width="3" />
        ${
          blackoutShut
            ? `<rect x="96" y="118" width="88" height="68" fill="#1e293b" />
               <line x1="140" y1="118" x2="140" y2="186" stroke="#475569" stroke-width="2" />`
            : `<rect x="96" y="118" width="34" height="68" fill="#1e293b" />
               <rect x="154" y="118" width="30" height="68" fill="#1e293b" />
               <polygon points="130,190 95,255 185,255 154,190" fill="#fde047" opacity="0.28" />`
        }
        ${ww2PillSVG(140, 208, blackoutShut ? 'Blackout Sealed' : 'Shut Leaking Curtain!', blackoutShut)}
      </g>

      <!-- CHECK 2: Ground-Floor Crisscross Sticky Tape Window -->
      <g class="ww2-svg-hit ${tapeDone ? 'is-found' : ''}" data-blitz-check="tape" data-hz-key="b2_tape" tabindex="0" role="button" aria-label="Check crisscross blast-proof sticky tape on glass panes">
        <rect x="212" y="114" width="96" height="76" rx="4" fill="#1e293b" stroke="#f8fafc" stroke-width="3" />
        <line x1="216" y1="118" x2="304" y2="186" stroke="#fde68a" stroke-width="4" />
        <line x1="304" y1="118" x2="216" y2="186" stroke="#fde68a" stroke-width="4" />
        <line x1="260" y1="114" x2="260" y2="190" stroke="#f8fafc" stroke-width="2.5" />
        ${ww2PillSVG(260, 236, 'Crisscross Glass Tape', tapeDone)}
      </g>

      <!-- CHECK 3: Red Garden Stirrup-Pump & Water Bucket -->
      <g class="ww2-svg-hit ${stirrupDone ? 'is-found' : ''}" data-blitz-check="stirrup" data-hz-key="b2_stirrup" tabindex="0" role="button" aria-label="Check red ARP stirrup-pump and water bucket">
        <polygon points="348,322 396,322 388,372 356,372" fill="#94a3b8" stroke="#f8fafc" stroke-width="2" />
        <rect x="408" y="294" width="12" height="78" rx="3" fill="#dc2626" stroke="#fecaca" stroke-width="2" />
        <line x1="396" y1="294" x2="432" y2="294" stroke="#fde047" stroke-width="4" />
        <path d="M414 356 Q392 340 374 328" fill="none" stroke="#f87171" stroke-width="3" />
        ${ww2PillSVG(390, 398, 'Red Stirrup-Pump', stirrupDone)}
      </g>

      <!-- CHECK 4: Half-Buried Earth & Corrugated-Steel Anderson Shelter -->
      <g class="ww2-svg-hit ${andersonDone ? 'is-found' : ''}" data-blitz-check="anderson" data-hz-key="b2_anderson" tabindex="0" role="button" aria-label="Inspect earth-covered corrugated-steel Anderson shelter">
        <!-- Soil bank mound -->
        <path d="M476 346 Q620 156 768 346 Z" fill="#3f6212" stroke="#86efac" stroke-width="2.5" />
        <!-- Corrugated curved steel arch entrance -->
        <path d="M548 356 L548 258 A62 62 0 0 1 672 258 L672 356 Z" fill="#64748b" stroke="#e2e8f0" stroke-width="4" />
        <path d="M566 356 L566 266 A44 44 0 0 1 654 266 L654 356 Z" fill="#1e293b" />
        <!-- Warm lantern inside shelter -->
        <circle cx="610" cy="306" r="14" fill="#fbbf24" opacity="0.85" />
        ${ww2PillSVG(614, 384, 'Steel Anderson Shelter', andersonDone)}
      </g>

      <rect x="14" y="12" width="388" height="28" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke="${blackoutShut ? '#4ade80' : '#f59e0b'}" stroke-width="1.5" />
      <text x="26" y="30" fill="${blackoutShut ? '#86efac' : '#fde68a'}" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="800">
        ${blackoutShut ? '✓ House Blacked Out! Check Remaining Blitz Defences' : '⚠️ LIGHT LEAKING! Tap Upstairs Window & All 4 Defences'}
      </text>
    </svg>
  `;
}

/**
 * STAGE 4 (beat3): Mrs Wilkins's 1941 Village Grocer Counter
 */
export function renderRationGrocerSVG({
  rationBasket = new Set(),
  rationExtrasFound = new Set(),
} = {}) {
  return `
    <svg viewBox="0 0 800 450" class="ww2-vector-scene" role="img" aria-label="1941 village grocer counter showing BBC wireless, Mrs Wilkins, ration book, weekly egg, 2oz butter and 4oz bacon, 8oz sugar and tea, and unrationed carrots and Woolton Pie">
      <rect x="0" y="0" width="800" height="285" fill="#292524" />
      <rect x="36" y="56" width="728" height="14" rx="3" fill="#78350f" />
      <rect x="36" y="126" width="728" height="14" rx="3" fill="#78350f" />
      <!-- Oak Grocer Counter -->
      <rect x="0" y="280" width="800" height="170" fill="#78350f" stroke="#fbbf24" stroke-width="3" />

      <!-- EXTRA: Bakelite Kitchen Front Wireless -->
      <g class="ww2-svg-hit ${rationExtrasFound.has('wireless') ? 'is-found' : ''}" data-b3-extra="wireless" data-hz-key="b3_wireless" tabindex="0" role="button" aria-label="Listen to BBC Kitchen Front radio broadcast">
        <rect x="74" y="68" width="96" height="58" rx="8" fill="#451a03" stroke="#fde68a" stroke-width="2.2" />
        <circle cx="104" cy="97" r="15" fill="#fde047" opacity="0.85" />
        <line x1="132" y1="84" x2="156" y2="84" stroke="#fde68a" stroke-width="2" />
        <line x1="132" y1="97" x2="156" y2="97" stroke="#fde68a" stroke-width="2" />
        ${ww2PillSVG(122, 148, 'BBC Wireless', rationExtrasFound.has('wireless'))}
      </g>

      <!-- EXTRA: Mrs Wilkins the Grocer -->
      <g class="ww2-svg-hit ${rationExtrasFound.has('grocer') ? 'is-found' : ''}" data-b3-extra="grocer" data-hz-key="b3_grocer" tabindex="0" role="button" aria-label="Speak with Mrs Wilkins the village grocer">
        <path d="M342 280 L356 176 Q396 164 436 176 L450 280 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2" />
        <circle cx="396" cy="146" r="22" fill="#fed7aa" stroke="#78350f" stroke-width="2" />
        ${ww2PillSVG(396, 206, 'Mrs Wilkins', rationExtrasFound.has('grocer'))}
      </g>

      <!-- EXTRA: Ministry of Food Ration Book -->
      <g class="ww2-svg-hit ${rationExtrasFound.has('book') ? 'is-found' : ''}" data-b3-extra="book" data-hz-key="b3_book" tabindex="0" role="button" aria-label="Inspect buff Ministry of Food Ration Book">
        <rect x="598" y="182" width="76" height="88" rx="5" fill="#fde68a" stroke="#92400e" stroke-width="2.5" />
        <text x="636" y="218" text-anchor="middle" fill="#78350f" font-size="10" font-weight="900">RATION</text>
        <text x="636" y="232" text-anchor="middle" fill="#78350f" font-size="10" font-weight="900">BOOK</text>
        ${ww2PillSVG(636, 166, 'Ration Book', rationExtrasFound.has('book'))}
      </g>

      <!-- RATION 1: 1 Single Fresh Egg -->
      <g class="ww2-svg-hit ${rationBasket.has('egg') ? 'is-found' : ''}" data-ration-item="egg" data-hz-key="rat_egg" tabindex="0" role="button" aria-label="Weigh 1 single fresh egg per week">
        <ellipse cx="116" cy="332" rx="18" ry="24" fill="#fef3c7" stroke="#d97706" stroke-width="2.2" />
        <polygon points="94,344 138,344 128,376 104,376" fill="#38bdf8" stroke="#f8fafc" stroke-width="2" />
        ${ww2PillSVG(116, 404, '1 Egg / Week', rationBasket.has('egg'))}
      </g>

      <!-- RATION 2: 2oz Butter & 4oz Bacon -->
      <g class="ww2-svg-hit ${rationBasket.has('butter_bacon') ? 'is-found' : ''}" data-ration-item="butter_bacon" data-hz-key="rat_butter_bacon" tabindex="0" role="button" aria-label="Weigh 2oz butter and 4oz bacon">
        <ellipse cx="292" cy="364" rx="56" ry="16" fill="#f8fafc" stroke="#94a3b8" stroke-width="2" />
        <rect x="252" y="338" width="36" height="22" rx="3" fill="#fde047" stroke="#ca8a04" stroke-width="1.8" />
        <rect x="296" y="342" width="40" height="16" rx="4" fill="#f87171" stroke="#991b1b" stroke-width="1.8" />
        ${ww2PillSVG(292, 404, '2oz Butter & 4oz Bacon', rationBasket.has('butter_bacon'))}
      </g>

      <!-- RATION 3: 8oz Sugar & 2oz Tea -->
      <g class="ww2-svg-hit ${rationBasket.has('sugar_tea') ? 'is-found' : ''}" data-ration-item="sugar_tea" data-hz-key="rat_sugar_tea" tabindex="0" role="button" aria-label="Weigh 8oz sugar bag and 2oz tea">
        <rect x="456" y="314" width="48" height="60" rx="5" fill="#1d4ed8" stroke="#bfdbfe" stroke-width="2" />
        <text x="480" y="349" text-anchor="middle" fill="#ffffff" font-size="10.5" font-weight="900">SUGAR</text>
        <rect x="512" y="328" width="42" height="46" rx="4" fill="#15803d" stroke="#bbf7d0" stroke-width="2" />
        <text x="533" y="355" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="900">TEA</text>
        ${ww2PillSVG(504, 404, '8oz Sugar & 2oz Tea', rationBasket.has('sugar_tea'))}
      </g>

      <!-- RATION 4: Unrationed Carrots, Potatoes & Woolton Pie -->
      <g class="ww2-svg-hit ${rationBasket.has('woolton_veg') ? 'is-found' : ''}" data-ration-item="woolton_veg" data-hz-key="rat_woolton_veg" tabindex="0" role="button" aria-label="Collect unrationed home-grown carrots and Woolton Pie">
        <ellipse cx="696" cy="356" rx="58" ry="22" fill="#d97706" stroke="#fef08a" stroke-width="2.5" />
        <polygon points="642,334 684,322 646,346" fill="#f97316" />
        <path d="M642 338 L628 332 M642 342 L626 344" stroke="#22c55e" stroke-width="3" />
        ${ww2PillSVG(696, 404, 'Woolton Pie (Unrationed!)', rationBasket.has('woolton_veg'))}
      </g>

      <rect x="14" y="12" width="388" height="28" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke="#f59e0b" stroke-width="1.5" />
      <text x="26" y="30" fill="#fde68a" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="800">1941 Village Grocer • Weigh All 4 Weekly Portions!</text>
    </svg>
  `;
}

/**
 * STAGE 5 (beat4): Bletchley Park Hut 8 Bombe Drums & Enigma Lampboard
 */
export function renderBletchleyHut8SVG({
  bletchleySpotsFound = new Set(),
  solvedCount = 0,
} = {}) {
  return `
    <svg viewBox="0 0 800 450" class="ww2-vector-scene" role="img" aria-label="Bletchley Park Hut 8 showing spinning Bombe codebreaking drums, WRNS operator Miss Bennett, 3-step Enigma cipher lampboard, and VE Day doorway">
      <rect x="0" y="0" width="800" height="450" fill="#0f172a" />

      <!-- Bombe Cabinet & Spinning Drums (Left) -->
      <g class="ww2-svg-hit ${bletchleySpotsFound.has('bombe') ? 'is-found' : ''}" data-bletchley-spot="bombe" data-hz-key="b4_bombe" tabindex="0" role="button" aria-label="Inspect Turing-Welchman Bombe drums">
        <rect x="44" y="76" width="236" height="296" rx="10" fill="#1e293b" stroke="#94a3b8" stroke-width="3" />
        ${[0, 1, 2]
          .flatMap((r) =>
            [0, 1, 2].map((c) => {
              const cx = 92 + c * 70;
              const cy = 128 + r * 74;
              return `
                <circle cx="${cx}" cy="${cy}" r="24" fill="#334155" stroke="#fbbf24" stroke-width="2.5" />
                <circle cx="${cx}" cy="${cy}" r="8" fill="#fde68a" />
              `;
            }),
          )
          .join('')}
        ${ww2PillSVG(162, 398, 'Spinning Bombe Drums', bletchleySpotsFound.has('bombe'))}
      </g>

      <!-- Leading Wren Miss Bennett (Centre) -->
      <g class="ww2-svg-hit ${bletchleySpotsFound.has('wren') ? 'is-found' : ''}" data-bletchley-spot="wren" data-hz-key="b4_wren" tabindex="0" role="button" aria-label="Speak with Leading Wren Miss Bennett">
        <path d="M332 372 L346 232 Q382 220 418 232 L432 372 Z" fill="#1e3a8a" stroke="#93c5fd" stroke-width="2" />
        <circle cx="382" cy="202" r="21" fill="#fed7aa" stroke="#78350f" stroke-width="2" />
        <polygon points="356,192 382,174 408,192" fill="#f8fafc" stroke="#1e3a8a" stroke-width="2" />
        ${ww2PillSVG(382, 398, 'Wren Miss Bennett (75% Women)', bletchleySpotsFound.has('wren'))}
      </g>

      <!-- 3-Bulb Cipher Lampboard (Centre-Right) -->
      <g class="ww2-svg-hit ${bletchleySpotsFound.has('cipher') ? 'is-found' : ''}" data-bletchley-spot="cipher" data-hz-key="b4_cipher" tabindex="0" role="button" aria-label="Inspect 6 AM German weather crib lampboard">
        <rect x="462" y="218" width="164" height="122" rx="10" fill="#1c1917" stroke="#f59e0b" stroke-width="2.5" />
        <text x="544" y="242" text-anchor="middle" fill="#fde68a" font-size="10.5" font-weight="900">6:00 AM WEATHER CRIB</text>
        ${['B', 'R', 'K']
          .map((ch, idx) => {
            const lit = solvedCount > idx;
            const cx = 498 + idx * 46;
            return `
              <circle cx="${cx}" cy="284" r="18" fill="${lit ? '#16a34a' : '#334155'}" stroke="${lit ? '#86efac' : '#94a3b8'}" stroke-width="2.5" />
              <text x="${cx}" y="289" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="900">${ch}</text>
            `;
          })
          .join('')}
        ${ww2PillSVG(544, 364, 'Enigma Crib Lampboard', bletchleySpotsFound.has('cipher'))}
      </g>

      <!-- Sunlit VE Day Doorway (Far Right) -->
      <g class="ww2-svg-hit ${bletchleySpotsFound.has('veday_door') ? 'is-found' : ''}" data-bletchley-spot="veday_door" data-hz-key="b4_veday_door" tabindex="0" role="button" aria-label="Peek toward sunlit 8 May 1945 VE Day courtyard">
        <rect x="656" y="102" width="108" height="268" rx="6" fill="#0284c7" stroke="#fde047" stroke-width="2.5" />
        <polygon points="656,128 682,152 708,128" fill="#ef4444" />
        <polygon points="708,128 734,152 764,128" fill="#f8fafc" />
        <circle cx="710" cy="196" r="22" fill="#fde047" opacity="0.85" />
        ${ww2PillSVG(708, 398, 'VE Day Courtyard', bletchleySpotsFound.has('veday_door'))}
      </g>

      <rect x="14" y="12" width="386" height="28" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke="#38bdf8" stroke-width="1.5" />
      <text x="26" y="30" fill="#bae6fd" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="800">Bletchley Park Hut 8 • Top-Secret Ultra Codebreakers</text>
    </svg>
  `;
}
