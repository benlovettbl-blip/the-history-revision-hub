/**
 * The History Revision Hub — Chess Club Cloud Sync & Live Multiplayer API
 * Compatible with both Cloudflare Workers (env.CHESS_SYNC_KV) and Cloudflare Pages Functions.
 *
 * Capabilities:
 * 1. Live 2-Device Pupil-vs-Pupil Online Duels (`duel_create`, `duel_join`, `duel_poll`, `duel_move`, `duel_react`)
 *    — Strictly Callsign-only, whitelisted preset reactions, zero free-text chat, 24h KV TTL.
 * 2. Automated Club Highlights Feed (`post_highlight`) — Strictly server-templated events (zero free text).
 * 3. Historical Bot Rankings & Conquest Ledger (`record_bot_result`).
 * 4. Pupil Join Requests (`join_request`) & Practice XP / Bonus House Point Claims (`xp_claim`).
 * 5. Teacher-Authenticated Live Ladder Broadcast & Inbox Management.
 */

const memoryFallbackMap = new Map();
const SALT_PREFIX = 'hrh_staff_v1:';
const DEFAULT_STAFF_DIGESTS = [
  'cea62bd46e50344eeec9cca02019041921107f17ed1d4f269c5d50cd247d93c8',
];

const ALLOWED_JOIN_CALLSIGNS = new Set([
  'Florence Nightingale',
  'John Snow',
  'Robert Koch',
  'Louis Pasteur',
  'Edward Jenner',
  'Mary Seacole',
  'James Simpson',
  'Aneurin Bevan',
  'Francis Walsingham',
  'Sir Walter Raleigh',
  'Lord Burghley',
  'Robert Dudley',
  'The Enigma Codebreaker',
  'The Berlin Airlift',
  'The Iron Curtain',
  'The Marshall Planner',
  'The Prague Spring',
  'Dietrich Bonhoeffer',
  'Rosa Parks',
  'The Little Rock Nine',
  'The Freedom Rider',
  'Admiral Nelson',
  'The Duke of Wellington',
  'William Marshal',
  'Eleanor of Aquitaine',
  'The Domesday Commissioner',
  'The Silk Road Envoy',
  'The House of Wisdom',
  'The Bletchley Park Analyst',
  'The Western Front Sapper',
]);

const ALLOWED_HOUSES = new Set(['victory', 'warrior', 'dreadnought', 'invincible']);
const ALLOWED_BOT_IDS = new Set([
  'henry_viii',
  'boudicca',
  'elizabeth_i',
  'napoleon',
  'eleanor',
  'turing',
]);
const BOT_BASE_ELO = {
  henry_viii: 450,
  boudicca: 700,
  elizabeth_i: 950,
  napoleon: 1200,
  eleanor: 1450,
  turing: 1700,
};
const ALLOWED_REACTIONS = new Set([
  '🤝 Good luck!',
  '👏 Nice move!',
  '🤔 Thinking...',
  '😮 Great tactic!',
  '🤝 Good game!',
]);
const ALLOWED_HIGHLIGHT_TYPES = new Set([
  'bot_conquest',
  'high_accuracy',
  'online_duel',
  'daily_puzzle',
  'house_milestone',
]);

const DAILY_CLOUD_XP_CAP = 150;

