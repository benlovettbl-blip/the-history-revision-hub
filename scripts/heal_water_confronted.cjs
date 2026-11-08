const fs = require('fs');
const path = require('path');

const waterModels = {
  "1_1": "Replacing the traditional <strong>Dispersed Celtic Roundhouses</strong>, the arrival of <strong>Four Imperial Legions</strong> transformed Britain into an urban society of <strong>Cramped Walled Cities</strong>.",
  "1_2": "Sourcing water from <strong>Distant Mountain Springs</strong>, Roman engineers applied a precise <strong>Mathematical Downward Gradient</strong> to channel fresh supplies into municipal <strong>Castella Water Towers</strong>.",
  "1_3": "Heated by <strong>Subterranean Hypocaust Heating</strong>, bathers cleansed themselves with <strong>Olive Oil & Bronze Strigils</strong> before cooling down in the <strong>Frigidarium Cold Plunge</strong>.",
  "1_4": "Using a shared <strong>Communal Sponge on a Stick</strong> in public latrines spread <strong>Intestinal Parasite Eggs</strong>, while domestic supplies flowed through hazardous <strong>Toxic Lead Water Pipes</strong>.",
  "1_5": "Driven more by <strong>Imperial Power & Vanity</strong> than hygiene, Roman engineering collapsed when <strong>Vanishing Roman Legions</strong> left Britain in a <strong>Thousand-Year Sanitation Void</strong>.",
  "2_1": "Following the decay of <strong>Collapsed Roman Stone Aqueducts</strong>, expanding populations in <strong>Booming Market Boroughs</strong> were forced to draw water along <strong>Unpaved Muddy Thoroughfares</strong>.",
  "2_2": "Outside <strong>Overcrowded Timber Tenements</strong>, cesspits were emptied at night by <strong>Night-Time Gong Farmers</strong>, while municipal order was enforced through <strong>Court Leet Fines & Rakers</strong>.",
  "2_3": "Equipped with sophisticated <strong>Settling Tanks & Lead Conduits</strong>, monks lived in <strong>Segregated Monastic Cloisters</strong> sustained by clean freshwater from <strong>Titchfield Abbey Fishponds</strong>.",
  "2_4": "Transmitted by <strong>Yersinia Pestis in Fleas</strong> rather than <strong>Poisonous Foul Air (Miasma)</strong>, the devastating Black Death prompted Italian city-states to introduce <strong>Forty-Day Port Quarantines</strong>.",
  "2_5": "Passing the landmark <strong>Statute of Cambridge (1388)</strong> to mandate <strong>Compulsory River Clean-Up</strong>, town records support <strong>Carole Rawcliffe Revisionism</strong> regarding medieval cleanliness.",
  "3_1": "As the <strong>National Population Doubles</strong> to four million, over <strong>500,000 London Residents</strong> were packed into towering, precarious <strong>Cantilevered Timber Tenements</strong>.",
  "3_4": "Recounting the disgust of <strong>Stepping into Neighbour’s Waste</strong> from <strong>Fractured Brick Cesspits</strong>, Samuel Pepys documented the nightly struggle of <strong>Nightsoil Men & Filth Carts</strong>.",
  "3_5": "Resulting in over <strong>100,000 Plague Fatalities</strong>, authorities quarantined houses behind <strong>Red Crosses & Watchmen</strong>, while terrified citizens relied on <strong>Pounding Tobacco & Pomanders</strong>.",
  "4_1": "The rapid expansion of <strong>Steam-Powered Factory Boomtowns</strong> forced industrial workers into <strong>Unventilated Back-to-Back Slums</strong> sharing pestilential, <strong>Shared Overflowing Privy Middens</strong>.",
  "4_2": "Arriving at the <strong>Sunderland Baltic Shipping Port</strong> in 1831, cholera caused <strong>52,000 Dehydration Fatalities</strong> while doctors burned useless <strong>Tar Barrels & Miasma Fallacy</strong> defenses.",
  "4_3": "Published in 1842, <strong>Chadwick's Sanitary Report 1842</strong> demonstrated that <strong>Poverty Caused by Slum Filth</strong> required state intervention, though Parliament only passed the <strong>Permissive 1848 Public Health Act</strong>.",
  "4_4": "With over <strong>200,000 Flushing Water Closets</strong> emptying into the stifling <strong>Fermenting Thames Sludge 35°C</strong>, an alarmed <strong>Parliament Panic & £3m Grant</strong> funded Joseph Bazalgette's sewers.",
  "4_5": "Constructing <strong>82 Miles Intercepting Sewers</strong> with <strong>318 Million Bricks & Portland Cement</strong>, Bazalgette relied on a continuous <strong>Gravity Gradient & Eastney Pumping</strong> system.",
  "5_1": "Striking the crowded <strong>Soho Broad Street Epicentre</strong> with <strong>Over 500 Deaths in Ten Days</strong>, the outbreak was initially blamed on <strong>Entrenched Miasma Medical Dogma</strong>.",
  "5_2": "Plotting cholera fatalities on his <strong>Empirical Cholera Spot Map</strong>, Dr Snow observed fatal <strong>Broad Street Pump Clustering</strong> while noting that workers at the <strong>Lion Brewery Zero Fatalities</strong> drank only beer.",
  "5_3": "After parish vestrymen <strong>Removed Broad Street Pump Handle</strong>, inspectors traced the source to <strong>Infant Frances Lewis at No. 40</strong> leaking from <strong>Fractured Brickwork & Leaking Cesspool</strong>.",
  "5_5": "Replacing optional guidelines with mandatory health duties, the <strong>Public Health Act 1875</strong> required <strong>Compulsory Municipal Officers & Water</strong>, cementing the definitive <strong>End of Laissez-Faire Ideology</strong>.",
  "6_1": "To answer <strong>\"Explain why there was rapid progress in Public Health between 1800 and 1900.\"</strong>, students structure <strong>three developed PEEL paragraphs</strong> leading to an <strong>evaluative conclusion</strong>.",
  "6_5": "Passed under Prime Minister <strong>Benjamin Disraeli & Parliament</strong>, the landmark <strong>Public Health Act of 1875</strong> made sanitation duties strictly <strong>compulsory</strong> nationwide."
};

const filePath = path.join(__dirname, '../data/water_and_sanitation.json');
const pubFilePath = path.join(__dirname, '../public/data/water_and_sanitation.json');
const dbPath = path.join(__dirname, '../database.json');
const pubDbPath = path.join(__dirname, '../public/database.json');

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let updated = 0;
data.lessons.forEach((l, li) => {
  (l.workbook_stages || l.stages || []).forEach((s, si) => {
    const key = `${li+1}_${si+1}`;
    if (waterModels[key]) {
      s.model_sentence = waterModels[key];
      updated++;
    }
  });
});

console.log(`Updated ${updated} model sentences in Water and Sanitation.`);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
if (fs.existsSync(pubFilePath)) {
  fs.writeFileSync(pubFilePath, JSON.stringify(data, null, 2), 'utf8');
}

[dbPath, pubDbPath].forEach(p => {
  if (fs.existsSync(p)) {
    const db = JSON.parse(fs.readFileSync(p, 'utf8'));
    db.water_and_sanitation = data;
    fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated water_and_sanitation in ${p}`);
  }
});

