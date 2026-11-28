/**
 * The History Revision Hub — Virtual Chess Set & Computer Coach Engine
 * Self-contained FIDE legal chess rules, crisp Staunton SVG pieces, algebraic move log,
 * chess clocks, 2-Player Pass-and-Play, and 3-level Computer Coach (Easy / Medium / Hard).
 */

import { HOUSES } from './chess_data.js';
import { playClubSound } from './chess_club_modes.js';
import {
  HISTORICAL_BOTS,
  resolveBotProfile,
  detectOpeningName,
  pickTuringBookMove,
  generateSafeDuelRoomCode,
  DUEL_QUICK_REACTIONS,
  DAILY_TACTICAL_PUZZLES,
  parseFenBoardOnly,
  getTodayDailyPuzzle,
  readDailyPuzzleProgress,
  markDailyPuzzleSolved,
  recordLocalBotConquest,
  updateLocalBestAccuracy,
  appendLocalClubFeed,
} from './chess_bots_and_review.js';
import {
  createOnlineDuelRoom,
  joinOnlineDuelRoom,
  pollOnlineDuelRoom,
  pushOnlineDuelMove,
  sendOnlineDuelReaction,
  postClubHighlightToCloud,
  recordBotResultToCloud,
} from './chess_realtime.js';

// ============================================================================
// 1. CRISP STAUNTON INLINE SVG PIECE SET (Zero external requests or emoji bugs)
// ============================================================================
function renderStauntonSvg(pieceChar) {
  if (!pieceChar || pieceChar === '.') return '';
  const isWhite = pieceChar >= 'A' && pieceChar <= 'Z';
  const type = pieceChar.toLowerCase();
  const fill = isWhite ? '#ffffff' : '#1e293b';
  const stroke = '#0f172a';
  const inner = isWhite ? '#0f172a' : '#e2e8f0';

  let shape = '';
  if (type === 'p') {
    shape = `
      <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
        fill="${fill}" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" />
    `;
  } else if (type === 'r') {
    shape = `
      <g fill="${fill}" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" />
        <path d="M34 14l-3 3H14l-3-3" />
        <path d="M31 17v12.5H14V17" />
        <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" />
        <path d="M14 16.5h17" stroke="${inner}" stroke-width="1.1" fill="none" />
        <path d="M14 29.5h17" stroke="${inner}" stroke-width="1.1" fill="none" />
      </g>
    `;
  } else if (type === 'n') {
    shape = `
      <g fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="${fill}" />
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="${fill}" />
        <circle cx="15.5" cy="15.5" r="1.1" fill="${inner}" stroke="none" />
      </g>
    `;
  } else if (type === 'b') {
    shape = `
      <g fill="${fill}" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z" />
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
        <circle cx="22.5" cy="8" r="2.3" />
        <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="${inner}" stroke-width="1.3" fill="none" />
      </g>
    `;
  } else if (type === 'q') {
    shape = `
      <g fill="${fill}" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" />
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" />
        <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" />
        <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" stroke="${inner}" stroke-width="1.2" fill="none" />
      </g>
    `;
  } else if (type === 'k') {
    shape = `
      <g fill="${fill}" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22.5 11.63V6M20 8h5" fill="none" stroke-width="2" />
        <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" />
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" />
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="${inner}" stroke-width="1.2" fill="none" />
      </g>
    `;
  }

  return `<svg viewBox="0 0 45 45" style="width: 84%; height: 84%; display: block; filter: drop-shadow(0 2px 2px rgba(15,23,42,0.28)); pointer-events: none;" aria-hidden="true">${shape}</svg>`;
}

const SMALL_CAPTURE_GLYPHS = {
  q: '♛\uFE0E',
  r: '♜\uFE0E',
  b: '♝\uFE0E',
  n: '♞\uFE0E',
  p: '♟\uFE0E',
};

const PIECE_VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

const TAPPED_IN_STORAGE_KEY = 'chess_active_pupil_id';
const PENDING_JOIN_STORAGE_KEY = 'chess_pending_join_v1';
const LOCAL_XP_LEDGER_KEY = 'chess_pupil_xp_ledger_v1';
const SAVED_DUEL_ROOM_KEY = 'chess_active_online_room_v1';
const GUEST_DEVICE_ID_KEY = 'chess_guest_device_id_v1';
const DAILY_XP_CAP = 150;

