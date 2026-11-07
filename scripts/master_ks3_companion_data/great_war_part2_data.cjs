/**
 * scripts/master_ks3_companion_data/great_war_part2_data.cjs
 *
 * Universal Key Stage 3 Master Knowledge Retrieval Companion Data
 * Unit: The Course of the Great War (1914–1918) • Year 9 History
 * Format: 8-Page Saddle-Stitch A5 Publication (6 Questions per Enquiry, 30 Total)
 */

module.exports = {
  unitId: 'great_war_part2',
  pdfFileName: 'The_Course_of_the_Great_War_Master_Retrieval_and_Literary_Companion.pdf',
  pdfAlias: 'great_war_part2_retrieval_and_literary_companion.pdf',
  title: 'The Course of the Great War (1914–1918)',
  subtitle: 'Literary Reading Extracts, Historical Enquiry & Spaced Retrieval Homework Companion',
  yearGroup: 'Key Stage 3 • Year 9 History',
  heroImage: 'public/images/menin_road_nash_opt.jpg',
  heroAlt: 'The Menin Road (1919) by Paul Nash',
  heroCaption: 'The Menin Road (1919) by Paul Nash • Imperial War Museums (ART 2242). Commissioned by the British War Memorials Committee, this iconic modernist masterpiece captures the apocalyptic devastation of the Ypres Salient, echoing the wartime memoirs of Siegfried Sassoon and Ernst Jünger.',
  qrUrl: 'https://the-history-revision-hub.netlify.app/?view=interactive&unit=great_war_part2',
  glossaryConcepts: [
    { term: 'Attrition', def: 'A military strategy of wearing down the enemy to the point of physical collapse through continuous losses of personnel and material (e.g. Verdun, The Somme).' },
    { term: 'Total War', def: 'A war that involves the complete mobilization of entire populations, industrial economies, and resources, erasing boundaries between soldiers and civilians.' },
    { term: 'Conscription', def: 'Compulsory enlistment of civilians into the armed forces, introduced in Britain by the Military Service Acts in 1916 after voluntary recruitment dwindled.' },
    { term: 'Armistice', def: 'An agreement made by opposing sides in a war to stop fighting for a certain time; the ceasefire signed in Compiègne on 11 November 1918 ended hostilities.' },
  ],
  enquiries: [
    {
      number: 1,
      lessonTitle: '1. 1914 & The Rush to the Colours',
      shortTitle: '1914 & Colours',
      enquiryFocus: 'Why were young British men so desperate to volunteer for the slaughter of 1914?',
      focus: "Lord Kitchener's recruitment call, Pals Battalions, patriotic propaganda, 'Over by Christmas' myth & 1914 BEF",
      termVault: ['Lord Kitchener', 'Pals Battalions', 'White Feather', 'Propaganda', 'Over by Christmas', 'BEF (120,000)'],
      reading: {
        bookTitle: "Memoirs of an Infantry Officer",
        author: "Siegfried Sassoon",
        authorRole: "Captain, Royal Welch Fusiliers & War Poet (MC)",
        genreBadge: "Frontline War Memoir (1914)",
        coverImage: "public/images/siegfried_sassoon.jpg",
        coverCaption: "Captain Siegfried Sassoon CBE MC, Royal Welch Fusiliers. Decorated frontline officer and war poet.",
        authorContext: "Siegfried Sassoon was an English poet and officer in the Royal Welch Fusiliers awarded the Military Cross for bravery. In his celebrated wartime memoirs, he records the naive, sporting enthusiasm with which young British men volunteered in August 1914 and the sudden, chilling encounter with the realities of the casualty lists.",
        extractText: `I was sitting in the pavilion at the village cricket ground on an idyllic August afternoon when the extraordinary news arrived... To me, as an irresponsible young gentleman with nothing better to do than hunt foxes and score occasional runs, the sudden prospect of European war seemed like a grand adventure, a chivalric crusade that had arrived just in time to rescue our generation from the dull routine of modern peacetime.

Everyone around me was swept along by the same strange fever. In the market towns and city recruiting stations, young clerks, schoolboys, shop assistants, and farm labourers queued for hours in the stifling August heat. Brass bands marched through the high streets playing patriotic anthems, church bells rang, and proud mothers pinned ribbons to their sons' lapels. We were assured by politicians and newspapers that the conflict would be settled within six months, that the Kaiser would be humbled, and that we should all return home before Christmas crowned with laurels of victory.

...It was only later, when the transport trains rolled into midnight stations and the first battalion casualty lists appeared in the Times, that the terrible silence descended. The names of boys I had played cricket against at school and shared benches with at university were printed row upon row in tiny black letters, grouped under the brutal heading: "Killed in Action." The heroic romance had vanished in an instant; the chivalric tournament was an illusion. We were not entering an adventure—we were being fed into an unrelenting industrial factory of death.`,
        vocabVault: [
          { term: 'Chivalry', def: 'The medieval knightly code of honour, bravery, and self-sacrifice.' },
          { term: 'Laurels', def: 'A traditional Roman symbol of military victory and triumphant return.' },
          { term: 'Battalion', def: 'A military unit of roughly 1,000 frontline soldiers.' }
        ],
        oralDiscussionPrompt: "Think: What metaphor does Sassoon use at the end to describe what the war truly became? Contrast Sassoon's initial excitement at the cricket ground with his horror upon reading the casualty lists.",
        readingQrUrl: "https://the-history-revision-hub.netlify.app/?view=reading&unit=great_war_part2&lesson=1"
      },
      questions: [
        {
          num: 1,
          tier: 1,
          q: 'Who appeared on famous recruitment posters pointing his finger with the slogan "Your Country Needs You"?',
          starter: 'This meant that...',
          a: 'Lord Horatio Kitchener (Secretary of State for War)',
          exp: 'Kitchener predicted a long, grueling war requiring an army of millions, launching mass recruitment campaigns.',
        },
        {
          num: 2,
          tier: 1,
          q: 'What was the nickname given to battalions of friends, workmates, and neighbours who enlisted together in 1914?',
          starter: 'Known as...',
          a: 'Pals Battalions',
          exp: 'Units like the Accrington Pals and Grimsby Chums allowed men from the same town or factory to serve side-by-side.',
        },
        {
          num: 3,
          tier: 2,
          q: 'Why did hundreds of thousands of young British men rush to enlist in August and September 1914?',
          starter: 'Because...',
          a: 'A wave of patriotic enthusiasm, peer pressure, and the popular belief the war would be over by Christmas',
          exp: 'Young men viewed enlistment as an exciting adventure, an escape from mundane factory work, and a moral duty.',
        },
        {
          num: 4,
          tier: 2,
          q: 'What symbol of cowardice was publicly handed to young men in civilian clothes on British streets?',
          starter: 'Known as...',
          a: 'A white feather',
          exp: 'The White Feather movement used public humiliation to shame men who had not enlisted into joining the army.',
        },
        {
          num: 5,
          tier: 3,
          q: 'Why did the concept of "Pals Battalions" ultimately prove to be a catastrophic social tragedy?',
          starter: 'Because...',
          a: 'Catastrophic casualties at the Somme wiped out an entire generation from specific towns on a single day',
          exp: 'When battalions were shattered on 1 July 1916, single communities lost hundreds of young men simultaneously, devastating northern towns.',
        },
        {
          num: 6,
          tier: 3,
          q: 'How did the transition from a small professional army to a mass citizen army transform British society?',
          starter: 'As a result...',
          a: 'It made the war an inescapable national trauma touching every household and community across Britain',
          exp: 'The scale of bereavement transformed political expectations, sparking demands for universal voting rights and social welfare reform.',
        },
      ],
    },
    {
      number: 2,
      lessonTitle: '2. Trench Warfare & The Haig Controversy (1915–1916)',
      shortTitle: 'Trenches & Haig',
      enquiryFocus: 'Did British generals make the horror of trench warfare worse, or was Haig trapped in an industrial learning curve?',
      focus: "Trench system stalemate, artillery bombardments, Sir Douglas Haig, 1916 Battle of the Somme & combined arms",
      termVault: ['No Man’s Land', 'Trench Foot', 'Heavy Artillery', 'Sir Douglas Haig', 'The Somme (1916)', 'Combined Arms'],
      reading: {
        bookTitle: "Storm of Steel",
        author: "Ernst Jünger",
        authorRole: "Frontline Officer, German 73rd Hanoverian Regiment (Pour le Mérite)",
        genreBadge: "Eyewitness Combat Memoir (1915–1916)",
        coverImage: "public/images/gw_flooded_trench.jpg",
        coverCaption: "Soldiers standing in waterlogged mud in a frontline trench on the Western Front • Imperial War Museums (IWM Q 51551).",
        authorContext: "Ernst Jünger was a German frontline officer wounded fourteen times who fought continuously on the Western Front from 1914 to 1918. His 1920 memoir Storm of Steel (In Stahlgewittern) provides an astonishing, unromanticized German eyewitness account of technological industrial bombardment in the trenches.",
        extractText: `The earth shook, the sky was a raging cauldron of black smoke and blinding fire, and the deafening roar of the heavy artillery stunned our senses until conscious thought itself became impossible. We huddled packed together in deep subterranean dugouts carved thirty feet into the damp chalk, listening with racing hearts to the relentless pounding of the high-explosive shells detonating overhead. Every direct hit sent shockwaves rippling through the rock, extinguishing our candles and showering our steel helmets in suffocating chalk dust.

When the bombardment finally lifted, we scrambled up the shattered steps into the daylight. The trench was no longer a trench; it had been violently obliterated into a chaotic lunar wilderness of craters filled with foul stagnant water, tangled coils of severed barbed wire, and unburied corpses. Machine guns from the opposing ridges swept the ruined parapet with rapid metallic chatter, spraying deadly streams of lead that cut down any soldier who dared raise his head even an inch above the rim.

...In this monstrous landscape of pulverized chalk and iron, individual human courage counted for almost nothing against the mechanical supremacy of modern industrial war. The machine gunner did not need personal bravery or martial skill; he merely depressed the cold firing button to mow down an entire advancing company in minutes. It was no longer a contest of man against man, but the brutal annihilation of fragile human flesh by unfeeling machinery.`,
        vocabVault: [
          { term: 'Artillery', def: 'Large-calibre heavy guns capable of firing explosive shells over long distances.' },
          { term: 'Traverse', def: 'A bank of earth or sandbags built across a trench to contain blast shockwaves.' },
          { term: 'Attrition', def: 'Wearing down enemy strength and manpower through continuous losses.' }
        ],
        oralDiscussionPrompt: "Think: Why does Jünger conclude that individual human courage counted for almost nothing in the trenches? Discuss whether British or German soldiers faced identical horrors in No Man's Land.",
        readingQrUrl: "https://the-history-revision-hub.netlify.app/?view=reading&unit=great_war_part2&lesson=2"
      },
      questions: [
        {
          num: 7,
          tier: 1,
          q: 'Which weapon was responsible for approximately 60% of all combat casualties on the Western Front?',
          starter: 'This was because...',
          a: 'Heavy Artillery (high-explosive shells and shrapnel)',
          exp: 'Relentless artillery barrages pulverized trenches, caused catastrophic physical trauma, and induced severe shell shock.',
        },
        {
          num: 8,
          tier: 1,
          q: 'What painful medical condition was caused by soldiers standing in cold, waterlogged mud for days?',
          starter: 'Known as...',
          a: 'Trench Foot',
          exp: 'Prolonged exposure to damp mud caused fungal infection, numbness, and gangrene, often requiring amputation.',
        },
        {
          num: 9,
          tier: 2,
          q: 'Why were frontline trenches constructed in a zig-zag or traverse pattern rather than straight lines?',
          starter: 'To prevent...',
          a: 'Enemy machine-gunners from firing along the whole trench and to contain artillery blast shockwaves',
          exp: 'The angular layout prevented enfilade fire and ensured that an artillery shell detonating in a trench contained its blast to a single bay.',
        },
        {
          num: 10,
          tier: 2,
          q: 'Why did the week-long British artillery bombardment fail to destroy German defenses before the Somme in 1916?',
          starter: 'Because...',
          a: 'A third of the shells were duds and deep German concrete bunkers protected troops underground',
          exp: 'When the bombardment lifted, German machine-gunners emerged from deep dugouts to mow down British infantry crossing No Man’s Land.',
        },
        {
          num: 11,
          tier: 3,
          q: 'Why is Field Marshal Sir Douglas Haig remembered both as the "Butcher of the Somme" and the architect of victory?',
          starter: 'Because...',
          a: 'Critics condemn his costly attrition tactics, while defenders argue he adapted modern technology to win in 1918',
          exp: 'Haig presided over 57,000 casualties on 1 July 1916, but later mastered combined-arms warfare in the decisive 1918 Hundred Days Offensive.',
        },
        {
          num: 12,
          tier: 3,
          q: 'How did the development of tanks and creeping barrages eventually break the trench deadlock in 1918?',
          starter: 'Consequently...',
          a: 'Combined-arms coordination crushed barbed wire and suppressed machine guns, restoring mobility',
          exp: 'Allied coordination of artillery, tanks, infantry, and aircraft replaced suicidal frontal charges with rapid mobile breakthroughs.',
        },
      ],
    },
    {
      number: 3,
      lessonTitle: '3. Global Empire & The Forgotten Fronts (1914–1918)',
      shortTitle: 'Global Empire Fronts',
      enquiryFocus: 'Why were over four million colonial and dominion troops erased from popular memory?',
      focus: "1.3 million Indian Army troops, 1915 Gallipoli landings (ANZAC), British West Indies Regiment & global supply lines",
      termVault: ['Indian Army (1.3M)', 'ANZAC', 'Gallipoli (1915)', 'British West Indies Regt', 'Labour Corps', 'East Africa Campaign'],
      reading: {
        bookTitle: "Indian Voices of the Great War: Soldiers' Letters",
        author: "David Omissi (ed.) & Sepoys of the Indian Army",
        authorRole: "Frontline Sepoys & Sowars, Indian Expeditionary Force",
        genreBadge: "Frontline Soldiers' Letters (1914–1918)",
        coverImage: "public/images/gw_indian_army.jpg",
        coverCaption: "Sikh machine gunners and Indian Army troops on the Western Front, 1915.",
        authorContext: "Over 1.3 million Indian soldiers and personnel served in the British Indian Army across Europe, the Middle East, and Africa. Their letters home, censored by British military authorities, reveal the shock of industrial warfare in the freezing mud of Flanders and their pride in defending their regiment's honour.",
        extractText: `The fighting in this foreign land is beyond human description. Do not think, my brothers, that this war is like any conflict we have heard of in old times or read of in ancient poems. It is not war; it is a mechanical monster that eats living men. The cannon fire never ceases for a single hour, day or night. Shrapnel bursts overhead like thunder, raining jagged iron from the sky, while machine-gun bullets hiss past our ears like venomous serpents.

We are stationed in frontline trenches where freezing mud reaches our waists, and the bitter European winter cuts through our woollen coats like sharpened knives. Many of our fellow sepoys have fallen sick with pneumonia and the agony of frostbite, their feet swollen and blackened by the damp. We were brought across the black water from the warm sun of Hindustan into this frozen slaughterhouse. Yet despite the cold and the terror, our regiments stand firm like iron walls, determined to preserve the honour and izzat of our ancestors, refusing to yield a single foot of ground to the enemy.

...Write to our village and tell my dear mother not to grieve if I do not return to her embrace. A warrior who dies fighting bravely on the battlefield achieves everlasting honour in both worlds. But I implore you, tell my younger brothers to remain behind in the village to plow the fields and tend the cattle; one son sacrificed to this terrible European fire is more than enough for our household.`,
        vocabVault: [
          { term: 'Sepoy', def: 'An Indian frontline soldier serving in the British Indian Army.' },
          { term: 'Shrapnel', def: 'Small metal balls packed in artillery shells, sprayed upon detonation.' },
          { term: 'Frostbite', def: 'Tissue injury caused by extreme exposure to damp cold conditions.' }
        ],
        oralDiscussionPrompt: "Think: What does the Indian soldier mean when he calls the war 'a monster that eats men'? Discuss why colonial soldiers fought with such dedication thousands of miles from home.",
        readingQrUrl: "https://the-history-revision-hub.netlify.app/?view=reading&unit=great_war_part2&lesson=3"
      },
      questions: [
        {
          num: 13,
          tier: 1,
          q: 'Approximately how many Indian soldiers and labourers served the British Empire during the Great War?',
          starter: 'This meant that...',
          a: 'Over 1.3 million Indian soldiers and personnel',
          exp: 'Indian regiments fought in the freezing mud of Ypres, in Mesopotamia (Iraq), and across the deserts of Palestine.',
        },
        {
          num: 14,
          tier: 1,
          q: 'What acronym was given to the Australian and New Zealand Army Corps who landed at Gallipoli in 1915?',
          starter: 'Known as...',
          a: 'The ANZACs',
          exp: 'The catastrophic Gallipoli campaign against the Ottoman Empire became a defining foundation of Australian and New Zealand national identity.',
        },
        {
          num: 15,
          tier: 2,
          q: 'What strategic objective did Winston Churchill hope to achieve by attacking the Ottoman Empire at Gallipoli in 1915?',
          starter: 'To...',
          a: 'Knock the Ottoman Empire out of the war and open a Black Sea supply route to Russia',
          exp: 'Churchill sought an indirect maritime route to relieve pressure on the Western Front, but Ottoman forces pinned the Allies to the beaches.',
        },
        {
          num: 16,
          tier: 2,
          q: 'Why were soldiers of the British West Indies Regiment often denied front-line combat roles?',
          starter: 'Because...',
          a: 'Racial prejudice from British authorities restricted Black colonial troops to heavy labouring and ammunition loading',
          exp: 'Despite volunteering eagerly, colonial authorities feared training Black soldiers in combat arms would threaten postwar imperial rule.',
        },
        {
          num: 17,
          tier: 3,
          q: 'Why was the global contribution of colonial and African troops largely erased from popular British memory after 1918?',
          starter: 'Because...',
          a: 'Postwar imperial propaganda centered national remembrance exclusively on white European soldiers on the Western Front',
          exp: 'War memorials and histories celebrated British sacrifices in Flanders, sidelining the hundreds of thousands of African, Indian, and Caribbean troops.',
        },
        {
          num: 18,
          tier: 3,
          q: 'How did participation in the Great War accelerate demands for national independence across the British Empire?',
          starter: 'As a result...',
          a: 'Colonial troops who fought for "freedom in Europe" returned home demanding equal political self-determination',
          exp: 'Sacrifices made by Indian and African soldiers undermined European claims of racial superiority and catalyzed early anti-colonial movements.',
        },
      ],
    },
    {
      number: 4,
      lessonTitle: '4. The Home Front & Women’s Total War (1914–1918)',
      shortTitle: 'Home Front & Women',
      enquiryFocus: 'How far did the First World War transform the British state and daily life on the Home Front?',
      focus: "1914 Defence of the Realm Act (DORA), Munitionettes ('Canary Girls'), food queues, 1916 conscription & 1918 vote",
      termVault: ['DORA (1914)', 'Munitionettes', 'Canary Girls', 'Rationing (1918)', 'Conscription (1916)', '1918 Representation Act'],
      reading: {
        bookTitle: "Testament of Youth",
        author: "Vera Brittain",
        authorRole: "Voluntary Aid Detachment (VAD) Nurse & Author",
        genreBadge: "Wartime Autobiography & Nurse Memoir (1915–1918)",
        coverImage: "public/images/vera_brittain.jpg",
        coverCaption: "Vera Brittain in her Voluntary Aid Detachment (VAD) uniform, 1915.",
        authorContext: "Vera Brittain postponed her Oxford studies to volunteer as a VAD nurse, treating wounded British and German soldiers in London, Malta, and France. Having lost her fiancé, brother, and closest friends, her 1933 autobiography became the defining voice of the 'Lost Generation' of women.",
        extractText: `The midnight hospital trains arrived in continuous succession, unloading hundreds of shattered, broken young men fresh from the slaughter of the Somme. Their khaki uniforms were caked in hardened trench clay, their eyes hollow with the haunting, unseeing stare of severe shell shock. Many lay motionless on stretchers along the cold corridors, unable to speak, their youth extinguished in a matter of hours by weapons their Victorian fathers could never have imagined.

In the surgical wards, we dressed wounds that made the heart turn cold—gangrenous limbs smelling of decay, agonizing chlorine gas burns that had stripped the delicate lining from human lungs, and faces torn away by jagged shards of flying shrapnel. We worked eighteen hours without respite, our aprons soaked with iodine and blood, our hands raw from carbolic acid, holding the trembling hands of dying eighteen-year-old boys who in their delirium mistook us for their mothers or sisters waiting at home.

...Meanwhile, across Britain, women were stepping forward to sustain the entire nation. We were driving omnibuses through darkened city streets, tilling the heavy soil in the Women's Land Army, and handling toxic cordite powder in explosive munitions factories. In the shell-filling plants, women's skin and hair turned bright yellow from toxic chemical exposure, earning them the nickname "Canary Girls." We proved beyond all doubt that women could carry the weight of an industrial empire in crisis. Yet as the casualty telegrams mounted daily, we realized with mounting grief that our reward would be mourning an entire generation of men who would never return to build a peacetime world.`,
        vocabVault: [
          { term: 'VAD', def: 'Voluntary Aid Detachment: civilian volunteers providing nursing and medical care.' },
          { term: 'Shell Shock', def: 'Severe psychological trauma induced by prolonged artillery bombardment.' },
          { term: 'Canary Girls', def: 'Female munitions workers whose skin was stained yellow by toxic TNT chemicals.' }
        ],
        oralDiscussionPrompt: "Think: How did women's wartime experiences challenge Victorian stereotypes about women being frail? Discuss whether the 1918 vote for women over 30 was a fair reward for women's wartime sacrifices.",
        readingQrUrl: "https://the-history-revision-hub.netlify.app/?view=reading&unit=great_war_part2&lesson=4"
      },
      questions: [
        {
          num: 19,
          tier: 1,
          q: 'What landmark law passed in August 1914 gave the British government sweeping emergency powers over daily life?',
          starter: 'This meant that...',
          a: 'DORA (Defence of the Realm Act)',
          exp: 'DORA permitted the government to censor newspapers, take over factories, nationalize railways, and dilute beer.',
        },
        {
          num: 20,
          tier: 1,
          q: 'What nickname was given to female munitions workers whose skin turned yellow from handling toxic TNT chemicals?',
          starter: 'Known as...',
          a: '"Canary Girls"',
          exp: 'Toxic exposure to sulphuric acid and TNT stained skin yellow, damaged lungs, and caused early miscarriages in munitions plants.',
        },
        {
          num: 21,
          tier: 2,
          q: 'Why was compulsory conscription introduced for unmarried British men aged 18 to 41 in January 1916?',
          starter: 'Because...',
          a: 'Voluntary enlistment collapsed while devastating casualties on the Western Front created an acute manpower shortage',
          exp: 'The bloody slaughter at Neuve Chapelle and Loos exhausted the volunteer army, forcing Prime Minister Asquith to pass the Military Service Act.',
        },
        {
          num: 22,
          tier: 2,
          q: 'Why did the British government introduce compulsory food rationing for sugar, butter, and meat in early 1918?',
          starter: 'Because...',
          a: 'German Unrestricted Submarine Warfare sank merchant ships, causing severe civilian food shortages and panic buying',
          exp: 'U-boats sank hundreds of cargo vessels in the Atlantic, threatening Britain with starvation until rationing ensured equitable food sharing.',
        },
        {
          num: 23,
          tier: 3,
          q: 'How did women’s wartime work permanently shatter traditional Victorian gender stereotypes?',
          starter: 'By proving that...',
          a: 'Women could capably perform heavy industrial labor, operate machinery, and sustain the war economy',
          exp: 'Nearly a million women worked in munitions, transport, and agriculture, disproving Victorian arguments that women were physically and mentally frail.',
        },
        {
          num: 24,
          tier: 3,
          q: 'To what extent did women’s war work directly lead to women gaining the parliamentary vote in 1918?',
          starter: 'Consequently...',
          a: 'It created an undeniable moral debt, though the 1918 Act granted votes only to women over 30 with property',
          exp: 'Politicians could not deny the vote to women who saved the nation, but established older age thresholds to avoid a female voting majority.',
        },
      ],
    },
    {
      number: 5,
      lessonTitle: '5. The Treaty of Versailles & The Flawed Peace (1918–1919)',
      shortTitle: 'Versailles & Flawed Peace',
      enquiryFocus: 'Did the Treaty of Versailles solve the problems of 1914, or create the nightmares of 1939?',
      focus: 'Armistice of 11 November 1918, Paris Peace Conference, Big Three motives, Article 231 War Guilt, reparations & Diktat debate',
      termVault: ['Article 231 (War Guilt)', '£6.6 Billion Reparations', 'Big Three', 'Diktat', 'Rhineland Demilitarisation', 'Keynes & Carthaginian Peace'],
      reading: {
        bookTitle: "The Economic Consequences of the Peace",
        author: "John Maynard Keynes",
        authorRole: "British Treasury Delegate to the 1919 Paris Peace Conference",
        genreBadge: "Political & Economic Eyewitness Analysis (1919)",
        coverImage: "public/images/gw_big_three_versailles.jpg",
        coverCaption: "The Council of Four at Versailles, May 1919: David Lloyd George, Vittorio Orlando, Georges Clemenceau, and Woodrow Wilson.",
        authorContext: "John Maynard Keynes was a brilliant British Treasury economist who attended the 1919 Paris Peace Conference. Disgusted by the vindictive terms imposed on Germany, he resigned in protest and published this book warning that crushing the German economy would lead to economic catastrophe and future war.",
        extractText: `The Council of Four assembled in the glittering Hall of Mirrors at Versailles, surrounded by gold and glass, but they were blind to the economic realities of the desperate continent they presumed to govern. Georges Clemenceau sat with his gloved hands folded across his chest, burning with an unrelenting desire to crush Germany permanently so that France might never again be invaded. Lloyd George pursued the fleeting demands of British electoral politics, promising angry voters that he would "squeeze the German lemon until the pips squeak." And President Woodrow Wilson, armed with noble principles of self-determination, proved tragically incapable of mastering the practical European negotiations.

Together, they drafted an ultimatum that treated Germany as a moral outlaw, compelling her delegates to sign Article 231—the War Guilt clause—under the imminent threat of renewed Allied invasion and starvation naval blockade. They demanded astronomical reparations running into billions of pounds, stripped the defeated nation of her merchant fleet, coalfields, and iron ore, yet demanded that she somehow generate vast surpluses of gold to pay her victors.

...I believe that the campaign for securing out of Germany the general costs of the war was one of the most serious acts of political unwisdom for which European statesmen have ever been responsible. If we aim deliberately at the impoverishment of Central Europe, vengeance, I dare predict, will not limp. By reducing seventy million people to perpetual poverty and humiliation, we are sowing dragon's teeth across the soil of Europe. Nothing can then delay that final civil war between the despairing forces of Reaction and Revolution, before which the horrors of the late German war will pale into insignificance.`,
        vocabVault: [
          { term: 'Council of Four', def: 'The Allied leaders of Britain, France, the USA, and Italy at Versailles.' },
          { term: 'Article 231', def: 'The War Guilt clause forcing Germany to accept sole moral blame for the war.' },
          { term: 'Reparations', def: 'Compulsory financial payments demanded from Germany to cover Allied damages.' }
        ],
        oralDiscussionPrompt: "Think: What dark prophecy does Keynes make in his final sentence? Discuss whether the Treaty of Versailles was too harsh, or if the Allies failed because they refused to enforce it later.",
        readingQrUrl: "https://the-history-revision-hub.netlify.app/?view=reading&unit=great_war_part2&lesson=5"
      },
      questions: [
        {
          num: 25,
          tier: 1,
          q: 'In what famous hall was the Treaty of Versailles signed on 28 June 1919, exactly five years after the assassination at Sarajevo?',
          starter: 'Signed in...',
          a: 'The Hall of Mirrors in the Palace of Versailles',
          exp: 'The French deliberately chose the Hall of Mirrors where the German Empire had been proclaimed in 1871 after France’s defeat in the Franco-Prussian War.',
        },
        {
          num: 26,
          tier: 1,
          q: 'What controversial clause in the Treaty of Versailles (Article 231) forced Germany to accept sole moral blame for causing the war?',
          starter: 'Known as...',
          a: 'The "War Guilt" Clause (Article 231)',
          exp: 'Article 231 provided the legal justification for the Allies to demand massive financial reparations to compensate for civilian damages.',
        },
        {
          num: 27,
          tier: 2,
          q: 'What staggering sum of financial reparations did the Inter-Allied Reparations Commission set for Germany to pay in 1921?',
          starter: 'Set at...',
          a: '£6.6 billion (132 billion gold marks)',
          exp: 'British economist John Maynard Keynes resigned from the peace delegation in protest, warning this unpayable sum would ruin the European economy.',
        },
        {
          num: 28,
          tier: 2,
          q: 'Why did German politicians and the public universally denounce the Treaty of Versailles as an unfair "Diktat"?',
          starter: 'Because...',
          a: 'Germany was entirely excluded from negotiations and forced to sign under threat of an immediate Allied military invasion',
          exp: 'The German delegation was presented with a completed draft and given just three weeks to submit written objections before being ordered to sign.',
        },
        {
          num: 29,
          tier: 3,
          q: 'How did the military restrictions of Versailles aim to prevent Germany from ever launching an offensive war again?',
          starter: 'By restricting...',
          a: 'The army was capped at 100,000 volunteers, conscription was banned, tanks and warplanes were prohibited, and the Rhineland was demilitarised',
          exp: 'These terms reduced Germany’s military to a domestic border security force, though right-wing nationalists deeply resented the disarmament.',
        },
        {
          num: 30,
          tier: 3,
          q: 'Why did British political cartoonist Will Dyson portray a weeping toddler labeled "1940 Class" outside the Versailles peace conference?',
          starter: 'Because...',
          a: 'He prophetically warned that the punitive terms would breed resentment, leading children born in 1919 to fight another world war by 1940',
          exp: 'Dyson’s cartoon, "Peace and Future Cannon Fodder", showed Georges Clemenceau saying "Curious! I seem to hear a child weeping!", predicting World War II.',
        },
      ],
    },
  ],
};
