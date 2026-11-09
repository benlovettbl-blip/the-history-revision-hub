const fs = require('fs');

const d = JSON.parse(fs.readFileSync('./data/water_and_sanitation.json', 'utf8'));

const updates = {
  // L1 B1
  '0_0': '<p class="prose-p"><span class="para-ref">[1.1]</span> Before the Roman conquest, Iron Age Britain was an agrarian society of small farming settlements and dispersed Celtic roundhouses. Waste disposal was simple and sustainable: families dug shallow cesspits in open fields that composted naturally into manure without poisoning freshwater streams or shallow wells.</p><p class="prose-p">Everything changed in AD 43 when Emperor Claudius invaded with four imperial legions. The Romans established cramped walled cities like Londinium (London) and Eboracum (York), packing thousands of soldiers and civilians together. Without municipal water engineering, urban populations faced catastrophic collapse from waterborne epidemics.</p>',

  // L1 B2
  '0_1': '<p class="prose-p"><span class="para-ref">[1.2]</span> Roman engineers solved urban water shortages through mastery of gravity hydraulics. Because local rivers became fouled with urban filth, engineers surveyed distant mountain springs and hills to capture pure upland water supplies for growing provincial cities.</p><p class="prose-p">Engineers constructed massive stone aqueducts built on a precise mathematical downward gradient, channeling millions of gallons into castella water towers. From these storage reservoirs, lead and terracotta pipes distributed pressurized water across towns, prioritizing public street fountains, communal thermae baths, and wealthy private villas.</p>',

  // L1 B3
  '0_2': '<p class="prose-p"><span class="para-ref">[1.3]</span> The centerpiece of Roman urban hygiene was the communal public bathhouse (thermae), open to all citizens for a tiny copper coin. Bathers coated their skin in olive oil & bronze strigils were used by enslaved attendants to scrape away accumulated sweat and grime.</p><p class="prose-p">Bathers moved between heated steam chambers and the invigorating frigidarium cold plunge pool to close their pores. An ingenious subterranean hypocaust heating system circulated furnace heat beneath suspended mosaic floors, making public baths essential civic hubs where Romans exercised, socialised, and washed.</p>',

  // L1 B4
  '0_3': '<p class="prose-p"><span class="para-ref">[1.4]</span> Roman towns featured communal stone latrines flushed continuously by bathhouse wastewater, where citizens sat together without privacy cubicles. For cleaning, Romans shared a communal sponge on a stick (tersorium), rinsed in a running saltwater floor channel between users.</p><p class="prose-p">Despite monumental engineering, archaeological excavations reveal widespread contamination. Warm bath water was rarely changed, exposing bathers to microscopic intestinal parasite eggs that spread whipworm and dysentery. Furthermore, drinking water delivered through toxic lead water pipes caused chronic plumbism poisoning among urban populations.</p>',

  // L1 B5
  '0_4': '<p class="prose-p"><span class="para-ref">[1.5]</span> Modern historians judge Roman sanitation as a reflection of imperial power & vanity rather than modern medical understanding. Roman governors constructed monumental aqueducts and marble baths primarily to project Romanitas and civilised prestige across newly conquered barbarian provinces.</p><p class="prose-p">The fatal flaw of Roman hygiene was its total dependence on centralized imperial administration. When vanishing Roman legions withdrew from Britain in AD 410, complex maintenance collapsed, leaving a thousand-year sanitation void as urban aqueducts decayed into overgrown rubble.</p>',

  // L2 B2
  '1_1': '<p class="prose-p"><span class="para-ref">[2.2]</span> In medieval towns like London, York, and Coventry, municipal corporations fought a constant battle to manage waste. Narrow streets were lined with overcrowded timber tenements, where families constructed wooden privies over private backyard cesspits.</p><p class="prose-p">To prevent overflows, householders paid night-time gong farmers to shovel human excrement into barrels for rural crop fertiliser. Town bailiffs appointed municipal rakers to clear street rubbish, while Court Leet fines & rakers punished butchers and tanners who dumped offal into public thoroughfares.</p>',

  // L2 B3
  '1_2': '<p class="prose-p"><span class="para-ref">[2.3]</span> The sharpest contrast to crowded town squalor existed inside medieval religious houses. Monasteries engineered superior water infrastructure, with settling tanks & lead conduits carrying pure spring water from distant hills directly into monastic kitchens, infirmaries, and latrines.</p><p class="prose-p">Monks lived in segregated monastic cloisters shielded from outside contagion, designing multi-stage filtration where water flushed latrines built over running rivers. Establishments like Titchfield Abbey fishponds and Canterbury Priory managed advanced fisheries and clean running conduits, combining immense monastic wealth with technical literacy.</p>',

  // L2 B5
  '1_4': '<p class="prose-p"><span class="para-ref">[2.5]</span> Modern historians like Carole Rawcliffe have pioneered Carole Rawcliffe revisionism, demonstrating that medieval civic leaders actively fought urban filth. In 1388, Parliament passed the landmark Statute of Cambridge (1388), introducing compulsory river clean-up laws that levied massive £20 fines for dumping animal entrails into waterways.</p><p class="prose-p">In Coventry, town officials banned waste dumping in the River Sherbourne and constructed designated municipal waste dumps outside town walls. Medieval sanitation struggled not from civic apathy, but because town bailiffs lacked police power to enforce regulations across rapidly growing populations.</p>',

  // L3 B2
  '2_1': '<p class="prose-p"><span class="para-ref">[3.2]</span> In 1596, Queen Elizabeth’s godson, Sir John Harington, invented the world’s first flushing water closet, known as the \'Ajax\'. Harington installed a working model at Richmond Palace, designing an ingenious valve-operated cistern that released water to wash waste into a basement vault.</p><p class="prose-p">However, the invention failed to transform Tudor society. The total absence of running water mains and town sewer networks meant the flush toilet remained an isolated royal curiosity. Ordinary Elizabethans continued relying on pottery chamber pots and wooden close-stools for another two centuries.</p>',

  // L3 B3
  '2_2': '<p class="prose-p"><span class="para-ref">[3.3]</span> As London’s medieval parish wells became dangerously polluted by expanding cesspits, wealthy commercial entrepreneurs stepped forward. In 1609, goldsmith and financier Sir Hugh Myddelton funded the construction of the New River to bring clean water to the expanding capital.</p><p class="prose-p">Myddelton engineered an ambitious 38-mile man-made canal, bringing fresh spring water from Hertfordshire to Islington. Water was distributed across London through a pioneering network of hollowed elm tree trunk pipes, providing reliable drinking water to wealthy subscribers and civic conduit fountains.</p>',

  // L3 B4
  '2_3': '<p class="prose-p"><span class="para-ref">[3.4]</span> The grim reality of seventeenth-century domestic sanitation is vividly recorded in Samuel Pepys’s famous diary. In October 1660, Pepys suffered the horrific ordeal of stepping into neighbour’s waste when entering his basement, discovering a neighbour\'s overflowing privy had flooded into his cellar.</p><p class="prose-p">Because urban cellars were poorly constructed, fractured brick cesspits routinely cracked and leaked raw sewage into adjoining properties and shallow drinking wells. Householders had to pay nightsoil men & filth carts to shovel out subterranean cesspools at midnight and cart foul waste beyond city walls.</p>',

  // L6 B3
  '5_2': '<p class="prose-p"><span class="para-ref">[6.3]</span> The second vital catalyst in Victorian sanitation was large-scale civil engineering spearheaded by Sir Joseph Bazalgette. Following the installation of 200,000 water closets, the River Thames was turned into a foul open sewer, triggering The Great Stink in June 1858.</p><p class="prose-p">Terrified by the suffocating stench rising into Parliament, politicians abandoned laissez-faire inertia and funded £3 million for London’s drainage. Bazalgette directed navvies to construct eighty-two miles of underground brick intercepting sewers, transporting 420 million gallons of sewage daily past the capital and permanently eradicating cholera from London.</p>',

  // L6 B5
  '5_4': '<p class="prose-p"><span class="para-ref">[6.5]</span> The fourth indispensable catalyst was political legislation, culminating in the Public Health Act of 1875 passed under Prime Minister Benjamin Disraeli & Parliament. While Edwin Chadwick’s 1848 Act had failed because health boards were permissive, working-class male enfranchisement in 1867 forced politicians to act.</p><p class="prose-p">The 1875 statute made public health compulsory nationwide: every local authority was legally required to appoint a medical officer of health, pave streets, collect refuse, and provide clean piped water. This decisive legislation ended government indifference, ensuring engineering and scientific advances protected all citizens.</p>'
};

// Check all 30 blocks after applying updates
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

module.exports = { updates };