function getOrCreateGuestDeviceId() {
  if (typeof window === 'undefined') return 'guest_local';
  try {
    let id = localStorage.getItem(GUEST_DEVICE_ID_KEY);
    if (!id) {
      id = `guest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      localStorage.setItem(GUEST_DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return `guest_${Date.now()}`;
  }
}

function readSavedOnlineDuelCode() {
  if (typeof window === 'undefined') return '';
  try {
    const raw = JSON.parse(localStorage.getItem(SAVED_DUEL_ROOM_KEY) || 'null');
    if (raw && raw.roomCode && Date.now() - Number(raw.savedAt || 0) < 86400000) {
      return String(raw.roomCode);
    }
  } catch {}
  return '';
}

function writeSavedOnlineDuelCode(roomCode) {
  if (typeof window === 'undefined') return;
  try {
    if (roomCode) {
      localStorage.setItem(
        SAVED_DUEL_ROOM_KEY,
        JSON.stringify({ roomCode, savedAt: Date.now() }),
      );
    } else {
      localStorage.removeItem(SAVED_DUEL_ROOM_KEY);
    }
  } catch {}
}

function getPendingJoinLocal() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PENDING_JOIN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function clearPendingJoinLocal() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PENDING_JOIN_STORAGE_KEY);
  } catch (e) {}
}

function getSavedTappedInPlayerId() {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(TAPPED_IN_STORAGE_KEY) || '';
  } catch (e) {
    return '';
  }
}

function saveTappedInPlayerId(id) {
  if (typeof window === 'undefined') return;
  try {
    if (id) localStorage.setItem(TAPPED_IN_STORAGE_KEY, id);
    else localStorage.removeItem(TAPPED_IN_STORAGE_KEY);
  } catch (e) {}
}

function readLocalXpLedger() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_XP_LEDGER_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function writeLocalXpLedger(ledger) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_XP_LEDGER_KEY, JSON.stringify(ledger));
  } catch (e) {}
}

export function getXpRankBadge(totalXp = 0) {
  if (totalXp >= 900) return { title: 'Club Grandmaster', icon: '👑', color: '#b45309' };
  if (totalXp >= 500) return { title: 'Rook Commander', icon: '🏰', color: '#7c3aed' };
  if (totalXp >= 250) return { title: 'Knight Tactician', icon: '🐴', color: '#0284c7' };
  if (totalXp >= 100) return { title: 'Pawn Squire', icon: '♟️', color: '#059669' };
  return { title: 'Club Novice', icon: '🌱', color: '#475569' };
}

export function getPupilXpProgress(player) {
  if (!player) {
    return { totalXp: 0, towardHousePt: 0, housePtsEarned: 0, usedToday: 0, badge: getXpRankBadge(0) };
  }
  const ledger = readLocalXpLedger();
  const entry = ledger[player.id] || { localTotalXp: 0, daily: {} };
  const todayKey = new Date().toISOString().slice(0, 10);
  const usedToday = Number(entry.daily?.[todayKey] || 0);
  const canonicalXp = Number(player.practiceXp || 0);
  const totalXp = Math.max(canonicalXp, Number(entry.localTotalXp || 0));
  return {
    totalXp,
    towardHousePt: totalXp % 100,
    housePtsEarned: Math.floor(totalXp / 100),
    usedToday,
    badge: getXpRankBadge(totalXp),
  };
}

// ============================================================================
// 2. CORE CHESS STATE & LEGAL MOVE ENGINE
// ============================================================================
export function createInitialBoardMatrix() {
  return [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ];
}

export function createDefaultVirtualChessState() {
  const board = createInitialBoardMatrix();
  const state = {
    board,
    turn: 'w',
    castling: { K: true, Q: true, k: true, q: true },
    enPassant: null, // [r, c]
    halfMoveClock: 0,
    fullMoveNumber: 1,
    positionCounts: {},
    selected: null, // [r, c]
    lastMove: null, // { from: [r, c], to: [r, c] }
    hintMove: null, // { fromR, fromC, toR, toC, san, reason }
    pendingPromotion: null, // { fromR, fromC, toR, toC }
    confirmAction: null, // 'resign' | 'draw' | null
    history: [], // undo snapshots
    moveLog: [], // [{ san, side }]
    capturedByWhite: [], // lowercase chars captured by White
    capturedByBlack: [], // uppercase chars captured by Black
    status: 'playing', // 'playing' | 'checkmate' | 'stalemate' | 'draw_repetition' | 'draw_50' | 'draw_material' | 'draw_agreed' | 'resigned' | 'timeout'
    winner: null, // 'w' | 'b' | 'draw' | null
    mode: 'ai', // 'ai' | 'online' | 'daily' | 'pass'
    aiLevel: 'elizabeth_i', // 'henry_viii' | 'boudicca' | 'elizabeth_i' | 'napoleon' | 'eleanor' | 'turing'
    botQuip: '',
    humanSide: 'w', // 'w' | 'b'
    aiThinking: false,
    flipped: false,
    autoFlipPass: false,
    boardTheme: 'wood', // 'wood' | 'slate'
    timeControlMins: 0, // 0 = untimed, 3, 5, 10
    whiteTimeSecs: 0,
    blackTimeSecs: 0,
    clockActive: false,
    whitePlayerId: '',
    blackPlayerId: '',
    tappedInPlayerId: getSavedTappedInPlayerId(),
    hintsUsedCount: 0,
    xpEvaluated: false,
    xpGrantedThisGame: false,
    lastXpNotice: null,
    loggedToLadder: false,
    gameReview: null, // Post-game Coach Review { accuracyPct, counts, bestMoveItem, blunderItem }
    replayPlyIndex: null, // null = live board, 0..N = historical move scrub
    drawnArrows: [], // [{ from: [r, c], to: [r, c] }]
    highlightedSquares: [], // ['e4', ...]
    // Live 2-Laptop Online Duel state
    onlineRoomCode: '',
    onlineSide: 'w',
    onlineSeq: 0,
    onlineHostPrefSide: 'w',
    onlineRoomData: null,
    onlineError: '',
    onlineReactionToast: null,
    // Daily Tactical Puzzle state
    dailyPuzzleIdx: 0,
    dailySolvedBanner: '',
    dailyWrongToast: '',
  };
  const key = computePositionKey(state);
  state.positionCounts[key] = 1;
  return state;
}

function isWhitePiece(ch) {
  return ch >= 'A' && ch <= 'Z';
}

function sideOf(ch) {
  if (!ch || ch === '.') return null;
  return isWhitePiece(ch) ? 'w' : 'b';
}

function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

function sqName(r, c) {
  return `${String.fromCharCode(97 + c)}${8 - r}`;
}

function computePositionKey(game) {
  const rows = game.board.map((r) => r.join('')).join('/');
  const c = game.castling || {};
  const cast = `${c.K ? 'K' : ''}${c.Q ? 'Q' : ''}${c.k ? 'k' : ''}${c.q ? 'q' : ''}` || '-';
  const ep = game.enPassant ? `${game.enPassant[0]},${game.enPassant[1]}` : '-';
  return `${rows} ${game.turn} ${cast} ${ep}`;
}

function findKingSquare(board, side) {
  const target = side === 'w' ? 'K' : 'k';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === target) return [r, c];
    }
  }
  return null;
}

export function isSquareAttackedBy(board, targetR, targetC, attackerSide) {
  const pawnRow = attackerSide === 'w' ? targetR + 1 : targetR - 1;
  const pawnCh = attackerSide === 'w' ? 'P' : 'p';
  if (inBounds(pawnRow, targetC - 1) && board[pawnRow][targetC - 1] === pawnCh) return true;
  if (inBounds(pawnRow, targetC + 1) && board[pawnRow][targetC + 1] === pawnCh) return true;

  const knightCh = attackerSide === 'w' ? 'N' : 'n';
  const kJumps = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1],
  ];
  for (const [dr, dc] of kJumps) {
    const nr = targetR + dr;
    const nc = targetC + dc;
    if (inBounds(nr, nc) && board[nr][nc] === knightCh) return true;
  }

  const kingCh = attackerSide === 'w' ? 'K' : 'k';
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = targetR + dr;
      const nc = targetC + dc;
      if (inBounds(nr, nc) && board[nr][nc] === kingCh) return true;
    }
  }

  const rookCh = attackerSide === 'w' ? 'R' : 'r';
  const queenCh = attackerSide === 'w' ? 'Q' : 'q';
  for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
    let nr = targetR + dr;
    let nc = targetC + dc;
    while (inBounds(nr, nc)) {
      const p = board[nr][nc];
      if (p !== '.') {
        if (p === rookCh || p === queenCh) return true;
        break;
      }
      nr += dr;
      nc += dc;
    }
  }

  const bishopCh = attackerSide === 'w' ? 'B' : 'b';
  for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
    let nr = targetR + dr;
    let nc = targetC + dc;
    while (inBounds(nr, nc)) {
      const p = board[nr][nc];
      if (p !== '.') {
        if (p === bishopCh || p === queenCh) return true;
        break;
      }
      nr += dr;
      nc += dc;
    }
  }

  return false;
}

export function isSideInCheck(board, side) {
  const kp = findKingSquare(board, side);
  if (!kp) return false;
  return isSquareAttackedBy(board, kp[0], kp[1], side === 'w' ? 'b' : 'w');
}

function applyMoveToBoardClone(board, mv) {
  const nb = cloneBoard(board);
  const piece = nb[mv.fromR][mv.fromC];
  nb[mv.fromR][mv.fromC] = '.';

  if (mv.isEnPassant) {
    nb[mv.fromR][mv.toC] = '.';
  }
  if (mv.castleRookFrom && mv.castleRookTo) {
    const rook = nb[mv.castleRookFrom[0]][mv.castleRookFrom[1]];
    nb[mv.castleRookFrom[0]][mv.castleRookFrom[1]] = '.';
    nb[mv.castleRookTo[0]][mv.castleRookTo[1]] = rook;
  }

  let placed = piece;
  if (mv.promotion) {
    placed = isWhitePiece(piece) ? mv.promotion.toUpperCase() : mv.promotion.toLowerCase();
  } else if (piece === 'P' && mv.toR === 0) {
    placed = 'Q';
  } else if (piece === 'p' && mv.toR === 7) {
    placed = 'q';
  }
  nb[mv.toR][mv.toC] = placed;
  return nb;
}

export function getLegalMovesFrom(game, r, c) {
  const board = game.board;
  const piece = board[r][c];
  const side = sideOf(piece);
  if (!side || side !== game.turn) return [];

  const enemy = side === 'w' ? 'b' : 'w';
  const pseudo = [];
  const lower = piece.toLowerCase();

  if (lower === 'p') {
    const dir = side === 'w' ? -1 : 1;
    const startRank = side === 'w' ? 6 : 1;
    const promoRank = side === 'w' ? 0 : 7;
    const oneR = r + dir;

    const addPawnMove = (toR, toC, extra = {}) => {
      if (toR === promoRank) {
        for (const pr of ['q', 'r', 'b', 'n']) {
          pseudo.push({ fromR: r, fromC: c, toR, toC, promotion: pr, ...extra });
        }
      } else {
        pseudo.push({ fromR: r, fromC: c, toR, toC, ...extra });
      }
    };

    if (inBounds(oneR, c) && board[oneR][c] === '.') {
      addPawnMove(oneR, c);
      const twoR = r + dir * 2;
      if (r === startRank && board[twoR][c] === '.') {
        pseudo.push({ fromR: r, fromC: c, toR: twoR, toC: c, doublePush: true });
      }
    }

    for (const dc of [-1, 1]) {
      const nc = c + dc;
      if (!inBounds(oneR, nc)) continue;
      if (sideOf(board[oneR][nc]) === enemy) {
        addPawnMove(oneR, nc);
      } else if (game.enPassant && game.enPassant[0] === oneR && game.enPassant[1] === nc) {
        pseudo.push({ fromR: r, fromC: c, toR: oneR, toC: nc, isEnPassant: true });
      }
    }
  } else if (lower === 'n') {
    for (const [dr, dc] of [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1],
    ]) {
      const nr = r + dr;
      const nc = c + dc;
      if (inBounds(nr, nc) && sideOf(board[nr][nc]) !== side) {
        pseudo.push({ fromR: r, fromC: c, toR: nr, toC: nc });
      }
    }
  } else if (lower === 'b' || lower === 'r' || lower === 'q') {
    const dirs = [];
    if (lower === 'b' || lower === 'q') dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    if (lower === 'r' || lower === 'q') dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);
    for (const [dr, dc] of dirs) {
      let nr = r + dr;
      let nc = c + dc;
      while (inBounds(nr, nc)) {
        const occ = sideOf(board[nr][nc]);
        if (!occ) {
          pseudo.push({ fromR: r, fromC: c, toR: nr, toC: nc });
        } else {
          if (occ === enemy) pseudo.push({ fromR: r, fromC: c, toR: nr, toC: nc });
          break;
        }
        nr += dr;
        nc += dc;
      }
    }
  } else if (lower === 'k') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (inBounds(nr, nc) && sideOf(board[nr][nc]) !== side) {
          pseudo.push({ fromR: r, fromC: c, toR: nr, toC: nc });
        }
      }
    }

    if (!isSideInCheck(board, side)) {
      const homeR = side === 'w' ? 7 : 0;
      const rookCh = side === 'w' ? 'R' : 'r';
      if (r === homeR && c === 4) {
        const canKS = side === 'w' ? game.castling?.K : game.castling?.k;
        const canQS = side === 'w' ? game.castling?.Q : game.castling?.q;
        if (
          canKS &&
          board[homeR][5] === '.' &&
          board[homeR][6] === '.' &&
          board[homeR][7] === rookCh &&
          !isSquareAttackedBy(board, homeR, 5, enemy) &&
          !isSquareAttackedBy(board, homeR, 6, enemy)
        ) {
          pseudo.push({
            fromR: homeR,
            fromC: 4,
            toR: homeR,
            toC: 6,
            castleRookFrom: [homeR, 7],
            castleRookTo: [homeR, 5],
            castleSide: 'K',
          });
        }
        if (
          canQS &&
          board[homeR][3] === '.' &&
          board[homeR][2] === '.' &&
          board[homeR][1] === '.' &&
          board[homeR][0] === rookCh &&
          !isSquareAttackedBy(board, homeR, 3, enemy) &&
          !isSquareAttackedBy(board, homeR, 2, enemy)
        ) {
          pseudo.push({
            fromR: homeR,
            fromC: 4,
            toR: homeR,
            toC: 2,
            castleRookFrom: [homeR, 0],
            castleRookTo: [homeR, 3],
            castleSide: 'Q',
          });
        }
      }
    }
  }

  return pseudo.filter((mv) => {
    const after = applyMoveToBoardClone(board, mv);
    return !isSideInCheck(after, side);
  });
}

export function getAllLegalMovesForState(game) {
  const moves = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (sideOf(game.board[r][c]) === game.turn) {
        moves.push(...getLegalMovesFrom(game, r, c));
      }
    }
  }
  return moves;
}

function isInsufficientMaterial(board) {
  const pieces = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const ch = board[r][c];
      if (ch !== '.' && ch.toLowerCase() !== 'k') {
        pieces.push({ ch, lower: ch.toLowerCase(), colorSq: (r + c) % 2 });
      }
    }
  }
  if (pieces.length === 0) return true; // K vs K
  if (pieces.length === 1 && (pieces[0].lower === 'n' || pieces[0].lower === 'b')) return true;
  if (
    pieces.length === 2 &&
    pieces[0].lower === 'b' &&
    pieces[1].lower === 'b' &&
    isWhitePiece(pieces[0].ch) !== isWhitePiece(pieces[1].ch) &&
    pieces[0].colorSq === pieces[1].colorSq
  ) {
    return true;
  }
  return false;
}

function hasMatingMaterial(board, side) {
  let minors = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const ch = board[r][c];
      if (sideOf(ch) !== side) continue;
      const l = ch.toLowerCase();
      if (l === 'p' || l === 'r' || l === 'q') return true;
      if (l === 'n' || l === 'b') minors++;
    }
  }
  return minors >= 2;
}

function formatMoveSAN(gameBefore, mv, allLegalBefore, nextInCheck, nextHasMoves) {
  if (mv.castleSide === 'K') {
    return `O-O${!nextHasMoves && nextInCheck ? '#' : nextInCheck ? '+' : ''}`;
  }
  if (mv.castleSide === 'Q') {
    return `O-O-O${!nextHasMoves && nextInCheck ? '#' : nextInCheck ? '+' : ''}`;
  }

  const piece = gameBefore.board[mv.fromR][mv.fromC];
  const lower = piece.toLowerCase();
  const isCap = mv.isEnPassant || gameBefore.board[mv.toR][mv.toC] !== '.';
  const dest = sqName(mv.toR, mv.toC);

  let san = '';
  if (lower === 'p') {
    if (isCap) san += String.fromCharCode(97 + mv.fromC) + 'x';
    san += dest;
    if (mv.promotion) san += `=${mv.promotion.toUpperCase()}`;
  } else {
    san += lower.toUpperCase();
    const peers = allLegalBefore.filter(
      (m) =>
        (m.fromR !== mv.fromR || m.fromC !== mv.fromC) &&
        m.toR === mv.toR &&
        m.toC === mv.toC &&
        gameBefore.board[m.fromR][m.fromC] === piece,
    );
    if (peers.length > 0) {
      const sameFile = peers.some((p) => p.fromC === mv.fromC);
      const sameRank = peers.some((p) => p.fromR === mv.fromR);
      if (!sameFile) san += String.fromCharCode(97 + mv.fromC);
      else if (!sameRank) san += `${8 - mv.fromR}`;
      else san += sqName(mv.fromR, mv.fromC);
    }
    if (isCap) san += 'x';
    san += dest;
  }

  if (!nextHasMoves && nextInCheck) san += '#';
  else if (nextInCheck) san += '+';
  return san;
}

export function applyVirtualChessMove(game, mv, silent = false) {
  const allBefore = getAllLegalMovesForState(game);

  // Save snapshot for Undo
  game.history.push({
    board: cloneBoard(game.board),
    turn: game.turn,
    castling: { ...game.castling },
    enPassant: game.enPassant ? [...game.enPassant] : null,
    halfMoveClock: game.halfMoveClock,
    fullMoveNumber: game.fullMoveNumber,
    positionCounts: { ...game.positionCounts },
    lastMove: game.lastMove ? { from: [...game.lastMove.from], to: [...game.lastMove.to] } : null,
    moveLog: [...game.moveLog],
    capturedByWhite: [...game.capturedByWhite],
    capturedByBlack: [...game.capturedByBlack],
    status: game.status,
    winner: game.winner,
    whiteTimeSecs: game.whiteTimeSecs,
    blackTimeSecs: game.blackTimeSecs,
  });
  if (game.history.length > 120) game.history.shift();

  const movingPiece = game.board[mv.fromR][mv.fromC];
  const capturedPiece = mv.isEnPassant
    ? game.turn === 'w'
      ? 'p'
      : 'P'
    : game.board[mv.toR][mv.toC];

  if (capturedPiece && capturedPiece !== '.') {
    if (game.turn === 'w') game.capturedByWhite.push(capturedPiece.toLowerCase());
    else game.capturedByBlack.push(capturedPiece.toLowerCase());
  }

  // Update castling rights
  if (movingPiece === 'K') {
    game.castling.K = false;
    game.castling.Q = false;
  } else if (movingPiece === 'k') {
    game.castling.k = false;
    game.castling.q = false;
  }
  if ((mv.fromR === 7 && mv.fromC === 0) || (mv.toR === 7 && mv.toC === 0)) game.castling.Q = false;
  if ((mv.fromR === 7 && mv.fromC === 7) || (mv.toR === 7 && mv.toC === 7)) game.castling.K = false;
  if ((mv.fromR === 0 && mv.fromC === 0) || (mv.toR === 0 && mv.toC === 0)) game.castling.q = false;
  if ((mv.fromR === 0 && mv.fromC === 7) || (mv.toR === 0 && mv.toC === 7)) game.castling.k = false;

  // Half-move clock
  if (movingPiece.toLowerCase() === 'p' || (capturedPiece && capturedPiece !== '.')) {
    game.halfMoveClock = 0;
  } else {
    game.halfMoveClock = (game.halfMoveClock || 0) + 1;
  }

  const moverSide = game.turn;
  if (moverSide === 'b') game.fullMoveNumber = (game.fullMoveNumber || 1) + 1;

  const afterBoard = applyMoveToBoardClone(game.board, mv);
  const nextTurn = moverSide === 'w' ? 'b' : 'w';
  const nextEp = mv.doublePush ? [Math.floor((mv.fromR + mv.toR) / 2), mv.fromC] : null;

  const tempNextState = {
    board: afterBoard,
    turn: nextTurn,
    castling: game.castling,
    enPassant: nextEp,
  };
  const nextLegal = getAllLegalMovesForState(tempNextState);
  const nextInCheck = isSideInCheck(afterBoard, nextTurn);
  const san = formatMoveSAN(game, mv, allBefore, nextInCheck, nextLegal.length > 0);

  game.board = afterBoard;
  game.turn = nextTurn;
  game.enPassant = nextEp;
  game.lastMove = { from: [mv.fromR, mv.fromC], to: [mv.toR, mv.toC] };
  game.selected = null;
  game.hintMove = null;
  game.pendingPromotion = null;
  game.confirmAction = null;
  game.moveLog.push({ san, side: moverSide });

  if (game.timeControlMins > 0) {
    game.clockActive = true;
  }

  const posKey = computePositionKey(game);
  game.positionCounts[posKey] = (game.positionCounts[posKey] || 0) + 1;

  if (nextLegal.length === 0) {
    game.clockActive = false;
    if (nextInCheck) {
      game.status = 'checkmate';
      game.winner = moverSide;
      if (!silent) playClubSound('win');
    } else {
      game.status = 'stalemate';
      game.winner = 'draw';
      if (!silent) playClubSound('bounty');
    }
  } else if (game.positionCounts[posKey] >= 3) {
    game.status = 'draw_repetition';
    game.winner = 'draw';
    game.clockActive = false;
  } else if (game.halfMoveClock >= 100) {
    game.status = 'draw_50';
    game.winner = 'draw';
    game.clockActive = false;
  } else if (isInsufficientMaterial(game.board)) {
    game.status = 'draw_material';
    game.winner = 'draw';
    game.clockActive = false;
  } else {
    if (!silent) {
      if (nextInCheck) playClubSound('bounty');
      else playClubSound('move');
    }
  }

  if (game.mode === 'pass' && game.autoFlipPass && game.status === 'playing') {
    game.flipped = game.turn === 'b';
  }
}

// ============================================================================
// 3. COMPUTER COACH AI (Piece-Square Tables + Alpha-Beta + Quiescence)
// ============================================================================
const PST_PAWN = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [12, 12, 22, 32, 32, 22, 12, 12],
  [6, 6, 12, 26, 26, 12, 6, 6],
  [0, 0, 4, 22, 22, 4, 0, 0],
  [5, -4, -8, 0, 0, -8, -4, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const PST_KNIGHT = [
  [-45, -35, -25, -25, -25, -25, -35, -45],
  [-35, -15, 0, 4, 4, 0, -15, -35],
  [-25, 4, 14, 18, 18, 14, 4, -25],
  [-25, 6, 18, 24, 24, 18, 6, -25],
  [-25, 4, 16, 22, 22, 16, 4, -25],
  [-25, 6, 14, 16, 16, 14, 6, -25],
  [-35, -15, 0, 6, 6, 0, -15, -35],
  [-45, -35, -25, -25, -25, -25, -35, -45],
];

const PST_BISHOP = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 4, 0, 0, 0, 0, 4, -10],
  [-10, 8, 10, 12, 12, 10, 8, -10],
  [-10, 4, 12, 14, 14, 12, 4, -10],
  [-10, 6, 8, 14, 14, 8, 6, -10],
  [-10, 10, 10, 12, 12, 10, 10, -10],
  [-10, 8, 0, 4, 4, 0, 8, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const PST_ROOK = [
  [0, 0, 2, 4, 4, 2, 0, 0],
  [6, 12, 12, 12, 12, 12, 12, 6],
  [-4, 0, 0, 0, 0, 0, 0, -4],
  [-4, 0, 0, 0, 0, 0, 0, -4],
  [-4, 0, 0, 0, 0, 0, 0, -4],
  [-4, 0, 0, 0, 0, 0, 0, -4],
  [-4, 0, 0, 0, 0, 0, 0, -4],
  [0, 0, 2, 8, 8, 2, 0, 0],
];

const PST_QUEEN = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 4, 0, 0, 0, 0, -10],
  [-10, 4, 6, 6, 6, 6, 0, -10],
  [-5, 0, 6, 8, 8, 6, 0, -5],
  [0, 0, 6, 8, 8, 6, 0, -5],
  [-10, 4, 6, 6, 6, 6, 0, -10],
  [-10, 0, 4, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const PST_KING_MID = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [18, 20, 0, 0, 0, 0, 20, 18],
  [20, 32, 12, 0, 0, 12, 32, 20],
];

const PST_KING_END = [
  [-40, -25, -20, -15, -15, -20, -25, -40],
  [-25, -10, 0, 5, 5, 0, -10, -25],
  [-20, 0, 15, 22, 22, 15, 0, -20],
  [-15, 5, 22, 28, 28, 22, 5, -15],
  [-15, 5, 22, 28, 28, 22, 5, -15],
  [-20, 0, 15, 22, 22, 15, 0, -20],
  [-25, -10, 0, 5, 5, 0, -10, -25],
  [-40, -25, -20, -15, -15, -20, -25, -40],
];

const BASE_CP = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

function evaluateBoardForWhite(board) {
  let score = 0;
  let nonPawnMaterial = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const ch = board[r][c];
      if (ch === '.') continue;
      const l = ch.toLowerCase();
      if (l !== 'p' && l !== 'k') nonPawnMaterial += BASE_CP[l] || 0;
    }
  }
  const isEndgame = nonPawnMaterial <= 2600;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const ch = board[r][c];
      if (ch === '.') continue;
      const white = isWhitePiece(ch);
      const l = ch.toLowerCase();
      const pr = white ? r : 7 - r;
      let val = BASE_CP[l] || 0;

      if (l === 'p') val += PST_PAWN[pr][c];
      else if (l === 'n') val += PST_KNIGHT[pr][c];
      else if (l === 'b') val += PST_BISHOP[pr][c];
      else if (l === 'r') val += PST_ROOK[pr][c];
      else if (l === 'q') val += PST_QUEEN[pr][c];
      else if (l === 'k') val += isEndgame ? PST_KING_END[pr][c] : PST_KING_MID[pr][c];

      score += white ? val : -val;
    }
  }

  return score;
}

function makeLightSearchChild(node, mv) {
  const moving = node.board[mv.fromR][mv.fromC];
  const nextCast = { ...node.castling };
  if (moving === 'K') {
    nextCast.K = false;
    nextCast.Q = false;
  } else if (moving === 'k') {
    nextCast.k = false;
    nextCast.q = false;
  }
  if ((mv.fromR === 7 && mv.fromC === 0) || (mv.toR === 7 && mv.toC === 0)) nextCast.Q = false;
  if ((mv.fromR === 7 && mv.fromC === 7) || (mv.toR === 7 && mv.toC === 7)) nextCast.K = false;
  if ((mv.fromR === 0 && mv.fromC === 0) || (mv.toR === 0 && mv.toC === 0)) nextCast.q = false;
  if ((mv.fromR === 0 && mv.fromC === 7) || (mv.toR === 0 && mv.toC === 7)) nextCast.k = false;

  return {
    board: applyMoveToBoardClone(node.board, mv),
    turn: node.turn === 'w' ? 'b' : 'w',
    castling: nextCast,
    enPassant: mv.doublePush ? [Math.floor((mv.fromR + mv.toR) / 2), mv.fromC] : null,
  };
}

function orderMovesForSearch(board, moves) {
  return [...moves].sort((a, b) => {
    const capA = a.isEnPassant ? 100 : BASE_CP[board[a.toR][a.toC]?.toLowerCase()] || 0;
    const capB = b.isEnPassant ? 100 : BASE_CP[board[b.toR][b.toC]?.toLowerCase()] || 0;
    const proA = a.promotion ? BASE_CP[a.promotion] || 800 : 0;
    const proB = b.promotion ? BASE_CP[b.promotion] || 800 : 0;
    return capB + proB - (capA + proA);
  });
}

function quiesceSearch(node, alpha, beta, qDepth) {
  if (isSideInCheck(node.board, node.turn)) {
    const evasions = getAllLegalMovesForState(node);
    if (evasions.length === 0) return -(19000 + qDepth * 50);
  }
  const standPatRaw = evaluateBoardForWhite(node.board);
  const standPat = node.turn === 'w' ? standPatRaw : -standPatRaw;
  if (standPat >= beta) return beta;
  if (alpha < standPat) alpha = standPat;
  if (qDepth <= 0) return standPat;

  const all = getAllLegalMovesForState(node);
  if (all.length === 0) {
    if (isSideInCheck(node.board, node.turn)) return -19000;
    return 0;
  }

  const captures = orderMovesForSearch(
    node.board,
    all.filter((m) => m.isEnPassant || m.promotion || node.board[m.toR][m.toC] !== '.'),
  );

  for (const mv of captures) {
    const child = makeLightSearchChild(node, mv);
    const score = -quiesceSearch(child, -beta, -alpha, qDepth - 1);
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }
  return alpha;
}

function negamax(node, depth, alpha, beta, useQuiesce) {
  const moves = getAllLegalMovesForState(node);
  if (moves.length === 0) {
    if (isSideInCheck(node.board, node.turn)) return -(19000 + depth * 50);
    return 0;
  }
  if (depth <= 0) {
    if (useQuiesce) return quiesceSearch(node, alpha, beta, 2);
    const raw = evaluateBoardForWhite(node.board);
    return node.turn === 'w' ? raw : -raw;
  }

  const ordered = orderMovesForSearch(node.board, moves);
  let best = -Infinity;
  for (const mv of ordered) {
    const child = makeLightSearchChild(node, mv);
    const val = -negamax(child, depth - 1, -beta, -alpha, useQuiesce);
    if (val > best) best = val;
    if (val > alpha) alpha = val;
    if (alpha >= beta) break;
  }
  return best;
}

export function chooseBestMove(game, level = 'elizabeth_i') {
  const legal = getAllLegalMovesForState(game);
  if (legal.length === 0) return null;
  if (legal.length === 1) return legal[0];

  const bot = resolveBotProfile(level);
  const candidates = legal.filter((m) => !m.promotion || m.promotion === 'q' || m.promotion === 'n');

  // Alan Turing (1700 Boss) uses his 1948 Turochamp classical opening book in the first 6 plies
  if (bot.style === 'engine') {
    const bookMv = pickTuringBookMove(game.moveLog, candidates, sqName);
    if (bookMv) return bookMv;
  }

  const searchDepth = bot.searchDepth ?? 1;
  const jitter = bot.jitter ?? 28;
  const useQuiesce = Boolean(bot.useQuiesce);

  const ordered = orderMovesForSearch(game.board, candidates);
  let bestMove = ordered[0];
  let bestScore = -Infinity;

  for (const mv of ordered) {
    const child = makeLightSearchChild(game, mv);
    let exactScore = -negamax(child, searchDepth, -30000, 30000, useQuiesce);

    // Distinct Historical Personality Biases
    const movingPiece = (game.board[mv.fromR]?.[mv.fromC] || '').toLowerCase();
    const isCapture = mv.isEnPassant || game.board[mv.toR]?.[mv.toC] !== '.';
    const givesCheck = isSideInCheck(child.board, child.turn);

    if (bot.style === 'reckless') {
      // Henry VIII: greedy captures + rash early Queen sorties
      if (isCapture) exactScore += 55;
      if (movingPiece === 'q' && (game.moveLog?.length || 0) < 12) exactScore += 42;
      if (givesCheck) exactScore += 35;
    } else if (bot.style === 'raider') {
      // Boudicca: aggressive Knight charges & checks
      if (movingPiece === 'n') exactScore += 32;
      if (givesCheck) exactScore += 45;
      if (isCapture) exactScore += 28;
    } else if (bot.style === 'solid') {
      // Elizabeth I: castles early & keeps Queen safe in opening
      if (mv.castleSide) exactScore += 60;
      if (movingPiece === 'q' && (game.moveLog?.length || 0) < 10) exactScore -= 38;
    } else if (bot.style === 'tactical') {
      // Napoleon: central control + long-range Bishops + forcing checks
      if (mv.toR >= 2 && mv.toR <= 5 && mv.toC >= 2 && mv.toC <= 5) exactScore += 24;
      if (movingPiece === 'b') exactScore += 18;
      if (givesCheck) exactScore += 26;
    } else if (bot.style === 'engine') {
      // Alan Turing: bonus for castling, Rook on 7th rank, and clean development
      if (mv.castleSide) exactScore += 35;
      if (movingPiece === 'r' && (mv.toR === 1 || mv.toR === 6)) exactScore += 22;
    }

    // Slight repetition avoidance when winning
    const childKey = computePositionKey(child);
    if ((game.positionCounts?.[childKey] || 0) >= 2 && exactScore > -40) {
      exactScore -= 120;
    }

    const noisyScore =
      Math.abs(exactScore) > 15000 ? exactScore : exactScore + (Math.random() * 2 - 1) * jitter;

    if (noisyScore > bestScore) {
      bestScore = noisyScore;
      bestMove = mv;
    }
  }

  return bestMove;
}

export function computePostGameCoachReview(vc, reviewSide = 'w') {
  const snaps = vc.history || [];
  const logs = vc.moveLog || [];
  if (snaps.length < 2 || logs.length < 2) return null;

  const counts = { best: 0, good: 0, inaccuracy: 0, blunder: 0 };
  let scoreSum = 0;
  let moveCount = 0;
  let bestMoveItem = null;
  let worstCpLoss = -1;
  let blunderItem = null;
  const annotations = {}; // moveLog index -> glyph

  const total = Math.min(snaps.length, logs.length);
  for (let i = 0; i < total; i++) {
    const logItem = logs[i];
    const snap = snaps[i];
    if (!logItem || !snap || logItem.side !== reviewSide) continue;

    const legal = getAllLegalMovesForState(snap);
    if (legal.length <= 1) {
      counts.best++;
      scoreSum += 100;
      moveCount++;
      annotations[i] = '⭐';
      continue;
    }

    // Evaluate played board (next snapshot or final vc.board)
    const afterBoard = i + 1 < snaps.length ? snaps[i + 1].board : vc.board;
    const afterTurn = reviewSide === 'w' ? 'b' : 'w';
    const afterNode = {
      board: afterBoard,
      turn: afterTurn,
      castling: snap.castling || {},
      enPassant: null,
    };
    const playedEval = -quiesceSearch(afterNode, -30000, 30000, 1);

    // Find best move in that position (fast 1-ply + quiescence)
    const ordered = orderMovesForSearch(snap.board, legal).slice(0, 18);
    let topEval = playedEval;
    let topMv = ordered[0];
    for (const cand of ordered) {
      const child = makeLightSearchChild(snap, cand);
      const ev = -quiesceSearch(child, -30000, 30000, 1);
      if (ev > topEval) {
        topEval = ev;
        topMv = cand;
      }
    }

    const cpLoss = Math.max(0, Math.min(900, topEval - playedEval));
    moveCount++;

    if (cpLoss <= 22) {
      counts.best++;
      scoreSum += 100;
      annotations[i] = '⭐';
      if (!bestMoveItem || playedEval > bestMoveItem.evalScore) {
        bestMoveItem = {
          plyIndex: i,
          moveNumber: Math.floor(i / 2) + 1,
          san: logItem.san,
          evalScore: playedEval,
        };
      }
    } else if (cpLoss <= 65) {
      counts.good++;
      scoreSum += 87;
      annotations[i] = '👍';
    } else if (cpLoss <= 145) {
      counts.inaccuracy++;
      scoreSum += 62;
      annotations[i] = '⚠️';
      if (cpLoss > worstCpLoss && topMv) {
        worstCpLoss = cpLoss;
        const nextLegal = getAllLegalMovesForState(makeLightSearchChild(snap, topMv));
        const nextCheck = isSideInCheck(applyMoveToBoardClone(snap.board, topMv), afterTurn);
        blunderItem = {
          historyIdx: i,
          moveNumber: Math.floor(i / 2) + 1,
          playedSan: logItem.san,
          bestSan: formatMoveSAN(snap, topMv, legal, nextCheck, nextLegal.length > 0),
          fromR: topMv.fromR,
          fromC: topMv.fromC,
          toR: topMv.toR,
          toC: topMv.toC,
          fromSq: sqName(topMv.fromR, topMv.fromC),
          toSq: sqName(topMv.toR, topMv.toC),
          cpLoss: Math.round(cpLoss),
          label: 'Inaccuracy',
        };
      }
    } else {
      counts.blunder++;
      const mvScore = Math.max(15, Math.round(44 - (cpLoss - 145) / 16));
      scoreSum += mvScore;
      annotations[i] = '❓';
      if (cpLoss > worstCpLoss && topMv) {
        worstCpLoss = cpLoss;
        const nextLegal = getAllLegalMovesForState(makeLightSearchChild(snap, topMv));
        const nextCheck = isSideInCheck(applyMoveToBoardClone(snap.board, topMv), afterTurn);
        blunderItem = {
          historyIdx: i,
          moveNumber: Math.floor(i / 2) + 1,
          playedSan: logItem.san,
          bestSan: formatMoveSAN(snap, topMv, legal, nextCheck, nextLegal.length > 0),
          fromR: topMv.fromR,
          fromC: topMv.fromC,
          toR: topMv.toR,
          toC: topMv.toC,
          fromSq: sqName(topMv.fromR, topMv.fromC),
          toSq: sqName(topMv.toR, topMv.toC),
          cpLoss: Math.round(cpLoss),
          label: 'Blunder',
        };
      }
    }
  }

  if (moveCount === 0) return null;
  const accuracyPct = Math.max(14, Math.min(99, Math.round(scoreSum / moveCount)));
  return {
    reviewSide,
    accuracyPct,
    moveCount,
    counts,
    bestMoveItem,
    blunderItem,
    annotations,
  };
}

export function computeCoachHint(game) {
  const best = chooseBestMove(game, 'turing');
  if (!best) return null;

  const allBefore = getAllLegalMovesForState(game);
  const afterBoard = applyMoveToBoardClone(game.board, best);
  const nextTurn = game.turn === 'w' ? 'b' : 'w';
  const nextLegal = getAllLegalMovesForState({
    board: afterBoard,
    turn: nextTurn,
    castling: game.castling,
    enPassant: null,
  });
  const nextInCheck = isSideInCheck(afterBoard, nextTurn);
  const san = formatMoveSAN(game, best, allBefore, nextInCheck, nextLegal.length > 0);
  const captured = best.isEnPassant ? 'p' : game.board[best.toR][best.toC];

  let reason = 'improves your piece activity and board control.';
  if (!nextLegal.length && nextInCheck) reason = 'delivers Checkmate on the spot!';
  else if (best.castleSide) reason = 'castles your King to safety and activates your Rook.';
  else if (best.promotion) reason = 'promotes your Pawn into a powerful new piece!';
  else if (captured && captured !== '.' && nextInCheck)
    reason = 'wins material with a forcing Check!';
  else if (captured && captured !== '.') reason = 'captures an opponent piece cleanly.';
  else if (nextInCheck) reason = 'puts the enemy King in Check!';
  else if (best.toR >= 2 && best.toR <= 5 && best.toC >= 2 && best.toC <= 5) {
    reason = 'fights for the key central squares.';
  }

  return {
    ...best,
    san,
    fromSq: sqName(best.fromR, best.fromC),
    toSq: sqName(best.toR, best.toC),
    reason,
  };
}

// ============================================================================
// 4. VIRTUAL CHESS SET UI RENDERER
// ============================================================================
function formatClockSecs(secs) {
  const safe = Math.max(0, Math.floor(secs || 0));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function computeMaterialDiff(board) {
  let w = 0;
  let b = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const ch = board[r][c];
      if (ch === '.') continue;
      const pts = PIECE_VALUES[ch.toLowerCase()] || 0;
      if (isWhitePiece(ch)) w += pts;
      else b += pts;
    }
  }
  return w - b;
}

function renderCapturedRow(capturedList, advantagePts, isWhiteRow) {
  const order = { q: 1, r: 2, b: 3, n: 4, p: 5 };
  const sorted = [...(capturedList || [])].sort((a, b) => (order[a] || 9) - (order[b] || 9));
  const icons = sorted.map((c) => SMALL_CAPTURE_GLYPHS[c] || '').join('');
  const advHtml =
    advantagePts > 0
      ? `<span style="background: #dcfce7; color: #166534; font-size: 0.7rem; font-weight: 800; padding: 1px 6px; border-radius: 999px; font-family: monospace;">+${advantagePts}</span>`
      : '';
  return `
    <div style="display: flex; align-items: center; gap: 5px; height: 20px; line-height: 20px; overflow: hidden; white-space: nowrap;">
      <span style="font-size: 0.9rem; line-height: 1; letter-spacing: -1px; color: ${isWhiteRow ? '#334155' : '#475569'}; font-family: 'Segoe UI Symbol', 'Apple Symbols', serif; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${icons}</span>
      ${advHtml}
    </div>
  `;
}

function getStatusBannerInfo(vc, whiteLabel, blackLabel, botProfile) {
  if (vc.mode === 'daily') {
    const puz = DAILY_TACTICAL_PUZZLES[vc.dailyPuzzleIdx % DAILY_TACTICAL_PUZZLES.length];
    if (vc.status === 'checkmate') {
      return {
        bg: '#ecfdf5',
        border: '#6ee7b7',
        color: '#065f46',
        text: `🏆 Puzzle Solved! ${puz.title} — Checkmate!`,
      };
    }
    return {
      bg: '#eff6ff',
      border: '#93c5fd',
      color: '#1e3a8a',
      text: `🧩 ${puz.title} (${puz.theme}) · Find Checkmate in 1 move!`,
    };
  }

  if (vc.mode === 'online' && (!vc.onlineRoomCode || vc.onlineRoomData?.status === 'waiting')) {
    return {
      bg: '#f0f9ff',
      border: '#7dd3fc',
      color: '#0369a1',
      text: vc.onlineRoomCode
        ? `📡 Room ${vc.onlineRoomCode} Ready — Waiting for classmate's laptop to join...`
        : '🌐 Live 2-Laptop Duel · Create a Room Code or enter a friend’s code!',
    };
  }

  if (vc.replayPlyIndex !== null && vc.replayPlyIndex !== undefined) {
    return {
      bg: '#fefce8',
      border: '#fde047',
      color: '#854d0e',
      text: `⏪ Move Replay (Ply ${vc.replayPlyIndex}/${vc.moveLog.length}) · Click ⏭ for Live Board`,
    };
  }

  if (vc.status === 'checkmate') {
    const winName = vc.winner === 'w' ? whiteLabel : blackLabel;
    return {
      bg: '#ecfdf5',
      border: '#6ee7b7',
      color: '#065f46',
      text: `🏆 Checkmate! ${winName} wins the game!`,
    };
  }
  if (vc.status === 'timeout') {
    const winName = vc.winner === 'w' ? whiteLabel : blackLabel;
    return {
      bg: '#ecfdf5',
      border: '#6ee7b7',
      color: '#065f46',
      text: `⏰ Time Up! ${winName} wins on time!`,
    };
  }
  if (vc.status === 'resigned') {
    const winName = vc.winner === 'w' ? whiteLabel : blackLabel;
    return {
      bg: '#ecfdf5',
      border: '#6ee7b7',
      color: '#065f46',
      text: `🏳️ Resignation — ${winName} wins!`,
    };
  }
  if (vc.status === 'stalemate') {
    return {
      bg: '#fefce8',
      border: '#fde047',
      color: '#854d0e',
      text: '🤝 Stalemate! No legal moves & not in check — Draw!',
    };
  }
  if (
    vc.status === 'draw_repetition' ||
    vc.status === 'draw_50' ||
    vc.status === 'draw_material' ||
    vc.status === 'draw_agreed'
  ) {
    const why =
      vc.status === 'draw_repetition'
        ? 'Threefold Repetition'
        : vc.status === 'draw_50'
          ? '50-Move Rule'
          : vc.status === 'draw_material'
            ? 'Insufficient Material'
            : 'Mutual Agreement';
    return {
      bg: '#f8fafc',
      border: '#cbd5e1',
      color: '#334155',
      text: `🤝 Game Drawn (${why}).`,
    };
  }

  if (vc.aiThinking) {
    return {
      bg: '#eff6ff',
      border: '#93c5fd',
      color: '#1e40af',
      text: `${botProfile ? botProfile.icon : '🤖'} ${botProfile ? botProfile.shortName : 'Computer'} (${botProfile ? botProfile.elo : ''} ELO) is thinking...`,
    };
  }

  const inCheck = isSideInCheck(vc.board, vc.turn);
  const turnLabel = vc.turn === 'w' ? `♔ ${whiteLabel} to move` : `♚ ${blackLabel} to move`;
  if (inCheck) {
    return {
      bg: '#fef2f2',
      border: '#fca5a5',
      color: '#991b1b',
      text: `🚨 CHECK! ${turnLabel} — protect your King!`,
    };
  }
  if (vc.mode === 'online' && vc.turn !== vc.onlineSide) {
    return {
      bg: '#f8fafc',
      border: '#cbd5e1',
      color: '#475569',
      text: `⏳ ${turnLabel} · Waiting for opponent's move...`,
    };
  }
  return {
    bg: '#f8fafc',
    border: '#e2e8f0',
    color: '#0f172a',
    text: `${turnLabel} · Tap or drag a piece`,
  };
}

