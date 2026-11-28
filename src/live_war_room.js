/**
 * The History Revision Hub — 1066 Live War Room: Win & Hold the Crown
 * Zero-Login, Zero-PII, Zero-Free-Text Live Whole-Class Collaboration Engine
 * Tailored for Year 7 Medieval England Lesson 1 (1066 & Hastings) & Lesson 2 (Castles, Terror & Domesday)
 */

import { getScopedChessEndpoint } from './engine/staff_auth.js';
import { isStaffModeActive } from './data/unit_resources_catalog.js';

const BASE_SYNC_URL =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'https://historyrevisionhub.co.uk/api/chess_sync'
    : '/api/chess_sync';

export const MEDIEVAL_CALLSIGNS = [
  'The Royal Castellan',
  'The Witan Elder',
  'The Saxon Housecarl',
  'The Bayeux Chronicler',
  'The Domesday Scribe',
  'The Shield-Wall Captain',
  'The Papal Envoy',
  'The Norman Archer',
  'The Fyrd Watchman',
  'The Exchequer Clerk',
  'The Shire Reeve',
  'The Tower Mason',
  'The Abbey Illuminator',
  'The Senlac Standard-Bearer',
  'The Stamford Scout',
  'The Feudal Baron',
  'The Manor Reeve',
  'The Portchester Garrison',
  'The Pevensey Pilot',
  'The Westminster Monk',
  'The Reliquary Keeper',
  'The Royal Marshal',
  'The Border Warden',
  'The Longboat Navigator',
];

export const WARROOM_TEAM_PRESETS = {
  realms: [
    { id: 'wessex', name: 'Wessex', full: 'Earldom of Wessex', icon: '🐉', color: '#dc2626', bg: 'rgba(220,38,38,0.16)', border: '#f87171' },
    { id: 'normandy', name: 'Normandy', full: 'Duchy of Normandy', icon: '🦁', color: '#f59e0b', bg: 'rgba(245,158,11,0.16)', border: '#fbbf24' },
    { id: 'mercia', name: 'Mercia', full: 'Earldom of Mercia', icon: '🦅', color: '#3b82f6', bg: 'rgba(59,130,246,0.16)', border: '#60a5fa' },
    { id: 'northumbria', name: 'Northumbria', full: 'Earldom of Northumbria', icon: '🐺', color: '#10b981', bg: 'rgba(16,185,129,0.16)', border: '#34d399' },
  ],
  houses: [
    { id: 'warrior', name: 'Warrior', full: 'Warrior House', icon: '🛡️', color: '#dc2626', bg: 'rgba(220,38,38,0.16)', border: '#f87171' },
    { id: 'invincible', name: 'Invincible', full: 'Invincible House', icon: '⚡', color: '#eab308', bg: 'rgba(234,179,8,0.16)', border: '#facc15' },
    { id: 'dreadnought', name: 'Dreadnought', full: 'Dreadnought House', icon: '⚓', color: '#10b981', bg: 'rgba(16,185,129,0.16)', border: '#34d399' },
    { id: 'victory', name: 'Victory', full: 'Victory House', icon: '👑', color: '#3b82f6', bg: 'rgba(59,130,246,0.16)', border: '#60a5fa' },
  ],
};

export const WARROOM_SCENARIOS = {
  med7_l1: {
    id: 'med7_l1',
    badge: 'YEAR 7 · MEDIEVAL LESSON 1',
    title: '1066: Battle for the English Crown',
    enquiry: 'Why did William of Normandy win the Battle of Hastings in 1066?',
    codeWords: ['SENLAC', 'HASTINGS', 'CROWN', 'WITAN', 'BAYEUX'],
    rounds: [
      {
        date: '5–6 January 1066 · Westminster',
        title: 'Round 1: The Succession Void',
        prompt:
          'King Edward the Confessor dies childless. Which rival seizes the immediate constitutional advantage inside England within 24 hours?',
        options: [
          'Harald Hardrada — backed by 300 Viking longships waiting in Norway',
          'Harold Godwinson — elected on the spot by the Anglo-Saxon Witan & crowned next day',
          'Duke William — armed with a disputed 1051 promise across the Channel',
          'Edgar Ætheling — teenage royal prince with zero battlefield experience',
        ],
        correctIdx: 1,
        revealHeadline: 'Harold Godwinson Crowned Within 24 Hours!',
        revealFact:
          'The Witan needed a proven military commander immediately. Crowning Harold in Westminster Abbey on 6 January gave him the royal treasury and the fyrd — forcing both rivals to risk sea invasions.',
      },
      {
        date: '20–28 September 1066 · Yorkshire & Pevensey',
        title: 'Round 2: The Twin-Invasion Trap',
        prompt:
          'After Harold guards the south coast all summer, Hardrada’s Vikings smash into Yorkshire! What bold gamble does Harold take — and what hidden price does it carry?',
        options: [
          'Stay in Sussex and abandon northern England to Viking rule',
          'Pay Hardrada silver Danegeld to sail peacefully back to Norway',
          'March 185 miles north in 4 days, crush Hardrada at Stamford Bridge, then march 250 miles back south',
          'Split his elite Housecarls evenly between York and Hastings',
        ],
        correctIdx: 2,
        revealHeadline: 'Triumph at Stamford Bridge — Exhaustion Before Hastings!',
        revealFact:
          'Harold stunned Europe by annihilating Hardrada at Stamford Bridge (25 Sept) — only for shifting Channel winds to land William at Pevensey 3 days later, leaving Harold’s Housecarls depleted after 435 miles of marching.',
      },
      {
        date: 'Morning, 14 October 1066 · Senlac Hill',
        title: 'Round 3: The Unbroken Shield Wall',
        prompt:
          'For six brutal hours, Duke William’s archers and uphill cavalry charges bounce off Harold’s army. Why is the Anglo-Saxon position on Senlac Hill so hard to break?',
        options: [
          'Saxon crossbowmen outnumber the Norman army three to one',
          'Overlapping wooden shields along the steep ridge blunt arrows and stall uphill horse charges',
          'A deep stone castle moat surrounds the top of Senlac Hill',
          'Torrential snow freezes the Norman horses in the valley',
        ],
        correctIdx: 1,
        revealHeadline: 'High Ground + Locked Shield Wall Holds Firm!',
        revealFact:
          'Fighting downhill behind an interlocked Shield Wall, Harold’s chainmailed Housecarls swung heavy two-handed battleaxes — brute cavalry force uphill could not punch through.',
      },
      {
        date: 'Afternoon, 14 October 1066 · The Turning Point',
        title: 'Round 4: Breaking the Wall',
        prompt:
          'Rumour spreads that William is dead! After tipping back his helmet to rally his knights, what decisive tactical trick finally shatters the Anglo-Saxon Shield Wall?',
        options: [
          'Digging a secret siege tunnel beneath Senlac ridge',
          'Waiting until midnight to ambush the sleeping Saxon camp',
          'The Feigned Retreat — Norman horsemen pretend to flee, luring fyrd soldiers downhill out of formation',
          'Offering Harold half of England in a battlefield truce',
        ],
        correctIdx: 2,
        revealHeadline: 'The Feigned Retreat Breaks the Shield Wall!',
        revealFact:
          'Twice Norman cavalry staged a Feigned Retreat. Undisciplined fyrd militia chased them down the slope and were surrounded, opening fatal gaps around Harold before Normandy won the English crown!',
      },
    ],
    spectrum: {
      question: 'What mattered MORE in deciding who won in 1066?',
      leftLabel: '⚔️ William’s Skill & Tactics',
      leftSub: 'Papal banner, combined archers & cavalry, Feigned Retreat',
      rightLabel: '🎲 Harold’s Bad Luck & Exhaustion',
      rightSub: 'Twin invasions, shifting Channel winds, 435-mile march',
      evidenceCards: [
        '⚔️ The Feigned Retreat lured defenders off Senlac Hill',
        '⛵ Shifting winds landed William 3 days after Stamford Bridge',
        '🥾 435 miles of forced marching exhausted Harold’s Housecarls',
        '🏹 Combined Norman archers, infantry & mounted knights',
      ],
    },
  },

  med7_l2: {
    id: 'med7_l2',
    badge: 'YEAR 7 · MEDIEVAL LESSON 2',
    title: 'Castles, Terror & Domesday (1066–1086)',
    enquiry: 'How did fewer than 10,000 Normans control two million Anglo-Saxons?',
    codeWords: ['DOMESDAY', 'MOTTE', 'CASTLE', 'NORMAN', 'FEUDAL'],
    rounds: [
      {
        date: '1066–1068 · Across the English Shires',
        title: 'Round 1: The Rapid Fortress Blitz',
        prompt:
          'Fewer than 10,000 Normans face 2 million hostile Anglo-Saxons! Stone castles take years to build. How do William’s Castellans lock down towns in under two weeks?',
        options: [
          'Motte-and-Bailey timber castles — forcing locals to raise a steep earth mound (motte) & fenced courtyard',
          'Stationing a single Norman soldier inside every parish church',
          'Shipping pre-cut marble fortress walls across from Rome',
          'Retreating behind Dover cliffs and leaving the shires alone',
        ],
        correctIdx: 0,
        revealHeadline: '500+ Motte-and-Bailey Castles Spring Up Across England!',
        revealFact:
          'Built in 7–14 days with forced Saxon labour, Motte-and-Bailey fortresses towered over English towns and housed mounted Norman garrisons ready to Ride out and crush trouble within hours.',
      },
      {
        date: 'Winter 1069–1070 · Yorkshire & The North',
        title: 'Round 2: Rebellion in the North',
        prompt:
          'Anglo-Saxon rebels backed by Danish fleets wipe out the Norman garrison at York! What ruthless campaign does William unleash so the North can never rebel again?',
        options: [
          'Abolishing royal taxes across Yorkshire to win rebel loyalty',
          'The Harrying of the North — burning crops, ploughs, livestock & seed grain in mid-winter',
          'Building a timber border wall from Liverpool to Hull',
          'Crowning Edgar Ætheling sub-king of Northumbria',
        ],
        correctIdx: 1,
        revealHeadline: 'Scorched-Earth Terror: The Harrying of the North!',
        revealFact:
          'William’s troops systematically destroyed villages, barns, and animals between York and Durham. Chronicler Orderic Vitalis recorded catastrophic winter famine, and 16 years later Domesday still listed vast tracts as "waste".',
      },
      {
        date: '1070–1086 · Land, Barons & Stone Keeps',
        title: 'Round 3: Replacing the Ruling Class',
        prompt:
          'Timber forts can burn and Saxon earls can plot. How does William permanently replace the Anglo-Saxon elite while securing thousands of loyal knights without paying cash wages?',
        options: [
          'Hiring foreign mercenaries with weekly bags of silver coin',
          'The Feudal System & Stone Keeps — seizing 80%+ of land from Saxon thegns and leasing it to Norman barons for knight service',
          'Holding shire elections so villages choose their own Castellan',
          'Allowing Saxon earls to keep all their manors if they learn French',
        ],
        correctIdx: 1,
        revealHeadline: 'Over 80% of English Land Transferred Under Feudalism!',
        revealFact:
          'Alongside permanent stone fortresses like Portchester Castle and the White Tower, William confiscated Anglo-Saxon manors and tied every baron’s wealth directly to supplying knights for the Crown.',
      },
      {
        date: 'Christmas 1085–1086 · Gloucester to Winchester',
        title: 'Round 4: Counting Every Pig & Plough',
        prompt:
          'Threatened by invasion, William orders royal commissioners into 13,418 settlements to record every manor, ox, mill, and peasant under oath so nobody can dodge tax. What is it called?',
        options: [
          'Magna Carta',
          'The Bayeux Tapestry',
          'The Great Domesday Book Survey',
          'The Constitutions of Clarendon',
        ],
        correctIdx: 2,
        revealHeadline: '1086: The Domesday Book Seals Total Royal Knowledge!',
        revealFact:
          'Anglo-Saxons nicknamed the 1086 survey "Domesday" (Judgement Day) because — just like the Last Judgement — its written verdict on land ownership, feudal duty, and royal tax was final.',
      },
    ],
    spectrum: {
      question: 'How did 10,000 Normans REALLY hold down 2 Million Anglo-Saxons?',
      leftLabel: '🔥 Brutal Terror & Force',
      leftSub: 'Harrying of the North & 500+ Castle Garrisons',
      rightLabel: '📜 Law, Land & Organisation',
      rightSub: 'Feudal Hierarchy & the 1086 Domesday Audit',
      evidenceCards: [
        '🔥 Harrying of the North left Yorkshire "waste" for 16 years',
        '🏰 500+ Motte-and-Bailey & stone castles policed every shire',
        '⛓️ Feudalism transferred 80%+ of land to loyal Norman barons',
        '📖 Domesday Book audited 13,418 settlements for royal tax',
      ],
    },
  },
};

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getOrCreatePupilDeviceId() {
  try {
    let id = localStorage.getItem('hh_warroom_pupil_id');
    if (!id) {
      id = 'wr_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
      localStorage.setItem('hh_warroom_pupil_id', id);
    }
    return id;
  } catch {
    return 'wr_' + Math.random().toString(36).slice(2, 10);
  }
}

