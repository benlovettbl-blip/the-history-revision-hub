const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const l3Task = {
  id: "shoah_l3_source_utility_warsaw_ghetto",
  type: "extended_writing",
  tariff: "Question 3: Source Utility [8 marks • 12 mins]",
  title: "Question 3: Source Utility [8 marks • 12 mins]",
  badge: "FORENSIC SOURCE EVALUATION",
  question: "Study Sources A and B on the digital portal (scan QR code above or view on screen). How useful are Sources A and B for an enquiry into living conditions and physical confinement in the Warsaw Ghetto? Explain your answer using Sources A and B and your knowledge of the historical context. [8 marks]",
  hints: [
    "Source A (Mary Berg Diary): Analyze evidence of starvation rations (180 calories/day), claustrophobic brick boundary walls, and secret underground classes [3.1, 3.2].",
    "Source B (Emanuel Ringelblum Oneg Shabbat Archive): Examine the underground reports buried in aluminium milk cans documenting typhus mortality and child food smugglers [3.4, 3.5].",
    "Synthesis: Explain how together they provide both visceral personal experience and systematic clandestine historical evidence free from Nazi censorship."
  ],
  scaffolding: {
    "structure_strip": [
      "Source A Content & Provenance: Analyze what Mary Berg's secret diary reveals about starvation, walls, and spiritual resistance [3.1, 3.2].",
      "Source B Content & Provenance: Evaluate Emanuel Ringelblum's Oneg Shabbat archive and its exceptional historical reliability [3.5].",
      "Judgment: Synthesize the sources' value for understanding both the physical attrition and the spiritual resilience inside the ghetto."
    ],
    "sentence_starters": [
      "Source A is immensely valuable for investigating living conditions in the Warsaw Ghetto because it provides eyewitness evidence of...",
      "From Mary Berg's diary, it can be inferred that the Nazi authorities deliberately engineered conditions of...",
      "The utility of Source B is exceptionally high due to its clandestine provenance, as it was compiled by...",
      "Ringelblum’s Oneg Shabbat archive was buried in aluminium milk cans specifically to...",
      "Together, Sources A and B are indispensable for historians because they document..."
    ],
    "connective_bank": [
      "Source A is valuable for investigating... because...",
      "For example, the extract describes...",
      "This demonstrates that living conditions were...",
      "The reliability of Source B is reinforced by its provenance as...",
      "Taken as a whole, both sources provide..."
    ],
    "word_bank": [
      "Warsaw Ghetto",
      "Mary Berg",
      "Oneg Shabbat",
      "Emanuel Ringelblum",
      "brick boundary wall",
      "starvation rations (180 kcal)",
      "typhus epidemic",
      "child food smugglers",
      "aluminium milk cans",
      "spiritual resistance"
    ]
  },
  model_answer: "Sources A and B are both exceptionally useful for investigating living conditions and physical confinement in the Warsaw Ghetto.<br><br>Source A (Mary Berg’s secret diary) is highly useful for revealing the claustrophobic physical confinement and psychological defiance inside the Warsaw Ghetto from the intimate, contemporaneous perspective of a 16-year-old resident. Her firsthand record of towering brick walls, freezing children, and the 180-calorie daily starvation regime confirms the severe deprivation engineered by Nazi authorities, while her account of secret underground classes in cellars proves the persistence of spiritual resistance. As a personal diary written under mortal terror, its utility lies in its authentic reflection of daily trauma, though its scope is limited to her immediate observations.<br><br>Source B (the Oneg Shabbat archival records) is exceptionally useful as an underground, systematic documentary testament compiled by Emanuel Ringelblum's clandestine team. Buried in sealed aluminium milk cans beneath the ghetto rubble, it provides corroborated factual data on typhus epidemics, child food smuggling, and escalating mortality, completely free from Nazi censorship. Its provenance gives it supreme historical reliability.<br><br>Together, Sources A and B are profoundly useful: Source A captures the visceral, emotional reality of youth trapped behind walls, while Source B provides forensic historical evidence of collective resilience and documentation under mortal danger.",
  topic: "Question 3: Source Utility [8 marks • 12 mins]"
};

