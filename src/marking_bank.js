/**
 * src/marking_bank.js
 *
 * Interactive Digital Department Marking Bank & Model Explanations Portal
 * Allows Key Stage 3 pupils to self-check their 6-question printed booklet homework
 * from home via QR code without needing printed answer sheets in their booklet.
 */

// Embedded Great War Part 2 Knowledge Retrieval Companion Questions & Answers
const KS3_MARKING_DATA = {
  great_war_part2: {
    unitTitle: 'The Course of the Great War (1914–1918)',
    subtitle: 'Trench Warfare, Global Empire Troops, The Home Front & The Treaty of Versailles',
    enquiries: [
      {
        number: 1,
        title: '1. 1914 & The Rush to the Colours',
        shortTitle: '1914 & Colours',
        enquiryFocus: 'Why were young British men so desperate to volunteer for the slaughter of 1914?',
        questions: [
          {
            num: 1,
            tier: 'Bronze',
            q: 'Who appeared on famous recruitment posters pointing his finger with the slogan "Your Country Needs You"?',
            a: 'Lord Horatio Kitchener (Secretary of State for War)',
            exp: 'Kitchener predicted a long, grueling war requiring an army of millions, launching mass recruitment campaigns.',
          },
          {
            num: 2,
            tier: 'Bronze',
            q: 'What was the nickname given to battalions of friends, workmates, and neighbours who enlisted together in 1914?',
            a: 'Pals Battalions',
            exp: 'Units like the Accrington Pals and Grimsby Chums allowed men from the same town or factory to serve side-by-side.',
          },
          {
            num: 3,
            tier: 'Silver',
            q: 'Why did hundreds of thousands of young British men rush to enlist in August and September 1914?',
            a: 'A wave of patriotic enthusiasm, peer pressure, and the popular belief the war would be over by Christmas',
            exp: 'Young men viewed enlistment as an exciting adventure, an escape from mundane factory work, and a moral duty.',
          },
          {
            num: 4,
            tier: 'Silver',
            q: 'What symbol of cowardice was publicly handed to young men in civilian clothes on British streets?',
            a: 'A white feather',
            exp: 'The White Feather movement used public humiliation to shame men who had not enlisted into joining the army.',
          },
          {
            num: 5,
            tier: 'Gold',
            q: 'Why did the concept of "Pals Battalions" ultimately prove to be a catastrophic social tragedy?',
            a: 'Catastrophic casualties at the Somme wiped out an entire generation from specific towns on a single day',
            exp: 'When battalions were shattered on 1 July 1916, single communities lost hundreds of young men simultaneously, devastating northern towns.',
          },
          {
            num: 6,
            tier: 'Gold',
            q: 'How did the transition from a small professional army to a mass citizen army transform British society?',
            a: 'It made the war an inescapable national trauma touching every household and community across Britain',
            exp: 'The scale of bereavement transformed political expectations, sparking demands for universal voting rights and social welfare reform.',
          },
        ],
      },
      {
        number: 2,
        title: '2. Trench Warfare & The Haig Controversy (1915–1916)',
        shortTitle: 'Trenches & Haig',
        enquiryFocus: 'Did British generals make the horror of trench warfare worse, or was Haig trapped in an industrial learning curve?',
        questions: [
          {
            num: 7,
            tier: 'Bronze',
            q: 'Which weapon was responsible for approximately 60% of all combat casualties on the Western Front?',
            a: 'Heavy Artillery (high-explosive shells and shrapnel)',
            exp: 'Relentless artillery barrages pulverized trenches, caused catastrophic physical trauma, and induced severe shell shock.',
          },
          {
            num: 8,
            tier: 'Bronze',
            q: 'What painful medical condition was caused by soldiers standing in cold, waterlogged mud for days?',
            a: 'Trench Foot',
            exp: 'Prolonged exposure to damp mud caused fungal infection, numbness, and gangrene, often requiring amputation.',
          },
          {
            num: 9,
            tier: 'Silver',
            q: 'Why were frontline trenches constructed in a zig-zag or traverse pattern rather than straight lines?',
            a: 'To prevent enemy machine-gunners from firing along the whole trench and to contain artillery blast shockwaves',
            exp: 'The angular layout prevented enfilade fire and ensured that an artillery shell detonating in a trench contained its blast to a single bay.',
          },
          {
            num: 10,
            tier: 'Silver',
            q: 'Why did the week-long British artillery bombardment fail to destroy German defenses before the Somme in 1916?',
            a: 'A third of the shells were duds and deep German concrete bunkers protected troops underground',
            exp: 'When the bombardment lifted, German machine-gunners emerged from deep dugouts to mow down British infantry crossing No Man’s Land.',
          },
          {
            num: 11,
            tier: 'Gold',
            q: 'Why is Field Marshal Sir Douglas Haig remembered both as the "Butcher of the Somme" and the architect of victory?',
            a: 'Critics condemn his costly attrition tactics, while defenders argue he adapted modern technology to win in 1918',
            exp: 'Haig presided over 57,000 casualties on 1 July 1916, but later mastered combined-arms warfare in the decisive 1918 Hundred Days Offensive.',
          },
          {
            num: 12,
            tier: 'Gold',
            q: 'How did the development of tanks and creeping barrages eventually break the trench deadlock in 1918?',
            a: 'Combined-arms coordination crushed barbed wire and suppressed machine guns, restoring mobility',
            exp: 'Allied coordination of artillery, tanks, infantry, and aircraft replaced suicidal frontal charges with rapid mobile breakthroughs.',
          },
        ],
      },
      {
        number: 3,
        title: '3. Global Empire & The Forgotten Fronts (1914–1918)',
        shortTitle: 'Global Empire Fronts',
        enquiryFocus: 'Why were over four million colonial and dominion troops erased from popular memory?',
        questions: [
          {
            num: 13,
            tier: 'Bronze',
            q: 'Approximately how many Indian soldiers and labourers served the British Empire during the Great War?',
            a: 'Over 1.3 million Indian soldiers and personnel',
            exp: 'Indian regiments fought in the freezing mud of Ypres, in Mesopotamia (Iraq), and across the deserts of Palestine.',
          },
          {
            num: 14,
            tier: 'Bronze',
            q: 'What acronym was given to the Australian and New Zealand Army Corps who landed at Gallipoli in 1915?',
            a: 'The ANZACs',
            exp: 'The catastrophic Gallipoli campaign against the Ottoman Empire became a defining foundation of Australian and New Zealand national identity.',
          },
          {
            num: 15,
            tier: 'Silver',
            q: 'What strategic objective did Winston Churchill hope to achieve by attacking the Ottoman Empire at Gallipoli in 1915?',
            a: 'Knock the Ottoman Empire out of the war and open a Black Sea supply route to Russia',
            exp: 'Churchill sought an indirect maritime route to relieve pressure on the Western Front, but Ottoman forces pinned the Allies to the beaches.',
          },
          {
            num: 16,
            tier: 'Silver',
            q: 'Why were soldiers of the British West Indies Regiment often denied front-line combat roles?',
            a: 'Racial prejudice from British authorities restricted Black colonial troops to heavy labouring and ammunition loading',
            exp: 'Despite volunteering eagerly, colonial authorities feared training Black soldiers in combat arms would threaten postwar imperial rule.',
          },
          {
            num: 17,
            tier: 'Gold',
            q: 'Why was the global contribution of colonial and African troops largely erased from popular British memory after 1918?',
            a: 'Postwar imperial propaganda centered national remembrance exclusively on white European soldiers on the Western Front',
            exp: 'War memorials and histories celebrated British sacrifices in Flanders, sidelining the hundreds of thousands of African, Indian, and Caribbean troops.',
          },
          {
            num: 18,
            tier: 'Gold',
            q: 'How did participation in the Great War accelerate demands for national independence across the British Empire?',
            a: 'Colonial troops who fought for "freedom in Europe" returned home demanding equal political self-determination',
            exp: 'Sacrifices made by Indian and African soldiers undermined European claims of racial superiority and catalyzed early anti-colonial movements.',
          },
        ],
      },
      {
        number: 4,
        title: '4. The Home Front & Women’s Total War (1914–1918)',
        shortTitle: 'Home Front & Women',
        enquiryFocus: 'How far did the First World War transform the British state and daily life on the Home Front?',
        questions: [
          {
            num: 19,
            tier: 'Bronze',
            q: 'What landmark law passed in August 1914 gave the British government sweeping emergency powers over daily life?',
            a: 'DORA (Defence of the Realm Act)',
            exp: 'DORA permitted the government to censor newspapers, take over factories, nationalize railways, and dilute beer.',
          },
          {
            num: 20,
            tier: 'Bronze',
            q: 'What nickname was given to female munitions workers whose skin turned yellow from handling toxic TNT chemicals?',
            a: '"Canary Girls"',
            exp: 'Toxic exposure to sulphuric acid and TNT stained skin yellow, damaged lungs, and caused early miscarriages in munitions plants.',
          },
          {
            num: 21,
            tier: 'Silver',
            q: 'Why was compulsory conscription introduced for unmarried British men aged 18 to 41 in January 1916?',
            a: 'Voluntary enlistment collapsed while devastating casualties on the Western Front created an acute manpower shortage',
            exp: 'The bloody slaughter at Neuve Chapelle and Loos exhausted the volunteer army, forcing Prime Minister Asquith to pass the Military Service Act.',
          },
          {
            num: 22,
            tier: 'Silver',
            q: 'Why did the British government introduce compulsory food rationing for sugar, butter, and meat in early 1918?',
            a: 'German Unrestricted Submarine Warfare sank merchant ships, causing severe civilian food shortages and panic buying',
            exp: 'U-boats sank hundreds of cargo vessels in the Atlantic, threatening Britain with starvation until rationing ensured equitable food sharing.',
          },
          {
            num: 23,
            tier: 'Gold',
            q: 'How did women’s wartime work permanently shatter traditional Victorian gender stereotypes?',
            a: 'Women could capably perform heavy industrial labor, operate machinery, and sustain the war economy',
            exp: 'Nearly a million women worked in munitions, transport, and agriculture, disproving Victorian arguments that women were physically and mentally frail.',
          },
          {
            num: 24,
            tier: 'Gold',
            q: 'To what extent did women’s war work directly lead to women gaining the parliamentary vote in 1918?',
            a: 'It created an undeniable moral debt, though the 1918 Act granted votes only to women over 30 with property',
            exp: 'Politicians could not deny the vote to women who saved the nation, but established older age thresholds to avoid a female voting majority.',
          },
        ],
      },
      {
        number: 5,
        title: '5. The Treaty of Versailles & The Flawed Peace (1918–1919)',
        shortTitle: 'Versailles & Flawed Peace',
        enquiryFocus: 'Did the Treaty of Versailles solve the problems of 1914, or create the nightmares of 1939?',
        questions: [
          {
            num: 25,
            tier: 'Bronze',
            q: 'In what famous hall was the Treaty of Versailles signed on 28 June 1919, exactly five years after the assassination at Sarajevo?',
            a: 'The Hall of Mirrors in the Palace of Versailles',
            exp: 'The French deliberately chose the Hall of Mirrors where the German Empire had been proclaimed in 1871 after France’s defeat in the Franco-Prussian War.',
          },
          {
            num: 26,
            tier: 'Bronze',
            q: 'What controversial clause in the Treaty of Versailles (Article 231) forced Germany to accept sole moral blame for causing the war?',
            a: 'The "War Guilt" Clause (Article 231)',
            exp: 'Article 231 provided the legal justification for the Allies to demand massive financial reparations to compensate for civilian damages.',
          },
          {
            num: 27,
            tier: 'Silver',
            q: 'What staggering sum of financial reparations did the Inter-Allied Reparations Commission set for Germany to pay in 1921?',
            a: '£6.6 billion (132 billion gold marks)',
            exp: 'British economist John Maynard Keynes resigned from the peace delegation in protest, warning this unpayable sum would ruin the European economy.',
          },
          {
            num: 28,
            tier: 'Silver',
            q: 'Why did German politicians and the public universally denounce the Treaty of Versailles as an unfair "Diktat"?',
            a: 'Germany was entirely excluded from negotiations and forced to sign under threat of an immediate Allied military invasion',
            exp: 'The German delegation was presented with a completed draft and given just three weeks to submit written objections before being ordered to sign.',
          },
          {
            num: 29,
            tier: 'Gold',
            q: 'How did the military restrictions of Versailles aim to prevent Germany from ever launching an offensive war again?',
            a: 'The army was capped at 100,000 volunteers, conscription was banned, tanks and warplanes were prohibited, and the Rhineland was demilitarised',
            exp: 'These terms reduced Germany’s military to a domestic border security force, though right-wing nationalists deeply resented the disarmament.',
          },
          {
            num: 30,
            tier: 'Gold',
            q: 'Why did British political cartoonist Will Dyson portray a weeping toddler labeled "1940 Class" outside the Versailles peace conference?',
            a: 'He prophetically warned that the punitive terms would breed resentment, leading children born in 1919 to fight another world war by 1940',
            exp: 'Dyson’s cartoon, "Peace and Future Cannon Fodder", showed Georges Clemenceau saying "Curious! I seem to hear a child weeping!", predicting World War II.',
          },
        ],
      },
    ],
  },
  ks2_romans: {
    unitTitle: 'The Romans in Britain — Invasion, Resistance & Legacy (55 BC–AD 410)',
    subtitle: '24-Question Master Retrieval Check & Self-Marking Key (Enquiries 01–06)',
    enquiries: [
      {
        number: 1,
        title: 'Enquiry 01: Celtic Britain Before the Romans (c. 500 BC – AD 43)',
        shortTitle: 'Celtic Britain',
        enquiryFocus: 'Who were the Iron Age Celts, and how did they live before the Roman legions arrived?',
        questions: [
          { num: 1, tier: 'Recall', q: 'What mixture of woven sticks, clay, mud, and straw sealed Iron Age roundhouse walls?', a: 'Wattle and daub.', exp: 'Woven hazel branches (wattle) plastered with clay, straw, and animal dung (daub) kept roundhouses warm and windproof.' },
          { num: 2, tier: 'Explain', q: 'Why did Iron Age builders give thatched roundhouse roofs no chimney hole at the top?', a: 'A chimney hole would pull air upwards like a wind tunnel and set the dry straw roof on fire.', exp: 'Experimental archaeology at Butser Ancient Farm proved smoke filtered safely out through the thatch while preserving smoked meat.' },
          { num: 3, tier: 'Recall', q: 'What was a Celtic "torc", and what did wearing one show?', a: 'A heavy twisted neck ring of gold, silver, or bronze worn by rulers and warriors to show status and wealth.', exp: 'The Snettisham Great Torc in Norfolk was twisted from eight ropes of 64 gold and silver threads weighing over a kilogram.' },
          { num: 4, tier: 'Recall', q: 'In which two years did Julius Caesar sail across the Channel to Britain before returning to Gaul?', a: '55 BC and 54 BC.', exp: 'Caesar landed in Kent twice and fought British chariots, but storms and rebellions in Gaul meant Rome waited 97 years to conquer Britain.' },
        ],
      },
      {
        number: 2,
        title: 'Enquiry 02: Why Did Emperor Claudius Invade Britain in AD 43?',
        shortTitle: 'Claudius AD 43',
        enquiryFocus: 'Why did Emperor Claudius send 40,000 Roman soldiers and war elephants across the sea in AD 43?',
        questions: [
          { num: 5, tier: 'Explain', q: 'Give two reasons why Emperor Claudius launched a full invasion of Britain in AD 43.', a: 'Claudius needed a famous military triumph to win respect in Rome, and Rome wanted Britain’s tin, silver, lead, iron, and grain.', exp: 'Powerful Roman senators doubted Claudius because he had never led an army, while British metals and taxes promised rich rewards.' },
          { num: 6, tier: 'Recall', q: 'Where in Kent did General Aulus Plautius land 40,000 Roman soldiers in spring AD 43?', a: 'Richborough in Kent (followed by victory at the two-day Battle of the River Medway).', exp: 'Four Roman legions and 20,000 auxiliary troops built defensive ditches at Richborough before crossing the Medway and Thames.' },
          { num: 7, tier: 'Detail', q: 'What was the Roman "testudo" (tortoise) formation, and how did it protect legionaries?', a: 'Soldiers locked rectangular shields (scuta) in front and overhead like a tortoise shell to block spears, stones, and arrows.', exp: 'Full-time Roman legionaries practised shield-wall drills daily and wore flexibleoverlapping iron strip armour (lorica segmentata).' },
          { num: 8, tier: 'Recall', q: 'What astonishing animals did Claudius bring when marching into Camulodunum (Colchester)?', a: 'War elephants.', exp: 'Eleven British kings surrendered at Camulodunum, Britain became the Roman province of Britannia, and Caratacus fled west to Wales.' },
        ],
      },
      {
        number: 3,
        title: "Enquiry 03: Boudicca's Rebellion — Why Did the Iceni Rise Up? (AD 60–61)",
        shortTitle: "Boudicca's Revolt",
        enquiryFocus: 'Why did Queen Boudicca lead a huge rebellion against Rome in AD 60, and why did it fail?',
        questions: [
          { num: 9, tier: 'Explain', q: 'How did Roman officials break their promise to the Iceni after King Prasutagus died in AD 60?', a: 'Officials seized Iceni lands, demanded loans back, flogged Queen Boudicca, and attacked her two daughters.', exp: 'Prasutagus had left half his kingdom to Emperor Nero trusting Rome to protect his family, sparking fury among the Iceni and Trinovantes.' },
          { num: 10, tier: 'Recall', q: 'Which three Roman towns did Boudicca’s rebel army burn down, leaving a red burnt clay layer underground?', a: 'Camulodunum (Colchester), Londinium (London), and Verulamium (St Albans).', exp: 'Archaeologists digging beneath all three modern cities still uncover the 40cm "Boudiccan Destruction Horizon" of red ash and melted coins.' },
          { num: 11, tier: 'Explain', q: 'How did Governor Suetonius Paulinus defeat Boudicca’s much larger army at the Battle of Watling Street?', a: 'He chose a narrow valley between thick woods so rebels could not surround his 10,000 legionaries, threw javelins, and advanced in wedges.', exp: 'Tight Roman discipline turned the rebels’ huge numbers against them when retreating warriors were trapped against their own family wagons.' },
          { num: 12, tier: 'Detail', q: 'Why do historians read Roman writer Tacitus carefully when studying Queen Boudicca?', a: 'Because Iceni Britons left no written books, and Tacitus was the son-in-law of Roman general Agricola.', exp: 'Even though Tacitus wrote from a Roman viewpoint, he still admitted Roman greed and cruelty caused the rebellion.' },
        ],
      },
      {
        number: 4,
        title: "Enquiry 04: Hadrian's Wall & Diverse Soldiers on the Frontier (AD 122–400)",
        shortTitle: "Hadrian's Wall",
        enquiryFocus: 'Why did Emperor Hadrian build a 73-mile stone wall across northern Britain, and who guarded it?',
        questions: [
          { num: 13, tier: 'Recall', q: 'In what year did Emperor Hadrian order his 73-mile frontier wall built across northern Britain?', a: 'AD 122 (stretching 80 Roman miles from Wallsend on the River Tyne to Bowness-on-Solway).', exp: 'Guarded gatehouses called Milecastles stood every Roman mile alongside 16 large forts like Housesteads to control raids and trade taxes.' },
          { num: 14, tier: 'Detail', q: 'What everyday items were written on the 2,000-year-old wooden ink letters found at Vindolanda Fort?', a: 'Parcels of woollen socks, sandals, and underpants, duty rosters, and Claudia Severa’s birthday party invitation.', exp: 'Claudia Severa’s wooden tablet to her sister-friend Sulpicia Lepidina contains the earliest surviving Latin handwriting by a woman!' },
          { num: 15, tier: 'Detail', q: 'Name two distant regions outside Britain from which auxiliary soldiers came to guard Hadrian’s Wall.', a: 'Any two from: North Africa (Aurelian Moors at Burgh-by-Sands), Syria (Hamian archers / Barates of Palmyra), Batavia, Gaul, Spain, or Dacia.', exp: 'Roman Britain’s northern frontier brought together soldiers, merchants, and families from three continents.' },
          { num: 16, tier: 'Recall', q: 'Who were Regina and Barates on the carved Roman tombstone found at Arbeia Fort (South Shields)?', a: 'Regina was a freed Catuvellauni British woman and Barates was her husband from Palmyra in Syria.', exp: 'Barates carved her tombstone in both Latin and Aramaic script, showing multicultural family life in Roman Britain.' },
        ],
      },
      {
        number: 5,
        title: 'Enquiry 05: Life in Roman Towns — Roads, Baths & Villas',
        shortTitle: 'Towns & Baths',
        enquiryFocus: 'How did Roman roads, bathhouses, and stone towns transform everyday life in Britain?',
        questions: [
          { num: 17, tier: 'Explain', q: 'Why did Roman engineers curve (camber) stone roads and dig ditches along both sides?', a: 'So rainwater drained straight off the road into the side ditches instead of turning the highway into deep mud.', exp: 'Surveyors used a wooden groma to lay 10,000 miles of straight highways linking bustling market forums and basilicas.' },
          { num: 18, tier: 'Recall', q: 'What was the Roman name for Bath, and what were the thin lead sheets thrown into its hot spring?', a: 'Aquae Sulis; lead curse tablets asking goddess Sulis Minerva to punish thieves who stole cloaks or coins.', exp: 'Bathers exercised, visited warm and hot steam rooms (tepidarium and caldarium), and scraped oil off with a curved bronze strigil.' },
          { num: 19, tier: 'Recall', q: 'How did a Roman "hypocaust" system heat wealthy stone villas from underneath?', a: 'A furnace pushed hot air between stacks of clay tiles beneath raised mosaic floors and up hollow wall flues.', exp: 'Palaces like Fishbourne in Sussex featured hypocaust underfloor heating and floors made from thousands of tiny stone tesserae.' },
          { num: 20, tier: 'Explain', q: 'Did everyone in Roman Britain live in a stone villa with mosaic floors?', a: 'No — nearly 9 out of 10 Britons still lived and farmed in countryside roundhouses, though they paid Roman taxes and bought Roman pottery.', exp: 'Historians spot both dramatic change in wealthy towns and strong continuity across rural villages.' },
        ],
      },
      {
        number: 6,
        title: "Enquiry 06: Farewell to the Legions — What Was Rome's Lasting Legacy? (AD 410 & Beyond)",
        shortTitle: 'Legacy AD 410',
        enquiryFocus: 'Why did the Roman army leave Britain around AD 410, and what did the Romans leave behind for us today?',
        questions: [
          { num: 21, tier: 'Explain', q: 'Why were Roman legions called away from Britain around AD 407–410, and what did Emperor Honorius tell British towns?', a: 'Picts, Scotti, and Saxons raided Britain while enemy armies attacked Italy; in AD 410 Honorius told British towns to defend themselves.', exp: 'Rome needed every soldier to defend the heart of the Western Empire, ending nearly 370 years of Roman military rule in Britain.' },
          { num: 22, tier: 'Recall', q: 'Why did families bury treasures like the Hoxne Hoard (15,000 coins and silver pepper pots) around AD 407–410?', a: 'To hide their family savings safely underground during raids, intending to dig them back up when peace returned.', exp: 'Because the owners never returned, archaeologists recovered gold bracelets, silver spoons, and coins of Emperor Honorius in Suffolk in 1992.' },
          { num: 23, tier: 'Detail', q: 'What does a modern British town name ending in "-chester", "-caster", or "-cester" tell us?', a: 'It grew out of a Roman fort or walled camp (from the Latin word "castra").', exp: 'Manchester, Lancaster, Chester, Cirencester, Gloucester, and Winchester all stand on Roman fortresses or walled towns!' },
          { num: 24, tier: 'Recall', q: 'Name three everyday things in modern Britain that are part of Rome’s lasting legacy.', a: 'Any three from: London and straight A-roads (Watling Street/Fosse Way), Latin ABC alphabet and words, Roman numerals, 12-month calendar (July/August), Christianity, or foods like apples, pears, onions, cabbages, and rabbits.', exp: 'Even after stone bathhouses crumbled, Roman ideas, routes, language, and cities shaped Britain permanently.' },
        ],
      },
    ],
  },
  ks2_stone_to_iron_age: {
    unitTitle: 'Stone Age to Iron Age Britain — Hunter-Gatherers to Hillforts (c. 800,000 BC–AD 43)',
    subtitle: '24-Question Master Retrieval Check & Self-Marking Key (Enquiries 01–06)',
    enquiries: [
      {
        number: 1,
        title: 'Enquiry 01: Ice Age Hunters & Sunken Doggerland (c. 800,000–4000 BC)',
        shortTitle: 'Ice Age & Doggerland',
        enquiryFocus: 'How did hunter-gatherers survive the Ice Age, and how did Britain become an island?',
        questions: [
          { num: 1, tier: 'Recall', q: 'What does the word "prehistory" mean, and how do archaeologists find out about it without written books?', a: 'Prehistory means the time before written records began in Britain; archaeologists study buried clues like flint tools, bones, houses, and pollen.', exp: 'Over 99% of human time in Britain happened during prehistory before AD 43!' },
          { num: 2, tier: 'Explain', q: 'How did Palaeolithic families make flint handaxes, and why did they move camp instead of living in one village?', a: 'They chipped ("knapped") flint nodules with hammerstones into sharp teardrop blades, and moved camp to follow wild mammoth, horse, and deer herds.', exp: 'Without farms or storage pots, hunter-gatherers followed seasonal animals, nuts, and berries.' },
          { num: 3, tier: 'Detail', q: 'What astonishing 11,000-year-old objects did archaeologists find in the peat beside an ancient lake at Star Carr in Yorkshire?', a: 'Britain’s oldest wooden house platform and 21 carved red-deer skull and antler headdresses.', exp: 'Star Carr proves Mesolithic Britons were skilled carpenters and held woodland ceremonies.' },
          { num: 4, tier: 'Explain', q: 'What was Doggerland, and how did Britain become an island around 6500 BC?', a: 'Doggerland was the wide, grassy land bridge joining Britain to Europe; melting Ice Age glaciers raised North Sea levels and flooded it around 6500 BC.', exp: 'North Sea fishing trawlers still drag up mammoth tusks and bone harpoons from sunken Doggerland!' },
        ],
      },
      {
        number: 2,
        title: 'Enquiry 02: The First Farmers & Skara Brae (c. 4000–2500 BC)',
        shortTitle: 'Skara Brae & Farming',
        enquiryFocus: 'How did farming change everyday life in Britain, and what did the storm uncover at Skara Brae?',
        questions: [
          { num: 5, tier: 'Recall', q: 'Which crops and tame animals did the first Neolithic farmers bring across the sea to Britain around 4000 BC?', a: 'Wheat and barley seeds alongside tame sheep, goats, cattle, and pigs.', exp: 'Wild ancestors of wheat and sheep came originally from the Fertile Crescent and spread across Europe by boat.' },
          { num: 6, tier: 'Explain', q: 'Why did Neolithic farmers grind polished stone axes smooth and start making coiled clay pots?', a: 'Polished stone axes felled forest trees without shattering, while clay pots cooked porridge and stored dry grain safely through winter.', exp: 'Clearing forests for crops and pastures created Britain’s first permanent villages.' },
          { num: 7, tier: 'Detail', q: 'How was the 5,000-year-old village of Skara Brae in Orkney rediscovered in winter 1850?', a: 'A fierce winter storm tore away grass and sand dunes on Mainland Orkney, uncovering eight stone houses.', exp: 'Sand had sealed the village like a time capsule for over 4,300 years.' },
          { num: 8, tier: 'Explain', q: 'Why did villagers at Skara Brae build beds, shelved dressers, and walls out of stone slabs instead of wood?', a: 'Windy Orkney had very few tall trees for timber, whereas flat sandstone slabs split neatly along the seashore.', exp: 'Houses were sunk into warm earth mounds with central hearths, roofed passages, and indoor drains.' },
        ],
      },
      {
        number: 3,
        title: 'Enquiry 03: Secrets of Stonehenge — Giant Stones & Winter Feasts (c. 3000–2200 BC)',
        shortTitle: 'Stonehenge Builders',
        enquiryFocus: 'How and why did prehistoric communities build Stonehenge without wheels, cranes, or metal tools?',
        questions: [
          { num: 9, tier: 'Recall', q: 'What tools did Neolithic workers use around 3000 BC to dig Stonehenge’s first circular chalk ditch and bank?', a: 'Red-deer antler picks and cattle shoulder-blade shovels.', exp: 'Stonehenge was built in stages over nearly 1,000 years—over 2,000 years before Iron Age Celtic Druids!' },
          { num: 10, tier: 'Detail', q: 'From how far away were Stonehenge’s spotted bluestones hauled, and how heavy were the biggest grey sarsen stones?', a: 'Bluestones came over 150 miles from the Preseli Hills in West Wales; the biggest Wiltshire sarsens weighed 25 to 30 tonnes.', exp: 'Teams dragged stones on wooden sledges and greased timber rails before tipping them upright with earth ramps.' },
          { num: 11, tier: 'Explain', q: 'How did Neolithic masons lock horizontal lintel stones onto upright sarsen pillars without cement or nails?', a: 'They pounded interlocking stone pegs and holes ("mortise-and-tenon" and tongue-and-groove joints) just like woodworking!', exp: 'Those stone joints have kept 7-tonne lintels balanced high in the air for 4,500 years.' },
          { num: 12, tier: 'Explain', q: 'What clues at nearby Durrington Walls show how people used Stonehenge in midwinter and midsummer?', a: 'Thousands of pig and cattle bones prove families travelled from across Britain (even Scotland) for midwinter feasts aligned with the Solstice sun.', exp: 'Stonehenge also held over 150 cremation burials, honouring ancestors and the solar calendar together.' },
        ],
      },
      {
        number: 4,
        title: 'Enquiry 04: Enter the Bronze Age — Beakers, Metal & The Amesbury Archer (c. 2500–1200 BC)',
        shortTitle: 'Bronze & Amesbury Archer',
        enquiryFocus: 'Who was the Amesbury Archer, and how did bronze metalwork transform prehistoric Britain?',
        questions: [
          { num: 13, tier: 'Recall', q: 'Which two metals did Bronze Age smiths melt together at 1,000°C to make bronze, and where in Britain were they mined?', a: 'Copper (mined in tunnels like Great Orme in North Wales) mixed with rare Tin (from Cornwall and Devon).', exp: 'Roughly 90% copper + 10% tin created a hard golden-brown alloy.' },
          { num: 14, tier: 'Explain', q: 'Why was a cast bronze axe a huge improvement over a chipped Stone Age flint axe?', a: 'Liquid bronze could be poured into two-piece moulds in sharp shapes, and if a bronze axe snapped it could be melted down and recast!', exp: 'When a flint axe snapped, it could never be melted back together.' },
          { num: 15, tier: 'Detail', q: 'What treasures were buried with the Amesbury Archer (c. 2300 BC), and what did tests on his tooth enamel prove?', a: 'Over 100 items including 5 Beaker pots, 3 copper knives, flint arrowheads, gold hair rings, and a metalworking stone; tooth enamel proved he grew up near the Alps!', exp: 'Chemical oxygen isotopes from childhood mountain drinking water stayed locked in his teeth.' },
          { num: 16, tier: 'Recall', q: 'What famous Bronze Age treasure found in North Wales was hammered from a single lump of gold?', a: 'The Mold Gold Cape (c. 1900–1600 BC).', exp: 'Now in the British Museum, its hundreds of tiny ribs show extraordinary Bronze Age wealth and artistry.' },
        ],
      },
      {
        number: 5,
        title: 'Enquiry 05: "Britain\'s Pompeii" — Everyday Life at Must Farm (c. 1200–800 BC)',
        shortTitle: 'Must Farm Village',
        enquiryFocus: 'What does the burnt stilt village at Must Farm reveal about everyday Bronze Age families?',
        questions: [
          { num: 17, tier: 'Explain', q: 'Why did archaeologists nickname the Late Bronze Age village at Must Farm in Cambridgeshire "Britain’s Pompeii"?', a: 'Around 850 BC a sudden fire dropped five stilt roundhouses into wet, oxygen-free river mud that preserved everyday life like a time capsule.', exp: 'Happily, zero human bodies died in the fire—all the families escaped safely!' },
          { num: 18, tier: 'Detail', q: 'Name four everyday things preserved in the airless mud at Must Farm that normally rot away on dry land.', a: 'Any four from: Britain’s oldest complete wooden wheel, fine woven flax/bark cloth, wooden handles on bronze axes, wicker eel traps, or bowls of porridge with wooden spoons.', exp: 'Bacteria that rot wood and cloth cannot survive in wet, oxygen-free Fenland silt.' },
          { num: 19, tier: 'Recall', q: 'Where had the tiny turquoise glass beads found in necklaces at Must Farm been traded from?', a: 'All the way from the Mediterranean and the Middle East!', exp: 'Along with the stitched oak Dover Bronze Age Boat, they prove long-distance sea and river trade.' },
          { num: 20, tier: 'Explain', q: 'Why did Bronze Age people deliberately drop valuable bronze swords and shields into sacred waters at Flag Fen?', a: 'As precious religious offerings to water spirits or gods (not dropped by accident!).', exp: 'Over 300 bronze weapons and pins were placed along the timber causeway at Flag Fen.' },
        ],
      },
      {
        number: 6,
        title: 'Enquiry 06: Iron Age Celts & Giant Hillforts — On the Eve of Rome (c. 800 BC–AD 43)',
        shortTitle: 'Iron Age Hillforts',
        enquiryFocus: 'How did iron tools, roundhouses, and giant hillforts shape Celtic Britain before the Romans arrived?',
        questions: [
          { num: 21, tier: 'Explain', q: 'Give two reasons why red-hot hammered iron replaced bronze for ploughs, axes, and swords after 800 BC.', a: 'Iron ore was common across Britain (no rare tin needed) AND hammered iron stayed harder and tougher for ploughing heavy clay soils.', exp: 'Iron-tipped ploughs and rotary quern stones helped feed a rapidly growing population.' },
          { num: 22, tier: 'Explain', q: 'Why didn’t Iron Age thatched roundhouses have a chimney hole at the top of the roof?', a: 'A roof hole causes dangerous wind sparks; without a chimney, smoke drifted gently through the thatch, smoking meat and keeping insects out.', exp: 'Reconstructions at Butser Ancient Farm proved how warm and safe cone-roofed roundhouses were.' },
          { num: 23, tier: 'Detail', q: 'How did giant earthwork hillforts like Maiden Castle in Dorset protect and serve Iron Age Celtic tribes?', a: 'Towering chalk ramparts, deep ditches, and maze-like gates defended against raids while protecting grain stores, workshops, and tribal markets.', exp: 'Maiden Castle’s ramparts enclosed an area the size of 47 football pitches!' },
          { num: 24, tier: 'Recall', q: 'What treasures prove Celtic Britain was rich and skilled before Emperor Claudius’s Roman invasion of AD 43?', a: 'Twisted gold neck-rings (Snettisham Great Torc), swirling bronze shields (Battersea Shield), and stamped tribal gold coins (staters).', exp: 'In AD 43 Roman legions brought written records to Britain, ending prehistory and beginning Roman Britain!' },
        ],
      },
    ],
  },
  ks2_anglo_saxons_vikings: {
    unitTitle: 'Anglo-Saxons & Vikings — Struggle for the Kingdom of England (AD 410–1066)',
    subtitle: '24-Question Master Retrieval Check & Self-Marking Key (Enquiries 01–06)',
    enquiries: [
      {
        number: 1,
        title: 'Enquiry 01: After the Romans Left — Angles, Saxons & Jutes (c. AD 410–600)',
        shortTitle: 'Saxon Settlement',
        enquiryFocus: 'Who were the Angles, Saxons, and Jutes, and why did they cross the North Sea to settle in Britain after AD 410?',
        questions: [
          { num: 1, tier: 'Explain', q: 'Give one "push" reason and one "pull" reason why Angles, Saxons, and Jutes crossed the North Sea to Britain.', a: 'Push: salty tides flooded coastal farms in Jutland and northern Germany; Pull: fertile British farmland and no Roman legions after AD 410.', exp: 'Bede also recorded that British leaders first invited Jutish and Saxon warriors as mercenaries to fight northern raiders in return for land.' },
          { num: 2, tier: 'Recall', q: 'What materials did Anglo-Saxon villagers at sites like West Stow use to build their halls and houses?', a: 'Sturdy oak timber planks, woven wattle-and-daub walls, and steep thatched straw or reed roofs.', exp: 'Rather than repairing crumbling Roman stone villas, settlers built warm timber halls around a central hearth fire.' },
          { num: 3, tier: 'Detail', q: 'Name four of the seven major Anglo-Saxon kingdoms known as the Heptarchy.', a: 'Any four from: Northumbria, Mercia, East Anglia, Essex, Kent, Sussex, Wessex.', exp: 'For centuries lowland Britain was divided into rival kingdoms before "Angle-land" (England) was united.' },
          { num: 4, tier: 'Recall', q: 'Which two pagan Anglo-Saxon gods gave their names to Wednesday and Thursday?', a: 'Woden (Wednesday = Woden’s day) and Thunor (Thursday = Thunor’s day).', exp: 'Tiw also gave Tuesday and Frige gave Friday, while village endings like -ham and -ton mark early Anglo-Saxon settlements!' },
        ],
      },
      {
        number: 2,
        title: 'Enquiry 02: Ship Burials & Monasteries — Sutton Hoo & Christian Monks (c. AD 597–750)',
        shortTitle: 'Sutton Hoo & Bede',
        enquiryFocus: 'What does the Sutton Hoo ship burial reveal about Anglo-Saxon kings, and how did Christianity change Britain?',
        questions: [
          { num: 5, tier: 'Explain', q: 'Why did archaeologists in 1939 find no wooden planks or human skeleton inside Mound 1 at Sutton Hoo?', a: 'Suffolk’s acidic sandy soil completely rotted away organic wood and human bones over 1,300 years, leaving rows of iron ship rivets.', exp: 'Edith Pretty and archaeologist Basil Brown uncovered the ghostly 27-metre ship outline and dazzling burial chamber.' },
          { num: 6, tier: 'Detail', q: 'How do treasures inside Sutton Hoo (likely King Raedwald, c. AD 625) prove Britain was NOT in a backward "Dark Age"?', a: 'The dragon-browed iron helmet and gold clasps inlaid with garnets from Sri Lanka, Byzantine silver spoons, and Frankish coins prove master art and long-distance trade.', exp: 'The burial linked East Anglia to trade networks stretching across Europe, Constantinople, and South Asia.' },
          { num: 7, tier: 'Recall', q: 'From which two directions did missionaries Augustine (AD 597) and Aidan (AD 635) bring Christianity to Anglo-Saxon kingdoms?', a: 'Augustine came from Rome to Canterbury in Kent (AD 597); Aidan came from Iona in Scotland to Lindisfarne in Northumbria (AD 635).', exp: 'Monasteries became centres of reading, stone architecture, calfskin vellum manuscripts, and illuminated art like the Lindisfarne Gospels.' },
          { num: 8, tier: 'Recall', q: 'Which Northumbrian monk at Jarrow wrote the History of the English Church and People in AD 731?', a: 'The Venerable Bede.', exp: 'Bede popularized counting dates from AD ("Anno Domini") and earned the title "Father of English History".' },
        ],
      },
      {
        number: 3,
        title: 'Enquiry 03: Fury of the Northmen — Lindisfarne & The Great Heathen Army (AD 793–878)',
        shortTitle: 'Lindisfarne & Raids',
        enquiryFocus: 'Why did Viking raiders cross the sea from Scandinavia in AD 793, and how did the Great Heathen Army nearly conquer all England?',
        questions: [
          { num: 9, tier: 'Explain', q: 'Why did Viking raiders target island and coastal monasteries like Lindisfarne on 8 June AD 793?', a: 'Monasteries stood isolated right beside the sea, held rich silver chalices and jewelled Gospel covers, and were guarded only by unarmed monks.', exp: 'The surprise attack shocked Christian courts right across Britain and Europe.' },
          { num: 10, tier: 'Explain', q: 'How did clinker-built oak longships allow Vikings to cross stormy oceans AND strike inland English towns?', a: 'Overlapping oak planks flexed over ocean waves under a wool sail, while a shallow 1-metre hull let crews row straight up shallow rivers and beach on sand.', exp: 'Longships needed no deep harbours and could reverse direction rapidly.' },
          { num: 11, tier: 'Recall', q: 'Did real Viking warriors wear horned helmets in battle?', a: 'No — zero Viking helmets ever found have horns (real helmets like Coppergate and Gjermundbu were smooth iron cones with nose-guards).', exp: 'Horned helmets were invented by 19th-century opera costume designers in 1876!' },
          { num: 12, tier: 'Detail', q: 'How did the "Great Heathen Army" of AD 865 differ from earlier summer raiders, and which three kingdoms fell?', a: 'Instead of sailing home in autumn, thousands stayed over winter at fortified camps like Repton to conquer Northumbria, East Anglia, and Mercia.', exp: 'By January AD 878 only the southern kingdom of Wessex remained unconquered.' },
        ],
      },
      {
        number: 4,
        title: 'Enquiry 04: Alfred the Great, Burhs & the Danelaw — Saving Wessex (AD 871–899)',
        shortTitle: 'Alfred & Danelaw',
        enquiryFocus: 'How did King Alfred save Wessex in AD 878, and why do historians call him "Alfred the Great"?',
        questions: [
          { num: 13, tier: 'Recall', q: 'Where did King Alfred shelter in early AD 878 before defeating Danish leader Guthrum at the Battle of Edington?', a: 'In the reed-filled marshes of Athelney in Somerset.', exp: 'In May AD 878 Alfred rallied the shire fyrd at Egbert’s Stone and broke Guthrum’s shield wall at Edington.' },
          { num: 14, tier: 'Detail', q: 'What did Alfred and baptised Guthrum agree along Roman Watling Street, and what was the Viking region called?', a: 'They divided England along Watling Street: Alfred ruled Wessex and western Mercia while northern and eastern England became the Danelaw.', exp: 'Across the Danelaw, Scandinavian laws and "-by" / "-thorpe" village names took root.' },
          { num: 15, tier: 'Explain', q: 'How did Alfred’s network of 33 fortified "burhs" and reorganised "fyrd" protect Wessex from future raids?', a: 'Walled burhs (like Wareham) meant no farm lay over 20 miles from safety, and splitting the fyrd in half kept forts guarded while crops were harvested.', exp: 'Alfred also built taller warships to intercept raiders at sea.' },
          { num: 16, tier: 'Recall', q: 'What Old English words are inscribed in gold around the Alfred Jewel, and why did Alfred care about books?', a: '"AELFRED MEC HEHT GEWYRCAN" ("Alfred ordered me to be made"); Alfred translated Latin books into Old English so people could read and learn.', exp: 'Alfred also launched the Anglo-Saxon Chronicle to record history year by year in English.' },
        ],
      },
      {
        number: 5,
        title: 'Enquiry 05: Life in Jorvik & the Danelaw — Raiders or Traders? (c. AD 876–1000)',
        shortTitle: 'Viking Jorvik',
        enquiryFocus: 'What does archaeology from Jorvik (York) reveal about everyday Viking settlers, traders, and craftworkers?',
        questions: [
          { num: 17, tier: 'Detail', q: 'Why did 40,000 everyday Viking objects survive beneath Coppergate in Jorvik (York), and what does "Coppergate" mean?', a: 'Wet, oxygen-free peaty soil stopped wood and leather rotting; "Coppergate" comes from Old Norse meaning "Street of the Cup-Makers".', exp: 'Archaeologists uncovered leather boots, bone ice-skates, wooden bowls, iron tools, and hnefatafl board games.' },
          { num: 18, tier: 'Explain', q: 'What do deer-antler combs and Islamic silver dirham coins found in York prove about Viking life?', a: 'Hundreds of combs prove Vikings cared about neatness and hygiene, while Baghdad and Samarkand silver dirhams prove peaceful long-distance trade.', exp: 'Jorvik workshops also traded Byzantine silk, Baltic amber, and Red Sea cowrie shells!' },
          { num: 19, tier: 'Recall', q: 'What was an open-air Viking "Thing", and what rights did free Viking women have?', a: 'A Thing was an outdoor assembly where free citizens made laws and settled disputes; Viking women wore house keys, owned land, and could divorce.', exp: 'Tynwald Hill on the Isle of Man still preserves this Norse parliamentary tradition today.' },
          { num: 20, tier: 'Recall', q: 'Name four everyday English words or place-name endings left behind by Old Norse speakers.', a: 'Words: sky, window, egg, knife, leg, husband, law, Thursday; Place-name endings: -by (Grimsby, Whitby, Derby) and -thorpe.', exp: 'Everyday language proves Anglo-Saxon and Scandinavian neighbours lived, farmed, and traded side by side.' },
        ],
      },
      {
        number: 6,
        title: 'Enquiry 06: Aethelflaed, Athelstan, Cnut & 1066 — Struggle for England (AD 900–1066)',
        shortTitle: 'One England & 1066',
        enquiryFocus: 'How did Anglo-Saxon and Viking rulers forge one united Kingdom of England — and why did it all change in 1066?',
        questions: [
          { num: 21, tier: 'Recall', q: 'Who was "Lady of the Mercians", and which grandson of Alfred became the first King of All England in AD 927?', a: 'Alfred’s daughter Aethelflaed was Lady of the Mercians; her nephew King Athelstan captured York in AD 927 (and won Brunanburh in AD 937) to rule all England.', exp: 'Athelstan’s c. AD 934 illuminated manuscript is the oldest surviving portrait of an English monarch.' },
          { num: 22, tier: 'Explain', q: 'Why did paying silver "Danegeld" fail under King Aethelred, and how did Danish King Cnut rule from AD 1016–1035?', a: 'Danegeld tempted Viking fleets to return demanding even more silver; Cnut ruled England, Denmark, and Norway peacefully while keeping English laws.', exp: 'After Cnut’s sons died, Anglo-Saxon King Edward the Confessor ruled from AD 1042 until January 1066.' },
          { num: 23, tier: 'Recall', q: 'Name the three rivals who claimed the English crown after Edward the Confessor died childless in January 1066.', a: 'Harold Godwinson (Earl of Wessex), Harald Hardrada (Viking King of Norway), and Duke William of Normandy.', exp: 'The Witan crowned Harold II at Westminster, triggering invasions from both Norway and Normandy.' },
          { num: 24, tier: 'Explain', q: 'How did King Harold’s victory at Stamford Bridge (25 Sept 1066) help cause his defeat at Hastings (14 Oct 1066)?', a: 'Defeating Hardrada in Yorkshire cost elite housecarls and forced Harold’s exhausted army to march 250 miles south to fight William’s cavalry and archers.', exp: 'Stamford Bridge ended the Viking Age, while Hastings nineteen days later ended Anglo-Saxon rule.' },
        ],
      },
    ],
  },
  ks2_ww2: {
    unitTitle: 'World War II & The Home Front (1933–1945)',
    subtitle: '44-Question Master Retrieval Check & Self-Marking Key (Enquiries 01–11)',
    enquiries: [
      {
        number: 1,
        title: 'Enquiry 01: Outbreak 1939 & Home Front Mobilisation',
        shortTitle: 'Outbreak 1939',
        enquiryFocus: 'Why did Britain go to war in September 1939, and how did families prepare overnight?',
        questions: [
          { num: 1, tier: 'Recall', q: 'On what exact date in September 1939 did Prime Minister Neville Chamberlain announce Britain was at war?', a: 'Sunday 3 September 1939 (at 11:15am on BBC radio).', exp: 'Britain declared war after Nazi Germany invaded Poland on 1 September 1939 and ignored Britain’s ultimatum to withdraw.' },
          { num: 2, tier: 'Recall', q: 'On what date did the nationwide Blackout begin across Britain?', a: '1 September 1939 (at sunset, two days before war was declared).', exp: 'Streetlights were switched off and windows covered with thick curtains so enemy bombers could not spot towns from the night sky.' },
          { num: 3, tier: 'Detail', q: 'How many rubber gas masks in cardboard boxes did the British government issue to civilians?', a: '38 million gas masks (including red-and-blue "Mickey Mouse" masks for toddlers).', exp: 'Every man, woman, and child carried a gas mask box on a string strap in case poison gas was dropped on British cities.' },
          { num: 4, tier: 'Explain', q: 'Why did families stick criss-cross brown paper tape across their glass window panes?', a: 'To stop glass shattering into dangerous flying splinters indoors during bomb blasts.', exp: 'Shockwaves from nearby explosions blew glass inwards; sticky paper strips helped hold cracked panes together.' },
        ],
      },
      {
        number: 2,
        title: 'Enquiry 02: Operation Pied Piper & British Evacuation',
        shortTitle: 'Evacuation',
        enquiryFocus: 'What did it feel like to leave home as an evacuee in September 1939?',
        questions: [
          { num: 5, tier: 'Recall', q: 'What was the official code name for the September 1939 evacuation of 1.5 million children and mothers?', a: 'Operation Pied Piper (launched on Friday 1 September 1939).', exp: 'Special trains and buses moved schoolchildren and mothers with toddlers out of industrial cities before bombing began.' },
          { num: 6, tier: 'Recall', q: 'What did every evacuee wear tied to their coat so teachers and officials knew who they were?', a: 'A brown paper/cardboard luggage label showing their name, school, and destination.', exp: 'School groups walked to railway stations together wearing coats, identity labels, and gas mask boxes.' },
          { num: 7, tier: 'Detail', q: 'Which local official met evacuees in village halls and placed them with countryside host families?', a: 'The Billeting Officer.', exp: 'Volunteer Billeting Officers knocked on doors in rural villages to find safe spare bedrooms for arriving city children.' },
          { num: 8, tier: 'Detail', q: 'Name two safer countryside reception areas where children from cities like London were sent.', a: 'Any two from: Devon, Cornwall, Wales, Somerset, Dorset, East Anglia, or rural counties.', exp: 'Country villages far from docks and factories were chosen so children could attend school safely away from air raids.' },
        ],
      },
      {
        number: 3,
        title: 'Enquiry 03: Pre-War Life & Rights Lost (1933–1938)',
        shortTitle: 'Pre-War Life',
        enquiryFocus: 'What was Jewish family life like in Europe before the war, and how were rights taken away?',
        questions: [
          { num: 9, tier: 'Recall', q: 'In which month and year did Adolf Hitler and the Nazi Party take power in Germany?', a: 'January 1933.', exp: 'Before 1933, Jewish families had lived across Germany and Europe for centuries as neighbours, teachers, doctors, musicians, and shopkeepers.' },
          { num: 10, tier: 'Recall', q: 'Which unfair laws passed in September 1935 took away German citizenship from Jewish people?', a: 'The Nuremberg Laws.', exp: 'Step by step, hundreds of anti-Jewish decrees excluded families from parks, swimming pools, cinemas, and professions.' },
          { num: 11, tier: 'Detail', q: 'What happened across Germany and Austria on the night of 9–10 November 1938 (Kristallnacht)?', a: 'Synagogues were burned and Jewish-owned shop windows and homes were violently attacked.', exp: 'The November Pogrom shocked newspapers around the world and convinced desperate parents to seek safety abroad for their children.' },
          { num: 12, tier: 'Explain', q: 'What unfair order was enforced against Jewish children in German state schools on 15 November 1938?', a: 'All Jewish children were banned/expelled from attending German state schools.', exp: 'Shutting children out of their own classrooms isolated them from classmates and ended their right to state education.' },
        ],
      },
      {
        number: 4,
        title: "Enquiry 04: One Small Suitcase — The Kindertransport (1938–1939)",
        shortTitle: 'Kindertransport',
        enquiryFocus: 'Why did parents send 10,000 children alone to Britain on the Kindertransport?',
        questions: [
          { num: 13, tier: 'Recall', q: 'Roughly how many unaccompanied refugee children reached safety in Britain on the Kindertransport?', a: 'Nearly 10,000 children (between December 1938 and August 1939).', exp: 'Following debates in Parliament after the November Pogrom, Britain waived visa delays for unaccompanied children under 17.' },
          { num: 14, tier: 'Detail', q: 'How much money had to be guaranteed by sponsors to cover each Kindertransport child?', a: '£50 per child (raised by charities and British foster sponsors).', exp: '£50 in 1938 was worth over £3,000 today, raised by Quaker, Jewish, and Christian volunteers and foster families.' },
          { num: 15, tier: 'Detail', q: 'Which English port in Essex and London station welcomed Kindertransport trains via Hook of Holland?', a: 'Harwich port in Essex and London Liverpool Street Station.', exp: 'Children travelled by sealed train across Europe to the Hook of Holland, crossed the North Sea by ferry to Harwich, and steamed into Liverpool Street.' },
          { num: 16, tier: 'Detail', q: 'Name two treasured items nine-year-old Vera Löwyová (Vera Schaufeld) packed in her suitcase from Prague.', a: 'Her English porcelain doll and her small autograph diary signed by her parents (plus family photo/clothes).', exp: 'Because parents were not allowed to travel with them, small keepsakes carried precious memories of home and family.' },
        ],
      },
      {
        number: 5,
        title: 'Enquiry 05: Who Were the Rescuers? (1938–1939)',
        shortTitle: 'The Rescuers',
        enquiryFocus: 'How did ordinary volunteers become upstanders who saved 669 children from Prague?',
        questions: [
          { num: 17, tier: 'Recall', q: 'How many children were rescued from Prague on eight trains organised by Nicholas Winton and his team?', a: '669 children (between March and August 1939).', exp: 'Nicholas Winton cancelled his skiing holiday after visiting refugee camps near Prague in December 1938.' },
          { num: 18, tier: 'Recall', q: 'Which British schoolteacher stayed in Prague putting refugee children safely onto the trains?', a: 'Trevor Chadwick (working alongside Doreen Warriner in Prague and Babette Winton in London).', exp: 'Rescue required brave teamwork: Chadwick and Warriner worked face-to-face with families in Prague while Winton and his mother matched foster homes in London.' },
          { num: 19, tier: 'Explain', q: 'Why could the ninth train from Prague scheduled for 1 September 1939 never leave the station?', a: 'Nazi Germany invaded Poland that morning and all borders were immediately closed.', exp: 'Around 250 children had gathered to board the biggest train of all, showing how urgently the rescue team had raced against time.' },
          { num: 20, tier: 'Detail', q: 'Where did Nicholas Winton keep his scrapbook of rescued children quietly for 50 years until 1988?', a: 'In the attic of his home.', exp: 'In 1988, BBC’s That’s Life! reunited Winton with dozens of grown-up survivors sitting all around him in the audience.' },
        ],
      },
      {
        number: 6,
        title: 'Enquiry 06: The Blitz & Air Raids (1940–1941)',
        shortTitle: 'The Blitz',
        enquiryFocus: 'How did British towns and cities survive the bombing of the Blitz?',
        questions: [
          { num: 21, tier: 'Recall', q: 'On what date in September 1940 did the Blitz begin, bombing London for 57 nights in a row?', a: '7 September 1940 ("Black Saturday").', exp: 'Hundreds of Luftwaffe bombers targeted London’s docks and East End neighbourhoods from afternoon into the night.' },
          { num: 22, tier: 'Detail', q: 'At least how many inches of garden soil were piled over a corrugated steel Anderson shelter?', a: 'At least 15 inches of soil/earth.', exp: 'Half-burying the curved steel sheets and covering them with earth absorbed shrapnel and blast waves (and families grew vegetables on top!).' },
          { num: 23, tier: 'Recall', q: 'What indoor steel-mesh table cage shelter was introduced in 1941 for houses without back gardens?', a: 'The Morrison shelter.', exp: 'By daytime it served as a dining table; at night families slept inside its strong steel frame in case the house collapsed.' },
          { num: 24, tier: 'Detail', q: 'Name two British port or factory cities outside London that were heavily bombed during the Blitz.', a: 'Any two from: Coventry, Liverpool, Birmingham, Plymouth, Portsmouth, Clydebank (Glasgow), Hull, Bristol, Belfast.', exp: 'The Blitz hit ports, shipyards, and aircraft factories across the whole United Kingdom, guarded by 1.4 million ARP wardens.' },
        ],
      },
      {
        number: 7,
        title: 'Enquiry 07: Dig for Victory & Wartime Rationing (1940–1945)',
        shortTitle: 'Rationing',
        enquiryFocus: 'Why was food rationed, and how did "Dig for Victory" keep everyone fed fairly?',
        questions: [
          { num: 25, tier: 'Explain', q: 'Why did German U-boat submarines in the Atlantic Ocean threaten Britain’s food supply?', a: 'Island Britain imported over two-thirds of its food by merchant ship, which U-boats attacked.', exp: 'Before 1939, 55 million tons of food arrived by sea each year, including sugar, butter, fruit, bacon, and wheat.' },
          { num: 26, tier: 'Recall', q: 'In which month and year did the Ministry of Food introduce food ration books?', a: 'January 1940 (starting with bacon, butter, and sugar).', exp: 'Shopkeepers clipped or stamped coupons in each person’s ration book so rich and poor families received fair shares.' },
          { num: 27, tier: 'Detail', q: 'How many fresh eggs per week was a typical adult allowed on their weekly ration?', a: '1 fresh egg per week (supplemented by dried egg powder).', exp: 'Expectant mothers and young children received green ration books with extra milk, cod liver oil, and orange juice.' },
          { num: 28, tier: 'Recall', q: 'Which campaign turned 1.4 million allotments and parks into gardens growing unrationed vegetables?', a: '"Dig for Victory" (families grew unrationed potatoes, carrots, cabbages, and swedes for dishes like Woolton Pie).', exp: 'Even flowerbeds at the Tower of London and Kensington Gardens were dug up to grow fresh home-grown vegetables!' },
        ],
      },
      {
        number: 8,
        title: 'Enquiry 08: Women at War (1941–1945)',
        shortTitle: 'Women at War',
        enquiryFocus: 'How did women’s work on farms, in factories, and in uniform help win the war?',
        questions: [
          { num: 29, tier: 'Recall', q: 'In which month and year did Parliament pass the National Service Act calling up unmarried women aged 20–30?', a: 'December 1941.', exp: 'Britain became the first nation in World War II to conscript women into vital war industries, farming, or auxiliary services.' },
          { num: 30, tier: 'Detail', q: 'Roughly how many "Land Girls" worked on British farms in the Women’s Land Army?', a: 'Over 80,000 women.', exp: 'Land Girls ploughed fields, drove tractors, milked cows, and harvested crops from dawn to dusk so Britain did not starve.' },
          { num: 31, tier: 'Recall', q: 'What nickname was given to women in the Women’s Timber Corps who felled trees for pit props?', a: 'Lumberjills.', exp: 'Lumberjills measured and sawed heavy timber needed for coal mines, railway sleepers, and telegraph poles.' },
          { num: 32, tier: 'Explain', q: 'Why were women packing explosive shells in munitions factories nicknamed "Canary Girls"?', a: 'Toxic TNT explosive powder turned their skin and hair bright yellow.', exp: 'Nearly one million women worked dangerous shifts building Spitfire aircraft, radar sets, and artillery shells.' },
        ],
      },
      {
        number: 9,
        title: 'Enquiry 09: Secret Codebreakers & Bletchley Park (1941–1945)',
        shortTitle: 'Bletchley Park',
        enquiryFocus: 'How did secret codebreakers at Bletchley Park shorten World War II?',
        questions: [
          { num: 33, tier: 'Recall', q: 'Where in Buckinghamshire was Britain’s top-secret codebreaking centre ("Station X")?', a: 'Bletchley Park.', exp: 'Located near railway lines between Oxford and Cambridge, Bletchley Park housed mathematicians, linguists, Wrens, and engineers.' },
          { num: 34, tier: 'Recall', q: 'What was the name of the portable German cipher machine that changed its settings every midnight?', a: 'The Enigma machine.', exp: 'With rotors and plugboard cables, Enigma had over 158 million million million possible settings!' },
          { num: 35, tier: 'Detail', q: 'What spinning-drum machine did Alan Turing and Gordon Welchman design to find daily Enigma settings?', a: 'The Bombe machine (inspired by earlier Polish mathematical work).', exp: 'Later, engineer Tommy Flowers also built Colossus — the world’s first programmable electronic computer — to crack Lorenz messages.' },
          { num: 36, tier: 'Detail', q: 'Roughly what fraction of Bletchley Park’s 10,000 staff were women, and what law kept them silent?', a: 'Around three-quarters (75%) were women; everyone signed the Official Secrets Act.', exp: 'Young women like Joan Clarke and thousands of Wrens operated Bombes and decoded messages without telling even their parents until the 1970s!' },
        ],
      },
      {
        number: 10,
        title: 'Enquiry 10: VE Day, Rebuilding Britain & Remembrance (1945)',
        shortTitle: 'VE Day 1945',
        enquiryFocus: 'Why was VE Day both a joyful street party and a moment of quiet remembrance?',
        questions: [
          { num: 37, tier: 'Recall', q: 'On what exact date was Victory in Europe (VE) Day celebrated across Britain?', a: 'Tuesday 8 May 1945.', exp: 'Neighbours dragged trestle tables into bombed streets, hung red-white-and-blue bunting, and turned lights back on after nearly six years.' },
          { num: 38, tier: 'Recall', q: 'Which Prime Minister announced Victory in Europe on BBC radio at 3:00pm on VE Day?', a: 'Winston Churchill.', exp: 'Huge crowds cheered Churchill and the Royal Family on the balcony of Buckingham Palace, though Churchill warned fighting continued in Asia.' },
          { num: 39, tier: 'Detail', q: 'On what date three months later did VJ Day mark the end of fighting in Asia and the Pacific?', a: '15 August 1945 (Victory over Japan Day).', exp: 'Soldiers from Britain, India, Australia, West and East Africa, and Allied nations had still been fighting in Burma and the Pacific.' },
          { num: 40, tier: 'Detail', q: 'In which year did the NHS open, and in which year did food rationing finally end in Britain?', a: 'NHS opened in July 1948; food rationing ended in July 1954.', exp: 'Determined to build a fairer peacetime country, Britain built new homes and schools and created free healthcare for everyone.' },
        ],
      },
      {
        number: 11,
        title: 'Enquiry 11: After the War — The Windermere Children (1945)',
        shortTitle: 'Windermere 1945',
        enquiryFocus: 'How did 300 young Holocaust survivors begin to heal beside Lake Windermere in 1945?',
        questions: [
          { num: 41, tier: 'Recall', q: 'In August 1945, how many RAF Short Stirling bombers flew 300 child survivors from Prague to Carlisle?', a: '10 converted RAF Short Stirling heavy bombers.', exp: 'Warplanes built for battle were used on a mission of mercy, flying orphaned young survivors from liberated Theresienstadt to safety in Britain.' },
          { num: 42, tier: 'Recall', q: 'On which estate beside Lake Windermere did the 300 young survivors stay and begin to heal?', a: 'The Calgarth Estate in the Lake District.', exp: 'Originally built as wartime huts for Sunderland flying-boat factory workers, Calgarth became a peaceful sanctuary surrounded by lakes and hills.' },
          { num: 43, tier: 'Explain', q: 'Why did newly arrived child survivors at Calgarth hide crusts of bread under their pillows at night?', a: 'Years of starvation made them fear food might run out overnight; gentle staff reassured them.', exp: 'Paediatrician Oscar Friedmann, Marie Paneth, art rooms, football pitches, bicycles, and patient kindness helped them trust again.' },
          { num: 44, tier: 'Detail', q: 'What lifelong society did the Windermere survivors form, and who wrote After the War with them?', a: "The '45 Aid Society; children's author Tom Palmer.", exp: 'Calling themselves "The Boys", survivors like Ben Helfgott (who later captained Britain’s Olympic weightlifting team!) built lifelong friendships and raised money for charities.' },
        ],
      },
    ],
  },
};

