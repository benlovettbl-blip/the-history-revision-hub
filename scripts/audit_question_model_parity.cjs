const fs = require('fs');
const path = require('path');

const units = [
  'edexcel_medicine',
  'cme_new',
  'cold_war',
  'weimar_nazi_germany',
  'eee',
  'usa',
  'medieval_england',
  'monarchy_religion_power',
  'industrialisation_and_empire',
  'great_war',
  'great_war_part2',
  'post_war_britain',
  'the_shoah',
  'second_british_empire',
  'first_british_empire',
  'water_and_sanitation',
  'australia'
];

console.log('================ AUDITING ALL LESSON QUESTIONS & MODELS ================');

units.forEach(u => {
  const file = path.join('data', u + '.json');
  if (!fs.existsSync(file)) return;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const lessons = data.lessons || [];

  lessons.forEach((l, lIdx) => {
    // 1. exam_practice.questions
    const epQs = l.exam_practice?.questions || [];
    epQs.forEach((q, qIdx) => {
      const qText = q.question || q.prompt || '';
      const mText = q.model || q.model_tiers?.tier_16m?.text || q.model_tiers?.tier_12m?.text || q.model_tiers?.tier_4m?.text || '';
      if (!qText || !mText) return;

      const firstSentM = mText.replace(/<[^>]+>/g, '').split(/[.?!]/)[0].trim();
      const firstSentQ = qText.replace(/<[^>]+>/g, '').split(/[.?!]/)[0].trim();

      // Check key nouns from question
      const qWords = firstSentQ.toLowerCase()
        .replace(/['"‘’“”\[\]\(\)]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 4 && !['explain', 'which', 'different', 'similar', 'between', 'during', 'reason', 'statement', 'agree', 'how', 'far'].includes(w));

      const mSnippet = mText.toLowerCase().substring(0, 300);
      const matches = qWords.filter(w => mSnippet.includes(w));
      const matchRatio = qWords.length > 0 ? (matches.length / qWords.length) : 1;

      if (matchRatio < 0.25 && qWords.length >= 2) {
        console.log(`\n⚠️ POTENTIAL MISMATCH in [${u}] Lesson ${lIdx+1} (${l.id}) - EP Q${qIdx+1}:`);
        console.log(`   Q: "${qText.substring(0, 110)}..."`);
        console.log(`   Model opens: "${firstSentM.substring(0, 110)}..."`);
        console.log(`   Target keywords: [${qWords.join(', ')}]`);
        console.log(`   Matched in first 300 chars: [${matches.join(', ')}]`);
      }
    });

    // 2. gcse_task.tasks
    const gtTasks = l.gcse_task?.tasks || [];
    gtTasks.forEach((t, tIdx) => {
      const qText = t.text || t.question || '';
      const mText = t.model || '';
      if (!qText || !mText) return;

      const firstSentM = mText.replace(/<[^>]+>/g, '').split(/[.?!]/)[0].trim();
      const firstSentQ = qText.replace(/<[^>]+>/g, '').split(/[.?!]/)[0].trim();

      const qWords = firstSentQ.toLowerCase()
        .replace(/['"‘’“”\[\]\(\)]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 4 && !['explain', 'which', 'different', 'similar', 'between', 'during', 'reason', 'statement', 'agree', 'how', 'far'].includes(w));

      const mSnippet = mText.toLowerCase().substring(0, 300);
      const matches = qWords.filter(w => mSnippet.includes(w));
      const matchRatio = qWords.length > 0 ? (matches.length / qWords.length) : 1;

      if (matchRatio < 0.25 && qWords.length >= 2) {
        console.log(`\n⚠️ POTENTIAL MISMATCH in [${u}] Lesson ${lIdx+1} (${l.id}) - GCSE Task ${tIdx+1}:`);
        console.log(`   Q: "${qText.substring(0, 110)}..."`);
        console.log(`   Model opens: "${firstSentM.substring(0, 110)}..."`);
        console.log(`   Target keywords: [${qWords.join(', ')}]`);
        console.log(`   Matched in first 300 chars: [${matches.join(', ')}]`);
      }
    });
  });
});