function generateRoomCode(scenarioId) {
  const words = WARROOM_SCENARIOS[scenarioId]?.codeWords || ['CROWN', 'SENLAC', 'CASTLE'];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(10 + Math.random() * 89);
  return `${word}-${num}`;
}

async function apiPost(payload) {
  const url = getScopedChessEndpoint(BASE_SYNC_URL);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

async function apiPoll(roomCode) {
  const base = getScopedChessEndpoint(BASE_SYNC_URL);
  const sep = base.includes('?') ? '&' : '?';
  const res = await fetch(
    `${base}${sep}action=warroom_poll&roomCode=${encodeURIComponent(roomCode)}`,
    { cache: 'no-store' },
  );
  return res.json();
}

// Live in-memory UI state
const wrState = {
  role: null, // 'host' | 'pupil' | null
  roomCode: '',
  hostToken: '',
  ctrl: null,
  pupils: [],
  pollTimer: null,
  tickTimer: null,
  // Pupil local state
  pupilId: '',
  selectedCallsign: MEDIEVAL_CALLSIGNS[0],
  selectedFaction: 'wessex',
  joinCodeInput: '',
  joinError: '',
  localSliderVal: 50,
  localSliderTouched: false,
  localEvidenceIdx: 0,
  submitting: false,
};

function stopTimers() {
  if (wrState.pollTimer) {
    clearInterval(wrState.pollTimer);
    wrState.pollTimer = null;
  }
  if (wrState.tickTimer) {
    clearInterval(wrState.tickTimer);
    wrState.tickTimer = null;
  }
}

function getOverlayRoot() {
  let el = document.getElementById('hh-live-warroom-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'hh-live-warroom-overlay';
    document.body.appendChild(el);
  }
  return el;
}

function computeTeamStandings(scenario, teamMode, pupils, upToRoundIdx, includeCurrentReveal) {
  const teams = WARROOM_TEAM_PRESETS[teamMode === 'houses' ? 'houses' : 'realms'];
  const maxRound = includeCurrentReveal ? upToRoundIdx : upToRoundIdx - 1;

  return teams
    .map((t) => {
      const members = pupils.filter((p) => p.faction === t.id);
      let correct = 0;
      let attempted = 0;
      members.forEach((m) => {
        for (let r = 0; r <= maxRound && r < scenario.rounds.length; r++) {
          const ans = m.answers?.[r];
          if (ans !== null && ans !== undefined) {
            attempted++;
            if (ans === scenario.rounds[r].correctIdx) correct++;
          }
        }
      });
      const accuracyPct = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
      // Calm Accuracy-first Team Score: normalized per member + accuracy bonus so uneven table sizes compete fairly!
      const avgCorrectPerMember = members.length > 0 ? correct / members.length : 0;
      const realmScore = Math.round(avgCorrectPerMember * 100 + accuracyPct * 0.5);
      return {
        ...t,
        memberCount: members.length,
        correct,
        attempted,
        accuracyPct,
        realmScore,
      };
    })
    .sort(
      (a, b) =>
        b.realmScore - a.realmScore ||
        b.accuracyPct - a.accuracyPct ||
        (b.memberCount > 0 ? 1 : 0) - (a.memberCount > 0 ? 1 : 0) ||
        b.memberCount - a.memberCount,
    );
}

function computeTopHistorians(scenario, teamMode, pupils) {
  const teamMap = new Map(
    WARROOM_TEAM_PRESETS[teamMode === 'houses' ? 'houses' : 'realms'].map((t) => [t.id, t]),
  );
  return pupils
    .map((p) => {
      let correct = 0;
      let attempted = 0;
      scenario.rounds.forEach((rd, idx) => {
        const a = p.answers?.[idx];
        if (a !== null && a !== undefined) {
          attempted++;
          if (a === rd.correctIdx) correct++;
        }
      });
      const acc = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
      return {
        ...p,
        correct,
        attempted,
        acc,
        pts: correct * 100 + (p.slider1 !== null && p.slider1 !== undefined ? 50 : 0),
        team: teamMap.get(p.faction),
      };
    })
    .sort((a, b) => b.pts - a.pts || b.acc - a.acc);
}

// ============================================================================
// TEACHER BIG-SCREEN PROJECTOR RENDERER
// ============================================================================
function renderHostProjectorHtml() {
  const ctrl = wrState.ctrl;
  if (!ctrl) return '';
  const scenario = WARROOM_SCENARIOS[ctrl.scenarioId] || WARROOM_SCENARIOS.med7_l1;
  const teams = WARROOM_TEAM_PRESETS[ctrl.teamMode === 'houses' ? 'houses' : 'realms'];
  const pupils = wrState.pupils || [];
  const phase = ctrl.phase || 'lobby';
  const rIdx = ctrl.roundIdx || 0;
  const round = scenario.rounds[rIdx] || scenario.rounds[0];

  const elapsedSecs = ctrl.roundStartedAt ? Math.floor((Date.now() - ctrl.roundStartedAt) / 1000) : 0;
  const remainingSecs = Math.max(0, (ctrl.timerSecs || 45) - elapsedSecs);

  const standings = computeTeamStandings(
    scenario,
    ctrl.teamMode,
    pupils,
    rIdx,
    phase === 'reveal' || phase === 'spectrum' || phase === 'revote' || phase === 'podium',
  );

  let bodyHtml = '';

  if (phase === 'lobby') {
    const joinUrl = `${window.location.origin}/?warroom=${ctrl.roomCode}`;
    bodyHtml = `
      <div style="display: grid; grid-template-columns: 1.05fr 1.25fr; gap: 20px; align-items: stretch; flex: 1;">
        <!-- Left: Giant Room Code & Teacher Setup -->
        <div style="background: linear-gradient(145deg, #111827 0%, #0f172a 100%); border: 2px solid #fbbf24; border-radius: 18px; padding: 22px 24px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 18px 40px rgba(0,0,0,0.45);">
          <div>
            <div style="font-size: 0.75rem; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; color: #fbbf24; margin-bottom: 6px;">
              📡 STEP 1 · JOIN ON WINDOWS SCHOOL LAPTOPS
            </div>
            <div style="font-size: 0.95rem; color: #cbd5e1; margin-bottom: 12px; line-height: 1.4;">
              Click <strong>📡 Join Code</strong> at the top of The History Revision Hub and enter:
            </div>
            <div id="warroom-display-code" style="background: #030712; border: 2.5px solid #38bdf8; border-radius: 14px; padding: 16px; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 3.1rem; font-weight: 900; letter-spacing: 0.08em; color: #ffffff; text-shadow: 0 0 24px rgba(56,189,248,0.45); margin-bottom: 12px;">
              ${esc(ctrl.roomCode)}
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
              <button type="button" onclick="window.copyWarRoomClassLink('${esc(joinUrl)}')" style="flex: 1; background: rgba(56,189,248,0.14); color: #7dd3fc; border: 1px solid #0284c7; border-radius: 9px; padding: 9px 12px; font-size: 0.8rem; font-weight: 800; cursor: pointer;">
                📋 Copy 1-Click Teams / Classroom Link
              </button>
            </div>

            <!-- Lesson Scenario & Team Preset Switchers -->
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px; display: flex; flex-direction: column; gap: 10px;">
              <div>
                <div style="font-size: 0.68rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px;">Choose Year 7 Lesson Mission:</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                  <button type="button" onclick="window.hostSetWarRoomConfig({ scenarioId: 'med7_l1' })" style="background: ${ctrl.scenarioId === 'med7_l1' ? '#fbbf24' : '#1e293b'}; color: ${ctrl.scenarioId === 'med7_l1' ? '#0f172a' : '#cbd5e1'}; border: 1px solid ${ctrl.scenarioId === 'med7_l1' ? '#fbbf24' : '#334155'}; border-radius: 8px; padding: 8px 10px; font-size: 0.78rem; font-weight: 900; cursor: pointer;">
                    ⚔️ Lesson 1: 1066 &amp; Hastings
                  </button>
                  <button type="button" onclick="window.hostSetWarRoomConfig({ scenarioId: 'med7_l2' })" style="background: ${ctrl.scenarioId === 'med7_l2' ? '#fbbf24' : '#1e293b'}; color: ${ctrl.scenarioId === 'med7_l2' ? '#0f172a' : '#cbd5e1'}; border: 1px solid ${ctrl.scenarioId === 'med7_l2' ? '#fbbf24' : '#334155'}; border-radius: 8px; padding: 8px 10px; font-size: 0.78rem; font-weight: 900; cursor: pointer;">
                    🏰 Lesson 2: Castles &amp; Domesday
                  </button>
                </div>
              </div>

              <div>
                <div style="font-size: 0.68rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px;">Team Structure (Auto History Groups vs Houses):</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                  <button type="button" onclick="window.hostSetWarRoomConfig({ teamMode: 'realms' })" style="background: ${ctrl.teamMode !== 'houses' ? '#0284c7' : '#1e293b'}; color: #ffffff; border: 1px solid ${ctrl.teamMode !== 'houses' ? '#38bdf8' : '#334155'}; border-radius: 8px; padding: 7px 10px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
                    🛡️ 4 Medieval Realms (Auto)
                  </button>
                  <button type="button" onclick="window.hostSetWarRoomConfig({ teamMode: 'houses' })" style="background: ${ctrl.teamMode === 'houses' ? '#0284c7' : '#1e293b'}; color: #ffffff; border: 1px solid ${ctrl.teamMode === 'houses' ? '#38bdf8' : '#334155'}; border-radius: 8px; padding: 7px 10px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
                    ⚓ 4 School Houses
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button id="btn-warroom-start-r1" type="button" onclick="window.hostAdvanceWarRoom('round', 0)" style="margin-top: 16px; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: #ffffff; border: 2px solid #4ade80; border-radius: 12px; padding: 14px 20px; font-size: 1.1rem; font-weight: 900; cursor: pointer; box-shadow: 0 8px 24px rgba(22,163,74,0.4);">
            ⚔️ Launch Round 1 (${pupils.length} ${pupils.length === 1 ? 'Historian' : 'Historians'} Ready) →
          </button>
        </div>

        <!-- Right: 4 Medieval Realms Live Roster Muster -->
        <div style="background: rgba(15,23,42,0.82); border: 1.5px solid #334155; border-radius: 18px; padding: 20px; display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; color: #ffffff;">
              🛡️ Realm Muster Roll (${pupils.length} Joined · Zero Personal Data)
            </h3>
            <span style="background: rgba(16,185,129,0.16); color: #6ee7b7; border: 1px solid rgba(110,231,183,0.35); border-radius: 999px; padding: 3px 10px; font-size: 0.72rem; font-weight: 800;">
              🔒 100% Callsign-Safe
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; flex: 1;">
            ${teams
              .map((t) => {
                const members = pupils.filter((p) => p.faction === t.id);
                return `
                <div style="background: ${t.bg}; border: 1.5px solid ${t.border}; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 8px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.95rem; font-weight: 900; color: #ffffff;">${t.icon} ${esc(t.full)}</span>
                    <span style="background: rgba(0,0,0,0.35); color: #f8fafc; font-family: monospace; font-size: 0.8rem; font-weight: 900; padding: 2px 8px; border-radius: 999px;">${members.length}</span>
                  </div>
                  <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                    ${
                      members.length > 0
                        ? members
                            .map(
                              (m) =>
                                `<span style="background: rgba(15,23,42,0.85); color: #f8fafc; border: 1px solid rgba(255,255,255,0.18); border-radius: 6px; padding: 3px 8px; font-size: 0.73rem; font-weight: 700;">${esc(m.callsign)}</span>`,
                            )
                            .join('')
                        : `<span style="font-size: 0.75rem; color: #94a3b8; font-style: italic;">Awaiting recruits…</span>`
                    }
                  </div>
                </div>
              `;
              })
              .join('')}
          </div>
        </div>
      </div>
    `;
  } else if (phase === 'round' || phase === 'reveal') {
    const isReveal = phase === 'reveal';
    const votedCount = pupils.filter(
      (p) => p.answers?.[rIdx] !== null && p.answers?.[rIdx] !== undefined,
    ).length;
    const optionLetters = ['A', 'B', 'C', 'D'];
    const optionColors = ['#3b82f6', '#eab308', '#a855f7', '#ec4899'];

    bodyHtml = `
      <div style="display: flex; flex-direction: column; gap: 14px; flex: 1;">
        <!-- Top Dilemma Banner + Countdown -->
        <div style="background: linear-gradient(135deg, #111827 0%, #1e293b 100%); border: 2px solid ${isReveal ? '#fbbf24' : '#38bdf8'}; border-radius: 16px; padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; gap: 18px;">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="background: #fbbf24; color: #0f172a; font-size: 0.72rem; font-weight: 900; padding: 2px 9px; border-radius: 999px; text-transform: uppercase;">
                Round ${rIdx + 1} of ${scenario.rounds.length}
              </span>
              <span style="font-size: 0.82rem; font-weight: 800; color: #7dd3fc; font-family: monospace;">
                📅 ${esc(round.date)}
              </span>
            </div>
            <h2 style="margin: 0 0 6px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.55rem; color: #ffffff;">
              ${esc(round.title)}
            </h2>
            <div style="font-size: 1.08rem; color: #f1f5f9; line-height: 1.45; font-weight: 600;">
              ${esc(round.prompt)}
            </div>
          </div>

          <!-- Clock & Lock-In Counter -->
          <div style="background: #030712; border: 2px solid ${!isReveal && remainingSecs <= 10 ? '#ef4444' : '#334155'}; border-radius: 14px; padding: 12px 18px; text-align: center; min-width: 155px;">
            ${
              isReveal
                ? `<div style="font-size: 0.7rem; font-weight: 900; color: #fbbf24; text-transform: uppercase;">OUTCOME REVEALED</div>
                   <div style="font-size: 1.6rem; font-weight: 900; color: #4ade80; margin-top: 2px;">${votedCount}/${pupils.length} Voted</div>`
                : `<div style="font-size: 0.68rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Decision Clock</div>
                   <div id="warroom-host-clock" style="font-family: monospace; font-size: 2.4rem; font-weight: 900; color: ${remainingSecs <= 10 ? '#f87171' : '#4ade80'}; line-height: 1.05;">${remainingSecs}s</div>
                   <div style="font-size: 0.78rem; font-weight: 800; color: #38bdf8; margin-top: 3px;">🔒 ${votedCount} / ${pupils.length} Locked In</div>`
            }
          </div>
        </div>

        <!-- 4 Option Cards (Votes hidden until Reveal to prevent copying!) -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          ${round.options
            .map((opt, idx) => {
              const count = pupils.filter((p) => p.answers?.[rIdx] === idx).length;
              const pct = votedCount > 0 ? Math.round((count / votedCount) * 100) : 0;
              const isCorrect = idx === round.correctIdx;
              const borderCol = isReveal
                ? isCorrect
                  ? '#22c55e'
                  : 'rgba(255,255,255,0.12)'
                : optionColors[idx];
              const cardBg = isReveal
                ? isCorrect
                  ? 'linear-gradient(135deg, rgba(22,163,74,0.28) 0%, rgba(15,23,42,0.95) 100%)'
                  : 'rgba(15,23,42,0.55)'
                : 'rgba(15,23,42,0.88)';
              return `
              <div style="background: ${cardBg}; border: 2px solid ${borderCol}; border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px; opacity: ${isReveal && !isCorrect ? '0.68' : '1'};">
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                  <span style="width: 34px; height: 34px; border-radius: 9px; background: ${isReveal && isCorrect ? '#22c55e' : optionColors[idx]}; color: #ffffff; font-weight: 900; font-size: 1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    ${isReveal && isCorrect ? '✓' : optionLetters[idx]}
                  </span>
                  <div style="font-size: 1rem; font-weight: 700; color: #ffffff; line-height: 1.38;">
                    ${esc(opt)}
                  </div>
                </div>
                ${
                  isReveal
                    ? `
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 800; color: ${isCorrect ? '#4ade80' : '#cbd5e1'}; margin-bottom: 4px;">
                      <span>${isCorrect ? '🏆 Historical Outcome' : 'Class Votes'}</span>
                      <span>${count} ${count === 1 ? 'vote' : 'votes'} (${pct}%)</span>
                    </div>
                    <div style="height: 8px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden;">
                      <div style="width: ${pct}%; height: 100%; background: ${isCorrect ? '#22c55e' : '#64748b'}; transition: width 0.4s ease;"></div>
                    </div>
                  </div>
                `
                    : ''
                }
              </div>
            `;
            })
            .join('')}
        </div>

        <!-- Bottom Bar: Anti-Copy Realm Lock-In OR Historical Reveal Box + Next Action -->
        ${
          isReveal
            ? `
          <div style="background: linear-gradient(135deg, rgba(251,191,36,0.16) 0%, rgba(15,23,42,0.95) 100%); border: 1.5px solid #fbbf24; border-radius: 14px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 280px;">
              <div style="font-size: 0.76rem; font-weight: 900; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.06em;">
                📜 WHAT ACTUALLY HAPPENED · ${esc(round.revealHeadline)}
              </div>
              <div style="font-size: 0.94rem; color: #f8fafc; line-height: 1.42; margin-top: 3px;">
                ${esc(round.revealFact)}
              </div>
            </div>
            ${
              rIdx + 1 < scenario.rounds.length
                ? `<button id="btn-warroom-next-round" type="button" onclick="window.hostAdvanceWarRoom('round', ${rIdx + 1})" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border: 1.5px solid #38bdf8; border-radius: 10px; padding: 12px 20px; font-size: 0.95rem; font-weight: 900; cursor: pointer; flex-shrink: 0;">
                     Next: Round ${rIdx + 2} →
                   </button>`
                : `<button id="btn-warroom-goto-spectrum" type="button" onclick="window.hostAdvanceWarRoom('spectrum', ${rIdx})" style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #ffffff; border: 1.5px solid #fbbf24; border-radius: 10px; padding: 12px 20px; font-size: 0.95rem; font-weight: 900; cursor: pointer; flex-shrink: 0;">
                     ⚖️ Finale: Live Tug-of-War Verdict →
                   </button>`
            }
          </div>
        `
            : `
          <div style="background: rgba(15,23,42,0.85); border: 1px solid #334155; border-radius: 14px; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
            <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
              <span style="font-size: 0.76rem; font-weight: 800; color: #94a3b8;">🛡️ Realm Lock-In (Choices hidden until Reveal):</span>
              ${teams
                .map((t) => {
                  const m = pupils.filter((p) => p.faction === t.id);
                  const done = m.filter(
                    (p) => p.answers?.[rIdx] !== null && p.answers?.[rIdx] !== undefined,
                  ).length;
                  return `<span style="background: ${t.bg}; border: 1px solid ${t.border}; color: #ffffff; padding: 3px 10px; border-radius: 999px; font-size: 0.76rem; font-weight: 800;">${t.icon} ${esc(t.name)}: ${done}/${m.length}</span>`;
                })
                .join('')}
            </div>
            <button id="btn-warroom-reveal" type="button" onclick="window.hostAdvanceWarRoom('reveal', ${rIdx})" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0f172a; border: none; border-radius: 10px; padding: 11px 18px; font-size: 0.92rem; font-weight: 900; cursor: pointer;">
              ✨ Reveal Historical Outcome Now
            </button>
          </div>
        `
        }
      </div>
    `;
  } else if (phase === 'spectrum' || phase === 'revote') {
    const isRevote = phase === 'revote';
    const spec = scenario.spectrum;
    const activeVotes = pupils
      .map((p) => {
        const val = isRevote && p.slider2 !== null && p.slider2 !== undefined ? p.slider2 : p.slider1;
        const shifted =
          p.slider1 !== null &&
          p.slider1 !== undefined &&
          p.slider2 !== null &&
          p.slider2 !== undefined &&
          Math.abs(p.slider2 - p.slider1) >= 8;
        return { ...p, val, shifted };
      })
      .filter((p) => p.val !== null && p.val !== undefined);

    const avgVal =
      activeVotes.length > 0
        ? Math.round(activeVotes.reduce((s, p) => s + p.val, 0) / activeVotes.length)
        : 50;
    const mindChangers = activeVotes.filter((p) => p.shifted).length;
    const teamColorMap = new Map(teams.map((t) => [t.id, t.color]));

    bodyHtml = `
      <div style="display: flex; flex-direction: column; gap: 16px; flex: 1;">
        <div style="background: linear-gradient(135deg, #111827 0%, #1e293b 100%); border: 2px solid #fbbf24; border-radius: 16px; padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
          <div>
            <div style="font-size: 0.72rem; font-weight: 900; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.08em;">
              ⚖️ FINALE · LIVE CLASSROOM TUG-OF-WAR SPECTRUM ${isRevote ? '· 🔄 MIND-CHANGER RE-VOTE LIVE!' : ''}
            </div>
            <h2 style="margin: 4px 0 0 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.55rem; color: #ffffff;">
              ${esc(spec.question)}
            </h2>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            ${
              isRevote
                ? `<span style="background: rgba(16,185,129,0.2); border: 1.5px solid #34d399; color: #6ee7b7; padding: 6px 12px; border-radius: 999px; font-size: 0.82rem; font-weight: 900;">↔ ${mindChangers} ${mindChangers === 1 ? 'Historian' : 'Historians'} Shifted Verdict!</span>`
                : `<button id="btn-warroom-open-revote" type="button" onclick="window.hostAdvanceWarRoom('revote', ${rIdx})" style="background: #0284c7; color: #ffffff; border: 1.5px solid #38bdf8; border-radius: 10px; padding: 10px 16px; font-size: 0.86rem; font-weight: 900; cursor: pointer;">
                     🗣️ Debate &amp; Open Re-Vote
                   </button>`
            }
            <button id="btn-warroom-podium" type="button" onclick="window.hostAdvanceWarRoom('podium', ${rIdx})" style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: #ffffff; border: 1.5px solid #4ade80; border-radius: 10px; padding: 10px 18px; font-size: 0.88rem; font-weight: 900; cursor: pointer;">
              🏆 Final Honours Podium →
            </button>
          </div>
        </div>

        <!-- Live Tug-of-War Track -->
        <div style="background: rgba(15,23,42,0.9); border: 1.5px solid #334155; border-radius: 16px; padding: 22px 24px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 18px;">
            <div style="max-width: 42%;">
              <div style="font-size: 1.15rem; font-weight: 900; color: #f59e0b;">${esc(spec.leftLabel)}</div>
              <div style="font-size: 0.8rem; color: #cbd5e1;">${esc(spec.leftSub)}</div>
            </div>
            <div style="text-align: center; background: #030712; border: 1px solid #475569; border-radius: 999px; padding: 5px 14px;">
              <span style="font-size: 0.75rem; font-weight: 800; color: #94a3b8;">Class Balance (${activeVotes.length}/${pupils.length}): </span>
              <strong style="font-family: monospace; font-size: 0.9rem; color: #38bdf8;">${avgVal < 45 ? 'Leaning Left' : avgVal > 55 ? 'Leaning Right' : 'Balanced Split'} (${avgVal}%)</strong>
            </div>
            <div style="max-width: 42%; text-align: right;">
              <div style="font-size: 1.15rem; font-weight: 900; color: #38bdf8;">${esc(spec.rightLabel)}</div>
              <div style="font-size: 0.8rem; color: #cbd5e1;">${esc(spec.rightSub)}</div>
            </div>
          </div>

          <!-- Gradient Rope + Plotted Pupil Shield Dots -->
          <div style="position: relative; height: 84px; background: linear-gradient(90deg, rgba(245,158,11,0.28) 0%, rgba(30,41,59,0.9) 50%, rgba(56,189,248,0.28) 100%); border: 2px solid #475569; border-radius: 14px; margin: 10px 0 18px 0;">
            <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.2);"></div>
            <div style="position: absolute; left: ${avgVal}%; top: -8px; bottom: -8px; width: 4px; background: #ffffff; border-radius: 4px; box-shadow: 0 0 12px #ffffff; transition: left 0.4s ease;"></div>
            ${activeVotes
              .map((p, idx) => {
                const rowY = 12 + (idx % 3) * 24;
                const dotCol = teamColorMap.get(p.faction) || '#38bdf8';
                return `
                <div title="${esc(p.callsign)} (${p.val}%)" style="position: absolute; left: calc(${p.val}% - 12px); top: ${rowY}px; width: 24px; height: 24px; border-radius: 50%; background: ${dotCol}; border: 2.5px solid ${p.shifted ? '#fde047' : '#ffffff'}; box-shadow: 0 2px 8px rgba(0,0,0,0.5); transition: left 0.45s cubic-bezier(0.22,1,0.36,1); display: flex; align-items: center; justify-content: center; font-size: 0.62rem; font-weight: 900; color: #ffffff;">
                  ${p.shifted ? '↔' : '•'}
                </div>
              `;
              })
              .join('')}
          </div>

          <!-- 4 Evidence Cards Chosen by the Class -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            ${spec.evidenceCards
              .map((evText, idx) => {
                const cnt = pupils.filter((p) => p.evidenceIdx === idx).length;
                return `
                <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                  <span style="font-size: 0.86rem; font-weight: 700; color: #f1f5f9;">${esc(evText)}</span>
                  <span style="background: #0f172a; color: #fbbf24; border: 1px solid #fbbf24; border-radius: 999px; padding: 2px 10px; font-size: 0.78rem; font-weight: 900; flex-shrink: 0;">${cnt} cited</span>
                </div>
              `;
              })
              .join('')}
          </div>
        </div>
      </div>
    `;
  } else {
    // PODIUM
    const topHistorians = computeTopHistorians(scenario, ctrl.teamMode, pupils).slice(0, 5);
    const champ = standings[0];
    bodyHtml = `
      <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 18px; flex: 1; align-items: stretch;">
        <div style="background: linear-gradient(145deg, #111827 0%, #0f172a 100%); border: 2px solid #fbbf24; border-radius: 18px; padding: 22px; display: flex; flex-direction: column; gap: 12px;">
          <div style="font-size: 0.75rem; font-weight: 900; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.08em;">
            🏆 CHAMPION REALM · ACCURACY-WEIGHTED STANDINGS
          </div>
          <h2 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.8rem; color: #ffffff;">
            ${champ ? `${champ.icon} ${esc(champ.full)} Triumphs!` : 'Honours Roll'}
          </h2>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 6px;">
            ${standings
              .map(
                (st, i) => `
              <div style="background: ${st.bg}; border: 1.5px solid ${st.border}; border-radius: 12px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 1.3rem;">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🛡️'}</span>
                  <div>
                    <div style="font-size: 1.02rem; font-weight: 900; color: #ffffff;">${st.icon} ${esc(st.full)}</div>
                    <div style="font-size: 0.76rem; color: #cbd5e1;">${st.memberCount} ${st.memberCount === 1 ? 'Historian' : 'Historians'} · 🎯 ${st.accuracyPct}% Team Accuracy</div>
                  </div>
                </div>
                <div style="font-family: monospace; font-size: 1.2rem; font-weight: 900; color: #fbbf24;">
                  ${st.realmScore} pts
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>

        <div style="background: rgba(15,23,42,0.86); border: 1.5px solid #334155; border-radius: 18px; padding: 22px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 0.74rem; font-weight: 900; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">
              🎖️ TOP INDIVIDUAL HISTORIANS (BY CALLSIGN)
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
              ${
                topHistorians.length > 0
                  ? topHistorians
                      .map(
                        (h, idx) => `
                    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <strong style="color: #ffffff; font-size: 0.92rem;">#${idx + 1} ${esc(h.callsign)}</strong>
                        <span style="font-size: 0.74rem; color: #94a3b8; margin-left: 6px;">${h.team ? `${h.team.icon} ${esc(h.team.name)}` : ''}</span>
                      </div>
                      <span style="font-family: monospace; font-size: 0.85rem; font-weight: 900; color: #4ade80;">${h.correct}/${scenario.rounds.length} (${h.acc}%)</span>
                    </div>
                  `,
                      )
                      .join('')
                  : `<div style="color: #94a3b8; font-size: 0.88rem;">No individual rounds recorded.</div>`
              }
            </div>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 16px;">
            <button type="button" onclick="window.openLiveWarRoomHost({ scenarioId: '${ctrl.scenarioId === 'med7_l1' ? 'med7_l2' : 'med7_l1'}' })" style="flex: 1; background: #0284c7; color: #ffffff; border: none; border-radius: 10px; padding: 12px; font-size: 0.86rem; font-weight: 900; cursor: pointer;">
              ⚔️ Start New Room (${ctrl.scenarioId === 'med7_l1' ? 'Lesson 2' : 'Lesson 1'})
            </button>
            <button type="button" onclick="window.closeLiveWarRoom()" style="background: #ffffff; color: #0f172a; border: none; border-radius: 10px; padding: 12px 18px; font-size: 0.86rem; font-weight: 900; cursor: pointer;">
              ✕ Finish &amp; Close
            </button>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div style="position: fixed; inset: 0; z-index: 99995; background: radial-gradient(circle at top, #1e293b 0%, #090d16 70%); color: #f8fafc; padding: 16px 24px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; font-family: 'Outfit', system-ui, sans-serif; box-sizing: border-box;">
      <!-- Top Projector Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="background: rgba(251,191,36,0.18); color: #fbbf24; border: 1.5px solid #fbbf24; padding: 4px 10px; border-radius: 8px; font-size: 0.74rem; font-weight: 900; letter-spacing: 0.06em;">
            ${esc(scenario.badge)}
          </span>
          <div>
            <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; color: #ffffff;">
              ⚔️ ${esc(scenario.title)}
            </h1>
            <div style="font-size: 0.76rem; color: #94a3b8;">${esc(scenario.enquiry)}</div>
          </div>
        </div>

        <!-- Live Realm Standings Strip + Room Code Pill -->
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          ${standings
            .map(
              (s) => `
            <span style="background: ${s.bg}; border: 1px solid ${s.border}; color: #ffffff; padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 800;">
              ${s.icon} ${esc(s.name)}: <strong>${s.realmScore}</strong>
            </span>
          `,
            )
            .join('')}
          <span style="background: #030712; border: 1.5px solid #38bdf8; color: #7dd3fc; font-family: monospace; font-size: 0.88rem; font-weight: 900; padding: 4px 12px; border-radius: 8px;">
            CODE: ${esc(ctrl.roomCode)}
          </span>
          <button type="button" onclick="window.closeLiveWarRoom()" style="background: rgba(255,255,255,0.1); color: #f8fafc; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 6px 12px; font-size: 0.8rem; font-weight: 800; cursor: pointer;">
            ✕ Exit
          </button>
        </div>
      </div>

      ${bodyHtml}
    </div>
  `;
}

// ============================================================================
// PUPIL WINDOWS LAPTOP MODAL RENDERER
// ============================================================================
function renderPupilLaptopHtml() {
  const ctrl = wrState.ctrl;
  const me = (wrState.pupils || []).find((p) => p.id === wrState.pupilId);

  // Step 1: Join Form if not yet joined
  if (!ctrl || !me) {
    const previewTeams = WARROOM_TEAM_PRESETS[ctrl?.teamMode === 'houses' ? 'houses' : 'realms'];
    return `
      <div style="position: fixed; inset: 0; z-index: 99995; background: rgba(9, 13, 22, 0.84); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 16px; font-family: 'Outfit', system-ui, sans-serif; box-sizing: border-box;">
        <div style="background: #ffffff; border-radius: 18px; max-width: 480px; width: 100%; padding: 22px 24px; box-shadow: 0 24px 60px rgba(0,0,0,0.45); border: 2px solid #0284c7;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="background: #e0f2fe; color: #0369a1; font-size: 0.7rem; font-weight: 900; padding: 3px 9px; border-radius: 999px; letter-spacing: 0.05em;">
              ⚔️ LIVE CLASSROOM WAR ROOM
            </span>
            <button type="button" onclick="window.closeLiveWarRoom()" style="background: none; border: none; font-size: 1.35rem; color: #64748b; cursor: pointer;">&times;</button>
          </div>

          <h2 style="margin: 0 0 4px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.4rem; color: #0f172a;">
            Join Your Teacher’s Live Code
          </h2>
          <p style="margin: 0 0 14px 0; font-size: 0.82rem; color: #475569;">
            No account needed — enter the 6-letter code on the classroom projector and pick your Medieval Callsign!
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="display: block; font-size: 0.74rem; font-weight: 800; color: #0f172a; margin-bottom: 4px;">1. Classroom Whiteboard Code:</label>
              <input id="wr-pupil-code-input" type="text" value="${esc(wrState.joinCodeInput)}" oninput="window.wrUpdateJoinField('code', this.value)" placeholder="e.g. SENLAC-42" maxlength="14" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 10px; border: 2px solid #94a3b8; font-family: monospace; font-size: 1.25rem; font-weight: 900; text-transform: uppercase; text-align: center; color: #0f172a;" />
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <label style="font-size: 0.74rem; font-weight: 800; color: #0f172a;">2. Choose Your Medieval Callsign:</label>
                <button type="button" onclick="window.wrRandomizeCallsign()" style="background: none; border: none; color: #0284c7; font-size: 0.73rem; font-weight: 800; cursor: pointer;">🎲 Randomize</button>
              </div>
              <select id="wr-pupil-callsign-select" onchange="window.wrUpdateJoinField('callsign', this.value)" style="width: 100%; padding: 9px 10px; border-radius: 9px; border: 1.5px solid #cbd5e1; font-size: 16px; font-weight: 700; color: #0f172a; background: #f8fafc;">
                ${MEDIEVAL_CALLSIGNS.map(
                  (cs) => `<option value="${esc(cs)}" ${wrState.selectedCallsign === cs ? 'selected' : ''}>${esc(cs)}</option>`,
                ).join('')}
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.74rem; font-weight: 800; color: #0f172a; margin-bottom: 5px;">3. Pick Your Realm / House:</label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 7px;">
                ${previewTeams
                  .map(
                    (t) => `
                  <button type="button" onclick="window.wrUpdateJoinField('faction', '${t.id}')" style="background: ${wrState.selectedFaction === t.id ? '#0f172a' : '#f8fafc'}; color: ${wrState.selectedFaction === t.id ? '#ffffff' : '#0f172a'}; border: 2px solid ${wrState.selectedFaction === t.id ? t.color : '#cbd5e1'}; border-radius: 9px; padding: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer;">
                    ${t.icon} ${esc(t.name)}
                  </button>
                `,
                  )
                  .join('')}
              </div>
            </div>

            ${wrState.joinError ? `<div style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: 8px; padding: 8px 10px; font-size: 0.78rem; font-weight: 800;">⚠️ ${esc(wrState.joinError)}</div>` : ''}

            <button id="btn-wr-pupil-join" type="button" onclick="window.submitWarRoomJoin()" ${wrState.submitting ? 'disabled' : ''} style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border: none; border-radius: 11px; padding: 12px; font-size: 0.96rem; font-weight: 900; cursor: pointer;">
              ${wrState.submitting ? 'Joining War Room…' : '⚔️ Enter the War Room →'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  const scenario = WARROOM_SCENARIOS[ctrl.scenarioId] || WARROOM_SCENARIOS.med7_l1;
  const teams = WARROOM_TEAM_PRESETS[ctrl.teamMode === 'houses' ? 'houses' : 'realms'];
  const myTeam = teams.find((t) => t.id === me.faction) || teams[0];
  const phase = ctrl.phase;
  const rIdx = ctrl.roundIdx || 0;
  const round = scenario.rounds[rIdx] || scenario.rounds[0];
  const myChoice = me.answers?.[rIdx];
  const optionLetters = ['A', 'B', 'C', 'D'];

  let stageContent = '';

  if (phase === 'lobby') {
    stageContent = `
      <div style="text-align: center; padding: 24px 12px;">
        <div style="font-size: 2.6rem; margin-bottom: 8px;">${myTeam.icon}</div>
        <h3 style="margin: 0 0 6px 0; font-size: 1.25rem; color: #0f172a;">You’re In! Eyes on the Whiteboard</h3>
        <p style="margin: 0; font-size: 0.86rem; color: #475569;">
          Signed in as <strong>${esc(me.callsign)}</strong> for <strong>${esc(myTeam.full)}</strong>.<br/>
          Round 1 will appear here automatically as soon as your teacher launches!
        </p>
      </div>
    `;
  } else if (phase === 'round') {
    stageContent = `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div style="font-size: 0.72rem; font-weight: 900; color: #0284c7; text-transform: uppercase;">
          Round ${rIdx + 1} · ${esc(round.date)}
        </div>
        <div style="font-size: 0.98rem; font-weight: 800; color: #0f172a; line-height: 1.38;">
          ${esc(round.prompt)}
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
          ${round.options
            .map(
              (opt, idx) => `
            <button type="button" class="wr-pupil-opt-btn" data-opt="${idx}" onclick="window.submitWarRoomRoundChoice(${idx})" style="text-align: left; display: flex; align-items: center; gap: 10px; padding: 11px 12px; border-radius: 11px; border: 2px solid ${myChoice === idx ? '#0284c7' : '#cbd5e1'}; background: ${myChoice === idx ? '#eff6ff' : '#ffffff'}; color: #0f172a; font-size: 0.88rem; font-weight: 700; cursor: pointer;">
              <span style="width: 28px; height: 28px; border-radius: 7px; background: ${myChoice === idx ? '#0284c7' : '#e2e8f0'}; color: ${myChoice === idx ? '#ffffff' : '#334155'}; display: flex; align-items: center; justify-content: center; font-weight: 900; flex-shrink: 0;">
                ${optionLetters[idx]}
              </span>
              <span>${esc(opt)}</span>
            </button>
          `,
            )
            .join('')}
        </div>
        ${
          myChoice !== null && myChoice !== undefined
            ? `<div style="background: #ecfdf5; color: #065f46; border: 1px solid #6ee7b7; border-radius: 8px; padding: 8px 10px; font-size: 0.8rem; font-weight: 800; text-align: center;">
                 🔒 Answer ${optionLetters[myChoice]} locked in! Watch the classroom projector for the reveal.
               </div>`
            : ''
        }
      </div>
    `;
  } else if (phase === 'reveal') {
    const won = myChoice === round.correctIdx;
    stageContent = `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div style="background: ${won ? '#ecfdf5' : '#fef2f2'}; border: 1.5px solid ${won ? '#34d399' : '#fca5a5'}; color: ${won ? '#065f46' : '#991b1b'}; border-radius: 12px; padding: 14px; text-align: center;">
          <div style="font-size: 1.6rem;">${won ? '🎯' : '🛡️'}</div>
          <div style="font-size: 1.05rem; font-weight: 900; margin-top: 2px;">
            ${won ? 'Spot-On Historical Judgement! (+100 Realm Pts)' : `Not Quite — Correct Choice Was ${optionLetters[round.correctIdx]}`}
          </div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; font-size: 0.85rem; color: #1e293b; line-height: 1.42;">
          <strong>📜 ${esc(round.revealHeadline)}:</strong> ${esc(round.revealFact)}
        </div>
      </div>
    `;
  } else if (phase === 'spectrum' || phase === 'revote') {
    const isRevote = phase === 'revote';
    const spec = scenario.spectrum;
    const savedVal = isRevote ? me.slider2 ?? me.slider1 : me.slider1;
    const displayVal = wrState.localSliderTouched ? wrState.localSliderVal : savedVal ?? 50;
    const evChoice = wrState.localEvidenceIdx ?? me.evidenceIdx ?? 0;

    stageContent = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="font-size: 0.72rem; font-weight: 900; color: #b45309; text-transform: uppercase;">
          ${isRevote ? '🔄 Mind-Changer Re-Vote — Did the Class Debate Shift Your View?' : '⚖️ Final Historical Judgement'}
        </div>
        <div style="font-size: 1rem; font-weight: 900; color: #0f172a;">${esc(spec.question)}</div>

        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.76rem; font-weight: 800; margin-bottom: 8px; gap: 8px;">
            <span style="color: #b45309;">${esc(spec.leftLabel)}</span>
            <span style="color: #0369a1; text-align: right;">${esc(spec.rightLabel)}</span>
          </div>
          <input id="wr-pupil-spectrum-slider" type="range" min="0" max="100" value="${displayVal}" oninput="window.wrUpdateSpectrumLocal(this.value)" style="width: 100%; cursor: pointer;" />
          <div style="text-align: center; font-family: monospace; font-size: 0.78rem; font-weight: 800; color: #475569; margin-top: 4px;">
            Your Position: ${displayVal}%
          </div>
        </div>

        <div>
          <div style="font-size: 0.74rem; font-weight: 800; color: #334155; margin-bottom: 6px;">Tap 1 Key Piece of Evidence to Back Your Verdict:</div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${spec.evidenceCards
              .map(
                (ev, idx) => `
              <button type="button" onclick="window.wrSelectEvidence(${idx})" style="text-align: left; padding: 8px 10px; border-radius: 8px; border: 1.5px solid ${evChoice === idx ? '#0284c7' : '#cbd5e1'}; background: ${evChoice === idx ? '#eff6ff' : '#ffffff'}; font-size: 0.8rem; font-weight: 700; color: #0f172a; cursor: pointer;">
                ${esc(ev)}
              </button>
            `,
              )
              .join('')}
          </div>
        </div>

        <button id="btn-wr-submit-spectrum" type="button" onclick="window.submitWarRoomSpectrum()" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border: none; border-radius: 10px; padding: 11px; font-size: 0.9rem; font-weight: 900; cursor: pointer;">
          ${savedVal !== null && savedVal !== undefined ? '✓ Update My Dot on the Whiteboard' : '📡 Send My Dot to the Whiteboard →'}
        </button>
      </div>
    `;
  } else {
    const ranked = computeTopHistorians(scenario, ctrl.teamMode, wrState.pupils || []);
    const myRankIdx = ranked.findIndex((r) => r.id === me.id);
    const myStats = ranked[myRankIdx] || { correct: 0, acc: 0 };
    stageContent = `
      <div style="text-align: center; padding: 16px 8px;">
        <div style="font-size: 2.5rem;">🏆</div>
        <h3 style="margin: 6px 0 4px 0; font-size: 1.25rem; color: #0f172a;">War Room Complete!</h3>
        <div style="font-size: 0.9rem; color: #334155; margin-bottom: 12px;">
          <strong>${esc(me.callsign)}</strong> · Rank <strong>#${myRankIdx >= 0 ? myRankIdx + 1 : 1}</strong> · 🎯 <strong>${myStats.acc}% Accuracy</strong> (${myStats.correct}/${scenario.rounds.length})
        </div>
        <button type="button" onclick="window.closeLiveWarRoom()" style="background: #0f172a; color: #ffffff; border: none; border-radius: 10px; padding: 10px 18px; font-size: 0.86rem; font-weight: 800; cursor: pointer;">
          Return to Lesson
        </button>
      </div>
    `;
  }

  return `
    <div style="position: fixed; inset: 0; z-index: 99995; background: rgba(9, 13, 22, 0.82); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; padding: 14px; font-family: 'Outfit', system-ui, sans-serif; box-sizing: border-box;">
      <div style="background: #ffffff; border-radius: 18px; max-width: 520px; width: 100%; max-height: 92vh; overflow-y: auto; padding: 18px 20px; box-shadow: 0 24px 60px rgba(0,0,0,0.45); border: 2px solid ${myTeam.color};">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 12px;">
          <div>
            <div style="font-size: 0.68rem; font-weight: 900; color: #64748b; font-family: monospace;">ROOM ${esc(ctrl.roomCode)} · ${myTeam.icon} ${esc(myTeam.name)}</div>
            <div style="font-size: 0.88rem; font-weight: 900; color: #0f172a;">${esc(me.callsign)}</div>
          </div>
          <button type="button" onclick="window.closeLiveWarRoom()" style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 7px; padding: 4px 9px; font-size: 0.74rem; font-weight: 800; color: #475569; cursor: pointer;">Leave</button>
        </div>
        ${stageContent}
      </div>
    </div>
  `;
}

function renderWarRoomOverlay() {
  const root = getOverlayRoot();
  if (!wrState.role) {
    root.innerHTML = '';
    return;
  }
  root.innerHTML = wrState.role === 'host' ? renderHostProjectorHtml() : renderPupilLaptopHtml();
}

function startWarRoomPolling() {
  stopTimers();
  wrState.pollTimer = setInterval(async () => {
    if (!wrState.roomCode || !wrState.role) return;
    try {
      const res = await apiPoll(wrState.roomCode);
      if (res?.ok && res.ctrl) {
        const prevPhase = wrState.ctrl?.phase;
        const prevRound = wrState.ctrl?.roundIdx;
        wrState.ctrl = res.ctrl;
        wrState.pupils = res.pupils || [];
        if (prevPhase !== res.ctrl.phase || prevRound !== res.ctrl.roundIdx) {
          wrState.localSliderTouched = false;
        }
        // Avoid wiping pupil text input while still on join screen
        const activeId = document.activeElement?.id || '';
        if (activeId !== 'wr-pupil-code-input' && activeId !== 'wr-pupil-callsign-select') {
          renderWarRoomOverlay();
        }
      }
    } catch {}
  }, 1300);

  if (wrState.role === 'host') {
    wrState.tickTimer = setInterval(() => {
      const clockEl = document.getElementById('warroom-host-clock');
      if (clockEl && wrState.ctrl?.phase === 'round' && wrState.ctrl.roundStartedAt) {
        const elapsed = Math.floor((Date.now() - wrState.ctrl.roundStartedAt) / 1000);
        const rem = Math.max(0, (wrState.ctrl.timerSecs || 45) - elapsed);
        clockEl.textContent = `${rem}s`;
        clockEl.style.color = rem <= 10 ? '#f87171' : '#4ade80';
      }
    }, 500);
  }
}

// ============================================================================
// PUBLIC LAUNCHERS & GLOBAL HANDLERS
// ============================================================================
export function renderMedievalWarRoomLessonCardHTML(lessonIndex) {
  const scenarioId = lessonIndex === 1 ? 'med7_l2' : 'med7_l1';
  const sc = WARROOM_SCENARIOS[scenarioId];
  const staff = isStaffModeActive();

  return `
    <div class="hh-warroom-lesson-card no-print" style="margin: 22px 0; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 2px solid #fbbf24; border-radius: 14px; padding: 16px 20px; color: #ffffff; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; box-shadow: 0 10px 26px rgba(15,23,42,0.18);">
      <div style="flex: 1; min-width: 240px;">
        <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.7rem; font-weight: 900; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;">
          <span>⚔️ LIVE CLASSROOM COLLABORATION</span> · <span>ZERO LOGINS</span>
        </div>
        <h3 style="margin: 0 0 4px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.2rem; color: #ffffff;">
          ${esc(sc.title)} — Live War Room
        </h3>
        <div style="font-size: 0.84rem; color: #cbd5e1; line-height: 1.4;">
          4 rapid historical decision rounds across Windows laptops + live Tug-of-War Verdict spectrum on the classroom whiteboard.
        </div>
      </div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        ${
          staff
            ? `<button type="button" onclick="window.openLiveWarRoomHost({ scenarioId: '${scenarioId}' })" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0f172a; border: none; border-radius: 9px; padding: 10px 16px; font-size: 0.86rem; font-weight: 900; cursor: pointer;">
                 📡 Launch on Whiteboard
               </button>`
            : ''
        }
        <button type="button" onclick="window.openLiveWarRoomJoin()" style="background: #0284c7; color: #ffffff; border: 1.5px solid #38bdf8; border-radius: 9px; padding: 10px 16px; font-size: 0.86rem; font-weight: 900; cursor: pointer;">
          🔑 Join Teacher’s Code
        </button>
      </div>
    </div>
  `;
}

export function registerLiveWarRoomGlobals() {
  if (typeof window === 'undefined' || window.__liveWarRoomRegistered) return;
  window.__liveWarRoomRegistered = true;

  window.openLiveWarRoomHost = async function (opts = {}) {
    const scenarioId = opts.scenarioId === 'med7_l2' ? 'med7_l2' : 'med7_l1';
    const code = generateRoomCode(scenarioId);
    const res = await apiPost({
      action: 'warroom_create',
      roomCode: code,
      scenarioId,
      teamMode: 'realms',
    });
    if (!res?.ok || !res.ctrl) return;
    wrState.role = 'host';
    wrState.roomCode = res.ctrl.roomCode;
    wrState.hostToken = res.hostToken;
    wrState.ctrl = res.ctrl;
    wrState.pupils = [];
    renderWarRoomOverlay();
    startWarRoomPolling();
  };

  window.hostSetWarRoomConfig = async function (patch = {}) {
    if (wrState.role !== 'host' || !wrState.roomCode) return;
    const res = await apiPost({
      action: 'warroom_host',
      roomCode: wrState.roomCode,
      hostToken: wrState.hostToken,
      ...patch,
    });
    if (res?.ok && res.ctrl) {
      wrState.ctrl = res.ctrl;
      renderWarRoomOverlay();
    }
  };

  window.hostAdvanceWarRoom = async function (phase, roundIdx = 0) {
    if (wrState.role !== 'host' || !wrState.roomCode) return;
    const res = await apiPost({
      action: 'warroom_host',
      roomCode: wrState.roomCode,
      hostToken: wrState.hostToken,
      phase,
      roundIdx,
    });
    if (res?.ok && res.ctrl) {
      wrState.ctrl = res.ctrl;
      renderWarRoomOverlay();
    }
  };

  window.copyWarRoomClassLink = function (url) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    if (typeof window.showChessToast === 'function') {
      window.showChessToast('📋 Copied 1-Click Pupil War Room Link!', 'success');
    }
  };

  window.openLiveWarRoomJoin = async function (prefillCode = '') {
    stopTimers();
    wrState.role = 'pupil';
    wrState.roomCode = '';
    wrState.pupilId = getOrCreatePupilDeviceId();
    wrState.joinError = '';
    wrState.submitting = false;
    wrState.ctrl = null;
    wrState.pupils = [];
    wrState.selectedCallsign =
      MEDIEVAL_CALLSIGNS[Math.floor(Math.random() * MEDIEVAL_CALLSIGNS.length)];
    const factions = ['wessex', 'normandy', 'mercia', 'northumbria'];
    wrState.selectedFaction = factions[Math.floor(Math.random() * factions.length)];
    wrState.joinCodeInput = prefillCode ? String(prefillCode).trim().toUpperCase() : '';
    renderWarRoomOverlay();

    if (wrState.joinCodeInput) {
      try {
        const pre = await apiPoll(wrState.joinCodeInput);
        if (pre?.ok && pre.ctrl && wrState.role === 'pupil' && !wrState.roomCode) {
          const prevMode = wrState.ctrl?.teamMode || 'realms';
          wrState.ctrl = pre.ctrl;
          if (pre.ctrl.teamMode === 'houses' && prevMode !== 'houses') {
            const validIds = WARROOM_TEAM_PRESETS.houses.map((x) => x.id);
            if (!validIds.includes(wrState.selectedFaction)) wrState.selectedFaction = 'warrior';
            renderWarRoomOverlay();
          }
        }
      } catch {}
    }
  };

  window.wrUpdateJoinField = async function (field, val) {
    if (field === 'code') {
      wrState.joinCodeInput = String(val || '').toUpperCase();
      if (/^[A-Z]{4,8}-\d{2,3}$/.test(wrState.joinCodeInput.trim())) {
        try {
          const pre = await apiPoll(wrState.joinCodeInput.trim());
          if (pre?.ok && pre.ctrl && !wrState.roomCode) {
            const prevMode = wrState.ctrl?.teamMode || 'realms';
            wrState.ctrl = pre.ctrl;
            if (pre.ctrl.teamMode !== prevMode) {
              const isHouses = pre.ctrl.teamMode === 'houses';
              const validIds = WARROOM_TEAM_PRESETS[isHouses ? 'houses' : 'realms'].map((x) => x.id);
              if (!validIds.includes(wrState.selectedFaction)) {
                wrState.selectedFaction = validIds[0];
              }
              renderWarRoomOverlay();
            }
          }
        } catch {}
      }
    } else if (field === 'callsign') {
      wrState.selectedCallsign = val;
    } else if (field === 'faction') {
      wrState.selectedFaction = val;
      renderWarRoomOverlay();
    }
  };

  window.wrRandomizeCallsign = function () {
    wrState.selectedCallsign =
      MEDIEVAL_CALLSIGNS[Math.floor(Math.random() * MEDIEVAL_CALLSIGNS.length)];
    renderWarRoomOverlay();
  };

  window.submitWarRoomJoin = async function () {
    const code = String(wrState.joinCodeInput || '')
      .trim()
      .toUpperCase();
    if (!/^[A-Z]{4,8}-\d{2,3}$/.test(code)) {
      wrState.joinError = 'Type the code from the whiteboard (for example: SENLAC-42).';
      renderWarRoomOverlay();
      return;
    }
    wrState.submitting = true;
    wrState.joinError = '';
    renderWarRoomOverlay();

    try {
      const res = await apiPost({
        action: 'warroom_pupil',
        roomCode: code,
        pupilId: wrState.pupilId,
        callsign: wrState.selectedCallsign,
        faction: wrState.selectedFaction,
      });
      wrState.submitting = false;
      if (!res?.ok) {
        wrState.joinError = res?.error || 'Room not found — check the whiteboard code!';
        renderWarRoomOverlay();
        return;
      }
      wrState.roomCode = code;
      wrState.ctrl = res.ctrl;
      const pollRes = await apiPoll(code);
      if (pollRes?.ok) {
        wrState.ctrl = pollRes.ctrl;
        wrState.pupils = pollRes.pupils || [res.pupil];
      } else {
        wrState.pupils = [res.pupil];
      }
      renderWarRoomOverlay();
      startWarRoomPolling();
    } catch {
      wrState.submitting = false;
      wrState.joinError = 'Network error — please check Wi-Fi and try again.';
      renderWarRoomOverlay();
    }
  };

  window.submitWarRoomRoundChoice = async function (choiceIdx) {
    if (wrState.role !== 'pupil' || !wrState.roomCode || !wrState.ctrl) return;
    const rIdx = wrState.ctrl.roundIdx || 0;
    const me = (wrState.pupils || []).find((p) => p.id === wrState.pupilId);
    let fullAnswers = [null, null, null, null];
    if (me) {
      me.answers = me.answers || [null, null, null, null];
      me.answers[rIdx] = choiceIdx;
      fullAnswers = [...me.answers];
      renderWarRoomOverlay();
    } else {
      fullAnswers[rIdx] = choiceIdx;
    }
    const res = await apiPost({
      action: 'warroom_pupil',
      roomCode: wrState.roomCode,
      pupilId: wrState.pupilId,
      roundIdx: rIdx,
      choiceIdx,
      answers: fullAnswers,
    });
    if (res?.ok && res.pupil) {
      const idx = (wrState.pupils || []).findIndex((p) => p.id === wrState.pupilId);
      if (idx >= 0) wrState.pupils[idx] = res.pupil;
    }
  };

  window.wrUpdateSpectrumLocal = function (val) {
    wrState.localSliderTouched = true;
    wrState.localSliderVal = Number(val);
    renderWarRoomOverlay();
  };

  window.wrSelectEvidence = function (idx) {
    wrState.localEvidenceIdx = idx;
    renderWarRoomOverlay();
  };

  window.submitWarRoomSpectrum = async function () {
    if (wrState.role !== 'pupil' || !wrState.roomCode || !wrState.ctrl) return;
    const isRevote = wrState.ctrl.phase === 'revote';
    const val = wrState.localSliderTouched ? wrState.localSliderVal : 50;
    const payload = {
      action: 'warroom_pupil',
      roomCode: wrState.roomCode,
      pupilId: wrState.pupilId,
      evidenceIdx: wrState.localEvidenceIdx ?? 0,
    };
    if (isRevote) payload.slider2 = val;
    else payload.slider1 = val;

    const res = await apiPost(payload);
    if (res?.ok && res.pupil) {
      const idx = (wrState.pupils || []).findIndex((p) => p.id === wrState.pupilId);
      if (idx >= 0) wrState.pupils[idx] = res.pupil;
      renderWarRoomOverlay();
    }
  };

  window.closeLiveWarRoom = function () {
    stopTimers();
    wrState.role = null;
    wrState.roomCode = '';
    wrState.ctrl = null;
    wrState.pupils = [];
    renderWarRoomOverlay();
  };
}
