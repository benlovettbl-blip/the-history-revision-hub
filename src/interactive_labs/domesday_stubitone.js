/**
 * THE SECRET OF STUBITONE™: The 1086 Solent & Fareham Domesday Adventure
 *
 * Nested Interactive Classroom Lab for KS3 Medieval England (Lesson 2: Castles, Terror & Domesday Book)
 * & Revision Arcade Visual Showcase.
 *
 * Features:
 *  - 1990s Steve Purcell / LucasArts ("Secret of Monkey Island") Title Splash Cover
 *  - 60 FPS Living Graphic-Novel FX (flames, embers, rain, mud ripples, spinning waterwheels, flies, blinking seagull)
 *  - Geographically accurate GIS-projected Solent, Fareham Creek, River Meon & Gosport SVG Map
 *  - 19 Pre-baked Gemini 3.8 Flash TTS Character Voiceovers + Procedural 1086 Dorian Lute & Hurdy-Gurdy Score
 *  - 100% Touch-Screen & Full-Screen Classroom Smartboard / iPad / Chromebook / 390px Mobile Native
 *  - Authentic Folio 46v STUBITONE Latin-to-English X-Ray Curtain + 3-Column "Fact vs. Comedy" Debrief
 */

import './domesday_stubitone.css';
import { DomesdayAudioDirector } from './domesday_music.js';
import { mountLivingDioramaFX } from './domesday_living_fx.js';
import { renderSolentGisSvgHTML } from './solent_svg_map.js';

const STEPS = [
  { id: 'cover', short: '🏰 Cover' },
  { id: 'beat0', short: '1. Swamp Rewind' },
  { id: 'beat1', short: '2. Fareham Hunt' },
  { id: 'beat2', short: '3. 1066 Wipeout' },
  { id: 'beat3', short: '4. Royal Trial' },
  { id: 'beat4', short: '5. Myth-Buster' },
  { id: 'beat5', short: '6. Stubitone & Truth' },
];

