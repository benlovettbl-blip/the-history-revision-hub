/**
 * THE CIPHER OF FOTHERINGHAY: ESCAPE OF MARY, QUEEN OF SCOTS (1568–1587)
 * Flagship KS3 & GCSE Cinematic History Escape Room — The History Revision Hub
 *
 * Features:
 *  - Cate Blanchett "Elizabeth"-inspired Cinematic Opening Prologue with real NPG/Tudor
 *    portraits, Ken Burns slow zoom, opening credits, and procedural Tudor lute/viol music.
 *  - Play AS Mary, Queen of Scots across 5 real historical chambers while Sir Francis
 *    Walsingham's live Threat Meter closes in:
 *      Room 1 (1568): Lochleven Castle Escape — 3-Step Escape Sequence Lock
 *      Room 2 (1569–71): Northern Earls & Ridolfi Plot — 3-Dial Conspiracy Year Vault
 *      Room 3 (1583–84): Throckmorton Plot & Walsingham's Net — Intercepted Courier Sort Lock
 *      Room 4 (July 1586): Chartley Hall — Real Tudor Babington Beer-Barrel Cipher Lock
 *      Room 5 (8 Feb 1587): Fotheringhay Castle — Dramatic Wax-Seal Trap & 3-Beat Cinematic Finale
 *  - Unified "The History Revision Hub • Official History Escape Rooms" Brand Architecture.
 */

import './elizabeth_mary_escape.css';
import { renderEscapeBrandBarHTML, renderEscapeCoverSealHTML } from './escape_room_brand.js';
import { ElizabethEscapeAudio } from './elizabeth_escape_audio.js';
import { saveArcadePersonalBest } from '../arcade/arcade_audio.js';

const STEPS = [
  { id: 'cover', label: '👑 Cover' },
  { id: 'prologue', label: '🎬 Opening' },
  { id: 'room1', label: '1. Lochleven (1568)' },
  { id: 'room2', label: '2. Ridolfi (1569–71)' },
  { id: 'room3', label: '3. Throckmorton (1583)' },
  { id: 'room4', label: '4. Babington (1586)' },
  { id: 'room5', label: '5. Fotheringhay (1587)' },
];

const PROLOGUE_SLIDES = [
  {
    credit: 'THE HISTORY REVISION HUB PRESENTS • ENGLAND, 1558',
    heading: 'A Divided Realm',
    img: '/images/eee/iconic/elizabeth_i_coronation_portrait_npg_hires.jpg',
    alt: 'Coronation portrait of Queen Elizabeth I in golden robes and crown (National Portrait Gallery)',
    caption: 'National Portrait Gallery • Queen Elizabeth I (Coronation Portrait, c. 1600 after 1559 original)',
    narration:
      'In 1558, Protestant Queen Elizabeth I inherits a fractured kingdom. To Catholic Europe—and to many English nobles—she is illegitimate, and her throne sits on a knife-edge.',
  },
  {
    credit: 'TWO QUEENS • ONE CROWN',
    heading: 'Mary, Queen of Scots',
    img: '/images/upgraded/gcse-med-eee/eee_mary_queen_of_scots_hilliard.jpg',
    alt: 'Portrait of Mary, Queen of Scots in black velvet with golden crucifix and lace ruff',
    caption: 'Sheffield Portrait Type • Mary, Queen of Scots wearing her Catholic golden crucifix',
    narration:
      'In Scotland rules her cousin: Mary Stuart—granddaughter of Henry VII, devoutly Catholic, and next in line to the English throne. Driven from Scotland by Protestant lords, she is locked on an island fortress.',
  },
  {
    credit: 'THE SPYMASTER IN THE SHADOWS',
    heading: 'Sir Francis Walsingham',
    img: '/images/eee/kt2/sir_francis_walsingham_npg.jpg',
    alt: 'National Portrait Gallery portrait of Sir Francis Walsingham in black cloak holding a folded letter',
    caption: 'National Portrait Gallery • Sir Francis Walsingham, Principal Secretary & Spymaster',
    narration:
      'Elizabeth’s spymaster never sleeps. His codebreakers, double agents, and informants watch every port, every tavern, and every sealed letter crossing the Channel.',
  },
  {
    credit: 'MAY 1568 • LOCHLEVEN CASTLE, SCOTLAND',
    heading: 'Your Escape Begins Tonight',
    img: '/images/eee/kt1/banner_l4_lochleven_castle_panorama.jpg',
    alt: 'Aerial photograph of Lochleven Castle standing on its wooded island in the middle of Loch Leven',
    caption: 'Lochleven Castle Island, Kinross-shire • Where Mary was imprisoned from June 1567 to May 1568',
    narration:
      'You are Mary, Queen of Scots. Escape this island fortress, navigate four dangerous Catholic plots using secret letters, and outwit Walsingham—before the net closes forever.',
  },
];

const ROOM1_STEPS = [
  {
    id: 'distract',
    order: 1,
    icon: '🕯️',
    text: 'Wait until dusk supper in the Great Hall while Keeper Sir William Douglas is distracted at the table.',
  },
  {
    id: 'keys',
    order: 2,
    icon: '🗝️',
    text: 'Young accomplice Willie Douglas drops a napkin over the castle keys, steals them, and locks the tower gate behind you.',
  },
  {
    id: 'row',
    order: 3,
    icon: '🚣',
    text: 'Slip out in disguise, row silently across Loch Leven to waiting horsemen, and flee south across the Solway Firth into England.',
  },
];

const ROOM3_DISPATCHES = [
  {
    id: 'd1',
    title: 'Intercepted Letter #1 — French Invasion Plan',
    quote:
      '“The French Duke of Guise—Mary’s cousin—will land Catholic troops in Sussex, funded by Philip II of Spain and blessed by the Pope.”',
    correct: 'real',
    explain:
      'TRUE THREAT (1583 Throckmorton Plot)! Francis Throckmorton acted as courier between Mary, France, and Spanish Ambassador Bernardino de Mendoza.',
  },
  {
    id: 'd2',
    title: 'Intercepted Letter #2 — Spanish Ambassador Expelled',
    quote:
      '“Walsingham’s spies have caught Francis Throckmorton with lists of Catholic ports. Elizabeth has expelled Spanish Ambassador Mendoza from England.”',
    correct: 'real',
    explain:
      'TRUE THREAT! Mendoza’s expulsion severed diplomatic ties with Spain—pushing England and Philip II closer to the 1588 Armada.',
  },
  {
    id: 'd3',
    title: 'Intercepted Letter #3 — Elizabeth’s Offer of Freedom',
    quote:
      '“Queen Elizabeth has pardoned all plotters and invited Mary to share the English throne as joint monarch in London.”',
    correct: 'decoy',
    explain:
      'FORGERY / DECOY! Instead of freeing Mary, Parliament passed the harsh 1584 Bond of Association—meaning ANYONE who benefited from a plot against Elizabeth could be executed!',
  },
];

const CIPHER_KEY = [
  { sym: '⚔', let: 'S' },
  { sym: '✦', let: 'I' },
  { sym: '☩', let: 'X' },
  { sym: '♛', let: 'M' },
  { sym: '❖', let: 'E' },
  { sym: '☾', let: 'N' },
];

