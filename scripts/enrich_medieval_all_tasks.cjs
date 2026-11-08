const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const medJsonPath = path.join(ROOT, 'data', 'medieval_england.json');
const pubMedJsonPath = path.join(ROOT, 'public', 'data', 'medieval_england.json');
const medJsPath = path.join(ROOT, 'units', 'medieval_england', 'data.js');
const dbPath = path.join(ROOT, 'database.json');
const pubDbPath = path.join(ROOT, 'public', 'database.json');

console.log('Enriching Medieval England all 5 lessons with authentic tasks, starters, and key terms...');

const data = JSON.parse(fs.readFileSync(medJsonPath, 'utf8'));

// Lesson 1: Hastings (preserve and refine)
data.lessons[0].tasks = [
  {
    id: 'me_l1_q2_explain_why',
    type: 'causation_12m',
    topic: 'Question 2: Explain Why [12 marks • 15 mins]',
    title: 'Question 2: Explain Why [12 marks • 15 mins]',
    question: 'Explain why William of Normandy achieved victory at the Battle of Hastings in 1066. [12 marks]',
    stimulus: [
      'Norman military tactics, heavy cavalry, and the feigned retreat',
      'Anglo-Saxon exhaustion and loss of shield-wall discipline'
    ],
    hints: [
      'Point: State your central thesis: weigh whether Norman combined-arms tactics or Anglo-Saxon exhaustion proved decisive on Senlac Hill [1.4, 1.5].',
      'Evidence: Deploy specific factual evidence: the 200-mile forced march, the shield wall on Senlac Hill, cavalry charges, feigned retreats, and Harold\'s death [1.3–1.5].',
      'Explanation: Explain the causal connection: show how the feigned retreat lured Saxon fyrd militia off the ridge, opening fatal gaps [1.5].',
      'Link: Conclude with a sustained comparative judgment: evaluate whether tactical flexibility or Saxon fatigue was the ultimate reason [1.1–1.5].'
    ],
    starter: 'A decisive factor explaining why William of Normandy achieved victory at the Battle of Hastings in 1066 was...',
    key_terms: ['Norman Tactics', 'Anglo-Saxon Exhaustion', 'Feigned Retreat', 'Own Knowledge'],
    gold_challenge: 'Historian Challenge: Compare the relative weight of Norman tactical skill (cavalry and feigned retreat) against Anglo-Saxon exhaustion to explain which was the ultimate turning point.'
  }
];

// Lesson 2: Castles & Domesday
data.lessons[1].tasks = [
  {
    id: 'me_l2_q1_features',
    type: 'two_features',
    tariff: '4 marks',
    topic: 'Question 1: Describe Two Features [4 marks • 5 mins]',
    title: 'Question 1: Describe Two Features [4 marks • 5 mins]',
    question: 'Describe two features of Norman motte-and-bailey castles. [4 marks]',
    hints: [
      'Feature 1: Identify the raised earth mound (motte) topped by a wooden keep tower for observation and last defence [2.1].',
      'Detail 1: Support with specific facts: over 500 castles built rapidly using local forced Saxon labour and timber palisades [2.1].',
      'Feature 2: Identify the enclosed living compound (bailey) below the motte [2.1].',
      'Detail 2: Support with specific facts: barracks, stables, workshops, and ditch/drawbridge defence [2.1].'
    ],
    starter: 'One key feature of Norman motte-and-bailey castles was the raised earth motte, which... A second key feature was the enclosed bailey, which...',
    key_terms: ['Motte & Bailey', 'Timber Keep', 'Rapid Construction', 'Military Dominance'],
    gold_challenge: 'Historian Challenge: Explain how the physical design of motte-and-bailey castles allowed a small Norman military elite to dominate a hostile English population.'
  },
  {
    id: 'me_l2_q2_consequence',
    type: 'consequence_4m',
    tariff: '4 marks',
    topic: 'Question 2: Explain One Consequence [4 marks • 5 mins]',
    title: 'Question 2: Explain One Consequence [4 marks • 5 mins]',
    question: 'Explain one consequence of the motte-and-bailey blitz for Anglo-Saxon resistance against Norman rule. [4 marks]',
    hints: [
      'Consequence: State how the network of 500+ castles crippled Anglo-Saxon ability to launch organized rebellions [2.1, 2.2].',
      'Evidence & Impact: Explain how cavalry garrisons could ride out within hours to suppress uprisings, turning military conquest into permanent feudal occupation [2.1–2.5].'
    ],
    starter: 'One consequence of the motte-and-bailey blitz for Anglo-Saxon resistance was that it permanently shattered rebel coordination because...',
    key_terms: ['Suppression of Rebellion', 'Cavalry Garrisons', 'Feudal Domination'],
    gold_challenge: 'Historian Challenge: Explain how the castle blitz shifted Norman control from emergency battlefield defence to permanent institutional conquest.'
  }
];

