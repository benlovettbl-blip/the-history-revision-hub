#!/usr/bin/env node
/**
 * Automated Video Health & Safeguarding Gate (`npm run audit:videos`)
 *
 * Usage:
 *   node scripts/audit_videos_gate.cjs                  # Audit all units (safeguarding + live YouTube oEmbed)
 *   node scripts/audit_videos_gate.cjs cold_war         # Audit a single unit
 *   node scripts/audit_videos_gate.cjs --offline        # Safeguarding & schema checks only (no network)
 *   node scripts/audit_videos_gate.cjs --check-url URL  # Inspect & verify a single YouTube URL via oEmbed
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DB_PATH = path.join(ROOT, 'public', 'database.json');

const TRAILER_RE = /\b(trailer|teaser)\b/i;
const KEEP_ALLOWLIST_RE = /After the War:\s*Official Book Trailer/i;
const BBFC_18_RE = /\b(?:bbfc\s*18|rated\s*18|\(18\)|\[18\])\b/i;
const BBFC_15_RE = /\b(?:bbfc\s*15|rated\s*15|\(15\)|\[15\])\b/i;

function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i,
  );
  return m ? m[1] : null;
}

function detectKeyStage(unitId, unitData) {
  const raw = String(unitData.keyStage || unitData.key_stage || unitId || '').toLowerCase();
  if (raw.includes('ks2') || raw.includes('year 5') || raw.includes('year 6')) return 'KS2';
  if (
    raw.includes('gcse') ||
    raw.includes('ks4') ||
    /^(cme|edexcel_|eee|gcse_|usa|weimar|ocr_)/.test(unitId)
  ) {
    return 'GCSE';
  }
  return 'KS3';
}

async function checkYouTubeOEmbed(ytId) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      return {
        ok: true,
        status: res.status,
        title: data.title || '',
        author_name: data.author_name || '',
      };
    }
    return {
      ok: false,
      status: res.status,
      reason:
        res.status === 401 || res.status === 403
          ? 'Embedding disabled or private'
          : res.status === 404
            ? 'Video deleted or unavailable'
            : `HTTP ${res.status}`,
    };
  } catch (err) {
    clearTimeout(timer);
    return { ok: false, status: 0, reason: err.name === 'AbortError' ? 'Timeout' : err.message };
  }
}

async function runPool(items, concurrency, fn) {
  const results = new Array(items.length);
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const current = idx++;
      results[current] = await fn(items[current], current);
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const offline = args.includes('--offline');
  const checkUrlIdx = args.indexOf('--check-url');

  if (checkUrlIdx !== -1 && args[checkUrlIdx + 1]) {
    const rawUrl = args[checkUrlIdx + 1];
    const ytId = extractYouTubeId(rawUrl);
    if (!ytId) {
      console.error('❌ Not a valid YouTube URL:', rawUrl);
      process.exit(1);
    }
    const res = await checkYouTubeOEmbed(ytId);
    console.log(JSON.stringify({ ytId, url: `https://www.youtube.com/watch?v=${ytId}`, ...res }, null, 2));
    process.exit(res.ok ? 0 : 1);
  }

  const targetUnit = args.find((a) => !a.startsWith('--')) || null;

  if (!fs.existsSync(DB_PATH)) {
    console.error('❌ public/database.json not found. Run `node scripts/build_database.cjs` first.');
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const safeguardingErrors = [];
  const schemaWarnings = [];
  const ytMap = new Map(); // ytId -> [{ unitId, location, title, url }]
  let totalVideos = 0;

  for (const [unitId, wrapper] of Object.entries(db)) {
    if (targetUnit && unitId !== targetUnit) continue;
    const unitData = wrapper && wrapper.data;
    if (!unitData || !Array.isArray(unitData.lessons)) continue;
    const ks = detectKeyStage(unitId, unitData);

    const inspectVideo = (v, location) => {
      if (!v || typeof v !== 'object') return;
      totalVideos++;
      const title = String(v.title || '');
      const url = String(v.url || '').trim();
      const ratingBlob = `${title} ${v.age_rating || ''} ${v.bbfc_rating || ''}`;

      if (!url) {
        schemaWarnings.push({ unitId, location, issue: 'Missing URL', title });
      }
      if (TRAILER_RE.test(title) && !KEEP_ALLOWLIST_RE.test(title)) {
        safeguardingErrors.push({ unitId, ks, location, issue: 'Banned movie/TV trailer', title });
      }
      if (BBFC_18_RE.test(ratingBlob)) {
        safeguardingErrors.push({ unitId, ks, location, issue: 'Banned BBFC 18 content', title });
      } else if ((ks === 'KS2' || ks === 'KS3') && BBFC_15_RE.test(ratingBlob)) {
        safeguardingErrors.push({ unitId, ks, location, issue: `Banned BBFC 15 on ${ks}`, title });
      }

      const ytId = extractYouTubeId(url);
      if (ytId) {
        if (!ytMap.has(ytId)) ytMap.set(ytId, []);
        ytMap.get(ytId).push({ unitId, location, title, url });
      }
    };

    if (Array.isArray(unitData.unit_videos)) {
      unitData.unit_videos.forEach((v, i) => inspectVideo(v, `unit_videos[${i}]`));
    }
    unitData.lessons.forEach((l, li) => {
      const loc = l.id || `lesson_${li + 1}`;
      const seenInLesson = new Set();
      const allVids = (l.video ? (Array.isArray(l.video) ? l.video : [l.video]) : [])
        .concat(l.extra_videos || [])
        .filter(Boolean);
      allVids.forEach((v) => {
        inspectVideo(v, loc);
        const key = extractYouTubeId(v.url) || String(v.url || '').toLowerCase();
        if (key) {
          if (seenInLesson.has(key)) {
            schemaWarnings.push({ unitId, location: loc, issue: 'Duplicate video in lesson', title: v.title });
          }
          seenInLesson.add(key);
        }
      });
    });
  }

  console.log(`\n🎬 Video Audit Scope: ${targetUnit || 'ALL UNITS'} | Total Videos: ${totalVideos} | Unique YouTube IDs: ${ytMap.size}`);
  console.log(`🛡️  Safeguarding Violations: ${safeguardingErrors.length}`);
  safeguardingErrors.forEach((e) => console.log(`   ❌ [${e.unitId}/${e.location}] (${e.ks}) ${e.issue}: ${e.title}`));

  if (schemaWarnings.length > 0) {
    console.log(`⚠️  Schema/Duplicate Warnings: ${schemaWarnings.length}`);
    schemaWarnings.slice(0, 20).forEach((w) => console.log(`   ⚠️  [${w.unitId}/${w.location}] ${w.issue}: ${w.title}`));
  }

  let deadLinks = [];
  if (!offline && ytMap.size > 0) {
    console.log(`🌐 Checking ${ytMap.size} unique YouTube links via oEmbed...`);
    const ids = Array.from(ytMap.keys());
    const results = await runPool(ids, 12, async (ytId) => {
      const res = await checkYouTubeOEmbed(ytId);
      return { ytId, ...res };
    });
    deadLinks = results.filter((r) => !r.ok);
    console.log(`✅ Live & Embeddable: ${results.length - deadLinks.length} / ${results.length}`);
    console.log(`💀 Broken / Unembeddable: ${deadLinks.length}`);
    deadLinks.forEach((d) => {
      const refs = ytMap.get(d.ytId) || [];
      refs.forEach((ref) => {
        console.log(`   💀 [${ref.unitId}/${ref.location}] (${d.reason}) ${ref.title} -> ${ref.url}`);
      });
    });
  }

  const failed = safeguardingErrors.length > 0 || deadLinks.length > 0;
  console.log(failed ? '\n❌ VIDEO GATE FAILED' : '\n🎉 VIDEO GATE PASSED (100% clean)');
  process.exit(failed ? 1 : 0);
}

main();
