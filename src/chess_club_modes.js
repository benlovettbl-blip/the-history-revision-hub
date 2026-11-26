/**
 * The History Portal Chess Club — 7 Interactive Classroom & Touch-TV Game Modes
 * Built for zero-prep teacher ease and giant smartboard pupil touch controls.
 */

import { HOUSES, SCORING_RULES, BETH_HARMON_PUZZLES, BEGINNER_ROOKIE_PUZZLES } from './chess_data.js';

// ============================================================================
// SOUND EFFECTS (Pure Web Audio API — Zero External Assets Required)
// ============================================================================
export function playClubSound(kind = 'tap') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const tone = (freq, start, dur, type = 'triangle', vol = 0.22) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.04);
    };

    if (kind === 'tick') {
      tone(520, 0, 0.05, 'sine', 0.12);
    } else if (kind === 'win' || kind === 'bounty') {
      tone(523.25, 0, 0.16, 'triangle', 0.25);
      tone(659.25, 0.12, 0.16, 'triangle', 0.25);
      tone(783.99, 0.24, 0.18, 'triangle', 0.26);
      tone(1046.5, 0.38, 0.45, 'triangle', 0.3);
    } else if (kind === 'gong') {
      // Dramatic Chair-Swap Siren + Brass Gong!
      tone(220, 0, 0.9, 'sawtooth', 0.28);
      tone(440, 0, 0.7, 'triangle', 0.25);
      tone(880, 0.25, 0.35, 'square', 0.18);
      tone(660, 0.55, 0.35, 'square', 0.18);
      tone(880, 0.85, 0.55, 'triangle', 0.28);
    } else if (kind === 'wrong') {
      tone(240, 0, 0.18, 'sawtooth', 0.2);
      tone(180, 0.15, 0.28, 'sawtooth', 0.2);
    } else if (kind === 'move') {
      tone(600, 0, 0.06, 'sine', 0.15);
    }
  } catch (e) {}
}

// ============================================================================
// 1. CHAOS WHEEL DEFINITIONS
// ============================================================================
export const CHAOS_WHEEL_TWISTS = [
  {
    id: 'chair_swap',
    icon: '🔄',
    title: 'THE CHAIR-SWAP GONG!',
    badge: 'Pupil Favourite',
    color: '#dc2626',
    pupilRule:
      'Play normal chess — BUT when the secret TV Siren rings (between 2 and 4 minutes), BOTH players must jump up, SWAP CHAIRS, and finish the game playing with their opponent’s pieces!',
    tip: 'Tip: Don’t make your position TOO strong early on, or you might have to play against it!',
    hasSecretGong: true,
  },
  {
    id: 'king_of_hill',
    icon: '⛰️',
    title: 'KING OF THE HILL!',
    badge: 'Fast & Aggressive',
    color: '#0284c7',
    pupilRule:
      'Normal checkmate still wins — PLUS if you march your King safely onto ANY of the 4 very middle squares of the board (d4, e4, d5, or e5) without being in check, you WIN ON THE SPOT!',
    tip: 'Tip: Guard the 4 centre squares like your life depends on it!',
  },
  {
    id: 'no_queens',
    icon: '🚫',
    title: 'NO-QUEEN BRAWL!',
    badge: 'Equaliser',
    color: '#7c3aed',
    pupilRule:
      'Before Move 1, BOTH players take their Queens off the board and put them in the box! Fight it out using pure Knights, Bishops, Rooks, and Pawns!',
    tip: 'Tip: No early Queen traps today — develop your Knights and Rooks fast!',
  },
  {
    id: 'david_goliath',
    icon: '⚖️',
    title: 'DAVID vs GOLIATH ODDS!',
    badge: 'Fair Handicap',
    color: '#d97706',
    pupilRule:
      'Check your Ladder Rank! If one player is 3+ rungs higher on the Ladder, they take 1 ROOK off the board before Move 1 (if 1–2 rungs higher, take 1 KNIGHT off)!',
    tip: 'Tip: Underdogs — trade pieces down! Favourites — attack with everything left!',
  },
  {
    id: 'knightmare',
    icon: '🐴',
    title: 'CAVALRY STAMPEDE!',
    badge: 'Double Bonus',
    color: '#059669',
    pupilRule:
      'Normal rules, EXCEPT Knights are royal heroes today: if you deliver Checkmate with a Knight (or capture the enemy Queen with a Knight), your House wins DOUBLE POINTS!',
    tip: 'Tip: Keep your jumping Knights alive — nobody sees the L-shape coming!',
  },
  {
    id: 'vip_pawn',
    icon: '🛡️',
    title: 'PROTECT THE VIP PAWN!',
    badge: 'Bodyguard Mode',
    color: '#be185d',
    pupilRule:
      'Before Move 1, point to your middle King-pawn (e2 for White, e7 for Black). That pawn is your VIP! If your VIP pawn gets captured at ANY point, you LOSE IMMEDIATELY! (Normal checkmate also wins.)',
    tip: 'Tip: Surround your VIP pawn with bodyguards before attacking!',
  },
  {
    id: 'traitor_pawn',
    icon: '🕵️',
    title: 'ONE TRAITOR PAWN!',
    badge: 'Mind Games',
    color: '#4338ca',
    pupilRule:
      'ONCE during the whole game, instead of moving your own piece, you may shout "TRAITOR!" and push ONE of your opponent’s pawns 1 empty square forward (cannot capture or expose their King to check)!',
    tip: 'Tip: Save your Traitor call for the perfect moment to block their Bishop or open their King!',
  },
  {
    id: 'blitz_count',
    icon: '⚡',
    title: '5-MINUTE PIECE COUNTDOWN!',
    badge: 'Speed Round',
    color: '#b45309',
    pupilRule:
      '5 minutes on the TV clock! Checkmate wins immediately — if the bell rings first, Hands Off Pieces and add up your surviving army (Queen=9, Rook=5, Bishop=3, Knight=3, Pawn=1). Highest score wins!',
    tip: 'Tip: Grab every free pawn and protect your heavy pieces!',
  },
];

// ============================================================================
// 2. BOUNTY BOARD CHALLENGES
// ============================================================================
export const CLUB_BOUNTIES = [
  {
    id: 'b_pawn_mate',
    icon: '♟️',
    title: 'Humble Pawn Checkmate',
    desc: 'Deliver the final checkmate move using a 1-point Pawn!',
    pts: 4,
    color: '#dc2626',
  },
  {
    id: 'b_knight_fork',
    icon: '🐴',
    title: 'Royal Knight Fork',
    desc: 'Attack your opponent’s King AND Queen at the exact same time with a Knight!',
    pts: 3,
    color: '#7c3aed',
  },
  {
    id: 'b_giant_slayer',
    icon: '🗡️',
    title: 'Giant Slayer',
    desc: 'Win a game against someone ranked 3 or more places higher than you!',
    pts: 4,
    color: '#d97706',
  },
  {
    id: 'b_castle_win',
    icon: '🏰',
    title: 'Fortress Commander',
    desc: 'Castle your King in your first 7 moves AND go on to win the game!',
    pts: 2,
    color: '#0284c7',
  },
  {
    id: 'b_twin_towers',
    icon: '♖',
    title: 'Twin Towers Survivor',
    desc: 'Win by checkmate with BOTH of your Rooks still alive on the board!',
    pts: 2,
    color: '#059669',
  },
  {
    id: 'b_double_queen',
    icon: '👑',
    title: 'Double Queen Coronation',
    desc: 'March a Pawn to the far side to make a 2nd Queen while your 1st Queen is alive!',
    pts: 3,
    color: '#db2777',
  },
  {
    id: 'b_coach_buddy',
    icon: '🤝',
    title: 'Grandmaster Coach',
    desc: 'Teach a newer club member a chess trick or play a friendly coaching game together!',
    pts: 3,
    color: '#0d9488',
  },
  {
    id: 'b_center_mate',
    icon: '🎯',
    title: 'Middle-of-the-Board Mate',
    desc: 'Checkmate the enemy King while it is standing in the middle 4 ranks (ranks 3–6)!',
    pts: 3,
    color: '#4f46e5',
  },
];

