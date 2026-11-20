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
        title: "Enquiry 04: Vera's Journey & The Kindertransport (1938–1939)",
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
            ${isKs2 ? 'Check all 44 retrieval questions across Enquiries 01–11 (4-Page Quiz Pack & Pupil Workbook pp. 25–26) with verified answers and clear explanations.' : 'Self-check your printed booklet homework questions with verified model answers and causal explanations.'}
          </p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${
            isKs2
              ? `
          <a href="/units/ks2_ww2/textbook.html" target="_blank" class="btn" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.88rem; padding: 8px 14px; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
            <i class="fa-solid fa-book-open" style="color: #38bdf8;"></i> <span>16-Page Textbook</span>
          </a>
          <a href="/units/ks2_ww2/quiz_pack.html" target="_blank" class="btn" style="background: rgba(255,255,255,0.12); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.88rem; padding: 8px 14px; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
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

