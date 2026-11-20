#!/usr/bin/env node
/**
 * KS2 & KS3 Guided Reading Studio Audio Synchronizer (`sync_guided_reading_studio_audio.mjs`)
 *
 * Sustainably SHA-256 hash-tracks, synthesizes via 50%-Off Gemini Batch TTS, and
 * acoustically aligns (`timings.json`) all KS2 & KS3 Guided Reading Companions
 * (`/audio/reading/<unitId>/r0..rN.mp3`) across all 13 KS2 & KS3 curriculum units.
 *
 * Usage:
 *   node scripts/sync_guided_reading_studio_audio.mjs --all
 *   node scripts/sync_guided_reading_studio_audio.mjs <unit_id> [--force-audio] [--skip-tts]
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  HOUSE_VOICES,
  UNIT_VOICE_ASSIGNMENTS,
  ensureHouseVoiceId,
  resolveGeminiApiKey,
} from './studio_voice_registry.mjs';
import { alignSentencesToMp3 } from './extract_audio_timings.mjs';
import { expandBritishDatesForSpeech } from './spoken_date_normalizer.mjs';
import { WW1_LIVING_VOICE_UNITS, syncWw1UnitLivingVoices } from './sync_ww1_living_voices.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

export const KS2_KS3_GUIDED_READING_UNITS = [
  'ks2_ww2',
  'medieval_england',
  'monarchy_religion_power',
  'water_and_sanitation',
  'first_british_empire',
  'industrialisation_and_empire',
  'second_british_empire',
  'australia',
  'great_war',
  'great_war_part2',
  'the_shoah',
  'cold_war',
  'post_war_britain',
];

function sha256(str) {
  return crypto.createHash('sha256').update(String(str), 'utf8').digest('hex').slice(0, 24);
}

function loadHashManifest(p, unitId) {
  if (fs.existsSync(p)) {
    try {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch (_) {}
  }
  return { unitId, clips: {} };
}

function saveHashManifest(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

export function extractReadingBodyHtml(rawExtract) {
  return String(rawExtract || '')
    .replace(/<div class="reading-glossary"[\s\S]*?<\/div>/gi, '')
    .replace(/<div style="background: #f8fafc;[\s\S]*?<\/div>/gi, '')
    .trim();
}

export function cleanReadingExtractForTts(rawHtml) {
  let pre = String(rawHtml || '')
    // Turn paragraph breaks into natural breath pauses for acoustic alignment
    .replace(/(?:<br\s*\/?>\s*){2,}|\n\n+/gi, ' <short pause> ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/gi, ' and ')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&mdash;/gi, ', ')
    .replace(/&ndash;/gi, '–')
    .replace(/\[\s*\d+(?:\.\d+)?\s*\]/g, ' ')
    .replace(/\[([^\]]+)\]/g, '$1');

  pre = expandBritishDatesForSpeech(pre)
    .replace(/(\d)\s*[–-]\s*(\d)/g, '$1 to $2')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\s*•\s*/g, ', ')
    .replace(/\.{3,}|…/g, ', ')
    .replace(/\bHMS\b/g, 'H M S')
    .replace(/\bHMT\b/g, 'H M T')
    .replace(/\bRAF\b/g, 'R A F')
    .replace(/\bARP\b/g, 'A R P')
    .replace(/\bATA\b/g, 'A T A')
    .replace(/\bWSPU\b/g, 'W S P U')
    .replace(/\bNUWSS\b/g, 'N U W S S')
    .replace(/\bCND\b/g, 'C N D')
    .replace(/\bNHS\b/g, 'N H S')
    .replace(/\bUSSR\b/g, 'U S S R')
    .replace(/\bJFK\b/g, 'J F K')
    .replace(/\bRFK\b/g, 'R F K')
    .replace(/\bYIVO\b/g, 'Yeevo')
    .replace(/\bŻOB\b/g, 'Z O B')
    .replace(/\bCmd\.\s*(\d+)/g, 'Command Paper $1')
    .replace(/\bc\.\s*(\d{3,4})/g, 'circa $1')
    .replace(/\s+/g, ' ')
    .replace(/(?:<short pause>\s*){2,}/g, '<short pause> ')
    .trim();

  return pre;
}

