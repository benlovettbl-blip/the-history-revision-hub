/**
 * INK ON THE FRONTIER: The Vindolanda Roman Postbag Lab (c. AD 100)
 * Target Lesson Hook: `ks2_romans:lesson_4:2` (Enquiry 4: Hadrian's Wall and Frontier Life)
 *
 * 5 Interactive Stages:
 *  - Stage 1: Garrison on the Northern Frontier (Inspect Principia, Granary on pillars, Bathhouse, Waterlogged Ditch)
 *  - Stage 2: Decode Claudia Severa's Birthday Invitation — Tab. Vindol. 291 (Earliest Latin handwriting by a woman)
 *  - Stage 3: Quartermaster's Frontier Kit Bag (Pack woollen socks, sandals, underpants + fort grain & pepper stores)
 *  - Stage 4: Who Lived Beside the Wall? (Batavian cohorts, Syrian archers, North African soldiers, Romano-British traders)
 *  - Stage 5: Frontier Archivist's Dispatch and Roman Frontier Epigrapher Certificate
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

const SESSION_KEY = 'hh_ks2_vindolanda_lab_v1';
const UNIT_ID = 'ks2_romans';
const LAB_ID = 'ks2_vindolanda_lab';

const ASSETS = {
  tablet291: '/units/ks2_romans/assets/vindolanda_birthday_tablet_291.jpg',
  fortRuins: '/units/ks2_romans/assets/vindolanda_fort_ruins.jpg',
  milecastle: '/units/ks2_romans/assets/milecastle_39_hadrians_wall.jpg',
  latrines: '/units/ks2_romans/assets/housesteads_roman_latrines.jpg',
  pepperPot: '/units/ks2_romans/assets/hoxne_hoard_empress_pepper_pot.jpg',
  arbeiaGate: '/units/ks2_romans/assets/arbeia_roman_gatehouse.jpg',
  reginaStone: '/units/ks2_romans/assets/regina_tombstone_south_shields.jpg',
};

const preloadStageAssets = createStageAssetPreloader({
  cover: [ASSETS.tablet291, ASSETS.fortRuins],
  stage1: [ASSETS.fortRuins, ASSETS.tablet291],
  stage2: [ASSETS.tablet291, ASSETS.pepperPot],
  stage3: [ASSETS.pepperPot, ASSETS.arbeiaGate, ASSETS.reginaStone],
  stage4: [ASSETS.arbeiaGate, ASSETS.reginaStone, ASSETS.milecastle],
  stage5: [ASSETS.milecastle],
});

const STEPS = [
  { id: 'cover', short: '🪶 Cover', mob: 'Cover • Vindolanda' },
  { id: 'stage1', short: '1. Frontier Fort', mob: '1/5 Frontier Fort' },
  { id: 'stage2', short: '2. Birthday Tablet', mob: '2/5 Tablet 291' },
  { id: 'stage3', short: '3. Soldier’s Kit', mob: '3/5 Soldier’s Kit' },
  { id: 'stage4', short: '4. Empire Voices', mob: '4/5 Empire Voices' },
  { id: 'stage5', short: '5. Dispatch', mob: '5/5 Dispatch' },
];

const FORT_ZONES = [
  {
    id: 'principia',
    label: 'Principia Headquarters',
    icon: '🏛️',
    speaker: 'Prefect Flavius Cerialis • Garrison Commander',
    quote:
      'At the exact crossroads of Vindolanda stands our stone Principia! Here clerks write daily strength reports, guard the silver pay chest, and honour our cohort standards.',
    detailTitle: 'Principia (Fort Headquarters)',
    detailText:
      'Built at the T-junction of the main fort streets, the Principia housed offices, a courtyard parade hall, and a strongroom for soldiers’ wages.',
  },
  {
    id: 'granary',
    label: 'Granary on Stone Pillars',
    icon: '🌾',
    speaker: 'Optio Marcus • Fort Quartermaster',
    quote:
      'Touch these short stone pillars underneath the granary floor! Lifting the floor kept a full year’s wheat cool, dry, and safe from hungry frontier mice.',
    detailTitle: 'Horreum (Raised Stone Granary)',
    detailText:
      'Thick buttressed walls and ventilated under-floor pillars stopped grain going mouldy during damp Northumberland winters.',
  },
  {
    id: 'bathhouse',
    label: 'Bathhouse Outside the Walls',
    icon: '♨️',
    speaker: 'Sulpicia Lepidina • Commander’s Wife at Vindolanda',
    quote:
      'After chilly border patrols, everyone visits the warm bathhouse outside the fort gates—wearing wooden bath clogs so hot underfloor tiles do not scorch our feet!',
    detailTitle: 'Thermae (Heated Frontier Bathhouse)',
    detailText:
      'Built outside the main ramparts to lower fire risk, the bathhouse offered hot steam rooms, cold plunge pools, and social chat.',
  },
  {
    id: 'ditch',
    label: 'Waterlogged Fort Ditch',
    icon: '📜',
    speaker: 'Dr Hannah Ross • Roman Epigrapher',
    quote:
      'Bingo! When soldiers rebuilt timber forts around AD 100, wet clay and waterlogged ditch mud sealed hundreds of wafer-thin birch-wood ink letters without oxygen!',
    detailTitle: 'Waterlogged Ditch (Tablet Time Capsule)',
    detailText:
      'Postcard-sized shavings of birch, alder, and oak written in carbon ink survived in oxygen-free wet soil for nearly 1,900 years.',
  },
];

const TABLET_PASSAGES = [
  {
    id: 'p1',
    sectionLabel: 'Left Column • Scribal Invitation',
    latin: '“Cl. Severa Lepidinae suae salutem. III Idus Septembres, soror, ad diem sollemnem natalem meum rogo libenter facias ut venias...”',
    correctId: 'bday',
    options: [
      {
        id: 'bday',
        label: 'Claudia Severa warmly invites her friend Sulpicia Lepidina to travel over for her birthday party on 11 September.',
        correct: true,
      },
      {
        id: 'tax',
        label: 'Emperor Hadrian orders every soldier to pay three silver coins in border tax by September.',
        correct: false,
      },
    ],
    note: 'Claudia Severa lived at a nearby fort (Briga) and dictated the main invitation to a professional military scribe.',
  },
  {
    id: 'p2',
    sectionLabel: 'Middle Lines • Warm Frontier Friendship',
    latin: '“...ad nos iucundiorem mihi diem interventu tuo facturus si aderis. Cerialem tuum saluta...”',
    correctId: 'friend',
    options: [
      {
        id: 'war',
        label: 'Send fifty catapults immediately because Caledonian chariots have surrounded the granary.',
        correct: false,
      },
      {
        id: 'friend',
        label: '“You will make the day much more delightful for me by your arrival. Give my greetings to your Cerialis!”',
        correct: true,
      },
    ],
    note: 'This proves senior Roman officers’ wives and young children lived vibrant social lives right along the northern frontier!',
  },
  {
    id: 'p3',
    sectionLabel: 'Bottom Right Corner • Claudia’s Own Hand!',
    latin: '“Sperabo te, soror. Vale, soror, anima mea, ita valeam karissima et have.”',
    correctId: 'handwriting',
    options: [
      {
        id: 'handwriting',
        label: '“I shall expect you, sister. Farewell, sister, my dearest soul!”—written in Claudia Severa’s own personal handwriting!',
        correct: true,
      },
      {
        id: 'stamp',
        label: '“Stamped and approved by the Imperial Brickworks of Londinium.”',
        correct: false,
      },
    ],
    note: 'Claudia took the reed pen herself to add those four tender lines—the earliest surviving Latin handwriting by a woman anywhere in the world!',
  },
];

const KIT_ITEMS = [
  {
    id: 'socks',
    name: 'Warm Woollen Socks (Udones)',
    icon: '🧦',
    authentic: true,
    detail:
      'Real Vindolanda clue (Tab. Vindol. 346)! A friend sent a frontier soldier pairs of warm socks from Sattua to beat chilly northern winds.',
  },
  {
    id: 'sandals',
    name: 'Two Pairs of Sandals (Soleae)',
    icon: '👞',
    authentic: true,
    detail:
      'Listed in the exact same Vindolanda parcel! Hundreds of real leather shoes—from baby boots to hobnailed marching boots—came out of the wet ditch.',
  },
  {
    id: 'underpants',
    name: 'Two Pairs of Underpants (Subligaria)',
    icon: '🩲',
    authentic: true,
    detail:
      'Recorded verbatim on Tab. Vindol. 346 alongside socks and sandals—essential wool and linen layers under armour on windy crags!',
  },
  {
    id: 'pepper',
    name: 'Fort Wheat and Imported Black Pepper',
    icon: '🌶️',
    authentic: true,
    detail:
      'Vindolanda accounts record huge wheat stores, Celtic beer (cervesa), fish sauce, and even luxury black pepper shipped all the way from India via Rome!',
  },
  {
    id: 'myth_tunic',
    name: 'Thin Summer Tunic with Bare Legs in Snow',
    icon: '🥶',
    authentic: false,
    detail:
      'Myth busted! Film costumes often show bare-legged Mediterranean tunics, but frontier troops in northern Britain wore thick wool cloaks, socks, and riding trousers!',
  },
];

const FRONTIER_PROFILES = [
  {
    id: 'batavian',
    person: 'Ninth Cohort of Batavians (Vindolanda Garrison)',
    clue: 'Auxiliary infantry and cavalry recruited from the marshy Rhine delta who wrote many of the Vindolanda ink tablets under Prefect Cerialis.',
    originId: 'europe',
    originLabel: 'Lower Rhine • Northern Europe (Modern Netherlands)',
    explain:
      'Matched! Batavian auxiliaries from the Lower Rhine guarded Vindolanda around AD 100 before moving east to fight in Dacia.',
  },
  {
    id: 'hamian',
    person: 'First Cohort of Hamian Archers',
    clue: 'The only specialized regiment of composite-bow archers stationed in Roman Britain, patrolling the windy crags near Carvoran and Housesteads.',
    originId: 'syria',
    originLabel: 'Hama • Roman Syria (Middle East)',
    explain:
      'Matched! Recruited from Hama in Syria, these skilled Middle Eastern archers served along Hadrian’s Wall for generations.',
  },
  {
    id: 'moors',
    person: 'Aurelian Moors and Young Victor',
    clue: 'Auxiliary unit stationed at Aballava (Burgh-by-Sands) on the western Wall, alongside freedmen like 20-year-old Victor honoured on an Arbeia tombstone.',
    originId: 'africa',
    originLabel: 'Mauretania • North Africa',
    explain:
      'Matched! North African soldiers and residents lived and served along Hadrian’s Wall from Cumbria across to the River Tyne.',
  },
  {
    id: 'regina',
    person: 'Regina and Her Husband Barates (Vicus Town)',
    clue: 'Honoured on a famous carved stone monument at Arbeia Fort with inscriptions in BOTH Latin and Palmyrene Aramaic.',
    originId: 'brit_syria',
    originLabel: 'Southern British Catuvellauni Tribe and Palmyra (Syria)',
    explain:
      'Matched! Regina came from southern Britain and married Barates, a standard-maker or trader from Palmyra in Syria, in the bustling civilian town outside Arbeia.',
  },
];

const ORIGIN_CHOICES = [
  { id: 'europe', label: '🛡️ Lower Rhine (Northern Europe)' },
  { id: 'syria', label: '🏹 Hama in Syria (Middle East)' },
  { id: 'africa', label: '🌍 Mauretania (North Africa)' },
  { id: 'brit_syria', label: '🤝 British Catuvellauni + Palmyra (Syria)' },
];

const DISPATCH_QUESTIONS = [
  {
    id: 'dq1',
    question: '1. Why did thin birch-wood ink letters from around AD 100 survive at Vindolanda instead of rotting away?',
    options: [
      {
        id: 'a',
        label: 'They were buried deep in wet, oxygen-free mud beneath rebuilt fort layers where rot-microbes could not live.',
        correct: true,
      },
      {
        id: 'b',
        label: 'Roman scribes carved every birthday letter onto solid blocks of granite.',
        correct: false,
      },
    ],
    feedback:
      'Confirmed! Just like Must Farm in the Fens, Vindolanda’s waterlogged soil sealed thin wooden shavings away from air for nearly 1,900 years.',
  },
  {
    id: 'dq2',
    question: '2. Why is Claudia Severa’s birthday tablet (Tab. Vindol. 291) treasured across the whole world?',
    options: [
      {
        id: 'a',
        label: 'It gives the exact blueprint for building all 80 milecastles on Hadrian’s Wall.',
        correct: false,
      },
      {
        id: 'b',
        label: 'Its farewell greeting holds the oldest known surviving Latin handwriting by a woman and shows family life on the frontier.',
        correct: true,
      },
    ],
    feedback:
      'Spot-on! Claudia’s affectionate handwritten postscript to Sulpicia Lepidina brings real Roman women’s voices vividly to life.',
  },
  {
    id: 'dq3',
    question: '3. How does Vindolanda Tablet 346 overturn popular myths about Roman soldiers in northern Britain?',
    options: [
      {
        id: 'a',
        label: 'A parcel of woollen socks, sandals, and underpants proves soldiers dressed warmly against chilly Northumberland weather.',
        correct: true,
      },
      {
        id: 'b',
        label: 'It proves soldiers marched barefoot through snowdrifts without cloaks or socks.',
        correct: false,
      },
    ],
    feedback:
      'Exactly right! Auxiliary troops adapted sensibly to rainy northern hills with woollen socks, thick cloaks, and leather boots.',
  },
  {
    id: 'dq4',
    question: '4. What do Vindolanda tablets and carved tombstones at Arbeia reveal about who lived along Hadrian’s Wall?',
    options: [
      {
        id: 'a',
        label: 'Every single soldier and shopkeeper came only from the city of Rome in Italy.',
        correct: false,
      },
      {
        id: 'b',
        label: 'Soldiers, wives, and traders from Europe, Syria, North Africa, and Britain lived side by side in forts and vici towns.',
        correct: true,
      },
    ],
    feedback:
      'Verified! Hadrian’s Wall was a truly multi-continental frontier connecting Britain to the wider Roman Empire.',
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
      if (muted) stopSpeech();
      else {
        tone(480, 640, 0.07, 'sine', 0.07);
        if (currentText) speak(currentText);
      }
      return muted;
    },
    click() {
      tone(460, 610, 0.045, 'sine', 0.06);
    },
    quill() {
      tone(700, 920, 0.05, 'triangle', 0.06);
    },
    success() {
      tone(523.25, 659.25, 0.09, 'triangle', 0.1, 0);
      tone(659.25, 880, 0.14, 'triangle', 0.11, 0.08);
    },
    warn() {
      tone(210, 145, 0.16, 'sawtooth', 0.08);
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

export function mountKs2VindolandaLab(container, opts = {}, legacyCtx = {}) {
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
    speakerIcon: '🪶',
    speakerName: 'Dr Hannah Ross • Roman Frontier Epigrapher',
    speechText:
      'Salve! Welcome to Vindolanda Fort on the windy northern frontier around AD 100, where wet mud preserved real wooden ink postcards from across the Roman Empire!',

    // Stage 1: Fort zones
    fortZonesFound: new Set(),
    activeFortZone: 'principia',
    stage1Check: null,

    // Stage 2: Tab. Vindol. 291 decoder
    activePassageIdx: 0,
    decodedPassages: new Set(),
    wrongPassageChoice: '',

    // Stage 3: Soldier's Frontier Kit Bag
    packedKit: new Set(),
    mythSpotted: false,
    selectedKitId: 'socks',

    // Stage 4: Empire Voices Matcher
    matchedProfiles: new Set(),
    profileFeedback: '',
    profileFeedbackWrong: false,

    // Stage 5: 4-Question Dispatch
    dispatchAnswers: {},
    dispatchCredited: new Set(),
    dispatchHadWrong: new Set(),
  };

  function hydrate() {
    const saved = persistence.load();
    if (!saved || typeof saved !== 'object') return;
    if (STEPS.some((s) => s.id === saved.step)) state.step = saved.step;
    if (typeof saved.score === 'number') state.score = saved.score;
    if (Array.isArray(saved.fortZonesFound)) state.fortZonesFound = new Set(saved.fortZonesFound);
    if (typeof saved.activeFortZone === 'string') state.activeFortZone = saved.activeFortZone;
    if (saved.stage1Check) state.stage1Check = saved.stage1Check;
    if (typeof saved.activePassageIdx === 'number') state.activePassageIdx = saved.activePassageIdx;
    if (Array.isArray(saved.decodedPassages)) state.decodedPassages = new Set(saved.decodedPassages);
    if (Array.isArray(saved.packedKit)) state.packedKit = new Set(saved.packedKit);
    state.mythSpotted = Boolean(saved.mythSpotted);
    if (typeof saved.selectedKitId === 'string') state.selectedKitId = saved.selectedKitId;
    if (Array.isArray(saved.matchedProfiles)) state.matchedProfiles = new Set(saved.matchedProfiles);
    if (saved.dispatchAnswers && typeof saved.dispatchAnswers === 'object') {
      state.dispatchAnswers = saved.dispatchAnswers;
    }
    if (Array.isArray(saved.dispatchCredited)) state.dispatchCredited = new Set(saved.dispatchCredited);
    if (Array.isArray(saved.dispatchHadWrong)) state.dispatchHadWrong = new Set(saved.dispatchHadWrong);
  }

  function save() {
    persistence.save({
      step: state.step,
      score: state.score,
      fortZonesFound: [...state.fortZonesFound],
      activeFortZone: state.activeFortZone,
      stage1Check: state.stage1Check,
      activePassageIdx: state.activePassageIdx,
      decodedPassages: [...state.decodedPassages],
      packedKit: [...state.packedKit],
      mythSpotted: state.mythSpotted,
      selectedKitId: state.selectedKitId,
      matchedProfiles: [...state.matchedProfiles],
      dispatchAnswers: state.dispatchAnswers,
      dispatchCredited: [...state.dispatchCredited],
      dispatchHadWrong: [...state.dispatchHadWrong],
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
    if (stepId === 'stage1') return state.fortZonesFound.size >= 4 && state.stage1Check === 'correct';
    if (stepId === 'stage2') return state.decodedPassages.size >= TABLET_PASSAGES.length;
    if (stepId === 'stage3') return state.packedKit.size >= 4 && state.mythSpotted;
    if (stepId === 'stage4') return state.matchedProfiles.size >= FRONTIER_PROFILES.length;
    if (stepId === 'stage5') {
      return DISPATCH_QUESTIONS.every((q) => {
        const picked = state.dispatchAnswers[q.id];
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
        '🪶',
        'Dr Hannah Ross • Roman Frontier Epigrapher',
        'Open the Vindolanda postbag from around AD 100! Press Open Roman Postbag below to step onto the northern frontier.',
      );
    } else if (nextStep === 'stage1') {
      say(
        '🏛️',
        'Prefect Flavius Cerialis • Vindolanda Commander',
        isCoarseTouchUI()
          ? 'Tap all 4 buildings and ditches across Vindolanda Fort to see how our garrison survived on the Stanegate frontier!'
          : 'Click all 4 buildings and ditches on our Vindolanda Fort map to inspect Roman frontier engineering!',
      );
    } else if (nextStep === 'stage2') {
      say(
        '💌',
        'Claudia Severa • Sender of Tablet 291 (c. AD 100)',
        'Help Sulpicia Lepidina read all 3 ink sections on my folded birch-wood birthday invitation—especially my own handwriting at the bottom!',
      );
    } else if (nextStep === 'stage3') {
      say(
        '🧦',
        'Optio Marcus • Frontier Quartermaster',
        'Chilly rain is blowing across Northumberland! Pack all 4 real frontier supplies into the kit bag—and tap the summer-costume myth to bust it!',
      );
    } else if (nextStep === 'stage4') {
      say(
        '🌍',
        'Barates of Palmyra • Trader at Arbeia Vicus',
        'People from three continents lived along Hadrian’s Wall! Match all 4 regiments and families to their true homelands across the Empire.',
      );
    } else if (nextStep === 'stage5') {
      say(
        '🏅',
        'Dr Hannah Ross • Frontier Archive Dispatch',
        'Verify all 4 primary-evidence findings below to claim and print your Roman Frontier Epigrapher Certificate!',
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
    state.fortZonesFound.clear();
    state.activeFortZone = 'principia';
    state.stage1Check = null;
    state.activePassageIdx = 0;
    state.decodedPassages.clear();
    state.wrongPassageChoice = '';
    state.packedKit.clear();
    state.mythSpotted = false;
    state.selectedKitId = 'socks';
    state.matchedProfiles.clear();
    state.profileFeedback = '';
    state.profileFeedbackWrong = false;
    state.dispatchAnswers = {};
    state.dispatchCredited.clear();
    state.dispatchHadWrong.clear();
    say(
      '🪶',
      'Dr Hannah Ross • Roman Frontier Epigrapher',
      'Vindolanda wax and ink tablets reset! Ready for a fresh frontier investigation.',
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
<html lang="en"><head><meta charset="utf-8"><title>Roman Frontier Epigrapher Certificate</title>
<style>
  body { font-family: Georgia, serif; background: #f8fafc; margin: 0; padding: 28px; text-align: center; color: #0f172a; }
  .cert { max-width: 720px; margin: 0 auto; padding: 36px 40px; background: #fffbeb; border: 6px double #dc2626; border-radius: 16px; }
  .kicker { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 1.4px; color: #991b1b; text-transform: uppercase; }
  h1 { font-size: 28px; margin: 10px 0 6px; color: #1c1917; }
  .sub { font-size: 15px; color: #334155; margin-bottom: 18px; }
  .line { display: inline-block; width: 260px; border-bottom: 2px solid #334155; margin: 14px 0 4px; height: 24px; }
  .pills { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 18px 0 22px; font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
  .pill { padding: 5px 12px; border-radius: 999px; background: #dcfce7; border: 1px solid #16a34a; color: #14532d; }
  @media print { .no-print { display: none; } body { background: #fff; padding: 0; } }
</style></head><body>
  <div class="cert">
    <div class="kicker">The History Revision Hub • Key Stage 2 Roman Britain (c. AD 100–122)</div>
    <div style="font-size:44px;margin:8px 0;">🪶</div>
    <h1>Roman Frontier Epigrapher Certificate</h1>
    <p class="sub">Awarded for decoding primary ink tablets and frontier archaeology in <em>Ink on the Frontier: The Vindolanda Roman Postbag Lab</em></p>
    <div><span class="line"></span><div style="font-size:12px;color:#475569;">Epigrapher’s Name</div></div>
    <div class="pills">
      <span class="pill">✓ Vindolanda Garrison Plan</span>
      <span class="pill">✓ Tab. Vindol. 291 Decoded</span>
      <span class="pill">✓ Frontier Winter Kit Verified</span>
      <span class="pill">✓ Empire-Wide Frontier Voices</span>
      <span class="pill">✓ Score: ${state.score} pts</span>
    </div>
    <div style="font-size:13px;color:#475569;">Verified on ${dateStr} • The History Department</div>
    <div class="no-print" style="margin-top:20px;">
      <button onclick="window.print()" style="padding:10px 22px;font-weight:800;border-radius:8px;border:none;background:#dc2626;color:#fff;cursor:pointer;">🖨️ Print / Save Certificate</button>
    </div>
  </div>
</body></html>`);
    win.document.close();
  }

  function renderFortMapSVG() {
    const active = state.activeFortZone;
    const strokeFor = (id) => (active === id ? '#fde047' : state.fortZonesFound.has(id) ? '#4ade80' : '#cbd5e1');

    return `
      <svg viewBox="0 0 640 400" class="ks2lab-svg-scene" role="img" aria-label="Interactive bird's-eye diagram of Vindolanda Roman frontier fort showing Principia, Granary on stone pillars, Bathhouse outside the walls, and waterlogged ditch">
        <!-- Northumberland green crags & Stanegate road -->
        <rect x="0" y="0" width="640" height="400" fill="#1e3528" />
        <path d="M0 78 Q180 52 360 72 T640 60 L640 0 L0 0 Z" fill="#1e293b" />
        <text x="515" y="34" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="800">Windy Crags (Future Hadrian’s Wall Zone)</text>

        <!-- Roman Stanegate Military Road -->
        <rect x="0" y="192" width="640" height="22" fill="#78716c" stroke="#a8a29e" stroke-width="1.5" />
        <text x="58" y="207" fill="#fef3c7" font-size="10.5" font-weight="800">STANEGATE ROAD</text>

        <!-- Zone 4: Waterlogged Outer Fort Ditch -->
        <g class="ks2lab-svg-hit" data-fort-zone="ditch">
          <rect x="86" y="86" width="356" height="248" rx="28" fill="#0f3d4c" stroke="${strokeFor('ditch')}" stroke-width="4" />
          <rect x="108" y="106" width="312" height="208" rx="18" fill="#2d4436" stroke="#94a3b8" stroke-width="5" />
          <circle cx="102" cy="316" r="13" fill="#0f172a" stroke="${strokeFor('ditch')}" stroke-width="2.5" />
          <text x="102" y="320" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="900">4</text>
          <text x="264" y="329" text-anchor="middle" fill="#bae6fd" font-size="11" font-weight="800">Waterlogged Ditch Mud (Ink Tablets Preserved!)</text>
        </g>

        <!-- Internal Fort Cross-Streets -->
        <rect x="112" y="196" width="304" height="14" fill="#a8a29e" />
        <rect x="257" y="110" width="14" height="200" fill="#a8a29e" />

        <!-- Zone 1: Principia Headquarters -->
        <g class="ks2lab-svg-hit" data-fort-zone="principia">
          <rect x="214" y="132" width="100" height="62" rx="6" fill="#991b1b" stroke="${strokeFor('principia')}" stroke-width="3" />
          <rect x="234" y="150" width="60" height="32" rx="3" fill="#1e293b" />
          <text x="264" y="146" text-anchor="middle" fill="#fef08a" font-size="10.5" font-weight="900">1. PRINCIPIA</text>
        </g>

        <!-- Zone 2: Raised Granary on Stone Pillars -->
        <g class="ks2lab-svg-hit" data-fort-zone="granary">
          <rect x="132" y="222" width="110" height="66" rx="6" fill="#b45309" stroke="${strokeFor('granary')}" stroke-width="3" />
          <circle cx="150" cy="274" r="4" fill="#fde68a" />
          <circle cx="175" cy="274" r="4" fill="#fde68a" />
          <circle cx="200" cy="274" r="4" fill="#fde68a" />
          <circle cx="225" cy="274" r="4" fill="#fde68a" />
          <text x="187" y="252" text-anchor="middle" fill="#fffbeb" font-size="10.5" font-weight="900">2. GRANARY</text>
          <text x="187" y="265" text-anchor="middle" fill="#fde68a" font-size="9.5" font-weight="700">(Stone Pillars)</text>
        </g>

        <!-- Barracks blocks (context) -->
        <rect x="286" y="222" width="112" height="26" rx="4" fill="#475569" />
        <rect x="286" y="258" width="112" height="26" rx="4" fill="#475569" />
        <text x="342" y="239" text-anchor="middle" fill="#e2e8f0" font-size="9.5" font-weight="700">Cohort Barracks</text>

        <!-- Zone 3: Bathhouse Outside the Ramparts (Vicus zone) -->
        <g class="ks2lab-svg-hit" data-fort-zone="bathhouse">
          <rect x="472" y="232" width="136" height="90" rx="10" fill="#c2410c" stroke="${strokeFor('bathhouse')}" stroke-width="3" />
          <ellipse cx="540" cy="286" rx="38" ry="18" fill="#0ea5e9" stroke="#bae6fd" stroke-width="2" />
          <text x="540" y="254" text-anchor="middle" fill="#fffbeb" font-size="10.5" font-weight="900">3. BATHHOUSE</text>
          <text x="540" y="315" text-anchor="middle" fill="#fed7aa" font-size="9.5" font-weight="800">(Outside Fort Walls)</text>
        </g>
      </svg>
    `;
  }

  function renderBirchTabletSVG() {
    const pIdx = state.activePassageIdx;
    return `
      <svg viewBox="0 0 640 400" class="ks2lab-svg-scene" role="img" aria-label="Folded wooden Vindolanda leaf tablet Tab. Vindol. 291 showing scribal invitation and Claudia Severa's personal farewell handwriting">
        <rect x="0" y="0" width="640" height="400" fill="#171311" />
        <!-- Diptych Birch-Wood Leaf Tablet -->
        <rect x="34" y="42" width="276" height="316" rx="10" fill="#c89d6c" stroke="#78350f" stroke-width="3" />
        <rect x="330" y="42" width="276" height="316" rx="10" fill="#c29563" stroke="#78350f" stroke-width="3" />
        <!-- Center fold crease & tie notches -->
        <line x1="320" y1="38" x2="320" y2="362" stroke="#451a03" stroke-width="5" stroke-dasharray="10 6" />
        <circle cx="52" cy="110" r="5" fill="#171311" />
        <circle cx="52" cy="290" r="5" fill="#171311" />
        <circle cx="588" cy="110" r="5" fill="#171311" />
        <circle cx="588" cy="290" r="5" fill="#171311" />

        <!-- Section 1: Left Leaf Opening -->
        <g class="ks2lab-svg-hit" data-pick-passage="0">
          <rect x="52" y="64" width="242" height="132" rx="8"
                fill="${pIdx === 0 ? 'rgba(254, 240, 138, 0.34)' : 'rgba(120, 53, 15, 0.1)'}"
                stroke="${state.decodedPassages.has('p1') ? '#15803d' : pIdx === 0 ? '#b91c1c' : '#78350f'}"
                stroke-width="2.5" />
          <text x="66" y="88" fill="#451a03" font-size="11" font-weight="900">1. SCRIBE’S OPENING (11 SEPT)</text>
          <text x="66" y="114" fill="#1c1917" font-family="Georgia, serif" font-style="italic" font-size="13">Cl. Severa Lepidinae suae</text>
          <text x="66" y="136" fill="#1c1917" font-family="Georgia, serif" font-style="italic" font-size="13">III Idus Septembres, soror,</text>
          <text x="66" y="158" fill="#1c1917" font-family="Georgia, serif" font-style="italic" font-size="13">ad diem sollemnem natalem...</text>
          <text x="66" y="183" fill="${state.decodedPassages.has('p1') ? '#14532d' : '#7c2d12'}" font-size="10.5" font-weight="900">
            ${state.decodedPassages.has('p1') ? '✓ Decoded: Birthday Party on 11 September' : 'Tap to Decode Passage 1'}
          </text>
        </g>

        <!-- Section 2: Warm Friendship Message -->
        <g class="ks2lab-svg-hit" data-pick-passage="1">
          <rect x="52" y="210" width="242" height="126" rx="8"
                fill="${pIdx === 1 ? 'rgba(254, 240, 138, 0.34)' : 'rgba(120, 53, 15, 0.1)'}"
                stroke="${state.decodedPassages.has('p2') ? '#15803d' : pIdx === 1 ? '#b91c1c' : '#78350f'}"
                stroke-width="2.5" />
          <text x="66" y="234" fill="#451a03" font-size="11" font-weight="900">2. FRONTIER FRIENDSHIP</text>
          <text x="66" y="260" fill="#1c1917" font-family="Georgia, serif" font-style="italic" font-size="13">...iucundiorem mihi diem</text>
          <text x="66" y="282" fill="#1c1917" font-family="Georgia, serif" font-style="italic" font-size="13">interventu tuo facturus...</text>
          <text x="66" y="304" fill="#1c1917" font-family="Georgia, serif" font-style="italic" font-size="13">Cerialem tuum saluta!</text>
          <text x="66" y="325" fill="${state.decodedPassages.has('p2') ? '#14532d' : '#7c2d12'}" font-size="10.5" font-weight="900">
            ${state.decodedPassages.has('p2') ? '✓ Decoded: Officers’ Families on the Wall' : 'Tap to Decode Passage 2'}
          </text>
        </g>

        <!-- Section 3: Claudia Severa's Personal Cursive Hand! -->
        <g class="ks2lab-svg-hit" data-pick-passage="2">
          <rect x="348" y="168" width="242" height="168" rx="8"
                fill="${pIdx === 2 ? 'rgba(254, 240, 138, 0.42)' : 'rgba(120, 53, 15, 0.14)'}"
                stroke="${state.decodedPassages.has('p3') ? '#15803d' : pIdx === 2 ? '#b91c1c' : '#78350f'}"
                stroke-width="3" />
          <text x="362" y="192" fill="#7f1d1d" font-size="11" font-weight="900">3. SECOND HAND (CLAUDIA’S PEN!)</text>
          <text x="362" y="222" fill="#0f172a" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="14">Sperabo te, soror.</text>
          <text x="362" y="246" fill="#0f172a" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="14">Vale, soror, anima mea,</text>
          <text x="362" y="270" fill="#0f172a" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="14">ita valeam karissima et have!</text>
          <text x="362" y="314" fill="${state.decodedPassages.has('p3') ? '#14532d' : '#991b1b'}" font-size="10.5" font-weight="900">
            ${state.decodedPassages.has('p3') ? '✓ Oldest Latin Writing by a Woman!' : 'Tap to Decode Claudia’s Own Hand'}
          </text>
        </g>

        <text x="469" y="96" text-anchor="middle" fill="#451a03" font-size="11.5" font-weight="900">Address on Back:</text>
        <text x="469" y="116" text-anchor="middle" fill="#292524" font-family="Georgia, serif" font-size="12.5">“To Sulpicia Lepidina, wife of Cerialis”</text>
      </svg>
    `;
  }

  function renderKitBagSVG() {
    return `
      <svg viewBox="0 0 640 400" class="ks2lab-svg-scene" role="img" aria-label="Roman frontier auxiliary soldier's leather kit bag and supply chest in chilly Northumberland">
        <rect x="0" y="0" width="640" height="400" fill="#131c2e" />
        <!-- Falling Northumberland rain streaks -->
        <line x1="80" y1="20" x2="62" y2="75" stroke="#60a5fa" stroke-width="2" opacity="0.4" />
        <line x1="210" y1="30" x2="192" y2="85" stroke="#60a5fa" stroke-width="2" opacity="0.4" />
        <line x1="460" y1="24" x2="442" y2="79" stroke="#60a5fa" stroke-width="2" opacity="0.4" />
        <line x1="560" y1="36" x2="542" y2="91" stroke="#60a5fa" stroke-width="2" opacity="0.4" />

        <!-- Leather Satchel / Kit Chest -->
        <rect x="110" y="92" width="420" height="256" rx="22" fill="#6b3410" stroke="#f59e0b" stroke-width="3.5" />
        <rect x="134" y="122" width="372" height="202" rx="14" fill="#291d18" stroke="#b45309" stroke-width="2" />
        <text x="320" y="62" text-anchor="middle" fill="#fde68a" font-size="15.5" font-weight="900">FRONTIER PARCEL (TAB. VINDOL. 346) AND FORT STORES</text>

        ${KIT_ITEMS.filter((k) => k.authentic)
          .map((k, idx) => {
            const packed = state.packedKit.has(k.id);
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const x = 154 + col * 172;
            const y = 140 + row * 86;
            return `
              <g class="ks2lab-svg-hit" data-kit-pick="${k.id}">
                <rect x="${x}" y="${y}" width="158" height="72" rx="10"
                      fill="${packed ? '#14532d' : '#1e293b'}"
                      stroke="${packed ? '#4ade80' : '#64748b'}" stroke-width="2" />
                <text x="${x + 26}" y="${y + 43}" text-anchor="middle" font-size="24">${k.icon}</text>
                <text x="${x + 48}" y="${y + 34}" fill="#f8fafc" font-size="10.5" font-weight="800">${packed ? '✓ Packed' : 'Tap to Pack'}</text>
                <text x="${x + 48}" y="${y + 51}" fill="#fde68a" font-size="9.5" font-weight="700">${k.name.split(' (')[0]}</text>
              </g>
            `;
          })
          .join('')}

        <text x="320" y="376" text-anchor="middle" fill="${state.mythSpotted ? '#86efac' : '#fca5a5'}" font-size="12" font-weight="800">
          ${state.mythSpotted ? '✓ Summer-Tunic Myth Busted! Frontier Soldiers Wore Wool Socks and Cloaks' : 'Remember to tap the Bare-Legged Summer Tunic Myth on the right to bust it!'}
        </text>
      </svg>
    `;
  }

  function renderEmpireFrontierSVG() {
    return `
      <svg viewBox="0 0 640 400" class="ks2lab-svg-scene" role="img" aria-label="Map connecting Hadrian's Wall in northern Britain with the Lower Rhine, Syria in the Middle East, and Mauretania in North Africa">
        <rect x="0" y="0" width="640" height="400" fill="#0d2238" />
        <!-- Stylised Britain, Europe, Mediterranean, Syria & North Africa landmasses -->
        <path d="M96 42 L166 42 L182 118 L112 126 Z" fill="#365314" stroke="#bef264" stroke-width="2" />
        <line x1="112" y1="68" x2="168" y2="68" stroke="#ef4444" stroke-width="4" />
        <text x="140" y="32" text-anchor="middle" fill="#fef08a" font-size="11.5" font-weight="900">HADRIAN’S WALL</text>

        <!-- Continental Europe / Lower Rhine -->
        <path d="M210 92 L455 88 L495 210 L215 215 Z" fill="#3f6212" stroke="#a3e635" stroke-width="1.5" />
        <!-- Syria / Middle East -->
        <path d="M495 170 L612 170 L612 292 L505 280 Z" fill="#78350f" stroke="#fcd34d" stroke-width="1.5" />
        <!-- North Africa / Mauretania -->
        <path d="M125 272 L475 282 L495 384 L105 384 Z" fill="#92400e" stroke="#fde68a" stroke-width="1.5" />

        <!-- Route arcs into Northern Britain -->
        <path d="M255 126 Q205 92 152 72" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6 4" />
        <path d="M548 228 Q360 150 156 72" fill="none" stroke="#fb923c" stroke-width="3" stroke-dasharray="6 4" />
        <path d="M215 322 Q150 210 140 74" fill="none" stroke="#4ade80" stroke-width="3" stroke-dasharray="6 4" />

        <circle cx="255" cy="126" r="8" fill="#38bdf8" stroke="#fff" stroke-width="2" />
        <text x="268" y="130" fill="#e0f2fe" font-size="11" font-weight="800">Batavia (Lower Rhine)</text>

        <circle cx="548" cy="228" r="8" fill="#fb923c" stroke="#fff" stroke-width="2" />
        <text x="548" y="252" text-anchor="middle" fill="#ffedd5" font-size="11" font-weight="800">Hama and Palmyra (Syria)</text>

        <circle cx="215" cy="322" r="8" fill="#4ade80" stroke="#fff" stroke-width="2" />
        <text x="215" y="346" text-anchor="middle" fill="#dcfce7" font-size="11" font-weight="800">Mauretania (North Africa)</text>

        <circle cx="152" cy="108" r="7" fill="#f472b6" stroke="#fff" stroke-width="2" />
        <text x="166" y="114" fill="#fce7f3" font-size="10.5" font-weight="800">Catuvellauni (Southern Britain)</text>
      </svg>
    `;
  }

  function renderTopBarHTML() {
    const curIdx = Math.max(0, STEPS.findIndex((s) => s.id === state.step));
    const prevId = curIdx > 0 ? STEPS[curIdx - 1].id : '';
    const nextId = curIdx < STEPS.length - 1 ? STEPS[curIdx + 1].id : '';

    return `
      <div class="ks2lab-step-strip" role="tablist" aria-label="Vindolanda Lab Stages">
        ${STEPS.map((s) => {
          const done = isStageComplete(s.id);
          const cls = state.step === s.id ? 'is-active' : done ? 'is-done' : '';
          return `<button type="button" class="ks2lab-step-pill ${cls}" data-step-go="${s.id}">${done && state.step !== s.id ? '✓ ' : ''}${s.short}</button>`;
        }).join('')}
      </div>

      <div class="ks2lab-mobile-nav">
        <button type="button" class="ks2lab-mob-arrow" data-step-go="${prevId}" ${!prevId ? 'disabled' : ''} aria-label="Previous Stage">◀</button>
        <select class="ks2lab-mobile-select" id="ks2-vin-mob-select" aria-label="Select Lab Stage">
          ${STEPS.map((s) => {
            const done = isStageComplete(s.id);
            return `<option value="${s.id}" ${state.step === s.id ? 'selected' : ''}>${done && state.step !== s.id ? '✓ ' : ''}${s.mob}</option>`;
          }).join('')}
        </select>
        <button type="button" class="ks2lab-mob-arrow" data-step-go="${nextId}" ${!nextId ? 'disabled' : ''} aria-label="Next Stage">▶</button>
      </div>

      <div class="ks2lab-ctrl-group">
        <span class="ks2lab-score-chip" title="Frontier Epigrapher Points">🪶 ${state.score} pts</span>
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
            <div class="ks2lab-svg-frame" style="aspect-ratio:16/10;display:flex;align-items:center;justify-content:center;background:#0d1017;padding:10px;">
              <img src="${ASSETS.tablet291}" alt="Claudia Severa's wooden ink birthday invitation tablet Tab. Vindol. 291 from Vindolanda showing ancient cursive Latin ink lines on thin birch wood" class="archival-image" style="width:100%;height:100%;object-fit:contain;" />
            </div>
            <div class="ks2lab-plate-caption" style="font-size:0.78rem;color:#cbd5e1;">
              <strong>British Museum Primary Artefact (Tab. Vindol. 291):</strong> Folded birch-wood leaf tablet written in carbon ink around AD 100—holding the oldest surviving Latin handwriting by a woman!
            </div>
          </div>

          <div class="ks2lab-cover-info">
            <div>
              <div class="ks2lab-kicker">🪶 KS2 INTERACTIVE STORYBOOK LAB • ROMAN FRONTIER BRITAIN (c. AD 100)</div>
              <h2 class="ks2lab-hero-title">Ink on the Frontier: The Vindolanda Postbag Lab</h2>
              <p class="ks2lab-hero-sub">
                Step onto the windy northern frontier near Hadrian’s Wall! Inspect Vindolanda’s raised stone granaries and waterlogged fort ditch, decode Claudia Severa’s birthday party invitation, pack a chilly soldier’s woollen socks, and meet families from Syria, North Africa, and Europe!
              </p>
              <div class="ks2lab-badge-row">
                <span class="ks2lab-badge">1. Frontier Fort Map</span>
                <span class="ks2lab-badge">2. Birthday Tablet 291</span>
                <span class="ks2lab-badge">3. Winter Kit Parcel</span>
                <span class="ks2lab-badge">4. Empire-Wide Voices</span>
                <span class="ks2lab-badge">5. Epigrapher Dispatch</span>
              </div>
            </div>
            <button type="button" class="ks2lab-cta-primary" data-step-go="stage1">
              <span>📜 Open Roman Postbag (Stage 1)</span>
            </button>
          </div>
        </div>
      `;
    }

    if (state.step === 'stage1') {
      const zone = FORT_ZONES.find((z) => z.id === state.activeFortZone) || FORT_ZONES[0];
      return `
        <div class="ks2lab-workspace">
          <div class="ks2lab-visual-col">
            <div class="ks2lab-svg-frame">${renderFortMapSVG()}</div>
            <div class="ks2lab-hotspot-strip">
              ${FORT_ZONES.map((z, idx) => {
                const found = state.fortZonesFound.has(z.id);
                const active = state.activeFortZone === z.id;
                return `
                  <button type="button" class="ks2lab-spot-chip ${active ? 'is-active' : ''} ${found ? 'is-found' : ''}" data-fort-zone="${z.id}">
                    <span>${idx + 1}. ${z.icon} ${z.label}</span>
                    <span class="ks2lab-spot-status">${found ? '✓ Logged' : 'Inspect'}</span>
                  </button>
                `;
              }).join('')}
            </div>
            <div class="ks2lab-plate-card">
              <div class="ks2lab-plate-frame">
                <img src="${ASSETS.fortRuins}" alt="Low stone wall foundations and room layouts of Vindolanda Roman Fort set against green Northumberland hills" class="archival-image" />
              </div>
              <div>
                <div class="ks2lab-plate-kicker">Fieldwork Plate • Vindolanda Fort, Northumberland</div>
                <p class="ks2lab-plate-caption">Stone foundations of Vindolanda along the Stanegate frontier, beneath which earlier timber forts and ink tablets lay sealed in wet mud.</p>
              </div>
            </div>
          </div>

          <div class="ks2lab-panel-col">
            <div class="ks2lab-card">
              <span class="ks2lab-card-kicker">Stage 1 of 5 • Garrison Inspector (${state.fortZonesFound.size}/4 Zones)</span>
              <h3 class="ks2lab-card-title">Garrison on the Northern Frontier</h3>
              <p class="ks2lab-card-prose">
                Before Emperor Hadrian began his 73-mile stone Wall in AD 122, forts like Vindolanda guarded the northern road. Inspect all four numbered zones!
              </p>
              <div class="ks2lab-detail-box">
                <h4 class="ks2lab-detail-title">${zone.icon} ${zone.detailTitle}</h4>
                <p class="ks2lab-detail-text">${zone.detailText}</p>
              </div>
            </div>

            <div class="ks2lab-card">
              <span class="ks2lab-card-kicker">Quick Check • Unlock Stage 1 Completion</span>
              <p class="ks2lab-quiz-q">Why did Roman engineers raise Vindolanda’s granary floor on short stone pillars AND build the bathhouse outside the walls?</p>
              <div class="ks2lab-opt-stack">
                <button type="button" class="ks2lab-opt-btn ${state.stage1Check === 'correct' ? 'is-correct' : ''}" data-s1-check="correct">
                  Under-floor air kept grain dry and mouse-free, while keeping hot bath furnaces outside protected the fort from fire!
                </button>
                <button type="button" class="ks2lab-opt-btn ${state.stage1Check === 'wrong' ? 'is-wrong' : ''}" data-s1-check="wrong">
                  Soldiers were banned from eating wheat or washing inside Roman Britain.
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (state.step === 'stage2') {
      const passage = TABLET_PASSAGES[state.activePassageIdx] || TABLET_PASSAGES[0];
      const isSolved = state.decodedPassages.has(passage.id);

      return `
        <div class="ks2lab-workspace">
          <div class="ks2lab-visual-col">
            <div class="ks2lab-svg-frame">${renderBirchTabletSVG()}</div>
            <div class="ks2lab-plate-card">
              <div class="ks2lab-plate-frame">
                <img src="${ASSETS.tablet291}" alt="Real Vindolanda wooden birthday invitation Tab. Vindol. 291 showing Claudia Severa's cursive Latin ink postscript in the lower right corner" class="archival-image" />
              </div>
              <div>
                <div class="ks2lab-plate-kicker">Primary Ink Evidence • Tab. Vindol. 291</div>
                <p class="ks2lab-plate-caption">Notice how the neat scribe’s handwriting on the left changes in the lower right corner where Claudia Severa took the pen herself!</p>
              </div>
            </div>
          </div>

          <div class="ks2lab-panel-col">
            <div class="ks2lab-card">
              <span class="ks2lab-card-kicker">Stage 2 of 5 • Wooden Leaf-Tablet Decoder (${state.decodedPassages.size}/3 Passages)</span>
              <h3 class="ks2lab-card-title">Decode Claudia Severa’s Birthday Invitation</h3>
              <div class="ks2lab-sim-steps">
                ${TABLET_PASSAGES.map((p, idx) => {
                  const solved = state.decodedPassages.has(p.id);
                  const active = state.activePassageIdx === idx;
                  return `
                    <button type="button" class="ks2lab-sim-btn ${active ? 'is-active' : ''} ${solved ? 'is-done' : ''}" data-pick-passage="${idx}">
                      <span>${idx + 1}. ${p.sectionLabel}</span>
                      <span>${solved ? '✓ Decoded' : 'Read'}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              <div class="ks2lab-detail-box">
                <h4 class="ks2lab-detail-title">${passage.sectionLabel}</h4>
                <p class="ks2lab-detail-text" style="font-style:italic;color:#fde68a;">${passage.latin}</p>
              </div>

              <div class="ks2lab-opt-stack">
                ${passage.options
                  .map((o) => {
                    const cls =
                      isSolved && o.correct
                        ? 'is-correct'
                        : state.wrongPassageChoice === `${passage.id}:${o.id}`
                          ? 'is-wrong'
                          : '';
                    return `<button type="button" class="ks2lab-opt-btn ${cls}" data-decode-opt="${o.id}">${o.label}</button>`;
                  })
                  .join('')}
              </div>

              ${isSolved ? `<p class="ks2lab-quiz-feedback">✓ ${passage.note}</p>` : ''}
            </div>
          </div>
        </div>
      `;
    }

    if (state.step === 'stage3') {
      const selItem = KIT_ITEMS.find((k) => k.id === state.selectedKitId) || KIT_ITEMS[0];

      return `
        <div class="ks2lab-workspace">
          <div class="ks2lab-visual-col">
            <div class="ks2lab-svg-frame">${renderKitBagSVG()}</div>
            <div class="ks2lab-plate-card">
              <div class="ks2lab-plate-frame">
                <img src="${ASSETS.pepperPot}" alt="Roman silver gilt Empress pepper pot from the Hoxne Hoard illustrating luxury spice trade into Roman Britain" class="archival-image" />
              </div>
              <div>
                <div class="ks2lab-plate-kicker">Roman Luxury Trade • Imported Black Pepper</div>
                <p class="ks2lab-plate-caption">Alongside warm woollen socks, Vindolanda tablets record an officer buying pepper shipped across the Empire—like the spices held in this Roman silver pepper pot!</p>
              </div>
            </div>
          </div>

          <div class="ks2lab-panel-col">
            <div class="ks2lab-card">
              <span class="ks2lab-card-kicker">Stage 3 of 5 • Quartermaster’s Kit (${state.packedKit.size}/4 Packed + ${state.mythSpotted ? '1/1' : '0/1'} Myth Busted)</span>
              <h3 class="ks2lab-card-title">Pack a Chilly Frontier Soldier’s Parcel</h3>
              <p class="ks2lab-card-prose">
                Tap all four real items recorded on Vindolanda tablets to pack the winter satchel—and tap the Hollywood summer-tunic myth to bust it!
              </p>

              <div class="ks2lab-sim-steps">
                ${KIT_ITEMS.map((item) => {
                  const isDone = item.authentic ? state.packedKit.has(item.id) : state.mythSpotted;
                  const cls = isDone ? (item.authentic ? 'is-done' : 'is-wrong') : '';
                  return `
                    <button type="button" class="ks2lab-sim-btn ${cls}" data-kit-pick="${item.id}">
                      <span>${item.icon} ${item.name}</span>
                      <span>${
                        isDone
                          ? item.authentic
                            ? '✓ Packed'
                            : '✗ Myth Busted!'
                          : 'Inspect'
                      }</span>
                    </button>
                  `;
                }).join('')}
              </div>

              <div class="ks2lab-detail-box">
                <h4 class="ks2lab-detail-title">${selItem.icon} ${selItem.name}</h4>
                <p class="ks2lab-detail-text">${selItem.detail}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (state.step === 'stage4') {
      const doneAll = state.matchedProfiles.size >= FRONTIER_PROFILES.length;
      const curProfile =
        FRONTIER_PROFILES.find((p) => !state.matchedProfiles.has(p.id)) ||
        FRONTIER_PROFILES[FRONTIER_PROFILES.length - 1];

      return `
        <div class="ks2lab-workspace">
          <div class="ks2lab-visual-col">
            <div class="ks2lab-svg-frame">${renderEmpireFrontierSVG()}</div>
            <div class="ks2lab-plate-card">
              <div class="ks2lab-plate-frame">
                <img src="${ASSETS.reginaStone}" alt="Carved sandstone tombstone of Regina at Arbeia Roman Fort showing seated Regina with jewellery box and wool basket above Latin and Palmyrene Aramaic inscriptions" class="archival-image" />
              </div>
              <div>
                <div class="ks2lab-plate-kicker">Arbeia Tombstone • Regina and Barates</div>
                <p class="ks2lab-plate-caption">Carved at Arbeia (South Shields) with both Latin letters and Palmyrene script from Syria: Barates of Palmyra mourning his British Catuvellauni wife Regina.</p>
              </div>
            </div>
          </div>

          <div class="ks2lab-panel-col">
            <div class="ks2lab-card">
              <span class="ks2lab-card-kicker">Stage 4 of 5 • Diverse Frontier Matcher (${state.matchedProfiles.size}/${FRONTIER_PROFILES.length} Matched)</span>
              <h3 class="ks2lab-card-title">Who Lived Beside Hadrian’s Wall?</h3>
              <p class="ks2lab-card-prose">
                Match each real regiment or frontier family to their homeland across the Roman Empire!
              </p>

              ${
                doneAll
                  ? `
                <div class="ks2lab-detail-box" style="border-left-color:#22c55e;">
                  <h4 class="ks2lab-detail-title">✓ All 4 Frontier Profiles Matched!</h4>
                  <p class="ks2lab-detail-text">
                    From Batavian horsemen and Syrian archers to North African Moors and British-Syrian families in the vicus towns, Hadrian’s Wall brought three continents together!
                  </p>
                </div>
              `
                  : `
                <div class="ks2lab-sorter-prompt">
                  <div>
                    <div class="ks2lab-card-kicker">Profile ${state.matchedProfiles.size + 1} of ${FRONTIER_PROFILES.length}</div>
                    <h4 class="ks2lab-detail-title" style="font-size:1rem;margin-top:2px;">${curProfile.person}</h4>
                    <p class="ks2lab-detail-text" style="margin-top:4px;">${curProfile.clue}</p>
                  </div>
                  <div class="ks2lab-opt-stack" style="margin-top:8px;">
                    ${ORIGIN_CHOICES.map(
                      (c) =>
                        `<button type="button" class="ks2lab-opt-btn" data-match-origin="${c.id}">${c.label}</button>`,
                    ).join('')}
                  </div>
                </div>
              `
              }

              ${
                state.profileFeedback
                  ? `<p class="ks2lab-quiz-feedback" style="border-left:3px solid ${state.profileFeedbackWrong ? '#ef4444' : '#22c55e'};">${state.profileFeedback}</p>`
                  : ''
              }
            </div>
          </div>
        </div>
      `;
    }

    // Stage 5: Frontier Archivist's Dispatch
    const allSolved = isStageComplete('stage5');
    return `
      <div>
        <div class="ks2lab-card" style="margin-bottom:14px;">
          <div class="ks2lab-card-header">
            <span class="ks2lab-card-kicker">Stage 5 of 5 • Frontier Archivist’s Primary-Evidence Dispatch</span>
            <span class="ks2lab-badge">${state.dispatchCredited.size}/4 Verified</span>
          </div>
          <h3 class="ks2lab-card-title">Seal Your Vindolanda Frontier Report</h3>
          <p class="ks2lab-card-prose">
            Verify all four primary-evidence conclusions from Vindolanda and Hadrian’s Wall to earn your Roman Frontier Epigrapher Certificate!
          </p>
        </div>

        <div class="ks2lab-quiz-grid">
          ${DISPATCH_QUESTIONS.map((q) => {
            const picked = state.dispatchAnswers[q.id];
            const solved = q.options.some((o) => o.id === picked && o.correct);
            return `
              <div class="ks2lab-quiz-card ${solved ? 'is-solved' : ''}">
                <p class="ks2lab-quiz-q">${q.question}</p>
                <div class="ks2lab-opt-stack">
                  ${q.options
                    .map((o) => {
                      let cls = '';
                      if (picked === o.id) cls = o.correct ? 'is-correct' : 'is-wrong';
                      return `<button type="button" class="ks2lab-opt-btn ${cls}" data-dispatch-q="${q.id}" data-dispatch-opt="${o.id}">${o.label}</button>`;
                    })
                    .join('')}
                </div>
                ${
                  picked
                    ? `<p class="ks2lab-quiz-feedback">${solved ? `✓ ${q.feedback}` : 'Check the Vindolanda ink tablets and Arbeia carvings, then try the other option!'}</p>`
                    : ''
                }
              </div>
            `;
          }).join('')}
        </div>

        ${
          allSolved
            ? `
          <div class="ks2lab-cert-banner">
            <div>
              <div class="ks2lab-kicker" style="color:#fde047;">🏅 IMPERIAL FRONTIER ARCHIVE • THE HISTORY REVISION HUB</div>
              <h3 class="ks2lab-card-title" style="font-size:1.35rem;">Roman Frontier Epigrapher Certificate Unlocked!</h3>
              <div class="ks2lab-cert-pillars">
                <span class="ks2lab-cert-pill">✓ Vindolanda Garrison Engineering</span>
                <span class="ks2lab-cert-pill">✓ Claudia Severa’s Birthday Tablet</span>
                <span class="ks2lab-cert-pill">✓ Tab. Vindol. 346 Winter Parcel</span>
                <span class="ks2lab-cert-pill">✓ Multi-Continental Frontier Life</span>
              </div>
            </div>
            <button type="button" class="ks2lab-print-btn" data-action="print-cert">
              🖨️ Print Epigrapher Certificate
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

    let statusMsg = '<strong>Cover</strong> • Ready to open the Vindolanda postbag';
    if (state.step === 'stage1') {
      statusMsg = curDone
        ? '<strong>✓ Stage 1 Complete!</strong> Fort layout verified'
        : `<strong>Stage 1 of 5</strong> • Inspect ${state.fortZonesFound.size}/4 fort zones + Quick Check`;
    } else if (state.step === 'stage2') {
      statusMsg = curDone
        ? '<strong>✓ Stage 2 Complete!</strong> Tablet 291 decoded'
        : `<strong>Stage 2 of 5</strong> • Decoded ${state.decodedPassages.size}/3 ink passages`;
    } else if (state.step === 'stage3') {
      statusMsg = curDone
        ? '<strong>✓ Stage 3 Complete!</strong> Winter kit packed & myth busted'
        : `<strong>Stage 3 of 5</strong> • Packed ${state.packedKit.size}/4 supplies + ${state.mythSpotted ? '1/1' : '0/1'} myth check`;
    } else if (state.step === 'stage4') {
      statusMsg = curDone
        ? '<strong>✓ Stage 4 Complete!</strong> Empire voices matched'
        : `<strong>Stage 4 of 5</strong> • Matched ${state.matchedProfiles.size}/${FRONTIER_PROFILES.length} frontier profiles`;
    } else if (state.step === 'stage5') {
      statusMsg = curDone
        ? `<strong>🏆 Lab Complete!</strong> Final Score: ${state.score} pts`
        : `<strong>Stage 5 of 5</strong> • Verified ${state.dispatchCredited.size}/4 dispatch questions`;
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

  function render(scrollToTop = false) {
    if (unmounted || !shellEl) return;
    shellEl.classList.toggle('ks2lab-is-fullscreen', state.isFullscreen);

    const mutate = () => {
      const topEl = shellEl.querySelector('#ks2-vin-topbar');
      const speechEl = shellEl.querySelector('#ks2-vin-speech');
      const bodyEl = shellEl.querySelector('#ks2-vin-body');
      const navEl = shellEl.querySelector('#ks2-vin-bottom');
      if (topEl) topEl.innerHTML = renderTopBarHTML();
      if (speechEl) speechEl.innerHTML = renderSpeechBarHTML();
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

  container.innerHTML = `
    <div class="ks2lab-shell theme-vindolanda ${state.isFullscreen ? 'ks2lab-is-fullscreen' : ''}">
      <div class="ks2lab-topbar" id="ks2-vin-topbar"></div>
      <div class="ks2lab-speech-bar" id="ks2-vin-speech" aria-live="polite"></div>
      <div class="ks2lab-stage-slot" id="ks2-vin-body"></div>
      <div class="ks2lab-bottom-nav" id="ks2-vin-bottom"></div>
    </div>
  `;

  shellEl = container.querySelector('.ks2lab-shell');
  scrollLock.bindShellPointerGuards(shellEl);

  shellEl.addEventListener('change', (e) => {
    const sel = e.target.closest('#ks2-vin-mob-select');
    if (sel && sel.value) {
      sound.click();
      goToStep(sel.value);
    }
  });

  shellEl.addEventListener('click', (e) => {
    const stepBtn = e.target.closest('[data-step-go]');
    if (stepBtn) {
      const target = stepBtn.getAttribute('data-step-go');
      if (target) {
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

    // Stage 1: Fort zones
    const fzEl = e.target.closest('[data-fort-zone]');
    if (fzEl) {
      const zId = fzEl.getAttribute('data-fort-zone');
      const z = FORT_ZONES.find((item) => item.id === zId);
      if (!z) return;
      state.activeFortZone = z.id;
      if (!state.fortZonesFound.has(z.id)) {
        state.fortZonesFound.add(z.id);
        addScore(10);
      }
      sound.click();
      say(z.icon, z.speaker, z.quote, !sound.muted);
      save();
      render(false);
      return;
    }

    const s1Btn = e.target.closest('[data-s1-check]');
    if (s1Btn) {
      const v = s1Btn.getAttribute('data-s1-check');
      if (v === 'correct') {
        if (state.stage1Check !== 'correct') addScore(15);
        state.stage1Check = 'correct';
        sound.success();
        say(
          '🌾',
          'Optio Marcus • Fort Quartermaster',
          'Exactement—or as we say in Latin, optime! Dry grain inside the walls and safe bath furnaces outside kept every frontier fort running.',
          !sound.muted,
        );
      } else {
        state.stage1Check = 'wrong';
        sound.warn();
        say(
          '🏛️',
          'Prefect Flavius Cerialis',
          'Check our granary pillars and bathhouse again—soldiers relied on daily bread rations and hot baths!',
          !sound.muted,
        );
      }
      save();
      render(false);
      return;
    }

    // Stage 2: Tablet 291 Decoder
    const pickPassEl = e.target.closest('[data-pick-passage]');
    if (pickPassEl) {
      const idx = Number(pickPassEl.getAttribute('data-pick-passage'));
      if (TABLET_PASSAGES[idx]) {
        state.activePassageIdx = idx;
        state.wrongPassageChoice = '';
        sound.quill();
        say(
          '💌',
          'Claudia Severa • Tablet 291',
          `Inspecting ${TABLET_PASSAGES[idx].sectionLabel}—choose the matching English translation on the right!`,
          !sound.muted,
        );
        save();
        render(false);
      }
      return;
    }

    const decBtn = e.target.closest('[data-decode-opt]');
    if (decBtn) {
      const optId = decBtn.getAttribute('data-decode-opt');
      const passage = TABLET_PASSAGES[state.activePassageIdx];
      const chosen = passage?.options.find((o) => o.id === optId);
      if (!passage || !chosen) return;
      if (chosen.correct) {
        state.wrongPassageChoice = '';
        if (!state.decodedPassages.has(passage.id)) {
          state.decodedPassages.add(passage.id);
          addScore(15);
        }
        sound.success();
        say('💌', 'Claudia Severa • Decoded!', passage.note, !sound.muted);
        if (state.activePassageIdx < TABLET_PASSAGES.length - 1) {
          const nextUnsolved = TABLET_PASSAGES.findIndex((p) => !state.decodedPassages.has(p.id));
          if (nextUnsolved !== -1) state.activePassageIdx = nextUnsolved;
        }
      } else {
        state.wrongPassageChoice = `${passage.id}:${optId}`;
        sound.warn();
        say(
          '🪶',
          'Dr Hannah Ross • Latin Clue',
          'Look closely at words like Septembres, natalem (birthday), Cerialem, and soror (sister)!',
          !sound.muted,
        );
      }
      save();
      render(false);
      return;
    }

    // Stage 3: Soldier's Frontier Kit
    const kitEl = e.target.closest('[data-kit-pick]');
    if (kitEl) {
      const kId = kitEl.getAttribute('data-kit-pick');
      const item = KIT_ITEMS.find((k) => k.id === kId);
      if (!item) return;
      state.selectedKitId = item.id;
      if (item.authentic) {
        if (!state.packedKit.has(item.id)) {
          state.packedKit.add(item.id);
          addScore(10);
        }
        sound.success();
        say(item.icon, `Packed • ${item.name}`, item.detail, !sound.muted);
      } else {
        if (!state.mythSpotted) {
          state.mythSpotted = true;
          addScore(15);
        }
        sound.warn();
        say('🥶', 'Myth Busted • Chilly Northumberland!', item.detail, !sound.muted);
      }
      save();
      render(false);
      return;
    }

    // Stage 4: Empire Voices Matcher
    const matchBtn = e.target.closest('[data-match-origin]');
    if (matchBtn) {
      const originId = matchBtn.getAttribute('data-match-origin');
      const curProfile = FRONTIER_PROFILES.find((p) => !state.matchedProfiles.has(p.id));
      if (!curProfile) return;
      if (originId === curProfile.originId) {
        state.matchedProfiles.add(curProfile.id);
        state.profileFeedback = `✓ ${curProfile.explain}`;
        state.profileFeedbackWrong = false;
        addScore(14);
        sound.success();
        say('🌍', curProfile.person, curProfile.explain, !sound.muted);
      } else {
        state.profileFeedback = `Not quite! Re-read the inscription clue for ${curProfile.person}.`;
        state.profileFeedbackWrong = true;
        sound.warn();
        say(
          '🔎',
          'Barates of Palmyra',
          `Check the clue carefully for ${curProfile.person}—look for Rhine delta, Syrian archers, Mauretania, or Palmyra + Catuvellauni!`,
          !sound.muted,
        );
      }
      save();
      render(false);
      return;
    }

    // Stage 5: Dispatch Questions
    const dispBtn = e.target.closest('[data-dispatch-q]');
    if (dispBtn) {
      const qId = dispBtn.getAttribute('data-dispatch-q');
      const optId = dispBtn.getAttribute('data-dispatch-opt');
      const q = DISPATCH_QUESTIONS.find((item) => item.id === qId);
      const opt = q?.options.find((o) => o.id === optId);
      if (!q || !opt) return;
      state.dispatchAnswers[qId] = optId;
      if (opt.correct) {
        if (!state.dispatchCredited.has(qId)) {
          state.dispatchCredited.add(qId);
          addScore(state.dispatchHadWrong.has(qId) ? 8 : 15);
        }
        sound.success();
        say('🏅', 'Dr Hannah Ross • Dispatch Verified', q.feedback, !sound.muted);
      } else {
        state.dispatchHadWrong.add(qId);
        sound.warn();
        say('🔎', 'Dr Hannah Ross • Check Your Tablets', 'Re-check your Vindolanda evidence and try the other statement!', !sound.muted);
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
    sound.destroy();
  };
}
