const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database.json');
const publicDbPath = path.join(__dirname, '../public/database.json');

const db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf8')) : null;
const pdb = fs.existsSync(publicDbPath) ? JSON.parse(fs.readFileSync(publicDbPath, 'utf8')) : null;

function saveUnit(filename, unitKey, unitData) {
  const p1 = path.join(__dirname, '../data', filename);
  const p2 = path.join(__dirname, '../public/data', filename);
  
  fs.writeFileSync(p1, JSON.stringify(unitData, null, 2), 'utf8');
  console.log(`Saved ${p1}`);
  if (fs.existsSync(p2)) {
    fs.writeFileSync(p2, JSON.stringify(unitData, null, 2), 'utf8');
    console.log(`Saved ${p2}`);
  }
  if (db && unitKey && db[unitKey]) {
    db[unitKey] = unitData;
  }
  if (pdb && unitKey && pdb[unitKey]) {
    pdb[unitKey] = unitData;
  }
}

// 1. water_and_sanitation.json
const water = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/water_and_sanitation.json'), 'utf8'));
(water.lessons || []).forEach(l => {
  (l.workbook_stages || l.stages || []).forEach(s => {
    (s.words || s.key_terms || []).forEach(w => {
      if (w.term === 'Valve-Operated Cistern') {
        w.clue = "Sir John Harington's mechanical flushing water closet designed in 1596 using a gravity-fed cistern and flush valve, which failed to spread widely due to the lack of municipal sewage networks.";
      }
    });
  });
});
saveUnit('water_and_sanitation.json', 'water_and_sanitation', water);

// 2. monarchy_religion_power.json
const mrp = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/monarchy_religion_power.json'), 'utf8'));
(mrp.lessons || []).forEach(l => {
  (l.workbook_stages || l.stages || []).forEach(s => {
    (s.words || s.key_terms || []).forEach(w => {
      if (w.term === 'Elizabeth I & House of Lords') {
        w.clue = "Elizabeth I negotiated with the conservative Catholic peers in the House of Lords to secure passage of the 1559 Elizabethan Religious Settlement.";
      }
      if (w.term === 'Lord Howard, Drake & Atlantic Gales') {
        w.clue = "English naval commanders Lord Howard and Francis Drake capitalized on the 'Protestant Wind' and fireships at Gravelines to disrupt the Spanish Armada.";
      }
      if (w.term === 'Lasting Consequence' && s.heading && s.heading.includes('New Model Army')) {
        w.term = 'Parliamentary Victory at Naseby';
        w.clue = "The decisive defeat of Charles I's royalist forces by Oliver Cromwell and Sir Thomas Fairfax's disciplined New Model Army in June 1645.";
        if (s.model_sentence && s.model_sentence.includes('Lasting Consequence')) {
          s.model_sentence = s.model_sentence.replace('Lasting Consequence', 'Parliamentary Victory at Naseby');
        }
      }
      if (w.term === 'Elizabeth I & Elizabethan Parliaments') {
        w.clue = "Queen Elizabeth I summoned ten Parliaments during her 44-year reign, managing intense debates over taxation, religion, and the royal succession.";
      }
    });
  });
});
saveUnit('monarchy_religion_power.json', 'monarchy_religion_power', mrp);

// 3. great_war.json
const gw = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/great_war.json'), 'utf8'));
(gw.lessons || []).forEach(l => {
  (l.workbook_stages || l.stages || []).forEach(s => {
    (s.words || s.key_terms || []).forEach(w => {
      if (w.term === 'The French Republic') {
        w.clue = "The French Third Republic, driven by the revanchist desire to recover the lost provinces of Alsace and Lorraine ceded to Germany after the Franco-Prussian War.";
      }
      if (w.term === 'The British Empire') {
        w.clue = "Britain's global maritime empire, protected by the Royal Navy's Two-Power Standard ensuring its fleet exceeded the combined strength of the next two naval rivals.";
      }
      if (w.term === 'Lasting Consequence' && s.heading && s.heading.includes('Blank Cheque')) {
        w.term = 'Austro-Hungarian Mobilization';
        w.clue = "Emboldened by Germany's unconditional 'blank cheque', the Austro-Hungarian empire drafted a draconian ultimatum to crush Serbian sovereignty.";
        if (s.model_sentence && s.model_sentence.includes('Lasting Consequence')) {
          s.model_sentence = s.model_sentence.replace('Lasting Consequence', 'Austro-Hungarian Mobilization');
        }
      }
      if (w.term === 'Austria-Hungary & Serbia') {
        w.clue = "Austria-Hungary's declaration of war on Serbia on 28 July 1914 following Serbia's rejection of Point 6 of the July Ultimatum, triggering European alliance mobilizations.";
      }
      if (w.term === 'Two-Power Standard:') {
        w.term = 'Two-Power Standard';
      }
    });
  });
});
saveUnit('great_war.json', 'great_war', gw);

if (db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log('Synchronized database.json');
}
if (pdb) {
  fs.writeFileSync(publicDbPath, JSON.stringify(pdb, null, 2), 'utf8');
  console.log('Synchronized public/database.json');
}
console.log('Healed 3 small files successfully!');

