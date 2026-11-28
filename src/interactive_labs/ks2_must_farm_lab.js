/**
 * EMBERS OVER THE FEN: The Must Farm Bronze Age Detective Lab (c. 850 BC)
 * Target Lesson Hook: `ks2_stone_to_iron_age:lesson_5:2` (Enquiry 5: "Britain's Pompeii" — Must Farm)
 *
 * 5 Interactive Stages:
 *  - Stage 1: Step Inside the Stilted Roundhouse (4 roof/floor architectural zones)
 *  - Stage 2: The Sudden Fire and Waterlogged Time Capsule (3-phase preservation simulator + dry-soil comparison)
 *  - Stage 3: Excavate the Trench Grid (6-tile dig uncovering real Must Farm organic & bronze artefacts)
 *  - Stage 4: Trade Clues Sorter (Sort Must Farm finds into Local Fenland Craft vs Overseas Trade Networks)
 *  - Stage 5: Chief Archaeologist's Report and Junior Archaeologist Detective Certificate
 */

import './ks2_story_labs.css';
import {
  isCoarseTouchUI,
  createScrollLockManager,
  createSessionPersistence,
  createStageAssetPreloader,
  bindNativeFullscreenSync,
} from './story_lab_engine.js';
import { saveArcadePersonalBest } from '../arcade/arcade_audio.js';
import {
  renderEscapeBrandBarHTML,
  renderEscapeCoverSealHTML,
  renderAtmosphericCinemaHTML,
  renderWorkbookCodeCardHTML,
  createEscapeCinemaVoicePlayer,
} from './escape_room_brand.js';

const SESSION_KEY = 'hh_ks2_must_farm_lab_v1';
const UNIT_ID = 'ks2_stone_to_iron_age';
const LAB_ID = 'ks2_must_farm_lab';

const ASSETS = {
  digSite: '/units/ks2_stone_to_iron_age/assets/must_farm_stilt_village_dig.jpg',
  roundhouse: '/units/ks2_stone_to_iron_age/assets/flag_fen_bronze_age_roundhouse.jpg',
  storagePot: '/units/ks2_stone_to_iron_age/assets/must_farm_charred_storage_pot.jpg',
  eelTrap: '/units/ks2_stone_to_iron_age/assets/must_farm_wicker_eel_trap.jpg',
  bronzeAxes: '/units/ks2_stone_to_iron_age/assets/flag_fen_bronze_axes_spearhead.jpg',
  doverBoat: '/units/ks2_stone_to_iron_age/assets/dover_bronze_age_oak_boat.jpg',
};

const preloadStageAssets = createStageAssetPreloader({
  cover: [ASSETS.digSite, ASSETS.roundhouse],
  stage1: [ASSETS.roundhouse, ASSETS.storagePot],
  stage2: [ASSETS.storagePot, ASSETS.eelTrap, ASSETS.bronzeAxes],
  stage3: [ASSETS.eelTrap, ASSETS.bronzeAxes, ASSETS.doverBoat],
  stage4: [ASSETS.doverBoat, ASSETS.digSite],
  stage5: [ASSETS.digSite],
});

const STEPS = [
  { id: 'cover', short: '🔥 Cover', mob: 'Cover • Must Farm' },
  { id: 'prologue', short: '🎬 Opening', mob: '🎬 Opening' },
  { id: 'stage1', short: '1. Stilt House', mob: '1/5 Stilt House' },
  { id: 'stage2', short: '2. Wet Mud Seal', mob: '2/5 Wet Mud Seal' },
  { id: 'stage3', short: '3. Dig Trench', mob: '3/5 Dig Trench' },
  { id: 'stage4', short: '4. Trade Sorter', mob: '4/5 Trade Sorter' },
  { id: 'stage5', short: '5. Field Report', mob: '5/5 Field Report' },
  { id: 'epilogue', short: '🎬 Ending', mob: '🎬 Ending' },
];

const MUST_FARM_PROLOGUE = [
  {
    voClip: 'mustfarm_pro_1',
    credit: 'THE HISTORY REVISION HUB PRESENTS • CAMBRIDGESHIRE FENS, c. 850 BC',
    heading: 'Houses Above the Slow River',
    img: ASSETS.roundhouse,
    alt: 'Reconstructed Bronze Age circular roundhouse with conical reed roof and woven wattle walls',
    caption: 'Bronze Age Fenland Architecture • Circular timber homes built on oak stilts two metres above a freshwater channel',
    narration:
      'Nearly three thousand years ago, Bronze Age families built a ring of sturdy oak-stilted roundhouses above a reed-lined river—catching eels below their floorboards and trading by dug-out boat.',
  },
  {
    voClip: 'mustfarm_pro_2',
    credit: 'SUDDEN FIRE • BRITAIN’S POMPEII FROZEN IN TIME',
    heading: 'Plunged Into Oxygen-Free Mud',
    img: ASSETS.digSite,
    alt: 'Must Farm excavation trench showing fallen Bronze Age roundhouse rafters preserved in wet river silt',
    caption: 'Must Farm Excavation • Every villager escaped safely, leaving pots, wheels, and porridge sealed in wet mud',
    narration:
      'Less than a year later, sparks caught the dry reed roofs! Everyone escaped alive, and their collapsing homes plunged into wet river silt—locking out oxygen and preserving Britain’s greatest Bronze Age time capsule!',
  },
];

const MUST_FARM_EPILOGUE = [
  {
    voClip: 'mustfarm_end_1',
    credit: 'FINALE SCENE 1 OF 2 • BRITAIN’S POMPEII UNLOCKED',
    heading: 'Three Thousand Years Without Oxygen',
    img: ASSETS.storagePot,
    alt: 'Charred Must Farm Bronze Age pottery vessel preserved in Cambridgeshire silt',
    caption: 'Must Farm Finds • Bowls still holding grain porridge, wooden spoons, woven lime-bast cloth, and Britain’s oldest wheel',
    narration:
      'Because waterlogged Fenland mud shut out oxygen and bacteria, fragile organic treasures that rot in dry soil survived almost untouched for thirty centuries!',
  },
  {
    voClip: 'mustfarm_end_2',
    credit: 'FINALE SCENE 2 OF 2 • REWRITING PREHISTORIC BRITAIN',
    heading: 'Connected Across the Sea',
    img: ASSETS.doverBoat,
    alt: 'Dover Bronze Age oak plank boat used for cross-Channel trade',
    caption: 'Cross-Channel Networks • Glass beads and bronze metalwork linked Fenland families to Europe and the Mediterranean',
    narration:
      'Must Farm proved that Bronze Age Britons were skilled engineers, carpenters, weavers, and international traders connected across the English Channel and beyond!',
  },
];

const ROUNDHOUSE_ZONES = [
  {
    id: 'thatch',
    label: 'Reed Thatch Roof',
    icon: '🌾',
    speaker: 'Dr Maya Patel • Fenland Wetland Archaeologist',
    quote:
      'Thick bundles of river reeds, straw, and turf shed heavy Cambridgeshire rain while letting warm smoke from the clay hearth seep gently out.',
    detailTitle: 'Waterproof Fenland Reed Thatch',
    detailText:
      'Cut straight from the riverside reed-beds, tight bundles of thatch kept families warm in winter and dry during storms.',
  },
  {
    id: 'rafters',
    label: 'Ash Roof Rafters',
    icon: '🪵',
    speaker: 'Bryn • Bronze Age Carpenter (c. 850 BC)',
    quote:
      'Look up! Straight ash poles fan out like bicycle spokes from our central oak ring-beam, with smoked meat and herb bundles hanging safely from the rafters.',
    detailTitle: 'Radiating Split-Ash Rafters',
    detailText:
      'Long ash rafters met at the roof peak like wheel spokes. Families hung joints of lamb and woven baskets high above the floor.',
  },
  {
    id: 'wattle',
    label: 'Woven Wattle Walls',
    icon: '🧺',
    speaker: 'Bryn • Bronze Age Carpenter (c. 850 BC)',
    quote:
      'We wove bendy hazel and willow rods in and out of upright posts to block chilly winds, storing cooking pots around the bright south-east doorway.',
    detailTitle: 'Woven Wattle Hurdle Walls',
    detailText:
      'Inside the circular wall, families organized distinct zones: sleeping furs on one side, loom weights for weaving, and clay cooking pots near the hearth.',
  },
  {
    id: 'silt',
    label: 'Oak Stilts and River Silt',
    icon: '🌊',
    speaker: 'Dr Maya Patel • Fenland Wetland Archaeologist',
    quote:
      'Sturdy oak stilts held the wooden floor two metres above a slow, freshwater river channel where willow traps caught eels right beneath the house!',
    detailTitle: 'Oak Stilts in Slow River Silt',
    detailText:
      'Sharpened oak posts were driven deep into soft river silt. Living over water gave families fresh fish, reed beds, and a natural boat highway.',
  },
];

const FIRE_PHASES = [
  {
    id: 'spark',
    stepNum: 1,
    title: 'Phase 1: Sparks Catch the Dry Reed Roof',
    summary:
      'Around 850 BC—less than a year after the village was built—a fierce fire raced across the dry reed roofs. Families escaped safely, leaving pots and tools behind.',
    speech:
      'Everyone got out safely—not a single human skeleton from the fire was found! Yet inside the houses, bowls of hot grain porridge were left mid-meal.',
  },
  {
    id: 'plunge',
    stepNum: 2,
    title: 'Phase 2: Charred Timbers Plunge Into the River',
    summary:
      'As the oak stilts burned at waterline level, whole roundhouse floors, roofs, pots, and looms dropped straight down into the cool, slow river below.',
    speech:
      'Splash! Cold river water quenched the flames immediately, so charred wooden wheels, axe handles, and cloth did not burn to ash—they sank in neat household heaps!',
  },
  {
    id: 'capsule',
    stepNum: 3,
    title: 'Phase 3: Waterlogged Mud Locks Out Oxygen',
    summary:
      'Thick, wet river mud quickly blanketed the sunken village. Because waterlogged mud holds zero air, the tiny rot-microbes that eat wood and cloth could not survive!',
    speech:
      'On dry land, air lets microbes rot wood and cloth within years. At Must Farm, thick waterlogged fen mud sealed everything in a 3,000-year time capsule!',
  },
];

