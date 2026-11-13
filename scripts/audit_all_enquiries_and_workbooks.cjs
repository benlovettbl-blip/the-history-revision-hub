const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

const STOP_WORDS = new Set([
  'why', 'how', 'what', 'when', 'where', 'which', 'did', 'the', 'and', 'for', 'with', 'from', 'into', 'that', 'this',
  'were', 'was', 'are', 'is', 'over', 'after', 'under', 'during', 'through', 'about', 'between', 'their', 'them', 'they',
  'part', 'also', 'such', 'than', 'then', 'into', 'been', 'have', 'were', 'will', 'would', 'could', 'should', 'more',
  'most', 'some', 'many', 'both', 'each', 'other', 'only', 'same', 'such', 'than', 'that', 'these', 'those', 'there',
  'their', 'they', 'with', 'without', 'within', 'upon', 'about', 'above', 'across', 'against', 'along', 'among',
  'around', 'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'during', 'inside', 'outside',
  'through', 'throughout', 'toward', 'towards', 'under', 'underneath', 'until', 'while', 'because', 'first', 'second',
  'third', 'lead', 'leads', 'role', 'play', 'take', 'took', 'make', 'made', 'explain'
]);

function extractKeywords(str) {
  return (str || '')
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^a-z0-9]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 4 && !STOP_WORDS.has(w));
}

function auditLessonStages(sourceLabel, lessonId, lessonTitle, stages, blocks) {
  const issues = [];
  if (!stages || stages.length === 0 || !blocks || blocks.length === 0) return issues;

  stages.forEach((st, sIdx) => {
    const qText = st.questionHeading || st.focusClue || st.focus_clue || st.enquiryQuestion || st.title || st.heading || '';
    const rawBullets = [
      ...(st.bullets || []),
      ...(st.words || []).map(w => (typeof w === 'string' ? w : (w.term || ''))),
      ...(st.key_terms || []).map(k => (typeof k === 'string' ? k : (k.term || '')))
    ];
    // Deduplicate
    const uniqueBullets = Array.from(new Set(rawBullets.filter(b => typeof b === 'string' && b.trim().length > 0)));
    const bulletsText = uniqueBullets.join(' ');
    const bulletsKw = extractKeywords(bulletsText);
    const qKw = extractKeywords(qText);

    if (bulletsKw.length < 2) return;

    // Test bullets match against each narrative block
    const blockScores = blocks.map((b, bIdx) => {
      const bText = `${b.title || ''} ${b.text || ''} ${b.content || ''}`;
      const bKw = new Set(extractKeywords(bText));
      const bulletsMatched = bulletsKw.filter(w => bKw.has(w));
      const qMatched = qKw.filter(w => bKw.has(w));
      return {
        bIdx,
        blockTitle: b.title || `Block ${bIdx + 1}`,
        bulletsOverlap: bulletsMatched.length,
        bulletsMatched,
        qOverlap: qMatched.length,
        qMatched
      };
    });

    const currentBlock = blockScores[sIdx] || { bulletsOverlap: 0, blockTitle: 'N/A', bulletsMatched: [] };
    const bestBulletsBlock = blockScores.reduce((max, cur) => cur.bulletsOverlap > max.bulletsOverlap ? cur : max, { bIdx: -1, bulletsOverlap: 0, bulletsMatched: [] });

    // Criteria for severe slippage:
    // 1. Best match is NOT current block
    // 2. Best match has >= 3 matching words
    // 3. Current block has 0 or 1 matching word, OR best match has at least 3 MORE words than current block
    const isSevereSlippage = bestBulletsBlock.bIdx !== sIdx &&
      bestBulletsBlock.bulletsOverlap >= 3 &&
      (currentBlock.bulletsOverlap <= 1 || bestBulletsBlock.bulletsOverlap >= currentBlock.bulletsOverlap + 3);

    if (isSevereSlippage) {
      issues.push({
        source: sourceLabel,
        lessonId,
        lessonTitle,
        stageNum: sIdx + 1,
        question: qText,
        bullets: uniqueBullets.slice(0, 3).join(' • '),
        currentAssignedBlock: `Block ${sIdx + 1}: ${currentBlock.blockTitle} (matched: ${currentBlock.bulletsOverlap})`,
        actualMatchingBlock: `Block ${bestBulletsBlock.bIdx + 1}: ${bestBulletsBlock.blockTitle} (matched: ${bestBulletsBlock.bulletsOverlap} [${bestBulletsBlock.bulletsMatched.slice(0, 5).join(', ')}])`,
        shift: bestBulletsBlock.bIdx - sIdx
      });
    }
  });

  return issues;
}

console.log('=== GLOBAL ENQUIRY & WORKBOOK ALIGNMENT AUDIT ===\n');

let allIssues = [];

// 1. Audit data/*.json
const dataDir = path.join(ROOT_DIR, 'data');
const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.includes('_overview') && !f.includes('_spec') && !f.includes('manifest') && !f.includes('backup'));

dataFiles.forEach(file => {
  try {
    const raw = fs.readFileSync(path.join(dataDir, file), 'utf8');
    const data = JSON.parse(raw);
    const unitName = file.replace('.json', '');
    const lessons = data.lessons || [];

    lessons.forEach((l, lIdx) => {
      const stages = l.workbook_stages || [];
      const blocks = l.narrative_blocks || [];
      const issues = auditLessonStages(`data/${file}`, l.id || `lesson_${lIdx + 1}`, l.title || `Lesson ${lIdx + 1}`, stages, blocks);
      allIssues = allIssues.concat(issues);
    });
  } catch (e) {
    console.error(`Error in ${file}:`, e.message);
  }
});

