/**
 * THE CIPHER OF FOTHERINGHAY: ESCAPE OF MARY, QUEEN OF SCOTS (1568–1587)
 * Flagship KS3 & GCSE Cinematic History Escape Room — The History Revision Hub
 *
 * Upgraded v2:
 *  - 7 Real British Studio Voiceovers (4-Scene Cinematic Opening + 3-Scene Fotheringhay Finale)
 *    with automatic music ducking & Replay Narration button.
 *  - Working Full-Screen Mode (native Fullscreen API + fixed-viewport fallback for Arcade & Lesson Modal).
 *  - Challenging, Logically Deducible Visual-Source Puzzles Across ALL 4 Chambers:
 *      Room 1 (1568 Lochleven): Visual Evidence Inspection + 3-Stage Escape Sequence Lock
 *      Room 2 (1569–71 Ridolfi): Hans Eworth Portrait Clues + Undated Chronicle → 3-Dial Year Vault
 *      Room 3 (1583–84 Throckmorton): Saxton 1579 Map Coastline Deduction + Plausible Dispatch Sort + 1584 Bond
 *      Room 4 (1586 Babington): Real 1586 Cipher with "Nullos" Decoys (10-tile scrambled key → strip 2 Nulls → SIXMEN)
 *      Room 5 (8 Feb 1587 Fotheringhay): Crimson Wax-Seal Trap + Voiced 3-Beat Cinematic Finale
 */

import './elizabeth_mary_escape.css';
import {
  renderEscapeBrandBarHTML,
  renderEscapeCoverSealHTML,
  renderWorkbookCodeCardHTML,
} from './escape_room_brand.js';
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
    voClip: 'prologue_1',
    credit: 'THE HISTORY REVISION HUB PRESENTS • ENGLAND, 1558',
    heading: 'A Divided Realm',
    img: '/images/eee/iconic/elizabeth_i_coronation_portrait_npg_hires.jpg',
    alt: 'Coronation portrait of Queen Elizabeth I in golden robes and crown (National Portrait Gallery)',
    caption: 'National Portrait Gallery • Queen Elizabeth I (Coronation Portrait, c. 1600 after 1559 original)',
    narration:
      'In 1558, Protestant Queen Elizabeth I inherits a fractured kingdom. To Catholic Europe—and to many English nobles—she is illegitimate, and her throne sits on a knife-edge.',
  },
  {
    voClip: 'prologue_2',
    credit: 'TWO QUEENS • ONE CROWN',
    heading: 'Mary, Queen of Scots',
    img: '/images/upgraded/gcse-med-eee/eee_mary_queen_of_scots_hilliard.jpg',
    alt: 'Portrait of Mary, Queen of Scots in black velvet with golden crucifix and lace ruff',
    caption: 'Sheffield Portrait Type • Mary, Queen of Scots wearing her Catholic golden crucifix',
    narration:
      'In Scotland rules her cousin: Mary Stuart—granddaughter of Henry VII, devoutly Catholic, and next in line to the English throne. Driven from Scotland by Protestant lords, she is locked on an island fortress.',
  },
  {
    voClip: 'prologue_3',
    credit: 'THE SPYMASTER IN THE SHADOWS',
    heading: 'Sir Francis Walsingham',
    img: '/images/eee/kt2/sir_francis_walsingham_npg.jpg',
    alt: 'National Portrait Gallery portrait of Sir Francis Walsingham in black cloak holding a folded letter',
    caption: 'National Portrait Gallery • Sir Francis Walsingham, Principal Secretary & Spymaster',
    narration:
      'Elizabeth’s spymaster never sleeps. His codebreakers, double agents, and informants watch every port, every tavern, and every sealed letter crossing the Channel.',
  },
  {
    voClip: 'prologue_4',
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
    icon: '🕯️',
    text: 'Wait until dusk supper in the Great Hall while Keeper Sir William Douglas is distracted at the table.',
  },
  {
    id: 'keys',
    icon: '🗝️',
    text: 'Young accomplice Willie Douglas drops a napkin over the castle keys, steals them, and locks the tower gate behind you.',
  },
  {
    id: 'row',
    icon: '🚣',
    text: 'Slip out in disguise, row silently across Loch Leven to waiting horsemen, and ride south across the Solway Firth into England.',
  },
];

const NORFOLK_VISUAL_CLUES = [
  {
    id: 'letter',
    label: '🔍 Inspect His Left Hand',
    note: 'Look at the bottom-right corner of the portrait: Norfolk grips a rolled secret letter—foreshadowing the coded letters smuggled between him, Roberto Ridolfi, and Mary.',
  },
  {
    id: 'arms',
    label: '🛡️ Inspect the Royal Arms',
    note: 'Top-right: the Howard coat of arms displays the royal English lions. As England’s senior duke, marrying Mary would give Catholic rebels a royal English figurehead.',
  },
  {
    id: 'timeline',
    label: '📜 Read the Undated Chronicle',
    note: 'Chronicle Clue: The Northern Earls marched 1 year AFTER Mary fled Lochleven (1568). Pope Pius V excommunicated Elizabeth the VERY NEXT YEAR, and Ridolfi’s plot was exposed 1 year after the Papal Bull!',
  },
];