// ============================================================================
// 3. PUZZLE STORM — FAST 1-MOVE TACTICAL DECK (20 Instant Touch-TV Positions)
// ============================================================================
export const PUZZLE_STORM_DECK = [
  {
    id: 'ps_1',
    prompt: 'WHITE TO MOVE: Checkmate in 1! (Back-Rank Slam)',
    side: 'w',
    board: [
      ['.', '.', '.', '.', '.', 'p', 'k', 'p'],
      ['.', '.', '.', '.', '.', 'p', 'p', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['P', 'P', 'P', '.', '.', 'P', 'P', 'P'],
      ['.', '.', '.', 'R', '.', '.', 'K', '.'],
    ],
    // Wait: g8 king has f7,g7,h8 — let's make pure airtight back-rank mate: King on g8, pawns on f7, g7, h7!
    overrideBoard: [
      ['.', '.', '.', '.', '.', '.', 'k', '.'],
      ['.', '.', '.', '.', '.', 'p', 'p', 'p'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['P', 'P', '.', '.', '.', 'P', 'P', 'P'],
      ['.', '.', '.', 'R', '.', '.', 'K', '.'],
    ],
    from: [7, 3],
    to: [[0, 3]],
    tag: 'Back-Rank Mate',
  },
  {
    id: 'ps_2',
    prompt: 'WHITE TO MOVE: Checkmate in 1! (Queen Kiss of Death)',
    side: 'w',
    overrideBoard: [
      ['r', '.', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', '.', 'p', 'p', 'p'],
      ['.', '.', 'n', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', 'p', '.', '.', 'Q'],
      ['.', '.', 'B', '.', 'P', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['P', 'P', 'P', 'P', '.', 'P', 'P', 'P'],
      ['R', 'N', 'B', '.', 'K', '.', 'N', 'R'],
    ],
    from: [3, 7],
    to: [[1, 5]],
    tag: 'Scholar’s Mate',
  },
  {
    id: 'ps_3',
    prompt: 'WHITE TO MOVE: Lawn-Mower Checkmate in 1!',
    side: 'w',
    overrideBoard: [
      ['.', '.', '.', '.', 'k', '.', '.', '.'],
      ['R', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', 'R', '.', '.', 'K', '.', '.', '.'],
    ],
    from: [7, 1],
    to: [[0, 1]],
    tag: 'Ladder Mate',
  },
  {
    id: 'ps_4',
    prompt: 'WHITE TO MOVE: Royal Knight Fork! (Attack King & Queen!)',
    side: 'w',
    overrideBoard: [
      ['.', '.', '.', '.', 'k', '.', '.', '.'],
      ['.', '.', 'q', '.', '.', 'p', 'p', 'p'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', 'N', '.', '.', '.', '.', '.'],
      ['P', 'P', 'P', '.', '.', 'P', 'P', 'P'],
      ['.', '.', '.', '.', 'K', '.', '.', '.'],
    ],
    from: [5, 2],
    to: [[3, 3]],
    tag: 'Knight Fork',
  },
  {
    id: 'ps_5',
    prompt: 'WHITE TO MOVE: Snatch the Undefended Black Queen!',
    side: 'w',
    overrideBoard: [
      ['r', '.', 'b', '.', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', '.', 'p', 'p', 'p'],
      ['.', '.', 'n', '.', '.', '.', '.', '.'],
      ['.', '.', '.', 'q', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', 'N', '.', '.', '.', '.', '.'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', '.', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ],
    from: [5, 2],
    to: [[3, 3]],
    tag: 'Free Queen!',
  },
  {
    id: 'ps_6',
    prompt: 'WHITE TO MOVE: Checkmate in 1 on g7! (Queen + Pawn Helper)',
    side: 'w',
    overrideBoard: [
      ['r', '.', '.', '.', '.', 'r', 'k', '.'],
      ['p', 'p', 'p', '.', '.', 'p', '.', 'p'],
      ['.', '.', '.', 'p', '.', 'P', '.', 'Q'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['P', 'P', 'P', '.', '.', '.', 'P', 'P'],
      ['.', '.', '.', '.', 'R', '.', 'K', '.'],
    ],
    from: [2, 7],
    to: [[1, 6]],
    tag: 'Lolli’s Mate',
  },
  {
    id: 'ps_7',
    prompt: 'WHITE TO MOVE: Crown Your Pawn to Deliver Check!',
    side: 'w',
    overrideBoard: [
      ['.', '.', '.', '.', '.', '.', 'k', '.'],
      ['.', 'P', '.', '.', '.', 'p', 'p', 'p'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', 'P', 'P', 'P'],
      ['.', '.', '.', '.', '.', '.', 'K', '.'],
    ],
    from: [1, 1],
    to: [[0, 1]],
    tag: 'Coronation Mate!',
  },
  {
    id: 'ps_8',
    prompt: 'WHITE TO MOVE: Smothered Knight Checkmate in the Corner!',
    side: 'w',
    overrideBoard: [
      ['.', '.', '.', '.', '.', '.', 'r', 'k'],
      ['.', '.', '.', '.', '.', '.', 'p', 'p'],
      ['.', '.', '.', '.', '.', 'N', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['P', 'P', '.', '.', '.', 'P', 'P', 'P'],
      ['.', '.', '.', '.', '.', '.', 'K', '.'],
    ],
    // Wait: f6 knight to f7? f6 is [2,5]; f7 is [1,5] (attacks h8!); wait from e5 [3,4] -> f7 [1,5]# ! Let's put White Knight on g5 [3,6] -> f7 [1,5]#!
    from: [2, 5],
    to: [[1, 5]],
    // Wait: Knight on f6 [2,5] CANNOT jump to f7 [1,5]! Let's put Knight on g5 [3,6]!
    fixKnight: true,
    tag: 'Smothered Mate!',
  },
  {
    id: 'ps_9',
    prompt: 'WHITE TO MOVE: Arabian Checkmate in 1! (Rook + Knight)',
    side: 'w',
    overrideBoard: [
      ['.', '.', '.', '.', '.', '.', '.', 'k'],
      ['.', 'R', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', 'N', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', 'P', 'P', 'P'],
      ['.', '.', '.', '.', '.', '.', 'K', '.'],
    ],
    from: [1, 1],
    to: [[1, 7]],
    tag: 'Arabian Mate',
  },
  {
    id: 'ps_10',
    prompt: 'WHITE TO MOVE: Bishop Laser Skewer! Attack King & Win Queen!',
    side: 'w',
    overrideBoard: [
      ['.', '.', '.', '.', '.', '.', 'k', '.'],
      ['.', '.', '.', '.', '.', 'q', '.', 'p'],
      ['.', '.', '.', '.', '.', '.', 'p', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', 'B', '.', '.', '.', '.', '.', '.'],
      ['P', 'P', 'P', '.', '.', 'P', 'P', 'P'],
      ['.', '.', '.', '.', '.', '.', 'K', '.'],
    ],
    // Wait: g8 [0,6], f7 [1,5] -> c4 [4,2] attacks f7+g8 (that's a pin if f7 is in front, or put King on e6 [2,4] and Queen on g8 [0,6], Bishop on b3 [5,1] -> c4 [4,2]+ skewers King on e6 & Queen on g8!)
    skewerFix: true,
    from: [5, 1],
    to: [[4, 2]],
    tag: 'Laser Skewer',
  },
  {
    id: 'ps_11',
    prompt: 'BLACK TO MOVE: Back-Rank Checkmate in 1!',
    side: 'b',
    overrideBoard: [
      ['.', '.', '.', 'r', '.', '.', 'k', '.'],
      ['p', 'p', 'p', '.', '.', 'p', 'p', 'p'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['P', 'P', 'P', '.', '.', 'P', 'P', 'P'],
      ['.', '.', '.', '.', '.', '.', 'K', '.'],
    ],
    from: [0, 3],
    to: [[7, 3]],
    tag: 'Back-Rank Mate',
  },
  {
    id: 'ps_12',
    prompt: 'WHITE TO MOVE: Queen + Bishop Checkmate on b7!',
    side: 'w',
    overrideBoard: [
      ['.', 'k', 'r', '.', '.', '.', '.', '.'],
      ['p', 'p', 'p', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', 'Q', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', 'B', '.', '.'],
      ['P', 'P', 'P', '.', '.', 'P', 'P', 'P'],
      ['.', '.', '.', '.', '.', '.', 'K', '.'],
    ],
    from: [4, 1],
    to: [[1, 1]],
    tag: 'Battery Mate',
  },
  {
    id: 'ps_13',
    prompt: 'WHITE TO MOVE: Fork Both Black Rooks with Your Knight!',
    side: 'w',
    overrideBoard: [
      ['.', '.', 'r', '.', '.', '.', 'k', '.'],
      ['p', 'p', '.', '.', 'r', 'p', 'p', 'p'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', 'N', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['P', 'P', 'P', '.', '.', 'P', 'P', 'P'],
      ['.', '.', '.', '.', '.', '.', 'K', '.'],
    ],
    // Knight on e5 [3,4] -> d7 [1,3]? Wait d7 [1,3] attacks c5,b6,b8,f8,f6,e5. What square forks c8 [0,2] and e7 [1,4]? No, c8 [0,2] and f7 [1,5] are forked by d6 [2,3]! Let's put Black Rooks on c8 [0,2] and f7 [1,5], White Knight on e4 [4,4] -> d6 [2,3]!
    forkRooksFix: true,
    from: [4, 4],
    to: [[2, 3]],
    tag: 'Double Rook Fork',
  },
  {
    id: 'ps_14',
    prompt: 'WHITE TO MOVE: Epaulette Checkmate in 1! (King Boxed In by Own Rooks)',
    side: 'w',
    overrideBoard: [
      ['.', '.', '.', 'r', 'k', 'r', '.', '.'],
      ['p', 'p', '.', '.', '.', '.', 'p', 'p'],
      ['.', '.', '.', '.', 'Q', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['P', 'P', 'P', '.', '.', 'P', 'P', 'P'],
      ['.', '.', '.', '.', 'R', '.', 'K', '.'],
    ],
    // Queen on d5 [3,3] -> e6 [2,4]# (guarded by Re1 [7,4], King on e8 [0,4] blocked by d8/f8 rooks, e7 empty so King could go d7/f7 unless Queen is on e6 [2,4]! Wait: Queen on e6 [2,4] attacks d7, e7, f7, e8!! YES! e6 [2,4] attacks e8, d7, e7, f7, and d8/f8 have Black Rooks! Pure Epaulette Mate!)
    epauletteFix: true,
    from: [3, 3],
    to: [[2, 4]],
    tag: 'Epaulette Mate',
  },
].map((p) => {
  const b = JSON.parse(JSON.stringify(p.overrideBoard || p.board));
  if (p.fixKnight) {
    b[2][5] = '.';
    b[3][6] = 'N'; // g5 -> f7#
    p.from = [3, 6];
    p.to = [[1, 5]];
  }
  if (p.skewerFix) {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) b[r][c] = '.';
    b[0][6] = 'q'; // g8
    b[2][4] = 'k'; // e6
    b[5][1] = 'B'; // b3 -> c4+ skewers Ke6 & Qg8!
    b[6][2] = 'P'; // c2 guards b3
    b[7][7] = 'K'; // h1 (off the g-file!)
  }
  if (p.forkRooksFix) {
    b[0][2] = 'r'; // c8
    b[1][4] = '.';
    b[1][5] = 'r'; // f7
    b[3][4] = '.';
    b[4][4] = 'N'; // e4 -> d6 forks Rc8 and Rf7!
  }
  if (p.epauletteFix) {
    b[2][4] = '.';
    b[3][3] = 'Q'; // Qd5 -> Qe6#
  }
  return { ...p, board: b };
});

// ============================================================================
// 4. COMPLETE LEGAL CHESS ENGINE FOR TOUCH-TV 5-SECOND RELAY BULLET
// ============================================================================
// Use SOLID filled Unicode chess glyphs for BOTH sides so White pieces (#fff fill + dark outline)
// never fade into cream squares on Windows Segoe UI Symbol!
const PIECE_UNICODE = {
  K: '♚',
  Q: '♛',
  R: '♜',
  B: '♝',
  N: '♞',
  P: '♟',
  k: '♚',
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
  '.': '',
};

const PIECE_POINTS = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

export function createInitialRelayGame(whiteHouse = 'victory', blackHouse = 'warrior', shotLimit = 8) {
  return {
    board: [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ],
    turn: 'w',
    castling: { K: true, Q: true, k: true, q: true },
    enPassant: null, // [r, c]
    selected: null, // [r, c]
    lastMove: null, // { from: [r,c], to: [r,c] }
    history: [],
    status: 'ready', // 'ready' | 'playing' | 'paused' | 'checkmate' | 'stalemate' | 'awarded'
    winnerSide: null, // 'w' | 'b' | 'draw'
    whiteHouse,
    blackHouse,
    shotLimit, // 5, 8, 10, or 0 (untimed)
    shotRemaining: shotLimit,
    moveCount: 0,
    bannerMsg: 'Line up in two queues in front of the TV! Tap ▶ START RELAY when ready!',
  };
}

function isWhiteCode(ch) {
  return ch >= 'A' && ch <= 'Z';
}
function isBlackCode(ch) {
  return ch >= 'a' && ch <= 'z';
}
function sideOfPiece(ch) {
  if (!ch || ch === '.') return null;
  return isWhiteCode(ch) ? 'w' : 'b';
}
function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function cloneBoard(b) {
  return b.map((row) => [...row]);
}

function findKing(board, side) {
  const target = side === 'w' ? 'K' : 'k';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === target) return [r, c];
    }
  }
  return null;
}

export function isSquareAttacked(board, targetR, targetC, bySide) {
  // Pawn attacks
  const pawnRow = bySide === 'w' ? targetR + 1 : targetR - 1;
  const pawnChar = bySide === 'w' ? 'P' : 'p';
  if (inBounds(pawnRow, targetC - 1) && board[pawnRow][targetC - 1] === pawnChar) return true;
  if (inBounds(pawnRow, targetC + 1) && board[pawnRow][targetC + 1] === pawnChar) return true;

  // Knight attacks
  const knightChar = bySide === 'w' ? 'N' : 'n';
  const kJumps = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1],
  ];
  for (const [dr, dc] of kJumps) {
    const nr = targetR + dr;
    const nc = targetC + dc;
    if (inBounds(nr, nc) && board[nr][nc] === knightChar) return true;
  }

  // King attacks
  const kingChar = bySide === 'w' ? 'K' : 'k';
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = targetR + dr;
      const nc = targetC + dc;
      if (inBounds(nr, nc) && board[nr][nc] === kingChar) return true;
    }
  }

  // Orthogonal sliders (Rook / Queen)
  const rookChar = bySide === 'w' ? 'R' : 'r';
  const queenChar = bySide === 'w' ? 'Q' : 'q';
  const orthoDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dr, dc] of orthoDirs) {
    let nr = targetR + dr;
    let nc = targetC + dc;
    while (inBounds(nr, nc)) {
      const p = board[nr][nc];
      if (p !== '.') {
        if (p === rookChar || p === queenChar) return true;
        break;
      }
      nr += dr;
      nc += dc;
    }
  }

  // Diagonal sliders (Bishop / Queen)
  const bishopChar = bySide === 'w' ? 'B' : 'b';
  const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  for (const [dr, dc] of diagDirs) {
    let nr = targetR + dr;
    let nc = targetC + dc;
    while (inBounds(nr, nc)) {
      const p = board[nr][nc];
      if (p !== '.') {
        if (p === bishopChar || p === queenChar) return true;
        break;
      }
      nr += dr;
      nc += dc;
    }
  }

  return false;
}

export function isKingInCheck(board, side) {
  const kp = findKing(board, side);
  if (!kp) return false;
  return isSquareAttacked(board, kp[0], kp[1], side === 'w' ? 'b' : 'w');
}

function applyRawMoveOnClone(board, move) {
  const nb = cloneBoard(board);
  const piece = nb[move.fromR][move.fromC];
  nb[move.fromR][move.fromC] = '.';

  if (move.isEnPassant) {
    nb[move.fromR][move.toC] = '.';
  }
  if (move.castleRookFrom && move.castleRookTo) {
    const rPiece = nb[move.castleRookFrom[0]][move.castleRookFrom[1]];
    nb[move.castleRookFrom[0]][move.castleRookFrom[1]] = '.';
    nb[move.castleRookTo[0]][move.castleRookTo[1]] = rPiece;
  }

  let placed = piece;
  if (piece === 'P' && move.toR === 0) placed = 'Q';
  if (piece === 'p' && move.toR === 7) placed = 'q';
  nb[move.toR][move.toC] = placed;
  return nb;
}

export function getLegalMovesForSquare(game, r, c) {
  const board = game.board;
  const piece = board[r][c];
  const side = sideOfPiece(piece);
  if (!side || side !== game.turn) return [];

  const enemy = side === 'w' ? 'b' : 'w';
  const pseudo = [];
  const lower = piece.toLowerCase();

  if (lower === 'p') {
    const dir = side === 'w' ? -1 : 1;
    const startRank = side === 'w' ? 6 : 1;
    const oneR = r + dir;
    if (inBounds(oneR, c) && board[oneR][c] === '.') {
      pseudo.push({ fromR: r, fromC: c, toR: oneR, toC: c });
      const twoR = r + dir * 2;
      if (r === startRank && board[twoR][c] === '.') {
        pseudo.push({ fromR: r, fromC: c, toR: twoR, toC: c, doublePush: true });
      }
    }
    for (const dc of [-1, 1]) {
      const nc = c + dc;
      if (!inBounds(oneR, nc)) continue;
      if (sideOfPiece(board[oneR][nc]) === enemy) {
        pseudo.push({ fromR: r, fromC: c, toR: oneR, toC: nc });
      } else if (
        game.enPassant &&
        game.enPassant[0] === oneR &&
        game.enPassant[1] === nc
      ) {
        pseudo.push({ fromR: r, fromC: c, toR: oneR, toC: nc, isEnPassant: true });
      }
    }
  } else if (lower === 'n') {
    const jumps = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1],
    ];
    for (const [dr, dc] of jumps) {
      const nr = r + dr;
      const nc = c + dc;
      if (inBounds(nr, nc) && sideOfPiece(board[nr][nc]) !== side) {
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
        const occ = sideOfPiece(board[nr][nc]);
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
        if (inBounds(nr, nc) && sideOfPiece(board[nr][nc]) !== side) {
          pseudo.push({ fromR: r, fromC: c, toR: nr, toC: nc });
        }
      }
    }
    // Castling
    if (!isKingInCheck(board, side)) {
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
          !isSquareAttacked(board, homeR, 5, enemy) &&
          !isSquareAttacked(board, homeR, 6, enemy)
        ) {
          pseudo.push({
            fromR: homeR,
            fromC: 4,
            toR: homeR,
            toC: 6,
            castleRookFrom: [homeR, 7],
            castleRookTo: [homeR, 5],
          });
        }
        if (
          canQS &&
          board[homeR][3] === '.' &&
          board[homeR][2] === '.' &&
          board[homeR][1] === '.' &&
          board[homeR][0] === rookCh &&
          !isSquareAttacked(board, homeR, 3, enemy) &&
          !isSquareAttacked(board, homeR, 2, enemy)
        ) {
          pseudo.push({
            fromR: homeR,
            fromC: 4,
            toR: homeR,
            toC: 2,
            castleRookFrom: [homeR, 0],
            castleRookTo: [homeR, 3],
          });
        }
      }
    }
  }

  return pseudo.filter((mv) => {
    const after = applyRawMoveOnClone(board, mv);
    return !isKingInCheck(after, side);
  });
}

export function getAllLegalMoves(game) {
  const all = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (sideOfPiece(game.board[r][c]) === game.turn) {
        all.push(...getLegalMovesForSquare(game, r, c));
      }
    }
  }
  return all;
}

export function executeRelayMove(game, move, isPanicAutoMove = false) {
  // Snapshot for instant 1-tap Takeback on the Relay Board
  game.history.push(
    JSON.parse(
      JSON.stringify({
        board: game.board,
        turn: game.turn,
        castling: game.castling,
        enPassant: game.enPassant,
        lastMove: game.lastMove,
        moveCount: game.moveCount,
        status: game.status,
        winnerSide: game.winnerSide,
      }),
    ),
  );
  if (game.history.length > 30) game.history.shift();

  const movingPiece = game.board[move.fromR][move.fromC];
  const captured = move.isEnPassant ? (game.turn === 'w' ? 'p' : 'P') : game.board[move.toR][move.toC];

  // Update castling rights
  if (movingPiece === 'K') {
    game.castling.K = false;
    game.castling.Q = false;
  } else if (movingPiece === 'k') {
    game.castling.k = false;
    game.castling.q = false;
  }
  if ((move.fromR === 7 && move.fromC === 0) || (move.toR === 7 && move.toC === 0)) game.castling.Q = false;
  if ((move.fromR === 7 && move.fromC === 7) || (move.toR === 7 && move.toC === 7)) game.castling.K = false;
  if ((move.fromR === 0 && move.fromC === 0) || (move.toR === 0 && move.toC === 0)) game.castling.q = false;
  if ((move.fromR === 0 && move.fromC === 7) || (move.toR === 0 && move.toC === 7)) game.castling.k = false;

  game.board = applyRawMoveOnClone(game.board, move);
  game.enPassant = move.doublePush
    ? [Math.floor((move.fromR + move.toR) / 2), move.fromC]
    : null;
  game.lastMove = { from: [move.fromR, move.fromC], to: [move.toR, move.toC] };
  game.selected = null;
  game.moveCount = (game.moveCount || 0) + 1;
  game.turn = game.turn === 'w' ? 'b' : 'w';
  game.shotRemaining = game.shotLimit || 0;

  const sqFrom = `${String.fromCharCode(97 + move.fromC)}${8 - move.fromR}`;
  const sqTo = `${String.fromCharCode(97 + move.toC)}${8 - move.toR}`;

  const nextLegal = getAllLegalMoves(game);
  const inCheck = isKingInCheck(game.board, game.turn);

  if (nextLegal.length === 0) {
    if (inCheck) {
      game.status = 'checkmate';
      game.winnerSide = game.turn === 'w' ? 'b' : 'w';
      const wHouseId = game.winnerSide === 'w' ? game.whiteHouse : game.blackHouse;
      const wHouseName = HOUSES[wHouseId]?.name || wHouseId;
      game.bannerMsg = `🏆 CHECKMATE!! ${wHouseName.toUpperCase()} WINS THE RELAY! Tap "Award +5 House Points" below!`;
      playClubSound('win');
    } else {
      game.status = 'stalemate';
      game.winnerSide = 'draw';
      game.bannerMsg = `🤝 STALEMATE DRAW! Tap "Award +2 House Points Each" below!`;
      playClubSound('win');
    }
    return;
  }

  if (isPanicAutoMove) {
    game.bannerMsg = `⏰ SHOT CLOCK BUZZER! Auto-played ${sqFrom}→${sqTo}! NEXT PUPIL IN LINE (${game.turn === 'w' ? 'WHITE ♔' : 'BLACK ♚'}) — GO!`;
    playClubSound('wrong');
  } else if (inCheck) {
    game.bannerMsg = `🚨 CHECK!! (${sqFrom}→${sqTo}) — NEXT PUPIL FOR ${game.turn === 'w' ? 'WHITE ♔' : 'BLACK ♚'}, SAVE YOUR KING!`;
    playClubSound('bounty');
  } else {
    const capTxt = captured && captured !== '.' ? ' (Captured!)' : '';
    game.bannerMsg = `✓ Played ${sqFrom}→${sqTo}${capTxt}! RUN TO BACK OF LINE — ${game.turn === 'w' ? 'WHITE ♔' : 'BLACK ♚'} UP NEXT!`;
    playClubSound('move');
  }
}

