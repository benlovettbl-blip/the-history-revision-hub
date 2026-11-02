const fs = require('fs');
const path = require('path');

// Load database.json
const dbPath = path.resolve(__dirname, '../public/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Common stop words to ignore when checking keywords
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'up', 'about', 'into', 'over', 'after', 'beneath', 'under', 'above', 'is', 'are',
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'that',
  'this', 'these', 'those', 'it', 'its', 'they', 'them', 'their', 'which', 'who', 'whom',
  'whose', 'what', 'where', 'when', 'why', 'how', 'all', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
  'too', 'very', 'can', 'will', 'just', 'should', 'now', 'men', 'out', 'per', 'cent'
]);

function extractKeywords(str) {
  if (!str) return [];
  // Clean string, extract words >= 3 chars not in stop words
  const words = str
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim().toLowerCase())
    .filter(w => w.length >= 3 && !STOP_WORDS.has(w));
  return [...new Set(words)];
}

function checkTraceability(qObj, lessonText) {
  const normLesson = lessonText.toLowerCase();

  // Find correct answer string
  let ansStr = '';
  const rawAns = qObj.answer !== undefined ? qObj.answer : qObj.a;
  if (typeof rawAns === 'string') {
    ansStr = rawAns;
  } else if (typeof rawAns === 'number' && qObj.options && qObj.options[rawAns]) {
    ansStr = qObj.options[rawAns];
  } else if (typeof rawAns === 'number' && qObj.opts && qObj.opts[rawAns]) {
    ansStr = qObj.opts[rawAns];
  }

  if (!ansStr) return { traceable: false, reason: 'No answer string found' };

  const normAns = ansStr.toLowerCase().trim();

  // Check 1: Direct substring of full answer in text
  // e.g. "120,000" or "Lord Kitchener" or "Jessie Pope"
  if (normLesson.includes(normAns)) {
    return { traceable: true, method: 'exact_answer' };
  }

  // Check 2: Numbers/dates in answer must match
  const numbersInAns = ansStr.match(/\b\d+[\d,.]*\b/g);
  if (numbersInAns && numbersInAns.length > 0) {
    const allNumsPresent = numbersInAns.every(num => {
      const cleanNum = num.replace(/,/g, '');
      return normLesson.includes(num.toLowerCase()) || normLesson.includes(cleanNum);
    });
    if (!allNumsPresent) {
      return { traceable: false, reason: `Missing numbers: ${numbersInAns.join(', ')}`, ansStr };
    }
  }

  // Check 3: Significant keywords (proper nouns, specific historical terms)
  const keywords = extractKeywords(ansStr);
  if (keywords.length === 0) {
    return { traceable: true, method: 'no_keywords' };
  }

  // If answer has capitalized names/terms, check them specifically
  const properNouns = ansStr.match(/\b[A-Z][a-z]+\b/g) || [];
  const filteredProper = properNouns.filter(pn => !STOP_WORDS.has(pn.toLowerCase()));
  if (filteredProper.length > 0) {
    const missingProper = filteredProper.filter(pn => !normLesson.includes(pn.toLowerCase()));
    if (missingProper.length > 0) {
      return { traceable: false, reason: `Missing key terms: ${missingProper.join(', ')}`, ansStr };
    }
  }

  // Check keyword overlap percentage
  const matchedKeywords = keywords.filter(kw => normLesson.includes(kw));
  const ratio = matchedKeywords.length / keywords.length;

  if (ratio >= 0.6) {
    return { traceable: true, method: `keyword_ratio_${Math.round(ratio*100)}%` };
  }

  return {
    traceable: false,
    reason: `Low match (${matchedKeywords.length}/${keywords.length} words)`,
    missingWords: keywords.filter(kw => !normLesson.includes(kw)),
    ansStr
  };
}

