/**
 * 1086 Domesday Time-Travel Escape Room — Tactile Puzzles & Genuine Archival Plates
 * Zero childish clip-art or stick-figure SVGs: pairs real medieval manuscripts
 * (Bayeux Tapestry, Luttrell Psalter, Très Riches Heures) with brain-teasing
 * escape-room mechanics (3x3 Torn Charter Tile-Swap Puzzle, 3-Dial Brass Tax Vault,
 * Witness Interrogation Dossiers, and Stubbington Household Census Decoder).
 */

export const INITIAL_CHARTER_TILES = [4, 1, 7, 3, 0, 5, 6, 2, 8];
export const SOLVED_CHARTER_TILES = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export function countAlignedCharterTiles(tiles = []) {
  let ok = 0;
  for (let i = 0; i < 9; i++) {
    if (tiles[i] === i) ok++;
  }
  return ok;
}

/**
 * ROOM 1 ESCAPE PUZZLE: 3x3 Torn 1086 Bayeux Charter Tile-Swap Puzzle
 */
export function renderTornCharterPuzzleHTML({
  tiles = INITIAL_CHARTER_TILES,
  selectedIdx = -1,
  moves = 0,
  solved = false,
  peek = false,
} = {}) {
  const aligned = countAlignedCharterTiles(tiles);
  return `
    <div class="dst-escape-box ${solved ? 'is-unlocked' : ''}">
      <div class="dst-escape-head">
        <div>
          <div class="dst-escape-kicker">⏳ ESCAPE LOCK #1 • REASSEMBLE THE TORN 1086 CHARTER</div>
          <div class="dst-escape-sub">
            ${
              solved
                ? '✅ Charter Reassembled! Now test 2 coastal places on the Solent Map to unlock Room 2.'
                : 'Tap any 2 parchment tiles to swap them until the Bayeux fleet forms 1 complete image!'
            }
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <span class="dst-lock-badge ${solved ? 'is-open' : ''}">${solved ? '🔓 9/9 ALIGNED' : `🔒 ${aligned}/9 • ${moves} swaps`}</span>
          ${
            !solved
              ? `<button type="button" class="dst-icon-btn" id="dst-charter-peek-btn" style="min-height:28px;padding:2px 8px;font-size:0.7rem;">
                   ${peek ? '🙈 Hide Guide' : '👁️ Peek Original'}
                 </button>
                 <button type="button" class="dst-icon-btn" id="dst-charter-hint-btn" style="min-height:28px;padding:2px 8px;font-size:0.7rem;border-color:#fde047;color:#fef08a;">
                   ✨ Snap 1 Tile
                 </button>`
              : ''
          }
        </div>
      </div>

      ${
        peek && !solved
          ? `<div class="dst-charter-peek-wrap">
               <img src="/images/ks3_med7/med7_l1_card_bayeux_norman_fleet_scene38.jpg" alt="Bayeux Tapestry Scene 38 reference guide" class="dst-charter-peek-img" />
             </div>`
          : ''
      }

      <div class="dst-charter-grid" role="grid" aria-label="3 by 3 Bayeux Tapestry tile-swap puzzle">
        ${tiles
          .map((pieceId, slotIdx) => {
            const col = pieceId % 3;
            const row = Math.floor(pieceId / 3);
            const isSel = selectedIdx === slotIdx;
            const isRight = pieceId === slotIdx;
            return `
              <button type="button"
                      class="dst-charter-tile ${isSel ? 'is-selected' : ''} ${isRight ? 'is-aligned' : ''}"
                      data-charter-slot="${slotIdx}"
                      style="background-position: ${col * 50}% ${row * 50}%;"
                      aria-label="Charter tile ${slotIdx + 1}${isRight ? ' (aligned)' : ''}">
                <span class="dst-tile-num">${isRight ? '✓' : pieceId + 1}</span>
              </button>
            `;
          })
          .join('')}
      </div>

      <div class="dst-escape-guide-strip">
        <button type="button" class="dst-witness-pill ${solved ? 'is-found' : ''}" id="dst-swamp-bennet">
          🥕 Bennet’s Marsh Clues (Turnip #1)
        </button>
        <button type="button" class="dst-witness-pill" id="dst-swamp-gull">
          🐦 Hear Salty on 1086 Gosport
        </button>
        <button type="button" class="dst-witness-pill" id="dst-swamp-mill">
          ⚙️ Up-Creek: Fareham Mills
        </button>
      </div>
    </div>
  `;
}

