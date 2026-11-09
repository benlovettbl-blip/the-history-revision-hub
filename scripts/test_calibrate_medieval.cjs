const fs = require('fs');

const d = JSON.parse(fs.readFileSync('./data/medieval_england.json', 'utf8'));

// Calibrated versions for the 4 targeted blocks:
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

// Check all 25 blocks after applying updates
let totalWords = 0;
let blockCount = 0;
let fails = 0;

d.lessons.forEach((l, lIdx) => {
  l.narrative_blocks.forEach((b, bIdx) => {
    blockCount++;
    const key = `${lIdx}_${bIdx}`;
    const text = updates[key] || b.text;
    const words = text.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    totalWords += words;
    const isOk = (words >= 75 && words <= 115);
    if (!isOk) fails++;
    console.log(`L${lIdx+1} B${bIdx+1}: ${words}w -> ${isOk ? 'OK' : 'FAIL'}`);
  });
});

console.log(`\nAverage word count: ${(totalWords / blockCount).toFixed(1)}w`);
console.log(`Blocks failing 75-115w range: ${fails}`);

// Trigger check
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'into', 'over', 'after', 
  'before', 'under', 'between', 'across', 'through', 'during', 'without', 'within', 
  'against', 'about', 'than', 'only', 'also', 'each', 'such', 'were', 'been', 
  'have', 'their', 'they', 'will', 'would', 'could', 'should', 'does', 'done', 
  'both', 'what', 'when', 'where', 'which', 'while', 'whom', 'why', 'per', 'how'
]);

let missingTotal = 0;
d.lessons.forEach((l, lIdx) => {
  l.workbook_stages.forEach((stg, sIdx) => {
    const key = `${lIdx}_${sIdx}`;
    const bText = (updates[key] || l.narrative_blocks[sIdx].text).toLowerCase().replace(/<[^>]+>/g, ' ');
    stg.bullets.forEach(bullet => {
      const words = bullet.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
      const missing = [];
      words.forEach(w => {
        const reg = new RegExp('\\b' + w, 'i');
        if (!reg.test(bText)) missing.push(w);
      });
      if (missing.length > 0) {
        missingTotal += missing.length;
        console.log(`GAP: L${lIdx+1} S${stg.step || sIdx+1} "${bullet}" missing: [${missing.join(', ')}]`);
      }
    });
  });
});
console.log(`Trigger check result: ${missingTotal} missing words.`);
