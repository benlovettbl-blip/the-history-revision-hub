/**
 * Acoustic Sentence Boundary Extractor (`extract_audio_timings.mjs`)
 *
 * Uses `ffmpeg silencedetect` + number-aware phonetic syllable weights + DP alignment
 * to lock every sentence in every Lesson Narrative MP3 to its exact spoken [startSec, endSec]
 * window (eliminating cumulative drift across numbers, dates, pauses, and paragraphs).
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ABBREV_NON_END_RE =
  /^(?:[A-Z]\.|(?:[A-Z]\.){2,}|Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Sir\.|St\.|Gen\.|Col\.|Lt\.|Sgt\.|Capt\.|Rev\.|Gov\.|Pres\.|vs\.|etc\.|approx\.|ca\.|c\.|No\.|Fig\.|Vol\.|pp\.|p\.)$/i;

export function isSentenceEndingToken(token) {
  const clean = String(token || '').replace(/["'”’)\]]+$/g, '');
  if (!/[.!?]$/.test(clean)) return false;
  if (clean.endsWith('!') || clean.endsWith('?')) return true;
  if (ABBREV_NON_END_RE.test(clean)) return false;
  return true;
}

export function spokenPhoneticWeight(rawWord) {
  const w = String(rawWord || '').trim();
  if (!w) return 2;

  let base = 0;
  const digitsOnly = w.replace(/[^0-9]/g, '');
  if (/^\d{4}s?$/.test(w.replace(/[^0-9s]/gi, ''))) {
    // Years like 1945, 1960s -> ~5 syllables ("nineteen forty-five")
    base = 17;
  } else if (digitsOnly.length >= 4) {
    // Large numbers like 250,000, 100,000, 1,500 -> ~5–7 syllables
    base = 14 + digitsOnly.length * 1.6;
  } else if (digitsOnly.length >= 1) {
    // 1–3 digit numbers like 91, 55%, 14 -> ~2–4 syllables
    base = 7 + digitsOnly.length * 2.5 + (w.includes('%') ? 7 : 0);
  } else if (/^[A-Z]{2,6}$/.test(w.replace(/[^A-Za-z]/g, ''))) {
    // Acronyms like PLO, UN, IDF, WWII -> spoken letter-by-letter or expanded
    const letters = w.replace(/[^A-Za-z]/g, '');
    base = letters === 'WWII' ? 13 : letters === 'WWI' ? 13 : letters.length * 3.6;
  } else {
    base = Math.max(2.2, w.replace(/[^a-zA-Z0-9]/g, '').length);
  }

  let pause = 0;
  if (isSentenceEndingToken(w)) pause = 6.5;
  else if (/[:;—–]$/.test(w) || w === '—' || w === '–') pause = 3.8;
  else if (/[,]["'”’)]*$/.test(w)) pause = 2.4;

  return base + pause;
}

/**
 * Split cleaned prose text into sentences using the exact same token rule as `speech.js`.
 */
export function splitIntoAlignedSentences(rawBlockText) {
  let s = String(rawBlockText || '').trim();
  // Expand dossier tags identically to narrative_annotator.js
  s = s.replace(/\[Key\s+[^:\]]+:\s*([^\]]+)\]/gi, '$1');
  // Strip [1.1] paragraph indices (skipped in DOM by prepareHighlightableText)
  s = s.replace(/\[\s*\d+(?:\.\d+)?\s*\]/g, ' ');
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1');
  s = s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  const tokens = s.split(/\s+/).filter(Boolean);
  const sentences = [];
  let cur = [];
  for (const tok of tokens) {
    cur.push(tok);
    if (isSentenceEndingToken(tok)) {
      sentences.push(cur.join(' '));
      cur = [];
    }
  }
  if (cur.length > 0) sentences.push(cur.join(' '));
  return sentences;
}

export function detectMp3Silences(mp3Path) {
  const res = spawnSync(
    'ffmpeg',
    ['-i', mp3Path, '-af', 'silencedetect=noise=-34dB:d=0.18', '-f', 'null', '-'],
    { encoding: 'utf8' },
  );
  const out = `${res.stdout || ''}\n${res.stderr || ''}`;

  let duration = 0;
  const durMatch = out.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (durMatch) {
    duration = Number(durMatch[1]) * 3600 + Number(durMatch[2]) * 60 + Number(durMatch[3]);
  }

  const silences = [];
  let curStart = null;
  for (const line of out.split(/\r?\n/)) {
    const sm = line.match(/silence_start:\s*([0-9.]+)/);
    if (sm) curStart = parseFloat(sm[1]);
    const em = line.match(/silence_end:\s*([0-9.]+)\s*\|\s*silence_duration:\s*([0-9.]+)/);
    if (em && curStart !== null) {
      silences.push({
        start: curStart,
        end: parseFloat(em[1]),
        dur: parseFloat(em[2]),
      });
      curStart = null;
    }
  }
  if (curStart !== null && duration > curStart) {
    silences.push({ start: curStart, end: duration, dur: duration - curStart });
  }

  return { duration, silences };
}

/**
 * Align `sentences` (length N) to exact acoustic `[startSec, endSec]` intervals in `mp3Path`.
 */
