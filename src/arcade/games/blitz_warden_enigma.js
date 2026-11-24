/**
 * Visual Showcase Game 2: "Put That Light Out! Blitz Warden & Bletchley Enigma Desk"
 *
 * Interactive 3-Act illustrated Home Front & Codebreaking adventure (KS2 WWII & Secondary):
 *   Act 1: 1939–1940 Blackout Street Patrol (Click glowing SVG windows to pull curtains shut + ARP decisions!)
 *   Act 2: Shelter & Evacuation Command (Visual cutaway of Anderson, Morrison, Tube & Kindertransport/Pied Piper!)
 *   Act 3: Hut 8 Bletchley Park 3-Rotor Enigma Cracker (Dial the 3 brass rotors using the 6am 'WET' weather crib!)
 *
 * 100% Pure Vector SVG Graphics & Interactive Props (Zero AI Images).
 */

import { arcadeAudio, getArcadePersonalBest, saveArcadePersonalBest } from '../arcade_audio.js';
import { generateQuestionId, recordQuestionResult } from '../../storage.js';

const SHELTER_CASES = [
  {
    family: 'The Miller Family in Coventry (Small Back Garden)',
    situation: 'Working-class family of four with a muddy back garden and £240 annual income. Air-raid sirens are wailing!',
    correctId: 'anderson',
    options: [
      {
        id: 'anderson',
        label: '🏡 Bury a curved corrugated-steel Anderson Shelter 3ft deep in the garden (covered with earth & cabbages!)',
        feedback: '✅ SPOT-ON WARDEN! Free to lower-income families with gardens—3.6 million Anderson shelters absorbed bomb blast waves brilliantly (even if they were freezing and damp)!',
      },
      {
        id: 'roof',
        label: '🔦 Stand on the attic roof with binoculars and a bright torch',
        feedback: '💥 PUT THAT LIGHT OUT! Standing on a roof with a torch breaks every ARP rule in Britain!',
      },
      {
        id: 'morrison',
        label: '🚢 Board an Atlantic U-boat in Coventry',
        feedback: '❌ Coventry is 85 miles inland—get them into their Anderson garden shelter!',
      },
    ],
  },
  {
    family: 'Mrs Patel & Twins (3rd-Floor City Tenement Flat — NO Garden!)',
    situation: '1941 Blitz! They live upstairs with nowhere to dig an Anderson shelter, and the nearest Underground station is miles away.',
    correctId: 'morrison',
    options: [
      {
        id: 'anderson',
        label: '🏡 Dig a 3-foot pit through the 3rd-floor floorboards into the neighbour’s ceiling!',
        feedback: '😂 Downstairs Mr Higgins just had a sofa land on his teapot! Anderson shelters need a garden!',
      },
      {
        id: 'morrison',
        label: '🪑 Assemble a heavy steel-topped indoor "Morrison Shelter" (doubles as the kitchen dining table by day, wire-mesh cage by night!)',
        feedback: '✅ BRILLIANT! Named after Home Secretary Herbert Morrison in March 1941, its thick steel top protected families even if the house collapsed above them!',
      },
      {
        id: 'windows',
        label: '🪟 Sit right beside untaped glass windows watching the searchlights',
        feedback: '❌ Shattering window glass caused thousands of Blitz injuries—families taped crisscross paper strips on glass and sheltered inside steel cages!',
      },
    ],
  },
  {
    family: 'Nine-Year-Old Vera Löwyová (Arriving from Prague, Summer 1939)',
    situation: 'Unaccompanied Jewish refugee girl arriving at Harwich & Liverpool Street Station with one small suitcase, a porcelain doll, and numbered tag!',
    correctId: 'kinder',
    options: [
      {
        id: 'kinder',
        label: '🚂 Welcome her through the Kindertransport rescue programme (£50 guarantee sponsor & British foster family — organized by upstanders like Nicholas Winton, Doreen Warriner & Trevor Chadwick)!',
        feedback: '💛 HISTORICALLY EXACT! Nearly 10,000 unaccompanied children were rescued on the Kindertransport (including 669 from Czechoslovakia on eight Prague trains) before war closed the borders!',
      },
      {
        id: 'landarmy',
        label: '🚜 Enlist nine-year-old Vera immediately into the adult Women’s Land Army',
        feedback: '❌ The Women’s Land Army ("Land Girls") recruited adult women to plough farms—Vera was a nine-year-old schoolgirl!',
      },
      {
        id: 'warden',
        label: '🪖 Issue her a tin helmet and put her in charge of Bletchley Park',
        feedback: '❌ Keep nine-year-old Vera safe with her British foster family!',
      },
    ],
  },
  {
    family: 'Tommy & Maisie from East London (1 September 1939 — Operation Pied Piper)',
    situation: 'Carrying gas-mask boxes on shoulder strings and cardboard luggage labels pinned to their coats at the village hall!',
    correctId: 'billeting',
    options: [
      {
        id: 'billeting',
        label: '📋 Have the local Billeting Officer match them with a safe countryside host family!',
        feedback: '✅ SPOT-ON! Operation Pied Piper moved 1.5 million children and mothers out of target cities in three days, with Billeting Officers placing children in country homes!',
      },
      {
        id: 'ration',
        label: '🥚 Give them 24 fresh eggs and 5lbs of chocolate from the Ration Book',
        feedback: '😂 In wartime rationing (from Jan 1940), a typical adult ration allowed just ONE fresh egg a week and tiny ounces of butter/sugar!',
      },
      {
        id: 'back',
        label: '🏙️ Put them straight back on the train to London Docks during the Blitz',
        feedback: '❌ London’s East End docks were prime Luftwaffe targets from 7 September 1940 ("Black Saturday")!',
      },
    ],
  },
];

