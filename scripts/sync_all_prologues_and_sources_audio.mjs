#!/usr/bin/env node
/**
 * Unified Historical Setting (Prologue) & Written Primary Source Studio Audio Engine
 * (`scripts/sync_all_prologues_and_sources_audio.mjs`)
 *
 * Voices 100% of remaining Lesson "Historical Setting" Intros (`prologue` / `hook_text` / `blurb`)
 * and Written Primary Sources (`lesson.sources`, `lesson.exam_practice` unseen sources, and
 * unit-level `mock_exams` / `assessments` written sources) across all curriculum units not already
 * handled by bespoke WW1 / Shoah-KS2WII scripts.
 *
 * Architecture:
 *  - Uses 50%-off Gemini Batch-TTS (`gemini-3.8-flash-tts:batchGenerateContent`) with automatic
 *    retry/backoff and SHA-256 hash manifests (`prologue_hashes.json` & `audio_hashes.json`) so
 *    unchanged clips verify in <0.05s at $0.00 cost.
 *  - Gender- & era-aware British Studio Historian casting (`male_historian` / `female_historian`).
 *  - Acoustic sentence boundary extraction (`timings.json`) via `alignSentencesToMp3` for
 *    zero-drift real-time sentence/word karaoke highlighting & click-to-seek in `speech.js`.
 *  - Synchronizes `data/<unit>.json`, `public/data/<unit>.json`, `units/<unit>/data.js`, and
 *    `public/units/<unit>/data.js` while preserving JS wrapper format (`window.UNIT_DATA` vs `export default`).
 *
 * Usage:
 *   node scripts/sync_all_prologues_and_sources_audio.mjs <unit_id> [--dry-run] [--skip-tts] [--force-audio]
 *   node scripts/sync_all_prologues_and_sources_audio.mjs --all [--concurrency=8]
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  UNIT_VOICE_ASSIGNMENTS,
  getUnitVoicePersona,
  resolveGeminiApiKey,
  ensureHouseVoiceId,
} from './studio_voice_registry.mjs';
import { alignSentencesToMp3 } from './extract_audio_timings.mjs';
import { expandBritishDatesForSpeech } from './spoken_date_normalizer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Units whose lesson prologues & lesson sources are managed by bespoke scripts
const BESPOKE_LESSON_LIVING_VOICE_UNITS = new Set([
  'great_war',
  'great_war_part2',
  'the_shoah',
  'ks2_ww2',
]);

const ROMAN_MONARCH_RE =
  /\b(Elizabeth|Mary|Henry|Edward|Richard|Charles|James|William|George|Victoria|Philip|Louis|Wilhelm|Nicholas|Alexander|Frederick|Napoleon|Pius|Innocent|Gregory|Urban|Leo|Clement|Boniface|Sixtus|Paul|John|Benedict|celestine|Ramses|Ramesses|Thutmose|Amenhotep|Ptolemy|Antiochus|Darius|Xerxes)\s+(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI)\b/g;

const ROMAN_ORDINALS = {
  I: 'the First',
  II: 'the Second',
  III: 'the Third',
  IV: 'the Fourth',
  V: 'the Fifth',
  VI: 'the Sixth',
  VII: 'the Seventh',
  VIII: 'the Eighth',
  IX: 'the Ninth',
  X: 'the Tenth',
  XI: 'the Eleventh',
  XII: 'the Twelfth',
  XIII: 'the Thirteenth',
  XIV: 'the Fourteenth',
  XV: 'the Fifteenth',
  XVI: 'the Sixteenth',
};

function sha256(str) {
  return crypto.createHash('sha256').update(String(str), 'utf8').digest('hex').slice(0, 16);
}

function normTextKey(str) {
  return String(str || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase()
    .slice(0, 120);
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
  writeFileWithRetrySync(filePath, JSON.stringify(manifest, null, 2) + '\n');
}

export function cleanHistoricalTextForSpeech(rawHtml) {
  let s = String(rawHtml || '').trim();
  if (!s) return '';

  // 1. Expand inline dossier pills `[Key Figure: ...]` -> `...`
  s = s.replace(/\[Key\s+[^:\]]+:\s*([^\]]+)\]/gi, '$1');

  // 2. Paragraph & list breaks -> natural breath pause
  s = s.replace(/(?:<br\s*\/?>\s*){2,}|<\/p>\s*<p[^>]*>|\n\n+/gi, ' <short pause> ');
  s = s.replace(/([A-Za-z0-9"”'])\s*<br\s*\/?>/gi, '$1, ');
  s = s.replace(/<br\s*\/?>/gi, ' ');
  s = s.replace(/\n\s*[•\-*]\s*/g, ' <short pause> ');
  s = s.replace(/•/g, ', ');

  // 3. Strip paragraph numbering `[1.1]` and editorial brackets `[...]` while keeping bracketed words `[they]`
  s = s.replace(/\[\s*\d+(?:\.\d+)?\s*\]/g, ' ');
  s = s.replace(/\[\s*\.\.\.\s*\]/g, ', ');
  s = s.replace(/\[([^\]]+)\]/g, '$1');

  // 4. Strip Markdown & HTML tags
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1');
  s = s.replace(/\*([^*]+)\*/g, '$1');
  s = s.replace(/<[^>]+>/g, ' ');
  s = s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, ' and ')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lsquo;|&rsquo;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—')
    .replace(/&pound;/gi, '£');

  // 5. Expand Monarch / Papal Roman numerals ("Henry VIII" -> "Henry the Eighth")
  s = s.replace(ROMAN_MONARCH_RE, (full, name, rom) => {
    const ord = ROMAN_ORDINALS[rom];
    return ord ? `${name} ${ord}` : full;
  });

  // 6. Expand British dates & historical abbreviations
  s = expandBritishDatesForSpeech(s)
    .replace(/(\d)\s*[–-]\s*(\d)/g, '$1 to $2')
    .replace(/\bc\.\s*(\d{3,4})/g, 'circa $1')
    .replace(/\bHMS\b/g, 'H M S')
    .replace(/\bNHS\b/g, 'N H S')
    .replace(/\bUSSR\b/g, 'U S S R')
    .replace(/\bNSDAP\b/g, 'N S D A P')
    .replace(/\bSPD\b/g, 'S P D')
    .replace(/\bKPD\b/g, 'K P D')
    .replace(/\bDNVP\b/g, 'D N V P')
    .replace(/\bNAACP\b/g, 'N double-A C P')
    .replace(/\bSNCC\b/g, 'S N C C')
    .replace(/\bSCLC\b/g, 'S C L C')
    .replace(/\bKKK\b/g, 'K K K')
    .replace(/\bICBM\b/g, 'I C B M')
    .replace(/\bICBMS\b/gi, 'I C B Ms')
    .replace(/\bABM\b/g, 'A B M')
    .replace(/\bPLO\b/g, 'P L O')
    .replace(/\bIDF\b/g, 'I D F')
    .replace(/\bBMA\b/g, 'B M A')
    .replace(/\.{3,}|…/g, ', ')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .replace(/(?:<short pause>\s*){2,}/g, '<short pause> ')
    .trim();

  return s;
}

