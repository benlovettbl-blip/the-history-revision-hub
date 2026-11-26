/**
 * THE SUITCASE ON PLATFORM FOUR: A Child's Wartime Home Front Journey (1939–1945) — v2.1
 * Flagship Key Stage 2 (Ages 9–11) Interactive Storybook Adventure & National UK Evacuation Lab
 *
 * v2.1 Upgrades & Bug Fixes:
 *  - 35/35 100% Studio-voiced scene hotspots & objects (zero silent clicks!) + 1-tap `🔊 Replay` in dialogue bar.
 *  - True task-based stage completion (`isStepTrulyComplete`) — green checkmarks reflect real mastery, never mere tab visits.
 *  - Score-farming guards + partial recovery credit (+6 pts) & crisp red `.is-wrong` badge on Stage 6 Fact Checks.
 *  - 7-Region Accurate All-UK Evacuation Map (`uk_homefront_svg_map.js` v2 — England, Scotland, Wales & Belfast NI + moving train).
 *  - Tactile 3-Dial Brass Enigma Rotor Puzzle (`B - R - K`) on Stage 5 Bletchley Park Hut 8.
 *  - Stage 6 VE Day Confetti Panorama + 6-Pillar Junior Home Front Historian Certificate (with printable certificate view).
 *  - 2-tap `"↺ Sure?"` reset confirmation guard so primary pupils never wipe progress by accident.
 */

import './ww2_homefront.css';
import {
  isCoarseTouchUI,
  createScrollLockManager,
  createSessionPersistence,
  createStageAssetPreloader,
  bindNativeFullscreenSync,
} from './story_lab_engine.js';
import { Ww2HomeFrontAudioDirector } from './ww2_homefront_music.js';
import { mountWw2HomeFrontFX } from './ww2_homefront_fx.js';
import { renderUkHomeFrontMapSVG } from './uk_homefront_svg_map.js';
import { saveArcadePersonalBest } from '../arcade/arcade_audio.js';

const SESSION_SAVE_KEY = 'hh_ww2_homefront_session_v2';

const preloadNextStage = createStageAssetPreloader({
  cover: [
    '/images/arcade/ww2_homefront/scene_1_station_1939.webp',
    '/audio/labs/ww2_homefront/beat0_guard_suitcase.mp3',
  ],
  beat0: [
    '/images/arcade/ww2_homefront/scene_2_country_billet.webp',
    '/audio/labs/ww2_homefront/beat1_farmer_welcome.mp3',
  ],
  beat1: [
    '/images/arcade/ww2_homefront/scene_3_anderson_blitz.webp',
    '/audio/labs/ww2_homefront/beat2_warden_blackout.mp3',
  ],
  beat2: [
    '/images/arcade/ww2_homefront/scene_4_wartime_kitchen.webp',
    '/audio/labs/ww2_homefront/beat3_grocer_welcome.mp3',
  ],
  beat3: [
    '/images/arcade/ww2_homefront/scene_5_bletchley_veday.webp',
    '/audio/labs/ww2_homefront/beat4_wren_welcome.mp3',
  ],
  beat4: [
    '/audio/labs/ww2_homefront/beat5_veday_bells.mp3',
    '/audio/labs/ww2_homefront/beat5_iwm_quest.mp3',
  ],
});

const STEPS = [
  { id: 'cover', short: '🚂 Cover', mob: '🚂 Cover' },
  { id: 'beat0', short: '1. Platform & Map', mob: '1/6 Station' },
  { id: 'beat1', short: '2. Two Suitcases', mob: '2/6 Billet' },
  { id: 'beat2', short: '3. Blitz Shelter', mob: '3/6 Blitz' },
  { id: 'beat3', short: '4. Ration Shop', mob: '4/6 Rations' },
  { id: 'beat4', short: '5. Bletchley Code', mob: '5/6 Code' },
  { id: 'beat5', short: '6. VE Day & IWM', mob: '6/6 VE Day' },
];

const ROTOR_WHEELS = [
  ['A', 'B', 'C', 'D'],
  ['P', 'Q', 'R', 'S'],
  ['J', 'K', 'L', 'M'],
];
const TARGET_ROTORS = ['B', 'R', 'K'];

const SPEAKER_AVATARS = {
  clara: { img: '/images/arcade/ww2_homefront/cover_platform_four.webp', pos: '60.5% 49%', size: '680%' },
  guard: { img: '/images/arcade/ww2_homefront/scene_1_station_1939.webp', pos: '15% 34%', size: '560%' },
  warden: { img: '/images/arcade/ww2_homefront/cover_platform_four.webp', pos: '82.5% 37%', size: '620%' },
  farmer: { img: '/images/arcade/ww2_homefront/scene_2_country_billet.webp', pos: '34% 25%', size: '580%' },
  lotte: { img: '/images/arcade/ww2_homefront/scene_2_country_billet.webp', pos: '78% 50%', size: '580%' },
  mum: { img: '/images/arcade/ww2_homefront/scene_3_anderson_blitz.webp', pos: '82% 52%', size: '640%' },
  grocer: { img: '/images/arcade/ww2_homefront/scene_4_wartime_kitchen.webp', pos: '41% 22%', size: '500%' },
  wren: { img: '/images/arcade/ww2_homefront/scene_5_bletchley_veday.webp', pos: '42% 46%', size: '540%' },
};

let cachedWw2Json = null;
async function loadWw2HomeFrontData() {
  if (cachedWw2Json) return cachedWw2Json;
  const res = await fetch('/data/interactive_labs/ww2HomeFront.json');
  if (!res.ok) throw new Error(`Failed to load ww2HomeFront.json (${res.status})`);
  cachedWw2Json = await res.json();
  return cachedWw2Json;
}

function hitZoneHTML({ id = '', key = '', dataAttr = '', x, y, w = 14, h = 22, found = false, ariaLabel }) {
  return `
    <button type="button"
            ${id ? `id="${id}"` : ''}
            ${key ? `data-hz-key="${key}"` : ''}
            ${dataAttr}
            class="ww2-hit-zone ${found ? 'is-found' : ''}"
            style="left:${x}%;top:${y}%;width:${w}%;height:${h}%;"
            aria-label="${ariaLabel}">
      <span class="ww2-glint-dot"></span>
    </button>
  `;
}