function ensureBlitzStyles() {
  if (typeof document === 'undefined' || document.getElementById('bw-scoped-styles')) return;
  const style = document.createElement('style');
  style.id = 'bw-scoped-styles';
  style.textContent = `
    .bw-wrap, .bw-wrap * {
      box-sizing: border-box;
    }
    .bw-wrap {
      max-width: 900px;
      width: 100%;
      margin: 0 auto;
      overflow-x: clip;
    }
    .bw-window-target,
    .bw-window-btn,
    .bw-rotor-btn,
    .bw-rotor-letter-key,
    .bw-q1-btn,
    .bw-shelter-btn,
    .bw-q3-btn,
    .bw-wrap .arcade-btn-primary {
      min-width: 44px;
      min-height: 44px;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    .bw-shutter-grid {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 10px;
    }
    .bw-rotor-row {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }
    .bw-rotor-card {
      background: #1c1917;
      border: 2.5px solid #d97706;
      border-radius: 14px;
      padding: 10px 14px;
      min-width: 104px;
      box-shadow: inset 0 0 14px rgba(0,0,0,0.7);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }
    .bw-rotor-btn {
      appearance: none;
      background: #292524;
      border: 1.5px solid #92400e;
      color: #fde047;
      width: 100%;
      border-radius: 8px;
      padding: 6px 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 900;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    .bw-rotor-btn:hover:not(:disabled) {
      background: #451a03;
      border-color: #facc15;
    }
    .bw-rotor-letter-key {
      appearance: none;
      width: 100%;
      border-radius: 8px;
      border: 1.5px solid #57534e;
      background: #0c0a09;
      font-family: monospace;
      font-size: 1.85rem;
      font-weight: 900;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 2px 6px;
    }
    .bw-panel-card {
      background: #111827;
      border: 1.5px solid #334155;
      border-radius: 14px;
      padding: 16px;
      color: #f8fafc;
    }
    [data-theme="space"] .bw-panel-card {
      background: #0d1526;
      border-color: #334155;
      color: #f8fafc;
    }
    @media (max-width: 896px) {
      .bw-hud {
        height: 36px;
        min-height: 36px;
        max-height: 36px;
        padding: 0 10px !important;
        margin-bottom: 6px !important;
        display: flex !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 6px !important;
        border-radius: 9px !important;
        overflow: hidden;
      }
      .bw-hud .tlb-stat {
        display: inline-flex;
        align-items: baseline;
        gap: 4px;
        white-space: nowrap;
        min-width: 0;
      }
      .bw-hud .tlb-stat span {
        display: inline !important;
        font-size: 0.62rem !important;
      }
      .bw-hud .tlb-stat strong {
        font-size: 0.76rem !important;
      }
      .bw-stage-box {
        padding: 8px 9px !important;
        margin-bottom: 7px !important;
        border-radius: 12px !important;
      }
      .bw-stage-header {
        margin-bottom: 6px !important;
        gap: 5px !important;
      }
      .bw-stage-header span {
        font-size: 0.7rem !important;
      }
      .bw-wrap .diorama-viewport {
        aspect-ratio: 16 / 8;
        max-height: 148px;
        border-radius: 10px;
      }
      .bw-wrap.is-decoded-mobile .diorama-viewport {
        max-height: 108px;
      }
      .bw-window-target {
        min-width: 44px !important;
        min-height: 44px !important;
        padding: 4px 6px !important;
        font-size: 0.72rem !important;
        justify-content: center;
      }
      .bw-win-lbl-long {
        display: none;
      }
      .bw-shutter-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
        margin-top: 7px;
      }
      .bw-window-btn {
        width: 100%;
        padding: 6px 8px !important;
        font-size: 0.72rem !important;
        justify-content: center;
        display: inline-flex;
        align-items: center;
        text-align: center;
      }
      .bw-panel-card {
        padding: 10px 11px !important;
        border-radius: 12px !important;
      }
      .bw-panel-card h3,
      .bw-panel-card h4 {
        font-size: 0.92rem !important;
        line-height: 1.3 !important;
        margin-bottom: 6px !important;
      }
      .bw-panel-card p {
        font-size: 0.8rem !important;
        line-height: 1.34 !important;
        margin-bottom: 8px !important;
      }
      .bw-wrap .bsp-options {
        gap: 6px !important;
      }
      .bw-wrap .bsp-opt-btn {
        padding: 8px 10px !important;
        font-size: 0.78rem !important;
        line-height: 1.3 !important;
        gap: 8px !important;
      }
      .bw-enigma-brief {
        font-size: 0.78rem !important;
        line-height: 1.32 !important;
        margin-bottom: 8px !important;
      }
      .bw-rotor-row {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        max-width: 360px;
        margin: 0 auto 8px auto;
      }
      .bw-rotor-card {
        min-width: 0 !important;
        padding: 7px 6px !important;
        border-radius: 11px;
        gap: 4px;
      }
      .bw-rotor-letter-key {
        font-size: 1.5rem !important;
      }
      .bw-lampboard {
        padding: 7px 12px !important;
        width: 100%;
        max-width: 360px;
      }
      .bw-lampboard-word {
        font-size: 1.22rem !important;
      }
    }
    @media (max-width: 896px) and (orientation: landscape) {
      .bw-stage-grid {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 10px !important;
        align-items: start;
      }
      .bw-stage-box {
        margin-bottom: 0 !important;
      }
      .bw-wrap .diorama-viewport,
      .bw-wrap.is-decoded-mobile .diorama-viewport {
        max-height: 185px;
      }
    }
  `;
  document.head.appendChild(style);
}

