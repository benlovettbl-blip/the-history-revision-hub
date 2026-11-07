const usa = require('../units/usa/data.js').default;
const ger = require('../units/weimar_nazi_germany/data.js').default;

console.log('=== USA UTILITY QUESTIONS ===');
usa.lessons.forEach((l) => {
  const q = l.exam_practice.questions[0];
  if (q.type.includes('utility')) {
    const t8 = q.model_tiers ? q.model_tiers.tier_8m.text : q.model;
    const quotes = t8.match(/['"“][^'"”]{4,100}['"”]/g) || [];
    console.log(`${l.id}: ${quotes.length} quotes ->`, quotes.slice(0, 4));
  }
});

console.log('\n=== GERMANY UTILITY QUESTIONS ===');
ger.lessons.forEach((l) => {
  l.exam_practice.questions.forEach((q, idx) => {
    if (q.type.includes('utility') && q.tariff.includes('8')) {
      const t8 = q.model_tiers ? q.model_tiers.tier_8m.text : q.model;
      const quotes = t8.match(/['"“][^'"”]{4,100}['"”]/g) || [];
      console.log(`${l.id} Q${idx + 1}: ${quotes.length} quotes ->`, quotes.slice(0, 4));
    }
  });
});