function renderVirtualChessInner(chessState) {
  if (!chessState.virtualChess) {
    chessState.virtualChess = createDefaultVirtualChessState();
  }
  const vc = chessState.virtualChess;
  const players = chessState.players || [];
  const botProfile = resolveBotProfile(vc.aiLevel);

  const whiteRoster = vc.whitePlayerId ? players.find((p) => p.id === vc.whitePlayerId) : null;
  const blackRoster = vc.blackPlayerId ? players.find((p) => p.id === vc.blackPlayerId) : null;

  // Auto-activate if pupil's pending join Callsign was approved onto the Ladder!
  let pendingJoin = getPendingJoinLocal();
  if (pendingJoin && pendingJoin.callsign) {
    const newlyApproved = players.find(
      (p) => String(p.name || '').toLowerCase() === String(pendingJoin.callsign).toLowerCase(),
    );
    if (newlyApproved) {
      vc.tappedInPlayerId = newlyApproved.id;
      saveTappedInPlayerId(newlyApproved.id);
      clearPendingJoinLocal();
      pendingJoin = null;
    }
  }

  const tappedPupil = vc.tappedInPlayerId
    ? players.find((p) => p.id === vc.tappedInPlayerId)
    : null;
  const xpInfo = getPupilXpProgress(tappedPupil);
  const tappedHouse = tappedPupil ? HOUSES[tappedPupil.house] : null;
  const dailyProg = readDailyPuzzleProgress(tappedPupil ? tappedPupil.id : 'guest');

  const humanDisplayLabel = tappedPupil ? tappedPupil.name : 'You';

  const whiteLabel =
    vc.mode === 'ai'
      ? vc.humanSide === 'w'
        ? `${humanDisplayLabel} (White)`
        : `${botProfile.icon} ${botProfile.name} (${botProfile.elo})`
      : vc.mode === 'online'
        ? vc.onlineRoomData?.white?.callsign
          ? `${vc.onlineRoomData.white.callsign}${vc.onlineSide === 'w' ? ' (You)' : ''}`
          : 'Waiting for White...'
        : vc.mode === 'daily'
          ? `${humanDisplayLabel} (Tactician)`
          : whiteRoster
            ? whiteRoster.name
            : 'White Player';

  const blackLabel =
    vc.mode === 'ai'
      ? vc.humanSide === 'b'
        ? `${humanDisplayLabel} (Black)`
        : `${botProfile.icon} ${botProfile.name} (${botProfile.elo})`
      : vc.mode === 'online'
        ? vc.onlineRoomData?.black?.callsign
          ? `${vc.onlineRoomData.black.callsign}${vc.onlineSide === 'b' ? ' (You)' : ''}`
          : 'Waiting for Classmate...'
        : vc.mode === 'daily'
          ? '🧩 Puzzle Defence'
          : blackRoster
            ? blackRoster.name
            : 'Black Player';

  const topSide = vc.flipped ? 'w' : 'b';
  const bottomSide = vc.flipped ? 'b' : 'w';

  // Support historical replay scrubbing without mutating live game state
  const isReplaying =
    vc.replayPlyIndex !== null &&
    vc.replayPlyIndex !== undefined &&
    vc.replayPlyIndex < vc.history.length;
  const displaySnap = isReplaying ? vc.history[vc.replayPlyIndex] : null;
  const displayBoard = displaySnap ? displaySnap.board : vc.board;
  const displayLastMove = displaySnap ? displaySnap.lastMove : vc.lastMove;

  const matDiff = computeMaterialDiff(displayBoard);
  const legalTargets = new Map();
  const isMyInteractiveTurn =
    !isReplaying &&
    vc.status === 'playing' &&
    !vc.aiThinking &&
    !vc.pendingPromotion &&
    (vc.mode === 'pass' ||
      vc.mode === 'daily' ||
      (vc.mode === 'ai' && vc.turn === vc.humanSide) ||
      (vc.mode === 'online' &&
        vc.onlineRoomData?.status === 'playing' &&
        vc.turn === vc.onlineSide));

  if (vc.selected && isMyInteractiveTurn) {
    const moves = getLegalMovesFrom(vc, vc.selected[0], vc.selected[1]);
    moves.forEach((m) => {
      const key = `${m.toR},${m.toC}`;
      if (!legalTargets.has(key)) legalTargets.set(key, m);
    });
  }

  const activeTurnForCheck = displaySnap ? displaySnap.turn : vc.turn;
  const checkSide =
    vc.status === 'playing' || vc.status === 'checkmate' || isReplaying
      ? isSideInCheck(displayBoard, activeTurnForCheck)
        ? activeTurnForCheck
        : null
      : null;
  const checkKingSq = checkSide ? findKingSquare(displayBoard, checkSide) : null;

  const lightSq = vc.boardTheme === 'slate' ? '#e2e8f0' : '#f0d9b5';
  const darkSq = vc.boardTheme === 'slate' ? '#64748b' : '#b58863';
  const lastLight = vc.boardTheme === 'slate' ? '#bae6fd' : '#f7ec6e';
  const lastDark = vc.boardTheme === 'slate' ? '#38bdf8' : '#dac34b';
  const hiSet = new Set(vc.highlightedSquares || []);

  // Render 64 squares respecting board orientation
  let squaresHtml = '';
  for (let viewR = 0; viewR < 8; viewR++) {
    for (let viewC = 0; viewC < 8; viewC++) {
      const r = vc.flipped ? 7 - viewR : viewR;
      const c = vc.flipped ? 7 - viewC : viewC;
      const sqStr = sqName(r, c);
      const isLight = (r + c) % 2 === 0;
      const piece = displayBoard[r][c];
      const isSelected = !isReplaying && vc.selected && vc.selected[0] === r && vc.selected[1] === c;
      const isLast =
        displayLastMove &&
        ((displayLastMove.from[0] === r && displayLastMove.from[1] === c) ||
          (displayLastMove.to[0] === r && displayLastMove.to[1] === c));
      const isHintFrom = !isReplaying && vc.hintMove && vc.hintMove.fromR === r && vc.hintMove.fromC === c;
      const isHintTo = !isReplaying && vc.hintMove && vc.hintMove.toR === r && vc.hintMove.toC === c;
      const isCheckSq = checkKingSq && checkKingSq[0] === r && checkKingSq[1] === c;
      const isTarget = legalTargets.has(`${r},${c}`);
      const isRightHi = hiSet.has(sqStr);

      let bg = isLight ? lightSq : darkSq;
      if (isLast) bg = isLight ? lastLight : lastDark;
      if (isHintFrom || isHintTo) bg = '#fde047';
      if (isSelected) bg = '#7dd3fc';
      if (isRightHi) bg = isLight ? '#86efac' : '#22c55e';
      if (isCheckSq) bg = 'radial-gradient(circle, #ef4444 18%, #dc2626 68%, #991b1b 100%)';

      const canDrag = isMyInteractiveTurn && piece !== '.' && sideOf(piece) === vc.turn;

      const rankLabel =
        viewC === 0
          ? `<span style="position: absolute; top: 2px; left: 3px; font-size: 0.64rem; font-weight: 800; font-family: monospace; color: ${isLight ? darkSq : lightSq}; pointer-events: none; line-height: 1;">${8 - r}</span>`
          : '';
      const fileLabel =
        viewR === 7
          ? `<span style="position: absolute; bottom: 1px; right: 3px; font-size: 0.64rem; font-weight: 800; font-family: monospace; color: ${isLight ? darkSq : lightSq}; pointer-events: none; line-height: 1;">${String.fromCharCode(97 + c)}</span>`
          : '';

      const targetOverlay = isTarget
        ? piece === '.'
          ? `<span style="position: absolute; width: 28%; height: 28%; border-radius: 50%; background: rgba(22, 163, 74, 0.55); pointer-events: none;"></span>`
          : `<span style="position: absolute; inset: 3px; border: 3.5px solid rgba(22, 163, 74, 0.78); border-radius: 50%; pointer-events: none;"></span>`
        : '';

      squaresHtml += `
        <div onclick="window.handleVirtualSquareTap(${r}, ${c})"
             onmousedown="window.handleVirtualRightDown(event, ${r}, ${c})"
             onmouseup="window.handleVirtualRightUp(event, ${r}, ${c})"
             ondragstart="window.handleVirtualDragStart(event, ${r}, ${c})"
             ondragend="window.handleVirtualDragEnd()"
             ondragover="event.preventDefault()"
             ondrop="window.handleVirtualDrop(event, ${r}, ${c})"
             draggable="${canDrag ? 'true' : 'false'}"
             data-sq="${sqStr}"
             style="background: ${bg}; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; position: relative; user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent; cursor: ${canDrag || isTarget ? 'pointer' : 'default'}; touch-action: manipulation; ${isHintTo ? 'box-shadow: inset 0 0 0 3px #d97706;' : ''}">
          ${rankLabel}
          ${fileLabel}
          ${renderStauntonSvg(piece)}
          ${targetOverlay}
        </div>
      `;
    }
  }

  // Right-click tactical SVG arrows overlay (Chess.com style for Windows mice/trackpads)
  let arrowsSvgHtml = '';
  if (Array.isArray(vc.drawnArrows) && vc.drawnArrows.length > 0) {
    const lines = vc.drawnArrows
      .map((ar) => {
        const vr1 = vc.flipped ? 7 - ar.from[0] : ar.from[0];
        const vc1 = vc.flipped ? 7 - ar.from[1] : ar.from[1];
        const vr2 = vc.flipped ? 7 - ar.to[0] : ar.to[0];
        const vc2 = vc.flipped ? 7 - ar.to[1] : ar.to[1];
        const x1 = vc1 * 100 + 50;
        const y1 = vr1 * 100 + 50;
        const x2 = vc2 * 100 + 50;
        const y2 = vr2 * 100 + 50;
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(245, 158, 11, 0.85)" stroke-width="18" stroke-linecap="round" marker-end="url(#vc-arrow-head)" />`;
      })
      .join('');
    arrowsSvgHtml = `
      <svg viewBox="0 0 800 800" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 12;">
        <defs>
          <marker id="vc-arrow-head" markerWidth="4" markerHeight="4" refX="2.4" refY="2" orient="auto">
            <polygon points="0 0, 4 2, 0 4" fill="rgba(245, 158, 11, 0.92)" />
          </marker>
        </defs>
        ${lines}
      </svg>
    `;
  }

  const renderPlayerStrip = (side) => {
    const isWhite = side === 'w';
    const name = isWhite ? whiteLabel : blackLabel;
    const isActiveTurn = vc.status === 'playing' && vc.turn === side;
    const captured = isWhite
      ? displaySnap
        ? displaySnap.capturedByWhite
        : vc.capturedByWhite
      : displaySnap
        ? displaySnap.capturedByBlack
        : vc.capturedByBlack;
    const adv = isWhite ? Math.max(0, matDiff) : Math.max(0, -matDiff);
    const secs = isWhite ? vc.whiteTimeSecs : vc.blackTimeSecs;
    const lowTime = vc.timeControlMins > 0 && secs <= 30;

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; height: 52px; overflow: hidden; box-sizing: border-box; background: ${isActiveTurn ? '#ffffff' : '#f8fafc'}; border: 1.5px solid ${isActiveTurn ? '#0284c7' : '#e2e8f0'}; border-radius: 9px; padding: 5px 10px; box-shadow: ${isActiveTurn ? '0 2px 8px rgba(2,132,199,0.12)' : 'none'};">
        <div style="display: flex; align-items: center; gap: 9px; min-width: 0; flex: 1; overflow: hidden;">
          <span style="width: 26px; height: 26px; border-radius: 6px; background: ${isWhite ? '#f8fafc' : '#1e293b'}; color: ${isWhite ? '#0f172a' : '#ffffff'}; border: 1.5px solid #cbd5e1; display: inline-flex; align-items: center; justify-content: center; font-size: 0.95rem; font-weight: 900; flex-shrink: 0;">
            ${isWhite ? '♔\uFE0E' : '♚\uFE0E'}
          </span>
          <div style="min-width: 0; flex: 1; overflow: hidden;">
            <div style="font-size: 0.88rem; line-height: 1.25; font-weight: 800; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${name}
              ${isActiveTurn ? `<span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #16a34a; margin-left: 5px; vertical-align: middle;"></span>` : ''}
            </div>
            ${renderCapturedRow(captured, adv, isWhite)}
          </div>
        </div>

        ${
          vc.timeControlMins > 0 && vc.mode !== 'daily'
            ? `
          <div id="vc-clock-${side}" style="font-family: 'JetBrains Mono', monospace; font-size: 1.15rem; font-weight: 900; padding: 4px 10px; border-radius: 7px; background: ${isActiveTurn ? (lowTime ? '#fef2f2' : '#0f172a') : '#e2e8f0'}; color: ${isActiveTurn ? (lowTime ? '#dc2626' : '#4ade80') : '#475569'}; border: 1px solid ${lowTime && isActiveTurn ? '#fca5a5' : 'transparent'}; flex-shrink: 0;">
            ${formatClockSecs(secs)}
          </div>
        `
            : ''
        }
      </div>
    `;
  };

  // Format move pairs with Coach Review badges & clickable replay scrubbing
  const ann = vc.gameReview?.annotations || {};
  let moveRowsHtml = '';
  for (let i = 0; i < vc.moveLog.length; i += 2) {
    const num = Math.floor(i / 2) + 1;
    const wSan = vc.moveLog[i]?.san || '';
    const bSan = vc.moveLog[i + 1]?.san || '';
    const wTag = ann[i] ? ` ${ann[i]}` : '';
    const bTag = ann[i + 1] ? ` ${ann[i + 1]}` : '';
    const wAct = vc.replayPlyIndex === i + 1;
    const bAct = vc.replayPlyIndex === i + 2;
    moveRowsHtml += `
      <div style="display: grid; grid-template-columns: 30px 1fr 1fr; padding: 2px 6px; font-family: monospace; font-size: 0.77rem; background: ${num % 2 === 0 ? '#f8fafc' : '#ffffff'}; border-radius: 4px; align-items: center;">
        <span style="color: #94a3b8; font-weight: 700;">${num}.</span>
        <span onclick="window.scrubVirtualMove(${i + 1})" style="color: #0f172a; font-weight: 700; cursor: pointer; padding: 1px 4px; border-radius: 4px; background: ${wAct ? '#bae6fd' : 'transparent'};">${wSan}${wTag}</span>
        ${
          bSan
            ? `<span onclick="window.scrubVirtualMove(${i + 2})" style="color: #334155; font-weight: 700; cursor: pointer; padding: 1px 4px; border-radius: 4px; background: ${bAct ? '#bae6fd' : 'transparent'};">${bSan}${bTag}</span>`
            : '<span></span>'
        }
      </div>
    `;
  }

  const openingName = vc.mode !== 'daily' ? detectOpeningName(vc.moveLog) : '';
  const banner = getStatusBannerInfo(vc, whiteLabel, blackLabel, botProfile);
  const isFinished = vc.status !== 'playing';
  const canTeacherLog =
    chessState.userRole === 'teacher' &&
    vc.mode === 'pass' &&
    whiteRoster &&
    blackRoster &&
    whiteRoster.id !== blackRoster.id &&
    isFinished;

  // Post-Game Coach Review Card HTML (appears below board when game ends — 0px shift to board above!)
  let coachReviewHtml = '';
  if (isFinished && vc.gameReview && vc.mode !== 'daily') {
    const rev = vc.gameReview;
    const accColor =
      rev.accuracyPct >= 85 ? '#059669' : rev.accuracyPct >= 68 ? '#0284c7' : '#d97706';
    coachReviewHtml = `
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #f8fafc; border-radius: 11px; padding: 12px 14px; border: 1.5px solid #38bdf8; box-shadow: 0 6px 18px rgba(15,23,42,0.18);">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap;">
          <div>
            <div style="font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #38bdf8;">
              🎓 Post-Game Coach Review
            </div>
            <div style="font-size: 0.92rem; font-weight: 900; color: #ffffff;">
              Game Accuracy: <span style="background: ${accColor}; color: #ffffff; padding: 2px 8px; border-radius: 999px; font-family: monospace;">${rev.accuracyPct}%</span>
              ${rev.accuracyPct >= 85 ? `<span style="font-size: 0.72rem; color: #6ee7b7; margin-left: 4px;">⚡ Precision Bonus!</span>` : ''}
            </div>
          </div>
          <div style="display: flex; gap: 6px; font-size: 0.72rem; font-weight: 800; font-family: monospace;">
            <span style="background: rgba(255,255,255,0.1); padding: 3px 7px; border-radius: 6px;">⭐ ${rev.counts.best}</span>
            <span style="background: rgba(255,255,255,0.1); padding: 3px 7px; border-radius: 6px;">👍 ${rev.counts.good}</span>
            <span style="background: rgba(255,255,255,0.1); padding: 3px 7px; border-radius: 6px;">⚠️ ${rev.counts.inaccuracy}</span>
            <span style="background: rgba(239,68,68,0.25); color: #fca5a5; padding: 3px 7px; border-radius: 6px;">❓ ${rev.counts.blunder}</span>
          </div>
        </div>

        ${
          rev.bestMoveItem
            ? `<div style="font-size: 0.76rem; color: #cbd5e1; margin-bottom: 4px;">⭐ <strong>Star Move:</strong> Move ${rev.bestMoveItem.moveNumber} (<strong>${rev.bestMoveItem.san}</strong>)</div>`
            : ''
        }

        ${
          rev.blunderItem
            ? `
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; background: rgba(255,255,255,0.07); border: 1px solid rgba(251,191,36,0.4); border-radius: 8px; padding: 7px 10px; margin-top: 6px;">
            <div style="font-size: 0.75rem; color: #fde68a;">
              ❓ <strong>Key ${rev.blunderItem.label} (Move ${rev.blunderItem.moveNumber}):</strong> Played <strong>${rev.blunderItem.playedSan}</strong> — Coach liked <strong>${rev.blunderItem.bestSan}</strong> (${rev.blunderItem.fromSq}→${rev.blunderItem.toSq})
            </div>
            <button type="button" onclick="window.retryCoachBlunder()" style="background: #fbbf24; color: #0f172a; border: none; border-radius: 6px; padding: 5px 10px; font-size: 0.74rem; font-weight: 900; cursor: pointer; flex-shrink: 0;">
              🔄 Retry Mistake
            </button>
          </div>
        `
            : `<div style="font-size: 0.75rem; color: #86efac; margin-top: 4px;">✨ Clean sheet — zero major blunders detected!</div>`
        }
      </div>
    `;
  }

  const activePuzzle = DAILY_TACTICAL_PUZZLES[vc.dailyPuzzleIdx % DAILY_TACTICAL_PUZZLES.length];
  const todayDailyObj = getTodayDailyPuzzle();

  const innerHtml = `
    <style>
      .vc-layout-grid {
        display: grid;
        grid-template-columns: clamp(290px, calc(100vh - 455px), 425px) minmax(280px, 380px);
        gap: 18px;
        justify-content: center;
        align-items: start;
      }
      @media (max-width: 820px) {
        .vc-layout-grid {
          grid-template-columns: 1fr;
          max-width: 460px;
          margin: 0 auto;
        }
        .vc-select-input {
          font-size: 16px !important;
        }
      }
    </style>

    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 12px 14px; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);">
      
      <!-- Club Member Nickname Tap-In & Practice XP Bar -->
      <div style="background: ${tappedPupil ? 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%)' : '#f8fafc'}; border: 1.5px solid ${tappedHouse ? tappedHouse.borderColor : '#e2e8f0'}; border-radius: 10px; padding: 7px 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span style="font-size: 0.76rem; font-weight: 800; color: #334155;">👤 Club Member Tap-In:</span>
          <select class="vc-select-input" onchange="window.setTappedInPupil(this.value)" style="padding: 5px 10px; border-radius: 8px; border: 1.5px solid ${tappedPupil ? '#0284c7' : '#cbd5e1'}; background: #ffffff; font-size: 0.82rem; font-weight: 800; color: #0f172a; cursor: pointer;">
            <option value="">-- Play as Guest (Tap In to Earn XP!) --</option>
            ${players
              .map((p) => {
                const ph = HOUSES[p.house];
                return `<option value="${p.id}" ${vc.tappedInPlayerId === p.id ? 'selected' : ''}>${p.name} (${ph ? ph.name : p.house})</option>`;
              })
              .join('')}
          </select>
          ${
            tappedPupil
              ? `<button type="button" onclick="window.openChessPlayerProfile && window.openChessPlayerProfile('${tappedPupil.id}')" style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 7px; padding: 4px 9px; font-size: 0.73rem; font-weight: 800; cursor: pointer;">📊 My Card</button>`
              : `
            <button type="button" onclick="window.openPupilJoinRequestModal && window.openPupilJoinRequestModal()" style="background: #ffffff; color: #0284c7; border: 1.5px solid #7dd3fc; border-radius: 8px; padding: 5px 10px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
              + New Member? Get a Callsign
            </button>
          `
          }
        </div>

        ${
          tappedPupil
            ? `
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; flex: 1; justify-content: flex-end; min-width: 240px;">
            ${dailyProg.streak > 0 ? `<span style="background: #fff7ed; border: 1px solid #fdba74; color: #c2410c; padding: 3px 8px; border-radius: 999px; font-size: 0.72rem; font-weight: 800;">🔥 ${dailyProg.streak}d Streak</span>` : ''}
            <span style="background: #ffffff; border: 1px solid #cbd5e1; color: ${xpInfo.badge.color}; padding: 3px 9px; border-radius: 999px; font-size: 0.74rem; font-weight: 800;">
              ${xpInfo.badge.icon} ${xpInfo.badge.title} · ${xpInfo.totalXp} XP
            </span>
            <div style="display: flex; flex-direction: column; gap: 3px; min-width: 175px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.68rem; font-weight: 800; color: #475569;">
                <span>⚡ ${xpInfo.towardHousePt}/100 XP → +1 ${tappedHouse ? tappedHouse.name : 'House'} Pt</span>
                <span style="color: #64748b;">Today: ${xpInfo.usedToday}/${DAILY_XP_CAP}</span>
              </div>
              <div style="width: 100%; height: 7px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
                <div style="width: ${xpInfo.towardHousePt}%; height: 100%; background: ${tappedHouse ? tappedHouse.color : '#0284c7'}; border-radius: 999px;"></div>
              </div>
            </div>
          </div>
        `
            : pendingJoin && pendingJoin.callsign
              ? `
          <div style="background: #fffbeb; border: 1px solid #fde68a; color: #92400e; padding: 4px 10px; border-radius: 8px; font-size: 0.74rem; font-weight: 800;">
            ⏳ Pending Callsign: <strong>${pendingJoin.callsign}</strong> — Tell your teacher in person to get approved!
          </div>
        `
              : `
          <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">
            ⚡ Beat History Bots, solve Daily Puzzles, or play Live Laptop Duels (<strong style="color: #0f172a;">100 XP = +1 House Pt</strong>)
          </div>
        `
        }
      </div>

      <div class="vc-layout-grid">
        
        <!-- LEFT COLUMN: Playable Staunton Chessboard + Top/Bottom Player Bars -->
        <div style="display: flex; flex-direction: column; gap: 6px; width: 100%;">
          
          <!-- Fixed-Height Status Banner (Strict 0px Vertical Shift) -->
          <div style="background: ${banner.bg}; border: 1.5px solid ${banner.border}; color: ${banner.color}; border-radius: 8px; padding: 0 10px; height: 36px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; font-weight: 800; text-align: center; overflow: hidden;">
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">${banner.text}</span>
          </div>

          ${renderPlayerStrip(topSide)}

          <!-- 8x8 Board Frame (Right-click & drag on Windows laptops draws tactical arrows!) -->
          <div oncontextmenu="event.preventDefault()" style="position: relative; width: 100%; aspect-ratio: 1 / 1; border: 4px solid #1e293b; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 26px rgba(15, 23, 42, 0.16); display: grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(8, 1fr);">
            ${squaresHtml}
            ${arrowsSvgHtml}

            ${
              vc.onlineReactionToast && Date.now() - vc.onlineReactionToast.at < 8000
                ? `
              <div style="position: absolute; top: 10px; right: 10px; background: rgba(15,23,42,0.92); color: #ffffff; border: 1.5px solid #38bdf8; border-radius: 999px; padding: 5px 12px; font-size: 0.78rem; font-weight: 800; z-index: 16; pointer-events: none; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
                ${vc.onlineReactionToast.callsign}: ${vc.onlineReactionToast.text}
              </div>
            `
                : ''
            }

            ${
              vc.pendingPromotion
                ? `
              <div style="position: absolute; inset: 0; background: rgba(15, 23, 42, 0.72); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; z-index: 20; padding: 14px;">
                <div style="color: #ffffff; font-weight: 900; font-size: 0.95rem;">👑 Choose Promotion Piece:</div>
                <div style="display: flex; gap: 10px;">
                  ${['q', 'r', 'b', 'n']
                    .map((pr) => {
                      const code = vc.turn === 'w' ? pr.toUpperCase() : pr;
                      const names = { q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight' };
                      return `
                      <button type="button" onclick="window.chooseVirtualPromotion('${pr}')" style="width: 64px; height: 74px; background: #ffffff; border: 2px solid #fbbf24; border-radius: 10px; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; padding: 6px; box-shadow: 0 6px 16px rgba(0,0,0,0.3);">
                        <div style="width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">${renderStauntonSvg(code)}</div>
                        <span style="font-size: 0.68rem; font-weight: 800; color: #0f172a;">${names[pr]}</span>
                      </button>
                    `;
                    })
                    .join('')}
                </div>
                <button type="button" onclick="window.cancelVirtualPromotion()" style="background: transparent; border: 1px solid #cbd5e1; color: #f8fafc; border-radius: 6px; padding: 4px 12px; font-size: 0.76rem; font-weight: 700; cursor: pointer;">Cancel</button>
              </div>
            `
                : ''
            }
          </div>

          ${renderPlayerStrip(bottomSide)}

          ${
            vc.lastXpNotice
              ? `
            <div style="background: ${vc.lastXpNotice.type === 'earned' ? '#ecfdf5' : '#fffbeb'}; border: 1.5px solid ${vc.lastXpNotice.type === 'earned' ? '#6ee7b7' : '#fde68a'}; color: ${vc.lastXpNotice.type === 'earned' ? '#065f46' : '#92400e'}; border-radius: 9px; padding: 8px 12px; font-size: 0.82rem; font-weight: 800; text-align: center;">
              ${vc.lastXpNotice.text}
            </div>
          `
              : ''
          }

          ${coachReviewHtml}

          ${
            vc.hintMove
              ? `
            <div style="background: #fefce8; border: 1.5px solid #fde047; color: #854d0e; border-radius: 8px; padding: 8px 12px; font-size: 0.82rem; line-height: 1.4;">
              💡 <strong>Coach Hint (${vc.hintMove.san}):</strong> Move <strong>${vc.hintMove.fromSq} → ${vc.hintMove.toSq}</strong> — ${vc.hintMove.reason}
            </div>
          `
              : ''
          }
        </div>

        <!-- RIGHT COLUMN: 4-Mode Selector, Bot / Online / Puzzle Controls & Move Sheet -->
        <div style="display: flex; flex-direction: column; gap: 11px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 13px;">
          
          <!-- 1. 4-Way Play Mode Selector -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
              <span style="font-size: 0.69rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Play Mode</span>
              <span style="font-size: 0.66rem; color: #64748b;">🖱️ Right-drag board for arrows</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; background: #e2e8f0; padding: 3px; border-radius: 9px;">
              <button type="button" onclick="window.setVirtualChessMode('ai')" style="background: ${vc.mode === 'ai' ? '#ffffff' : 'transparent'}; color: ${vc.mode === 'ai' ? '#0f172a' : '#475569'}; border: none; border-radius: 7px; padding: 7px 4px; font-size: 0.74rem; font-weight: 800; cursor: pointer; box-shadow: ${vc.mode === 'ai' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};">
                🤖 Bots (6)
              </button>
              <button type="button" onclick="window.setVirtualChessMode('online')" style="background: ${vc.mode === 'online' ? '#ffffff' : 'transparent'}; color: ${vc.mode === 'online' ? '#0284c7' : '#475569'}; border: none; border-radius: 7px; padding: 7px 4px; font-size: 0.74rem; font-weight: 800; cursor: pointer; box-shadow: ${vc.mode === 'online' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};">
                🌐 Live Duel
              </button>
              <button type="button" onclick="window.setVirtualChessMode('daily')" style="background: ${vc.mode === 'daily' ? '#ffffff' : 'transparent'}; color: ${vc.mode === 'daily' ? '#b45309' : '#475569'}; border: none; border-radius: 7px; padding: 7px 4px; font-size: 0.74rem; font-weight: 800; cursor: pointer; box-shadow: ${vc.mode === 'daily' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};">
                🧩 Daily${!dailyProg.solvedToday ? ' •' : ' ✓'}
              </button>
              <button type="button" onclick="window.setVirtualChessMode('pass')" style="background: ${vc.mode === 'pass' ? '#ffffff' : 'transparent'}; color: ${vc.mode === 'pass' ? '#0f172a' : '#475569'}; border: none; border-radius: 7px; padding: 7px 4px; font-size: 0.74rem; font-weight: 800; cursor: pointer; box-shadow: ${vc.mode === 'pass' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};">
                👥 2P Desk
              </button>
            </div>
          </div>

          <!-- 2. Mode-Specific Panel -->
          ${
            vc.mode === 'ai'
              ? `
            <div style="display: flex; flex-direction: column; gap: 9px;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                  <span style="font-size: 0.69rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">6 Historical Opponents (450–1700 ELO)</span>
                  <button type="button" onclick="window.switchChessTab && window.switchChessTab('bots')" style="background: none; border: none; color: #0284c7; font-size: 0.7rem; font-weight: 800; cursor: pointer; padding: 0;">Bot Rankings →</button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
                  ${HISTORICAL_BOTS.map((b) => {
                    const active = botProfile.id === b.id;
                    return `
                      <button type="button" onclick="window.setVirtualAiLevel('${b.id}')" style="background: ${active ? b.accent : '#ffffff'}; color: ${active ? '#ffffff' : '#0f172a'}; border: 1.5px solid ${active ? b.accent : '#cbd5e1'}; border-radius: 8px; padding: 6px 4px; cursor: pointer; text-align: center; transition: transform 0.1s;">
                        <div style="font-size: 0.75rem; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${b.icon} ${b.shortName}</div>
                        <div style="font-size: 0.64rem; opacity: ${active ? '0.92' : '0.72'}; font-weight: 700; font-family: monospace;">${b.elo} ELO · +${b.winXp}XP</div>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- Selected Historical Bot Persona Card & Live Quip -->
              <div style="background: ${botProfile.bgLight}; border: 1px solid ${botProfile.border}; border-radius: 9px; padding: 8px 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; margin-bottom: 3px;">
                  <span style="font-size: 0.8rem; font-weight: 900; color: #0f172a;">${botProfile.icon} ${botProfile.name}</span>
                  <span style="font-size: 0.66rem; font-weight: 800; color: ${botProfile.accent}; font-family: monospace;">${botProfile.era}</span>
                </div>
                <div style="font-size: 0.73rem; color: #334155; line-height: 1.35;">
                  ${vc.botQuip ? `<em>${vc.botQuip}</em>` : botProfile.summary}
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                <span style="font-size: 0.75rem; font-weight: 700; color: #475569;">Play as:</span>
                <div style="display: inline-flex; gap: 5px;">
                  <button type="button" onclick="window.setVirtualHumanSide('w')" style="background: ${vc.humanSide === 'w' ? '#0f172a' : '#ffffff'}; color: ${vc.humanSide === 'w' ? '#ffffff' : '#334155'}; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 10px; font-size: 0.75rem; font-weight: 800; cursor: pointer;">♔ White</button>
                  <button type="button" onclick="window.setVirtualHumanSide('b')" style="background: ${vc.humanSide === 'b' ? '#0f172a' : '#ffffff'}; color: ${vc.humanSide === 'b' ? '#ffffff' : '#334155'}; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 10px; font-size: 0.75rem; font-weight: 800; cursor: pointer;">♚ Black</button>
                </div>
              </div>
            </div>
          `
              : vc.mode === 'online'
                ? `
            <div style="display: flex; flex-direction: column; gap: 9px;">
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); border: 1.5px solid #7dd3fc; border-radius: 10px; padding: 9px 11px;">
                <div style="font-size: 0.76rem; font-weight: 900; color: #0369a1; margin-bottom: 3px;">
                  🌐 Live 2-Laptop School Duel · 🏆 +1 Extra House Point!
                </div>
                <div style="font-size: 0.72rem; color: #334155; line-height: 1.38;">
                  Play a classmate live across two Windows school laptops! Callsigns only, zero chat box, and completing a duel awards <strong>Boosted XP + 1 Extra Bonus House Point</strong>.
                </div>
              </div>

              ${
                !vc.onlineRoomCode
                  ? `
                <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 9px; padding: 9px 10px; display: flex; flex-direction: column; gap: 8px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.74rem; font-weight: 800; color: #0f172a;">1. Host a Duel Room:</span>
                    <div style="display: inline-flex; gap: 4px;">
                      <button type="button" onclick="window.setOnlineHostPrefSide('w')" style="background: ${vc.onlineHostPrefSide !== 'b' ? '#0f172a' : '#f8fafc'}; color: ${vc.onlineHostPrefSide !== 'b' ? '#ffffff' : '#475569'}; border: 1px solid #cbd5e1; border-radius: 5px; padding: 2px 7px; font-size: 0.7rem; font-weight: 800; cursor: pointer;">♔ White</button>
                      <button type="button" onclick="window.setOnlineHostPrefSide('b')" style="background: ${vc.onlineHostPrefSide === 'b' ? '#0f172a' : '#f8fafc'}; color: ${vc.onlineHostPrefSide === 'b' ? '#ffffff' : '#475569'}; border: 1px solid #cbd5e1; border-radius: 5px; padding: 2px 7px; font-size: 0.7rem; font-weight: 800; cursor: pointer;">♚ Black</button>
                    </div>
                  </div>
                  <button id="btn-create-online-duel" type="button" onclick="window.createLiveOnlineDuel()" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border: none; border-radius: 8px; padding: 9px 12px; font-size: 0.82rem; font-weight: 800; cursor: pointer;">
                    ⚡ Create Room Code
                  </button>

                  <div style="border-top: 1px dashed #cbd5e1; padding-top: 8px;">
                    ${
                      readSavedOnlineDuelCode()
                        ? `
                      <button id="btn-rejoin-saved-duel" type="button" onclick="window.joinLiveOnlineDuel('${readSavedOnlineDuelCode()}')" style="width: 100%; margin-bottom: 8px; background: #fef3c7; color: #92400e; border: 1.5px solid #f59e0b; border-radius: 8px; padding: 8px 10px; font-size: 0.78rem; font-weight: 900; cursor: pointer;">
                        ⚡ Rejoin Unfinished Duel (${readSavedOnlineDuelCode()}) →
                      </button>
                    `
                        : ''
                    }
                    <label style="display: block; font-size: 0.74rem; font-weight: 800; color: #0f172a; margin-bottom: 4px;">2. Or Join a Classmate's Code:</label>
                    <div style="display: flex; gap: 6px;">
                      <input id="vc-join-code-input" type="text" placeholder="e.g. CASTLE-48" maxlength="12" style="flex: 1; padding: 7px 10px; border-radius: 7px; border: 1.5px solid #94a3b8; font-family: monospace; font-size: 16px; font-weight: 900; text-transform: uppercase; color: #0f172a;" />
                      <button id="btn-join-online-duel" type="button" onclick="window.joinLiveOnlineDuel()" style="background: #059669; color: #ffffff; border: none; border-radius: 7px; padding: 7px 13px; font-size: 0.8rem; font-weight: 800; cursor: pointer;">
                        Join
                      </button>
                    </div>
                  </div>
                  ${vc.onlineError ? `<div style="font-size: 0.73rem; font-weight: 800; color: #dc2626;">⚠️ ${vc.onlineError}</div>` : ''}
                </div>
              `
                  : `
                <div style="background: #ffffff; border: 2px solid #0284c7; border-radius: 10px; padding: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div>
                      <div style="font-size: 0.65rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Live Duel Room Code</div>
                      <div id="vc-active-room-code" style="font-size: 1.2rem; font-weight: 900; font-family: monospace; color: #0f172a; letter-spacing: 0.04em;">${vc.onlineRoomCode}</div>
                    </div>
                    <button type="button" onclick="window.leaveLiveOnlineDuel()" style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: 6px; padding: 4px 9px; font-size: 0.72rem; font-weight: 800; cursor: pointer;">Leave Room</button>
                  </div>
                  <div style="font-size: 0.73rem; color: #334155; margin-bottom: 7px;">
                    ${
                      vc.onlineRoomData?.status === 'waiting'
                        ? '📡 Tell your opponent to open <strong>Live Duel</strong> on their laptop and type this code!'
                        : `⚔️ Connected! You are playing <strong>${vc.onlineSide === 'w' ? '♔ White' : '♚ Black'}</strong>.`
                    }
                  </div>
                  ${
                    vc.onlineRoomData?.drawOfferBy && vc.onlineRoomData.drawOfferBy !== vc.onlineSide && vc.status === 'playing'
                      ? `
                    <div style="background: #fefce8; border: 1.5px solid #facc15; border-radius: 7px; padding: 6px 9px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; gap: 6px;">
                      <span style="font-size: 0.74rem; font-weight: 800; color: #854d0e;">🤝 Opponent offered a Draw!</span>
                      <div style="display: flex; gap: 4px;">
                        <button type="button" onclick="window.respondOnlineDrawOffer(true)" style="background: #059669; color: #fff; border: none; border-radius: 5px; padding: 3px 8px; font-size: 0.7rem; font-weight: 800; cursor: pointer;">Accept</button>
                        <button type="button" onclick="window.respondOnlineDrawOffer(false)" style="background: #e2e8f0; color: #334155; border: none; border-radius: 5px; padding: 3px 8px; font-size: 0.7rem; font-weight: 700; cursor: pointer;">Decline</button>
                      </div>
                    </div>
                  `
                      : ''
                  }
                  <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                    ${DUEL_QUICK_REACTIONS.map(
                      (rx) =>
                        `<button type="button" onclick="window.sendVirtualDuelReaction('${rx}')" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 999px; padding: 3px 8px; font-size: 0.69rem; font-weight: 700; color: #334155; cursor: pointer;">${rx}</button>`,
                    ).join('')}
                  </div>
                </div>
              `
              }
            </div>
          `
                : vc.mode === 'daily'
                  ? `
            <div style="background: #fffbeb; border: 1.5px solid #fcd34d; border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 7px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.78rem; font-weight: 900; color: #92400e;">🧩 ${vc.dailyPuzzleIdx === todayDailyObj.index ? `Puzzle of the Day (${todayDailyObj.todayKey})` : `Bonus Tactical Drill #${(vc.dailyPuzzleIdx % DAILY_TACTICAL_PUZZLES.length) + 1}`}</span>
                <span style="background: #fef3c7; color: #b45309; border: 1px solid #fde68a; padding: 1px 7px; border-radius: 999px; font-size: 0.68rem; font-weight: 800;">+15 XP</span>
              </div>
              <div style="font-size: 0.76rem; color: #78350f; line-height: 1.4;">
                <strong>Mission:</strong> White to move and deliver <strong>Checkmate in 1 move</strong> (${activePuzzle.theme}).
              </div>
              ${vc.dailyWrongToast ? `<div style="font-size: 0.74rem; font-weight: 800; color: #dc2626;">❌ ${vc.dailyWrongToast}</div>` : ''}
              ${vc.dailySolvedBanner ? `<div style="font-size: 0.76rem; font-weight: 800; color: #15803d;">🎉 ${vc.dailySolvedBanner}</div>` : ''}
              <div style="display: flex; gap: 6px; margin-top: 2px;">
                <button type="button" onclick="window.showDailyPuzzleHint()" style="flex: 1; background: #ffffff; color: #b45309; border: 1px solid #fcd34d; border-radius: 7px; padding: 6px 8px; font-size: 0.75rem; font-weight: 800; cursor: pointer;">💡 Puzzle Hint</button>
                <button type="button" onclick="window.nextDailyPracticePuzzle()" style="flex: 1; background: #0f172a; color: #ffffff; border: none; border-radius: 7px; padding: 6px 8px; font-size: 0.75rem; font-weight: 800; cursor: pointer;">⏭ Next Puzzle</button>
              </div>
            </div>
          `
                  : `
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                <div>
                  <label style="display: block; font-size: 0.68rem; font-weight: 800; color: #64748b; margin-bottom: 2px;">♔ White (Optional)</label>
                  <select class="vc-select-input" onchange="window.setVirtualRosterPlayer('w', this.value)" style="width: 100%; padding: 5px 7px; border-radius: 6px; border: 1px solid #cbd5e1; background: #ffffff; font-size: 0.78rem; font-weight: 700; color: #0f172a;">
                    <option value="">Guest (White)</option>
                    ${players
                      .map(
                        (p) =>
                          `<option value="${p.id}" ${vc.whitePlayerId === p.id ? 'selected' : ''}>#${p.rank} ${p.name}</option>`,
                      )
                      .join('')}
                  </select>
                </div>
                <div>
                  <label style="display: block; font-size: 0.68rem; font-weight: 800; color: #64748b; margin-bottom: 2px;">♚ Black (Optional)</label>
                  <select class="vc-select-input" onchange="window.setVirtualRosterPlayer('b', this.value)" style="width: 100%; padding: 5px 7px; border-radius: 6px; border: 1px solid #cbd5e1; background: #ffffff; font-size: 0.78rem; font-weight: 700; color: #0f172a;">
                    <option value="">Guest (Black)</option>
                    ${players
                      .map(
                        (p) =>
                          `<option value="${p.id}" ${vc.blackPlayerId === p.id ? 'selected' : ''}>#${p.rank} ${p.name}</option>`,
                      )
                      .join('')}
                  </select>
                </div>
              </div>
              <label style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.76rem; font-weight: 700; color: #475569; cursor: pointer;">
                <input type="checkbox" ${vc.autoFlipPass ? 'checked' : ''} onchange="window.toggleVirtualAutoFlip(this.checked)" />
                Auto-flip board after each move (shared laptop)
              </label>
            </div>
          `
          }

          <!-- 3. Clock Pills (Hidden in Daily Puzzle mode) -->
          ${
            vc.mode !== 'daily'
              ? `
            <div>
              <div style="font-size: 0.69rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                Chess Clock
              </div>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px;">
                ${[
                  { mins: 0, label: '∞ None' },
                  { mins: 3, label: '⚡ 3m' },
                  { mins: 5, label: '⏱ 5m' },
                  { mins: 10, label: '🕰 10m' },
                ]
                  .map(
                    (tc) => `
                  <button type="button" onclick="window.setVirtualTimeControl(${tc.mins})" ${vc.mode === 'online' && vc.onlineRoomCode ? 'disabled' : ''} style="background: ${vc.timeControlMins === tc.mins ? '#0f172a' : '#ffffff'}; color: ${vc.timeControlMins === tc.mins ? '#ffffff' : '#334155'}; border: 1px solid ${vc.timeControlMins === tc.mins ? '#0f172a' : '#cbd5e1'}; border-radius: 6px; padding: 5px 4px; font-size: 0.74rem; font-weight: 800; cursor: pointer;">
                    ${tc.label}
                  </button>
                `,
                  )
                  .join('')}
              </div>
            </div>
          `
              : ''
          }

          <!-- 4. Primary Action Controls -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <button type="button" onclick="window.startNewVirtualGame()" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border: none; border-radius: 8px; padding: 8px 10px; font-size: 0.8rem; font-weight: 800; cursor: pointer; box-shadow: 0 2px 6px rgba(2,132,199,0.22);">
              🔄 ${vc.mode === 'daily' ? 'Reset Puzzle' : 'New Game'}
            </button>
            <button type="button" onclick="window.undoVirtualMove()" ${vc.mode === 'online' || vc.history.length === 0 || vc.aiThinking ? 'disabled' : ''} style="background: #ffffff; color: ${vc.mode === 'online' || vc.history.length === 0 ? '#94a3b8' : '#0f172a'}; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 10px; font-size: 0.8rem; font-weight: 800; cursor: ${vc.mode === 'online' || vc.history.length === 0 ? 'not-allowed' : 'pointer'};">
              ↩️ Undo
            </button>
            <button type="button" onclick="window.requestVirtualHint()" ${vc.mode === 'online' || isFinished || vc.aiThinking ? 'disabled' : ''} style="background: #fffbeb; color: ${vc.mode === 'online' || isFinished ? '#94a3b8' : '#b45309'}; border: 1px solid #fde68a; border-radius: 8px; padding: 7px 10px; font-size: 0.78rem; font-weight: 800; cursor: ${vc.mode === 'online' || isFinished ? 'not-allowed' : 'pointer'};">
              💡 Coach Hint
            </button>
            <button type="button" onclick="window.flipVirtualBoard()" style="background: #ffffff; color: #334155; border: 1px solid #cbd5e1; border-radius: 8px; padding: 7px 10px; font-size: 0.78rem; font-weight: 800; cursor: pointer;">
              🔃 Flip Board
            </button>
          </div>

          <!-- Resign / Draw / Board Style Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; flex-wrap: wrap;">
            <button type="button" onclick="window.toggleVirtualBoardTheme()" style="background: transparent; border: 1px solid #cbd5e1; color: #475569; border-radius: 6px; padding: 4px 9px; font-size: 0.72rem; font-weight: 700; cursor: pointer;">
              🎨 ${vc.boardTheme === 'wood' ? 'Slate Board' : 'Wood Board'}
            </button>

            ${
              !isFinished && vc.moveLog.length > 0 && vc.mode !== 'daily'
                ? vc.confirmAction
                  ? `
                  <div style="display: inline-flex; align-items: center; gap: 5px;">
                    <span style="font-size: 0.72rem; font-weight: 800; color: #b91c1c;">${vc.confirmAction === 'resign' ? 'Resign?' : vc.mode === 'online' ? 'Send Draw Offer?' : 'Agree Draw?'}</span>
                    <button type="button" onclick="window.confirmVirtualEndAction()" style="background: #dc2626; color: #ffffff; border: none; border-radius: 5px; padding: 3px 8px; font-size: 0.72rem; font-weight: 800; cursor: pointer;">Yes</button>
                    <button type="button" onclick="window.cancelVirtualEndAction()" style="background: #e2e8f0; color: #334155; border: none; border-radius: 5px; padding: 3px 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer;">No</button>
                  </div>
                `
                  : `
                  <div style="display: inline-flex; gap: 5px;">
                    ${
                      vc.mode === 'pass' || vc.mode === 'online'
                        ? `<button type="button" onclick="window.promptVirtualEndAction('draw')" style="background: transparent; border: 1px solid #cbd5e1; color: #475569; border-radius: 6px; padding: 4px 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer;">🤝 ${vc.mode === 'online' ? 'Offer Draw' : 'Draw'}</button>`
                        : ''
                    }
                    <button type="button" onclick="window.promptVirtualEndAction('resign')" style="background: transparent; border: 1px solid #fecaca; color: #dc2626; border-radius: 6px; padding: 4px 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer;">🏳️ Resign</button>
                  </div>
                `
                : ''
            }
          </div>

          ${
            canTeacherLog
              ? `
            <button type="button" onclick="window.logVirtualMatchToLadder()" ${vc.loggedToLadder ? 'disabled' : ''} style="background: ${vc.loggedToLadder ? '#dcfce7' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}; color: ${vc.loggedToLadder ? '#166534' : '#ffffff'}; border: 1px solid ${vc.loggedToLadder ? '#86efac' : '#059669'}; border-radius: 8px; padding: 9px 12px; font-size: 0.82rem; font-weight: 800; cursor: ${vc.loggedToLadder ? 'default' : 'pointer'};">
              ${vc.loggedToLadder ? '✓ Match Logged to Club Ladder' : '🏆 Log Match Result to Club Ladder'}
            </button>
          `
              : ''
          }

          <!-- 5. Opening Explorer + Interactive Algebraic Move Sheet -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; padding: 0 2px; gap: 4px; flex-wrap: wrap;">
              <span style="font-size: 0.68rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em;">
                ${openingName ? `📖 ${openingName}` : 'Move History'}
              </span>
              <div style="display: inline-flex; align-items: center; gap: 3px;">
                <button type="button" onclick="window.scrubVirtualMove(0)" ${vc.history.length === 0 ? 'disabled' : ''} style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; padding: 1px 5px; font-size: 0.66rem; cursor: pointer;" title="Start">⏮</button>
                <button type="button" onclick="window.scrubVirtualMoveStep(-1)" ${vc.history.length === 0 ? 'disabled' : ''} style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; padding: 1px 5px; font-size: 0.66rem; cursor: pointer;" title="Back">◀</button>
                <button type="button" onclick="window.scrubVirtualMoveStep(1)" ${vc.history.length === 0 ? 'disabled' : ''} style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; padding: 1px 5px; font-size: 0.66rem; cursor: pointer;" title="Forward">▶</button>
                <button type="button" onclick="window.scrubVirtualMove(null)" ${vc.replayPlyIndex === null ? 'disabled' : ''} style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; padding: 1px 5px; font-size: 0.66rem; cursor: pointer;" title="Live">⏭</button>
                <span style="font-size: 0.66rem; font-family: monospace; color: #94a3b8; margin-left: 3px;">${vc.moveLog.length}p</span>
              </div>
            </div>
            <div id="vc-move-sheet" style="max-height: 145px; overflow-y: auto; display: flex; flex-direction: column; gap: 1px;">
              ${
                moveRowsHtml ||
                `<div style="font-size: 0.75rem; color: #94a3b8; text-align: center; padding: 12px 6px;">Moves appear here — click any move to replay!</div>`
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
  return innerHtml;
}

export function renderVirtualChessView(chessState) {
  return `<div id="virtual-chess-mount">${renderVirtualChessInner(chessState)}</div>`;
}

// ============================================================================
// 5. EVENT CONTROLLERS, ONLINE 2-LAPTOP SYNC, COACH REVIEW & AI ORCHESTRATION
// ============================================================================
let aiMoveTimeout = null;
let onlinePollTimer = null;
let rightMouseDragStart = null;

export function registerVirtualChessHandlers(ctx) {
  if (typeof window === 'undefined') return;

  const getVc = () => {
    const st = ctx.getState();
    if (!st.virtualChess) st.virtualChess = createDefaultVirtualChessState();
    return st.virtualChess;
  };

  const rerenderBoardOnly = (scrollSheetToEnd = false) => {
    const mount = document.getElementById('virtual-chess-mount');
    if (mount) {
      const appBody = document.querySelector('.app-body');
      const prevBodyScroll = appBody ? appBody.scrollTop : 0;
      const prevWinY = window.scrollY;
      const prevHeight = mount.offsetHeight;
      if (prevHeight > 0) mount.style.minHeight = `${prevHeight}px`;
      const prevSheet = document.getElementById('vc-move-sheet');
      const prevScrollTop = prevSheet ? prevSheet.scrollTop : 0;
      mount.innerHTML = renderVirtualChessInner(ctx.getState());
      mount.style.minHeight = '';
      if (appBody && appBody.scrollTop !== prevBodyScroll) appBody.scrollTop = prevBodyScroll;
      if (window.scrollY !== prevWinY) window.scrollTo(0, prevWinY);
      const nextSheet = document.getElementById('vc-move-sheet');
      if (nextSheet) {
        nextSheet.scrollTop = scrollSheetToEnd ? nextSheet.scrollHeight : prevScrollTop;
      }
    } else {
      ctx.renderChessHubView();
    }
  };

  const emitHighlightEvent = (item) => {
    appendLocalClubFeed(item);
    const st = ctx.getState();
    st.clubFeed = [item, ...(st.clubFeed || []).filter((x) => x.eventId !== item.eventId)].slice(
      0,
      60,
    );
    postClubHighlightToCloud(item);
  };

  const bankPupilXpHelper = (pupil, rawXp, meta = {}) => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const ledger = readLocalXpLedger();
    const entry = ledger[pupil.id] || {
      localTotalXp: Number(pupil.practiceXp || 0),
      daily: {},
    };
    if (!entry.daily) entry.daily = {};
    const usedToday = Number(entry.daily[todayKey] || 0);
    const remaining = Math.max(0, DAILY_XP_CAP - usedToday);
    if (remaining <= 0 && !(meta.bonusHousePts > 0)) {
      return { capped: true, grantedXp: 0, housePtsAwarded: 0 };
    }
    const grantedXp = Math.min(rawXp, remaining);
    const baseTotal = Math.max(Number(pupil.practiceXp || 0), Number(entry.localTotalXp || 0));
    entry.localTotalXp = baseTotal + grantedXp;
    entry.daily[todayKey] = usedToday + grantedXp;
    ledger[pupil.id] = entry;
    writeLocalXpLedger(ledger);

    const claimPayload = {
      claimId: `xp_${pupil.id}_${Date.now()}_${Math.floor(Math.random() * 999)}`,
      playerId: pupil.id,
      callsign: pupil.name,
      house: pupil.house,
      xp: grantedXp,
      source: meta.source || 'ai',
      bonusHousePts: meta.bonusHousePts || 0,
      accuracyPct: meta.accuracyPct ?? null,
      botConquered: meta.botConquered || null,
      opponentCallsign: meta.opponentCallsign || null,
      level: meta.level || 'elizabeth_i',
      outcome: meta.outcome || 'win',
      moves: meta.moves || 10,
    };

    if (typeof ctx.onPracticeXpEarned === 'function') {
      const res = ctx.onPracticeXpEarned(claimPayload);
      return {
        capped: false,
        grantedXp,
        directTeacherBanked: Boolean(res?.directTeacherBanked),
        housePtsAwarded: Number(res?.housePtsAwarded || 0),
      };
    }
    return { capped: false, grantedXp, housePtsAwarded: 0 };
  };

  const rebuildHistoryFromMoveLogIfNeeded = (vc) => {
    if (vc.history.length >= vc.moveLog.length || vc.moveLog.length === 0) return;
    // Lightweight reconstruction not needed when local player played; ensure review works cleanly
  };

  const evaluateGameEndPracticeXp = () => {
    const st = ctx.getState();
    const vc = getVc();
    if (vc.status === 'playing' || vc.xpEvaluated) return false;
    vc.xpEvaluated = true;

    if (vc.mode === 'daily') return false;

    rebuildHistoryFromMoveLogIfNeeded(vc);
    const reviewSide =
      vc.mode === 'online' ? vc.onlineSide : vc.mode === 'ai' ? vc.humanSide : 'w';
    if (!vc.gameReview && vc.moveLog.length >= 4 && vc.history.length >= 2) {
      vc.gameReview = computePostGameCoachReview(vc, reviewSide);
    }
    const accuracyPct = vc.gameReview?.accuracyPct ?? null;

    const pupil = vc.tappedInPlayerId
      ? (st.players || []).find((p) => p.id === vc.tappedInPlayerId)
      : null;

    if (accuracyPct !== null) {
      updateLocalBestAccuracy(pupil ? pupil.id : 'guest', accuracyPct);
    }

    const plies = vc.moveLog.length;
    const bot = resolveBotProfile(vc.aiLevel);

    // Record Historical Bot Ranking & Conquest stats even for Guest (and credit Callsign when tapped in!)
    if (vc.mode === 'ai' && plies >= 6) {
      const pupilWonBot = vc.winner === vc.humanSide;
      const isBotDraw = vc.winner === 'draw';
      const botOutcome = pupilWonBot ? 'pupil_win' : isBotDraw ? 'draw' : 'bot_win';
      vc.botQuip = pupilWonBot ? bot.quips.pupilWin : !isBotDraw ? bot.quips.botWin : '';

      if (pupilWonBot) {
        recordLocalBotConquest(pupil ? pupil.id : 'guest', bot.id, accuracyPct);
      }
      recordBotResultToCloud({
        botId: bot.id,
        outcome: botOutcome,
        moves: plies,
        playerId: pupil ? pupil.id : '',
        callsign: pupil ? pupil.name : '',
        house: pupil ? pupil.house : 'warrior',
        accuracyPct,
      }).then((res) => {
        if (res?.ok && res.botStats) {
          ctx.getState().botStats = res.botStats;
        }
      });
    }

    if (!pupil) return false;

    // 1. LIVE 2-LAPTOP ONLINE DUEL REWARDS (+1 EXTRA HOUSE POINT!)
    if (vc.mode === 'online') {
      writeSavedOnlineDuelCode('');
      if (plies < 6) return false;
      const myWon = vc.winner === vc.onlineSide;
      const isDraw = vc.winner === 'draw';
      const oppSeat =
        vc.onlineSide === 'w' ? vc.onlineRoomData?.black : vc.onlineRoomData?.white;
      const oppCallsign = oppSeat?.callsign || 'Classmate';
      const oppHouse = oppSeat?.house || null;

      let rawXp = myWon ? 45 : isDraw ? 30 : 20;
      if (accuracyPct !== null && accuracyPct >= 85 && plies >= 10) rawXp += 15;
      const bonusHousePts = plies >= 10 ? 1 : 0;

      const bankRes = bankPupilXpHelper(pupil, rawXp, {
        source: 'online_duel',
        bonusHousePts,
        accuracyPct,
        opponentCallsign: oppCallsign,
        level: 'online_duel',
        outcome: myWon ? 'win' : isDraw ? 'draw' : 'effort',
        moves: plies,
      });
      vc.xpGrantedThisGame = true;

      if (myWon || isDraw) {
        emitHighlightEvent({
          eventId: `hl_duel_${vc.onlineRoomCode}_${pupil.id}_${plies}`,
          type: 'online_duel',
          callsign: pupil.name,
          house: pupil.house,
          opponentCallsign: oppCallsign,
          opponentHouse: oppHouse,
          accuracyPct,
          xp: bankRes.grantedXp,
          bonusHousePts,
          moves: plies,
          roomCode: vc.onlineRoomCode,
        });
      }

      const hName = HOUSES[pupil.house]?.name || pupil.house;
      vc.lastXpNotice = {
        type: 'earned',
        text: bankRes.directTeacherBanked
          ? `🌐 Online Duel Complete! +${bankRes.grantedXp} XP & 🏆 +${bankRes.housePtsAwarded} ${hName} House Point(s) Banked!`
          : `🌐 Online Duel Complete! +${bankRes.grantedXp} XP${bonusHousePts ? ` + 🏆 1 Extra ${hName} House Point` : ''} sent to Teacher Approval!`,
      };
      return bankRes.housePtsAwarded > 0;
    }

    // 2. HISTORICAL BOT REWARDS + ACCURACY MASTERY BONUS
    if (vc.mode !== 'ai') return false;
    const pupilWon = vc.winner === vc.humanSide;
    const isDraw = vc.winner === 'draw';

    let rawXp = 0;
    let outcome = 'effort';
    if (pupilWon && plies >= 6) {
      outcome = 'win';
      rawXp = bot.winXp;
    } else if (isDraw && plies >= 16) {
      outcome = 'draw';
      rawXp = bot.drawXp;
    } else if (!pupilWon && !isDraw && plies >= 24) {
      outcome = 'effort';
      rawXp = bot.effortXp;
    } else {
      return false;
    }

    let accBonus = 0;
    if (accuracyPct !== null && plies >= 10 && (vc.hintsUsedCount || 0) <= 1) {
      if (accuracyPct >= 90) accBonus = 20;
      else if (accuracyPct >= 80) accBonus = 10;
    }
    rawXp += accBonus;

    let hintCapNote = '';
    if ((vc.hintsUsedCount || 0) > 2 && rawXp > 5) {
      rawXp = 5;
      hintCapNote = ' (Guided Hint Cap)';
    }

    const bankRes = bankPupilXpHelper(pupil, rawXp, {
      source: 'ai',
      accuracyPct,
      botConquered: pupilWon ? bot.id : null,
      level: bot.id,
      outcome,
      moves: plies,
    });

    if (bankRes.capped) {
      vc.lastXpNotice = {
        type: 'cap',
        text: `🌟 Daily XP Cap Reached (${DAILY_XP_CAP}/${DAILY_XP_CAP} XP today)! Play freely & check your Coach Accuracy % below!`,
      };
      return false;
    }

    vc.xpGrantedThisGame = true;

    if (pupilWon) {
      emitHighlightEvent({
        eventId: `hl_bot_${pupil.id}_${bot.id}_${Date.now()}`,
        type: 'bot_conquest',
        callsign: pupil.name,
        house: pupil.house,
        botId: bot.id,
        accuracyPct,
        xp: bankRes.grantedXp,
        moves: plies,
      });
    } else if (accuracyPct !== null && accuracyPct >= 88 && plies >= 14) {
      emitHighlightEvent({
        eventId: `hl_acc_${pupil.id}_${Date.now()}`,
        type: 'high_accuracy',
        callsign: pupil.name,
        house: pupil.house,
        botId: bot.id,
        accuracyPct,
        xp: bankRes.grantedXp,
        moves: plies,
      });
    }

    const hName = HOUSES[pupil.house]?.name || pupil.house;
    const accTag = accBonus > 0 ? ` (incl. +${accBonus} Accuracy Bonus!)` : '';
    vc.lastXpNotice = {
      type: 'earned',
      text: bankRes.directTeacherBanked
        ? `⚡ +${bankRes.grantedXp} XP banked for ${pupil.name}${accTag}${hintCapNote}!${bankRes.housePtsAwarded > 0 ? ` · 🏆 +${bankRes.housePtsAwarded} ${hName} House Pt!` : ''}`
        : `⚡ +${bankRes.grantedXp} XP earned by ${pupil.name}${accTag}${hintCapNote}! Sent to Teacher Inbox toward ${hName} House Points.`,
    };
    return bankRes.housePtsAwarded > 0;
  };

  // =========================================================================
  // LIVE 2-LAPTOP ONLINE DUEL POLLING ENGINE (1.1s Low-Latency Sync)
  // =========================================================================
  const stopOnlinePolling = () => {
    if (onlinePollTimer) {
      clearInterval(onlinePollTimer);
      onlinePollTimer = null;
    }
  };

  const syncLocalStateFromRoom = (room, forceRender = false) => {
    if (!room) return;
    const vc = getVc();
    const prevStatus = vc.onlineRoomData?.status;
    const prevMoveCount = vc.moveLog.length;
    const prevReactionAt = vc.onlineReactionToast?.at || 0;

    vc.onlineRoomData = room;
    vc.onlineSeq = room.seq || 1;

    if (room.lastReaction && room.lastReaction.at > prevReactionAt) {
      vc.onlineReactionToast = room.lastReaction;
      forceRender = true;
    }

    if (prevStatus === 'waiting' && room.status === 'playing') {
      const opp = vc.onlineSide === 'w' ? room.black : room.white;
      playClubSound('bounty');
      ctx.showChessToast(
        `⚔️ ${opp?.callsign || 'Classmate'} joined Room ${room.roomCode}! Game on!`,
        'success',
      );
      forceRender = true;
    }

    // Apply remote move or status transition
    if (
      room.moveLog &&
      (room.moveLog.length > prevMoveCount ||
        (room.status !== 'waiting' && room.status !== vc.status))
    ) {
      // Snapshot pre-move board into vc.history if remote opponent just made 1 move
      if (room.moveLog.length === prevMoveCount + 1) {
        vc.history.push({
          board: cloneBoard(vc.board),
          turn: vc.turn,
          castling: { ...vc.castling },
          enPassant: vc.enPassant ? [...vc.enPassant] : null,
          halfMoveClock: vc.halfMoveClock,
          fullMoveNumber: vc.fullMoveNumber,
          positionCounts: { ...vc.positionCounts },
          lastMove: vc.lastMove ? { from: [...vc.lastMove.from], to: [...vc.lastMove.to] } : null,
          moveLog: [...vc.moveLog],
          capturedByWhite: [...vc.capturedByWhite],
          capturedByBlack: [...vc.capturedByBlack],
          status: vc.status,
          winner: vc.winner,
          whiteTimeSecs: vc.whiteTimeSecs,
          blackTimeSecs: vc.blackTimeSecs,
        });
      }

      vc.board = cloneBoard(room.board);
      vc.turn = room.turn;
      vc.castling = { ...(room.castling || {}) };
      vc.enPassant = room.enPassant || null;
      vc.halfMoveClock = room.halfMoveClock || 0;
      vc.fullMoveNumber = room.fullMoveNumber || 1;
      vc.lastMove = room.lastMove || null;
      vc.moveLog = [...(room.moveLog || [])];
      vc.capturedByWhite = [...(room.capturedByWhite || [])];
      vc.capturedByBlack = [...(room.capturedByBlack || [])];
      vc.whiteTimeSecs = room.whiteTimeSecs ?? vc.whiteTimeSecs;
      vc.blackTimeSecs = room.blackTimeSecs ?? vc.blackTimeSecs;
      vc.clockActive = room.timeControlMins > 0 && room.status === 'playing' && vc.moveLog.length > 0;

      if (room.status !== 'waiting') {
        vc.status = room.status;
        vc.winner = room.winner || null;
      }
      vc.selected = null;
      vc.replayPlyIndex = null;

      if (room.moveLog.length > prevMoveCount) {
        if (vc.status === 'checkmate') playClubSound('win');
        else playClubSound('move');
      }

      if (vc.status !== 'playing') {
        vc.clockActive = false;
        evaluateGameEndPracticeXp();
      }
      forceRender = true;
    } else if (room.drawOfferBy !== (vc.onlineRoomData?.drawOfferBy ?? null)) {
      forceRender = true;
    }

    if (forceRender) {
      rerenderBoardOnly(true);
    }
  };

  const startOnlinePolling = () => {
    stopOnlinePolling();
    onlinePollTimer = setInterval(async () => {
      if (!ctx.isChessViewActive()) return;
      const vc = getVc();
      if (vc.mode !== 'online' || !vc.onlineRoomCode) {
        stopOnlinePolling();
        return;
      }
      const res = await pollOnlineDuelRoom(vc.onlineRoomCode);
      if (res.ok && res.room && res.room.seq !== vc.onlineSeq) {
        syncLocalStateFromRoom(res.room, true);
      }
    }, 1100);
  };

  const broadcastLocalMoveToOnlineRoom = async () => {
    const vc = getVc();
    if (vc.mode !== 'online' || !vc.onlineRoomCode) return;
    const res = await pushOnlineDuelMove({
      roomCode: vc.onlineRoomCode,
      expectedSeq: vc.onlineSeq,
      board: vc.board,
      turn: vc.turn,
      castling: vc.castling,
      enPassant: vc.enPassant,
      halfMoveClock: vc.halfMoveClock,
      fullMoveNumber: vc.fullMoveNumber,
      lastMove: vc.lastMove,
      moveLog: vc.moveLog,
      capturedByWhite: vc.capturedByWhite,
      capturedByBlack: vc.capturedByBlack,
      whiteTimeSecs: vc.whiteTimeSecs,
      blackTimeSecs: vc.blackTimeSecs,
      status: vc.status,
      winner: vc.winner,
      drawOfferBy: null,
    });
    if (res.ok && res.room) {
      vc.onlineSeq = res.room.seq;
      vc.onlineRoomData = res.room;
    } else if (res.conflict && res.room) {
      syncLocalStateFromRoom(res.room, true);
    }
  };

  const maybeScheduleAiReply = (alreadyRenderedThinking = false) => {
    const vc = getVc();
    if (vc.mode !== 'ai' || vc.status !== 'playing') return;
    const aiSide = vc.humanSide === 'w' ? 'b' : 'w';
    if (vc.turn !== aiSide) return;

    vc.aiThinking = true;
    if (!alreadyRenderedThinking) {
      rerenderBoardOnly(true);
    }

    if (aiMoveTimeout) clearTimeout(aiMoveTimeout);
    aiMoveTimeout = setTimeout(() => {
      const currentVc = getVc();
      if (currentVc.status !== 'playing' || currentVc.mode !== 'ai') {
        currentVc.aiThinking = false;
        return;
      }
      const bot = resolveBotProfile(currentVc.aiLevel);
      const chosen = chooseBestMove(currentVc, bot.id);
      currentVc.aiThinking = false;
      let unlockedHousePt = false;
      if (chosen) {
        const wasCap = chosen.isEnPassant || currentVc.board[chosen.toR][chosen.toC] !== '.';
        applyVirtualChessMove(currentVc, chosen, false);
        if (currentVc.status === 'playing') {
          if (isSideInCheck(currentVc.board, currentVc.turn)) currentVc.botQuip = bot.quips.check;
          else if (wasCap) currentVc.botQuip = bot.quips.capture;
        }
        unlockedHousePt = evaluateGameEndPracticeXp();
      }
      if (unlockedHousePt) {
        ctx.renderChessHubView();
      } else {
        rerenderBoardOnly(true);
      }
    }, 240);
  };

  // 1-Second Chess Clock Ticker
  if (!window.__virtualChessClockInterval) {
    window.__virtualChessClockInterval = setInterval(() => {
      if (!ctx.isChessViewActive()) return;
      const st = ctx.getState();
      if ((st.activeTab || 'play') !== 'play') return;
      const vc = st.virtualChess;
      if (
        !vc ||
        vc.mode === 'daily' ||
        vc.status !== 'playing' ||
        !vc.clockActive ||
        vc.timeControlMins <= 0
      )
        return;

      if (vc.turn === 'w') {
        vc.whiteTimeSecs = Math.max(0, (vc.whiteTimeSecs || 0) - 1);
        const el = document.getElementById('vc-clock-w');
        if (el) el.textContent = formatClockSecs(vc.whiteTimeSecs);
        if (vc.whiteTimeSecs === 0) {
          vc.clockActive = false;
          if (hasMatingMaterial(vc.board, 'b')) {
            vc.status = 'timeout';
            vc.winner = 'b';
            playClubSound('win');
          } else {
            vc.status = 'draw_material';
            vc.winner = 'draw';
          }
          if (vc.mode === 'online') broadcastLocalMoveToOnlineRoom();
          const unlocked = evaluateGameEndPracticeXp();
          if (unlocked) ctx.renderChessHubView();
          else rerenderBoardOnly();
        }
      } else {
        vc.blackTimeSecs = Math.max(0, (vc.blackTimeSecs || 0) - 1);
        const el = document.getElementById('vc-clock-b');
        if (el) el.textContent = formatClockSecs(vc.blackTimeSecs);
        if (vc.blackTimeSecs === 0) {
          vc.clockActive = false;
          if (hasMatingMaterial(vc.board, 'w')) {
            vc.status = 'timeout';
            vc.winner = 'w';
            playClubSound('win');
          } else {
            vc.status = 'draw_material';
            vc.winner = 'draw';
          }
          if (vc.mode === 'online') broadcastLocalMoveToOnlineRoom();
          const unlocked = evaluateGameEndPracticeXp();
          if (unlocked) ctx.renderChessHubView();
          else rerenderBoardOnly();
        }
      }
    }, 1000);
  }

  const loadDailyPuzzleIntoBoard = (idx) => {
    const vc = getVc();
    const safeIdx = ((idx % DAILY_TACTICAL_PUZZLES.length) + DAILY_TACTICAL_PUZZLES.length) % DAILY_TACTICAL_PUZZLES.length;
    const puz = DAILY_TACTICAL_PUZZLES[safeIdx];
    vc.dailyPuzzleIdx = safeIdx;
    vc.board = parseFenBoardOnly(puz.fenBoard);
    vc.turn = puz.sideToMove || 'w';
    vc.castling = { K: false, Q: false, k: false, q: false };
    vc.enPassant = null;
    vc.history = [];
    vc.moveLog = [];
    vc.capturedByWhite = [];
    vc.capturedByBlack = [];
    vc.status = 'playing';
    vc.winner = null;
    vc.selected = null;
    vc.lastMove = null;
    vc.hintMove = null;
    vc.replayPlyIndex = null;
    vc.drawnArrows = [];
    vc.highlightedSquares = [];
    vc.dailySolvedBanner = '';
    vc.dailyWrongToast = '';
    vc.flipped = false;
  };

  const attemptHumanMove = (fromR, fromC, toR, toC) => {
    const vc = getVc();
    if (vc.status !== 'playing' || vc.aiThinking) return false;
    if (vc.replayPlyIndex !== null) vc.replayPlyIndex = null;
    if (vc.mode === 'ai' && vc.turn !== vc.humanSide) return false;
    if (
      vc.mode === 'online' &&
      (vc.onlineRoomData?.status !== 'playing' || vc.turn !== vc.onlineSide)
    )
      return false;

    const legal = getLegalMovesFrom(vc, fromR, fromC).filter(
      (m) => m.toR === toR && m.toC === toC,
    );
    if (legal.length === 0) return false;

    // Daily Tactical Puzzle check!
    if (vc.mode === 'daily') {
      const puz = DAILY_TACTICAL_PUZZLES[vc.dailyPuzzleIdx % DAILY_TACTICAL_PUZZLES.length];
      const fromStr = sqName(fromR, fromC);
      const toStr = sqName(toR, toC);
      if (fromStr !== puz.solutionFrom || toStr !== puz.solutionTo) {
        vc.selected = null;
        vc.dailyWrongToast = `Not quite! ${fromStr}→${toStr} lets Black escape — look for Checkmate in 1 move!`;
        rerenderBoardOnly();
        return true;
      }

      vc.dailyWrongToast = '';
      applyVirtualChessMove(vc, legal[0], false);

      const st = ctx.getState();
      const pupil = vc.tappedInPlayerId
        ? (st.players || []).find((p) => p.id === vc.tappedInPlayerId)
        : null;
      const todayObj = getTodayDailyPuzzle();
      const isOfficialToday = vc.dailyPuzzleIdx === todayObj.index;

      if (isOfficialToday) {
        const prog = markDailyPuzzleSolved(pupil ? pupil.id : 'guest');
        if (!prog.alreadySolved && pupil) {
          const bankRes = bankPupilXpHelper(pupil, 15, {
            source: 'daily_puzzle',
            level: puz.id,
            outcome: 'solved',
            moves: 1,
          });
          emitHighlightEvent({
            eventId: `hl_puz_${todayObj.todayKey}_${pupil.id}`,
            type: 'daily_puzzle',
            callsign: pupil.name,
            house: pupil.house,
            xp: bankRes.grantedXp,
            streak: prog.streak,
            moves: 1,
          });
          vc.dailySolvedBanner = `Checkmate! +${bankRes.grantedXp} XP earned · 🔥 ${prog.streak}-Day Streak!`;
        } else {
          vc.dailySolvedBanner = pupil
            ? `Checkmate! Today's +15 XP already banked (🔥 ${prog.streak}-Day Streak). Try Next Puzzle!`
            : `Checkmate! Tap in with your Club Callsign above to bank +15 XP & build a Streak!`;
        }
      } else {
        vc.dailySolvedBanner = `Spot on — ${vc.moveLog[0]?.san || 'Checkmate'}! Click Next Puzzle for another drill.`;
      }
      rerenderBoardOnly();
      return true;
    }

    if (legal.some((m) => m.promotion)) {
      vc.pendingPromotion = { fromR, fromC, toR, toC };
      vc.selected = null;
      rerenderBoardOnly();
      return true;
    }

    applyVirtualChessMove(vc, legal[0], false);
    vc.drawnArrows = [];
    vc.highlightedSquares = [];

    if (vc.mode === 'online') {
      broadcastLocalMoveToOnlineRoom();
    }

    const unlockedHousePt = evaluateGameEndPracticeXp();
    const willAiReply =
      vc.mode === 'ai' && vc.status === 'playing' && vc.turn !== vc.humanSide;
    if (willAiReply) {
      vc.aiThinking = true;
    }
    if (unlockedHousePt) {
      ctx.renderChessHubView();
    } else {
      rerenderBoardOnly(true);
    }
    if (willAiReply) {
      maybeScheduleAiReply(true);
    }
    return true;
  };

  // Right-click arrow & square highlight handlers (Windows mouse/trackpad)
  window.handleVirtualRightDown = function (e, r, c) {
    if (e && e.button === 2) {
      e.preventDefault();
      rightMouseDragStart = [r, c];
    }
  };

  window.handleVirtualRightUp = function (e, r, c) {
    if (!e || e.button !== 2 || !rightMouseDragStart) return;
    e.preventDefault();
    const vc = getVc();
    const [sr, sc] = rightMouseDragStart;
    rightMouseDragStart = null;
    if (sr === r && sc === c) {
      const sq = sqName(r, c);
      const list = vc.highlightedSquares || [];
      vc.highlightedSquares = list.includes(sq)
        ? list.filter((x) => x !== sq)
        : [...list, sq];
    } else {
      const arrows = vc.drawnArrows || [];
      const existsIdx = arrows.findIndex(
        (a) => a.from[0] === sr && a.from[1] === sc && a.to[0] === r && a.to[1] === c,
      );
      if (existsIdx >= 0) arrows.splice(existsIdx, 1);
      else arrows.push({ from: [sr, sc], to: [r, c] });
      vc.drawnArrows = arrows;
    }
    rerenderBoardOnly();
  };

  window.handleVirtualSquareTap = function (r, c) {
    const vc = getVc();
    if ((vc.drawnArrows && vc.drawnArrows.length > 0) || (vc.highlightedSquares && vc.highlightedSquares.length > 0)) {
      vc.drawnArrows = [];
      vc.highlightedSquares = [];
    }
    if (vc.replayPlyIndex !== null) {
      vc.replayPlyIndex = null;
      rerenderBoardOnly();
      return;
    }
    if (vc.status !== 'playing' || vc.aiThinking || vc.pendingPromotion) return;
    if (vc.mode === 'ai' && vc.turn !== vc.humanSide) return;
    if (
      vc.mode === 'online' &&
      (vc.onlineRoomData?.status !== 'playing' || vc.turn !== vc.onlineSide)
    )
      return;

    const tappedPiece = vc.board[r][c];
    const tappedSide = sideOf(tappedPiece);

    if (!vc.selected) {
      if (tappedSide === vc.turn) {
        vc.selected = [r, c];
        rerenderBoardOnly();
      }
      return;
    }

    const [selR, selC] = vc.selected;
    if (selR === r && selC === c) {
      vc.selected = null;
      rerenderBoardOnly();
      return;
    }

    if (attemptHumanMove(selR, selC, r, c)) {
      return;
    }

    if (tappedSide === vc.turn) {
      vc.selected = [r, c];
    } else {
      vc.selected = null;
    }
    rerenderBoardOnly();
  };

  window.handleVirtualDragStart = function (e, r, c) {
    const vc = getVc();
    if (vc.status !== 'playing' || vc.aiThinking || vc.replayPlyIndex !== null) return;
    if (sideOf(vc.board[r][c]) !== vc.turn) return;
    if (vc.mode === 'online' && vc.turn !== vc.onlineSide) return;
    if (e && e.dataTransfer) {
      e.dataTransfer.setData('text/plain', JSON.stringify({ r, c }));
    }
    vc.selected = [r, c];
  };

  window.handleVirtualDragEnd = function () {
    const vc = getVc();
    if (vc.selected) {
      vc.selected = null;
      rerenderBoardOnly();
    }
  };

  window.handleVirtualDrop = function (e, toR, toC) {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const raw = e?.dataTransfer?.getData('text/plain');
      if (!raw) return;
      const { r: fromR, c: fromC } = JSON.parse(raw);
      if (fromR === toR && fromC === toC) return;
      if (!attemptHumanMove(fromR, fromC, toR, toC)) {
        const vc = getVc();
        vc.selected = null;
        rerenderBoardOnly();
      }
    } catch {}
  };

  window.chooseVirtualPromotion = function (promoChar) {
    const vc = getVc();
    if (!vc.pendingPromotion) return;
    const { fromR, fromC, toR, toC } = vc.pendingPromotion;
    const legal = getLegalMovesFrom(vc, fromR, fromC).find(
      (m) => m.toR === toR && m.toC === toC && m.promotion === promoChar,
    );
    vc.pendingPromotion = null;
    if (legal) {
      applyVirtualChessMove(vc, legal, false);
      if (vc.mode === 'online') broadcastLocalMoveToOnlineRoom();
      const unlockedHousePt = evaluateGameEndPracticeXp();
      const willAiReply =
        vc.mode === 'ai' && vc.status === 'playing' && vc.turn !== vc.humanSide;
      if (willAiReply) vc.aiThinking = true;
      if (unlockedHousePt) ctx.renderChessHubView();
      else rerenderBoardOnly(true);
      if (willAiReply) maybeScheduleAiReply(true);
    } else {
      rerenderBoardOnly();
    }
  };

  window.cancelVirtualPromotion = function () {
    const vc = getVc();
    vc.pendingPromotion = null;
    rerenderBoardOnly();
  };

  // Interactive Move History Scrubbing & "Retry Your Mistake"
  window.scrubVirtualMove = function (plyIdx) {
    const vc = getVc();
    if (plyIdx === null || plyIdx === undefined || plyIdx >= vc.history.length) {
      vc.replayPlyIndex = null;
    } else {
      vc.replayPlyIndex = Math.max(0, plyIdx);
    }
    rerenderBoardOnly();
  };

  window.scrubVirtualMoveStep = function (delta) {
    const vc = getVc();
    if (vc.history.length === 0) return;
    const cur = vc.replayPlyIndex === null ? vc.history.length : vc.replayPlyIndex;
    const next = cur + delta;
    if (next >= vc.history.length) vc.replayPlyIndex = null;
    else vc.replayPlyIndex = Math.max(0, next);
    rerenderBoardOnly();
  };

  window.retryCoachBlunder = function () {
    const vc = getVc();
    const bl = vc.gameReview?.blunderItem;
    if (!bl || !vc.history[bl.historyIdx]) return;
    const snap = vc.history[bl.historyIdx];
    vc.board = cloneBoard(snap.board);
    vc.turn = snap.turn;
    vc.castling = { ...snap.castling };
    vc.enPassant = snap.enPassant ? [...snap.enPassant] : null;
    vc.halfMoveClock = snap.halfMoveClock;
    vc.fullMoveNumber = snap.fullMoveNumber;
    vc.positionCounts = { ...snap.positionCounts };
    vc.lastMove = snap.lastMove ? { from: [...snap.lastMove.from], to: [...snap.lastMove.to] } : null;
    vc.moveLog = [...snap.moveLog];
    vc.capturedByWhite = [...snap.capturedByWhite];
    vc.capturedByBlack = [...snap.capturedByBlack];
    vc.history = vc.history.slice(0, bl.historyIdx);
    vc.status = 'playing';
    vc.winner = null;
    vc.gameReview = null;
    vc.replayPlyIndex = null;
    vc.selected = null;
    if (vc.mode === 'online') {
      stopOnlinePolling();
      vc.mode = 'ai';
      vc.onlineRoomCode = '';
    }
    vc.hintMove = {
      fromR: bl.fromR,
      fromC: bl.fromC,
      toR: bl.toR,
      toC: bl.toC,
      san: bl.bestSan,
      fromSq: bl.fromSq,
      toSq: bl.toSq,
      reason: `fixes your earlier ${bl.playedSan} mistake!`,
    };
    rerenderBoardOnly();
    ctx.showChessToast(`🔄 Position restored! Try ${bl.bestSan} (${bl.fromSq}→${bl.toSq})!`, 'info');
  };

  // Live Online 2-Laptop Duel Controllers
  window.setOnlineHostPrefSide = function (side) {
    const vc = getVc();
    vc.onlineHostPrefSide = side === 'b' ? 'b' : 'w';
    rerenderBoardOnly();
  };

  window.createLiveOnlineDuel = async function () {
    const st = ctx.getState();
    const vc = getVc();
    const pupil = vc.tappedInPlayerId
      ? (st.players || []).find((p) => p.id === vc.tappedInPlayerId)
      : null;
    const btn = document.getElementById('btn-create-online-duel');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Creating Room...';
    }
    vc.onlineError = '';
    const code = generateSafeDuelRoomCode();
    const hostSide = vc.onlineHostPrefSide === 'b' ? 'b' : 'w';
    const res = await createOnlineDuelRoom({
      roomCode: code,
      hostPlayerId: pupil ? pupil.id : getOrCreateGuestDeviceId(),
      hostCallsign: pupil ? pupil.name : 'White Challenger',
      hostHouse: pupil ? pupil.house : 'warrior',
      hostSide,
      timeControlMins: vc.timeControlMins || 5,
    });

    if (!res.ok || !res.room) {
      vc.onlineError = res.error || 'Could not create online room.';
      rerenderBoardOnly();
      return;
    }

    const fresh = createDefaultVirtualChessState();
    fresh.mode = 'online';
    fresh.boardTheme = vc.boardTheme;
    fresh.tappedInPlayerId = vc.tappedInPlayerId;
    fresh.onlineRoomCode = res.room.roomCode;
    fresh.onlineSide = hostSide;
    fresh.onlineHostPrefSide = hostSide;
    fresh.onlineSeq = res.room.seq;
    fresh.onlineRoomData = res.room;
    fresh.timeControlMins = res.room.timeControlMins;
    fresh.whiteTimeSecs = res.room.whiteTimeSecs;
    fresh.blackTimeSecs = res.room.blackTimeSecs;
    fresh.flipped = hostSide === 'b';
    st.virtualChess = fresh;
    writeSavedOnlineDuelCode(res.room.roomCode);

    startOnlinePolling();
    rerenderBoardOnly();
    ctx.showChessToast(`📡 Room ${res.room.roomCode} created! Share the code with your classmate.`, 'success');
  };

  window.joinLiveOnlineDuel = async function (explicitCode = '') {
    const st = ctx.getState();
    const vc = getVc();
    const inputEl = document.getElementById('vc-join-code-input');
    const rawCode = String(explicitCode || inputEl?.value || '')
      .trim()
      .toUpperCase();
    if (!rawCode) {
      vc.onlineError = 'Enter your classmate’s Room Code (e.g. CASTLE-48).';
      rerenderBoardOnly();
      return;
    }

    const pupil = vc.tappedInPlayerId
      ? (st.players || []).find((p) => p.id === vc.tappedInPlayerId)
      : null;
    const btn = document.getElementById('btn-join-online-duel');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '...';
    }
    vc.onlineError = '';

    const res = await joinOnlineDuelRoom({
      roomCode: rawCode,
      guestPlayerId: pupil ? pupil.id : getOrCreateGuestDeviceId(),
      guestCallsign: pupil ? pupil.name : 'Black Challenger',
      guestHouse: pupil ? pupil.house : 'invincible',
    });

    if (!res.ok || !res.room) {
      vc.onlineError = res.error || 'Could not join room.';
      rerenderBoardOnly();
      return;
    }

    const side = res.assignedSide || 'b';
    const fresh = createDefaultVirtualChessState();
    fresh.mode = 'online';
    fresh.boardTheme = vc.boardTheme;
    fresh.tappedInPlayerId = vc.tappedInPlayerId;
    fresh.onlineRoomCode = res.room.roomCode;
    fresh.onlineSide = side;
    fresh.onlineSeq = res.room.seq;
    fresh.onlineRoomData = res.room;
    fresh.board = cloneBoard(res.room.board);
    fresh.turn = res.room.turn;
    fresh.castling = { ...(res.room.castling || { K: true, Q: true, k: true, q: true }) };
    fresh.enPassant = res.room.enPassant || null;
    fresh.halfMoveClock = res.room.halfMoveClock || 0;
    fresh.fullMoveNumber = res.room.fullMoveNumber || 1;
    fresh.lastMove = res.room.lastMove || null;
    fresh.moveLog = [...(res.room.moveLog || [])];
    fresh.capturedByWhite = [...(res.room.capturedByWhite || [])];
    fresh.capturedByBlack = [...(res.room.capturedByBlack || [])];
    fresh.status = res.room.status === 'waiting' ? 'playing' : res.room.status;
    fresh.winner = res.room.winner || null;
    fresh.timeControlMins = res.room.timeControlMins;
    fresh.whiteTimeSecs = res.room.whiteTimeSecs;
    fresh.blackTimeSecs = res.room.blackTimeSecs;
    fresh.clockActive =
      res.room.timeControlMins > 0 && fresh.status === 'playing' && fresh.moveLog.length > 0;
    fresh.flipped = side === 'b';
    st.virtualChess = fresh;
    writeSavedOnlineDuelCode(fresh.status === 'playing' ? res.room.roomCode : '');

    playClubSound('bounty');
    startOnlinePolling();
    rerenderBoardOnly();
    const isResume = (res.room.moveLog || []).length > 0;
    ctx.showChessToast(
      isResume
        ? `⚡ Resumed Room ${res.room.roomCode} at Move ${Math.ceil(res.room.moveLog.length / 2)} (${side === 'w' ? 'White' : 'Black'})!`
        : `⚔️ Joined Room ${res.room.roomCode} as ${side === 'w' ? 'White' : 'Black'}!`,
      'success',
    );
  };

  window.leaveLiveOnlineDuel = function () {
    stopOnlinePolling();
    writeSavedOnlineDuelCode('');
    const vc = getVc();
    vc.onlineRoomCode = '';
    vc.onlineRoomData = null;
    vc.onlineError = '';
    window.startNewVirtualGame();
  };

  window.sendVirtualDuelReaction = async function (text) {
    const vc = getVc();
    if (vc.mode !== 'online' || !vc.onlineRoomCode) return;
    const res = await sendOnlineDuelReaction({
      roomCode: vc.onlineRoomCode,
      side: vc.onlineSide,
      text,
    });
    if (res.ok && res.room) {
      vc.onlineSeq = res.room.seq;
      vc.onlineReactionToast = res.room.lastReaction;
      rerenderBoardOnly();
    }
  };

  window.respondOnlineDrawOffer = async function (accept) {
    const vc = getVc();
    if (vc.mode !== 'online' || !vc.onlineRoomCode) return;
    if (accept) {
      vc.status = 'draw_agreed';
      vc.winner = 'draw';
      vc.clockActive = false;
      playClubSound('bounty');
      await broadcastLocalMoveToOnlineRoom();
      evaluateGameEndPracticeXp();
    } else {
      await pushOnlineDuelMove({
        roomCode: vc.onlineRoomCode,
        expectedSeq: vc.onlineSeq,
        drawOfferBy: null,
      }).then((r) => {
        if (r.ok && r.room) {
          vc.onlineSeq = r.room.seq;
          vc.onlineRoomData = r.room;
        }
      });
    }
    rerenderBoardOnly();
  };

  // Daily Puzzle Helpers
  window.showDailyPuzzleHint = function () {
    const vc = getVc();
    const puz = DAILY_TACTICAL_PUZZLES[vc.dailyPuzzleIdx % DAILY_TACTICAL_PUZZLES.length];
    const fromC = puz.solutionFrom.charCodeAt(0) - 97;
    const fromR = 8 - Number(puz.solutionFrom[1]);
    const toC = puz.solutionTo.charCodeAt(0) - 97;
    const toR = 8 - Number(puz.solutionTo[1]);
    vc.hintMove = {
      fromR,
      fromC,
      toR,
      toC,
      san: `${puz.solutionFrom}→${puz.solutionTo}`,
      fromSq: puz.solutionFrom,
      toSq: puz.solutionTo,
      reason: puz.hint,
    };
    rerenderBoardOnly();
  };

  window.nextDailyPracticePuzzle = function () {
    const vc = getVc();
    loadDailyPuzzleIntoBoard((vc.dailyPuzzleIdx || 0) + 1);
    rerenderBoardOnly();
  };

  window.startNewVirtualGame = function () {
    if (aiMoveTimeout) clearTimeout(aiMoveTimeout);
    const prev = getVc();
    if (prev.mode === 'daily') {
      loadDailyPuzzleIntoBoard(prev.dailyPuzzleIdx);
      rerenderBoardOnly();
      return;
    }
    if (prev.mode === 'online' && prev.onlineRoomCode && prev.status === 'playing') {
      ctx.showChessToast('Use Resign or Leave Room during a live online duel.', 'info');
      return;
    }
    stopOnlinePolling();

    const bot = resolveBotProfile(prev.aiLevel);
    const fresh = createDefaultVirtualChessState();
    fresh.mode = prev.mode;
    fresh.aiLevel = bot.id;
    fresh.botQuip = prev.mode === 'ai' ? bot.quips.start : '';
    fresh.humanSide = prev.humanSide;
    fresh.boardTheme = prev.boardTheme;
    fresh.autoFlipPass = prev.autoFlipPass;
    fresh.timeControlMins = prev.timeControlMins;
    fresh.whiteTimeSecs = prev.timeControlMins * 60;
    fresh.blackTimeSecs = prev.timeControlMins * 60;
    fresh.whitePlayerId = prev.whitePlayerId;
    fresh.blackPlayerId = prev.blackPlayerId;
    fresh.tappedInPlayerId = prev.tappedInPlayerId || getSavedTappedInPlayerId();
    fresh.flipped = fresh.mode === 'ai' ? fresh.humanSide === 'b' : false;

    const aiStarts = fresh.mode === 'ai' && fresh.humanSide === 'b';
    if (aiStarts) fresh.aiThinking = true;
    ctx.getState().virtualChess = fresh;
    rerenderBoardOnly();
    if (aiStarts) {
      maybeScheduleAiReply(true);
    }
  };

  window.setVirtualChessMode = function (mode) {
    const vc = getVc();
    if (vc.mode === mode) return;
    stopOnlinePolling();
    vc.mode = mode;
    vc.onlineRoomCode = '';
    vc.onlineRoomData = null;
    vc.onlineError = '';
    if (mode === 'daily') {
      const todayObj = getTodayDailyPuzzle();
      loadDailyPuzzleIntoBoard(todayObj.index);
      rerenderBoardOnly();
      return;
    }
    window.startNewVirtualGame();
  };

  window.setVirtualAiLevel = function (level) {
    const vc = getVc();
    const bot = resolveBotProfile(level);
    vc.aiLevel = bot.id;
    vc.botQuip = bot.quips.start;
    if (vc.moveLog.length === 0) {
      window.startNewVirtualGame();
    } else {
      rerenderBoardOnly();
      ctx.showChessToast(`${bot.icon} Opponent set to ${bot.name} (${bot.elo} ELO)`, 'info');
    }
  };

  window.setVirtualHumanSide = function (side) {
    const vc = getVc();
    if (vc.humanSide === side && vc.moveLog.length === 0) return;
    vc.humanSide = side;
    window.startNewVirtualGame();
  };

  window.setVirtualTimeControl = function (mins) {
    const vc = getVc();
    if (vc.mode === 'online' && vc.onlineRoomCode) return;
    vc.timeControlMins = Number(mins) || 0;
    vc.whiteTimeSecs = vc.timeControlMins * 60;
    vc.blackTimeSecs = vc.timeControlMins * 60;
    vc.clockActive = vc.timeControlMins > 0 && vc.moveLog.length > 0 && vc.status === 'playing';
    rerenderBoardOnly();
  };

  window.setVirtualRosterPlayer = function (side, playerId) {
    const vc = getVc();
    if (side === 'w') vc.whitePlayerId = playerId;
    else vc.blackPlayerId = playerId;
    vc.loggedToLadder = false;
    rerenderBoardOnly();
  };

  window.toggleVirtualAutoFlip = function (checked) {
    const vc = getVc();
    vc.autoFlipPass = Boolean(checked);
    if (vc.autoFlipPass && vc.mode === 'pass') {
      vc.flipped = vc.turn === 'b';
    }
    rerenderBoardOnly();
  };

  window.flipVirtualBoard = function () {
    const vc = getVc();
    vc.flipped = !vc.flipped;
    rerenderBoardOnly();
  };

  window.toggleVirtualBoardTheme = function () {
    const vc = getVc();
    vc.boardTheme = vc.boardTheme === 'wood' ? 'slate' : 'wood';
    rerenderBoardOnly();
  };

  window.undoVirtualMove = function () {
    if (aiMoveTimeout) clearTimeout(aiMoveTimeout);
    const vc = getVc();
    if (vc.mode === 'online' || vc.history.length === 0) return;

    const restoreSnap = (snap) => {
      vc.board = snap.board;
      vc.turn = snap.turn;
      vc.castling = snap.castling;
      vc.enPassant = snap.enPassant;
      vc.halfMoveClock = snap.halfMoveClock;
      vc.fullMoveNumber = snap.fullMoveNumber;
      vc.positionCounts = snap.positionCounts;
      vc.lastMove = snap.lastMove;
      vc.moveLog = snap.moveLog;
      vc.capturedByWhite = snap.capturedByWhite;
      vc.capturedByBlack = snap.capturedByBlack;
      vc.status = snap.status;
      vc.winner = snap.winner;
      vc.whiteTimeSecs = snap.whiteTimeSecs;
      vc.blackTimeSecs = snap.blackTimeSecs;
    };

    let snap = vc.history.pop();
    if (vc.mode === 'ai' && snap.turn !== vc.humanSide && vc.history.length > 0) {
      snap = vc.history.pop();
    }
    restoreSnap(snap);
    vc.selected = null;
    vc.hintMove = null;
    vc.pendingPromotion = null;
    vc.confirmAction = null;
    vc.aiThinking = false;
    vc.gameReview = null;
    vc.replayPlyIndex = null;
    vc.loggedToLadder = false;
    if (!vc.xpGrantedThisGame) {
      vc.xpEvaluated = false;
      vc.lastXpNotice = null;
    }
    rerenderBoardOnly();
  };

  window.setTappedInPupil = function (playerId) {
    const vc = getVc();
    vc.tappedInPlayerId = playerId || '';
    saveTappedInPlayerId(vc.tappedInPlayerId);
    vc.lastXpNotice = null;
    rerenderBoardOnly();
    if (vc.tappedInPlayerId) {
      const p = (ctx.getState().players || []).find((x) => x.id === vc.tappedInPlayerId);
      if (p)
        ctx.showChessToast(
          `👤 Tapped in as ${p.name}! Earn XP & House Points across Bots, Puzzles & Live Duels.`,
          'success',
        );
    }
  };

  window.requestVirtualHint = function () {
    const vc = getVc();
    if (vc.mode === 'online' || vc.status !== 'playing' || vc.aiThinking) return;
    if (vc.mode === 'daily') {
      window.showDailyPuzzleHint();
      return;
    }
    vc.hintsUsedCount = (vc.hintsUsedCount || 0) + 1;
    vc.hintMove = computeCoachHint(vc);
    rerenderBoardOnly();
  };

  window.promptVirtualEndAction = function (action) {
    const vc = getVc();
    vc.confirmAction = action;
    rerenderBoardOnly();
  };

  window.cancelVirtualEndAction = function () {
    const vc = getVc();
    vc.confirmAction = null;
    rerenderBoardOnly();
  };

  window.confirmVirtualEndAction = async function () {
    const vc = getVc();
    const act = vc.confirmAction;
    vc.confirmAction = null;

    if (vc.mode === 'online' && vc.onlineRoomCode) {
      if (act === 'resign') {
        vc.status = 'resigned';
        vc.winner = vc.onlineSide === 'w' ? 'b' : 'w';
        vc.clockActive = false;
        playClubSound('win');
        await broadcastLocalMoveToOnlineRoom();
        evaluateGameEndPracticeXp();
      } else if (act === 'draw') {
        await pushOnlineDuelMove({
          roomCode: vc.onlineRoomCode,
          expectedSeq: vc.onlineSeq,
          drawOfferBy: vc.onlineSide,
        }).then((r) => {
          if (r.ok && r.room) {
            vc.onlineSeq = r.room.seq;
            vc.onlineRoomData = r.room;
          }
        });
        ctx.showChessToast('🤝 Draw offer sent to your opponent!', 'info');
      }
      rerenderBoardOnly();
      return;
    }

    if (act === 'resign') {
      vc.status = 'resigned';
      vc.winner = vc.turn === 'w' ? 'b' : 'w';
      vc.clockActive = false;
      playClubSound('win');
    } else if (act === 'draw') {
      vc.status = 'draw_agreed';
      vc.winner = 'draw';
      vc.clockActive = false;
      playClubSound('bounty');
    }
    const unlocked = evaluateGameEndPracticeXp();
    if (unlocked) ctx.renderChessHubView();
    else rerenderBoardOnly();
  };

  window.logVirtualMatchToLadder = function () {
    const st = ctx.getState();
    const vc = getVc();
    if (st.userRole !== 'teacher' || vc.loggedToLadder) return;
    const p1 = (st.players || []).find((p) => p.id === vc.whitePlayerId);
    const p2 = (st.players || []).find((p) => p.id === vc.blackPlayerId);
    if (!p1 || !p2 || p1.id === p2.id) return;

    ctx.pushChessUndoSnapshot(`Virtual Board: ${p1.name} vs ${p2.name}`);
    const outcome = vc.winner === 'w' ? 'p1' : vc.winner === 'b' ? 'p2' : 'draw';
    const resultStr = outcome === 'p1' ? '1-0' : outcome === 'p2' ? '0-1' : '½-½';

    ctx.applyCanonicalPlayerMatchStats(p1, p2, outcome, 15, 15);
    st.matches.unshift({
      id: 'm_' + Date.now(),
      date: 'Virtual Chess Match',
      timestamp: Date.now(),
      round: 'Virtual Chess Board',
      white: p1.name,
      black: p2.name,
      whiteId: p1.id,
      blackId: p2.id,
      whiteHouse: p1.house,
      blackHouse: p2.house,
      result: resultStr,
      opening: detectOpeningName(vc.moveLog) || 'App Virtual Chess',
    });

    vc.loggedToLadder = true;
    ctx.saveChessState();
    ctx.renderChessHubView();
    const hW = HOUSES[p1.house]?.name || p1.house;
    const hB = HOUSES[p2.house]?.name || p2.house;
    ctx.showChessToast(
      `🏆 Logged ${p1.name} (${hW}) ${resultStr} ${p2.name} (${hB}) to Club Ladder!`,
      'success',
    );
  };
}
