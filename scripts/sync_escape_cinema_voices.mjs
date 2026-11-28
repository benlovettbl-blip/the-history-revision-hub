#!/usr/bin/env node
/**
 * Synthesizes Studio British Cinema Voiceovers for ALL Remaining Escape Rooms & Showcases
 * in ONE parallel script (`public/audio/labs/escape_cinema/`):
 *  - Domesday 1086 (4 Opening + 3 Ending = 7 MP3s)
 *  - WW2 Home Front Escape (4 Opening + 3 VE Day Ending = 7 MP3s)
 *  - KS2 Must Farm, Vindolanda & Tutankhamun (2 Opening + 2 Ending each = 12 MP3s)
 *  - Weimar Crisis Desk & Quacks & Cures (2 Opening + 2 Ending each = 8 MP3s)
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ensureHouseVoiceId, resolveGeminiApiKey } from './studio_voice_registry.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'audio', 'labs', 'escape_cinema');
const HASH_PATH = path.join(OUT_DIR, 'audio_hashes.json');

const CLIPS = [
  // === DOMESDAY 1086 (4 OPENING + 3 ENDING) ===
  {
    id: 'domesday_pro_1',
    voiceKey: 'male_historian',
    style: 'dramatic, resonant British historical film narrator with medieval gravitas',
    text: "Gloucester, Christmas ten eighty-five. Twenty years after Hastings, King William the First faces Viking invasion threats and needs silver fast. He orders royal commissioners to ride into every shire and value every manor in England.",
  },
  {
    id: 'domesday_pro_2',
    voiceKey: 'female_historian',
    style: 'solemn, vivid British documentary narrator quoting medieval eyewitness awe',
    text: "Not one ox, nor one cow, nor one pig escaped his notice. English villagers called the great survey Domesday—the Day of Judgement—because against the King's Latin parchment, there was no appeal.",
  },
  {
    id: 'domesday_pro_3',
    voiceKey: 'male_historian',
    style: 'atmospheric British narrator describing Norman power over Hampshire',
    text: "Along the Hampshire coast beside Portchester Castle, Saxon landowners like Godwin of Stubbington have been swept away and replaced by Norman lords, while peasant families plough the same muddy fields.",
  },
  {
    id: 'domesday_pro_4',
    voiceKey: 'domesday_villager_wulf',
    style: 'warm, urgent Hampshire peasant guide speaking directly to the time-traveller',
    text: "Quickly now! King William's clerks have sealed the Solent roads. Follow me through Fareham, Winchester, and Stubbington—crack all four historical locks, and earn the Great Wax Seal to jump home!",
  },
  {
    id: 'domesday_end_1',
    voiceKey: 'male_historian',
    style: 'grand, resonant British historical cinema narrator describing Salisbury and Winchester in 1086',
    text: "August, ten eighty-six. The parchment sheets are carried to Winchester's royal treasury. In less than nine months, William's scribes have recorded over thirteen thousand English settlements in crisp Latin.",
  },
  {
    id: 'domesday_end_2',
    voiceKey: 'female_historian',
    style: 'poignant, authoritative British historian explaining the human revolution behind Domesday',
    text: "Behind the numbers lay a total revolution at the top of society. Out of roughly a thousand chief landowners in Great Domesday, barely thirteen were English. Yet in Stubbington and Fareham, English villagers endured.",
  },
  {
    id: 'domesday_end_3',
    voiceKey: 'domesday_villager_wulf',
    style: 'warm, proud Hampshire villager bidding farewell across nine centuries',
    text: "The Great Wax Seal is yours! Nine hundred and forty years later, Stubbington and Fareham still stand by the Solent—and thanks to Folio forty-six verso, our names and ploughs were never forgotten.",
  },

  // === WW2 HOME FRONT ESCAPE (4 OPENING + 3 ENDING) ===
  {
    id: 'ww2_pro_1',
    voiceKey: 'male_historian',
    style: 'dramatic, warm 1939 British documentary cinema narrator',
    text: "First of September, nineteen thirty-nine. As war looms over Europe, Operation Pied Piper steams into action—carrying one and a half million children, mothers, and teachers out of Britain's target cities in just three days.",
  },
  {
    id: 'ww2_pro_2',
    voiceKey: 'ww1_british_woman',
    style: 'earnest, vivid young British wartime narrator describing the Blackout and Blitz',
    text: "Overnight, Britain goes dark. Thirty-eight million gas masks are issued, heavy blackout curtains seal every window, and families bolt curved steel Anderson shelters into their back gardens.",
  },
  {
    id: 'ww2_pro_3',
    voiceKey: 'female_historian',
    style: 'clear, engaging British museum narrator explaining U-boats and rationing',
    text: "Out in the Atlantic, German U-boats hunt merchant ships carrying Britain's food. To make sure rich and poor share scarce supplies fairly, every citizen registers with a local grocer and receives a weekly ration book.",
  },
  {
    id: 'ww2_pro_4',
    voiceKey: 'male_historian',
    style: 'hushed, exciting British intelligence narrator introducing Bletchley Park',
    text: "And at a secret country estate called Bletchley Park, thousands of young women and codebreakers race each morning to crack Nazi Germany's Enigma machine. Crack all four wartime locks to reach Victory in Europe Day!",
  },
  {
    id: 'ww2_end_1',
    voiceKey: 'male_historian',
    style: 'stirring, joyful British documentary narrator on 8 May 1945',
    text: "Eighth of May, nineteen forty-five: Victory in Europe Day! At three o'clock, Winston Churchill's voice rings out from loudspeakers across Whitehall, and church bells peal across Britain for the first time in years.",
  },
  {
    id: 'ww2_end_2',
    voiceKey: 'ww1_british_woman',
    style: 'warm, reflective British Home Front survivor looking back on street parties and post-war recovery',
    text: "Neighbours dragged trestle tables into bombed streets for bunting and jam sandwiches! Yet victory didn't make life easy overnight—war in Asia continued until August, and food rationing lasted right until July nineteen fifty-four.",
  },
  {
    id: 'ww2_end_3',
    voiceKey: 'female_historian',
    style: 'proud, inspiring British historian honouring Bletchley Park and Kindertransport lives',
    text: "Meanwhile, the women and men of Bletchley Park locked their secrets away for thirty silent years, shortening the war and saving countless lives. You have unlocked every chamber of the Home Front Escape!",
  },

  // === KS2 MUST FARM (2 OPENING + 2 ENDING) ===
  {
    id: 'mustfarm_pro_1',
    voiceKey: 'female_historian',
    style: 'atmospheric, wonder-filled British archaeologist setting the scene in 850 BC',
    text: "Cambridgeshire Fens, eight hundred and fifty B.C. High on sturdy oak stilts above a slow, reed-lined river stands a circle of brand-new Bronze Age wooden roundhouses.",
  },
  {
    id: 'mustfarm_pro_2',
    voiceKey: 'male_historian',
    style: 'dramatic, clear British storyteller introducing the sudden fire and time capsule',
    text: "Then, one day, sparks catch the dry reed thatch! Everyone escapes alive, yet their homes plunge straight into oxygen-free river silt—freezing Britain's greatest Bronze Age time capsule for three thousand years.",
  },
  {
    id: 'mustfarm_end_1',
    voiceKey: 'female_historian',
    style: 'warm, triumphant British archaeologist celebrating the Must Farm discovery',
    text: "Mission complete! Because wet Fenland mud locked out oxygen and rot, archaeologists uncovered Britain's oldest complete wooden wheel, bowls still holding Bronze Age porridge, and glass beads traded from across the sea.",
  },
  {
    id: 'mustfarm_end_2',
    voiceKey: 'male_historian',
    style: 'clear, inspiring British historian wrapping up the Bronze Age takeaway for KS2 pupils',
    text: "Must Farm proved that Bronze Age Britons weren't isolated mud-dwellers—they were skilled carpenters, weavers, and international traders connected all the way to Europe and the Mediterranean!",
  },

  // === KS2 VINDOLANDA (2 OPENING + 2 ENDING) ===
  {
    id: 'vindolanda_pro_1',
    voiceKey: 'male_historian',
    style: 'atmospheric, windswept British historian on the northern Roman frontier around AD 100',
    text: "Northern Britain, around A.D. one hundred—even before stone Hadrian's Wall was built! Along the misty Stanegate road stands Vindolanda Fort, guarded by auxiliary soldiers from right across the Roman Empire.",
  },
  {
    id: 'vindolanda_pro_2',
    voiceKey: 'female_historian',
    style: 'warm, intriguing British epigrapher introducing the buried wooden letters',
    text: "Beneath the wet clay ditches lie wafer-thin birch-wood postcards written in real Roman ink—from chilly soldiers begging for warm socks to the oldest surviving Latin handwriting by a woman in Britain!",
  },
  {
    id: 'vindolanda_end_1',
    voiceKey: 'female_historian',
    style: 'warm, celebratory British historian revealing the legacy of the Vindolanda tablets',
    text: "Frontier Postbag unlocked! For nearly nineteen hundred years, oxygen-free Northumberland mud preserved Claudia Severa's birthday invitation and hundreds of everyday voices that stone monuments never record.",
  },
  {
    id: 'vindolanda_end_2',
    voiceKey: 'male_historian',
    style: 'resonant, clear British historian summarizing multicultural Roman Britain',
    text: "Together with tombstones like Regina's and Barates's on Tyneside, Vindolanda proves that Roman Britain's northern frontier was a bustling, multicultural community stretching from Belgium to Syria and North Africa!",
  },

  // === KS2 TUTANKHAMUN KV62 (2 OPENING + 2 ENDING) ===
  {
    id: 'kv62_pro_1',
    voiceKey: 'male_historian',
    style: 'hushed, golden, cinematic British Egyptology narrator in November 1922',
    text: "The Valley of the Kings, Egypt—fourth of November, nineteen twenty-two. Beneath ancient workmen's huts and tonnes of limestone rubble, Egyptian excavators uncover a single smooth step cut into the white desert rock.",
  },
  {
    id: 'kv62_pro_2',
    voiceKey: 'female_historian',
    style: 'breathless, reverent British museum narrator holding a flickering candle at the sealed door',
    text: "Sixteen steps down stands a plastered doorway stamped with intact royal jackal seals! Step into the candlelight, uncover wonderful things, and discover why real archaeology means ten years of patient science—never treasure-hunting.",
  },
  {
    id: 'kv62_end_1',
    voiceKey: 'male_historian',
    style: 'solemn, awe-inspired British narrator concluding the 10-year KV62 conservation story',
    text: "Tomb K-V-sixty-two conserved! It took Howard Carter, Egyptian foremen like Ahmed Gerigar, photographer Harry Burton, and chemists ten painstaking years to catalogue and preserve over five thousand fragile treasures.",
  },
  {
    id: 'kv62_end_2',
    voiceKey: 'female_historian',
    style: 'warm, authoritative British historian connecting Tutankhamun to Egyptian beliefs',
    text: "Every chariot, food box, golden shrine, and royal cartouche had one sacred purpose: guiding the young pharaoh Tutankhamun safely through the Duat into eternal life!",
  },

  // === WEIMAR CRISIS DESK (2 OPENING + 2 ENDING) ===
  {
    id: 'weimar_pro_1',
    voiceKey: 'male_historian',
    style: 'tense, cinematic British political documentary narrator in Berlin, November 1918',
    text: "Berlin, November nineteen eighteen. Out of war, starvation, and the Kaiser's abdication, Germany's new Weimar Republic is born—with proportional representation, votes for women, and emergency Article forty-eight.",
  },
  {
    id: 'weimar_pro_2',
    voiceKey: 'female_historian',
    style: 'urgent, dramatic British historian setting up the Chancellery desk simulation',
    text: "Attacked by Spartacists on the Left, Freikorps and Nazis on the Right, hyperinflation in nineteen twenty-three, and the Wall Street Crash of nineteen twenty-nine—step behind the Chancellor's desk and try to keep democracy alive.",
  },
  {
    id: 'weimar_end_1',
    voiceKey: 'male_historian',
    style: 'sombre, analytical British documentary narrator in January 1933',
    text: "Thirtieth of January, nineteen thirty-three. Weimar democracy did not fall to an armed putsch—it was hollowed out from within by six million unemployed, Article forty-eight decrees, and Von Papen's fatal backstairs deal with Hindenburg.",
  },
  {
    id: 'weimar_end_2',
    voiceKey: 'female_historian',
    style: 'clear, authoritative British GCSE historian summarizing the Weimar arc',
    text: "From Stresemann's Rentenmark and Dawes Plan recovery to Bruning's decrees and Hitler's chancellorship, you have traced every turning point of Weimar Germany!",
  },

  // === QUACKS & CURES MEDICINE (2 OPENING + 2 ENDING) ===
  {
    id: 'quacks_pro_1',
    voiceKey: 'female_historian',
    style: 'vivid, atmospheric British medical historian in 1348 plague-struck London',
    text: "London, thirteen forty-eight. As the Black Death sweeps through crowded medieval lanes, university physicians consult star charts and Galen's Four Humours—utterly blind to the microscopic bacteria killing half the city.",
  },
  {
    id: 'quacks_pro_2',
    voiceKey: 'male_historian',
    style: 'energetic, authoritative British narrator launching an 800-year medical journey',
    text: "Across eight hundred years—from Renaissance anatomy and Pasteur's eighteen sixty-one Germ Theory to Western Front triage and the nineteen forty-eight N.H.S.—take your place on call and witness how science transformed human survival!",
  },
  {
    id: 'quacks_end_1',
    voiceKey: 'female_historian',
    style: 'inspiring, resonant British historian reflecting on 800 years of medical progress',
    text: "Eight centuries on call complete! For five hundred years, continuity ruled because nobody knew germs caused disease. Once Pasteur, Koch, Nightingale, Lister, and Snow shattered old ideas, survival soared.",
  },
  {
    id: 'quacks_end_2',
    voiceKey: 'male_historian',
    style: 'authoritative British GCSE Paper 1 historian concluding with modern medicine',
    text: "In the twentieth century, government funding, wartime urgency, Florey and Chain's penicillin, Crick and Watson's D.N.A., and Bevan's N.H.S. turned medicine into a modern life-saving system!",
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
    ['-y', '-i', tmpWav, '-af', 'apad=pad_dur=0.22', '-codec:a', 'libmp3lame', '-ar', '24000', '-ac', '1', '-b:a', '48k', outMp3Path],
    { stdio: 'ignore' },
  );
  if (fs.existsSync(tmpWav)) fs.unlinkSync(tmpWav);
  return fs.statSync(outMp3Path).size;
}

async function synthesizeClip(apiKey, clip, voiceId) {
  for (let attempt = 1; attempt <= 6; attempt++) {
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
    if (res.ok) {
      const json = await res.json();
      const b64 = json?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!b64) throw new Error(`Missing audio inlineData for ${clip.id}`);
      const outMp3 = path.join(OUT_DIR, `${clip.id}.mp3`);
      const bytes = encodeWavToMp3(Buffer.from(b64, 'base64'), outMp3);
      console.log(`✅ [${clip.voiceKey}] ${clip.id}.mp3 (${(bytes / 1024).toFixed(1)} KB)`);
      return;
    }
    if (attempt === 6) {
      throw new Error(`TTS failed for ${clip.id} (${res.status}): ${(await res.text()).slice(0, 220)}`);
    }
    const waitMs = res.status === 429 ? 8500 * attempt : 1500 * attempt;
    await new Promise((r) => setTimeout(r, waitMs));
  }
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

  const CONCURRENCY = 2;
  for (let i = 0; i < pending.length; i += CONCURRENCY) {
    const chunk = pending.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async ({ clip, voiceId, digest }) => {
        await synthesizeClip(apiKey, clip, voiceId);
        hashes.clips[clip.id] = digest;
      }),
    );
    fs.writeFileSync(HASH_PATH, JSON.stringify(hashes, null, 2) + '\n', 'utf8');
    if (i + CONCURRENCY < pending.length) {
      await new Promise((r) => setTimeout(r, 3200));
    }
  }

  console.log(`🎉 All Escape Cinema Studio Voiceovers ready: ${CLIPS.length}/${CLIPS.length} MP3s!`);
}

main().catch((err) => {
  console.error('❌ Escape Cinema VO error:', err);
  process.exit(1);
});
