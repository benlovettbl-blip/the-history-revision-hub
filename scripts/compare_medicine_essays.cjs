const fs = require('fs');

const d = JSON.parse(fs.readFileSync('data/edexcel_medicine.json', 'utf8'));

const wbEssays = [
  'Explain why the Catholic Church had such a major influence on ideas about the causes of disease in the period c1250–c1500. [12 marks]',
  'Explain why the Theory of the Four Humours remained the dominant rational explanation of disease throughout the period c1250–c1500. [12 marks]',
  'Explain why bloodletting and purging remained the most common medical treatments throughout the period c1250–c1500. [12 marks]',
  'Explain why hospital care in medieval England was based on the concept of ‘care rather than cure’ in the period c1250–c1500. [12 marks]',
  '‘The main reason why so many people died during the Black Death (1348–49) was because governments had no effective way of preventing disease.’ How far do you agree? Explain your answer. [16 marks + 4 marks SPaG]',
  'Explain why new ideas in medicine were able to spread more rapidly in the period c1500–c1700. [12 marks]',
  'Explain why Thomas Sydenham was an important figure in the development of medicine in the seventeenth century. [12 marks]',
  'Explain why Andreas Vesalius made significant breakthroughs in the understanding of human anatomy in the sixteenth century. [12 marks]',
  'Explain why William Harvey’s discovery of the circulation of the blood was a major breakthrough in medicine in the seventeenth century. [12 marks]',
  '‘Approaches to dealing with the Great Plague in 1665 were completely different from approaches to the Black Death in 1348.’ How far do you agree? Explain your answer. [16 marks + 4 marks SPaG]',
  'Explain why there was rapid progress in understanding the causes of disease in the period c1860–c1890. [12 marks]',
  '‘Edward Jenner’s development of the smallpox vaccine was the most significant breakthrough in the prevention of disease in the period c1700–c1900.’ How far do you agree? [16+4 marks]',
  'Explain why the standard of hospital care and nursing improved so significantly in the second half of the nineteenth century. [12 marks]',
  'Explain why surgery became significantly safer in the period c1840–c1900. [12 marks]',
  '‘The work of John Snow was the main reason for improvements in public health in the nineteenth century.’ How far do you agree? [16+4 marks]',
  'Explain why there was rapid progress in understanding the causes of disease in the period c1950 to the present. [12 marks]',
  '‘Technological innovations in medical diagnosis were more important than public health lifestyle campaigns in improving health in Britain c1900–present.’ How far do you agree? [16+4 marks]',
  '‘The establishment of the National Health Service in 1948 was the most significant turning point in medical care in the period c1900–present.’ How far do you agree? [16+4 marks]',
  'Explain why penicillin was successfully developed and mass-produced in the period 1928–1945. [12 marks]',
  '‘Government action was the main reason for progress in combating lung cancer in the twenty-first century.’ How far do you agree? [16+4 marks]'
];

for (let i = 0; i < 20; i++) {
  const l = d.lessons[i];
  let appEssay = '(none)';
  if (l.exam_practice?.questions) {
    const q = l.exam_practice.questions.find(x => x.tariff && (x.tariff.includes('12') || x.tariff.includes('16')));
    if (q) appEssay = q.question;
  }
  const wb = wbEssays[i];
  const normWb = wb.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normApp = appEssay.toLowerCase().replace(/[^a-z0-9]/g, '');
  const match = normWb === normApp;
  console.log(`Lesson ${i+1}: ${match ? '✅ MATCH' : 'MISMATCH'}`);
  if (!match) {
    console.log(`   WB : ${wb}`);
    console.log(`   APP: ${appEssay}`);
  }
}

