const fs = require('fs');
const path = require('path');

const CHECK_LIST = [
  // Medicine
  { unit: 'edexcel_medicine', file: 'units/edexcel_medicine/data.js', terms: ['purifying the air', 'miasma', 'apothecary', 'barber surgeon', 'Sydenham', 'printing press', 'Royal Society', 'Harvey', 'Jenner', 'Public Health Act 1875', 'genetic', 'lifestyle', 'magic bullets', 'antibiotics', 'NHS'] },
  // Weimar
  { unit: 'weimar_nazi_germany', file: 'units/weimar_nazi_germany/data.js', terms: ['Dolchstoss', 'stab in the back', 'Spartacist', 'Kapp Putsch', 'hyperinflation', 'Young Plan', 'women in work', 'architecture', 'Bauhaus', 'autobahns', 'Reichstag Fire', 'Enabling Act', 'Night of the Long Knives', 'Kristallnacht', 'Nuremberg Laws', 'Edelweiss Pirates', 'Swing Youth', 'Galen', 'Bonhoeffer', 'Niemoller'] },
  // EEE
  { unit: 'eee', file: 'units/eee/data.js', terms: ['Act of Supremacy', 'Act of Uniformity', 'Papal Bull', 'excommunication', 'Northern Earls', 'Ridolfi', 'Throckmorton', 'Babington', 'Walsingham', 'Cadiz', 'singeing', 'circumnavigation', 'Virginia', 'Raleigh', 'poor law', 'theatre', 'grammar school'] },
  // USA
  { unit: 'usa', file: 'units/usa/data.js', terms: ['Brown v', 'Topeka', 'Montgomery', 'SCLC', 'SNCC', 'Dixiecrats', 'Little Rock', 'sit-in', 'Freedom Riders', 'Civil Rights Act', 'Voting Rights Act', 'Malcolm X', 'Black Panthers', 'Carmichael', 'domino theory', 'Diem', 'Strategic Hamlet', 'Gulf of Tonkin', 'Rolling Thunder', 'Search and Destroy', 'Tet Offensive', 'Vietnamisation', 'Nixon Doctrine', 'Cambodia', 'Laos', 'My Lai', 'Calley', 'Kent State', 'hard hats', 'silent majority', 'Paris Peace Agreement'] }
];

CHECK_LIST.forEach(item => {
  const fullPath = path.join(__dirname, '..', item.file);
  const content = fs.readFileSync(fullPath, 'utf8');

  console.log(`\n================================================================`);
  console.log(`UNIT: ${item.unit}`);
  console.log(`================================================================`);

  item.terms.forEach(term => {
    const re = new RegExp(term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
    
    // Count matches in the file
    const matches = (content.match(new RegExp(term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi')) || []).length;
    
    // Extract all narrative_blocks
    // Narrative blocks have "title" or "theme_heading", and "text" or "paragraphs"
    const nbBlockRegex = /\{\s*["']title["']:\s*["'][^"']+["'][\s\S]*?(?:["']text["']|["']paragraphs["'])[\s\S]*?\}(?=,\s*\{|\s*\])/g;
    
    // Simpler: find all "text": "..." or "paragraphs": [...] within narrative blocks
    const textRegex = /"text":\s*"([^"]+)"/g;
    const paraRegex = /"paragraphs":\s*\[([\s\S]*?)\]/g;
    
    let inNarrative = 0;
    let m;
    while ((m = textRegex.exec(content)) !== null) {
      if (re.test(m[1])) inNarrative++;
    }
    while ((m = paraRegex.exec(content)) !== null) {
      if (re.test(m[1])) inNarrative++;
    }

    const status = inNarrative > 0 ? `✅ (Narrative: ${inNarrative} hits, total: ${matches})` : matches > 0 ? `⚠️ (In data.js: ${matches} hits, but 0 in narrative text!)` : `🚨 COMPLETELY MISSING (0 total)`;
    console.log(`  ${term.padEnd(25)} : ${status}`);
  });
});
