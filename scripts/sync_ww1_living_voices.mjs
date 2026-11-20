/**
 * Year 9 WWI "Voices of the Great War" Studio Synchronizer (`sync_ww1_living_voices.mjs`)
 *
 * Sustainably SHA-256 hash-tracks, synthesizes, and acoustically aligns (`timings.json`)
 * all 56 extended Read-Aloud assets across `great_war` (Part 1) and `great_war_part2` (Part 2):
 *   1. 11 Atmospheric Lesson `Prologue` Cold-Opens (`/audio/lessons/<unitId>/<lessonId>_prologue.mp3`)
 *   2. 10 Cast-Acted Guided Reading Literary & Eyewitness Companions (`/audio/reading/<unitId>/r0..r4.mp3`)
 *   3. 35 First-Person & Archival Written `Sources A–E` (`/audio/sources/<unitId>/<lessonId>_s<Letter>.mp3`),
 *      including 2 Multi-Speaker Dramatisations (A. J. P. Taylor vs John Keegan; Southwark Tribunal 1916).
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  ALL_STUDIO_VOICES,
  ensureHouseVoiceId,
  resolveGeminiApiKey,
} from './studio_voice_registry.mjs';
import { alignSentencesToMp3 } from './extract_audio_timings.mjs';
import { expandBritishDatesForSpeech } from './spoken_date_normalizer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

export const WW1_LIVING_VOICE_UNITS = new Set(['great_war', 'great_war_part2']);

function sha256(str) {
  return crypto.createHash('sha256').update(String(str), 'utf8').digest('hex');
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

export function cleanTextForSpeech(rawHtml) {
  const pre = String(rawHtml || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/gi, ' and ')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&mdash;/gi, ', ')
    .replace(/&ndash;/gi, '–')
    .replace(/\[\s*\d+(?:\.\d+)?\s*\]/g, ' ')
    .replace(/\[([^\]]+)\]/g, '$1');

  return expandBritishDatesForSpeech(pre)
    .replace(/(\d)\s*[–-]\s*(\d)/g, '$1 to $2')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\s*•\s*/g, ', ')
    .replace(/\.{3,}|…/g, ', ')
    .replace(/\bHMS\b/g, 'H M S')
    .replace(/\bSMS\b/g, 'S M S')
    .replace(/\bRAMC\b/g, 'R A M C')
    .replace(/\bBWIR\b/g, 'British West Indies Regiment')
    .replace(/\bKRRC\b/g, 'King’s Royal Rifle Corps')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Curated Voice Casting Matrix for Guided Reading Companions (10 Extracts)
 */
const GUIDED_READING_CAST = {
  'great_war:0': {
    voiceKey: 'male_historian',
    style: 'authoritative, measured British documentary historian analysing the 1914 July Crisis',
    badge: 'Studio Historian · Christopher Clark',
  },
  'great_war:1': {
    voiceKey: 'ww1_british_officer',
    style: 'brooding, atmospheric Edwardian literary narrator recounting European imperialism',
    badge: 'Edwardian Narrator · Joseph Conrad',
  },
  'great_war:2': {
    voiceKey: 'ww1_british_officer',
    style: 'observant, brisk Edwardian British yachtsman navigating the misty North Sea coast in 1903',
    badge: 'Edwardian Yachtsman · Erskine Childers',
  },
  'great_war:3': {
    voiceKey: 'female_historian',
    style: 'crisp, gripping narrative historian building the diplomatic tension of August 1914',
    badge: 'Studio Historian · Barbara W. Tuchman',
  },
  'great_war:4': {
    voiceKey: 'ww1_german_voice',
    style: 'quiet, haunted young German soldier reflecting with sorrow on lost youth in the trenches',
    badge: 'Paul Bäumer · Young German Soldier',
  },
  'great_war_part2:0': {
    voiceKey: 'ww1_british_officer',
    style: 'weary, understated young British infantry officer contrasting peaceful England with the trenches',
    badge: 'Lt. Siegfried Sassoon · Infantry Officer',
  },
  'great_war_part2:1': {
    voiceKey: 'ww1_german_voice',
    style: 'taut, steel-nerved German frontline officer describing intense artillery bombardment',
    badge: 'Lt. Ernst Jünger · German Frontline',
  },
  'great_war_part2:2': {
    voiceKey: 'ww1_indian_sepoy',
    style: 'warm, dignified Indian Army Subadar reading heartfelt wartime letters home from Brighton and Flanders',
    badge: 'Garhwali Subadar · Indian Army Letters',
  },
  'great_war_part2:3': {
    voiceKey: 'ww1_british_woman',
    style: 'earnest, compassionate young English VAD nurse recalling hospital wards in London and Étaples',
    badge: 'Vera Brittain · Wartime VAD Nurse',
  },
  'great_war_part2:4': {
    voiceKey: 'male_historian',
    style: 'incisive, disillusioned British Treasury delegate witnessing the 1919 Versailles Peace Conference',
    badge: 'J. M. Keynes · Versailles Delegate',
  },
};