const l4Interpretations = [
  {
    id: "shoah_l4_interpretation_1_browning",
    author: "Christopher Browning",
    work: "Ordinary Men: Reserve Police Battalion 101 and the Final Solution in Poland (1992)",
    focus: "Situational Conformity & Peer Pressure",
    extract: "What is clear is that the men of Reserve Police Battalion 101 were not forced to kill under threat of death. At Józefów, Major Wilhelm Trapp explicitly gave them the option to step out if they felt not up to the task. Yet over eighty percent chose to shoot. They were ordinary middle-aged working-class reservists from Hamburg, not fanatical SS ideologues. They were driven primarily by group conformity, situational peer pressure, the desire not to leave the dirty work to their comrades, and fear of seeming cowardly. In the brutalized wartime environment, the authority of the uniform and solidarity with their peers overcame their moral conscience."
  },
  {
    id: "shoah_l4_interpretation_2_goldhagen",
    author: "Daniel Goldhagen",
    work: "Hitler's Willing Executioners: Ordinary Germans and the Holocaust (1996)",
    focus: "Cultural & Eliminationist Antisemitism",
    extract: "The perpetrators of Battalion 101 did not shoot because of peer pressure or administrative obedience. They shot because they believed it was right. For generations, German political culture had been saturated with a virulent, deeply rooted 'eliminationist antisemitism' that viewed Jewish people as demonic enemies of the German nation. Ordinary Germans killed Jewish men, women, and children willingly, enthusiastically, and without moral remorse because they genuinely believed that the extermination of the Jewish people was necessary for Germany's survival. Ideological conviction, not peer pressure, was the decisive driving force."
  }
];

const l4Task = {
  id: "shoah_l4_interpretations_perpetrator_motivation",
  type: "extended_writing",
  tariff: "Question 4: Historical Interpretations [8 marks • 12 mins]",
  title: "Question 4: Historical Interpretations [8 marks • 12 mins]",
  badge: "HISTORIOGRAPHICAL DEBATE",
  question: "Study Interpretations 1 and 2 on the digital portal (scan QR code above or view on screen). How do Interpretations 1 and 2 differ about why ordinary German policemen participated in mass shootings during the Holocaust? Explain your answer using both interpretations and your own knowledge. [8 marks]",
  hints: [
    "Interpretation 1 (Browning): Focus on situational peer pressure, group conformity, fear of isolation, and Commander Trapp allowing men to step out [4.2].",
    "Interpretation 2 (Goldhagen): Focus on deeply ingrained cultural antisemitism, ideological conviction, and willing executioners [4.2].",
    "Synthesis: Explain that while Browning views killers as ordinary men corrupted by obedience, Goldhagen views them as ideologically committed antisemitic believers."
  ],
  scaffolding: {
    "structure_strip": [
      "Interpretation 1 Argument: Explain Browning's view that conformity, peer pressure, and fear of seeming cowardly drove ordinary reservists to shoot [4.2].",
      "Interpretation 2 Argument: Contrast with Goldhagen's view that deeply rooted eliminationist antisemitism caused them to kill willingly [4.2].",
      "Historiographical Comparison: Synthesize how the two historians disagree on whether perpetrators were ordinary men in extraordinary circumstances or willing ideologues."
    ],
    "sentence_starters": [
      "Interpretations 1 and 2 offer contrasting explanations for why ordinary German policemen took part in...",
      "Interpretation 1, written by historian Christopher Browning, argues that the primary motivation was...",
      "Browning emphasizes that Commander Trapp gave the men an explicit choice to step out, yet...",
      "In sharp contrast, Interpretation 2 by Daniel Goldhagen argues that the killers were driven by...",
      "Goldhagen rejects the idea of peer pressure, asserting instead that deeply ingrained...",
      "In conclusion, the fundamental difference between the two interpretations is that Browning sees..."
    ],
    "connective_bank": [
      "Interpretations 1 and 2 differ significantly regarding...",
      "According to Interpretation 1, the decisive factor was...",
      "For example, Browning points out that...",
      "In direct contrast, Interpretation 2 contends that...",
      "Goldhagen argues that perpetrators killed because...",
      "Consequently, while Interpretation 1 focuses on situational psychology, Interpretation 2 emphasizes..."
    ],
    "word_bank": [
      "Reserve Police Battalion 101",
      "Major Wilhelm Trapp",
      "Józefów massacre",
      "Christopher Browning",
      "Ordinary Men",
      "peer pressure",
      "conformity",
      "Daniel Goldhagen",
      "Hitler’s Willing Executioners",
      "eliminationist antisemitism"
    ]
  },
  model_answer: "Interpretations 1 and 2 offer sharply contrasting historical explanations for the motivations of ordinary German perpetrators during the Holocaust by bullets.<br><br>Interpretation 1, by historian Christopher Browning, argues that situational peer pressure, group conformity, and institutional obedience drove the men of Reserve Police Battalion 101 to commit mass murder. Browning highlights that Commander Major Trapp explicitly gave his men the option to step aside without punishment at Józefów, yet eighty percent chose to shoot because they feared seeming cowardly and did not want to leave the gruesome work to their comrades. Browning therefore portrays them as 'ordinary men' whose moral compass was broken by war and peer solidarity.<br><br>In direct contrast, Interpretation 2, by Daniel Goldhagen, argues that ordinary Germans killed willingly and enthusiastically because they were motivated by a deeply rooted, culturally ingrained 'eliminationist antisemitism.' Goldhagen rejects peer pressure as an excuse, contending that generations of antisemitic education had convinced ordinary Germans that Jewish people were mortal enemies who had to be exterminated.<br><br>Therefore, the fundamental difference is that Browning attributes perpetration to situational psychology and peer conformity, whereas Goldhagen attributes it to active ideological hatred and willing belief.",
  topic: "Question 4: Historical Interpretations [8 marks • 12 mins]"
};

