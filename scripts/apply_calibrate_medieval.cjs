const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const updates = {
  // L2 B3
  '1_2': '<p class="prose-p"><span class="para-ref">[2.3]</span> As Norman rule stabilized, temporary timber watchtowers were replaced with massive stone keeps to project permanent imperial dominance. Along the south coast, the Normans commandeered massive 3rd-century ancient Roman walls, constructing a formidable four-storey thick limestone keep inside the Roman fort enclosure.</p><p class="prose-p">The fortress guarded a deep warship harbour in Portsmouth Harbour, securing William’s cross-Channel supply lines to Normandy and deterring French invasion fleets. The towering stone walls projected terrifying royal authority over defeated Anglo-Saxons across southern England.</p>',

  // L4 B5
  '3_4': '<p class="prose-p"><span class="para-ref">[4.5]</span> Magna Carta brought immediate war rather than peace when Pope tears up the treaty at King John’s request. Furious barons launched a rebellion, with a French prince invited in as Prince Louis marched troops into London to claim the English crown.</p><p class="prose-p">John waged a scorched-earth campaign until disaster struck, famously leaving the crown jewels lost in the Wash tidal estuary. John’s sudden death in October 1216 allowed the legendary William Marshal to reissue Magna Carta, securing the crown for nine-year-old Henry III.</p>',

  // L5 B2
  '4_1': '<p class="prose-p"><span class="para-ref">[5.2]</span> The catastrophic population collapse triggered an unprecedented economic revolution across the English countryside. Entire farming communities stood silent with empty village cottages, while overgrown fields were left abandoned with unharvested wheat rotting on the ground for lack of reapers.</p><p class="prose-p">For the first time in medieval history, surviving peasant labourers possessed immense economic bargaining power. Desperate landowners competed fiercely for workers, resulting in workers demanding double pay and boldly refusing unpaid feudal bondage, permanently shattering centuries of customary manorial control.</p>',

  // L5 B3
  '4_2': '<p class="prose-p"><span class="para-ref">[5.3]</span> Outraged by rising wages and their loss of feudal control, the landowner-dominated Parliament struck back decisively. The 1351 Statute of Labourers decreed that wages frozen by lords must remain strictly at pre-plague levels, making wage negotiation a punishable crime.</p><p class="prose-p">Runaway serfs faced imprisonment and having an iron "F" burned on foreheads for falsity to brand them as fugitive outlaws. Furthermore, 1363 Sumptuary Laws ensured commoners were banned from wearing fur, silk, or fine dyed cloth, entrenching bitter social resentment that exploded in rebellion thirty years later.</p>'
};

function applyToUnit() {
  const jsonPath = path.join(ROOT, 'data', 'medieval_england.json');
  const pubJsonPath = path.join(ROOT, 'public', 'data', 'medieval_england.json');
  const jsPath = path.join(ROOT, 'units', 'medieval_england', 'data.js');
  const pubJsPath = path.join(ROOT, 'public', 'units', 'medieval_england', 'data.js');
  const dbPath = path.join(ROOT, 'database.json');
  const pubDbPath = path.join(ROOT, 'public', 'database.json');

  const rawJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  Object.entries(updates).forEach(([key, text]) => {
    const [lIdx, bIdx] = key.split('_').map(Number);
    if (rawJson.lessons[lIdx] && rawJson.lessons[lIdx].narrative_blocks[bIdx]) {
      rawJson.lessons[lIdx].narrative_blocks[bIdx].text = text;
      if (rawJson.lessons[lIdx].narrative_blocks[bIdx].content) {
        rawJson.lessons[lIdx].narrative_blocks[bIdx].content = text;
      }
      if (rawJson.lessons[lIdx].narrative_blocks[bIdx].body) {
        rawJson.lessons[lIdx].narrative_blocks[bIdx].body = text;
      }
    }
  });

  const formattedJson = JSON.stringify(rawJson, null, 2);
  fs.writeFileSync(jsonPath, formattedJson, 'utf8');
  fs.writeFileSync(pubJsonPath, formattedJson, 'utf8');

  // data.js files
  const jsContent = 'export default ' + formattedJson + ';\n';
  fs.writeFileSync(jsPath, jsContent, 'utf8');
  fs.writeFileSync(pubJsPath, jsContent, 'utf8');

  // database.json files
  [dbPath, pubDbPath].forEach(p => {
    if (fs.existsSync(p)) {
      const db = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (db.units && db.units['medieval_england']) {
        db.units['medieval_england'].lessons = rawJson.lessons;
      } else if (db['medieval_england']) {
        db['medieval_england'].lessons = rawJson.lessons;
      }
      fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
    }
  });

  console.log('Successfully calibrated medieval_england across all 5 stores!');
}

applyToUnit();
