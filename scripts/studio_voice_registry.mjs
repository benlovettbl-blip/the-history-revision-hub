/**
 * Studio Historian Voice Registry — The History Revision Hub
 *
 * Defines the two permanent British Documentary Historian voices ("House Voices")
 * and deterministic per-unit voice assignments across all 18 canonical units.
 * Voice IDs are created once via `/v1beta/voices` and cached permanently in
 * `scripts/.studio_voice_ids.json`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const STUDIO_VOICE_CACHE_PATH = path.join(__dirname, '.studio_voice_ids.json');
const LEGACY_COURTYARD_CACHE_PATH = path.join(__dirname, '.courtyard_gemini_voice_ids.json');

export const HOUSE_VOICES = {
  male_historian: {
    key: 'male_historian',
    display_name: 'HRH British Male Historian',
    label: 'British Male Historian',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'A warm documentary historian in his 50s with a classic British broadcast accent, resonant voice, crisp diction, and measured pace.',
    style: 'warm, clear, unhurried British history teacher and documentary narrator',
  },
  female_historian: {
    key: 'female_historian',
    display_name: 'HRH British Female Historian',
    label: 'British Female Historian',
    gender: 'female',
    language_code: 'en-GB',
    prompt:
      'A warm, authoritative British female documentary historian in her 40s with a classic BBC broadcast accent, clear articulation, engaging warmth, and measured pace.',
    style: 'warm, clear, unhurried British history teacher and documentary narrator',
  },
};

/**
 * Bespoke First World War ("Voices of the Great War") Ensemble Cast
 * Created once via `/v1beta/voices` and cached permanently in `scripts/.studio_voice_ids.json`.
 */
export const WW1_CHARACTER_VOICES = {
  ww1_british_tommy: {
    key: 'ww1_british_tommy',
    display_name: 'HRH WWI British Infantry Private',
    label: 'British Infantry Private',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'A young working-class British infantry soldier in his early 20s from southern England during the First World War, natural everyday English accent, earnest, quiet, human, and reflective, as if recalling trench memories for an oral history archive.',
    style: 'earnest, grounded, reflective young working-class British soldier',
  },
  ww1_british_officer: {
    key: 'ww1_british_officer',
    display_name: 'HRH WWI Edwardian Officer & Statesman',
    label: 'Edwardian Officer & Statesman',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'A crisp, authoritative Edwardian British Army officer and statesman in his 40s, classic period Received Pronunciation baritone, resonant, composed, and articulate.',
    style: 'authoritative, crisp Edwardian British officer and statesman',
  },
  ww1_german_voice: {
    key: 'ww1_german_voice',
    display_name: 'HRH WWI German Veteran & Statesman',
    label: 'German Frontline & Imperial Voice',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'A German military officer and frontline veteran in his late 20s speaking fluent, clear English with a subtle, authentic German accent, measured gravitas, crisp consonants, and serious historical weight.',
    style: 'serious, measured German-accented English historical witness',
  },
  ww1_indian_sepoy: {
    key: 'ww1_indian_sepoy',
    display_name: 'HRH WWI Indian Army Sepoy',
    label: 'Indian Army Sepoy Voice',
    gender: 'male',
    language_code: 'en-IN',
    prompt:
      'A dignified North Indian soldier in his late 20s speaking clear, warm, unhurried English with a gentle, authentic Indian cadence, heartfelt, observant, and respectful, reading wartime letters home from Europe.',
    style: 'warm, dignified, heartfelt Indian soldier reading wartime letters home',
  },
  ww1_british_woman: {
    key: 'ww1_british_woman',
    display_name: 'HRH WWI British VAD Nurse & Munitionette',
    label: 'Wartime VAD Nurse & Home Front Voice',
    gender: 'female',
    language_code: 'en-GB',
    prompt:
      'A young English woman in her early 20s during the First World War, clear, natural British voice with quiet courage, empathy, and lived emotion.',
    style: 'earnest, empathetic young wartime British woman recalling lived experience',
  },
};

