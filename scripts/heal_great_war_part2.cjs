const fs = require('fs');
const path = require('path');

const gw2Clues = {
  "BEF Just 120,000 Men": "The British Expeditionary Force in August 1914 was a professional army of just 120,000 soldiers, vastly outnumbered by million-man German and French conscript armies.",
  "Kitchener’s Dire Call": "Field Marshal Lord Kitchener warned the Cabinet that the war would last at least three years, issuing an unprecedented call for 500,000 volunteers.",
  "Crusade for Law": "British moral outrage at Germany's violation of Belgian neutrality under the 1839 Treaty of London, framing the conflict as a righteous defence of international law.",
  "Fight Alongside Mates": "The popular recruitment appeal allowing friends, factory colleagues, and sports teammates to enlist and serve together in 'Pals Battalions'.",
  "Escape Factory Drudgery": "The powerful incentive for young industrial workers to trade grim factory routines and low wages for outdoor military adventure, regular pay, and travel.",
  "Kitchener Finger Poster": "Alfred Leete's iconic 1914 recruitment poster depicting Lord Kitchener pointing directly at the viewer with the slogan 'Your Country Needs YOU'.",
  "Zig-Zag Traverse Design": "Trench construction layout with 90-degree bends preventing enemy trench raiders from firing straight down the line and containing blast damage from shell bursts.",
  "7-Day Bombardment Fails": "The 1.5 million British artillery shells fired before 1 July 1916 that failed to cut German barbed wire or destroy deep German chalk dugouts.",
  "Allied Victory in 1918": "Haig's successful orchestration of the Hundred Days Offensive combining infantry, tanks, creeping barrages, and aircraft to break the Hindenburg Line.",
  "Global Manpower Pool": "The vast imperial network of four million soldiers, labourers, and resource workers mobilised from India, Africa, Canada, Australia, and the Caribbean.",
  "Dominions & Crown Colonies": "Self-governing nations (Canada, Australia, New Zealand, South Africa) and colonies whose troops fought under imperial command across European and Middle Eastern fronts.",
  "Lahore & Meerut Divisions": "The two veteran Indian Army infantry divisions rushed to Flanders in October 1914 who plugged desperate gaps at the First Battle of Ypres.",
  "Khadadad Khan VC": "Sepoy Khudadad Khan of the 129th Duke of Connaught's Own Baluchis, the first South Asian recipient of the Victoria Cross for defending his machine gun at Hollebeke.",
  "Dardanelles Disaster": "The ill-fated 1915 naval and amphibious campaign championed by Winston Churchill to seize the Gallipoli peninsula and knock Ottoman Turkey out of the war.",
  "Mustafa Kemal & Turkish Defence": "The Ottoman commander who rallied Turkish defenders at Chunuk Bair, inflicting over 250,000 casualties on Allied forces and forcing evacuation.",
  "Birth of ANZAC Legend": "The defining cultural legacy of Gallipoli that established Australia and New Zealand's national pride, courage, and mateship on the world stage.",
  "140,000 Chinese Workers": "Civilians recruited into the Chinese Labour Corps who unloaded munitions, built railways, dug trenches, and repaired roads under strict military discipline.",
  "Imperial Colour Bar": "Institutional British military racism that prohibited non-white colonial soldiers from serving as commissioned officers and restricted Black West Indian troops to manual labor.",
  "Deliberate Erasure from Memory": "The discriminatory post-war Imperial War Graves policy that left hundreds of thousands of African and Indian soldiers without named individual headstones.",
  "Strict Press Censorship": "Powers under the Defence of the Realm Act (DORA) authorising government vetting of newspapers and mail to prevent military secrets leaking and maintain civilian morale.",
  "State-Run National Shell Factories": "Over 200 state-owned munitions factories established under Minister of Munitions David Lloyd George to end the 1915 shell scandal.",
  "Somme Demands Reserves": "The catastrophic loss of 57,000 British casualties on 1 July 1916 that exhausted voluntary enlistment and necessitated the 1916 Military Service Act.",
  "Kiel Mutiny & Revolution": "German sailors at Wilhelmshaven and Kiel refusing orders to launch a suicidal final fleet sortie in late October 1918, sparking nationwide socialist councils.",
  "Kaiser Abdicates to Holland": "Kaiser Wilhelm II stepping down on 9 November 1918 and fleeing across the Dutch border as Prince Max of Baden announced the formation of a republic.",
  "Armistice in Compiègne Wagon": "The ceasefire signed at 5:00 a.m. on 11 November 1918 inside Marshal Foch's railway carriage in the Compiègne Forest, ending active combat.",
  "Lloyd George’s Compromise": "British Prime Minister balancing public demands to 'squeeze Germany until the pips squeak' with the economic necessity of preserving Germany as a trading partner against Bolshevism.",
  "Traditional: Created Hitler": "The historical argument popularized by John Maynard Keynes asserting that punitive reparations and war guilt clauses crippled the Weimar Republic and paved the way for Nazism.",
  "Fatal Failure of Enforcement": "The revisionist historical verdict arguing that Versailles was neither too harsh nor too lenient, but failed because Britain and France refused to enforce its terms in the 1930s."
};

const gw2Path = path.join(__dirname, '../data/great_war_part2.json');
const publicGw2Path = path.join(__dirname, '../public/data/great_war_part2.json');
const dbPath = path.join(__dirname, '../database.json');
const publicDbPath = path.join(__dirname, '../public/database.json');

const gw2Data = JSON.parse(fs.readFileSync(gw2Path, 'utf8'));

let updatedCount = 0;
const lessons = Array.isArray(gw2Data) ? gw2Data : (gw2Data.lessons || []);

lessons.forEach(lesson => {
  const stages = lesson.workbook_stages || lesson.stages || [];
  stages.forEach(stage => {
    const words = stage.words || stage.key_terms || [];
    words.forEach(w => {
      const term = typeof w === 'string' ? w : w.term;
      if (gw2Clues[term]) {
        w.clue = gw2Clues[term];
        updatedCount++;
      }
    });
  });
});

console.log(`Updated ${updatedCount} clues in Great War Part 2!`);

fs.writeFileSync(gw2Path, JSON.stringify(gw2Data, null, 2), 'utf8');
console.log(`Saved ${gw2Path}`);

if (fs.existsSync(publicGw2Path)) {
  fs.writeFileSync(publicGw2Path, JSON.stringify(gw2Data, null, 2), 'utf8');
  console.log(`Saved ${publicGw2Path}`);
}

if (fs.existsSync(dbPath)) {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  db.great_war_part2 = gw2Data;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log('Saved database.json (great_war_part2 key)');
}

if (fs.existsSync(publicDbPath)) {
  const pdb = JSON.parse(fs.readFileSync(publicDbPath, 'utf8'));
  pdb.great_war_part2 = gw2Data;
  fs.writeFileSync(publicDbPath, JSON.stringify(pdb, null, 2), 'utf8');
  console.log('Saved public/database.json (great_war_part2 key)');
}

console.log('Great War Part 2 healing completed successfully!');