const FEMALE_AUTHOR_RE =
  /\b(Queen\s+Elizabeth|Elizabeth\s+I|Mary,\s*Queen\s+of\s+Scots|Mary\s+Stuart|Mary\s+I|Mary\s+Tudor|Lady\s+Jane\s+Grey|Anne\s+Boleyn|Catherine\s+of\s+Aragon|Queen\s+Victoria|Queen\s+Anne|Empress\s+Matilda|Eleanor\s+of\s+Aquitaine|Margery\s+Kempe|Julian\s+of\s+Norwich|Margaret\s+Paston|Boudicca|Claudia\s+Severa|Cartimandua|Hatshepsut|Cleopatra|Sappho|Hypatia|Aethelflaed|Mariam\s+al-Asturlabi|Zubaydah|Lady\s+Six\s+Sky|Lady\s+Mary\s+Wortley\s+Montagu|Florence\s+Nightingale|Mary\s+Seacole|Elizabeth\s+Garrett\s+Anderson|Sophia\s+Jex-Blake|Rosalind\s+Franklin|Dorothy\s+Hodgkin|Cicely\s+Saunders|Marie\s+Stopes|Emmeline\s+Pankhurst|Christabel\s+Pankhurst|Sylvia\s+Pankhurst|Millicent\s+Fawcett|Emily\s+Davison|Annie\s+Besant|Hannah\s+Mitchell|Josephine\s+Butler|Harriet\s+Martineau|Elizabeth\s+Fry|Aphra\s+Behn|Phillis\s+Wheatley|Mary\s+Prince|Queen\s+Nanny|Rani\s+Lakshmibai|Sarojini\s+Naidu|Begum\s+Hazrat\s+Mahal|Truganini|Fanny\s+Cochrane\s+Smith|Louisa\s+Lawson|Vida\s+Goldstein|Edith\s+Cowan|Rosa\s+Parks|Coretta\s+Scott\s+King|Fannie\s+Lou\s+Hamer|Ella\s+Baker|Diane\s+Nash|Jo\s+Ann\s+Robinson|Daisy\s+Bates|Ruby\s+Bridges|Elizabeth\s+Eckford|septima\s+Clark|Betty\s+Friedan|Gloria\s+Steinem|Phyllis\s+Schlafly|Shirley\s+Chisholm|Angela\s+Davis|Dolores\s+Huerta|Eleanor\s+Roosevelt|Frances\s+Perkins|Rachel\s+Carson|Linda\s+Brown|Lilo\s+Linke|Melita\s+Maschmann|Käthe\s+Kollwitz|Kathe\s+Kollwitz|Clara\s+Zetkin|Rosa\s+Luxemburg|Sophie\s+Scholl|Christabel\s+Bielenberg|Marta\s+Appel|Golda\s+Meir|Hanan\s+Ashrawi|Leila\s+Khaled|Jehan\s+Sadat|Margaret\s+Thatcher|Barbara\s+Castle|Jayaben\s+Desai|Claudia\s+Jones|Doreen\s+Lawrence|Beryl\s+Gilroy|wendy\s+webster|Mary\s+Fulbrook|Helen\s+Boak|Lucy\s+Dawidowicz|Vera\s+Brittain)\b/i;

