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
  ks2_ancient_egypt: {
      "unitTitle": "Ancient Egypt (c. 3100 – 30 BC)",
      "subtitle": "24-Question Master Retrieval Check & Self-Marking Key (Enquiries 01–06)",
      "enquiries": [
          {
              "number": 1,
              "title": "Enquiry 01: Four River Cradles & The Gift of the Nile — Why Did Ancient Egypt Flourish? (c. 3500–2700 BC)",
              "shortTitle": "Four River Cradles & The G",
              "enquiryFocus": "Where did the earliest river civilisations grow, and why did Ancient Egypt flourish beside the River Nile?",
              "questions": [
                  {
                      "num": 1,
                      "tier": "Recall",
                      "q": "Which four earliest river civilisations grew beside great rivers across Africa and Asia from around 3500 BC?",
                      "a": "Ancient Sumer, Indus Valley, Shang Dynasty, and Ancient Egypt",
                      "exp": "All four earliest civilisations flourished beside great rivers: Tigris/Euphrates, Indus, Yellow River, and the River Nile!"
                  },
                  {
                      "num": 2,
                      "tier": "Detail",
                      "q": "What did Ancient Egyptians call the rich black silt left behind by the summer Nile flood (inundation)?",
                      "a": "Kemet",
                      "exp": "Kemet meant \"Black Land\" for the dark fertile Nile mud, contrasted against Deshret (\"Red Land\"), the hot dry desert."
                  },
                  {
                      "num": 3,
                      "tier": "Explain",
                      "q": "What was a \"shaduf\" used for by Ancient Egyptian farmers?",
                      "a": "Lifting buckets of Nile water onto fields using a weighted wooden lever",
                      "exp": "A shaduf used a heavy mud counterweight on a pivoting pole so farmers could hoist Nile water easily into irrigation ditches."
                  },
                  {
                      "num": 4,
                      "tier": "Explain",
                      "q": "Why was \"Upper Egypt\" in the south and \"Lower Egypt\" in the north near the Mediterranean Sea?",
                      "a": "The River Nile flows downhill northwards from high southern land to the low northern delta",
                      "exp": "\"Upper\" and \"Lower\" describe land height along the Nile: high upstream mountains in the south down to the low delta in the north!"
                  }
              ]
          },
          {
              "number": 2,
              "title": "Enquiry 02: Pyramids of Giza & The Great Sphinx — How Were Giant Stone Tombs Built? (c. 2670–2500 BC)",
              "shortTitle": "Pyramids of Giza & The Gre",
              "enquiryFocus": "Why and how did Old Kingdom Egyptians build giant stone pyramids and the Great Sphinx at Giza?",
              "questions": [
                  {
                      "num": 5,
                      "tier": "Recall",
                      "q": "Which brilliant royal architect designed Egypt’s first stone tomb — Pharaoh Djoser’s Step Pyramid at Saqqara (c. 2670 BC)?",
                      "a": "Imhotep",
                      "exp": "Around 2670 BC, royal architect Imhotep stacked six stone platforms at Saqqara to create Pharaoh Djoser’s pioneering Step Pyramid."
                  },
                  {
                      "num": 6,
                      "tier": "Detail",
                      "q": "How tall was Pharaoh Khufu’s Great Pyramid at Giza originally, and roughly how many limestone blocks formed it?",
                      "a": "146 metres tall and 2.3 million limestone blocks",
                      "exp": "Standing 146 metres high from around 2.3 million blocks, Khufu’s Great Pyramid remained the tallest building on Earth for nearly 4,000 years!"
                  },
                  {
                      "num": 7,
                      "tier": "Explain",
                      "q": "What clever trick helped Egyptian rope teams pull heavy wooden sledges across desert sand at Giza?",
                      "a": "Pouring water onto the sand right in front of the sledge runners to halve friction",
                      "exp": "Dampening desert sand stopped dry grains piling up ahead of wooden sledges, cutting the pulling force needed in half!"
                  },
                  {
                      "num": 8,
                      "tier": "Explain",
                      "q": "What archaeological evidence proved that paid skilled workers and farmers — NOT slaves — built the Giza pyramids?",
                      "a": "Walled builders’ villages with giant bread bakeries, beef and fish rations, and healed bones",
                      "exp": "Excavations uncovered neat workers’ towns, bakeries, prime meat and fish rations, and skeletons with doctor-treated fractures."
                  }
              ]
          },
          {
              "number": 3,
              "title": "Enquiry 03: Scribes, Hieroglyphs & Everyday Life — How Did Ordinary Egyptians Live? (c. 2500–1200 BC)",
              "shortTitle": "Scribes, Hieroglyphs & Eve",
              "enquiryFocus": "How did everyday life differ across Egypt’s social pyramid, and how did historians finally crack hieroglyphs?",
              "questions": [
                  {
                      "num": 9,
                      "tier": "Recall",
                      "q": "On Ancient Egypt’s social pyramid, which group formed the widest layer right at the bottom and grew everyone’s food?",
                      "a": "Peasant farmers",
                      "exp": "Millions of peasant farmers ploughed fields, dug canals, and grew the wheat and barley taxes that fed all Egypt."
                  },
                  {
                      "num": 10,
                      "tier": "Detail",
                      "q": "Why did Egyptian families build whitewashed mud-brick houses with small high windows and flat roofs?",
                      "a": "To bounce away fierce sun, keep rooms shady, and sleep on cool flat roofs at night",
                      "exp": "Whitewashed mud-brick walls reflected scorching desert sunlight, while flat roofs caught cool evening river breezes."
                  },
                  {
                      "num": 11,
                      "tier": "Explain",
                      "q": "What was \"Senet\", found in wealthy tombs as glazed boxes and scratched by farmers onto stone steps?",
                      "a": "A thirty-square Egyptian board game played with throwing sticks and counters",
                      "exp": "Rich and poor Egyptians alike loved racing counters across thirty-square Senet boards!"
                  },
                  {
                      "num": 12,
                      "tier": "Explain",
                      "q": "Roughly how many sacred picture and sound signs (hieroglyphs) did pupils at Egyptian scribe school have to learn?",
                      "a": "Over 700 hieroglyphs",
                      "exp": "Mastering over 700 hieroglyphs with chewed reed brushes took years of practice on pottery scraps before writing on papyrus scrolls."
                  }
              ]
          },
          {
              "number": 4,
              "title": "Enquiry 04: Gods, Mummies & Weighing the Heart — What Did Egyptians Believe About Death? (c. 2000–1000 BC)",
              "shortTitle": "Gods, Mummies & Weighing t",
              "enquiryFocus": "What did Ancient Egyptians believe happened after death, and why did they make mummies?",
              "questions": [
                  {
                      "num": 13,
                      "tier": "Recall",
                      "q": "Which black jackal-headed Egyptian god guarded cemeteries and watched over mummification?",
                      "a": "Anubis",
                      "exp": "Anubis was shown as a watchful black desert jackal who protected tombs, guided mummification, and worked the judgement scales."
                  },
                  {
                      "num": 14,
                      "tier": "Detail",
                      "q": "How many days did full Egyptian mummification take, and what dry desert salt soaked up moisture from the body?",
                      "a": "Seventy days using dry natron salt",
                      "exp": "Full mummification took seventy days, including forty days packed under dry natron salt before oiling and wrapping in linen."
                  },
                  {
                      "num": 15,
                      "tier": "Explain",
                      "q": "Why did Egyptian embalmers keep the heart inside the chest while storing four other organs in Canopic jars?",
                      "a": "They believed the heart held a person's memories and had to be weighed by Anubis",
                      "exp": "Egyptians believed the heart held wisdom, feelings, and deeds, so Anubis weighed it against Ma'at's feather of truth!"
                  },
                  {
                      "num": 16,
                      "tier": "Explain",
                      "q": "What job were small blue shabti figurines buried inside Egyptian tombs meant to do?",
                      "a": "Magically wake up and do farm work for their owner in the Field of Reeds",
                      "exp": "Shabtis carried tiny hoes and baskets so they could answer Osiris's call and plough afterlife fields for their owner."
                  }
              ]
          },
          {
              "number": 5,
              "title": "Enquiry 05: Hatshepsut, Nefertiti & Ramesses II — Who Were Egypt's Mightiest New Kingdom Rulers? (c. 1500–1213 BC)",
              "shortTitle": "Hatshepsut, Nefertiti & Ra",
              "enquiryFocus": "What made Hatshepsut, Nefertiti, and Ramesses II three of Ancient Egypt's most remarkable New Kingdom rulers?",
              "questions": [
                  {
                      "num": 17,
                      "tier": "Recall",
                      "q": "Which royal symbol did female Pharaoh Hatshepsut wear on statues to show she held full kingly authority?",
                      "a": "The traditional royal false beard and striped headcloth",
                      "exp": "Hatshepsut commissioned statues and sphinxes showing her wearing the striped nemes headcloth and ceremonial false beard of kings."
                  },
                  {
                      "num": 18,
                      "tier": "Detail",
                      "q": "What precious living cargo did Hatshepsut's Red Sea trading ships bring back in baskets from the Land of Punt?",
                      "a": "Living frankincense trees along with gold and ebony",
                      "exp": "Temple reliefs at Deir el-Bahari proudly show sailors carrying living frankincense trees in baskets back from Punt!"
                  },
                  {
                      "num": 19,
                      "tier": "Explain",
                      "q": "Which single sun-disc god did Pharaoh Akhenaten and Queen Nefertiti worship at their new desert capital of Amarna?",
                      "a": "Aten",
                      "exp": "Akhenaten and Queen Nefertiti shocked traditional priests by turning away from Karnak's many gods to worship the sun-disc Aten."
                  },
                  {
                      "num": 20,
                      "tier": "Explain",
                      "q": "How many years did Ramesses II rule Egypt, and how tall are his four seated cliff statues at Abu Simbel?",
                      "a": "Sixty-six years; twenty metres tall",
                      "exp": "Ramesses the Great reigned for 66 years (1279–1213 BC) and carved four 20-metre colossi into the cliffs at Abu Simbel."
                  }
              ]
          },
          {
              "number": 6,
              "title": "Enquiry 06: Tutankhamun's Tomb & Cleopatra VII — How Did Ancient Egypt End & Live On? (1332–30 BC & AD 1922)",
              "shortTitle": "Tutankhamun's Tomb & Cleop",
              "enquiryFocus": "Why did Tutankhamun's hidden tomb survive until 1922, and how did Cleopatra VII's reign end pharaonic Egypt?",
              "questions": [
                  {
                      "num": 21,
                      "tier": "Recall",
                      "q": "Why did New Kingdom pharaohs like Tutankhamun cut hidden tombs in the Valley of the Kings instead of building pyramids?",
                      "a": "Giant pyramids stood out across the desert and attracted tomb robbers",
                      "exp": "Hidden rock-cut tombs deep inside desert cliffs were meant to keep royal mummies and treasures safe from thieves."
                  },
                  {
                      "num": 22,
                      "tier": "Detail",
                      "q": "Who uncovered the first buried stone step leading down to Tutankhamun's tomb KV62 in November 1922?",
                      "a": "Egyptian water-boy Hussein Abdel Rassoul working with Howard Carter's team",
                      "exp": "While hollowing sand to rest water jars in November 1922, Hussein Abdel Rassoul struck the top stone step of KV62!"
                  },
                  {
                      "num": 23,
                      "tier": "Explain",
                      "q": "Roughly how many treasures were recorded inside KV62, and how heavy is Tutankhamun's solid gold death mask?",
                      "a": "Over 5,000 treasures and an 11-kilogram solid gold death mask",
                      "exp": "Carter's team spent ten years cataloguing over 5,000 items, crowned by Tutankhamun's 11kg solid gold inlaid death mask."
                  },
                  {
                      "num": 24,
                      "tier": "Explain",
                      "q": "What set Queen Cleopatra VII apart from earlier Greek-speaking Ptolemaic rulers in Alexandria?",
                      "a": "She learned to speak fluent Egyptian alongside eight other languages",
                      "exp": "Cleopatra VII was a gifted scholar and diplomat who spoke Egyptian plus eight other languages, winning deep loyalty along the Nile."
                  }
              ]
          }
      ]
  },
  ks2_ancient_greece: {
      "unitTitle": "Ancient Greece (c. 800 – 146 BC)",
      "subtitle": "24-Question Master Retrieval Check & Self-Marking Key (Enquiries 01–06)",
      "enquiries": [
          {
              "number": 1,
              "title": "Enquiry 01: Mountains, Islands & Rival Poleis — Why Was Ancient Greece Divided Into City-States? (c. 800–500 BC)",
              "shortTitle": "Mountains, Islands & Rival",
              "enquiryFocus": "Why did geography divide Ancient Greece into rival city-states, and what shared culture still united all Greeks?",
              "questions": [
                  {
                      "num": 1,
                      "tier": "Recall",
                      "q": "Which famous gateway guarded the Bronze Age mainland fortress of Mycenae around 1250 BC?",
                      "a": "The Lion Gate",
                      "exp": "Bronze Age Mycenaean stonemasons crowned their giant limestone fortress entrance with two carved lions around 1250 BC."
                  },
                  {
                      "num": 2,
                      "tier": "Detail",
                      "q": "Why did Ancient Greece develop into separate city-states (poleis) instead of one united kingdom?",
                      "a": "Steep rocky mountains and over 1,000 Aegean islands separated communities",
                      "exp": "Mountain barriers and scattered islands isolated valleys and harbours, so each polis governed itself independently."
                  },
                  {
                      "num": 3,
                      "tier": "Explain",
                      "q": "Inside a Greek polis, what was the difference between the Acropolis and the Agora?",
                      "a": "The Acropolis was the high fortified temple hill, while the Agora was the open marketplace below",
                      "exp": "Acropolis means 'high city' (fortress and temples), whereas the sunny Agora below buzzed with market stalls and debate."
                  },
                  {
                      "num": 4,
                      "tier": "Explain",
                      "q": "From which seafaring traders did Greeks adapt symbols around 800 BC to create their 24-letter alphabet?",
                      "a": "Phoenicians",
                      "exp": "Greek merchants adapted Phoenician letters and cleverly added vowels to create a 24-letter alphabet starting with Alpha and Beta."
                  }
              ]
          },
          {
              "number": 2,
              "title": "Enquiry 02: Athens vs Sparta — Where Would You Rather Grow Up in Ancient Greece? (c. 508–430 BC)",
              "shortTitle": "Athens vs Sparta",
              "enquiryFocus": "How did democratic Athens and warrior Sparta govern their cities differently, and whose lives were freer in each polis?",
              "questions": [
                  {
                      "num": 5,
                      "tier": "Recall",
                      "q": "What does the Ancient Greek word 'demokratia' (invented in Athens around 508 BC) literally mean?",
                      "a": "People-power (rule by the citizens)",
                      "exp": "Combining demos (the people) and kratos (power), demokratia gave adult male Athenian citizens a direct vote on laws."
                  },
                  {
                      "num": 6,
                      "tier": "Detail",
                      "q": "Which groups living in Athens were completely shut out from voting on the Pnyx hill?",
                      "a": "Women, enslaved people, and foreign-born metics",
                      "exp": "Only adult men with Athenian citizen parents could vote in the Assembly — women, enslaved people, and metics were excluded."
                  },
                  {
                      "num": 7,
                      "tier": "Explain",
                      "q": "What job did the slotted marble 'kleroterion' machine do in Athens?",
                      "a": "Picked 500 courtroom jurors fairly at random so nobody could bribe them",
                      "exp": "Citizens placed name-tickets into the marble slots while falling black and white balls chose jurors by pure chance."
                  },
                  {
                      "num": 8,
                      "tier": "Explain",
                      "q": "At what age did Spartan citizen boys leave home to enter the tough 'agoge' military barracks?",
                      "a": "Seven years old",
                      "exp": "From age seven, Spartan boys lived together in strict agoge barracks, training barefoot and sleeping on river reeds."
                  }
              ]
          },
          {
              "number": 3,
              "title": "Enquiry 03: Mount Olympus, Myths & The Ancient Olympics — How Did Religion Shape Greek Life? (776–400 BC)",
              "shortTitle": "Mount Olympus, Myths & The",
              "enquiryFocus": "How did belief in the Olympian gods inspire Greek temples, hero myths, and the Ancient Olympic Games?",
              "questions": [
                  {
                      "num": 9,
                      "tier": "Recall",
                      "q": "Where did Ancient Greeks believe the twelve chief Olympian gods and goddesses lived?",
                      "a": "High on snow-capped Mount Olympus",
                      "exp": "Mount Olympus, the highest mountain peak in Greece, was imagined as the cloud-wrapped home of Zeus, Hera, Athena, and the other Olympians."
                  },
                  {
                      "num": 10,
                      "tier": "Detail",
                      "q": "Which gleaming marble temple was built atop Athens's Acropolis to honour wise warrior goddess Athena?",
                      "a": "The Parthenon",
                      "exp": "Athens built the white-marble Parthenon on the Acropolis to house Phidias's towering gold-and-ivory statue of Athena Parthenos."
                  },
                  {
                      "num": 11,
                      "tier": "Explain",
                      "q": "Why did Greek kings, generals, and travellers climb high up to the sanctuary of Delphi?",
                      "a": "To ask Apollo's Oracle (the priestess Pythia) for wise guidance about the future",
                      "exp": "Greeks believed god Apollo spoke mysterious prophecies through his priestess, the Pythia, at mountain Delphi."
                  },
                  {
                      "num": 12,
                      "tier": "Explain",
                      "q": "In what year were the first recorded Ancient Olympic Games held at Olympia in honour of Zeus?",
                      "a": "776 BC",
                      "exp": "From 776 BC, Greeks gathered every four summers at Olympia to honour king of the gods Zeus with athletic contests."
                  }
              ]
          },
          {
              "number": 4,
              "title": "Enquiry 04: Marathon, Thermopylae & Salamis — How Did Tiny City-States Defeat the Persian Empire? (490–479 BC)",
              "shortTitle": "Marathon, Thermopylae & Sa",
              "enquiryFocus": "How did tiny, rival Greek city-states unite to defeat the mighty Persian Empire between 490 and 479 BC?",
              "questions": [
                  {
                      "num": 13,
                      "tier": "Recall",
                      "q": "What do historians call the tight shoulder-to-shoulder battle formation of Greek hoplites locking shields together?",
                      "a": "A phalanx",
                      "exp": "In a phalanx, citizen hoplites overlapped heavy round bronze shields and pointed rows of long spears forward like a wall."
                  },
                  {
                      "num": 14,
                      "tier": "Detail",
                      "q": "Which legendary messenger ran roughly twenty-six miles from the battlefield of Marathon to Athens in 490 BC?",
                      "a": "Pheidippides",
                      "exp": "Pheidippides’s famous run from Marathon to announce Athens’s victory in 490 BC inspired the modern 26.2-mile marathon race!"
                  },
                  {
                      "num": 15,
                      "tier": "Explain",
                      "q": "Which Spartan king led 300 Spartans and Greek allies to hold the narrow mountain pass of Thermopylae in 480 BC?",
                      "a": "King Leonidas",
                      "exp": "King Leonidas and his force held the narrow coastal pass of Thermopylae for three days against King Xerxes’s huge invading army."
                  },
                  {
                      "num": 16,
                      "tier": "Explain",
                      "q": "How many oarsmen rowed an ancient Greek wooden trireme, and what weapon sat at its waterline prow?",
                      "a": "170 oarsmen on three levels and a heavy bronze ram",
                      "exp": "Triple-banked rows of 170 free oarsmen drove each nimble wooden trireme forward so its bronze ram smashed enemy hulls."
                  }
              ]
          },
          {
              "number": 5,
              "title": "Enquiry 05: Theatre, Philosophy, Maths & Medicine — How Did Greek Thinkers Change Human Knowledge? (c. 460–322 BC)",
              "shortTitle": "Theatre, Philosophy, Maths",
              "enquiryFocus": "How did Ancient Greek playwrights, philosophers, doctors, and mathematicians transform human knowledge?",
              "questions": [
                  {
                      "num": 17,
                      "tier": "Recall",
                      "q": "Roughly how many spectators could sit inside the curved stone hillside amphitheatre at Epidaurus and still hear clearly?",
                      "a": "About 14,000 spectators",
                      "exp": "Epidaurus’s semicircular limestone bowl seated around 14,000 people and carried stage voices right to the top row."
                  },
                  {
                      "num": 18,
                      "tier": "Detail",
                      "q": "What were the two main types of plays performed by masked actors at Greek festivals for Dionysus?",
                      "a": "Tragedies and comedies",
                      "exp": "Greek playwrights wrote serious tragedies about fate and pride alongside lively comedies poking fun at leaders and daily life."
                  },
                  {
                      "num": 19,
                      "tier": "Explain",
                      "q": "What does the Greek word \"philosopher\" literally mean, and which three thinkers formed Athens’s famous chain of teachers?",
                      "a": "\"Lover of wisdom\" — Socrates taught Plato, and Plato taught Aristotle",
                      "exp": "Socrates questioned citizens in the Agora, his pupil Plato founded the Academy, and Plato’s pupil Aristotle classified living nature."
                  },
                  {
                      "num": 20,
                      "tier": "Explain",
                      "q": "On the island of Kos, how did physician Hippocrates change the way Greek doctors treated sick patients?",
                      "a": "He observed natural symptoms, diet, and rest instead of blaming angry gods",
                      "exp": "Hippocrates taught careful clinical observation and inspired the ethical Hippocratic Oath still honoured by doctors."
                  }
              ]
          },
          {
              "number": 6,
              "title": "Enquiry 06: Alexander the Great & Our World Today — What Is Ancient Greece’s Lasting Legacy? (336–146 BC & Today)",
              "shortTitle": "Alexander the Great & Our ",
              "enquiryFocus": "How did Alexander the Great spread Greek culture, and what is Ancient Greece’s lasting legacy in our world today?",
              "questions": [
                  {
                      "num": 21,
                      "tier": "Recall",
                      "q": "Which famous philosopher tutored young Alexander of Macedon, and what was the name of Alexander’s beloved warhorse?",
                      "a": "Tutored by Aristotle; rode his warhorse Bucephalus",
                      "exp": "Aristotle sparked Alexander’s love of Greek learning, while young Alexander famously tamed his black warhorse Bucephalus."
                  },
                  {
                      "num": 22,
                      "tier": "Detail",
                      "q": "Which two famous landmarks stood in Egypt’s Hellenistic city of Alexandria?",
                      "a": "The Great Library of papyrus scrolls and the towering Pharos Lighthouse",
                      "exp": "Alexandria in Egypt boasted the ancient world’s greatest scroll library alongside the sky-scraping Pharos Lighthouse."
                  },
                  {
                      "num": 23,
                      "tier": "Explain",
                      "q": "What happened in 146 BC when the Roman Republic conquered mainland Greece?",
                      "a": "Rome ruled Greece politically, yet eagerly copied Greek statues, temples, and teachers",
                      "exp": "Even after conquering Greece in 146 BC, Romans deeply admired Greek art, theatre, philosophy, and architecture."
                  },
                  {
                      "num": 24,
                      "tier": "Explain",
                      "q": "How can you recognise a Greek Corinthian column capital compared with plain Doric and scrolled Ionic capitals?",
                      "a": "It is decorated with ornate carved acanthus leaves",
                      "exp": "Doric tops are plain and sturdy, Ionic tops feature twin spiral scrolls, and Corinthian tops bloom with carved acanthus leaves."
                  }
              ]
          }
      ]
  },
  ks2_early_islamic_baghdad: {
      "unitTitle": "Early Islamic Baghdad (c. AD 750 – 1258)",
      "subtitle": "24-Question Master Retrieval Check & Self-Marking Key (Enquiries 01–06)",
      "enquiries": [
          {
              "number": 1,
              "title": "Enquiry 01: Crossroads of the World — Why Did Caliph al-Mansur Build the Round City of Baghdad? (AD 750–800)",
              "shortTitle": "Crossroads of the World",
              "enquiryFocus": "Why did Caliph al-Mansur build the Round City of Baghdad, and how did it compare with Britain around AD 900?",
              "questions": [
                  {
                      "num": 1,
                      "tier": "Recall",
                      "q": "Which Abbasid Caliph founded the circular Round City of Baghdad beside the River Tigris in AD 762?",
                      "a": "Caliph al-Mansur",
                      "exp": "Abbasid Caliph al-Mansur chose a fertile bend on the River Tigris in AD 762 and hired 100,000 workers to build Baghdad."
                  },
                  {
                      "num": 2,
                      "tier": "Detail",
                      "q": "What did Baghdad’s official Arabic name, Madinat al-Salam, mean in English?",
                      "a": "City of Peace",
                      "exp": "Caliph al-Mansur officially named his planned circular capital Madinat al-Salam, meaning the \"City of Peace\"."
                  },
                  {
                      "num": 3,
                      "tier": "Explain",
                      "q": "Which two buildings stood right at the very centre of the two-kilometre Round City of Baghdad?",
                      "a": "The Great Mosque and the Green Dome Palace",
                      "exp": "Straight roads from the Kufa, Basra, Khorasan, and Syria gates led to the central park holding the Great Mosque and Green Dome Palace."
                  },
                  {
                      "num": 4,
                      "tier": "Explain",
                      "q": "Roughly how many people lived in Baghdad by AD 900 compared with major Anglo-Saxon towns in Britain?",
                      "a": "Nearly 1,000,000 in Baghdad vs 5,000–10,000 in big Anglo-Saxon towns",
                      "exp": "By AD 900, Baghdad held nearly one million citizens with paved streets and libraries, while large Anglo-Saxon towns held 5,000–10,000."
                  }
              ]
          },
          {
              "number": 2,
              "title": "Enquiry 02: Inside the House of Wisdom — How Did Paper & Translators Rescue World Knowledge? (c. AD 800–1000)",
              "shortTitle": "Inside the House of Wisdom",
              "enquiryFocus": "How did cheap paper and Baghdad’s House of Wisdom rescue and expand world knowledge?",
              "questions": [
                  {
                      "num": 5,
                      "tier": "Recall",
                      "q": "What was Baghdad’s famous royal library and research academy called in English and Arabic?",
                      "a": "The House of Wisdom (Bayt al-Hikma)",
                      "exp": "Expanded by Caliphs Harun al-Rashid and al-Ma’mun, the House of Wisdom (Bayt al-Hikma) welcomed scholars and translators from many lands."
                  },
                  {
                      "num": 6,
                      "tier": "Detail",
                      "q": "Through which Central Asian Silk Road city did Chinese paper-making reach Baghdad, replacing costly European parchment?",
                      "a": "Samarkand",
                      "exp": "Craftworkers via Samarkand taught Islamic mills how to beat cotton and linen rags into cheap, smooth paper, sparking over 100 bookshops in Baghdad."
                  },
                  {
                      "num": 7,
                      "tier": "Explain",
                      "q": "Who was Hunayn ibn Ishaq inside ninth-century Baghdad’s House of Wisdom?",
                      "a": "A gifted Christian doctor who translated Greek medical books into Arabic",
                      "exp": "Hunayn ibn Ishaq worked alongside Muslim and Jewish colleagues, translating Greek medical scrolls into clear Arabic and testing their ideas."
                  },
                  {
                      "num": 8,
                      "tier": "Explain",
                      "q": "What lasting centre of learning did Fatima al-Fihri found in Fez, Morocco, in AD 859?",
                      "a": "Al-Qarawiyyin mosque and teaching college",
                      "exp": "Fatima al-Fihri used her family inheritance in AD 859 to build al-Qarawiyyin in Fez, which still welcomes students today!"
                  }
              ]
          },
          {
              "number": 3,
              "title": "Enquiry 03: Zero, Algebra, Astrolabes & Free Hospitals — What Did Golden Age Scientists Discover? (c. AD 820–1050)",
              "shortTitle": "Zero, Algebra, Astrolabes ",
              "enquiryFocus": "How did Golden Age mathematicians, astronomers, engineers, and doctors change world science forever?",
              "questions": [
                  {
                      "num": 9,
                      "tier": "Recall",
                      "q": "Which Baghdad mathematician championed 0–9 numerals (including zero, sifr) and gave us the words \"algebra\" and \"algorithm\"?",
                      "a": "Muhammad al-Khwarizmi",
                      "exp": "Muhammad al-Khwarizmi’s book al-Jabr gave us \"algebra\", while his own name in Latin gave us \"algorithm\"."
                  },
                  {
                      "num": 10,
                      "tier": "Detail",
                      "q": "What precision brass instrument did tenth-century craftworker Mariam al-Asturlabi make to map stars, time, and Mecca?",
                      "a": "An astrolabe",
                      "exp": "Mariam al-Asturlabi crafted intricate brass astrolabes used by astronomers, sailors, and travellers across the Islamic world."
                  },
                  {
                      "num": 11,
                      "tier": "Explain",
                      "q": "What did scientist Ibn al-Haytham prove inside his pitch-dark pinhole room (camera obscura)?",
                      "a": "Light travels in straight lines from objects into our eyes",
                      "exp": "By watching an upside-down outdoor scene shine through a tiny pinhole onto a dark wall, Ibn al-Haytham proved light travels in straight lines into our eyes."
                  },
                  {
                      "num": 12,
                      "tier": "Explain",
                      "q": "Why did Baghdad’s chief physician al-Razi hang fresh pieces of meat across different parts of the city?",
                      "a": "To find where meat rotted slowest so he could build a hospital in the cleanest air",
                      "exp": "Al-Razi chose the spot where the meat rotted slowest, knowing clean air would help bimaristan patients recover!"
                  }
              ]
          },
          {
              "number": 4,
              "title": "Enquiry 04: Silk Road Caravans, Dhows & Viking Dirhams — How Far Did Baghdad's Traders Reach? (c. AD 850–1000)",
              "shortTitle": "Silk Road Caravans, Dhows ",
              "enquiryFocus": "How did land caravans and sea dhows make Baghdad a trading superpower, and how did Islamic coins reach Britain?",
              "questions": [
                  {
                      "num": 13,
                      "tier": "Recall",
                      "q": "Roughly how far apart were fortified roadside caravanserais built along the Silk Road?",
                      "a": "Every thirty kilometres (about one day’s camel march)",
                      "exp": "Spacing walled caravanserais every 30 km meant camel caravans could reach safe shelter, water, and locked gates before nightfall."
                  },
                  {
                      "num": 14,
                      "tier": "Detail",
                      "q": "What type of stitched wooden sailing ship carried merchants from Basra across the Indian Ocean?",
                      "a": "An Arab dhow with triangular sails",
                      "exp": "Stitched wooden dhows rigged with triangular sails rode monsoon winds across the Indian Ocean while captains navigated with brass astrolabes."
                  },
                  {
                      "num": 15,
                      "tier": "Explain",
                      "q": "Which Arabic banking word for a signed paper payment slip gave English the word \"cheque\"?",
                      "a": "Sakk",
                      "exp": "Baghdad merchants carried a signed paper sakk instead of heavy gold bags and cashed it safely in distant cities."
                  },
                  {
                      "num": 16,
                      "tier": "Explain",
                      "q": "Near which Viking city in England have archaeologists dug up hoards containing Abbasid silver dirhams?",
                      "a": "Jorvik (modern York)",
                      "exp": "Viking traders brought pure Islamic silver dirhams along Russian rivers to Scandinavia and Viking Yorkshire around Jorvik!"
                  }
              ]
          },
          {
              "number": 5,
              "title": "Enquiry 05: Geometric Tilework, Calligraphy & Chess — What Was Everyday Life Like in Baghdad c. AD 900?",
              "shortTitle": "Geometric Tilework, Callig",
              "enquiryFocus": "How did Baghdad’s families keep cool, eat, worship, create dazzling art, and relax around AD 900?",
              "questions": [
                  {
                      "num": 17,
                      "tier": "Recall",
                      "q": "How did a tall windcatcher (badgir) tower cool a Baghdad courtyard house without electricity?",
                      "a": "By scooping high outdoor breezes down indoors while pushing hot air out",
                      "exp": "Facing into the wind above rooftop level, badgir windcatcher towers funnelled cool air straight into shaded courtyard rooms."
                  },
                  {
                      "num": 18,
                      "tier": "Detail",
                      "q": "Which group of crops spread through Baghdad’s irrigated orchards and kitchens around AD 900?",
                      "a": "Lemons, oranges, aubergines, spinach, pomegranates, almonds, and cane sugar",
                      "exp": "Canal waterwheels allowed citrus fruits, aubergines, spinach, pomegranates, almonds, and sweet cane sugar to flourish."
                  },
                  {
                      "num": 19,
                      "tier": "Explain",
                      "q": "Why did artists decorating mosques avoid carving human or animal statues?",
                      "a": "So worshippers focused purely on honouring God rather than statues, inspiring geometry, arabesque, and calligraphy",
                      "exp": "Avoiding idols in worship inspired Islamic artists to master mathematical star mosaics, leafy arabesques, and sacred Arabic calligraphy."
                  },
                  {
                      "num": 20,
                      "tier": "Explain",
                      "q": "What were shimmering metallic-glazed ceramic dishes and royal embroidered silk bands called in Baghdad?",
                      "a": "Lustreware bowls and tiraz silk robes",
                      "exp": "Iraqi potters invented metallic lustreware glazes that shone like gold, while royal tiraz workshops wove honoured silk robes."
                  }
              ]
          },
          {
              "number": 6,
              "title": "Enquiry 06: The 1258 Siege of Baghdad & Our World Today — Did the Golden Age Really Disappear? (AD 1258 & Today)",
              "shortTitle": "The 1258 Siege of Baghdad ",
              "enquiryFocus": "Why did Baghdad fall in 1258, how did Golden Age ideas survive, and how do they shape our lives today?",
              "questions": [
                  {
                      "num": 21,
                      "tier": "Recall",
                      "q": "Which Mongol commander besieged and captured Baghdad in January–February AD 1258?",
                      "a": "Hulagu Khan",
                      "exp": "Hulagu Khan’s vast Mongol army surrounded Baghdad on the Tigris in January 1258 and breached its walls with counterweight trebuchets in February."
                  },
                  {
                      "num": 22,
                      "tier": "Detail",
                      "q": "Why weren’t all of Baghdad’s Golden Age discoveries lost forever when the House of Wisdom burned in 1258?",
                      "a": "Copies written on paper already sat safely in libraries in Cairo, Damascus, Samarkand, and Islamic Spain",
                      "exp": "Because cheap paper had spread centuries earlier, scholars across the wider Islamic world already owned thousands of manuscript copies!"
                  },
                  {
                      "num": 23,
                      "tier": "Explain",
                      "q": "In which Spanish city did Muslim, Jewish, and Christian scholars translate Arabic science books into Latin?",
                      "a": "Toledo",
                      "exp": "Toledo’s famous multi-faith translation workshops turned al-Khwarizmi, Ibn al-Haytham, and Ibn Sina into Latin, helping spark Europe’s Renaissance."
                  },
                  {
                      "num": 24,
                      "tier": "Explain",
                      "q": "Which magnificent palace in Granada, Spain, shows Islamic architecture flourishing in Al-Andalus even after 1258?",
                      "a": "The Alhambra",
                      "exp": "With its carved stucco arches, geometric tiles, and marble courtyards, the Alhambra in Spain showcases continuing Islamic artistry."
                  }
              ]
          }
      ]
  },
  ks2_maya_civilisation: {
      "unitTitle": "The Ancient Maya (c. 2000 BC – AD 1500)",
      "subtitle": "24-Question Master Retrieval Check & Self-Marking Key (Enquiries 01–06)",
      "enquiries": [
          {
              "number": 1,
              "title": "Enquiry 01: Cities in the Rainforest — How Did the Maya Build Thriving Cities in Mesoamerica? (c. 2000 BC–AD 600)",
              "shortTitle": "Cities in the Rainforest",
              "enquiryFocus": "How did the Maya build thriving stone cities in Mesoamerica without metal tools or wheels?",
              "questions": [
                  {
                      "num": 1,
                      "tier": "Recall",
                      "q": "Which five modern countries make up the ancient Maya homeland in Mesoamerica?",
                      "a": "Southern Mexico, Guatemala, Belize, Honduras, and El Salvador",
                      "exp": "Maya villages and stone cities stretched across Mesoamerica from southern Mexico through Guatemala, Belize, Honduras, and El Salvador!"
                  },
                  {
                      "num": 2,
                      "tier": "Detail",
                      "q": "What razor-sharp black volcanic glass did Maya workers dig from the southern highlands?",
                      "a": "Obsidian",
                      "exp": "Highland volcanoes formed glassy black obsidian, which Maya craftworkers chipped into cutting blades sharper than modern steel!"
                  },
                  {
                      "num": 3,
                      "tier": "Explain",
                      "q": "What are the deep natural limestone sinkholes used as freshwater wells across northern Yucatán called?",
                      "a": "Cenotes",
                      "exp": "Because rainwater soaked straight through porous Yucatán limestone, collapsed natural sinkholes called cenotes gave vital drinking water."
                  },
                  {
                      "num": 4,
                      "tier": "Explain",
                      "q": "Which three crops grew together in clever Mesoamerican \"Three Sisters\" companion planting?",
                      "a": "Maize, climbing beans, and broad-leaved squash",
                      "exp": "Tall maize supported climbing beans, beans enriched the soil, and broad squash leaves shaded the earth to hold in moisture!"
                  }
              ]
          },
          {
              "number": 2,
              "title": "Enquiry 02: Step Pyramids & Jade Kings — How Were Rival Maya City-States Ruled? (c. AD 250–900)",
              "shortTitle": "Step Pyramids & Jade Kings",
              "enquiryFocus": "Were the Classic Maya ruled as one empire, and what reveals the power of their kings and queens?",
              "questions": [
                  {
                      "num": 5,
                      "tier": "Recall",
                      "q": "How was the Classic Maya world organised politically between AD 250 and 900?",
                      "a": "Over forty rival independent city-states like Tikal, Calakmul, and Palenque",
                      "exp": "Just like Ancient Greece, the Classic Maya lived in dozens of independent city-states that traded, allied, and competed!"
                  },
                  {
                      "num": 6,
                      "tier": "Detail",
                      "q": "What did the royal Maya title \"K'uhul Ajaw\" mean?",
                      "a": "Holy Lord",
                      "exp": "Maya people believed their K'uhul Ajaw (\"holy lord\") spoke directly with the gods to secure rain and rich harvests."
                  },
                  {
                      "num": 7,
                      "tier": "Explain",
                      "q": "How old was K'inich Janaab' Pakal when he became ruler of Palenque in AD 615, and how long did he reign?",
                      "a": "Aged 12, ruling for 68 years",
                      "exp": "Pakal took Palenque’s throne aged twelve in AD 615 and ruled for sixty-eight years until AD 683!"
                  },
                  {
                      "num": 8,
                      "tier": "Explain",
                      "q": "What dazzling treasure did archaeologists uncover inside King Pakal’s tomb beneath the Temple of the Inscriptions?",
                      "a": "A life-sized funerary mask made from green jade mosaic tiles",
                      "exp": "Craftworkers fitted over two hundred polished green jade pieces with shell and obsidian eyes over King Pakal’s face!"
                  }
              ]
          },
          {
              "number": 3,
              "title": "Enquiry 03: Glyphs, Bark-Paper Books & Zero — Why Were Maya Scribes & Astronomers So Brilliant? (c. AD 300–900)",
              "shortTitle": "Glyphs, Bark-Paper Books &",
              "enquiryFocus": "Why do historians celebrate Maya scribes, mathematicians, and astronomers as world pioneers?",
              "questions": [
                  {
                      "num": 9,
                      "tier": "Recall",
                      "q": "Roughly how many word and syllable hieroglyphs could Classic Maya scribes combine to write their language?",
                      "a": "Over 800 glyphs",
                      "exp": "Mixing over 800 whole-word signs and spoken syllable signs let Maya scribes write any sentence on stone stelae or bark paper!"
                  },
                  {
                      "num": 10,
                      "tier": "Detail",
                      "q": "What were Maya accordion-folded books called, and what material were their pages made from?",
                      "a": "Codices made from softened fig-tree bark coated with white lime paste",
                      "exp": "Scribes beat inner fig-tree bark flat, coated it in smooth white lime paste, and painted codices like the Dresden Codex with turkey-quill brushes!"
                  },
                  {
                      "num": 11,
                      "tier": "Explain",
                      "q": "In Maya base-20 mathematics, what values did a shell, a pebble dot, and a wooden bar stand for?",
                      "a": "Shell = 0, pebble dot = 1, wooden bar = 5",
                      "exp": "With just a shell for zero, a dot for one, and a bar for five, Maya mathematicians wrote huge base-20 numbers effortlessly!"
                  },
                  {
                      "num": 12,
                      "tier": "Explain",
                      "q": "What was \"El Caracol\" at the Maya city of Chichén Itzá?",
                      "a": "A round stone astronomical observatory aligned with Venus and sunsets",
                      "exp": "Without glass telescopes, Maya priests sighted Venus and solar alignments through narrow windows high inside El Caracol!"
                  }
              ]
          },
          {
              "number": 4,
              "title": "Enquiry 04: Maize Tortillas, Frothy Cacao & Pok-ta-Pok — What Was Everyday Maya Life Like? (c. AD 600–900)",
              "shortTitle": "Maize Tortillas, Frothy Ca",
              "enquiryFocus": "What did Classic Maya people eat, trade, and play in everyday life between AD 600 and 900?",
              "questions": [
                  {
                      "num": 13,
                      "tier": "Recall",
                      "q": "What volcanic stone grinding tool did Maya cooks use every morning to crush lime-soaked maize into dough?",
                      "a": "A stone metate",
                      "exp": "After soaking maize overnight in limewater (nixtamal), cooks rolled a stone pin across a volcanic metate to make tortilla and tamale dough."
                  },
                  {
                      "num": 14,
                      "tier": "Detail",
                      "q": "How did royal Maya hosts flavour their frothy cacao drink, and how else were dried cacao beans used?",
                      "a": "With fiery chilli peppers and wild honey; spent as everyday market money",
                      "exp": "Bitter cacao was whipped into a spiced royal drink, while dried beans worked as cash — 10 beans for a rabbit and 100 for a turkey!"
                  },
                  {
                      "num": 15,
                      "tier": "Explain",
                      "q": "Which shiny black volcanic glass did highland Maya traders swap for razor-sharp cutting blades?",
                      "a": "Obsidian",
                      "exp": "Because the Classic Maya did not smelt iron, highland volcanic obsidian gave craftworkers and farmers ultra-sharp blades."
                  },
                  {
                      "num": 16,
                      "tier": "Explain",
                      "q": "How did Maya traders transport heavy jade, salt, and feathers without horses, oxen, or wheeled carts?",
                      "a": "Carried by human porters with forehead straps and paddled in wooden canoes",
                      "exp": "Porters walked stone causeways (sacbeob) using forehead tump-lines while dugout canoes paddled rivers and coastal waters."
                  }
              ]
          },
          {
              "number": 5,
              "title": "Enquiry 05: Maize Gods, Rain Caves & Chichén Itzá — How Did Maya Beliefs Shape Their World? (c. AD 600–1200)",
              "shortTitle": "Maize Gods, Rain Caves & C",
              "enquiryFocus": "What did the Maya believe about creation and the gods, and how did beliefs shape Chichén Itzá?",
              "questions": [
                  {
                      "num": 17,
                      "tier": "Recall",
                      "q": "According to the sacred Maya book Popol Vuh, what ingredient did the gods successfully use to make human beings?",
                      "a": "Yellow and white maize dough",
                      "exp": "After mud people crumbled and wooden people forgot their makers, the gods kneaded sacred yellow and white maize dough into humans!"
                  },
                  {
                      "num": 18,
                      "tier": "Detail",
                      "q": "What did the Maya call the eerie watery underworld where the Hero Twins outsmarted its fearsome lords?",
                      "a": "Xibalba",
                      "exp": "Maya communities believed deep limestone caves and water-filled cenotes were portals leading down into Xibalba."
                  },
                  {
                      "num": 19,
                      "tier": "Explain",
                      "q": "Which long-nosed Maya god controlled life-giving rain, thunder, and lightning?",
                      "a": "Chaac",
                      "exp": "Carved masks of long-nosed Chaac covered dry Yucatán palaces like Kabah, and priests offered him gifts painted in turquoise Maya Blue."
                  },
                  {
                      "num": 20,
                      "tier": "Explain",
                      "q": "Why do El Castillo’s four staircases (4 × 91 steps) plus its top temple platform add up to 365?",
                      "a": "To match the 365 days of the solar year",
                      "exp": "Maya architect-astronomers turned El Castillo into a giant stone calendar honouring every day of the Haab' solar year."
                  }
              ]
          },
          {
              "number": 6,
              "title": "Enquiry 06: The AD 900 Mystery & Living Maya Today — Did the Maya Really Vanish? (c. AD 800–Present)",
              "shortTitle": "The AD 900 Mystery & Livin",
              "enquiryFocus": "Why were southern Maya cities abandoned around AD 900, and why is the \"vanished Maya\" story a myth?",
              "questions": [
                  {
                      "num": 21,
                      "tier": "Recall",
                      "q": "What scientific clue from lake-bed mud and snail shells helped explain why southern cities like Tikal emptied around AD 900?",
                      "a": "Severe multi-year droughts that dried up southern reservoirs",
                      "exp": "Chemical clues locked in ancient lake-core shells proved southern lowlands suffered their worst droughts in thousands of years."
                  },
                  {
                      "num": 22,
                      "tier": "Detail",
                      "q": "Besides drought and warfare, how did burning huge amounts of white lime plaster for pyramids hurt Maya cities?",
                      "a": "It caused widespread deforestation, letting heavy rain wash away fertile hillside soil",
                      "exp": "Felling twenty trees to burn just one square metre of stucco plaster stripped hillsides bare and worsened local soil erosion."
                  },
                  {
                      "num": 23,
                      "tier": "Explain",
                      "q": "Which walled Postclassic Maya city perched on Caribbean Sea cliffs thrived with canoe trade centuries after AD 900?",
                      "a": "Tulum",
                      "exp": "Northern Yucatán centres like Chichén Itzá, Uxmal, and coastal Tulum flourished long after southern jungle plazas fell quiet."
                  },
                  {
                      "num": 24,
                      "tier": "Explain",
                      "q": "What do historians call an explanation that links several causes together — like drought, deforestation, and war?",
                      "a": "A multi-causal explanation",
                      "exp": "Good historians test how environmental pressures (drought and soil loss) interacted with human choices (warfare and plaster burning)."
                  }
              ]
          }
      ]
  },
  ks2_kingdom_of_benin: {
      "unitTitle": "The Kingdom of Benin (c. AD 900 – 1897)",
      "subtitle": "24-Question Master Retrieval Check & Self-Marking Key (Enquiries 01–06)",
      "enquiries": [
          {
              "number": 1,
              "title": "Enquiry 01: Rainforest Kingdom — Ogiso Rulers, Red-Earth Walls and Anglo-Saxon Contrast (c. AD 900–1180)",
              "shortTitle": "Rainforest Kingdom",
              "enquiryFocus": "How did Edo communities build a vast rainforest kingdom by AD 900?",
              "questions": [
                  {
                      "num": 1,
                      "tier": "Recall",
                      "q": "In which modern West African country did the historic Kingdom of Benin (Edo) grow?",
                      "a": "Southern Nigeria",
                      "exp": "Historic Benin City is the capital of Edo State in modern southern Nigeria—not the modern country called Republic of Benin!"
                  },
                  {
                      "num": 2,
                      "tier": "Detail",
                      "q": "What did the Edo people call themselves, their language, and their rainforest heartland?",
                      "a": "Edo",
                      "exp": "Edo is the name of the people, language, and royal heartland of the Kingdom of Benin."
                  },
                  {
                      "num": 3,
                      "tier": "Explain",
                      "q": "Which nutritious crops did early Edo families farm in sunlit rainforest clearings?",
                      "a": "White yams, plantains, and spicy pepper",
                      "exp": "Warm rainforest soil and seasonal rains produced rich harvests of yams, plantains, and Benin pepper."
                  },
                  {
                      "num": 4,
                      "tier": "Explain",
                      "q": "What valuable red liquid pressed from rainforest palm fruit fuelled Edo cooking and lamps?",
                      "a": "Palm oil",
                      "exp": "Native West African oil palms supplied rich red palm oil for stews, soap, and lamps."
                  }
              ]
          },
          {
              "number": 2,
              "title": "Enquiry 02: From Ogiso to Oba — Ewuare the Great and Golden Benin City (c. AD 1180–1500)",
              "shortTitle": "From Ogiso to Oba",
              "enquiryFocus": "How did Oba Ewuare the Great turn Benin City into a golden capital?",
              "questions": [
                  {
                      "num": 5,
                      "tier": "Recall",
                      "q": "Around AD 1180, why did Benin’s senior Uzama elders end the rule of the last Ogiso king?",
                      "a": "Because of cruel misrule, leading them to seek a wise new royal line",
                      "exp": "After banishing the last Ogiso around AD 1180, Edo elders invited wise leadership from Ife."
                  },
                  {
                      "num": 6,
                      "tier": "Detail",
                      "q": "Which sacred Yoruba city north-west of Benin sent Prince Oranmiyan to help Edo?",
                      "a": "Sacred Ife",
                      "exp": "Sacred Ife was revered across southern Nigeria for spiritual authority and lifelike brass art."
                  },
                  {
                      "num": 7,
                      "tier": "Explain",
                      "q": "Who was Prince Oranmiyan’s Edo-born son, crowned around AD 1180 as Benin’s very first Oba?",
                      "a": "Oba Eweka I",
                      "exp": "Oba Eweka I founded Benin’s royal Oba dynasty that still reigns more than 800 years later!"
                  },
                  {
                      "num": 8,
                      "tier": "Explain",
                      "q": "What does the royal title \"Oba\" mean in the Kingdom of Benin?",
                      "a": "The sacred King of Benin",
                      "exp": "Since Oba Eweka I, every sacred ruler of Benin has held the title Oba."
                  }
              ]
          },
          {
              "number": 3,
              "title": "Enquiry 03: Lost-Wax Masterpieces — Igun Street Brass-Casters, Ivory and Coral (c. AD 1400–1700)",
              "shortTitle": "Lost-Wax Masterpieces",
              "enquiryFocus": "How did Igun Street artists cast brass plaques to record Benin’s history?",
              "questions": [
                  {
                      "num": 9,
                      "tier": "Recall",
                      "q": "Although museums call them \"Benin Bronzes\", what golden metal are most Benin plaques actually made from?",
                      "a": "Brass (a mix of copper and zinc)",
                      "exp": "Tests show most Benin sculptures are brass (copper and zinc), which gleamed like gold when polished!"
                  },
                  {
                      "num": 10,
                      "tier": "Detail",
                      "q": "Which two metals are mixed together to make bright golden brass?",
                      "a": "Copper and zinc",
                      "exp": "Mixing copper with zinc creates golden brass, whereas mixing copper with tin makes bronze."
                  },
                  {
                      "num": 11,
                      "tier": "Explain",
                      "q": "By royal Edo law, who was the ONLY person allowed to own brass sculptures or gift them to chiefs?",
                      "a": "The sacred Oba of Benin",
                      "exp": "Royal brass belonged strictly to the Oba, making every plaque and head a sacred treasure."
                  },
                  {
                      "num": 12,
                      "tier": "Explain",
                      "q": "On which famous street in Benin City did the hereditary royal guild of brass-casters live and work?",
                      "a": "Igun Street",
                      "exp": "Master brass-casting families have lived and worked on Igun Street for hundreds of years!"
                  }
              ]
          },
          {
              "number": 4,
              "title": "Enquiry 04: Sacred Court Rituals — The Oba, Queen Mother Idia and Everyday Edo Life (c. AD 1500–1700)",
              "shortTitle": "Sacred Court Rituals",
              "enquiryFocus": "What was life like inside the Oba’s court and Edo rainforest villages?",
              "questions": [
                  {
                      "num": 13,
                      "tier": "Recall",
                      "q": "In Edo religion, who was Olokun?",
                      "a": "The revered god of rivers, oceans, and wealth",
                      "exp": "Olokun was honoured across Benin as god of great waters, ocean trade, and prosperity."
                  },
                  {
                      "num": 14,
                      "tier": "Detail",
                      "q": "What famous praise-title compared the sacred Oba inside his palace to the king of the forest?",
                      "a": "Leopard of the House",
                      "exp": "Edo singers hailed the wise, fearless Oba as \"Leopard of the House\"."
                  },
                  {
                      "num": 15,
                      "tier": "Explain",
                      "q": "Why was the West African mudfish chosen as a sacred royal symbol on Benin plaques?",
                      "a": "It can swim in water AND breathe while wriggling across damp land",
                      "exp": "Living in both water and damp mud made mudfish the ideal symbol linking land and water-god Olokun!"
                  },
                  {
                      "num": 16,
                      "tier": "Explain",
                      "q": "Who was revered in Edo belief as the supreme creator god above all?",
                      "a": "Osanobua",
                      "exp": "Edo people honoured supreme creator god Osanobua alongside Olokun, his son and god of waters."
                  }
              ]
          },
          {
              "number": 5,
              "title": "Enquiry 05: Global Traders — Brass Manillas, Cowrie Shells and European Visitors (c. AD 1485–1850)",
              "shortTitle": "Global Traders",
              "enquiryFocus": "Why were European visitors so amazed by Benin’s trade and wide streets?",
              "questions": [
                  {
                      "num": 17,
                      "tier": "Recall",
                      "q": "In which year did Portuguese explorer João Afonso de Aveiro first visit Benin City?",
                      "a": "AD 1485",
                      "exp": "João Afonso de Aveiro sailed up the Benin River to Gwato port and visited Benin City in AD 1485."
                  },
                  {
                      "num": 18,
                      "tier": "Detail",
                      "q": "Which Europeans were the VERY FIRST ocean sailors to reach the Kingdom of Benin in 1485?",
                      "a": "The Portuguese",
                      "exp": "Portuguese navigators exploring West Africa’s Atlantic coast reached Benin in 1485."
                  },
                  {
                      "num": 19,
                      "tier": "Explain",
                      "q": "At which busy Benin River port did foreign ships have to anchor and ask the Oba’s permission to trade?",
                      "a": "Gwato port (Ughoton)",
                      "exp": "No European trader could buy pepper or cloth at Gwato port without the Oba’s royal licence!"
                  },
                  {
                      "num": 20,
                      "tier": "Explain",
                      "q": "To which European capital city did the Oba send royal Benin ambassadors around 1514?",
                      "a": "Lisbon in Portugal",
                      "exp": "King Manuel I of Portugal welcomed Benin’s royal ambassador at his court in Lisbon!"
                  }
              ]
          },
          {
              "number": 6,
              "title": "Enquiry 06: 1897 British Invasion, Looted Bronzes and Living Edo Heritage Today (1897–Present)",
              "shortTitle": "1897 British Invasion, Looted Bronze",
              "enquiryFocus": "Why did Britain invade Benin in 1897, and should looted bronzes return?",
              "questions": [
                  {
                      "num": 21,
                      "tier": "Recall",
                      "q": "Which two valuable rainforest resources did late-Victorian British factories want to control around Benin in the 1890s?",
                      "a": "Palm oil and rubber",
                      "exp": "Palm oil lubricated factory machines and made soap, while rubber made tyres and cables."
                  },
                  {
                      "num": 22,
                      "tier": "Detail",
                      "q": "Which Oba of Benin defended his kingdom’s trade independence when British forces invaded in 1897?",
                      "a": "Oba Ovonramwen",
                      "exp": "Oba Ovonramwen Nogbaisi reigned from 1888 until British forces exiled him in 1897."
                  },
                  {
                      "num": 23,
                      "tier": "Explain",
                      "q": "Why was it disrespectful for a British column to march toward Benin City uninvited in January 1897?",
                      "a": "Oba Ovonramwen was holding sacred Igue rituals when foreign visitors were forbidden",
                      "exp": "Ignoring royal warnings during sacred rituals, the uninvited column was ambushed by chiefs without Ovonramwen’s order."
                  },
                  {
                      "num": 24,
                      "tier": "Explain",
                      "q": "In which month and year did 1,200 British troops capture Benin City in the \"Punitive Expedition\"?",
                      "a": "February 1897",
                      "exp": "Twelve hundred British troops captured Benin City in February 1897."
                  }
              ]
          }
      ]
  },
  ks2_victorian_britain: {
      "unitTitle": "Victorian Britain (1837 – 1901)",
      "subtitle": "24-Question Master Retrieval Check & Self-Marking Key (Enquiries 01–06)",
      "enquiries": [
          {
              "number": 1,
              "title": "Enquiry 01: Young Queen Victoria, Steam Railways and Shrinking Britain (1837–1860)",
              "shortTitle": "Young Queen Victoria, Steam Railways",
              "enquiryFocus": "How did steam railways and penny post shrink Queen Victoria’s Britain?",
              "questions": [
                  {
                      "num": 1,
                      "tier": "Recall",
                      "q": "How old was Princess Victoria when she inherited the British throne on 20 June 1837?",
                      "a": "Eighteen years old",
                      "exp": "Born in May 1819, Victoria became Queen aged just eighteen in June 1837!"
                  },
                  {
                      "num": 2,
                      "tier": "Detail",
                      "q": "Who did Queen Victoria marry in February 1840?",
                      "a": "Prince Albert",
                      "exp": "Prince Albert shared Victoria’s passion for science, industry, and the 1851 Great Exhibition."
                  },
                  {
                      "num": 3,
                      "tier": "Explain",
                      "q": "What does calling Queen Victoria a \"constitutional monarch\" mean?",
                      "a": "She reigned as head of state while elected Parliament debated and passed laws",
                      "exp": "In Victorian Britain, elected MPs and Prime Ministers in Parliament passed the laws."
                  },
                  {
                      "num": 4,
                      "tier": "Explain",
                      "q": "In June 1842, Queen Victoria became the very first British monarch to travel by what?",
                      "a": "A coal-powered steam train into London Paddington",
                      "exp": "Her smooth 25-minute journey from Slough to Paddington convinced nervous families that trains were safe."
                  }
              ]
          },
          {
              "number": 2,
              "title": "Enquiry 02: Chimneys, Cotton Mills and Children Underground (1837–1850)",
              "shortTitle": "Chimneys, Cotton Mills and Children",
              "enquiryFocus": "Why was factory and coal-mine work so dangerous for Victorian children?",
              "questions": [
                  {
                      "num": 5,
                      "tier": "Recall",
                      "q": "Which booming Lancashire city was nicknamed \"Cottonopolis\" because of its steam-powered cotton mills?",
                      "a": "Manchester",
                      "exp": "Manchester and surrounding Lancashire towns spun and wove cotton cloth exported worldwide."
                  },
                  {
                      "num": 6,
                      "tier": "Detail",
                      "q": "What historic milestone did the 1851 Victorian Census reveal for the very first time?",
                      "a": "More people in Britain lived in towns and cities than in the countryside",
                      "exp": "Rapid factory and railway growth turned Britain into the world’s first urban industrial nation by 1851."
                  },
                  {
                      "num": 7,
                      "tier": "Explain",
                      "q": "Why did loving working-class parents often send eight- or nine-year-old children to work in mills?",
                      "a": "Because low adult wages and zero welfare meant families needed every penny for bread and rent",
                      "exp": "If a parent fell ill or wages dropped, a child’s few shillings kept the family out of the workhouse."
                  },
                  {
                      "num": 8,
                      "tier": "Explain",
                      "q": "How long was a typical daily factory or coal-pit shift for early Victorian working children?",
                      "a": "Twelve hours a day, six days a week",
                      "exp": "Children often started at five or six in the morning and finished late in the evening, resting only on Sundays."
                  }
              ]
          },
          {
              "number": 3,
              "title": "Enquiry 03: Workhouses, Ragged Schools and Champions of Reform (1834–1880)",
              "shortTitle": "Workhouses, Ragged Schools and Champ",
              "enquiryFocus": "How did Victorian reformers rescue children from workhouses, pits, and streets?",
              "questions": [
                  {
                      "num": 9,
                      "tier": "Recall",
                      "q": "Which 1834 law grouped parishes together to build harsh brick \"Union Workhouses\"?",
                      "a": "The 1834 Poor Law Amendment Act",
                      "exp": "The 1834 Poor Law ended most outdoor parish cash handouts and pushed destitute families into Union Workhouses."
                  },
                  {
                      "num": 10,
                      "tier": "Detail",
                      "q": "What shocking rule greeted poor families the moment they stepped inside a Victorian workhouse?",
                      "a": "Husbands, wives, and children were split up into separate locked wards",
                      "exp": "Splitting loving families apart was one of the cruellest parts of the Victorian workhouse system."
                  },
                  {
                      "num": 11,
                      "tier": "Explain",
                      "q": "What thin, watery food was served to hungry inmates inside workhouse dining halls?",
                      "a": "Oatmeal gruel",
                      "exp": "Boiled from a handful of oatmeal in giant copper cauldrons, watery gruel left growing children hungry."
                  },
                  {
                      "num": 12,
                      "tier": "Explain",
                      "q": "What was \"oakum\" that workhouse inmates had to unpick with sore fingers for hours?",
                      "a": "Stiff, tar-soaked old ship ropes",
                      "exp": "Loose oakum fibres were sold back to shipbuilders to pack (\"caulk\") gaps between wooden ship planks!"
                  }
              ]
          },
          {
              "number": 4,
              "title": "Enquiry 04: Inside a Victorian Classroom — Slates, Drill and the 1870 School Act (1870–1901)",
              "shortTitle": "Inside a Victorian Classroom",
              "enquiryFocus": "What was daily life really like inside a strict Victorian classroom?",
              "questions": [
                  {
                      "num": 13,
                      "tier": "Recall",
                      "q": "At the start of Queen Victoria’s reign in 1837, could every poor child attend a free local state school?",
                      "a": "No—over half of poor children never went to school at all",
                      "exp": "Before 1870, Britain relied on a patchwork of fee-paying schools, church schools, Dame Schools, and Ragged Schools."
                  },
                  {
                      "num": 14,
                      "tier": "Detail",
                      "q": "Who steered the landmark 1870 Elementary Education Act through Parliament to build local \"Board Schools\"?",
                      "a": "William Forster",
                      "exp": "Forster’s 1870 Act created elected local School Boards to build schools wherever places were lacking."
                  },
                  {
                      "num": 15,
                      "tier": "Explain",
                      "q": "In which year did school attendance become COMPULSORY by law for children aged five to ten?",
                      "a": "1880",
                      "exp": "Mundella’s 1880 Education Act required parents to send five-to-ten-year-olds to school rather than casual jobs."
                  },
                  {
                      "num": 16,
                      "tier": "Explain",
                      "q": "In which year did Parliament finally abolish weekly \"school pence\" fees so elementary schools became FREE?",
                      "a": "1891",
                      "exp": "Until 1891, poor parents still had to find a few pennies each Monday morning for each child’s lessons!"
                  }
              ]
          },
          {
              "number": 5,
              "title": "Enquiry 05: Workshop of the World — The 1851 Crystal Palace and Dazzling Inventions (1851–1901)",
              "shortTitle": "Workshop of the World",
              "enquiryFocus": "Why did the 1851 Crystal Palace and new inventions amaze the world?",
              "questions": [
                  {
                      "num": 17,
                      "tier": "Recall",
                      "q": "On 1 May 1851, which royal couple opened the Great Exhibition inside London’s Hyde Park?",
                      "a": "Queen Victoria and Prince Albert",
                      "exp": "Prince Albert planned the 1851 Great Exhibition of the Works of Industry of All Nations."
                  },
                  {
                      "num": 18,
                      "tier": "Detail",
                      "q": "Who designed the giant cast-iron and glass \"Crystal Palace\" in just a few days?",
                      "a": "Sir Joseph Paxton",
                      "exp": "Joseph Paxton had perfected iron-and-glass greenhouses as head gardener at Chatsworth House!"
                  },
                  {
                      "num": 19,
                      "tier": "Explain",
                      "q": "Why did Joseph Paxton give the central Transept of the Crystal Palace a towering curved glass arch?",
                      "a": "To enclose full-grown living Hyde Park elm trees without chopping them down",
                      "exp": "Visitors marvelled at full-grown green elm trees standing right inside the bright glass hall!"
                  },
                  {
                      "num": 20,
                      "tier": "Explain",
                      "q": "Roughly how many people visited the Crystal Palace during its five months in 1851?",
                      "a": "Six million visitors (around a third of Britain’s population)",
                      "exp": "Cheap \"Shilling Days\" and Thomas Cook steam excursion trains allowed working families across Britain to visit!"
                  }
              ]
          },
          {
              "number": 6,
              "title": "Enquiry 06: Rich and Poor Homes, Seaside Holidays and Victoria’s 63-Year Legacy (1850–1901)",
              "shortTitle": "Rich and Poor Homes, Seaside Holiday",
              "enquiryFocus": "How much had daily life changed across Britain by January 1901?",
              "questions": [
                  {
                      "num": 21,
                      "tier": "Recall",
                      "q": "What were cramped working-class Victorian brick houses sharing three walls with neighbours called?",
                      "a": "Back-to-back houses",
                      "exp": "Built tightly round narrow courts with no back windows or gardens, back-to-backs were dark and damp."
                  },
                  {
                      "num": 22,
                      "tier": "Detail",
                      "q": "Where did families living in Victorian back-to-back courts fetch clean water and use the toilet?",
                      "a": "At a shared cold standpipe tap and brick privies outside in the courtyard",
                      "exp": "Several large families had to queue at one freezing outdoor courtyard tap in all weathers!"
                  },
                  {
                      "num": 23,
                      "tier": "Explain",
                      "q": "How did most working-class Victorian families take a warm wash on Friday nights?",
                      "a": "Boiling kettles on the coal range to fill a tin bath in front of the fire",
                      "exp": "Parents and children took turns in the same tin tub beside the kitchen hearth!"
                  },
                  {
                      "num": 24,
                      "tier": "Explain",
                      "q": "What was the single most common paid job for teenage girls and unmarried women in late-Victorian Britain?",
                      "a": "Working \"below stairs\" as a domestic servant in wealthier homes",
                      "exp": "Over 1.5 million Victorian women worked long hours cooking, scrubbing grates, and answering parlour bells."
                  }
              ]
          }
      ]
  },
  ks2_local_history_detective: {
      "unitTitle": "History on Our Doorstep — Local Detective Toolkit",
      "subtitle": "24-Question Master Retrieval Check & Self-Marking Key (Enquiries 01–06)",
      "enquiries": [
          {
              "number": 1,
              "title": "Enquiry 01: Secret Code in Place-Names and Old Ordnance Survey Maps",
              "shortTitle": "Secret Code in Place-Names and Old O",
              "enquiryFocus": "How do place-names and old maps unlock secret history on our doorstep?",
              "questions": [
                  {
                      "num": 1,
                      "tier": "Recall",
                      "q": "Which Latin word for a walled Roman fort gives us British town names like Chester, Manchester, and Lancaster?",
                      "a": "Castra",
                      "exp": "Latin \"castra\" (walled military camp) became -chester, -caster, and -cester in English place-names."
                  },
                  {
                      "num": 2,
                      "tier": "Detail",
                      "q": "Which group of settlers left Britain’s most common village endings: -ham, -ton, -ford, and -ley?",
                      "a": "The Anglo-Saxons",
                      "exp": "Old English speaking Anglo-Saxons named homesteads (-ham), farms (-ton), crossings (-ford), and clearings (-ley)."
                  },
                  {
                      "num": 3,
                      "tier": "Explain",
                      "q": "If you visit Whitby, Grimsby, or Scunthorpe, which settlers named those -by and -thorpe places?",
                      "a": "Viking settlers in the Danelaw",
                      "exp": "Old Norse \"-by\" (farm/village) and \"-thorpe\" (outlying hamlet) mark areas of Viking settlement."
                  },
                  {
                      "num": 4,
                      "tier": "Explain",
                      "q": "What did the Anglo-Saxon ending \"-ford\" mean in town names like Oxford and Stafford?",
                      "a": "A shallow river crossing",
                      "exp": "Oxford literally meant the shallow river crossing (\"ford\") where oxen waded across!"
                  }
              ]
          },
          {
              "number": 2,
              "title": "Enquiry 02: Reading Buildings on the High Street — Timber, Brick and Royal Cyphers",
              "shortTitle": "Reading Buildings on the High Street",
              "enquiryFocus": "How can timber frames, brickwork, and postboxes date a British street?",
              "questions": [
                  {
                      "num": 5,
                      "tier": "Recall",
                      "q": "Why do local history detectives always look UP above modern ground-floor shopfronts on a British High Street?",
                      "a": "Because older Tudor, Georgian, and Victorian upper floors often survive untouched above modern shop signs",
                      "exp": "Ground-floor shopfronts get refitted every few years, whereas upper storeys often keep their original beams, bricks, and windows!"
                  },
                  {
                      "num": 6,
                      "tier": "Detail",
                      "q": "What is an overhanging upper floor on a Tudor timber-framed building called?",
                      "a": "A jetty",
                      "exp": "Tudor carpenters jutted upper \"jetty\" floors out over narrow streets to gain extra floor space upstairs."
                  },
                  {
                      "num": 7,
                      "tier": "Explain",
                      "q": "What mixture filled the panels between dark oak beams in many Tudor houses?",
                      "a": "Wattle and daub (woven sticks plastered with mud, straw, and lime)",
                      "exp": "Woven hazel wattles smeared with daub and limewash made warm, weatherproof walls between oak timbers."
                  },
                  {
                      "num": 8,
                      "tier": "Explain",
                      "q": "Why did Tudor windows use lots of tiny diamond-shaped glass panes held in lead strips?",
                      "a": "Large flat sheets of glass could not yet be made cheaply",
                      "exp": "Crown and cylinder glass was handmade in small pieces, so glaziers joined small diamond quarries with lead!"
                  }
              ]
          },
          {
              "number": 3,
              "title": "Enquiry 03: Voices From Number 12 — Censuses, Parish Books and School Logbooks",
              "shortTitle": "Voices From Number 12 — Censuses, Pa",
              "enquiryFocus": "What can censuses, parish books, and school logbooks reveal about past families?",
              "questions": [
                  {
                      "num": 9,
                      "tier": "Recall",
                      "q": "In which year did Britain hold its very first national Census, repeating every ten years since (except wartime 1941)?",
                      "a": "1801",
                      "exp": "Started in 1801 (and listing full household names and jobs from 1841), the UK Census runs every ten years!"
                  },
                  {
                      "num": 10,
                      "tier": "Detail",
                      "q": "From which Census year onwards were the individual names, ages, and jobs of every person in each house written down?",
                      "a": "1841",
                      "exp": "The 1841 Census was the first modern UK Census to record every named individual in every household."
                  },
                  {
                      "num": 11,
                      "tier": "Explain",
                      "q": "What was the job title of the local official who walked door to door collecting and copying Census forms?",
                      "a": "An enumerator",
                      "exp": "Each enumerator copied household schedules neatly into lined enumerator books now kept at The National Archives."
                  },
                  {
                      "num": 12,
                      "tier": "Explain",
                      "q": "For how many years are modern UK personal Census sheets kept locked away to protect living people’s privacy?",
                      "a": "One hundred years",
                      "exp": "Under the 100-year rule, the 1921 Census opened in 2022—so families can read great-grandparents’ real handwriting!"
                  }
              ]
          },
          {
              "number": 4,
              "title": "Enquiry 04: How Our Town Earned Its Living — Farms, Canals, Mills and Stations",
              "shortTitle": "How Our Town Earned Its Living",
              "enquiryFocus": "How do street names, canals, mills, and stations show past local work?",
              "questions": [
                  {
                      "num": 13,
                      "tier": "Recall",
                      "q": "Why did historic market towns like Wymondham build roofed \"market crosses\" on open wooden or stone pillars?",
                      "a": "To keep butter, cheese, and market traders sheltered from rain at the town crossroads",
                      "exp": "Open ground-floor arches sheltered weekly market stalls right at the heart of town!"
                  },
                  {
                      "num": 14,
                      "tier": "Detail",
                      "q": "What were \"turnpike roads\" in eighteenth-century Britain?",
                      "a": "Main toll roads where travellers paid at a gate so trusts maintained the road surface and milestones",
                      "exp": "Turnpike trusts used toll money to mend deep ruts and put up clear roadside milestones."
                  },
                  {
                      "num": 15,
                      "tier": "Explain",
                      "q": "Why does the stone milestone in Source A have a stone basin and tap built into its base?",
                      "a": "So thirsty coach and cart horses could drink on long journeys",
                      "exp": "Roadside troughs refreshed working horses hauling wagons and mail coaches!"
                  },
                  {
                      "num": 16,
                      "tier": "Explain",
                      "q": "Which Act or rule in the 1700s made milestones a familiar sight every single mile along main British roads?",
                      "a": "Turnpike road laws requiring clear distance markers for travellers and mail coaches",
                      "exp": "Standard mileposts stopped coachmen getting lost and helped calculate fair postage and coach fares!"
                  }
              ]
          },
          {
              "number": 5,
              "title": "Enquiry 05: Names Carved in Stone — Local War Memorials and Commonwealth Records",
              "shortTitle": "Names Carved in Stone",
              "enquiryFocus": "How can War Memorials and Commonwealth records trace one local soldier’s story?",
              "questions": [
                  {
                      "num": 17,
                      "tier": "Recall",
                      "q": "Between which years was the First World War (\"The Great War\") fought?",
                      "a": "1914–1918",
                      "exp": "Most local War Memorials were first built right after the 1914–1918 First World War, with 1939–1945 panels added after WWII."
                  },
                  {
                      "num": 18,
                      "tier": "Detail",
                      "q": "Why did almost every British town, village, and parish build a local War Memorial in the 1920s?",
                      "a": "Because fallen service personnel were buried overseas near battlefields, so families needed a local place to remember",
                      "exp": "With overseas travel costly and graves far away, local memorials gave every community a focal point for grief and pride."
                  },
                  {
                      "num": 19,
                      "tier": "Explain",
                      "q": "What does the word \"Cenotaph\" (like the national memorial on Whitehall in London) literally mean in Greek?",
                      "a": "Empty tomb",
                      "exp": "A cenotaph honours people whose remains rest elsewhere."
                  },
                  {
                      "num": 20,
                      "tier": "Explain",
                      "q": "On Source A (the Henham church memorial), what does seeing two men named Camp, two named Bentley, and two named Hammond tell us?",
                      "a": "Several families in one small village lost two brothers or close relatives in the same war",
                      "exp": "Repeated surnames on village memorials vividly show how deeply wartime loss struck close-knit streets."
                  }
              ]
          },
          {
              "number": 6,
              "title": "Enquiry 06: Living Memory, Oral History and Saving Local Heritage",
              "shortTitle": "Living Memory, Oral History and Savi",
              "enquiryFocus": "How do oral history, Blue Plaques, and trails protect local heritage today?",
              "questions": [
                  {
                      "num": 21,
                      "tier": "Recall",
                      "q": "What do historians call recording older people’s spoken memories about past everyday life and local changes?",
                      "a": "Oral history",
                      "exp": "Oral history preserves spoken eyewitness memories, accents, and everyday experiences within living memory."
                  },
                  {
                      "num": 22,
                      "tier": "Detail",
                      "q": "Why is oral history especially important when investigating local street life in the 1950s, 1960s, and 1970s?",
                      "a": "Because personal UK Census sheets stay locked for 100 years, whereas older neighbours remember those decades firsthand!",
                      "exp": "Living witnesses bridge the 100-year Census gap with vivid personal memories!"
                  },
                  {
                      "num": 23,
                      "tier": "Explain",
                      "q": "When Happened on \"Decimal Day\" (15 February 1971) in shops across Britain?",
                      "a": "Britain switched from old pounds, shillings, and twelve-penny coins to decimal pounds of 100 new pence",
                      "exp": "Before 15 February 1971, twelve pennies made one shilling and twenty shillings made one pound (£sd)!"
                  },
                  {
                      "num": 24,
                      "tier": "Explain",
                      "q": "Which interview question will spark the richest oral history memory from an older local resident?",
                      "a": "\"What was Saturday shopping like on our High Street when you were ten?\" (open question)",
                      "exp": "Open-ended \"What was it like / Tell me about...\" questions invite detailed storytelling rather than one-word answers!"
                  }
              ]
          }
      ]
  },
  ks2_crime_and_punishment: {
      "unitTitle": "Crime & Punishment Through Time (AD 43 – Present)",
      "subtitle": "24-Question Master Retrieval Check & Self-Marking Key (Enquiries 01–06)",
      "enquiries": [
          {
              "number": 1,
              "title": "Enquiry 01: Roman Law, Twelve Tables and Bath Curse Tablets (AD 43–410)",
              "shortTitle": "Roman Law & Bath Curses",
              "enquiryFocus": "How did the Romans catch thieves and judge crimes in Britain without a police force?",
              "questions": [
                  { "num": 1, "tier": "Recall", "q": "What was Rome’s famous ancient code of written laws called?", "a": "The Twelve Tables", "exp": "After AD 43, Roman Britain used written court rules rooted in Rome’s ancient Twelve Tables." },
                  { "num": 2, "tier": "Detail", "q": "Who judged serious Roman court cases inside the town’s stone basilica hall?", "a": "A Roman magistrate", "exp": "Magistrates weighed witness statements and checked honest bronze market weights." },
                  { "num": 3, "tier": "Explain", "q": "How did Roman punishments differ between wealthy Roman citizens and enslaved people?", "a": "Citizens usually paid fines or faced exile; enslaved people faced whipping or mines", "exp": "Social rank decided how harshly Roman courts punished offenders." },
                  { "num": 4, "tier": "Explain", "q": "Why did robbed bathers at Aquae Sulis (Bath) drop scratched lead curse tablets into the spring?", "a": "With no police detectives, victims begged Sulis Minerva to punish unseen cloak thieves", "exp": "Archaeologists recovered over 130 folded Roman lead curse tablets from Bath’s spring!" }
              ]
          },
          {
              "number": 2,
              "title": "Enquiry 02: Anglo-Saxon Tithings, Wergild and Trial by Ordeal (AD 410–1066)",
              "shortTitle": "Saxon Wergild & Ordeals",
              "enquiryFocus": "Were Anglo-Saxon laws fair community rules or painful superstitions?",
              "questions": [
                  { "num": 5, "tier": "Recall", "q": "How many Anglo-Saxon neighbours aged twelve and over belonged to one village 'tithing'?", "a": "Ten neighbours", "exp": "If one tithing member broke the King’s Peace, the other nine had to bring him to court." },
                  { "num": 6, "tier": "Detail", "q": "What had to happen immediately when someone blew a horn and shouted the 'Hue and Cry'?", "a": "Every villager within earshot had to stop work and chase the suspect", "exp": "Ignoring the Hue and Cry brought a silver fine at the monthly Hundred Court." },
                  { "num": 7, "tier": "Explain", "q": "Why did Anglo-Saxon kings fix silver 'wergild' ('person-price') fines for injuries?", "a": "To pay peaceful compensation and stop violent family blood feuds", "exp": "King Alfred’s written law code priced every injury, though noble thanes ranked six times above ceorls." },
                  { "num": 8, "tier": "Explain", "q": "When did Anglo-Saxon Hundred Courts use church 'Trial by Ordeal' (hot iron or cold water)?", "a": "Only as a last resort when human witnesses could not agree on the truth", "exp": "Priests checked bandaged burns three days later trusting God to reveal innocence or guilt." }
              ]
          },
          {
              "number": 3,
              "title": "Enquiry 03: Norman Forest Laws, Sanctuary and Royal Courts (1066–1485)",
              "shortTitle": "Norman Laws & 1215 Juries",
              "enquiryFocus": "How did Norman kings and medieval royal judges change English justice after 1066?",
              "questions": [
                  { "num": 9, "tier": "Recall", "q": "Why did medieval villagers hate William the Conqueror’s new 'Forest Laws'?", "a": "They banned villagers from hunting wild deer or cutting wood under harsh penalties", "exp": "Turning peasant hunting into 'poaching' sparked sympathy for greenwood outlaws like Robin Hood." },
                  { "num": 10, "tier": "Detail", "q": "Which medieval king set up travelling judges and twelve-person juries under one 'Common Law'?", "a": "King Henry II", "exp": "From 1154, Henry II’s royal assize courts spread twelve-person trial juries across England." },
                  { "num": 11, "tier": "Explain", "q": "Which two landmark events in 1215 cemented fair twelve-person jury trials?", "a": "King John sealed Magna Carta AND Pope Innocent III banned Trial by Ordeal", "exp": "Magna Carta promised lawful trials while ending church ordeals made juries essential." },
                  { "num": 12, "tier": "Explain", "q": "What did striking Durham Cathedral’s bronze Sanctuary Knocker give a medieval fugitive?", "a": "37 to 40 days of safe Church shelter before choosing royal trial or exile abroad", "exp": "No royal sheriff could seize a fugitive inside cathedral sanctuary walls." }
              ]
          },
          {
              "number": 4,
              "title": "Enquiry 04: Tudor Vagrants, High Treason and Witchcraft Trials (1485–1700)",
              "shortTitle": "Vagrants, 1605 & Witches",
              "enquiryFocus": "Why did Tudor and Stuart rulers fear vagrants, plotters, and accused witches so fiercely?",
              "questions": [
                  { "num": 13, "tier": "Recall", "q": "How did Elizabeth I’s 1601 Poor Law treat sick locals differently from 'sturdy beggars'?", "a": "Sick locals received parish relief; 'sturdy beggars' were whipped or sent to workhouses", "exp": "Frightened towns with unpaid parish constables whipped jobless vagrants behind carts." },
                  { "num": 14, "tier": "Detail", "q": "What warning note helped guards catch Guy Fawkes beside 36 gunpowder barrels on 4–5 Nov 1605?", "a": "The anonymous Monteagle Letter", "exp": "Guards seized Fawkes holding his shuttered iron dark lantern beneath the House of Lords." },
                  { "num": 15, "tier": "Explain", "q": "Who exploited 1645–1647 Civil War fear in East Anglia as self-styled 'Witchfinder General'?", "a": "Matthew Hopkins", "exp": "Hopkins charged towns fees and used cruel sleep deprivation to extract confessions." },
                  { "num": 16, "tier": "Explain", "q": "Why did English witchcraft trials fade after 1660 and end officially in 1736?", "a": "Peace returned, the 1660 Royal Society spread science, and calm judges demanded real proof", "exp": "Scientific reasoning and strict courtroom evidence rules defeated witchcraft superstition." }
              ]
          },
          {
              "number": 5,
              "title": "Enquiry 05: Smugglers, Highwaymen and The Bloody Code (1700–1820)",
              "shortTitle": "Smugglers & Bloody Code",
              "enquiryFocus": "Why did Britain pass over 200 death-penalty laws—and why did juries stop using them?",
              "questions": [
                  { "num": 17, "tier": "Recall", "q": "Why did 18th-century coastal smugglers land tea, silk, and brandy at night?", "a": "To dodge heavy government import taxes (customs duties)", "exp": "Whole coastal villages bought cheap smuggled tea and treated smuggling as a 'social crime'." },
                  { "num": 18, "tier": "Detail", "q": "Which three practical changes ended pistol-armed stagecoach highwaymen by the early 1800s?", "a": "Paper banknotes, fast armed Royal Mail coaches, and mounted horse patrols", "exp": "Guarded coaches and traceable banknotes stopped highwaymen far better than gallows threats." },
                  { "num": 19, "tier": "Explain", "q": "Why did sympathetic twelve-person juries undermine the 220-crime 'Bloody Code'?", "a": "Jurors refused to hang petty thieves for stealing five shillings, undervaluing goods instead", "exp": "Ordinary jurors felt hanging teenagers for tiny shop thefts was cruelly unfair." },
                  { "num": 20, "tier": "Explain", "q": "How did Australian transportation (1787–1868) and Elizabeth Fry at Newgate reshape punishment?", "a": "Over 160,000 convicts were shipped to Australia while Fry proved schooling reformed prisoners", "exp": "Elizabeth Fry’s 1817 Newgate school and sewing rooms inspired Peel’s 1823 Gaols Act." }
              ]
          },
          {
              "number": 6,
              "title": "Enquiry 06: Peel’s 1829 Bobbies, Victorian Prisons and Forensics (1829–Present)",
              "shortTitle": "1829 Bobbies & 1984 DNA",
              "enquiryFocus": "How have uniformed police, prison reform, and forensic science transformed justice since 1829?",
              "questions": [
                  { "num": 21, "tier": "Recall", "q": "Who founded London’s unarmed blue-coated Metropolitan Police ('Bobbies') in 1829?", "a": "Home Secretary Sir Robert Peel", "exp": "Dressed in navy coats with wooden truncheons, Bobbies prevented crime by public consent." },
                  { "num": 22, "tier": "Detail", "q": "What strict regime opened at Pentonville Prison in 1842, and when did Britain end murder hangings?", "a": "The silent Separate System (with treadwheels); murder executions ended in 1965", "exp": "Modern justice replaced treadwheels and hanging with rehabilitation and community payback." },
                  { "num": 23, "tier": "Explain", "q": "What new forensic identification bureau opened at London’s Scotland Yard in 1901?", "a": "The Fingerprint Bureau", "exp": "Matching unique fingertip loops, arches, and whorls gave courts physical crime-scene proof." },
                  { "num": 24, "tier": "Explain", "q": "How did Sir Alec Jeffreys’s 1984 Leicester discovery of DNA profiling transform justice?", "a": "It matches microscopic genetic traces to catch guilty offenders AND clear innocent suspects", "exp": "In its very first murder inquiry, DNA freed an innocent teenager before catching the culprit!" }
              ]
          }
      ]
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
            <i class="fa-solid fa-clipboard-check"></i> <span>${isKs2 ? 'KS2 Check My Answers • Quiz & Workbook Key' : 'Digital Department Marking Bank & Model Explanations'}</span>
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
                        <i class="fa-solid fa-eye"></i> ${isKs2 ? 'Tap to Check Your Answer' : 'Click to Reveal Model Answer & Historical Explanation'}
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
          <i class="fa-solid fa-stairs" style="color: #1e3a8a;"></i> ${isKs2 ? 'Young Historian Self-Check Steps (Key Stage 2)' : 'KS3 Level Assessment Pathways'}
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

