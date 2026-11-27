/**
 * 1086 Hampshire Domesday Survey ("Stubitone") — Custom Illuminated Vector SVG Scenes
 * 100% Original Hub Vector IP (Zero AI Images) + Honest Framed Archival Manuscript Evidence Cards.
 *
 * Every clickable character, watermill, woodland pig-herd, eight-ox plough, courtroom witness,
 * cottage inhabitant, and hidden turnip is drawn directly in crisp 16:9 vector linework so
 * audio, visuals, and hit-targets align 1-to-1 with zero pillarboxes or orphaned hotspots.
 */

function badgePillSVG(x, y, label, found = false) {
  const w = Math.max(88, Math.round(label.length * 6.8 + 26));
  const half = Math.round(w / 2);
  const bg = found ? 'rgba(20, 83, 45, 0.94)' : 'rgba(28, 25, 23, 0.92)';
  const stroke = found ? '#4ade80' : '#fbbf24';
  const textCol = found ? '#dcfce7' : '#fef3c7';
  const prefix = found ? '✓ ' : '';
  return `
    <g class="dst-svg-pill" transform="translate(${x}, ${y})">
      <rect x="${-half}" y="-13" width="${w}" height="24" rx="12" fill="${bg}" stroke="${stroke}" stroke-width="2" />
      <text x="0" y="3" text-anchor="middle" fill="${textCol}" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="800">${prefix}${label}</text>
    </g>
  `;
}

export function renderArchivalEvidenceCardHTML({ img, kicker, caption, alt }) {
  return `
    <div class="dst-archival-evidence-card">
      <div class="dst-archival-thumb-wrap">
        <img src="${img}" alt="${alt || kicker}" class="archival-image dst-archival-thumb" loading="lazy" />
      </div>
      <div class="dst-archival-meta">
        <div class="dst-archival-kicker">🏛️ ${kicker}</div>
        <p class="dst-archival-caption">${caption}</p>
      </div>
    </div>
  `;
}

/**
 * STAGE 1 (beat0): Empty 1086 Gosport / Portsmouth Tidal Salt-Marsh (viewBox 800x450)
 */
