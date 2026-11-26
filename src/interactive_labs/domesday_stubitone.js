/**
 * THE SECRET OF STUBITONE™: The 1086 Solent & Fareham Domesday Adventure (v2.2 Zero-Jump Mobile Edition)
 *
 * Architecture Highlights:
 *  - ZERO text labels over pictures — discreet 12px shiny hover glint dots on desktop, subtle firefly glints on touch.
 *  - ZERO-JUMP MOBILE ARCHITECTURE (CLS = 0, deltaScroll = 0px):
 *      1. Persistent `.dst-shell` root container (never torn down on tap, so full-screen `shell.scrollTop` never resets!).
 *      2. Live in-place Diorama & 60 FPS Canvas persistence (`#dst-fx-stage` stays mounted across all hotspot/choice taps!).
 *      3. Zero-teardown `<input type="range">` handlers on Stage 3 X-Ray Curtain & Stage 6 Folio 46v Latin Slider.
 *      4. Multi-container `preserveScrollPosition()` lock + fixed `104px` mobile `.dst-speech-box` height so changing quotes
 *         between 1 line and 5 lines shifts underlying buttons/artwork by 0.00px.
 */

import './domesday_stubitone.css';
import { DomesdayAudioDirector } from './domesday_music.js';
import { mountLivingDioramaFX } from './domesday_living_fx.js';
import { renderSolentGisSvgHTML } from './solent_svg_map.js';
import { saveArcadePersonalBest } from '../arcade/arcade_audio.js';

const SESSION_SAVE_KEY = 'hh_domesday_session_v1';

const STAGE_PRELOAD_MAP = {
  cover: ['/images/arcade/domesday/scene_1_bennet_swamp.webp', '/audio/labs/domesday/cover_welcome.mp3'],
  beat0: ['/images/arcade/domesday/scene_2_fareham_mills.webp', '/audio/labs/domesday/beat1_odo_oath.mp3'],
  beat1: ['/images/arcade/domesday/scene_5_fareham_servi.webp', '/images/arcade/domesday/scene_3_royal_assize.webp'],
  beat2: ['/images/arcade/domesday/scene_3_royal_assize.webp', '/audio/labs/domesday/beat3_villager_plea.mp3'],
  beat3: ['/images/arcade/domesday/scene_4_stubbington_hut.webp', '/audio/labs/domesday/beat4_monk_myth.mp3'],
  beat4: ['/audio/labs/domesday/beat5_stubitone_latin.mp3', '/audio/labs/domesday/beat5_debrief_historian.mp3'],
};

const preloadedUrls = new Set();
function preloadUpcomingStageAssets(stepId) {
  const list = STAGE_PRELOAD_MAP[stepId];
  if (!list || typeof window === 'undefined') return;
  const run = () => {
    list.forEach((url) => {
      if (preloadedUrls.has(url)) return;
      preloadedUrls.add(url);
      if (url.endsWith('.webp')) {
        const img = new Image();
        img.decoding = 'async';
        img.src = url;
      } else if (url.endsWith('.mp3')) {
        fetch(url, { cache: 'force-cache' }).catch(() => {});
      }
    });
  };
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(run, { timeout: 1200 });
  } else {
    setTimeout(run, 420);
  }
}

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
    note: 'FICTIONAL PEASANT! "Luvet" is a real 1086 Domesday surname ("Little Wolf"), while Boggy Bennet himself stands in for poor landless cottagers whom scribes ignored!',
  },
  {
    id: 'st3',
    claim: 'King Edward gave Fareham a 20-hide tax discount because of coastal Viking raids, and 1086 scribes wrote Fareham "cannot bear" £20.',
    isReal: true,
    note: '100% REAL! Both famous quotes are written directly in Fareham’s 1086 Domesday Book entry!',
  },
];

