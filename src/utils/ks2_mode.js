/**
 * Shared Key Stage 2 Child-Friendly UI & Safeguarding Mode Helper (`ks2_mode.js`)
 *
 * Centralises detection and child-friendly label translation for Ages 7–11 (Years 3–6)
 * without mutating KS3/GCSE screens, Studio TTS SHA-256 audio hashes, or printed PDFs.
 */

export function isKs2UnitId(unitId, unitData = null) {
  const id = String(unitId || unitData?.id || '').trim().toLowerCase();
  if (id === 'ks2_ww2' || id.startsWith('ks2_')) return true;
  if (unitData && (unitData.is_ks2 || unitData.keyStage === 'KS2' || unitData.key_stage === 'KS2')) {
    return true;
  }
  return false;
}

export function isKs2PortalSession() {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const stageParam = String(params.get('stage') || params.get('portal') || '').toLowerCase();
    if (stageParam === 'ks2') return true;
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('hh_portal') === 'ks2') {
      return true;
    }
  } catch (_) {}
  return false;
}

export function hasOnlyKs2PinnedUnits() {
  if (typeof localStorage === 'undefined') return false;
  try {
    const raw = localStorage.getItem('hh_pinned_units');
    if (!raw) return false;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || arr.length === 0) return false;
    return arr.every((id) => isKs2UnitId(id));
  } catch (_) {
    return false;
  }
}

export function getCurrentActiveUnitId() {
  if (typeof window === 'undefined') return '';
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('unit');
    if (fromUrl) return fromUrl;
  } catch (_) {}
  return (
    window.currentUnitId ||
    window.state?.selectedUnitId ||
    window.state?.currentUnitId ||
    window.appStore?.state?.currentUnitId ||
    window.appStore?.state?.selectedUnitId ||
    ''
  );
}

/**
 * Returns true whenever the active unit, URL session, or pinned-only pupil state is KS2.
 */
export function isKs2ActiveContext(explicitUnitId = '', explicitUnitData = null) {
  if (explicitUnitId || explicitUnitData) {
    if (isKs2UnitId(explicitUnitId, explicitUnitData)) return true;
  }
  const activeId = getCurrentActiveUnitId();
  if (activeId) {
    return isKs2UnitId(activeId, explicitUnitData || (typeof window !== 'undefined' ? window.currentUnitData : null));
  }
  if (isKs2PortalSession()) return true;
  if (hasOnlyKs2PinnedUnits()) return true;
  return false;
}

/**
 * Translates secondary/GCSE disciplinary source badges into friendly Ages 7–11 Detective language.
 */
export function translateKs2SourceBadge(rawBadge) {
  const b = String(rawBadge || '').trim();
  if (!b) return 'Clue Detective';
  const upper = b.toUpperCase();
  if (upper.includes('RELIABILITY') || upper.includes('PROVENANCE') || upper.includes('TRUST')) {
    return 'Can We Trust This Clue?';
  }
  if (upper.includes('CROSS-REFERENC') || upper.includes('COMPAR')) {
    return 'Comparing Two Clues';
  }
  if (upper.includes('PURPOSE') || upper.includes('MOTIVE') || upper.includes('AUDIENCE')) {
    return 'Why Was This Made?';
  }
  if (upper.includes('INFERENCE') || upper.includes('WORK OUT')) {
    return 'What Can We Work Out?';
  }
  if (upper.includes('UTILITY') || upper.includes('USEFUL')) {
    return 'How Does This Clue Help Us?';
  }
  if (upper.includes('CHANGE') || upper.includes('CONTINUITY')) {
    return 'What Changed & Stayed the Same?';
  }
  if (upper.includes('CAUS')) {
    return 'Why Did This Happen?';
  }
  if (upper.includes('SIGNIFICAN')) {
    return 'Why Did This Matter?';
  }
  return b;
}

/**
 * Extracts a crisp, self-contained 1–2 sentence child-friendly hook (capped by word count).
 */
export function extractKs2ShortHook(rawText, maxSentences = 2, maxWords = 42) {
  const clean = String(rawText || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return '';
  const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
  const picked = [];
  let wordsSoFar = 0;
  for (const s of sentences) {
    const trimmed = s.trim();
    const wCount = trimmed.split(/\s+/).length;
    if (picked.length >= maxSentences) break;
    if (picked.length > 0 && wordsSoFar + wCount > maxWords) break;
    picked.push(trimmed);
    wordsSoFar += wCount;
  }
  if (picked.length === 0 && sentences[0]) {
    const words = sentences[0].trim().split(/\s+/);
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '…' : sentences[0].trim();
  }
  return picked.join(' ');
}