const ROOM3_DISPATCHES = [
  {
    id: 'd1',
    title: 'Intercepted Dispatch #1 — French Forces',
    quote:
      '“The French Duke of Guise—Mary’s Catholic cousin—will land troops on England’s southern coast, funded by Philip II of Spain and blessed by the Pope.”',
    correct: 'real',
    explain:
      'AUTHENTIC 1583 THROCKMORTON INTELLIGENCE! Francis Throckmorton carried these exact invasion plans between Mary, France, and Spanish Ambassador Mendoza.',
  },
  {
    id: 'd2',
    title: 'Intercepted Dispatch #2 — Diplomatic Fallout',
    quote:
      '“After Walsingham’s agents seized Throckmorton’s port lists, Queen Elizabeth expelled Spanish Ambassador Bernardino de Mendoza from England.”',
    correct: 'real',
    explain:
      'AUTHENTIC! Expelling Ambassador Mendoza broke diplomatic relations with Spain—accelerating the road to the 1588 Spanish Armada.',
  },
  {
    id: 'd3',
    title: 'Intercepted Dispatch #3 — Papal Policy',
    quote:
      '“In 1583, Pope Gregory XIII formally cancelled the 1570 excommunication of Queen Elizabeth and ordered English Catholics to obey her church settlement.”',
    correct: 'decoy',
    explain:
      'DECOY FORGERY! The Pope NEVER lifted Elizabeth’s excommunication—in fact, the Papacy actively backed the 1583 Throckmorton invasion plan!',
  },
];

// 10-tile SCRAMBLED Tudor Cipher Key including 2 REAL "Nullos" (decoy symbols, just like Mary's 1586 sheet!)
const SCRAMBLED_CIPHER_KEY = [
  { sym: '❖', let: 'E', isNull: false },
  { sym: '†', let: 'NULL', isNull: true },
  { sym: '☩', let: 'X', isNull: false },
  { sym: '☾', let: 'N', isNull: false },
  { sym: '⚔', let: 'S', isNull: false },
  { sym: '¤', let: 'NULL', isNull: true },
  { sym: '♛', let: 'M', isNull: false },
  { sym: '✦', let: 'I', isNull: false },
  { sym: '☉', let: 'A', isNull: false },
  { sym: '⚚', let: 'R', isNull: false },
];

// Intercepted 8-symbol beer-barrel code containing 2 NULL decoys († and ¤)
const INTERCEPTED_CODE_WITH_NULLS = ['⚔', '†', '✦', '☩', '♛', '¤', '❖', '☾'];
const CIPHER_TARGET = ['S', 'I', 'X', 'M', 'E', 'N'];

