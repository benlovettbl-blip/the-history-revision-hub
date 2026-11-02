const fs = require('fs');
const path = require('path');

const dbPath = path.resolve('c:/Projects/the-history-revision-hub/public/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const issues = [];

for (const [unitId, unitWrapper] of Object.entries(db)) {
  const unitData = unitWrapper.data || unitWrapper;
  const lessons = unitData.lessons || unitData.subtopics || [];

  lessons.forEach((l, lIdx) => {
    const sources = [];
    if (l.sources) sources.push(...l.sources);
    if (l.narrative_blocks) {
      l.narrative_blocks.forEach((b) => {
        if (b.sources) sources.push(...b.sources);
      });
    }

    const seen = new Set();
    sources.forEach((s) => {
      if (!s || !s.id || seen.has(s.id)) return;
      seen.add(s.id);

      const letter = (s.letter || '').toUpperCase().trim();
      const q = (s.question || s.enquiry_question || s.how_useful_question || '').trim();
      const title = s.title || '';
      const caption = s.caption || '';
      const extract = s.extract || s.text || s.quote || s.content || '';
      const context =
        (s.teacher_notes && s.teacher_notes.source_context) ||
        s.source_context ||
        (s.provenance_clues && s.provenance_clues.motive) ||
        '';
      const img = s.image || s.image_url || s.src || '';
      const type = (s.type || '').toLowerCase();

      const combinedSourceText = `${title} ${caption} ${extract} ${context}`.toLowerCase();

      // Check 1: Written document with NO text extract (only portrait or photo)
      const isWrittenTitle =
        /opinion|speech|diary|treaty|proclamation|letter|telegram|report|ruling|decree|manifesto|act\b|from the|written by|account of/i.test(
          title,
        );
      const isWrittenType = [
        'judicial_ruling',
        'speech',
        'written_speech',
        'diary',
        'treaty',
        'document',
        'letter',
      ].includes(type);
      const asksForTextReasoning =
        /reasoning|argument|justif|words|claims|phrase|states that|expressed in/i.test(q);

      if ((isWrittenTitle || isWrittenType || asksForTextReasoning) && !extract) {
        issues.push({
          unitId,
          lesson: l.title || `Lesson ${lIdx + 1}`,
          sourceId: s.id,
          letter,
          title,
          q,
          img,
          issueType: 'MISSING_PRIMARY_EXTRACT',
          severity: 'CRITICAL',
          details: `Question asks students to evaluate text/reasoning, but the card contains NO written extract (only an image/portrait: ${img || 'none'}).`,
        });
      }

      // Check 2: Letter mismatch
      if (q) {
        const qMatch = q.match(/Source\s+([A-E])\b/i);
        if (qMatch && letter && qMatch[1].toUpperCase() !== letter) {
          issues.push({
            unitId,
            lesson: l.title || `Lesson ${lIdx + 1}`,
            sourceId: s.id,
            letter,
            title,
            q,
            issueType: 'LETTER_MISMATCH',
            severity: 'HIGH',
            details: `Card is labeled Source ${letter}, but question explicitly asks about '${qMatch[0]}'.`,
          });
        }
      }

      // Check 3: Ungrounded entities (concepts in question completely missing from card)
      if (q && !extract) {
        const candidateTerms = q.match(
          /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+|\s+v\.\s+[A-Z][a-z]+)*)\b/g,
        ) || [];
        const missingTerms = [];
        candidateTerms.forEach((term) => {
          if (
            !/^(Source|Chief|Justice|According|What|How|Why|Explain|Describe|To|In|The|Which|President|Governor|General|Sir|Lord|Dr)\b/i.test(
              term,
            ) &&
            term.length > 3
          ) {
            if (!combinedSourceText.includes(term.toLowerCase())) {
              missingTerms.push(term);
            }
          }
        });
        if (missingTerms.length > 0) {
          issues.push({
            unitId,
            lesson: l.title || `Lesson ${lIdx + 1}`,
            sourceId: s.id,
            letter,
            title,
            q,
            issueType: 'UNGROUNDED_QUESTION_ENTITIES',
            severity: 'HIGH',
            details: `Question asks about [${missingTerms.join(', ')}], but this concept is not mentioned in the source title, caption, or context blurb.`,
          });
        }
      }
    });
  });
}

console.log('================ SOURCE ANSWERABILITY AUDIT ================');
console.log(`Total Issues Detected: ${issues.length}`);

const byType = {};
issues.forEach((i) => {
  byType[i.issueType] = (byType[i.issueType] || 0) + 1;
});
console.log('\nBreakdown by Issue Type:');
console.log(JSON.stringify(byType, null, 2));

const byUnit = {};
issues.forEach((i) => {
  byUnit[i.unitId] = (byUnit[i.unitId] || 0) + 1;
});
console.log('\nBreakdown by Unit:');
console.log(JSON.stringify(byUnit, null, 2));

const reportFile = 'c:/Projects/the-history-revision-hub/scripts/source_answerability_findings.json';
fs.writeFileSync(reportFile, JSON.stringify(issues, null, 2));
console.log(`\nDetailed findings saved to: ${reportFile}`);
