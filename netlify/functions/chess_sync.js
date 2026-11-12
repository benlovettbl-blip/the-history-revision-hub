import crypto from 'node:crypto';

const memoryFallbackMap = new Map();
const SALT_PREFIX = 'hrh_staff_v1:';
const DEFAULT_STAFF_DIGESTS = [
  'bdb43a5156af51799383207dd6a0bcedf596fc328f198fb5353ad7be302abcf9',
  '7575097ea46dfdf5e91458244b3ad95be653d0ea015b266ff1c7bf625ab8cbb5',
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
  if (!origin) return 'https://the-history-revision-hub.netlify.app';
  if (
    origin === 'https://the-history-revision-hub.netlify.app' ||
    /^https:\/\/[a-z0-9-]+--the-history-revision-hub\.netlify\.app$/i.test(origin) ||
    /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)
  ) {
    return origin;
  }
  return 'https://the-history-revision-hub.netlify.app';
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

async function handleRequest(method, headers, body, roomParam = '') {
  const getHeader = (name) => {
    if (!headers) return '';
    if (typeof headers.get === 'function') return headers.get(name) || '';
    return headers[name.toLowerCase()] || headers[name] || '';
  };

  const secHeaders = buildSecurityHeaders(getHeader('origin'));
  const blobKey = resolveBlobKey(roomParam);

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
    let data = memoryFallbackMap.get(blobKey) || null;
    if (store) {
      try {
        const blobData = await store.get(blobKey, { type: 'json' });
        if (blobData) data = blobData;
      } catch (err) {
        console.warn('Blobs get error, using memory fallback:', err.message);
      }
    }

    // GDPR Sanitization check: Ensure no academic year or unsanitized fields leak
    if (data && Array.isArray(data.players)) {
      data.players.forEach((p) => {
        delete p.year;
      });
    }

    return {
      status: 200,
      headers: secHeaders,
      body: JSON.stringify(data || null),
    };
  }

  if (method === 'POST') {
    const passkeyHeader = getHeader('x-teacher-passkey');
    if (!isAuthorizedHeader(passkeyHeader)) {
      return {
        status: 401,
        headers: secHeaders,
        body: JSON.stringify({ error: 'Unauthorized teacher passkey' }),
      };
    }

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

    memoryFallbackMap.set(blobKey, stateToStore);

    if (store) {
      try {
        await store.setJSON(blobKey, stateToStore);
      } catch (err) {
        console.warn('Blobs set error, preserved in memory:', err.message);
      }
    }

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
  try {
    const urlObj = new URL(req.url);
    roomParam = urlObj.searchParams.get('room') || urlObj.searchParams.get('school') || '';
  } catch (e) {}

  let body = null;
  if (method === 'POST') {
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }
  }

  const res = await handleRequest(method, headers, body, roomParam);
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

  const res = await handleRequest(method, headers, body, roomParam);
  return {
    statusCode: res.status,
    headers: res.headers,
    body: res.body,
  };
};
