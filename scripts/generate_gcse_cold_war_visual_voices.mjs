#!/usr/bin/env node
/**
 * Visual Story Sheets — Studio British Documentary Narrator Generator (All 12 GCSE Cold War Sheets)
 * Dual-Lane Paced Architecture (`gemini-3.8-flash-tts` + `gemini-3.8-flash-lite-tts`)
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const VOICE_CACHE_JSON = path.join(ROOT, 'scripts', '.courtyard_gemini_voice_ids.json');

function resolveApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  for (const envName of ['.env.local', '.env']) {
    const p = path.join(ROOT, envName);
    if (fs.existsSync(p)) {
      const m = fs.readFileSync(p, 'utf8').match(/^GEMINI_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?/m);
      if (m) return m[1].trim();
    }
  }
  return null;
}

const NARRATOR_PERSONA = {
  key: 'narrator',
  display_name: 'Chronicle Historian Narrator',
  gender: 'male',
  language_code: 'en-GB',
  prompt:
    'A warm documentary historian in his 50s with a classic British broadcast accent, resonant voice, crisp diction, and measured pace.',
  style: 'warm, clear, unhurried British history teacher and documentary narrator',
};

function cleanSpoken(str) {
  return String(str || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildAllColdWarClips() {
  const unitData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'gcse_cold_war.json'), 'utf8'));
  const clips = [];
  unitData.lessons.forEach((lesson, lIdx) => {
    const sheet = lesson.visual_story_sheet;
    const num = String(lIdx + 1).padStart(2, '0');
    const prefix = `l${num}`;
    sheet.cards.forEach((card, idx) => {
      let spokenText = cleanSpoken(card.spoken || card.html);
      const spTitle = cleanSpoken(sheet.spokenTitle || sheet.title);
      if (idx === 0 && spTitle && !spokenText.toLowerCase().startsWith(spTitle.slice(0, 12).toLowerCase())) {
        spokenText = `${spTitle} <short pause> ${spokenText}`;
      }
      clips.push({
        id: `${prefix}_s${idx + 1}`,
        text: spokenText,
      });
    });
    clips.push({
      id: `${prefix}_takeaway`,
      text: cleanSpoken(sheet.spokenTakeaway || sheet.takeaway),
    });
  });
  return clips;
}

async function ensureNarratorVoice(apiKey) {
  let cache = {};
  if (fs.existsSync(VOICE_CACHE_JSON)) {
    try {
      cache = JSON.parse(fs.readFileSync(VOICE_CACHE_JSON, 'utf8'));
    } catch (e) {}
  }
  if (cache[NARRATOR_PERSONA.key]) return cache[NARRATOR_PERSONA.key];

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/voices', {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      store: true,
      voice: {
        model: 'gemini-3.8-flash-tts',
        type: 'prompted',
        display_name: NARRATOR_PERSONA.display_name,
        gender: NARRATOR_PERSONA.gender,
        language_code: NARRATOR_PERSONA.language_code,
        prompted: { input: NARRATOR_PERSONA.prompt },
      },
    }),
  });
  if (!res.ok) throw new Error(`CreateVoice failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  cache[NARRATOR_PERSONA.key] = data.id;
  fs.writeFileSync(VOICE_CACHE_JSON, JSON.stringify(cache, null, 2));
  return data.id;
}

async function synthesizeClip(apiKey, voiceId, clip, outMp3Path, modelName) {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelName,
      store: false,
      input: [
        {
          type: 'user_input',
          content: [
            {
              type: 'text',
              text: clip.text,
              annotations: [{ type: 'speech_metadata', style: NARRATOR_PERSONA.style }],
            },
          ],
        },
      ],
      response_format: { type: 'audio' },
      generation_config: {
        speech_config: [{ voice: voiceId }],
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 220)}`);
  }

  const json = await res.json();
  const audioPart = (json.steps || [])
    .filter((s) => s.type === 'model_output')
    .flatMap((s) => s.content || [])
    .filter((c) => c.type === 'audio')
    .pop();

  if (!audioPart?.data) throw new Error(`No audio data returned for ${clip.id}`);

  const tmpWav = `${outMp3Path}.${modelName}.${process.pid}.wav`;
  fs.writeFileSync(tmpWav, Buffer.from(audioPart.data, 'base64'));
  execFileSync(
    'ffmpeg',
    ['-y', '-i', tmpWav, '-codec:a', 'libmp3lame', '-ar', '24000', '-ac', '1', '-b:a', '48k', outMp3Path],
    { stdio: 'ignore' },
  );
  if (fs.existsSync(tmpWav)) fs.unlinkSync(tmpWav);
  return Math.round(fs.statSync(outMp3Path).size / 1024);
}

async function main() {
  const apiKey = resolveApiKey();
  if (!apiKey) {
    console.error('❌ Missing GEMINI_API_KEY');
    process.exit(1);
  }

  const outDir = path.join(ROOT, 'public', 'audio', 'visual_sheets', 'gcse_cold_war');
  fs.mkdirSync(outDir, { recursive: true });

  const allClips = buildAllColdWarClips();
  const pending = allClips.filter((clip) => {
    const p = path.join(outDir, `${clip.id}.mp3`);
    return !fs.existsSync(p) || fs.statSync(p).size < 1500;
  });

  console.log(`📜 Total GCSE Cold War Visual Sheet clips: ${allClips.length} (${pending.length} remaining).`);
  if (pending.length === 0) return;

  const voiceId = await ensureNarratorVoice(apiKey);
  const laneFlash = [];
  const laneLite = [];
  pending.forEach((item, i) => {
    if (i % 2 === 0) laneFlash.push(item);
    else laneLite.push(item);
  });

  let completed = 0;
  async function runPacedLane(items, primaryModel, minIntervalMs) {
    for (const clip of items) {
      const startedAt = Date.now();
      const outMp3 = path.join(outDir, `${clip.id}.mp3`);
      let modelToUse = primaryModel;
      for (let attempt = 1; attempt <= 10; attempt++) {
        try {
          const kb = await synthesizeClip(apiKey, voiceId, clip, outMp3, modelToUse);
          completed++;
          console.log(`   [${completed}/${pending.length}] ✓ ${clip.id}.mp3 (${kb} KB · ${modelToUse})`);
          break;
        } catch (err) {
          const msg = String(err.message || '');
          if (attempt === 10) throw err;
          if (msg.includes('429') && msg.includes('per day')) {
            modelToUse = modelToUse === 'gemini-3.8-flash-tts' ? 'gemini-3.8-flash-lite-tts' : 'gemini-3.8-flash-tts';
          }
          const waitMs = msg.includes('429') ? 22000 + attempt * 5000 : 4000 * attempt;
          await new Promise((r) => setTimeout(r, waitMs));
        }
      }
      const elapsed = Date.now() - startedAt;
      if (elapsed < minIntervalMs) {
        await new Promise((r) => setTimeout(r, minIntervalMs - elapsed));
      }
    }
  }

  await Promise.all([
    runPacedLane(laneFlash, 'gemini-3.8-flash-tts', 6500),
    runPacedLane(laneLite, 'gemini-3.8-flash-lite-tts', 6500),
  ]);

  console.log(`\n🎉 Complete! All 84 GCSE Cold War Visual Sheet MP3s ready!`);
}

main().catch((err) => {
  console.error('❌ Voice generation failed:', err.message);
  process.exit(1);
});