// Lesson 3: Becket & Henry II
data.lessons[2].tasks = [
  {
    id: 'me_l3_q2_explain_why',
    type: 'causation_12m',
    tariff: '12 marks',
    topic: 'Question 2: Explain Why [12 marks • 15 mins]',
    title: 'Question 2: Explain Why [12 marks • 15 mins]',
    question: 'Explain why King Henry II clashed with Archbishop Thomas Becket between 1162 and 1170. [12 marks]',
    stimulus: [
      'The Constitutions of Clarendon and criminous clerks (1164)',
      'Becket’s personal transformation and allegiance to the Pope'
    ],
    hints: [
      'Point 1: Explain the constitutional dispute over "criminous clerks": Henry wanted churchmen tried in royal courts under the Constitutions of Clarendon [3.3].',
      'Point 2: Explain Becket’s dramatic spiritual transformation from worldly Chancellor to ascetic defender of papal supremacy [3.1, 3.2].',
      'Point 3 (Own Knowledge): Explain the escalation caused by Becket excommunicating royal bishops and the fatal royal outburst leading to his murder [3.4].',
      'Link: Conclude with a sustained comparative judgment on whether the conflict was driven by state law or religious authority [3.1–3.5].'
    ],
    starter: 'A decisive factor explaining why King Henry II clashed with Archbishop Thomas Becket was...',
    key_terms: ['Constitutions of Clarendon', 'Criminous Clerks', 'Papal Supremacy', 'Own Knowledge'],
    gold_challenge: 'Historian Challenge: Evaluate whether the conflict was fundamentally a legal struggle over royal sovereignty or a personal feud between former allies.'
  }
];

// Lesson 4: Magna Carta
data.lessons[3].tasks = [
  {
    id: 'me_l4_q2_narrative_account',
    type: 'narrative_account_8m',
    tariff: '8 marks',
    topic: 'Question 2: Narrative Account [8 marks • 10 mins]',
    title: 'Question 2: Narrative Account [8 marks • 10 mins]',
    question: 'Write a narrative account analysing the key events leading from the loss of Normandy (1204) to the sealing of Magna Carta at Runnymede (1215). [8 marks]',
    stimulus: [
      'The loss of Normandy (1204) and heavy scutage taxation',
      'The defeat at the Battle of Bouvines (1214)'
    ],
    hints: [
      'Beginning / Catalyst: Explain how King John’s loss of ancestral lands in Normandy forced him to levy ruinous scutage taxes on English barons [4.1, 4.2].',
      'Development / Turning Point: Show how John’s defeat at the Battle of Bouvines in 1214 emptied his treasury and shattered his military credibility [4.3].',
      'Outcome / Culmination: Explain how rebel barons captured London, forcing John to accept limits on royal power by sealing Magna Carta at Runnymede [4.4].'
    ],
    starter: 'The chain of events leading to Magna Carta began with King John’s loss of Normandy in 1204, which...',
    key_terms: ['Loss of Normandy', 'Scutage Extortion', 'Battle of Bouvines', 'Runnymede 1215'],
    gold_challenge: 'Historian Challenge: Demonstrate causal linkages showing how John’s financial desperation directly prompted baronial rebellion and the rule of law.'
  }
];

// Lesson 5: Black Death & Peasants' Revolt
data.lessons[4].tasks = [
  {
    id: 'me_l5_q5_evaluative_essay',
    type: 'evaluative_essay_12m',
    tariff: '12 marks',
    topic: 'Question 5: Evaluative Essay [12 marks • 15 mins]',
    title: 'Question 5: Evaluative Essay [12 marks • 15 mins]',
    question: '‘The Black Death of 1348 was the main cause of the breakdown of the feudal system in medieval England.’ How far do you agree? [12 marks]',
    stimulus: [
      'The demographic collapse and labour shortage caused by the Black Death (1348–1350)',
      'The 1351 Statute of Labourers and the Peasants’ Revolt of 1381'
    ],
    hints: [
      'Thesis / Introduction: State your criteria-led judgment on whether biological demographic shock (Black Death) or political resistance (1381 Peasants\' Revolt) was more decisive [5.1, 5.5].',
      'Arguments for Statement (Plague Impact): Explain how losing 40–50% of the population created an acute labour shortage, giving surviving serfs leverage for cash wages [5.1, 5.2].',
      'Counter-Arguments (Rebellion & Legislation): Explain how Parliament attempted to freeze wages via the 1351 Statute of Labourers, and how the 1381 revolt against poll taxes broke landlord resolve [5.3–5.5].',
      'Sustained Judgement: Conclude whether the plague created the irreversible economic conditions while the 1381 rebellion dealt the political death blow to serfdom [5.1–5.5].'
    ],
    starter: 'It can be argued that the Black Death was the main cause of the breakdown of the feudal system because... However, an alternative view is that...',
    key_terms: ['Demographic Collapse', 'Statute of Labourers', '1381 Peasants Revolt', 'Own Knowledge'],
    gold_challenge: 'Historian Challenge: Weigh the long-term demographic and economic impact of the Black Death against the immediate political impact of the 1381 Peasants’ Revolt in destroying serfdom.'
  }
];

// Synchronize all data files
fs.writeFileSync(medJsonPath, JSON.stringify(data, null, 2), 'utf8');
if (fs.existsSync(pubMedJsonPath)) fs.writeFileSync(pubMedJsonPath, JSON.stringify(data, null, 2), 'utf8');
if (fs.existsSync(medJsPath)) fs.writeFileSync(medJsPath, `export default ${JSON.stringify(data, null, 2)};\n`, 'utf8');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const pubDb = JSON.parse(fs.readFileSync(pubDbPath, 'utf8'));
db.medieval_england = data;
pubDb.medieval_england = data;
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
fs.writeFileSync(pubDbPath, JSON.stringify(pubDb, null, 2), 'utf8');

console.log('✅ Successfully enriched Medieval England across all 5 lessons and synchronized all data stores!');

