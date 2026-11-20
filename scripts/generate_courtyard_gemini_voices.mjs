#!/usr/bin/env node
/**
 * Courtyard of Two Keys — Studio Acted & Accent-Directed English Voice-Over Generator
 * Powered by Official Gemini 3.8 Flash TTS + Voice Design (`gemini-3.8-flash-tts` & `gemini-3.8-flash-lite-tts`)
 *
 * Includes:
 *  - Dedicated regional & age-calibrated character voices (including Salma, 14yo Karim, Levantine Layla,
 *    Israeli Mediterranean Noa & Yonatan — zero American rhotic accents!)
 *  - All 24 era-specific London, Jerusalem & Cairo/Amman shortwave radio broadcasts (`radio_ep{idx}_s{0|1|2}`)
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { KT1_EPISODES } from '../src/arcade/games/cme_courtyard/episodes_kt1.js';
import { KT2_EPISODES } from '../src/arcade/games/cme_courtyard/episodes_kt2.js';
import { KT3_EPISODES } from '../src/arcade/games/cme_courtyard/episodes_kt3.js';
import {
  NON_SPOILER_OBJECTIVES,
  CHARACTER_DEBATES,
} from '../src/arcade/games/cme_courtyard/directors_cut_data.js';
import { CHARACTER_DIALOGUE_TREES } from '../src/arcade/games/cme_courtyard/adventure_immersion_data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const VO_OUT_DIR = path.join(ROOT, 'public', 'audio', 'arcade', 'cme', 'vo');
const MANIFEST_JS = path.join(ROOT, 'src', 'arcade', 'games', 'cme_courtyard', 'vo_manifest.js');
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

const PERSONA_DEFS = {
  ibrahim_young: {
    display_name: 'Ibrahim (Mid-40s Levantine Baritone)',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'A warm, dignified orchard grower in his mid-40s speaking fluent English with a gentle Levantine accent, rich baritone warmth, and measured cadence.',
    defaultStyle: 'warm, dignified, reflective storytelling',
  },
  ibrahim_elder: {
    display_name: 'Ibrahim (Late-60s Grandfather)',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'A wise, gentle grandfather in his late 60s speaking unhurried English with a soft Levantine accent, warm low voice, and quiet kindness.',
    defaultStyle: 'unhurried, tender, grandfatherly warmth',
  },
  salma: {
    display_name: 'Salma (Mid-40s Levantine Mother)',
    gender: 'female',
    language_code: 'en-US',
    prompt:
      'A warm, dignified orchard mother in her mid-40s speaking fluent English with a distinct Levantine accent, softly rolled R, warm Mediterranean vowels, and unhurried maternal cadence.',
    defaultStyle: 'warm, heartfelt maternal storytelling',
  },
  karim_teen: {
    display_name: 'Karim (Young Scholar Light Tenor)',
    gender: 'male',
    language_code: 'en-US',
    prompt:
      'A thoughtful young student in his early 20s speaking fluent English with a noticeable Levantine accent, softly rolled R, light youthful tenor timbre, and earnest cadence.',
    defaultStyle: 'earnest, youthful, and expressive',
  },
  karim: {
    display_name: 'Karim (30s Schoolteacher)',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'A thoughtful schoolteacher in his early 30s speaking clear English with a light Levantine accent, warm tenor timbre, and calm conviction.',
    defaultStyle: 'earnest, calm, and expressive',
  },
  layla_v2: {
    display_name: 'Layla (20s Levantine Medical Student)',
    gender: 'female',
    language_code: 'en-US',
    prompt:
      'A compassionate young medical student in her early 20s speaking fluent English with a distinct Levantine accent, softly rolled R, clear Mediterranean vowels, and warm sincere tone.',
    defaultStyle: 'warm, sincere, and expressive',
  },
  tariq: {
    display_name: 'Tariq (20s Energetic Brother)',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'An energetic young man in his early 20s speaking English with a noticeable Levantine accent, brisk pace, and resonant voice.',
    defaultStyle: 'animated, urgent, and expressive',
  },
  eli: {
    display_name: 'Eli (Mid-20s Harbour Worker)',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'A brisk, intense young man in his mid-20s speaking English with a slight Eastern European and Mediterranean accent and crisp projection.',
    defaultStyle: 'intense, brisk, and emphatic',
  },
  dov: {
    display_name: 'Dov (40s Craftsman & Father)',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'A steady, thoughtful craftsman in his 40s speaking fluent English with a gentle Eastern European accent and warm baritone timbre.',
    defaultStyle: 'steady, grounded, and earnest',
  },
  miriam_young: {
    display_name: 'Miriam (Late-20s Mother)',
    gender: 'female',
    language_code: 'en-GB',
    prompt:
      'A compassionate woman in her late 20s speaking warm English with a subtle Polish accent and expressive, clear tone.',
    defaultStyle: 'empathetic, heartfelt, quietly resolute',
  },
  miriam_elder: {
    display_name: 'Miriam (Late-60s Grandmother)',
    gender: 'female',
    language_code: 'en-GB',
    prompt:
      'A warm, thoughtful grandmother in her late 60s speaking unhurried English with a gentle Eastern European accent, rich alto voice, and quiet wisdom.',
    defaultStyle: 'unhurried, warm, poignant and wise',
  },
  noa_v2: {
    display_name: 'Noa (20s Israeli Nurse)',
    gender: 'female',
    language_code: 'en-GB',
    prompt:
      'A composed, warm-hearted young woman in her early 20s speaking fluent English with a subtle Israeli Hebrew-inflected Eastern Mediterranean accent, non-rhotic vowels, and clear sincere tone.',
    defaultStyle: 'warm, composed, subtle Eastern Mediterranean cadence',
  },
  avi: {
    display_name: 'Avi (30s Engineer)',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'A grounded engineer in his early 30s speaking fluent English with a subtle Mediterranean accent and steady mid-baritone voice.',
    defaultStyle: 'measured, warm, and realistic',
  },
  yonatan_v2: {
    display_name: 'Yonatan (20s Eastern Mediterranean Paramedic)',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'A reflective young paramedic in his early 20s speaking fluent non-rhotic English with a subtle Eastern Mediterranean accent, warm clear diction, and calm sincere tone.',
    defaultStyle: 'spoken strictly in clear English, reflective and sincere',
  },
  narrator: {
    display_name: 'Chronicle Historian Narrator',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'A warm documentary historian in his 50s with a classic British broadcast accent, resonant voice, crisp diction, and measured pace.',
    defaultStyle: 'measured, atmospheric documentary storytelling',
  },
  radio_jerusalem: {
    display_name: 'Jerusalem Radio Newsreader',
    gender: 'female',
    language_code: 'en-GB',
    prompt:
      'A poised mid-century radio newsreader in her late 30s speaking crisp non-rhotic broadcast English with a subtle Eastern Mediterranean accent and clear projection.',
    defaultStyle: 'spoken strictly in clear broadcast English, crisp vintage radio news bulletin',
  },
  radio_arab: {
    display_name: 'Cairo & Amman Radio Newsreader',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'An authoritative mid-century radio newsreader in his 40s speaking crisp British-educated broadcast English with a noticeable Levantine accent and resonant baritone projection.',
    defaultStyle: 'spoken strictly in clear broadcast English, expressive vintage shortwave news bulletin',
  },
};

// Exact list of clips whose text or voice persona changed in Master Polish Pass
export const CHANGED_OR_RECAST_IDS = new Set([
  'ep0_solved',
  'ep0_intro_aloni',
  'ep0_a_couple',
  'ep0_a_ledger',
  'ep1_h_family',
  'ep1_a_eli',
  'ep2_solved',
  'ep2_a_miriam',
  'ep2_a_tin',
  'ep2_a_stone',
  'ep3_intro_haddad',
  'ep3_h_radio',
  'ep3_a_radio',
  'ep4_a_couple',
  'ep4_h_tariq',
  'ep5_intro_aloni',
  'ep5_a_radio',
  'ep5_a_map',
  'ep6_solved',
  'ep6_intro_haddad',
  'ep6_a_noa',
  'ep6_a_well',
  'ep7_h_tariq',
  'ep7_intro_aloni',
  'ep8_solved',
  'ep8_a_couple',
  'ep8_a_map',
  'ep8_h_karim',
  'ep8_h_oil',
  'ep9_solved',
  'ep9_a_tv',
  'ep9_a_map',
  'ep10_intro_aloni',
  'ep10_a_family',
  'ep10_a_radio',
  'ep10_intro_haddad',
  'ep10_h_street',
  'ep10_h_key',
  'ep10_h_doc',
  'ep11_a_map',
  'ep11_h_pair',
  'intertitle_ep9',
  'intertitle_ep11',
]);

function mapPersonaKey(role, year = 1948, hintId = '') {
  if (role === 'ibrahim') return year >= 1965 ? 'ibrahim_elder' : 'ibrahim_young';
  if (role === 'miriam') return year >= 1985 ? 'miriam_elder' : 'miriam_young';
  if (role === 'salma') return 'salma';
  if (role === 'karim_teen') return 'karim_teen';
  if (role === 'layla') return 'layla_v2';
  if (role === 'noa') return 'noa_v2';
  if (role === 'yonatan') return 'yonatan_v2';
  if (role === 'eli' || (role === 'tariq' && String(hintId).includes('eli'))) return 'eli';
  if (PERSONA_DEFS[role]) return role;
  return 'narrator';
}

function cleanSpeechText(raw) {
  return String(raw || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^[“"]+|[”"]+$/g, '')
    .trim();
}

function buildCompleteLineQueue() {
  const allEps = [...KT1_EPISODES, ...KT2_EPISODES, ...KT3_EPISODES];
  const queue = [];
  const seen = new Set();

  const pushItem = (id, personaKey, text, styleOverride = null, preferLite = false) => {
    if (!id || seen.has(id) || !text) return;
    seen.add(id);
    queue.push({
      id,
      personaKey,
      text: cleanSpeechText(text),
      style: styleOverride || PERSONA_DEFS[personaKey]?.defaultStyle || 'warm and natural',
      preferLite,
    });
  };

  allEps.forEach((ep, idx) => {
    const meta = NON_SPOILER_OBJECTIVES[idx];
    if (meta) {
      pushItem(
        `intertitle_ep${idx}`,
        'narrator',
        `Chapter ${idx + 1}: ${meta.intertitleYear}. ${meta.intertitleLine}`,
        'cinematic, unhurried historical chapter introduction',
        true,
      );
    }

    const db = CHARACTER_DEBATES[idx];
    if (db) {
      pushItem(
        `debate_ep${idx}`,
        idx === 1 ? 'eli' : 'tariq',
        db.openingClaim,
        'passionate, heated face-to-face challenge',
      );
    }

    if (ep.puzzle?.solvedVoiceId && ep.puzzle?.solvedText) {
      const pk = mapPersonaKey(ep.puzzle.solvedVoiceRole, ep.yearFocus, ep.puzzle.solvedVoiceId);
      pushItem(ep.puzzle.solvedVoiceId, pk, ep.puzzle.solvedText, null, pk === 'narrator');
    }

    for (const sc of Object.values(ep.scenes)) {
      if (sc.introVoiceId && sc.introText) {
        const pk = mapPersonaKey(sc.introVoiceRole, ep.yearFocus, sc.introVoiceId);
        pushItem(sc.introVoiceId, pk, sc.introText, null, pk === 'narrator');
      }
      for (const h of sc.hotspots || []) {
        if (h.voiceId && h.dialogue) {
          const pk = mapPersonaKey(h.voiceRole, ep.yearFocus, h.voiceId);
          pushItem(h.voiceId, pk, h.dialogue, null, pk === 'narrator');
        }
        const tree = CHARACTER_DIALOGUE_TREES[h.id];
        if (tree && tree.length) {
          tree.forEach((tp, tIdx) => {
            const pk = mapPersonaKey(tp.voiceRole || h.voiceRole, ep.yearFocus, h.id);
            pushItem(`topic_${h.id}_t${tIdx}`, pk, tp.reply, null, tIdx % 2 === 1);
          });
        }
      }
    }

    // All 24 Era-Specific Shortwave Radio Station Broadcasts (`radio_ep{idx}_s{0|1|2}`)
    if (ep.radioBroadcast?.stations) {
      ep.radioBroadcast.stations.forEach((st, sIdx) => {
        const rPersona = sIdx === 0 ? 'narrator' : sIdx === 1 ? 'radio_jerusalem' : 'radio_arab';
        const spokenBulletin = `${st.city}. ${st.headline}. ${cleanSpeechText(st.transcript)}`;
        pushItem(
          `radio_ep${idx}_s${sIdx}`,
          rPersona,
          spokenBulletin,
          'crisp mid-century shortwave radio news broadcast',
          sIdx === 0,
        );
      });
    }
  });

  return queue;
}

async function ensureVoicesCreated(apiKey, onlyPersonas = null) {
  let cache = {};
  if (fs.existsSync(VOICE_CACHE_JSON)) {
    try {
      cache = JSON.parse(fs.readFileSync(VOICE_CACHE_JSON, 'utf8'));
    } catch (e) {}
  }

  for (const [key, def] of Object.entries(PERSONA_DEFS)) {
    if (onlyPersonas && !onlyPersonas.has(key)) continue;
    if (cache[key]) continue;
    console.log(`🎙️ Designing custom Gemini 3.8 voice persona: ${def.display_name}...`);
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
          display_name: def.display_name,
          gender: def.gender,
          language_code: def.language_code,
          prompted: { input: def.prompt },
        },
      }),
    });
    if (!res.ok) {
      const errTxt = await res.text();
      throw new Error(`CreateVoice failed for ${key} (${res.status}): ${errTxt}`);
    }
    const data = await res.json();
    cache[key] = data.id;
    fs.writeFileSync(VOICE_CACHE_JSON, JSON.stringify(cache, null, 2));
    console.log(`   ✓ Created ${key} -> ${data.id}`);
  }
  return cache;
}

async function synthesizeClip(apiKey, voiceId, item, outMp3Path, modelName = 'gemini-3.8-flash-tts') {
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
              text: item.text,
              annotations: [{ type: 'speech_metadata', style: item.style }],
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
    const errTxt = await res.text();
    throw new Error(`TTS synthesis failed for ${item.id} (${res.status}): ${errTxt}`);
  }

  const json = await res.json();
  const audioPart = (json.steps || [])
    .filter((s) => s.type === 'model_output')
    .flatMap((s) => s.content || [])
    .filter((c) => c.type === 'audio')
    .pop();

  if (!audioPart?.data) {
    throw new Error(`No audio data returned for ${item.id}`);
  }

  const tmpWav = outMp3Path.replace(/\.mp3$/, '.wav');
  fs.writeFileSync(tmpWav, Buffer.from(audioPart.data, 'base64'));
  execFileSync(
    'ffmpeg',
    ['-y', '-i', tmpWav, '-codec:a', 'libmp3lame', '-ar', '24000', '-ac', '1', '-b:a', '48k', outMp3Path],
    { stdio: 'ignore' },
  );
  fs.unlinkSync(tmpWav);
}

function writeManifestFile() {
  fs.mkdirSync(VO_OUT_DIR, { recursive: true });
  const ids = fs
    .readdirSync(VO_OUT_DIR)
    .filter((f) => f.endsWith('.mp3'))
    .map((f) => f.replace(/\.mp3$/, ''))
    .sort();

  const content = `/**
 * Auto-populated by \`node scripts/generate_courtyard_gemini_voices.mjs\`
 * Lists every acted English voice-over clip generated via Gemini 3.8 Flash TTS + Voice Design
 * in \`public/audio/arcade/cme/vo/<id>.mp3\`.
 */
