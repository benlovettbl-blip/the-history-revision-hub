const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

function cleanHtml(str) {
  if (!str) return '';
  return str
    .replace(/&bull;/g, '•')
    .replace(/&amp;/g, '&')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\\'/g, "'")
    .trim();
}

function parseGoldStandardMission(rawStr, defaultPageRef = 'Workbook Centrefold • pp. 8–9') {
  let str = cleanHtml(rawStr);

  // Extract milestone badge (e.g. "Milestones 1 & 2 (1517–1540)")
  const badgeMatch = str.match(/<strong>([^<]+):<\/strong>/i) || str.match(/^([^:]+):/);
  const milestoneBadge = badgeMatch ? cleanHtml(badgeMatch[1]).trim() : 'Centrefold Milestone';
  const dateMatch = milestoneBadge.match(/\(([^)]+)\)/);
  const date = dateMatch ? dateMatch[1].trim() : '';

  // Split strictly at • OR •
  const parts = str.split(/\s*(?:&bull;|•)\s*OR\s*(?:&bull;|•)\s*/i);
  let choiceAPart = parts[0] || '';
  let choiceBPart = parts[1] || '';

  // Parse Choice A
  let sketchPrompt = '';
  let sketchIdeas = [];
  const sketchMatch = choiceAPart.match(/Choose\s*(?:<strong>)?\(A\)\s*Creative Sketch:(?:<\/strong>)?\s*([\s\S]*)/i);
  if (sketchMatch) {
    let aBody = sketchMatch[1].trim();
    const tokenMatch = aBody.match(/\[([\s\S]*?)\]/);
    if (tokenMatch) {
      sketchIdeas = tokenMatch[1].split(/(?:&bull;|•)/).map(s => cleanHtml(s).trim()).filter(Boolean);
      sketchPrompt = cleanHtml(aBody.replace(/\[[\s\S]*?\]/, '').replace(/<[^>]+>/g, '').trim());
    } else {
      sketchPrompt = cleanHtml(aBody.replace(/<[^>]+>/g, '').trim());
    }
  }

  // Parse Choice B
  let conceptTitle = '';
  let branches = [];
  const mindMapMatch = choiceBPart.match(/(?:(?:<strong>)?\(B\)\s*Mind Map:(?:<\/strong>)?)\s*"?([^"(]+)"?\s*\(([\s\S]*?)\)\.?\s*$/i);
  if (mindMapMatch) {
    conceptTitle = cleanHtml(mindMapMatch[1].replace(/<[^>]+>/g, '').trim().replace(/^"|"$/g, ''));
    const rawBranches = mindMapMatch[2];
    const branchItems = rawBranches.split(/,\s*(?![0-9])(?![^()]*\))/).map(b => cleanHtml(b).trim()).filter(Boolean);
    branches = branchItems.map(item => ({
      label: '',
      value: item
    }));
  }

  return {
    milestoneBadge,
    date,
    sketchPrompt,
    sketchIdeas,
    conceptTitle,
    branches,
    pageRef: defaultPageRef,
    fullMissionText: cleanHtml(str).replace(/<[^>]+>/g, '').trim()
  };
}