export function renderDepartmentMarkingBank(container, unitId, unitData = {}) {
  const isKs2 = unitId === 'ks2_ww2' || String(unitId).startsWith('ks2');
  const data = KS3_MARKING_DATA[unitId] || {
    unitTitle: unitData.title || (isKs2 ? 'Key Stage 2 Unit' : 'Key Stage 3 Unit'),
    subtitle: 'Department Knowledge Retrieval Marking Bank',
    enquiries: [],
  };

  const totalQuestions = data.enquiries.reduce((acc, e) => acc + e.questions.length, 0);

  container.innerHTML = `
    <div class="marking-bank-portal" style="max-width: 1100px; margin: 0 auto; padding: 20px 16px 60px 16px; font-family: Inter, sans-serif;">
      
      <!-- Top Header Masthead -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 26px 30px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="font-size: 0.78rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #38bdf8; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-clipboard-check"></i> <span>${isKs2 ? 'KS2 Self-Checking Quiz & Workbook Answer Key' : 'Digital Department Marking Bank & Model Explanations'}</span>
          </div>
          <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.95rem; font-weight: 900; line-height: 1.2; color: #ffffff;">
            ${data.unitTitle}
          </h1>
          <p style="margin: 6px 0 0 0; font-size: 0.92rem; color: #94a3b8; max-width: 650px;">
            ${isKs2 ? `Check all ${totalQuestions || 24} retrieval questions across Enquiries 01–${String(data.enquiries.length || 6).padStart(2, '0')} with verified answers and clear explanations.` : 'Self-check your printed booklet homework questions with verified model answers and causal explanations.'}
          </p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${
            isKs2
              ? `
          <a href="/units/${unitId}/textbook.html" target="_blank" class="btn" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.88rem; padding: 8px 14px; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
            <i class="fa-solid fa-book-open" style="color: #38bdf8;"></i> <span>${unitId === 'ks2_ww2' ? '16-Page Textbook' : '12-Page Textbook'}</span>
          </a>
          <a href="/units/${unitId}/quiz_pack.html" target="_blank" class="btn" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.88rem; padding: 8px 14px; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
            <i class="fa-solid fa-list-check" style="color: #fbbf24;"></i> <span>4-Page Quiz Pack</span>
          </a>
          `
              : `
          <a href="/?view=reading&unit=${unitId}" class="btn" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.88rem; padding: 8px 14px; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
            <i class="fa-solid fa-book-open-reader" style="color: #f472b6;"></i> <span>Literary Companion</span>
          </a>
          `
          }
          <a href="/?view=lessons&unit=${unitId}" class="btn" style="background: #2563eb; color: #ffffff; border: 1px solid #3b82f6; font-weight: 700; font-size: 0.88rem; padding: 8px 14px; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
            <i class="fa-solid fa-chalkboard-user"></i> <span>Unit Lessons</span>
          </a>
        </div>
      </div>

      <!-- Cognitive Guidance Strip -->
      <div style="background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 0 8px 8px 0; padding: 14px 18px; margin-bottom: 24px; font-size: 0.9rem; color: #1e3a8a; line-height: 1.5;">
        ${
          isKs2
            ? '<strong><i class="fa-solid fa-lightbulb"></i> How to Check Your Answers (Pupils &amp; Teachers):</strong> Click any question below to check your written answer in green pencil! Award full credit whenever the historical fact is accurate in your own plain-English words (for example, writing <em>"three-quarters"</em> or <em>"75%"</em>).'
            : '<strong><i class="fa-solid fa-lightbulb"></i> How to use this Self-Checking Marking Bank:</strong> Compare what you wrote in black ink on your printed retrieval pages against the model answers below. For full marks, ensure your answer contains both the <strong>Key Fact</strong> and the <strong>Historical Explanation</strong>. Record your final score out of 6 on your booklet front cover!'
        }
      </div>

      <!-- Enquiries Filter Tabs -->
      <div id="marking-tabs" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
        <button type="button" class="btn marking-filter-btn" data-enquiry="all" style="padding: 8px 16px; font-size: 0.88rem; font-weight: 700; background: #1e3a8a; color: #ffffff; border: 1.5px solid #1e3a8a; border-radius: 6px; cursor: pointer;">
          All Enquiries (${totalQuestions} Questions)
        </button>
        ${data.enquiries
          .map(
            (e) => `
          <button type="button" class="btn marking-filter-btn" data-enquiry="${e.number}" style="padding: 8px 14px; font-size: 0.88rem; font-weight: 700; background: #ffffff; color: #334155; border: 1.5px solid #cbd5e1; border-radius: 6px; cursor: pointer;">
            Enquiry ${e.number}: ${e.shortTitle}
          </button>
        `,
          )
          .join('')}
      </div>

      <!-- Questions List Container -->
      <div id="marking-questions-container" style="display: flex; flex-direction: column; gap: 24px;">
        ${data.enquiries
          .map(
            (enq) => `
          <div class="marking-enquiry-section" data-enquiry-id="${enq.number}" style="background: #ffffff; border-radius: 10px; border: 1.5px solid #e2e8f0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <div style="background: #f8fafc; padding: 16px 20px; border-bottom: 1.5px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div>
                <span style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; background: #1e3a8a; color: #ffffff; padding: 2px 8px; border-radius: 4px;">
                  Enquiry ${enq.number}
                </span>
                <h3 style="margin: 4px 0 0 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.25rem; font-weight: 800; color: #0f172a;">
                  ${enq.title}
                </h3>
              </div>
              <span style="font-size: 0.82rem; font-weight: 600; color: #64748b; font-style: italic;">
                ${enq.enquiryFocus}
              </span>
            </div>

            <div style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
              ${enq.questions
                .map((q) => {
                  const tierColor =
                    q.tier === 'Bronze' || q.tier === 'Recall'
                      ? '#059669'
                      : q.tier === 'Silver' || q.tier === 'Detail'
                        ? '#d97706'
                        : '#dc2626';
                  const tierBg =
                    q.tier === 'Bronze' || q.tier === 'Recall'
                      ? '#ecfdf5'
                      : q.tier === 'Silver' || q.tier === 'Detail'
                        ? '#fffbeb'
                        : '#fef2f2';
                  return `
                  <div class="marking-question-card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; background: #ffffff;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px;">
                      <div style="display: flex; align-items: flex-start; gap: 10px;">
                        <span style="font-weight: 900; color: #1e3a8a; font-size: 1.05rem; min-width: 24px;">Q${q.num}.</span>
                        <div style="font-weight: 700; color: #1e293b; font-size: 0.98rem; line-height: 1.45;">
                          ${q.q}
                        </div>
                      </div>
                      <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; background: ${tierBg}; color: ${tierColor}; border: 1px solid ${tierColor}40; padding: 2px 8px; border-radius: 4px; white-space: nowrap;">
                        ${q.tier}
                      </span>
                    </div>

                    <details style="margin-top: 10px; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0; padding: 10px 14px;">
                      <summary style="font-weight: 700; font-size: 0.86rem; color: #2563eb; cursor: pointer; user-select: none;">
                        <i class="fa-solid fa-eye"></i> Click to Reveal Model Answer & Historical Explanation
                      </summary>
                      <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #cbd5e1; font-size: 0.92rem; line-height: 1.55;">
                        <div style="margin-bottom: 6px;">
                          <strong style="color: #15803d; text-transform: uppercase; font-size: 0.78rem; letter-spacing: 0.5px; display: block;">Key Fact:</strong>
                          <span style="font-weight: 700; color: #0f172a;">${q.a}</span>
                        </div>
                        <div>
                          <strong style="color: #475569; text-transform: uppercase; font-size: 0.78rem; letter-spacing: 0.5px; display: block;">Historical Explanation:</strong>
                          <span style="color: #334155;">${q.exp}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                `;
                })
                .join('')}
            </div>
          </div>
        `,
          )
          .join('')}
      </div>

      <!-- Disciplinary Pathways Reference Card -->
      <div style="margin-top: 36px; background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <h3 style="margin: 0 0 14px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 10px;">
          <i class="fa-solid fa-stairs" style="color: #1e3a8a;"></i> ${isKs2 ? 'Young Historian Self-Check Steps (Years 5–6)' : 'KS3 Level Assessment Pathways'}
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
          <div style="padding: 14px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #94a3b8;">
            <div style="font-weight: 800; font-size: 0.84rem; color: #475569; margin-bottom: 4px;">${isKs2 ? 'STEP 1: SPOTTING FACTS (1 / 4 per Enquiry)' : 'EMERGING (1–2 / 6)'}</div>
            <p style="margin: 0; font-size: 0.84rem; color: #64748b; line-height: 1.45;">${isKs2 ? 'Names key wartime people, objects, or places from the lesson.' : 'Recalls standalone historical dates, names, and basic vocabulary terms.'}</p>
          </div>
          <div style="padding: 14px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #3b82f6;">
            <div style="font-weight: 800; font-size: 0.84rem; color: #1e40af; margin-bottom: 4px;">${isKs2 ? 'STEP 2: EXPLAINING WHY (2–3 / 4 per Enquiry)' : 'DEVELOPING (3–4 / 6)'}</div>
            <p style="margin: 0; font-size: 0.84rem; color: #64748b; line-height: 1.45;">${isKs2 ? 'Uses accurate dates and "because / so that" to explain why events happened.' : 'Explains cause and consequence using because/as a result connectives.'}</p>
          </div>
          <div style="padding: 14px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #059669;">
            <div style="font-weight: 800; font-size: 0.84rem; color: #065f46; margin-bottom: 4px;">${isKs2 ? 'STEP 3: CONFIDENT RECALL (4 / 4 per Enquiry)' : 'SECURING (5 / 6)'}</div>
            <p style="margin: 0; font-size: 0.84rem; color: #64748b; line-height: 1.45;">${isKs2 ? 'Recalls all four enquiry facts accurately using historical vocabulary.' : 'Demonstrates deep contextual understanding and links multiple causal factors.'}</p>
          </div>
          <div style="padding: 14px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #d97706;">
            <div style="font-weight: 800; font-size: 0.84rem; color: #92400e; margin-bottom: 4px;">${isKs2 ? 'HISTORIAN STRETCH (Connecting Enquiries)' : 'GREATER DEPTH (6 / 6)'}</div>
            <p style="margin: 0; font-size: 0.84rem; color: #64748b; line-height: 1.45;">${isKs2 ? 'Links two enquiries together (e.g. how Bletchley Park protected Atlantic food convoys).' : 'Evaluates synoptic turning points and explains long-term historical significance.'}</p>
          </div>
        </div>
      </div>

    </div>
  `;

  // Wire Enquiry Filter Buttons
  const filterBtns = container.querySelectorAll('.marking-filter-btn');
  const sections = container.querySelectorAll('.marking-enquiry-section');

  filterBtns.forEach((btn) => {
    btn.onclick = () => {
      const enq = btn.dataset.enquiry;
      filterBtns.forEach((b) => {
        b.style.background = '#ffffff';
        b.style.color = '#334155';
        b.style.borderColor = '#cbd5e1';
      });
      btn.style.background = '#1e3a8a';
      btn.style.color = '#ffffff';
      btn.style.borderColor = '#1e3a8a';

      sections.forEach((sec) => {
        if (enq === 'all' || sec.dataset.enquiryId === enq) {
          sec.style.display = 'block';
        } else {
          sec.style.display = 'none';
        }
      });
    };
  });
}