export function computeMaterialScore(board) {
  let w = 0;
  let b = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const ch = board[r][c];
      if (ch === '.') continue;
      const val = PIECE_POINTS[ch.toLowerCase()] || 0;
      if (isWhiteCode(ch)) w += val;
      else b += val;
    }
  }
  return { w, b };
}

// ============================================================================
// 5. DEFAULT CLUB MODES STATE FACTORY
// ============================================================================
export function createDefaultClubModesState() {
  return {
    activeMode: 'hub', // 'hub' | 'chaos' | 'bughouse' | 'throne' | 'civilwar' | 'relay' | 'storm' | 'bounties'
    tvFullscreen: false,

    // 1. Chaos Wheel
    chaosSelectedId: 'chair_swap',
    chaosSpinning: false,
    gongArmed: false,
    gongFireAt: 0,
    gongFiredBanner: false,

    // 2. 2v2 Bughouse
    bughouseMatches: [],
    bughouseExtraSingles: [],

    // 3. Hold the Throne
    throneMonarchId: '',
    throneStreak: 0,
    throneQueueIds: [],
    throneHistory: [],

    // 4. House Civil War (Tug of War)
    civilWarTeamA: ['victory', 'dreadnought'], // Fleet Alliance
    civilWarTeamB: ['warrior', 'invincible'], // Iron Alliance
    civilWarScoreA: 0,
    civilWarScoreB: 0,
    civilWarBoards: [],

    // 5. 5-Second Touch-TV Relay Chess
    relayGame: createInitialRelayGame('victory', 'warrior', 8),

    // 6. House Puzzle Storm
    stormHouse: 'victory',
    stormRunning: false,
    stormTimeLeft: 120,
    stormDuration: 120,
    stormLives: 3,
    stormScore: 0,
    stormDeckOrder: [],
    stormDeckPos: 0,
    stormBoard: null,
    stormSelected: null,
    stormFeedback: '',
    stormHighScores: {
      victory: 0,
      warrior: 0,
      dreadnought: 0,
      invincible: 0,
    },

    // 7. Bounty Board
    bountySelectedPlayerId: '',
    bountyClaimsLog: [],
  };
}

// ============================================================================
// 6. SHARED UI HELPERS (GIANT SIMPLE 1-2-3 BANNER + TOP NAV)
// ============================================================================
function renderSimpleThreeRulesStrip(title, step1, step2, step3, accent = '#0284c7', compact = false) {
  return `
    <div style="background: #ffffff; border: 2px solid ${accent}; border-radius: 12px; padding: ${compact ? '8px 14px' : '12px 16px'}; margin-bottom: ${compact ? '10px' : '14px'}; box-shadow: 0 3px 10px rgba(15, 23, 42, 0.05);">
      <div style="font-size: 0.72rem; font-weight: 900; color: ${accent}; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: ${compact ? '5px' : '8px'};">
        📢 ${title} — Read Out Loud in 10 Seconds:
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: ${compact ? '8px' : '10px'};">
        <div style="display: flex; align-items: flex-start; gap: 8px; background: #f8fafc; padding: ${compact ? '6px 9px' : '8px 10px'}; border-radius: 8px;">
          <span style="width: 24px; height: 24px; border-radius: 50%; background: ${accent}; color: #ffffff; font-weight: 900; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">1</span>
          <span style="font-size: ${compact ? '0.8rem' : '0.86rem'}; font-weight: 700; color: #0f172a; line-height: 1.3;">${step1}</span>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 8px; background: #f8fafc; padding: ${compact ? '6px 9px' : '8px 10px'}; border-radius: 8px;">
          <span style="width: 24px; height: 24px; border-radius: 50%; background: ${accent}; color: #ffffff; font-weight: 900; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">2</span>
          <span style="font-size: ${compact ? '0.8rem' : '0.86rem'}; font-weight: 700; color: #0f172a; line-height: 1.3;">${step2}</span>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 8px; background: #f8fafc; padding: ${compact ? '6px 9px' : '8px 10px'}; border-radius: 8px;">
          <span style="width: 24px; height: 24px; border-radius: 50%; background: ${accent}; color: #ffffff; font-weight: 900; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">3</span>
          <span style="font-size: ${compact ? '0.8rem' : '0.86rem'}; font-weight: 700; color: #0f172a; line-height: 1.3;">${step3}</span>
        </div>
      </div>
    </div>
  `;
}

function renderModeTopBar(cms, chessState, modeTitle, modeIcon, sortedHouses = []) {
  const undoCount = Array.isArray(chessState.undoStack) ? chessState.undoStack.length : 0;
  const isFs = Boolean(cms.tvFullscreen);
  return `
    <div style="background: #0f172a; color: #ffffff; border-radius: 12px; padding: 8px 14px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; border: 2px solid #334155;">
      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        ${
          cms.activeMode !== 'hub'
            ? `
          <button type="button" onclick="window.selectClubGameMode('hub')" style="background: #334155; color: #ffffff; border: 1.5px solid #64748b; padding: 7px 13px; border-radius: 8px; font-weight: 800; font-size: 0.84rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            ← All 7 Games
          </button>
        `
            : ''
        }
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.3rem;">${modeIcon}</span>
          <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.12rem; font-weight: 800; color: #fbbf24;">
            ${modeTitle}
          </span>
        </div>
      </div>

      ${
        sortedHouses && sortedHouses.length > 0
          ? `
        <div style="display: flex; gap: 5px; align-items: center; flex-wrap: wrap;">
          ${sortedHouses
            .map((hs) => {
              const hd = HOUSES[hs.id];
              if (!hd) return '';
              return `<span style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); padding: 3px 9px; border-radius: 12px; font-size: 0.75rem; font-weight: 800; color: #ffffff;">${hd.name}: <strong style="color: #fbbf24;">${hs.points}</strong></span>`;
            })
            .join('')}
        </div>
      `
          : ''
      }

      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <button type="button" onclick="window.undoTournamentAction()" ${undoCount === 0 ? 'disabled' : ''} style="background: ${undoCount > 0 ? '#f59e0b' : '#1e293b'}; color: ${undoCount > 0 ? '#0f172a' : '#64748b'}; border: 1.5px solid ${undoCount > 0 ? '#fbbf24' : '#334155'}; padding: 7px 13px; border-radius: 8px; font-weight: 900; font-size: 0.82rem; cursor: ${undoCount > 0 ? 'pointer' : 'not-allowed'};">
          ↩️ Undo${undoCount > 0 ? ` (${undoCount})` : ''}
        </button>
        <button type="button" onclick="window.toggleClubModesFullscreen()" style="background: ${isFs ? '#dc2626' : '#0284c7'}; color: #ffffff; border: 1.5px solid ${isFs ? '#f87171' : '#38bdf8'}; padding: 7px 13px; border-radius: 8px; font-weight: 900; font-size: 0.82rem; cursor: pointer;">
          ${isFs ? '✕ Exit Full Screen TV' : '📺 Full-Screen TV Mode'}
        </button>
      </div>
    </div>
  `;
}

// ============================================================================
// 7. RENDERERS FOR HUB + EACH OF THE 7 GAME MODES
// ============================================================================

function renderClubModesHub(cms) {
  const boardModes = [
    {
      id: 'chaos',
      icon: '🎡',
      title: '1. Chaos Wheel & Chair-Swap Gong',
      where: 'Real Chessboards + TV Spinner',
      desc: 'Spin the giant wheel for wild rules (No Queens, King of the Hill, or the hilarious Secret Chair-Swap Gong)!',
      bg: '#fef2f2',
      border: '#fca5a5',
      btnBg: '#dc2626',
    },
    {
      id: 'bughouse',
      icon: '🤝',
      title: '2. 2v2 "Bughouse" Pass-the-Piece',
      where: '2 Side-by-Side Real Boards',
      desc: 'Pairs 1 top player + 1 newer player per team! Hand captured pieces to your teammate to drop onto their board!',
      bg: '#f0fdf4',
      border: '#86efac',
      btnBg: '#16a34a',
    },
    {
      id: 'throne',
      icon: '👑',
      title: '3. Hold the Throne (Boss Gauntlet)',
      where: 'Board 1 Boss + Live Queue',
      desc: 'Winner stays on Board 1! Every win adds an automatic handicap (lose Knight → Rook → Queen) + Giant-Slayer Bounties!',
      bg: '#fffbeb',
      border: '#fcd34d',
      btnBg: '#d97706',
    },
    {
      id: 'civilwar',
      icon: '⚔️',
      title: '4. House Civil War (Tug-of-War)',
      where: '2 Giant Alliances Across Room',
      desc: 'Splits the room into 2 massive House Alliances with a live Tug-of-War rope bar shifting across the TV!',
      bg: '#eff6ff',
      border: '#93c5fd',
      btnBg: '#2563eb',
    },
  ];

  const tvModes = [
    {
      id: 'relay',
      icon: '🏃‍♂️',
      title: '5. 5-Second Relay Chess ON THE TV!',
      where: 'Two Queues Tapping the Smartboard',
      desc: 'Full playable chessboard on the TV! Two lines — tap 1 legal move before the buzzer, sprint to the back of the line, zero talking!',
      bg: '#faf5ff',
      border: '#d8b4fe',
      btnBg: '#7c3aed',
    },
    {
      id: 'storm',
      icon: '⚡',
      title: '6. House Puzzle Storm (2-Min Blitz)',
      where: 'Whole House at the Touch TV',
      desc: '3 lives, 2 minutes! Solve fast 1-move Checkmates & Forks right on the TV to beat the Club High Score & bank House Points!',
      bg: '#ecfeff',
      border: '#67e8f9',
      btnBg: '#0891b2',
    },
    {
      id: 'bounties',
      icon: '🎯',
      title: '7. Live Bounty Hunter Board',
      where: 'Leave Up on TV During Any Session',
      desc: 'Pupils bring their opponent up as a witness & tap to claim bonus House Points for Pawn Mates, Knight Forks & Coaching!',
      bg: '#fdf2f8',
      border: '#f9a8d4',
      btnBg: '#db2777',
    },
  ];

  const renderCard = (m) => `
    <div style="background: ${m.bg}; border: 2px solid ${m.border}; border-radius: 14px; padding: 16px 18px; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span style="font-size: 2rem; line-height: 1;">${m.icon}</span>
          <span style="background: rgba(15, 23, 42, 0.08); color: #1e293b; font-size: 0.68rem; font-weight: 800; padding: 3px 8px; border-radius: 20px; text-transform: uppercase;">
            ${m.where}
          </span>
        </div>
        <h3 style="margin: 0 0 6px 0; font-size: 1.12rem; font-weight: 900; color: #0f172a;">
          ${m.title}
        </h3>
        <p style="margin: 0; font-size: 0.85rem; color: #334155; line-height: 1.4;">
          ${m.desc}
        </p>
      </div>
      <button type="button" onclick="window.selectClubGameMode('${m.id}')" style="width: 100%; background: ${m.btnBg}; color: #ffffff; border: none; border-radius: 9px; padding: 12px 14px; font-size: 0.95rem; font-weight: 900; cursor: pointer; box-shadow: 0 3px 8px rgba(0,0,0,0.15);">
        ▶ LAUNCH THIS GAME
      </button>
    </div>
  `;

  return `
    <div>
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; border-radius: 12px; padding: 14px 18px; margin-bottom: 16px; border: 1.5px solid #334155;">
        <div style="font-size: 1.02rem; font-weight: 800; color: #fbbf24; margin-bottom: 3px;">
          👋 Zero Chess Expertise Needed! Pick Any Game Below:
        </div>
        <div style="font-size: 0.85rem; color: #cbd5e1; line-height: 1.4;">
          Every game puts <strong>3 simple rules in huge writing on your TV</strong> and gives pupils big touch buttons to score their own House points! (And if anyone taps the wrong button, just hit <strong>↩️ Undo</strong> at the top.)
        </div>
      </div>

      <div style="font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: #475569; margin-bottom: 8px;">
        ♟️ Part A: Play on Your Real Classroom Chessboards (Guided by TV)
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(265px, 1fr)); gap: 14px; margin-bottom: 20px;">
        ${boardModes.map(renderCard).join('')}
      </div>

      <div style="font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: #475569; margin-bottom: 8px;">
        📺 Part B: Play Directly on the Big Touch-Screen TV (Amazing for Last 15 Mins!)
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
        ${tvModes.map(renderCard).join('')}
      </div>
    </div>
  `;
}

