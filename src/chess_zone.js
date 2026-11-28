/**
 * The History Portal Chess Club & House League Zone
 * Interactive module for Period 6 Thursdays
 */

import {
  HOUSES,
  SCORING_RULES,
  APPROVED_CHESS_CALLSIGNS,
  INITIAL_PLAYERS,
  INITIAL_MATCHES,
  INITIAL_KNOCKOUT_BRACKET,
  HISTORICAL_CHESS_SPOTLIGHTS,
  BETH_HARMON_PUZZLES,
  BEGINNER_ROOKIE_PUZZLES,
  BEGINNER_PIECES_GUIDE,
  BEGINNER_GOLDEN_RULES,
  HISTORICAL_CHESS_QUOTES,
} from './chess_data.js';

import {
  broadcastStateToCloud,
  startPupilRealtimeSync,
  renderCloudSyncStatusPill,
  getCloudSyncStatus,
  isAirgapModeActive,
  setAirgapMode,
  submitPracticeXpClaimToCloud,
  clearPracticeXpClaimsFromCloud,
  submitClubJoinRequestToCloud,
  clearClubJoinRequestsFromCloud,
} from './chess_realtime.js';
import { verifyStaffPasskeySync } from './engine/staff_auth.js';
import QRCode from 'qrcode';
import {
  createDefaultClubModesState,
  renderClubGameModesView,
  registerClubGameModeHandlers,
} from './chess_club_modes.js';
import {
  createDefaultVirtualChessState,
  renderVirtualChessView,
  registerVirtualChessHandlers,
} from './chess_play.js';
import {
  renderClubHighlightsFeedTab,
  renderBotRankingsAndConquestsTab,
  renderPlayerProfileModalHtml,
} from './chess_community.js';

export function isChessViewActive() {
  if (typeof window === 'undefined') return false;
  const currentView =
    (window.appStore && window.appStore.state && window.appStore.state.currentView) ||
    (window.state && window.state.currentView);
  if (currentView === 'chess') return true;

  if (typeof document !== 'undefined') {
    if (
      document.getElementById('chess-hub-root') ||
      document.getElementById('projector-whiteboard-root') ||
      document.getElementById('ko-fullscreen-arena') ||
      document.getElementById('club-modes-tv-fullscreen')
    ) {
      return true;
    }
  }

  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'chess') return true;
  } catch (e) {}

  return false;
}
window.isChessViewActive = isChessViewActive;

const STORAGE_KEY = 'history_chess_club_v5';
const ARCHIVE_KEY = 'history_chess_master_archive';
const BACKUP_KEY = 'history_chess_backup_snapshot';
const LEGACY_STORAGE_KEYS = [
  'history_chess_club_v5',
  'history_chess_master_archive',
  'history_chess_backup_snapshot',
  'chess_club_v4',
  'chess_club_v3',
  'chess_club_v2',
  'chess_club_v1',
];

// IndexedDB Multi-Layer Vault for Persistent Browser Storage
const IDB_NAME = 'HistoryChessDB';
const IDB_VERSION = 1;
const IDB_STORE = 'club_vault';

function getIndexedDB() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'id' });
        }
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = () => resolve(null);
    } catch (err) {
      resolve(null);
    }
  });
}

async function persistToIndexedDB(state) {
  try {
    const db = await getIndexedDB();
    if (!db) return;
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.put({
      id: 'active_state',
      timestamp: Date.now(),
      players: state.players,
      matches: state.matches,
      checkedInPlayerIds: state.checkedInPlayerIds,
      activePairings: state.activePairings || [],
      pairingsHistory: state.pairingsHistory || [],
      leagueTableViewMode: state.leagueTableViewMode || 'matrix',
      knockoutBracket: state.knockoutBracket,
    });
  } catch (err) {
    console.warn('IndexedDB write skipped:', err);
  }
}

async function loadFromIndexedDB() {
  try {
    const db = await getIndexedDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get('active_state');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

// Pupil Name Auto-Sanitiser: Guarantees "First Name + Last Initial" format (e.g. Leo B.)
export function sanitizePupilName(rawName) {
  if (!rawName || typeof rawName !== 'string') return '';
  const trimmed = rawName.trim().replace(/\s+/g, ' ');
  if (!trimmed) return '';

  const parts = trimmed.split(' ');
  const formatWord = (w) => {
    if (!w) return '';
    return w
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('-');
  };

  if (parts.length === 1) {
    return formatWord(parts[0]);
  }

  const firstName = formatWord(parts[0]);
  const lastPart = parts[parts.length - 1];

  // If last part is already an initial like "B" or "B."
  if (/^[A-Za-z]\.?$/.test(lastPart)) {
    return `${firstName} ${lastPart.charAt(0).toUpperCase()}.`;
  }

  // Full surname: convert to initial with dot (e.g. "Bartholomew" -> "B.")
  const surnameInitial = lastPart.charAt(0).toUpperCase();
  return `${firstName} ${surnameInitial}.`;
}
if (typeof window !== 'undefined') {
  window.sanitizePupilName = sanitizePupilName;
}

// Pupil Callsign & Handle Reference Registry (100% GDPR Anonymous)
export const DEFAULT_LOCAL_NAME_MAP = {
  p_1789653842949: 'Sir Francis Drake',
  p_1789653874979: 'Andreas Vesalius',
  p_1789653816754: 'Alexander Fleming',
  p_1789653887768: 'The Shuttle Diplomat',
  p_1789653828428: 'The Thomas Splint',
  p_1789653854856: 'Joseph Lister',
  p_1789653903667: 'The Tudor Spymaster',
  p_1789653983357: 'The Golden Stresemann',
  p_1789653925819: 'The White Rose',
  p_1789653972946: 'The RAMC Field Medic',
  p_1789653960520: 'William Harvey',
  p_1789653940195: 'The Bar Lev Defender',
  p_1791467946326: 'The Armada Fireship',
};

// Pupil Username Handles (@username)
export const PLAYER_USERNAMES = {
  p_1789653842949: 'FrancisDrake',
  p_1789653874979: 'AndreasVesalius',
  p_1789653816754: 'AlexanderFleming',
  p_1789653887768: 'ShuttleDiplomat',
  p_1789653828428: 'ThomasSplint',
  p_1789653854856: 'JosephLister',
  p_1789653903667: 'TudorSpymaster',
  p_1789653983357: 'GoldenStresemann',
  p_1789653925819: 'WhiteRose',
  p_1789653972946: 'RAMCFieldMedic',
  p_1789653960520: 'WilliamHarvey',
  p_1789653940195: 'BarLevDefender',
  p_1791467946326: 'ArmadaFireship',
};

export const CALLSIGN_MAP = {
  // Legacy rank/piece callsigns to Canonical Callsigns
  Grandmaster_01: 'Sir Francis Drake',
  Grandmaster_02: 'Andreas Vesalius',
  Grandmaster_04: 'The Shuttle Diplomat',
  Grandmaster_07: 'The Tudor Spymaster',
  Grandmaster_12: 'The Bar Lev Defender',
  Knight_04: 'The Shuttle Diplomat',
  Knight_09: 'The White Rose',
  Bishop_05: 'The Thomas Splint',
  Bishop_10: 'The RAMC Field Medic',
  Rook_03: 'Alexander Fleming',
  Rook_08: 'The Golden Stresemann',
  Pawn_06: 'Joseph Lister',
  Pawn_11: 'William Harvey',
  Knight_13: 'The Armada Fireship',
  'The Armada Fireship': 'The Armada Fireship',
  'Sir Francis Drake': 'Sir Francis Drake',
  'Andreas Vesalius': 'Andreas Vesalius',
  'Alexander Fleming': 'Alexander Fleming',
  'The Shuttle Diplomat': 'The Shuttle Diplomat',
  'The Thomas Splint': 'The Thomas Splint',
  'Joseph Lister': 'Joseph Lister',
  'The Tudor Spymaster': 'The Tudor Spymaster',
  'The Golden Stresemann': 'The Golden Stresemann',
  'The White Rose': 'The White Rose',
  'The RAMC Field Medic': 'The RAMC Field Medic',
  'William Harvey': 'William Harvey',
  'The Bar Lev Defender': 'The Bar Lev Defender',

  // Previous generation callsigns mapping to GCSE personas
  'The Iron Chancellor': 'The Golden Stresemann',
  'The Dreadnought Admiral': 'Sir Francis Drake',
  'The Black Prince': 'The Thomas Splint',
  'The Trafalgar Admiral': 'The Shuttle Diplomat',
  'The Viking Berserker': 'The Armada Fireship',
  'The Jutland Tactician': 'Andreas Vesalius',
  'The Ironside': 'Joseph Lister',
  "The Barons' Champion": 'The Bar Lev Defender',
  'The Mechanical Turk': 'William Harvey',
  'The Iron Duke': 'Alexander Fleming',
  'The Viking Jarl': 'The White Rose',
  'The Waterloo Grenadier': 'The RAMC Field Medic',
};
if (Array.isArray(APPROVED_CHESS_CALLSIGNS)) {
  APPROVED_CHESS_CALLSIGNS.forEach((cs) => {
    CALLSIGN_MAP[cs] = cs;
  });
}
export const CALLSIGN_TO_FIRST_NAME = CALLSIGN_MAP; // Backwards-compatible alias ensuring 100% GDPR anonymity

// Combinatorial Historical Naval Chess Themes
export const HOUSE_NICKNAME_THEMES = {
  victory: {
    titles: [
      'Admiral',
      'Captain',
      'Signal',
      'Trafalgar',
      'Quarterdeck',
      'Copenhagen',
      'Sovereign',
      'Temeraire',
      'Vanguard',
      'Royal',
      'Sea Lord',
      'Fleet',
    ],
    heroes: [
      'Nelson',
      'Collingwood',
      'Hardy',
      'Hood',
      'Hawke',
      'Victory',
      'Temeraire',
      'Trafalgar',
    ],
    roles: [
      'Knight',
      'Bishop',
      'Rook',
      'Tactician',
      'Gambit',
      'Striker',
      'Maestro',
      'Master',
      'Sentinel',
    ],
  },
  warrior: {
    titles: [
      'Iron',
      'Black',
      'Armoured',
      'Broadside',
      'Fortress',
      'Citadel',
      'Highland',
      'Heavy',
      'Victorian',
      'Ironclad',
      'Grenadier',
      'Wellington',
      'Royal',
    ],
    heroes: ['Duke', 'Prince', 'Warrior', 'Wellington', 'Cochrane', 'Ironclad', 'Fortress'],
    roles: [
      'Warrior',
      'Knight',
      'Rook',
      'King',
      'Bishop',
      'Sentinel',
      'Marshal',
      'Champion',
      'Guard',
    ],
  },
  dreadnought: {
    titles: [
      'Super',
      'Fearless',
      'Grand Fleet',
      'Battleship',
      'Jutland',
      'Turbine',
      'Scapa',
      'North Sea',
      'Dreadnought',
      'Iron Duke',
      'Heavy Fleet',
    ],
    heroes: ['Fisher', 'Jellicoe', 'Beatty', 'Dreadnought', 'Orion', 'Iron Duke', 'Warspite'],
    roles: [
      'Bishop',
      'Knight',
      'Rook',
      'Raider',
      'Tactician',
      'Maestro',
      'Captain',
      'Striker',
      'Commander',
    ],
  },
  invincible: {
    titles: [
      'Swift',
      'Lightning',
      'Battlecruiser',
      'Falkland',
      'Precision',
      'High-Speed',
      'Cruiser',
      'Fleet',
      'Invincible',
      'Tempest',
      'Phantom',
    ],
    heroes: ['Sturdee', 'Arbuthnot', 'Invincible', 'Inflexible', 'Indomitable', 'Lion'],
    roles: [
      'Battlecruiser',
      'Gambit',
      'Corsair',
      'Striker',
      'Rook',
      'Knight',
      'Bishop',
      'Maestro',
      'Scout',
    ],
  },
};

export function generateHouseThematicNickname(realName, houseId, existingNicknames = []) {
  if (!realName) return 'Player';
  const clean =
    typeof sanitizePupilName === 'function' ? sanitizePupilName(realName) : realName.trim();
  return clean || 'Player';
}

export function savePlayerRealName(playerId, realName) {
  if (typeof window === 'undefined') return;
  try {
    let localMap = {};
    const raw = localStorage.getItem('chess_local_roster_names');
    if (raw) localMap = JSON.parse(raw);
    localMap[playerId] = realName;
    localStorage.setItem('chess_local_roster_names', JSON.stringify(localMap));
  } catch (e) {}
}

export function hydratePlayerRealNames(players) {
  if (!Array.isArray(players)) return;
  let localMap = {};
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('chess_local_roster_names');
      if (raw) {
        localMap = JSON.parse(raw);
        // Automatically sanitize any legacy stored pupil names in local storage
        let changed = false;
        Object.keys(localMap).forEach((k) => {
          if (CALLSIGN_MAP[localMap[k]]) {
            localMap[k] = CALLSIGN_MAP[localMap[k]];
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem('chess_local_roster_names', JSON.stringify(localMap));
        }
      }
    } catch (e) {}
  }

  players.forEach((p) => {
    // 1. Resolve to GDPR-safe callsign & username
    const rawVal =
      DEFAULT_LOCAL_NAME_MAP[p.id] ||
      CALLSIGN_MAP[p.name] ||
      CALLSIGN_MAP[p.nickname] ||
      CALLSIGN_MAP[p.realName] ||
      CALLSIGN_MAP[localMap[p.id]] ||
      localMap[p.id] ||
      p.name ||
      p.nickname;

    const clean =
      CALLSIGN_MAP[rawVal] ||
      (p.isCallsign ? String(rawVal || '').trim() : typeof sanitizePupilName === 'function' ? sanitizePupilName(rawVal) : rawVal);
    if (p.isCallsign && clean) {
      CALLSIGN_MAP[clean] = clean;
    }
    p.realName = clean;
    p.name = clean;
    p.nickname = clean;
    p.username = PLAYER_USERNAMES[p.id] || clean.replace(/\s+/g, '');

    if (typeof p.byesReceived !== 'number') p.byesReceived = 0;
    if (typeof p.lastRoundBye !== 'boolean') p.lastRoundBye = false;
  });

  // Also migrate any active pairings if present in chessState
  if (typeof chessState !== 'undefined' && Array.isArray(chessState.activePairings)) {
    chessState.activePairings.forEach((pair) => {
      if (pair.white) {
        const wVal =
          DEFAULT_LOCAL_NAME_MAP[pair.white.id] ||
          CALLSIGN_MAP[pair.white.name] ||
          CALLSIGN_MAP[pair.white.nickname] ||
          CALLSIGN_MAP[localMap[pair.white.id]] ||
          pair.white.name;
        const wClean =
          CALLSIGN_MAP[wVal] ||
          (typeof sanitizePupilName === 'function' ? sanitizePupilName(wVal) : wVal);
        pair.white.name = wClean;
        pair.white.nickname = wClean;
        pair.white.realName = wClean;
        pair.white.username = PLAYER_USERNAMES[pair.white.id] || wClean.replace(/\s+/g, '');
      }
      if (pair.black) {
        const bVal =
          DEFAULT_LOCAL_NAME_MAP[pair.black.id] ||
          CALLSIGN_MAP[pair.black.name] ||
          CALLSIGN_MAP[pair.black.nickname] ||
          CALLSIGN_MAP[localMap[pair.black.id]] ||
          pair.black.name;
        const bClean =
          CALLSIGN_MAP[bVal] ||
          (typeof sanitizePupilName === 'function' ? sanitizePupilName(bVal) : bVal);
        pair.black.name = bClean;
        pair.black.nickname = bClean;
        pair.black.realName = bClean;
        pair.black.username = PLAYER_USERNAMES[pair.black.id] || bClean.replace(/\s+/g, '');
      }
    });
  }

  // Also migrate matches
  if (typeof chessState !== 'undefined' && Array.isArray(chessState.matches)) {
    chessState.matches.forEach((m) => {
      if (CALLSIGN_MAP[m.white]) m.white = CALLSIGN_MAP[m.white];
      if (CALLSIGN_MAP[m.black]) m.black = CALLSIGN_MAP[m.black];
    });
  }
}

export function getPlayerDisplayName(player, context = 'default') {
  if (!player) return 'Unknown Player';
  const name =
    DEFAULT_LOCAL_NAME_MAP[player.id] ||
    CALLSIGN_MAP[player.name] ||
    CALLSIGN_MAP[player.nickname] ||
    CALLSIGN_MAP[player.realName] ||
    player.name ||
    player.nickname;

  const clean =
    CALLSIGN_MAP[name] ||
    (typeof sanitizePupilName === 'function' ? sanitizePupilName(name) : name);
  const username = player.username || PLAYER_USERNAMES[player.id] || clean.replace(/\s+/g, '');

  if (context === 'table') {
    return `
      <div style="display: flex; flex-direction: column; gap: 2px;">
        <span style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">${clean}</span>
      </div>
    `;
  }
  if (context === 'podium') {
    return `
      <div style="font-size: 1.2rem; font-weight: 800; color: #0f172a; font-family: 'Playfair Display', serif;">${clean}</div>
    `;
  }
  return `<span style="font-weight: 700;">${clean}</span>`;
}

export function renderPlayerNameWithCallsign(player, context = 'default') {
  const inner = getPlayerDisplayName(player, context);
  if (player && player.id) {
    return `<span onclick="event.stopPropagation(); window.openChessPlayerProfile && window.openChessPlayerProfile('${player.id}')" title="Click to open Chess Profile Card" style="cursor: pointer; border-bottom: 1px dotted #94a3b8;">${inner}</span>`;
  }
  return inner;
}
if (typeof window !== 'undefined') {
  window.renderPlayerNameWithCallsign = renderPlayerNameWithCallsign;
}

export function getPlayerSelectLabel(player) {
  if (!player) return '';
  const h = HOUSES[player.house];
  const houseName = h ? h.name : player.house;
  const name =
    DEFAULT_LOCAL_NAME_MAP[player.id] ||
    CALLSIGN_TO_FIRST_NAME[player.name] ||
    CALLSIGN_TO_FIRST_NAME[player.nickname] ||
    player.realName ||
    player.name ||
    player.nickname;
  const clean = typeof sanitizePupilName === 'function' ? sanitizePupilName(name) : name;
  return `${clean} (${houseName} - Rtg ${player.rating})`;
}

// Concise, non-ambiguous short handle for compact match/bracket buttons (prevents "The Wins" / "Sir Wins")
export function getPlayerButtonShortName(playerOrName) {
  const raw =
    typeof playerOrName === 'string'
      ? playerOrName
      : (playerOrName && (playerOrName.name || playerOrName.nickname || playerOrName.realName)) ||
        'Player';
  const stripped = raw
    .trim()
    .replace(/^(?:The|Sir|Lord|Lady|Dame|Dr\.?|Admiral|General|Captain|Field Marshal)\s+/i, '')
    .trim();
  if (!stripped) return raw.trim() || 'Player';
  const words = stripped.split(/\s+/);
  // Keep "First L." pupil format intact (e.g. "Leo B.")
  if (words.length === 2 && /^[A-Za-z]\.?$/.test(words[1])) {
    return stripped;
  }
  // Concise 2-word handle for 3+ word callsigns (e.g. "Bar Lev Defender" -> "Bar Lev", "RAMC Field Medic" -> "RAMC Medic")
  if (words.length >= 3) {
    if (words[0].toUpperCase() === 'RAMC') return `RAMC ${words[words.length - 1]}`;
    return `${words[0]} ${words[1]}`;
  }
  // Shorten 2-word scholar/historical names so "[Name] Wins" always stays single-line on bracket buttons
  if (words.length === 2) {
    if (/^Golden$/i.test(words[0])) return words[1];
    if (/^(William|Joseph|Andreas|Alexander|Francis)$/i.test(words[0])) {
      return `${words[0].charAt(0)}. ${words[1]}`;
    }
    if (stripped.length > 14 && !/^(Thomas|White|Tudor)$/i.test(words[0])) {
      return words[0];
    }
  }
  return stripped;
}
if (typeof window !== 'undefined') {
  window.getPlayerButtonShortName = getPlayerButtonShortName;
}

// Helper: Inspect emergency recovery backup
function getBackupInfo() {
  try {
    const raw = localStorage.getItem(BACKUP_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && data.playerCount !== undefined) return data;
    return null;
  } catch (e) {
    return null;
  }
}

// Helper to detect initial user role (Safeguard: pupils on phones see read-only Pupil View)
function getInitialRole() {
  if (typeof window === 'undefined') return 'pupil';
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('role') === 'pupil' || params.get('preview') === 'pupil') {
      return 'pupil';
    }
    const teacherParam = (params.get('teacher') || '').toLowerCase();
    const passkeyParam = (params.get('passkey') || '').toLowerCase();
    const validUrlAuth =
      (teacherParam && verifyStaffPasskeySync(teacherParam)) ||
      (passkeyParam && verifyStaffPasskeySync(passkeyParam));
    if (params.get('role') === 'teacher' || validUrlAuth) {
      localStorage.setItem('history_chess_teacher_auth', 'true');
      return 'teacher';
    }
    if (localStorage.getItem('history_chess_teacher_auth') === 'true') {
      return 'teacher';
    }
    // Auto-authenticate teacher when developing locally
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      localStorage.setItem('history_chess_teacher_auth', 'true');
      return 'teacher';
    }
  } catch (e) {}
  return 'pupil';
}

// State container
let chessState = {
  players: [],
  matches: [],
  checkedInPlayerIds: [],
  activePairings: [],
  pairingsHistory: [],
  byesReceived: {},
  lastRoundByePlayerId: null,
  leagueTableViewMode: 'matrix', // 'matrix' | 'table'
  knockoutBracket: null,
  activeTab: 'play', // Clean 3-tab hub: 'play' | 'ladder' | 'modes' (plus sub-views)
  filterHouse: 'all', // 'all' | houseId
  userRole: getInitialRole(), // 'teacher' | 'pupil'
  quickDeskP1Id: '',
  quickDeskP2Id: '',
  showQuickDesk: false,
  showLadderAdminTools: false,
  airgapMode: isAirgapModeActive(), // Safe by default on school laptop
  projectorMode: false,
  isPupilPreview: false,
  currentPuzzleIdx: 0,
  puzzleCategory: 'grandmaster', // 'grandmaster' | 'beginner'
  showBethHarmonHint: false,
  showBethHarmonSolution: false,
  showStarterPuzzle: false,
  showAdminDropdown: false,
  showTeacherGuide: false,
  showAdjudicationModal: false,
  whiteboardMode: false,
  whiteboardFitMode: true,
  bracketFullscreen: false,
  bracketZoom: 100,
  bracketTierFilter: 'all',
  adjudicationCalc: { white: 0, black: 0 },
  autoRePairEnabled: true,
  sessionActive: false,
  sessionTimeRemaining: 600,
  roundTimerDuration: 600,
  roundTimerExpiredAlert: false,
  sessionTimerRunning: false,
  undoStack: [],
  clubModes: createDefaultClubModesState(),
  virtualChess: createDefaultVirtualChessState(),
  pendingXpClaims: [],
  processedXpClaimIds: [],
  pendingJoinRequests: [],
  processedJoinRequestIds: [],
  clubFeed: [],
  botStats: {},
  feedFilter: 'all',
  activePuzzleBoard: null,
  activePuzzleIndex: 0,
  selectedSquare: null,
  puzzleMoveStep: 0,
  puzzleStatus: 'idle',
  sandboxMode: false,
  puzzleFeedback: null,
};

const UNDO_STORAGE_KEY = 'history_chess_undo_stack_v1';
const MAX_UNDO_STEPS = 25;

function loadChessUndoStack() {
  if (typeof window === 'undefined' || !window.sessionStorage) return;
  try {
    const raw = window.sessionStorage.getItem(UNDO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        chessState.undoStack = parsed.slice(-MAX_UNDO_STEPS);
      }
    }
  } catch (e) {}
}

function persistChessUndoStack() {
  if (typeof window === 'undefined' || !window.sessionStorage) return;
  try {
    window.sessionStorage.setItem(
      UNDO_STORAGE_KEY,
      JSON.stringify((chessState.undoStack || []).slice(-MAX_UNDO_STEPS)),
    );
  } catch (e) {}
}

export function pushChessUndoSnapshot(label = 'Match result') {
  try {
    if (!Array.isArray(chessState.undoStack)) chessState.undoStack = [];
    const snapshot = JSON.parse(
      JSON.stringify({
        label,
        timestamp: Date.now(),
        players: chessState.players || [],
        matches: chessState.matches || [],
        checkedInPlayerIds: chessState.checkedInPlayerIds || [],
        activePairings: chessState.activePairings || [],
        knockoutBracket: chessState.knockoutBracket || null,
        clubModes: chessState.clubModes || null,
      }),
    );
    chessState.undoStack.push(snapshot);
    if (chessState.undoStack.length > MAX_UNDO_STEPS) {
      chessState.undoStack = chessState.undoStack.slice(-MAX_UNDO_STEPS);
    }
    persistChessUndoStack();
  } catch (err) {
    console.warn('Undo snapshot skipped:', err);
  }
}

export function getLastUndoLabel() {
  if (!Array.isArray(chessState.undoStack) || chessState.undoStack.length === 0) return '';
  return chessState.undoStack[chessState.undoStack.length - 1]?.label || 'Last action';
}

export function playTournamentBellChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [
      { freq: 659.25, start: 0, dur: 0.35 },
      { freq: 783.99, start: 0.22, dur: 0.35 },
      { freq: 1046.5, start: 0.45, dur: 0.75 },
    ];
    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    });
  } catch (e) {}
}

// Timer State Map for Historical Drills
const drillTimers = {};

// Toast feedback system — Single non-blocking bottom-center pill (never stacks over right-hand TV buttons or chessboards!)
export function showChessToast(message, type = 'success') {
  let toastCont = document.getElementById('chess-toast-container');
  if (!toastCont) {
    toastCont = document.createElement('div');
    toastCont.id = 'chess-toast-container';
    toastCont.style.cssText =
      'position: fixed; bottom: 18px; left: 50%; transform: translateX(-50%); z-index: 100000; display: flex; flex-direction: column; align-items: center; gap: 6px; pointer-events: none;';
    document.body.appendChild(toastCont);
  }

  // Clear previous toasts immediately so rapid classroom taps never pile up on screen
  toastCont.innerHTML = '';

  const toast = document.createElement('div');
  const bg =
    type === 'success'
      ? '#059669'
      : type === 'warning'
        ? '#d97706'
        : type === 'error'
          ? '#dc2626'
          : '#0284c7';
  const icon =
    type === 'success'
      ? 'fa-circle-check'
      : type === 'warning'
        ? 'fa-triangle-exclamation'
        : type === 'error'
          ? 'fa-circle-xmark'
          : 'fa-circle-info';

  toast.style.cssText = `
    background: ${bg};
    color: #ffffff;
    padding: 9px 20px;
    border-radius: 999px;
    border: 1.5px solid rgba(255,255,255,0.35);
    font-size: 0.88rem;
    font-weight: 800;
    box-shadow: 0 8px 22px rgba(0,0,0,0.32);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    pointer-events: none;
    max-width: min(90vw, 620px);
    font-family: 'Outfit', sans-serif;
  `;
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  toastCont.appendChild(toast);

  if (window.__chessToastTimer) clearTimeout(window.__chessToastTimer);
  window.__chessToastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.25s ease';
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 260);
  }, 2100);
}
window.showChessToast = showChessToast;

// Global Session & Tournament Round Clock Ticker
if (typeof window !== 'undefined' && !window.__historySessionInterval) {
  window.__historySessionInterval = setInterval(() => {
    // Hard Guardrail: NEVER tick down unless chess hub is active
    if (!isChessViewActive()) return;

    if (
      chessState &&
      chessState.sessionTimerRunning &&
      typeof chessState.sessionTimeRemaining === 'number' &&
      chessState.sessionTimeRemaining > 0
    ) {
      chessState.sessionTimeRemaining--;
      const m = Math.floor(chessState.sessionTimeRemaining / 60);
      const s = chessState.sessionTimeRemaining % 60;
      const formatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      const isUrgent = chessState.sessionTimeRemaining <= 120;

      const clockEl = document.getElementById('whiteboard-session-clock');
      if (clockEl) {
        clockEl.textContent = formatted;
        clockEl.style.color = isUrgent ? '#f87171' : '#4ade80';
        clockEl.style.textShadow = isUrgent
          ? '0 0 20px rgba(248, 113, 113, 0.6)'
          : '0 0 20px rgba(74, 222, 128, 0.4)';
      }

      document.querySelectorAll('.chess-live-round-clock').forEach((el) => {
        el.textContent = formatted;
        const isDarkBg = el.getAttribute('data-dark') === 'true';
        if (chessState.sessionTimeRemaining === 0) {
          el.style.color = '#ef4444';
        } else if (isUrgent) {
          el.style.color = isDarkBg ? '#fbbf24' : '#dc2626';
        } else {
          el.style.color = isDarkBg ? '#4ade80' : '#0f172a';
        }
      });

      if (chessState.sessionTimeRemaining === 0) {
        chessState.sessionTimerRunning = false;
        chessState.roundTimerExpiredAlert = true;
        playTournamentBellChime();
        saveChessState();
        renderChessHubView();
        showChessToast(
          '⏰ Round Time Up! Hands off pieces — score finished boards or count piece points!',
          'warning',
        );
      }
    }
  }, 1000);
}

// ==========================================================
// Assembly Presentation Slide Quotes (Grandmaster & Strategy Wisdom)
// Only visible inside the Friday Assembly Presentation Slide modal
// ==========================================================
window.__currentHistoricalQuoteIndex = 0;

window.getRandomHistoricalQuote = function () {
  if (!Array.isArray(HISTORICAL_CHESS_QUOTES) || HISTORICAL_CHESS_QUOTES.length === 0) {
    return {
      quote: 'When you see a good move, look for a better one.',
      figure: 'Emanuel Lasker',
      era: 'World Champion 1894–1921',
    };
  }
  return HISTORICAL_CHESS_QUOTES[
    window.__currentHistoricalQuoteIndex % HISTORICAL_CHESS_QUOTES.length
  ];
};

window.cycleAssemblyQuote = function () {
  if (!Array.isArray(HISTORICAL_CHESS_QUOTES) || HISTORICAL_CHESS_QUOTES.length === 0) return;
  window.__currentHistoricalQuoteIndex =
    (window.__currentHistoricalQuoteIndex + 1) % HISTORICAL_CHESS_QUOTES.length;
  const q = HISTORICAL_CHESS_QUOTES[window.__currentHistoricalQuoteIndex];

  const slideQuoteText = document.getElementById('assembly-slide-quote-text');
  const slideQuoteAuthor = document.getElementById('assembly-slide-quote-author');
  if (slideQuoteText) {
    slideQuoteText.textContent = `“${q.quote}”`;
  }
  if (slideQuoteAuthor) {
    slideQuoteAuthor.textContent = `— ${q.figure} (${q.era})`;
  }
};
window.cycleHistoricalQuote = window.cycleAssemblyQuote;

// Global Keyboard Shortcut for Whiteboard Mode ('W' or 'Esc')
if (typeof window !== 'undefined' && !window.__historyKeydownBound) {
  window.__historyKeydownBound = true;
  window.addEventListener('keydown', (e) => {
    const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    const isChessActive =
      document.getElementById('chess-hub-root') ||
      document.getElementById('ko-fullscreen-arena') ||
      document.getElementById('club-modes-tv-fullscreen') ||
      (window.state && window.state.currentView === 'chess') ||
      (window.appStore && window.appStore.state && window.appStore.state.currentView === 'chess');
    if (!isChessActive) return;

    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
      if (chessState && chessState.userRole === 'teacher' && typeof window.undoTournamentAction === 'function') {
        e.preventDefault();
        window.undoTournamentAction();
      }
      return;
    }

    if (e.key === 'Escape') {
      const openModal = document.getElementById('chess-modal-container');
      if (openModal && openModal.innerHTML.trim() !== '') {
        if (typeof window.closeChessModal === 'function') window.closeChessModal();
        return;
      }
      if (chessState && chessState.showAdjudicationModal) {
        chessState.showAdjudicationModal = false;
        renderChessHubView();
        return;
      }
      if (chessState && chessState.bracketFullscreen) {
        if (typeof window.toggleBracketFullscreen === 'function') {
          window.toggleBracketFullscreen(false);
        }
        return;
      }
      if (chessState && chessState.clubModes && chessState.clubModes.tvFullscreen) {
        if (typeof window.toggleClubModesFullscreen === 'function') {
          window.toggleClubModesFullscreen(false);
        }
        return;
      }
    }

    if (
      (e.key === 'f' || e.key === 'F') &&
      chessState &&
      (chessState.activeTab === 'knockout' || chessState.bracketFullscreen) &&
      chessState.knockoutBracket
    ) {
      if (typeof window.toggleBracketFullscreen === 'function') {
        window.toggleBracketFullscreen();
      }
      return;
    }

    if (
      chessState &&
      (chessState.activeTab === 'knockout' || chessState.bracketFullscreen) &&
      chessState.knockoutBracket &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      if (e.key === '+' || e.key === '=') {
        if (typeof window.adjustBracketZoom === 'function') window.adjustBracketZoom(10);
        return;
      } else if (e.key === '-' || e.key === '_') {
        if (typeof window.adjustBracketZoom === 'function') window.adjustBracketZoom(-10);
        return;
      } else if (e.key === '0') {
        if (typeof window.setBracketZoom === 'function') window.setBracketZoom(100);
        return;
      }
    }

    if (e.key === 'w' || e.key === 'W') {
      if (typeof window.toggleChessWhiteboardMode === 'function') {
        window.toggleChessWhiteboardMode();
      }
    } else if (e.key === 'Escape' && chessState && chessState.whiteboardMode) {
      if (chessState.showAdjudicationModal) {
        chessState.showAdjudicationModal = false;
        renderChessHubView();
        return;
      }
      if (typeof window.toggleChessWhiteboardMode === 'function') {
        window.toggleChessWhiteboardMode(false);
      }
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && chessState && chessState.bracketFullscreen && chessState.__nativeFsRequested) {
      chessState.__nativeFsRequested = false;
      chessState.bracketFullscreen = false;
      if (isChessViewActive()) renderChessHubView();
    }
  });
}

// Initialize State from localStorage, legacy keys, seed, or IndexedDB
function initChessState(forceClean = false) {
  if (forceClean) {
    chessState.players = [];
    chessState.matches = [];
    chessState.checkedInPlayerIds = [];
    chessState.knockoutBracket = null;
    chessState.activeTab = 'ladder';
    saveChessState(true);
    return;
  }

  let loaded = false;
  if (!Array.isArray(chessState.undoStack) || chessState.undoStack.length === 0) {
    loadChessUndoStack();
  }

  // 0. 1-Click URL Sync Key Auto-Importer (?chess_sync=...)
  if (typeof window !== 'undefined' && window.location.search) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const syncParam = urlParams.get('chess_sync');
      if (syncParam) {
        let b64 = syncParam.trim();
        if (b64.startsWith('HISTORY-CHESS:')) b64 = b64.replace('HISTORY-CHESS:', '');
        if (b64.startsWith('CHESS-SYNC:')) b64 = b64.replace('CHESS-SYNC:', '');
        const jsonStr = decodeURIComponent(atob(b64));
        const syncData = JSON.parse(jsonStr);
        if (Array.isArray(syncData.players) && syncData.players.length > 0) {
          if (syncData.realNames && typeof syncData.realNames === 'object') {
            try {
              localStorage.setItem('chess_local_roster_names', JSON.stringify(syncData.realNames));
            } catch (e) {}
          }
          chessState.players = syncData.players;
          chessState.matches = Array.isArray(syncData.matches) ? syncData.matches : [];
          chessState.checkedInPlayerIds = Array.isArray(syncData.checkedInPlayerIds)
            ? syncData.checkedInPlayerIds
            : [];
          chessState.activePairings = Array.isArray(syncData.activePairings)
            ? syncData.activePairings
            : [];
          chessState.knockoutBracket = syncData.knockoutBracket || null;
          loaded = true;
          saveChessState(true);
          const cleanUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, cleanUrl);
          setTimeout(() => {
            showChessToast(
              `🎉 Loaded ${chessState.players.length} pupils & tournament progress via Sync Link!`,
              'success',
            );
          }, 400);
        }
      }
    } catch (err) {
      console.warn('URL sync param decode error:', err);
    }
  }

  // 1. Primary check: STORAGE_KEY
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.players) && parsed.players.length > 0) {
        const seedGamesSum = Array.isArray(INITIAL_PLAYERS)
          ? INITIAL_PLAYERS.reduce((s, p) => s + (p.games || 0), 0)
          : 0;
        const parsedGamesSum = parsed.players.reduce((s, p) => s + (p.games || 0), 0);
        const shouldUpgradeFromSeed =
          Array.isArray(INITIAL_MATCHES) &&
          (INITIAL_MATCHES.length > (parsed.matches?.length || 0) ||
            (INITIAL_MATCHES.length === (parsed.matches?.length || 0) &&
              seedGamesSum > parsedGamesSum));

        if (shouldUpgradeFromSeed) {
          chessState.players = JSON.parse(JSON.stringify(INITIAL_PLAYERS));
          chessState.matches = JSON.parse(JSON.stringify(INITIAL_MATCHES));
          chessState.checkedInPlayerIds = chessState.players.map((p) => p.id);
        } else {
          chessState.players = parsed.players;
          chessState.matches = Array.isArray(parsed.matches) ? parsed.matches : [];
          chessState.checkedInPlayerIds = Array.isArray(parsed.checkedInPlayerIds)
            ? parsed.checkedInPlayerIds
            : [];
        }
        chessState.activePairings = Array.isArray(parsed.activePairings)
          ? parsed.activePairings
          : [];
        chessState.pairingsHistory = Array.isArray(parsed.pairingsHistory)
          ? parsed.pairingsHistory
          : [];
        if (parsed.leagueTableViewMode) chessState.leagueTableViewMode = parsed.leagueTableViewMode;
        chessState.knockoutBracket = shouldUpgradeFromSeed
          ? INITIAL_KNOCKOUT_BRACKET
            ? JSON.parse(JSON.stringify(INITIAL_KNOCKOUT_BRACKET))
            : parsed.knockoutBracket || null
          : parsed.knockoutBracket ||
            (INITIAL_KNOCKOUT_BRACKET ? JSON.parse(JSON.stringify(INITIAL_KNOCKOUT_BRACKET)) : null);
        if (!chessState.__clubModesHydrated && parsed.clubModes && typeof parsed.clubModes === 'object') {
          chessState.clubModes = {
            ...createDefaultClubModesState(),
            ...parsed.clubModes,
            tvFullscreen: Boolean(chessState.clubModes?.tvFullscreen),
          };
          chessState.__clubModesHydrated = true;
        }
        if (parsed.autoRePairEnabled !== undefined)
          chessState.autoRePairEnabled = parsed.autoRePairEnabled;
        if (parsed.sessionActive !== undefined) chessState.sessionActive = parsed.sessionActive;
        if (typeof parsed.sessionTimeRemaining === 'number')
          chessState.sessionTimeRemaining = parsed.sessionTimeRemaining;
        loaded = true;
        if (shouldUpgradeFromSeed) {
          setTimeout(() => saveChessState(), 0);
        }
      }
    }
  } catch (e) {
    console.error('Error loading primary chess state:', e);
  }

  // 2. Legacy Auto-Rescue Check if primary is empty!
  if (!loaded) {
    for (const key of LEGACY_STORAGE_KEYS) {
      if (key === STORAGE_KEY) continue;
      try {
        const legacyRaw = localStorage.getItem(key);
        if (legacyRaw) {
          const legacyData = JSON.parse(legacyRaw);
          const candidateState = legacyData.state || legacyData;
          if (Array.isArray(candidateState.players) && candidateState.players.length > 0) {
            chessState.players = candidateState.players;
            chessState.matches = Array.isArray(candidateState.matches)
              ? candidateState.matches
              : [];
            chessState.checkedInPlayerIds = Array.isArray(candidateState.checkedInPlayerIds)
              ? candidateState.checkedInPlayerIds
              : [];
            chessState.knockoutBracket = candidateState.knockoutBracket || null;
            loaded = true;
            console.log(
              `🛡️ Auto-rescued ${candidateState.players.length} pupils from legacy key: ${key}`,
            );
            saveChessState(); // Immediately mirror into v5 & master archive!
            showChessToast(
              `🛡️ Auto-recovered ${candidateState.players.length} pupils from backup storage!`,
              'success',
            );
            break;
          }
        }
      } catch (err) {}
    }
  }

  // 3. Fallback to INITIAL_PLAYERS from chess_data.js if available
  if (!loaded && Array.isArray(INITIAL_PLAYERS) && INITIAL_PLAYERS.length > 0) {
    chessState.players = JSON.parse(JSON.stringify(INITIAL_PLAYERS));
    chessState.matches = Array.isArray(INITIAL_MATCHES)
      ? JSON.parse(JSON.stringify(INITIAL_MATCHES))
      : [];
    chessState.checkedInPlayerIds = chessState.players.map((p) => p.id);
    chessState.knockoutBracket = INITIAL_KNOCKOUT_BRACKET
      ? JSON.parse(JSON.stringify(INITIAL_KNOCKOUT_BRACKET))
      : null;
    loaded = true;
    saveChessState();
  }

  // Ensure all 13 canonical players from INITIAL_PLAYERS are present in chessState.players
  if (Array.isArray(INITIAL_PLAYERS) && INITIAL_PLAYERS.length > 0) {
    let addedCount = 0;
    for (const initP of INITIAL_PLAYERS) {
      if (!chessState.players.some((p) => p.id === initP.id)) {
        chessState.players.push(JSON.parse(JSON.stringify(initP)));
        addedCount++;
      }
    }
    if (addedCount > 0) {
      chessState.checkedInPlayerIds = chessState.players.map((p) => p.id);
      saveChessState();
    }
  }

  // Hydrate real names and nicknames for all active players
  hydratePlayerRealNames(chessState.players);

  // Auto-sort active roster strictly by points (largest to smallest) on load
  autoSortPlayersByPoints();

  // Auto-heal / reconcile any active knockout tournament bracket (including R1 bye -> Plate routing)
  if (chessState.knockoutBracket && typeof reconcileKnockoutProgression === 'function') {
    reconcileKnockoutProgression(chessState.knockoutBracket);
  }

  // 4. Fallback check from IndexedDB offline database if still empty
  if (!loaded && typeof window !== 'undefined') {
    loadFromIndexedDB().then((idbData) => {
      if (
        idbData &&
        Array.isArray(idbData.players) &&
        idbData.players.length > 0 &&
        chessState.players.length === 0
      ) {
        chessState.players = idbData.players;
        chessState.matches = idbData.matches || [];
        chessState.checkedInPlayerIds = idbData.checkedInPlayerIds || [];
        chessState.knockoutBracket = idbData.knockoutBracket || null;
        autoSortPlayersByPoints();
        saveChessState();
        renderChessHubView();
        showChessToast(
          `🛡️ Auto-recovered ${idbData.players.length} pupils from offline IndexedDB vault!`,
          'success',
        );
      }
    });
  }

  // 4. Start Live Cloud Sync listener for pupil and spectator devices
  if (typeof window !== 'undefined' && !window.__chessSyncListenerStarted) {
    window.__chessSyncListenerStarted = true;
    startPupilRealtimeSync((remoteData) => {
      // Sync incoming Pupil Practice XP claims & Club Join Requests for Teacher 1-click approval
      let xpInboxChanged = false;
      if (remoteData && Array.isArray(remoteData.pendingXpClaims)) {
        const seen = new Set(chessState.processedXpClaimIds || []);
        const filteredClaims = remoteData.pendingXpClaims.filter((c) => c && !seen.has(c.claimId));
        if (filteredClaims.length !== (chessState.pendingXpClaims || []).length) {
          chessState.pendingXpClaims = filteredClaims;
          xpInboxChanged = true;
        }
      }
      if (remoteData && Array.isArray(remoteData.pendingJoinRequests)) {
        const seenJoin = new Set(chessState.processedJoinRequestIds || []);
        const filteredJoin = remoteData.pendingJoinRequests.filter(
          (r) => r && !seenJoin.has(r.requestId),
        );
        if (filteredJoin.length !== (chessState.pendingJoinRequests || []).length) {
          chessState.pendingJoinRequests = filteredJoin;
          xpInboxChanged = true;
        }
      }
      if (remoteData && Array.isArray(remoteData.clubFeed)) {
        chessState.clubFeed = remoteData.clubFeed;
      }
      if (remoteData && remoteData.botStats && typeof remoteData.botStats === 'object') {
        chessState.botStats = remoteData.botStats;
      }

      // Apply remote data updates ONLY when cloud actually has newer standings/matches
      const hasRemoteStandings =
        remoteData &&
        ((remoteData.syncedAt && remoteData.syncedAt > (chessState.timestamp || 0)) ||
          (Array.isArray(remoteData.matches) &&
            remoteData.matches.length > (chessState.matches?.length || 0)));

      if (hasRemoteStandings) {
        if (Array.isArray(remoteData.players) && remoteData.players.length > 0) {
          chessState.players = remoteData.players;
        }
        if (Array.isArray(remoteData.matches)) {
          chessState.matches = remoteData.matches;
        }
        if (Array.isArray(remoteData.activePairings)) {
          chessState.activePairings = remoteData.activePairings;
        }
        if (Array.isArray(remoteData.checkedInPlayerIds)) {
          chessState.checkedInPlayerIds = remoteData.checkedInPlayerIds;
        }
        if (typeof remoteData.sessionTimeRemaining === 'number') {
          chessState.sessionTimeRemaining = remoteData.sessionTimeRemaining;
        }
        if (remoteData.knockoutBracket !== undefined) {
          chessState.knockoutBracket = remoteData.knockoutBracket;
        }
        if (remoteData.syncedAt) {
          chessState.timestamp = remoteData.syncedAt;
        }
        if (chessState.userRole === 'teacher') {
          saveChessState();
        }
        // Hard Guardrail: NEVER hijack view if user is on another page or mid-chess-game on 'play' tab
        if (isChessViewActive()) {
          const onPlayTab = (chessState.activeTab || 'play') === 'play';
          if (!onPlayTab) {
            renderChessHubView();
          }
          showChessToast(
            chessState.userRole === 'teacher'
              ? '☁️ Live standings synced from cloud!'
              : '⚡ Live club standings updated!',
            'info',
          );
        }
      } else if (xpInboxChanged && chessState.userRole === 'teacher' && isChessViewActive()) {
        renderChessHubView();
      }
    });
  }
}

function saveChessState(isIntentionalReset = false) {
  const payload = {
    timestamp: Date.now(),
    players: chessState.players,
    matches: chessState.matches,
    checkedInPlayerIds: chessState.checkedInPlayerIds,
    activePairings: chessState.activePairings || [],
    pairingsHistory: (chessState.pairingsHistory || []).slice(-10),
    leagueTableViewMode: chessState.leagueTableViewMode || 'matrix',
    knockoutBracket: chessState.knockoutBracket,
    clubModes: chessState.clubModes
      ? { ...chessState.clubModes, tvFullscreen: false, chaosSpinning: false }
      : null,
    autoRePairEnabled: chessState.autoRePairEnabled,
    sessionActive: chessState.sessionActive,
    sessionTimeRemaining: chessState.sessionTimeRemaining,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    // Guard master archive: only write to archive if there are pupils, or if explicitly intentional
    if (chessState.players.length > 0 || isIntentionalReset) {
      localStorage.setItem(ARCHIVE_KEY, JSON.stringify(payload));
    }
  } catch (e) {
    console.error('Error saving chess state to localStorage:', e);
  }

  // Mirror to IndexedDB asynchronously
  persistToIndexedDB(payload);

  // Broadcast state to live cloud room for pupil devices if in teacher mode and not in Airgap mode
  if (chessState.userRole === 'teacher' && !chessState.isPupilPreview && !isAirgapModeActive()) {
    broadcastStateToCloud(chessState);
  }
}

// Helper: Calculate total individual pupil points consistently across all views
export function calculatePlayerPoints(p) {
  if (!p) return 0;
  const wins = p.won || 0;
  const draws = p.drawn || 0;
  const losses = p.lost || 0;
  const byes = p.byesReceived || 0;
  const bonus = p.bonusPoints || 0;
  return (
    wins * SCORING_RULES.WIN +
    draws * SCORING_RULES.DRAW +
    (losses + byes) * SCORING_RULES.PARTICIPATION +
    bonus
  );
}

// Auto-Sort Pupils by Total Points (Largest to Smallest)
export function autoSortPlayersByPoints() {
  if (!chessState.players || chessState.players.length === 0) return;
  chessState.players.sort((a, b) => {
    const ptsA = calculatePlayerPoints(a);
    const ptsB = calculatePlayerPoints(b);
    if (ptsB !== ptsA) return ptsB - ptsA; // Largest points first
    if ((b.rating || 1000) !== (a.rating || 1000)) return (b.rating || 1000) - (a.rating || 1000); // Higher Elo
    if ((b.won || 0) !== (a.won || 0)) return (b.won || 0) - (a.won || 0); // More wins
    return (a.name || '').localeCompare(b.name || '');
  });
  chessState.players.forEach((p, idx) => {
    p.rank = idx + 1;
  });
}

// Calculate House Totals dynamically
function calculateHouseTotals() {
  const totals = {
    victory: { id: 'victory', points: 0, games: 0, wins: 0, draws: 0, losses: 0, playersCount: 0 },
    warrior: { id: 'warrior', points: 0, games: 0, wins: 0, draws: 0, losses: 0, playersCount: 0 },
    dreadnought: {
      id: 'dreadnought',
      points: 0,
      games: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      playersCount: 0,
    },
    invincible: {
      id: 'invincible',
      points: 0,
      games: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      playersCount: 0,
    },
  };

  chessState.players.forEach((p) => {
    if (totals[p.house]) totals[p.house].playersCount++;
  });

  chessState.matches.forEach((m) => {
    const wH = m.whiteHouse;
    const bH = m.blackHouse;

    if (m.result === '1-0') {
      if (totals[wH]) {
        totals[wH].points += SCORING_RULES.WIN;
        totals[wH].wins++;
        totals[wH].games++;
      }
      if (totals[bH]) {
        totals[bH].points += SCORING_RULES.PARTICIPATION;
        totals[bH].losses++;
        totals[bH].games++;
      }
    } else if (m.result === '0-1') {
      if (totals[bH]) {
        totals[bH].points += SCORING_RULES.WIN;
        totals[bH].wins++;
        totals[bH].games++;
      }
      if (totals[wH]) {
        totals[wH].points += SCORING_RULES.PARTICIPATION;
        totals[wH].losses++;
        totals[wH].games++;
      }
    } else if (m.result === '1/2-1/2' || m.result === '½-½') {
      if (totals[wH]) {
        totals[wH].points += SCORING_RULES.DRAW;
        totals[wH].draws++;
        totals[wH].games++;
      }
      if (totals[bH]) {
        totals[bH].points += SCORING_RULES.DRAW;
        totals[bH].draws++;
        totals[bH].games++;
      }
    } else if (m.result === 'BONUS') {
      if (totals[wH]) {
        totals[wH].points += Number(m.bonusPoints || 0);
      }
    }
  });

  // Also credit byes as participation points to house totals
  chessState.players.forEach((p) => {
    if (p.byesReceived && totals[p.house]) {
      totals[p.house].points += p.byesReceived * SCORING_RULES.PARTICIPATION;
    }
  });

  return totals;
}

// Main View Renderer
export function renderChessHubView() {
  // Hard Guardrail: NEVER overwrite the active DOM view unless the user is intentionally on the Chess Club view!
  if (!isChessViewActive()) {
    return;
  }

  initChessState();

  const container = document.getElementById('main-content');
  if (!container) return;
  container.style.paddingTop = '10px';

  const houseTotals = calculateHouseTotals();
  const sortedHouses = Object.values(houseTotals).sort((a, b) => b.points - a.points);
  const leadingHouse = HOUSES[sortedHouses[0].id];

  // Individual Leader (Rank 1 on ladder or highest points)
  const sortedByPoints = [...chessState.players].sort((a, b) => {
    const ptsA = calculatePlayerPoints(a);
    const ptsB = calculatePlayerPoints(b);
    if (ptsB !== ptsA) return ptsB - ptsA;
    return (a.rank || 99) - (b.rank || 99);
  });
  const individualLeader = chessState.players.find((p) => p.rank === 1) || sortedByPoints[0];
  const individualLeaderPts = individualLeader ? calculatePlayerPoints(individualLeader) : 0;

  // Full-Screen Tournament Bracket Arena
  if (chessState.bracketFullscreen && chessState.knockoutBracket) {
    container.innerHTML = renderKnockoutFullscreenArena(sortedHouses);
    return;
  }

  // Full-Screen TV Club Game Modes Arena
  if (chessState.clubModes && chessState.clubModes.tvFullscreen) {
    container.innerHTML = renderClubGameModesView(chessState, {
      getPlayerButtonShortName,
      sortedHouses,
    });
    return;
  }

  // Whiteboard Projector Mode View (Clean, High-Contrast Classroom Display)
  if (chessState.whiteboardMode) {
    container.innerHTML = renderWhiteboardModeView(sortedHouses);
    return;
  }

  // Filtering players for display
  let filteredPlayers = [...chessState.players];
  // Year filter removed for GDPR compliance
  if (chessState.filterHouse !== 'all') {
    filteredPlayers = filteredPlayers.filter((p) => p.house === chessState.filterHouse);
  }
  filteredPlayers.sort((a, b) => a.rank - b.rank);

  // In Pupil View, prevent teacher-only administration tabs from showing
  if (
    chessState.userRole === 'pupil' &&
    (chessState.activeTab === 'signin' || chessState.activeTab === 'quickdesk')
  ) {
    chessState.activeTab = 'ladder';
  }

  const currentTab = chessState.activeTab || 'play';
  const isFeedGroup = currentTab === 'feed';
  const isLadderGroup =
    currentTab === 'ladder' ||
    currentTab === 'bots' ||
    currentTab === 'pairings' ||
    currentTab === 'table';
  const isModesGroup =
    currentTab === 'modes' ||
    currentTab === 'knockout' ||
    currentTab === 'beginners' ||
    currentTab === 'drills';
  const isPlayGroup = !isFeedGroup && !isLadderGroup && !isModesGroup;
  const activePairingsCount = (chessState.activePairings || []).filter((p) => !p.isBye).length;

  const isFirstChessMount = !document.getElementById('chess-hub-root');

  let html = `
    <div id="chess-hub-root" style="max-width: 1140px; width: 100%; box-sizing: border-box; margin: 0 auto; padding: 0 12px 24px 12px; ${isFirstChessMount ? 'animation: fadeInUp 0.2s ease-out;' : ''} font-family: 'Outfit', sans-serif;">
      
      ${
        chessState.isPupilPreview
          ? `
        <!-- Pupil Preview Top Banner -->
        <div style="background: #1e3a8a; color: #bfdbfe; border: 1.5px solid #3b82f6; padding: 6px 12px; font-size: 0.75rem; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); flex-wrap: wrap; gap: 6px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 0.9rem;">👁</span>
            <span><strong>Pupil Preview Mode:</strong> Viewing as pupils see it.</span>
          </div>
          <button onclick="window.exitPupilPreview()" style="background: #3b82f6; color: #ffffff; border: none; font-weight: 700; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 0.74rem;">
            Return to Teacher Mode
          </button>
        </div>
      `
          : ''
      }

      <!-- Calm Single-Row Header: Title + House Standings + Discrete Staff Drawer Toggle -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 14px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; box-shadow: 0 1px 4px rgba(15, 23, 42, 0.03);">
        
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; border-radius: 9px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #fbbf24; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;">
            ♟️
          </div>
          <div>
            <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; margin: 0; color: #0f172a; font-weight: 800; line-height: 1.15;">
              Chess
            </h1>
            <div style="font-size: 0.68rem; color: #64748b; font-weight: 700; letter-spacing: 0.03em;">
              House Strategy League &amp; Virtual Board
            </div>
          </div>
        </div>

        <!-- House Score Pills -->
        <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
          ${sortedHouses
            .map((hStats) => {
              const h = HOUSES[hStats.id];
              return `
              <div style="display: inline-flex; align-items: center; gap: 5px; background: ${h.bgLight}; border: 1px solid ${h.borderColor}; padding: 3px 9px; border-radius: 999px; font-size: 0.72rem; font-weight: 800; color: ${h.color};">
                <span style="width: 6px; height: 6px; border-radius: 50%; background: ${h.color};"></span>
                <span>${h.name}</span>
                <span style="font-family: monospace; font-size: 0.8rem; font-weight: 900;">${hStats.points}</span>
              </div>
            `;
            })
            .join('')}
        </div>

        <!-- Discrete Teacher Controls -->
        <div style="display: flex; align-items: center; gap: 6px;">
          ${
            chessState.userRole === 'teacher'
              ? `
            <button type="button" onclick="window.toggleQuickDeskDrawer()" style="background: ${chessState.showQuickDesk ? '#0284c7' : '#f8fafc'}; color: ${chessState.showQuickDesk ? '#ffffff' : '#1e293b'}; border: 1px solid ${chessState.showQuickDesk ? '#0284c7' : '#cbd5e1'}; font-weight: 800; font-size: 0.75rem; padding: 5px 11px; border-radius: 7px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
              <span>⚡</span> Quick Desk
            </button>

            <div style="position: relative; display: inline-block;">
              <button id="btn-chess-admin-menu" type="button" onclick="window.toggleChessAdminDropdown(event)" style="background: #ffffff; color: #475569; border: 1px solid #cbd5e1; font-weight: 700; font-size: 0.75rem; padding: 5px 10px; border-radius: 7px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                <span>⚙️</span> Tools ▾
              </button>
              <div id="chess-admin-dropdown" style="display: ${chessState.showAdminDropdown ? 'block' : 'none'}; position: absolute; right: 0; top: calc(100% + 4px); background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 10px; box-shadow: 0 10px 28px rgba(0,0,0,0.18); z-index: 9999; min-width: 225px; overflow: hidden;">
                <button type="button" onclick="window.closeChessAdminDropdownOnly(); window.toggleChessWhiteboardMode();" style="width: 100%; text-align: left; background: transparent; border: none; border-bottom: 1px solid #f1f5f9; color: #0284c7; padding: 9px 12px; font-size: 0.76rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                  <span>📺</span> Whiteboard Display (W)
                </button>
                <button type="button" onclick="window.closeChessAdminDropdownOnly(); window.openPupilQrModal();" style="width: 100%; text-align: left; background: transparent; border: none; border-bottom: 1px solid #f1f5f9; color: #334155; padding: 9px 12px; font-size: 0.76rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                  <span>📱</span> Show Pupil QR Code
                </button>
                <button type="button" onclick="window.closeChessAdminDropdownOnly(); window.copyFridayBulletinNotice();" style="width: 100%; text-align: left; background: transparent; border: none; border-bottom: 1px solid #f1f5f9; color: #0891b2; padding: 9px 12px; font-size: 0.76rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                  <span>📋</span> Copy Friday Bulletin Notice
                </button>
                <button type="button" onclick="window.closeChessAdminDropdownOnly(); window.openAirgapInfoModal && window.openAirgapInfoModal();" style="width: 100%; text-align: left; background: transparent; border: none; border-bottom: 1px solid #f1f5f9; color: #166534; padding: 9px 12px; font-size: 0.76rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                  <span>🛡️</span> Privacy &amp; Cloud Sync
                </button>
                <button type="button" onclick="window.closeChessAdminDropdownOnly(); window.openDataVaultModal();" style="width: 100%; text-align: left; background: transparent; border: none; border-bottom: 1px solid #f1f5f9; color: #334155; padding: 9px 12px; font-size: 0.76rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                  <span>💾</span> Backup Data Vault
                </button>
                ${
                  getBackupInfo()
                    ? `
                  <button type="button" onclick="window.closeChessAdminDropdownOnly(); window.restoreChessBackup();" style="width: 100%; text-align: left; background: transparent; border: none; border-bottom: 1px solid #f1f5f9; color: #2563eb; padding: 9px 12px; font-size: 0.76rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    <span>↺</span> Restore Cohort (${getBackupInfo().playerCount})
                  </button>
                `
                    : ''
                }
                <button type="button" onclick="window.closeChessAdminDropdownOnly(); window.resetClubDataToCleanSlate();" style="width: 100%; text-align: left; background: transparent; border: none; color: #dc2626; padding: 9px 12px; font-size: 0.76rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                  <span>✕</span> Reset Roster to Clean Slate
                </button>
              </div>
            </div>

            <button type="button" onclick="window.lockTeacherMode()" style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; font-weight: 700; font-size: 0.74rem; padding: 5px 9px; border-radius: 7px; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;" title="Lock back to Pupil View">
              <span>🔒</span> Lock
            </button>
          `
              : `
            <button type="button" onclick="window.openTeacherUnlockModal()" style="background: transparent; color: #94a3b8; border: 1px solid #cbd5e1; font-weight: 600; font-size: 0.74rem; padding: 5px 10px; border-radius: 7px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" title="Teacher administrative access">
              <span>🔒</span> Teacher
            </button>
          `
          }
        </div>
      </div>

      <!-- Clean 4-Tab Primary Navigation -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 6px; margin-bottom: 12px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 11px; padding: 4px;">
        <button id="tab-btn-play" type="button" onclick="window.switchChessTab('play')" style="padding: 9px 10px; border-radius: 8px; border: ${isPlayGroup ? '1px solid #cbd5e1' : '1px solid transparent'}; background: ${isPlayGroup ? '#ffffff' : 'transparent'}; color: ${isPlayGroup ? '#0f172a' : '#475569'}; font-weight: 800; font-size: 0.84rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-shadow: ${isPlayGroup ? '0 2px 6px rgba(15,23,42,0.06)' : 'none'};">
          <span>♟️</span> <span>Play &amp; Live Duel</span>
        </button>

        <button id="tab-btn-feed" type="button" onclick="window.switchChessTab('feed')" style="padding: 9px 10px; border-radius: 8px; border: ${isFeedGroup ? '1px solid #cbd5e1' : '1px solid transparent'}; background: ${isFeedGroup ? '#ffffff' : 'transparent'}; color: ${isFeedGroup ? '#0f172a' : '#475569'}; font-weight: 800; font-size: 0.84rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-shadow: ${isFeedGroup ? '0 2px 6px rgba(15,23,42,0.06)' : 'none'};">
          <span>📣</span> <span>Club Feed</span>
          ${(chessState.clubFeed || []).length > 0 ? `<span style="background: #e0f2fe; color: #0369a1; padding: 1px 6px; border-radius: 999px; font-size: 0.66rem; font-weight: 800;">Live</span>` : ''}
        </button>

        <button id="tab-btn-ladder" type="button" onclick="window.switchChessTab('ladder')" style="padding: 9px 10px; border-radius: 8px; border: ${isLadderGroup ? '1px solid #cbd5e1' : '1px solid transparent'}; background: ${isLadderGroup ? '#ffffff' : 'transparent'}; color: ${isLadderGroup ? '#0f172a' : '#475569'}; font-weight: 800; font-size: 0.84rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-shadow: ${isLadderGroup ? '0 2px 6px rgba(15,23,42,0.06)' : 'none'};">
          <span>🏆</span> <span>Rankings &amp; Bots</span>
          ${activePairingsCount > 0 ? `<span style="background: #dcfce7; color: #166534; padding: 1px 6px; border-radius: 999px; font-size: 0.68rem; font-weight: 800;">${activePairingsCount} Live</span>` : ''}
        </button>

        <button id="tab-btn-modes" type="button" onclick="window.switchChessTab('modes')" style="padding: 9px 10px; border-radius: 8px; border: ${isModesGroup ? '1px solid #cbd5e1' : '1px solid transparent'}; background: ${isModesGroup ? '#ffffff' : 'transparent'}; color: ${isModesGroup ? '#0f172a' : '#475569'}; font-weight: 800; font-size: 0.84rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-shadow: ${isModesGroup ? '0 2px 6px rgba(15,23,42,0.06)' : 'none'};">
          <span>🎮</span> <span>Modes &amp; Cup</span>
          ${chessState.knockoutBracket ? `<span style="background: #fef3c7; color: #b45309; padding: 1px 6px; border-radius: 999px; font-size: 0.68rem; font-weight: 800;">Cup</span>` : ''}
        </button>
      </div>

      <!-- Teacher Pending Club Join Requests Banner -->
      ${chessState.userRole === 'teacher' && Array.isArray(chessState.pendingJoinRequests) && chessState.pendingJoinRequests.length > 0 ? renderPendingJoinRequestsBanner() : ''}

      <!-- Teacher Pending Practice XP Approval Banner -->
      ${chessState.userRole === 'teacher' && Array.isArray(chessState.pendingXpClaims) && chessState.pendingXpClaims.length > 0 ? renderPendingXpClaimsBanner() : ''}

      <!-- Teacher Quick Desk Drawer (Tucked away until toggled) -->
      ${chessState.userRole === 'teacher' && chessState.showQuickDesk ? renderTeacherQuickDeskSection(filteredPlayers) : ''}

      <!-- Dynamic Tab Content Routing -->
      <div id="chess-tab-content">
        ${renderActiveTabContent(filteredPlayers)}
      </div>

      ${renderAdjudicationModalOverlay()}
    </div>
  `;

  container.innerHTML = html;
}

// Router: Render active tab content cleanly across the 3 primary hubs
function renderActiveTabContent(filteredPlayers) {
  const tab = chessState.activeTab || 'play';

  // HUB 1B: Live Club Highlights Feed ('feed')
  if (tab === 'feed') {
    return renderClubHighlightsFeedTab(chessState, {
      calculatePlayerPoints,
      calculateHouseTotals,
    });
  }

  // HUB 2: Club Ladder, Bot Rankings & Pairings ('ladder' | 'bots' | 'pairings' | 'table')
  if (tab === 'ladder' || tab === 'bots' || tab === 'pairings' || tab === 'table') {
    const activePairingsCount = (chessState.activePairings || []).filter((p) => !p.isBye).length;
    const subNavHtml = `
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 7px 10px;">
        <div style="display: inline-flex; gap: 4px; background: #f1f5f9; padding: 3px; border-radius: 8px; flex-wrap: wrap;">
          <button type="button" onclick="window.switchChessTab('ladder')" style="background: ${tab === 'ladder' ? '#ffffff' : 'transparent'}; color: ${tab === 'ladder' ? '#0f172a' : '#475569'}; border: none; border-radius: 6px; padding: 5px 11px; font-size: 0.78rem; font-weight: 800; cursor: pointer; box-shadow: ${tab === 'ladder' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'};">
            🏆 Member Standings (${chessState.players.length})
          </button>
          <button type="button" onclick="window.switchChessTab('bots')" style="background: ${tab === 'bots' ? '#ffffff' : 'transparent'}; color: ${tab === 'bots' ? '#0f172a' : '#475569'}; border: none; border-radius: 6px; padding: 5px 11px; font-size: 0.78rem; font-weight: 800; cursor: pointer; box-shadow: ${tab === 'bots' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'};">
            🤖 Bot Rankings &amp; Matrix (6)
          </button>
          <button type="button" onclick="window.switchChessTab('pairings')" style="background: ${tab === 'pairings' ? '#ffffff' : 'transparent'}; color: ${tab === 'pairings' ? '#0f172a' : '#475569'}; border: none; border-radius: 6px; padding: 5px 11px; font-size: 0.78rem; font-weight: 800; cursor: pointer; box-shadow: ${tab === 'pairings' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'};">
            ⚔️ Board Pairings ${activePairingsCount > 0 ? `(${activePairingsCount})` : ''}
          </button>
          <button type="button" onclick="window.switchChessTab('table')" style="background: ${tab === 'table' ? '#ffffff' : 'transparent'}; color: ${tab === 'table' ? '#0f172a' : '#475569'}; border: none; border-radius: 6px; padding: 5px 11px; font-size: 0.78rem; font-weight: 800; cursor: pointer; box-shadow: ${tab === 'table' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'};">
            📊 Cross-Table
          </button>
        </div>

        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
          ${
            tab === 'ladder' || tab === 'table'
              ? `
            <select onchange="window.setChessHouseFilter(this.value)" style="background: #f8fafc; border: 1px solid #cbd5e1; color: #334155; border-radius: 7px; padding: 5px 9px; font-size: 16px; font-weight: 700; cursor: pointer;">
              <option value="all" ${chessState.filterHouse === 'all' ? 'selected' : ''}>All Houses (${chessState.players.length})</option>
              ${Object.values(HOUSES)
                .map(
                  (h) =>
                    `<option value="${h.id}" ${chessState.filterHouse === h.id ? 'selected' : ''}>${h.name} (${chessState.players.filter((p) => p.house === h.id).length})</option>`,
                )
                .join('')}
            </select>
          `
              : ''
          }
          ${
            chessState.userRole === 'teacher'
              ? `
            <button type="button" onclick="window.handleQuickAutoPair()" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border: none; border-radius: 7px; padding: 6px 11px; font-size: 0.76rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
              <span>⚔️</span> Auto-Pair
            </button>
            <button type="button" onclick="window.openAddPlayerModal()" style="background: #10b981; color: #ffffff; border: none; border-radius: 7px; padding: 6px 10px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
              + Pupil
            </button>
            ${
              tab === 'ladder'
                ? `
              <button type="button" onclick="window.toggleLadderAdminTools()" style="background: ${chessState.showLadderAdminTools ? '#0f172a' : '#f8fafc'}; color: ${chessState.showLadderAdminTools ? '#ffffff' : '#475569'}; border: 1px solid #cbd5e1; border-radius: 7px; padding: 5px 9px; font-size: 0.74rem; font-weight: 700; cursor: pointer;">
                ⚙️ Roster
              </button>
            `
                : ''
            }
          `
              : `
            <button type="button" onclick="window.openPupilJoinRequestModal()" style="background: #0284c7; color: #ffffff; border: none; border-radius: 7px; padding: 6px 11px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
              + Request to Join Club
            </button>
          `
          }
        </div>
      </div>
    `;

    if (tab === 'bots') {
      return (
        subNavHtml +
        renderBotRankingsAndConquestsTab(chessState, {
          calculatePlayerPoints,
        })
      );
    }
    if (tab === 'pairings') return subNavHtml + renderPairingsTab();
    if (tab === 'table') return subNavHtml + renderLeagueTableTab(filteredPlayers);
    return subNavHtml + renderLadderTab(filteredPlayers);
  }

  // HUB 3: Game Modes, Knockout Cup & Tactical Puzzles ('modes' | 'knockout' | 'beginners' | 'drills')
  if (tab === 'modes' || tab === 'knockout' || tab === 'beginners' || tab === 'drills') {
    const houseTotals = calculateHouseTotals();
    const sortedHouses = Object.values(houseTotals).sort((a, b) => b.points - a.points);
    const modesSubNav = `
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 7px 10px;">
        <div style="display: inline-flex; gap: 4px; background: #f1f5f9; padding: 3px; border-radius: 8px; flex-wrap: wrap;">
          <button type="button" onclick="window.switchChessTab('modes')" style="background: ${tab === 'modes' ? '#ffffff' : 'transparent'}; color: ${tab === 'modes' ? '#0f172a' : '#475569'}; border: none; border-radius: 6px; padding: 5px 11px; font-size: 0.78rem; font-weight: 800; cursor: pointer; box-shadow: ${tab === 'modes' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'};">
            🎮 7 Classroom Modes
          </button>
          <button type="button" onclick="window.switchChessTab('knockout')" style="background: ${tab === 'knockout' ? '#ffffff' : 'transparent'}; color: ${tab === 'knockout' ? '#0f172a' : '#475569'}; border: none; border-radius: 6px; padding: 5px 11px; font-size: 0.78rem; font-weight: 800; cursor: pointer; box-shadow: ${tab === 'knockout' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'};">
            👑 Knockout Cup ${chessState.knockoutBracket ? '· Live' : ''}
          </button>
          <button type="button" onclick="window.switchChessTab('beginners')" style="background: ${tab === 'beginners' || tab === 'drills' ? '#ffffff' : 'transparent'}; color: ${tab === 'beginners' || tab === 'drills' ? '#0f172a' : '#475569'}; border: none; border-radius: 6px; padding: 5px 11px; font-size: 0.78rem; font-weight: 800; cursor: pointer; box-shadow: ${tab === 'beginners' || tab === 'drills' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'};">
            🧩 Puzzles &amp; Rookie Guide
          </button>
        </div>
      </div>
    `;

    if (tab === 'knockout') return modesSubNav + renderKnockoutTab();
    if (tab === 'beginners' || tab === 'drills') {
      chessState.showStarterPuzzle = true;
      return modesSubNav + renderBethHarmonCeilingBoard() + renderBeginnersTab();
    }
    return (
      modesSubNav +
      renderClubGameModesView(chessState, {
        getPlayerButtonShortName,
        sortedHouses,
      })
    );
  }

  // HUB 1 (Default): Virtual Chess Set ('play')
  return renderVirtualChessView(chessState);
}

// Championship Podium (Top 3 Contenders - Ultra-Compact Horizontal Layout)
function renderChampionshipPodium(players) {
  const list = players && players.length >= 3 ? players : chessState.players;
  if (!list || list.length < 3) return '';
  const sorted = [...list].sort((a, b) => a.rank - b.rank);
  const p1 = sorted[0];
  const p2 = sorted[1];
  const p3 = sorted[2];
  if (!p1 || !p2 || !p3) return '';

  return `
    <div id="championship-podium-root" style="margin-bottom: 8px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; padding: 0 2px;">
        <div style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #b45309; font-family: monospace;">
          🏆 Championship Flight · Premier Standings
        </div>
        <div style="font-size: 0.66rem; color: #64748b;">
          Top 3 Contenders
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;">
        
        <!-- 2nd Place (Silver) -->
        <div style="background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%); border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 6px 10px; display: flex; align-items: center; justify-content: space-between; gap: 8px; position: relative;">
          <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
            <span style="font-size: 0.8rem; font-weight: 900; background: #e2e8f0; color: #334155; border: 1px solid #94a3b8; border-radius: 5px; padding: 2px 6px; font-family: monospace; white-space: nowrap; flex-shrink: 0;">🥈 2nd</span>
            <div style="min-width: 0;">
              <div style="font-size: 0.88rem; font-weight: 800; color: #0f172a; line-height: 1.2;" title="${p2.name}">${p2.name}</div>
              <div style="display: flex; align-items: center; gap: 4px; font-size: 0.65rem; color: #64748b; margin-top: 1px;">
                <span style="color: ${HOUSES[p2.house]?.color || '#334155'}; font-weight: 700;">${HOUSES[p2.house]?.name || p2.house}</span>
                <span>•</span>
                <span style="font-family: monospace; font-weight: 700;">${p2.rating} ELO</span>
              </div>
            </div>
          </div>
          <div style="text-align: right; flex-shrink: 0; font-family: monospace;">
            <div style="font-size: 0.92rem; font-weight: 900; color: #0284c7;">${calculatePlayerPoints(p2)} <span style="font-size: 0.62rem;">pts</span></div>
            <div style="font-size: 0.62rem; color: #16a34a; font-weight: 700;">${p2.won}W/${p2.games}P</div>
          </div>
        </div>

        <!-- 1st Place (Gold - Elevated Champion) -->
        <div style="background: linear-gradient(180deg, #fefce8 0%, #ffffff 100%); border: 1.5px solid #eab308; border-radius: 8px; padding: 6px 10px; display: flex; align-items: center; justify-content: space-between; gap: 8px; box-shadow: 0 2px 8px rgba(234, 179, 8, 0.18); position: relative;">
          <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
            <span style="font-size: 0.8rem; font-weight: 900; background: #fde047; color: #854d0e; border: 1px solid #ca8a04; border-radius: 5px; padding: 2px 6px; font-family: monospace; white-space: nowrap; flex-shrink: 0;">👑 1st</span>
            <div style="min-width: 0;">
              <div style="font-size: 0.92rem; font-weight: 900; color: #0f172a; line-height: 1.2;" title="${p1.name}">${p1.name}</div>
              <div style="display: flex; align-items: center; gap: 4px; font-size: 0.65rem; color: #64748b; margin-top: 1px;">
                <span style="color: ${HOUSES[p1.house]?.color || '#334155'}; font-weight: 800;">${HOUSES[p1.house]?.name || p1.house}</span>
                <span>•</span>
                <span style="font-family: monospace; font-weight: 700;">${p1.rating} ELO</span>
              </div>
            </div>
          </div>
          <div style="text-align: right; flex-shrink: 0; font-family: monospace;">
            <div style="font-size: 1rem; font-weight: 900; color: #ca8a04;">${calculatePlayerPoints(p1)} <span style="font-size: 0.62rem;">pts</span></div>
            <div style="font-size: 0.62rem; color: #15803d; font-weight: 800;">${p1.won}W/${p1.games}P</div>
          </div>
        </div>

        <!-- 3rd Place (Bronze) -->
        <div style="background: linear-gradient(180deg, #fffbeb 0%, #ffffff 100%); border: 1.5px solid #fed7aa; border-radius: 8px; padding: 6px 10px; display: flex; align-items: center; justify-content: space-between; gap: 8px; position: relative;">
          <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
            <span style="font-size: 0.8rem; font-weight: 900; background: #ffedd5; color: #9a3412; border: 1px solid #fb923c; border-radius: 5px; padding: 2px 6px; font-family: monospace; white-space: nowrap; flex-shrink: 0;">🥉 3rd</span>
            <div style="min-width: 0;">
              <div style="font-size: 0.88rem; font-weight: 800; color: #0f172a; line-height: 1.2;" title="${p3.name}">${p3.name}</div>
              <div style="display: flex; align-items: center; gap: 4px; font-size: 0.65rem; color: #64748b; margin-top: 1px;">
                <span style="color: ${HOUSES[p3.house]?.color || '#334155'}; font-weight: 700;">${HOUSES[p3.house]?.name || p3.house}</span>
                <span>•</span>
                <span style="font-family: monospace; font-weight: 700;">${p3.rating} ELO</span>
              </div>
            </div>
          </div>
          <div style="text-align: right; flex-shrink: 0; font-family: monospace;">
            <div style="font-size: 0.92rem; font-weight: 900; color: #c2410c;">${calculatePlayerPoints(p3)} <span style="font-size: 0.62rem;">pts</span></div>
            <div style="font-size: 0.62rem; color: #64748b; font-weight: 700;">${p3.won}W/${p3.games}P</div>
          </div>
        </div>

      </div>
    </div>
  `;
}

// 0. Teacher Quick Desk Section (1-Tap Match & Points Logger - Compact)
function renderTeacherQuickDeskSection(players) {
  const allPlayers = [...chessState.players].sort((a, b) => {
    const ptsDiff = calculatePlayerPoints(b) - calculatePlayerPoints(a);
    if (ptsDiff !== 0) return ptsDiff;
    return (a.rank || 99) - (b.rank || 99);
  });
  const p1Id = chessState.quickDeskP1Id || '';
  const p2Id = chessState.quickDeskP2Id || '';
  const lastMatch = chessState.matches && chessState.matches[0];

  return `
    <div id="teacher-quick-desk" style="background: linear-gradient(135deg, #1c1917 0%, #292524 100%); border: 1.5px solid #38bdf8; border-radius: 8px; padding: 10px 14px; margin-bottom: 8px; color: #ffffff; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25); animation: fadeIn 0.2s ease-out;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 26px; height: 26px; border-radius: 6px; background: #0284c7; border: 1px solid #38bdf8; display: flex; align-items: center; justify-content: center; font-size: 0.95rem;">
            ⚡
          </div>
          <div>
            <h3 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 0.95rem; color: #fafaf9; font-weight: 700;">
              Teacher Quick Desk · 1-Tap Match &amp; Points Logger
            </h3>
          </div>
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
          <button type="button" onclick="window.sortLadderByPoints()" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; border: 1px solid #fbbf24; font-weight: 800; font-size: 0.72rem; padding: 3px 8px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" title="Automatically sort all pupils by total points (largest to smallest)">
            <span>⚡</span> Auto-Sort
          </button>
          <button onclick="window.openAddPlayerModal()" style="background: #10b981; color: #ffffff; border: 1px solid #34d399; font-weight: 800; font-size: 0.72rem; padding: 3px 8px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
            <span>+</span> Register Pupil
          </button>
          <button type="button" onclick="window.toggleQuickDeskDrawer()" style="background: rgba(255,255,255,0.1); color: #e2e8f0; border: 1px solid #57534e; font-weight: 700; font-size: 0.72rem; padding: 3px 8px; border-radius: 4px; cursor: pointer;">
            ✕ Hide
          </button>
        </div>
      </div>

      <!-- Player Selector Grid -->
      <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: center; margin-bottom: 8px;">
        <div>
          <label style="display: block; font-size: 0.68rem; font-weight: 800; color: #93c5fd; text-transform: uppercase; margin-bottom: 3px; letter-spacing: 0.04em;">
            White ♔
          </label>
          <select id="quickdesk-p1" onchange="chessState.quickDeskP1Id = this.value" style="width: 100%; background: #0c0a09; border: 1px solid #57534e; color: #f8fafc; border-radius: 5px; padding: 5px 8px; font-size: 0.8rem; font-weight: 700; outline: none;">
            <option value="">-- Choose White --</option>
            ${allPlayers
              .map((p) => {
                const h = HOUSES[p.house];
                const isSelected = p.id === p1Id ? 'selected' : '';
                const pts = calculatePlayerPoints(p);
                return `<option value="${p.id}" ${isSelected}>#${p.rank} ${p.name} · ${pts} pts (${h ? h.name : p.house} · Elo ${p.rating})</option>`;
              })
              .join('')}
          </select>
        </div>

        <div style="text-align: center; padding-top: 14px;">
          <button type="button" onclick="window.swapQuickDeskPlayers()" title="Swap White and Black" style="background: #292524; color: #cbd5e1; border: 1px solid #57534e; width: 28px; height: 28px; border-radius: 50%; font-size: 0.95rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: all 0.15s;">
            ⇄
          </button>
        </div>

        <div>
          <label style="display: block; font-size: 0.68rem; font-weight: 800; color: #fdba74; text-transform: uppercase; margin-bottom: 3px; letter-spacing: 0.04em;">
            Black ♚
          </label>
          <select id="quickdesk-p2" onchange="chessState.quickDeskP2Id = this.value" style="width: 100%; background: #0c0a09; border: 1px solid #57534e; color: #f8fafc; border-radius: 5px; padding: 5px 8px; font-size: 0.8rem; font-weight: 700; outline: none;">
            <option value="">-- Choose Black --</option>
            ${allPlayers
              .map((p) => {
                const h = HOUSES[p.house];
                const isSelected = p.id === p2Id ? 'selected' : '';
                const pts = calculatePlayerPoints(p);
                return `<option value="${p.id}" ${isSelected}>#${p.rank} ${p.name} · ${pts} pts (${h ? h.name : p.house} · Elo ${p.rating})</option>`;
              })
              .join('')}
          </select>
        </div>
      </div>

      <!-- 3 Instant Result Buttons -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-bottom: 6px;">
        <button type="button" onclick="window.recordDirectTeacherMatch('p1')" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: 1px solid #34d399; border-radius: 5px; padding: 6px 6px; font-weight: 800; font-size: 0.78rem; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 4px;">
          <span>🏆 White Won (+3 pts)</span>
        </button>

        <button type="button" onclick="window.recordDirectTeacherMatch('draw')" style="background: linear-gradient(135deg, #44403c 0%, #292524 100%); color: #ffffff; border: 1px solid #78716c; border-radius: 5px; padding: 6px 6px; font-weight: 800; font-size: 0.78rem; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 4px;">
          <span>🤝 Draw (+2 each)</span>
        </button>

        <button type="button" onclick="window.recordDirectTeacherMatch('p2')" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: 1px solid #34d399; border-radius: 5px; padding: 6px 6px; font-weight: 800; font-size: 0.78rem; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 4px;">
          <span>🏆 Black Won (+3 pts)</span>
        </button>
      </div>

      <!-- Desk Footer: Undo & Hint -->
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem; color: #a8a29e; flex-wrap: wrap; gap: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08);">
        <div>
          💡 <em>Tap <strong>[ ⚡ ]</strong> on any pupil below to load them into White!</em>
        </div>
        ${
          lastMatch
            ? `
          <button type="button" onclick="window.undoQuickDeskMatch('${lastMatch.id}')" style="background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); padding: 3px 8px; border-radius: 4px; font-size: 0.68rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
            <span>↺</span> Undo: ${lastMatch.white} vs ${lastMatch.black} (${lastMatch.result})
          </button>
        `
            : ''
        }
      </div>
    </div>
  `;
}

// 1. Master Ladder View (King of the Hill - Ultra-Compact 2-Column Grid)
function renderLadderTab(players) {
  const backupInfo = getBackupInfo();
  if (players.length === 0) {
    return `
      <div style="background: #ffffff; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 32px 20px; text-align: center; color: #64748b;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: #f3e8ff; color: #8b5cf6; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin: 0 auto 12px;">
          <i class="fa-solid fa-stairs"></i>
        </div>
        <h3 style="margin: 0 0 6px 0; font-size: 1.1rem; color: #0f172a; font-weight: 800;">
          The Master Ladder is Ready
        </h3>
        <p style="margin: 0 auto 14px; max-width: 440px; font-size: 0.85rem; color: #64748b; line-height: 1.4;">
          No pupils are currently on the ladder. Register arriving pupils to build your club ladder from scratch!
        </p>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <button onclick="window.openAddPlayerModal()" style="background: #10b981; color: #ffffff; border: none; font-weight: 700; font-size: 0.82rem; padding: 6px 14px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);">
            + Add Pupil
          </button>
          ${
            backupInfo
              ? `
            <button onclick="window.restoreChessBackup()" style="background: #ffffff; color: #1e40af; border: 1.5px solid #bfdbfe; font-weight: 700; font-size: 0.82rem; padding: 6px 12px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              ↺ Restore Previous Cohort (${backupInfo.playerCount})
            </button>
          `
              : ''
          }
        </div>
      </div>
    `;
  }

  const checkedInSet = new Set(chessState.checkedInPlayerIds || []);
  const checkedInCount = players.filter((p) => checkedInSet.has(p.id)).length;
  const showAdmin = chessState.userRole === 'teacher' && chessState.showLadderAdminTools;

  return `
    <div>
      ${
        showAdmin
          ? `
        <!-- Optional Collapsible Roster & Attendance Admin Bar -->
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div style="font-size: 0.76rem; color: #334155;">
            <strong>Attendance:</strong> <strong style="color: ${checkedInCount > 0 ? '#16a34a' : '#64748b'};">${checkedInCount}</strong> / ${players.length} present · Use ▲/▼ on rows below to nudge ranks
          </div>
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <button type="button" onclick="window.checkInAllPlayers()" style="background: #ffffff; color: #16a34a; border: 1px solid #86efac; border-radius: 5px; padding: 4px 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer;">
              ✓ All Present
            </button>
            <button type="button" onclick="window.clearAttendance()" style="background: #ffffff; color: #64748b; border: 1px solid #cbd5e1; border-radius: 5px; padding: 4px 8px; font-size: 0.72rem; font-weight: 600; cursor: pointer;">
              Clear Attendance
            </button>
            <button type="button" onclick="window.sortLadderByPoints()" style="background: #ffffff; color: #b45309; border: 1px solid #fde68a; border-radius: 5px; padding: 4px 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer;">
              ⚡ Sort by Points
            </button>
            ${
              chessState.activePairings && chessState.activePairings.length > 0
                ? `<button type="button" onclick="window.resetPairings()" style="background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; border-radius: 5px; padding: 4px 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer;">🧹 Clear Pairings</button>`
                : ''
            }
          </div>
        </div>
      `
          : ''
      }

      <!-- Complete Ladder Roster -->
      <div style="display: flex; flex-direction: column; gap: 7px; width: 100%; max-width: 920px; margin: 0 auto;">
        ${players
          .map((p) => {
            const h = HOUSES[p.house] || {
              name: p.house,
              color: '#334155',
              bgLight: '#f8fafc',
              borderColor: '#cbd5e1',
            };
            const isCheckedIn = checkedInSet.has(p.id);
            const totalPts = calculatePlayerPoints(p);

            let rankBadgeBg = '#f1f5f9';
            let rankBadgeColor = '#334155';
            let rowBorder = isCheckedIn ? '#86efac' : '#e2e8f0';

            if (p.rank === 1) {
              rankBadgeBg = '#fde047';
              rankBadgeColor = '#854d0e';
              rowBorder = '#facc15';
            } else if (p.rank === 2) {
              rankBadgeBg = '#e2e8f0';
              rankBadgeColor = '#1e293b';
              rowBorder = '#94a3b8';
            } else if (p.rank === 3) {
              rankBadgeBg = '#ffedd5';
              rankBadgeColor = '#9a3412';
              rowBorder = '#fdba74';
            }

            return `
            <div class="ladder-row" style="background: #ffffff; border: 1.5px solid ${rowBorder}; border-radius: 10px; padding: 9px 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px; box-shadow: 0 1px 3px rgba(15,23,42,0.02);">
              
              <div style="display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1;">
                <div style="width: 32px; height: 32px; border-radius: 7px; background: ${rankBadgeBg}; color: ${rankBadgeColor}; font-weight: 900; display: flex; align-items: center; justify-content: center; font-size: 0.92rem; flex-shrink: 0; font-family: monospace; border: 1px solid rgba(0,0,0,0.06);">
                  ${p.rank === 1 ? '👑' : `${p.rank}`}
                </div>

                <div style="min-width: 0; flex: 1;">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span style="font-size: 0.95rem; color: #0f172a; font-weight: 800;">
                      ${renderPlayerNameWithCallsign(p)}
                    </span>
                    <span style="background: ${h.bgLight}; color: ${h.color}; border: 1px solid ${h.borderColor}; padding: 1px 8px; border-radius: 999px; font-size: 0.68rem; font-weight: 800; flex-shrink: 0;">
                      ${h.name}
                    </span>
                  </div>
                  <div style="font-size: 0.72rem; color: #64748b; font-family: monospace; margin-top: 2px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                    <span>ELO <strong style="color: #334155;">${p.rating}</strong> · <strong style="color: #16a34a;">${p.won}W</strong>/<strong style="color: #64748b;">${p.drawn}D</strong>/<strong style="color: #dc2626;">${p.lost}L</strong></span>
                    ${(p.practiceXp || 0) > 0 ? `<span style="background: #fefce8; color: #b45309; border: 1px solid #fde68a; border-radius: 999px; padding: 0 6px; font-size: 0.66rem; font-weight: 800;">⚡ ${p.practiceXp} XP</span>` : ''}
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 7px; flex-shrink: 0;">
                <div style="text-align: right; font-family: monospace; padding-right: 4px;">
                  <div style="font-size: 0.98rem; font-weight: 900; color: ${h.color};">${totalPts} <span style="font-size: 0.65rem; font-weight: 700; color: #64748b;">pts</span></div>
                </div>

                ${
                  chessState.userRole === 'teacher'
                    ? `
                  <button type="button" onclick="${isCheckedIn ? `window.checkOutPlayer('${p.id}')` : `window.checkInPlayer('${p.id}')`}" title="Toggle attendance" style="background: ${isCheckedIn ? '#dcfce7' : '#f8fafc'}; color: ${isCheckedIn ? '#15803d' : '#64748b'}; border: 1px solid ${isCheckedIn ? '#86efac' : '#cbd5e1'}; border-radius: 6px; padding: 4px 8px; font-size: 0.72rem; font-weight: 800; cursor: pointer;">
                    ${isCheckedIn ? '✓ Here' : '+ Here'}
                  </button>
                  <button type="button" onclick="window.selectPlayerForQuickDesk('${p.id}')" style="background: #f1f5f9; color: #0284c7; border: 1px solid #cbd5e1; padding: 4px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 800; cursor: pointer;" title="Load ${p.name} into Quick Desk">
                    ⚡
                  </button>
                  ${
                    showAdmin
                      ? `
                    <div style="display: inline-flex; gap: 2px;">
                      <button type="button" onclick="window.movePlayerLadderRank('${p.id}', 'up')" title="Nudge rank up" style="background: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 4px; padding: 3px 6px; font-size: 0.68rem; font-weight: 800; cursor: pointer;">▲</button>
                      <button type="button" onclick="window.movePlayerLadderRank('${p.id}', 'down')" title="Nudge rank down" style="background: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 4px; padding: 3px 6px; font-size: 0.68rem; font-weight: 800; cursor: pointer;">▼</button>
                    </div>
                    <button type="button" onclick="window.removePlayer('${p.id}')" title="Remove pupil" style="background: none; border: none; color: #cbd5e1; cursor: pointer; padding: 4px 6px; font-size: 0.85rem;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#cbd5e1'">✕</button>
                  `
                      : ''
                  }
                `
                    : ''
                }
              </div>

            </div>
          `;
          })
          .join('')}
      </div>
    </div>
  `;
}

// 2. League Table View
// Helper: Render Authentic Head-to-Head Cross-Table Matrix Grid
function renderTournamentCrossTableGrid(sortedPlayers) {
  const matches = chessState.matches || [];

  // Helper: Get head-to-head match outcomes between pA and pB from pA's perspective
  function getH2HResults(pA, pB) {
    const directMatches = matches.filter(
      (m) =>
        (m.white === pA.name && m.black === pB.name) ||
        (m.white === pB.name && m.black === pA.name),
    );

    if (directMatches.length === 0) return '·';

    return directMatches
      .map((m) => {
        if (m.result === '½-½') return '½';
        if (m.white === pA.name) {
          return m.result === '1-0' ? '1' : '0';
        } else {
          return m.result === '0-1' ? '1' : '0';
        }
      })
      .join(', ');
  }

  return `
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
      <div style="background: #f8fafc; padding: 14px 18px; border-bottom: 1.5px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div>
          <h4 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 1.15rem; color: #0f172a; display: flex; align-items: center; gap: 8px;">
            <span>☵</span> Tournament Head-to-Head Matrix Grid
          </h4>
          <div style="font-size: 0.78rem; color: #64748b; margin-top: 2px;">
            The classic chess tournament grid: player names on rows, opponent numbers on columns.
          </div>
        </div>
        <div style="font-size: 0.75rem; color: #475569; font-family: monospace; background: #ffffff; padding: 4px 10px; border-radius: 6px; border: 1px solid #cbd5e1;">
          <span style="color: #16a34a; font-weight: 800;">1 = Win</span> &nbsp;|&nbsp; 
          <span style="color: #d97706; font-weight: 800;">½ = Draw</span> &nbsp;|&nbsp; 
          <span style="color: #94a3b8; font-weight: 700;">0 = Loss</span> &nbsp;|&nbsp; 
          <span style="color: #cbd5e1;">· = Unplayed</span>
        </div>
      </div>

      <div style="width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.84rem; text-align: center;">
          <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; color: #334155; font-size: 0.76rem; font-weight: 800; text-transform: uppercase;">
              <th style="padding: 10px 12px; width: 40px; text-align: center;">#</th>
              <th style="padding: 10px 14px; text-align: left; min-width: 140px;">Pupil</th>
              <th style="padding: 10px 10px; text-align: left; min-width: 90px;">House</th>
              ${sortedPlayers
                .map(
                  (p, idx) => `
                <th style="padding: 8px 6px; width: 34px; min-width: 30px; text-align: center; border-left: 1px solid #e2e8f0; font-family: monospace;" title="${p.name}">
                  ${idx + 1}
                </th>
              `,
                )
                .join('')}
              <th style="padding: 10px 12px; border-left: 2px solid #cbd5e1; text-align: center; background: #f8fafc;">Pts</th>
              <th style="padding: 10px 10px; text-align: center;">W-D-L</th>
              <th style="padding: 10px 12px; text-align: center; font-family: monospace;">Rating</th>
            </tr>
          </thead>
          <tbody>
            ${sortedPlayers
              .map((pA, rIdx) => {
                const hA = HOUSES[pA.house] || {
                  name: pA.house,
                  color: '#334155',
                  bgLight: '#f1f5f9',
                  borderColor: '#cbd5e1',
                };
                const totalPts =
                  pA.won * SCORING_RULES.WIN +
                  pA.drawn * SCORING_RULES.DRAW +
                  pA.lost * SCORING_RULES.PARTICIPATION;

                return `
                <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <td style="padding: 10px 12px; font-weight: 800; color: #64748b; font-family: monospace;">${rIdx + 1}</td>
                  <td style="padding: 10px 14px; text-align: left; font-weight: 700; color: #0f172a; white-space: nowrap;">${pA.name}</td>
                  <td style="padding: 10px 10px; text-align: left; white-space: nowrap;">
                    <span style="background: ${hA.bgLight}; color: ${hA.color}; border: 1px solid ${hA.borderColor}; padding: 2px 7px; border-radius: 10px; font-size: 0.72rem; font-weight: 700;">
                      ${hA.name}
                    </span>
                  </td>
                  ${sortedPlayers
                    .map((pB, cIdx) => {
                      if (rIdx === cIdx) {
                        return `<td style="padding: 8px 6px; background: #334155; color: #64748b; border-left: 1px solid #e2e8f0; font-size: 0.75rem; user-select: none;">■</td>`;
                      }
                      const res = getH2HResults(pA, pB);
                      let style = 'color: #cbd5e1;';
                      if (res.includes('1')) style = 'color: #16a34a; font-weight: 800;';
                      else if (res.includes('½')) style = 'color: #d97706; font-weight: 800;';
                      else if (res.includes('0')) style = 'color: #64748b; font-weight: 700;';

                      return `
                      <td style="padding: 8px 6px; border-left: 1px solid #e2e8f0; font-family: monospace; font-size: 0.86rem; ${style}">
                        ${res}
                      </td>
                    `;
                    })
                    .join('')}
                  <td style="padding: 10px 12px; border-left: 2px solid #cbd5e1; font-weight: 900; color: ${hA.color}; font-size: 1rem; background: #fafafa;">
                    ${totalPts}
                  </td>
                  <td style="padding: 10px 10px; font-size: 0.78rem; color: #475569; white-space: nowrap;">
                    ${pA.won}W-${pA.drawn}D-${pA.lost}L
                  </td>
                  <td style="padding: 10px 12px; font-family: monospace; font-weight: 700; color: #334155;">
                    ${pA.rating}
                  </td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 2. League Table View & Tournament Cross-Table Matrix
function renderLeagueTableTab(players) {
  if (players.length === 0) {
    return `
      <div style="background: #ffffff; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 48px 24px; text-align: center; color: #64748b;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 16px;">
          <i class="fa-solid fa-table-list"></i>
        </div>
        <h3 style="margin: 0 0 8px 0; font-size: 1.25rem; color: #0f172a; font-weight: 800;">
          League Table is Clean
        </h3>
        <p style="margin: 0 auto 20px; max-width: 480px; font-size: 0.92rem; color: #64748b; line-height: 1.5;">
          No matches or pupils recorded yet. Registered pupils and their match results will rank here automatically.
        </p>
        <button onclick="window.switchChessTab('signin')" style="background: #10b981; color: #ffffff; border: none; font-weight: 700; font-size: 0.9rem; padding: 10px 20px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
          <i class="fa-solid fa-clipboard-user"></i> Go to Pupil Sign-In
        </button>
      </div>
    `;
  }

  const sortedByPoints = [...players].sort((a, b) => {
    const ptsA =
      a.won * SCORING_RULES.WIN +
      a.drawn * SCORING_RULES.DRAW +
      a.lost * SCORING_RULES.PARTICIPATION;
    const ptsB =
      b.won * SCORING_RULES.WIN +
      b.drawn * SCORING_RULES.DRAW +
      b.lost * SCORING_RULES.PARTICIPATION;
    return ptsB - ptsA || b.rating - a.rating;
  });

  const isMatrix = chessState.leagueTableViewMode !== 'table';

  return `
    <div>
      <!-- View Mode Selector Toggle Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
        <div style="display: inline-flex; background: #e2e8f0; border-radius: 8px; padding: 3px;">
          <button type="button" onclick="window.setLeagueTableViewMode('matrix')" style="${isMatrix ? 'background: #0f172a; color: #ffffff; font-weight: 800;' : 'background: transparent; color: #475569; font-weight: 600;'} border: none; padding: 7px 14px; border-radius: 6px; font-size: 0.82rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s;">
            <span>☵</span> Tournament Cross-Table Grid
          </button>
          <button type="button" onclick="window.setLeagueTableViewMode('table')" style="${!isMatrix ? 'background: #0f172a; color: #ffffff; font-weight: 800;' : 'background: transparent; color: #475569; font-weight: 600;'} border: none; padding: 7px 14px; border-radius: 6px; font-size: 0.82rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s;">
            <span>📋</span> Standings Table
          </button>
        </div>

        <div style="font-size: 0.8rem; color: #64748b;">
          Showing <strong>${sortedByPoints.length}</strong> active pupils · <strong>${chessState.matches.length}</strong> matches
        </div>
      </div>

      ${
        isMatrix
          ? renderTournamentCrossTableGrid(sortedByPoints)
          : `
        <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="width: 100%; max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch;">
            <table style="width: 100%; min-width: 680px; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em;">
                  <th style="padding: 12px 14px;">Rank</th>
                  <th style="padding: 12px 14px;">Pupil</th>
                  
                  <th style="padding: 12px 14px;">House</th>
                  <th style="padding: 12px 14px; text-align: center;">Played</th>
                  <th style="padding: 12px 14px; text-align: center;">Won</th>
                  <th style="padding: 12px 14px; text-align: center;">Drawn</th>
                  <th style="padding: 12px 14px; text-align: center;">Lost</th>
                  <th style="padding: 12px 14px; text-align: center;">Rating</th>
                  <th style="padding: 12px 14px; text-align: right;">House Points</th>
                </tr>
              </thead>
              <tbody>
                ${sortedByPoints
                  .map((p, idx) => {
                    const h = HOUSES[p.house];
                    const totalPts =
                      p.won * SCORING_RULES.WIN +
                      p.drawn * SCORING_RULES.DRAW +
                      p.lost * SCORING_RULES.PARTICIPATION;
                    return `
                    <tr class="chess-table-row" style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s ease;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                      <td style="padding: 12px 14px; font-weight: 800; color: #64748b;">${idx + 1}</td>
                      <td style="padding: 12px 14px; font-weight: 700; color: #0f172a;">${renderPlayerNameWithCallsign(p)}</td>
                      <td style="padding: 12px 14px; color: #475569;"></td>
                      <td style="padding: 12px 14px;">
                        <span style="background: ${h.bgLight}; color: ${h.color}; border: 1px solid ${h.borderColor}; padding: 3px 8px; border-radius: 12px; font-size: 0.72rem; font-weight: 700;">
                          <i class="fa-solid ${h.icon}"></i> ${h.name}
                        </span>
                      </td>
                      <td style="padding: 12px 14px; text-align: center; font-weight: 600;">${p.games}</td>
                      <td style="padding: 12px 14px; text-align: center; color: #16a34a; font-weight: 700;">${p.won}</td>
                      <td style="padding: 12px 14px; text-align: center; color: #2563eb; font-weight: 700;">${p.drawn}</td>
                      <td style="padding: 12px 14px; text-align: center; color: #94a3b8;">${p.lost}</td>
                      <td style="padding: 12px 14px; text-align: center; font-family: monospace; font-weight: 700; color: #334155;">${p.rating}</td>
                      <td style="padding: 12px 14px; text-align: right; font-weight: 800; color: ${h.color}; font-size: 1.05rem;">+${totalPts}</td>
                    </tr>
                  `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `
      }
    </div>
  `;
}

// Helper: Get active puzzle collection based on selected category ('grandmaster' vs 'beginner')
function getActivePuzzles() {
  if (chessState.puzzleCategory === 'beginner') {
    return Array.isArray(BEGINNER_ROOKIE_PUZZLES) && BEGINNER_ROOKIE_PUZZLES.length > 0
      ? BEGINNER_ROOKIE_PUZZLES
      : [];
  }
  return Array.isArray(BETH_HARMON_PUZZLES) && BETH_HARMON_PUZZLES.length > 0
    ? BETH_HARMON_PUZZLES
    : [];
}

// The Beth Harmon Ceiling Board: Interactive Tactical Starter (Movable Pieces & Sandbox Mode)
function renderBethHarmonCeilingBoard() {
  const puzzles = getActivePuzzles();
  if (puzzles.length === 0) return '';

  const puzzleIdx = (chessState.currentPuzzleIdx || 0) % puzzles.length;
  const puzzle = puzzles[puzzleIdx];
  const totalPuzzles = puzzles.length;
  const isCollapsed = chessState.showStarterPuzzle === false;

  // Initialize interactive board matrix if not already set or if puzzle changed
  if (!chessState.activePuzzleBoard || chessState.activePuzzleIndex !== puzzleIdx) {
    chessState.activePuzzleBoard = JSON.parse(JSON.stringify(puzzle.board));
    chessState.activePuzzleIndex = puzzleIdx;
    chessState.selectedSquare = null;
    chessState.puzzleMoveStep = 0;
    chessState.puzzleStatus = 'idle';
    chessState.puzzleFeedback = null;
  }

  const PIECE_GLYPHS = {
    k: '♚',
    q: '♛',
    r: '♜',
    b: '♝',
    n: '♞',
    p: '♟',
    K: '♔',
    Q: '♕',
    R: '♖',
    B: '♗',
    N: '♘',
    P: '♙',
    '.': '',
  };

  const boardMatrix = chessState.activePuzzleBoard;

  let squaresHtml = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const isLight = (r + c) % 2 === 0;
      const pieceCode = (boardMatrix[r] && boardMatrix[r][c]) || '.';
      const glyph = PIECE_GLYPHS[pieceCode] || '';
      const isWhitePiece = /[KQBNRP]/.test(pieceCode);
      const isBlackPiece = /[kqbnrp]/.test(pieceCode);

      const isSelected =
        chessState.selectedSquare &&
        chessState.selectedSquare[0] === r &&
        chessState.selectedSquare[1] === c;

      let bg = isLight ? '#f2ebe0' : '#785338';
      if (isSelected) {
        bg = '#d97706';
      }

      const color = isWhitePiece ? '#ffffff' : isBlackPiece ? '#18181b' : 'transparent';
      const textShadow = isWhitePiece
        ? '0 1px 2px rgba(0,0,0,0.9), 0 0 1px #000'
        : '0 1px 2px rgba(255,255,255,0.4)';

      const squareNotation = `${String.fromCharCode(97 + c)}${8 - r}`;
      const titleAttr = glyph
        ? `${squareNotation}: ${pieceCode} (Click or drag to move)`
        : `${squareNotation}`;

      squaresHtml += `
        <div onclick="window.handleBethSquareClick(${r}, ${c})"
             ondragstart="window.handleBethDragStart(event, ${r}, ${c})"
             ondragover="event.preventDefault()"
             ondrop="window.handleBethDrop(event, ${r}, ${c})"
             draggable="${glyph ? 'true' : 'false'}"
             title="${titleAttr}"
             style="background: ${bg}; display: flex; align-items: center; justify-content: center; font-size: clamp(1.2rem, 2.7vw, 2.05rem); font-family: 'Apple Symbols', 'Segoe UI Symbol', 'DejaVu Sans', serif; color: ${color}; text-shadow: ${textShadow}; user-select: none; position: relative; cursor: ${glyph || chessState.selectedSquare ? 'pointer' : 'default'}; box-shadow: ${isSelected ? 'inset 0 0 0 3px #fbbf24, 0 0 12px rgba(251, 191, 36, 0.7)' : 'none'}; z-index: ${isSelected ? 3 : 1}; transition: all 0.15s ease;">
          ${glyph}
          ${c === 0 ? `<span style="position: absolute; top: 1px; left: 2px; font-size: 8px; font-family: monospace; font-weight: bold; color: ${isLight ? '#785338' : '#f2ebe0'}; opacity: 0.75; pointer-events: none;">${8 - r}</span>` : ''}
          ${r === 7 ? `<span style="position: absolute; bottom: 1px; right: 2px; font-size: 8px; font-family: monospace; font-weight: bold; color: ${isLight ? '#785338' : '#f2ebe0'}; opacity: 0.75; pointer-events: none;">${String.fromCharCode(97 + c)}</span>` : ''}
        </div>
      `;
    }
  }

  return `
    <div id="chess-interactive-board-container" style="background: #1c1917; border: 2px solid #44403c; border-radius: 12px; padding: 20px; box-shadow: 0 12px 30px rgba(0,0,0,0.35); color: #fafaf9; margin-bottom: 22px;">
      
      <!-- Top Title Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-bottom: 1.5px solid #38332e; padding-bottom: 12px; margin-bottom: ${isCollapsed ? '0' : '16px'};">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; border-radius: 8px; background: #292524; border: 1px solid #57534e; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #d4af37;">
            ${chessState.puzzleCategory === 'beginner' ? '🌱' : '♟'}
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <h3 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.22rem; color: #f5f5f4; font-weight: 700; letter-spacing: 0.02em;">
                ${chessState.puzzleCategory === 'beginner' ? '🌱 Rookie Academy: Training Missions' : 'The Beth Harmon Ceiling Board'}
              </h3>
              <span style="background: #362f27; color: #d4af37; border: 1px solid #785338; font-size: 0.68rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; font-family: monospace;">
                ${chessState.puzzleCategory === 'beginner' ? 'Rookie Mission' : 'Tactical Starter'} · Challenge ${puzzleIdx + 1} of ${totalPuzzles}
              </span>
              ${
                chessState.sandboxMode
                  ? `<span style="background: #0369a1; color: #bae6fd; border: 1px solid #38bdf8; font-size: 0.68rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; font-family: monospace;">🔓 Free Move Sandbox</span>`
                  : `<span style="background: #14532d; color: #86efac; border: 1px solid #22c55e; font-size: 0.68rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; font-family: monospace;">⚔ Movable Pieces</span>`
              }
            </div>
            <div style="font-size: 0.8rem; color: #a8a29e; margin-top: 2px;">
              ${isCollapsed ? 'Click "Expand Board" to calculate the tactical combination.' : chessState.puzzleCategory === 'beginner' ? 'Solve interactive challenges designed for beginners and Year 7s! Tap or drag pieces to make your move.' : 'Tap or drag pieces to play the combination. Practice on your screen before Period 6 pairings begin!'}
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <!-- Category Switcher Pill -->
          <div style="display: inline-flex; background: #292524; border: 1px solid #57534e; border-radius: 6px; padding: 2px;">
            <button type="button" onclick="window.setBethHarmonCategory('grandmaster')" style="${chessState.puzzleCategory !== 'beginner' ? 'background: #d4af37; color: #1c1917; font-weight: 800;' : 'background: transparent; color: #a8a29e; font-weight: 600;'} border: none; padding: 4px 10px; border-radius: 4px; font-size: 0.72rem; cursor: pointer; transition: all 0.15s ease;">
              🏆 Grandmaster Legends
            </button>
            <button type="button" onclick="window.setBethHarmonCategory('beginner')" style="${chessState.puzzleCategory === 'beginner' ? 'background: #22c55e; color: #14532d; font-weight: 800;' : 'background: transparent; color: #a8a29e; font-weight: 600;'} border: none; padding: 4px 10px; border-radius: 4px; font-size: 0.72rem; cursor: pointer; transition: all 0.15s ease;">
              🌱 Rookie Missions (${BEGINNER_ROOKIE_PUZZLES.length})
            </button>
          </div>

          <button type="button" onclick="window.cycleBethHarmonPuzzle(-1)" style="background: #292524; color: #fafaf9; border: 1px solid #57534e; width: 32px; height: 32px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold;" title="Previous Puzzle">
            ◀
          </button>
          <span style="font-family: monospace; font-size: 0.8rem; color: #d4af37; padding: 0 4px;">
            ${puzzleIdx + 1}/${totalPuzzles}
          </span>
          <button type="button" onclick="window.cycleBethHarmonPuzzle(1)" style="background: #292524; color: #fafaf9; border: 1px solid #57534e; width: 32px; height: 32px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; font-weight: bold;" title="Next Puzzle">
            ▶
          </button>
          <button type="button" onclick="window.toggleStarterPuzzleCollapse()" style="background: #292524; color: #e7e5e4; border: 1px solid #57534e; font-size: 0.76rem; font-weight: 700; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-left: 6px;">
            ${isCollapsed ? '▾ Expand Board' : '▴ Collapse'}
          </button>
        </div>
      </div>

      ${
        isCollapsed
          ? ''
          : `
      <!-- Main Interactive Content: 2-Column Split -->
      <div style="display: grid; grid-template-columns: minmax(280px, 340px) 1fr; gap: 24px; align-items: start;">
        
        <!-- Left: The Visual 8x8 Chessboard with Movable Pieces -->
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="width: 100%; max-width: 320px; aspect-ratio: 1; display: grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(8, 1fr); border: 3.5px solid #44403c; border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); overflow: hidden;">
            ${squaresHtml}
          </div>
          <div style="font-size: 0.72rem; color: #78716c; margin-top: 8px; font-family: monospace; text-align: center;">
            [White at bottom · Black at top · Tap/drag pieces to move]
          </div>

          <!-- Board Interactive Toolbar -->
          <div style="display: flex; gap: 8px; justify-content: center; margin-top: 10px; flex-wrap: wrap; width: 100%;">
            <button type="button" onclick="window.resetBethHarmonBoard()" style="background: #292524; color: #fafaf9; border: 1px solid #57534e; padding: 6px 12px; border-radius: 4px; font-size: 0.76rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" title="Reset pieces to starting puzzle layout">
              <span>↺</span> Reset Position
            </button>
            <button type="button" onclick="window.toggleBethHarmonSandbox()" style="background: ${chessState.sandboxMode ? '#0284c7' : '#292524'}; color: #fafaf9; border: 1px solid ${chessState.sandboxMode ? '#38bdf8' : '#57534e'}; padding: 6px 12px; border-radius: 4px; font-size: 0.76rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" title="Toggle Free Move Sandbox to experiment freely with any piece">
              <span>${chessState.sandboxMode ? '🔓 Free Move: ON' : '🔒 Challenge Mode'}</span>
            </button>
          </div>

          <!-- Selection helper text -->
          ${
            chessState.selectedSquare
              ? `
            <div style="background: rgba(217, 119, 6, 0.15); border: 1px solid #d97706; color: #fef3c7; padding: 6px 12px; border-radius: 4px; margin-top: 8px; font-size: 0.78rem; text-align: center; font-family: monospace; width: 100%; box-sizing: border-box;">
              Selected: <strong>${String.fromCharCode(97 + chessState.selectedSquare[1])}${8 - chessState.selectedSquare[0]}</strong> — Tap destination square to move!
            </div>
          `
              : ''
          }

          <!-- Feedback Alert Banner -->
          ${
            chessState.puzzleFeedback
              ? `
            <div style="background: ${chessState.puzzleFeedback.type === 'success' ? '#14532d' : chessState.puzzleFeedback.type === 'error' ? '#7f1d1d' : '#1e293b'}; border: 1px solid ${chessState.puzzleFeedback.type === 'success' ? '#22c55e' : chessState.puzzleFeedback.type === 'error' ? '#ef4444' : '#38bdf8'}; color: #fafafa; padding: 10px 14px; border-radius: 6px; margin-top: 10px; font-size: 0.84rem; line-height: 1.45; animation: fadeInUp 0.2s ease; width: 100%; box-sizing: border-box;">
              ${chessState.puzzleFeedback.text}
            </div>
          `
              : ''
          }
        </div>

        <!-- Right: Story, Clues & Interactive Controls -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
              <span style="background: #292524; color: #f59e0b; border: 1px solid #78350f; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 4px;">
                ${puzzle.tag}
              </span>
              <span style="font-size: 0.75rem; color: #a8a29e; font-weight: 600;">
                Difficulty: <strong style="color: #f5f5f4;">${puzzle.difficulty}</strong>
              </span>
              ${
                puzzle.steps && puzzle.steps.length > 0
                  ? `
                <span style="background: #27272a; color: #38bdf8; border: 1px solid #0369a1; font-size: 0.72rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; font-family: monospace;">
                  Step ${Math.min((chessState.puzzleMoveStep || 0) + 1, puzzle.steps.length)}/${puzzle.steps.length}
                </span>
              `
                  : ''
              }
            </div>
            <h4 style="margin: 0 0 6px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.25rem; color: #f5f5f4;">
              ${puzzle.title}
            </h4>
            <div style="font-size: 0.88rem; font-weight: 800; color: #d4af37; font-family: monospace; margin-bottom: 8px;">
              ⚔ ${puzzle.toMove}
            </div>
            <p style="margin: 0; font-size: 0.86rem; color: #d6d3d1; line-height: 1.55;">
              ${puzzle.intro}
            </p>
          </div>

          <!-- Interactive Action Buttons -->
          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px;">
            <button type="button" onclick="window.toggleBethHarmonHint()" style="background: #292524; color: #f59e0b; border: 1px solid #78350f; padding: 8px 14px; border-radius: 4px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <span>💡</span> ${chessState.showBethHarmonHint ? 'Hide Hint' : 'Show Tactical Hint'}
            </button>
            <button type="button" onclick="window.toggleBethHarmonSolution()" style="background: #292524; color: #22c55e; border: 1px solid #14532d; padding: 8px 14px; border-radius: 4px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <span>♛</span> ${chessState.showBethHarmonSolution ? 'Hide Solution' : 'Reveal Solution'}
            </button>
          </div>

          <!-- Hint Box -->
          ${
            chessState.showBethHarmonHint
              ? `
            <div style="background: #292524; border-left: 3px solid #f59e0b; border-radius: 0 6px 6px 0; padding: 10px 14px; font-size: 0.84rem; color: #fef3c7; line-height: 1.45; animation: fadeIn 0.2s ease-out;">
              <strong>Tactical Clue:</strong> ${puzzle.hint}
            </div>
          `
              : ''
          }

          <!-- Solution Box -->
          ${
            chessState.showBethHarmonSolution
              ? `
            <div style="background: #14281d; border: 1px solid #166534; border-left: 3px solid #22c55e; border-radius: 0 6px 6px 0; padding: 12px 14px; animation: fadeIn 0.2s ease-out;">
              <div style="font-size: 0.76rem; font-weight: 800; color: #86efac; text-transform: uppercase; font-family: monospace; margin-bottom: 4px;">
                Expected Continuation:
              </div>
              <div style="font-size: 1.05rem; font-weight: 900; color: #ffffff; font-family: monospace; margin-bottom: 6px;">
                ${puzzle.solutionMoves}
              </div>
              <div style="font-size: 0.82rem; color: #bbf7d0; line-height: 1.45;">
                ${puzzle.solutionExplanation}
              </div>
            </div>
          `
              : ''
          }

        </div>
      </div>
      `
      }
    </div>
  `;
}

// Window controls & handlers for Beth Harmon Ceiling Board & Rookie Training Board
function executeBethMove(fromR, fromC, toR, toC, puzzle) {
  const sourcePiece = chessState.activePuzzleBoard[fromR][fromC];

  // 1. Free Move Sandbox Mode
  if (chessState.sandboxMode) {
    chessState.activePuzzleBoard[toR][toC] = sourcePiece;
    chessState.activePuzzleBoard[fromR][fromC] = '.';
    chessState.selectedSquare = null;
    chessState.puzzleFeedback = {
      text: `Moved ${sourcePiece} to ${String.fromCharCode(97 + toC)}${8 - toR} (Sandbox Mode)`,
      type: 'info',
    };
    renderChessHubView();
    return;
  }

  // 2. Tactical Challenge Mode
  const steps = puzzle.steps || [];
  const stepIdx = chessState.puzzleMoveStep || 0;
  const currentStep = steps[stepIdx];

  if (!currentStep) {
    chessState.selectedSquare = null;
    chessState.puzzleFeedback = {
      text: 'Puzzle already solved! Press "Reset Position" or switch to the next challenge.',
      type: 'success',
    };
    renderChessHubView();
    return;
  }

  // Check expected origin
  const matchFrom = currentStep.expectedFrom[0] === fromR && currentStep.expectedFrom[1] === fromC;

  // Check expected destination (can be single [r, c] or array of valid squares)
  let matchTo = false;
  if (Array.isArray(currentStep.expectedTo[0])) {
    matchTo = currentStep.expectedTo.some(([er, ec]) => er === toR && ec === toC);
  } else {
    matchTo = currentStep.expectedTo[0] === toR && currentStep.expectedTo[1] === toC;
  }

  if (matchFrom && matchTo) {
    // Correct Move! Auto-promote pawns reaching the back rank
    let finalPiece = sourcePiece;
    if (sourcePiece === 'P' && toR === 0) finalPiece = 'Q';
    if (sourcePiece === 'p' && toR === 7) finalPiece = 'q';

    chessState.activePuzzleBoard[toR][toC] = finalPiece;
    chessState.activePuzzleBoard[fromR][fromC] = '.';
    chessState.selectedSquare = null;

    if (currentStep.replyFrom && currentStep.replyTo) {
      chessState.puzzleFeedback = { text: currentStep.successMsg, type: 'success' };
      renderChessHubView();

      // Schedule opponent reply
      setTimeout(() => {
        const repFrom = currentStep.replyFrom;
        const repTo = currentStep.replyTo;
        const repPiece =
          currentStep.replyPiece || chessState.activePuzzleBoard[repFrom[0]][repFrom[1]];
        chessState.activePuzzleBoard[repTo][toC] = repPiece;
        chessState.activePuzzleBoard[repFrom[0]][repFrom[1]] = '.';
        chessState.puzzleMoveStep = stepIdx + 1;
        chessState.puzzleFeedback = { text: currentStep.replyMsg, type: 'info' };
        renderChessHubView();
      }, 700);
    } else {
      chessState.puzzleMoveStep = stepIdx + 1;
      chessState.puzzleStatus = 'solved';
      chessState.puzzleFeedback = { text: currentStep.successMsg, type: 'success' };
      showChessToast(currentStep.successMsg, 'success');
      renderChessHubView();
    }
  } else {
    chessState.selectedSquare = null;
    chessState.puzzleFeedback = {
      text: `❌ Not quite right! Re-calculate your move or view the clue. (Hint: ${puzzle.hint})`,
      type: 'error',
    };
    renderChessHubView();
  }
}

window.handleBethSquareClick = function (r, c) {
  const puzzles = getActivePuzzles();
  const puzzle = puzzles[(chessState.currentPuzzleIdx || 0) % puzzles.length];
  if (!puzzle) return;

  const currentBoard = chessState.activePuzzleBoard;
  if (!currentBoard) return;
  const targetPiece = currentBoard[r][c];

  // If nothing is selected yet
  if (!chessState.selectedSquare) {
    if (targetPiece && targetPiece !== '.') {
      chessState.selectedSquare = [r, c];
      renderChessHubView();
    }
    return;
  }

  // Square was already selected
  const [fromR, fromC] = chessState.selectedSquare;
  const sourcePiece = currentBoard[fromR][fromC];

  // If clicking the same square: deselect
  if (fromR === r && fromC === c) {
    chessState.selectedSquare = null;
    renderChessHubView();
    return;
  }

  // If clicking another piece of the same color/side: switch selection
  const isWhiteSource = /[KQBNRP]/.test(sourcePiece);
  const isWhiteTarget = /[KQBNRP]/.test(targetPiece);
  if (!chessState.sandboxMode && targetPiece !== '.' && isWhiteSource === isWhiteTarget) {
    chessState.selectedSquare = [r, c];
    renderChessHubView();
    return;
  }

  // Attempt the move
  executeBethMove(fromR, fromC, r, c, puzzle);
};

window.handleBethDragStart = function (e, r, c) {
  if (e && e.dataTransfer) {
    e.dataTransfer.setData('text/plain', JSON.stringify({ r, c }));
  }
};

window.handleBethDrop = function (e, toR, toC) {
  if (e && e.preventDefault) e.preventDefault();
  try {
    const raw = e.dataTransfer ? e.dataTransfer.getData('text/plain') : null;
    if (!raw) return;
    const { r: fromR, c: fromC } = JSON.parse(raw);
    const puzzles = getActivePuzzles();
    const puzzle = puzzles[(chessState.currentPuzzleIdx || 0) % puzzles.length];
    if (puzzle) {
      executeBethMove(fromR, fromC, toR, toC, puzzle);
    }
  } catch (err) {
    console.warn('Chess drag-drop error:', err);
  }
};

window.resetBethHarmonBoard = function () {
  const puzzles = getActivePuzzles();
  const puzzle = puzzles[(chessState.currentPuzzleIdx || 0) % puzzles.length];
  if (puzzle) {
    chessState.activePuzzleBoard = JSON.parse(JSON.stringify(puzzle.board));
    chessState.selectedSquare = null;
    chessState.puzzleMoveStep = 0;
    chessState.puzzleStatus = 'idle';
    chessState.puzzleFeedback = { text: 'Board reset to starting puzzle position.', type: 'info' };
    renderChessHubView();
  }
};

window.toggleBethHarmonSandbox = function () {
  chessState.sandboxMode = !chessState.sandboxMode;
  chessState.selectedSquare = null;
  chessState.puzzleFeedback = {
    text: chessState.sandboxMode
      ? '🔓 Free Move Sandbox ENABLED: You can freely move any piece anywhere on the board!'
      : '🔒 Tactical Challenge Mode ENABLED: Moves will be evaluated against the puzzle solution.',
    type: 'info',
  };
  renderChessHubView();
};

window.cycleBethHarmonPuzzle = function (delta) {
  const total = getActivePuzzles();
  const puzzleCount = total.length || 1;
  chessState.currentPuzzleIdx =
    ((chessState.currentPuzzleIdx || 0) + delta + puzzleCount) % puzzleCount;
  chessState.showBethHarmonHint = false;
  chessState.showBethHarmonSolution = false;
  chessState.activePuzzleBoard = null;
  chessState.selectedSquare = null;
  chessState.puzzleMoveStep = 0;
  chessState.puzzleStatus = 'idle';
  chessState.puzzleFeedback = null;
  renderChessHubView();
};

window.setBethHarmonCategory = function (category) {
  chessState.puzzleCategory = category;
  chessState.currentPuzzleIdx = 0;
  chessState.activePuzzleBoard = null;
  chessState.selectedSquare = null;
  chessState.puzzleMoveStep = 0;
  chessState.puzzleStatus = 'idle';
  chessState.puzzleFeedback = null;
  chessState.showBethHarmonHint = false;
  chessState.showBethHarmonSolution = false;
  renderChessHubView();
};

window.selectRookieMission = function (missionIdx) {
  chessState.puzzleCategory = 'beginner';
  chessState.currentPuzzleIdx = missionIdx;
  chessState.activePuzzleBoard = null;
  chessState.selectedSquare = null;
  chessState.puzzleMoveStep = 0;
  chessState.puzzleStatus = 'idle';
  chessState.puzzleFeedback = null;
  chessState.showBethHarmonHint = false;
  chessState.showBethHarmonSolution = false;
  chessState.showStarterPuzzle = true;
  renderChessHubView();
  const boardEl = document.getElementById('chess-interactive-board-container');
  if (boardEl) {
    boardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

window.toggleBethHarmonHint = function () {
  chessState.showBethHarmonHint = !chessState.showBethHarmonHint;
  renderChessHubView();
};

window.toggleBethHarmonSolution = function () {
  chessState.showBethHarmonSolution = !chessState.showBethHarmonSolution;
  renderChessHubView();
};

window.toggleStarterPuzzleCollapse = function () {
  chessState.showStarterPuzzle = !chessState.showStarterPuzzle;
  renderChessHubView();
};

// Mini 5x5 Movement Board Grid for 11-Year-Olds
function renderMiniMovementGrid(piece) {
  const targetMap = new Set(piece.matrixCoords.map(([r, c]) => `${r},${c}`));
  let squares = '';
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const isCenter = r === 2 && c === 2;
      const isTarget = targetMap.has(`${r},${c}`);
      const isLight = (r + c) % 2 === 0;
      const bg = isLight ? '#f5ede0' : '#855938';

      let inner = '';
      if (isCenter) {
        inner = `<span style="font-size: 1.65rem; line-height: 1; color: #ffffff; text-shadow: 0 1px 3px rgba(0,0,0,0.9); font-family: 'Apple Symbols', 'Segoe UI Symbol', serif;">${piece.symbol}</span>`;
      } else if (isTarget) {
        inner = `<div style="width: 12px; height: 12px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px #22c55e;"></div>`;
      }

      squares += `
        <div style="background: ${isCenter ? '#d97706' : bg}; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; position: relative; border-radius: ${isCenter ? '3px' : '0'};">
          ${inner}
        </div>
      `;
    }
  }

  return `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0;">
      <div style="width: 130px; aspect-ratio: 1; display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(5, 1fr); border: 2.5px solid #44403c; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); background: #1c1917;">
        ${squares}
      </div>
      <div style="font-size: 0.68rem; font-weight: 700; color: #78716c; font-family: monospace; text-transform: uppercase; letter-spacing: 0.05em;">
        Visual Move Map
      </div>
    </div>
  `;
}

// 2. Rookie Academy View: Complete Beginner Guide for 11-Year-Olds
function renderBeginnersTab() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px;">

      <!-- Welcoming Hero Banner -->
      <div style="background: linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%); border-radius: 12px; padding: 24px; color: #ffffff; box-shadow: 0 8px 24px rgba(20, 83, 45, 0.25); position: relative; overflow: hidden;">
        <div style="position: absolute; right: -20px; bottom: -30px; font-size: 9rem; color: rgba(255,255,255,0.06); font-family: 'Playfair Display', serif; pointer-events: none; user-select: none;">
          🌱
        </div>
        
        <div style="position: relative; z-index: 2;">
          <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); padding: 4px 10px; border-radius: 20px; font-size: 0.76rem; font-weight: 700; font-family: monospace; letter-spacing: 0.05em; margin-bottom: 12px; text-transform: uppercase;">
            <span>🌱</span> Rookie Academy · Year 7 &amp; New Players Hub
          </div>
          <h2 style="margin: 0 0 8px 0; font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.4rem, 2.5vw, 1.85rem); font-weight: 800; color: #ffffff; line-height: 1.25;">
            How to Play Chess: Visual Beginner Guide
          </h2>
          <p style="margin: 0 0 16px 0; font-size: 0.95rem; color: #dcfce7; line-height: 1.55; max-width: 780px;">
            Never touched a chess piece before? You are in the right place! Chess is an ancient battle of wits, courage, and clever tactics. Below you’ll find everything explained in <strong>simple picture terms</strong>: how all 6 warriors move, how to set up the board, the lifesaving C-P-R check rule, and interactive missions you can solve right on your screen!
          </p>

          <!-- Quick Anchor Navigation -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <a href="#rookie-warriors" style="background: rgba(255,255,255,0.92); color: #14532d; text-decoration: none; padding: 7px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
              <span>♟</span> The 6 Warriors
            </a>
            <a href="#rookie-cpr" style="background: rgba(255,255,255,0.92); color: #14532d; text-decoration: none; padding: 7px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
              <span>🛡</span> C-P-R Check Rule
            </a>
            <a href="#rookie-setup" style="background: rgba(255,255,255,0.92); color: #14532d; text-decoration: none; padding: 7px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
              <span>📐</span> Board Setup
            </a>
            <a href="#rookie-superpowers" style="background: rgba(255,255,255,0.92); color: #14532d; text-decoration: none; padding: 7px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
              <span>⚡</span> Superpowers
            </a>
            <a href="#rookie-training-board" style="background: #fbbf24; color: #1c1917; text-decoration: none; padding: 7px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
              <span>🎯</span> Interactive Missions (${BEGINNER_ROOKIE_PUZZLES.length})
            </a>
          </div>
        </div>
      </div>

      <!-- Section 1: Meet the 6 Warriors -->
      <div id="rookie-warriors">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.35rem; color: #1c1917; font-weight: 800;">
              ♟️ Meet the 6 Warriors: Visual Movement Guide
            </h3>
            <div style="font-size: 0.84rem; color: #78716c; margin-top: 2px;">
              Every piece moves in a distinct pattern. Study the green dots on the mini-boards to see legal movement squares!
            </div>
          </div>
          <span style="font-size: 0.78rem; font-weight: 700; color: #166534; background: #dcfce7; border: 1px solid #86efac; padding: 3px 8px; border-radius: 4px; font-family: monospace;">
            6 Unique Movement Patterns
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 16px;">
          ${BEGINNER_PIECES_GUIDE.map((p) => {
            return `
            <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between; gap: 14px;">
              <div>
                <!-- Piece Header -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 44px; height: 44px; border-radius: 8px; background: #fafaf9; border: 1.5px solid #e7e5e4; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; line-height: 1; flex-shrink: 0; font-family: 'Apple Symbols', 'Segoe UI Symbol', serif; color: #1c1917;">
                      ${p.symbol}
                    </div>
                    <div>
                      <h4 style="margin: 0; font-size: 1.15rem; color: #0f172a; font-weight: 800;">${p.name}</h4>
                      <div style="font-size: 0.8rem; font-weight: 700; color: ${p.colorHex}; font-style: italic;">"${p.nickname}"</div>
                    </div>
                  </div>
                  <span style="background: #f8fafc; border: 1px solid #cbd5e1; color: #334155; font-size: 0.74rem; font-weight: 800; padding: 4px 8px; border-radius: 6px; font-family: monospace; white-space: nowrap;">
                    ⭐ ${p.value}
                  </span>
                </div>

                <!-- Split Body: Visual Grid + Rules -->
                <div style="display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap;">
                  ${renderMiniMovementGrid(p)}
                  
                  <div style="flex: 1; min-width: 180px;">
                    <div style="background: #f8fafc; border-left: 3px solid ${p.colorHex}; padding: 8px 12px; border-radius: 0 6px 6px 0; font-size: 0.82rem; font-weight: 700; color: #1e293b; margin-bottom: 10px; line-height: 1.4;">
                      ${p.movementSummary}
                    </div>

                    <ul style="margin: 0; padding-left: 18px; font-size: 0.8rem; color: #475569; line-height: 1.45; display: flex; flex-direction: column; gap: 4px;">
                      ${p.rules.map((r) => `<li>${r}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Mnemonic Rhyme Callout -->
              <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 6px; padding: 8px 12px; font-size: 0.78rem; color: #854d0e; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.95rem;">💡</span>
                <div>
                  <strong>Memory Rhyme:</strong> <em>${p.funMnemonic}</em>
                </div>
              </div>
            </div>
          `;
          }).join('')}
        </div>
      </div>

      <!-- Section 2: Golden Memory Anchors (CPR, Board Setup, 3 Opening Habits) -->
      <div>
        <h3 style="margin: 0 0 14px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.35rem; color: #1c1917; font-weight: 800;">
          🛡️ Golden Rules &amp; Lifesaving Habits
        </h3>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px;">
          
          <!-- Card 1: The C-P-R Rule -->
          <div id="rookie-cpr" style="background: #ffffff; border: 1.5px solid #fecaca; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 8px; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;">
                <i class="fa-solid fa-shield-heart"></i>
              </div>
              <div>
                <h4 style="margin: 0; font-size: 1.1rem; color: #991b1b; font-weight: 800;">The C-P-R Check Defense</h4>
                <div style="font-size: 0.75rem; color: #dc2626; font-weight: 700; text-transform: uppercase; font-family: monospace;">When Opponent Says "CHECK!"</div>
              </div>
            </div>

            <p style="margin: 0 0 12px 0; font-size: 0.84rem; color: #475569; line-height: 1.45;">
              When your King is attacked, you are in <strong>CHECK</strong>! You must defend him immediately using C-P-R:
            </p>

            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 8px 12px; font-size: 0.82rem; color: #991b1b;">
                <strong>C — Capture:</strong> Knock out the enemy piece attacking your King!
              </div>
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 8px 12px; font-size: 0.82rem; color: #991b1b;">
                <strong>P — Protect (Block):</strong> Slide another piece in between like a bodyguard! <em>(Note: You cannot block a jumping Knight!)</em>
              </div>
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 8px 12px; font-size: 0.82rem; color: #991b1b;">
                <strong>R — Run:</strong> Step your King to a safe square with no danger!
              </div>
            </div>

            <div style="background: #450a0a; color: #fecaca; border-radius: 6px; padding: 10px 14px; font-size: 0.8rem; font-weight: 700; text-align: center; font-family: monospace;">
              "If you cannot Capture, Protect, or Run — it is CHECKMATE and the game is won!"
            </div>
          </div>

          <!-- Card 2: Board Setup Rules -->
          <div id="rookie-setup" style="background: #ffffff; border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 8px; background: #dbeafe; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;">
                <i class="fa-solid fa-chess-board"></i>
              </div>
              <div>
                <h4 style="margin: 0; font-size: 1.1rem; color: #1e40af; font-weight: 800;">Board Setup: The 2 Golden Tests</h4>
                <div style="font-size: 0.75rem; color: #2563eb; font-weight: 700; text-transform: uppercase; font-family: monospace;">Pre-Game Ritual</div>
              </div>
            </div>

            <p style="margin: 0 0 12px 0; font-size: 0.84rem; color: #475569; line-height: 1.45;">
              Before making a single move on Thursday, always double-check these two universal rules:
            </p>

            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
              <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 8px 12px; font-size: 0.82rem; color: #1e40af;">
                <strong>1. "White on Right":</strong> Look at the bottom-right corner square closest to your right hand. It <strong>MUST</strong> be a white/light square! If it's dark, rotate your board 90 degrees.
              </div>
              <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 8px 12px; font-size: 0.82rem; color: #1e40af;">
                <strong>2. "Queen on Her Color":</strong> The White Queen sits on White (d1). The Black Queen sits on Black (d8). Kings sit on the square right beside them!
              </div>
            </div>

            <div style="background: #172554; color: #bfdbfe; border-radius: 6px; padding: 10px 14px; font-size: 0.8rem; font-weight: 700; text-align: center; font-family: monospace;">
              "White on the right, Queen on her color — every single game!"
            </div>
          </div>

          <!-- Card 3: 3 Opening Habits -->
          <div id="rookie-opening" style="background: #ffffff; border: 1.5px solid #fef08a; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 8px; background: #fef9c3; color: #ca8a04; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;">
                <i class="fa-solid fa-trophy"></i>
              </div>
              <div>
                <h4 style="margin: 0; font-size: 1.1rem; color: #854d0e; font-weight: 800;">The 3 Golden Opening Habits</h4>
                <div style="font-size: 0.75rem; color: #ca8a04; font-weight: 700; text-transform: uppercase; font-family: monospace;">First 5–8 Moves of Every Game</div>
              </div>
            </div>

            <p style="margin: 0 0 12px 0; font-size: 0.84rem; color: #475569; line-height: 1.45;">
              Follow these three habits in order to gain a winning start in every match:
            </p>

            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
              <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 6px; padding: 8px 12px; font-size: 0.82rem; color: #854d0e;">
                <strong>1. Claim the Center:</strong> Push your center pawn forward 2 squares (e4 or d4) to control the middle battlefield.
              </div>
              <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 6px; padding: 8px 12px; font-size: 0.82rem; color: #854d0e;">
                <strong>2. Develop Knights &amp; Bishops:</strong> Bring out your minor pieces toward the center before touching your Queen.
              </div>
              <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 6px; padding: 8px 12px; font-size: 0.82rem; color: #854d0e;">
                <strong>3. Castle Your King:</strong> Castle within the first 6–8 moves to hide your King safely behind pawns!
              </div>
            </div>

            <div style="background: #422006; color: #fef08a; border-radius: 6px; padding: 10px 14px; font-size: 0.8rem; font-weight: 700; text-align: center; font-family: monospace;">
              "Center, Knights, Castle — that is how History Hub champions start!"
            </div>
          </div>

        </div>
      </div>

      <!-- Section 3: Special Superpowers Explained -->
      <div id="rookie-superpowers">
        <h3 style="margin: 0 0 14px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.35rem; color: #1c1917; font-weight: 800;">
          ⚡ Special Chess Superpowers
        </h3>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
          
          <!-- Superpower 1: Castling -->
          <div style="background: #ffffff; border: 1.5px solid #bbf7d0; border-radius: 12px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 1.5rem;">🏰</span>
              <div>
                <h4 style="margin: 0; font-size: 1.05rem; color: #14532d; font-weight: 800;">Castling (The King &amp; Castle Dance)</h4>
                <div style="font-size: 0.72rem; color: #16a34a; font-weight: 700; font-family: monospace;">Move TWO pieces in ONE turn!</div>
              </div>
            </div>
            <p style="margin: 0 0 10px 0; font-size: 0.82rem; color: #475569; line-height: 1.45;">
              The King moves <strong>TWO squares</strong> towards the corner Rook. The Rook leaps right over the King to sit beside him!
            </p>
            <div style="font-size: 0.78rem; color: #166534; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 6px 10px; border-radius: 6px; line-height: 1.4;">
              ✓ King and Rook must not have moved yet.<br>
              ✓ Squares between them must be empty.<br>
              ✓ King cannot castle while in check or through check!
            </div>
          </div>

          <!-- Superpower 2: Pawn Promotion -->
          <div style="background: #ffffff; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 1.5rem;">👑</span>
              <div>
                <h4 style="margin: 0; font-size: 1.05rem; color: #9a3412; font-weight: 800;">Pawn Promotion (Coronation)</h4>
                <div style="font-size: 0.72rem; color: #ea580c; font-weight: 700; font-family: monospace;">Transform 1pt into 9pts!</div>
              </div>
            </div>
            <p style="margin: 0 0 10px 0; font-size: 0.82rem; color: #475569; line-height: 1.45;">
              When a brave 1-point pawn marches across the entire board and touches the 8th rank, it instantly <strong>transforms</strong> into any piece you want!
            </p>
            <div style="font-size: 0.78rem; color: #9a3412; background: #fff7ed; border: 1px solid #fed7aa; padding: 6px 10px; border-radius: 6px; line-height: 1.4;">
              💡 99% of the time, choose a <strong>Queen</strong>! You can have more than one Queen on the board at the same time.
            </div>
          </div>

          <!-- Superpower 3: En Passant -->
          <div style="background: #ffffff; border: 1.5px solid #e9d5ff; border-radius: 12px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 1.5rem;">⚔</span>
              <div>
                <h4 style="margin: 0; font-size: 1.05rem; color: #6b21a8; font-weight: 800;">En Passant (The Sneaky Passing Catch)</h4>
                <div style="font-size: 0.72rem; color: #9333ea; font-weight: 700; font-family: monospace;">French for "In Passing"</div>
              </div>
            </div>
            <p style="margin: 0 0 10px 0; font-size: 0.82rem; color: #475569; line-height: 1.45;">
              If an enemy pawn leaps two squares forward to land directly alongside your pawn on rank 5, you can capture it diagonally on your very next turn as if it only moved one square!
            </p>
            <div style="font-size: 0.78rem; color: #6b21a8; background: #faf5ff; border: 1px solid #e9d5ff; padding: 6px 10px; border-radius: 6px; line-height: 1.4;">
              ⏳ Must be done immediately on the next move, or the superpower vanishes!
            </div>
          </div>

        </div>
      </div>

      <!-- Section 4: Dedicated Interactive Rookie Training Missions -->
      <div id="rookie-training-board" style="border-top: 2px solid #e7e5e4; padding-top: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.35rem; color: #1c1917; font-weight: 800;">
              🎯 Rookie Training Missions: Practice on the Live Board
            </h3>
            <div style="font-size: 0.84rem; color: #78716c; margin-top: 2px;">
              Practice moving the pieces! Click a mission below to load it on the interactive training board:
            </div>
          </div>
          <span style="font-size: 0.78rem; font-weight: 700; color: #854d0e; background: #fef08a; border: 1px solid #fde047; padding: 3px 8px; border-radius: 4px; font-family: monospace;">
            Movable Pieces &amp; Instant Clues
          </span>
        </div>

        <!-- Mission Selector Quick Buttons -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
          ${BEGINNER_ROOKIE_PUZZLES.map((m, idx) => {
            const isSelected =
              chessState.puzzleCategory === 'beginner' &&
              (chessState.currentPuzzleIdx || 0) === idx;
            return `
            <button type="button" onclick="window.selectRookieMission(${idx})" style="background: ${isSelected ? '#15803d' : '#ffffff'}; color: ${isSelected ? '#ffffff' : '#334155'}; border: 1.5px solid ${isSelected ? '#15803d' : '#cbd5e1'}; padding: 8px 14px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.15s ease;">
              <span>${isSelected ? '★' : '•'}</span> ${m.title.split(':')[0]}: ${m.tag}
            </button>
          `;
          }).join('')}
        </div>

        <!-- Embedded Interactive Live Board -->
        ${renderBethHarmonCeilingBoard()}
      </div>

    </div>
  `;
}

// Helper: Render Active Board Pairings Grid with Direct 1-Click Result Scoring
function renderActiveBoardPairingsGrid() {
  const pairings = chessState.activePairings;
  if (!pairings || pairings.length === 0) {
    return '';
  }

  const activeBoards = pairings.filter((p) => !p.isBye);
  const byeBoards = pairings.filter((p) => p.isBye);
  const completedCount = activeBoards.filter((p) => p.completed).length;
  const hasHistory =
    Array.isArray(chessState.pairingsHistory) && chessState.pairingsHistory.length > 0;

  // Calculate free pupils for smart notification banner
  const busyIds = new Set();
  activeBoards.forEach((b) => {
    if (!b.completed) {
      if (b.white && b.white.id) busyIds.add(b.white.id);
      if (b.black && b.black.id) busyIds.add(b.black.id);
    }
  });
  const checkedInSet = new Set(chessState.checkedInPlayerIds || []);
  const freePupils = chessState.players.filter((p) => checkedInSet.has(p.id) && !busyIds.has(p.id));
  const hasInProgress = activeBoards.some((b) => !b.completed);

  return `
    <div id="classroom-pairings-grid" style="background: #ffffff; border: 2px solid #38bdf8; border-radius: 12px; padding: 22px; box-shadow: 0 8px 24px rgba(2, 132, 199, 0.08); margin-top: 14px;">
      
      <!-- Grid Top Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 12px; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 14px;">
        <div>
          <div style="display: inline-flex; align-items: center; gap: 6px; background: #e0f2fe; color: #0284c7; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">
            <i class="fa-solid fa-chess-board"></i> Classroom Match Grid
          </div>
          <h3 style="margin: 4px 0 0 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.35rem; color: #0f172a; font-weight: 700;">
            Today's Board Pairings (${activeBoards.length} Boards In Play)
          </h3>
          <div style="font-size: 0.84rem; color: #64748b; margin-top: 2px;">
            ${completedCount} of ${activeBoards.length} games finished · Tap result directly on board card to score!
          </div>
        </div>

        ${
          chessState.userRole === 'teacher'
            ? `
        <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
          <button type="button" onclick="window.pairFreePupilsOnMatchGrid()" style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; border: 1.5px solid #34d399; font-weight: 800; font-size: 0.82rem; padding: 8px 14px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(5, 150, 105, 0.25);" title="Pair pupils who have completed their games without disturbing ongoing matches">
            <span>⚡</span> Pair Free Pupils
          </button>
          <button type="button" onclick="window.undoPairings()" style="background: ${hasHistory ? '#fef3c7' : '#f8fafc'}; color: ${hasHistory ? '#92400e' : '#94a3b8'}; border: 1.5px solid ${hasHistory ? '#fde68a' : '#e2e8f0'}; font-weight: 700; font-size: 0.82rem; padding: 8px 14px; border-radius: 6px; cursor: ${hasHistory ? 'pointer' : 'not-allowed'}; display: inline-flex; align-items: center; gap: 6px;" ${!hasHistory ? 'disabled' : ''} title="Revert to previous board pairings">
            <span>↩️</span> Undo Re-Pair
          </button>
          <button type="button" onclick="window.resetPairings()" style="background: #fef2f2; color: #dc2626; border: 1.5px solid #fca5a5; font-weight: 700; font-size: 0.82rem; padding: 8px 14px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" title="Clear and reset all current board pairings if you made a mistake or want to start afresh">
            <span>🧹</span> Reset Pairings
          </button>
          <button type="button" onclick="window.confirmNewRoundAll()" style="background: #f8fafc; color: #334155; border: 1.5px solid #cbd5e1; font-weight: 700; font-size: 0.82rem; padding: 8px 14px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" title="Start a fresh round for all checked-in pupils">
            <i class="fa-solid fa-shuffle"></i> New Round (All)
          </button>
          <button type="button" onclick="window.printFidePairingSheet()" style="background: #1c1917; color: #d4af37; border: 1.5px solid #44403c; font-weight: 700; font-size: 0.82rem; padding: 8px 14px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" title="Print official A4 pairing sheet">
            <i class="fa-solid fa-print"></i> Print Sheet (A4)
          </button>
          <button type="button" onclick="window.toggleChessWhiteboardMode(true)" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border: none; font-weight: 800; font-size: 0.82rem; padding: 8px 16px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba(2, 132, 199, 0.25);" title="Display on classroom interactive whiteboard">
            <span>📺</span> Projector Mode (W)
          </button>
        </div>
        `
            : `
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          ${renderCloudSyncStatusPill('pupil')}
          <span style="font-size: 0.8rem; color: #64748b; font-weight: 600;">Auto-syncing with teacher screen</span>
        </div>
        `
        }
      </div>

      <!-- Smart Free Pupils Notification Banner -->
      ${
        freePupils.length >= 2 && hasInProgress
          ? `
      <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1.5px solid #34d399; border-radius: 8px; padding: 10px 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; box-shadow: 0 2px 6px rgba(5, 150, 105, 0.1);">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.25rem;">⚡</span>
          <div>
            <div style="font-weight: 800; color: #065f46; font-size: 0.88rem;">
              ${freePupils.length} Pupils Ready for Next Match:
            </div>
            <div style="font-size: 0.8rem; color: #047857; margin-top: 1px;">
              ${freePupils.map((p) => p.name).join(', ')}
            </div>
          </div>
        </div>
        <button type="button" onclick="window.pairFreePupilsOnMatchGrid()" style="background: #059669; color: #ffffff; border: none; font-weight: 800; font-size: 0.82rem; padding: 8px 16px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);">
          <span>⚡</span> Pair Free Pupils on Board ${activeBoards.length + 1}
        </button>
      </div>
      `
          : ''
      }

      ${
        chessState.userRole === 'pupil'
          ? `
      <!-- Pupil "Find My Board" Widget -->
      <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.3rem;">🔍</span>
          <div>
            <div style="font-size: 0.86rem; font-weight: 800; color: #166534;">Find Your Board:</div>
            <div style="font-size: 0.78rem; color: #15803d;">Select your name to instantly highlight your active board and piece color</div>
          </div>
        </div>
        <select id="pupil-my-board-select" onchange="window.highlightPupilBoard(this.value)" style="padding: 7px 14px; border-radius: 6px; border: 1.5px solid #16a34a; font-weight: 700; font-size: 0.85rem; background: #ffffff; color: #0f172a; cursor: pointer;">
          <option value="">-- Select Your Name --</option>
          ${chessState.players.map((pl) => `<option value="${pl.id}">${pl.name} (${pl.house})</option>`).join('')}
        </select>
      </div>
      `
          : ''
      }

      <!-- Boards Grid (Responsive Cards) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px;">
        ${activeBoards
          .map((p) => {
            const wH = HOUSES[p.white.house] || {
              name: p.white.house,
              color: '#2563eb',
              bgLight: '#eff6ff',
              borderColor: '#bfdbfe',
            };
            const bH = HOUSES[p.black.house] || {
              name: p.black.house,
              color: '#dc2626',
              bgLight: '#fef2f2',
              borderColor: '#fecaca',
            };
            const isDone = !!p.completed;
            const wName =
              DEFAULT_LOCAL_NAME_MAP[p.white.id] ||
              CALLSIGN_TO_FIRST_NAME[p.white.name] ||
              p.white.realName ||
              p.white.name;
            const bName = p.black
              ? DEFAULT_LOCAL_NAME_MAP[p.black.id] ||
                CALLSIGN_TO_FIRST_NAME[p.black.name] ||
                p.black.realName ||
                p.black.name
              : 'TBD';

            return `
            <div class="board-pairing-card" data-white-id="${p.white.id}" data-black-id="${p.black ? p.black.id : ''}" style="background: ${isDone ? '#f0fdf4' : '#ffffff'}; border: 2px solid ${isDone ? '#86efac' : '#e2e8f0'}; border-radius: 10px; padding: 14px 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.2s;">
              
              <!-- Board Header -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid ${isDone ? '#bbf7d0' : '#f1f5f9'}; padding-bottom: 8px;">
                <span style="background: ${isDone ? '#16a34a' : '#0284c7'}; color: #ffffff; font-family: monospace; font-size: 0.76rem; font-weight: 800; padding: 2px 8px; border-radius: 4px;">
                  BOARD ${p.board} ${p.isCoachMatch || p.isCoachGame ? '· COACH MATCH' : ''}
                </span>
                <span style="font-size: 0.74rem; font-weight: 700; color: #64748b;">
                  ${wH.name} vs ${bH.name}
                </span>
              </div>

              <!-- Players Row -->
              <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: center; margin-bottom: 12px;">
                
                <!-- White Player -->
                <div style="background: #f8fafc; border: 1.5px solid ${wH.borderColor}; border-radius: 6px; padding: 8px 10px;">
                  <div style="font-size: 0.65rem; color: #64748b; font-weight: 700; text-transform: uppercase;">♔ White</div>
                  <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${wName}
                  </div>
                  <div style="display: flex; align-items: center; gap: 4px; margin-top: 3px;">
                    <span style="background: ${wH.bgLight}; color: ${wH.color}; font-size: 0.68rem; font-weight: 700; padding: 1px 6px; border-radius: 3px; border: 1px solid ${wH.borderColor};">
                      ${wH.name}
                    </span>
                  </div>
                </div>

                <div style="font-size: 0.8rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; text-align: center;">
                  vs
                </div>

                <!-- Black Player -->
                <div style="background: #f8fafc; border: 1.5px solid ${bH.borderColor}; border-radius: 6px; padding: 8px 10px; text-align: right;">
                  <div style="font-size: 0.65rem; color: #64748b; font-weight: 700; text-transform: uppercase;">♚ Black</div>
                  <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${bName}
                  </div>
                  <div style="display: flex; align-items: center; gap: 4px; margin-top: 3px; justify-content: flex-end;">
                    <span style="background: ${bH.bgLight}; color: ${bH.color}; font-size: 0.68rem; font-weight: 700; padding: 1px 6px; border-radius: 3px; border: 1px solid ${bH.borderColor};">
                      ${bH.name}
                    </span>
                  </div>
                </div>

              </div>

              <!-- Scoring Actions -->
              ${
                chessState.userRole === 'pupil'
                  ? isDone
                    ? `
                <div style="background: #dcfce7; border: 1px solid #86efac; border-radius: 6px; padding: 8px 12px; font-size: 0.82rem; font-weight: 800; color: #15803d; text-align: center;">
                  <i class="fa-solid fa-circle-check"></i>
                  Result: <strong>${p.result}</strong> · ${p.result === '1-0' ? wName + ' Won' : p.result === '0-1' ? bName + ' Won' : 'Draw'}
                </div>
                `
                    : `
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 8px 12px; font-size: 0.8rem; font-weight: 700; color: #1e40af; text-align: center;">
                  <i class="fa-solid fa-clock"></i> Match in progress...
                </div>
                `
                  : isDone
                    ? `
                <div style="background: #dcfce7; border: 1px solid #86efac; border-radius: 6px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                  <div style="font-size: 0.82rem; font-weight: 800; color: #15803d; display: flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>Result: <strong>${p.result}</strong> · ${p.result === '1-0' ? wName + ' Won (+3)' : p.result === '0-1' ? bName + ' Won (+3)' : 'Draw (+2 each)'}</span>
                  </div>
                  <button type="button" onclick="window.undoBoardResult(${p.board})" style="background: #ffffff; color: #475569; border: 1px solid #cbd5e1; font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; cursor: pointer;" title="Undo and re-score this game">
                    ↺ Change
                  </button>
                </div>
              `
                    : `
                <div>
                  <div style="font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px; text-align: center;">
                    ⚡ Tap 1-Click Game Result:
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;">
                    <button type="button" onclick="window.recordQuickMatchResult(${p.board}, 'white')"
                            style="background: #ffffff; color: #0f172a; border: 1.5px solid #cbd5e1; border-radius: 6px; padding: 8px 4px; font-weight: 800; font-size: 0.8rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px; transition: all 0.15s;"
                            onmouseover="this.style.borderColor='#2563eb';this.style.background='#eff6ff'"
                            onmouseout="this.style.borderColor='#cbd5e1';this.style.background='#ffffff'"
                            title="White wins (+3 House pts)">
                      <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">♔ ${wName} Won</span>
                      <span style="font-size: 0.65rem; color: #16a34a; font-weight: 700;">+3 Pts</span>
                    </button>

                    <button type="button" onclick="window.recordQuickMatchResult(${p.board}, 'draw')"
                            style="background: #f8fafc; color: #334155; border: 1.5px solid #cbd5e1; border-radius: 6px; padding: 8px 4px; font-weight: 800; font-size: 0.8rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px; transition: all 0.15s;"
                            onmouseover="this.style.borderColor='#ca8a04';this.style.background='#fefce8'"
                            onmouseout="this.style.borderColor='#cbd5e1';this.style.background='#f8fafc'"
                            title="Draw: +2 House pts each">
                      <span>½ Draw</span>
                      <span style="font-size: 0.65rem; color: #ca8a04; font-weight: 700;">+2 Pts Each</span>
                    </button>

                    <button type="button" onclick="window.recordQuickMatchResult(${p.board}, 'black')"
                            style="background: #1e293b; color: #fafaf9; border: 1.5px solid #0f172a; border-radius: 6px; padding: 8px 4px; font-weight: 800; font-size: 0.8rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px; transition: all 0.15s;"
                            onmouseover="this.style.background='#0f172a';this.style.borderColor='#dc2626'"
                            onmouseout="this.style.background='#1e293b';this.style.borderColor='#0f172a'"
                            title="Black wins (+3 House pts)">
                      <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">♚ ${bName} Won</span>
                      <span style="font-size: 0.65rem; color: #86efac; font-weight: 700;">+3 Pts</span>
                    </button>
                  </div>
                </div>
              `
              }

            </div>
          `;
          })
          .join('')}

        ${byeBoards
          .map((p) => {
            const h = HOUSES[p.white.house] || { name: p.white.house, color: '#64748b' };
            const byeName =
              DEFAULT_LOCAL_NAME_MAP[p.white.id] ||
              CALLSIGN_TO_FIRST_NAME[p.white.name] ||
              p.white.realName ||
              p.white.name;
            return `
            <div style="background: #f8fafc; border: 2px dashed #94a3b8; border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; height: 40px; border-radius: 8px; background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                  👑
                </div>
                <div>
                  <div style="font-size: 0.72rem; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px;">
                    Odd Number of Pupils · Rotating Bye
                  </div>
                  <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a;">
                    ${byeName} <span style="font-size: 0.8rem; font-weight: 700; color: ${h.color || '#64748b'};">(${h.name})</span>
                  </div>
                  <div style="font-size: 0.78rem; color: #64748b; margin-top: 2px;">
                    +1 House Point awarded · <strong>Guaranteed first priority</strong> when a board finishes or next round pairs!
                  </div>
                </div>
              </div>
              <div style="display: flex; gap: 8px; align-items: center;">
                <span style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; font-size: 0.75rem; font-weight: 800; padding: 6px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.04em;">
                  Rotating Bye · +1 Pt
                </span>
              </div>
            </div>
          `;
          })
          .join('')}
      </div>

    </div>
  `;
}

// ============================================================================
// ⚡ TEACHER QUICK DESK (Simplified Match Logger & Instant Pupil Register)
// Designed for fast, 1-handed match logging during lively Period 6 classroom play
// ============================================================================
function renderQuickDeskTab(players = []) {
  if (chessState.userRole !== 'teacher') {
    return `
      <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 48px 24px; text-align: center; color: #64748b;">
        <div style="font-size: 2rem; margin-bottom: 12px;">🔒</div>
        <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 1.25rem;">Teacher Mode Required</h3>
        <p style="margin: 0 0 16px 0; font-size: 0.88rem;">Only verified teachers can record match scores or register pupils.</p>
        <button onclick="window.promptTeacherUnlock()" style="background: #0f172a; color: #ffffff; border: none; font-weight: 700; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
          Unlock Teacher Console
        </button>
      </div>
    `;
  }

  const allPlayers = [...chessState.players].sort((a, b) => {
    const ptsDiff = calculatePlayerPoints(b) - calculatePlayerPoints(a);
    if (ptsDiff !== 0) return ptsDiff;
    return (a.rank || 99) - (b.rank || 99);
  });
  const recentMatches = (chessState.matches || []).slice(0, 8);

  const renderPlayerSelectOptions = (selectedId) => {
    return `
      <option value="">-- Choose Pupil --</option>
      ${allPlayers
        .map((p) => {
          const house = HOUSES[p.house]?.name || p.house;
          const isSel = p.id === selectedId ? 'selected' : '';
          const pts = calculatePlayerPoints(p);
          return `<option value="${p.id}" ${isSel}>#${p.rank} ${p.name} · ${pts} pts (${house} • Elo ${p.rating})</option>`;
        })
        .join('')}
    `;
  };

  return `
    <div style="display: flex; flex-direction: column; gap: 20px; font-family: 'Outfit', sans-serif;">
      
      <!-- Top Alert / Security Badge Strip -->
      <div style="background: #0f172a; border-left: 4px solid #10b981; border-radius: 10px; padding: 14px 20px; color: #ffffff; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.18);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 1.4rem; line-height: 1;">⚡</span>
          <div>
            <div style="font-weight: 800; font-size: 1rem; color: #f8fafc; letter-spacing: 0.02em;">
              Teacher Quick Desk · Period 6 Match &amp; Pupil Logger
            </div>
            <div style="font-size: 0.8rem; color: #94a3b8; line-height: 1.4;">
              🔒 <strong>Strict Teacher Lock:</strong> Only this authenticated teacher laptop can award points. Pupil phones see read-only standings.
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button type="button" onclick="window.sortLadderByPoints()" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; border: 1px solid #fbbf24; font-size: 0.76rem; font-weight: 800; padding: 6px 12px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);" title="Automatically sort all pupils by total points (largest to smallest)">
            <span>⚡</span> Auto-Sort by Points
          </button>
          <span style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #6ee7b7; font-size: 0.72rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em;">
            Teacher Verified ✓
          </span>
          <button onclick="window.switchChessTab('signin')" style="background: rgba(255,255,255,0.08); color: #cbd5e1; border: 1px solid #475569; font-size: 0.76rem; font-weight: 700; padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: all 0.15s;" title="Switch to the automated Swiss round pairing generator">
            Swiss Pairings Grid ➔
          </button>
        </div>
      </div>

      <!-- Main Two-Column Quick Action Panel -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 20px;">
        
        <!-- CARD 1: 3-Tap Direct Match Scorer -->
        <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; box-shadow: 0 6px 16px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 10px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: #eff6ff; color: #2563eb; width: 34px; height: 34px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-size: 1.15rem; font-weight: 800;">⚔</span>
                <div>
                  <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #0f172a;">1-Tap Match Result Logger</h3>
                  <div style="font-size: 0.75rem; color: #64748b;">Select any two pupils and tap the winner — awards points instantly</div>
                </div>
              </div>
            </div>

            <!-- Player Pickers -->
            <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
              <div style="margin-bottom: 10px;">
                <label style="display: block; font-size: 0.78rem; font-weight: 800; color: #334155; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                  ♔ Player 1 (White / First Pupil):
                </label>
                <select id="quickdesk-p1" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 6px; border: 1.5px solid #cbd5e1; font-size: 0.92rem; font-weight: 700; color: #0f172a; background: #ffffff;">
                  ${renderPlayerSelectOptions(chessState.quickDeskP1Id || '')}
                </select>
              </div>

              <div style="display: flex; justify-content: center; margin: -2px 0 6px 0;">
                <button type="button" onclick="window.swapQuickDeskPlayers()" style="background: #ffffff; border: 1px solid #cbd5e1; color: #475569; padding: 3px 12px; border-radius: 20px; font-size: 0.74rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                  ⇄ Swap Players
                </button>
              </div>

              <div>
                <label style="display: block; font-size: 0.78rem; font-weight: 800; color: #334155; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                  ♚ Player 2 (Black / Opponent):
                </label>
                <select id="quickdesk-p2" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 6px; border: 1.5px solid #cbd5e1; font-size: 0.92rem; font-weight: 700; color: #0f172a; background: #ffffff;">
                  ${renderPlayerSelectOptions(chessState.quickDeskP2Id || '')}
                </select>
              </div>
            </div>

            <!-- Instant Outcome Buttons (3 Big Tap Targets) -->
            <div>
              <div style="font-size: 0.76rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
                Tap Game Outcome (Instant Save):
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                <button type="button" onclick="window.recordDirectTeacherMatch('p1')" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: none; padding: 14px 8px; border-radius: 8px; font-weight: 800; font-size: 0.88rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transition: transform 0.1s;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'">
                  <span style="font-size: 1.25rem;">🏆</span>
                  <span>Player 1 Won</span>
                  <span style="font-size: 0.68rem; opacity: 0.9; font-weight: 600;">+3 / +1 Pts</span>
                </button>

                <button type="button" onclick="window.recordDirectTeacherMatch('draw')" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; border: none; padding: 14px 8px; border-radius: 8px; font-weight: 800; font-size: 0.88rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); transition: transform 0.1s;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'">
                  <span style="font-size: 1.25rem;">🤝</span>
                  <span>Match Draw</span>
                  <span style="font-size: 0.68rem; opacity: 0.9; font-weight: 600;">+2 / +2 Pts</span>
                </button>

                <button type="button" onclick="window.recordDirectTeacherMatch('p2')" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; border: none; padding: 14px 8px; border-radius: 8px; font-weight: 800; font-size: 0.88rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: transform 0.1s;" onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'">
                  <span style="font-size: 1.25rem;">🏆</span>
                  <span>Player 2 Won</span>
                  <span style="font-size: 0.68rem; opacity: 0.9; font-weight: 600;">+3 / +1 Pts</span>
                </button>
              </div>
            </div>
          </div>

          <div style="margin-top: 16px; font-size: 0.73rem; color: #64748b; line-height: 1.4; border-top: 1px solid #f1f5f9; padding-top: 10px;">
            💡 <strong>Points rules:</strong> Winners score 3 points for their House; draws earn 2 points each; completing a match scores 1 participation point.
          </div>
        </div>

        <!-- CARD 2: Quick Register New Pupil -->
        <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 22px; box-shadow: 0 6px 16px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 10px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: #ecfdf5; color: #059669; width: 34px; height: 34px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-size: 1.15rem; font-weight: 800;">👤</span>
                <div>
                  <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #0f172a;">Quick Pupil Register</h3>
                  <div style="font-size: 0.75rem; color: #64748b;">Add a new pupil in 3 seconds · auto-checked in for today</div>
                </div>
              </div>
            </div>

            <form id="quickdesk-reg-form" onsubmit="window.handleQuickDeskRegister(event)">
              <div style="margin-bottom: 14px;">
                <label style="display: block; font-size: 0.78rem; font-weight: 800; color: #334155; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px;">
                  Pupil Name:
                </label>
                <input type="text" id="quickdesk-reg-name" required placeholder="e.g. Oliver M. or Emily T." style="width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 6px; border: 1.5px solid #cbd5e1; font-size: 0.95rem; font-weight: 600; color: #0f172a;" autocomplete="off">
                <div style="font-size: 0.72rem; color: #64748b; margin-top: 4px;">
                  🔒 Auto-sanitises full surnames to <strong>First Name + Last Initial</strong> for student privacy.
                </div>
              </div>

              <div style="margin-bottom: 16px;">
                <label style="display: block; font-size: 0.78rem; font-weight: 800; color: #334155; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px;">
                  School House:
                </label>
                <select id="quickdesk-reg-house" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 6px; border: 1.5px solid #cbd5e1; font-size: 0.92rem; font-weight: 700; color: #0f172a; background: #ffffff;">
                  <option value="victory">Victory (Blue · Trafalgar / Nelson)</option>
                  <option value="warrior" selected>Warrior (Red · Ironclad / Fortitude)</option>
                  <option value="dreadnought">Dreadnought (Green · Grand Fleet / Fisher)</option>
                  <option value="invincible">Invincible (Yellow · Battlecruiser / Speed)</option>
                </select>
              </div>

              <button type="submit" style="width: 100%; background: #0f172a; color: #ffffff; border: none; padding: 12px; border-radius: 8px; font-weight: 800; font-size: 0.92rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25); transition: background 0.15s;" onmouseover="this.style.background='#1e293b'" onmouseout="this.style.background='#0f172a'">
                <span>+</span> Register &amp; Select for Match
              </button>
            </form>
          </div>

          <div style="margin-top: 16px; background: #f8fafc; border-radius: 8px; padding: 10px 14px; border: 1px solid #e2e8f0; font-size: 0.75rem; color: #475569; display: flex; justify-content: space-between; align-items: center;">
            <span>Enrolled Pupils: <strong>${chessState.players.length}</strong></span>
            <span>Total Games Logged: <strong>${chessState.matches.length}</strong></span>
          </div>
        </div>

      </div>

      <!-- CARD 3: Recent Matches Feed with 1-Click Undo -->
      <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 20px; box-shadow: 0 6px 16px rgba(0,0,0,0.04);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.15rem;">📋</span>
            <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #0f172a;">
              Recent Matches Logged Today
            </h3>
          </div>
          <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">
            Showing last ${recentMatches.length} games
          </span>
        </div>

        ${
          recentMatches.length === 0
            ? `
          <div style="text-align: center; padding: 26px 16px; color: #94a3b8; font-size: 0.88rem;">
            No matches logged yet this session. When pupils finish a game, pick their names above and tap who won!
          </div>
        `
            : `
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${recentMatches
              .map((m) => {
                const wHouse = HOUSES[m.whiteHouse] || { name: m.whiteHouse, color: '#2563eb' };
                const bHouse = HOUSES[m.blackHouse] || { name: m.blackHouse, color: '#dc2626' };
                const isDraw = m.result === '½-½' || m.result === '1/2-1/2';
                const whiteWon = m.result === '1-0';
                const blackWon = m.result === '0-1';

                return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; flex-wrap: wrap; gap: 10px;">
                  <div style="display: flex; align-items: center; gap: 10px; font-size: 0.88rem;">
                    <!-- Result badge -->
                    <span style="font-family: monospace; font-weight: 900; font-size: 0.85rem; padding: 3px 8px; border-radius: 4px; background: ${isDraw ? '#fef3c7; color: #92400e; border: 1px solid #fde68a;' : '#0f172a; color: #ffffff;'}">
                      ${m.result}
                    </span>

                    <!-- Match Details -->
                    <div style="display: flex; align-items: center; gap: 6px; font-weight: 700;">
                      <span style="color: ${wHouse.color}; ${whiteWon ? 'text-decoration: underline; font-weight: 900;' : ''}">${m.white}</span>
                      <span style="font-size: 0.7rem; color: #94a3b8; font-weight: 500;">(${wHouse.name})</span>
                      <span style="color: #64748b; font-weight: 500; font-size: 0.78rem;">vs</span>
                      <span style="color: ${bHouse.color}; ${blackWon ? 'text-decoration: underline; font-weight: 900;' : ''}">${m.black}</span>
                      <span style="font-size: 0.7rem; color: #94a3b8; font-weight: 500;">(${bHouse.name})</span>
                    </div>

                    ${
                      whiteWon
                        ? `<span style="font-size: 0.72rem; color: #059669; font-weight: 800; background: #ecfdf5; padding: 2px 6px; border-radius: 4px;">🏆 ${m.white} Won</span>`
                        : blackWon
                          ? `<span style="font-size: 0.72rem; color: #059669; font-weight: 800; background: #ecfdf5; padding: 2px 6px; border-radius: 4px;">🏆 ${m.black} Won</span>`
                          : `<span style="font-size: 0.72rem; color: #d97706; font-weight: 800; background: #fffbeb; padding: 2px 6px; border-radius: 4px;">🤝 Draw</span>`
                    }
                  </div>

                  <!-- Safety Undo Button -->
                  <div>
                    <button type="button" onclick="window.undoQuickDeskMatch('${m.id}')" style="background: #ffffff; border: 1px solid #cbd5e1; color: #dc2626; font-size: 0.74rem; font-weight: 700; padding: 5px 10px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" title="Rollback this result if misreported or entered in error">
                      <span>✕</span> Undo Result
                    </button>
                  </div>
                </div>
              `;
              })
              .join('')}
          </div>
        `
        }
      </div>

    </div>
  `;
}

// 3. Pupil Self-Check-In & Attendance Management (Unified Period 6 Hub)
function renderSignInTab(players = []) {
  const notCheckedIn = chessState.players.filter(
    (p) => !chessState.checkedInPlayerIds.includes(p.id),
  );
  const checkedInPlayers = chessState.players.filter((p) =>
    chessState.checkedInPlayerIds.includes(p.id),
  );

  // Sort players for the league standings by total points descending
  const leaguePlayers = [...(players && players.length > 0 ? players : chessState.players)].sort(
    (a, b) => {
      const ptsA =
        a.won * SCORING_RULES.WIN +
        a.drawn * SCORING_RULES.DRAW +
        a.lost * SCORING_RULES.PARTICIPATION;
      const ptsB =
        b.won * SCORING_RULES.WIN +
        b.drawn * SCORING_RULES.DRAW +
        b.lost * SCORING_RULES.PARTICIPATION;
      if (ptsB !== ptsA) return ptsB - ptsA;
      return a.rank - b.rank;
    },
  );

  const hasPairings = chessState.activePairings && chessState.activePairings.length > 0;

  return `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Period 6 3-Step Session Runner Header -->
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 2px solid #3b82f6; border-radius: 12px; padding: 18px 22px; color: #ffffff; box-shadow: 0 8px 24px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(59, 130, 246, 0.2); border: 1px solid #3b82f6; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #93c5fd;">
              Period 6 Thursday · Quick Session Runner
            </div>
            <h3 style="margin: 4px 0 2px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.35rem; color: #ffffff; font-weight: 700;">
              Today's 3-Step Club Workflow
            </h3>
            <div style="font-size: 0.85rem; color: #cbd5e1;">
              <strong>1. Check In Pupils</strong> below &nbsp;·&nbsp; 
              <strong>2. Generate Board Pairings Grid</strong> &nbsp;·&nbsp; 
              <strong>3. Tap 1-Click Game Results</strong> on boards!
            </div>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button onclick="window.toggleChessWhiteboardMode(true)" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border: 1.5px solid #38bdf8; font-weight: 800; font-size: 0.85rem; padding: 10px 16px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);" title="Open big-screen Whiteboard Projector for interactive whiteboard (Press W)">
              <span>📺</span> Whiteboard Projector (W)
            </button>
            ${
              chessState.players.length > 0
                ? `
              <button onclick="window.checkInAllPlayers()" style="background: #16a34a; color: #ffffff; border: none; font-weight: 800; font-size: 0.84rem; padding: 10px 16px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba(22, 163, 74, 0.3);">
                <span>✓</span> Check In All (${chessState.players.length})
              </button>
            `
                : ''
            }

            <button onclick="window.generateThursdayPairings()" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border: 1.5px solid #38bdf8; font-weight: 800; font-size: 0.88rem; padding: 10px 18px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);">
              <span>⚔️</span> Generate Today's Board Pairings
            </button>

            ${
              hasPairings
                ? `
              <button onclick="window.resetPairings()" style="background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1.5px solid #ef4444; font-weight: 700; font-size: 0.85rem; padding: 10px 16px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);" title="Reset and clear all current board pairings if you made a mistake or want to start fresh">
                <span>🧹</span> Reset Pairings
              </button>
            `
                : ''
            }

            ${
              checkedInPlayers.length > 0
                ? `
              <button onclick="window.clearAttendance()" style="background: rgba(255,255,255,0.08); color: #cbd5e1; border: 1px solid #64748b; font-weight: 600; font-size: 0.8rem; padding: 9px 12px; border-radius: 8px; cursor: pointer;" title="Reset today's attendance checklist">
                <span>↺</span> Reset Check-In
              </button>
            `
                : ''
            }
          </div>
        </div>

        <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.82rem; color: #94a3b8; align-items: center;">
          <span>Checked In: <strong style="color: #4ade80;">${checkedInPlayers.length}</strong> of ${chessState.players.length} pupils</span>
          <span>·</span>
          <span>${
            checkedInPlayers.length % 2 === 0
              ? '<span style="color: #4ade80; font-weight: 700;">✓ Even count (' +
                checkedInPlayers.length / 2 +
                ' full boards)</span>'
              : '<span style="color: #38bdf8; font-weight: 700;">👑 Odd count (' +
                Math.floor(checkedInPlayers.length / 2) +
                ' boards + 1 rotating bye)</span>'
          }</span>
          <span>·</span>
          <span>Games logged this term: <strong style="color: #facc15;">${chessState.matches.length}</strong></span>
          ${hasPairings ? `<span>·</span><span style="color: #38bdf8; font-weight: 700;">⚔️ ${chessState.activePairings.filter((p) => !p.isBye).length} Boards Currently Paired</span>` : ''}
        </div>
      </div>

      <!-- Two-Column Form: Quick Check-In vs New Player Registration -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
        
        <!-- Column 1: New Pupil Registration -->
        <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 22px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <i class="fa-solid fa-user-plus" style="color: #10b981; font-size: 1.1rem;"></i>
            <h4 style="margin: 0; font-size: 1.1rem; color: #0f172a; font-weight: 800;">⚡ First Time Today? Quick Registration</h4>
          </div>
          <p style="font-size: 0.84rem; color: #64748b; margin: 0 0 16px 0; line-height: 1.45;">
            Register once to add pupil to permanent club roster &amp; House (takes 5 seconds · auto-checked in for today):
          </p>

          <form id="chess-self-reg-form" onsubmit="event.preventDefault(); window.handleSelfRegister(event); return false;">
            <div style="margin-bottom: 12px;">
              <label for="reg-name" style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 5px;">Pupil Full Name:</label>
              <input type="text" id="reg-name" required placeholder="e.g. Leo B. or Emily T." style="width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 8px; border: 1.5px solid #cbd5e1; font-size: 0.95rem; font-family: inherit; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='#10b981'" onblur="this.style.borderColor='#cbd5e1'; if(this.value && window.sanitizePupilName) this.value = window.sanitizePupilName(this.value);">
              <div style="font-size: 0.74rem; color: #64748b; margin-top: 5px; display: flex; align-items: center; gap: 5px; line-height: 1.3;">
                <i class="fa-solid fa-shield-halved" style="color: #6366f1;"></i>
                <span><strong>Pupil Privacy:</strong> Use first name (e.g. <em>Leo</em> or <em>Leo B.</em>). Full surnames are auto-sanitised.</span>
              </div>
            </div>

            <div style="margin-bottom: 16px;">
              <label for="reg-house" style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 5px;">School House:</label>
              <select id="reg-house" required style="width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 8px; border: 1.5px solid #cbd5e1; font-size: 0.88rem; font-family: inherit; background: #fff;">
                <option value="victory" selected>Victory (Blue)</option>
                <option value="warrior">Warrior (Red)</option>
                <option value="dreadnought">Dreadnought (Green)</option>
                <option value="invincible">Invincible (Yellow)</option>
              </select>
            </div>

            <button type="submit" id="btn-self-register-submit" style="width: 100%; background: #10b981; color: #ffffff; border: none; font-weight: 700; padding: 12px; border-radius: 8px; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transition: all 0.2s;" onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">
              <i class="fa-solid fa-user-check"></i> Register &amp; Check In for Today
            </button>
          </form>
        </div>

        <!-- Column 2: Returning Pupils (1-Click Sign-In) -->
        <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 22px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); display: flex; flex-direction: column;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <i class="fa-solid fa-user-check" style="color: #2563eb; font-size: 1.1rem;"></i>
            <h4 style="margin: 0; font-size: 1.1rem; color: #0f172a; font-weight: 800;">✓ Returning Pupils (1-Click Attendance)</h4>
          </div>
          <p style="font-size: 0.84rem; color: #64748b; margin: 0 0 16px 0; line-height: 1.45;">
            Tap a pupil's badge to mark them present today (absent pupils stay unchecked and are <strong>never</strong> paired):
          </p>

          ${
            notCheckedIn.length > 0
              ? `
            <div style="display: flex; flex-wrap: wrap; gap: 8px; max-height: 220px; overflow-y: auto; padding: 4px; margin-bottom: 8px;">
              ${notCheckedIn
                .map((p) => {
                  const h = HOUSES[p.house] || {
                    name: p.house,
                    color: '#64748b',
                    borderColor: '#cbd5e1',
                    bgLight: '#f1f5f9',
                  };
                  const cleanName =
                    DEFAULT_LOCAL_NAME_MAP[p.id] ||
                    CALLSIGN_TO_FIRST_NAME[p.name] ||
                    p.realName ||
                    p.name;
                  return `
                  <button type="button" onclick="window.checkInPlayer('${p.id}')" style="background: #f8fafc; border: 1.5px solid ${h.borderColor || '#cbd5e1'}; border-radius: 20px; padding: 6px 14px; font-size: 0.85rem; font-weight: 700; color: #1e293b; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s;" onmouseover="this.style.background='${h.bgLight || '#f1f5f9'}';this.style.borderColor='${h.color || '#3b82f6'}'" onmouseout="this.style.background='#f8fafc';this.style.borderColor='${h.borderColor || '#cbd5e1'}'">
                    <i class="fa-solid fa-circle-plus" style="color: ${h.color || '#3b82f6'};"></i>
                    <span>${cleanName} (${h.name})</span>
                  </button>
                `;
                })
                .join('')}
            </div>
          `
              : chessState.players.length > 0
                ? `
            <div style="background: #f0fdf4; border: 1.5px solid #86efac; padding: 24px 16px; border-radius: 8px; text-align: center; color: #15803d; font-weight: 700; font-size: 0.92rem; margin: auto 0;">
              <i class="fa-solid fa-circle-check" style="font-size: 1.8rem; margin-bottom: 8px; display: block;"></i>
              All registered pupils (${chessState.players.length}) are checked in for today!
            </div>
          `
                : `
            <div style="background: #f8fafc; border: 1.5px dashed #cbd5e1; padding: 24px 16px; border-radius: 8px; text-align: center; color: #64748b; font-size: 0.88rem; margin: auto 0;">
              <i class="fa-solid fa-user-group" style="font-size: 1.8rem; color: #cbd5e1; margin-bottom: 8px; display: block;"></i>
              No returning pupils yet.<br>
              <span style="font-size: 0.8rem; color: #94a3b8;">Use the form on the left to register your first pupil!</span>
            </div>
          `
          }
        </div>

      </div>

      <!-- Live Attendance Checklist Box -->
      <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 22px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h4 style="margin: 0; font-size: 1.15rem; color: #0f172a; font-weight: 800; display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #22c55e;"></span>
              Checked-In Roster for Today's Period 6 (${checkedInPlayers.length})
            </h4>
            <div style="font-size: 0.82rem; color: #64748b; margin-top: 2px;">
              Tap 'Match' to quickly record a game, or launch auto-pairings:
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" onclick="window.openLogMatchModal()" style="background: linear-gradient(135deg, #8b5cf6 0%, #7e22ce 100%); color: #fff; border: none; font-weight: 700; font-size: 0.85rem; padding: 8px 16px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba(139, 92, 246, 0.3);">
              <i class="fa-solid fa-bolt"></i> Log Match Result
            </button>
            <button type="button" onclick="window.switchChessTab('pairings')" style="background: #0284c7; color: #fff; border: none; font-weight: 700; font-size: 0.85rem; padding: 8px 16px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-shuffle"></i> Launch Pairings
            </button>
            <button type="button" onclick="window.switchChessTab('knockout')" style="background: #f59e0b; color: #000; border: none; font-weight: 800; font-size: 0.85rem; padding: 8px 16px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-sitemap"></i> Launch Knockout
            </button>
          </div>
        </div>

        ${
          checkedInPlayers.length === 0
            ? `
          <div style="background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 10px; padding: 36px 20px; text-align: center; color: #64748b;">
            <i class="fa-solid fa-user-clock" style="font-size: 2.2rem; color: #94a3b8; margin-bottom: 10px; display: block;"></i>
            <strong style="font-size: 1rem; color: #1e293b;">No pupils checked in for today's session yet.</strong><br>
            <span style="font-size: 0.85rem; color: #64748b; max-width: 440px; display: inline-block; margin-top: 4px;">
              Arriving pupils can type their name above to register, or returning pupils can tap their name chip to check in!
            </span>
          </div>
        `
            : `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px;">
            ${checkedInPlayers
              .map((p) => {
                const h = HOUSES[p.house];
                return `
                <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                  <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #22c55e; flex-shrink: 0; box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);"></span>
                    <div style="min-width: 0;">
                      <div style="font-weight: 800; font-size: 0.95rem; color: #0f172a;">${renderPlayerNameWithCallsign(p)}</div>
                      <div style="font-size: 0.74rem; color: ${h.color}; font-weight: 700;"> · ${h.name}</div>
                    </div>
                  </div>
                  <div style="display: flex; gap: 4px; flex-shrink: 0;">
                    <button type="button" onclick="window.prefillMatchModal('${p.id}', null)" title="Log match with ${p.name}" style="background: #f3e8ff; border: 1px solid #d8b4fe; color: #7e22ce; cursor: pointer; font-size: 0.78rem; padding: 5px 8px; border-radius: 4px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                      <i class="fa-solid fa-bolt"></i> Match
                    </button>
                    <button type="button" onclick="window.checkOutPlayer('${p.id}')" title="Mark absent / check out for today" style="background: #ffffff; border: 1px solid #cbd5e1; color: #64748b; cursor: pointer; font-size: 0.8rem; padding: 5px 8px; border-radius: 4px; transition: all 0.15s;" onmouseover="this.style.color='#ef4444';this.style.borderColor='#fca5a5'" onmouseout="this.style.color='#64748b';this.style.borderColor='#cbd5e1'">
                      <i class="fa-solid fa-user-minus"></i>
                    </button>
                    <button type="button" onclick="window.removePlayer('${p.id}')" title="Delete pupil from club" style="background: #fee2e2; border: 1px solid #fecaca; color: #dc2626; cursor: pointer; font-size: 0.8rem; padding: 5px 8px; border-radius: 4px; transition: all 0.15s;" onmouseover="this.style.background='#fca5a5'" onmouseout="this.style.background='#fee2e2'">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              `;
              })
              .join('')}
          </div>
        `
        }
      </div>

      <!-- Active Classroom Board Pairings Grid (Embedded directly in Period 6 Hub) -->
      ${
        hasPairings
          ? renderActiveBoardPairingsGrid()
          : checkedInPlayers.length >= 2
            ? `
        <div style="background: #eff6ff; border: 2px dashed #93c5fd; border-radius: 12px; padding: 24px 20px; text-align: center;">
          <div style="width: 50px; height: 50px; border-radius: 50%; background: #dbeafe; color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin: 0 auto 10px;">
            ⚔️
          </div>
          <h4 style="margin: 0 0 6px 0; font-size: 1.2rem; color: #1e40af; font-weight: 800;">
            Ready to Begin Period 6 Games!
          </h4>
          <p style="margin: 0 auto 16px auto; max-width: 520px; font-size: 0.88rem; color: #3b82f6; line-height: 1.45;">
            You have <strong>${checkedInPlayers.length}</strong> pupils checked in. Click below to automatically pair players across houses and assign classroom boards!
          </p>
          <button type="button" onclick="window.generateThursdayPairings()" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border: none; font-weight: 800; font-size: 0.92rem; padding: 12px 24px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);">
            <span>⚔️</span> Generate Today's Board Pairings Grid
          </button>
        </div>
      `
            : ''
      }

      <!-- The Beth Harmon Ceiling Board (Quiet Entry Starter / Weekly Challenge — Collapsed by Default) -->
      ${renderBethHarmonCeilingBoard()}

      <!-- Live League Standings & Ladder Section (Unified directly into Period 6 Hub!) -->
      <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 22px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h4 style="margin: 0; font-size: 1.22rem; color: #0f172a; font-weight: 800; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-trophy" style="color: #f59e0b;"></i>
              Current Period 6 League Standings (${leaguePlayers.length} Pupils)
            </h4>
            <div style="font-size: 0.84rem; color: #64748b; margin-top: 3px;">
              Every game completed scores: <strong style="color: #16a34a;">+3 Win</strong> · <strong style="color: #2563eb;">+2 Draw</strong> · <strong style="color: #64748b;">+1 Playing/Loss</strong>. Ranks update immediately!
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button onclick="window.openLogMatchModal()" style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: #ffffff; border: none; font-weight: 700; font-size: 0.85rem; padding: 8px 16px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba(109, 40, 217, 0.3);">
              <i class="fa-solid fa-plus-circle"></i> Log Match Result
            </button>
            <button onclick="window.switchChessTab('ladder')" style="background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; font-weight: 700; font-size: 0.85rem; padding: 8px 14px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-stairs"></i> Ladder View
            </button>
          </div>
        </div>

        ${
          leaguePlayers.length === 0
            ? `
          <div style="background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 10px; padding: 36px 20px; text-align: center; color: #64748b;">
            <i class="fa-solid fa-chess-board" style="font-size: 2.2rem; color: #94a3b8; margin-bottom: 10px; display: block;"></i>
            <strong style="font-size: 1rem; color: #1e293b;">The League Table is ready for your pupils.</strong><br>
            <span style="font-size: 0.85rem; color: #64748b; max-width: 440px; display: inline-block; margin-top: 4px;">
              Register your first pupil above, and they will immediately appear on the league leaderboard!
            </span>
          </div>
        `
            : `
          <div style="overflow-x: auto; border: 1.5px solid #44403c; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem; background: #faf8f5;">
              <thead>
                <tr style="background: #1c1917; color: #fafaf9; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.08em; font-family: monospace;">
                  <th style="padding: 10px 12px; width: 45px; text-align: center;">POS</th>
                  <th style="padding: 10px 12px; font-family: 'Playfair Display', Georgia, serif;">Player</th>
                  
                  <th style="padding: 10px 12px;">House</th>
                  <th style="padding: 10px 12px; text-align: center;">Session</th>
                  <th style="padding: 10px 12px; text-align: center;">P</th>
                  <th style="padding: 10px 12px; text-align: center;">W</th>
                  <th style="padding: 10px 12px; text-align: center;">D</th>
                  <th style="padding: 10px 12px; text-align: center;">L</th>
                  <th style="padding: 10px 12px; text-align: center;">Elo</th>
                  <th style="padding: 10px 12px; text-align: right;">Pts</th>
                  <th style="padding: 10px 12px; text-align: center;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${leaguePlayers
                  .map((p, idx) => {
                    const h = HOUSES[p.house] || {
                      name: p.house,
                      color: '#44403c',
                      bgLight: '#f5f2eb',
                      borderColor: '#d6d3d1',
                    };
                    const isCheckedIn = chessState.checkedInPlayerIds.includes(p.id);
                    const totalPts =
                      p.won * SCORING_RULES.WIN +
                      p.drawn * SCORING_RULES.DRAW +
                      p.lost * SCORING_RULES.PARTICIPATION;
                    const rankBadge =
                      idx === 0
                        ? '<span style="color: #c5a059; font-weight: 800; font-family: monospace;">★ 1</span>'
                        : idx === 1
                          ? '<span style="color: #78716c; font-weight: 800; font-family: monospace;">2</span>'
                          : idx === 2
                            ? '<span style="color: #a8a29e; font-weight: 800; font-family: monospace;">3</span>'
                            : `<span style="color: #78716c; font-weight: 600; font-family: monospace;">${idx + 1}</span>`;

                    return `
                    <tr style="border-bottom: 1px solid #e7e2d7; transition: background 0.15s ease; background: ${idx % 2 === 0 ? '#ffffff' : '#faf8f5'};" onmouseover="this.style.background='#f3efe6'" onmouseout="this.style.background='${idx % 2 === 0 ? '#ffffff' : '#faf8f5'}'">
                      <td style="padding: 10px 12px; text-align: center;">${rankBadge}</td>
                      <td style="padding: 10px 12px; font-weight: 700; color: #1c1917; font-family: 'Playfair Display', Georgia, serif; font-size: 0.95rem;">${renderPlayerNameWithCallsign(p)}</td>
                      
                      <td style="padding: 10px 12px;">
                        <span style="background: ${h.bgLight}; color: ${h.color}; border: 1px solid ${h.borderColor}; padding: 2px 8px; border-radius: 3px; font-size: 0.72rem; font-weight: 700; font-family: monospace;">
                          ${h.name}
                        </span>
                      </td>
                      <td style="padding: 10px 12px; text-align: center;">
                        ${
                          isCheckedIn
                            ? `<span style="background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; font-size: 0.7rem; font-weight: 700; padding: 2px 7px; border-radius: 3px; font-family: monospace;">PRESENT</span>`
                            : `<button onclick="window.checkInPlayer('${p.id}')" style="background: #faf8f5; color: #57534e; border: 1px solid #d6d3d1; font-size: 0.7rem; font-weight: 600; padding: 2px 7px; border-radius: 3px; cursor: pointer; font-family: monospace;">+ ROLL CALL</button>`
                        }
                      </td>
                      <td style="padding: 10px 12px; text-align: center; font-family: monospace; font-weight: 600;">${p.games}</td>
                      <td style="padding: 10px 12px; text-align: center; color: #166534; font-weight: 700; font-family: monospace;">${p.won}</td>
                      <td style="padding: 10px 12px; text-align: center; color: #1e40af; font-weight: 700; font-family: monospace;">${p.drawn}</td>
                      <td style="padding: 10px 12px; text-align: center; color: #78716c; font-family: monospace;">${p.lost}</td>
                      <td style="padding: 10px 12px; text-align: center; font-family: monospace; font-weight: 700; color: #1c1917;">${p.rating}</td>
                      <td style="padding: 10px 12px; text-align: right; font-weight: 800; color: #1c1917; font-size: 1rem; font-family: monospace;">+${totalPts}</td>
                      <td style="padding: 10px 12px; text-align: center;">
                        <button onclick="window.prefillMatchModal('${p.id}', null)" title="Log match with ${p.name}" style="background: #1c1917; border: 1px solid #1c1917; color: #fafaf9; cursor: pointer; font-size: 0.72rem; padding: 4px 10px; border-radius: 3px; font-weight: 700; font-family: monospace; display: inline-flex; align-items: center; gap: 4px;">
                          <span>♔</span> MATCH
                        </button>
                      </td>
                    </tr>
                  `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        `
        }
      </div>

    </div>
  `;
}

// 4. Automated Period 6 Thursday Matchmaker

function renderPairingsTab() {
  const checkedInCount = (chessState.checkedInPlayerIds || []).length;
  const totalPlayers = chessState.players.length;
  const isOdd = checkedInCount % 2 === 1;
  const fullBoards = Math.floor(checkedInCount / 2);
  const checkedInSet = new Set(chessState.checkedInPlayerIds || []);
  const activeBoardsCount = (chessState.activePairings || []).filter((p) => !p.isBye).length;

  return `
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 16px 18px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
      
      <!-- Top Title & Action Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 10px;">
        <div>
          <div style="display: inline-flex; align-items: center; gap: 6px; background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 10px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Period 6 Matchmaker
          </div>
          <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.28rem; color: #0f172a; margin: 3px 0 0 0; font-weight: 800;">
            Thursday Period 6 Board Pairings
          </h2>
          <div style="font-size: 0.78rem; color: #64748b; margin-top: 1px;">
            Auto-pairs arrived pupils by ranking and house rivalry · Record results directly on boards below!
          </div>
        </div>

        ${
          chessState.userRole === 'teacher'
            ? `
          <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
            <button type="button" onclick="window.handleQuickAutoPair()" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border: none; font-weight: 800; font-size: 0.82rem; padding: 8px 14px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3);">
              <span>⚔️</span> Auto-Pair Boards (${checkedInCount > 0 ? checkedInCount : totalPlayers})
            </button>
            <button type="button" onclick="window.printFidePairingSheet()" style="background: #1c1917; color: #d4af37; border: 1.5px solid #44403c; font-weight: 700; font-size: 0.8rem; padding: 8px 12px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" title="Print official A4 pairing sheet">
              <span>🖨</span> Print Sheet (A4)
            </button>
            <button type="button" onclick="window.toggleChessWhiteboardMode(true)" style="background: #f8fafc; color: #0284c7; border: 1.5px solid #bae6fd; font-weight: 800; font-size: 0.8rem; padding: 8px 12px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" title="Project onto whiteboard">
              <span>📺</span> Whiteboard (W)
            </button>
          </div>
        `
            : ''
        }
      </div>

      <!-- Pupil Attendance & Arrival Checklist Strip -->
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
          <div style="font-size: 0.78rem; font-weight: 800; color: #1e293b; text-transform: uppercase; letter-spacing: 0.03em; display: flex; align-items: center; gap: 6px;">
            <span>Arrived Pupils:</span>
            <span style="background: ${checkedInCount > 0 ? '#dcfce7' : '#e2e8f0'}; color: ${checkedInCount > 0 ? '#15803d' : '#64748b'}; padding: 1px 7px; border-radius: 8px; font-family: monospace; font-size: 0.76rem;">
              ${checkedInCount} of ${totalPlayers} Present
            </span>
            ${checkedInCount > 0 ? (isOdd ? `<span style="color: #0284c7; font-weight: 700; text-transform: none; font-size: 0.75rem;">(👑 ${fullBoards} boards + 1 rotating bye)</span>` : `<span style="color: #16a34a; font-weight: 700; text-transform: none; font-size: 0.75rem;">(✓ ${fullBoards} even boards)</span>`) : ''}
          </div>
          ${
            chessState.userRole === 'teacher'
              ? `
            <div style="display: flex; gap: 6px; align-items: center;">
              <button onclick="window.checkInAllPlayers()" style="background: none; border: none; color: #0284c7; font-weight: 700; font-size: 0.75rem; cursor: pointer;">Select All (${totalPlayers})</button>
              <span style="color: #cbd5e1;">·</span>
              <button onclick="window.clearAttendance()" style="background: none; border: none; color: #64748b; font-weight: 700; font-size: 0.75rem; cursor: pointer;">Deselect All</button>
            </div>
          `
              : ''
          }
        </div>

        <!-- 1-Tap Arrival Chips for Arriving Pupils -->
        <div style="display: flex; flex-wrap: wrap; gap: 5px;">
          ${chessState.players
            .map((p) => {
              const isChecked = checkedInSet.has(p.id);
              const h = HOUSES[p.house] || {
                color: '#475569',
                bgLight: '#f1f5f9',
                borderColor: '#cbd5e1',
                name: p.house,
              };
              const cleanName =
                DEFAULT_LOCAL_NAME_MAP[p.id] ||
                CALLSIGN_TO_FIRST_NAME[p.name] ||
                p.realName ||
                p.name;

              if (chessState.userRole !== 'teacher') {
                return `
                  <div style="background: ${isChecked ? '#dcfce7' : '#ffffff'}; border: 1px solid ${isChecked ? '#86efac' : '#e2e8f0'}; border-radius: 16px; padding: 3px 8px; font-size: 0.72rem; font-weight: 700; color: ${isChecked ? '#15803d' : '#94a3b8'}; display: inline-flex; align-items: center; gap: 4px;">
                    <span>${isChecked ? '✓' : '·'}</span>
                    <span>${cleanName}</span>
                  </div>
                `;
              }

              return `
                <button type="button" onclick="${isChecked ? `window.checkOutPlayer('${p.id}')` : `window.checkInPlayer('${p.id}')`}" style="background: ${isChecked ? '#dcfce7' : '#ffffff'}; border: 1.5px solid ${isChecked ? '#86efac' : '#cbd5e1'}; border-radius: 16px; padding: 3px 9px; font-size: 0.73rem; font-weight: 700; color: ${isChecked ? '#15803d' : '#475569'}; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s;" title="Click to toggle present/absent">
                  <span style="font-weight: 900;">${isChecked ? '✓' : '+'}</span>
                  <span>${cleanName}</span>
                  <span style="font-size: 0.64rem; color: ${h.color}; opacity: 0.85;">(${h.name})</span>
                </button>
              `;
            })
            .join('')}
        </div>
      </div>

      <!-- Generated Pairings Container -->
      <div id="pairings-results-box">
        ${
          chessState.activePairings && chessState.activePairings.length > 0
            ? renderActiveBoardPairingsGrid()
            : `
          <div style="text-align: center; padding: 32px 20px; border: 2px dashed #cbd5e1; border-radius: 10px; color: #64748b; background: #fafaf9;">
            <div style="font-size: 2rem; margin-bottom: 6px;">⚔️</div>
            <div style="font-size: 1rem; font-weight: 800; color: #0f172a; margin-bottom: 3px;">
              No classroom boards currently paired.
            </div>
            <div style="font-size: 0.82rem; color: #64748b; max-width: 440px; margin: 0 auto 14px auto; line-height: 1.45;">
              Mark arriving pupils above or click below to automatically balance player rankings and assign classroom boards for Period 6!
            </div>
            ${
              chessState.userRole === 'teacher'
                ? `
              <button type="button" onclick="window.handleQuickAutoPair()" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border: none; font-weight: 800; font-size: 0.85rem; padding: 10px 20px; border-radius: 7px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 3px 12px rgba(2, 132, 199, 0.35);">
                <span>⚔️</span> Auto-Pair Arrived Pupils Now
              </button>
            `
                : ''
            }
          </div>
        `
        }
      </div>

    </div>
  `;
}

// Classroom Attendance & Live Seeding Control Bar for Knockout Cup
function renderKnockoutAttendanceBar() {
  const checkedInSet = new Set(chessState.checkedInPlayerIds || []);
  const checkedInCount = checkedInSet.size;
  const isTeacher = chessState.userRole === 'teacher';

  return `
    <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
        <div>
          <div style="font-weight: 800; font-size: 0.95rem; color: #0f172a; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-clipboard-user" style="color: #0284c7;"></i>
            <span>Classroom Check-In: <strong style="color: #0284c7;">${checkedInCount}</strong> of ${chessState.players.length} Pupils Present</span>
          </div>
          <div style="font-size: 0.78rem; color: #64748b; margin-top: 3px; line-height: 1.4;">
            As pupils walk into Period 6, tap their name to mark them present. The tournament bracket will automatically seed only the pupils in the room based on their official ranking, giving top seeds a Round 1 Bye if attendance isn't an exact power of 2!
          </div>
        </div>

        ${
          isTeacher
            ? `
          <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
            <button type="button" onclick="window.checkInAllPlayers()" style="background: #ffffff; border: 1px solid #cbd5e1; color: #0284c7; padding: 5px 10px; border-radius: 5px; font-weight: 700; font-size: 0.74rem; cursor: pointer;">
              ✓ Check In All
            </button>
            <button type="button" onclick="window.clearAttendance()" style="background: #ffffff; border: 1px solid #cbd5e1; color: #64748b; padding: 5px 10px; border-radius: 5px; font-weight: 700; font-size: 0.74rem; cursor: pointer;">
              Clear All
            </button>
            <button type="button" onclick="window.generateKnockoutTournament()" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000; border: none; padding: 7px 16px; border-radius: 6px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.35);" title="Auto-populate seeded tournament bracket using arrived pupils">
              <span>⚡</span> Auto-Populate Seeded Bracket (${checkedInCount > 0 ? checkedInCount : chessState.players.length})
            </button>
          </div>
        `
            : ''
        }
      </div>

      <!-- Pupil Check-in Chips -->
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        ${chessState.players
          .map((p) => {
            const isChecked = checkedInSet.has(p.id);
            const cleanName =
              DEFAULT_LOCAL_NAME_MAP[p.id] ||
              CALLSIGN_TO_FIRST_NAME[p.name] ||
              p.realName ||
              p.name;

            if (!isTeacher) {
              return `
                <div style="background: ${isChecked ? '#dcfce7' : '#ffffff'}; border: 1px solid ${isChecked ? '#86efac' : '#e2e8f0'}; border-radius: 16px; padding: 3px 8px; font-size: 0.72rem; font-weight: 700; color: ${isChecked ? '#15803d' : '#94a3b8'}; display: inline-flex; align-items: center; gap: 4px;">
                  <span>${isChecked ? '✓' : '·'}</span>
                  <span>${cleanName}</span>
                </div>
              `;
            }

            return `
              <button type="button" onclick="${isChecked ? `window.checkOutPlayer('${p.id}')` : `window.checkInPlayer('${p.id}')`}" style="background: ${isChecked ? '#dcfce7' : '#ffffff'}; border: 1.5px solid ${isChecked ? '#86efac' : '#cbd5e1'}; border-radius: 16px; padding: 4px 10px; font-size: 0.74rem; font-weight: 700; color: ${isChecked ? '#15803d' : '#475569'}; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.15s;" title="Click to toggle present/absent">
                <span style="font-weight: 900;">${isChecked ? '✓' : '+'}</span>
                <span>${cleanName}</span>
                <span style="font-size: 0.65rem; color: #64748b; font-weight: 800;">(#${p.rank || '-'})</span>
              </button>
            `;
          })
          .join('')}
      </div>
    </div>
  `;
}

// Interactive Zoom, Fit-to-Screen, Drag-Pan & Full-Screen Helpers for Knockout Bracket
function applyBracketZoomInPlace(nextZoom) {
  const clamped = Math.max(50, Math.min(175, Math.round(nextZoom)));
  chessState.bracketZoom = clamped;
  const stage = document.getElementById('ko-bracket-zoom-stage');
  if (stage) {
    stage.style.zoom = (clamped / 100).toFixed(3);
  }
  document.querySelectorAll('.ko-zoom-readout').forEach((el) => {
    el.textContent = `${clamped}%`;
  });
}

if (typeof window !== 'undefined') {
  window.adjustBracketZoom = function (delta) {
    const cur = typeof chessState.bracketZoom === 'number' ? chessState.bracketZoom : 100;
    applyBracketZoomInPlace(cur + delta);
  };

  window.setBracketZoom = function (val) {
    applyBracketZoomInPlace(val);
  };

  window.fitKnockoutBracket = function () {
    const fsBody = document.getElementById('ko-fullscreen-scroll-body');
    const wrap = document.getElementById('ko-bracket-scroll-wrap') || fsBody;
    const stage = document.getElementById('ko-bracket-zoom-stage');
    const goldTree = document.getElementById('ko-gold-tree');
    if (!wrap || !stage) {
      applyBracketZoomInPlace(100);
      return;
    }
    stage.style.zoom = '1';
    const targetEl = goldTree || stage;
    const naturalW = targetEl.scrollWidth || 940;
    const availW = Math.max(320, (fsBody ? fsBody.clientWidth - 52 : wrap.clientWidth - 12));
    const fitPct = Math.max(55, Math.min(135, Math.floor((availW / naturalW) * 100)));
    applyBracketZoomInPlace(fitPct);
  };

  window.scrollBracketViewport = function (dy = 0, dx = 0) {
    const fsBody = document.getElementById('ko-fullscreen-scroll-body');
    if (fsBody) {
      fsBody.scrollBy({ top: dy, left: dx, behavior: 'smooth' });
      return;
    }
    const wrap = document.getElementById('ko-bracket-scroll-wrap');
    if (wrap && dx !== 0) {
      wrap.scrollBy({ left: dx, behavior: 'smooth' });
    }
    if (dy !== 0) {
      window.scrollBy({ top: dy, behavior: 'smooth' });
    }
  };

  window.jumpToBracketSection = function (sectionId) {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.setBracketTierFilter = function (tier) {
    chessState.bracketTierFilter = tier || 'all';
    renderChessHubView();
  };

  window.toggleBracketFullscreen = function (forceState) {
    const next =
      typeof forceState === 'boolean' ? forceState : !Boolean(chessState.bracketFullscreen);
    chessState.bracketFullscreen = next;

    if (next) {
      chessState.activeTab = 'knockout';
      if (
        document.documentElement &&
        document.documentElement.requestFullscreen &&
        !document.fullscreenElement
      ) {
        chessState.__nativeFsRequested = true;
        document.documentElement.requestFullscreen().catch(() => {
          chessState.__nativeFsRequested = false;
        });
      }
    } else if (document.fullscreenElement && document.exitFullscreen) {
      chessState.__nativeFsRequested = false;
      document.exitFullscreen().catch(() => {});
    }

    renderChessHubView();
    if (next) {
      setTimeout(() => {
        if (typeof window.fitKnockoutBracket === 'function') {
          const fsBody = document.getElementById('ko-fullscreen-scroll-body');
          const wrap = fsBody || document.getElementById('ko-bracket-scroll-wrap');
          const tree = document.getElementById('ko-gold-tree');
          if (wrap && tree && tree.scrollWidth > wrap.clientWidth) {
            window.fitKnockoutBracket();
          }
        }
      }, 60);
    }
  };

  if (!window.__koZoomPanBound) {
    window.__koZoomPanBound = true;
    let panPointerId = null;
    let panCandidate = false;
    let panActivated = false;
    let suppressNextClickUntil = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    let startScrollLeft = 0;
    let startScrollTop = 0;
    let activeHorizEl = null;
    let activeVertEl = null;

    // Suppress accidental button click right after a touch/mouse drag-pan gesture on smartboards
    window.addEventListener(
      'click',
      (e) => {
        if (Date.now() < suppressNextClickUntil) {
          e.preventDefault();
          e.stopPropagation();
          suppressNextClickUntil = 0;
        }
      },
      true,
    );

    window.addEventListener(
      'wheel',
      (e) => {
        const inBracket =
          e.target &&
          e.target.closest &&
          (e.target.closest('#ko-fullscreen-scroll-body') ||
            e.target.closest('#ko-bracket-scroll-wrap'));
        if (!inBracket) return;
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          window.adjustBracketZoom(e.deltaY < 0 ? 8 : -8);
        }
      },
      { passive: false },
    );

    // Unified Pointer Drag-to-Pan: works anywhere on big classroom Touch TVs (HID mouse, pen, or touch)
    window.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      const fsBody =
        e.target && e.target.closest && e.target.closest('#ko-fullscreen-scroll-body');
      const wrap = e.target && e.target.closest && e.target.closest('#ko-bracket-scroll-wrap');
      if (!fsBody && !wrap) return;
      if (e.target.closest('input, select, textarea')) return;

      // For native finger touch on modern browsers, CSS touch-action: pan-x pan-y handles momentum scroll natively;
      // for smartboards sending mouse/pen events (or if browser doesn't scroll), pointer pan handles both X and Y!
      if (e.pointerType === 'touch') return;

      panPointerId = e.pointerId;
      panCandidate = true;
      panActivated = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      activeHorizEl = fsBody || wrap;
      activeVertEl = fsBody || document.scrollingElement || document.documentElement;
      startScrollLeft = activeHorizEl ? activeHorizEl.scrollLeft : 0;
      startScrollTop = activeVertEl ? activeVertEl.scrollTop : 0;
    });

    window.addEventListener('pointermove', (e) => {
      if (!panCandidate || e.pointerId !== panPointerId) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;

      if (!panActivated) {
        if (Math.hypot(dx, dy) < 8) return;
        panActivated = true;
        if (activeHorizEl) activeHorizEl.style.cursor = 'grabbing';
      }

      if (activeHorizEl) {
        activeHorizEl.scrollLeft = startScrollLeft - dx;
      }
      if (activeVertEl) {
        activeVertEl.scrollTop = startScrollTop - dy;
      }
    });

    const endBracketPan = (e) => {
      if (!panCandidate) return;
      if (e && e.pointerId !== undefined && panPointerId !== null && e.pointerId !== panPointerId) {
        return;
      }
      if (panActivated) {
        suppressNextClickUntil = Date.now() + 260;
        if (activeHorizEl) activeHorizEl.style.cursor = 'grab';
      }
      panCandidate = false;
      panActivated = false;
      panPointerId = null;
      activeHorizEl = null;
      activeVertEl = null;
    };

    window.addEventListener('pointerup', endBracketPan);
    window.addEventListener('pointercancel', endBracketPan);
  }
}

function renderBracketZoomControlsHTML(isFullscreen = false) {
  const z = typeof chessState.bracketZoom === 'number' ? chessState.bracketZoom : 100;
  const dark = isFullscreen;
  const pillBg = dark ? '#1e293b' : '#f8fafc';
  const pillBorder = dark ? '#475569' : '#cbd5e1';
  const btnColor = dark ? '#f8fafc' : '#1e293b';

  return `
    <div style="display: inline-flex; align-items: center; gap: 4px; background: ${pillBg}; border: 1px solid ${pillBorder}; border-radius: 7px; padding: 3px 6px;" title="Zoom Bracket (+ / - or Ctrl + Scroll)">
      <button type="button" onclick="window.adjustBracketZoom(-10)" style="background: transparent; border: none; color: ${btnColor}; font-weight: 900; font-size: 0.9rem; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;" title="Zoom Out (-)">−</button>
      <button type="button" onclick="window.setBracketZoom(100)" class="ko-zoom-readout" style="background: ${dark ? '#0f172a' : '#ffffff'}; border: 1px solid ${pillBorder}; color: ${btnColor}; font-family: monospace; font-weight: 800; font-size: 0.74rem; padding: 2px 7px; border-radius: 4px; min-width: 46px; cursor: pointer;" title="Click to reset to 100%">${z}%</button>
      <button type="button" onclick="window.adjustBracketZoom(10)" style="background: transparent; border: none; color: ${btnColor}; font-weight: 900; font-size: 0.9rem; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;" title="Zoom In (+)">+</button>
      <button type="button" onclick="window.fitKnockoutBracket()" style="background: ${dark ? '#334155' : '#e2e8f0'}; border: none; color: ${btnColor}; font-weight: 800; font-size: 0.7rem; padding: 3px 8px; border-radius: 4px; cursor: pointer;" title="Fit entire bracket width onto screen">Fit</button>
    </div>
  `;
}

function renderUndoAndSaveButtonsHTML(isFullscreen = false) {
  if (chessState.userRole !== 'teacher') return '';
  const undoCount = Array.isArray(chessState.undoStack) ? chessState.undoStack.length : 0;
  const lastLabel = getLastUndoLabel();
  const hasUndo = undoCount > 0;

  return `
    <button type="button" onclick="window.undoTournamentAction()" ${!hasUndo ? 'disabled' : ''} style="background: ${hasUndo ? (isFullscreen ? '#f59e0b' : '#fef3c7') : (isFullscreen ? '#1e293b' : '#f8fafc')}; color: ${hasUndo ? (isFullscreen ? '#0f172a' : '#92400e') : '#94a3b8'}; border: 1.5px solid ${hasUndo ? '#f59e0b' : (isFullscreen ? '#334155' : '#e2e8f0')}; padding: ${isFullscreen ? '5px 10px' : '7px 12px'}; border-radius: 6px; font-weight: 800; font-size: ${isFullscreen ? '0.74rem' : '0.8rem'}; cursor: ${hasUndo ? 'pointer' : 'not-allowed'}; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;" title="${hasUndo ? `Undo: ${lastLabel} (Ctrl+Z)` : 'Nothing to undo yet'}">
      <span>↩️</span> Undo${hasUndo ? ` (${undoCount})` : ''}
    </button>
    <button type="button" onclick="window.openTournamentSaveModal()" style="background: ${isFullscreen ? '#0284c7' : '#e0f2fe'}; color: ${isFullscreen ? '#ffffff' : '#0369a1'}; border: 1.5px solid ${isFullscreen ? '#38bdf8' : '#7dd3fc'}; padding: ${isFullscreen ? '5px 10px' : '7px 12px'}; border-radius: 6px; font-weight: 800; font-size: ${isFullscreen ? '0.74rem' : '0.8rem'}; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;" title="Copy tournament save code to paste in next week (or restore saved progress)">
      <span>💾</span> Save / Next Week
    </button>
  `;
}

function renderTournamentTimerBarHTML(isFullscreen = false) {
  const secsTotal =
    typeof chessState.sessionTimeRemaining === 'number' && chessState.sessionTimeRemaining >= 0
      ? chessState.sessionTimeRemaining
      : 600;
  const m = Math.floor(secsTotal / 60);
  const s = secsTotal % 60;
  const formatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  const isUrgent = secsTotal > 0 && secsTotal <= 120;
  const isZero = secsTotal === 0;
  const running = Boolean(chessState.sessionTimerRunning);
  const isTeacher = chessState.userRole === 'teacher';

  if (isFullscreen) {
    return `
      <div style="display: inline-flex; align-items: center; gap: 5px; background: #020617; border: 1.5px solid ${isZero ? '#ef4444' : isUrgent ? '#f59e0b' : '#334155'}; border-radius: 8px; padding: 3px 8px;">
        <span style="font-size: 0.7rem; color: #94a3b8; font-weight: 800;">⏱</span>
        <span class="chess-live-round-clock" data-dark="true" style="font-family: 'JetBrains Mono', monospace; font-size: 1.05rem; font-weight: 900; min-width: 52px; text-align: center; color: ${isZero ? '#ef4444' : isUrgent ? '#fbbf24' : '#4ade80'};">
          ${formatted}
        </span>
        ${
          isTeacher
            ? `
          <button type="button" onclick="window.toggleSessionTimer()" style="background: ${running ? '#334155' : '#16a34a'}; color: #ffffff; border: none; border-radius: 4px; padding: 3px 8px; font-size: 0.7rem; font-weight: 800; cursor: pointer;">
            ${running ? '⏸ Pause' : '▶ Start'}
          </button>
          <button type="button" onclick="window.setRoundTimer(5)" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; border-radius: 4px; padding: 2px 5px; font-size: 0.66rem; font-weight: 800; cursor: pointer; font-family: monospace;" title="Start 5-minute round">5m</button>
          <button type="button" onclick="window.setRoundTimer(8)" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; border-radius: 4px; padding: 2px 5px; font-size: 0.66rem; font-weight: 800; cursor: pointer; font-family: monospace;" title="Start 8-minute round">8m</button>
          <button type="button" onclick="window.setRoundTimer(10)" style="background: #1e293b; color: #fbbf24; border: 1px solid #d97706; border-radius: 4px; padding: 2px 5px; font-size: 0.66rem; font-weight: 900; cursor: pointer; font-family: monospace;" title="Start 10-minute round">10m</button>
          <button type="button" onclick="window.setRoundTimer(15)" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; border-radius: 4px; padding: 2px 5px; font-size: 0.66rem; font-weight: 800; cursor: pointer; font-family: monospace;" title="Start 15-minute round">15m</button>
          <button type="button" onclick="window.adjustRoundTimer(60)" style="background: #1e293b; color: #38bdf8; border: 1px solid #0284c7; border-radius: 4px; padding: 2px 5px; font-size: 0.66rem; font-weight: 800; cursor: pointer; font-family: monospace;" title="Add 1 extra minute">+1m</button>
          <button type="button" onclick="window.openAdjudicationModal()" style="background: #78350f; color: #fde68a; border: 1px solid #d97706; border-radius: 4px; padding: 2px 6px; font-size: 0.66rem; font-weight: 800; cursor: pointer;" title="Open Piece Values & Rapid Tally Guide">⚖️ Pts</button>
        `
            : ''
        }
      </div>
    `;
  }

  return `
    <div style="background: #f8fafc; border: 1.5px solid ${isZero ? '#fca5a5' : isUrgent ? '#fcd34d' : '#e2e8f0'}; border-radius: 10px; padding: 9px 14px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        <div style="display: inline-flex; align-items: center; gap: 7px; background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 4px 12px;">
          <span style="font-size: 0.85rem;">⏱</span>
          <span style="font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Round Timer:</span>
          <span class="chess-live-round-clock" data-dark="false" style="font-family: 'JetBrains Mono', monospace; font-size: 1.25rem; font-weight: 900; color: ${isZero ? '#dc2626' : isUrgent ? '#d97706' : '#0f172a'}; min-width: 58px; text-align: center;">
            ${formatted}
          </span>
        </div>
        ${
          isTeacher
            ? `
          <button type="button" onclick="window.toggleSessionTimer()" style="background: ${running ? '#334155' : '#16a34a'}; color: #ffffff; border: none; border-radius: 6px; padding: 6px 12px; font-size: 0.78rem; font-weight: 800; cursor: pointer;">
            ${running ? '⏸ Pause' : '▶ Start Round'}
          </button>
          <button type="button" onclick="window.resetSessionTimer()" style="background: #ffffff; color: #475569; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 9px; font-size: 0.74rem; font-weight: 700; cursor: pointer;" title="Reset round clock">
            ↺ Reset
          </button>
        `
            : ''
        }
      </div>

      ${
        isTeacher
          ? `
        <div style="display: flex; align-items: center; gap: 5px; flex-wrap: wrap;">
          <span style="font-size: 0.72rem; font-weight: 700; color: #64748b;">Presets:</span>
          <button type="button" onclick="window.setRoundTimer(5)" style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 5px; padding: 4px 8px; font-size: 0.74rem; font-weight: 800; cursor: pointer; font-family: monospace;">5m</button>
          <button type="button" onclick="window.setRoundTimer(8)" style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 5px; padding: 4px 8px; font-size: 0.74rem; font-weight: 800; cursor: pointer; font-family: monospace;">8m</button>
          <button type="button" onclick="window.setRoundTimer(10)" style="background: #fef3c7; color: #92400e; border: 1px solid #f59e0b; border-radius: 5px; padding: 4px 8px; font-size: 0.74rem; font-weight: 900; cursor: pointer; font-family: monospace;">10m</button>
          <button type="button" onclick="window.setRoundTimer(12)" style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 5px; padding: 4px 8px; font-size: 0.74rem; font-weight: 800; cursor: pointer; font-family: monospace;">12m</button>
          <button type="button" onclick="window.setRoundTimer(15)" style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 5px; padding: 4px 8px; font-size: 0.74rem; font-weight: 800; cursor: pointer; font-family: monospace;">15m</button>
          <button type="button" onclick="window.adjustRoundTimer(60)" style="background: #e0f2fe; color: #0369a1; border: 1px solid #7dd3fc; border-radius: 5px; padding: 4px 8px; font-size: 0.74rem; font-weight: 800; cursor: pointer; font-family: monospace;">+1m</button>
          <button type="button" onclick="window.openAdjudicationModal()" style="background: #fffbeb; color: #92400e; border: 1px solid #fcd34d; border-radius: 5px; padding: 4px 10px; font-size: 0.74rem; font-weight: 800; cursor: pointer;">
            ⚖️ Piece Values
          </button>
        </div>
      `
          : ''
      }
    </div>
  `;
}

function renderRoundTimeUpBannerHTML() {
  if (!chessState.roundTimerExpiredAlert) return '';
  return `
    <div style="background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%); color: #ffffff; border: 2px solid #f59e0b; border-radius: 10px; padding: 10px 16px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; box-shadow: 0 6px 18px rgba(153, 27, 27, 0.28);">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.4rem;">⏰</span>
        <div>
          <div style="font-weight: 900; font-size: 0.95rem; color: #fde68a; text-transform: uppercase; letter-spacing: 0.03em;">
            Round Time Up! Hands Off the Pieces!
          </div>
          <div style="font-size: 0.8rem; color: #fecaca;">
            Count surviving piece points (♙1 · ♘3 · ♗3 · ♖5 · ♕9) to decide unfinished boards and move the tournament to the next round!
          </div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <button type="button" onclick="window.openAdjudicationModal()" style="background: #fbbf24; color: #0f172a; border: none; font-weight: 900; font-size: 0.78rem; padding: 6px 12px; border-radius: 6px; cursor: pointer;">
          ⚖️ Open Material Tally Calculator
        </button>
        <button type="button" onclick="window.dismissRoundTimerAlert()" style="background: rgba(255,255,255,0.15); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); font-weight: 700; font-size: 0.75rem; padding: 6px 10px; border-radius: 6px; cursor: pointer;">
          Dismiss ✕
        </button>
      </div>
    </div>
  `;
}

function renderRapidRepairingSectionHTML(bracket) {
  if (!bracket) return '';
  const isTeacher = chessState.userRole === 'teacher';
  return `
    <!-- SECTION 4: ⚡ Instant Re-Pairing for Idle Pupils (Casual Rapid Games) -->
    <div id="ko-sec-rapid" style="margin-top: 24px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 18px 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.1rem; color: #0284c7;">⚡</span>
            <h4 style="margin: 0; font-size: 1.05rem; color: #0f172a; font-weight: 800;">
              Period 6 Rapid Re-Pairing (Keep Every Pupil Playing!)
            </h4>
          </div>
          <div style="font-size: 0.82rem; color: #64748b; margin-top: 2px;">
            Pupils finished their tournament game early? Tap below to pair all free pupils for 10-minute rapid games (Win = +3 pts, Draw = +2 pts each)!
          </div>
        </div>

        ${
          isTeacher
            ? `
          <button type="button" onclick="window.repairFreePupilsCasual()" style="background: #0284c7; color: #ffffff; border: none; font-weight: 800; font-size: 0.84rem; padding: 9px 16px; border-radius: 7px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.25);">
            <i class="fa-solid fa-bolt"></i> ⚡ Re-Pair Free Pupils
          </button>
        `
            : ''
        }
      </div>

      ${
        bracket.casualMatches && bracket.casualMatches.length > 0
          ? `
        <div style="margin-top: 14px; display: grid; grid-template-columns: repeat(auto-fit, minmax(275px, 1fr)); gap: 10px;">
          ${bracket.casualMatches
            .map((cm) => {
              const h1 = HOUSES[cm.p1.house];
              const h2 = HOUSES[cm.p2.house];
              return `
              <div style="background: #ffffff; border: 1.5px solid ${cm.winner ? '#86efac' : cm.isDraw ? '#fcd34d' : '#cbd5e1'}; border-radius: 8px; padding: 10px 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 0.72rem; font-weight: 800; color: #64748b;">
                  <span>CASUAL RAPID</span>
                  <span style="color: #0284c7;">${cm.time}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.86rem; font-weight: 700; margin-bottom: 8px; gap: 6px;">
                  <span style="color: ${h1 ? h1.color : '#0f172a'};">${cm.p1.name}</span>
                  <span style="color: #94a3b8; font-size: 0.74rem;">vs</span>
                  <span style="color: ${h2 ? h2.color : '#0f172a'};">${cm.p2.name}</span>
                </div>
                ${
                  !cm.winner && !cm.isDraw && isTeacher
                    ? `
                  <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 5px;">
                    <button type="button" onclick="window.advanceCasualMatch('${cm.id}', '${cm.p1.id}')" style="background: #f8fafc; border: 1px solid #cbd5e1; font-size: 0.72rem; font-weight: 800; padding: 6px 4px; border-radius: 5px; cursor: pointer; color: ${h1 ? h1.color : '#0f172a'};" title="${cm.p1.name} Wins (+3 House pts)">
                      ${getPlayerButtonShortName(cm.p1)} Won
                    </button>
                    <button type="button" onclick="window.advanceCasualMatch('${cm.id}', 'draw')" style="background: #fffbeb; border: 1px solid #fcd34d; font-size: 0.72rem; font-weight: 800; padding: 6px 8px; border-radius: 5px; cursor: pointer; color: #92400e;" title="Draw (+2 House pts each)">
                      🤝 Draw
                    </button>
                    <button type="button" onclick="window.advanceCasualMatch('${cm.id}', '${cm.p2.id}')" style="background: #f8fafc; border: 1px solid #cbd5e1; font-size: 0.72rem; font-weight: 800; padding: 6px 4px; border-radius: 5px; cursor: pointer; color: ${h2 ? h2.color : '#0f172a'};" title="${cm.p2.name} Wins (+3 House pts)">
                      ${getPlayerButtonShortName(cm.p2)} Won
                    </button>
                  </div>
                `
                    : cm.isDraw
                      ? `
                  <div style="text-align: center; font-size: 0.73rem; font-weight: 800; color: #b45309; border-top: 1px solid #fef3c7; padding-top: 5px;">
                    🤝 Draw: ½–½ (+2 House pts each)
                  </div>
                `
                      : cm.winner
                        ? `
                  <div style="text-align: center; font-size: 0.73rem; font-weight: 800; color: #15803d; border-top: 1px solid #dcfce7; padding-top: 5px;">
                    ✓ Winner: ${cm.winner.name} (+3 pts)
                  </div>
                `
                        : ''
                }
              </div>
            `;
            })
            .join('')}
        </div>
      `
          : ''
      }
    </div>
  `;
}

function renderKnockoutBracketStagesHTML(bracket, options = {}) {
  const isFullscreen = Boolean(options.isFullscreen);
  const tierFilter = isFullscreen ? chessState.bracketTierFilter || 'all' : 'all';

  if (typeof reconcileKnockoutProgression === 'function') {
    reconcileKnockoutProgression(bracket);
  }

  let grandWinner = null;
  const finalMatch = bracket.rounds[bracket.rounds.length - 1][0];
  if (finalMatch && finalMatch.winner && !finalMatch.winner.isBye) grandWinner = finalMatch.winner;

  let plateWinner = null;
  if (bracket.plateRounds && bracket.plateRounds.length > 0) {
    const plateFinalMatch = bracket.plateRounds[bracket.plateRounds.length - 1][0];
    if (plateFinalMatch && plateFinalMatch.winner && !plateFinalMatch.winner.isBye) {
      plateWinner = plateFinalMatch.winner;
    }
  }

  let woodenSpoonWinner = null;
  if (
    bracket.woodenSpoonMatch &&
    bracket.woodenSpoonMatch.winner &&
    !bracket.woodenSpoonMatch.winner.isBye
  ) {
    woodenSpoonWinner = bracket.woodenSpoonMatch.winner;
  }

  const z = typeof chessState.bracketZoom === 'number' ? chessState.bracketZoom : 100;
  const showCup = tierFilter === 'all' || tierFilter === 'cup';
  const showPlate = tierFilter === 'all' || tierFilter === 'plate';
  const showSpoon = tierFilter === 'all' || tierFilter === 'spoon';
  const showRapid = tierFilter === 'all' || tierFilter === 'rapid';

  // In fullscreen, #ko-fullscreen-scroll-body is the single 2D touch/drag scroll container (avoids nested scroll traps on smartboards)
  const wrapOverflowStyle = isFullscreen
    ? 'overflow: visible; cursor: grab; padding: 2px 2px 10px 2px;'
    : 'overflow-x: auto; overflow-y: visible; -webkit-overflow-scrolling: touch; touch-action: pan-x pan-y; cursor: grab; padding: 2px 2px 10px 2px;';

  return `
    <div id="ko-bracket-scroll-wrap" style="${wrapOverflowStyle}">
      <div id="ko-bracket-zoom-stage" style="zoom: ${(z / 100).toFixed(3)}; transform-origin: top left;">
        ${
          showCup
            ? `
          <!-- SECTION 1: 🏆 Championship Cup (Gold Tier) -->
          <div id="ko-sec-cup">
          ${
            grandWinner
              ? `
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 18px; margin-bottom: 20px; text-align: center; box-shadow: 0 6px 18px rgba(245, 158, 11, 0.25); animation: zoomIn 0.3s ease-out;">
              <div style="font-size: 2rem; color: #d97706; margin-bottom: 4px;"><i class="fa-solid fa-crown"></i></div>
              <h3 style="margin: 0 0 4px 0; font-family: 'Playfair Display', serif; font-size: 1.55rem; color: #78350f; font-weight: 900;">
                🏆 TOURNAMENT CHAMPION: ${grandWinner.name}!
              </h3>
              <div style="font-size: 0.98rem; font-weight: 800; color: ${HOUSES[grandWinner.house]?.color || '#78350f'}; text-transform: uppercase;">
                ${HOUSES[grandWinner.house]?.name || grandWinner.house} House (+3 House Points Awarded)
              </div>
              <div style="font-size: 0.84rem; color: #92400e; margin-top: 4px;">
                Brilliant strategic mastery throughout all rounds of Period 6!
              </div>
            </div>
          `
              : ''
          }

          <div style="margin-bottom: 10px;">
            <div style="display: inline-flex; align-items: center; gap: 6px; background: #fef3c7; color: #b45309; border: 1px solid #fde68a; padding: 3px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">
              🏆 Gold Tier · Championship Cup Bracket
            </div>
          </div>

          <!-- Championship Bracket Tree Row -->
          <div id="ko-gold-tree" style="display: flex; gap: 16px; align-items: stretch; padding: 6px 0 16px;">
            ${bracket.rounds
              .map((round, rIdx) => {
                const roundTitle = bracket.roundNames[rIdx] || `Round ${rIdx + 1}`;
                return `
                <div style="min-width: 212px; flex: 1 1 0;">
                  <div style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 10px; text-align: center; letter-spacing: 0.05em; white-space: nowrap;">
                    ${roundTitle}
                  </div>
                  <div style="display: flex; flex-direction: column; justify-content: space-around; height: calc(100% - 28px); min-height: 330px; gap: 14px;">
                    ${round
                      .map((m, mIdx) => {
                        const p1 = m.p1;
                        const p2 = m.p2;
                        const h1 = p1 && !p1.isBye ? HOUSES[p1.house] : null;
                        const h2 = p2 && !p2.isBye ? HOUSES[p2.house] : null;

                        return `
                        <div style="background: #f8fafc; border: 1.5px solid ${m.isBye ? '#86efac' : m.winner ? '#10b981' : '#cbd5e1'}; border-radius: 8px; padding: 9px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); position: relative;">
                          
                          <!-- P1 Slot -->
                          <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 5px 7px; border-radius: 4px; background: ${m.winner && m.winner.id === (p1 && p1.id) ? '#dcfce7' : p1?.isBye ? '#f1f5f9' : '#ffffff'}; margin-bottom: 4px;">
                            <span style="font-weight: 700; font-size: 0.82rem; color: ${p1?.isBye ? '#94a3b8' : '#0f172a'}; line-height: 1.2; display: flex; align-items: center; gap: 5px; min-width: 0;">
                              ${p1?.seed && !p1?.isBye ? `<span style="background: #e2e8f0; color: #334155; font-size: 0.64rem; font-weight: 800; padding: 1px 5px; border-radius: 4px; flex-shrink: 0;">#${p1.seed}</span>` : ''}
                              <span style="word-break: break-word;">${p1 ? (p1.isBye ? '— [BYE] —' : p1.name) : 'TBD'}</span>
                            </span>
                            ${h1 ? `<span style="font-size: 0.68rem; font-weight: 800; color: ${h1.color}; flex-shrink: 0;">${h1.name}</span>` : ''}
                          </div>

                          <!-- P2 Slot -->
                          <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 5px 7px; border-radius: 4px; background: ${m.winner && m.winner.id === (p2 && p2.id) ? '#dcfce7' : p2?.isBye ? '#f1f5f9' : '#ffffff'};">
                            <span style="font-weight: 700; font-size: 0.82rem; color: ${p2?.isBye ? '#94a3b8' : '#0f172a'}; line-height: 1.2; display: flex; align-items: center; gap: 5px; min-width: 0;">
                              ${p2?.seed && !p2?.isBye ? `<span style="background: #e2e8f0; color: #334155; font-size: 0.64rem; font-weight: 800; padding: 1px 5px; border-radius: 4px; flex-shrink: 0;">#${p2.seed}</span>` : ''}
                              <span style="word-break: break-word;">${p2 ? (p2.isBye ? '— [BYE] —' : p2.name) : 'TBD'}</span>
                            </span>
                            ${h2 ? `<span style="font-size: 0.68rem; font-weight: 800; color: ${h2.color}; flex-shrink: 0;">${h2.name}</span>` : ''}
                          </div>

                          <!-- Action Button -->
                          ${
                            p1 &&
                            p2 &&
                            !p1.isBye &&
                            !p2.isBye &&
                            !m.winner &&
                            !m.isBye &&
                            chessState.userRole === 'teacher'
                              ? `
                            <div style="display: flex; gap: 5px; margin-top: 7px; border-top: 1px dashed #cbd5e1; padding-top: 6px;">
                              <button type="button" onclick="window.advanceKnockoutWinner(${rIdx}, ${mIdx}, '${p1.id}')" style="flex: 1; background: #ffffff; border: 1px solid #cbd5e1; font-size: 0.72rem; font-weight: 800; line-height: 1.2; padding: 6px 4px; border-radius: 4px; cursor: pointer; color: ${h1 ? h1.color : '#0f172a'};" title="Advance ${p1.name}">
                                ${getPlayerButtonShortName(p1)} Wins
                              </button>
                              <button type="button" onclick="window.advanceKnockoutWinner(${rIdx}, ${mIdx}, '${p2.id}')" style="flex: 1; background: #ffffff; border: 1px solid #cbd5e1; font-size: 0.72rem; font-weight: 800; line-height: 1.2; padding: 6px 4px; border-radius: 4px; cursor: pointer; color: ${h2 ? h2.color : '#0f172a'};" title="Advance ${p2.name}">
                                ${getPlayerButtonShortName(p2)} Wins
                              </button>
                            </div>
                          `
                              : ''
                          }
                          ${
                            m.isBye
                              ? `
                            <div style="font-size: 0.7rem; font-weight: 800; color: #059669; text-align: center; margin-top: 6px; padding-top: 4px; border-top: 1px solid #dcfce7;">
                              <i class="fa-solid fa-forward"></i> Auto-Advanced (Top-Seed Bye)
                            </div>
                          `
                              : m.winner
                                ? `
                            <div style="font-size: 0.7rem; font-weight: 800; color: #15803d; text-align: center; margin-top: 6px; padding-top: 4px; border-top: 1px solid #dcfce7;">
                              <i class="fa-solid fa-check"></i> Winner: ${m.winner.name} (+3 pts)
                            </div>
                          `
                                : ''
                          }
                        </div>
                      `;
                      })
                      .join('')}
                  </div>
                </div>
              `;
              })
              .join('')}

            <!-- 🥉 3rd Place Bronze Medal Playoff -->
            ${
              bracket.cupBronzeMatch
                ? `
              <div style="min-width: 208px; flex: 1 1 0; border-left: 2px dashed #fcd34d; padding-left: 14px; display: flex; flex-direction: column; justify-content: center;">
                <div style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #b45309; margin-bottom: 8px; text-align: center; letter-spacing: 0.04em; white-space: nowrap;">
                  🥉 3rd Place Playoff
                </div>
                <div>
                  <div style="background: #fffbeb; border: 1.5px solid ${bracket.cupBronzeMatch.winner ? '#f59e0b' : '#fcd34d'}; border-radius: 8px; padding: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                    <div style="font-size: 0.68rem; font-weight: 800; color: #92400e; text-transform: uppercase; margin-bottom: 6px; text-align: center;">
                      Cup Semi-Final Losers
                    </div>
                    <!-- P1 -->
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 5px 7px; border-radius: 4px; background: ${bracket.cupBronzeMatch.winner && bracket.cupBronzeMatch.winner.id === bracket.cupBronzeMatch.p1?.id ? '#fef3c7' : '#ffffff'}; margin-bottom: 4px;">
                      <span style="font-weight: 700; font-size: 0.82rem; color: ${bracket.cupBronzeMatch.p1?.isBye ? '#94a3b8' : '#0f172a'}; line-height: 1.2;">
                        ${bracket.cupBronzeMatch.p1 ? (bracket.cupBronzeMatch.p1.isBye ? '— [BYE / In Plate] —' : bracket.cupBronzeMatch.p1.name) : `<span style="color: #94a3b8; font-style: italic;">${bracket.cupBronzeMatch.p1PendingLabel || 'Awaiting SF 1 Loser'}</span>`}
                      </span>
                      ${bracket.cupBronzeMatch.p1 && !bracket.cupBronzeMatch.p1.isBye ? `<span style="font-size: 0.68rem; font-weight: 800; color: ${HOUSES[bracket.cupBronzeMatch.p1.house]?.color || '#94a3b8'}; flex-shrink: 0;">${HOUSES[bracket.cupBronzeMatch.p1.house]?.name || ''}</span>` : ''}
                    </div>
                    <!-- P2 -->
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 5px 7px; border-radius: 4px; background: ${bracket.cupBronzeMatch.winner && bracket.cupBronzeMatch.winner.id === bracket.cupBronzeMatch.p2?.id ? '#fef3c7' : '#ffffff'};">
                      <span style="font-weight: 700; font-size: 0.82rem; color: ${bracket.cupBronzeMatch.p2?.isBye ? '#94a3b8' : '#0f172a'}; line-height: 1.2;">
                        ${bracket.cupBronzeMatch.p2 ? (bracket.cupBronzeMatch.p2.isBye ? '— [BYE / In Plate] —' : bracket.cupBronzeMatch.p2.name) : `<span style="color: #94a3b8; font-style: italic;">${bracket.cupBronzeMatch.p2PendingLabel || 'Awaiting SF 2 Loser'}</span>`}
                      </span>
                      ${bracket.cupBronzeMatch.p2 && !bracket.cupBronzeMatch.p2.isBye ? `<span style="font-size: 0.68rem; font-weight: 800; color: ${HOUSES[bracket.cupBronzeMatch.p2.house]?.color || '#94a3b8'}; flex-shrink: 0;">${HOUSES[bracket.cupBronzeMatch.p2.house]?.name || ''}</span>` : ''}
                    </div>
                    <!-- Actions -->
                    ${
                      bracket.cupBronzeMatch.p1 &&
                      bracket.cupBronzeMatch.p2 &&
                      !bracket.cupBronzeMatch.p1.isBye &&
                      !bracket.cupBronzeMatch.p2.isBye &&
                      !bracket.cupBronzeMatch.isBye &&
                      !bracket.cupBronzeMatch.winner &&
                      chessState.userRole === 'teacher'
                        ? `
                      <div style="display: flex; gap: 5px; margin-top: 7px; border-top: 1px dashed #fcd34d; padding-top: 6px;">
                        <button type="button" onclick="window.advanceCupBronzeWinner('${bracket.cupBronzeMatch.p1.id}')" style="flex: 1; background: #ffffff; border: 1px solid #fcd34d; font-size: 0.72rem; font-weight: 800; line-height: 1.2; padding: 6px 4px; border-radius: 4px; cursor: pointer; color: #b45309;">
                          ${getPlayerButtonShortName(bracket.cupBronzeMatch.p1)} Wins
                        </button>
                        <button type="button" onclick="window.advanceCupBronzeWinner('${bracket.cupBronzeMatch.p2.id}')" style="flex: 1; background: #ffffff; border: 1px solid #fcd34d; font-size: 0.72rem; font-weight: 800; line-height: 1.2; padding: 6px 4px; border-radius: 4px; cursor: pointer; color: #b45309;">
                          ${getPlayerButtonShortName(bracket.cupBronzeMatch.p2)} Wins
                        </button>
                      </div>
                    `
                        : ''
                    }
                    ${
                      bracket.cupBronzeMatch.winner && !bracket.cupBronzeMatch.winner.isBye
                        ? `
                      <div style="font-size: 0.72rem; font-weight: 800; color: #b45309; text-align: center; margin-top: 6px; padding-top: 4px; border-top: 1px solid #fcd34d;">
                        🥉 3rd Place Bronze: ${bracket.cupBronzeMatch.winner.name}${bracket.cupBronzeMatch.isBye ? ' (Walkover)' : ' (+3 pts)'}
                      </div>
                    `
                        : ''
                    }
                  </div>
                </div>
              </div>
            `
                : ''
            }
          </div>
          </div>
        `
            : ''
        }

        <!-- SECTION 2: 🥈 The Challenger Plate (Silver Tier) -->
        ${
          showPlate && bracket.plateRounds && bracket.plateRounds.length > 0
            ? `
          <div id="ko-sec-plate" style="margin-top: ${showCup ? '22px' : '4px'}; ${showCup ? 'border-top: 2px dashed #cbd5e1; padding-top: 20px;' : ''}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="display: inline-flex; align-items: center; gap: 6px; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; padding: 3px 10px; border-radius: 12px; font-size: 0.74rem; font-weight: 800; text-transform: uppercase;">
                  🥈 Silver Tier · First-Loss Second Chance Championship
                </div>
                <h3 style="font-family: 'Playfair Display', serif; font-size: 1.25rem; color: #1e293b; margin: 4px 0 0 0;">
                  The Challenger Plate
                </h3>
                <div style="font-size: 0.82rem; color: #64748b; margin-top: 2px;">
                  Every pupil who loses their first game (in Round 1, OR in Round 2 after receiving a Round 1 Bye) enters the Challenger Plate!
                </div>
              </div>
            </div>

            ${
              plateWinner
                ? `
              <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border: 2px solid #94a3b8; border-radius: 12px; padding: 16px; margin-bottom: 18px; text-align: center; box-shadow: 0 4px 14px rgba(0,0,0,0.06);">
                <div style="font-size: 1.7rem; color: #334155; margin-bottom: 4px;">🥈</div>
                <h3 style="margin: 0 0 4px 0; font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #1e293b; font-weight: 900;">
                  CHALLENGER PLATE CHAMPION: ${plateWinner.name}!
                </h3>
                <div style="font-size: 0.92rem; font-weight: 800; color: ${HOUSES[plateWinner.house]?.color || '#475569'}; text-transform: uppercase;">
                  ${HOUSES[plateWinner.house]?.name || plateWinner.house} House (+3 House Points Awarded)
                </div>
              </div>
            `
                : ''
            }

            <div style="display: flex; gap: 18px; padding: 6px 0 14px;">
              ${bracket.plateRounds
                .map((round, rIdx) => {
                  const roundTitle =
                    bracket.plateRoundNames[rIdx] ||
                    (rIdx === 0 ? 'Plate Semi-Finals' : 'Challenger Plate Final');
                  return `
                  <div style="min-width: 220px; flex: 1 1 0;">
                    <div style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 10px; text-align: center; letter-spacing: 0.04em;">
                      ${roundTitle}
                    </div>
                    <div style="display: flex; flex-direction: column; justify-content: space-around; height: calc(100% - 28px); min-height: 190px; gap: 14px;">
                      ${round
                        .map((m, mIdx) => {
                          const p1 = m.p1;
                          const p2 = m.p2;
                          const h1 = p1 && !p1.isBye ? HOUSES[p1.house] : null;
                          const h2 = p2 && !p2.isBye ? HOUSES[p2.house] : null;

                          return `
                          <div style="background: #ffffff; border: 1.5px solid ${m.isBye ? '#93c5fd' : m.winner ? '#64748b' : '#cbd5e1'}; border-radius: 8px; padding: 9px 11px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                            <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 5px 7px; border-radius: 4px; background: ${m.winner && p1 && !p1.isBye && m.winner.id === p1.id ? '#e0f2fe' : '#fafafa'}; margin-bottom: 4px;">
                              <span style="font-weight: 700; font-size: 0.82rem; color: ${p1?.isBye ? '#94a3b8' : '#0f172a'}; line-height: 1.2;">
                                ${p1 ? (p1.isBye ? '— [PLATE BYE] —' : p1.name) : `<span style="color: #64748b; font-style: italic; font-size: 0.75rem;">${m.p1PendingLabel || 'Awaiting Contender'}</span>`}
                              </span>
                              ${h1 ? `<span style="font-size: 0.68rem; font-weight: 800; color: ${h1.color}; flex-shrink: 0;">${h1.name}</span>` : ''}
                            </div>

                            <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 5px 7px; border-radius: 4px; background: ${m.winner && p2 && !p2.isBye && m.winner.id === p2.id ? '#e0f2fe' : '#fafafa'};">
                              <span style="font-weight: 700; font-size: 0.82rem; color: ${p2?.isBye ? '#94a3b8' : '#0f172a'}; line-height: 1.2;">
                                ${p2 ? (p2.isBye ? '— [PLATE BYE] —' : p2.name) : `<span style="color: #64748b; font-style: italic; font-size: 0.75rem;">${m.p2PendingLabel || 'Awaiting Contender'}</span>`}
                              </span>
                              ${h2 ? `<span style="font-size: 0.68rem; font-weight: 800; color: ${h2.color}; flex-shrink: 0;">${h2.name}</span>` : ''}
                            </div>

                            ${
                              p1 &&
                              p2 &&
                              !p1.isBye &&
                              !p2.isBye &&
                              !m.isBye &&
                              !m.winner &&
                              chessState.userRole === 'teacher'
                                ? `
                              <div style="display: flex; gap: 5px; margin-top: 7px; border-top: 1px dashed #cbd5e1; padding-top: 6px;">
                                <button type="button" onclick="window.advancePlateWinner(${rIdx}, ${mIdx}, '${p1.id}')" style="flex: 1; background: #f8fafc; border: 1px solid #cbd5e1; font-size: 0.72rem; font-weight: 800; line-height: 1.2; padding: 6px 4px; border-radius: 4px; cursor: pointer; color: ${h1 ? h1.color : '#0f172a'};" title="Plate Win for ${p1.name}">
                                  ${getPlayerButtonShortName(p1)} Wins
                                </button>
                                <button type="button" onclick="window.advancePlateWinner(${rIdx}, ${mIdx}, '${p2.id}')" style="flex: 1; background: #f8fafc; border: 1px solid #cbd5e1; font-size: 0.72rem; font-weight: 800; line-height: 1.2; padding: 6px 4px; border-radius: 4px; cursor: pointer; color: ${h2 ? h2.color : '#0f172a'};" title="Plate Win for ${p2.name}">
                                  ${getPlayerButtonShortName(p2)} Wins
                                </button>
                              </div>
                            `
                                : ''
                            }
                            ${
                              m.isBye
                                ? `
                              <div style="font-size: 0.7rem; font-weight: 800; color: #0284c7; text-align: center; margin-top: 6px; padding-top: 4px; border-top: 1px solid #e0f2fe;">
                                ${m.winner && !m.winner.isBye ? `<i class="fa-solid fa-forward"></i> ${m.winner.name} Auto-Advances` : 'Plate Bye Slot'}
                              </div>
                            `
                                : m.winner && !m.winner.isBye
                                  ? `
                              <div style="font-size: 0.71rem; font-weight: 800; color: #334155; text-align: center; margin-top: 6px; padding-top: 4px; border-top: 1px solid #e2e8f0;">
                                <i class="fa-solid fa-check"></i> Plate Winner: ${m.winner.name} (+3 pts)
                              </div>
                            `
                                  : ''
                            }
                          </div>
                        `;
                        })
                        .join('')}
                    </div>
                  </div>
                `;
                })
                .join('')}
            </div>
          </div>
        `
            : ''
        }

        <!-- SECTION 3: 🥄 The Wooden Spoon Shield -->
        ${
          showSpoon && bracket.woodenSpoonMatch
            ? `
          <div id="ko-sec-spoon" style="margin-top: ${showCup || showPlate ? '22px' : '4px'}; ${showCup || showPlate ? 'border-top: 2px dashed #e2e8f0; padding-top: 20px;' : ''}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="display: inline-flex; align-items: center; gap: 6px; background: #fef3c7; color: #92400e; border: 1px solid #fde68a; padding: 3px 10px; border-radius: 12px; font-size: 0.74rem; font-weight: 800; text-transform: uppercase;">
                  🥄 Consolation Tier · Resilience &amp; Determination
                </div>
                <h3 style="font-family: 'Playfair Display', serif; font-size: 1.25rem; color: #78350f; margin: 4px 0 0 0;">
                  The Wooden Spoon Shield
                </h3>
                <div style="font-size: 0.82rem; color: #64748b; margin-top: 2px;">
                  Non-advancers from the Challenger Plate face off here so nobody sits out!
                </div>
              </div>
            </div>

            ${
              woodenSpoonWinner
                ? `
              <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 2px solid #b45309; border-radius: 12px; padding: 16px; margin-bottom: 18px; text-align: center; box-shadow: 0 4px 14px rgba(180, 83, 9, 0.15);">
                <div style="font-size: 1.9rem; margin-bottom: 4px;">🥄</div>
                <h3 style="margin: 0 0 4px 0; font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #78350f; font-weight: 900;">
                  WOODEN SPOON SHIELD CHAMPION: ${woodenSpoonWinner.name}!
                </h3>
                <div style="font-size: 0.92rem; font-weight: 800; color: ${HOUSES[woodenSpoonWinner.house]?.color || '#b45309'}; text-transform: uppercase;">
                  ${HOUSES[woodenSpoonWinner.house]?.name || woodenSpoonWinner.house} House
                </div>
              </div>
            `
                : ''
            }

            <div style="display: flex; gap: 18px; align-items: center; justify-content: center; flex-wrap: wrap;">
              ${
                Array.isArray(bracket.woodenSpoonSemiFinals) &&
                bracket.woodenSpoonSemiFinals.some((ssf) => !(ssf.p1?.isBye && ssf.p2?.isBye))
                  ? `
                <div style="min-width: 240px; flex: 1 1 260px; max-width: 360px; display: flex; flex-direction: column; gap: 12px;">
                  <div style="font-size: 0.76rem; font-weight: 800; color: #92400e; text-transform: uppercase; text-align: center;">
                    🥄 Spoon Semi-Finals
                  </div>
                  ${bracket.woodenSpoonSemiFinals
                    .map((ssf, sIdx) => {
                      const sp1 = ssf.p1;
                      const sp2 = ssf.p2;
                      const sh1 = sp1 && !sp1.isBye ? HOUSES[sp1.house] : null;
                      const sh2 = sp2 && !sp2.isBye ? HOUSES[sp2.house] : null;
                      return `
                      <div style="background: #ffffff; border: 1.5px solid ${ssf.winner ? '#d97706' : '#cbd5e1'}; border-radius: 8px; padding: 9px 11px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 4px 6px; border-radius: 4px; background: ${ssf.winner && sp1 && !sp1.isBye && ssf.winner.id === sp1.id ? '#fef3c7' : '#fafafa'}; margin-bottom: 4px;">
                          <span style="font-weight: 700; font-size: 0.8rem; color: ${sp1?.isBye ? '#94a3b8' : '#0f172a'};">
                            ${sp1 ? (sp1.isBye ? '— [SPOON BYE] —' : sp1.name) : `<span style="color: #94a3b8; font-style: italic; font-size: 0.74rem;">${ssf.p1PendingLabel || 'Awaiting Contender'}</span>`}
                          </span>
                          ${sh1 ? `<span style="font-size: 0.66rem; font-weight: 800; color: ${sh1.color};">${sh1.name}</span>` : ''}
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 4px 6px; border-radius: 4px; background: ${ssf.winner && sp2 && !sp2.isBye && ssf.winner.id === sp2.id ? '#fef3c7' : '#fafafa'};">
                          <span style="font-weight: 700; font-size: 0.8rem; color: ${sp2?.isBye ? '#94a3b8' : '#0f172a'};">
                            ${sp2 ? (sp2.isBye ? '— [SPOON BYE] —' : sp2.name) : `<span style="color: #94a3b8; font-style: italic; font-size: 0.74rem;">${ssf.p2PendingLabel || 'Awaiting Contender'}</span>`}
                          </span>
                          ${sh2 ? `<span style="font-size: 0.66rem; font-weight: 800; color: ${sh2.color};">${sh2.name}</span>` : ''}
                        </div>
                        ${
                          sp1 &&
                          sp2 &&
                          !sp1.isBye &&
                          !sp2.isBye &&
                          !ssf.isBye &&
                          !ssf.winner &&
                          chessState.userRole === 'teacher'
                            ? `
                          <div style="display: flex; gap: 5px; margin-top: 6px; border-top: 1px dashed #cbd5e1; padding-top: 6px;">
                            <button type="button" onclick="window.advanceWoodenSpoonSemiWinner(${sIdx}, '${sp1.id}')" style="flex: 1; background: #fffbeb; border: 1px solid #fcd34d; font-size: 0.7rem; font-weight: 800; padding: 5px 4px; border-radius: 4px; cursor: pointer; color: #78350f;">
                              ${getPlayerButtonShortName(sp1)} Wins
                            </button>
                            <button type="button" onclick="window.advanceWoodenSpoonSemiWinner(${sIdx}, '${sp2.id}')" style="flex: 1; background: #fffbeb; border: 1px solid #fcd34d; font-size: 0.7rem; font-weight: 800; padding: 5px 4px; border-radius: 4px; cursor: pointer; color: #78350f;">
                              ${getPlayerButtonShortName(sp2)} Wins
                            </button>
                          </div>
                        `
                            : ssf.isBye && ssf.winner && !ssf.winner.isBye
                              ? `<div style="font-size: 0.68rem; font-weight: 800; color: #b45309; text-align: center; margin-top: 5px;">${ssf.winner.name} Auto-Advances</div>`
                              : ''
                        }
                      </div>
                    `;
                    })
                    .join('')}
                </div>
              `
                  : ''
              }

              <div style="min-width: 260px; flex: 1 1 320px; max-width: 480px; background: #ffffff; border: 1.5px solid ${bracket.woodenSpoonMatch.winner ? '#b45309' : '#cbd5e1'}; border-radius: 10px; padding: 14px 16px; box-shadow: 0 3px 8px rgba(0,0,0,0.03);">
                <div style="font-size: 0.74rem; font-weight: 800; color: #92400e; text-transform: uppercase; margin-bottom: 8px; text-align: center;">
                  🥄 Wooden Spoon Shield Final
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 5px; background: ${bracket.woodenSpoonMatch.winner && bracket.woodenSpoonMatch.p1 && !bracket.woodenSpoonMatch.p1.isBye && bracket.woodenSpoonMatch.winner.id === bracket.woodenSpoonMatch.p1.id ? '#fef3c7' : '#fafafa'}; margin-bottom: 6px;">
                  <span style="font-weight: 700; font-size: 0.86rem; color: ${bracket.woodenSpoonMatch.p1?.isBye ? '#94a3b8' : '#0f172a'};">
                    ${bracket.woodenSpoonMatch.p1 ? (bracket.woodenSpoonMatch.p1.isBye ? '— [SPOON BYE] —' : bracket.woodenSpoonMatch.p1.name) : `<span style="color: #94a3b8; font-style: italic;">${bracket.woodenSpoonMatch.p1PendingLabel || 'Awaiting Contender'}</span>`}
                  </span>
                  ${bracket.woodenSpoonMatch.p1 && !bracket.woodenSpoonMatch.p1.isBye ? `<span style="font-size: 0.7rem; font-weight: 800; color: ${HOUSES[bracket.woodenSpoonMatch.p1.house]?.color || '#94a3b8'}; flex-shrink: 0;">${HOUSES[bracket.woodenSpoonMatch.p1.house]?.name || ''}</span>` : ''}
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 5px; background: ${bracket.woodenSpoonMatch.winner && bracket.woodenSpoonMatch.p2 && !bracket.woodenSpoonMatch.p2.isBye && bracket.woodenSpoonMatch.winner.id === bracket.woodenSpoonMatch.p2.id ? '#fef3c7' : '#fafafa'};">
                  <span style="font-weight: 700; font-size: 0.86rem; color: ${bracket.woodenSpoonMatch.p2?.isBye ? '#94a3b8' : '#0f172a'};">
                    ${bracket.woodenSpoonMatch.p2 ? (bracket.woodenSpoonMatch.p2.isBye ? '— [SPOON BYE] —' : bracket.woodenSpoonMatch.p2.name) : `<span style="color: #94a3b8; font-style: italic;">${bracket.woodenSpoonMatch.p2PendingLabel || 'Awaiting Contender'}</span>`}
                  </span>
                  ${bracket.woodenSpoonMatch.p2 && !bracket.woodenSpoonMatch.p2.isBye ? `<span style="font-size: 0.7rem; font-weight: 800; color: ${HOUSES[bracket.woodenSpoonMatch.p2.house]?.color || '#94a3b8'}; flex-shrink: 0;">${HOUSES[bracket.woodenSpoonMatch.p2.house]?.name || ''}</span>` : ''}
                </div>

                ${
                  bracket.woodenSpoonMatch.p1 &&
                  bracket.woodenSpoonMatch.p2 &&
                  !bracket.woodenSpoonMatch.p1.isBye &&
                  !bracket.woodenSpoonMatch.p2.isBye &&
                  !bracket.woodenSpoonMatch.isBye &&
                  !bracket.woodenSpoonMatch.winner &&
                  chessState.userRole === 'teacher'
                    ? `
                  <div style="display: flex; gap: 8px; margin-top: 10px; border-top: 1px dashed #cbd5e1; padding-top: 8px;">
                    <button type="button" onclick="window.advanceWoodenSpoonWinner('${bracket.woodenSpoonMatch.p1.id}')" style="flex: 1; background: #fffbeb; border: 1.5px solid #fcd34d; font-size: 0.74rem; font-weight: 800; padding: 6px; border-radius: 5px; cursor: pointer; color: #78350f;" title="Spoon Win for ${bracket.woodenSpoonMatch.p1.name}">
                      ${getPlayerButtonShortName(bracket.woodenSpoonMatch.p1)} Wins Spoon
                    </button>
                    <button type="button" onclick="window.advanceWoodenSpoonWinner('${bracket.woodenSpoonMatch.p2.id}')" style="flex: 1; background: #fffbeb; border: 1.5px solid #fcd34d; font-size: 0.74rem; font-weight: 800; padding: 6px; border-radius: 5px; cursor: pointer; color: #78350f;" title="Spoon Win for ${bracket.woodenSpoonMatch.p2.name}">
                      ${getPlayerButtonShortName(bracket.woodenSpoonMatch.p2)} Wins Spoon
                    </button>
                  </div>
                `
                    : ''
                }
                ${
                  bracket.woodenSpoonMatch.winner && !bracket.woodenSpoonMatch.winner.isBye
                    ? `
                  <div style="font-size: 0.76rem; font-weight: 800; color: #78350f; text-align: center; margin-top: 8px; padding-top: 6px; border-top: 1px solid #fef3c7;">
                    🥄 Wooden Spoon Shield Winner: ${bracket.woodenSpoonMatch.winner.name}${bracket.woodenSpoonMatch.isBye ? ' (Walkover)' : ' (+3 pts)'}
                  </div>
                `
                    : ''
                }
              </div>
            </div>
          </div>
        `
            : ''
        }

        ${showRapid ? renderRapidRepairingSectionHTML(bracket) : ''}
      </div>
    </div>
  `;
}

function renderKnockoutFullscreenArena(sortedHouses) {
  const bracket = chessState.knockoutBracket;
  if (!bracket) return '';
  const tier = chessState.bracketTierFilter || 'all';
  const tierBtnStyle = (active) =>
    `background: ${active ? '#f59e0b' : '#1e293b'}; color: ${active ? '#0f172a' : '#cbd5e1'}; border: 1px solid ${active ? '#fbbf24' : '#475569'}; font-weight: 800; font-size: 0.74rem; padding: 5px 10px; border-radius: 6px; cursor: pointer;`;

  return `
    <div id="ko-fullscreen-arena" style="position: fixed; inset: 0; z-index: 99995; background: #f8fafc; display: flex; flex-direction: column; overflow: hidden; font-family: 'Outfit', sans-serif;">
      <style>
        #ko-fullscreen-scroll-body::-webkit-scrollbar { width: 18px; height: 18px; }
        #ko-fullscreen-scroll-body::-webkit-scrollbar-track { background: #e2e8f0; }
        #ko-fullscreen-scroll-body::-webkit-scrollbar-thumb { background: #64748b; border-radius: 9px; border: 3px solid #e2e8f0; }
        #ko-fullscreen-scroll-body::-webkit-scrollbar-thumb:hover { background: #334155; }
      </style>

      <!-- Sticky Top Full-Screen Command Bar (Compact Single-Row Layout at 1440px+) -->
      <div style="background: #0f172a; color: #ffffff; padding: 6px 12px; display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap; border-bottom: 2px solid #f59e0b; box-shadow: 0 4px 16px rgba(0,0,0,0.22); flex-shrink: 0;">
        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
          <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 0.9rem; font-weight: 800; color: #fbbf24; white-space: nowrap;">
            🏆 Arena
          </span>
          <div style="display: flex; gap: 3px; align-items: center; flex-wrap: wrap;">
            ${(sortedHouses || [])
              .map((hStats) => {
                const h = HOUSES[hStats.id];
                if (!h) return '';
                return `<span style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); padding: 2px 6px; border-radius: 10px; font-size: 0.66rem; font-weight: 800; color: #f8fafc; white-space: nowrap;">${h.name}: <strong style="color: #fbbf24;">${hStats.points}</strong></span>`;
              })
              .join('')}
          </div>
        </div>

        <!-- Center: Tier Switcher + Live Round Timer -->
        <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
          <button type="button" onclick="window.setBracketTierFilter('all')" style="${tierBtnStyle(tier === 'all')}">All</button>
          <button type="button" onclick="window.setBracketTierFilter('cup')" style="${tierBtnStyle(tier === 'cup')}">🏆 Cup</button>
          <button type="button" onclick="window.setBracketTierFilter('plate')" style="${tierBtnStyle(tier === 'plate')}">🥈 Plate</button>
          <button type="button" onclick="window.setBracketTierFilter('spoon')" style="${tierBtnStyle(tier === 'spoon')}">🥄 Spoon</button>
          <button type="button" onclick="window.setBracketTierFilter('rapid')" style="${tierBtnStyle(tier === 'rapid')}">⚡ Rapid</button>
          ${renderTournamentTimerBarHTML(true)}
        </div>

        <!-- Right: Undo, Save, Zoom, Exit -->
        <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
          ${renderUndoAndSaveButtonsHTML(true)}
          ${renderBracketZoomControlsHTML(true)}
          <button type="button" onclick="window.toggleBracketFullscreen(false)" style="background: #dc2626; color: #ffffff; border: 1px solid #f87171; padding: 5px 9px; border-radius: 6px; font-weight: 800; font-size: 0.72rem; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;" title="Exit Full Screen (Esc)">
            ✕ Exit
          </button>
        </div>
      </div>

      <!-- Unified 2D Touch & Drag Scroll Viewport -->
      <div id="ko-fullscreen-scroll-body" style="flex: 1; overflow: auto; -webkit-overflow-scrolling: touch; touch-action: pan-x pan-y; overscroll-behavior: contain; cursor: grab; padding: 14px 56px 40px 56px; position: relative;">
        ${renderRoundTimeUpBannerHTML()}
        <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 14px; padding: 18px 20px; box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06); display: inline-block; min-width: 100%; box-sizing: border-box;">
          ${renderKnockoutBracketStagesHTML(bracket, { isFullscreen: true })}
        </div>
      </div>

      <!-- Dual-Side Big Touch TV Scroll Buttons (Accessible from BOTH Left & Right sides of a 75" Smartboard!) -->
      <div style="position: fixed; left: 8px; bottom: 18px; z-index: 99997; display: flex; flex-direction: column; gap: 6px;">
        <button type="button" onclick="window.scrollBracketViewport(-320, 0)" style="width: 42px; height: 46px; border-radius: 10px; background: rgba(15, 23, 42, 0.88); color: #ffffff; border: 1.5px solid #475569; font-size: 1.1rem; font-weight: 900; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.25);" title="Scroll Up">▲</button>
        <button type="button" onclick="window.scrollBracketViewport(320, 0)" style="width: 42px; height: 46px; border-radius: 10px; background: rgba(15, 23, 42, 0.88); color: #ffffff; border: 1.5px solid #475569; font-size: 1.1rem; font-weight: 900; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.25);" title="Scroll Down">▼</button>
      </div>
      <div style="position: fixed; right: 24px; bottom: 18px; z-index: 99997; display: flex; flex-direction: column; gap: 6px;">
        <button type="button" onclick="window.scrollBracketViewport(-320, 0)" style="width: 42px; height: 46px; border-radius: 10px; background: rgba(15, 23, 42, 0.88); color: #ffffff; border: 1.5px solid #475569; font-size: 1.1rem; font-weight: 900; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.25);" title="Scroll Up">▲</button>
        <button type="button" onclick="window.scrollBracketViewport(320, 0)" style="width: 42px; height: 46px; border-radius: 10px; background: rgba(15, 23, 42, 0.88); color: #ffffff; border: 1.5px solid #475569; font-size: 1.1rem; font-weight: 900; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.25);" title="Scroll Down">▼</button>
      </div>

      ${renderAdjudicationModalOverlay()}
    </div>
  `;
}

// 5. Digital Knockout Cup (Single-Elimination Bracket) (Audio 3)
function renderKnockoutTab() {
  const bracket = chessState.knockoutBracket;

  if (!bracket) {
    return `
      ${renderKnockoutAttendanceBar()}
      <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 40px 24px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 16px;">
          <i class="fa-solid fa-trophy"></i>
        </div>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; color: #0f172a; margin: 0 0 10px 0;">
          Thursday Period 6 Knockout Cup
        </h2>
        <p style="color: #64748b; max-width: 580px; margin: 0 auto 24px; font-size: 0.95rem; line-height: 1.6;">
          Keep it fully digital! Mark attending pupils above as they arrive, then tap <strong>Auto-Populate Seeded Bracket</strong>. Top seeds receive Round 1 Byes — and if a Round 1 Bye recipient loses their first game, they drop straight into the <strong>Challenger Plate</strong> so everyone stays involved!
        </p>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <button type="button" onclick="window.generateKnockoutTournament()" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000; font-weight: 800; font-size: 1rem; padding: 12px 26px; border-radius: 8px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);">
            <i class="fa-solid fa-sitemap"></i> Auto-Populate Seeded Bracket
          </button>
          ${
            chessState.userRole === 'teacher'
              ? `
            <button type="button" onclick="window.openTournamentSaveModal()" style="background: #e0f2fe; color: #0369a1; border: 1.5px solid #7dd3fc; font-weight: 800; font-size: 0.92rem; padding: 12px 20px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
              💾 Paste Saved Tournament Progress
            </button>
          `
              : ''
          }
        </div>
      </div>
    `;
  }

  return `
    ${renderKnockoutAttendanceBar()}
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 20px 20px 24px 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: inline-flex; align-items: center; gap: 6px; background: #fef3c7; color: #b45309; padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">
            <i class="fa-solid fa-trophy"></i> Multi-Tier Inclusive Knockout
          </div>
          <h2 style="font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #0f172a; margin: 4px 0 0 0;">
            Thursday Period 6 Championship Tournament
          </h2>
          <div style="font-size: 0.84rem; color: #64748b; margin-top: 2px;">
            🏆 Championship Cup · 🥈 Challenger Plate (incl. R1 Bye 1st-loss entry) · 🥄 Wooden Spoon · ⚡ Rapid Re-Pair
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 7px; flex-wrap: wrap;">
          ${renderUndoAndSaveButtonsHTML(false)}
          ${renderBracketZoomControlsHTML(false)}
          <button type="button" onclick="window.toggleBracketFullscreen(true)" style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; border: 1px solid #1e3a8a; padding: 7px 13px; border-radius: 6px; font-weight: 800; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.18);" title="Expand Tournament Bracket to Full Screen (Shortcut: F)">
            <i class="fa-solid fa-expand"></i> Full Screen TV
          </button>
          <button type="button" onclick="window.generateKnockoutTournament()" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; padding: 7px 12px; border-radius: 6px; font-weight: 700; font-size: 0.8rem; cursor: pointer;" title="Re-seed bracket using currently arrived pupils">
            <i class="fa-solid fa-rotate"></i> Re-Seed
          </button>
          <button type="button" onclick="window.resetKnockoutTournament()" style="background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; padding: 7px 12px; border-radius: 6px; font-weight: 700; font-size: 0.8rem; cursor: pointer;">
            Clear
          </button>
        </div>
      </div>

      ${renderTournamentTimerBarHTML(false)}
      ${renderRoundTimeUpBannerHTML()}
      ${renderKnockoutBracketStagesHTML(bracket, { isFullscreen: false })}

    </div>
  `;
}

// 6. Historical Chess Opening Drill Cards (2-Minute Timers)
function renderDrillsTab() {
  return `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      
      <!-- Guidance Header -->
      <div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border: 1.5px solid #fbcfe8; border-radius: 12px; padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: #db2777; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0;">
            <i class="fa-solid fa-stopwatch-20"></i>
          </div>
          <div>
            <h3 style="margin: 0; font-size: 1.15rem; color: #831843; font-weight: 800;">2-Minute "Chess in History" Opening Drills</h3>
            <div style="font-size: 0.85rem; color: #9d174d; margin-top: 2px;">
              Kick off Period 6 sessions with a historical spark! Pose the tactical problem to pupils, hit the 2-minute timer, and reveal the grandmaster solution.
            </div>
          </div>
        </div>
      </div>

      <!-- The Beth Harmon Ceiling Board (Tactical Showcase) -->
      ${renderBethHarmonCeilingBoard()}

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 20px;">
        ${HISTORICAL_CHESS_SPOTLIGHTS.map((sp) => {
          return `
          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 22px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="background: #f1f5f9; color: #475569; padding: 3px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">
                  <i class="fa-solid ${sp.icon}" style="color: ${sp.color || '#8b5cf6'};"></i> ${sp.badge}
                </span>
                <span style="font-size: 0.75rem; color: #b45309; font-weight: 700;">${sp.period}</span>
              </div>

              <h3 style="font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #0f172a; margin: 0 0 8px 0; font-weight: 700;">
                ${sp.title}
              </h3>

              <p style="font-size: 0.9rem; color: #334155; line-height: 1.55; margin: 0 0 14px 0;">
                ${sp.excerpt}
              </p>

              <!-- Tactical Drill Box -->
              <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-bottom: 14px;">
                <div style="font-weight: 800; font-size: 0.85rem; color: #0f172a; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-crosshairs" style="color: #ef4444;"></i> ${sp.drill.headline}
                </div>
                <div style="font-size: 0.85rem; color: #475569; line-height: 1.5; margin-bottom: 8px;">
                  ${sp.drill.scenario}
                </div>
                <div style="font-size: 0.78rem; color: #64748b; font-style: italic;">
                  <strong>Hint:</strong> ${sp.drill.hint}
                </div>

                <!-- 2-Minute Timer Widget -->
                <div style="display: flex; align-items: center; justify-content: space-between; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; margin-top: 10px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-hourglass-half" style="color: #f59e0b;"></i>
                    <span id="timer-display-${sp.id}" style="font-family: monospace; font-size: 1.15rem; font-weight: 800; color: #0f172a;">02:00</span>
                  </div>
                  <div style="display: flex; gap: 6px;">
                    <button id="timer-btn-${sp.id}" onclick="window.startDrillTimer('${sp.id}')" style="background: #0284c7; color: #fff; border: none; padding: 5px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">
                      Start
                    </button>
                    <button onclick="window.resetDrillTimer('${sp.id}')" style="background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; padding: 5px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">
                      Reset
                    </button>
                  </div>
                </div>

                <!-- Solution Reveal Accordion -->
                <div style="margin-top: 10px;">
                  <button onclick="window.toggleDrillSolution('${sp.id}')" style="background: none; border: none; color: #2563eb; font-size: 0.8rem; font-weight: 700; cursor: pointer; padding: 0; display: inline-flex; align-items: center; gap: 4px;">
                    <i class="fa-solid fa-key"></i> Reveal Solution
                  </button>
                  <div id="solution-${sp.id}" style="display: none; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 8px 10px; margin-top: 6px; font-size: 0.82rem; color: #065f46; line-height: 1.45;">
                    <strong>Solution:</strong> ${sp.drill.solution}
                  </div>
                </div>

              </div>

            </div>

            <!-- Did you know & Hinge -->
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="background: #fffbeb; border-left: 3.5px solid #f59e0b; padding: 8px 12px; border-radius: 0 6px 6px 0; font-size: 0.78rem; color: #92400e; line-height: 1.4;">
                <strong><i class="fa-solid fa-lightbulb"></i> Did You Know?</strong> ${sp.didYouKnow}
              </div>
              <div style="background: #f0fdfa; border-left: 3.5px solid #0d9488; padding: 8px 12px; border-radius: 0 6px 6px 0; font-size: 0.78rem; color: #115e59; line-height: 1.4;">
                <strong><i class="fa-solid fa-question-circle"></i> Discussion Question:</strong> ${sp.drill.hingeQuestion}
              </div>
            </div>

          </div>
        `;
        }).join('')}
      </div>

    </div>
  `;
}

// 7. Match History View
function renderMatchesTab() {
  return `
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-weight: 700; font-size: 0.85rem; color: #64748b; text-transform: uppercase;">
          Recorded Games (${chessState.matches.length})
        </span>
        <button onclick="window.openLogMatchModal()" style="background: #8b5cf6; color: #ffffff; border: none; padding: 6px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; cursor: pointer;">
          + Log Another Match
        </button>
      </div>

      ${[...chessState.matches]
        .reverse()
        .map((m) => {
          const wH = HOUSES[m.whiteHouse] || { name: m.whiteHouse, color: '#334155' };
          const bH = HOUSES[m.blackHouse] || { name: m.blackHouse, color: '#334155' };
          const whiteDisplay = CALLSIGN_TO_FIRST_NAME[m.white] || m.white;
          const blackDisplay = CALLSIGN_TO_FIRST_NAME[m.black] || m.black;

          let scoreBadge = '';
          if (m.result === '1-0') {
            scoreBadge = `<span style="background: #dcfce7; color: #166534; font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem;">1 - 0</span>`;
          } else if (m.result === '0-1') {
            scoreBadge = `<span style="background: #dcfce7; color: #166534; font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem;">0 - 1</span>`;
          } else {
            scoreBadge = `<span style="background: #e0f2fe; color: #0369a1; font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem;">½ - ½</span>`;
          }

          return `
          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            
            <div style="display: flex; align-items: center; gap: 16px;">
              <!-- White Player -->
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 28px; height: 28px; border-radius: 6px; background: #ffffff; border: 1.5px solid #cbd5e1; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; color: #0f172a;">
                  <i class="fa-solid fa-chess-pawn"></i>
                </div>
                <div>
                  <div style="font-weight: 700; color: #0f172a; font-size: 0.95rem;">${whiteDisplay}</div>
                  <span style="font-size: 0.72rem; color: ${wH.color}; font-weight: 700;">${wH.name}</span>
                </div>
              </div>

              <div style="font-size: 0.8rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;">vs</div>

              <!-- Black Player -->
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 28px; height: 28px; border-radius: 6px; background: #0f172a; border: 1.5px solid #0f172a; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; color: #ffffff;">
                  <i class="fa-solid fa-chess-pawn"></i>
                </div>
                <div>
                  <div style="font-weight: 700; color: #0f172a; font-size: 0.95rem;">${blackDisplay}</div>
                  <span style="font-size: 0.72rem; color: ${bH.color}; font-weight: 700;">${bH.name}</span>
                </div>
              </div>
            </div>

            <!-- Match Meta & Result -->
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="text-align: right;">
                <div style="font-size: 0.8rem; color: #64748b;">${m.date} · ${m.round || 'Period 6'}</div>
                ${m.opening ? `<div style="font-size: 0.75rem; color: #b45309; font-weight: 600;">${m.opening}</div>` : ''}
              </div>
              <div>${scoreBadge}</div>
            </div>

          </div>
        `;
        })
        .join('')}
    </div>
  `;
}

// Styling Helpers: Modern High-Contrast Navigation Tabs
function getTabStyle(isActive) {
  return `
    padding: 6px 14px;
    font-size: 0.8rem;
    font-weight: 800;
    font-family: 'Outfit', sans-serif;
    letter-spacing: 0.01em;
    border: 1px solid ${isActive ? '#0284c7' : '#e2e8f0'};
    background: ${isActive ? '#0284c7' : '#ffffff'};
    border-radius: 6px;
    cursor: pointer;
    color: ${isActive ? '#ffffff' : '#334155'};
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    box-shadow: ${isActive ? '0 1px 3px rgba(2,132,199,0.3)' : '0 1px 2px rgba(0,0,0,0.02)'};
    transition: all 0.15s ease;
  `;
}

function getFilterPillStyle(isActive) {
  return `
    padding: 2px 7px;
    font-size: 0.7rem;
    font-weight: 700;
    font-family: monospace;
    letter-spacing: 0.02em;
    border-radius: 4px;
    border: 1px solid ${isActive ? '#1c1917' : '#d6d3d1'};
    background: ${isActive ? '#1c1917' : '#faf8f5'};
    color: ${isActive ? '#fafaf9' : '#57534e'};
    cursor: pointer;
    transition: all 0.15s ease;
  `;
}

window.toggleChessAdminDropdown = function (e) {
  if (e && e.stopPropagation) e.stopPropagation();
  chessState.showAdminDropdown = !chessState.showAdminDropdown;
  renderChessHubView();
};

window.toggleTeacherGuideCollapse = function () {
  chessState.showTeacherGuide = !chessState.showTeacherGuide;
  renderChessHubView();
};

if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    if (chessState.showAdminDropdown) {
      const menu = document.getElementById('chess-admin-dropdown');
      const btn = document.getElementById('btn-chess-admin-menu');
      if (menu && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
        chessState.showAdminDropdown = false;
        renderChessHubView();
      }
    }
  });
}

// Teacher Authentication & Pupil Safeguard Handlers
window.openTeacherUnlockModal = function () {
  const modalCont = getChessModalContainer();
  if (!modalCont) return;

  modalCont.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.78); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 20px;" onclick="if(event.target === this) window.closeChessModal();">
      <div style="background: #1c1917; border: 2px solid #d4af37; border-radius: 14px; max-width: 440px; width: 100%; padding: 26px 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); color: #f8fafc; font-family: 'Outfit', sans-serif; animation: zoomIn 0.18s ease-out;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(212, 175, 55, 0.15); border: 1.5px solid #d4af37; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #d4af37; flex-shrink: 0;">
            🔒
          </div>
          <div>
            <h3 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.35rem; color: #fafaf9; font-weight: 700;">
              Teacher Access Lock
            </h3>
            <div style="font-size: 0.78rem; color: #a8a29e; margin-top: 2px;">
              Enter the teacher passkey to unlock match logging &amp; point controls on this device.
            </div>
          </div>
        </div>

        <form onsubmit="window.handleTeacherUnlockSubmit(event)" style="margin: 0;">
          <div style="margin-bottom: 16px;">
            <label for="teacher-passkey-input" style="display: block; font-size: 0.78rem; font-weight: 700; color: #e7e5e4; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px;">
              Passkey:
            </label>
            <input
              id="teacher-passkey-input"
              type="password"
              autofocus
              autocomplete="off"
              placeholder="Enter staff passkey"
              style="width: 100%; box-sizing: border-box; background: #0c0a09; border: 1.5px solid #57534e; border-radius: 8px; padding: 12px 14px; color: #ffffff; font-size: 1.05rem; font-family: monospace; outline: none; transition: border-color 0.2s;"
              onfocus="this.style.borderColor='#d4af37'"
              onblur="this.style.borderColor='#57534e'"
            />
            <div id="teacher-unlock-error" style="display: none; color: #f87171; font-size: 0.78rem; font-weight: 700; margin-top: 6px;">
              ⚠️ Incorrect passkey. Please check and try again.
            </div>
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button type="button" onclick="window.closeChessModal()" style="background: transparent; color: #a8a29e; border: 1px solid #44403c; padding: 10px 16px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
              Cancel
            </button>
            <button type="submit" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: 1px solid #34d399; padding: 10px 20px; border-radius: 8px; font-weight: 800; font-size: 0.88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
              <span>🔓</span> Unlock Teacher Mode
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  setTimeout(() => {
    const inp = document.getElementById('teacher-passkey-input');
    if (inp) inp.focus();
  }, 60);
};

window.handleTeacherUnlockSubmit = function (e) {
  if (e && e.preventDefault) e.preventDefault();
  const inp = document.getElementById('teacher-passkey-input');
  const err = document.getElementById('teacher-unlock-error');
  if (!inp) return false;

  const val = inp.value.trim().toLowerCase();

  if (verifyStaffPasskeySync(val)) {
    localStorage.setItem('history_chess_teacher_auth', 'true');
    chessState.userRole = 'teacher';
    chessState.isPupilPreview = false;
    chessState.showQuickDesk = false;
    window.closeChessModal();
    renderChessHubView();
    showChessToast('🔓 Teacher Mode Unlocked! Tap "⚡ Quick Desk" anytime to log matches.', 'success');
  } else {
    if (err) err.style.display = 'block';
    inp.style.borderColor = '#ef4444';
    inp.select();
  }
  return false;
};

window.promptTeacherUnlock = window.openTeacherUnlockModal;

window.selectPlayerForQuickDesk = function (playerId) {
  if (chessState.userRole !== 'teacher') return;
  chessState.showQuickDesk = true;
  if (!chessState.quickDeskP1Id) {
    chessState.quickDeskP1Id = playerId;
  } else if (!chessState.quickDeskP2Id && chessState.quickDeskP1Id !== playerId) {
    chessState.quickDeskP2Id = playerId;
  } else if (chessState.quickDeskP1Id === playerId) {
    chessState.quickDeskP1Id = '';
  } else {
    chessState.quickDeskP1Id = playerId;
    chessState.quickDeskP2Id = '';
  }
  renderChessHubView();
};

window.toggleQuickDeskDrawer = function () {
  chessState.showQuickDesk = !chessState.showQuickDesk;
  renderChessHubView();
  if (chessState.showQuickDesk) {
    setTimeout(() => {
      const desk = document.getElementById('teacher-quick-desk');
      if (desk) desk.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }
};

window.toggleLadderAdminTools = function () {
  chessState.showLadderAdminTools = !chessState.showLadderAdminTools;
  renderChessHubView();
};

window.togglePupilPreview = function () {
  chessState.isPupilPreview = true;
  chessState.userRole = 'pupil';
  if (chessState.activeTab === 'signin' || chessState.activeTab === 'quickdesk') {
    chessState.activeTab = 'play';
  }
  showChessToast('👁 Switched to Pupil Preview (Teacher tools hidden)', 'info');
  renderChessHubView();
};

window.exitPupilPreview = function () {
  chessState.isPupilPreview = false;
  chessState.userRole = 'teacher';
  chessState.showQuickDesk = false;
  showChessToast('✏️ Returned to Teacher Mode', 'success');
  renderChessHubView();
};

window.toggleProjectorMode = function () {
  chessState.projectorMode = !chessState.projectorMode;
  renderChessHubView();
  showChessToast(
    chessState.projectorMode
      ? '📺 Projector Mode Active (Clean Classroom View)'
      : '💻 Teacher View Active',
    'info',
  );
};

window.lockTeacherMode = function () {
  localStorage.removeItem('history_chess_teacher_auth');
  chessState.isPupilPreview = false;
  chessState.userRole = 'pupil';
  chessState.showQuickDesk = false;
  if (chessState.activeTab === 'signin' || chessState.activeTab === 'quickdesk') {
    chessState.activeTab = 'ladder';
  }
  showChessToast('🔒 Teacher mode locked (Pupil View active)', 'info');
  renderChessHubView();
};

window.closeChessAdminDropdownOnly = function () {
  chessState.showAdminDropdown = false;
  const menu = document.getElementById('chess-admin-dropdown');
  if (menu) menu.style.display = 'none';
};

function getChessModalContainer() {
  let modalCont = document.getElementById('chess-modal-container');
  if (!modalCont) {
    modalCont = document.createElement('div');
    modalCont.id = 'chess-modal-container';
    document.body.appendChild(modalCont);
  } else if (modalCont.parentElement !== document.body) {
    document.body.appendChild(modalCont);
  }
  return modalCont;
}

// Navigation Handlers
window.switchChessTab = function (tabName) {
  if (
    chessState.userRole === 'pupil' &&
    (tabName === 'quickdesk' || tabName === 'signin')
  ) {
    showChessToast('🔒 Access Restricted: Teacher mode required.', 'error');
    return;
  }
  chessState.activeTab = tabName;
  if (tabName === 'beginners') {
    chessState.puzzleCategory = 'beginner';
    chessState.currentPuzzleIdx = 0;
    chessState.activePuzzleBoard = null;
    chessState.selectedSquare = null;
    chessState.puzzleMoveStep = 0;
    chessState.puzzleStatus = 'idle';
    chessState.puzzleFeedback = null;
    chessState.showBethHarmonHint = false;
    chessState.showBethHarmonSolution = false;
  }
  renderChessHubView();
};

window.setChessYearFilter = function () {};

window.setChessHouseFilter = function (houseId) {
  chessState.filterHouse = houseId;
  renderChessHubView();
};

// Check-in / Attendance Handlers
window.checkInPlayer = function (id) {
  const p = chessState.players.find((x) => x.id === id);
  if (!p) return;
  if (!chessState.checkedInPlayerIds.includes(id)) {
    chessState.checkedInPlayerIds.push(id);
    saveChessState();
    renderChessHubView();
    showChessToast(`✓ ${p.name} checked in!`, 'success');
  }
};

window.checkOutPlayer = function (id) {
  const p = chessState.players.find((x) => x.id === id);
  chessState.checkedInPlayerIds = chessState.checkedInPlayerIds.filter((pId) => pId !== id);
  saveChessState();
  renderChessHubView();
  showChessToast(`Marked ${p ? p.name : 'pupil'} as absent`, 'info');
};

window.checkInAllPlayers = function () {
  chessState.checkedInPlayerIds = chessState.players.map((p) => p.id);
  saveChessState();
  renderChessHubView();
  showChessToast(`All ${chessState.players.length} pupils checked in!`, 'success');
};

window.clearAttendance = function () {
  chessState.checkedInPlayerIds = [];
  saveChessState();
  renderChessHubView();
  showChessToast('Attendance reset for today', 'info');
};

window.handleChecklistChange = function (id, checked) {
  if (checked) {
    window.checkInPlayer(id);
  } else {
    window.checkOutPlayer(id);
  }
};

window.toggleAllAttendance = function (checkAll) {
  if (checkAll) {
    window.checkInAllPlayers();
  } else {
    window.clearAttendance();
  }
};

window.removePlayer = function (id) {
  const p = chessState.players.find((x) => x.id === id);
  const name = p ? p.name : 'Pupil';
  chessState.players = chessState.players.filter((x) => x.id !== id);
  chessState.checkedInPlayerIds = chessState.checkedInPlayerIds.filter((pId) => pId !== id);
  chessState.players.sort((a, b) => a.rank - b.rank);
  chessState.players.forEach((player, idx) => {
    player.rank = idx + 1;
  });
  saveChessState();
  renderChessHubView();
  showChessToast(`Removed ${name} from the club`, 'info');
};

// Teacher Ladder Rung Nudge (Immediate 1-Click Rank Calibration)
window.movePlayerLadderRank = function (id, direction) {
  if (
    chessState.userRole !== 'teacher' ||
    localStorage.getItem('history_chess_teacher_auth') !== 'true'
  ) {
    showChessToast('🔒 Access Denied: Only teachers can adjust ladder ranks.', 'error');
    return;
  }
  const players = chessState.players;
  players.sort((a, b) => a.rank - b.rank);
  const idx = players.findIndex((p) => p.id === id);
  if (idx === -1) return;

  if (direction === 'up' && idx > 0) {
    const tempRank = players[idx].rank;
    players[idx].rank = players[idx - 1].rank;
    players[idx - 1].rank = tempRank;
  } else if (direction === 'down' && idx < players.length - 1) {
    const tempRank = players[idx].rank;
    players[idx].rank = players[idx + 1].rank;
    players[idx + 1].rank = tempRank;
  } else {
    return;
  }

  players.sort((a, b) => a.rank - b.rank);
  players.forEach((p, i) => (p.rank = i + 1));
  saveChessState();
  renderChessHubView();
  showChessToast('Ladder rank adjusted.', 'info');
};

// Teacher 1-Click Auto-Sort by Points (Largest to Smallest)
window.sortLadderByPoints = function () {
  if (
    chessState.userRole !== 'teacher' ||
    localStorage.getItem('history_chess_teacher_auth') !== 'true'
  ) {
    showChessToast('🔒 Access Denied: Only teachers can adjust ladder ranks.', 'error');
    return;
  }
  autoSortPlayersByPoints();
  saveChessState();
  renderChessHubView();
  showChessToast('⚡ Pupils automatically sorted by points (largest to smallest)!', 'success');
};

window.resetClubDataToCleanSlate = function () {
  const count = chessState.players.length;
  const matchCount = chessState.matches.length;

  const msg =
    count > 0
      ? `⚠️ RESET CHESS CLUB SLATE\n\nAre you sure you want to clear the active cohort for the new term/year?\n\n• ${count} pupils on ladder\n• ${matchCount} match records\n• House championship points\n\n🛡️ SAFETY NET: An emergency backup snapshot will be automatically preserved. You can undo or restore this cohort at any time if clicked by accident.`
      : 'Are you sure you want to reset the club to a clean slate?';

  if (confirm(msg)) {
    if (count > 0 || matchCount > 0) {
      try {
        const backup = {
          timestamp: Date.now(),
          dateStr: new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          playerCount: count,
          matchCount: matchCount,
          state: JSON.parse(JSON.stringify(chessState)),
        };
        localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
      } catch (err) {
        console.error('Failed to create emergency backup:', err);
      }
    }
    initChessState(true);
    renderChessHubView();
    showChessToast('Club reset to clean slate. Safety backup created!', 'warning');
  }
};

window.restoreChessBackup = function () {
  try {
    const raw = localStorage.getItem(BACKUP_KEY);
    if (!raw) {
      showChessToast('No previous backup found to restore.', 'warning');
      return;
    }
    const backup = JSON.parse(raw);
    if (!backup.state || !Array.isArray(backup.state.players)) {
      showChessToast('Backup archive is invalid or corrupted.', 'error');
      return;
    }
    chessState.players = Array.isArray(backup.state.players) ? backup.state.players : [];
    chessState.matches = Array.isArray(backup.state.matches) ? backup.state.matches : [];
    chessState.checkedInPlayerIds = Array.isArray(backup.state.checkedInPlayerIds)
      ? backup.state.checkedInPlayerIds
      : [];
    chessState.knockoutBracket = backup.state.knockoutBracket || null;
    saveChessState();
    renderChessHubView();
    showChessToast(
      `🎉 Restored previous cohort: ${backup.playerCount} pupils & ${backup.matchCount} games from ${backup.dateStr}!`,
      'success',
    );
  } catch (err) {
    console.error('Failed to restore chess backup:', err);
    showChessToast('Error restoring previous cohort.', 'error');
  }
};

window.handleSelfRegister = function (e) {
  if (e && e.preventDefault) e.preventDefault();

  if (
    chessState.userRole !== 'teacher' ||
    localStorage.getItem('history_chess_teacher_auth') !== 'true'
  ) {
    showChessToast('🔒 Access Denied: Only teachers can register pupils.', 'error');
    return false;
  }

  const nameInput = document.getElementById('reg-name');
  if (!nameInput) return false;
  const rawName = nameInput.value.trim();
  const name = sanitizePupilName(rawName);
  nameInput.value = name;

  const house = document.getElementById('reg-house')?.value || 'warrior';

  if (!name) {
    showChessToast("Please enter the pupil's name.", 'warning');
    return false;
  }

  // Check if pupil already registered (case-insensitive by realName, name, or nickname)
  const existing = chessState.players.find(
    (p) =>
      (p.realName && p.realName.toLowerCase() === name.toLowerCase()) ||
      p.name.toLowerCase() === name.toLowerCase() ||
      (p.nickname && p.nickname.toLowerCase() === name.toLowerCase()),
  );

  if (existing) {
    if (!chessState.checkedInPlayerIds.includes(existing.id)) {
      chessState.checkedInPlayerIds.push(existing.id);
      saveChessState();
      renderChessHubView();
      showChessToast(`Welcome back, ${existing.name || existing.realName}! Checked in.`, 'success');
    } else {
      showChessToast(
        `${existing.name || existing.realName} is already checked in for today!`,
        'info',
      );
    }
    return false;
  }

  const newId = 'p_' + Date.now();
  const newRank = chessState.players.length + 1;
  const newPlayer = {
    id: newId,
    name: name,
    nickname: name,
    realName: name,
    house: house,
    rating: 1000,
    games: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    rank: newRank,
  };

  chessState.players.push(newPlayer);
  chessState.checkedInPlayerIds.push(newId);
  savePlayerRealName(newId, name);
  saveChessState();
  renderChessHubView();
  showChessToast(`🎉 Welcome ${name}! (${HOUSES[house]?.name || house})`, 'success');

  setTimeout(() => {
    const input = document.getElementById('reg-name');
    if (input) input.focus();
  }, 50);

  return false;
};

// 1-Click Pair Only Free Pupils (Safe Mode - Does not disturb in-progress boards!)
window.pairFreePupilsOnMatchGrid = function () {
  const activePairings = chessState.activePairings || [];
  const busyIds = new Set();

  activePairings.forEach((b) => {
    if (!b.completed && !b.isBye) {
      if (b.white && b.white.id) busyIds.add(b.white.id);
      if (b.black && b.black.id) busyIds.add(b.black.id);
    }
  });

  const checkedInSet = new Set(chessState.checkedInPlayerIds || []);
  const freePupils = chessState.players.filter((p) => checkedInSet.has(p.id) && !busyIds.has(p.id));

  if (freePupils.length < 2) {
    if (freePupils.length === 1) {
      const pName =
        DEFAULT_LOCAL_NAME_MAP[freePupils[0].id] ||
        CALLSIGN_TO_FIRST_NAME[freePupils[0].name] ||
        freePupils[0].realName ||
        freePupils[0].name;
      showChessToast(
        `Only 1 free pupil right now (${pName}). Need at least 2 free pupils to pair a new board!`,
        'warning',
      );
    } else {
      showChessToast(
        'All checked-in pupils are currently playing on active boards! None are idle.',
        'info',
      );
    }
    return;
  }

  // Save undo history snapshot
  if (!chessState.pairingsHistory) chessState.pairingsHistory = [];
  chessState.pairingsHistory.push(JSON.parse(JSON.stringify(activePairings)));

  // PRIORITIZE BYE PUPIL: If anyone was on a bye or sat out last round, put them at index 0 so they play immediately!
  const byePairing = activePairings.find((b) => b.isBye && b.white);
  const byePlayerId = byePairing?.white?.id || chessState.lastRoundByePlayerId;
  const byePupil = freePupils.find((p) => p.id === byePlayerId || p.lastRoundBye);
  const otherFree = freePupils.filter((p) => p.id !== byePupil?.id);

  if (byePupil) {
    byePupil.lastRoundBye = false;
    if (chessState.lastRoundByePlayerId === byePupil.id) {
      chessState.lastRoundByePlayerId = null;
    }
  }

  // Sort remaining free pupils by rating
  otherFree.sort((a, b) => (b.rating || 1000) - (a.rating || 1000));
  const pool = byePupil ? [byePupil, ...otherFree] : [...otherFree];

  // Clean out the old bye card if the bye pupil is being paired now
  const existingActive = activePairings.filter(
    (b) => !(b.isBye && byePupil && b.white?.id === byePupil.id),
  );

  let maxBoardNum = 0;
  existingActive.forEach((b) => {
    if (typeof b.board === 'number' && b.board > maxBoardNum) maxBoardNum = b.board;
  });
  let nextBoard = maxBoardNum + 1;

  const newPairings = [];
  while (pool.length >= 2) {
    const white = pool.shift();
    let bestOpponentIdx = 0;
    let lowestCost = Infinity;

    for (let i = 0; i < pool.length; i++) {
      const candidate = pool[i];
      const ratingDiff = Math.abs((candidate.rating || 1000) - (white.rating || 1000));
      const rankDiff = Math.abs((candidate.rank || 99) - (white.rank || 99));
      const housePenalty = candidate.house === white.house ? 45 : 0;

      // Penalize rematches that already happened today
      const rematches = (chessState.matches || []).filter(
        (m) =>
          (m.winnerId === white.id && m.loserId === candidate.id) ||
          (m.winnerId === candidate.id && m.loserId === white.id) ||
          (m.p1Id === white.id && m.p2Id === candidate.id) ||
          (m.p1Id === candidate.id && m.p2Id === white.id),
      ).length;
      const rematchPenalty = rematches * 180;

      const cost = ratingDiff + rankDiff * 15 + housePenalty + rematchPenalty;
      if (cost < lowestCost) {
        lowestCost = cost;
        bestOpponentIdx = i;
      }
    }

    const black = pool.splice(bestOpponentIdx, 1)[0];
    newPairings.push({
      board: nextBoard++,
      white: white,
      black: black,
      completed: false,
      result: null,
      winnerName: null,
      winnerHouse: null,
      matchId: null,
    });
  }

  // If 1 pupil is still left over after pairing, they get the new rotating bye
  if (pool.length === 1) {
    const remainingByePupil = pool[0];
    remainingByePupil.lastRoundBye = true;
    remainingByePupil.byesReceived = (remainingByePupil.byesReceived || 0) + 1;
    chessState.lastRoundByePlayerId = remainingByePupil.id;
    newPairings.push({
      board: nextBoard++,
      white: remainingByePupil,
      black: null,
      isBye: true,
      completed: true,
      result: 'Bye',
    });
  }

  chessState.activePairings = [...existingActive, ...newPairings];
  chessState.activeTab = 'pairings';
  saveChessState();
  renderChessHubView();
  showChessToast(
    `⚡ Paired ${newPairings.filter((p) => !p.isBye).length} new board(s) for free pupils without disturbing ongoing matches!`,
    'success',
  );
};

// Helper: Convert bye card into practice match if manually requested
window.playCoachGame = function (boardNum) {
  if (!chessState.activePairings) return;
  const p = chessState.activePairings.find((x) => x.board === boardNum && x.isBye);
  if (!p || !p.white) return;

  const pupil = p.white;
  const pupilObj = chessState.players.find((x) => x.id === pupil.id) || pupil;

  // Convert bye card into an active match against Coach
  p.isBye = false;
  p.completed = false;
  p.result = null;
  p.isCoachMatch = true;
  p.black = {
    id: 'p_coach',
    name: 'Teacher / Coach',
    realName: 'Teacher / Coach',
    nickname: 'Teacher / Coach',
    house: pupil.house === 'warrior' ? 'victory' : 'warrior',
    rating: pupilObj.rating || 1000,
    games: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    rank: 999,
  };

  // Reset bye status since they are now playing
  pupilObj.lastRoundBye = false;
  p.white.lastRoundBye = false;
  if (chessState.lastRoundByePlayerId === pupil.id) {
    chessState.lastRoundByePlayerId = null;
  }

  saveChessState();
  renderChessHubView();
  showChessToast(
    `♟️ Board ${boardNum}: ${pupilObj.name} vs Teacher / Coach! Match in progress.`,
    'success',
  );
};

// Undo Board Re-Pairing (Instant Teacher Safety Net)
window.undoPairings = function () {
  if (!chessState.pairingsHistory || chessState.pairingsHistory.length === 0) {
    showChessToast('No previous board pairings to restore.', 'info');
    return;
  }
  const previous = chessState.pairingsHistory.pop();
  chessState.activePairings = previous;
  saveChessState();
  renderChessHubView();
  showChessToast('↩️ Restored previous board pairings successfully!', 'success');
};

// Reset / Clear All Active Pairings (Teacher Safety Net)
window.resetPairings = function (skipConfirm = false) {
  const activePairings = chessState.activePairings || [];
  if (activePairings.length === 0) {
    showChessToast('No active board pairings to reset.', 'info');
    return;
  }

  if (!skipConfirm) {
    const activeBoards = activePairings.filter((b) => !b.isBye);
    const incomplete = activeBoards.filter((b) => !b.completed).length;
    const msg =
      incomplete > 0
        ? `Reset all ${activeBoards.length} board pairings? (${incomplete} game(s) are in-progress. Previously logged match history & points will NOT be lost).`
        : `Reset and clear all ${activeBoards.length} board pairings so pupils can be paired afresh?`;
    if (!confirm(msg)) return;
  }

  // Backup current pairings so Undo can restore if pressed accidentally
  if (!Array.isArray(chessState.pairingsHistory)) {
    chessState.pairingsHistory = [];
  }
  chessState.pairingsHistory.push(JSON.parse(JSON.stringify(chessState.activePairings)));

  chessState.activePairings = [];
  if (Array.isArray(chessState.players)) {
    chessState.players.forEach((p) => {
      p.lastRoundBye = false;
    });
  }
  chessState.lastRoundByePlayerId = null;

  saveChessState();
  renderChessHubView();
  showChessToast('🧹 All board pairings cleared! You can now pair pupils afresh.', 'success');
};

// Confirmation modal before re-pairing entire room from scratch
window.confirmNewRoundAll = function () {
  const activePairings = chessState.activePairings || [];
  const inProgressBoards = activePairings.filter((b) => !b.completed && !b.isBye);

  if (inProgressBoards.length > 0) {
    const modalCont = getChessModalContainer();
    const boardList = inProgressBoards
      .map((b) => `Board ${b.board}: ${b.white?.name || 'White'} vs ${b.black?.name || 'Black'}`)
      .join('<br>');

    modalCont.innerHTML = `
      <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 20px;" onclick="if(event.target === this) window.closeChessModal();">
        <div style="background: #ffffff; border-radius: 12px; max-width: 500px; width: 100%; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); font-family: 'Outfit', sans-serif;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 8px; background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">
              ⚠️
            </div>
            <div>
              <h3 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.25rem; color: #0f172a;">
                ${inProgressBoards.length} Game(s) Still In Progress!
              </h3>
              <div style="font-size: 0.78rem; color: #64748b;">
                Active matches have not finished yet.
              </div>
            </div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; font-size: 0.82rem; color: #334155; line-height: 1.6; max-height: 120px; overflow-y: auto; margin-bottom: 14px;">
            ${boardList}
          </div>
          <p style="font-size: 0.88rem; color: #475569; line-height: 1.5; margin: 0 0 18px 0;">
            Do you want to pair <strong>only the pupils who are free</strong>, or start a brand new round for everyone?
          </p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button onclick="window.closeChessModal(); window.pairFreePupilsOnMatchGrid();" style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; border: none; padding: 11px 16px; border-radius: 6px; font-weight: 800; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span>⚡</span> Pair Only Free Pupils (Keeps in-progress games running)
            </button>
            <button onclick="window.closeChessModal(); window.generateThursdayPairings(true);" style="background: #f8fafc; color: #dc2626; border: 1.5px solid #fca5a5; padding: 10px 16px; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span>🔄</span> Re-Pair All 12 from Scratch (Start New Round)
            </button>
            <button onclick="window.closeChessModal();" style="background: none; color: #64748b; border: none; padding: 6px 16px; border-radius: 6px; font-weight: 600; font-size: 0.82rem; cursor: pointer;">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // If no in-progress games, proceed directly
  window.generateThursdayPairings(true);
};

// 1-Click Thursday Period 6 Auto-Pairings Algorithm (With Guaranteed Fair Rotating Bye)
window.generateThursdayPairings = function (force = false) {
  let presentIds = chessState.checkedInPlayerIds;

  // If no pupils are checked in yet, automatically default to all registered pupils
  if (!presentIds || presentIds.length === 0) {
    chessState.checkedInPlayerIds = chessState.players.map((p) => p.id);
    presentIds = chessState.checkedInPlayerIds;
    saveChessState();
    showChessToast(`✓ Arrived checklist set to all ${chessState.players.length} pupils!`, 'info');
  }

  if (presentIds.length < 2) {
    showChessToast('Please check in at least 2 pupils to generate pairings.', 'warning');
    return;
  }

  if (!force) {
    const inProgress = (chessState.activePairings || []).filter((b) => !b.completed && !b.isBye);
    if (inProgress.length > 0) {
      window.confirmNewRoundAll();
      return;
    }
  }

  // Save undo history before replacing
  if (chessState.activePairings && chessState.activePairings.length > 0) {
    if (!chessState.pairingsHistory) chessState.pairingsHistory = [];
    chessState.pairingsHistory.push(JSON.parse(JSON.stringify(chessState.activePairings)));
  }

  const presentPlayers = chessState.players.filter((p) => presentIds.includes(p.id));

  // Initialize bye properties on all players
  presentPlayers.forEach((p) => {
    if (typeof p.byesReceived !== 'number') p.byesReceived = 0;
    if (typeof p.lastRoundBye !== 'boolean') p.lastRoundBye = false;
  });

  const isOdd = presentPlayers.length % 2 === 1;
  let byePlayer = null;

  if (isOdd) {
    // FAIR BYE ROTATION:
    // 1. Strictly exclude anyone who had a bye in the immediate previous round
    let candidates = presentPlayers.filter(
      (p) => !p.lastRoundBye && p.id !== chessState.lastRoundByePlayerId,
    );
    if (candidates.length === 0) candidates = [...presentPlayers];

    // 2. Sort candidates by fewest byes received ascending; secondary: games played descending
    candidates.sort((a, b) => {
      const byesA = a.byesReceived || 0;
      const byesB = b.byesReceived || 0;
      if (byesA !== byesB) return byesA - byesB;
      const gamesA = (a.won || 0) + (a.drawn || 0) + (a.lost || 0);
      const gamesB = (b.won || 0) + (b.drawn || 0) + (b.lost || 0);
      return gamesB - gamesA;
    });

    byePlayer = candidates[0];
    byePlayer.byesReceived = (byePlayer.byesReceived || 0) + 1;
    chessState.lastRoundByePlayerId = byePlayer.id;

    // Reset lastRoundBye for all, then set for the selected bye pupil
    presentPlayers.forEach((p) => {
      p.lastRoundBye = p.id === byePlayer.id;
    });
  } else {
    // Even count - nobody gets a bye
    presentPlayers.forEach((p) => {
      p.lastRoundBye = false;
    });
    chessState.lastRoundByePlayerId = null;
  }

  // Pool of players to pair (even length), sorted by rating descending for top boards
  const pool = presentPlayers
    .filter((p) => !byePlayer || p.id !== byePlayer.id)
    .sort((a, b) => (b.rating || 1000) - (a.rating || 1000));

  const pairings = [];
  while (pool.length >= 2) {
    const white = pool.shift();
    let bestOpponentIdx = 0;
    let lowestCost = Infinity;

    for (let i = 0; i < pool.length; i++) {
      const candidate = pool[i];
      const ratingDiff = Math.abs((candidate.rating || 1000) - (white.rating || 1000));
      const rankDiff = Math.abs((candidate.rank || 99) - (white.rank || 99));
      const housePenalty = candidate.house === white.house ? 45 : 0;

      // Penalize rematches that already happened today
      const rematches = (chessState.matches || []).filter(
        (m) =>
          (m.winnerId === white.id && m.loserId === candidate.id) ||
          (m.winnerId === candidate.id && m.loserId === white.id) ||
          (m.p1Id === white.id && m.p2Id === candidate.id) ||
          (m.p1Id === candidate.id && m.p2Id === white.id),
      ).length;
      const rematchPenalty = rematches * 180;

      const cost = ratingDiff + rankDiff * 15 + housePenalty + rematchPenalty;
      if (cost < lowestCost) {
        lowestCost = cost;
        bestOpponentIdx = i;
      }
    }

    const black = pool.splice(bestOpponentIdx, 1)[0];
    const boardNum = pairings.length + 1;

    pairings.push({
      board: boardNum,
      white: white,
      black: black,
      completed: false,
      result: null,
      winnerName: null,
      winnerHouse: null,
      matchId: null,
    });
  }

  // Add the rotating bye board at the end
  if (byePlayer) {
    pairings.push({
      board: pairings.length + 1,
      white: byePlayer,
      black: null,
      isBye: true,
      completed: true,
      result: 'Bye',
    });
  }

  chessState.activePairings = pairings;
  chessState.activeTab = 'pairings';
  saveChessState();
  renderChessHubView();

  const boardCount = pairings.filter((p) => !p.isBye).length;
  if (byePlayer) {
    const byeName =
      DEFAULT_LOCAL_NAME_MAP[byePlayer.id] ||
      CALLSIGN_TO_FIRST_NAME[byePlayer.name] ||
      byePlayer.realName ||
      byePlayer.name;
    showChessToast(
      `⚔️ Generated ${boardCount} boards! ${byeName} on rotating bye (+1 pt, guaranteed first in next match).`,
      'info',
    );
  } else {
    showChessToast(
      `⚔️ Generated ${boardCount} boards for Period 6! (Even count, all pupils paired)`,
      'success',
    );
  }
};

// ⚡ 1-Click Quick Auto-Pair Trigger (Works from Header Bar, Ladder Toolbar, and Matchmaker)
window.handleQuickAutoPair = function () {
  // If not teacher, prompt to unlock teacher mode first
  if (
    chessState.userRole !== 'teacher' &&
    localStorage.getItem('history_chess_teacher_auth') !== 'true'
  ) {
    window.openTeacherUnlockModal();
    return;
  }

  // If no pupils are checked in yet, auto-check in all registered pupils
  if (!chessState.checkedInPlayerIds || chessState.checkedInPlayerIds.length === 0) {
    chessState.checkedInPlayerIds = chessState.players.map((p) => p.id);
    saveChessState();
    showChessToast(
      `✓ Checked in all ${chessState.players.length} pupils! Generating boards...`,
      'info',
    );
  }

  if (chessState.checkedInPlayerIds.length < 2) {
    showChessToast('Please check in at least 2 pupils to generate pairings.', 'warning');
    return;
  }

  const inProgress = (chessState.activePairings || []).filter((b) => !b.completed && !b.isBye);
  if (inProgress.length > 0) {
    window.confirmNewRoundAll();
    return;
  }

  window.generateThursdayPairings(true);
};

// ============================================================================
// ⚡ TEACHER QUICK DESK EVENT HANDLERS & SECURITY GUARDRAILS
// ============================================================================

/**
 * Classic Ladder Tournament Cascade Bump-Down Rule:
 * When a lower-ranked challenger defeats a higher-ranked player:
 * 1. The winner claims the loser's ladder rung.
 * 2. The loser drops down only ONE position (preventing brutal relegation).
 * 3. All intermediate players shift down by exactly ONE position.
 */
export function applyLadderVictory(winner, loser) {
  if (!winner || !loser) return;
  if (typeof winner.rank !== 'number' || typeof loser.rank !== 'number') return;

  if (winner.rank > loser.rank) {
    const targetRank = loser.rank;
    const oldWinnerRank = winner.rank;

    // Shift the defeated player and everyone in between down by 1 spot
    chessState.players.forEach((p) => {
      if (p.id !== winner.id && p.rank >= targetRank && p.rank < oldWinnerRank) {
        p.rank += 1;
      }
    });

    // Award the conquered rank to the winner
    winner.rank = targetRank;
  }
}

window.swapQuickDeskPlayers = function () {
  const p1Select = document.getElementById('quickdesk-p1');
  const p2Select = document.getElementById('quickdesk-p2');
  if (p1Select && p2Select) {
    const temp = p1Select.value;
    p1Select.value = p2Select.value;
    p2Select.value = temp;
    chessState.quickDeskP1Id = p1Select.value;
    chessState.quickDeskP2Id = p2Select.value;
  }
};

window.recordDirectTeacherMatch = function (outcome) {
  // STRICT TEACHER SECURITY GUARDRAIL
  if (
    chessState.userRole !== 'teacher' ||
    localStorage.getItem('history_chess_teacher_auth') !== 'true'
  ) {
    showChessToast('🔒 Access Denied: Only authenticated teachers can award points.', 'error');
    return;
  }

  const p1Select = document.getElementById('quickdesk-p1');
  const p2Select = document.getElementById('quickdesk-p2');
  const p1Id = p1Select?.value;
  const p2Id = p2Select?.value;

  if (!p1Id || !p2Id) {
    showChessToast(
      '⚠️ Please select both Player 1 and Player 2 before tapping an outcome.',
      'warning',
    );
    return;
  }

  if (p1Id === p2Id) {
    showChessToast('⚠️ Player 1 and Player 2 cannot be the same pupil.', 'warning');
    return;
  }

  const p1 = chessState.players.find((x) => x.id === p1Id);
  const p2 = chessState.players.find((x) => x.id === p2Id);
  if (!p1 || !p2) {
    showChessToast('Selected pupil not found in active roster.', 'error');
    return;
  }

  pushChessUndoSnapshot(`Quick Desk: ${p1.name} vs ${p2.name}`);

  p1.games = (p1.games || 0) + 1;
  p2.games = (p2.games || 0) + 1;

  let resultStr = '1-0';
  let toastMsg = '';

  if (outcome === 'p1') {
    resultStr = '1-0';
    p1.won = (p1.won || 0) + 1;
    p2.lost = (p2.lost || 0) + 1;
    p1.rating = (p1.rating || 1000) + 15;
    p2.rating = Math.max(800, (p2.rating || 1000) - 15);
    const h1 = HOUSES[p1.house]?.name || p1.house;
    const h2 = HOUSES[p2.house]?.name || p2.house;
    toastMsg = `🏆 ${p1.name} (${h1}) won vs ${p2.name} (${h2})! +3 House Pts`;
  } else if (outcome === 'p2') {
    resultStr = '0-1';
    p2.won = (p2.won || 0) + 1;
    p1.lost = (p1.lost || 0) + 1;
    p2.rating = (p2.rating || 1000) + 15;
    p1.rating = Math.max(800, (p1.rating || 1000) - 15);
    const h1 = HOUSES[p1.house]?.name || p1.house;
    const h2 = HOUSES[p2.house]?.name || p2.house;
    toastMsg = `🏆 ${p2.name} (${h2}) won vs ${p1.name} (${h1})! +3 House Pts`;
  } else {
    resultStr = '½-½';
    p1.drawn = (p1.drawn || 0) + 1;
    p2.drawn = (p2.drawn || 0) + 1;
    const h1 = HOUSES[p1.house]?.name || p1.house;
    const h2 = HOUSES[p2.house]?.name || p2.house;
    toastMsg = `🤝 Draw: ${p1.name} (${h1}) ½–½ ${p2.name} (${h2})! +2 House Pts each`;
  }

  // Automatically calibrate & sort all pupils by total points (largest to smallest)
  autoSortPlayersByPoints();

  const matchId = 'm_' + Date.now();
  chessState.matches.unshift({
    id: matchId,
    date: 'Thursday Period 6',
    timestamp: Date.now(),
    round: 'Period 6 Match',
    white: p1.name,
    black: p2.name,
    whiteId: p1.id,
    blackId: p2.id,
    whiteHouse: p1.house,
    blackHouse: p2.house,
    result: resultStr,
    opening: 'Period 6 Match',
  });

  // Keep the winner as Player 1 so teacher is ready for next challenger
  chessState.quickDeskP1Id = outcome === 'p1' ? p1.id : outcome === 'p2' ? p2.id : '';
  chessState.quickDeskP2Id = '';

  saveChessState();
  renderChessHubView();
  showChessToast(toastMsg, 'success');
};

window.handleQuickDeskRegister = function (e) {
  if (e && e.preventDefault) e.preventDefault();

  // STRICT TEACHER SECURITY GUARDRAIL
  if (
    chessState.userRole !== 'teacher' ||
    localStorage.getItem('history_chess_teacher_auth') !== 'true'
  ) {
    showChessToast('🔒 Access Denied: Only authenticated teachers can register pupils.', 'error');
    return false;
  }

  const nameInput = document.getElementById('quickdesk-reg-name');
  const houseSelect = document.getElementById('quickdesk-reg-house');
  if (!nameInput) return false;

  const rawName = nameInput.value.trim();
  const cleanName = sanitizePupilName(rawName);
  const house = houseSelect?.value || 'warrior';

  if (!cleanName) {
    showChessToast("Please enter the pupil's name.", 'warning');
    return false;
  }

  // Check if already registered
  const existing = chessState.players.find(
    (p) =>
      (p.realName && p.realName.toLowerCase() === cleanName.toLowerCase()) ||
      p.name.toLowerCase() === cleanName.toLowerCase() ||
      (p.nickname && p.nickname.toLowerCase() === cleanName.toLowerCase()),
  );

  if (existing) {
    if (!chessState.checkedInPlayerIds.includes(existing.id)) {
      chessState.checkedInPlayerIds.push(existing.id);
    }
    chessState.quickDeskP1Id = existing.id;
    saveChessState();
    renderChessHubView();
    showChessToast(`Welcome back, ${existing.name}! Selected as Player 1.`, 'success');
    return false;
  }

  const newId = 'p_' + Date.now();
  const newRank = chessState.players.length + 1;
  const newPlayer = {
    id: newId,
    name: cleanName,
    nickname: cleanName,
    realName: cleanName,
    house: house,
    rating: 1000,
    games: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    rank: newRank,
  };

  chessState.players.push(newPlayer);
  chessState.checkedInPlayerIds.push(newId);
  savePlayerRealName(newId, cleanName);

  // Automatically select this new pupil as Player 1 for immediate play
  chessState.quickDeskP1Id = newId;

  saveChessState();
  renderChessHubView();
  showChessToast(
    `🎉 Registered ${cleanName} (${HOUSES[house]?.name || house}) and selected as Player 1!`,
    'success',
  );
  return false;
};

window.undoQuickDeskMatch = function (matchId) {
  // STRICT TEACHER SECURITY GUARDRAIL
  if (
    chessState.userRole !== 'teacher' ||
    localStorage.getItem('history_chess_teacher_auth') !== 'true'
  ) {
    showChessToast('🔒 Access Denied: Only authenticated teachers can undo matches.', 'error');
    return;
  }

  const match = chessState.matches.find((m) => m.id === matchId);
  if (!match) return;

  const p1 = chessState.players.find((p) => p.id === match.whiteId || p.name === match.white);
  const p2 = chessState.players.find((p) => p.id === match.blackId || p.name === match.black);

  if (p1) {
    p1.games = Math.max(0, (p1.games || 1) - 1);
    if (match.result === '1-0') {
      p1.won = Math.max(0, (p1.won || 1) - 1);
      p1.rating = Math.max(800, (p1.rating || 1000) - 15);
    } else if (match.result === '0-1') {
      p1.lost = Math.max(0, (p1.lost || 1) - 1);
      p1.rating = (p1.rating || 1000) + 15;
    } else if (match.result === '½-½' || match.result === '1/2-1/2') {
      p1.drawn = Math.max(0, (p1.drawn || 1) - 1);
    }
  }

  if (p2) {
    p2.games = Math.max(0, (p2.games || 1) - 1);
    if (match.result === '0-1') {
      p2.won = Math.max(0, (p2.won || 1) - 1);
      p2.rating = Math.max(800, (p2.rating || 1000) - 15);
    } else if (match.result === '1-0') {
      p2.lost = Math.max(0, (p2.lost || 1) - 1);
      p2.rating = (p2.rating || 1000) + 15;
    } else if (match.result === '½-½' || match.result === '1/2-1/2') {
      p2.drawn = Math.max(0, (p2.drawn || 1) - 1);
    }
  }

  chessState.matches = chessState.matches.filter((m) => m.id !== matchId);

  // Auto-sort pupils by points (largest to smallest) after undo
  autoSortPlayersByPoints();

  saveChessState();
  renderChessHubView();
  showChessToast('↺ Match undone and points safely rolled back.', 'info');
};

// 1-Click Direct Board Scoring Engine
window.recordQuickMatchResult = function (boardNum, resultWinner) {
  // STRICT TEACHER SECURITY GUARDRAIL
  if (
    chessState.userRole !== 'teacher' ||
    localStorage.getItem('history_chess_teacher_auth') !== 'true'
  ) {
    showChessToast('🔒 Access Denied: Only authenticated teachers can record matches.', 'error');
    return;
  }
  if (!chessState.activePairings) return;
  const p = chessState.activePairings.find((x) => x.board === boardNum);
  if (!p || !p.white || !p.black) return;

  const isCoachMatch = p.black.id === 'p_coach';
  const pWhite = chessState.players.find((x) => x.id === p.white.id);
  const pBlack = isCoachMatch ? p.black : chessState.players.find((x) => x.id === p.black.id);
  if (!pWhite || !pBlack) return;

  pushChessUndoSnapshot(`Board ${boardNum}: ${pWhite.name} vs ${pBlack.name}`);

  pWhite.games = (pWhite.games || 0) + 1;
  if (!isCoachMatch) pBlack.games = (pBlack.games || 0) + 1;

  let resultStr = '1-0';
  let winnerName = pWhite.name;
  let winnerHouse = pWhite.house;

  if (resultWinner === 'white') {
    resultStr = '1-0';
    pWhite.won = (pWhite.won || 0) + 1;
    pWhite.rating = (pWhite.rating || 1000) + 15;
    if (!isCoachMatch) {
      pBlack.lost = (pBlack.lost || 0) + 1;
      pBlack.rating = Math.max(800, (pBlack.rating || 1000) - 15);
    }
    const hName = HOUSES[pWhite.house]?.name || pWhite.house;
    showChessToast(`🏆 Board ${boardNum}: ${pWhite.name} (${hName}) won! +3 House Pts`, 'success');
  } else if (resultWinner === 'black') {
    resultStr = '0-1';
    winnerName = pBlack.name;
    winnerHouse = pBlack.house;
    pWhite.lost = (pWhite.lost || 0) + 1;
    pWhite.rating = Math.max(800, (pWhite.rating || 1000) - 10);
    if (!isCoachMatch) {
      pBlack.won = (pBlack.won || 0) + 1;
      pBlack.rating = (pBlack.rating || 1000) + 15;
    }
    const hName = isCoachMatch ? 'Coach' : HOUSES[pBlack.house]?.name || pBlack.house;
    showChessToast(`🏆 Board ${boardNum}: ${pBlack.name} (${hName}) won!`, 'success');
  } else {
    resultStr = '½-½';
    winnerName = 'Draw';
    winnerHouse = null;
    pWhite.drawn = (pWhite.drawn || 0) + 1;
    if (!isCoachMatch) pBlack.drawn = (pBlack.drawn || 0) + 1;
    const wH = HOUSES[pWhite.house]?.name || pWhite.house;
    showChessToast(`🤝 Board ${boardNum}: Draw! +2 House Pts for ${wH}`, 'info');
  }

  // Automate pupil ranking strictly by points (largest to smallest)
  autoSortPlayersByPoints();

  const matchId = 'm_' + Date.now();
  chessState.matches.push({
    id: matchId,
    date: 'Thursday Period 6',
    round: `Period 6 Board ${boardNum}`,
    white: pWhite.name,
    black: pBlack.name,
    whiteHouse: pWhite.house,
    blackHouse: pBlack.house || 'coach',
    result: resultStr,
    opening: isCoachMatch ? 'Coach Practice Match' : 'Period 6 Match',
  });

  p.completed = true;
  p.result = resultStr;
  p.winnerName = winnerName;
  p.winnerHouse = winnerHouse;
  p.matchId = matchId;

  saveChessState();
  renderChessHubView();
};

// Undo Board Result (Emergency Teacher Safety Net)
window.undoBoardResult = function (boardNum) {
  if (
    chessState.userRole !== 'teacher' ||
    localStorage.getItem('history_chess_teacher_auth') !== 'true'
  ) {
    showChessToast('🔒 Access Denied: Only authenticated teachers can undo results.', 'error');
    return;
  }
  if (!chessState.activePairings) return;
  const p = chessState.activePairings.find((x) => x.board === boardNum);
  if (!p || !p.completed) return;

  const isCoachMatch = p.black?.id === 'p_coach';
  const pWhite = chessState.players.find((x) => x.id === p.white.id);
  const pBlack = isCoachMatch ? p.black : chessState.players.find((x) => x.id === p.black.id);

  if (pWhite) {
    pWhite.games = Math.max(0, (pWhite.games || 1) - 1);
    if (!isCoachMatch && pBlack) pBlack.games = Math.max(0, (pBlack.games || 1) - 1);

    if (p.result === '1-0') {
      pWhite.won = Math.max(0, (pWhite.won || 1) - 1);
      pWhite.rating = Math.max(800, (pWhite.rating || 1000) - 15);
      if (!isCoachMatch && pBlack) {
        pBlack.lost = Math.max(0, (pBlack.lost || 1) - 1);
        pBlack.rating = (pBlack.rating || 1000) + 15;
      }
    } else if (p.result === '0-1') {
      pWhite.lost = Math.max(0, (pWhite.lost || 1) - 1);
      pWhite.rating = (pWhite.rating || 1000) + 10;
      if (!isCoachMatch && pBlack) {
        pBlack.won = Math.max(0, (pBlack.won || 1) - 1);
        pBlack.rating = Math.max(800, (pBlack.rating || 1000) - 15);
      }
    } else if (p.result === '½-½') {
      pWhite.drawn = Math.max(0, (pWhite.drawn || 1) - 1);
      if (!isCoachMatch && pBlack) {
        pBlack.drawn = Math.max(0, (pBlack.drawn || 1) - 1);
      }
    }
  }

  if (p.matchId) {
    chessState.matches = chessState.matches.filter((m) => m.id !== p.matchId);
  }

  p.completed = false;
  p.result = null;
  p.winnerName = null;
  p.winnerHouse = null;
  p.matchId = null;

  saveChessState();
  renderChessHubView();
  showChessToast(`Board ${boardNum} result cleared. Ready to re-score!`, 'info');
};

// Toggle League Table View Mode ('matrix' vs 'table')
window.setLeagueTableViewMode = function (mode) {
  chessState.leagueTableViewMode = mode;
  saveChessState();
  renderChessHubView();
};

// Helper: Synchronize match stat deltas directly onto canonical chessState.players AND mirror onto bracket slot objects
function applyCanonicalPlayerMatchStats(slotPlayerA, slotPlayerB, outcome, eloWin = 15, eloLoss = 15) {
  const canonicalA =
    slotPlayerA && !slotPlayerA.isBye
      ? chessState.players.find((p) => p.id === slotPlayerA.id) || slotPlayerA
      : null;
  const canonicalB =
    slotPlayerB && !slotPlayerB.isBye
      ? chessState.players.find((p) => p.id === slotPlayerB.id) || slotPlayerB
      : null;

  if (canonicalA) {
    canonicalA.games = (canonicalA.games || 0) + 1;
    if (outcome === 'p1') {
      canonicalA.won = (canonicalA.won || 0) + 1;
      canonicalA.rating = (canonicalA.rating || 1000) + eloWin;
    } else if (outcome === 'p2') {
      canonicalA.lost = (canonicalA.lost || 0) + 1;
      canonicalA.rating = Math.max(800, (canonicalA.rating || 1000) - eloLoss);
    } else if (outcome === 'draw') {
      canonicalA.drawn = (canonicalA.drawn || 0) + 1;
    }
    if (slotPlayerA && slotPlayerA !== canonicalA) {
      slotPlayerA.games = canonicalA.games;
      slotPlayerA.won = canonicalA.won;
      slotPlayerA.lost = canonicalA.lost;
      slotPlayerA.drawn = canonicalA.drawn;
      slotPlayerA.rating = canonicalA.rating;
    }
  }

  if (canonicalB) {
    canonicalB.games = (canonicalB.games || 0) + 1;
    if (outcome === 'p2') {
      canonicalB.won = (canonicalB.won || 0) + 1;
      canonicalB.rating = (canonicalB.rating || 1000) + eloWin;
    } else if (outcome === 'p1') {
      canonicalB.lost = (canonicalB.lost || 0) + 1;
      canonicalB.rating = Math.max(800, (canonicalB.rating || 1000) - eloLoss);
    } else if (outcome === 'draw') {
      canonicalB.drawn = (canonicalB.drawn || 0) + 1;
    }
    if (slotPlayerB && slotPlayerB !== canonicalB) {
      slotPlayerB.games = canonicalB.games;
      slotPlayerB.won = canonicalB.won;
      slotPlayerB.lost = canonicalB.lost;
      slotPlayerB.drawn = canonicalB.drawn;
      slotPlayerB.rating = canonicalB.rating;
    }
  }

  autoSortPlayersByPoints();
}

function makeBracketByeSlot(slotKey, label = 'BYE') {
  return {
    id: `bye_slot_${slotKey}`,
    name: label,
    nickname: label,
    realName: label,
    isBye: true,
    house: 'none',
  };
}

// Self-Healing Bracket & Consolation Progression Engine
// Guarantees:
// 1. Round 1 real losers enter Challenger Plate.
// 2. Round 1 Bye recipients who lose their FIRST played match (Round 2) ALSO enter Challenger Plate!
// 3. Round 1 Bye slots whose recipient WINS Round 2 automatically resolve as Plate Byes so no Plate slot ever stalls!
// 4. 3rd Place Bronze Playoff & Wooden Spoon Shield work across BOTH 8-player and 16-player brackets!
export function reconcileKnockoutProgression(bracket) {
  if (!bracket || !Array.isArray(bracket.rounds) || bracket.rounds.length === 0) return bracket;

  const refreshPlayerMeta = (slotP) => {
    if (!slotP || slotP.isBye) return slotP;
    const canon = chessState.players.find((p) => p.id === slotP.id);
    if (canon) {
      slotP.name = canon.name;
      slotP.realName = canon.realName || canon.name;
      slotP.nickname = canon.nickname || canon.name;
      slotP.house = canon.house;
      slotP.rating = canon.rating;
    }
    return slotP;
  };

  // 1. Reconcile Round 1 Byes & propagate Championship Cup winners
  const r0 = bracket.rounds[0];
  r0.forEach((m, mIdx) => {
    m.p1 = refreshPlayerMeta(m.p1);
    m.p2 = refreshPlayerMeta(m.p2);
    if (m.p1?.isBye || m.p2?.isBye) {
      m.isBye = true;
      const realP = m.p1 && !m.p1.isBye ? m.p1 : m.p2 && !m.p2.isBye ? m.p2 : null;
      if (realP) {
        realP.hadR1Bye = true;
        m.winner = realP;
        m.loser = m.p1 === realP ? m.p2 : m.p1;
      } else {
        m.winner = makeBracketByeSlot(`cup_r0_${mIdx}`);
        m.loser = m.p2 || makeBracketByeSlot(`cup_r0_l_${mIdx}`);
      }
    }
  });

  for (let rIdx = 0; rIdx < bracket.rounds.length; rIdx++) {
    const rnd = bracket.rounds[rIdx];
    rnd.forEach((m, mIdx) => {
      m.p1 = refreshPlayerMeta(m.p1);
      m.p2 = refreshPlayerMeta(m.p2);

      // Validate existing winner still belongs to p1 or p2
      if (m.winner && !m.isBye) {
        const wId = m.winner.id;
        if ((!m.p1 || m.p1.id !== wId) && (!m.p2 || m.p2.id !== wId)) {
          m.winner = null;
          m.loser = null;
        } else {
          m.winner = m.p1 && m.p1.id === wId ? m.p1 : m.p2;
          m.loser = m.p1 && m.p1.id === wId ? m.p2 : m.p1;
        }
      }

      if (rIdx > 0 && m.p1 && m.p2 && (m.p1.isBye || m.p2.isBye)) {
        m.isBye = true;
        if (!m.p1.isBye) {
          m.winner = m.p1;
          m.loser = m.p2;
        } else if (!m.p2.isBye) {
          m.winner = m.p2;
          m.loser = m.p1;
        } else {
          m.winner = makeBracketByeSlot(`cup_r${rIdx}_${mIdx}`);
          m.loser = m.p2;
        }
      }

      if (rIdx + 1 < bracket.rounds.length) {
        const nextMatch = bracket.rounds[rIdx + 1][Math.floor(mIdx / 2)];
        if (nextMatch) {
          if (mIdx % 2 === 0) {
            nextMatch.p1 = m.winner || null;
          } else {
            nextMatch.p2 = m.winner || null;
          }
        }
      }
    });
  }

  // 2. Reconcile Challenger Plate (First-Loss Entry: R1 Real Losers + R1-Bye Recipients who lose R2!)
  if (Array.isArray(bracket.plateRounds) && bracket.plateRounds.length > 0) {
    const r2RoundLabel =
      (bracket.roundNames && bracket.roundNames[1]
        ? bracket.roundNames[1].replace(/s$/, '')
        : 'Round 2');

    const resolvePlateFeeder = (sideIdx) => {
      const r1Match = bracket.rounds[0][sideIdx];
      const r2Idx = Math.floor(sideIdx / 2);
      const r2Match = bracket.rounds[1] ? bracket.rounds[1][r2Idx] : null;
      if (!r1Match) {
        return { player: makeBracketByeSlot(`plate_empty_${sideIdx}`), pendingLabel: null };
      }

      // Case A: Real Round 1 Match -> Loser enters Challenger Plate
      if (!r1Match.isBye) {
        if (r1Match.winner && r1Match.loser && !r1Match.loser.isBye) {
          return { player: refreshPlayerMeta(r1Match.loser), pendingLabel: null };
        }
        return { player: null, pendingLabel: `Awaiting R1 Match ${sideIdx + 1} Loser` };
      }

      // Case B: Round 1 Bye -> Top-seed bye recipient enters Plate ONLY IF they lose their first match in Round 2!
      const byeRecipient = r1Match.winner && !r1Match.winner.isBye ? r1Match.winner : null;
      if (!byeRecipient || !r2Match || r2Match.isBye) {
        return { player: makeBracketByeSlot(`plate_r1bye_${sideIdx}`), pendingLabel: null };
      }

      if (r2Match.winner) {
        if (r2Match.loser && r2Match.loser.id === byeRecipient.id) {
          return { player: refreshPlayerMeta(byeRecipient), pendingLabel: null };
        }
        // Bye recipient WON Round 2 -> stays in Championship Cup, Plate slot resolves to automatic Plate Bye!
        return { player: makeBracketByeSlot(`plate_r2won_${sideIdx}`), pendingLabel: null };
      }

      const shortSeed = byeRecipient.seed ? `#${byeRecipient.seed} ` : '';
      return {
        player: null,
        pendingLabel: `If ${shortSeed}${getPlayerButtonShortName(byeRecipient)} loses ${r2RoundLabel} ${r2Idx + 1}`,
      };
    };

    for (let prIdx = 0; prIdx < bracket.plateRounds.length; prIdx++) {
      const pRound = bracket.plateRounds[prIdx];
      pRound.forEach((pm, pmIdx) => {
        if (prIdx === 0) {
          const left = resolvePlateFeeder(pmIdx * 2);
          const right = resolvePlateFeeder(pmIdx * 2 + 1);
          pm.p1 = left.player;
          pm.p1PendingLabel = left.pendingLabel;
          pm.p2 = right.player;
          pm.p2PendingLabel = right.pendingLabel;
        } else {
          pm.p1 = refreshPlayerMeta(pm.p1);
          pm.p2 = refreshPlayerMeta(pm.p2);
          pm.p1PendingLabel = pm.p1 ? null : 'Awaiting Plate Winner';
          pm.p2PendingLabel = pm.p2 ? null : 'Awaiting Plate Winner';
        }

        // Validate previously played Plate match result if players changed
        if (pm.winner && !pm.isBye) {
          const wId = pm.winner.id;
          if ((!pm.p1 || pm.p1.id !== wId) && (!pm.p2 || pm.p2.id !== wId)) {
            pm.winner = null;
            pm.loser = null;
          } else {
            pm.winner = pm.p1 && pm.p1.id === wId ? pm.p1 : pm.p2;
            pm.loser = pm.p1 && pm.p1.id === wId ? pm.p2 : pm.p1;
          }
        } else if (pm.isBye) {
          // Re-evaluate bye state cleanly whenever upstream changes
          pm.isBye = false;
          pm.winner = null;
          pm.loser = null;
        }

        if (pm.p1 && pm.p2) {
          if (pm.p1.isBye && pm.p2.isBye) {
            pm.isBye = true;
            pm.winner = makeBracketByeSlot(`plate_dbl_${prIdx}_${pmIdx}`);
            pm.loser = pm.p2;
          } else if (pm.p1.isBye && !pm.p2.isBye) {
            pm.isBye = true;
            pm.winner = pm.p2;
            pm.loser = pm.p1;
          } else if (!pm.p1.isBye && pm.p2.isBye) {
            pm.isBye = true;
            pm.winner = pm.p1;
            pm.loser = pm.p2;
          }
        }

        if (prIdx + 1 < bracket.plateRounds.length) {
          const nextPlateMatch = bracket.plateRounds[prIdx + 1][Math.floor(pmIdx / 2)];
          if (nextPlateMatch) {
            if (pmIdx % 2 === 0) {
              nextPlateMatch.p1 = pm.winner || null;
            } else {
              nextPlateMatch.p2 = pm.winner || null;
            }
          }
        }
      });
    }
  }

  // 3. Reconcile 3rd Place Bronze Playoff (works for BOTH 8-player and 16-player brackets!)
  if (bracket.tournamentSize >= 8 && bracket.rounds.length >= 2) {
    if (!bracket.cupBronzeMatch) {
      bracket.cupBronzeMatch = {
        id: 'cup_bronze_final',
        p1: null,
        p2: null,
        winner: null,
        loser: null,
        title: '3rd Place Bronze Playoff',
      };
    }
    const sfRoundIdx = bracket.rounds.length - 2;
    const sf0 = bracket.rounds[sfRoundIdx]?.[0];
    const sf1 = bracket.rounds[sfRoundIdx]?.[1];

    const resolveBronzeSlot = (sfMatch, idx) => {
      if (!sfMatch || !sfMatch.winner) {
        return { player: null, pending: `Awaiting SF ${idx + 1} Loser` };
      }
      if (!sfMatch.loser || sfMatch.loser.isBye) {
        return { player: makeBracketByeSlot(`bronze_bye_${idx}`), pending: null };
      }
      // In an 8-player bracket, Round 2 IS Semi-Finals: if a Round 1 Bye recipient lost SF, they dropped into Challenger Plate!
      if (bracket.tournamentSize === 8 && sfMatch.loser.hadR1Bye) {
        return { player: makeBracketByeSlot(`bronze_in_plate_${idx}`), pending: null };
      }
      return { player: refreshPlayerMeta(sfMatch.loser), pending: null };
    };

    const b1 = resolveBronzeSlot(sf0, 0);
    const b2 = resolveBronzeSlot(sf1, 1);
    const bm = bracket.cupBronzeMatch;
    bm.p1 = b1.player;
    bm.p1PendingLabel = b1.pending;
    bm.p2 = b2.player;
    bm.p2PendingLabel = b2.pending;

    if (bm.winner && !bm.isBye) {
      const wId = bm.winner.id;
      if ((!bm.p1 || bm.p1.id !== wId) && (!bm.p2 || bm.p2.id !== wId)) {
        bm.winner = null;
        bm.loser = null;
      }
    } else if (bm.isBye) {
      bm.isBye = false;
      bm.winner = null;
      bm.loser = null;
    }

    if (bm.p1 && bm.p2) {
      if (bm.p1.isBye && bm.p2.isBye) {
        bm.isBye = true;
        bm.winner = null;
      } else if (bm.p1.isBye && !bm.p2.isBye) {
        bm.isBye = true;
        bm.winner = bm.p2;
        bm.loser = bm.p1;
      } else if (!bm.p1.isBye && bm.p2.isBye) {
        bm.isBye = true;
        bm.winner = bm.p1;
        bm.loser = bm.p2;
      }
    }
  }

  // 4. Reconcile Wooden Spoon Shield (works for BOTH 8-player and 16-player brackets!)
  if (bracket.tournamentSize >= 8 && Array.isArray(bracket.plateRounds) && bracket.plateRounds.length > 0) {
    if (!bracket.woodenSpoonMatch) {
      bracket.woodenSpoonMatch = {
        id: 'wooden_spoon_final',
        p1: null,
        p2: null,
        winner: null,
        loser: null,
        title: 'Wooden Spoon Shield Final',
      };
    }

    if (bracket.tournamentSize === 8) {
      bracket.woodenSpoonSemiFinals = null;
      const psf0 = bracket.plateRounds[0]?.[0];
      const psf1 = bracket.plateRounds[0]?.[1];
      const resolveSpoon8 = (psf, idx) => {
        if (!psf || !psf.winner) return { player: null, pending: `Awaiting Plate SF ${idx + 1} Loser` };
        if (psf.isBye || !psf.loser || psf.loser.isBye) {
          return { player: makeBracketByeSlot(`spoon8_${idx}`), pending: null };
        }
        return { player: refreshPlayerMeta(psf.loser), pending: null };
      };
      const s1 = resolveSpoon8(psf0, 0);
      const s2 = resolveSpoon8(psf1, 1);
      const sm = bracket.woodenSpoonMatch;
      sm.p1 = s1.player;
      sm.p1PendingLabel = s1.pending;
      sm.p2 = s2.player;
      sm.p2PendingLabel = s2.pending;

      if (sm.winner && !sm.isBye) {
        const wId = sm.winner.id;
        if ((!sm.p1 || sm.p1.id !== wId) && (!sm.p2 || sm.p2.id !== wId)) {
          sm.winner = null;
          sm.loser = null;
        }
      } else if (sm.isBye) {
        sm.isBye = false;
        sm.winner = null;
        sm.loser = null;
      }

      if (sm.p1 && sm.p2) {
        if (sm.p1.isBye && sm.p2.isBye) {
          sm.isBye = true;
          sm.winner = null;
        } else if (sm.p1.isBye && !sm.p2.isBye) {
          sm.isBye = true;
          sm.winner = sm.p2;
          sm.loser = sm.p1;
        } else if (!sm.p1.isBye && sm.p2.isBye) {
          sm.isBye = true;
          sm.winner = sm.p1;
          sm.loser = sm.p2;
        }
      }
    } else if (bracket.tournamentSize === 16) {
      // In 16-player brackets: check Plate Quarter-Finals (plateRounds[0], 4 matches) vs Plate Semi-Finals (plateRounds[1], 2 matches)
      const pqfs = bracket.plateRounds[0] || [];
      const psfs = bracket.plateRounds[1] || [];
      const allPqfsResolved = pqfs.length === 4 && pqfs.every((m) => Boolean(m.winner));
      const realPqfLosers = pqfs
        .filter((m) => m.winner && !m.isBye && m.loser && !m.loser.isBye)
        .map((m) => refreshPlayerMeta(m.loser));

      // If all 4 Plate QFs resolved as Byes (e.g. 9 players where Seed 1 won QF 1 -> 0 Plate QF losers),
      // feed Wooden Spoon Final directly from the 2 Plate Semi-Final losers!
      if (allPqfsResolved && realPqfLosers.length === 0) {
        bracket.woodenSpoonSemiFinals = null;
        const resolveFromPsf = (psf, idx) => {
          if (!psf || !psf.winner) return { player: null, pending: `Awaiting Plate SF ${idx + 1} Loser` };
          if (psf.isBye || !psf.loser || psf.loser.isBye) {
            return { player: makeBracketByeSlot(`spoon16_psf_${idx}`), pending: null };
          }
          return { player: refreshPlayerMeta(psf.loser), pending: null };
        };
        const s1 = resolveFromPsf(psfs[0], 0);
        const s2 = resolveFromPsf(psfs[1], 1);
        const sm = bracket.woodenSpoonMatch;
        sm.p1 = s1.player;
        sm.p1PendingLabel = s1.pending;
        sm.p2 = s2.player;
        sm.p2PendingLabel = s2.pending;
      } else if (allPqfsResolved && realPqfLosers.length === 1) {
        // Exactly 1 real loser in Plate QFs + 2 Plate SF losers -> 3-player Wooden Spoon (Spoon Play-In Semi + Final!)
        if (!Array.isArray(bracket.woodenSpoonSemiFinals) || bracket.woodenSpoonSemiFinals.length !== 2) {
          bracket.woodenSpoonSemiFinals = [
            { id: 'spoon_sf_0', p1: null, p2: null, winner: null, loser: null },
            { id: 'spoon_sf_1', p1: null, p2: null, winner: null, loser: null },
          ];
        }
        const ssf0 = bracket.woodenSpoonSemiFinals[0];
        ssf0.p1 = realPqfLosers[0];
        ssf0.p2 = makeBracketByeSlot('spoon_lone_bye');
        ssf0.isBye = true;
        ssf0.winner = realPqfLosers[0];

        const ssf1 = bracket.woodenSpoonSemiFinals[1];
        ssf1.p1 = psfs[0]?.winner
          ? psfs[0].loser && !psfs[0].loser.isBye
            ? refreshPlayerMeta(psfs[0].loser)
            : makeBracketByeSlot('spoon_psf0')
          : null;
        ssf1.p1PendingLabel = ssf1.p1 ? null : 'Awaiting Plate SF 1 Loser';
        ssf1.p2 = psfs[1]?.winner
          ? psfs[1].loser && !psfs[1].loser.isBye
            ? refreshPlayerMeta(psfs[1].loser)
            : makeBracketByeSlot('spoon_psf1')
          : null;
        ssf1.p2PendingLabel = ssf1.p2 ? null : 'Awaiting Plate SF 2 Loser';

        if (ssf1.winner && !ssf1.isBye) {
          const wId = ssf1.winner.id;
          if ((!ssf1.p1 || ssf1.p1.id !== wId) && (!ssf1.p2 || ssf1.p2.id !== wId)) {
            ssf1.winner = null;
            ssf1.loser = null;
          }
        } else if (ssf1.isBye) {
          ssf1.isBye = false;
          ssf1.winner = null;
        }
        if (ssf1.p1 && ssf1.p2 && (ssf1.p1.isBye || ssf1.p2.isBye)) {
          ssf1.isBye = true;
          ssf1.winner = !ssf1.p1.isBye ? ssf1.p1 : !ssf1.p2.isBye ? ssf1.p2 : makeBracketByeSlot('spoon_ssf1_dbl');
        }

        bracket.woodenSpoonMatch.p1 = ssf0.winner;
        bracket.woodenSpoonMatch.p1PendingLabel = null;
        bracket.woodenSpoonMatch.p2 = ssf1.winner || null;
        bracket.woodenSpoonMatch.p2PendingLabel = ssf1.winner ? null : 'Awaiting Spoon Semi Winner';
      } else {
        // Standard 16-player Wooden Spoon: 4 Plate QF feeders -> 2 Spoon Semi-Finals -> 1 Wooden Spoon Final
        if (!Array.isArray(bracket.woodenSpoonSemiFinals) || bracket.woodenSpoonSemiFinals.length !== 2) {
          bracket.woodenSpoonSemiFinals = [
            { id: 'spoon_sf_0', p1: null, p2: null, winner: null, loser: null },
            { id: 'spoon_sf_1', p1: null, p2: null, winner: null, loser: null },
          ];
        }
        const resolvePqfLoser = (pqf, idx) => {
          if (!pqf || !pqf.winner) return { player: null, pending: `Awaiting Plate QF ${idx + 1} Loser` };
          if (pqf.isBye || !pqf.loser || pqf.loser.isBye) {
            return { player: makeBracketByeSlot(`spoon_pqf_${idx}`), pending: null };
          }
          return { player: refreshPlayerMeta(pqf.loser), pending: null };
        };

        bracket.woodenSpoonSemiFinals.forEach((ssf, sIdx) => {
          const left = resolvePqfLoser(pqfs[sIdx * 2], sIdx * 2);
          const right = resolvePqfLoser(pqfs[sIdx * 2 + 1], sIdx * 2 + 1);
          ssf.p1 = left.player;
          ssf.p1PendingLabel = left.pending;
          ssf.p2 = right.player;
          ssf.p2PendingLabel = right.pending;

          if (ssf.winner && !ssf.isBye) {
            const wId = ssf.winner.id;
            if ((!ssf.p1 || ssf.p1.id !== wId) && (!ssf.p2 || ssf.p2.id !== wId)) {
              ssf.winner = null;
              ssf.loser = null;
            }
          } else if (ssf.isBye) {
            ssf.isBye = false;
            ssf.winner = null;
            ssf.loser = null;
          }

          if (ssf.p1 && ssf.p2) {
            if (ssf.p1.isBye && ssf.p2.isBye) {
              ssf.isBye = true;
              ssf.winner = makeBracketByeSlot(`spoon_ssf_dbl_${sIdx}`);
            } else if (ssf.p1.isBye && !ssf.p2.isBye) {
              ssf.isBye = true;
              ssf.winner = ssf.p2;
              ssf.loser = ssf.p1;
            } else if (!ssf.p1.isBye && ssf.p2.isBye) {
              ssf.isBye = true;
              ssf.winner = ssf.p1;
              ssf.loser = ssf.p2;
            }
          }
        });

        bracket.woodenSpoonMatch.p1 = bracket.woodenSpoonSemiFinals[0].winner || null;
        bracket.woodenSpoonMatch.p1PendingLabel = bracket.woodenSpoonMatch.p1 ? null : 'Awaiting Spoon Semi 1';
        bracket.woodenSpoonMatch.p2 = bracket.woodenSpoonSemiFinals[1].winner || null;
        bracket.woodenSpoonMatch.p2PendingLabel = bracket.woodenSpoonMatch.p2 ? null : 'Awaiting Spoon Semi 2';
      }

      // Finalize Wooden Spoon Final bye/winner check for 16-player
      const sm = bracket.woodenSpoonMatch;
      if (sm.winner && !sm.isBye) {
        const wId = sm.winner.id;
        if ((!sm.p1 || sm.p1.id !== wId) && (!sm.p2 || sm.p2.id !== wId)) {
          sm.winner = null;
          sm.loser = null;
        }
      } else if (sm.isBye) {
        sm.isBye = false;
        sm.winner = null;
        sm.loser = null;
      }
      if (sm.p1 && sm.p2) {
        if (sm.p1.isBye && sm.p2.isBye) {
          sm.isBye = true;
          sm.winner = null;
        } else if (sm.p1.isBye && !sm.p2.isBye) {
          sm.isBye = true;
          sm.winner = sm.p2;
          sm.loser = sm.p1;
        } else if (!sm.p1.isBye && sm.p2.isBye) {
          sm.isBye = true;
          sm.winner = sm.p1;
          sm.loser = sm.p2;
        }
      }
    }
  }

  return bracket;
}
window.reconcileKnockoutProgression = reconcileKnockoutProgression;

// Knockout Cup Generator & Progression (Audio 3)
window.generateKnockoutTournament = function (forceSize = null) {
  // 1. Gather all pupils who are checked in / present today
  let presentPupils = chessState.players.filter((p) =>
    chessState.checkedInPlayerIds.includes(p.id),
  );

  // If no pupils are checked in yet, automatically check in all registered pupils
  if (presentPupils.length === 0) {
    chessState.checkedInPlayerIds = chessState.players.map((p) => p.id);
    presentPupils = [...chessState.players];
    saveChessState();
    showChessToast(
      `✓ Auto-checked in all ${presentPupils.length} pupils as attendance baseline!`,
      'info',
    );
  }

  if (presentPupils.length < 2) {
    showChessToast(
      '⚠️ Need at least 2 present pupils to generate a Tournament Bracket.',
      'warning',
    );
    return;
  }

  pushChessUndoSnapshot(
    chessState.knockoutBracket ? 'Re-Seed Tournament Bracket' : 'Create Tournament Bracket',
  );

  // 2. Strict Rank & Rating Seeding: Seed 1 = #1 ranked, Seed 2 = #2, etc.
  presentPupils.sort(
    (a, b) => (a.rank || 999) - (b.rank || 999) || (b.rating || 0) - (a.rating || 0),
  );

  const N = presentPupils.length;

  // 3. Determine optimal bracket size (4, 8, or 16)
  let tournamentSize = 8;
  if (forceSize) {
    tournamentSize = forceSize;
  } else if (N <= 4) {
    tournamentSize = 4;
  } else if (N <= 8) {
    tournamentSize = 8;
  } else {
    tournamentSize = 16;
  }

  // Tag seeds on players
  const participants = [];
  for (let i = 0; i < tournamentSize; i++) {
    if (i < N) {
      participants.push({
        ...presentPupils[i],
        seed: i + 1,
        hadR1Bye: false,
      });
    } else {
      participants.push({
        id: `bye_${i + 1}`,
        name: 'BYE',
        nickname: 'BYE',
        realName: 'BYE',
        seed: i + 1,
        isBye: true,
        house: 'none',
      });
    }
  }

  // 4. Standard Tournament Seeding Bracket Pairings
  let seedPairs = [];
  if (tournamentSize === 4) {
    seedPairs = [
      [1, 4],
      [2, 3],
    ];
  } else if (tournamentSize === 8) {
    seedPairs = [
      [1, 8],
      [4, 5],
      [2, 7],
      [3, 6],
    ];
  } else if (tournamentSize === 16) {
    seedPairs = [
      [1, 16],
      [8, 9],
      [4, 13],
      [5, 12],
      [2, 15],
      [7, 10],
      [3, 14],
      [6, 11],
    ];
  }

  const getBySeed = (s) => participants.find((p) => p.seed === s);

  // Build Round 1 Matches
  const round1Matches = seedPairs.map((pair, idx) => {
    const p1 = getBySeed(pair[0]);
    const p2 = getBySeed(pair[1]);
    const match = {
      id: `ko_r1_${idx}`,
      p1,
      p2,
      winner: null,
      loser: null,
      isBye: Boolean(p1?.isBye || p2?.isBye),
    };

    if (match.isBye) {
      if (p1 && !p1.isBye) {
        p1.hadR1Bye = true;
        match.winner = p1;
        match.loser = p2;
      } else if (p2 && !p2.isBye) {
        p2.hadR1Bye = true;
        match.winner = p2;
        match.loser = p1;
      }
    }
    return match;
  });

  // Build Binary Progression Tree
  let roundNames = [];
  let rounds = [round1Matches];

  if (tournamentSize === 4) {
    roundNames = ['Semi-Finals', 'Championship Final'];
    rounds.push([{ id: 'ko_final', p1: null, p2: null, winner: null, loser: null }]);
  } else if (tournamentSize === 8) {
    roundNames = ['Quarter-Finals', 'Semi-Finals', 'Championship Final'];
    rounds.push([
      { id: 'ko_sf_0', p1: null, p2: null, winner: null, loser: null },
      { id: 'ko_sf_1', p1: null, p2: null, winner: null, loser: null },
    ]);
    rounds.push([{ id: 'ko_final', p1: null, p2: null, winner: null, loser: null }]);
  } else if (tournamentSize === 16) {
    roundNames = ['Round of 16', 'Quarter-Finals', 'Semi-Finals', 'Championship Final'];
    rounds.push([
      { id: 'ko_qf_0', p1: null, p2: null, winner: null, loser: null },
      { id: 'ko_qf_1', p1: null, p2: null, winner: null, loser: null },
      { id: 'ko_qf_2', p1: null, p2: null, winner: null, loser: null },
      { id: 'ko_qf_3', p1: null, p2: null, winner: null, loser: null },
    ]);
    rounds.push([
      { id: 'ko_sf_0', p1: null, p2: null, winner: null, loser: null },
      { id: 'ko_sf_1', p1: null, p2: null, winner: null, loser: null },
    ]);
    rounds.push([{ id: 'ko_final', p1: null, p2: null, winner: null, loser: null }]);
  }

  // Setup Challenger Plate, Wooden Spoon & Bronze Match
  let plateRounds = [];
  let plateRoundNames = [];
  let woodenSpoonMatch = null;
  let woodenSpoonSemiFinals = null;
  let cupBronzeMatch = null;

  if (tournamentSize === 8) {
    plateRoundNames = ['Plate Semi-Finals', 'Challenger Plate Final'];
    plateRounds = [
      [
        { id: 'plate_sf_0', p1: null, p2: null, winner: null, loser: null },
        { id: 'plate_sf_1', p1: null, p2: null, winner: null, loser: null },
      ],
      [{ id: 'plate_final', p1: null, p2: null, winner: null, loser: null }],
    ];
    woodenSpoonMatch = {
      id: 'wooden_spoon_final',
      p1: null,
      p2: null,
      winner: null,
      loser: null,
      title: 'Wooden Spoon Shield Final',
    };
    cupBronzeMatch = {
      id: 'cup_bronze_final',
      p1: null,
      p2: null,
      winner: null,
      loser: null,
      title: '3rd Place Bronze Playoff',
    };
  } else if (tournamentSize === 16) {
    plateRoundNames = ['Plate Quarter-Finals', 'Plate Semi-Finals', 'Challenger Plate Final'];
    plateRounds = [
      [
        { id: 'plate_qf_0', p1: null, p2: null, winner: null, loser: null },
        { id: 'plate_qf_1', p1: null, p2: null, winner: null, loser: null },
        { id: 'plate_qf_2', p1: null, p2: null, winner: null, loser: null },
        { id: 'plate_qf_3', p1: null, p2: null, winner: null, loser: null },
      ],
      [
        { id: 'plate_sf_0', p1: null, p2: null, winner: null, loser: null },
        { id: 'plate_sf_1', p1: null, p2: null, winner: null, loser: null },
      ],
      [{ id: 'plate_final', p1: null, p2: null, winner: null, loser: null }],
    ];
    woodenSpoonSemiFinals = [
      { id: 'spoon_sf_0', p1: null, p2: null, winner: null, loser: null },
      { id: 'spoon_sf_1', p1: null, p2: null, winner: null, loser: null },
    ];
    woodenSpoonMatch = {
      id: 'wooden_spoon_final',
      p1: null,
      p2: null,
      winner: null,
      loser: null,
      title: 'Wooden Spoon Shield Final',
    };
    cupBronzeMatch = {
      id: 'cup_bronze_final',
      p1: null,
      p2: null,
      winner: null,
      loser: null,
      title: '3rd Place Bronze Playoff',
    };
  } else if (tournamentSize === 4) {
    plateRoundNames = ['Challenger Plate Final'];
    plateRounds = [[{ id: 'plate_final', p1: null, p2: null, winner: null, loser: null }]];
  }

  chessState.knockoutBracket = reconcileKnockoutProgression({
    tournamentSize,
    roundNames,
    rounds,
    cupBronzeMatch,
    plateRoundNames,
    plateRounds,
    woodenSpoonSemiFinals,
    woodenSpoonMatch,
    casualMatches: [],
    seededAt: Date.now(),
    participantCount: N,
  });

  saveChessState();
  chessState.activeTab = 'knockout';
  renderChessHubView();

  const byeCount = tournamentSize - N;
  showChessToast(
    `⚡ Seeded ${N} pupils into a ${tournamentSize}-bracket! ${byeCount > 0 ? `(${byeCount} R1 Byes — first-loss Plate protection active!)` : ''}`,
    'success',
  );
};

window.advanceKnockoutWinner = function (roundIdx, matchIdx, winnerId) {
  const bracket = chessState.knockoutBracket;
  if (!bracket) return;

  const match = bracket.rounds[roundIdx]?.[matchIdx];
  if (!match || !match.p1 || !match.p2) return;
  if (match.isBye || match.winner) return;

  const winner = match.p1.id === winnerId ? match.p1 : match.p2;
  const loser = match.p1.id === winnerId ? match.p2 : match.p1;
  const roundLabel = bracket.roundNames?.[roundIdx] || 'Championship Match';

  pushChessUndoSnapshot(`${winner.name} won ${roundLabel}`);

  match.winner = winner;
  match.loser = loser;

  // Record official match in history
  chessState.matches.push({
    id: 'ko_m_' + Date.now(),
    date: 'Thursday Period 6 Championship',
    round: roundLabel,
    white: match.p1.name,
    black: match.p2.name,
    whiteId: match.p1.id,
    blackId: match.p2.id,
    whiteHouse: match.p1.house,
    blackHouse: match.p2.house,
    result: winner.id === match.p1.id ? '1-0' : '0-1',
    opening: 'Championship Cup Match',
  });

  // Update canonical player stats
  applyCanonicalPlayerMatchStats(
    match.p1,
    match.p2,
    winner.id === match.p1.id ? 'p1' : 'p2',
    15,
    15,
  );

  // Reconcile Cup, First-Loss Challenger Plate (including R1 Bye recipients losing in R2!), Bronze & Spoon!
  reconcileKnockoutProgression(bracket);

  const droppedToPlate =
    (roundIdx === 0 && loser && !loser.isBye) ||
    (roundIdx === 1 && loser && !loser.isBye && loser.hadR1Bye);

  saveChessState();
  renderChessHubView();
  if (droppedToPlate && roundIdx === 1) {
    showChessToast(
      `🏆 ${winner.name} advances! ${loser.name} (had R1 Bye) enters the Challenger Plate!`,
      'success',
    );
  }
  if (chessState.autoRePairEnabled && chessState.sessionActive) {
    setTimeout(() => {
      window.checkAndAutoPairFreePupils();
    }, 120);
  }
};

window.advancePlateWinner = function (roundIdx, matchIdx, winnerId) {
  const bracket = chessState.knockoutBracket;
  if (!bracket || !bracket.plateRounds) return;

  const match = bracket.plateRounds[roundIdx]?.[matchIdx];
  if (!match || !match.p1 || !match.p2 || match.isBye || match.winner) return;

  const winner = match.p1.id === winnerId ? match.p1 : match.p2;
  const loser = match.p1.id === winnerId ? match.p2 : match.p1;
  const roundName = bracket.plateRoundNames?.[roundIdx] || `Plate Round ${roundIdx + 1}`;

  pushChessUndoSnapshot(`${winner.name} won ${roundName}`);

  match.winner = winner;
  match.loser = loser;

  // Record official match in history
  chessState.matches.push({
    id: 'plate_m_' + Date.now(),
    date: 'Thursday Period 6 Challenger Plate',
    round: roundName,
    white: match.p1.name,
    black: match.p2.name,
    whiteId: match.p1.id,
    blackId: match.p2.id,
    whiteHouse: match.p1.house,
    blackHouse: match.p2.house,
    result: winner.id === match.p1.id ? '1-0' : '0-1',
    opening: 'Challenger Plate Match',
  });

  applyCanonicalPlayerMatchStats(
    match.p1,
    match.p2,
    winner.id === match.p1.id ? 'p1' : 'p2',
    10,
    10,
  );

  reconcileKnockoutProgression(bracket);

  saveChessState();
  renderChessHubView();
  if (chessState.autoRePairEnabled && chessState.sessionActive) {
    setTimeout(() => {
      window.checkAndAutoPairFreePupils();
    }, 120);
  }
};

window.advanceWoodenSpoonSemiWinner = function (semiIdx, winnerId) {
  const bracket = chessState.knockoutBracket;
  if (!bracket || !Array.isArray(bracket.woodenSpoonSemiFinals)) return;

  const match = bracket.woodenSpoonSemiFinals[semiIdx];
  if (!match || !match.p1 || !match.p2 || match.isBye || match.winner) return;

  const winner = match.p1.id === winnerId ? match.p1 : match.p2;
  const loser = match.p1.id === winnerId ? match.p2 : match.p1;

  pushChessUndoSnapshot(`${winner.name} won Spoon Semi ${semiIdx + 1}`);

  match.winner = winner;
  match.loser = loser;

  chessState.matches.push({
    id: 'spoon_sf_m_' + Date.now(),
    date: 'Thursday Period 6 Wooden Spoon',
    round: `Wooden Spoon Semi-Final ${semiIdx + 1}`,
    white: match.p1.name,
    black: match.p2.name,
    whiteId: match.p1.id,
    blackId: match.p2.id,
    whiteHouse: match.p1.house,
    blackHouse: match.p2.house,
    result: winner.id === match.p1.id ? '1-0' : '0-1',
    opening: 'Wooden Spoon Consolation',
  });

  applyCanonicalPlayerMatchStats(
    match.p1,
    match.p2,
    winner.id === match.p1.id ? 'p1' : 'p2',
    8,
    5,
  );

  reconcileKnockoutProgression(bracket);
  saveChessState();
  renderChessHubView();
  showChessToast(`🥄 ${winner.name} advances to the Wooden Spoon Shield Final!`, 'success');
};

window.advanceWoodenSpoonWinner = function (winnerId) {
  const bracket = chessState.knockoutBracket;
  if (!bracket || !bracket.woodenSpoonMatch) return;

  const match = bracket.woodenSpoonMatch;
  if (!match.p1 || !match.p2 || match.isBye || match.winner) return;

  const winner = match.p1.id === winnerId ? match.p1 : match.p2;
  const loser = match.p1.id === winnerId ? match.p2 : match.p1;

  pushChessUndoSnapshot(`${winner.name} won Wooden Spoon Shield`);

  match.winner = winner;
  match.loser = loser;

  chessState.matches.push({
    id: 'spoon_m_' + Date.now(),
    date: 'Thursday Period 6 Wooden Spoon',
    round: 'Wooden Spoon Shield Final',
    white: match.p1.name,
    black: match.p2.name,
    whiteId: match.p1.id,
    blackId: match.p2.id,
    whiteHouse: match.p1.house,
    blackHouse: match.p2.house,
    result: winner.id === match.p1.id ? '1-0' : '0-1',
    opening: 'Wooden Spoon Consolation',
  });

  applyCanonicalPlayerMatchStats(
    match.p1,
    match.p2,
    winner.id === match.p1.id ? 'p1' : 'p2',
    8,
    5,
  );

  reconcileKnockoutProgression(bracket);
  saveChessState();
  renderChessHubView();
  showChessToast(
    `🥄 Wooden Spoon Shield won by ${winner.name} (+3 House Points)! Fantastic fighting spirit!`,
    'success',
  );
  if (chessState.autoRePairEnabled && chessState.sessionActive) {
    setTimeout(() => {
      window.checkAndAutoPairFreePupils();
    }, 120);
  }
};

window.advanceCupBronzeWinner = function (winnerId) {
  const bracket = chessState.knockoutBracket;
  if (!bracket || !bracket.cupBronzeMatch) return;

  const match = bracket.cupBronzeMatch;
  if (!match.p1 || !match.p2 || match.isBye || match.winner) return;

  const winner = match.p1.id === winnerId ? match.p1 : match.p2;
  const loser = match.p1.id === winnerId ? match.p2 : match.p1;

  pushChessUndoSnapshot(`${winner.name} won 3rd Place Playoff`);

  match.winner = winner;
  match.loser = loser;

  chessState.matches.push({
    id: 'bronze_m_' + Date.now(),
    date: 'Thursday Period 6 Bronze Playoff',
    round: '3rd Place Bronze Playoff',
    white: match.p1.name,
    black: match.p2.name,
    whiteId: match.p1.id,
    blackId: match.p2.id,
    whiteHouse: match.p1.house,
    blackHouse: match.p2.house,
    result: winner.id === match.p1.id ? '1-0' : '0-1',
    opening: '3rd Place Bronze Match',
  });

  applyCanonicalPlayerMatchStats(
    match.p1,
    match.p2,
    winner.id === match.p1.id ? 'p1' : 'p2',
    12,
    8,
  );

  reconcileKnockoutProgression(bracket);
  saveChessState();
  renderChessHubView();
  showChessToast(`🥉 3rd Place Bronze Medal won by ${winner.name} (+3 House Points)!`, 'success');
  if (chessState.autoRePairEnabled && chessState.sessionActive) {
    setTimeout(() => {
      window.checkAndAutoPairFreePupils();
    }, 120);
  }
};

window.repairFreePupilsCasual = function () {
  const bracket = chessState.knockoutBracket;
  if (!bracket) return;

  reconcileKnockoutProgression(bracket);

  const busyIds = new Set();
  const markBusyIfLive = (m) => {
    if (m && m.p1 && m.p2 && !m.p1.isBye && !m.p2.isBye && !m.isBye && !m.winner && !m.isDraw) {
      busyIds.add(m.p1.id);
      busyIds.add(m.p2.id);
    }
  };

  bracket.rounds.forEach((rnd) => rnd.forEach(markBusyIfLive));
  if (bracket.plateRounds) {
    bracket.plateRounds.forEach((rnd) => rnd.forEach(markBusyIfLive));
  }
  if (bracket.woodenSpoonSemiFinals) {
    bracket.woodenSpoonSemiFinals.forEach(markBusyIfLive);
  }
  if (bracket.casualMatches) {
    bracket.casualMatches.forEach(markBusyIfLive);
  }
  markBusyIfLive(bracket.woodenSpoonMatch);
  markBusyIfLive(bracket.cupBronzeMatch);

  const pool = chessState.players.filter(
    (p) => chessState.checkedInPlayerIds.includes(p.id) && !busyIds.has(p.id),
  );

  if (pool.length < 2) {
    showChessToast(
      'Fewer than 2 free pupils available right now (others are in active tournament matches).',
      'warning',
    );
    return;
  }

  pushChessUndoSnapshot(`Rapid Re-Pair (${Math.floor(pool.length / 2) * 2} pupils)`);

  // Smart rapid pairing: balance by rating & avoid recent repeat opponents or same house when possible
  const sortedPool = [...pool].sort((a, b) => (b.rating || 1000) - (a.rating || 1000));
  if (!bracket.casualMatches) bracket.casualMatches = [];

  let count = 0;
  while (sortedPool.length >= 2) {
    const p1 = sortedPool.shift();
    let partnerIdx = sortedPool.findIndex(
      (cand) =>
        cand.house !== p1.house &&
        !bracket.casualMatches.some(
          (cm) =>
            (cm.p1?.id === p1.id && cm.p2?.id === cand.id) ||
            (cm.p1?.id === cand.id && cm.p2?.id === p1.id),
        ),
    );
    if (partnerIdx === -1) {
      partnerIdx = sortedPool.findIndex((cand) => cand.house !== p1.house);
    }
    if (partnerIdx === -1) partnerIdx = 0;
    const p2 = sortedPool.splice(partnerIdx, 1)[0];

    bracket.casualMatches.push({
      id: 'casual_' + Date.now() + '_' + count,
      p1: { ...p1 },
      p2: { ...p2 },
      time: '10-Min Rapid',
      winner: null,
      isDraw: false,
    });
    count++;
  }

  saveChessState();
  renderChessHubView();
  showChessToast(
    `⚡ Paired ${count * 2} free pupils for rapid games! Nobody sits idle.`,
    'success',
  );
};

window.advanceCasualMatch = function (casualId, winnerIdOrDraw) {
  const bracket = chessState.knockoutBracket;
  if (!bracket || !bracket.casualMatches) return;
  const match = bracket.casualMatches.find((m) => m.id === casualId);
  if (!match || match.winner || match.isDraw) return;

  if (winnerIdOrDraw === 'draw') {
    pushChessUndoSnapshot(`Rapid Draw: ${match.p1.name} vs ${match.p2.name}`);
    match.isDraw = true;

    chessState.matches.push({
      id: 'cas_m_' + Date.now(),
      date: 'Thursday Period 6 Casual Rapid',
      round: 'Casual Rapid Match',
      white: match.p1.name,
      black: match.p2.name,
      whiteId: match.p1.id,
      blackId: match.p2.id,
      whiteHouse: match.p1.house,
      blackHouse: match.p2.house,
      result: '½-½',
      opening: 'Period 6 Rapid Draw',
    });

    applyCanonicalPlayerMatchStats(match.p1, match.p2, 'draw', 0, 0);
    saveChessState();
    renderChessHubView();
    showChessToast(
      `🤝 Draw logged: ${match.p1.name} ½–½ ${match.p2.name} (+2 House points each)!`,
      'info',
    );
    if (chessState.autoRePairEnabled && chessState.sessionActive) {
      setTimeout(() => {
        window.checkAndAutoPairFreePupils();
      }, 120);
    }
    return;
  }

  const winner = match.p1.id === winnerIdOrDraw ? match.p1 : match.p2;
  pushChessUndoSnapshot(`Rapid Win: ${winner.name}`);
  match.winner = winner;

  chessState.matches.push({
    id: 'cas_m_' + Date.now(),
    date: 'Thursday Period 6 Casual Rapid',
    round: 'Casual Rapid Match',
    white: match.p1.name,
    black: match.p2.name,
    whiteId: match.p1.id,
    blackId: match.p2.id,
    whiteHouse: match.p1.house,
    blackHouse: match.p2.house,
    result: winner.id === match.p1.id ? '1-0' : '0-1',
    opening: 'Period 6 Rapid Game',
  });

  applyCanonicalPlayerMatchStats(
    match.p1,
    match.p2,
    winner.id === match.p1.id ? 'p1' : 'p2',
    8,
    8,
  );

  saveChessState();
  renderChessHubView();
  showChessToast(`🏆 Logged rapid match! ${winner.name} won (+3 House points).`, 'success');
  if (chessState.autoRePairEnabled && chessState.sessionActive) {
    setTimeout(() => {
      window.checkAndAutoPairFreePupils();
    }, 120);
  }
};

window.resetKnockoutTournament = function () {
  if (chessState.knockoutBracket) {
    pushChessUndoSnapshot('Clear Tournament Bracket');
  }
  chessState.knockoutBracket = null;
  saveChessState();
  renderChessHubView();
};

// Continuous Play Matchmaker & Whiteboard Projection Engine
export function getActiveMatches() {
  const active = [];
  let boardIdx = 1;

  function getCleanMatchPlayer(p) {
    if (!p) return p;
    const cleanName =
      DEFAULT_LOCAL_NAME_MAP[p.id] || CALLSIGN_TO_FIRST_NAME[p.name] || p.realName || p.name;
    return {
      ...p,
      name: cleanName,
      realName: cleanName,
      nickname: cleanName,
    };
  }

  // 1. Period 6 Classroom Match Grid active pairings
  if (Array.isArray(chessState.activePairings) && chessState.activePairings.length > 0) {
    chessState.activePairings.forEach((p) => {
      if (p.white && p.black && !p.completed && !p.isBye) {
        active.push({
          type: 'quick_pairing',
          rIdx: 0,
          mIdx: 0,
          id: `qp_${p.board}`,
          boardNum: p.board || boardIdx++,
          p1: getCleanMatchPlayer(p.white),
          p2: getCleanMatchPlayer(p.black),
          title: `Match Grid · Board ${p.board}`,
          badge: p.isCoachMatch ? 'Coach Match' : 'Period 6 Match',
        });
      }
    });
  }

  // 2. Knockout Tournament / Casual Matches
  const bracket = chessState.knockoutBracket;
  if (bracket) {
    if (Array.isArray(bracket.rounds)) {
      bracket.rounds.forEach((round, rIdx) => {
        round.forEach((m, mIdx) => {
          if (m.p1 && m.p2 && !m.p1.isBye && !m.p2.isBye && !m.isBye && !m.winner && !m.isDraw) {
            active.push({
              type: 'knockout',
              rIdx,
              mIdx,
              id: m.id || `ko_${rIdx}_${mIdx}`,
              boardNum: boardIdx++,
              p1: getCleanMatchPlayer(m.p1),
              p2: getCleanMatchPlayer(m.p2),
              title: bracket.roundNames?.[rIdx] || `Championship Round ${rIdx + 1}`,
              badge: 'Championship Cup',
            });
          }
        });
      });
    }
    if (Array.isArray(bracket.plateRounds)) {
      bracket.plateRounds.forEach((round, rIdx) => {
        round.forEach((m, mIdx) => {
          if (m.p1 && m.p2 && !m.p1.isBye && !m.p2.isBye && !m.isBye && !m.winner && !m.isDraw) {
            active.push({
              type: 'plate',
              rIdx,
              mIdx,
              id: m.id || `plate_${rIdx}_${mIdx}`,
              boardNum: boardIdx++,
              p1: getCleanMatchPlayer(m.p1),
              p2: getCleanMatchPlayer(m.p2),
              title: bracket.plateRoundNames?.[rIdx] || `Plate Round ${rIdx + 1}`,
              badge: 'Challenger Plate',
            });
          }
        });
      });
    }
    if (Array.isArray(bracket.woodenSpoonSemiFinals)) {
      bracket.woodenSpoonSemiFinals.forEach((m, mIdx) => {
        if (m.p1 && m.p2 && !m.p1.isBye && !m.p2.isBye && !m.isBye && !m.winner && !m.isDraw) {
          active.push({
            type: 'spoon_semi',
            rIdx: 0,
            mIdx,
            id: m.id || `spoon_sf_${mIdx}`,
            boardNum: boardIdx++,
            p1: getCleanMatchPlayer(m.p1),
            p2: getCleanMatchPlayer(m.p2),
            title: `Wooden Spoon Semi ${mIdx + 1}`,
            badge: 'Wooden Spoon Shield',
          });
        }
      });
    }
    if (Array.isArray(bracket.casualMatches)) {
      bracket.casualMatches.forEach((m, mIdx) => {
        if (m.p1 && m.p2 && !m.winner && !m.isDraw) {
          active.push({
            type: 'casual',
            rIdx: 0,
            mIdx,
            id: m.id,
            boardNum: m.boardNumber || boardIdx++,
            p1: getCleanMatchPlayer(m.p1),
            p2: getCleanMatchPlayer(m.p2),
            title: m.time || '10-Min Rapid Game',
            badge: 'Rapid Re-Pair',
          });
        }
      });
    }
    if (
      bracket.cupBronzeMatch &&
      bracket.cupBronzeMatch.p1 &&
      bracket.cupBronzeMatch.p2 &&
      !bracket.cupBronzeMatch.p1.isBye &&
      !bracket.cupBronzeMatch.p2.isBye &&
      !bracket.cupBronzeMatch.isBye &&
      !bracket.cupBronzeMatch.winner &&
      !bracket.cupBronzeMatch.isDraw
    ) {
      active.push({
        type: 'cup_bronze',
        rIdx: 0,
        mIdx: 0,
        id: bracket.cupBronzeMatch.id || 'cup_bronze_final',
        boardNum: boardIdx++,
        p1: getCleanMatchPlayer(bracket.cupBronzeMatch.p1),
        p2: getCleanMatchPlayer(bracket.cupBronzeMatch.p2),
        title: '3rd Place Bronze Playoff',
        badge: 'Bronze Medal Match',
      });
    }
    if (
      bracket.woodenSpoonMatch &&
      bracket.woodenSpoonMatch.p1 &&
      bracket.woodenSpoonMatch.p2 &&
      !bracket.woodenSpoonMatch.p1.isBye &&
      !bracket.woodenSpoonMatch.p2.isBye &&
      !bracket.woodenSpoonMatch.isBye &&
      !bracket.woodenSpoonMatch.winner &&
      !bracket.woodenSpoonMatch.isDraw
    ) {
      active.push({
        type: 'wooden_spoon',
        rIdx: 0,
        mIdx: 0,
        id: bracket.woodenSpoonMatch.id || 'wooden_spoon_final',
        boardNum: boardIdx++,
        p1: getCleanMatchPlayer(bracket.woodenSpoonMatch.p1),
        p2: getCleanMatchPlayer(bracket.woodenSpoonMatch.p2),
        title: 'Wooden Spoon Shield Final',
        badge: 'Wooden Spoon Shield',
      });
    }
  }
  return active;
}

export function getIdlePupils() {
  const activeMatches = getActiveMatches();
  const busyIds = new Set();
  activeMatches.forEach((m) => {
    if (m.p1) busyIds.add(m.p1.id);
    if (m.p2) busyIds.add(m.p2.id);
  });
  const checkedInSet = new Set(chessState.checkedInPlayerIds || []);
  return chessState.players.filter((p) => checkedInSet.has(p.id) && !busyIds.has(p.id));
}

window.checkAndAutoPairFreePupils = function () {
  if (!chessState.autoRePairEnabled || !chessState.sessionActive) return;

  if (!chessState.knockoutBracket) {
    chessState.knockoutBracket = {
      tournamentSize: 0,
      rounds: [],
      plateRounds: [],
      casualMatches: [],
      roundNames: [],
    };
  }
  const bracket = chessState.knockoutBracket;
  if (!bracket.casualMatches) bracket.casualMatches = [];

  const activeMatches = getActiveMatches();
  const busyIds = new Set();
  activeMatches.forEach((m) => {
    if (m.p1) busyIds.add(m.p1.id);
    if (m.p2) busyIds.add(m.p2.id);
  });

  const checkedInSet = new Set(chessState.checkedInPlayerIds || []);
  const freePupils = chessState.players.filter((p) => checkedInSet.has(p.id) && !busyIds.has(p.id));

  if (freePupils.length < 2) return;

  // Smart pairing: balance by rating and try to pair different houses
  const pool = [...freePupils].sort((a, b) => (b.rating || 1000) - (a.rating || 1000));
  const newlyPaired = [];
  let nextBoard = activeMatches.length + 1;

  while (pool.length >= 2) {
    const p1 = pool.shift();
    let p2Idx = pool.findIndex((cand) => cand.house !== p1.house);
    if (p2Idx === -1) p2Idx = 0;
    const p2 = pool.splice(p2Idx, 1)[0];

    const matchObj = {
      id: 'auto_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      p1,
      p2,
      time: '10-Min Rapid',
      boardNumber: nextBoard++,
      winner: null,
      isDraw: false,
      startedAt: Date.now(),
    };
    bracket.casualMatches.push(matchObj);
    newlyPaired.push(`${p1.name} vs ${p2.name} (Board ${matchObj.boardNumber})`);
  }

  if (newlyPaired.length > 0) {
    saveChessState();
    renderChessHubView();
    showChessToast(
      `⚡ Auto-Paired: ${newlyPaired.join(' · ')}! Continuous play in progress.`,
      'success',
    );
  }
};

window.recordBoardResult = function (type, rIdx, mIdx, resultWinnerId, matchId) {
  if (type === 'quick_pairing') {
    const boardNum = parseInt(String(matchId || '').replace('qp_', ''), 10) || rIdx || 1;
    if (resultWinnerId === 'draw') {
      window.recordQuickMatchResult(boardNum, 'draw');
    } else {
      const p = (chessState.activePairings || []).find((x) => x.board === boardNum);
      if (p && p.white && p.white.id === resultWinnerId) {
        window.recordQuickMatchResult(boardNum, 'white');
      } else {
        window.recordQuickMatchResult(boardNum, 'black');
      }
    }
    return;
  }

  const bracket = chessState.knockoutBracket;
  if (!bracket) return;

  if (type === 'knockout') {
    if (resultWinnerId === 'draw') {
      const match = bracket.rounds?.[rIdx]?.[mIdx];
      if (match && match.p1 && match.p2) {
        match.isDraw = true;
        match.p1.drawn = (match.p1.drawn || 0) + 1;
        match.p2.drawn = (match.p2.drawn || 0) + 1;
        match.p1.games++;
        match.p2.games++;
        chessState.matches.push({
          id: 'ko_m_' + Date.now(),
          date: 'Thursday Period 6 Championship',
          round: bracket.roundNames?.[rIdx] || 'Championship Match',
          white: match.p1.name,
          black: match.p2.name,
          whiteHouse: match.p1.house,
          blackHouse: match.p2.house,
          result: '½-½',
          opening: 'Championship Draw',
        });
        saveChessState();
        renderChessHubView();
        showChessToast(
          `Board result logged: Draw between ${match.p1.name} and ${match.p2.name} (+2 House pts each)!`,
          'info',
        );
      }
    } else {
      window.advanceKnockoutWinner(rIdx, mIdx, resultWinnerId);
    }
  } else if (type === 'plate') {
    if (resultWinnerId === 'draw') {
      const match = bracket.plateRounds?.[rIdx]?.[mIdx];
      if (match && match.p1 && match.p2) {
        match.isDraw = true;
        match.p1.drawn = (match.p1.drawn || 0) + 1;
        match.p2.drawn = (match.p2.drawn || 0) + 1;
        match.p1.games++;
        match.p2.games++;
        chessState.matches.push({
          id: 'plate_m_' + Date.now(),
          date: 'Thursday Period 6 Challenger Plate',
          round: bracket.plateRoundNames?.[rIdx] || `Plate Round ${rIdx + 1}`,
          white: match.p1.name,
          black: match.p2.name,
          whiteHouse: match.p1.house,
          blackHouse: match.p2.house,
          result: '½-½',
          opening: 'Challenger Plate Draw',
        });
        saveChessState();
        renderChessHubView();
        showChessToast(
          `Plate result logged: Draw between ${match.p1.name} and ${match.p2.name} (+2 House pts each)!`,
          'info',
        );
      }
    } else {
      window.advancePlateWinner(rIdx, mIdx, resultWinnerId);
    }
  } else if (type === 'casual') {
    window.advanceCasualMatch(matchId, resultWinnerId === 'draw' ? 'draw' : resultWinnerId);
  } else if (type === 'spoon_semi') {
    if (resultWinnerId === 'draw') {
      const match = bracket.woodenSpoonSemiFinals?.[mIdx];
      if (match && match.p1 && match.p2) {
        pushChessUndoSnapshot(`Spoon Semi Draw: ${match.p1.name} vs ${match.p2.name}`);
        match.isDraw = true;
        applyCanonicalPlayerMatchStats(match.p1, match.p2, 'draw', 0, 0);
        chessState.matches.push({
          id: 'spoon_sf_m_' + Date.now(),
          date: 'Thursday Period 6 Wooden Spoon',
          round: `Wooden Spoon Semi-Final ${mIdx + 1}`,
          white: match.p1.name,
          black: match.p2.name,
          whiteHouse: match.p1.house,
          blackHouse: match.p2.house,
          result: '½-½',
          opening: 'Wooden Spoon Draw',
        });
        saveChessState();
        renderChessHubView();
      }
    } else {
      window.advanceWoodenSpoonSemiWinner(mIdx, resultWinnerId);
    }
  } else if (type === 'wooden_spoon') {
    const match = bracket.woodenSpoonMatch;
    if (!match || match.winner || match.isDraw) return;
    if (resultWinnerId === 'draw') {
      match.isDraw = true;
      match.p1.drawn = (match.p1.drawn || 0) + 1;
      match.p2.drawn = (match.p2.drawn || 0) + 1;
      match.p1.games++;
      match.p2.games++;
      chessState.matches.push({
        id: 'spoon_m_' + Date.now(),
        date: 'Thursday Period 6 Wooden Spoon',
        round: 'Wooden Spoon Shield Final',
        white: match.p1.name,
        black: match.p2.name,
        whiteHouse: match.p1.house,
        blackHouse: match.p2.house,
        result: '½-½',
        opening: 'Wooden Spoon Draw',
      });
      saveChessState();
      renderChessHubView();
      showChessToast(
        `Wooden Spoon Draw between ${match.p1.name} and ${match.p2.name} (+1 House pt each)!`,
        'info',
      );
    } else {
      window.advanceWoodenSpoonWinner(resultWinnerId);
    }
  } else if (type === 'cup_bronze') {
    const match = bracket.cupBronzeMatch;
    if (!match || match.winner || match.isDraw) return;
    if (resultWinnerId === 'draw') {
      match.isDraw = true;
      match.p1.drawn = (match.p1.drawn || 0) + 1;
      match.p2.drawn = (match.p2.drawn || 0) + 1;
      match.p1.games++;
      match.p2.games++;
      chessState.matches.push({
        id: 'bronze_m_' + Date.now(),
        date: 'Thursday Period 6 Bronze Playoff',
        round: '3rd Place Bronze Playoff',
        white: match.p1.name,
        black: match.p2.name,
        whiteHouse: match.p1.house,
        blackHouse: match.p2.house,
        result: '½-½',
        opening: 'Bronze Playoff Draw',
      });
      saveChessState();
      renderChessHubView();
      showChessToast(
        `Bronze Playoff Draw between ${match.p1.name} and ${match.p2.name} (+2 House pts each)!`,
        'info',
      );
    } else {
      window.advanceCupBronzeWinner(resultWinnerId);
    }
  }

  // Automatic Re-Pair trigger
  if (chessState.autoRePairEnabled && chessState.sessionActive) {
    setTimeout(() => {
      window.checkAndAutoPairFreePupils();
    }, 120);
  }
};

window.concludePeriod6Session = function () {
  chessState.sessionActive = false;
  chessState.sessionTimerRunning = false;

  const bracket = chessState.knockoutBracket;
  let drawCount = 0;

  if (bracket) {
    const processMatch = (m, roundTitle) => {
      if (m && m.p1 && m.p2 && !m.winner && !m.isDraw) {
        m.isDraw = true;
        m.p1.drawn = (m.p1.drawn || 0) + 1;
        m.p2.drawn = (m.p2.drawn || 0) + 1;
        m.p1.games++;
        m.p2.games++;
        chessState.matches.push({
          id: 'adj_m_' + Date.now() + '_' + drawCount,
          date: 'Thursday Period 6 Final Adjudication',
          round: roundTitle,
          white: m.p1.name,
          black: m.p2.name,
          whiteHouse: m.p1.house,
          blackHouse: m.p2.house,
          result: '½-½',
          opening: 'Adjudicated Time Draw',
        });
        drawCount++;
      }
    };

    if (Array.isArray(bracket.rounds)) {
      bracket.rounds.forEach((rnd, rIdx) => {
        rnd.forEach((m) => processMatch(m, bracket.roundNames?.[rIdx] || 'Championship Match'));
      });
    }
    if (Array.isArray(bracket.plateRounds)) {
      bracket.plateRounds.forEach((rnd, rIdx) => {
        rnd.forEach((m) => processMatch(m, bracket.plateRoundNames?.[rIdx] || 'Plate Match'));
      });
    }
    if (Array.isArray(bracket.casualMatches)) {
      bracket.casualMatches.forEach((m) => processMatch(m, 'Casual Rapid Match'));
    }
    if (bracket.woodenSpoonMatch) {
      processMatch(bracket.woodenSpoonMatch, 'Wooden Spoon Shield Final');
    }
    if (bracket.cupBronzeMatch) {
      processMatch(bracket.cupBronzeMatch, '3rd Place Bronze Playoff');
    }
  }

  saveChessState();
  if (isChessViewActive()) {
    renderChessHubView();
    showChessToast(
      `🏁 Period 6 Concluded! ${drawCount > 0 ? `${drawCount} active game(s) adjudicated as draws (+2 House points each).` : 'All games finished.'} Standings finalized!`,
      'success',
    );
  }
};

window.resumePeriod6Session = function () {
  chessState.sessionActive = true;
  chessState.sessionTimerRunning = true;
  if (chessState.sessionTimeRemaining <= 0) {
    chessState.sessionTimeRemaining = 3600;
  }
  saveChessState();
  renderChessHubView();
  showChessToast('Period 6 Session resumed! Clock running & continuous re-pairing active.', 'info');
};

window.toggleSessionTimer = function () {
  if (!chessState.sessionTimeRemaining || chessState.sessionTimeRemaining <= 0) {
    chessState.sessionTimeRemaining = chessState.roundTimerDuration || 600;
  }
  chessState.roundTimerExpiredAlert = false;
  chessState.sessionActive = true;
  chessState.sessionTimerRunning = !chessState.sessionTimerRunning;
  saveChessState();
  renderChessHubView();
  showChessToast(
    chessState.sessionTimerRunning ? '▶ Round timer started!' : '⏸ Round timer paused.',
    'info',
  );
};

window.resetSessionTimer = function () {
  const dur = chessState.roundTimerDuration || 600;
  chessState.sessionTimeRemaining = dur;
  chessState.roundTimerExpiredAlert = false;
  chessState.sessionTimerRunning = false;
  saveChessState();
  renderChessHubView();
  showChessToast(`⏱ Timer reset to ${Math.round(dur / 60)}:00.`, 'info');
};

window.setRoundTimer = function (mins) {
  const secs = Math.max(60, Math.round(mins * 60));
  chessState.roundTimerDuration = secs;
  chessState.sessionTimeRemaining = secs;
  chessState.roundTimerExpiredAlert = false;
  chessState.sessionTimerRunning = true;
  chessState.sessionActive = true;
  saveChessState();
  renderChessHubView();
  showChessToast(`⏱ Round countdown started: ${mins}:00!`, 'info');
};

window.adjustRoundTimer = function (deltaSecs) {
  const cur = typeof chessState.sessionTimeRemaining === 'number' ? chessState.sessionTimeRemaining : 600;
  chessState.sessionTimeRemaining = Math.max(0, cur + deltaSecs);
  if (chessState.sessionTimeRemaining > 0) {
    chessState.roundTimerExpiredAlert = false;
  }
  saveChessState();
  renderChessHubView();
};

window.dismissRoundTimerAlert = function () {
  chessState.roundTimerExpiredAlert = false;
  renderChessHubView();
};

window.undoTournamentAction = function () {
  if (chessState.userRole !== 'teacher') {
    showChessToast('🔒 Teacher mode required to undo actions.', 'error');
    return;
  }
  if (!Array.isArray(chessState.undoStack) || chessState.undoStack.length === 0) {
    loadChessUndoStack();
  }
  if (!Array.isArray(chessState.undoStack) || chessState.undoStack.length === 0) {
    showChessToast('Nothing left to undo!', 'info');
    return;
  }

  const snap = chessState.undoStack.pop();
  persistChessUndoStack();

  chessState.players = snap.players || chessState.players;
  chessState.matches = snap.matches || [];
  chessState.checkedInPlayerIds = snap.checkedInPlayerIds || [];
  chessState.activePairings = snap.activePairings || [];
  chessState.knockoutBracket = snap.knockoutBracket || null;
  if (snap.clubModes) {
    const keepFs = Boolean(chessState.clubModes?.tvFullscreen);
    chessState.clubModes = { ...snap.clubModes, tvFullscreen: keepFs };
  }
  if (chessState.knockoutBracket) {
    reconcileKnockoutProgression(chessState.knockoutBracket);
  }
  autoSortPlayersByPoints();
  saveChessState();
  renderChessHubView();

  const remaining = chessState.undoStack.length;
  showChessToast(
    `↩️ Undid: ${snap.label}${remaining > 0 ? ` (${remaining} more undo step${remaining === 1 ? '' : 's'} ready)` : ''}`,
    'info',
  );
};

window.undoLastMatchResult = function () {
  if (Array.isArray(chessState.undoStack) && chessState.undoStack.length > 0) {
    window.undoTournamentAction();
    return;
  }
  if (!chessState.matches || chessState.matches.length === 0) {
    showChessToast('No matches to undo.', 'info');
    return;
  }
  const lastMatch = chessState.matches.pop();

  if (Array.isArray(chessState.activePairings)) {
    const boardNumMatch = String(lastMatch.round || '').match(/Board (\d+)/);
    if (boardNumMatch) {
      const bNum = parseInt(boardNumMatch[1], 10);
      const pairing = chessState.activePairings.find((p) => p.board === bNum);
      if (pairing) {
        pairing.completed = false;
        pairing.result = null;
        pairing.winnerName = null;
        pairing.winnerHouse = null;
      }
    }
  }

  const pW = chessState.players.find((p) => p.name === lastMatch.white);
  const pB = chessState.players.find((p) => p.name === lastMatch.black);
  if (pW) {
    pW.games = Math.max(0, (pW.games || 1) - 1);
    if (lastMatch.result === '1-0') {
      pW.won = Math.max(0, (pW.won || 1) - 1);
      pW.rating = (pW.rating || 1000) - 15;
    } else if (lastMatch.result === '½-½') {
      pW.drawn = Math.max(0, (pW.drawn || 1) - 1);
    } else if (lastMatch.result === '0-1') {
      pW.lost = Math.max(0, (pW.lost || 1) - 1);
      pW.rating = (pW.rating || 1000) + 15;
    }
  }
  if (pB) {
    pB.games = Math.max(0, (pB.games || 1) - 1);
    if (lastMatch.result === '0-1') {
      pB.won = Math.max(0, (pB.won || 1) - 1);
      pB.rating = (pB.rating || 1000) - 15;
    } else if (lastMatch.result === '½-½') {
      pB.drawn = Math.max(0, (pB.drawn || 1) - 1);
    } else if (lastMatch.result === '1-0') {
      pB.lost = Math.max(0, (pB.lost || 1) - 1);
      pB.rating = (pB.rating || 1000) + 15;
    }
  }

  autoSortPlayersByPoints();
  saveChessState();
  renderChessHubView();
  showChessToast(`↩️ Reopened Board: ${lastMatch.white} vs ${lastMatch.black}!`, 'success');
};

export function toggleChessWhiteboardMode(forceState) {
  if (typeof forceState === 'boolean') {
    chessState.whiteboardMode = forceState;
  } else {
    chessState.whiteboardMode = !chessState.whiteboardMode;
  }
  if (chessState.whiteboardMode) {
    chessState.sessionActive = true;
    if (!chessState.sessionTimeRemaining || chessState.sessionTimeRemaining <= 0) {
      chessState.sessionTimeRemaining = 900; // default 15 min round
    }
  }
  saveChessState();
  renderChessHubView();
  if (chessState.whiteboardMode) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showChessToast(
      '📺 Projector Mode: Large Board Matchups & Round Timer active! Press [Esc] or [W] to exit.',
      'info',
    );
  }
}
window.toggleChessWhiteboardMode = toggleChessWhiteboardMode;
window.toggleChessProjectorMode = toggleChessWhiteboardMode;

window.openAdjudicationModal = function () {
  chessState.showAdjudicationModal = true;
  if (!chessState.adjudicationCalc) {
    chessState.adjudicationCalc = { white: 0, black: 0 };
  }
  renderChessHubView();
};

window.closeAdjudicationModal = function () {
  chessState.showAdjudicationModal = false;
  renderChessHubView();
};

window.updateAdjudicationCalc = function (side, delta) {
  if (!chessState.adjudicationCalc) {
    chessState.adjudicationCalc = { white: 0, black: 0 };
  }
  chessState.adjudicationCalc[side] = Math.max(0, (chessState.adjudicationCalc[side] || 0) + delta);
  renderChessHubView();
};

window.resetAdjudicationCalc = function () {
  chessState.adjudicationCalc = { white: 0, black: 0 };
  renderChessHubView();
};

window.toggleWhiteboardFitMode = function () {
  chessState.whiteboardFitMode = !chessState.whiteboardFitMode;
  renderChessHubView();
  showChessToast(
    chessState.whiteboardFitMode !== false
      ? '⛶ Auto-Fit Mode: 100% Zero Scroll Active'
      : '↕ Scroll Grid Mode Active',
    'info',
  );
};

window.toggleAutoRePair = function () {
  chessState.autoRePairEnabled = !chessState.autoRePairEnabled;
  saveChessState();
  if (chessState.autoRePairEnabled) {
    window.checkAndAutoPairFreePupils();
    showChessToast(
      '⚡ Auto Re-Pairing ENABLED: Free pupils will be paired automatically.',
      'success',
    );
  } else {
    renderChessHubView();
    showChessToast('⏸ Auto Re-Pairing PAUSED: Manual pairing mode.', 'warning');
  }
};

// Refined High-Contrast Projector Display: Auto-scaling Zero-Scroll Grid for up to 10+ boards
export function renderWhiteboardModeView(sortedHouses) {
  const activeMatches = getActiveMatches();
  const idlePupils = getIdlePupils();
  const mins = Math.floor((chessState.sessionTimeRemaining || 0) / 60);
  const secs = (chessState.sessionTimeRemaining || 0) % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const isUrgentTime =
    (chessState.sessionTimeRemaining || 0) <= 120 && (chessState.sessionTimeRemaining || 0) > 0;

  const completedPairings = Array.isArray(chessState.activePairings)
    ? chessState.activePairings.filter((p) => p.completed && !p.isBye)
    : [];

  const isFitMode = chessState.whiteboardFitMode !== false;
  const count = activeMatches.length;

  let gridCols = '1fr';
  let gridRows = '1fr';
  let density = 'normal'; // 'normal' | 'medium' | 'compact' | 'ultra'

  if (count === 1) {
    gridCols = '1fr';
    gridRows = '1fr';
    density = 'normal';
  } else if (count === 2) {
    gridCols = 'repeat(2, 1fr)';
    gridRows = '1fr';
    density = 'normal';
  } else if (count <= 4) {
    gridCols = 'repeat(2, 1fr)';
    gridRows = 'repeat(2, 1fr)';
    density = 'medium';
  } else if (count <= 6) {
    gridCols = 'repeat(3, 1fr)';
    gridRows = 'repeat(2, 1fr)';
    density = 'compact';
  } else if (count <= 8) {
    gridCols = 'repeat(4, 1fr)';
    gridRows = 'repeat(2, 1fr)';
    density = 'ultra';
  } else if (count <= 10) {
    gridCols = 'repeat(5, 1fr)';
    gridRows = 'repeat(2, 1fr)';
    density = 'ultra';
  } else {
    gridCols = 'repeat(auto-fit, minmax(240px, 1fr))';
    gridRows = 'auto';
    density = 'ultra';
  }

  return `
    <div id="projector-whiteboard-root" style="background: #090d16; color: #f8fafc; ${
      isFitMode ? 'height: 100vh; max-height: 100vh; overflow: hidden;' : 'min-height: 100vh;'
    } padding: 10px 18px; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; box-sizing: border-box; display: flex; flex-direction: column;">
      
      <!-- Top Control Header Bar (Compact High Visibility Classroom Screen Aesthetic) -->
      <div style="flex-shrink: 0; background: linear-gradient(135deg, #111827 0%, #0f172a 100%); border: 2px solid #1e293b; border-radius: 14px; padding: 8px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        
        <!-- Left: Matchups Placard -->
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 40px; height: 40px; border-radius: 10px; background: #1e293b; border: 2px solid #334155; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #facc15; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
            ♔
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-flex; align-items: center; gap: 5px; background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid #22c55e; padding: 2px 6px; border-radius: 4px; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; font-family: monospace; letter-spacing: 0.05em;">
                <span style="width: 6px; height: 6px; border-radius: 50%; background: #22c55e; display: inline-block; box-shadow: 0 0 6px #22c55e;"></span>
                LIVE MATCHUPS
              </span>
              <span style="color: #64748b; font-size: 0.72rem; font-family: monospace;">PERIOD 6</span>
            </div>
            <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.25rem; color: #ffffff; font-weight: 800; letter-spacing: -0.01em;">
              The History Portal Chess Club
            </h1>
          </div>
        </div>

        <!-- Center: Live Round Countdown Timer with 5m Rapid Preset -->
        <div style="background: #030712; border: 2px solid ${isUrgentTime ? '#ef4444' : '#1e293b'}; border-radius: 12px; padding: 6px 16px; display: flex; align-items: center; gap: 14px; box-shadow: inset 0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.4); transition: border-color 0.3s;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="font-size: 0.62rem; color: #94a3b8; font-family: monospace; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1px;">
              Round Countdown
            </div>
            <div id="whiteboard-session-clock" style="font-family: 'JetBrains Mono', monospace, monospace; font-size: 2.3rem; font-weight: 900; letter-spacing: 2px; line-height: 1; color: ${isUrgentTime ? '#f87171' : '#4ade80'}; text-shadow: 0 0 16px ${isUrgentTime ? 'rgba(248, 113, 113, 0.6)' : 'rgba(74, 222, 128, 0.45)'};">
              ${formattedTime}
            </div>
          </div>

          <!-- Timer Controls -->
          <div style="display: flex; flex-direction: column; gap: 4px; border-left: 1.5px solid #1f2937; padding-left: 12px;">
            <button onclick="window.toggleSessionTimer()" style="background: ${chessState.sessionTimerRunning ? '#1e293b' : '#16a34a'}; color: #ffffff; border: 1px solid ${chessState.sessionTimerRunning ? '#475569' : '#22c55e'}; padding: 4px 10px; border-radius: 5px; font-size: 0.74rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 5px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
              <span>${chessState.sessionTimerRunning ? '⏸' : '▶'}</span> ${chessState.sessionTimerRunning ? 'Pause' : 'Start'}
            </button>
            
            <div style="display: flex; gap: 3px;">
              <button onclick="window.setRoundTimer(5)" style="background: #111827; color: #f59e0b; border: 1px solid #d97706; padding: 2px 6px; border-radius: 4px; font-size: 0.68rem; font-weight: 900; cursor: pointer; font-family: monospace;" title="Set 5 min rapid round">5m</button>
              <button onclick="window.setRoundTimer(10)" style="background: #111827; color: #94a3b8; border: 1px solid #374151; padding: 2px 6px; border-radius: 4px; font-size: 0.68rem; font-weight: 700; cursor: pointer; font-family: monospace;" title="Set 10 min round">10m</button>
              <button onclick="window.setRoundTimer(15)" style="background: #111827; color: #38bdf8; border: 1px solid #0284c7; padding: 2px 6px; border-radius: 4px; font-size: 0.68rem; font-weight: 800; cursor: pointer; font-family: monospace;" title="Set 15 min round">15m</button>
              <button onclick="window.setRoundTimer(20)" style="background: #111827; color: #94a3b8; border: 1px solid #374151; padding: 2px 6px; border-radius: 4px; font-size: 0.68rem; font-weight: 700; cursor: pointer; font-family: monospace;" title="Set 20 min round">20m</button>
              <button onclick="window.resetSessionTimer()" style="background: #111827; color: #94a3b8; border: 1px solid #374151; padding: 2px 6px; border-radius: 4px; font-size: 0.68rem; font-weight: 700; cursor: pointer; font-family: monospace;" title="Reset to 60m clock">↺ 60m</button>
            </div>
          </div>
        </div>

        <!-- Right: Adjudication & Exit Button -->
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <button onclick="window.openAdjudicationModal()" style="background: linear-gradient(135deg, #78350f 0%, #451a03 100%); color: #fde68a; border: 1.5px solid #d97706; font-weight: 800; font-size: 0.8rem; padding: 8px 14px; border-radius: 7px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35); transition: transform 0.15s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" title="Show Piece Values & Material Count Instructions for 5-Minute Rapid Adjudication">
            <span style="font-size: 1rem;">⚖️</span> Piece Values & Rules
          </button>

          ${
            idlePupils.length >= 2
              ? `
            <button onclick="window.pairFreePupilsOnMatchGrid()" style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; border: 1.5px solid #34d399; font-weight: 800; font-size: 0.8rem; padding: 8px 14px; border-radius: 7px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);" title="Pair pupils who finished early on new boards without touching active games">
              <span>⚡</span> Pair Free Pupils (${idlePupils.length})
            </button>
          `
              : ''
          }

          <button onclick="window.toggleChessWhiteboardMode(false)" style="background: #ffffff; color: #09090b; border: 1.5px solid #e4e4e7; font-weight: 900; font-size: 0.84rem; padding: 8px 14px; border-radius: 7px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(255,255,255,0.2); transition: transform 0.15s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'" title="Return to regular dashboard (or press Esc)">
            <span>✕</span> Exit (Esc)
          </button>
        </div>

      </div>

      <!-- Placard Subheader: Piece Values Quick Reference & Fit Toggle -->
      <div style="flex-shrink: 0; display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 0.76rem;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1rem; color: #38bdf8;">⚔️</span>
          <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.05rem; color: #ffffff; font-weight: 800;">
            Active Board Matchups (${activeMatches.length} Boards In Play)
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <!-- Piece Values Quick Pill -->
          <button onclick="window.openAdjudicationModal()" style="background: rgba(217, 119, 6, 0.15); border: 1px solid #d97706; color: #fde68a; font-size: 0.72rem; font-weight: 800; padding: 3px 8px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px;" title="View official piece values and 5-min rapid calculation guide">
            <span>⚖️ Piece Values:</span> ♙1 · ♘3 · ♗3 · ♖5 · ♕9
          </button>

          <!-- Auto-Fit / Scroll Mode Toggle -->
          <button onclick="window.toggleWhiteboardFitMode()" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; cursor: pointer;" title="Toggle between auto-fitting all boards to screen height vs scrolling">
            ${isFitMode ? '⛶ Auto-Fit (No Scroll)' : '↕ Scroll Grid'}
          </button>
        </div>
      </div>

      <!-- MAIN BOARDS GRID: Auto-Sized Zero-Scroll Container -->
      <div style="flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: ${isFitMode ? 'hidden' : 'auto'};">
        ${
          activeMatches.length > 0
            ? `
          <div style="flex: 1; min-height: 0; display: grid; grid-template-columns: ${gridCols}; grid-template-rows: ${gridRows}; gap: 8px;">
            ${activeMatches
              .map((m) => {
                const h1 = HOUSES[m.p1.house] || { name: m.p1.house, color: '#dc2626' };
                const h2 = HOUSES[m.p2.house] || { name: m.p2.house, color: '#2563eb' };

                if (density === 'ultra') {
                  // Ultra-Compact Layout (7 to 10 boards: zero vertical scrolling on any 1080p or 768p screen)
                  return `
                  <div style="background: linear-gradient(145deg, #111827 0%, #0f172a 100%); border: 1.5px solid #1e293b; border-radius: 10px; padding: 7px 9px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35); display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; height: 100%; box-sizing: border-box; transition: all 0.2s;" onmouseover="this.style.borderColor='#38bdf8'" onmouseout="this.style.borderColor='#1e293b'">
                    
                    <!-- Headline: Board & Matchup -->
                    <div style="margin-bottom: 4px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 3px; display: flex; align-items: center; justify-content: space-between; gap: 4px;">
                      <div style="display: flex; align-items: center; gap: 6px; overflow: hidden;">
                        <span style="background: #0284c7; color: #ffffff; font-family: monospace; font-size: 0.72rem; font-weight: 900; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.5px;">
                          B${m.boardNum}
                        </span>
                        <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 0.95rem; font-weight: 800; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                          ${m.p1.name} vs ${m.p2.name}
                        </span>
                      </div>
                      <span style="font-size: 0.6rem; color: #94a3b8; font-family: monospace; background: rgba(255, 255, 255, 0.06); padding: 2px 5px; border-radius: 3px;">
                        P6
                      </span>
                    </div>

                    <!-- Two Player Panels -->
                    <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 4px; align-items: center; margin-bottom: 4px;">
                      <!-- White Player -->
                      <div style="background: rgba(255, 255, 255, 0.03); border: 1.5px solid ${h1.color || '#38bdf8'}; border-radius: 6px; padding: 4px 6px; text-align: left; overflow: hidden;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px;">
                          <span style="font-size: 0.62rem; font-weight: 800; color: #cbd5e1; font-family: monospace;">♔ W</span>
                          <span style="background: ${h1.color || '#444'}; color: #fff; font-size: 0.58rem; font-weight: 700; padding: 1px 4px; border-radius: 2px;">${h1.name.slice(0, 4)}</span>
                        </div>
                        <div style="font-size: 1rem; font-weight: 800; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.15;">
                          ${m.p1.name}
                        </div>
                        <div style="font-size: 0.64rem; color: #94a3b8; font-family: monospace;">
                          ${m.p1.rating || 1000}
                        </div>
                      </div>

                      <div style="font-size: 0.68rem; font-weight: 900; color: #475569; font-family: monospace;">VS</div>

                      <!-- Black Player -->
                      <div style="background: rgba(255, 255, 255, 0.03); border: 1.5px solid ${h2.color || '#dc2626'}; border-radius: 6px; padding: 4px 6px; text-align: right; overflow: hidden;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px;">
                          <span style="background: ${h2.color || '#444'}; color: #fff; font-size: 0.58rem; font-weight: 700; padding: 1px 4px; border-radius: 2px;">${h2.name.slice(0, 4)}</span>
                          <span style="font-size: 0.62rem; font-weight: 800; color: #cbd5e1; font-family: monospace;">♚ B</span>
                        </div>
                        <div style="font-size: 1rem; font-weight: 800; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.15;">
                          ${m.p2.name}
                        </div>
                        <div style="font-size: 0.64rem; color: #94a3b8; font-family: monospace;">
                          ${m.p2.rating || 1000}
                        </div>
                      </div>
                    </div>

                    <!-- 1-Click Scoring Buttons -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px;">
                      <button onclick="window.recordBoardResult('${m.type}', ${m.rIdx}, ${m.mIdx}, '${m.p1.id}', '${m.id}')"
                              style="background: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 6px; padding: 5px 2px; font-weight: 800; font-size: 0.7rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 1px;"
                              title="White wins (+3 House pts)">
                        <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">♔ ${getPlayerButtonShortName(m.p1)}</span>
                        <span style="font-size: 0.58rem; color: #16a34a; font-weight: 900; font-family: monospace;">+3 PTS</span>
                      </button>
                      <button onclick="window.recordBoardResult('${m.type}', ${m.rIdx}, ${m.mIdx}, 'draw', '${m.id}')"
                              style="background: #1e293b; color: #f8fafc; border: 1px solid #475569; border-radius: 6px; padding: 5px 2px; font-weight: 800; font-size: 0.7rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 1px;"
                              title="Draw (+2 House pts each)">
                        <span>½ Draw</span>
                        <span style="font-size: 0.58rem; color: #facc15; font-weight: 900; font-family: monospace;">+2 EACH</span>
                      </button>
                      <button onclick="window.recordBoardResult('${m.type}', ${m.rIdx}, ${m.mIdx}, '${m.p2.id}', '${m.id}')"
                              style="background: #0f172a; color: #ffffff; border: 1px solid #334155; border-radius: 6px; padding: 5px 2px; font-weight: 800; font-size: 0.7rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 1px;"
                              title="Black wins (+3 House pts)">
                        <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">♚ ${getPlayerButtonShortName(m.p2)}</span>
                        <span style="font-size: 0.58rem; color: #16a34a; font-weight: 900; font-family: monospace;">+3 PTS</span>
                      </button>
                    </div>

                  </div>
                `;
                }

                // Normal / Medium / Compact Layout for 1 to 6 boards
                const pad =
                  density === 'compact'
                    ? '10px 12px'
                    : density === 'medium'
                      ? '14px 16px'
                      : '18px 22px';
                const headFont =
                  density === 'compact' ? '1.25rem' : density === 'medium' ? '1.5rem' : '1.85rem';
                const nameFont =
                  density === 'compact' ? '1.2rem' : density === 'medium' ? '1.45rem' : '1.75rem';
                const btnPad =
                  density === 'compact' ? '7px 4px' : density === 'medium' ? '9px 6px' : '12px 6px';
                const btnFont =
                  density === 'compact' ? '0.78rem' : density === 'medium' ? '0.85rem' : '0.92rem';

                return `
                <div style="background: linear-gradient(145deg, #111827 0%, #0f172a 100%); border: 2px solid #1e293b; border-radius: 14px; padding: ${pad}; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45); display: flex; flex-direction: column; justify-content: space-between; height: 100%; box-sizing: border-box; transition: all 0.2s;" onmouseover="this.style.borderColor='#38bdf8'" onmouseout="this.style.borderColor='#1e293b'">
                  
                  <!-- Large Headline -->
                  <div style="margin-bottom: 8px; border-bottom: 1.5px solid rgba(255, 255, 255, 0.08); padding-bottom: 6px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="background: #0284c7; color: #ffffff; font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; font-weight: 900; padding: 3px 10px; border-radius: 6px;">
                        BOARD ${m.boardNum}
                      </span>
                      <span style="font-family: 'Playfair Display', Georgia, serif; font-size: ${headFont}; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">
                        ${m.p1.name} <span style="color: #64748b; font-size: 1.1rem; font-family: sans-serif; font-weight: 500;">vs</span> ${m.p2.name}
                      </span>
                    </div>
                    <span style="font-size: 0.68rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; font-family: monospace; background: rgba(255, 255, 255, 0.06); padding: 2px 7px; border-radius: 4px;">
                      ${m.badge || 'Period 6 Match'}
                    </span>
                  </div>

                  <!-- Two Player Panels -->
                  <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: center; margin-bottom: 10px;">
                    <div style="background: rgba(255, 255, 255, 0.03); border: 2px solid ${h1.color || '#38bdf8'}; border-radius: 10px; padding: 8px 12px;">
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
                        <span style="font-size: 0.7rem; font-weight: 800; color: #cbd5e1; text-transform: uppercase; font-family: monospace;">♔ White</span>
                        <span style="background: ${h1.color || '#444'}; color: #ffffff; font-size: 0.68rem; font-weight: 800; padding: 1px 6px; border-radius: 4px; font-family: monospace;">${h1.name}</span>
                      </div>
                      <div style="font-size: ${nameFont}; font-weight: 800; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2;">
                        ${m.p1.name}
                      </div>
                      <div style="font-size: 0.74rem; color: #94a3b8; margin-top: 2px; font-family: monospace;">
                        Elo ${m.p1.rating || 1000}
                      </div>
                    </div>

                    <div style="text-align: center; font-size: 1rem; font-weight: 900; color: #475569; font-family: monospace;">
                      VS
                    </div>

                    <div style="background: rgba(255, 255, 255, 0.03); border: 2px solid ${h2.color || '#dc2626'}; border-radius: 10px; padding: 8px 12px; text-align: right;">
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
                        <span style="background: ${h2.color || '#444'}; color: #ffffff; font-size: 0.68rem; font-weight: 800; padding: 1px 6px; border-radius: 4px; font-family: monospace;">${h2.name}</span>
                        <span style="font-size: 0.7rem; font-weight: 800; color: #cbd5e1; text-transform: uppercase; font-family: monospace;">♚ Black</span>
                      </div>
                      <div style="font-size: ${nameFont}; font-weight: 800; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2;">
                        ${m.p2.name}
                      </div>
                      <div style="font-size: 0.74rem; color: #94a3b8; margin-top: 2px; font-family: monospace;">
                        Elo ${m.p2.rating || 1000}
                      </div>
                    </div>
                  </div>

                  <!-- 1-Click Smartboard Touch Result Buttons -->
                  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;">
                    <button onclick="window.recordBoardResult('${m.type}', ${m.rIdx}, ${m.mIdx}, '${m.p1.id}', '${m.id}')"
                            style="background: #ffffff; color: #0f172a; border: 1.5px solid #e2e8f0; border-radius: 7px; padding: ${btnPad}; font-weight: 800; font-size: ${btnFont}; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px; box-shadow: 0 2px 8px rgba(0,0,0,0.25);"
                            title="White wins (+3 House pts)">
                      <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">♔ ${m.p1.name} Won</span>
                      <span style="font-size: 0.62rem; color: #16a34a; font-weight: 900; font-family: monospace;">+3 PTS</span>
                    </button>

                    <button onclick="window.recordBoardResult('${m.type}', ${m.rIdx}, ${m.mIdx}, 'draw', '${m.id}')"
                            style="background: #1e293b; color: #f8fafc; border: 1.5px solid #475569; border-radius: 7px; padding: ${btnPad}; font-weight: 800; font-size: ${btnFont}; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px; box-shadow: 0 2px 8px rgba(0,0,0,0.25);"
                            title="Draw (+2 House pts each)">
                      <span style="color: #facc15;">½ Draw</span>
                      <span style="font-size: 0.62rem; color: #facc15; font-weight: 900; font-family: monospace;">+2 EACH</span>
                    </button>

                    <button onclick="window.recordBoardResult('${m.type}', ${m.rIdx}, ${m.mIdx}, '${m.p2.id}', '${m.id}')"
                            style="background: #0f172a; color: #ffffff; border: 1.5px solid #334155; border-radius: 7px; padding: ${btnPad}; font-weight: 800; font-size: ${btnFont}; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px; box-shadow: 0 2px 8px rgba(0,0,0,0.25);"
                            title="Black wins (+3 House pts)">
                      <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">♚ ${m.p2.name} Won</span>
                      <span style="font-size: 0.62rem; color: #16a34a; font-weight: 900; font-family: monospace;">+3 PTS</span>
                    </button>
                  </div>

                </div>
              `;
              })
              .join('')}
          </div>
        `
            : `
          <!-- Zero Active Matches State -->
          <div style="background: rgba(15, 23, 42, 0.7); border: 2px dashed rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 40px 20px; text-align: center; margin: auto; max-width: 600px;">
            <div style="font-size: 3rem; margin-bottom: 12px; color: #facc15;">♔</div>
            <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.8rem; color: #ffffff; font-weight: 800; margin: 0 0 8px 0;">
              ${completedPairings.length > 0 ? 'All Round Matches Finished!' : 'No Active Matches In Play'}
            </h2>
            <p style="font-size: 0.95rem; color: #94a3b8; line-height: 1.4; margin: 0 auto 20px auto; max-width: 460px;">
              ${
                completedPairings.length > 0
                  ? `All ${completedPairings.length} board games have concluded and house points have been awarded.`
                  : "Check in your pupils on the dashboard or launch auto-pairings to begin today's round matches."
              }
            </p>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <button onclick="window.generateThursdayPairings()" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border: 1px solid #38bdf8; font-weight: 800; font-size: 0.85rem; padding: 10px 18px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                <span>⚔️</span> Generate Pairings Grid
              </button>
              ${
                idlePupils.length >= 2
                  ? `
                <button onclick="window.pairFreePupilsOnMatchGrid()" style="background: #059669; color: #ffffff; border: 1px solid #34d399; font-weight: 800; font-size: 0.85rem; padding: 10px 18px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                  <span>⚡</span> Pair Free Pupils (${idlePupils.length})
                </button>
              `
                  : ''
              }
              <button onclick="window.toggleChessWhiteboardMode(false)" style="background: rgba(255, 255, 255, 0.1); color: #cbd5e1; border: 1px solid rgba(255, 255, 255, 0.2); font-weight: 700; font-size: 0.85rem; padding: 10px 16px; border-radius: 6px; cursor: pointer;">
                <span>✕</span> Exit to Dashboard
              </button>
            </div>
          </div>
        `
        }
      </div>

      <!-- Compact Completed Match Strip (Unobtrusive & Collapsible) -->
      ${
        completedPairings.length > 0
          ? `
        <div style="flex-shrink: 0; background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 6px 14px; margin-top: 6px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 0.76rem; color: #94a3b8;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span style="color: #4ade80; font-weight: 800;">✓ Completed (${completedPairings.length}):</span>
            ${completedPairings
              .map(
                (c) => `
              <span style="background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 3px; font-family: monospace;">
                B${c.board}: ${c.result === '1-0' ? `${c.white?.name || 'White'} won` : c.result === '0-1' ? `${c.black?.name || 'Black'} won` : 'Draw'}
              </span>
            `,
              )
              .join('')}
          </div>
          <button onclick="window.undoLastMatchResult()" style="background: rgba(255,255,255,0.08); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.15); font-weight: 700; font-size: 0.72rem; padding: 3px 8px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
            <span>↩️</span> Undo Last Result
          </button>
        </div>
      `
          : ''
      }

      <!-- Subtle Single-Line House Standings & Wit Ticker at Bottom -->
      <div style="flex-shrink: 0; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 6px; padding: 5px 12px; margin-top: 6px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: 0.74rem; color: #64748b; font-family: monospace;">
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <span style="color: #cbd5e1; font-weight: 700; text-transform: uppercase;">House Trophy Standings:</span>
          ${sortedHouses
            .map((h, i) => {
              const hDef = HOUSES[h.id] || { name: h.id, color: '#999' };
              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🎖️';
              return `
              <span>${medal} <strong style="color: #f8fafc;">${hDef.name}:</strong> <strong style="color: ${hDef.color};">${h.points} pts</strong></span>
            `;
            })
            .join(' · ')}
        </div>
        <div style="display: flex; align-items: center; gap: 12px; color: #64748b; font-size: 0.8rem; font-weight: 600;">
          Press [W] or [Esc] to exit Fullscreen Whiteboard
        </div>
      </div>

      ${renderAdjudicationModalOverlay()}

    </div>
  `;
}

// Reusable Piece Values & Rapid Material Tally Calculator Modal (Works in Tournament Full Screen, Cup Tab & Whiteboard Mode)
function renderAdjudicationModalOverlay() {
  if (!chessState.showAdjudicationModal) return '';
  return `
    <div id="adjudication-modal-overlay" style="position: fixed; inset: 0; background: rgba(3, 7, 18, 0.88); z-index: 99999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); padding: 18px; box-sizing: border-box; font-family: 'Outfit', sans-serif;" onclick="if(event.target===this)window.closeAdjudicationModal()">
      <div style="background: linear-gradient(145deg, #111827 0%, #0f172a 100%); border: 2px solid #d97706; border-radius: 18px; max-width: 860px; width: 100%; max-height: 92vh; overflow-y: auto; padding: 24px 28px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(217, 119, 6, 0.25); box-sizing: border-box; color: #f8fafc;">
        
        <!-- Modal Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; border-bottom: 1.5px solid rgba(255,255,255,0.1); padding-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(217, 119, 6, 0.15); border: 2px solid #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: #fbbf24;">
              ⚖️
            </div>
            <div>
              <span style="font-size: 0.68rem; font-family: monospace; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.08em; background: rgba(217, 119, 6, 0.2); padding: 2px 7px; border-radius: 4px; border: 1px solid #d97706;">
                ROUND TIMER ADJUDICATION
              </span>
              <h2 style="margin: 3px 0 0 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.6rem; color: #ffffff; font-weight: 800;">
                Piece Values &amp; Material Count Rules
              </h2>
            </div>
          </div>
          <button type="button" onclick="window.closeAdjudicationModal()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #cbd5e1; font-size: 1.1rem; width: 34px; height: 34px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center;" title="Close (Esc)">
            ✕
          </button>
        </div>

        <!-- Official Piece Values Cards -->
        <div style="margin-bottom: 20px;">
          <div style="font-size: 0.74rem; font-family: monospace; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em;">
            Official Chess Piece Point Values:
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 10px;">
            <div style="background: rgba(255,255,255,0.04); border: 1.5px solid #334155; border-radius: 10px; padding: 10px; text-align: center;">
              <div style="font-size: 2rem; line-height: 1; margin-bottom: 2px;">♙</div>
              <div style="font-weight: 800; font-size: 0.9rem; color: #f8fafc;">Pawn</div>
              <div style="font-size: 1.5rem; font-weight: 900; color: #4ade80; font-family: 'JetBrains Mono', monospace; line-height: 1.2;">1 pt</div>
              <div style="font-size: 0.65rem; color: #94a3b8;">Foot soldier</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); border: 1.5px solid #334155; border-radius: 10px; padding: 10px; text-align: center;">
              <div style="font-size: 2rem; line-height: 1; margin-bottom: 2px;">♘</div>
              <div style="font-weight: 800; font-size: 0.9rem; color: #f8fafc;">Knight</div>
              <div style="font-size: 1.5rem; font-weight: 900; color: #38bdf8; font-family: 'JetBrains Mono', monospace; line-height: 1.2;">3 pts</div>
              <div style="font-size: 0.65rem; color: #94a3b8;">Jumping horse</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); border: 1.5px solid #334155; border-radius: 10px; padding: 10px; text-align: center;">
              <div style="font-size: 2rem; line-height: 1; margin-bottom: 2px;">♗</div>
              <div style="font-weight: 800; font-size: 0.9rem; color: #f8fafc;">Bishop</div>
              <div style="font-size: 1.5rem; font-weight: 900; color: #a78bfa; font-family: 'JetBrains Mono', monospace; line-height: 1.2;">3 pts</div>
              <div style="font-size: 0.65rem; color: #94a3b8;">Diagonal ranger</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); border: 1.5px solid #334155; border-radius: 10px; padding: 10px; text-align: center;">
              <div style="font-size: 2rem; line-height: 1; margin-bottom: 2px;">♖</div>
              <div style="font-weight: 800; font-size: 0.9rem; color: #f8fafc;">Rook</div>
              <div style="font-size: 1.5rem; font-weight: 900; color: #fbbf24; font-family: 'JetBrains Mono', monospace; line-height: 1.2;">5 pts</div>
              <div style="font-size: 0.65rem; color: #94a3b8;">Castle tower</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); border: 1.5px solid #334155; border-radius: 10px; padding: 10px; text-align: center;">
              <div style="font-size: 2rem; line-height: 1; margin-bottom: 2px;">♕</div>
              <div style="font-weight: 800; font-size: 0.9rem; color: #f8fafc;">Queen</div>
              <div style="font-size: 1.5rem; font-weight: 900; color: #f43f5e; font-family: 'JetBrains Mono', monospace; line-height: 1.2;">9 pts</div>
              <div style="font-size: 0.65rem; color: #94a3b8;">Most powerful</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); border: 1.5px solid #334155; border-radius: 10px; padding: 10px; text-align: center;">
              <div style="font-size: 2rem; line-height: 1; margin-bottom: 2px;">♔</div>
              <div style="font-weight: 800; font-size: 0.9rem; color: #f8fafc;">King</div>
              <div style="font-size: 1rem; font-weight: 900; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; line-height: 1.8;">Infinite</div>
              <div style="font-size: 0.65rem; color: #94a3b8;">The Sovereign</div>
            </div>
          </div>
        </div>

        <!-- 3-Step Pupil Adjudication Instructions -->
        <div style="background: rgba(255, 255, 255, 0.03); border: 1.5px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 14px 18px; margin-bottom: 18px;">
          <div style="font-size: 0.74rem; font-family: monospace; font-weight: 800; color: #fbbf24; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.05em;">
            3-Step Pupil Adjudication Instructions:
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px;">
            <div style="display: flex; gap: 10px;">
              <span style="width: 26px; height: 26px; border-radius: 50%; background: #ef4444; color: #fff; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem;">1</span>
              <div>
                <strong style="color: #ffffff; font-size: 0.88rem;">"Hands Off the Pieces!"</strong>
                <p style="margin: 3px 0 0 0; font-size: 0.78rem; color: #94a3b8; line-height: 1.35;">
                  When the round timer rings, all play ceases immediately.
                </p>
              </div>
            </div>
            <div style="display: flex; gap: 10px;">
              <span style="width: 26px; height: 26px; border-radius: 50%; background: #3b82f6; color: #fff; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem;">2</span>
              <div>
                <strong style="color: #ffffff; font-size: 0.88rem;">Count Surviving Pieces</strong>
                <p style="margin: 3px 0 0 0; font-size: 0.78rem; color: #94a3b8; line-height: 1.35;">
                  Add up the point values of all pieces surviving on your side of the board.
                </p>
              </div>
            </div>
            <div style="display: flex; gap: 10px;">
              <span style="width: 26px; height: 26px; border-radius: 50%; background: #10b981; color: #fff; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem;">3</span>
              <div>
                <strong style="color: #ffffff; font-size: 0.88rem;">Compare &amp; Score</strong>
                <p style="margin: 3px 0 0 0; font-size: 0.78rem; color: #94a3b8; line-height: 1.35;">
                  • <strong>Higher Total:</strong> WINNER (+3 pts)<br>
                  • <strong>Tied:</strong> Sudden-death next capture (Cup) or DRAW (+2 pts each, Rapid)!
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Live Material Tally Calculator -->
        <div style="background: rgba(3, 7, 18, 0.7); border: 1.5px solid #334155; border-radius: 12px; padding: 14px 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1rem; color: #38bdf8;">🧮</span>
              <span style="font-weight: 800; font-size: 0.86rem; color: #f8fafc;">Interactive Material Tally Calculator</span>
            </div>
            <button type="button" onclick="window.resetAdjudicationCalc()" style="background: #1e293b; color: #94a3b8; border: 1px solid #475569; font-size: 0.7rem; padding: 3px 8px; border-radius: 4px; cursor: pointer;">
              ↺ Reset Tally
            </button>
          </div>

          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center;">
            <div style="background: rgba(255,255,255,0.03); border: 1.5px solid #38bdf8; border-radius: 8px; padding: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <strong style="color: #ffffff; font-size: 0.88rem;">♔ White Material</strong>
                <span style="font-size: 1.5rem; font-weight: 900; color: #38bdf8; font-family: monospace;">${chessState.adjudicationCalc?.white || 0} pts</span>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                <button type="button" onclick="window.updateAdjudicationCalc('white', 1)" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; padding: 5px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">+1 ♙</button>
                <button type="button" onclick="window.updateAdjudicationCalc('white', 3)" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; padding: 5px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">+3 ♘</button>
                <button type="button" onclick="window.updateAdjudicationCalc('white', 3)" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; padding: 5px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">+3 ♗</button>
                <button type="button" onclick="window.updateAdjudicationCalc('white', 5)" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; padding: 5px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">+5 ♖</button>
                <button type="button" onclick="window.updateAdjudicationCalc('white', 9)" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; padding: 5px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">+9 ♕</button>
                <button type="button" onclick="window.updateAdjudicationCalc('white', -1)" style="background: #1e293b; color: #f87171; border: 1px solid #7f1d1d; padding: 5px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">-1</button>
              </div>
            </div>

            <div style="font-weight: 900; color: #64748b; font-size: 1rem; text-align: center;">VS</div>

            <div style="background: rgba(255,255,255,0.03); border: 1.5px solid #dc2626; border-radius: 8px; padding: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <strong style="color: #ffffff; font-size: 0.88rem;">♚ Black Material</strong>
                <span style="font-size: 1.5rem; font-weight: 900; color: #f87171; font-family: monospace;">${chessState.adjudicationCalc?.black || 0} pts</span>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                <button type="button" onclick="window.updateAdjudicationCalc('black', 1)" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; padding: 5px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">+1 ♙</button>
                <button type="button" onclick="window.updateAdjudicationCalc('black', 3)" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; padding: 5px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">+3 ♘</button>
                <button type="button" onclick="window.updateAdjudicationCalc('black', 3)" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; padding: 5px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">+3 ♗</button>
                <button type="button" onclick="window.updateAdjudicationCalc('black', 5)" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; padding: 5px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">+5 ♖</button>
                <button type="button" onclick="window.updateAdjudicationCalc('black', 9)" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; padding: 5px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">+9 ♕</button>
                <button type="button" onclick="window.updateAdjudicationCalc('black', -1)" style="background: #1e293b; color: #f87171; border: 1px solid #7f1d1d; padding: 5px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">-1</button>
              </div>
            </div>
          </div>

          <div style="margin-top: 12px; padding: 8px 12px; border-radius: 6px; text-align: center; font-weight: 800; font-size: 0.88rem; background: ${
            (chessState.adjudicationCalc?.white || 0) > (chessState.adjudicationCalc?.black || 0)
              ? 'rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid #0284c7;'
              : (chessState.adjudicationCalc?.black || 0) >
                  (chessState.adjudicationCalc?.white || 0)
                ? 'rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid #dc2626;'
                : (chessState.adjudicationCalc?.white || 0) > 0
                  ? 'rgba(250, 204, 21, 0.15); color: #facc15; border: 1px solid #ca8a04;'
                  : 'rgba(255, 255, 255, 0.05); color: #94a3b8; border: 1px solid #334155;'
          }">
            ${
              (chessState.adjudicationCalc?.white || 0) >
              (chessState.adjudicationCalc?.black || 0)
                ? `🏆 White leads by ${(chessState.adjudicationCalc?.white || 0) - (chessState.adjudicationCalc?.black || 0)} pts → White Wins!`
                : (chessState.adjudicationCalc?.black || 0) >
                    (chessState.adjudicationCalc?.white || 0)
                  ? `🏆 Black leads by ${(chessState.adjudicationCalc?.black || 0) - (chessState.adjudicationCalc?.white || 0)} pts → Black Wins!`
                  : (chessState.adjudicationCalc?.white || 0) > 0
                    ? `⚖️ Equal Material (${chessState.adjudicationCalc?.white || 0} pts each)!`
                    : 'Tap the piece buttons above to calculate a live rapid adjudication verdict.'
            }
          </div>
        </div>

        <div style="margin-top: 16px; text-align: right;">
          <button type="button" onclick="window.closeAdjudicationModal()" style="background: #ffffff; color: #09090b; border: none; font-weight: 800; font-size: 0.88rem; padding: 8px 20px; border-radius: 6px; cursor: pointer;">
            Close Guide (Esc)
          </button>
        </div>

      </div>
    </div>
  `;
}

// 2-Minute Historical Drill Timer Handlers
window.startDrillTimer = function (id) {
  if (!drillTimers[id]) {
    drillTimers[id] = { remaining: 120, interval: null, running: false };
  }

  const timer = drillTimers[id];
  const btn = document.getElementById(`timer-btn-${id}`);
  const display = document.getElementById(`timer-display-${id}`);

  if (timer.running) {
    // Pause timer
    clearInterval(timer.interval);
    timer.running = false;
    if (btn) btn.textContent = 'Resume';
    return;
  }

  timer.running = true;
  if (btn) btn.textContent = 'Pause';

  timer.interval = setInterval(() => {
    timer.remaining--;
    const mins = String(Math.floor(timer.remaining / 60)).padStart(2, '0');
    const secs = String(timer.remaining % 60).padStart(2, '0');
    if (display) display.textContent = `${mins}:${secs}`;

    if (timer.remaining <= 0) {
      clearInterval(timer.interval);
      timer.running = false;
      if (display) display.textContent = 'TIME UP!';
      if (btn) btn.textContent = 'Done';
      alert('⏰ 2 Minutes Up! Pencils down — reveal the tactical solution with your class!');
    }
  }, 1000);
};

window.resetDrillTimer = function (id) {
  if (drillTimers[id]) {
    clearInterval(drillTimers[id].interval);
    drillTimers[id].remaining = 120;
    drillTimers[id].running = false;
  }
  const display = document.getElementById(`timer-display-${id}`);
  const btn = document.getElementById(`timer-btn-${id}`);
  if (display) display.textContent = '02:00';
  if (btn) btn.textContent = 'Start';
};

window.toggleDrillSolution = function (id) {
  const el = document.getElementById(`solution-${id}`);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
};

// Modal Handling: Log Match
window.openLogMatchModal = function (
  defaultWhiteId = null,
  defaultBlackId = null,
  boardNum = null,
) {
  if (chessState.players.length < 2) {
    showChessToast('Please register at least 2 pupils before logging matches.', 'warning');
    return;
  }
  const modalCont = getChessModalContainer();
  if (!modalCont) return;

  const checkedInSet = new Set(chessState.checkedInPlayerIds || []);
  const checkedInList = chessState.players.filter((p) => checkedInSet.has(p.id));
  const otherList = chessState.players.filter((p) => !checkedInSet.has(p.id));

  const renderPlayerOpt = (p) =>
    `<option value="${p.id}">${p.name} (${HOUSES[p.house]?.name || p.house} • Rtg ${p.rating})</option>`;

  const playerOptionsHtml = `
    ${
      checkedInList.length > 0
        ? `<optgroup label="🟢 Checked-In Today (${checkedInList.length})">
            ${checkedInList.map(renderPlayerOpt).join('')}
           </optgroup>`
        : ''
    }
    <optgroup label="All Enrolled Pupils (${chessState.players.length})">
      ${(checkedInList.length > 0 ? otherList : chessState.players).map(renderPlayerOpt).join('')}
    </optgroup>
  `;

  modalCont.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(28, 25, 23, 0.82); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 16px;" onclick="if(event.target === this) window.closeChessModal();">
      <div style="background: #faf7f2; border: 2px solid #44403c; border-radius: 10px; max-width: 520px; width: 100%; padding: 26px; box-shadow: 0 20px 45px rgba(0,0,0,0.4); animation: zoomIn 0.2s ease-out; font-family: 'Outfit', sans-serif;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 2px solid #e7e2d7; padding-bottom: 12px;">
          <div>
            <div style="font-family: monospace; font-size: 0.7rem; color: #78716c; text-transform: uppercase; letter-spacing: 0.1em;">Official FIDE Match Scorecard</div>
            <h2 style="margin: 2px 0 0 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.45rem; color: #1c1917; font-weight: 700; letter-spacing: 0.02em;">
              Record Match Outcome
            </h2>
          </div>
          <button onclick="window.closeChessModal()" style="background: #e7e2d7; border: none; font-size: 1.2rem; color: #57534e; cursor: pointer; width: 30px; height: 30px; border-radius: 4px; display: flex; align-items: center; justify-content: center;">&times;</button>
        </div>

        ${
          boardNum
            ? `
          <div style="background: #f5f2eb; border: 1px solid #d6d3d1; padding: 8px 12px; border-radius: 6px; margin-bottom: 14px; color: #1c1917; font-family: monospace; font-size: 0.82rem; font-weight: 700;">
            TABLE / BOARD ${boardNum} · OFFICIAL SESSION MATCH
          </div>
        `
            : ''
        }

        <form id="chess-match-form" onsubmit="window.handleMatchSubmit(event)">
          
          <div style="background: #f5f2eb; border: 1.5px solid #e7e2d7; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
            <div style="margin-bottom: 12px;">
              <label style="display: block; font-weight: 700; font-size: 0.8rem; color: #44403c; margin-bottom: 4px; font-family: monospace; letter-spacing: 0.05em;">
                ♔ WHITE PIECES:
              </label>
              <select id="match-white-player" required style="width: 100%; padding: 10px 12px; border-radius: 6px; border: 1.5px solid #d6d3d1; font-size: 0.92rem; background: #ffffff; color: #1c1917; font-weight: 600;">
                <option value="">-- Select White Player --</option>
                ${playerOptionsHtml}
              </select>
            </div>

            <div style="text-align: center; margin: -4px 0 8px;">
              <button type="button" onclick="window.swapWhiteAndBlack()" style="background: #e7e2d7; border: 1px solid #d6d3d1; padding: 3px 12px; border-radius: 4px; font-size: 0.72rem; font-weight: 700; color: #44403c; cursor: pointer; font-family: monospace;">
                ⇄ SWAP COLORS
              </button>
            </div>

            <div>
              <label style="display: block; font-weight: 700; font-size: 0.8rem; color: #44403c; margin-bottom: 4px; font-family: monospace; letter-spacing: 0.05em;">
                ♚ BLACK PIECES:
              </label>
              <select id="match-black-player" required style="width: 100%; padding: 10px 12px; border-radius: 6px; border: 1.5px solid #d6d3d1; font-size: 0.92rem; background: #ffffff; color: #1c1917; font-weight: 600;">
                <option value="">-- Select Black Player --</option>
                ${playerOptionsHtml}
              </select>
            </div>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: 700; font-size: 0.8rem; color: #44403c; margin-bottom: 6px; font-family: monospace; letter-spacing: 0.05em;">
              RESULT / SCORE:
            </label>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;" id="result-radio-group">
              <label style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px 6px; border: 1.5px solid #d6d3d1; border-radius: 6px; cursor: pointer; text-align: center; background: #ffffff; color: #1c1917;" class="result-btn-label">
                <input type="radio" name="match_result_radio" value="1-0" checked style="margin-bottom: 4px;" onchange="document.getElementById('match-result').value = '1-0'">
                <span style="font-weight: 800; font-size: 0.88rem; font-family: monospace;">1 – 0</span>
                <span style="font-size: 0.68rem; color: #57534e; font-weight: 600;">White Won (+3/+1)</span>
              </label>
              <label style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px 6px; border: 1.5px solid #d6d3d1; border-radius: 6px; cursor: pointer; text-align: center; background: #ffffff; color: #1c1917;" class="result-btn-label">
                <input type="radio" name="match_result_radio" value="1/2-1/2" style="margin-bottom: 4px;" onchange="document.getElementById('match-result').value = '1/2-1/2'">
                <span style="font-weight: 800; font-size: 0.88rem; font-family: monospace;">½ – ½</span>
                <span style="font-size: 0.68rem; color: #57534e; font-weight: 600;">Draw (+2/+2)</span>
              </label>
              <label style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px 6px; border: 1.5px solid #d6d3d1; border-radius: 6px; cursor: pointer; text-align: center; background: #ffffff; color: #1c1917;" class="result-btn-label">
                <input type="radio" name="match_result_radio" value="0-1" style="margin-bottom: 4px;" onchange="document.getElementById('match-result').value = '0-1'">
                <span style="font-weight: 800; font-size: 0.88rem; font-family: monospace;">0 – 1</span>
                <span style="font-size: 0.68rem; color: #57534e; font-weight: 600;">Black Won (+3/+1)</span>
              </label>
            </div>
            <input type="hidden" id="match-result" value="1-0">
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: 700; font-size: 0.8rem; color: #44403c; margin-bottom: 4px; font-family: monospace;">OPENING / NOTES (OPTIONAL):</label>
            <input type="text" id="match-opening" placeholder="e.g. Queen's Gambit, Sicilian Defence, Ruy Lopez" style="width: 100%; box-sizing: border-box; padding: 9px 12px; border-radius: 6px; border: 1.5px solid #d6d3d1; font-size: 0.88rem; background: #ffffff; color: #1c1917;">
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; border-top: 1.5px solid #e7e2d7; padding-top: 14px;">
            <button type="button" onclick="window.closeChessModal()" style="background: #e7e2d7; color: #44403c; border: 1px solid #d6d3d1; padding: 9px 16px; border-radius: 6px; font-weight: 700; font-family: monospace; font-size: 0.8rem; cursor: pointer;">CANCEL</button>
            <button type="submit" style="background: #1c1917; color: #fafaf9; border: 1.5px solid #1c1917; padding: 9px 22px; border-radius: 6px; font-weight: 700; font-size: 0.88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
              <span>✓</span> Save Match &amp; House Points
            </button>
          </div>

        </form>

      </div>
    </div>
  `;

  if (defaultWhiteId) {
    const wSelect = document.getElementById('match-white-player');
    if (wSelect) wSelect.value = defaultWhiteId;
  }
  if (defaultBlackId) {
    const bSelect = document.getElementById('match-black-player');
    if (bSelect) bSelect.value = defaultBlackId;
  }
};

window.swapWhiteAndBlack = function () {
  const wSelect = document.getElementById('match-white-player');
  const bSelect = document.getElementById('match-black-player');
  if (wSelect && bSelect) {
    const temp = wSelect.value;
    wSelect.value = bSelect.value;
    bSelect.value = temp;
  }
};

window.prefillMatchModal = function (wId, bId, boardNum = null) {
  window.openLogMatchModal(wId, bId, boardNum);
};

window.closeChessModal = function () {
  const modalCont = getChessModalContainer();
  if (modalCont) modalCont.innerHTML = '';
};

window.handleMatchSubmit = function (e) {
  if (e && e.preventDefault) e.preventDefault();

  if (
    chessState.userRole !== 'teacher' ||
    localStorage.getItem('history_chess_teacher_auth') !== 'true'
  ) {
    showChessToast('🔒 Access Denied: Only authenticated teachers can record matches.', 'error');
    return;
  }

  const wId = document.getElementById('match-white-player')?.value;
  const bId = document.getElementById('match-black-player')?.value;
  const result = document.getElementById('match-result')?.value;
  const opening = document.getElementById('match-opening')?.value;

  if (!wId || !bId) {
    alert('Please select two players.');
    return;
  }
  if (wId === bId) {
    alert('White and Black must be two different players.');
    return;
  }

  const pWhite = chessState.players.find((p) => p.id === wId);
  const pBlack = chessState.players.find((p) => p.id === bId);

  if (!pWhite || !pBlack) return;

  pWhite.games++;
  pBlack.games++;

  if (result === '1-0') {
    pWhite.won++;
    pBlack.lost++;
    pWhite.rating += 15;
    pBlack.rating = Math.max(800, pBlack.rating - 15);
  } else if (result === '0-1') {
    pBlack.won++;
    pWhite.lost++;
    pBlack.rating += 15;
    pWhite.rating = Math.max(800, pWhite.rating - 15);
  } else {
    pWhite.drawn++;
    pBlack.drawn++;
  }

  // Automate pupil ranking strictly by points (largest to smallest)
  autoSortPlayersByPoints();

  chessState.matches.push({
    id: 'm_' + Date.now(),
    date: 'Thursday Period 6',
    round: 'Period 6 Session',
    white: pWhite.name,
    black: pBlack.name,
    whiteHouse: pWhite.house,
    blackHouse: pBlack.house,
    result: result,
    opening: opening || 'Open Game',
  });

  saveChessState();
  window.closeChessModal();
  renderChessHubView();
  showChessToast(`Saved match: ${pWhite.name} vs ${pBlack.name} (${result})!`, 'success');
  if (chessState.autoRePairEnabled && chessState.sessionActive) {
    setTimeout(() => {
      window.checkAndAutoPairFreePupils();
    }, 120);
  }
};

// Modal Handling: Assembly Slide Exporter (16:9 Presentation)
window.openAssemblySlideModal = function () {
  const modalCont = getChessModalContainer();
  if (!modalCont) return;

  const houseTotals = calculateHouseTotals();
  const sorted = Object.values(houseTotals).sort((a, b) => b.points - a.points);
  const leadingHouse = HOUSES[sorted[0].id] || { name: 'Victory', color: '#f59e0b' };

  // Individual Grandmaster Champion (#1 on Master Ladder or highest points)
  const sortedByPoints = [...chessState.players].sort((a, b) => {
    const ptsA =
      (a.won || 0) * SCORING_RULES.WIN +
      (a.drawn || 0) * SCORING_RULES.DRAW +
      Math.max(0, (a.games || 0) - (a.won || 0) - (a.drawn || 0)) * SCORING_RULES.PARTICIPATION;
    const ptsB =
      (b.won || 0) * SCORING_RULES.WIN +
      (b.drawn || 0) * SCORING_RULES.DRAW +
      Math.max(0, (b.games || 0) - (b.won || 0) - (b.drawn || 0)) * SCORING_RULES.PARTICIPATION;
    if (ptsB !== ptsA) return ptsB - ptsA;
    return (a.rank || 99) - (b.rank || 99);
  });
  const champ = chessState.players.find((p) => p.rank === 1) ||
    sortedByPoints[0] || {
      name: 'Club Champion',
      house: 'invincible',
      rating: 1000,
      won: 1,
      drawn: 0,
      games: 2,
    };
  const champPts =
    (champ.won || 0) * SCORING_RULES.WIN +
    (champ.drawn || 0) * SCORING_RULES.DRAW +
    Math.max(0, (champ.games || 0) - (champ.won || 0) - (champ.drawn || 0)) *
      SCORING_RULES.PARTICIPATION;
  const champHouse = HOUSES[champ.house] || { name: champ.house, color: '#38bdf8' };
  const champLosses = Math.max(0, (champ.games || 0) - (champ.won || 0) - (champ.drawn || 0));

  const currentQuote =
    typeof window.getRandomHistoricalQuote === 'function'
      ? window.getRandomHistoricalQuote()
      : {
          quote: 'When you see a good move, look for a better one.',
          figure: 'Emanuel Lasker',
          era: 'World Champion 1894–1921',
        };

  modalCont.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 20px;" onclick="if(event.target === this) window.closeChessModal();">
      <div style="background: #ffffff; border-radius: 14px; max-width: 960px; width: 100%; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); animation: zoomIn 0.2s ease-out; font-family: 'Outfit', sans-serif;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 10px;">
          <div>
            <h2 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 1.35rem; color: #0f172a; display: flex; align-items: center; gap: 8px;">
              <span style="color: #f59e0b;">👑</span> Export Friday Assembly Presentation Slide (16:9)
            </h2>
            <div style="font-size: 0.8rem; color: #64748b;">Featuring the #1 School Champion & House Standings for morning assembly notices!</div>
          </div>
          <button onclick="window.closeChessModal()" style="background: none; border: none; font-size: 1.2rem; color: #64748b; cursor: pointer;">&times;</button>
        </div>

        <!-- 16:9 Slide Preview Canvas Wrapper -->
        <div id="slide-preview-card" style="width: 100%; aspect-ratio: 16/9; background: linear-gradient(135deg, #090d16 0%, #1e1b4b 100%); border-radius: 12px; padding: 22px 28px; color: #ffffff; display: flex; flex-direction: column; justify-content: space-between; border: 2.5px solid #3b82f6; box-shadow: 0 8px 28px rgba(0,0,0,0.35); position: relative; overflow: hidden; box-sizing: border-box;">
          
          <!-- Slide Header Bar -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 14px;">
            <div>
              <div style="font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em; color: #93c5fd; text-transform: uppercase; font-family: monospace;">
                The History Portal · PERIOD 6 CHESS CLUB
              </div>
              <h1 style="font-family: 'Playfair Display', serif; font-size: 1.65rem; margin: 3px 0 0 0; color: #ffffff; font-weight: 900; letter-spacing: -0.01em;">
                Weekly House Championship & Grandmaster Honors
              </h1>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
              <span style="background: rgba(245, 158, 11, 0.2); border: 1.5px solid #f59e0b; color: #fde047; padding: 4px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">
                🏆 1st House: ${leadingHouse.name} (${sorted[0].points} pts)
              </span>
            </div>
          </div>

          <!-- PROMINENT SPOTLIGHT: THE NUMBER 1 PLAYER (REALLY BIGGED UP AS CHAMPION!) -->
          <div style="background: linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(180, 83, 9, 0.32) 100%); border: 2px solid #facc15; border-radius: 10px; padding: 10px 18px; margin: 8px 0; display: flex; align-items: center; justify-content: space-between; gap: 14px; box-shadow: 0 0 25px rgba(250, 204, 21, 0.25); position: relative; overflow: hidden;">
            
            <!-- Crown Watermark in Background -->
            <div style="position: absolute; right: 18%; top: -18px; font-size: 6.5rem; opacity: 0.07; color: #facc15; pointer-events: none; line-height: 1;">
              ♔
            </div>

            <!-- Left: Grandmaster Identity -->
            <div style="display: flex; align-items: center; gap: 12px; z-index: 1;">
              <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #fef08a 0%, #eab308 100%); color: #713f12; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 900; box-shadow: 0 4px 14px rgba(234, 179, 8, 0.5); flex-shrink: 0; border: 2px solid #ffffff;">
                ♔
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="background: #eab308; color: #422006; font-size: 0.64rem; font-weight: 900; text-transform: uppercase; padding: 2px 7px; border-radius: 4px; letter-spacing: 0.08em; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
                    👑 REIGNING SCHOOL GRANDMASTER
                  </span>
                  <span style="color: #fef08a; font-size: 0.7rem; font-weight: 800; font-family: monospace;">
                    RANK #1 ON MASTER LADDER
                  </span>
                </div>
                <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.65rem; font-weight: 900; color: #ffffff; margin-top: 1px; text-shadow: 0 2px 10px rgba(0,0,0,0.6); line-height: 1.1;">
                  ${champ.name}
                  <span style="font-size: 0.95rem; color: #fef08a; font-family: 'Outfit', sans-serif; font-weight: 700; margin-left: 6px;">
                    (${champHouse.name})
                  </span>
                </div>
                <div style="font-size: 0.7rem; color: #e2e8f0; margin-top: 1px; font-style: italic;">
                  "Champion of the Board — Master tactician holding the #1 spot on the The History Portal Ladder!"
                </div>
              </div>
            </div>

            <!-- Right: Champion Stats Badges -->
            <div style="display: flex; align-items: center; gap: 10px; text-align: right; z-index: 1;">
              <div style="background: rgba(0, 0, 0, 0.35); border: 1.5px solid rgba(250, 204, 21, 0.5); border-radius: 8px; padding: 5px 12px;">
                <div style="font-size: 0.6rem; color: #fde047; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em;">Club Points</div>
                <div style="font-size: 1.5rem; font-weight: 900; color: #fde047; font-family: monospace; line-height: 1;">${champPts} pts</div>
              </div>
              <div style="background: rgba(0, 0, 0, 0.35); border: 1.5px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 5px 12px; text-align: center;">
                <div style="font-size: 0.6rem; color: #cbd5e1; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em;">Record</div>
                <div style="font-size: 0.95rem; font-weight: 800; color: #ffffff; line-height: 1.2;">${champ.won || 0}W · ${champ.drawn || 0}D · ${champLosses}L</div>
                <div style="font-size: 0.6rem; color: #94a3b8; font-family: monospace;">Rating ${champ.rating || 1000} Elo</div>
              </div>
            </div>

          </div>

          <!-- 4 House Cards -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 4px 0 6px 0;">
            ${sorted
              .map((h, idx) => {
                const house = HOUSES[h.id] || { name: h.id, color: '#999' };
                const is1st = idx === 0;
                return `
                <div style="background: rgba(255, 255, 255, 0.07); border: 1.5px solid ${is1st ? house.color : 'rgba(255, 255, 255, 0.15)'}; border-radius: 8px; padding: 8px 10px; text-align: center;">
                  <div style="font-size: 0.65rem; font-weight: 800; color: ${is1st ? '#fde047' : '#94a3b8'}; text-transform: uppercase;">
                    ${idx === 0 ? '🏆 1st Place' : idx === 1 ? '2nd Place' : idx === 2 ? '3rd Place' : '4th Place'}
                  </div>
                  <div style="font-size: 0.95rem; font-weight: 800; color: #ffffff; margin: 1px 0;">${house.name}</div>
                  <div style="font-size: 1.7rem; font-weight: 900; color: ${house.color}; line-height: 1.1;">${h.points}</div>
                  <div style="font-size: 0.6rem; color: #cbd5e1; text-transform: uppercase; font-weight: 700;">House Points</div>
                  <div style="font-size: 0.64rem; color: #94a3b8; margin-top: 2px;">${h.wins}W · ${h.draws}D · ${h.losses}L</div>
                </div>
              `;
              })
              .join('')}
          </div>

          <!-- Footer Banner & Assembly Strategy Quote of the Week -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.15); padding-top: 6px; font-size: 0.72rem; color: #94a3b8; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; overflow: hidden; flex: 1;">
              <span style="background: rgba(245, 158, 11, 0.2); border: 1px solid rgba(245, 158, 11, 0.5); color: #fde047; font-size: 0.62rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; white-space: nowrap;">Quote of the Week</span>
              <div style="color: #cbd5e1; font-style: italic; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: 'Playfair Display', Georgia, serif; font-size: 0.78rem;">
                <span id="assembly-slide-quote-text">&ldquo;${currentQuote.quote}&rdquo;</span>
                <span id="assembly-slide-quote-author" style="font-style: normal; color: #fde047; font-weight: 700; margin-left: 6px;">&mdash; ${currentQuote.figure} (${currentQuote.era})</span>
              </div>
              <button type="button" onclick="window.cycleAssemblyQuote()" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #cbd5e1; border-radius: 4px; padding: 1px 7px; font-size: 0.65rem; cursor: pointer; white-space: nowrap;" title="Change quote">
                🔄 Change
              </button>
            </div>
            <div style="color: #94a3b8; font-size: 0.68rem; white-space: nowrap;">
              Every match: <strong style="color: #fde047;">+3 Win</strong> | <strong style="color: #cbd5e1;">+2 Draw</strong> | <strong style="color: #93c5fd;">+1 Play</strong>
            </div>
          </div>

        </div>

        <!-- Action Buttons -->
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px;">
          <button onclick="window.copyAssemblyNoticeText()" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; padding: 9px 16px; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <span>📋</span> Copy Assembly Notice Text
          </button>
          <button onclick="window.downloadAssemblySlidePNG()" style="background: #2563eb; color: #ffffff; border: none; padding: 9px 18px; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
            <span>💾</span> Download 16:9 Slide (PNG)
          </button>
        </div>

      </div>
    </div>
  `;
};

window.copyAssemblyNoticeText = function () {
  const houseTotals = calculateHouseTotals();
  const sorted = Object.values(houseTotals).sort((a, b) => b.points - a.points);

  const sortedByPoints = [...chessState.players].sort((a, b) => {
    const ptsA =
      (a.won || 0) * SCORING_RULES.WIN +
      (a.drawn || 0) * SCORING_RULES.DRAW +
      Math.max(0, (a.games || 0) - (a.won || 0) - (a.drawn || 0)) * SCORING_RULES.PARTICIPATION;
    const ptsB =
      (b.won || 0) * SCORING_RULES.WIN +
      (b.drawn || 0) * SCORING_RULES.DRAW +
      Math.max(0, (b.games || 0) - (b.won || 0) - (b.drawn || 0)) * SCORING_RULES.PARTICIPATION;
    if (ptsB !== ptsA) return ptsB - ptsA;
    return (a.rank || 99) - (b.rank || 99);
  });
  const champ = chessState.players.find((p) => p.rank === 1) || sortedByPoints[0];
  const champPts = champ
    ? (champ.won || 0) * SCORING_RULES.WIN +
      (champ.drawn || 0) * SCORING_RULES.DRAW +
      Math.max(0, (champ.games || 0) - (champ.won || 0) - (champ.drawn || 0)) *
        SCORING_RULES.PARTICIPATION
    : 0;
  const champHouseName = champ ? HOUSES[champ.house]?.name || champ.house : '—';
  const champLosses = champ
    ? Math.max(0, (champ.games || 0) - (champ.won || 0) - (champ.drawn || 0))
    : 0;

  const text = `👑 HISTORY REVISION HUB CHESS CLUB — WEEKLY ASSEMBLY HONORS (Period 6 Thursdays)

⭐ INDIVIDUAL SCHOOL GRANDMASTER OF THE WEEK:
🥇 Huge congratulations to ${champ ? champ.name : 'our club champion'} (${champHouseName})!
${champ ? champ.name : 'They'} currently sit at RANK #1 on the The History Portal Master Ladder with ${champPts} points (${champ ? champ.won : 0} Wins, ${champ ? champ.drawn : 0} Draws, ${champLosses} Losses, Elo ${champ ? champ.rating : 1000})! An outstanding display of tactical mastery and sportsmanship on the boards!

🏰 WEEKLY HOUSE CHAMPIONSHIP STANDINGS:
1st Place: ${HOUSES[sorted[0].id].name} — ${sorted[0].points} pts (${sorted[0].wins}W, ${sorted[0].draws}D, ${sorted[0].losses}L)
2nd Place: ${HOUSES[sorted[1].id].name} — ${sorted[1].points} pts (${sorted[1].wins}W, ${sorted[1].draws}D, ${sorted[1].losses}L)
3rd Place: ${HOUSES[sorted[2].id].name} — ${sorted[2].points} pts (${sorted[2].wins}W, ${sorted[2].draws}D, ${sorted[2].losses}L)
4th Place: ${HOUSES[sorted[3].id].name} — ${sorted[3].points} pts (${sorted[3].wins}W, ${sorted[3].draws}D, ${sorted[3].losses}L)

Every game played earns points for your House (+3 for Win, +2 for Draw, +1 for Participation)! See you next Thursday in Period 6!`;

  navigator.clipboard.writeText(text).then(() => {
    alert(
      '📋 Assembly notice copied with Grandmaster Champion announcement! Ready to read out in morning notices or paste into the weekly bulletin.',
    );
  });
};

window.downloadAssemblySlidePNG = function () {
  const houseTotals = calculateHouseTotals();
  const sorted = Object.values(houseTotals).sort((a, b) => b.points - a.points);
  const leadingHouse = HOUSES[sorted[0].id] || { name: 'Victory', color: '#f59e0b' };

  // Individual Grandmaster Champion
  // Grandmaster Tag
  ctx.fillStyle = '#eab308';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('👑 REIGNING SCHOOL GRANDMASTER · RANK #1 ON MASTER LADDER', cX + 150, cY + 65);

  // Champion Name & Accreditations
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 54px Georgia, serif';
  ctx.fillText(`${champ.name}`, cX + 150, cY + 130);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 36px sans-serif';
  const nameWidth = ctx.measureText(champ.name).width;
  ctx.fillText(`(${champHouse.name})`, cX + 175 + nameWidth, cY + 128);

  // Acclaim Quote
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'italic 26px sans-serif';
  ctx.fillText(
    '"Champion of the Board — Master tactician holding the #1 spot on the The History Portal Ladder!"',
    cX + 150,
    cY + 185,
  );

  // Champion Stats Box (Right Aligned)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(cX + cW - 420, cY + 30, 380, 180);
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(cX + cW - 420, cY + 30, 380, 180);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('TOTAL CLUB POINTS', cX + cW - 230, cY + 68);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px sans-serif';
  ctx.fillText(`${champPts} PTS`, cX + cW - 230, cY + 140);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(
    `${champ.won || 0}W · ${champ.drawn || 0}D · ${champLosses}L  (Elo ${champ.rating || 1000})`,
    cX + cW - 230,
    cY + 185,
  );
  ctx.textAlign = 'left';

  // 2. DRAW 4 HOUSE BOXES (Below Champion Card)
  const boxWidth = 410;
  const boxHeight = 440;
  const startX = 80;
  const gap = 40;
  const startY = 490;

  sorted.forEach((h, i) => {
    const x = startX + i * (boxWidth + gap);
    const house = HOUSES[h.id] || { name: h.id, color: '#999', ship: 'Ship' };

    // Card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.fillRect(x, startY, boxWidth, boxHeight);

    ctx.strokeStyle = i === 0 ? house.color : 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = i === 0 ? 5 : 2;
    ctx.strokeRect(x, startY, boxWidth, boxHeight);

    // Rank
    ctx.fillStyle = i === 0 ? '#fde047' : '#94a3b8';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      i === 0 ? '🏆 1ST PLACE' : i === 1 ? '2ND PLACE' : i === 2 ? '3RD PLACE' : '4TH PLACE',
      x + boxWidth / 2,
      startY + 55,
    );

    // House Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(house.name, x + boxWidth / 2, startY + 115);

    // Points
    ctx.fillStyle = house.color;
    ctx.font = 'bold 96px sans-serif';
    ctx.fillText(String(h.points), x + boxWidth / 2, startY + 235);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('HOUSE POINTS', x + boxWidth / 2, startY + 285);

    // Stats
    ctx.fillStyle = '#94a3b8';
    ctx.font = '26px sans-serif';
    ctx.fillText(`${h.wins}W · ${h.draws}D · ${h.losses}L`, x + boxWidth / 2, startY + 355);

    ctx.font = 'italic 20px sans-serif';
    ctx.fillText(house.ship || '', x + boxWidth / 2, startY + 400);
  });

  // Footer: Grandmaster Quote & Event Info
  const currentQuote =
    typeof window.getRandomHistoricalQuote === 'function'
      ? window.getRandomHistoricalQuote()
      : {
          quote: 'When you see a good move, look for a better one.',
          figure: 'Emanuel Lasker',
          era: 'World Champion 1894–1921',
        };

  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.fillRect(80, 950, 1760, 56);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(80, 950, 1760, 56);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('QUOTE OF THE WEEK:', 100, 986);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillText(`"${currentQuote.quote}" — ${currentQuote.figure} (${currentQuote.era})`, 330, 986);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('Thursdays Period 6 · GCSE History Hub', 1815, 986);

  // Download Trigger
  const link = document.createElement('a');
  link.download = 'history_chess_assembly_championship.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
};

// Friday Bulletin & Assembly Notice Generation
window.generateFridayBulletinText = function () {
  const houseTotals = calculateHouseTotals();
  const sortedHouses = Object.values(houseTotals).sort((a, b) => b.points - a.points);

  const playersByRank = [...chessState.players].sort(
    (a, b) => (b.points || 0) - (a.points || 0) || (b.rating || 1000) - (a.rating || 1000),
  );
  const leader = playersByRank[0];
  const leaderHouseName = leader ? HOUSES[leader.house]?.name || leader.house : '—';

  const h1 = sortedHouses[0]
    ? `${HOUSES[sortedHouses[0].id]?.name || 'Victory'} (${sortedHouses[0].points} pts)`
    : 'Victory (0 pts)';
  const h2 = sortedHouses[1]
    ? `${HOUSES[sortedHouses[1].id]?.name || 'Warrior'} (${sortedHouses[1].points} pts)`
    : 'Warrior (0 pts)';
  const h3 = sortedHouses[2]
    ? `${HOUSES[sortedHouses[2].id]?.name || 'Dreadnought'} (${sortedHouses[2].points} pts)`
    : 'Dreadnought (0 pts)';
  const h4 = sortedHouses[3]
    ? `${HOUSES[sortedHouses[3].id]?.name || 'Invincible'} (${sortedHouses[3].points} pts)`
    : 'Invincible (0 pts)';

  return `♟️ HISTORY REVISION HUB CHESS CLUB & HOUSE LEAGUE — FRIDAY BULLETIN ♟️\n🏆 House Championship Standings:\n   1st: ${h1}  ·  2nd: ${h2}  ·  3rd: ${h3}  ·  4th: ${h4}\n👑 Master Ladder Leader: ${leader ? `${leader.name} (${leaderHouseName} · Rating ${leader.rating || 1000})` : 'Autumn Season Underway'}\n⚔ Total Games Completed: ${chessState.matches.length} tournament matches logged this term\n📅 Next Club: Thursday Period 6 in the Senior Block History Room!`;
};

window.copyFridayBulletinNotice = function () {
  const text = window.generateFridayBulletinText();
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showChessToast('📋 Copied Friday Bulletin to clipboard!', 'success');
      })
      .catch(() => {});
  }
  window.openFridayBulletinModal(text);
};

window.openFridayBulletinModal = function (bulletinText) {
  const modalCont = getChessModalContainer();
  if (!modalCont) return;

  const text = bulletinText || window.generateFridayBulletinText();

  modalCont.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 20px;" onclick="if(event.target === this) window.closeChessModal();">
      <div style="background: #ffffff; border-radius: 14px; max-width: 560px; width: 100%; padding: 26px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); animation: zoomIn 0.2s ease-out; font-family: 'Outfit', sans-serif;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 10px;">
          <div>
            <h2 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #0f172a; display: flex; align-items: center; gap: 8px;">
              <span>📋</span> Friday Bulletin &amp; Morning Notices
            </h2>
            <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">
              Ready to paste directly into school staff briefings, daily notices, or house newsletters.
            </div>
          </div>
          <button onclick="window.closeChessModal()" style="background: none; border: none; font-size: 1.2rem; color: #64748b; cursor: pointer;">&times;</button>
        </div>

        <p style="font-size: 0.84rem; color: #475569; margin: 0 0 10px 0; line-height: 1.45;">
          This 4-line summary highlights the current House Trophy standings and top-ranked player.
        </p>

        <textarea id="bulletin-notice-text" readonly style="width: 100%; box-sizing: border-box; height: 160px; padding: 12px; font-family: 'Courier New', Courier, monospace; font-size: 0.82rem; line-height: 1.5; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #f8fafc; color: #0f172a; resize: none; margin-bottom: 16px;">${text}</textarea>

        <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span style="font-size: 0.78rem; color: #10b981; font-weight: 700;">✓ Automatically copied to clipboard</span>
          <div style="display: flex; gap: 8px;">
            <button type="button" onclick="const ta = document.getElementById('bulletin-notice-text'); if(ta){ ta.select(); document.execCommand('copy'); } window.showChessToast('📋 Copied again!', 'success');" style="background: #1c1917; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <span>📋</span> Copy to Clipboard
            </button>
            <button type="button" onclick="window.closeChessModal()" style="background: #e2e8f0; color: #334155; border: none; padding: 8px 14px; border-radius: 6px; font-weight: 700; font-size: 0.82rem; cursor: pointer;">
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
};

// End-of-Session Snapshot & Publishing System
window.openSnapshotExportModal = function () {
  const modalCont = getChessModalContainer();
  if (!modalCont) return;

  const playerCount = chessState.players.length;
  const matchCount = chessState.matches.length;
  const origin = window.location.origin;
  const pathname = window.location.pathname;

  const exportPayload = {
    v: 5,
    t: Date.now(),
    players: chessState.players,
    matches: chessState.matches,
    checkedInPlayerIds: chessState.checkedInPlayerIds,
    knockoutBracket: chessState.knockoutBracket,
  };
  const jsonStr = JSON.stringify(exportPayload);
  const b64 = btoa(encodeURIComponent(jsonStr));
  const syncUrl = `${origin}${pathname}?view=chess&chess_sync=${b64}#chess-club`;

  const codeSnippet = `// The History Portal Chess Club Official Snapshot (Updated ${new Date().toLocaleDateString('en-GB')})\nexport const INITIAL_PLAYERS = ${JSON.stringify(chessState.players, null, 2)};\n\nexport const INITIAL_MATCHES = ${JSON.stringify(chessState.matches, null, 2)};`;

  modalCont.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 20px;" onclick="if(event.target === this) window.closeChessModal();">
      <div style="background: #ffffff; border-radius: 14px; max-width: 640px; width: 100%; padding: 26px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); animation: zoomIn 0.2s ease-out; font-family: 'Outfit', sans-serif; max-height: 90vh; overflow-y: auto;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 10px;">
          <div>
            <h2 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 1.35rem; color: #0f172a; display: flex; align-items: center; gap: 8px;">
              <span>🌐</span> End-of-Session Snapshot &amp; Publishing
            </h2>
            <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">
              Share current standings with pupils and parents or bake into the live school website.
            </div>
          </div>
          <button onclick="window.closeChessModal()" style="background: none; border: none; font-size: 1.2rem; color: #64748b; cursor: pointer;">&times;</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
          
          <!-- Option A: 1-Click Pupil Sync URL -->
          <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 14px 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <div style="font-weight: 700; color: #0f172a; font-size: 0.95rem; font-family: 'Playfair Display', Georgia, serif;">
                🔗 Option A: 1-Click Pupil &amp; Parent Link
              </div>
              <span style="font-size: 0.72rem; font-weight: 700; background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 4px;">Zero Login Required</span>
            </div>
            <p style="margin: 0 0 10px 0; font-size: 0.8rem; color: #64748b; line-height: 1.45;">
              Copy this link and post it on Google Classroom, Microsoft Teams, or email. Anyone who opens it sees the live standings, ${playerCount} pupils, and ${matchCount} matches instantly!
            </p>
            <div style="display: flex; gap: 8px;">
              <input type="text" readonly value="${syncUrl}" style="flex: 1; padding: 7px 10px; border-radius: 4px; border: 1px solid #cbd5e1; font-family: monospace; font-size: 0.75rem; background: #ffffff;">
              <button type="button" onclick="navigator.clipboard.writeText('${syncUrl}').then(() => window.showChessToast('🔗 1-Click Sync Link copied!', 'success'));" style="background: #0284c7; color: #ffffff; border: none; padding: 7px 14px; border-radius: 4px; font-weight: 700; font-size: 0.78rem; cursor: pointer; white-space: nowrap;">
                Copy Link
              </button>
            </div>
          </div>

          <!-- Option B: Bake Snapshot into Website Code -->
          <div style="background: #fdf8f6; border: 1.5px solid #fdba74; border-radius: 8px; padding: 14px 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <div style="font-weight: 700; color: #9a3412; font-size: 0.95rem; font-family: 'Playfair Display', Georgia, serif;">
                ⚡ Option B: Permanent Git &amp; Live Hub Snapshot
              </div>
              <span style="font-size: 0.72rem; font-weight: 700; background: #ffedd5; color: #c2410c; padding: 2px 8px; border-radius: 4px;">Permanent Website Update</span>
            </div>
            <p style="margin: 0 0 10px 0; font-size: 0.8rem; color: #7c2d12; line-height: 1.45;">
              Click "Copy Code" and ask your AI assistant to update <code>chess_data.js</code>. Once committed, the live site permanently displays these standings to every pupil worldwide without needing local storage!
            </p>
            ${
              isAirgapModeActive()
                ? `
            <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 6px; padding: 8px 12px; margin-bottom: 10px; font-size: 0.76rem; color: #166534; display: flex; gap: 8px; align-items: center;">
              <span style="font-size: 1.1rem; line-height: 1;">🛡️</span>
              <span><strong>Airgap Mode Active:</strong> Pupil names typed on this school laptop are protected by GDPR. Do not commit actual pupil names to public GitHub code.</span>
            </div>
            `
                : ''
            }
            <textarea id="snapshot-code-snippet" readonly style="width: 100%; box-sizing: border-box; height: 95px; padding: 8px; font-family: 'Courier New', monospace; font-size: 0.72rem; border: 1px solid #fed7aa; border-radius: 4px; background: #fffaf0; color: #431407; resize: none; margin-bottom: 8px;">${codeSnippet}</textarea>
            <button type="button" onclick="const el = document.getElementById('snapshot-code-snippet'); if(el){ el.select(); document.execCommand('copy'); } window.showChessToast('📋 Snapshot code copied to clipboard!', 'success');" style="background: #ea580c; color: #ffffff; border: none; padding: 7px 16px; border-radius: 4px; font-weight: 700; font-size: 0.78rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <span>📋</span> Copy Code Snippet for Git
            </button>
          </div>

          <!-- Option C: Download Offline JSON Backup -->
          <div style="background: #faf8f5; border: 1px solid #d6d3d1; border-radius: 8px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; gap: 12px;">
            <div>
              <div style="font-weight: 700; color: #1c1917; font-size: 0.92rem; font-family: 'Playfair Display', Georgia, serif;">
                💾 Option C: Download Offline Snapshot (.json)
              </div>
              <div style="font-size: 0.76rem; color: #78716c; margin-top: 2px;">
                Download a timestamped snapshot backup to your tablet for offline records.
              </div>
            </div>
            <button type="button" onclick="window.downloadChessBackupJSON();" style="background: #1c1917; color: #ffffff; border: none; padding: 7px 14px; border-radius: 4px; font-weight: 700; font-size: 0.78rem; cursor: pointer; flex-shrink: 0;">
              DOWNLOAD JSON
            </button>
          </div>

        </div>

        <div style="display: flex; justify-content: flex-end; border-top: 1.5px solid #e2e8f0; padding-top: 12px;">
          <button type="button" onclick="window.closeChessModal()" style="background: #e2e8f0; color: #334155; border: none; padding: 8px 18px; border-radius: 6px; font-weight: 700; font-size: 0.82rem; cursor: pointer;">
            Close
          </button>
        </div>

      </div>
    </div>
  `;
};

// Modal Handling: Data Vault & Backup Tools
window.openDataVaultModal = function () {
  const modalCont = getChessModalContainer();
  if (!modalCont) return;

  const playerCount = chessState.players.length;
  const matchCount = chessState.matches.length;
  const backup = getBackupInfo();

  modalCont.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 20px;" onclick="if(event.target === this) window.closeChessModal();">
      <div style="background: #ffffff; border-radius: 14px; max-width: 580px; width: 100%; padding: 26px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); animation: zoomIn 0.2s ease-out; font-family: 'Outfit', sans-serif;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 10px;">
          <div>
            <h2 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 1.35rem; color: #0f172a; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-vault" style="color: #2563eb;"></i> Data Vault &amp; Club Safety Backup
            </h2>
            <div style="font-size: 0.82rem; color: #64748b;">Guaranteed zero data loss across terms, devices, and browser updates.</div>
          </div>
          <button onclick="window.closeChessModal()" style="background: none; border: none; font-size: 1.2rem; color: #64748b; cursor: pointer;">&times;</button>
        </div>

        <div style="background: #faf8f5; border: 1.5px solid #d6d3d1; border-radius: 8px; padding: 14px 16px; margin-bottom: 18px; font-size: 0.86rem; color: #1c1917; line-height: 1.45;">
          <strong>🛡️ Multi-Layer Redundancy Active:</strong> All changes are mirrored across <strong>localStorage</strong>, <strong>IndexedDB</strong>, and an immutable <strong>Master Archive</strong>.
        </div>

        <!-- Section: Cross-Device Instant Sync Key -->
        <div style="background: #f5f2eb; border: 1.5px solid #44403c; border-radius: 8px; padding: 16px; margin-bottom: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 1.05rem; color: #1c1917;">
              🔑 Cross-Device Instant Sync Key
            </div>
            <span style="font-family: monospace; font-size: 0.7rem; background: #1c1917; color: #fafaf9; padding: 2px 6px; border-radius: 3px;">School ↔ Home ↔ iPad</span>
          </div>
          <p style="margin: 0 0 12px 0; font-size: 0.8rem; color: #57534e; line-height: 1.45;">
            Switching between your school laptop, home laptop, or iPad? Use this key to transfer your entire club roster, ratings, and match history in 2 seconds without accounts or logins.
          </p>

          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;">
            <button type="button" onclick="window.copySyncKey()" style="background: #1c1917; color: #fafaf9; border: 1px solid #1c1917; padding: 8px 14px; border-radius: 4px; font-size: 0.78rem; font-weight: 700; font-family: monospace; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <span>📋</span> Copy My Sync Key
            </button>
            <button type="button" onclick="window.copySyncLink()" style="background: #ffffff; color: #1c1917; border: 1.5px solid #44403c; padding: 8px 14px; border-radius: 4px; font-size: 0.78rem; font-weight: 700; font-family: monospace; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <span>🔗</span> Copy 1-Click Sync Link
            </button>
          </div>

          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <input type="text" id="vault-sync-key-input" placeholder="Paste Sync Key here on this device (e.g. HISTORY-CHESS:...)" style="flex: 1; padding: 8px 10px; border-radius: 4px; border: 1px solid #d6d3d1; font-family: monospace; font-size: 0.78rem; background: #ffffff;">
            <button type="button" onclick="window.applySyncKey()" style="background: #292524; color: #d4af37; border: 1px solid #44403c; padding: 8px 14px; border-radius: 4px; font-weight: 700; font-size: 0.78rem; font-family: monospace; cursor: pointer;">
              ⚡ SYNC NOW
            </button>
          </div>
        </div>

        <!-- 4 Action Cards -->
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
          
          <!-- Tool 1: Download JSON Backup -->
          <div style="background: #faf8f5; border: 1px solid #d6d3d1; border-radius: 8px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
            <div>
              <div style="font-weight: 700; color: #1c1917; font-size: 0.92rem; font-family: 'Playfair Display', serif;">
                Download Backup File (.json)
              </div>
              <div style="font-size: 0.76rem; color: #78716c; margin-top: 2px;">
                Saves current cohort (${playerCount} pupils, ${matchCount} matches) to your device.
              </div>
            </div>
            <button onclick="window.downloadChessBackupJSON()" style="background: #1c1917; color: #ffffff; border: none; padding: 7px 14px; border-radius: 4px; font-weight: 700; font-size: 0.78rem; cursor: pointer; flex-shrink: 0; font-family: monospace;">
              DOWNLOAD
            </button>
          </div>

          <!-- Tool 2: Restore from JSON File -->
          <div style="background: #faf8f5; border: 1px solid #d6d3d1; border-radius: 8px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
            <div>
              <div style="font-weight: 700; color: #1c1917; font-size: 0.92rem; font-family: 'Playfair Display', serif;">
                Restore from Backup File
              </div>
              <div style="font-size: 0.76rem; color: #78716c; margin-top: 2px;">
                Upload any previously downloaded .json backup file to restore in 1 second.
              </div>
            </div>
            <label style="background: #ffffff; color: #1c1917; border: 1px solid #44403c; padding: 7px 14px; border-radius: 4px; font-weight: 700; font-size: 0.78rem; cursor: pointer; flex-shrink: 0; font-family: monospace;">
              UPLOAD FILE
              <input type="file" accept=".json" onchange="window.handleRestoreBackupFile(event)" style="display: none;">
            </label>
          </div>

          <!-- Tool 3: Copy Code for Permanent Git Bake-In -->
          <div style="background: #faf8f5; border: 1px solid #d6d3d1; border-radius: 8px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
            <div>
              <div style="font-weight: 700; color: #1c1917; font-size: 0.92rem; font-family: 'Playfair Display', serif;">
                Copy Roster Code for Git
              </div>
              <div style="font-size: 0.76rem; color: #78716c; margin-top: 2px;">
                Copies code to clipboard so you can send it to me to bake into Git forever.
              </div>
            </div>
            <button onclick="window.copyRosterCodeToClipboard()" style="background: #292524; color: #fafaf9; border: 1px solid #44403c; padding: 7px 14px; border-radius: 4px; font-weight: 700; font-size: 0.78rem; cursor: pointer; flex-shrink: 0; font-family: monospace;">
              COPY CODE
            </button>
          </div>

          <!-- Tool 4: Printable Paper Scoresheet -->
          <div style="background: #faf8f5; border: 1px solid #d6d3d1; border-radius: 8px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
            <div>
              <div style="font-weight: 700; color: #1c1917; font-size: 0.92rem; font-family: 'Playfair Display', serif;">
                Printable Weekly Scoresheet (A4)
              </div>
              <div style="font-size: 0.76rem; color: #78716c; margin-top: 2px;">
                Print a physical paper roster and score logging grid for your classroom clipboard.
              </div>
            </div>
            <button onclick="window.printWeeklyChessSheet()" style="background: #57534e; color: #ffffff; border: none; padding: 7px 14px; border-radius: 4px; font-weight: 700; font-size: 0.78rem; cursor: pointer; flex-shrink: 0; font-family: monospace;">
              PRINT A4
            </button>
          </div>

        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1.5px solid #e7e2d7; padding-top: 14px;">
          <button type="button" onclick="window.closeChessModal()" style="background: #e7e2d7; color: #1c1917; border: 1px solid #d6d3d1; padding: 8px 18px; border-radius: 4px; font-weight: 700; font-family: monospace; font-size: 0.8rem; cursor: pointer;">CLOSE</button>
        </div>

      </div>
    </div>
  `;
};

function buildFullSyncExportPayload() {
  let localNames = {};
  try {
    const raw = localStorage.getItem('chess_local_roster_names');
    if (raw) localNames = JSON.parse(raw);
  } catch (e) {}

  return {
    v: 6,
    t: Date.now(),
    players: chessState.players,
    matches: chessState.matches,
    checkedInPlayerIds: chessState.checkedInPlayerIds,
    activePairings: chessState.activePairings || [],
    knockoutBracket: chessState.knockoutBracket,
    clubModes: chessState.clubModes
      ? { ...chessState.clubModes, tvFullscreen: false, chaosSpinning: false }
      : null,
    realNames: localNames,
  };
}

// 1-Click Tournament Save & Next-Week Resume Modal (Accessible directly from Tournament Cup & Full Screen TV)
window.openTournamentSaveModal = function () {
  const modalCont = getChessModalContainer();
  if (!modalCont) return;

  let currentCode = '';
  try {
    const jsonStr = JSON.stringify(buildFullSyncExportPayload());
    currentCode = `HISTORY-CHESS:${btoa(encodeURIComponent(jsonStr))}`;
  } catch (e) {}

  const hasBracket = Boolean(chessState.knockoutBracket);
  const playerCount = chessState.players.length;
  const matchCount = chessState.matches.length;

  modalCont.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.82); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 18px;" onclick="if(event.target === this) window.closeChessModal();">
      <div style="background: #ffffff; border-radius: 14px; max-width: 600px; width: 100%; max-height: 92vh; overflow-y: auto; padding: 24px 26px; box-shadow: 0 24px 48px rgba(0,0,0,0.35); font-family: 'Outfit', sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 14px;">
          <div>
            <h2 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 1.35rem; color: #0f172a;">
              💾 Save &amp; Resume Tournament Next Week
            </h2>
            <div style="font-size: 0.82rem; color: #64748b; margin-top: 3px;">
              Keep your exact Cup, Challenger Plate, Wooden Spoon, Rapid games &amp; House points safe!
            </div>
          </div>
          <button type="button" onclick="window.closeChessModal()" style="background: none; border: none; font-size: 1.35rem; color: #64748b; cursor: pointer;">&times;</button>
        </div>

        <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; font-size: 0.82rem; color: #166534; line-height: 1.45;">
          <strong>✓ Auto-Save Active on This Browser:</strong> Your progress (${playerCount} pupils, ${matchCount} matches${hasBracket ? ', live Tournament Bracket' : ''}) saves automatically in this browser. <strong>However</strong>, school PCs &amp; TV boards often wipe browser data overnight — so copy the Save Code below into an email/Word doc to yourself just in case!
        </div>

        <!-- Step 1: Copy Progress for Next Week -->
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 14px 16px; margin-bottom: 14px;">
          <div style="font-weight: 800; font-size: 0.92rem; color: #0f172a; margin-bottom: 6px;">
            1. Copy Today's Progress (End of Session)
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
            <button type="button" onclick="window.copySyncKey()" style="background: #0284c7; color: #ffffff; border: none; padding: 9px 16px; border-radius: 6px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              📋 Copy Progress Code
            </button>
            <button type="button" onclick="window.copySyncLink()" style="background: #ffffff; color: #0f172a; border: 1.5px solid #94a3b8; padding: 9px 14px; border-radius: 6px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              🔗 Copy 1-Click Resume Link
            </button>
            <button type="button" onclick="window.downloadChessBackupJSON()" style="background: #1e293b; color: #ffffff; border: none; padding: 9px 14px; border-radius: 6px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              📥 Download Save File (.json)
            </button>
          </div>
          <textarea readonly onclick="this.select()" style="width: 100%; height: 54px; padding: 6px 8px; border-radius: 6px; border: 1px solid #cbd5e1; background: #ffffff; font-family: monospace; font-size: 0.7rem; color: #475569; resize: none;" title="Tap to select all">${currentCode}</textarea>
        </div>

        <!-- Step 2: Paste Progress Next Week -->
        <div style="background: #fffbeb; border: 1.5px solid #fcd34d; border-radius: 10px; padding: 14px 16px; margin-bottom: 14px;">
          <div style="font-weight: 800; font-size: 0.92rem; color: #78350f; margin-bottom: 6px;">
            2. Paste Saved Progress (Start of Next Week)
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <input type="text" id="vault-sync-key-input" placeholder="Paste your HISTORY-CHESS:... code or link here" style="flex: 1; min-width: 220px; padding: 9px 11px; border-radius: 6px; border: 1.5px solid #fbbf24; font-family: monospace; font-size: 0.8rem; background: #ffffff;">
            <button type="button" onclick="window.applySyncKey()" style="background: #d97706; color: #ffffff; border: none; padding: 9px 16px; border-radius: 6px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">
              ⚡ Load Progress
            </button>
          </div>
          <div style="margin-top: 8px; font-size: 0.76rem; color: #92400e; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px;">
            <span>Or upload a downloaded <code>.json</code> save file:</span>
            <label style="background: #ffffff; color: #78350f; border: 1px solid #d97706; padding: 4px 10px; border-radius: 5px; font-weight: 800; font-size: 0.74rem; cursor: pointer;">
              📂 Upload .json File
              <input type="file" accept=".json" onchange="window.handleRestoreBackupFile(event)" style="display: none;">
            </label>
          </div>
        </div>

        <div style="text-align: right;">
          <button type="button" onclick="window.closeChessModal()" style="background: #e2e8f0; color: #0f172a; border: none; padding: 8px 18px; border-radius: 6px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">Done</button>
        </div>
      </div>
    </div>
  `;
};

// Cross-Device Instant Sync Key Tools
window.copySyncKey = function () {
  const exportPayload = buildFullSyncExportPayload();
  try {
    const jsonStr = JSON.stringify(exportPayload);
    const b64 = btoa(encodeURIComponent(jsonStr));
    const syncKey = `HISTORY-CHESS:${b64}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(syncKey)
        .then(() => {
          showChessToast(
            '📋 Tournament Save Code copied! Paste it into an email/note for next week.',
            'success',
          );
        })
        .catch(() => {
          prompt('Copy your Tournament Save Code below:', syncKey);
        });
    } else {
      prompt('Copy your Tournament Save Code below:', syncKey);
    }
  } catch (err) {
    console.error('Failed to generate Sync Key:', err);
    showChessToast('Failed to generate Save Code.', 'error');
  }
};

window.copySyncLink = function () {
  const exportPayload = buildFullSyncExportPayload();
  try {
    const jsonStr = JSON.stringify(exportPayload);
    const b64 = btoa(encodeURIComponent(jsonStr));
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const syncUrl = `${origin}${pathname}?chess_sync=${b64}#chess`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(syncUrl)
        .then(() => {
          showChessToast(
            '🔗 1-Click Resume Link copied! Open this link next week to restore everything.',
            'success',
          );
        })
        .catch(() => {
          prompt('Copy your 1-Click Resume Link below:', syncUrl);
        });
    } else {
      prompt('Copy your 1-Click Resume Link below:', syncUrl);
    }
  } catch (err) {
    console.error('Failed to generate 1-Click Sync Link:', err);
    showChessToast('Failed to generate 1-Click Resume Link.', 'error');
  }
};

window.applySyncKey = function () {
  const input = document.getElementById('vault-sync-key-input');
  if (!input || !input.value.trim()) {
    showChessToast('Please paste your saved code or link into the box first.', 'warning');
    return;
  }
  let raw = input.value.trim();
  // Support pasting either a full ?chess_sync= URL OR a HISTORY-CHESS:... string
  if (raw.includes('chess_sync=')) {
    try {
      const qPart = raw.split('chess_sync=')[1] || '';
      raw = qPart.split(/[&#]/)[0].trim();
    } catch (e) {}
  }
  raw = raw.replace(/^(?:HISTORY-CHESS|CHESS-SYNC):/i, '');
  try {
    const jsonStr = decodeURIComponent(atob(raw));
    const syncData = JSON.parse(jsonStr);
    if (!Array.isArray(syncData.players)) {
      showChessToast('Invalid Save Code: missing player records.', 'error');
      return;
    }
    pushChessUndoSnapshot('Before Loading Saved Progress');
    if (syncData.realNames && typeof syncData.realNames === 'object') {
      try {
        localStorage.setItem('chess_local_roster_names', JSON.stringify(syncData.realNames));
      } catch (e) {}
    }
    chessState.players = syncData.players;
    chessState.matches = Array.isArray(syncData.matches) ? syncData.matches : [];
    chessState.checkedInPlayerIds = Array.isArray(syncData.checkedInPlayerIds)
      ? syncData.checkedInPlayerIds
      : [];
    chessState.activePairings = Array.isArray(syncData.activePairings)
      ? syncData.activePairings
      : [];
    chessState.knockoutBracket = syncData.knockoutBracket || null;
    if (syncData.clubModes && typeof syncData.clubModes === 'object') {
      chessState.clubModes = {
        ...createDefaultClubModesState(),
        ...syncData.clubModes,
        tvFullscreen: false,
      };
    }
    hydratePlayerRealNames(chessState.players);
    if (Array.isArray(chessState.matches)) {
      chessState.matches.forEach((m) => {
        if (CALLSIGN_TO_FIRST_NAME[m.white]) m.white = CALLSIGN_TO_FIRST_NAME[m.white];
        if (CALLSIGN_TO_FIRST_NAME[m.black]) m.black = CALLSIGN_TO_FIRST_NAME[m.black];
      });
    }
    if (chessState.knockoutBracket) {
      reconcileKnockoutProgression(chessState.knockoutBracket);
      chessState.activeTab = 'knockout';
    }
    autoSortPlayersByPoints();
    saveChessState(true);
    window.closeChessModal();
    renderChessHubView();
    showChessToast(
      `🎉 Restored ${chessState.players.length} pupils, ${chessState.matches.length} matches${chessState.knockoutBracket ? ' & live Tournament Bracket' : ''}!`,
      'success',
    );
  } catch (err) {
    console.error('Failed to apply Sync Key:', err);
    showChessToast(
      'Could not read Save Code. Please check that you copied the entire code.',
      'error',
    );
  }
};

window.downloadChessBackupJSON = function () {
  hydratePlayerRealNames(chessState.players);
  if (Array.isArray(chessState.matches)) {
    chessState.matches.forEach((m) => {
      if (CALLSIGN_TO_FIRST_NAME[m.white]) m.white = CALLSIGN_TO_FIRST_NAME[m.white];
      if (CALLSIGN_TO_FIRST_NAME[m.black]) m.black = CALLSIGN_TO_FIRST_NAME[m.black];
    });
  }

  let localNames = {};
  try {
    const raw = localStorage.getItem('chess_local_roster_names');
    if (raw) localNames = JSON.parse(raw);
  } catch (e) {}

  const backup = {
    app: 'The History Portal Chess Club',
    exportedAt: new Date().toISOString(),
    playerCount: chessState.players.length,
    matchCount: chessState.matches.length,
    state: {
      players: chessState.players,
      matches: chessState.matches,
      checkedInPlayerIds: chessState.checkedInPlayerIds,
      knockoutBracket: chessState.knockoutBracket,
      realNames: localNames,
    },
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const d = new Date();
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  a.href = url;
  a.download = `history_chess_backup_${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showChessToast('💾 Backup file downloaded successfully!', 'success');
};

window.handleRestoreBackupFile = function (e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = JSON.parse(evt.target.result);
      const incomingState = data.state || data;
      if (!Array.isArray(incomingState.players)) {
        showChessToast('Invalid backup file: missing players array.', 'error');
        return;
      }
      chessState.players = incomingState.players;
      chessState.matches = Array.isArray(incomingState.matches) ? incomingState.matches : [];
      chessState.checkedInPlayerIds = Array.isArray(incomingState.checkedInPlayerIds)
        ? incomingState.checkedInPlayerIds
        : [];
      chessState.knockoutBracket = incomingState.knockoutBracket || null;
      if (incomingState.realNames && typeof incomingState.realNames === 'object') {
        try {
          localStorage.setItem('chess_local_roster_names', JSON.stringify(incomingState.realNames));
        } catch (e) {}
      }
      hydratePlayerRealNames(chessState.players);
      if (Array.isArray(chessState.matches)) {
        chessState.matches.forEach((m) => {
          if (CALLSIGN_TO_FIRST_NAME[m.white]) m.white = CALLSIGN_TO_FIRST_NAME[m.white];
          if (CALLSIGN_TO_FIRST_NAME[m.black]) m.black = CALLSIGN_TO_FIRST_NAME[m.black];
        });
      }
      saveChessState();
      window.closeChessModal();
      renderChessHubView();
      showChessToast(
        `🎉 Restored ${chessState.players.length} pupils and ${chessState.matches.length} matches!`,
        'success',
      );
    } catch (err) {
      console.error('Failed to parse backup JSON:', err);
      showChessToast('Failed to parse backup file.', 'error');
    }
  };
  reader.readAsText(file);
};

window.copyRosterCodeToClipboard = function () {
  if (chessState.players.length === 0) {
    showChessToast('No pupils to copy yet. Register your pupils first.', 'warning');
    return;
  }
  const cleanPlayers = chessState.players.map((p) => ({
    id: p.id,
    name: p.name,
    house: p.house,
    rating: p.rating || 1000,
    games: p.games || 0,
    won: p.won || 0,
    drawn: p.drawn || 0,
    lost: p.lost || 0,
    rank: p.rank || 1,
  }));
  const code = `export const INITIAL_PLAYERS = ${JSON.stringify(cleanPlayers, null, 2)};\n`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        showChessToast(
          '📋 Roster code copied! Send it to the developer to bake into Git.',
          'success',
        );
      })
      .catch(() => {
        prompt('Copy the roster code below:', code);
      });
  } else {
    prompt('Copy the roster code below:', code);
  }
};

window.printWeeklyChessSheet = function () {
  const sorted = [...chessState.players].sort((a, b) => a.rank - b.rank);
  const houseTotals = calculateHouseTotals();
  const sortedHouses = Object.values(houseTotals).sort((a, b) => b.points - a.points);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to view the printable sheet.');
    return;
  }

  const d = new Date();
  const dateFormatted = d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  let rowsHtml = sorted
    .map(
      (p) => `
    <tr>
      <td style="text-align: center; font-weight: bold;">${p.rank}</td>
      <td style="font-weight: 600;">${p.name}${p.realName ? ` <span style="font-size: 0.85em; color: #64748b; font-weight: normal;">(${p.realName})</span>` : ''}</td>
      <td style="text-align: center;"></td>
      <td style="text-align: center; text-transform: uppercase; font-size: 11px; font-weight: bold; color: ${HOUSES[p.house]?.color || '#333'};">${HOUSES[p.house]?.name || p.house}</td>
      <td style="text-align: center; width: 60px;">[ &nbsp; ]</td>
      <td style="text-align: center;">${p.games}</td>
      <td style="text-align: center;">${p.won}W / ${p.drawn}D / ${p.lost}L</td>
      <td style="text-align: center; font-weight: bold;">${p.won * 3 + p.drawn * 2 + p.lost * 1} pts</td>
      <td style="width: 140px; border-bottom: 1px solid #ccc;">&nbsp;</td>
    </tr>
  `,
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>The History Portal Chess Club - Period 6 Roster (${dateFormatted})</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 24px; color: #1e293b; }
        h1 { margin: 0 0 4px 0; font-size: 20px; text-transform: uppercase; letter-spacing: 0.05em; }
        .meta { font-size: 12px; color: #64748b; margin-bottom: 16px; display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 8px; }
        .standings { display: flex; gap: 12px; margin-bottom: 16px; }
        .house-box { flex: 1; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px; text-align: center; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #cbd5e1; padding: 6px 8px; }
        th { background: #f1f5f9; font-weight: 700; text-transform: uppercase; font-size: 10px; }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1>The History Portal · Period 6 Chess Club</h1>
        <button onclick="window.print()" style="padding: 6px 14px; background: #2563eb; color: #fff; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Print Sheet</button>
      </div>
      <div class="meta">
        <span>Session Date: <strong>${dateFormatted} (Thursday Period 6)</strong></span>
        <span>Scoring: <strong>Win = +3 pts | Draw = +2 pts | Loss/Playing = +1 pt</strong></span>
      </div>

      <div class="standings">
        ${sortedHouses
          .map(
            (h) => `
          <div class="house-box">
            <div style="font-size: 10px; font-weight: bold; color: ${HOUSES[h.id].color}; text-transform: uppercase;">${HOUSES[h.id].name}</div>
            <div style="font-size: 16px; font-weight: bold;">${h.points} pts</div>
            <div style="font-size: 10px; color: #64748b;">${h.wins}W · ${h.draws}D · ${h.losses}L</div>
          </div>
        `,
          )
          .join('')}
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 35px;">Rank</th>
            <th>Pupil Name</th>
            
            <th style="width: 90px;">House</th>
            <th>Present</th>
            <th style="width: 50px;">Played</th>
            <th style="width: 90px;">Record</th>
            <th style="width: 70px;">Points</th>
            <th>Today's Result / Notes</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="9" style="text-align: center; padding: 20px;">No registered pupils yet.</td></tr>'}
        </tbody>
      </table>
    </body>
    </html>
  `);
  printWindow.document.close();
};

window.printFidePairingSheet = function () {
  let pairings = chessState.activePairings;

  // If no pairings generated yet, build them on the fly
  if (!pairings || pairings.length === 0) {
    const presentIds = chessState.checkedInPlayerIds;
    let pool = chessState.players
      .filter((p) => (presentIds.length > 0 ? presentIds.includes(p.id) : true))
      .sort((a, b) => b.rating - a.rating);

    if (pool.length < 2) {
      showChessToast(
        'Please register or check in at least 2 pupils to generate a FIDE pairing sheet.',
        'warning',
      );
      return;
    }

    pairings = [];
    const tempPool = [...pool];
    while (tempPool.length >= 2) {
      const white = tempPool.shift();
      let bestOpponentIdx = 0;
      for (let i = 0; i < tempPool.length; i++) {
        if (tempPool[i].house !== white.house) {
          bestOpponentIdx = i;
          break;
        }
      }
      const black = tempPool.splice(bestOpponentIdx, 1)[0];
      pairings.push({
        board: pairings.length + 1,
        white,
        black,
      });
    }
    if (tempPool.length === 1) {
      pairings.push({
        board: pairings.length + 1,
        white: tempPool[0],
        black: null,
        isBye: true,
      });
    }
    chessState.activePairings = pairings;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to view the printable sheet.');
    return;
  }

  const d = new Date();
  const dateFormatted = d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const houseTotals = calculateHouseTotals();
  const sortedHouses = Object.values(houseTotals).sort((a, b) => b.points - a.points);
  const totalPlayersCount = pairings.reduce((acc, p) => acc + (p.isBye ? 1 : 2), 0);

  const rowsHtml = pairings
    .map((p) => {
      const whiteName = CALLSIGN_TO_FIRST_NAME[p.white?.name] || p.white?.realName || p.white?.name;
      const blackName = p.black
        ? CALLSIGN_TO_FIRST_NAME[p.black.name] || p.black.realName || p.black.name
        : '';
      if (p.isBye) {
        return `
        <tr style="background: #f8fafc;">
          <td style="text-align: center; font-weight: 900; font-size: 13px;">Board ${p.board}</td>
          <td style="font-weight: 700; font-size: 13px; color: #0f172a;">
            ♔ ${whiteName} 
            <div style="font-size: 10px; color: ${HOUSES[p.white.house]?.color || '#333'}; font-weight: 800; text-transform: uppercase;">
              ${HOUSES[p.white.house]?.name || p.white.house} · ELO ${p.white.rating}
            </div>
          </td>
          <td style="text-align: center; font-weight: 800; font-size: 13px; background: #e2e8f0; width: 45px;">BYE</td>
          <td style="text-align: center; font-weight: 700; font-size: 11px; color: #94a3b8; width: 30px;">—</td>
          <td style="text-align: center; font-weight: 700; font-size: 11px; color: #94a3b8; width: 45px;">—</td>
          <td style="font-size: 12px; color: #64748b; font-style: italic;">Assigned Practice Bye (+1 Pt)</td>
          <td style="text-align: center; font-size: 11px; color: #94a3b8;">N/A</td>
        </tr>
      `;
      }

      const wH = HOUSES[p.white.house];
      const bH = HOUSES[p.black.house];

      return `
      <tr>
        <td style="text-align: center; font-weight: 900; font-size: 14px; background: #fafafa;">
          Board ${p.board}
        </td>
        <td>
          <div style="font-weight: 700; font-size: 13px; color: #0f172a;">
            ♔ ${whiteName} 
          </div>
          <div style="font-size: 10px; font-weight: 800; color: ${wH?.color || '#333'}; text-transform: uppercase;">
            ${wH?.name || p.white.house} House · ELO ${p.white.rating}
          </div>
        </td>
        <td style="text-align: center; width: 55px; height: 38px; border: 1.5px solid #0f172a; font-size: 14px; font-weight: 800;">
          &nbsp;
        </td>
        <td style="text-align: center; font-weight: 800; font-size: 11px; color: #64748b; width: 30px;">
          VS
        </td>
        <td style="text-align: center; width: 55px; height: 38px; border: 1.5px solid #0f172a; font-size: 14px; font-weight: 800;">
          &nbsp;
        </td>
        <td>
          <div style="font-weight: 700; font-size: 13px; color: #0f172a;">
            ♚ ${blackName} 
          </div>
          <div style="font-size: 10px; font-weight: 800; color: ${bH?.color || '#333'}; text-transform: uppercase;">
            ${bH?.name || p.black.house} House · ELO ${p.black.rating}
          </div>
        </td>
        <td style="width: 170px; font-size: 10px; color: #94a3b8; vertical-align: bottom; padding-bottom: 4px;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #94a3b8; height: 18px; margin-bottom: 3px;">
            <span style="font-size: 9px; font-weight: bold; color: #475569;">W:</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #94a3b8; height: 18px;">
            <span style="font-size: 9px; font-weight: bold; color: #475569;">B:</span>
          </div>
        </td>
      </tr>
    `;
    })
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>The History Portal Chess Club - FIDE Round Pairing Sheet (${dateFormatted})</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 10mm 12mm;
        }
        * { box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          margin: 0;
          padding: 10px;
          color: #0f172a;
          background: #ffffff;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2.5px solid #0f172a;
          padding-bottom: 8px;
          margin-bottom: 12px;
        }
        h1 {
          margin: 0;
          font-size: 19px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 900;
        }
        .subtitle {
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 8px 12px;
          margin-bottom: 12px;
          font-size: 11px;
        }
        .meta-item strong {
          display: block;
          font-size: 9px;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 1px;
        }
        .house-strip {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .house-badge {
          flex: 1;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 4px 6px;
          text-align: center;
          font-size: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        th, td {
          border: 1px solid #94a3b8;
          padding: 6px 8px;
        }
        th {
          background: #f1f5f9;
          font-weight: 800;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.03em;
        }
        .instructions {
          margin-top: 12px;
          border-top: 1.5px solid #0f172a;
          padding-top: 8px;
          font-size: 10px;
          color: #475569;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .signoff-box {
          border: 1px solid #94a3b8;
          border-radius: 4px;
          padding: 6px 12px;
          width: 250px;
          background: #fafafa;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; background: #eff6ff; border: 1px solid #bfdbfe; padding: 10px 14px; border-radius: 6px;">
        <div>
          <strong style="color: #1e40af;">FIDE Pairing Sheet Preview</strong>
          <div style="font-size: 12px; color: #3b82f6;">Ready for A4 printout or pinning to the classroom whiteboard.</div>
        </div>
        <button onclick="window.print()" style="background: #2563eb; color: #ffffff; border: none; font-weight: bold; font-size: 13px; padding: 8px 18px; border-radius: 4px; cursor: pointer;">
          🖨 Print A4 Sheet
        </button>
      </div>

      <div class="header">
        <div>
          <h1>The History Portal Chess Club</h1>
          <div class="subtitle">Official FIDE-Style Round Pairing &amp; Results Sheet</div>
        </div>
        <div style="text-align: right; font-size: 11px; font-weight: 700; color: #334155;">
          <div>Session: Period 6 (15:30 - 16:30)</div>
          <div style="color: #64748b;">${dateFormatted}</div>
        </div>
      </div>

      <div class="meta-grid">
        <div class="meta-item">
          <strong>Event / Time Control</strong>
          15-Min Rapid · Swiss Ladder
        </div>
        <div class="meta-item">
          <strong>Scoring Standard</strong>
          Win = 1 (3 pts) · Draw = ½ (2 pts) · Loss = 0 (1 pt)
        </div>
        <div class="meta-item">
          <strong>Active Boards</strong>
          ${pairings.filter((p) => !p.isBye).length} Boards (${totalPlayersCount} Players)
        </div>
        <div class="meta-item">
          <strong>Chief Arbiter</strong>
          Teacher in Charge
        </div>
      </div>

      <div class="house-strip">
        ${sortedHouses
          .map(
            (h) => `
          <div class="house-badge">
            <strong style="color: ${HOUSES[h.id]?.color || '#333'}; text-transform: uppercase;">${HOUSES[h.id]?.name || h.id}</strong>
            <span style="font-weight: 800; margin-left: 4px;">${h.points} pts</span>
            <span style="color: #64748b; font-size: 9px; margin-left: 2px;">(${h.wins}W / ${h.draws}D / ${h.losses}L)</span>
          </div>
        `,
          )
          .join('')}
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 70px; text-align: center;">Board</th>
            <th>White Player (♔)</th>
            <th style="width: 55px; text-align: center;">White</th>
            <th style="width: 30px; text-align: center;">vs</th>
            <th style="width: 55px; text-align: center;">Black</th>
            <th>Black Player (♚)</th>
            <th style="width: 170px;">Pupil Signatures</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="instructions">
        <div style="max-width: 520px; line-height: 1.4;">
          <strong>Instructions for Players:</strong><br>
          1. Check your board number and locate your assigned chessboard in the room.<br>
          2. White moves first. Shake hands before beginning the clock or timer.<br>
          3. When your game concludes, agree on the result (1-0, 0-1, or ½-½), enter the scores in the boxes above, sign your name, and report the result to the Arbiter.
        </div>
        <div class="signoff-box">
          <div style="font-weight: bold; font-size: 9px; text-transform: uppercase; margin-bottom: 12px; color: #475569;">Arbiter Verification &amp; Sign-Off</div>
          <div style="font-size: 9px; color: #64748b; margin-top: 14px; border-top: 1px solid #cbd5e1; padding-top: 2px;">
            Teacher Signature / Date
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
};

// Modal Handling: Register Pupil
function getUnusedApprovedCallsigns() {
  const used = new Set(
    (chessState.players || []).map((p) => String(p.name || '').trim().toLowerCase()),
  );
  (chessState.pendingJoinRequests || []).forEach((r) => {
    if (r && r.callsign) used.add(String(r.callsign).trim().toLowerCase());
  });
  return (APPROVED_CHESS_CALLSIGNS || []).filter((cs) => !used.has(cs.toLowerCase()));
}

window.pickRandomCallsignForModal = function (selectId, customInputId = '') {
  const sel = document.getElementById(selectId);
  if (!sel || sel.options.length === 0) return;
  const idx = Math.floor(Math.random() * sel.options.length);
  sel.selectedIndex = idx;
  if (customInputId) {
    const inp = document.getElementById(customInputId);
    if (inp) inp.value = sel.value;
  }
};

window.openAddPlayerModal = function () {
  const modalCont = getChessModalContainer();
  if (!modalCont) return;

  const available = getUnusedApprovedCallsigns();
  const defaultCallsign = available[0] || 'Florence Nightingale';

  modalCont.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.72); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 20px;" onclick="if(event.target === this) window.closeChessModal();">
      <div style="background: #ffffff; border-radius: 14px; max-width: 480px; width: 100%; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.28); font-family: 'Outfit', sans-serif;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 10px;">
          <h2 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #0f172a;">
            <i class="fa-solid fa-user-plus" style="color: #10b981;"></i> Add Club Member (Callsign)
          </h2>
          <button type="button" onclick="window.closeChessModal()" style="background: none; border: none; font-size: 1.3rem; color: #64748b; cursor: pointer;">&times;</button>
        </div>

        <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 9px; padding: 10px 12px; margin-bottom: 14px; font-size: 0.78rem; color: #92400e; line-height: 1.4;">
          <strong>🛡️ 100% GDPR Anonymous:</strong> Never enter a pupil's real name here. Pick or type a <strong>History Callsign</strong> below, tell the pupil to remember it, and jot their real name beside it on your private paper/markbook sheet.
        </div>

        <form onsubmit="window.handleAddPlayerSubmit(event)">
          ${
            available.length > 0
              ? `
            <div style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <label style="font-weight: 800; font-size: 0.82rem; color: #334155;">1. Quick-Pick Unused History Callsign:</label>
                <button type="button" onclick="window.pickRandomCallsignForModal('teacher-callsign-preset', 'new-player-name')" style="background: #eff6ff; color: #0284c7; border: 1px solid #bae6fd; border-radius: 6px; padding: 3px 9px; font-size: 0.74rem; font-weight: 800; cursor: pointer;">
                  🎲 Random Callsign
                </button>
              </div>
              <select id="teacher-callsign-preset" onchange="document.getElementById('new-player-name').value = this.value" style="width: 100%; padding: 9px 10px; border-radius: 7px; border: 1.5px solid #cbd5e1; font-size: 16px; font-weight: 700; color: #0f172a; background: #f8fafc;">
                ${available.map((cs) => `<option value="${cs}">${cs}</option>`).join('')}
              </select>
            </div>
          `
              : ''
          }

          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 800; font-size: 0.82rem; color: #334155; margin-bottom: 5px;">Callsign Shown on Ladder:</label>
            <input type="text" id="new-player-name" required maxlength="40" value="${defaultCallsign}" placeholder="e.g. Florence Nightingale" style="width: 100%; box-sizing: border-box; padding: 9px 10px; border-radius: 7px; border: 1.5px solid #0284c7; font-size: 16px; font-weight: 800; color: #0f172a;">
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: 800; font-size: 0.82rem; color: #334155; margin-bottom: 5px;">School House:</label>
            <select id="new-player-house" required style="width: 100%; padding: 9px 10px; border-radius: 7px; border: 1.5px solid #cbd5e1; font-size: 16px; font-weight: 700;">
              <option value="victory">Victory (Blue)</option>
              <option value="warrior">Warrior (Red)</option>
              <option value="dreadnought">Dreadnought (Green)</option>
              <option value="invincible">Invincible (Yellow)</option>
            </select>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e2e8f0; padding-top: 14px;">
            <button type="button" onclick="window.closeChessModal()" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 9px 16px; border-radius: 7px; font-weight: 700; cursor: pointer;">Cancel</button>
            <button type="submit" style="background: #10b981; color: #ffffff; border: none; padding: 9px 20px; border-radius: 7px; font-weight: 800; cursor: pointer;">Add Callsign to Ladder</button>
          </div>
        </form>

      </div>
    </div>
  `;
};

window.handleAddPlayerSubmit = function (e) {
  if (e && e.preventDefault) e.preventDefault();

  if (
    chessState.userRole !== 'teacher' ||
    localStorage.getItem('history_chess_teacher_auth') !== 'true'
  ) {
    showChessToast('🔒 Access Denied: Only authenticated teachers can register pupils.', 'error');
    return;
  }

  const rawName = (document.getElementById('new-player-name')?.value || '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const house = document.getElementById('new-player-house')?.value || 'warrior';

  if (!rawName) return;
  if (
    chessState.players.some((p) => String(p.name || '').toLowerCase() === rawName.toLowerCase())
  ) {
    showChessToast(`⚠️ "${rawName}" is already on the Club Ladder! Pick another Callsign.`, 'warning');
    return;
  }

  CALLSIGN_MAP[rawName] = rawName;
  const newId = 'p_' + Date.now();
  const newRank = chessState.players.length + 1;
  const newPlayer = {
    id: newId,
    name: rawName,
    nickname: rawName,
    realName: rawName,
    username: rawName.replace(/[^A-Za-z0-9]/g, ''),
    isCallsign: true,
    house: house,
    rating: 1000,
    games: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    rank: newRank,
  };

  chessState.players.push(newPlayer);
  chessState.checkedInPlayerIds.push(newId);
  saveChessState();
  window.closeChessModal();
  renderChessHubView();
  showChessToast(`🎉 Added "${rawName}" (${HOUSES[house]?.name || house})! Remind pupil to save their Callsign.`, 'success');
};

window.updateJoinPledgeButtonState = function () {
  const c1 = document.getElementById('join-pledge-remember')?.checked;
  const c2 = document.getElementById('join-pledge-tell-teacher')?.checked;
  const btn = document.getElementById('btn-submit-join-request');
  if (btn) {
    const ready = Boolean(c1 && c2);
    btn.disabled = !ready;
    btn.style.opacity = ready ? '1' : '0.45';
    btn.style.cursor = ready ? 'pointer' : 'not-allowed';
  }
};

window.openPupilJoinRequestModal = function () {
  const modalCont = getChessModalContainer();
  if (!modalCont) return;

  const available = getUnusedApprovedCallsigns();
  if (available.length === 0) {
    showChessToast('All preset Callsigns are currently in use — please ask your teacher to add a custom Callsign!', 'info');
    return;
  }

  modalCont.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.76); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 16px;" onclick="if(event.target === this) window.closeChessModal();">
      <div id="pupil-join-modal-box" style="background: #ffffff; border-radius: 15px; max-width: 500px; width: 100%; padding: 22px 24px; box-shadow: 0 22px 45px rgba(0,0,0,0.32); font-family: 'Outfit', sans-serif;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 10px;">
          <h2 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #0f172a;">
            ♟️ Request to Join Chess Club
          </h2>
          <button type="button" onclick="window.closeChessModal()" style="background: none; border: none; font-size: 1.3rem; color: #64748b; cursor: pointer;">&times;</button>
        </div>

        <form onsubmit="window.handlePupilJoinRequestSubmit(event)">
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
              <label style="font-weight: 800; font-size: 0.83rem; color: #0f172a;">1. Choose Your Anonymous History Callsign:</label>
              <button type="button" onclick="window.pickRandomCallsignForModal('pupil-join-callsign')" style="background: #eff6ff; color: #0284c7; border: 1px solid #bae6fd; border-radius: 6px; padding: 3px 9px; font-size: 0.74rem; font-weight: 800; cursor: pointer;">
                🎲 Randomize
              </button>
            </div>
            <select id="pupil-join-callsign" required style="width: 100%; padding: 10px; border-radius: 8px; border: 2px solid #0284c7; font-size: 16px; font-weight: 800; color: #0f172a; background: #f8fafc;">
              ${available.map((cs) => `<option value="${cs}">${cs}</option>`).join('')}
            </select>
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; font-weight: 800; font-size: 0.83rem; color: #0f172a; margin-bottom: 5px;">2. Choose Your School House:</label>
            <select id="pupil-join-house" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #cbd5e1; font-size: 16px; font-weight: 700; color: #0f172a;">
              <option value="victory">Victory (Blue)</option>
              <option value="warrior">Warrior (Red)</option>
              <option value="dreadnought">Dreadnought (Green)</option>
              <option value="invincible">Invincible (Yellow)</option>
            </select>
          </div>

          <!-- Mandatory High-Visibility Callsign Rules Box -->
          <div style="background: #fffbeb; border: 2px solid #f59e0b; border-radius: 10px; padding: 12px 14px; margin-bottom: 14px;">
            <div style="font-size: 0.82rem; font-weight: 900; color: #92400e; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 6px;">
              ⚠️ Mandatory Club Rules — Read Carefully!
            </div>
            <div style="font-size: 0.8rem; color: #78350f; line-height: 1.45; margin-bottom: 10px;">
              For school privacy, <strong>real names are never stored on this app</strong>:
              <ul style="margin: 5px 0 0 18px; padding: 0;">
                <li><strong>Remember your Callsign!</strong> Write it in your planner — if you forget it, the app cannot look it up by your name.</li>
                <li><strong>Tell your teacher in person!</strong> Your Callsign stays locked until you tell your teacher in person which Callsign is yours.</li>
              </ul>
            </div>

            <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.8rem; font-weight: 800; color: #0f172a; cursor: pointer; margin-bottom: 8px;">
              <input type="checkbox" id="join-pledge-remember" onchange="window.updateJoinPledgeButtonState()" style="margin-top: 3px; width: 16px; height: 16px; flex-shrink: 0;" />
              <span>I have written down my Callsign and will remember it.</span>
            </label>

            <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.8rem; font-weight: 800; color: #0f172a; cursor: pointer;">
              <input type="checkbox" id="join-pledge-tell-teacher" onchange="window.updateJoinPledgeButtonState()" style="margin-top: 3px; width: 16px; height: 16px; flex-shrink: 0;" />
              <span>I will tell my teacher in person which Callsign &amp; House I picked so they can approve me.</span>
            </label>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" onclick="window.closeChessModal()" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 9px 15px; border-radius: 8px; font-weight: 700; cursor: pointer;">Cancel</button>
            <button id="btn-submit-join-request" type="submit" disabled style="background: #0284c7; color: #ffffff; border: none; padding: 9px 18px; border-radius: 8px; font-weight: 800; opacity: 0.45; cursor: not-allowed;">
              Send Join Request
            </button>
          </div>
        </form>

      </div>
    </div>
  `;
};

window.handlePupilJoinRequestSubmit = async function (e) {
  if (e && e.preventDefault) e.preventDefault();
  const callsign = document.getElementById('pupil-join-callsign')?.value || '';
  const house = document.getElementById('pupil-join-house')?.value || 'warrior';
  const c1 = document.getElementById('join-pledge-remember')?.checked;
  const c2 = document.getElementById('join-pledge-tell-teacher')?.checked;
  if (!callsign || !c1 || !c2) return;

  const hObj = HOUSES[house] || HOUSES.warrior;
  const reqPayload = {
    requestId: `join_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    callsign,
    house,
    acknowledgedRules: true,
    createdAt: Date.now(),
  };

  // If requested directly on Teacher's own unlocked classroom laptop, queue locally too so teacher sees it immediately
  if (chessState.userRole === 'teacher') {
    chessState.pendingJoinRequests = [...(chessState.pendingJoinRequests || []), reqPayload];
  }

  const submitBtn = document.getElementById('btn-submit-join-request');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
  }

  const res = await submitClubJoinRequestToCloud(reqPayload);
  if (!res.ok && !res.offline && res.error) {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Join Request';
    }
    showChessToast(`⚠️ ${res.error}`, 'warning');
    return;
  }

  try {
    localStorage.setItem(
      'chess_pending_join_v1',
      JSON.stringify({ callsign, house, requestedAt: Date.now() }),
    );
  } catch (err) {}

  const box = document.getElementById('pupil-join-modal-box');
  if (box) {
    box.innerHTML = `
      <div style="text-align: center; padding: 6px 4px;">
        <div style="font-size: 2.2rem; margin-bottom: 6px;">📌</div>
        <h2 style="margin: 0 0 6px 0; font-family: 'Playfair Display', serif; font-size: 1.35rem; color: #0f172a;">
          Save Your Callsign Now!
        </h2>
        <p style="margin: 0 0 14px 0; font-size: 0.84rem; color: #475569;">
          Screenshot this card or write it in your planner right now:
        </p>

        <div style="background: ${hObj.bgLight}; border: 2px solid ${hObj.color}; border-radius: 12px; padding: 14px; margin-bottom: 14px;">
          <div style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b;">Your Club Callsign</div>
          <div style="font-size: 1.35rem; font-weight: 900; color: #0f172a; margin: 4px 0;">${callsign}</div>
          <div style="font-size: 0.82rem; font-weight: 800; color: ${hObj.color};">House: ${hObj.name}</div>
        </div>

        <div style="background: #fef2f2; border: 1.5px solid #fca5a5; border-radius: 9px; padding: 10px 12px; margin-bottom: 16px; font-size: 0.8rem; font-weight: 800; color: #991b1b; line-height: 1.4;">
          🗣️ NEXT STEP: Go tell your teacher in person: <em>"My Chess Callsign is ${callsign} (${hObj.name})"</em> so they can approve you onto the Club Ladder!
        </div>

        <button type="button" onclick="window.closeChessModal(); window.switchChessTab('play');" style="background: #0f172a; color: #ffffff; border: none; border-radius: 8px; padding: 10px 22px; font-size: 0.88rem; font-weight: 800; cursor: pointer; width: 100%;">
          Got It — I Wrote Down "${callsign}"
        </button>
      </div>
    `;
  }
  renderChessHubView();
};

window.quickChallengePlayer = function (targetId) {
  window.openLogMatchModal();
  setTimeout(() => {
    const bSelect = document.getElementById('match-black-player');
    if (bSelect) bSelect.value = targetId;
  }, 50);
};

window.forceCloudBroadcast = async function () {
  if (isAirgapModeActive()) {
    window.openAirgapInfoModal();
    return;
  }
  showChessToast('Broadcasting state to cloud...', 'info');
  const success = await broadcastStateToCloud(chessState, true);
  if (success) {
    showChessToast('☁️ Live room state successfully broadcasted to cloud!', 'success');
  } else {
    showChessToast('Cloud broadcast failed. Using local cache.', 'warning');
  }
};

window.highlightPupilBoard = function (pupilId) {
  chessState.selectedPupilId = pupilId;
  const cards = document.querySelectorAll('.board-pairing-card');
  cards.forEach((card) => {
    card.style.outline = 'none';
    card.style.boxShadow = 'none';
  });
  if (!pupilId) return;

  const targetCard = document.querySelector(
    `.board-pairing-card[data-white-id="${pupilId}"], .board-pairing-card[data-black-id="${pupilId}"]`,
  );
  if (targetCard) {
    targetCard.style.outline = '3px solid #16a34a';
    targetCard.style.boxShadow = '0 0 24px rgba(22, 163, 74, 0.45)';
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showChessToast('🎯 Found your board!', 'success');
  } else {
    showChessToast('You are not currently paired on an active board. Wait for teacher!', 'info');
  }
};

window.openPupilQrModal = async function () {
  const modalCont = getChessModalContainer();
  if (!modalCont) return;

  const origin = window.location.origin;
  const pupilUrl = `${origin}/?view=chess&role=pupil`;
  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(pupilUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
    });
  } catch (e) {
    console.error('Error generating QR code:', e);
  }

  modalCont.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.85); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 20px;" onclick="if(event.target === this) window.closeChessModal();">
      <div style="background: #ffffff; border-radius: 16px; max-width: 440px; width: 100%; padding: 28px; box-shadow: 0 24px 48px rgba(0,0,0,0.35); text-align: center; font-family: 'Outfit', sans-serif; animation: zoomIn 0.2s ease-out;">
        <div style="width: 52px; height: 52px; border-radius: 12px; background: #ecfdf5; color: #059669; display: inline-flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 12px;">
          📱
        </div>
        <h3 style="margin: 0 0 6px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.45rem; color: #0f172a; font-weight: 700;">
          Pupil Live Screen Access
        </h3>
        <p style="font-size: 0.86rem; color: #64748b; margin: 0 0 16px 0; line-height: 1.5;">
          Display this on the classroom projector or let pupils scan with their phone/Chromebook camera to join the live match grid.
        </p>
        
        <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 16px; display: inline-block; margin-bottom: 14px;">
          ${qrDataUrl ? `<img src="${qrDataUrl}" alt="Pupil QR Code" style="display: block; width: 240px; height: 240px; border-radius: 8px;">` : `<div style="font-size:0.8rem; color:#dc2626;">Could not generate QR code</div>`}
        </div>

        <div style="background: #f1f5f9; border-radius: 8px; padding: 8px 12px; font-family: monospace; font-size: 0.76rem; color: #334155; word-break: break-all; margin-bottom: 18px; border: 1px solid #cbd5e1;">
          ${pupilUrl}
        </div>

        <div style="display: flex; gap: 8px; justify-content: center;">
          <button type="button" onclick="navigator.clipboard.writeText('${pupilUrl}'); window.showChessToast('Link copied to clipboard!', 'success');" style="background: #0284c7; color: #ffffff; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <span>📋</span> Copy Link
          </button>
          <button type="button" onclick="window.closeChessModal();" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 10px 18px; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
            Close
          </button>
        </div>
      </div>
    </div>
  `;
};

window.openAirgapInfoModal = function () {
  const modalCont = getChessModalContainer();
  if (!modalCont) return;

  const isActive = isAirgapModeActive();
  const playerCount = chessState.players.length;

  modalCont.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 20px;" onclick="if(event.target === this) window.closeChessModal();">
      <div style="background: #ffffff; border-radius: 14px; max-width: 580px; width: 100%; padding: 26px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); animation: zoomIn 0.2s ease-out; font-family: 'Outfit', sans-serif;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #ecfdf5; border: 1.5px solid #86efac; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
              🛡️
            </div>
            <div>
              <h3 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.25rem; color: #0f172a;">
                School Laptop Airgap Mode &amp; GDPR Safety
              </h3>
              <div style="font-size: 0.74rem; color: #166534; font-weight: 700; margin-top: 2px;">
                UK GDPR &bull; Data Protection Act 2018 &bull; 100% Local Device Storage
              </div>
            </div>
          </div>
          <button type="button" onclick="window.closeChessModal()" style="background: transparent; border: none; font-size: 1.3rem; color: #94a3b8; cursor: pointer; padding: 4px 8px;">✕</button>
        </div>

        <div style="background: ${isActive ? '#f0fdf4' : '#fffbeb'}; border: 1.5px solid ${isActive ? '#86efac' : '#fde68a'}; border-radius: 10px; padding: 14px 16px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
            <div>
              <div style="font-weight: 800; font-size: 0.92rem; color: ${isActive ? '#166534' : '#92400e'}; display: flex; align-items: center; gap: 6px;">
                <span>${isActive ? '✅ Airgap Protection is ACTIVE' : '⚠️ Cloud Broadcasting is ENABLED'}</span>
              </div>
              <p style="margin: 4px 0 0 0; font-size: 0.78rem; color: ${isActive ? '#15803d' : '#78350f'}; line-height: 1.45;">
                ${
                  isActive
                    ? 'All pupil records, first names, and house points are strictly locked to this school laptop. Zero bytes are transmitted to the cloud or the internet.'
                    : 'Cloud broadcasting is active. Only use non-identifiable test handles in this mode.'
                }
              </p>
            </div>
            <button type="button" onclick="window.toggleAirgapMode()" style="background: ${isActive ? '#16a34a' : '#d97706'}; color: #ffffff; border: none; padding: 8px 14px; border-radius: 6px; font-weight: 800; font-size: 0.78rem; cursor: pointer; white-space: nowrap;">
              ${isActive ? 'Turn Off (Cloud)' : 'Turn On (Airgap)'}
            </button>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
          <div style="display: flex; gap: 10px; align-items: flex-start;">
            <span style="font-size: 1.05rem; background: #eff6ff; padding: 6px; border-radius: 6px;">💻</span>
            <div>
              <strong style="font-size: 0.84rem; color: #1e293b;">Safe for Real Pupil First Names:</strong>
              <div style="font-size: 0.78rem; color: #64748b; line-height: 1.45; margin-top: 2px;">
                You can safely type your pupils\' first names (or first name + initial, e.g. <em>Arthur</em> or <em>Arthur P.</em>). Everything stays strictly on this machine in <code>localStorage</code> and offline <code>IndexedDB</code>.
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 10px; align-items: flex-start;">
            <span style="font-size: 1.05rem; background: #fef2f2; padding: 6px; border-radius: 6px;">🚫</span>
            <div>
              <strong style="font-size: 0.84rem; color: #1e293b;">Zero Network Requests:</strong>
              <div style="font-size: 0.78rem; color: #64748b; line-height: 1.45; margin-top: 2px;">
                All outbound cloud sync calls are hard-blocked. No pupil names can be queried from the public internet by anyone.
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 10px; align-items: flex-start;">
            <span style="font-size: 1.05rem; background: #faf5ff; padding: 6px; border-radius: 6px;">🔒</span>
            <div>
              <strong style="font-size: 0.84rem; color: #1e293b;">Git &amp; Deployment Shield:</strong>
              <div style="font-size: 0.78rem; color: #64748b; line-height: 1.45; margin-top: 2px;">
                Local pupil names can never be accidentally copied or committed to GitHub repository code, preventing any public website leaks.
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #e2e8f0; padding-top: 12px;">
          <div style="font-size: 0.74rem; color: #64748b;">
            Current Local Roster: <strong>${playerCount} pupils</strong> on this device
          </div>
          <button type="button" onclick="window.closeChessModal()" style="background: #0f172a; color: #ffffff; border: none; padding: 8px 18px; border-radius: 6px; font-weight: 700; font-size: 0.82rem; cursor: pointer;">
            Done / Close
          </button>
        </div>

      </div>
    </div>
  `;
};

window.toggleAirgapMode = function () {
  const current = isAirgapModeActive();
  setAirgapMode(!current);
  chessState.airgapMode = !current;
  renderChessHubView();
  showChessToast(
    !current
      ? '🛡️ Airgap Mode Activated: Data locked locally to this school laptop (100% GDPR Safe)!'
      : '☁️ Cloud Mode Activated: Standings can be synced across devices.',
    'success',
  );
  window.openAirgapInfoModal();
};

// Register all 7 Interactive Classroom & Touch-TV Game Mode Controllers
registerClubGameModeHandlers({
  getState: () => chessState,
  saveChessState: () => saveChessState(),
  renderChessHubView: () => renderChessHubView(),
  showChessToast: (msg, type) => showChessToast(msg, type),
  pushChessUndoSnapshot: (label) => pushChessUndoSnapshot(label),
  applyCanonicalPlayerMatchStats: (pA, pB, out, ew, el) =>
    applyCanonicalPlayerMatchStats(pA, pB, out, ew, el),
  autoSortPlayersByPoints: () => autoSortPlayersByPoints(),
  isChessViewActive: () => isChessViewActive(),
});

// ============================================================================
// PRACTICE XP -> HOUSE POINTS ENGINE & TEACHER 1-CLICK APPROVAL INBOX
// ============================================================================
function applyPracticeXpToCanonicalPlayer(playerId, xpToAdd, claimMeta = {}) {
  const player = (chessState.players || []).find((p) => p.id === playerId);
  if (!player) return { housePtsAwarded: 0 };

  const safeXp = Math.max(0, Number(xpToAdd || 0));
  const extraDuelPts = Math.max(0, Number(claimMeta.bonusHousePts || 0));

  const oldXp = Number(player.practiceXp || 0);
  const newXp = oldXp + safeXp;
  player.practiceXp = newXp;

  if (typeof claimMeta.accuracyPct === 'number' && claimMeta.accuracyPct > (player.bestAccuracy || 0)) {
    player.bestAccuracy = Math.round(claimMeta.accuracyPct);
  }
  if (claimMeta.botConquered) {
    if (!player.conqueredBots || typeof player.conqueredBots !== 'object' || Array.isArray(player.conqueredBots)) {
      player.conqueredBots = {};
    }
    const prev = player.conqueredBots[claimMeta.botConquered] || { wins: 0, bestAccuracy: 0 };
    player.conqueredBots[claimMeta.botConquered] = {
      wins: (prev.wins || 0) + 1,
      bestAccuracy: Math.max(prev.bestAccuracy || 0, claimMeta.accuracyPct || 0) || null,
    };
  }

  const oldMilestones = Math.floor(oldXp / 100);
  const newMilestones = Math.floor(newXp / 100);
  const milestonePts = Math.max(0, newMilestones - oldMilestones);
  const housePtsAwarded = milestonePts + extraDuelPts;

  if (housePtsAwarded > 0) {
    player.bonusPoints = (player.bonusPoints || 0) + housePtsAwarded;
    const isDuelBonus = extraDuelPts > 0;
    chessState.matches.unshift({
      id: 'xp_b_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      date: isDuelBonus ? 'Live 2-Laptop Online Duel Bonus' : 'Virtual Chess Practice Milestone',
      timestamp: Date.now(),
      round: isDuelBonus ? 'Live Online Duel + Practice Bonus' : '100 XP Practice Bonus',
      white: player.name,
      black: claimMeta.opponentCallsign || 'Computer Coach',
      whiteId: player.id,
      whiteHouse: player.house,
      result: 'BONUS',
      bonusPoints: housePtsAwarded,
      opening: isDuelBonus ? 'Live Online Chess Duel' : 'Virtual Board Practice XP',
    });
  }

  return { housePtsAwarded, newXp, player };
}

function renderPendingJoinRequestsBanner() {
  const requests = chessState.pendingJoinRequests || [];
  if (requests.length === 0) return '';

  const rowsHtml = requests
    .map((req) => {
      const h = HOUSES[req.house] || HOUSES.warrior;
      const safeId = String(req.requestId || '').replace(/[^a-zA-Z0-9_-]/g, '');
      return `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; background: #ffffff; border: 1px solid #fde68a; border-radius: 8px; padding: 6px 10px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 0.88rem; font-weight: 900; color: #0f172a;">${req.callsign}</span>
          <span style="background: ${h.bgLight}; color: ${h.color}; border: 1px solid ${h.borderColor}; border-radius: 999px; padding: 1px 8px; font-size: 0.7rem; font-weight: 800;">${h.name}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <button type="button" onclick="window.approveClubJoinRequest('${safeId}')" style="background: #10b981; color: #ffffff; border: none; border-radius: 6px; padding: 5px 11px; font-size: 0.74rem; font-weight: 800; cursor: pointer;">
            ✓ Approve onto Ladder
          </button>
          <button type="button" onclick="window.declineClubJoinRequest('${safeId}')" style="background: #f8fafc; color: #64748b; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 9px; font-size: 0.73rem; font-weight: 700; cursor: pointer;">
            ✕ Decline
          </button>
        </div>
      </div>
    `;
    })
    .join('');

  return `
    <div id="teacher-join-inbox-banner" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1.5px solid #f59e0b; border-radius: 11px; padding: 10px 14px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.12);">
      <div style="font-size: 0.8rem; font-weight: 900; color: #92400e; margin-bottom: 6px;">
        🙋 Pending Club Join Request${requests.length === 1 ? '' : 's'} (${requests.length}) — <span style="font-weight: 700;">Only approve once the pupil has told you in person which Callsign is theirs (jot their name on your private sheet)!</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        ${rowsHtml}
      </div>
    </div>
  `;
}

window.approveClubJoinRequest = function (requestId) {
  if (chessState.userRole !== 'teacher') return;
  const req = (chessState.pendingJoinRequests || []).find((r) => r.requestId === requestId);
  if (!req) return;

  if (
    chessState.players.some(
      (p) => String(p.name || '').toLowerCase() === String(req.callsign || '').toLowerCase(),
    )
  ) {
    chessState.pendingJoinRequests = chessState.pendingJoinRequests.filter(
      (r) => r.requestId !== requestId,
    );
    clearClubJoinRequestsFromCloud([requestId]);
    renderChessHubView();
    showChessToast(`"${req.callsign}" is already on the Club Ladder!`, 'info');
    return;
  }

  pushChessUndoSnapshot(`Approve Member: ${req.callsign}`);
  CALLSIGN_MAP[req.callsign] = req.callsign;
  const newId = 'p_' + Date.now();
  const newPlayer = {
    id: newId,
    name: req.callsign,
    nickname: req.callsign,
    realName: req.callsign,
    username: req.callsign.replace(/[^A-Za-z0-9]/g, ''),
    isCallsign: true,
    house: req.house || 'warrior',
    rating: 1000,
    games: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    rank: chessState.players.length + 1,
  };

  chessState.players.push(newPlayer);
  chessState.checkedInPlayerIds.push(newId);
  chessState.processedJoinRequestIds = [
    ...(chessState.processedJoinRequestIds || []),
    requestId,
  ].slice(-200);
  chessState.pendingJoinRequests = chessState.pendingJoinRequests.filter(
    (r) => r.requestId !== requestId,
  );

  saveChessState();
  clearClubJoinRequestsFromCloud([requestId]);
  renderChessHubView();
  showChessToast(
    `🎉 Approved "${req.callsign}" (${HOUSES[req.house]?.name || req.house}) onto the Club Ladder!`,
    'success',
  );
};

window.declineClubJoinRequest = function (requestId) {
  if (chessState.userRole !== 'teacher') return;
  chessState.processedJoinRequestIds = [
    ...(chessState.processedJoinRequestIds || []),
    requestId,
  ].slice(-200);
  chessState.pendingJoinRequests = (chessState.pendingJoinRequests || []).filter(
    (r) => r.requestId !== requestId,
  );
  clearClubJoinRequestsFromCloud([requestId]);
  renderChessHubView();
  showChessToast('Declined join request.', 'info');
};

function renderPendingXpClaimsBanner() {
  const claims = chessState.pendingXpClaims || [];
  if (claims.length === 0) return '';

  const byPupil = new Map();
  let totalXp = 0;
  let totalExtraDuelPts = 0;
  claims.forEach((c) => {
    totalXp += Number(c.xp || 0);
    totalExtraDuelPts += Number(c.bonusHousePts || 0);
    const prev = byPupil.get(c.playerId) || {
      callsign: c.callsign,
      xp: 0,
      extraPts: 0,
      count: 0,
    };
    prev.xp += Number(c.xp || 0);
    prev.extraPts += Number(c.bonusHousePts || 0);
    prev.count += 1;
    byPupil.set(c.playerId, prev);
  });

  const summaryPills = [...byPupil.values()]
    .map(
      (item) =>
        `<span style="background: #ffffff; border: 1px solid #a7f3d0; color: #065f46; border-radius: 999px; padding: 2px 8px; font-size: 0.72rem; font-weight: 800;">${item.callsign}: +${item.xp} XP${item.extraPts > 0 ? ` · 🏆 +${item.extraPts} Duel House Pt` : ''}</span>`,
    )
    .join(' ');

  return `
    <div id="teacher-xp-inbox-banner" style="background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border: 1.5px solid #6ee7b7; border-radius: 11px; padding: 10px 14px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);">
      <div style="display: flex; flex-direction: column; gap: 5px;">
        <div style="font-size: 0.82rem; font-weight: 800; color: #065f46;">
          ✨ Practice XP &amp; Live Duel Rewards Ready (${claims.length} event${claims.length === 1 ? '' : 's'} · +${totalXp} XP${totalExtraDuelPts > 0 ? ` + 🏆 ${totalExtraDuelPts} Extra Duel House Pt${totalExtraDuelPts === 1 ? '' : 's'}` : ''})
        </div>
        <div style="display: flex; gap: 5px; flex-wrap: wrap;">
          ${summaryPills}
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <button type="button" onclick="window.approveAllPendingXpClaims()" style="background: #059669; color: #ffffff; border: none; border-radius: 7px; padding: 7px 13px; font-size: 0.78rem; font-weight: 800; cursor: pointer; box-shadow: 0 2px 6px rgba(5, 150, 105, 0.25);">
          ✓ Approve &amp; Bank XP
        </button>
        <button type="button" onclick="window.dismissAllPendingXpClaims()" style="background: #ffffff; color: #64748b; border: 1px solid #cbd5e1; border-radius: 7px; padding: 7px 10px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">
          ✕ Dismiss
        </button>
      </div>
    </div>
  `;
}

window.approveAllPendingXpClaims = function () {
  if (chessState.userRole !== 'teacher') return;
  const claims = chessState.pendingXpClaims || [];
  if (claims.length === 0) return;

  pushChessUndoSnapshot(`Approve Practice XP (${claims.length})`);
  const claimIds = [];
  let totalXp = 0;
  let totalHousePts = 0;

  claims.forEach((c) => {
    claimIds.push(c.claimId);
    totalXp += Number(c.xp || 0);
    const res = applyPracticeXpToCanonicalPlayer(c.playerId, Number(c.xp || 0), c);
    totalHousePts += res.housePtsAwarded || 0;
  });

  chessState.processedXpClaimIds = [...(chessState.processedXpClaimIds || []), ...claimIds].slice(-200);
  chessState.pendingXpClaims = [];

  if (totalHousePts > 0) {
    autoSortPlayersByPoints();
  }
  saveChessState();
  clearPracticeXpClaimsFromCloud(claimIds);
  renderChessHubView();
  showChessToast(
    totalHousePts > 0
      ? `🏆 Banked +${totalXp} Practice XP & unlocked +${totalHousePts} Bonus House Point${totalHousePts === 1 ? '' : 's'}!`
      : `⚡ Banked +${totalXp} Practice XP onto pupil profiles! (100 XP = +1 House Point)`,
    'success',
  );
};

window.dismissAllPendingXpClaims = function () {
  if (chessState.userRole !== 'teacher') return;
  const claims = chessState.pendingXpClaims || [];
  const claimIds = claims.map((c) => c.claimId);
  chessState.processedXpClaimIds = [...(chessState.processedXpClaimIds || []), ...claimIds].slice(-200);
  chessState.pendingXpClaims = [];
  clearPracticeXpClaimsFromCloud(claimIds);
  renderChessHubView();
  showChessToast('Dismissed pending practice XP claims.', 'info');
};

window.openChessPlayerProfile = function (playerId) {
  const modalCont = getChessModalContainer();
  if (!modalCont || !playerId) return;
  const html = renderPlayerProfileModalHtml(playerId, chessState, {
    calculatePlayerPoints,
  });
  if (html) modalCont.innerHTML = html;
};

window.setChessFeedFilter = function (filter) {
  chessState.feedFilter = filter || 'all';
  renderChessHubView();
};

window.challengeHistoricalBot = function (botId) {
  chessState.activeTab = 'play';
  if (!chessState.virtualChess) {
    chessState.virtualChess = createDefaultVirtualChessState();
  }
  chessState.virtualChess.mode = 'ai';
  chessState.virtualChess.aiLevel = botId || 'elizabeth_i';
  renderChessHubView();
  if (typeof window.startNewVirtualGame === 'function') {
    window.startNewVirtualGame();
  }
};

// Register Virtual Chess Set & Computer Coach Controllers
registerVirtualChessHandlers({
  getState: () => chessState,
  saveChessState: () => saveChessState(),
  renderChessHubView: () => renderChessHubView(),
  showChessToast: (msg, type) => showChessToast(msg, type),
  pushChessUndoSnapshot: (label) => pushChessUndoSnapshot(label),
  applyCanonicalPlayerMatchStats: (pA, pB, out, ew, el) =>
    applyCanonicalPlayerMatchStats(pA, pB, out, ew, el),
  isChessViewActive: () => isChessViewActive(),
  onPracticeXpEarned: (claim) => {
    if (chessState.userRole === 'teacher' && !chessState.isPupilPreview) {
      pushChessUndoSnapshot(`Practice XP: ${claim.callsign} (+${claim.xp} XP)`);
      const res = applyPracticeXpToCanonicalPlayer(claim.playerId, claim.xp, claim);
      if (res.housePtsAwarded > 0) {
        autoSortPlayersByPoints();
      }
      saveChessState();
      return { directTeacherBanked: true, housePtsAwarded: res.housePtsAwarded };
    }
    submitPracticeXpClaimToCloud(claim);
    return { directTeacherBanked: false, housePtsAwarded: 0 };
  },
});
