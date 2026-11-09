const fs = require('fs');

const lessonsData = [
  // Lesson 1: 1914 & The Rush to the Colours
  [
    // B1: ["Small Regular Army", "No Conscription", "Kitchener’s Dire Call"]
    '<p class="prose-p"><span class="para-ref">[1.1]</span> In August 1914, Great Britain entered the European war with no conscription laws and only a small regular army of 120,000 professional soldiers. Unlike continental empires that mobilised millions of conscripts, Britain relied on naval supremacy, leaving its land forces severely outnumbered.</p><p class="prose-p">Newly appointed War Secretary Lord Kitchener realised this struggle would devour millions of men over several years. Kitchener’s dire call for 500,000 volunteers shattered comforting illusions that the war would end quickly, urging patriotic citizens to enlist immediately.</p>',

    // B2: ["1839 Treaty of London", "German Atrocities", "Crusade for Law"]
    '<p class="prose-p"><span class="para-ref">[1.2]</span> On 4 August 1914, Britain declared war after imperial Germany invaded neutral Belgium, violating the historic 1839 Treaty of London. When German diplomats dismissed the international agreement as a worthless scrap of paper, Britain stepped forward to defend international law.</p><p class="prose-p">Reports of brutal German atrocities against Belgian civilians, including the burning of Louvain library, ignited public outrage across British communities. Enlistment surged as newspapers framed the conflict as a righteous crusade for law, convincing young men to defend small nations against autocratic aggression.</p>',

    // B3: ["Pals Battalions Formed", "Pompey Pals (14th/15th Hants)", "Fight Alongside Mates"]
    '<p class="prose-p"><span class="para-ref">[1.3]</span> To organise the flood of willing recruits, the War Office encouraged local communities to serve together. Pals Battalions formed across industrial cities, allowing friends, neighbours, and work colleagues who enlisted side by side to train and fight alongside mates in identical frontline units.</p><p class="prose-p">On the south coast, dockers, clerks, and sportsmen proudly established the Pompey Pals (14th/15th Hants) battalions. While municipal comradeship boosted unit morale, it carried devastating risks: a single day’s heavy fighting could wipe out an entire community’s young generation.</p>',

    // B4: ["Regular Pay & Food", "Escape Factory Drudgery", "Over by Christmas"]
    '<p class="prose-p"><span class="para-ref">[1.4]</span> Beyond patriotic fervour, enlistment provided an immediate escape from harsh Edwardian economic hardship. Many working-class labourers suffered low wages, damp tenement housing, and exhausting factory shifts, making military life appear genuinely attractive.</p><p class="prose-p">Taking the King’s shilling offered guaranteed regular pay & food, warm woolen uniforms, and sturdy boots that impoverished families struggled to afford. Naive beliefs that the overseas adventure would be over by Christmas encouraged thousands to escape factory drudgery before the fighting ended.</p>',

    // B5: ["Kitchener Finger Poster", "White Feather Movement", "Unbearable Social Shame"]
    '<p class="prose-p"><span class="para-ref">[1.5]</span> Relentless social pressure compelled eligible men into recruitment offices. Iconic advertising like the famous Kitchener finger poster pointed directly at passers-by, sternly demanding that every young citizen fulfil his patriotic duty for King and country.</p><p class="prose-p">Those who hesitated faced severe humiliation from the civilian White Feather Movement, in which women publicly handed white feathers to men out of uniform as symbols of cowardice. This unbearable social shame made remaining at home in civilian clothes psychologically impossible for thousands of youths.</p>'
  ],

  // Lesson 2: Trench Warfare & The Haig Controversy (1915–1916)
  [
    // B1: ["Race to the Sea", "Deadly Machine Guns", "Digging In to Survive"]
    '<p class="prose-p"><span class="para-ref">[2.1]</span> In autumn 1914, fluid mobile warfare ended as rival armies attempted to outflank each other in the Race to the Sea. When both sides reached the English Channel coast, open movement became impossible against modern rapid-firing industrial weaponry.</p><p class="prose-p">Lethal artillery shrapnel and deadly machine guns sweeping open fields forced infantry into digging in to survive. Soldiers carved protective earthen trenches, establishing an unbroken 400-mile fortified front line stretching from the North Sea coast to the Swiss border.</p>',

    // B2: ["Zig-Zag Trench Lines", "Deep Concrete Dugouts", "Barbed Wire Traps"]
    '<p class="prose-p"><span class="para-ref">[2.2]</span> Frontline trenches evolved into elaborate three-tier defensive networks comprising front, support, and reserve positions. Engineers designed distinct zig-zag trench lines with sandbagged traverses to stop enemy invaders firing directly down straight alleys and contain explosive blast damage.</p><p class="prose-p">In front of the parapets, soldiers strung dense barbed wire traps hundreds of yards deep to funnel attacking infantry into machine-gun kill zones. Behind the lines, deep concrete dugouts thirty feet underground provided shelter from continuous artillery bombardments.</p>',

    // B3: ["Trench Foot & Frozen Mud", "Relentless Heavy Shelling", "Shell Shock Trauma"]
    '<p class="prose-p"><span class="para-ref">[2.3]</span> Daily survival in Western Front trenches was a relentless ordeal against elemental filth, vermin, and disease. Soldiers stood for days in flooded clay trenches, contracting trench foot & frozen mud infections that caused agonising fungal rot and frequent medical amputations.</p><p class="prose-p">Infantrymen faced relentless heavy shelling from massive howitzers that churned the earth into liquid slush and tore human bodies apart. Surviving prolonged bombardments caused severe shell shock trauma, leaving thousands of traumatised soldiers trembling uncontrollably with shattered nerves.</p>',

    // B4: ["7-Day Bombardment", "Barbed Wire Intact", "57,470 Casualties"]
    '<p class="prose-p"><span class="para-ref">[2.4]</span> On 1 July 1916, British forces launched the Battle of the Somme to relieve French forces at Verdun. General Sir Douglas Haig ordered an unprecedented 7-day bombardment firing 1.5 million shells, believing heavy artillery would obliterate German defences completely.</p><p class="prose-p">However, shrapnel shells left German barbed wire intact, and defenders sheltered safely in reinforced underground shelters. When British infantry walked forward into No Man’s Land, waiting machine guns inflicted 57,470 casualties on the single bloodiest day in British military history.</p>',

    // B5: ["Frontal Attacks in Mud", "Hard War Lessons Learnt", "Tanks & Combined Arms"]
    '<p class="prose-p"><span class="para-ref">[2.5]</span> Catastrophic Somme casualties ignited bitter historical debate surrounding General Douglas Haig’s leadership. Critics condemned him as a callous butcher who squandered a generation in futile frontal attacks in mud, depicting courageous infantry as lions led by incompetent aristocratic donkeys.</p><p class="prose-p">In contrast, revisionist historians argue Haig was trapped in an industrial learning curve. Through these hard war lessons learnt, British commanders pioneered modern combined-arms tactics: coordinating tanks & combined arms, creeping artillery barrages, and aircraft to achieve decisive Allied victory by 1918.</p>'
  ],

  // Lesson 3: Global Empire & The Forgotten Fronts (1914–1918)
  [
    // B1: ["Troops from Five Continents", "Vital Wheat & Oil Ships", "Global Supply Lifeline"]
    '<p class="prose-p"><span class="para-ref">[3.1]</span> The Great War was fundamentally an imperial conflict whose outcome depended entirely on Britain’s global empire. Over four million non-white colonial personnel and dominion troops from five continents mobilised to sustain the British imperial war effort across multiple theatres.</p><p class="prose-p">Britain relied on merchant shipping to transport vital wheat & oil ships from overseas colonies to feed civilians and fuel navies. This vast global supply lifeline provided essential raw materials, industrial labour, and food reserves that prevented Allied economic collapse under German submarine warfare.</p>',

    // B2: ["Indian Troops Save Flanders", "Freezing Mud & Thin Khaki", "First Asian Soldier Wins VC"]
    '<p class="prose-p"><span class="para-ref">[3.2]</span> In autumn 1914, the Indian Expeditionary Force arrived in France to reinforce exhausted regular British battalions. At First Ypres, courageous Indian troops save Flanders from German breakthrough, suffering horrific casualties while holding flooded frontline trenches in freezing mud & thin khaki cotton uniforms.</p><p class="prose-p">During desperate defensive combat at Hollebeke, Sepoy Khudadad Khan stood alone at his machine gun despite severe wounds, becoming the first Asian soldier wins VC (Victoria Cross). Over 1.3 million Indian volunteers served loyally across Europe, Mesopotamia, and Palestine throughout the conflict.</p>',

    // B3: ["Anzac Cove Steep Cliffs", "Ottoman Machine Guns", "Birth of ANZAC Legend"]
    '<p class="prose-p"><span class="para-ref">[3.3]</span> In April 1915, Allied forces launched an amphibious invasion of Gallipoli to knock the Ottoman Empire out of the war. Landing at dawn, Australian and New Zealand Army Corps (ANZAC) troops found themselves trapped below Anzac Cove steep cliffs under murderous fire.</p><p class="prose-p">Entrenched Turkish defenders swept exposed ravines with lethal Ottoman machine guns, pinning Allied soldiers on rocky beaches. Eight months of bloody stalemate ended in total evacuation, yet the courage shown by dominion troops marked the permanent birth of ANZAC legend and national pride.</p>',

    // B4: ["140,000 Chinese Labourers", "Unloading Heavy Shells", "Guarded Curfew Camps"]
    '<p class="prose-p"><span class="para-ref">[3.4]</span> Behind front lines, Allied armies depended on civilian logistics battalions to sustain industrial warfare. Over 140,000 Chinese labourers of the Chinese Labour Corps travelled halfway around the world to dig communication trenches, repair railway tracks, and clear deadly battlefields.</p><p class="prose-p">These workers performed exhausting shifts unloading heavy shells and toxic chemical munitions under constant bombardment. Despite their indispensable contribution, imperial authorities subjected Chinese workers to guarded curfew camps, harsh corporal punishment, and strict racial segregation that barred contact with local French civilians.</p>',

    // B5: ["No Marked African Graves", "Buried in Anonymous Pits", "Victory Parade Erasure"]
    '<p class="prose-p"><span class="para-ref">[3.5]</span> Despite sacrificing millions of lives, colonial service was met with deliberate institutional prejudice after the war. In East Africa, over one million African porters died carrying military supplies, yet imperial authorities left no marked African graves across former colonial battlefields.</p><p class="prose-p">Unlike white British soldiers who received individual headstones, fallen African and Asian labourers were buried in anonymous pits without names. Furthermore, non-white troops were excluded from the 1919 London Victory Parade erasure, denying colonial subjects equal recognition, pensions, and remembrance for decades.</p>'
  ],

  // Lesson 4: The Home Front & Women’s Total War (1914–1918)
  [
    // B1: ["State Control Under DORA", "Press Censorship Imposed", "Early Pub Closures"]
    '<p class="prose-p"><span class="para-ref">[4.1]</span> In August 1914, Parliament passed the Defence of the Realm Act, establishing unprecedented state control under DORA across British society. The government suspended long-cherished liberal civil liberties, commandeered private factories, requisitioned agricultural land, and introduced sweeping emergency powers over civilian daily life.</p><p class="prose-p">To protect national morale and prevent espionage, strict press censorship imposed blackouts on military failures and frontline casualties. The government regulated public behaviour by enforcing early pub closures and watering down beer to eliminate drunkenness and boost industrial factory production.</p>',

    // B2: ["1915 Daily Mail Headlines", "Frontline Shell Famine", "State Takes Over Output"]
    '<p class="prose-p"><span class="para-ref">[4.2]</span> In May 1915, British offensives stalled due to an acute shortage of high-explosive artillery ammunition. Sensational 1915 Daily Mail headlines exposed this frontline shell famine, accusing Lord Kitchener and the government of causing unnecessary soldier deaths through industrial incompetence.</p><p class="prose-p">The political crisis forced Prime Minister Asquith into a national coalition, creating the Ministry of Munitions under David Lloyd George. The state takes over output by nationalising private manufacturing, constructing government shell factories, and coordinating industrial supplies under strict ministerial management.</p>',

    // B3: ["Voluntary System Exhausted", "Military Service Act Passed", "Conscientious Objectors"]
    '<p class="prose-p"><span class="para-ref">[4.3]</span> By late 1915, massive casualties on the Western Front meant the voluntary system exhausted all available reserves of willing recruits. Voluntary appeals could no longer match the slaughter of industrial warfare, prompting heated political debates over state compulsion and individual freedom.</p><p class="prose-p">In January 1916, Parliament made history when the Military Service Act passed, imposing compulsory conscription on unmarried men aged eighteen to forty-one. While most obeyed, around 16,000 conscientious objectors refused military service on religious or moral grounds, facing prison and hard labour.</p>',

    // B4: ["Toxic Jaundice Skin Yellowing", "Silvertown Explosion Risk", "80% of All British Shells"]
    '<p class="prose-p"><span class="para-ref">[4.4]</span> With millions of men fighting in the trenches, nearly one million British women entered industrial weapons factories. These vital munitions workers, nicknamed Canary Girls, suffered toxic jaundice skin yellowing and green hair caused by handling lethal cordite chemicals and poisonous TNT powder daily.</p><p class="prose-p">Workers faced extreme danger from constant chemical fumes and disastrous Silvertown explosion risk, which killed seventy-three people in 1917. Despite terrible working conditions, female factory workers produced 80% of all British shells and weaponry, proving absolutely indispensable to the Allied war effort.</p>',

    // B5: ["U-Boats Sink Merchantmen", "Six Weeks Food Reserve", "Compulsory Ration Books"]
    '<p class="prose-p"><span class="para-ref">[4.5]</span> In early 1917, Germany launched unrestricted submarine warfare to starve Britain into unconditional surrender. German U-boats sink merchantmen across Atlantic trade routes, sinking thousands of tons of shipping and leaving Britain with barely a precarious six weeks food reserve of wheat flour.</p><p class="prose-p">Soaring food prices and panic buying produced exhausting queues outside urban grocers, threatening domestic civilian morale. In early 1918, the government introduced compulsory ration books for sugar, meat, butter, and jam, ensuring fair food distribution until Allied naval convoys defeated the submarine threat.</p>'
  ],

  // Lesson 5: The Treaty of Versailles & The Flawed Peace (1918–1919)
  [
    // B1: ["Kiel Sailors Mutiny", "Kaiser Flees to Holland", "Railway Armistice Signed"]
    '<p class="prose-p"><span class="para-ref">[5.1]</span> In autumn 1918, the German war effort collapsed under the Allied Hundred Days Offensive and naval blockade. When German admirals ordered a suicidal final sea sortie, rebellious Kiel sailors mutiny across naval bases, triggering widespread workers\' strikes and revolutionary uprisings across German cities.</p><p class="prose-p">Realising total military defeat was imminent, Kaiser flees to Holland to seek permanent exile as the German monarchy collapsed. On 11 November 1918, German representatives met Allied leaders in a railway carriage near Compiègne, where the formal railway armistice signed ended four years of bloodshed.</p>',

    // B2: ["Wilson’s 14 Points Idealism", "Clemenceau Demands Revenge", "Lloyd George Imperial Trade"]
    '<p class="prose-p"><span class="para-ref">[5.2]</span> In January 1919, Allied leaders met at the Paris Peace Conference with conflicting visions for postwar Europe. American President Woodrow Wilson championed Wilson’s 14 Points idealism, demanding national self-determination for ethnic minorities and establishing a League of Nations to guarantee permanent global peace.</p><p class="prose-p">In stark contrast, French Premier Georges Clemenceau demands revenge, massive financial reparations, and German military destruction to protect traumatised France from future invasion. British Prime Minister David Lloyd George imperial trade priorities sought compromise, moderating French demands to preserve Germany as an essential trading partner.</p>',

    // B3: ["Article 231 War Guilt Clause", "Crippling £6.6bn Bill", "Army Capped at 100,000"]
    '<p class="prose-p"><span class="para-ref">[5.3]</span> Signed on 28 June 1919, the Treaty of Versailles imposed harsh penalties on the new Weimar Republic. Under Article 231 War Guilt clause, Germany was forced to accept total moral blame for starting the war, providing legal justification for a crippling £6.6bn bill in financial reparations.</p><p class="prose-p">Germany lost all overseas colonies and 13% of its European territory, while the Rhineland was demilitarised. Its military was shattered: army capped at 100,000 volunteers, conscription abolished, and combat aircraft banned. Germans across all parties condemned this non-negotiable settlement as an intolerable Diktat.</p>',

    // B4: ["Keynes Carthaginian Peace", "Dyson 1940 Class Cartoon", "Predicting Second Conflict"]
    '<p class="prose-p"><span class="para-ref">[5.4]</span> Contemporary observers warned that the Versailles settlement was dangerously unstable and economically destructive. British economist John Maynard Keynes resigned from the delegation, branding the treaty a disastrous Keynes Carthaginian peace that would crush European trade, starve German workers, and foster dangerous political extremism across Central Europe.</p><p class="prose-p">Australian artist Will Dyson captured this anxiety in his prophetic Dyson 1940 Class cartoon, showing Allied leaders leaving Versailles while a weeping toddler stands nearby labelled 1940 Class. This prescient drawing succeeded in predicting second conflict twenty years before World War II began in 1939.</p>',

    // B5: ["German Industrial Core Intact", "Bitterness Exploited by Nazis", "Allied Will to Enforce Fails"]
    '<p class="prose-p"><span class="para-ref">[5.5]</span> For decades, historians blamed Versailles directly for destroying German democracy and causing Adolf Hitler’s rise. Punitive clauses generated national humiliation and economic bitterness exploited by Nazis during the Great Depression, convincing millions of Germans that democracy was weak and treasonous.</p><p class="prose-p">However, modern scholars argue that Versailles left the German industrial core intact alongside Europe’s largest population. The fatal disaster occurred when Allied will to enforce fails during the 1930s, allowing aggressive German rearmament and expansion to proceed unchecked until another devastating European conflict erupted.</p>'
  ]
];

// Check word counts and paragraphs
console.log('=== WORD COUNT & PARAGRAPH AUDIT FOR GREAT WAR PART 2 ===');
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

// Trigger check
const { enquiryConfigs } = require('./render_great_war_part2_twopage_workbook.cjs');
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'into', 'over', 'after', 
  'before', 'under', 'between', 'across', 'through', 'during', 'without', 'within', 
  'against', 'about', 'than', 'only', 'also', 'each', 'such', 'were', 'been', 
  'have', 'their', 'they', 'will', 'would', 'could', 'should', 'does', 'done', 
  'both', 'what', 'when', 'where', 'which', 'while', 'whom', 'why', 'per', 'how'
]);

let missingTotal = 0;
enquiryConfigs.forEach((cfg, eIdx) => {
  const blocks = lessonsData[eIdx];
  cfg.stages.forEach((stg, sIdx) => {
    const blockText = (blocks[sIdx] || '').toLowerCase().replace(/<[^>]+>/g, ' ');
    stg.bullets.forEach(bullet => {
      const words = bullet.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
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