/**
 * ROOM 2 ARCHIVAL PLATE + EVIDENCE SLIPS (Fareham Watermills & 10 Enslaved Servi)
 */
export function renderFarehamArchivalVaultLeftHTML({
  subMode = 'hunt',
  foundAssets = new Set(),
  foundExtras = new Set(),
  bennetFound = false,
} = {}) {
  const isServi = subMode === 'servi';
  const heroImg = isServi
    ? '/images/medieval_england/tres_riches_heures_ox_plough_f3v.jpg'
    : '/images/medieval_england/luttrell_psalter_watermill_detail_f181r.jpg';
  const heroBadge = isServi
    ? 'Très Riches Heures (Musée Condé MS 65, f. 3v) • Medieval Ox-Plough'
    : 'Luttrell Psalter (BL Add MS 42130, f. 181r) • Medieval Watermill & Millrace';
  const heroCap = isServi
    ? 'Heavy medieval ploughs needed eight oxen to slice wet Hampshire clay—worked from dawn till dusk by Fareham’s 10 enslaved servi.'
    : 'Genuine 14th-century English manuscript showing a lord’s watermill and wicker eel-traps. Peasants were banned by law from grinding grain at home.';

  return `
    <div class="dst-escape-box">
      <div class="dst-plate-hero">
        <img src="${heroImg}" alt="${heroBadge}" class="archival-image dst-plate-hero-img" />
        <div class="dst-plate-hero-badge">🏛️ ${heroBadge}</div>
      </div>
      <p class="dst-plate-hero-cap">${heroCap}</p>

      <div class="dst-escape-kicker" style="margin-bottom:6px;">📜 1086 FAREHAM EVIDENCE SLIPS (READ TO CRACK THE 3-DIAL LOCK!):</div>
      <div class="dst-clue-slips-grid">
        <button type="button" class="dst-clue-slip ${foundAssets.has('mills') ? 'is-found' : ''}" data-b1-spot="mills">
          <div class="dst-slip-title">⚙️ Slip A: Fareham Millrace Toll</div>
          <div class="dst-slip-body">Reeve Odo swore there were only 2 mills—yet Bishop Walkelin’s tally shows <strong>5 watermills</strong> earning 41 shillings a year!</div>
        </button>
        <button type="button" class="dst-clue-slip ${foundAssets.has('pigs') ? 'is-found' : ''}" data-b1-spot="pigs">
          <div class="dst-slip-title">🐷 Slip B: Oak-Wood Pannage Tax</div>
          <div class="dst-slip-body">Domesday Folio 40r records Fareham’s woodland as yielding <strong>13 pigs</strong> in pannage rent for acorn grazing!</div>
        </button>
        <button type="button" class="dst-clue-slip ${foundAssets.has('church_meadow') ? 'is-found' : ''}" data-b1-spot="church_meadow">
          <div class="dst-slip-title">⛪ Slip C: Church, Meadow &amp; Servi</div>
          <div class="dst-slip-body">Alongside 1 stone church and 41 meadow acres, Fareham lists <strong>10 enslaved <em>servi</em></strong> written right beside the plough-oxen.</div>
        </button>
        <button type="button" class="dst-clue-slip ${bennetFound ? 'is-found' : ''}" data-b1-spot="bennet">
          <div class="dst-slip-title">🥕 Slip D: Bennet’s Reeds (Turnip #2)</div>
          <div class="dst-slip-body">Tap to hear Bennet Luvet explain why poor cottagers with zero oxen never got named in King William’s book!</div>
        </button>
      </div>

      <div class="dst-escape-guide-strip">
        <button type="button" class="dst-witness-pill ${foundExtras.has('odo') ? 'is-found' : ''}" data-b1-spot="odo">😰 Interrogate Reeve Odo</button>
        <button type="button" class="dst-witness-pill ${foundExtras.has('relic') ? 'is-found' : ''}" data-b1-spot="relic">✝️ St Swithin’s Oath</button>
        <button type="button" class="dst-witness-pill" id="dst-btn-hear-gyrth">⚖️ Hear Gyrth (1 of 10 Servi)</button>
      </div>
    </div>
  `;
}