export function mountBlitzWardenEnigma(stageEl, pools, ctx = {}) {
  ensureBlitzStyles();
  const unitId = ctx.unitId || 'ks2_ww2';
  let act = 1; // 1 = Blackout Street, 2 = Shelter Command, 3 = Bletchley Enigma, 4 = Victory Summary
  let score = 0;
  let xpAwarded = false;
  let pb = getArcadePersonalBest(unitId, 'blitz_warden', 'all');

  function wakeBlitzAudio() {
    const aCtx = arcadeAudio.ensureContext();
    if (aCtx) window.__hhRegisterAudioCtx?.(aCtx);
  }

  // Act 1 state: 4 lit windows that player clicks directly on the SVG!
  let windowsLit = [true, true, true, true];
  let act1QuestionDone = false;
  let act1Feedback = '';

  // Act 2 state
  let shelterIdx = 0;
  let shelterFeedback = null;

  // Act 3 Enigma Rotor state: Target Crib = ['W', 'E', 'T'] (from 6am German weather report 'WETTER')
  const ROTOR_LETTERS = ['A', 'B', 'E', 'G', 'M', 'R', 'T', 'W'];
  let rotors = [1, 4, 0]; // Starts at B - M - A; target is W(7) - E(2) - T(6)
  let enigmaDecoded = false;
  let act3QuestionDone = false;
  let act3Feedback = '';

  function resetAll() {
    wakeBlitzAudio();
    arcadeAudio.levelUp();
    act = 1;
    score = 0;
    xpAwarded = false;
    windowsLit = [true, true, true, true];
    act1QuestionDone = false;
    act1Feedback = '';
    shelterIdx = 0;
    shelterFeedback = null;
    rotors = [1, 4, 0];
    enigmaDecoded = false;
    act3QuestionDone = false;
    act3Feedback = '';
    render();
  }

  function render() {
    if (act === 1) renderAct1Blackout();
    else if (act === 2) renderAct2Shelters();
    else if (act === 3) renderAct3Enigma();
    else renderVictory();
  }

  function renderAct1Blackout() {
    const litCount = windowsLit.filter(Boolean).length;
    const allDark = litCount === 0;

    const winCoords = [
      { idx: 0, x: 44.8, y: 43.2, w: 4.8, h: 14.5, label: 'No. 4 Upstairs' },
      { idx: 1, x: 57.8, y: 64.5, w: 6.2, h: 18.0, label: "Hodges' Shopfront" },
      { idx: 2, x: 64.1, y: 39.2, w: 5.2, h: 15.5, label: 'No. 12 Bedroom' },
      { idx: 3, x: 84.8, y: 35.8, w: 5.8, h: 17.5, label: 'Corner Bakery Attic' },
    ];

    stageEl.innerHTML = `
      <div class="bw-wrap">
        <div class="tlb-hud bw-hud" style="border-color:#f59e0b;">
          <div class="tlb-stat"><span>Score</span><strong class="cyan">${score}</strong></div>
          <div class="tlb-stat"><span>Mission</span><strong class="amber">Act 1/3 • Blackout</strong></div>
          <div class="tlb-stat"><span>Windows</span><strong style="color:${allDark ? '#34d399' : '#f87171'};">${litCount} Lit</strong></div>
          <div class="tlb-stat"><span>Best</span><strong>${Math.max(pb, score)}</strong></div>
        </div>

        <div class="bw-stage-grid">
          <div class="bw-stage-box" style="background:#090d1a;border:2px solid ${allDark ? '#10b981' : '#f59e0b'};border-radius:16px;padding:14px;margin-bottom:14px;">
            <div class="bw-stage-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
              <span style="background:rgba(245,158,11,0.2);color:#fde047;padding:3px 10px;border-radius:999px;font-size:0.75rem;font-weight:900;">
                🔦 1 SEPT 1939 • ARP BLACKOUT PATROL
              </span>
              <span style="font-size:0.8rem;color:${allDark ? '#6ee7b7' : '#fde047'};font-weight:700;">
                ${allDark ? '✅ STREET 100% BLACKED OUT!' : '👆 Tap all 4 lit windows to shut curtains!'}
              </span>
            </div>

            <div class="diorama-viewport">
              <img src="/images/arcade/blitz_1_blackout.webp" alt="1939 British Blackout Street Patrol" class="diorama-img" />
              <div class="diorama-vignette"></div>
              ${winCoords
                .map((w) => {
                  const isLit = windowsLit[w.idx];
                  return isLit
                    ? `
                    <button type="button" class="diorama-hotspot bw-window-target" data-win="${w.idx}" style="left:${w.x}%;top:${w.y}%;" aria-label="Pull blackout curtain on ${w.label}" title="Pull blackout curtain on ${w.label}">
                      💡<span class="bw-win-lbl-long"> Shut Curtain!</span>
                    </button>
                  `
                    : `
                    <div class="bw-window-target" data-win="${w.idx}" style="position:absolute;left:${w.x}%;top:${w.y}%;transform:translate(-50%,-50%);width:max(${w.w}%, 44px);height:max(${w.h}%, 44px);background:rgba(12,18,32,0.92);border:1.5px solid #10b981;border-radius:6px;box-shadow:inset 0 0 8px #000;display:flex;align-items:center;justify-content:center;color:#34d399;font-size:0.76rem;font-weight:900;z-index:3;">
                      🔒
                    </div>
                  `;
                })
                .join('')}
            </div>

            ${
              !allDark
                ? `
              <!-- Accessible Quick-Shutter Buttons (Paired 1:1 with Street Windows, >=44×44px) -->
              <div class="bw-shutter-grid">
                ${winCoords
                  .map((w) => {
                    const isLit = windowsLit[w.idx];
                    return `
                      <button type="button" class="bw-window-btn" data-win="${w.idx}" ${!isLit ? 'disabled' : ''} style="background:${isLit ? '#854d0e' : '#064e3b'};border:1.5px solid ${isLit ? '#facc15' : '#10b981'};color:${isLit ? '#fef08a' : '#a7f3d0'};border-radius:8px;padding:6px 12px;font-size:0.78rem;font-weight:800;cursor:${isLit ? 'pointer' : 'default'};">
                        ${isLit ? `💡 Shut: ${w.label}` : `🔒 ${w.label}`}
                      </button>
                    `;
                  })
                  .join('')}
              </div>
            `
                : ''
            }
          </div>

          ${
            allDark
              ? `
            <div class="bw-panel-card">
              <h4 style="margin:0 0 10px 0;color:#ffffff;font-size:1.05rem;">
                🪖 ARP Chief Warden Check: Alongside heavy blackout curtains on 1 September 1939, how many gas masks had the British government issued to civilians—including red-and-blue "Mickey Mouse" masks for toddlers?
              </h4>
              <div class="bsp-options">
                <button type="button" class="bsp-opt-btn bw-q1-btn" data-ok="false" ${act1QuestionDone ? 'disabled' : ''}>
                  <span class="bsp-key">A</span><span>Only 50,000 masks for MPs and generals in Westminster</span>
                </button>
                <button type="button" class="bsp-opt-btn bw-q1-btn ${act1QuestionDone ? 'right' : ''}" data-ok="true" ${act1QuestionDone ? 'disabled' : ''}>
                  <span class="bsp-key">B</span><span>Around 38 million gas masks in cardboard shoulder-string boxes for every man, woman, and child!</span>
                </button>
                <button type="button" class="bsp-opt-btn bw-q1-btn" data-ok="false" ${act1QuestionDone ? 'disabled' : ''}>
                  <span class="bsp-key">C</span><span>None until 1944 because nobody feared poison gas</span>
                </button>
              </div>
              ${act1Feedback}
            </div>
          `
              : `
            <div class="bw-panel-card" style="display:flex;flex-direction:column;justify-content:center;">
              <div style="font-size:0.74rem;font-weight:800;color:#fde047;text-transform:uppercase;margin-bottom:4px;">WARDEN BRIEFING</div>
              <p style="margin:0;color:#cbd5e1;font-size:0.88rem;line-height:1.45;">
                Tap each of the <strong>4 exposed yellow house windows</strong> (or use the quick-shutter buttons) so Luftwaffe bombers cannot use street glow to navigate!
              </p>
            </div>
          `
          }
        </div>
      </div>
    `;

    stageEl.querySelectorAll('.bw-window-target, .bw-window-btn').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.win, 10);
        if (windowsLit[idx]) {
          wakeBlitzAudio();
          windowsLit[idx] = false;
          score += 40;
          arcadeAudio.shred();
          render();
        }
      });
    });

    stageEl.querySelectorAll('.bw-q1-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (act1QuestionDone) return;
        wakeBlitzAudio();
        act1QuestionDone = true;
        const ok = btn.dataset.ok === 'true';
        const qId = generateQuestionId(unitId, 'Blackout Patrol', '38 million gas masks');
        recordQuestionResult(
          qId,
          ok,
          {
            id: qId,
            q: 'How many civilian gas masks were issued in Britain by September 1939?',
            a: 'Around 38 million gas masks',
            source: 'Britain Prepares for War (1939)',
          },
          unitId,
        );
        if (ok) {
          score += 150;
          arcadeAudio.correct();
          act1Feedback = `<div style="margin-top:10px;margin-bottom:0;" class="tlb-banner ok">✅ Spot-on Warden! 38 million gas masks + total blackout ready! <div style="margin-top:8px;"><button type="button" class="arcade-btn-primary" id="bw-to-act2">Proceed to Act 2: Shelter Command →</button></div></div>`;
        } else {
          arcadeAudio.wrong();
          act1Feedback = `<div style="margin-top:10px;margin-bottom:0;" class="tlb-banner err">💡 Britain actually issued <strong>38 million gas masks</strong>—including bright "Mickey Mouse" masks so little children wouldn't be frightened! <div style="margin-top:8px;"><button type="button" class="arcade-btn-primary" id="bw-to-act2">Proceed to Act 2 →</button></div></div>`;
        }
        render();
      });
    });

    stageEl.querySelector('#bw-to-act2')?.addEventListener('click', () => {
      wakeBlitzAudio();
      act = 2;
      arcadeAudio.levelUp();
      render();
    });
  }

  function renderAct2Shelters() {
    const item = SHELTER_CASES[shelterIdx];
    stageEl.innerHTML = `
      <div class="bw-wrap">
        <div class="tlb-hud bw-hud" style="border-color:#10b981;">
          <div class="tlb-stat"><span>Score</span><strong class="cyan">${score}</strong></div>
          <div class="tlb-stat"><span>Mission</span><strong class="green">Act 2/3 • Shelters (${shelterIdx + 1}/${SHELTER_CASES.length})</strong></div>
          <div class="tlb-stat"><span>Best</span><strong>${Math.max(pb, score)}</strong></div>
        </div>

        <div class="bw-stage-grid">
          <!-- Illustrated Cutaway Diorama -->
          <div class="bw-stage-box" style="background:#0c1917;border:2px solid #10b981;border-radius:16px;padding:12px;margin-bottom:14px;">
            <div class="diorama-viewport">
              <img src="/images/arcade/blitz_2_shelters.webp" alt="WWII Anderson Shelter, Morrison Cage, and Evacuation Platform Cutaway" class="diorama-img" />
              <div class="diorama-vignette"></div>
              <span class="diorama-hud-chip" style="left:8px;bottom:8px;border-color:#22c55e;">🏡 Anderson</span>
              <span class="diorama-hud-chip" style="left:38%;bottom:8px;border-color:#38bdf8;">🪑 Morrison</span>
              <span class="diorama-hud-chip" style="right:8px;bottom:8px;border-color:#f59e0b;">🚂 Evacuation</span>
            </div>
          </div>

          <div class="bw-panel-card">
            <div style="font-size:0.72rem;font-weight:800;color:#34d399;text-transform:uppercase;">WARDEN DESK DISPATCH</div>
            <h3 style="margin:3px 0 6px 0;color:#ffffff;font-size:1.15rem;">${item.family}</h3>
            <p style="margin:0 0 12px 0;color:#cbd5e1;font-size:0.9rem;">${item.situation}</p>

            <div class="bsp-options">
              ${item.options
                .map((opt) => {
                  const isRight = shelterFeedback && opt.id === item.correctId;
                  const isWrong = shelterFeedback && shelterFeedback.picked === opt.id && opt.id !== item.correctId;
                  return `
                    <button type="button" class="bsp-opt-btn bw-shelter-btn ${isRight ? 'right' : ''} ${isWrong ? 'wrong' : ''}" data-id="${opt.id}" ${shelterFeedback ? 'disabled' : ''}>
                      <span>${opt.label}</span>
                    </button>
                  `;
                })
                .join('')}
            </div>

            ${
              shelterFeedback
                ? `
              <div style="margin-top:10px;margin-bottom:0;" class="tlb-banner ${shelterFeedback.ok ? 'ok' : 'err'}">
                <p style="margin:0 0 8px 0;">${shelterFeedback.text}</p>
                <button type="button" class="arcade-btn-primary" id="bw-next-shelter">
                  ${shelterIdx + 1 < SHELTER_CASES.length ? 'Next Family →' : 'Advance to Act 3: Bletchley Park Enigma →'}
                </button>
              </div>
            `
                : ''
            }
          </div>
        </div>
      </div>
    `;

    stageEl.querySelectorAll('.bw-shelter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (shelterFeedback) return;
        wakeBlitzAudio();
        const picked = btn.dataset.id;
        const chosenObj = item.options.find((o) => o.id === picked);
        const ok = picked === item.correctId;
        if (ok) {
          score += 175;
          arcadeAudio.correct();
        } else {
          arcadeAudio.wrong();
        }
        shelterFeedback = { picked, ok, text: chosenObj.feedback };
        render();
      });
    });

    stageEl.querySelector('#bw-next-shelter')?.addEventListener('click', () => {
      wakeBlitzAudio();
      shelterFeedback = null;
      if (shelterIdx + 1 < SHELTER_CASES.length) {
        shelterIdx++;
        render();
      } else {
        act = 3;
        arcadeAudio.levelUp();
        render();
      }
    });
  }

  function renderAct3Enigma() {
    const r0 = ROTOR_LETTERS[rotors[0]];
    const r1 = ROTOR_LETTERS[rotors[1]];
    const r2 = ROTOR_LETTERS[rotors[2]];
    const isAligned = r0 === 'W' && r1 === 'E' && r2 === 'T';
    if (isAligned && !enigmaDecoded) {
      enigmaDecoded = true;
      score += 250;
      arcadeAudio.levelUp();
    }

    const lampWord = enigmaDecoded ? 'U - B O A T S' : 'X - K Q P Z L';

    stageEl.innerHTML = `
      <div class="bw-wrap ${enigmaDecoded ? 'is-decoded-mobile' : ''}">
        <div class="tlb-hud bw-hud" style="border-color:#a855f7;">
          <div class="tlb-stat"><span>Score</span><strong class="cyan">${score}</strong></div>
          <div class="tlb-stat"><span>Mission</span><strong class="purple">Act 3/3 • Hut 8 Enigma</strong></div>
          <div class="tlb-stat"><span>Cipher</span><strong style="color:${enigmaDecoded ? '#34d399' : '#fde047'};">${enigmaDecoded ? '🔓 CRACKED' : '🔒 LOCKED'}</strong></div>
        </div>

        <div class="bw-stage-grid">
          <div class="bw-stage-box" style="background:linear-gradient(135deg,#1e1b4b 0%,#0f172a 100%);border:2px solid ${enigmaDecoded ? '#10b981' : '#a855f7'};border-radius:16px;padding:14px;margin-bottom:14px;text-align:center;">
            <div class="diorama-viewport" style="margin-bottom:10px;">
              <img src="/images/arcade/blitz_3_enigma.webp" alt="Hut 8 Bletchley Park Enigma & Bombe Machine" class="diorama-img" />
              <div class="diorama-vignette"></div>
              <div class="diorama-candle-glow"></div>
              <span class="diorama-hud-chip" style="left:10px;top:10px;border-color:#facc15;color:#fde047;">
                🔐 HUT 8 • 06:00 WEATHER CRIB
              </span>
            </div>

            <!-- Glowing Enigma Lampboard Strip -->
            <div class="bw-lampboard" style="background:#020617;border:1.5px solid ${enigmaDecoded ? '#10b981' : '#475569'};border-radius:12px;padding:10px 16px;display:inline-block;">
              <div style="font-size:0.68rem;color:#94a3b8;font-weight:800;margin-bottom:2px;">DECODED LAMPBOARD OUTPUT</div>
              <div class="bw-lampboard-word" style="font-family:monospace;font-size:1.45rem;font-weight:900;letter-spacing:0.12em;color:${enigmaDecoded ? '#34d399' : '#f59e0b'};">
                ${lampWord}
              </div>
            </div>
          </div>

          <div class="bw-panel-card" style="text-align:center;">
            <p class="bw-enigma-brief" style="margin:0 auto 12px auto;max-width:640px;font-size:0.88rem;color:#e2e8f0;line-height:1.42;">
              Alan Turing &amp; Joan Clarke spotted a 6am German U-boat flaw: every morning begins with <strong>&ldquo;WETTER&rdquo;</strong> (Weather)! Tap <strong>+ / &minus;</strong> (or the letter drum) on the 3 brass rotors to dial <strong>W &mdash; E &mdash; T</strong>!
            </p>

            <!-- Interactive 3-Rotor Brass Enigma Dial (>=44×44px Steppers & Letter Keys) -->
            <div class="bw-rotor-row">
              ${[0, 1, 2]
                .map(
                  (rIdx) => `
                <div class="bw-rotor-card">
                  <div style="font-size:0.66rem;color:#fcd34d;font-weight:800;">ROTOR ${rIdx + 1}</div>
                  <button type="button" class="bw-rotor-btn" data-r="${rIdx}" data-dir="1" aria-label="Step Rotor ${rIdx + 1} Plus" ${enigmaDecoded ? 'disabled' : ''}>▲ +</button>
                  <button type="button" class="bw-rotor-letter-key" data-r="${rIdx}" data-dir="1" aria-label="Rotor ${rIdx + 1} Letter ${ROTOR_LETTERS[rotors[rIdx]]}" ${enigmaDecoded ? 'disabled' : ''} style="color:${enigmaDecoded ? '#34d399' : '#ffffff'};">
                    ${ROTOR_LETTERS[rotors[rIdx]]}
                  </button>
                  <button type="button" class="bw-rotor-btn" data-r="${rIdx}" data-dir="-1" aria-label="Step Rotor ${rIdx + 1} Minus" ${enigmaDecoded ? 'disabled' : ''}>▼ &minus;</button>
                </div>
              `,
                )
                .join('')}
            </div>

            ${
              enigmaDecoded
                ? `
              <div style="text-align:left;border-top:1px solid #334155;padding-top:10px;margin-top:8px;">
                <h4 style="margin:0 0 8px 0;color:#ffffff;font-size:0.96rem;">
                  🎉 CIPHER CRACKED! Why couldn't human codebreakers test all 158 quintillion Enigma settings by hand each day?
                </h4>
                <div class="bsp-options">
                  <button type="button" class="bsp-opt-btn bw-q3-btn ${act3QuestionDone ? 'right' : ''}" data-ok="true" ${act3QuestionDone ? 'disabled' : ''}>
                    <span class="bsp-key">A</span><span>They needed Turing &amp; Welchman's electromechanical "Bombe" machine (and Tommy Flowers's electronic Colossus)!</span>
                  </button>
                  <button type="button" class="bsp-opt-btn bw-q3-btn" data-ok="false" ${act3QuestionDone ? 'disabled' : ''}>
                    <span class="bsp-key">B</span><span>Because German operators posted the daily settings to London by carrier pigeon</span>
                  </button>
                </div>
                ${act3Feedback}
              </div>
            `
                : ''
            }
          </div>
        </div>
      </div>
    `;

    stageEl.querySelectorAll('.bw-rotor-btn, .bw-rotor-letter-key').forEach((btn) => {
      btn.addEventListener('click', () => {
        wakeBlitzAudio();
        const r = parseInt(btn.dataset.r, 10);
        const dir = parseInt(btn.dataset.dir, 10);
        rotors[r] = (rotors[r] + dir + ROTOR_LETTERS.length) % ROTOR_LETTERS.length;
        arcadeAudio.move();
        render();
      });
    });

    stageEl.querySelectorAll('.bw-q3-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (act3QuestionDone) return;
        wakeBlitzAudio();
        act3QuestionDone = true;
        const ok = btn.dataset.ok === 'true';
        if (ok) {
          score += 200;
          arcadeAudio.correct();
        } else {
          arcadeAudio.wrong();
        }
        act3Feedback = `
          <div style="margin-top:10px;margin-bottom:0;" class="tlb-banner ok">
            🚢 Allied Atlantic convoys rerouted safely! Bletchley Park's 10,000 staff (75% women!) shortened WWII by up to two years!
            <div style="margin-top:8px;">
              <button type="button" class="arcade-btn-primary" id="bw-finish-btn">Claim Chief Warden &amp; Codebreaker Medal 🏆</button>
            </div>
          </div>
        `;
        render();
      });
    });

    stageEl.querySelector('#bw-finish-btn')?.addEventListener('click', () => {
      wakeBlitzAudio();
      act = 4;
      render();
    });
  }

  function renderVictory() {
    wakeBlitzAudio();
    arcadeAudio.levelUp();
    if (!xpAwarded) {
      xpAwarded = true;
      window.hhAwardXp?.({ amount: 30, source: 'blitz_enigma' });
    }
    const { isNewBest, best } = saveArcadePersonalBest(unitId, 'blitz_warden', 'all', score);
    pb = best;

    stageEl.innerHTML = `
      <div class="arcade-result-panel" style="max-width:700px;margin:0 auto;">
        <div style="font-size:2.8rem;margin-bottom:6px;">${isNewBest ? '🏆' : '🎖️'}</div>
        <h3>Home Front &amp; Bletchley Mission Complete!</h3>
        <p style="color:#cbd5e1;font-size:0.94rem;max-width:520px;margin:0 auto 14px;">
          Streets blacked out, families sheltered in Anderson &amp; Morrison cages, Kindertransport &amp; Pied Piper children billeted safely, and the 3-rotor Enigma cipher cracked!
        </p>
        <div class="arcade-gameover-stats">
          <div><span>Final Score</span><strong>${score}</strong></div>
          <div><span>Enigma Status</span><strong>Cracked!</strong></div>
          <div><span>Personal Best</span><strong>${best}</strong></div>
        </div>
        <button type="button" class="arcade-btn-primary" id="bw-replay-btn">
          <i class="fa-solid fa-rotate-right"></i> Play Mission Again
        </button>
      </div>
    `;

    stageEl.querySelector('#bw-replay-btn')?.addEventListener('click', resetAll);
  }

  render();
  return () => {};
}
