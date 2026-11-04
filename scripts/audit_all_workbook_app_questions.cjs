const fs = require('fs');
const path = require('path');

function cleanQuestionStem(q) {
  return q.toLowerCase()
    .replace(/explain\s+one\s+way\s+in\s+which/g, '')
    .replace(/explain\s+why/g, '')
    .replace(/how\s+useful\s+(are|is)\s+sources?\s+[a-z0-9\s&,]+\s+for\s+an\s+enquiry\s+into/g, '')
    .replace(/describe\s+two\s+features\s+of/g, '')
    .replace(/give\s+two\s+reasons\s+why/g, '')
    .replace(/how\s+far\s+do\s+you\s+agree\s+with\s+this\s+statement\??/g, '')
    .replace(/how\s+far\s+do\s+you\s+agree\??/g, '')
    .replace(/\[\d+\s*marks?\]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function audit() {
  console.log('======================================================================');
  console.log('🔍 PRECISE AUDIT: SUBSTANTIVE WORKBOOK QUESTIONS VS APP DATA.JS');
  console.log('======================================================================\n');

  const rootDir = path.resolve(__dirname, '..');
  const unitsDir = path.join(rootDir, 'units');
  const unitDirs = fs.readdirSync(unitsDir).filter(f => fs.statSync(path.join(unitsDir, f)).isDirectory());

  const allDiscrepancies = [];

  for (const unitId of unitDirs) {
    const dataJsPath = path.join(unitsDir, unitId, 'data.js');
    if (!fs.existsSync(dataJsPath)) continue;

    let data;
    try {
      const fileUrl = 'file:///' + dataJsPath.replace(/\\/g, '/');
      const module = await import(fileUrl);
      data = module.default || module;
    } catch (e) {
      continue;
    }

    const lessons = data.lessons || [];

    const wbPaths = [];
    const checkDirs = [
      path.join(rootDir, 'public', 'units', unitId),
      path.join(rootDir, 'units', unitId)
    ];

    for (const dir of checkDirs) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if ((file.startsWith('pupil_workbook') || file.startsWith('workbook')) && file.endsWith('.html')) {
            const fullPath = path.join(dir, file);
            if (!wbPaths.some(p => path.basename(p) === file)) {
              wbPaths.push(fullPath);
            }
          }
        }
      }
    }

    if (wbPaths.length === 0) continue;

    // Collect all substantive texts from data.js
    const appSubstantiveStrings = [];
    function extractStrings(obj) {
      if (typeof obj === 'string') {
        const cleaned = cleanQuestionStem(obj);
        if (cleaned.length > 15) {
          appSubstantiveStrings.push({ raw: obj, cleaned });
        }
      } else if (Array.isArray(obj)) {
        obj.forEach(extractStrings);
      } else if (obj && typeof obj === 'object') {
        for (const k of Object.keys(obj)) {
          extractStrings(obj[k]);
        }
      }
    }
    extractStrings(lessons);

    let unitMismatches = 0;

    for (const wbPath of wbPaths) {
      const html = fs.readFileSync(wbPath, 'utf8');
      const wbName = path.basename(wbPath);

      const regexPatterns = [
        /(?:Explain\s+one\s+way\s+in\s+which|Explain\s+why|How\s+useful\s+are|How\s+useful\s+is|Describe\s+two\s+features|Give\s+two\s+reasons)[^<\n\r]+\[\d+\s*marks?\]/gi,
        /[“"][^”"]+[”"]\s*How\s+far\s+do\s+you\s+agree[^<\n\r]+\[\d+\s*marks?\]/gi
      ];

      const foundWbQuestions = new Set();
      for (const regex of regexPatterns) {
        const matches = html.matchAll(regex);
        for (const m of matches) {
          const qText = m[0].replace(/\s+/g, ' ').trim();
          if (qText.toLowerCase().includes('continued') || qText.toLowerCase().includes('drill')) continue;
          foundWbQuestions.add(qText);
        }
      }

      foundWbQuestions.forEach(wbQ => {
        const cleanWb = cleanQuestionStem(wbQ);
        if (cleanWb.length < 15) return;

        // Check if there's any item in appSubstantiveStrings that has strong overlap (>70% words)
        const wbWords = cleanWb.split(' ').filter(w => w.length > 3);
        
        let bestScore = 0;
        let bestMatch = null;

        for (const appItem of appSubstantiveStrings) {
          if (wbWords.length === 0) continue;
          let matchCount = 0;
          for (const w of wbWords) {
            if (appItem.cleaned.includes(w)) matchCount++;
          }
          const score = matchCount / wbWords.length;
          if (score > bestScore) {
            bestScore = score;
            bestMatch = appItem.raw;
          }
        }

        // Also check if cleanWb is substring or appItem is substring
        const isSub = appSubstantiveStrings.some(appItem => 
          appItem.cleaned.includes(cleanWb) || cleanWb.includes(appItem.cleaned)
        );

        if (!isSub && bestScore < 0.70) {
          unitMismatches++;
          allDiscrepancies.push({
            unitId,
            workbook: wbName,
            wbQuestion: wbQ,
            bestScore: Math.round(bestScore * 100) + '%',
            closestAppText: bestMatch ? bestMatch.substring(0, 100) + '...' : 'None'
          });
        }
      });
    }

    console.log(`▶ [${unitId}]: checked ${wbPaths.length} workbooks, found ${unitMismatches} potential mismatch(es).`);
  }

  console.log('\n======================================================================');
  console.log(`AUDIT COMPLETE: Found ${allDiscrepancies.length} substantive question discrepancies:`);
  console.log('======================================================================\n');

  allDiscrepancies.forEach((d, i) => {
    console.log(`[${i + 1}] Unit: ${d.unitId} | Workbook: ${d.workbook}`);
    console.log(`    Workbook Question: "${d.wbQuestion}"`);
    console.log(`    Closest Match (${d.bestScore}): "${d.closestAppText}"\n`);
  });
}

audit();
