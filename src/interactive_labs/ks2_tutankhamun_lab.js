/**
 * CANDLELIGHT IN THE VALLEY: Opening Tomb KV62 (November 1922)
 * Target Lesson Hook: `ks2_ancient_egypt:lesson_6:1` (Enquiry 6: Tutankhamun's Tomb and Cleopatra VII)
 *
 * 5 Interactive Stages:
 *  - Stage 1: Sixteen Buried Steps in the Valley of the Kings (4 Nov 1922 steps & intact necropolis seal)
 *  - Stage 2: "Can You See Anything?" — The Candlelight Peephole (60 FPS torch pan across the Antechamber)
 *  - Stage 3: Ten Years of Careful Conservation — Not Treasure-Grabbing! (620 groups / 5,000+ items lab workflow)
 *  - Stage 4: Nested Shrines, Three Coffins and Royal Cartouche Decoder (4 shrines -> sarcophagus -> 110 kg gold coffin + mask)
 *  - Stage 5: Egyptologist's Field Journal and KV62 Field Egyptologist Certificate
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

const SESSION_KEY = 'hh_ks2_tutankhamun_lab_v1';
const UNIT_ID = 'ks2_ancient_egypt';
const LAB_ID = 'ks2_tutankhamun_lab';

const ASSETS = {
  chariotChest: '/units/ks2_ancient_egypt/assets/tutankhamun_painted_chariot_chest.jpg',
  valleyCliffs: '/units/ks2_ancient_egypt/assets/valley_of_the_kings_cliffs.jpg',
  anubisStatue: '/units/ks2_ancient_egypt/assets/anubis_jackal_shrine_statue.jpg',
  goldenThrone: '/units/ks2_ancient_egypt/assets/tutankhamun_golden_throne.jpg',
  carterShrine: '/units/ks2_ancient_egypt/assets/howard_carter_opening_shrine_1923.jpg',
  deathMask: '/units/ks2_ancient_egypt/assets/tutankhamun_golden_death_mask.jpg',
  hieroglyphs: '/units/ks2_ancient_egypt/assets/karnak_carved_hieroglyphs.jpg',
};

const preloadStageAssets = createStageAssetPreloader({
  cover: [ASSETS.chariotChest, ASSETS.valleyCliffs],
  stage1: [ASSETS.valleyCliffs, ASSETS.goldenThrone],
  stage2: [ASSETS.goldenThrone, ASSETS.anubisStatue, ASSETS.carterShrine],
  stage3: [ASSETS.carterShrine, ASSETS.deathMask],
  stage4: [ASSETS.deathMask, ASSETS.hieroglyphs],
  stage5: [ASSETS.deathMask],
});

const STEPS = [
  { id: 'cover', short: '🕯️ Cover', mob: 'Cover • Tomb KV62' },
  { id: 'prologue', short: '🎬 Opening', mob: '🎬 Opening' },
  { id: 'stage1', short: '1. Sixteen Steps', mob: '1/5 Buried Steps' },
  { id: 'stage2', short: '2. Peephole', mob: '2/5 Candle Peephole' },
  { id: 'stage3', short: '3. Conservation', mob: '3/5 Conservation' },
  { id: 'stage4', short: '4. Shrines & Name', mob: '4/5 Shrines & Name' },
  { id: 'stage5', short: '5. Field Journal', mob: '5/5 Field Journal' },
  { id: 'epilogue', short: '🎬 Ending', mob: '🎬 Ending' },
];

const KV62_PROLOGUE = [
  {
    voClip: 'kv62_pro_1',
    credit: 'THE HISTORY REVISION HUB PRESENTS • VALLEY OF THE KINGS, 4 NOV 1922',
    heading: 'A Step Under the Desert Rubble',
    img: ASSETS.valleyCliffs,
    alt: 'Limestone cliffs of the Valley of the Kings near Luxor',
    caption: 'Valley of the Kings, Egypt • Hidden beneath ancient workmen’s huts for over three thousand years',
    narration:
      'On 4 November 1922, beneath ancient stone huts and limestone chippings, Egyptian excavators strike a single smooth step cut straight into the white desert rock.',
  },
  {
    voClip: 'kv62_pro_2',
    credit: '26 NOVEMBER 1922 • “WONDERFUL THINGS”',
    heading: 'Intact Royal Necropolis Seals',
    img: ASSETS.chariotChest,
    alt: 'Painted wooden chest discovered inside Tutankhamun tomb KV62',
    caption: 'Tomb KV62 Antechamber • Over 5,000 fragile objects requiring ten years of scientific conservation',
    narration:
      'Sixteen steps down stands a plastered doorway stamped with intact jackal-and-captives seals! Hold up a flickering candle and discover how real archaeology preserved Tutankhamun’s tomb.',
  },
];

const KV62_EPILOGUE = [
  {
    voClip: 'kv62_end_1',
    credit: 'FINALE SCENE 1 OF 2 • TEN YEARS OF PATIENT SCIENCE',
    heading: 'Over 5,000 Fragile Wonders Saved',
    img: ASSETS.carterShrine,
    alt: 'Howard Carter examining the gilded shrines inside Tomb KV62 in 1923',
    caption: 'KV62 Laboratory (1922–1932) • Photographed, numbered, waxed, and conserved before anything was moved',
    narration:
      'Had excavators grabbed treasures in a hurry, wood, linen, and leather would have crumbled to dust. Instead, Egyptian foremen, Howard Carter, photographer Harry Burton, and chemist Alfred Lucas worked for ten careful years!',
  },
  {
    voClip: 'kv62_end_2',
    credit: 'FINALE SCENE 2 OF 2 • JOURNEY THROUGH THE DUAT',
    heading: 'Living Image of Amun',
    img: ASSETS.deathMask,
    alt: 'Solid gold funerary mask of Pharaoh Tutankhamun inlaid with lapis lazuli and glass',
    caption: 'Tutankhamun’s Funerary Mask • Protecting the young pharaoh on his eternal journey into the afterlife',
    narration:
      'Nested inside four gilded shrines and three coffins rested the iconic gold mask—guiding teenage Pharaoh Tutankhamun safely into eternal life!',
  },
];

const EXCAVATION_CLUES = [
  {
    id: 'rubble',
    label: 'Rubble Shield Above KV62',
    icon: '⛰️',
    speaker: 'Reis Ahmed Gerigar • Senior Egyptian Foreman',
    quote:
      'See those ancient workmen’s stone huts? Centuries after Tutankhamun died in 1323 BC, builders cutting Ramesses VI’s huge tomb dumped tonnes of limestone chippings right over KV62!',
    detailTitle: 'Hidden Beneath Ancient Workmen’s Huts',
    detailText:
      'While giant royal tombs higher in the cliffs were emptied by ancient robbers, rubble hid teenage Tutankhamun’s small staircase from sight.',
  },
  {
    id: 'step1',
    label: '4 Nov 1922: First Limestone Step',
    icon: '🪜',
    speaker: 'Hussein Abdel Rassoul • Young Water-Carrier (1922)',
    quote:
      'While hollowing sand to steady heavy clay water-jars for the diggers on 4 November 1922, we struck a smooth horizontal step cut straight into the white valley rock!',
    detailTitle: '4 November 1922 • Top Step Uncovered',
    detailText:
      'Clearing beneath the ancient huts revealed the top step of a sunken staircase descending straight into the bedrock of the Valley of the Kings.',
  },
  {
    id: 'stairs16',
    label: 'Sixteen Descending Steps',
    icon: '⛏️',
    speaker: 'Howard Carter • Chief Archaeologist',
    quote:
      'Step by step our Egyptian excavators cleared sixteen steep rock-cut stairs until the whole blocked, plastered doorway stood exposed in the canyon shadow!',
    detailTitle: 'Sixteen Steep Rock-Cut Stairs',
    detailText:
      'At the bottom of the sixteen-step flight stood a sealed wall of stones coated with ancient mud plaster.',
  },
  {
    id: 'seal',
    label: 'Intact Jackal-and-Captives Seal',
    icon: '🐺',
    speaker: 'Howard Carter • Chief Archaeologist',
    quote:
      'My heart leapt! Stamped into the lower plaster were intact royal necropolis seals—a crouching Anubis jackal above nine bound captives—plus Tutankhamun’s royal cartouche!',
    detailTitle: 'Royal Necropolis Seal (Jackal Above Nine Captives)',
    detailText:
      'Although ancient priests had resealed a small outer breach over 3,000 years ago, the intact royal seals proved the burial inside had not been stripped!',
  },
];

const PEEPHOLE_SPOTS = [
  {
    id: 'couches',
    label: 'Gilded Animal Couches',
    icon: '🦁',
    cx: 22,
    cy: 56,
    plate: ASSETS.anubisStatue,
    plateCaption:
      'Sacred Egyptian animal imagery like this gilded jackal figure guarded pharaohs on their journey into the afterlife.',
    quote:
      'Strange animals, statues, and gold—everywhere the glint of gold! Three tall gilded couches carved with lion heads, spotted cow horns, and hippo jaws loom out of the shadows!',
    detail:
      'Three ceremonial gilded beds with stretched lion, sacred cow, and hippo-creature sides stood stacked against the west wall of the Antechamber.',
  },
  {
    id: 'chariots',
    label: 'Disassembled Golden Chariots',
    icon: '🛞',
    cx: 48,
    cy: 68,
    plate: ASSETS.chariotChest,
    plateCaption:
      'Painted wooden chest from tomb KV62 depicting young Pharaoh Tutankhamun riding swiftly in his two-horse chariot.',
    quote:
      'Tucked into the south-east corner lie six dazzling chariots—their wooden wheels and gold-sheeted axles taken apart so priests could carry them down the narrow corridor!',
    detail:
      'Because the tomb passage was narrow, ancient funeral workers unbolted the wheels and stacked six royal parade and hunting chariots inside.',
  },
  {
    id: 'throne',
    label: 'Alabaster Cups and Golden Throne',
    icon: '👑',
    cx: 45,
    cy: 36,
    plate: ASSETS.goldenThrone,
    plateCaption:
      'Backrest of Tutankhamun’s gilded wooden throne from KV62 showing Queen Ankhesenamun anointing the young king’s shoulder under sunbeams.',
    quote:
      'Look beneath the lion couch! Translucent white alabaster lotus cups sit beside a gleaming throne inlaid with coloured glass, silver, and sheet gold!',
    detail:
      'Carved white calcite wishing-cups and Tutankhamun’s famous golden throne had waited untouched in the dry darkness since 1323 BC.',
  },
  {
    id: 'guardians',
    label: 'Twin Black-and-Gold Guardians',
    icon: '🛡️',
    cx: 80,
    cy: 48,
    plate: ASSETS.carterShrine,
    plateCaption:
      'Beyond the sealed wall guarded by the twin statues stood the giant gilded wooden shrines opened carefully by Carter’s team in 1923.',
    quote:
      'Facing each other like sentries stand two life-sized black-resined statues of the king wearing golden kilts and sandals—guarding a sealed wall to the Burial Chamber!',
    detail:
      'Two life-sized wooden ka statues holding golden maces flanked the plastered wall behind which the pharaoh’s shrines and sarcophagus lay.',
  },
];

const CONSERVATION_STEPS = [
  {
    id: 'photo',
    order: 1,
    title: 'Step 1: Glass-Plate Photography in Exact Position',
    icon: '📷',
    detail:
      'Expedition photographer Harry Burton photographed every single object exactly where it lay before anyone lifted a wheel or sandal—creating an irreplaceable visual record.',
  },
  {
    id: 'number',
    order: 2,
    title: 'Step 2: Number 620 Object Groups (5,000+ Items)',
    icon: '🏷️',
    detail:
      'Howard Carter placed numbered reference cards beside all 620 object groups (totalling more than 5,000 individual items) and drew measured scale plans.',
  },
  {
    id: 'stabilise',
    order: 3,
    title: 'Step 3: Stabilise Fragile Wood, Linen and Beadwork',
    icon: '🧪',
    detail:
      'After 3,300 years, chariot leather had melted and bead strings had rotted to dust! Chemist Alfred Lucas gently brushed warm paraffin wax onto fragile wood and beads so nothing crumbled.',
  },
  {
    id: 'crate',
    order: 4,
    title: 'Step 4: Padded Crating Across Ten Patient Years (1922–1932)',
    icon: '📦',
    detail:
      'Wrapped in cotton and packed into custom wooden crates, treasures rode narrow-gauge rails to Nile River barges bound for the Egyptian Museum in Cairo.',
  },
];

const NESTED_LAYERS = [
  {
    depth: 0,
    name: 'Layer 1: Four Giant Gilded Wooden Shrines',
    icon: '⛩️',
    summary:
      'Filling almost the entire Burial Chamber like giant Russian dolls stood four nested oak-and-cedar shrines covered in gleaming gold leaf, sealed with knotted cord!',
  },
  {
    depth: 1,
    name: 'Layer 2: Carved Red Quartzite Stone Sarcophagus',
    icon: '🪨',
    summary:
      'Inside the fourth golden shrine rested a rectangular yellow-red quartzite stone sarcophagus with four winged protective goddesses carved into its corners.',
  },
  {
    depth: 2,
    name: 'Layer 3: Outer and Middle Gilded Wooden Coffins',
    icon: '⚰️',
    summary:
      'Lifting the heavy granite lid revealed two human-shaped (anthropoid) wooden coffins covered in gold sheet and inlaid with blue and turquoise glass.',
  },
  {
    depth: 3,
    name: 'Layer 4: 110 kg Solid Gold Innermost Coffin',
    icon: '✨',
    summary:
      'Inside the second wooden coffin lay a breathtaking third coffin—hammered not from gilded wood, but from 110.4 kilograms of pure solid gold!',
  },
  {
    depth: 4,
    name: 'Layer 5: 11 kg Solid Gold and Lapis Lazuli Mask',
    icon: '👑',
    summary:
      'Resting directly over the young pharaoh’s bandaged head and shoulders shone the iconic 11-kilogram solid gold funerary mask crowned with the vulture and cobra of Upper and Lower Egypt!',
  },
];

const CARTOUCHE_PUZZLES = [
  {
    id: 'throne_name',
    ringTitle: 'Cartouche 1 • Throne Name: Neb-kheperu-re',
    glyphs: '☀️ (Ra Sun Disc) + 🪲 (Kheperu Scarab) + 🧺 (Neb Lord Basket)',
    options: [
      { id: 'lord_ra', label: '“Lord of the Forms of Ra” (enclosed in a protective royal rope loop)', correct: true },
      { id: 'tax_grain', label: '“Collector of Five Hundred Sacks of Barley”', correct: false },
    ],
    explain:
      'Decoded! The oval rope ring (cartouche) protected the king’s sacred throne name Nebkheperure—stamped onto KV62’s doorway seals!',
  },
  {
    id: 'birth_name',
    ringTitle: 'Cartouche 2 • Birth Name: Tut-ankh-amun',
    glyphs: '🥖🐦 (Tut Image) + ☥ (Ankh Life) + 🪶 (God Amun)',
    options: [
      { id: 'cleopatra', label: '“Ruler of the Lighthouse of Alexandria”', correct: false },
      { id: 'living_amun', label: '“Living Image of Amun” (honouring Egypt’s restored chief god Amun)', correct: true },
    ],
    explain:
      'Decoded! Born Tutankhaten, the boy-pharaoh changed his name to Tutankhamun—“Living Image of Amun”—when he restored Egypt’s traditional temples.',
  },
];

const JOURNAL_QUESTIONS = [
  {
    id: 'jq1',
    question: '1. Why did young Tutankhamun’s tomb (KV62) survive nearly intact when giant pharaohs’ tombs were robbed in ancient times?',
    options: [
      {
        id: 'a',
        label: 'Ancient limestone rubble and workmen’s huts from later tombs buried KV62’s sixteen steps out of sight.',
        correct: true,
      },
      {
        id: 'b',
        label: 'KV62 was built on top of the tallest pyramid at Giza surrounded by a moat.',
        correct: false,
      },
    ],
    feedback:
      'Spot-on! Forgotten beneath tonnes of valley chippings and huts, KV62 escaped the major tomb robberies of late New Kingdom Egypt.',
  },
  {
    id: 'jq2',
    question: '2. On 26 November 1922, what proved to Howard Carter and his Egyptian team that royal burials still lay beyond the Antechamber?',
    options: [
      {
        id: 'a',
        label: 'A printed modern map pinned to the ceiling.',
        correct: false,
      },
      {
        id: 'b',
        label: 'Intact royal jackal-and-captives seals and two life-sized guardian statues flanking a sealed plastered wall.',
        correct: true,
      },
    ],
    feedback:
      'Confirmed! Between the two black-and-gold guardian statues stood the sealed entrance to the Burial Chamber and its four golden shrines.',
  },
  {
    id: 'jq3',
    question: '3. Why did Carter, Burton, Lucas, and Egyptian specialists spend TEN years (1922–1932) clearing KV62 instead of rushing?',
    options: [
      {
        id: 'a',
        label: 'Fragile 3,300-year-old wood, linen, and beadwork would have crumbled to dust without photography, numbering, and wax stabilisation.',
        correct: true,
      },
      {
        id: 'b',
        label: 'They only visited Egypt for one afternoon every leap year.',
        correct: false,
      },
    ],
    feedback:
      'Brilliant archaeological ethics! Rushing destroys historical context forever; patient conservation saved over 5,000 objects for the world.',
  },
  {
    id: 'jq4',
    question: '4. What protected Tutankhamun’s mummy at the heart of the Burial Chamber?',
    options: [
      {
        id: 'a',
        label: 'A single plain reed mat placed directly on the limestone floor.',
        correct: false,
      },
      {
        id: 'b',
        label: 'Four gilded wooden shrines, a stone sarcophagus, two gilded wood coffins, a 110 kg solid gold coffin, and an 11 kg gold mask.',
        correct: true,
      },
    ],
    feedback:
      'Verified! Eight nested sacred layers surrounded the teenage pharaoh to guide and protect him in the Field of Reeds.',
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
      utter.rate = 0.97;
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
        tone(520, 740, 0.08, 'sine', 0.07);
        if (currentText) speak(currentText);
      }
      return muted;
    },
    click() {
      tone(460, 620, 0.045, 'sine', 0.06);
    },
    shimmer() {
      tone(660, 990, 0.11, 'sine', 0.07);
    },
    success() {
      tone(523.25, 659.25, 0.09, 'triangle', 0.1, 0);
      tone(659.25, 987.77, 0.15, 'triangle', 0.11, 0.08);
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

export function mountKs2TutankhamunLab(container, opts = {}, legacyCtx = {}) {
  if (!container) return () => {};

  const mountCfg = normalizeMountOpts(opts, legacyCtx);
  const sound = createSoundAndSpeechController();
  const persistence = createSessionPersistence(SESSION_KEY);

  let shellEl = null;
  let unmounted = false;
  let resetArmTimer = null;
  let torchRafId = 0;

  const scrollLock = createScrollLockManager(() => shellEl);

  const state = {
    step: 'cover',
    isFullscreen: mountCfg.preferFullscreen,
    resetArmed: false,
    score: 0,
    speakerIcon: '🕯️',
    speakerName: 'Howard Carter • Valley of the Kings (November 1922)',
    speechText:
      '4 November 1922! Beneath ancient workmen’s huts in the Valley of the Kings, our Egyptian team has just uncovered a sunken limestone step.',

    // Stage 1: Sixteen Steps & Seal
    stepsCluesFound: new Set(),
    activeStepClue: 'rubble',

    // Stage 2: Candlelight Peephole
    peepholeFound: new Set(),
    activePeepholeId: 'couches',
    torchX: 48,
    torchY: 52,

    // Stage 3: Conservation Bench (ordered sequence 1..4)
    conservedCount: 0,
    wrongConservationId: '',

    // Stage 4: Nested Shrines & Cartouche Decoder
    maxLayerOpened: 0,
    activeLayerDepth: 0,
    solvedCartouches: new Set(),
    wrongCartoucheOpt: '',

    // Stage 5: Field Journal
    journalAnswers: {},
    journalCredited: new Set(),
    journalHadWrong: new Set(),
  };

  function hydrate() {
    const saved = persistence.load();
    if (!saved || typeof saved !== 'object') return;
    if (STEPS.some((s) => s.id === saved.step)) state.step = saved.step;
    if (typeof saved.score === 'number') state.score = saved.score;
    if (Array.isArray(saved.stepsCluesFound)) state.stepsCluesFound = new Set(saved.stepsCluesFound);
    if (typeof saved.activeStepClue === 'string') state.activeStepClue = saved.activeStepClue;
    if (Array.isArray(saved.peepholeFound)) state.peepholeFound = new Set(saved.peepholeFound);
    if (typeof saved.activePeepholeId === 'string') state.activePeepholeId = saved.activePeepholeId;
    if (typeof saved.conservedCount === 'number') state.conservedCount = saved.conservedCount;
    if (typeof saved.maxLayerOpened === 'number') state.maxLayerOpened = saved.maxLayerOpened;
    if (typeof saved.activeLayerDepth === 'number') state.activeLayerDepth = saved.activeLayerDepth;
    if (Array.isArray(saved.solvedCartouches)) state.solvedCartouches = new Set(saved.solvedCartouches);
    if (saved.journalAnswers && typeof saved.journalAnswers === 'object') {
      state.journalAnswers = saved.journalAnswers;
    }
    if (Array.isArray(saved.journalCredited)) state.journalCredited = new Set(saved.journalCredited);
    if (Array.isArray(saved.journalHadWrong)) state.journalHadWrong = new Set(saved.journalHadWrong);
  }

  function save() {
    persistence.save({
      step: state.step,
      score: state.score,
      stepsCluesFound: [...state.stepsCluesFound],
      activeStepClue: state.activeStepClue,
      peepholeFound: [...state.peepholeFound],
      activePeepholeId: state.activePeepholeId,
      conservedCount: state.conservedCount,
      maxLayerOpened: state.maxLayerOpened,
      activeLayerDepth: state.activeLayerDepth,
      solvedCartouches: [...state.solvedCartouches],
      journalAnswers: state.journalAnswers,
      journalCredited: [...state.journalCredited],
      journalHadWrong: [...state.journalHadWrong],
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
    if (stepId === 'stage1') return state.stepsCluesFound.size >= 4;
    if (stepId === 'stage2') return state.peepholeFound.size >= 4;
    if (stepId === 'stage3') return state.conservedCount >= CONSERVATION_STEPS.length;
    if (stepId === 'stage4') return state.maxLayerOpened >= 4 && state.solvedCartouches.size >= 2;
    if (stepId === 'stage5') {
      return JOURNAL_QUESTIONS.every((q) => {
        const picked = state.journalAnswers[q.id];
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
        '🕯️',
        'Howard Carter • Valley of the Kings (November 1922)',
        'Step into the sun-baked Valley of the Kings! Press Enter Valley Dig below to uncover sixteen buried limestone steps.',
      );
    } else if (nextStep === 'stage1') {
      say(
        '🪜',
        'Hussein Abdel Rassoul & Foreman Ahmed Gerigar',
        isCoarseTouchUI()
          ? 'Tap all 4 excavation clues in the Valley trench to uncover the sixteen buried steps and intact jackal seal!'
          : 'Click all 4 excavation clues in the Valley cutaway to trace how KV62 stayed hidden for 3,000 years!',
      );
    } else if (nextStep === 'stage2') {
      say(
        '🕯️',
        '26 November 1922 • “Can You See Anything?”',
        'Slide your candle across the dark Antechamber—or tap the 4 glinting shapes—to see “wonderful things” gleaming in the gloom!',
      );
    } else if (nextStep === 'stage3') {
      say(
        '🧪',
        'Alfred Lucas & Harry Burton • KV62 Field Lab',
        'True archaeologists never grab treasure! Complete all 4 conservation steps IN EXACT ORDER (1 to 4) so 3,300-year-old wood and beads do not crumble.',
      );
    } else if (nextStep === 'stage4') {
      say(
        '👑',
        'Dr Nadia El-Sayed • Cairo Museum Egyptologist',
        'Open all 5 nested shrine and coffin layers down to the 11 kg gold mask, then decode both of Tutankhamun’s royal cartouches!',
      );
    } else if (nextStep === 'stage5') {
      say(
        '🏅',
        'Howard Carter • KV62 Field Journal',
        'Complete all 4 archaeological ethics and evidence checks below to claim and print your KV62 Field Egyptologist Certificate!',
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
    state.stepsCluesFound.clear();
    state.activeStepClue = 'rubble';
    state.peepholeFound.clear();
    state.activePeepholeId = 'couches';
    state.torchX = 48;
    state.torchY = 52;
    state.conservedCount = 0;
    state.wrongConservationId = '';
    state.maxLayerOpened = 0;
    state.activeLayerDepth = 0;
    state.solvedCartouches.clear();
    state.wrongCartoucheOpt = '';
    state.journalAnswers = {};
    state.journalCredited.clear();
    state.journalHadWrong.clear();
    say(
      '🕯️',
      'Howard Carter • Valley of the Kings',
      'Excavation notebook reset! Ready to uncover Tomb KV62 from the very first limestone step.',
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
<html lang="en"><head><meta charset="utf-8"><title>KV62 Field Egyptologist Certificate</title>
<style>
  body { font-family: Georgia, serif; background: #f8fafc; margin: 0; padding: 28px; text-align: center; color: #0f172a; }
  .cert { max-width: 720px; margin: 0 auto; padding: 36px 40px; background: #fffbeb; border: 6px double #ca8a04; border-radius: 16px; }
  .kicker { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 1.4px; color: #854d0e; text-transform: uppercase; }
  h1 { font-size: 28px; margin: 10px 0 6px; color: #0f172a; }
  .sub { font-size: 15px; color: #334155; margin-bottom: 18px; }
  .line { display: inline-block; width: 260px; border-bottom: 2px solid #334155; margin: 14px 0 4px; height: 24px; }
  .pills { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 18px 0 22px; font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
  .pill { padding: 5px 12px; border-radius: 999px; background: #dcfce7; border: 1px solid #16a34a; color: #14532d; }
  @media print { .no-print { display: none; } body { background: #fff; padding: 0; } }
</style></head><body>
  <div class="cert">
    <div class="kicker">The History Revision Hub • Key Stage 2 Ancient Egypt (1323 BC and November 1922)</div>
    <div style="font-size:44px;margin:8px 0;">☥</div>
    <h1>KV62 Field Egyptologist Certificate</h1>
    <p class="sub">Awarded for methodical archaeological conservation and hieroglyphic analysis in <em>Candlelight in the Valley: Opening Tomb KV62</em></p>
    <div><span class="line"></span><div style="font-size:12px;color:#475569;">Field Egyptologist’s Name</div></div>
    <div class="pills">
      <span class="pill">✓ Sixteen Steps and Jackal Seal</span>
      <span class="pill">✓ Antechamber Candlelight Survey</span>
      <span class="pill">✓ 10-Year Scientific Conservation</span>
      <span class="pill">✓ Nested Shrines and Cartouches</span>
      <span class="pill">✓ Score: ${state.score} pts</span>
    </div>
    <div style="font-size:13px;color:#475569;">Verified on ${dateStr} • The History Department</div>
    <div class="no-print" style="margin-top:20px;">
      <button onclick="window.print()" style="padding:10px 22px;font-weight:800;border-radius:8px;border:none;background:#ca8a04;color:#fff;cursor:pointer;">🖨️ Print / Save Certificate</button>
    </div>
  </div>
</body></html>`);
    win.document.close();
  }

  function renderSixteenStepsSVG() {
    const active = state.activeStepClue;
    const borderCol = (id) => (active === id ? '#fef08a' : state.stepsCluesFound.has(id) ? '#4ade80' : '#f59e0b');

    return `
      <svg viewBox="0 0 640 400" class="ks2lab-svg-scene" role="img" aria-label="Cross-section of the Valley of the Kings showing ancient rubble huts above sixteen descending limestone steps leading to KV62's sealed doorway">
        <defs>
          <linearGradient id="kv-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0c4a6e" />
            <stop offset="100%" stop-color="#38bdf8" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="640" height="145" fill="url(#kv-sky)" />
        <!-- Limestone Canyon Cliffs -->
        <polygon points="0,145 120,42 260,115 430,36 640,125 640,400 0,400" fill="#b48347" />
        <rect x="0" y="160" width="640" height="240" fill="#8c6232" />

        <!-- Clue 1: Ancient Rubble & Workmen's Huts Above KV62 -->
        <g class="ks2lab-svg-hit" data-step-clue="rubble">
          <path d="M90 160 Q220 116 355 160 Z" fill="#a87943" stroke="${borderCol('rubble')}" stroke-width="3" />
          <rect x="176" y="122" width="44" height="26" fill="#785228" stroke="#fde68a" stroke-width="1.5" />
          <rect x="232" y="126" width="44" height="22" fill="#785228" stroke="#fde68a" stroke-width="1.5" />
          <text x="225" y="112" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="900">1. Ancient Rubble and Huts</text>
        </g>

        <!-- Clue 2: First Sunken Step (4 Nov 1922) -->
        <g class="ks2lab-svg-hit" data-step-clue="step1">
          <rect x="128" y="164" width="76" height="36" rx="5" fill="#fef3c7" stroke="${borderCol('step1')}" stroke-width="3" />
          <text x="166" y="186" text-anchor="middle" fill="#78350f" font-size="10.5" font-weight="900">2. First Step</text>
        </g>

        <!-- Clue 3: Sixteen Descending Rock-Cut Steps -->
        <g class="ks2lab-svg-hit" data-step-clue="stairs16">
          <polygon points="168,200 412,332 412,364 168,236" fill="#e7cba0" stroke="${borderCol('stairs16')}" stroke-width="3" />
          <polyline points="175,202 205,202 205,220 235,220 235,238 265,238 265,256 295,256 295,274 325,274 325,292 355,292 355,310 385,310 385,328 412,328"
                    fill="none" stroke="#78350f" stroke-width="3" />
          <text x="285" y="242" text-anchor="middle" fill="#fef08a" font-size="11.5" font-weight="900">3. Sixteen Buried Steps</text>
        </g>

        <!-- Clue 4: Sealed Plaster Doorway & Jackal-and-Captives Seal -->
        <g class="ks2lab-svg-hit" data-step-clue="seal">
          <rect x="416" y="238" width="96" height="128" rx="6" fill="#d6b588" stroke="${borderCol('seal')}" stroke-width="3.5" />
          <ellipse cx="464" cy="298" rx="30" ry="38" fill="#92400e" stroke="#fde047" stroke-width="2.5" />
          <text x="464" y="294" text-anchor="middle" fill="#fef08a" font-size="18">🐺</text>
          <text x="464" y="314" text-anchor="middle" fill="#fffbeb" font-size="9" font-weight="900">ROYAL SEAL</text>
          <text x="464" y="356" text-anchor="middle" fill="#451a03" font-size="10" font-weight="900">4. Sealed Door</text>
        </g>

        <!-- Dark corridor beyond -->
        <rect x="514" y="248" width="106" height="116" rx="4" fill="#090d16" stroke="#ca8a04" stroke-width="1.5" />
        <text x="567" y="304" text-anchor="middle" fill="#fde047" font-size="10.5" font-weight="800">KV62 Passage</text>
        <text x="567" y="320" text-anchor="middle" fill="#94a3b8" font-size="9.5">3,000 Years Dark</text>
      </svg>
    `;
  }

  function renderPeepholeViewportHTML() {
    const allFound = state.peepholeFound.size >= 4;
    return `
      <div class="ks2lab-peephole-wrap ${allFound ? 'all-lit' : ''}" id="ks2-kv62-peephole"
           style="--torch-x:${state.torchX}%;--torch-y:${state.torchY}%;">
        <svg viewBox="0 0 640 400" class="ks2lab-svg-scene" role="img" aria-label="Dark Antechamber of Tomb KV62 illuminated by Howard Carter's flickering candle on 26 November 1922">
          <rect x="0" y="0" width="640" height="400" fill="#131019" />
          <rect x="18" y="18" width="604" height="364" rx="10" fill="#1e1821" stroke="#78350f" stroke-width="2" />

          <!-- 1. Gilded Animal-Sided Couches (Left) -->
          <g class="ks2lab-svg-hit" data-peep-spot="couches">
            <rect x="56" y="190" width="168" height="16" rx="4" fill="#eab308" />
            <rect x="66" y="206" width="12" height="58" fill="#ca8a04" />
            <rect x="202" y="206" width="12" height="58" fill="#ca8a04" />
            <circle cx="68" cy="180" r="18" fill="#facc15" stroke="#fef08a" stroke-width="2" />
            <text x="68" y="186" text-anchor="middle" font-size="18">🦁</text>
            <text x="140" y="284" text-anchor="middle" fill="#fde047" font-size="11" font-weight="800">Animal-Sided Couches</text>
          </g>

          <!-- 3. Golden Throne & Translucent Alabaster Cups (Center-Top) -->
          <g class="ks2lab-svg-hit" data-peep-spot="throne">
            <rect x="256" y="96" width="68" height="86" rx="8" fill="#eab308" stroke="#fef08a" stroke-width="2.5" />
            <rect x="266" y="110" width="48" height="40" rx="4" fill="#0284c7" />
            <!-- White alabaster lotus cup -->
            <path d="M342 152 Q358 182 374 152 Z" fill="#f8fafc" stroke="#fde68a" stroke-width="2" />
            <rect x="355" y="168" width="6" height="14" fill="#f8fafc" />
            <text x="312" y="204" text-anchor="middle" fill="#fef08a" font-size="11" font-weight="800">Throne and Alabaster Cups</text>
          </g>

          <!-- 2. Disassembled Golden Chariots (Center-Bottom) -->
          <g class="ks2lab-svg-hit" data-peep-spot="chariots">
            <circle cx="282" cy="296" r="36" fill="none" stroke="#facc15" stroke-width="6" />
            <circle cx="332" cy="304" r="36" fill="none" stroke="#eab308" stroke-width="6" />
            <line x1="246" y1="296" x2="318" y2="296" stroke="#fde047" stroke-width="3" />
            <line x1="282" y1="260" x2="282" y2="332" stroke="#fde047" stroke-width="3" />
            <text x="310" y="362" text-anchor="middle" fill="#fde047" font-size="11" font-weight="800">Disassembled Golden Chariots</text>
          </g>

          <!-- 4. Twin Black-and-Gold Guardian Statues Flanking Sealed Burial Wall (Right) -->
          <g class="ks2lab-svg-hit" data-peep-spot="guardians">
            <!-- Sealed plaster Burial Chamber wall -->
            <rect x="468" y="92" width="88" height="196" rx="6" fill="#8c6d46" stroke="#ca8a04" stroke-width="2" />
            <text x="512" y="186" text-anchor="middle" fill="#fef3c7" font-size="10" font-weight="900">SEALED WALL</text>
            <!-- Left & Right Black-and-Gold Ka Statues -->
            <rect x="434" y="118" width="26" height="168" rx="8" fill="#18181b" stroke="#facc15" stroke-width="2.5" />
            <polygon points="432,208 462,208 466,238 428,238" fill="#facc15" />
            <rect x="564" y="118" width="26" height="168" rx="8" fill="#18181b" stroke="#facc15" stroke-width="2.5" />
            <polygon points="562,208 592,208 596,238 558,238" fill="#facc15" />
            <text x="512" y="312" text-anchor="middle" fill="#fde047" font-size="11" font-weight="800">Twin Guardian Statues</text>
          </g>
        </svg>
        <div class="ks2lab-peephole-mask"></div>
      </div>
    `;
  }

  function renderConservationBenchSVG() {
    const c = state.conservedCount;
    return `
      <svg viewBox="0 0 640 400" class="ks2lab-svg-scene" role="img" aria-label="KV62 Archaeological Conservation Laboratory workbench showing photography, numbering 620 object groups, warm paraffin wax stabilisation, and crating">
        <rect x="0" y="0" width="640" height="400" fill="#111827" />
        <rect x="44" y="72" width="552" height="266" rx="16" fill="#292524" stroke="#ca8a04" stroke-width="3" />
        <text x="320" y="44" text-anchor="middle" fill="#fef08a" font-size="15" font-weight="900">KV62 FIELD LABORATORY • 620 OBJECT GROUPS (5,000+ ITEMS)</text>

        <!-- Fragile Ancient Chariot & Bead Collar on Bench -->
        <rect x="180" y="128" width="280" height="132" rx="12" fill="#1c1917" stroke="${c >= 4 ? '#4ade80' : '#eab308'}" stroke-width="2.5" />
        <circle cx="255" cy="194" r="34" fill="none" stroke="${c >= 3 ? '#facc15' : '#a16207'}" stroke-width="6" />
        <path d="M330 172 Q368 222 406 172" fill="none" stroke="${c >= 3 ? '#2dd4bf' : '#94a3b8'}" stroke-width="6" />

        ${
          c >= 1
            ? `<rect x="74" y="102" width="90" height="42" rx="8" fill="#14532d" stroke="#4ade80" stroke-width="2" />
               <text x="119" y="127" text-anchor="middle" fill="#dcfce7" font-size="11" font-weight="900">📷 Photo Taken</text>`
            : ''
        }
        ${
          c >= 2
            ? `<rect x="382" y="218" width="66" height="30" rx="5" fill="#fef3c7" stroke="#b45309" stroke-width="2" />
               <text x="415" y="238" text-anchor="middle" fill="#1c1917" font-size="11" font-weight="900">Card #267</text>`
            : ''
        }
        ${
          c >= 3
            ? `<text x="320" y="114" text-anchor="middle" fill="#5eead4" font-size="12" font-weight="900">✨ Warm Paraffin Wax Applied — Fibres Stabilised!</text>`
            : ''
        }
        ${
          c >= 4
            ? `<rect x="166" y="116" width="308" height="156" rx="14" fill="none" stroke="#4ade80" stroke-width="4" stroke-dasharray="10 6" />
               <text x="320" y="306" text-anchor="middle" fill="#86efac" font-size="13.5" font-weight="900">✓ SAFELY CRATED FOR THE CAIRO MUSEUM (10-YEAR RECORD COMPLETE)</text>`
            : `<text x="320" y="306" text-anchor="middle" fill="#fde68a" font-size="12.5" font-weight="800">Complete Step ${c + 1} of 4 on the right in scientific order!</text>`
        }
      </svg>
    `;
  }

  function renderNestedShrinesSVG() {
    const d = state.activeLayerDepth;
    const ringConfigs = [
      { inset: 24, fill: '#854d0e', stroke: '#fde047', label: '4 Gilded Wooden Shrines' },
      { inset: 54, fill: '#9a3412', stroke: '#fed7aa', label: 'Quartzite Stone Sarcophagus' },
      { inset: 84, fill: '#ca8a04', stroke: '#fef08a', label: '2 Gilded Wood Coffins' },
      { inset: 114, fill: '#eab308', stroke: '#ffffff', label: '110 kg Solid Gold Coffin' },
      { inset: 142, fill: '#1d4ed8', stroke: '#fde047', label: '11 kg Gold Mask!' },
    ];

    return `
      <svg viewBox="0 0 640 400" class="ks2lab-svg-scene" role="img" aria-label="Cutaway diagram of Tutankhamun's nested gilded shrines, quartzite sarcophagus, three coffins, and solid gold mask">
        <rect x="0" y="0" width="640" height="400" fill="#090f21" />
        ${ringConfigs
          .map((rc, idx) => {
            const unlocked = idx <= state.maxLayerOpened;
            const isCur = idx === d;
            return `
              <g class="ks2lab-svg-hit" data-layer-pick="${idx}">
                <rect x="${40 + rc.inset * 1.35}" y="${22 + rc.inset * 0.9}"
                      width="${560 - rc.inset * 2.7}" height="${356 - rc.inset * 1.8}"
                      rx="${idx >= 2 ? 36 : 12}"
                      fill="${unlocked ? rc.fill : '#1e293b'}"
                      stroke="${isCur ? '#4ade80' : rc.stroke}"
                      stroke-width="${isCur ? 3.5 : 2}" />
              </g>
            `;
          })
          .join('')}
        <text x="320" y="206" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="900">
          ${NESTED_LAYERS[d].icon} ${NESTED_LAYERS[d].name.replace(/^Layer \d+: /, '')}
        </text>
      </svg>
    `;
  }

  function renderTopBarHTML() {
    const curIdx = Math.max(0, STEPS.findIndex((s) => s.id === state.step));
    const prevId = curIdx > 0 ? STEPS[curIdx - 1].id : '';
    const nextId = curIdx < STEPS.length - 1 ? STEPS[curIdx + 1].id : '';

    return `
      <div class="ks2lab-step-strip" role="tablist" aria-label="Tomb KV62 Lab Stages">
        ${STEPS.map((s) => {
          const done = isStageComplete(s.id);
          const cls = state.step === s.id ? 'is-active' : done ? 'is-done' : '';
          return `<button type="button" class="ks2lab-step-pill ${cls}" data-step-go="${s.id}">${done && state.step !== s.id ? '✓ ' : ''}${s.short}</button>`;
        }).join('')}
      </div>

      <div class="ks2lab-mobile-nav">
        <button type="button" class="ks2lab-mob-arrow" data-step-go="${prevId}" ${!prevId ? 'disabled' : ''} aria-label="Previous Stage">◀</button>
        <select class="ks2lab-mobile-select" id="ks2-tut-mob-select" aria-label="Select Lab Stage">
          ${STEPS.map((s) => {
            const done = isStageComplete(s.id);
            return `<option value="${s.id}" ${state.step === s.id ? 'selected' : ''}>${done && state.step !== s.id ? '✓ ' : ''}${s.mob}</option>`;
          }).join('')}
        </select>
        <button type="button" class="ks2lab-mob-arrow" data-step-go="${nextId}" ${!nextId ? 'disabled' : ''} aria-label="Next Stage">▶</button>
      </div>

      <div class="ks2lab-ctrl-group">
        <span class="ks2lab-score-chip" title="Egyptologist Field Points">☥ ${state.score} pts</span>
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
            <div class="ks2lab-svg-frame" style="aspect-ratio:16/10;display:flex;align-items:center;justify-content:center;background:#090c15;padding:8px;">
              <img src="${ASSETS.chariotChest}" alt="Painted wooden chest from Tutankhamun's tomb KV62 showing the young pharaoh riding in a horse-drawn chariot beneath winged solar discs" class="archival-image" style="width:100%;height:100%;object-fit:contain;" />
            </div>
            <div class="ks2lab-plate-caption" style="font-size:0.78rem;color:#cbd5e1;">
              <strong>KV62 Treasure Plate:</strong> Painted wooden chest discovered inside Tutankhamun’s tomb, preserved untouched beneath Valley of the Kings rubble for over 3,200 years!
            </div>
          </div>

          <div class="ks2lab-cover-info">
            <div>
              ${renderEscapeCoverSealHTML('THE HISTORY REVISION HUB • OFFICIAL ESCAPE LAB')}
              <div class="ks2lab-kicker">🕯️ VOICED KS2 EGYPTOLOGY ESCAPE LAB • NOVEMBER 1922</div>
              <h2 class="ks2lab-hero-title">Candlelight in the Valley: Opening Tomb KV62</h2>
              <p class="ks2lab-hero-sub">
                Watch the <strong>Studio-voiced November 1922 opening</strong>, uncover sixteen buried limestone steps, pan a flickering candle across the dark Antechamber, conserve fragile 3,300-year-old treasures, and open four golden shrines!
              </p>
              <div class="ks2lab-badge-row">
                <span class="ks2lab-badge">🎬 Voiced 1922 Cinema</span>
                <span class="ks2lab-badge">🔒 Lock 1: Sixteen Steps</span>
                <span class="ks2lab-badge">🔒 Lock 2: Candle Peephole</span>
                <span class="ks2lab-badge">🔒 Lock 3: Conservation</span>
                <span class="ks2lab-badge">🔒 Lock 4: Shrines &amp; Name</span>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <button type="button" class="ks2lab-cta-primary" data-cinema-start="prologue">
                <span>🎬 Watch Voiced 1922 Opening &amp; Enter Valley</span>
              </button>
              <button type="button" class="hh-er-cover-secondary-cta" data-step-go="stage1">
                ⚡ Skip Opening → Jump Straight to Stage 1 (Sixteen Steps)
              </button>
            </div>
          </div>
        </div>
      `;
    }

    if (state.step === 'prologue') {
      const idx = state.cinemaIdx || 0;
      const slide = KV62_PROLOGUE[idx] || KV62_PROLOGUE[0];
      const isLast = idx >= KV62_PROLOGUE.length - 1;
      return renderAtmosphericCinemaHTML({
        topLeftLabel: 'THE HISTORY REVISION HUB • VALLEY OF THE KINGS ARCHIVE CINEMA',
        topRightLabel: `SCENE ${idx + 1} OF ${KV62_PROLOGUE.length} • 🎙️ STUDIO VOICEOVER`,
        slideIndex: idx,
        totalSlides: KV62_PROLOGUE.length,
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
              : `<button type="button" class="ks2lab-cta-primary" style="width:auto;padding:11px 22px;" data-step-go="stage1">🕯️ Enter Stage 1: Sixteen Steps →</button>`
          }
          <button type="button" class="hh-er-cover-secondary-cta" style="width:auto;padding:10px 14px;" data-cinema-replay="1">🔊 Replay Voiceover</button>
          <button type="button" class="hh-er-cover-secondary-cta" style="width:auto;padding:10px 14px;" data-step-go="stage1">Skip Prologue →</button>
        `,
        dotAttr: 'data-cinema-dot',
        bottomRightLabel: 'British Studio Narration • Tomb KV62 Archaeological Archive',
      });
    }

    if (state.step === 'epilogue') {
      const idx = state.cinemaIdx || 0;
      const slide = KV62_EPILOGUE[idx] || KV62_EPILOGUE[0];
      const isLast = idx >= KV62_EPILOGUE.length - 1;
      return renderAtmosphericCinemaHTML({
        topLeftLabel: 'THE HISTORY REVISION HUB • TOMB KV62 CINEMATIC ENDING',
        topRightLabel: `FINALE ${idx + 1} OF ${KV62_EPILOGUE.length} • 🎙️ STUDIO VOICEOVER`,
        slideIndex: idx,
        totalSlides: KV62_EPILOGUE.length,
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
        bottomRightLabel: 'KV62 Epilogue • Ten Years of Scientific Conservation',
      });
    }

    if (state.step === 'stage1') {
      const clue = EXCAVATION_CLUES.find((c) => c.id === state.activeStepClue) || EXCAVATION_CLUES[0];
      return `
        <div class="ks2lab-workspace">
          <div class="ks2lab-visual-col">
            <div class="ks2lab-svg-frame">${renderSixteenStepsSVG()}</div>
            <div class="ks2lab-hotspot-strip">
              ${EXCAVATION_CLUES.map((c, idx) => {
                const found = state.stepsCluesFound.has(c.id);
                const active = state.activeStepClue === c.id;
                return `
                  <button type="button" class="ks2lab-spot-chip ${active ? 'is-active' : ''} ${found ? 'is-found' : ''}" data-step-clue="${c.id}">
                    <span>${idx + 1}. ${c.icon} ${c.label}</span>
                    <span class="ks2lab-spot-status">${found ? '✓ Cleared' : 'Inspect'}</span>
                  </button>
                `;
              }).join('')}
            </div>
            <div class="ks2lab-plate-card">
              <div class="ks2lab-plate-frame">
                <img src="${ASSETS.valleyCliffs}" alt="Panoramic desert limestone cliffs and sunken tomb entrances in the Valley of the Kings near Luxor" class="archival-image" />
              </div>
              <div>
                <div class="ks2lab-plate-kicker">Fieldwork Location • Valley of the Kings, West Bank of Thebes</div>
                <p class="ks2lab-plate-caption">Steep limestone cliffs in the Valley of the Kings where New Kingdom pharaohs cut secret rock tombs instead of giant pyramids.</p>
              </div>
            </div>
          </div>

          <div class="ks2lab-panel-col">
            <div class="ks2lab-card">
              <span class="ks2lab-card-kicker">Stage 1 of 5 • Valley Excavation (${state.stepsCluesFound.size}/4 Clues Uncovered)</span>
              <h3 class="ks2lab-card-title">Sixteen Buried Steps in the Valley of the Kings</h3>
              <p class="ks2lab-card-prose">
                Boy-pharaoh Tutankhamun died suddenly aged nineteen around 1323 BC. Inspect all four clues on the cutaway trench to discover how his small tomb escaped ancient robbers and came to light on 4 November 1922!
              </p>
              <div class="ks2lab-detail-box">
                <h4 class="ks2lab-detail-title">${clue.icon} ${clue.detailTitle}</h4>
                <p class="ks2lab-detail-text">${clue.detailText}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (state.step === 'stage2') {
      const spot = PEEPHOLE_SPOTS.find((s) => s.id === state.activePeepholeId) || PEEPHOLE_SPOTS[0];
      return `
        <div class="ks2lab-workspace">
          <div class="ks2lab-visual-col">
            ${renderPeepholeViewportHTML()}
            <div class="ks2lab-hotspot-strip">
              ${PEEPHOLE_SPOTS.map((s) => {
                const found = state.peepholeFound.has(s.id);
                const active = state.activePeepholeId === s.id;
                return `
                  <button type="button" class="ks2lab-spot-chip ${active ? 'is-active' : ''} ${found ? 'is-found' : ''}" data-peep-spot="${s.id}">
                    <span>${s.icon} ${s.label}</span>
                    <span class="ks2lab-spot-status">${found ? '✓ Spotted' : 'Shine Candle'}</span>
                  </button>
                `;
              }).join('')}
            </div>
            <div class="ks2lab-plate-card">
              <div class="ks2lab-plate-frame">
                <img src="${spot.plate}" alt="${spot.label}" class="archival-image" />
              </div>
              <div>
                <div class="ks2lab-plate-kicker">Antechamber Primary Evidence • ${spot.label}</div>
                <p class="ks2lab-plate-caption">${spot.plateCaption}</p>
              </div>
            </div>
          </div>

          <div class="ks2lab-panel-col">
            <div class="ks2lab-card">
              <span class="ks2lab-card-kicker">Stage 2 of 5 • 26 November 1922 (${state.peepholeFound.size}/4 Treasures Illuminated)</span>
              <h3 class="ks2lab-card-title">“Can You See Anything?” — “Yes, Wonderful Things!”</h3>
              <p class="ks2lab-card-prose">
                Move your finger or mouse across the dark Antechamber peephole (or tap each button) to shine Carter’s candle onto all four glinting groups!
              </p>
              <div class="ks2lab-detail-box">
                <h4 class="ks2lab-detail-title">${spot.icon} ${spot.label}</h4>
                <p class="ks2lab-detail-text">${spot.detail}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (state.step === 'stage3') {
      const displayStep =
        CONSERVATION_STEPS[Math.max(0, state.conservedCount - 1)] || CONSERVATION_STEPS[0];

      return `
        <div class="ks2lab-workspace">
          <div class="ks2lab-visual-col">
            <div class="ks2lab-svg-frame">${renderConservationBenchSVG()}</div>
            <div class="ks2lab-plate-card">
              <div class="ks2lab-plate-frame">
                <img src="${ASSETS.carterShrine}" alt="Harry Burton's archival 1923 photograph showing Howard Carter and Egyptian specialists carefully supporting timber beams beneath the gilded shrine roof inside KV62" class="archival-image" />
              </div>
              <div>
                <div class="ks2lab-plate-kicker">Harry Burton Photograph (1923) • Careful Engineering</div>
                <p class="ks2lab-plate-caption">Howard Carter and skilled Egyptian specialists gently bracing timber beams inside KV62—proving patient teamwork saved fragile treasures.</p>
              </div>
            </div>
          </div>

          <div class="ks2lab-panel-col">
            <div class="ks2lab-card">
              <span class="ks2lab-card-kicker">Stage 3 of 5 • Scientific Conservation (${state.conservedCount}/4 Steps Completed)</span>
              <h3 class="ks2lab-card-title">Ten Years of Careful Conservation — Not Treasure-Grabbing!</h3>
              <p class="ks2lab-card-prose">
                Greedy tomb raiders snatched gold and smashed clues. Tap all four scientific steps IN ORDER (Step 1 to Step 4) to conserve KV62’s 620 object groups properly!
              </p>
              <div class="ks2lab-sim-steps">
                ${[CONSERVATION_STEPS[2], CONSERVATION_STEPS[0], CONSERVATION_STEPS[3], CONSERVATION_STEPS[1]]
                  .map((cs) => {
                    const done = cs.order <= state.conservedCount;
                    const wrong = state.wrongConservationId === cs.id;
                    return `
                      <button type="button" class="ks2lab-sim-btn ${done ? 'is-done' : ''} ${wrong ? 'is-wrong' : ''}" data-conserve-id="${cs.id}">
                        <span>${cs.icon} ${cs.title}</span>
                        <span>${done ? '✓ Done' : 'Apply'}</span>
                      </button>
                    `;
                  })
                  .join('')}
              </div>
              <div class="ks2lab-detail-box">
                <h4 class="ks2lab-detail-title">${state.conservedCount > 0 ? displayStep.title : 'Why Order Matters in Archaeology'}</h4>
                <p class="ks2lab-detail-text">
                  ${
                    state.conservedCount > 0
                      ? displayStep.detail
                      : 'Always photograph an artefact in its exact resting spot FIRST before numbering, waxing, or lifting it into a crate!'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (state.step === 'stage4') {
      const curLayer = NESTED_LAYERS[state.activeLayerDepth] || NESTED_LAYERS[0];

      return `
        <div class="ks2lab-workspace">
          <div class="ks2lab-visual-col">
            <div class="ks2lab-svg-frame">${renderNestedShrinesSVG()}</div>
            <div class="ks2lab-plate-card">
              <div class="ks2lab-plate-frame">
                <img src="${state.maxLayerOpened >= 4 ? ASSETS.deathMask : ASSETS.hieroglyphs}"
                     alt="${state.maxLayerOpened >= 4 ? 'Tutankhamun solid gold funerary mask inlaid with blue lapis lazuli stripes and crowned with vulture and cobra' : 'Carved Egyptian royal cartouches enclosing sacred hieroglyphic names'}"
                     class="archival-image" />
              </div>
              <div>
                <div class="ks2lab-plate-kicker">${state.maxLayerOpened >= 4 ? 'Innermost Treasure • 11 kg Solid Gold Mask' : 'Sacred Writing • Carved Royal Cartouches'}</div>
                <p class="ks2lab-plate-caption">
                  ${
                    state.maxLayerOpened >= 4
                      ? 'Tutankhamun’s 11-kilogram solid gold funerary mask inlaid with blue glass and lapis lazuli, crowned with the vulture Nekhbet and cobra Wadjet.'
                      : 'Open all five burial layers to reveal Tutankhamun’s iconic solid gold funerary mask!'
                  }
                </p>
              </div>
            </div>
          </div>

          <div class="ks2lab-panel-col">
            <div class="ks2lab-card">
              <span class="ks2lab-card-kicker">Part A • Nested Burial Explorer (Layer ${state.maxLayerOpened + 1}/5 Reached)</span>
              <h3 class="ks2lab-card-title">Peel Back Four Shrines and Three Coffins</h3>
              <div class="ks2lab-sim-steps">
                ${NESTED_LAYERS.map((ly) => {
                  const unlocked = ly.depth <= state.maxLayerOpened + 1;
                  const opened = ly.depth <= state.maxLayerOpened;
                  const active = ly.depth === state.activeLayerDepth;
                  return `
                    <button type="button" class="ks2lab-sim-btn ${active ? 'is-active' : ''} ${opened ? 'is-done' : ''}" data-layer-pick="${ly.depth}" ${!unlocked ? 'disabled' : ''}>
                      <span>${ly.icon} ${ly.name}</span>
                      <span>${opened ? '✓ Opened' : unlocked ? 'Open Next' : '🔒'}</span>
                    </button>
                  `;
                }).join('')}
              </div>
              <div class="ks2lab-detail-box">
                <h4 class="ks2lab-detail-title">${curLayer.icon} ${curLayer.name}</h4>
                <p class="ks2lab-detail-text">${curLayer.summary}</p>
              </div>
            </div>

            <div class="ks2lab-card">
              <span class="ks2lab-card-kicker">Part B • Royal Cartouche Decoder (${state.solvedCartouches.size}/2 Decoded)</span>
              ${CARTOUCHE_PUZZLES.map((cp) => {
                const solved = state.solvedCartouches.has(cp.id);
                return `
                  <div style="border-top:1px solid rgba(234,179,8,0.25);padding-top:8px;">
                    <div style="font-size:0.8rem;font-weight:900;color:#fef08a;">${cp.ringTitle}</div>
                    <div style="font-size:0.82rem;color:#bae6fd;margin:3px 0 6px;">${cp.glyphs}</div>
                    <div class="ks2lab-opt-stack">
                      ${cp.options
                        .map((o) => {
                          const cls =
                            solved && o.correct
                              ? 'is-correct'
                              : state.wrongCartoucheOpt === `${cp.id}:${o.id}`
                                ? 'is-wrong'
                                : '';
                          return `<button type="button" class="ks2lab-opt-btn ${cls}" data-cartouche-id="${cp.id}" data-cartouche-opt="${o.id}">${o.label}</button>`;
                        })
                        .join('')}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // Stage 5: Egyptologist's Field Journal
    const allSolved = isStageComplete('stage5');
    return `
      <div>
        <div class="ks2lab-card" style="margin-bottom:14px;">
          <div class="ks2lab-card-header">
            <span class="ks2lab-card-kicker">Stage 5 of 5 • Egyptologist’s Field Journal</span>
            <span class="ks2lab-badge">${state.journalCredited.size}/4 Verified</span>
          </div>
          <h3 class="ks2lab-card-title">Complete Your KV62 Archaeological Ethics and Evidence Check</h3>
          <p class="ks2lab-card-prose">
            Verify all four entries in your Valley of the Kings field journal to unlock your KV62 Field Egyptologist Certificate!
          </p>
        </div>

        <div class="ks2lab-quiz-grid">
          ${JOURNAL_QUESTIONS.map((q) => {
            const picked = state.journalAnswers[q.id];
            const solved = q.options.some((o) => o.id === picked && o.correct);
            return `
              <div class="ks2lab-quiz-card ${solved ? 'is-solved' : ''}">
                <p class="ks2lab-quiz-q">${q.question}</p>
                <div class="ks2lab-opt-stack">
                  ${q.options
                    .map((o) => {
                      let cls = '';
                      if (picked === o.id) cls = o.correct ? 'is-correct' : 'is-wrong';
                      return `<button type="button" class="ks2lab-opt-btn ${cls}" data-journal-q="${q.id}" data-journal-opt="${o.id}">${o.label}</button>`;
                    })
                    .join('')}
                </div>
                ${
                  picked
                    ? `<p class="ks2lab-quiz-feedback">${solved ? `✓ ${q.feedback}` : 'Re-check your KV62 excavation and conservation notes, then select the other statement!'}</p>`
                    : ''
                }
              </div>
            `;
          }).join('')}
        </div>

        ${renderWorkbookCodeCardHTML({
          slotLabel: 'ENQUIRY 6 BACK-COVER LEDGER',
          phrase: 'TEN YEARS OF SCIENCE CONSERVED TUTANKHAMUN’S TOMB',
          instruction:
            'Copy this unlocked phrase into the Escape Room Ledger on the Back Cover of your Ancient Egypt Pupil Workbook!',
        })}

        <div style="margin:10px 0;display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="ks2lab-cta-primary" style="width:auto;padding:10px 18px;" data-cinema-start="epilogue">
            🎬 Watch 2-Scene Voiced Tomb KV62 Cinematic Ending
          </button>
        </div>

        ${
          allSolved
            ? `
          <div class="ks2lab-cert-banner">
            <div>
              <div class="ks2lab-kicker" style="color:#fde047;">🏅 VALLEY OF THE KINGS EXPEDITION • THE HISTORY REVISION HUB</div>
              <h3 class="ks2lab-card-title" style="font-size:1.35rem;">KV62 Field Egyptologist Certificate Unlocked!</h3>
              <div class="ks2lab-cert-pillars">
                <span class="ks2lab-cert-pill">✓ 4 Nov 1922 Steps and Seal</span>
                <span class="ks2lab-cert-pill">✓ Antechamber Candle Survey</span>
                <span class="ks2lab-cert-pill">✓ 10-Year Scientific Conservation</span>
                <span class="ks2lab-cert-pill">✓ Shrines, Coffins and Cartouches</span>
              </div>
            </div>
            <button type="button" class="ks2lab-print-btn" data-action="print-cert">
              🖨️ Print Egyptologist Certificate
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

    let statusMsg = '<strong>Cover</strong> • Ready to enter the Valley of the Kings';
    if (state.step === 'stage1') {
      statusMsg = curDone
        ? '<strong>✓ Stage 1 Complete!</strong> Sixteen steps & seal verified'
        : `<strong>Stage 1 of 5</strong> • Uncovered ${state.stepsCluesFound.size}/4 staircase clues`;
    } else if (state.step === 'stage2') {
      statusMsg = curDone
        ? '<strong>✓ Stage 2 Complete!</strong> Antechamber wonders logged'
        : `<strong>Stage 2 of 5</strong> • Illuminated ${state.peepholeFound.size}/4 Antechamber wonders`;
    } else if (state.step === 'stage3') {
      statusMsg = curDone
        ? '<strong>✓ Stage 3 Complete!</strong> 10-year conservation verified'
        : `<strong>Stage 3 of 5</strong> • Completed ${state.conservedCount}/4 ordered conservation steps`;
    } else if (state.step === 'stage4') {
      statusMsg = curDone
        ? '<strong>✓ Stage 4 Complete!</strong> Gold mask & cartouches decoded'
        : `<strong>Stage 4 of 5</strong> • Layer ${state.maxLayerOpened + 1}/5 + ${state.solvedCartouches.size}/2 cartouches`;
    } else if (state.step === 'stage5') {
      statusMsg = curDone
        ? `<strong>🏆 Lab Complete!</strong> Final Score: ${state.score} pts`
        : `<strong>Stage 5 of 5</strong> • Verified ${state.journalCredited.size}/4 journal questions`;
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
      eraTag: 'KS2 • VALLEY OF THE KINGS (NOV 1922)',
      locksCracked: locks,
      totalLocks: 4,
    });
  }

  function render(scrollToTop = false) {
    if (unmounted || !shellEl) return;
    shellEl.classList.toggle('ks2lab-is-fullscreen', state.isFullscreen);

    const mutate = () => {
      const brandEl = shellEl.querySelector('#ks2-tut-brand');
      const topEl = shellEl.querySelector('#ks2-tut-topbar');
      const speechEl = shellEl.querySelector('#ks2-tut-speech');
      const bodyEl = shellEl.querySelector('#ks2-tut-body');
      const navEl = shellEl.querySelector('#ks2-tut-bottom');
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

  container.innerHTML = `
    <div class="ks2lab-shell theme-tutankhamun ${state.isFullscreen ? 'ks2lab-is-fullscreen' : ''}">
      <div id="ks2-tut-brand"></div>
      <div class="ks2lab-topbar" id="ks2-tut-topbar"></div>
      <div class="ks2lab-speech-bar" id="ks2-tut-speech" aria-live="polite"></div>
      <div class="ks2lab-stage-slot" id="ks2-tut-body"></div>
      <div class="ks2lab-bottom-nav" id="ks2-tut-bottom"></div>
    </div>
  `;

  shellEl = container.querySelector('.ks2lab-shell');
  scrollLock.bindShellPointerGuards(shellEl);

  // Smooth 60 FPS Candlelight Peephole Pointer Panning (zero DOM rebuilds, pure CSS custom property update!)
  shellEl.addEventListener(
    'pointermove',
    (e) => {
      if (state.step !== 'stage2') return;
      const peepEl = shellEl.querySelector('#ks2-kv62-peephole');
      if (!peepEl) return;
      const rect = peepEl.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }
      const pctX = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
      const pctY = Math.max(8, Math.min(92, ((e.clientY - rect.top) / rect.height) * 100));
      state.torchX = Math.round(pctX * 10) / 10;
      state.torchY = Math.round(pctY * 10) / 10;
      if (!torchRafId && typeof requestAnimationFrame === 'function') {
        torchRafId = requestAnimationFrame(() => {
          torchRafId = 0;
          const liveEl = shellEl?.querySelector('#ks2-kv62-peephole');
          if (liveEl) {
            liveEl.style.setProperty('--torch-x', `${state.torchX}%`);
            liveEl.style.setProperty('--torch-y', `${state.torchY}%`);
          }
        });
      }
    },
    { passive: true },
  );

  shellEl.addEventListener('change', (e) => {
    const sel = e.target.closest('#ks2-tut-mob-select');
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
      cinemaVoice.play(mode === 'epilogue' ? 'kv62_end_1' : 'kv62_pro_1');
      return;
    }

    const cNext = e.target.closest('[data-cinema-next]');
    if (cNext) {
      const mode = cNext.getAttribute('data-cinema-next');
      const arr = mode === 'epilogue' ? KV62_EPILOGUE : KV62_PROLOGUE;
      state.cinemaIdx = Math.min(arr.length - 1, (state.cinemaIdx || 0) + 1);
      sound.click();
      render(false);
      cinemaVoice.play(`${mode === 'epilogue' ? 'kv62_end' : 'kv62_pro'}_${state.cinemaIdx + 1}`);
      return;
    }

    const cDot = e.target.closest('[data-cinema-dot]');
    if (cDot) {
      state.cinemaIdx = Number(cDot.getAttribute('data-cinema-dot')) || 0;
      render(false);
      cinemaVoice.play(`${state.step === 'epilogue' ? 'kv62_end' : 'kv62_pro'}_${state.cinemaIdx + 1}`);
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

    // Stage 1: Sixteen Steps & Seal
    const scEl = e.target.closest('[data-step-clue]');
    if (scEl) {
      const cId = scEl.getAttribute('data-step-clue');
      const clue = EXCAVATION_CLUES.find((c) => c.id === cId);
      if (!clue) return;
      state.activeStepClue = clue.id;
      if (!state.stepsCluesFound.has(clue.id)) {
        state.stepsCluesFound.add(clue.id);
        addScore(12);
      }
      sound.click();
      say(clue.icon, clue.speaker, clue.quote, !sound.muted);
      save();
      render(false);
      return;
    }

    // Stage 2: Candlelight Peephole Spots
    const peepEl = e.target.closest('[data-peep-spot]');
    if (peepEl) {
      const pId = peepEl.getAttribute('data-peep-spot');
      const spot = PEEPHOLE_SPOTS.find((s) => s.id === pId);
      if (!spot) return;
      state.activePeepholeId = spot.id;
      state.torchX = spot.cx;
      state.torchY = spot.cy;
      if (!state.peepholeFound.has(spot.id)) {
        state.peepholeFound.add(spot.id);
        addScore(12);
        sound.shimmer();
      } else {
        sound.click();
      }
      say(spot.icon, 'Howard Carter • 26 November 1922', spot.quote, !sound.muted);
      save();
      render(false);
      return;
    }

    // Stage 3: Ordered Conservation Bench
    const consBtn = e.target.closest('[data-conserve-id]');
    if (consBtn) {
      const cId = consBtn.getAttribute('data-conserve-id');
      const cs = CONSERVATION_STEPS.find((item) => item.id === cId);
      if (!cs) return;
      if (cs.order <= state.conservedCount) {
        sound.click();
        say(cs.icon, cs.title, cs.detail, !sound.muted);
        render(false);
        return;
      }
      if (cs.order === state.conservedCount + 1) {
        state.conservedCount = cs.order;
        state.wrongConservationId = '';
        addScore(14);
        sound.success();
        say(cs.icon, `KV62 Conservation • ${cs.title}`, cs.detail, !sound.muted);
      } else {
        state.wrongConservationId = cs.id;
        sound.warn();
        say(
          '🧪',
          'Alfred Lucas • Conservation Chemist',
          `Hold on! Complete Step ${state.conservedCount + 1} first—never move or pack a 3,300-year-old artefact before photographing, numbering, and waxing it!`,
          !sound.muted,
        );
      }
      save();
      render(false);
      return;
    }

    // Stage 4: Nested Shrines & Coffins + Cartouche Decoder
    const layerEl = e.target.closest('[data-layer-pick]');
    if (layerEl) {
      const depth = Number(layerEl.getAttribute('data-layer-pick'));
      if (Number.isNaN(depth) || depth > state.maxLayerOpened + 1) return;
      const layer = NESTED_LAYERS[depth];
      if (!layer) return;
      state.activeLayerDepth = depth;
      if (depth > state.maxLayerOpened) {
        state.maxLayerOpened = depth;
        addScore(10);
        sound.shimmer();
      } else {
        sound.click();
      }
      say(layer.icon, layer.name, layer.summary, !sound.muted);
      save();
      render(false);
      return;
    }

    const cartBtn = e.target.closest('[data-cartouche-id]');
    if (cartBtn) {
      const cId = cartBtn.getAttribute('data-cartouche-id');
      const optId = cartBtn.getAttribute('data-cartouche-opt');
      const cp = CARTOUCHE_PUZZLES.find((item) => item.id === cId);
      const opt = cp?.options.find((o) => o.id === optId);
      if (!cp || !opt) return;
      if (opt.correct) {
        state.wrongCartoucheOpt = '';
        if (!state.solvedCartouches.has(cp.id)) {
          state.solvedCartouches.add(cp.id);
          addScore(15);
        }
        sound.success();
        say('☥', cp.ringTitle, cp.explain, !sound.muted);
      } else {
        state.wrongCartoucheOpt = `${cp.id}:${optId}`;
        sound.warn();
        say('🔎', 'Dr Nadia El-Sayed • Hieroglyph Clue', 'Check the symbols Ra (Sun Disc), Scarab, Ankh (Life), and Amun!', !sound.muted);
      }
      save();
      render(false);
      return;
    }

    // Stage 5: Field Journal Questions
    const jBtn = e.target.closest('[data-journal-q]');
    if (jBtn) {
      const qId = jBtn.getAttribute('data-journal-q');
      const optId = jBtn.getAttribute('data-journal-opt');
      const q = JOURNAL_QUESTIONS.find((item) => item.id === qId);
      const opt = q?.options.find((o) => o.id === optId);
      if (!q || !opt) return;
      state.journalAnswers[qId] = optId;
      if (opt.correct) {
        if (!state.journalCredited.has(qId)) {
          state.journalCredited.add(qId);
          addScore(state.journalHadWrong.has(qId) ? 8 : 15);
        }
        sound.success();
        say('🏅', 'Howard Carter • Journal Entry Verified', q.feedback, !sound.muted);
      } else {
        state.journalHadWrong.add(qId);
        sound.warn();
        say('🔎', 'Howard Carter • Check Your Field Notes', 'Re-check your KV62 clues and try the other statement!', !sound.muted);
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
    if (torchRafId && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(torchRafId);
    }
    scrollLock.dispose();
    fsSync.dispose();
    cinemaVoice.destroy();
    sound.destroy();
  };
}