export function renderGosportSaltMarshSVG({ swampSecretsFound = new Set(), bennetFound = false } = {}) {
  const gullDone = swampSecretsFound.has('gull');
  const millDone = swampSecretsFound.has('mill');
  const torchDone = swampSecretsFound.has('torch');

  return `
    <svg viewBox="0 0 800 450" class="dst-vector-scene" role="img" aria-label="Illustrated 1086 Solent salt-marsh showing empty Gosport mudflats, distant Fareham watermills, Salty the seagull on a creek post, an iron pitch-torch, and Boggy Bennet holding a turnip">
      <defs>
        <linearGradient id="dst-marsh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="55%" stop-color="#334155" />
          <stop offset="100%" stop-color="#64748b" />
        </linearGradient>
        <linearGradient id="dst-marsh-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0f4c5c" />
          <stop offset="100%" stop-color="#16303b" />
        </linearGradient>
        <linearGradient id="dst-marsh-mud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4a3b2c" />
          <stop offset="100%" stop-color="#292018" />
        </linearGradient>
      </defs>

      <!-- Stormy Solent sky & Portsdown chalk ridge -->
      <rect x="0" y="0" width="800" height="230" fill="url(#dst-marsh-sky)" />
      <path d="M0 185 Q180 142 390 174 T800 165 L800 230 L0 230 Z" fill="#3f4f44" />
      <path d="M40 72 Q110 52 185 72 Q235 58 290 78 Z" fill="#475569" opacity="0.55" />
      <path d="M470 58 Q560 36 650 60 Q710 48 760 68 Z" fill="#475569" opacity="0.5" />

      <!-- Fareham Creek tidal channel -->
      <rect x="0" y="210" width="800" height="105" fill="url(#dst-marsh-water)" />
      <path d="M35 245 Q130 238 225 245 M340 265 Q450 257 560 265 M590 235 Q680 229 765 236" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.38" />

      <!-- Foreground Gosport salt-marsh mudbanks & reeds -->
      <path d="M0 285 Q210 262 430 292 T800 278 L800 450 L0 450 Z" fill="url(#dst-marsh-mud)" />
      <ellipse cx="215" cy="365" rx="95" ry="22" fill="#1e3a46" opacity="0.65" />
      <ellipse cx="425" cy="358" rx="115" ry="26" fill="#231a12" stroke="#5c4734" stroke-width="2" />

      <!-- Reed tufts -->
      <g stroke="#65a30d" stroke-width="3" stroke-linecap="round">
        <line x1="78" y1="340" x2="68" y2="288" /><line x1="86" y1="340" x2="88" y2="282" /><line x1="94" y1="340" x2="104" y2="292" />
        <line x1="712" y1="355" x2="702" y2="300" /><line x1="722" y1="355" x2="724" y2="294" /><line x1="732" y1="355" x2="744" y2="305" />
      </g>

      <!-- TARGET 1: Distant Fareham Watermills Up-Creek -->
      <g id="dst-swamp-mill" class="dst-svg-hit ${millDone ? 'is-found' : ''}" data-hz-key="swamp:mill" tabindex="0" role="button" aria-label="Inspect distant Fareham Creek watermills">
        <rect x="92" y="148" width="84" height="52" rx="4" fill="#854d0e" stroke="#fde68a" stroke-width="2" />
        <polygon points="84,150 134,116 184,150" fill="#a16207" stroke="#fde68a" stroke-width="2" />
        <circle cx="174" cy="186" r="22" fill="#451a03" stroke="#fbbf24" stroke-width="3" />
        <line x1="152" y1="186" x2="196" y2="186" stroke="#fde68a" stroke-width="2.5" />
        <line x1="174" y1="164" x2="174" y2="208" stroke="#fde68a" stroke-width="2.5" />
        <line x1="158" y1="170" x2="190" y2="202" stroke="#fde68a" stroke-width="2" />
        <line x1="190" y1="170" x2="158" y2="202" stroke="#fde68a" stroke-width="2" />
        ${badgePillSVG(140, 224, 'Up-Creek: 5 Fareham Mills', millDone)}
      </g>

      <!-- TARGET 2: Salty the Solent Seagull on Marsh Post -->
      <g id="dst-swamp-gull" class="dst-svg-hit ${gullDone ? 'is-found' : ''}" data-hz-key="swamp:gull" tabindex="0" role="button" aria-label="Talk to Salty the Solent Seagull on his marsh post">
        <rect x="634" y="162" width="22" height="145" rx="4" fill="#5c4028" stroke="#a8a29e" stroke-width="1.8" />
        <!-- Seagull body, wing, head & yellow beak -->
        <ellipse cx="644" cy="144" rx="26" ry="16" fill="#f8fafc" stroke="#334155" stroke-width="2" />
        <path d="M626 142 Q645 130 664 146" fill="#94a3b8" />
        <circle cx="624" cy="126" r="12" fill="#f8fafc" stroke="#334155" stroke-width="2" />
        <polygon points="612,126 596,130 612,134" fill="#f59e0b" />
        <circle cx="621" cy="124" r="2.5" fill="#0f172a" />
        <line x1="639" y1="158" x2="639" y2="165" stroke="#f59e0b" stroke-width="3" />
        <line x1="649" y1="158" x2="649" y2="165" stroke="#f59e0b" stroke-width="3" />
        ${badgePillSVG(645, 98, 'Salty the Seagull', gullDone)}
      </g>

      <!-- TARGET 3: 1086 Hand-Forged Iron Pitch-Torch -->
      <g id="dst-swamp-torch" class="dst-svg-hit ${torchDone ? 'is-found' : ''}" data-hz-key="swamp:torch" tabindex="0" role="button" aria-label="Inspect 1086 iron pitch-torch">
        <rect x="556" y="268" width="12" height="98" rx="3" fill="#44403c" stroke="#a8a29e" stroke-width="1.5" />
        <ellipse cx="562" cy="268" rx="16" ry="7" fill="none" stroke="#cbd5e1" stroke-width="3" />
        <path d="M550 266 Q562 224 574 266 Z" fill="#f97316" />
        <path d="M555 266 Q562 238 569 266 Z" fill="#fde047" />
        ${badgePillSVG(562, 386, 'Iron Pitch-Torch', torchDone)}
      </g>

      <!-- TARGET 4: Boggy Bennet Waist-Deep in Gosport Mud + Turnip #1 -->
      <g id="dst-swamp-bennet" class="dst-svg-hit ${bennetFound ? 'is-found' : ''}" data-hz-key="swamp:bennet" tabindex="0" role="button" aria-label="Hear Boggy Bennet in Gosport mud and claim Secret Turnip 1">
        <!-- Tunic & hood -->
        <path d="M382 352 L392 292 Q420 280 448 292 L458 352 Z" fill="#654321" stroke="#fde68a" stroke-width="2" />
        <circle cx="420" cy="268" r="20" fill="#fed7aa" stroke="#78350f" stroke-width="2" />
        <path d="M398 266 Q420 236 442 266 Z" fill="#4d7c0f" stroke="#ecfccb" stroke-width="1.5" />
        <circle cx="413" cy="268" r="2.3" fill="#1c1917" />
        <circle cx="427" cy="268" r="2.3" fill="#1c1917" />
        <path d="M412 278 Q420 274 428 278" stroke="#78350f" stroke-width="2" fill="none" />
        <!-- Prized Turnip #1 -->
        <g transform="translate(458, 312)">
          <ellipse cx="0" cy="8" rx="14" ry="16" fill="#f3e8ff" stroke="#9333ea" stroke-width="2.2" />
          <path d="M-12 2 Q0 -4 12 2" fill="#a855f7" />
          <path d="M0 -8 L-8 -24 M0 -8 L0 -27 M0 -8 L9 -23" stroke="#22c55e" stroke-width="3.5" stroke-linecap="round" />
        </g>
        <!-- Mud ripples around waist -->
        <path d="M366 354 Q420 366 476 354" stroke="#a16207" stroke-width="3" fill="none" />
        ${badgePillSVG(422, 402, 'Boggy Bennet (🥕 Turnip #1)', bennetFound)}
      </g>

      <!-- Scene title ribbon -->
      <rect x="14" y="12" width="322" height="28" rx="8" fill="rgba(15, 23, 42, 0.86)" stroke="#f59e0b" stroke-width="1.5" />
      <text x="26" y="30" fill="#fde68a" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="800">1086 Solent Salt-Marsh (Zero Towns on Shore!)</text>
    </svg>
  `;
}

/**
 * STAGE 2A (beat1 hunt): 1086 Fareham Creek Estate — Catch Reeve Odo's 3 Hidden Tax Assets!
 */
