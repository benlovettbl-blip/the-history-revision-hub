const fs = require('fs');

const newKt41Videos = [
  {
    "type": "youtube",
    "url": "https://www.youtube.com/watch?v=BIP0lYrdirI",
    "id": "BIP0lYrdirI",
    "title": "TED-Ed: Rosalind Franklin – DNA's Unsung Hero (1953)",
    "duration": "4 mins 10 secs",
    "pathway": "Starter Hook",
    "teacher_guidance": "Examines Rosalind Franklin's pioneering X-ray crystallography Photograph 51 at King's College London, Maurice Wilkins, and Watson & Crick's 1953 double helix model at Cambridge. Recommended Watch Window: 00:00–04:00 • Lesson Phase: Starter Hook (0–5m). Tone Alert: Sensitive treatment of Franklin's uncredited contribution and the patriarchal culture of 1950s British science.",
    "viewing_task": "<ol><li><strong>[01:15] Quick Check:</strong> What laboratory method did Rosalind Franklin use at King's College London to capture the famous Photograph 51 showing DNA's helical structure?</li><li><strong>[03:20] Hinge Question:</strong> Why were James Watson and Francis Crick able to publish their double helix model in 1953 before Franklin, and why was Franklin excluded from the 1962 Nobel Prize?</li></ol>",
    "model_answer": "<ol><li><strong>Quick Check:</strong> X-ray crystallography (X-ray diffraction photography).</li><li><strong>Hinge Question:</strong> Maurice Wilkins showed Franklin's Photograph 51 to Watson and Crick without her knowledge or permission, allowing them to calculate the exact helical dimensions. Because Franklin died of ovarian cancer in 1958 at age 37, and the Nobel committee strictly does not award posthumous prizes, only Watson, Crick, and Wilkins received the 1962 Nobel Prize.</li></ol>"
  },
  {
    "type": "era",
    "url": "https://era.org.uk/streaming-service-resource/bbc-four-the-beauty-of-anatomy-the-double-helix-dna-structure/",
    "title": "BBC Four: The Double Helix – The Molecular Architecture of Life",
    "duration": "4 mins 20 secs",
    "pathway": "Scientific Breakthrough",
    "teacher_guidance": "Dr Adam Rutherford analyzes the molecular geometry of the DNA ladder, base pairs (A-T, C-G), and how DNA replicates. Recommended Watch Window: 00:20–04:00 • Lesson Phase: Guided Instruction & Biological Mechanism. Tone Alert: High-level molecular modeling and laboratory footage.",
    "viewing_task": "<ol><li><strong>[00:45] Recall:</strong> Name the four chemical bases that make up the \"rungs\" of the DNA ladder, pairing together in strict chemical sequences.</li><li><strong>[02:15] Explain:</strong> Explain how the double helix structure explains both genetic replication and the mechanism of human biological inheritance.</li><li><strong>[03:40] Challenge:</strong> Evaluate why Watson, Crick, and Wilkins were awarded the Nobel Prize in 1962, while Rosalind Franklin received no formal recognition during her lifetime.</li></ol>",
    "model_answer": "<ol><li><strong>Recall:</strong> Adenine (A), Thymine (T), Cytosine (C), and Guanine (G).</li><li><strong>Explain:</strong> The two outer sugar-phosphate backbones unzip down the middle when a cell divides; each exposed strand serves as an exact molecular template for free-floating nucleotides to bind to (A with T, C with G), producing two identical genetic replicas without error.</li><li><strong>Challenge:</strong> Franklin died of ovarian cancer in 1958 at age 37, and Nobel Prizes are strictly never awarded posthumously. However, during her life, her collaborator Maurice Wilkins showed Photo 51 to Watson and Crick without her knowledge or consent; the patriarchal scientific culture of 1950s Britain led Watson and Crick to minimize her foundational role in their publications.</li></ol>"
  },
  {
    "type": "youtube",
    "url": "https://www.youtube.com/watch?v=AhsIF-cmoQQ",
    "id": "AhsIF-cmoQQ",
    "title": "TED-Ed: The Race to Sequence the Human Genome (1990–2003)",
    "duration": "5 mins 03 secs",
    "pathway": "Scientific Breakthrough",
    "teacher_guidance": "Dynamic breakdown of the 13-year international scientific effort led by John Sulston and Craig Venter to map the 3 billion chemical base pairs of human DNA. Recommended Watch Window: 00:30–04:45 • Lesson Phase: Guided Instruction & The Modern Genomic Revolution. Tone Alert: Excellent visual metaphors explaining Sanger sequencing and shotgun sequencing.",
    "viewing_task": "<ol><li><strong>[01:20] Recall:</strong> How many chemical base pairs (A, T, C, G) make up the complete human genome mapped between 1990 and 2003?</li><li><strong>[03:10] Explain:</strong> Explain how public scientists (Human Genome Project) and private companies (Celera) competed and ultimately cooperated to sequence the human genetic code.</li><li><strong>[04:30] Challenge:</strong> How did the decision to make human genome data freely public rather than commercially patented transform modern global medical research?</li></ol>",
    "model_answer": "<ol><li><strong>Recall:</strong> Approximately 3 billion base pairs (around 20,000–25,000 genes).</li><li><strong>Explain:</strong> The international public consortium used slow, meticulous Sanger sequencing to map ordered clones, while Craig Venter's private Celera Genomics used high-speed computers and whole-genome shotgun sequencing. Rivalry accelerated the completion date from 2005 to 2003.</li><li><strong>Challenge:</strong> Placing genomic data in the public domain prevented pharmaceutical monopolies from patenting human genes, enabling researchers worldwide to develop open-source diagnostics, identify hereditary cancer mutations (BRCA1/2), and pioneer personalized therapies without prohibitive licensing fees.</li></ol>"
  },
  {
    "type": "youtube",
    "url": "https://www.youtube.com/watch?v=O9KyCg7gkhI",
    "id": "O9KyCg7gkhI",
    "title": "Wellcome Sanger Institute: From the Human Genome to Rare Disease Diagnosis",
    "duration": "4 mins 12 secs",
    "pathway": "Case Study",
    "teacher_guidance": "Case study from the Wellcome Sanger Institute in Cambridge showing how genomic sequencing directly diagnoses hereditary conditions in NHS patients. Recommended Watch Window: 00:00–04:00 • Lesson Phase: Clinical Application & Modern Diagnosis. Tone Alert: Authentic clinical and patient interviews illustrating the shift from speculative treatment to genetic pinpointing.",
    "viewing_task": "<ol><li><strong>[01:10] Quick Check:</strong> Why is diagnosis by DNA sequencing significantly more accurate than traditional symptom-based diagnosis for rare childhood disorders?</li><li><strong>[02:45] Hinge Question:</strong> How does genetic screening for hereditary risk factors (e.g. BRCA1/2 gene mutations) represent a historic shift from reactive cure to preventative medicine?</li></ol>",
    "model_answer": "<ol><li><strong>Quick Check:</strong> Symptoms for different rare conditions often overlap, but whole-genome sequencing reads the exact DNA code, pinpointing the single faulty gene without guesswork.</li><li><strong>Hinge Question:</strong> Rather than waiting for a life-threatening tumour or cardiac arrest to develop, genetic screening allows doctors to calculate lifetime disease probability, enabling proactive monitoring, preventative surgeries (e.g. prophylactic mastectomies), and lifestyle changes before symptoms ever appear.</li></ol>"
  },
  {
    "type": "youtube",
    "url": "https://www.youtube.com/watch?v=sp64nBYbFtw",
    "id": "sp64nBYbFtw",
    "title": "PBS NOVA: The Secret of Photo 51 – Rosalind Franklin's Breakthrough",
    "duration": "14 mins 30 secs",
    "pathway": "Documentary Depth",
    "teacher_guidance": "In-depth documentary footage examining Franklin’s lab notebooks, X-ray diffraction equipment at King's College London, and interviews with contemporary biophysicists. Recommended Watch Window: 02:00–12:00 • Lesson Phase: Extension / Flipped Learning. Tone Alert: Comprehensive archival analysis of 1950s laboratory techniques.",
    "viewing_task": "<ol><li><strong>[03:45] Recall:</strong> What specific physical property of DNA did the cross-shaped diffraction pattern in Photograph 51 prove to biophysicists?</li><li><strong>[08:15] Explain:</strong> Explain how Rosalind Franklin's rigorous mathematical calculations of water absorption demonstrated that the phosphate backbones had to be on the outside of the helix.</li><li><strong>[11:00] Challenge:</strong> To what extent was the discovery of DNA an example of teamwork and cross-institutional collaboration versus unethical scientific appropriation?</li></ol>",
    "model_answer": "<ol><li><strong>Recall:</strong> The distinct 'X' pattern proved that DNA possessed a double helical structure with repeating helical turns.</li><li><strong>Explain:</strong> Franklin realized that DNA avidly absorbed water, meaning the hydrophilic sugar-phosphate groups had to face outwards into the surrounding liquid, with the hydrophobic bases tucked safely inside the core.</li><li><strong>Challenge:</strong> Watson and Crick succeeded by synthesizing clues from multiple institutions (Franklin's X-ray data from King's, Chargaff's base ratios, and Donohue's tautomer advice), but obtaining Franklin's unreleased MRC report and Photo 51 without her knowledge breached research ethics.</li></ol>"
  }
];

