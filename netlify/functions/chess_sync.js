import crypto from 'node:crypto';

const memoryFallbackMap = new Map();
const SALT_PREFIX = 'hrh_staff_v1:';
const DEFAULT_STAFF_DIGESTS = [
  'cea62bd46e50344eeec9cca02019041921107f17ed1d4f269c5d50cd247d93c8',
];

function computeDigest(rawKey) {
  return crypto
    .createHash('sha256')
    .update(SALT_PREFIX + String(rawKey || '').trim().toLowerCase())
    .digest('hex');
}

function getAllowedDigestsFromEnv() {
  const envPasskey = process.env.CHESS_TEACHER_PASSKEY || process.env.STAFF_PASSKEY || '';
  if (envPasskey.trim()) {
    return envPasskey
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)
      .map((k) => (/^[a-f0-9]{64}$/i.test(k) ? k.toLowerCase() : computeDigest(k)));
  }
  return DEFAULT_STAFF_DIGESTS;
}

function isAuthorizedHeader(rawHeader) {
  const trimmed = String(rawHeader || '').trim();
  if (!trimmed) return false;
  const allowed = getAllowedDigestsFromEnv();
  const candidateDigest = trimmed.toLowerCase().startsWith('digest:')
    ? trimmed.slice(7).trim().toLowerCase()
    : computeDigest(trimmed);
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

function resolveBlobKey(rawRoom) {
  const slug = String(rawRoom || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48);
  return slug ? `live_session__${slug}` : 'live_session';
}

function resolveXpBlobKey(rawRoom) {
  const slug = String(rawRoom || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48);
  return slug ? `xp_inbox__${slug}` : 'xp_inbox';
}

async function readBlobOrMemory(store, key, fallbackVal) {
  let val = memoryFallbackMap.get(key) || fallbackVal;
  if (store) {
    try {
      const blobVal = await store.get(key, { type: 'json' });
      if (blobVal) val = blobVal;
    } catch (err) {
      console.warn('Blobs get error, using memory fallback:', err.message);
    }
  }
  return val;
}

async function writeBlobAndMemory(store, key, value) {
  memoryFallbackMap.set(key, value);
  if (store) {
    try {
      await store.setJSON(key, value);
    } catch (err) {
      console.warn('Blobs set error, preserved in memory:', err.message);
    }
  }
}

async function handleRequest(method, headers, body, roomParam = '', actionParam = '') {
  const getHeader = (name) => {
    if (!headers) return '';
    if (typeof headers.get === 'function') return headers.get(name) || '';
    return headers[name.toLowerCase()] || headers[name] || '';
  };

  const secHeaders = buildSecurityHeaders(getHeader('origin'));
  const blobKey = resolveBlobKey(roomParam);
  const xpBlobKey = resolveXpBlobKey(roomParam);

  if (method === 'OPTIONS') {
    return {
      status: 204,
      headers: secHeaders,
      body: '',
    };
  }

  let store = null;
  try {
    const { getStore } = await import('@netlify/blobs');
    store = getStore('history_chess');
  } catch (e) {
    // Local or fallback mode
  }

  if (method === 'GET') {
    const data = await readBlobOrMemory(store, blobKey, null);
    const xpInbox = await readBlobOrMemory(store, xpBlobKey, { claims: [], dailyTotals: {} });

    // GDPR Sanitization check: Ensure no academic year or unsanitized fields leak
    if (data && Array.isArray(data.players)) {
      data.players.forEach((p) => {
        delete p.year;
      });
    }

    if (actionParam === 'xp_claims') {
      return {
        status: 200,
        headers: secHeaders,
        body: JSON.stringify({ claims: Array.isArray(xpInbox?.claims) ? xpInbox.claims : [] }),
      };
    }

    const merged = data
      ? { ...data, pendingXpClaims: Array.isArray(xpInbox?.claims) ? xpInbox.claims : [] }
      : Array.isArray(xpInbox?.claims) && xpInbox.claims.length > 0
        ? { syncedAt: 0, pendingXpClaims: xpInbox.claims }
        : null;

    return {
      status: 200,
      headers: secHeaders,
      body: JSON.stringify(merged),
    };
  }

  if (method === 'POST') {
    let parsedPayload = {};
    try {
      parsedPayload = typeof body === 'string' ? JSON.parse(body) : body || {};
    } catch (e) {
      return {
        status: 400,
        headers: secHeaders,
        body: JSON.stringify({ error: 'Invalid JSON body' }),
      };
    }

    const effectiveAction = String(actionParam || parsedPayload.action || '').trim();

    // 1. Pupil Practice XP Submission (Isolated xp_inbox blob; strictly capped at 100 XP/day per playerId)
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
        return {
          status: 400,
          headers: secHeaders,
          body: JSON.stringify({ error: 'Invalid XP claim payload' }),
        };
      }

      const todayKey = new Date().toISOString().slice(0, 10);
      const xpInbox = await readBlobOrMemory(store, xpBlobKey, { claims: [], dailyTotals: {} });
      const claims = Array.isArray(xpInbox.claims) ? xpInbox.claims : [];
      const dailyTotals =
        xpInbox.dailyTotals && typeof xpInbox.dailyTotals === 'object' ? xpInbox.dailyTotals : {};

      // Prune stale dailyTotals keys older than today
      Object.keys(dailyTotals).forEach((k) => {
        if (!k.startsWith(todayKey + ':')) delete dailyTotals[k];
      });

      if (claims.some((c) => c.claimId === claimId)) {
        return {
          status: 200,
          headers: secHeaders,
          body: JSON.stringify({ success: true, duplicate: true, awardedXp: 0 }),
        };
      }

      const ledgerKey = `${todayKey}:${playerId}`;
      const usedToday = Number(dailyTotals[ledgerKey] || 0);
      const remainingToday = Math.max(0, 100 - usedToday);
      if (remainingToday <= 0) {
        return {
          status: 200,
          headers: secHeaders,
          body: JSON.stringify({ success: true, capped: true, awardedXp: 0 }),
        };
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

      const trimmedClaims = claims.slice(-150);
      await writeBlobAndMemory(store, xpBlobKey, {
        claims: trimmedClaims,
        dailyTotals,
      });

      return {
        status: 200,
        headers: secHeaders,
        body: JSON.stringify({
          success: true,
          awardedXp: grantedXp,
          dailyTotal: dailyTotals[ledgerKey],
        }),
      };
    }

    // 2. Teacher-Authenticated Actions (Official Live Ladder & Clearing Approved XP Claims)
    const passkeyHeader = getHeader('x-teacher-passkey');
    if (!isAuthorizedHeader(passkeyHeader)) {
      return {
        status: 401,
        headers: secHeaders,
        body: JSON.stringify({ error: 'Unauthorized teacher passkey' }),
      };
    }

    if (effectiveAction === 'clear_xp_claims') {
      const idsToClear = Array.isArray(parsedPayload.claimIds)
        ? new Set(parsedPayload.claimIds)
        : null;
      const xpInbox = await readBlobOrMemory(store, xpBlobKey, { claims: [], dailyTotals: {} });
      const remaining = idsToClear
        ? (xpInbox.claims || []).filter((c) => !idsToClear.has(c.claimId))
        : [];
      await writeBlobAndMemory(store, xpBlobKey, {
        claims: remaining,
        dailyTotals: xpInbox.dailyTotals || {},
      });
      return {
        status: 200,
        headers: secHeaders,
        body: JSON.stringify({ success: true, remainingCount: remaining.length }),
      };
    }

    // GDPR scrub on ingress: Strip any year field
    if (Array.isArray(parsedPayload.players)) {
      parsedPayload.players.forEach((p) => {
        delete p.year;
      });
    }

    const stateToStore = {
      ...parsedPayload,
      syncedAt: Date.now(),
    };

    await writeBlobAndMemory(store, blobKey, stateToStore);

    return {
      status: 200,
      headers: secHeaders,
      body: JSON.stringify({ success: true, syncedAt: stateToStore.syncedAt, room: blobKey }),
    };
  }

  return {
    status: 405,
    headers: secHeaders,
    body: 'Method Not Allowed',
  };
}

// Modern Netlify Functions (v2 Web Request/Response API)
export default async (req, context) => {
  const method = req.method;
  const headers = req.headers;
  let roomParam = '';
  let actionParam = '';
  try {
    const urlObj = new URL(req.url);
    roomParam = urlObj.searchParams.get('room') || urlObj.searchParams.get('school') || '';
    actionParam = urlObj.searchParams.get('action') || '';
  } catch (e) {}

  let body = null;
  if (method === 'POST') {
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }
  }

  const res = await handleRequest(method, headers, body, roomParam, actionParam);
  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  });
};

// Classic Netlify Functions (v1 AWS Lambda style)
export const handler = async (event, context) => {
  const method = event.httpMethod;
  const headers = event.headers;
  const body = event.body;
  const q = event.queryStringParameters || {};
  const roomParam = q.room || q.school || '';
  const actionParam = q.action || '';

  const res = await handleRequest(method, headers, body, roomParam, actionParam);
  return {
    statusCode: res.status,
    headers: res.headers,
    body: res.body,
  };
};
