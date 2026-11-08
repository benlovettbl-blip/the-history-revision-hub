const fs = require('fs');
const path = require('path');

const gwModels = {
  "1_1": "Divided into <strong>thirty-nine independent states (39 independent states)</strong>, the rise of <strong>Prussia</strong> was accelerated through economic integration under the customs union of the <strong>Zollverein</strong>.",
  "1_2": "Engineered by Bismarck through the manipulated <strong>Ems Telegram</strong>, the decisive Prussian victory at the <strong>Battle of Sedan</strong> culminated in the bitter <strong>Siege of Paris</strong>.",
  "1_3": "Under the punitive 1871 <strong>Treaty of Frankfurt</strong>, defeated France was forced to pay an indemnity of <strong>five billion gold francs (5 billion gold francs)</strong> and surrender industrial <strong>Alsace</strong>.",
  "1_4": "Fuelled by intense nationalistic <strong>Revanche</strong>, <strong>The French Republic</strong> mourned the bitter loss of <strong>Alsace-Lorraine</strong> following the Franco-Prussian War.",
  "1_5": "Noted by <strong>Benjamin Disraeli</strong>, Bismarck's primary strategic goal was to <strong>keep France diplomatically isolated to protect German peace</strong> and avoid a catastrophic <strong>war on two fronts (encirclement)</strong>.",
  "2_1": "During the intense imperial <strong>Scramble for Africa</strong>, European powers convened at the <strong>Berlin Conference (1884–1885)</strong> to establish the principle of <strong>effective occupation</strong>.",
  "2_2": "Ascending the throne, <strong>Kaiser Wilhelm II</strong> abandoned Bismarckian caution to demand a <strong>\"place in the sun\" (Platz an der Sonne)</strong> through an aggressive policy of <strong>Weltpolitik</strong>.",
  "2_3": "Testing the newly signed Anglo-French <strong>Entente Cordiale</strong>, the Kaiser landed in <strong>Morocco</strong> in 1905, triggering the diplomatic crisis known as the <strong>First Moroccan Crisis</strong>.",
  "2_4": "Convening at the 1906 <strong>Algeciras Conference</strong>, German fears of hostile <strong>Einkreisung</strong> were realized when Britain and Russia backed France among the <strong>Great Powers at Algeciras</strong>.",
  "2_5": "Demonstrating aggressive <strong>gunboat diplomacy</strong> on <strong>1 July 1911</strong>, the dispatch of the German warship <strong>SMS Panther</strong> to Morocco sparked the Second Moroccan Crisis.",
  "3_1": "Codified under the <strong>Naval Defence Act of 1889</strong>, Britain's <strong>Two-Power Standard</strong> was deemed essential to safeguard the global maritime trade of <strong>The British Empire</strong>.",
  "3_2": "Championed by <strong>Admiral Alfred von Tirpitz</strong>, the passage of the <strong>German Naval Laws</strong> aimed to build a powerful <strong>High Seas Fleet</strong> to challenge Royal Navy supremacy.",
  "3_3": "Pioneered by First Sea Lord <strong>Admiral Sir John \"Jackie\" Fisher</strong>, the revolutionary design of <strong>HMS Dreadnought</strong> instantly rendered all existing battleships obsolete with a score of <strong>Britain 1, Germany 0</strong>.",
  "3_4": "Triggering the intense <strong>1909 Naval Panic</strong>, fears over German shipbuilding led the <strong>British Public & Government</strong> to demand eight new battleships of the <strong>Dreadnought</strong> class.",
  "4_1": "Solidifying Central Europe, the 1879 <strong>Dual Alliance</strong> expanded into the 1882 <strong>Triple Alliance</strong> uniting <strong>Germany, Austria-Hungary & Italy</strong> in mutual defense.",
  "4_2": "Formed to counter German hegemony, the 1894 <strong>Franco-Russian Military Alliance</strong> was bolstered by the 1904 <strong>Entente Cordiale</strong> and the 1907 <strong>Anglo-Russian Convention</strong>.",
  "4_3": "The continuous territorial decay of the <strong>Ottoman Empire</strong> emboldened an ambitious nationalist <strong>Serbia</strong>, transforming the region into the volatile <strong>\"Balkan Powder Keg.\"</strong>",
  "4_4": "When Austria-Hungary unilaterally <strong>annexed the provinces of Bosnia and Herzegovina</strong> in 1908, it sparked intense fury between <strong>Austria-Hungary, Serbia & Russia</strong> during the Bosnian <strong>Annexation</strong> crisis.",
  "4_5": "The territorial upheavals of the <strong>First Balkan War</strong> and <strong>Second Balkan War</strong> prompted Austrian Chief of Staff <strong>Franz Conrad von Hötzendorf</strong> to urge preemptive war against Serbia.",
  "5_1": "The assassination of heir apparent <strong>Archduke Franz Ferdinand</strong> in the streets of <strong>Sarajevo</strong> was executed by Gavrilo Princip and the nationalist conspirators of <strong>Young Bosnia</strong>.",
  "5_2": "Pledging unconditional German military backing via the <strong>\"Blank Cheque\" (Blankovollmacht)</strong>, <strong>Kaiser Wilhelm II & Austria</strong> coordinated diplomatic moves that led directly to <strong>Austro-Hungarian Mobilization</strong>.",
  "5_3": "Presenting the punitive <strong>Ten-Point Ultimatum</strong> to Belgrade, the deadline expired on <strong>28 July 1914</strong> when war erupted between <strong>Austria-Hungary & Serbia</strong>.",
  "5_5": "Executing the German war strategy of the <strong>Schlieffen Plan</strong>, the invasion of neutral <strong>Belgium</strong> on <strong>3 August 1914</strong> brought the British Empire into the conflict.",
  "6_1": "In analyzing the exam question <strong>\"Why did war break out in 1914?\"</strong>, candidates write <strong>strictly three developed PEEL paragraphs</strong> while remembering that <strong>NO conclusion is required!</strong>",
  "6_2": "Under Chancellor <strong>Otto von Bismarck</strong>, the annexations imposed by the 1871 <strong>Treaty of Frankfurt</strong> created lasting French grievances over <strong>Alsace-Lorraine</strong>.",
  "6_3": "Imperial expansion during the <strong>Scramble for Africa</strong> was accelerated by Germany's pursuit of <strong>Weltpolitik</strong> to claim an imperial <strong>\"place in the sun\"</strong>.",
  "6_4": "Challenging Britain's naval supremacy under the <strong>Two-Power Standard</strong>, the launching of <strong>HMS Dreadnought</strong> accelerated the battleship arms race while reinforcing the <strong>Two-Power Standard</strong>.",
  "6_5": "The confrontation between the central European <strong>Triple Alliance</strong> and the rival <strong>Triple Entente</strong> was ignited by the assassination in Sarajevo on <strong>28 June 1914</strong>."
};

