const fs = require('fs');

const lessonsData = [
  // Lesson 1: Claiming Australia: Captain Cook, Tupaia & The Myth of Terra Nullius (1768–1770)
  [
    // B1: ["Transit of Venus", "Secret Admiralty Orders", "Great Southern Land"]
    '<p class="prose-p"><span class="para-ref">[1.1]</span> In 1768, Lieutenant James Cook sailed aboard HMS <em>Endeavour</em> on an Enlightenment voyage funded by the Royal Society. Officially, Cook was tasked with transporting astronomer Joseph Banks to Tahiti to observe the rare transit of Venus across the Sun.</p><p class="prose-p">However, Cook carried locked secret Admiralty orders commanding him to sail south into uncharted Pacific waters. The British Crown ordered Cook to search for the legendary Great Southern Land (<em>Terra Australis</em>) and claim the territory for King George III before rival European empires could discover it.</p>',

    // B2: ["130 Pacific Islands", "Non-Instrument Navigation", "Indigenous Guidance"]
    '<p class="prose-p"><span class="para-ref">[1.2]</span> Navigating the vast Pacific required extraordinary expertise that European charts lacked. In Tahiti, Cook enlisted Tupaia, an Arioi high priest and master navigator whose Indigenous guidance proved indispensable to the British expedition.</p><p class="prose-p">Using traditional Polynesian non-instrument navigation, Tupaia read star movements, oceanic swells, bird flight paths, and cloud reflections to guide the ship safely across treacherous waters. Tupaia drafted an astonishing navigational chart showing over 130 Pacific islands across thousands of miles, while acting as an essential translator when meeting Māori communities in New Zealand.</p>',

    // B3: ["Two Gweagal Warriors", "Defensive Spear Protocol", "British Musket Fire"]
    '<p class="prose-p"><span class="para-ref">[1.3]</span> In April 1770, the <em>Endeavour</em> anchored in Botany Bay. As British rowing boats approached the shoreline, two Gweagal warriors of the Dharawal nation marched down to confront the strangers, defending their sacred country.</p><p class="prose-p">Following ancient defensive spear protocol, the warriors shouted warnings and brandished weapons to forbid entry. Interpreting this territorial defiance as unprovoked aggression, Cook responded with British musket fire, wounding one warrior in the leg. The Gweagal retreated behind the coastal dunes, leaving the landing party to plant the British flag under armed force.</p>',

    // B4: ["Torres Strait Island", "Union Jack Flag", "New South Wales Claim"]
    '<p class="prose-p"><span class="para-ref">[1.4]</span> Cook surveyed the eastern coastline for four months, navigating dangerous coral reefs along the Queensland coast. In August 1770, Cook landed on a rocky Torres Strait island off Cape York that he named Possession Island.</p><p class="prose-p">In full naval uniform, Cook hoisted the Union Jack flag and fired three volleys of musketry to formalise his New South Wales claim for King George III. In doing so, Cook violated his explicit Admiralty instructions, which strictly ordered him to take possession of new territories only with the consent of the native population.</p>',

    // B5: ["European Property Law", "No Treaties Signed", "Two Centuries Dispossession"]
    '<p class="prose-p"><span class="para-ref">[1.5]</span> Cook justified seizing the continent by describing First Nations peoples as primitive nomads who did not farm or construct towns. British jurists used these flawed accounts to declare the continent <em>terra nullius</em>—land belonging to nobody.</p><p class="prose-p">Under 18th-century European property law, legal sovereignty required fences, iron ploughs, and permanent towns. Because the British recognized no Indigenous ownership, there were no treaties signed with clan elders. This catastrophic legal fiction initiated over two centuries dispossession, stripping Aboriginal nations of ancestral land, legal sovereignty, and basic human rights.</p>'
  ],

  // Lesson 2: The First Fleet & The Convict Penal Colony (1783–1792)
  [
    // B1: ["Loss of American Colonies", "Rotting Thames Hulks", "Typhus & Overcrowding"]
    '<p class="prose-p"><span class="para-ref">[2.1]</span> For decades, Britain transported thousands of convicted felons to work on American plantations. However, the loss of American colonies after the 1783 War of Independence abruptly closed this transatlantic penal outlet, creating an acute prison crisis across Britain.</p><p class="prose-p">Under the harsh Bloody Code, British county jails overflowed with minor property offenders. Parliament converted rotting Thames hulks into floating prisons, where convicts suffered horrific typhus & overcrowding in disease-ridden holds. Desperate to relieve London’s crowded river hulks, Prime Minister William Pitt decided to establish a distant penal colony at Botany Bay.</p>',

    // B2: ["11 Sailing Ships", "750 Convicts & 250 Marines", "15,000 Miles via Cape Town"]
    '<p class="prose-p"><span class="para-ref">[2.2]</span> In May 1787, Captain Arthur Phillip was appointed Governor of New South Wales and commanded to assemble the First Fleet. Phillip prepared a convoy of 11 sailing ships carrying over 750 convicts & 250 marines to guard them.</p><p class="prose-p">The expedition sailed an arduous 15,000 miles via Cape Town and Rio de Janeiro across treacherous, uncharted oceans over eight months. Through Phillip’s strict hygiene, clean drinking water, and ventilation standards, fewer than fifty convicts died during the voyage—an astonishing maritime achievement for eighteenth-century navigation.</p>',

    // B3: ["Unprotected Botany Bay", "Port Jackson Deep Water", "Fresh Water Stream"]
    '<p class="prose-p"><span class="para-ref">[2.3]</span> In January 1788, the fleet reached its destination. Phillip was dismayed to discover an open, unprotected Botany Bay offering swampy land, shallow anchorages, and no reliable river for a permanent settlement.</p><p class="prose-p">Phillip immediately sailed north in small rowing boats to scout alternative bays, discovering Port Jackson deep water anchorages that formed the finest natural harbour in the world. Landing at Sydney Cove beside a fresh water stream, marines cleared eucalyptus trees, raised the British flag on 26 January 1788, and officially founded New South Wales.</p>',

    // B4: ["Sandy Unproductive Soil", "Broken Farming Hoes", "Shipwreck of HMS Guardian"]
    '<p class="prose-p"><span class="para-ref">[2.4]</span> The nascent penal colony plunged into desperate hardship during its first two years. Most convicts were urban thieves and weavers lacking agricultural skills, and the settlement struggled against sandy unproductive soil that ruined English seed grain.</p><p class="prose-p">Primitive farming tools snapped on tough native tree roots, leaving broken farming hoes useless in rocky ground. Famine worsened when the shipwreck of HMS Guardian on an Antarctic iceberg destroyed vital food supplies. Facing imminent starvation, Phillip slashed rations to subsistence levels and sent convicts to fertile Norfolk Island to survive.</p>',

    // B5: ["Dawn-to-Dusk Labour", "Cat-o'-Nine-Tails Lash", "30-Acre Land Grants"]
    '<p class="prose-p"><span class="para-ref">[2.5]</span> Under Governor Phillip, Sydney was run as a disciplined open-air prison. Convicts endured exhausting dawn-to-dusk labour clearing bush, quarrying sandstone, and building storehouses, while guards enforced order using the brutal cat-o\'-nine-tails lash for drunkenness or insolence.</p><p class="prose-p">However, Phillip also recognized that incentive encouraged industry. The governor awarded 30-acre land grants to industrious emancipists who completed their sentences. Former convict James Ruse successfully cultivated wheat and corn at Rose Hill, proving Australian soil could sustain British farming and leading the penal colony toward eventual agricultural self-sufficiency.</p>'
  ],

  // Lesson 3: Frontier Warfare: Smallpox, Bennelong & Pemulwuy’s Resistance (1788–1802)
  [
    // B1: ["250 Language Nations", "Fire-Stick Farming", "Songlines & Custodianship"]
    '<p class="prose-p"><span class="para-ref">[3.1]</span> For over 65,000 years, First Nations peoples lived across Australia in the world’s oldest continuous civilization. More than 250 language nations occupied distinct ancestral territories, ranging from the coastal Eora clans around Sydney to desert nations of the arid interior.</p><p class="prose-p">Aboriginal societies managed ecosystems through sophisticated fire-stick farming, deliberately burning dry grasslands to prevent catastrophic bushfires and regenerate fresh grazing for wallabies. Communities were governed by ancient Songlines & custodianship, spiritual tracks that connected ancestral dreaming, complex customary law, moral obligations, and navigational routes across country.</p>',

    // B2: ["Gal-galla Smallpox", "50–70% Eora Mortality", "Loss of Elders & Law"]
    '<p class="prose-p"><span class="para-ref">[3.2]</span> Early contact between British colonists and local clans quickly turned tense as Europeans cleared sacred bush, depleted fish stocks, and contaminated freshwater creeks. In April 1789, an apocalyptic epidemic of gal-galla smallpox struck First Nations communities.</p><p class="prose-p">Having no natural biological immunity, local clans suffered devastating 50–70% Eora mortality within weeks. Corpses floated in Sydney Harbour, and survivors abandoned infected campsites in terror. The catastrophic loss of elders & law wiped out vital knowledge, sacred stories, and community leaders, crippling Aboriginal social cohesion and ability to resist British expansion.</p>',

    // B3: ["Kidnapped by Marines", "London Voyage 1793", "Trapped Between Two Worlds"]
    '<p class="prose-p"><span class="para-ref">[3.3]</span> Seeking to establish communication with local clans, Governor Phillip ordered Aboriginal men captured. In late 1789, Wangal warrior Bennelong was kidnapped by marines and held at Government House, where he learned English and adopted European dress.</p><p class="prose-p">Bennelong acted as an indispensable cultural mediator between Phillip and Indigenous leaders, negotiating peaceful meetings. In 1792, Bennelong accompanied Phillip to England on a celebrated London voyage 1793, meeting King George III. Returning to Sydney, Bennelong found himself alienated from both British officials and his own people, remaining tragically trapped between two worlds.</p>',

    // B4: ["Bidjigal Clan Leader", "Burning Settler Farms", "Battle of Parramatta (1797)"]
    '<p class="prose-p"><span class="para-ref">[3.4]</span> While some leaders attempted diplomacy, others launched armed resistance against colonial invasion. Pemulwuy, a revered Bidjigal clan leader, united diverse Aboriginal groups across the Sydney Basin into a coordinated guerrilla resistance movement against European expansion.</p><p class="prose-p">Pemulwuy’s warriors ambushed British soldiers, speared convict cattle thieves, and retaliated against land theft by burning settler farms and destroying grain stores. In 1797, Pemulwuy led a daylight raid during the Battle of Parramatta (1797), facing British redcoats directly. Though shot multiple times, Pemulwuy survived and escaped hospital, earning legendary status among his people.</p>',

    // B5: ["Fertile Farming Invasions", "Shoot on Sight Orders", "Death of Pemulwuy (1802)"]
    '<p class="prose-p"><span class="para-ref">[3.5]</span> By the late 1790s, the frontier shifted to the Hawkesbury River. Expanding fertile farming invasions drove Dharug and Bidjigal families away from rich yam beds and fishing grounds, sparking bloody guerrilla warfare as warriors attacked isolated farmhouses.</p><p class="prose-p">Governor Philip Gidley King outlawed Indigenous warriors, issuing ruthless shoot on sight orders that permitted settlers and redcoats to kill Aboriginal people without trial. The resistance suffered a fatal blow with the death of Pemulwuy (1802) in an ambush. Pemulwuy’s severed head was shipped to London, ending the first organised frontier war.</p>'
  ],

  // Lesson 4: The Frontier Wars, Pastoral Expansion & The Black War (1803–1840)
  [
    // B1: ["Secondary Penal Colony", "Risdon Cove Cannon Fire", "Palawa Hunting Grounds"]
    '<p class="prose-p"><span class="para-ref">[4.1]</span> In 1803, the British Crown established a secondary penal colony in Van Diemen’s Land (modern Tasmania) to deter French expansion. British authorities transported repeat convicts and soldiers to an island home to around 6,000 Indigenous Palawa people.</p><p class="prose-p">Violence erupted in May 1804 when British soldiers opened Risdon Cove cannon fire upon three hundred Palawa hunters on a traditional kangaroo hunt. As pastoral sheep farmers seized fertile Palawa hunting grounds across the Tasmanian Midlands, conflict escalated into two decades of bloody retaliation, kidnapping of Aboriginal women, and frontier warfare.</p>',

    // B2: ["Governor Arthur Martial Law", "2,200 Armed Men", "The Black Line Sweeps"]
    '<p class="prose-p"><span class="para-ref">[4.2]</span> By the late 1820s, Palawa guerrilla resistance threatened British settlement across Tasmania. In response, Governor Arthur martial law was declared in 1828, authorising British forces and armed settlers to shoot Aboriginal people on sight throughout settled districts.</p><p class="prose-p">In October 1830, Arthur mobilised 2,200 armed men in a massive human cordon. Over seven weeks, the Black Line sweeps south across the island to drive surviving Palawa into the Tasman Peninsula. Costing £30,000, the operation was a tactical failure, capturing only two Palawa as warriors slipped through the dragnet.</p>',

    // B3: ["Truganini Peacemaking", "200 Exiled to Flinders", "Wybalenna Camp Sickness"]
    '<p class="prose-p"><span class="para-ref">[4.3]</span> Seeking to end the conflict without military humiliation, British missionary George Augustus Robinson enlisted Truganini peacemaking diplomacy. A Nuenonne woman whose family had been murdered by settlers, Truganini persuaded surviving Palawa clans to accept government protection.</p><p class="prose-p">However, British authorities betrayed the agreement. Around 200 exiled to Flinders Island were imprisoned in the damp, windswept settlement of Wybalenna. Plagued by depression, poor diet, and Wybalenna camp sickness, over 150 Palawa died within a decade, making Truganini an enduring symbol of tragic Palawa survival and resistance against imperial extermination.</p>',

    // B4: ["Merino Sheep Flocks", "Yorkshire Wool Demand", "Seizing Native Waterholes"]
    '<p class="prose-p"><span class="para-ref">[4.4]</span> On the Australian mainland, economic forces drove an immense land grab across New South Wales and Victoria. Industrial revolution in Britain created soaring Yorkshire wool demand, making fine Australian sheep fleece exceptionally valuable for northern textile mills.</p><p class="prose-p">Wealthy colonial pastoralists, known as squatters, pushed millions of Merino sheep flocks across the Blue Mountains into the interior. Squatters seized Indigenous country, fencing creeks and seizing native waterholes for livestock. Sheep devastated native yam daisy fields, destroying Aboriginal food supplies and triggering bitter guerrilla raids as starving clans speared grazing livestock.</p>',

    // B5: ["28 Wirrayaraay Murdered", "7 White Stockmen Hanged", "Squatter Outrage & Secrecy"]
    '<p class="prose-p"><span class="para-ref">[4.5]</span> In June 1838, frontier brutality culminated in the Myall Creek Massacre. A gang of eleven white stockmen attacked a peaceful camp of unresisting Aboriginal people, leaving 28 Wirrayaraay murdered in cold blood before burning their corpses.</p><p class="prose-p">Governor George Gipps ordered a relentless investigation, conducting two trials in Sydney that resulted in 7 white stockmen hanged for murder. This landmark verdict provoked furious squatter outrage & secrecy across colonial newspapers, ensuring future frontier massacres were hidden from colonial authorities behind a code of rural settler silence.</p>'
  ],

  // Lesson 5: The Gold Rush, Eureka Stockade & The Legacy of Colonisation (1851–1901)
  [
    // B1: ["Hargraves 1851 Discovery", "Population Triples to 1.2m", "Melbourne Victorian Wealth"]
    '<p class="prose-p"><span class="para-ref">[5.1]</span> In February 1851, Edward Hargraves announced his landmark Hargraves 1851 discovery of payable alluvial gold near Bathurst, New South Wales. Within months, vastly richer goldfields were found at Ballarat and Bendigo in Victoria, sparking one of the greatest mass migrations in imperial history.</p><p class="prose-p">Over half a million prospectors poured into Australia from Europe, America, and China. As gold fever gripped the colonies, the Australian population triples to 1.2m within a decade. Massive gold exports stimulated commerce and railways, financing magnificent Melbourne Victorian wealth that turned Melbourne into one of the British Empire’s grandest metropolises.</p>',

    // B2: ["30-Shilling Monthly Fee", "Armed Police Digger Hunts", "Taxation Without Representation"]
    '<p class="prose-p"><span class="para-ref">[5.2]</span> To fund colonial administration and control unruly diggers, Victorian authorities imposed a compulsory 30-shilling monthly fee for a mining licence, whether prospectors found gold or dug empty shafts.</p><p class="prose-p">Corrupt colonial police enforced the tax through armed police digger hunts, handcuffing miners who could not produce paperwork on demand and chaining them to trees. Miners deeply resented paying heavy taxes while having no political vote, denouncing this oppression as tyrannical taxation without representation and organising mass protest rallies at Bakery Hill in Ballarat.</p>',

    // B3: ["Southern Cross Flag", "15-Minute Dawn Assault", "Secret Ballot & Universal Suffrage"]
    '<p class="prose-p"><span class="para-ref">[5.3]</span> In late 1854, Ballarat miners formed the Reform League and built a wooden stockade at Eureka. Swearing an oath under the blue silk Southern Cross flag, diggers pledged to defend their civil liberties against military tyranny.</p><p class="prose-p">At dawn on 3 December 1854, nearly three hundred redcoats stormed the camp. A brutal 15-minute dawn assault crushed the rebellion, killing twenty-two diggers. However, public sympathy forced Victorian authorities to abolish mining licences and introduce democratic reforms, including the secret ballot & universal suffrage that founded modern Australian democracy.</p>',

    // B4: ["40,000 Chinese Diggers", "Lambing Flat Riots (1861)", "1901 Immigration Restriction Act"]
    '<p class="prose-p"><span class="para-ref">[5.4]</span> The gold rush attracted over 40,000 Chinese diggers, who worked cooperatively re-washing abandoned claims with great success. European miners reacted with intense racial hostility, accusing Chinese workers of stealing water, driving down wages, and introducing foreign vices.</p><p class="prose-p">Simmering racism exploded into violence during the Lambing Flat Riots (1861), where white mobs assaulted Chinese miners and destroyed camps. When Australian colonies federated in 1901, the new federal parliament passed the 1901 Immigration Restriction Act, creating the White Australia Policy and using language dictation tests to exclude non-European migrants.</p>',

    // B5: ["1938 Day of Mourning", "Stolen Generations Truth", "1992 Mabo Overturns Terra Nullius"]
    '<p class="prose-p"><span class="para-ref">[5.5]</span> Federation excluded Indigenous Australians from citizenship and national censuses, entrenching state child removals that created the Stolen Generations truth. Yet First Nations leaders continued fighting relentlessly for civil rights and constitutional recognition.</p><p class="prose-p">On 26 January 1938, Aboriginal activists held a historic 1938 Day of Mourning in Sydney to protest 150 years of dispossession. Sixty years later, a landmark legal victory occurred when the High Court’s 1992 Mabo overturns terra nullius ruling legally recognized Native Title, finally demolishing the legal myth of an empty continent.</p>'
  ]
];