/**
 * Curated Voice Casting Matrix for Written Primary Sources (`Sources A–E`)
 */
const SOURCE_CAST = {
  // great_war (Part 1 — Causes of WWI)
  'great_war:lesson_1:C': {
    voiceKey: 'male_historian',
    style: 'formal, solemn diplomatic archive reading of the 1871 Treaty of Frankfurt',
    badge: 'Treaty of Frankfurt (1871)',
  },
  'great_war:lesson_1:E': {
    voiceKey: 'ww1_german_voice',
    style: 'measured, confidential Bismarckian diplomatic tone reading the 1887 Reinsurance Treaty',
    badge: 'Secret Reinsurance Treaty (1887)',
  },
  'great_war:lesson_2:B': {
    voiceKey: 'ww1_german_voice',
    style: 'assertive German Foreign Secretary addressing the Reichstag demanding a Place in the Sun',
    badge: 'Bernhard von Bülow (1897)',
  },
  'great_war:lesson_2:D': {
    voiceKey: 'ww1_german_voice',
    style: 'imperious, resolute German Kaiser dictating an urgent diplomatic telegram from Tangier',
    badge: 'Kaiser Wilhelm II (1905)',
  },
  'great_war:lesson_2:E': {
    voiceKey: 'ww1_british_officer',
    style: 'firm, eloquent British Cabinet minister delivering a grave diplomatic warning at Mansion House',
    badge: 'David Lloyd George (1911)',
  },
  'great_war:lesson_3:A': {
    voiceKey: 'male_historian',
    style: 'clear, formal British parliamentary reading of the 1889 Naval Defence Act',
    badge: 'Naval Defence Act (1889)',
  },
  'great_war:lesson_3:B': {
    voiceKey: 'ww1_german_voice',
    style: 'calculated, strategic German Admiral presenting the 1900 Second Naval Law',
    badge: 'Admiral Tirpitz · Naval Law (1900)',
  },
  'great_war:lesson_3:C': {
    voiceKey: 'ww1_british_officer',
    style: 'blunt, fiercely decisive First Sea Lord addressing the Admiralty Board in 1904',
    badge: 'Admiral Sir John Fisher (1904)',
  },
  'great_war:lesson_3:E': {
    voiceKey: 'male_historian',
    style: 'crisp, clear Admiralty statistical briefing to the House of Commons in March 1914',
    badge: 'Admiralty Return (1914)',
  },
  'great_war:lesson_4:A': {
    voiceKey: 'ww1_german_voice',
    style: 'formal, solemn Austro-German treaty reading of the 1879 Dual Alliance',
    badge: 'Dual Alliance Treaty (1879)',
  },
  'great_war:lesson_4:B': {
    voiceKey: 'male_historian',
    style: 'precise, confidential military staff reading of the 1894 Franco-Russian Convention',
    badge: 'Franco-Russian Pact (1894)',
  },
  'great_war:lesson_4:C': {
    voiceKey: 'ww1_german_voice',
    style: 'aged, solemn Habsburg Emperor proclaiming sovereignty over Bosnia and Herzegovina',
    badge: 'Emperor Franz Joseph (1908)',
  },
  'great_war:lesson_5:B': {
    voiceKey: 'ww1_german_voice',
    style: 'grave, confidential Berlin diplomatic dispatch pledging unconditional German support',
    badge: 'German "Blank Cheque" (6 July 1914)',
  },
  'great_war:lesson_5:C': {
    voiceKey: 'ww1_german_voice',
    style: 'cold, uncompromising diplomatic ultimatum delivered from Vienna to Belgrade',
    badge: 'Vienna Ultimatum (23 July 1914)',
  },
  'great_war:lesson_5:D': {
    voiceKey: 'ww1_british_officer',
    style: 'grave, solemn imperial decree ordering general Russian mobilisation in July 1914',
    badge: 'Tsar Nicholas II Decree (30 July 1914)',
  },
  'great_war:lesson_6:A': {
    voiceKey: 'ww1_german_voice',
    style: 'confidential, hushed diary entry recording the secret December 1912 Potsdam War Council',
    badge: 'Admiral von Müller Diary (1912)',
  },
  'great_war:lesson_6:B': {
    voiceKey: 'female_historian',
    style: 'insightful modern Cambridge historian challenging single-villain explanations of 1914',
    badge: 'Modern View · Christopher Clark',
  },
  'great_war:lesson_6:C': {
    voiceKey: 'male_historian',
    style: 'forceful, analytical historian arguing German leadership deliberately engineered war in 1914',
    badge: 'Fischer Thesis · Fritz Fischer',
  },
  'great_war:lesson_6:D': {
    voiceKey: 'ww1_british_officer',
    style: 'intimate, weary British Prime Minister confiding in a private letter during the August 1914 crisis',
    badge: 'PM H. H. Asquith (2 Aug 1914)',
  },

  // great_war_part2 (Part 2 — Fighting & Flawed Peace)
  'great_war_part2:lesson_1_enlistment:B': {
    voiceKey: 'ww1_british_officer',
    style: 'commanding, urgent Field Marshal rallying volunteers at the London Guildhall in September 1914',
    badge: 'Lord Kitchener (Sept 1914)',
  },
  'great_war_part2:lesson_1_enlistment:C': {
    voiceKey: 'male_historian',
    style: 'crisp War Office administrative directive sanctioning locally raised Pals Battalions',
    badge: 'War Office Pals Directive (1914)',
  },
  'great_war_part2:lesson_1_enlistment:D': {
    voiceKey: 'female_historian',
    style: 'brisk, spirited, rhythmic 1915 patriotic recruiting poem treating war like a sporting game',
    badge: 'Jessie Pope · Recruiting Verse (1915)',
  },
  'great_war_part2:lesson_1_enlistment:E': {
    voiceKey: 'ww1_british_tommy',
    style: 'quiet, candid working-class teenage British soldier recalling enlistment and terrible disillusionment',
    badge: 'Pte. Arthur Savage · Eyewitness',
  },
  'great_war_part2:lesson_2_trenches_haig:B': {
    voiceKey: 'ww1_british_officer',
    style: 'clinical, sombre Royal Army Medical Corps officer recording severe trench foot and shell shock',
    badge: 'RAMC Medical Report (1916)',
  },
  'great_war_part2:lesson_2_trenches_haig:C': {
    voiceKey: 'ww1_british_officer',
    style: 'assured, formal Fourth Army staff directive promising total destruction of German wire before the Somme',
    badge: 'Fourth Army Somme Plan (June 1916)',
  },
  'great_war_part2:lesson_2_trenches_haig:D': {
    voiceKey: 'ww1_british_tommy',
    style: 'haunted, plain-spoken British machine-gunner recalling uncut wire and slaughter on 1 July 1916',
    badge: 'Pte. George Coppard (1 July 1916)',
  },
  'great_war_part2:lesson_2_trenches_haig:E': {
    multiSpeaker: true,
    badge: '2-Voice Debate · Taylor vs Keegan',
    speakers: [
      { speaker: 'Taylor', voiceKey: 'ww1_british_officer' },
      { speaker: 'Keegan', voiceKey: 'male_historian' },
    ],
    turns: [
      {
        speaker: 'Taylor',
        style: 'sharp, biting, indignant Oxford historian condemning First World War generals',
        text: "A. J. P. Taylor, 1963: 'The British generals were blind to the conditions of modern war. Haig was a stubborn donkey who sent hundreds of thousands of brave young men to their deaths on the Somme because he could conceive of no other tactic than walking into machine-gun fire.'",
      },
      {
        speaker: 'Keegan',
        style: 'measured, analytical military historian explaining battlefield communication limits and the learning curve',
        text: "John Keegan, 1976: 'Haig faced a strategic and technological problem that no commander in Europe knew how to solve. With primitive radio communications and vast conscript armies, generals could not control a battle once it began. Far from being unthinking butchers, the British high command underwent a brutal but necessary learning curve that ultimately created the all-arms army that won the war in 1918.'",
      },
    ],
  },
  'great_war_part2:lesson_3_empire_troops:E': {
    voiceKey: 'male_historian',
    style: 'sobering, serious official inquiry detailing racial discrimination against British West Indies soldiers at Taranto',
    badge: 'Taranto Inquiry Report (Dec 1918)',
  },
  'great_war_part2:lesson_4_home_front_dora:A': {
    voiceKey: 'male_historian',
    style: 'stern wartime emergency statute reading of the Defence of the Realm Act, August 1914',
    badge: 'DORA Section 1 (Aug 1914)',
  },
  'great_war_part2:lesson_4_home_front_dora:C': {
    voiceKey: 'ww1_british_woman',
    style: 'weary yet determined young female shell-factory worker describing yellow TNT skin and constant danger in 1917',
    badge: 'Lilian Miles · Munitionette (1917)',
  },
  'great_war_part2:lesson_4_home_front_dora:D': {
    multiSpeaker: true,
    badge: '2-Voice Tribunal Hearing (1916)',
    speakers: [
      { speaker: 'Chairman', voiceKey: 'ww1_british_officer' },
      { speaker: 'Applicant', voiceKey: 'ww1_british_tommy' },
    ],
    turns: [
      {
        speaker: 'Chairman',
        style: 'stern, impatient Edwardian Military Service Tribunal magistrate challenging an applicant',
        text: "Chairman to Applicant, a 22-year-old clerk claiming moral objection: 'You say taking human life is contrary to Christian teaching. If you saw a German soldier attempting to murder your mother or ravish your sister, would you not strike him down?'",
      },
      {
        speaker: 'Applicant',
        style: 'quiet, earnest, calm 22-year-old conscientious objector standing firm on moral principle',
        text: "Applicant: 'I would do everything to restrain him, but I could not deliberately kill him. My conscience forbids me from taking another man's life under any state command.'",
      },
      {
        speaker: 'Chairman',
        style: 'indignant, dismissive tribunal magistrate refusing exemption',
        text: "Chairman: 'That is utter nonsense and cowardly evasion! True religion calls upon every man to defend his hearth and home. Application for total exemption refused. Assigned to Non-Combatant Corps.'",
      },
    ],
  },
  'great_war_part2:lesson_4_home_front_dora:E': {
    voiceKey: 'ww1_british_tommy',
    style: 'quiet, resolute conscientious objector speaking from a stone cell at Richmond Castle in 1916',
    badge: 'Norman Gaudie · Richmond Cell (1916)',
  },
  'great_war_part2:lesson_5_versailles:A': {
    voiceKey: 'ww1_german_voice',
    style: 'shaken, grim German Quartermaster-General recording the collapse of 8 August 1918',
    badge: 'Gen. Erich Ludendorff (Aug 1918)',
  },
  'great_war_part2:lesson_5_versailles:B': {
    voiceKey: 'male_historian',
    style: 'solemn, historic reading of the 11 November 1918 Armistice military terms',
    badge: 'Armistice Terms (11 Nov 1918)',
  },
  'great_war_part2:lesson_5_versailles:D': {
    voiceKey: 'male_historian',
    style: 'formal, weighty reading of Articles 231 and 232 of the 1919 Treaty of Versailles',
    badge: 'Treaty of Versailles (Art. 231–232)',
  },
};

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
  const tmpWav = `${outMp3Path}.ww1.${process.pid}.${Math.random().toString(36).slice(2, 7)}.wav`;
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