const gw2Models = {
  "1_1": "Because Britain possessed <strong>No Conscription</strong> and a peacetime <strong>BEF Just 120,000 Men</strong>, the government responded urgently to <strong>Kitchener’s Dire Call</strong> for volunteers.",
  "1_2": "Guaranteed under the <strong>1839 Treaty of London</strong>, Belgian neutrality was violated during reported <strong>German Atrocities</strong>, transforming the conflict into a moral <strong>Crusade for Law</strong>.",
  "1_3": "To encourage enlistment, local <strong>Pals Battalions Formed</strong> across northern towns, including the <strong>Pompey Pals (14th/15th Hants)</strong> who volunteered to <strong>Fight Alongside Mates</strong>.",
  "1_4": "Lured by the promise of <strong>Regular Pay & Food</strong> to <strong>Escape Factory Drudgery</strong>, thousands enlisted expecting the war would be <strong>Over by Christmas</strong>.",
  "1_5": "Promoted on Alfred Leete's <strong>Kitchener Finger Poster</strong>, social pressure was magnified by the <strong>White Feather Movement</strong>, inflicting <strong>Unbearable Social Shame</strong> on eligible men who remained at home.",
  "2_1": "Following the mobile maneuvers of the <strong>Race to the Sea</strong>, overwhelming <strong>Artillery Dominance</strong> forced both armies into an unbroken <strong>400-Mile Trench Line</strong> across France and Belgium.",
  "2_2": "Constructed in a three-tier system of <strong>Fire, Support & Reserve</strong> trenches, defenses incorporated a protective <strong>Zig-Zag Traverse Design</strong> fronted by deep <strong>Barbed Wire Belts</strong>.",
  "2_3": "Subjected to horrific conditions causing <strong>Trench Foot & Gangrene</strong> amidst decomposing <strong>Corpses, Lice & Rats</strong>, soldiers suffered profound psychological <strong>Shell Shock Trauma</strong>.",
  "2_4": "Because the preliminary <strong>7-Day Bombardment Fails</strong> to destroy wire, deep <strong>German Bunkers Intact</strong> allowed machine gunners to inflict <strong>57,470 Casualties Day 1</strong> at the Somme.",
  "2_5": "Debated as an era of <strong>Lions Led by Donkeys</strong>, British commanders adapted through an <strong>Industrial Learning Curve</strong> that culminated in the decisive <strong>Allied Victory in 1918</strong>.",
  "3_1": "Meeting in London within the <strong>Imperial War Cabinet</strong>, Britain drew upon a massive <strong>Global Manpower Pool</strong> of soldiers and labourers recruited across <strong>Dominions & Crown Colonies</strong>.",
  "3_2": "Deployed to the front, the <strong>Lahore & Meerut Divisions</strong> saved the line during the desperate <strong>First Battle of Ypres</strong>, where <strong>Khadadad Khan VC</strong> became the first South Asian recipient of the Victoria Cross.",
  "3_3": "The disastrous amphibious assault during the <strong>Dardanelles Disaster</strong> met fierce resistance from <strong>Mustafa Kemal & Turkish Defence</strong>, cementing the heroic <strong>Birth of ANZAC Legend</strong>.",
  "3_4": "Carrying heavy logistics, over <strong>140,000 Chinese Workers</strong> and the brave <strong>Carrier Corps in East Africa</strong> endured dangerous conditions and <strong>Brutal Racial Segregation</strong>.",
  "3_5": "Subjected to an institutional <strong>Imperial Colour Bar</strong>, thousands of colonial troops were buried in <strong>Mass Graves in Africa</strong>, suffering an unjust <strong>Deliberate Erasure from Memory</strong>.",
  "4_1": "Enacted in August 1914, the <strong>Defence of the Realm Act</strong> imposed <strong>Strict Press Censorship</strong> alongside wartime regulations including <strong>Curfews & Watered Beer</strong>.",
  "4_2": "Exposed by the sensational <strong>Daily Mail Shell Scandal</strong>, David Lloyd George established the new <strong>Ministry of Munitions</strong> to create <strong>State-Run National Shell Factories</strong>.",
  "4_3": "Because the meatgrinder at the <strong>Somme Demands Reserves</strong>, Parliament passed the <strong>Military Service Act 1916</strong>, introducing conscription while establishing tribunals for <strong>Conscientious Objectors</strong>.",
  "4_4": "Exposed to chemical illness like <strong>Toxic TNT Jaundice</strong> and disasters like the <strong>Silvertown Explosion (1917)</strong>, female munitions workers manufactured over <strong>80% of British Munitions</strong>.",
  "4_5": "When unrestricted <strong>U-Boats Sink Merchant Fleet</strong> tonnage leaving <strong>Only 6 Weeks Food Left</strong>, the British government introduced compulsory <strong>Sugar & Meat Ration Books</strong>.",
  "5_1": "Sparked by the naval <strong>Kiel Mutiny & Revolution</strong>, unrest spread until the <strong>Kaiser Abdicates to Holland</strong>, paving the way for the signing of the <strong>Armistice in Compiègne Wagon</strong>.",
  "5_2": "At Versailles, French leader <strong>Clemenceau Demands Revenge</strong>, clashing with <strong>Wilson’s 14 Points & League</strong> while Britain navigated <strong>Lloyd George’s Compromise</strong>.",
  "5_3": "Enraged by the humiliating <strong>Article 231 \"War Guilt\"</strong> clause and crushing <strong>£6.6 Billion Reparations</strong>, Germany protested against the strict <strong>100,000 Army Cap & Land Cuts</strong>.",
  "5_4": "Condemned for its punitive <strong>Article 231 Moral Condemnation</strong>, economist <strong>Keynes: \"Carthaginian Peace\"</strong> and political cartoonist <strong>Dyson: \"1940 Class\" Weeps</strong> warned that the treaty would ignite future war."
};

