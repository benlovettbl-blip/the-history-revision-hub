/**
 * The History Revision Hub — Chess Club Cloud Sync (Cloudflare Pages Function)
 * Route: /api/chess_sync
 *
 * Storage:
 * - Uses Cloudflare KV binding `env.CHESS_SYNC_KV` (or `env.CHESS_KV`) when attached
 *   in Cloudflare Pages Settings -> Functions -> KV namespace bindings.
 * - Falls back gracefully to isolate memory when no KV binding is configured yet,
 *   ensuring zero 405 errors on static Cloudflare Pages deployments.
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
    /^https:\/\/[a-z0-9.-]*the-history-revision-hub\.pages\.dev$/i.test(origin) ||
    origin === 'https://the-history-revision-hub.netlify.app' ||
    /^https:\/\/[a-z0-9-]+--the-history-revision-hub\.netlify\.app$/i.test(origin) ||
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

function resolveBlobKey(rawRoom) {
  const slug = slugifyRoom(rawRoom);
  return slug ? `live_session__${slug}` : 'live_session';
}

function resolveXpBlobKey(rawRoom) {
  const slug = slugifyRoom(rawRoom);
  return slug ? `xp_inbox__${slug}` : 'xp_inbox';
}

function resolveJoinBlobKey(rawRoom) {
  const slug = slugifyRoom(rawRoom);
  return slug ? `join_inbox__${slug}` : 'join_inbox';
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
    } catch (err) {
      // Fall back to isolate memory on transient KV errors
    }
  }
  return val;
}

async function writeStoreAndMemory(kv, key, value) {
  memoryFallbackMap.set(key, value);
  if (kv) {
    try {
      await kv.put(key, JSON.stringify(value));
    } catch (err) {
      // Preserve in isolate memory if KV put fails
    }
  }
}

export async function onRequestOptions(context) {
  const secHeaders = buildSecurityHeaders(context.request.headers.get('origin'));
  return new Response(null, { status: 204, headers: secHeaders });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const secHeaders = buildSecurityHeaders(request.headers.get('origin'));
  const urlObj = new URL(request.url);
  const roomParam = urlObj.searchParams.get('room') || urlObj.searchParams.get('school') || '';
  const actionParam = urlObj.searchParams.get('action') || '';

  const kv = getKvStore(env);
  const blobKey = resolveBlobKey(roomParam);
  const xpBlobKey = resolveXpBlobKey(roomParam);
  const joinBlobKey = resolveJoinBlobKey(roomParam);

  const data = await readStoreOrMemory(kv, blobKey, null);
  const xpInbox = await readStoreOrMemory(kv, xpBlobKey, { claims: [], dailyTotals: {} });
  const joinInbox = await readStoreOrMemory(kv, joinBlobKey, { requests: [] });

  // GDPR Sanitization: strip any academic year field
  if (data && Array.isArray(data.players)) {
    data.players.forEach((p) => {
      delete p.year;
    });
  }

  const pendingXpClaims = Array.isArray(xpInbox?.claims) ? xpInbox.claims : [];
  const pendingJoinRequests = Array.isArray(joinInbox?.requests) ? joinInbox.requests : [];

  if (actionParam === 'xp_claims') {
    return new Response(
      JSON.stringify({ claims: pendingXpClaims, joinRequests: pendingJoinRequests }),
      { status: 200, headers: secHeaders },
    );
  }

  const merged = data
    ? { ...data, pendingXpClaims, pendingJoinRequests }
    : pendingXpClaims.length > 0 || pendingJoinRequests.length > 0
      ? { syncedAt: 0, pendingXpClaims, pendingJoinRequests }
      : null;

  return new Response(JSON.stringify(merged), { status: 200, headers: secHeaders });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const secHeaders = buildSecurityHeaders(request.headers.get('origin'));
  const urlObj = new URL(request.url);
  const roomParam = urlObj.searchParams.get('room') || urlObj.searchParams.get('school') || '';
  const actionParam = urlObj.searchParams.get('action') || '';

  let parsedPayload = {};
  try {
    parsedPayload = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: secHeaders,
    });
  }

  const kv = getKvStore(env);
  const blobKey = resolveBlobKey(roomParam);
  const xpBlobKey = resolveXpBlobKey(roomParam);
  const joinBlobKey = resolveJoinBlobKey(roomParam);
  const effectiveAction = String(actionParam || parsedPayload?.action || '').trim();

  // 0. Pupil Club Join Request (Strictly whitelisted historical Callsigns ONLY — zero free text!)
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

  // 1. Pupil Practice XP Submission (Isolated xp_inbox; strictly capped at 100 XP/day per playerId)
  if (effectiveAction === 'xp_claim') {
    const playerId = String(parsedPayload.playerId || '').trim();
    const callsign = String(parsedPayload.callsign || '')
      .replace(/[<>]/g, '')
      .trim()
      .slice(0, 48);
    const house = String(parsedPayload.house || '')
      .trim()
      .toLowerCase()
      .slice(0, 20);
    const level = ['easy', 'medium', 'hard'].includes(parsedPayload.level)
      ? parsedPayload.level
      : 'medium';
    const outcome = ['win', 'draw', 'effort'].includes(parsedPayload.outcome)
      ? parsedPayload.outcome
      : 'effort';
    const moves = Math.max(0, Math.min(400, Math.floor(Number(parsedPayload.moves) || 0)));
    const rawXp = Math.max(5, Math.min(50, Math.floor(Number(parsedPayload.xp) || 0)));
    const claimId = String(parsedPayload.claimId || `xp_${Date.now()}`).slice(0, 64);

    if (!/^p_\d{6,20}$/.test(playerId) || !callsign || moves < 6) {
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
    const remainingToday = Math.max(0, 100 - usedToday);
    if (remainingToday <= 0) {
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
      xp: grantedXp,
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
        dailyTotal: dailyTotals[ledgerKey],
      }),
      { status: 200, headers: secHeaders },
    );
  }

  // 2. Teacher-Authenticated Actions
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

  // GDPR scrub on ingress: strip any year field
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
