#!/usr/bin/env node
/**
 * 1086 Domesday Lab v3 ("The Secret of Stubitone" — Year 7 Playtest Edition)
 * Studio Character Voiceover Synchronizer
 *
 * Synthesizes 48 acted character lines across 11 distinct vocal personas
 * (including Salty the Solent Seagull guide, squeaky Reeve Odo, booming Sheriff Hugh,
 * elderly Brother Aldwin, Wulf the Villager, and Grandma Eadgyth) via `gemini-3.8-flash-tts`,
 * encodes crisp 24kHz mono 40kbps `.mp3` files into `public/audio/labs/domesday/`,
 * tracks SHA-256 hashes in `public/audio/labs/domesday/audio_hashes.json`,
 * and writes `src/interactive_labs/domesday_vo_manifest.js`.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ensureHouseVoiceId, resolveGeminiApiKey } from './studio_voice_registry.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'audio', 'labs', 'domesday');
const HASH_PATH = path.join(OUT_DIR, 'audio_hashes.json');
const MANIFEST_JS_PATH = path.join(ROOT, 'src', 'interactive_labs', 'domesday_vo_manifest.js');

export const CLIPS = [
  // =========================================================================
  // COVER: 8 INTERACTIVE SECRETS + SALTY THE SEAGULL GUIDE
  // =========================================================================
  {
    id: 'cover_welcome',
    voiceKey: 'ww1_british_officer',
    style:
      'haughty, theatrical, fastidious 11th-century Norman royal clerk with an aristocratic sneer and crisp comic timing',
    text: 'Halt, muddy Hampshire peasant! By command of King William the Conqueror, step forward for the ten eighty-six Royal Domesday Audit, and wipe your boots!',
  },
  {
    id: 'cover_salty_intro',
    voiceKey: 'domesday_salty_seagull',
    style:
      'cheeky, raspy, high-energy British comic seagull narrator welcoming Year 7 pupils with mischievous Horrible Histories flair',
    text: "Squawk! Eyes front! I'm Salty the Solent Seagull—your unofficial ten eighty-six tour guide! Tap the glowing gold spots to annoy the locals, or hit Begin Royal Audit!",
  },
  {
    id: 'cover_bennet_poke',
    voiceKey: 'ww1_british_tommy',
    style:
      'grumpy, fed-up, rain-soaked Hampshire peasant standing waist-deep in freezing mud, muttering darkly with dry British comic timing',
    text: 'Oi! Press the big shiny start button already! My toes went numb in this freezing Fareham mud twenty minutes ago, and this seagull is eyeing my turnip!',
  },
  {
    id: 'cover_odo_pigs',
    voiceKey: 'domesday_reeve_odo',
    style:
      'panicked, squeaky, breathless, guilty medieval village reeve sitting on a wooden crate and stammering nervously',
    text: 'Nothing inside this crate, my Lord! Definitely NOT thirteen fat Fareham woodland pigs! Stop poking the lid before they oink!',
  },
  {
    id: 'cover_guy_quill',
    voiceKey: 'ww1_british_officer',
    style: 'arrogant, sharp-tongued Norman royal clerk admiring his glowing golden goose-quill',
    text: 'Careful! This royal goose-quill is sharper than a Norman broadsword—one stroke of my Latin ink can tax your entire village!',
  },
  {
    id: 'cover_guy_torso',
    voiceKey: 'ww1_british_officer',
    style:
      'spluttering, indignant, hilarious vain Norman aristocrat defending why his legs are missing in the clouds on the front cover',
    text: 'Oi! Stop staring at my missing legs! The royal portrait painter ran out of purple sky-paint below my belt—keep your eyes on the Domesday Book, peasant!',
  },
  {
    id: 'cover_salty_viking',
    voiceKey: 'domesday_salty_seagull',
    style: 'excited, cheeky comic seagull narrator pointing a wing at a sneaking Viking longship',
    text: 'Squawk! Spot that Viking dragon-ship sneaking up Fareham Creek? Sea-raiders attacked this coast so often that Saxon kings gave Fareham a special tax discount!',
  },
  {
    id: 'cover_salty_castle',
    voiceKey: 'domesday_salty_seagull',
    style: 'knowing, cheeky comic seagull warning pupils about a local history trap',
    text: "Aha, Portchester's massive Roman walls! Careful though—in ten eighty-six, the giant square stone castle keep hasn't even been built yet!",
  },
  {
    id: 'cover_edith_ladle',
    voiceKey: 'ww1_british_woman',
    style: 'fiery, quick-witted English village mother waving a wooden soup ladle from her doorway',
    text: 'Wait till you reach my Stubbington cottage in Stage Five—that snooty clerk counted my husband and acted like the rest of my family are invisible!',
  },

  // =========================================================================
  // STAGE 1 (beat0): REWIND YOUR COASTAL TOWN TO 1086
  // =========================================================================
  {
    id: 'beat0_salty_guide',
    voiceKey: 'domesday_salty_seagull',
    style:
      'brisk, lively, crystal-clear comic seagull explaining Stage 1 instructions to 11-year-olds',
    text: "Stage One! Tap any two coastal places on the map to rewind nine hundred and forty years—let's see whose town survives and whose house lands in freezing mud!",
  },
  {
    id: 'beat0_swamp_splash',
    voiceKey: 'ww1_british_officer',
    style: 'amused, mocking, theatrical aristocratic royal clerk chuckling at a peasant in a swamp',
    text: "Splash! Congratulations! In ten eighty-six that town doesn't exist yet! Your bedroom is knee-deep salt marsh, three seagulls, and Bennet Luvet!",
  },
  {
    id: 'beat0_survived_village',
    voiceKey: 'ww1_british_officer',
    style: 'brisk, authoritative royal inspector pointing at a medieval map',
    text: "Aha! That settlement DOES stand in ten eighty-six! Look sharp: its households, ploughlands, and new Norman overlord are already written in the King's book!",
  },
  {
    id: 'beat0_bennet_swamp',
    voiceKey: 'ww1_british_tommy',
    style:
      'grumpy, soaked, weary Hampshire mud-peasant shivering in pouring rain with deadpan irony',
    text: "Lovely bit of swamp, this! Zero roads, zero shops, pouring sideways rain. Stick a ferry here in nine hundred years, maybe it'll catch on!",
  },
  {
    id: 'beat0_swamp_gull',
    voiceKey: 'domesday_salty_seagull',
    style: 'indignant, squawky comic seagull defending his wooden marsh post',
    text: 'Squawk! Hands off my perch! In ten eighty-six, seagulls outnumber humans on the Gosport shore five hundred to one!',
  },
  {
    id: 'beat0_swamp_mill',
    voiceKey: 'domesday_salty_seagull',
    style: 'bright, observant comic seagull pointing up Fareham Creek',
    text: 'Look up-creek! While Gosport and Portsmouth are empty mudflats, bustling Fareham already has five spinning watermills!',
  },
  {
    id: 'beat0_swamp_torch',
    voiceKey: 'ww1_british_tommy',
    style: 'dry, deadpan mud-soaked peasant inspecting a pitch torch',
    text: 'Resin-soaked pine burning in a hand-forged iron ring—zero glass streetlamps out here in ten eighty-six, squire!',
  },

  // =========================================================================
  // STAGE 2 (beat1): FAREHAM HIDDEN WEALTH & 10 ENSLAVED WORKERS (SERVI)
  // =========================================================================
  {
    id: 'beat1_odo_oath',
    voiceKey: 'domesday_reeve_odo',
    style:
      'panicked, squeaky, breathless medieval village reeve stammering nervously while hiding tax assets',
    text: "I swear on Saint Swithin's holy bones, my Lord, barely two squeaky little watermills in all of Fareham! Please ignore that loud splashing behind the bushes!",
  },
  {
    id: 'beat1_odo_sweat',
    voiceKey: 'domesday_reeve_odo',
    style:
      'high-pitched, flustered village reeve making a terrible excuse for sweating in the rain',
    text: 'Why am I sweating in pouring rain?! Erm, very thick woollen hood, my Lord! Definitely not hiding taxable assets behind my back!',
  },
  {
    id: 'beat1_relic_oath',
    voiceKey: 'domesday_monk_aldwin',
    style: 'solemn, hushed, gravelly elderly monk explaining medieval relic oaths',
    text: 'Every local jury—the priest, the reeve, and six villagers—had to swear on holy saint relics. Medieval Christians believed lying on sacred bones condemned your soul!',
  },
  {
    id: 'beat1_mills_spot',
    voiceKey: 'domesday_reeve_odo',
    style: 'flustered, squeaky medieval village reeve caught red-handed hiding watermills',
    text: 'Aha, cursed splashing! Alright, five spinning watermills worth forty-one shillings! And peasants are banned by law from grinding flour at home without paying the Bishop!',
  },
  {
    id: 'beat1_pigs_spot',
    voiceKey: 'domesday_reeve_odo',
    style: 'groaning, high-pitched defeated village reeve caught hiding woodland pigs',
    text: "Mercy! Thirteen fat hogs rooting for acorns in the Bishop's oak woods! Even a peasant's pig tax goes straight into King William's book!",
  },
  {
    id: 'beat1_church_spot',
    voiceKey: 'ww1_british_officer',
    style: 'triumphant, sharp-eyed Norman royal clerk uncovering hidden village wealth',
    text: 'Got him! One stone parish church, ninety households, and forty-one acres of hay-meadow, making Fareham one of the largest towns on the coast!',
  },
  {
    id: 'beat1_mills_caught',
    voiceKey: 'domesday_reeve_odo',
    style: 'utterly defeated, squeaky groaning village reeve after all three assets are exposed',
    text: "Oh, ruined! All three Fareham money-makers uncovered—watermills, woodland pigs, and forty-one meadow acres! Now step into the dawn fields to see who pulled the Bishop's ploughs.",
  },
  {
    id: 'beat1_guy_chicken',
    voiceKey: 'ww1_british_officer',
    style: 'outraged, impatient, snobbish Norman royal clerk snapping at an assistant',
    text: 'Put that scrawny chicken down at once! King William taxes plough-teams and watermills, not farmyard poultry!',
  },
  {
    id: 'beat1_bennet_creek',
    voiceKey: 'ww1_british_tommy',
    style: 'fed-up, grumpy mud-soaked peasant muttering darkly while hugging one rotten turnip',
    text: "Don't look at me, squire! One wormy turnip, zero oxen, zero land. Even the King's nosy clerks won't waste good ink on Bennet Luvet!",
  },
  {
    id: 'beat1_gyrth_servi',
    voiceKey: 'male_historian',
    style:
      'quiet, calm, deeply dignified, unhurried human voice speaking with quiet gravity and sorrow',
    text: "The Bishop's scribe wrote all ten of us down on the parchment right beside the plough-oxen. In ten eighty-six Fareham, enslaved workers own no land, and we cannot leave.",
  },
  {
    id: 'beat1_servi_oxen',
    voiceKey: 'male_historian',
    style: 'calm, measured, respectful historical voice describing heavy medieval plough teams',
    text: "Heavy medieval ploughs needed eight strong oxen to slice wet Hampshire clay—worked from dawn till dusk on the Bishop's home farm.",
  },
  {
    id: 'beat1_servi_bailiff',
    voiceKey: 'ww1_british_officer',
    style: 'stern, authoritative Norman official watching from horseback',
    text: "Bishop Walkelin's mounted Norman bailiff watched every bushel of grain harvested from Fareham's fields to fund Winchester Cathedral.",
  },

  // =========================================================================
  // STAGE 3 (beat2): 1066 VS 1086 WIPEOUT MAP
  // =========================================================================
  {
    id: 'beat2_salty_xray',
    voiceKey: 'domesday_salty_seagull',
    style: 'energetic, clear comic seagull explaining the X-Ray slider mission',
    text: 'Squawk! Stage Three—the Ten Sixty-Six Wipeout! Drag the golden X-Ray bar across the Solent map and crack our three detective clues!',
  },
  {
    id: 'beat2_hugh_boast',
    voiceKey: 'domesday_sheriff_hugh',
    style:
      'booming, deep-voiced, triumphant Norman baron gloating cheerfully over conquered estates',
    text: "Godwin's Stubbington farm? Mine! Wickham? Mine! Fifty-four Hampshire manors? All mine! Best conquest ever!",
  },
  {
    id: 'beat2_titchfield_crown',
    voiceKey: 'ww1_british_officer',
    style: 'impressed, brisk Norman Exchequer clerk praising a sharp detective answer',
    text: 'Royal bullseye! Titchfield passed straight from King Edward to King William himself as the royal capital of Titchfield Hundred!',
  },
  {
    id: 'beat2_crash_solved',
    voiceKey: 'domesday_monk_aldwin',
    style: 'gravelly, solemn medieval chronicler explaining the 1066-1067 trail of destruction',
    text: "Those plunging ten sixty-seven numbers are the crime-scene footprints of William's invading army marching toward Winchester!",
  },
  {
    id: 'beat2_guy_haircut',
    voiceKey: 'ww1_british_officer',
    style: 'offended, vain Norman aristocrat defending his ridiculous haircut',
    text: "Hands off the razor-nick! Shaving the back of one's neck up to the ears is peak ten eighty-six Norman fashion!",
  },

  // =========================================================================
  // STAGE 4 (beat3): ROYAL ASSIZE COURTROOM
  // =========================================================================
  {
    id: 'beat3_villager_plea',
    voiceKey: 'domesday_villager_wulf',
    style: 'earnest, weather-beaten Hampshire villager pleading passionately before a royal judge',
    text: "My Lord Commissioner, King Edward cut Fareham's tax from thirty hides to twenty because Viking raiders attacked us from the sea! Now Norman Bishop Walkelin demands twenty pounds when our whole town only makes sixteen!",
  },
  {
    id: 'beat3_viking_shield',
    voiceKey: 'domesday_salty_seagull',
    style: 'punchy, enthusiastic comic seagull confirming a true historical detail',
    text: 'True story! Because Fareham sat wide open to Solent sea-raiders, Saxon kings knocked ten whole hides off its tax bill!',
  },
  {
    id: 'beat3_clerk_demand',
    voiceKey: 'ww1_british_officer',
    style: 'cold, ruthless royal treasury official demanding maximum tax',
    text: "Bah! Viking longships haven't burned Fareham Creek in years! Cancel their soft Saxon discount, and force them to pay Bishop Walkelin every silver penny of that twenty pounds!",
  },
  {
    id: 'beat3_hugh_coins',
    voiceKey: 'domesday_sheriff_hugh',
    style: 'booming, greedy Norman warlord counting stacks of silver pennies',
    text: "Fifty-four Hampshire manors means mountains of silver pennies—don't go soft on these English villagers now, Commissioner!",
  },
  {
    id: 'beat3_bishop_bailiff',
    voiceKey: 'domesday_monk_aldwin',
    style: 'stern, solemn cathedral official explaining Winchester Cathedral’s building costs',
    text: 'Bishop Walkelin is rebuilding vast Winchester Cathedral in Norman stone! He demands twenty pounds a year from Fareham whether the villagers like it or not!',
  },
  {
    id: 'beat3_real_verdict',
    voiceKey: 'female_historian',
    style:
      'dramatic, intrigued British historian revealing a surprising plot twist from the real Domesday Book',
    text: "Astonishingly, King William's real Commissioners kept Fareham's twenty-hide Viking discount, and publicly shamed the Bishop in Latin, writing: it pays twenty pounds, but it cannot bear it!",
  },

  // =========================================================================
  // STAGE 5 (beat4): INSIDE EDITH'S STUBBINGTON HUT #3
  // =========================================================================
  {
    id: 'beat4_monk_myth',
    voiceKey: 'domesday_monk_aldwin',
    style: 'hushed, papery medieval monk whispering dramatically over candlelight',
    text: "In my chronicle I complained that not one single ox, cow, or pig was left out of William's shameful book. Tap inside Stubbington Hut Three to count who the scribes REALLY missed!",
  },
  {
    id: 'beat4_edith_door',
    voiceKey: 'ww1_british_woman',
    style:
      'fiery, indignant, quick-witted English village mother telling off a royal clerk from her doorway',
    text: "Nine households?! Your posh Latin book counted nine husbands in Stubbington and acted like me, Grandma, and five hungry kids don't exist! What am I, a turnip?!",
  },
  {
    id: 'beat4_five_kids',
    voiceKey: 'ww1_british_woman',
    style:
      'fiery, quick-witted English village mother pointing out her children inside a smoky cottage',
    text: 'Count them yourself! One toddler by the pot, two sharing pottage, and two stacking logs! Zero children are listed anywhere in your Domesday Book!',
  },
  {
    id: 'beat4_grandma',
    voiceKey: 'domesday_grandma_saxon',
    style: 'warm, spirited elderly English grandmother speaking wisely from her spinning stool',
    text: "I remember Viking sails on the Solent under King Cnut, young clerk—yet because an old grandmother doesn't pay geld tax, your great book pretends I'm not even here!",
  },
  {
    id: 'beat4_pets',
    voiceKey: 'ww1_british_officer',
    style: 'haughty Norman treasury clerk scoffing dismissively at farmyard pets',
    text: "Brother Aldwin exaggerated! Royal scribes ignored farm dogs, cottage hens, and turnip patches because King William couldn't squeeze silver tax out of them!",
  },
  {
    id: 'beat4_bennet_stump',
    voiceKey: 'ww1_british_tommy',
    style: 'cheeky, conspiratorial Hampshire peasant whispering from behind a mossy tree stump',
    text: 'Psst! Stubitone literally means Tree-Stump Farm! Still zero oxen, still hugging my wormy turnip, and still worth naught pounds, naught shillings, and naught pence to the King!',
  },

  // =========================================================================
  // STAGE 6 (beat5): STUBITONE FOLIO 46v LATIN CODE-BREAKER
  // =========================================================================
  {
    id: 'beat5_stubitone_latin',
    voiceKey: 'domesday_monk_aldwin',
    style:
      'resonant elderly scholar reading medieval Domesday Latin clearly before explaining the task',
    text: "Behold Stubbington's genuine ten eighty-six entry on Folio forty-six: Hugo de Port tenet de rege Stubitone. Use the Scribe Key to tap the three matching Latin lines!",
  },
  {
    id: 'beat5_all_cracked',
    voiceKey: 'domesday_salty_seagull',
    style: 'thrilled, cheering comic seagull celebrating the pupil cracking all 3 Latin lines',
    text: 'Squawk! Look at the big brains on you—you just cracked genuine nine-hundred-year-old Domesday Latin! Hit the gold button for the Final Stamp Boss!',
  },

  // =========================================================================
  // STAGE 7 (beat6): FINAL STAMP BOSS & ROYAL VICTORY WARRANT
  // =========================================================================
  {
    id: 'beat6_salty_finale',
    voiceKey: 'domesday_salty_seagull',
    style: 'dramatic, upbeat comic seagull introducing the quick final boss round',
    text: "Final challenge! Stamp these three claims Real or Comedy Cast to slam King William's Great Wax Seal and unlock your final Domesday rank!",
  },
  {
    id: 'beat5_debrief_historian',
    voiceKey: 'female_historian',
    style:
      'warm, celebratory, authoritative British history teacher congratulating pupils on beating the game',
    text: "Royal Audit complete—you beat the game! Every village statistic you investigated comes straight from the real ten eighty-six Domesday Book, while characters like Bennet, Edith, and Odo give voice to the nameless locals whom King William's clerks left out.",
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
    [
      '-y',
      '-i',
      tmpWav,
      '-af',
      'apad=pad_dur=0.22',
      '-codec:a',
      'libmp3lame',
      '-ar',
      '24000',
      '-ac',
      '1',
      '-b:a',
      '40k',
      outMp3Path,
    ],
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
          display_name: `domesday-vo-${voiceKey}-${Date.now()}`,
          input_config: { requests: { requests: inlineRequests } },
        },
      }),
    },
  );
  if (!createRes.ok) {
    throw new Error(
      `Batch create failed (${createRes.status}): ${(await createRes.text()).slice(0, 240)}`,
    );
  }
  const created = await createRes.json();
  const batchName = created.name;
  console.log(`   ⏳ Polling Batch ${batchName} (${voiceKey}: ${clipsForVoice.length} clips)...`);

  for (let poll = 1; poll <= 140; poll++) {
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
        console.log(`   ✅ [Batch:${voiceKey}] ${clip.id}.mp3 (${(bytes / 1024).toFixed(1)} KB)`);
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
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const uniqueVoiceKeys = [...new Set(CLIPS.map((c) => c.voiceKey))];
  const voiceMap = new Map();
  for (const vk of uniqueVoiceKeys) {
    const vid = await ensureHouseVoiceId(apiKey, vk);
    voiceMap.set(vk, vid);
    console.log(`🎙️ Voice ready: ${vk} -> ${vid}`);
  }

  let hashes = { clips: {} };
  if (fs.existsSync(HASH_PATH)) {
    try {
      hashes = JSON.parse(fs.readFileSync(HASH_PATH, 'utf8'));
    } catch (_) {}
  }

  const pending = [];
  for (const clip of CLIPS) {
    const voiceId = voiceMap.get(clip.voiceKey);
    const digest = sha256(`${voiceId}|${clip.style}|${clip.text}`);
    const mp3Path = path.join(OUT_DIR, `${clip.id}.mp3`);
    if (
      hashes.clips?.[clip.id] === digest &&
      fs.existsSync(mp3Path) &&
      fs.statSync(mp3Path).size > 1500
    ) {
      console.log(`✓ Cached ${clip.id}.mp3`);
    } else {
      pending.push({ ...clip, voiceId, digest, mp3Path });
    }
  }

  console.log(`\n🔊 Pending synthesis: ${pending.length} / ${CLIPS.length} clips`);

  if (pending.length > 0) {
    let rateLimited = false;
    const failedForBatch = [];
    const queue = [...pending];

    const workers = Array.from({ length: Math.min(4, queue.length) }, async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        if (!item) break;
        if (rateLimited) {
          failedForBatch.push(item);
          continue;
        }
        try {
          const bytes = await synthesizeRealtimeOne(apiKey, item.voiceId, item, item.mp3Path);
          hashes.clips[item.id] = item.digest;
          fs.writeFileSync(HASH_PATH, JSON.stringify(hashes, null, 2) + '\n', 'utf8');
          console.log(
            `✅ [Realtime:${item.voiceKey}] ${item.id}.mp3 (${(bytes / 1024).toFixed(1)} KB)`,
          );
        } catch (err) {
          console.warn(
            `⚠️ Switching remaining clips to parallel Batch (${item.id}): ${err.message}`,
          );
          rateLimited = true;
          failedForBatch.push(item);
        }
      }
    });

    await Promise.all(workers);

    if (failedForBatch.length > 0) {
      const byVoiceKey = new Map();
      for (const item of failedForBatch) {
        if (!byVoiceKey.has(item.voiceKey)) byVoiceKey.set(item.voiceKey, []);
        byVoiceKey.get(item.voiceKey).push(item);
      }
      await Promise.all(
        [...byVoiceKey.entries()].map(async ([vk, group]) => {
          await synthesizeViaBatchByVoice(apiKey, vk, group[0].voiceId, group);
          for (const item of group) {
            hashes.clips[item.id] = item.digest;
          }
          fs.writeFileSync(HASH_PATH, JSON.stringify(hashes, null, 2) + '\n', 'utf8');
        }),
      );
    }
  }

  const availableIds = CLIPS.filter((c) => fs.existsSync(path.join(OUT_DIR, `${c.id}.mp3`))).map(
    (c) => c.id,
  );
  fs.mkdirSync(path.dirname(MANIFEST_JS_PATH), { recursive: true });
  fs.writeFileSync(
    MANIFEST_JS_PATH,
    `/**\n * Auto-generated Studio TTS Voiceover Manifest for The Secret of Stubitone v3 (1086 Domesday Lab)\n */\nexport const DOMESDAY_VO_CLIPS = new Set(${JSON.stringify(availableIds, null, 2)});\n`,
    'utf8',
  );
  console.log(
    `\n🎉 Domesday v3 Studio VO complete: ${availableIds.length}/${CLIPS.length} MP3s ready!`,
  );
}

main().catch((err) => {
  console.error('❌ Domesday VO error:', err);
  process.exit(1);
});
