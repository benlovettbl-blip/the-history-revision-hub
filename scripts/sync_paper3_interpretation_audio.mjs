#!/usr/bin/env node
/**
 * GCSE Paper 3 Two-Historian Interpretation Clash Audio Synchronizer (`sync_paper3_interpretation_audio.mjs`)
 *
 * Phase 4 — Task [4.1]:
 *  - Voices all 32 contrasting Paper 3 Section B `4m + 4m + 16m` (`Q3b / Q3c / Q3d`)
 *    Interpretation 1 vs Interpretation 2 clashes (64 Studio Historian MP3s total) across
 *    `weimar_nazi_germany` (8 canonical + 4 unseen mocks = 24 MP3s) and `usa` (7 canonical +
 *    13 unseen mocks = 40 MP3s).
 *  - Pairs two contrasting Studio Historian voices (`male_historian` vs `female_historian`)
 *    on every clash, matching named historian gender wherever cited (Fulbrook, Boak, Heschel,
 *    McGuire, Evans, Kershaw, Friedländer, Lewis, Sitkoff, Appy, Pach).
 *  - Uses 50%-off Gemini Batch-TTS (`gemini-3.8-flash-tts:batchGenerateContent`) with SHA-256
 *    `audio_hashes.json` tracking ($0.00 delta checks on repeat runs) and writes acoustic
 *    sentence `timings.json` to `/audio/sources/<unit>/timings.json`.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolveGeminiApiKey, ensureHouseVoiceId } from './studio_voice_registry.mjs';
import { alignSentencesToMp3 } from './extract_audio_timings.mjs';
import { expandBritishDatesForSpeech } from './spoken_date_normalizer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

export const PAPER3_INTERPRETATION_UNITS = new Set(['weimar_nazi_germany', 'usa']);

// Explicit contrasting two-historian casting for canonical lessons (gender-matched to real cited scholars)
const CANONICAL_CLASH_CAST = {
  // Weimar & Nazi Germany (8 clashes = 16 extracts)
  'weimar_nazi_germany:lesson_1_2:1': {
    voiceKey: 'male_historian',
    style: 'authoritative, analytical Cambridge historian arguing political violence and army disloyalty threatened Weimar most',
    badge: 'Historian 1 · Richard J. Evans',
  },
  'weimar_nazi_germany:lesson_1_2:2': {
    voiceKey: 'female_historian',
    style: 'incisive, measured British historian arguing economic catastrophe and 1923 hyperinflation shook Weimar far deeper',
    badge: 'Historian 2 · Mary Fulbrook',
  },
  'weimar_nazi_germany:lesson_1_4:1': {
    voiceKey: 'male_historian',
    style: 'engaged, analytical modern historian arguing the Weimar Republic brought genuine social and political liberation to women',
    badge: 'Historian 1 · Eric D. Weitz',
  },
  'weimar_nazi_germany:lesson_1_4:2': {
    voiceKey: 'female_historian',
    style: 'sharp, sceptical social historian arguing the New Woman was an urban myth masking low-paid reality and backlash',
    badge: 'Historian 2 · Helen Boak',
  },
  'weimar_nazi_germany:lesson_2_3:1': {
    voiceKey: 'female_historian',
    style: 'clear, structured academic historian arguing mass unemployment in the Great Depression drove Nazi growth',
    badge: 'Historian 1 · Economic Despair View',
  },
  'weimar_nazi_germany:lesson_2_3:2': {
    voiceKey: 'male_historian',
    style: 'forceful, incisive historian arguing Goebbels’s propaganda, Hitler’s appeal, and SA street power set the Nazis apart',
    badge: 'Historian 2 · Richard J. Evans',
  },
  'weimar_nazi_germany:lesson_2_4:1': {
    voiceKey: 'male_historian',
    style: 'weighty, structural British historian arguing Weimar parliamentary paralysis and Article 48 made collapse systemic',
    badge: 'Historian 1 · Ian Kershaw',
  },
  'weimar_nazi_germany:lesson_2_4:2': {
    voiceKey: 'female_historian',
    style: 'sharp, revisionist political historian arguing backstairs intrigue by Papen and Hindenburg rescued a fading Nazi Party',
    badge: 'Historian 2 · Backstairs Intrigue View',
  },
  'weimar_nazi_germany:lesson_3_3:1': {
    voiceKey: 'female_historian',
    style: 'measured academic historian arguing Goebbels’s propaganda genuinely won hearts and tapped national pride',
    badge: 'Historian 1 · Consent & Propaganda View',
  },
  'weimar_nazi_germany:lesson_3_3:2': {
    voiceKey: 'male_historian',
    style: 'sober, authoritative historian arguing Gestapo surveillance, block wardens, and camp terror enforced conformity',
    badge: 'Historian 2 · Richard J. Evans',
  },
  'weimar_nazi_germany:lesson_3_4:1': {
    voiceKey: 'male_historian',
    style: 'earnest ecclesiastical historian arguing Catholic and Confessing Church resistance blocked total Nazification',
    badge: 'Historian 1 · Ernst Helmreich',
  },
  'weimar_nazi_germany:lesson_3_4:2': {
    voiceKey: 'female_historian',
    style: 'critical, searching modern historian arguing institutional church conformity and silence betrayed persecuted minorities',
    badge: 'Historian 2 · Heschel & Ericksen',
  },
  'weimar_nazi_germany:lesson_4_3:1': {
    voiceKey: 'female_historian',
    style: 'clear social historian arguing full employment and Strength Through Joy leisure brought tangible worker gains',
    badge: 'Historian 1 · KdF & Employment View',
  },
  'weimar_nazi_germany:lesson_4_3:2': {
    voiceKey: 'male_historian',
    style: 'rigorous, critical labour historian arguing crushed unions, wage deductions, and longer hours eroded living standards',
    badge: 'Historian 2 · Tim Mason',
  },
  'weimar_nazi_germany:lesson_4_4:1': {
    voiceKey: 'male_historian',
    style: 'solemn, authoritative historian arguing Kristallnacht was directed entirely from above by Goebbels and the SA',
    badge: 'Historian 1 · Saul Friedländer',
  },
  'weimar_nazi_germany:lesson_4_4:2': {
    voiceKey: 'female_historian',
    style: 'measured social historian arguing widespread public shock and shame were silenced by fear of the Gestapo',
    badge: 'Historian 2 · Public Reaction View',
  },

  // USA 1954–1975 (7 canonical clashes = 14 extracts)
  'usa:lesson_1_3:1': {
    voiceKey: 'female_historian',
    style: 'compelling, incisive modern historian arguing organised working-class Black women built and sustained Montgomery',
    badge: 'Historian 1 · Danielle L. McGuire',
  },
  'usa:lesson_1_3:2': {
    voiceKey: 'male_historian',
    style: 'measured, authoritative biographer arguing Martin Luther King’s moral leadership and federal court strategy won victory',
    badge: 'Historian 2 · David L. Lewis',
  },
  'usa:lesson_1_4:1': {
    voiceKey: 'male_historian',
    style: 'sombre, forceful historian arguing Klan violence and all-white jury impunity stalled Southern civil rights',
    badge: 'Historian 1 · Racial Terror View',
  },
  'usa:lesson_1_4:2': {
    voiceKey: 'female_historian',
    style: 'precise political historian arguing Citizens’ Councils, the Southern Manifesto, and weak federal laws stalled progress',
    badge: 'Historian 2 · Massive Resistance View',
  },
  'usa:lesson_2_4:1': {
    voiceKey: 'male_historian',
    style: 'empathetic social historian arguing northern ghetto poverty, housing segregation, and police brutality sparked urban unrest',
    badge: 'Historian 1 · Harvard Sitkoff',
  },
  'usa:lesson_2_4:2': {
    voiceKey: 'female_historian',
    style: 'analytical intellectual historian arguing Black Power ideology and militant nationalism transformed post-1965 protest',
    badge: 'Historian 2 · Black Power View',
  },
  'usa:lesson_3_3:1': {
    voiceKey: 'male_historian',
    style: 'critical military-social historian arguing US search-and-destroy attrition and defoliants alienated rural Vietnamese peasants',
    badge: 'Historian 1 · Christian G. Appy',
  },
  'usa:lesson_3_3:2': {
    voiceKey: 'female_historian',
    style: 'crisp strategic historian arguing Vietcong guerrilla discipline, Cu Chi tunnels, and Ho Chi Minh Trail logistics defeated US aims',
    badge: 'Historian 2 · Guerrilla Strategy View',
  },
  'usa:lesson_3_4:1': {
    voiceKey: 'female_historian',
    style: 'analytical military historian arguing ARVN corruption, desertion, and US air-power dependency doomed Vietnamisation',
    badge: 'Historian 1 · ARVN Weakness View',
  },
  'usa:lesson_3_4:2': {
    voiceKey: 'male_historian',
    style: 'incisive political historian arguing Nixon’s Cambodia invasion, Kent State backlash, and Congressional cuts doomed his policy',
    badge: 'Historian 2 · Domestic Backlash View',
  },
  'usa:lesson_4_1:1': {
    voiceKey: 'male_historian',
    style: 'vivid media historian arguing uncensored nightly television news turned Vietnam into an unwinnable living-room war',
    badge: 'Historian 1 · Chester Pach',
  },
  'usa:lesson_4_1:2': {
    voiceKey: 'female_historian',
    style: 'clear social historian arguing conscription, working-class draft inequities, and rising casualties drove mass protest',
    badge: 'Historian 2 · Conscription & Casualties View',
  },
  'usa:lesson_4_4:1': {
    voiceKey: 'female_historian',
    style: 'measured international historian arguing Vietnamese nationalist endurance and guerrilla logistics outlasted superpower firepower',
    badge: 'Historian 1 · Guerrilla Endurance View',
  },
  'usa:lesson_4_4:2': {
    voiceKey: 'male_historian',
    style: 'authoritative political historian arguing economic cost, lost domestic support, and Congressional restrictions ended US war aims',
    badge: 'Historian 2 · Domestic Collapse View',
  },
};

function sha256(str) {
  return crypto.createHash('sha256').update(String(str), 'utf8').digest('hex').slice(0, 16);
}

function loadHashManifest(filePath) {
  if (!fs.existsSync(filePath)) return { version: 1, clips: {} };
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (parsed && typeof parsed.clips === 'object') return parsed;
  } catch (_) {}
  return { version: 1, clips: {} };
}

function saveHashManifest(filePath, manifest) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
}

function decodeBasicHtmlEntities(s) {
  return String(s || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&rsquo;/gi, '’')
    .replace(/&lsquo;/gi, '‘')
    .replace(/&rdquo;/gi, '”')
    .replace(/&ldquo;/gi, '“')
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—');
}

// Exact mirror of `parseMockSourceExtractToStimuli` in `src/engine/lesson_renderer.js`
function parseMockInterpretationsFromHtml(rawExtract) {
  if (!rawExtract || !String(rawExtract).trim()) return [];
  const cleaned = String(rawExtract).trim();
  const rawSegments = cleaned
    .split(
      /<hr\b[^>]*>|(?=<div[^>]*border-top:\s*1px\s+dashed[^>]*>)|(?<=<\/div>)\s*(?=<div[^>]*>\s*<div[^>]*>\s*(?:<strong>)?\s*(?:Source\s+[A-E]|Interpretation\s+[12])\b)/i,
    )
    .map((seg) => seg.trim())
    .filter(Boolean);

  const items = [];
  rawSegments.forEach((seg, idx) => {
    const work = seg.replace(/<img\b[^>]*>/gi, '\n');
    const plainLines = decodeBasicHtmlEntities(
      work
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(?:div|p|blockquote|li|h[1-6])>/gi, '\n')
        .replace(/<(?:div|p|blockquote|li|h[1-6])\b[^>]*>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/[ \t]+/g, ' '),
    )
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (!plainLines.length) return;

    let headerLine = plainLines[0] || '';
    let restLines = plainLines.slice(1);
    const bareM = headerLine.match(/^(?:Source\s+([A-E0-9]+)|Interpretation\s+([0-9]+))\s*[:.-]?\s*$/i);
    let explicitInterp = '';
    if (bareM) {
      if (bareM[2]) explicitInterp = bareM[2];
      if (restLines.length > 0) {
        headerLine = restLines[0];
        restLines = restLines.slice(1);
      } else {
        headerLine = '';
      }
    }
    const prefixM = headerLine.match(
      /^(?:Source\s+([A-E0-9]+)|Interpretation\s+([0-9]+))(?:\s*\(([^)]+)\))?\s*[:.-]?\s*(.*)$/i,
    );
    if (prefixM && prefixM[2] && !explicitInterp) {
      explicitInterp = prefixM[2];
      const parenNote = prefixM[3] ? `${prefixM[3]}: ` : '';
      headerLine = `${parenNote}${prefixM[4] || ''}`.trim();
    }
    if (!explicitInterp) return;
    const content = restLines.length > 0 ? restLines.join('\n\n') : headerLine;
    items.push({ interpNum: explicitInterp || `${idx + 1}`, provenance: headerLine, content });
  });
  return items;
}

function cleanTextForSpeech(rawHtml) {
  let s = String(rawHtml || '').trim();
  if (!s) return '';
  s = s.replace(/\[Key\s+[^:\]]+:\s*([^\]]+)\]/gi, '$1');
  s = s.replace(/(?:<br\s*\/?>\s*){2,}|<\/p>\s*<p[^>]*>|\n\n+/gi, ' <short pause> ');
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1');
  s = s.replace(/\*([^*]+)\*/g, '$1');
  s = s.replace(/<[^>]+>/g, ' ');
  s = decodeBasicHtmlEntities(s);
  s = expandBritishDatesForSpeech(s);
  s = s.replace(/\s+/g, ' ').trim();
  s = s.replace(/(?:<short pause>\s*){2,}/g, '<short pause> ');
  return s;
}