// MODE 1: CHAOS WHEEL + SECRET CHAIR-SWAP GONG
function renderChaosWheelMode(cms, chessState, getShortName) {
  const twist =
    CHAOS_WHEEL_TWISTS.find((t) => t.id === cms.chaosSelectedId) || CHAOS_WHEEL_TWISTS[0];
  const activeBoards = (chessState.activePairings || []).filter((p) => !p.isBye);

  return `
    ${renderSimpleThreeRulesStrip(
      'How to Run Chaos Wheel',
      'Tap "SPIN THE CHAOS WHEEL" below on the TV.',
      'Everyone sets up real boards & plays an 8-minute game using that rule!',
      'When finished, walk up to the TV and tap the winner below!',
      twist.color,
    )}

    ${
      cms.gongFiredBanner
        ? `
      <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff; border: 4px solid #fde047; border-radius: 16px; padding: 24px; margin-bottom: 16px; text-align: center; box-shadow: 0 12px 32px rgba(220, 38, 38, 0.45);">
        <div style="font-size: 3rem; line-height: 1; margin-bottom: 6px;">🚨 🔄 🚨</div>
        <div style="font-size: 2.1rem; font-weight: 900; letter-spacing: 0.03em; color: #fde047; text-transform: uppercase;">
          CHAIR-SWAP GONG!! HANDS OFF PIECES!
        </div>
        <div style="font-size: 1.15rem; font-weight: 800; margin-top: 6px;">
          EVERY BOARD IN THE ROOM: STAND UP, SWAP CHAIRS WITH YOUR OPPONENT, AND PLAY ON!
        </div>
        <button type="button" onclick="window.dismissChaosGongBanner()" style="margin-top: 14px; background: #ffffff; color: #991b1b; border: none; font-weight: 900; font-size: 0.95rem; padding: 10px 22px; border-radius: 8px; cursor: pointer;">
          ✓ Everyone Has Swapped Chairs — Continue!
        </button>
      </div>
    `
        : ''
    }

    <!-- Giant Spin & Active Twist Display -->
    <div style="background: #ffffff; border: 3px solid ${twist.color}; border-radius: 16px; padding: 20px 22px; margin-bottom: 16px; text-align: center; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
      <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 14px;">
        <button type="button" onclick="window.spinChaosWheel()" ${cms.chaosSpinning ? 'disabled' : ''} style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); color: #ffffff; border: 2px solid #fde047; border-radius: 12px; padding: 14px 28px; font-size: 1.2rem; font-weight: 900; cursor: pointer; box-shadow: 0 6px 18px rgba(220, 38, 38, 0.3);">
          ${cms.chaosSpinning ? '🎡 SPINNING...' : '🎡 SPIN THE CHAOS WHEEL!'}
        </button>

        ${
          twist.hasSecretGong
            ? `
          <button type="button" onclick="window.toggleSecretChairSwapGong()" style="background: ${cms.gongArmed ? '#dc2626' : '#0f172a'}; color: #ffffff; border: 2px solid ${cms.gongArmed ? '#fde047' : '#475569'}; border-radius: 12px; padding: 14px 22px; font-size: 1.02rem; font-weight: 900; cursor: pointer;">
            ${cms.gongArmed ? '🔔 SECRET GONG ARMED! (Will Ring Randomly in 2–4m — Tap to Cancel)' : '🔔 ARM SECRET 2–4 MIN CHAIR-SWAP GONG!'}
          </button>
          <button type="button" onclick="window.triggerChaosGongNow()" style="background: #fef2f2; color: #991b1b; border: 1.5px solid #fca5a5; border-radius: 12px; padding: 14px 16px; font-size: 0.9rem; font-weight: 800; cursor: pointer;" title="Ring the swap gong right now!">
            📢 Ring Gong Now!
          </button>
        `
            : `
          <button type="button" onclick="window.setRoundTimer(8)" style="background: #0f172a; color: #4ade80; border: 2px solid #334155; border-radius: 12px; padding: 14px 20px; font-size: 1rem; font-weight: 900; cursor: pointer;">
            ⏱ Start 8-Min Round Clock
          </button>
        `
        }
      </div>

      <!-- Giant Rule Card -->
      <div style="background: #f8fafc; border: 2px dashed ${twist.color}; border-radius: 14px; padding: 18px 20px; max-width: 880px; margin: 0 auto;">
        <div style="font-size: 3rem; line-height: 1; margin-bottom: 6px;">${twist.icon}</div>
        <span style="display: inline-block; background: ${twist.color}; color: #ffffff; font-size: 0.74rem; font-weight: 900; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 6px;">
          THIS ROUND’S RULE · ${twist.badge}
        </span>
        <h2 style="margin: 0 0 8px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; color: #0f172a; font-weight: 900;">
          ${twist.title}
        </h2>
        <p style="margin: 0 0 8px 0; font-size: 1.15rem; font-weight: 700; color: #1e293b; line-height: 1.45;">
          ${twist.pupilRule}
        </p>
        <div style="font-size: 0.9rem; font-weight: 700; color: #64748b;">
          💡 ${twist.tip}
        </div>
      </div>

      <!-- Quick Manual Picker Pills -->
      <div style="margin-top: 12px; display: flex; justify-content: center; gap: 6px; flex-wrap: wrap;">
        ${CHAOS_WHEEL_TWISTS.map(
          (t) => `
          <button type="button" onclick="window.pickChaosTwist('${t.id}')" style="background: ${t.id === twist.id ? t.color : '#f1f5f9'}; color: ${t.id === twist.id ? '#ffffff' : '#334155'}; border: 1px solid #cbd5e1; padding: 5px 10px; border-radius: 20px; font-size: 0.74rem; font-weight: 800; cursor: pointer;">
            ${t.icon} ${t.title.replace(/!$/, '')}
          </button>
        `,
        ).join('')}
      </div>
    </div>

    <!-- Quick Board Pairing & Pupil Touch Scoring -->
    <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 14px; padding: 16px 18px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
        <h3 style="margin: 0; font-size: 1.05rem; font-weight: 900; color: #0f172a;">
          ⚔️ Chaos Round Boards (Tap Winner on TV to Award House Points!)
        </h3>
        <button type="button" onclick="window.pairChaosRoundBoards()" style="background: #0284c7; color: #ffffff; border: none; border-radius: 8px; padding: 10px 16px; font-size: 0.88rem; font-weight: 900; cursor: pointer;">
          🔀 Shuffle &amp; Pair New Chaos Boards
        </button>
      </div>

      ${
        activeBoards.length === 0
          ? `<div style="text-align: center; padding: 18px; color: #64748b; font-weight: 700;">Tap <strong>"🔀 Shuffle &amp; Pair New Chaos Boards"</strong> above to put everyone onto boards!</div>`
          : `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 10px;">
          ${activeBoards
            .map(
              (b) => `
            <div style="background: #f8fafc; border: 1.5px solid ${b.completed ? '#86efac' : '#cbd5e1'}; border-radius: 10px; padding: 12px;">
              <div style="font-size: 0.74rem; font-weight: 900; color: #0284c7; margin-bottom: 4px;">BOARD ${b.board}</div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 10px;">
                <span>♔ ${b.white.name}</span>
                <span style="color: #94a3b8; font-size: 0.76rem;">vs</span>
                <span>♚ ${b.black.name}</span>
              </div>
              ${
                !b.completed
                  ? `
                <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 6px;">
                  <button type="button" onclick="window.recordQuickMatchResult(${b.board}, 'white')" style="background: #16a34a; color: #ffffff; border: none; border-radius: 7px; padding: 10px 6px; font-weight: 900; font-size: 0.8rem; cursor: pointer;">
                    ${getShortName(b.white)} Won
                  </button>
                  <button type="button" onclick="window.recordQuickMatchResult(${b.board}, 'draw')" style="background: #f59e0b; color: #0f172a; border: none; border-radius: 7px; padding: 10px 8px; font-weight: 900; font-size: 0.8rem; cursor: pointer;">
                    🤝 Draw
                  </button>
                  <button type="button" onclick="window.recordQuickMatchResult(${b.board}, 'black')" style="background: #16a34a; color: #ffffff; border: none; border-radius: 7px; padding: 10px 6px; font-weight: 900; font-size: 0.8rem; cursor: pointer;">
                    ${getShortName(b.black)} Won
                  </button>
                </div>
              `
                  : `<div style="text-align: center; font-weight: 900; font-size: 0.84rem; color: #15803d;">✓ Result Logged (${b.winnerName === 'Draw' ? 'Draw +2 each' : `${b.winnerName} Won +3`})</div>`
              }
            </div>
          `,
            )
            .join('')}
        </div>
      `
      }
    </div>
  `;
}

// MODE 2: 2v2 BUGHOUSE PASS-THE-PIECE
function renderBughouseMode(cms) {
  const matches = cms.bughouseMatches || [];
  const singles = cms.bughouseExtraSingles || [];

  return `
    ${renderSimpleThreeRulesStrip(
      'How to Play 2v2 Pass-the-Piece ("Bughouse")',
      'Put 2 boards next to each other! Teammates sit side-by-side (one plays White, partner plays Black).',
      'When you capture an enemy piece, HAND IT TO YOUR TEAMMATE! On their turn, they can DROP it onto any empty square (no pawns on first/last row)!',
      'The FIRST checkmate on EITHER board wins the whole match for BOTH teammates (+3 House pts each)!',
      '#16a34a',
    )}

    <div style="background: #ffffff; border: 2px solid #86efac; border-radius: 14px; padding: 16px 18px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
        <div>
          <h3 style="margin: 0; font-size: 1.15rem; font-weight: 900; color: #14532d;">
            🤝 Fair 2v2 Team Tables (Top Players Paired WITH Newer Players!)
          </h3>
          <div style="font-size: 0.82rem; color: #475569;">
            Automatically pairs #1 seed + newest player vs #2 seed + 2nd newest player so every team is balanced!
          </div>
        </div>
        <button type="button" onclick="window.generateBughouseTeams()" style="background: #16a34a; color: #ffffff; border: none; border-radius: 10px; padding: 12px 20px; font-size: 0.95rem; font-weight: 900; cursor: pointer; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);">
          ⚡ Auto-Build Fair 2v2 Teams!
        </button>
      </div>

      ${
        matches.length === 0
          ? `<div style="text-align: center; padding: 28px; background: #f0fdf4; border-radius: 10px; color: #166534; font-weight: 800; font-size: 0.98rem;">Tap <strong>"⚡ Auto-Build Fair 2v2 Teams!"</strong> above to create balanced 4-player tables!</div>`
          : `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 14px;">
          ${matches
            .map(
              (m, idx) => `
            <div style="background: #f8fafc; border: 2px solid ${m.winner ? '#22c55e' : '#cbd5e1'}; border-radius: 12px; padding: 14px 16px;">
              <div style="font-size: 0.78rem; font-weight: 900; color: #15803d; text-transform: uppercase; margin-bottom: 8px;">
                ♟️♟️ DOUBLE TABLE ${idx + 1} (Put 2 Chessboards Side-by-Side!)
              </div>

              <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: center; margin-bottom: 12px;">
                <div style="background: #ffffff; border: 1.5px solid #93c5fd; border-radius: 8px; padding: 10px;">
                  <div style="font-size: 0.7rem; font-weight: 900; color: #1d4ed8; margin-bottom: 4px;">TEAM ALPHA</div>
                  <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">♔ ${m.teamA[0].name}</div>
                  <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a; margin-top: 2px;">♚ ${m.teamA[1].name}</div>
                </div>
                <div style="font-weight: 900; color: #64748b;">VS</div>
                <div style="background: #ffffff; border: 1.5px solid #fca5a5; border-radius: 8px; padding: 10px;">
                  <div style="font-size: 0.7rem; font-weight: 900; color: #b91c1c; margin-bottom: 4px;">TEAM BRAVO</div>
                  <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">♚ ${m.teamB[0].name}</div>
                  <div style="font-size: 0.9rem; font-weight: 800; color: #0f172a; margin-top: 2px;">♔ ${m.teamB[1].name}</div>
                </div>
              </div>

              ${
                !m.winner
                  ? `
                <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 6px;">
                  <button type="button" onclick="window.scoreBughouseMatch('${m.id}', 'A')" style="background: #2563eb; color: #ffffff; border: none; border-radius: 8px; padding: 11px 8px; font-weight: 900; font-size: 0.84rem; cursor: pointer;">
                    🏆 Team Alpha Won (+3 each)
                  </button>
                  <button type="button" onclick="window.scoreBughouseMatch('${m.id}', 'draw')" style="background: #fef3c7; color: #92400e; border: 1px solid #f59e0b; border-radius: 8px; padding: 11px 10px; font-weight: 900; font-size: 0.84rem; cursor: pointer;">
                    🤝 Draw
                  </button>
                  <button type="button" onclick="window.scoreBughouseMatch('${m.id}', 'B')" style="background: #dc2626; color: #ffffff; border: none; border-radius: 8px; padding: 11px 8px; font-weight: 900; font-size: 0.84rem; cursor: pointer;">
                    🏆 Team Bravo Won (+3 each)
                  </button>
                </div>
              `
                  : `<div style="text-align: center; font-weight: 900; color: #15803d; font-size: 0.9rem; padding-top: 4px;">✓ ${m.winner === 'draw' ? 'Drawn Match (+2 House pts each!)' : `Team ${m.winner === 'A' ? 'Alpha' : 'Bravo'} Won (+3 House pts each!)`}</div>`
              }
            </div>
          `,
            )
            .join('')}
        </div>
      `
      }

      ${
        singles.length > 0
          ? `
        <div style="margin-top: 14px; background: #fffbeb; border: 1.5px solid #fcd34d; border-radius: 10px; padding: 10px 14px; font-size: 0.85rem; color: #92400e; font-weight: 700;">
          ⚡ Extra Rapid / Sub Rotation Players (swap into next 2v2 table as soon as a game finishes!): <strong>${singles.map((p) => p.name).join(', ')}</strong>
        </div>
      `
          : ''
      }
    </div>
  `;
}