async function synthesizeMultiSpeakerViaBatchTurns(apiKey, voiceIdsByKey, castSpec, outMp3Path) {
  const speakerVoiceMap = Object.fromEntries(
    castSpec.speakers.map((sp) => [sp.speaker, voiceIdsByKey[sp.voiceKey]]),
  );
  const partMp3s = [];
  await Promise.all(
    castSpec.turns.map(async (turn, idx) => {
      const partPath = `${outMp3Path}.turn${idx}.mp3`;
      partMp3s[idx] = partPath;
      await runSingleBatchChunk(
        apiKey,
        speakerVoiceMap[turn.speaker],
        [
          {
            voiceKey: turn.speaker,
            style: turn.style,
            text: turn.text,
            label: `${path.basename(outMp3Path)}#turn${idx + 1}`,
            outMp3Path: partPath,
            onComplete() {},
          },
        ],
        `ww1-multi-turn-${Date.now()}-${idx + 1}`,
      );
    }),
  );

  // Concatenate speaker turns seamlessly into `outMp3Path`
  const listFile = `${outMp3Path}.concat.txt`;
  fs.writeFileSync(
    listFile,
    partMp3s.map((p) => `file '${p.replace(/\\/g, '/').replace(/'/g, "'\\''")}'`).join('\n') + '\n',
    'utf8',
  );
  execFileSync(
    'ffmpeg',
    ['-y', '-f', 'concat', '-safe', '0', '-i', listFile, '-codec:a', 'libmp3lame', '-ar', '24000', '-ac', '1', '-b:a', '36k', outMp3Path],
    { stdio: 'ignore' },
  );
  if (fs.existsSync(listFile)) fs.unlinkSync(listFile);
  for (const p of partMp3s) {
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  return fs.statSync(outMp3Path).size;
}

async function synthesizeMultiSpeakerMp3(apiKey, voiceIdsByKey, castSpec, outMp3Path) {
  const speakersCfg = castSpec.speakers.map((sp) => ({
    speaker: sp.speaker,
    voice: voiceIdsByKey[sp.voiceKey],
  }));
  const contentTurns = castSpec.turns.map((t, idx) => ({
    type: 'text',
    text: idx === castSpec.turns.length - 1 ? `${t.text} <short pause>` : t.text,
    annotations: [{ type: 'speech_metadata', speaker: t.speaker, style: t.style }],
  }));

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gemini-3.8-flash-tts',
      store: false,
      input: [{ type: 'user_input', content: contentTurns }],
      response_format: { type: 'audio' },
      generation_config: {
        speech_config: { speakers: speakersCfg },
      },
    }),
  });

  if (res.ok) {
    const json = await res.json();
    const audioPart =
      json.output_audio ||
      (json.steps || [])
        .filter((s) => s.type === 'model_output')
        .flatMap((s) => s.content || [])
        .filter((c) => c.type === 'audio')
        .pop();
    if (audioPart?.data) {
      return encodeWavBufferToMp3(Buffer.from(audioPart.data, 'base64'), outMp3Path);
    }
  }

  // Fallback automatically to Batch TTS per-speaker turn synthesis (bypasses 100-RPD limit at 50% off!)
  console.log(`   🔄 Real-time quota full (${res.status}); synthesizing multi-speaker turns via Batch TTS...`);
  return synthesizeMultiSpeakerViaBatchTurns(apiKey, voiceIdsByKey, castSpec, outMp3Path);
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
    await new Promise((r) => setTimeout(r, attempt * 8000));
  }

  console.log(`   ⏳ Polling ${batchName} (${displayLabel}, ${jobs.length} clip[s])...`);
  let batchResult = null;
  for (let poll = 1; poll <= 180; poll++) {
    await new Promise((r) => setTimeout(r, 7000));
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
  ];
  const pubDataJs = path.join(ROOT, 'public', 'units', unitId, 'data.js');
  if (fs.existsSync(pubDataJs)) targets.push([pubDataJs, jsStr]);

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