const l6Task = {
  id: "shoah_l6_source_utility_collaboration_and_rescue",
  type: "extended_writing",
  tariff: "Question 6: Source Utility [8 marks • 12 mins]",
  title: "Question 6: Source Utility [8 marks • 12 mins]",
  badge: "FORENSIC SOURCE EVALUATION",
  question: "Study Sources C and D on the digital portal (scan QR code above or view on screen). How useful are Sources C and D for an enquiry into the responses of ordinary people and authorities to Nazi persecution and deportations? Explain your answer using Sources C and D and your knowledge of the historical context. [8 marks]",
  hints: [
    "Source C (Danish Rescuer Eyewitness): Analyse what the testimony reveals about the October 1943 civilian boatlift across the Øresund to neutral Sweden, saving 7,200 Jews [6.4].",
    "Source D (Paris Police Circular No. 173-42): Analyse what the administrative circular proves about French police carrying out the Vél' d'Hiv roundup of 13,000 Jews without German SS involvement [6.2].",
    "Comparative Synthesis: Weigh how the sources contrast active rescue with foreign bureaucratic collaboration across occupied Europe."
  ],
  scaffolding: {
    "structure_strip": [
      "Source C Content & Provenance: Evaluate the eyewitness testimony of Danish fishermen rescuing Jewish neighbours to Sweden [6.4].",
      "Source D Content & Provenance: Evaluate the official Paris police circular ordering the arrest and internment of 13,000 Jews at the Vélodrome d'Hiver [6.2].",
      "Judgment on Utility: Synthesize how together they illustrate the full moral spectrum between active rescue and foreign state complicity."
    ],
    "sentence_starters": [
      "Source C is exceptionally useful for an enquiry into rescue efforts because it provides eyewitness evidence of...",
      "The utility of Source C is reinforced by its provenance as a contemporaneous account from...",
      "In contrast, Source D is highly valuable for investigating European collaboration because it shows that...",
      "As an official administrative directive from the Paris Prefecture of Police, Source D reveals...",
      "Together, Sources C and D provide a profoundly useful contrast because while Source C proves that...",
      "Source D demonstrates that Nazi extermination policies depended fundamentally upon..."
    ],
    "connective_bank": [
      "Source C is valuable for investigating... because...",
      "In particular, it provides evidence that ordinary citizens...",
      "On the other hand, Source D is useful because it documents...",
      "Its provenance as an official police document makes it...",
      "Taken together, both sources are indispensable for historians because..."
    ],
    "word_bank": [
      "Danish boatlift (Oct 1943)",
      "Øresund crossing",
      "neutral Sweden",
      "7,200 rescued",
      "Righteous Among the Nations",
      "Vichy France",
      "Vél' d'Hiv roundup (July 1942)",
      "Paris Prefecture of Police",
      "Opération Vent Printanier",
      "Drancy transit camp"
    ]
  },
  model_answer: "Source C and Source D are both highly useful for investigating the contrasting responses of ordinary people and authorities to Nazi persecution and deportations across occupied Europe.<br><br>Source C (eyewitness testimony of a Danish fisherman) is extraordinarily useful for showing how civilian solidarity could frustrate Nazi extermination orders. Its content describes the clandestine October 1943 boatlift across the Øresund, which ferried over 7,200 Danish Jews (99% of the community) to safety in neutral Sweden. Its provenance as a firsthand account gives it high reliability for understanding the logistics, courage, and collective motivation of ordinary citizens who risked their lives without financial gain. However, as an individual perspective, it focuses on the success of the crossing rather than the high-level diplomatic leak that alerted Danish leaders.<br><br>In contrast, Source D (the Paris Prefecture of Police secret circular) is exceptionally useful as an official administrative document proving the active complicity of European collaborators. Issued in July 1942, it proves that over 4,500 French police officers enthusiastically executed Opération Vent Printanier, rounding up 13,152 Jewish people—including 4,115 children—at the Vélodrome d'Hiver with zero German SS involvement. The provenance provides unvarnished, official evidence of how foreign bureaucracies enabled the Holocaust.<br><br>Together, both sources are profoundly useful: Source C proves that rescue was possible when communities took collective moral action, while Source D proves that Nazi genocide was continent-wide and depended upon foreign collaboration.",
  topic: "Question 6: Source Utility [8 marks • 12 mins]"
};