export function renderFarehamEstateSVG({
  foundAssets = new Set(),
  foundExtras = new Set(),
  bennetFound = false,
} = {}) {
  const millsDone = foundAssets.has('mills');
  const pigsDone = foundAssets.has('pigs');
  const churchDone = foundAssets.has('church_meadow');
  const odoDone = foundExtras.has('odo');
  const relicDone = foundExtras.has('relic');
  const hensDone = foundExtras.has('chickens');

  return `
    <svg viewBox="0 0 800 450" class="dst-vector-scene" role="img" aria-label="1086 Fareham manor panorama showing Saxon stone church and hay-meadow, Bishop Walkelin's oak woods with 13 pigs, five spinning watermills on Fareham Creek, sweating Reeve Odo beside Saint Swithin's reliquary, untaxed chickens, and Bennet's turnip">
      <defs>
        <linearGradient id="dst-far-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e3a5f" />
          <stop offset="100%" stop-color="#fef3c7" />
        </linearGradient>
        <linearGradient id="dst-far-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3f6212" />
          <stop offset="100%" stop-color="#27400b" />
        </linearGradient>
      </defs>

      <!-- Illuminated parchment sky & rolling Hampshire hills -->
      <rect x="0" y="0" width="800" height="190" fill="url(#dst-far-sky)" />
      <path d="M0 175 Q200 120 430 162 T800 140 L800 450 L0 450 Z" fill="url(#dst-far-hill)" />

      <!-- Rushing blue millrace of Wallington River / Fareham Creek -->
      <path d="M250 185 Q420 225 520 290 T795 415 L800 450 L455 450 Q385 330 215 220 Z" fill="#0284c7" stroke="#bae6fd" stroke-width="2.5" />
      <path d="M345 235 Q415 258 460 285 M495 315 Q565 348 630 375" stroke="#e0f2fe" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7" />

      <!-- MONEY-MAKER #3: Saxon Stone Parish Church, 90 Households & 41 Meadow Acres -->
      <g class="dst-svg-hit ${churchDone ? 'is-found' : ''}" data-b1-spot="church_meadow" data-hz-key="b1:church_meadow" tabindex="0" role="button" aria-label="Inspect Fareham stone parish church and 41 acres of hay-meadow">
        <!-- Golden hay-meadow field & hayricks -->
        <path d="M18 175 Q140 152 252 182 L222 242 L18 232 Z" fill="#65a30d" stroke="#fde047" stroke-width="2" />
        <path d="M52 212 Q68 184 84 212 Z" fill="#eab308" stroke="#78350f" stroke-width="1.5" />
        <path d="M202 218 Q216 194 230 218 Z" fill="#eab308" stroke="#78350f" stroke-width="1.5" />
        <!-- Stone Saxon church & tower -->
        <rect x="96" y="96" width="34" height="84" fill="#d6d3d1" stroke="#44403c" stroke-width="2" />
        <polygon points="92,96 113,68 134,96" fill="#9a3412" stroke="#44403c" stroke-width="2" />
        <line x1="113" y1="54" x2="113" y2="68" stroke="#fde047" stroke-width="2.5" />
        <line x1="107" y1="60" x2="119" y2="60" stroke="#fde047" stroke-width="2.5" />
        <rect x="130" y="132" width="64" height="48" fill="#e7e5e4" stroke="#44403c" stroke-width="2" />
        <polygon points="126,132 162,108 198,132" fill="#9a3412" stroke="#44403c" stroke-width="2" />
        ${badgePillSVG(142, 232, 'Church & 41 Meadow Acres', churchDone)}
      </g>

      <!-- MONEY-MAKER #2: Bishop's Oak Woods & 13 Foraging Pigs (Upper Right) -->
      <g class="dst-svg-hit ${pigsDone ? 'is-found' : ''}" data-b1-spot="pigs" data-hz-key="b1:pigs" tabindex="0" role="button" aria-label="Inspect 13 woodland pigs rooting for acorns in the Bishop's oak woods">
        <!-- Oak tree trunks & canopies -->
        <rect x="576" y="118" width="16" height="58" fill="#5c3a21" />
        <circle cx="584" cy="98" r="38" fill="#166534" stroke="#86efac" stroke-width="1.8" />
        <rect x="658" y="112" width="18" height="64" fill="#5c3a21" />
        <circle cx="667" cy="90" r="42" fill="#15803d" stroke="#86efac" stroke-width="1.8" />
        <rect x="734" y="124" width="15" height="52" fill="#5c3a21" />
        <circle cx="742" cy="104" r="32" fill="#166534" stroke="#86efac" stroke-width="1.8" />
        <!-- Snorting medieval woodland hogs -->
        <g fill="#f472b6" stroke="#831843" stroke-width="2">
          <ellipse cx="605" cy="182" rx="20" ry="12" /><circle cx="586" cy="179" r="8" />
          <ellipse cx="662" cy="192" rx="22" ry="13" /><circle cx="641" cy="189" r="8.5" />
          <ellipse cx="722" cy="180" rx="19" ry="11.5" /><circle cx="704" cy="177" r="7.5" />
        </g>
        ${badgePillSVG(662, 224, 'Oak Woods (13 Pigs)', pigsDone)}
      </g>

      <!-- MONEY-MAKER #1: 5 Spinning Timber Watermills on Fareham Creek -->
      <g class="dst-svg-hit ${millsDone ? 'is-found' : ''}" data-b1-spot="mills" data-hz-key="b1:mills" tabindex="0" role="button" aria-label="Inspect Fareham's 5 spinning timber watermills worth 41 shillings">
        <!-- Row of timber millhouses & 5 waterwheels -->
        ${[
          { x: 355, y: 215, s: 0.78 },
          { x: 418, y: 242, s: 0.86 },
          { x: 486, y: 270, s: 0.94 },
          { x: 560, y: 300, s: 1.0 },
          { x: 640, y: 332, s: 1.06 },
        ]
          .map(
            (m, i) => `
          <g transform="translate(${m.x}, ${m.y}) scale(${m.s})">
            <rect x="-26" y="-38" width="52" height="38" rx="3" fill="#92400e" stroke="#fde68a" stroke-width="1.8" />
            <polygon points="-30,-38 0,-60 30,-38" fill="#b45309" stroke="#fde68a" stroke-width="1.8" />
            <g class="dst-svg-wheel">
              <circle cx="8" cy="4" r="19" fill="#451a03" stroke="#fbbf24" stroke-width="3" />
              <line x1="-11" y1="4" x2="27" y2="4" stroke="#fde68a" stroke-width="2.2" />
              <line x1="8" y1="-15" x2="8" y2="23" stroke="#fde68a" stroke-width="2.2" />
              <line x1="-5" y1="-9" x2="21" y2="17" stroke="#fde68a" stroke-width="1.8" />
              <line x1="21" y1="-9" x2="-5" y2="17" stroke="#fde68a" stroke-width="1.8" />
            </g>
            <text x="-12" y="-16" fill="#fef08a" font-size="11" font-weight="900">#${i + 1}</text>
          </g>
        `,
          )
          .join('')}
        ${badgePillSVG(495, 344, '5 Watermills (41 Shillings!)', millsDone)}
      </g>

      <!-- EXTRA: Sweating Reeve Odo (Left Foreground) -->
      <g class="dst-svg-hit ${odoDone ? 'is-found' : ''}" data-b1-spot="odo" data-hz-key="b1:odo" tabindex="0" role="button" aria-label="Question sweating Reeve Odo">
        <path d="M74 378 L86 300 Q114 288 142 300 L154 378 Z" fill="#7c2d12" stroke="#fde68a" stroke-width="2" />
        <circle cx="114" cy="276" r="20" fill="#fed7aa" stroke="#78350f" stroke-width="2" />
        <path d="M92 272 Q114 244 136 272 Z" fill="#9a3412" />
        <!-- Flying sweat drops! -->
        <circle cx="84" cy="264" r="4" fill="#38bdf8" />
        <circle cx="144" cy="260" r="4.5" fill="#38bdf8" />
        <circle cx="149" cy="274" r="3.5" fill="#7dd3fc" />
        ${badgePillSVG(114, 396, 'Sweating Reeve Odo', odoDone)}
      </g>

      <!-- EXTRA: Saint Swithin's Gilded Reliquary Oath Casket -->
      <g class="dst-svg-hit ${relicDone ? 'is-found' : ''}" data-b1-spot="relic" data-hz-key="b1:relic" tabindex="0" role="button" aria-label="Inspect Saint Swithin's holy bone reliquary casket">
        <rect x="218" y="330" width="68" height="42" rx="3" fill="#5c3a21" stroke="#a8a29e" stroke-width="1.8" />
        <rect x="228" y="298" width="48" height="32" rx="4" fill="#eab308" stroke="#fef08a" stroke-width="2.5" />
        <polygon points="224,298 252,278 280,298" fill="#ca8a04" stroke="#fef08a" stroke-width="2" />
        <line x1="252" y1="266" x2="252" y2="278" stroke="#fef08a" stroke-width="2.5" />
        <line x1="246" y1="271" x2="258" y2="271" stroke="#fef08a" stroke-width="2.5" />
        ${badgePillSVG(252, 394, 'St Swithin Reliquary', relicDone)}
      </g>

      <!-- EXTRA DECOY: Untaxed Farmyard Chickens -->
      <g class="dst-svg-hit ${hensDone ? 'is-found' : ''}" data-b1-spot="chickens" data-hz-key="b1:chickens" tabindex="0" role="button" aria-label="Inspect untaxed farmyard chickens">
        <ellipse cx="382" cy="396" rx="14" ry="10" fill="#fef3c7" stroke="#92400e" stroke-width="2" />
        <circle cx="370" cy="387" r="6" fill="#fef3c7" stroke="#92400e" stroke-width="1.8" />
        <polygon points="364,387 357,389 364,391" fill="#f59e0b" />
        <circle cx="370" cy="380" r="3" fill="#ef4444" />
        <ellipse cx="416" cy="402" rx="13" ry="9.5" fill="#fed7aa" stroke="#92400e" stroke-width="2" />
        <circle cx="427" cy="393" r="5.5" fill="#fed7aa" stroke="#92400e" stroke-width="1.8" />
        ${badgePillSVG(398, 428, 'Scrawny Hens', hensDone)}
      </g>

      <!-- SECRET TURNIP #2: Bennet's Turnip in Riverbank Reeds -->
      <g class="dst-svg-hit ${bennetFound ? 'is-found' : ''}" data-b1-spot="bennet" data-hz-key="b1:bennet" tabindex="0" role="button" aria-label="Spot Bennet's wiggling turnip tuft in the creek reeds">
        <line x1="712" y1="418" x2="704" y2="374" stroke="#4ade80" stroke-width="3" />
        <line x1="748" y1="418" x2="756" y2="376" stroke="#4ade80" stroke-width="3" />
        <ellipse cx="730" cy="404" rx="14" ry="15" fill="#f3e8ff" stroke="#9333ea" stroke-width="2.2" />
        <path d="M730 388 L722 370 M730 388 L730 368 M730 388 L739 371" stroke="#22c55e" stroke-width="3.5" stroke-linecap="round" />
        ${badgePillSVG(712, 432, '🥕 Turnip #2', bennetFound)}
      </g>

      <rect x="14" y="12" width="326" height="28" rx="8" fill="rgba(15, 23, 42, 0.86)" stroke="#f59e0b" stroke-width="1.5" />
      <text x="26" y="30" fill="#fde68a" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="800">1086 Fareham Estate (Tap All 3 Tax Assets!)</text>
    </svg>
  `;
}