export async function syncWw1UnitLivingVoices(unitId, opts = {}) {
  if (!WW1_LIVING_VOICE_UNITS.has(unitId)) return false;
  const { forceAudio = false, skipTts = false } = opts;

  const dataJsonPath = path.join(ROOT, 'data', `${unitId}.json`);
  const unitData = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));

  const lessonAudioDir = path.join(ROOT, 'public', 'audio', 'lessons', unitId);
  const sourceAudioDir = path.join(ROOT, 'public', 'audio', 'sources', unitId);
  const readingAudioDir = path.join(ROOT, 'public', 'audio', 'reading', unitId);

  const prologueHashPath = path.join(lessonAudioDir, 'prologue_hashes.json');
  const sourceHashPath = path.join(sourceAudioDir, 'audio_hashes.json');
  const readingHashPath = path.join(readingAudioDir, 'audio_hashes.json');

  const prologueHashes = loadHashManifest(prologueHashPath, unitId);
  const sourceHashes = loadHashManifest(sourceHashPath, unitId);
  const readingHashes = loadHashManifest(readingHashPath, unitId);

  const singleJobs = [];
  const multiJobs = [];
  const prologueAlignTargets = [];
  const sourceAlignTargets = [];
  const readingAlignTargets = [];

  // 1. Lesson Prologues
  for (const lesson of unitData.lessons || []) {
    const rawPrologue = String(lesson.prologue || '').trim();
    if (!rawPrologue) continue;

    const clipId = `${lesson.id}_prologue`;
    const relUrl = `/audio/lessons/${unitId}/${clipId}.mp3`;
    const outMp3Path = path.join(lessonAudioDir, `${clipId}.mp3`);
    const isAssessment = /Assessment Masterclass/i.test(lesson.title || '');
    const style = isAssessment
      ? 'warm, encouraging British history teacher introducing a Year 9 assessment workshop'
      : 'dramatic yet measured BBC Great War documentary cold-open narrator';
    const spokenText = cleanTextForSpeech(rawPrologue);
    const contentHash = sha256(`male_historian::${style}::${spokenText}`);

    lesson.prologue_audio = relUrl;
    lesson.prologue_voice_label = 'Studio Cold-Open · British Historian';
    prologueAlignTargets.push({ key: clipId, mp3Path: outMp3Path, rawText: rawPrologue });

    const prev = prologueHashes.clips[clipId];
    const exists = fs.existsSync(outMp3Path) && fs.statSync(outMp3Path).size > 1500;
    if (!forceAudio && exists && prev && prev.hash === contentHash) continue;

    singleJobs.push({
      kind: 'prologue',
      voiceKey: 'male_historian',
      style,
      text: spokenText,
      label: `lessons/${unitId}/${clipId}.mp3`,
      outMp3Path,
      onComplete(bytes) {
        prologueHashes.clips[clipId] = { hash: contentHash, bytes, updatedAt: new Date().toISOString() };
        saveHashManifest(prologueHashPath, prologueHashes);
      },
    });
  }

  // 2. Guided Reading Companions
  (unitData.guided_reading || []).forEach((gr, idx) => {
    const cast = GUIDED_READING_CAST[`${unitId}:${idx}`] || {
      voiceKey: 'male_historian',
      style: ALL_STUDIO_VOICES.male_historian.style,
      badge: 'Studio Historian',
    };
    const clipId = `r${idx}`;
    const relUrl = `/audio/reading/${unitId}/${clipId}.mp3`;
    const outMp3Path = path.join(readingAudioDir, `${clipId}.mp3`);
    const bodyHtml = extractReadingBodyHtml(gr.extract || '');
    const spokenText = cleanTextForSpeech(bodyHtml);
    const contentHash = sha256(`${cast.voiceKey}::${cast.style}::${spokenText}`);

    gr.audio_file = relUrl;
    gr.studio_audio = relUrl;
    gr.studio_voice_label = cast.badge;
    readingAlignTargets.push({ key: clipId, mp3Path: outMp3Path, rawText: bodyHtml });

    const prev = readingHashes.clips[clipId];
    const exists = fs.existsSync(outMp3Path) && fs.statSync(outMp3Path).size > 3000;
    if (!forceAudio && exists && prev && prev.hash === contentHash) return;

    singleJobs.push({
      kind: 'reading',
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
          updatedAt: new Date().toISOString(),
        };
        saveHashManifest(readingHashPath, readingHashes);
        // Also overwrite legacy robotic `public/assets/great_war_reading_gw_l*.mp3` if present
        if (unitId === 'great_war') {
          const legacyAsset = path.join(ROOT, 'public', 'assets', `great_war_reading_gw_l${idx}.mp3`);
          if (fs.existsSync(path.dirname(legacyAsset))) {
            fs.copyFileSync(outMp3Path, legacyAsset);
          }
        }
      },
    });
  });

  // 3. Written Primary Sources (`Sources A–E`)
  for (const lesson of unitData.lessons || []) {
    (lesson.sources || []).forEach((src, sIdx) => {
      const rawSrcText = String(src.text || src.extract || src.quote || src.content || '').trim();
      if (!rawSrcText) return;
      const letter = String(src.letter || String.fromCharCode(65 + sIdx)).toUpperCase();
      const castKey = `${unitId}:${lesson.id}:${letter}`;
      const cast = SOURCE_CAST[castKey] || {
        voiceKey: 'male_historian',
        style: 'authoritative historical archive narrator',
        badge: 'Living Archive Voice',
      };
      const clipId = `${lesson.id}_s${letter}`;
      const relUrl = `/audio/sources/${unitId}/${clipId}.mp3`;
      const outMp3Path = path.join(sourceAudioDir, `${clipId}.mp3`);

      src.studio_audio = relUrl;
      src.studio_voice_label = cast.badge;

      // Also sync inline block.sources / block.source if present on narrative_blocks
      for (const blk of lesson.narrative_blocks || []) {
        const inlineList = Array.isArray(blk.sources)
          ? blk.sources
          : Array.isArray(blk.source)
            ? blk.source
            : blk.source
              ? [blk.source]
              : [];
        for (const inl of inlineList) {
          if (
            inl &&
            ((src.id && inl.id === src.id) ||
              (inl.letter && String(inl.letter).toUpperCase() === letter))
          ) {
            inl.studio_audio = relUrl;
            inl.studio_voice_label = cast.badge;
          }
        }
      }

      sourceAlignTargets.push({ key: clipId, mp3Path: outMp3Path, rawText: rawSrcText });

      if (cast.multiSpeaker) {
        const contentHash = sha256(`MULTI::${JSON.stringify(cast.speakers)}::${JSON.stringify(cast.turns)}`);
        const prev = sourceHashes.clips[clipId];
        const exists = fs.existsSync(outMp3Path) && fs.statSync(outMp3Path).size > 1500;
        if (!forceAudio && exists && prev && prev.hash === contentHash) return;

        multiJobs.push({
          cast,
          label: `sources/${unitId}/${clipId}.mp3`,
          outMp3Path,
          onComplete(bytes) {
            sourceHashes.clips[clipId] = {
              hash: contentHash,
              bytes,
              multiSpeaker: true,
              badge: cast.badge,
              updatedAt: new Date().toISOString(),
            };
            saveHashManifest(sourceHashPath, sourceHashes);
          },
        });
      } else {
        const spokenText = cleanTextForSpeech(rawSrcText);
        const contentHash = sha256(`${cast.voiceKey}::${cast.style}::${spokenText}`);
        const prev = sourceHashes.clips[clipId];
        const exists = fs.existsSync(outMp3Path) && fs.statSync(outMp3Path).size > 1500;
        if (!forceAudio && exists && prev && prev.hash === contentHash) return;

        singleJobs.push({
          kind: 'source',
          voiceKey: cast.voiceKey,
          style: cast.style,
          text: spokenText,
          label: `sources/${unitId}/${clipId}.mp3`,
          outMp3Path,
          onComplete(bytes) {
            sourceHashes.clips[clipId] = {
              hash: contentHash,
              bytes,
              voiceKey: cast.voiceKey,
              badge: cast.badge,
              updatedAt: new Date().toISOString(),
            };
            saveHashManifest(sourceHashPath, sourceHashes);
          },
        });
      }
    });
  }

  const mirrorChanged = writeUnitMirrors(unitId, unitData);
  const totalPending = singleJobs.length + multiJobs.length;

  if (totalPending === 0) {
    refreshWw1Timings(unitId, lessonAudioDir, sourceAudioDir, readingAudioDir, prologueAlignTargets, sourceAlignTargets, readingAlignTargets, false);
    console.log(
      `🎙️  [WWI Living Voices · ${unitId}] ${prologueAlignTargets.length} prologues, ` +
        `${readingAlignTargets.length} readings & ${sourceAlignTargets.length} sources 100% up-to-date ($0.00 cost).`,
    );
    return mirrorChanged;
  }

  if (skipTts) {
    console.log(`⏭️  [WWI Living Voices · ${unitId}] --skip-tts set; ${totalPending} clip(s) queued.`);
    return mirrorChanged;
  }

  const apiKey = resolveGeminiApiKey();
  if (!apiKey) throw new Error('GEMINI_API_KEY missing');

  // Ensure all required voice IDs are cached
  const neededVoiceKeys = new Set(singleJobs.map((j) => j.voiceKey));
  for (const mj of multiJobs) {
    for (const sp of mj.cast.speakers) neededVoiceKeys.add(sp.voiceKey);
  }
  const voiceIdsByKey = {};
  for (const vk of neededVoiceKeys) {
    voiceIdsByKey[vk] = await ensureHouseVoiceId(apiKey, vk);
  }

  console.log(
    `🎬 [WWI Living Voices · ${unitId}] Synthesizing ${singleJobs.length} single-voice + ${multiJobs.length} multi-speaker clip(s)...`,
  );

  // Build batch chunks grouped by voiceKey (CHUNK_SIZE=1 for long Guided Reading, CHUNK_SIZE=12 for prologues/sources)
  const batchTasks = [];
  const byVoice = new Map();
  for (const j of singleJobs) {
    if (!byVoice.has(j.voiceKey)) byVoice.set(j.voiceKey, []);
    byVoice.get(j.voiceKey).push(j);
  }
  for (const [vk, list] of byVoice.entries()) {
    const longReadings = list.filter((j) => j.kind === 'reading');
    const shortClips = list.filter((j) => j.kind !== 'reading');
    longReadings.forEach((rj, idx) => {
      batchTasks.push({ voiceKey: vk, jobs: [rj], tag: `ww1-${unitId}-${vk}-read-${idx + 1}` });
    });
    for (let off = 0; off < shortClips.length; off += 12) {
      batchTasks.push({
        voiceKey: vk,
        jobs: shortClips.slice(off, off + 12),
        tag: `ww1-${unitId}-${vk}-short-${Math.floor(off / 12) + 1}`,
      });
    }
  }

  // Run multi-speaker dialogues + up to 5 concurrent Batch TTS workers in parallel
  let taskCursor = 0;
  const batchWorkers = Array.from({ length: Math.min(5, batchTasks.length) }, async (_, wIdx) => {
    if (wIdx > 0) await new Promise((r) => setTimeout(r, wIdx * 900));
    while (taskCursor < batchTasks.length) {
      const idx = taskCursor++;
      if (idx >= batchTasks.length) break;
      const bt = batchTasks[idx];
      await runSingleBatchChunk(apiKey, voiceIdsByKey[bt.voiceKey], bt.jobs, bt.tag);
    }
  });

  const multiPromise = (async () => {
    for (const mj of multiJobs) {
      const bytes = await synthesizeMultiSpeakerMp3(apiKey, voiceIdsByKey, mj.cast, mj.outMp3Path);
      mj.onComplete(bytes);
      console.log(`   🎭 ${mj.label} (${Math.round(bytes / 1024)} KB · MULTI-SPEAKER [${mj.cast.badge}])`);
    }
  })();

  await Promise.all([...batchWorkers, multiPromise]);

  refreshWw1Timings(unitId, lessonAudioDir, sourceAudioDir, readingAudioDir, prologueAlignTargets, sourceAlignTargets, readingAlignTargets, true);
  console.log(`🎉 [WWI Living Voices · ${unitId}] Synthesized ${totalPending} clip(s) & synchronized acoustic timings!`);
  return true;
}