function auditUnit(unitId, unitObj) {
  const data = unitObj.data || unitObj;
  const lessons = data.lessons || [];

  let unitTotalQuestions = 0;
  let unitTraceable = 0;
  let lessonReports = [];

  lessons.forEach((l, idx) => {
    const rawQuiz = l.quiz || l.quick_quiz || l.quiz_questions || [];
    if (!rawQuiz || rawQuiz.length === 0) {
      lessonReports.push({ lessonNum: idx + 1, title: l.title || 'Untitled', total: 0, traceable: 0, issues: [] });
      return;
    }

    // Build comprehensive lesson text
    let fullText = '';
    fullText += ' ' + (l.title || '') + ' ' + (l.subtitle || '') + ' ' + (l.enquiry || '') + ' ' + (l.prologue || '');

    const blocks = l.narrative_blocks || l.blocks || [];
    blocks.forEach(b => {
      fullText += ' ' + (b.title || '') + ' ' + (b.heading || '') + ' ' + (b.text || '') + ' ' + (b.caption || '') + ' ' + (b.image_alt || '');
      if (Array.isArray(b.paras)) fullText += ' ' + b.paras.join(' ');
      if (b.source) {
        fullText += ' ' + (b.source.title || '') + ' ' + (b.source.text || '') + ' ' + (b.source.context || '');
      }
      if (Array.isArray(b.sources)) {
        b.sources.forEach(s => {
          fullText += ' ' + (s.title || '') + ' ' + (s.text || '') + ' ' + (s.context || '');
        });
      }
    });

    if (Array.isArray(l.sources)) {
      l.sources.forEach(s => {
        fullText += ' ' + (s.title || '') + ' ' + (s.text || '') + ' ' + (s.context || '') + ' ' + (s.caption || '') + ' ' + (s.provenance || '') + ' ' + (s.source_context || '') + ' ' + (s.attribution || '');
      });
    }

    if (l.primary_source) {
      fullText += ' ' + (l.primary_source.text || '') + ' ' + (l.primary_source.context || '') + ' ' + (l.primary_source.caption || '') + ' ' + (l.primary_source.provenance || '');
    }

    if (Array.isArray(l.vocab)) {
      l.vocab.forEach(v => {
        fullText += ' ' + (v.term || '') + ' ' + (v.definition || '');
      });
    }

    let lessonTraceable = 0;
    let issues = [];

    rawQuiz.forEach((q, qIdx) => {
      unitTotalQuestions++;
      const res = checkTraceability(q, fullText);
      if (res.traceable) {
        unitTraceable++;
        lessonTraceable++;
      } else {
        issues.push({
          qNum: qIdx + 1,
          qText: (q.question || q.q || '').substring(0, 60) + '...',
          ans: res.ansStr ? res.ansStr.substring(0, 45) + '...' : 'N/A',
          reason: res.reason
        });
      }
    });

    lessonReports.push({
      lessonNum: idx + 1,
      title: l.title || 'Untitled',
      total: rawQuiz.length,
      traceable: lessonTraceable,
      issues
    });
  });

  return {
    unitId,
    title: data.title || unitId,
    totalQuestions: unitTotalQuestions,
    traceableQuestions: unitTraceable,
    percentage: unitTotalQuestions > 0 ? Math.round((unitTraceable / unitTotalQuestions) * 100) : 100,
    lessonReports
  };
}

console.log('='.repeat(75));
console.log('APP-WIDE QUIZZING TRACEABILITY & PUPIL AUDIT');
console.log('='.repeat(75));

const targetUnit = process.argv[2];

const results = [];
for (const [unitId, unitObj] of Object.entries(db)) {
  if (targetUnit && unitId !== targetUnit) continue;
  const report = auditUnit(unitId, unitObj);
  results.push(report);
}

// Summary table
console.log('\nUnit Breakdown:');
console.log('-'.repeat(75));
console.log('Unit ID'.padEnd(28), 'Total Qs', 'Traceable', 'Success Rate', 'Status');
console.log('-'.repeat(75));

let grandTotal = 0;
let grandTraceable = 0;

results.forEach(r => {
  grandTotal += r.totalQuestions;
  grandTraceable += r.traceableQuestions;
  let status = '⚪ NO QUIZ';
  if (r.totalQuestions > 0) {
    if (r.percentage >= 95) status = '🟢 EXCELLENT';
    else if (r.percentage >= 80) status = '🟡 GOOD';
    else status = '🔴 NEEDS WORK';
  }
  console.log(
    r.unitId.padEnd(28),
    String(r.totalQuestions).padStart(8),
    String(r.traceableQuestions).padStart(9),
    (r.totalQuestions > 0 ? `${r.percentage}%` : 'N/A').padStart(12),
    '  ',
    status
  );
});

console.log('-'.repeat(75));
if (!targetUnit) {
  console.log(
    'APP TOTAL'.padEnd(28),
    String(grandTotal).padStart(8),
    String(grandTraceable).padStart(9),
    `${Math.round((grandTraceable / grandTotal) * 100)}%`.padStart(12)
  );
}
console.log('='.repeat(75));

// Detailed issue sample
console.log('\nDetailed Breakdown of Flagged Units:');
results.filter(r => r.totalQuestions > 0 && (targetUnit ? true : r.percentage < 95)).forEach(r => {
  console.log(`\n▶ [${r.unitId}] Overall: ${r.percentage}% (${r.traceableQuestions}/${r.totalQuestions})`);
  r.lessonReports.forEach(lr => {
    if (lr.issues.length > 0) {
      console.log(`   Lesson ${lr.lessonNum}: "${lr.title.substring(0, 45)}..." -> ${lr.traceable}/${lr.total} (${lr.issues.length} untraceable)`);
      const issuesToShow = targetUnit ? lr.issues : lr.issues.slice(0, 3);
      issuesToShow.forEach(iss => {
        console.log(`     - Q${iss.qNum}: "${iss.qText}" | Ans: "${iss.ans}" | Reason: ${iss.reason}`);
      });
      if (!targetUnit && lr.issues.length > 3) console.log(`     ... and ${lr.issues.length - 3} more`);
    }
  });
});

