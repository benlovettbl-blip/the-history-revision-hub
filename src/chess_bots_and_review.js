/**
 * The History Revision Hub — Historical Personality Bots, Opening Explorer,
 * Daily Tactical Puzzles & Local Conquest / Profile Trackers
 */

export const HISTORICAL_BOTS = [
  {
    id: 'henry_viii',
    name: 'King Henry VIII',
    shortName: 'Henry VIII',
    era: 'Tudor Court · 1509',
    tierLabel: 'Tier 1 · Novice',
    icon: '🍗',
    elo: 450,
    winXp: 15,
    drawXp: 8,
    effortXp: 5,
    accent: '#dc2626',
    bgLight: '#fef2f2',
    border: '#fca5a5',
    searchDepth: 0,
    jitter: 170,
    useQuiesce: false,
    style: 'reckless',
    summary:
      'Impulsive monarch — charges pawns & his Queen early and loves greedy captures, leaving his King wide open!',
    quips: {
      start: '"Bring forth the banquet — and charge every piece forward at once!"',
      capture: '"Mine! Another piece seized for the Tudor treasury!"',
      check: '"Mind your Crown! Check!"',
      botWin: '"Victory at Hampton Court! Care for a rematch?"',
      pupilWin: '"Outwitted! My advisers shall hear of this checkmate!"',
    },
  },
  {
    id: 'boudicca',
    name: 'Queen Boudicca',
    shortName: 'Boudicca',
    era: 'Iceni Uprising · AD 60',
    tierLabel: 'Tier 2 · Challenger',
    icon: '🛡️',
    elo: 700,
    winXp: 22,
    drawXp: 10,
    effortXp: 6,
    accent: '#d97706',
    bgLight: '#fffbeb',
    border: '#fcd34d',
    searchDepth: 0,
    jitter: 90,
    useQuiesce: false,
    style: 'raider',
    summary:
      'Fierce chariot attacker — leaps Knights into enemy territory early, but can overcommit in long endgames.',
    quips: {
      start: '"Sound the war horns — our Knights ride straight for the centre!"',
      capture: '"Swift strike! Our chariots break through!"',
      check: '"No Roman wall can shield your King now — Check!"',
      botWin: '"The Iceni stand victorious!"',
      pupilWin: '"Well fought, tactician — your defence held firm!"',
    },
  },
  {
    id: 'elizabeth_i',
    name: 'Queen Elizabeth I',
    shortName: 'Elizabeth I',
    era: 'Golden Age · 1588',
    tierLabel: 'Tier 3 · Club Regular',
    icon: '👑',
    elo: 950,
    winXp: 30,
    drawXp: 15,
    effortXp: 8,
    accent: '#0284c7',
    bgLight: '#f0f9ff',
    border: '#7dd3fc',
    searchDepth: 1,
    jitter: 36,
    useQuiesce: false,
    style: 'solid',
    summary:
      'Patient strategist — castles early, protects every square, and waits for rash attackers to blunder.',
    quips: {
      start: '"Patience and counsel win more battles than haste. Make your move."',
      capture: '"A calculated exchange — just as Walsingham predicted."',
      check: '"Check! Guard your sovereign well."',
      botWin: '"Like the Armada in 1588, haste dashed itself against steady defence!"',
      pupilWin: '"A royal performance! You outmanoeuvred my entire court."',
    },
  },
  {
    id: 'napoleon',
    name: 'Napoleon Bonaparte',
    shortName: 'Napoleon',
    era: 'Grand Armée · 1805',
    tierLabel: 'Tier 4 · Advanced',
    icon: '🦅',
    elo: 1200,
    winXp: 38,
    drawXp: 18,
    effortXp: 10,
    accent: '#4f46e5',
    bgLight: '#eef2ff',
    border: '#a5b4fc',
    searchDepth: 1,
    jitter: 14,
    useQuiesce: true,
    style: 'tactical',
    summary:
      'Grand Tactics commander — seizes the central four squares rapidly and launches sharp Bishop & Knight forks.',
    quips: {
      start: '"Control the centre, mass your Bishops like artillery, and strike!"',
      capture: '"Concentration of force wins the square!"',
      check: '"En garde — Check from the Grand Battery!"',
      botWin: '"Austerlitz on 64 squares! Study the centre and challenge me again."',
      pupilWin: '"Mon Dieu — a tactical masterpiece worthy of a Marshal!"',
    },
  },
  {
    id: 'eleanor',
    name: 'Eleanor of Aquitaine',
    shortName: 'Eleanor',
    era: 'High Middle Ages · 1154',
    tierLabel: 'Tier 5 · Master',
    icon: '📜',
    elo: 1450,
    winXp: 46,
    drawXp: 22,
    effortXp: 10,
    accent: '#7c3aed',
    bgLight: '#f5f3ff',
    border: '#c4b5fd',
    searchDepth: 2,
    jitter: 6,
    useQuiesce: true,
    style: 'positional',
    summary:
      'Master diplomat — calculates two moves deeper, commands open Rook files, and punishes quiet inaccuracies.',
    quips: {
      start: '"Every pawn move writes a treaty you cannot erase. Choose wisely."',
      capture: '"A quiet positional gain — the endgame tilts our way."',
      check: '"Check! Every escape square has already been accounted for."',
      botWin: '"Two moves ahead from start to finish — review the turning point below!"',
      pupilWin: '"Extraordinary foresight! Few players in the realm see that deeply."',
    },
  },
  {
    id: 'turing',
    name: 'Alan Turing (Turochamp)',
    shortName: 'Alan Turing',
    era: 'Bletchley Park · 1948',
    tierLabel: 'Tier 6 · Boss Engine',
    icon: '💻',
    elo: 1700,
    winXp: 55,
    drawXp: 28,
    effortXp: 12,
    accent: '#059669',
    bgLight: '#ecfdf5',
    border: '#6ee7b7',
    searchDepth: 2,
    jitter: 0,
    useQuiesce: true,
    style: 'engine',
    summary:
      "Inspired by Turing's real 1948 Turochamp chess algorithm — Opening Book + deepest tactical calculation!",
    quips: {
      start: '"Turochamp 1948 initialized. Let us test human intuition against pure search."',
      capture: '"Optimal branch selected — material balance updated."',
      check: '"Check detected in the minimax tree!"',
      botWin:
        '"Calculation complete! Inspect the Coach Review to spot the exact ply that swung the evaluation."',
      pupilWin: '"Astonishing! You cracked the Bletchley Boss Engine fair and square!"',
    },
  },
];