export const DOMESDAY_CHARACTER_VOICES = {
  domesday_salty_seagull: {
    key: 'domesday_salty_seagull',
    display_name: 'HRH 1086 Salty the Solent Seagull Narrator',
    label: 'Salty the Solent Seagull (Comic Guide)',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'A cheeky, raspy, high-energy British comic narrator with a mischievous coastal squawk and lively theatrical timing like a classic children’s history puppet host, crisp, playful, and crystal clear for 11-year-olds.',
    style: 'cheeky, raspy, mischievous British comic history guide',
  },
  domesday_reeve_odo: {
    key: 'domesday_reeve_odo',
    display_name: 'HRH 1086 Sweating Reeve Odo',
    label: 'Sweating Reeve Odo (Hampshire Reeve)',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'A round, flustered, high-pitched middle-aged English village reeve with a squeaky, breathless southern rural cadence, sounding nervously cheerful and comically guilty.',
    style: 'flustered, squeaky, breathless medieval village reeve',
  },
  domesday_sheriff_hugh: {
    key: 'domesday_sheriff_hugh',
    display_name: 'HRH 1086 Sheriff Hugh of Port',
    label: 'Sheriff Hugh of Port (Norman Baron)',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'A booming, deep-chested, swaggering Norman nobleman in his late 40s with a rich resonant bass-baritone voice, subtle aristocratic French-inflected English cadence, and triumphant theatrical authority.',
    style: 'booming, swaggering deep-voiced Norman baron',
  },
  domesday_monk_aldwin: {
    key: 'domesday_monk_aldwin',
    display_name: 'HRH 1086 Brother Aldwin Chronicler',
    label: 'Brother Aldwin (Winchester Chronicler)',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'An elderly Benedictine monk chronicler in his late 70s in a quiet stone scriptorium, frail, papery, raspy British voice speaking slowly with ancient gravity and dramatic wonder.',
    style: 'elderly, papery, dramatic medieval monastery chronicler',
  },
  domesday_villager_wulf: {
    key: 'domesday_villager_wulf',
    display_name: 'HRH 1086 Fareham Villager Wulf',
    label: 'Wulf of Fareham (Sworn Villager)',
    gender: 'male',
    language_code: 'en-GB',
    prompt:
      'A weather-beaten Hampshire coastal fisherman and villager in his mid-40s with a warm, grounded rural southern English voice, speaking with earnest honesty and urgent dignity.',
    style: 'earnest, weather-beaten rural southern English villager',
  },
  domesday_grandma_saxon: {
    key: 'domesday_grandma_saxon',
    display_name: 'HRH 1086 Grandma Eadgyth of Stubbington',
    label: 'Grandma Eadgyth (Saxon Elder)',
    gender: 'female',
    language_code: 'en-GB',
    prompt:
      'A sharp-witted, warm elderly English grandmother in her 70s with a gentle rural southern British accent, spirited, wise, and full of lived memory.',
    style: 'warm, spirited elderly English village grandmother',
  },
};

export const ALL_STUDIO_VOICES = {
  ...HOUSE_VOICES,
  ...WW1_CHARACTER_VOICES,
  ...DOMESDAY_CHARACTER_VOICES,
};

/**
 * Deterministic Unit-to-Voice Assignments (Alternating across GCSE, KS3 & KS2;
 * 100% consistent within each unit).
 */
export const UNIT_VOICE_ASSIGNMENTS = {
  // GCSE Units
  cme_new: 'male_historian',
  eee: 'female_historian',
  weimar_nazi_germany: 'male_historian',
  edexcel_medicine: 'female_historian',
  cold_war: 'male_historian',
  gcse_cold_war: 'male_historian',
  usa: 'female_historian',

  // KS3 & KS2 Units
  medieval_england: 'female_historian',
  monarchy_religion_power: 'male_historian',
  first_british_empire: 'female_historian',
  water_and_sanitation: 'male_historian',
  industrialisation_and_empire: 'female_historian',
  second_british_empire: 'male_historian',
  australia: 'female_historian',
  great_war: 'male_historian',
  great_war_part2: 'male_historian',
  the_shoah: 'female_historian',
  post_war_britain: 'female_historian',
  ks2_stone_to_iron_age: 'male_historian',
  ks2_ancient_egypt: 'female_historian',
  ks2_ancient_greece: 'male_historian',
  ks2_romans: 'female_historian',
  ks2_anglo_saxons_vikings: 'male_historian',
  ks2_early_islamic_baghdad: 'female_historian',
  ks2_maya_civilisation: 'male_historian',
  ks2_ww2: 'female_historian',
};

export function getUnitVoicePersona(unitId) {
  const voiceKey = UNIT_VOICE_ASSIGNMENTS[unitId] || 'male_historian';
  return HOUSE_VOICES[voiceKey] || HOUSE_VOICES.male_historian;
}

export function resolveGeminiApiKey() {
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

export function loadVoiceCache() {
  let cache = {};
  if (fs.existsSync(STUDIO_VOICE_CACHE_PATH)) {
    try {
      cache = JSON.parse(fs.readFileSync(STUDIO_VOICE_CACHE_PATH, 'utf8'));
    } catch (_) {}
  }
  if (!cache.male_historian && fs.existsSync(LEGACY_COURTYARD_CACHE_PATH)) {
    try {
      const legacy = JSON.parse(fs.readFileSync(LEGACY_COURTYARD_CACHE_PATH, 'utf8'));
      if (legacy.narrator) {
        cache.male_historian = legacy.narrator;
        fs.writeFileSync(STUDIO_VOICE_CACHE_PATH, JSON.stringify(cache, null, 2) + '\n', 'utf8');
      }
    } catch (_) {}
  }
  return cache;
}

export async function ensureHouseVoiceId(apiKey, voiceKey) {
  const persona = ALL_STUDIO_VOICES[voiceKey];
  if (!persona) throw new Error(`Unknown studio voice key: ${voiceKey}`);

  const cache = loadVoiceCache();
  if (cache[voiceKey]) return cache[voiceKey];

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
        display_name: persona.display_name,
        gender: persona.gender,
        language_code: persona.language_code,
        prompted: { input: persona.prompt },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`CreateVoice (${voiceKey}) failed (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  cache[voiceKey] = data.id;
  fs.writeFileSync(STUDIO_VOICE_CACHE_PATH, JSON.stringify(cache, null, 2) + '\n', 'utf8');
  return data.id;
}