export const AVAILABLE_ENGLISH_VO = new Set(${JSON.stringify(ids, null, 2)});
`;
  fs.writeFileSync(MANIFEST_JS, content, 'utf8');
  return ids.length;
}

async function main() {
  const onlyArg = process.argv.find((a) => a.startsWith('--only='));
  const refreshChanged = process.argv.includes('--refresh-changed');
  const queue = buildCompleteLineQueue();
  console.log(`📜 Prepared ${queue.length} total voice & shortwave broadcast clips across 12 chapters.`);

  const apiKey = resolveApiKey();
  if (!apiKey) {
    console.error('❌ Missing GEMINI_API_KEY in .env.local or environment!');
    process.exit(2);
  }

  fs.mkdirSync(VO_OUT_DIR, { recursive: true });

  if (onlyArg) {
    const wantedIds = new Set(onlyArg.slice('--only='.length).split(',').filter(Boolean));
    const subItems = queue.filter((x) => wantedIds.has(x.id));
    const neededPersonas = new Set(subItems.map((x) => x.personaKey));
    const voiceMap = await ensureVoicesCreated(apiKey, neededPersonas);
    for (const item of subItems) {
      const outMp3 = path.join(VO_OUT_DIR, `${item.id}.mp3`);
      await synthesizeClip(apiKey, voiceMap[item.personaKey], item, outMp3, 'gemini-3.8-flash-tts');
      console.log(`   🔊 Audition clip synthesized: ${item.id} (${item.personaKey}, ${fs.statSync(outMp3).size} bytes)`);
      await new Promise((r) => setTimeout(r, 6200));
    }
    writeManifestFile();
    return;
  }

  if (refreshChanged) {
    let purged = 0;
    for (const id of CHANGED_OR_RECAST_IDS) {
      const p = path.join(VO_OUT_DIR, `${id}.mp3`);
      if (fs.existsSync(p)) {
        fs.unlinkSync(p);
        purged++;
      }
    }
    console.log(`♻️ Purged ${purged} updated/recast clips for clean re-synthesis.`);
  }

  const voiceMap = await ensureVoicesCreated(apiKey);

  // Split evenly across BOTH TTS models (`flash-tts` + `flash-lite-tts`) so both 10-RPM Tier-1 lanes run in parallel!
  const laneFlash = [];
  const laneLite = [];
  let alreadyDone = 0;

  for (const item of queue) {
    const outMp3 = path.join(VO_OUT_DIR, `${item.id}.mp3`);
    if (fs.existsSync(outMp3) && fs.statSync(outMp3).size > 1500) {
      alreadyDone++;
      continue;
    }
    if (
      process.argv.includes('--lite-only') ||
      item.preferLite ||
      item.personaKey === 'narrator' ||
      item.personaKey === 'radio_jerusalem' ||
      item.personaKey === 'radio_arab'
    ) {
      laneLite.push(item);
    } else {
      laneFlash.push(item);
    }
  }

  let done = alreadyDone;
  console.log(
    `🚀 Synthesizing remaining ${laneFlash.length + laneLite.length} clips (${laneFlash.length} on flash-tts + ${laneLite.length} on flash-lite-tts; ${done} unchanged kept)...`,
  );

  async function runPacedLane(items, primaryModel, minIntervalMs) {
    for (const item of items) {
      const startedAt = Date.now();
      const outMp3 = path.join(VO_OUT_DIR, `${item.id}.mp3`);
      const vId = voiceMap[item.personaKey] || 'Kore';
      let modelToUse = primaryModel;

      for (let attempt = 1; attempt <= 10; attempt++) {
        try {
          await synthesizeClip(apiKey, vId, item, outMp3, modelToUse);
          break;
        } catch (err) {
          const msg = String(err.message || '');
          if (attempt === 10) throw err;
          if (msg.includes('400') && modelToUse === 'gemini-3.8-flash-lite-tts') {
            modelToUse = 'gemini-3.8-flash-tts';
          } else if (msg.includes('429') && msg.includes('per day') && modelToUse === 'gemini-3.8-flash-tts') {
            modelToUse = 'gemini-3.8-flash-lite-tts';
            continue;
          }
          const waitMs = msg.includes('429') ? 15000 + attempt * 3000 : 4000 * attempt;
          console.warn(`   ⏳ [${modelToUse}] Cooldown ${Math.round(waitMs / 1000)}s on ${item.id} (attempt ${attempt})`);
          await new Promise((r) => setTimeout(r, waitMs));
        }
      }

      done++;
      if (done % 6 === 0 || done === queue.length) {
        writeManifestFile();
        console.log(`   🔊 Synthesized [${done}/${queue.length}]: ${item.id} (${item.personaKey} · ${modelToUse})`);
      }

      const elapsed = Date.now() - startedAt;
      if (elapsed < minIntervalMs) {
        await new Promise((r) => setTimeout(r, minIntervalMs - elapsed));
      }
    }
  }

  await Promise.all([
    runPacedLane(laneFlash, 'gemini-3.8-flash-tts', 6400),
    runPacedLane(laneLite, 'gemini-3.8-flash-lite-tts', 6200),
  ]);

  const total = writeManifestFile();
  console.log(`🎉 Complete! ${total} acted English MP3s & radio broadcasts registered in vo_manifest.js!`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
