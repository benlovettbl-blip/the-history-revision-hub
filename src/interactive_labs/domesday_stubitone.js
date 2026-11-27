/**
 * THE 1086 DOMESDAY SURVEY: STUBITONE v3 — Solent & Fareham Archival Fieldwork Simulation (Year 7 Edition)
 *
 * Key Upgrades Driven Directly by Year 7 Pupil Feedback:
 *  1. Salty the Solent Seagull ("Rattus Rattus" comic guide) + 11 distinct Studio character voices (0 voice collisions!).
 *  2. 7 Bite-Sized, Focused Stages ("More steps, less work per screen, zero confusing dual-perspective Spyglass tab"):
 *      - Cover -> 1. My Town -> 2. Fareham -> 3. Wipeout -> 4. Trial -> 5. Edith's Hut -> 6. Crack Latin -> 7. Finale & Win!
 *  3. Unmistakable Grand Victory Screen + Itemized Silver-Penny Ledger + Rank Title + Printable 1086 Commissioner Warrant.
 *  4. Genuine 3-Option Historical Thinking Questions (zero joke giveaways, zero quoted Latin answers in question stems!).
 *  5. Audio Stop-on-Transition + `🔊 Replay` / `⏹ Stop` pills + 8 distinct medieval stage soundtracks.
 *  6. In-Game Folio 46v & Titchfield Hundred Archive Modal (100% firewall-safe — zero school web-filter "Blocked" popups!).
 *  7. Year 7 "Class Drama Booth" (`🎙️ Voice Act!`) — record character lines locally in browser + printable Class Drama Script!
 */

import './domesday_stubitone.css';
import {
  DomesdayAudioDirector,
  saveClassVoiceRecording,
  deleteClassVoiceRecording,
  clearAllClassVoiceRecordings,
} from './domesday_music.js';
import { mountLivingDioramaFX } from './domesday_living_fx.js';
import { renderSolentGisSvgHTML } from './solent_svg_map.js';
import {
  renderGosportSaltMarshSVG,
  renderFarehamEstateSVG,
  renderServiPloughSVG,
  renderRoyalAssizeSVG,
  renderStubbingtonHutSVG,
  renderArchivalEvidenceCardHTML,
} from './domesday_svg_scenes.js';
import { saveArcadePersonalBest } from '../arcade/arcade_audio.js';

const SESSION_SAVE_KEY = 'hh_domesday_session_v3';

const STAGE_PRELOAD_MAP = {
  cover: [
    '/images/medieval_england/plate_2_1_bayeux_castle_building.jpg',
    '/audio/labs/domesday/beat0_salty_guide.mp3',
  ],
  beat0: [
    '/images/medieval_england/luttrell_psalter_watermill_detail_f181r.jpg',
    '/audio/labs/domesday/beat1_odo_oath.mp3',
  ],
  beat1: [
    '/images/medieval_england/tres_riches_heures_ox_plough_f3v.jpg',
    '/audio/labs/domesday/beat2_salty_xray.mp3',
  ],
  beat2: [
    '/images/medieval_england/source_a_bayeux_harold_oath.jpg',
    '/audio/labs/domesday/beat3_villager_plea.mp3',
  ],
  beat3: [
    '/images/medieval_england/tres_riches_heures_peasant_hearth_f2v.jpg',
    '/audio/labs/domesday/beat4_monk_myth.mp3',
  ],
  beat4: [
    '/audio/labs/domesday/beat5_stubitone_latin.mp3',
    '/audio/labs/domesday/beat5_all_cracked.mp3',
  ],
  beat5: [
    '/audio/labs/domesday/beat6_salty_finale.mp3',
    '/audio/labs/domesday/beat5_debrief_historian.mp3',
  ],
};

