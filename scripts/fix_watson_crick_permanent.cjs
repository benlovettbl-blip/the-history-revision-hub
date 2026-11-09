// scripts/fix_watson_crick_permanent.cjs
// Permanent fix for Watson & Crick DNA Model source across all stores and scripts
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// 1. UPDATE data/edexcel_medicine.json
console.log('1. Updating data/edexcel_medicine.json...');
const medPath = path.join(ROOT, 'data', 'edexcel_medicine.json');
const med = JSON.parse(fs.readFileSync(medPath, 'utf8'));

const l16 = med.lessons.find(l => l.id === 'lesson_4_1');
if (!l16) throw new Error('lesson_4_1 not found in data/edexcel_medicine.json');

const correctedSourceA = {
  id: "source_a_watson_crick_model",
  letter: "A",
  type: "artefact",
  format: "artefact",
  title: "Source A: Watson and Crick's 1953 Demonstration Model of the DNA Double Helix",
  image: "/images/dna_structure.jpg",
  image_url: "/images/dna_structure.jpg",
  caption: "Watson and Crick's original wire-and-sheet-metal demonstration model of the DNA double helix (1953), constructed at the Cavendish Laboratory, Cambridge, and preserved at the Science Museum, London.",
  citation: "Science Museum, London (Object 1977-310 / Wikimedia Commons Public Domain).",
  question_badge: "MOLECULAR REVOLUTION & STRUCTURAL MODELLING",
  question: "Explain what Source A shows about how the structure of DNA was investigated in 1953.",
  model_answer: "Source A shows that Watson and Crick investigated DNA by constructing a physical, three-dimensional wire-and-sheet-metal scale model. Rather than relying solely on chemical experiments, they used physical modeling to puzzle out how complementary base pairs (adenine-thymine and cytosine-guanine) fit together along an antiparallel double helical spiral.",
  teacher_notes: {
    source_context: "In March 1953 at the Cavendish Laboratory in Cambridge, James Watson and Francis Crick constructed this three-dimensional molecular model from sheet-metal bases and brass rods to test the geometric compatibility of base pairs indicated by Rosalind Franklin's Photograph 51. **Hinge Question:** Why was physical 3D model-building essential in an era before computer-generated molecular graphics existed?"
  },
  enquiry_question: "Explain what Source A shows about how the structure of DNA was investigated in 1953.",
  hinge_question: "Why was physical 3D model-building essential in an era before computer-generated molecular graphics existed?",
  source_context: "In March 1953 at the Cavendish Laboratory in Cambridge, James Watson and Francis Crick constructed this three-dimensional molecular model from sheet-metal bases and brass rods to test the geometric compatibility of base pairs indicated by Rosalind Franklin's Photograph 51. **Hinge Question:** Why was physical 3D model-building essential in an era before computer-generated molecular graphics existed?"
};

// Update lesson.sources[0]
if (l16.sources && l16.sources[0]) {
  l16.sources[0] = { ...l16.sources[0], ...correctedSourceA };
}

// Clean up narrative_blocks sources alignment
if (l16.narrative_blocks) {
  // Block 1: Mendel (remove 1953 Watson Crick source from Mendel block)
  if (l16.narrative_blocks[0]) {
    delete l16.narrative_blocks[0].sources;
  }
  // Block 2: Rosalind Franklin (align with Source C / Franklin)
  if (l16.narrative_blocks[1] && l16.sources[2]) {
    l16.narrative_blocks[1].sources = [l16.sources[2]];
  }
  // Block 3: Watson & Crick Double Helix Model (align with Source A)
  if (l16.narrative_blocks[2]) {
    l16.narrative_blocks[2].sources = [correctedSourceA];
  }
  // Block 4: Human Genome Project (align with Source E)
  if (l16.narrative_blocks[3] && l16.sources[4]) {
    l16.narrative_blocks[3].sources = [l16.sources[4]];
  }
  // Block 5: Genetic Screening
  if (l16.narrative_blocks[4]) {
    delete l16.narrative_blocks[4].sources;
  }
}