/**
 * STAGE 2B (beat1 servi): Dawn Eight-Ox Plough & Gyrth (1 of 10 Enslaved Workers in Fareham)
 */
export function renderServiPloughSVG({
  serviReflected = false,
  oxenFound = false,
  overseerFound = false,
} = {}) {
  return `
    <svg viewBox="0 0 800 450" class="dst-vector-scene" role="img" aria-label="Dawn Hampshire clay field showing eight yoked plough-oxen, Gyrth guiding the heavy wheeled mouldboard plough, and Bishop Walkelin's mounted bailiff on the ridge">
      <defs>
        <linearGradient id="dst-dawn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="60%" stop-color="#475569" />
          <stop offset="100%" stop-color="#fdba74" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="800" height="205" fill="url(#dst-dawn-sky)" />
      <circle cx="670" cy="162" r="36" fill="#fed7aa" opacity="0.65" />
      <path d="M0 195 Q260 154 530 182 T800 168 L800 450 L0 450 Z" fill="#3b2f26" />

      <!-- Freshly sliced Hampshire clay ridge-and-furrow lines -->
      <g stroke="#574435" stroke-width="4" opacity="0.75">
        <line x1="20" y1="255" x2="780" y2="235" />
        <line x1="10" y1="295" x2="790" y2="275" />
        <line x1="0" y1="345" x2="800" y2="325" />
        <line x1="0" y1="395" x2="800" y2="378" />
      </g>

      <!-- TARGET 1: Mounted Norman Bailiff on the Dawn Ridge -->
      <g class="dst-svg-hit ${overseerFound ? 'is-found' : ''}" data-servi-spot="overseer" data-hz-key="servi:overseer" tabindex="0" role="button" aria-label="Inspect Bishop Walkelin's mounted Norman bailiff on the ridge">
        <ellipse cx="415" cy="164" rx="28" ry="15" fill="#1e293b" stroke="#cbd5e1" stroke-width="1.8" />
        <circle cx="392" cy="150" r="9" fill="#1e293b" />
        <rect x="408" y="128" width="16" height="26" rx="4" fill="#7c2d12" stroke="#fde68a" stroke-width="1.5" />
        <circle cx="416" cy="119" r="8" fill="#fed7aa" />
        <polygon points="408,118 416,106 424,118" fill="#94a3b8" />
        ${badgePillSVG(416, 92, 'Norman Bailiff on Ridge', overseerFound)}
      </g>

      <!-- TARGET 2: Heavy Eight-Ox Team Straining in Yokes -->
      <g class="dst-svg-hit ${oxenFound ? 'is-found' : ''}" data-servi-spot="oxen" data-hz-key="servi:oxen" tabindex="0" role="button" aria-label="Inspect eight-ox heavy medieval plough team">
        ${[105, 185, 265, 345]
          .map(
            (ox, idx) => `
          <g transform="translate(${ox}, ${302 + (idx % 2) * 8})">
            <!-- Back pair silhouette -->
            <ellipse cx="10" cy="-14" rx="34" ry="20" fill="#78350f" opacity="0.82" />
            <!-- Foreground ox -->
            <ellipse cx="0" cy="0" rx="36" ry="21" fill="#a16207" stroke="#fde68a" stroke-width="1.8" />
            <circle cx="-36" cy="-6" r="12" fill="#92400e" stroke="#fde68a" stroke-width="1.5" />
            <path d="M-44 -14 Q-54 -26 -42 -28 M-30 -14 Q-22 -26 -32 -28" stroke="#fef3c7" stroke-width="2.5" fill="none" />
            <line x1="-20" y1="18" x2="-20" y2="42" stroke="#451a03" stroke-width="5" />
            <line x1="18" y1="18" x2="18" y2="42" stroke="#451a03" stroke-width="5" />
            <rect x="-30" y="-20" width="8" height="22" rx="2" fill="#d97706" />
          </g>
        `,
          )
          .join('')}
        <!-- Timber draught beam & wheeled iron plough -->
        <line x1="95" y1="308" x2="538" y2="324" stroke="#d97706" stroke-width="6" />
        <circle cx="468" cy="336" r="22" fill="none" stroke="#fde68a" stroke-width="4" />
        <polygon points="495,334 548,334 522,356" fill="#94a3b8" stroke="#f8fafc" stroke-width="2" />
        ${badgePillSVG(245, 386, '8-Ox Heavy Plough Team', oxenFound)}
      </g>

      <!-- TARGET 3: Gyrth — 1 of 10 Enslaved Ploughmen (Servi) -->
      <g id="dst-btn-hear-gyrth" class="dst-svg-hit ${serviReflected ? 'is-found' : ''}" data-hz-key="servi:gyrth" tabindex="0" role="button" aria-label="Listen to Gyrth, one of 10 enslaved workers in 1086 Fareham">
        <line x1="532" y1="326" x2="596" y2="288" stroke="#b45309" stroke-width="6" stroke-linecap="round" />
        <path d="M588 362 L598 282 Q624 274 644 286 L652 362 Z" fill="#475569" stroke="#e2e8f0" stroke-width="2" />
        <circle cx="620" cy="258" r="18" fill="#fed7aa" stroke="#78350f" stroke-width="2" />
        <line x1="602" y1="362" x2="594" y2="404" stroke="#334155" stroke-width="6" />
        <line x1="636" y1="362" x2="644" y2="404" stroke="#334155" stroke-width="6" />
        ${badgePillSVG(622, 422, 'Gyrth (1 of 10 Servi)', serviReflected)}
      </g>

      <rect x="14" y="12" width="356" height="28" rx="8" fill="rgba(15, 23, 42, 0.86)" stroke="#94a3b8" stroke-width="1.5" />
      <text x="26" y="30" fill="#e2e8f0" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="800">Bishop’s Home Farm at Dawn • 10 Enslaved Servi</text>
    </svg>
  `;
}