function detectShortBreathTrimSec(wavPath) {
  try {
    const res = spawnSync(
      'ffmpeg',
      ['-i', wavPath, '-af', 'silencedetect=noise=-35dB:d=0.14', '-f', 'null', '-'],
      { encoding: 'utf8' },
    );
    const out = `${res.stdout || ''}\n${res.stderr || ''}`;
    let dur = 0;
    const dm = out.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
    if (dm) dur = Number(dm[1]) * 3600 + Number(dm[2]) * 60 + Number(dm[3]);
    if (!dur) return null;

    const silences = [];
    let curStart = null;
    for (const line of out.split(/\r?\n/)) {
      const sm = line.match(/silence_start:\s*([\d.]+)/);
      if (sm) curStart = Number(sm[1]);
      const em = line.match(/silence_end:\s*([\d.]+)\s*\|\s*silence_duration:\s*([\d.]+)/);
      if (em && curStart !== null) {
        silences.push({ start: curStart, end: Number(em[1]), dur: Number(em[2]) });
        curStart = null;
      }
    }
    if (curStart !== null && dur > curStart) {
      silences.push({ start: curStart, end: dur, dur: dur - curStart });
    }
    const lastSil = silences[silences.length - 1];
    const trailingSil = lastSil && dur - lastSil.end < 0.08 ? lastSil.dur : 0;
    const speechEnd = lastSil && dur - lastSil.end < 0.08 ? lastSil.start : dur;

    for (let i = silences.length - 1; i >= 0; i--) {
      const s = silences[i];
      if (s.end >= speechEnd - 0.04) continue;
      const tailDur = speechEnd - s.end;
      if (s.start > 8.0 && s.dur >= 0.65 && tailDur > 0.04 && tailDur <= 0.75 && trailingSil < 0.35) {
        return Number((s.start + 0.06).toFixed(3));
      }
      break;
    }
  } catch (_) {}
  return null;
}