fs.writeFileSync(medPath, JSON.stringify(med, null, 2), 'utf8');
console.log('✅ data/edexcel_medicine.json updated.');

// 2. UPDATE scripts/enrich_medicine_visual_sources.cjs
console.log('2. Updating scripts/enrich_medicine_visual_sources.cjs...');
const enrichPath = path.join(ROOT, 'scripts', 'enrich_medicine_visual_sources.cjs');
if (fs.existsSync(enrichPath)) {
  let enrichContent = fs.readFileSync(enrichPath, 'utf8');
  enrichContent = enrichContent.replace(
    /title:\s*'Watson and Crick with the Wire DNA Model \(1953\)',\s*provenance:\s*'Photograph by Antony Barrington Brown[^']*',\s*caption:\s*'James Watson and Francis Crick admiring their full-scale molecular wire model[^']*',/g,
    `title: "Watson and Crick's 1953 Demonstration Model of the DNA Double Helix",\n        provenance:\n          "Original wire-and-sheet-metal demonstration model constructed at the Cavendish Laboratory, Cambridge (1953); preserved at the Science Museum, London (Object 1977-310).",\n        caption:\n          "Watson and Crick's original wire-and-sheet-metal demonstration model of the DNA double helix (1953), constructed at the Cavendish Laboratory, Cambridge, and preserved at the Science Museum, London.",`
  );
  fs.writeFileSync(enrichPath, enrichContent, 'utf8');
  console.log('✅ scripts/enrich_medicine_visual_sources.cjs updated.');
}

// 3. UPDATE scripts/master_rights_database.json
console.log('3. Updating scripts/master_rights_database.json...');
const rightsPath = path.join(ROOT, 'scripts', 'master_rights_database.json');
if (fs.existsSync(rightsPath)) {
  const rightsDb = JSON.parse(fs.readFileSync(rightsPath, 'utf8'));
  const medSources = rightsDb.units?.edexcel_medicine?.sources;
  if (medSources) {
    medSources.forEach(s => {
      if (s.asset_path === '/images/dna_structure.jpg') {
        s.source_id = 'Source A (Scale Demonstration Model)';
        s.artifact_title = "Watson and Crick's 1953 Demonstration Model of the DNA Double Helix";
        s.creator = 'James Watson and Francis Crick';
        s.date = '1953';
        s.repository = 'The Science Museum, London';
        s.accession_id = 'Science Museum Object 1977-310';
        s.rights_status = 'Educational Fair Dealing / CDPA 1988 (Museum Documentation)';
        s.commercial_use_permitted = true;
        s.source_url = 'https://collection.sciencemuseumgroup.org.uk/objects/co8084950';
        s.caption = "Watson and Crick's original wire-and-sheet-metal demonstration model of the DNA double helix (1953), constructed at the Cavendish Laboratory, Cambridge, and preserved at the Science Museum, London.";
        s.hinge_question = "Why did Watson and Crick rely on physical mechanical modeling rather than direct chemical experimentation to deduce the structure of DNA?";
      }
    });
    fs.writeFileSync(rightsPath, JSON.stringify(rightsDb, null, 2), 'utf8');
    console.log('✅ scripts/master_rights_database.json updated.');
  }
}

// 4. UPDATE scripts/fix_watson_crick_source.cjs
console.log('4. Updating scripts/fix_watson_crick_source.cjs...');
const fixScriptPath = path.join(ROOT, 'scripts', 'fix_watson_crick_source.cjs');
const fixScriptCode = `const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running permanent Watson-Crick fix...');
execSync('node scripts/fix_watson_crick_permanent.cjs', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
execSync('node scripts/sync_modified_units.cjs', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
console.log('Permanent Watson-Crick fix complete.');
`;
fs.writeFileSync(fixScriptPath, fixScriptCode, 'utf8');
console.log('✅ scripts/fix_watson_crick_source.cjs updated.');

console.log('All source data updated successfully.');