/**
 * STAGE 4 (beat3): 1086 Winchester Royal Assize Courtroom (viewBox 800x450)
 */
export function renderRoyalAssizeSVG({ heardSet = new Set() } = {}) {
  const hughDone = heardSet.has('hugh');
  const clerkDone = heardSet.has('clerk');
  const shieldDone = heardSet.has('shield');
  const villagerDone = heardSet.has('villager');
  const monkDone = heardSet.has('bishop_monk');

  return `
    <svg viewBox="0 0 800 450" class="dst-vector-scene" role="img" aria-label="1086 Winchester Royal Assize Hall showing Sheriff Hugh with his silver penny chest, Royal Clerk Sir Guy, Fareham's coastal Viking raid shield, villager Wulf pleading, and Bishop Walkelin's representative">
      <rect x="0" y="0" width="800" height="450" fill="#1c1917" />
      <!-- Norman Romanesque stone arches -->
      <path d="M40 360 L40 120 A95 95 0 0 1 230 120 L230 360" fill="#292524" stroke="#57534e" stroke-width="5" />
      <path d="M275 360 L275 110 A125 110 0 0 1 525 110 L525 360" fill="#292524" stroke="#78716c" stroke-width="5" />
      <path d="M570 360 L570 120 A95 95 0 0 1 760 120 L760 360" fill="#292524" stroke="#57534e" stroke-width="5" />
      <rect x="0" y="352" width="800" height="98" fill="#141210" stroke="#44403c" stroke-width="2" />

      <!-- Warm wall torches -->
      <g>
        <path d="M246 142 Q252 114 258 142 Z" fill="#f97316" /><circle cx="252" cy="132" r="18" fill="#fbbf24" opacity="0.18" />
        <path d="M542 142 Q548 114 554 142 Z" fill="#f97316" /><circle cx="548" cy="132" r="18" fill="#fbbf24" opacity="0.18" />
      </g>

      <!-- TARGET 1: Coastal Viking Dragon-Shield Exhibit (Centre Arch) -->
      <g class="dst-svg-hit ${shieldDone ? 'is-found' : ''}" data-assize-spot="shield" data-hz-key="assize:shield" tabindex="0" role="button" aria-label="Inspect scarred Viking raid shield explaining King Edward's 20-hide sea-defence tax break">
        <circle cx="400" cy="132" r="42" fill="#991b1b" stroke="#fde047" stroke-width="4" />
        <path d="M372 104 L428 160 M428 104 L372 160" stroke="#fef08a" stroke-width="3" />
        <circle cx="400" cy="132" r="12" fill="#cbd5e1" stroke="#475569" stroke-width="2" />
        ${badgePillSVG(400, 192, 'Viking Raid Shield (20 Hides)', shieldDone)}
      </g>

      <!-- TARGET 2: Sheriff Hugh de Port & Silver Penny Chest (Far Left) -->
      <g class="dst-svg-hit ${hughDone ? 'is-found' : ''}" data-assize-spot="hugh" data-hz-key="assize:hugh" tabindex="0" role="button" aria-label="Hear Sheriff Hugh de Port beside his 54-manor silver chest">
        <path d="M78 352 L90 250 Q124 238 158 250 L170 352 Z" fill="#7f1d1d" stroke="#fde68a" stroke-width="2" />
        <circle cx="124" cy="224" r="20" fill="#fed7aa" stroke="#78350f" stroke-width="2" />
        <polygon points="102,220 124,194 146,220" fill="#94a3b8" stroke="#e2e8f0" stroke-width="2" />
        <!-- Iron-bound chest of silver pennies -->
        <rect x="64" y="330" width="76" height="44" rx="4" fill="#78350f" stroke="#fbbf24" stroke-width="2.2" />
        <circle cx="88" cy="326" r="6" fill="#e2e8f0" /><circle cx="102" cy="324" r="6" fill="#f8fafc" /><circle cx="116" cy="326" r="6" fill="#cbd5e1" />
        ${badgePillSVG(118, 398, 'Sheriff Hugh & Silver', hughDone)}
      </g>

      <!-- TARGET 3: Royal Exchequer Clerk Sir Guy (Left-Centre Bench) -->
      <g class="dst-svg-hit ${clerkDone ? 'is-found' : ''}" data-assize-spot="clerk" data-hz-key="assize:clerk" tabindex="0" role="button" aria-label="Hear Royal Exchequer Clerk Sir Guy">
        <path d="M262 352 L274 262 Q304 250 334 262 L346 352 Z" fill="#1e3a8a" stroke="#93c5fd" stroke-width="2" />
        <circle cx="304" cy="236" r="19" fill="#fed7aa" stroke="#78350f" stroke-width="2" />
        <!-- Open Domesday parchment & golden quill -->
        <rect x="268" y="324" width="84" height="28" rx="3" fill="#fef3c7" stroke="#b45309" stroke-width="2" />
        <path d="M332 322 Q352 288 362 282" stroke="#fde047" stroke-width="4" stroke-linecap="round" />
        ${badgePillSVG(308, 376, 'Royal Clerk Guy', clerkDone)}
      </g>

      <!-- TARGET 4: Wulf of Fareham Pleading for His Town (Right-Centre) -->
      <g class="dst-svg-hit ${villagerDone ? 'is-found' : ''}" data-assize-spot="villager" data-hz-key="assize:villager" tabindex="0" role="button" aria-label="Hear villager Wulf of Fareham plead against the £20 rent">
        <path d="M466 352 L478 260 Q508 250 538 260 L550 352 Z" fill="#3f6212" stroke="#bef264" stroke-width="2" />
        <circle cx="508" cy="234" r="19" fill="#fed7aa" stroke="#78350f" stroke-width="2" />
        <!-- Raised pleading hands -->
        <line x1="478" y1="286" x2="448" y2="262" stroke="#fed7aa" stroke-width="6" stroke-linecap="round" />
        <line x1="538" y1="286" x2="562" y2="264" stroke="#fed7aa" stroke-width="6" stroke-linecap="round" />
        ${badgePillSVG(508, 376, 'Wulf of Fareham (£16 vs £20)', villagerDone)}
      </g>

      <!-- TARGET 5: Bishop Walkelin's Cathedral Official (Far Right) -->
      <g class="dst-svg-hit ${monkDone ? 'is-found' : ''}" data-assize-spot="bishop_monk" data-hz-key="assize:bishop_monk" tabindex="0" role="button" aria-label="Hear Bishop Walkelin's cathedral official explain the £20 demand">
        <path d="M640 352 L652 252 Q684 240 716 252 L728 352 Z" fill="#581c87" stroke="#d8b4fe" stroke-width="2" />
        <circle cx="684" cy="226" r="19" fill="#fed7aa" stroke="#78350f" stroke-width="2" />
        <!-- Rolled Norman Cathedral Stone Plan -->
        <rect x="646" y="292" width="54" height="16" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="2" />
        ${badgePillSVG(684, 398, 'Bishop’s Bailiff (£20)', monkDone)}
      </g>

      <rect x="14" y="12" width="350" height="28" rx="8" fill="rgba(15, 23, 42, 0.88)" stroke="#f59e0b" stroke-width="1.5" />
      <text x="26" y="30" fill="#fde68a" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="800">1086 Winchester Royal Assize (Hear Both Sides!)</text>
    </svg>
  `;
}