// Function to update a unit JSON object
function updateShoahObj(unitObj) {
  if (!unitObj || !unitObj.lessons) return;
  
  // Lesson 3
  if (unitObj.lessons[2]) {
    unitObj.lessons[2].tasks = [l3Task];
  }

  // Lesson 4
  if (unitObj.lessons[3]) {
    unitObj.lessons[3].interpretations = l4Interpretations;
    unitObj.lessons[3].tasks = [l4Task];
  }

  // Lesson 6
  if (unitObj.lessons[5]) {
    unitObj.lessons[5].tasks = [l6Task];
  }
}

// 1. Update data/the_shoah.json
const dataPath = path.join(ROOT, 'data', 'the_shoah.json');
const shoahData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
updateShoahObj(shoahData);
fs.writeFileSync(dataPath, JSON.stringify(shoahData, null, 2), 'utf8');
console.log('[OK] Updated data/the_shoah.json');

// 2. Update public/data/the_shoah.json
const pubDataPath = path.join(ROOT, 'public', 'data', 'the_shoah.json');
if (fs.existsSync(pubDataPath)) {
  fs.writeFileSync(pubDataPath, JSON.stringify(shoahData, null, 2), 'utf8');
  console.log('[OK] Updated public/data/the_shoah.json');
}

// 3. Update database.json
const dbPath = path.join(ROOT, 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
if (db.the_shoah) {
  updateShoahObj(db.the_shoah);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log('[OK] Updated database.json');
}

// 4. Update public/database.json
const pubDbPath = path.join(ROOT, 'public', 'database.json');
if (fs.existsSync(pubDbPath)) {
  const pubDb = JSON.parse(fs.readFileSync(pubDbPath, 'utf8'));
  if (pubDb.the_shoah) {
    updateShoahObj(pubDb.the_shoah);
    fs.writeFileSync(pubDbPath, JSON.stringify(pubDb, null, 2), 'utf8');
    console.log('[OK] Updated public/database.json');
  }
}

// 5. Update units/the_shoah/data.js and public/units/the_shoah/data.js
const unitJsFiles = [
  path.join(ROOT, 'units', 'the_shoah', 'data.js'),
  path.join(ROOT, 'public', 'units', 'the_shoah', 'data.js')
];

for (const f of unitJsFiles) {
  if (fs.existsSync(f)) {
    const content = `window.unitData = ${JSON.stringify(shoahData, null, 2)};\n`;
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[OK] Updated ${path.relative(ROOT, f)}`);
  }
}

console.log('Successfully synced all data stores for the_shoah!');

