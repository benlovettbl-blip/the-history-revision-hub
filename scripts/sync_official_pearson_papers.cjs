/**
 * scripts/sync_official_pearson_papers.cjs
 *
 * Copies and indexes official Pearson Edexcel past examination papers from
 * G:\My Drive\AAMX\RESOURCES\Edexcel GCSE History exams into public/pdfs/past_papers/<unit_id>/
 * and generates public/data/official_past_papers_manifest.json.
 */

const fs = require('fs');
const path = require('path');

const SOURCE_BASE = 'G:/My Drive/AAMX/RESOURCES/Edexcel GCSE History exams';
const DEST_BASE = path.join(__dirname, '..', 'public', 'pdfs', 'past_papers');

const UNIT_MAP = {
  edexcel_medicine: {
    folder: 'p1 11 medicine',
    paperCode: '1HI0/11',
    paperName: 'Paper 1: Medicine in Britain & Western Front'
  },
  eee: {
    folder: 'p2 B4Eliz',
    paperCode: '1HI0/B4',
    paperName: 'Paper 2: Early Elizabethan England, 1558–1588'
  },
  cme_new: {
    folder: 'p2 CME P5',
    paperCode: '1HI0/P5',
    paperName: 'Paper 2: Conflict in the Middle East, 1945–1995'
  },
  usa: {
    folder: 'P3 33 USA',
    paperCode: '1HI0/33',
    paperName: 'Paper 3: Conflict at Home and Abroad: the USA, 1954–75'
  },
  weimar_nazi_germany: {
    folder: 'P3 31 Germany',
    paperCode: '1HI0/31',
    paperName: 'Paper 3: Weimar and Nazi Germany, 1918–1939'
  },
  cold_war: {
    folder: 'P2 Cold War P4',
    paperCode: '1HI0/P4',
    paperName: 'Paper 2: Superpower Relations and the Cold War, 1941–91'
  }
};

function parsePaperInfo(filename, defaultCode) {
  const lower = filename.toLowerCase();

  // Type
  let type = 'Question Paper';
  let typeKey = 'question_paper';
  if (lower.includes('rms') || lower.includes('msc')) {
    type = 'Mark Scheme';
    typeKey = 'mark_scheme';
  } else if (lower.includes('pef')) {
    type = 'Examiner Report';
    typeKey = 'examiner_report';
  }

  // Year & Date: match 8 digits (YYYYMMDD) or 4 digits year (2018-2026)
  let dateMatch = filename.match(/20\d{6}/);
  let year = null;
  let season = 'Summer';
  let fullDate = '';

  if (dateMatch) {
    fullDate = dateMatch[0];
    year = parseInt(fullDate.substring(0, 4), 10);
    const month = parseInt(fullDate.substring(4, 6), 10);
    if (month >= 5 && month <= 7) season = 'Summer';
    else if (month >= 10 && month <= 11) season = 'Autumn';
    else if (month === 1) season = 'January';
    else season = 'Exam Series';
  } else {
    const yrMatch = filename.match(/20(1[89]|2[0-6])/);
    if (yrMatch) year = parseInt(yrMatch[0], 10);
  }

  return {
    filename,
    type,
    typeKey,
    year: year || 2024,
    season,
    seriesLabel: year ? `${season} ${year}` : 'Official Exam Series',
    paperCode: defaultCode
  };
}

async function run() {
  if (!fs.existsSync(SOURCE_BASE)) {
    console.error('Source directory does not exist:', SOURCE_BASE);
    process.exit(1);
  }

  if (!fs.existsSync(DEST_BASE)) {
    fs.mkdirSync(DEST_BASE, { recursive: true });
  }

  const manifest = {};
  let totalCopied = 0;

  for (const [unitId, meta] of Object.entries(UNIT_MAP)) {
    const srcDir = path.join(SOURCE_BASE, meta.folder);
    const targetDir = path.join(DEST_BASE, unitId);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    manifest[unitId] = {
      unitId,
      paperCode: meta.paperCode,
      paperName: meta.paperName,
      papers: []
    };

    if (!fs.existsSync(srcDir)) {
      console.warn(`Source folder not found: ${srcDir}`);
      continue;
    }

    const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.pdf'));
    const examPdfs = files.filter(f => /que|rms|msc|pef/i.test(f));

    console.log(`\n📂 [${unitId}] Syncing ${examPdfs.length} official Pearson papers...`);

    for (const f of examPdfs) {
      const srcFile = path.join(srcDir, f);
      const destFile = path.join(targetDir, f);

      // Copy file
      fs.copyFileSync(srcFile, destFile);
      totalCopied++;

      const info = parsePaperInfo(f, meta.paperCode);
      info.url = `/pdfs/past_papers/${unitId}/${f}`;
      info.sizeBytes = fs.statSync(destFile).size;
      info.sizeFormatted = `${(info.sizeBytes / 1024).toFixed(0)} KB`;

      manifest[unitId].papers.push(info);
    }

    // Sort papers by year descending, then by type
    manifest[unitId].papers.sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      if (a.typeKey === 'question_paper') return -1;
      if (b.typeKey === 'question_paper') return 1;
      return 0;
    });

    console.log(`   ✅ Synced ${manifest[unitId].papers.length} papers for ${meta.paperName}`);
  }

  // Save manifest
  const manifestPath = path.join(__dirname, '..', 'public', 'data', 'official_past_papers_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\n🎉 Successfully synced ${totalCopied} official Pearson exam PDFs!`);
  console.log(`📑 Manifest saved to: public/data/official_past_papers_manifest.json`);
}

run().catch(console.error);