export const BOT_MAP = Object.fromEntries(HISTORICAL_BOTS.map((b) => [b.id, b]));

export function resolveBotProfile(levelOrId) {
  if (BOT_MAP[levelOrId]) return BOT_MAP[levelOrId];
  if (levelOrId === 'easy') return BOT_MAP.henry_viii;
  if (levelOrId === 'hard') return BOT_MAP.turing;
  return BOT_MAP.elizabeth_i;
}

// ============================================================================
// NAMED OPENING EXPLORER (Matches SAN prefix)
// ============================================================================
const OPENING_LIBRARY = [
  { prefix: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5'], name: 'Fried Liver Attack' },
  { prefix: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'], name: 'Giuoco Piano (Italian Game)' },
  { prefix: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'], name: 'Italian Game' },
  { prefix: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'], name: 'Ruy Lopez (Spanish Opening)' },
  { prefix: ['e4', 'e5', 'Nf3', 'Nc6', 'd4'], name: 'Scotch Game' },
  { prefix: ['e4', 'e5', 'Nf3', 'Nc6', 'Nc3', 'Nf6'], name: 'Four Knights Game' },
  { prefix: ['e4', 'e5', 'Nf3', 'Nf6'], name: "Petrov's Defence" },
  { prefix: ['e4', 'e5', 'Nf3', 'd6'], name: 'Philidor Defence' },
  { prefix: ['e4', 'e5', 'f4'], name: "King's Gambit" },
  { prefix: ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5'], name: "⚠️ Scholar's Mate Trap" },
  { prefix: ['e4', 'e5', 'Qh5'], name: 'Wayward Queen Attack' },
  { prefix: ['e4', 'e5', 'Nc3'], name: 'Vienna Game' },
  { prefix: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4'], name: 'Open Sicilian Defence' },
  { prefix: ['e4', 'c5'], name: 'Sicilian Defence' },
  { prefix: ['e4', 'e6'], name: 'French Defence' },
  { prefix: ['e4', 'c6'], name: 'Caro-Kann Defence' },
  { prefix: ['e4', 'd5'], name: 'Scandinavian Defence' },
  { prefix: ['e4', 'd6'], name: 'Pirc Defence' },
  { prefix: ['d4', 'd5', 'c4', 'e6'], name: "Queen's Gambit Declined" },
  { prefix: ['d4', 'd5', 'c4', 'c6'], name: 'Slav Defence' },
  { prefix: ['d4', 'd5', 'c4', 'dxc4'], name: "Queen's Gambit Accepted" },
  { prefix: ['d4', 'd5', 'c4'], name: "Queen's Gambit" },
  { prefix: ['d4', 'd5', 'Bf4'], name: 'London System' },
  { prefix: ['d4', 'Nf6', 'Bf4'], name: 'London System' },
  { prefix: ['d4', 'Nf6', 'c4', 'g6'], name: "King's Indian Defence" },
  { prefix: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'], name: 'Nimzo-Indian Defence' },
  { prefix: ['c4'], name: 'English Opening' },
  { prefix: ['Nf3'], name: 'Réti Opening' },
];

export function detectOpeningName(moveLog = []) {
  if (!Array.isArray(moveLog) || moveLog.length === 0) return '';
  const cleanSans = moveLog.map((m) => String(m.san || '').replace(/[+#]/g, ''));
  for (const op of OPENING_LIBRARY) {
    if (cleanSans.length >= op.prefix.length) {
      let match = true;
      for (let i = 0; i < op.prefix.length; i++) {
        if (cleanSans[i] !== op.prefix[i]) {
          match = false;
          break;
        }
      }
      if (match) return op.name;
    }
  }
  if (cleanSans[0] === 'e4') return "King's Pawn Opening";
  if (cleanSans[0] === 'd4') return "Queen's Pawn Opening";
  return '';
}

const TURING_BOOK = {
  '': [
    ['e2', 'e4'],
    ['d2', 'd4'],
  ],
  e4: [
    ['c7', 'c5'],
    ['e7', 'e5'],
  ],
  d4: [
    ['g8', 'f6'],
    ['d7', 'd5'],
  ],
  'e4 e5': [['g1', 'f3']],
  'e4 c5': [['g1', 'f3']],
  'e4 e5 Nf3': [['b8', 'c6']],
  'e4 e5 Nf3 Nc6': [
    ['f1', 'b5'],
    ['f1', 'c4'],
  ],
  'e4 e5 Nf3 Nc6 Bc4': [
    ['g8', 'f6'],
    ['f8', 'c5'],
  ],
  'd4 d5 c4': [
    ['e7', 'e6'],
    ['c7', 'c6'],
  ],
};

export function pickTuringBookMove(moveLog, legalMoves, sqNameFn) {
  if (!Array.isArray(moveLog) || moveLog.length > 6) return null;
  const key = moveLog.map((m) => String(m.san || '').replace(/[+#]/g, '')).join(' ');
  const choices = TURING_BOOK[key];
  if (!choices || choices.length === 0) return null;
  const [fromSq, toSq] = choices[Math.floor(Math.random() * choices.length)];
  return (
    legalMoves.find(
      (m) => sqNameFn(m.fromR, m.fromC) === fromSq && sqNameFn(m.toR, m.toC) === toSq,
    ) || null
  );
}

// ============================================================================
// SAFE ROOM CODE GENERATOR & PRESET ETIQUETTE REACTIONS
// ============================================================================
const DUEL_CODE_WORDS = [
  'CASTLE',
  'KNIGHT',
  'BISHOP',
  'GAMBIT',
  'CROWN',
  'ROOKS',
  'QUEENS',
  'CHECK',
  'SHIELD',
  'THRONE',
];

export function generateSafeDuelRoomCode() {
  const word = DUEL_CODE_WORDS[Math.floor(Math.random() * DUEL_CODE_WORDS.length)];
  const num = Math.floor(10 + Math.random() * 89);
  return `${word}-${num}`;
}

export const DUEL_QUICK_REACTIONS = [
  '🤝 Good luck!',
  '👏 Nice move!',
  '🤔 Thinking...',
  '😮 Great tactic!',
  '🤝 Good game!',
];

// ============================================================================
// DAILY TACTICAL PUZZLES (14 Classic Checkmates & Royal Forks — Verified)
// ============================================================================
export function parseFenBoardOnly(fenBoard) {
  const rows = String(fenBoard || '').split('/');
  if (rows.length !== 8) return null;
  return rows.map((rowStr) => {
    const out = [];
    for (const ch of rowStr) {
      if (ch >= '1' && ch <= '8') {
        for (let i = 0; i < Number(ch); i++) out.push('.');
      } else {
        out.push(ch);
      }
    }
    return out;
  });
}

export const DAILY_TACTICAL_PUZZLES = [
  {
    id: 'dp_1',
    title: 'Back-Rank Corridor Mate',
    theme: 'Back-Rank Checkmate',
    sideToMove: 'w',
    fenBoard: '6k1/5ppp/8/8/8/8/5PPP/3R2K1',
    solutionFrom: 'd1',
    solutionTo: 'd8',
    hint: 'Black’s own f7, g7, and h7 pawns trap their King on the 8th rank! Send your Rook all the way up.',
  },
  {
    id: 'dp_2',
    title: "Scholar's Strike on f7",
    theme: 'Queen + Bishop Mate in 1',
    sideToMove: 'w',
    fenBoard: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR',
    solutionFrom: 'h5',
    solutionTo: 'f7',
    hint: 'Look at f7 — your Bishop on c4 protects your Queen for an instant Checkmate!',
  },
  {
    id: 'dp_3',
    title: 'Arabian Corner Mate',
    theme: 'Rook + Knight Teamwork',
    sideToMove: 'w',
    fenBoard: '7k/R7/5N2/8/8/8/6PP/6K1',
    solutionFrom: 'a7',
    solutionTo: 'h7',
    hint: 'Your Knight on f6 guards both g8 and h7! Slide your Rook across to h7.',
  },
  {
    id: 'dp_4',
    title: 'Long-Diagonal Battery Mate',
    theme: 'Queen + Bishop Mate in 1',
    sideToMove: 'w',
    fenBoard: 'r4rk1/ppp2p1p/4p3/6Q1/8/8/PBP2PPP/6K1',
    solutionFrom: 'g5',
    solutionTo: 'g7',
    hint: 'Your Bishop on b2 aims all the way to g7! Escort your Queen onto g7 for Checkmate.',
  },
  {
    id: 'dp_5',
    title: "Philidor's Smothered Mate",
    theme: 'Smothered Knight Checkmate',
    sideToMove: 'w',
    fenBoard: '6rk/6pp/7N/8/8/8/6PP/6K1',
    solutionFrom: 'h6',
    solutionTo: 'f7',
    hint: 'Black’s King is boxed in by its own Rook and pawns! Jump your Knight to f7.',
  },
  {
    id: 'dp_6',
    title: "Anastasia's File Mate",
    theme: 'Knight + Rook Mate in 1',
    sideToMove: 'w',
    fenBoard: '8/4N1pk/8/8/8/2R5/6PP/6K1',
    solutionFrom: 'c3',
    solutionTo: 'h3',
    hint: 'Your Knight on e7 seals off g8 and g6! Swing your Rook to the h-file for Checkmate.',
  },
  {
    id: 'dp_7',
    title: "Epaulette Shoulder Mate",
    theme: 'Queen Checkmate',
    sideToMove: 'w',
    fenBoard: '3rkr2/8/8/8/8/4Q3/6PP/6K1',
    solutionFrom: 'e3',
    solutionTo: 'e6',
    hint: 'Black’s own two Rooks block d8 and f8, and your Queen covers d7 and f7 from e6!',
  },
  {
    id: 'dp_8',
    title: 'Two-Bishop Corner Snare',
    theme: 'Two-Bishop Checkmate',
    sideToMove: 'w',
    fenBoard: '7k/5K2/8/8/4B3/8/3B4/8',
    solutionFrom: 'd2',
    solutionTo: 'c3',
    hint: 'Your King on f7 and Bishop on e4 seal every escape square — line up your second Bishop on c3!',
  },
  {
    id: 'dp_9',
    title: 'Double-Rook Ladder Mate',
    theme: 'Lawnmower Checkmate',
    sideToMove: 'w',
    fenBoard: '3k4/1R6/8/8/8/8/6PP/R5K1',
    solutionFrom: 'a1',
    solutionTo: 'a8',
    hint: 'Your Rook on b7 cuts off the entire 7th rank! Bring your a1 Rook up to the 8th rank.',
  },
  {
    id: 'dp_10',
    title: "Queen's Close-Quarters Mate",
    theme: 'King + Queen Endgame Mate',
    sideToMove: 'w',
    fenBoard: '4k3/8/4K3/8/8/1Q6/8/8',
    solutionFrom: 'b3',
    solutionTo: 'b8',
    hint: 'Your King on e6 controls d7, e7, and f7! Slide your Queen to the 8th rank for Checkmate.',
  },
  {
    id: 'dp_11',
    title: "Morphy's 1858 Opera Mate",
    theme: "Morphy's Opera Mate",
    sideToMove: 'w',
    fenBoard: '1n2kb1r/p4ppp/4q3/4p1B1/4P3/8/PPP2PPP/3R2K1',
    solutionFrom: 'd1',
    solutionTo: 'd8',
    hint: 'The famous finale of Paul Morphy’s 1858 Paris Opera game — your g5 Bishop guards d8!',
  },
  {
    id: 'dp_12',
    title: "Lolli's Pawn-Spear Mate",
    theme: 'Pawn + Queen Mate in 1',
    sideToMove: 'w',
    fenBoard: '6k1/5p1p/5PpQ/8/8/8/6PP/6K1',
    solutionFrom: 'h6',
    solutionTo: 'g7',
    hint: 'Your advanced pawn on f6 guards g7 — step your Queen right in front of the King on g7!',
  },
];

export function getTodayDailyPuzzle() {
  const todayStr = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < todayStr.length; i++) {
    hash = (hash * 31 + todayStr.charCodeAt(i)) >>> 0;
  }
  const idx = hash % DAILY_TACTICAL_PUZZLES.length;
  return { todayKey: todayStr, index: idx, puzzle: DAILY_TACTICAL_PUZZLES[idx] };
}

const DAILY_PUZZLE_STORAGE_KEY = 'chess_daily_puzzle_v1';
const LOCAL_CONQUEST_STORAGE_KEY = 'chess_bot_conquests_v1';
const LOCAL_ACCURACY_STORAGE_KEY = 'chess_best_accuracy_v1';
const LOCAL_FEED_STORAGE_KEY = 'chess_local_feed_v1';

export function readDailyPuzzleProgress(playerId = 'guest') {
  if (typeof window === 'undefined') return { solvedDates: [], streak: 0, solvedToday: false };
  try {
    const raw = JSON.parse(localStorage.getItem(DAILY_PUZZLE_STORAGE_KEY) || '{}');
    const rec = raw[playerId || 'guest'] || { solvedDates: [], streak: 0 };
    const todayKey = new Date().toISOString().slice(0, 10);
    return {
      solvedDates: Array.isArray(rec.solvedDates) ? rec.solvedDates : [],
      streak: Number(rec.streak || 0),
      solvedToday: Array.isArray(rec.solvedDates) && rec.solvedDates.includes(todayKey),
    };
  } catch {
    return { solvedDates: [], streak: 0, solvedToday: false };
  }
}

export function markDailyPuzzleSolved(playerId = 'guest') {
  if (typeof window === 'undefined') return { alreadySolved: false, streak: 1 };
  try {
    const key = playerId || 'guest';
    const raw = JSON.parse(localStorage.getItem(DAILY_PUZZLE_STORAGE_KEY) || '{}');
    const rec = raw[key] || { solvedDates: [], streak: 0 };
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);
    const yest = new Date(today.getTime() - 86400000).toISOString().slice(0, 10);

    const dates = Array.isArray(rec.solvedDates) ? rec.solvedDates : [];
    if (dates.includes(todayKey)) {
      return { alreadySolved: true, streak: Number(rec.streak || 1) };
    }
    const nextStreak = dates.includes(yest) ? Number(rec.streak || 0) + 1 : 1;
    dates.push(todayKey);
    raw[key] = { solvedDates: dates.slice(-90), streak: nextStreak };
    localStorage.setItem(DAILY_PUZZLE_STORAGE_KEY, JSON.stringify(raw));
    return { alreadySolved: false, streak: nextStreak };
  } catch {
    return { alreadySolved: false, streak: 1 };
  }
}

export function readLocalBotConquests() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CONQUEST_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function recordLocalBotConquest(playerId, botId, accuracyPct = null) {
  if (typeof window === 'undefined' || !botId) return false;
  try {
    const key = playerId || 'guest';
    const all = readLocalBotConquests();
    const map = all[key] || {};
    const isFirstTime = !map[botId];
    const prev = map[botId] || { wins: 0, bestAccuracy: 0, firstAt: Date.now() };
    prev.wins = (prev.wins || 0) + 1;
    if (accuracyPct && accuracyPct > (prev.bestAccuracy || 0)) {
      prev.bestAccuracy = accuracyPct;
    }
    map[botId] = prev;
    all[key] = map;
    localStorage.setItem(LOCAL_CONQUEST_STORAGE_KEY, JSON.stringify(all));
    return isFirstTime;
  } catch {
    return false;
  }
}

export function readLocalBestAccuracy() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ACCURACY_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function updateLocalBestAccuracy(playerId, accuracyPct) {
  if (typeof window === 'undefined' || typeof accuracyPct !== 'number') return;
  try {
    const key = playerId || 'guest';
    const all = readLocalBestAccuracy();
    const prev = Number(all[key] || 0);
    if (accuracyPct > prev) {
      all[key] = Math.round(accuracyPct);
      localStorage.setItem(LOCAL_ACCURACY_STORAGE_KEY, JSON.stringify(all));
    }
  } catch {}
}

export function readLocalClubFeed() {
  if (typeof window === 'undefined') return [];
  try {
    const arr = JSON.parse(localStorage.getItem(LOCAL_FEED_STORAGE_KEY) || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function appendLocalClubFeed(item) {
  if (typeof window === 'undefined' || !item) return;
  try {
    const arr = readLocalClubFeed();
    if (item.eventId && arr.some((x) => x.eventId === item.eventId)) return;
    arr.unshift({ ...item, createdAt: item.createdAt || Date.now() });
    localStorage.setItem(LOCAL_FEED_STORAGE_KEY, JSON.stringify(arr.slice(0, 60)));
  } catch {}
}

