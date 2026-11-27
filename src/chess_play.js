/**
 * The History Revision Hub — Virtual Chess Set & Computer Coach Engine
 * Self-contained FIDE legal chess rules, crisp Staunton SVG pieces, algebraic move log,
 * chess clocks, 2-Player Pass-and-Play, and 3-level Computer Coach (Easy / Medium / Hard).
 */

import { HOUSES } from './chess_data.js';
import { playClubSound } from './chess_club_modes.js';

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
const DAILY_XP_CAP = 100;

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
    mode: 'ai', // 'ai' | 'pass'
    aiLevel: 'medium', // 'easy' | 'medium' | 'hard'
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

export function chooseBestMove(game, level = 'medium') {
  const legal = getAllLegalMovesForState(game);
  if (legal.length === 0) return null;
  if (legal.length === 1) return legal[0];

  // Prefer Queen promotion unless underpromotion strictly beats it
  const candidates = legal.filter((m) => !m.promotion || m.promotion === 'q' || m.promotion === 'n');

  let searchDepth = 1;
  let jitter = 25;
  let useQuiesce = false;

  if (level === 'easy') {
    searchDepth = 0; // 1-ply evaluation + friendly beginner jitter
    jitter = 145;
  } else if (level === 'medium') {
    searchDepth = 1; // 2-ply lookahead
    jitter = 28;
    useQuiesce = true;
  } else {
    searchDepth = 2; // 3-ply lookahead + 2-ply capture quiescence
    jitter = 8;
    useQuiesce = true;
  }

  const ordered = orderMovesForSearch(game.board, candidates);
  let bestMove = ordered[0];
  let bestScore = -Infinity;

  for (const mv of ordered) {
    const child = makeLightSearchChild(game, mv);
    let exactScore = -negamax(child, searchDepth, -30000, 30000, useQuiesce);

    // Slight repetition avoidance when winning
    const childKey = computePositionKey(child);
    if ((game.positionCounts?.[childKey] || 0) >= 2 && exactScore > -40) {
      exactScore -= 120;
    }

    // Keep mates exact so even Easy takes an obvious mate in 1
    const noisyScore =
      Math.abs(exactScore) > 15000 ? exactScore : exactScore + (Math.random() * 2 - 1) * jitter;

    if (noisyScore > bestScore) {
      bestScore = noisyScore;
      bestMove = mv;
    }
  }

  return bestMove;
}

