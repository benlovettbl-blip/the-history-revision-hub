#!/usr/bin/env node
/**
 * KS2 WWII Home Front Adventure ("The Suitcase on Platform Four", 1939–1945) — Studio Voiceover Synchronizer
 *
 * Synthesizes 24 warm, empathetic, age-calibrated (Ages 9–11) acted character voice lines
 * via `gemini-3.8-flash-tts` Batch API in parallel across unique cached voice IDs, encodes
 * crisp 24kHz mono 40kbps `.mp3` files into `public/audio/labs/ww2_homefront/`,
 * tracks SHA-256 hashes in `public/audio/labs/ww2_homefront/audio_hashes.json`,
 * and writes `src/interactive_labs/ww2_homefront_vo_manifest.js`.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadVoiceCache, resolveGeminiApiKey } from './studio_voice_registry.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'audio', 'labs', 'ww2_homefront');
const HASH_PATH = path.join(OUT_DIR, 'audio_hashes.json');
const MANIFEST_JS_PATH = path.join(ROOT, 'src', 'interactive_labs', 'ww2_homefront_vo_manifest.js');

const CLIPS = [
  // Cover hotspots & welcome
  {
    id: 'cover_clara_welcome',
    voiceKey: 'ww1_british_woman',
    style: 'warm, hopeful, brave young British storyteller reminiscing gently about September 1939 with classic Goodnight Mister Tom warmth',
    text: "First of September, nineteen thirty-nine! Mum pinned brown labels to our coats, handed us our gas-mask boxes, and walked us to Platform Four.",
  },
  {
    id: 'cover_guard_whistle',
    voiceKey: 'ww1_british_tommy',
    style: 'friendly, reassuring 1939 British railway station guard speaking kindly to nervous schoolchildren on the platform',
    text: "All aboard the Operation Pied Piper special! Hold your little brother's hand tight, keep your suitcase close, and wave bravely from the carriage window!",
  },
  {
    id: 'cover_warden_lantern',
    voiceKey: 'ww1_british_officer',
    style: 'calm, steady, protective British Air Raid Warden speaking reassuringly under a twilight station lamp',
    text: "Evening, youngsters! Those silver searchlights will watch over the city skies tonight while your steam train carries you safely out to the countryside.",
  },
  {
    id: 'cover_engine_steam',
    voiceKey: 'male_historian',
    style: 'warm, engaging British museum storyteller sharing an astonishing historical fact with primary school pupils',
    text: "In just three days of Operation Pied Piper, nearly one and a half million children, mothers, and teachers steamed out of Britain's target cities!",
  },

  // Stage 1: 1939 Station Platform & UK Map
  {
    id: 'beat0_guard_suitcase',
    voiceKey: 'ww1_british_tommy',
    style: 'cheerful, brisk 1939 railway guard checking an evacuee suitcase on the platform trolley',
    text: "Let's check your suitcase before I blow my whistle! Pack the four items from the official Ministry list, and leave anything too heavy behind!",
  },
  {
    id: 'beat0_gasmask_packed',
    voiceKey: 'ww1_british_woman',
    style: 'clear, earnest young British evacuee narrator describing her cardboard gas-mask box',
    text: "Our rubber gas masks smelled awful inside their little cardboard boxes, yet every child in Britain had to carry one on a shoulder string everywhere!",
  },
  {
    id: 'beat0_gramophone_heavy',
    voiceKey: 'ww1_british_tommy',
    style: 'kindly, amused railway guard chuckling gently at an oversized gramophone on the platform trolley',
    text: "Whoa there! You can't lug a heavy brass gramophone to the village Billeting Hall! Every ten-year-old has to carry their own bag unaided!",
  },
  {
    id: 'beat0_suitcase_ready',
    voiceKey: 'ww1_british_woman',
    style: 'excited, relieved young British narrator as the steam whistle blows',
    text: "All four official items packed! Now switch to the nineteen thirty-nine Evacuation Map to see where trains carried children right across Britain!",
  },
  {
    id: 'beat0_uk_map_intro',
    voiceKey: 'male_historian',
    style: 'warm, clear British historian guiding children across a map of Great Britain',
    text: "Evacuation happened right across the United Kingdom! Tap London, the Midlands, Liverpool, Glasgow, Tyneside, or the South Coast to trace each steam-train journey.",
  },

  // Stage 2: Country Farm Billet & Kindertransport Friend Lotte
  {
    id: 'beat1_farmer_welcome',
    voiceKey: 'ww1_british_tommy',
    style: 'warm-hearted, gentle West Country farmer welcoming tired city evacuees at his farmhouse gate',
    text: "Welcome to Meadowbrook Farm! Mind old Captain the Shire horse—he loves a crisp orchard apple, and Mrs Oakley has warm bread waiting indoors.",
  },
  {
    id: 'beat1_lotte_story',
    voiceKey: 'female_historian',
    style: 'gentle, quiet, deeply dignified and empathetic voice sharing the story of a young Kindertransport refugee from Prague',
    text: "Lotte travelled all the way from Prague on the Kindertransport. Nearly ten thousand children escaped Nazi Europe to safety in Britain, carrying only one small suitcase.",
  },
  {
    id: 'beat1_lotte_photo',
    voiceKey: 'ww1_british_woman',
    style: 'soft, empathetic, respectful young friend speaking with quiet warmth',
    text: "I can post a letter home to Mum and Dad tonight, whereas Lotte holds one tiny photograph of her parents behind closed borders.",
  },

  // Stage 3: 1940 Blitz Night & Anderson Shelter Cutaway
  {
    id: 'beat2_warden_blackout',
    voiceKey: 'ww1_british_officer',
    style: 'firm but calm and reassuring British ARP Warden checking garden blackout curtains at night',
    text: "Put that light out! Even one tiny golden chink in a blackout curtain helps night bombers spot a street from high above—tap the window to pull it shut!",
  },
  {
    id: 'beat2_blackout_shut',
    voiceKey: 'ww1_british_officer',
    style: 'pleased, reassuring ARP Warden nodding approvingly after the blackout curtain is sealed',
    text: "Much better—street completely dark! And notice the crisscross sticky tape on the glass to stop flying splinters if a blast shakes the lane.",
  },
  {
    id: 'beat2_anderson_cocoa',
    voiceKey: 'ww1_british_woman',
    style: 'cosy, comforting British mother pouring warm cocoa inside an Anderson garden shelter',
    text: "Curved corrugated steel buried under garden soil keeps our Anderson shelter strong! Drink your hot cocoa while Buster snoozes under the patchwork quilt.",
  },
  {
    id: 'beat2_stirrup_pump',
    voiceKey: 'male_historian',
    style: 'clear, engaging British historian explaining a wartime garden stirrup-pump',
    text: "Every street kept a red hand-operated stirrup-pump and water bucket ready so neighbours could tackle small incendiary sparks before fires spread.",
  },

  // Stage 4: 1941 Village Grocer & Ration Counter
  {
    id: 'beat3_grocer_welcome',
    voiceKey: 'female_historian',
    style: 'cheerful, bustling, kindly 1941 British village shopkeeper standing behind brass scales',
    text: "Morning, my dears! Hand over your buff ration book! Since January nineteen forty, coupons make sure rich and poor share scarce ship imports fairly.",
  },
  {
    id: 'beat3_egg_butter',
    voiceKey: 'female_historian',
    style: 'lively, matter-of-fact wartime grocer weighing tiny portions on brass scales',
    text: "Just one fresh shell egg, two ounces of butter, and four ounces of bacon for the whole week! Mind you don't drop that egg on the way home!",
  },
  {
    id: 'beat3_woolton_pie',
    voiceKey: 'ww1_british_woman',
    style: 'bright, proud young evacuee praising home-grown Dig for Victory vegetables',
    text: "Fresh garden vegetables aren't rationed at all! Everybody dug up flowerbeds to grow carrots, potatoes, and leeks for steaming Lord Woolton Pie!",
  },

  // Stage 5: Women at War & Bletchley Park Hut
  {
    id: 'beat4_wren_welcome',
    voiceKey: 'female_historian',
    style: 'focused, intelligent, quietly proud 1943 WRNS Wren codebreaker inside a Bletchley Park hut',
    text: "Hush—Official Secrets Act! Over three-quarters of us working here at Bletchley Park are women. Help me test the six-o'clock morning weather crib!",
  },
  {
    id: 'beat4_bombe_drums',
    voiceKey: 'male_historian',
    style: 'intrigued, admiring British historian explaining Alan Turing and Gordon Welchman’s Bombe machine',
    text: "Spinning brass Bombe drums tested thousands of Enigma rotor combinations every hour, helping the Royal Navy steer food convoys safely past U-boats!",
  },
  {
    id: 'beat4_code_cracked',
    voiceKey: 'female_historian',
    style: 'relieved, quietly jubilant Bletchley Park Wren officer reading a decoded naval alert',
    text: "Rotor match locked! The food convoy can steer clear of that U-boat pack—and remember, we won't breathe a word of this for thirty years!",
  },

  // Stage 6: VE Day 1945 & Live Imperial War Museums Archive Quest
  {
    id: 'beat5_veday_bells',
    voiceKey: 'ww1_british_woman',
    style: 'joyful, deeply moved British narrator celebrating sunlit VE Day on 8 May 1945',
    text: "Eighth of May, nineteen forty-five—Victory in Europe Day! Church bells rang out at last, bunting flew across every street, and the blackout curtains came down!",
  },
  {
    id: 'beat5_iwm_quest',
    voiceKey: 'male_historian',
    style: 'warm, inspiring British museum curator inviting pupils to explore real Imperial War Museums archives',
    text: "Now step into the real Imperial War Museums archive! Check the wartime evidence yourself, bring back two final answers, and claim your Junior Historian Medal!",
  },

  // v2 Complete Hotspot Coverage (Zero Silent Objects Across All 6 Scenes!)
  {
    id: 'cover_arthur_suitcase',
    voiceKey: 'ww1_british_woman',
    style: 'warm, affectionate older sister describing her little brother and their packed brown leather suitcase on Platform Four',
    text: "Inside our battered brown suitcase we've tucked clean woollen socks, a bar of soap, and a stamped postcard ready to send Mum our safe village address!",
  },
  {
    id: 'beat0_carriage_wave',
    voiceKey: 'ww1_british_woman',
    style: 'earnest, vivid young British evacuee describing classmates waving from a steam-train carriage window',
    text: "Whole school classes travelled together with their teachers, waving bravely out of the carriage window without knowing which village family would choose them!",
  },
  {
    id: 'beat0_clothes_packed',
    voiceKey: 'ww1_british_woman',
    style: 'bright, practical young British evacuee checking off her Ministry clothing list',
    text: "One warm knitted jumper, spare socks, plimsolls, toothbrush, comb, towel, and tin mug—every single item on the official nineteen thirty-nine Ministry list!",
  },
  {
    id: 'beat0_sandwiches_packed',
    voiceKey: 'ww1_british_woman',
    style: 'cheerful young evacuee tucking brown-paper sandwiches into her suitcase',
    text: "Evacuation steam trains took hours and had no buffet cars, so Mum tied up cheese sandwiches and a crisp red apple in brown paper string!",
  },
  {
    id: 'beat0_teddy_packed',
    voiceKey: 'ww1_british_woman',
    style: 'warm, gentle young evacuee tucking a small teddy bear into the corner of her suitcase',
    text: "There's just enough room in the corner for little Barnaby Bear and a stamped postcard so Mum and Dad know where we've arrived safely!",
  },
  {
    id: 'beat1_horse_captain',
    voiceKey: 'ww1_british_tommy',
    style: 'kindly, chuckling West Country farmer introducing his gentle Shire horse to city children',
    text: "Steady there, old Captain! Many city youngsters stepping off the train had never seen a real Shire horse, cow, or laying hen in their lives!",
  },
  {
    id: 'beat1_orchard_harvest',
    voiceKey: 'ww1_british_tommy',
    style: 'warm, appreciative country farmer praising evacuee helpers in his autumn orchard',
    text: "With young farmhands away in uniform, evacuees pitched right in—picking orchard apples, collecting warm eggs, and bringing in the autumn harvest!",
  },
  {
    id: 'beat2_window_tape',
    voiceKey: 'ww1_british_officer',
    style: 'calm, knowledgeable British ARP Warden explaining taped window panes during the Blitz',
    text: "Crisscross sticky paper tape won't stop a direct hit, youngsters, yet it helps stop glass panes shattering into dangerous flying splinters!",
  },
  {
    id: 'beat3_sugar_tea',
    voiceKey: 'female_historian',
    style: 'cheerful, brisk 1941 village grocer scooping sugar and loose tea leaves onto brass scales',
    text: "Eight ounces of sugar and just two ounces of loose tea leaves for the week—and from July nineteen forty-two, even sweets were rationed to three ounces!",
  },
  {
    id: 'beat3_kitchen_wireless',
    voiceKey: 'female_historian',
    style: 'warm, lively 1940s British wireless announcer sharing wartime Kitchen Front tips',
    text: "Every morning at eight-fifteen, families gathered round the wireless for The Kitchen Front to hear clever recipes like carrot fudge and eggless sponge!",
  },
  {
    id: 'beat4_veday_peek',
    voiceKey: 'ww1_british_woman',
    style: 'excited, hopeful young narrator peeking out of a Bletchley hut doorway toward sunlit bunting',
    text: "Look through the hut doors—red, white, and blue bunting is going up in the sunshine! Crack our three-step convoy alert so we can celebrate Victory in Europe Day!",
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

async function synthesizeViaBatchByVoice(apiKey, voiceKey, voiceId, clipsForVoice) {
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
          display_name: `ww2-homefront-${voiceKey}-${Date.now()}`,
          input_config: { requests: { requests: inlineRequests } },
        },
      }),
    },
  );
  if (!createRes.ok) {
    throw new Error(`Batch create failed for ${voiceKey} (${createRes.status}): ${(await createRes.text()).slice(0, 240)}`);
  }
  const created = await createRes.json();
  const batchName = created.name;
  console.log(`   ⏳ Polling Batch ${batchName} [${voiceKey}] (${clipsForVoice.length} clips)...`);

  for (let poll = 1; poll <= 120; poll++) {
    await new Promise((r) => setTimeout(r, 5000));
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
        console.log(`   ✅ [${voiceKey}] ${clip.id}.mp3 (${(bytes / 1024).toFixed(1)} KB)`);
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

  if (pending.length > 0) {
    const byVoice = new Map();
    for (const item of pending) {
      if (!byVoice.has(item.voiceId)) {
        byVoice.set(item.voiceId, { voiceKey: item.voiceKey, items: [] });
      }
      byVoice.get(item.voiceId).items.push(item);
    }

    // Dispatch all voice-ID batch jobs in parallel so all 24 clips complete in one pass!
    await Promise.all(
      [...byVoice.entries()].map(async ([voiceId, { voiceKey, items }]) => {
        await synthesizeViaBatchByVoice(apiKey, voiceKey, voiceId, items);
        for (const item of items) {
          hashes.clips[item.id] = item.digest;
        }
      }),
    );
    fs.writeFileSync(HASH_PATH, JSON.stringify(hashes, null, 2) + '\n', 'utf8');
  }

  const availableIds = CLIPS.filter((c) => fs.existsSync(path.join(OUT_DIR, `${c.id}.mp3`))).map((c) => c.id);
  fs.mkdirSync(path.dirname(MANIFEST_JS_PATH), { recursive: true });
  fs.writeFileSync(
    MANIFEST_JS_PATH,
    `/**\n * Auto-generated Studio TTS Voiceover Manifest for The Suitcase on Platform Four (KS2 WWII Home Front Lab)\n */\nexport const WW2_HOMEFRONT_VO_CLIPS = new Set(${JSON.stringify(availableIds, null, 2)});\n`,
    'utf8',
  );
  console.log(`\n🎉 WWII Home Front Studio VO complete: ${availableIds.length}/${CLIPS.length} MP3s ready!`);
}

main().catch((err) => {
  console.error('❌ WWII Home Front VO error:', err);
  process.exit(1);
});