/**
 * ROOM 2 RIGHT PANEL: 3-Dial Brass Tax-Audit Combination Lock (5 - 13 - 10)
 */
export function renderTaxVaultDialHTML({
  dials = [2, 0, 0],
  vaultUnlocked = false,
  vaultFeedback = '',
} = {}) {
  const specs = [
    { idx: 0, label: 'WATERMILLS', target: 5, min: 0, max: 20 },
    { idx: 1, label: 'WOODLAND PIGS', target: 13, min: 0, max: 25 },
    { idx: 2, label: 'ENSLAVED SERVI', target: 10, min: 0, max: 20 },
  ];

  return `
    <div class="dst-vault-panel ${vaultUnlocked ? 'is-unlocked' : ''}">
      <div class="dst-escape-kicker">🔐 ESCAPE LOCK #2 • REEVE ODO’S TAX COMBINATION LOCK</div>
      <p style="margin:4px 0 10px;font-size:0.81rem;color:#e7e5e4;line-height:1.38;">
        Reeve Odo lied to dodge royal tax! Read the <strong>Fareham Evidence Slips</strong> on the left and dial the true 1086 numbers below:
      </p>
      <div class="dst-dial-grid">
        ${specs
          .map((sp) => {
            const val = dials[sp.idx] ?? 0;
            const lockedOk = vaultUnlocked || val === sp.target;
            return `
              <div class="dst-dial-slot ${vaultUnlocked ? 'is-locked' : ''}">
                <div class="dst-dial-label">${sp.label}</div>
                <button type="button" class="dst-dial-btn" data-vault-dial="${sp.idx}" data-vault-dir="1" ${vaultUnlocked ? 'disabled' : ''} aria-label="Increase ${sp.label}">▲</button>
                <div class="dst-dial-val">${val}</div>
                <button type="button" class="dst-dial-btn" data-vault-dial="${sp.idx}" data-vault-dir="-1" ${vaultUnlocked ? 'disabled' : ''} aria-label="Decrease ${sp.label}">▼</button>
                <div class="dst-dial-hint">${vaultUnlocked ? '✓ MATCHED' : lockedOk ? '•' : '•'}</div>
              </div>
            `;
          })
          .join('')}
      </div>

      ${
        !vaultUnlocked
          ? `<button type="button" class="dst-start-cta" id="dst-btn-test-vault" style="width:100%;margin-top:10px;min-height:42px;font-size:0.86rem;">
               🔓 TEST TAX COMBINATION (${dials[0]} – ${dials[1]} – ${dials[2]})
             </button>`
          : `<div style="margin-top:10px;padding:9px 11px;border-radius:9px;background:rgba(20,83,45,0.42);border:1.5px solid #22c55e;font-size:0.81rem;color:#dcfce7;font-weight:800;">
               🔓 VAULT UNLOCKED (5 Mills • 13 Pigs • 10 Servi)! Reeve Odo’s tax dodge is exposed!
             </div>`
      }

      ${
        vaultFeedback
          ? `<div style="margin-top:8px;padding:7px 10px;border-radius:8px;background:rgba(220,38,38,0.22);border:1px solid #ef4444;font-size:0.78rem;color:#fecaca;">
               ${vaultFeedback}
             </div>`
          : ''
      }
    </div>
  `;
}

/**
 * ROOM 4 ARCHIVAL PLATE + WITNESS INTERROGATION DESK (Winchester Royal Assize)
 */