const MALE_AUTHOR_RE =
  /\b(King\s+|Lord\s+|Sir\s+|Duke\s+of|Earl\s+of|Archbishop|Bishop|Pope\s+|Father\s+|Brother\s+|Monk|Chronicler|Hippocrates|Galen|Avicenna|Ibn\s+Sina|al-Razi|Rhazes|Al-Khwarizmi|Ibn\s+Fadlan|Al-Mansur|Harun\s+al-Rashid|Julius\s+Caesar|Tacitus|Suetonius|Pliny|Vindolanda|Bede|Alcuin|Alfred\s+the\s+Great|William\s+of\s+Poitiers|Orderic\s+Vitalis|Matthew\s+Paris|Thomas\s+Walsingham|Jean\s+Froissart|Geoffrey\s+Chaucer|John\s+Ball|John\s+Wycliffe|Thomas\s+Becket|Henry\s+II|Henry\s+VII|Henry\s+VIII|Edward\s+VI|Thomas\s+Cromwell|Thomas\s+More|Martin\s+Luther|John\s+Calvin|William\s+Cecil|Lord\s+Burghley|Francis\s+Walsingham|Francis\s+Drake|Walter\s+Raleigh|Philip\s+II|Babington|Throckmorton|John\s+Stubbs|William\s+Harrison|Thomas\s+Harman|Charles\s+I|Oliver\s+Cromwell|William\s+Laud|John\s+Pym|Thomas\s+Hobbes|John\s+Locke|Samuel\s+Pepys|John\s+Evelyn|Andreas\s+Vesalius|William\s+Harvey|Thomas\s+Sydenham|Ambroise\s+Paré|Edward\s+Jenner|James\s+Simpson|Joseph\s+Lister|Louis\s+Pasteur|Robert\s+Koch|John\s+Snow|Edwin\s+Chadwick|Michael\s+Faraday|Joseph\s+Bazalgette|Paul\s+Ehrlich|Alexander\s+Fleming|Howard\s+Florey|Ernst\s+Chain|Aneurin\s+Bevan|William\s+Beveridge|Olaudah\s+Equiano|Ottobah\s+Cugoano|William\s+Wilberforce|Thomas\s+ Clarkson|Robert\s+Clive|Warren\s+Hastings|James\s+Cook|Arthur\s+Phillip|Watkin\s+Tench|Lachlan\s+Macquarie|Henry\s+Parkes|Banjo\s+Paterson|Charles\s+Dickens|Robert\s+Blincoe|Friedrich\s+Engels|Richard\s+Oastler|Rudyard\s+Kipling|Cecil\s+Rhodes|Dadabhai\s+Naoroji|Jawaharlal\s+Nehru|Mahatma\s+Gandhi|Winston\s+Churchill|Clement\s+Attlee|Enoch\s+Powell|Harold\s+Macmillan|Harold\s+Wilson|Joseph\s+Stalin|Harry\s+S\.?\s+Truman|George\s+Kennan|George\s+Marshall|Vyacheslav\s+Molotov|Nikita\s+Khrushchev|John\s+F\.?\s+Kennedy|Fidel\s+Castro|Lyndon\s+B\.?\s+Johnson|Richard\s+Nixon|Ronald\s+Reagan|Mikhail\s+Gorbachev|Leonid\s+Brezhnev|Alexander\s+Dubček|Imre\s+Nagy|Martin\s+Luther\s+King|Malcolm\s+X|Stokely\s+Carmichael|Thurgood\s+Marshall|Dwight\s+D\.?\s+Eisenhower|Orval\s+Faubus|Bull\s+Connor|George\s+Wallace|Joseph\s+McCarthy|J\.?\s*Edgar\s+Hoover|Walter\s+Cronkite|Ho\s+Chi\s+Minh|Robert\s+McNamara|William\s+Westmoreland|John\s+Kerry|Bob\s+Woodward|Carl\s+Bernstein|Friedrich\s+Ebert|Gustav\s+Stresemann|Paul\s+von\s+Hindenburg|Adolf\s+Hitler|Joseph\s+Goebbels|Heinrich\s+Himmler|Hermann\s+Göring|Albert\s+Speer|Martin\s+Niemöller|Dietrich\s+Bonhoeffer|Victor\s+Klemperer|Sebastian\s+Haffner|William\s+Shirer|Theodor\s+Herzl|Arthur\s+Balfour|Henry\s+McMahon|David\s+Ben-Gurion|Gamal\s+Abdel\s+Nasser|Yasser\s+Arafat|Anwar\s+Sadat|Menachem\s+Begin|Yitzhak\s+Rabin|Jimmy\s+Carter|Bill\s+Clinton)\b/i;

export function resolvePrologueCast(unitId) {
  const persona = getUnitVoicePersona(unitId);
  const isKs2 = unitId.startsWith('ks2_');
  const isGcse = ['cme_new', 'eee', 'weimar_nazi_germany', 'edexcel_medicine', 'gcse_cold_war', 'usa'].includes(
    unitId,
  );

  let style =
    'warm, authoritative, unhurried British documentary historian setting the historical scene with crisp diction';
  if (isKs2) {
    style =
      'warm, vivid, crystal-clear British history storyteller setting the historical scene at an unhurried, engaging pace for 10-year-old pupils';
  } else if (isGcse) {
    style =
      'crisp, authoritative, engaging British broadcast historian setting the historical context and central enquiry question';
  }

  return {
    voiceKey: persona.key,
    style,
    badge: 'Studio Cold-Open · Historian',
  };
}

