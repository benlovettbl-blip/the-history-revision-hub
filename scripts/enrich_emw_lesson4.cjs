const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const dataFilePath = path.join(ROOT, 'data', 'early_modern_world.json');
const publicDataFilePath = path.join(ROOT, 'public', 'data', 'early_modern_world.json');

const emw = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

const l4Extended = {
  title: "Assessment Practice",
  question: "Explain why the Gunpowder Plot of 1605 took place and why religious division was so volatile in Jacobean England. [12 marks]",
  word_bank: [
    "Recusancy fines",
    "Robert Catesby",
    "Guy Fawkes",
    "House of Lords",
    "Monteagle letter",
    "Robert Cecil",
    "Priest hunters",
    "36 barrels of gunpowder",
    "Popish Recusants Act 1606"
  ],
  connective_bank: [
    "Consequently",
    "As a direct result of",
    "Furthermore",
    "This proved decisive because",
    "Crucially",
    "Therefore"
  ],
  sentence_starters: [
    "A decisive factor explaining the 1605 Gunpowder Plot was the bitter disappointment and persecution felt by English Catholics under King James I...",
    "Catholics had initially hoped that James I, the son of Catholic Mary, Queen of Scots, would introduce religious toleration...",
    "Consequently, Robert Catesby and the conspirators concluded that violent rebellion was the only way to restore Catholicism...",
    "Furthermore, the plot failed because Lord Monteagle received an anonymous warning letter that exposed the cellars beneath Parliament..."
  ],
  hints: [
    "Paragraph 1 (Catholic Grievance & Betrayal): Explain how James I crushed Catholic hopes by ordering Catholic priests to leave England and strictly enforcing crippling recusancy fines.",
    "Paragraph 2 (The Conspiracy & 36 Barrels): Detail Robert Catesby's plan to blow up King James and Parliament with 36 barrels of gunpowder, kidnapping Princess Elizabeth to crown a Catholic monarch.",
    "Paragraph 3 (The Discovery & Aftermath): Explain the Monteagle letter, Fawkes' capture under torture, and how the plot intensified anti-Catholic laws and paranoia for centuries."
  ],
  model_answer: "A decisive factor explaining why the Gunpowder Plot of 1605 took place was the intense sense of religious betrayal and escalating persecution experienced by English Catholics under King James I. Following decades of Elizabeth I's Protestant settlement, Catholics had optimistically anticipated that James—the son of the Catholic martyr Mary, Queen of Scots—would grant religious toleration. Instead, James capitulated to Puritan pressure in Parliament, strictly enforcing crippling recusancy fines and ordering all Catholic priests to leave England or face execution. This severe repression convinced a radical circle of Catholic gentry, led by Robert Catesby, that peaceful negotiation was impossible.\n\nConsequently, Catesby orchestrated an audacious terrorist conspiracy to assassinate the King, the royal heirs, and the entire Protestant ruling elite in a single blow. The plotters leased a cellar directly beneath the House of Lords and smuggled in thirty-six barrels of gunpowder, disguised beneath firewood, deploying veteran explosives expert Guy Fawkes to ignite the fuse on 5 November. Their wider objective was to trigger a Catholic uprising across the Midlands, seize the nine-year-old Princess Elizabeth, and install her on the throne as a Catholic puppet queen.\n\nHowever, the volatility of religious division ultimately exposed the plot when an anonymous letter delivered to Lord Monteagle warned him to avoid Parliament. Chief Minister Robert Cecil dispatched guards who caught Fawkes red-handed in the cellars. Under brutal torture on the rack in the Tower of London, Fawkes revealed his co-conspirators, leading to their siege and death at Holbeche House or public execution for high treason. Crucially, the discovery cemented deep anti-Catholic paranoia in English national identity, leading directly to the punitive Popish Recusants Act of 1606 and ensuring that religious division remained explosive throughout the seventeenth century.",
  lines: 15,
  qNum: 12
};

emw.lessons[3].extended = l4Extended;
emw.lessons[3].lesson_assessment = {
  question: "Explain why the Gunpowder Plot of 1605 took place and why religious division was so volatile in Jacobean England. [12 marks]",
  hints: "Mention Robert Catesby, Guy Fawkes, recusancy fines, and the Monteagle letter.",
  sentence_starters: l4Extended.sentence_starters
};

// Write to data/early_modern_world.json and public/data/early_modern_world.json
fs.writeFileSync(dataFilePath, JSON.stringify(emw, null, 2), 'utf8');
fs.writeFileSync(publicDataFilePath, JSON.stringify(emw, null, 2), 'utf8');
console.log('✅ Enriched Early Modern World Lesson 4 in data files.');

// Also sync to database.json & public/database.json
const dbPath = path.join(ROOT, 'database.json');
const pubDbPath = path.join(ROOT, 'public', 'database.json');

if (fs.existsSync(dbPath)) {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  db['early_modern_world'] = emw;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
}
if (fs.existsSync(pubDbPath)) {
  const pubDb = JSON.parse(fs.readFileSync(pubDbPath, 'utf8'));
  pubDb['early_modern_world'] = emw;
  fs.writeFileSync(pubDbPath, JSON.stringify(pubDb, null, 2), 'utf8');
}
console.log('✅ Synchronized early_modern_world across database.json & public/database.json');