function applyModels(fileName, unitKey, models) {
  const filePath = path.join(__dirname, '../data', fileName);
  const pubFilePath = path.join(__dirname, '../public/data', fileName);
  const dbPath = path.join(__dirname, '../database.json');
  const pubDbPath = path.join(__dirname, '../public/database.json');

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updated = 0;
  data.lessons.forEach((l, li) => {
    (l.workbook_stages || l.stages || []).forEach((s, si) => {
      const key = `${li+1}_${si+1}`;
      if (models[key]) {
        s.model_sentence = models[key];
        updated++;
      }
    });
  });
  console.log(`Updated ${updated} stages in ${fileName}`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  if (fs.existsSync(pubFilePath)) {
    fs.writeFileSync(pubFilePath, JSON.stringify(data, null, 2), 'utf8');
  }
  [dbPath, pubDbPath].forEach(dbp => {
    if (fs.existsSync(dbp)) {
      const db = JSON.parse(fs.readFileSync(dbp, 'utf8'));
      db[unitKey] = data;
      fs.writeFileSync(dbp, JSON.stringify(db, null, 2), 'utf8');
      console.log(`Updated ${unitKey} in ${dbp}`);
    }
  });
}

applyModels('great_war.json', 'great_war', gwModels);
applyModels('great_war_part2.json', 'great_war_part2', gw2Models);