/**
 * STAGE 5 (beat4): Cutaway Inside Edith's Stubbington Cottage #3 (viewBox 800x450)
 */
export function renderStubbingtonHutSVG({
  hutPeopleGroups = new Set(),
  foundPets = false,
  bennetFound = false,
} = {}) {
  const edithDone = hutPeopleGroups.has('edith');
  const grandmaDone = hutPeopleGroups.has('grandma');
  const kidsDone = hutPeopleGroups.has('five_kids');

  return `
    <svg viewBox="0 0 800 450" class="dst-vector-scene" role="img" aria-label="Cross-section cutaway of Stubbington Cottage Number 3 showing Grandma spinning wool, Edith with her soup ladle, five uncounted children around the hearth and woodpile, roosting hens and cottage dog, plus tree-stumps outside with Turnip 3">
      <!-- Outdoor Stubbington clearing sky & grass -->
      <rect x="0" y="0" width="800" height="260" fill="#1e3a5f" />
      <rect x="0" y="260" width="800" height="190" fill="#2d4f32" />

      <!-- Timber, wattle-and-daub & reed-thatch Cottage #3 Cutaway -->
      <polygon points="28,158 310,32 592,158" fill="#a16207" stroke="#fde047" stroke-width="3" />
      <polygon points="62,158 310,54 558,158" fill="#3b2616" />
      <rect x="56" y="158" width="508" height="232" fill="#291d14" stroke="#b45309" stroke-width="4" />
      <!-- Oak rafters -->
      <line x1="88" y1="158" x2="532" y2="158" stroke="#78350f" stroke-width="8" />

      <!-- Central stone hearth & iron pottage cauldron -->
      <ellipse cx="315" cy="368" rx="46" ry="12" fill="#57534e" />
      <path d="M298 364 Q315 326 332 364 Z" fill="#f97316" />
      <circle cx="315" cy="340" r="22" fill="#1c1917" stroke="#94a3b8" stroke-width="2.5" />

      <!-- TARGET 1: Grandma Eadgyth Spinning Wool (Left Hearth) -->
      <g class="dst-svg-hit ${grandmaDone ? 'is-found' : ''}" data-b4-spot="grandma" data-hz-key="b4:grandma" tabindex="0" role="button" aria-label="Tap Grandma Eadgyth spinning wool on her stool">
        <rect x="96" y="344" width="38" height="10" rx="3" fill="#78350f" />
        <line x1="102" y1="354" x2="98" y2="382" stroke="#78350f" stroke-width="4" />
        <line x1="128" y1="354" x2="132" y2="382" stroke="#78350f" stroke-width="4" />
        <path d="M92 346 L102 272 Q122 264 142 272 L152 346 Z" fill="#6b21a8" stroke="#e9d5ff" stroke-width="2" />
        <circle cx="122" cy="248" r="18" fill="#fed7aa" stroke="#78350f" stroke-width="2" />
        <path d="M102 246 Q122 224 142 246" fill="#e2e8f0" />
        <!-- Drop-spindle & wool -->
        <line x1="154" y1="286" x2="154" y2="334" stroke="#fef3c7" stroke-width="2" />
        <circle cx="154" cy="336" r="6" fill="#fde047" />
        ${badgePillSVG(124, 404, 'Grandma (+1)', grandmaDone)}
      </g>

      <!-- TARGET 2: Edith of Stubbington Waving Wooden Ladle -->
      <g class="dst-svg-hit ${edithDone ? 'is-found' : ''}" data-b4-spot="edith" data-hz-key="b4:edith" tabindex="0" role="button" aria-label="Tap Edith of Stubbington holding her wooden ladle">
        <path d="M204 366 L216 266 Q240 256 264 266 L276 366 Z" fill="#0f766e" stroke="#99f6e4" stroke-width="2" />
        <circle cx="240" cy="240" r="19" fill="#fed7aa" stroke="#78350f" stroke-width="2" />
        <path d="M220 234 Q240 214 260 234 Z" fill="#fef3c7" />
        <!-- Wooden soup ladle -->
        <line x1="268" y1="288" x2="298" y2="254" stroke="#d97706" stroke-width="4" stroke-linecap="round" />
        <circle cx="301" cy="251" r="7" fill="#b45309" stroke="#fde68a" stroke-width="1.5" />
        ${badgePillSVG(240, 384, 'Edith (+1)', edithDone)}
      </g>

      <!-- TARGET 3: 5 Uncounted Children Around Pot, Bench & Log-Pile -->
      <g class="dst-svg-hit ${kidsDone ? 'is-found' : ''}" data-b4-spot="five_kids" data-hz-key="b4:five_kids" tabindex="0" role="button" aria-label="Count all 5 uncounted children inside Stubbington Cottage 3">
        <!-- Toddler #1 by pot + Kids #2 & #3 sharing bowls + Kids #4 & #5 stacking logs -->
        ${[
          { x: 358, y: 332, c: '#ca8a04' },
          { x: 398, y: 312, c: '#2563eb' },
          { x: 434, y: 316, c: '#16a34a' },
          { x: 474, y: 306, c: '#dc2626' },
          { x: 512, y: 312, c: '#9333ea' },
        ]
          .map(
            (k) => `
          <g transform="translate(${k.x}, ${k.y})">
            <rect x="-12" y="0" width="24" height="42" rx="5" fill="${k.c}" stroke="#fef3c7" stroke-width="1.6" />
            <circle cx="0" cy="-12" r="11" fill="#fed7aa" stroke="#78350f" stroke-width="1.6" />
          </g>
        `,
          )
          .join('')}
        ${badgePillSVG(436, 384, '5 Hungry Kids (+5)', kidsDone)}
      </g>

      <!-- TARGET 4: Untaxed Rafter Hens & Sleeping Cottage Dog -->
      <g class="dst-svg-hit ${foundPets ? 'is-found' : ''}" data-b4-spot="untaxed_pets" data-hz-key="b4:pets" tabindex="0" role="button" aria-label="Inspect untaxed cottage hens on the rafters and farm dog">
        <!-- Rafter hens -->
        <ellipse cx="222" cy="148" rx="13" ry="9" fill="#fef3c7" stroke="#92400e" stroke-width="1.8" />
        <circle cx="211" cy="140" r="5.5" fill="#fef3c7" /><circle cx="211" cy="134" r="2.8" fill="#ef4444" />
        <ellipse cx="395" cy="148" rx="13" ry="9" fill="#fed7aa" stroke="#92400e" stroke-width="1.8" />
        <circle cx="406" cy="140" r="5.5" fill="#fed7aa" /><circle cx="406" cy="134" r="2.8" fill="#ef4444" />
        <!-- Sleeping terrier dog -->
        <ellipse cx="315" cy="404" rx="20" ry="9" fill="#a8a29e" stroke="#f8fafc" stroke-width="1.5" />
        <circle cx="296" cy="400" r="7" fill="#a8a29e" />
        ${badgePillSVG(310, 122, 'Untaxed Hens & Dog', foundPets)}
      </g>

      <!-- TARGET 5: Tree-Stumps ("Stubitone") & Bennet's Secret Turnip #3 (Right Yard) -->
      <g class="dst-svg-hit ${bennetFound ? 'is-found' : ''}" data-b4-spot="stumps_bennet" data-hz-key="b4:stumps" tabindex="0" role="button" aria-label="Inspect Stubbington tree-stumps and claim Bennet's Secret Turnip 3">
        <!-- Carved oak tree stumps -->
        <path d="M626 355 L636 312 L684 312 L694 355 Z" fill="#78350f" stroke="#fde68a" stroke-width="2" />
        <ellipse cx="660" cy="312" rx="24" ry="7" fill="#d97706" stroke="#78350f" stroke-width="1.5" />
        <path d="M708 378 L716 340 L758 340 L766 378 Z" fill="#78350f" stroke="#fde68a" stroke-width="2" />
        <ellipse cx="737" cy="340" rx="21" ry="6" fill="#d97706" stroke="#78350f" stroke-width="1.5" />
        <!-- Turnip #3 behind stump -->
        <ellipse cx="696" cy="356" rx="14" ry="15" fill="#f3e8ff" stroke="#9333ea" stroke-width="2.2" />
        <path d="M696 340 L688 322 M696 340 L696 319 M696 340 L705 323" stroke="#22c55e" stroke-width="3.5" stroke-linecap="round" />
        ${badgePillSVG(695, 404, 'Tree-Stumps (🥕 Turnip #3)', bennetFound)}
      </g>

      <rect x="14" y="12" width="386" height="28" rx="8" fill="rgba(15, 23, 42, 0.88)" stroke="#f59e0b" stroke-width="1.5" />
      <text x="26" y="30" fill="#fde68a" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="800">Stubbington Cottage #3 ("1 Household" = 8 Real People!)</text>
    </svg>
  `;
}