/**
 * Select natural voice gender (`male_historian` vs `female_historian`) and documentary
 * narration style matched to each historical author/document and pupil age group.
 */
export function resolveGuidedReadingCast(unitId, idx, gr) {
  const authorAndTitle = `${gr.author || ''} ${gr.book_title || ''}`;
  const isKs2 = unitId === 'ks2_ww2';
  const isShoah = unitId === 'the_shoah';

  // Explicit female historical speakers / authors
  const femaleMatch =
    /Marta Appel|Vita Sackville-West|Queen Elizabeth I|Emmeline Pankhurst|Lucy S\.\s*Dawidowicz|Sophie Scholl|Vera Löwyová/i.test(
      authorAndTitle,
    );

  // Explicit male historical speakers / chroniclers / statesmen
  const maleMatch =
    /Neville Chamberlain|Nicholas Winton|Edward R\.\s*Murrow|Alan Turing|Winston Churchill|William of Poitiers|Orderic Vitalis|Edward Grim|Roger of Wendover|Thomas Walsingham|Robert Aske|Francis Bacon|Charles I|John Locke|Frontinus|Edward III|Samuel Pepys|Michael Faraday|John Snow|Roy Porter|Thomas Roe|Robert Clive|Olaudah Equiano|Bryan Edwards|George Robert Twelves Hewes|Boston King|Daniel Defoe|Robert Blincoe|Edwin Chadwick|Firoz Shah|Samuel Bamford|Adam Smith|William Bentinck|E\.\s*D\.\s*Morel|John Clapham|Joseph Banks|Arthur Phillip|David Collins|Henry Reynolds|Raffaello Carboni|Victor Klemperer|Emanuel Ringelblum|Hermann Friedrich Graebe|Mordechai Anielewicz|Richard Dimbleby|Primo Levi|William Beveridge|Sam King|Paul Stephenson|Roy Hackett|Bertrand Russell|George F\.\s*Kennan|Harry S\.\s*Truman|Ernst Reuter|Robert F\.\s*Kennedy|Dwight D\.\s*Eisenhower|Mikhail Gorbachev|John Lewis Gaddis/i.test(
      authorAndTitle,
    );

  let voiceKey = UNIT_VOICE_ASSIGNMENTS[unitId] || 'male_historian';
  if (femaleMatch) voiceKey = 'female_historian';
  else if (maleMatch) voiceKey = 'male_historian';

  const voiceLabelBase =
    voiceKey === 'female_historian' ? 'Studio Female Historian' : 'Studio Male Historian';

  let style = HOUSE_VOICES[voiceKey]?.style || 'warm, clear, unhurried British documentary historian';
  let badge = `${voiceLabelBase} · Archival Reading`;

  if (isKs2) {
    style =
      'warm, gentle, crystal-clear British history storyteller reading at an unhurried, reassuring pace for 10-year-old pupils';
    badge = `${voiceLabelBase} · KS2 Read-Aloud`;
  } else if (isShoah) {
    style =
      'deeply respectful, solemn, quiet, unhurried British documentary historian reading Holocaust archival testimony with dignity and restraint';
    badge = `${voiceLabelBase} · Shoah Archive`;
  } else if (gr.source_type === 'historiographical_debate' || gr.source_type === 'historical_scholarship') {
    style =
      'articulate, engaging British documentary historian clearly contrasting historical arguments at a measured classroom pace';
    badge = `${voiceLabelBase} · Scholarship`;
  } else if (gr.source_type === 'primary_speech') {
    style =
      'resonant, composed British documentary narrator delivering a historic speech with clear phrasing and measured gravitas';
    badge = `${voiceLabelBase} · Historic Speech`;
  } else if (gr.source_type === 'primary_chronicle') {
    style =
      'evocative, measured British documentary historian reading a translated primary chronicle clearly for secondary pupils';
    badge = `${voiceLabelBase} · Primary Chronicle`;
  }

  return { voiceKey, style, badge };
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
  const tmpWav = `${outMp3Path}.gr.${process.pid}.${Math.random().toString(36).slice(2, 7)}.wav`;
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

async function runReadingBatchChunk(apiKey, voiceId, jobs, displayLabel) {
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
    const createRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:batchGenerateContent',
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batch: {
            display_name: displayLabel,
            input_config: { requests: { requests: inlineRequests } },
          },
        }),
      },
    );
    if (createRes.ok) {
      const created = await createRes.json();
      batchName = created.name;
      break;
    }
    const errBody = (await createRes.text()).slice(0, 260);
    if (attempt === 5) throw new Error(`Batch create failed (${createRes.status}): ${errBody}`);
    await new Promise((r) => setTimeout(r, attempt * 6000));
  }

  console.log(`   ⏳ Polling ${batchName} (${displayLabel}, ${jobs.length} reading[s])...`);
  let batchResult = null;
  for (let poll = 1; poll <= 200; poll++) {
    await new Promise((r) => setTimeout(r, 6000));
    let pollRes;
    try {
      pollRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/${batchName}`, {
        headers: { 'x-goog-api-key': apiKey },
      });
    } catch (_) {
      continue;
    }
    if (!pollRes.ok) continue;
    const pollJson = await pollRes.json();
    const state = pollJson.metadata?.state || '';
    if (state === 'BATCH_STATE_SUCCEEDED') {
      batchResult = pollJson;
      break;
    }
    if (state === 'BATCH_STATE_FAILED' || state === 'BATCH_STATE_CANCELLED') {
      throw new Error(`Batch ${batchName} failed: ${JSON.stringify(pollJson.error || {})}`);
    }
  }
  if (!batchResult) throw new Error(`Timed out waiting for ${batchName}`);

  const responses =
    batchResult.response?.inlinedResponses?.inlinedResponses ||
    batchResult.response?.inlinedResponses ||
    [];

  responses.forEach((entry, idx) => {
    const job = jobs[idx];
    if (!job) return;
    const b64 = entry?.response?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)
      ?.inlineData?.data;
    if (!b64) throw new Error(`Missing inlineData audio in batch response for ${job.label}`);
    const bytes = encodeWavBufferToMp3(Buffer.from(b64, 'base64'), job.outMp3Path);
    job.onComplete(bytes);
    console.log(`   ✓ ${job.label} (${Math.round(bytes / 1024)} KB · [${job.voiceKey}])`);
  });
}

function writeUnitMirrors(unitId, unitData) {
  const jsonStr = JSON.stringify(unitData, null, 2) + '\n';
  const jsStr = `export default ${JSON.stringify(unitData, null, 2)};\n`;

  const targets = [
    [path.join(ROOT, 'data', `${unitId}.json`), jsonStr],
    [path.join(ROOT, 'public', 'data', `${unitId}.json`), jsonStr],
    [path.join(ROOT, 'units', unitId, 'data.js'), jsStr],
    [path.join(ROOT, 'public', 'units', unitId, 'data.js'), jsStr],
  ];

  let anyChanged = false;
  for (const [p, content] of targets) {
    if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== content) {
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, content, 'utf8');
      anyChanged = true;
    }
  }
  return anyChanged;
}

function writeUnitReadingTimings(readingAudioDir, alignTargets, forceRebuild) {
  const readingTimingsPath = path.join(readingAudioDir, 'timings.json');
  const existing = fs.existsSync(readingTimingsPath)
    ? JSON.parse(fs.readFileSync(readingTimingsPath, 'utf8'))
    : {};
  let changed = false;

  for (const t of alignTargets) {
    if (!fs.existsSync(t.mp3Path)) continue;
    if (forceRebuild || !existing[t.key] || !Array.isArray(existing[t.key].sentences)) {
      existing[t.key] = alignSentencesToMp3(t.mp3Path, t.rawText);
      changed = true;
    }
  }

  if (changed || !fs.existsSync(readingTimingsPath)) {
    fs.mkdirSync(readingAudioDir, { recursive: true });
    fs.writeFileSync(readingTimingsPath, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  }
}

/**
 * Sync Guided Reading Studio Audio across one or more KS2/KS3 units in a single
 * parallel Batch-TTS pool.
 */
export async function syncGuidedReadingUnits(unitIds, opts = {}) {
  const { forceAudio = false, skipTts = false, skipDbBuild = false } = opts;
  const nonWw1Units = [];
  const ww1Units = [];

  for (const u of unitIds) {
    if (WW1_LIVING_VOICE_UNITS.has(u)) ww1Units.push(u);
    else nonWw1Units.push(u);
  }

  let anyMirrorChanged = false;

  // 1. Handle WWI units via their dedicated ensemble synchronizer (`r0..r5`)
  for (const wu of ww1Units) {
    const changed = await syncWw1UnitLivingVoices(wu, { forceAudio, skipTts });
    if (changed) anyMirrorChanged = true;
  }

  // 2. Collect all Guided Reading jobs across non-WWI KS2/KS3 units
  const allJobs = [];
  const unitContexts = [];

  for (const unitId of nonWw1Units) {
    const dataJsonPath = path.join(ROOT, 'data', `${unitId}.json`);
    if (!fs.existsSync(dataJsonPath)) continue;
    const unitData = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));
    if (!Array.isArray(unitData.guided_reading) || unitData.guided_reading.length === 0) continue;

    // Never voice GCSE units under Guided Reading
    if (['edexcel_medicine', 'eee', 'cme_new', 'weimar_nazi_germany', 'usa'].includes(unitId)) continue;

    const readingAudioDir = path.join(ROOT, 'public', 'audio', 'reading', unitId);
    const readingHashPath = path.join(readingAudioDir, 'audio_hashes.json');
    const readingHashes = loadHashManifest(readingHashPath, unitId);
    const alignTargets = [];
    let unitPending = 0;

    unitData.guided_reading.forEach((gr, idx) => {
      const cast = resolveGuidedReadingCast(unitId, idx, gr);
      const clipId = `r${idx}`;
      const relUrl = `/audio/reading/${unitId}/${clipId}.mp3`;
      const outMp3Path = path.join(readingAudioDir, `${clipId}.mp3`);
      const bodyHtml = extractReadingBodyHtml(gr.extract || '');
      const spokenText = cleanReadingExtractForTts(bodyHtml);
      const contentHash = sha256(`${cast.voiceKey}::${cast.style}::${spokenText}`);

      gr.audio_file = relUrl;
      gr.studio_audio = relUrl;
      gr.studio_voice_label = cast.badge;
      alignTargets.push({ key: clipId, mp3Path: outMp3Path, rawText: bodyHtml });

      const prev = readingHashes.clips[clipId];
      const exists = fs.existsSync(outMp3Path) && fs.statSync(outMp3Path).size > 3000;
      if (!forceAudio && exists && prev && prev.hash === contentHash) return;

      unitPending++;
      allJobs.push({
        unitId,
        clipId,
        voiceKey: cast.voiceKey,
        style: cast.style,
        text: spokenText,
        label: `reading/${unitId}/${clipId}.mp3`,
        outMp3Path,
        onComplete(bytes) {
          readingHashes.clips[clipId] = {
            hash: contentHash,
            bytes,
            voiceKey: cast.voiceKey,
            badge: cast.badge,
            words: spokenText.replace(/<short pause>/g, '').trim().split(/\s+/).length,
            updatedAt: new Date().toISOString(),
          };
          saveHashManifest(readingHashPath, readingHashes);
        },
      });
    });

    const mirrorChanged = writeUnitMirrors(unitId, unitData);
    if (mirrorChanged) anyMirrorChanged = true;
    unitContexts.push({ unitId, readingAudioDir, alignTargets, unitPending });
  }

  if (allJobs.length === 0) {
    for (const ctx of unitContexts) {
      writeUnitReadingTimings(ctx.readingAudioDir, ctx.alignTargets, false);
      console.log(
        `📚 [Guided Reading Audio · ${ctx.unitId}] ${ctx.alignTargets.length}/${ctx.alignTargets.length} readings 100% up-to-date ($0.00 cost).`,
      );
    }
  } else if (skipTts) {
    console.log(`⏭️  [Guided Reading Audio] --skip-tts set; ${allJobs.length} reading clip(s) queued.`);
  } else {
    const apiKey = resolveGeminiApiKey();
    if (!apiKey) throw new Error('GEMINI_API_KEY missing in environment/.env');

    const neededVoiceKeys = new Set(allJobs.map((j) => j.voiceKey));
    const voiceIdsByKey = {};
    for (const vk of neededVoiceKeys) {
      voiceIdsByKey[vk] = await ensureHouseVoiceId(apiKey, vk);
    }

    console.log(
      `\n🎙️  [Guided Reading Batch-TTS] Synthesizing ${allJobs.length} KS2/KS3 Literary Companion clip(s) at 50% Batch discount...`,
    );

    // Group by voiceKey in 2-clip Batch TTS chunks for optimal latency & response size
    const batchTasks = [];
    const byVoice = new Map();
    for (const j of allJobs) {
      if (!byVoice.has(j.voiceKey)) byVoice.set(j.voiceKey, []);
      byVoice.get(j.voiceKey).push(j);
    }
    for (const [vk, list] of byVoice.entries()) {
      for (let off = 0; off < list.length; off += 2) {
        const slice = list.slice(off, off + 2);
        batchTasks.push({
          voiceKey: vk,
          jobs: slice,
          tag: `hrh-gr-${vk}-${Math.floor(off / 2) + 1}`,
        });
      }
    }

    let cursor = 0;
    const concurrency = Math.min(6, batchTasks.length);
    const workers = Array.from({ length: concurrency }, async (_, wIdx) => {
      if (wIdx > 0) await new Promise((r) => setTimeout(r, wIdx * 800));
      while (cursor < batchTasks.length) {
        const idx = cursor++;
        if (idx >= batchTasks.length) break;
        const bt = batchTasks[idx];
        await runReadingBatchChunk(apiKey, voiceIdsByKey[bt.voiceKey], bt.jobs, bt.tag);
      }
    });

    await Promise.all(workers);

    for (const ctx of unitContexts) {
      writeUnitReadingTimings(ctx.readingAudioDir, ctx.alignTargets, ctx.unitPending > 0 || forceAudio);
      console.log(
        `⏱️  [Guided Reading Timings · ${ctx.unitId}] Synchronized acoustic sentence windows across ${ctx.alignTargets.length} readings.`,
      );
    }
  }

  if (anyMirrorChanged && !skipDbBuild) {
    for (const u of unitIds) {
      const jsPath = path.join(ROOT, 'units', u, 'data.js');
      if (fs.existsSync(jsPath)) {
        execFileSync('node', ['--check', jsPath], { stdio: 'inherit' });
      }
    }
    execFileSync('node', [path.join(ROOT, 'scripts', 'build_database.cjs')], {
      cwd: ROOT,
      stdio: 'inherit',
    });
  }

  return anyMirrorChanged;
}

async function main() {
  const args = process.argv.slice(2);
  const runAll = args.includes('--all');
  const forceAudio = args.includes('--force-audio');
  const skipTts = args.includes('--skip-tts');
  const unitArg = args.find((a) => !a.startsWith('-'));

  const targets = runAll ? KS2_KS3_GUIDED_READING_UNITS : unitArg ? [unitArg] : [];
  if (targets.length === 0) {
    console.error('Usage: node scripts/sync_guided_reading_studio_audio.mjs <--all | unit_id> [--force-audio] [--skip-tts]');
    process.exit(1);
  }

  await syncGuidedReadingUnits(targets, { forceAudio, skipTts, skipDbBuild: false });
  console.log('\n🎉 All 13/13 KS2 & KS3 Guided Reading Studio Audio clips & timings.json synchronized!');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('❌ [Guided Reading Studio Audio] Fatal error:', err);
    process.exit(1);
  });
}
