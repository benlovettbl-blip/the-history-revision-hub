const fs = require('fs');
const path = require('path');

const unitsDir = path.join(__dirname, '..', 'units');
const publicDbPath = path.join(__dirname, '..', 'public', 'database.json');

async function buildDatabase() {
  console.log('Building database.json from units directory...');
  const db = {};
  let existingNonUnitCollections = {};
  if (fs.existsSync(publicDbPath)) {
    try {
      const prevDb = JSON.parse(fs.readFileSync(publicDbPath, 'utf8'));
      for (const k of ['micro_histories', 'key_individuals']) {
        if (prevDb[k]) existingNonUnitCollections[k] = prevDb[k];
      }
    } catch (e) {}
  }
  const dirs = fs
    .readdirSync(unitsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const isV2 = process.argv.includes('--v2');
  if (isV2) {
    console.log(
      '📌 Running in V2 4-Act Reprint Mode (preferring data_v2_4act.js where present)...',
    );
  }

  for (const unitId of dirs) {
    if (unitId === 'trip_ypres') continue; // Decommissioned: Ypres trip has concluded
    let dataPath = path.join(unitsDir, unitId, isV2 ? 'data_v2_4act.js' : 'data.js');
    if (isV2 && !fs.existsSync(dataPath)) {
      dataPath = path.join(unitsDir, unitId, 'data.js');
    }
    if (fs.existsSync(dataPath)) {
      try {
        globalThis.window = {};
        const fileUrl = 'file:///' + dataPath.replace(/\\/g, '/');
        const module = await import(fileUrl);
        let unitData =
          module.default ||
          module.unitData ||
          module[unitId] ||
          module.data ||
          module[`${unitId}_data`] ||
          Object.values(globalThis.window).find((v) => v && Array.isArray(v.lessons));
        if (!unitData) {
          try {
            const raw = fs.readFileSync(dataPath, 'utf8');
            const vm = require('vm');
            const sandbox = { window: {}, module: { exports: {} }, exports: {} };
            vm.createContext(sandbox);
            vm.runInContext(raw.replace(/export\s+default[\s\S]*$/, ''), sandbox);
            const exp = sandbox.module.exports;
            unitData =
              exp && (exp.lessons || exp.subtopics || exp.data)
                ? exp.data || exp
                : exp[unitId] ||
                  exp[`${unitId}_data`] ||
                  sandbox[unitId] ||
                  sandbox[`${unitId}_data`] ||
                  Object.values(sandbox.window).find((v) => v && Array.isArray(v.lessons));
            if (!unitData) {
              const varMatch = raw.match(/const\s+([a-zA-Z0-9_]+)\s*=\s*\{/);
              if (varMatch && sandbox[varMatch[1]]) {
                unitData = sandbox[varMatch[1]];
              }
            }
          } catch (e) {
            // ignore
          }
        }
        if (unitData) {
          unitData.edition = unitData.edition || '2026.1';
          mergeUnitVideoSidecar(unitId, unitData);
          const issues = auditEntityIntegrity(unitId, unitData);
          if (issues.length > 0) {
            console.warn(
              `⚠️  [Entity Integrity Linter] Found ${issues.length} suspicious blank(s) in ${unitId}:`,
            );
            issues.forEach((iss) => {
              console.warn(`    - ${iss.path} (${iss.desc}): "${iss.snippet}"`);
            });
          }
          db[unitId] = { data: unitData };
          console.log(`✅ Included unit: ${unitId}`);
        } else {
          console.log(`⚠️  Could not extract data from ${unitId}/data.js`);
        }
      } catch (err) {
        console.error(`❌ Error importing ${unitId}/data.js:`, err.message);
      }
    } else {
      console.log(`⏭️  Skipped ${unitId} (no data.js found)`);
    }
  }

  for (const [k, val] of Object.entries(existingNonUnitCollections)) {
    if (!db[k]) db[k] = val;
  }

  const rootDbPath = path.join(__dirname, '..', 'database.json');
  const publicDataDir = path.join(__dirname, '..', 'public', 'data');
  fs.mkdirSync(publicDataDir, { recursive: true });

  // Build lightweight ~20 KB course index for instant <300ms initial browser boot
  // and keep per-unit public/data/<unitId>.json 100% synchronized for on-demand hydration
  const dbIndex = {};
  for (const [unitId, wrapper] of Object.entries(db)) {
    const unitData = wrapper && wrapper.data;
    if (!unitData || !Array.isArray(unitData.lessons || unitData.subtopics)) continue;
    fs.writeFileSync(path.join(publicDataDir, `${unitId}.json`), JSON.stringify(unitData), 'utf8');
    const rawLessons = unitData.lessons || unitData.subtopics || [];
    dbIndex[unitId] = {
      _isIndexStub: true,
      data: {
        id: unitId,
        title: unitData.title,
        subtitle: unitData.subtitle,
        desc: unitData.desc,
        description: unitData.description,
        synopsis: unitData.synopsis,
        category: unitData.category,
        keyStage: unitData.keyStage,
        key_stage: unitData.key_stage,
        yearGroup: unitData.yearGroup,
        year_group: unitData.year_group,
        edition: unitData.edition,
        enquiry: unitData.enquiry,
        enquiry_question: unitData.enquiry_question,
        cover_image: unitData.cover_image,
        cover_image_position: unitData.cover_image_position,
        homepage_background: unitData.homepage_background,
        lessons: rawLessons.map((l) => {
          const resolvedEnq =
            l.enquiry || l.enquiry_question || l.enquiryQuestion || l.inquiry_question || '';
          return {
            id: l.id,
            slug: l.slug,
            alias_ids: l.alias_ids,
            title: l.title,
            enquiry: resolvedEnq,
            enquiry_question: resolvedEnq,
            enquiryQuestion: resolvedEnq,
          };
        }),
        guided_reading: Array.isArray(unitData.guided_reading)
          ? unitData.guided_reading.map((r) => ({
              book_title: r.book_title || r.title || '',
              slug: r.slug,
              lesson_id: r.lesson_id,
              lesson_index: r.lesson_index,
            }))
          : undefined,
      },
    };
  }
  fs.writeFileSync(path.join(publicDataDir, 'database_index.json'), JSON.stringify(dbIndex), 'utf8');

  // Write compact JSON to public/database.json so dist/database.json stays well under Cloudflare Pages' 25 MiB per-file limit
  fs.writeFileSync(publicDbPath, JSON.stringify(db), 'utf8');
  fs.writeFileSync(rootDbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log(
    `🎉 Successfully built database.json (${Object.keys(db).length} keys) + database_index.json (${Object.keys(dbIndex).length} units).`,
  );
}

function auditEntityIntegrity(unitId, unitData) {
  const issues = [];
  const suspiciousPatterns = [
    {
      regex: /\b(named|called|by|after)\s{2,}\S/i,
      desc: 'Suspicious double space after naming preposition',
    },
    {
      regex: /\b(named|named after|called after)\s*[,:;]/i,
      desc: 'Missing entity after naming preposition',
    },
    {
      regex: /\bcalled\s*[,:;]/i,
      desc: 'Missing entity after "called"',
    },
    {
      regex: /\b(written by|photographed by|created by|painted by|drawn by|designed by)\s*[,;]/i,
      desc: 'Missing entity after creator attribution',
    },
    {
      regex: /\b(Portrait of|diary of|account of|memoir of)\s*[,:;?!]/i,
      desc: 'Missing name in source attribution',
    },
    {
      regex: /\b(Portrait of|diary of|account of|memoir of)\s{2,}\S/i,
      desc: 'Missing name with double space in attribution',
    },
    {
      regex: /\b(Why did|How did|What did)\s+'s\b/i,
      desc: 'Missing subject before possessive',
    },
    {
      regex: /\b(Why did|How did|What did)\s{2,}\S/i,
      desc: 'Missing subject in question',
    },
    {
      regex: /\b(adapted from (the )?diary of)\s*[,:;?!]/i,
      desc: 'Missing diarist name',
    },
    {
      regex: /\bsection on\s{2,}and\b/i,
      desc: 'Missing topic or entity in section reference',
    },
  ];

  function walk(node, pathStr) {
    if (!node) return;
    if (typeof node === 'string') {
      for (const { regex, desc } of suspiciousPatterns) {
        if (regex.test(node)) {
          if (node.includes('challenged this by...')) continue;
          issues.push({ path: pathStr, desc, snippet: node.trim().substring(0, 110) });
        }
      }
    } else if (Array.isArray(node)) {
      node.forEach((item, idx) => walk(item, `${pathStr}[${idx}]`));
    } else if (typeof node === 'object') {
      for (const key of Object.keys(node)) {
        walk(node[key], `${pathStr}.${key}`);
      }
    }
  }

  walk(unitData, unitId);
  return issues;
}

function mergeUnitVideoSidecar(unitId, unitData) {
  const sidecarPath = path.join(__dirname, '..', 'data', 'videos', `${unitId}.json`);
  if (!fs.existsSync(sidecarPath)) return;
  try {
    const sidecar = JSON.parse(fs.readFileSync(sidecarPath, 'utf8'));
    const normUrl = (v) => {
      const url = String((v && v.url) || '').trim();
      const m = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
      return m ? `yt:${m[1]}` : url.toLowerCase();
    };

    if (Array.isArray(sidecar.unit_videos) && sidecar.unit_videos.length > 0) {
      const existing = Array.isArray(unitData.unit_videos) ? unitData.unit_videos : [];
      const seen = new Set(existing.map(normUrl));
      const merged = [...existing];
      for (const vid of sidecar.unit_videos) {
        if (!vid || !vid.url) continue;
        const key = normUrl(vid);
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(vid);
        }
      }
      unitData.unit_videos = merged;
    }

    if (sidecar.lesson_videos && typeof sidecar.lesson_videos === 'object' && Array.isArray(unitData.lessons)) {
      unitData.lessons.forEach((lesson, idx) => {
        const candidates = [
          lesson.id,
          lesson.slug,
          String(idx + 1),
          `lesson_${idx + 1}`,
        ].filter(Boolean);
        const sidecarList = [];
        for (const k of candidates) {
          if (Array.isArray(sidecar.lesson_videos[k])) {
            sidecarList.push(...sidecar.lesson_videos[k]);
          }
        }
        if (sidecarList.length === 0) return;
        const existingPrimary = lesson.video ? (Array.isArray(lesson.video) ? lesson.video : [lesson.video]) : [];
        const existingExtra = Array.isArray(lesson.extra_videos) ? lesson.extra_videos : [];
        const seen = new Set([...existingPrimary, ...existingExtra].filter(Boolean).map(normUrl));
        const mergedExtra = [...existingExtra];
        for (const vid of sidecarList) {
          if (!vid || !vid.url) continue;
          const key = normUrl(vid);
          if (!seen.has(key)) {
            seen.add(key);
            mergedExtra.push(vid);
          }
        }
        lesson.extra_videos = mergedExtra;
      });
    }
    console.log(`🎬 Merged video sidecar for ${unitId}`);
  } catch (err) {
    console.warn(`⚠️  Failed to merge data/videos/${unitId}.json: ${err.message}`);
  }
}

buildDatabase();