const TRENCH_FINDS = [
  {
    id: 'wheel',
    coord: 'Square A1',
    name: 'Complete 1m Wooden Wheel',
    icon: '🛞',
    plate: ASSETS.digSite,
    plateCaption:
      'Must Farm excavation shelter in Cambridgeshire, where archaeologists uncovered house timbers and a complete one-metre wooden wheel from wet silt.',
    summary:
      'Made from three joined ash planks reinforced with oak battens around a central hub—Britain’s earliest complete wheel (c. 850 BC), proving villagers drove carts on dry farmland nearby!',
  },
  {
    id: 'axe',
    coord: 'Square A2',
    name: 'Socketed Bronze Axe and Handle',
    icon: '🪓',
    plate: ASSETS.bronzeAxes,
    plateCaption:
      'Bronze Age cast axeheads and a socketed spearhead from the Flag Fen and Whittlesey basin in Peterborough Museum.',
    summary:
      'A hollow-ended bronze socketed axehead still fitted onto its two-piece oak handle, designed so carpenters could swap different bronze blades onto one haft!',
  },
  {
    id: 'textile',
    coord: 'Square A3',
    name: 'Lime-Bast Plant-Fibre Cloth',
    icon: '🧵',
    plate: ASSETS.digSite,
    plateCaption:
      'Wet mud inside the Must Farm trench preserved delicate wound bobbins of thread and finely woven plant-fibre cloth.',
    summary:
      'Ultra-fine threads spun from flax and inner lime-tree bark (lime bast), woven into soft clothing finer than many modern linens!',
  },
  {
    id: 'beads',
    coord: 'Square B1',
    name: 'Mediterranean Glass Beads',
    icon: '📿',
    plate: ASSETS.doverBoat,
    plateCaption:
      'The Dover Bronze Age Boat at Dover Museum—thick oak planks stitched with twisted yew branches that carried overseas trade across the Channel.',
    summary:
      'Tiny turquoise and dark glass beads crafted in workshops around the eastern Mediterranean and Middle East, traded hand-to-hand across Europe into Cambridgeshire!',
  },
  {
    id: 'porridge',
    coord: 'Square B2',
    name: 'Porridge Bowl and Spatula',
    icon: '🥣',
    plate: ASSETS.storagePot,
    plateCaption:
      'Reconstructed Must Farm pottery vessel (MUS06 913) showing fire scorch marks from the blaze that sank the stilt settlement.',
    summary:
      'A bowl still holding charred wheat grain porridge enriched with animal fat, with a carved wooden stirring spatula resting right inside when the fire started!',
  },
  {
    id: 'eeltrap',
    coord: 'Square B3',
    name: 'Woven Willow Eel Trap',
    icon: '🐟',
    plate: ASSETS.eelTrap,
    plateCaption:
      'Cone-shaped woven willow fish and eel trap preserved for 3,000 years in the waterlogged mud beneath Must Farm.',
    summary:
      'Bendy willow twigs woven into a clever one-way funnel basket dropped beneath the floorboards to catch silver eels and pike swimming along the river!',
  },
];

const TRADE_ITEMS = [
  {
    id: 't_eel',
    name: 'Woven Willow Eel Trap',
    clue: 'Twigs cut from riverside willow trees growing along the Cambridgeshire channel.',
    bucket: 'local',
    explain: 'Made locally! Fenland families harvested flexible willow osiers right beside their stilt houses.',
  },
  {
    id: 't_beads',
    name: 'Turquoise Glass Necklace Beads',
    clue: 'Chemical testing matches sand and plant-ash recipes from Mediterranean and Middle Eastern workshops.',
    bucket: 'overseas',
    explain: 'Traded across overseas networks! Exotic glass beads travelled thousands of miles across rivers and the English Channel.',
  },
  {
    id: 't_wheel',
    name: 'One-Metre Ash and Oak Cart Wheel',
    clue: 'Carved from local woodland ash planks and oak battens using bronze woodworking chisels.',
    bucket: 'local',
    explain: 'Made locally! Skilled local wheelwrights shaped ash and oak cut from nearby Cambridgeshire woods.',
  },
  {
    id: 't_bronze',
    name: 'Cast Bronze Socketed Axe Metal',
    clue: 'Cambridgeshire mud has zero copper or tin mines—ingots arrived from western Britain and continental Europe.',
    bucket: 'overseas',
    explain: 'Long-distance trade! Copper and tin had to be mined far away and traded along rivers and sewn-plank sea boats.',
  },
  {
    id: 't_thatch',
    name: 'Reed Thatch and Wattle Hurdles',
    clue: 'Freshwater reeds and coppiced hazel rods gathered from surrounding marshes and woods.',
    bucket: 'local',
    explain: 'Made locally! Every roundhouse frame used local Fenland reeds, oak posts, and coppiced hazel.',
  },
  {
    id: 't_amber',
    name: 'Polished Golden Amber Bead',
    clue: 'Fossilised pine-tree resin washed up along distant Baltic and North Sea coastlines.',
    bucket: 'overseas',
    explain: 'Traded across sea networks! Golden Baltic amber was prized across Bronze Age Europe and exchanged alongside bronze.',
  },
];

const REPORT_QUESTIONS = [
  {
    id: 'rq1',
    question: '1. Why do archaeologists nickname Must Farm "Britain’s Pompeii" even though there was no volcano?',
    options: [
      {
        id: 'a',
        label: 'A sudden fire dropped everyday homes into waterlogged river mud, freezing a single moment in time.',
        correct: true,
      },
      {
        id: 'b',
        label: 'Roman emperors built stone villas with volcanic ash walls across Cambridgeshire.',
        correct: false,
      },
    ],
    feedback:
      'Spot-on! Like Pompeii, Must Farm preserves an entire lived-in household from one sudden day around 850 BC—sealed by wet river mud instead of volcanic ash.',
  },
  {
    id: 'rq2',
    question: '2. Why did wooden axe handles, plant-fibre cloth, and porridge survive for 3,000 years at Must Farm?',
    options: [
      {
        id: 'a',
        label: 'Dry sandy soil baked them hard in hot sunshine.',
        correct: false,
      },
      {
        id: 'b',
        label: 'Cool river water quenched the flames and thick, oxygen-free waterlogged mud stopped microbes rotting them.',
        correct: true,
      },
    ],
    feedback:
      'Exactly right! Without oxygen in the waterlogged silt, wood-rotting fungi and bacteria could not break down organic treasures.',
  },
  {
    id: 'rq3',
    question: '3. What does finding BOTH a willow eel trap AND a 1-metre wooden cart wheel at Must Farm prove?',
    options: [
      {
        id: 'a',
        label: 'Families cleverly used both the wet river (fishing) and dry farmland nearby (wheeled carts, wheat, and sheep).',
        correct: true,
      },
      {
        id: 'b',
        label: 'Villagers never stepped onto dry land and ate only raw river weeds.',
        correct: false,
      },
    ],
    feedback:
      'Brilliant detective work! Must Farm families combined river eels and pike with dryland wheat harvests, lamb, and wheeled transport.',
  },
  {
    id: 'rq4',
    question: '4. What do Must Farm’s tiny glass beads and the Dover sewn-plank oak boat reveal about Bronze Age Britain?',
    options: [
      {
        id: 'a',
        label: 'Bronze Age communities were completely cut off from the rest of the world.',
        correct: false,
      },
      {
        id: 'b',
        label: 'Skilled sailors and traders connected Britain to long-distance European and Mediterranean trade routes.',
        correct: true,
      },
    ],
    feedback:
      'Verified! Stitched oak boats crossed the English Channel carrying tin and bronze while exotic beads reached the Cambridgeshire Fens.',
  },
];

function createSoundAndSpeechController() {
  let audioCtx = null;
  let muted = false;

  function ensureAudio() {
    if (muted || typeof window === 'undefined') return null;
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function tone(freqStart, freqEnd, dur = 0.08, type = 'triangle', gainVal = 0.08, delay = 0) {
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, now);
      if (freqEnd !== freqStart) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(30, freqEnd), now + dur);
      }
      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.01);
    } catch (_) {}
  }

  function speak(text, forceUnmute = false) {
    if (forceUnmute && muted) muted = false;
    if (muted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = String(text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (!clean) return;
      const utter = new window.SpeechSynthesisUtterance(clean);
      utter.lang = 'en-GB';
      utter.rate = 0.98;
      utter.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices?.() || [];
      const gbVoice =
        voices.find((v) => /^en[-_]GB/i.test(v.lang) && /Libby|Sonia|Ryan|Google|Natural|Martha|Daniel/i.test(v.name)) ||
        voices.find((v) => /^en[-_]GB/i.test(v.lang)) ||
        voices.find((v) => /^en/i.test(v.lang));
      if (gbVoice) utter.voice = gbVoice;
      window.speechSynthesis.speak(utter);
    } catch (_) {}
  }

  function stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
  }

  return {
    get muted() {
      return muted;
    },
    toggleMute(currentText = '') {
      muted = !muted;
      if (muted) {
        stopSpeech();
      } else {
        tone(520, 680, 0.07, 'sine', 0.07);
        if (currentText) speak(currentText);
      }
      return muted;
    },
    click() {
      tone(440, 580, 0.05, 'sine', 0.06);
    },
    dig() {
      tone(240, 150, 0.08, 'triangle', 0.09);
      tone(580, 760, 0.07, 'sine', 0.06, 0.06);
    },
    success() {
      tone(523.25, 659.25, 0.09, 'triangle', 0.1, 0);
      tone(659.25, 880, 0.14, 'triangle', 0.11, 0.08);
    },
    warn() {
      tone(220, 155, 0.16, 'sawtooth', 0.08);
    },
    speak,
    stopSpeech,
    destroy() {
      stopSpeech();
      if (audioCtx) {
        try {
          audioCtx.close();
        } catch (_) {}
        audioCtx = null;
      }
    },
  };
}

function normalizeMountOpts(opts = {}, legacyCtx = {}) {
  const merged = {
    ...(opts && typeof opts === 'object' ? opts : {}),
    ...(legacyCtx && typeof legacyCtx === 'object' ? legacyCtx : {}),
  };
  return {
    preferFullscreen: Boolean(merged.preferFullscreen ?? merged.autoFullscreen ?? false),
    onClose: merged.onClose || merged.onCloseModal || null,
    onToggleWindowMode: merged.onToggleWindowMode || merged.onFullscreenChange || null,
  };
}