// Check word counts and paragraphs
console.log('=== WORD COUNT & PARAGRAPH AUDIT FOR AUSTRALIA ===');
let allOk = true;
let totalWords = 0;
let blockCount = 0;

lessonsData.forEach((l, lIdx) => {
  l.forEach((bText, bIdx) => {
    blockCount++;
    const words = bText.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    totalWords += words;
    const pCount = (bText.match(/<p class="prose-p">/g) || []).length;
    const status = (words >= 75 && words <= 115 && pCount === 2) ? 'OK' : 'FAIL';
    if (status === 'FAIL') allOk = false;
    console.log(`L${lIdx+1} B${bIdx+1}: ${words}w, ${pCount} paras -> ${status}`);
  });
});
console.log(`\nAverage word count: ${(totalWords / blockCount).toFixed(1)} words/block`);
console.log('All blocks within 75-115w and exactly 2 paragraphs:', allOk);

// Trigger check against data/australia.json
const data = JSON.parse(fs.readFileSync('./data/australia.json', 'utf8'));
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'into', 'over', 'after', 
  'before', 'under', 'between', 'across', 'through', 'during', 'without', 'within', 
  'against', 'about', 'than', 'only', 'also', 'each', 'such', 'were', 'been', 
  'have', 'their', 'they', 'will', 'would', 'could', 'should', 'does', 'done', 
  'both', 'what', 'when', 'where', 'which', 'while', 'whom', 'why', 'per', 'how'
]);

let missingTotal = 0;
data.lessons.filter(l => l.workbook_stages).forEach((lesson, eIdx) => {
  const blocks = lessonsData[eIdx];
  lesson.workbook_stages.forEach((stg, sIdx) => {
    const blockText = (blocks[sIdx] || '').toLowerCase().replace(/<[^>]+>/g, ' ').replace(/['’]/g, '');
    stg.bullets.forEach(bullet => {
      const words = bullet.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
      const missing = [];
      words.forEach(w => {
        const reg = new RegExp('\\b' + w, 'i');
        if (!reg.test(blockText)) missing.push(w);
      });
      if (missing.length > 0) {
        missingTotal += missing.length;
        console.log(`GAP: E${eIdx+1} S${stg.step || sIdx+1} "${bullet}" missing: [${missing.join(', ')}]`);
      }
    });
  });
});
console.log(`Trigger check result: ${missingTotal} missing words.`);

module.exports = { lessonsData };