const RIDDLES_BEAT2 = [
  {
    id: 'r1',
    q: '1. Slide between 1066 and 1086: how many of the 6 local Anglo-Saxon private landowners kept their manors by 1086?',
    opts: ['Half of them (3 out of 6)', 'Zero — every single one was wiped out (0 out of 6)!', 'All 6 kept their land'],
    ans: 1,
    explain: '100% wipeout! Godwin (Stubbington), Coleman (Rowner), Wulfward (Crofton), Portchester’s 3 freemen, and Wickham’s 4 brothers all lost everything.',
  },
  {
    id: 'r2',
    q: '2. Tap the shields on the map: which local manor went straight from King Edward (1066) to King William (1086) as a Royal Estate?',
    opts: ['Titchfield (Ticefelle)', 'Stubbington (Stubitone)', 'Rowner (Ruwanore)'],
    ans: 0,
    explain: 'Titchfield was the royal capital of Titchfield Hundred on the River Meon—held directly by King William himself!',
  },
  {
    id: 'r3',
    q: '3. Look at the value crash right after 1066 in Fareham (£18→£10), Rowner (£3.5→£1.5), and Wickham (£10→£4). What caused it?',
    opts: [
      'Peasants went on holiday to France',
      'Norman soldiers marching through Hampshire trampled crops, burned barns & seized livestock',
      'Watermills hadn’t been invented yet',
    ],
    ans: 1,
    explain: 'Domesday’s middle valuation ("when acquired") acts like crime-scene forensics—proving the economic shock of William’s conquest!',
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

export function mountDomesdayStubitone(stageEl, _pools = {}, ctx = {}) {
  if (!stageEl) return () => {};

  const audio = new DomesdayAudioDirector();
  let activeFx = null;
  let data = null;
  let unmounted = false;

  const state = {
    step: ctx.startAtBeat0 ? 'beat0' : 'cover',
    completedSteps: new Set(),
    isFullscreen: Boolean(ctx.autoFullscreen),
    score: 0,
    xpAwarded: false,

    // Speaker subtitle banner
    speakerName: 'Sir Guy de Rouen • Royal Exchequer Clerk',
    speechText:
      'Tap "BEGIN 1086 ROYAL AUDIT" to ride King William’s Solent circuit—or poke grotty Bennet Luvet in the mud first!',

    // Secret Bennet Luvet cameo tracker (3 sightings -> Bonus Sticker #0!)
    bennetSightings: new Set(),

    // Beat 0: Swamp Rewind
    selectedPinId: 'gosport',
    rewound1086: false,

    // Beat 1: Fareham Asset Hunt + Gyrth Servi View
    beat1SubMode: 'hunt', // 'hunt' | 'servi'
    odoOathHeard: false,
    foundFarehamAssets: new Set(), // 'mills' | 'pigs' | 'church_meadow'
    serviReflected: false,

    // Beat 2: 1066 <-> 1086 X-Ray
    xraySplitPct: 22,
    selectedManorId: 'stubbington',
    showModernGhost: false,
    riddleAnswers: {},

    // Beat 3: Royal Assize Court
    rulingVikings: null, // 'keep20' | 'hike30'
    rulingBishop: null, // 'shame20' | 'force20'
    assizeVerdictRevealed: false,

    // Beat 4: Spyglass & Edith's Hut
    beat4Tab: 'hut', // 'hut' | 'map'
    foundBlindSpots: new Set(), // 'edith_family' | 'untaxed_pets' | 'bs_portchester' | 'bs_gosport' | 'bs_portsmouth' | 'bs_chark'
    spyglassPos: { x: 58, y: 72 },

    // Beat 5: Stubitone Parchment Curtain & Truth Debrief
    translationPct: 0, // 0 = pure 1086 Latin, 100 = full English
    activeChunkIdx: 0,
  };

  function cleanupFx() {
    if (activeFx) {
      activeFx.destroy();
      activeFx = null;
    }
  }

  function setSpeech(speaker, text, voClipId = null) {
    state.speakerName = speaker;
    state.speechText = text;
    if (voClipId) audio.playVoice(voClipId);
  }

  function goToStep(nextStep) {
    cleanupFx();
    state.step = nextStep;
    if (nextStep === 'beat0') {
      audio.setMode('overture');
      setSpeech(
        'Sir Guy de Rouen • Royal Clerk',
        'Drop a pin on the modern Solent town you know best—then pull the 940-Year Rewind Lever to see if your house survives!',
      );
    } else if (nextStep === 'beat1') {
      audio.setMode(state.beat1SubMode === 'servi' ? 'solemn' : 'overture');
      setSpeech(
        'Sweating Reeve Odo • Fareham',
        'I swear on Saint Swithin’s holy bones, my Lord—barely two squeaky little watermills in all of Fareham! Ignore that splashing!',
        'beat1_odo_oath',
      );
    } else if (nextStep === 'beat2') {
      audio.setMode('overture');
      setSpeech(
        'Royal Survey X-Ray • 1066 vs 1086',
        'Drag the golden X-Ray bar across the Solent coast to watch Saxon Hampshire turn Norman—then solve all 3 Forensic Riddles!',
      );
    } else if (nextStep === 'beat3') {
      audio.setMode('assize');
      setSpeech(
        'Winchester Royal Assize • 1086',
        'Tap both witnesses in the torch-lit hall to hear their arguments over Fareham’s Viking tax discount and Bishop Walkelin’s £20 squeeze!',
        'beat3_villager_plea',
      );
    } else if (nextStep === 'beat4') {
      audio.setMode('overture');
      setSpeech(
        'Brother Aldwin • Chronicler',
        'My chronicle claimed "not one ox, cow, or pig was left out"—knock on Stubbington Hut #3 and sweep the Solent Spyglass to bust that myth!',
        'beat4_monk_myth',
      );
    } else if (nextStep === 'beat5') {
      audio.setMode('overture');
      if (!state.xpAwarded) {
        state.xpAwarded = true;
        window.hhAwardXp?.({ amount: 35, source: 'domesday_stubitone', unitId: 'medieval_england' });
      }
      setSpeech(
        'Great Domesday Folio 46v • STVBITONE',
        'Slide the golden Translation Curtain across Stubbington’s real 1086 Latin entry—and check our 3-Column Historical Truth Debrief below!',
        'beat5_stubitone_latin',
      );
    }
    render();
  }

  function toggleFullscreenMode() {
    const shell = stageEl.querySelector('.dst-shell');
    state.isFullscreen = !state.isFullscreen;
    if (state.isFullscreen) {
      if (shell?.requestFullscreen) {
        shell.requestFullscreen().catch(() => {});
      }
    } else if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    render();
  }

  // =========================================================================
  // VIEW RENDERERS FOR EACH STAGE
  // =========================================================================
  function renderTopBarHTML() {
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
                ${isDone && !isAct ? '✅ ' : ''}${s.short}
              </button>
            `;
          }).join('')}
        </div>

        <div class="dst-ctrl-group">
          <span style="font-size:0.76rem;font-weight:900;color:#fde047;background:#292524;border:1px solid #78350f;padding:6px 10px;border-radius:8px;">
            🪙 ${state.score} pts ${state.bennetSightings.size >= 3 ? '• 🥕 BOGGY BENNET UNLOCKED!' : `• 🥕 Cameos ${state.bennetSightings.size}/3`}
          </span>
          <button type="button" class="dst-icon-btn ${!audio.muted ? 'is-active' : ''}" id="dst-btn-mute" title="Toggle Voiceovers & Sound Effects">
            <i class="fa-solid ${audio.muted ? 'fa-volume-xmark' : 'fa-volume-high'}"></i>
            <span>${audio.muted ? 'Muted' : 'Audio On'}</span>
          </button>
          <button type="button" class="dst-icon-btn ${state.isFullscreen ? 'is-active' : ''}" id="dst-btn-fs" title="Toggle Full-Screen Smartboard / Tablet View">
            <i class="fa-solid ${state.isFullscreen ? 'fa-compress' : 'fa-expand'}"></i>
            <span>${state.isFullscreen ? 'Exit Full' : 'Full Screen'}</span>
          </button>
          ${
            typeof ctx.onCloseModal === 'function'
              ? `<button type="button" class="dst-icon-btn" id="dst-btn-close" style="border-color:#ef4444;color:#fecaca;"><i class="fa-solid fa-xmark"></i><span>Close</span></button>`
              : ''
          }
        </div>
      </div>
    `;
  }

  function renderCoverHTML() {
    return `
      <div class="dst-cover-stage" id="dst-fx-stage" data-fx-preset="cover">
        <img src="/images/arcade/domesday/cover_secret_of_stubitone.webp"
             alt="The Secret of Stubitone — 1086 Domesday Adventure Cover"
             class="domesday-diorama-img" />
        <div class="dst-cover-vignette"></div>

        <div class="dst-cover-logo-wrap">
          <div class="dst-lucas-kicker">⚔ KING WILLIAM EXCHEQUER STUDIOS PRESENTS ⚔</div>
          <h2 class="dst-lucas-title">THE SECRET OF STUBITONE™</h2>
          <p class="dst-lucas-sub">A Point-and-Poke 1086 Domesday Adventure Across Fareham, Stubbington &amp; The Solent</p>
        </div>

        <!-- Pre-Game Interactive Easter-Egg Hotspots -->
        <button type="button" class="dst-hotspot is-gag" id="dst-cover-bennet" style="left:24%;top:68%;">
          🥕 Poke Bennet Luvet
        </button>
        <button type="button" class="dst-hotspot" id="dst-cover-gull" style="left:11%;top:21%;">
          🐦 Glaring Seagull
        </button>
        <button type="button" class="dst-hotspot" id="dst-cover-pigs" style="left:60%;top:72%;">
          🐗 Odo's Pig Crate
        </button>

        <div class="dst-cover-bottom">
          <div style="max-width:680px;width:100%;background:rgba(12,10,9,0.86);border:1.5px solid #f59e0b;border-radius:12px;padding:8px 14px;text-align:center;color:#fef3c7;font-size:0.86rem;font-weight:700;">
            💬 <strong>${state.speakerName}:</strong> &ldquo;${state.speechText}&rdquo;
          </div>
          <button type="button" class="dst-start-cta" id="dst-btn-start-adventure">
            ▶ BEGIN 1086 ROYAL AUDIT
          </button>
          <div class="dst-boxart-stamp">
            Filmed in Glorious 60 FPS Grotty-Vision™ • Real 1086 Open Domesday Data • Full-Screen Touch Ready
          </div>
        </div>
      </div>
    `;
  }

  function renderSpeechBannerHTML() {
    return `
      <div class="dst-speech-box">
        <div class="dst-speech-speaker">
          <span>🎙️ ${state.speakerName}</span>
          <span style="font-size:0.68rem;color:#78350f;">Subtitles + Studio Voice</span>
        </div>
        <p class="dst-speech-text">&ldquo;${state.speechText}&rdquo;</p>
      </div>
    `;
  }

  function renderBeat0HTML() {
    const selPin = data.modernPins.find((p) => p.id === state.selectedPinId) || data.modernPins[0];
    const vanished = state.rewound1086 && !selPin.existed1086;

    return `
      <div class="dst-body">
        ${renderSpeechBannerHTML()}
        <div class="dst-split">
          <!-- Left: Accurate GIS Solent Map -->
          <div>
            <div class="dst-map-frame" id="dst-solent-map-wrap">
              ${renderSolentGisSvgHTML({
                data,
                mode: 'swamp',
                rewound1086: state.rewound1086,
                selectedPinId: state.selectedPinId,
                showModernGhost: state.rewound1086,
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

          <!-- Right: Rewind Lever + Bennet's Living Swamp Diorama -->
          <div class="dst-card-panel">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px;">
              <span style="font-size:0.75rem;font-weight:900;color:#fbbf24;text-transform:uppercase;">
                STAGE 1 • WHERE IS MY HOUSE IN 1086?
              </span>
              <span style="font-size:0.75rem;color:#cbd5e1;font-weight:700;">Selected: <strong>${selPin.modernName}</strong></span>
            </div>

            ${
              !state.rewound1086
                ? `
              <p style="margin:0 0 12px 0;font-size:0.94rem;color:#e7e5e4;line-height:1.45;">
                Tap any town pin on the Solent coast (try <strong>Gosport</strong>, <strong>Portsmouth</strong>, or <strong>Stubbington</strong>!), then pull the lever to rewind <strong>940 years</strong> back to King William’s 1086 survey!
              </p>
              <button type="button" class="dst-start-cta" id="dst-btn-rewind" style="width:100%;">
                ⏪ PULL LEVER: REWIND TO 1086!
              </button>
            `
                : `
              <div style="padding:11px 13px;border-radius:11px;margin-bottom:10px;border:2px solid ${vanished ? '#ef4444' : '#22c55e'};background:${vanished ? 'rgba(127,29,29,0.32)' : 'rgba(20,83,45,0.32)'};">
                <div style="font-weight:900;font-size:1.02rem;color:${vanished ? '#fca5a5' : '#86efac'};margin-bottom:4px;">
                  ${selPin.headline}
                </div>
                <p style="margin:0;font-size:0.86rem;line-height:1.42;color:#f5f5f4;">${selPin.verdict}</p>
              </div>

              <!-- Living Bennet Swamp Diorama -->
              <div class="dst-diorama-frame" id="dst-fx-stage" data-fx-preset="swamp" style="margin-bottom:10px;">
                <img src="/images/arcade/domesday/scene_1_bennet_swamp.webp"
                     alt="Bennet Luvet waist-deep in 1086 Solent marsh mud"
                     class="domesday-diorama-img" />
                <button type="button" class="dst-hotspot is-gag" id="dst-swamp-bennet" style="left:55%;top:56%;">
                  🥕 Tap Bennet's Turnip (${state.bennetSightings.has('swamp') ? 'Found!' : 'Cameo 1/3'})
                </button>
                <button type="button" class="dst-hotspot" id="dst-swamp-gull" style="left:82%;top:18%;">
                  🐦 Grumpy Gull
                </button>
                <button type="button" class="dst-hotspot" id="dst-swamp-mill" style="left:19%;top:42%;">
                  ⚙️ Creek Mill
                </button>
              </div>

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

    return `
      <div class="dst-body">
        ${renderSpeechBannerHTML()}

        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
          <button type="button" class="dst-step-pill ${state.beat1SubMode === 'hunt' ? 'is-active' : ''}" id="dst-b1-tab-hunt">
            🔎 Part A: Hunt Fareham's Hidden Wealth (${foundCount}/3 Found)
          </button>
          <button type="button" class="dst-step-pill ${state.beat1SubMode === 'servi' ? 'is-active' : ''} ${state.serviReflected ? 'is-done' : ''}" id="dst-b1-tab-servi">
            ⚖️ Part B: Meet Gyrth — Fareham's 10 Enslaved Workers ${all3Found ? '' : '🔒'}
          </button>
        </div>

        ${
          state.beat1SubMode === 'hunt'
            ? `
          <div class="dst-split">
            <div class="dst-diorama-frame" id="dst-fx-stage" data-fx-preset="fareham_mills">
              <img src="/images/arcade/domesday/scene_2_fareham_mills.webp"
                   alt="1086 Fareham Creek watermills, oak-wood pigs and Reeve Odo"
                   class="domesday-diorama-img" />

              <button type="button" class="dst-hotspot ${state.odoOathHeard ? 'is-found' : ''}" data-b1-spot="relic" style="left:35%;top:60%;">
                🦴 St Swithin's Bone Oath
              </button>
              <button type="button" class="dst-hotspot ${state.foundFarehamAssets.has('mills') ? 'is-found' : ''}" data-b1-spot="mills" style="left:66%;top:43%;">
                ⚙️ ${state.foundFarehamAssets.has('mills') ? '✅ 5 Watermills!' : 'Tap Creek Mills'}
              </button>
              <button type="button" class="dst-hotspot ${state.foundFarehamAssets.has('pigs') ? 'is-found' : ''}" data-b1-spot="pigs" style="left:80%;top:55%;">
                🐗 ${state.foundFarehamAssets.has('pigs') ? '✅ 13 Woodland Pigs!' : 'Poke Shaking Woods'}
              </button>
              <button type="button" class="dst-hotspot ${state.foundFarehamAssets.has('church_meadow') ? 'is-found' : ''}" data-b1-spot="church_meadow" style="left:23%;top:23%;">
                ⛪ ${state.foundFarehamAssets.has('church_meadow') ? '✅ Church & 41 Meadows!' : 'Inspect Hill & Meadow'}
              </button>
              <button type="button" class="dst-hotspot is-gag" data-b1-spot="chickens" style="left:58%;top:86%;">
                🐔 Scrawny Chickens
              </button>
              <button type="button" class="dst-hotspot is-gag" data-b1-spot="bennet" style="left:22%;top:85%;">
                🥕 Muddy Bennet (${state.bennetSightings.has('creek') ? 'Found!' : 'Cameo 2/3'})
              </button>
            </div>

            <div class="dst-card-panel">
              <div style="font-size:0.76rem;font-weight:900;color:#fbbf24;text-transform:uppercase;margin-bottom:8px;">
                ROYAL EXCHEQUER TALLY • FAREHAM (FERHAM, 1086)
              </div>
              <p style="margin:0 0 10px 0;font-size:0.88rem;color:#d6d3d1;line-height:1.4;">
                Sweating Reeve Odo swore on <strong>Saint Swithin’s bones</strong> that Fareham barely had two broken mills. Tap the scene to expose all <strong>3 real money-makers</strong> (watch out for untaxed decoys!):
              </p>

              <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:12px;">
                <div style="padding:9px 12px;border-radius:9px;background:#292524;border:1.5px solid ${state.foundFarehamAssets.has('mills') ? '#22c55e' : '#44403c'};font-size:0.85rem;">
                  ${state.foundFarehamAssets.has('mills') ? '✅ <strong>5 Spinning Watermills (41 shillings):</strong> Peasants were BANNED by law from grinding bread flour at home—forcing everyone to pay Bishop Walkelin’s mills!' : '⬜ Hidden Clue #1: Check the rushing Wallington River...'}
                </div>
                <div style="padding:9px 12px;border-radius:9px;background:#292524;border:1.5px solid ${state.foundFarehamAssets.has('pigs') ? '#22c55e' : '#44403c'};font-size:0.85rem;">
                  ${state.foundFarehamAssets.has('pigs') ? '✅ <strong>Woodland for 13 Fat Pigs:</strong> Peasants paid "pannage" tax in live pigs just to let hogs eat acorns in the Bishop’s oak woods!' : '⬜ Hidden Clue #2: Something is snorting in the oak trees...'}
                </div>
                <div style="padding:9px 12px;border-radius:9px;background:#292524;border:1.5px solid ${state.foundFarehamAssets.has('church_meadow') ? '#22c55e' : '#44403c'};font-size:0.85rem;">
                  ${state.foundFarehamAssets.has('church_meadow') ? '✅ <strong>1 Parish Church, 90 Households & 41 Hay-Meadow Acres:</strong> Making Fareham one of the largest 20% of towns in 1086 England!' : '⬜ Hidden Clue #3: Check the green hill & parish church...'}
                </div>
              </div>

              ${
                all3Found
                  ? `
                <button type="button" class="dst-next-btn" id="dst-btn-open-servi">
                  Wait—Who Worked the Bishop's Ploughs? Meet Gyrth (10 Enslaved People) <i class="fa-solid fa-arrow-right"></i>
                </button>
              `
                  : ''
              }
            </div>
          </div>
        `
            : `
          <!-- RESPECTFUL HISTORICAL CONTRAST: GYRTH (SERVUS) -->
          <div class="dst-split">
            <div class="dst-diorama-frame" id="dst-fx-stage" data-fx-preset="servi_plough" style="border-color:#64748b;">
              <img src="/images/arcade/domesday/scene_5_fareham_servi.webp"
                   alt="Dawn plough-team in 1086 Fareham worked by enslaved ploughmen"
                   class="domesday-diorama-img" />
              <button type="button" class="dst-hotspot ${state.serviReflected ? 'is-found' : ''}" id="dst-btn-hear-gyrth" style="left:55%;top:44%;border-color:#cbd5e1;">
                🎙️ Listen to Gyrth's Testimony
              </button>
            </div>

            <div class="dst-card-panel" style="border-color:#64748b;">
              <div style="font-size:0.75rem;font-weight:900;color:#93c5fd;text-transform:uppercase;margin-bottom:6px;">
                HISTORICAL SHOCK • SLAVERY IN 1086 HAMPSHIRE (SERVI)
              </div>
              <h3 style="margin:0 0 8px 0;font-size:1.12rem;color:#f8fafc;">10 Enslaved People Recorded in Fareham</h3>
              <p style="margin:0 0 10px 0;font-size:0.89rem;color:#e2e8f0;line-height:1.5;">
                Alongside Fareham’s 54 villagers and 26 smallholders, the real 1086 Domesday Book lists <strong>10 <em>servi</em> (enslaved men and women)</strong> in Fareham—plus <strong>4 in Titchfield</strong>, <strong>4 in Portchester</strong>, <strong>5 in Wickham</strong>, and <strong>2 in Rowner</strong> (about 10% of England’s 1086 workforce).
              </p>
              <div style="padding:10px 12px;border-radius:10px;background:#0f172a;border-left:4px solid #38bdf8;font-size:0.85rem;color:#cbd5e1;line-height:1.45;margin-bottom:12px;">
                Unlike ordinary peasants, <em>servi</em> held no land strips of their own. Scribes listed them on the Bishop’s demesne farm right beside the heavy plough-oxen. (Slavery died out in England over the next two generations as Norman lords converted <em>servi</em> into rent-paying serfs.)
              </div>
              <button type="button" class="dst-next-btn" data-complete-next="beat2">
                Continue → Stage 3: The 1066 Conquest Crime-Scene Map <i class="fa-solid fa-arrow-right"></i>
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
    const solvedCount = RIDDLES_BEAT2.filter((r) => state.riddleAnswers[r.id] === r.ans).length;

    return `
      <div class="dst-body">
        ${renderSpeechBannerHTML()}
        <div class="dst-split">
          <!-- Left: Draggable 1066 <-> 1086 X-Ray GIS Map + Selected Manor Crash Bars -->
          <div>
            <div class="dst-map-frame" id="dst-xray-map-wrap">
              ${renderSolentGisSvgHTML({
                data,
                mode: 'xray',
                xraySplitPct: state.xraySplitPct,
                selectedManorId: state.selectedManorId,
                showModernGhost: state.showModernGhost,
              })}
            </div>

            <!-- Touch Slider Fallback + Quick Snap Buttons + Haircut Gag -->
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:8px;">
              <div style="display:flex;align-items:center;gap:6px;flex:1;min-width:220px;">
                <span style="font-size:0.75rem;font-weight:900;color:#86efac;">1066</span>
                <input type="range" id="dst-xray-range" min="0" max="100" value="${state.xraySplitPct}"
                       style="flex:1;height:28px;accent-color:#f59e0b;cursor:pointer;" aria-label="1066 to 1086 X-Ray Curtain" />
                <span style="font-size:0.75rem;font-weight:900;color:#fca5a5;">1086</span>
              </div>
              <button type="button" class="dst-icon-btn" id="dst-btn-ghost-toggle">
                👻 ${state.showModernGhost ? 'Hide Modern Ghost' : 'Modern Towns'}
              </button>
              <button type="button" class="dst-icon-btn" id="dst-btn-haircut-gag" style="border-color:#fb923c;color:#fed7aa;">
                ✂️ Poke Guy's Shaved Neck
              </button>
            </div>

            <!-- Selected Manor 3-Bar Economic Shock Card -->
            <div class="dst-card-panel" style="margin-top:10px;padding:11px 14px;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:6px;">
                <strong style="color:#fde047;font-size:0.95rem;">📍 ${selManor.name} (<em>${selManor.domesdayName}</em> — "${selManor.meaning}")</strong>
                <span style="font-size:0.74rem;color:#a8a29e;">${selManor.households} households • ${selManor.slaves} enslaved</span>
              </div>
              <div style="font-size:0.82rem;color:#e7e5e4;margin-bottom:8px;">
                <span style="color:#86efac;"><strong>1066:</strong> ${selManor.lord1066}</span>
                &nbsp;➔&nbsp;
                <span style="color:#fca5a5;"><strong>1086:</strong> ${selManor.lord1086}</span>
              </div>
              <!-- 3-Point Value Shock Bars -->
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:0.76rem;text-align:center;">
                <div style="background:#14532d;padding:5px;border-radius:6px;">1066 Value: <strong>£${selManor.val1066}</strong></div>
                <div style="background:#7f1d1d;padding:5px;border-radius:6px;">1067 Army Shock: <strong>£${selManor.val1067}</strong></div>
                <div style="background:#78350f;padding:5px;border-radius:6px;">1086 Value: <strong>£${selManor.val1086}</strong></div>
              </div>
            </div>
          </div>

          <!-- Right: 3 Detective Map Riddles -->
          <div class="dst-card-panel">
            <div style="font-size:0.76rem;font-weight:900;color:#fbbf24;text-transform:uppercase;margin-bottom:8px;">
              STAGE 3 • THE 1066 CRIME SCENE (${solvedCount}/3 Solved)
            </div>
            ${RIDDLES_BEAT2.map((r) => {
              const picked = state.riddleAnswers[r.id];
              const isRight = picked === r.ans;
              return `
                <div style="margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid #292524;">
                  <div style="font-size:0.86rem;font-weight:800;color:#f8fafc;margin-bottom:6px;">${r.q}</div>
                  ${r.opts
                    .map((opt, oIdx) => {
                      let cls = '';
                      if (picked !== undefined) {
                        if (oIdx === r.ans) cls = 'is-correct';
                        else if (picked === oIdx) cls = 'is-selected-wrong';
                      }
                      return `
                        <button type="button" class="dst-choice-btn ${cls}" data-riddle-id="${r.id}" data-opt-idx="${oIdx}" style="min-height:42px;padding:7px 11px;font-size:0.82rem;margin-bottom:5px;">
                          <strong>${String.fromCharCode(65 + oIdx)}.</strong> <span>${opt}</span>
                        </button>
                      `;
                    })
                    .join('')}
                  ${
                    isRight
                      ? `<div style="font-size:0.79rem;color:#86efac;margin-top:4px;">✅ ${r.explain}</div>`
                      : ''
                  }
                </div>
              `;
            }).join('')}

            ${
              solvedCount >= 3
                ? `<button type="button" class="dst-next-btn" data-complete-next="beat3">
                     Enter Torch-Lit Courtroom → Stage 4: Vikings vs. Greedy Bishop <i class="fa-solid fa-arrow-right"></i>
                   </button>`
                : `<div style="font-size:0.8rem;color:#a8a29e;text-align:center;">Slide the map curtain &amp; solve all 3 riddles to enter the Royal Assize!</div>`
            }
          </div>
        </div>
      </div>
    `;
  }

  function renderBeat3HTML() {
    const canSlamGavel = Boolean(state.rulingVikings && state.rulingBishop);

    return `
      <div class="dst-body">
        ${renderSpeechBannerHTML()}
        <div class="dst-split">
          <!-- Left: Torch-Lit Assize Courtroom Diorama -->
          <div>
            <div class="dst-diorama-frame" id="dst-fx-stage" data-fx-preset="assize">
              <img src="/images/arcade/domesday/scene_3_royal_assize.webp"
                   alt="1086 Royal Assize Hall in Hampshire"
                   class="domesday-diorama-img" />
              <button type="button" class="dst-hotspot" data-assize-spot="villager" style="left:30%;top:58%;">
                🗣️ Fareham Villager Plea
              </button>
              <button type="button" class="dst-hotspot" data-assize-spot="clerk" style="left:59%;top:55%;">
                🪶 Sir Guy's Demand
              </button>
              <button type="button" class="dst-hotspot" data-assize-spot="shield" style="left:48%;top:22%;">
                🛡️ Viking Raid Shield
              </button>
              <button type="button" class="dst-hotspot" data-assize-spot="hugh" style="left:81%;top:33%;">
                💰 Sheriff Hugh's Silver
              </button>
            </div>
            <div style="margin-top:8px;padding:9px 12px;border-radius:10px;background:#292524;font-size:0.82rem;color:#fde68a;">
              📊 <strong>Fareham’s Real Parchment Evidence:</strong> Worth <strong>£18</strong> (1066) ➔ Crashed to <strong>£10</strong> (Conquest) ➔ Produces <strong>£16</strong> today (1086) — yet Bishop Walkelin demands <strong>£20</strong>!
            </div>
          </div>

          <!-- Right: You Are the Royal Commissioner -->
          <div class="dst-card-panel">
            <div style="font-size:0.76rem;font-weight:900;color:#fbbf24;text-transform:uppercase;margin-bottom:8px;">
              STAGE 4 • CAST YOUR ROYAL COMMISSIONER VERDICT
            </div>

            <div style="margin-bottom:10px;">
              <div style="font-size:0.86rem;font-weight:800;margin-bottom:6px;">
                Ruling 1 — The Viking Tax Break (30 hides taxed at 20 "because it is on the sea"):
              </div>
              <button type="button" class="dst-choice-btn ${state.rulingVikings === 'keep20' ? 'is-correct' : ''}" data-pick-vikings="keep20">
                🛡️ Keep King Edward’s 20-hide coastal Viking discount
              </button>
              <button type="button" class="dst-choice-btn ${state.rulingVikings === 'hike30' ? 'is-correct' : ''}" data-pick-vikings="hike30">
                🪙 Scrap the old Saxon discount—tax all 30 hides!
              </button>
            </div>

            <div style="margin-bottom:10px;">
              <div style="font-size:0.86rem;font-weight:800;margin-bottom:6px;">
                Ruling 2 — Bishop Walkelin’s £20 Rent Squeeze (Town only makes £16):
              </div>
              <button type="button" class="dst-choice-btn ${state.rulingBishop === 'shame20' ? 'is-correct' : ''}" data-pick-bishop="shame20">
                📜 Record the £20—and warn King William in writing that Fareham "cannot bear it"!
              </button>
              <button type="button" class="dst-choice-btn ${state.rulingBishop === 'force20' ? 'is-correct' : ''}" data-pick-bishop="force20">
                🔨 Rubber-stamp Bishop Walkelin’s £20 without complaint
              </button>
            </div>

            ${
              !state.assizeVerdictRevealed
                ? `
              <button type="button" class="dst-start-cta" id="dst-btn-slam-gavel" style="width:100%;opacity:${canSlamGavel ? '1' : '0.45'};" ${canSlamGavel ? '' : 'disabled'}>
                🔨 SLAM GAVEL &amp; REVEAL REAL 1086 PARCHMENT!
              </button>
            `
                : `
              <div style="padding:12px 14px;border-radius:11px;background:rgba(20,83,45,0.35);border:2px solid #22c55e;margin-top:8px;">
                <div style="font-weight:900;color:#86efac;font-size:0.94rem;margin-bottom:4px;">
                  📜 PLOT TWIST — WHAT KING WILLIAM'S REAL 1086 SCRIBES WROTE:
                </div>
                <p style="margin:0;font-size:0.84rem;line-height:1.45;color:#f8fafc;">
                  William’s Commissioners weren’t mindless thugs—they wanted sustainable tax! In the real 1086 Hampshire entry, they <strong>KEPT Fareham’s 20-hide Viking discount</strong> (<em>"King Edward so granted because of the Vikings, since it is on the sea"</em>) AND publicly called out Bishop Walkelin’s greed: <strong><em>"it pays £20, but it cannot bear it"</em></strong>!
                </p>
              </div>
              <button type="button" class="dst-next-btn" data-complete-next="beat4">
                Grab Spyglass → Stage 5: Knock on Stubbington Hut #3 <i class="fa-solid fa-arrow-right"></i>
              </button>
            `
            }
          </div>
        </div>
      </div>
    `;
  }

  function renderBeat4HTML() {
    const spotsCount = state.foundBlindSpots.size;
    const readyNext = spotsCount >= 4;

    return `
      <div class="dst-body">
        ${renderSpeechBannerHTML()}

        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
          <button type="button" class="dst-step-pill ${state.beat4Tab === 'hut' ? 'is-active' : ''}" data-b4-tab="hut">
            🏠 Inside Stubbington Hut #3 (Edith's Door!)
          </button>
          <button type="button" class="dst-step-pill ${state.beat4Tab === 'map' ? 'is-active' : ''}" data-b4-tab="map">
            🔎 Solent Coast Spyglass (Missing Places &amp; Castles!)
          </button>
          <span style="margin-left:auto;font-size:0.8rem;font-weight:900;color:#fde047;align-self:center;">
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
                <button type="button" class="dst-hotspot ${state.foundBlindSpots.has('edith_family') ? 'is-found' : ''}" data-b4-spot="edith_family" style="left:24%;top:50%;">
                  🥄 ${state.foundBlindSpots.has('edith_family') ? '✅ Invisible Family!' : "Tap Edith's Ladle"}
                </button>
                <button type="button" class="dst-hotspot ${state.foundBlindSpots.has('untaxed_pets') ? 'is-found' : ''}" data-b4-spot="untaxed_pets" style="left:45%;top:82%;">
                  🐕 ${state.foundBlindSpots.has('untaxed_pets') ? '✅ Untaxed Animals!' : 'Farm Dog & Hens'}
                </button>
                <button type="button" class="dst-hotspot is-gag" data-b4-spot="stumps_bennet" style="left:81%;top:74%;">
                  🪵 Tree Stumps (${state.bennetSightings.has('stumps') ? 'Cameo 3/3!' : 'Peek Outside'})
                </button>
              </div>
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
            <div style="font-size:0.76rem;font-weight:900;color:#fbbf24;text-transform:uppercase;margin-bottom:8px;">
              STAGE 5 • BUST THE MONK'S "EVERY OX &amp; PIG" MYTH!
            </div>
            <p style="margin:0 0 10px 0;font-size:0.86rem;color:#d6d3d1;line-height:1.4;">
              Uncover at least <strong>4 things Domesday completely ignored</strong> across <strong>Stubbington Hut #3</strong> and the <strong>Solent Spyglass Map</strong>:
            </p>

            <div style="display:flex;flex-direction:column;gap:6px;font-size:0.82rem;">
              <div style="padding:8px 10px;border-radius:8px;background:#292524;border:1px solid ${state.foundBlindSpots.has('edith_family') ? '#22c55e' : '#44403c'};">
                ${state.foundBlindSpots.has('edith_family') ? '✅ <strong>Women, Children & Grandparents (~75–80% of people!):</strong> Stubbington’s "9 households" really meant ~45 villagers—Domesday only counted tax-paying household heads!' : '⬜ Clue 1 (Stubbington Hut): Knock on Edith’s cottage door...'}
              </div>
              <div style="padding:8px 10px;border-radius:8px;background:#292524;border:1px solid ${state.foundBlindSpots.has('untaxed_pets') ? '#22c55e' : '#44403c'};">
                ${state.foundBlindSpots.has('untaxed_pets') ? '✅ <strong>Dogs, Chickens & Cottage Veg Plots:</strong> The Anglo-Saxon Chronicle exaggerated! If William couldn’t tax it, his scribes skipped it.' : '⬜ Clue 2 (Stubbington Hut): Check the cottage floor & rafters...'}
              </div>
              <div style="padding:8px 10px;border-radius:8px;background:#292524;border:1px solid ${state.foundBlindSpots.has('bs_portchester') ? '#22c55e' : '#44403c'};">
                ${state.foundBlindSpots.has('bs_portchester') ? '✅ <strong>Portchester’s Stone Keep Isn’t There Yet:</strong> Domesday only lists "a fishery for the hall" inside Roman walls—Henry I built the stone keep in the 1120s!' : '⬜ Clue 3 (Solent Spyglass Tab): Tap Portchester on the harbour...'}
              </div>
              <div style="padding:8px 10px;border-radius:8px;background:#292524;border:1px solid ${state.foundBlindSpots.has('bs_gosport') || state.foundBlindSpots.has('bs_portsmouth') || state.foundBlindSpots.has('bs_chark') ? '#22c55e' : '#44403c'};">
                ${state.foundBlindSpots.has('bs_gosport') || state.foundBlindSpots.has('bs_portsmouth') || state.foundBlindSpots.has('bs_chark') ? '✅ <strong>Missing Portsmouth, Gosport & Chark:</strong> Portsmouth/Gosport weren’t founded yet, and tiny Chark was swallowed silently inside Titchfield’s tax entry!' : '⬜ Clue 4 (Solent Spyglass Tab): Tap Gosport, Portsmouth, or Chark...'}
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
                     Open Great Domesday Folio 46v → Decode STUBITONE &amp; Final Debrief <i class="fa-solid fa-scroll"></i>
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

            <!-- Finger-Friendly Translation Slider -->
            <div style="display:flex;align-items:center;gap:10px;background:rgba(120,53,15,0.12);padding:8px 12px;border-radius:10px;margin-bottom:12px;">
              <span style="font-size:0.76rem;font-weight:900;color:#78350f;">1086 LATIN</span>
              <input type="range" id="dst-latin-slider" min="0" max="100" value="${state.translationPct}"
                     style="flex:1;height:28px;accent-color:#b91c1c;cursor:pointer;"
                     aria-label="Slide across to translate Stubbington's 1086 Latin entry into English" />
              <span style="font-size:0.76rem;font-weight:900;color:#15803d;">MODERN ENGLISH (${state.translationPct}%)</span>
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
                        <span style="font-family:${showEnglish ? 'Inter, sans-serif' : 'Georgia, serif'};font-size:0.93rem;font-weight:${showEnglish ? '800' : '700'};color:${showEnglish ? '#14532d' : '#292524'};">
                          ${showEnglish ? `🇬🇧 ${ch.english}` : `🏛️ ${formattedLatin}`}
                        </span>
                        <span style="font-size:0.68rem;font-weight:800;color:#9a3412;white-space:nowrap;">Tap Clue</span>
                      </div>
                    </div>
                  `;
                })
                .join('')}
            </div>
          </div>

          <!-- Decoder Inspector + Royal Wax Seal + Secret Bennet Card -->
          <div class="dst-card-panel">
            <div style="font-size:0.74rem;font-weight:900;color:#fbbf24;text-transform:uppercase;margin-bottom:4px;">
              🔎 FOLIO 46v DECODER • LINE ${state.activeChunkIdx + 1} OF ${chunks.length}
            </div>
            <h3 style="margin:0 0 6px 0;font-size:1.08rem;color:#fef08a;">${activeChunk.decoderTitle}</h3>
            <div style="font-family:Georgia,serif;font-size:0.88rem;color:#fca5a5;margin-bottom:4px;">
              <strong>1086 Latin:</strong> <em>${activeChunk.latin}</em>
            </div>
            <div style="font-size:0.88rem;color:#86efac;margin-bottom:8px;">
              <strong>Plain English:</strong> ${activeChunk.english}
            </div>
            <p style="margin:0 0 12px 0;font-size:0.85rem;color:#e7e5e4;line-height:1.45;">
              ${activeChunk.decoderNote}
            </p>

            <!-- Royal Seal & Secret Bennet Luvet Sticker -->
            <div style="padding:12px;border-radius:12px;background:linear-gradient(135deg,#450a0a 0%,#1c1917 100%);border:2px solid #dc2626;display:flex;align-items:center;gap:12px;margin-bottom:10px;">
              <div style="width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#ef4444 0%,#991b1b 75%);border:3px solid #fca5a5;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;box-shadow:0 4px 12px rgba(220,38,38,0.5);">
                👑
              </div>
              <div>
                <div style="font-size:0.72rem;font-weight:900;color:#fca5a5;text-transform:uppercase;">KING WILLIAM'S GREAT WAX SEAL</div>
                <div style="font-size:0.96rem;font-weight:900;color:#ffffff;">Royal Solent Commissioner • ${state.score} Audit Points</div>
                <div style="font-size:0.78rem;color:#fde68a;">
                  ${unlockedBennet ? '🏆 SECRET BONUS STICKER #0 UNLOCKED: Boggy Bennet Luvet (Worth £0 0s 0d & 1 Wormy Turnip)!' : `🥕 Tip: Spot Bennet Luvet in all 3 hiding places (${state.bennetSightings.size}/3 found) for his secret £0 sticker!`}
                </div>
              </div>
            </div>

            <button type="button" class="dst-icon-btn" id="dst-btn-hear-debrief" style="width:100%;border-color:#38bdf8;color:#bae6fd;">
              🔊 Hear Historian Summary: What Was Really Recorded in 1086?
            </button>
          </div>
        </div>

        <!-- PART 2: 3-COLUMN HISTORICAL TRUTH vs. COMEDY COMPOSITES DEBRIEF -->
        <div style="background:#141210;border:2px solid #78350f;border-radius:14px;padding:14px 16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:4px;">
            <h3 style="margin:0;font-size:1.05rem;color:#fde047;">
              📚 Historian’s Final Check: Fact vs. Comedy in 1086 South Hampshire
            </h3>
            <span style="font-size:0.74rem;color:#a8a29e;">${data.sourceAttribution}</span>
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
  // MASTER RENDER & UNIFIED TOUCH / POINTER EVENT BINDING
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
      <div class="dst-shell ${state.isFullscreen ? 'dst-is-fullscreen' : ''}">
        ${renderTopBarHTML()}
        ${stageBody}
      </div>
    `;

    // Mount 60 FPS Living Canvas FX if current stage has a diorama container
    const fxStage = stageEl.querySelector('#dst-fx-stage');
    if (fxStage) {
      activeFx = mountLivingDioramaFX(fxStage, fxStage.dataset.fxPreset || 'cover');
    }

    const activePill = stageEl.querySelector('.dst-step-pill.is-active');
    if (activePill && typeof activePill.scrollIntoView === 'function') {
      activePill.scrollIntoView({ block: 'nearest', inline: 'center' });
    }

    bindEvents();
  }

  function bindEvents() {
    // Top bar navigation & controls
    stageEl.querySelectorAll('[data-goto-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        audio.ensureContext();
        goToStep(btn.dataset.gotoStep);
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

    // COVER EVENTS
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
      activeFx?.burst(24, 68, 'mud');
      setSpeech(
        'Bennet Luvet • Fareham Creek Mud',
        'Oi! Press the big shiny start button already! My toes went numb in this freezing Fareham mud twenty minutes ago, and this seagull is eyeing my turnip!',
        'cover_bennet_poke',
      );
      render();
    });

    stageEl.querySelector('#dst-cover-gull')?.addEventListener('click', () => {
      audio.startMusic('overture');
      audio.seagullSquawk();
      activeFx?.burst(11, 21, 'seagull');
    });

    stageEl.querySelector('#dst-cover-pigs')?.addEventListener('click', () => {
      audio.startMusic('overture');
      audio.pigOink();
      activeFx?.burst(60, 72, 'gold');
    });

    // BEAT 0: SWAMP REWIND EVENTS
    const triggerPinSelect = (pinId) => {
      state.selectedPinId = pinId;
      const pin = data.modernPins.find((p) => p.id === pinId);
      if (state.rewound1086 && pin) {
        if (!pin.existed1086) {
          audio.mudSquelch();
          setSpeech('Sir Guy de Rouen • Royal Clerk', pin.verdict, 'beat0_swamp_splash');
        } else {
          audio.chimeSuccess();
          setSpeech('Sir Guy de Rouen • Royal Clerk', pin.verdict, 'beat0_survived_village');
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

    stageEl.querySelector('#dst-swamp-bennet')?.addEventListener('click', () => {
      state.bennetSightings.add('swamp');
      audio.mudSquelch();
      setSpeech(
        'Bennet Luvet ("Boggy Bennet") • Gosport Salt-Marsh',
        'Lovely bit of swamp, this! Zero roads, zero shops, pouring sideways rain... stick a ferry here in nine hundred years, maybe it’ll catch on!',
        'beat0_bennet_swamp',
      );
      render();
      activeFx?.burst(55, 56, 'mud');
    });

    stageEl.querySelector('#dst-swamp-gull')?.addEventListener('click', () => {
      audio.seagullSquawk();
      activeFx?.burst(82, 18, 'seagull');
    });

    stageEl.querySelector('#dst-swamp-mill')?.addEventListener('click', () => {
      audio.waterwheelSplash();
      activeFx?.burst(19, 42, 'wheel');
    });

    // BEAT 1: FAREHAM ASSET HUNT & GYRTH SERVI
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
        'Gyrth • Enslaved Ploughman in Fareham (1 of 10 Servi)',
        'The Bishop’s scribe wrote all ten of us down on the parchment right beside the plough-oxen. In 1086 Fareham, enslaved workers own no land, and we cannot leave.',
        'beat1_gyrth_servi',
      );
      render();
    };
    stageEl.querySelector('#dst-b1-tab-servi')?.addEventListener('click', openServiView);
    stageEl.querySelector('#dst-btn-open-servi')?.addEventListener('click', openServiView);
    stageEl.querySelector('#dst-btn-hear-gyrth')?.addEventListener('click', () => {
      audio.playVoice('beat1_gyrth_servi');
    });

    stageEl.querySelectorAll('[data-b1-spot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sp = btn.dataset.b1Spot;
        if (sp === 'relic') {
          state.odoOathHeard = true;
          audio.relicRattle();
          setSpeech(
            'Sweating Reeve Odo • Swearing on St Swithin’s Relics',
            'I swear on Saint Swithin’s holy bones, my Lord—barely two squeaky little watermills in all of Fareham! Ignore that loud splashing!',
            'beat1_odo_oath',
          );
        } else if (sp === 'mills') {
          if (!state.foundFarehamAssets.has('mills')) state.score += 60;
          state.foundFarehamAssets.add('mills');
          audio.waterwheelSplash();
          setSpeech(
            'Exchequer Discovery • 5 Watermills Found!',
            'AHA! Fareham has FIVE spinning watermills worth 41 shillings—and peasants are banned by law from grinding flour at home!',
            state.foundFarehamAssets.size >= 3 ? 'beat1_mills_caught' : null,
          );
        } else if (sp === 'pigs') {
          if (!state.foundFarehamAssets.has('pigs')) state.score += 60;
          state.foundFarehamAssets.add('pigs');
          audio.pigOink();
          setSpeech(
            'Exchequer Discovery • Woodland for 13 Pigs!',
            'OINK! Thirteen fat pigs rooting for acorns in the Bishop’s oak woods—every hog render goes into the Domesday ledger!',
            state.foundFarehamAssets.size >= 3 ? 'beat1_mills_caught' : null,
          );
        } else if (sp === 'church_meadow') {
          if (!state.foundFarehamAssets.has('church_meadow')) state.score += 60;
          state.foundFarehamAssets.add('church_meadow');
          audio.chimeSuccess();
          setSpeech(
            'Exchequer Discovery • 1 Church, 90 Households & 41 Meadow Acres!',
            'Caught him! With 90 households and 41 acres of hay-meadow, Fareham is in the top 20% largest settlements in England!',
            state.foundFarehamAssets.size >= 3 ? 'beat1_mills_caught' : null,
          );
        } else if (sp === 'chickens') {
          audio.chickenBawk();
          setSpeech(
            'Sir Guy de Rouen • Royal Clerk',
            'Put that scrawny chicken down at once! King William taxes plough-teams and watermills, not farmyard poultry!',
            'beat1_guy_chicken',
          );
        } else if (sp === 'bennet') {
          state.bennetSightings.add('creek');
          audio.mudSquelch();
          setSpeech(
            'Bennet Luvet • Pointless Peasant Cameo (2/3)',
            'Don’t look at me, squire! One wormy turnip, zero oxen, zero land—even the King’s nosy clerks won’t waste good ink on Bennet Luvet!',
            'beat1_bennet_creek',
          );
        }
        render();
        if (sp === 'mills') activeFx?.burst(66, 43, 'wheel');
        else if (sp === 'bennet') activeFx?.burst(16, 85, 'mud');
      });
    });

    // BEAT 2: TOUCH-DRAGGABLE 1066 <-> 1086 X-RAY CURTAIN
    const xrayWrap = stageEl.querySelector('#dst-xray-map-wrap');
    if (xrayWrap) {
      let draggingXray = false;
      const updateXrayFromEvent = (e) => {
        const rect = xrayWrap.getBoundingClientRect();
        if (!rect.width) return;
        const pct = Math.max(4, Math.min(96, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
        const crossed = state.xraySplitPct < 55 && pct >= 55;
        state.xraySplitPct = pct;
        if (crossed) {
          audio.normanHorn();
          setSpeech(
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
      if (state.xraySplitPct < 55 && pct >= 55) {
        audio.normanHorn();
        audio.playVoice('beat2_hugh_boast');
      }
      state.xraySplitPct = pct;
      render();
    });

    stageEl.querySelectorAll('.solent-manor-node').forEach((g) => {
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        const mId = g.dataset.manorId;
        state.selectedManorId = mId;
        const m = data.manors.find((x) => x.id === mId);
        if (m && state.step === 'beat2') {
          setSpeech(`${m.name} (${m.domesdayName})`, m.specialNote);
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
        'Sir Guy de Rouen • Offended Norman',
        'Hands off the razor-nick! Shaving the back of one’s neck up to the ears is peak 1086 Norman fashion!',
        'beat2_guy_haircut',
      );
      render();
    });

    stageEl.querySelectorAll('[data-riddle-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const rId = btn.dataset.riddleId;
        const idx = Number(btn.dataset.optIdx);
        const riddle = RIDDLES_BEAT2.find((r) => r.id === rId);
        if (!riddle) return;
        if (state.riddleAnswers[rId] !== riddle.ans && idx === riddle.ans) {
          state.score += 75;
          audio.chimeSuccess();
        } else if (idx !== riddle.ans) {
          audio.mudSquelch();
        }
        state.riddleAnswers[rId] = idx;
        render();
      });
    });

    // BEAT 3: ROYAL ASSIZE EVENTS
    stageEl.querySelectorAll('[data-assize-spot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sp = btn.dataset.assizeSpot;
        if (sp === 'villager') {
          setSpeech(
            'Fareham Villager • Sworn Witness',
            'King Edward cut Fareham’s tax from 30 hides to 20 because Viking raiders attacked us from the sea! Now Norman Bishop Walkelin demands £20 when our whole town only makes £16—we will starve!',
            'beat3_villager_plea',
          );
        } else if (sp === 'clerk') {
          setSpeech(
            'Sir Guy de Rouen • Exchequer Hawk',
            'Bah! Viking longships haven’t burned Fareham Creek in years! Cancel their soft Saxon discount, and force them to pay Bishop Walkelin every penny of that £20!',
            'beat3_clerk_demand',
          );
        } else if (sp === 'shield') {
          audio.normanHorn();
          setSpeech(
            'Evidence Exhibit • Coastal Viking Raids',
            'Because Fareham Creek opened straight onto the sea, Viking fleets repeatedly raided Hampshire—so King Edward taxed Fareham on 20 hides instead of 30.',
          );
        } else if (sp === 'hugh') {
          setSpeech(
            'Sheriff Hugh of Port • Hampshire Baron',
            'Careful how you rule, Commissioner—us Norman lords expect juicy rents from our new Hampshire estates!',
            'beat2_hugh_boast',
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
        'Real 1086 Domesday Parchment Verdict',
        'Astonishingly, King William’s real Commissioners KEPT Fareham’s 20-hide Viking discount—and publicly shamed the Bishop in writing: "it pays £20, but it cannot bear it"!',
        'beat3_real_verdict',
      );
      render();
    });

    // BEAT 4: EDITH'S HUT & SPYGLASS MYTH-BUSTER
    stageEl.querySelectorAll('[data-b4-tab]').forEach((b) => {
      b.addEventListener('click', () => {
        state.beat4Tab = b.dataset.b4Tab;
        render();
      });
    });

    stageEl.querySelectorAll('[data-b4-spot]').forEach((b) => {
      b.addEventListener('click', () => {
        const sp = b.dataset.b4Spot;
        if (sp === 'edith_family') {
          if (!state.foundBlindSpots.has('edith_family')) state.score += 75;
          state.foundBlindSpots.add('edith_family');
          setSpeech(
            'Edith of Stubbington • Hut #3',
            'Nine households?! Your posh Latin book counted nine husbands in Stubbington and acted like me, Grandma, and five starving kids don’t exist! What am I, a turnip?!',
            'beat4_edith_door',
          );
        } else if (sp === 'untaxed_pets') {
          if (!state.foundBlindSpots.has('untaxed_pets')) state.score += 60;
          state.foundBlindSpots.add('untaxed_pets');
          audio.chickenBawk();
          setSpeech(
            'Blind Spot Uncovered • Untaxed Everyday Life',
            'Brother Aldwin exaggerated! Scribes ignored farm dogs, hens, beehives in some shires, and personal veg patches because King William couldn’t tax them.',
          );
        } else if (sp === 'stumps_bennet') {
          state.bennetSightings.add('stumps');
          audio.mudSquelch();
          setSpeech(
            'Bennet Luvet • Peeking Behind a Stubbington Tree-Stump (3/3!)',
            'Psst! "Stubitone" literally means Tree-Stump Farm! And since you found me three times—have my secret £0 Boggy Bennet sticker!',
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
            'Portchester (Porcestre) • 1086 Blind Spot',
            'No giant Norman stone castle keep yet! Domesday only records Roman walls and "a fishery for the hall"—the tall stone keep wasn’t built until the 1120s!',
          );
        } else if (id === 'bs_chark') {
          setSpeech(
            'Chark • Swallowed Without a Name',
            'Tiny hamlets like Chark didn’t get their own heading in 1086—their fields were silently bundled inside King William’s royal manor of Titchfield!',
          );
        } else {
          setSpeech(
            'Portsmouth & Gosport • Unborn Towns',
            'Neither Portsmouth nor Gosport existed as a town in 1086—reminding us never to project modern maps backwards onto medieval England!',
          );
        }
        render();
      });
    });

    // BEAT 5: STUBITONE PARCHMENT CURTAIN & TRUTH DEBRIEF
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

    stageEl.querySelector('#dst-btn-hear-debrief')?.addEventListener('click', () => {
      setSpeech(
        'Historian Final Summary • Fact vs. Comedy',
        'Every village figure you just investigated comes straight from the real 1086 Domesday Book—while characters like Bennet, Edith, and Odo give voice to the nameless locals whom King William’s taxmen never named.',
        'beat5_debrief_historian',
      );
      render();
    });
  }

  // Initial Data Load
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
    cleanupFx();
    audio.destroy();
  };
}