export function mountElizabethMaryEscape(stageEl, _pools = {}, ctx = {}) {
  if (!stageEl) return () => {};

  const audio = new ElizabethEscapeAudio();
  let shellEl = null;
  let unmounted = false;

  const state = {
    step: 'cover',
    isFullscreen: Boolean(ctx.autoFullscreen),
    muted: false,
    score: 0,
    prologueIdx: 0,

    // Room 1: Visual Evidence Deduction + 3-Step Sequence
    r1PlateMode: 'aerial', // start on aerial island so they see the water barrier first!
    r1VisualAnswer: null, // 'water' | 'guards'
    r1Sequence: [],
    r1Solved: false,
    r1Feedback: '',
    r1FeedbackType: '',

    // Room 2: Norfolk Portrait Visual Clues + 3-Dial Year Vault (1569 - 1570 - 1571)
    r2InspectedClues: new Set(),
    r2ActiveClueNote: '',
    r2Dials: [1568, 1572, 1574],
    r2Solved: false,
    r2Feedback: '',
    r2FeedbackType: '',

    // Room 3: Saxton 1579 Map Coastline Clue + Plausible Dispatch Sort + 1584 Bond
    r3PlateMode: 'map', // start on Saxton 1579 map so pupils inspect it directly!
    r3MapAnswer: null, // 'south' | 'north'
    r3Answers: {},
    r3BondAnswer: null,
    r3Solved: false,
    r3Feedback: '',
    r3FeedbackType: '',

    // Room 4: Babington Real Cipher with Nullos + Archival Signature Question
    r4PlateMode: 'cipher',
    r4Inputs: ['', '', '', '', '', ''],
    r4CipherUnlocked: false,
    r4WaitAnswer: null, // 'written_proof' | 'forgot'
    r4Solved: false,
    r4Feedback: '',
    r4FeedbackType: '',

    // Room 5: Fotheringhay Trap & Voiced 3-Beat Cinematic Finale
    r5Beat: 0,
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

  function playPrologueSceneVoice(idx) {
    const slide = PROLOGUE_SLIDES[idx];
    if (!slide?.voClip) return;
    audio.playVoice(slide.voClip, () => {
      if (unmounted || state.step !== 'prologue' || state.prologueIdx !== idx) return;
      if (idx < PROLOGUE_SLIDES.length - 1) {
        state.prologueIdx = idx + 1;
        render();
        playPrologueSceneVoice(state.prologueIdx);
      }
    });
  }

  function playFinaleBeatVoice(beatIdx) {
    const map = ['finale_trap', 'finale_fotheringhay', 'finale_aftermath'];
    const clip = map[beatIdx];
    if (clip) audio.playVoice(clip);
  }

  function goToStep(nextStep) {
    audio.stopVoice();
    state.step = nextStep;
    if (nextStep === 'prologue') {
      state.prologueIdx = 0;
      audio.startMusic('prologue');
      render();
      playPrologueSceneVoice(0);
    } else if (nextStep === 'room5') {
      state.r5Beat = 0;
      if (!state.r5TrapSlammed) {
        state.r5TrapSlammed = true;
        audio.waxSealSlam();
      }
      audio.startMusic('finale');
      render();
      setTimeout(() => {
        if (!unmounted && state.step === 'room5' && state.r5Beat === 0) {
          playFinaleBeatVoice(0);
        }
      }, 650);
    } else if (nextStep.startsWith('room')) {
      audio.startMusic('tension');
      render();
      audio.playVoice(`${nextStep}_entry`);
    } else {
      audio.stopMusic();
      render();
    }
    if (shellEl) shellEl.scrollTop = 0;
  }

  function toggleFullscreen() {
    const nextFs = !state.isFullscreen;
    state.isFullscreen = nextFs;
    if (typeof ctx.onFullscreenChange === 'function') {
      ctx.onFullscreenChange(nextFs);
    }
    if (nextFs) {
      if (shellEl && shellEl.requestFullscreen && !document.fullscreenElement) {
        shellEl.requestFullscreen().catch(() => {});
      }
    } else if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    render();
  }

  const onFsChange = () => {
    if (!document.fullscreenElement && state.isFullscreen && typeof ctx.onFullscreenChange !== 'function') {
      // Keep CSS fullscreen active if user didn't press Esc; only sync if native FS exited via browser chrome
    }
  };
  const onEscKey = (e) => {
    if (e.key === 'Escape' && state.isFullscreen && typeof ctx.onFullscreenChange !== 'function') {
      state.isFullscreen = false;
      render();
    }
  };
  if (typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', onFsChange);
    window.addEventListener('keydown', onEscKey);
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
    .cert { max-width: 740px; margin: 0 auto; background: #fffbeb; border: 8px double #b45309; padding: 34px 40px; }
    .kicker { font-family: sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #991b1b; text-align: center; }
    h1 { text-align: center; font-size: 30px; color: #0f172a; margin: 10px 0 4px; }
    .sub { text-align: center; font-style: italic; color: #475569; margin-bottom: 22px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; font-family: sans-serif; font-size: 13px; }
    .box { background: #fef3c7; border: 1px solid #d97706; border-radius: 8px; padding: 10px 12px; }
    .footer { display: flex; justify-content: space-between; margin-top: 28px; padding-top: 14px; border-top: 1px solid #cbd5e1; font-family: sans-serif; font-size: 12px; color: #475569; }
    @media print { body { background: #fff; padding: 0; } }
  </style>
</head>
<body>
  <div class="cert">
    <div class="kicker">THE HISTORY REVISION HUB • OFFICIAL HISTORY ESCAPE ROOMS</div>
    <h1>The Cipher of Fotheringhay</h1>
    <div class="sub">Mary, Queen of Scots &amp; The Elizabethan Plots (1568–1587)</div>
    <p style="text-align:center;font-size:15px;">This certifies that the Tudor Historian below cracked all four archival escape locks and mastered the story of Mary, Queen of Scots, Sir Francis Walsingham, and the Catholic plots against Elizabeth I.</p>
    <p style="text-align:center;font-size:18px;font-weight:bold;margin:18px 0;">Pupil Name: ______________________________ &nbsp;&nbsp; Score: ${state.score} pts</p>
    <div class="grid">
      <div class="box"><strong>1568 • Lochleven Escape:</strong> Escaped island tower to seek Elizabeth’s protection in England.</div>
      <div class="box"><strong>1569–71 • Northern Earls &amp; Ridolfi:</strong> Northern rebellion, 1570 Papal Bull, and Duke of Norfolk’s arrest.</div>
      <div class="box"><strong>1583–84 • Throckmorton &amp; Bond:</strong> Saxton’s southern coast threat exposed &amp; 1584 Bond of Association.</div>
      <div class="box"><strong>1586–87 • Babington &amp; Fotheringhay:</strong> Stripped Nullos to crack SIXMEN; executed 8 Feb 1587.</div>
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
          <button type="button" class="elz-ctrl-btn" id="elz-replay-vo-btn" title="Replay current scene narration">🔊 Replay Briefing</button>
          <button type="button" class="elz-ctrl-btn" id="elz-mute-btn">${state.muted ? '🔇 Muted' : '🔊 Audio On'}</button>
          <button type="button" class="elz-ctrl-btn" id="elz-fs-btn">${state.isFullscreen ? '⤢ Exit Full' : '⛶ Full Screen'}</button>
          ${ctx.onCloseModal ? `<button type="button" class="elz-ctrl-btn" id="elz-close-btn">✕ Close</button>` : ''}
        </div>
      </div>
    `;
  }

  function renderEscapeTrailStripHTML() {
    const nodes = [
      { step: 'room1', year: '1568 • Lock #1', name: 'Lochleven Island', sub: 'Aerial source & boat escape', done: state.r1Solved },
      { step: 'room2', year: '1569–71 • Lock #2', name: 'Northern Earls & Ridolfi', sub: 'Norfolk portrait & year vault', done: state.r2Solved },
      { step: 'room3', year: '1583–84 • Lock #3', name: 'Throckmorton Plot', sub: 'Saxton 1579 map & 1584 Bond', done: state.r3Solved },
      { step: 'room4', year: 'July 1586 • Lock #4', name: 'Babington Cipher', sub: 'Strip Nullos → SIXMEN', done: state.r4Solved },
      { step: 'room5', year: '8 Feb 1587 • Finale', name: 'Fotheringhay Hall', sub: 'Walsingham’s trap & Armada', done: state.r5TrapSlammed },
    ];
    return `
      <div class="elz-trail-strip" aria-label="Mary Queen of Scots Escape Trail">
        ${nodes
          .map(
            (n) => `
          <button type="button" class="elz-trail-node ${n.done ? 'is-unlocked' : ''}" data-elz-step="${n.step}">
            <span class="elz-trail-year">${n.done ? '🔓 ' : '🔒 '}${n.year}</span>
            <span class="elz-trail-name">${n.name}</span>
            <span class="elz-trail-sub">${n.sub}</span>
          </button>
        `,
          )
          .join('')}
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
              <div class="elz-kicker">🎬 VOICED CINEMATIC TUDOR ESCAPE ROOM • ELIZABETH I &amp; THE PLOTS</div>
              <h2 class="elz-title">THE CIPHER OF FOTHERINGHAY</h2>
              <p class="elz-sub">
                Step into the shoes of <strong>Mary, Queen of Scots (1568–1587)</strong>. Watch the <strong>Studio-voiced Tudor opening</strong>, inspect authentic portraits, maps, and 1586 cipher sheets to crack four challenging historical locks—while <strong>Sir Francis Walsingham</strong> quietly closes the spymaster’s net.
              </p>
              <div class="elz-pills-row">
                <span class="elz-pill">🎙️ Voiced Tudor Cinema</span>
                <span class="elz-pill">🗝️ Room 1: Lochleven</span>
                <span class="elz-pill">🔐 Room 2: 1569–71 Vault</span>
                <span class="elz-pill">🗺️ Room 3: Saxton Map</span>
                <span class="elz-pill">🍺 Room 4: Nullos Cipher</span>
                <span class="elz-pill">🪓 Room 5: Fotheringhay</span>
              </div>
            </div>

            <div class="elz-cta-stack">
              <button type="button" class="elz-primary-cta" id="elz-start-cinema-btn">
                🎬 WATCH VOICED CINEMATIC OPENING &amp; ENTER ROOM 1
              </button>
              <button type="button" class="elz-secondary-cta" id="elz-skip-to-r1-btn">
                ⚡ Skip Opening Credits → Jump Straight to Room 1 (Lochleven Castle)
              </button>
            </div>
          </div>
        </div>
        ${renderEscapeTrailStripHTML()}
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
          <span>SCENE ${state.prologueIdx + 1} OF ${PROLOGUE_SLIDES.length} • 🎙️ STUDIO VOICEOVER</span>
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
              <button type="button" class="elz-secondary-cta" style="width:auto;padding:10px 14px;" id="elz-replay-vo-btn">🔊 Replay Voiceover</button>
              <button type="button" class="elz-secondary-cta" style="width:auto;padding:10px 14px;" data-elz-step="room1">Skip Prologue →</button>
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
          <span style="color:#94a3b8;font-size:0.68rem;">British Studio Narration + Tudor Lute Score • 100% Authentic Archival Plates</span>
        </div>
        ${renderEscapeTrailStripHTML()}
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
        ? 'Visual Clue A • Lochleven Castle Island, Kinross-shire — inspect the geography around the stone tower.'
        : 'Visual Clue B • Historical Painting of Mary stepping onto the wooden boat plank at dusk (2 May 1568) guided by inside accomplices.';

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
                  ${state.r1PlateMode === 'aerial' ? '🎨 Switch to 1568 Escape Painting' : '🗺️ Switch to Island Fortress'}
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
              <strong>Step A — Inspect the Visual Source:</strong> Look closely at the aerial photograph of Lochleven Castle on the left. Why was a direct cavalry rescue impossible, forcing Mary to rely on an inside accomplice?
            </div>

            <div style="display:flex;flex-direction:column;gap:6px;">
              <button type="button" class="elz-option-btn ${state.r1VisualAnswer === 'water' ? 'is-correct' : ''}" data-r1-vis="water">
                <span>🌊</span>
                <span>The tower stands on a forested island surrounded by deep loch water—escape required stolen gate keys and a waiting rowing boat.</span>
              </button>
              <button type="button" class="elz-option-btn ${state.r1VisualAnswer === 'guards' ? 'is-wrong' : ''}" data-r1-vis="guards">
                <span>🏔️</span>
                <span>The castle sat atop an inland mountain cliff connected by a narrow stone bridge guarded by English archers.</span>
              </button>
            </div>

            ${
              state.r1VisualAnswer === 'water'
                ? `
              <div style="border-top:1px solid rgba(148,163,184,0.25);padding-top:10px;">
                <div style="font-size:0.8rem;font-weight:900;color:#fef3c7;margin-bottom:6px;">
                  Step B — Sequence Your 2 May 1568 Escape (Tap in exact logical order 1 → 2 → 3):
                </div>
                <div style="display:flex;flex-direction:column;gap:7px;">
                  ${displayOrder
                    .map((st) => {
                      const chosenPos = state.r1Sequence.indexOf(st.id);
                      const isPicked = chosenPos !== -1;
                      return `
                        <button type="button" class="elz-option-btn ${isPicked ? 'is-correct' : ''}" data-r1-step="${st.id}" ${state.r1Solved ? 'disabled' : ''}>
                          <span style="font-size:1.05rem;">${isPicked ? `✅ #${chosenPos + 1}` : st.icon}</span>
                          <span>${st.text}</span>
                        </button>
                      `;
                    })
                    .join('')}
                </div>
              </div>
            `
                : ''
            }

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
        clue: '1 year after Lochleven',
      },
      {
        idx: 1,
        label: 'Pope’s Papal Bull',
        clue: '1 year after Northern Earls',
      },
      {
        idx: 2,
        label: 'Ridolfi Plot Exposed',
        clue: '1 year after Papal Bull',
      },
    ];

    return `
      <div class="elz-room-wrap">
        <div class="elz-room-grid">
          <div class="elz-plate-frame">
            <img src="/images/upgraded/gcse-med-eee/eee_thomas_howard_norfolk_eworth.jpg"
                 alt="Hans Eworth portrait of Thomas Howard, 4th Duke of Norfolk holding a rolled letter"
                 class="elz-archival-img" />
            <div class="elz-clue-strip">
              ${NORFOLK_VISUAL_CLUES.map(
                (c) =>
                  `<button type="button" class="elz-clue-chip ${state.r2InspectedClues.has(c.id) ? 'is-inspected' : ''}" data-r2-clue="${c.id}">${state.r2InspectedClues.has(c.id) ? '✓ ' : ''}${c.label}</button>`,
              ).join('')}
            </div>
            <div class="elz-plate-caption">
              ${
                state.r2ActiveClueNote ||
                '🏛️ Hans Eworth (1563) • Thomas Howard, 4th Duke of Norfolk — tap the 3 clue buttons above to inspect the portrait & deduce the vault years!'
              }
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
              <strong>Deduce the Combination:</strong> Elizabeth placed you under house arrest! Inspect the <strong>3 Visual &amp; Chronicle Clues</strong> beneath the Duke of Norfolk’s portrait on the left to calculate the exact three consecutive years that open the conspiracy dispatch box.
            </div>

            <div class="hh-er-dial-vault">
              <div class="hh-er-dial-vault-head">
                <span class="hh-er-dial-title">🔐 3-DIAL CONSPIRACY YEAR VAULT</span>
                <span style="font-size:0.72rem;font-weight:800;color:${state.r2Solved ? '#86efac' : '#fde68a'};">
                  ${state.r2Solved ? '🔓 1569 • 1570 • 1571 UNLOCKED!' : 'Use Chronicle Clue on left to calculate each year'}
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
                  ? `<button type="button" class="elz-primary-cta" style="padding:10px 14px;font-size:0.9rem;" id="elz-r2-test-btn">🔑 TEST 3-DIAL CONSPIRACY VAULT</button>`
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
        ? 'Christopher Saxton’s 1579 Atlas of England & Wales • Look at the bottom-right corner: "GALLIAE PARS" (France) across "OCEANVS BRITANNICVS"!'
        : 'National Portrait Gallery • Sir Francis Walsingham holding an intercepted letter as his spy ring closes in at Sheffield Manor.';

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
                <h3 class="elz-room-title">Throckmorton Plot &amp; Saxton’s Map</h3>
              </div>
              <span class="elz-pill">${state.r3Solved ? '🔓 UNLOCKED' : '🔒 SEALED'}</span>
            </div>

            <div class="elz-story-box">
              <strong>Clue 1 — Inspect Saxton’s 1579 Map:</strong> Find <em>GALLIAE PARS</em> (France) at the bottom-right of the authentic 1579 map. Which English coastline sat directly opposite France for the Duke of Guise’s planned 1583 landing?
            </div>

            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="elz-ctrl-btn" style="flex:1;padding:8px 10px;${state.r3MapAnswer === 'south' ? 'border-color:#34d399;color:#a7f3d0;background:rgba(6,78,59,0.45);' : ''}" data-r3-map="south">⚓ Southern Channel Coast (Sussex)</button>
              <button type="button" class="elz-ctrl-btn" style="flex:1;padding:8px 10px;${state.r3MapAnswer === 'north' ? 'border-color:#f87171;color:#fecaca;' : ''}" data-r3-map="north">🏔️ Scottish Border (Northumberland)</button>
            </div>

            <div style="display:flex;flex-direction:column;gap:7px;">
              ${ROOM3_DISPATCHES.map((d) => {
                const ans = state.r3Answers[d.id];
                const isRight = ans === d.correct;
                return `
                  <div style="background:rgba(30,41,59,0.75);border:1px solid ${isRight ? '#34d399' : 'rgba(148,163,184,0.28)'};border-radius:10px;padding:8px 10px;">
                    <div style="font-size:0.73rem;font-weight:900;color:#fbbf24;margin-bottom:2px;">${d.title}</div>
                    <div style="font-size:0.81rem;color:#e2e8f0;font-style:italic;margin-bottom:6px;">${d.quote}</div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                      <button type="button" class="elz-ctrl-btn" style="${ans === 'real' && d.correct === 'real' ? 'border-color:#34d399;color:#a7f3d0;' : ''}" data-r3-id="${d.id}" data-r3-val="real">📜 Authentic Intelligence</button>
                      <button type="button" class="elz-ctrl-btn" style="${ans === 'decoy' && d.correct === 'decoy' ? 'border-color:#34d399;color:#a7f3d0;' : ''}" data-r3-id="${d.id}" data-r3-val="decoy">🚫 Forged Decoy</button>
                    </div>
                    ${isRight ? `<div style="font-size:0.74rem;color:#86efac;margin-top:5px;font-weight:700;">✅ ${d.explain}</div>` : ''}
                  </div>
                `;
              }).join('')}
            </div>

            <div style="border-top:1px solid rgba(148,163,184,0.25);padding-top:8px;">
              <div style="font-size:0.79rem;font-weight:900;color:#fef3c7;margin-bottom:6px;">
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
              state.r3Solved || (state.r3MapAnswer === 'south' && allDispatchesCorrect && state.r3BondAnswer === 'bond')
                ? `<button type="button" class="elz-next-btn" data-elz-step="room4">
                     🍺 Enter Room 4: Chartley Hall — The Babington Nullos Cipher (1586) →
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
        ? 'Anthony Babington (1561–1586) • Young Catholic gentleman who promised six assassins to rescue Mary.'
        : 'The National Archives (1586) • Real Babington Cipher: notice the row labelled "Nullos" (decoy symbols) and Babington’s signed confession at the bottom ("Primo Sept: 1586")!';

    return `
      <div class="elz-room-wrap">
        <div class="elz-room-grid">
          <div class="elz-plate-frame">
            <img src="${img}" alt="${caption}" class="elz-archival-img" />
            <div class="elz-plate-caption">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                <span>${caption}</span>
                <button type="button" class="elz-ctrl-btn" id="elz-r4-toggle-plate">
                  ${state.r4PlateMode === 'babington' ? '🔐 View Real 1586 Cipher Sheet' : '🧑 View Anthony Babington'}
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
              <strong>Real Tudor Cryptanalysis:</strong> Look at the authentic 1586 cipher sheet on the left—Mary and Babington hid <strong>“Nullos” (meaningless decoy symbols)</strong> inside their messages to fool codebreakers! Strip out the <strong>2 NULL symbols</strong> from the 8-symbol intercepted beer-barrel code below, then type the <strong>6 real letters</strong>!
            </div>

            <div>
              <div style="font-size:0.72rem;font-weight:900;color:#fca5a5;text-transform:uppercase;margin-bottom:4px;">
                🍺 Intercepted 8-Symbol Beer-Barrel Message (Discard the 2 NULLs!):
              </div>
              <div class="elz-intercept-strip">
                ${INTERCEPTED_CODE_WITH_NULLS.map((s) => `<span>${s}</span>`).join('')}
              </div>
            </div>

            <div>
              <div style="font-size:0.72rem;font-weight:900;color:#fbbf24;text-transform:uppercase;margin-bottom:5px;">
                🔑 Scrambled Tudor Cipher Key (Look carefully — 2 symbols are NULL decoys!):
              </div>
              <div class="elz-cipher-key-grid" style="grid-template-columns:repeat(5, minmax(0, 1fr));">
                ${SCRAMBLED_CIPHER_KEY.map(
                  (k) => `
                  <div class="elz-cipher-key-tile ${k.isNull ? 'elz-null-tile' : ''}">
                    <span class="elz-cipher-sym">${k.sym}</span>
                    <span class="elz-cipher-let" style="${k.isNull ? 'color:#fca5a5;' : ''}">= ${k.let}</span>
                  </div>
                `,
                ).join('')}
              </div>
            </div>

            <div>
              <div style="font-size:0.74rem;font-weight:800;color:#cbd5e1;margin-bottom:6px;text-align:center;">
                Enter the 6 Real Decoded Letters (in order, skipping the 2 NULLs):
              </div>
              <div class="elz-cipher-slots">
                ${[0, 1, 2, 3, 4, 5]
                  .map((idx) => {
                    const val = state.r4Inputs[idx] || '';
                    const ok = state.r4CipherUnlocked && val.toUpperCase() === CIPHER_TARGET[idx];
                    return `
                    <div class="elz-cipher-slot">
                      <span style="font-size:0.68rem;color:#94a3b8;font-weight:800;">#${idx + 1}</span>
                      <input type="text" maxlength="1" class="elz-cipher-slot-input ${ok ? 'is-matched' : ''}" data-cipher-idx="${idx}" value="${val}" aria-label="Decoded letter ${idx + 1}" ${state.r4CipherUnlocked ? 'readonly' : ''} />
                    </div>
                  `;
                  })
                  .join('')}
              </div>
              ${
                !state.r4CipherUnlocked
                  ? `<button type="button" class="elz-primary-cta" style="margin-top:8px;padding:10px 14px;font-size:0.9rem;" id="elz-r4-decode-btn">🔓 CRACK BEER-BARREL CIPHER</button>`
                  : `<div class="elz-feedback-banner is-success" style="margin-top:8px;">✅ CRACKED! Stripping the 2 Nullos († and ¤) reveals <strong>“SIXMEN”</strong>—Babington’s six assassins pledged to kill Elizabeth and free Mary!</div>`
              }
            </div>

            ${
              state.r4CipherUnlocked
                ? `
              <div style="border-top:1px solid rgba(148,163,184,0.25);padding-top:8px;">
                <div style="font-size:0.8rem;font-weight:900;color:#fef3c7;margin-bottom:6px;">
                  Final Source Clue: Look at the date at the bottom of the manuscript (“Primo Sept: 1586”). Why did Walsingham let Mary reply on 17 July instead of arresting her immediately?
                </div>
                <div style="display:flex;flex-direction:column;gap:6px;">
                  <button type="button" class="elz-option-btn ${state.r4WaitAnswer === 'written_proof' ? 'is-correct' : ''}" data-r4-wait="written_proof">
                    <span>🪶</span>
                    <span>He needed <strong>Mary’s own written approval of Elizabeth’s assassination</strong> to satisfy the 1584 Bond of Association and convince Elizabeth to sign her death warrant.</span>
                  </button>
                  <button type="button" class="elz-option-btn ${state.r4WaitAnswer === 'forgot' ? 'is-wrong' : ''}" data-r4-wait="forgot">
                    <span>⏳</span>
                    <span>Walsingham had not yet recruited any codebreakers in London and could not read Tudor ciphers until September.</span>
                  </button>
                </div>
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
                🐴 Horses are saddled outside Chartley Hall! Your coded reply is sealed inside the beer barrel—escape feels seconds away!
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
            <span>AUGUST 1586 • 🎙️ STUDIO VOICEOVER</span>
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
              <div style="display:flex;gap:10px;flex-wrap:wrap;">
                <button type="button" class="elz-primary-cta" style="width:auto;padding:11px 22px;" id="elz-r5-next-beat">
                  🔔 Enter the Great Hall of Fotheringhay (8 February 1587) →
                </button>
                <button type="button" class="elz-secondary-cta" style="width:auto;padding:10px 14px;" id="elz-replay-vo-btn">🔊 Replay Voiceover</button>
              </div>
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
            <span>8 FEBRUARY 1587 • 🎙️ STUDIO VOICEOVER</span>
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
              <div style="display:flex;gap:10px;flex-wrap:wrap;">
                <button type="button" class="elz-primary-cta" style="width:auto;padding:11px 22px;" id="elz-r5-next-beat">
                  ⛵ See the Historical Aftermath (1588 Armada &amp; 1603) →
                </button>
                <button type="button" class="elz-secondary-cta" style="width:auto;padding:10px 14px;" id="elz-replay-vo-btn">🔊 Replay Voiceover</button>
              </div>
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

            ${renderWorkbookCodeCardHTML({
              slotLabel: 'ENQUIRY 2 BACK-COVER LEDGER',
              phrase: 'WALSINGHAM’S CIPHER TRAP SEALED FOTHERINGHAY',
              instruction:
                'Copy this unlocked phrase into Slot 2 on the back cover of your Pupil Workbook. Complete every Escape Room in this unit to reveal the complete Master Verdict sentence!',
            })}

            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;">
              <button type="button" class="elz-primary-cta" style="flex:1;" id="elz-print-cert-btn">
                🖨️ Print Hub Escape Room Certificate
              </button>
              <button type="button" class="elz-secondary-cta" style="width:auto;padding:10px 14px;" id="elz-replay-vo-btn">🔊 Replay Voiceover</button>
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

  function checkRoom3Solved() {
    const allDispatchesCorrect = ROOM3_DISPATCHES.every((d) => state.r3Answers[d.id] === d.correct);
    if (state.r3MapAnswer === 'south' && allDispatchesCorrect && state.r3BondAnswer === 'bond' && !state.r3Solved) {
      state.r3Solved = true;
      addScore(35);
      audio.unlockChime();
      state.r3Feedback =
        '🔓 LOCK #3 CRACKED! You matched Saxton’s southern coast to Guise’s invasion plan, spotted the papal decoy, and locked in the 1584 Bond of Association!';
      state.r3FeedbackType = 'ok';
    }
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

      if (e.target.closest('#elz-replay-vo-btn')) {
        audio.replayVoice();
        return;
      }

      if (e.target.closest('#elz-prologue-next')) {
        if (state.prologueIdx < PROLOGUE_SLIDES.length - 1) {
          state.prologueIdx += 1;
          audio.lockClick();
          render();
          playPrologueSceneVoice(state.prologueIdx);
        }
        return;
      }

      const pDot = e.target.closest('[data-prologue-idx]');
      if (pDot) {
        state.prologueIdx = Number(pDot.getAttribute('data-prologue-idx')) || 0;
        render();
        playPrologueSceneVoice(state.prologueIdx);
        return;
      }

      if (e.target.closest('#elz-mute-btn')) {
        state.muted = !state.muted;
        audio.setMuted(state.muted);
        render();
        return;
      }

      if (e.target.closest('#elz-fs-btn')) {
        toggleFullscreen();
        return;
      }

      if (e.target.closest('#elz-close-btn')) {
        if (typeof ctx.onCloseModal === 'function') ctx.onCloseModal();
        return;
      }

      // Room 1: Visual Evidence + 3-Stage Escape Sequence
      if (e.target.closest('#elz-r1-toggle-plate')) {
        state.r1PlateMode = state.r1PlateMode === 'aerial' ? 'painting' : 'aerial';
        render();
        return;
      }

      const r1Vis = e.target.closest('[data-r1-vis]');
      if (r1Vis) {
        const val = r1Vis.getAttribute('data-r1-vis');
        state.r1VisualAnswer = val;
        if (val === 'water') {
          audio.lockClick();
          state.r1PlateMode = 'painting';
          state.r1Feedback =
            'Spot on! Lochleven stood on an island surrounded by deep water—now look at the 1568 escape painting and sequence your 3 moves!';
          state.r1FeedbackType = 'ok';
        } else {
          audio.wrongBuzzer();
          state.r1Feedback =
            'Look again at the aerial photo on the left—there is no mountain bridge! What completely surrounds the castle tower?';
          state.r1FeedbackType = 'err';
        }
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
            addScore(30);
            audio.unlockChime();
            state.r1Feedback =
              '🔓 LOCK #1 CRACKED! On 2 May 1568, Mary escaped Lochleven by boat and rode south to England—hoping Elizabeth I would restore her throne!';
            state.r1FeedbackType = 'ok';
          } else {
            state.r1Feedback = `Step ${state.r1Sequence.length}/3 locked in! Choose your next move logically...`;
            state.r1FeedbackType = 'ok';
          }
        } else {
          state.r1Sequence = [];
          audio.wrongBuzzer();
          state.r1Feedback =
            'Guard alerted! Think logically: you cannot row away before stealing the tower keys, and you cannot steal the keys before the Keeper is distracted at supper!';
          state.r1FeedbackType = 'err';
        }
        render();
        return;
      }

      // Room 2: Norfolk Visual Clues + 3-Dial Year Vault
      const r2ClueBtn = e.target.closest('[data-r2-clue]');
      if (r2ClueBtn) {
        const cid = r2ClueBtn.getAttribute('data-r2-clue');
        const found = NORFOLK_VISUAL_CLUES.find((c) => c.id === cid);
        if (found) {
          state.r2InspectedClues.add(cid);
          state.r2ActiveClueNote = found.note;
          audio.lockClick();
          render();
        }
        return;
      }

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
          addScore(35);
          audio.unlockChime();
          state.r2Feedback =
            '🔓 LOCK #2 CRACKED (1569–1570–1571)! Northern Earls (1569) → Papal Bull (1570) → Ridolfi Plot (1571). Norfolk was executed in 1572, yet Elizabeth still spared Mary!';
          state.r2FeedbackType = 'ok';
        } else {
          audio.wrongBuzzer();
          state.r2Feedback =
            'Vault jammed! Tap "📜 Read the Undated Chronicle" beneath Norfolk’s portrait and count forward from Mary’s 1568 Lochleven escape.';
          state.r2FeedbackType = 'err';
        }
        render();
        return;
      }

      // Room 3: Saxton Map Coastline + Plausible Dispatches + 1584 Bond
      if (e.target.closest('#elz-r3-toggle-plate')) {
        state.r3PlateMode = state.r3PlateMode === 'map' ? 'walsingham' : 'map';
        render();
        return;
      }

      const r3MapBtn = e.target.closest('[data-r3-map]');
      if (r3MapBtn) {
        const val = r3MapBtn.getAttribute('data-r3-map');
        state.r3MapAnswer = val;
        if (val === 'south') {
          audio.lockClick();
          state.r3Feedback =
            'Correct cartographic deduction! On Saxton’s 1579 map, Sussex & the Southern Channel coast face GALLIAE PARS (France) directly—now sort all 3 dispatches!';
          state.r3FeedbackType = 'ok';
        } else {
          audio.wrongBuzzer();
          state.r3Feedback =
            'Check the bottom-right of Saxton’s 1579 map—GALLIAE PARS (France) lies across the English Channel to the SOUTH, not Scotland!';
          state.r3FeedbackType = 'err';
        }
        checkRoom3Solved();
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
          state.r3Feedback = 'Dispatch verified! Finish all 3 dispatches, the Saxton map clue, and the 1584 law check.';
          state.r3FeedbackType = 'ok';
        } else {
          audio.wrongBuzzer();
          state.r3Feedback =
            'Check the history carefully: did the Pope EVER cancel Elizabeth’s 1570 excommunication, or did he back Catholic invasion plots?';
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
            'The Treaty of Nonsuch (1585) sent English troops to the Netherlands. Which 1584 law directly targeted plots against Elizabeth?';
          state.r3FeedbackType = 'err';
        }
        render();
        return;
      }

      // Room 4: Real Babington Cipher with Nullos + Written Proof Deduction
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
          addScore(40);
          audio.unlockChime();
          state.r4Feedback =
            'Brilliant cryptanalysis! You stripped the 2 Nullos († and ¤) to decode SIXMEN. Now answer the final archival clue below!';
          state.r4FeedbackType = 'ok';
        } else {
          audio.wrongBuzzer();
          state.r4Feedback =
            'Cipher mismatch! Ignore † (NULL) and ¤ (NULL) in "⚔ † ✦ ☩ ♛ ¤ ❖ ☾", then match the 6 remaining symbols in the scrambled key.';
          state.r4FeedbackType = 'err';
        }
        render();
        return;
      }

      const r4WaitBtn = e.target.closest('[data-r4-wait]');
      if (r4WaitBtn && state.r4CipherUnlocked && !state.r4Solved) {
        const val = r4WaitBtn.getAttribute('data-r4-wait');
        state.r4WaitAnswer = val;
        if (val === 'written_proof') {
          state.r4Solved = true;
          addScore(30);
          audio.unlockChime();
          state.r4Feedback =
            '🔓 ALL 4 LOCKS CRACKED! Your coded letter is sealed inside the Chartley Hall beer barrel. Pull the escape latch now!';
          state.r4FeedbackType = 'ok';
        } else {
          audio.wrongBuzzer();
          state.r4Feedback =
            'Walsingham’s master codebreaker Thomas Phelippes was reading Mary’s letters in real time—so why did Walsingham wait for her 17 July reply?';
          state.r4FeedbackType = 'err';
        }
        render();
        return;
      }

      // Room 5: Voiced Finale Beat Progression + Certificate
      if (e.target.closest('#elz-r5-next-beat')) {
        state.r5Beat = Math.min(2, state.r5Beat + 1);
        if (state.r5Beat === 1) audio.playBellTone(110, 2.6, 0.11);
        if (state.r5Beat === 2) audio.unlockChime();
        render();
        playFinaleBeatVoice(state.r5Beat);
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
      if (ch && idx < 5) {
        const next = shellEl.querySelector(`[data-cipher-idx="${idx + 1}"]`);
        if (next) next.focus();
      }
    });
  }

  render();

  return () => {
    unmounted = true;
    if (typeof document !== 'undefined') {
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('keydown', onEscKey);
    }
    audio.destroy();
  };
}