function extractGoldStandardUnit(scriptRelPath, titles, descs, defaultPageRef = 'Workbook Centrefold • pp. 8–9') {
  const fullPath = path.join(ROOT_DIR, scriptRelPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const matches = [...content.matchAll(/timelineMission:\s*\n?\s*['`]([\s\S]*?)['`](?=,\s*\n\s*(?:partA|leftPageQuip|did_you_know|\}))/g)];
  return matches.map((m, i) => {
    const p = parseGoldStandardMission(m[1], defaultPageRef);
    return {
      lessonIndex: i,
      lessonId: `lesson_${i + 1}`,
      milestoneBadge: p.milestoneBadge,
      date: p.date,
      title: titles[i] || p.conceptTitle || 'Milestone',
      pageRef: p.pageRef,
      desc: descs[i] || '',
      sketchPrompt: p.sketchPrompt,
      sketchIdeas: p.sketchIdeas,
      conceptTitle: p.conceptTitle || titles[i] || 'Concept Map',
      branches: p.branches,
      fullMissionText: p.fullMissionText
    };
  });
}

const WORKBOOK_TIMELINE_DATA = {};

// -------------------------------------------------------------
// 1. MEDIEVAL ENGLAND (1066–1381) • 16-Page Pupil Workbook
// -------------------------------------------------------------
WORKBOOK_TIMELINE_DATA.medieval_england = extractGoldStandardUnit(
  'scripts/render_medieval_england_workbook.cjs',
  [
    'The Battle of Hastings & Norman Conquest',
    'Norman Subjugation & Domesday Survey',
    'Crown vs Church: The Becket Crisis',
    'Magna Carta & Simon de Montfort’s Parliament',
    'The Black Death & The Peasants’ Revolt'
  ],
  [
    'Following victory over Vikings at Stamford Bridge, Harold’s exhausted army forms a shield wall atop Senlac Hill; Norman cavalry feigned retreats shatter the line, Harold is killed, and Duke William seizes the crown.',
    'William crushes Anglo-Saxon resistance by systematically burning crops, salting fields, and slaughtering livestock across Yorkshire, starving over 100,000 people while erecting 500 timber motte castles and commissioning the exhaustive Domesday tax audit.',
    'Following a bitter clash over whether royal courts or church courts could try criminal priests, four of Henry II’s knights butcher Archbishop Becket on the cathedral altar steps; Becket’s shrine becomes Christendom’s greatest pilgrimage.',
    'Bankrupted by military defeat at Bouvines, King John is forced by rebel barons at Runnymede to seal Magna Carta; Clause 39 guarantees that no free man can be imprisoned without lawful trial, leading to Simon de Montfort summoning the first elected Commons.',
    'The Black Death wipes out nearly half of England’s population, triggering a severe labour shortage that empowers peasants to demand higher cash wages; Parliament’s oppressive Poll Tax sparks the 1381 Peasants’ Revolt.'
  ],
  'Workbook Centrefold • pp. 8–9'
);

// -------------------------------------------------------------
// 2. MONARCHY, RELIGION & POWER (1509–1689) • 20-Page Pupil Workbook
// -------------------------------------------------------------
WORKBOOK_TIMELINE_DATA.monarchy_religion_power = extractGoldStandardUnit(
  'scripts/render_monarchy_religion_power_workbook.cjs',
  [
    'The Reformation & Royal Supremacy',
    'The Elizabethan Middle Way',
    'The Spanish Armada & Standoff',
    'Road to Regicide & Civil War',
    'The Glorious Revolution & Constitutional Monarchy'
  ],
  [
    'Martin Luther sparks the European Reformation against church corruption; King Henry VIII breaks with Rome over his annulment, declaring himself Supreme Head of the Church of England and dissolving 800 monasteries.',
    'Queen Elizabeth I establishes the Elizabethan Religious Settlement via the 1559 Act of Supremacy and Uniformity, navigating a middle way (\'via media\') between Protestant reform and Catholic tradition.',
    'Philip II launches the 130-ship Spanish Armada to restore Catholicism to England; English fireships at Calais scatter the crescent fleet, followed by the decisive battle of Gravelines and the Protestant Wind.',
    'Charles I\'s eleven years of Personal Rule and religious innovations trigger the English Civil War, culminating in Cromwell\'s New Model Army victory at Naseby and the public execution of the King.',
    'Fearing a Catholic dynasty under James II, the Immortal Seven invite William of Orange to stage a Dutch invasion; Parliament presents the 1689 Bill of Rights, establishing constitutional monarchy.'
  ],
  'Workbook Centrefold • pp. 8–9'
);

// -------------------------------------------------------------
// 3. GREAT WAR PART 2 (1914–1919) • 16-Page Pupil Workbook
// -------------------------------------------------------------
WORKBOOK_TIMELINE_DATA.great_war_part2 = extractGoldStandardUnit(
  'scripts/render_great_war_part2_twopage_workbook.cjs',
  [
    'Kitchener’s Call & Pals Battalions',
    'The Somme Offensive & The First Tanks',
    'Empire Soldiers on the Western Front & Gallipoli',
    'The Home Front: Munitionettes & Conscription',
    'The Hundred Days, Armistice & Versailles'
  ],
  [
    'Lord Kitchener’s iconic finger-pointing poster mobilises 750,000 volunteers in eight weeks; men enlist together in civic Pals Battalions (including the Pompey Pals), driven by patriotism and social pressure.',
    'On 1 July 1916, Britain suffers 57,470 casualties on the first day of the Somme after artillery fails to cut German barbed wire; in September at Flers-Courcelette, Britain deploys the rhomboid Mark I tank to break trench deadlock.',
    'Over 1.5 million Indian soldiers and ANZAC troops fight across Flanders and Gallipoli; colonial regiments endure lethal conditions, earning Victoria Crosses while securing critical imperial supply lines.',
    'Over one million women enter munitions factories as "Canary Girls", handling toxic TNT to manufacture 80% of British shells; German U-boat blockades force strict national rationing while Parliament introduces conscription.',
    'Allied combined-arms tactics breach the Hindenburg Line in the Hundred Days Offensive, forcing Germany to sign the Armistice in Foch’s railway carriage on 11 November 1918 before signing the punitive Treaty of Versailles.'
  ],
  'Workbook Centrefold • pp. 8–9'
);

// -------------------------------------------------------------
// 4. AUSTRALIA (1770–1901) • 16-Page Pupil Workbook
// -------------------------------------------------------------
WORKBOOK_TIMELINE_DATA.australia = extractGoldStandardUnit(
  'scripts/render_australia_workbook.cjs',
  [
    'First Nations Sovereignty & The First Fleet',
    'The 1789 Smallpox Catastrophe',
    'Pemulwuy’s Bidjigal Frontier Resistance',
    'The Black War & The Myall Creek Massacre',
    'The Gold Rush & The Eureka Stockade'
  ],
  [
    'Captain James Cook claims the eastern coast under the legal fiction of terra nullius; in 1788, Governor Arthur Phillip lands the First Fleet at Sydney Cove, dispossessing the Eora people and establishing a penal colony.',
    'In 1789, a catastrophic outbreak of smallpox (gal-galla) decimates the Eora population around Sydney, killing 50–70% of Indigenous people and shattering traditional leadership, spiritual lore, and clan structures.',
    'Bidjigal warrior Pemulwuy leads a twelve-year guerrilla resistance campaign against British colonial expansion across the Hawkesbury and Parramatta, burning colonial crops and defying musket fire until his betrayal in 1802.',
    'In Van Diemen’s Land, Governor Arthur declares martial law and orders the 1830 Black Line; in New South Wales, the 1838 Myall Creek Massacre results in the unprecedented trial and execution of white stockmen for murdering Indigenous people.',
    'The 1851 gold rush transforms the Australian economy; oppressive monthly mining licence fees spark the 1854 Eureka Stockade rebellion in Ballarat, leading directly to the introduction of the secret ballot and democratic reform.'
  ],
  'Workbook Centrefold • pp. 8–9'
);

// -------------------------------------------------------------
// 5. SECOND BRITISH EMPIRE (1783–1914) • 16-Page Pupil Workbook
// -------------------------------------------------------------
WORKBOOK_TIMELINE_DATA.second_british_empire = extractGoldStandardUnit(
  'scripts/render_second_british_empire_workbook.cjs',
  [
    'Pax Britannica & Naval Supremacy',
    'De-industrialisation of India & Textiles',
    'The 1857 Indian Rebellion & British Raj',
    'The Scramble for Africa & Maxim Guns',
    'The Workshop of the World & Naoroji’s Drain of Wealth'
  ],
  [
    'Following Trafalgar, Portsmouth Royal Dockyard becomes the industrial beating heart of empire, constructing ironclad steam warships like HMS Warrior to enforce global Pax Britannica under the Two-Power Standard.',
    'Colonial tariffs and industrial steam mills collapse India’s share of global textiles from 25% to under 2%, reducing proud Dhaka muslin weavers to destitution as Britain floods the subcontinent with Lancashire cotton.',
    'Enfield rifle cartridges greased with cow and pig fat trigger a massive military insurrection across northern India; Rani Lakshmibai leads the defense of Jhansi before Britain dissolves the East India Company to establish direct Crown rule.',
    'European imperial powers meet at the 1884 Berlin Conference to partition Africa under "effective occupation"; Hiram Maxim’s automatic machine gun gives small colonial forces overwhelming military lethality across the continent.',
    'The 1851 Great Exhibition showcases Britain as the manufacturing titan of the globe, while Dadabhai Naoroji proves that colonial rule drains £20–30 million annually out of India, triggering devastating famines.'
  ],
  'Workbook Centrefold • pp. 8–9'
);

// -------------------------------------------------------------
// 6. THE SHOAH (1933–1945) • 20-Page Pupil Workbook
// -------------------------------------------------------------
WORKBOOK_TIMELINE_DATA.the_shoah = extractGoldStandardUnit(
  'scripts/render_the_shoah_workbook.cjs',
  [
    'Jewish Life Before the War & Cultural Heritage',
    'The Escalation of Persecution & Nuremberg Laws',
    'Ghettos, Starvation & Clandestine Defiance',
    'The Holocaust by Bullets & Einsatzgruppen',
    'Industrial Annihilation & Camp Resistance',
    'Rescue, Resistance & The Righteous Among the Nations',
    'Liberation, Displaced Persons & The Pursuit of Justice'
  ],
  [
    'Across Europe, over nine million Jewish individuals live vibrant lives rooted in profound religious traditions, thriving Yiddish and Ladino secular culture, and proud civic and patriotic service.',
    'Nazi legislation systematically strips German Jews of their citizenship, civil rights, and livelihoods through the 1933 economic boycott, 1935 Nuremberg Laws, and the violent state-sponsored terror of Kristallnacht.',
    'Nazi authorities force hundreds of thousands of Jews into walled, overcrowded urban ghettos like Warsaw, where victims endure deliberate starvation while maintaining secret archives like Emanuel Ringelblum’s Oneg Shabbat.',
    'Following the 1941 invasion of the Soviet Union, four mobile killing squads (Einsatzgruppen) and local auxiliaries shoot over 1.5 million Jewish men, women, and children into ravines and mass graves like Babi Yar.',
    'At the 1942 Wannsee Conference, the Nazi regime coordinates the industrial transport of millions to dedicated extermination camps; victims maintain clandestine resistance, culminating in the 1943 Warsaw Ghetto Uprising and camp revolts.',
    'Defying totalitarian terror, rescue networks and courageous individuals—from Danish fishermen smuggling 7,200 Jews to Sweden, to Chiune Sugihara stamping transit visas—risk their lives to save human beings.',
    'Allied armies uncover unfathomable atrocities as they liberate Nazi camps; survivors rebuild shattered lives in Displaced Persons camps while the Nuremberg Trials establish individual criminal accountability for crimes against humanity.'
  ],
  'Workbook Centrefold • pp. 10–11'
);

// -------------------------------------------------------------
// 7. FIRST BRITISH EMPIRE (1588–1783) • 16-Page Pupil Workbook
// -------------------------------------------------------------
WORKBOOK_TIMELINE_DATA.first_british_empire = extractGoldStandardUnit(
  'scripts/render_first_british_empire_workbook.cjs',
  [
    'The East India Company & The Diwani of Bengal',
    'The Royal African Company & The Middle Passage',
    'Plantation Slavery & Queen Nanny’s Maroon Resistance',
    'Taxation Without Representation & The Boston Tea Party',
    'The American Declaration of Independence & Black Loyalists'
  ],
  [
    'Queen Elizabeth I charters the East India Company in 1600; following Robert Clive’s victory at Plassey in 1757, Emperor Shah Alam II grants the Company the Diwani, transforming a commercial merchant enterprise into a territorial tax-collecting empire.',
    'King Charles II establishes the Royal African Company with a royal monopoly over the transatlantic trade in enslaved human beings, brutally forcibly transporting millions across the Middle Passage aboard horrific slave ships.',
    'Enslaved Africans labour under terror on Caribbean sugar plantations; in the rugged Blue Mountains of Jamaica, Queen Nanny leads the Windward Maroons in a brilliant guerrilla campaign, forcing the British Crown to sign a 1739 sovereignty peace treaty.',
    'Parliament’s Stamp Act and tea duties spark fierce resistance among American colonists shouting "No taxation without representation!", culminating in the 1773 Boston Tea Party when the Sons of Liberty dump 342 chests of tea into the harbour.',
    'Thomas Jefferson pens the 1776 Declaration of Independence proclaiming equality while owning enslaved labourers; thousands of enslaved people escape to British lines under Lord Dunmore’s proclamation, earning freedom as Black Loyalists.'
  ],
  'Workbook Centrefold • pp. 8–9'
);

// -------------------------------------------------------------
// 8. INDUSTRIALISATION & EMPIRE (1750–1900) • 16-Page Pupil Workbook
// -------------------------------------------------------------
WORKBOOK_TIMELINE_DATA.industrialisation_and_empire = extractGoldStandardUnit(
  'scripts/render_industrialisation_workbook.cjs',
  [
    'Henry Cort, Iron Puddling & The Funtley Revolution',
    'Factory Discipline, Textile Mules & Child Labour',
    'Slums, Asiatic Cholera & Bazalgette’s Sewers',
    'Radical Protest: Peterloo Massacre & The Swing Riots',
    'The Great Reform Act, Chartism & The Secret Ballot'
  ],
  [
    'At Funtley Iron Works near Fareham, Henry Cort patents reverberatory puddling furnaces and grooved rollers in 1784, enabling Britain to refine iron 15 times faster using coal and freeing the Royal Navy from dependence on foreign timber.',
    'Steam-powered textile mills enforce severe factory discipline with 14-hour days; child piecers risk mutilation crawling under spinning mules until Michael Sadler’s 1832 report forces Parliament to pass the landmark 1833 Factory Act.',
    'Rapid urban growth packs factory workers into squalid back-to-back slums with contaminated cesspools; following deadly cholera epidemics and the 1858 Great Stink, Joseph Bazalgette constructs 82 miles of subterranean brick intercepting sewers.',
    'Sixty thousand unarmed reform protestors at St Peter’s Field are charged by sabre-wielding yeomanry in the 1819 Peterloo Massacre; in 1830, desperate Hampshire farm workers smash threshing machines under the mythical leader Captain Swing.',
    'Fearing revolution, Parliament passes the 1832 Great Reform Act abolishing 56 rotten boroughs and granting seats to Manchester and Birmingham, sparking the mass working-class Chartist petitions and the 1872 Secret Ballot Act.'
  ],
  'Workbook Centrefold • pp. 8–9'
);

// -------------------------------------------------------------
// 9. POST WAR BRITAIN (1897–1982) • 16-Page Pupil Workbook
// -------------------------------------------------------------
const pwbContent = fs.readFileSync(path.join(ROOT_DIR, 'scripts/render_post_war_britain_twopage_workbook.cjs'), 'utf8');
const pwbMatches = [...pwbContent.matchAll(/timelineMission:\s*\n?\s*'([\s\S]*?)'/g)].map(m => cleanHtml(m[1]));
WORKBOOK_TIMELINE_DATA.post_war_britain = [
  {
    lessonIndex: 0,
    lessonId: 'lesson_1',
    milestoneBadge: 'Milestones 1 & 3 (1897 & 1918)',
    date: '1897 & 1918',
    title: 'The Votes for Women Campaign & The 1918 Act',
    pageRef: 'Workbook Centrefold • pp. 8–9',
    desc: 'Millicent Fawcett’s constitutional NUWSS and Emmeline Pankhurst’s militant WSPU battle for female suffrage; following decisive wartime mobilisation of 1.5 million women in munitions, Parliament grants women over 30 the vote in 1918.',
    sketchPrompt: 'Suffragette banner \'Deeds Not Words\' crossed with munitions shell and 1918 ballot paper',
    sketchIdeas: ['🗳️ 1918 Ballot paper', '📜 Suffragist petition scroll', '💣 Canary Girl artillery shell', '⛓️ WSPU hunger strike chains'],
    conceptTitle: 'Votes for Women Campaign',
    branches: [
      { label: 'Constitutional Campaign', value: '1897 Millicent Fawcett NUWSS peaceful lobbying' },
      { label: 'Militant Defiance', value: '1903 Pankhurst WSPU direct action & hunger strikes' },
      { label: 'War Mobilisation', value: '1918 Representation of the People Act voting rights' }
    ],
    fullMissionText: pwbMatches[0] || 'Turn to Centrefold (Pages 8–9). Complete Milestone 1 (1897 NUWSS) and Milestone 3 (1918 Representation of the People Act) using dual-coding symbols and dates.'
  },
  {
    lessonIndex: 1,
    lessonId: 'lesson_2',
    milestoneBadge: 'Milestones 4 & 5 (1942 & 1948)',
    date: '1942 & 1948',
    title: 'The Beveridge Report & The Foundation of the NHS',
    pageRef: 'Workbook Centrefold • pp. 8–9',
    desc: 'William Beveridge’s landmark 1942 social insurance report identifies the Five Giant Evils; in July 1948, Health Minister Aneurin Bevan overcomes fierce BMA opposition to inaugurate the National Health Service.',
    sketchPrompt: 'Aneurin Bevan holding NHS charter beside a hospital bed and 5 Giant Evils shield',
    sketchIdeas: ['🏥 NHS hospital foundation', '🛡️ Five Giant Evils shield', '📜 1942 Beveridge blueprint', '💉 Free healthcare for all'],
    conceptTitle: 'The Welfare Settlement',
    branches: [
      { label: 'Social Blueprint', value: '1942 William Beveridge report against Five Giant Evils' },
      { label: ' Bevan’s Triumph', value: 'Overcoming BMA opposition to establish free care' },
      { label: 'Universal Healthcare', value: '5 July 1948 Manchester Park Hospital inaugural launch' }
    ],
    fullMissionText: pwbMatches[1] || 'Turn to Centrefold (Pages 8–9). Complete Milestone 4 (1942 Beveridge Report) and Milestone 5 (5 July 1948 NHS Foundation) using dual-coding sketches and dates.'
  },
  {
    lessonIndex: 2,
    lessonId: 'lesson_3',
    milestoneBadge: 'Milestone 6 (1948)',
    date: '1948',
    title: 'Empire Windrush & Post-War Commonwealth Migration',
    pageRef: 'Workbook Centrefold • pp. 8–9',
    desc: 'HMT Empire Windrush arrives at Tilbury Docks carrying 492 Jamaican passengers exercising their legal rights under the 1948 British Nationality Act, revitalising London Transport and the newly formed NHS despite colour bar hostility.',
    sketchPrompt: 'HMT Empire Windrush troopship docking at Tilbury beside British Nationality Act ledger',
    sketchIdeas: ['🚢 HMT Empire Windrush troopship', '📜 1948 British Nationality Act', '⚓ Tilbury Docks gangway', '🚌 London Transport bus badge'],
    conceptTitle: 'Windrush Generation',
    branches: [
      { label: 'Imperial Citizenship', value: '1948 British Nationality Act citizenship rights' },
      { label: 'Labour Rebuilding', value: 'Vital recruitment into NHS, London Transport & railways' },
      { label: 'Colour Bar Friction', value: 'Housing discrimination and 1958 Notting Hill unrest' }
    ],
    fullMissionText: pwbMatches[2] || 'Turn to Centrefold (Pages 8–9). Complete Milestone 6 (22 June 1948 Windrush Arrival) using dual-coding symbols, troopship, and Tilbury Docks.'
  },
  {
    lessonIndex: 3,
    lessonId: 'lesson_4',
    milestoneBadge: 'Milestone 7 (1963)',
    date: '1963',
    title: 'The Bristol Bus Boycott & The Race Relations Acts',
    pageRef: 'Workbook Centrefold • pp. 8–9',
    desc: 'Paul Stephenson and Roy Hackett lead a four-month peaceful boycott against the Bristol Omnibus Company’s discriminatory colour bar; victory forces the company to capitulate, leading directly to the 1965 Race Relations Act.',
    sketchPrompt: 'Bristol green double-decker bus blocked by peaceful protestors holding equality placards',
    sketchIdeas: ['🚌 Bristol Omnibus double-decker', '🚫 Colour bar boycott placard', '📜 1965 Race Relations Act', '✊ Paul Stephenson civil rights'],
    conceptTitle: 'Civil Rights in Britain',
    branches: [
      { label: 'Direct Boycott', value: 'Paul Stephenson & Roy Hackett lead 4-month bus blockade' },
      { label: 'Corporate Surrender', value: '28 August 1963 company overturns racist hiring ban' },
      { label: 'Legal Landmark', value: 'Harold Wilson government passes 1965 Race Relations Act' }
    ],
    fullMissionText: pwbMatches[3] || 'Turn to Centrefold (Pages 8–9). Complete Milestone 7 (1963 Bristol Bus Boycott) using dual-coding symbols, Bristol bus, and equality banners.'
  },
  {
    lessonIndex: 4,
    lessonId: 'lesson_5',
    milestoneBadge: 'Milestone 8 (1958–1982)',
    date: '1958–1982',
    title: 'Anti-Nuclear Protest: Aldermaston & Greenham Common',
    pageRef: 'Workbook Centrefold • pp. 8–9',
    desc: 'Gerald Holtom designs the international nuclear disarmament symbol for the 1958 Aldermaston March; in 1981, 30,000 women establish the Greenham Common Women’s Peace Camp, embracing the perimeter fence against US Cruise missiles.',
    sketchPrompt: 'Gerald Holtom peace symbol woven into Greenham Common wire fence with protest banners',
    sketchIdeas: ['☮️ Holtom CND peace symbol', '🚧 Greenham Common wire fence', '🚀 US Cruise missile silhouette', '🕊️ 30,000 women embrace the base'],
    conceptTitle: 'Nuclear Disarmament Protest',
    branches: [
      { label: 'Symbol of Defiance', value: '1958 Gerald Holtom creates international CND symbol' },
      { label: 'Direct Women\'s Action', value: '30,000 women link hands around Greenham airbase' },
      { label: 'Global Pressure', value: 'Grassroots resistance forces 1987 INF nuclear treaty' }
    ],
    fullMissionText: pwbMatches[4] || 'Turn to Centrefold (Pages 8–9). Complete Milestone 8 (1958–1982 CND & Greenham Common) using dual-coding symbols, peace symbol, and perimeter fence.'
  }
];

// -------------------------------------------------------------
// 10. GREAT WAR PART 1 (1871–1914) • 16-Page Pupil Workbook
// -------------------------------------------------------------
const gw1Content = fs.readFileSync(path.join(ROOT_DIR, 'scripts/render_great_war_twopage_workbook.cjs'), 'utf8');
const gw1Matches = [...gw1Content.matchAll(/timelineMission:\s*\n?\s*'([\s\S]*?)'/g)].map(m => cleanHtml(m[1]));
WORKBOOK_TIMELINE_DATA.great_war = [
  {
    lessonIndex: 0,
    lessonId: 'lesson_1',
    milestoneBadge: 'Milestone 1 (1871)',
    date: '1871',
    title: 'German Unification, Hall of Mirrors & Alsace-Lorraine',
    pageRef: 'Workbook Centrefold • pp. 8–9',
    desc: 'Inside the Hall of Mirrors at Versailles, Prussian King Wilhelm I is crowned German Emperor. Bismarck unites 39 states into a dominant military giant, permanently shattering the 1815 balance of power and seizing Alsace-Lorraine.',
    sketchPrompt: 'Wilhelm I crowned German Emperor in Hall of Mirrors, or border posts marking Alsace-Lorraine',
    sketchIdeas: ['👑 Imperial German crown', '🪞 Hall of Mirrors at Versailles', '🗺️ Alsace-Lorraine border stone', '⚔️ Franco-Prussian victory'],
    conceptTitle: 'German Unification',
    branches: [
      { label: 'Imperial Proclamation', value: '18 Jan 1871 Wilhelm I crowned German Emperor' },
      { label: 'Territorial Annexation', value: 'Treaty of Frankfurt seizes mineral-rich Alsace-Lorraine' },
      { label: 'French Revanchism', value: 'Permanent French vow to reclaim lost eastern provinces' }
    ],
    fullMissionText: gw1Matches[0] || 'Turn to Centrefold (Pages 8–9). Complete Milestone 1 (1871 Proclamation of the German Empire at Versailles) using dual-coding symbols and key dates.'
  },
  {
    lessonIndex: 1,
    lessonId: 'lesson_2',
    milestoneBadge: 'Milestones 3 & 7 (1884 & 1911)',
    date: '1884 & 1911',
    title: 'Imperial Rivalry: Scramble for Africa & Agadir Crisis',
    pageRef: 'Workbook Centrefold • pp. 8–9',
    desc: 'At the 1884 Berlin Conference, European powers partition the African continent; in 1911, Kaiser Wilhelm II dispatches the gunboat SMS Panther to Agadir, testing the Anglo-French Entente Cordiale.',
    sketchPrompt: 'German gunboat SMS Panther anchoring off Agadir, or Berlin Conference map partition',
    sketchIdeas: ['🚢 SMS Panther gunboat', '🗺️ Berlin Conference Africa map', '🤝 Anglo-French Entente handshake', '⚓ Moroccan coastal fort'],
    conceptTitle: 'Imperial Rivalry',
    branches: [
      { label: 'Continental Partition', value: '1884 Berlin Conference rules of effective occupation' },
      { label: 'Weltpolitik Challenge', value: 'Wilhelm II demands "a place in the sun" for Germany' },
      { label: 'Agadir Backfire', value: 'Panther gunboat cements Anglo-French military coordination' }
    ],
    fullMissionText: gw1Matches[1] || 'Turn to Centrefold (Pages 8–9). Complete Milestone 3 (The Berlin Conference) and Milestone 7 (The Panther at Agadir) using dual-coding sketches and dates.'
  },
  {
    lessonIndex: 2,
    lessonId: 'lesson_3',
    milestoneBadge: 'Milestone 6 (1906)',
    date: '1906',
    title: 'The Anglo-German Naval Arms Race & HMS Dreadnought',
    pageRef: 'Workbook Centrefold • pp. 8–9',
    desc: 'The Royal Navy launches HMS Dreadnought with ten 12-inch guns and revolutionary steam turbines, rendering all previous battleships obsolete and sparking an intense naval race with Admiral Tirpitz’s High Seas Fleet.',
    sketchPrompt: 'HMS Dreadnought steaming with all-big-gun turrets, or Tirpitz naval expansion laws',
    sketchIdeas: ['🚢 HMS Dreadnought all-big-gun battleship', '⚙️ Steam turbine funnels', '🎯 Ten 12-inch rotating turrets', '⚓ Royal Navy two-power standard'],
    conceptTitle: 'Naval Arms Race',
    branches: [
      { label: 'Technological Revolution', value: '1906 HMS Dreadnought renders all existing battleships obsolete' },
      { label: 'Tirpitz Fleet Laws', value: 'German Risk Theory fleet designed to challenge Royal Navy' },
      { label: 'British Supremacy', value: 'Britain outbuilds Germany 29 to 17 in dreadnought capital ships' }
    ],
    fullMissionText: gw1Matches[2] || 'Turn to Centrefold (Pages 8–9). Complete Milestone 6 (1906 Launch of HMS Dreadnought) using dual-coding symbols, gun turrets, and turbine funnels.'
  },
  {
    lessonIndex: 3,
    lessonId: 'lesson_4',
    milestoneBadge: 'Milestones 4 & 7 (1890 & 1908)',
    date: '1890 & 1908',
    title: 'The Web of Alliances & The Bosnian Annexation Crisis',
    pageRef: 'Workbook Centrefold • pp. 8–9',
    desc: 'Kaiser Wilhelm II drops Bismarck in 1890 and lets the Reinsurance Treaty lapse, driving France and Russia into alliance; in 1908, Austria-Hungary’s annexation of Bosnia enrages Serbia and Russia.',
    sketchPrompt: 'Triple Entente flags interlocking against Triple Alliance, or Austria annexing Bosnia',
    sketchIdeas: ['⛓️ Interlocking alliance chains', '🦅 Habsburg double-headed eagle', '🇷🇺 Russian bear protecting Serbia', '📜 Dropping the pilot cartoon'],
    conceptTitle: 'The Web of Alliances',
    branches: [
      { label: 'Bismarck Dismissed', value: '1890 Franco-Russian defensive alliance forms' },
      { label: 'Two Armed Camps', value: 'Triple Alliance vs Triple Entente creates domino trap' },
      { label: 'Bosnian Annexation', value: '1908 Austrian annexation humiliates Russia and enrages Serbia' }
    ],
    fullMissionText: gw1Matches[3] || 'Turn to Centrefold (Pages 8–9). Complete Milestone 4 (Bismarck Dismissed) and Milestone 7 (Bosnian Crisis) using dual-coding symbols and dates.'
  },
  {
    lessonIndex: 4,
    lessonId: 'lesson_5',
    milestoneBadge: 'Milestone 8 (28 June 1914)',
    date: '28 June 1914',
    title: 'The Sarajevo Assassination & The July Crisis Dominoes',
    pageRef: 'Workbook Centrefold • pp. 8–9',
    desc: 'Gavrilo Princip of the Black Hand fires two pistol shots into Archduke Franz Ferdinand’s open-topped car at the Latin Bridge in Sarajevo; Germany issues the "Blank Cheque", triggering the alliance dominoes into world war.',
    sketchPrompt: 'Gavrilo Princip firing pistol at Franz Ferdinand’s Graf & Stift car beside Latin Bridge',
    sketchIdeas: ['🚗 Archduke\'s Graf & Stift motorcar', '🔫 Princip’s Browning FN 1910 pistol', '🌉 Latin Bridge in Sarajevo', '📜 German Blank Cheque telegram'],
    conceptTitle: 'The July Crisis Dominoes',
    branches: [
      { label: 'Sarajevo Catalyst', value: '28 June 1914 Black Hand assassinate Austrian heir' },
      { label: 'German Blank Cheque', value: 'Kaiser promises unconditional military support to Vienna' },
      { label: 'Alliance Dominoes', value: 'Mobilisation timetables plunge Europe into total war in August' }
    ],
    fullMissionText: gw1Matches[4] || 'Turn to Centrefold (Pages 8–9). Complete Milestone 8 (28 June 1914 Sarajevo Assassination) using dual-coding symbols, motorcar, and Latin Bridge.'
  }
];

// -------------------------------------------------------------
// 11. WATER & SANITATION THROUGH TIME (c.AD 43–Present) • 16-Page Pupil Workbook
// -------------------------------------------------------------
WORKBOOK_TIMELINE_DATA.water_and_sanitation = [
  {
    lessonIndex: 0,
    lessonId: 'lesson_1',
    milestoneBadge: 'Milestone 1 (c.AD 75)',
    date: 'c.AD 75',
    title: 'Roman Aqueducts & Fishbourne Lead Pipes',
    pageRef: 'Workbook Centrefold • pp. 8–9',
    desc: 'Romans construct monumental gravity-fed aqueducts, thermae, and jointed lead pipes at Fishbourne Palace, demonstrating imperial technological mastery over hydraulic engineering.',
    sketchPrompt: 'Draw stone aqueduct arches with water flowing into lead pipes',
    sketchIdeas: ['🏛️ Stone Roman aqueduct arches', '🚰 Lead water conduit pipes', '🏊 Roman thermae public baths'],
    conceptTitle: 'Roman Hydraulic Engineering',
    branches: [
      { label: 'Monumental Supply', value: 'Gravity-fed stone aqueduct channels' },
      { label: 'Palace Infrastructure', value: 'Fishbourne Palace pressurized lead conduits' },
      { label: 'Public Hygiene', value: 'Public thermae baths and continuous flush latrines' }
    ],
    fullMissionText: 'Turn to Centrefold • Pages 8–9 (Milestone 1). Complete the dual-coding sketch challenge in the timeline sketchpad: Draw stone aqueduct arches with water flowing into lead pipes.'
  },
  {
    lessonIndex: 1,
    lessonId: 'lesson_2',
    milestoneBadge: 'Milestone 2 (c.1165)',
    date: 'c.1165',
    title: 'Canterbury Monastic Conduits & Settling Tanks',
    pageRef: 'Workbook Centrefold • pp. 8–9',
    desc: 'Monk Wibert designs five settling tanks and subterranean lead conduits to bring filtered spring water to Christ Church Priory, prioritising monastic ritual cleanliness.',
    sketchPrompt: 'Draw five settling tanks filtering mud and sand from spring water',
    sketchIdeas: ['⛪ Canterbury Cathedral cloister', '🧪 Five tiered settling tanks', '💧 Clean filtered spring water conduit'],
    conceptTitle: 'Medieval Monastic Cleanliness',
    branches: [
      { label: 'Pioneering Filtration', value: 'Five subterranean settling tanks remove grit and silt' },
      { label: 'Prior Wibert Blueprint', value: 'Octagonal water tower supplies cloister lavatorium' },
      { label: 'Religious Cleanliness', value: 'Monasteries insulated from filthy open town cesspits' }
    ],
    fullMissionText: 'Turn to Centrefold • Pages 8–9 (Milestone 2). Complete the dual-coding sketch challenge in the timeline sketchpad: Draw five settling tanks filtering mud and sand.'
  },
  {
    lessonIndex: 2,
    lessonId: 'lesson_3',
    milestoneBadge: 'Milestone 3 (1596)',
    date: '1596',
    title: 'Sir John Harington: The Flush Toilet',
    pageRef: 'Workbook Centrefold • pp. 8–9',
    desc: 'Elizabeth I’s godson invents the world’s first valve-operated flushing water closet (the Ajax), though the lack of domestic running water prevents wide adoption for centuries.',
    sketchPrompt: 'Draw an overhead cistern with a pull lever flushing into a pan',
    sketchIdeas: ['🚽 The Ajax flushing valve water closet', '💧 Overhead water cistern', '👑 Queen Elizabeth I royal patent'],
    conceptTitle: 'Early Modern Innovation',
    branches: [
      { label: 'The Ajax Invention', value: 'First valve-operated flushing water closet design' },
      { label: 'Infrastructure Void', value: 'Lack of mains running water prevents mass adoption' },
      { label: 'Night Soil Persistence', value: 'Towns remain reliant on cesspools and nightsoil men' }
    ],
    fullMissionText: 'Turn to Centrefold • Pages 8–9 (Milestone 3). Complete the dual-coding sketch challenge in the timeline sketchpad: Draw an overhead cistern with a pull lever flushing into a pan.'
  },
  {
    lessonIndex: 3,
    lessonId: 'lesson_4',
    milestoneBadge: 'Milestone 4 (1842 & 1854)',
    date: '1842 & 1854',
    title: 'Chadwick’s Sanitary Report & Snow’s Broad Street Pump',
    pageRef: 'Workbook Centrefold • pp. 8–9',
    desc: 'Edwin Chadwick proves filth causes disease; in 1854, Dr John Snow maps cholera deaths around Soho, removing the Broad Street pump handle and disproving the miasma theory.',
    sketchPrompt: 'Draw the Broad Street water pump handle removed beside a death map',
    sketchIdeas: ['🚰 Broad Street pump with removed handle', '🗺️ Dr John Snow Soho cholera spot map', '🦠 Waterborne Vibrio cholerae bacteria'],
    conceptTitle: 'Epidemiological Revolution',
    branches: [
      { label: 'Statistical Proof', value: 'Chadwick proves Manchester labourers die at age 17' },
      { label: 'Empirical Mapping', value: 'Snow pinpoints 616 deaths to contaminated Broad St pump' },
      { label: 'Miasma Overthrown', value: 'Proves cholera is waterborne, not airborne bad air' }
    ],
    fullMissionText: 'Turn to Centrefold • Pages 8–9 (Milestone 4). Complete the dual-coding sketch challenge in the timeline sketchpad: Draw the Broad Street water pump handle removed beside a death map.'
  },
  {
    lessonIndex: 4,
    lessonId: 'lesson_5',
    milestoneBadge: 'Milestone 5 (1858–1875)',
    date: '1858–1875',
    title: 'The Great Stink & Bazalgette’s Sewer Network',
    pageRef: 'Workbook Centrefold • pp. 8–9',
    desc: 'Following the 1858 Great Stink that closed Parliament, Joseph Bazalgette constructs 82 miles of brick intercepting sewers, driving typhus and cholera out of London.',
    sketchPrompt: 'Draw subterranean egg-shaped brick sewers beneath the Thames embankment',
    sketchIdeas: ['🧱 Egg-shaped brick intercepting sewer', '👃 The 1858 Great Stink chloride curtains', '🌊 Thames Embankment engineering'],
    conceptTitle: 'Victorian Sanitary Engineering',
    branches: [
      { label: 'The Great Stink', value: 'Heatwave forces Parliament to soak curtains in chloride of lime' },
      { label: 'Bazalgette Masterpiece', value: '82 miles of subterranean brick sewers redirect 420m gallons' },
      { label: 'Public Health Acts', value: '1875 Act mandates clean water supply and sewer connections' }
    ],
    fullMissionText: 'Turn to Centrefold • Pages 8–9 (Milestone 5). Complete the dual-coding sketch challenge in the timeline sketchpad: Draw subterranean egg-shaped brick sewers beneath the Thames embankment.'
  }
];

// -------------------------------------------------------------
// 12. CONFLICT IN THE MIDDLE EAST (1945–1995) • 3 Key Topics
// -------------------------------------------------------------
const cmeKt1Content = fs.readFileSync(path.join(ROOT_DIR, 'scripts/render_cme_kt1_twopage_workbook.cjs'), 'utf8');
const cmeKt1Matches = [...cmeKt1Content.matchAll(/timelineMission:\s*\n?\s*'([\s\S]*?)'/g)].map(m => cleanHtml(m[1]));
const cmeKt2Content = fs.readFileSync(path.join(ROOT_DIR, 'scripts/render_cme_twopage_workbook.cjs'), 'utf8');
const cmeKt2Matches = [...cmeKt2Content.matchAll(/timelineMission:\s*\n?\s*'([\s\S]*?)'/g)].map(m => cleanHtml(m[1]));
const cmeKt3Content = fs.readFileSync(path.join(ROOT_DIR, 'scripts/render_cme_kt3_twopage_workbook.cjs'), 'utf8');
const cmeKt3Matches = [...cmeKt3Content.matchAll(/timelineMission:\s*\n?\s*'([\s\S]*?)'/g)].map(m => cleanHtml(m[1]));

WORKBOOK_TIMELINE_DATA.cme_new = [
  // KT1
  {
    lessonIndex: 0,
    lessonId: 'lesson_1',
    milestoneBadge: 'Milestone 1 (1915–1917)',
    date: '1915–1917',
    title: 'The Contradictory British Pledges',
    pageRef: 'Workbook Pages 2–3 • Key Topic 1.1',
    desc: 'Britain issues contradictory wartime pledges: the McMahon-Hussein Correspondence promises Arab independence, the Sykes-Picot Agreement secretly partitions the Ottoman Empire with France, and the Balfour Declaration promises a Jewish national home.',
    sketchPrompt: 'Sketch the three contradictory pledges and imperial partition border',
    sketchIdeas: ['📜 Balfour Declaration parchment', '🗺️ Sykes-Picot partition map', '👑 McMahon-Hussein letter'],
    conceptTitle: 'Contradictory Pledges',
    branches: [
      { label: 'Arab Pledge', value: '1915 McMahon-Hussein promise of independence for Arab revolt' },
      { label: 'Secret Partition', value: '1916 Sykes-Picot carve-up between Britain and France' },
      { label: 'Zionist Pledge', value: '1917 Balfour Declaration backs Jewish national home' }
    ],
    fullMissionText: cmeKt1Matches[0] || 'Turn to Pages 2–3 (Key Topic 1.1). In Milestone 1, sketch the contradictory British pledges and the imperial boundary line separating British and French mandate zones.'
  },
  {
    lessonIndex: 1,
    lessonId: 'lesson_2',
    milestoneBadge: 'Milestone 2 (1946)',
    date: 'July 1946',
    title: 'The King David Hotel Bombing',
    pageRef: 'Workbook Pages 2–3 • Key Topic 1.2',
    desc: 'The Irgun bombs the British military and administrative headquarters in the King David Hotel, killing 91 people and breaking Britain’s political will to maintain the Palestine Mandate.',
    sketchPrompt: 'Sketch the shattered wing of King David Hotel and barbed wire security zones',
    sketchIdeas: ['💥 Shattered south-west hotel wing', '🏨 King David Hotel facade', '🚧 British barbed wire security checkpoint'],
    conceptTitle: 'Mandate Crisis',
    branches: [
      { label: 'Irgun Attack', value: '22 July 1946 bomb concealed in milk churns kills 91' },
      { label: 'Operation Agatha', value: 'Retaliation for British mass arrest of Zionist leaders' },
      { label: 'British Exit', value: 'Exhausted Britain refers Palestine problem to United Nations' }
    ],
    fullMissionText: cmeKt1Matches[1] || 'Turn to Pages 2–3 (Key Topic 1.2). In Milestone 2, sketch the shattered south-west wing of the King David Hotel and the barbed wire perimeter around British administrative zones.'
  },
  {
    lessonIndex: 2,
    lessonId: 'lesson_3',
    milestoneBadge: 'Milestones 3 & 4 (1947–1948)',
    date: '1947–1948',
    title: 'UN Partition Plan & 1948 War of Independence',
    pageRef: 'Workbook Pages 2–3 • Key Topic 1.3',
    desc: 'UN Resolution 181 partitions Palestine into Arab and Jewish states; David Ben-Gurion proclaims Israel’s independence on 14 May 1948, triggering an immediate five-nation Arab invasion.',
    sketchPrompt: 'Sketch UN partition map divisions and five Arab invasion routes',
    sketchIdeas: ['🗺️ UN Resolution 181 partition map', '📜 Ben-Gurion declaration of independence', '⚔️ Five Arab army invasion arrows'],
    conceptTitle: 'Partition & Independence War',
    branches: [
      { label: 'UN Partition', value: 'Nov 1947 Resolution 181 awards 56% land to Jewish state' },
      { label: 'Statehood Proclaimed', value: '14 May 1948 Ben-Gurion declares State of Israel' },
      { label: 'Arab-Israeli War', value: 'Five Arab armies invade; Israel captures 78% by 1949' }
    ],
    fullMissionText: cmeKt1Matches[2] || 'Turn to Pages 2–3 (Key Topic 1.3). In Milestones 3 & 4, sketch the UN Partition map divisions and the five Arab invasion routes crossing Israel’s borders.'
  },
  {
    lessonIndex: 3,
    lessonId: 'lesson_4',
    milestoneBadge: 'Milestone 5 (1948–1950)',
    date: '1948–1950',
    title: 'The Palestinian Catastrophe (Nakba) & Law of Return',
    pageRef: 'Workbook Pages 2–3 • Key Topic 1.4',
    desc: 'Over 700,000 Palestinian Arabs flee or are expelled from their homes during the 1948 war, becoming permanent refugees; meanwhile, Israel passes the 1950 Law of Return, welcoming 687,000 Jewish immigrants.',
    sketchPrompt: 'Sketch UNRWA refugee tents alongside cargo ships bringing immigrants to Haifa',
    sketchIdeas: ['⛺ UNRWA refugee camp tent', '🚢 Immigrant cargo ship entering Haifa', '📜 1950 Israeli Law of Return'],
    conceptTitle: 'Refugee Catastrophe & Aliyah',
    branches: [
      { label: 'The Nakba', value: '700,000+ Palestinians displaced into Gaza, West Bank & Jordan' },
      { label: 'UNRWA Relief', value: 'UN agency established to provide basic food and shelter' },
      { label: 'Jewish Immigration', value: 'Law of Return doubles Israel’s population within three years' }
    ],
    fullMissionText: cmeKt1Matches[3] || 'Turn to Pages 2–3 (Key Topic 1.4). In Milestone 5, sketch the overcrowded UNRWA refugee tents alongside the cargo ships arriving in Haifa with Jewish immigrants.'
  },
  {
    lessonIndex: 4,
    lessonId: 'lesson_5',
    milestoneBadge: 'Milestone 6 (1956)',
    date: '1956',
    title: 'Nasser & The Suez Crisis',
    pageRef: 'Workbook Pages 2–3 • Key Topic 1.5',
    desc: 'President Gamal Abdel Nasser nationalises the Suez Canal; Britain, France, and Israel hatch the secret Sèvres Protocol to invade Egypt, but US financial pressure forces a humiliating Anglo-French retreat.',
    sketchPrompt: 'Sketch nationalised Suez Canal waterway and British paratroopers at Port Said',
    sketchIdeas: ['🌊 Suez Canal waterway', '🪂 British paratrooper drop at Port Said', '📜 Secret Sèvres Protocol treaty', '🇺🇸 Eisenhower financial veto'],
    conceptTitle: 'Suez Standoff',
    branches: [
      { label: 'Canal Nationalised', value: '26 July 1956 Nasser seizes canal to fund Aswan Dam' },
      { label: 'Protocol of Sèvres', value: 'Collusion between Britain, France, and Israel' },
      { label: 'Superpower Veto', value: 'Eisenhower threatens sterling collapse; imperial retreat' }
    ],
    fullMissionText: cmeKt1Matches[4] || 'Turn to Pages 2–3 (Key Topic 1.5). In Milestone 6, sketch the nationalised Suez Canal waterway and the British paratroopers landing at Port Said under US diplomatic pressure.'
  },

  // KT2
  {
    lessonIndex: 5,
    lessonId: 'lesson_6',
    milestoneBadge: 'Milestones 1 & 2 (Jan–May 1967)',
    date: 'Jan–May 1967',
    title: 'The Road to War: Arab Summits & Tiran Blockade',
    pageRef: 'Workbook Pages 2–3 • Key Topic 2.1',
    desc: 'Nasser convenes Arab summits, demands the withdrawal of UNEF peacekeepers from Sinai, and closes the Straits of Tiran to Israeli shipping at Sharm el-Sheikh, providing Israel with a clear casus belli.',
    sketchPrompt: 'Sketch Cairo Arab Summit emblem and naval blockade of Straits of Tiran',
    sketchIdeas: ['⚓ Blockade of Straits of Tiran', '🛡️ UNEF peacekeeper evacuation', '📢 Cairo Arab Summit podium'],
    conceptTitle: 'Escalation to War',
    branches: [
      { label: 'Arab Coalitions', value: '1964 Cairo Summit creates Unified Arab Military Command' },
      { label: 'UNEF Evicted', value: 'Nasser forces UN peacekeepers out of Sinai border zone' },
      { label: 'Tiran Blockade', value: 'Closure of Straits of Tiran chokes Israeli port of Eilat' }
    ],
    fullMissionText: cmeKt2Matches[0] || 'Turn to Pages 2–3 (Key Topic 2.1). In Milestones 1 and 2, sketch the Cairo Arab Summit symbol and annotate the blockade of the Straits of Tiran at Sharm el-Sheikh.'
  },
  {
    lessonIndex: 6,
    lessonId: 'lesson_7',
    milestoneBadge: 'Milestone 3 (5–10 June 1967)',
    date: '5–10 June 1967',
    title: 'Operation Focus & The Six-Day War Blitzkrieg',
    pageRef: 'Workbook Pages 2–3 • Key Topic 2.2',
    desc: 'Israel launches preemptive air strikes in Operation Focus, obliterating the Egyptian air force on the runways within three hours; IDF armour seizes the Sinai Peninsula, Gaza Strip, West Bank, East Jerusalem, and Golan Heights.',
    sketchPrompt: 'Sketch Israeli Centurion tanks advancing through Sinai and label conquered zones',
    sketchIdeas: ['✈️ IAF Mirage preemptive runway strike', '🛡️ Centurion tanks in Sinai desert', '🗺️ Conquered territories map'],
    conceptTitle: 'Six-Day War Blitzkrieg',
    branches: [
      { label: 'Operation Focus', value: 'Preemptive strike destroys 300+ Egyptian aircraft in 3 hours' },
      { label: 'Territorial Tripling', value: 'Sinai, West Bank, Gaza, and Golan Heights captured' },
      { label: 'Strategic Depth', value: 'Israel gains defensible borders but absorbs 1M Palestinians' }
    ],
    fullMissionText: cmeKt2Matches[1] || 'Turn to Pages 2–3 (Key Topic 2.2). In Milestone 3, sketch Israeli Centurion tanks advancing through the desert and label the Golan Heights, West Bank, and Sinai.'
  },
  {
    lessonIndex: 7,
    lessonId: 'lesson_8',
    milestoneBadge: 'Milestone 4 (Nov 1967)',
    date: 'Nov 1967',
    title: 'Resolution 242 & The Khartoum Three Noes',
    pageRef: 'Workbook Pages 2–3 • Key Topic 2.3',
    desc: 'Arab leaders at the Khartoum Summit declare "No peace, no recognition, no negotiations" with Israel; the UN Security Council passes Resolution 242, establishing the ambiguous "land for peace" formula.',
    sketchPrompt: 'Sketch UN Resolution 242 emblem and Khartoum Three Noes banners',
    sketchIdeas: ['📜 UN Security Council Resolution 242', '🚫 Khartoum Three Noes banner', '🕊️ Land for Peace scales of justice'],
    conceptTitle: 'Diplomatic Deadlock',
    branches: [
      { label: 'Khartoum Summit', value: 'Arab League adopts the defiant "Three Noes" formula' },
      { label: 'UN Resolution 242', value: 'Ambiguous English text: "withdrawal from territories occupied"' },
      { label: 'Settlement Beginnings', value: 'First Israeli civilian outposts established in West Bank' }
    ],
    fullMissionText: cmeKt2Matches[2] || 'Turn to Pages 2–3 (Key Topic 2.3). In Milestone 4, sketch the UN Security Council emblem and write out the three banners of the Khartoum "Three Noes".'
  },
  {
    lessonIndex: 8,
    lessonId: 'lesson_9',
    milestoneBadge: 'Milestone 5 (1970)',
    date: 'Sept 1970',
    title: 'Black September & The Dawson’s Field Hijackings',
    pageRef: 'Workbook Pages 2–3 • Key Topic 2.4',
    desc: 'The PFLP hijacks four Western airliners to Dawson’s Field in Jordan and blows them up; King Hussein’s army expels PLO guerrilla commandos in bloody urban combat during Black September, forcing Arafat into Lebanon.',
    sketchPrompt: 'Sketch Dawson’s Field aircraft explosion and PLO exile route to Lebanon',
    sketchIdeas: ['✈️ Blown-up airliner fuselage at Dawson\'s Field', '👑 King Hussein royal military beret', '🗺️ PLO exile route from Amman to Beirut'],
    conceptTitle: 'Black September Crisis',
    branches: [
      { label: 'Air Piracy', value: 'PFLP blows up hijacked airliners in front of world media' },
      { label: 'Hussein Strike', value: 'Jordanian Army crushes armed Palestinian state-within-a-state' },
      { label: 'Exile to Lebanon', value: 'PLO relocated to southern Lebanon, sowing seeds of 1982 invasion' }
    ],
    fullMissionText: cmeKt2Matches[3] || 'Turn to Pages 2–3 (Key Topic 2.4). In Milestone 5, sketch the Dawson’s Field aircraft explosion and trace the PLO exile route from Jordan to southern Lebanon.'
  },
  {
    lessonIndex: 9,
    lessonId: 'lesson_10',
    milestoneBadge: 'Milestone 6 (Oct 1973)',
    date: '6 Oct 1973',
    title: 'Operation Badr & The Yom Kippur War',
    pageRef: 'Workbook Pages 2–3 • Key Topic 2.5',
    desc: 'Egypt and Syria launch a devastating surprise attack on Yom Kippur, breaching the Bar-Lev Line with high-pressure water cannons; Arab OPEC states deploy the oil embargo weapon, quadrupling crude prices worldwide.',
    sketchPrompt: 'Sketch water-monitor breach of Bar-Lev Line and OPEC oil pipeline embargo valve',
    sketchIdeas: ['🌊 High-pressure water cannon breaching sand wall', '🛢️ OPEC oil embargo valve & barrel', '✡️ Yom Kippur prayer shawl & tank'],
    conceptTitle: 'October War & Oil Shock',
    branches: [
      { label: 'Operation Badr', value: 'Egyptian water monitors blast 60 gaps through Bar-Lev sand rampart' },
      { label: 'Aman Failure', value: 'Israeli intelligence misjudges Egyptian troop movements as exercises' },
      { label: 'OPEC Oil Weapon', value: 'Arab embargo triggers global fuel shortages and quadriples prices' }
    ],
    fullMissionText: cmeKt2Matches[4] || 'Turn to Pages 2–3 (Key Topic 2.5). In Milestone 6, sketch the water-monitor breach of the Bar-Lev Line and the OPEC oil pipeline embargo valve.'
  },

  // KT3
  {
    lessonIndex: 10,
    lessonId: 'lesson_11',
    milestoneBadge: 'Milestone 1 (Nov 1977)',
    date: 'Nov 1977',
    title: 'Sadat’s Historic Address to the Knesset',
    pageRef: 'Workbook Pages 2–3 • Key Topic 3.1',
    desc: 'President Anwar Sadat stuns the world by flying to Jerusalem and addressing the Israeli Knesset in person, proclaiming "No more war, no more bloodshed!" and breaking three decades of Arab psychological taboo.',
    sketchPrompt: 'Sketch Sadat addressing the Knesset chamber with olive branch',
    sketchIdeas: ['🎙️ Anwar Sadat at Knesset podium', '🕊️ Olive branch of peace', '🇮🇱 Israeli Knesset chamber emblem'],
    conceptTitle: 'Sadat’s Jerusalem Peace Leap',
    branches: [
      { label: 'Historic Flight', value: '19 Nov 1977 Sadat lands at Ben Gurion airport in Tel Aviv' },
      { label: 'Knesset Speech', value: 'Direct appeal to Israeli people: "No more war, no more bloodshed"' },
      { label: 'Arab Backlash', value: 'Arab states sever diplomatic ties and expel Egypt from Arab League' }
    ],
    fullMissionText: cmeKt3Matches[0] || 'Turn to Pages 2–3 (Key Topic 3.1). In Milestone 1, sketch Sadat addressing the Knesset chamber and annotate his historic declaration: "No more war, no more bloodshed!"'
  },
  {
    lessonIndex: 11,
    lessonId: 'lesson_12',
    milestoneBadge: 'Milestones 2 & 3 (1978–1979)',
    date: '1978–1979',
    title: 'The Camp David Accords & Washington Peace Treaty',
    pageRef: 'Workbook Pages 2–3 • Key Topic 3.2',
    desc: 'Jimmy Carter brokers thirteen days of intense negotiations at Camp David between Sadat and Menachem Begin; on 26 March 1979, Egypt and Israel sign a formal peace treaty, returning the Sinai Peninsula to Egyptian sovereignty.',
    sketchPrompt: 'Sketch three-way handshake on White House lawn and return of Sinai Peninsula',
    sketchIdeas: ['🤝 Carter-Sadat-Begin White House lawn handshake', '🗺️ Sinai Peninsula handover border', '📜 1979 Washington Peace Treaty'],
    conceptTitle: 'Camp David Accords',
    branches: [
      { label: 'Thirteen Days', value: 'Carter shuttles between isolated cabins to forge compromise' },
      { label: 'Sinai Handover', value: 'Israel evacuates Yamit settlements and returns full Sinai' },
      { label: 'Sadat Martyrdom', value: '6 Oct 1981 Sadat assassinated by Islamist militants in Cairo' }
    ],
    fullMissionText: cmeKt3Matches[1] || 'Turn to Pages 2–3 (Key Topic 3.2). In Milestones 2 and 3, sketch the three-way handshake on the White House lawn and annotate the return of the Sinai Peninsula to Egypt.'
  },
  {
    lessonIndex: 12,
    lessonId: 'lesson_13',
    milestoneBadge: 'Milestone 4 (1982)',
    date: 'June–Sept 1982',
    title: 'Operation Peace for Galilee & The Invasion of Lebanon',
    pageRef: 'Workbook Pages 2–3 • Key Topic 3.3',
    desc: 'Defense Minister Ariel Sharon orders Operation Peace for Galilee, advancing 40km into Lebanon all the way to Beirut; Christian Phalangist militiamen butcher hundreds of Palestinians in Sabra and Shatila refugee camps.',
    sketchPrompt: 'Sketch IDF tank columns advancing toward Beirut and Kahan Commission ledger',
    sketchIdeas: ['🛡️ Israeli Merkava tank column in Beirut', '⛺ Sabra and Shatila camp silhouette', '⚖️ Kahan Commission judicial report'],
    conceptTitle: 'Lebanon Invasion & Aftermath',
    branches: [
      { label: 'Operation Peace for Galilee', value: 'Sharon invades Lebanon to expel PLO and install friendly government' },
      { label: 'Sabra & Shatila', value: 'Phalangist massacres spark 400,000-strong protest in Tel Aviv' },
      { label: 'Kahan Commission', value: 'Judicial inquiry finds Sharon personally responsible; forces resignation' }
    ],
    fullMissionText: cmeKt3Matches[2] || 'Turn to Pages 2–3 (Key Topic 3.3). In Milestone 4, sketch the IDF tank columns entering Beirut and annotate the Kahan Commission finding of "personal responsibility" against Sharon.'
  },
  {
    lessonIndex: 13,
    lessonId: 'lesson_14',
    milestoneBadge: 'Milestone 5 (1987–1988)',
    date: '1987–1988',
    title: 'The First Intifada & The 1988 Geneva Renunciation',
    pageRef: 'Workbook Pages 2–3 • Key Topic 3.4',
    desc: 'A traffic collision in Jabalia sparks the First Intifada across Gaza and the West Bank; youth armed with stones confront armed IDF patrols; in December 1988 in Geneva, Yasser Arafat formally recognises Israel and renounces terrorism.',
    sketchPrompt: 'Sketch Palestinian youth facing an Israeli tank and Arafat Geneva speech',
    sketchIdeas: ['🪨 Palestinian stone-thrower facing armored vehicle', '🎙️ Arafat at UN General Assembly in Geneva', '📜 Renunciation of terrorism charter'],
    conceptTitle: 'First Intifada & Recognition',
    branches: [
      { label: 'Spontaneous Revolt', value: 'Jabalia camp incident ignites strikes, boycotts, and civil defiance' },
      { label: 'Iron Fist Policy', value: 'Rabin orders military force to break bones, drawing world criticism' },
      { label: 'Geneva Breakthrough', value: 'Dec 1988 Arafat recognises Israel and opens dialogue with US' }
    ],
    fullMissionText: cmeKt3Matches[3] || 'Turn to Pages 2–3 (Key Topic 3.4). In Milestone 5, sketch the stone-throwing youth facing an Israeli tank and annotate Arafat’s 1988 Geneva renunciation of terrorism.'
  },
  {
    lessonIndex: 14,
    lessonId: 'lesson_15',
    milestoneBadge: 'Milestone 6 (1993–1995)',
    date: '1993–1995',
    title: 'The Oslo Accords & The Assassination of Rabin',
    pageRef: 'Workbook Pages 2–3 • Key Topic 3.5',
    desc: 'Secret Norwegian negotiations produce the 1993 Oslo Accords and the historic Rabin-Arafat White House handshake; on 4 November 1995, Prime Minister Yitzhak Rabin is assassinated at a peace rally in Tel Aviv by a right-wing Israeli extremist.',
    sketchPrompt: 'Sketch Oslo partition map of Areas A, B, and C and Rabin memorial flame',
    sketchIdeas: ['🤝 Rabin-Arafat-Clinton White House handshake', '🗺️ West Bank map of Areas A, B, and C', '🕯️ Rabin memorial candle flame in Tel Aviv'],
    conceptTitle: 'Oslo Peace & Rabin Assassination',
    branches: [
      { label: 'Oslo I Declaration', value: '13 Sept 1993 White House signing creates Palestinian Authority' },
      { label: 'Oslo II Division', value: 'West Bank partitioned into Areas A (civil/security PA), B, and C' },
      { label: 'Rabin Assassinated', value: '4 Nov 1995 Yigal Amir fires three bullets, shattering peace momentum' }
    ],
    fullMissionText: cmeKt3Matches[4] || 'Turn to Pages 2–3 (Key Topic 3.5). In Milestone 6, sketch the map division of Areas A, B, and C and annotate the memorial flame for Yitzhak Rabin in Kings of Israel Square.'
  }
];

// -------------------------------------------------------------
// 13. COLD WAR (1945–1991) • Two-Page Pupil Workbook
// -------------------------------------------------------------
WORKBOOK_TIMELINE_DATA.cold_war = extractGoldStandardUnit(
  'scripts/render_cold_war_twopage_workbook.cjs',
  [
    'Ideological Clash: Capitalism vs Communism',
    'Yalta to Potsdam: The Breakdown of the Grand Alliance',
    'The Iron Curtain & The Berlin Blockade',
    'Nuclear Brinkmanship: The Cuban Missile Crisis',
    'Asian Proxy Wars: Korea & Vietnam',
    'The Fall of the Berlin Wall & Collapse of the USSR',
    'Living Timeline Synthesis: Was the Cold War Truly Cold?'
  ],
  [
    'Following the defeat of Nazi Germany, the Grand Alliance fractures over irreconcilable worldviews: American liberal democracy and free markets versus Soviet Marxist-Leninist state control and one-party dictatorship.',
    'At Yalta and Potsdam in 1945, Churchill, Roosevelt/Truman, and Stalin clash over the fate of Poland and the four-power division of Germany; Truman’s atomic bomb revelation accelerates Soviet suspicion.',
    'Stalin cuts all road, rail, and canal routes into West Berlin in June 1948; the Western Allies respond with the daring 11-month Berlin Airlift, flying 278,000 supply missions and prompting the formation of NATO.',
    'In October 1962, US U-2 spy planes discover Soviet nuclear missile sites in Cuba; President Kennedy imposes a naval quarantine, bringing humanity to the brink of nuclear war before a secret missile swap resolves the crisis.',
    'Superpower rivalry explodes into proxy warfare in Asia: the 1950–1953 Korean War solidifies the 38th Parallel division, while American intervention in Vietnam demonstrates the brutal human cost of the Domino Theory.',
    'Mikhail Gorbachev introduces Glasnost and Perestroika; on 9 November 1989, joyous crowds dismantle the Berlin Wall, leading to the peaceful collapse of Eastern European regimes and the 1991 dissolution of the USSR.',
    'Across nearly five decades, direct superpower armed conflict was deterred by Mutually Assured Destruction (MAD), but proxy conflicts, arms races, and political repression claimed millions of lives globally.'
  ],
  'Workbook Spread • pp. 10–11'
);

// -------------------------------------------------------------
// 14. WEIMAR & NAZI GERMANY (1918–1939) • Two-Page Workbooks
// -------------------------------------------------------------
const wec = require('./components/weimar_enquiry_configs.cjs');
const wtm = require('./components/weimar_timeline_metadata.cjs');
const weimarList = [];
let wIdx = 0;
for (const [kt, enquiries] of Object.entries(wec.WEIMAR_ENQUIRY_CONFIGS)) {
  for (const [key, enq] of Object.entries(enquiries)) {
    const rawMission = cleanHtml(enq.timelineMission || '');
    const timelineItems = (wtm.WEIMAR_TIMELINES && wtm.WEIMAR_TIMELINES[enq.id]) || [];
    const firstAnchor = timelineItems[0] || {};
    
    let sketchPrompt = rawMission.replace(/^Turn to Pages 2–3[^\.]*\.\s*/i, '');
    let sketchIdeas = [];
    if (sketchPrompt.includes('sketch')) {
      const parts = sketchPrompt.split(/alongside|or|Label|Annotate/i);
      sketchIdeas = parts.slice(0, 3).map(p => p.replace(/^(?:in the drawing box|sketch|a|an)\s+/i, '').trim()).filter(Boolean);
    }
    if (sketchIdeas.length === 0) {
      sketchIdeas = ['🏛️ Reichstag & Democracy', '🪙 Hyperinflation mark', '⚔️ SA stormtroopers'];
    }

    weimarList.push({
      lessonIndex: wIdx,
      lessonId: enq.id,
      milestoneBadge: `Key Topic ${enq.keyTopicBadge || enq.id}`,
      date: firstAnchor.date || '1918–1939',
      title: enq.title || firstAnchor.title || 'Weimar Milestone',
      pageRef: 'Workbook Pages 2–3 • Living Timeline',
      desc: firstAnchor.text || `Timeline milestone for ${enq.title}.`,
      sketchPrompt: sketchPrompt,
      sketchIdeas: sketchIdeas,
      conceptTitle: enq.title.replace(/^KT\d\.\d:\s*/, ''),
      branches: [
        { label: 'Date & Context', value: firstAnchor.date || '1918–1939' },
        { label: 'Core Mechanism', value: enq.specAnchor || enq.title },
        { label: 'Key Consequence', value: firstAnchor.title || 'Turning Point' }
      ],
      fullMissionText: rawMission
    });
    wIdx++;
  }
}
WORKBOOK_TIMELINE_DATA.weimar_nazi_germany = weimarList;

// -------------------------------------------------------------
// 15. EARLY ELIZABETHAN ENGLAND (1558–1588) • Two-Page Workbooks
// -------------------------------------------------------------
const eee = require('./components/eee_enquiry_configs.cjs');
const eeeList = [];
let eIdx = 0;
for (const [kt, enquiries] of Object.entries(eee.EEE_ENQUIRY_CONFIGS)) {
  for (const [key, enq] of Object.entries(enquiries)) {
    const rawMission = cleanHtml(enq.timelineMission || '');
    let sketchPrompt = rawMission.replace(/^Turn to Pages 2–3[^\.]*\.\s*/i, '');
    let sketchIdeas = [];
    if (sketchPrompt.includes('sketch')) {
      const parts = sketchPrompt.split(/alongside|and note|and the|note/i);
      sketchIdeas = parts.slice(0, 3).map(p => p.replace(/^(?:in milestone \d|sketch|a|an|the)\s+/i, '').trim()).filter(Boolean);
    }
    if (sketchIdeas.length === 0) {
      sketchIdeas = ['👑 Tudor Crown', '📖 Book of Common Prayer', '⛵ Golden Hind'];
    }

    eeeList.push({
      lessonIndex: eIdx,
      lessonId: enq.id,
      milestoneBadge: `Key Topic ${enq.keyTopicBadge || enq.id}`,
      date: enq.specAnchor ? enq.specAnchor.match(/\b\d{4}[–\-0-9]*\b/)?.[0] || '1558–1588' : '1558–1588',
      title: enq.title || 'Elizabethan Milestone',
      pageRef: 'Workbook Pages 2–3 • Living Timeline',
      desc: enq.inquiryQuestion || `Historical turning point for ${enq.title}.`,
      sketchPrompt: sketchPrompt,
      sketchIdeas: sketchIdeas,
      conceptTitle: enq.title.replace(/^KT\s*\d\.\d:\s*/, ''),
      branches: [
        { label: 'Syllabus Focus', value: enq.specAnchor || 'Elizabethan Governance' },
        { label: 'Enquiry Challenge', value: enq.inquiryQuestion || enq.title },
        { label: 'Disciplinary Output', value: `${enq.tariff || 'Exam Focus'} (${enq.scoreMax || '4'} marks)` }
      ],
      fullMissionText: rawMission
    });
    eIdx++;
  }
}
WORKBOOK_TIMELINE_DATA.eee = eeeList;

// -------------------------------------------------------------
// 16. EDEXCEL MEDICINE THROUGH TIME (c1250–Present) • 26 Lessons
// -------------------------------------------------------------
const medDb = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'public/database.json'), 'utf8'));
const medLessons = (medDb.edexcel_medicine.data || medDb.edexcel_medicine).lessons || [];
const medModernMissions = [
  'Turn to Pages 2–3 (Key Topic 4.1). In the drawing box, sketch Franklin’s Photograph 51 cross pattern and Watson & Crick’s double helix model. Annotate how base pairing unlocked the causes of hereditary disease!',
  'Turn to Pages 2–3 (Key Topic 4.2). In the drawing box, sketch Bertha Röntgen’s hand X-ray and Godfrey Hounsfield’s circular CT scanner. Annotate how scanning permanently ended blind exploratory surgery!',
  'Turn to Pages 2–3 (Key Topic 4.3). In the drawing box, sketch Ehrlich’s test tube of Salvarsan 606 and the 1948 NHS information leaflet. Annotate how free healthcare abolished medical poverty!',
  'Turn to Pages 2–3 (Key Topic 4.4). In the drawing box, sketch Fleming’s contaminated petri dish and an American 10,000-gallon deep-tank vat. Annotate how penicillin saved Allied troops on D-Day!',
  'Turn to Pages 2–3 (Key Topic 4.5). In the drawing box, sketch a 1950s doctor cigarette advert and a 2016 olive-green plain pack. Annotate how state legislation slashed smoking from 65% to under 13%!'
];
const medWfMissions = [
  'Turn to Pages 2–3 (Milestone 1). Sketch and annotate the zig-zag traverse pattern and low-lying Ypres water table.',
  'Turn to Pages 2–3 (Milestone 2). Draw soldiers applying whale oil and delousing garments in steam ovens.',
  'Turn to Pages 2–3 (Milestone 2). Sketch the Brodie steel helmet and British PH gas hood.',
  'Turn to Pages 2–3 (Milestone 5). Draw the 6 sequential stages of the Chain of Evacuation.',
  'Turn to Pages 2–3 (Milestone 3). Sketch the Thomas Splint groin ring and traction cord.',
  'Turn to Pages 2–3 (Milestone 6). Sketch Oswald Robertson’s iced blood chest and Harold Gillies’ tubed pedicle.'
];

WORKBOOK_TIMELINE_DATA.edexcel_medicine = medLessons.map((l, i) => {
  let targetBadge = 'Medicine Milestone';
  let instruction = '';
  let date = '';
  
  if (l.living_timeline_mission && l.living_timeline_mission.instruction) {
    targetBadge = l.living_timeline_mission.target_milestones || targetBadge;
    instruction = l.living_timeline_mission.instruction;
  } else if (i >= 15 && i < 20) {
    instruction = medModernMissions[i - 15] || '';
    targetBadge = `Key Topic 4.${i - 14}`;
  } else if (i >= 20) {
    instruction = medWfMissions[i - 20] || '';
    targetBadge = `Western Front Milestone ${i - 19}`;
  }

  const dateM = (l.title || '').match(/\b(c\d{3,4}|1\d{3}|20\d{2}[–\-0-9\s]*)\b/i);
  if (dateM) date = dateM[0];
  if (!date && l.timeline_anchor && l.timeline_anchor[0]) {
    date = l.timeline_anchor[0].date || l.timeline_anchor[0].year || '';
  }

  let sketchIdeas = [];
  if (instruction.includes('sketch') || instruction.includes('Draw')) {
    const parts = instruction.split(/alongside|and annotate|and note|and the/i);
    sketchIdeas = parts.slice(0, 3).map(p => p.replace(/^(?:Turn (?:back )?to Pages 2–3[^\.]*\.\s*In the (?:drawing box|sketchpad frame),\s*sketch|sketch|draw|a|an|the)\s+/i, '').trim()).filter(Boolean);
  }
  if (sketchIdeas.length === 0) {
    sketchIdeas = ['🩺 Diagnostic symbol', '💊 Treatment breakthrough', '🔬 Microscopic pathogen'];
  }

  const firstBlock = (l.narrative_blocks && l.narrative_blocks[0]) || {};
  const desc = firstBlock.text ? firstBlock.text.replace(/<[^>]+>/g, '').replace(/\[\d+\.\d+\]/, '').trim().substring(0, 240) + '...' : `Medical milestone for ${l.title}.`;

  return {
    lessonIndex: i,
    lessonId: l.id,
    milestoneBadge: targetBadge,
    date: date || 'Key Milestone',
    title: l.title || 'Medicine Milestone',
    pageRef: 'Workbook Pages 2–3 • Living Timeline',
    desc: desc,
    sketchPrompt: instruction.replace(/^Turn (?:back )?to Pages 2–3[^\.]*\.\s*/i, ''),
    sketchIdeas: sketchIdeas,
    conceptTitle: l.title.replace(/^KT\d\.\d:\s*/, ''),
    branches: [
      { label: 'Date & Context', value: date || 'Historical Period' },
      { label: 'Medical Concept', value: (l.vocab && l.vocab[0]?.term) || 'Key Mechanism' },
      { label: 'Significance', value: (l.vocab && l.vocab[1]?.term) || 'Long-Term Impact' }
    ],
    fullMissionText: instruction
  };
});

// STRICT CHECK: Ensure KS2 (ks2_ww2) is NEVER in WORKBOOK_TIMELINE_DATA
if (WORKBOOK_TIMELINE_DATA.ks2_ww2) {
  delete WORKBOOK_TIMELINE_DATA.ks2_ww2;
}

// Write registry to output file
const fileContent = `/**
 * Master Workbook Timeline Registry
 * 
 * 100% synchronized canonical workbook timeline missions and centrefold milestone data.
 * Extracted directly from official pupil workbook renderers and component specifications.
 * Covers all units with pupil workbooks and physical centrefolds.
 */

export const WORKBOOK_TIMELINE_DATA = ${JSON.stringify(WORKBOOK_TIMELINE_DATA, null, 2)};
`;

fs.writeFileSync(path.join(ROOT_DIR, 'src/engine/workbook_timeline_data.js'), fileContent, 'utf8');
console.log('Successfully written src/engine/workbook_timeline_data.js!');
console.log('Total units registered:', Object.keys(WORKBOOK_TIMELINE_DATA).length);
for (const [k, v] of Object.entries(WORKBOOK_TIMELINE_DATA)) {
  console.log(` - ${k}: ${v.length} lessons`);
}