// 2. Audit standalone configs
const standaloneConfigs = [
  { name: 'scripts/components/weimar_enquiry_configs.cjs', dataFile: 'weimar_nazi_germany.json', key: 'WEIMAR_ENQUIRY_CONFIGS' },
  { name: 'scripts/components/usa_enquiry_configs.cjs', dataFile: 'usa.json', key: 'USA_ENQUIRY_CONFIGS' },
  { name: 'scripts/components/eee_enquiry_configs.cjs', dataFile: 'eee.json', key: 'EEE_ENQUIRY_CONFIGS' },
];

standaloneConfigs.forEach(cfg => {
  try {
    const mod = require(path.join(ROOT_DIR, cfg.name));
    const confData = mod[cfg.key];
    const unitData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', cfg.dataFile), 'utf8'));

    Object.entries(confData).forEach(([kt, enqs]) => {
      enqs.forEach(enq => {
        const lesson = unitData.lessons.find(l => l.id === enq.id || (l.lesson_number === enq.lessonNum && l.key_topic === parseInt(kt.replace('KT',''))));
        if (lesson) {
          const issues = auditLessonStages(`${cfg.name} (${kt})`, enq.id, enq.title, enq.stages, lesson.narrative_blocks);
          allIssues = allIssues.concat(issues);
        }
      });
    });
  } catch (e) {
    console.error(`Error in ${cfg.name}:`, e.message);
  }
});

// 3. Audit inline workbook configs
const inlineWorkbooks = [
  { script: 'render_cme_kt1_twopage_workbook.cjs', key: 'kt1Configs', data: 'cme_new.json' },
  { script: 'render_cme_twopage_workbook.cjs', key: 'kt2Configs', data: 'cme_new.json' },
  { script: 'render_cme_kt3_twopage_workbook.cjs', key: 'kt3Configs', data: 'cme_new.json' },
  { script: 'render_cold_war_twopage_workbook.cjs', key: 'enquiryConfigs', data: 'cold_war.json' },
  { script: 'render_great_war_twopage_workbook.cjs', key: 'enquiryConfigs', data: 'great_war.json' },
  { script: 'render_great_war_part2_twopage_workbook.cjs', key: 'enquiryConfigs', data: 'great_war_part2.json' },
  { script: 'render_medieval_england_workbook.cjs', key: 'enquiryConfigs', data: 'medieval_england.json' },
  { script: 'render_monarchy_religion_power_workbook.cjs', key: 'enquiryConfigs', data: 'monarchy_religion_power.json' },
  { script: 'render_post_war_britain_twopage_workbook.cjs', key: 'enquiryConfigs', data: 'post_war_britain.json' },
  { script: 'render_the_shoah_workbook.cjs', key: 'enquiryConfigs', data: 'the_shoah.json' },
  { script: 'render_medicine_medieval_twopage_workbook.cjs', key: 'medievalConfigs', data: 'edexcel_medicine.json' },
  { script: 'render_medicine_renaissance_twopage_workbook.cjs', key: 'renaissanceConfigs', data: 'edexcel_medicine.json' },
  { script: 'render_medicine_18th_19th_twopage_workbook.cjs', key: 'eighteenthNineteenthConfigs', data: 'edexcel_medicine.json' },
  { script: 'render_medicine_modern_twopage_workbook.cjs', key: 'modernConfigs', data: 'edexcel_medicine.json' }
];

inlineWorkbooks.forEach(w => {
  try {
    const mod = require(path.join(ROOT_DIR, 'scripts', w.script));
    const confList = mod[w.key];
    const unitData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', w.data), 'utf8'));

    if (Array.isArray(confList)) {
      confList.forEach((enq, idx) => {
        // match lesson
        const lesson = unitData.lessons.find(l => l.id === enq.id || l.lesson_number === enq.lessonNum || (enq.lessonIndex !== undefined && l === unitData.lessons[enq.lessonIndex]) || l.id === `lesson_${idx+1}` || l.lesson_number === (idx+1));
        if (lesson && enq.stages) {
          const issues = auditLessonStages(`scripts/${w.script}`, enq.id || `enquiry_${idx+1}`, enq.title || enq.subTitle || lesson.title, enq.stages, lesson.narrative_blocks);
          allIssues = allIssues.concat(issues);
        }
      });
    }
  } catch (e) {
    console.error(`Error in ${w.script}:`, e.message);
  }
});

console.log(`Total Severe Alignment Discrepancies Found Across Entire System: ${allIssues.length}\n`);

// Group issues by file / source
const grouped = {};
allIssues.forEach(iss => {
  if (!grouped[iss.source]) grouped[iss.source] = [];
  grouped[iss.source].push(iss);
});

Object.entries(grouped).forEach(([src, items]) => {
  console.log(`📁 Source: ${src} (${items.length} issues)`);
  items.forEach(it => {
    const shiftStr = it.shift > 0 ? `+${it.shift} (Shifted Down)` : `${it.shift} (Shifted Up)`;
    console.log(`  ❌ ${it.lessonId} [Stage ${it.stageNum}] -> Shift: ${shiftStr}`);
    console.log(`     Question: "${it.question.substring(0, 70)}..."`);
    console.log(`     Bullets: ${it.bullets}`);
    console.log(`     Current: ${it.currentAssignedBlock}`);
    console.log(`     Belongs: ${it.actualMatchingBlock}\n`);
  });
});