export function mountKs2MustFarmLab(container, opts = {}, legacyCtx = {}) {
  if (!container) return () => {};

  const mountCfg = normalizeMountOpts(opts, legacyCtx);
  const sound = createSoundAndSpeechController();
  const persistence = createSessionPersistence(SESSION_KEY);

  let shellEl = null;
  let unmounted = false;
  let resetArmTimer = null;

  const scrollLock = createScrollLockManager(() => shellEl);

  const state = {
    step: 'cover',
    isFullscreen: mountCfg.preferFullscreen,
    resetArmed: false,
    score: 0,
    speakerIcon: '🔥',
    speakerName: 'Dr Maya Patel • Fenland Wetland Archaeologist',
    speechText:
      'Welcome to Must Farm in Cambridgeshire! Around 850 BC, a sudden fire dropped wooden stilt houses into wet river mud, preserving a 3,000-year-old Bronze Age time capsule.',

    // Stage 1: Roundhouse zones + quick check
    zonesFound: new Set(),
    activeZoneId: 'thatch',
    stage1Check: null,

    // Stage 2: Fire & Waterlogged Mud Simulator
    firePhaseIdx: 0,
    phasesVisited: new Set(['spark']),
    soilCompareMode: 'waterlogged', // 'waterlogged' | 'dry'
    comparedBothSoils: false,

    // Stage 3: 6-Tile Trench Dig
    dugFinds: new Set(),
    selectedFindId: 'wheel',

    // Stage 4: Trade Clues Sorter
    tradeIdx: 0,
    sortedTradeIds: new Set(),
    tradeFeedback: '',
    tradeFeedbackWrong: false,

    // Stage 5: 4-Question Synthesis Report
    reportAnswers: {},
    reportCredited: new Set(),
    reportHadWrong: new Set(),
  };

  function hydrate() {
    const saved = persistence.load();
    if (!saved || typeof saved !== 'object') return;
    if (STEPS.some((s) => s.id === saved.step)) state.step = saved.step;
    if (typeof saved.score === 'number') state.score = saved.score;
    if (Array.isArray(saved.zonesFound)) state.zonesFound = new Set(saved.zonesFound);
    if (typeof saved.activeZoneId === 'string') state.activeZoneId = saved.activeZoneId;
    if (saved.stage1Check) state.stage1Check = saved.stage1Check;
    if (typeof saved.firePhaseIdx === 'number') state.firePhaseIdx = saved.firePhaseIdx;
    if (Array.isArray(saved.phasesVisited)) state.phasesVisited = new Set(saved.phasesVisited);
    if (saved.soilCompareMode === 'dry' || saved.soilCompareMode === 'waterlogged') {
      state.soilCompareMode = saved.soilCompareMode;
    }
    state.comparedBothSoils = Boolean(saved.comparedBothSoils);
    if (Array.isArray(saved.dugFinds)) state.dugFinds = new Set(saved.dugFinds);
    if (typeof saved.selectedFindId === 'string') state.selectedFindId = saved.selectedFindId;
    if (typeof saved.tradeIdx === 'number') state.tradeIdx = saved.tradeIdx;
    if (Array.isArray(saved.sortedTradeIds)) state.sortedTradeIds = new Set(saved.sortedTradeIds);
    if (saved.reportAnswers && typeof saved.reportAnswers === 'object') state.reportAnswers = saved.reportAnswers;
    if (Array.isArray(saved.reportCredited)) state.reportCredited = new Set(saved.reportCredited);
    if (Array.isArray(saved.reportHadWrong)) state.reportHadWrong = new Set(saved.reportHadWrong);
  }

  function save() {
    persistence.save({
      step: state.step,
      score: state.score,
      zonesFound: [...state.zonesFound],
      activeZoneId: state.activeZoneId,
      stage1Check: state.stage1Check,
      firePhaseIdx: state.firePhaseIdx,
      phasesVisited: [...state.phasesVisited],
      soilCompareMode: state.soilCompareMode,
      comparedBothSoils: state.comparedBothSoils,
      dugFinds: [...state.dugFinds],
      selectedFindId: state.selectedFindId,
      tradeIdx: state.tradeIdx,
      sortedTradeIds: [...state.sortedTradeIds],
      reportAnswers: state.reportAnswers,
      reportCredited: [...state.reportCredited],
      reportHadWrong: [...state.reportHadWrong],
    });
  }

  hydrate();

  const fsSync = bindNativeFullscreenSync({
    getShellEl: () => shellEl,
    onExternalExit: () => {
      if (state.isFullscreen) {
        state.isFullscreen = false;
        mountCfg.onToggleWindowMode?.(false);
        render(false);
      }
    },
  });

  function addScore(pts) {
    state.score += pts;
    saveArcadePersonalBest(UNIT_ID, LAB_ID, 'all', state.score);
  }

  function say(icon, speaker, quote, autoRead = false) {
    state.speakerIcon = icon;
    state.speakerName = speaker;
    state.speechText = quote;
    if (autoRead) sound.speak(quote);
  }

  function isStageComplete(stepId) {
    if (stepId === 'stage1') return state.zonesFound.size >= 4 && state.stage1Check === 'correct';
    if (stepId === 'stage2') return state.phasesVisited.size >= 3 && state.comparedBothSoils;
    if (stepId === 'stage3') return state.dugFinds.size >= 6;
    if (stepId === 'stage4') return state.sortedTradeIds.size >= TRADE_ITEMS.length;
    if (stepId === 'stage5') {
      return REPORT_QUESTIONS.every((q) => {
        const picked = state.reportAnswers[q.id];
        const opt = q.options.find((o) => o.id === picked);
        return Boolean(opt?.correct);
      });
    }
    return false;
  }

  function goToStep(nextStep) {
    if (!STEPS.some((s) => s.id === nextStep)) return;
    state.step = nextStep;
    state.resetArmed = false;

    if (nextStep === 'cover') {
      say(
        '🔥',
        'Dr Maya Patel • Fenland Wetland Archaeologist',
        'Welcome to Must Farm in Cambridgeshire! Press Begin Bronze Age Dig below to step inside a 3,000-year-old stilt village.',
      );
    } else if (nextStep === 'stage1') {
      say(
        '🪵',
        'Bryn • Bronze Age Carpenter (c. 850 BC)',
        isCoarseTouchUI()
          ? 'Tap all 4 parts of our stilted roundhouse to see how we lived right above a slow Cambridgeshire river!'
          : 'Click all 4 parts of our stilted roundhouse cutaway to explore how Bronze Age families built above the river!',
      );
    } else if (nextStep === 'stage2') {
      say(
        '🌊',
        'Dr Maya Patel • Fenland Wetland Archaeologist',
        'Trigger all 3 phases of the sudden fire, then switch between Waterlogged River Mud and Dry Land Soil to see why wood did not rot!',
      );
    } else if (nextStep === 'stage3') {
      say(
        '⛏️',
        'Dr Maya Patel • Trench Supervisor',
        'Pick up your wooden trowel! Excavate all 6 squares in the wet silt trench to uncover real Must Farm household treasures.',
      );
    } else if (nextStep === 'stage4') {
      say(
        '⛵',
        'Maelor • Bronze Age Channel Trader',
        'Did villagers make every item from local Fenland plants and wood, or trade across seas? Sort all 6 clues into the right basket!',
      );
    } else if (nextStep === 'stage5') {
      say(
        '🏅',
        'Dr Maya Patel • Chief Archaeologist’s Report',
        'Complete all 4 evidence checks below to earn and print your Junior Bronze Age Archaeologist Detective Certificate!',
      );
    }

    preloadStageAssets(nextStep);
    save();
    render(true);
  }

  function resetLab() {
    persistence.clear();
    state.step = 'cover';
    state.resetArmed = false;
    state.score = 0;
    state.zonesFound.clear();
    state.activeZoneId = 'thatch';
    state.stage1Check = null;
    state.firePhaseIdx = 0;
    state.phasesVisited = new Set(['spark']);
    state.soilCompareMode = 'waterlogged';
    state.comparedBothSoils = false;
    state.dugFinds.clear();
    state.selectedFindId = 'wheel';
    state.tradeIdx = 0;
    state.sortedTradeIds.clear();
    state.tradeFeedback = '';
    state.tradeFeedbackWrong = false;
    state.reportAnswers = {};
    state.reportCredited.clear();
    state.reportHadWrong.clear();
    say(
      '🔥',
      'Dr Maya Patel • Fenland Wetland Archaeologist',
      'Trench flags reset! Ready for a fresh archaeological investigation at Must Farm.',
    );
    render(true);
  }

  function openCertificateWindow() {
    if (typeof window === 'undefined') return;
    const win = window.open('', '_blank', 'width=860,height=640');
    if (!win) return;
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    win.document.write(`<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Junior Bronze Age Archaeologist Certificate</title>
<style>
  body { font-family: Georgia, serif; background: #f8fafc; margin: 0; padding: 28px; text-align: center; color: #0f172a; }
  .cert { max-width: 720px; margin: 0 auto; padding: 36px 40px; background: #fffbeb; border: 6px double #b45309; border-radius: 16px; }
  .kicker { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 1.4px; color: #92400e; text-transform: uppercase; }
  h1 { font-size: 28px; margin: 10px 0 6px; color: #1c1917; }
  .sub { font-size: 15px; color: #334155; margin-bottom: 18px; }
  .line { display: inline-block; width: 260px; border-bottom: 2px solid #334155; margin: 14px 0 4px; height: 24px; }
  .pills { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 18px 0 22px; font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
  .pill { padding: 5px 12px; border-radius: 999px; background: #dcfce7; border: 1px solid #16a34a; color: #14532d; }
  @media print { .no-print { display: none; } body { background: #fff; padding: 0; } }
</style></head><body>
  <div class="cert">
    <div class="kicker">The History Revision Hub • Key Stage 2 Prehistoric Britain (c. 850 BC)</div>
    <div style="font-size:44px;margin:8px 0;">🏺</div>
    <h1>Junior Bronze Age Archaeologist Badge</h1>
    <p class="sub">Awarded for excavating and analysing primary wetland evidence in <em>Embers Over the Fen: The Must Farm Detective Lab</em></p>
    <div><span class="line"></span><div style="font-size:12px;color:#475569;">Archaeologist’s Name</div></div>
    <div class="pills">
      <span class="pill">✓ Stilted Roundhouse Cutaway</span>
      <span class="pill">✓ Waterlogged Mud Preservation</span>
      <span class="pill">✓ 6/6 Must Farm Trench Finds</span>
      <span class="pill">✓ Fenland vs Overseas Trade</span>
      <span class="pill">✓ Score: ${state.score} pts</span>
    </div>
    <div style="font-size:13px;color:#475569;">Verified on ${dateStr} • The History Department</div>
    <div class="no-print" style="margin-top:20px;">
      <button onclick="window.print()" style="padding:10px 22px;font-weight:800;border-radius:8px;border:none;background:#d97706;color:#fff;cursor:pointer;">🖨️ Print / Save Certificate</button>
    </div>
  </div>
</body></html>`);
    win.document.close();
  }

  function renderRoundhouseCutawaySVG() {
    const active = state.activeZoneId;
    const isSel = (id) => (active === id ? '#fde047' : 'rgba(255,255,255,0.28)');
    const isDone = (id) => (state.zonesFound.has(id) ? '#4ade80' : '#fbbf24');

    return `
      <svg viewBox="0 0 640 400" class="ks2lab-svg-scene" role="img" aria-label="Cross-section of a Must Farm Bronze Age circular timber roundhouse on oak stilts over a Cambridgeshire river">
        <defs>
          <linearGradient id="mf-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1e3a5f" />
            <stop offset="58%" stop-color="#335c67" />
            <stop offset="100%" stop-color="#4a7c59" />
          </linearGradient>
          <linearGradient id="mf-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0f4c5c" />
            <stop offset="68%" stop-color="#0b313d" />
            <stop offset="100%" stop-color="#1b1917" />
          </linearGradient>
          <linearGradient id="mf-thatch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ca8a04" />
            <stop offset="100%" stop-color="#854d0e" />
          </linearGradient>
        </defs>

        <!-- Fenland sky & distant reeds -->
        <rect x="0" y="0" width="640" height="248" fill="url(#mf-sky)" />
        <circle cx="545" cy="54" r="24" fill="#fde68a" opacity="0.88" />
        <path d="M0 228 Q160 212 320 226 T640 222 L640 250 L0 250 Z" fill="#2d4f38" />

        <!-- Slow Cambridgeshire river & deep silt bed -->
        <rect x="0" y="246" width="640" height="104" fill="url(#mf-water)" />
        <path d="M0 338 Q180 326 360 340 T640 334 L640 400 L0 400 Z" fill="#29221c" />
        <path d="M24 274 Q95 268 165 274 M455 286 Q530 280 605 286" stroke="#67e8f9" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.45" />

        <!-- Zone 4: Oak stilts & river silt below -->
        <g class="ks2lab-svg-hit" data-zone-pick="silt">
          <rect x="148" y="228" width="18" height="148" rx="3" fill="#5c3a21" stroke="${isSel('silt')}" stroke-width="2.5" />
          <rect x="234" y="228" width="18" height="154" rx="3" fill="#5c3a21" stroke="${isSel('silt')}" stroke-width="2.5" />
          <rect x="388" y="228" width="18" height="154" rx="3" fill="#5c3a21" stroke="${isSel('silt')}" stroke-width="2.5" />
          <rect x="474" y="228" width="18" height="148" rx="3" fill="#5c3a21" stroke="${isSel('silt')}" stroke-width="2.5" />
          <!-- Wicker eel trap beneath floorboards -->
          <polygon points="292,296 352,284 352,316 292,306" fill="#a16207" stroke="#fde047" stroke-width="2" />
          <line x1="305" y1="293" x2="305" y2="308" stroke="#fef08a" stroke-width="1.5" />
          <line x1="322" y1="290" x2="322" y2="311" stroke="#fef08a" stroke-width="1.5" />
          <line x1="339" y1="287" x2="339" y2="314" stroke="#fef047" stroke-width="1.5" />
          <circle cx="272" cy="301" r="12" fill="#0f172a" stroke="${isDone('silt')}" stroke-width="2.5" />
          <text x="272" y="305" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="900">4</text>
        </g>

        <!-- Raised timber platform floor -->
        <rect x="126" y="216" width="388" height="16" rx="4" fill="#7c4a27" stroke="#d97706" stroke-width="2" />

        <!-- Zone 3: Woven wattle walls & living interior -->
        <g class="ks2lab-svg-hit" data-zone-pick="wattle">
          <rect x="142" y="146" width="356" height="70" fill="#2b2118" stroke="${isSel('wattle')}" stroke-width="2.5" />
          <!-- Left & right wattle panels -->
          <rect x="142" y="146" width="66" height="70" fill="#92400e" />
          <line x1="142" y1="160" x2="208" y2="160" stroke="#fde68a" stroke-width="2" opacity="0.55" />
          <line x1="142" y1="176" x2="208" y2="176" stroke="#fde68a" stroke-width="2" opacity="0.55" />
          <line x1="142" y1="192" x2="208" y2="192" stroke="#fde68a" stroke-width="2" opacity="0.55" />
          <rect x="432" y="146" width="66" height="70" fill="#92400e" />
          <line x1="432" y1="160" x2="498" y2="160" stroke="#fde68a" stroke-width="2" opacity="0.55" />
          <line x1="432" y1="176" x2="498" y2="176" stroke="#fde68a" stroke-width="2" opacity="0.55" />
          <line x1="432" y1="192" x2="498" y2="192" stroke="#fde68a" stroke-width="2" opacity="0.55" />
          <!-- Central clay hearth & storage pots -->
          <ellipse cx="320" cy="210" rx="34" ry="8" fill="#78716c" />
          <path d="M308 208 Q320 180 332 208 Z" fill="#f97316" />
          <path d="M314 208 Q320 189 326 208 Z" fill="#fde047" />
          <ellipse cx="246" cy="202" rx="13" ry="14" fill="#b45309" stroke="#fcd34d" stroke-width="1.5" />
          <circle cx="402" cy="198" r="16" fill="none" stroke="#d97706" stroke-width="4" />
          <circle cx="175" cy="181" r="12" fill="#0f172a" stroke="${isDone('wattle')}" stroke-width="2.5" />
          <text x="175" y="185" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="900">3</text>
        </g>

        <!-- Zone 1: Conical reed thatch roof (outer slope) -->
        <g class="ks2lab-svg-hit" data-zone-pick="thatch">
          <polygon points="106,150 320,34 534,150 486,150 320,62 154,150" fill="url(#mf-thatch)" stroke="${isSel('thatch')}" stroke-width="3" />
          <circle cx="195" cy="96" r="12" fill="#0f172a" stroke="${isDone('thatch')}" stroke-width="2.5" />
          <text x="195" y="100" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="900">1</text>
        </g>

        <!-- Zone 2: Ash rafters cutaway interior -->
        <g class="ks2lab-svg-hit" data-zone-pick="rafters">
          <polygon points="154,150 320,62 486,150" fill="#3b2818" stroke="${isSel('rafters')}" stroke-width="2.5" />
          <line x1="320" y1="62" x2="215" y2="150" stroke="#f59e0b" stroke-width="4" />
          <line x1="320" y1="62" x2="270" y2="150" stroke="#f59e0b" stroke-width="4" />
          <line x1="320" y1="62" x2="370" y2="150" stroke="#f59e0b" stroke-width="4" />
          <line x1="320" y1="62" x2="425" y2="150" stroke="#f59e0b" stroke-width="4" />
          <line x1="210" y1="116" x2="430" y2="116" stroke="#d97706" stroke-width="3" />
          <circle cx="320" cy="108" r="12" fill="#0f172a" stroke="${isDone('rafters')}" stroke-width="2.5" />
          <text x="320" y="112" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="900">2</text>
        </g>

        <!-- Clean diagram legend pill -->
        <rect x="14" y="14" width="245" height="28" rx="8" fill="rgba(15,23,42,0.84)" stroke="#d97706" />
        <text x="26" y="32" fill="#fde68a" font-size="11.5" font-weight="800">Must Farm Stilted Roundhouse (c. 850 BC)</text>
      </svg>
    `;
  }

  function renderFireMudSimulatorSVG() {
    const phase = FIRE_PHASES[state.firePhaseIdx] || FIRE_PHASES[0];
    const isDry = state.soilCompareMode === 'dry';

    return `
      <svg viewBox="0 0 640 400" class="ks2lab-svg-scene" role="img" aria-label="Cause-and-effect diagram comparing waterlogged river mud preservation at Must Farm with dry soil decay">
        <rect x="0" y="0" width="640" height="400" fill="#121923" />

        ${
          isDry
            ? `
          <!-- DRY SOIL COMPARISON -->
          <rect x="0" y="0" width="640" height="215" fill="#334155" />
          <rect x="0" y="215" width="640" height="185" fill="#78553a" />
          <text x="320" y="42" text-anchor="middle" fill="#fca5a5" font-size="16" font-weight="900">ORDINARY DRY LAND SOIL (FULL OF OXYGEN POCKETS)</text>
          <text x="320" y="66" text-anchor="middle" fill="#e2e8f0" font-size="12.5">Air and rain trickle through loose soil so bacteria and fungi eat wood, cloth, and food.</text>
          <!-- Ghostly rotted wood & surviving stone/bronze only -->
          <rect x="120" y="255" width="160" height="14" rx="4" fill="none" stroke="#cbd5e1" stroke-dasharray="6 5" stroke-width="2" />
          <text x="200" y="292" text-anchor="middle" fill="#fecaca" font-size="12" font-weight="800">✗ Wooden handle rots away</text>
          <polygon points="282,248 318,240 318,278 282,270" fill="#10b981" stroke="#a7f3d0" stroke-width="2" />
          <text x="302" y="314" text-anchor="middle" fill="#bbf7d0" font-size="12" font-weight="800">✓ Only metal or stone survives</text>
          <circle cx="468" cy="264" r="24" fill="none" stroke="#cbd5e1" stroke-dasharray="5 5" stroke-width="2" />
          <text x="468" y="308" text-anchor="middle" fill="#fecaca" font-size="12" font-weight="800">✗ Cloth and food vanish</text>
        `
            : `
          <!-- MUST FARM WATERLOGGED MUD TIME CAPSULE -->
          <rect x="0" y="0" width="640" height="205" fill="${phase.stepNum === 1 ? '#431407' : '#162636'}" />
          <rect x="0" y="205" width="640" height="95" fill="#0e4152" />
          <rect x="0" y="300" width="640" height="100" fill="#1f1b18" />

          <text x="320" y="36" text-anchor="middle" fill="#fde047" font-size="15.5" font-weight="900">${phase.title.toUpperCase()}</text>

          ${
            phase.stepNum === 1
              ? `
            <polygon points="180,145 320,64 460,145" fill="#b45309" stroke="#fde047" stroke-width="2.5" />
            <path d="M250 96 Q268 52 288 94 Q318 42 344 92 Q372 54 392 98" fill="#f97316" />
            <rect x="205" y="145" width="230" height="48" fill="#5c3a21" />
            <rect x="225" y="193" width="14" height="125" fill="#452714" />
            <rect x="401" y="193" width="14" height="125" fill="#452714" />
            <text x="320" y="255" text-anchor="middle" fill="#bae6fd" font-size="13" font-weight="800">Cool slow river flows directly underneath the burning stilts</text>
          `
              : phase.stepNum === 2
                ? `
            <rect x="225" y="205" width="14" height="115" fill="#292524" />
            <rect x="401" y="205" width="14" height="115" fill="#292524" />
            <g transform="translate(0, 12)">
              <line x1="210" y1="232" x2="340" y2="276" stroke="#1c1917" stroke-width="10" stroke-linecap="round" />
              <line x1="425" y1="228" x2="295" y2="278" stroke="#1c1917" stroke-width="10" stroke-linecap="round" />
              <circle cx="255" cy="264" r="18" fill="#92400e" stroke="#fde68a" stroke-width="2.5" />
              <ellipse cx="382" cy="268" rx="16" ry="12" fill="#78350f" stroke="#fcd34d" stroke-width="2" />
            </g>
            <text x="320" y="150" text-anchor="middle" fill="#7dd3fc" font-size="14" font-weight="800">SPLASH! River water puts out the flames before wood turns to ash</text>
          `
                : `
            <path d="M0 288 Q160 276 320 289 T640 284 L640 400 L0 400 Z" fill="#27211d" stroke="#10b981" stroke-width="2" />
            <circle cx="185" cy="342" r="22" fill="#78350f" stroke="#4ade80" stroke-width="2.5" />
            <text x="185" y="382" text-anchor="middle" fill="#bbf7d0" font-size="11.5" font-weight="800">✓ 1m Wooden Wheel</text>
            <ellipse cx="320" cy="344" rx="22" ry="15" fill="#92400e" stroke="#4ade80" stroke-width="2.5" />
            <text x="320" y="382" text-anchor="middle" fill="#bbf7d0" font-size="11.5" font-weight="800">✓ Porridge and Spatula</text>
            <rect x="435" y="328" width="48" height="28" rx="5" fill="#065f46" stroke="#4ade80" stroke-width="2.5" />
            <text x="459" y="382" text-anchor="middle" fill="#bbf7d0" font-size="11.5" font-weight="800">✓ Woven Plant Cloth</text>
            <text x="320" y="148" text-anchor="middle" fill="#86efac" font-size="14" font-weight="900">ZERO OXYGEN IN WATERLOGGED MUD = ZERO ROT FOR 3,000 YEARS!</text>
          `
          }
        `
        }
      </svg>
    `;
  }

  function renderTrenchMapSVG() {
    return `
      <svg viewBox="0 0 640 400" class="ks2lab-svg-scene" role="img" aria-label="Must Farm overhead archaeological excavation grid showing six waterlogged trench squares">
        <rect x="0" y="0" width="640" height="400" fill="#1c1917" />
        <!-- Wooden dig walkways -->
        <rect x="26" y="24" width="588" height="22" rx="4" fill="#854d0e" stroke="#fde68a" stroke-width="1.2" />
        <rect x="26" y="354" width="588" height="22" rx="4" fill="#854d0e" stroke="#fde68a" stroke-width="1.2" />
        <rect x="52" y="54" width="536" height="292" rx="10" fill="#27211c" stroke="#f59e0b" stroke-width="2" />

        ${TRENCH_FINDS.map((f, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 70 + col * 172;
          const y = 70 + row * 134;
          const dug = state.dugFinds.has(f.id);
          const sel = state.selectedFindId === f.id;
          return `
            <g class="ks2lab-svg-hit" data-dig-tile="${f.id}">
              <rect x="${x}" y="${y}" width="156" height="118" rx="10"
                    fill="${dug ? '#14532d' : '#3b3026'}"
                    stroke="${sel ? '#fde047' : dug ? '#4ade80' : '#a8a29e'}"
                    stroke-width="${sel ? '3' : '2'}" />
              <text x="${x + 14}" y="${y + 22}" fill="#fcd34d" font-size="11" font-weight="900">${f.coord}</text>
              <text x="${x + 78}" y="${y + 64}" text-anchor="middle" font-size="28">${dug ? f.icon : '🪨'}</text>
              <text x="${x + 78}" y="${y + 96}" text-anchor="middle" fill="${dug ? '#ecfdf5' : '#d6d3d1'}" font-size="11" font-weight="800">
                ${dug ? f.name : 'Tap to Excavate Silt'}
              </text>
            </g>
          `;
        }).join('')}
      </svg>
    `;
  }

  function renderTradeMapSVG() {
    const localCount = TRADE_ITEMS.filter((t) => state.sortedTradeIds.has(t.id) && t.bucket === 'local').length;
    const seaCount = TRADE_ITEMS.filter((t) => state.sortedTradeIds.has(t.id) && t.bucket === 'overseas').length;

    return `
      <svg viewBox="0 0 640 400" class="ks2lab-svg-scene" role="img" aria-label="Bronze Age trade network connecting Cambridgeshire Fens with English Channel sewn-plank oak boats and Mediterranean glass workshops">
        <rect x="0" y="0" width="640" height="400" fill="#0c2438" />
        <!-- Stylised Britain & Continental Europe Trade Sea -->
        <path d="M90 48 L215 48 L255 155 L245 250 L110 262 L78 175 Z" fill="#2d4f38" stroke="#86efac" stroke-width="2" />
        <path d="M275 290 L600 220 L615 385 L255 385 Z" fill="#3f4e3a" stroke="#fde68a" stroke-width="2" />
        <!-- Trade route dashed arc -->
        <path d="M206 184 Q310 250 485 332" fill="none" stroke="#fde047" stroke-width="3.5" stroke-dasharray="8 6" />
        <!-- Sewn-plank Dover Oak Boat icon on Channel -->
        <g transform="translate(270, 224)">
          <path d="M0 18 Q36 34 72 18 L60 32 L12 32 Z" fill="#92400e" stroke="#fde68a" stroke-width="2" />
          <text x="36" y="10" text-anchor="middle" fill="#fef08a" font-size="10.5" font-weight="800">Sewn-Plank Oak Boat</text>
        </g>
        <!-- Must Farm Pin -->
        <circle cx="206" cy="184" r="10" fill="#22c55e" stroke="#ffffff" stroke-width="2.5" />
        <text x="192" y="168" text-anchor="end" fill="#bbf7d0" font-size="12.5" font-weight="900">Must Farm Fens (${localCount}/3 Local)</text>
        <!-- Overseas Network Pin -->
        <circle cx="485" cy="332" r="10" fill="#f59e0b" stroke="#ffffff" stroke-width="2.5" />
        <text x="485" y="362" text-anchor="middle" fill="#fde68a" font-size="12.5" font-weight="900">Channel and Mediterranean Routes (${seaCount}/3 Overseas)</text>
      </svg>
    `;
  }

  function renderTopBarHTML() {
    const curIdx = Math.max(0, STEPS.findIndex((s) => s.id === state.step));
    const prevId = curIdx > 0 ? STEPS[curIdx - 1].id : '';
    const nextId = curIdx < STEPS.length - 1 ? STEPS[curIdx + 1].id : '';

    return `
      <div class="ks2lab-step-strip" role="tablist" aria-label="Must Farm Lab Stages">
        ${STEPS.map((s) => {
          const done = isStageComplete(s.id);
          const cls = state.step === s.id ? 'is-active' : done ? 'is-done' : '';
          return `<button type="button" class="ks2lab-step-pill ${cls}" data-step-go="${s.id}">${done && state.step !== s.id ? '✓ ' : ''}${s.short}</button>`;
        }).join('')}
      </div>

      <div class="ks2lab-mobile-nav">
        <button type="button" class="ks2lab-mob-arrow" data-step-go="${prevId}" ${!prevId ? 'disabled' : ''} aria-label="Previous Stage">◀</button>
        <select class="ks2lab-mobile-select" id="ks2-mf-mob-select" aria-label="Select Lab Stage">
          ${STEPS.map((s) => {
            const done = isStageComplete(s.id);
            return `<option value="${s.id}" ${state.step === s.id ? 'selected' : ''}>${done && state.step !== s.id ? '✓ ' : ''}${s.mob}</option>`;
          }).join('')}
        </select>
        <button type="button" class="ks2lab-mob-arrow" data-step-go="${nextId}" ${!nextId ? 'disabled' : ''} aria-label="Next Stage">▶</button>
      </div>

      <div class="ks2lab-ctrl-group">
        <span class="ks2lab-score-chip" title="Archaeologist Detective Points">🏺 ${state.score} pts</span>
        <button type="button" class="ks2lab-ctrl-btn ${!sound.muted ? 'is-active' : ''}" data-action="toggle-sound" title="Toggle Web Speech Read-Aloud and Sound Effects">
          <span>${sound.muted ? '🔇' : '🔊'}</span>
          <span class="ks2lab-btn-label">${sound.muted ? 'Muted' : 'Read Aloud'}</span>
        </button>
        <button type="button" class="ks2lab-ctrl-btn ${state.resetArmed ? 'is-warn' : ''}" data-action="reset-lab" title="${state.resetArmed ? 'Tap again to confirm reset' : 'Restart Lab'}">
          <span>↺</span>
          <span class="ks2lab-btn-label">${state.resetArmed ? 'Sure?' : 'Reset'}</span>
        </button>
        <button type="button" class="ks2lab-ctrl-btn ${state.isFullscreen ? 'is-active' : ''}" data-action="toggle-fs" title="${state.isFullscreen ? 'Switch to Windowed View' : 'Switch to Full-Screen View'}">
          <span>${state.isFullscreen ? '🗗' : '⛶'}</span>
          <span class="ks2lab-btn-label">${state.isFullscreen ? 'Windowed' : 'Full-Screen'}</span>
        </button>
        ${
          mountCfg.onClose
            ? `<button type="button" class="ks2lab-ctrl-btn is-close" data-action="close-lab" aria-label="Close Interactive Lab" title="Close Lab">✕</button>`
            : ''
        }
      </div>
    `;
  }

  function renderSpeechBarHTML() {
    return `
      <div class="ks2lab-speaker-badge" aria-hidden="true">${state.speakerIcon}</div>
      <div class="ks2lab-speech-content">
        <div class="ks2lab-speech-meta">
          <span class="ks2lab-speaker-name">${state.speakerName}</span>
          <span class="ks2lab-speech-actions">
            <button type="button" class="ks2lab-replay-btn" data-action="speak-current" title="Read current narration aloud">
              🔊 Listen
            </button>
          </span>
        </div>
        <p class="ks2lab-speech-quote">“${state.speechText}”</p>
      </div>
    `;
  }

  function renderStageBodyHTML() {
    if (state.step === 'cover') {
      return `
        <div class="ks2lab-cover-card">
          <div class="ks2lab-cover-visual">
            <div class="ks2lab-svg-frame" style="aspect-ratio:16/10;display:flex;align-items:center;justify-content:center;background:#070a10;">
              <img src="${ASSETS.digSite}" alt="Archaeologist standing inside the Must Farm excavation shelter surrounded by preserved Bronze Age oak stilt posts and fallen roof rafters in dark Cambridgeshire river silt" class="archival-image" style="width:100%;height:100%;object-fit:contain;" />
            </div>
            <div class="ks2lab-plate-caption" style="font-size:0.78rem;color:#cbd5e1;">
              <strong>Archival Dig Photograph:</strong> Inside the Must Farm excavation shelter in Cambridgeshire, where fallen Bronze Age roundhouse timbers and Britain’s oldest complete wheel emerged from wet river mud.
            </div>
          </div>

          <div class="ks2lab-cover-info">
            <div>
              ${renderEscapeCoverSealHTML('THE HISTORY REVISION HUB • OFFICIAL ESCAPE LAB')}
              <div class="ks2lab-kicker">🔥 VOICED KS2 ARCHAEOLOGY ESCAPE LAB • BRONZE AGE (c. 850 BC)</div>
              <h2 class="ks2lab-hero-title">Embers Over the Fen: The Must Farm Detective Lab</h2>
              <p class="ks2lab-hero-sub">
                Watch the <strong>Studio-voiced 850 BC opening</strong>, then step inside a Bronze Age roundhouse on oak stilts, test why waterlogged mud froze bowls of porridge for 3,000 years, excavate six real trench squares, and map overseas trade!
              </p>
              <div class="ks2lab-badge-row">
                <span class="ks2lab-badge">🎬 Voiced 850 BC Cinema</span>
                <span class="ks2lab-badge">🔒 Lock 1: Stilt House</span>
                <span class="ks2lab-badge">🔒 Lock 2: Wet Mud Lab</span>
                <span class="ks2lab-badge">🔒 Lock 3: Trench Dig</span>
                <span class="ks2lab-badge">🔒 Lock 4: Trade Sorter</span>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <button type="button" class="ks2lab-cta-primary" data-cinema-start="prologue">
                <span>🎬 Watch Voiced 850 BC Opening &amp; Begin Dig</span>
              </button>
              <button type="button" class="hh-er-cover-secondary-cta" data-step-go="stage1">
                ⚡ Skip Opening → Jump Straight to Stage 1 (Stilt Roundhouse)
              </button>
            </div>
          </div>
        </div>
      `;
    }

    if (state.step === 'prologue') {
      const idx = state.cinemaIdx || 0;
      const slide = MUST_FARM_PROLOGUE[idx] || MUST_FARM_PROLOGUE[0];
      const isLast = idx >= MUST_FARM_PROLOGUE.length - 1;
      return renderAtmosphericCinemaHTML({
        topLeftLabel: 'THE HISTORY REVISION HUB • BRONZE AGE ARCHIVE CINEMA',
        topRightLabel: `SCENE ${idx + 1} OF ${MUST_FARM_PROLOGUE.length} • 🎙️ STUDIO VOICEOVER`,
        slideIndex: idx,
        totalSlides: MUST_FARM_PROLOGUE.length,
        vignetteTone: 'gold',
        imgSrc: slide.img,
        imgAlt: slide.alt,
        caption: slide.caption,
        credit: slide.credit,
        heading: slide.heading,
        narrationHTML: `<p style="margin:0;">${slide.narration}</p>`,
        actionsHTML: `
          ${
            !isLast
              ? `<button type="button" class="ks2lab-cta-primary" style="width:auto;padding:10px 20px;" data-cinema-next="prologue">Next Scene →</button>`
              : `<button type="button" class="ks2lab-cta-primary" style="width:auto;padding:11px 22px;" data-step-go="stage1">⛏️ Enter Stage 1: Stilted Roundhouse →</button>`
          }
          <button type="button" class="hh-er-cover-secondary-cta" style="width:auto;padding:10px 14px;" data-cinema-replay="1">🔊 Replay Voiceover</button>
          <button type="button" class="hh-er-cover-secondary-cta" style="width:auto;padding:10px 14px;" data-step-go="stage1">Skip Prologue →</button>
        `,
        dotAttr: 'data-cinema-dot',
        bottomRightLabel: 'British Studio Narration • Must Farm Archaeological Archive',
      });
    }

    if (state.step === 'epilogue') {
      const idx = state.cinemaIdx || 0;
      const slide = MUST_FARM_EPILOGUE[idx] || MUST_FARM_EPILOGUE[0];
      const isLast = idx >= MUST_FARM_EPILOGUE.length - 1;
      return renderAtmosphericCinemaHTML({
        topLeftLabel: 'THE HISTORY REVISION HUB • MUST FARM CINEMATIC ENDING',
        topRightLabel: `FINALE ${idx + 1} OF ${MUST_FARM_EPILOGUE.length} • 🎙️ STUDIO VOICEOVER`,
        slideIndex: idx,
        totalSlides: MUST_FARM_EPILOGUE.length,
        vignetteTone: 'emerald',
        imgSrc: slide.img,
        imgAlt: slide.alt,
        caption: slide.caption,
        credit: slide.credit,
        heading: slide.heading,
        narrationHTML: `<p style="margin:0;">${slide.narration}</p>`,
        actionsHTML: `
          ${
            !isLast
              ? `<button type="button" class="ks2lab-cta-primary" style="width:auto;padding:10px 20px;" data-cinema-next="epilogue">Next Finale Scene →</button>`
              : `<button type="button" class="ks2lab-cta-primary" style="width:auto;padding:11px 22px;" data-step-go="stage5">🏅 Return to Certificate &amp; Workbook Code →</button>`
          }
          <button type="button" class="hh-er-cover-secondary-cta" style="width:auto;padding:10px 14px;" data-cinema-replay="1">🔊 Replay Voiceover</button>
        `,
        dotAttr: 'data-cinema-dot',
        bottomRightLabel: 'Must Farm Epilogue • Verified Cambridgeshire Finds',
      });
    }

    if (state.step === 'stage1') {
      const zone = ROUNDHOUSE_ZONES.find((z) => z.id === state.activeZoneId) || ROUNDHOUSE_ZONES[0];
      return `
        <div class="ks2lab-workspace">
          <div class="ks2lab-visual-col">
            <div class="ks2lab-svg-frame">${renderRoundhouseCutawaySVG()}</div>
            <div class="ks2lab-hotspot-strip">
              ${ROUNDHOUSE_ZONES.map((z, idx) => {
                const found = state.zonesFound.has(z.id);
                const active = state.activeZoneId === z.id;
                return `
                  <button type="button" class="ks2lab-spot-chip ${active ? 'is-active' : ''} ${found ? 'is-found' : ''}" data-zone-pick="${z.id}">
                    <span>${idx + 1}. ${z.icon} ${z.label}</span>
                    <span class="ks2lab-spot-status">${found ? '✓ Inspected' : 'Inspect'}</span>
                  </button>
                `;
              }).join('')}
            </div>
            <div class="ks2lab-plate-card">
              <div class="ks2lab-plate-frame">
                <img src="${ASSETS.roundhouse}" alt="Reconstructed Bronze Age circular roundhouse at Flag Fen near Must Farm with conical reed-and-turf roof and woven wattle hurdle door" class="archival-image" />
              </div>
              <div>
                <div class="ks2lab-plate-kicker">Verified Reconstruction • Flag Fen Basin</div>
                <p class="ks2lab-plate-caption">Reconstructed Bronze Age roundhouse near Must Farm showing the steep conical thatched roof, clay-daubed walls, and woven wattle door.</p>
              </div>
            </div>
          </div>

          <div class="ks2lab-panel-col">
            <div class="ks2lab-card">
              <div class="ks2lab-card-header">
                <span class="ks2lab-card-kicker">Stage 1 of 5 • Architectural Cutaway (${state.zonesFound.size}/4 Zones)</span>
              </div>
              <h3 class="ks2lab-card-title">Step Inside the Stilted Roundhouse</h3>
              <p class="ks2lab-card-prose">
                Around 850 BC, families built up to five circular wooden roundhouses side by side on oak stilts right above a slow freshwater river in Cambridgeshire. Inspect all four numbered zones!
              </p>
              <div class="ks2lab-detail-box">
                <h4 class="ks2lab-detail-title">${zone.icon} ${zone.detailTitle}</h4>
                <p class="ks2lab-detail-text">${zone.detailText}</p>
              </div>
            </div>

            <div class="ks2lab-card">
              <span class="ks2lab-card-kicker">Quick Check • Unlock Stage 1 Completion</span>
              <p class="ks2lab-quiz-q">Why was building on oak stilts above a slow Fenland river such a clever choice for Bronze Age families?</p>
              <div class="ks2lab-opt-stack">
                <button type="button" class="ks2lab-opt-btn ${state.stage1Check === 'correct' ? 'is-correct' : ''}" data-s1-check="correct">
                  It gave families fresh fish and eels right below their floor, reeds for thatch, and a river highway for boats.
                </button>
                <button type="button" class="ks2lab-opt-btn ${state.stage1Check === 'wrong' ? 'is-wrong' : ''}" data-s1-check="wrong">
                  Bronze Age builders had not yet discovered how to cut down oak or ash trees on dry land.
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (state.step === 'stage2') {
      const curPhase = FIRE_PHASES[state.firePhaseIdx] || FIRE_PHASES[0];
      return `
        <div class="ks2lab-workspace">
          <div class="ks2lab-visual-col">
            <div class="ks2lab-svg-frame">${renderFireMudSimulatorSVG()}</div>
            <div class="ks2lab-bucket-row">
              <button type="button" class="ks2lab-bucket-btn" style="${state.soilCompareMode === 'waterlogged' ? 'border-color:#4ade80;background:#14532d;' : ''}" data-soil-mode="waterlogged">
                🌊 Must Farm Waterlogged River Mud
              </button>
              <button type="button" class="ks2lab-bucket-btn" style="${state.soilCompareMode === 'dry' ? 'border-color:#f87171;background:#451a1a;' : ''}" data-soil-mode="dry">
                🏜️ Compare: Ordinary Dry Land Soil
              </button>
            </div>
            <div class="ks2lab-plate-card">
              <div class="ks2lab-plate-frame">
                <img src="${ASSETS.storagePot}" alt="Reconstructed large Must Farm pottery storage vessel MUS06 913 displaying dark scorch marks on its side from the Bronze Age fire" class="archival-image" />
              </div>
              <div>
                <div class="ks2lab-plate-kicker">Museum Evidence • Scorched Vessel (MUS06 913)</div>
                <p class="ks2lab-plate-caption">Large storage pot from a Must Farm roundhouse showing dark fire scorch marks along its side before river mud sealed it.</p>
              </div>
            </div>
          </div>

          <div class="ks2lab-panel-col">
            <div class="ks2lab-card">
              <span class="ks2lab-card-kicker">Stage 2 of 5 • Preservation Simulator (${state.phasesVisited.size}/3 Phases + Soil Compare)</span>
              <h3 class="ks2lab-card-title">The Sudden Fire and Waterlogged Time Capsule</h3>
              <p class="ks2lab-card-prose">
                Step through all three stages of the Must Farm blaze below, then compare waterlogged mud with dry land soil to prove why wooden spoons and cloth survived for 3,000 years!
              </p>
              <div class="ks2lab-sim-steps">
                ${FIRE_PHASES.map((p, idx) => {
                  const visited = state.phasesVisited.has(p.id);
                  const active = state.firePhaseIdx === idx && state.soilCompareMode === 'waterlogged';
                  return `
                    <button type="button" class="ks2lab-sim-btn ${active ? 'is-active' : ''} ${visited ? 'is-done' : ''}" data-fire-phase="${idx}">
                      <span>${p.title}</span>
                      <span>${visited ? '✓' : '▶'}</span>
                    </button>
                  `;
                }).join('')}
              </div>
              <div class="ks2lab-detail-box">
                <h4 class="ks2lab-detail-title">${state.soilCompareMode === 'dry' ? 'Why Dry Soil Loses Organic Clues' : curPhase.title}</h4>
                <p class="ks2lab-detail-text">
                  ${
                    state.soilCompareMode === 'dry'
                      ? 'In ordinary dry soil, air pockets let bacteria and fungi feast on wood, leather, textiles, and food until only stone or metal remains.'
                      : curPhase.summary
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (state.step === 'stage3') {
      const selected = TRENCH_FINDS.find((f) => f.id === state.selectedFindId) || TRENCH_FINDS[0];
      const selectedIsDug = state.dugFinds.has(selected.id);

      return `
        <div class="ks2lab-workspace">
          <div class="ks2lab-visual-col">
            <div class="ks2lab-svg-frame">${renderTrenchMapSVG()}</div>
            <div class="ks2lab-plate-card">
              <div class="ks2lab-plate-frame">
                <img src="${selectedIsDug ? selected.plate : ASSETS.digSite}" alt="${selectedIsDug ? selected.name : 'Must Farm excavation trench'}" class="archival-image" />
              </div>
              <div>
                <div class="ks2lab-plate-kicker">Verified Trench Plate • ${selectedIsDug ? selected.coord : 'Cambridgeshire Silt'}</div>
                <p class="ks2lab-plate-caption">${selectedIsDug ? selected.plateCaption : 'Tap any trench square above or on the right to gently brush away wet silt and inspect the find!'}</p>
              </div>
            </div>
          </div>

          <div class="ks2lab-panel-col">
            <div class="ks2lab-card">
              <span class="ks2lab-card-kicker">Stage 3 of 5 • Archaeological Dig (${state.dugFinds.size}/6 Squares Uncovered)</span>
              <h3 class="ks2lab-card-title">Excavate the Must Farm Trench Grid</h3>
              <p class="ks2lab-card-prose">
                Uncover all six waterlogged grid squares to inspect real household items dropped on the day of the fire.
              </p>
              <div class="ks2lab-trench-grid">
                ${TRENCH_FINDS.map((f) => {
                  const dug = state.dugFinds.has(f.id);
                  const sel = state.selectedFindId === f.id;
                  return `
                    <button type="button" class="ks2lab-trench-tile ${dug ? 'is-dug' : ''} ${sel ? 'is-selected' : ''}" data-dig-tile="${f.id}">
                      <span class="ks2lab-tile-icon">${dug ? f.icon : '⛏️'}</span>
                      <span>${dug ? f.name : `Dig ${f.coord}`}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              <div class="ks2lab-detail-box">
                <h4 class="ks2lab-detail-title">${selectedIsDug ? `${selected.icon} ${selected.name} (${selected.coord})` : 'Trowel Ready!'}</h4>
                <p class="ks2lab-detail-text">
                  ${selectedIsDug ? selected.summary : 'Tap any unexcavated square in the trench grid to brush away dark river mud and log your first artefact.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (state.step === 'stage4') {
      const doneAll = state.sortedTradeIds.size >= TRADE_ITEMS.length;
      const currentItem =
        TRADE_ITEMS.find((t) => !state.sortedTradeIds.has(t.id)) || TRADE_ITEMS[TRADE_ITEMS.length - 1];

      return `
        <div class="ks2lab-workspace">
          <div class="ks2lab-visual-col">
            <div class="ks2lab-svg-frame">${renderTradeMapSVG()}</div>
            <div class="ks2lab-plate-card">
              <div class="ks2lab-plate-frame">
                <img src="${ASSETS.doverBoat}" alt="The Dover Bronze Age sewn-plank oak boat displayed in Dover Museum glass gallery" class="archival-image" />
              </div>
              <div>
                <div class="ks2lab-plate-kicker">Channel Crossing • Dover Bronze Age Boat</div>
                <p class="ks2lab-plate-caption">Thick oak planks stitched together with twisted yew branches and sealed with moss carried metal ingots and beads across the English Channel.</p>
              </div>
            </div>
          </div>

          <div class="ks2lab-panel-col">
            <div class="ks2lab-card">
              <span class="ks2lab-card-kicker">Stage 4 of 5 • Evidence Sorter (${state.sortedTradeIds.size}/${TRADE_ITEMS.length} Sorted)</span>
              <h3 class="ks2lab-card-title">Made Locally in the Fens vs Overseas Trade</h3>
              <p class="ks2lab-card-prose">
                Read each artefact’s scientific clue and sort it into the matching provenance basket!
              </p>

              ${
                doneAll
                  ? `
                <div class="ks2lab-detail-box" style="border-left-color:#22c55e;">
                  <h4 class="ks2lab-detail-title">✓ All 6 Provenance Clues Sorted!</h4>
                  <p class="ks2lab-detail-text">
                    Must Farm families mastered local wetland woodcraft AND linked into Bronze Age trade routes stretching from Cornwall and Wales to the Baltic and Mediterranean!
                  </p>
                </div>
              `
                  : `
                <div class="ks2lab-sorter-prompt">
                  <div>
                    <div class="ks2lab-card-kicker">Clue ${state.sortedTradeIds.size + 1} of ${TRADE_ITEMS.length}</div>
                    <h4 class="ks2lab-detail-title" style="font-size:1rem;margin-top:2px;">${currentItem.name}</h4>
                    <p class="ks2lab-detail-text" style="margin-top:4px;">${currentItem.clue}</p>
                  </div>
                  <div class="ks2lab-bucket-row">
                    <button type="button" class="ks2lab-bucket-btn" data-sort-bucket="local">
                      🌾 Made Locally in the Fens
                    </button>
                    <button type="button" class="ks2lab-bucket-btn" data-sort-bucket="overseas">
                      ⛵ Traded Across Long Networks
                    </button>
                  </div>
                </div>
              `
              }

              ${
                state.tradeFeedback
                  ? `<p class="ks2lab-quiz-feedback" style="border-left:3px solid ${state.tradeFeedbackWrong ? '#ef4444' : '#22c55e'};">${state.tradeFeedback}</p>`
                  : ''
              }
            </div>
          </div>
        </div>
      `;
    }

    // Stage 5: Chief Archaeologist's Report & Detective Certificate
    const allSolved = isStageComplete('stage5');
    return `
      <div>
        <div class="ks2lab-card" style="margin-bottom:14px;">
          <div class="ks2lab-card-header">
            <span class="ks2lab-card-kicker">Stage 5 of 5 • Chief Archaeologist’s Evidence Synthesis</span>
            <span class="ks2lab-badge">${state.reportCredited.size}/4 Verified</span>
          </div>
          <h3 class="ks2lab-card-title">Complete Your Must Farm Excavation Report</h3>
          <p class="ks2lab-card-prose">
            Use the primary clues you uncovered across Stages 1 to 4 to verify all four findings in the Cambridgeshire Wetland Archive.
          </p>
        </div>

        <div class="ks2lab-quiz-grid">
          ${REPORT_QUESTIONS.map((q) => {
            const picked = state.reportAnswers[q.id];
            const solved = q.options.some((o) => o.id === picked && o.correct);
            return `
              <div class="ks2lab-quiz-card ${solved ? 'is-solved' : ''}">
                <p class="ks2lab-quiz-q">${q.question}</p>
                <div class="ks2lab-opt-stack">
                  ${q.options
                    .map((o) => {
                      let cls = '';
                      if (picked === o.id) cls = o.correct ? 'is-correct' : 'is-wrong';
                      return `<button type="button" class="ks2lab-opt-btn ${cls}" data-report-q="${q.id}" data-report-opt="${o.id}">${o.label}</button>`;
                    })
                    .join('')}
                </div>
                ${
                  picked
                    ? `<p class="ks2lab-quiz-feedback">${solved ? `✓ ${q.feedback}` : 'Not quite—check your wetland excavation clues and try the other evidence statement!'}</p>`
                    : ''
                }
              </div>
            `;
          }).join('')}
        </div>

        ${renderWorkbookCodeCardHTML({
          slotLabel: 'ENQUIRY 5 BACK-COVER LEDGER',
          phrase: 'WET FENLAND MUD PRESERVED BRONZE AGE BRITAIN',
          instruction:
            'Copy this unlocked phrase into the Escape Room Ledger on the Back Cover of your Stone Age to Iron Age Pupil Workbook!',
        })}

        <div style="margin:10px 0;display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="ks2lab-cta-primary" style="width:auto;padding:10px 18px;" data-cinema-start="epilogue">
            🎬 Watch 2-Scene Voiced Must Farm Cinematic Ending
          </button>
        </div>

        ${
          allSolved
            ? `
          <div class="ks2lab-cert-banner">
            <div>
              <div class="ks2lab-kicker" style="color:#fde047;">🏅 OFFICIAL FIELDWORK COMMENDATION • THE HISTORY REVISION HUB</div>
              <h3 class="ks2lab-card-title" style="font-size:1.35rem;">Junior Bronze Age Archaeologist Badge Unlocked!</h3>
              <div class="ks2lab-cert-pillars">
                <span class="ks2lab-cert-pill">✓ Stilted Roundhouse Architecture</span>
                <span class="ks2lab-cert-pill">✓ Waterlogged Mud Preservation</span>
                <span class="ks2lab-cert-pill">✓ 6/6 Must Farm Trench Artefacts</span>
                <span class="ks2lab-cert-pill">✓ Overseas Bronze Age Trade</span>
              </div>
            </div>
            <button type="button" class="ks2lab-print-btn" data-action="print-cert">
              🖨️ Print Detective Certificate
            </button>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  function renderBottomNavHTML() {
    const curIdx = Math.max(0, STEPS.findIndex((s) => s.id === state.step));
    const prev = curIdx > 0 ? STEPS[curIdx - 1] : null;
    const next = curIdx < STEPS.length - 1 ? STEPS[curIdx + 1] : null;
    const curDone = state.step === 'cover' || isStageComplete(state.step);

    let statusMsg = '<strong>Cover</strong> • Ready to launch Stage 1';
    if (state.step === 'stage1') {
      statusMsg = curDone
        ? '<strong>✓ Stage 1 Complete!</strong> Ready for Stage 2'
        : `<strong>Stage 1 of 5</strong> • Inspect ${state.zonesFound.size}/4 zones + Quick Check`;
    } else if (state.step === 'stage2') {
      statusMsg = curDone
        ? '<strong>✓ Stage 2 Complete!</strong> Ready to excavate'
        : `<strong>Stage 2 of 5</strong> • Test ${state.phasesVisited.size}/3 fire phases + Dry Soil button`;
    } else if (state.step === 'stage3') {
      statusMsg = curDone
        ? '<strong>✓ Stage 3 Complete!</strong> All 6 finds logged'
        : `<strong>Stage 3 of 5</strong> • Excavated ${state.dugFinds.size}/6 trench squares`;
    } else if (state.step === 'stage4') {
      statusMsg = curDone
        ? '<strong>✓ Stage 4 Complete!</strong> Trade network mapped'
        : `<strong>Stage 4 of 5</strong> • Sorted ${state.sortedTradeIds.size}/${TRADE_ITEMS.length} trade clues`;
    } else if (state.step === 'stage5') {
      statusMsg = curDone
        ? `<strong>🏆 Lab Complete!</strong> Final Score: ${state.score} pts`
        : `<strong>Stage 5 of 5</strong> • Verified ${state.reportCredited.size}/4 report findings`;
    }

    return `
      <button type="button" class="ks2lab-nav-btn" data-step-go="${prev ? prev.id : ''}" ${!prev ? 'disabled' : ''}>
        ← Back
      </button>
      <div class="ks2lab-nav-status">${statusMsg}</div>
      ${
        next
          ? `<button type="button" class="ks2lab-nav-btn ${curDone ? 'is-primary' : ''}" data-step-go="${next.id}">
               ${state.step === 'cover' ? 'Start Stage 1 →' : 'Next Stage →'}
             </button>`
          : `<button type="button" class="ks2lab-nav-btn ${curDone ? 'is-primary' : ''}" data-action="${curDone ? 'print-cert' : ''}" ${!curDone ? 'disabled' : ''}>
               🖨️ Certificate
             </button>`
      }
    `;
  }

  const cinemaVoice = createEscapeCinemaVoicePlayer();

  function renderBrandBarHTML() {
    const locks = ['stage1', 'stage2', 'stage3', 'stage4'].filter((id) => isStageComplete(id)).length;
    return renderEscapeBrandBarHTML({
      eraTag: 'KS2 • BRONZE AGE FENS (c. 850 BC)',
      locksCracked: locks,
      totalLocks: 4,
    });
  }

  function render(scrollToTop = false) {
    if (unmounted || !shellEl) return;
    shellEl.classList.toggle('ks2lab-is-fullscreen', state.isFullscreen);

    const mutate = () => {
      const brandEl = shellEl.querySelector('#ks2-mf-brand');
      const topEl = shellEl.querySelector('#ks2-mf-topbar');
      const speechEl = shellEl.querySelector('#ks2-mf-speech');
      const bodyEl = shellEl.querySelector('#ks2-mf-body');
      const navEl = shellEl.querySelector('#ks2-mf-bottom');
      if (brandEl) brandEl.innerHTML = renderBrandBarHTML();
      if (topEl) topEl.innerHTML = renderTopBarHTML();
      if (speechEl) {
        const hideSpeech = state.step === 'cover' || state.step === 'prologue' || state.step === 'epilogue';
        speechEl.style.display = hideSpeech ? 'none' : '';
        if (!hideSpeech) speechEl.innerHTML = renderSpeechBarHTML();
      }
      if (bodyEl) bodyEl.innerHTML = renderStageBodyHTML();
      if (navEl) navEl.innerHTML = renderBottomNavHTML();
    };

    if (scrollToTop) {
      mutate();
      scrollLock.scrollToTopOnStepChange(state.isFullscreen);
    } else {
      scrollLock.preserve(mutate);
    }
  }

  // Mount persistent shell once (`CLS = 0`)
  container.innerHTML = `
    <div class="ks2lab-shell theme-must-farm ${state.isFullscreen ? 'ks2lab-is-fullscreen' : ''}">
      <div id="ks2-mf-brand"></div>
      <div class="ks2lab-topbar" id="ks2-mf-topbar"></div>
      <div class="ks2lab-speech-bar" id="ks2-mf-speech" aria-live="polite"></div>
      <div class="ks2lab-stage-slot" id="ks2-mf-body"></div>
      <div class="ks2lab-bottom-nav" id="ks2-mf-bottom"></div>
    </div>
  `;

  shellEl = container.querySelector('.ks2lab-shell');
  scrollLock.bindShellPointerGuards(shellEl);

  shellEl.addEventListener('change', (e) => {
    const sel = e.target.closest('#ks2-mf-mob-select');
    if (sel && sel.value) {
      sound.click();
      goToStep(sel.value);
    }
  });

  shellEl.addEventListener('click', (e) => {
    const cStart = e.target.closest('[data-cinema-start]');
    if (cStart) {
      const mode = cStart.getAttribute('data-cinema-start');
      state.cinemaIdx = 0;
      sound.stopSpeech();
      goToStep(mode);
      cinemaVoice.play(mode === 'epilogue' ? 'mustfarm_end_1' : 'mustfarm_pro_1');
      return;
    }

    const cNext = e.target.closest('[data-cinema-next]');
    if (cNext) {
      const mode = cNext.getAttribute('data-cinema-next');
      const arr = mode === 'epilogue' ? MUST_FARM_EPILOGUE : MUST_FARM_PROLOGUE;
      state.cinemaIdx = Math.min(arr.length - 1, (state.cinemaIdx || 0) + 1);
      sound.click();
      render(false);
      cinemaVoice.play(`${mode === 'epilogue' ? 'mustfarm_end' : 'mustfarm_pro'}_${state.cinemaIdx + 1}`);
      return;
    }

    const cDot = e.target.closest('[data-cinema-dot]');
    if (cDot) {
      state.cinemaIdx = Number(cDot.getAttribute('data-cinema-dot')) || 0;
      render(false);
      cinemaVoice.play(`${state.step === 'epilogue' ? 'mustfarm_end' : 'mustfarm_pro'}_${state.cinemaIdx + 1}`);
      return;
    }

    if (e.target.closest('[data-cinema-replay]')) {
      cinemaVoice.replay();
      return;
    }

    const stepBtn = e.target.closest('[data-step-go]');
    if (stepBtn) {
      const target = stepBtn.getAttribute('data-step-go');
      if (target) {
        cinemaVoice.stop();
        sound.click();
        goToStep(target);
      }
      return;
    }

    const actionEl = e.target.closest('[data-action]');
    if (actionEl) {
      const act = actionEl.getAttribute('data-action');
      if (act === 'toggle-sound') {
        sound.toggleMute(state.speechText);
        render(false);
      } else if (act === 'speak-current') {
        sound.speak(state.speechText, true);
        render(false);
      } else if (act === 'reset-lab') {
        if (!state.resetArmed) {
          state.resetArmed = true;
          sound.warn();
          if (resetArmTimer) clearTimeout(resetArmTimer);
          resetArmTimer = setTimeout(() => {
            if (unmounted) return;
            state.resetArmed = false;
            render(false);
          }, 3500);
          render(false);
        } else {
          if (resetArmTimer) clearTimeout(resetArmTimer);
          resetLab();
        }
      } else if (act === 'toggle-fs') {
        state.isFullscreen = !state.isFullscreen;
        if (state.isFullscreen) fsSync.requestFs();
        else fsSync.exitFs();
        mountCfg.onToggleWindowMode?.(state.isFullscreen);
        render(false);
      } else if (act === 'close-lab') {
        sound.stopSpeech();
        if (state.isFullscreen) fsSync.exitFs();
        mountCfg.onClose?.();
      } else if (act === 'print-cert') {
        openCertificateWindow();
      }
      return;
    }

    // Stage 1: Roundhouse zones
    const zoneEl = e.target.closest('[data-zone-pick]');
    if (zoneEl) {
      const zId = zoneEl.getAttribute('data-zone-pick');
      const z = ROUNDHOUSE_ZONES.find((item) => item.id === zId);
      if (!z) return;
      state.activeZoneId = z.id;
      if (!state.zonesFound.has(z.id)) {
        state.zonesFound.add(z.id);
        addScore(10);
      }
      sound.click();
      say(z.icon, z.speaker, z.quote, !sound.muted);
      save();
      render(false);
      return;
    }

    const s1CheckBtn = e.target.closest('[data-s1-check]');
    if (s1CheckBtn) {
      const v = s1CheckBtn.getAttribute('data-s1-check');
      if (v === 'correct') {
        if (state.stage1Check !== 'correct') addScore(15);
        state.stage1Check = 'correct';
        sound.success();
        say(
          '🪵',
          'Bryn • Bronze Age Carpenter',
          'Spot-on! Fresh eels below our floorboards, reeds for roofing, and dug-out log boats moored right beside the porch!',
          !sound.muted,
        );
      } else {
        state.stage1Check = 'wrong';
        sound.warn();
        say(
          '🔥',
          'Dr Maya Patel • Fenland Wetland Archaeologist',
          'Look closely at the oak stilts and ash rafters—Bronze Age carpenters shaped huge woodland trees with sharp bronze axes!',
          !sound.muted,
        );
      }
      save();
      render(false);
      return;
    }

    // Stage 2: Fire & Mud Simulator
    const phaseBtn = e.target.closest('[data-fire-phase]');
    if (phaseBtn) {
      const idx = Number(phaseBtn.getAttribute('data-fire-phase'));
      const p = FIRE_PHASES[idx];
      if (!p) return;
      state.firePhaseIdx = idx;
      state.soilCompareMode = 'waterlogged';
      if (!state.phasesVisited.has(p.id)) {
        state.phasesVisited.add(p.id);
        addScore(10);
      }
      sound.click();
      say('🌊', 'Dr Maya Patel • Preservation Lab', p.speech, !sound.muted);
      save();
      render(false);
      return;
    }

    const soilBtn = e.target.closest('[data-soil-mode]');
    if (soilBtn) {
      const mode = soilBtn.getAttribute('data-soil-mode');
      state.soilCompareMode = mode === 'dry' ? 'dry' : 'waterlogged';
      if (state.soilCompareMode === 'dry' && !state.comparedBothSoils) {
        state.comparedBothSoils = true;
        addScore(15);
        sound.success();
      } else {
        sound.click();
      }
      say(
        state.soilCompareMode === 'dry' ? '🏜️' : '🌊',
        'Dr Maya Patel • Soil Comparison',
        state.soilCompareMode === 'dry'
          ? 'See the difference? In air-filled dry soil, wooden handles, cloth, and food rot away—leaving only metal or stone!'
          : 'Back in Must Farm’s oxygen-free waterlogged mud, wooden wheels, handles, and porridge stayed intact for 3,000 years!',
        !sound.muted,
      );
      save();
      render(false);
      return;
    }

    // Stage 3: Trench Grid Dig
    const digEl = e.target.closest('[data-dig-tile]');
    if (digEl) {
      const fId = digEl.getAttribute('data-dig-tile');
      const find = TRENCH_FINDS.find((f) => f.id === fId);
      if (!find) return;
      state.selectedFindId = find.id;
      if (!state.dugFinds.has(find.id)) {
        state.dugFinds.add(find.id);
        addScore(12);
        sound.dig();
      } else {
        sound.click();
      }
      say(find.icon, `Excavated ${find.coord} • ${find.name}`, find.summary, !sound.muted);
      save();
      render(false);
      return;
    }

    // Stage 4: Trade Sorter
    const bucketBtn = e.target.closest('[data-sort-bucket]');
    if (bucketBtn) {
      const chosenBucket = bucketBtn.getAttribute('data-sort-bucket');
      const curItem = TRADE_ITEMS.find((t) => !state.sortedTradeIds.has(t.id));
      if (!curItem) return;
      if (chosenBucket === curItem.bucket) {
        state.sortedTradeIds.add(curItem.id);
        state.tradeFeedback = `✓ ${curItem.explain}`;
        state.tradeFeedbackWrong = false;
        addScore(12);
        sound.success();
        say('⛵', 'Maelor • Bronze Age Channel Trader', curItem.explain, !sound.muted);
      } else {
        state.tradeFeedback = `Try the other basket! Re-read the scientific clue for ${curItem.name}.`;
        state.tradeFeedbackWrong = true;
        sound.warn();
        say(
          '🔎',
          'Dr Maya Patel • Material Analysis',
          `Check where the raw material for ${curItem.name} came from—was it gathered right beside the Fenland river or brought from afar?`,
          !sound.muted,
        );
      }
      save();
      render(false);
      return;
    }

    // Stage 5: Chief Archaeologist's Report
    const repBtn = e.target.closest('[data-report-q]');
    if (repBtn) {
      const qId = repBtn.getAttribute('data-report-q');
      const optId = repBtn.getAttribute('data-report-opt');
      const q = REPORT_QUESTIONS.find((item) => item.id === qId);
      const opt = q?.options.find((o) => o.id === optId);
      if (!q || !opt) return;
      state.reportAnswers[qId] = optId;
      if (opt.correct) {
        if (!state.reportCredited.has(qId)) {
          state.reportCredited.add(qId);
          addScore(state.reportHadWrong.has(qId) ? 8 : 15);
        }
        sound.success();
        say('🏅', 'Dr Maya Patel • Report Verified', q.feedback, !sound.muted);
      } else {
        state.reportHadWrong.add(qId);
        sound.warn();
        say('🔎', 'Dr Maya Patel • Check Your Field Notes', 'Re-check your Must Farm evidence and test the other explanation!', !sound.muted);
      }
      save();
      render(false);
    }
  });

  preloadStageAssets(state.step);
  render(false);

  return () => {
    unmounted = true;
    if (resetArmTimer) clearTimeout(resetArmTimer);
    scrollLock.dispose();
    fsSync.dispose();
    cinemaVoice.destroy();
    sound.destroy();
  };
}