export function renderAssizeArchivalDeskHTML({ heardSet = new Set() } = {}) {
  const witnesses = [
    { id: 'villager', icon: '🌾', name: 'Wulf of Fareham', sub: 'Pleads £16 true value vs £20 rent' },
    { id: 'shield', icon: '🛡️', name: 'Viking Raid Tax Break', sub: '30 hides cut to 20 "on the sea"' },
    { id: 'clerk', icon: '🪶', name: 'Royal Clerk Sir Guy', sub: 'Demands full 30-hide tax' },
    { id: 'hugh', icon: '⚔️', name: 'Sheriff Hugh de Port', sub: 'Norman baron holding 54 manors' },
    { id: 'bishop_monk', icon: '⛪', name: 'Bishop Walkelin’s Bailiff', sub: 'Needs £20 for Winchester Cathedral' },
  ];
  return `
    <div class="dst-escape-box">
      <div class="dst-plate-hero">
        <img src="/images/medieval_england/source_a_bayeux_harold_oath.jpg"
             alt="Bayeux Tapestry Scene 23 — Solemn medieval oath sworn upon sacred reliquaries before an enthroned Norman lord"
             class="archival-image dst-plate-hero-img" />
        <div class="dst-plate-hero-badge">🏛️ Bayeux Tapestry Scene 23 • Sworn Testimony on Sacred Reliquaries</div>
      </div>
      <p class="dst-plate-hero-cap">
        Interrogate the witnesses below to uncover both sides of Fareham’s real 1086 tax dispute before slamming the royal gavel!
      </p>
      <div class="dst-witness-cards-grid">
        ${witnesses
          .map((w) => {
            const seen = heardSet.has(w.id);
            return `
              <button type="button" class="dst-clue-slip ${seen ? 'is-found' : ''}" data-assize-spot="${w.id}">
                <div class="dst-slip-title">${w.icon} ${w.name} ${seen ? '✓' : '🔊'}</div>
                <div class="dst-slip-body">${w.sub}</div>
              </button>
            `;
          })
          .join('')}
      </div>
    </div>
  `;
}

/**
 * ROOM 5 ARCHIVAL PLATE + STUBBINGTON HOUSEHOLD CENSUS DECODER
 */
export function renderStubbingtonArchivalDeskHTML({
  hutPeopleGroups = new Set(),
  foundPets = false,
  bennetFound = false,
} = {}) {
  const cards = [
    { id: 'edith', icon: '🥣', name: 'Edith of Stubbington (+1)', sub: 'Wife running the household—unlisted in Domesday', done: hutPeopleGroups.has('edith') },
    { id: 'five_kids', icon: '👨‍👩‍👧‍👦', name: '5 Uncounted Children (+5)', sub: 'Zero children ever named in King William’s tax book', done: hutPeopleGroups.has('five_kids') },
    { id: 'grandma', icon: '🧶', name: 'Grandma Eadgyth (+1)', sub: 'Remembers Viking raids under King Cnut—uncounted', done: hutPeopleGroups.has('grandma') },
    { id: 'untaxed_pets', icon: '🐔', name: 'Untaxed Hens & Farm Dog', sub: 'Brother Aldwin exaggerated—small poultry paid no geld', done: foundPets },
    { id: 'stumps_bennet', icon: '🥕', name: 'Tree-Stumps (Turnip #3!)', sub: '"Stubitone" = Tree-Stump Farm • Bennet’s final hideout', done: bennetFound },
  ];

  return `
    <div class="dst-escape-box">
      <div class="dst-plate-hero">
        <img src="/images/medieval_england/tres_riches_heures_peasant_hearth_f2v.jpg"
             alt="Très Riches Heures folio 2v — Cutaway medieval peasant cottage hearth, sheepfold, farmyard hens, and woodcutter among tree stumps"
             class="archival-image dst-plate-hero-img" />
        <div class="dst-plate-hero-badge">🏛️ Très Riches Heures (Musée Condé MS 65, f. 2v) • Medieval Peasant Hearth</div>
      </div>
      <p class="dst-plate-hero-cap">
        Domesday writes just <strong>"9 households"</strong> for Stubbington. Interview every uncounted member of Cottage #3 below to crack the true population!
      </p>
      <div class="dst-witness-cards-grid">
        ${cards
          .map(
            (c) => `
            <button type="button" class="dst-clue-slip ${c.done ? 'is-found' : ''}" data-b4-spot="${c.id}">
              <div class="dst-slip-title">${c.icon} ${c.name} ${c.done ? '✓' : '🔊'}</div>
              <div class="dst-slip-body">${c.sub}</div>
            </button>
          `,
          )
          .join('')}
      </div>
    </div>
  `;
}