const LATIN_CLUE_MISSIONS = [
  {
    id: 'lc1',
    targetIdx: 1,
    badge: 'Clue 1 of 3 • Wiped-Out Saxon Owner',
    prompt:
      'Find and TAP the line on Stubbington’s parchment that proves an Englishman named Godwin held the village under King Edward ("rege E.") before 1066!',
    hintWrong: 'Look at Line 2 for "Godwinus" and "rege E." (or slide the Decoder Lens above the parchment to peek at English)!',
    solvedNote: 'Cracked! "Godwinus tenuit de rege E." = Saxon Godwin HELD it freely from King Edward—before Norman Sheriff Hugh wiped him out!',
  },
  {
    id: 'lc2',
    targetIdx: 3,
    badge: 'Clue 2 of 3 • Crack the Roman Numerals',
    prompt:
      'Now TAP the line where medieval Roman numerals ("v" + "iiij") record Stubbington’s 9 peasant households (5 villagers + 4 smallholders) and 3 ploughs ("iii car’")!',
    hintWrong: 'Hunt for the Roman numerals "iii car’", "v vill’i", and "iiij bord’" on Line 4!',
    solvedNote: 'Cracked! Medieval clerks wrote 4 as "iiij"—so "v vill’i" (5 villagers) + "iiij bord’" (4 smallholders) = Stubbington’s 9 households!',
  },
  {
    id: 'lc3',
    targetIdx: 5,
    badge: 'Clue 3 of 3 • Sheriff Hugh’s Profit Squeeze',
    prompt:
      'Finally, TAP the line proving Stubbington’s value rose from £2 & 10 shillings ("ii lib’ & x sol’") in 1066 ("T.R.E.") to £3 ("iii lib’") under Sheriff Hugh!',
    hintWrong: 'Look at the bottom line for "Valuit iii lib’" (£3) and "T.R.E. ii lib’ & x sol’" (£2 10s)!',
    solvedNote: 'All 3 Folio 46v Clues Cracked! "T.R.E." = Tempore Regis Eduardi (1066)—proving Sheriff Hugh squeezed extra cash from Stubbington!',
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

function hitZoneHTML({ id = '', key = '', dataAttr = '', x, y, w = 14, h = 22, found = false, ariaLabel }) {
  return `
    <button type="button"
            ${id ? `id="${id}"` : ''}
            ${key ? `data-hz-key="${key}"` : ''}
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
  const instanceSvgUid = `sol${Math.random().toString(36).slice(2, 7)}`;
  let activeFx = null;
  let data = null;
  let unmounted = false;
  let shimmerTimeout = null;
  let shellEl = null;
  let mountedSceneSignature = '';
  let enteredBrowserFs = false;
  let pointerDownSnap = null;
  let pointerDownPos = null;
  let pointerMovedDuringTap = false;
  let pointerDownTime = 0;

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

    bennetSightings: new Set(),
    coverSecretsFound: new Set(),

    // Beat 0: Swamp Rewind
    selectedPinId: 'gosport',
    rewound1086: false,
    peekSwampAnyway: false,
    swampSecretsFound: new Set(),

    // Beat 1: Fareham Asset Hunt + Gyrth Servi View
    beat1SubMode: 'hunt', // 'hunt' | 'servi'
    foundFarehamAssets: new Set(), // 'mills' | 'pigs' | 'church_meadow'
    farehamExtrasFound: new Set(),
    serviReflected: false,

    // Beat 2: 3-Step Interactive Map-Tap Hunt
    xraySplitPct: 20,
    selectedManorId: 'stubbington',
    showModernGhost: false,
    b2MissionIdx: 0,
    b2Solved: new Set(),
    b2WrongAttempt: '',

    // Beat 3: Royal Assize Court
    assizeSpotsHeard: new Set(),
    rulingVikings: null,
    rulingBishop: null,
    assizeVerdictRevealed: false,

    // Beat 4: Stubbington Hut People-Counter & Solent Spyglass
    beat4Tab: 'hut', // 'hut' | 'map'
    hutPeopleGroups: new Set(['husband_head']),
    foundBlindSpots: new Set(),
    spyglassPos: { x: 48, y: 34 },

    // Beat 5: Stubitone Parchment 3-Clue Code-Breaker + Stamp Quiz + Live Archive Quest
    translationPct: 0,
    activeChunkIdx: 0,
    b5ClueStep: 0, // 0, 1, 2
    b5SolvedClues: new Set(), // 'lc1' | 'lc2' | 'lc3'
    b5WrongChunkIdx: -1,
    stampAnswers: {},
    archiveBounty1: null, // 'small40' | 'large20'
    archiveBounty2: null, // 'meon' | 'funtley'
  };

  function persistSessionState() {
    if (typeof sessionStorage === 'undefined') return;
    try {
      const payload = {
        step: state.step,
        score: state.score,
        xpAwarded: state.xpAwarded,
        completedSteps: [...state.completedSteps],
        bennetSightings: [...state.bennetSightings],
        coverSecretsFound: [...state.coverSecretsFound],
        selectedPinId: state.selectedPinId,
        rewound1086: state.rewound1086,
        swampSecretsFound: [...state.swampSecretsFound],
        beat1SubMode: state.beat1SubMode,
        foundFarehamAssets: [...state.foundFarehamAssets],
        farehamExtrasFound: [...state.farehamExtrasFound],
        serviReflected: state.serviReflected,
        xraySplitPct: state.xraySplitPct,
        selectedManorId: state.selectedManorId,
        b2MissionIdx: state.b2MissionIdx,
        b2Solved: [...state.b2Solved],
        assizeSpotsHeard: [...state.assizeSpotsHeard],
        rulingVikings: state.rulingVikings,
        rulingBishop: state.rulingBishop,
        assizeVerdictRevealed: state.assizeVerdictRevealed,
        beat4Tab: state.beat4Tab,
        hutPeopleGroups: [...state.hutPeopleGroups],
        foundBlindSpots: [...state.foundBlindSpots],
        translationPct: state.translationPct,
        b5ClueStep: state.b5ClueStep,
        b5SolvedClues: [...state.b5SolvedClues],
        stampAnswers: state.stampAnswers,
        archiveBounty1: state.archiveBounty1,
        archiveBounty2: state.archiveBounty2,
      };
      sessionStorage.setItem(SESSION_SAVE_KEY, JSON.stringify(payload));
    } catch (_) {}
    if (state.step === 'beat5' && state.score > 0) {
      saveArcadePersonalBest('medieval_england', 'domesday_stubitone', 'all', state.score);
    }
  }

  function hydrateSessionState() {
    if (ctx.freshSession || typeof sessionStorage === 'undefined') return;
    try {
      const raw = sessionStorage.getItem(SESSION_SAVE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (!s || typeof s !== 'object') return;
      if (s.step && STEPS.some((x) => x.id === s.step)) state.step = s.step;
      if (typeof s.score === 'number') state.score = s.score;
      state.xpAwarded = Boolean(s.xpAwarded);
      if (Array.isArray(s.completedSteps)) state.completedSteps = new Set(s.completedSteps);
      if (Array.isArray(s.bennetSightings)) state.bennetSightings = new Set(s.bennetSightings);
      if (Array.isArray(s.coverSecretsFound)) state.coverSecretsFound = new Set(s.coverSecretsFound);
      if (s.selectedPinId) state.selectedPinId = s.selectedPinId;
      state.rewound1086 = Boolean(s.rewound1086);
      if (Array.isArray(s.swampSecretsFound)) state.swampSecretsFound = new Set(s.swampSecretsFound);
      if (s.beat1SubMode) state.beat1SubMode = s.beat1SubMode;
      if (Array.isArray(s.foundFarehamAssets)) state.foundFarehamAssets = new Set(s.foundFarehamAssets);
      if (Array.isArray(s.farehamExtrasFound)) state.farehamExtrasFound = new Set(s.farehamExtrasFound);
      state.serviReflected = Boolean(s.serviReflected);
      if (typeof s.xraySplitPct === 'number') state.xraySplitPct = s.xraySplitPct;
      if (s.selectedManorId) state.selectedManorId = s.selectedManorId;
      if (typeof s.b2MissionIdx === 'number') state.b2MissionIdx = s.b2MissionIdx;
      if (Array.isArray(s.b2Solved)) state.b2Solved = new Set(s.b2Solved);
      if (Array.isArray(s.assizeSpotsHeard)) state.assizeSpotsHeard = new Set(s.assizeSpotsHeard);
      state.rulingVikings = s.rulingVikings || null;
      state.rulingBishop = s.rulingBishop || null;
      state.assizeVerdictRevealed = Boolean(s.assizeVerdictRevealed);
      if (s.beat4Tab) state.beat4Tab = s.beat4Tab;
      if (Array.isArray(s.hutPeopleGroups)) state.hutPeopleGroups = new Set(s.hutPeopleGroups);
      if (Array.isArray(s.foundBlindSpots)) state.foundBlindSpots = new Set(s.foundBlindSpots);
      if (typeof s.translationPct === 'number') state.translationPct = s.translationPct;
      if (typeof s.b5ClueStep === 'number') state.b5ClueStep = s.b5ClueStep;
      if (Array.isArray(s.b5SolvedClues)) state.b5SolvedClues = new Set(s.b5SolvedClues);
      if (s.stampAnswers && typeof s.stampAnswers === 'object') state.stampAnswers = s.stampAnswers;
      state.archiveBounty1 = s.archiveBounty1 || null;
      state.archiveBounty2 = s.archiveBounty2 || null;
    } catch (_) {}
  }

  function resetAuditProgress() {
    try {
      sessionStorage.removeItem(SESSION_SAVE_KEY);
    } catch (_) {}
    state.step = 'cover';
    state.completedSteps.clear();
    state.score = 0;
    state.bennetSightings.clear();
    state.coverSecretsFound.clear();
    state.selectedPinId = 'gosport';
    state.rewound1086 = false;
    state.peekSwampAnyway = false;
    state.swampSecretsFound.clear();
    state.beat1SubMode = 'hunt';
    state.foundFarehamAssets.clear();
    state.farehamExtrasFound.clear();
    state.serviReflected = false;
    state.xraySplitPct = 20;
    state.selectedManorId = 'stubbington';
    state.showModernGhost = false;
    state.b2MissionIdx = 0;
    state.b2Solved.clear();
    state.b2WrongAttempt = '';
    state.assizeSpotsHeard.clear();
    state.rulingVikings = null;
    state.rulingBishop = null;
    state.assizeVerdictRevealed = false;
    state.beat4Tab = 'hut';
    state.hutPeopleGroups = new Set(['husband_head']);
    state.foundBlindSpots.clear();
    state.translationPct = 0;
    state.activeChunkIdx = 0;
    state.b5ClueStep = 0;
    state.b5SolvedClues.clear();
    state.b5WrongChunkIdx = -1;
    state.stampAnswers = {};
    state.archiveBounty1 = null;
    state.archiveBounty2 = null;
    setSpeech(
      'guy',
      'Sir Guy de Rouen • Royal Exchequer Clerk',
      isTouchUI()
        ? 'Tap glowing spots on the painting to poke 1086 secrets—or press BEGIN 1086 ROYAL AUDIT to test your hometown!'
        : 'Hover over the painting to spot discreet shiny secrets—or press BEGIN 1086 ROYAL AUDIT to test your hometown!',
    );
    mountedSceneSignature = '';
    render({ isStepNavigation: true });
  }

  hydrateSessionState();

  function cleanupFx() {
    if (activeFx) {
      activeFx.destroy();
      activeFx = null;
    }
  }

  function captureScrollSnapshot() {
    const modalEl = document.getElementById('hh-classroom-lab-modal');
    const mainEl = document.getElementById('main-content');
    return {
      winX: typeof window !== 'undefined' ? window.scrollX : 0,
      winY: typeof window !== 'undefined' ? window.scrollY : 0,
      shellTop: shellEl ? shellEl.scrollTop : 0,
      modalTop: modalEl ? modalEl.scrollTop : 0,
      mainTop: mainEl ? mainEl.scrollTop : 0,
    };
  }

  function restoreScrollSnapshot(snap) {
    if (!snap) return;
    if (shellEl && shellEl.scrollTop !== snap.shellTop) {
      shellEl.scrollTop = snap.shellTop;
    }
    const modalEl = document.getElementById('hh-classroom-lab-modal');
    if (modalEl && modalEl.scrollTop !== snap.modalTop) {
      modalEl.scrollTop = snap.modalTop;
    }
    const mainEl = document.getElementById('main-content');
    if (mainEl && mainEl.scrollTop !== snap.mainTop) {
      mainEl.scrollTop = snap.mainTop;
    }
    if (typeof window !== 'undefined' && (window.scrollY !== snap.winY || window.scrollX !== snap.winX)) {
      window.scrollTo(snap.winX, snap.winY);
    }
  }

  function preserveScrollPosition(mutatorFn) {
    const usePointerSnap =
      pointerDownSnap && !pointerMovedDuringTap && Date.now() - pointerDownTime < 800;
    const snap = usePointerSnap ? pointerDownSnap : captureScrollSnapshot();
    mutatorFn();
    restoreScrollSnapshot(snap);
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => {
        if (!unmounted) restoreScrollSnapshot(snap);
      });
    }
  }

  function scrollStageToTopOnStepChange() {
    if (shellEl) shellEl.scrollTop = 0;
    const modalEl = document.getElementById('hh-classroom-lab-modal');
    if (modalEl) modalEl.scrollTop = 0;
    if (!state.isFullscreen && !modalEl && shellEl && typeof window !== 'undefined') {
      const rect = shellEl.getBoundingClientRect();
      if (rect.top < 0) {
        window.scrollTo({ top: Math.max(0, window.scrollY + rect.top - 12), behavior: 'instant' });
      }
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
    shellEl?.classList.add('dst-hint-shimmer');
    if (shimmerTimeout) clearTimeout(shimmerTimeout);
    shimmerTimeout = setTimeout(() => {
      state.hintShimmer = false;
      shellEl?.classList.remove('dst-hint-shimmer');
    }, 1900);
  }

  function computeHutPeopleCount() {
    let total = 1;
    if (state.hutPeopleGroups.has('edith')) total += 1;
    if (state.hutPeopleGroups.has('five_kids')) total += 5;
    if (state.hutPeopleGroups.has('grandma')) total += 1;
    return total;
  }

  function getSceneSignature() {
    if (!data) return 'loading';
    if (state.step === 'beat0') {
      const selPin = data.modernPins.find((p) => p.id === state.selectedPinId) || data.modernPins[0];
      const vanished = state.rewound1086 && !selPin.existed1086;
      const showSwamp = state.rewound1086 && (vanished || state.peekSwampAnyway);
      return `beat0:${showSwamp ? 'swamp' : state.rewound1086 ? 'dossier' : 'pre'}`;
    }
    if (state.step === 'beat1') return `beat1:${state.beat1SubMode}`;
    if (state.step === 'beat4') return `beat4:${state.beat4Tab}`;
    return state.step;
  }

  function goToStep(nextStep) {
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
        ctx.onRoundComplete?.();
      }
      saveArcadePersonalBest('medieval_england', 'domesday_stubitone', 'all', state.score);
      setSpeech(
        'monk',
        'Great Domesday Folio 46v • STVBITONE',
        'Code-Breaker Finale! Hunt Stubbington’s real 1086 Latin lines on the left and tap the exact line that proves each of our 3 clues—use the Decoder Slider if you need a peek!',
        'beat5_stubitone_latin',
      );
    }
    persistSessionState();
    preloadUpcomingStageAssets(nextStep);
    render({ isStepNavigation: true });
  }

  function toggleFullscreenMode() {
    state.isFullscreen = !state.isFullscreen;
    shellEl?.classList.toggle('dst-is-fullscreen', state.isFullscreen);
    if (state.isFullscreen) {
      if (shellEl?.requestFullscreen) {
        shellEl
          .requestFullscreen()
          .then(() => {
            enteredBrowserFs = true;
          })
          .catch(() => {});
      }
    } else if (document.fullscreenElement && document.exitFullscreen) {
      enteredBrowserFs = false;
      document.exitFullscreen().catch(() => {});
    }
    syncHudOnly();
  }

  const onBrowserFsChange = () => {
    if (enteredBrowserFs && typeof document !== 'undefined' && !document.fullscreenElement) {
      enteredBrowserFs = false;
      state.isFullscreen = false;
      shellEl?.classList.remove('dst-is-fullscreen');
      syncHudOnly();
    }
  };
  if (typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', onBrowserFsChange);
  }

  // =========================================================================
  // PARTIAL HTML FRAGMENT BUILDERS
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

  function renderTopBarInnerHTML() {
    const curIdx = Math.max(0, STEPS.findIndex((s) => s.id === state.step));
    const prevStep = curIdx > 0 ? STEPS[curIdx - 1].id : '';
    const nextStep = curIdx < STEPS.length - 1 ? STEPS[curIdx + 1].id : '';

    return `
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
          ${state.score > 0 || state.completedSteps.size > 0 ? `<option value="__reset__">↺ Restart Audit</option>` : ''}
        </select>
        <button type="button" class="dst-mob-arrow-btn" id="dst-mob-next" ${nextStep ? `data-goto-step="${nextStep}"` : 'disabled'} aria-label="Next Stage">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <div class="dst-ctrl-group">
        <span class="dst-score-chip">
          🪙 ${state.score}<span class="dst-score-verb"> pts</span> • ${state.bennetSightings.size >= 3 ? '🥕 3/3★' : `🥕<span class="dst-score-verb"> Turnips</span> ${state.bennetSightings.size}/3`}
        </span>
        ${
          state.score > 0 || state.completedSteps.size > 0
            ? `<button type="button" class="dst-icon-btn dst-hide-narrow" data-dst-action="reset" title="Restart 1086 Audit from Scratch" aria-label="Restart Audit"><i class="fa-solid fa-rotate-left"></i></button>`
            : ''
        }
        <button type="button" class="dst-icon-btn ${!audio.muted ? 'is-active' : ''}" data-dst-action="mute" title="Toggle Voiceovers & Sound Effects" aria-label="Toggle Audio">
          <i class="fa-solid ${audio.muted ? 'fa-volume-xmark' : 'fa-volume-high'}"></i>
          <span class="dst-btn-lbl">${audio.muted ? 'Muted' : 'Audio On'}</span>
        </button>
        <button type="button" class="dst-icon-btn ${state.isFullscreen ? 'is-active' : ''}" data-dst-action="fs" title="Toggle Full-Screen Smartboard / Tablet View" aria-label="Toggle Full Screen">
          <i class="fa-solid ${state.isFullscreen ? 'fa-compress' : 'fa-expand'}"></i>
          <span class="dst-btn-lbl">${state.isFullscreen ? 'Windowed' : 'Full Screen'}</span>
        </button>
        ${
          typeof ctx.onCloseModal === 'function'
            ? `<button type="button" class="dst-icon-btn" data-dst-action="close" style="border-color:#ef4444;color:#fecaca;" aria-label="Close Adventure"><i class="fa-solid fa-xmark"></i><span class="dst-btn-lbl">Close</span></button>`
            : ''
        }
      </div>
    `;
  }

  function renderSpeechInnerHTML() {
    const av = SPEAKER_AVATARS[state.avatarKey] || SPEAKER_AVATARS.guy;
    return `
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
    `;
  }

  function renderSceneFooterBarHTML(secretFoundCount, secretTotalCount, captionText) {
    return `
      <div class="dst-scene-caption-strip" id="dst-scene-caption-slot">
        <span id="dst-scene-secret-tally">✨ <strong>Secrets:</strong> ${secretFoundCount} / ${secretTotalCount}</span>
        <span class="dst-caption-mid" style="color:#a8a29e;">${captionText}</span>
        <button type="button" class="dst-icon-btn" data-action="hint-shimmer" style="min-height:30px;padding:3px 9px;font-size:0.72rem;">
          ✨ Glint Hint
        </button>
      </div>
    `;
  }

  function renderCoverQuoteInnerHTML() {
    return `
      <div style="font-size:0.71rem;font-weight:900;color:#fbbf24;text-transform:uppercase;margin-bottom:2px;">
        🎙️ ${state.speakerName} • (${state.coverSecretsFound.size}/5 Secrets)
      </div>
      <div style="font-size:0.85rem;font-weight:700;color:#fef3c7;line-height:1.32;">
        &ldquo;${state.speechText}&rdquo;
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

            ${hitZoneHTML({ id: 'dst-cover-bennet', key: 'cov:bennet', x: 24, y: 69, w: 16, h: 32, found: state.coverSecretsFound.has('bennet'), ariaLabel: 'Inspect muddy peasant with turnip' })}
            ${hitZoneHTML({ id: 'dst-cover-gull', key: 'cov:gull', x: 9.5, y: 23, w: 12, h: 18, found: state.coverSecretsFound.has('gull'), ariaLabel: 'Inspect glaring seagull' })}
            ${hitZoneHTML({ id: 'dst-cover-pigs', key: 'cov:pigs', x: 61, y: 74, w: 24, h: 28, found: state.coverSecretsFound.has('pigs'), ariaLabel: 'Inspect Reeve Odo on bursting pig crate' })}
            ${hitZoneHTML({ id: 'dst-cover-quill', key: 'cov:quill', x: 74, y: 28, w: 22, h: 32, found: state.coverSecretsFound.has('quill'), ariaLabel: 'Inspect Norman Royal Clerk and glowing quill' })}
            ${hitZoneHTML({ id: 'dst-cover-edith', key: 'cov:edith', x: 88, y: 65, w: 13, h: 24, found: state.coverSecretsFound.has('edith'), ariaLabel: 'Inspect Edith waving ladle in cottage doorway' })}
          </div>
        </div>

        <div class="dst-cover-footer">
          <div class="dst-cover-quote-wrap" id="dst-cover-quote-slot" role="status" aria-live="polite" style="flex:1;min-width:min(100%,240px);">
            ${renderCoverQuoteInnerHTML()}
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

  function renderBeat0LeftMapAndPillsHTML() {
    return `
      <div class="dst-map-frame" id="dst-solent-map-wrap">
        ${renderSolentGisSvgHTML({
          data,
          mode: 'swamp',
          rewound1086: state.rewound1086,
          selectedPinId: state.selectedPinId,
          svgUid: `${instanceSvgUid}-b0`,
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
    `;
  }

  function renderBeat0RightHeaderHTML() {
    const selPin = data.modernPins.find((p) => p.id === state.selectedPinId) || data.modernPins[0];
    const vanished = state.rewound1086 && !selPin.existed1086;
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
        <span style="font-size:0.75rem;font-weight:900;color:#fbbf24;text-transform:uppercase;">
          STAGE 1 • WHERE IS MY HOUSE IN 1086?
        </span>
        <span style="font-size:0.76rem;color:#cbd5e1;font-weight:700;">Selected: <strong>${selPin.modernName}</strong></span>
      </div>
      ${
        state.rewound1086
          ? `
        <div style="padding:11px 13px;border-radius:11px;margin-bottom:10px;border:2px solid ${vanished ? '#ef4444' : '#22c55e'};background:${vanished ? 'rgba(127,29,29,0.32)' : 'rgba(20,83,45,0.32)'};">
          <div style="font-weight:900;font-size:1rem;color:${vanished ? '#fca5a5' : '#86efac'};margin-bottom:4px;">
            ${selPin.headline}
          </div>
          <p style="margin:0;font-size:0.85rem;line-height:1.42;color:#f5f5f4;">${selPin.verdict}</p>
        </div>
      `
          : ''
      }
    `;
  }

  function renderBeat0DossierCardHTML() {
    const selPin = data.modernPins.find((p) => p.id === state.selectedPinId) || data.modernPins[0];
    const selManor = data.manors.find((m) => m.id === state.selectedPinId);
    return `
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
          🐸 Peek at Empty 1086 Gosport Salt-Marsh
        </button>
      </div>
    `;
  }

  function renderBeat0HTML() {
    const selPin = data.modernPins.find((p) => p.id === state.selectedPinId) || data.modernPins[0];
    const vanished = state.rewound1086 && !selPin.existed1086;
    const showSwampScene = state.rewound1086 && (vanished || state.peekSwampAnyway);

    return `
      <div class="dst-body">
        <div class="dst-speech-box" id="dst-speech-slot" role="status" aria-live="polite">${renderSpeechInnerHTML()}</div>
        <div class="dst-split">
          <div id="dst-b0-left-slot">
            ${renderBeat0LeftMapAndPillsHTML()}
          </div>

          <div class="dst-card-panel">
            <div id="dst-b0-verdict-slot">${renderBeat0RightHeaderHTML()}</div>

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
                : showSwampScene
                  ? `
              <div class="dst-diorama-frame" id="dst-fx-stage" data-fx-preset="swamp">
                <img src="/images/arcade/domesday/scene_1_bennet_swamp.webp"
                     alt="Bennet Luvet waist-deep in 1086 Solent marsh mud"
                     class="domesday-diorama-img" />
                ${hitZoneHTML({ id: 'dst-swamp-bennet', key: 'swamp:bennet', x: 56, y: 55, w: 26, h: 58, found: state.bennetSightings.has('swamp'), ariaLabel: 'Inspect Bennet Luvet and his wormy turnip' })}
                ${hitZoneHTML({ id: 'dst-swamp-gull', key: 'swamp:gull', x: 83, y: 18, w: 15, h: 24, found: state.swampSecretsFound.has('gull'), ariaLabel: 'Inspect grumpy seagull on post' })}
                ${hitZoneHTML({ id: 'dst-swamp-mill', key: 'swamp:mill', x: 20, y: 38, w: 22, h: 30, found: state.swampSecretsFound.has('mill'), ariaLabel: 'Inspect distant Fareham timber watermill' })}
                ${hitZoneHTML({ id: 'dst-swamp-torch', key: 'swamp:torch', x: 78, y: 49, w: 12, h: 24, found: state.swampSecretsFound.has('torch'), ariaLabel: 'Inspect 1086 iron pitch-torch' })}
              </div>
              ${renderSceneFooterBarHTML(
                state.swampSecretsFound.size + (state.bennetSightings.has('swamp') ? 1 : 0),
                4,
                isTouchUI() ? 'Tap swamp to poke Bennet, seagull & creek!' : 'Hover swamp to poke Bennet, seagull & creek!',
              )}
              <button type="button" class="dst-next-btn" data-complete-next="beat1">
                Ride Up Fareham Creek → Catch Lying Reeve Odo <i class="fa-solid fa-arrow-right"></i>
              </button>
            `
                  : `
              <div id="dst-b0-dossier-slot">${renderBeat0DossierCardHTML()}</div>
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

  function renderBeat1SubtabsInnerHTML() {
    const foundCount = state.foundFarehamAssets.size;
    const all3Found = foundCount >= 3;
    return `
      <button type="button" class="dst-step-pill ${state.beat1SubMode === 'hunt' ? 'is-active' : ''}" id="dst-b1-tab-hunt">
        <span class="dst-lbl-full">🔎 Part A: Hunt Fareham's Hidden Wealth (${foundCount}/3 Assets)</span>
        <span class="dst-lbl-short">🔎 Part A: Wealth (${foundCount}/3)</span>
      </button>
      <button type="button" class="dst-step-pill ${state.beat1SubMode === 'servi' ? 'is-active' : ''} ${state.serviReflected ? 'is-done' : ''}" id="dst-b1-tab-servi">
        <span class="dst-lbl-full">⚖️ Part B: Meet Gyrth — Fareham's 10 Enslaved Workers ${all3Found ? '' : '🔒'}</span>
        <span class="dst-lbl-short">⚖️ Part B: 10 Servi ${all3Found ? '' : '🔒'}</span>
      </button>
    `;
  }

  function renderBeat1HuntRightPanelHTML() {
    const all3Found = state.foundFarehamAssets.size >= 3;
    const touch = isTouchUI();
    const actVerb = touch ? 'Tap' : 'Hover';
    return `
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
    `;
  }

  function renderBeat1HTML() {
    const totalFarehamSecrets =
      state.foundFarehamAssets.size + state.farehamExtrasFound.size + (state.bennetSightings.has('creek') ? 1 : 0);
    const touch = isTouchUI();

    return `
      <div class="dst-body">
        <div class="dst-speech-box" id="dst-speech-slot" role="status" aria-live="polite">${renderSpeechInnerHTML()}</div>
        <div class="dst-subtab-bar" id="dst-b1-subtabs-slot">${renderBeat1SubtabsInnerHTML()}</div>

        ${
          state.beat1SubMode === 'hunt'
            ? `
          <div class="dst-split">
            <div>
              <div class="dst-diorama-frame" id="dst-fx-stage" data-fx-preset="fareham_mills">
                <img src="/images/arcade/domesday/scene_2_fareham_mills.webp"
                     alt="1086 Fareham Creek watermills, oak-wood pigs and Reeve Odo"
                     class="domesday-diorama-img" />
                ${hitZoneHTML({ key: 'b1:odo', dataAttr: 'data-b1-spot="odo"', x: 18, y: 52, w: 18, h: 48, found: state.farehamExtrasFound.has('odo'), ariaLabel: 'Inspect sweating Reeve Odo' })}
                ${hitZoneHTML({ key: 'b1:relic', dataAttr: 'data-b1-spot="relic"', x: 35.5, y: 58, w: 14, h: 20, found: state.farehamExtrasFound.has('relic'), ariaLabel: 'Inspect Saint Swithin gilded bone casket' })}
                ${hitZoneHTML({ key: 'b1:mills', dataAttr: 'data-b1-spot="mills"', x: 64, y: 40, w: 30, h: 30, found: state.foundFarehamAssets.has('mills'), ariaLabel: 'Inspect timber watermills along the river' })}
                ${hitZoneHTML({ key: 'b1:pigs', dataAttr: 'data-b1-spot="pigs"', x: 89, y: 50, w: 18, h: 26, found: state.foundFarehamAssets.has('pigs'), ariaLabel: 'Inspect snorting pigs in oak woodland' })}
                ${hitZoneHTML({ key: 'b1:church_meadow', dataAttr: 'data-b1-spot="church_meadow"', x: 20, y: 22, w: 22, h: 24, found: state.foundFarehamAssets.has('church_meadow'), ariaLabel: 'Inspect Saxon stone church and green hay-meadows' })}
                ${hitZoneHTML({ key: 'b1:chickens', dataAttr: 'data-b1-spot="chickens"', x: 56, y: 86, w: 24, h: 20, found: state.farehamExtrasFound.has('chickens'), ariaLabel: 'Inspect pecking farmyard chickens' })}
                ${hitZoneHTML({ key: 'b1:bennet', dataAttr: 'data-b1-spot="bennet"', x: 8.5, y: 85, w: 13, h: 20, found: state.bennetSightings.has('creek'), ariaLabel: 'Inspect wiggling turnip tuft on riverbank' })}
              </div>
              ${renderSceneFooterBarHTML(totalFarehamSecrets, 7, touch ? 'Tap river, woods, hills & riverbank!' : 'Sweep cursor across river, woods, hills & riverbank!')}
            </div>

            <div class="dst-card-panel" id="dst-b1-right-slot">
              ${renderBeat1HuntRightPanelHTML()}
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
                ${hitZoneHTML({ id: 'dst-btn-hear-gyrth', key: 'servi:gyrth', x: 55, y: 46, w: 18, h: 52, found: state.serviReflected, ariaLabel: 'Listen to Gyrth the enslaved ploughman' })}
                ${hitZoneHTML({ key: 'servi:oxen', dataAttr: 'data-servi-spot="oxen"', x: 82, y: 50, w: 28, h: 36, found: state.farehamExtrasFound.has('oxen'), ariaLabel: 'Inspect heavy eight-ox medieval plough team' })}
                ${hitZoneHTML({ key: 'servi:overseer', dataAttr: 'data-servi-spot="overseer"', x: 13, y: 23, w: 12, h: 18, found: state.farehamExtrasFound.has('overseer'), ariaLabel: 'Inspect mounted Norman bailiff on ridge' })}
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

  function renderBeat2ManorCardInnerHTML() {
    const selManor = data.manors.find((m) => m.id === state.selectedManorId) || data.manors[0];
    return `
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
    `;
  }

  function renderBeat2MissionsInnerHTML() {
    const mCount = state.b2Solved.size;
    return `
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
                 👆 Tap a manor shield directly on the map!
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
    `;
  }

  function renderBeat2HTML() {
    return `
      <div class="dst-body">
        <div class="dst-speech-box" id="dst-speech-slot" role="status" aria-live="polite">${renderSpeechInnerHTML()}</div>
        <div class="dst-split">
          <div>
            <div class="dst-map-frame" id="dst-xray-map-wrap">
              ${renderSolentGisSvgHTML({
                data,
                mode: 'xray',
                xraySplitPct: state.xraySplitPct,
                selectedManorId: state.selectedManorId,
                targetTapManorMode: state.b2MissionIdx === 1 && !state.b2Solved.has('m2'),
                showModernGhost: state.showModernGhost,
                svgUid: `${instanceSvgUid}-b2`,
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
                👻 <span id="dst-ghost-btn-lbl">${state.showModernGhost ? 'Hide Ghost Towns' : 'Modern Ghost'}</span>
              </button>
              <button type="button" class="dst-icon-btn" id="dst-btn-haircut-gag" style="border-color:#fb923c;color:#fed7aa;">
                ✂️ Guy's Shaved Neck
              </button>
            </div>

            <div class="dst-card-panel" id="dst-b2-manor-slot" style="margin-top:10px;padding:11px 14px;">
              ${renderBeat2ManorCardInnerHTML()}
            </div>
          </div>

          <div class="dst-card-panel" id="dst-b2-right-slot">
            ${renderBeat2MissionsInnerHTML()}
          </div>
        </div>
      </div>
    `;
  }

  function renderBeat3RightPanelHTML() {
    const canSlamGavel = Boolean(state.rulingVikings && state.rulingBishop);
    const matchedRealHistory = state.rulingVikings === 'keep20' && state.rulingBishop === 'shame20';
    return `
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
    `;
  }

  function renderBeat3HTML() {
    return `
      <div class="dst-body">
        <div class="dst-speech-box" id="dst-speech-slot" role="status" aria-live="polite">${renderSpeechInnerHTML()}</div>
        <div class="dst-split">
          <div>
            <div class="dst-diorama-frame" id="dst-fx-stage" data-fx-preset="assize">
              <img src="/images/arcade/domesday/scene_3_royal_assize.webp"
                   alt="1086 Royal Assize Hall in Hampshire"
                   class="domesday-diorama-img" />
              ${hitZoneHTML({ key: 'assize:villager', dataAttr: 'data-assize-spot="villager"', x: 33, y: 56, w: 18, h: 48, found: state.assizeSpotsHeard.has('villager'), ariaLabel: 'Hear Fareham villager plea' })}
              ${hitZoneHTML({ key: 'assize:shield', dataAttr: 'data-assize-spot="shield"', x: 49, y: 23, w: 15, h: 24, found: state.assizeSpotsHeard.has('shield'), ariaLabel: 'Inspect coastal Viking shield exhibit' })}
              ${hitZoneHTML({ key: 'assize:clerk', dataAttr: 'data-assize-spot="clerk"', x: 64, y: 42, w: 14, h: 30, found: state.assizeSpotsHeard.has('clerk'), ariaLabel: 'Hear Norman Clerk Sir Guy' })}
              ${hitZoneHTML({ key: 'assize:hugh', dataAttr: 'data-assize-spot="hugh"', x: 78, y: 42, w: 14, h: 32, found: state.assizeSpotsHeard.has('hugh'), ariaLabel: 'Inspect Sheriff Hugh and silver coin stacks' })}
              ${hitZoneHTML({ key: 'assize:bishop_monk', dataAttr: 'data-assize-spot="bishop_monk"', x: 90, y: 46, w: 13, h: 36, found: state.assizeSpotsHeard.has('bishop_monk'), ariaLabel: 'Inspect Bishop Walkelin representative' })}
            </div>
            ${renderSceneFooterBarHTML(state.assizeSpotsHeard.size, 5, isTouchUI() ? 'Tap witnesses, Viking shield & silver coins!' : 'Hover witnesses, Viking shield & silver coins!')}

            <div style="margin-top:8px;padding:10px 12px;border-radius:10px;background:#1c1917;border:1px solid #44403c;font-size:0.8rem;">
              <div style="display:flex;justify-content:space-between;margin-bottom:5px;flex-wrap:wrap;gap:4px;">
                <span style="color:#86efac;font-weight:800;">🌾 True Output Today: £16</span>
                <span style="color:#fca5a5;font-weight:900;">⛪ Bishop Demands: £20 (-£4 Starvation Gap!)</span>
              </div>
              <div style="height:10px;border-radius:999px;background:#7f1d1d;overflow:hidden;display:flex;">
                <div style="width:80%;background:#16a34a;"></div>
              </div>
            </div>
          </div>

          <div class="dst-card-panel" id="dst-b3-right-slot">
            ${renderBeat3RightPanelHTML()}
          </div>
        </div>
      </div>
    `;
  }

  function renderBeat4SubtabsInnerHTML() {
    const peopleCount = computeHutPeopleCount();
    const spotsCount = state.foundBlindSpots.size;
    return `
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
    `;
  }

  function renderBeat4RightPanelHTML() {
    const peopleCount = computeHutPeopleCount();
    const spotsCount = state.foundBlindSpots.size;
    const readyNext = spotsCount >= 4;
    const actVerb = isTouchUI() ? 'Tap' : 'Hover';

    return `
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
    `;
  }

  function renderBeat4HTML() {
    const actVerb = isTouchUI() ? 'Tap' : 'Hover';

    return `
      <div class="dst-body">
        <div class="dst-speech-box" id="dst-speech-slot" role="status" aria-live="polite">${renderSpeechInnerHTML()}</div>
        <div class="dst-subtab-bar" id="dst-b4-subtabs-slot">${renderBeat4SubtabsInnerHTML()}</div>

        <div class="dst-split">
          <div>
            ${
              state.beat4Tab === 'hut'
                ? `
              <div class="dst-diorama-frame" id="dst-fx-stage" data-fx-preset="stubbington_hut">
                <img src="/images/arcade/domesday/scene_4_stubbington_hut.webp"
                     alt="Inside Stubbington Hut #3 in 1086"
                     class="domesday-diorama-img" />
                ${hitZoneHTML({ key: 'b4:edith', dataAttr: 'data-b4-spot="edith"', x: 22, y: 54, w: 20, h: 62, found: state.hutPeopleGroups.has('edith'), ariaLabel: 'Inspect Saxon mother Edith in doorway' })}
                ${hitZoneHTML({ key: 'b4:five_kids', dataAttr: 'data-b4-spot="five_kids"', x: 52, y: 56, w: 26, h: 36, found: state.hutPeopleGroups.has('five_kids'), ariaLabel: 'Count the five children around the cauldron and woodpile' })}
                ${hitZoneHTML({ key: 'b4:grandma', dataAttr: 'data-b4-spot="grandma"', x: 68, y: 60, w: 14, h: 36, found: state.hutPeopleGroups.has('grandma'), ariaLabel: 'Inspect grandmother spinning wool' })}
                ${hitZoneHTML({ key: 'b4:pets', dataAttr: 'data-b4-spot="untaxed_pets"', x: 42, y: 83, w: 18, h: 20, found: state.foundBlindSpots.has('untaxed_pets'), ariaLabel: 'Inspect farm dog and rafter chickens' })}
                ${hitZoneHTML({ key: 'b4:hens', dataAttr: 'data-b4-spot="rafter_hens"', x: 52, y: 12, w: 16, h: 14, found: state.foundBlindSpots.has('untaxed_pets'), ariaLabel: 'Inspect chickens on cottage beam' })}
                ${hitZoneHTML({ key: 'b4:stumps', dataAttr: 'data-b4-spot="stumps_bennet"', x: 91, y: 74, w: 15, h: 28, found: state.bennetSightings.has('stumps'), ariaLabel: 'Inspect mossy Stubbington tree stumps and wiggling turnip leaves' })}
              </div>
              ${renderSceneFooterBarHTML(
                state.hutPeopleGroups.size - 1 + (state.foundBlindSpots.has('untaxed_pets') ? 1 : 0) + (state.bennetSightings.has('stumps') ? 1 : 0),
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
                  svgUid: `${instanceSvgUid}-b4`,
                })}
              </div>
            `
            }
          </div>

          <div class="dst-card-panel" id="dst-b4-right-slot">
            ${renderBeat4RightPanelHTML()}
          </div>
        </div>
      </div>
    `;
  }

  function renderBeat5ChunksInnerHTML() {
    const chunks = data.stubitoneParchment.chunks;
    const crackedTargets = new Set(
      LATIN_CLUE_MISSIONS.filter((m) => state.b5SolvedClues.has(m.id)).map((m) => m.targetIdx),
    );
    return chunks
      .map((ch, idx) => {
        const threshold = Math.round(((idx + 0.5) / chunks.length) * 100);
        const showEnglish = state.translationPct >= threshold;
        const isCracked = crackedTargets.has(idx);
        const isWrong = state.b5WrongChunkIdx === idx && !isCracked;
        const formattedLatin = ch.latin.replace(
          'STVBITONE',
          '<span class="dst-rubric-strike">STVBITONE</span>',
        );
        return `
          <div class="dst-latin-row ${isCracked ? 'is-cracked' : state.activeChunkIdx === idx ? 'is-active' : ''} ${isWrong ? 'is-target-wrong' : ''}" data-chunk-idx="${idx}">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <span style="font-family:${showEnglish ? 'Inter, sans-serif' : 'Georgia, serif'};font-size:0.88rem;font-weight:${showEnglish ? '800' : '700'};color:${showEnglish ? '#14532d' : '#292524'};line-height:1.34;">
                <span class="dst-lang-chip ${showEnglish ? '' : 'is-latin'}">${showEnglish ? 'ENG' : 'LAT'}</span>${showEnglish ? ch.english : formattedLatin}
              </span>
              <span style="font-size:0.68rem;font-weight:900;color:${isCracked ? '#15803d' : '#9a3412'};white-space:nowrap;">
                ${isCracked ? '✓ Cracked' : `Line ${idx + 1}`}
              </span>
            </div>
          </div>
        `;
      })
      .join('');
  }

  function renderBeat5DecoderInnerHTML() {
    const chunks = data.stubitoneParchment.chunks;
    const activeChunk = chunks[state.activeChunkIdx] || chunks[0];
    const unlockedBennet = state.bennetSightings.size >= 3;
    const curMission = LATIN_CLUE_MISSIONS[state.b5ClueStep] || LATIN_CLUE_MISSIONS[0];
    const curSolved = state.b5SolvedClues.has(curMission.id);
    const all3Cracked = state.b5SolvedClues.size >= 3;

    return `
      <!-- ACTIVE 3-CLUE CODE-BREAKER CHALLENGE -->
      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
        <span style="font-size:0.74rem;font-weight:900;color:#fbbf24;text-transform:uppercase;">
          🔐 PARCHMENT CODE-BREAKER (${state.b5SolvedClues.size}/3 CRACKED)
        </span>
        <div style="display:flex;gap:4px;">
          ${LATIN_CLUE_MISSIONS.map(
            (m, i) => `
            <button type="button" class="dst-step-pill ${state.b5ClueStep === i ? 'is-active' : ''} ${state.b5SolvedClues.has(m.id) ? 'is-done' : ''}"
                    data-b5-clue="${i}" style="min-height:28px;padding:3px 8px;font-size:0.7rem;">
              ${state.b5SolvedClues.has(m.id) ? '✓ ' : ''}#${i + 1}
            </button>
          `,
          ).join('')}
        </div>
      </div>

      <div style="padding:10px 12px;border-radius:10px;background:#292524;border:1.5px solid ${curSolved ? '#22c55e' : '#f59e0b'};margin-bottom:10px;">
        <div style="font-size:0.71rem;font-weight:900;color:#fde68a;text-transform:uppercase;margin-bottom:3px;">
          ${curMission.badge}
        </div>
        <div style="font-size:0.86rem;font-weight:700;color:#f8fafc;line-height:1.38;">
          ${curMission.prompt}
        </div>
        ${
          state.b5WrongChunkIdx >= 0 && !curSolved
            ? `<div style="margin-top:7px;padding:7px 9px;border-radius:7px;background:rgba(220,38,38,0.22);border:1px solid #ef4444;font-size:0.79rem;color:#fecaca;">
                 ❌ Not Line ${state.b5WrongChunkIdx + 1}! ${curMission.hintWrong}
               </div>`
            : ''
        }
        ${
          curSolved
            ? `<div style="margin-top:7px;padding:7px 9px;border-radius:7px;background:rgba(22,163,74,0.22);border:1px solid #22c55e;font-size:0.8rem;color:#dcfce7;">
                 ✅ ${curMission.solvedNote}
               </div>`
            : ''
        }
      </div>

      <!-- INSPECTED LINE TRANSLATION CARD -->
      <div style="padding:9px 11px;border-radius:10px;background:#141210;border:1px solid #44403c;margin-bottom:10px;">
        <div style="font-size:0.69rem;font-weight:900;color:#a8a29e;text-transform:uppercase;margin-bottom:2px;">
          📜 INSPECTED LINE ${state.activeChunkIdx + 1} • ${activeChunk.decoderTitle}
        </div>
        <div style="font-size:0.82rem;color:#86efac;font-weight:700;margin-bottom:3px;">
          ${activeChunk.english}
        </div>
        <p style="margin:0;font-size:0.79rem;color:#d6d3d1;line-height:1.38;">
          ${activeChunk.decoderNote}
        </p>
      </div>

      <div style="padding:10px 12px;border-radius:12px;background:linear-gradient(135deg,${all3Cracked ? '#14532d' : '#450a0a'} 0%,#1c1917 100%);border:2px solid ${all3Cracked ? '#22c55e' : '#dc2626'};display:flex;align-items:center;gap:11px;margin-bottom:9px;">
        <div style="width:46px;height:46px;border-radius:50%;background:radial-gradient(circle,#ef4444 0%,#991b1b 75%);border:2.5px solid #fca5a5;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">
          ${all3Cracked ? '🏆' : '👑'}
        </div>
        <div>
          <div style="font-size:0.68rem;font-weight:900;color:#fca5a5;text-transform:uppercase;">
            ${all3Cracked ? 'FOLIO 46v OFFICIALLY DECODED!' : 'KING WILLIAM’S GREAT WAX SEAL'}
          </div>
          <div style="font-size:0.9rem;font-weight:900;color:#ffffff;">Royal Solent Commissioner • ${state.score} Audit Points</div>
          <div style="font-size:0.75rem;color:#fde68a;">
            ${unlockedBennet ? '🏆 SECRET TURNIP SEAL UNLOCKED: Boggy Bennet Luvet (Worth £0 0s 0d & 1 Wormy Turnip)!' : `🥕 Spot Bennet’s turnip in all 3 scenes (${state.bennetSightings.size}/3 found) for his £0 seal!`}
          </div>
        </div>
      </div>

      <button type="button" class="dst-icon-btn" id="dst-btn-hear-debrief" style="width:100%;border-color:#38bdf8;color:#bae6fd;">
        🔊 Hear Historian Summary: What Was Really Recorded in 1086?
      </button>
    `;
  }

  function renderBeat5ArchiveBountyInnerHTML() {
    const b1Done = state.archiveBounty1 !== null;
    const b1Right = state.archiveBounty1 === 'small40';
    const b2Done = state.archiveBounty2 !== null;
    const b2Right = state.archiveBounty2 === 'meon';
    const masterUnlocked = b1Right && b2Right;

    return `
      <div class="dst-stamp-grid">
        <div style="background:#1e293b;border:1.5px solid ${!b1Done ? '#334155' : b1Right ? '#22c55e' : '#ef4444'};border-radius:11px;padding:11px 13px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
          <div>
            <div style="font-size:0.7rem;font-weight:900;color:#7dd3fc;text-transform:uppercase;margin-bottom:3px;">
              🕵️‍♂️ ARCHIVE PROOF #1 • STUBBINGTON'S SIZE RANK
            </div>
            <div style="font-size:0.83rem;font-weight:700;color:#f8fafc;line-height:1.38;">
              Open Stubbington’s page on <strong>Open Domesday</strong> (and zoom into the real parchment scan on the right!). Under <strong>Population (9 households)</strong>, where did Stubbington rank across 1086 England?
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button type="button" class="dst-icon-btn ${state.archiveBounty1 === 'small40' ? 'is-active' : ''}" data-bounty1="small40" style="flex:1;font-size:0.74rem;">
              🌱 Smallest 40%
            </button>
            <button type="button" class="dst-icon-btn ${state.archiveBounty1 === 'large20' ? 'is-active' : ''}" data-bounty1="large20" style="flex:1;font-size:0.74rem;">
              🏙️ Largest 20%
            </button>
          </div>
          ${
            b1Done
              ? `<div style="font-size:0.77rem;color:${b1Right ? '#86efac' : '#fca5a5'};line-height:1.36;">
                   ${b1Right ? '✅ Verified from Open Domesday! 9 households put Stubbington in the smallest 40% of England (while 90-household Fareham ranked in the largest 20%)!' : '❌ Check the first bullet on Stubbington’s Open Domesday page—with just 9 households, was it in the Smallest 40%?'}
                 </div>`
              : ''
          }
        </div>

        <div style="background:#1e293b;border:1.5px solid ${!b2Done ? '#334155' : b2Right ? '#22c55e' : '#ef4444'};border-radius:11px;padding:11px 13px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
          <div>
            <div style="font-size:0.7rem;font-weight:900;color:#7dd3fc;text-transform:uppercase;margin-bottom:3px;">
              🕵️‍♂️ ARCHIVE PROOF #2 • TITCHFIELD HUNDRED NEIGHBOURS
            </div>
            <div style="font-size:0.83rem;font-weight:700;color:#f8fafc;line-height:1.38;">
              Click <strong>Titchfield</strong> next to <strong>Hundred</strong> on Stubbington’s page to reveal all <strong>10 local 1086 places</strong> (<em>Funtley, Brownwich, Segensworth, Hook...</em>). Which local hamlet at the bottom had <strong>ONLY 2 HOUSEHOLDS</strong>?
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button type="button" class="dst-icon-btn ${state.archiveBounty2 === 'funtley' ? 'is-active' : ''}" data-bounty2="funtley" style="flex:1;font-size:0.74rem;">
              🏘️ Funtley
            </button>
            <button type="button" class="dst-icon-btn ${state.archiveBounty2 === 'meon' ? 'is-active' : ''}" data-bounty2="meon" style="flex:1;font-size:0.74rem;">
              🌊 Meon (2 households)
            </button>
          </div>
          ${
            b2Done
              ? `<div style="font-size:0.77rem;color:${b2Right ? '#86efac' : '#fca5a5'};line-height:1.36;">
                   ${b2Right ? '✅ Spot on! Tiny Meon at the mouth of the River Meon had just 2 households—right below Hook (8) and Stubbington (9)!' : '❌ Funtley had 22 households! Look right at the bottom of the 10 settlements in Titchfield Hundred!'}
                 </div>`
              : ''
          }
        </div>
      </div>

      ${
        masterUnlocked
          ? `<div style="margin-top:10px;padding:10px 13px;border-radius:10px;background:rgba(20,83,45,0.42);border:2px solid #22c55e;font-size:0.84rem;font-weight:800;color:#dcfce7;">
               🏅 <strong>MASTER ARCHIVIST OF TITCHFIELD HUNDRED UNLOCKED!</strong> You just cross-checked genuine 1086 National Archives data like a professional medieval historian!
             </div>`
          : ''
      }
    `;
  }

  function renderBeat5StampsInnerHTML() {
    return STAMP_CHALLENGES.map((sc) => {
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
    }).join('');
  }

  function renderBeat5HTML() {
    const debrief = data.debriefColumns;

    return `
      <div class="dst-body">
        <div class="dst-speech-box" id="dst-speech-slot" role="status" aria-live="polite">${renderSpeechInnerHTML()}</div>

        <div class="dst-split" style="margin-bottom:16px;">
          <div class="dst-parchment-box">
            <div class="dst-parchment-header">
              📜 ${data.stubitoneParchment.folioHeader}
            </div>

            <div class="dst-slider-bar">
              <span style="font-size:0.72rem;font-weight:900;color:#78350f;white-space:nowrap;">1086 LATIN</span>
              <input type="range" id="dst-latin-slider" min="0" max="100" value="${state.translationPct}"
                     style="flex:1;min-width:70px;height:28px;accent-color:#b91c1c;cursor:pointer;"
                     aria-label="Optional Decoder Lens: slide right to peek at English" />
              <span id="dst-latin-pct-lbl" style="font-size:0.72rem;font-weight:900;color:#15803d;white-space:nowrap;">DECODER (${state.translationPct}%)</span>
            </div>
            <div style="font-size:0.74rem;font-weight:800;color:#78350f;margin-bottom:8px;">
              👆 Tap the matching parchment line below to solve each Code-Breaker clue!
            </div>

            <div class="dst-chunk-grid" id="dst-b5-chunks-slot">
              ${renderBeat5ChunksInnerHTML()}
            </div>
          </div>

          <div class="dst-card-panel" id="dst-b5-decoder-slot">
            ${renderBeat5DecoderInnerHTML()}
          </div>
        </div>

        <div style="background:#1c1917;border:1.5px solid #f59e0b;border-radius:14px;padding:13px 15px;margin-bottom:14px;">
          <div style="font-size:0.78rem;font-weight:900;color:#fde047;text-transform:uppercase;margin-bottom:8px;">
            🔨 30-SECOND HISTORIAN STAMP TEST: REAL IN THE 1086 BOOK OR COMEDY INVENTION?
          </div>
          <div class="dst-stamp-grid" id="dst-b5-stamps-slot">
            ${renderBeat5StampsInnerHTML()}
          </div>
        </div>

        <div class="dst-archive-quest-box">
          <div style="font-size:0.78rem;font-weight:900;color:#7dd3fc;text-transform:uppercase;margin-bottom:4px;">
            🌐 FINAL FIELDWORK QUEST: INSPECT THE REAL 1086 DOMESDAY BOOK ONLINE!
          </div>
          <p style="margin:0;font-size:0.85rem;color:#e2e8f0;line-height:1.42;">
            Want to see King William’s genuine 940-year-old sheepskin page in The National Archives? Launch <strong>Open Domesday</strong> in a new tab, search <strong>Stubbington</strong>, and bring back these <strong>2 real archive proofs</strong>:
          </p>

          <div class="dst-ext-link-row">
            <a href="https://opendomesday.org/" target="_blank" rel="noopener noreferrer" class="dst-ext-link-btn is-primary">
              🔎 Search Open Domesday ("Stubbington") <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            <a href="https://opendomesday.org/place/SU5402/stubbington/" target="_blank" rel="noopener noreferrer" class="dst-ext-link-btn">
              📜 Stubbington Folio 46v Scan <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            <a href="https://opendomesday.org/place/SU5806/fareham/" target="_blank" rel="noopener noreferrer" class="dst-ext-link-btn">
              ⛪ Fareham Folio Scan <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>

          <div id="dst-b5-archive-slot">
            ${renderBeat5ArchiveBountyInnerHTML()}
          </div>

          <div style="margin-top:9px;font-size:0.77rem;color:#bae6fd;line-height:1.38;">
            🏡 <strong>Hometown Bonus:</strong> Before closing Open Domesday, search <strong>Funtley</strong>, <strong>Segensworth</strong>, <strong>Brownwich</strong>, <strong>Hook</strong>, or <strong>Alverstoke</strong>—did your street exist in 1086, or was it salt-marsh like Gosport?
          </div>
        </div>

        <details class="dst-archive-drawer">
          <summary>
            <span>📚 Open Full 1086 Archive Reference: Real Records vs. Fictional Locals vs. Blind Spots</span>
            <span style="font-size:0.74rem;color:#fbbf24;">▾</span>
          </summary>
          <div style="font-size:0.73rem;color:#a8a29e;margin-top:6px;">${data.sourceAttribution}</div>
          <div class="dst-debrief-grid">
            <div class="dst-debrief-col" style="border-top:4px solid #22c55e;">
              <div style="font-size:0.8rem;font-weight:900;color:#86efac;margin-bottom:8px;">📜 100% REAL IN THE 1086 BOOK</div>
              <ul style="margin:0;padding-left:17px;font-size:0.81rem;color:#e7e5e4;line-height:1.45;">
                ${debrief.recordedTrue.map((item) => `<li style="margin-bottom:6px;">${item}</li>`).join('')}
              </ul>
            </div>

            <div class="dst-debrief-col" style="border-top:4px solid #f59e0b;">
              <div style="font-size:0.8rem;font-weight:900;color:#fde047;margin-bottom:8px;">🎭 OUR FICTIONAL VILLAGE VOICES</div>
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
        </details>
      </div>
    `;
  }

  // =========================================================================
  // LIVE IN-PLACE UPDATERS (ZERO DIORAMA/CANVAS TEARDOWN, ZERO SCROLL JUMP!)
  // =========================================================================
  function isHitZoneFound(key) {
    switch (key) {
      case 'cov:bennet': return state.coverSecretsFound.has('bennet');
      case 'cov:gull': return state.coverSecretsFound.has('gull');
      case 'cov:pigs': return state.coverSecretsFound.has('pigs');
      case 'cov:quill': return state.coverSecretsFound.has('quill');
      case 'cov:edith': return state.coverSecretsFound.has('edith');
      case 'swamp:bennet': return state.bennetSightings.has('swamp');
      case 'swamp:gull': return state.swampSecretsFound.has('gull');
      case 'swamp:mill': return state.swampSecretsFound.has('mill');
      case 'swamp:torch': return state.swampSecretsFound.has('torch');
      case 'b1:odo': return state.farehamExtrasFound.has('odo');
      case 'b1:relic': return state.farehamExtrasFound.has('relic');
      case 'b1:mills': return state.foundFarehamAssets.has('mills');
      case 'b1:pigs': return state.foundFarehamAssets.has('pigs');
      case 'b1:church_meadow': return state.foundFarehamAssets.has('church_meadow');
      case 'b1:chickens': return state.farehamExtrasFound.has('chickens');
      case 'b1:bennet': return state.bennetSightings.has('creek');
      case 'servi:gyrth': return state.serviReflected;
      case 'servi:oxen': return state.farehamExtrasFound.has('oxen');
      case 'servi:overseer': return state.farehamExtrasFound.has('overseer');
      case 'assize:villager': return state.assizeSpotsHeard.has('villager');
      case 'assize:shield': return state.assizeSpotsHeard.has('shield');
      case 'assize:clerk': return state.assizeSpotsHeard.has('clerk');
      case 'assize:hugh': return state.assizeSpotsHeard.has('hugh');
      case 'assize:bishop_monk': return state.assizeSpotsHeard.has('bishop_monk');
      case 'b4:edith': return state.hutPeopleGroups.has('edith');
      case 'b4:five_kids': return state.hutPeopleGroups.has('five_kids');
      case 'b4:grandma': return state.hutPeopleGroups.has('grandma');
      case 'b4:pets':
      case 'b4:hens': return state.foundBlindSpots.has('untaxed_pets');
      case 'b4:stumps': return state.bennetSightings.has('stumps');
      default: return false;
    }
  }

  function syncHudOnly() {
    if (!shellEl) return;
    persistSessionState();
    preserveScrollPosition(() => {
      const topSlot = shellEl.querySelector('#dst-slot-topbar');
      if (topSlot) topSlot.innerHTML = renderTopBarInnerHTML();

      const spSlot = shellEl.querySelector('#dst-speech-slot');
      if (spSlot) spSlot.innerHTML = renderSpeechInnerHTML();

      const covQuote = shellEl.querySelector('#dst-cover-quote-slot');
      if (covQuote) covQuote.innerHTML = renderCoverQuoteInnerHTML();

      shellEl.querySelectorAll('.dst-hit-zone[data-hz-key]').forEach((btn) => {
        btn.classList.toggle('is-found', isHitZoneFound(btn.dataset.hzKey));
      });
    });
  }

  function syncXraySvgSplitInPlace(pct) {
    if (!shellEl) return;
    const splitX = Math.round((pct / 100) * 900);
    const clampedLabelX = Math.max(96, Math.min(796, splitX)) - splitX;

    const leftRect = shellEl.querySelector('[data-clip-role="left1066"]');
    if (leftRect) leftRect.setAttribute('width', String(splitX));

    const rightRect = shellEl.querySelector('[data-clip-role="right1086"]');
    if (rightRect) {
      rightRect.setAttribute('x', String(splitX));
      rightRect.setAttribute('width', String(900 - splitX));
    }

    const divider = shellEl.querySelector('#solent-xray-divider');
    if (divider) {
      divider.setAttribute('transform', `translate(${splitX}, 0)`);
      const badgeGroup = divider.querySelector('g');
      if (badgeGroup) badgeGroup.setAttribute('transform', `translate(${clampedLabelX}, 0)`);
    }

    const rangeEl = shellEl.querySelector('#dst-xray-range');
    if (rangeEl && Number(rangeEl.value) !== pct) {
      rangeEl.value = String(pct);
    }
  }

  function syncCurrentStagePanelsInPlace() {
    if (!shellEl || !data) return;
    preserveScrollPosition(() => {
      syncHudOnly();

      const tallyEl = shellEl.querySelector('#dst-scene-secret-tally');
      if (state.step === 'beat0') {
        const leftSlot = shellEl.querySelector('#dst-b0-left-slot');
        if (leftSlot) leftSlot.innerHTML = renderBeat0LeftMapAndPillsHTML();
        const verdSlot = shellEl.querySelector('#dst-b0-verdict-slot');
        if (verdSlot) verdSlot.innerHTML = renderBeat0RightHeaderHTML();
        const dosSlot = shellEl.querySelector('#dst-b0-dossier-slot');
        if (dosSlot) dosSlot.innerHTML = renderBeat0DossierCardHTML();
        if (tallyEl) {
          const found = state.swampSecretsFound.size + (state.bennetSightings.has('swamp') ? 1 : 0);
          tallyEl.innerHTML = `✨ <strong>Secrets:</strong> ${found} / 4`;
        }
      } else if (state.step === 'beat1') {
        const subSlot = shellEl.querySelector('#dst-b1-subtabs-slot');
        if (subSlot) subSlot.innerHTML = renderBeat1SubtabsInnerHTML();
        const rSlot = shellEl.querySelector('#dst-b1-right-slot');
        if (rSlot && state.beat1SubMode === 'hunt') rSlot.innerHTML = renderBeat1HuntRightPanelHTML();
        if (tallyEl) {
          if (state.beat1SubMode === 'hunt') {
            const tot =
              state.foundFarehamAssets.size +
              state.farehamExtrasFound.size +
              (state.bennetSightings.has('creek') ? 1 : 0);
            tallyEl.innerHTML = `✨ <strong>Secrets:</strong> ${tot} / 7`;
          } else {
            const tot =
              1 +
              (state.farehamExtrasFound.has('oxen') ? 1 : 0) +
              (state.farehamExtrasFound.has('overseer') ? 1 : 0);
            tallyEl.innerHTML = `✨ <strong>Secrets:</strong> ${tot} / 3`;
          }
        }
      } else if (state.step === 'beat2') {
        const mapWrap = shellEl.querySelector('#dst-xray-map-wrap');
        if (mapWrap) {
          mapWrap.innerHTML = renderSolentGisSvgHTML({
            data,
            mode: 'xray',
            xraySplitPct: state.xraySplitPct,
            selectedManorId: state.selectedManorId,
            targetTapManorMode: state.b2MissionIdx === 1 && !state.b2Solved.has('m2'),
            showModernGhost: state.showModernGhost,
            svgUid: `${instanceSvgUid}-b2`,
          });
        }
        const ghostLbl = shellEl.querySelector('#dst-ghost-btn-lbl');
        if (ghostLbl) ghostLbl.textContent = state.showModernGhost ? 'Hide Ghost Towns' : 'Modern Ghost';
        const manorSlot = shellEl.querySelector('#dst-b2-manor-slot');
        if (manorSlot) manorSlot.innerHTML = renderBeat2ManorCardInnerHTML();
        const rSlot = shellEl.querySelector('#dst-b2-right-slot');
        if (rSlot) rSlot.innerHTML = renderBeat2MissionsInnerHTML();
      } else if (state.step === 'beat3') {
        const rSlot = shellEl.querySelector('#dst-b3-right-slot');
        if (rSlot) rSlot.innerHTML = renderBeat3RightPanelHTML();
        if (tallyEl) {
          tallyEl.innerHTML = `✨ <strong>Secrets:</strong> ${state.assizeSpotsHeard.size} / 5`;
        }
      } else if (state.step === 'beat4') {
        const subSlot = shellEl.querySelector('#dst-b4-subtabs-slot');
        if (subSlot) subSlot.innerHTML = renderBeat4SubtabsInnerHTML();
        const rSlot = shellEl.querySelector('#dst-b4-right-slot');
        if (rSlot) rSlot.innerHTML = renderBeat4RightPanelHTML();
        if (state.beat4Tab === 'hut' && tallyEl) {
          const tot =
            state.hutPeopleGroups.size -
            1 +
            (state.foundBlindSpots.has('untaxed_pets') ? 1 : 0) +
            (state.bennetSightings.has('stumps') ? 1 : 0);
          tallyEl.innerHTML = `✨ <strong>Secrets:</strong> ${tot} / 5`;
        } else if (state.beat4Tab === 'map') {
          const spyWrap = shellEl.querySelector('#dst-spyglass-map-wrap');
          if (spyWrap) {
            spyWrap.innerHTML = renderSolentGisSvgHTML({
              data,
              mode: 'spyglass',
              spyglassPos: state.spyglassPos,
              foundBlindSpots: state.foundBlindSpots,
              svgUid: `${instanceSvgUid}-b4`,
            });
          }
        }
      } else if (state.step === 'beat5') {
        const pctLbl = shellEl.querySelector('#dst-latin-pct-lbl');
        if (pctLbl) pctLbl.textContent = `DECODER (${state.translationPct}%)`;
        const chSlot = shellEl.querySelector('#dst-b5-chunks-slot');
        if (chSlot) chSlot.innerHTML = renderBeat5ChunksInnerHTML();
        const decSlot = shellEl.querySelector('#dst-b5-decoder-slot');
        if (decSlot) decSlot.innerHTML = renderBeat5DecoderInnerHTML();
        const stSlot = shellEl.querySelector('#dst-b5-stamps-slot');
        if (stSlot) stSlot.innerHTML = renderBeat5StampsInnerHTML();
        const arcSlot = shellEl.querySelector('#dst-b5-archive-slot');
        if (arcSlot) arcSlot.innerHTML = renderBeat5ArchiveBountyInnerHTML();
      }
    });
  }

  // =========================================================================
  // PERSISTENT SHELL MOUNT + EVENT DELEGATION (BOUND ONCE ON SHELL!)
  // =========================================================================
  function ensureShellMounted() {
    if (shellEl && shellEl.isConnected) return;
    stageEl.innerHTML = `
      <div class="dst-shell ${state.isFullscreen ? 'dst-is-fullscreen' : ''} ${state.hintShimmer ? 'dst-hint-shimmer' : ''}">
        <div class="dst-topbar" id="dst-slot-topbar"></div>
        <div id="dst-slot-main"></div>
      </div>
    `;
    shellEl = stageEl.querySelector('.dst-shell');
    bindDelegatedShellEvents();
  }

  function render({ isStepNavigation = false } = {}) {
    if (unmounted || !stageEl.isConnected) return;
    ensureShellMounted();

    shellEl.classList.toggle('dst-is-fullscreen', state.isFullscreen);
    shellEl.classList.toggle('dst-hint-shimmer', state.hintShimmer);

    if (!data) {
      shellEl.querySelector('#dst-slot-main').innerHTML =
        `<div style="padding:36px;text-align:center;color:#fde68a;font-weight:800;">Unrolling 1086 Hampshire Parchment...</div>`;
      return;
    }

    const nextSig = getSceneSignature();

    // If scene signature hasn't changed and this isn't a full step change, update panels in place with ZERO jump!
    if (!isStepNavigation && nextSig === mountedSceneSignature) {
      syncCurrentStagePanelsInPlace();
      return;
    }

    const applySceneBuild = () => {
      cleanupFx();
      mountedSceneSignature = nextSig;

      shellEl.querySelector('#dst-slot-topbar').innerHTML = renderTopBarInnerHTML();

      let stageBody = '';
      if (state.step === 'cover') stageBody = renderCoverHTML();
      else if (state.step === 'beat0') stageBody = renderBeat0HTML();
      else if (state.step === 'beat1') stageBody = renderBeat1HTML();
      else if (state.step === 'beat2') stageBody = renderBeat2HTML();
      else if (state.step === 'beat3') stageBody = renderBeat3HTML();
      else if (state.step === 'beat4') stageBody = renderBeat4HTML();
      else stageBody = renderBeat5HTML();

      shellEl.querySelector('#dst-slot-main').innerHTML = stageBody;

      const fxStage = shellEl.querySelector('#dst-fx-stage');
      if (fxStage) {
        activeFx = mountLivingDioramaFX(fxStage, fxStage.dataset.fxPreset || 'cover');
      }
      bindDirectStageControls();
    };

    if (isStepNavigation) {
      applySceneBuild();
      scrollStageToTopOnStepChange();
    } else {
      preserveScrollPosition(applySceneBuild);
    }
  }

  function bindDirectStageControls() {
    // Stage 3: Live zero-teardown X-Ray pointer drag & range slider
    const xrayWrap = shellEl.querySelector('#dst-xray-map-wrap');
    if (xrayWrap) {
      let draggingXray = false;
      const updateXrayFromEvent = (e) => {
        const rect = xrayWrap.getBoundingClientRect();
        if (!rect.width) return;
        const pct = Math.max(4, Math.min(96, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
        const crossed = state.xraySplitPct < 60 && pct >= 60;
        state.xraySplitPct = pct;
        syncXraySvgSplitInPlace(pct);
        if (crossed) {
          audio.normanHorn();
          setSpeech(
            'hugh',
            'Sheriff Hugh of Port • New Norman Overlord',
            'Godwin’s Stubbington farm? Mine! Wickham? Mine! Fifty-four Hampshire manors? ALL MINE! Best conquest ever!',
            'beat2_hugh_boast',
          );
          syncHudOnly();
        }
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
      xrayWrap.addEventListener('pointercancel', () => {
        draggingXray = false;
      });
    }

    shellEl.querySelector('#dst-xray-range')?.addEventListener('input', (e) => {
      const pct = Number(e.target.value);
      const crossed = state.xraySplitPct < 60 && pct >= 60;
      state.xraySplitPct = pct;
      syncXraySvgSplitInPlace(pct);
      if (crossed) {
        audio.normanHorn();
        setSpeech(
          'hugh',
          'Sheriff Hugh of Port • New Norman Overlord',
          'Godwin’s Stubbington farm? Mine! Wickham? Mine! Fifty-four Hampshire manors? ALL MINE! Best conquest ever!',
          'beat2_hugh_boast',
        );
        syncHudOnly();
      }
    });

    // Stage 5: Live Spyglass pointer tracking
    const spyWrap = shellEl.querySelector('#dst-spyglass-map-wrap');
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

    // Stage 6: Live zero-teardown Folio 46v Latin slider
    shellEl.querySelector('#dst-latin-slider')?.addEventListener('input', (e) => {
      state.translationPct = Number(e.target.value);
      preserveScrollPosition(() => {
        const pctLbl = shellEl.querySelector('#dst-latin-pct-lbl');
        if (pctLbl) pctLbl.textContent = `DECODER (${state.translationPct}%)`;
        const chSlot = shellEl.querySelector('#dst-b5-chunks-slot');
        if (chSlot) chSlot.innerHTML = renderBeat5ChunksInnerHTML();
      });
    });
  }

  function bindDelegatedShellEvents() {
    // Capture scroll snapshot BEFORE native browser touch/mouse focus can jump partially clipped buttons!
    shellEl.addEventListener(
      'pointerdown',
      (e) => {
        if (e.target.closest('select, input[type="range"]')) {
          pointerDownSnap = null;
          return;
        }
        pointerDownSnap = captureScrollSnapshot();
        pointerDownPos = { x: e.clientX, y: e.clientY };
        pointerMovedDuringTap = false;
        pointerDownTime = Date.now();
      },
      { passive: true },
    );

    shellEl.addEventListener(
      'pointermove',
      (e) => {
        if (!pointerDownPos) return;
        if (
          Math.abs(e.clientX - pointerDownPos.x) > 10 ||
          Math.abs(e.clientY - pointerDownPos.y) > 10
        ) {
          pointerMovedDuringTap = true;
        }
      },
      { passive: true },
    );

    // Prevent mouse/touch synthesized mousedown from focusing <button> and triggering scrollIntoView jumps
    shellEl.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) {
        e.preventDefault();
      }
    });

    shellEl.addEventListener('change', (e) => {
      const sel = e.target.closest('#dst-mob-step-select');
      if (sel) {
        if (sel.value === '__reset__') {
          resetAuditProgress();
          return;
        }
        audio.ensureContext();
        goToStep(sel.value);
      }
    });

    shellEl.addEventListener('click', (e) => {
      const gotoBtn = e.target.closest('[data-goto-step]');
      if (gotoBtn && !gotoBtn.disabled) {
        audio.ensureContext();
        goToStep(gotoBtn.dataset.gotoStep);
        return;
      }

      const nextStageBtn = e.target.closest('[data-complete-next]');
      if (nextStageBtn) {
        state.completedSteps.add(state.step);
        state.score += 100;
        audio.chimeSuccess();
        goToStep(nextStageBtn.dataset.completeNext);
        return;
      }

      if (e.target.closest('[data-action="hint-shimmer"]')) {
        audio.chimeSuccess();
        triggerHintPulse();
        return;
      }

      const topAct = e.target.closest('[data-dst-action]');
      if (topAct) {
        const act = topAct.dataset.dstAction;
        if (act === 'mute') {
          audio.toggleMute();
          syncHudOnly();
        } else if (act === 'reset') {
          resetAuditProgress();
        } else if (act === 'fs') {
          toggleFullscreenMode();
        } else if (act === 'close') {
          cleanupFx();
          audio.destroy();
          ctx.onCloseModal?.();
        }
        return;
      }

      // COVER ACTIONS
      if (e.target.closest('#dst-btn-start-adventure')) {
        audio.startMusic('overture');
        audio.normanHorn();
        state.completedSteps.add('cover');
        goToStep('beat0');
        audio.playVoice('cover_welcome');
        return;
      }

      if (e.target.closest('#dst-cover-bennet')) {
        audio.startMusic('overture');
        audio.mudSquelch();
        state.coverSecretsFound.add('bennet');
        setSpeech(
          'bennet',
          'Bennet Luvet • Fareham Creek Mud',
          'Oi! Press the big shiny start button already! My toes went numb in this freezing Fareham mud twenty minutes ago, and this seagull is eyeing my turnip!',
          'cover_bennet_poke',
        );
        syncHudOnly();
        activeFx?.burst(24, 69, 'mud');
        return;
      }

      if (e.target.closest('#dst-cover-gull')) {
        audio.startMusic('overture');
        audio.seagullSquawk();
        state.coverSecretsFound.add('gull');
        setSpeech(
          'bennet',
          'Bennet Luvet vs. Solent Seagull',
          'Shoo, you thieving Solent gull! That’s my only turnip for the winter—go peck the Norman clerk’s shiny boots instead!',
          'cover_gull_squawk',
        );
        syncHudOnly();
        activeFx?.burst(9.5, 23, 'seagull');
        return;
      }

      if (e.target.closest('#dst-cover-pigs')) {
        audio.startMusic('overture');
        audio.pigOink();
        state.coverSecretsFound.add('pigs');
        setSpeech(
          'odo',
          'Sweating Reeve Odo • Crate of Hogs',
          'Nothing inside this crate, my Lord! Definitely NOT thirteen fat Fareham woodland pigs! Stop poking the lid before they oink!',
          'cover_odo_pigs',
        );
        syncHudOnly();
        activeFx?.burst(61, 74, 'gold');
        return;
      }

      if (e.target.closest('#dst-cover-quill')) {
        audio.startMusic('overture');
        audio.boing();
        state.coverSecretsFound.add('quill');
        setSpeech('guy', 'Sir Guy de Rouen', 'Careful—this goose-quill is sharper than a Norman broadsword and twice as expensive!', 'beat2_guy_haircut');
        syncHudOnly();
        activeFx?.burst(74, 28, 'gold');
        return;
      }

      if (e.target.closest('#dst-cover-edith')) {
        audio.startMusic('overture');
        state.coverSecretsFound.add('edith');
        setSpeech('edith', 'Edith of Stubbington', 'Wait till Stage 5—I’ve got a bone to pick with that French clerk’s headcount!', 'beat4_edith_door');
        syncHudOnly();
        activeFx?.burst(88, 65, 'gold');
        return;
      }

      // BEAT 0: SWAMP REWIND
      const pinEl = e.target.closest('.solent-home-pin, [data-pick-pin]');
      if (pinEl) {
        const pinId = pinEl.dataset.pinId || pinEl.dataset.pickPin;
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
        return;
      }

      if (e.target.closest('#dst-btn-rewind')) {
        state.rewound1086 = true;
        state.score += 50;
        const pin = data.modernPins.find((p) => p.id === state.selectedPinId);
        if (pin) {
          if (!pin.existed1086) {
            audio.mudSquelch();
            setSpeech('guy', 'Sir Guy de Rouen • Royal Clerk', pin.verdict, 'beat0_swamp_splash');
          } else {
            audio.chimeSuccess();
            setSpeech('guy', 'Sir Guy de Rouen • Royal Clerk', pin.verdict, 'beat0_survived_village');
          }
        }
        render();
        return;
      }

      if (e.target.closest('#dst-btn-peek-swamp')) {
        state.peekSwampAnyway = true;
        audio.mudSquelch();
        setSpeech('bennet', 'Bennet Luvet • Gosport Marsh', 'Welcome to 1086 Gosport—bring your wellies!', 'beat0_bennet_swamp');
        render();
        return;
      }

      if (e.target.closest('#dst-swamp-bennet')) {
        if (!state.bennetSightings.has('swamp')) state.score += 40;
        state.bennetSightings.add('swamp');
        audio.mudSquelch();
        setSpeech(
          'bennet',
          'Bennet Luvet ("Boggy Bennet") • Gosport Salt-Marsh',
          'Lovely bit of swamp, this! Zero roads, zero shops, pouring sideways rain... stick a ferry here in nine hundred years, maybe it’ll catch on!',
          'beat0_bennet_swamp',
        );
        syncCurrentStagePanelsInPlace();
        activeFx?.burst(56, 55, 'mud');
        return;
      }

      if (e.target.closest('#dst-swamp-gull')) {
        state.swampSecretsFound.add('gull');
        audio.seagullSquawk();
        setSpeech(
          'bennet',
          'Bennet Luvet vs. Solent Marsh Gull',
          'Shoo, you thieving Solent gull! In 1086, seagulls outnumber humans on the Gosport shore five hundred to one!',
          'cover_gull_squawk',
        );
        syncCurrentStagePanelsInPlace();
        activeFx?.burst(83, 18, 'seagull');
        return;
      }

      if (e.target.closest('#dst-swamp-mill')) {
        state.swampSecretsFound.add('mill');
        audio.waterwheelSplash();
        setSpeech('guy', 'Distant Fareham Watermill', 'Look up-creek—while Gosport is empty marsh, Fareham already has FIVE booming watermills!');
        syncCurrentStagePanelsInPlace();
        activeFx?.burst(20, 38, 'wheel');
        return;
      }

      if (e.target.closest('#dst-swamp-torch')) {
        state.swampSecretsFound.add('torch');
        audio.waxSealSlam();
        setSpeech('bennet', '1086 Iron Pitch-Torch', 'Resin-soaked pine tow burning in a hand-forged iron ring—zero glass streetlamps in 1086!');
        syncCurrentStagePanelsInPlace();
        activeFx?.burst(78, 49, 'gold');
        return;
      }

      // BEAT 1: FAREHAM HUNT & GYRTH SERVI
      if (e.target.closest('#dst-b1-tab-hunt')) {
        state.beat1SubMode = 'hunt';
        audio.setMode('overture');
        render();
        return;
      }

      if (e.target.closest('#dst-b1-tab-servi, #dst-btn-open-servi')) {
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
        return;
      }

      if (e.target.closest('#dst-btn-hear-gyrth')) {
        setSpeech(
          'gyrth',
          'Gyrth • Enslaved Ploughman in Fareham',
          'The Bishop’s scribe wrote all ten of us down on the parchment right beside the plough-oxen. In 1086 Fareham, enslaved workers own no land, and we cannot leave.',
          'beat1_gyrth_servi',
        );
        syncCurrentStagePanelsInPlace();
        return;
      }

      const serviSpot = e.target.closest('[data-servi-spot]');
      if (serviSpot) {
        const s = serviSpot.dataset.serviSpot;
        state.farehamExtrasFound.add(s);
        if (s === 'oxen') {
          setSpeech('gyrth', 'Eight-Ox Heavy Plough', 'Fareham had land for 20 ploughs—6 plough teams on the Bishop’s home farm worked directly by the 10 enslaved labourers.');
        } else {
          setSpeech('guy', 'Norman Bailiff on the Ridge', 'Bishop Walkelin’s Norman officials oversaw every bushel of grain harvested from Fareham’s fields.');
        }
        syncCurrentStagePanelsInPlace();
        return;
      }

      const b1Spot = e.target.closest('[data-b1-spot]');
      if (b1Spot) {
        const sp = b1Spot.dataset.b1Spot;
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
            state.foundFarehamAssets.size >= 3 ? 'beat1_mills_caught' : 'beat1_mills_spot',
          );
          activeFx?.burst(64, 40, 'wheel');
        } else if (sp === 'pigs') {
          if (!state.foundFarehamAssets.has('pigs')) state.score += 60;
          state.foundFarehamAssets.add('pigs');
          audio.pigOink();
          setSpeech(
            'odo',
            'Caught! Woodland for 13 Pigs!',
            'Mercy! Thirteen fat hogs rooting for acorns in the Bishop’s oak woods—even a peasant’s pig tax goes straight into King William’s book!',
            state.foundFarehamAssets.size >= 3 ? 'beat1_mills_caught' : 'beat1_pigs_spot',
          );
        } else if (sp === 'church_meadow') {
          if (!state.foundFarehamAssets.has('church_meadow')) state.score += 60;
          state.foundFarehamAssets.add('church_meadow');
          audio.chimeSuccess();
          setSpeech(
            'guy',
            'Caught! 1 Church, 90 Households & 41 Meadow Acres!',
            'Got him! With 90 households and 41 acres of prime hay-meadow, Fareham ranks in the largest 20% of towns in 1086 England!',
            state.foundFarehamAssets.size >= 3 ? 'beat1_mills_caught' : 'beat1_church_spot',
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
            'Bennet Luvet • Hiding Under the Riverbank!',
            'Don’t look at me, squire! One wormy turnip, zero oxen, zero land—even the King’s nosy clerks won’t waste good ink on Bennet Luvet!',
            'beat1_bennet_creek',
          );
          activeFx?.burst(8.5, 85, 'mud');
        }
        syncCurrentStagePanelsInPlace();
        return;
      }

      // BEAT 2: INTERACTIVE 3-MISSION MAP HUNT
      const b2StepBtn = e.target.closest('[data-b2-step]');
      if (b2StepBtn) {
        state.b2MissionIdx = Number(b2StepBtn.dataset.b2Step);
        syncCurrentStagePanelsInPlace();
        return;
      }

      const b2M1Btn = e.target.closest('[data-b2-m1]');
      if (b2M1Btn) {
        if (b2M1Btn.dataset.b2M1 === 'zero') {
          if (!state.b2Solved.has('m1')) state.score += 75;
          state.b2Solved.add('m1');
          state.xraySplitPct = Math.max(state.xraySplitPct, 88);
          audio.chimeSuccess();
          setSpeech('hugh', 'Sheriff Hugh of Port', 'Every single English landowner around Fareham and Stubbington was swept away after 1066!', 'beat2_hugh_boast');
          syncXraySvgSplitInPlace(state.xraySplitPct);
        } else {
          audio.mudSquelch();
          setSpeech('guy', 'Sir Guy de Rouen', 'Look closer! Slide the bar all the way to 1086—not one private Saxon lord survived!');
        }
        syncCurrentStagePanelsInPlace();
        return;
      }

      const manorNode = e.target.closest('.solent-manor-node');
      if (manorNode) {
        e.stopPropagation();
        const mId = manorNode.dataset.manorId;
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
        syncCurrentStagePanelsInPlace();
        return;
      }

      const b2M3Btn = e.target.closest('[data-b2-m3]');
      if (b2M3Btn) {
        if (b2M3Btn.dataset.b2M3 === 'army') {
          if (!state.b2Solved.has('m3')) state.score += 75;
          state.b2Solved.add('m3');
          audio.chimeSuccess();
          setSpeech('monk', 'Brother Aldwin', 'Exactly—Domesday’s middle value ("when acquired") exposes the trail of destruction left by William’s marching troops!');
        } else {
          audio.mudSquelch();
          setSpeech('guy', 'Sir Guy de Rouen', 'Portsmouth didn’t even exist yet! Think about what an invading Norman army did to local farms!');
        }
        syncCurrentStagePanelsInPlace();
        return;
      }

      if (e.target.closest('#dst-btn-ghost-toggle')) {
        state.showModernGhost = !state.showModernGhost;
        syncCurrentStagePanelsInPlace();
        return;
      }

      if (e.target.closest('#dst-btn-haircut-gag')) {
        audio.boing();
        setSpeech(
          'guy',
          'Sir Guy de Rouen • Offended Norman',
          'Hands off the razor-nick! Shaving the back of one’s neck up to the ears is peak 1086 Norman fashion!',
          'beat2_guy_haircut',
        );
        syncHudOnly();
        return;
      }

      // BEAT 3: ROYAL ASSIZE
      const assizeSpot = e.target.closest('[data-assize-spot]');
      if (assizeSpot) {
        const sp = assizeSpot.dataset.assizeSpot;
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
            'beat3_bishop_bailiff',
          );
        }
        syncCurrentStagePanelsInPlace();
        return;
      }

      const vikBtn = e.target.closest('[data-pick-vikings]');
      if (vikBtn) {
        state.rulingVikings = vikBtn.dataset.pickVikings;
        syncCurrentStagePanelsInPlace();
        return;
      }

      const bishBtn = e.target.closest('[data-pick-bishop]');
      if (bishBtn) {
        state.rulingBishop = bishBtn.dataset.pickBishop;
        syncCurrentStagePanelsInPlace();
        return;
      }

      const gavelBtn = e.target.closest('#dst-btn-slam-gavel');
      if (gavelBtn && !gavelBtn.disabled) {
        state.assizeVerdictRevealed = true;
        state.score += 120;
        audio.waxSealSlam();
        setSpeech(
          'monk',
          'Real 1086 Domesday Parchment Verdict',
          'Astonishingly, King William’s real Commissioners KEPT Fareham’s 20-hide Viking discount—and publicly shamed the Bishop in writing: "it pays £20, but it cannot bear it"!',
          'beat3_real_verdict',
        );
        syncCurrentStagePanelsInPlace();
        return;
      }

      // BEAT 4: STUBBINGTON HUT PEOPLE-COUNTER & SPYGLASS
      const b4TabBtn = e.target.closest('[data-b4-tab]');
      if (b4TabBtn) {
        state.beat4Tab = b4TabBtn.dataset.b4Tab;
        render();
        return;
      }

      const b4Spot = e.target.closest('[data-b4-spot]');
      if (b4Spot) {
        const sp = b4Spot.dataset.b4Spot;
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
            'Count ’em yourself! One toddler by the pot, two sharing pottage, and two stacking logs! Zero children are listed anywhere in your Domesday Book!',
            'beat4_five_kids',
          );
        } else if (sp === 'grandma') {
          if (!state.hutPeopleGroups.has('grandma')) state.score += 50;
          state.hutPeopleGroups.add('grandma');
          state.foundBlindSpots.add('edith_family');
          audio.chimeSuccess();
          setSpeech(
            'edith',
            'Grandma Spinning Wool • +1 Invisible Elder Found!',
            'Grandma remembers Viking ships in the Solent under King Cnut—yet because she doesn’t pay geld tax, Domesday pretends she isn’t even here!',
            'beat4_grandma',
          );
        } else if (sp === 'untaxed_pets' || sp === 'rafter_hens') {
          if (!state.foundBlindSpots.has('untaxed_pets')) state.score += 60;
          state.foundBlindSpots.add('untaxed_pets');
          audio.chickenBawk();
          setSpeech(
            'guy',
            'Untaxed Farm Dog & Rafter Hens',
            'Brother Aldwin exaggerated! Royal scribes ignored farm dogs, cottage hens, and turnip patches because King William couldn’t squeeze silver tax out of them!',
            'beat4_pets',
          );
        } else if (sp === 'stumps_bennet') {
          if (!state.bennetSightings.has('stumps')) state.score += 50;
          state.bennetSightings.add('stumps');
          audio.mudSquelch();
          setSpeech(
            'bennet',
            'Bennet Luvet • Behind a Stubbington Tree-Stump!',
            'Psst! "Stubitone" literally means Tree-Stump Farm! Still zero oxen, still hugging my wormy turnip, and still worth £0 0s 0d to the King!',
            'beat4_bennet_stump',
          );
        }
        syncCurrentStagePanelsInPlace();
        return;
      }

      const bsNode = e.target.closest('.solent-blindspot-node');
      if (bsNode) {
        const id = bsNode.dataset.bsId;
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
        syncCurrentStagePanelsInPlace();
        return;
      }

      // BEAT 5: STUBITONE PARCHMENT 3-CLUE CODE-BREAKER, STAMP QUIZ & DEBRIEF
      const b5ClueBtn = e.target.closest('[data-b5-clue]');
      if (b5ClueBtn) {
        state.b5ClueStep = Number(b5ClueBtn.dataset.b5Clue);
        state.b5WrongChunkIdx = -1;
        syncCurrentStagePanelsInPlace();
        return;
      }

      const chunkRow = e.target.closest('[data-chunk-idx]');
      if (chunkRow) {
        const idx = Number(chunkRow.dataset.chunkIdx);
        state.activeChunkIdx = idx;
        const curMission = LATIN_CLUE_MISSIONS[state.b5ClueStep];
        if (curMission && !state.b5SolvedClues.has(curMission.id)) {
          if (idx === curMission.targetIdx) {
            state.b5SolvedClues.add(curMission.id);
            state.b5WrongChunkIdx = -1;
            state.score += 65;
            if (state.b5SolvedClues.size >= 3) {
              audio.waxSealSlam();
              setSpeech(
                'monk',
                'Folio 46v Master Code-Breaker! 🏆',
                'Magnificent! You cracked all three real 1086 Latin lines for Stubbington—now stamp the 3 quick Fact-vs-Invention checks below!',
              );
            } else {
              audio.chimeSuccess();
              setSpeech('guy', `Line ${idx + 1} Cracked!`, curMission.solvedNote);
              const nextUnsolved = LATIN_CLUE_MISSIONS.findIndex((m) => !state.b5SolvedClues.has(m.id));
              if (nextUnsolved >= 0) state.b5ClueStep = nextUnsolved;
            }
          } else {
            state.b5WrongChunkIdx = idx;
            audio.mudSquelch();
            setSpeech('guy', `Line ${idx + 1} Inspected — Keep Hunting!`, curMission.hintWrong);
          }
        } else {
          audio.chimeSuccess();
        }
        syncCurrentStagePanelsInPlace();
        return;
      }

      const stampBtn = e.target.closest('[data-stamp-id]');
      if (stampBtn) {
        const sId = stampBtn.dataset.stampId;
        const val = stampBtn.dataset.stampVal === 'true';
        const item = STAMP_CHALLENGES.find((x) => x.id === sId);
        if (!item) return;
        if (state.stampAnswers[sId] === undefined && val === item.isReal) {
          state.score += 50;
          audio.waxSealSlam();
        } else {
          audio.mudSquelch();
        }
        state.stampAnswers[sId] = val;
        syncCurrentStagePanelsInPlace();
        return;
      }

      const bounty1Btn = e.target.closest('[data-bounty1]');
      if (bounty1Btn) {
        const val = bounty1Btn.dataset.bounty1;
        if (state.archiveBounty1 !== 'small40' && val === 'small40') {
          state.score += 75;
          audio.chimeSuccess();
        } else if (val !== 'small40') {
          audio.mudSquelch();
        }
        state.archiveBounty1 = val;
        if (state.archiveBounty1 === 'small40' && state.archiveBounty2 === 'meon') {
          audio.waxSealSlam();
          setSpeech(
            'guy',
            'Master Archivist of Titchfield Hundred! 🏅',
            'First-class archival detective work! You verified both Stubbington and tiny 2-household Meon straight from the 1086 Open Domesday record!',
          );
        }
        syncCurrentStagePanelsInPlace();
        return;
      }

      const bounty2Btn = e.target.closest('[data-bounty2]');
      if (bounty2Btn) {
        const val = bounty2Btn.dataset.bounty2;
        if (state.archiveBounty2 !== 'meon' && val === 'meon') {
          state.score += 75;
          audio.chimeSuccess();
        } else if (val !== 'meon') {
          audio.mudSquelch();
        }
        state.archiveBounty2 = val;
        if (state.archiveBounty1 === 'small40' && state.archiveBounty2 === 'meon') {
          audio.waxSealSlam();
          setSpeech(
            'guy',
            'Master Archivist of Titchfield Hundred! 🏅',
            'First-class archival detective work! You verified both Stubbington and tiny 2-household Meon straight from the 1086 Open Domesday record!',
          );
        }
        syncCurrentStagePanelsInPlace();
        return;
      }

      if (e.target.closest('#dst-btn-hear-debrief')) {
        setSpeech(
          'guy',
          'Historian Final Summary • Fact vs. Comedy',
          'Every village figure you just investigated comes straight from the real 1086 Domesday Book—while characters like Bennet, Edith, and Odo give voice to the nameless locals whom King William’s taxmen never named.',
          'beat5_debrief_historian',
        );
        syncHudOnly();
      }
    });
  }

  render({ isStepNavigation: true });
  loadDomesdayData()
    .then((json) => {
      data = json;
      preloadUpcomingStageAssets(state.step);
      render({ isStepNavigation: true });
    })
    .catch((err) => {
      if (stageEl.isConnected) {
        stageEl.innerHTML = `<div class="dst-shell" style="padding:28px;color:#fca5a5;">Failed to load 1086 Domesday archive: ${err.message}</div>`;
      }
    });

  return () => {
    unmounted = true;
    if (typeof document !== 'undefined') {
      document.removeEventListener('fullscreenchange', onBrowserFsChange);
    }
    if (shimmerTimeout) clearTimeout(shimmerTimeout);
    cleanupFx();
    audio.destroy();
  };
}
