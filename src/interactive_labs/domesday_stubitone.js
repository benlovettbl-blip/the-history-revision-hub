/**
 * THE SECRET OF STUBITONE™: The 1086 Solent & Fareham Domesday Adventure (v2 Point-and-Click Edition)
 *
 * Upgraded with the "Year 7 Simulator Hat":
 *  - ZERO text labels over pictures — pure unobstructed artwork with discreet small shiny hover glint dots
 *    (+ optional 1-tap firefly shimmer hint for touch-only tablets).
 *  - ZERO truncations across Desktop, iPad, and 390px Mobile viewports.
 *  - 6 completely distinct, non-repeated 60 FPS Canvas animation engines per scene.
 *  - Speaker portrait medallions in dialogue box + sneaky wiggling turnip-tuft cameos for Bennet Luvet.
 *  - Active Map-Tap Hunt in Stage 3 (tap Titchfield & crash manors directly on the Solent map!).
 *  - Interactive Household Headcount inside Edith's Stubbington Hut ("1 Household = 8 Real People!").
 *  - Quick-Fire 3-Stamp "Real 1086 Fact vs. Comedy Composite?" challenge + Folio 46v X-Ray Slider.
 */

import './domesday_stubitone.css';
import { DomesdayAudioDirector } from './domesday_music.js';
import { mountLivingDioramaFX } from './domesday_living_fx.js';
import { renderSolentGisSvgHTML } from './solent_svg_map.js';

const STEPS = [
  { id: 'cover', short: '🏰 Cover', mob: '🏰 Cover' },
  { id: 'beat0', short: '1. Rewind', mob: '1/6 Rewind' },
  { id: 'beat1', short: '2. Fareham', mob: '2/6 Fareham' },
  { id: 'beat2', short: '3. Wipeout', mob: '3/6 Wipeout' },
  { id: 'beat3', short: '4. Trial', mob: '4/6 Trial' },
  { id: 'beat4', short: '5. Hut & Map', mob: '5/6 Hut & Map' },
  { id: 'beat5', short: '6. Latin & Truth', mob: '6/6 Latin' },
];

function isTouchUI() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.matchMedia?.('(hover: none), (pointer: coarse)')?.matches)
  );
}

// Portrait avatar crop coordinates from our 6 high-res dioramas
const SPEAKER_AVATARS = {
  guy: { img: '/images/arcade/domesday/cover_secret_of_stubitone.webp', pos: '78% 14%', size: '520%' },
  bennet: { img: '/images/arcade/domesday/scene_1_bennet_swamp.webp', pos: '49% 23%', size: '520%' },
  odo: { img: '/images/arcade/domesday/scene_2_fareham_mills.webp', pos: '18% 36%', size: '560%' },
  hugh: { img: '/images/arcade/domesday/scene_3_royal_assize.webp', pos: '78% 36%', size: '580%' },
  villager: { img: '/images/arcade/domesday/scene_3_royal_assize.webp', pos: '33% 40%', size: '580%' },
  edith: { img: '/images/arcade/domesday/scene_4_stubbington_hut.webp', pos: '24% 25%', size: '520%' },
  gyrth: { img: '/images/arcade/domesday/scene_5_fareham_servi.webp', pos: '56% 24%', size: '560%' },
  monk: { img: '/images/arcade/domesday/scene_3_royal_assize.webp', pos: '90% 36%', size: '580%' },
};

const STAMP_CHALLENGES = [
  {
    id: 'st1',
    claim: 'Fareham had 10 enslaved workers ("servi") listed alongside plough-oxen and 5 watermills.',
    isReal: true,
    note: '100% REAL! Recorded verbatim in the 1086 Hampshire Domesday folio under Bishop Walkelin of Winchester.',
  },
  {
    id: 'st2',
    claim: 'Bennet Luvet stood in Fareham Creek guarding one wormy turnip from a grumpy seagull.',
    isReal: false,
    note: 'COMEDY COMPOSITE! "Luvet" is a real 1086 Domesday surname ("Little Wolf"), while Boggy Bennet himself is our comic cameo for landless peasants whom scribes ignored!',
  },
  {
    id: 'st3',
    claim: 'King Edward gave Fareham a 20-hide tax discount because of coastal Viking raids, and 1086 scribes wrote Fareham "cannot bear" £20.',
    isReal: true,
    note: '100% REAL! Both famous quotes are written directly in Fareham’s 1086 Domesday Book entry!',
  },
];

let cachedDomesdayJson = null;

async function loadDomesdayData() {
  if (cachedDomesdayJson) return cachedDomesdayJson;
  const res = await fetch('/data/interactive_labs/localDomesday.json');
  if (!res.ok) throw new Error(`Failed to load localDomesday.json (${res.status})`);
  cachedDomesdayJson = await res.json();
  return cachedDomesdayJson;
}

function hitZoneHTML({ id = '', dataAttr = '', x, y, w = 14, h = 22, found = false, ariaLabel }) {
  return `
    <button type="button"
            ${id ? `id="${id}"` : ''}
            ${dataAttr}
            class="dst-hit-zone ${found ? 'is-found' : ''}"
            style="left:${x}%;top:${y}%;width:${w}%;height:${h}%;"
            aria-label="${ariaLabel}">
      <span class="dst-glint-dot"></span>
    </button>
  `;
}

