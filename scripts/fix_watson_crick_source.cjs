const fs = require('fs');

function fixSource(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content.replace(/^\s*export\s+default\s+/, '').replace(/;\s*$/, ''));
  const l16 = data.lessons[15];
  const sA = l16.narrative_blocks[0].sources[0];
  
  sA.title = "Source A: Watson and Crick's 1953 Demonstration Model of the DNA Double Helix";
  sA.caption = "Watson and Crick's original wire-and-sheet-metal demonstration model of the DNA double helix (1953), constructed at the Cavendish Laboratory, Cambridge, and preserved at the Science Museum, London.";
  sA.citation = "Science Museum, London (Object 1977-310 / Educational Fair Dealing).";
  
  const out = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
  fs.writeFileSync(filePath, out, 'utf8');
  console.log('Fixed', filePath);
}

fixSource('c:/Projects/the-history-revision-hub/units/edexcel_medicine/data.js');
fixSource('c:/Projects/the-history-revision-hub/public/units/edexcel_medicine/data.js');

const rightsPath = 'c:/Projects/the-history-revision-hub/scripts/master_rights_database.json';
const db = JSON.parse(fs.readFileSync(rightsPath, 'utf8'));
const med = db.units ? db.units.edexcel_medicine : null;
if (med && med.sources) {
  med.sources.forEach(s => {
    if (s.asset_path === '/images/dna_structure.jpg') {
      s.source_id = 'Source A (Scale Demonstration Model)';
      s.artifact_title = "Watson and Crick's 1953 Demonstration Model of the DNA Double Helix";
      s.accession_id = 'Science Museum Object 1977-310';
      s.source_url = 'https://collection.sciencemuseumgroup.org.uk/objects/co8084950';
    }
  });
  fs.writeFileSync(rightsPath, JSON.stringify(db, null, 2), 'utf8');
  console.log('Updated master_rights_database.json');
}
