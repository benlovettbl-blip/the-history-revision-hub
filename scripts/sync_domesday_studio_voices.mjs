#!/usr/bin/env node
/**
 * 1086 Domesday Lab ("The Secret of Stubitone") — Studio Character Voiceover Synchronizer
 *
 * Synthesizes 19 acted 1086 character voice lines via `gemini-3.8-flash-tts`
 * (using cached House & Ensemble voice IDs in `scripts/.studio_voice_ids.json`,
 * with automatic Batch TTS fallback if real-time RPD quota is busy), encodes
 * crisp 24kHz mono 40kbps `.mp3` files into `public/audio/labs/domesday/`,
 * tracks SHA-256 hashes in `public/audio/labs/domesday/audio_hashes.json`,
 * and writes `src/interactive_labs/domesday_vo_manifest.js`.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadVoiceCache, resolveGeminiApiKey } from './studio_voice_registry.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'audio', 'labs', 'domesday');
const HASH_PATH = path.join(OUT_DIR, 'audio_hashes.json');
const MANIFEST_JS_PATH = path.join(ROOT, 'src', 'interactive_labs', 'domesday_vo_manifest.js');

const CLIPS = [
  {
    id: 'cover_welcome',
    voiceKey: 'ww1_british_officer',
    style: 'haughty, theatrical, fastidious 11th-century Norman royal clerk with an aristocratic sneer and crisp comic timing',
    text: "Halt, muddy Hampshire peasant! By command of King William the Conqueror, step forward for the ten eighty-six Royal Domesday Audit, and wipe your boots!",
  },
  {
    id: 'cover_bennet_poke',
    voiceKey: 'ww1_british_tommy',
    style: 'grumpy, fed-up, rain-soaked Hampshire peasant standing waist-deep in freezing mud, muttering darkly with dry British comic timing',
    text: "Oi! Press the big shiny start button already! My toes went numb in this freezing Fareham mud twenty minutes ago, and this seagull is eyeing my turnip!",
  },
  {
    id: 'beat0_swamp_splash',
    voiceKey: 'ww1_british_officer',
    style: 'amused, mocking, theatrical aristocratic royal clerk chuckling at a peasant in a swamp',
    text: "Splash! Congratulations! In ten eighty-six your town doesn't exist yet! Your bedroom is knee-deep salt marsh, three seagulls, and Bennet Luvet!",
  },
  {
    id: 'beat0_bennet_swamp',
    voiceKey: 'ww1_british_tommy',
    style: 'grumpy, soaked, weary Hampshire mud-peasant shivering in pouring rain with deadpan irony',
    text: "Lovely bit of swamp, this! Zero roads, zero shops, pouring sideways rain. Stick a ferry here in nine hundred years, maybe it'll catch on!",
  },
  {
    id: 'beat0_survived_village',
    voiceKey: 'ww1_british_officer',
    style: 'brisk, authoritative royal inspector pointing at a medieval map',
    text: "Aha! That settlement DOES stand in ten eighty-six! Look sharp: tiny nine-hut Stubbington and bustling Fareham are already on the King's parchment!",
  },
  {
    id: 'beat1_odo_oath',
    voiceKey: 'ww1_british_tommy',
    style: 'panicked, breathless, guilty medieval village reeve stammering nervously while hiding tax assets',
    text: "I swear on Saint Swithin's holy bones, my Lord, barely two squeaky little watermills in all of Fareham! Please ignore that loud splashing behind the bushes!",
  },
  {
    id: 'beat1_guy_chicken',
    voiceKey: 'ww1_british_officer',
    style: 'outraged, impatient, snobbish Norman royal clerk snapping at an assistant',
    text: "Put that scrawny chicken down at once! King William taxes plough-teams and watermills, not farmyard poultry!",
  },
  {
    id: 'beat1_bennet_creek',
    voiceKey: 'ww1_british_tommy',
    style: 'fed-up, grumpy mud-soaked peasant muttering darkly while hugging one rotten turnip',
    text: "Don't look at me, squire! One wormy turnip, zero oxen, zero land. Even the King's nosy clerks won't waste good ink on Bennet Luvet!",
  },
  {
    id: 'beat1_mills_caught',
    voiceKey: 'ww1_british_tommy',
    style: 'defeated, groaning village reeve caught red-handed in a lie',
    text: "Oh, mercy! Five watermills on the creek and thirteen fat pigs in the oak woods! And worse still, peasants aren't even allowed to grind flour at home without paying the Bishop!",
  },
  {
    id: 'beat1_gyrth_servi',
    voiceKey: 'male_historian',
    style: 'quiet, calm, deeply dignified, unhurried human voice speaking with quiet gravity and sorrow',
    text: "The Bishop's scribe wrote all ten of us down on the parchment right beside the plough-oxen. In ten eighty-six Fareham, enslaved workers own no land, and we cannot leave.",
  },
  {
    id: 'beat2_hugh_boast',
    voiceKey: 'male_historian',
    style: 'booming, boastful, triumphant Norman baron gloating cheerfully over conquered estates',
    text: "Godwin's Stubbington farm? Mine! Wickham? Mine! Fifty-four Hampshire manors? All mine! Best conquest ever!",
  },
  {
    id: 'beat2_guy_haircut',
    voiceKey: 'ww1_british_officer',
    style: 'offended, vain Norman aristocrat defending his ridiculous haircut',
    text: "Hands off the razor-nick! Shaving the back of one's neck up to the ears is peak ten eighty-six Norman fashion!",
  },
  {
    id: 'beat3_villager_plea',
    voiceKey: 'ww1_british_tommy',
    style: 'earnest, exhausted English villager pleading passionately before a royal judge',
    text: "My Lord Commissioner, King Edward cut Fareham's tax from thirty hides to twenty because Viking raiders attacked us from the sea! Now Norman Bishop Walkelin demands twenty pounds when our whole town only makes sixteen. We will starve!",
  },
  {
    id: 'beat3_clerk_demand',
    voiceKey: 'ww1_british_officer',
    style: 'cold, ruthless royal treasury official demanding maximum tax',
    text: "Bah! Viking longships haven't burned Fareham Creek in years! Cancel their soft Saxon discount, and force them to pay Bishop Walkelin every silver penny of that twenty pounds!",
  },
  {
    id: 'beat3_real_verdict',
    voiceKey: 'male_historian',
    style: 'dramatic, intrigued British historian revealing a surprising plot twist from the real Domesday Book',
    text: "Astonishingly, King William's real Commissioners kept Fareham's twenty-hide Viking discount, and publicly shamed the Bishop in the Domesday Book, writing: it pays twenty pounds, but it cannot bear it!",
  },
  {
    id: 'beat4_monk_myth',
    voiceKey: 'male_historian',
    style: 'hushed, gloomy medieval monk whispering dramatically over candlelight',
    text: "In my chronicle I complained that not one single ox, cow, or pig was left out of William's shameful book. Take that spyglass and check what the scribes really missed!",
  },
  {
    id: 'beat4_edith_door',
    voiceKey: 'ww1_british_woman',
    style: 'fiery, indignant, quick-witted English village mother telling off a royal clerk from her doorway',
    text: "Nine households?! Your posh Latin book counted nine husbands in Stubbington and acted like me, Grandma, and five starving kids don't exist! What am I, a turnip?!",
  },
  {
    id: 'beat5_stubitone_latin',
    voiceKey: 'male_historian',
    style: 'warm, resonant scholar reading medieval Domesday Latin clearly before translating',
    text: "Listen to Stubbington's real ten eighty-six entry on Folio forty-six: Hugo de Port tenet de rege Stubitone. Sheriff Hugh holds Tree-Stump Farm, where Saxon Godwin once stood.",
  },
  {
    id: 'beat5_debrief_historian',
    voiceKey: 'female_historian',
    style: 'warm, clear, engaging British history teacher summarizing a lesson with authority and warmth',
    text: "Audit complete! Every village figure you just investigated comes straight from the real ten eighty-six Domesday Book, while characters like Bennet, Edith, and Odo give voice to the nameless locals whom King William's taxmen never named.",
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
    ['-y', '-i', tmpWav, '-af', 'apad=pad_dur=0.22', '-codec:a', 'libmp3lame', '-ar', '24000', '-ac', '1', '-b:a', '40k', outMp3Path],
    { stdio: 'ignore' },
  );
  if (fs.existsSync(tmpWav)) fs.unlinkSync(tmpWav);
  return fs.statSync(outMp3Path).size;
}

async function synthesizeRealtimeOne(apiKey, voiceId, clip, outMp3Path) {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gemini-3.8-flash-tts',
      store: false,
      input: [
        {
          type: 'user_input',
          content: [
            {
              type: 'text',
              text: `${clip.text} <short pause>`,
              annotations: [{ type: 'speech_metadata', speaker: 'Narrator', style: clip.style }],
            },
          ],
        },
      ],
      response_format: { type: 'audio' },
      generation_config: {
        speech_config: {
          speakers: [{ speaker: 'Narrator', voice: voiceId }],
        },
      },
    }),
  });

  if (!res.ok) {
    const body = (await res.text()).slice(0, 220);
    const err = new Error(`Realtime TTS HTTP ${res.status}: ${body}`);
    err.status = res.status;
    throw err;
  }

  const json = await res.json();
  const audioPart =
    json.output_audio ||
    (json.steps || [])
      .filter((s) => s.type === 'model_output')
      .flatMap((s) => s.content || [])
      .filter((c) => c.type === 'audio')
      .pop();

  if (!audioPart?.data) throw new Error(`No audio data returned for ${clip.id}`);
  return encodeWavToMp3(Buffer.from(audioPart.data, 'base64'), outMp3Path);
}

async function synthesizeViaBatchByVoice(apiKey, voiceId, clipsForVoice) {
  const inlineRequests = clipsForVoice.map((c) => ({
    request: {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${c.text} <short pause>`, speech_metadata: { style: c.style } }],
        },
      ],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceId } },
        },
      },
    },
  }));

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
          display_name: `domesday-vo-${Date.now()}`,
          input_config: { requests: { requests: inlineRequests } },
        },
      }),
    },
  );
  if (!createRes.ok) {
    throw new Error(`Batch create failed (${createRes.status}): ${(await createRes.text()).slice(0, 240)}`);
  }
  const created = await createRes.json();
  const batchName = created.name;
  console.log(`   ⏳ Polling Batch ${batchName} (${clipsForVoice.length} clips)...`);

  for (let poll = 1; poll <= 120; poll++) {
    await new Promise((r) => setTimeout(r, 6000));
    const pollRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/${batchName}`, {
      headers: { 'x-goog-api-key': apiKey },
    });
    if (!pollRes.ok) continue;
    const pollJson = await pollRes.json();
    const state = pollJson.metadata?.state || '';
    if (state === 'BATCH_STATE_SUCCEEDED') {
      const responses = pollJson.response?.inlinedResponses?.inlinedResponses || [];
      responses.forEach((entry, idx) => {
        const clip = clipsForVoice[idx];
        const b64 = entry?.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!b64) throw new Error(`Missing inlineData for ${clip.id}`);
        const outMp3 = path.join(OUT_DIR, `${clip.id}.mp3`);
        const bytes = encodeWavToMp3(Buffer.from(b64, 'base64'), outMp3);
        console.log(`   ✅ [Batch] ${clip.id}.mp3 (${(bytes / 1024).toFixed(1)} KB)`);
      });
      return;
    }
    if (state === 'BATCH_STATE_FAILED' || state === 'BATCH_STATE_CANCELLED') {
      throw new Error(`Batch ${batchName} ended in ${state}`);
    }
  }
  throw new Error(`Batch ${batchName} timed out`);
}

async function main() {
  const apiKey = resolveGeminiApiKey();
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY');
  const voiceCache = loadVoiceCache();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let hashes = { clips: {} };
  if (fs.existsSync(HASH_PATH)) {
    try {
      hashes = JSON.parse(fs.readFileSync(HASH_PATH, 'utf8'));
    } catch (_) {}
  }

  const pending = [];
  for (const clip of CLIPS) {
    const voiceId = voiceCache[clip.voiceKey];
    if (!voiceId) throw new Error(`Missing cached voiceId for ${clip.voiceKey}`);
    const digest = sha256(`${voiceId}|${clip.style}|${clip.text}`);
    const mp3Path = path.join(OUT_DIR, `${clip.id}.mp3`);
    if (hashes.clips?.[clip.id] === digest && fs.existsSync(mp3Path) && fs.statSync(mp3Path).size > 1500) {
      console.log(`✓ Cached ${clip.id}.mp3`);
    } else {
      pending.push({ ...clip, voiceId, digest, mp3Path });
    }
  }

  let useBatchFallback = false;
  const remainingForBatch = [];

  for (const item of pending) {
    if (useBatchFallback) {
      remainingForBatch.push(item);
      continue;
    }
    try {
      const bytes = await synthesizeRealtimeOne(apiKey, item.voiceId, item, item.mp3Path);
      hashes.clips[item.id] = item.digest;
      fs.writeFileSync(HASH_PATH, JSON.stringify(hashes, null, 2) + '\n', 'utf8');
      console.log(`✅ [Realtime] ${item.id}.mp3 (${(bytes / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.warn(`⚠️ Realtime TTS switched to Batch on ${item.id}: ${err.message}`);
      useBatchFallback = true;
      remainingForBatch.push(item);
    }
  }

  if (remainingForBatch.length > 0) {
    const byVoice = new Map();
    for (const item of remainingForBatch) {
      if (!byVoice.has(item.voiceId)) byVoice.set(item.voiceId, []);
      byVoice.get(item.voiceId).push(item);
    }
    for (const [voiceId, group] of byVoice.entries()) {
      await synthesizeViaBatchByVoice(apiKey, voiceId, group);
      for (const item of group) {
        hashes.clips[item.id] = item.digest;
      }
      fs.writeFileSync(HASH_PATH, JSON.stringify(hashes, null, 2) + '\n', 'utf8');
    }
  }

  const availableIds = CLIPS.filter((c) => fs.existsSync(path.join(OUT_DIR, `${c.id}.mp3`))).map((c) => c.id);
  fs.mkdirSync(path.dirname(MANIFEST_JS_PATH), { recursive: true });
  fs.writeFileSync(
    MANIFEST_JS_PATH,
    `/**\n * Auto-generated Studio TTS Voiceover Manifest for The Secret of Stubitone (1086 Domesday Lab)\n */\nexport const DOMESDAY_VO_CLIPS = new Set(${JSON.stringify(availableIds, null, 2)});\n`,
    'utf8',
  );
  console.log(`\n🎉 Domesday Studio VO complete: ${availableIds.length}/${CLIPS.length} MP3s ready!`);
}

main().catch((err) => {
  console.error('❌ Domesday VO error:', err);
  process.exit(1);
});
