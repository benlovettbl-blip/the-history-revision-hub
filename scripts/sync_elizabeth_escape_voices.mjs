#!/usr/bin/env node
/**
 * The Cipher of Fotheringhay (Mary, Queen of Scots, 1568–1587) — Cinematic Studio Voiceover Synchronizer
 * Synthesizes 7 dramatic British documentary voiceover MP3s for the 4-Scene Opening Prologue
 * and 3-Scene Fotheringhay Finale using `gemini-3.8-flash-tts` + ffmpeg (24kHz mono 48kbps).
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ensureHouseVoiceId, resolveGeminiApiKey } from './studio_voice_registry.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'audio', 'labs', 'elizabeth_mary_escape');
const HASH_PATH = path.join(OUT_DIR, 'audio_hashes.json');

const CLIPS = [
  {
    id: 'prologue_1',
    voiceKey: 'female_historian',
    style: 'dramatic, cinematic British historical film narrator with hushed Tudor documentary gravitas, slow measured pacing',
    text: "England, fifteen fifty-eight. Protestant Queen Elizabeth the First inherits a fractured kingdom. To Catholic Europe, and to many powerful English nobles, she is illegitimate—and her crown rests upon a knife-edge.",
  },
  {
    id: 'prologue_2',
    voiceKey: 'female_historian',
    style: 'poignant, cinematic British narrator evoking tragic royalty and intrigue',
    text: "To the north rules her cousin: Mary, Queen of Scots—granddaughter of Henry the Seventh, devoutly Catholic, and next in line to the English throne. Driven from Scotland by Protestant lords, she is locked away on an island fortress.",
  },
  {
    id: 'prologue_3',
    voiceKey: 'male_historian',
    style: 'low, tense, chilling British spymaster documentary narrator, deliberate and watchful',
    text: "In London, Elizabeth's spymaster Sir Francis Walsingham never sleeps. His codebreakers, double agents, and informants watch every port, every tavern, and every wax-sealed letter crossing the sea.",
  },
  {
    id: 'prologue_4',
    voiceKey: 'mary_queen_of_scots',
    style: 'urgent, atmospheric educated Scottish royal woman speaking in first person inside a stone island tower at dusk',
    text: "May, fifteen sixty-eight. Lochleven Castle. Tonight, you are Mary, Queen of Scots. Help me escape this island tower, navigate four dangerous Catholic plots through secret letters, and outwit Walsingham—before his net closes forever.",
  },
  {
    id: 'room1_entry',
    voiceKey: 'mary_queen_of_scots',
    style: 'hushed, urgent educated Scottish royal woman whispering inside Lochleven tower at dusk',
    text: "Room One: Lochleven Castle, May fifteen sixty-eight. Look closely at the island fortress surrounding us—deep loch water cuts off every road. Inspect the visual evidence, then arrange our exact three-step escape plan before the guard changes.",
  },
  {
    id: 'room2_entry',
    voiceKey: 'mary_queen_of_scots',
    style: 'tense, conspiratorial educated Scottish royal woman under English house arrest',
    text: "Room Two: Bolton and Tutbury Castles. Elizabeth has locked me under guard, yet Catholic nobles and the Duke of Norfolk are sending secret letters. Inspect Norfolk's portrait and the chronicle clue to deduce the three consecutive years that open this conspiracy vault.",
  },
  {
    id: 'room3_entry',
    voiceKey: 'mary_queen_of_scots',
    style: 'anxious, watchful educated Scottish royal woman as Walsinghams spymaster net tightens',
    text: "Room Three: Sheffield Manor, fifteen eighty-three. Walsingham's spies are closing in after Francis Throckmorton's arrest. Study Christopher Saxton's fifteen seventy-nine map to spot the coast facing France, unmask the forged dispatch, and identify Parliament's deadly new law.",
  },
  {
    id: 'room4_entry',
    voiceKey: 'mary_queen_of_scots',
    style: 'breathless, hopeful educated Scottish royal woman believing freedom is finally within reach at Chartley Hall',
    text: "Room Four: Chartley Hall, July fifteen eighty-six. At last—a sympathetic brewer is smuggling Anthony Babington's coded letters inside our beer barrels! Watch out for the two meaningless Null symbols hidden in the code, crack the six real letters, and seal our reply to ride to freedom!",
  },
  {
    id: 'finale_trap',
    voiceKey: 'male_historian',
    style: 'cold, devastating, dramatic British narrator revealing a master spymaster trap springing shut',
    text: "There was never an escape. The sympathetic brewer, Gilbert Gifford, worked for Walsingham from the very first day. Every beer-barrel letter went straight to codebreaker Thomas Phelippes. Under the fifteen eighty-four Bond of Association, Mary's own coded reply sealed her fate.",
  },
  {
    id: 'finale_fotheringhay',
    voiceKey: 'female_historian',
    style: 'solemn, deeply moving, dignified British historical cinema narrator describing Fotheringhay Castle on 8 February 1587',
    text: "Fotheringhay Castle, the eighth of February, fifteen eighty-seven. Three hundred witnesses watch in silence as Mary mounts the black-draped scaffold. When her black outer gown falls away, the hall gasps: beneath it she wears bright crimson velvet—the colour of a Catholic martyr. Whispering in Latin, into thy hands, O Lord, she lays her head upon the block.",
  },
  {
    id: 'finale_aftermath',
    voiceKey: 'male_historian',
    style: 'resonant, authoritative British documentary narrator concluding with historys great ironic twist',
    text: "Mary's execution outraged Catholic Europe and gave King Philip the Second of Spain the final spark to launch the fifteen eighty-eight Spanish Armada. Yet sixteen years later, when Elizabeth died childless, it was Mary's own son—King James the Sixth of Scotland—who inherited the English crown.",
  },
];

function sha256(s) {
  return crypto.createHash('sha256').update(String(s), 'utf8').digest('hex');
}

function encodeWavToMp3(wavBuffer, outMp3Path) {
  const tmpWav = `${outMp3Path}.tmp.${process.pid}.${Math.random().toString(36).slice(2, 7)}.wav`;
  fs.mkdirSync(path.dirname(outMp3Path), { recursive: true });
  fs.writeFileSync(tmpWav, wavBuffer);
  execFileSync(
    'ffmpeg',
    ['-y', '-i', tmpWav, '-af', 'apad=pad_dur=0.25', '-codec:a', 'libmp3lame', '-ar', '24000', '-ac', '1', '-b:a', '48k', outMp3Path],
    { stdio: 'ignore' },
  );
  if (fs.existsSync(tmpWav)) fs.unlinkSync(tmpWav);
  return fs.statSync(outMp3Path).size;
}

async function synthesizeClip(apiKey, clip, voiceId) {
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent',
    {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${clip.text} <short pause>`, speech_metadata: { style: clip.style } }],
          },
        ],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceId } },
          },
        },
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`TTS failed for ${clip.id} (${res.status}): ${(await res.text()).slice(0, 260)}`);
  }
  const json = await res.json();
  const b64 = json?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!b64) throw new Error(`Missing audio inlineData for ${clip.id}`);
  const outMp3 = path.join(OUT_DIR, `${clip.id}.mp3`);
  const bytes = encodeWavToMp3(Buffer.from(b64, 'base64'), outMp3);
  console.log(`✅ [${clip.voiceKey}] ${clip.id}.mp3 (${(bytes / 1024).toFixed(1)} KB)`);
}

async function main() {
  const apiKey = resolveGeminiApiKey();
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let hashes = { clips: {} };
  if (fs.existsSync(HASH_PATH)) {
    try {
      hashes = JSON.parse(fs.readFileSync(HASH_PATH, 'utf8'));
    } catch (_) {}
  }

  const pending = [];
  for (const clip of CLIPS) {
    const voiceId = await ensureHouseVoiceId(apiKey, clip.voiceKey);
    const digest = sha256(`${voiceId}|${clip.style}|${clip.text}`);
    const mp3Path = path.join(OUT_DIR, `${clip.id}.mp3`);
    if (hashes.clips?.[clip.id] === digest && fs.existsSync(mp3Path) && fs.statSync(mp3Path).size > 1500) {
      console.log(`✓ Cached ${clip.id}.mp3`);
    } else {
      pending.push({ clip, voiceId, digest });
    }
  }

  if (pending.length > 0) {
    await Promise.all(
      pending.map(async ({ clip, voiceId, digest }) => {
        await synthesizeClip(apiKey, clip, voiceId);
        hashes.clips[clip.id] = digest;
      }),
    );
    fs.writeFileSync(HASH_PATH, JSON.stringify(hashes, null, 2) + '\n', 'utf8');
  }

  console.log(`🎉 Elizabeth Escape Room Studio Voiceovers ready: ${CLIPS.length}/${CLIPS.length} MP3s`);
}

main().catch((err) => {
  console.error('❌ Elizabeth VO error:', err);
  process.exit(1);
});