export function computeCoachHint(game) {
  const best = chooseBestMove(game, 'hard');
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
    <div style="display: inline-flex; align-items: center; gap: 5px; min-height: 20px;">
      <span style="font-size: 0.92rem; letter-spacing: -1px; color: ${isWhiteRow ? '#334155' : '#475569'}; font-family: 'Segoe UI Symbol', 'Apple Symbols', serif;">${icons}</span>
      ${advHtml}
    </div>
  `;
}

function getStatusBannerInfo(vc, whiteLabel, blackLabel) {
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
      text: '🤖 Computer Coach is thinking...',
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
  return {
    bg: '#f8fafc',
    border: '#e2e8f0',
    color: '#0f172a',
    text: `${turnLabel} · Tap or drag any piece to play`,
  };
}

function renderVirtualChessInner(chessState) {
  if (!chessState.virtualChess) {
    chessState.virtualChess = createDefaultVirtualChessState();
  }
  const vc = chessState.virtualChess;
  const players = chessState.players || [];

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

  const aiNames = {
    easy: '🌱 Rookie Bot',
    medium: '⚔️ Club Coach Bot',
    hard: '👑 Grandmaster Bot',
  };

  const humanDisplayLabel = tappedPupil ? tappedPupil.name : 'You';

  const whiteLabel =
    vc.mode === 'ai'
      ? vc.humanSide === 'w'
        ? `${humanDisplayLabel} (White)`
        : aiNames[vc.aiLevel] || 'Computer'
      : whiteRoster
        ? whiteRoster.name
        : 'White Player';

  const blackLabel =
    vc.mode === 'ai'
      ? vc.humanSide === 'b'
        ? `${humanDisplayLabel} (Black)`
        : aiNames[vc.aiLevel] || 'Computer'
      : blackRoster
        ? blackRoster.name
        : 'Black Player';

  const topSide = vc.flipped ? 'w' : 'b';
  const bottomSide = vc.flipped ? 'b' : 'w';

  const matDiff = computeMaterialDiff(vc.board);
  const legalTargets = new Map();
  if (vc.selected && vc.status === 'playing' && !vc.aiThinking && !vc.pendingPromotion) {
    const moves = getLegalMovesFrom(vc, vc.selected[0], vc.selected[1]);
    moves.forEach((m) => {
      const key = `${m.toR},${m.toC}`;
      if (!legalTargets.has(key)) legalTargets.set(key, m);
    });
  }

  const checkSide =
    vc.status === 'playing' || vc.status === 'checkmate'
      ? isSideInCheck(vc.board, vc.turn)
        ? vc.turn
        : null
      : null;
  const checkKingSq = checkSide ? findKingSquare(vc.board, checkSide) : null;

  const lightSq = vc.boardTheme === 'slate' ? '#e2e8f0' : '#f0d9b5';
  const darkSq = vc.boardTheme === 'slate' ? '#64748b' : '#b58863';
  const lastLight = vc.boardTheme === 'slate' ? '#bae6fd' : '#f7ec6e';
  const lastDark = vc.boardTheme === 'slate' ? '#38bdf8' : '#dac34b';

  // Render 64 squares respecting board orientation
  let squaresHtml = '';
  for (let viewR = 0; viewR < 8; viewR++) {
    for (let viewC = 0; viewC < 8; viewC++) {
      const r = vc.flipped ? 7 - viewR : viewR;
      const c = vc.flipped ? 7 - viewC : viewC;
      const isLight = (r + c) % 2 === 0;
      const piece = vc.board[r][c];
      const isSelected = vc.selected && vc.selected[0] === r && vc.selected[1] === c;
      const isLast =
        vc.lastMove &&
        ((vc.lastMove.from[0] === r && vc.lastMove.from[1] === c) ||
          (vc.lastMove.to[0] === r && vc.lastMove.to[1] === c));
      const isHintFrom = vc.hintMove && vc.hintMove.fromR === r && vc.hintMove.fromC === c;
      const isHintTo = vc.hintMove && vc.hintMove.toR === r && vc.hintMove.toC === c;
      const isCheckSq = checkKingSq && checkKingSq[0] === r && checkKingSq[1] === c;
      const isTarget = legalTargets.has(`${r},${c}`);

      let bg = isLight ? lightSq : darkSq;
      if (isLast) bg = isLight ? lastLight : lastDark;
      if (isHintFrom || isHintTo) bg = '#fde047';
      if (isSelected) bg = '#7dd3fc';
      if (isCheckSq) bg = 'radial-gradient(circle, #ef4444 18%, #dc2626 68%, #991b1b 100%)';

      const canDrag =
        vc.status === 'playing' &&
        !vc.aiThinking &&
        !vc.pendingPromotion &&
        piece !== '.' &&
        sideOf(piece) === vc.turn &&
        (vc.mode === 'pass' || vc.turn === vc.humanSide);

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
             ondragstart="window.handleVirtualDragStart(event, ${r}, ${c})"
             ondragend="window.handleVirtualDragEnd()"
             ondragover="event.preventDefault()"
             ondrop="window.handleVirtualDrop(event, ${r}, ${c})"
             draggable="${canDrag ? 'true' : 'false'}"
             data-sq="${sqName(r, c)}"
             style="background: ${bg}; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; position: relative; user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent; cursor: ${canDrag || isTarget ? 'pointer' : 'default'}; touch-action: manipulation; ${isHintTo ? 'box-shadow: inset 0 0 0 3px #d97706;' : ''}">
          ${rankLabel}
          ${fileLabel}
          ${renderStauntonSvg(piece)}
          ${targetOverlay}
        </div>
      `;
    }
  }

  const renderPlayerStrip = (side) => {
    const isWhite = side === 'w';
    const name = isWhite ? whiteLabel : blackLabel;
    const isActiveTurn = vc.status === 'playing' && vc.turn === side;
    const captured = isWhite ? vc.capturedByWhite : vc.capturedByBlack;
    const adv = isWhite ? Math.max(0, matDiff) : Math.max(0, -matDiff);
    const secs = isWhite ? vc.whiteTimeSecs : vc.blackTimeSecs;
    const lowTime = vc.timeControlMins > 0 && secs <= 30;

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 44px; box-sizing: border-box; background: ${isActiveTurn ? '#ffffff' : '#f8fafc'}; border: 1.5px solid ${isActiveTurn ? '#0284c7' : '#e2e8f0'}; border-radius: 9px; padding: 5px 10px; box-shadow: ${isActiveTurn ? '0 2px 8px rgba(2,132,199,0.12)' : 'none'};">
        <div style="display: flex; align-items: center; gap: 9px; min-width: 0;">
          <span style="width: 26px; height: 26px; border-radius: 6px; background: ${isWhite ? '#f8fafc' : '#1e293b'}; color: ${isWhite ? '#0f172a' : '#ffffff'}; border: 1.5px solid #cbd5e1; display: inline-flex; align-items: center; justify-content: center; font-size: 0.95rem; font-weight: 900; flex-shrink: 0;">
            ${isWhite ? '♔\uFE0E' : '♚\uFE0E'}
          </span>
          <div style="min-width: 0;">
            <div style="font-size: 0.88rem; font-weight: 800; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${name}
              ${isActiveTurn ? `<span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #16a34a; margin-left: 5px; vertical-align: middle;"></span>` : ''}
            </div>
            ${renderCapturedRow(captured, adv, isWhite)}
          </div>
        </div>

        ${
          vc.timeControlMins > 0
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

  // Format move pairs for compact algebraic scoresheet
  let moveRowsHtml = '';
  for (let i = 0; i < vc.moveLog.length; i += 2) {
    const num = Math.floor(i / 2) + 1;
    const wSan = vc.moveLog[i]?.san || '';
    const bSan = vc.moveLog[i + 1]?.san || '';
    moveRowsHtml += `
      <div style="display: grid; grid-template-columns: 32px 1fr 1fr; padding: 3px 8px; font-family: monospace; font-size: 0.78rem; background: ${num % 2 === 0 ? '#f8fafc' : '#ffffff'}; border-radius: 4px;">
        <span style="color: #94a3b8; font-weight: 700;">${num}.</span>
        <span style="color: #0f172a; font-weight: 700;">${wSan}</span>
        <span style="color: #334155; font-weight: 700;">${bSan}</span>
      </div>
    `;
  }

  const banner = getStatusBannerInfo(vc, whiteLabel, blackLabel);
  const isFinished = vc.status !== 'playing';
  const canTeacherLog =
    chessState.userRole === 'teacher' &&
    vc.mode === 'pass' &&
    whiteRoster &&
    blackRoster &&
    whiteRoster.id !== blackRoster.id &&
    isFinished;

  const innerHtml = `
    <style>
      .vc-layout-grid {
        display: grid;
        grid-template-columns: clamp(290px, calc(100vh - 455px), 425px) minmax(270px, 360px);
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
            !tappedPupil
              ? `
            <button type="button" onclick="window.openPupilJoinRequestModal && window.openPupilJoinRequestModal()" style="background: #ffffff; color: #0284c7; border: 1.5px solid #7dd3fc; border-radius: 8px; padding: 5px 10px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
              + New Member? Get a Callsign
            </button>
          `
              : ''
          }
        </div>

        ${
          tappedPupil
            ? `
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; flex: 1; justify-content: flex-end; min-width: 240px;">
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
            ⚡ Beat the Computer Coach to earn XP (<strong style="color: #0f172a;">100 XP = +1 House Point</strong>)
          </div>
        `
        }
      </div>

      <div class="vc-layout-grid">
        
        <!-- LEFT COLUMN: Playable Staunton Chessboard + Top/Bottom Player Bars -->
        <div style="display: flex; flex-direction: column; gap: 6px; width: 100%;">
          
          <!-- Fixed-Height Status Banner (CLS = 0) -->
          <div style="background: ${banner.bg}; border: 1.5px solid ${banner.border}; color: ${banner.color}; border-radius: 8px; padding: 5px 10px; min-height: 34px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-size: 0.83rem; font-weight: 800; text-align: center;">
            <span>${banner.text}</span>
          </div>

          ${renderPlayerStrip(topSide)}

          <!-- 8x8 Board Frame -->
          <div style="position: relative; width: 100%; aspect-ratio: 1 / 1; border: 4px solid #1e293b; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 26px rgba(15, 23, 42, 0.16); display: grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(8, 1fr);">
            ${squaresHtml}

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

        <!-- RIGHT COLUMN: Clean Game Setup, Controls & Move Sheet -->
        <div style="display: flex; flex-direction: column; gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px;">
          
          <!-- 1. Game Mode Segmented Toggle -->
          <div>
            <div style="font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
              Play Mode
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: #e2e8f0; padding: 3px; border-radius: 9px;">
              <button type="button" onclick="window.setVirtualChessMode('ai')" style="background: ${vc.mode === 'ai' ? '#ffffff' : 'transparent'}; color: ${vc.mode === 'ai' ? '#0f172a' : '#475569'}; border: none; border-radius: 7px; padding: 8px 10px; font-size: 0.82rem; font-weight: 800; cursor: pointer; box-shadow: ${vc.mode === 'ai' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};">
                🤖 vs Computer
              </button>
              <button type="button" onclick="window.setVirtualChessMode('pass')" style="background: ${vc.mode === 'pass' ? '#ffffff' : 'transparent'}; color: ${vc.mode === 'pass' ? '#0f172a' : '#475569'}; border: none; border-radius: 7px; padding: 8px 10px; font-size: 0.82rem; font-weight: 800; cursor: pointer; box-shadow: ${vc.mode === 'pass' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};">
                👥 2 Players
              </button>
            </div>
          </div>

          <!-- 2. Mode-Specific Settings -->
          ${
            vc.mode === 'ai'
              ? `
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div>
                <div style="font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px;">
                  Computer Strength
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
                  ${[
                    { id: 'easy', label: '🌱 Easy', sub: 'Rookie' },
                    { id: 'medium', label: '⚔️ Medium', sub: 'Club' },
                    { id: 'hard', label: '👑 Hard', sub: 'Master' },
                  ]
                    .map(
                      (lv) => `
                    <button type="button" onclick="window.setVirtualAiLevel('${lv.id}')" style="background: ${vc.aiLevel === lv.id ? '#0284c7' : '#ffffff'}; color: ${vc.aiLevel === lv.id ? '#ffffff' : '#334155'}; border: 1.5px solid ${vc.aiLevel === lv.id ? '#0284c7' : '#cbd5e1'}; border-radius: 8px; padding: 6px 4px; cursor: pointer; text-align: center;">
                      <div style="font-size: 0.78rem; font-weight: 800;">${lv.label}</div>
                      <div style="font-size: 0.65rem; opacity: 0.82; font-weight: 600;">${lv.sub}</div>
                    </button>
                  `,
                    )
                    .join('')}
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                <span style="font-size: 0.76rem; font-weight: 700; color: #475569;">Play as:</span>
                <div style="display: inline-flex; gap: 5px;">
                  <button type="button" onclick="window.setVirtualHumanSide('w')" style="background: ${vc.humanSide === 'w' ? '#0f172a' : '#ffffff'}; color: ${vc.humanSide === 'w' ? '#ffffff' : '#334155'}; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 10px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">♔ White</button>
                  <button type="button" onclick="window.setVirtualHumanSide('b')" style="background: ${vc.humanSide === 'b' ? '#0f172a' : '#ffffff'}; color: ${vc.humanSide === 'b' ? '#ffffff' : '#334155'}; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 10px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">♚ Black</button>
                </div>
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
                Auto-flip board after each move (tabletop iPad)
              </label>
            </div>
          `
          }

          <!-- 3. Clock Pills -->
          <div>
            <div style="font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px;">
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
                <button type="button" onclick="window.setVirtualTimeControl(${tc.mins})" style="background: ${vc.timeControlMins === tc.mins ? '#0f172a' : '#ffffff'}; color: ${vc.timeControlMins === tc.mins ? '#ffffff' : '#334155'}; border: 1px solid ${vc.timeControlMins === tc.mins ? '#0f172a' : '#cbd5e1'}; border-radius: 6px; padding: 5px 4px; font-size: 0.75rem; font-weight: 800; cursor: pointer;">
                  ${tc.label}
                </button>
              `,
                )
                .join('')}
            </div>
          </div>

          <!-- 4. Primary Action Controls -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 7px;">
            <button type="button" onclick="window.startNewVirtualGame()" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border: none; border-radius: 8px; padding: 9px 10px; font-size: 0.82rem; font-weight: 800; cursor: pointer; box-shadow: 0 2px 6px rgba(2,132,199,0.25);">
              🔄 New Game
            </button>
            <button type="button" onclick="window.undoVirtualMove()" ${vc.history.length === 0 || vc.aiThinking ? 'disabled' : ''} style="background: #ffffff; color: ${vc.history.length === 0 ? '#94a3b8' : '#0f172a'}; border: 1px solid #cbd5e1; border-radius: 8px; padding: 9px 10px; font-size: 0.82rem; font-weight: 800; cursor: ${vc.history.length === 0 ? 'not-allowed' : 'pointer'};">
              ↩️ Undo Move
            </button>
            <button type="button" onclick="window.requestVirtualHint()" ${isFinished || vc.aiThinking ? 'disabled' : ''} style="background: #fffbeb; color: ${isFinished ? '#94a3b8' : '#b45309'}; border: 1px solid #fde68a; border-radius: 8px; padding: 8px 10px; font-size: 0.8rem; font-weight: 800; cursor: ${isFinished ? 'not-allowed' : 'pointer'};">
              💡 Coach Hint
            </button>
            <button type="button" onclick="window.flipVirtualBoard()" style="background: #ffffff; color: #334155; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 10px; font-size: 0.8rem; font-weight: 800; cursor: pointer;">
              🔃 Flip Board
            </button>
          </div>

          <!-- Resign / Draw / Board Style Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; flex-wrap: wrap;">
            <button type="button" onclick="window.toggleVirtualBoardTheme()" style="background: transparent; border: 1px solid #cbd5e1; color: #475569; border-radius: 6px; padding: 4px 9px; font-size: 0.72rem; font-weight: 700; cursor: pointer;">
              🎨 ${vc.boardTheme === 'wood' ? 'Slate Board' : 'Wood Board'}
            </button>

            ${
              !isFinished && vc.moveLog.length > 0
                ? vc.confirmAction
                  ? `
                  <div style="display: inline-flex; align-items: center; gap: 5px;">
                    <span style="font-size: 0.72rem; font-weight: 800; color: #b91c1c;">${vc.confirmAction === 'resign' ? 'Resign?' : 'Agree Draw?'}</span>
                    <button type="button" onclick="window.confirmVirtualEndAction()" style="background: #dc2626; color: #ffffff; border: none; border-radius: 5px; padding: 3px 8px; font-size: 0.72rem; font-weight: 800; cursor: pointer;">Yes</button>
                    <button type="button" onclick="window.cancelVirtualEndAction()" style="background: #e2e8f0; color: #334155; border: none; border-radius: 5px; padding: 3px 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer;">No</button>
                  </div>
                `
                  : `
                  <div style="display: inline-flex; gap: 5px;">
                    ${
                      vc.mode === 'pass'
                        ? `<button type="button" onclick="window.promptVirtualEndAction('draw')" style="background: transparent; border: 1px solid #cbd5e1; color: #475569; border-radius: 6px; padding: 4px 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer;">🤝 Draw</button>`
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

          <!-- 5. Algebraic Move Sheet -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; padding: 0 4px;">
              <span style="font-size: 0.68rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Move History</span>
              <span style="font-size: 0.68rem; font-family: monospace; color: #94a3b8;">${vc.moveLog.length} ply</span>
            </div>
            <div id="vc-move-sheet" style="max-height: 155px; overflow-y: auto; display: flex; flex-direction: column; gap: 1px;">
              ${
                moveRowsHtml ||
                `<div style="font-size: 0.76rem; color: #94a3b8; text-align: center; padding: 14px 6px;">Moves will appear here (1. e4 e5...)</div>`
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
// 5. EVENT CONTROLLERS & CLOCK / AI ORCHESTRATION
// ============================================================================
let aiMoveTimeout = null;

export function registerVirtualChessHandlers(ctx) {
  if (typeof window === 'undefined') return;

  const getVc = () => {
    const st = ctx.getState();
    if (!st.virtualChess) st.virtualChess = createDefaultVirtualChessState();
    return st.virtualChess;
  };

  // Surgical in-place update of Virtual Chess workspace (zero page flash, zero scroll jump, zero header/tab teardown!)
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

  const evaluateGameEndPracticeXp = () => {
    const st = ctx.getState();
    const vc = getVc();
    if (vc.status === 'playing' || vc.xpEvaluated) return false;
    vc.xpEvaluated = true;

    if (vc.mode !== 'ai' || !vc.tappedInPlayerId) return false;
    const pupil = (st.players || []).find((p) => p.id === vc.tappedInPlayerId);
    if (!pupil) return false;

    const plies = vc.moveLog.length;
    const pupilWon = vc.winner === vc.humanSide;
    const isDraw = vc.winner === 'draw';

    let rawXp = 0;
    let outcome = 'effort';

    if (pupilWon && plies >= 6) {
      outcome = 'win';
      rawXp = vc.aiLevel === 'hard' ? 50 : vc.aiLevel === 'medium' ? 30 : 15;
    } else if (isDraw && plies >= 20) {
      outcome = 'draw';
      rawXp = vc.aiLevel === 'hard' ? 25 : vc.aiLevel === 'medium' ? 15 : 10;
    } else if (!pupilWon && !isDraw && plies >= 30) {
      outcome = 'effort';
      rawXp = vc.aiLevel === 'easy' ? 5 : 10;
    } else {
      return false;
    }

    let hintCapNote = '';
    if ((vc.hintsUsedCount || 0) > 2 && rawXp > 5) {
      rawXp = 5;
      hintCapNote = ' (Guided Hint Cap)';
    }

    const todayKey = new Date().toISOString().slice(0, 10);
    const ledger = readLocalXpLedger();
    const entry = ledger[pupil.id] || {
      localTotalXp: Number(pupil.practiceXp || 0),
      daily: {},
    };
    if (!entry.daily) entry.daily = {};
    const usedToday = Number(entry.daily[todayKey] || 0);
    if (usedToday >= DAILY_XP_CAP) {
      vc.lastXpNotice = {
        type: 'cap',
        text: `🌟 Daily XP Cap Reached (${DAILY_XP_CAP}/${DAILY_XP_CAP} XP today)! Great commitment — play freely for fun, and earn fresh XP tomorrow!`,
      };
      return false;
    }

    const grantedXp = Math.min(rawXp, DAILY_XP_CAP - usedToday);
    const baseTotal = Math.max(Number(pupil.practiceXp || 0), Number(entry.localTotalXp || 0));
    entry.localTotalXp = baseTotal + grantedXp;
    entry.daily[todayKey] = usedToday + grantedXp;
    ledger[pupil.id] = entry;
    writeLocalXpLedger(ledger);
    vc.xpGrantedThisGame = true;

    const claimPayload = {
      claimId: `xp_${pupil.id}_${Date.now()}`,
      playerId: pupil.id,
      callsign: pupil.name,
      house: pupil.house,
      xp: grantedXp,
      level: vc.aiLevel,
      outcome,
      moves: plies,
    };

    const hName = HOUSES[pupil.house]?.name || pupil.house;
    if (typeof ctx.onPracticeXpEarned === 'function') {
      const res = ctx.onPracticeXpEarned(claimPayload);
      if (res && res.directTeacherBanked) {
        const bonusTxt =
          res.housePtsAwarded > 0
            ? ` · 🏆 +${res.housePtsAwarded} ${hName} House Point Unlocked!`
            : '';
        vc.lastXpNotice = {
          type: 'earned',
          text: `⚡ +${grantedXp} XP banked for ${pupil.name}${hintCapNote}!${bonusTxt}`,
        };
        return res.housePtsAwarded > 0;
      }
      vc.lastXpNotice = {
        type: 'earned',
        text: `⚡ +${grantedXp} XP earned by ${pupil.name}${hintCapNote}! Sent to Teacher Inbox toward ${hName} House Points.`,
      };
    }
    return false;
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
      const chosen = chooseBestMove(currentVc, currentVc.aiLevel);
      currentVc.aiThinking = false;
      let unlockedHousePt = false;
      if (chosen) {
        applyVirtualChessMove(currentVc, chosen, false);
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
      if (!vc || vc.status !== 'playing' || !vc.clockActive || vc.timeControlMins <= 0) return;

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
          const unlocked = evaluateGameEndPracticeXp();
          if (unlocked) ctx.renderChessHubView();
          else rerenderBoardOnly();
        }
      }
    }, 1000);
  }

  const attemptHumanMove = (fromR, fromC, toR, toC) => {
    const vc = getVc();
    if (vc.status !== 'playing' || vc.aiThinking) return false;
    if (vc.mode === 'ai' && vc.turn !== vc.humanSide) return false;

    const legal = getLegalMovesFrom(vc, fromR, fromC).filter(
      (m) => m.toR === toR && m.toC === toC,
    );
    if (legal.length === 0) return false;

    if (legal.some((m) => m.promotion)) {
      vc.pendingPromotion = { fromR, fromC, toR, toC };
      vc.selected = null;
      rerenderBoardOnly();
      return true;
    }

    applyVirtualChessMove(vc, legal[0], false);
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

  window.handleVirtualSquareTap = function (r, c) {
    const vc = getVc();
    if (vc.status !== 'playing' || vc.aiThinking || vc.pendingPromotion) return;
    if (vc.mode === 'ai' && vc.turn !== vc.humanSide) return;

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
    if (vc.status !== 'playing' || vc.aiThinking) return;
    if (sideOf(vc.board[r][c]) !== vc.turn) return;
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
    } catch (err) {}
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

  window.startNewVirtualGame = function () {
    if (aiMoveTimeout) clearTimeout(aiMoveTimeout);
    const prev = getVc();
    const fresh = createDefaultVirtualChessState();
    fresh.mode = prev.mode;
    fresh.aiLevel = prev.aiLevel;
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
    vc.mode = mode;
    window.startNewVirtualGame();
  };

  window.setVirtualAiLevel = function (level) {
    const vc = getVc();
    vc.aiLevel = level;
    if (vc.moveLog.length === 0) {
      window.startNewVirtualGame();
    } else {
      rerenderBoardOnly();
      ctx.showChessToast(`Computer Coach set to ${level.toUpperCase()}`, 'info');
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
    if (vc.history.length === 0) return;

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

    // In AI mode, undo both the AI reply and the pupil's previous move so it's the pupil's turn again
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
      if (p) ctx.showChessToast(`👤 Tapped in as ${p.name}! Beat the Computer Coach to earn XP.`, 'success');
    }
  };

  window.requestVirtualHint = function () {
    const vc = getVc();
    if (vc.status !== 'playing' || vc.aiThinking) return;
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

  window.confirmVirtualEndAction = function () {
    const vc = getVc();
    if (vc.confirmAction === 'resign') {
      vc.status = 'resigned';
      vc.winner = vc.turn === 'w' ? 'b' : 'w';
      vc.clockActive = false;
      playClubSound('win');
    } else if (vc.confirmAction === 'draw') {
      vc.status = 'draw_agreed';
      vc.winner = 'draw';
      vc.clockActive = false;
      playClubSound('bounty');
    }
    vc.confirmAction = null;
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
      opening: 'App Virtual Chess',
    });

    vc.loggedToLadder = true;
    ctx.saveChessState();
    ctx.renderChessHubView();
    const hW = HOUSES[p1.house]?.name || p1.house;
    const hB = HOUSES[p2.house]?.name || p2.house;
    ctx.showChessToast(`🏆 Logged ${p1.name} (${hW}) ${resultStr} ${p2.name} (${hB}) to Club Ladder!`, 'success');
  };
}
