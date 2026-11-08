const fs = require('fs');
const path = require('path');

const units = fs.readdirSync('units');

console.log('================================================================');
console.log('🔍 GLOBAL DEEP-DIVE AUDIT ACROSS ALL UNITS & ALL LESSONS');
console.log('================================================================\n');

const report = {
  narrativeIssues: [],
  workbookStageIssues: [],
  starterIssues: [],
  goldDuplicationIssues: [],
  trackerPillIssues: []
};

// Check for common signs of naive trigger concatenation:
// e.g. sentence starting with " In January 1066", " The English Earl takes", or repeated phrases
const suspiciousEndings = [
  'In January 1066, Edward the Confessor died',
  'where a fierce Viking giant held Stamford Bridge',
  'after an arrow strikes Harold in the eye',
  'Over 100,000 starve to death',
  'will no one rid me of this turbulent priest',
  'four knights gallop away to Canterbury',
  'the King is bound by the law',
  'Crown jewels were lost in the Wash',
  'rebellious runaways had an iron \'F\' burned',
  'Tyler was stabbed at the peace talks'
];

units.forEach(u => {
  const p = path.join('data', `${u}.json`);
  if (!fs.existsSync(p)) return;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));

  (d.lessons || []).forEach((l, lIdx) => {
    const lId = l.id || `lesson_${lIdx + 1}`;

    // 1. Audit Narrative Blocks
    (l.narrative_blocks || []).forEach((b, bIdx) => {
      const text = (b.content || b.text || '').trim();
      
      // Check for double punctuation or suspicious trigger concatenation
      suspiciousEndings.forEach(susp => {
        if (text.toLowerCase().includes(susp.toLowerCase())) {
          // Check if this was the bad concatenation
          if (u === 'medieval_england') {
            // we already cleaned medieval_england, let's check if any survived
            report.narrativeIssues.push({
              unit: u,
              lesson: lId,
              block: bIdx + 1,
              reason: `Found legacy string pattern: "${susp}"`
            });
          }
        }
      });

      // Check for sentence duplication within the same block
      const sentences = text.split(/(?<=[.?!])\s+/).filter(s => s.length > 25);
      const seen = new Set();
      sentences.forEach(s => {
        const cleanS = s.toLowerCase().replace(/<[^>]+>/g, '').trim();
        if (seen.has(cleanS)) {
          report.narrativeIssues.push({
            unit: u,
            lesson: lId,
            block: bIdx + 1,
            reason: `Duplicate sentence in same block: "${cleanS.slice(0, 60)}..."`
          });
        }
        seen.add(cleanS);
      });
    });

    // 2. Audit Workbook Stages
    if (Array.isArray(l.workbook_stages)) {
      l.workbook_stages.forEach((s, sIdx) => {
        if (!s.title || s.title === 'undefined' || s.title.includes('undefined')) {
          report.workbookStageIssues.push({
            unit: u,
            lesson: lId,
            stage: sIdx + 1,
            issue: 'Title is undefined or missing'
          });
        }
        if (s.dates === 'undefined' || (s.dates && s.dates.includes('undefined'))) {
          report.workbookStageIssues.push({
            unit: u,
            lesson: lId,
            stage: sIdx + 1,
            issue: 'Dates is string "undefined"'
          });
        }
      });
    }

    // 3. Audit Tasks / Writing Studio Scaffolding
    const allTasks = [...(l.tasks || []), ...(l.exam_practice?.questions || []), ...(l.extended_writing ? [l.extended_writing] : [])];
    allTasks.forEach((t, tIdx) => {
      // Check starters
      const starter = t.starter || t.sentence_starter || '';
      if (starter.includes('? was...') || starter.includes('undefined') || /explaining \d{4} &/.test(starter)) {
        report.starterIssues.push({
          unit: u,
          lesson: lId,
          task: tIdx + 1,
          starter: starter
        });
      }

      // Check Gold duplication (if hints[2] is identical to gold_challenge)
      if (t.gold_challenge && Array.isArray(t.hints) && t.hints.length >= 3) {
        if (t.gold_challenge.trim() === t.hints[2].trim()) {
          report.goldDuplicationIssues.push({
            unit: u,
            lesson: lId,
            task: tIdx + 1,
            gold: t.gold_challenge.slice(0, 50)
          });
        }
      }

      // Check tracker pill truncation
      if (Array.isArray(t.key_terms)) {
        t.key_terms.forEach(term => {
          if (/[,;]\s*$/.test(term) || (term.length > 20 && term.endsWith(' a')) || (term.length > 20 && term.endsWith(' and'))) {
            report.trackerPillIssues.push({
              unit: u,
              lesson: lId,
              term: term
            });
          }
        });
      }
    });
  });
});

console.log('--- AUDIT RESULTS ---');
console.log('Narrative Block Issues:', report.narrativeIssues.length);
if (report.narrativeIssues.length > 0) console.log(report.narrativeIssues);

console.log('\nWorkbook Stage Issues (undefined titles/dates):', report.workbookStageIssues.length);
if (report.workbookStageIssues.length > 0) console.log(report.workbookStageIssues.slice(0, 10));

console.log('\nStarter Scaffolding Issues (ungrammatical / ? was...):', report.starterIssues.length);
if (report.starterIssues.length > 0) console.log(report.starterIssues);

console.log('\nGold Duplicating Silver Checklist:', report.goldDuplicationIssues.length);
if (report.goldDuplicationIssues.length > 0) console.log(report.goldDuplicationIssues);

console.log('\nTruncated Tracker Pills:', report.trackerPillIssues.length);
if (report.trackerPillIssues.length > 0) console.log(report.trackerPillIssues);