function buildCompactBadge(rawTitle, rawProv) {
  const cleanedTitle = String(rawTitle || '')
    .replace(/^(?:Source|Map|Diagram)\s+[A-Z0-9]+\s*(?:\([^)]+\))?\s*[:\-–—]?\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanedTitle) {
    if (cleanedTitle.length <= 36) return cleanedTitle;
    // Try keeping author/document + year if present
    const yearMatch = cleanedTitle.match(/\((\d{3,4}s?|c\.\s*\d{3,4}|[0-9]+\s*(?:BC|BCE|AD|CE))\)/i);
    const base = cleanedTitle.replace(/\s*\([^)]*\)\s*/g, '').trim();
    const shortBase = base.split(/[:—–,]/)[0].trim();
    if (shortBase && shortBase.length <= 28) {
      return yearMatch ? `${shortBase} (${yearMatch[1]})` : shortBase;
    }
    return `${cleanedTitle.slice(0, 32).trim().replace(/[,\s]+$/, '')}…`;
  }

  const firstClause = String(rawProv || '').split(/[.,;]/)[0].trim();
  if (firstClause && firstClause.length <= 34) return firstClause;
  return 'Living Archive · Primary Record';
}

export function resolveSourceCast(unitId, src, fallbackIndex = 0) {
  const metaBlob = [
    src.title || '',
    src.provenance || '',
    src.citation || '',
    src.attribution || '',
    src.author || '',
    src.caption || '',
  ].join(' ');

  const unitDefaultVoice = getUnitVoicePersona(unitId).key;
  let voiceKey = unitDefaultVoice;

  if (FEMALE_AUTHOR_RE.test(metaBlob)) {
    voiceKey = 'female_historian';
  } else if (MALE_AUTHOR_RE.test(metaBlob)) {
    voiceKey = 'male_historian';
  } else if (/\b(woman|women|mother|wife|daughter|girl|midwife|nurse|nun|abbess|queen|princess|lady|suffragette)\b/i.test(metaBlob)) {
    voiceKey = 'female_historian';
  } else {
    // Alternate gently across unnamed archival decrees/records so multi-source lessons feel varied
    voiceKey = fallbackIndex % 2 === 0 ? unitDefaultVoice : unitDefaultVoice === 'male_historian' ? 'female_historian' : 'male_historian';
  }

  const isKs2 = unitId.startsWith('ks2_');
  let style = 'calm, clear, dignified British archival narrator reading a primary historical source';

  if (isKs2) {
    style =
      'clear, warm, steady British museum narrator reading an ancient or historical primary source clearly for 10-year-old pupils';
  } else if (/\b(act|statute|decree|law|ordinance|proclamation|edict|charter|treaty|directive|order|constitution|article|clause|mandate|resolution)\b/i.test(metaBlob)) {
    style =
      'formal, measured, crisp British archival reading of an official state decree, statute, or diplomatic document';
  } else if (/\b(speech|address|sermon|oration|broadcast|appeal|manifesto)\b/i.test(metaBlob)) {
    style =
      'resonant, composed, authoritative documentary reading of a historic public address, preserving clarity and restraint';
  } else if (/\b(diary|journal|letter|memoir|testimony|recollection|autobiography|eyewitness|confession|interview)\b/i.test(metaBlob)) {
    style =
      'observant, human, reflective first-person archival reading of a personal historical letter, diary, or eyewitness account';
  } else if (/\b(treatise|regimen|physik|medical|surgeon|physician|report|inquiry|commission|census|ledger|inventory)\b/i.test(metaBlob)) {
    style =
      'precise, measured, scholarly British archival reading of a historical medical, scientific, or investigative record';
  }

  const badge = buildCompactBadge(src.title, src.provenance || src.citation);
  return { voiceKey, style, badge };
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
  const tmpWav = `${outMp3Path}.tmp.${process.pid}.${Math.random().toString(36).slice(2, 7)}.wav`;
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

async function synthesizeRealtimeSingle(apiKey, voiceId, job) {
  const clean = String(job.text).trim();
  const withPause = clean.endsWith('<short pause>') ? clean : `${clean} <short pause>`;
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent',
    {
      method: 'POST',
      headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: withPause, speech_metadata: { style: job.style } }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceId } } },
        },
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`Realtime TTS (${res.status}): ${(await res.text()).slice(0, 200)}`);
  }
  const data = await res.json();
  const b64 = data?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData?.data;
  if (!b64) throw new Error(`Missing audio data for ${job.label}`);
  const bytes = encodeWavBufferToMp3(Buffer.from(b64, 'base64'), job.outMp3Path);
  job.onComplete(bytes);
  console.log(`   ✓ ${job.label} (${Math.round(bytes / 1024)} KB · [${job.voiceKey}] realtime)`);
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
  for (let attempt = 1; attempt <= 5; attempt++) {
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
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      await new Promise((r) => setTimeout(r, attempt * 6500));
      continue;
    }
    throw new Error(`Batch-TTS submit failed (${res.status}): ${errTxt.slice(0, 300)}`);
  }

  const batchName = createJson.name;
  console.log(`   ⏳ Polling ${batchName} (${displayLabel}, ${jobs.length} clip[s])...`);

  let pollJson = null;
  for (let poll = 1; poll <= 260; poll++) {
    await new Promise((r) => setTimeout(r, 6000));
    let pRes;
    try {
      pRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/${batchName}`, {
        headers: { 'x-goog-api-key': apiKey },
      });
    } catch (_) {
      continue;
    }
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
    const b64 = item?.response?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData?.data;
    if (!b64) {
      // Fallback to realtime single call if an individual item in batch had empty inlineData
      console.warn(`   ⚠️ Batch item ${jobs[i].label} missing inlineData; retrying realtime...`);
      await synthesizeRealtimeSingle(apiKey, voiceId, jobs[i]);
      continue;
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

function writeFileWithRetrySync(targetPath, content) {
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      fs.writeFileSync(targetPath, content, 'utf8');
      return;
    } catch (err) {
      if (attempt === 6) throw err;
      const waitMs = attempt * 250;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, waitMs);
    }
  }
}

function writeUnitMirrors(unitId, fullRawJson, unitPayload) {
  const outRootObj = fullRawJson.data ? { ...fullRawJson, data: unitPayload } : unitPayload;
  const jsonStr = JSON.stringify(outRootObj, null, 2) + '\n';
  const dataPath = path.join(ROOT, 'data', `${unitId}.json`);
  const pubDataPath = path.join(ROOT, 'public', 'data', `${unitId}.json`);
  let changed = false;

  if (!fs.existsSync(dataPath) || fs.readFileSync(dataPath, 'utf8').trim() !== jsonStr.trim()) {
    writeFileWithRetrySync(dataPath, jsonStr);
    changed = true;
  }
  if (fs.existsSync(path.dirname(pubDataPath))) {
    if (!fs.existsSync(pubDataPath) || fs.readFileSync(pubDataPath, 'utf8').trim() !== jsonStr.trim()) {
      writeFileWithRetrySync(pubDataPath, jsonStr);
      changed = true;
    }
  }

  for (const baseDir of [path.join(ROOT, 'units', unitId), path.join(ROOT, 'public', 'units', unitId)]) {
    const dataJsPath = path.join(baseDir, 'data.js');
    if (!fs.existsSync(dataJsPath)) continue;
    const rawJs = fs.readFileSync(dataJsPath, 'utf8');
    const bounds = findTopLevelObjectBounds(rawJs);
    if (!bounds) continue;
    const existingObjText = rawJs.slice(bounds.firstBrace, bounds.closeBrace + 1);
    const hasDataWrapper = /^\{\s*"data"\s*:/.test(existingObjText);
    const replacementObj = hasDataWrapper ? outRootObj : unitPayload;
    const nextJs =
      rawJs.slice(0, bounds.firstBrace) +
      JSON.stringify(replacementObj, null, 2) +
      rawJs.slice(bounds.closeBrace + 1);
    if (rawJs.trim() !== nextJs.trim()) {
      writeFileWithRetrySync(dataJsPath, nextJs);
      changed = true;
    }
  }
  return changed;
}

function refreshUnitPrologueAndSourceTimings(
  lessonAudioDir,
  sourceAudioDir,
  prologueTargets,
  sourceTargets,
  forceRebuild = false,
) {
  if (prologueTargets.length > 0) {
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
  }

  if (sourceTargets.length > 0) {
    const sourceTimingsPath = path.join(sourceAudioDir, 'timings.json');
    const existingSourceTimings = fs.existsSync(sourceTimingsPath)
      ? JSON.parse(fs.readFileSync(sourceTimingsPath, 'utf8'))
      : {};
    let sourceUpdated = false;
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
}

/**
 * Collect jobs & update JSON audio pointers for a single unit without executing Batch API yet
 * (allowing global multi-unit parallel batching when running `--all`).
 */
export function prepareUnitPrologueAndSourceJobs(unitId, { forceAudio = false } = {}) {
  const dataPath = path.join(ROOT, 'data', `${unitId}.json`);
  if (!fs.existsSync(dataPath)) return null;

  const fullRawJson = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const unitData = fullRawJson.data || fullRawJson;
  if (!Array.isArray(unitData.lessons)) return null;

  const isBespokeLessonUnit = BESPOKE_LESSON_LIVING_VOICE_UNITS.has(unitId);

  const lessonAudioDir = path.join(ROOT, 'public', 'audio', 'lessons', unitId);
  const sourceAudioDir = path.join(ROOT, 'public', 'audio', 'sources', unitId);
  const prologueHashPath = path.join(lessonAudioDir, 'prologue_hashes.json');
  const sourceHashPath = path.join(sourceAudioDir, 'audio_hashes.json');

  const prologueHashes = loadHashManifest(prologueHashPath);
  const sourceHashes = loadHashManifest(sourceHashPath);

  const jobs = [];
  const prologueAlignTargets = [];
  const sourceAlignTargets = [];

  if (!isBespokeLessonUnit) {
    const prologueCast = resolvePrologueCast(unitId);

    for (const lesson of unitData.lessons) {
      // =======================================================================
      // 1. LESSON HISTORICAL SETTING / PROLOGUE (`prologue` | `hook_text` | `blurb`)
      // =======================================================================
      const rawPrologue = String(lesson.prologue || lesson.hook_text || lesson.blurb || '').trim();
      if (rawPrologue) {
        const clipId = `${lesson.id}_prologue`;
        const relUrl = `/audio/lessons/${unitId}/${clipId}.mp3`;
        const outMp3Path = path.join(lessonAudioDir, `${clipId}.mp3`);
        const spokenText = cleanHistoricalTextForSpeech(rawPrologue);

        if (spokenText.length >= 15) {
          const contentHash = sha256(`${prologueCast.voiceKey}::${prologueCast.style}::${spokenText}`);
          lesson.prologue_audio = relUrl;
          lesson.prologue_voice_label = prologueCast.badge;
          prologueAlignTargets.push({ key: clipId, mp3Path: outMp3Path, rawText: rawPrologue });

          const prev = prologueHashes.clips[clipId];
          const exists = fs.existsSync(outMp3Path) && fs.statSync(outMp3Path).size > 1800;
          if (forceAudio || !exists || !prev || prev.hash !== contentHash) {
            jobs.push({
              unitId,
              voiceKey: prologueCast.voiceKey,
              style: prologueCast.style,
              text: spokenText,
              label: `lessons/${unitId}/${clipId}.mp3`,
              outMp3Path,
              onComplete(bytes) {
                prologueHashes.clips[clipId] = {
                  hash: contentHash,
                  bytes,
                  voiceKey: prologueCast.voiceKey,
                  badge: prologueCast.badge,
                  updatedAt: new Date().toISOString(),
                };
                saveHashManifest(prologueHashPath, prologueHashes);
              },
            });
          }
        }
      }

      // =======================================================================
      // 2. LESSON WRITTEN PRIMARY SOURCES (`lesson.sources`)
      // =======================================================================
      const lessonSourceAudioMapByText = new Map();
      const lessonSourceAudioMapByLetter = new Map();
      const lessonSourceAudioMapById = new Map();

      (lesson.sources || []).forEach((src, sIdx) => {
        if (!src || src.perspective_pair) return;
        const rawSrcText = String(src.text || src.content || src.extract || src.quote || '').trim();
        const plainCheck = rawSrcText.replace(/<[^>]+>/g, '').trim();
        if (plainCheck.length <= 15) return;

        const titleLetterMatch = String(src.title || '').match(/(?:Source|Map|Diagram)\s+([A-Z0-9]+)/i);
        const letter = String(
          src.letter || (titleLetterMatch ? titleLetterMatch[1] : String.fromCharCode(65 + sIdx)),
        )
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '');

        const cast = resolveSourceCast(unitId, src, sIdx);
        const clipId = `${lesson.id}_s${letter || sIdx + 1}`;
        const relUrl = `/audio/sources/${unitId}/${clipId}.mp3`;
        const outMp3Path = path.join(sourceAudioDir, `${clipId}.mp3`);
        const spokenText = cleanHistoricalTextForSpeech(rawSrcText);
        if (spokenText.length <= 12) return;

        const contentHash = sha256(`${cast.voiceKey}::${cast.style}::${spokenText}`);

        src.studio_audio = relUrl;
        src.studio_voice_label = cast.badge;

        const metaRef = { audio: relUrl, label: cast.badge };
        lessonSourceAudioMapByText.set(normTextKey(rawSrcText), metaRef);
        if (letter) lessonSourceAudioMapByLetter.set(letter, metaRef);
        if (src.id) lessonSourceAudioMapById.set(String(src.id), metaRef);

        // Mirror onto inline `narrative_blocks[b].sources` / `.source`
        for (const blk of lesson.narrative_blocks || []) {
          const inlineList = Array.isArray(blk.sources)
            ? blk.sources
            : Array.isArray(blk.source)
              ? blk.source
              : blk.source
                ? [blk.source]
                : [];
          for (const inl of inlineList) {
            if (!inl || typeof inl !== 'object') continue;
            const inlText = normTextKey(inl.text || inl.content || inl.extract || '');
            if (
              (src.id && inl.id === src.id) ||
              (inl.letter && String(inl.letter).toUpperCase() === letter) ||
              (inlText && inlText === normTextKey(rawSrcText))
            ) {
              inl.studio_audio = relUrl;
              inl.studio_voice_label = cast.badge;
            }
          }
        }

        sourceAlignTargets.push({ key: clipId, mp3Path: outMp3Path, rawText: rawSrcText });

        const prev = sourceHashes.clips[clipId];
        const exists = fs.existsSync(outMp3Path) && fs.statSync(outMp3Path).size > 1800;
        if (forceAudio || !exists || !prev || prev.hash !== contentHash) {
          jobs.push({
            unitId,
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

      // =======================================================================
      // 3. LESSON EXAM PRACTICE WRITTEN STIMULUS SOURCES (MIRROR OR SYNTHESIZE)
      // =======================================================================
      const examQuestions = Array.isArray(lesson.exam_practice)
        ? lesson.exam_practice
        : Array.isArray(lesson.exam_practice?.questions)
          ? lesson.exam_practice.questions
          : [];

      examQuestions.forEach((q, qIdx) => {
        if (!q || typeof q !== 'object') return;
        const stimList = [];
        if (Array.isArray(q.sources)) stimList.push(...q.sources);
        if (q.source && typeof q.source === 'object') stimList.push(q.source);
        if (q.stimulus && typeof q.stimulus === 'object') stimList.push(q.stimulus);

        stimList.forEach((st, stIdx) => {
          if (!st || typeof st !== 'object' || st.perspective_pair) return;
          const rawStText = String(st.text || st.content || st.extract || st.quote || '').trim();
          const plainSt = rawStText.replace(/<[^>]+>/g, '').trim();
          if (plainSt.length <= 15) return;

          // Check if identical to a canonical lesson source first ($0.00 reuse!)
          const matchedCanonical =
            (st.id && lessonSourceAudioMapById.get(String(st.id))) ||
            lessonSourceAudioMapByText.get(normTextKey(rawStText));

          if (matchedCanonical) {
            st.studio_audio = matchedCanonical.audio;
            st.studio_voice_label = matchedCanonical.label;
            return;
          }

          // Unique unseen written primary source in Exam Practice
          const cast = resolveSourceCast(unitId, st, qIdx + stIdx);
          const sLet = String(st.letter || String.fromCharCode(65 + stIdx))
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '');
          const clipId = `${lesson.id}_ep${qIdx + 1}_s${sLet || stIdx + 1}`;
          const relUrl = `/audio/sources/${unitId}/${clipId}.mp3`;
          const outMp3Path = path.join(sourceAudioDir, `${clipId}.mp3`);
          const spokenText = cleanHistoricalTextForSpeech(rawStText);
          if (spokenText.length <= 12) return;

          const contentHash = sha256(`${cast.voiceKey}::${cast.style}::${spokenText}`);
          st.studio_audio = relUrl;
          st.studio_voice_label = cast.badge;

          // Register in map so if another question in the same lesson shares the unseen source, it reuses it!
          lessonSourceAudioMapByText.set(normTextKey(rawStText), { audio: relUrl, label: cast.badge });
          sourceAlignTargets.push({ key: clipId, mp3Path: outMp3Path, rawText: rawStText });

          const prev = sourceHashes.clips[clipId];
          const exists = fs.existsSync(outMp3Path) && fs.statSync(outMp3Path).size > 1800;
          if (forceAudio || !exists || !prev || prev.hash !== contentHash) {
            jobs.push({
              unitId,
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
      });
    }
  }

  // ===========================================================================
  // 4. UNIT-ROOT MOCK EXAMS & ASSESSMENTS WRITTEN SOURCES (ALL UNITS)
  // ===========================================================================
  let rootSrcCounter = 0;
  const walkRootContainers = (node, prefixKey) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach((child, idx) => walkRootContainers(child, `${prefixKey}_${idx + 1}`));
      return;
    }
    if (Array.isArray(node.sources)) {
      node.sources.forEach((st, stIdx) => {
        if (!st || typeof st !== 'object' || st.perspective_pair) return;
        const rawStText = String(st.text || st.content || st.extract || st.quote || '').trim();
        const plainSt = rawStText.replace(/<[^>]+>/g, '').trim();
        if (plainSt.length <= 15) return;

        rootSrcCounter++;
        const cast = resolveSourceCast(unitId, st, rootSrcCounter);
        const cleanPrefix = prefixKey.replace(/[^a-zA-Z0-9_]/g, '').slice(-28);
        const clipId = `root_${cleanPrefix}_s${stIdx + 1}`;
        const relUrl = `/audio/sources/${unitId}/${clipId}.mp3`;
        const outMp3Path = path.join(sourceAudioDir, `${clipId}.mp3`);
        const spokenText = cleanHistoricalTextForSpeech(rawStText);
        if (spokenText.length <= 12) return;

        const contentHash = sha256(`${cast.voiceKey}::${cast.style}::${spokenText}`);
        st.studio_audio = relUrl;
        st.studio_voice_label = cast.badge;
        sourceAlignTargets.push({ key: clipId, mp3Path: outMp3Path, rawText: rawStText });

        const prev = sourceHashes.clips[clipId];
        const exists = fs.existsSync(outMp3Path) && fs.statSync(outMp3Path).size > 1800;
        if (forceAudio || !exists || !prev || prev.hash !== contentHash) {
          jobs.push({
            unitId,
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
    for (const [k, v] of Object.entries(node)) {
      if (k === 'sources' || k === 'lessons' || k === 'guided_reading' || k === 'literary_companion') continue;
      walkRootContainers(v, `${prefixKey}_${k}`);
    }
  };

  for (const [rootKey, rootVal] of Object.entries(unitData)) {
    if (['lessons', 'guided_reading', 'literary_companion'].includes(rootKey)) continue;
    if (rootKey.includes('mock') || rootKey.includes('exam') || rootKey.includes('assessment')) {
      walkRootContainers(rootVal, rootKey);
    }
  }

  return {
    unitId,
    fullRawJson,
    unitData,
    lessonAudioDir,
    sourceAudioDir,
    prologueAlignTargets,
    sourceAlignTargets,
    jobs,
  };
}

export async function syncProloguesAndSourcesForUnits(
  unitIds,
  { forceAudio = false, skipTts = false, dryRun = false, concurrency = 8, skipDbBuild = false } = {},
) {
  const preparedUnits = [];
  let totalPrologues = 0;
  let totalSources = 0;
  let allJobs = [];

  for (const uid of unitIds) {
    const prep = prepareUnitPrologueAndSourceJobs(uid, { forceAudio });
    if (!prep) continue;
    preparedUnits.push(prep);
    totalPrologues += prep.prologueAlignTargets.length;
    totalSources += prep.sourceAlignTargets.length;
    allJobs.push(...prep.jobs);
  }

  console.log(
    `📊 [Prologue & Source Studio Engine] Audited ${preparedUnits.length} unit(s): ` +
      `${totalPrologues} Historical Settings & ${totalSources} Written Sources tracked (${allJobs.length} clip[s] need synthesis).`,
  );

  if (dryRun) {
    const byUnit = {};
    for (const j of allJobs) byUnit[j.unitId] = (byUnit[j.unitId] || 0) + 1;
    console.log('🧪 [Dry Run] Pending clips per unit:', byUnit);
    return false;
  }

  if (!skipTts && allJobs.length > 0) {
    const apiKey = resolveGeminiApiKey();
    if (!apiKey) throw new Error('GEMINI_API_KEY missing in environment / .env.local');

    const neededVoiceKeys = new Set(allJobs.map((j) => j.voiceKey));
    const voiceIdsByKey = {};
    for (const vk of neededVoiceKeys) {
      voiceIdsByKey[vk] = await ensureHouseVoiceId(apiKey, vk);
    }

    // Group by voiceKey in 8-clip batches across concurrent workers
    const CHUNK_SIZE = 8;
    const batchTasks = [];
    const byVoice = new Map();
    for (const j of allJobs) {
      if (!byVoice.has(j.voiceKey)) byVoice.set(j.voiceKey, []);
      byVoice.get(j.voiceKey).push(j);
    }
    for (const [vk, list] of byVoice.entries()) {
      for (let off = 0; off < list.length; off += CHUNK_SIZE) {
        batchTasks.push({
          voiceKey: vk,
          jobs: list.slice(off, off + CHUNK_SIZE),
          tag: `hrh-ps-${vk}-${Math.floor(off / CHUNK_SIZE) + 1}`,
        });
      }
    }

    console.log(
      `🎬 [Batch TTS] Launching ${batchTasks.length} batch chunk(s) (${allJobs.length} clips) across ${Math.min(concurrency, batchTasks.length)} parallel worker(s)...`,
    );

    let cursor = 0;
    const workers = Array.from({ length: Math.min(concurrency, batchTasks.length) }, async (_, wIdx) => {
      if (wIdx > 0) await new Promise((r) => setTimeout(r, wIdx * 900));
      while (cursor < batchTasks.length) {
        const idx = cursor++;
        if (idx >= batchTasks.length) break;
        const bt = batchTasks[idx];
        await runSingleBatchChunk(apiKey, voiceIdsByKey[bt.voiceKey], bt.jobs, bt.tag);
      }
    });

    await Promise.all(workers);
  }

  // Write unit JSON/JS mirrors + acoustic sentence `timings.json` (only when MP3s exist!)
  let anyDataChanged = false;
  const synthesizedUnitSet = new Set(allJobs.map((j) => j.unitId));

  for (const prep of preparedUnits) {
    // Safety guard: if --skip-tts was passed and an MP3 doesn't exist yet, don't point JSON at a missing MP3
    if (skipTts) continue;

    const changed = writeUnitMirrors(prep.unitId, prep.fullRawJson, prep.unitData);
    if (changed) anyDataChanged = true;

    refreshUnitPrologueAndSourceTimings(
      prep.lessonAudioDir,
      prep.sourceAudioDir,
      prep.prologueAlignTargets,
      prep.sourceAlignTargets,
      forceAudio || synthesizedUnitSet.has(prep.unitId),
    );
  }

  if (anyDataChanged && !skipDbBuild) {
    for (const prep of preparedUnits) {
      const jsPath = path.join(ROOT, 'units', prep.unitId, 'data.js');
      if (fs.existsSync(jsPath)) {
        execFileSync('node', ['--check', jsPath], { stdio: 'inherit' });
      }
    }
    for (let dbTry = 1; dbTry <= 4; dbTry++) {
      try {
        execFileSync('node', [path.join(ROOT, 'scripts', 'build_database.cjs')], {
          cwd: ROOT,
          stdio: 'inherit',
        });
        break;
      } catch (dbErr) {
        if (dbTry === 4) throw dbErr;
        console.warn(`⚠️ build_database.cjs hit transient Windows file lock (try ${dbTry}/4); retrying in 1s...`);
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
      }
    }
  }

  return anyDataChanged;
}

async function main() {
  const args = process.argv.slice(2);
  const runAll = args.includes('--all');
  const forceAudio = args.includes('--force-audio');
  const skipTts = args.includes('--skip-tts');
  const dryRun = args.includes('--dry-run');
  const concArg = args.find((a) => a.startsWith('--concurrency='));
  const concurrency = concArg ? Math.max(1, parseInt(concArg.split('=')[1], 10) || 8) : 8;

  const unitArgs = args.filter((a) => !a.startsWith('-'));
  const allUnitIds = Object.keys(UNIT_VOICE_ASSIGNMENTS);
  const targetUnits = runAll ? allUnitIds : unitArgs;

  if (targetUnits.length === 0) {
    console.error(
      'Usage: node scripts/sync_all_prologues_and_sources_audio.mjs <unit_id... | --all> [--dry-run] [--skip-tts] [--force-audio] [--concurrency=8]',
    );
    process.exit(1);
  }

  await syncProloguesAndSourcesForUnits(targetUnits, {
    forceAudio,
    skipTts,
    dryRun,
    concurrency,
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('❌ [Prologue & Source Studio Engine] Fatal error:', err);
    process.exit(1);
  });
}