function refreshWw1Timings(
  unitId,
  lessonAudioDir,
  sourceAudioDir,
  readingAudioDir,
  prologueTargets,
  sourceTargets,
  readingTargets,
  forceRebuild,
) {
  // Merge prologue timings into existing `/audio/lessons/<unitId>/timings.json`
  const lessonTimingsPath = path.join(lessonAudioDir, 'timings.json');
  const lessonTimings = fs.existsSync(lessonTimingsPath)
    ? JSON.parse(fs.readFileSync(lessonTimingsPath, 'utf8'))
    : {};
  let lessonTimingsUpdated = false;
  for (const t of prologueTargets) {
    if (fs.existsSync(t.mp3Path) && (forceRebuild || !lessonTimings[t.key])) {
      lessonTimings[t.key] = alignSentencesToMp3(t.mp3Path, t.rawText);
      lessonTimingsUpdated = true;
    }
  }
  if (lessonTimingsUpdated) {
    fs.writeFileSync(lessonTimingsPath, JSON.stringify(lessonTimings, null, 2) + '\n', 'utf8');
  }

  // Write `/audio/sources/<unitId>/timings.json`
  const sourceTimingsPath = path.join(sourceAudioDir, 'timings.json');
  if (forceRebuild || !fs.existsSync(sourceTimingsPath)) {
    const st = {};
    for (const t of sourceTargets) {
      if (fs.existsSync(t.mp3Path)) st[t.key] = alignSentencesToMp3(t.mp3Path, t.rawText);
    }
    fs.mkdirSync(sourceAudioDir, { recursive: true });
    fs.writeFileSync(sourceTimingsPath, JSON.stringify(st, null, 2) + '\n', 'utf8');
  }

  // Write `/audio/reading/<unitId>/timings.json`
  const readingTimingsPath = path.join(readingAudioDir, 'timings.json');
  if (forceRebuild || !fs.existsSync(readingTimingsPath)) {
    const rt = {};
    for (const t of readingTargets) {
      if (fs.existsSync(t.mp3Path)) rt[t.key] = alignSentencesToMp3(t.mp3Path, t.rawText);
    }
    fs.mkdirSync(readingAudioDir, { recursive: true });
    fs.writeFileSync(readingTimingsPath, JSON.stringify(rt, null, 2) + '\n', 'utf8');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const forceAudio = args.includes('--force-audio');
  const skipTts = args.includes('--skip-tts');
  const targetArg = args.find((a) => !a.startsWith('-'));
  const targets = targetArg ? [targetArg] : ['great_war', 'great_war_part2'];

  let anyDataChanged = false;
  for (const u of targets) {
    const changed = await syncWw1UnitLivingVoices(u, { forceAudio, skipTts });
    if (changed) anyDataChanged = true;
  }

  if (anyDataChanged) {
    for (const u of targets) {
      execFileSync('node', ['--check', path.join(ROOT, 'units', u, 'data.js')], { stdio: 'inherit' });
    }
    execFileSync('node', [path.join(ROOT, 'scripts', 'build_database.cjs')], {
      cwd: ROOT,
      stdio: 'inherit',
    });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('❌ [WWI Living Voices] Fatal error:', err);
    process.exit(1);
  });
}