export function mountWw2HomeFront(stageEl, _pools = {}, ctx = {}) {
  if (!stageEl) return () => {};

  const audio = new Ww2HomeFrontAudioDirector();
  const persistence = createSessionPersistence(SESSION_SAVE_KEY);
  const instanceSvgUid = `uk${Math.random().toString(36).slice(2, 7)}`;

  let shellEl = null;
  let activeFx = null;
  let data = null;
  let unmounted = false;
  let shimmerTimeout = null;
  let resetArmTimeout = null;
  let mountedSceneSignature = '';

  const scrollLock = createScrollLockManager(() => shellEl);

  const state = {
    step: ctx.startAtBeat0 ? 'beat0' : 'cover',
    isFullscreen: Boolean(ctx.autoFullscreen),
    hintShimmer: false,
    resetArmed: false,
    score: 0,
    xpAwarded: false,

    avatarKey: 'clara',
    speakerName: 'Clara (Age 10) • 1939 Evacuee Narrator',
    speechText: isCoarseTouchUI()
      ? 'Tap glowing spots on Platform Four to meet our wartime cast—or press BEGIN 1939 HOME FRONT JOURNEY!'
      : 'Hover over Platform Four to uncover discreet shiny clues—or press BEGIN 1939 HOME FRONT JOURNEY!',
    lastVoClipId: 'cover_clara_welcome',

    coverSpotsFound: new Set(),

    // Beat 0: Platform Suitcase Packing + 7-Region All-UK Evacuation Map
    beat0Tab: 'pack', // 'pack' | 'map'
    packedItems: new Set(),
    gramophoneTried: false,
    stationExtrasFound: new Set(),
    selectedRouteId: 'london',
    visitedRoutes: new Set(['london']),

    // Beat 1: Country Farm Billet & Kindertransport Friend Lotte
    billetSpotsFound: new Set(),
    kinderQ1: null, // 'refugee' | 'holiday'
    kinderQ2: null, // 'phoney' | 'stayed6'

    // Beat 2: 1940 Blitz Night & Anderson Shelter Cutaway
    blitzChecks: new Set(), // 'blackout' | 'tape' | 'stirrup' | 'anderson'
    blackoutShut: false,
    morrisonAnswer: null, // 'morrison' | 'tent'

    // Beat 3: 1941 Village Grocer & Ration Counter
    rationBasket: new Set(), // 'egg' | 'butter_bacon' | 'sugar_tea' | 'woolton_veg'
    rationExtrasFound: new Set(),
    unrationedQuiz: null, // 'veg' | 'bacon'

    // Beat 4: Women at War & Bletchley Park 3-Rotor + Cipher Desk
    bletchleySpotsFound: new Set(),
    cipherStepIdx: 0,
    solvedCipherIds: new Set(),
    wrongCipherOpt: '',
    rotors: ['A', 'P', 'M'],
    rotorsRewarded: false,

    // Beat 5: VE Day 1945 Truth Check & Live Imperial War Museums Archive Quest
    factAnswers: {}, // { fc1: true/false, ... }
    fcCredited: new Set(),
    fcHadWrong: new Set(),
    iwmBounty1: null, // '1.5m' | '50k'
    iwmBounty2: null, // '1954' | '1945'
  };

  function areRotorsLocked() {
    return (
      state.rotors[0] === TARGET_ROTORS[0] &&
      state.rotors[1] === TARGET_ROTORS[1] &&
      state.rotors[2] === TARGET_ROTORS[2]
    );
  }

  function isStepTrulyComplete(stepId) {
    if (!data) return false;
    if (stepId === 'beat0') return state.packedItems.size >= 4 && state.visitedRoutes.size >= 2;
    if (stepId === 'beat1') return state.kinderQ1 === 'refugee' && state.kinderQ2 === 'phoney';
    if (stepId === 'beat2') return state.blitzChecks.size >= 4 && state.morrisonAnswer === 'morrison';
    if (stepId === 'beat3') return state.rationBasket.size >= 4 && state.unrationedQuiz === 'veg';
    if (stepId === 'beat4') return state.solvedCipherIds.size >= data.bletchleyClues.length;
    if (stepId === 'beat5') {
      const allFactsCorrect = data.factChecks.every((fc) => state.factAnswers[fc.id] === fc.isTrue);
      return allFactsCorrect && state.iwmBounty1 === '1.5m' && state.iwmBounty2 === '1954';
    }
    return false;
  }

  function syncBestScore() {
    if (state.score > 0) {
      saveArcadePersonalBest('ks2_ww2', 'ww2_homefront', 'all', state.score);
    }
  }

  function addPoints(pts) {
    state.score += pts;
    syncBestScore();
  }

  function saveSession() {
    persistence.save({
      step: state.step,
      score: state.score,
      xpAwarded: state.xpAwarded,
      coverSpotsFound: [...state.coverSpotsFound],
      beat0Tab: state.beat0Tab,
      packedItems: [...state.packedItems],
      gramophoneTried: state.gramophoneTried,
      stationExtrasFound: [...state.stationExtrasFound],
      selectedRouteId: state.selectedRouteId,
      visitedRoutes: [...state.visitedRoutes],
      billetSpotsFound: [...state.billetSpotsFound],
      kinderQ1: state.kinderQ1,
      kinderQ2: state.kinderQ2,
      blitzChecks: [...state.blitzChecks],
      blackoutShut: state.blackoutShut,
      morrisonAnswer: state.morrisonAnswer,
      rationBasket: [...state.rationBasket],
      rationExtrasFound: [...state.rationExtrasFound],
      unrationedQuiz: state.unrationedQuiz,
      bletchleySpotsFound: [...state.bletchleySpotsFound],
      cipherStepIdx: state.cipherStepIdx,
      solvedCipherIds: [...state.solvedCipherIds],
      rotors: state.rotors,
      rotorsRewarded: state.rotorsRewarded,
      factAnswers: state.factAnswers,
      fcCredited: [...state.fcCredited],
      fcHadWrong: [...state.fcHadWrong],
      iwmBounty1: state.iwmBounty1,
      iwmBounty2: state.iwmBounty2,
    });
  }

  function hydrateSession() {
    const saved = persistence.load();
    if (!saved || typeof saved !== 'object') return;
    if (STEPS.some((s) => s.id === saved.step)) state.step = saved.step;
    if (typeof saved.score === 'number') state.score = saved.score;
    state.xpAwarded = Boolean(saved.xpAwarded);
    if (Array.isArray(saved.coverSpotsFound)) state.coverSpotsFound = new Set(saved.coverSpotsFound);
    if (saved.beat0Tab === 'pack' || saved.beat0Tab === 'map') state.beat0Tab = saved.beat0Tab;
    if (Array.isArray(saved.packedItems)) state.packedItems = new Set(saved.packedItems);
    state.gramophoneTried = Boolean(saved.gramophoneTried);
    if (Array.isArray(saved.stationExtrasFound)) state.stationExtrasFound = new Set(saved.stationExtrasFound);
    if (typeof saved.selectedRouteId === 'string') state.selectedRouteId = saved.selectedRouteId;
    if (Array.isArray(saved.visitedRoutes)) state.visitedRoutes = new Set(saved.visitedRoutes);
    if (Array.isArray(saved.billetSpotsFound)) state.billetSpotsFound = new Set(saved.billetSpotsFound);
    if (saved.kinderQ1) state.kinderQ1 = saved.kinderQ1;
    if (saved.kinderQ2) state.kinderQ2 = saved.kinderQ2;
    if (Array.isArray(saved.blitzChecks)) state.blitzChecks = new Set(saved.blitzChecks);
    state.blackoutShut = Boolean(saved.blackoutShut);
    if (saved.morrisonAnswer) state.morrisonAnswer = saved.morrisonAnswer;
    if (Array.isArray(saved.rationBasket)) state.rationBasket = new Set(saved.rationBasket);
    if (Array.isArray(saved.rationExtrasFound)) state.rationExtrasFound = new Set(saved.rationExtrasFound);
    if (saved.unrationedQuiz) state.unrationedQuiz = saved.unrationedQuiz;
    if (Array.isArray(saved.bletchleySpotsFound)) state.bletchleySpotsFound = new Set(saved.bletchleySpotsFound);
    if (typeof saved.cipherStepIdx === 'number') state.cipherStepIdx = saved.cipherStepIdx;
    if (Array.isArray(saved.solvedCipherIds)) state.solvedCipherIds = new Set(saved.solvedCipherIds);
    if (Array.isArray(saved.rotors) && saved.rotors.length === 3) state.rotors = saved.rotors;
    state.rotorsRewarded = Boolean(saved.rotorsRewarded);
    if (saved.factAnswers && typeof saved.factAnswers === 'object') state.factAnswers = saved.factAnswers;
    if (Array.isArray(saved.fcCredited)) state.fcCredited = new Set(saved.fcCredited);
    if (Array.isArray(saved.fcHadWrong)) state.fcHadWrong = new Set(saved.fcHadWrong);
    if (saved.iwmBounty1) state.iwmBounty1 = saved.iwmBounty1;
    if (saved.iwmBounty2) state.iwmBounty2 = saved.iwmBounty2;
  }

  hydrateSession();

  const fsController = bindNativeFullscreenSync({
    getShellEl: () => shellEl,
    onExternalExit: () => {
      if (state.isFullscreen && !ctx.onCloseModal) {
        state.isFullscreen = false;
        updateLab(false);
      }
    },
  });

  function say(avatarKey, speakerName, text, voClipId = null) {
    state.avatarKey = avatarKey;
    state.speakerName = speakerName;
    state.speechText = text;
    if (voClipId) {
      state.lastVoClipId = voClipId;
      audio.playVoice(voClipId);
    }
  }

  function destroyFx() {
    if (activeFx) {
      activeFx.destroy();
      activeFx = null;
    }
    mountedSceneSignature = '';
  }

  function triggerHintPulse() {
    state.hintShimmer = true;
    shellEl?.classList.add('ww2-hint-shimmer');
    if (shimmerTimeout) clearTimeout(shimmerTimeout);
    shimmerTimeout = setTimeout(() => {
      if (unmounted) return;
      state.hintShimmer = false;
      shellEl?.classList.remove('ww2-hint-shimmer');
    }, 1900);
  }

  function setStep(nextStep) {
    state.step = nextStep;
    state.resetArmed = false;

    if (nextStep === 'cover') {
      audio.setMode('story');
      say(
        'clara',
        'Clara (Age 10) • 1939 Evacuee Narrator',
        '1 September 1939! Mum pinned brown labels to our coats and walked us to Platform Four. Explore the platform or press Start!',
        'cover_clara_welcome',
      );
    } else if (nextStep === 'beat0') {
      audio.setMode('story');
      say(
        'guard',
        'Mr Higgins • Platform Four Railway Guard',
        isCoarseTouchUI()
          ? 'Tap the 4 official evacuee items on the trolley to pack Clara’s suitcase—and watch out for anything too heavy!'
          : 'Hover over the platform trolley to pack the 4 official evacuee items—and leave anything too heavy behind!',
        'beat0_guard_suitcase',
      );
    } else if (nextStep === 'beat1') {
      audio.setMode('story');
      say(
        'farmer',
        'Mr Oakley • Meadowbrook Farm Host',
        'Welcome to the countryside! Meet Captain the Shire horse—and say hello to Lotte, who arrived from Prague on the Kindertransport.',
        'beat1_farmer_welcome',
      );
    } else if (nextStep === 'beat2') {
      audio.setMode('nightwatch');
      say(
        'warden',
        'ARP Warden Miller • Night Patrol (1940)',
        state.blackoutShut
          ? 'Street dark and Anderson shelter cosy! Finish checking all 4 Blitz protections and solve the flat-dweller question.'
          : 'Put that light out! Spot the golden chink in the house blackout curtain—tap it to pull it shut, then check all 4 Blitz defences!',
        state.blackoutShut ? 'beat2_blackout_shut' : 'beat2_warden_blackout',
      );
    } else if (nextStep === 'beat3') {
      audio.setMode('story');
      say(
        'grocer',
        'Mrs Wilkins • Village Grocer (1941)',
        'Morning, my dears! Tap all 4 weekly food portions along my counter to weigh out a fair 1941 ration basket!',
        'beat3_grocer_welcome',
      );
    } else if (nextStep === 'beat4') {
      audio.setMode('story');
      say(
        'wren',
        'Leading Wren Miss Bennett • Bletchley Park Hut 8',
        'Hush—Official Secrets Act! Over three-quarters of Bletchley Park staff are women. Help me crack the 6:00 AM weather crib!',
        'beat4_wren_welcome',
      );
    } else if (nextStep === 'beat5') {
      audio.setMode('veday');
      say(
        'clara',
        'Clara • VE Day (8 May 1945)',
        '8 May 1945—Victory in Europe Day! Test 3 wartime myths, then open the real Imperial War Museums archive to claim your Medal!',
        'beat5_veday_bells',
      );
      if (!state.xpAwarded) {
        state.xpAwarded = true;
        addPoints(35);
      }
    }

    saveSession();
    preloadNextStage(nextStep);
    updateLab(true);
  }

  function resetAdventure() {
    persistence.clear();
    state.step = 'cover';
    state.resetArmed = false;
    state.score = 0;
    state.xpAwarded = false;
    state.coverSpotsFound.clear();
    state.beat0Tab = 'pack';
    state.packedItems.clear();
    state.gramophoneTried = false;
    state.stationExtrasFound.clear();
    state.selectedRouteId = 'london';
    state.visitedRoutes = new Set(['london']);
    state.billetSpotsFound.clear();
    state.kinderQ1 = null;
    state.kinderQ2 = null;
    state.blitzChecks.clear();
    state.blackoutShut = false;
    state.morrisonAnswer = null;
    state.rationBasket.clear();
    state.rationExtrasFound.clear();
    state.unrationedQuiz = null;
    state.bletchleySpotsFound.clear();
    state.cipherStepIdx = 0;
    state.solvedCipherIds.clear();
    state.wrongCipherOpt = '';
    state.rotors = ['A', 'P', 'M'];
    state.rotorsRewarded = false;
    state.factAnswers = {};
    state.fcCredited.clear();
    state.fcHadWrong.clear();
    state.iwmBounty1 = null;
    state.iwmBounty2 = null;
    audio.setMode('story');
    say(
      'clara',
      'Clara (Age 10) • 1939 Evacuee Narrator',
      'Fresh 1939 suitcase ready on Platform Four! Explore the station or press BEGIN 1939 HOME FRONT JOURNEY.',
      'cover_clara_welcome',
    );
    updateLab(true);
  }

  function openPrintableCertificate() {
    if (typeof window === 'undefined') return;
    const win = window.open('', '_blank', 'width=860,height=640');
    if (!win) return;
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    win.document.write(`<!DOCTYPE html>
      <html lang="en"><head><meta charset="utf-8"><title>Junior Home Front Historian Certificate</title>
      <style>
        body { font-family: Georgia, serif; background: #f8fafc; margin: 0; padding: 28px; text-align: center; color: #0f172a; }
        .cert { max-width: 720px; margin: 0 auto; padding: 36px 40px; background: #fffbeb; border: 6px double #b45309; border-radius: 16px; box-shadow: 0 12px 30px rgba(0,0,0,0.12); }
        .kicker { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 1.5px; color: #92400e; text-transform: uppercase; }
        h1 { font-size: 30px; margin: 10px 0 6px; color: #1e293b; }
        .medal { font-size: 44px; margin: 8px 0; }
        .sub { font-size: 16px; color: #334155; margin-bottom: 18px; }
        .pillars { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 16px 0 22px; font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
        .pill { padding: 5px 12px; border-radius: 999px; background: #dcfce7; border: 1px solid #16a34a; color: #14532d; }
        .line { display: inline-block; width: 260px; border-bottom: 2px solid #334155; margin: 14px 0 4px; height: 24px; }
        @media print { .no-print { display: none; } body { background: #fff; padding: 0; } }
      </style></head><body>
      <div class="cert">
        <div class="kicker">The History Revision Hub • Key Stage 2 British Home Front (1939–1945)</div>
        <div class="medal">🏅</div>
        <h1>Junior Home Front Historian Medal</h1>
        <p class="sub">Awarded for completing <em>The Suitcase on Platform Four</em> &amp; verifying primary records in the Imperial War Museums Archive</p>
        <div><span class="line"></span><div style="font-size:12px;color:#475569;">Historian’s Name</div></div>
        <div class="pillars">
          <span class="pill">✓ 1939 Evacuation Suitcase</span>
          <span class="pill">✓ All-UK Pied Piper Atlas</span>
          <span class="pill">✓ Kindertransport Empathy</span>
          <span class="pill">✓ 1940 Blitz &amp; Shelters</span>
          <span class="pill">✓ 1941 Fair-Shares Rationing</span>
          <span class="pill">✓ Bletchley Park Enigma Crib</span>
          <span class="pill">✓ IWM Archive Verified (${state.score} pts)</span>
        </div>
        <div style="font-size:13px;color:#475569;">Completed on ${dateStr}</div>
        <div class="no-print" style="margin-top:20px;">
          <button onclick="window.print()" style="padding:10px 22px;font-weight:800;border-radius:8px;border:none;background:#d97706;color:#fff;cursor:pointer;">🖨️ Print / Save as PDF</button>
        </div>
      </div></body></html>`);
    win.document.close();
  }

  function getSceneSignature() {
    if (!data) return 'loading';
    if (state.step === 'beat0') return `beat0:${state.beat0Tab}`;
    return state.step;
  }

  function avatarStyle(key) {
    const a = SPEAKER_AVATARS[key] || SPEAKER_AVATARS.clara;
    return `background-image:url('${a.img}');background-position:${a.pos};background-size:${a.size};`;
  }

  function renderTopBarInnerHTML() {
    const curIdx = Math.max(0, STEPS.findIndex((s) => s.id === state.step));
    const prevStepId = curIdx > 0 ? STEPS[curIdx - 1].id : '';
    const nextStepId = curIdx < STEPS.length - 1 ? STEPS[curIdx + 1].id : '';

    return `
      <div class="ww2-step-strip" role="tablist" aria-label="Home Front Adventure Stages">
        ${STEPS.map((s) => {
          const done = isStepTrulyComplete(s.id);
          const cls = state.step === s.id ? 'is-active' : done ? 'is-done' : '';
          return `<button type="button" class="ww2-step-pill ${cls}" data-step-jump="${s.id}">${done && state.step !== s.id ? '✓ ' : ''}${s.short}</button>`;
        }).join('')}
      </div>

      <div class="ww2-mobile-step-nav">
        <button type="button" class="ww2-mob-arrow-btn" data-step-jump="${prevStepId}" ${!prevStepId ? 'disabled' : ''} aria-label="Previous Stage">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <select id="ww2-mobile-step-select" class="ww2-mobile-step-select" aria-label="Jump to Adventure Stage">
          ${STEPS.map((s) => {
            const done = isStepTrulyComplete(s.id);
            return `<option value="${s.id}" ${state.step === s.id ? 'selected' : ''}>${done && state.step !== s.id ? '✓ ' : ''}${s.mob}</option>`;
          }).join('')}
        </select>
        <button type="button" class="ww2-mob-arrow-btn" data-step-jump="${nextStepId}" ${!nextStepId ? 'disabled' : ''} aria-label="Next Stage">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <div class="ww2-ctrl-group">
        <span class="ww2-score-chip" title="Home Front Historian Points">🏅 ${state.score}<span class="ww2-score-verb"> pts</span></span>
        ${
          state.step !== 'beat5' && !(state.step === 'beat0' && state.beat0Tab === 'map')
            ? `<button type="button" class="ww2-icon-btn ww2-hide-narrow" id="ww2-hint-btn" title="Briefly shimmer hidden picture clues">
                 <i class="fa-solid fa-wand-magic-sparkles" style="color:#fde047;"></i> <span class="ww2-btn-lbl">Clue Pulse</span>
               </button>`
            : ''
        }
        <button type="button" class="ww2-icon-btn ${!audio.muted ? 'is-active' : ''}" id="ww2-mute-btn" title="Toggle 1940s Music & Character Voices">
          <i class="fa-solid ${audio.muted ? 'fa-volume-xmark' : 'fa-volume-high'}"></i>
          <span class="ww2-btn-lbl">${audio.muted ? 'Muted' : 'Sound'}</span>
        </button>
        ${
          state.score > 0 || state.step !== 'cover'
            ? `<button type="button" class="ww2-icon-btn ww2-hide-narrow ${state.resetArmed ? 'is-armed-warn' : ''}" id="ww2-reset-btn" title="${state.resetArmed ? 'Click again to confirm restart' : 'Restart 1939 Journey'}">
                 <i class="fa-solid fa-rotate-left"></i>${state.resetArmed ? ' <span class="ww2-btn-lbl">Sure?</span>' : ''}
               </button>`
            : ''
        }
        <button type="button" class="ww2-icon-btn ${state.isFullscreen ? 'is-active' : ''}" id="ww2-fs-btn" title="${state.isFullscreen ? 'Exit Full-Screen' : 'Full-Screen'}">
          <i class="fa-solid ${state.isFullscreen ? 'fa-compress' : 'fa-expand'}"></i>
          <span class="ww2-btn-lbl">${state.isFullscreen ? 'Exit' : 'Full-Screen'}</span>
        </button>
        ${
          ctx.onCloseModal
            ? `<button type="button" class="ww2-icon-btn" id="ww2-close-modal-btn" style="border-color:#ef4444;color:#fecaca;" title="Return to Lesson">
                 <i class="fa-solid fa-xmark"></i> <span class="ww2-btn-lbl">Close</span>
               </button>`
            : ''
        }
      </div>
    `;
  }

  function getContextHintLabel() {
    if (state.step === 'beat5') return '🏅 Complete Part 1 & Part 2 below';
    if (state.step === 'beat0' && state.beat0Tab === 'map') return '🗺️ Tap any of the 7 UK target cities';
    return isCoarseTouchUI() ? '✨ Tap glowing spots on the picture' : '✨ Hover over picture for shiny spots';
  }

  function renderSpeechInnerHTML() {
    return `
      <div class="ww2-avatar-medallion" style="${avatarStyle(state.avatarKey)}"></div>
      <div style="flex:1;min-width:0;">
        <div class="ww2-speech-speaker">
          <span>${state.speakerName}</span>
          <span style="display:inline-flex;align-items:center;gap:6px;">
            ${
              state.lastVoClipId
                ? `<button type="button" class="ww2-replay-vo-btn" data-replay-vo="1" title="Listen to character voice line again">
                     <i class="fa-solid fa-volume-high"></i> Replay
                   </button>`
                : ''
            }
            <span class="ww2-speech-hint-chip">${getContextHintLabel()}</span>
          </span>
        </div>
        <p class="ww2-speech-text">“${state.speechText}”</p>
      </div>
    `;
  }

  function renderCoverSceneHTML() {
    const touchPrompt = isCoarseTouchUI()
      ? 'Tap glowing spots on Platform Four to hear Clara, the Guard & the ARP Warden!'
      : 'Move your mouse across Platform Four to uncover discreet shiny clues!';

    return `
      <div class="ww2-cover-wrap">
        <div class="ww2-cover-stage">
          <div class="ww2-cover-art-box" id="ww2-fx-stage">
            <img src="/images/arcade/ww2_homefront/cover_platform_four.webp"
                 alt="September 1939 railway platform with green steam locomotive, railway guard, two evacuee children with gas-mask boxes and suitcase, and an ARP warden under twilight searchlights"
                 class="ww2-diorama-img" />
            <div class="ww2-cover-top-shade"></div>

            <div class="ww2-cover-logo-wrap">
              <div class="ww2-cover-kicker">🚂 KEY STAGE 2 INTERACTIVE STORYBOOK ADVENTURE • BRITAIN 1939–1945</div>
              <h2 class="ww2-cover-title">THE SUITCASE ON PLATFORM FOUR</h2>
              <p class="ww2-cover-sub">Evacuation • Kindertransport • Blitz Shelter • Rationing • Bletchley Park • VE Day</p>
            </div>

            ${hitZoneHTML({
              key: 'cov_engine',
              dataAttr: 'data-cover-spot="engine"',
              x: 15,
              y: 46,
              w: 22,
              h: 44,
              found: state.coverSpotsFound.has('engine'),
              ariaLabel: 'Inspect the green steam locomotive on Platform Four',
            })}
            ${hitZoneHTML({
              key: 'cov_guard',
              dataAttr: 'data-cover-spot="guard"',
              x: 35,
              y: 58,
              w: 13,
              h: 44,
              found: state.coverSpotsFound.has('guard'),
              ariaLabel: 'Speak with Mr Higgins the Railway Guard',
            })}
            ${hitZoneHTML({
              key: 'cov_suitcase',
              dataAttr: 'data-cover-spot="suitcase"',
              x: 52,
              y: 83,
              w: 13,
              h: 20,
              found: state.coverSpotsFound.has('suitcase'),
              ariaLabel: 'Inspect Clara and Arthur’s brown leather suitcase',
            })}
            ${hitZoneHTML({
              key: 'cov_children',
              dataAttr: 'data-cover-spot="children"',
              x: 63,
              y: 65,
              w: 18,
              h: 46,
              found: state.coverSpotsFound.has('children'),
              ariaLabel: 'Speak with evacuees Clara and Arthur',
            })}
            ${hitZoneHTML({
              key: 'cov_warden',
              dataAttr: 'data-cover-spot="warden"',
              x: 84,
              y: 58,
              w: 15,
              h: 52,
              found: state.coverSpotsFound.has('warden'),
              ariaLabel: 'Speak with the ARP Air Raid Warden under the station lantern',
            })}
          </div>
        </div>

        <div class="ww2-cover-footer">
          <div class="ww2-cover-quote-wrap" id="ww2-cover-quote-slot" style="flex:1 1 280px;min-width:0;">
            ${renderCoverQuoteInnerHTML(touchPrompt)}
          </div>
          <div class="ww2-cover-cta-row">
            <button type="button" class="ww2-start-cta" id="ww2-start-btn">
              ▶ BEGIN 1939 HOME FRONT JOURNEY
            </button>
            <button type="button" class="ww2-icon-btn" id="ww2-cover-hint-btn" title="Shimmer clickable spots on the painting">
              <i class="fa-solid fa-wand-magic-sparkles" style="color:#fde047;"></i> <span>Show Spots</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderCoverQuoteInnerHTML(fallbackHint = '') {
    return `
      <div style="font-size:0.72rem;font-weight:900;color:#fbbf24;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px;">
        ${state.speakerName} <span style="color:#94a3b8;font-weight:700;text-transform:none;">• Clues found: ${state.coverSpotsFound.size}/5</span>
      </div>
      <div style="font-size:0.86rem;color:#f1f5f9;font-weight:700;line-height:1.34;">
        “${state.speechText}”
        ${fallbackHint && state.coverSpotsFound.size === 0 ? `<span style="color:#fde68a;font-size:0.78rem;display:block;margin-top:2px;">${fallbackHint}</span>` : ''}
      </div>
    `;
  }

  function renderBeat0RightHTML() {
    const totalRoutes = data.evacuationRoutes.length;
    if (state.beat0Tab === 'pack') {
      const officialDone = state.packedItems.size >= 4;
      return `
        <div class="ww2-card-panel">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px;">
            <span style="font-size:0.73rem;font-weight:900;color:#fbbf24;text-transform:uppercase;letter-spacing:0.5px;">
              🧳 1939 MINISTRY EVACUEE CHECKLIST
            </span>
            <span style="font-size:0.76rem;font-weight:900;color:${officialDone ? '#86efac' : '#fde68a'};">
              ${state.packedItems.size} / 4 Packed
            </span>
          </div>
          <p style="margin:0 0 10px;font-size:0.82rem;color:#cbd5e1;line-height:1.38;">
            Tap the <strong>4 official items</strong> inside the open suitcase on the trolley (or tap below)—and see why one item on the trolley must stay behind!
          </p>

          ${data.suitcaseItems
            .map((item) => {
              const isPacked = state.packedItems.has(item.id);
              const isDecoyTried = !item.isOfficial && state.gramophoneTried;
              const cls = isPacked ? 'is-correct' : isDecoyTried ? 'is-selected-wrong' : '';
              const icon = isPacked ? '✅' : isDecoyTried ? '🚫' : item.isOfficial ? '🧳' : '📯';
              return `
                <button type="button" class="ww2-choice-btn ${cls}" data-pack-item="${item.id}">
                  <span style="font-size:1.05rem;flex-shrink:0;">${icon}</span>
                  <div style="flex:1;min-width:0;">
                    <div style="font-weight:800;font-size:0.84rem;">${item.label}</div>
                    ${
                      isPacked || isDecoyTried
                        ? `<div style="font-size:0.75rem;opacity:0.92;margin-top:2px;font-weight:600;">${item.note}</div>`
                        : ''
                    }
                  </div>
                </button>
              `;
            })
            .join('')}

          ${
            officialDone
              ? `<button type="button" class="ww2-next-btn" data-b0-switch="map">
                   🗺️ Next: Trace UK Evacuation Trains (${state.visitedRoutes.size}/${totalRoutes} Cities) <i class="fa-solid fa-arrow-right"></i>
                 </button>`
              : ''
          }
        </div>
      `;
    }

    const activeRoute =
      data.evacuationRoutes.find((r) => r.id === state.selectedRouteId) || data.evacuationRoutes[0];
    const readyNext = state.packedItems.size >= 4 && state.visitedRoutes.size >= 2;

    return `
      <div class="ww2-card-panel">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="font-size:0.73rem;font-weight:900;color:#fbbf24;text-transform:uppercase;">
            🚂 ALL-UK OPERATION PIED PIPER ROUTES
          </span>
          <span style="font-size:0.75rem;font-weight:800;color:#86efac;">
            ${state.visitedRoutes.size}/${totalRoutes} Regions Explored
          </span>
        </div>

        <div class="ww2-route-info-card">
          <div style="font-size:0.9rem;font-weight:900;color:#fef08a;margin-bottom:3px;">
            🔴 From: ${activeRoute.city}
          </div>
          <div style="font-size:0.8rem;font-weight:800;color:#86efac;margin-bottom:6px;">
            🟢 Safe Billet: ${activeRoute.destName} (${activeRoute.evacuees})
          </div>
          <p style="margin:0 0 6px;font-size:0.8rem;color:#e2e8f0;line-height:1.36;">
            <strong>Why evacuate?</strong> ${activeRoute.riskReason}
          </p>
          <p style="margin:0;font-size:0.79rem;color:#cbd5e1;line-height:1.36;">
            <strong>Journey:</strong> ${activeRoute.receptionNote}
          </p>
        </div>

        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;">
          ${data.evacuationRoutes
            .map((r) => {
              const isSel = r.id === state.selectedRouteId;
              const seen = state.visitedRoutes.has(r.id);
              const shortLabel = r.city.split('&')[0].split(',')[0].replace('Shipyards', '').trim();
              return `
                <button type="button" class="ww2-step-pill ${isSel ? 'is-active' : seen ? 'is-done' : ''}"
                        style="width:100%;text-align:center;font-size:0.74rem;"
                        data-route-btn="${r.id}">
                  ${seen ? '✓ ' : ''}${shortLabel}
                </button>
              `;
            })
            .join('')}
        </div>

        <button type="button" class="ww2-next-btn" data-step-jump="beat1" style="margin-top:11px;">
          ${readyNext ? '🏡 Board the Train to Meadowbrook Farm!' : '🏡 Continue to Stage 2: Country Billet'} <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    `;
  }

  function renderBeat1RightHTML() {
    const bothDone = state.kinderQ1 === 'refugee' && state.kinderQ2 === 'phoney';
    return `
      <div class="ww2-card-panel">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="font-size:0.73rem;font-weight:900;color:#fbbf24;text-transform:uppercase;">
            🤝 TWO SUITCASES: EVACUEES & KINDERTRANSPORT
          </span>
          <span style="font-size:0.74rem;font-weight:800;color:#93c5fd;">
            Scene clues: ${state.billetSpotsFound.size}/5
          </span>
        </div>

        <p style="margin:0 0 8px;font-size:0.81rem;color:#cbd5e1;line-height:1.36;">
          Tap Farmer Oakley, Captain the horse, and Lotte on the doorstep—then answer two historian questions:
        </p>

        <div style="margin-bottom:10px;">
          <div style="font-size:0.8rem;font-weight:800;color:#fef3c7;margin-bottom:5px;">
            1. How was Lotte’s <em>Kindertransport</em> journey different from Clara’s British evacuation?
          </div>
          <button type="button" class="ww2-choice-btn ${state.kinderQ1 === 'refugee' ? 'is-correct' : ''}" data-kinder-q1="refugee">
            <span>🕊️</span>
            <span>Nearly 10,000 child refugees escaped Nazi persecution across Europe alone—and could not simply write or travel back home.</span>
          </button>
          <button type="button" class="ww2-choice-btn ${state.kinderQ1 === 'holiday' ? 'is-selected-wrong' : ''}" data-kinder-q1="holiday">
            <span>🏖️</span>
            <span>It was a short two-week summer seaside holiday with their schoolteachers.</span>
          </button>
        </div>

        <div>
          <div style="font-size:0.8rem;font-weight:800;color:#fef3c7;margin-bottom:5px;">
            2. Why did thousands of British evacuees drift back home in late 1939 before the Blitz?
          </div>
          <button type="button" class="ww2-choice-btn ${state.kinderQ2 === 'phoney' ? 'is-correct' : ''}" data-kinder-q2="phoney">
            <span>⏳</span>
            <span>During the quiet ‘Phoney War’ winter, heavy bombing hadn’t started yet and many missed home!</span>
          </button>
          <button type="button" class="ww2-choice-btn ${state.kinderQ2 === 'stayed6' ? 'is-selected-wrong' : ''}" data-kinder-q2="stayed6">
            <span>📜</span>
            <span>World War II ended by Christmas 1939 so nobody needed shelters anymore.</span>
          </button>
        </div>

        ${
          bothDone
            ? `<button type="button" class="ww2-next-btn" data-step-jump="beat2">
                 🌙 Continue to Stage 3: Sept 1940 Blitz & Shelter <i class="fa-solid fa-arrow-right"></i>
               </button>`
            : ''
        }
      </div>
    `;
  }

  function renderBeat2RightHTML() {
    const items = [
      {
        id: 'blackout',
        title: 'Pull the Leaking Blackout Curtain Shut',
        doneNote: 'Sealed! Heavy black curtains stopped night bombers using street glow to aim.',
      },
      {
        id: 'tape',
        title: 'Crisscross Sticky Tape on Glass Panes',
        doneNote: 'Checked! Paper tape helped stop glass shattering into dangerous flying splinters.',
      },
      {
        id: 'stirrup',
        title: 'Red Garden Stirrup-Pump & Water Bucket',
        doneNote: 'Ready! Neighbours pumped water onto small incendiary sparks before fires spread.',
      },
      {
        id: 'anderson',
        title: 'Earth-Covered Corrugated-Steel Anderson Shelter',
        doneNote: 'Cosy & strong! Half-buried curved steel + soil absorbed shockwaves outside in the garden.',
      },
    ];
    const allDone = state.blitzChecks.size >= 4 && state.morrisonAnswer === 'morrison';

    return `
      <div class="ww2-card-panel">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="font-size:0.73rem;font-weight:900;color:#fbbf24;text-transform:uppercase;">
            🔦 1940 BLITZ NIGHT SAFETY CHECK
          </span>
          <span style="font-size:0.75rem;font-weight:900;color:${state.blitzChecks.size >= 4 ? '#86efac' : '#fde68a'};">
            ${state.blitzChecks.size}/4 Checked
          </span>
        </div>

        <p style="margin:0 0 8px;font-size:0.8rem;color:#cbd5e1;line-height:1.35;">
          Tap all <strong>4 wartime protections</strong> in the garden cutaway (watch the leaking window light when you shut the curtain!):
        </p>

        ${items
          .map((it) => {
            const done = state.blitzChecks.has(it.id);
            return `
              <button type="button" class="ww2-choice-btn ${done ? 'is-correct' : ''}" data-blitz-check="${it.id}">
                <span>${done ? '✅' : '🔦'}</span>
                <div>
                  <div style="font-weight:800;font-size:0.83rem;">${it.title}</div>
                  ${done ? `<div style="font-size:0.74rem;opacity:0.92;margin-top:2px;">${it.doneNote}</div>` : ''}
                </div>
              </button>
            `;
          })
          .join('')}

        <div style="margin-top:9px;padding-top:9px;border-top:1px solid #334155;">
          <div style="font-size:0.8rem;font-weight:800;color:#fef3c7;margin-bottom:5px;">
            Quick Check: What if a city family lived in an upstairs flat with NO garden?
          </div>
          <button type="button" class="ww2-choice-btn ${state.morrisonAnswer === 'morrison' ? 'is-correct' : ''}" data-morrison-opt="morrison">
            <span>🛏️</span>
            <span>They slept inside a steel-topped indoor <strong>Morrison Shelter</strong> (or sheltered in Underground stations)!</span>
          </button>
          <button type="button" class="ww2-choice-btn ${state.morrisonAnswer === 'tent' ? 'is-selected-wrong' : ''}" data-morrison-opt="tent">
            <span>⛺</span>
            <span>They pitched a canvas camping tent on top of the chimney roof.</span>
          </button>
        </div>

        ${
          allDone
            ? `<button type="button" class="ww2-next-btn" data-step-jump="beat3">
                 🥕 Continue to Stage 4: 1941 Ration Shop <i class="fa-solid fa-arrow-right"></i>
               </button>`
            : ''
        }
      </div>
    `;
  }

  function renderBeat3RightHTML() {
    const couponsUsed = [...state.rationBasket].filter((id) => id !== 'woolton_veg').length;
    const allWeighed = state.rationBasket.size >= 4;
    const stageReady = allWeighed && state.unrationedQuiz === 'veg';

    return `
      <div class="ww2-card-panel">
        <div class="ww2-ration-book">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
            <strong style="font-size:0.76rem;text-transform:uppercase;letter-spacing:0.5px;color:#78350f;">
              📔 MINISTRY OF FOOD • WEEKLY RATION BOOK
            </strong>
            <span style="font-size:0.74rem;font-weight:900;color:#9a3412;">
              Coupons Stamped: ${couponsUsed}/3
            </span>
          </div>
          <div style="font-size:0.77rem;color:#451a03;margin-top:3px;">
            Tap all <strong>4 weekly food portions</strong> on Mrs Wilkins’s wooden counter to fill your basket!
          </div>
        </div>

        ${data.rationItems
          .map((item) => {
            const got = state.rationBasket.has(item.id);
            return `
              <button type="button" class="ww2-choice-btn ${got ? 'is-correct' : ''}" data-ration-item="${item.id}">
                <span>${got ? '✅' : item.couponRequired ? '🎟️' : '🥕'}</span>
                <div style="flex:1;min-width:0;">
                  <div style="display:flex;justify-content:space-between;gap:6px;font-weight:800;font-size:0.83rem;">
                    <span>${item.name}</span>
                    <span style="color:#fde047;font-size:0.73rem;">${item.oz}</span>
                  </div>
                  ${got ? `<div style="font-size:0.74rem;opacity:0.94;margin-top:2px;">${item.fact}</div>` : ''}
                </div>
              </button>
            `;
          })
          .join('')}

        <div style="margin-top:8px;padding-top:8px;border-top:1px solid #334155;">
          <div style="font-size:0.8rem;font-weight:800;color:#fef3c7;margin-bottom:5px;">
            Why didn’t Mrs Wilkins snip a coupon for the carrots, potatoes &amp; Woolton Pie?
          </div>
          <button type="button" class="ww2-choice-btn ${state.unrationedQuiz === 'veg' ? 'is-correct' : ''}" data-ration-quiz="veg">
            <span>🌱</span>
            <span>Fresh home-grown vegetables were <strong>never rationed</strong>—Britain grew its own in ‘Dig for Victory’ gardens!</span>
          </button>
          <button type="button" class="ww2-choice-btn ${state.unrationedQuiz === 'bacon' ? 'is-selected-wrong' : ''}" data-ration-quiz="bacon">
            <span>🚢</span>
            <span>Carrots were imported by submarine from South America every Tuesday.</span>
          </button>
        </div>

        ${
          stageReady
            ? `<button type="button" class="ww2-next-btn" data-step-jump="beat4">
                 🔐 Continue to Stage 5: Bletchley Park Codebreakers <i class="fa-solid fa-arrow-right"></i>
               </button>`
            : ''
        }
      </div>
    `;
  }

  function renderRotorCabinetHTML() {
    const locked = areRotorsLocked();
    return `
      <div class="ww2-rotor-cabinet">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:0.72rem;font-weight:900;">
          <span style="color:#fde047;">⚙️ BRASS ROTOR DIALS (TARGET SETTING: B - R - K)</span>
          <span style="color:${locked ? '#86efac' : '#fca5a5'};">${locked ? '🟢 ROTORS LOCKED!' : '🔴 SPIN TO B - R - K'}</span>
        </div>
        <div class="ww2-rotor-grid">
          ${state.rotors
            .map((letter, idx) => {
              const ok = letter === TARGET_ROTORS[idx];
              return `
                <div class="ww2-rotor-slot ${ok ? 'is-locked' : ''}">
                  <div style="font-size:0.65rem;color:#cbd5e1;font-weight:800;">ROTOR ${idx + 1}</div>
                  <button type="button" class="ww2-rotor-step-btn" data-rotor-idx="${idx}" data-rotor-dir="1" aria-label="Spin Rotor ${idx + 1} Up">▲</button>
                  <div class="ww2-rotor-letter">${letter}</div>
                  <button type="button" class="ww2-rotor-step-btn" data-rotor-idx="${idx}" data-rotor-dir="-1" aria-label="Spin Rotor ${idx + 1} Down">▼</button>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  function renderBeat4RightHTML() {
    const allCracked = state.solvedCipherIds.size >= data.bletchleyClues.length;
    const activeClue =
      data.bletchleyClues[Math.min(state.cipherStepIdx, data.bletchleyClues.length - 1)];

    return `
      <div class="ww2-card-panel ww2-beat4-card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px;">
          <span style="font-size:0.73rem;font-weight:900;color:#fbbf24;text-transform:uppercase;">
            🔐 HUT 8 ENIGMA DESK • WOMEN AT WAR
          </span>
          <span style="font-size:0.75rem;font-weight:900;color:${allCracked ? '#86efac' : '#fde68a'};">
            ${state.solvedCipherIds.size}/3 Steps Decoded
          </span>
        </div>

        ${
          !allCracked
            ? `
          <div style="font-size:0.75rem;font-weight:800;color:#93c5fd;margin-top:4px;">
            ${activeClue.stepBadge}
          </div>
          <div class="ww2-cipher-strip">${activeClue.cipherLine}</div>
          ${renderRotorCabinetHTML()}
          <p style="margin:0 0 9px;font-size:0.83rem;color:#f1f5f9;font-weight:700;line-height:1.36;">
            ${activeClue.question}
          </p>
          ${activeClue.options
            .map((opt) => {
              const isWrong = state.wrongCipherOpt === `${activeClue.id}:${opt.id}`;
              return `
                <button type="button" class="ww2-choice-btn ${isWrong ? 'is-selected-wrong' : ''}"
                        data-cipher-opt="${opt.id}">
                  <span>${opt.label}</span>
                </button>
              `;
            })
            .join('')}
        `
            : `
          ${renderRotorCabinetHTML()}
          <div class="ww2-cipher-strip" style="border-color:#22c55e;color:#86efac;">
            ✅ ULTRA ALERT SENT: ATLANTIC FOOD CONVOY SAFELY REROUTED AROUND U-BOATS!
          </div>
          <p style="margin:0 0 10px;font-size:0.83rem;color:#dcfce7;line-height:1.42;">
            Brilliant work! Over <strong>75% of Bletchley Park’s 10,000 staff were women</strong>—and they kept their life-saving work secret until the 1970s! Meanwhile, look through the open hut doors on the right: church bells are ringing for <strong>8 May 1945</strong>!
          </p>
          <button type="button" class="ww2-next-btn" data-step-jump="beat5">
            🎉 Step Outside into VE Day 1945 &amp; Live IWM Archive! <i class="fa-solid fa-arrow-right"></i>
          </button>
        `
        }
      </div>
    `;
  }

  function renderBeat5InnerHTML() {
    const bountySolvedCount =
      (state.iwmBounty1 === '1.5m' ? 1 : 0) + (state.iwmBounty2 === '1954' ? 1 : 0);
    const allFactsRight = data.factChecks.every((fc) => state.factAnswers[fc.id] === fc.isTrue);
    const medalUnlocked = bountySolvedCount === 2;

    const pillars = [
      { label: '1939 Suitcase (4/4)', ok: state.packedItems.size >= 4 },
      { label: 'All-UK Atlas', ok: state.visitedRoutes.size >= 2 },
      { label: 'Kindertransport Check', ok: isStepTrulyComplete('beat1') },
      { label: 'Blitz Blackout & Shelter', ok: isStepTrulyComplete('beat2') },
      { label: '1941 Ration Basket', ok: isStepTrulyComplete('beat3') },
      { label: 'Bletchley Enigma Crib', ok: isStepTrulyComplete('beat4') },
      { label: 'VE Day Truth Check', ok: allFactsRight },
      { label: 'IWM Archive Bounties', ok: medalUnlocked },
    ];

    return `
      <!-- PART 1: 3-CARD WARTIME FACT OR MYTH CHECK -->
      <div class="ww2-card-panel" style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
          <span style="font-size:0.78rem;font-weight:900;color:#fbbf24;text-transform:uppercase;letter-spacing:0.5px;">
            🎉 PART 1: VE DAY (8 MAY 1945) — TRUE OR WARTIME MYTH?
          </span>
          <span style="font-size:0.75rem;font-weight:800;color:#86efac;">
            Verified: ${data.factChecks.filter((f) => state.factAnswers[f.id] === f.isTrue).length} / ${data.factChecks.length}
          </span>
        </div>

        <div class="ww2-stamp-grid">
          ${data.factChecks
            .map((fc) => {
              const ans = state.factAnswers[fc.id];
              const answered = typeof ans === 'boolean';
              const right = answered && ans === fc.isTrue;
              const trueCls =
                answered && ans === true ? (fc.isTrue ? 'is-done' : 'is-wrong') : '';
              const mythCls =
                answered && ans === false ? (!fc.isTrue ? 'is-done' : 'is-wrong') : '';
              return `
                <div style="background:#0f172a;border:1.5px solid ${answered ? (right ? '#22c55e' : '#ef4444') : '#334155'};border-radius:12px;padding:11px 12px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
                  <p style="margin:0;font-size:0.83rem;font-weight:700;color:#f8fafc;line-height:1.36;">
                    “${fc.statement}”
                  </p>
                  <div style="display:flex;gap:6px;">
                    <button type="button" class="ww2-step-pill ${trueCls}"
                            style="flex:1;" data-fc-id="${fc.id}" data-fc-val="true">
                      ✅ TRUE
                    </button>
                    <button type="button" class="ww2-step-pill ${mythCls}"
                            style="flex:1;" data-fc-id="${fc.id}" data-fc-val="false">
                      🚫 MYTH
                    </button>
                  </div>
                  ${
                    answered
                      ? `<div style="font-size:0.76rem;color:${right ? '#bbf7d0' : '#fecaca'};line-height:1.35;">
                           ${right ? '🌟 Spot-on! ' : '❌ Not quite — tap the other stamp! '}${fc.note}
                         </div>`
                      : ''
                  }
                </div>
              `;
            })
            .join('')}
        </div>
      </div>

      <!-- PART 2: LIVE IMPERIAL WAR MUSEUMS (IWM) ONLINE ARCHIVE QUEST -->
      <div class="ww2-archive-quest-box">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
          <span style="font-size:0.78rem;font-weight:900;color:#7dd3fc;text-transform:uppercase;letter-spacing:0.6px;">
            🏛️ PART 2: LIVE IMPERIAL WAR MUSEUMS (IWM) ARCHIVE QUEST
          </span>
          <span style="font-size:0.76rem;font-weight:900;color:${medalUnlocked ? '#fde047' : '#bae6fd'};">
            ${medalUnlocked ? '🏅 JUNIOR HOME FRONT HISTORIAN MEDAL UNLOCKED!' : `Archive Bounties: ${bountySolvedCount}/2`}
          </span>
        </div>

        <p style="margin:0;font-size:0.84rem;color:#e2e8f0;line-height:1.42;">
          Real historians verify stories against museum records! Open the official <strong>Imperial War Museums</strong> guides below (our music pauses automatically while you read in a new tab), then bring back two real facts:
        </p>

        <div class="ww2-ext-link-row">
          <a href="https://www.iwm.org.uk/history/the-evacuated-children-of-the-second-world-war"
             target="_blank" rel="noopener noreferrer" class="ww2-ext-link-btn is-primary">
            <i class="fa-solid fa-train"></i> 1. Open IWM Evacuated Children File <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.7rem;"></i>
          </a>
          <a href="https://www.iwm.org.uk/history/what-you-need-to-know-about-rationing-in-the-second-world-war"
             target="_blank" rel="noopener noreferrer" class="ww2-ext-link-btn">
            <i class="fa-solid fa-book"></i> 2. Open IWM Wartime Rationing File <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.7rem;"></i>
          </a>
          <a href="https://www.iwm.org.uk/collections"
             target="_blank" rel="noopener noreferrer" class="ww2-ext-link-btn">
            <i class="fa-solid fa-magnifying-glass"></i> Search IWM for Your Town <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.7rem;"></i>
          </a>
        </div>

        <div class="ww2-stamp-grid">
          <div style="background:rgba(15,23,42,0.85);border:1.5px solid #334155;border-radius:11px;padding:11px 12px;">
            <div style="font-size:0.8rem;font-weight:800;color:#fef3c7;margin-bottom:6px;">
              🔎 IWM Bounty 1: How many people were evacuated in the first THREE days of Operation Pied Piper (Sept 1939)?
            </div>
            <button type="button" class="ww2-choice-btn ${state.iwmBounty1 === '1.5m' ? 'is-correct' : ''}" data-bounty1="1.5m">
              <span>🚂</span> <span><strong>1.5 million</strong> children, mothers &amp; teachers</span>
            </button>
            <button type="button" class="ww2-choice-btn ${state.iwmBounty1 === '50k' ? 'is-selected-wrong' : ''}" data-bounty1="50k">
              <span>🚌</span> <span>Only <strong>50,000</strong> people in total</span>
            </button>
          </div>

          <div style="background:rgba(15,23,42,0.85);border:1.5px solid #334155;border-radius:11px;padding:11px 12px;">
            <div style="font-size:0.8rem;font-weight:800;color:#fef3c7;margin-bottom:6px;">
              🔎 IWM Bounty 2: In which year did wartime food rationing finally end completely in Britain?
            </div>
            <button type="button" class="ww2-choice-btn ${state.iwmBounty2 === '1954' ? 'is-correct' : ''}" data-bounty2="1954">
              <span>🥩</span> <span><strong>1954</strong> (nine whole years after VE Day!)</span>
            </button>
            <button type="button" class="ww2-choice-btn ${state.iwmBounty2 === '1945' ? 'is-selected-wrong' : ''}" data-bounty2="1945">
              <span>🎉</span> <span><strong>May 1945</strong> (the morning after VE Day)</span>
            </button>
          </div>
        </div>

        ${
          medalUnlocked
            ? `<div class="ww2-cert-card">
                 <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
                   <div style="font-size:0.94rem;font-weight:900;color:#fde047;">
                     🏅 Junior Home Front Historian Medal Awarded! • Final Score: ${state.score} pts
                   </div>
                   <button type="button" class="ww2-icon-btn" id="ww2-print-cert-btn" style="border-color:#fde047;color:#fef08a;">
                     <i class="fa-solid fa-print"></i> <span>Print Certificate</span>
                   </button>
                 </div>
                 <div class="ww2-cert-pillars">
                   ${pillars
                     .map(
                       (p) =>
                         `<span class="ww2-cert-pill ${p.ok ? '' : 'is-pending'}">${p.ok ? '✓' : '○'} ${p.label}</span>`,
                     )
                     .join('')}
                 </div>
                 <div style="font-size:0.78rem;color:#dcfce7;">
                   Saved automatically to your KS2 World War II Revision Arcade Personal Best!
                 </div>
               </div>`
            : ''
        }
      </div>

      <!-- PART 3: COLLAPSIBLE 3-COLUMN HISTORIAN DEBRIEF -->
      <details class="ww2-archive-drawer">
        <summary>
          <span>📂 Open Complete 1939–1945 Home Front Historian Summary</span>
          <i class="fa-solid fa-chevron-down"></i>
        </summary>
        <div class="ww2-debrief-grid">
          <div class="ww2-debrief-col">
            <h4 style="margin:0 0 6px;color:#fde047;font-size:0.84rem;">🚂 Key Wartime Facts</h4>
            <ul style="margin:0;padding-left:17px;font-size:0.78rem;color:#e2e8f0;line-height:1.42;">
              ${data.debriefColumns.homeFrontFacts.map((x) => `<li style="margin-bottom:5px;">${x}</li>`).join('')}
            </ul>
          </div>
          <div class="ww2-debrief-col">
            <h4 style="margin:0 0 6px;color:#86efac;font-size:0.84rem;">🧳 Real Artefacts vs Story</h4>
            <ul style="margin:0;padding-left:17px;font-size:0.78rem;color:#e2e8f0;line-height:1.42;">
              ${data.debriefColumns.storyCharacters.map((x) => `<li style="margin-bottom:5px;">${x}</li>`).join('')}
            </ul>
          </div>
          <div class="ww2-debrief-col">
            <h4 style="margin:0 0 6px;color:#93c5fd;font-size:0.84rem;">⚖️ Deeper Historical Thinking</h4>
            <ul style="margin:0;padding-left:17px;font-size:0.78rem;color:#e2e8f0;line-height:1.42;">
              ${data.debriefColumns.nuanceAndMyths.map((x) => `<li style="margin-bottom:5px;">${x}</li>`).join('')}
            </ul>
          </div>
        </div>
      </details>
    `;
  }

  function renderStageSceneHTML(sig) {
    if (sig === 'cover') {
      return renderCoverSceneHTML();
    }

    if (sig === 'beat5') {
      return `
        <div class="ww2-body">
          <div class="ww2-speech-box" id="ww2-speech-slot">${renderSpeechInnerHTML()}</div>
          <div class="ww2-veday-banner" id="ww2-fx-stage">
            <img src="/images/arcade/ww2_homefront/scene_5_bletchley_veday.webp"
                 alt="Sunlit 8 May 1945 VE Day celebration with red, white, and blue bunting and children waving Union flags" />
            <div class="ww2-veday-banner-overlay">
              <div style="font-size:0.7rem;font-weight:900;color:#fde047;letter-spacing:1px;text-transform:uppercase;">
                🎊 8 MAY 1945 • VICTORY IN EUROPE DAY &amp; ARCHIVE FINALE
              </div>
              <div style="font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.05rem,2.2vw,1.45rem);font-weight:900;color:#ffffff;">
                Six Years After Platform Four: What Happened Next?
              </div>
            </div>
          </div>
          <div id="ww2-beat5-slot">${renderBeat5InnerHTML()}</div>
        </div>
      `;
    }

    let leftWorkspaceHTML = '';
    let subtabBarHTML = '';

    if (sig === 'beat0:pack') {
      subtabBarHTML = `
        <div class="ww2-subtab-bar" id="ww2-b0-subtab-slot">
          ${renderBeat0SubtabInnerHTML()}
        </div>
      `;
      leftWorkspaceHTML = `
        <div>
          <div class="ww2-diorama-frame" id="ww2-fx-stage">
            <img src="/images/arcade/ww2_homefront/scene_1_station_1939.webp"
                 alt="1939 railway platform showing station guard with whistle and green flag, waving children on train, and open evacuee suitcase on trolley"
                 class="ww2-diorama-img" />
            ${hitZoneHTML({
              key: 'b0_guard',
              dataAttr: 'data-b0-extra="guard"',
              x: 15,
              y: 52,
              w: 16,
              h: 52,
              found: state.stationExtrasFound.has('guard'),
              ariaLabel: 'Speak with Mr Higgins the Railway Guard',
            })}
            ${hitZoneHTML({
              key: 'b0_carriage',
              dataAttr: 'data-b0-extra="carriage"',
              x: 46,
              y: 45,
              w: 22,
              h: 22,
              found: state.stationExtrasFound.has('carriage'),
              ariaLabel: 'Check the waving evacuee children in the carriage window',
            })}
            ${hitZoneHTML({
              key: 'pack_gasmask',
              dataAttr: 'data-pack-item="gasmask"',
              x: 55,
              y: 65,
              w: 10,
              h: 13,
              found: state.packedItems.has('gasmask'),
              ariaLabel: 'Pack cardboard gas-mask box',
            })}
            ${hitZoneHTML({
              key: 'pack_clothes_wash',
              dataAttr: 'data-pack-item="clothes_wash"',
              x: 64,
              y: 74,
              w: 11,
              h: 13,
              found: state.packedItems.has('clothes_wash'),
              ariaLabel: 'Pack spare jumper, toothbrush, and tin mug',
            })}
            ${hitZoneHTML({
              key: 'pack_sandwiches',
              dataAttr: 'data-pack-item="sandwiches"',
              x: 66,
              y: 84,
              w: 10,
              h: 13,
              found: state.packedItems.has('sandwiches'),
              ariaLabel: 'Pack packet of sandwiches for the train journey',
            })}
            ${hitZoneHTML({
              key: 'pack_teddy',
              dataAttr: 'data-pack-item="teddy"',
              x: 72,
              y: 74,
              w: 9,
              h: 16,
              found: state.packedItems.has('teddy'),
              ariaLabel: 'Pack small teddy bear',
            })}
            ${hitZoneHTML({
              key: 'pack_gramophone',
              dataAttr: 'data-pack-item="gramophone"',
              x: 88,
              y: 76,
              w: 18,
              h: 32,
              found: state.gramophoneTried,
              ariaLabel: 'Inspect heavy wireless and brass gramophone on trolley',
            })}
          </div>
          <div class="ww2-scene-caption-strip" id="ww2-caption-slot">${renderCaptionInnerHTML()}</div>
        </div>
      `;
    } else if (sig === 'beat0:map') {
      subtabBarHTML = `
        <div class="ww2-subtab-bar" id="ww2-b0-subtab-slot">
          ${renderBeat0SubtabInnerHTML()}
        </div>
      `;
      leftWorkspaceHTML = `
        <div>
          <div class="ww2-map-frame" id="ww2-map-slot">
            ${renderUkHomeFrontMapSVG({
              routes: data.evacuationRoutes,
              selectedRouteId: state.selectedRouteId,
              svgUid: instanceSvgUid,
            })}
          </div>
          <div class="ww2-scene-caption-strip" id="ww2-caption-slot">${renderCaptionInnerHTML()}</div>
        </div>
      `;
    } else if (sig === 'beat1') {
      leftWorkspaceHTML = `
        <div>
          <div class="ww2-diorama-frame" id="ww2-fx-stage">
            <img src="/images/arcade/ww2_homefront/scene_2_country_billet.webp"
                 alt="Country farmhouse gate with Shire horse, welcoming farmer, apple orchard, and Kindertransport girl Lotte holding family photograph and cloth doll"
                 class="ww2-diorama-img" />
            ${hitZoneHTML({
              key: 'b1_horse',
              dataAttr: 'data-billet-spot="horse"',
              x: 16,
              y: 36,
              w: 20,
              h: 42,
              found: state.billetSpotsFound.has('horse'),
              ariaLabel: 'Meet Captain the Shire horse',
            })}
            ${hitZoneHTML({
              key: 'b1_farmer',
              dataAttr: 'data-billet-spot="farmer"',
              x: 34,
              y: 48,
              w: 16,
              h: 54,
              found: state.billetSpotsFound.has('farmer'),
              ariaLabel: 'Speak with Farmer Mr Oakley',
            })}
            ${hitZoneHTML({
              key: 'b1_orchard',
              dataAttr: 'data-billet-spot="orchard"',
              x: 65,
              y: 34,
              w: 18,
              h: 28,
              found: state.billetSpotsFound.has('orchard'),
              ariaLabel: 'Inspect the farmhouse apple orchard',
            })}
            ${hitZoneHTML({
              key: 'b1_lotte',
              dataAttr: 'data-billet-spot="lotte"',
              x: 78,
              y: 62,
              w: 16,
              h: 40,
              found: state.billetSpotsFound.has('lotte'),
              ariaLabel: 'Speak gently with Lotte from Prague',
            })}
            ${hitZoneHTML({
              key: 'b1_case',
              dataAttr: 'data-billet-spot="lotte_case"',
              x: 64,
              y: 81,
              w: 15,
              h: 22,
              found: state.billetSpotsFound.has('lotte_case'),
              ariaLabel: 'Inspect Lotte’s single Kindertransport suitcase',
            })}
          </div>
          <div class="ww2-scene-caption-strip" id="ww2-caption-slot">${renderCaptionInnerHTML()}</div>
        </div>
      `;
    } else if (sig === 'beat2') {
      leftWorkspaceHTML = `
        <div>
          <div class="ww2-diorama-frame" id="ww2-fx-stage">
            <img src="/images/arcade/ww2_homefront/scene_3_anderson_blitz.webp"
                 alt="1940 Blitz night garden cutaway showing taped window, blackout curtains, red stirrup pump, and cosy corrugated-steel Anderson shelter with mother pouring cocoa"
                 class="ww2-diorama-img" />
            ${hitZoneHTML({
              key: 'b2_tape',
              dataAttr: 'data-blitz-check="tape"',
              x: 17,
              y: 30,
              w: 18,
              h: 16,
              found: state.blitzChecks.has('tape'),
              ariaLabel: 'Check crisscross blast tape on window glass',
            })}
            ${hitZoneHTML({
              key: 'b2_blackout',
              dataAttr: 'data-blitz-check="blackout"',
              x: 17,
              y: 50,
              w: 18,
              h: 22,
              found: state.blitzChecks.has('blackout'),
              ariaLabel: 'Pull the leaking blackout curtain shut',
            })}
            ${hitZoneHTML({
              key: 'b2_stirrup',
              dataAttr: 'data-blitz-check="stirrup"',
              x: 18,
              y: 78,
              w: 16,
              h: 26,
              found: state.blitzChecks.has('stirrup'),
              ariaLabel: 'Check the red garden stirrup-pump and water bucket',
            })}
            ${hitZoneHTML({
              key: 'b2_anderson',
              dataAttr: 'data-blitz-check="anderson"',
              x: 76,
              y: 62,
              w: 32,
              h: 48,
              found: state.blitzChecks.has('anderson'),
              ariaLabel: 'Inspect the corrugated-steel Anderson garden shelter and hot cocoa',
            })}
          </div>
          <div class="ww2-scene-caption-strip" id="ww2-caption-slot">${renderCaptionInnerHTML()}</div>
        </div>
      `;
    } else if (sig === 'beat3') {
      leftWorkspaceHTML = `
        <div>
          <div class="ww2-diorama-frame" id="ww2-fx-stage">
            <img src="/images/arcade/ww2_homefront/scene_4_wartime_kitchen.webp"
                 alt="1941 British village grocer Mrs Wilkins behind brass scales with buff ration booklet, single egg, butter and bacon, sugar and tea, vegetable trug, steaming Woolton Pie, and Bakelite wireless"
                 class="ww2-diorama-img" />
            ${hitZoneHTML({
              key: 'b3_book',
              dataAttr: 'data-b3-extra="book"',
              x: 16,
              y: 78,
              w: 18,
              h: 22,
              found: state.rationExtrasFound.has('book'),
              ariaLabel: 'Inspect the buff Ministry of Food Ration Book',
            })}
            ${hitZoneHTML({
              key: 'b3_grocer',
              dataAttr: 'data-b3-extra="grocer"',
              x: 40,
              y: 40,
              w: 18,
              h: 42,
              found: state.rationExtrasFound.has('grocer'),
              ariaLabel: 'Speak with Mrs Wilkins the village grocer',
            })}
            ${hitZoneHTML({
              key: 'b3_wireless',
              dataAttr: 'data-b3-extra="wireless"',
              x: 89,
              y: 40,
              w: 15,
              h: 22,
              found: state.rationExtrasFound.has('wireless'),
              ariaLabel: 'Listen to the 1940s Bakelite wireless radio',
            })}
            ${hitZoneHTML({
              key: 'rat_egg',
              dataAttr: 'data-ration-item="egg"',
              x: 31,
              y: 74,
              w: 8,
              h: 18,
              found: state.rationBasket.has('egg'),
              ariaLabel: 'Weigh 1 single fresh egg for the week',
            })}
            ${hitZoneHTML({
              key: 'rat_butter_bacon',
              dataAttr: 'data-ration-item="butter_bacon"',
              x: 41,
              y: 81,
              w: 15,
              h: 18,
              found: state.rationBasket.has('butter_bacon'),
              ariaLabel: 'Weigh 2oz butter and 4oz bacon',
            })}
            ${hitZoneHTML({
              key: 'rat_sugar_tea',
              dataAttr: 'data-ration-item="sugar_tea"',
              x: 61,
              y: 81,
              w: 17,
              h: 18,
              found: state.rationBasket.has('sugar_tea'),
              ariaLabel: 'Weigh 8oz sugar and 2oz loose tea leaves',
            })}
            ${hitZoneHTML({
              key: 'rat_woolton_veg',
              dataAttr: 'data-ration-item="woolton_veg"',
              x: 84,
              y: 74,
              w: 24,
              h: 32,
              found: state.rationBasket.has('woolton_veg'),
              ariaLabel: 'Collect unrationed Dig for Victory vegetables and steaming Woolton Pie',
            })}
          </div>
          <div class="ww2-scene-caption-strip" id="ww2-caption-slot">${renderCaptionInnerHTML()}</div>
        </div>
      `;
    } else if (sig === 'beat4') {
      leftWorkspaceHTML = `
        <div>
          <div class="ww2-diorama-frame" id="ww2-fx-stage">
            <img src="/images/arcade/ww2_homefront/scene_5_bletchley_veday.webp"
                 alt="Bletchley Park wooden hut with two WRNS Wrens operating a brass Bombe cabinet and 3-bulb cipher machine on the left, opening onto sunlit VE Day 1945 bunting and Union flags on the right"
                 class="ww2-diorama-img" />
            ${hitZoneHTML({
              key: 'b4_bombe',
              dataAttr: 'data-bletchley-spot="bombe"',
              x: 18,
              y: 46,
              w: 22,
              h: 60,
              found: state.bletchleySpotsFound.has('bombe'),
              ariaLabel: 'Inspect the spinning brass Bombe codebreaking drums',
            })}
            ${hitZoneHTML({
              key: 'b4_wren',
              dataAttr: 'data-bletchley-spot="wren"',
              x: 41,
              y: 56,
              w: 16,
              h: 42,
              found: state.bletchleySpotsFound.has('wren'),
              ariaLabel: 'Speak with Leading Wren Miss Bennett',
            })}
            ${hitZoneHTML({
              key: 'b4_cipher',
              dataAttr: 'data-bletchley-spot="cipher"',
              x: 54,
              y: 65,
              w: 16,
              h: 26,
              found: state.bletchleySpotsFound.has('cipher'),
              ariaLabel: 'Inspect the 3-bulb rotor cipher machine',
            })}
            ${hitZoneHTML({
              key: 'b4_veday_door',
              dataAttr: 'data-bletchley-spot="veday_door"',
              x: 81,
              y: 56,
              w: 24,
              h: 56,
              found: state.bletchleySpotsFound.has('veday_door'),
              ariaLabel: 'Peek outside at the sunlit VE Day 1945 celebration',
            })}
          </div>
          <div class="ww2-scene-caption-strip" id="ww2-caption-slot">${renderCaptionInnerHTML()}</div>
        </div>
      `;
    }

    return `
      <div class="ww2-body">
        <div class="ww2-speech-box" id="ww2-speech-slot">${renderSpeechInnerHTML()}</div>
        ${subtabBarHTML}
        <div class="ww2-split">
          ${leftWorkspaceHTML}
          <div id="ww2-right-slot">${renderRightSlotHTML()}</div>
        </div>
      </div>
    `;
  }

  function renderBeat0SubtabInnerHTML() {
    const totalRoutes = data.evacuationRoutes.length;
    return `
      <button type="button" class="ww2-step-pill ${state.beat0Tab === 'pack' ? 'is-active' : state.packedItems.size >= 4 ? 'is-done' : ''}" data-b0-switch="pack">
        <span class="ww2-lbl-full">🧳 Part A: Pack the 1939 Suitcase (${state.packedItems.size}/4)</span>
        <span class="ww2-lbl-short">🧳 A: Suitcase (${state.packedItems.size}/4)</span>
      </button>
      <button type="button" class="ww2-step-pill ${state.beat0Tab === 'map' ? 'is-active' : state.visitedRoutes.size >= 2 ? 'is-done' : ''}" data-b0-switch="map">
        <span class="ww2-lbl-full">🗺️ Part B: All-UK Evacuation Map (${state.visitedRoutes.size}/${totalRoutes})</span>
        <span class="ww2-lbl-short">🗺️ B: UK Map (${state.visitedRoutes.size}/${totalRoutes})</span>
      </button>
    `;
  }

  function renderCaptionInnerHTML() {
    if (state.step === 'beat0' && state.beat0Tab === 'pack') {
      return `
        <span><strong>Platform Four (1 Sept 1939)</strong> • Operation Pied Piper</span>
        <span class="ww2-caption-mid">Official items packed: <strong>${state.packedItems.size}/4</strong></span>
      `;
    }
    if (state.step === 'beat0' && state.beat0Tab === 'map') {
      return `
        <span><strong>National 1939 Evacuation Map</strong> • England, Scotland, Wales &amp; NI</span>
        <span class="ww2-caption-mid">Tap any of the 7 red target cities!</span>
      `;
    }
    if (state.step === 'beat1') {
      return `
        <span><strong>Meadowbrook Farm (Autumn 1939)</strong> • Billeting &amp; Kindertransport</span>
        <span class="ww2-caption-mid">Clues explored: <strong>${state.billetSpotsFound.size}/5</strong></span>
      `;
    }
    if (state.step === 'beat2') {
      return `
        <span><strong>The Blitz (Sept 1940 – May 1941)</strong> • Blackout &amp; Anderson Shelter</span>
        <span class="ww2-caption-mid">Blackout status: <strong style="color:${state.blackoutShut ? '#86efac' : '#fde047'};">${state.blackoutShut ? 'CURTAIN SEALED ✓' : 'LIGHT LEAKING!'}</strong></span>
      `;
    }
    if (state.step === 'beat3') {
      return `
        <span><strong>Village Grocer (1941)</strong> • Fair Shares &amp; Dig for Victory</span>
        <span class="ww2-caption-mid">Basket: <strong>${state.rationBasket.size}/4</strong> portions</span>
      `;
    }
    return `
      <span><strong>Bletchley Park Hut 8 &amp; Courtyard (1943–1945)</strong></span>
      <span class="ww2-caption-mid">Enigma steps cracked: <strong>${state.solvedCipherIds.size}/3</strong></span>
    `;
  }

  function renderRightSlotHTML() {
    if (state.step === 'beat0') return renderBeat0RightHTML();
    if (state.step === 'beat1') return renderBeat1RightHTML();
    if (state.step === 'beat2') return renderBeat2RightHTML();
    if (state.step === 'beat3') return renderBeat3RightHTML();
    if (state.step === 'beat4') return renderBeat4RightHTML();
    return '';
  }

  function syncHitZoneFoundClasses() {
    if (!shellEl) return;
    const foundLookup = {
      cov_engine: state.coverSpotsFound.has('engine'),
      cov_guard: state.coverSpotsFound.has('guard'),
      cov_suitcase: state.coverSpotsFound.has('suitcase'),
      cov_children: state.coverSpotsFound.has('children'),
      cov_warden: state.coverSpotsFound.has('warden'),
      b0_guard: state.stationExtrasFound.has('guard'),
      b0_carriage: state.stationExtrasFound.has('carriage'),
      pack_gasmask: state.packedItems.has('gasmask'),
      pack_clothes_wash: state.packedItems.has('clothes_wash'),
      pack_sandwiches: state.packedItems.has('sandwiches'),
      pack_teddy: state.packedItems.has('teddy'),
      pack_gramophone: state.gramophoneTried,
      b1_horse: state.billetSpotsFound.has('horse'),
      b1_farmer: state.billetSpotsFound.has('farmer'),
      b1_orchard: state.billetSpotsFound.has('orchard'),
      b1_lotte: state.billetSpotsFound.has('lotte'),
      b1_case: state.billetSpotsFound.has('lotte_case'),
      b2_tape: state.blitzChecks.has('tape'),
      b2_blackout: state.blitzChecks.has('blackout'),
      b2_stirrup: state.blitzChecks.has('stirrup'),
      b2_anderson: state.blitzChecks.has('anderson'),
      b3_book: state.rationExtrasFound.has('book'),
      b3_grocer: state.rationExtrasFound.has('grocer'),
      b3_wireless: state.rationExtrasFound.has('wireless'),
      rat_egg: state.rationBasket.has('egg'),
      rat_butter_bacon: state.rationBasket.has('butter_bacon'),
      rat_sugar_tea: state.rationBasket.has('sugar_tea'),
      rat_woolton_veg: state.rationBasket.has('woolton_veg'),
      b4_bombe: state.bletchleySpotsFound.has('bombe'),
      b4_wren: state.bletchleySpotsFound.has('wren'),
      b4_cipher: state.bletchleySpotsFound.has('cipher'),
      b4_veday_door: state.bletchleySpotsFound.has('veday_door'),
    };

    shellEl.querySelectorAll('[data-hz-key]').forEach((btn) => {
      const k = btn.getAttribute('data-hz-key');
      btn.classList.toggle('is-found', Boolean(foundLookup[k]));
    });
  }

  function mountSceneFxIfNeeded(sig) {
    const fxStage = shellEl?.querySelector('#ww2-fx-stage');
    if (!fxStage) return;
    let preset = 'cover';
    if (sig === 'beat0:pack') preset = 'station';
    else if (sig === 'beat1') preset = 'countryside';
    else if (sig === 'beat2') preset = 'blitz_shelter';
    else if (sig === 'beat3') preset = 'kitchen_ration';
    else if (sig === 'beat4') preset = 'bletchley_veday';
    else if (sig === 'beat5') preset = 'veday_banner';

    activeFx = mountWw2HomeFrontFX(fxStage, preset, () => ({
      blackoutShut: state.blackoutShut,
    }));
  }

  function updateLab(scrollToTop = false) {
    if (unmounted || !shellEl) return;

    shellEl.classList.toggle('ww2-is-fullscreen', state.isFullscreen);

    if (!data) {
      shellEl.querySelector('#ww2-stage-slot').innerHTML = `
        <div style="padding:48px 20px;text-align:center;color:#fde68a;font-weight:800;">
          🚂 Loading 1939–1945 Home Front Storybook...
        </div>
      `;
      return;
    }

    const doMutate = () => {
      const topSlot = shellEl.querySelector('#ww2-topbar-slot');
      if (topSlot) topSlot.innerHTML = renderTopBarInnerHTML();

      const nextSig = getSceneSignature();
      const stageSlot = shellEl.querySelector('#ww2-stage-slot');

      if (nextSig !== mountedSceneSignature) {
        destroyFx();
        mountedSceneSignature = nextSig;
        if (stageSlot) stageSlot.innerHTML = renderStageSceneHTML(nextSig);
        mountSceneFxIfNeeded(nextSig);
      } else {
        const speechSlot = shellEl.querySelector('#ww2-speech-slot');
        if (speechSlot) speechSlot.innerHTML = renderSpeechInnerHTML();

        const coverQuoteSlot = shellEl.querySelector('#ww2-cover-quote-slot');
        if (coverQuoteSlot) coverQuoteSlot.innerHTML = renderCoverQuoteInnerHTML();

        const b0SubtabSlot = shellEl.querySelector('#ww2-b0-subtab-slot');
        if (b0SubtabSlot) b0SubtabSlot.innerHTML = renderBeat0SubtabInnerHTML();

        const mapSlot = shellEl.querySelector('#ww2-map-slot');
        if (mapSlot) {
          mapSlot.innerHTML = renderUkHomeFrontMapSVG({
            routes: data.evacuationRoutes,
            selectedRouteId: state.selectedRouteId,
            svgUid: instanceSvgUid,
          });
        }

        const rightSlot = shellEl.querySelector('#ww2-right-slot');
        if (rightSlot) rightSlot.innerHTML = renderRightSlotHTML();

        const captionSlot = shellEl.querySelector('#ww2-caption-slot');
        if (captionSlot) captionSlot.innerHTML = renderCaptionInnerHTML();

        const beat5Slot = shellEl.querySelector('#ww2-beat5-slot');
        if (beat5Slot) beat5Slot.innerHTML = renderBeat5InnerHTML();

        syncHitZoneFoundClasses();
      }
    };

    if (scrollToTop) {
      doMutate();
      scrollLock.scrollToTopOnStepChange(state.isFullscreen);
    } else {
      scrollLock.preserve(doMutate);
    }
  }

  // Mount persistent `.ww2-shell` ONCE
  stageEl.innerHTML = `
    <div class="ww2-shell ${state.isFullscreen ? 'ww2-is-fullscreen' : ''}">
      <div class="ww2-topbar" id="ww2-topbar-slot"></div>
      <div id="ww2-stage-slot"></div>
    </div>
  `;
  shellEl = stageEl.querySelector('.ww2-shell');
  scrollLock.bindShellPointerGuards(shellEl);

  shellEl.addEventListener('change', (e) => {
    const sel = e.target.closest('#ww2-mobile-step-select');
    if (sel && sel.value) {
      setStep(sel.value);
    }
  });

  shellEl.addEventListener('click', (e) => {
    if (!data) return;

    // Replay current voice clip
    if (e.target.closest('[data-replay-vo]')) {
      if (state.lastVoClipId) audio.playVoice(state.lastVoClipId);
      return;
    }

    // Print Certificate
    if (e.target.closest('#ww2-print-cert-btn')) {
      openPrintableCertificate();
      return;
    }

    // 1. Step navigation
    const stepBtn = e.target.closest('[data-step-jump]');
    if (stepBtn) {
      const target = stepBtn.getAttribute('data-step-jump');
      if (target) {
        audio.suitcaseClick();
        setStep(target);
      }
      return;
    }

    if (e.target.closest('#ww2-start-btn')) {
      audio.trainWhistle();
      setStep('beat0');
      return;
    }

    if (e.target.closest('#ww2-hint-btn, #ww2-cover-hint-btn')) {
      audio.suitcaseClick();
      triggerHintPulse();
      return;
    }

    if (e.target.closest('#ww2-mute-btn')) {
      audio.toggleMute();
      updateLab(false);
      return;
    }

    // 2-Tap Reset Safeguard
    if (e.target.closest('#ww2-reset-btn')) {
      if (!state.resetArmed) {
        state.resetArmed = true;
        audio.softWarn();
        if (resetArmTimeout) clearTimeout(resetArmTimeout);
        resetArmTimeout = setTimeout(() => {
          if (unmounted) return;
          state.resetArmed = false;
          updateLab(false);
        }, 3500);
        updateLab(false);
      } else {
        if (resetArmTimeout) clearTimeout(resetArmTimeout);
        resetAdventure();
      }
      return;
    }

    if (e.target.closest('#ww2-fs-btn')) {
      state.isFullscreen = !state.isFullscreen;
      if (state.isFullscreen) fsController.requestFs();
      else fsController.exitFs();
      updateLab(false);
      return;
    }

    if (e.target.closest('#ww2-close-modal-btn')) {
      ctx.onCloseModal?.();
      return;
    }

    // 2. Cover hotspots (5/5 uniquely voiced!)
    const covSpot = e.target.closest('[data-cover-spot]');
    if (covSpot) {
      const spot = covSpot.getAttribute('data-cover-spot');
      if (!state.coverSpotsFound.has(spot)) {
        state.coverSpotsFound.add(spot);
        addPoints(5);
      }
      if (spot === 'engine') {
        audio.trainWhistle();
        activeFx?.burst(15, 42, 'gold');
        say(
          'guard',
          'Historian Note • Operation Pied Piper',
          'In just three days of September 1939, special steam trains carried 1.5 million children, mothers, and teachers out of target cities!',
          'cover_engine_steam',
        );
      } else if (spot === 'guard') {
        audio.trainWhistle();
        activeFx?.burst(35, 55, 'gold');
        say(
          'guard',
          'Mr Higgins • Station Guard',
          'All aboard the Operation Pied Piper special! Hold your little brother’s hand tight, keep your suitcase close, and wave bravely!',
          'cover_guard_whistle',
        );
      } else if (spot === 'suitcase') {
        audio.suitcaseClick();
        activeFx?.burst(52, 82, 'gold');
        say(
          'clara',
          'Clara • Our Packed Leather Suitcase',
          'Inside our battered brown suitcase we’ve tucked clean woollen socks, a bar of soap, and a stamped postcard ready to send Mum our safe village address!',
          'cover_arthur_suitcase',
        );
      } else if (spot === 'children') {
        audio.suitcaseClick();
        activeFx?.burst(63, 65, 'gold');
        say(
          'clara',
          'Clara & Arthur • 1939 Evacuees',
          '1 September 1939! Mum pinned brown labels to our coats, handed us our gas-mask boxes, and walked us to Platform Four.',
          'cover_clara_welcome',
        );
      } else if (spot === 'warden') {
        audio.suitcaseClick();
        activeFx?.burst(84, 52, 'gold');
        say(
          'warden',
          'ARP Warden Miller • Home Front Watch',
          'Those silver searchlights will watch over the city skies tonight while your steam train carries you safely to the countryside.',
          'cover_warden_lantern',
        );
      }
      saveSession();
      updateLab(false);
      return;
    }

    // 3. Stage 1 (Beat 0): Suitcase Packing & 7-Region UK Map
    const b0Switch = e.target.closest('[data-b0-switch]');
    if (b0Switch) {
      const nextTab = b0Switch.getAttribute('data-b0-switch');
      state.beat0Tab = nextTab;
      if (nextTab === 'map') {
        audio.trainWhistle();
        say(
          'guard',
          '1939 All-UK Evacuation Atlas',
          'Evacuation happened right across the UK! Tap London, the Midlands, Liverpool, Glasgow, Tyneside, Belfast, or the South Coast.',
          'beat0_uk_map_intro',
        );
      }
      saveSession();
      updateLab(false);
      return;
    }

    const b0Extra = e.target.closest('[data-b0-extra]');
    if (b0Extra) {
      const k = b0Extra.getAttribute('data-b0-extra');
      if (!state.stationExtrasFound.has(k)) {
        state.stationExtrasFound.add(k);
        addPoints(5);
      }
      if (k === 'guard') {
        audio.trainWhistle();
        activeFx?.burst(15, 48, 'gold');
        say(
          'guard',
          'Mr Higgins • Station Guard',
          'Pack the four items from the official Ministry list before I blow my brass whistle—and leave heavy furniture behind!',
          'beat0_guard_suitcase',
        );
      } else {
        audio.suitcaseClick();
        activeFx?.burst(46, 45, 'gold');
        say(
          'clara',
          'Clara • Carriage Window',
          'Whole school classes travelled together with their teachers, waving bravely without knowing which village family would choose them!',
          'beat0_carriage_wave',
        );
      }
      saveSession();
      updateLab(false);
      return;
    }

    const packBtn = e.target.closest('[data-pack-item]');
    if (packBtn) {
      const itemId = packBtn.getAttribute('data-pack-item');
      const item = data.suitcaseItems.find((x) => x.id === itemId);
      if (!item) return;

      if (!item.isOfficial) {
        state.gramophoneTried = true;
        audio.softWarn();
        activeFx?.burst(88, 76, 'gold');
        say(
          'guard',
          'Mr Higgins • Too Heavy!',
          'Whoa there! You can’t lug a heavy brass gramophone to the village Billeting Hall—every ten-year-old must carry their own suitcase!',
          'beat0_gramophone_heavy',
        );
      } else {
        const wasNew = !state.packedItems.has(item.id);
        state.packedItems.add(item.id);
        if (wasNew) addPoints(10);
        audio.suitcaseClick();
        activeFx?.burst(64, 76, 'green');

        const itemVoMap = {
          gasmask: 'beat0_gasmask_packed',
          clothes_wash: 'beat0_clothes_packed',
          sandwiches: 'beat0_sandwiches_packed',
          teddy: 'beat0_teddy_packed',
        };

        if (state.packedItems.size >= 4 && wasNew) {
          audio.chimeSuccess();
          say(
            'clara',
            'Clara • Suitcase Packed (4/4)!',
            'All four official Ministry items packed! Now tap Part B: All-UK Evacuation Map to trace steam trains right across Britain!',
            'beat0_suitcase_ready',
          );
        } else {
          say('clara', `Packed: ${item.label}`, item.note, itemVoMap[item.id] || null);
        }
      }
      saveSession();
      updateLab(false);
      return;
    }

    const routeNode = e.target.closest('[data-route-id], [data-route-btn]');
    if (routeNode) {
      const rId = routeNode.getAttribute('data-route-id') || routeNode.getAttribute('data-route-btn');
      const route = data.evacuationRoutes.find((r) => r.id === rId);
      if (route) {
        if (!state.visitedRoutes.has(rId)) {
          state.visitedRoutes.add(rId);
          addPoints(8);
        }
        state.selectedRouteId = rId;
        audio.trainWhistle();
        say(
          'guard',
          `${route.city} ➔ ${route.destName}`,
          `${route.evacuees.toUpperCase()}: ${route.receptionNote}`,
        );
        saveSession();
        updateLab(false);
      }
      return;
    }

    // 4. Stage 2 (Beat 1): Country Billet & Kindertransport (5/5 uniquely voiced!)
    const billetSpot = e.target.closest('[data-billet-spot]');
    if (billetSpot) {
      const s = billetSpot.getAttribute('data-billet-spot');
      if (!state.billetSpotsFound.has(s)) {
        state.billetSpotsFound.add(s);
        addPoints(6);
      }
      audio.suitcaseClick();
      if (s === 'horse') {
        activeFx?.burst(16, 36, 'gold');
        say(
          'farmer',
          'Mr Oakley • Captain the Shire Horse',
          'Steady there, old Captain! Many city youngsters stepping off the train had never seen a real Shire horse, cow, or laying hen in their lives!',
          'beat1_horse_captain',
        );
      } else if (s === 'farmer') {
        activeFx?.burst(34, 46, 'gold');
        say(
          'farmer',
          'Mr Oakley • Meadowbrook Farm',
          'Welcome to Meadowbrook Farm! Mind old Captain the Shire horse—he loves a crisp orchard apple, and Mrs Oakley has warm bread waiting indoors.',
          'beat1_farmer_welcome',
        );
      } else if (s === 'lotte') {
        activeFx?.burst(78, 60, 'gold');
        say(
          'lotte',
          'Lotte (Age 10) • Kindertransport Refugee from Prague',
          'Lotte escaped Nazi-occupied Prague on a Kindertransport train. Nearly 10,000 unaccompanied children found safety in British foster homes.',
          'beat1_lotte_story',
        );
      } else if (s === 'lotte_case') {
        activeFx?.burst(64, 80, 'gold');
        say(
          'clara',
          'Clara • Two Very Different Suitcases',
          'I can post a letter home to Mum and Dad tonight—whereas Lotte holds one precious photograph of her parents behind closed borders.',
          'beat1_lotte_photo',
        );
      } else {
        activeFx?.burst(65, 34, 'green');
        say(
          'farmer',
          'Mr Oakley • Orchard Harvest',
          'With young farmhands away in uniform, evacuees pitched right in—picking orchard apples, collecting warm eggs, and bringing in the harvest!',
          'beat1_orchard_harvest',
        );
      }
      saveSession();
      updateLab(false);
      return;
    }

    const kQ1 = e.target.closest('[data-kinder-q1]');
    if (kQ1) {
      const v = kQ1.getAttribute('data-kinder-q1');
      if (v === 'refugee') {
        if (state.kinderQ1 !== 'refugee') addPoints(15);
        state.kinderQ1 = 'refugee';
        audio.chimeSuccess();
        say(
          'lotte',
          'Historian Check • The Kindertransport (1938–1939)',
          'Spot-on. Operation Pied Piper moved children inside Britain away from bombs, whereas the Kindertransport rescued Jewish children from Nazi persecution.',
          'beat1_lotte_story',
        );
      } else {
        state.kinderQ1 = 'holiday';
        audio.softWarn();
        say(
          'lotte',
          'Think Carefully...',
          'Remember: Kindertransport children were refugees escaping persecution in Germany, Austria, and Czechoslovakia—not on a short holiday.',
        );
      }
      saveSession();
      updateLab(false);
      return;
    }

    const kQ2 = e.target.closest('[data-kinder-q2]');
    if (kQ2) {
      const v = kQ2.getAttribute('data-kinder-q2');
      if (v === 'phoney') {
        if (state.kinderQ2 !== 'phoney') addPoints(15);
        state.kinderQ2 = 'phoney';
        audio.chimeSuccess();
        say(
          'farmer',
          'Mr Oakley • The Phoney War (Autumn 1939 – Spring 1940)',
          'Exactly right! Few bombs fell on British cities during the first winter, so thousands drifted home—until the Blitz began in September 1940!',
        );
      } else {
        state.kinderQ2 = 'stayed6';
        audio.softWarn();
        say('farmer', 'Not Quite!', 'World War II lasted six long years (1939–1945)—try the Phoney War answer!');
      }
      saveSession();
      updateLab(false);
      return;
    }

    // 5. Stage 3 (Beat 2): Blitz Night & Anderson Shelter Cutaway (4/4 voiced!)
    const blitzBtn = e.target.closest('[data-blitz-check]');
    if (blitzBtn) {
      const checkId = blitzBtn.getAttribute('data-blitz-check');
      const isNew = !state.blitzChecks.has(checkId);
      state.blitzChecks.add(checkId);
      if (isNew) addPoints(10);

      if (checkId === 'blackout') {
        state.blackoutShut = true;
        audio.chimeSuccess();
        activeFx?.burst(17, 50, 'green');
        say(
          'warden',
          'ARP Warden Miller • Blackout Sealed!',
          'Much better—look at the house window now, completely dark! Heavy curtains, car headlamp hoods, and dimmed streetlamps hid cities from bombers.',
          'beat2_blackout_shut',
        );
      } else if (checkId === 'tape') {
        audio.suitcaseClick();
        activeFx?.burst(17, 30, 'gold');
        say(
          'warden',
          'ARP Warden Miller • Blast-Taped Windows',
          'Crisscross sticky paper tape won’t stop a direct hit, youngsters, yet it helps stop glass panes shattering into dangerous flying splinters!',
          'beat2_window_tape',
        );
      } else if (checkId === 'stirrup') {
        audio.suitcaseClick();
        activeFx?.burst(18, 78, 'gold');
        say(
          'warden',
          'ARP Warden Miller • Stirrup-Pump & Bucket',
          'Every street kept a hand-pumped water bucket and sandbags ready so fire-watchers could douse small incendiary sparks fast!',
          'beat2_stirrup_pump',
        );
      } else if (checkId === 'anderson') {
        audio.chimeSuccess();
        activeFx?.burst(76, 58, 'green');
        say(
          'mum',
          'Mum • Inside the Anderson Shelter',
          'Six curved corrugated-steel sheets bolted together under 15 inches of garden soil—damp in winter, yet strong enough to save thousands of lives!',
          'beat2_anderson_cocoa',
        );
      }
      saveSession();
      updateLab(false);
      return;
    }

    const morBtn = e.target.closest('[data-morrison-opt]');
    if (morBtn) {
      const v = morBtn.getAttribute('data-morrison-opt');
      if (v === 'morrison') {
        if (state.morrisonAnswer !== 'morrison') addPoints(15);
        state.morrisonAnswer = 'morrison';
        audio.chimeSuccess();
        say(
          'mum',
          'Indoor Morrison Table Shelter (1941)',
          'Spot-on! Families without gardens used a heavy steel-topped Morrison cage in the living room—it doubled as a dinner table by day!',
        );
      } else {
        state.morrisonAnswer = 'tent';
        audio.softWarn();
        say('warden', 'ARP Warden Miller', 'Definitely not on the roof! City flat-dwellers used indoor steel Morrison table-cages or Underground stations.');
      }
      saveSession();
      updateLab(false);
      return;
    }

    // 6. Stage 4 (Beat 3): 1941 Village Grocer & Ration Counter (7/7 voiced!)
    const b3Extra = e.target.closest('[data-b3-extra]');
    if (b3Extra) {
      const k = b3Extra.getAttribute('data-b3-extra');
      if (!state.rationExtrasFound.has(k)) {
        state.rationExtrasFound.add(k);
        addPoints(5);
      }
      audio.suitcaseClick();
      if (k === 'book' || k === 'grocer') {
        activeFx?.burst(32, 58, 'gold');
        say(
          'grocer',
          'Mrs Wilkins • Buff Ration Book',
          'Every man, woman, and child registered with a local shopkeeper! Coupons made sure wealthy shoppers couldn’t buy up all the scarce food.',
          'beat3_grocer_welcome',
        );
      } else {
        activeFx?.burst(89, 40, 'gold');
        say(
          'grocer',
          '1940s Kitchen Wireless • “The Kitchen Front”',
          'Every morning at 8:15 AM, families gathered round the wireless for The Kitchen Front to hear clever recipes like carrot fudge and eggless sponge!',
          'beat3_kitchen_wireless',
        );
      }
      saveSession();
      updateLab(false);
      return;
    }

    const ratBtn = e.target.closest('[data-ration-item]');
    if (ratBtn) {
      const id = ratBtn.getAttribute('data-ration-item');
      const item = data.rationItems.find((x) => x.id === id);
      if (!item) return;
      if (!state.rationBasket.has(id)) {
        state.rationBasket.add(id);
        addPoints(10);
      }
      audio.suitcaseClick();
      activeFx?.burst(id === 'woolton_veg' ? 84 : 45, 76, 'green');
      if (id === 'woolton_veg') {
        say('clara', `Unrationed: ${item.name}`, item.fact, 'beat3_woolton_pie');
      } else if (id === 'egg' || id === 'butter_bacon') {
        say('grocer', `Weighed: ${item.name}`, item.fact, 'beat3_egg_butter');
      } else {
        say('grocer', `Weighed: ${item.name}`, item.fact, 'beat3_sugar_tea');
      }
      saveSession();
      updateLab(false);
      return;
    }

    const ratQuiz = e.target.closest('[data-ration-quiz]');
    if (ratQuiz) {
      const v = ratQuiz.getAttribute('data-ration-quiz');
      if (v === 'veg') {
        if (state.unrationedQuiz !== 'veg') addPoints(15);
        state.unrationedQuiz = 'veg';
        audio.chimeSuccess();
        say(
          'clara',
          'Dig for Victory! (1941)',
          'Spot-on! School playing fields, railway embankments, and even the dry moat at the Tower of London were dug up to grow unrationed vegetables!',
          'beat3_woolton_pie',
        );
      } else {
        state.unrationedQuiz = 'bacon';
        audio.softWarn();
        say('grocer', 'Mrs Wilkins Chuckles!', 'Submarine carrots?! Never! Fresh British garden vegetables needed zero coupons because families grew them at home!');
      }
      saveSession();
      updateLab(false);
      return;
    }

    // 7. Stage 5 (Beat 4): Women at War & Bletchley Park 3-Rotor + Cipher Desk
    const rotorBtn = e.target.closest('[data-rotor-idx]');
    if (rotorBtn) {
      const rIdx = Number(rotorBtn.getAttribute('data-rotor-idx'));
      const dir = Number(rotorBtn.getAttribute('data-rotor-dir')) || 1;
      const wheel = ROTOR_WHEELS[rIdx];
      if (wheel) {
        const curPos = Math.max(0, wheel.indexOf(state.rotors[rIdx]));
        state.rotors[rIdx] = wheel[(curPos + dir + wheel.length) % wheel.length];
        audio.morseBeep();
        if (areRotorsLocked() && !state.rotorsRewarded) {
          state.rotorsRewarded = true;
          addPoints(15);
          audio.chimeSuccess();
          activeFx?.burst(54, 67, 'green');
          say(
            'wren',
            'Leading Wren Miss Bennett • Rotors Locked (B - R - K)!',
            'Clicks into place! All three brass rotors match today’s weather crib—now choose what secret messages Britain can read!',
          );
        }
        saveSession();
        updateLab(false);
      }
      return;
    }

    const blSpot = e.target.closest('[data-bletchley-spot]');
    if (blSpot) {
      const s = blSpot.getAttribute('data-bletchley-spot');
      if (!state.bletchleySpotsFound.has(s)) {
        state.bletchleySpotsFound.add(s);
        addPoints(6);
      }
      audio.morseBeep();
      if (s === 'bombe') {
        activeFx?.burst(18, 46, 'gold');
        say(
          'wren',
          'Electromechanical Bombe Machine',
          'Designed by Alan Turing and Gordon Welchman, these spinning brass drums hunted through thousands of Enigma settings every hour!',
          'beat4_bombe_drums',
        );
      } else if (s === 'wren' || s === 'cipher') {
        activeFx?.burst(48, 60, 'gold');
        say(
          'wren',
          'Leading Wren Miss Bennett • Hut 8',
          'German Enigma machines scrambled every letter billions of ways—yet human habits like daily 6:00 AM weather forecasts gave us our breakthrough!',
          'beat4_wren_welcome',
        );
      } else {
        activeFx?.burst(81, 52, 'veday');
        say(
          'clara',
          'Through the Hut Doors • 8 May 1945',
          'Red, white, and blue bunting is going up in the sunshine! Crack our 3-step convoy alert so we can celebrate Victory in Europe Day!',
          'beat4_veday_peek',
        );
      }
      saveSession();
      updateLab(false);
      return;
    }

    const cipBtn = e.target.closest('[data-cipher-opt]');
    if (cipBtn) {
      const optId = cipBtn.getAttribute('data-cipher-opt');
      const clue = data.bletchleyClues[state.cipherStepIdx];
      if (!clue) return;
      const chosen = clue.options.find((o) => o.id === optId);
      if (!chosen) return;

      if (clue.id === 'bc2' && chosen.correct && !areRotorsLocked()) {
        // Auto-snap rotors if pupil clicks answer directly, or prompt gently? Let's require spinning the rotors first so they engage with the tactile dial!
        audio.softWarn();
        say(
          'wren',
          'Spin the 3 Brass Rotor Dials First!',
          'Almost there! Use the ▲ / ▼ buttons on the Brass Rotor Dials above to lock B - R - K until the light turns green, then select the U-boat answer!',
        );
        updateLab(false);
        return;
      }

      if (chosen.correct) {
        state.wrongCipherOpt = '';
        const wasNew = !state.solvedCipherIds.has(clue.id);
        state.solvedCipherIds.add(clue.id);
        if (wasNew) addPoints(15);
        audio.morseBeep();
        audio.chimeSuccess();
        activeFx?.burst(54, 65, 'green');
        if (state.cipherStepIdx < data.bletchleyClues.length - 1) {
          state.cipherStepIdx += 1;
          say('wren', 'Leading Wren Miss Bennett', clue.explain);
        } else {
          say('wren', 'Enigma Convoy Alert Decoded!', clue.explain, 'beat4_code_cracked');
        }
      } else {
        state.wrongCipherOpt = `${clue.id}:${optId}`;
        audio.softWarn();
        say('wren', 'Try the Other Rotor Match!', 'Think what routine report naval ships needed at 6:00 AM every morning—and why Atlantic convoys mattered!');
      }
      saveSession();
      updateLab(false);
      return;
    }

    // 8. Stage 6 (Beat 5): VE Day Truth Check & Live IWM Archive Quest
    const fcBtn = e.target.closest('[data-fc-id]');
    if (fcBtn) {
      const fcId = fcBtn.getAttribute('data-fc-id');
      const val = fcBtn.getAttribute('data-fc-val') === 'true';
      const item = data.factChecks.find((x) => x.id === fcId);
      if (item) {
        state.factAnswers[fcId] = val;
        if (val === item.isTrue) {
          if (!state.fcCredited.has(fcId)) {
            state.fcCredited.add(fcId);
            addPoints(state.fcHadWrong.has(fcId) ? 6 : 12);
          }
          audio.chimeSuccess();
        } else {
          state.fcHadWrong.add(fcId);
          audio.softWarn();
        }
        say('clara', 'VE Day Historian Check', item.note);
        saveSession();
        updateLab(false);
      }
      return;
    }

    const b1Btn = e.target.closest('[data-bounty1]');
    if (b1Btn) {
      const v = b1Btn.getAttribute('data-bounty1');
      if (v === '1.5m') {
        if (state.iwmBounty1 !== '1.5m') addPoints(25);
        state.iwmBounty1 = '1.5m';
        audio.chimeSuccess();
        say(
          'guard',
          'IWM Archive Verified!',
          'Confirmed in the Imperial War Museums record: 1.5 million people were evacuated in the first three days of Operation Pied Piper!',
          state.iwmBounty2 === '1954' ? 'beat5_iwm_quest' : null,
        );
      } else {
        state.iwmBounty1 = '50k';
        audio.softWarn();
        say('guard', 'Check the IWM Evacuated Children File!', 'Look at the opening paragraph on the IWM page—it was far larger than 50,000!');
      }
      saveSession();
      updateLab(false);
      return;
    }

    const b2Btn = e.target.closest('[data-bounty2]');
    if (b2Btn) {
      const v = b2Btn.getAttribute('data-bounty2');
      if (v === '1954') {
        if (state.iwmBounty2 !== '1954') addPoints(25);
        state.iwmBounty2 = '1954';
        audio.chimeSuccess();
        say(
          'grocer',
          'IWM Archive Verified!',
          'Confirmed! Wartime rationing began in January 1940 and finally ended in July 1954—nine whole years after VE Day!',
          'beat5_iwm_quest',
        );
      } else {
        state.iwmBounty2 = '1945';
        audio.softWarn();
        say('grocer', 'Check the IWM Rationing File!', 'Have a peek at the IWM Rationing guide—rationing lasted several years into the 1950s!');
      }
      saveSession();
      updateLab(false);
    }
  });

  // Load dataset & boot
  updateLab(false);
  loadWw2HomeFrontData()
    .then((json) => {
      if (unmounted) return;
      data = json;
      preloadNextStage(state.step);
      updateLab(false);
    })
    .catch((err) => {
      if (unmounted || !shellEl) return;
      shellEl.querySelector('#ww2-stage-slot').innerHTML = `
        <div style="padding:32px;text-align:center;color:#fca5a5;">
          Could not load Home Front data (${err.message}).
        </div>
      `;
    });

  return () => {
    unmounted = true;
    if (shimmerTimeout) clearTimeout(shimmerTimeout);
    if (resetArmTimeout) clearTimeout(resetArmTimeout);
    scrollLock.dispose();
    fsController.dispose();
    destroyFx();
    audio.destroy();
  };
}