export function mountDomesdayStubitone(stageEl, _pools = {}, ctx = {}) {
  if (!stageEl) return () => {};

  const audio = new DomesdayAudioDirector();
  let activeFx = null;
  let data = null;
  let unmounted = false;
  let shimmerTimeout = null;

  const state = {
    step: ctx.startAtBeat0 ? 'beat0' : 'cover',
    completedSteps: new Set(),
    isFullscreen: Boolean(ctx.autoFullscreen),
    hintShimmer: false,
    score: 0,
    xpAwarded: false,

    avatarKey: 'guy',
    speakerName: 'Sir Guy de Rouen • Royal Exchequer Clerk',
    speechText: isTouchUI()
      ? 'Tap glowing spots on the painting to poke 1086 secrets—or press BEGIN 1086 ROYAL AUDIT to test your hometown!'
      : 'Hover over the painting to spot discreet shiny secrets—or press BEGIN 1086 ROYAL AUDIT to test your hometown!',

    // Secret Bennet Luvet cameo tracker (3 sightings -> Bonus Sticker #0!)
    bennetSightings: new Set(),
    coverSecretsFound: new Set(),

    // Beat 0: Swamp Rewind
    selectedPinId: 'gosport',
    rewound1086: false,
    peekSwampAnyway: false,
    swampSecretsFound: new Set(),

    // Beat 1: Fareham Asset Hunt + Gyrth Servi View
    beat1SubMode: 'hunt', // 'hunt' | 'servi'
    odoOathHeard: false,
    foundFarehamAssets: new Set(), // 'mills' | 'pigs' | 'church_meadow'
    farehamExtrasFound: new Set(),
    serviReflected: false,

    // Beat 2: 3-Step Interactive Map-Tap Hunt
    xraySplitPct: 20,
    selectedManorId: 'stubbington',
    showModernGhost: false,
    b2MissionIdx: 0, // 0 = Swipe Curtain & Count Survivors, 1 = Tap Crown-to-Crown Manor on Map, 2 = Crash Cause
    b2Solved: new Set(), // 'm1' | 'm2' | 'm3'
    b2WrongAttempt: '',

    // Beat 3: Royal Assize Court
    assizeSpotsHeard: new Set(),
    rulingVikings: null, // 'keep20' | 'hike30'
    rulingBishop: null, // 'shame20' | 'force20'
    assizeVerdictRevealed: false,

    // Beat 4: Stubbington Hut People-Counter & Solent Spyglass
    beat4Tab: 'hut', // 'hut' | 'map'
    hutPeopleGroups: new Set(['husband_head']), // starts at 1 (only household head counted by Domesday!) -> 'edith' (+1), 'five_kids' (+5), 'grandma' (+1) => 8 people!
    foundBlindSpots: new Set(), // 'edith_family' | 'untaxed_pets' | 'bs_portchester' | 'bs_gosport' | 'bs_portsmouth' | 'bs_chark'
    spyglassPos: { x: 48, y: 34 },

    // Beat 5: Stubitone Parchment Curtain + Stamp Quiz + Truth Debrief
    translationPct: 0,
    activeChunkIdx: 0,
    stampAnswers: {}, // st1: true/false
  };

  function cleanupFx() {
    if (activeFx) {
      activeFx.destroy();
      activeFx = null;
    }
  }

  function setSpeech(avatarKey, speaker, text, voClipId = null) {
    state.avatarKey = avatarKey || 'guy';
    state.speakerName = speaker;
    state.speechText = text;
    if (voClipId) audio.playVoice(voClipId);
  }

  function triggerHintPulse() {
    state.hintShimmer = true;
    const sh = stageEl.querySelector('.dst-shell');
    sh?.classList.add('dst-hint-shimmer');
    if (shimmerTimeout) clearTimeout(shimmerTimeout);
    shimmerTimeout = setTimeout(() => {
      state.hintShimmer = false;
      stageEl.querySelector('.dst-shell')?.classList.remove('dst-hint-shimmer');
    }, 1900);
  }

  function computeHutPeopleCount() {
    let total = 1; // 1 husband / household head recorded in Domesday
    if (state.hutPeopleGroups.has('edith')) total += 1;
    if (state.hutPeopleGroups.has('five_kids')) total += 5;
    if (state.hutPeopleGroups.has('grandma')) total += 1;
    return total;
  }

  function goToStep(nextStep) {
    cleanupFx();
    state.step = nextStep;
    if (nextStep === 'beat0') {
      audio.setMode('overture');
      setSpeech(
        'guy',
        'Sir Guy de Rouen • Royal Clerk',
        'Tap the coastal town you know best—then pull the 940-Year Rewind Lever to see if your house survives in 1086!',
      );
    } else if (nextStep === 'beat1') {
      audio.setMode(state.beat1SubMode === 'servi' ? 'solemn' : 'overture');
      setSpeech(
        'odo',
        'Sweating Reeve Odo • Fareham',
        isTouchUI()
          ? 'I swear on Saint Swithin’s holy bones, my Lord—barely two squeaky little watermills in all of Fareham! Tap around the creek to check if I’m lying!'
          : 'I swear on Saint Swithin’s holy bones, my Lord—barely two squeaky little watermills in all of Fareham! Move your cursor across the creek to check if I’m lying!',
        'beat1_odo_oath',
      );
    } else if (nextStep === 'beat2') {
      audio.setMode('overture');
      setSpeech(
        'guy',
        'Royal Survey X-Ray • 1066 vs 1086',
        'Mission 1 of 3: Drag the golden X-Ray bar across the Solent map from 1066 to 1086 and watch what happens to every English landowner!',
      );
    } else if (nextStep === 'beat3') {
      audio.setMode('assize');
      setSpeech(
        'villager',
        'Fareham Villager • Sworn Witness',
        isTouchUI()
          ? 'Tap the witnesses in the torch-lit hall to hear both sides—then cast your Royal Verdict on Fareham’s Viking discount and £20 rent squeeze!'
          : 'Hover over the witnesses in the torch-lit hall to hear both sides—then cast your Royal Verdict on Fareham’s Viking discount and £20 rent squeeze!',
        'beat3_villager_plea',
      );
    } else if (nextStep === 'beat4') {
      audio.setMode('overture');
      setSpeech(
        'monk',
        'Brother Aldwin • Winchester Chronicler',
        isTouchUI()
          ? 'Domesday says Stubbington has "9 households"—tap inside Hut #3 to count how many REAL human beings are hiding in just ONE household!'
          : 'Domesday says Stubbington has "9 households"—hover inside Hut #3 to count how many REAL human beings are hiding in just ONE household!',
        'beat4_monk_myth',
      );
    } else if (nextStep === 'beat5') {
      audio.setMode('overture');
      if (!state.xpAwarded) {
        state.xpAwarded = true;
        window.hhAwardXp?.({ amount: 35, source: 'domesday_stubitone', unitId: 'medieval_england' });
      }
      setSpeech(
        'monk',
        'Great Domesday Folio 46v • STVBITONE',
        'Slide the golden Translation Curtain across Stubbington’s real 1086 Latin entry—then stamp our 3 Quick Fact-vs-Comedy checks!',
        'beat5_stubitone_latin',
      );
    }
    render();
  }

  function toggleFullscreenMode() {
    const shell = stageEl.querySelector('.dst-shell');
    state.isFullscreen = !state.isFullscreen;
    if (state.isFullscreen) {
      if (shell?.requestFullscreen) shell.requestFullscreen().catch(() => {});
    } else if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    render();
  }

  // =========================================================================
  // VIEW RENDERERS
  // =========================================================================
  function getStageMicroHint() {
    const touch = isTouchUI();
    if (state.step === 'beat2' || (state.step === 'beat4' && state.beat4Tab === 'map')) {
      return '🗺️ Tap shields & pins on the Solent map';
    }
    if (state.step === 'beat0' && !state.rewound1086) {
      return '📍 Tap any coastal town pin on the map';
    }
    if (state.step === 'beat5') {
      return '📜 Slide curtain & tap Latin lines to decode';
    }
    return touch ? '✨ Tap glowing spots on painting' : '✨ Hover scene for shiny glint dots';
  }

  function renderTopBarHTML() {
    const curIdx = Math.max(0, STEPS.findIndex((s) => s.id === state.step));
    const prevStep = curIdx > 0 ? STEPS[curIdx - 1].id : '';
    const nextStep = curIdx < STEPS.length - 1 ? STEPS[curIdx + 1].id : '';

    return `
      <div class="dst-topbar">
        <div class="dst-step-strip" role="tablist" aria-label="1086 Domesday Stages">
          ${STEPS.map((s) => {
            const isAct = state.step === s.id;
            const isDone = state.completedSteps.has(s.id);
            return `
              <button type="button" role="tab" aria-selected="${isAct}"
                      class="dst-step-pill ${isAct ? 'is-active' : ''} ${isDone ? 'is-done' : ''}"
                      data-goto-step="${s.id}">
                ${isDone && !isAct ? '✓ ' : ''}${s.short}
              </button>
            `;
          }).join('')}
        </div>

        <div class="dst-mobile-step-nav" aria-label="Mobile Stage Switcher">
          <button type="button" class="dst-mob-arrow-btn" id="dst-mob-prev" ${prevStep ? `data-goto-step="${prevStep}"` : 'disabled'} aria-label="Previous Stage">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <select id="dst-mob-step-select" class="dst-mobile-step-select" aria-label="Choose 1086 Domesday Stage">
            ${STEPS.map((s) => {
              const isAct = state.step === s.id;
              const isDone = state.completedSteps.has(s.id);
              return `<option value="${s.id}" ${isAct ? 'selected' : ''}>${isDone && !isAct ? '✓ ' : ''}${s.mob}</option>`;
            }).join('')}
          </select>
          <button type="button" class="dst-mob-arrow-btn" id="dst-mob-next" ${nextStep ? `data-goto-step="${nextStep}"` : 'disabled'} aria-label="Next Stage">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <div class="dst-ctrl-group">
          <span class="dst-score-chip">
            🪙 ${state.score}<span class="dst-score-verb"> pts</span> • ${state.bennetSightings.size >= 3 ? '🥕 3/3★' : `🥕<span class="dst-score-verb"> Cameos</span> ${state.bennetSightings.size}/3`}
          </span>
          <button type="button" class="dst-icon-btn ${!audio.muted ? 'is-active' : ''}" id="dst-btn-mute" title="Toggle Voiceovers & Sound Effects" aria-label="Toggle Audio">
            <i class="fa-solid ${audio.muted ? 'fa-volume-xmark' : 'fa-volume-high'}"></i>
            <span class="dst-btn-lbl">${audio.muted ? 'Muted' : 'Audio On'}</span>
          </button>
          <button type="button" class="dst-icon-btn ${state.isFullscreen ? 'is-active' : ''}" id="dst-btn-fs" title="Toggle Full-Screen Smartboard / Tablet View" aria-label="Toggle Full Screen">
            <i class="fa-solid ${state.isFullscreen ? 'fa-compress' : 'fa-expand'}"></i>
            <span class="dst-btn-lbl">${state.isFullscreen ? 'Windowed' : 'Full Screen'}</span>
          </button>
          ${
            typeof ctx.onCloseModal === 'function'
              ? `<button type="button" class="dst-icon-btn" id="dst-btn-close" style="border-color:#ef4444;color:#fecaca;" aria-label="Close Adventure"><i class="fa-solid fa-xmark"></i><span class="dst-btn-lbl">Close</span></button>`
              : ''
          }
        </div>
      </div>
    `;
  }

  function renderSpeechBannerHTML() {
    const av = SPEAKER_AVATARS[state.avatarKey] || SPEAKER_AVATARS.guy;
    return `
      <div class="dst-speech-box">
        <div class="dst-avatar-medallion"
             style="background-image:url('${av.img}');background-position:${av.pos};background-size:${av.size};"
             aria-hidden="true"></div>
        <div style="flex:1;min-width:0;">
          <div class="dst-speech-speaker">
            <span>🎙️ ${state.speakerName}</span>
            <span class="dst-speech-hint-chip">${getStageMicroHint()}</span>
          </div>
          <p class="dst-speech-text">&ldquo;${state.speechText}&rdquo;</p>
        </div>
      </div>
    `;
  }

  function renderSceneFooterBarHTML(secretFoundCount, secretTotalCount, captionText) {
    return `
      <div class="dst-scene-caption-strip">
        <span>✨ <strong>Secrets:</strong> ${secretFoundCount} / ${secretTotalCount}</span>
        <span class="dst-caption-mid" style="color:#a8a29e;">${captionText}</span>
        <button type="button" class="dst-icon-btn" data-action="hint-shimmer" style="min-height:30px;padding:3px 9px;font-size:0.72rem;">
          ✨ Glint Hint
        </button>
      </div>
    `;
  }

  function renderCoverHTML() {
    return `
      <div class="dst-cover-wrap">
        <div class="dst-cover-stage">
          <div class="dst-cover-art-box" id="dst-fx-stage" data-fx-preset="cover">
            <img src="/images/arcade/domesday/cover_secret_of_stubitone.webp"
                 alt="The Secret of Stubitone — 1086 Domesday Adventure Cover"
                 class="domesday-diorama-img" />
            <div class="dst-cover-top-shade"></div>

            <div class="dst-cover-logo-wrap">
              <div class="dst-lucas-kicker">⚔ KING WILLIAM EXCHEQUER STUDIOS PRESENTS ⚔</div>
              <h2 class="dst-lucas-title">THE SECRET OF STUBITONE™</h2>
              <p class="dst-lucas-sub">A Point-and-Poke 1086 Domesday Adventure Across Fareham, Stubbington &amp; The Solent</p>
            </div>

            <!-- 5 Discreet Shiny Glint Hotspots (Zero Text Over Painting!) -->
            ${hitZoneHTML({ id: 'dst-cover-bennet', x: 24, y: 69, w: 16, h: 32, found: state.coverSecretsFound.has('bennet'), ariaLabel: 'Inspect muddy peasant with turnip' })}
            ${hitZoneHTML({ id: 'dst-cover-gull', x: 9.5, y: 23, w: 12, h: 18, found: state.coverSecretsFound.has('gull'), ariaLabel: 'Inspect glaring seagull' })}
            ${hitZoneHTML({ id: 'dst-cover-pigs', x: 61, y: 74, w: 24, h: 28, found: state.coverSecretsFound.has('pigs'), ariaLabel: 'Inspect Reeve Odo on bursting pig crate' })}
            ${hitZoneHTML({ id: 'dst-cover-quill', x: 74, y: 28, w: 22, h: 32, found: state.coverSecretsFound.has('quill'), ariaLabel: 'Inspect Norman Royal Clerk and glowing quill' })}
            ${hitZoneHTML({ id: 'dst-cover-edith', x: 88, y: 65, w: 13, h: 24, found: state.coverSecretsFound.has('edith'), ariaLabel: 'Inspect Edith waving ladle in cottage doorway' })}
          </div>
        </div>

        <!-- Clean Unobstructed Docked Footer Below Cover Painting -->
        <div class="dst-cover-footer">
          <div style="flex:1;min-width:min(100%,240px);">
            <div style="font-size:0.71rem;font-weight:900;color:#fbbf24;text-transform:uppercase;margin-bottom:2px;">
              🎙️ ${state.speakerName} • (${state.coverSecretsFound.size}/5 Secrets)
            </div>
            <div style="font-size:0.85rem;font-weight:700;color:#fef3c7;line-height:1.32;">
              &ldquo;${state.speechText}&rdquo;
            </div>
          </div>

          <div class="dst-cover-cta-row">
            <button type="button" class="dst-icon-btn" data-action="hint-shimmer">✨ Hint</button>
            <button type="button" class="dst-start-cta" id="dst-btn-start-adventure">
              ▶ BEGIN 1086 ROYAL AUDIT
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderBeat0HTML() {
    const selPin = data.modernPins.find((p) => p.id === state.selectedPinId) || data.modernPins[0];
    const selManor = data.manors.find((m) => m.id === state.selectedPinId);
    const vanished = state.rewound1086 && !selPin.existed1086;
    const showSwampScene = state.rewound1086 && (vanished || state.peekSwampAnyway);

    return `
      <div class="dst-body">
        ${renderSpeechBannerHTML()}
        <div class="dst-split">
          <!-- Left: Collision-Free GIS Solent Map -->
          <div>
            <div class="dst-map-frame" id="dst-solent-map-wrap">
              ${renderSolentGisSvgHTML({
                data,
                mode: 'swamp',
                rewound1086: state.rewound1086,
                selectedPinId: state.selectedPinId,
              })}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
              ${data.modernPins
                .map(
                  (p) => `
                <button type="button" class="dst-step-pill ${state.selectedPinId === p.id ? 'is-active' : ''}" data-pick-pin="${p.id}">
                  📍 ${p.modernName}
                </button>
              `,
                )
                .join('')}
            </div>
          </div>

          <!-- Right: Rewind Lever + Dynamic Swamp or Survived Manor Dossier -->
          <div class="dst-card-panel">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
              <span style="font-size:0.75rem;font-weight:900;color:#fbbf24;text-transform:uppercase;">
                STAGE 1 • WHERE IS MY HOUSE IN 1086?
              </span>
              <span style="font-size:0.76rem;color:#cbd5e1;font-weight:700;">Selected: <strong>${selPin.modernName}</strong></span>
            </div>

            ${
              !state.rewound1086
                ? `
              <p style="margin:0 0 12px 0;font-size:0.92rem;color:#e7e5e4;line-height:1.45;">
                Pick any modern coastal place on the map (try <strong>Gosport</strong>, <strong>Portsmouth</strong>, or <strong>Stubbington</strong>!), then pull the lever to rewind <strong>940 years</strong> back to 1086!
              </p>
              <button type="button" class="dst-start-cta" id="dst-btn-rewind" style="width:100%;">
                ⏪ PULL LEVER: REWIND TO 1086!
              </button>
            `
                : `
              <div style="padding:11px 13px;border-radius:11px;margin-bottom:10px;border:2px solid ${vanished ? '#ef4444' : '#22c55e'};background:${vanished ? 'rgba(127,29,29,0.32)' : 'rgba(20,83,45,0.32)'};">
                <div style="font-weight:900;font-size:1rem;color:${vanished ? '#fca5a5' : '#86efac'};margin-bottom:4px;">
                  ${selPin.headline}
                </div>
                <p style="margin:0;font-size:0.85rem;line-height:1.42;color:#f5f5f4;">${selPin.verdict}</p>
              </div>

              ${
                showSwampScene
                  ? `
                <div class="dst-diorama-frame" id="dst-fx-stage" data-fx-preset="swamp">
                  <img src="/images/arcade/domesday/scene_1_bennet_swamp.webp"
                       alt="Bennet Luvet waist-deep in 1086 Solent marsh mud"
                       class="domesday-diorama-img" />
                  ${hitZoneHTML({ id: 'dst-swamp-bennet', x: 56, y: 55, w: 26, h: 58, found: state.bennetSightings.has('swamp'), ariaLabel: 'Inspect Bennet Luvet and his wormy turnip' })}
                  ${hitZoneHTML({ id: 'dst-swamp-gull', x: 83, y: 18, w: 15, h: 24, found: state.swampSecretsFound.has('gull'), ariaLabel: 'Inspect grumpy seagull on post' })}
                  ${hitZoneHTML({ id: 'dst-swamp-mill', x: 20, y: 38, w: 22, h: 30, found: state.swampSecretsFound.has('mill'), ariaLabel: 'Inspect distant Fareham timber watermill' })}
                  ${hitZoneHTML({ id: 'dst-swamp-torch', x: 78, y: 49, w: 12, h: 24, found: state.swampSecretsFound.has('torch'), ariaLabel: 'Inspect 1086 iron pitch-torch' })}
                </div>
                ${renderSceneFooterBarHTML(
                  state.swampSecretsFound.size + (state.bennetSightings.has('swamp') ? 1 : 0),
                  4,
                  isTouchUI() ? 'Tap swamp to poke Bennet, seagull & creek!' : 'Hover swamp to poke Bennet, seagull & creek!',
                )}
              `
                  : `
                <!-- Survived 1086 Manor Snapshot + Optional Swamp Peek -->
                <div style="padding:12px;border-radius:11px;background:#292524;border:1.5px solid #44403c;margin-bottom:10px;">
                  <div style="font-size:0.78rem;font-weight:900;color:#fde047;margin-bottom:6px;">
                    📜 1086 DOMESDAY SNAPSHOT: ${selManor ? `${selManor.name.toUpperCase()} (${selManor.domesdayName})` : selPin.modernName}
                  </div>
                  ${
                    selManor
                      ? `
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;font-size:0.82rem;margin-bottom:8px;">
                      <div style="background:#1c1917;padding:7px 9px;border-radius:7px;">🏠 <strong>${selManor.households} Households</strong> (~${selManor.households * 5} real people)</div>
                      <div style="background:#1c1917;padding:7px 9px;border-radius:7px;">⚙️ <strong>${selManor.mills} Watermills</strong> • ${selManor.ploughs} Ploughs</div>
                      <div style="background:#1c1917;padding:7px 9px;border-radius:7px;">🛡️ <strong>1066:</strong> ${selManor.lord1066}</div>
                      <div style="background:#1c1917;padding:7px 9px;border-radius:7px;">⚔️ <strong>1086:</strong> ${selManor.lord1086}</div>
                    </div>
                  `
                      : ''
                  }
                  <button type="button" class="dst-icon-btn" id="dst-btn-peek-swamp" style="width:100%;border-color:#fb923c;color:#fed7aa;">
                    🐸 Peek at Empty 1086 Gosport Swamp (Spot Boggy Bennet Cameo #1!)
                  </button>
                </div>
              `
              }

              <button type="button" class="dst-next-btn" data-complete-next="beat1">
                Ride Up Fareham Creek → Catch Lying Reeve Odo <i class="fa-solid fa-arrow-right"></i>
              </button>
            `
            }
          </div>
        </div>
      </div>
    `;
  }

  function renderBeat1HTML() {
    const foundCount = state.foundFarehamAssets.size;
    const all3Found = foundCount >= 3;
    const totalFarehamSecrets =
      foundCount + state.farehamExtrasFound.size + (state.bennetSightings.has('creek') ? 1 : 0);
    const touch = isTouchUI();
    const actVerb = touch ? 'Tap' : 'Hover';

    return `
      <div class="dst-body">
        ${renderSpeechBannerHTML()}

        <div class="dst-subtab-bar">
          <button type="button" class="dst-step-pill ${state.beat1SubMode === 'hunt' ? 'is-active' : ''}" id="dst-b1-tab-hunt">
            <span class="dst-lbl-full">🔎 Part A: Hunt Fareham's Hidden Wealth (${foundCount}/3 Assets)</span>
            <span class="dst-lbl-short">🔎 Part A: Wealth (${foundCount}/3)</span>
          </button>
          <button type="button" class="dst-step-pill ${state.beat1SubMode === 'servi' ? 'is-active' : ''} ${state.serviReflected ? 'is-done' : ''}" id="dst-b1-tab-servi">
            <span class="dst-lbl-full">⚖️ Part B: Meet Gyrth — Fareham's 10 Enslaved Workers ${all3Found ? '' : '🔒'}</span>
            <span class="dst-lbl-short">⚖️ Part B: 10 Servi ${all3Found ? '' : '🔒'}</span>
          </button>
        </div>

        ${
          state.beat1SubMode === 'hunt'
            ? `
          <div class="dst-split">
            <div>
              <div class="dst-diorama-frame" id="dst-fx-stage" data-fx-preset="fareham_mills">
                <img src="/images/arcade/domesday/scene_2_fareham_mills.webp"
                     alt="1086 Fareham Creek watermills, oak-wood pigs and Reeve Odo"
                     class="domesday-diorama-img" />
                ${hitZoneHTML({ dataAttr: 'data-b1-spot="odo"', x: 18, y: 52, w: 18, h: 48, found: state.farehamExtrasFound.has('odo'), ariaLabel: 'Inspect sweating Reeve Odo' })}
                ${hitZoneHTML({ dataAttr: 'data-b1-spot="relic"', x: 35.5, y: 58, w: 14, h: 20, found: state.farehamExtrasFound.has('relic'), ariaLabel: 'Inspect Saint Swithin gilded bone casket' })}
                ${hitZoneHTML({ dataAttr: 'data-b1-spot="mills"', x: 64, y: 40, w: 30, h: 30, found: state.foundFarehamAssets.has('mills'), ariaLabel: 'Inspect timber watermills along the river' })}
                ${hitZoneHTML({ dataAttr: 'data-b1-spot="pigs"', x: 89, y: 50, w: 18, h: 26, found: state.foundFarehamAssets.has('pigs'), ariaLabel: 'Inspect snorting pigs in oak woodland' })}
                ${hitZoneHTML({ dataAttr: 'data-b1-spot="church_meadow"', x: 20, y: 22, w: 22, h: 24, found: state.foundFarehamAssets.has('church_meadow'), ariaLabel: 'Inspect Saxon stone church and green hay-meadows' })}
                ${hitZoneHTML({ dataAttr: 'data-b1-spot="chickens"', x: 56, y: 86, w: 24, h: 20, found: state.farehamExtrasFound.has('chickens'), ariaLabel: 'Inspect pecking farmyard chickens' })}
                ${hitZoneHTML({ dataAttr: 'data-b1-spot="bennet"', x: 8.5, y: 85, w: 13, h: 20, found: state.bennetSightings.has('creek'), ariaLabel: 'Inspect wiggling turnip tuft on riverbank' })}
              </div>
              ${renderSceneFooterBarHTML(totalFarehamSecrets, 7, touch ? 'Tap river, woods, hills & riverbank!' : 'Sweep cursor across river, woods, hills & riverbank!')}
            </div>

            <div class="dst-card-panel">
              <div style="font-size:0.76rem;font-weight:900;color:#fbbf24;text-transform:uppercase;margin-bottom:8px;">
                ROYAL EXCHEQUER TALLY • FAREHAM (FERHAM, 1086)
              </div>
              <p style="margin:0 0 10px 0;font-size:0.87rem;color:#d6d3d1;line-height:1.4;">
                ${touch ? 'Tap glowing spots on the Fareham Creek painting' : 'Hover over the Fareham Creek painting to find shiny glint dots'} and expose all <strong>3 real taxable money-makers</strong> Reeve Odo is hiding:
              </p>

              <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:12px;">
                <div style="padding:9px 12px;border-radius:9px;background:#292524;border:1.5px solid ${state.foundFarehamAssets.has('mills') ? '#22c55e' : '#44403c'};font-size:0.84rem;">
                  ${state.foundFarehamAssets.has('mills') ? '✅ <strong>5 Spinning Watermills (41 shillings):</strong> Peasants were BANNED by law from grinding bread flour at home—forcing everyone to pay Bishop Walkelin’s mills!' : `⬜ Asset #1: ${actVerb} along the rushing Wallington River...`}
                </div>
                <div style="padding:9px 12px;border-radius:9px;background:#292524;border:1.5px solid ${state.foundFarehamAssets.has('pigs') ? '#22c55e' : '#44403c'};font-size:0.84rem;">
                  ${state.foundFarehamAssets.has('pigs') ? '✅ <strong>Woodland for 13 Fat Pigs:</strong> Peasants paid "pannage" tax in live pigs just to let hogs eat acorns in the Bishop’s oak woods!' : `⬜ Asset #2: ${actVerb} the steaming oak bushes on the right...`}
                </div>
                <div style="padding:9px 12px;border-radius:9px;background:#292524;border:1.5px solid ${state.foundFarehamAssets.has('church_meadow') ? '#22c55e' : '#44403c'};font-size:0.84rem;">
                  ${state.foundFarehamAssets.has('church_meadow') ? '✅ <strong>1 Parish Church, 90 Households & 41 Hay-Meadow Acres:</strong> Making Fareham one of the top 20% largest towns in 1086 England!' : `⬜ Asset #3: ${actVerb} the green hill & church spire...`}
                </div>
              </div>

              ${
                all3Found
                  ? `
                <button type="button" class="dst-next-btn" id="dst-btn-open-servi">
                  Who Worked the Bishop's Ploughs? Meet Gyrth (10 Enslaved People) <i class="fa-solid fa-arrow-right"></i>
                </button>
              `
                  : ''
              }
            </div>
          </div>
        `
            : `
          <div class="dst-split">
            <div>
              <div class="dst-diorama-frame" id="dst-fx-stage" data-fx-preset="servi_plough" style="border-color:#64748b;">
                <img src="/images/arcade/domesday/scene_5_fareham_servi.webp"
                     alt="Dawn plough-team in 1086 Fareham worked by enslaved ploughmen"
                     class="domesday-diorama-img" />
                ${hitZoneHTML({ id: 'dst-btn-hear-gyrth', x: 55, y: 46, w: 18, h: 52, found: state.serviReflected, ariaLabel: 'Listen to Gyrth the enslaved ploughman' })}
                ${hitZoneHTML({ dataAttr: 'data-servi-spot="oxen"', x: 82, y: 50, w: 28, h: 36, found: state.farehamExtrasFound.has('oxen'), ariaLabel: 'Inspect heavy eight-ox medieval plough team' })}
                ${hitZoneHTML({ dataAttr: 'data-servi-spot="overseer"', x: 13, y: 23, w: 12, h: 18, found: state.farehamExtrasFound.has('overseer'), ariaLabel: 'Inspect mounted Norman bailiff on ridge' })}
              </div>
              ${renderSceneFooterBarHTML(1 + (state.farehamExtrasFound.has('oxen') ? 1 : 0) + (state.farehamExtrasFound.has('overseer') ? 1 : 0), 3, touch ? 'Tap Gyrth, the steaming oxen, or the distant ridge' : 'Hover Gyrth, the steaming oxen, or the distant ridge')}
            </div>

            <div class="dst-card-panel" style="border-color:#64748b;">
              <div style="font-size:0.75rem;font-weight:900;color:#93c5fd;text-transform:uppercase;margin-bottom:6px;">
                HISTORICAL SHOCK • SLAVERY IN 1086 HAMPSHIRE (SERVI)
              </div>
              <h3 style="margin:0 0 8px 0;font-size:1.1rem;color:#f8fafc;">10 Enslaved People Recorded in Fareham</h3>
              <p style="margin:0 0 10px 0;font-size:0.88rem;color:#e2e8f0;line-height:1.48;">
                Alongside Fareham’s 54 villagers and 26 smallholders, the real 1086 Domesday Book lists <strong>10 <em>servi</em> (enslaved men and women)</strong> in Fareham—plus <strong>4 in Titchfield</strong>, <strong>4 in Portchester</strong>, <strong>5 in Wickham</strong>, and <strong>2 in Rowner</strong> (~10% of England’s 1086 workforce).
              </p>
              <div style="padding:10px 12px;border-radius:10px;background:#0f172a;border-left:4px solid #38bdf8;font-size:0.84rem;color:#cbd5e1;line-height:1.44;margin-bottom:12px;">
                Unlike ordinary peasants, <em>servi</em> held no land strips of their own. Scribes listed them on the Bishop’s farm right beside the plough-oxen. Tap Gyrth in the dawn field to replay his testimony.
              </div>
              <button type="button" class="dst-next-btn" data-complete-next="beat2">
                Continue → Stage 3: Interactive 1066 Wipeout Map Hunt <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        `
        }
      </div>
    `;
  }

  function renderBeat2HTML() {
    const selManor = data.manors.find((m) => m.id === state.selectedManorId) || data.manors[0];
    const mCount = state.b2Solved.size;

    return `
      <div class="dst-body">
        ${renderSpeechBannerHTML()}
        <div class="dst-split">
          <!-- Left: Draggable 1066 <-> 1086 X-Ray GIS Map -->
          <div>
            <div class="dst-map-frame" id="dst-xray-map-wrap">
              ${renderSolentGisSvgHTML({
                data,
                mode: 'xray',
                xraySplitPct: state.xraySplitPct,
                selectedManorId: state.selectedManorId,
                targetTapManorMode: state.b2MissionIdx === 1 && !state.b2Solved.has('m2'),
                showModernGhost: state.showModernGhost,
              })}
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:8px;">
              <div style="display:flex;align-items:center;gap:6px;flex:1 1 180px;min-width:0;">
                <span style="font-size:0.75rem;font-weight:900;color:#86efac;">1066</span>
                <input type="range" id="dst-xray-range" min="0" max="100" value="${state.xraySplitPct}"
                       style="flex:1;min-width:75px;height:28px;accent-color:#f59e0b;cursor:pointer;" aria-label="1066 to 1086 X-Ray Curtain" />
                <span style="font-size:0.75rem;font-weight:900;color:#fca5a5;">1086</span>
              </div>
              <button type="button" class="dst-icon-btn" id="dst-btn-ghost-toggle">
                👻 ${state.showModernGhost ? 'Hide Ghost Towns' : 'Modern Ghost'}
              </button>
              <button type="button" class="dst-icon-btn" id="dst-btn-haircut-gag" style="border-color:#fb923c;color:#fed7aa;">
                ✂️ Guy's Shaved Neck
              </button>
            </div>

            <div class="dst-card-panel" style="margin-top:10px;padding:11px 14px;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:5px;">
                <strong style="color:#fde047;font-size:0.93rem;">📍 ${selManor.name} (<em>${selManor.domesdayName}</em> — "${selManor.meaning}")</strong>
                <span style="font-size:0.74rem;color:#a8a29e;">${selManor.households} households • ${selManor.slaves} enslaved</span>
              </div>
              <div style="font-size:0.81rem;color:#e7e5e4;margin-bottom:7px;">
                <span style="color:#86efac;"><strong>1066:</strong> ${selManor.lord1066}</span>
                &nbsp;➔&nbsp;
                <span style="color:#fca5a5;"><strong>1086:</strong> ${selManor.lord1086}</span>
              </div>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;font-size:0.75rem;text-align:center;">
                <div style="background:#14532d;padding:5px;border-radius:6px;">1066: <strong>£${selManor.val1066}</strong></div>
                <div style="background:#7f1d1d;padding:5px;border-radius:6px;">1067 Crash: <strong>£${selManor.val1067}</strong></div>
                <div style="background:#78350f;padding:5px;border-radius:6px;">1086: <strong>£${selManor.val1086}</strong></div>
              </div>
            </div>
          </div>

          <!-- Right: Interactive 3-Mission Stepper (Zero Worksheet Wall!) -->
          <div class="dst-card-panel">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:10px;">
              <span style="font-size:0.76rem;font-weight:900;color:#fbbf24;text-transform:uppercase;">
                STAGE 3 • FORENSIC MAP MISSIONS (${mCount}/3)
              </span>
              <div style="display:flex;gap:5px;">
                ${[0, 1, 2]
                  .map(
                    (idx) => `
                  <button type="button" class="dst-step-pill ${state.b2MissionIdx === idx ? 'is-active' : ''} ${state.b2Solved.has('m' + (idx + 1)) ? 'is-done' : ''}"
                          data-b2-step="${idx}" style="min-height:30px;padding:3px 9px;font-size:0.72rem;">
                    #${idx + 1}
                  </button>
                `,
                  )
                  .join('')}
              </div>
            </div>

            ${
              state.b2MissionIdx === 0
                ? `
              <h4 style="margin:0 0 8px 0;font-size:0.98rem;color:#fef3c7;">Mission 1: Sweep the 1066 ↔ 1086 X-Ray Bar!</h4>
              <p style="margin:0 0 10px 0;font-size:0.86rem;color:#d6d3d1;line-height:1.42;">
                Drag the golden X-Ray slider across the map to reveal 1086 Norman Hampshire. Out of the <strong>6 private English landowners</strong> (Godwin, Coleman, Wulfward, 3 Portchester freemen, 4 Wickham brothers), how many kept their land?
              </p>
              <button type="button" class="dst-choice-btn ${state.b2Solved.has('m1') ? 'is-correct' : ''}" data-b2-m1="zero">
                ⚔️ <strong>ZERO (0 out of 6)</strong> — 100% of local Saxon lords were wiped out!
              </button>
              <button type="button" class="dst-choice-btn" data-b2-m1="half">
                🛡️ Half of them (3 out of 6) shared politely with the Normans
              </button>
              ${
                state.b2Solved.has('m1')
                  ? `<div style="padding:9px 11px;border-radius:9px;background:rgba(22,163,74,0.2);border:1px solid #22c55e;font-size:0.82rem;color:#dcfce7;margin-top:6px;">
                       ✅ Spot on! Sheriff Hugh of Port alone grabbed Stubbington, Wickham, and over 50 Hampshire manors!
                       <button type="button" class="dst-next-btn" data-b2-step="1" style="margin-top:8px;">Next Clue → Mission 2 (Direct Map Hunt!)</button>
                     </div>`
                  : ''
              }
            `
                : state.b2MissionIdx === 1
                  ? `
              <h4 style="margin:0 0 8px 0;font-size:0.98rem;color:#fef3c7;">Mission 2: Tap Directly on the Map! 👑</h4>
              <p style="margin:0 0 10px 0;font-size:0.86rem;color:#d6d3d1;line-height:1.42;">
                Find and <strong>tap the shield directly on the Solent map</strong> for the <strong>ONLY local manor</strong> that wasn’t given to a Baron or Bishop because it went straight from <strong>King Edward (1066) to King William (1086)</strong>!
              </p>
              ${
                state.b2WrongAttempt && !state.b2Solved.has('m2')
                  ? `<div style="padding:9px 11px;border-radius:9px;background:rgba(220,38,38,0.22);border:1px solid #ef4444;font-size:0.82rem;color:#fecaca;margin-bottom:8px;">
                       ❌ Not <strong>${state.b2WrongAttempt}</strong>! Hint: Look along the <strong>River Meon</strong> on the west for the golden Royal Crown (👑)!
                     </div>`
                  : ''
              }
              ${
                state.b2Solved.has('m2')
                  ? `<div style="padding:9px 11px;border-radius:9px;background:rgba(22,163,74,0.2);border:1px solid #22c55e;font-size:0.82rem;color:#dcfce7;">
                       ✅ <strong>TITCHFIELD (Ticefelle) FOUND!</strong> Capital of Titchfield Hundred—kept personally by King William!
                       <button type="button" class="dst-next-btn" data-b2-step="2" style="margin-top:8px;">Next Clue → Mission 3 (The 1067 Crash)</button>
                     </div>`
                  : `<div style="padding:10px;border-radius:9px;background:#292524;font-size:0.82rem;color:#fde68a;text-align:center;">
                       👆 Tap a manor shield directly on the map on the left!
                     </div>`
              }
            `
                  : `
              <h4 style="margin:0 0 8px 0;font-size:0.98rem;color:#fef3c7;">Mission 3: Why Did Values Crash in 1066–67? 🔥</h4>
              <p style="margin:0 0 10px 0;font-size:0.86rem;color:#d6d3d1;line-height:1.42;">
                Tap <strong>Fareham</strong> (£18 ➔ £10) or <strong>Wickham</strong> (£10 ➔ £4) on the map. Why did so many Hampshire manors plunge in value right after the Battle of Hastings?
              </p>
              <button type="button" class="dst-choice-btn ${state.b2Solved.has('m3') ? 'is-correct' : ''}" data-b2-m3="army">
                🔥 Marching Norman troops trampled crops, burned barns &amp; seized cattle on their way to Winchester
              </button>
              <button type="button" class="dst-choice-btn" data-b2-m3="holiday">
                🏖️ All the villagers moved to Portsmouth for the seaside
              </button>
              ${
                state.b2Solved.has('m3')
                  ? `<div style="padding:9px 11px;border-radius:9px;background:rgba(22,163,74,0.2);border:1px solid #22c55e;font-size:0.82rem;color:#dcfce7;margin-top:6px;">
                       ✅ Forensic bullseye! Domesday’s middle valuation acts like crime-scene footprints of William’s invading army!
                     </div>`
                  : ''
              }
            `
            }

            ${
              mCount >= 3
                ? `<button type="button" class="dst-next-btn" data-complete-next="beat3">
                     Enter Torch-Lit Courtroom → Stage 4: Vikings vs. Greedy Bishop <i class="fa-solid fa-arrow-right"></i>
                   </button>`
                : ''
            }
          </div>
        </div>
      </div>
    `;
  }

  function renderBeat3HTML() {
    const canSlamGavel = Boolean(state.rulingVikings && state.rulingBishop);
    const matchedRealHistory = state.rulingVikings === 'keep20' && state.rulingBishop === 'shame20';

    return `
      <div class="dst-body">
        ${renderSpeechBannerHTML()}
        <div class="dst-split">
          <!-- Left: Unobstructed Torch-Lit Assize Diorama with 5 Discreet Hover Glints -->
          <div>
            <div class="dst-diorama-frame" id="dst-fx-stage" data-fx-preset="assize">
              <img src="/images/arcade/domesday/scene_3_royal_assize.webp"
                   alt="1086 Royal Assize Hall in Hampshire"
                   class="domesday-diorama-img" />
              ${hitZoneHTML({ dataAttr: 'data-assize-spot="villager"', x: 33, y: 56, w: 18, h: 48, found: state.assizeSpotsHeard.has('villager'), ariaLabel: 'Hear Fareham villager plea' })}
              ${hitZoneHTML({ dataAttr: 'data-assize-spot="shield"', x: 49, y: 23, w: 15, h: 24, found: state.assizeSpotsHeard.has('shield'), ariaLabel: 'Inspect coastal Viking shield exhibit' })}
              ${hitZoneHTML({ dataAttr: 'data-assize-spot="clerk"', x: 64, y: 42, w: 14, h: 30, found: state.assizeSpotsHeard.has('clerk'), ariaLabel: 'Hear Norman Clerk Sir Guy' })}
              ${hitZoneHTML({ dataAttr: 'data-assize-spot="hugh"', x: 78, y: 42, w: 14, h: 32, found: state.assizeSpotsHeard.has('hugh'), ariaLabel: 'Inspect Sheriff Hugh and silver coin stacks' })}
              ${hitZoneHTML({ dataAttr: 'data-assize-spot="bishop_monk"', x: 90, y: 46, w: 13, h: 36, found: state.assizeSpotsHeard.has('bishop_monk'), ariaLabel: 'Inspect Bishop Walkelin representative' })}
            </div>
            ${renderSceneFooterBarHTML(state.assizeSpotsHeard.size, 5, isTouchUI() ? 'Tap witnesses, Viking shield & silver coins!' : 'Hover witnesses, Viking shield & silver coins!')}

            <!-- Visual Fareham Squeeze Meter -->
            <div style="margin-top:8px;padding:10px 12px;border-radius:10px;background:#1c1917;border:1px solid #44403c;font-size:0.8rem;">
              <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                <span style="color:#86efac;font-weight:800;">🌾 True Output Today: £16</span>
                <span style="color:#fca5a5;font-weight:900;">⛪ Bishop Demands: £20 (-£4 Starvation Gap!)</span>
              </div>
              <div style="height:10px;border-radius:999px;background:#7f1d1d;overflow:hidden;display:flex;">
                <div style="width:80%;background:#16a34a;"></div>
              </div>
            </div>
          </div>

          <!-- Right: Commissioner Rulings & Historical Match Reveal -->
          <div class="dst-card-panel">
            <div style="font-size:0.76rem;font-weight:900;color:#fbbf24;text-transform:uppercase;margin-bottom:8px;">
              STAGE 4 • CAST YOUR ROYAL COMMISSIONER VERDICT
            </div>

            <div style="margin-bottom:10px;">
              <div style="font-size:0.85rem;font-weight:800;margin-bottom:6px;">
                Ruling 1 — King Edward’s Viking Tax Break (30 hides taxed at 20 "because it is on the sea"):
              </div>
              <button type="button" class="dst-choice-btn ${state.rulingVikings === 'keep20' ? 'is-correct' : ''}" data-pick-vikings="keep20">
                🛡️ Keep Fareham’s 20-hide coastal Viking discount
              </button>
              <button type="button" class="dst-choice-btn ${state.rulingVikings === 'hike30' ? 'is-correct' : ''}" data-pick-vikings="hike30">
                🪙 Scrap the Saxon discount—tax all 30 hides!
              </button>
            </div>

            <div style="margin-bottom:10px;">
              <div style="font-size:0.85rem;font-weight:800;margin-bottom:6px;">
                Ruling 2 — Bishop Walkelin’s £20 Rent Squeeze (Town only produces £16):
              </div>
              <button type="button" class="dst-choice-btn ${state.rulingBishop === 'shame20' ? 'is-correct' : ''}" data-pick-bishop="shame20">
                📜 Record the £20—and warn in Latin that Fareham "cannot bear it"!
              </button>
              <button type="button" class="dst-choice-btn ${state.rulingBishop === 'force20' ? 'is-correct' : ''}" data-pick-bishop="force20">
                🔨 Rubber-stamp Bishop Walkelin’s £20 without complaint
              </button>
            </div>

            ${
              !state.assizeVerdictRevealed
                ? `
              <button type="button" class="dst-start-cta" id="dst-btn-slam-gavel" style="width:100%;opacity:${canSlamGavel ? '1' : '0.45'};" ${canSlamGavel ? '' : 'disabled'}>
                🔨 SLAM GAVEL &amp; COMPARE TO REAL 1086 BOOK!
              </button>
            `
                : `
              <div style="padding:12px 14px;border-radius:11px;background:rgba(20,83,45,0.35);border:2px solid #22c55e;margin-top:8px;">
                <div style="font-weight:900;color:#fde047;font-size:0.88rem;margin-bottom:4px;">
                  ${matchedRealHistory ? '🏆 2/2 EXACT MATCH WITH KING WILLIAM’S REAL 1086 COMMISSIONERS!' : '📜 SURPRISE TWIST — KING WILLIAM’S REAL SCRIBES WERE MERCIFUL HERE!'}
                </div>
                <p style="margin:0;font-size:0.83rem;line-height:1.45;color:#f8fafc;">
                  In the genuine 1086 Fareham entry, royal scribes <strong>KEPT the 20-hide Viking discount</strong> (<em>"because of the Vikings, since it is on the sea"</em>) AND shamed Bishop Walkelin in writing: <strong><em>"it pays £20, but it cannot bear it"</em></strong>!
                </p>
              </div>
              <button type="button" class="dst-next-btn" data-complete-next="beat4">
                Stage 5 → Count the Invisible Family Inside Stubbington Hut #3 <i class="fa-solid fa-arrow-right"></i>
              </button>
            `
            }
          </div>
        </div>
      </div>
    `;
  }

  function renderBeat4HTML() {
    const peopleCount = computeHutPeopleCount();
    const spotsCount = state.foundBlindSpots.size;
    const readyNext = spotsCount >= 4;
    const touch = isTouchUI();
    const actVerb = touch ? 'Tap' : 'Hover';

    return `
      <div class="dst-body">
        ${renderSpeechBannerHTML()}

        <div class="dst-subtab-bar">
          <button type="button" class="dst-step-pill ${state.beat4Tab === 'hut' ? 'is-active' : ''}" data-b4-tab="hut">
            <span class="dst-lbl-full">🏠 Part A: Inside Stubbington Hut #3 (${peopleCount}/8 People Counted)</span>
            <span class="dst-lbl-short">🏠 Hut #3 (${peopleCount}/8)</span>
          </button>
          <button type="button" class="dst-step-pill ${state.beat4Tab === 'map' ? 'is-active' : ''}" data-b4-tab="map">
            <span class="dst-lbl-full">🔎 Part B: Solent Coast Spyglass</span>
            <span class="dst-lbl-short">🔎 Coast Spyglass</span>
          </button>
          <span class="dst-subtab-counter" style="margin-left:auto;font-size:0.78rem;font-weight:900;color:#fde047;">
            Blind Spots Uncovered: ${spotsCount} / 4+
          </span>
        </div>

        <div class="dst-split">
          <div>
            ${
              state.beat4Tab === 'hut'
                ? `
              <div class="dst-diorama-frame" id="dst-fx-stage" data-fx-preset="stubbington_hut">
                <img src="/images/arcade/domesday/scene_4_stubbington_hut.webp"
                     alt="Inside Stubbington Hut #3 in 1086"
                     class="domesday-diorama-img" />
                ${hitZoneHTML({ dataAttr: 'data-b4-spot="edith"', x: 22, y: 54, w: 20, h: 62, found: state.hutPeopleGroups.has('edith'), ariaLabel: 'Inspect Saxon mother Edith in doorway' })}
                ${hitZoneHTML({ dataAttr: 'data-b4-spot="five_kids"', x: 52, y: 56, w: 26, h: 36, found: state.hutPeopleGroups.has('five_kids'), ariaLabel: 'Count the five children around the cauldron and woodpile' })}
                ${hitZoneHTML({ dataAttr: 'data-b4-spot="grandma"', x: 68, y: 60, w: 14, h: 36, found: state.hutPeopleGroups.has('grandma'), ariaLabel: 'Inspect grandmother spinning wool' })}
                ${hitZoneHTML({ dataAttr: 'data-b4-spot="untaxed_pets"', x: 42, y: 83, w: 18, h: 20, found: state.foundBlindSpots.has('untaxed_pets'), ariaLabel: 'Inspect farm dog and rafter chickens' })}
                ${hitZoneHTML({ dataAttr: 'data-b4-spot="rafter_hens"', x: 52, y: 12, w: 16, h: 14, found: state.foundBlindSpots.has('untaxed_pets'), ariaLabel: 'Inspect chickens on cottage beam' })}
                ${hitZoneHTML({ dataAttr: 'data-b4-spot="stumps_bennet"', x: 91, y: 74, w: 15, h: 28, found: state.bennetSightings.has('stumps'), ariaLabel: 'Inspect mossy Stubbington tree stumps and wiggling turnip leaves' })}
              </div>
              ${renderSceneFooterBarHTML(
                (state.hutPeopleGroups.size - 1) + (state.foundBlindSpots.has('untaxed_pets') ? 1 : 0) + (state.bennetSightings.has('stumps') ? 1 : 0),
                5,
                `${actVerb} Edith, kids, Grandma, dog/hens & tree-stumps!`,
              )}
            `
                : `
              <div class="dst-map-frame" id="dst-spyglass-map-wrap">
                ${renderSolentGisSvgHTML({
                  data,
                  mode: 'spyglass',
                  spyglassPos: state.spyglassPos,
                  foundBlindSpots: state.foundBlindSpots,
                })}
              </div>
            `
            }
          </div>

          <div class="dst-card-panel">
            <!-- Live Visual People Counter for Stubbington Hut #3 -->
            <div style="padding:10px 12px;border-radius:10px;background:#292524;border:1.5px solid #f59e0b;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
              <div>
                <div style="font-size:0.7rem;font-weight:900;color:#fde68a;text-transform:uppercase;">DOMESDAY PARCHMENT SAYS</div>
                <div style="font-size:0.95rem;font-weight:900;color:#fca5a5;">"1 Household" (Just Dad!)</div>
              </div>
              <div style="font-size:1.2rem;">➔</div>
              <div style="text-align:right;">
                <div style="font-size:0.7rem;font-weight:900;color:#86efac;text-transform:uppercase;">REAL PEOPLE YOU FOUND IN HUT #3</div>
                <div style="font-size:0.98rem;font-weight:900;color:#ffffff;">👨‍👩‍👧‍👦 ${peopleCount} / 8 People!</div>
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:6px;font-size:0.82rem;">
              <div style="padding:8px 10px;border-radius:8px;background:#292524;border:1px solid ${state.foundBlindSpots.has('edith_family') ? '#22c55e' : '#44403c'};">
                ${state.foundBlindSpots.has('edith_family') ? `✅ <strong>Invisible Women, Kids & Elders (${peopleCount}/8 found in Hut #3):</strong> Stubbington’s "9 households" really meant ~45–50 villagers!` : `⬜ Blind Spot 1 (Hut #3): ${actVerb} Edith, the children, or Grandma...`}
              </div>
              <div style="padding:8px 10px;border-radius:8px;background:#292524;border:1px solid ${state.foundBlindSpots.has('untaxed_pets') ? '#22c55e' : '#44403c'};">
                ${state.foundBlindSpots.has('untaxed_pets') ? '✅ <strong>Dogs, Hens & Veg Plots:</strong> The chronicler exaggerated! If William couldn’t tax it, scribes ignored it.' : `⬜ Blind Spot 2 (Hut #3): ${actVerb} the floor dog or beam chickens...`}
              </div>
              <div style="padding:8px 10px;border-radius:8px;background:#292524;border:1px solid ${state.foundBlindSpots.has('bs_portchester') ? '#22c55e' : '#44403c'};">
                ${state.foundBlindSpots.has('bs_portchester') ? '✅ <strong>No Stone Keep at Portchester Yet:</strong> 1086 only lists Roman walls + "a fishery for the hall" (stone keep built 1120s)!' : '⬜ Blind Spot 3 (Spyglass Map Tab): Tap Portchester on the harbour...'}
              </div>
              <div style="padding:8px 10px;border-radius:8px;background:#292524;border:1px solid ${state.foundBlindSpots.has('bs_gosport') || state.foundBlindSpots.has('bs_portsmouth') || state.foundBlindSpots.has('bs_chark') ? '#22c55e' : '#44403c'};">
                ${state.foundBlindSpots.has('bs_gosport') || state.foundBlindSpots.has('bs_portsmouth') || state.foundBlindSpots.has('bs_chark') ? '✅ <strong>Unborn Portsmouth/Gosport & Unlisted Chark:</strong> Neither port town existed yet, and Chark was silently bundled into Titchfield!' : '⬜ Blind Spot 4 (Spyglass Map Tab): Tap Gosport, Portsmouth, or Chark...'}
              </div>
            </div>

            ${
              state.beat4Tab === 'hut' && state.foundBlindSpots.has('edith_family') && state.foundBlindSpots.has('untaxed_pets') && spotsCount < 4
                ? `<button type="button" class="dst-next-btn" data-b4-tab="map" style="background:#0284c7;border-color:#7dd3fc;">
                     Switch to Solent Spyglass Map for Clues 3 &amp; 4 <i class="fa-solid fa-magnifying-glass"></i>
                   </button>`
                : ''
            }

            ${
              readyNext
                ? `<button type="button" class="dst-next-btn" data-complete-next="beat5">
                     Open Great Domesday Folio 46v → Decode STUBITONE &amp; Stamp Check <i class="fa-solid fa-scroll"></i>
                   </button>`
                : ''
            }
          </div>
        </div>
      </div>
    `;
  }

  function renderBeat5HTML() {
    const chunks = data.stubitoneParchment.chunks;
    const activeChunk = chunks[state.activeChunkIdx] || chunks[0];
    const debrief = data.debriefColumns;
    const unlockedBennet = state.bennetSightings.size >= 3;

    return `
      <div class="dst-body">
        ${renderSpeechBannerHTML()}

        <!-- PART 1: INTERACTIVE STUBITONE 1086 LATIN X-RAY TRANSLATION STATION -->
        <div class="dst-split" style="margin-bottom:16px;">
          <div class="dst-parchment-box">
            <div class="dst-parchment-header">
              📜 ${data.stubitoneParchment.folioHeader}
            </div>

            <div class="dst-slider-bar">
              <span style="font-size:0.73rem;font-weight:900;color:#78350f;white-space:nowrap;">LATIN</span>
              <input type="range" id="dst-latin-slider" min="0" max="100" value="${state.translationPct}"
                     style="flex:1;min-width:70px;height:28px;accent-color:#b91c1c;cursor:pointer;"
                     aria-label="Slide across to translate Stubbington's 1086 Latin entry into English" />
              <span style="font-size:0.73rem;font-weight:900;color:#15803d;white-space:nowrap;">ENG (${state.translationPct}%)</span>
            </div>

            <div class="dst-chunk-grid">
              ${chunks
                .map((ch, idx) => {
                  const threshold = Math.round(((idx + 0.5) / chunks.length) * 100);
                  const showEnglish = state.translationPct >= threshold;
                  const formattedLatin = ch.latin.replace(
                    'STVBITONE',
                    '<span class="dst-rubric-strike">STVBITONE</span>',
                  );
                  return `
                    <div class="dst-latin-row ${state.activeChunkIdx === idx ? 'is-active' : ''}" data-chunk-idx="${idx}">
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                        <span style="font-family:${showEnglish ? 'Inter, sans-serif' : 'Georgia, serif'};font-size:0.9rem;font-weight:${showEnglish ? '800' : '700'};color:${showEnglish ? '#14532d' : '#292524'};line-height:1.35;">
                          <span class="dst-lang-chip ${showEnglish ? '' : 'is-latin'}">${showEnglish ? 'ENG' : 'LAT'}</span>${showEnglish ? ch.english : formattedLatin}
                        </span>
                        <span style="font-size:0.68rem;font-weight:800;color:#9a3412;white-space:nowrap;">Inspect</span>
                      </div>
                    </div>
                  `;
                })
                .join('')}
            </div>
          </div>

          <!-- Decoder Inspector + Royal Wax Seal + Quick-Fire Fact vs Comedy Stamp Check -->
          <div class="dst-card-panel">
            <div style="font-size:0.74rem;font-weight:900;color:#fbbf24;text-transform:uppercase;margin-bottom:4px;">
              🔎 FOLIO 46v DECODER • LINE ${state.activeChunkIdx + 1} OF ${chunks.length}
            </div>
            <h3 style="margin:0 0 6px 0;font-size:1.05rem;color:#fef08a;">${activeChunk.decoderTitle}</h3>
            <div style="font-family:Georgia,serif;font-size:0.86rem;color:#fca5a5;margin-bottom:3px;">
              <strong>1086 Latin:</strong> <em>${activeChunk.latin}</em>
            </div>
            <div style="font-size:0.86rem;color:#86efac;margin-bottom:7px;">
              <strong>Plain English:</strong> ${activeChunk.english}
            </div>
            <p style="margin:0 0 12px 0;font-size:0.83rem;color:#e7e5e4;line-height:1.42;">
              ${activeChunk.decoderNote}
            </p>

            <!-- Royal Seal & Secret Bennet Luvet Sticker -->
            <div style="padding:11px 12px;border-radius:12px;background:linear-gradient(135deg,#450a0a 0%,#1c1917 100%);border:2px solid #dc2626;display:flex;align-items:center;gap:12px;margin-bottom:10px;">
              <div style="width:50px;height:50px;border-radius:50%;background:radial-gradient(circle,#ef4444 0%,#991b1b 75%);border:3px solid #fca5a5;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">
                👑
              </div>
              <div>
                <div style="font-size:0.7rem;font-weight:900;color:#fca5a5;text-transform:uppercase;">KING WILLIAM'S GREAT WAX SEAL</div>
                <div style="font-size:0.94rem;font-weight:900;color:#ffffff;">Royal Solent Commissioner • ${state.score} Audit Points</div>
                <div style="font-size:0.77rem;color:#fde68a;">
                  ${unlockedBennet ? '🏆 SECRET BONUS STICKER #0 UNLOCKED: Boggy Bennet Luvet (Worth £0 0s 0d & 1 Wormy Turnip)!' : `🥕 Spot Bennet’s turnip tuft in all 3 scenes (${state.bennetSightings.size}/3 found) for his £0 sticker!`}
                </div>
              </div>
            </div>

            <button type="button" class="dst-icon-btn" id="dst-btn-hear-debrief" style="width:100%;border-color:#38bdf8;color:#bae6fd;">
              🔊 Hear Historian Summary: What Was Really Recorded in 1086?
            </button>
          </div>
        </div>

        <!-- PART 2: QUICK-FIRE "REAL 1086 RECORD vs. COMEDY COMPOSITE" STAMP TEST -->
        <div style="background:#1c1917;border:1.5px solid #f59e0b;border-radius:14px;padding:13px 15px;margin-bottom:14px;">
          <div style="font-size:0.78rem;font-weight:900;color:#fde047;text-transform:uppercase;margin-bottom:8px;">
            🔨 30-SECOND HISTORIAN STAMP TEST: REAL IN THE 1086 BOOK OR COMEDY INVENTION?
          </div>
          <div class="dst-stamp-grid">
            ${STAMP_CHALLENGES.map((sc) => {
              const picked = state.stampAnswers[sc.id];
              const answered = picked !== undefined;
              const right = picked === sc.isReal;
              return `
                <div style="background:#292524;border:1.5px solid ${!answered ? '#44403c' : right ? '#22c55e' : '#ef4444'};border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
                  <div style="font-size:0.83rem;font-weight:700;color:#f8fafc;line-height:1.38;">&ldquo;${sc.claim}&rdquo;</div>
                  <div style="display:flex;gap:6px;">
                    <button type="button" class="dst-icon-btn ${answered && sc.isReal ? 'is-active' : ''}" data-stamp-id="${sc.id}" data-stamp-val="true" style="flex:1;font-size:0.73rem;">
                      📜 Real 1086
                    </button>
                    <button type="button" class="dst-icon-btn ${answered && !sc.isReal ? 'is-active' : ''}" data-stamp-id="${sc.id}" data-stamp-val="false" style="flex:1;font-size:0.73rem;">
                      🎭 Comedy Cast
                    </button>
                  </div>
                  ${answered ? `<div style="font-size:0.76rem;color:${right ? '#86efac' : '#fca5a5'};line-height:1.35;">${right ? '✅ ' : '💡 '}${sc.note}</div>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- PART 3: 3-COLUMN HISTORICAL TRUTH vs. COMEDY COMPOSITES DEBRIEF -->
        <div style="background:#141210;border:2px solid #78350f;border-radius:14px;padding:14px 16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:4px;">
            <h3 style="margin:0;font-size:1.02rem;color:#fde047;">
              📚 Complete Archive Reference: Fact vs. Comedy in 1086 South Hampshire
            </h3>
            <span style="font-size:0.73rem;color:#a8a29e;">${data.sourceAttribution}</span>
          </div>

          <div class="dst-debrief-grid">
            <div class="dst-debrief-col" style="border-top:4px solid #22c55e;">
              <div style="font-size:0.8rem;font-weight:900;color:#86efac;margin-bottom:8px;">📜 100% REAL IN THE 1086 BOOK</div>
              <ul style="margin:0;padding-left:17px;font-size:0.81rem;color:#e7e5e4;line-height:1.45;">
                ${debrief.recordedTrue.map((item) => `<li style="margin-bottom:6px;">${item}</li>`).join('')}
              </ul>
            </div>

            <div class="dst-debrief-col" style="border-top:4px solid #f59e0b;">
              <div style="font-size:0.8rem;font-weight:900;color:#fde047;margin-bottom:8px;">🎭 OUR COMEDY COMPOSITES</div>
              <ul style="margin:0;padding-left:17px;font-size:0.81rem;color:#e7e5e4;line-height:1.45;">
                ${debrief.comedyComposites.map((item) => `<li style="margin-bottom:6px;">${item}</li>`).join('')}
              </ul>
            </div>

            <div class="dst-debrief-col" style="border-top:4px solid #38bdf8;">
              <div style="font-size:0.8rem;font-weight:900;color:#7dd3fc;margin-bottom:8px;">🔍 REAL 1086 BLIND SPOTS</div>
              <ul style="margin:0;padding-left:17px;font-size:0.81rem;color:#e7e5e4;line-height:1.45;">
                ${debrief.blindSpots.map((item) => `<li style="margin-bottom:6px;">${item}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // MASTER RENDER & EVENT BINDING
  // =========================================================================
  function render() {
    if (unmounted || !stageEl.isConnected) return;
    cleanupFx();

    if (!data) {
      stageEl.innerHTML = `<div class="dst-shell" style="padding:36px;text-align:center;color:#fde68a;font-weight:800;">Unrolling 1086 Hampshire Parchment...</div>`;
      return;
    }

    let stageBody = '';
    if (state.step === 'cover') stageBody = renderCoverHTML();
    else if (state.step === 'beat0') stageBody = renderBeat0HTML();
    else if (state.step === 'beat1') stageBody = renderBeat1HTML();
    else if (state.step === 'beat2') stageBody = renderBeat2HTML();
    else if (state.step === 'beat3') stageBody = renderBeat3HTML();
    else if (state.step === 'beat4') stageBody = renderBeat4HTML();
    else stageBody = renderBeat5HTML();

    stageEl.innerHTML = `
      <div class="dst-shell ${state.isFullscreen ? 'dst-is-fullscreen' : ''} ${state.hintShimmer ? 'dst-hint-shimmer' : ''}">
        ${renderTopBarHTML()}
        ${stageBody}
      </div>
    `;

    const fxStage = stageEl.querySelector('#dst-fx-stage');
    if (fxStage) {
      activeFx = mountLivingDioramaFX(fxStage, fxStage.dataset.fxPreset || 'cover');
    }

    bindEvents();
  }

  function bindEvents() {
    stageEl.querySelectorAll('[data-goto-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        audio.ensureContext();
        goToStep(btn.dataset.gotoStep);
      });
    });

    stageEl.querySelector('#dst-mob-step-select')?.addEventListener('change', (e) => {
      audio.ensureContext();
      goToStep(e.target.value);
    });

    stageEl.querySelectorAll('[data-action="hint-shimmer"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        audio.chimeSuccess();
        triggerHintPulse();
      });
    });

    stageEl.querySelector('#dst-btn-mute')?.addEventListener('click', () => {
      audio.toggleMute();
      render();
    });

    stageEl.querySelector('#dst-btn-fs')?.addEventListener('click', toggleFullscreenMode);
    stageEl.querySelector('#dst-btn-close')?.addEventListener('click', () => {
      cleanupFx();
      audio.destroy();
      ctx.onCloseModal?.();
    });

    stageEl.querySelectorAll('[data-complete-next]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.completedSteps.add(state.step);
        state.score += 100;
        audio.chimeSuccess();
        goToStep(btn.dataset.completeNext);
      });
    });

    // COVER HOTSPOTS
    stageEl.querySelector('#dst-btn-start-adventure')?.addEventListener('click', () => {
      audio.startMusic('overture');
      audio.normanHorn();
      state.completedSteps.add('cover');
      goToStep('beat0');
      audio.playVoice('cover_welcome');
    });

    stageEl.querySelector('#dst-cover-bennet')?.addEventListener('click', () => {
      audio.startMusic('overture');
      audio.mudSquelch();
      state.coverSecretsFound.add('bennet');
      setSpeech(
        'bennet',
        'Bennet Luvet • Fareham Creek Mud',
        'Oi! Press the big shiny start button already! My toes went numb in this freezing Fareham mud twenty minutes ago, and this seagull is eyeing my turnip!',
        'cover_bennet_poke',
      );
      render();
      activeFx?.burst(24, 69, 'mud');
    });

    stageEl.querySelector('#dst-cover-gull')?.addEventListener('click', () => {
      audio.startMusic('overture');
      audio.seagullSquawk();
      state.coverSecretsFound.add('gull');
      setSpeech('bennet', 'Grumpy Solent Seagull', 'SQUAWK! Eyeing Bennet Luvet’s prized turnip since King Edward’s reign!');
      render();
      activeFx?.burst(9.5, 23, 'seagull');
    });

    stageEl.querySelector('#dst-cover-pigs')?.addEventListener('click', () => {
      audio.startMusic('overture');
      audio.pigOink();
      state.coverSecretsFound.add('pigs');
      setSpeech('odo', 'Sweating Reeve Odo', 'Nothing inside this crate, my Lord! Definitely NOT thirteen Fareham woodland hogs!');
      render();
      activeFx?.burst(61, 74, 'gold');
    });

    stageEl.querySelector('#dst-cover-quill')?.addEventListener('click', () => {
      audio.startMusic('overture');
      audio.boing();
      state.coverSecretsFound.add('quill');
      setSpeech('guy', 'Sir Guy de Rouen', 'Careful—this goose-quill is sharper than a Norman broadsword and twice as expensive!', 'beat2_guy_haircut');
      render();
      activeFx?.burst(74, 28, 'gold');
    });

    stageEl.querySelector('#dst-cover-edith')?.addEventListener('click', () => {
      audio.startMusic('overture');
      state.coverSecretsFound.add('edith');
      setSpeech('edith', 'Edith of Stubbington', 'Wait till Stage 5—I’ve got a bone to pick with that French clerk’s headcount!', 'beat4_edith_door');
      render();
      activeFx?.burst(88, 65, 'gold');
    });

    // BEAT 0: SWAMP REWIND
    const triggerPinSelect = (pinId) => {
      state.selectedPinId = pinId;
      state.peekSwampAnyway = false;
      const pin = data.modernPins.find((p) => p.id === pinId);
      if (state.rewound1086 && pin) {
        if (!pin.existed1086) {
          audio.mudSquelch();
          setSpeech('guy', 'Sir Guy de Rouen • Royal Clerk', pin.verdict, 'beat0_swamp_splash');
        } else {
          audio.chimeSuccess();
          setSpeech('guy', 'Sir Guy de Rouen • Royal Clerk', pin.verdict, 'beat0_survived_village');
        }
      }
      render();
    };

    stageEl.querySelectorAll('.solent-home-pin').forEach((g) => {
      g.addEventListener('click', () => triggerPinSelect(g.dataset.pinId));
    });
    stageEl.querySelectorAll('[data-pick-pin]').forEach((b) => {
      b.addEventListener('click', () => triggerPinSelect(b.dataset.pickPin));
    });

    stageEl.querySelector('#dst-btn-rewind')?.addEventListener('click', () => {
      state.rewound1086 = true;
      state.score += 50;
      triggerPinSelect(state.selectedPinId);
    });

    stageEl.querySelector('#dst-btn-peek-swamp')?.addEventListener('click', () => {
      state.peekSwampAnyway = true;
      audio.mudSquelch();
      setSpeech('bennet', 'Bennet Luvet • Gosport Marsh', 'Welcome to 1086 Gosport—bring your wellies!', 'beat0_bennet_swamp');
      render();
    });

    stageEl.querySelector('#dst-swamp-bennet')?.addEventListener('click', () => {
      if (!state.bennetSightings.has('swamp')) state.score += 40;
      state.bennetSightings.add('swamp');
      audio.mudSquelch();
      setSpeech(
        'bennet',
        'Bennet Luvet ("Boggy Bennet") • Cameo 1/3 Found!',
        'Lovely bit of swamp, this! Zero roads, zero shops, pouring sideways rain... stick a ferry here in nine hundred years, maybe it’ll catch on!',
        'beat0_bennet_swamp',
      );
      render();
      activeFx?.burst(56, 55, 'mud');
    });

    stageEl.querySelector('#dst-swamp-gull')?.addEventListener('click', () => {
      state.swampSecretsFound.add('gull');
      audio.seagullSquawk();
      setSpeech('guy', 'Solent Marsh Gull', 'SQUAWK! In 1086, seagulls outnumber humans on the Gosport shore 500 to 1!');
      render();
      activeFx?.burst(83, 18, 'seagull');
    });

    stageEl.querySelector('#dst-swamp-mill')?.addEventListener('click', () => {
      state.swampSecretsFound.add('mill');
      audio.waterwheelSplash();
      setSpeech('guy', 'Distant Fareham Watermill', 'Look up-creek—while Gosport is empty marsh, Fareham already has FIVE booming watermills!');
      render();
      activeFx?.burst(20, 38, 'wheel');
    });

    stageEl.querySelector('#dst-swamp-torch')?.addEventListener('click', () => {
      state.swampSecretsFound.add('torch');
      audio.waxSealSlam();
      setSpeech('bennet', '1086 Iron Pitch-Torch', 'Resin-soaked pine tow burning in a hand-forged iron ring—zero glass streetlamps in 1086!');
      render();
      activeFx?.burst(78, 49, 'gold');
    });

    // BEAT 1: FAREHAM HUNT & GYRTH SERVI
    stageEl.querySelector('#dst-b1-tab-hunt')?.addEventListener('click', () => {
      state.beat1SubMode = 'hunt';
      audio.setMode('overture');
      render();
    });

    const openServiView = () => {
      state.beat1SubMode = 'servi';
      state.serviReflected = true;
      audio.setMode('solemn');
      setSpeech(
        'gyrth',
        'Gyrth • Enslaved Ploughman in Fareham (1 of 10 Servi)',
        'The Bishop’s scribe wrote all ten of us down on the parchment right beside the plough-oxen. In 1086 Fareham, enslaved workers own no land, and we cannot leave.',
        'beat1_gyrth_servi',
      );
      render();
    };
    stageEl.querySelector('#dst-b1-tab-servi')?.addEventListener('click', openServiView);
    stageEl.querySelector('#dst-btn-open-servi')?.addEventListener('click', openServiView);
    stageEl.querySelector('#dst-btn-hear-gyrth')?.addEventListener('click', () => {
      setSpeech(
        'gyrth',
        'Gyrth • Enslaved Ploughman in Fareham',
        'The Bishop’s scribe wrote all ten of us down on the parchment right beside the plough-oxen. In 1086 Fareham, enslaved workers own no land, and we cannot leave.',
        'beat1_gyrth_servi',
      );
      render();
    });

    stageEl.querySelectorAll('[data-servi-spot]').forEach((b) => {
      b.addEventListener('click', () => {
        const s = b.dataset.serviSpot;
        state.farehamExtrasFound.add(s);
        if (s === 'oxen') {
          setSpeech('gyrth', 'Eight-Ox Heavy Plough', 'Fareham had land for 20 ploughs—6 plough teams on the Bishop’s home farm worked directly by the 10 enslaved labourers.');
        } else {
          setSpeech('guy', 'Norman Bailiff on the Ridge', 'Bishop Walkelin’s Norman officials oversaw every bushel of grain harvested from Fareham’s fields.');
        }
        render();
      });
    });

    stageEl.querySelectorAll('[data-b1-spot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sp = btn.dataset.b1Spot;
        if (sp === 'odo') {
          state.farehamExtrasFound.add('odo');
          audio.mudSquelch();
          setSpeech('odo', 'Sweating Reeve Odo', 'Why am I sweating in the rain?! Erm... heavy woollen hood, my Lord! Nothing to see behind me!', 'beat1_odo_oath');
        } else if (sp === 'relic') {
          state.farehamExtrasFound.add('relic');
          audio.relicRattle();
          setSpeech(
            'odo',
            'St Swithin’s Bone Reliquary',
            'Every local jury—the priest, the reeve, and 6 villagers—had to swear on holy saint relics. Medieval Christians believed lying on relics condemned your soul!',
            'beat1_odo_oath',
          );
        } else if (sp === 'mills') {
          if (!state.foundFarehamAssets.has('mills')) state.score += 60;
          state.foundFarehamAssets.add('mills');
          audio.waterwheelSplash();
          setSpeech(
            'odo',
            'Caught! 5 Spinning Watermills!',
            'AHA! Five watermills on the creek worth 41 shillings—and peasants were legally banned from grinding flour at home without paying the Bishop!',
            state.foundFarehamAssets.size >= 3 ? 'beat1_mills_caught' : null,
          );
        } else if (sp === 'pigs') {
          if (!state.foundFarehamAssets.has('pigs')) state.score += 60;
          state.foundFarehamAssets.add('pigs');
          audio.pigOink();
          setSpeech(
            'odo',
            'Caught! Woodland for 13 Pigs!',
            'OINK! Thirteen fat pigs rooting for acorns in the Bishop’s oak woods—every pannage pig render goes into the Domesday Book!',
            state.foundFarehamAssets.size >= 3 ? 'beat1_mills_caught' : null,
          );
        } else if (sp === 'church_meadow') {
          if (!state.foundFarehamAssets.has('church_meadow')) state.score += 60;
          state.foundFarehamAssets.add('church_meadow');
          audio.chimeSuccess();
          setSpeech(
            'guy',
            'Caught! 1 Church, 90 Households & 41 Meadow Acres!',
            'Got him! With 90 households and 41 acres of prime hay-meadow, Fareham ranks in the largest 20% of towns in 1086 England!',
            state.foundFarehamAssets.size >= 3 ? 'beat1_mills_caught' : null,
          );
        } else if (sp === 'chickens') {
          state.farehamExtrasFound.add('chickens');
          audio.chickenBawk();
          setSpeech(
            'guy',
            'Sir Guy de Rouen • Decoy Alert!',
            'Put that scrawny chicken down at once! King William taxes plough-teams and watermills, not farmyard poultry!',
            'beat1_guy_chicken',
          );
        } else if (sp === 'bennet') {
          if (!state.bennetSightings.has('creek')) state.score += 40;
          state.bennetSightings.add('creek');
          audio.mudSquelch();
          setSpeech(
            'bennet',
            'Bennet Luvet • Hiding Under the Riverbank! (Cameo 2/3)',
            'Don’t look at me, squire! One wormy turnip, zero oxen, zero land—even the King’s nosy clerks won’t waste good ink on Bennet Luvet!',
            'beat1_bennet_creek',
          );
        }
        render();
        if (sp === 'mills') activeFx?.burst(64, 40, 'wheel');
        else if (sp === 'bennet') activeFx?.burst(8.5, 85, 'mud');
      });
    });

    // BEAT 2: INTERACTIVE 3-MISSION MAP HUNT
    stageEl.querySelectorAll('[data-b2-step]').forEach((b) => {
      b.addEventListener('click', () => {
        state.b2MissionIdx = Number(b.dataset.b2Step);
        render();
      });
    });

    const xrayWrap = stageEl.querySelector('#dst-xray-map-wrap');
    if (xrayWrap) {
      let draggingXray = false;
      const updateXrayFromEvent = (e) => {
        const rect = xrayWrap.getBoundingClientRect();
        if (!rect.width) return;
        const pct = Math.max(4, Math.min(96, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
        const crossed = state.xraySplitPct < 60 && pct >= 60;
        state.xraySplitPct = pct;
        if (crossed) {
          audio.normanHorn();
          setSpeech(
            'hugh',
            'Sheriff Hugh of Port • New Norman Overlord',
            'Godwin’s Stubbington farm? Mine! Wickham? Mine! Fifty-four Hampshire manors? ALL MINE! Best conquest ever!',
            'beat2_hugh_boast',
          );
        }
        render();
      };

      xrayWrap.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.solent-manor-node')) return;
        draggingXray = true;
        xrayWrap.setPointerCapture?.(e.pointerId);
        updateXrayFromEvent(e);
      });
      xrayWrap.addEventListener('pointermove', (e) => {
        if (!draggingXray) return;
        updateXrayFromEvent(e);
      });
      xrayWrap.addEventListener('pointerup', () => {
        draggingXray = false;
      });
    }

    stageEl.querySelector('#dst-xray-range')?.addEventListener('input', (e) => {
      const pct = Number(e.target.value);
      if (state.xraySplitPct < 60 && pct >= 60) {
        audio.normanHorn();
        audio.playVoice('beat2_hugh_boast');
      }
      state.xraySplitPct = pct;
      render();
    });

    stageEl.querySelectorAll('[data-b2-m1]').forEach((b) => {
      b.addEventListener('click', () => {
        if (b.dataset.b2M1 === 'zero') {
          if (!state.b2Solved.has('m1')) state.score += 75;
          state.b2Solved.add('m1');
          state.xraySplitPct = Math.max(state.xraySplitPct, 88);
          audio.chimeSuccess();
          setSpeech('hugh', 'Sheriff Hugh of Port', 'Every single English landowner around Fareham and Stubbington was swept away after 1066!', 'beat2_hugh_boast');
        } else {
          audio.mudSquelch();
          setSpeech('guy', 'Sir Guy de Rouen', 'Look closer! Slide the bar all the way to 1086—not one private Saxon lord survived!');
        }
        render();
      });
    });

    stageEl.querySelectorAll('.solent-manor-node').forEach((g) => {
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        const mId = g.dataset.manorId;
        state.selectedManorId = mId;
        const m = data.manors.find((x) => x.id === mId);

        if (state.step === 'beat2' && state.b2MissionIdx === 1 && !state.b2Solved.has('m2')) {
          if (mId === 'titchfield') {
            state.b2Solved.add('m2');
            state.b2WrongAttempt = '';
            state.score += 90;
            audio.chimeSuccess();
            setSpeech('guy', 'Royal Bullseye • Titchfield (Ticefelle)!', 'Bravo! Titchfield passed straight from King Edward to King William as the royal capital of Titchfield Hundred!');
          } else {
            state.b2WrongAttempt = m ? m.name : mId;
            audio.mudSquelch();
            setSpeech('guy', 'Keep Hunting on the Map!', `${m?.name} went to ${m?.lord1086}—tap the golden Crown shield on the River Meon!`);
          }
        } else if (m && state.step === 'beat2') {
          setSpeech('guy', `${m.name} (${m.domesdayName})`, m.specialNote);
        }
        render();
      });
    });

    stageEl.querySelectorAll('[data-b2-m3]').forEach((b) => {
      b.addEventListener('click', () => {
        if (b.dataset.b2M3 === 'army') {
          if (!state.b2Solved.has('m3')) state.score += 75;
          state.b2Solved.add('m3');
          audio.chimeSuccess();
          setSpeech('monk', 'Brother Aldwin', 'Exactly—Domesday’s middle value ("when acquired") exposes the trail of destruction left by William’s marching troops!');
        } else {
          audio.mudSquelch();
          setSpeech('guy', 'Sir Guy de Rouen', 'Portsmouth didn’t even exist yet! Think about what an invading Norman army did to local farms!');
        }
        render();
      });
    });

    stageEl.querySelector('#dst-btn-ghost-toggle')?.addEventListener('click', () => {
      state.showModernGhost = !state.showModernGhost;
      render();
    });

    stageEl.querySelector('#dst-btn-haircut-gag')?.addEventListener('click', () => {
      audio.boing();
      setSpeech(
        'guy',
        'Sir Guy de Rouen • Offended Norman',
        'Hands off the razor-nick! Shaving the back of one’s neck up to the ears is peak 1086 Norman fashion!',
        'beat2_guy_haircut',
      );
      render();
    });

    // BEAT 3: ROYAL ASSIZE
    stageEl.querySelectorAll('[data-assize-spot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sp = btn.dataset.assizeSpot;
        state.assizeSpotsHeard.add(sp);
        if (sp === 'villager') {
          setSpeech(
            'villager',
            'Fareham Villager • Sworn Witness',
            'King Edward cut Fareham’s tax from 30 hides to 20 because Viking raiders attacked us from the sea! Now Norman Bishop Walkelin demands £20 when our whole town only makes £16—we will starve!',
            'beat3_villager_plea',
          );
        } else if (sp === 'clerk') {
          setSpeech(
            'guy',
            'Sir Guy de Rouen • Exchequer Hawk',
            'Bah! Viking longships haven’t burned Fareham Creek in years! Cancel their soft Saxon discount, and force them to pay Bishop Walkelin every penny of that £20!',
            'beat3_clerk_demand',
          );
        } else if (sp === 'shield') {
          audio.normanHorn();
          setSpeech(
            'villager',
            'Evidence Exhibit • Coastal Viking Raids',
            'Because Fareham sat open to Solent sea-raiders, King Edward officially reduced its geld tax burden from 30 hides to 20.',
          );
        } else if (sp === 'hugh') {
          audio.chimeSuccess();
          setSpeech(
            'hugh',
            'Sheriff Hugh of Port • Stacking Silver',
            'Fifty-four Hampshire manors means mountains of silver pennies—don’t go soft on the peasants now, Commissioner!',
            'beat2_hugh_boast',
          );
        } else if (sp === 'bishop_monk') {
          setSpeech(
            'monk',
            'Bishop Walkelin’s Bailiff • Winchester',
            'Bishop Walkelin is rebuilding vast Winchester Cathedral in Norman stone—he demands £20 a year from Fareham whether the villagers like it or not!',
          );
        }
        render();
      });
    });

    stageEl.querySelectorAll('[data-pick-vikings]').forEach((b) => {
      b.addEventListener('click', () => {
        state.rulingVikings = b.dataset.pickVikings;
        render();
      });
    });
    stageEl.querySelectorAll('[data-pick-bishop]').forEach((b) => {
      b.addEventListener('click', () => {
        state.rulingBishop = b.dataset.pickBishop;
        render();
      });
    });

    stageEl.querySelector('#dst-btn-slam-gavel')?.addEventListener('click', () => {
      state.assizeVerdictRevealed = true;
      state.score += 120;
      audio.waxSealSlam();
      setSpeech(
        'monk',
        'Real 1086 Domesday Parchment Verdict',
        'Astonishingly, King William’s real Commissioners KEPT Fareham’s 20-hide Viking discount—and publicly shamed the Bishop in writing: "it pays £20, but it cannot bear it"!',
        'beat3_real_verdict',
      );
      render();
    });

    // BEAT 4: STUBBINGTON HUT PEOPLE-COUNTER & SPYGLASS
    stageEl.querySelectorAll('[data-b4-tab]').forEach((b) => {
      b.addEventListener('click', () => {
        state.beat4Tab = b.dataset.b4Tab;
        render();
      });
    });

    stageEl.querySelectorAll('[data-b4-spot]').forEach((b) => {
      b.addEventListener('click', () => {
        const sp = b.dataset.b4Spot;
        if (sp === 'edith') {
          if (!state.hutPeopleGroups.has('edith')) state.score += 50;
          state.hutPeopleGroups.add('edith');
          state.foundBlindSpots.add('edith_family');
          setSpeech(
            'edith',
            'Edith of Stubbington • +1 Invisible Wife Found!',
            'Nine households?! Your posh Latin book counted nine husbands in Stubbington and acted like me, Grandma, and five starving kids don’t exist! What am I, a turnip?!',
            'beat4_edith_door',
          );
        } else if (sp === 'five_kids') {
          if (!state.hutPeopleGroups.has('five_kids')) state.score += 60;
          state.hutPeopleGroups.add('five_kids');
          state.foundBlindSpots.add('edith_family');
          audio.chimeSuccess();
          setSpeech(
            'edith',
            'Five Stubbington Children • +5 Invisible Kids Found!',
            'Count ’em: one toddler by the pot, two sharing pottage, and two stacking logs! Zero children are listed anywhere in the Domesday Book!',
          );
        } else if (sp === 'grandma') {
          if (!state.hutPeopleGroups.has('grandma')) state.score += 50;
          state.hutPeopleGroups.add('grandma');
          state.foundBlindSpots.add('edith_family');
          audio.chimeSuccess();
          setSpeech(
            'edith',
            'Grandma Spinning Wool • +1 Invisible Elder Found!',
            'Grandma remembers Viking ships in the Solent under King Cnut—yet because she doesn’t pay geld tax, Domesday pretends she isn’t here!',
          );
        } else if (sp === 'untaxed_pets' || sp === 'rafter_hens') {
          if (!state.foundBlindSpots.has('untaxed_pets')) state.score += 60;
          state.foundBlindSpots.add('untaxed_pets');
          audio.chickenBawk();
          setSpeech(
            'guy',
            'Untaxed Farm Dog & Rafter Hens',
            'Brother Aldwin exaggerated! Scribes ignored dogs, hens, and cottage veg plots because King William couldn’t squeeze tax out of them.',
          );
        } else if (sp === 'stumps_bennet') {
          if (!state.bennetSightings.has('stumps')) state.score += 50;
          state.bennetSightings.add('stumps');
          audio.mudSquelch();
          setSpeech(
            'bennet',
            'Bennet Luvet • Peeking Behind a Stubbington Stump! (Cameo 3/3!)',
            'Psst! "Stubitone" literally means Tree-Stump Farm! And since you spotted my turnip leaves in all three scenes—you’ve unlocked my £0 Boggy Bennet sticker!',
            'beat1_bennet_creek',
          );
        }
        render();
      });
    });

    const spyWrap = stageEl.querySelector('#dst-spyglass-map-wrap');
    if (spyWrap) {
      spyWrap.addEventListener('pointermove', (e) => {
        const rect = spyWrap.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const ring = spyWrap.querySelector('#solent-spyglass-ring');
        const px = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
        const py = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));
        state.spyglassPos = { x: px, y: py };
        if (ring) {
          ring.setAttribute('transform', `translate(${(px / 100) * 900}, ${(py / 100) * 540})`);
        }
      });
    }

    stageEl.querySelectorAll('.solent-blindspot-node').forEach((g) => {
      g.addEventListener('click', () => {
        const id = g.dataset.bsId;
        if (!state.foundBlindSpots.has(id)) {
          state.score += 70;
          audio.chimeSuccess();
        }
        state.foundBlindSpots.add(id);
        if (id === 'bs_portchester') {
          setSpeech(
            'guy',
            'Portchester (Porcestre) • 1086 Blind Spot',
            'No giant Norman stone castle keep yet! Domesday only records Roman walls and "a fishery for the hall"—the tall stone keep wasn’t built until the 1120s!',
          );
        } else if (id === 'bs_chark') {
          setSpeech(
            'guy',
            'Chark • Swallowed Without a Name',
            'Tiny hamlets like Chark didn’t get their own heading in 1086—their fields were silently bundled inside King William’s royal manor of Titchfield!',
          );
        } else {
          setSpeech(
            'guy',
            'Portsmouth & Gosport • Unborn Towns',
            'Neither Portsmouth nor Gosport existed as a town in 1086—reminding us never to project modern maps backwards onto medieval England!',
          );
        }
        render();
      });
    });

    // BEAT 5: STUBITONE PARCHMENT, STAMP QUIZ & DEBRIEF
    stageEl.querySelector('#dst-latin-slider')?.addEventListener('input', (e) => {
      state.translationPct = Number(e.target.value);
      render();
    });

    stageEl.querySelectorAll('[data-chunk-idx]').forEach((row) => {
      row.addEventListener('click', () => {
        state.activeChunkIdx = Number(row.dataset.chunkIdx);
        audio.chimeSuccess();
        render();
      });
    });

    stageEl.querySelectorAll('[data-stamp-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sId = btn.dataset.stampId;
        const val = btn.dataset.stampVal === 'true';
        const item = STAMP_CHALLENGES.find((x) => x.id === sId);
        if (!item) return;
        if (state.stampAnswers[sId] === undefined && val === item.isReal) {
          state.score += 50;
          audio.waxSealSlam();
        } else {
          audio.mudSquelch();
        }
        state.stampAnswers[sId] = val;
        render();
      });
    });

    stageEl.querySelector('#dst-btn-hear-debrief')?.addEventListener('click', () => {
      setSpeech(
        'guy',
        'Historian Final Summary • Fact vs. Comedy',
        'Every village figure you just investigated comes straight from the real 1086 Domesday Book—while characters like Bennet, Edith, and Odo give voice to the nameless locals whom King William’s taxmen never named.',
        'beat5_debrief_historian',
      );
      render();
    });
  }

  render();
  loadDomesdayData()
    .then((json) => {
      data = json;
      render();
    })
    .catch((err) => {
      if (stageEl.isConnected) {
        stageEl.innerHTML = `<div class="dst-shell" style="padding:28px;color:#fca5a5;">Failed to load 1086 Domesday archive: ${err.message}</div>`;
      }
    });

  return () => {
    unmounted = true;
    if (shimmerTimeout) clearTimeout(shimmerTimeout);
    cleanupFx();
    audio.destroy();
  };
}
