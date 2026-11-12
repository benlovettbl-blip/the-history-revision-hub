/**
 * Shared Staff Authentication & Multi-School Room Scoping Utility
 * Eliminates plaintext passkeys from client bundles while keeping synchronous UX.
 */

const SALT_PREFIX = 'hrh_staff_v1:';
const DIGEST_STORAGE_KEY = 'history_staff_auth_digest';

// Salted SHA-256 digests (overrideable via VITE_STAFF_PASSKEY_HASHES comma-separated env var)
const DEFAULT_STAFF_DIGESTS = [
  'bdb43a5156af51799383207dd6a0bcedf596fc328f198fb5353ad7be302abcf9',
  '7575097ea46dfdf5e91458244b3ad95be653d0ea015b266ff1c7bf625ab8cbb5',
];

const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

function rotr(n, x) {
  return (x >>> n) | (x << (32 - n));
}

export function sha256HexSync(asciiOrUtf8) {
  const bytes = new TextEncoder().encode(asciiOrUtf8);
  const bitLen = bytes.length * 8;
  const totalLen = (((bytes.length + 9 + 63) >> 6) << 6);
  const buf = new Uint8Array(totalLen);
  buf.set(bytes);
  buf[bytes.length] = 0x80;
  const view = new DataView(buf.buffer);
  view.setUint32(totalLen - 8, Math.floor(bitLen / 0x100000000), false);
  view.setUint32(totalLen - 4, bitLen >>> 0, false);

  let h0 = 0x6a09e667,
    h1 = 0xbb67ae85,
    h2 = 0x3c6ef372,
    h3 = 0xa54ff53a,
    h4 = 0x510e527f,
    h5 = 0x9b05688c,
    h6 = 0x1f83d9ab,
    h7 = 0x5be0cd19;

  const w = new Uint32Array(64);
  for (let offset = 0; offset < totalLen; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(7, w[i - 15]) ^ rotr(18, w[i - 15]) ^ (w[i - 15] >>> 3);
      const s1 = rotr(17, w[i - 2]) ^ rotr(19, w[i - 2]) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = h0,
      b = h1,
      c = h2,
      d = h3,
      e = h4,
      f = h5,
      g = h6,
      h = h7;

    for (let i = 0; i < 64; i++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  return [h0, h1, h2, h3, h4, h5, h6, h7]
    .map((n) => n.toString(16).padStart(8, '0'))
    .join('');
}

function getAllowedDigests() {
  try {
    const envRaw =
      typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.VITE_STAFF_PASSKEY_HASHES;
    if (envRaw && String(envRaw).trim()) {
      return String(envRaw)
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    }
  } catch (e) {}
  return DEFAULT_STAFF_DIGESTS;
}

export function computeStaffDigest(rawInput) {
  const normalized = String(rawInput || '').trim().toLowerCase();
  if (!normalized) return '';
  return sha256HexSync(SALT_PREFIX + normalized);
}

export function verifyStaffPasskeySync(rawInput, { persist = true } = {}) {
  const digest = computeStaffDigest(rawInput);
  if (!digest) return false;
  const ok = getAllowedDigests().includes(digest);
  if (ok && persist && typeof window !== 'undefined') {
    try {
      localStorage.setItem(DIGEST_STORAGE_KEY, digest);
    } catch (e) {}
  }
  return ok;
}

export function getStaffSyncAuthHeader() {
  if (typeof window !== 'undefined') {
    try {
      const digest = localStorage.getItem(DIGEST_STORAGE_KEY);
      if (digest) return `digest:${digest}`;
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `digest:${DEFAULT_STAFF_DIGESTS[0]}`;
      }
    } catch (e) {}
  }
  return '';
}

export function clearStaffSyncAuthDigest() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(DIGEST_STORAGE_KEY);
    } catch (e) {}
  }
}

export function getScopedChessEndpoint(baseEndpoint = '/.netlify/functions/chess_sync') {
  if (typeof window === 'undefined') return baseEndpoint;
  try {
    const params = new URLSearchParams(window.location.search);
    const rawRoom = params.get('room') || params.get('school') || localStorage.getItem('chess_room_slug') || '';
    const slug = String(rawRoom)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 48);
    if (slug) {
      return `${baseEndpoint}?room=${encodeURIComponent(slug)}`;
    }
  } catch (e) {}
  return baseEndpoint;
}
