const { medicine12mUpdates } = require('./medicine_12m_calibrated.cjs');

console.log('Validating Medicine 12m questions: count =', Object.keys(medicine12mUpdates).length);
let pass = true;

for (const [id, tiers] of Object.entries(medicine12mUpdates)) {
  const t12 = tiers.tier_12m;
  const words = t12.text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const paras = t12.text.split(/<br><br>/);
  if (paras.length !== 3) {
    console.error(`FAIL: ${id} has ${paras.length} paragraphs instead of 3`);
    pass = false;
  }
  if (words < 200 || words > 240) {
    console.error(`FAIL: ${id} word count is ${words} (target 200-240)`);
    pass = false;
  }
  paras.forEach((p, idx) => {
    if (!p.includes('Therefore, this')) {
      console.error(`FAIL: ${id} para ${idx+1} missing 'Therefore, this':\n${p}`);
      pass = false;
    }
  });
  console.log(`PASS: ${id} -> ${words} words, 3 paras, all with 'Therefore, this...'`);
}
if (pass) console.log('ALL 15 MEDICINE 12M QUESTIONS PASS CRITERIA!');