const CIPHER_TARGET = ['S', 'I', 'X', 'M', 'E', 'N'];
const CIPHER_SYMBOLS = ['⚔', '✦', '☩', '♛', '❖', '☾'];

export function mountElizabethMaryEscape(stageEl, _pools = {}, ctx = {}) {
  if (!stageEl) return () => {};

  const audio = new ElizabethEscapeAudio();
  let shellEl = null;
  let unmounted = false;
  let prologueTimer = null;

  const state = {
    step: 'cover',
    isFullscreen: Boolean(ctx.autoFullscreen),
    muted: false,
    score: 0,
    prologueIdx: 0,

    // Room 1: Lochleven Escape Sequence
    r1PlateMode: 'painting', // 'painting' | 'aerial'
    r1Sequence: [],
    r1Solved: false,
    r1Feedback: '',
    r1FeedbackType: '',

    // Room 2: Northern Earls & Ridolfi 3-Dial Year Vault (1569 - 1570 - 1571)
    r2Dials: [1568, 1572, 1573],
    r2Solved: false,
    r2Feedback: '',
    r2FeedbackType: '',

    // Room 3: Throckmorton Courier Sort + 1584 Bond of Association
    r3PlateMode: 'walsingham', // 'walsingham' | 'map'
    r3Answers: {}, // { d1: 'real'|'decoy', ... }
    r3BondAnswer: null, // 'bond' | 'magna'
    r3Solved: false,
    r3Feedback: '',
    r3FeedbackType: '',

    // Room 4: Babington Beer-Barrel Cipher Lock
    r4PlateMode: 'cipher', // 'cipher' | 'babington'
    r4Inputs: ['', '', '', '', '', ''],
    r4CipherUnlocked: false,
    r4ReplyChoice: null, // 'consent' | 'refuse'
    r4Solved: false,
    r4Feedback: '',
    r4FeedbackType: '',

    // Room 5: Fotheringhay Dramatic Trap & 3-Beat Cinematic Finale
    r5Beat: 0, // 0: Trap Sprung, 1: 8 Feb 1587 Execution, 2: Armada & Union of Crowns Aftermath
    r5TrapSlammed: false,
  };

  function countLocksCracked() {
    let n = 0;
    if (state.r1Solved) n += 1;
    if (state.r2Solved) n += 1;
    if (state.r3Solved) n += 1;
    if (state.r4Solved) n += 1;
    return n;
  }

  function getWalsinghamThreatPct() {
    if (state.step === 'room5') return 100;
    if (state.r4Solved) return 94;
    if (state.r3Solved) return 75;
    if (state.r2Solved) return 50;
    if (state.r1Solved) return 28;
    return 15;
  }

  function addScore(pts) {
    state.score += pts;
    saveArcadePersonalBest('monarchy_religion_power', 'elizabeth_mary_escape', 'all', state.score);
  }

  function clearPrologueTimer() {
    if (prologueTimer) {
      clearInterval(prologueTimer);
      prologueTimer = null;
    }
  }

  function startPrologueAutoAdvance() {
    clearPrologueTimer();
    prologueTimer = setInterval(() => {
      if (unmounted || state.step !== 'prologue') {
        clearPrologueTimer();
        return;
      }
      if (state.prologueIdx < PROLOGUE_SLIDES.length - 1) {
        state.prologueIdx += 1;
        render();
      } else {
        clearPrologueTimer();
      }
    }, 6800);
  }

  function goToStep(nextStep) {
    clearPrologueTimer();
    state.step = nextStep;
    if (nextStep === 'prologue') {
      state.prologueIdx = 0;
      audio.startMusic('prologue');
      startPrologueAutoAdvance();
    } else if (nextStep === 'room5') {
      state.r5Beat = 0;
      if (!state.r5TrapSlammed) {
        state.r5TrapSlammed = true;
        audio.waxSealSlam();
      }
      audio.startMusic('finale');
    } else if (nextStep.startsWith('room')) {
      audio.startMusic('tension');
    } else {
      audio.stopMusic();
    }
    render();
    if (shellEl) shellEl.scrollTop = 0;
  }

  function openPrintableCertificate() {
    const win = window.open('', '_blank', 'width=860,height=640');
    if (!win) return;
    win.document.write(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>The History Revision Hub — Escape Room Certificate (Mary, Queen of Scots)</title>
  <style>
    body { font-family: Georgia, serif; background: #0f172a; color: #1e293b; padding: 28px; margin: 0; }
    .cert { max-width: 740px; margin: 0 auto; background: #fffbeb; border: 8px double #b45309; padding: 34px 40px; box-shadow: 0 18px 45px rgba(0,0,0,0.4); }
    .kicker { font-family: sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #991b1b; text-align: center; }
    h1 { text-align: center; font-size: 30px; color: #0f172a; margin: 10px 0 4px; }
    .sub { text-align: center; font-style: italic; color: #475569; margin-bottom: 22px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; font-family: sans-serif; font-size: 13px; }
    .box { background: #fef3c7; border: 1px solid #d97706; border-radius: 8px; padding: 10px 12px; }
    .footer { display: flex; justify-content: space-between; margin-top: 28px; padding-top: 14px; border-top: 1px solid #cbd5e1; font-family: sans-serif; font-size: 12px; color: #475569; }
    @media print { body { background: #fff; padding: 0; } .cert { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="cert">
    <div class="kicker">THE HISTORY REVISION HUB • OFFICIAL HISTORY ESCAPE ROOMS</div>
    <h1>The Cipher of Fotheringhay</h1>
    <div class="sub">Mary, Queen of Scots &amp; The Elizabethan Plots (1568–1587)</div>
    <p style="text-align:center;font-size:15px;">This certifies that the Tudor Historian below completed all Escape Room locks and mastered the story of Mary, Queen of Scots, Sir Francis Walsingham, and the Catholic plots against Elizabeth I.</p>
    <p style="text-align:center;font-size:18px;font-weight:bold;margin:18px 0;">Pupil Name: ______________________________ &nbsp;&nbsp; Score: ${state.score} pts</p>
    <div class="grid">
      <div class="box"><strong>1568 • Lochleven Escape:</strong> Escaped island fortress to seek Elizabeth’s protection in England.</div>
      <div class="box"><strong>1569–71 • Northern Earls &amp; Ridolfi:</strong> Northern rebellion, 1570 Papal Bull, and Duke of Norfolk’s arrest.</div>
      <div class="box"><strong>1583–84 • Throckmorton &amp; Bond:</strong> Walsingham exposed French/Spanish invasion plans &amp; 1584 Bond of Association.</div>
      <div class="box"><strong>1586–87 • Babington &amp; Fotheringhay:</strong> Beer-barrel cipher cracked by Phelippes; executed 8 Feb 1587.</div>
    </div>
    <div class="footer">
      <span>The History Revision Hub (historyrevisionhub.co.uk)</span>
      <span>Locks Cracked: ${countLocksCracked()}/4 • Verified Tudor Archive Edition</span>
    </div>
  </div>
  <script>window.onload = function(){ window.print(); };</script>
</body>
</html>`);
    win.document.close();
  }

  function renderTopBarHTML() {
    const threatPct = getWalsinghamThreatPct();
    return `
      ${renderEscapeBrandBarHTML({
        eraTag: 'KS3 & GCSE • TUDOR ENGLAND 1568–1587',
        locksCracked: countLocksCracked(),
        totalLocks: 4,
        extraBadge: `
          <div class="elz-threat-pill" title="Sir Francis Walsingham's Spymaster Net">
            <span>🕵️ WALSINGHAM: ${threatPct}%</span>
            <span class="elz-threat-bar-track"><span class="elz-threat-bar-fill" style="width:${threatPct}%"></span></span>
          </div>
        `,
      })}
      <div class="elz-topbar">
        <div class="elz-nav-pills">
          ${STEPS.map((s) => {
            const active = state.step === s.id;
            const done =
              (s.id === 'room1' && state.r1Solved) ||
              (s.id === 'room2' && state.r2Solved) ||
              (s.id === 'room3' && state.r3Solved) ||
              (s.id === 'room4' && state.r4Solved);
            return `<button type="button" class="elz-step-pill ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}" data-elz-step="${s.id}">${done ? '✓ ' : ''}${s.label}</button>`;
          }).join('')}
        </div>
        <div class="elz-controls">
          <span style="font-size:0.75rem;font-weight:900;color:#fde047;margin-right:4px;">⭐ ${state.score} pts</span>
          <button type="button" class="elz-ctrl-btn" id="elz-mute-btn">${state.muted ? '🔇 Muted' : '🔊 Music On'}</button>
          <button type="button" class="elz-ctrl-btn" id="elz-fs-btn">${state.isFullscreen ? '⤢ Exit Full' : '⛶ Full Screen'}</button>
          ${ctx.onCloseModal ? `<button type="button" class="elz-ctrl-btn" id="elz-close-btn">✕ Close</button>` : ''}
        </div>
      </div>
    `;
  }

  function renderCoverHTML() {
    return `
      <div class="elz-cover-wrap">
        <div class="elz-cover-grid">
          <div class="elz-plate-frame">
            <img src="/images/upgraded/gcse-med-eee/eee_mary_queen_of_scots_hilliard.jpg"
                 alt="Portrait of Mary, Queen of Scots wearing black velvet and a golden crucifix"
                 class="elz-archival-img" />
            <div class="elz-plate-caption">
              🏛️ Authentic Tudor Archive • Mary, Queen of Scots (Sheffield Portrait Type, c. 1578) — wearing her Catholic crucifix during English captivity.
            </div>
          </div>

          <div class="elz-cover-info">
            <div>
              ${renderEscapeCoverSealHTML('THE HISTORY REVISION HUB • OFFICIAL ESCAPE ROOM')}
              <div class="elz-kicker">🎬 CINEMATIC TUDOR ESCAPE ROOM • ELIZABETH I &amp; THE CATHOLIC PLOTS</div>
              <h2 class="elz-title">THE CIPHER OF FOTHERINGHAY</h2>
              <p class="elz-sub">
                Step into the shoes of <strong>Mary, Queen of Scots (1568–1587)</strong>. Escape Lochleven Castle, decode secret letters across the <strong>Northern Earls, Ridolfi, Throckmorton, and Babington Plots</strong>, and race to win your freedom—while <strong>Sir Francis Walsingham</strong> quietly closes the spymaster’s net.
              </p>
              <div class="elz-pills-row">
                <span class="elz-pill">🎬 Cinematic Tudor Opening</span>
                <span class="elz-pill">🗝️ Room 1: Lochleven Escape</span>
                <span class="elz-pill">🔐 Room 2: 1569–71 Vault</span>
                <span class="elz-pill">🕵️ Room 3: Walsingham’s Net</span>
                <span class="elz-pill">🍺 Room 4: Babington Cipher</span>
                <span class="elz-pill">🪓 Room 5: Fotheringhay Finale</span>
              </div>
            </div>

            <div class="elz-cta-stack">
              <button type="button" class="elz-primary-cta" id="elz-start-cinema-btn">
                🎬 WATCH CINEMATIC OPENING &amp; ENTER ROOM 1
              </button>
              <button type="button" class="elz-secondary-cta" id="elz-skip-to-r1-btn">
                ⚡ Skip Opening Credits → Jump Straight to Room 1 (Lochleven Castle)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderPrologueHTML() {
    const slide = PROLOGUE_SLIDES[state.prologueIdx] || PROLOGUE_SLIDES[0];
    const isLast = state.prologueIdx >= PROLOGUE_SLIDES.length - 1;
    return `
      <div class="elz-prologue-stage">
        <div class="elz-letterbox-bar">
          <span>THE HISTORY REVISION HUB • TUDOR ARCHIVE CINEMA</span>
          <span>SCENE ${state.prologueIdx + 1} OF ${PROLOGUE_SLIDES.length}</span>
        </div>

        <div class="elz-cinema-canvas">
          <div class="elz-cinema-plate-box">
            <img src="${slide.img}" alt="${slide.alt}" class="elz-cinema-img" />
            <div class="elz-plate-caption">${slide.caption}</div>
          </div>

          <div class="elz-cinema-copy">
            <div class="elz-cinema-credit">${slide.credit}</div>
            <h2 class="elz-cinema-heading">${slide.heading}</h2>
            <p class="elz-cinema-narration">${slide.narration}</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;">
              ${
                !isLast
                  ? `<button type="button" class="elz-primary-cta" style="width:auto;padding:10px 20px;" id="elz-prologue-next">Next Scene →</button>`
                  : `<button type="button" class="elz-primary-cta" style="width:auto;padding:11px 22px;" data-elz-step="room1">🗝️ ENTER ROOM 1: LOCHLEVEN CASTLE →</button>`
              }
              <button type="button" class="elz-secondary-cta" style="width:auto;padding:10px 16px;" data-elz-step="room1">Skip Prologue →</button>
            </div>
          </div>
        </div>

        <div class="elz-letterbox-bar is-bottom">
          <div class="elz-cinema-dots">
            ${PROLOGUE_SLIDES.map(
              (_, i) =>
                `<button type="button" class="elz-cinema-dot ${i === state.prologueIdx ? 'is-active' : ''}" data-prologue-idx="${i}" aria-label="Prologue Scene ${i + 1}"></button>`,
            ).join('')}
          </div>
          <span style="color:#94a3b8;font-size:0.68rem;">Procedural Tudor Lute Soundtrack • 100% Authentic Archival Plates</span>
        </div>
      </div>
    `;
  }

  function renderRoom1HTML() {
    const img =
      state.r1PlateMode === 'aerial'
        ? '/images/eee/kt1/banner_l4_lochleven_castle_panorama.jpg'
        : '/images/eee/kt1/mary_escaping_lochleven_shirreff.jpg';
    const caption =
      state.r1PlateMode === 'aerial'
        ? 'Lochleven Castle Island, Scotland • Surrounded on all sides by deep water—impossible to escape without a boat and stolen keys.'
        : 'Historical Painting • Mary, Queen of Scots escaping Lochleven Castle by boat at dusk (2 May 1568) with Willie Douglas.';

    // Display steps in scrambled puzzle order: Keys (2), Row (3), Distract (1)
    const displayOrder = [ROOM1_STEPS[1], ROOM1_STEPS[2], ROOM1_STEPS[0]];

    return `
      <div class="elz-room-wrap">
        <div class="elz-room-grid">
          <div class="elz-plate-frame">
            <img src="${img}" alt="${caption}" class="elz-archival-img" />
            <div class="elz-plate-caption">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                <span>${caption}</span>
                <button type="button" class="elz-ctrl-btn" id="elz-r1-toggle-plate">
                  ${state.r1PlateMode === 'aerial' ? '🎨 View 1568 Escape Painting' : '🗺️ View Island Fortress'}
                </button>
              </div>
            </div>
          </div>

          <div class="elz-puzzle-card">
            <div class="elz-room-header">
              <div>
                <div class="elz-room-kicker">ROOM 1 OF 5 • LOCK #1 • MAY 1568</div>
                <h3 class="elz-room-title">Escape from Lochleven Castle</h3>
              </div>
              <span class="elz-pill">${state.r1Solved ? '🔓 UNLOCKED' : '🔒 SEALED'}</span>
            </div>

            <div class="elz-story-box">
              <strong>The Situation:</strong> Scottish Protestant lords have forced you to abdicate and locked you inside an island tower. To escape to your cousin Elizabeth I in England, tap the <strong>3 escape actions in the exact historical order</strong> (1 → 2 → 3)!
            </div>

            <div style="display:flex;flex-direction:column;gap:8px;">
              ${displayOrder
                .map((st) => {
                  const chosenPos = state.r1Sequence.indexOf(st.id);
                  const isPicked = chosenPos !== -1;
                  return `
                    <button type="button" class="elz-option-btn ${isPicked ? 'is-correct' : ''}" data-r1-step="${st.id}" ${state.r1Solved ? 'disabled' : ''}>
                      <span style="font-size:1.1rem;">${isPicked ? `✅ #${chosenPos + 1}` : st.icon}</span>
                      <span>${st.text}</span>
                    </button>
                  `;
                })
                .join('')}
            </div>

            ${
              state.r1Feedback
                ? `<div class="elz-feedback-banner ${state.r1FeedbackType === 'ok' ? 'is-success' : 'is-error'}">${state.r1Feedback}</div>`
                : ''
            }

            ${
              state.r1Solved
                ? `<button type="button" class="elz-next-btn" data-elz-step="room2">
                     🐎 Ride South Into England → Enter Room 2 (1569–1571)
                   </button>`
                : ''
            }
          </div>
        </div>
      </div>
    `;
  }

  function renderRoom2HTML() {
    const dials = [
      {
        idx: 0,
        label: 'Northern Earls Revolt',
        clue: 'Earls of Northumberland & Westmorland march to free Mary',
        target: 1569,
      },
      {
        idx: 1,
        label: 'Pope’s Papal Bull',
        clue: 'Pope Pius V excommunicates Elizabeth (Regnans in Excelsis)',
        target: 1570,
      },
      {
        idx: 2,
        label: 'Ridolfi Plot Exposed',
        clue: 'Duke of Norfolk arrested for plotting to marry Mary & take the throne',
        target: 1571,
      },
    ];

    return `
      <div class="elz-room-wrap">
        <div class="elz-room-grid">
          <div class="elz-plate-frame">
            <img src="/images/upgraded/gcse-med-eee/eee_thomas_howard_norfolk_eworth.jpg"
                 alt="Hans Eworth portrait of Thomas Howard, 4th Duke of Norfolk holding a rolled letter"
                 class="elz-archival-img" />
            <div class="elz-plate-caption">
              🏛️ Hans Eworth (1563) • Thomas Howard, 4th Duke of Norfolk — England’s senior nobleman, drawn into both the 1569 Northern Earls plan and the 1571 Ridolfi Plot to marry Mary.
            </div>
          </div>

          <div class="elz-puzzle-card">
            <div class="elz-room-header">
              <div>
                <div class="elz-room-kicker">ROOM 2 OF 5 • LOCK #2 • BOLTON &amp; TUTBURY</div>
                <h3 class="elz-room-title">The Northern Earls &amp; Ridolfi Vault</h3>
              </div>
              <span class="elz-pill">${state.r2Solved ? '🔓 UNLOCKED' : '🔒 SEALED'}</span>
            </div>

            <div class="elz-story-box">
              <strong>The Trap Begins:</strong> Elizabeth did not give you an army—she placed you under house arrest! Now Catholic nobles in the North and Italian banker <strong>Roberto Ridolfi</strong> are smuggling secret letters to free you and marry you to the Duke of Norfolk. <strong>Set the 3 Tudor Brass Year Dials</strong> in exact chronological order to unseal the dispatch box!
            </div>

            <div class="hh-er-dial-vault">
              <div class="hh-er-dial-vault-head">
                <span class="hh-er-dial-title">🔐 3-DIAL CONSPIRACY CHRONOLOGY LOCK</span>
                <span style="font-size:0.72rem;font-weight:800;color:${state.r2Solved ? '#86efac' : '#fde68a'};">
                  ${state.r2Solved ? '🔓 1569 • 1570 • 1571 UNLOCKED!' : 'Dial each turning point year (1568–1574)'}
                </span>
              </div>
              <div class="hh-er-dial-grid">
                ${dials
                  .map(
                    (d) => `
                  <div class="hh-er-dial-cell ${state.r2Solved ? 'is-locked-right' : ''}">
                    <span class="hh-er-dial-label">${d.label}</span>
                    <div class="hh-er-dial-controls">
                      <button type="button" class="hh-er-dial-btn" data-r2-dial="${d.idx}" data-r2-dir="-1" ${state.r2Solved ? 'disabled' : ''}>−</button>
                      <span class="hh-er-dial-readout">${state.r2Dials[d.idx]}</span>
                      <button type="button" class="hh-er-dial-btn" data-r2-dial="${d.idx}" data-r2-dir="1" ${state.r2Solved ? 'disabled' : ''}>+</button>
                    </div>
                    <span style="font-size:0.68rem;color:#94a3b8;line-height:1.25;">${d.clue}</span>
                  </div>
                `,
                  )
                  .join('')}
              </div>
              ${
                !state.r2Solved
                  ? `<button type="button" class="elz-primary-cta" style="padding:10px 14px;font-size:0.9rem;" id="elz-r2-test-btn">🔑 TEST 3-DIAL CONSPIRACY LOCK</button>`
                  : ''
              }
            </div>

            ${
              state.r2Feedback
                ? `<div class="elz-feedback-banner ${state.r2FeedbackType === 'ok' ? 'is-success' : 'is-error'}">${state.r2Feedback}</div>`
                : ''
            }

            ${
              state.r2Solved
                ? `<button type="button" class="elz-next-btn" data-elz-step="room3">
                     🕵️ Slip Past the Guards → Enter Room 3: Sheffield Manor (1583)
                   </button>`
                : ''
            }
          </div>
        </div>
      </div>
    `;
  }

  function renderRoom3HTML() {
    const img =
      state.r3PlateMode === 'map'
        ? '/images/elizabethan_england_saxton_1579_map_auth.jpg'
        : '/images/eee/kt2/sir_francis_walsingham_npg.jpg';
    const caption =
      state.r3PlateMode === 'map'
        ? 'Christopher Saxton’s 1579 Atlas of England & Wales • Used by Walsingham’s agents to guard southern invasion ports against the French Duke of Guise.'
        : 'National Portrait Gallery • Sir Francis Walsingham — holding an intercepted letter as his spy ring tightens around Mary at Sheffield Manor.';

    const allDispatchesCorrect = ROOM3_DISPATCHES.every((d) => state.r3Answers[d.id] === d.correct);

    return `
      <div class="elz-room-wrap">
        <div class="elz-room-grid">
          <div class="elz-plate-frame">
            <img src="${img}" alt="${caption}" class="elz-archival-img" />
            <div class="elz-plate-caption">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                <span>${caption}</span>
                <button type="button" class="elz-ctrl-btn" id="elz-r3-toggle-plate">
                  ${state.r3PlateMode === 'map' ? '🕵️ View Walsingham Portrait' : '🗺️ View 1579 Saxton Map'}
                </button>
              </div>
            </div>
          </div>

          <div class="elz-puzzle-card">
            <div class="elz-room-header">
              <div>
                <div class="elz-room-kicker">ROOM 3 OF 5 • LOCK #3 • 1583–1584</div>
                <h3 class="elz-room-title">Throckmorton Plot &amp; Walsingham’s Net</h3>
              </div>
              <span class="elz-pill">${state.r3Solved ? '🔓 UNLOCKED' : '🔒 SEALED'}</span>
            </div>

            <div class="elz-story-box">
              <strong>Walsingham Is Watching:</strong> Eleven years have passed. Young Catholic courier <strong>Francis Throckmorton</strong> has been caught! Inspect the <strong>3 intercepted dispatches</strong> below (mark each as <strong>Real Threat</strong> or <strong>Decoy</strong>), then identify the new law Parliament passed in 1584 to trap you.
            </div>

            <div style="display:flex;flex-direction:column;gap:8px;">
              ${ROOM3_DISPATCHES.map((d) => {
                const ans = state.r3Answers[d.id];
                const isRight = ans === d.correct;
                return `
                  <div style="background:rgba(30,41,59,0.75);border:1px solid ${isRight ? '#34d399' : 'rgba(148,163,184,0.28)'};border-radius:10px;padding:9px 11px;">
                    <div style="font-size:0.74rem;font-weight:900;color:#fbbf24;margin-bottom:3px;">${d.title}</div>
                    <div style="font-size:0.82rem;color:#e2e8f0;font-style:italic;margin-bottom:7px;">${d.quote}</div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                      <button type="button" class="elz-ctrl-btn ${ans === 'real' ? (d.correct === 'real' ? 'is-done' : '') : ''}" style="${ans === 'real' && d.correct === 'real' ? 'border-color:#34d399;color:#a7f3d0;' : ''}" data-r3-id="${d.id}" data-r3-val="real">📜 Real 1583 Threat</button>
                      <button type="button" class="elz-ctrl-btn" style="${ans === 'decoy' && d.correct === 'decoy' ? 'border-color:#34d399;color:#a7f3d0;' : ''}" data-r3-id="${d.id}" data-r3-val="decoy">🚫 Forged Decoy</button>
                    </div>
                    ${isRight ? `<div style="font-size:0.75rem;color:#86efac;margin-top:6px;font-weight:700;">✅ ${d.explain}</div>` : ''}
                  </div>
                `;
              }).join('')}
            </div>

            <div style="border-top:1px solid rgba(148,163,184,0.25);padding-top:10px;">
              <div style="font-size:0.8rem;font-weight:900;color:#fef3c7;margin-bottom:6px;">
                Final Lock Check: Which 1584 law declared that if ANY plot targeted Elizabeth, Mary could be tried and executed?
              </div>
              <div style="display:flex;flex-direction:column;gap:6px;">
                <button type="button" class="elz-option-btn ${state.r3BondAnswer === 'bond' ? 'is-correct' : ''}" data-r3-bond="bond">
                  <span>⚖️</span>
                  <span><strong>The Bond of Association (1584)</strong> — stripping Mary of her claim and authorising her execution if she consented to a plot.</span>
                </button>
                <button type="button" class="elz-option-btn ${state.r3BondAnswer === 'magna' ? 'is-wrong' : ''}" data-r3-bond="magna">
                  <span>📜</span>
                  <span><strong>The Treaty of Nonsuch (1585)</strong> — an alliance sending English troops to the Netherlands.</span>
                </button>
              </div>
            </div>

            ${
              state.r3Feedback
                ? `<div class="elz-feedback-banner ${state.r3FeedbackType === 'ok' ? 'is-success' : 'is-error'}">${state.r3Feedback}</div>`
                : ''
            }

            ${
              state.r3Solved || (allDispatchesCorrect && state.r3BondAnswer === 'bond')
                ? `<button type="button" class="elz-next-btn" data-elz-step="room4">
                     🍺 Enter Room 4: Chartley Hall — The Babington Beer-Barrel Cipher (1586) →
                   </button>`
                : ''
            }
          </div>
        </div>
      </div>
    `;
  }

  function renderRoom4HTML() {
    const img =
      state.r4PlateMode === 'babington'
        ? '/images/upgraded/gcse-med-eee/eee_anthony_babington_portrait.jpg'
        : '/images/babington_cipher.jpg';
    const caption =
      state.r4PlateMode === 'babington'
        ? 'Anthony Babington (1561–1586) • Young Catholic gentleman who promised to rescue Mary with six assassins.'
        : 'The National Archives (1586) • Authentic Babington ciphered letter (top) and Anthony Babington’s signed symbol key (bottom, 1 Sept 1586).';

    return `
      <div class="elz-room-wrap">
        <div class="elz-room-grid">
          <div class="elz-plate-frame">
            <img src="${img}" alt="${caption}" class="elz-archival-img" />
            <div class="elz-plate-caption">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                <span>${caption}</span>
                <button type="button" class="elz-ctrl-btn" id="elz-r4-toggle-plate">
                  ${state.r4PlateMode === 'babington' ? '🔐 View Real 1586 Cipher Key' : '🧑 View Anthony Babington'}
                </button>
              </div>
            </div>
          </div>

          <div class="elz-puzzle-card">
            <div class="elz-room-header">
              <div>
                <div class="elz-room-kicker">ROOM 4 OF 5 • FINAL LOCK #4 • CHARTLEY HALL, JULY 1586</div>
                <h3 class="elz-room-title">The Babington Beer-Barrel Cipher</h3>
              </div>
              <span class="elz-pill">${state.r4Solved ? '🔓 FREEDOM IN SIGHT!' : '🔒 CIPHER SEALED'}</span>
            </div>

            <div class="elz-story-box">
              <strong>Your Last Chance to Escape!</strong> A sympathetic brewer is smuggling waterproof leather packets inside the bungs of Chartley Hall’s beer barrels! Young Catholic nobleman <strong>Anthony Babington</strong> has written to free you. Use the <strong>Tudor Symbol Cipher Key</strong> to decode the hidden six-letter code inside the barrel!
            </div>

            <div>
              <div style="font-size:0.72rem;font-weight:900;color:#fbbf24;text-transform:uppercase;margin-bottom:5px;">
                🔑 Tudor Symbol Substitution Key (Match Each Symbol Below):
              </div>
              <div class="elz-cipher-key-grid">
                ${CIPHER_KEY.map(
                  (k) => `
                  <div class="elz-cipher-key-tile">
                    <span class="elz-cipher-sym">${k.sym}</span>
                    <span class="elz-cipher-let">= ${k.let}</span>
                  </div>
                `,
                ).join('')}
              </div>
            </div>

            <div>
              <div style="font-size:0.74rem;font-weight:800;color:#cbd5e1;margin-bottom:6px;text-align:center;">
                Decode Babington’s Secret Code (Type 1 letter under each symbol — Hint: who will strike Elizabeth?):
              </div>
              <div class="elz-cipher-slots">
                ${CIPHER_SYMBOLS.map((sym, idx) => {
                  const val = state.r4Inputs[idx] || '';
                  const ok = val.toUpperCase() === CIPHER_TARGET[idx];
                  return `
                    <div class="elz-cipher-slot">
                      <span class="elz-cipher-sym">${sym}</span>
                      <input type="text" maxlength="1" class="elz-cipher-slot-input ${ok ? 'is-matched' : ''}" data-cipher-idx="${idx}" value="${val}" aria-label="Cipher letter ${idx + 1}" ${state.r4CipherUnlocked ? 'readonly' : ''} />
                    </div>
                  `;
                }).join('')}
              </div>
              ${
                !state.r4CipherUnlocked
                  ? `<button type="button" class="elz-primary-cta" style="margin-top:8px;padding:10px 14px;font-size:0.9rem;" id="elz-r4-decode-btn">🔓 DECODE BEER-BARREL MESSAGE</button>`
                  : `<div class="elz-feedback-banner is-success" style="margin-top:8px;">✅ DECODED: <strong>“SIX MEN”</strong> — Babington promises six noble gentlemen will assassinate Elizabeth and ride to Chartley Hall to set you free!</div>`
              }
            </div>

            ${
              state.r4CipherUnlocked
                ? `
              <div style="border-top:1px solid rgba(148,163,184,0.25);padding-top:10px;">
                <div style="font-size:0.82rem;font-weight:900;color:#fef3c7;margin-bottom:6px;">
                  17 July 1586 — Seal Your Coded Reply Inside the Beer Barrel:
                </div>
                <button type="button" class="elz-option-btn ${state.r4ReplyChoice === 'consent' ? 'is-correct' : ''}" data-r4-reply="consent">
                  <span>🪶</span>
                  <span><strong>Approve Babington’s Plan:</strong> “When all is ready, set the six gentlemen to work—and ride to Chartley to free me!”</span>
                </button>
              </div>
            `
                : ''
            }

            ${
              state.r4Feedback
                ? `<div class="elz-feedback-banner ${state.r4FeedbackType === 'ok' ? 'is-success' : 'is-error'}">${state.r4Feedback}</div>`
                : ''
            }

            ${
              state.r4Solved
                ? `
              <div style="background:rgba(6,78,59,0.55);border:1.5px solid #34d399;border-radius:10px;padding:10px 12px;font-size:0.83rem;color:#d1fae5;font-weight:800;">
                🐴 Horses are saddled outside Chartley Hall! The beer-barrel reply is sealed and sent—escape is moments away!
              </div>
              <button type="button" class="elz-next-btn is-trap-latch" data-elz-step="room5">
                🔓 PULL THE FINAL ESCAPE LATCH — RIDE TO FREEDOM! →
              </button>
            `
                : ''
            }
          </div>
        </div>
      </div>
    `;
  }

  function renderRoom5FinaleHTML() {
    if (state.r5Beat === 0) {
      return `
        <div class="elz-prologue-stage">
          <div class="elz-letterbox-bar">
            <span style="color:#f87171;">⚠️ DISASTER STRIKES • WALSINGHAM’S TRAP SPRUNG</span>
            <span>AUGUST 1586 • CHARTLEY HALL</span>
          </div>
          <div class="elz-cinema-canvas">
            <div class="elz-cinema-plate-box">
              <img src="/images/eee/kt2/sir_francis_walsingham_npg.jpg"
                   alt="Sir Francis Walsingham holding an intercepted letter"
                   class="elz-cinema-img" />
              <div class="elz-plate-caption">Sir Francis Walsingham • Master of the Double-Agent Beer-Barrel Trap</div>
            </div>
            <div class="elz-cinema-copy">
              <div class="elz-trap-banner">
                <div style="font-size:0.78rem;font-weight:900;letter-spacing:0.14em;color:#fca5a5;">CRIMSON WAX SEAL • THE DOOR SLAMS SHUT</div>
                <div style="font-family:'Playfair Display',Georgia,serif;font-size:1.5rem;font-weight:900;color:#fef3c7;margin-top:4px;">THERE WAS NEVER AN ESCAPE.</div>
              </div>
              <p class="elz-cinema-narration">
                The “sympathetic” courier <strong>Gilbert Gifford</strong> was a double agent working for Walsingham from the very first day. Every single beer-barrel letter went straight to master codebreaker <strong>Thomas Phelippes</strong>—who even forged a gallows-marked postscript asking for the six assassins’ names!
              </p>
              <p class="elz-cinema-narration" style="font-size:0.95rem;color:#fde68a;">
                Under the 1584 Bond of Association, Mary’s own coded reply sealed her fate. In October 1586 she was put on trial for treason—and on 1 February 1587, Elizabeth I finally signed the death warrant.
              </p>
              <button type="button" class="elz-primary-cta" style="width:auto;padding:11px 22px;" id="elz-r5-next-beat">
                🔔 Enter the Great Hall of Fotheringhay (8 February 1587) →
              </button>
            </div>
          </div>
        </div>
      `;
    }

    if (state.r5Beat === 1) {
      return `
        <div class="elz-prologue-stage">
          <div class="elz-letterbox-bar">
            <span>FOTHERINGHAY CASTLE • NORTHAMPTONSHIRE</span>
            <span>8 FEBRUARY 1587 • 8:00 AM</span>
          </div>
          <div class="elz-cinema-canvas">
            <div class="elz-cinema-plate-box">
              <img src="/images/mary_queen_of_scots_execution_fotheringhay_1587.jpg"
                   alt="Contemporary 1587 engraving of the execution of Mary, Queen of Scots in the Great Hall of Fotheringhay Castle"
                   class="elz-cinema-img" />
              <div class="elz-plate-caption">
                🏛️ Contemporary 1587 Dutch Engraving • The Great Hall at Fotheringhay (left: Mary’s bloodstained clothes being burned in the hearth so Catholics could not keep relics).
              </div>
            </div>
            <div class="elz-cinema-copy">
              <div class="elz-cinema-credit">THE GREAT HALL • ONE OF THE MOST FAMOUS EXECUTIONS IN HISTORY</div>
              <h2 class="elz-cinema-heading">Crimson Beneath the Black</h2>
              <p class="elz-cinema-narration">
                Three hundred witnesses fill the candlelit hall. Mary mounts the black-draped scaffold calmly. When her ladies-in-waiting unfasten her black satin outer gown, the crowd gasps: underneath, she wears a bodice and petticoat of <strong>bright crimson velvet</strong>—the liturgical colour of a Catholic martyr.
              </p>
              <p class="elz-cinema-narration" style="font-size:0.95rem;color:#cbd5e1;">
                Whispering in Latin, <em>“In manus tuas, Domine”</em> (“Into thy hands, O Lord”), she lays her head upon the oak block. After three heavy blows of the axe, her long captivity ends—and the executioner’s cry rings out: <em>“So perish all the Queen’s enemies!”</em>
              </p>
              <button type="button" class="elz-primary-cta" style="width:auto;padding:11px 22px;" id="elz-r5-next-beat">
                ⛵ See the Historical Aftermath (1588 Armada &amp; 1603) →
              </button>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="elz-room-wrap">
        <div class="elz-room-grid">
          <div class="elz-plate-frame">
            <img src="/images/eee/kt2/wieringen_spanish_armada_banner.jpg"
                 alt="Cornelis Claesz van Wieringen painting of the 1588 Spanish Armada battle at sea"
                 class="elz-archival-img" />
            <div class="elz-plate-caption">
              🏛️ Cornelis Claesz van Wieringen • The Spanish Armada (1588) — King Philip II of Spain launched his invasion fleet the very next year, claiming vengeance for Mary’s execution.
            </div>
          </div>

          <div class="elz-puzzle-card">
            <div class="elz-room-header">
              <div>
                <div class="elz-room-kicker">ESCAPE ROOM COMPLETE • HISTORICAL AFTERMATH</div>
                <h3 class="elz-room-title">History’s Greatest Twist (1588 &amp; 1603)</h3>
              </div>
              <span class="elz-pill" style="border-color:#34d399;color:#a7f3d0;">🏆 ${state.score} PTS</span>
            </div>

            <div class="elz-story-box">
              <strong>1. Immediate Consequence (1588):</strong> Executing an anointed Catholic queen outraged Europe and gave Philip II of Spain the final justification to launch the <strong>Spanish Armada</strong> against England.<br /><br />
              <strong>2. The Ultimate Irony (1603):</strong> Elizabeth I died childless sixteen years later. Who inherited the English throne? <strong>Mary’s own son, King James VI of Scotland</strong>—uniting the crowns as <strong>King James I of England</strong>! Mary’s bloodline sits on the British throne to this day.
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.78rem;">
              <div style="background:rgba(30,41,59,0.8);border:1px solid rgba(52,211,153,0.4);border-radius:8px;padding:8px 10px;">
                <strong style="color:#fde047;">✓ 1568 Lochleven</strong><br />Escaped to England
              </div>
              <div style="background:rgba(30,41,59,0.8);border:1px solid rgba(52,211,153,0.4);border-radius:8px;padding:8px 10px;">
                <strong style="color:#fde047;">✓ 1569–71 Plots</strong><br />Northern Earls &amp; Ridolfi
              </div>
              <div style="background:rgba(30,41,59,0.8);border:1px solid rgba(52,211,153,0.4);border-radius:8px;padding:8px 10px;">
                <strong style="color:#fde047;">✓ 1583–84 Net</strong><br />Throckmorton &amp; Bond
              </div>
              <div style="background:rgba(30,41,59,0.8);border:1px solid rgba(52,211,153,0.4);border-radius:8px;padding:8px 10px;">
                <strong style="color:#fde047;">✓ 1586–87 End</strong><br />Babington &amp; Fotheringhay
              </div>
            </div>

            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;">
              <button type="button" class="elz-primary-cta" style="flex:1;" id="elz-print-cert-btn">
                🖨️ Print Hub Escape Room Certificate
              </button>
              <button type="button" class="elz-secondary-cta" style="width:auto;padding:10px 16px;" data-elz-step="cover">
                ↺ Replay From Cover
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function render() {
    if (unmounted || !stageEl.isConnected) return;
    if (!shellEl || !shellEl.isConnected) {
      stageEl.innerHTML = `<div class="elz-shell ${state.isFullscreen ? 'elz-is-fullscreen' : ''}"></div>`;
      shellEl = stageEl.querySelector('.elz-shell');
      bindEvents();
    }
    shellEl.classList.toggle('elz-is-fullscreen', state.isFullscreen);

    let body = '';
    if (state.step === 'cover') body = renderCoverHTML();
    else if (state.step === 'prologue') body = renderPrologueHTML();
    else if (state.step === 'room1') body = renderRoom1HTML();
    else if (state.step === 'room2') body = renderRoom2HTML();
    else if (state.step === 'room3') body = renderRoom3HTML();
    else if (state.step === 'room4') body = renderRoom4HTML();
    else body = renderRoom5FinaleHTML();

    shellEl.innerHTML = `${renderTopBarHTML()}${body}`;
  }

  function bindEvents() {
    shellEl.addEventListener('click', (e) => {
      const stepBtn = e.target.closest('[data-elz-step]');
      if (stepBtn) {
        goToStep(stepBtn.getAttribute('data-elz-step'));
        return;
      }

      if (e.target.closest('#elz-start-cinema-btn')) {
        goToStep('prologue');
        return;
      }

      if (e.target.closest('#elz-skip-to-r1-btn')) {
        goToStep('room1');
        return;
      }

      if (e.target.closest('#elz-prologue-next')) {
        if (state.prologueIdx < PROLOGUE_SLIDES.length - 1) {
          state.prologueIdx += 1;
          audio.lockClick();
          render();
        }
        return;
      }

      const pDot = e.target.closest('[data-prologue-idx]');
      if (pDot) {
        state.prologueIdx = Number(pDot.getAttribute('data-prologue-idx')) || 0;
        render();
        return;
      }

      if (e.target.closest('#elz-mute-btn')) {
        state.muted = !state.muted;
        audio.setMuted(state.muted);
        render();
        return;
      }

      if (e.target.closest('#elz-fs-btn')) {
        state.isFullscreen = !state.isFullscreen;
        if (typeof ctx.onFullscreenChange === 'function') {
          ctx.onFullscreenChange(state.isFullscreen);
        }
        render();
        return;
      }

      if (e.target.closest('#elz-close-btn')) {
        if (typeof ctx.onCloseModal === 'function') ctx.onCloseModal();
        return;
      }

      // Room 1: Lochleven Escape Sequence
      if (e.target.closest('#elz-r1-toggle-plate')) {
        state.r1PlateMode = state.r1PlateMode === 'aerial' ? 'painting' : 'aerial';
        render();
        return;
      }

      const r1Btn = e.target.closest('[data-r1-step]');
      if (r1Btn && !state.r1Solved) {
        const pickedId = r1Btn.getAttribute('data-r1-step');
        const expectedOrder = ['distract', 'keys', 'row'];
        const nextIdx = state.r1Sequence.length;
        if (pickedId === expectedOrder[nextIdx]) {
          state.r1Sequence.push(pickedId);
          audio.lockClick();
          if (state.r1Sequence.length === 3) {
            state.r1Solved = true;
            addScore(25);
            audio.unlockChime();
            state.r1Feedback =
              '🔓 LOCK #1 CRACKED! On 2 May 1568, Mary escaped Lochleven by boat and rode south to England—hoping Queen Elizabeth I would restore her throne!';
            state.r1FeedbackType = 'ok';
          } else {
            state.r1Feedback = `Step ${state.r1Sequence.length}/3 locked in! Choose your next move carefully...`;
            state.r1FeedbackType = 'ok';
          }
        } else {
          state.r1Sequence = [];
          audio.wrongBuzzer();
          state.r1Feedback =
            'Guard alerted! Think chronologically: first distract the Keeper at supper, then steal the keys, then row across Loch Leven!';
          state.r1FeedbackType = 'err';
        }
        render();
        return;
      }

      // Room 2: Northern Earls & Ridolfi 3-Dial Lock
      const r2Dial = e.target.closest('[data-r2-dial]');
      if (r2Dial && !state.r2Solved) {
        const idx = Number(r2Dial.getAttribute('data-r2-dial'));
        const dir = Number(r2Dial.getAttribute('data-r2-dir'));
        state.r2Dials[idx] = Math.max(1568, Math.min(1574, state.r2Dials[idx] + dir));
        audio.lockClick();
        render();
        return;
      }

      if (e.target.closest('#elz-r2-test-btn')) {
        if (state.r2Dials[0] === 1569 && state.r2Dials[1] === 1570 && state.r2Dials[2] === 1571) {
          state.r2Solved = true;
          addScore(30);
          audio.unlockChime();
          state.r2Feedback =
            '🔓 LOCK #2 CRACKED (1569–1570–1571)! The Northern Earls revolt was crushed, the Pope excommunicated Elizabeth, and Norfolk was executed in 1572—yet Elizabeth still refused to execute Mary!';
          state.r2FeedbackType = 'ok';
        } else {
          audio.wrongBuzzer();
          state.r2Feedback =
            'Lock jammed! Check the exact sequence: Northern Earls (1569) → Papal Bull (1570) → Ridolfi Plot (1571).';
          state.r2FeedbackType = 'err';
        }
        render();
        return;
      }

      // Room 3: Throckmorton Courier Sort + 1584 Bond of Association
      if (e.target.closest('#elz-r3-toggle-plate')) {
        state.r3PlateMode = state.r3PlateMode === 'map' ? 'walsingham' : 'map';
        render();
        return;
      }

      const r3Btn = e.target.closest('[data-r3-id]');
      if (r3Btn) {
        const id = r3Btn.getAttribute('data-r3-id');
        const val = r3Btn.getAttribute('data-r3-val');
        const item = ROOM3_DISPATCHES.find((d) => d.id === id);
        state.r3Answers[id] = val;
        if (item && item.correct === val) {
          audio.lockClick();
          state.r3Feedback = 'Dispatch verified! Complete all 3 dispatches and the 1584 law check.';
          state.r3FeedbackType = 'ok';
        } else {
          audio.wrongBuzzer();
          state.r3Feedback =
            'Careful—check whether Elizabeth ever offered to share her throne, or if French/Spanish invasion plans were real!';
          state.r3FeedbackType = 'err';
        }
        checkRoom3Solved();
        render();
        return;
      }

      const bondBtn = e.target.closest('[data-r3-bond]');
      if (bondBtn) {
        const val = bondBtn.getAttribute('data-r3-bond');
        state.r3BondAnswer = val;
        if (val === 'bond') {
          audio.lockClick();
          checkRoom3Solved();
        } else {
          audio.wrongBuzzer();
          state.r3Feedback =
            'The Treaty of Nonsuch (1585) was about the Netherlands. Which 1584 Act directly targeted plots against Elizabeth?';
          state.r3FeedbackType = 'err';
        }
        render();
        return;
      }

      // Room 4: Babington Cipher Lock
      if (e.target.closest('#elz-r4-toggle-plate')) {
        state.r4PlateMode = state.r4PlateMode === 'babington' ? 'cipher' : 'babington';
        render();
        return;
      }

      if (e.target.closest('#elz-r4-decode-btn')) {
        const entered = state.r4Inputs.map((c) => (c || '').trim().toUpperCase());
        const ok = CIPHER_TARGET.every((ch, i) => entered[i] === ch);
        if (ok) {
          state.r4CipherUnlocked = true;
          addScore(35);
          audio.unlockChime();
          state.r4Feedback =
            'Beer-barrel cipher decoded! Now seal your coded reply to Anthony Babington below...';
          state.r4FeedbackType = 'ok';
        } else {
          audio.wrongBuzzer();
          state.r4Feedback =
            'Cipher mismatch! Match each symbol above (⚔ ✦ ☩ ♛ ❖ ☾) to the Tudor Key to spell the 6-letter secret code (SIXMEN).';
          state.r4FeedbackType = 'err';
        }
        render();
        return;
      }

      const r4Reply = e.target.closest('[data-r4-reply]');
      if (r4Reply && state.r4CipherUnlocked && !state.r4Solved) {
        state.r4ReplyChoice = r4Reply.getAttribute('data-r4-reply');
        state.r4Solved = true;
        addScore(25);
        audio.unlockChime();
        state.r4Feedback =
          '🔓 ALL 4 LOCKS CRACKED! Your coded letter is sealed inside the Chartley Hall beer barrel. Pull the escape latch now!';
        state.r4FeedbackType = 'ok';
        render();
        return;
      }

      // Room 5: Finale Beat Progression + Certificate
      if (e.target.closest('#elz-r5-next-beat')) {
        state.r5Beat = Math.min(2, state.r5Beat + 1);
        if (state.r5Beat === 1) audio.playBellTone(110, 2.8, 0.12);
        if (state.r5Beat === 2) audio.unlockChime();
        render();
        return;
      }

      if (e.target.closest('#elz-print-cert-btn')) {
        openPrintableCertificate();
      }
    });

    shellEl.addEventListener('input', (e) => {
      const inp = e.target.closest('[data-cipher-idx]');
      if (!inp) return;
      const idx = Number(inp.getAttribute('data-cipher-idx'));
      const ch = (inp.value || '').slice(-1).toUpperCase();
      state.r4Inputs[idx] = ch;
      inp.value = ch;
      inp.classList.toggle('is-matched', ch === CIPHER_TARGET[idx]);
      if (ch && idx < 5) {
        const next = shellEl.querySelector(`[data-cipher-idx="${idx + 1}"]`);
        if (next) next.focus();
      }
    });
  }

  function checkRoom3Solved() {
    const allDispatchesCorrect = ROOM3_DISPATCHES.every((d) => state.r3Answers[d.id] === d.correct);
    if (allDispatchesCorrect && state.r3BondAnswer === 'bond' && !state.r3Solved) {
      state.r3Solved = true;
      addScore(30);
      audio.unlockChime();
      state.r3Feedback =
        '🔓 LOCK #3 CRACKED! Walsingham exposed the Throckmorton Plot and Parliament passed the 1584 Bond of Association—one more letter will seal your fate!';
      state.r3FeedbackType = 'ok';
    }
  }

  render();

  return () => {
    unmounted = true;
    clearPrologueTimer();
    audio.destroy();
  };
}