export function alignSentencesToMp3(mp3Path, rawBlockText) {
  const sentences = splitIntoAlignedSentences(rawBlockText);
  const { duration, silences } = detectMp3Silences(mp3Path);
  if (!duration || sentences.length === 0) {
    return { dur: duration || 0, sentences: [] };
  }

  // Trim leading and trailing silence pads
  let speechStart = 0.08;
  let speechEnd = Math.max(0.2, duration - 0.25);

  if (silences.length > 0 && silences[0].start <= 0.08 && silences[0].end < duration * 0.15) {
    speechStart = silences[0].end;
  }
  if (
    silences.length > 0 &&
    silences[silences.length - 1].end >= duration - 0.08 &&
    silences[silences.length - 1].start > duration * 0.75
  ) {
    speechEnd = silences[silences.length - 1].start;
  }

  const N = sentences.length;
  if (N === 1) {
    return {
      dur: Number(duration.toFixed(2)),
      sentences: [[Number(speechStart.toFixed(2)), Number(speechEnd.toFixed(2))]],
    };
  }

  const sentWeights = sentences.map((sent) =>
    sent
      .split(/\s+/)
      .filter(Boolean)
      .reduce((sum, w) => sum + spokenPhoneticWeight(w), 0),
  );
  const totalWeight = sentWeights.reduce((a, b) => a + b, 0) || 1;
  const activeSpanSec = Math.max(1, speechEnd - speechStart);

  // Expected boundary timestamps (N - 1 internal boundaries)
  const expectedBoundaries = [];
  let cumW = 0;
  for (let k = 0; k < N - 1; k++) {
    cumW += sentWeights[k];
    expectedBoundaries.push(speechStart + (cumW / totalWeight) * activeSpanSec);
  }

  // Candidate internal silences strictly inside (speechStart + 0.6, speechEnd - 0.6)
  const candidates = silences.filter(
    (sil) => sil.start > speechStart + 0.6 && sil.end < speechEnd - 0.6 && sil.dur >= 0.22,
  );

  // Dynamic programming / sequential monotonic snap to longest nearby silence pause
  const chosenBoundaries = [];
  let prevEnd = speechStart;

  for (let k = 0; k < N - 1; k++) {
    const expT = expectedBoundaries[k];
    const maxSearchWindow = Math.max(2.6, activeSpanSec * 0.13);

    let bestSil = null;
    let bestScore = -Infinity;

    for (const sil of candidates) {
      if (sil.start <= prevEnd + 0.7) continue;
      const mid = (sil.start + sil.end) / 2;
      const dist = Math.abs(mid - expT);
      if (dist > maxSearchWindow) continue;
      // Strongly prefer genuine sentence pauses (0.45s–1.1s) close to expected phonetic time
      const durBonus = Math.min(sil.dur, 0.95) * 4.5;
      const distPenalty = (dist / maxSearchWindow) * 3.2;
      const score = durBonus - distPenalty;
      if (score > bestScore) {
        bestScore = score;
        bestSil = sil;
      }
    }

    if (bestSil) {
      chosenBoundaries.push({ endPrev: bestSil.start, startNext: bestSil.end });
      prevEnd = bestSil.end;
    } else {
      // Fallback interpolation if narrator read across punctuation without a 0.22s silence
      const fallbackT = Math.max(prevEnd + 0.8, expT);
      chosenBoundaries.push({ endPrev: fallbackT - 0.08, startNext: fallbackT + 0.08 });
      prevEnd = fallbackT + 0.08;
    }
  }

  const intervals = [];
  let curStart = speechStart;
  for (let k = 0; k < N - 1; k++) {
    intervals.push([Number(curStart.toFixed(2)), Number(chosenBoundaries[k].endPrev.toFixed(2))]);
    curStart = chosenBoundaries[k].startNext;
  }
  intervals.push([Number(curStart.toFixed(2)), Number(speechEnd.toFixed(2))]);

  return {
    dur: Number(duration.toFixed(2)),
    sentences: intervals,
  };
}

export function buildUnitLessonTimingsJson(rootDir, unitId) {
  const unitJsonPath = path.join(rootDir, 'data', `${unitId}.json`);
  const audioDir = path.join(rootDir, 'public', 'audio', 'lessons', unitId);
  if (!fs.existsSync(unitJsonPath) || !fs.existsSync(audioDir)) return 0;

  const raw = JSON.parse(fs.readFileSync(unitJsonPath, 'utf8'));
  const lessons = (raw.data || raw).lessons || [];
  const timings = {};
  let count = 0;

  for (const lesson of lessons) {
    const prologueKey = `${lesson.id}_prologue`;
    const prologueMp3 = path.join(audioDir, `${prologueKey}.mp3`);
    const rawPrologue = lesson.prologue || lesson.hook_text || lesson.blurb || '';
    if (rawPrologue && fs.existsSync(prologueMp3)) {
      timings[prologueKey] = alignSentencesToMp3(prologueMp3, rawPrologue);
    }

    const blocks = Array.isArray(lesson.narrative_blocks) ? lesson.narrative_blocks : [];
    blocks.forEach((block, idx) => {
      const key = `${lesson.id}_b${idx + 1}`;
      const mp3Path = path.join(audioDir, `${key}.mp3`);
      if (!fs.existsSync(mp3Path)) return;
      timings[key] = alignSentencesToMp3(mp3Path, block.text || block.content || '');
      count++;
    });
  }

  const outPath = path.join(audioDir, 'timings.json');
  fs.writeFileSync(outPath, JSON.stringify(timings, null, 2) + '\n', 'utf8');
  return count;
}