const preloadedUrls = new Set();
function preloadUpcomingStageAssets(stepId) {
  const list = STAGE_PRELOAD_MAP[stepId];
  if (!list || typeof window === 'undefined') return;
  const run = () => {
    list.forEach((url) => {
      if (preloadedUrls.has(url)) return;
      preloadedUrls.add(url);
      if (/\.(webp|jpe?g|png)$/i.test(url)) {
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
  { id: 'beat0', short: '1. My Town', mob: '1/7 My Town' },
  { id: 'beat1', short: '2. Fareham', mob: '2/7 Fareham' },
  { id: 'beat2', short: '3. Wipeout', mob: '3/7 Wipeout' },
  { id: 'beat3', short: '4. Trial', mob: '4/7 Trial' },
  { id: 'beat4', short: '5. Hut #3', mob: '5/7 Hut #3' },
  { id: 'beat5', short: '6. Latin', mob: '6/7 Latin' },
  { id: 'beat6', short: '7. Win & Seal', mob: '7/7 Finale' },
];

// Heraldic & Wax-Seal Character Medallions (zero AI cartoon faces — AGENTS.md §6.2)
const SPEAKER_AVATARS = {
  salty: { icon: '🐦', bg: 'radial-gradient(circle at 30% 30%, #0369a1, #082f49)', border: '#38bdf8' },
  guy: { icon: '🪶', bg: 'radial-gradient(circle at 30% 30%, #991b1b, #450a0a)', border: '#fbbf24' },
  bennet: { icon: '🥕', bg: 'radial-gradient(circle at 30% 30%, #3f6212, #1a2e05)', border: '#a3e635' },
  odo: { icon: '⚙️', bg: 'radial-gradient(circle at 30% 30%, #92400e, #451a03)', border: '#fbbf24' },
  hugh: { icon: '⚔️', bg: 'radial-gradient(circle at 30% 30%, #7f1d1d, #3b0764)', border: '#f59e0b' },
  villager: { icon: '🌾', bg: 'radial-gradient(circle at 30% 30%, #166534, #052e16)', border: '#86efac' },
  edith: { icon: '🍲', bg: 'radial-gradient(circle at 30% 30%, #b45309, #451a03)', border: '#fde68a' },
  grandma: { icon: '🧶', bg: 'radial-gradient(circle at 30% 30%, #6b21a8, #2e1065)', border: '#d8b4fe' },
  gyrth: { icon: '🐂', bg: 'radial-gradient(circle at 30% 30%, #475569, #0f172a)', border: '#cbd5e1' },
  monk: { icon: '🕯️', bg: 'radial-gradient(circle at 30% 30%, #57534e, #1c1917)', border: '#fde047' },
};

const STAMP_CHALLENGES = [
  {
    id: 'st1',
    claim:
      'Fareham had 10 enslaved workers ("servi") listed alongside plough-oxen and 5 watermills.',
    isReal: true,
    note: '100% REAL! Recorded verbatim in the 1086 Hampshire Domesday folio under Bishop Walkelin of Winchester.',
  },
  {
    id: 'st2',
    claim: 'Bennet Luvet stood in Fareham Creek guarding one wormy turnip from Salty the Seagull.',
    isReal: false,
    note: 'COMEDY CAST! "Luvet" is a real 1086 Domesday surname ("Little Wolf"), while Boggy Bennet & Salty give voice to poor landless locals whom scribes ignored!',
  },
  {
    id: 'st3',
    claim:
      'King Edward gave Fareham a 20-hide tax discount because of coastal Viking raids, and 1086 scribes wrote Fareham "cannot bear" £20.',
    isReal: true,
    note: '100% REAL! Both famous quotes are written directly in Fareham’s 1086 Domesday Book entry!',
  },
];

// Genuine Latin Code-Breaker Clues (ZERO quoted giveaway Latin answers in the prompt — pupils use the Scribe Key!)
const LATIN_CLUE_MISSIONS = [
  {
    id: 'lc1',
    targetIdx: 1,
    badge: 'Clue 1 of 3 • Wiped-Out Saxon Owner',
    prompt:
      'Use the Scribe Key above to TAP the Latin line proving an English freeman HELD Stubbington in the past before Norman Sheriff Hugh took over!',
    hintWrong:
      'Check the Scribe Key for the past-tense verb meaning "held" (not "ten’" on Line 1, which means holds NOW)!',
    solvedNote:
      'Cracked! "Godwinus tenuit de rege E." = Saxon Godwin HELD it freely under King Edward—before Sheriff Hugh wiped him out!',
  },
  {
    id: 'lc2',
    targetIdx: 3,
    badge: 'Clue 2 of 3 • Count the 9 Peasant Households',
    prompt:
      'Now TAP the Latin line where medieval Roman numerals add up to Stubbington’s 9 peasant households (5 villagers + 4 smallholders)!',
    hintWrong:
      'Use the Scribe Key to hunt for the Latin words for "villagers" and "smallholders" (remember medieval clerks wrote 4 as "iiij")!',
    solvedNote:
      'Cracked! "v vill’i & iiij bord’" = 5 villagers + 4 smallholders = Stubbington’s 9 taxed households!',
  },
  {
    id: 'lc3',
    targetIdx: 5,
    badge: 'Clue 3 of 3 • Follow the Money (£2 10s → £3)',
    prompt:
      'Finally, TAP the Latin line proving Stubbington’s yearly cash value rose by 10 shillings between 1066 and Sheriff Hugh’s takeover!',
    hintWrong:
      'Check the Scribe Key for the Latin abbreviations for "£ pounds", "shillings", and "in 1066"!',
    solvedNote:
      'All 3 Folio 46v Clues Cracked! Stubbington rose from £2 10s in 1066 ("T.R.E.") to £3 ("iii lib’") under Sheriff Hugh!',
  },
];

// Curated Classroom Voice-Acting Roles for the in-browser Drama Booth & Printable Script
const DRAMA_CAST_SCRIPT = [
  {
    clipId: 'cover_salty_intro',
    role: 'Salty the Solent Seagull (Comic Guide)',
    direction: 'Cheeky, squawky, high-energy Horrible Histories narrator!',
    line: "Squawk! Eyes front! I'm Salty the Solent Seagull—your unofficial 1086 tour guide! Tap the glowing gold spots to annoy the locals, or hit Begin Royal Audit!",
  },
  {
    clipId: 'cover_bennet_poke',
    role: 'Boggy Bennet Luvet (Mud-Soaked Peasant)',
    direction: 'Grumpy, shivering waist-deep in mud, hugging a turnip.',
    line: 'Oi! Press the big shiny start button already! My toes went numb in this freezing Fareham mud twenty minutes ago, and this seagull is eyeing my turnip!',
  },
  {
    clipId: 'cover_guy_quill',
    role: 'Sir Guy de Rouen (Royal Exchequer Scribe)',
    direction: 'Posh, haughty French-Norman official waving his goose-quill.',
    line: 'Careful! This royal goose-quill is sharper than a Norman broadsword—one stroke of my Latin ink can tax your entire village!',
  },
  {
    clipId: 'beat1_odo_oath',
    role: 'Sweating Reeve Odo (Guilty Fareham Reeve)',
    direction: 'Squeaky, breathless, stammering nervously over holy bones.',
    line: "I swear on Saint Swithin's holy bones, my Lord, barely two squeaky little watermills in all of Fareham! Please ignore that loud splashing behind the bushes!",
  },
  {
    clipId: 'beat2_hugh_boast',
    role: 'Sheriff Hugh of Port (Booming Norman Baron)',
    direction: 'Loud, booming, gloating villain laughing over his new map.',
    line: "Godwin's Stubbington farm? Mine! Wickham? Mine! Fifty-four Hampshire manors? ALL MINE! Best conquest ever!",
  },
  {
    clipId: 'beat3_villager_plea',
    role: 'Wulf of Fareham (Sworn Villager Witness)',
    direction: 'Earnest, urgent villager pleading before the royal court.',
    line: "My Lord Commissioner, King Edward cut Fareham's tax from 30 hides to 20 because Viking raiders attacked us from the sea! Now Bishop Walkelin demands £20 when our town only makes £16!",
  },
  {
    clipId: 'beat4_edith_door',
    role: 'Fierce Edith of Stubbington (Saxon Mother)',
    direction: 'Fiery, quick-witted mum waving a soup ladle from Hut #3.',
    line: "Nine households?! Your posh Latin book counted nine husbands in Stubbington and acted like me, Grandma, and five hungry kids don't exist! What am I, a turnip?!",
  },
  {
    clipId: 'beat4_grandma',
    role: 'Grandma Eadgyth (Stubbington Elder)',
    direction: 'Warm, sharp-witted grandmother spinning wool by the fire.',
    line: "I remember Viking sails on the Solent under King Cnut, young clerk—yet because an old grandmother doesn't pay geld tax, your great book pretends I'm not even here!",
  },
  {
    clipId: 'beat4_monk_myth',
    role: 'Brother Aldwin (Elderly Winchester Monk)',
    direction: 'Spooky, hushed candlelit whisper.',
    line: "In my chronicle I complained that not one single ox, cow, or pig was left out of William's shameful book. Tap inside Stubbington Hut Three to count who the scribes REALLY missed!",
  },
  {
    clipId: 'beat1_gyrth_servi',
    role: 'Gyrth (Enslaved Ploughman in Fareham)',
    direction: 'Calm, quiet, serious, and deeply dignified.',
    line: "The Bishop's scribe wrote all ten of us down on the parchment right beside the plough-oxen. In 1086 Fareham, enslaved workers own no land, and we cannot leave.",
  },
  {
    clipId: 'beat5_debrief_historian',
    role: 'Chief Royal Historian (Final Summary)',
    direction: 'Warm, celebratory BBC documentary presenter.',
    line: "Royal Audit complete—you beat the game! Every village statistic you investigated comes straight from the real 1086 Domesday Book, while characters like Bennet, Edith, and Odo give voice to the nameless locals whom King William's clerks left out.",
  },
];

const TITCHFIELD_HUNDRED_TABLE = [
  {
    place: 'Titchfield (Royal Capital)',
    lord: 'King William',
    households: 33,
    rank: 'Large royal manor (2 mills)',
  },
  {
    place: 'Wickham (Wicheham)',
    lord: 'Sheriff Hugh of Port',
    households: 26,
    rank: 'Crashed £10 → £4 after 1066',
  },
  {
    place: 'Funtley (Fontelei)',
    lord: 'Earl Roger of Shrewsbury',
    households: 22,
    rank: 'Medium valley settlement',
  },
  {
    place: 'Crofton (Croftone)',
    lord: 'Odo of Bayeux & Alfred',
    households: 17,
    rank: 'Coastal manor near Stubbington',
  },
  {
    place: 'Rowner (Ruwanore)',
    lord: 'William Mauduit',
    households: 14,
    rank: 'Crashed £3 10s → £1 10s',
  },
  {
    place: 'Stubbington (Stubitone)',
    lord: 'Sheriff Hugh of Port',
    households: 9,
    rank: 'Smallest 40% of England (Folio 46v)',
  },
  {
    place: 'Hook (Hoche)',
    lord: 'Hugh of Port / Royal',
    households: 8,
    rank: 'Small Solent shore hamlet',
  },
  {
    place: 'Meon (Mene)',
    lord: 'Hampshire Thanes / Crown',
    households: 2,
    rank: 'Tiniest hamlet in Hundred (2 households!)',
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

function hitZoneHTML({
  id = '',
  key = '',
  dataAttr = '',
  x,
  y,
  w = 14,
  h = 22,
  found = false,
  ariaLabel,
}) {
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

function computeRankFromScore(score) {
  if (score >= 1000) {
    return {
      icon: '👑',
      title: 'King William’s Chief Domesday Commissioner',
      sub: 'Supreme Distinction • Master of Latin, Map Forensics & Hidden Peasant Voices!',
    };
  }
  if (score >= 780) {
    return {
      icon: '📜',
      title: 'Senior Royal Exchequer Scribe',
      sub: 'High Honours • Sharp-Eyed Investigator of 1086 Hampshire!',
    };
  }
  if (score >= 520) {
    return {
      icon: '⚖️',
      title: 'Sworn Titchfield Hundred Juror',
      sub: 'Solid Pass • Trusted Witness of the Solent Coast!',
    };
  }
  return {
    icon: '🥕',
    title: 'Apprentice Mud-Scribe & Turnip Watcher',
    sub: 'Audit Complete • Revisit any tab above to boost your Silver Penny tally!',
  };
}

export function mountDomesdayStubitone(stageEl, _pools = {}, ctx = {}) {
  if (!stageEl) return () => {};

  const audio = new DomesdayAudioDirector();
  const instanceSvgUid = `sol${Math.random().toString(36).slice(2, 7)}`;
  let activeFx = null;
  let data = null;
  let unmounted = false;
  let shimmerTimeout = null;
  let resetArmTimeout = null;
  let closeArmTimeout = null;
  let shellEl = null;
  let mountedSceneSignature = '';
  let enteredBrowserFs = false;
  let pointerDownSnap = null;
  let pointerDownPos = null;
  let pointerMovedDuringTap = false;
  let pointerDownTime = 0;

  // MediaRecorder state for optional Class Drama Booth
  let activeMediaRecorder = null;
  let activeMicStream = null;
  let recordingClipId = null;
  let recordedChunks = [];

  const state = {
    step: ctx.startAtBeat0 ? 'beat0' : 'cover',
    isFullscreen: Boolean(ctx.autoFullscreen),
    hintShimmer: false,
    resetArmed: false,
    closeArmed: false,
    activeModal: null, // null | 'archive' | 'drama'

    score: 0,
    xpAwarded: false,
    awardedKeys: new Set(),
    ledger: {
      cover: 0,
      beat0: 0,
      beat1: 0,
      beat2: 0,
      beat3: 0,
      beat4: 0,
      beat5: 0,
      beat6: 0,
      turnips: 0,
    },

    avatarKey: 'salty',
    speakerName: 'Salty the Solent Seagull • 1086 Tour Guide',
    speechText:
      'Squawk! Welcome to 1086! Tap any cast button on the left to hear their voice—or press BEGIN 1086 ROYAL AUDIT!',
    lastVoClipId: 'cover_salty_intro',

    bennetSightings: new Set(),
    coverSecretsFound: new Set(),

    // Stage 1 (beat0): Instant 1-Click Coastal Town Rewind
    selectedPinId: 'gosport',
    testedPinIds: new Set(),
    peekSwampAnyway: false,
    swampSecretsFound: new Set(),

    // Stage 2 (beat1): Fareham Asset Hunt + Gyrth Servi View & Comprehension Question
    beat1SubMode: 'hunt', // 'hunt' | 'servi'
    foundFarehamAssets: new Set(), // 'mills' | 'pigs' | 'church_meadow'
    farehamExtrasFound: new Set(),
    serviReflected: false,
    serviQuizAnswer: null, // 'mills_servi' | 'free_choice' | 'no_slaves'

    // Stage 3 (beat2): 3-Step Forensic Wipeout Map
    xraySplitPct: 22,
    selectedManorId: 'stubbington',
    showModernGhost: false,
    b2MissionIdx: 0,
    b2Solved: new Set(),
    b2WrongAttempt: '',

    // Stage 4 (beat3): Royal Assize Courtroom
    assizeSpotsHeard: new Set(),
    rulingVikings: null, // 'keep20' | 'hike30' | 'zero0'
    rulingBishop: null, // 'shame20' | 'force20' | 'arrest'
    assizeVerdictRevealed: false,

    // Stage 5 (beat4): Pure Inside Edith's Stubbington Hut #3
    hutPeopleGroups: new Set(['husband_head']),
    foundBlindSpots: new Set(),
    hutQuizAnswer: null, // 'only9' | 'about45' | 'over500'

    // Stage 6 (beat5): Pure Folio 46v Latin Code-Breaker
    translationPct: 0,
    activeChunkIdx: 0,
    b5ClueStep: 0,
    b5SolvedClues: new Set(),
    b5WrongChunkIdx: -1,

    // Stage 7 (beat6): Final Stamp Boss + In-Game Archive Quest + Grand Victory Screen
    stampAnswers: {},
    archiveBounty1: null, // 'small40' | 'large20'
    archiveBounty2: null, // 'meon' | 'funtley'
  };

  function awardOnce(key, bucket, pts) {
    if (state.awardedKeys.has(key)) return false;
    state.awardedKeys.add(key);
    state.score += pts;
    if (state.ledger[bucket] !== undefined) {
      state.ledger[bucket] += pts;
    }
    saveArcadePersonalBest('medieval_england', 'domesday_stubitone', 'all', state.score);
    return true;
  }

  function computeHutPeopleCount() {
    let total = 1;
    if (state.hutPeopleGroups.has('edith')) total += 1;
    if (state.hutPeopleGroups.has('five_kids')) total += 5;
    if (state.hutPeopleGroups.has('grandma')) total += 1;
    return total;
  }

  function isStepTrulyComplete(stepId) {
    if (stepId === 'cover') return state.step !== 'cover' || state.coverSecretsFound.size >= 2;
    if (stepId === 'beat0') return state.testedPinIds.size >= 2;
    if (stepId === 'beat1')
      return state.foundFarehamAssets.size >= 3 && state.serviQuizAnswer === 'mills_servi';
    if (stepId === 'beat2') return state.b2Solved.size >= 3;
    if (stepId === 'beat3') return state.assizeVerdictRevealed;
    if (stepId === 'beat4') {
      return (
        computeHutPeopleCount() >= 8 &&
        state.foundBlindSpots.has('untaxed_pets') &&
        state.hutQuizAnswer === 'about45'
      );
    }
    if (stepId === 'beat5') return state.b5SolvedClues.size >= 3;
    if (stepId === 'beat6') return Object.keys(state.stampAnswers).length >= 3;
    return false;
  }

  function persistSessionState() {
    if (typeof sessionStorage === 'undefined') return;
    try {
      const payload = {
        step: state.step,
        score: state.score,
        xpAwarded: state.xpAwarded,
        awardedKeys: [...state.awardedKeys],
        ledger: state.ledger,
        bennetSightings: [...state.bennetSightings],
        coverSecretsFound: [...state.coverSecretsFound],
        selectedPinId: state.selectedPinId,
        testedPinIds: [...state.testedPinIds],
        swampSecretsFound: [...state.swampSecretsFound],
        beat1SubMode: state.beat1SubMode,
        foundFarehamAssets: [...state.foundFarehamAssets],
        farehamExtrasFound: [...state.farehamExtrasFound],
        serviReflected: state.serviReflected,
        serviQuizAnswer: state.serviQuizAnswer,
        xraySplitPct: state.xraySplitPct,
        selectedManorId: state.selectedManorId,
        b2MissionIdx: state.b2MissionIdx,
        b2Solved: [...state.b2Solved],
        assizeSpotsHeard: [...state.assizeSpotsHeard],
        rulingVikings: state.rulingVikings,
        rulingBishop: state.rulingBishop,
        assizeVerdictRevealed: state.assizeVerdictRevealed,
        hutPeopleGroups: [...state.hutPeopleGroups],
        foundBlindSpots: [...state.foundBlindSpots],
        hutQuizAnswer: state.hutQuizAnswer,
        translationPct: state.translationPct,
        b5ClueStep: state.b5ClueStep,
        b5SolvedClues: [...state.b5SolvedClues],
        stampAnswers: state.stampAnswers,
        archiveBounty1: state.archiveBounty1,
        archiveBounty2: state.archiveBounty2,
      };
      sessionStorage.setItem(SESSION_SAVE_KEY, JSON.stringify(payload));
    } catch (_) {}
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
      if (Array.isArray(s.awardedKeys)) state.awardedKeys = new Set(s.awardedKeys);
      if (s.ledger && typeof s.ledger === 'object') state.ledger = { ...state.ledger, ...s.ledger };
      if (Array.isArray(s.bennetSightings)) state.bennetSightings = new Set(s.bennetSightings);
      if (Array.isArray(s.coverSecretsFound))
        state.coverSecretsFound = new Set(s.coverSecretsFound);
      if (s.selectedPinId) state.selectedPinId = s.selectedPinId;
      if (Array.isArray(s.testedPinIds)) state.testedPinIds = new Set(s.testedPinIds);
      if (Array.isArray(s.swampSecretsFound))
        state.swampSecretsFound = new Set(s.swampSecretsFound);
      if (s.beat1SubMode) state.beat1SubMode = s.beat1SubMode;
      if (Array.isArray(s.foundFarehamAssets))
        state.foundFarehamAssets = new Set(s.foundFarehamAssets);
      if (Array.isArray(s.farehamExtrasFound))
        state.farehamExtrasFound = new Set(s.farehamExtrasFound);
      state.serviReflected = Boolean(s.serviReflected);
      state.serviQuizAnswer = s.serviQuizAnswer || null;
      if (typeof s.xraySplitPct === 'number') state.xraySplitPct = s.xraySplitPct;
      if (s.selectedManorId) state.selectedManorId = s.selectedManorId;
      if (typeof s.b2MissionIdx === 'number') state.b2MissionIdx = s.b2MissionIdx;
      if (Array.isArray(s.b2Solved)) state.b2Solved = new Set(s.b2Solved);
      if (Array.isArray(s.assizeSpotsHeard)) state.assizeSpotsHeard = new Set(s.assizeSpotsHeard);
      state.rulingVikings = s.rulingVikings || null;
      state.rulingBishop = s.rulingBishop || null;
      state.assizeVerdictRevealed = Boolean(s.assizeVerdictRevealed);
      if (Array.isArray(s.hutPeopleGroups)) state.hutPeopleGroups = new Set(s.hutPeopleGroups);
      if (Array.isArray(s.foundBlindSpots)) state.foundBlindSpots = new Set(s.foundBlindSpots);
      state.hutQuizAnswer = s.hutQuizAnswer || null;
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
    audio.stopVoice();
    state.step = 'cover';
    state.resetArmed = false;
    state.closeArmed = false;
    state.activeModal = null;
    state.score = 0;
    state.awardedKeys.clear();
    state.ledger = {
      cover: 0,
      beat0: 0,
      beat1: 0,
      beat2: 0,
      beat3: 0,
      beat4: 0,
      beat5: 0,
      beat6: 0,
      turnips: 0,
    };
    state.bennetSightings.clear();
    state.coverSecretsFound.clear();
    state.selectedPinId = 'gosport';
    state.testedPinIds.clear();
    state.peekSwampAnyway = false;
    state.swampSecretsFound.clear();
    state.beat1SubMode = 'hunt';
    state.foundFarehamAssets.clear();
    state.farehamExtrasFound.clear();
    state.serviReflected = false;
    state.serviQuizAnswer = null;
    state.xraySplitPct = 22;
    state.selectedManorId = 'stubbington';
    state.showModernGhost = false;
    state.b2MissionIdx = 0;
    state.b2Solved.clear();
    state.b2WrongAttempt = '';
    state.assizeSpotsHeard.clear();
    state.rulingVikings = null;
    state.rulingBishop = null;
    state.assizeVerdictRevealed = false;
    state.hutPeopleGroups = new Set(['husband_head']);
    state.foundBlindSpots.clear();
    state.hutQuizAnswer = null;
    state.translationPct = 0;
    state.activeChunkIdx = 0;
    state.b5ClueStep = 0;
    state.b5SolvedClues.clear();
    state.b5WrongChunkIdx = -1;
    state.stampAnswers = {};
    state.archiveBounty1 = null;
    state.archiveBounty2 = null;
    audio.setMode('overture');
    setSpeech(
      'salty',
      'Salty the Solent Seagull • 1086 Tour Guide',
      'Squawk! Fresh parchment unrolled! Tap any glowing gold spot on the cover—or press BEGIN 1086 ROYAL AUDIT!',
      'cover_salty_intro',
    );
    mountedSceneSignature = '';
    render({ isStepNavigation: true });
  }

  hydrateSessionState();

  function cleanupMicRecorder() {
    if (activeMediaRecorder && activeMediaRecorder.state !== 'inactive') {
      try {
        activeMediaRecorder.stop();
      } catch (_) {}
    }
    activeMediaRecorder = null;
    recordingClipId = null;
    if (activeMicStream) {
      activeMicStream.getTracks().forEach((t) => t.stop());
      activeMicStream = null;
    }
  }

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
    if (shellEl && shellEl.scrollTop !== snap.shellTop) shellEl.scrollTop = snap.shellTop;
    const modalEl = document.getElementById('hh-classroom-lab-modal');
    if (modalEl && modalEl.scrollTop !== snap.modalTop) modalEl.scrollTop = snap.modalTop;
    const mainEl = document.getElementById('main-content');
    if (mainEl && mainEl.scrollTop !== snap.mainTop) mainEl.scrollTop = snap.mainTop;
    if (
      typeof window !== 'undefined' &&
      (window.scrollY !== snap.winY || window.scrollX !== snap.winX)
    ) {
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

  function nudgeNextButtonIntoViewIfOffscreen() {
    if (!shellEl || typeof window === 'undefined') return;
    setTimeout(() => {
      if (unmounted || !shellEl) return;
      const btn = shellEl.querySelector('.dst-next-btn, .dst-victory-card');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      if (rect.bottom > window.innerHeight + 18) {
        btn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 90);
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

  // Always stops previous speech immediately so audio NEVER bleeds across clicks or stages!
  function setSpeech(avatarKey, speaker, text, voClipId = null) {
    audio.stopVoice();
    state.avatarKey = avatarKey || 'salty';
    state.speakerName = speaker;
    state.speechText = text;
    state.lastVoClipId = voClipId || null;
    if (voClipId) {
      audio.playVoice(voClipId);
    }
  }

  audio.onVoStateChange = () => {
    if (!unmounted && shellEl) {
      const spSlot = shellEl.querySelector('#dst-speech-slot');
      if (spSlot) spSlot.innerHTML = renderSpeechInnerHTML();
      const covSlot = shellEl.querySelector('#dst-cover-quote-slot');
      if (covSlot) covSlot.innerHTML = renderCoverQuoteInnerHTML();
    }
  };

  function triggerHintPulse() {
    state.hintShimmer = true;
    shellEl?.classList.add('dst-hint-shimmer');
    if (shimmerTimeout) clearTimeout(shimmerTimeout);
    shimmerTimeout = setTimeout(() => {
      state.hintShimmer = false;
      shellEl?.classList.remove('dst-hint-shimmer');
    }, 2200);
  }

  function resolveMusicMode() {
    if (state.step === 'cover') return 'overture';
    if (state.step === 'beat0') return 'marsh_shanty';
    if (state.step === 'beat1') return state.beat1SubMode === 'servi' ? 'solemn' : 'millwheel_jig';
    if (state.step === 'beat2') return 'norman_march';
    if (state.step === 'beat3') return 'assize';
    if (state.step === 'beat4') return 'hearth_pastoral';
    if (state.step === 'beat5') return 'scriptorium';
    return Object.keys(state.stampAnswers).length >= 3 ? 'victory_jubilee' : 'overture';
  }

  function getSceneSignature() {
    if (!data) return 'loading';
    if (state.step === 'beat0') {
      const selPin =
        data.modernPins.find((p) => p.id === state.selectedPinId) || data.modernPins[0];
      const isTested = state.testedPinIds.has(selPin.id);
      const showSwamp = isTested && (!selPin.existed1086 || state.peekSwampAnyway);
      return `beat0:${showSwamp ? 'swamp' : isTested ? 'dossier' : 'start'}`;
    }
    if (state.step === 'beat1') return `beat1:${state.beat1SubMode}`;
    if (state.step === 'beat6') {
      return `beat6:${Object.keys(state.stampAnswers).length >= 3 ? 'won' : 'stamps'}`;
    }
    return state.step;
  }

  function goToStep(nextStep) {
    state.step = nextStep;
    state.resetArmed = false;
    state.closeArmed = false;
    audio.setMode(resolveMusicMode());

    if (nextStep === 'cover') {
      setSpeech(
        'salty',
        'Salty the Solent Seagull • 1086 Tour Guide',
        'Squawk! Tap any glowing gold spot on the cover—or press BEGIN 1086 ROYAL AUDIT!',
        'cover_salty_intro',
      );
    } else if (nextStep === 'beat0') {
      setSpeech(
        'salty',
        'Salty the Solent Seagull • Stage 1 of 7',
        'Stage One! Tap any two coastal places on the map (or town buttons below) to see whose house survives in 1086!',
        'beat0_salty_guide',
      );
    } else if (nextStep === 'beat1') {
      if (state.beat1SubMode === 'servi') {
        setSpeech(
          'gyrth',
          'Gyrth • Enslaved Ploughman in Fareham (1 of 10 Servi)',
          'The Bishop’s scribe wrote all ten of us down on the parchment right beside the plough-oxen. In 1086 Fareham, enslaved workers own no land, and we cannot leave.',
          'beat1_gyrth_servi',
        );
      } else {
        setSpeech(
          'odo',
          'Sweating Reeve Odo • Stage 2 of 7',
          'I swear on Saint Swithin’s holy bones, my Lord—barely two squeaky little watermills in all of Fareham! Click the glowing spots to check if I’m lying!',
          'beat1_odo_oath',
        );
      }
    } else if (nextStep === 'beat2') {
      setSpeech(
        'salty',
        'Salty the Solent Seagull • Stage 3 of 7',
        'Squawk! Stage Three—the 1066 Wipeout! Drag the golden X-Ray bar across the Solent map and crack our 3 detective clues!',
        'beat2_salty_xray',
      );
    } else if (nextStep === 'beat3') {
      setSpeech(
        'villager',
        'Wulf of Fareham • Stage 4 of 7 (Royal Courtroom)',
        'Tap the witnesses in the torch-lit hall to hear both sides—then pick your 2 Royal Rulings and SLAM THE GAVEL!',
        'beat3_villager_plea',
      );
    } else if (nextStep === 'beat4') {
      setSpeech(
        'monk',
        'Brother Aldwin • Stage 5 of 7 (Edith’s Hut #3)',
        'Domesday says Stubbington has "9 households"—tap inside Hut #3 to count how many REAL human beings are hiding in just ONE household!',
        'beat4_monk_myth',
      );
    } else if (nextStep === 'beat5') {
      setSpeech(
        'monk',
        'Great Domesday Folio 46v • Stage 6 of 7 (Crack the Latin)',
        'Behold Stubbington’s genuine 1086 entry! Use the Scribe Key on the right to tap the 3 matching Latin lines!',
        'beat5_stubitone_latin',
      );
    } else if (nextStep === 'beat6') {
      if (!state.xpAwarded) {
        state.xpAwarded = true;
        ctx.onRoundComplete?.();
      }
      saveArcadePersonalBest('medieval_england', 'domesday_stubitone', 'all', state.score);
      if (Object.keys(state.stampAnswers).length >= 3) {
        setSpeech(
          'guy',
          'Royal Audit Complete — You Beat the Game! 🏆',
          'Every village figure you investigated comes straight from the real 1086 Domesday Book—claim or print your Official Royal Warrant below!',
          'beat5_debrief_historian',
        );
      } else {
        setSpeech(
          'salty',
          'Salty the Solent Seagull • Stage 7 of 7 (Final Boss!)',
          'Final challenge! Stamp these 3 claims Real 1086 or Comedy Cast to slam King William’s Great Seal and beat the game!',
          'beat6_salty_finale',
        );
      }
    }

    persistSessionState();
    preloadUpcomingStageAssets(nextStep);
    render({ isStepNavigation: true });
  }

  function toggleFullscreenMode() {
    state.isFullscreen = !state.isFullscreen;
    shellEl?.classList.toggle('dst-is-fullscreen', state.isFullscreen);
    ctx.onFullscreenChange?.(state.isFullscreen);
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
      ctx.onFullscreenChange?.(false);
      syncHudOnly();
    }
  };
  if (typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', onBrowserFsChange);
  }

  // =========================================================================
  // PRINTABLE CERTIFICATES & YEAR 7 CLASS DRAMA SCRIPT (100% ANONYMOUS)
  // =========================================================================
  function openPrintableCommissionerWarrant() {
    if (typeof window === 'undefined') return;
    const win = window.open('', '_blank', 'width=880,height=660');
    if (!win) return;
    const rank = computeRankFromScore(state.score);
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    win.document.write(`<!DOCTYPE html>
      <html lang="en"><head><meta charset="utf-8"><title>1086 Royal Domesday Commissioner Warrant</title>
      <style>
        body { font-family: Georgia, serif; background: #f8fafc; margin: 0; padding: 24px; text-align: center; color: #1c1917; }
        .warrant { max-width: 760px; margin: 0 auto; padding: 32px 38px; background: #fffbeb; border: 7px double #92400e; border-radius: 16px; box-shadow: 0 12px 30px rgba(0,0,0,0.12); }
        .kicker { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 900; letter-spacing: 1.5px; color: #9a3412; text-transform: uppercase; }
        h1 { font-size: 28px; margin: 8px 0 4px; color: #1c1917; }
        .rank { font-size: 18px; font-weight: bold; color: #15803d; margin: 6px 0 14px; }
        .line { display: inline-block; width: 280px; border-bottom: 2px solid #44403c; margin: 12px 0 4px; height: 24px; }
        .pills { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; margin: 14px 0 18px; font-family: system-ui, sans-serif; font-size: 11.5px; font-weight: 800; }
        .pill { padding: 4px 11px; border-radius: 999px; background: #dcfce7; border: 1px solid #16a34a; color: #14532d; }
        @media print { .no-print { display: none; } body { background: #fff; padding: 0; } }
      </style></head><body>
      <div class="warrant">
        <div class="kicker">The History Revision Hub • Key Stage 3 Medieval England (1066–1086)</div>
        <div style="font-size:42px;margin:6px 0;">${rank.icon}</div>
        <h1>Royal 1086 Domesday Commissioner Warrant</h1>
        <div class="rank">Official Rank: ${rank.title} (${state.score} Silver Pennies)</div>
        <p style="font-size:14.5px;color:#44403c;margin:0 0 8px;">Awarded for completing <em>The 1086 Domesday Survey: Stubitone</em> &amp; investigating genuine 1086 Hampshire Domesday records</p>
        <div><span class="line"></span><div style="font-size:12px;color:#57534e;">Royal Commissioner’s Name</div></div>
        <div class="pills">
          <span class="pill">✓ 1086 Solent Town Audit</span>
          <span class="pill">✓ Fareham’s 5 Mills &amp; 10 Servi</span>
          <span class="pill">✓ 1066 Saxon Land Wipeout</span>
          <span class="pill">✓ Fareham Viking Tax Verdict</span>
          <span class="pill">✓ Stubbington Hidden Households</span>
          <span class="pill">✓ Folio 46v Latin Decoded</span>
          <span class="pill">🥕 Turnip Seals: ${state.bennetSightings.size}/3</span>
        </div>
        <div style="font-size:12.5px;color:#57534e;">Sealed at Winchester • ${dateStr}</div>
        <div class="no-print" style="margin-top:18px;">
          <button onclick="window.print()" style="padding:10px 22px;font-weight:800;border-radius:8px;border:none;background:#b45309;color:#fff;cursor:pointer;">🖨️ Print / Save Warrant as PDF</button>
        </div>
      </div></body></html>`);
    win.document.close();
  }

  function openPrintableClassDramaScript() {
    if (typeof window === 'undefined') return;
    const win = window.open('', '_blank', 'width=900,height=720');
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
      <html lang="en"><head><meta charset="utf-8"><title>1086 Domesday Class Voice-Acting Script</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 24px; color: #1c1917; background: #fff; }
        .wrap { max-width: 780px; margin: 0 auto; }
        h1 { font-family: Georgia, serif; font-size: 22px; margin: 4px 0; }
        .sub { font-size: 13px; color: #57534e; margin-bottom: 14px; border-bottom: 2px solid #b45309; padding-bottom: 8px; }
        .cue { border: 1.5px solid #d6d3d1; border-radius: 8px; padding: 8px 12px; margin-bottom: 8px; page-break-inside: avoid; }
        .role { font-weight: 900; font-size: 13px; color: #9a3412; }
        .dir { font-size: 11.5px; font-style: italic; color: #57534e; margin-bottom: 3px; }
        .line { font-family: Georgia, serif; font-size: 14px; font-weight: 700; color: #0f172a; }
        @media print { .no-print { display: none; } body { padding: 10px; } }
      </style></head><body>
      <div class="wrap">
        <div class="no-print" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;">
          <strong style="color:#9a3412;">The History Revision Hub • Year 7 Drama &amp; Oracy Extension</strong>
          <button onclick="window.print()" style="padding:8px 18px;font-weight:800;border-radius:8px;border:none;background:#ea580c;color:#fff;cursor:pointer;">🖨️ Print Class Script</button>
        </div>
        <h1>🎭 The 1086 Domesday Survey: Stubitone — Class Voice-Acting Script</h1>
        <div class="sub">Assign 10 pupils a medieval character! Record directly inside the simulation’s <strong>🎙️ Voice Act</strong> booth to hear your own class inside the audit.</div>
        ${DRAMA_CAST_SCRIPT.map(
          (c, i) => `
          <div class="cue">
            <div class="role">#${i + 1} • ${c.role}</div>
            <div class="dir">Acting tip: ${c.direction}</div>
            <div class="line">&ldquo;${c.line}&rdquo;</div>
          </div>
        `,
        ).join('')}
      </div></body></html>`);
    win.document.close();
  }

  // =========================================================================
  // PARTIAL HTML FRAGMENT BUILDERS
  // =========================================================================
  function getStageMicroHint() {
    if (state.step === 'beat0') return '📍 Tap any 2 coastal towns on map';
    if (state.step === 'beat2') return '🗺️ Drag X-Ray bar & tap shields';
    if (state.step === 'beat5') return '📜 Use Scribe Key to tap 3 Latin lines';
    if (state.step === 'beat6') return '🔨 Stamp all 3 claims to beat the game!';
    return '✨ Tap labeled items in scene';
  }

  function renderMissionBannerHTML(text, progressText, isDone) {
    return `
      <div class="dst-mission-banner ${isDone ? 'is-complete' : ''}">
        <span>${isDone ? '✅' : '🎯'} ${text}</span>
        <span class="dst-mission-progress">${progressText}</span>
      </div>
    `;
  }

  function renderVoControlsHTML() {
    const playing = audio.isVoicePlaying();
    if (!state.lastVoClipId && !playing) return '';
    return `
      <span style="display:inline-flex;align-items:center;gap:5px;">
        ${
          playing
            ? `<button type="button" class="dst-vo-pill-btn" data-vo-act="stop" title="Stop current character voice">
                 <i class="fa-solid fa-stop"></i> Stop
               </button>`
            : ''
        }
        ${
          state.lastVoClipId
            ? `<button type="button" class="dst-vo-pill-btn" data-vo-act="replay" title="Replay character voice line">
                 <i class="fa-solid fa-volume-high"></i> Replay
               </button>`
            : ''
        }
      </span>
    `;
  }

  function renderTopBarInnerHTML() {
    const curIdx = Math.max(
      0,
      STEPS.findIndex((s) => s.id === state.step),
    );
    const prevStep = curIdx > 0 ? STEPS[curIdx - 1].id : '';
    const nextStep = curIdx < STEPS.length - 1 ? STEPS[curIdx + 1].id : '';
    const customCount = audio.classBlobUrls.size;

    return `
      <div class="dst-step-strip" role="tablist" aria-label="1086 Domesday Stages">
        ${STEPS.map((s) => {
          const isAct = state.step === s.id;
          const isDone = isStepTrulyComplete(s.id);
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
            const isDone = isStepTrulyComplete(s.id);
            return `<option value="${s.id}" ${isAct ? 'selected' : ''}>${isDone && !isAct ? '✓ ' : ''}${s.mob}</option>`;
          }).join('')}
          ${state.score > 0 || state.step !== 'cover' ? `<option value="__reset__">↺ Restart Audit</option>` : ''}
        </select>
        <button type="button" class="dst-mob-arrow-btn" id="dst-mob-next" ${nextStep ? `data-goto-step="${nextStep}"` : 'disabled'} aria-label="Next Stage">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <div class="dst-ctrl-group">
        <span class="dst-score-chip" title="Your Silver Penny Score (carries over to Stage 7 Royal Rank!)">
          🪙 ${state.score}<span class="dst-score-verb"> pts</span> • ${state.bennetSightings.size >= 3 ? '🥕 3/3★' : `🥕 ${state.bennetSightings.size}/3`}
        </span>
        <button type="button" class="dst-icon-btn dst-hide-narrow ${audio.voicePack === 'class_cast' ? 'is-active' : ''}" data-dst-action="drama" title="Class Voice-Acting Booth & Printable Script">
          <i class="fa-solid fa-microphone-lines"></i>
          <span class="dst-btn-lbl">${audio.voicePack === 'class_cast' ? `Class Cast (${customCount})` : 'Voice Act'}</span>
        </button>
        ${
          state.score > 0 || state.step !== 'cover'
            ? `<button type="button" class="dst-icon-btn dst-hide-narrow ${state.resetArmed ? 'is-armed-warn' : ''}" data-dst-action="reset" title="${state.resetArmed ? 'Click again to confirm restart' : 'Restart 1086 Audit'}" aria-label="Restart Audit">
                 <i class="fa-solid fa-rotate-left"></i>${state.resetArmed ? '<span class="dst-btn-lbl">Sure?</span>' : ''}
               </button>`
            : ''
        }
        <button type="button" class="dst-icon-btn ${!audio.muted ? 'is-active' : ''}" data-dst-action="mute" title="Soundtrack: ${audio.getActiveTrackTitle()} — Click to Mute/Unmute" aria-label="Toggle Audio">
          <i class="fa-solid ${audio.muted ? 'fa-volume-xmark' : 'fa-music'}"></i>
          <span class="dst-btn-lbl">${audio.muted ? 'Muted' : 'Audio'}</span>
        </button>
        <button type="button" id="dst-fs-btn" class="dst-icon-btn ${state.isFullscreen ? 'is-active' : ''}" data-dst-action="fs" title="Toggle Full-Screen View" aria-label="Toggle Full Screen">
          <i class="fa-solid ${state.isFullscreen ? 'fa-compress' : 'fa-expand'}"></i>
          <span class="dst-btn-lbl">${state.isFullscreen ? 'Windowed' : 'Full Screen'}</span>
        </button>
        ${
          typeof ctx.onCloseModal === 'function'
            ? `<button type="button" class="dst-icon-btn ${state.closeArmed ? 'is-armed-warn' : ''}" data-dst-action="close" style="border-color:#ef4444;color:#fecaca;" aria-label="Close Adventure">
                 <i class="fa-solid fa-xmark"></i><span class="dst-btn-lbl">${state.closeArmed ? 'Exit?' : 'Close'}</span>
               </button>`
            : ''
        }
      </div>
    `;
  }

  function renderSpeechInnerHTML() {
    const av = SPEAKER_AVATARS[state.avatarKey] || SPEAKER_AVATARS.salty;
    return `
      <div class="dst-avatar-medallion"
           style="background:${av.bg};border:2px solid ${av.border};display:flex;align-items:center;justify-content:center;font-size:1.35rem;line-height:1;"
           aria-hidden="true">${av.icon}</div>
      <div style="flex:1;min-width:0;">
        <div class="dst-speech-speaker">
          <span>🎙️ ${state.speakerName}</span>
          <span style="display:inline-flex;align-items:center;gap:6px;">
            ${renderVoControlsHTML()}
            <span class="dst-speech-hint-chip">${getStageMicroHint()}</span>
          </span>
        </div>
        <p class="dst-speech-text">&ldquo;${state.speechText}&rdquo;</p>
      </div>
    `;
  }

  function renderSceneFooterBarHTML(secretFoundCount, secretTotalCount, captionText) {
    return `
      <div class="dst-scene-caption-strip" id="dst-scene-caption-slot">
        <span id="dst-scene-secret-tally">✨ <strong>Hotspots:</strong> ${secretFoundCount} / ${secretTotalCount}</span>
        <span class="dst-caption-mid" style="color:#a8a29e;">${captionText}</span>
        <button type="button" class="dst-icon-btn" data-action="hint-shimmer" style="min-height:30px;padding:3px 9px;font-size:0.72rem;">
          ✨ Flash Spots
        </button>
      </div>
    `;
  }

  function renderCoverQuoteInnerHTML() {
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:3px;">
        <span style="font-size:0.71rem;font-weight:900;color:#fbbf24;text-transform:uppercase;">
          🎙️ ${state.speakerName} • (${state.coverSecretsFound.size}/6 Cast Previewed)
        </span>
        ${renderVoControlsHTML()}
      </div>
      <div style="font-size:0.84rem;font-weight:700;color:#fef3c7;line-height:1.34;">
        &ldquo;${state.speechText}&rdquo;
      </div>
    `;
  }

  function renderCoverCastChipsHTML() {
    const cast = [
      { id: 'dst-cover-gull', key: 'gull', icon: '🐦', label: 'Salty (Guide)' },
      { id: 'dst-cover-quill', key: 'quill', icon: '🪶', label: 'Clerk Sir Guy' },
      { id: 'dst-cover-pigs', key: 'pigs', icon: '🐷', label: 'Reeve Odo' },
      { id: 'dst-cover-edith', key: 'edith', icon: '🥣', label: 'Edith (Hut #3)' },
      { id: 'dst-cover-bennet', key: 'bennet', icon: '🥕', label: 'Boggy Bennet' },
      { id: 'dst-cover-castle', key: 'castle', icon: '🏰', label: 'Portchester Fort' },
    ];
    return cast
      .map((c) => {
        const seen = state.coverSecretsFound.has(c.key);
        return `
          <button type="button" id="${c.id}" class="dst-cast-chip ${seen ? 'is-found' : ''}">
            <span>${c.icon}</span>
            <span>${c.label}</span>
            <span class="dst-cast-status">${seen ? '✓' : '🔊'}</span>
          </button>
        `;
      })
      .join('');
  }

  function renderCoverHTML() {
    return `
      <div class="dst-cover-wrap">
        <div class="dst-cover-launchpad">
          <div class="dst-cover-visual-col">
            <div class="dst-cover-art-box" id="dst-fx-stage" data-fx-preset="cover">
              <img src="/images/ks3_med7/med7_l1_card_bayeux_norman_fleet_scene38.jpg"
                   alt="Bayeux Tapestry Scene 38 — King William’s 1066 invasion fleet crossing the Channel toward southern England"
                   class="domesday-diorama-img" />
              <div class="dst-cover-plate-badge">🏛️ Bayeux Tapestry (c. 1070s) • Scene 38: Duke William’s Invasion Fleet</div>
            </div>

            <div class="dst-cast-strip-wrap">
              <div class="dst-cast-strip-label">🎭 Tap to Audition the 1086 Cast (+15 pts each):</div>
              <div class="dst-cast-strip-grid" id="dst-cover-cast-slot">
                ${renderCoverCastChipsHTML()}
              </div>
            </div>
          </div>

          <div class="dst-cover-info-col">
            <div>
              <div class="dst-lucas-kicker">📜 ARCHIVAL FIELDWORK SIMULATION • HAMPSHIRE FOLIO 46v (1086)</div>
              <h2 class="dst-lucas-title">THE 1086 DOMESDAY SURVEY: STUBITONE</h2>
              <p class="dst-lucas-sub">
                Step into 1086 Hampshire as King William’s Royal Commissioner! Rewind Solent towns into salt-marsh, catch sweating Reeve Odo hiding Fareham watermills, judge a real Norman tax trial, count who Domesday missed inside Stubbington Cottage #3, and crack genuine Folio 46v Latin.
              </p>

              <div class="dst-cover-pills-row">
                <span class="dst-cover-pill">🗺️ 7 Interactive Stages</span>
                <span class="dst-cover-pill">🎙️ 11 Acted Studio Voices</span>
                <span class="dst-cover-pill">🥕 3 Secret Turnips</span>
                <span class="dst-cover-pill">📜 Real 1086 Folio 46v</span>
              </div>
            </div>

            <button type="button" class="dst-start-cta" id="dst-btn-start-adventure" style="width:100%;">
              ▶ BEGIN 1086 ROYAL AUDIT (STAGE 1)
            </button>

            <div class="dst-cover-quote-wrap" id="dst-cover-quote-slot" role="status" aria-live="polite">
              ${renderCoverQuoteInnerHTML()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // STAGE 1 (beat0): INSTANT 1-CLICK COASTAL TOWN REWIND
  // =========================================================================
  function renderBeat0LeftMapAndPillsHTML() {
    return `
      <div class="dst-map-frame" id="dst-solent-map-wrap">
        ${renderSolentGisSvgHTML({
          data,
          mode: 'swamp',
          rewound1086: state.testedPinIds.size > 0,
          selectedPinId: state.selectedPinId,
          testedPinIds: state.testedPinIds,
          svgUid: `${instanceSvgUid}-b0`,
        })}
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
        ${data.modernPins
          .map((p) => {
            const tested = state.testedPinIds.has(p.id);
            const active = state.selectedPinId === p.id && tested;
            return `
              <button type="button" class="dst-step-pill ${active ? 'is-active' : ''} ${tested && !active ? 'is-done' : ''}" data-pick-pin="${p.id}">
                ${tested ? (p.existed1086 ? '🏠 ' : '🌊 ') : '📍 '}${p.modernName}
              </button>
            `;
          })
          .join('')}
      </div>
    `;
  }

  function renderBeat0RightHeaderHTML() {
    const selPin = data.modernPins.find((p) => p.id === state.selectedPinId) || data.modernPins[0];
    const isTested = state.testedPinIds.has(selPin.id);
    const vanished = isTested && !selPin.existed1086;
    const testedCount = state.testedPinIds.size;

    return `
      ${renderMissionBannerHTML(
        'Tap at least 2 coastal places on the map (or buttons) to rewind 940 years!',
        `${Math.min(2, testedCount)} / 2 Tested`,
        testedCount >= 2,
      )}
      ${
        isTested
          ? `
        <div style="padding:11px 13px;border-radius:11px;margin-bottom:10px;border:2px solid ${vanished ? '#ef4444' : '#22c55e'};background:${vanished ? 'rgba(127,29,29,0.32)' : 'rgba(20,83,45,0.32)'};">
          <div style="font-weight:900;font-size:0.98rem;color:${vanished ? '#fca5a5' : '#86efac'};margin-bottom:4px;">
            ${selPin.headline}
          </div>
          <p style="margin:0;font-size:0.84rem;line-height:1.42;color:#f5f5f4;">${selPin.verdict}</p>
        </div>
      `
          : `
        <div style="padding:14px;border-radius:11px;background:#292524;border:1.5px dashed #f59e0b;text-align:center;margin-bottom:10px;">
          <div style="font-size:1.35rem;margin-bottom:4px;">🗺️ ⏪</div>
          <div style="font-size:0.9rem;font-weight:800;color:#fef3c7;margin-bottom:4px;">Click Any Coastal Place to Rewind Instantly!</div>
          <p style="margin:0;font-size:0.82rem;color:#d6d3d1;line-height:1.4;">
            Try clicking <strong>Gosport</strong> or <strong>Portsmouth</strong> first, then compare them with <strong>Stubbington</strong>, <strong>Fareham</strong>, or <strong>Portchester</strong>!
          </p>
        </div>
      `
      }
    `;
  }

  function renderBeat0DossierCardHTML() {
    const selPin = data.modernPins.find((p) => p.id === state.selectedPinId) || data.modernPins[0];
    const selManor = data.manors.find((m) => m.id === state.selectedPinId);
    return `
      <div style="padding:11px 12px;border-radius:11px;background:#292524;border:1.5px solid #44403c;margin-bottom:8px;">
        <div style="font-size:0.77rem;font-weight:900;color:#fde047;margin-bottom:6px;">
          📜 1086 DOMESDAY SNAPSHOT: ${selManor ? `${selManor.name.toUpperCase()} (${selManor.domesdayName})` : selPin.modernName}
        </div>
        ${
          selManor
            ? `
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:7px;font-size:0.81rem;margin-bottom:8px;">
            <div style="background:#1c1917;padding:7px 9px;border-radius:7px;">🏠 <strong>${selManor.households} Households</strong> (~${selManor.households * 5} real people)</div>
            <div style="background:#1c1917;padding:7px 9px;border-radius:7px;">⚙️ <strong>${selManor.mills} Watermills</strong> • ${selManor.ploughs} Ploughs</div>
            <div style="background:#1c1917;padding:7px 9px;border-radius:7px;">🛡️ <strong>1066:</strong> ${selManor.lord1066}</div>
            <div style="background:#1c1917;padding:7px 9px;border-radius:7px;">⚔️ <strong>1086:</strong> ${selManor.lord1086}</div>
          </div>
        `
            : ''
        }
        <button type="button" class="dst-icon-btn" id="dst-btn-peek-swamp" style="width:100%;border-color:#fb923c;color:#fed7aa;">
          🐸 Peek at Boggy Bennet in Empty 1086 Gosport Marsh (🥕 Turnip #1!)
        </button>
      </div>
    `;
  }

  function renderBeat0HTML() {
    const selPin = data.modernPins.find((p) => p.id === state.selectedPinId) || data.modernPins[0];
    const isTested = state.testedPinIds.has(selPin.id);
    const showSwampScene = isTested && (!selPin.existed1086 || state.peekSwampAnyway);

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
              showSwampScene
                ? `
              <div class="dst-diorama-frame" id="dst-fx-stage" data-fx-preset="swamp">
                <div id="dst-svg-stage-slot" class="dst-svg-stage-host">
                  ${renderGosportSaltMarshSVG({
                    swampSecretsFound: state.swampSecretsFound,
                    bennetFound: state.bennetSightings.has('swamp'),
                  })}
                </div>
              </div>
              ${renderSceneFooterBarHTML(
                state.swampSecretsFound.size + (state.bennetSightings.has('swamp') ? 1 : 0),
                4,
                'Tap Bennet (🥕 Turnip #1!), Salty, Fareham mills & torch!',
              )}
              ${renderArchivalEvidenceCardHTML({
                img: '/images/medieval_england/plate_2_1_bayeux_castle_building.jpg',
                kicker: 'Archival Evidence • Bayeux Tapestry Scene 45',
                caption: 'While Gosport and Portsmouth remained empty salt-marsh in 1086, Norman lords fortified key harbours like Portchester and Hastings using English labour.',
                alt: 'Bayeux Tapestry Scene 45 showing medieval labourers digging coastal earthworks with iron-shod spades',
              })}
            `
                : isTested
                  ? `<div id="dst-b0-dossier-slot">${renderBeat0DossierCardHTML()}</div>`
                  : ''
            }

            <div id="dst-b0-next-slot">
              ${
                state.testedPinIds.size >= 2
                  ? `<button type="button" class="dst-next-btn" data-complete-next="beat1">
                       Stage 2 → Ride Up Fareham Creek &amp; Catch Reeve Odo! <i class="fa-solid fa-arrow-right"></i>
                     </button>`
                  : `<div style="margin-top:8px;font-size:0.78rem;color:#a8a29e;text-align:center;">
                       👆 Test ${2 - state.testedPinIds.size} more coastal place${2 - state.testedPinIds.size === 1 ? '' : 's'} to unlock Stage 2!
                     </div>`
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // STAGE 2 (beat1): FAREHAM HIDDEN WEALTH & 10 ENSLAVED WORKERS (SERVI)
  // =========================================================================
  function renderBeat1SubtabsInnerHTML() {
    const foundCount = state.foundFarehamAssets.size;
    const all3Found = foundCount >= 3;
    return `
      <button type="button" class="dst-step-pill ${state.beat1SubMode === 'hunt' ? 'is-active' : ''} ${all3Found ? 'is-done' : ''}" id="dst-b1-tab-hunt">
        <span class="dst-lbl-full">${all3Found ? '✓ ' : '🔎 '}Part A: Catch Reeve Odo (${foundCount}/3 Tax Assets)</span>
        <span class="dst-lbl-short">${all3Found ? '✓ ' : '🔎 '}Part A (${foundCount}/3)</span>
      </button>
      <button type="button" class="dst-step-pill ${state.beat1SubMode === 'servi' ? 'is-active' : ''} ${state.serviQuizAnswer === 'mills_servi' ? 'is-done' : ''}" id="dst-b1-tab-servi">
        <span class="dst-lbl-full">${state.serviQuizAnswer === 'mills_servi' ? '✓ ' : '⚖️ '}Part B: Meet Gyrth — 10 Enslaved Workers ${all3Found ? '' : '🔒'}</span>
        <span class="dst-lbl-short">${state.serviQuizAnswer === 'mills_servi' ? '✓ ' : '⚖️ '}Part B: 10 Servi ${all3Found ? '' : '🔒'}</span>
      </button>
    `;
  }

  function renderBeat1HuntRightPanelHTML() {
    const foundCount = state.foundFarehamAssets.size;
    const all3Found = foundCount >= 3;
    return `
      ${renderMissionBannerHTML(
        'Click all 3 hidden taxable money-makers in the 1086 Fareham Creek estate!',
        `${foundCount} / 3 Found`,
        all3Found,
      )}

      <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:10px;">
        <div style="padding:9px 12px;border-radius:9px;background:#292524;border:1.5px solid ${state.foundFarehamAssets.has('mills') ? '#22c55e' : '#44403c'};font-size:0.83rem;">
          ${state.foundFarehamAssets.has('mills') ? '✅ <strong>5 Spinning Watermills (41 shillings):</strong> Peasants were BANNED by law from grinding flour at home—forcing everyone to pay Bishop Walkelin’s mills!' : '⬜ Money-Maker #1: Tap the <strong>5 spinning watermills</strong> along Fareham Creek...'}
        </div>
        <div style="padding:9px 12px;border-radius:9px;background:#292524;border:1.5px solid ${state.foundFarehamAssets.has('pigs') ? '#22c55e' : '#44403c'};font-size:0.83rem;">
          ${state.foundFarehamAssets.has('pigs') ? '✅ <strong>Woodland for 13 Fat Pigs:</strong> Peasants paid "pannage" tax in live hogs just to let pigs eat acorns in the Bishop’s oak woods!' : '⬜ Money-Maker #2: Tap the <strong>13 pigs foraging</strong> in the upper-right oak woods...'}
        </div>
        <div style="padding:9px 12px;border-radius:9px;background:#292524;border:1.5px solid ${state.foundFarehamAssets.has('church_meadow') ? '#22c55e' : '#44403c'};font-size:0.83rem;">
          ${state.foundFarehamAssets.has('church_meadow') ? '✅ <strong>1 Parish Church, 90 Households & 41 Meadow Acres:</strong> Putting Fareham in the top 20% largest settlements in 1086 England!' : '⬜ Money-Maker #3: Tap the <strong>Saxon stone church &amp; hay-meadow</strong> on the left hill...'}
        </div>
      </div>

      ${
        all3Found
          ? `<button type="button" class="dst-next-btn" id="dst-btn-open-servi">
               Part B → Who Pulled the Bishop’s Ploughs? Meet Gyrth <i class="fa-solid fa-arrow-right"></i>
             </button>`
          : `<div style="font-size:0.76rem;color:#a8a29e;text-align:center;">
               💡 Bonus: Question sweating Reeve Odo, check Saint Swithin’s reliquary, and spot Bennet’s Turnip #2 (🥕) in the reeds!
             </div>`
      }
    `;
  }

  function renderBeat1ServiRightPanelHTML() {
    const qAns = state.serviQuizAnswer;
    const isRight = qAns === 'mills_servi';

    return `
      ${renderMissionBannerHTML(
        'Tap Gyrth in the dawn field, then answer the quick check below!',
        isRight ? '1 / 1 Solved' : '0 / 1 Solved',
        isRight,
      )}
      <p style="margin:0 0 9px 0;font-size:0.84rem;color:#e2e8f0;line-height:1.44;">
        Alongside Fareham’s 54 villagers and 26 smallholders, the real 1086 Domesday Book lists <strong>10 <em>servi</em> (enslaved men and women)</strong> in Fareham—plus <strong>4 in Titchfield</strong>, <strong>5 in Wickham</strong>, and <strong>4 in Portchester</strong> (~10% of England’s 1086 workforce).
      </p>

      <div style="font-size:0.82rem;font-weight:800;color:#fde047;margin-bottom:6px;">
        ❓ Quick Detective Check: How did Domesday scribes treat Fareham’s 10 <em>servi</em>?
      </div>
      <button type="button" class="dst-choice-btn ${isRight ? 'is-correct' : ''}" data-servi-quiz="mills_servi">
        📜 Listed them without names right beside the Bishop’s plough-oxen, owning zero land of their own
      </button>
      <button type="button" class="dst-choice-btn ${qAns === 'free_choice' ? 'is-selected-wrong' : ''}" data-servi-quiz="free_choice">
        🪙 Paid them weekly silver wages and let them move freely to Winchester
      </button>
      <button type="button" class="dst-choice-btn ${qAns === 'no_slaves' ? 'is-selected-wrong' : ''}" data-servi-quiz="no_slaves">
        🛡️ Gave each of them 5 acres of private hay-meadow
      </button>

      ${
        qAns && !isRight
          ? `<div style="padding:8px 10px;border-radius:8px;background:rgba(220,38,38,0.22);border:1px solid #ef4444;font-size:0.79rem;color:#fecaca;margin-top:4px;">
               ❌ Listen closely to Gyrth: enslaved <em>servi</em> owned no land, received no wages, and were written right beside the plough-oxen!
             </div>`
          : ''
      }
      ${
        isRight
          ? `<button type="button" class="dst-next-btn" data-complete-next="beat2">
               Stage 3 → Drag the 1066 vs 1086 Land Wipeout Map! <i class="fa-solid fa-arrow-right"></i>
             </button>`
          : ''
      }
    `;
  }

  function renderBeat1HTML() {
    const totalFarehamSecrets =
      state.foundFarehamAssets.size +
      state.farehamExtrasFound.size +
      (state.bennetSightings.has('creek') ? 1 : 0);

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
                <div id="dst-svg-stage-slot" class="dst-svg-stage-host">
                  ${renderFarehamEstateSVG({
                    foundAssets: state.foundFarehamAssets,
                    foundExtras: state.farehamExtrasFound,
                    bennetFound: state.bennetSightings.has('creek'),
                  })}
                </div>
              </div>
              ${renderSceneFooterBarHTML(totalFarehamSecrets, 7, 'Tap 5 watermills, 13 pigs, stone church, Odo & Turnip #2!')}
              ${renderArchivalEvidenceCardHTML({
                img: '/images/medieval_england/luttrell_psalter_watermill_detail_f181r.jpg',
                kicker: 'Primary Illumination • Luttrell Psalter (BL Add MS 42130, f. 181r)',
                caption: 'Genuine 14th-century English manuscript showing a lord’s timber watermill, rushing millrace, and woven wicker eel-traps—every villager paid multure toll to grind grain.',
                alt: 'Luttrell Psalter folio 181r watermill illumination with timber waterwheel and eel-traps',
              })}
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
                <div id="dst-svg-stage-slot" class="dst-svg-stage-host">
                  ${renderServiPloughSVG({
                    serviReflected: state.serviReflected,
                    oxenFound: state.farehamExtrasFound.has('oxen'),
                    overseerFound: state.farehamExtrasFound.has('overseer'),
                  })}
                </div>
              </div>
              ${renderSceneFooterBarHTML(1 + (state.farehamExtrasFound.has('oxen') ? 1 : 0) + (state.farehamExtrasFound.has('overseer') ? 1 : 0), 3, 'Tap Gyrth, the 8-ox plough team, and the mounted bailiff!')}
              ${renderArchivalEvidenceCardHTML({
                img: '/images/medieval_england/tres_riches_heures_ox_plough_f3v.jpg',
                kicker: 'Primary Illumination • Très Riches Heures (Musée Condé MS 65, f. 3v)',
                caption: 'Medieval ploughman guiding a wheeled mouldboard plough pulled by yoked oxen across heavy clay ridges on a lord’s demesne.',
                alt: 'Très Riches Heures folio 3v medieval ox-ploughing scene',
              })}
            </div>

            <div class="dst-card-panel" id="dst-b1-servi-right-slot" style="border-color:#64748b;">
              ${renderBeat1ServiRightPanelHTML()}
            </div>
          </div>
        `
        }
      </div>
    `;
  }

  // =========================================================================
  // STAGE 3 (beat2): 1066 VS 1086 WIPEOUT MAP (ZERO BLOCKER + 3-OPTION THINKING!)
  // =========================================================================
  function renderBeat2ManorCardInnerHTML() {
    const selManor = data.manors.find((m) => m.id === state.selectedManorId) || data.manors[0];
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:5px;">
        <strong style="color:#fde047;font-size:0.91rem;">📍 ${selManor.name} (<em>${selManor.domesdayName}</em> — "${selManor.meaning}")</strong>
        <span style="font-size:0.73rem;color:#a8a29e;">${selManor.households} households • ${selManor.slaves} enslaved</span>
      </div>
      <div style="font-size:0.8rem;color:#e7e5e4;margin-bottom:7px;">
        <span style="color:#86efac;"><strong>1066:</strong> ${selManor.lord1066}</span>
        &nbsp;➔&nbsp;
        <span style="color:#fca5a5;"><strong>1086:</strong> ${selManor.lord1086}</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;font-size:0.74rem;text-align:center;">
        <div style="background:#14532d;padding:5px;border-radius:6px;">1066: <strong>£${selManor.val1066}</strong></div>
        <div style="background:#7f1d1d;padding:5px;border-radius:6px;">1067 Crash: <strong>£${selManor.val1067}</strong></div>
        <div style="background:#78350f;padding:5px;border-radius:6px;">1086: <strong>£${selManor.val1086}</strong></div>
      </div>
    `;
  }

  function renderBeat2MissionsInnerHTML() {
    const mCount = state.b2Solved.size;
    return `
      ${renderMissionBannerHTML(
        'Solve all 3 Wipeout Map Clues (#1, #2, #3) to unlock the Courtroom!',
        `${mCount} / 3 Solved`,
        mCount >= 3,
      )}

      <div style="display:flex;gap:6px;margin-bottom:10px;">
        ${[0, 1, 2]
          .map(
            (idx) => `
          <button type="button" class="dst-step-pill ${state.b2MissionIdx === idx ? 'is-active' : ''} ${state.b2Solved.has('m' + (idx + 1)) ? 'is-done' : ''}"
                  data-b2-step="${idx}" style="flex:1;min-height:32px;padding:4px 8px;font-size:0.74rem;">
            ${state.b2Solved.has('m' + (idx + 1)) ? '✓ ' : ''}Clue #${idx + 1}
          </button>
        `,
          )
          .join('')}
      </div>

      ${
        state.b2MissionIdx === 0
          ? `
        <h4 style="margin:0 0 7px 0;font-size:0.95rem;color:#fef3c7;">Clue #1: Drag the 1066 ↔ 1086 X-Ray Slider!</h4>
        <p style="margin:0 0 9px 0;font-size:0.84rem;color:#d6d3d1;line-height:1.4;">
          Slide the golden X-Ray bar across the map from 1066 to 1086. Out of the <strong>6 private Anglo-Saxon landowners</strong> around Fareham and Stubbington, how many kept their manors?
        </p>
        <button type="button" class="dst-choice-btn ${state.b2Solved.has('m1') ? 'is-correct' : ''}" data-b2-m1="zero">
          ⚔️ <strong>0 out of 6</strong> — Every single local English landowner was replaced by Normans
        </button>
        <button type="button" class="dst-choice-btn ${state.b2WrongAttempt === 'm1_half' ? 'is-selected-wrong' : ''}" data-b2-m1="half">
          🛡️ <strong>3 out of 6</strong> — Half kept their farms after swearing loyalty at Winchester
        </button>
        <button type="button" class="dst-choice-btn ${state.b2WrongAttempt === 'm1_all' ? 'is-selected-wrong' : ''}" data-b2-m1="all">
          🪙 <strong>6 out of 6</strong> — All kept their land by paying double geld tax
        </button>
        ${
          state.b2Solved.has('m1') && !state.b2Solved.has('m2')
            ? `<button type="button" class="dst-next-btn" data-b2-step="1" style="background:linear-gradient(180deg,#d97706 0%,#92400e 100%);">
                 Next → Clue #2: Tap King William’s Royal Manor on the Map! <i class="fa-solid fa-arrow-right"></i>
               </button>`
            : ''
        }
      `
          : state.b2MissionIdx === 1
            ? `
        <h4 style="margin:0 0 7px 0;font-size:0.95rem;color:#fef3c7;">Clue #2: Tap Directly on the Solent Map! 👑</h4>
        <p style="margin:0 0 9px 0;font-size:0.84rem;color:#d6d3d1;line-height:1.4;">
          Click the shield <strong>directly on the map</strong> (or pick below) for the <strong>ONLY local manor</strong> kept personally by <strong>King William (👑)</strong> instead of going to a Baron or Bishop!
        </p>
        ${
          state.b2WrongAttempt && !state.b2WrongAttempt.startsWith('m') && !state.b2Solved.has('m2')
            ? `<div style="padding:8px 10px;border-radius:9px;background:rgba(220,38,38,0.22);border:1px solid #ef4444;font-size:0.8rem;color:#fecaca;margin-bottom:8px;">
                 ❌ Not <strong>${state.b2WrongAttempt}</strong>! Hint: Look west along the <strong>River Meon</strong> for the golden Crown shield (👑)!
               </div>`
            : ''
        }
        ${
          state.b2Solved.has('m2')
            ? `<div style="padding:9px 11px;border-radius:9px;background:rgba(22,163,74,0.22);border:1px solid #22c55e;font-size:0.82rem;color:#dcfce7;">
                 ✅ <strong>TITCHFIELD (Ticefelle) FOUND!</strong> Capital of Titchfield Hundred—kept personally by King William!
               </div>
               ${
                 !state.b2Solved.has('m3')
                   ? `<button type="button" class="dst-next-btn" data-b2-step="2" style="background:linear-gradient(180deg,#d97706 0%,#92400e 100%);">
                        Next → Clue #3: Solve the 1067 Value Crash! <i class="fa-solid fa-arrow-right"></i>
                      </button>`
                   : ''
               }`
            : `<div style="padding:10px;border-radius:9px;background:#292524;border:1px dashed #fde047;font-size:0.81rem;color:#fde68a;text-align:center;">
                 👆 Tap the 👑 shield directly on the map (on the River Meon)!
               </div>`
        }
      `
            : `
        <h4 style="margin:0 0 7px 0;font-size:0.95rem;color:#fef3c7;">Clue #3: Why Did Values Plunge in 1066–67? 🔥</h4>
        <p style="margin:0 0 9px 0;font-size:0.84rem;color:#d6d3d1;line-height:1.4;">
          Tap <strong>Fareham</strong> (£18 ➔ £10) or <strong>Wickham</strong> (£10 ➔ £4) on the map. Why did Domesday’s middle valuation drop so sharply right after Hastings?
        </p>
        <button type="button" class="dst-choice-btn ${state.b2Solved.has('m3') ? 'is-correct' : ''}" data-b2-m3="army">
          🔥 Marching Norman troops seized livestock, trampled crops &amp; burned stores en route to Winchester
        </button>
        <button type="button" class="dst-choice-btn ${state.b2WrongAttempt === 'm3_coins' ? 'is-selected-wrong' : ''}" data-b2-m3="coins">
          🪙 King William abolished silver penny coins for the first five years of his reign
        </button>
        <button type="button" class="dst-choice-btn ${state.b2WrongAttempt === 'm3_vikings' ? 'is-selected-wrong' : ''}" data-b2-m3="vikings">
          ⛵ A Danish fleet burned Winchester Cathedral to the ground in 1067
        </button>
      `
      }

      ${
        mCount >= 3
          ? `<button type="button" class="dst-next-btn" data-complete-next="beat3">
               Stage 4 → Enter Torch-Lit Royal Courtroom! <i class="fa-solid fa-arrow-right"></i>
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
                <span style="font-size:0.74rem;font-weight:900;color:#86efac;">1066</span>
                <input type="range" id="dst-xray-range" min="0" max="100" value="${state.xraySplitPct}"
                       style="flex:1;min-width:75px;height:28px;accent-color:#f59e0b;cursor:pointer;" aria-label="1066 to 1086 X-Ray Curtain" />
                <span style="font-size:0.74rem;font-weight:900;color:#fca5a5;">1086</span>
              </div>
              <button type="button" class="dst-icon-btn" id="dst-btn-ghost-toggle">
                👻 <span id="dst-ghost-btn-lbl">${state.showModernGhost ? 'Hide Ghost Towns' : 'Unborn Towns'}</span>
              </button>
              <button type="button" class="dst-icon-btn" id="dst-btn-haircut-gag" style="border-color:#fb923c;color:#fed7aa;">
                ✂️ Norman Haircut
              </button>
            </div>

            <div class="dst-card-panel" id="dst-b2-manor-slot" style="margin-top:9px;padding:10px 13px;">
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

  // =========================================================================
  // STAGE 4 (beat3): ROYAL ASSIZE COURTROOM (NEUTRAL GOLD BEFORE GAVEL SLAM!)
  // =========================================================================
  function renderBeat3RightPanelHTML() {
    const pickedCount = (state.rulingVikings ? 1 : 0) + (state.rulingBishop ? 1 : 0);
    const canSlamGavel = pickedCount >= 2;
    const revealed = state.assizeVerdictRevealed;
    const matchedRealHistory = state.rulingVikings === 'keep20' && state.rulingBishop === 'shame20';

    const btnCls = (curVal, targetVal, realVal) => {
      if (curVal !== targetVal) return '';
      if (!revealed) return 'is-selected-pending';
      return targetVal === realVal ? 'is-correct' : 'is-selected-wrong';
    };

    return `
      ${renderMissionBannerHTML(
        'Choose Ruling 1 & Ruling 2 below, then SLAM THE GAVEL to compare with 1086!',
        revealed ? 'Gavel Slammed!' : `${pickedCount} / 2 Picked`,
        revealed,
      )}

      <div style="margin-bottom:9px;">
        <div style="font-size:0.82rem;font-weight:800;color:#fde68a;margin-bottom:5px;">
          ⚖️ Ruling 1 — King Edward’s Viking Tax Break (30 hides taxed at 20 "because it is on the sea"):
        </div>
        <button type="button" class="dst-choice-btn ${btnCls(state.rulingVikings, 'keep20', 'keep20')}" data-pick-vikings="keep20">
          🛡️ Keep Fareham’s 20-hide coastal Viking discount
        </button>
        <button type="button" class="dst-choice-btn ${btnCls(state.rulingVikings, 'hike30', 'keep20')}" data-pick-vikings="hike30">
          🪙 Cancel the Saxon discount—tax all 30 hides!
        </button>
      </div>

      <div style="margin-bottom:10px;">
        <div style="font-size:0.82rem;font-weight:800;color:#fde68a;margin-bottom:5px;">
          ⚖️ Ruling 2 — Bishop Walkelin’s £20 Rent Squeeze (Fareham only produces £16):
        </div>
        <button type="button" class="dst-choice-btn ${btnCls(state.rulingBishop, 'shame20', 'shame20')}" data-pick-bishop="shame20">
          📜 Record £20—and warn in Latin that Fareham "cannot bear it"!
        </button>
        <button type="button" class="dst-choice-btn ${btnCls(state.rulingBishop, 'force20', 'shame20')}" data-pick-bishop="force20">
          🔨 Rubber-stamp Bishop Walkelin’s £20 silently without warning
        </button>
      </div>

      ${
        !revealed
          ? `
        <button type="button" class="dst-start-cta" id="dst-btn-slam-gavel" style="width:100%;opacity:${canSlamGavel ? '1' : '0.45'};" ${canSlamGavel ? '' : 'disabled'}>
          🔨 SLAM GAVEL &amp; REVEAL REAL 1086 VERDICT!
        </button>
      `
          : `
        <div style="padding:11px 13px;border-radius:11px;background:rgba(20,83,45,0.38);border:2px solid #22c55e;margin-top:6px;">
          <div style="font-weight:900;color:#fde047;font-size:0.86rem;margin-bottom:3px;">
            ${matchedRealHistory ? '🏆 2/2 EXACT MATCH WITH KING WILLIAM’S REAL 1086 COMMISSIONERS!' : '⚡ PLOT TWIST — KING WILLIAM’S REAL SCRIBES DEFENDED FAREHAM!'}
          </div>
          <p style="margin:0;font-size:0.81rem;line-height:1.42;color:#f8fafc;">
            In the genuine 1086 Fareham entry, royal scribes <strong>KEPT the 20-hide Viking discount</strong> (<em>"because of the Vikings, since it is on the sea"</em>) AND shamed Bishop Walkelin in writing: <strong><em>"it pays £20, but it cannot bear it"</em></strong>!
          </p>
        </div>
        <button type="button" class="dst-next-btn" data-complete-next="beat4">
          Stage 5 → Step Inside Edith’s Stubbington Cottage! <i class="fa-solid fa-arrow-right"></i>
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
              <div id="dst-svg-stage-slot" class="dst-svg-stage-host">
                ${renderRoyalAssizeSVG({ heardSet: state.assizeSpotsHeard })}
              </div>
            </div>
            ${renderSceneFooterBarHTML(state.assizeSpotsHeard.size, 5, 'Tap Wulf, Viking shield, Clerk Guy, Sheriff Hugh & Bishop’s bailiff!')}

            <div style="margin-top:8px;padding:9px 12px;border-radius:10px;background:#1c1917;border:1px solid #44403c;font-size:0.79rem;">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;flex-wrap:wrap;gap:4px;">
                <span style="color:#86efac;font-weight:800;">🌾 Fareham’s True Output: £16</span>
                <span style="color:#fca5a5;font-weight:900;">⛪ Bishop Demands: £20 (-£4 Starvation Gap!)</span>
              </div>
              <div style="height:9px;border-radius:999px;background:#7f1d1d;overflow:hidden;display:flex;">
                <div style="width:80%;background:#16a34a;"></div>
              </div>
            </div>

            ${renderArchivalEvidenceCardHTML({
              img: '/images/medieval_england/source_a_bayeux_harold_oath.jpg',
              kicker: 'Primary Evidence • Bayeux Tapestry Scene 23 (Relic Oath)',
              caption: 'Every 1086 Domesday Hundred jury—the parish priest, the reeve, and six villagers—had to swear testimony upon sacred saint reliquaries.',
              alt: 'Bayeux Tapestry Scene 23 showing an oath sworn on sacred reliquaries before a seated Norman ruler',
            })}
          </div>

          <div class="dst-card-panel" id="dst-b3-right-slot">
            ${renderBeat3RightPanelHTML()}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // STAGE 5 (beat4): PURE INSIDE EDITH'S HUT #3 (ZERO DUAL-TAB SPYGLASS CONFUSION!)
  // =========================================================================
  function renderBeat4RightPanelHTML() {
    const peopleCount = computeHutPeopleCount();
    const foundPets = state.foundBlindSpots.has('untaxed_pets');
    const allClicked = peopleCount >= 8 && foundPets;
    const quizRight = state.hutQuizAnswer === 'about45';
    const stageDone = allClicked && quizRight;

    return `
      ${renderMissionBannerHTML(
        'Tap Edith, the 5 children, Grandma & farm pets in Hut #3, then answer below!',
        `${peopleCount}/8 People • ${foundPets ? 'Pets ✓' : 'Pets ?'}`,
        stageDone,
      )}

      <div style="padding:9px 12px;border-radius:10px;background:#292524;border:1.5px solid #f59e0b;margin-bottom:9px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
        <div>
          <div style="font-size:0.68rem;font-weight:900;color:#fde68a;text-transform:uppercase;">DOMESDAY BOOK WRITES</div>
          <div style="font-size:0.92rem;font-weight:900;color:#fca5a5;">"1 Household" (Just Dad!)</div>
        </div>
        <div style="font-size:1.1rem;">➔</div>
        <div style="text-align:right;">
          <div style="font-size:0.68rem;font-weight:900;color:#86efac;text-transform:uppercase;">REAL PEOPLE IN HUT #3</div>
          <div style="font-size:0.95rem;font-weight:900;color:#ffffff;">👨‍👩‍👧‍👦 ${peopleCount} / 8 People!</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;font-size:0.78rem;margin-bottom:10px;">
        <div style="padding:6px 8px;border-radius:7px;background:#292524;border:1px solid ${state.hutPeopleGroups.has('edith') ? '#22c55e' : '#44403c'};">
          ${state.hutPeopleGroups.has('edith') ? '✅ Edith (Wife, +1)' : '⬜ Tap Edith (+1)'}
        </div>
        <div style="padding:6px 8px;border-radius:7px;background:#292524;border:1px solid ${state.hutPeopleGroups.has('five_kids') ? '#22c55e' : '#44403c'};">
          ${state.hutPeopleGroups.has('five_kids') ? '✅ 5 Hungry Kids (+5)' : '⬜ Tap 5 Hungry Kids (+5)'}
        </div>
        <div style="padding:6px 8px;border-radius:7px;background:#292524;border:1px solid ${state.hutPeopleGroups.has('grandma') ? '#22c55e' : '#44403c'};">
          ${state.hutPeopleGroups.has('grandma') ? '✅ Grandma Eadgyth (+1)' : '⬜ Tap Grandma (+1)'}
        </div>
        <div style="padding:6px 8px;border-radius:7px;background:#292524;border:1px solid ${foundPets ? '#22c55e' : '#44403c'};">
          ${foundPets ? '✅ Untaxed Hens & Dog' : '⬜ Tap Hens & Dog'}
        </div>
      </div>

      <div style="font-size:0.81rem;font-weight:800;color:#fde047;margin-bottom:5px;">
        ❓ Historian Calculation: Stubbington lists "9 households". Roughly how many real people lived in 1086 Stubbington?
      </div>
      <button type="button" class="dst-choice-btn ${state.hutQuizAnswer === 'only9' ? 'is-selected-wrong' : ''}" data-hut-quiz="only9">
        🧍 Exactly 9 people living all alone in 9 separate cottages
      </button>
      <button type="button" class="dst-choice-btn ${quizRight ? 'is-correct' : ''}" data-hut-quiz="about45">
        👨‍👩‍👧‍👦 Around 40–50 villagers — scribes only counted tax-paying heads of household!
      </button>
      <button type="button" class="dst-choice-btn ${state.hutQuizAnswer === 'over500' ? 'is-selected-wrong' : ''}" data-hut-quiz="over500">
        🏰 Over 600 people — scribes only counted Norman knights
      </button>

      ${
        state.hutQuizAnswer && !quizRight
          ? `<div style="padding:7px 9px;border-radius:8px;background:rgba(220,38,38,0.22);border:1px solid #ef4444;font-size:0.78rem;color:#fecaca;margin-top:4px;">
               ❌ Multiply ~5 people per cottage × 9 households! Domesday was a royal tax register, not a modern census!
             </div>`
          : ''
      }
      ${
        quizRight && !allClicked
          ? `<div style="padding:7px 9px;border-radius:8px;background:rgba(245,158,11,0.2);border:1px solid #f59e0b;font-size:0.79rem;color:#fef3c7;margin-top:4px;">
               👆 Spot on! Finish tapping the remaining glowing spots inside Hut #3 (${peopleCount}/8 people &amp; ${foundPets ? 'pets ✓' : 'dog/hens'}) to unlock Stage 6!
             </div>`
          : ''
      }
      ${
        stageDone
          ? `<button type="button" class="dst-next-btn" data-complete-next="beat5">
               Stage 6 → Crack Stubbington’s Real 1086 Latin Parchment! <i class="fa-solid fa-scroll"></i>
             </button>`
          : ''
      }
    `;
  }

  function renderBeat4HTML() {
    const foundTotal =
      state.hutPeopleGroups.size -
      1 +
      (state.foundBlindSpots.has('untaxed_pets') ? 1 : 0) +
      (state.bennetSightings.has('stumps') ? 1 : 0);

    return `
      <div class="dst-body">
        <div class="dst-speech-box" id="dst-speech-slot" role="status" aria-live="polite">${renderSpeechInnerHTML()}</div>
        <div class="dst-split">
          <div>
            <div class="dst-diorama-frame" id="dst-fx-stage" data-fx-preset="stubbington_hut">
              <div id="dst-svg-stage-slot" class="dst-svg-stage-host">
                ${renderStubbingtonHutSVG({
                  hutPeopleGroups: state.hutPeopleGroups,
                  foundPets: state.foundBlindSpots.has('untaxed_pets'),
                  bennetFound: state.bennetSightings.has('stumps'),
                })}
              </div>
            </div>
            ${renderSceneFooterBarHTML(
              foundTotal,
              5,
              'Tap Grandma, Edith, 5 kids, hens/dog & tree-stumps (🥕 #3)!',
            )}
            ${renderArchivalEvidenceCardHTML({
              img: '/images/medieval_england/tres_riches_heures_peasant_hearth_f2v.jpg',
              kicker: 'Primary Illumination • Très Riches Heures (Musée Condé MS 65, f. 2v)',
              caption: 'Cutaway medieval cottage showing villagers warming by an open hearth beside woven bee-skeps, pecking hens, and woodcutters clearing timber.',
              alt: 'Très Riches Heures folio 2v cutaway peasant cottage hearth in winter',
            })}
          </div>

          <div class="dst-card-panel" id="dst-b4-right-slot">
            ${renderBeat4RightPanelHTML()}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // STAGE 6 (beat5): PURE SINGLE-SCREEN LATIN CODE-BREAKER (ZERO SCROLL OVERLOAD!)
  // =========================================================================
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
              <span style="font-family:${showEnglish ? 'Inter, sans-serif' : 'Georgia, serif'};font-size:0.86rem;font-weight:${showEnglish ? '800' : '700'};color:${showEnglish ? '#14532d' : '#292524'};line-height:1.34;">
                <span class="dst-lang-chip ${showEnglish ? '' : 'is-latin'}">${showEnglish ? 'ENG' : 'LAT'}</span>${showEnglish ? ch.english : formattedLatin}
              </span>
              <span style="font-size:0.68rem;font-weight:900;color:${isCracked ? '#15803d' : '#9a3412'};white-space:nowrap;">
                ${isCracked ? '✓ Cracked' : `Tap Line ${idx + 1}`}
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
    const curMission = LATIN_CLUE_MISSIONS[state.b5ClueStep] || LATIN_CLUE_MISSIONS[0];
    const curSolved = state.b5SolvedClues.has(curMission.id);
    const all3Cracked = state.b5SolvedClues.size >= 3;

    return `
      ${renderMissionBannerHTML(
        'Use the Medieval Scribe Key below to tap the 3 matching Latin lines on the left!',
        `${state.b5SolvedClues.size} / 3 Cracked`,
        all3Cracked,
      )}

      <div class="dst-scribe-key" aria-label="Medieval Latin Scribe Key">
        <span class="dst-scribe-chip"><strong>ten’</strong> = holds (now)</span>
        <span class="dst-scribe-chip"><strong>tenuit</strong> = held (past)</span>
        <span class="dst-scribe-chip"><strong>vill’i</strong> = villagers</span>
        <span class="dst-scribe-chip"><strong>bord’</strong> = smallholders</span>
        <span class="dst-scribe-chip"><strong>v + iiij</strong> = 5 + 4</span>
        <span class="dst-scribe-chip"><strong>lib’ / sol’</strong> = £ / shillings</span>
        <span class="dst-scribe-chip"><strong>T.R.E.</strong> = in 1066</span>
      </div>

      <div style="display:flex;gap:5px;margin-bottom:8px;">
        ${LATIN_CLUE_MISSIONS.map(
          (m, i) => `
          <button type="button" class="dst-step-pill ${state.b5ClueStep === i ? 'is-active' : ''} ${state.b5SolvedClues.has(m.id) ? 'is-done' : ''}"
                  data-b5-clue="${i}" style="flex:1;min-height:30px;padding:3px 8px;font-size:0.72rem;">
            ${state.b5SolvedClues.has(m.id) ? '✓ ' : ''}Clue #${i + 1}
          </button>
        `,
        ).join('')}
      </div>

      <div style="padding:10px 12px;border-radius:10px;background:#292524;border:1.5px solid ${curSolved ? '#22c55e' : '#f59e0b'};margin-bottom:9px;">
        <div style="font-size:0.7rem;font-weight:900;color:#fde68a;text-transform:uppercase;margin-bottom:3px;">
          ${curMission.badge}
        </div>
        <div style="font-size:0.85rem;font-weight:700;color:#f8fafc;line-height:1.38;">
          ${curMission.prompt}
        </div>
        ${
          state.b5WrongChunkIdx >= 0 && !curSolved
            ? `<div style="margin-top:7px;padding:7px 9px;border-radius:7px;background:rgba(220,38,38,0.22);border:1px solid #ef4444;font-size:0.78rem;color:#fecaca;">
                 ❌ Not Line ${state.b5WrongChunkIdx + 1}! ${curMission.hintWrong}
               </div>`
            : ''
        }
        ${
          curSolved
            ? `<div style="margin-top:7px;padding:7px 9px;border-radius:7px;background:rgba(22,163,74,0.22);border:1px solid #22c55e;font-size:0.79rem;color:#dcfce7;">
                 ✅ ${curMission.solvedNote}
               </div>`
            : ''
        }
      </div>

      <div style="padding:9px 11px;border-radius:10px;background:#141210;border:1px solid #44403c;">
        <div style="font-size:0.68rem;font-weight:900;color:#a8a29e;text-transform:uppercase;margin-bottom:2px;">
          📜 LINE ${state.activeChunkIdx + 1} TRANSLATION • ${activeChunk.decoderTitle}
        </div>
        <div style="font-size:0.81rem;color:#86efac;font-weight:700;margin-bottom:2px;">
          ${activeChunk.english}
        </div>
        <p style="margin:0;font-size:0.77rem;color:#d6d3d1;line-height:1.36;">
          ${activeChunk.decoderNote}
        </p>
      </div>

      ${
        all3Cracked
          ? `<button type="button" class="dst-next-btn" data-complete-next="beat6">
               Final Stage 7 → 3-Stamp Boss &amp; Claim Your Victory Warrant! <i class="fa-solid fa-trophy"></i>
             </button>`
          : ''
      }
    `;
  }

  function renderBeat5HTML() {
    return `
      <div class="dst-body">
        <div class="dst-speech-box" id="dst-speech-slot" role="status" aria-live="polite">${renderSpeechInnerHTML()}</div>
        <div class="dst-split">
          <div class="dst-parchment-box">
            <div class="dst-parchment-header">
              📜 ${data.stubitoneParchment.folioHeader}
            </div>

            <div class="dst-slider-bar">
              <span style="font-size:0.71rem;font-weight:900;color:#78350f;white-space:nowrap;">1086 LATIN</span>
              <input type="range" id="dst-latin-slider" min="0" max="100" value="${state.translationPct}"
                     style="flex:1;min-width:70px;height:26px;accent-color:#b91c1c;cursor:pointer;"
                     aria-label="Optional English Hint Lens" />
              <span id="dst-latin-pct-lbl" style="font-size:0.71rem;font-weight:900;color:#15803d;white-space:nowrap;">PEEK (${state.translationPct}%)</span>
            </div>

            <div class="dst-chunk-grid" id="dst-b5-chunks-slot">
              ${renderBeat5ChunksInnerHTML()}
            </div>
          </div>

          <div class="dst-card-panel" id="dst-b5-decoder-slot">
            ${renderBeat5DecoderInnerHTML()}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // STAGE 7 (beat6): FINAL 3-STAMP BOSS + FIREWALL-SAFE ARCHIVE + GRAND VICTORY!
  // =========================================================================
  function renderBeat6StampsInnerHTML() {
    return STAMP_CHALLENGES.map((sc) => {
      const picked = state.stampAnswers[sc.id];
      const answered = picked !== undefined;
      const right = picked === sc.isReal;
      return `
        <div style="background:#292524;border:1.5px solid ${!answered ? '#44403c' : right ? '#22c55e' : '#f59e0b'};border-radius:11px;padding:11px 12px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
          <div style="font-size:0.83rem;font-weight:700;color:#f8fafc;line-height:1.36;">&ldquo;${sc.claim}&rdquo;</div>
          <div style="display:flex;gap:6px;">
            <button type="button" class="dst-icon-btn ${answered && picked === true ? 'is-active' : ''}" data-stamp-id="${sc.id}" data-stamp-val="true" style="flex:1;font-size:0.73rem;">
              📜 Real 1086
            </button>
            <button type="button" class="dst-icon-btn ${answered && picked === false ? 'is-active' : ''}" data-stamp-id="${sc.id}" data-stamp-val="false" style="flex:1;font-size:0.73rem;">
              🎭 Comedy Cast
            </button>
          </div>
          ${answered ? `<div style="font-size:0.76rem;color:${right ? '#86efac' : '#fde68a'};line-height:1.35;">${right ? '✅ ' : '💡 '}${sc.note}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  function renderBeat6VictoryBannerHTML() {
    const all3Stamped = Object.keys(state.stampAnswers).length >= 3;
    if (!all3Stamped) return '';

    const rank = computeRankFromScore(state.score);
    const unlockedBennet = state.bennetSightings.size >= 3;
    const completedCount = STEPS.filter(
      (s) => s.id !== 'cover' && isStepTrulyComplete(s.id),
    ).length;

    return `
      <div class="dst-victory-card" id="dst-fx-stage" data-fx-preset="victory_confetti">
        <div style="position:relative;z-index:5;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:8px;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="width:58px;height:58px;border-radius:50%;background:radial-gradient(circle,#fde047 0%,#b45309 85%);border:3px solid #fef9c3;display:flex;align-items:center;justify-content:center;font-size:1.85rem;flex-shrink:0;box-shadow:0 6px 18px rgba(245,158,11,0.45);">
                ${rank.icon}
              </div>
              <div>
                <div style="font-size:0.74rem;font-weight:900;color:#86efac;letter-spacing:0.8px;text-transform:uppercase;">
                  🏆 YOU BEAT THE 1086 DOMESDAY GAME! (${completedCount}/7 STAGES MASTERED)
                </div>
                <h3 style="margin:2px 0;font-family:'Playfair Display',Georgia,serif;font-size:1.35rem;color:#fef3c7;">
                  ${rank.title}
                </h3>
                <div style="font-size:0.81rem;color:#d6d3d1;">${rank.sub}</div>
              </div>
            </div>

            <div style="background:#0c0a09;border:2px solid #fde047;border-radius:12px;padding:8px 14px;text-align:center;">
              <div style="font-size:0.66rem;font-weight:900;color:#fde68a;text-transform:uppercase;">FINAL ROYAL SCORE</div>
              <div style="font-size:1.4rem;font-weight:900;color:#fde047;">🪙 ${state.score} pts</div>
            </div>
          </div>

          <div class="dst-ledger-grid" aria-label="Stage-by-Stage Score Carry-Over Breakdown">
            <div class="dst-ledger-cell"><span>1. Solent Towns</span><strong>+${state.ledger.beat0}</strong></div>
            <div class="dst-ledger-cell"><span>2. Fareham &amp; Servi</span><strong>+${state.ledger.beat1}</strong></div>
            <div class="dst-ledger-cell"><span>3. 1066 Wipeout</span><strong>+${state.ledger.beat2}</strong></div>
            <div class="dst-ledger-cell"><span>4. Royal Trial</span><strong>+${state.ledger.beat3}</strong></div>
            <div class="dst-ledger-cell"><span>5. Edith’s Hut</span><strong>+${state.ledger.beat4}</strong></div>
            <div class="dst-ledger-cell"><span>6. Folio 46v Latin</span><strong>+${state.ledger.beat5}</strong></div>
            <div class="dst-ledger-cell"><span>7. Stamps &amp; Archive</span><strong>+${state.ledger.beat6}</strong></div>
            <div class="dst-ledger-cell"><span>🥕 Secret Turnips (${state.bennetSightings.size}/3)</span><strong>+${state.ledger.turnips}</strong></div>
          </div>

          <div style="padding:8px 12px;border-radius:9px;background:rgba(12,10,9,0.65);border:1px solid ${unlockedBennet ? '#22c55e' : '#78350f'};font-size:0.8rem;color:#fde68a;margin-bottom:12px;">
            ${
              unlockedBennet
                ? '🥕 <strong>SECRET BOGGY BENNET TROPHY UNLOCKED!</strong> You spotted Bennet’s wormy turnip in Gosport Marsh, Fareham Creek, AND Stubbington Hut #3!'
                : `🥕 <strong>Secret Turnip Hunt (${state.bennetSightings.size}/3 found):</strong> Spot Bennet in Stage 1 Marsh, Stage 2 Riverbank, and Stage 5 Tree-Stumps for +130 bonus points!`
            }
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <button type="button" class="dst-start-cta" id="dst-btn-print-warrant" style="flex:1 1 220px;">
              🖨️ Print Official 1086 Warrant
            </button>
            <button type="button" class="dst-icon-btn" id="dst-btn-open-archive-modal" style="border-color:#38bdf8;color:#bae6fd;min-height:46px;padding:8px 14px;">
              🔍 Bonus: Inspect Titchfield Hundred Table (${state.archiveBounty1 === 'small40' && state.archiveBounty2 === 'meon' ? '✓ +150 pts' : '+150 pts'})
            </button>
            <button type="button" class="dst-icon-btn" id="dst-btn-print-drama-script" style="border-color:#fbbf24;color:#fef08a;min-height:46px;padding:8px 14px;">
              🎭 Print Class Voice-Acting Script
            </button>
            <button type="button" class="dst-icon-btn" id="dst-btn-hear-debrief" style="min-height:46px;padding:8px 14px;">
              🔊 Replay Historian Summary
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderBeat6HTML() {
    const debrief = data.debriefColumns;
    const stampedCount = Object.keys(state.stampAnswers).length;

    return `
      <div class="dst-body">
        <div class="dst-speech-box" id="dst-speech-slot" role="status" aria-live="polite">${renderSpeechInnerHTML()}</div>

        <div class="dst-card-panel">
          ${renderMissionBannerHTML(
            'Stamp all 3 statements Real 1086 or Comedy Cast to slam the Great Wax Seal and beat the game!',
            `${stampedCount} / 3 Stamped`,
            stampedCount >= 3,
          )}
          <div class="dst-stamp-grid" id="dst-b6-stamps-slot">
            ${renderBeat6StampsInnerHTML()}
          </div>
        </div>

        <div id="dst-b6-victory-slot">
          ${renderBeat6VictoryBannerHTML()}
        </div>

        <details class="dst-archive-drawer">
          <summary>
            <span>📚 Revision Cheat-Sheet: Real 1086 Facts vs. Comedy Cast vs. Blind Spots</span>
            <span style="font-size:0.74rem;color:#fbbf24;">▾</span>
          </summary>
          <div style="font-size:0.73rem;color:#a8a29e;margin-top:6px;">${data.sourceAttribution}</div>
          <div class="dst-debrief-grid">
            <div class="dst-debrief-col" style="border-top:4px solid #22c55e;">
              <div style="font-size:0.79rem;font-weight:900;color:#86efac;margin-bottom:7px;">📜 100% REAL IN THE 1086 BOOK</div>
              <ul style="margin:0;padding-left:17px;font-size:0.8rem;color:#e7e5e4;line-height:1.44;">
                ${debrief.recordedTrue.map((item) => `<li style="margin-bottom:5px;">${item}</li>`).join('')}
              </ul>
            </div>
            <div class="dst-debrief-col" style="border-top:4px solid #f59e0b;">
              <div style="font-size:0.79rem;font-weight:900;color:#fde047;margin-bottom:7px;">🎭 OUR COMEDY COMPOSITES</div>
              <ul style="margin:0;padding-left:17px;font-size:0.8rem;color:#e7e5e4;line-height:1.44;">
                ${debrief.comedyComposites.map((item) => `<li style="margin-bottom:5px;">${item}</li>`).join('')}
              </ul>
            </div>
            <div class="dst-debrief-col" style="border-top:4px solid #38bdf8;">
              <div style="font-size:0.79rem;font-weight:900;color:#7dd3fc;margin-bottom:7px;">🔍 REAL 1086 BLIND SPOTS</div>
              <ul style="margin:0;padding-left:17px;font-size:0.8rem;color:#e7e5e4;line-height:1.44;">
                ${debrief.blindSpots.map((item) => `<li style="margin-bottom:5px;">${item}</li>`).join('')}
              </ul>
            </div>
          </div>
        </details>
      </div>
    `;
  }

  // =========================================================================
  // IN-GAME MODALS: 1) FIREWALL-SAFE ARCHIVE TABLE • 2) YEAR 7 DRAMA BOOTH
  // =========================================================================
  function renderInnerModalHTML() {
    if (!state.activeModal) return '';

    if (state.activeModal === 'archive') {
      const b1Right = state.archiveBounty1 === 'small40';
      const b2Right = state.archiveBounty2 === 'meon';
      return `
        <div class="dst-inner-modal-backdrop" id="dst-inner-modal-bg">
          <div class="dst-inner-modal" role="dialog" aria-modal="true" aria-label="1086 Titchfield Hundred Archive Record">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px;">
              <div>
                <div style="font-size:0.7rem;font-weight:900;color:#7dd3fc;text-transform:uppercase;">BUILT-IN NATIONAL ARCHIVES RECORD (ZERO EXTERNAL POP-UPS)</div>
                <h3 style="margin:2px 0 0;font-size:1.15rem;color:#fef3c7;">🔍 Titchfield Hundred &amp; Stubbington Folio 46v (1086)</h3>
              </div>
              <button type="button" class="dst-icon-btn" data-close-inner-modal="1"><i class="fa-solid fa-xmark"></i> Close</button>
            </div>

            <div style="overflow-x:auto;margin-bottom:12px;border:1px solid #44403c;border-radius:10px;">
              <table style="width:100%;border-collapse:collapse;font-size:0.79rem;text-align:left;">
                <thead>
                  <tr style="background:#292524;color:#fde047;">
                    <th style="padding:7px 10px;">1086 Settlement</th>
                    <th style="padding:7px 10px;">1086 Overlord</th>
                    <th style="padding:7px 10px;">Households</th>
                    <th style="padding:7px 10px;">Archive Note</th>
                  </tr>
                </thead>
                <tbody>
                  ${TITCHFIELD_HUNDRED_TABLE.map(
                    (r) => `
                    <tr style="border-top:1px solid #292524;background:${r.place.startsWith('Stubbington') ? 'rgba(245,158,11,0.14)' : 'transparent'};">
                      <td style="padding:6px 10px;font-weight:800;color:#f8fafc;">${r.place}</td>
                      <td style="padding:6px 10px;color:#d6d3d1;">${r.lord}</td>
                      <td style="padding:6px 10px;font-weight:900;color:#86efac;">${r.households}</td>
                      <td style="padding:6px 10px;color:#cbd5e1;">${r.rank}</td>
                    </tr>
                  `,
                  ).join('')}
                </tbody>
              </table>
            </div>

            <div class="dst-stamp-grid">
              <div style="background:#292524;border:1.5px solid ${b1Right ? '#22c55e' : '#44403c'};border-radius:10px;padding:10px 12px;">
                <div style="font-size:0.8rem;font-weight:800;margin-bottom:7px;">
                  1. Check Stubbington’s row above (9 households). Where did it rank across 1086 England?
                </div>
                <div style="display:flex;gap:6px;">
                  <button type="button" class="dst-icon-btn ${b1Right ? 'is-active' : ''}" data-bounty1="small40" style="flex:1;">🌱 Smallest 40%</button>
                  <button type="button" class="dst-icon-btn ${state.archiveBounty1 === 'large20' ? 'is-armed-warn' : ''}" data-bounty1="large20" style="flex:1;">🏙️ Largest 20%</button>
                </div>
              </div>

              <div style="background:#292524;border:1.5px solid ${b2Right ? '#22c55e' : '#44403c'};border-radius:10px;padding:10px 12px;">
                <div style="font-size:0.8rem;font-weight:800;margin-bottom:7px;">
                  2. Which tiny Solent hamlet at the bottom of the table had ONLY 2 households?
                </div>
                <div style="display:flex;gap:6px;">
                  <button type="button" class="dst-icon-btn ${state.archiveBounty2 === 'funtley' ? 'is-armed-warn' : ''}" data-bounty2="funtley" style="flex:1;">🏘️ Funtley (22)</button>
                  <button type="button" class="dst-icon-btn ${b2Right ? 'is-active' : ''}" data-bounty2="meon" style="flex:1;">🌊 Meon (2)</button>
                </div>
              </div>
            </div>

            ${
              b1Right && b2Right
                ? `<div style="margin-top:10px;padding:10px 12px;border-radius:9px;background:rgba(20,83,45,0.45);border:1.5px solid #22c55e;font-size:0.83rem;font-weight:800;color:#dcfce7;text-align:center;">
                     🏅 +150 BONUS POINTS ADDED TO YOUR ROYAL SCORE!
                   </div>`
                : ''
            }
          </div>
        </div>
      `;
    }

    if (state.activeModal === 'drama') {
      const canRecord =
        typeof navigator !== 'undefined' &&
        Boolean(navigator.mediaDevices?.getUserMedia) &&
        typeof MediaRecorder !== 'undefined';
      return `
        <div class="dst-inner-modal-backdrop" id="dst-inner-modal-bg">
          <div class="dst-inner-modal" role="dialog" aria-modal="true" aria-label="Class Voice-Acting Booth">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
              <div>
                <div style="font-size:0.7rem;font-weight:900;color:#fde047;text-transform:uppercase;">YEAR 7 DRAMA &amp; ORACY STUDIO (STORED LOCALLY ON THIS DEVICE)</div>
                <h3 style="margin:2px 0 0;font-size:1.15rem;color:#fef3c7;">🎙️ Voice-Act the 1086 Cast!</h3>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button type="button" class="dst-icon-btn" id="dst-drama-print-btn" style="border-color:#fbbf24;color:#fef08a;">
                  🖨️ Print Script
                </button>
                <button type="button" class="dst-icon-btn" data-close-inner-modal="1"><i class="fa-solid fa-xmark"></i> Done</button>
              </div>
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;padding:9px 12px;border-radius:10px;background:#292524;border:1.5px solid #78350f;margin-bottom:10px;">
              <div style="font-size:0.81rem;font-weight:800;color:#fef3c7;">
                Active Voice Pack:
                <button type="button" class="dst-step-pill ${audio.voicePack === 'studio' ? 'is-active' : ''}" data-set-vopack="studio" style="margin-left:6px;">🎬 Studio Cast (11 Voices)</button>
                <button type="button" class="dst-step-pill ${audio.voicePack === 'class_cast' ? 'is-active' : ''}" data-set-vopack="class_cast">🎭 Class Cast (${audio.classBlobUrls.size} Recorded)</button>
              </div>
              ${
                audio.classBlobUrls.size > 0
                  ? `<button type="button" class="dst-icon-btn" id="dst-drama-clear-all" style="font-size:0.72rem;border-color:#ef4444;color:#fecaca;">🗑 Clear All</button>`
                  : ''
              }
            </div>

            ${
              !canRecord
                ? `<div style="padding:10px;border-radius:8px;background:rgba(245,158,11,0.18);border:1px solid #f59e0b;font-size:0.8rem;color:#fef3c7;margin-bottom:10px;">
                     💡 Microphone recording isn’t enabled in this browser window, or you can print the 1-page Class Script above for live classroom read-aloud!
                   </div>`
                : ''
            }

            <div>
              ${DRAMA_CAST_SCRIPT.map((item) => {
                const hasCustom = audio.classBlobUrls.has(item.clipId);
                const isRec = recordingClipId === item.clipId;
                return `
                  <div class="dst-drama-row" style="border-color:${isRec ? '#ef4444' : hasCustom ? '#22c55e' : '#44403c'};">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
                      <strong style="font-size:0.83rem;color:#fde047;">${hasCustom ? '✅ ' : '🎭 '}${item.role}</strong>
                      <div style="display:flex;gap:5px;">
                        ${
                          canRecord
                            ? `<button type="button" class="dst-icon-btn ${isRec ? 'is-armed-warn' : ''}" data-rec-clip="${item.clipId}" style="min-height:30px;padding:3px 9px;font-size:0.72rem;">
                                 ${isRec ? '⏹ Stop Mic' : '🔴 Record'}
                               </button>`
                            : ''
                        }
                        <button type="button" class="dst-icon-btn" data-preview-clip="${item.clipId}" style="min-height:30px;padding:3px 9px;font-size:0.72rem;">
                          ▶ Hear
                        </button>
                        ${
                          hasCustom
                            ? `<button type="button" class="dst-icon-btn" data-del-clip="${item.clipId}" style="min-height:30px;padding:3px 8px;font-size:0.72rem;color:#fca5a5;">✕</button>`
                            : ''
                        }
                      </div>
                    </div>
                    <div style="font-size:0.73rem;color:#a8a29e;font-style:italic;margin-bottom:3px;">Tip: ${item.direction}</div>
                    <div style="font-size:0.82rem;color:#f8fafc;line-height:1.35;">&ldquo;${item.line}&rdquo;</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    }
    return '';
  }

  // =========================================================================
  // LIVE IN-PLACE UPDATERS (ZERO DIORAMA/CANVAS TEARDOWN, ZERO SCROLL JUMP!)
  // =========================================================================
  function isHitZoneFound(key) {
    switch (key) {
      case 'cov:bennet':
        return state.coverSecretsFound.has('bennet');
      case 'cov:gull':
        return state.coverSecretsFound.has('gull');
      case 'cov:pigs':
        return state.coverSecretsFound.has('pigs');
      case 'cov:quill':
        return state.coverSecretsFound.has('quill');
      case 'cov:torso':
        return state.coverSecretsFound.has('torso');
      case 'cov:ship':
        return state.coverSecretsFound.has('ship');
      case 'cov:castle':
        return state.coverSecretsFound.has('castle');
      case 'cov:edith':
        return state.coverSecretsFound.has('edith');
      case 'swamp:bennet':
        return state.bennetSightings.has('swamp');
      case 'swamp:gull':
        return state.swampSecretsFound.has('gull');
      case 'swamp:mill':
        return state.swampSecretsFound.has('mill');
      case 'swamp:torch':
        return state.swampSecretsFound.has('torch');
      case 'b1:odo':
        return state.farehamExtrasFound.has('odo');
      case 'b1:relic':
        return state.farehamExtrasFound.has('relic');
      case 'b1:mills':
        return state.foundFarehamAssets.has('mills');
      case 'b1:pigs':
        return state.foundFarehamAssets.has('pigs');
      case 'b1:church_meadow':
        return state.foundFarehamAssets.has('church_meadow');
      case 'b1:chickens':
        return state.farehamExtrasFound.has('chickens');
      case 'b1:bennet':
        return state.bennetSightings.has('creek');
      case 'servi:gyrth':
        return state.serviReflected;
      case 'servi:oxen':
        return state.farehamExtrasFound.has('oxen');
      case 'servi:overseer':
        return state.farehamExtrasFound.has('overseer');
      case 'assize:villager':
        return state.assizeSpotsHeard.has('villager');
      case 'assize:shield':
        return state.assizeSpotsHeard.has('shield');
      case 'assize:clerk':
        return state.assizeSpotsHeard.has('clerk');
      case 'assize:hugh':
        return state.assizeSpotsHeard.has('hugh');
      case 'assize:bishop_monk':
        return state.assizeSpotsHeard.has('bishop_monk');
      case 'b4:edith':
        return state.hutPeopleGroups.has('edith');
      case 'b4:five_kids':
        return state.hutPeopleGroups.has('five_kids');
      case 'b4:grandma':
        return state.hutPeopleGroups.has('grandma');
      case 'b4:pets':
      case 'b4:hens':
        return state.foundBlindSpots.has('untaxed_pets');
      case 'b4:stumps':
        return state.bennetSightings.has('stumps');
      default:
        return false;
    }
  }

  function syncModalSlot() {
    if (!shellEl) return;
    const mSlot = shellEl.querySelector('#dst-slot-modal');
    if (mSlot) mSlot.innerHTML = renderInnerModalHTML();
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

      const covCast = shellEl.querySelector('#dst-cover-cast-slot');
      if (covCast) covCast.innerHTML = renderCoverCastChipsHTML();

      shellEl.querySelectorAll('.dst-hit-zone[data-hz-key], .dst-svg-hit[data-hz-key]').forEach((btn) => {
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
      syncModalSlot();

      const tallyEl = shellEl.querySelector('#dst-scene-secret-tally');
      const svgSlot = shellEl.querySelector('#dst-svg-stage-slot');
      if (state.step === 'beat0') {
        const leftSlot = shellEl.querySelector('#dst-b0-left-slot');
        if (leftSlot) leftSlot.innerHTML = renderBeat0LeftMapAndPillsHTML();
        const verdSlot = shellEl.querySelector('#dst-b0-verdict-slot');
        if (verdSlot) verdSlot.innerHTML = renderBeat0RightHeaderHTML();
        const dosSlot = shellEl.querySelector('#dst-b0-dossier-slot');
        if (dosSlot) dosSlot.innerHTML = renderBeat0DossierCardHTML();
        if (svgSlot) {
          svgSlot.innerHTML = renderGosportSaltMarshSVG({
            swampSecretsFound: state.swampSecretsFound,
            bennetFound: state.bennetSightings.has('swamp'),
          });
        }
        const nextSlot = shellEl.querySelector('#dst-b0-next-slot');
        if (nextSlot) {
          nextSlot.innerHTML =
            state.testedPinIds.size >= 2
              ? `<button type="button" class="dst-next-btn" data-complete-next="beat1">
                   Stage 2 → Ride Up Fareham Creek &amp; Catch Reeve Odo! <i class="fa-solid fa-arrow-right"></i>
                 </button>`
              : `<div style="margin-top:8px;font-size:0.78rem;color:#a8a29e;text-align:center;">
                   👆 Test ${2 - state.testedPinIds.size} more coastal place${2 - state.testedPinIds.size === 1 ? '' : 's'} to unlock Stage 2!
                 </div>`;
        }
        if (tallyEl) {
          const found = state.swampSecretsFound.size + (state.bennetSightings.has('swamp') ? 1 : 0);
          tallyEl.innerHTML = `✨ <strong>Hotspots:</strong> ${found} / 4`;
        }
      } else if (state.step === 'beat1') {
        const subSlot = shellEl.querySelector('#dst-b1-subtabs-slot');
        if (subSlot) subSlot.innerHTML = renderBeat1SubtabsInnerHTML();
        const rSlot = shellEl.querySelector('#dst-b1-right-slot');
        if (rSlot && state.beat1SubMode === 'hunt')
          rSlot.innerHTML = renderBeat1HuntRightPanelHTML();
        const srSlot = shellEl.querySelector('#dst-b1-servi-right-slot');
        if (srSlot && state.beat1SubMode === 'servi')
          srSlot.innerHTML = renderBeat1ServiRightPanelHTML();
        if (svgSlot) {
          svgSlot.innerHTML =
            state.beat1SubMode === 'hunt'
              ? renderFarehamEstateSVG({
                  foundAssets: state.foundFarehamAssets,
                  foundExtras: state.farehamExtrasFound,
                  bennetFound: state.bennetSightings.has('creek'),
                })
              : renderServiPloughSVG({
                  serviReflected: state.serviReflected,
                  oxenFound: state.farehamExtrasFound.has('oxen'),
                  overseerFound: state.farehamExtrasFound.has('overseer'),
                });
        }
        if (tallyEl) {
          if (state.beat1SubMode === 'hunt') {
            const tot =
              state.foundFarehamAssets.size +
              state.farehamExtrasFound.size +
              (state.bennetSightings.has('creek') ? 1 : 0);
            tallyEl.innerHTML = `✨ <strong>Hotspots:</strong> ${tot} / 7`;
          } else {
            const tot =
              1 +
              (state.farehamExtrasFound.has('oxen') ? 1 : 0) +
              (state.farehamExtrasFound.has('overseer') ? 1 : 0);
            tallyEl.innerHTML = `✨ <strong>Hotspots:</strong> ${tot} / 3`;
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
        if (ghostLbl)
          ghostLbl.textContent = state.showModernGhost ? 'Hide Ghost Towns' : 'Unborn Towns';
        const manorSlot = shellEl.querySelector('#dst-b2-manor-slot');
        if (manorSlot) manorSlot.innerHTML = renderBeat2ManorCardInnerHTML();
        const rSlot = shellEl.querySelector('#dst-b2-right-slot');
        if (rSlot) rSlot.innerHTML = renderBeat2MissionsInnerHTML();
      } else if (state.step === 'beat3') {
        const rSlot = shellEl.querySelector('#dst-b3-right-slot');
        if (rSlot) rSlot.innerHTML = renderBeat3RightPanelHTML();
        if (svgSlot) svgSlot.innerHTML = renderRoyalAssizeSVG({ heardSet: state.assizeSpotsHeard });
        if (tallyEl)
          tallyEl.innerHTML = `✨ <strong>Hotspots:</strong> ${state.assizeSpotsHeard.size} / 5`;
      } else if (state.step === 'beat4') {
        const rSlot = shellEl.querySelector('#dst-b4-right-slot');
        if (rSlot) rSlot.innerHTML = renderBeat4RightPanelHTML();
        if (svgSlot) {
          svgSlot.innerHTML = renderStubbingtonHutSVG({
            hutPeopleGroups: state.hutPeopleGroups,
            foundPets: state.foundBlindSpots.has('untaxed_pets'),
            bennetFound: state.bennetSightings.has('stumps'),
          });
        }
        if (tallyEl) {
          const tot =
            state.hutPeopleGroups.size -
            1 +
            (state.foundBlindSpots.has('untaxed_pets') ? 1 : 0) +
            (state.bennetSightings.has('stumps') ? 1 : 0);
          tallyEl.innerHTML = `✨ <strong>Hotspots:</strong> ${tot} / 5`;
        }
      } else if (state.step === 'beat5') {
        const pctLbl = shellEl.querySelector('#dst-latin-pct-lbl');
        if (pctLbl) pctLbl.textContent = `PEEK (${state.translationPct}%)`;
        const chSlot = shellEl.querySelector('#dst-b5-chunks-slot');
        if (chSlot) chSlot.innerHTML = renderBeat5ChunksInnerHTML();
        const decSlot = shellEl.querySelector('#dst-b5-decoder-slot');
        if (decSlot) decSlot.innerHTML = renderBeat5DecoderInnerHTML();
      } else if (state.step === 'beat6') {
        const stSlot = shellEl.querySelector('#dst-b6-stamps-slot');
        if (stSlot) stSlot.innerHTML = renderBeat6StampsInnerHTML();
        const vicSlot = shellEl.querySelector('#dst-b6-victory-slot');
        if (vicSlot) vicSlot.innerHTML = renderBeat6VictoryBannerHTML();
      }
    });
  }

  function ensureShellMounted() {
    if (shellEl && shellEl.isConnected) return;
    stageEl.innerHTML = `
      <div class="dst-shell ${state.isFullscreen ? 'dst-is-fullscreen' : ''} ${state.hintShimmer ? 'dst-hint-shimmer' : ''}">
        <div class="dst-topbar" id="dst-slot-topbar"></div>
        <div id="dst-slot-main"></div>
        <div id="dst-slot-modal"></div>
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
      else if (state.step === 'beat5') stageBody = renderBeat5HTML();
      else stageBody = renderBeat6HTML();

      shellEl.querySelector('#dst-slot-main').innerHTML = stageBody;
      syncModalSlot();

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
    // Stage 3: Smooth X-Ray drag ONLY when dragging empty water or the bottom `⇄` handle — NEVER blocking manor shields!
    const xrayWrap = shellEl.querySelector('#dst-xray-map-wrap');
    if (xrayWrap) {
      let draggingXray = false;
      const updateXrayFromEvent = (e) => {
        const rect = xrayWrap.getBoundingClientRect();
        if (!rect.width) return;
        const pct = Math.max(
          4,
          Math.min(96, Math.round(((e.clientX - rect.left) / rect.width) * 100)),
        );
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
        // Let clicks on manor shields pass cleanly to click delegation with ZERO pointer capture!
        if (e.target.closest('.solent-manor-node')) return;
        draggingXray = true;
        updateXrayFromEvent(e);
      });
      xrayWrap.addEventListener('pointermove', (e) => {
        if (!draggingXray) return;
        updateXrayFromEvent(e);
      });
      window.addEventListener(
        'pointerup',
        () => {
          draggingXray = false;
        },
        { passive: true },
      );
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

    shellEl.querySelector('#dst-latin-slider')?.addEventListener('input', (e) => {
      state.translationPct = Number(e.target.value);
      preserveScrollPosition(() => {
        const pctLbl = shellEl.querySelector('#dst-latin-pct-lbl');
        if (pctLbl) pctLbl.textContent = `PEEK (${state.translationPct}%)`;
        const chSlot = shellEl.querySelector('#dst-b5-chunks-slot');
        if (chSlot) chSlot.innerHTML = renderBeat5ChunksInnerHTML();
      });
    });
  }

  async function toggleMicRecordingForClip(clipId) {
    if (recordingClipId === clipId) {
      cleanupMicRecorder();
      syncModalSlot();
      return;
    }
    cleanupMicRecorder();
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') return;
    try {
      audio.stopVoice();
      activeMicStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunks = [];
      recordingClipId = clipId;
      activeMediaRecorder = new MediaRecorder(activeMicStream);
      activeMediaRecorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) recordedChunks.push(ev.data);
      };
      activeMediaRecorder.onstop = async () => {
        const finishedClip = clipId;
        const blob = new Blob(recordedChunks, {
          type: activeMediaRecorder?.mimeType || 'audio/webm',
        });
        recordedChunks = [];
        if (blob.size > 400) {
          await saveClassVoiceRecording(finishedClip, blob);
          await audio.refreshClassRecordings();
          audio.setVoicePack('class_cast');
        }
        cleanupMicRecorder();
        syncHudOnly();
        syncModalSlot();
      };
      activeMediaRecorder.start();
      syncModalSlot();
    } catch (_) {
      cleanupMicRecorder();
      syncModalSlot();
    }
  }

  function bindDelegatedShellEvents() {
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

    shellEl.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) e.preventDefault();
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

    shellEl.addEventListener('click', async (e) => {
      // Voiceover Replay / Stop pills
      const voActBtn = e.target.closest('[data-vo-act]');
      if (voActBtn) {
        const act = voActBtn.dataset.voAct;
        if (act === 'stop') audio.stopVoice();
        else if (act === 'replay' && state.lastVoClipId) audio.playVoice(state.lastVoClipId);
        syncHudOnly();
        return;
      }

      // Inner Modal Controls (Archive & Drama Booth)
      if (e.target.closest('[data-close-inner-modal]') || e.target.id === 'dst-inner-modal-bg') {
        cleanupMicRecorder();
        state.activeModal = null;
        syncModalSlot();
        syncHudOnly();
        return;
      }

      if (e.target.closest('#dst-btn-open-archive-modal')) {
        state.activeModal = 'archive';
        syncModalSlot();
        return;
      }

      if (e.target.closest('#dst-btn-print-warrant')) {
        openPrintableCommissionerWarrant();
        return;
      }

      if (e.target.closest('#dst-btn-print-drama-script, #dst-drama-print-btn')) {
        openPrintableClassDramaScript();
        return;
      }

      const voPackBtn = e.target.closest('[data-set-vopack]');
      if (voPackBtn) {
        audio.setVoicePack(voPackBtn.dataset.setVopack);
        syncHudOnly();
        syncModalSlot();
        return;
      }

      const recBtn = e.target.closest('[data-rec-clip]');
      if (recBtn) {
        await toggleMicRecordingForClip(recBtn.dataset.recClip);
        return;
      }

      const prevBtn = e.target.closest('[data-preview-clip]');
      if (prevBtn) {
        audio.playVoice(prevBtn.dataset.previewClip);
        return;
      }

      const delBtn = e.target.closest('[data-del-clip]');
      if (delBtn) {
        await deleteClassVoiceRecording(delBtn.dataset.delClip);
        await audio.refreshClassRecordings();
        syncHudOnly();
        syncModalSlot();
        return;
      }

      if (e.target.closest('#dst-drama-clear-all')) {
        await clearAllClassVoiceRecordings();
        await audio.refreshClassRecordings();
        audio.setVoicePack('studio');
        syncHudOnly();
        syncModalSlot();
        return;
      }

      // Stage Navigation
      const gotoBtn = e.target.closest('[data-goto-step]');
      if (gotoBtn && !gotoBtn.disabled) {
        audio.ensureContext();
        goToStep(gotoBtn.dataset.gotoStep);
        return;
      }

      const nextStageBtn = e.target.closest('[data-complete-next]');
      if (nextStageBtn) {
        const target = nextStageBtn.dataset.completeNext;
        awardOnce(`stage_next_${state.step}`, state.step, 50);
        audio.chimeSuccess();
        goToStep(target);
        return;
      }

      if (e.target.closest('[data-action="hint-shimmer"]')) {
        audio.chimeSuccess();
        triggerHintPulse();
        return;
      }

      // Top-Bar Utility Buttons (with 2-tap confirm guards on Reset & Close!)
      const topAct = e.target.closest('[data-dst-action]');
      if (topAct) {
        const act = topAct.dataset.dstAction;
        if (act === 'mute') {
          audio.toggleMute();
          syncHudOnly();
        } else if (act === 'drama') {
          state.activeModal = 'drama';
          syncModalSlot();
        } else if (act === 'reset') {
          if (!state.resetArmed) {
            state.resetArmed = true;
            if (resetArmTimeout) clearTimeout(resetArmTimeout);
            resetArmTimeout = setTimeout(() => {
              state.resetArmed = false;
              syncHudOnly();
            }, 3200);
            syncHudOnly();
          } else {
            resetAuditProgress();
          }
        } else if (act === 'fs') {
          toggleFullscreenMode();
        } else if (act === 'close') {
          if (state.score > 0 && state.step !== 'cover' && !state.closeArmed) {
            state.closeArmed = true;
            if (closeArmTimeout) clearTimeout(closeArmTimeout);
            closeArmTimeout = setTimeout(() => {
              state.closeArmed = false;
              syncHudOnly();
            }, 3200);
            syncHudOnly();
          } else {
            cleanupMicRecorder();
            cleanupFx();
            audio.destroy();
            ctx.onCloseModal?.();
          }
        }
        return;
      }

      // =====================================================================
      // COVER ACTIONS (8 HOTSPOTS + START)
      // =====================================================================
      if (e.target.closest('#dst-btn-start-adventure')) {
        audio.startMusic('marsh_shanty');
        audio.normanHorn();
        goToStep('beat0');
        return;
      }

      const handleCoverSecret = (id, x, y, fxKind, av, speaker, line, clipId, sfxFn) => {
        audio.startMusic('overture');
        sfxFn?.();
        state.coverSecretsFound.add(id);
        awardOnce(`cov_${id}`, 'cover', 15);
        setSpeech(av, speaker, line, clipId);
        syncHudOnly();
        activeFx?.burst(x, y, fxKind);
      };

      if (e.target.closest('#dst-cover-gull')) {
        handleCoverSecret(
          'gull',
          9.5,
          23,
          'seagull',
          'salty',
          'Salty the Solent Seagull • Official Guide',
          'Squawk! Eyes front! I’m Salty the Solent Seagull—your unofficial 1086 tour guide! Tap the glowing gold spots or hit Begin Royal Audit!',
          'cover_salty_intro',
          () => audio.seagullSquawk(),
        );
        return;
      }
      if (e.target.closest('#dst-cover-castle')) {
        handleCoverSecret(
          'castle',
          25,
          45,
          'gold',
          'salty',
          'Salty the Seagull • Portchester Roman Fort',
          'Aha, Portchester’s massive Roman walls! Careful though—in 1086, the giant square stone castle keep hasn’t even been built yet!',
          'cover_salty_castle',
          () => audio.normanHorn(),
        );
        return;
      }
      if (e.target.closest('#dst-cover-ship')) {
        handleCoverSecret(
          'ship',
          39.5,
          50,
          'wheel',
          'salty',
          'Salty the Seagull • Viking Dragon-Ship',
          'Squawk! Spot that Viking dragon-ship sneaking up Fareham Creek? Sea-raiders attacked so often that Saxon kings gave Fareham a special tax discount!',
          'cover_salty_viking',
          () => audio.waterwheelSplash(),
        );
        return;
      }
      if (e.target.closest('#dst-cover-bennet')) {
        handleCoverSecret(
          'bennet',
          23,
          71,
          'mud',
          'bennet',
          'Bennet Luvet • Waist-Deep in Fareham Mud',
          'Oi! Press the big shiny start button already! My toes went numb in this freezing Fareham mud twenty minutes ago, and this seagull is eyeing my turnip!',
          'cover_bennet_poke',
          () => audio.mudSquelch(),
        );
        return;
      }
      if (e.target.closest('#dst-cover-pigs')) {
        handleCoverSecret(
          'pigs',
          61,
          74,
          'gold',
          'odo',
          'Sweating Reeve Odo • Crate of Hogs',
          'Nothing inside this crate, my Lord! Definitely NOT thirteen fat Fareham woodland pigs! Stop poking the lid before they oink!',
          'cover_odo_pigs',
          () => audio.pigOink(),
        );
        return;
      }
      if (e.target.closest('#dst-cover-quill')) {
        handleCoverSecret(
          'quill',
          66,
          27,
          'gold',
          'guy',
          'Sir Guy de Rouen • Royal Goose-Quill',
          'Careful! This royal goose-quill is sharper than a Norman broadsword—one stroke of my Latin ink can tax your entire village!',
          'cover_guy_quill',
          () => audio.boing(),
        );
        return;
      }
      if (e.target.closest('#dst-cover-torso')) {
        handleCoverSecret(
          'torso',
          80,
          52,
          'gold',
          'guy',
          'Sir Guy de Rouen • Norman Heraldic Shields',
          'Count those overlapping kite shields along King William’s gunwale! Every knight aboard demanded an English manor—and our 1086 Domesday Book records every single shilling!',
          'beat3_clerk_demand',
          () => audio.boing(),
        );
        return;
      }
      if (e.target.closest('#dst-cover-edith')) {
        handleCoverSecret(
          'edith',
          88,
          66,
          'gold',
          'edith',
          'Edith of Stubbington • Cottage Doorway',
          'Wait till you reach my Stubbington cottage in Stage 5—that snooty clerk counted my husband and acted like the rest of my family are invisible!',
          'cover_edith_ladle',
          () => audio.chimeSuccess(),
        );
        return;
      }

      // =====================================================================
      // STAGE 1 (beat0): INSTANT 1-CLICK COASTAL REWIND
      // =====================================================================
      const pinEl = e.target.closest('.solent-home-pin, [data-pick-pin]');
      if (pinEl) {
        const pinId = pinEl.dataset.pinId || pinEl.dataset.pickPin;
        state.selectedPinId = pinId;
        state.peekSwampAnyway = false;
        const wasUnder2 = state.testedPinIds.size < 2;
        state.testedPinIds.add(pinId);
        awardOnce(`b0_pin_${pinId}`, 'beat0', 40);

        const pin = data.modernPins.find((p) => p.id === pinId);
        if (pin) {
          if (!pin.existed1086) {
            audio.mudSquelch();
            setSpeech('guy', `1086 Rewind • ${pin.modernName}`, pin.verdict, 'beat0_swamp_splash');
          } else {
            audio.chimeSuccess();
            setSpeech(
              'guy',
              `1086 Rewind • ${pin.modernName}`,
              pin.verdict,
              'beat0_survived_village',
            );
          }
        }
        render();
        if (wasUnder2 && state.testedPinIds.size >= 2) nudgeNextButtonIntoViewIfOffscreen();
        return;
      }

      if (e.target.closest('#dst-btn-peek-swamp')) {
        state.peekSwampAnyway = true;
        audio.mudSquelch();
        setSpeech(
          'bennet',
          'Bennet Luvet • Gosport Marsh',
          'Welcome to 1086 Gosport—bring your wellies!',
          'beat0_bennet_swamp',
        );
        render();
        return;
      }

      if (e.target.closest('#dst-swamp-bennet')) {
        state.bennetSightings.add('swamp');
        awardOnce('turnip_swamp', 'turnips', 45);
        audio.mudSquelch();
        setSpeech(
          'bennet',
          'Bennet Luvet • 🥕 Secret Turnip #1 Found!',
          'Lovely bit of swamp, this! Zero roads, zero shops, pouring sideways rain... stick a ferry here in nine hundred years, maybe it’ll catch on!',
          'beat0_bennet_swamp',
        );
        syncCurrentStagePanelsInPlace();
        activeFx?.burst(56, 55, 'mud');
        return;
      }

      if (e.target.closest('#dst-swamp-gull')) {
        state.swampSecretsFound.add('gull');
        awardOnce('swamp_gull', 'beat0', 15);
        audio.seagullSquawk();
        setSpeech(
          'salty',
          'Salty the Solent Seagull',
          'Squawk! Hands off my perch! In 1086, seagulls outnumber humans on the Gosport shore five hundred to one!',
          'beat0_swamp_gull',
        );
        syncCurrentStagePanelsInPlace();
        activeFx?.burst(83, 18, 'seagull');
        return;
      }

      if (e.target.closest('#dst-swamp-mill')) {
        state.swampSecretsFound.add('mill');
        awardOnce('swamp_mill', 'beat0', 15);
        audio.waterwheelSplash();
        setSpeech(
          'salty',
          'Distant Fareham Watermill',
          'Look up-creek! While Gosport and Portsmouth are empty mudflats, bustling Fareham already has five spinning watermills!',
          'beat0_swamp_mill',
        );
        syncCurrentStagePanelsInPlace();
        activeFx?.burst(20, 38, 'wheel');
        return;
      }

      if (e.target.closest('#dst-swamp-torch')) {
        state.swampSecretsFound.add('torch');
        awardOnce('swamp_torch', 'beat0', 15);
        audio.waxSealSlam();
        setSpeech(
          'bennet',
          '1086 Iron Pitch-Torch',
          'Resin-soaked pine burning in a hand-forged iron ring—zero glass streetlamps out here in 1086, squire!',
          'beat0_swamp_torch',
        );
        syncCurrentStagePanelsInPlace();
        activeFx?.burst(78, 49, 'gold');
        return;
      }

      // =====================================================================
      // STAGE 2 (beat1): FAREHAM HUNT & GYRTH SERVI
      // =====================================================================
      if (e.target.closest('#dst-b1-tab-hunt')) {
        state.beat1SubMode = 'hunt';
        audio.setMode('millwheel_jig');
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
        state.serviReflected = true;
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
        awardOnce(`servi_${s}`, 'beat1', 15);
        if (s === 'oxen') {
          setSpeech(
            'gyrth',
            'Eight-Ox Heavy Plough',
            'Heavy medieval ploughs needed eight strong oxen to slice wet Hampshire clay—worked from dawn till dusk on the Bishop’s home farm.',
            'beat1_servi_oxen',
          );
        } else {
          setSpeech(
            'guy',
            'Norman Bailiff on the Ridge',
            'Bishop Walkelin’s mounted Norman bailiff watched every bushel of grain harvested from Fareham’s fields to fund Winchester Cathedral.',
            'beat1_servi_bailiff',
          );
        }
        syncCurrentStagePanelsInPlace();
        return;
      }

      const serviQuizBtn = e.target.closest('[data-servi-quiz]');
      if (serviQuizBtn) {
        const ans = serviQuizBtn.dataset.serviQuiz;
        state.serviQuizAnswer = ans;
        if (ans === 'mills_servi') {
          awardOnce('b1_servi_quiz', 'beat1', 65);
          audio.chimeSuccess();
          setSpeech(
            'gyrth',
            'Historical Evidence Locked',
            'Thank you for remembering us. Ten enslaved people were recorded in Fareham without names—yet history remembers we stood here.',
            'beat1_gyrth_servi',
          );
          syncCurrentStagePanelsInPlace();
          nudgeNextButtonIntoViewIfOffscreen();
        } else {
          audio.mudSquelch();
          syncCurrentStagePanelsInPlace();
        }
        return;
      }

      const b1Spot = e.target.closest('[data-b1-spot]');
      if (b1Spot) {
        const sp = b1Spot.dataset.b1Spot;
        if (sp === 'odo') {
          state.farehamExtrasFound.add('odo');
          audio.mudSquelch();
          setSpeech(
            'odo',
            'Sweating Reeve Odo',
            'Why am I sweating in pouring rain?! Erm, very thick woollen hood, my Lord! Definitely not hiding taxable assets behind my back!',
            'beat1_odo_sweat',
          );
        } else if (sp === 'relic') {
          state.farehamExtrasFound.add('relic');
          awardOnce('b1_relic', 'beat1', 15);
          audio.relicRattle();
          setSpeech(
            'monk',
            'St Swithin’s Bone Reliquary',
            'Every local jury—the priest, the reeve, and six villagers—had to swear on holy saint relics. Medieval Christians believed lying on sacred bones condemned your soul!',
            'beat1_relic_oath',
          );
        } else if (sp === 'mills') {
          state.foundFarehamAssets.add('mills');
          awardOnce('b1_mills', 'beat1', 55);
          audio.waterwheelSplash();
          setSpeech(
            'odo',
            'Caught! 5 Spinning Watermills!',
            'Aha, cursed splashing! Alright, five spinning watermills worth 41 shillings—and peasants were legally banned from grinding flour at home without paying the Bishop!',
            state.foundFarehamAssets.size >= 3 ? 'beat1_mills_caught' : 'beat1_mills_spot',
          );
          activeFx?.burst(64, 40, 'wheel');
        } else if (sp === 'pigs') {
          state.foundFarehamAssets.add('pigs');
          awardOnce('b1_pigs', 'beat1', 55);
          audio.pigOink();
          setSpeech(
            'odo',
            'Caught! Woodland for 13 Pigs!',
            'Mercy! Thirteen fat hogs rooting for acorns in the Bishop’s oak woods—even a peasant’s pig tax goes straight into King William’s book!',
            state.foundFarehamAssets.size >= 3 ? 'beat1_mills_caught' : 'beat1_pigs_spot',
          );
          activeFx?.burst(89, 50, 'gold');
        } else if (sp === 'church_meadow') {
          state.foundFarehamAssets.add('church_meadow');
          awardOnce('b1_church', 'beat1', 55);
          audio.chimeSuccess();
          setSpeech(
            'guy',
            'Caught! 1 Church, 90 Households & 41 Meadow Acres!',
            'Got him! With 90 households and 41 acres of hay-meadow, Fareham ranks in the largest 20% of towns in 1086 England!',
            state.foundFarehamAssets.size >= 3 ? 'beat1_mills_caught' : 'beat1_church_spot',
          );
          activeFx?.burst(20, 22, 'gold');
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
          state.bennetSightings.add('creek');
          awardOnce('turnip_creek', 'turnips', 45);
          audio.mudSquelch();
          setSpeech(
            'bennet',
            'Bennet Luvet • 🥕 Secret Turnip #2 Found!',
            'Don’t look at me, squire! One wormy turnip, zero oxen, zero land—even the King’s nosy clerks won’t waste good ink on Bennet Luvet!',
            'beat1_bennet_creek',
          );
          activeFx?.burst(8.5, 85, 'mud');
        }
        syncCurrentStagePanelsInPlace();
        if (state.foundFarehamAssets.size >= 3) nudgeNextButtonIntoViewIfOffscreen();
        return;
      }

      // =====================================================================
      // STAGE 3 (beat2): 3-STEP WIPEOUT MAP HUNT
      // =====================================================================
      const b2StepBtn = e.target.closest('[data-b2-step]');
      if (b2StepBtn) {
        state.b2MissionIdx = Number(b2StepBtn.dataset.b2Step);
        state.b2WrongAttempt = '';
        syncCurrentStagePanelsInPlace();
        return;
      }

      const b2M1Btn = e.target.closest('[data-b2-m1]');
      if (b2M1Btn) {
        const choice = b2M1Btn.dataset.b2M1;
        if (choice === 'zero') {
          awardOnce('b2_m1', 'beat2', 70);
          state.b2Solved.add('m1');
          state.b2WrongAttempt = '';
          state.xraySplitPct = Math.max(state.xraySplitPct, 88);
          audio.chimeSuccess();
          setSpeech(
            'hugh',
            'Sheriff Hugh of Port',
            'Godwin’s Stubbington farm? Mine! Wickham? Mine! Fifty-four Hampshire manors? ALL MINE! Best conquest ever!',
            'beat2_hugh_boast',
          );
          syncXraySvgSplitInPlace(state.xraySplitPct);
        } else {
          state.b2WrongAttempt = `m1_${choice}`;
          audio.mudSquelch();
          setSpeech(
            'guy',
            'Check the 1086 Shields!',
            'Drag the golden X-Ray bar all the way to 1086—every red Baron and purple Bishop shield replaced an English lord!',
          );
        }
        syncCurrentStagePanelsInPlace();
        if (state.b2Solved.size >= 3) nudgeNextButtonIntoViewIfOffscreen();
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
            awardOnce('b2_m2', 'beat2', 80);
            audio.chimeSuccess();
            setSpeech(
              'guy',
              'Royal Bullseye • Titchfield (Ticefelle)!',
              'Royal bullseye! Titchfield passed straight from King Edward to King William himself as the royal capital of Titchfield Hundred!',
              'beat2_titchfield_crown',
            );
          } else {
            state.b2WrongAttempt = m ? m.name : mId;
            audio.mudSquelch();
            setSpeech(
              'guy',
              'Keep Hunting on the Map!',
              `${m?.name} went to ${m?.lord1086}—tap the golden Crown shield (👑) on the River Meon!`,
            );
          }
        } else if (m && state.step === 'beat2') {
          setSpeech('guy', `${m.name} (${m.domesdayName})`, m.specialNote);
        }
        syncCurrentStagePanelsInPlace();
        if (state.b2Solved.size >= 3) nudgeNextButtonIntoViewIfOffscreen();
        return;
      }

      const b2M3Btn = e.target.closest('[data-b2-m3]');
      if (b2M3Btn) {
        const choice = b2M3Btn.dataset.b2M3;
        if (choice === 'army') {
          awardOnce('b2_m3', 'beat2', 70);
          state.b2Solved.add('m3');
          state.b2WrongAttempt = '';
          audio.chimeSuccess();
          setSpeech(
            'monk',
            'Brother Aldwin • Crime-Scene Numbers',
            'Those plunging 1067 numbers are the crime-scene footprints of William’s invading army marching toward Winchester!',
            'beat2_crash_solved',
          );
        } else {
          state.b2WrongAttempt = `m3_${choice}`;
          audio.mudSquelch();
          setSpeech(
            'guy',
            'Think About 1066–1067!',
            'William kept English silver coins—what marched across southern England right after the Battle of Hastings?',
          );
        }
        syncCurrentStagePanelsInPlace();
        if (state.b2Solved.size >= 3) nudgeNextButtonIntoViewIfOffscreen();
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

      // =====================================================================
      // STAGE 4 (beat3): ROYAL ASSIZE COURTROOM
      // =====================================================================
      const assizeSpot = e.target.closest('[data-assize-spot]');
      if (assizeSpot) {
        const sp = assizeSpot.dataset.assizeSpot;
        state.assizeSpotsHeard.add(sp);
        awardOnce(`assize_${sp}`, 'beat3', 15);
        if (sp === 'villager') {
          setSpeech(
            'villager',
            'Wulf of Fareham • Sworn Witness',
            'King Edward cut Fareham’s tax from 30 hides to 20 because Viking raiders attacked us from the sea! Now Norman Bishop Walkelin demands £20 when our whole town only makes £16!',
            'beat3_villager_plea',
          );
        } else if (sp === 'shield') {
          audio.normanHorn();
          setSpeech(
            'salty',
            'Salty the Seagull • Coastal Viking Raids',
            'True story! Because Fareham sat wide open to Solent sea-raiders, Saxon kings knocked ten whole hides off its tax bill!',
            'beat3_viking_shield',
          );
        } else if (sp === 'clerk') {
          setSpeech(
            'guy',
            'Sir Guy de Rouen • Exchequer Hawk',
            'Bah! Viking longships haven’t burned Fareham Creek in years! Cancel their soft Saxon discount, and force them to pay every penny of that £20!',
            'beat3_clerk_demand',
          );
        } else if (sp === 'hugh') {
          setSpeech(
            'hugh',
            'Sheriff Hugh of Port • Stacking Silver',
            'Fifty-four Hampshire manors means mountains of silver pennies—don’t go soft on these English villagers now, Commissioner!',
            'beat3_hugh_coins',
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
      if (vikBtn && !state.assizeVerdictRevealed) {
        state.rulingVikings = vikBtn.dataset.pickVikings;
        syncCurrentStagePanelsInPlace();
        return;
      }

      const bishBtn = e.target.closest('[data-pick-bishop]');
      if (bishBtn && !state.assizeVerdictRevealed) {
        state.rulingBishop = bishBtn.dataset.pickBishop;
        syncCurrentStagePanelsInPlace();
        return;
      }

      const gavelBtn = e.target.closest('#dst-btn-slam-gavel');
      if (gavelBtn && !gavelBtn.disabled) {
        state.assizeVerdictRevealed = true;
        const matchedBoth = state.rulingVikings === 'keep20' && state.rulingBishop === 'shame20';
        awardOnce('b3_gavel', 'beat3', matchedBoth ? 120 : 80);
        audio.waxSealSlam();
        setSpeech(
          'guy',
          'Real 1086 Domesday Parchment Verdict',
          'Astonishingly, King William’s real Commissioners KEPT Fareham’s 20-hide Viking discount—and publicly shamed the Bishop in writing: "it pays £20, but it cannot bear it"!',
          'beat3_real_verdict',
        );
        syncCurrentStagePanelsInPlace();
        nudgeNextButtonIntoViewIfOffscreen();
        return;
      }

      // =====================================================================
      // STAGE 5 (beat4): INSIDE EDITH'S STUBBINGTON HUT #3
      // =====================================================================
      const b4Spot = e.target.closest('[data-b4-spot]');
      if (b4Spot) {
        const sp = b4Spot.dataset.b4Spot;
        if (sp === 'edith') {
          state.hutPeopleGroups.add('edith');
          awardOnce('b4_edith', 'beat4', 35);
          setSpeech(
            'edith',
            'Edith of Stubbington • +1 Invisible Wife Found!',
            'Nine households?! Your posh Latin book counted nine husbands in Stubbington and acted like me, Grandma, and five hungry kids don’t exist! What am I, a turnip?!',
            'beat4_edith_door',
          );
          activeFx?.burst(22, 54, 'gold');
        } else if (sp === 'five_kids') {
          state.hutPeopleGroups.add('five_kids');
          awardOnce('b4_kids', 'beat4', 45);
          audio.chimeSuccess();
          setSpeech(
            'edith',
            'Five Stubbington Children • +5 Invisible Kids Found!',
            'Count ’em yourself! One toddler by the pot, two sharing pottage, and two stacking logs! Zero children are listed anywhere in your Domesday Book!',
            'beat4_five_kids',
          );
          activeFx?.burst(52, 56, 'gold');
        } else if (sp === 'grandma') {
          state.hutPeopleGroups.add('grandma');
          awardOnce('b4_grandma', 'beat4', 35);
          audio.chimeSuccess();
          setSpeech(
            'grandma',
            'Grandma Eadgyth • +1 Invisible Elder Found!',
            'I remember Viking sails on the Solent under King Cnut, young clerk—yet because an old grandmother doesn’t pay geld tax, your great book pretends I’m not even here!',
            'beat4_grandma',
          );
          activeFx?.burst(68, 60, 'gold');
        } else if (sp === 'untaxed_pets' || sp === 'rafter_hens') {
          state.foundBlindSpots.add('untaxed_pets');
          awardOnce('b4_pets', 'beat4', 35);
          audio.chickenBawk();
          setSpeech(
            'guy',
            'Untaxed Farm Dog & Rafter Hens',
            'Brother Aldwin exaggerated! Royal scribes ignored farm dogs, cottage hens, and turnip patches because King William couldn’t squeeze silver tax out of them!',
            'beat4_pets',
          );
        } else if (sp === 'stumps_bennet') {
          state.bennetSightings.add('stumps');
          awardOnce('turnip_stumps', 'turnips', 45);
          audio.mudSquelch();
          setSpeech(
            'bennet',
            'Bennet Luvet • 🥕 Secret Turnip #3 Found!',
            'Psst! "Stubitone" literally means Tree-Stump Farm! Still zero oxen, still hugging my wormy turnip, and still worth £0 0s 0d to the King!',
            'beat4_bennet_stump',
          );
          activeFx?.burst(70, 28, 'mud');
        }
        syncCurrentStagePanelsInPlace();
        if (isStepTrulyComplete('beat4')) nudgeNextButtonIntoViewIfOffscreen();
        return;
      }

      const hutQuizBtn = e.target.closest('[data-hut-quiz]');
      if (hutQuizBtn) {
        const ans = hutQuizBtn.dataset.hutQuiz;
        state.hutQuizAnswer = ans;
        if (ans === 'about45') {
          awardOnce('b4_hut_quiz', 'beat4', 70);
          audio.chimeSuccess();
          setSpeech(
            'edith',
            'Edith of Stubbington • Bullseye!',
            'That’s more like it! Nine husbands on the parchment meant around forty-five real villagers living, cooking, and working in Stubbington!',
            'beat4_edith_door',
          );
          syncCurrentStagePanelsInPlace();
          if (isStepTrulyComplete('beat4')) nudgeNextButtonIntoViewIfOffscreen();
        } else {
          audio.mudSquelch();
          syncCurrentStagePanelsInPlace();
        }
        return;
      }

      // =====================================================================
      // STAGE 6 (beat5): STUBITONE FOLIO 46v LATIN CODE-BREAKER
      // =====================================================================
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
            awardOnce(`b5_${curMission.id}`, 'beat5', 65);
            if (state.b5SolvedClues.size >= 3) {
              audio.waxSealSlam();
              setSpeech(
                'salty',
                'Salty the Seagull • Folio 46v Decoded! 🏆',
                'Squawk! Look at the big brains on you—you just cracked genuine 940-year-old Domesday Latin! Hit the green button for the Final Stamp Boss!',
                'beat5_all_cracked',
              );
              syncCurrentStagePanelsInPlace();
              nudgeNextButtonIntoViewIfOffscreen();
            } else {
              audio.chimeSuccess();
              setSpeech('guy', `Line ${idx + 1} Cracked!`, curMission.solvedNote);
              const nextUnsolved = LATIN_CLUE_MISSIONS.findIndex(
                (m) => !state.b5SolvedClues.has(m.id),
              );
              if (nextUnsolved >= 0) state.b5ClueStep = nextUnsolved;
              syncCurrentStagePanelsInPlace();
            }
          } else {
            state.b5WrongChunkIdx = idx;
            audio.mudSquelch();
            setSpeech('guy', `Line ${idx + 1} Inspected — Keep Hunting!`, curMission.hintWrong);
            syncCurrentStagePanelsInPlace();
          }
        } else {
          audio.chimeSuccess();
          syncCurrentStagePanelsInPlace();
        }
        return;
      }

      // =====================================================================
      // STAGE 7 (beat6): FINAL STAMP BOSS, ARCHIVE MODAL & VICTORY WARRANT
      // =====================================================================
      const stampBtn = e.target.closest('[data-stamp-id]');
      if (stampBtn) {
        const sId = stampBtn.dataset.stampId;
        const val = stampBtn.dataset.stampVal === 'true';
        const item = STAMP_CHALLENGES.find((x) => x.id === sId);
        if (!item) return;

        const wasComplete = Object.keys(state.stampAnswers).length >= 3;
        if (val === item.isReal) {
          awardOnce(`stamp_${sId}`, 'beat6', 50);
          audio.waxSealSlam();
        } else {
          audio.mudSquelch();
        }
        state.stampAnswers[sId] = val;

        const nowComplete = Object.keys(state.stampAnswers).length >= 3;
        if (!wasComplete && nowComplete) {
          audio.setMode('victory_jubilee');
          audio.victoryFanfare();
          setSpeech(
            'guy',
            'Royal Audit Complete — You Beat the Game! 🏆',
            'Royal Audit complete—you beat the game! Every village statistic comes straight from the real 1086 Domesday Book, while our village characters give voice to the nameless locals left out!',
            'beat5_debrief_historian',
          );
          render();
          nudgeNextButtonIntoViewIfOffscreen();
        } else {
          syncCurrentStagePanelsInPlace();
        }
        return;
      }

      const bounty1Btn = e.target.closest('[data-bounty1]');
      if (bounty1Btn) {
        const val = bounty1Btn.dataset.bounty1;
        state.archiveBounty1 = val;
        if (val === 'small40') {
          awardOnce('b6_bounty1', 'beat6', 75);
          audio.chimeSuccess();
        } else {
          audio.mudSquelch();
        }
        syncCurrentStagePanelsInPlace();
        return;
      }

      const bounty2Btn = e.target.closest('[data-bounty2]');
      if (bounty2Btn) {
        const val = bounty2Btn.dataset.bounty2;
        state.archiveBounty2 = val;
        if (val === 'meon') {
          awardOnce('b6_bounty2', 'beat6', 75);
          audio.waxSealSlam();
        } else {
          audio.mudSquelch();
        }
        syncCurrentStagePanelsInPlace();
        return;
      }

      if (e.target.closest('#dst-btn-hear-debrief')) {
        setSpeech(
          'guy',
          'Chief Royal Historian • Final Summary',
          'Royal Audit complete—you beat the game! Every village statistic you investigated comes straight from the real 1086 Domesday Book, while characters like Bennet, Edith, and Odo give voice to the nameless locals whom King William’s clerks left out.',
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
    cleanupMicRecorder();
    if (typeof document !== 'undefined') {
      document.removeEventListener('fullscreenchange', onBrowserFsChange);
    }
    if (shimmerTimeout) clearTimeout(shimmerTimeout);
    if (resetArmTimeout) clearTimeout(resetArmTimeout);
    if (closeArmTimeout) clearTimeout(closeArmTimeout);
    cleanupFx();
    audio.destroy();
  };
}
