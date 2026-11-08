/**
 * scripts/clean_medieval_england.cjs
 * Restores clean narrative prose (removes glued summary sentences) across all 5 lessons
 * of Medieval England, provides complete workbook_stages with proper titles and dates,
 * and synchronizes across all data stores.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const dataJsonPath = path.join(ROOT, 'data', 'medieval_england.json');
const pubDataJsonPath = path.join(ROOT, 'public', 'data', 'medieval_england.json');
const dataJsPath = path.join(ROOT, 'units', 'medieval_england', 'data.js');
const dbPath = path.join(ROOT, 'database.json');
const pubDbPath = path.join(ROOT, 'public', 'database.json');

// 1. Get HEAD version of medieval_england.json to extract original clean narrative blocks
console.log('Loading clean narrative blocks from git HEAD...');
const headJson = JSON.parse(execSync('git show HEAD:data/medieval_england.json').toString());
const currJson = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));

// Stage metadata definitions from causal_domino_spine for each lesson
const stageMetaByLesson = {
  0: [ // Lesson 1: Hastings
    { stage: 1, title: 'Death of Edward the Confessor & Succession Void', dates: 'Jan 1066', focus: 'Edward died without an heir; Witan elected Harold Godwinson.' },
    { stage: 2, title: 'Three Rivals Contend for the English Crown', dates: '1066', focus: 'Norman and Viking claims forcing two-front defence.' },
    { stage: 3, title: 'Stamford Bridge & The 200-Mile Forced March', dates: 'Sept 1066', focus: 'Victory over Hardrada followed by grueling march south.' },
    { stage: 4, title: 'The Anglo-Saxon Shield Wall on Senlac Hill', dates: '14 Oct 1066', focus: 'Impenetrable Saxon shield wall resisting cavalry charges.' },
    { stage: 5, title: 'The Feigned Retreat & Norman Triumph', dates: '14 Oct 1066', focus: 'Feigned retreat breaks shield wall; Harold killed.' }
  ],
  1: [ // Lesson 2: Castles & Domesday
    { stage: 1, title: 'The Motte-and-Bailey Castle Blitz', dates: '1066–1068', focus: 'Over 500 timber and earthwork castles built fast to intimidate locals.' },
    { stage: 2, title: 'The Scorched-Earth Harrying of the North', dates: '1069–1070', focus: 'Brutal suppression of northern rebellions causing widespread famine.' },
    { stage: 3, title: 'Stone Keeps & Portchester Castle', dates: '1070–1100', focus: 'Permanent stone fortresses guarding against foreign invasion.' },
    { stage: 4, title: 'The Great Domesday Book Audit', dates: '1085–1086', focus: 'Exhaustive national survey recording every manor, cow, and pig.' },
    { stage: 5, title: 'Feudal Hierarchy & Land Dispossession', dates: '1086', focus: 'English lords dispossessed and replaced by Anglo-Norman barons.' }
  ],
  2: [ // Lesson 3: Becket & Henry II
    { stage: 1, title: 'Worldly Chancellor to Archbishop of Canterbury', dates: '1154–1162', focus: 'Henry appoints his companion Becket hoping to control the Church.' },
    { stage: 2, title: 'Becket’s Metamorphosis & Spiritual Allegiance', dates: '1162', focus: 'Becket renounces worldly wealth and pledges loyalty only to the Pope.' },
    { stage: 3, title: 'Constitutions of Clarendon & ‘Criminous Clerks’', dates: '1164', focus: 'Conflict over whether churchmen should be tried in royal courts.' },
    { stage: 4, title: 'Murder in Canterbury Cathedral', dates: '29 Dec 1170', focus: 'Four royal knights strike down Becket before the altar.' },
    { stage: 5, title: 'Barefoot Royal Penance & Papal Compromise', dates: '1170–1174', focus: 'Henry undergoes public whipping; Becket canonized as martyr.' }
  ],
  3: [ // Lesson 4: Magna Carta
    { stage: 1, title: 'Loss of Normandy & ‘Softsword’ Humiliation', dates: '1199–1204', focus: 'Loss of ancestral Norman lands making John desperate for revenue.' },
    { stage: 2, title: 'Scutage Extortion & The Papal Interdict', dates: '1205–1213', focus: 'Extortionate shield money demands and dispute with Pope Innocent III.' },
    { stage: 3, title: 'Catastrophe at the Battle of Bouvines', dates: '1214', focus: 'Decisive defeat in France leaves John’s treasury empty.' },
    { stage: 4, title: 'Runnymede & The Rule of Law (Clause 39)', dates: '15 June 1215', focus: 'Rebel barons force John to seal Magna Carta guaranteeing fair trials.' },
    { stage: 5, title: 'Papal Annulment & The First Barons’ War', dates: '1215–1216', focus: 'John repudiates the charter; civil war erupts until his death.' }
  ],
  4: [ // Lesson 5: Black Death & Peasants' Revolt
    { stage: 1, title: 'Arrival of the Plague at Melcombe Regis', dates: '1348–1349', focus: 'Plague enters Dorset, wiping out roughly half the population.' },
    { stage: 2, title: 'Labour Shortage & The Economic Revolution', dates: '1349–1351', focus: 'Severe labor shortage gives surviving peasants leverage for higher wages.' },
    { stage: 3, title: 'The Statute of Labourers & Sumptuary Resistance', dates: '1351–1377', focus: 'Parliament freezes wages and bans peasants from wearing luxury cloth.' },
    { stage: 4, title: 'The Regressive Poll Taxes & Brentwood Spark', dates: '1377–1381', focus: 'Flat-rate poll taxes trigger violent resistance in Essex and Kent.' },
    { stage: 5, title: 'Showdown at Smithfield & The End of Serfdom', dates: 'June 1381', focus: 'Wat Tyler leads march on London; Tyler killed but serfdom begins to decay.' }
  ]
};

// Clean model sentences that read naturally and correctly
const cleanModelSentences = {
  0: { // Lesson 1: Hastings
    1: "When Edward the Confessor died a childless English king in January 1066, three rival claimants contested the succession before the Witan elected Harold Godwinson.",
    2: "Harold's crown was immediately challenged by Duke William, who cited sacred oaths on holy relics, and Harald Hardrada's invasion fleet, forcing a desperate two-front defence.",
    3: "After crushing 300 Viking longships in a fierce river clash at Stamford Bridge, Harold’s exhausted housecarls marched night and day over 190 miles south to meet the Norman invasion fleet.",
    4: "Deploying atop the steep slippery ridge of Senlac Hill, the Anglo-Saxons formed an impenetrable wall of locked wooden shields and swung terrifying two-handed battleaxes.",
    5: "Norman cavalry broke the Saxon formation by pretending to run away; lured into chasing down the hill, the disordered shield wall collapsed before an arrow struck Harold in the eye."
  },
  1: { // Lesson 2: Castles & Domesday
    1: "William rapidly secured control by constructing over 500 motte-and-bailey castles with high earth mounds and quick timber walls to intimidate rebellious locals.",
    2: "When northern rebels attacked York in 1069, William launched the brutal Harrying of the North, burning crops and salting fields so over 100,000 starved to death.",
    3: "At strategic coastal sites like Portchester, the Normans reused ancient Roman walls, constructing a thick limestone keep and deep warship harbour against French seaborne invasion.",
    4: "In 1085, William commissioned the exhaustive Domesday Book audit, counting every cow and pig across every manor to ensure the Crown could extract all taxable revenue.",
    5: "Local records such as the Hundred of Fareham survey reveal how English landlords were kicked out, allowing Norman barons to take over the manors and establish feudal dominance."
  },
  2: { // Lesson 3: Becket
    1: "Henry II appointed his close hunting friend Thomas Becket as Chancellor; Becket enjoyed silk robes and luxury, leading Henry to appoint him Archbishop hoping for a compliant puppet.",
    2: "Once consecrated Archbishop in 1162, Becket underwent a radical transformation: he cast off silk robes, donned a scratchy hairshirt, and declared his loyalty only to the Pope in Rome.",
    3: "Henry sought to stop criminous priests escaping punishment in lenient bishop's courts via Benefit of Clergy, demanding royal trials under the Constitutions of Clarendon.",
    4: "When Becket excommunicated royal bishops, King Henry exploded in fury; four knights galloped to Canterbury, where their swords struck Becket down at the cathedral altar in 1170.",
    5: "Becket was revered as a holy martyr across Europe; in 1174, King Henry performed public penance, walking barefoot and enduring whipping from monks while church courts remained intact."
  },
  3: { // Lesson 4: Magna Carta
    1: "King John suffered disastrous military losses in Normandy, losing French castles like Château Gaillard; mocked by barons as 'Softsword', he grew desperate for revenue.",
    2: "John levied extortionate scutage demands without baronial consent, arbitrarily seizing lands, fining wealthy widows, and taking hostages to enforce feudal payments.",
    3: "John's huge war chest was emptied in 1214 when his imperial allies were smashed in France at the Battle of Bouvines, after which the exhausted northern barons refused further taxes.",
    4: "In May 1215, rebel barons drew their swords and captured London, forcing John to seal Magna Carta at Runnymede, guaranteeing that no freeman could be imprisoned without fair trial.",
    5: "John had no intention of honoring the charter; Pope Innocent III annulled it within weeks, sparking the First Barons' War, during which John died of dysentery after losing his baggage in the Wash."
  },
  4: { // Lesson 5: Black Death & Peasants' Revolt
    1: "In June 1348, the Black Death arrived aboard a merchant ship at Melcombe Regis, spreading pneumonic and bubonic plague that killed nearly half the population within two years.",
    2: "The catastrophic death toll left village cottages empty and unharvested wheat rotting on the ground, creating severe labour shortages that gave surviving serfs leverage to demand double wages.",
    3: "Parliament reacted by passing the 1351 Statute of Labourers to freeze wages at pre-plague rates, punishing runaways with iron brands and banning peasants from wearing luxury dyed cloth.",
    4: "To finance costly French wars, Parliament levied the hated 1381 Poll Tax demanding twelve pence from every adult, sparking armed rebellion when a tax collector was driven out at Brentwood.",
    5: "Under Wat Tyler and radical priest John Ball, peasants swarmed the capital and burned the Savoy Palace; at Smithfield, King Richard II promised concessions before Tyler was struck down by the Mayor of London."
  }
};

currJson.lessons.forEach((cl, i) => {
  const hl = headJson.lessons[i];
  if (!hl) return;

  console.log(`\nReconciling Lesson ${i + 1}: ${cl.title}...`);

  // 1. Restore clean narrative blocks from HEAD
  if (Array.isArray(hl.narrative_blocks) && Array.isArray(cl.narrative_blocks)) {
    cl.narrative_blocks.forEach((cb, bi) => {
      const hb = hl.narrative_blocks[bi];
      if (hb && (hb.content || hb.text)) {
        cb.text = (hb.content || hb.text).trim();
        cb.title = hb.title;
        console.log(`  ✓ Restored clean narrative text for Block ${bi + 1}: "${cb.title}"`);
      }
    });
  }

  // 2. Rebuild clean workbook_stages
  const metaList = stageMetaByLesson[i] || [];
  const sentences = cleanModelSentences[i] || {};

  cl.workbook_stages = cl.workbook_stages.map((st, si) => {
    const meta = metaList[si] || {};
    const stepNum = si + 1;
    return {
      stage: stepNum,
      step: stepNum,
      title: meta.title || st.title || st.heading || `Stage ${stepNum}`,
      dates: meta.dates || st.dates || st.date || '',
      date: meta.dates || st.dates || st.date || '',
      spec_focus: meta.focus || st.spec_focus || '',
      focus_clue: st.focus_clue || st.focusClue || '',
      focusClue: st.focus_clue || st.focusClue || '',
      heading: st.heading || st.questionHeading || meta.title || `Stage ${stepNum}`,
      questionHeading: st.heading || st.questionHeading || meta.title || `Stage ${stepNum}`,
      para_ref: `[${i + 1}.${stepNum}]`,
      paraRef: `[${i + 1}.${stepNum}]`,
      bullets: st.bullets || [],
      words: st.words || [],
      model_sentence: sentences[stepNum] || st.model_sentence || '',
      modelSentence: sentences[stepNum] || st.model_sentence || ''
    };
  });
  console.log(`  ✓ Rebuilt 5 complete workbook_stages with titles, dates, and clean model sentences.`);

  // 3. For Hastings (Lesson 1), ensure the task starter & stimulus terms are high fidelity
  if (i === 0 && cl.tasks && cl.tasks[0]) {
    cl.tasks[0].starter = "A decisive factor explaining why William of Normandy achieved victory at the Battle of Hastings in 1066 was...";
    cl.tasks[0].key_terms = ["Norman Tactics", "Anglo-Saxon Exhaustion", "Feigned Retreat", "Own Knowledge"];
    cl.tasks[0].gold_challenge = "Historian Challenge: Compare the relative weight of Norman tactical skill (cavalry and feigned retreat) against Anglo-Saxon exhaustion to explain which was the ultimate turning point.";
    console.log(`  ✓ Enriched Lesson 1 task with dedicated starter, key terms, and historian challenge.`);
  }
});

// Write to data/medieval_england.json
fs.writeFileSync(dataJsonPath, JSON.stringify(currJson, null, 2), 'utf8');
console.log('\n✅ Updated data/medieval_england.json');

// Write to public/data/medieval_england.json
fs.writeFileSync(pubDataJsonPath, JSON.stringify(currJson, null, 2), 'utf8');
console.log('✅ Updated public/data/medieval_england.json');

// Write to units/medieval_england/data.js
const serializedJs = 'export default ' + JSON.stringify(currJson, null, 2) + ';\n';
fs.writeFileSync(dataJsPath, serializedJs, 'utf8');
console.log('✅ Updated units/medieval_england/data.js');

// Synchronize database.json and public/database.json
[dbPath, pubDbPath].forEach(p => {
  if (fs.existsSync(p)) {
    const db = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (db.medieval_england) {
      if (db.medieval_england.data) {
        db.medieval_england.data = currJson;
      } else {
        db.medieval_england = currJson;
      }
      fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
      console.log(`✅ Updated ${p}`);
    }
  }
});

console.log('\n🎉 Successfully cleaned and synchronized Medieval England across all data files!');

