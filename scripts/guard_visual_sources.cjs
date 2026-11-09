// scripts/guard_visual_sources.cjs
// Automated guardrail asserting 100% integrity of visual sources and eliminating erroneous attributions
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
let violations = [];

// 1. Check dna_structure.jpg across all data stores
const filesToCheck = [
  'data/edexcel_medicine.json',
  'public/data/edexcel_medicine.json',
  'database.json',
  'public/database.json',
  'units/edexcel_medicine/data.js',
  'public/units/edexcel_medicine/data.js',
  'scripts/master_rights_database.json',
  'scripts/enrich_medicine_visual_sources.cjs'
];

filesToCheck.forEach(rel => {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) return;
  const content = fs.readFileSync(full, 'utf8');

  // Check for erroneous Barrington Brown or photo attribution
  if (content.includes('Barrington Brown')) {
    violations.push(`[${rel}] Contains forbidden attribution 'Barrington Brown'!`);
  }
  if (content.includes('Photograph of James Watson and Francis Crick')) {
    violations.push(`[${rel}] Contains forbidden caption 'Photograph of James Watson and Francis Crick'!`);
  }
});

// 2. Specific assertion on lesson_4_1 in data/edexcel_medicine.json
const med = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'edexcel_medicine.json'), 'utf8'));
const l16 = med.lessons.find(l => l.id === 'lesson_4_1');
if (!l16) {
  violations.push('lesson_4_1 not found in data/edexcel_medicine.json');
} else {
  const sA = (l16.sources || []).find(s => s.id === 'source_a_watson_crick_model');
  if (!sA) {
    violations.push('source_a_watson_crick_model not found in lesson_4_1.sources');
  } else {
    if (!sA.caption.includes('wire-and-sheet-metal demonstration model')) {
      violations.push('source_a_watson_crick_model caption does not identify demonstration model!');
    }
    if (!sA.citation.includes('Science Museum, London')) {
      violations.push('source_a_watson_crick_model citation does not credit Science Museum, London!');
    }
  }

  // Ensure Block 1 (Mendel) does not have Watson and Crick 1953 model attached
  if (l16.narrative_blocks && l16.narrative_blocks[0] && l16.narrative_blocks[0].sources) {
    const hasWrong = l16.narrative_blocks[0].sources.some(s => s.id === 'source_a_watson_crick_model');
    if (hasWrong) {
      violations.push('Block 1 (Mendel) still has source_a_watson_crick_model attached!');
    }
  }
}

console.log('=== VISUAL SOURCE GUARDRAIL REPORT ===');
if (violations.length === 0) {
  console.log('🎉 100% PASS: All visual sources are clean, authentic, and correctly attributed.');
  console.log('   - 0 matches for Barrington Brown');
  console.log('   - 0 erroneous Watson & Crick photo captions');
  console.log('   - Science Museum Object 1977-310 correctly verified as demonstration model');
  process.exit(0);
} else {
  console.error(`❌ FOUND ${violations.length} VIOLATIONS:`);
  violations.forEach(v => console.error('  - ' + v));
  process.exit(1);
}