function encodeWavBufferToMp3(wavBuffer, outMp3Path) {
  const tmpWav = `${outMp3Path}.p3.${process.pid}.${Math.random().toString(36).slice(2, 7)}.wav`;
  fs.mkdirSync(path.dirname(outMp3Path), { recursive: true });
  fs.writeFileSync(tmpWav, wavBuffer);
  const trimSec = detectShortBreathTrimSec(tmpWav);
  const af = trimSec ? `atrim=0:${trimSec},apad=pad_dur=0.28` : 'apad=pad_dur=0.28';
  execFileSync(
    'ffmpeg',
    ['-y', '-i', tmpWav, '-af', af, '-codec:a', 'libmp3lame', '-ar', '24000', '-ac', '1', '-b:a', '36k', outMp3Path],
    { stdio: 'ignore' },
  );
  if (fs.existsSync(tmpWav)) fs.unlinkSync(tmpWav);
  return fs.statSync(outMp3Path).size;
}

async function runSingleBatchChunk(apiKey, voiceId, jobs, displayLabel) {
  const inlineRequests = jobs.map((j) => {
    const clean = String(j.text).trim();
    const withPause = clean.endsWith('<short pause>') ? clean : `${clean} <short pause>`;
    return {
      request: {
        contents: [
          {
            role: 'user',
            parts: [{ text: withPause, speech_metadata: { style: j.style } }],
          },
        ],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceId },
            },
          },
        },
      },
    };
  });

  let batchName = null;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:batchGenerateContent',
      {
        method: 'POST',
        headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch: {
            display_name: displayLabel,
            input_config: { requests: { requests: inlineRequests } },
          },
        }),
      },
    );
    if (res.ok) {
      const json = await res.json();
      batchName = json.name;
      break;
    }
    const errTxt = await res.text();
    if (attempt === 5) throw new Error(`Batch-TTS submit failed (${res.status}): ${errTxt.slice(0, 260)}`);
    await new Promise((r) => setTimeout(r, attempt * 6000));
  }

  console.log(`   ⏳ Polling ${batchName} (${displayLabel}, ${jobs.length} extract[s])...`);
  let pollJson = null;
  for (let poll = 1; poll <= 220; poll++) {
    await new Promise((r) => setTimeout(r, 6000));
    let pRes;
    try {
      pRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/${batchName}`, {
        headers: { 'x-goog-api-key': apiKey },
      });
    } catch (_) {
      continue;
    }
    if (!pRes.ok) continue;
    pollJson = await pRes.json();
    const state = pollJson.metadata?.state || (pollJson.done ? 'BATCH_STATE_SUCCEEDED' : 'PENDING');
    if (pollJson.done || state === 'BATCH_STATE_SUCCEEDED') break;
    if (state === 'BATCH_STATE_FAILED' || state === 'BATCH_STATE_CANCELLED') {
      throw new Error(`Batch ${batchName} failed: ${state}`);
    }
  }

  const inlined =
    pollJson?.response?.inlinedResponses?.inlinedResponses ||
    pollJson?.metadata?.output?.inlinedResponses?.inlinedResponses ||
    [];
  if (inlined.length !== jobs.length) {
    throw new Error(`Batch ${batchName} returned ${inlined.length}/${jobs.length} responses.`);
  }

  for (let i = 0; i < jobs.length; i++) {
    const b64 = inlined[i]?.response?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData?.data;
    if (!b64) throw new Error(`Missing audio bytes for ${jobs[i].label}`);
    const bytes = encodeWavBufferToMp3(Buffer.from(b64, 'base64'), jobs[i].outMp3Path);
    jobs[i].onComplete(bytes);
    console.log(`   ✓ ${jobs[i].label} (${Math.round(bytes / 1024)} KB · [${jobs[i].voiceKey}])`);
  }
}

function findTopLevelObjectBounds(raw) {
  let i = 0;
  const n = raw.length;
  let firstBrace = -1;
  while (i < n) {
    if (raw[i] === '/' && raw[i + 1] === '/') {
      while (i < n && raw[i] !== '\n') i++;
      continue;
    }
    if (raw[i] === '/' && raw[i + 1] === '*') {
      i += 2;
      while (i < n && !(raw[i] === '*' && raw[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    if (raw[i] === '{') {
      firstBrace = i;
      break;
    }
    i++;
  }
  if (firstBrace === -1) return null;
  let depth = 0;
  let inStr = null;
  for (let j = firstBrace; j < n; j++) {
    const ch = raw[j];
    if (inStr) {
      if (ch === '\\') {
        j++;
        continue;
      }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inStr = ch;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return { firstBrace, closeBrace: j };
    }
  }
  return null;
}

function writeUnitMirrors(unitId, unitData) {
  const jsonStr = JSON.stringify(unitData, null, 2) + '\n';
  const dataPath = path.join(ROOT, 'data', `${unitId}.json`);
  const pubDataPath = path.join(ROOT, 'public', 'data', `${unitId}.json`);
  let changed = false;

  if (!fs.existsSync(dataPath) || fs.readFileSync(dataPath, 'utf8') !== jsonStr) {
    fs.writeFileSync(dataPath, jsonStr, 'utf8');
    changed = true;
  }
  if (fs.existsSync(path.dirname(pubDataPath))) {
    if (!fs.existsSync(pubDataPath) || fs.readFileSync(pubDataPath, 'utf8') !== jsonStr) {
      fs.writeFileSync(pubDataPath, jsonStr, 'utf8');
      changed = true;
    }
  }

  for (const baseDir of [path.join(ROOT, 'units', unitId), path.join(ROOT, 'public', 'units', unitId)]) {
    const dataJsPath = path.join(baseDir, 'data.js');
    if (!fs.existsSync(dataJsPath)) continue;
    const rawJs = fs.readFileSync(dataJsPath, 'utf8');
    const bounds = findTopLevelObjectBounds(rawJs);
    if (!bounds) continue;
    const nextJs =
      rawJs.slice(0, bounds.firstBrace) +
      JSON.stringify(unitData, null, 2) +
      rawJs.slice(bounds.closeBrace + 1);
    if (rawJs !== nextJs) {
      fs.writeFileSync(dataJsPath, nextJs, 'utf8');
      changed = true;
    }
  }
  return changed;
}

export async function syncPaper3InterpretationAudio(
  targetUnits = ['weimar_nazi_germany', 'usa'],
  { forceAudio = false, skipTts = false, skipDbBuild = false } = {},
) {
  const units = targetUnits.filter((u) => PAPER3_INTERPRETATION_UNITS.has(u));
  if (!units.length) return false;

  const mockBankPath = path.join(ROOT, 'src', 'engine', 'mock_exam_bank_data.js');
  const mockMod = await import(pathToFileURL(mockBankPath).href + `?t=${Date.now()}`);
  const mockBank = structuredClone(mockMod.UNIT_LESSON_MOCK_QUESTIONS);
  let mockBankChanged = false;
  let anyUnitDataChanged = false;

  const allJobs = [];
  const timingsPlanByUnit = new Map();

  for (const unitId of units) {
    const dataPath = path.join(ROOT, 'data', `${unitId}.json`);
    const unitData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const sourceAudioDir = path.join(ROOT, 'public', 'audio', 'sources', unitId);
    const hashPath = path.join(sourceAudioDir, 'audio_hashes.json');
    const hashManifest = loadHashManifest(hashPath);
    const alignTargets = [];

    // 1. Canonical `lesson.exam_practice.interpretations`
    for (const lesson of unitData.lessons || []) {
      const interps = lesson.exam_practice?.interpretations;
      if (!Array.isArray(interps) || interps.length === 0) continue;

      interps.forEach((it, idx) => {
        const num = String(it.interpNum || idx + 1);
        const rawText = String(it.content || it.text || it.extract || '').trim();
        if (!rawText) return;
        const castKey = `${unitId}:${lesson.id}:${num}`;
        const cast = CANONICAL_CLASH_CAST[castKey] || {
          voiceKey: num === '1' ? 'male_historian' : 'female_historian',
          style:
            num === '1'
              ? 'authoritative, analytical academic historian presenting Interpretation 1'
              : 'incisive, contrasting academic historian presenting Interpretation 2',
          badge: `Historian ${num} · Studio Voice`,
        };

        const clipId = `${lesson.id}_i${num}`;
        const relUrl = `/audio/sources/${unitId}/${clipId}.mp3`;
        const outMp3Path = path.join(sourceAudioDir, `${clipId}.mp3`);
        const spokenText = cleanTextForSpeech(rawText);
        const contentHash = sha256(`${cast.voiceKey}::${cast.style}::${spokenText}`);

        it.studio_audio = relUrl;
        it.studio_voice_label = cast.badge;
        // Also propagate onto per-question `q.interpretations` copies inside `lesson.exam_practice.questions`
        for (const epQ of lesson.exam_practice?.questions || []) {
          if (Array.isArray(epQ?.interpretations)) {
            epQ.interpretations.forEach((qIt, qIdx) => {
              const qNum = String(qIt?.interpNum || qIdx + 1);
              if (qNum === num && qIt && typeof qIt === 'object') {
                qIt.studio_audio = relUrl;
                qIt.studio_voice_label = cast.badge;
              }
            });
          }
        }
        alignTargets.push({ key: clipId, mp3Path: outMp3Path, rawText });

        const prev = hashManifest.clips[clipId];
        const exists = fs.existsSync(outMp3Path) && fs.statSync(outMp3Path).size > 2000;
        if (!forceAudio && exists && prev && prev.hash === contentHash) return;

        allJobs.push({
          unitId,
          voiceKey: cast.voiceKey,
          style: cast.style,
          text: spokenText,
          label: `sources/${unitId}/${clipId}.mp3`,
          outMp3Path,
          onComplete(bytes) {
            hashManifest.clips[clipId] = {
              hash: contentHash,
              bytes,
              voiceKey: cast.voiceKey,
              badge: cast.badge,
              updatedAt: new Date().toISOString(),
            };
            saveHashManifest(hashPath, hashManifest);
          },
        });
      });
    }

    // 2. Extra Mock `UNIT_LESSON_MOCK_QUESTIONS[unitId]` (`Q3b`, `Q3c`, `Q3d`)
    const unitMocksByLesson = mockBank[unitId] || {};
    const processedMockSets = new Map();
    let mockClashIdx = 0;

    for (const qList of Object.values(unitMocksByLesson)) {
      for (const q of qList) {
        const qStr = `${q.qCode || ''} ${q.questionText || q.question || ''}`;
        if (!/3\s*\(\s*[bcd]\s*\)|interpretation/i.test(qStr)) continue;
        if (!q.sourceExtract || !/interpretation/i.test(q.sourceExtract)) continue;

        const parsedInterps = parseMockInterpretationsFromHtml(q.sourceExtract);
        if (parsedInterps.length < 2) continue;

        const baseKey = q.mockId || String(q.id || '').replace(/_q3[a-d]$/i, '') || q.id;
        if (!processedMockSets.has(baseKey)) {
          mockClashIdx++;
          const flipGender = mockClashIdx % 2 === 0;
          const audioMeta = {};

          parsedInterps.slice(0, 2).forEach((it, idx) => {
            const num = String(it.interpNum || idx + 1);
            const isFirst = num === '1';
            const voiceKey = isFirst
              ? flipGender
                ? 'female_historian'
                : 'male_historian'
              : flipGender
                ? 'male_historian'
                : 'female_historian';
            const badge = isFirst ? 'Historian 1 · Academic View' : 'Historian 2 · Contrasting View';
            const style = isFirst
              ? 'clear, analytical British historian presenting the first historiographical interpretation'
              : 'incisive, contrasting British historian challenging the first view with an alternative focus';

            const clipId = `${baseKey}_i${num}`;
            const relUrl = `/audio/sources/${unitId}/${clipId}.mp3`;
            const outMp3Path = path.join(sourceAudioDir, `${clipId}.mp3`);
            const spokenText = cleanTextForSpeech(it.content);
            const contentHash = sha256(`${voiceKey}::${style}::${spokenText}`);

            audioMeta[num] = { studio_audio: relUrl, studio_voice_label: badge };
            alignTargets.push({ key: clipId, mp3Path: outMp3Path, rawText: it.content });

            const prev = hashManifest.clips[clipId];
            const exists = fs.existsSync(outMp3Path) && fs.statSync(outMp3Path).size > 2000;
            if (!forceAudio && exists && prev && prev.hash === contentHash) return;

            allJobs.push({
              unitId,
              voiceKey,
              style,
              text: spokenText,
              label: `sources/${unitId}/${clipId}.mp3`,
              outMp3Path,
              onComplete(bytes) {
                hashManifest.clips[clipId] = {
                  hash: contentHash,
                  bytes,
                  voiceKey,
                  badge,
                  updatedAt: new Date().toISOString(),
                };
                saveHashManifest(hashPath, hashManifest);
              },
            });
          });

          processedMockSets.set(baseKey, audioMeta);
        }

        const nextMeta = processedMockSets.get(baseKey);
        if (JSON.stringify(q.interpretations_audio || null) !== JSON.stringify(nextMeta)) {
          q.interpretations_audio = nextMeta;
          mockBankChanged = true;
        }
      }
    }

    if (writeUnitMirrors(unitId, unitData)) {
      anyUnitDataChanged = true;
    }
    timingsPlanByUnit.set(unitId, { sourceAudioDir, alignTargets });
  }

  if (mockBankChanged) {
    const p3BankPath = path.join(ROOT, 'src', 'engine', 'mock_exam_bank_p3.js');
    if (fs.existsSync(p3BankPath)) {
      const p3Only = {
        weimar_nazi_germany: mockBank.weimar_nazi_germany,
        usa: mockBank.usa,
      };
      fs.writeFileSync(
        p3BankPath,
        `/**\n * Paper 3 Unseen Mock Question Bank (Weimar & Nazi Germany, USA 1954–75).\n */\nexport const MOCK_BANK_P3 = ${JSON.stringify(p3Only, null, 2)};\n`,
        'utf8',
      );
    } else {
      const outMockJs = `/**
 * Auto-generated & curated Unseen Mock Question Bank per Unit & Lesson.
 * Consumed by Unified Workbook & Exam Practice Station.
 */

export const UNIT_LESSON_MOCK_QUESTIONS = ${JSON.stringify(mockBank, null, 2)};

export function getLessonMockQuestions(unitId, lessonId) {
  if (!unitId || !lessonId) return [];
  const unitMap = UNIT_LESSON_MOCK_QUESTIONS[unitId];
  if (!unitMap) return [];
  return unitMap[lessonId] || [];
}
`;
      fs.writeFileSync(mockBankPath, outMockJs, 'utf8');
    }
  }

  if (allJobs.length === 0) {
    for (const [unitId, { sourceAudioDir, alignTargets }] of timingsPlanByUnit.entries()) {
      refreshUnitSourceTimings(sourceAudioDir, alignTargets, false);
      console.log(
        `🎙️  [Paper 3 Historian Clashes · ${unitId}] ${alignTargets.length} historian extracts 100% up-to-date ($0.00 cost).`,
      );
    }
    if (anyUnitDataChanged && !skipDbBuild) {
      for (const u of units) {
        execFileSync('node', ['--check', path.join(ROOT, 'units', u, 'data.js')], { stdio: 'inherit' });
      }
      execFileSync('node', [path.join(ROOT, 'scripts', 'build_database.cjs')], { cwd: ROOT, stdio: 'inherit' });
    }
    return anyUnitDataChanged || mockBankChanged;
  }

  if (skipTts) {
    console.log(`⏭️  [Paper 3 Historian Clashes] --skip-tts set; ${allJobs.length} extract(s) queued.`);
    return anyUnitDataChanged || mockBankChanged;
  }

  const apiKey = resolveGeminiApiKey();
  if (!apiKey) throw new Error('GEMINI_API_KEY missing');

  const neededVoices = new Set(allJobs.map((j) => j.voiceKey));
  const voiceIdsByKey = {};
  for (const vk of neededVoices) {
    voiceIdsByKey[vk] = await ensureHouseVoiceId(apiKey, vk);
  }

  console.log(
    `🎬 [Paper 3 Historian Clashes] Synthesizing ${allJobs.length} contrasting historian extract(s) across ${units.join(' & ')} at 50% Batch discount...`,
  );

  const batchTasks = [];
  const byVoice = new Map();
  for (const j of allJobs) {
    if (!byVoice.has(j.voiceKey)) byVoice.set(j.voiceKey, []);
    byVoice.get(j.voiceKey).push(j);
  }
  const CHUNK_SIZE = 6;
  for (const [vk, list] of byVoice.entries()) {
    for (let off = 0; off < list.length; off += CHUNK_SIZE) {
      batchTasks.push({
        voiceKey: vk,
        jobs: list.slice(off, off + CHUNK_SIZE),
        tag: `hrh-p3-${vk}-${Math.floor(off / CHUNK_SIZE) + 1}`,
      });
    }
  }

  let cursor = 0;
  const workers = Array.from({ length: Math.min(6, batchTasks.length) }, async (_, wIdx) => {
    if (wIdx > 0) await new Promise((r) => setTimeout(r, wIdx * 800));
    while (cursor < batchTasks.length) {
      const idx = cursor++;
      if (idx >= batchTasks.length) break;
      const bt = batchTasks[idx];
      await runSingleBatchChunk(apiKey, voiceIdsByKey[bt.voiceKey], bt.jobs, bt.tag);
    }
  });

  await Promise.all(workers);

  for (const [unitId, { sourceAudioDir, alignTargets }] of timingsPlanByUnit.entries()) {
    refreshUnitSourceTimings(sourceAudioDir, alignTargets, true);
    console.log(
      `⏱️  [Paper 3 Timings · ${unitId}] Synchronized acoustic sentence windows across ${alignTargets.length} historian extracts.`,
    );
  }

  if (!skipDbBuild) {
    for (const u of units) {
      execFileSync('node', ['--check', path.join(ROOT, 'units', u, 'data.js')], { stdio: 'inherit' });
    }
    execFileSync('node', ['--check', mockBankPath], { stdio: 'inherit' });
    execFileSync('node', [path.join(ROOT, 'scripts', 'build_database.cjs')], { cwd: ROOT, stdio: 'inherit' });
  }

  console.log(`🎉 All ${allJobs.length} Paper 3 Two-Historian Interpretation Clash MP3s & timings.json synchronized!`);
  return true;
}

function refreshUnitSourceTimings(sourceAudioDir, alignTargets, forceRebuild) {
  const timingsPath = path.join(sourceAudioDir, 'timings.json');
  const existing = fs.existsSync(timingsPath) ? JSON.parse(fs.readFileSync(timingsPath, 'utf8')) : {};
  let updated = forceRebuild || !fs.existsSync(timingsPath);
  for (const t of alignTargets) {
    if (fs.existsSync(t.mp3Path) && (forceRebuild || !existing[t.key])) {
      existing[t.key] = alignSentencesToMp3(t.mp3Path, t.rawText);
      updated = true;
    }
  }
  if (updated) {
    fs.mkdirSync(sourceAudioDir, { recursive: true });
    fs.writeFileSync(timingsPath, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const forceAudio = args.includes('--force-audio');
  const skipTts = args.includes('--skip-tts');
  const targetArg = args.find((a) => !a.startsWith('-'));
  const targets = targetArg ? [targetArg] : ['weimar_nazi_germany', 'usa'];
  await syncPaper3InterpretationAudio(targets, { forceAudio, skipTts });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('❌ [Paper 3 Historian Clashes] Fatal error:', err);
    process.exit(1);
  });
}
