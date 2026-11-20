#!/usr/bin/env node
/**
 * Authentic Eyewitness & Archival Primary Source Audio Synchronizer (`sync_shoah_ks2_living_voices.mjs`)
 *
 * Phase 3 — Task [3.3]:
 *  - Voices all 18 Atmospheric Lesson Prologues (`lesson.prologue_audio` + `prologue_voice_label`)
 *    and all 46 Verbatim Written Primary Sources (`src.studio_audio` + `studio_voice_label`)
 *    across Year 9 `the_shoah` (7 prologues + 24 sources) and KS2 `ks2_ww2` (11 prologues + 22 sources).
 *  - Uses 50%-off Gemini Batch-TTS (`gemini-3.8-flash-tts:batchGenerateContent`) with SHA-256
 *    `audio_hashes.json` tracking so unchanged clips verify in <0.1s at $0.00 cost.
 *  - Synchronizes acoustic sentence `timings.json` into `/audio/lessons/<unit>/timings.json`
 *    and `/audio/sources/<unit>/timings.json`, plus all 6 curriculum data mirrors.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolveGeminiApiKey, ensureHouseVoiceId } from './studio_voice_registry.mjs';
import { alignSentencesToMp3 } from './extract_audio_timings.mjs';
import { expandBritishDatesForSpeech } from './spoken_date_normalizer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

export const SHOAH_KS2_LIVING_VOICE_UNITS = new Set(['the_shoah', 'ks2_ww2']);

const PROLOGUE_CAST = {
  // Year 9: The Shoah (dignified, restrained museum documentary delivery)
  'the_shoah:lesson_1': {
    voiceKey: 'female_historian',
    style: 'warm, dignified, reflective British documentary historian introducing pre-war European Jewish life',
    badge: 'Studio Cold-Open · Historian',
  },
  'the_shoah:lesson_2': {
    voiceKey: 'male_historian',
    style: 'measured, sober, authoritative British documentary historian introducing 1933 to 1939 legal persecution',
    badge: 'Studio Cold-Open · Historian',
  },
  'the_shoah:lesson_3': {
    voiceKey: 'female_historian',
    style: 'solemn, empathetic, measured documentary historian introducing wartime ghettoisation and spiritual resistance',
    badge: 'Studio Cold-Open · Historian',
  },
  'the_shoah:lesson_4': {
    voiceKey: 'male_historian',
    style: 'grave, measured, documentary historian introducing June 1941 and the Holocaust by Bullets',
    badge: 'Studio Cold-Open · Historian',
  },
  'the_shoah:lesson_5': {
    voiceKey: 'male_historian',
    style: 'solemn, restrained, dignified documentary historian introducing Wannsee, industrial murder, and Jewish resistance',
    badge: 'Studio Cold-Open · Historian',
  },
  'the_shoah:lesson_6': {
    voiceKey: 'female_historian',
    style: 'thoughtful, searching, dignified documentary historian examining European complicity and rescue',
    badge: 'Studio Cold-Open · Historian',
  },
  'the_shoah:lesson_7': {
    voiceKey: 'female_historian',
    style: 'quiet, deeply respectful, reflective documentary historian introducing 1945 liberation and survivor memory',
    badge: 'Studio Cold-Open · Historian',
  },

  // KS2 WWII (clear, warm, age-calibrated British documentary storytelling)
  'ks2_ww2:lesson_1': {
    voiceKey: 'male_historian',
    style: 'clear, warm, engaging British history storyteller setting the scene on Sunday morning in September 1939',
    badge: 'Studio Cold-Open · Historian',
  },
  'ks2_ww2:lesson_2': {
    voiceKey: 'female_historian',
    style: 'warm, empathetic British storyteller introducing Operation Pied Piper and child evacuees in September 1939',
    badge: 'Studio Cold-Open · Historian',
  },
  'ks2_ww2:lesson_3': {
    voiceKey: 'female_historian',
    style: 'calm, gentle, thoughtful British historian introducing pre-war Jewish family life and rights lost',
    badge: 'Studio Cold-Open · Historian',
  },
  'ks2_ww2:lesson_4': {
    voiceKey: 'female_historian',
    style: 'warm, caring British storyteller introducing nine-year-old Vera and the Kindertransport rescue',
    badge: 'Studio Cold-Open · Historian',
  },
  'ks2_ww2:lesson_5': {
    voiceKey: 'male_historian',
    style: 'inspiring, clear British historian introducing Nicholas Winton and the Prague volunteers in 1938',
    badge: 'Studio Cold-Open · Historian',
  },
  'ks2_ww2:lesson_6': {
    voiceKey: 'male_historian',
    style: 'vivid, steady British documentary narrator introducing the 1940 Blitz and air-raid shelters',
    badge: 'Studio Cold-Open · Historian',
  },
  'ks2_ww2:lesson_7': {
    voiceKey: 'female_historian',
    style: 'clear, engaging British storyteller introducing Atlantic food convoys, rationing, and Dig for Victory',
    badge: 'Studio Cold-Open · Historian',
  },
  'ks2_ww2:lesson_8': {
    voiceKey: 'female_historian',
    style: 'spirited, proud, clear British historian introducing Women at War from Land Girls to Spitfire ferry pilots',
    badge: 'Studio Cold-Open · Historian',
  },
  'ks2_ww2:lesson_9': {
    voiceKey: 'male_historian',
    style: 'intriguing, crisp British documentary narrator introducing Station X and the Bletchley Park codebreakers',
    badge: 'Studio Cold-Open · Historian',
  },
  'ks2_ww2:lesson_10': {
    voiceKey: 'male_historian',
    style: 'warm, reflective British historian introducing VE Day street celebrations and national remembrance',
    badge: 'Studio Cold-Open · Historian',
  },
  'ks2_ww2:lesson_11': {
    voiceKey: 'female_historian',
    style: 'gentle, hopeful, deeply respectful British storyteller introducing the 300 Windermere Children in August 1945',
    badge: 'Studio Cold-Open · Historian',
  },
};

const SOURCE_CAST = {
  // =========================================================================
  // YEAR 9: THE SHOAH (24 Verbatim Archival & Eyewitness Sources)
  // Calm, dignified, museum-grade documentary delivery (zero melodrama)
  // =========================================================================
  'the_shoah:lesson_1:B': {
    voiceKey: 'female_historian',
    style: 'warm, vivid, dignified museum narrator describing thriving Yiddish literary and theatrical life in pre-war Warsaw',
    badge: 'Warsaw Cultural Record (1930s)',
  },
  'the_shoah:lesson_1:D': {
    voiceKey: 'female_historian',
    style: 'measured, evocative documentary narrator describing the centuries-old Sephardic Jewish port community of Salonica',
    badge: 'Salonica Heritage Record',
  },
  'the_shoah:lesson_1:E': {
    voiceKey: 'male_historian',
    style: 'clinical, detached, sober archival reading of Wilhelm Marr’s 1879 racial pamphlet for historical analysis',
    badge: 'Wilhelm Marr Pamphlet (1879)',
  },
  'the_shoah:lesson_2:C': {
    voiceKey: 'male_historian',
    style: 'quiet, dignified, weary Dresden university professor recording daily legal exclusions in his private diary',
    badge: 'Prof. Victor Klemperer Diary',
  },
  'the_shoah:lesson_2:E': {
    voiceKey: 'male_historian',
    style: 'formal, clipped, bureaucratic diplomatic reading of the Australian delegate statement at Évian in July 1938',
    badge: 'Évian Conference Record (1938)',
  },
  'the_shoah:lesson_3:A': {
    voiceKey: 'male_historian',
    style: 'cold, clinical, bureaucratic archival reading of Reinhard Heydrich’s 21 September 1939 Schnellbrief directive',
    badge: 'Heydrich Schnellbrief (Sept 1939)',
  },
  'the_shoah:lesson_3:B': {
    voiceKey: 'male_historian',
    style: 'stern, clinical administrative reading of the November 1939 General Government armband decree',
    badge: 'Occupation Decree (Nov 1939)',
  },
  'the_shoah:lesson_3:D': {
    voiceKey: 'female_historian',
    style: 'quiet, compassionate, sombre documentary witness describing child smugglers keeping Warsaw Ghetto families alive',
    badge: 'Warsaw Ghetto Eyewitness Record',
  },
  'the_shoah:lesson_3:E': {
    voiceKey: 'male_historian',
    style: 'earnest, resolute, deeply moving reading of 19-year-old David Graber’s August 1942 Oneg Shabbat testament',
    badge: 'David Graber Testament (Aug 1942)',
  },
  'the_shoah:lesson_4:A': {
    voiceKey: 'male_historian',
    style: 'cold, clinical military-archival reading of the June 1941 Wehrmacht Commissar Order',
    badge: 'OKW Commissar Order (June 1941)',
  },
  'the_shoah:lesson_4:C': {
    voiceKey: 'male_historian',
    style: 'chillingly matter-of-fact, clinical archival reading of the October 1941 Babi Yar operational report',
    badge: 'Einsatzgruppe Operational Report',
  },
  'the_shoah:lesson_4:D': {
    voiceKey: 'female_historian',
    style: 'sombre, measured forensic documentary reading of the Ponary forest eyewitness record near Vilna',
    badge: 'Ponary Forest Witness Record',
  },
  'the_shoah:lesson_4:E': {
    voiceKey: 'male_historian',
    style: 'cold, bureaucratic forensic reading of the 1942 Berlin technical memo on Chełmno gas vans',
    badge: ' Forensic Evidence · 1942 Memo',
  },
  'the_shoah:lesson_5:A': {
    voiceKey: 'male_historian',
    style: 'measured, clinical archival reading of Hermann Göring’s 31 July 1941 authorization directive',
    badge: 'Göring Directive (31 July 1941)',
  },
  'the_shoah:lesson_5:B': {
    voiceKey: 'male_historian',
    style: 'precise, sober intelligence-archive reading of the decrypted January 1943 Höfle radio telegram',
    badge: 'Höfle Telegram (Jan 1943)',
  },
  'the_shoah:lesson_5:E': {
    voiceKey: 'female_historian',
    style: 'dignified, resolute, deeply respectful reading of survivor Noah Zabludowicz’s testimony honouring Roza Robota',
    badge: 'Survivor Testimony · Roza Robota',
  },
  'the_shoah:lesson_6:A': {
    voiceKey: 'male_historian',
    style: 'flat, bureaucratic civil-service reading of Reichsbahn Timetable Order No. 42/57 charging per-kilometre fares',
    badge: 'Reichsbahn Order (April 1942)',
  },
  'the_shoah:lesson_6:B': {
    voiceKey: 'male_historian',
    style: 'clinical administrative reading of the Paris Police Prefecture Vél d’Hiv roundup tally of July 1942',
    badge: 'Paris Police Record (July 1942)',
  },
  'the_shoah:lesson_6:C': {
    voiceKey: 'female_historian',
    style: 'clear, courageous, morally urgent reading of the Munich White Rose resistance Sixth Leaflet of February 1943',
    badge: 'White Rose Leaflet (Feb 1943)',
  },
  'the_shoah:lesson_6:D': {
    voiceKey: 'male_historian',
    style: 'quiet, humble, deeply humane reading of Japanese diplomat Chiune Sugihara’s reflection on writing rescue visas in Kaunas',
    badge: 'Chiune Sugihara Memoir (1940)',
  },
  'the_shoah:lesson_6:E': {
    voiceKey: 'female_historian',
    style: 'solemn, principled reading of the Danish Lutheran Bishops’ pastoral protest read across Denmark on 3 October 1943',
    badge: 'Danish Bishops Protest (Oct 1943)',
  },
  'the_shoah:lesson_7:A': {
    voiceKey: 'male_historian',
    style: 'quiet, haunted, deeply respectful reading of survivor Elie Wiesel’s testimony of the 1945 winter death march',
    badge: 'Elie Wiesel · Eyewitness Testimony',
  },
  'the_shoah:lesson_7:B': {
    voiceKey: 'male_historian',
    style: 'shaken, grave, famously restrained April 1945 BBC war correspondent dispatch from Bergen-Belsen',
    badge: 'Richard Dimbleby · BBC (April 1945)',
  },
  'the_shoah:lesson_7:C': {
    voiceKey: 'male_historian',
    style: 'serious, forthright diplomatic reading of Earl G. Harrison’s August 1945 report to President Truman on Displaced Persons',
    badge: 'Harrison Report (Aug 1945)',
  },
  'the_shoah:lesson_7:D': {
    voiceKey: 'female_historian',
    style: 'clear, authoritative legal-historical reading of Nuremberg Charter Article 8 and Raphael Lemkin’s definition of genocide',
    badge: 'Nuremberg Charter & Lemkin (1945)',
  },
  'the_shoah:lesson_7:E': {
    voiceKey: 'male_historian',
    style: 'solemn, quiet, unforgettable moral gravity reading Auschwitz survivor Primo Levi’s testament If This Is a Man',
    badge: 'Primo Levi · Survivor Testament',
  },

  // =========================================================================
  // KS2 WORLD WAR II (22 Verbatim Eyewitness, Broadcast & Document Sources)
  // =========================================================================
  'ks2_ww2:lesson_1:B': {
    voiceKey: 'male_historian',
    style: 'clear, calm, practical 1939 Home Office public information announcer explaining how to care for a gas mask',
    badge: 'Home Office Leaflet (July 1939)',
  },
  'ks2_ww2:lesson_1:C': {
    voiceKey: 'ww1_british_officer',
    style: 'firm, clear, reassuring wartime British Air Raid Warden reading the September 1939 Blackout regulations',
    badge: 'ARP Blackout Order (Sept 1939)',
  },
  'ks2_ww2:lesson_2:B': {
    voiceKey: 'female_historian',
    style: 'clear, reassuring London headteacher reading the official August 1939 evacuation packing list to parents',
    badge: 'LCC Evacuation Notice (Aug 1939)',
  },
  'ks2_ww2:lesson_2:E': {
    voiceKey: 'ww1_british_woman',
    style: 'earnest, caring 1939 Ministry of Health broadcast urging mothers to keep evacuated children safe in the countryside',
    badge: 'Ministry of Health Appeal (1939)',
  },
  'ks2_ww2:lesson_3:D': {
    voiceKey: 'male_historian',
    style: 'clear, measured, respectful British historian reading the chronological record of 1933 to 1938 anti-Jewish laws',
    badge: 'Archival Legal Timeline (1933–38)',
  },
  'ks2_ww2:lesson_3:E': {
    voiceKey: 'female_historian',
    style: 'warm, gentle, dignified survivor recalling her childhood in Munich and why her parents sought Kindertransport safety',
    badge: 'Bertha Leverton MBE · Testimony',
  },
  'ks2_ww2:lesson_4:B': {
    voiceKey: 'female_historian',
    style: 'gentle, moving, clear reading of Kindertransport survivor Vera Schaufeld recalling Prague station and crossing into Holland',
    badge: 'Vera Schaufeld MBE · Testimony',
  },
  'ks2_ww2:lesson_4:C': {
    voiceKey: 'male_historian',
    style: 'clear, precise archival reading of nine-year-old Věra Löwyová’s 1939 Klatovy passport entries',
    badge: 'Passport No. 89605 (Klatovy, 1939)',
  },
  'ks2_ww2:lesson_5:C': {
    voiceKey: 'male_historian',
    style: 'modest, humane, resolute British volunteer Sir Nicholas Winton explaining how the 1939 Prague rescue worked',
    badge: 'Sir Nicholas Winton · Testimony',
  },
  'ks2_ww2:lesson_5:D': {
    voiceKey: 'ww1_british_woman',
    style: 'warm, deeply touched 1939 British volunteer reading the Stoke-on-Trent newspaper clipping and letters from Prague',
    badge: '1939 Newspaper Clipping · Scrapbook',
  },
  'ks2_ww2:lesson_6:B': {
    voiceKey: 'male_historian',
    style: 'clear, practical 1939 Home Office civil-defence engineer explaining how to build a garden Anderson shelter',
    badge: 'Anderson Shelter Guide (1939)',
  },
  'ks2_ww2:lesson_6:E': {
    voiceKey: 'ww1_british_woman',
    style: 'warm, steadfast, encouraging Lady Reading addressing Women’s Voluntary Services mobile canteen crews in 1940',
    badge: 'Lady Reading · WVS Message (1940)',
  },
  'ks2_ww2:lesson_7:B': {
    voiceKey: 'male_historian',
    style: 'crisp, official 1940 Ministry of Food announcer reading the fair-share rules inside a Child’s Ration Book',
    badge: 'Child’s Ration Book Rules (1940)',
  },
  'ks2_ww2:lesson_7:D': {
    voiceKey: 'female_historian',
    style: 'bright, practical, encouraging 1941 Ministry of Food speaker explaining how saving bread saves Atlantic wheat ships',
    badge: 'Our Food To-day Leaflet (1941)',
  },
  'ks2_ww2:lesson_8:B': {
    voiceKey: 'ww1_british_woman',
    style: 'spirited, upbeat, welcoming wartime recruitment speaker calling volunteers to join the Women’s Land Army harvest',
    badge: 'Women’s Land Army Appeal (1942)',
  },
  'ks2_ww2:lesson_8:C': {
    voiceKey: 'female_historian',
    style: 'calm, assured, pioneering female ferry pilot Lettice Curtis recalling flying Spitfires and Lancasters solo',
    badge: 'Lettice Curtis · ATA Pilot Memoir',
  },
  'ks2_ww2:lesson_9:B': {
    voiceKey: 'male_historian',
    style: 'urgent, precise Cambridge mathematician reading Alan Turing’s October 1941 letter to Churchill and Action This Day reply',
    badge: 'Turing to Churchill (21 Oct 1941)',
  },
  'ks2_ww2:lesson_9:D': {
    voiceKey: 'ww1_british_woman',
    style: 'clear, vivid former Wren Dorothy Du Boisson recalling signing the Official Secrets Act and operating Colossus in 1944',
    badge: 'Dorothy Du Boisson · WRNS (1944)',
  },
  'ks2_ww2:lesson_10:C': {
    voiceKey: 'male_historian',
    style: 'solemn, quiet, reverent Remembrance Sunday reading of Laurence Binyon’s For the Fallen at the Cenotaph',
    badge: 'For the Fallen · Remembrance Ode',
  },
  'ks2_ww2:lesson_10:D': {
    voiceKey: 'ww1_british_officer',
    style: 'historic, resonant, dignified 8 May 1945 Downing Street radio broadcast announcing Victory in Europe Day',
    badge: 'PM Winston Churchill (8 May 1945)',
  },
  'ks2_ww2:lesson_11:A': {
    voiceKey: 'male_historian',
    style: 'warm, deeply moving, hopeful survivor Sir Ben Helfgott recalling arriving at Lake Windermere in August 1945',
    badge: 'Sir Ben Helfgott MBE · Windermere',
  },
  'ks2_ww2:lesson_11:B': {
    voiceKey: 'female_historian',
    style: 'gentle, compassionate, patient child carer Alice Goldberger describing how kindness helped the Windermere children heal',
    badge: 'Alice Goldberger · Calgarth (1945)',
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

function cleanTextForSpeech(rawHtml) {
  let s = String(rawHtml || '').trim();
  if (!s) return '';
  s = s.replace(/\[Key\s+[^:\]]+:\s*([^\]]+)\]/gi, '$1');
  s = s.replace(/(?:<br\s*\/?>\s*){2,}|<\/p>\s*<p[^>]*>|\n\n+/gi, ' <short pause> ');
  s = s.replace(/\n\s*•\s*/g, ' <short pause> ');
  s = s.replace(/•/g, ' ');
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1');
  s = s.replace(/\*([^*]+)\*/g, '$1');
  s = s.replace(/<[^>]+>/g, ' ');
  s = s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—');
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
  const tmpWav = `${outMp3Path}.sk.${process.pid}.${Math.random().toString(36).slice(2, 7)}.wav`;
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

  let createJson = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
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
      createJson = await res.json();
      break;
    }
    const errTxt = await res.text();
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      await new Promise((r) => setTimeout(r, attempt * 6000));
      continue;
    }
    throw new Error(`Batch-TTS submit failed (${res.status}): ${errTxt.slice(0, 300)}`);
  }

  const batchName = createJson.name;
  console.log(`   ⏳ Polling ${batchName} (${displayLabel}, ${jobs.length} clip[s])...`);

  let pollJson = null;
  for (let poll = 1; poll <= 220; poll++) {
    await new Promise((r) => setTimeout(r, 6000));
    const pRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/${batchName}`, {
      headers: { 'x-goog-api-key': apiKey },
    });
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
    const item = inlined[i];
    const b64 = item?.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!b64) {
      throw new Error(`Missing audio data for ${jobs[i].label}: ${JSON.stringify(item).slice(0, 200)}`);
    }
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

function refreshShoahKs2Timings(unitId, lessonAudioDir, sourceAudioDir, prologueTargets, sourceTargets, forceRebuild) {
  // 1. Merge `<lesson.id>_prologue` timings into `/audio/lessons/<unitId>/timings.json`
  const lessonTimingsPath = path.join(lessonAudioDir, 'timings.json');
  const lessonTimings = fs.existsSync(lessonTimingsPath)
    ? JSON.parse(fs.readFileSync(lessonTimingsPath, 'utf8'))
    : {};
  let lessonUpdated = false;
  for (const t of prologueTargets) {
    if (fs.existsSync(t.mp3Path) && (forceRebuild || !lessonTimings[t.key])) {
      lessonTimings[t.key] = alignSentencesToMp3(t.mp3Path, t.rawText);
      lessonUpdated = true;
    }
  }
  if (lessonUpdated) {
    fs.mkdirSync(lessonAudioDir, { recursive: true });
    fs.writeFileSync(lessonTimingsPath, JSON.stringify(lessonTimings, null, 2) + '\n', 'utf8');
  }

  // 2. Write `/audio/sources/<unitId>/timings.json`
  const sourceTimingsPath = path.join(sourceAudioDir, 'timings.json');
  const existingSourceTimings = fs.existsSync(sourceTimingsPath)
    ? JSON.parse(fs.readFileSync(sourceTimingsPath, 'utf8'))
    : {};
  let sourceUpdated = forceRebuild || !fs.existsSync(sourceTimingsPath);
  for (const t of sourceTargets) {
    if (fs.existsSync(t.mp3Path) && (forceRebuild || !existingSourceTimings[t.key])) {
      existingSourceTimings[t.key] = alignSentencesToMp3(t.mp3Path, t.rawText);
      sourceUpdated = true;
    }
  }
  if (sourceUpdated) {
    fs.mkdirSync(sourceAudioDir, { recursive: true });
    fs.writeFileSync(sourceTimingsPath, JSON.stringify(existingSourceTimings, null, 2) + '\n', 'utf8');
  }
}

export async function syncShoahKs2LivingVoices(unitId, { forceAudio = false, skipTts = false } = {}) {
  if (!SHOAH_KS2_LIVING_VOICE_UNITS.has(unitId)) return false;

  const dataPath = path.join(ROOT, 'data', `${unitId}.json`);
  const unitData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const lessonAudioDir = path.join(ROOT, 'public', 'audio', 'lessons', unitId);
  const sourceAudioDir = path.join(ROOT, 'public', 'audio', 'sources', unitId);
  const prologueHashPath = path.join(lessonAudioDir, 'prologue_hashes.json');
  const sourceHashPath = path.join(sourceAudioDir, 'audio_hashes.json');

  const prologueHashes = loadHashManifest(prologueHashPath);
  const sourceHashes = loadHashManifest(sourceHashPath);

  const jobs = [];
  const prologueAlignTargets = [];
  const sourceAlignTargets = [];

  // 1. Atmospheric Lesson Prologues (`lesson.prologue`)
  for (const lesson of unitData.lessons || []) {
    const rawPrologue = String(lesson.prologue || '').trim();
    if (!rawPrologue) continue;
    const castKey = `${unitId}:${lesson.id}`;
    const cast = PROLOGUE_CAST[castKey] || {
      voiceKey: 'male_historian',
      style: 'clear, dignified British documentary historian',
      badge: 'Studio Cold-Open · Historian',
    };
    const clipId = `${lesson.id}_prologue`;
    const relUrl = `/audio/lessons/${unitId}/${clipId}.mp3`;
    const outMp3Path = path.join(lessonAudioDir, `${clipId}.mp3`);
    const spokenText = cleanTextForSpeech(rawPrologue);
    const contentHash = sha256(`${cast.voiceKey}::${cast.style}::${spokenText}`);

    lesson.prologue_audio = relUrl;
    lesson.prologue_voice_label = cast.badge;
    prologueAlignTargets.push({ key: clipId, mp3Path: outMp3Path, rawText: rawPrologue });

    const prev = prologueHashes.clips[clipId];
    const exists = fs.existsSync(outMp3Path) && fs.statSync(outMp3Path).size > 2000;
    if (!forceAudio && exists && prev && prev.hash === contentHash) continue;

    jobs.push({
      voiceKey: cast.voiceKey,
      style: cast.style,
      text: spokenText,
      label: `lessons/${unitId}/${clipId}.mp3`,
      outMp3Path,
      onComplete(bytes) {
        prologueHashes.clips[clipId] = {
          hash: contentHash,
          bytes,
          voiceKey: cast.voiceKey,
          badge: cast.badge,
          updatedAt: new Date().toISOString(),
        };
        saveHashManifest(prologueHashPath, prologueHashes);
      },
    });
  }

  // 2. Verbatim Written Primary Sources (`lesson.sources`)
  for (const lesson of unitData.lessons || []) {
    (lesson.sources || []).forEach((src, sIdx) => {
      const rawSrcText = String(src.text || src.extract || src.quote || src.content || '').trim();
      if (!rawSrcText) return;
      const letter = String(src.letter || String.fromCharCode(65 + sIdx)).toUpperCase();
      const castKey = `${unitId}:${lesson.id}:${letter}`;
      const cast = SOURCE_CAST[castKey] || {
        voiceKey: 'male_historian',
        style: 'calm, dignified British archival narrator',
        badge: 'Living Archive Voice',
      };
      const clipId = `${lesson.id}_s${letter}`;
      const relUrl = `/audio/sources/${unitId}/${clipId}.mp3`;
      const outMp3Path = path.join(sourceAudioDir, `${clipId}.mp3`);
      const spokenText = cleanTextForSpeech(rawSrcText);
      const contentHash = sha256(`${cast.voiceKey}::${cast.style}::${spokenText}`);

      src.studio_audio = relUrl;
      src.studio_voice_label = String(cast.badge).trim();

      // Mirror onto any inline `narrative_blocks[i].sources` / `narrative_blocks[i].source`
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
            inl.studio_voice_label = String(cast.badge).trim();
          }
        }
      }

      sourceAlignTargets.push({ key: clipId, mp3Path: outMp3Path, rawText: rawSrcText });

      const prev = sourceHashes.clips[clipId];
      const exists = fs.existsSync(outMp3Path) && fs.statSync(outMp3Path).size > 2000;
      if (!forceAudio && exists && prev && prev.hash === contentHash) return;

      jobs.push({
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
            badge: String(cast.badge).trim(),
            updatedAt: new Date().toISOString(),
          };
          saveHashManifest(sourceHashPath, sourceHashes);
        },
      });
    });
  }

  const mirrorChanged = writeUnitMirrors(unitId, unitData);

  if (jobs.length === 0) {
    refreshShoahKs2Timings(unitId, lessonAudioDir, sourceAudioDir, prologueAlignTargets, sourceAlignTargets, false);
    console.log(
      `🎙️  [Living Archive Voices · ${unitId}] ${prologueAlignTargets.length} prologues & ` +
        `${sourceAlignTargets.length} primary sources 100% up-to-date ($0.00 cost).`,
    );
    return mirrorChanged;
  }

  if (skipTts) {
    console.log(`⏭️  [Living Archive Voices · ${unitId}] --skip-tts set; ${jobs.length} clip(s) queued.`);
    return mirrorChanged;
  }

  const apiKey = resolveGeminiApiKey();
  if (!apiKey) throw new Error('GEMINI_API_KEY missing');

  const neededVoiceKeys = new Set(jobs.map((j) => j.voiceKey));
  const voiceIdsByKey = {};
  for (const vk of neededVoiceKeys) {
    voiceIdsByKey[vk] = await ensureHouseVoiceId(apiKey, vk);
  }

  console.log(
    `🎬 [Living Archive Voices · ${unitId}] Synthesizing ${jobs.length} prologue & primary-source clip(s) at 50% Batch discount...`,
  );

  // Group by voiceKey in 6-clip batches across up to 6 concurrent workers
  const batchTasks = [];
  const byVoice = new Map();
  for (const j of jobs) {
    if (!byVoice.has(j.voiceKey)) byVoice.set(j.voiceKey, []);
    byVoice.get(j.voiceKey).push(j);
  }
  const CHUNK_SIZE = 6;
  for (const [vk, list] of byVoice.entries()) {
    for (let off = 0; off < list.length; off += CHUNK_SIZE) {
      batchTasks.push({
        voiceKey: vk,
        jobs: list.slice(off, off + CHUNK_SIZE),
        tag: `hrh-src-${unitId}-${vk}-${Math.floor(off / CHUNK_SIZE) + 1}`,
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

  refreshShoahKs2Timings(unitId, lessonAudioDir, sourceAudioDir, prologueAlignTargets, sourceAlignTargets, true);
  console.log(
    `🎉 [Living Archive Voices · ${unitId}] Synthesized ${jobs.length} clip(s) & synchronized acoustic timings!`,
  );
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const forceAudio = args.includes('--force-audio');
  const skipTts = args.includes('--skip-tts');
  const targetArg = args.find((a) => !a.startsWith('-'));
  const targets = targetArg ? [targetArg] : ['the_shoah', 'ks2_ww2'];

  const results = await Promise.all(
    targets.map((u) => syncShoahKs2LivingVoices(u, { forceAudio, skipTts })),
  );
  const anyDataChanged = results.some(Boolean);

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
    console.error('❌ [Living Archive Voices] Fatal error:', err);
    process.exit(1);
  });
}