function updateUnitObject(unitObj) {
  const lesson = unitObj.lessons.find(l => l.id === 'lesson_4_1');
  if (!lesson) {
    throw new Error('Could not find lesson_4_1 in unit object!');
  }
  lesson.video = newKt41Videos;
  lesson.extra_videos = [];
  return unitObj;
}

// 1. Update data/edexcel_medicine.json
console.log('Updating data/edexcel_medicine.json...');
const dataFile = 'data/edexcel_medicine.json';
const dataObj = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
updateUnitObject(dataObj);
fs.writeFileSync(dataFile, JSON.stringify(dataObj, null, 2), 'utf8');

// 2. Update public/data/edexcel_medicine.json
console.log('Updating public/data/edexcel_medicine.json...');
const publicDataFile = 'public/data/edexcel_medicine.json';
fs.writeFileSync(publicDataFile, JSON.stringify(dataObj, null, 2), 'utf8');

// 3. Update units/edexcel_medicine/data.js
console.log('Updating units/edexcel_medicine/data.js...');
const unitsDataFile = 'units/edexcel_medicine/data.js';
fs.writeFileSync(unitsDataFile, 'window.unitData = ' + JSON.stringify(dataObj, null, 2) + ';\n', 'utf8');

// 4. Update public/units/edexcel_medicine/data.js
console.log('Updating public/units/edexcel_medicine/data.js...');
const pubUnitsDataFile = 'public/units/edexcel_medicine/data.js';
fs.writeFileSync(pubUnitsDataFile, 'window.unitData = ' + JSON.stringify(dataObj, null, 2) + ';\n', 'utf8');

// 5. Update database.json
console.log('Updating database.json...');
const dbFile = 'database.json';
const dbObj = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
dbObj.edexcel_medicine = dataObj;
fs.writeFileSync(dbFile, JSON.stringify(dbObj, null, 2), 'utf8');

// 6. Update public/database.json
console.log('Updating public/database.json...');
const pubDbFile = 'public/database.json';
fs.writeFileSync(pubDbFile, JSON.stringify(dbObj, null, 2), 'utf8');

console.log('✅ Successfully updated KT4.1 DNA / Genetics videos across all 6 data stores!');