function sanitizeLabel(str, maxLen = 48) {
  return String(str || '')
    .replace(/[<>"'`]/g, '')
    .trim()
    .slice(0, maxLen);
}

async function computeDigest(rawKey) {
  const input = SALT_PREFIX + String(rawKey || '').trim().toLowerCase();
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function getAllowedDigestsFromEnv(env) {
  const envPasskey = (env && (env.CHESS_TEACHER_PASSKEY || env.STAFF_PASSKEY)) || '';
  if (String(envPasskey).trim()) {
    const parts = String(envPasskey)
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    return Promise.all(
      parts.map((k) => (/^[a-f0-9]{64}$/i.test(k) ? k.toLowerCase() : computeDigest(k))),
    );
  }
  return DEFAULT_STAFF_DIGESTS;
}

async function isAuthorizedHeader(rawHeader, env) {
  const trimmed = String(rawHeader || '').trim();
  if (!trimmed) return false;
  const allowed = await getAllowedDigestsFromEnv(env);
  const candidateDigest = trimmed.toLowerCase().startsWith('digest:')
    ? trimmed.slice(7).trim().toLowerCase()
    : await computeDigest(trimmed);
  return allowed.includes(candidateDigest);
}

function resolveAllowedOrigin(originHeader) {
  const origin = String(originHeader || '').trim();
  if (!origin) return 'https://historyrevisionhub.co.uk';
  if (
    origin === 'https://historyrevisionhub.co.uk' ||
    origin === 'https://www.historyrevisionhub.co.uk' ||
    origin === 'https://historyrevisionhub.com' ||
    /^https:\/\/[a-z0-9.-]*the-history-revision-hub\.pages\.dev$/i.test(origin) ||
    /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)
  ) {
    return origin;
  }
  return 'https://historyrevisionhub.co.uk';
}

function buildSecurityHeaders(originHeader) {
  return {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    Pragma: 'no-cache',
    Expires: '0',
    'Surrogate-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
    'Access-Control-Allow-Origin': resolveAllowedOrigin(originHeader),
    Vary: 'Origin',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-teacher-passkey',
  };
}

function slugifyRoom(rawRoom) {
  return String(rawRoom || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48);
}

function scopedKey(prefix, rawRoom) {
  const slug = slugifyRoom(rawRoom);
  return slug ? `${prefix}__${slug}` : prefix;
}

function normalizeDuelCode(rawCode) {
  const clean = String(rawCode || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '');
  if (!/^[A-Z]{4,8}-\d{2,3}$/.test(clean)) return '';
  return clean;
}

function getKvStore(env) {
  if (!env) return null;
  if (env.CHESS_SYNC_KV && typeof env.CHESS_SYNC_KV.get === 'function') return env.CHESS_SYNC_KV;
  if (env.CHESS_KV && typeof env.CHESS_KV.get === 'function') return env.CHESS_KV;
  return null;
}

async function readStoreOrMemory(kv, key, fallbackVal) {
  let val = memoryFallbackMap.get(key) ?? fallbackVal;
  if (kv) {
    try {
      const kvVal = await kv.get(key, { type: 'json' });
      if (kvVal !== null && kvVal !== undefined) val = kvVal;
    } catch {
      // Fallback to memory
    }
  }
  return val;
}

async function writeStoreAndMemory(kv, key, value, ttlSeconds = 0) {
  memoryFallbackMap.set(key, value);
  if (kv) {
    try {
      const opts = ttlSeconds > 0 ? { expirationTtl: ttlSeconds } : undefined;
      await kv.put(key, JSON.stringify(value), opts);
    } catch {
      // Preserve in memory
    }
  }
}

function createInitialDuelBoard() {
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

export async function handleChessSyncRequest(request, env) {
  const secHeaders = buildSecurityHeaders(request.headers.get('origin'));
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: secHeaders });
  }

  const urlObj = new URL(request.url);
  const roomParam = urlObj.searchParams.get('room') || urlObj.searchParams.get('school') || '';
  const actionParam = urlObj.searchParams.get('action') || '';
  const kv = getKvStore(env);

  const blobKey = scopedKey('live_session', roomParam);
  const xpBlobKey = scopedKey('xp_inbox', roomParam);
  const joinBlobKey = scopedKey('join_inbox', roomParam);
  const feedBlobKey = scopedKey('club_feed', roomParam);
  const botBlobKey = scopedKey('bot_stats', roomParam);

  if (request.method === 'GET') {
    // Fast-path polling for a Live 2-Device Online Duel Room
    if (actionParam === 'duel_poll') {
      const duelCode = normalizeDuelCode(urlObj.searchParams.get('roomCode'));
      if (!duelCode) {
        return new Response(JSON.stringify({ ok: false, error: 'Invalid duel room code' }), {
          status: 400,
          headers: secHeaders,
        });
      }
      const duelKey = scopedKey(`duel_room_${duelCode}`, roomParam);
      const room = await readStoreOrMemory(kv, duelKey, null);
      if (!room) {
        return new Response(JSON.stringify({ ok: false, error: 'Room not found or expired' }), {
          status: 404,
          headers: secHeaders,
        });
      }
      return new Response(JSON.stringify({ ok: true, room }), {
        status: 200,
        headers: secHeaders,
      });
    }

    const [data, xpInbox, joinInbox, feedBox, botBox] = await Promise.all([
      readStoreOrMemory(kv, blobKey, null),
      readStoreOrMemory(kv, xpBlobKey, { claims: [], dailyTotals: {} }),
      readStoreOrMemory(kv, joinBlobKey, { requests: [] }),
      readStoreOrMemory(kv, feedBlobKey, { items: [] }),
      readStoreOrMemory(kv, botBlobKey, { bots: {} }),
    ]);

    if (data && Array.isArray(data.players)) {
      data.players.forEach((p) => {
        delete p.year;
      });
    }

    const pendingXpClaims = Array.isArray(xpInbox?.claims) ? xpInbox.claims : [];
    const pendingJoinRequests = Array.isArray(joinInbox?.requests) ? joinInbox.requests : [];
    const clubFeed = Array.isArray(feedBox?.items) ? feedBox.items : [];
    const botStats = botBox?.bots && typeof botBox.bots === 'object' ? botBox.bots : {};

    if (actionParam === 'xp_claims') {
      return new Response(
        JSON.stringify({
          claims: pendingXpClaims,
          joinRequests: pendingJoinRequests,
          clubFeed,
          botStats,
        }),
        { status: 200, headers: secHeaders },
      );
    }

    const merged = data
      ? { ...data, pendingXpClaims, pendingJoinRequests, clubFeed, botStats, kvReady: Boolean(kv) }
      : {
          syncedAt: 0,
          pendingXpClaims,
          pendingJoinRequests,
          clubFeed,
          botStats,
          kvReady: Boolean(kv),
        };

    return new Response(JSON.stringify(merged), { status: 200, headers: secHeaders });
  }

  if (request.method === 'POST') {
    let parsedPayload = {};
    try {
      parsedPayload = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: secHeaders,
      });
    }

    const effectiveAction = String(actionParam || parsedPayload?.action || '').trim();

    // =========================================================================
    // A. LIVE 2-PUPIL ONLINE DUELS (Zero Free-Text Chat, 24h KV TTL)
    // =========================================================================
    if (effectiveAction === 'duel_create') {
      const duelCode = normalizeDuelCode(parsedPayload.roomCode);
      const hostPlayerId = sanitizeLabel(parsedPayload.hostPlayerId, 32);
      const hostCallsign = sanitizeLabel(parsedPayload.hostCallsign, 48) || 'White Challenger';
      const hostHouse = ALLOWED_HOUSES.has(String(parsedPayload.hostHouse || '').toLowerCase())
        ? String(parsedPayload.hostHouse).toLowerCase()
        : 'warrior';
      const hostSide = parsedPayload.hostSide === 'b' ? 'b' : 'w';
      const timeControlMins = [0, 3, 5, 10].includes(Number(parsedPayload.timeControlMins))
        ? Number(parsedPayload.timeControlMins)
        : 5;

      if (!duelCode) {
        return new Response(JSON.stringify({ error: 'Invalid room code format' }), {
          status: 400,
          headers: secHeaders,
        });
      }

      const hostSeat = {
        playerId: hostPlayerId,
        callsign: hostCallsign,
        house: hostHouse,
        joinedAt: Date.now(),
      };

      const room = {
        roomCode: duelCode,
        seq: 1,
        status: 'waiting', // 'waiting' | 'playing' | 'checkmate' | ...
        winner: null,
        white: hostSide === 'w' ? hostSeat : null,
        black: hostSide === 'b' ? hostSeat : null,
        board: createInitialDuelBoard(),
        turn: 'w',
        castling: { K: true, Q: true, k: true, q: true },
        enPassant: null,
        halfMoveClock: 0,
        fullMoveNumber: 1,
        lastMove: null,
        moveLog: [],
        capturedByWhite: [],
        capturedByBlack: [],
        timeControlMins,
        whiteTimeSecs: timeControlMins * 60,
        blackTimeSecs: timeControlMins * 60,
        lastReaction: null,
        drawOfferBy: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const duelKey = scopedKey(`duel_room_${duelCode}`, roomParam);
      await writeStoreAndMemory(kv, duelKey, room, 86400);
      return new Response(JSON.stringify({ ok: true, room }), {
        status: 200,
        headers: secHeaders,
      });
    }

    if (effectiveAction === 'duel_join') {
      const duelCode = normalizeDuelCode(parsedPayload.roomCode);
      const guestPlayerId = sanitizeLabel(parsedPayload.guestPlayerId, 32);
      const guestCallsign = sanitizeLabel(parsedPayload.guestCallsign, 48) || 'Black Challenger';
      const guestHouse = ALLOWED_HOUSES.has(String(parsedPayload.guestHouse || '').toLowerCase())
        ? String(parsedPayload.guestHouse).toLowerCase()
        : 'invincible';

      if (!duelCode) {
        return new Response(JSON.stringify({ error: 'Please enter a valid Room Code (e.g. ROOK-42).' }), {
          status: 400,
          headers: secHeaders,
        });
      }

      const duelKey = scopedKey(`duel_room_${duelCode}`, roomParam);
      const room = await readStoreOrMemory(kv, duelKey, null);
      if (!room) {
        return new Response(
          JSON.stringify({ error: `Room ${duelCode} was not found. Check the code with your opponent!` }),
          { status: 404, headers: secHeaders },
        );
      }

      // Allow seamless reconnect after laptop restart OR switching to a spare classroom laptop with same Callsign!
      const isNamedCallsign =
        guestCallsign &&
        !['White Challenger', 'Black Challenger', 'Guest Challenger'].includes(guestCallsign);
      if (
        (guestPlayerId && room.white?.playerId === guestPlayerId) ||
        (isNamedCallsign &&
          String(room.white?.callsign || '').toLowerCase() === guestCallsign.toLowerCase())
      ) {
        return new Response(JSON.stringify({ ok: true, room, assignedSide: 'w' }), {
          status: 200,
          headers: secHeaders,
        });
      }
      if (
        (guestPlayerId && room.black?.playerId === guestPlayerId) ||
        (isNamedCallsign &&
          String(room.black?.callsign || '').toLowerCase() === guestCallsign.toLowerCase())
      ) {
        return new Response(JSON.stringify({ ok: true, room, assignedSide: 'b' }), {
          status: 200,
          headers: secHeaders,
        });
      }

      if (room.white && room.black) {
        return new Response(
          JSON.stringify({ error: `Room ${duelCode} already has 2 players!` }),
          { status: 409, headers: secHeaders },
        );
      }

      const existingCallsign = (room.white?.callsign || room.black?.callsign || '').toLowerCase();
      if (
        existingCallsign &&
        existingCallsign === guestCallsign.toLowerCase() &&
        guestCallsign !== 'Guest Challenger'
      ) {
        return new Response(
          JSON.stringify({
            error: 'Both devices have the same Callsign selected! Please select your own Callsign first.',
          }),
          { status: 409, headers: secHeaders },
        );
      }

      const guestSeat = {
        playerId: guestPlayerId,
        callsign: guestCallsign,
        house: guestHouse,
        joinedAt: Date.now(),
      };

      let assignedSide = 'b';
      if (!room.white) {
        room.white = guestSeat;
        assignedSide = 'w';
      } else {
        room.black = guestSeat;
        assignedSide = 'b';
      }
      room.status = 'playing';
      room.seq = (room.seq || 1) + 1;
      room.startedAt = Date.now();
      room.updatedAt = Date.now();

      await writeStoreAndMemory(kv, duelKey, room, 86400);
      return new Response(JSON.stringify({ ok: true, room, assignedSide }), {
        status: 200,
        headers: secHeaders,
      });
    }

    if (effectiveAction === 'duel_move') {
      const duelCode = normalizeDuelCode(parsedPayload.roomCode);
      if (!duelCode) {
        return new Response(JSON.stringify({ error: 'Invalid room code' }), {
          status: 400,
          headers: secHeaders,
        });
      }
      const duelKey = scopedKey(`duel_room_${duelCode}`, roomParam);
      const room = await readStoreOrMemory(kv, duelKey, null);
      if (!room) {
        return new Response(JSON.stringify({ error: 'Room expired' }), {
          status: 404,
          headers: secHeaders,
        });
      }

      if (
        typeof parsedPayload.expectedSeq === 'number' &&
        parsedPayload.expectedSeq !== room.seq
      ) {
        return new Response(JSON.stringify({ ok: false, conflict: true, room }), {
          status: 409,
          headers: secHeaders,
        });
      }

      if (Array.isArray(parsedPayload.board) && parsedPayload.board.length === 8) {
        room.board = parsedPayload.board;
      }
      if (parsedPayload.turn === 'w' || parsedPayload.turn === 'b') {
        room.turn = parsedPayload.turn;
      }
      if (parsedPayload.castling && typeof parsedPayload.castling === 'object') {
        room.castling = parsedPayload.castling;
      }
      room.enPassant = Array.isArray(parsedPayload.enPassant) ? parsedPayload.enPassant : null;
      if (typeof parsedPayload.halfMoveClock === 'number') {
        room.halfMoveClock = parsedPayload.halfMoveClock;
      }
      if (typeof parsedPayload.fullMoveNumber === 'number') {
        room.fullMoveNumber = parsedPayload.fullMoveNumber;
      }
      room.lastMove = parsedPayload.lastMove || null;
      if (Array.isArray(parsedPayload.moveLog)) {
        room.moveLog = parsedPayload.moveLog.slice(0, 400);
      }
      if (Array.isArray(parsedPayload.capturedByWhite)) {
        room.capturedByWhite = parsedPayload.capturedByWhite.slice(0, 32);
      }
      if (Array.isArray(parsedPayload.capturedByBlack)) {
        room.capturedByBlack = parsedPayload.capturedByBlack.slice(0, 32);
      }
      if (typeof parsedPayload.whiteTimeSecs === 'number') {
        room.whiteTimeSecs = Math.max(0, Math.floor(parsedPayload.whiteTimeSecs));
      }
      if (typeof parsedPayload.blackTimeSecs === 'number') {
        room.blackTimeSecs = Math.max(0, Math.floor(parsedPayload.blackTimeSecs));
      }
      if (typeof parsedPayload.status === 'string') {
        room.status = sanitizeLabel(parsedPayload.status, 24);
      }
      if (parsedPayload.winner === 'w' || parsedPayload.winner === 'b' || parsedPayload.winner === 'draw') {
        room.winner = parsedPayload.winner;
      }
      if ('drawOfferBy' in parsedPayload) {
        room.drawOfferBy =
          parsedPayload.drawOfferBy === 'w' || parsedPayload.drawOfferBy === 'b'
            ? parsedPayload.drawOfferBy
            : null;
      }

      room.seq = (room.seq || 1) + 1;
      room.updatedAt = Date.now();
      await writeStoreAndMemory(kv, duelKey, room, 86400);
      return new Response(JSON.stringify({ ok: true, room }), {
        status: 200,
        headers: secHeaders,
      });
    }

    if (effectiveAction === 'duel_react') {
      const duelCode = normalizeDuelCode(parsedPayload.roomCode);
      const text = String(parsedPayload.text || '').trim();
      const side = parsedPayload.side === 'b' ? 'b' : 'w';
      if (!duelCode || !ALLOWED_REACTIONS.has(text)) {
        return new Response(JSON.stringify({ error: 'Invalid preset reaction' }), {
          status: 400,
          headers: secHeaders,
        });
      }
      const duelKey = scopedKey(`duel_room_${duelCode}`, roomParam);
      const room = await readStoreOrMemory(kv, duelKey, null);
      if (!room) {
        return new Response(JSON.stringify({ error: 'Room not found' }), {
          status: 404,
          headers: secHeaders,
        });
      }
      room.lastReaction = {
        side,
        callsign: side === 'w' ? room.white?.callsign || 'White' : room.black?.callsign || 'Black',
        text,
        at: Date.now(),
      };
      room.seq = (room.seq || 1) + 1;
      await writeStoreAndMemory(kv, duelKey, room, 86400);
      return new Response(JSON.stringify({ ok: true, room }), {
        status: 200,
        headers: secHeaders,
      });
    }

    // =========================================================================
    // B. AUTOMATED CLUB HIGHLIGHTS FEED (Strictly Structured Events, Zero Free Text)
    // =========================================================================
    if (effectiveAction === 'post_highlight') {
      const type = String(parsedPayload.type || '').trim();
      const callsign = sanitizeLabel(parsedPayload.callsign, 48);
      const house = ALLOWED_HOUSES.has(String(parsedPayload.house || '').toLowerCase())
        ? String(parsedPayload.house).toLowerCase()
        : 'warrior';

      if (!ALLOWED_HIGHLIGHT_TYPES.has(type) || !callsign) {
        return new Response(JSON.stringify({ error: 'Invalid highlight event' }), {
          status: 400,
          headers: secHeaders,
        });
      }

      const eventId = sanitizeLabel(parsedPayload.eventId || `hl_${Date.now()}`, 64);
      const feedBox = await readStoreOrMemory(kv, feedBlobKey, { items: [] });
      const items = Array.isArray(feedBox?.items) ? feedBox.items : [];
      if (items.some((x) => x.eventId === eventId)) {
        return new Response(JSON.stringify({ ok: true, duplicate: true }), {
          status: 200,
          headers: secHeaders,
        });
      }

      const cleanItem = {
        eventId,
        type,
        callsign,
        house,
        botId: ALLOWED_BOT_IDS.has(parsedPayload.botId) ? parsedPayload.botId : null,
        opponentCallsign: sanitizeLabel(parsedPayload.opponentCallsign, 48) || null,
        opponentHouse: ALLOWED_HOUSES.has(String(parsedPayload.opponentHouse || '').toLowerCase())
          ? String(parsedPayload.opponentHouse).toLowerCase()
          : null,
        accuracyPct:
          typeof parsedPayload.accuracyPct === 'number'
            ? Math.max(0, Math.min(100, Math.round(parsedPayload.accuracyPct)))
            : null,
        xp:
          typeof parsedPayload.xp === 'number'
            ? Math.max(0, Math.min(150, Math.round(parsedPayload.xp)))
            : 0,
        bonusHousePts:
          typeof parsedPayload.bonusHousePts === 'number'
            ? Math.max(0, Math.min(3, Math.round(parsedPayload.bonusHousePts)))
            : 0,
        moves:
          typeof parsedPayload.moves === 'number'
            ? Math.max(0, Math.min(400, Math.round(parsedPayload.moves)))
            : 0,
        streak:
          typeof parsedPayload.streak === 'number'
            ? Math.max(0, Math.min(365, Math.round(parsedPayload.streak)))
            : 0,
        roomCode: normalizeDuelCode(parsedPayload.roomCode) || null,
        createdAt: Date.now(),
      };

      items.unshift(cleanItem);
      await writeStoreAndMemory(kv, feedBlobKey, { items: items.slice(0, 60) });
      return new Response(JSON.stringify({ ok: true, item: cleanItem }), {
        status: 200,
        headers: secHeaders,
      });
    }

    // =========================================================================
    // C. HISTORICAL BOT RANKINGS & CONQUEST TRACKER
    // =========================================================================
    if (effectiveAction === 'record_bot_result') {
      const botId = String(parsedPayload.botId || '').trim();
      const outcome = String(parsedPayload.outcome || '').trim(); // 'pupil_win' | 'bot_win' | 'draw'
      const moves = Math.max(0, Math.min(400, Math.floor(Number(parsedPayload.moves) || 0)));
      const playerId = sanitizeLabel(parsedPayload.playerId, 32);
      const callsign = sanitizeLabel(parsedPayload.callsign, 48);
      const house = ALLOWED_HOUSES.has(String(parsedPayload.house || '').toLowerCase())
        ? String(parsedPayload.house).toLowerCase()
        : 'warrior';
      const accuracyPct =
        typeof parsedPayload.accuracyPct === 'number'
          ? Math.max(0, Math.min(100, Math.round(parsedPayload.accuracyPct)))
          : null;

      if (
        !ALLOWED_BOT_IDS.has(botId) ||
        !['pupil_win', 'bot_win', 'draw'].includes(outcome) ||
        moves < 6
      ) {
        return new Response(JSON.stringify({ error: 'Invalid bot result payload' }), {
          status: 400,
          headers: secHeaders,
        });
      }

      const botBox = await readStoreOrMemory(kv, botBlobKey, { bots: {} });
      const bots = botBox?.bots && typeof botBox.bots === 'object' ? botBox.bots : {};
      const baseElo = BOT_BASE_ELO[botId] || 1000;
      const entry = bots[botId] || {
        botId,
        liveElo: baseElo,
        games: 0,
        botWins: 0,
        pupilWins: 0,
        draws: 0,
        conqueredBy: [],
      };

      entry.games = (entry.games || 0) + 1;
      if (outcome === 'pupil_win') {
        entry.pupilWins = (entry.pupilWins || 0) + 1;
        entry.liveElo = Math.max(baseElo - 120, (entry.liveElo || baseElo) - 8);
        if (callsign) {
          const list = Array.isArray(entry.conqueredBy) ? entry.conqueredBy : [];
          const existing = list.find(
            (x) =>
              (playerId && x.playerId === playerId) ||
              x.callsign?.toLowerCase() === callsign.toLowerCase(),
          );
          if (existing) {
            existing.wins = (existing.wins || 1) + 1;
            if (accuracyPct && accuracyPct > (existing.bestAccuracy || 0)) {
              existing.bestAccuracy = accuracyPct;
            }
          } else {
            list.push({
              playerId,
              callsign,
              house,
              wins: 1,
              bestAccuracy: accuracyPct || null,
              firstConqueredAt: Date.now(),
            });
          }
          entry.conqueredBy = list.slice(-50);
        }
      } else if (outcome === 'bot_win') {
        entry.botWins = (entry.botWins || 0) + 1;
        entry.liveElo = Math.min(baseElo + 160, (entry.liveElo || baseElo) + 6);
      } else {
        entry.draws = (entry.draws || 0) + 1;
      }

      bots[botId] = entry;
      await writeStoreAndMemory(kv, botBlobKey, { bots });
      return new Response(JSON.stringify({ ok: true, botStats: bots }), {
        status: 200,
        headers: secHeaders,
      });
    }

    // =========================================================================
    // D. PUPIL JOIN REQUESTS & PRACTICE XP / BONUS HOUSE POINT CLAIMS
    // =========================================================================
    if (effectiveAction === 'join_request') {
      const callsign = String(parsedPayload.callsign || '').trim();
      const house = String(parsedPayload.house || '').trim().toLowerCase();
      const acknowledgedRules = Boolean(parsedPayload.acknowledgedRules);
      const requestId = String(parsedPayload.requestId || `join_${Date.now()}`).slice(0, 64);

      if (!ALLOWED_JOIN_CALLSIGNS.has(callsign) || !ALLOWED_HOUSES.has(house) || !acknowledgedRules) {
        return new Response(
          JSON.stringify({
            error: 'Please choose an approved Callsign, House, and confirm both rules.',
          }),
          { status: 400, headers: secHeaders },
        );
      }

      const liveData = await readStoreOrMemory(kv, blobKey, null);
      const takenOnLadder =
        liveData &&
        Array.isArray(liveData.players) &&
        liveData.players.some(
          (p) => String(p.name || '').toLowerCase() === callsign.toLowerCase(),
        );
      if (takenOnLadder) {
        return new Response(
          JSON.stringify({
            error: 'That Callsign is already on the Club Ladder. Please choose another!',
          }),
          { status: 409, headers: secHeaders },
        );
      }

      const joinInbox = await readStoreOrMemory(kv, joinBlobKey, { requests: [] });
      const requests = Array.isArray(joinInbox?.requests) ? joinInbox.requests : [];
      if (requests.some((r) => String(r.callsign || '').toLowerCase() === callsign.toLowerCase())) {
        return new Response(
          JSON.stringify({
            error: 'That Callsign is already pending teacher approval. Please choose another!',
          }),
          { status: 409, headers: secHeaders },
        );
      }

      requests.push({
        requestId,
        callsign,
        house,
        createdAt: Date.now(),
      });

      await writeStoreAndMemory(kv, joinBlobKey, { requests: requests.slice(-60) });
      return new Response(
        JSON.stringify({ success: true, callsign, house, persistent: Boolean(kv) }),
        { status: 200, headers: secHeaders },
      );
    }

    if (effectiveAction === 'xp_claim') {
      const playerId = String(parsedPayload.playerId || '').trim();
      const callsign = sanitizeLabel(parsedPayload.callsign, 48);
      const house = String(parsedPayload.house || '')
        .trim()
        .toLowerCase()
        .slice(0, 20);
      const source = ['ai', 'online_duel', 'daily_puzzle'].includes(parsedPayload.source)
        ? parsedPayload.source
        : 'ai';
      const level = sanitizeLabel(parsedPayload.level || 'elizabeth_i', 24);
      const outcome = ['win', 'draw', 'effort', 'solved'].includes(parsedPayload.outcome)
        ? parsedPayload.outcome
        : 'effort';
      const moves = Math.max(0, Math.min(400, Math.floor(Number(parsedPayload.moves) || 0)));
      const rawXp = Math.max(5, Math.min(85, Math.floor(Number(parsedPayload.xp) || 0)));
      const bonusHousePts =
        source === 'online_duel' && moves >= 10
          ? Math.max(0, Math.min(1, Math.floor(Number(parsedPayload.bonusHousePts) || 0)))
          : 0;
      const accuracyPct =
        typeof parsedPayload.accuracyPct === 'number'
          ? Math.max(0, Math.min(100, Math.round(parsedPayload.accuracyPct)))
          : null;
      const botConquered = ALLOWED_BOT_IDS.has(parsedPayload.botConquered)
        ? parsedPayload.botConquered
        : null;
      const opponentCallsign = sanitizeLabel(parsedPayload.opponentCallsign, 48) || null;
      const claimId = String(parsedPayload.claimId || `xp_${Date.now()}`).slice(0, 64);

      const minMoves = source === 'daily_puzzle' ? 1 : 6;
      if (!/^p_\d{4,20}$/.test(playerId) || !callsign || moves < minMoves) {
        return new Response(JSON.stringify({ error: 'Invalid XP claim payload' }), {
          status: 400,
          headers: secHeaders,
        });
      }

      const todayKey = new Date().toISOString().slice(0, 10);
      const xpInbox = await readStoreOrMemory(kv, xpBlobKey, { claims: [], dailyTotals: {} });
      const claims = Array.isArray(xpInbox.claims) ? xpInbox.claims : [];
      const dailyTotals =
        xpInbox.dailyTotals && typeof xpInbox.dailyTotals === 'object' ? xpInbox.dailyTotals : {};

      Object.keys(dailyTotals).forEach((k) => {
        if (!k.startsWith(todayKey + ':')) delete dailyTotals[k];
      });

      if (claims.some((c) => c.claimId === claimId)) {
        return new Response(
          JSON.stringify({ success: true, duplicate: true, awardedXp: 0 }),
          { status: 200, headers: secHeaders },
        );
      }

      const ledgerKey = `${todayKey}:${playerId}`;
      const usedToday = Number(dailyTotals[ledgerKey] || 0);
      const remainingToday = Math.max(0, DAILY_CLOUD_XP_CAP - usedToday);
      if (remainingToday <= 0 && bonusHousePts <= 0) {
        return new Response(
          JSON.stringify({ success: true, capped: true, awardedXp: 0 }),
          { status: 200, headers: secHeaders },
        );
      }

      const grantedXp = Math.min(rawXp, remainingToday);
      dailyTotals[ledgerKey] = usedToday + grantedXp;

      claims.push({
        claimId,
        playerId,
        callsign,
        house,
        source,
        xp: grantedXp,
        bonusHousePts,
        accuracyPct,
        botConquered,
        opponentCallsign,
        level,
        outcome,
        moves,
        createdAt: Date.now(),
      });

      await writeStoreAndMemory(kv, xpBlobKey, {
        claims: claims.slice(-150),
        dailyTotals,
      });

      return new Response(
        JSON.stringify({
          success: true,
          awardedXp: grantedXp,
          bonusHousePts,
          dailyTotal: dailyTotals[ledgerKey],
        }),
        { status: 200, headers: secHeaders },
      );
    }

    // =========================================================================
    // E. TEACHER-AUTHENTICATED ACTIONS
    // =========================================================================
    const passkeyHeader = request.headers.get('x-teacher-passkey');
    const authorized = await isAuthorizedHeader(passkeyHeader, env);
    if (!authorized) {
      return new Response(JSON.stringify({ error: 'Unauthorized teacher passkey' }), {
        status: 401,
        headers: secHeaders,
      });
    }

    if (effectiveAction === 'clear_join_requests') {
      const idsToClear = Array.isArray(parsedPayload.requestIds)
        ? new Set(parsedPayload.requestIds)
        : null;
      const joinInbox = await readStoreOrMemory(kv, joinBlobKey, { requests: [] });
      const remaining = idsToClear
        ? (joinInbox.requests || []).filter((r) => !idsToClear.has(r.requestId))
        : [];
      await writeStoreAndMemory(kv, joinBlobKey, { requests: remaining });
      return new Response(
        JSON.stringify({ success: true, remainingCount: remaining.length }),
        { status: 200, headers: secHeaders },
      );
    }

    if (effectiveAction === 'clear_xp_claims') {
      const idsToClear = Array.isArray(parsedPayload.claimIds)
        ? new Set(parsedPayload.claimIds)
        : null;
      const xpInbox = await readStoreOrMemory(kv, xpBlobKey, { claims: [], dailyTotals: {} });
      const remaining = idsToClear
        ? (xpInbox.claims || []).filter((c) => !idsToClear.has(c.claimId))
        : [];
      await writeStoreAndMemory(kv, xpBlobKey, {
        claims: remaining,
        dailyTotals: xpInbox.dailyTotals || {},
      });
      return new Response(
        JSON.stringify({ success: true, remainingCount: remaining.length }),
        { status: 200, headers: secHeaders },
      );
    }

    if (Array.isArray(parsedPayload.players)) {
      parsedPayload.players.forEach((p) => {
        delete p.year;
      });
    }

    const stateToStore = {
      ...parsedPayload,
      syncedAt: Date.now(),
    };

    await writeStoreAndMemory(kv, blobKey, stateToStore);

    return new Response(
      JSON.stringify({ success: true, syncedAt: stateToStore.syncedAt, room: blobKey }),
      { status: 200, headers: secHeaders },
    );
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: secHeaders,
  });
}

// Cloudflare Pages Functions exports
export async function onRequestOptions(context) {
  return handleChessSyncRequest(context.request, context.env);
}
export async function onRequestGet(context) {
  return handleChessSyncRequest(context.request, context.env);
}
export async function onRequestPost(context) {
  return handleChessSyncRequest(context.request, context.env);
}

// Cloudflare Workers default export
export default {
  async fetch(request, env) {
    return handleChessSyncRequest(request, env);
  },
};
