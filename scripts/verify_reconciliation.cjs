const fs = require('fs');
const path = require('path');

const units = [
  'ks2_ww2.json',
  'edexcel_medicine.json',
  'usa.json',
  'cold_war.json',
  'weimar_nazi_germany.json',
  'the_shoah.json',
  'post_war_britain.json'
];

console.log('--- CURRICULUM AUDIT: SYNTHETIC / BROKEN TEXT PATTERNS ---');

const badPhrases = [
  'reflected contemporary beliefs',
  'decisive factor and primary evidence',
  'decisive factor',
  'Spurred by',
  'activists and policymakers mobilised',
  'landmark catalyst for change'
];

for (const unitFile of units) {
  const filePath = path.join(__dirname, '../data', unitFile);
  if (!fs.existsSync(filePath)) {
    console.log(`[SKIPPED] ${unitFile} not found.`);
    continue;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  
  let brokenClues = 0;
  let brokenSentences = 0;
  let colonTerms = 0;

  const lessons = Array.isArray(data) ? data : (data.lessons || []);

  lessons.forEach((lesson, lIdx) => {
    (lesson.stages || []).forEach((stage, sIdx) => {
      // Check stage model sentence
      if (stage.model_sentence) {
        for (const bp of badPhrases) {
          if (stage.model_sentence.includes(bp)) {
            brokenSentences++;
            console.log(`[${unitFile}] Lesson ${lIdx + 1} Stage ${sIdx + 1} Bad Model Sentence: "${stage.model_sentence}"`);
            break;
          }
        }
      }

      // Check key terms
      (stage.key_terms || []).forEach(kt => {
        const term = typeof kt === 'string' ? kt : kt.term;
        const clue = typeof kt === 'object' ? (kt.clue || '') : '';

        if (term && term.endsWith(':')) {
          colonTerms++;
        }

        for (const bp of badPhrases) {
          if (clue.includes(bp)) {
            brokenClues++;
            console.log(`[${unitFile}] Bad Clue for [${term}]: "${clue}"`);
            break;
          }
        }
      });
    });
  });

  console.log(`-> ${unitFile}: ${brokenClues} bad clues, ${brokenSentences} bad model sentences, ${colonTerms} trailing colon terms.`);
}