// MODE 3: HOLD THE THRONE (BOSS GAUNTLET)
function renderHoldTheThroneMode(cms, chessState) {
  const players = chessState.players || [];
  const monarch = players.find((p) => p.id === cms.throneMonarchId) || null;
  const queue = (cms.throneQueueIds || [])
    .map((id) => players.find((p) => p.id === id))
    .filter(Boolean);
  const challenger = queue[0] || null;
  const streak = cms.throneStreak || 0;

  let handicapBanner = 'Even Game — Monarch plays White (5-Min Blitz)';
  let bountyPts = 3;
  if (streak === 1) {
    handicapBanner = 'Streak 1: Even Pieces — Challenger gets White!';
    bountyPts = 3;
  } else if (streak === 2) {
    handicapBanner = '🔥 Streak 2 HANDICAP: Monarch removes 1 KNIGHT before Move 1!';
    bountyPts = 4;
  } else if (streak === 3) {
    handicapBanner = '🔥🔥 Streak 3 HANDICAP: Monarch removes 1 ROOK before Move 1!';
    bountyPts = 5;
  } else if (streak >= 4) {
    handicapBanner = '🔥🔥🔥 Streak 4+ BOSS HANDICAP: Monarch removes THEIR QUEEN before Move 1!';
    bountyPts = 6;
  }

  return `
    ${renderSimpleThreeRulesStrip(
      'How to Play Hold the Throne',
      'Board 1 is THE THRONE! Monarch sits at Board 1; Challengers play 5-min games to dethrone them!',
      'Every time the Monarch wins, the TV gives them a BIGGER handicap (no Knight → no Rook → no Queen)!',
      'Walk up & tap who won below — the next Challenger in the queue steps straight onto Board 1!',
      '#d97706',
    )}

    ${
      !monarch
        ? `
      <div style="background: #fffbeb; border: 2.5px solid #f59e0b; border-radius: 14px; padding: 28px; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 8px;">👑</div>
        <h3 style="margin: 0 0 8px 0; font-size: 1.4rem; font-weight: 900; color: #78350f;">Ready to Crown the First Monarch?</h3>
        <p style="margin: 0 auto 16px; max-width: 500px; color: #92400e; font-weight: 700;">Tap below to place #1 seed on The Throne and line up all arrived pupils in the Challenger Queue!</p>
        <button type="button" onclick="window.startHoldTheThrone()" style="background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%); color: #ffffff; border: none; border-radius: 10px; padding: 14px 28px; font-size: 1.1rem; font-weight: 900; cursor: pointer;">
          👑 Launch Throne &amp; Challenger Queue!
        </button>
      </div>
    `
        : `
      <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; align-items: stretch;">
        <!-- Left: Giant Throne Match Card -->
        <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 3px solid #d97706; border-radius: 16px; padding: 20px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: inline-block; background: #92400e; color: #fde68a; font-size: 0.78rem; font-weight: 900; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 10px;">
              👑 BOARD 1 · THE ROYAL THRONE · STREAK: ${streak} WIN${streak === 1 ? '' : 'S'}
            </div>

            <div style="background: #78350f; color: #fde047; border-radius: 10px; padding: 10px 14px; font-size: 1rem; font-weight: 900; margin-bottom: 16px;">
              ⚖️ ${handicapBanner}
            </div>

            <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 18px;">
              <div style="background: #ffffff; border: 2.5px solid #f59e0b; border-radius: 12px; padding: 14px 10px;">
                <div style="font-size: 0.72rem; font-weight: 900; color: #b45309;">👑 REIGNING MONARCH</div>
                <div style="font-size: 1.3rem; font-weight: 900; color: #0f172a; margin-top: 4px;">${monarch.name}</div>
                <div style="font-size: 0.8rem; font-weight: 800; color: ${HOUSES[monarch.house]?.color || '#334155'};">${HOUSES[monarch.house]?.name || monarch.house}</div>
              </div>
              <div style="font-size: 1.3rem; font-weight: 900; color: #92400e;">VS</div>
              <div style="background: #ffffff; border: 2.5px solid #0284c7; border-radius: 12px; padding: 14px 10px;">
                <div style="font-size: 0.72rem; font-weight: 900; color: #0369a1;">⚔️ CHALLENGER (BOUNTY: +${bountyPts} PTS!)</div>
                <div style="font-size: 1.3rem; font-weight: 900; color: #0f172a; margin-top: 4px;">${challenger ? challenger.name : 'No Queue'}</div>
                <div style="font-size: 0.8rem; font-weight: 800; color: ${challenger ? HOUSES[challenger.house]?.color || '#334155' : '#94a3b8'};">${challenger ? HOUSES[challenger.house]?.name || challenger.house : ''}</div>
              </div>
            </div>
          </div>

          ${
            challenger
              ? `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <button type="button" onclick="window.resolveThroneMatch('monarch')" style="background: #d97706; color: #ffffff; border: none; border-radius: 10px; padding: 16px 10px; font-size: 1rem; font-weight: 900; cursor: pointer; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);">
                👑 ${monarch.name} Held Throne! (+3 pts)
              </button>
              <button type="button" onclick="window.resolveThroneMatch('challenger')" style="background: #0284c7; color: #ffffff; border: none; border-radius: 10px; padding: 16px 10px; font-size: 1rem; font-weight: 900; cursor: pointer; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);">
                ⚔️ ${challenger.name} NEW MONARCH! (+${bountyPts} pts!)
              </button>
            </div>
          `
              : ''
          }
        </div>

        <!-- Right: Challenger Queue -->
        <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h4 style="margin: 0; font-size: 1rem; font-weight: 900; color: #0f172a;">📋 Next Up for Board 1 (${queue.length})</h4>
              <button type="button" onclick="window.startHoldTheThrone(true)" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 10px; font-size: 0.74rem; font-weight: 800; cursor: pointer;">
                🔀 Shuffle Queue
              </button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px; max-height: 290px; overflow-y: auto;">
              ${queue
                .map(
                  (p, idx) => `
                <div style="display: flex; justify-content: space-between; align-items: center; background: ${idx === 0 ? '#e0f2fe' : '#f8fafc'}; border: 1px solid ${idx === 0 ? '#38bdf8' : '#e2e8f0'}; border-radius: 8px; padding: 7px 10px; font-size: 0.85rem; font-weight: 800;">
                  <span>${idx === 0 ? '👉 PLAYING NOW:' : `#${idx + 1} Waiting:`} ${p.name}</span>
                  ${
                    idx > 0
                      ? `<button type="button" onclick="window.bumpChallengerToFront('${p.id}')" style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 5px; padding: 3px 7px; font-size: 0.7rem; font-weight: 800; cursor: pointer;">Move Next ▲</button>`
                      : ''
                  }
                </div>
              `,
                )
                .join('')}
            </div>
          </div>
          <div style="font-size: 0.78rem; color: #64748b; margin-top: 10px; font-weight: 700;">
            💡 Waiting challengers can play practice games on Boards 2–6 until their name hits #2!
          </div>
        </div>
      </div>
    `
    }
  `;
}

// MODE 4: HOUSE CIVIL WAR (TUG-OF-WAR)
function renderCivilWarMode(cms, getShortName) {
  const sA = cms.civilWarScoreA || 0;
  const sB = cms.civilWarScoreB || 0;
  const total = sA + sB;
  const pctA = total === 0 ? 50 : Math.max(12, Math.min(88, Math.round((sA / total) * 100)));
  const teamANames = (cms.civilWarTeamA || ['victory', 'dreadnought'])
    .map((h) => HOUSES[h]?.name || h)
    .join(' + ');
  const teamBNames = (cms.civilWarTeamB || ['warrior', 'invincible'])
    .map((h) => HOUSES[h]?.name || h)
    .join(' + ');
  const boards = cms.civilWarBoards || [];

  return `
    ${renderSimpleThreeRulesStrip(
      'How to Play House Civil War (Tug-of-War)',
      `Today the room is split into 2 GIANT ALLIANCES: ${teamANames} vs ${teamBNames}!`,
      'Tap "Pair Alliance Clashes" to match opponents from opposite sides across boards.',
      'Every win pulls the giant Tug-of-War bar (+3 pts) AND adds to real House Points!',
      '#2563eb',
    )}

    <!-- GIANT LIVE TUG-OF-WAR ROPE BAR -->
    <div style="background: #0f172a; color: #ffffff; border-radius: 16px; padding: 18px 20px; margin-bottom: 16px; border: 2px solid #334155;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
        <div>
          <div style="font-size: 0.74rem; font-weight: 900; color: #60a5fa; text-transform: uppercase;">⚓ FLEET ALLIANCE</div>
          <div style="font-size: 1.25rem; font-weight: 900;">${teamANames} — <span style="color: #60a5fa;">${sA} PTS</span></div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button type="button" onclick="window.rotateCivilWarAlliances()" style="background: #1e293b; color: #cbd5e1; border: 1px solid #475569; border-radius: 7px; padding: 7px 12px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
            🔄 Swap House Alliances
          </button>
          <button type="button" onclick="window.pairCivilWarBoards()" style="background: #f59e0b; color: #0f172a; border: none; border-radius: 7px; padding: 8px 16px; font-size: 0.85rem; font-weight: 900; cursor: pointer;">
            ⚔️ Pair New Alliance Clashes!
          </button>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.74rem; font-weight: 900; color: #f87171; text-transform: uppercase;">🔥 IRON ALLIANCE</div>
          <div style="font-size: 1.25rem; font-weight: 900;"><span style="color: #f87171;">${sB} PTS</span> — ${teamBNames}</div>
        </div>
      </div>

      <div style="width: 100%; height: 38px; background: #dc2626; border-radius: 20px; overflow: hidden; display: flex; border: 3px solid #ffffff; position: relative;">
        <div style="width: ${pctA}%; background: linear-gradient(90deg, #1d4ed8, #0284c7); height: 100%; transition: width 0.4s ease; display: flex; align-items: center; padding-left: 14px; font-weight: 900; font-size: 0.88rem;">
          ${pctA}%
        </div>
        <div style="flex: 1; display: flex; align-items: center; justify-content: flex-end; padding-right: 14px; font-weight: 900; font-size: 0.88rem;">
          ${100 - pctA}%
        </div>
        <div style="position: absolute; left: calc(${pctA}% - 16px); top: 1px; width: 32px; height: 30px; background: #fde047; color: #0f172a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.9rem; box-shadow: 0 2px 8px rgba(0,0,0,0.4);">
          ⚔️
        </div>
      </div>
    </div>

    <!-- Alliance Clash Boards -->
    <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 14px; padding: 16px;">
      ${
        boards.length === 0
          ? `<div style="text-align: center; padding: 24px; color: #64748b; font-weight: 800;">Tap <strong>"⚔️ Pair New Alliance Clashes!"</strong> above to launch Round 1!</div>`
          : `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px;">
          ${boards
            .map(
              (b, idx) => `
            <div style="background: #f8fafc; border: 2px solid ${b.winner ? '#86efac' : '#cbd5e1'}; border-radius: 10px; padding: 12px;">
              <div style="font-size: 0.72rem; font-weight: 900; color: #475569; margin-bottom: 6px;">CLASH BOARD ${idx + 1}</div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 800; font-size: 0.94rem; margin-bottom: 10px;">
                <span style="color: #1d4ed8;">⚓ ${b.pA.name}</span>
                <span style="color: #94a3b8; font-size: 0.75rem;">vs</span>
                <span style="color: #b91c1c;">🔥 ${b.pB.name}</span>
              </div>
              ${
                !b.winner
                  ? `
                <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 6px;">
                  <button type="button" onclick="window.scoreCivilWarBoard('${b.id}', 'A')" style="background: #2563eb; color: #ffffff; border: none; border-radius: 7px; padding: 10px 6px; font-weight: 900; font-size: 0.8rem; cursor: pointer;">
                    ${getShortName(b.pA)} Won
                  </button>
                  <button type="button" onclick="window.scoreCivilWarBoard('${b.id}', 'draw')" style="background: #fef3c7; color: #92400e; border: 1px solid #f59e0b; border-radius: 7px; padding: 10px 8px; font-weight: 900; font-size: 0.8rem; cursor: pointer;">
                    🤝 Draw
                  </button>
                  <button type="button" onclick="window.scoreCivilWarBoard('${b.id}', 'B')" style="background: #dc2626; color: #ffffff; border: none; border-radius: 7px; padding: 10px 6px; font-weight: 900; font-size: 0.8rem; cursor: pointer;">
                    ${getShortName(b.pB)} Won
                  </button>
                </div>
              `
                  : `<div style="text-align: center; font-weight: 900; font-size: 0.82rem; color: #15803d;">✓ Scored for ${b.winner === 'draw' ? 'Both Alliances (+1 each)' : b.winner === 'A' ? `Fleet (${b.pA.name})` : `Iron (${b.pB.name})`}!</div>`
              }
            </div>
          `,
            )
            .join('')}
        </div>
      `
      }
    </div>
  `;
}

// MODE 5: 5-SECOND RELAY CHESS LIVE ON THE TOUCH TV!
function renderRelayChessMode(cms) {
  const g = cms.relayGame || createInitialRelayGame();
  const legalTargets = new Map();
  if (g.selected && (g.status === 'playing' || g.status === 'ready')) {
    const moves = getLegalMovesForSquare(g, g.selected[0], g.selected[1]);
    moves.forEach((mv) => legalTargets.set(`${mv.toR},${mv.toC}`, mv));
  }

  const mat = computeMaterialScore(g.board);
  const wHouse = HOUSES[g.whiteHouse] || HOUSES.victory;
  const bHouse = HOUSES[g.blackHouse] || HOUSES.warrior;

  let squaresHtml = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const isLight = (r + c) % 2 === 0;
      const ch = g.board[r][c];
      const glyph = PIECE_UNICODE[ch] || '';
      const isSel = g.selected && g.selected[0] === r && g.selected[1] === c;
      const isTarget = legalTargets.has(`${r},${c}`);
      const isLast =
        g.lastMove &&
        ((g.lastMove.from[0] === r && g.lastMove.from[1] === c) ||
          (g.lastMove.to[0] === r && g.lastMove.to[1] === c));

      let bg = isLight ? '#eadbc2' : '#8b5e3c';
      if (isLast) bg = isLight ? '#fde68a' : '#d97706';
      if (isSel) bg = '#38bdf8';

      const pColor = isWhiteCode(ch) ? '#ffffff' : '#0f172a';
      const pStroke = isWhiteCode(ch)
        ? '-webkit-text-stroke: 1.8px #0f172a; paint-order: stroke fill; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.45));'
        : '-webkit-text-stroke: 1.2px rgba(255,255,255,0.88); paint-order: stroke fill; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));';

      squaresHtml += `
        <div onclick="window.handleRelaySquareTap(${r}, ${c})"
             style="background: ${bg}; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: clamp(1.7rem, 4.1vh, 2.85rem); font-family: 'Segoe UI Symbol', 'Apple Symbols', 'DejaVu Sans', serif; color: ${pColor}; cursor: pointer; user-select: none; position: relative;">
          <span style="${pStroke} line-height: 1;">${glyph}</span>
          ${
            isTarget
              ? ch === '.'
                ? `<div style="position: absolute; width: 32%; height: 32%; border-radius: 50%; background: rgba(34, 197, 94, 0.9); box-shadow: 0 0 8px #16a34a; pointer-events: none;"></div>`
                : `<div style="position: absolute; inset: 3px; border: 4px solid #22c55e; border-radius: 6px; pointer-events: none;"></div>`
              : ''
          }
        </div>
      `;
    }
  }

  return `
    ${renderSimpleThreeRulesStrip(
      'How to Play Touch-TV Relay Bullet',
      'Make 2 lines in front of the TV (White Queue on Left, Black Queue on Right). ZERO TALKING!',
      'Tap your piece → tap a GREEN DOT to make 1 move before the Shot Clock hits 0, then sprint to the back of your line!',
      'If the Shot Clock hits 0, the TV makes a random panic move for you! Checkmate wins +5 House Points!',
      '#7c3aed',
      true,
    )}

    <div style="display: grid; grid-template-columns: minmax(235px, 295px) minmax(280px, min(520px, calc(100vh - 235px))); gap: 18px; justify-content: center; align-items: start;">
      <!-- Left Control & Shot Clock Panel -->
      <div style="background: #1e1b4b; color: #ffffff; border-radius: 16px; padding: 16px; border: 2px solid #6366f1; display: flex; flex-direction: column; gap: 12px;">
        <!-- House Selectors -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <label style="font-size: 0.7rem; font-weight: 900; color: #cbd5e1;">♔ WHITE LINE</label>
            <select onchange="window.setRelayHouse('w', this.value)" style="width: 100%; padding: 7px; border-radius: 6px; font-weight: 800; font-size: 0.85rem; margin-top: 2px;">
              ${Object.values(HOUSES)
                .map((h) => `<option value="${h.id}" ${h.id === g.whiteHouse ? 'selected' : ''}>${h.name}</option>`)
                .join('')}
            </select>
          </div>
          <div>
            <label style="font-size: 0.7rem; font-weight: 900; color: #cbd5e1;">♚ BLACK LINE</label>
            <select onchange="window.setRelayHouse('b', this.value)" style="width: 100%; padding: 7px; border-radius: 6px; font-weight: 800; font-size: 0.85rem; margin-top: 2px;">
              ${Object.values(HOUSES)
                .map((h) => `<option value="${h.id}" ${h.id === g.blackHouse ? 'selected' : ''}>${h.name}</option>`)
                .join('')}
            </select>
          </div>
        </div>

        <!-- Turn Indicator -->
        <div style="background: ${g.turn === 'w' ? '#ffffff' : '#090d16'}; color: ${g.turn === 'w' ? '#0f172a' : '#ffffff'}; border: 3px solid #fbbf24; border-radius: 12px; padding: 12px; text-align: center;">
          <div style="font-size: 0.74rem; font-weight: 900; text-transform: uppercase; opacity: 0.8;">UP AT THE TV NOW:</div>
          <div style="font-size: 1.45rem; font-weight: 900; margin-top: 2px;">
            ${g.turn === 'w' ? `♔ WHITE (${wHouse.name})` : `♚ BLACK (${bHouse.name})`}
          </div>
        </div>

        <!-- Giant Shot Clock -->
        <div style="background: #090d16; border: 2px solid #4f46e5; border-radius: 12px; padding: 10px; text-align: center;">
          <div style="font-size: 0.7rem; font-weight: 900; color: #a5b4fc; text-transform: uppercase;">MOVE SHOT CLOCK</div>
          <div id="relay-shot-clock-readout" style="font-family: 'JetBrains Mono', monospace; font-size: 2.8rem; font-weight: 900; color: ${g.shotLimit === 0 ? '#38bdf8' : g.shotRemaining <= 2 ? '#ef4444' : '#4ade80'}; line-height: 1.1;">
            ${g.shotLimit === 0 ? '∞' : `${g.shotRemaining}s`}
          </div>
          <div style="display: flex; justify-content: center; gap: 5px; margin-top: 6px;">
            ${[5, 8, 12, 0]
              .map(
                (sec) => `
              <button type="button" onclick="window.setRelayShotLimit(${sec})" style="background: ${g.shotLimit === sec ? '#f59e0b' : '#312e81'}; color: ${g.shotLimit === sec ? '#0f172a' : '#e0e7ff'}; border: none; border-radius: 5px; padding: 4px 9px; font-size: 0.75rem; font-weight: 900; cursor: pointer;">
                ${sec === 0 ? 'No Clock' : `${sec}s`}
              </button>
            `,
              )
              .join('')}
          </div>
        </div>

        <!-- Material Score -->
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 800; background: rgba(255,255,255,0.08); padding: 8px 10px; border-radius: 8px;">
          <span>♔ Material: ${mat.w}</span>
          <span>♚ Material: ${mat.b}</span>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; flex-direction: column; gap: 7px;">
          ${
            g.status === 'checkmate' || g.status === 'stalemate'
              ? `
            <button type="button" onclick="window.awardRelayWinnerPoints()" style="background: #16a34a; color: #ffffff; border: 2px solid #86efac; border-radius: 10px; padding: 13px; font-size: 0.98rem; font-weight: 900; cursor: pointer;">
              🏆 Award House Points!
            </button>
          `
              : `
            <button type="button" onclick="window.toggleRelayRunning()" style="background: ${g.status === 'playing' ? '#f59e0b' : '#16a34a'}; color: ${g.status === 'playing' ? '#0f172a' : '#ffffff'}; border: none; border-radius: 10px; padding: 12px; font-size: 1rem; font-weight: 900; cursor: pointer;">
              ${g.status === 'playing' ? '⏸ Pause Shot Clock' : '▶ START RELAY CLOCK!'}
            </button>
          `
          }
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <button type="button" onclick="window.undoRelayMove()" ${g.history.length === 0 ? 'disabled' : ''} style="background: #312e81; color: #ffffff; border: 1px solid #6366f1; border-radius: 8px; padding: 9px; font-size: 0.8rem; font-weight: 800; cursor: pointer;">
              ↩️ Takeback
            </button>
            <button type="button" onclick="window.resetRelayGame()" style="background: #312e81; color: #fda4af; border: 1px solid #6366f1; border-radius: 8px; padding: 9px; font-size: 0.8rem; font-weight: 800; cursor: pointer;">
              🔄 New Game
            </button>
          </div>
          ${
            g.status !== 'awarded' && g.moveCount >= 4
              ? `
            <button type="button" onclick="window.adjudicateRelayByMaterial()" style="background: rgba(255,255,255,0.1); color: #fde68a; border: 1px solid #fbbf24; border-radius: 8px; padding: 8px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
              ⚖️ Time Up? Decide Winner by Piece Points!
            </button>
          `
              : ''
          }
        </div>
      </div>

      <!-- Right: Giant Touch-TV Legal Chessboard -->
      <div>
        <div style="background: #0f172a; color: #fde68a; border-radius: 10px; padding: 9px 14px; margin-bottom: 8px; font-weight: 900; font-size: 0.92rem; text-align: center;">
          ${g.bannerMsg}
        </div>
        <div style="width: 100%; aspect-ratio: 1; display: grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(8, 1fr); border: 5px solid #1e293b; border-radius: 10px; overflow: hidden; box-shadow: 0 14px 34px rgba(0,0,0,0.28);">
          ${squaresHtml}
        </div>
      </div>
    </div>
  `;
}

// MODE 6: HOUSE PUZZLE STORM (2-MIN SURVIVAL BLITZ ON TOUCH TV)
function renderPuzzleStormMode(cms) {
  const curPuzzle =
    PUZZLE_STORM_DECK[cms.stormDeckOrder?.[cms.stormDeckPos] ?? 0] || PUZZLE_STORM_DECK[0];
  const board = cms.stormBoard || curPuzzle.board;
  const h = HOUSES[cms.stormHouse] || HOUSES.victory;

  let squaresHtml = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const isLight = (r + c) % 2 === 0;
      const ch = board[r][c];
      const glyph = PIECE_UNICODE[ch] || '';
      const isSel = cms.stormSelected && cms.stormSelected[0] === r && cms.stormSelected[1] === c;
      const bg = isSel ? '#38bdf8' : isLight ? '#eadbc2' : '#8b5e3c';
      const pColor = isWhiteCode(ch) ? '#ffffff' : '#0f172a';
      const pStroke = isWhiteCode(ch)
        ? '-webkit-text-stroke: 1.8px #0f172a; paint-order: stroke fill; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.45));'
        : '-webkit-text-stroke: 1.2px rgba(255,255,255,0.88); paint-order: stroke fill; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));';

      squaresHtml += `
        <div onclick="window.handleStormSquareTap(${r}, ${c})"
             style="background: ${bg}; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: clamp(1.7rem, 4.1vh, 2.85rem); font-family: 'Segoe UI Symbol', 'Apple Symbols', 'DejaVu Sans', serif; color: ${pColor}; cursor: pointer; user-select: none;">
          <span style="${pStroke} line-height: 1;">${glyph}</span>
        </div>
      `;
    }
  }

  const m = Math.floor((cms.stormTimeLeft || 0) / 60);
  const s = (cms.stormTimeLeft || 0) % 60;
  const timeFmt = `${m}:${String(s).padStart(2, '0')}`;

  return `
    ${renderSimpleThreeRulesStrip(
      'How to Play House Puzzle Storm',
      'Pick which House is stepping up to the Touch TV & hit "START 2-MIN STORM!"',
      'Tap the winning piece, then tap the target square to solve 1-move Checkmates & Forks!',
      '3 Strikes = Run Over! Every 3 puzzles solved automatically banks +1 Bonus House Point!',
      '#0891b2',
      true,
    )}

    <div style="display: grid; grid-template-columns: minmax(235px, 295px) minmax(280px, min(520px, calc(100vh - 235px))); gap: 18px; justify-content: center; align-items: start;">
      <!-- Left Score & House Leaderboard -->
      <div style="background: #0f172a; color: #ffffff; border-radius: 16px; padding: 16px; border: 2px solid #06b6d4; display: flex; flex-direction: column; gap: 12px;">
        <div>
          <div style="font-size: 0.72rem; font-weight: 900; color: #67e8f9; margin-bottom: 6px;">1. SELECT HOUSE AT THE TV:</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            ${Object.values(HOUSES)
              .map(
                (house) => `
              <button type="button" onclick="window.setStormHouse('${house.id}')" ${cms.stormRunning ? 'disabled' : ''} style="background: ${cms.stormHouse === house.id ? house.color : '#1e293b'}; color: #ffffff; border: 2px solid ${cms.stormHouse === house.id ? '#fde047' : '#334155'}; border-radius: 8px; padding: 8px 6px; font-weight: 900; font-size: 0.82rem; cursor: pointer;">
                ${house.name}
              </button>
            `,
              )
              .join('')}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; text-align: center;">
          <div style="background: #020617; border: 1.5px solid #334155; border-radius: 10px; padding: 10px;">
            <div style="font-size: 0.68rem; color: #94a3b8; font-weight: 800;">CLOCK</div>
            <div id="storm-clock-readout" style="font-family: monospace; font-size: 2rem; font-weight: 900; color: #4ade80;">${timeFmt}</div>
          </div>
          <div style="background: #020617; border: 1.5px solid #334155; border-radius: 10px; padding: 10px;">
            <div style="font-size: 0.68rem; color: #94a3b8; font-weight: 800;">SOLVED</div>
            <div style="font-family: monospace; font-size: 2rem; font-weight: 900; color: #fbbf24;">⚡ ${cms.stormScore}</div>
          </div>
        </div>

        <div style="background: #1e293b; border-radius: 8px; padding: 8px; text-align: center; font-size: 1.25rem;">
          Lives: ${'❤️'.repeat(Math.max(0, cms.stormLives))}${'🖤'.repeat(Math.max(0, 3 - cms.stormLives))}
        </div>

        <button type="button" onclick="window.startPuzzleStormRun()" style="background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%); color: #ffffff; border: 2px solid #bae6fd; border-radius: 10px; padding: 13px; font-size: 1.02rem; font-weight: 900; cursor: pointer;">
          ${cms.stormRunning ? '🔄 Restart Run' : `🚀 START 2-MIN STORM (${h.name})!`}
        </button>

        <!-- Club High Score Table -->
        <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 10px 12px;">
          <div style="font-size: 0.72rem; font-weight: 900; color: #fde68a; text-transform: uppercase; margin-bottom: 6px;">
            🏆 Club Storm Record Board:
          </div>
          ${Object.values(HOUSES)
            .map(
              (ho) => `
            <div style="display: flex; justify-content: space-between; font-size: 0.84rem; font-weight: 800; padding: 3px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
              <span>${ho.name}</span>
              <span style="color: #fbbf24;">${cms.stormHighScores?.[ho.id] || 0} puzzles</span>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>

      <!-- Right: Giant Storm Board -->
      <div>
        <div style="background: ${cms.stormRunning ? '#0891b2' : '#334155'}; color: #ffffff; border-radius: 10px; padding: 10px 14px; margin-bottom: 8px; font-weight: 900; font-size: 0.98rem; text-align: center;">
          ${cms.stormRunning ? `🎯 ${curPuzzle.prompt}` : cms.stormFeedback || 'Tap "🚀 START 2-MIN STORM" on the left when your House is ready!'}
        </div>
        <div style="width: 100%; aspect-ratio: 1; display: grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(8, 1fr); border: 5px solid #0f172a; border-radius: 10px; overflow: hidden; opacity: ${cms.stormRunning ? '1' : '0.65'}; pointer-events: ${cms.stormRunning ? 'auto' : 'none'};">
          ${squaresHtml}
        </div>
      </div>
    </div>
  `;
}

// MODE 7: LIVE BOUNTY HUNTER BOARD
function renderBountyBoardMode(cms, chessState) {
  const players = chessState.players || [];
  const selectedId = cms.bountySelectedPlayerId || (players[0]?.id || '');
  const log = cms.bountyClaimsLog || [];

  return `
    ${renderSimpleThreeRulesStrip(
      'How the Live Bounty Board Works',
      'Leave this screen up on the TV while everyone plays chess around the room!',
      'Did you pull off one of the 8 tricks below? Walk up WITH YOUR OPPONENT as your witness!',
      'Pick your name in Step A, then tap the Bounty Card in Step B to claim instant House Points!',
      '#db2777',
    )}

    <!-- Step A: Pupil Name Picker -->
    <div style="background: #fdf2f8; border: 2.5px solid #ec4899; border-radius: 14px; padding: 14px 18px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
      <div style="font-size: 1.05rem; font-weight: 900; color: #831843;">
        👤 STEP A — Tap Your Name First:
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 7px; flex: 1; justify-content: flex-end;">
        ${players
          .map((p) => {
            const active = p.id === selectedId;
            const h = HOUSES[p.house];
            return `
            <button type="button" onclick="window.selectBountyPlayer('${p.id}')" style="background: ${active ? h?.color || '#db2777' : '#ffffff'}; color: ${active ? '#ffffff' : '#0f172a'}; border: 2px solid ${active ? '#0f172a' : '#cbd5e1'}; border-radius: 20px; padding: 7px 14px; font-size: 0.86rem; font-weight: 900; cursor: pointer;">
              ${active ? '✓ ' : ''}${p.name}
            </button>
          `;
          })
          .join('')}
      </div>
    </div>

    <!-- Step B: 8 Giant Touch Bounty Cards -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(245px, 1fr)); gap: 12px; margin-bottom: 16px;">
      ${CLUB_BOUNTIES.map(
        (b) => `
        <div style="background: #ffffff; border: 2px solid ${b.color}; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px; box-shadow: 0 3px 8px rgba(0,0,0,0.04);">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 1.9rem;">${b.icon}</span>
              <span style="background: ${b.color}; color: #ffffff; font-weight: 900; font-size: 0.82rem; padding: 3px 10px; border-radius: 20px;">
                +${b.pts} HOUSE PTS
              </span>
            </div>
            <div style="font-size: 1rem; font-weight: 900; color: #0f172a; margin-bottom: 4px;">${b.title}</div>
            <div style="font-size: 0.82rem; color: #475569; line-height: 1.35;">${b.desc}</div>
          </div>
          <button type="button" onclick="window.claimClubBounty('${b.id}')" style="background: ${b.color}; color: #ffffff; border: none; border-radius: 8px; padding: 11px; font-size: 0.88rem; font-weight: 900; cursor: pointer;">
            🎉 CLAIM +${b.pts} PTS!
          </button>
        </div>
      `,
      ).join('')}
    </div>

    ${
      log.length > 0
        ? `
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 12px 16px;">
        <div style="font-size: 0.78rem; font-weight: 900; color: #475569; text-transform: uppercase; margin-bottom: 6px;">
          🏅 Today’s Claimed Bounties (${log.length}):
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${log
            .slice(0, 12)
            .map(
              (item) => `
            <span style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 20px; padding: 4px 12px; font-size: 0.8rem; font-weight: 800; color: #0f172a;">
              ${item.icon} <strong>${item.playerName}</strong>: ${item.title} (+${item.pts} ${item.houseName})
            </span>
          `,
            )
            .join('')}
        </div>
      </div>
    `
        : ''
    }
  `;
}

// ============================================================================
// 8. MAIN EXPORTED RENDERER FOR CLUB GAME MODES TAB & FULL-SCREEN TV OVERLAY
// ============================================================================
export function renderClubGameModesView(chessState, helpers) {
  if (!chessState.clubModes) {
    chessState.clubModes = createDefaultClubModesState();
  }
  const cms = chessState.clubModes;
  const getShortName = helpers.getPlayerButtonShortName;

  const titles = {
    hub: ['7 Club Game Modes (Anti-Boredom Arcade!)', '🎮'],
    chaos: ['Chaos Wheel & Secret Chair-Swap Gong', '🎡'],
    bughouse: ['2v2 "Bughouse" Pass-the-Piece Arena', '🤝'],
    throne: ['Hold the Throne (Board 1 Boss Gauntlet)', '👑'],
    civilwar: ['House Civil War (Live Tug-of-War)', '⚔️'],
    relay: ['5-Second Touch-TV Relay Chess', '🏃‍♂️'],
    storm: ['House Puzzle Storm (2-Min TV Blitz)', '⚡'],
    bounties: ['Live Bounty Hunter Board', '🎯'],
  };
  const [title, icon] = titles[cms.activeMode] || titles.hub;

  let bodyHtml = '';
  if (cms.activeMode === 'chaos') bodyHtml = renderChaosWheelMode(cms, chessState, getShortName);
  else if (cms.activeMode === 'bughouse') bodyHtml = renderBughouseMode(cms);
  else if (cms.activeMode === 'throne') bodyHtml = renderHoldTheThroneMode(cms, chessState);
  else if (cms.activeMode === 'civilwar') bodyHtml = renderCivilWarMode(cms, getShortName);
  else if (cms.activeMode === 'relay') bodyHtml = renderRelayChessMode(cms);
  else if (cms.activeMode === 'storm') bodyHtml = renderPuzzleStormMode(cms);
  else if (cms.activeMode === 'bounties') bodyHtml = renderBountyBoardMode(cms, chessState);
  else bodyHtml = renderClubModesHub(cms);

  if (cms.tvFullscreen) {
    return `
      <div id="club-modes-tv-fullscreen" style="position: fixed; inset: 0; z-index: 99994; background: #f1f5f9; overflow-y: auto; -webkit-overflow-scrolling: touch; touch-action: pan-x pan-y; padding: 10px 20px 24px 20px; font-family: 'Outfit', sans-serif;">
        <div style="max-width: 1380px; margin: 0 auto;">
          ${renderModeTopBar(cms, chessState, title, icon, helpers.sortedHouses || [])}
          ${bodyHtml}
        </div>
      </div>
    `;
  }

  return `
    <div id="club-modes-tab-root">
      ${renderModeTopBar(cms, chessState, title, icon, helpers.sortedHouses || [])}
      ${bodyHtml}
    </div>
  `;
}

// ============================================================================
// 9. INTERACTIVE CONTROLLER WIRING (ATTACHED TO WINDOW)
// ============================================================================
export function registerClubGameModeHandlers(ctx) {
  if (typeof window === 'undefined') return;

  const getCms = () => {
    const st = ctx.getState();
    if (!st.clubModes) st.clubModes = createDefaultClubModesState();
    return st.clubModes;
  };

  const ensureClassroomTvUnlocked = () => {
    if (ctx.getState().userRole !== 'teacher') {
      ctx.showChessToast('🔒 Tap "Teacher" at top-right on the Classroom TV to unlock scoring!', 'warning');
      return false;
    }
    return true;
  };

  const awardHouseBonusMatch = (player, bonusPts, label) => {
    const st = ctx.getState();
    const canon = st.players.find((p) => p.id === player.id) || player;
    // Record bonus in matches array + bonusPoints field so calculateHouseTotals & calculatePlayerPoints credit it cleanly!
    canon.bonusPoints = (canon.bonusPoints || 0) + bonusPts;
    st.matches.unshift({
      id: 'club_bonus_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      date: 'Thursday Period 6 Club Mode',
      timestamp: Date.now(),
      round: label,
      white: canon.name,
      black: label,
      whiteId: canon.id,
      whiteHouse: canon.house,
      blackHouse: 'none',
      result: 'BONUS',
      bonusPoints: bonusPts,
      opening: label,
    });
    ctx.autoSortPlayersByPoints();
  };

  const getArrivedPool = () => {
    const st = ctx.getState();
    const checked = st.players.filter((p) => (st.checkedInPlayerIds || []).includes(p.id));
    if (checked.length >= 2) return [...checked];
    st.checkedInPlayerIds = st.players.map((p) => p.id);
    return [...st.players];
  };

  // Global 1-second ticker for Secret Chair-Swap Gong, Relay Shot Clock & Puzzle Storm!
  if (!window.__clubModesInterval) {
    window.__clubModesInterval = setInterval(() => {
      if (!ctx.isChessViewActive()) return;
      const st = ctx.getState();
      const cms = st.clubModes;
      if (!cms) return;

      // 1. Secret Chair-Swap Gong Check
      if (cms.gongArmed && cms.gongFireAt > 0 && Date.now() >= cms.gongFireAt) {
        cms.gongArmed = false;
        cms.gongFireAt = 0;
        cms.gongFiredBanner = true;
        playClubSound('gong');
        ctx.saveChessState();
        ctx.renderChessHubView();
        ctx.showChessToast('🚨 CHAIR-SWAP GONG!! Everyone swap chairs with your opponent!', 'warning');
      }

      // 2. Relay Chess Shot Clock
      if (
        cms.activeMode === 'relay' &&
        (st.activeTab === 'modes' || cms.tvFullscreen) &&
        cms.relayGame &&
        cms.relayGame.status === 'playing' &&
        cms.relayGame.shotLimit > 0
      ) {
        cms.relayGame.shotRemaining--;
        const el = document.getElementById('relay-shot-clock-readout');
        if (el) {
          el.textContent = `${Math.max(0, cms.relayGame.shotRemaining)}s`;
          el.style.color = cms.relayGame.shotRemaining <= 2 ? '#ef4444' : '#4ade80';
        }
        if (cms.relayGame.shotRemaining <= 2 && cms.relayGame.shotRemaining > 0) {
          playClubSound('tick');
        }
        if (cms.relayGame.shotRemaining <= 0) {
          const allMoves = getAllLegalMoves(cms.relayGame);
          if (allMoves.length > 0) {
            const rnd = allMoves[Math.floor(Math.random() * allMoves.length)];
            executeRelayMove(cms.relayGame, rnd, true);
            ctx.renderChessHubView();
          } else {
            cms.relayGame.status = 'paused';
            ctx.renderChessHubView();
          }
        }
      }

      // 3. Puzzle Storm Countdown
      if (
        cms.activeMode === 'storm' &&
        (st.activeTab === 'modes' || cms.tvFullscreen) &&
        cms.stormRunning
      ) {
        cms.stormTimeLeft = Math.max(0, (cms.stormTimeLeft || 0) - 1);
        const clk = document.getElementById('storm-clock-readout');
        if (clk) {
          const m = Math.floor(cms.stormTimeLeft / 60);
          const s = cms.stormTimeLeft % 60;
          clk.textContent = `${m}:${String(s).padStart(2, '0')}`;
          clk.style.color = cms.stormTimeLeft <= 15 ? '#ef4444' : '#4ade80';
        }
        if (cms.stormTimeLeft === 0) {
          window.finishPuzzleStormRun('⏰ TIME UP!');
        }
      }
    }, 1000);
  }

  window.selectClubGameMode = function (modeId) {
    const cms = getCms();
    cms.activeMode = modeId || 'hub';
    ctx.getState().activeTab = 'modes';
    ctx.saveChessState();
    ctx.renderChessHubView();
  };

  window.toggleClubModesFullscreen = function (force) {
    const cms = getCms();
    cms.tvFullscreen = typeof force === 'boolean' ? force : !cms.tvFullscreen;
    if (cms.tvFullscreen) {
      ctx.getState().activeTab = 'modes';
      if (document.documentElement?.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    ctx.renderChessHubView();
  };

  // --- MODE 1: CHAOS WHEEL ---
  window.spinChaosWheel = function () {
    const cms = getCms();
    if (cms.chaosSpinning) return;
    cms.chaosSpinning = true;
    cms.gongFiredBanner = false;
    ctx.renderChessHubView();

    let steps = 10 + Math.floor(Math.random() * 8);
    let idx = CHAOS_WHEEL_TWISTS.findIndex((t) => t.id === cms.chaosSelectedId);
    const spinStep = () => {
      idx = (idx + 1) % CHAOS_WHEEL_TWISTS.length;
      cms.chaosSelectedId = CHAOS_WHEEL_TWISTS[idx].id;
      playClubSound('tick');
      steps--;
      if (steps > 0) {
        setTimeout(spinStep, 95);
      } else {
        cms.chaosSpinning = false;
        playClubSound('win');
        ctx.saveChessState();
        ctx.renderChessHubView();
        const chosen = CHAOS_WHEEL_TWISTS[idx];
        ctx.showChessToast(`🎡 Chaos Rule: ${chosen.title}`, 'success');
      }
    };
    spinStep();
  };

  window.pickChaosTwist = function (id) {
    const cms = getCms();
    cms.chaosSelectedId = id;
    cms.gongFiredBanner = false;
    ctx.saveChessState();
    ctx.renderChessHubView();
  };

  window.toggleSecretChairSwapGong = function () {
    const cms = getCms();
    if (cms.gongArmed) {
      cms.gongArmed = false;
      cms.gongFireAt = 0;
      ctx.renderChessHubView();
      ctx.showChessToast('🔕 Secret Chair-Swap Gong cancelled.', 'info');
      return;
    }
    // Random hidden delay between 120s (2 mins) and 240s (4 mins)
    const delayMs = (120 + Math.floor(Math.random() * 120)) * 1000;
    cms.gongArmed = true;
    cms.gongFiredBanner = false;
    cms.gongFireAt = Date.now() + delayMs;
    ctx.renderChessHubView();
    ctx.showChessToast('🔔 Secret Chair-Swap Gong ARMED! Nobody knows when it will ring!', 'success');
  };

  window.triggerChaosGongNow = function () {
    const cms = getCms();
    cms.gongArmed = false;
    cms.gongFireAt = 0;
    cms.gongFiredBanner = true;
    playClubSound('gong');
    ctx.renderChessHubView();
  };

  window.dismissChaosGongBanner = function () {
    const cms = getCms();
    cms.gongFiredBanner = false;
    ctx.renderChessHubView();
  };

  window.pairChaosRoundBoards = function () {
    if (typeof window.generateThursdayPairings === 'function') {
      window.generateThursdayPairings(true);
      ctx.getState().activeTab = 'modes';
      ctx.renderChessHubView();
    }
  };

  // --- MODE 2: 2v2 BUGHOUSE ---
  window.generateBughouseTeams = function () {
    const pool = getArrivedPool().sort((a, b) => (b.rating || 1000) - (a.rating || 1000));
    if (pool.length < 4) {
      ctx.showChessToast('Need at least 4 pupils checked in for a 2v2 Bughouse table!', 'warning');
      return;
    }
    ctx.pushChessUndoSnapshot('Build 2v2 Bughouse Teams');
    const cms = getCms();

    // Balance: Pair highest with lowest!
    const numTeams = Math.floor(pool.length / 2);
    const usableCount = Math.floor(numTeams / 2) * 4;
    const extras = pool.slice(usableCount);
    const main = pool.slice(0, usableCount);

    const teams = [];
    let left = 0;
    let right = main.length - 1;
    while (left < right) {
      teams.push([main[left], main[right]]);
      left++;
      right--;
    }

    // Shuffle teams slightly so Table 1 isn't always the exact same 4 pupils
    for (let i = teams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [teams[i], teams[j]] = [teams[j], teams[i]];
    }

    const matches = [];
    for (let t = 0; t + 1 < teams.length; t += 2) {
      matches.push({
        id: `bug_${Date.now()}_${t}`,
        teamA: teams[t],
        teamB: teams[t + 1],
        winner: null,
      });
    }

    cms.bughouseMatches = matches;
    cms.bughouseExtraSingles = extras;
    ctx.saveChessState();
    ctx.renderChessHubView();
    ctx.showChessToast(`🤝 Created ${matches.length} balanced 2v2 Bughouse table(s)!`, 'success');
  };

  window.scoreBughouseMatch = function (matchId, winnerTeam) {
    if (!ensureClassroomTvUnlocked()) return;
    const cms = getCms();
    const m = (cms.bughouseMatches || []).find((x) => x.id === matchId);
    if (!m || m.winner) return;

    ctx.pushChessUndoSnapshot('2v2 Bughouse Result');
    m.winner = winnerTeam;

    if (winnerTeam === 'draw') {
      ctx.applyCanonicalPlayerMatchStats(m.teamA[0], m.teamB[0], 'draw', 0, 0);
      ctx.applyCanonicalPlayerMatchStats(m.teamA[1], m.teamB[1], 'draw', 0, 0);
      ctx.getState().matches.push(
        {
          id: 'bug_m1_' + Date.now(),
          date: 'Thursday Period 6 Bughouse',
          round: '2v2 Bughouse Table',
          white: m.teamA[0].name,
          black: m.teamB[0].name,
          whiteHouse: m.teamA[0].house,
          blackHouse: m.teamB[0].house,
          result: '½-½',
          opening: '2v2 Bughouse',
        },
        {
          id: 'bug_m2_' + Date.now(),
          date: 'Thursday Period 6 Bughouse',
          round: '2v2 Bughouse Table',
          white: m.teamB[1].name,
          black: m.teamA[1].name,
          whiteHouse: m.teamB[1].house,
          blackHouse: m.teamA[1].house,
          result: '½-½',
          opening: '2v2 Bughouse',
        },
      );
    } else {
      const winPair = winnerTeam === 'A' ? m.teamA : m.teamB;
      const losePair = winnerTeam === 'A' ? m.teamB : m.teamA;
      ctx.applyCanonicalPlayerMatchStats(winPair[0], losePair[0], 'p1', 10, 8);
      ctx.applyCanonicalPlayerMatchStats(winPair[1], losePair[1], 'p1', 10, 8);
      ctx.getState().matches.push(
        {
          id: 'bug_m1_' + Date.now(),
          date: 'Thursday Period 6 Bughouse',
          round: '2v2 Bughouse Table',
          white: winPair[0].name,
          black: losePair[0].name,
          whiteHouse: winPair[0].house,
          blackHouse: losePair[0].house,
          result: '1-0',
          opening: '2v2 Bughouse',
        },
        {
          id: 'bug_m2_' + Date.now(),
          date: 'Thursday Period 6 Bughouse',
          round: '2v2 Bughouse Table',
          white: winPair[1].name,
          black: losePair[1].name,
          whiteHouse: winPair[1].house,
          blackHouse: losePair[1].house,
          result: '1-0',
          opening: '2v2 Bughouse',
        },
      );
    }

    playClubSound('win');
    ctx.saveChessState();
    ctx.renderChessHubView();
    ctx.showChessToast('🏆 2v2 Bughouse points awarded to both teammates!', 'success');
  };

  // --- MODE 3: HOLD THE THRONE ---
  window.startHoldTheThrone = function (shuffleQueue = false) {
    const pool = getArrivedPool().sort((a, b) => (a.rank || 99) - (b.rank || 99));
    if (pool.length < 2) {
      ctx.showChessToast('Need at least 2 pupils for Hold the Throne!', 'warning');
      return;
    }
    ctx.pushChessUndoSnapshot('Start / Shuffle Hold the Throne');
    const cms = getCms();
    if (!cms.throneMonarchId || !pool.some((p) => p.id === cms.throneMonarchId)) {
      cms.throneMonarchId = pool[0].id;
      cms.throneStreak = 0;
    }
    let rest = pool.filter((p) => p.id !== cms.throneMonarchId).map((p) => p.id);
    if (shuffleQueue) {
      rest = rest.sort(() => 0.5 - Math.random());
    }
    cms.throneQueueIds = rest;
    ctx.saveChessState();
    ctx.renderChessHubView();
  };

  window.bumpChallengerToFront = function (playerId) {
    const cms = getCms();
    cms.throneQueueIds = [
      playerId,
      ...(cms.throneQueueIds || []).filter((id) => id !== playerId),
    ];
    ctx.saveChessState();
    ctx.renderChessHubView();
  };

  window.resolveThroneMatch = function (winnerRole) {
    if (!ensureClassroomTvUnlocked()) return;
    const st = ctx.getState();
    const cms = getCms();
    const monarch = st.players.find((p) => p.id === cms.throneMonarchId);
    const challengerId = cms.throneQueueIds?.[0];
    const challenger = st.players.find((p) => p.id === challengerId);
    if (!monarch || !challenger) return;

    ctx.pushChessUndoSnapshot(`Throne: ${monarch.name} vs ${challenger.name}`);

    const streakBefore = cms.throneStreak || 0;
    const extraBounty = streakBefore >= 4 ? 3 : streakBefore === 3 ? 2 : streakBefore === 2 ? 1 : 0;

    if (winnerRole === 'monarch') {
      ctx.applyCanonicalPlayerMatchStats(monarch, challenger, 'p1', 10, 6);
      st.matches.push({
        id: 'throne_' + Date.now(),
        date: 'Thursday Period 6 Throne',
        round: 'Hold the Throne',
        white: monarch.name,
        black: challenger.name,
        whiteHouse: monarch.house,
        blackHouse: challenger.house,
        result: '1-0',
        opening: 'Hold the Throne',
      });
      cms.throneStreak = streakBefore + 1;
      cms.throneQueueIds = [...cms.throneQueueIds.slice(1), challenger.id];
      playClubSound('win');
      ctx.showChessToast(
        `👑 ${monarch.name} holds The Throne! (Streak: ${cms.throneStreak})`,
        'success',
      );
    } else {
      ctx.applyCanonicalPlayerMatchStats(challenger, monarch, 'p1', 15, 8);
      st.matches.push({
        id: 'throne_' + Date.now(),
        date: 'Thursday Period 6 Throne',
        round: 'Dethroned Boss!',
        white: challenger.name,
        black: monarch.name,
        whiteHouse: challenger.house,
        blackHouse: monarch.house,
        result: '1-0',
        opening: 'Hold the Throne',
      });
      if (extraBounty > 0) {
        awardHouseBonusMatch(challenger, extraBounty, 'Giant-Slayer Throne Bounty');
      }
      cms.throneMonarchId = challenger.id;
      cms.throneStreak = 1;
      cms.throneQueueIds = [...cms.throneQueueIds.slice(1), monarch.id];
      playClubSound('bounty');
      ctx.showChessToast(
        `⚔️ NEW MONARCH! ${challenger.name} claims The Throne (+${3 + extraBounty} House pts)!`,
        'success',
      );
    }

    ctx.saveChessState();
    ctx.renderChessHubView();
  };

  // --- MODE 4: HOUSE CIVIL WAR ---
  window.rotateCivilWarAlliances = function () {
    const cms = getCms();
    const curA = JSON.stringify(cms.civilWarTeamA);
    if (curA.includes('dreadnought')) {
      cms.civilWarTeamA = ['victory', 'invincible'];
      cms.civilWarTeamB = ['warrior', 'dreadnought'];
    } else if (curA.includes('invincible')) {
      cms.civilWarTeamA = ['victory', 'warrior'];
      cms.civilWarTeamB = ['dreadnought', 'invincible'];
    } else {
      cms.civilWarTeamA = ['victory', 'dreadnought'];
      cms.civilWarTeamB = ['warrior', 'invincible'];
    }
    cms.civilWarBoards = [];
    ctx.saveChessState();
    ctx.renderChessHubView();
  };

  window.pairCivilWarBoards = function () {
    const cms = getCms();
    const pool = getArrivedPool();
    const sideA = pool
      .filter((p) => cms.civilWarTeamA.includes(p.house))
      .sort(() => 0.5 - Math.random());
    const sideB = pool
      .filter((p) => cms.civilWarTeamB.includes(p.house))
      .sort(() => 0.5 - Math.random());

    ctx.pushChessUndoSnapshot('Pair Civil War Clashes');
    const boards = [];
    while (sideA.length > 0 && sideB.length > 0) {
      boards.push({
        id: `cw_${Date.now()}_${boards.length}`,
        pA: sideA.shift(),
        pB: sideB.shift(),
        winner: null,
      });
    }
    // Pair any remaining players from the larger alliance so nobody sits out!
    const leftovers = [...sideA, ...sideB];
    while (leftovers.length >= 2) {
      boards.push({
        id: `cw_extra_${Date.now()}_${boards.length}`,
        pA: leftovers.shift(),
        pB: leftovers.shift(),
        winner: null,
      });
    }
    cms.civilWarBoards = boards;
    ctx.saveChessState();
    ctx.renderChessHubView();
    ctx.showChessToast(`⚔️ Paired ${boards.length} Civil War Clash board(s)!`, 'success');
  };

  window.scoreCivilWarBoard = function (boardId, outcome) {
    if (!ensureClassroomTvUnlocked()) return;
    const st = ctx.getState();
    const cms = getCms();
    const b = (cms.civilWarBoards || []).find((x) => x.id === boardId);
    if (!b || b.winner) return;

    ctx.pushChessUndoSnapshot(`Civil War: ${b.pA.name} vs ${b.pB.name}`);
    b.winner = outcome;

    if (outcome === 'A') {
      cms.civilWarScoreA = (cms.civilWarScoreA || 0) + 3;
      ctx.applyCanonicalPlayerMatchStats(b.pA, b.pB, 'p1', 12, 10);
      st.matches.push({
        id: 'cw_m_' + Date.now(),
        date: 'Thursday Period 6 Civil War',
        round: 'House Civil War',
        white: b.pA.name,
        black: b.pB.name,
        whiteHouse: b.pA.house,
        blackHouse: b.pB.house,
        result: '1-0',
        opening: 'Civil War Clash',
      });
    } else if (outcome === 'B') {
      cms.civilWarScoreB = (cms.civilWarScoreB || 0) + 3;
      ctx.applyCanonicalPlayerMatchStats(b.pA, b.pB, 'p2', 12, 10);
      st.matches.push({
        id: 'cw_m_' + Date.now(),
        date: 'Thursday Period 6 Civil War',
        round: 'House Civil War',
        white: b.pA.name,
        black: b.pB.name,
        whiteHouse: b.pA.house,
        blackHouse: b.pB.house,
        result: '0-1',
        opening: 'Civil War Clash',
      });
    } else {
      cms.civilWarScoreA = (cms.civilWarScoreA || 0) + 1;
      cms.civilWarScoreB = (cms.civilWarScoreB || 0) + 1;
      ctx.applyCanonicalPlayerMatchStats(b.pA, b.pB, 'draw', 0, 0);
      st.matches.push({
        id: 'cw_m_' + Date.now(),
        date: 'Thursday Period 6 Civil War',
        round: 'House Civil War',
        white: b.pA.name,
        black: b.pB.name,
        whiteHouse: b.pA.house,
        blackHouse: b.pB.house,
        result: '½-½',
        opening: 'Civil War Clash',
      });
    }

    playClubSound('win');
    ctx.saveChessState();
    ctx.renderChessHubView();
  };

  // --- MODE 5: 5-SECOND TOUCH-TV RELAY CHESS ---
  window.setRelayHouse = function (side, houseId) {
    const g = getCms().relayGame;
    if (side === 'w') g.whiteHouse = houseId;
    else g.blackHouse = houseId;
    ctx.saveChessState();
    ctx.renderChessHubView();
  };

  window.setRelayShotLimit = function (secs) {
    const g = getCms().relayGame;
    g.shotLimit = secs;
    g.shotRemaining = secs;
    ctx.saveChessState();
    ctx.renderChessHubView();
  };

  window.toggleRelayRunning = function () {
    const g = getCms().relayGame;
    if (g.status === 'playing') {
      g.status = 'paused';
      g.bannerMsg = '⏸ Relay Paused — Tap ▶ START RELAY CLOCK to continue!';
    } else if (g.status === 'ready' || g.status === 'paused') {
      g.status = 'playing';
      g.shotRemaining = g.shotLimit || 0;
      g.bannerMsg = `🔥 RELAY LIVE! ${g.turn === 'w' ? 'WHITE ♔' : 'BLACK ♚'} — Tap your move!`;
    }
    ctx.renderChessHubView();
  };

  window.handleRelaySquareTap = function (r, c) {
    const g = getCms().relayGame;
    if (g.status === 'checkmate' || g.status === 'stalemate' || g.status === 'awarded') return;

    const tappedPiece = g.board[r][c];
    const tappedSide = sideOfPiece(tappedPiece);

    if (g.selected) {
      const [sr, sc] = g.selected;
      if (sr === r && sc === c) {
        g.selected = null;
        ctx.renderChessHubView();
        return;
      }
      const legal = getLegalMovesForSquare(g, sr, sc);
      const chosen = legal.find((m) => m.toR === r && m.toC === c);
      if (chosen) {
        if (g.status === 'ready') g.status = 'playing';
        executeRelayMove(g, chosen, false);
        ctx.saveChessState();
        ctx.renderChessHubView();
        return;
      }
    }

    if (tappedSide === g.turn) {
      g.selected = [r, c];
      ctx.renderChessHubView();
    }
  };

  window.undoRelayMove = function () {
    const g = getCms().relayGame;
    if (!g.history || g.history.length === 0) return;
    const prev = g.history.pop();
    g.board = prev.board;
    g.turn = prev.turn;
    g.castling = prev.castling;
    g.enPassant = prev.enPassant;
    g.lastMove = prev.lastMove;
    g.moveCount = prev.moveCount;
    g.status = 'paused';
    g.winnerSide = null;
    g.selected = null;
    g.shotRemaining = g.shotLimit || 0;
    g.bannerMsg = '↩️ Move taken back! Tap ▶ START RELAY CLOCK when ready.';
    ctx.saveChessState();
    ctx.renderChessHubView();
  };

  window.resetRelayGame = function () {
    const cms = getCms();
    const prev = cms.relayGame || {};
    cms.relayGame = createInitialRelayGame(
      prev.whiteHouse || 'victory',
      prev.blackHouse || 'warrior',
      typeof prev.shotLimit === 'number' ? prev.shotLimit : 8,
    );
    ctx.saveChessState();
    ctx.renderChessHubView();
  };

  window.adjudicateRelayByMaterial = function () {
    const g = getCms().relayGame;
    const mat = computeMaterialScore(g.board);
    if (mat.w > mat.b) {
      g.status = 'checkmate';
      g.winnerSide = 'w';
      g.bannerMsg = `⚖️ White leads Material (${mat.w} to ${mat.b})! Tap "Award House Points" below!`;
    } else if (mat.b > mat.w) {
      g.status = 'checkmate';
      g.winnerSide = 'b';
      g.bannerMsg = `⚖️ Black leads Material (${mat.b} to ${mat.w})! Tap "Award House Points" below!`;
    } else {
      g.status = 'stalemate';
      g.winnerSide = 'draw';
      g.bannerMsg = `⚖️ Dead Even Material (${mat.w} each) — Relay Draw! Tap "Award House Points"!`;
    }
    playClubSound('win');
    ctx.renderChessHubView();
  };

  window.awardRelayWinnerPoints = function () {
    if (!ensureClassroomTvUnlocked()) return;
    const st = ctx.getState();
    const g = getCms().relayGame;
    if (g.status === 'awarded') return;

    ctx.pushChessUndoSnapshot('Award Relay Chess House Points');
    if (g.winnerSide === 'w' || g.winnerSide === 'b') {
      const winHouse = g.winnerSide === 'w' ? g.whiteHouse : g.blackHouse;
      st.matches.unshift({
        id: 'relay_win_' + Date.now(),
        date: 'Thursday Period 6 TV Relay',
        round: '5-Second TV Relay',
        white: `${HOUSES[winHouse]?.name || winHouse} Relay Squad`,
        black: 'TV Relay Victory',
        whiteHouse: winHouse,
        blackHouse: 'none',
        result: 'BONUS',
        bonusPoints: 5,
        opening: '5-Second Relay Chess',
      });
      ctx.showChessToast(`🏆 +5 House Points awarded to ${HOUSES[winHouse]?.name || winHouse}!`, 'success');
    } else {
      [g.whiteHouse, g.blackHouse].forEach((hId) => {
        st.matches.unshift({
          id: 'relay_draw_' + Date.now() + '_' + hId,
          date: 'Thursday Period 6 TV Relay',
          round: '5-Second TV Relay',
          white: `${HOUSES[hId]?.name || hId} Relay Squad`,
          black: 'TV Relay Draw',
          whiteHouse: hId,
          blackHouse: 'none',
          result: 'BONUS',
          bonusPoints: 2,
          opening: '5-Second Relay Chess',
        });
      });
      ctx.showChessToast('🤝 +2 House Points awarded to both Relay Houses!', 'info');
    }

    g.status = 'awarded';
    g.bannerMsg = '🎉 House Points Banked! Tap "🔄 New Game" for a rematch!';
    playClubSound('win');
    ctx.saveChessState();
    ctx.renderChessHubView();
  };

  // --- MODE 6: HOUSE PUZZLE STORM ---
  window.setStormHouse = function (houseId) {
    const cms = getCms();
    if (cms.stormRunning) return;
    cms.stormHouse = houseId;
    ctx.renderChessHubView();
  };

  window.startPuzzleStormRun = function () {
    const cms = getCms();
    const order = PUZZLE_STORM_DECK.map((_, idx) => idx).sort(() => 0.5 - Math.random());
    cms.stormDeckOrder = order;
    cms.stormDeckPos = 0;
    cms.stormBoard = cloneBoard(PUZZLE_STORM_DECK[order[0]].board);
    cms.stormSelected = null;
    cms.stormLives = 3;
    cms.stormScore = 0;
    cms.stormTimeLeft = 120;
    cms.stormRunning = true;
    cms.stormFeedback = '';
    playClubSound('move');
    ctx.renderChessHubView();
  };

  window.finishPuzzleStormRun = function (reason = 'Run Complete!') {
    const st = ctx.getState();
    const cms = getCms();
    if (!cms.stormRunning) return;
    cms.stormRunning = false;

    const hId = cms.stormHouse || 'victory';
    const hName = HOUSES[hId]?.name || hId;
    if (!cms.stormHighScores) cms.stormHighScores = {};
    if (cms.stormScore > (cms.stormHighScores[hId] || 0)) {
      cms.stormHighScores[hId] = cms.stormScore;
    }

    const housePtsEarned = Math.floor(cms.stormScore / 3);
    if (housePtsEarned > 0) {
      ctx.pushChessUndoSnapshot(`Puzzle Storm (+${housePtsEarned} ${hName})`);
      st.matches.unshift({
        id: 'storm_' + Date.now(),
        date: 'Thursday Period 6 Puzzle Storm',
        round: 'House Puzzle Storm',
        white: `${hName} Storm Squad (${cms.stormScore} solved)`,
        black: 'Puzzle Storm',
        whiteHouse: hId,
        blackHouse: 'none',
        result: 'BONUS',
        bonusPoints: housePtsEarned,
        opening: 'Puzzle Storm',
      });
    }

    cms.stormFeedback = `${reason} ${hName} solved ${cms.stormScore} puzzles${housePtsEarned > 0 ? ` → +${housePtsEarned} House Points Banked!` : '!'}`;
    playClubSound('win');
    ctx.saveChessState();
    ctx.renderChessHubView();
    ctx.showChessToast(cms.stormFeedback, 'success');
  };

  window.handleStormSquareTap = function (r, c) {
    const cms = getCms();
    if (!cms.stormRunning) return;
    const puz = PUZZLE_STORM_DECK[cms.stormDeckOrder[cms.stormDeckPos]];
    if (!puz) return;

    const ch = cms.stormBoard[r][c];
    const side = sideOfPiece(ch);

    if (!cms.stormSelected) {
      if (side === puz.side) {
        cms.stormSelected = [r, c];
        ctx.renderChessHubView();
      }
      return;
    }

    const [sr, sc] = cms.stormSelected;
    if (sr === r && sc === c) {
      cms.stormSelected = null;
      ctx.renderChessHubView();
      return;
    }
    if (side === puz.side) {
      cms.stormSelected = [r, c];
      ctx.renderChessHubView();
      return;
    }

    const matchFrom = puz.from[0] === sr && puz.from[1] === sc;
    const matchTo = puz.to.some(([tr, tc]) => tr === r && tc === c);

    if (matchFrom && matchTo) {
      cms.stormScore++;
      playClubSound('win');
      const nextPos = (cms.stormDeckPos + 1) % cms.stormDeckOrder.length;
      if (nextPos === 0) {
        cms.stormDeckOrder = PUZZLE_STORM_DECK.map((_, idx) => idx).sort(() => 0.5 - Math.random());
      }
      cms.stormDeckPos = nextPos;
      cms.stormBoard = cloneBoard(PUZZLE_STORM_DECK[cms.stormDeckOrder[cms.stormDeckPos]].board);
      cms.stormSelected = null;
      ctx.renderChessHubView();
    } else {
      cms.stormLives--;
      cms.stormSelected = null;
      playClubSound('wrong');
      if (cms.stormLives <= 0) {
        window.finishPuzzleStormRun('💥 3 STRIKES!');
      } else {
        ctx.showChessToast(`❌ Not quite! ${cms.stormLives} ❤️ left — look closely!`, 'warning');
        ctx.renderChessHubView();
      }
    }
  };

  // --- MODE 7: LIVE BOUNTY BOARD ---
  window.selectBountyPlayer = function (playerId) {
    const cms = getCms();
    cms.bountySelectedPlayerId = playerId;
    ctx.renderChessHubView();
  };

  window.claimClubBounty = function (bountyId) {
    if (!ensureClassroomTvUnlocked()) return;
    const st = ctx.getState();
    const cms = getCms();
    const pId = cms.bountySelectedPlayerId || st.players[0]?.id;
    const player = st.players.find((p) => p.id === pId);
    const bounty = CLUB_BOUNTIES.find((b) => b.id === bountyId);
    if (!player || !bounty) {
      ctx.showChessToast('Tap your name in Step A first!', 'warning');
      return;
    }

    ctx.pushChessUndoSnapshot(`Bounty: ${player.name} (${bounty.title})`);
    awardHouseBonusMatch(player, bounty.pts, `Bounty: ${bounty.title}`);

    const hName = HOUSES[player.house]?.name || player.house;
    if (!Array.isArray(cms.bountyClaimsLog)) cms.bountyClaimsLog = [];
    cms.bountyClaimsLog.unshift({
      id: 'bc_' + Date.now(),
      playerName: player.name,
      houseName: hName,
      title: bounty.title,
      icon: bounty.icon,
      pts: bounty.pts,
    });

    playClubSound('bounty');
    ctx.saveChessState();
    ctx.renderChessHubView();
    ctx.showChessToast(
      `🎉 BOUNTY CLAIMED! ${player.name} earned +${bounty.pts} pts for ${hName}!`,
      'success',
    );
  };
}
