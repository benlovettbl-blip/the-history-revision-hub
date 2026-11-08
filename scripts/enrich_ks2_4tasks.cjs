/**
 * enrich_ks2_4tasks.cjs
 * Enriches all 11 KS2 WW2 lessons with the complete 4-Task Disciplinary Writing suite:
 * 1. Primary Evidence Detective [Source Clues]
 * 2. Historical Explanation [Cause & Effect]
 * 3. Living History: Step Into Their Shoes [Personal Experiences]
 * 4. Mission Challenge • The Big Question [Historian Challenge]
 *
 * Guarantees 1:1 parity between printed pupil workbook and digital Writing Studio on screen.
 */

const fs = require('fs');
const path = require('path');

const KS2_TASKS = [
  // Lesson 1
  [
    {
      id: 'task_1',
      task_num: 1,
      type: 'source_clues',
      topic: '1. Primary Evidence Detective',
      tag: 'Source Clues',
      question: 'Look closely at Source A. How do you think it felt for children to do their schoolwork wearing rubber gas masks?',
      starter: 'Looking closely at Source A, doing schoolwork wearing a rubber gas mask must have felt...',
      hints: [
        'Mention the suffocating rubber facepiece and misting glass eyepieces.',
        'Explain how difficult it was to hear the teacher or talk to classmates.',
        'Reflect on the constant reminder of danger during ordinary lessons.'
      ],
      model_answer: 'Looking closely at Source A, doing schoolwork wearing a rubber gas mask must have felt claustrophobic, hot, and frightening for young pupils. The heavy black rubber smelled strongly of sulfur and chemicals, while the small glass eyepieces frequently misted over with sweat so children could barely read their exercise books. Breathing through the heavy charcoal canister made a strange rasping sound, and teachers had to shout to be heard. Even though no bombs had fallen yet, doing sums in a respirator served as an eerie daily reminder that Britain was on the brink of total war.'
    },
    {
      id: 'task_2',
      task_num: 2,
      type: 'historical_explanation',
      topic: '2. Historical Explanation',
      tag: 'Cause & Effect',
      question: 'Why did the British government insist that every civilian carry their gas mask in a cardboard box at all times?',
      starter: 'The British government required all civilians to carry their gas masks at all times because...',
      hints: [
        'Recall the horrific memories of poison gas attacks from the First World War.',
        'Explain the fear of surprise aerial bombardments dropping deadly chemical bombs.',
        'Highlight the shoulder strap design allowing instant donning within seconds.'
      ],
      model_answer: 'The British government required all civilians to carry their gas masks at all times because ministers feared German bombers would drop lethal poison gas on civilian cities without warning. Remembering the horrific blinded soldiers and choking trenches of the First World War, the government issued 38 million respirators and made carrying them mandatory. Wearing the cardboard box on a shoulder strap meant adults and children could pull on their masks within seconds of an air raid siren wailing. Bus conductors refused entry and headteachers sent pupils home if they forgot their box, ensuring maximum civilian preparedness.'
    },
    {
      id: 'task_3',
      task_num: 3,
      type: 'living_history',
      topic: '3. Living History: Step Into Their Shoes',
      tag: 'Personal Experiences',
      question: 'Every window had to be covered with heavy black curtains. Why was the blackout so strictly enforced by Air Raid Wardens?',
      starter: 'Air Raid Wardens strictly enforced the blackout every evening because...',
      hints: [
        'Explain how bomber navigators relied on city lights, reflections, and streetlamps.',
        'Describe the volunteer wardens patrolling darkened streets shouting warnings.',
        'Discuss the daily dangers and inconveniences of living in total darkness.'
      ],
      model_answer: 'Air Raid Wardens strictly enforced the blackout every evening because even a single beam of light escaping through a careless curtain gap could guide enemy bombers directly to towns, railway hubs, and factories. Over 1.4 million volunteer ARP wardens patrolled the pitch-black streets in tin helmets, shouting "Put that light out!" and reporting households that showed illumination. Although stumbling through darkened streets led to fractured limbs and traffic collisions, the strict blackout successfully blinded German pilots and saved thousands of civilian lives.'
    },
    {
      id: 'task_4',
      task_num: 4,
      type: 'big_question',
      topic: '4. Mission Challenge • The Big Question',
      tag: 'Historian Challenge',
      question: 'Big Question: In what ways did the outbreak of war change the daily routine of ordinary British schoolchildren overnight?',
      starter: 'The outbreak of the Second World War completely transformed the daily routines of British schoolchildren overnight by...',
      hints: [
        'Synthesize evidence across gas masks, air raid practices, and home life.',
        'Contrast peaceful pre-war days with sudden emergency routines.',
        'Conclude with the psychological resilience required of children.'
      ],
      model_answer: 'The outbreak of the Second World War completely transformed the daily routines of British schoolchildren overnight. Almost instantly, children had to carry a bulky cardboard gas mask box wherever they walked, and normal school lessons were interrupted by sudden air raid practices in cold cloakrooms. At home, families had to spend every evening in stuffy rooms behind suffocating black curtains, keeping torches dimmed and listening anxiously to radio updates. Almost overnight, British children had to grow up rapidly, adapting their lives to constant safety drills, sirens, and the ever-present threat of enemy bombardment.'
    }
  ],

  // Lesson 2
  [
    {
      id: 'task_1',
      task_num: 1,
      type: 'source_clues',
      topic: '1. Primary Evidence Detective',
      tag: 'Source Clues',
      question: "Look at Source A. Why did authorities attach luggage labels to children's coats rather than placing identification inside their bags?",
      starter: "Authorities pinned cardboard luggage labels directly onto children's coats because...",
      hints: [
        'Consider the chaos of crowded railway stations with thousands of separated pupils.',
        'Explain what would happen if bags were lost or separated from children.',
        'Note how billeting officers needed immediate, visible information at the arrival platform.'
      ],
      model_answer: 'Authorities pinned cardboard luggage labels directly onto children\'s coats because crowded railway platforms were chaotic, noisy, and confusing. With over 1.5 million children travelling across the country, bags and suitcases frequently got mixed up or left behind on train wagons. Pinned visibly to the chest, a child\'s luggage label allowed busy teachers, railway staff, and rural billeting officers to instantly identify each evacuee\'s name, home school, and destination without having to search through personal luggage.'
    },
    {
      id: 'task_2',
      task_num: 2,
      type: 'historical_explanation',
      topic: '2. Historical Explanation',
      tag: 'Cause & Effect',
      question: 'What contrasting feelings might a young evacuee experience upon arriving at a quiet countryside railway station?',
      starter: 'Upon stepping onto a quiet countryside railway platform, an evacuee would feel a mixture of...',
      hints: [
        'Contrast the fear of leaving parents behind with curiosity about open green fields.',
        'Mention the shock of rural silence, farm animals, and strange regional accents.',
        'Explain the overwhelming exhaustion after hours travelling without knowing their destination.'
      ],
      model_answer: 'Upon stepping onto a quiet countryside railway platform, an evacuee would feel an overwhelming mixture of excitement, homesickness, and bewilderment. For city children from crowded streets like the East End of London, the fresh rural air, rolling green hills, and farm animals felt like a fantastical holiday adventure. However, beneath that curiosity lay profound heartache and dread: they were hundreds of miles from their mothers, holding a damp gas mask box, and nervously wondering what kind of strangers were about to take them into their homes.'
    },
    {
      id: 'task_3',
      task_num: 3,
      type: 'living_history',
      topic: '3. Living History: Step Into Their Shoes',
      tag: 'Personal Experiences',
      question: 'Imagine arriving in a village hall where local villagers choose which child to take home. How would you feel standing in line?',
      starter: 'Standing in line in a draughty village hall waiting to be chosen would feel...',
      hints: [
        'Reflect on the undignified inspection by strangers picking clean or strong-looking children.',
        'Consider the fear of being separated from brothers and sisters.',
        'Describe the relief of being chosen versus the sting of being left until last.'
      ],
      model_answer: 'Standing in line in a draughty village hall waiting to be chosen would feel humiliating, terrifying, and deeply lonely. Local hosts would walk down the rows picking children like items on a market stall, often choosing the best-dressed, healthiest-looking boys and girls first while leaving scruffier children or siblings behind. Clutching my cardboard label, I would be desperate not to be split up from my sister, watching other children walk away with strange adults and silently praying that a warm, kind family would step forward to take us.'
    },
    {
      id: 'task_4',
      task_num: 4,
      type: 'big_question',
      topic: '4. Mission Challenge • The Big Question',
      tag: 'Historian Challenge',
      question: 'Big Question: Why was evacuation both an adventure and a heartbreaking separation for British families?',
      starter: 'Operation Pied Piper was both an exciting adventure and a heartbreaking separation because...',
      hints: [
        'Contrast rural discoveries with the emotional cost of split families.',
        'Mention social culture shocks between city poverty and country estates.',
        'Synthesize why evacuation was deemed essential despite emotional trauma.'
      ],
      model_answer: 'Operation Pied Piper was both an exciting adventure and a heartbreaking separation because it saved children\'s lives at the cost of fracturing families. For many inner-city children who had never seen an apple tree or a cow, life in the British countryside opened up a wonder-filled world of open skies, fresh milk, and woodland play. Yet for parents left behind in bomb-threatened cities, waving goodbye to tearful children on train platforms was agony, and thousands of young evacuees suffered profound homesickness, strict hosts, and years of separation from everyone they loved.'
    }
  ],

  // Lesson 3
  [
    {
      id: 'task_1',
      task_num: 1,
      type: 'source_clues',
      topic: '1. Primary Evidence Detective',
      tag: 'Source Clues',
      question: 'Look at Source A. Why did each child have to wear a numbered identity card around their neck walking down this gangway?',
      starter: 'Each refugee child wore a numbered identity tag around their neck because...',
      hints: [
        'Note that these foreign children did not speak English and travelled without parents.',
        'Explain how numbers matched passenger manifests and sponsor records.',
        'Reflect on the sheer vulnerability of walking into a foreign country alone.'
      ],
      model_answer: 'Each refugee child wore a numbered identity tag around their neck because they were travelling completely alone without their parents and most spoke only German or Czech, not English. As they walked down the ship\'s gangway in Harwich or Southampton, British immigration officers and volunteer welfare workers relied on these large numbered cards to match every child to the official railway manifests, ensure none were lost, and guide them safely to their pre-arranged foster families or transit camps.'
    },
    {
      id: 'task_2',
      task_num: 2,
      type: 'historical_explanation',
      topic: '2. Historical Explanation',
      tag: 'Cause & Effect',
      question: 'Each refugee child was allowed only ONE small suitcase. What 3 personal items would you pack to remember your family?',
      starter: 'If I were allowed only one small suitcase on the Kindertransport, I would choose to pack...',
      hints: [
        'Choose meaningful personal keepsakes over bulky material goods.',
        'Explain why photographs, a handwritten letter, or a family heirloom mattered most.',
        'Link your choices to the historical reality that many never saw their parents again.'
      ],
      model_answer: 'If I were allowed only one small suitcase on the Kindertransport, I would choose to pack a framed family photograph, a handwritten blessing or letter from my mother, and a beloved childhood toy, such as a cloth doll. In a small suitcase with strict 50-mark currency limits, sentimental treasures were infinitely more precious than extra clothes. A mother\'s handwritten letter would preserve her voice and love across foreign borders, while a photograph would ensure that as the years passed, I would never forget my parents\' faces.'
    },
    {
      id: 'task_3',
      task_num: 3,
      type: 'living_history',
      topic: '3. Living History: Step Into Their Shoes',
      tag: 'Personal Experiences',
      question: 'How did British volunteers and foster families demonstrate extraordinary compassion to welcome children who spoke no English?',
      starter: 'British volunteers and foster families demonstrated extraordinary compassion by...',
      hints: [
        'Mention language barriers bridged with gestures, smiles, and warm meals.',
        'Highlight the £50 financial guarantee raised by ordinary citizens.',
        'Discuss providing a patient, gentle home to deeply traumatised refugee children.'
      ],
      model_answer: 'British volunteers and foster families demonstrated extraordinary compassion by opening their homes, hearts, and wallets to children fleeing deadly persecution. Ordinary families and religious groups raised the mandatory £50 guarantee (worth over £3,500 today) for children they had never met. When frightened refugees arrived speaking no English, foster parents welcomed them with warm cups of tea, patient smiles, picture dictionaries, and gentle kindness, helping vulnerable young people feel secure in a strange new land.'
    },
    {
      id: 'task_4',
      task_num: 4,
      type: 'big_question',
      topic: '4. Mission Challenge • The Big Question',
      tag: 'Historian Challenge',
      question: 'Big Question: Why is the Kindertransport remembered as one of the greatest humanitarian rescue missions in British history?',
      starter: 'The Kindertransport is remembered as one of the greatest humanitarian rescue missions in British history because...',
      hints: [
        'Highlight the rescue of nearly 10,000 predominantly Jewish children within 9 months.',
        'Recognize the teamwork between parliament, rescuers like Nicholas Winton, and volunteers.',
        'Acknowledge the tragic context: the children were saved, but most of their parents were murdered.'
      ],
      model_answer: 'The Kindertransport is remembered as one of the greatest humanitarian rescue missions in British history because it saved nearly 10,000 innocent children from horrific Nazi persecution. In the brief nine-month window between the November Pogrom and the outbreak of war, tireless rescuers like Nicholas Winton and Trevor Chadwick cut through red tape, while British families stepped forward to provide shelter. Although the tragedy remains that almost all of these children never saw their murdered parents again, the rescue stands as an enduring monument to moral courage, volunteer dedication, and humanitarian shelter in humanity\'s darkest hour.'
    }
  ],

  // Lesson 4
  [
    {
      id: 'task_1',
      task_num: 1,
      type: 'source_clues',
      topic: '1. Primary Evidence Detective',
      tag: 'Source Clues',
      question: 'Look at Source A. Why did families bury their Anderson shelter halfway into the soil and pile earth and turf on top?',
      starter: 'Families buried their Anderson shelter halfway into the garden soil because...',
      hints: [
        'Explain that corrugated steel resisted flying bomb splinters and falling masonry.',
        'Describe how thick layers of earth absorbed the deadly shockwaves of high-explosive blasts.',
        'Note the turf on top provided camouflage from low-flying German aircraft.'
      ],
      model_answer: 'Families buried their Anderson shelter halfway into the garden soil and mounded thick layers of earth and turf on top to absorb the concussive shockwaves of high-explosive bombs. While the arched corrugated steel sheets could deflect sharp metal shrapnel and falling bricks, the surrounding earth absorbed explosive blast pressure that would otherwise crush an above-ground shed. The turf also blended into garden gardens, reducing visibility from night raiders.'
    },
    {
      id: 'task_2',
      task_num: 2,
      type: 'historical_explanation',
      topic: '2. Historical Explanation',
      tag: 'Cause & Effect',
      question: 'What supplies and comforts would you want to take with you into a dark garden shelter during a nighttime air raid?',
      starter: 'To endure a long, freezing night inside an Anderson shelter, the most essential supplies to bring were...',
      hints: [
        'Think about warmth, lighting, and dampness (blankets, oil lamps, thermos).',
        'Mention activities to distract children from thunderous bomb explosions (books, games).',
        'Include emergency tools like a spade, whistle, or torch if the shelter door became buried.'
      ],
      model_answer: 'To endure a long, freezing night inside an Anderson shelter, the most essential supplies were warm woollen blankets, a hot thermos of sweet tea, a paraffin heater, and battery torches. Because shelters were damp and cold, heavy coats and dry cushions made wooden bunks bearable. Parents also packed books, card games, and boiled sweets to distract terrified children from the terrifying thud of falling bombs, alongside a whistle and spade in case the entrance became blocked by falling debris.'
    },
    {
      id: 'task_3',
      task_num: 3,
      type: 'living_history',
      topic: '3. Living History: Step Into Their Shoes',
      tag: 'Personal Experiences',
      question: 'Why did over 150,000 Londoners choose to sleep on dusty Underground platforms rather than stay in their own bedrooms?',
      starter: 'Over 150,000 Londoners chose to sleep on tube station platforms because...',
      hints: [
        'Contrast flimsy brick houses in street terraces with deep underground tunnels.',
        'Describe the mutual comfort and singing among neighbours during night bombardments.',
        'Acknowledge the foul air, noise, and draughts endured for guaranteed survival.'
      ],
      model_answer: 'Over 150,000 Londoners chose to sleep on tube station platforms because they knew that seventy feet of solid London clay above their heads was completely impenetrable to even the heaviest German bombs. In crowded row houses, a single direct hit meant instant death, whereas the Underground guaranteed survival. Despite the stuffy air, screeching train wheels, and mosquito-ridden dust, the underground created an incredible camaraderie: neighbours brewed tea, sang songs together, and slept peacefully knowing they would wake up alive.'
    },
    {
      id: 'task_4',
      task_num: 4,
      type: 'big_question',
      topic: '4. Mission Challenge • The Big Question',
      tag: 'Historian Challenge',
      question: 'Big Question: Why was British civilian resilience and community spirit described as the secret weapon that defeated the Blitz?',
      starter: 'British civilian resilience and community spirit was described as the secret weapon that defeated the Blitz because...',
      hints: [
        'Explain Hitler\'s objective: terrorising civilians into demanding surrender.',
        'Give examples of ordinary citizens: ARP wardens, auxiliary firefighters, neighbours.',
        'Conclude on the "Blitz Spirit" turning destruction into collective defiance.'
      ],
      model_answer: 'British civilian resilience and community spirit was described as the secret weapon that defeated the Blitz because Hitler\'s main aim was to shatter British morale and force the nation to beg for peace. Instead of collapsing in terror across 57 nights of continuous bombing, ordinary Londoners, Scousers, and Mancunians pulled together. Volunteer rescue squads dug neighbours from ruins, mobile canteens served hot tea at bomb sites, and people defiantly opened shopfronts with signs reading "More Open Than Usual". This unbreakable solidarity proved that terror bombing could never conquer a united society.'
    }
  ],

  // Lesson 5
  [
    {
      id: 'task_1',
      task_num: 1,
      type: 'source_clues',
      topic: '1. Primary Evidence Detective',
      tag: 'Source Clues',
      question: 'Look at Source A. Why did the government use pictures of cheerful children on posters to encourage families to grow food?',
      starter: 'The government used cheerful, energetic children on Dig for Victory posters because...',
      hints: [
        'Show how children made gardening feel like a proud, heroic family mission.',
        'Appeal to parental love and the patriotic desire to keep children healthy.',
        'Convince every household that even the smallest hands could help defeat U-boats.'
      ],
      model_answer: 'The government used cheerful, energetic children on "Dig for Victory" posters to make domestic food production feel like a proud, accessible family adventure rather than exhausting manual labour. Seeing smiling boys and girls clutching spades and oversized vegetables inspired parents to turn their flowerbeds into allotments and showed youngsters that even the smallest hands could play an active part in defeating the German U-boat blockade.'
    },
    {
      id: 'task_2',
      task_num: 2,
      type: 'historical_explanation',
      topic: '2. Historical Explanation',
      tag: 'Cause & Effect',
      question: 'One egg, 50g of butter, and two rashers of bacon for the entire week! How would your family plan breakfast and dinner?',
      starter: 'With such tiny weekly food rations, my family would have to plan meals by...',
      hints: [
        'Explain substituting luxury ingredients with bulky homegrown vegetables (potatoes, carrots).',
        'Describe creative wartime recipes like Woolton Pie, powdered eggs, and carrot jam.',
        'Highlight how nothing was wasted and leftovers were remade into soups.'
      ],
      model_answer: 'With such tiny weekly food rations, my family would have to plan every meal around bulky homegrown vegetables and government staples like the National Loaf. The single fresh egg would be saved for weekend baking or given to a sick child, while weekday breakfasts would rely on oat porridge sweetened with grated carrot or scrambled dried powdered egg. Dinners would feature Lord Woolton Pie—a hot pastry filled with potatoes, parsnips, and turnips in vegetable broth—ensuring every scrape of bacon fat was used for cooking grease.'
    },
    {
      id: 'task_3',
      task_num: 3,
      type: 'living_history',
      topic: '3. Living History: Step Into Their Shoes',
      tag: 'Personal Experiences',
      question: 'Why was throwing away leftover food made a criminal offence punishable by heavy fines during wartime?',
      starter: 'Wasting food was treated as a serious criminal offence during the war because...',
      hints: [
        'Mention the brave merchant sailors who risked their lives crossing the U-boat Atlantic.',
        'Explain that wasted bread was equivalent to wasting British shipping space and fuel.',
        'Note how scraps were collected for communal pig clubs and fertilizer.'
      ],
      model_answer: 'Wasting food was treated as a serious criminal offence during the war because every single ounce of imported flour, meat, and sugar was brought across the North Atlantic by brave merchant seamen who risked their lives against Nazi U-boats. Throwing away crusts or potato peelings was seen as an insult to those sailors\' sacrifices and a direct sabotage of the national war effort. Instead, food scraps had to be saved for pig swill, fed to backyard chickens, or turned into stockpot broth.'
    },
    {
      id: 'task_4',
      task_num: 4,
      type: 'big_question',
      topic: '4. Mission Challenge • The Big Question',
      tag: 'Historian Challenge',
      question: 'Big Question: Why was the rationing system considered one of the fairest and healthiest government policies in British history?',
      starter: 'The wartime rationing system is regarded as one of Britain\'s fairest and healthiest social policies because...',
      hints: [
        'Explain "fair shares for all": the rich could not buy extra basic food with money.',
        'Highlight free cod liver oil, vitamins, and milk provided to children and expectant mothers.',
        'Conclude with the surprising drop in child mortality and improved nutritional health.'
      ],
      model_answer: 'The wartime rationing system is regarded as one of Britain\'s fairest and healthiest social policies because it eliminated social inequality at the dinner table. Regardless of wealth, every individual received the exact same coupon quota, preventing rich families from hoarding basic foodstuffs while the poor starved. Furthermore, with sugar and fats restricted and children given free cod liver oil, orange juice, and fortified school milk, overall public health actually improved: child mortality fell, dental health rose, and malnutrition vanished across poor industrial cities.'
    }
  ],

  // Lesson 6
  [
    {
      id: 'task_1',
      task_num: 1,
      type: 'source_clues',
      topic: '1. Primary Evidence Detective',
      tag: 'Source Clues',
      question: 'Look at Source A. What clues in this painting show what daily life was like for the women working on British farms?',
      starter: 'Looking at Source A, the visual details reveal that life in the Women\'s Land Army was...',
      hints: [
        'Point out their practical uniforms: corduroy breeches, heavy boots, and armbands.',
        'Observe their relaxed postures having a packed lunch outdoors under a tree.',
        'Note the background fields showing the heavy agricultural labour demanded of them.'
      ],
      model_answer: 'Looking at Source A, the visual details reveal that life in the Women\'s Land Army was physically demanding yet full of strong outdoor camaraderie. The women wear practical brown corduroy breeches, green jumpers, and heavy leather workboots suitable for rough fields rather than traditional skirts. Resting under the shade of a tree with simple tin flasks and lunch tins shows that their workdays were long and exhausting, but their relaxed smiles highlight a deep bond of shared pride in keeping the country fed.'
    },
    {
      id: 'task_2',
      task_num: 2,
      type: 'historical_explanation',
      topic: '2. Historical Explanation',
      tag: 'Cause & Effect',
      question: "Before 1939, many women were expected to stay at home. How did assembling Spitfire engines change women's place in society?",
      starter: "Assembling Spitfire engines and working in munitions factories transformed women's place in society by...",
      hints: [
        'Explain how women mastered complex technical, engineering, and manufacturing skills.',
        'Highlight earning independent wages and contributing directly to military victories.',
        'Connect this to breaking Victorian stereotypes about female physical and mental limits.'
      ],
      model_answer: 'Assembling Spitfire engines and working in munitions factories transformed women\'s place in society by shattering the old prejudice that women were only suited for domestic housework. In noisy aircraft hangars and engineering sheds, women mastered complex metal lathes, electrical wiring, and heavy machinery, producing thousands of battle-winning aircraft with extraordinary precision. Earning their own independent wages and doing vital engineering work proved once and for all that women possessed equal skill, strength, and capability to men.'
    },
    {
      id: 'task_3',
      task_num: 3,
      type: 'living_history',
      topic: '3. Living History: Step Into Their Shoes',
      tag: 'Personal Experiences',
      question: 'Imagine leaving a comfortable city home to live in a draughty farm barn rising at 5am each morning. What would you find hardest?',
      starter: 'Trading a comfortable city bedroom for a draughty barn to work on a farm would be hardest because...',
      hints: [
        'Describe the physical exhaustion of 50-hour weeks milking cows, lifting hay bales, and ditch-digging.',
        'Mention the freezing winter cold, blistering hands, and lack of running hot water.',
        'Reflect on overcoming rural loneliness through hard work and Land Girl sisterhood.'
      ],
      model_answer: 'Trading a comfortable city bedroom for a draughty barn would be hardest because of the brutal physical exhaustion and bone-chilling winter cold. Rising at 5am in freezing pitch-black to muck out dairy stalls, heave sodden sacks of potatoes, and dig drainage ditches with raw, blistered hands would test anyone\'s stamina. Without indoor bathrooms or heating, the lack of basic comforts would be a colossal shock, made endurable only by the warmth of Land Girl friendships and pride in serving Britain.'
    },
    {
      id: 'task_4',
      task_num: 4,
      type: 'big_question',
      topic: '4. Mission Challenge • The Big Question',
      tag: 'Historian Challenge',
      question: 'Big Question: Why could Britain not have survived or won the Second World War without the mobilization of women?',
      starter: 'Britain could not have survived or achieved victory in the Second World War without women because...',
      hints: [
        'Cover agriculture (keeping Britain fed), industry (Spitfires and munitions), and defence (radar and ATA pilots).',
        'Emphasize that over 7 million women were mobilized into essential national service.',
        'Conclude on the permanent legacy for modern gender equality.'
      ],
      model_answer: 'Britain could not have survived or achieved victory in the Second World War without women because their labour sustained the nation\'s entire economic and military infrastructure while men fought abroad. Over 80,000 Land Girls prevented starvation by producing record agricultural harvests, while hundreds of thousands in factories built 80% of Britain\'s military hardware, from bombs to Spitfires. Serving also as radar plotters, dispatch riders, nurses, and codebreakers, women formed the indispensable backbone of the Home Front, changing British society forever.'
    }
  ],

  // Lesson 7
  [
    {
      id: 'task_1',
      task_num: 1,
      type: 'source_clues',
      topic: '1. Primary Evidence Detective',
      tag: 'Source Clues',
      question: 'Look closely at Source A. What can we learn about these boys from looking at their photograph? Can you tell their religion or nationality?',
      starter: 'Looking closely at Source A, the photograph reveals that these boys were...',
      hints: [
        'Notice their matching jerseys, relaxed smiles, and proud team spirit.',
        'Observe that their clothes, haircuts, and expressions are completely ordinary.',
        'Conclude that you cannot tell their religion or nationality by looking at them.'
      ],
      model_answer: 'Looking closely at Source A, the photograph reveals that these young boys were completely ordinary children who loved sport, friendship, and school just like boys anywhere in Europe. Dressed in matching striped football shirts with their goalkeeper seated proudly in front, their happy faces show comradeship and innocence. You cannot tell their religion, heritage, or nationality by looking at them, which powerfully proves that before Nazi persecution, Jewish children were woven naturally into the vibrant fabric of everyday European life.'
    },
    {
      id: 'task_2',
      task_num: 2,
      type: 'historical_explanation',
      topic: '2. Historical Explanation',
      tag: 'Cause & Effect',
      question: 'Why is it so vital to learn how children lived, laughed, and played football before studying the laws that took their rights away?',
      starter: 'It is essential to learn about children\'s everyday pre-war lives before studying discrimination because...',
      hints: [
        'Emphasize seeing people as complete, human individuals rather than just "victims".',
        'Show what was cruelly lost: real childhoods, hobbies, friendships, and dreams.',
        'Connect pre-war normality to understanding the tragedy of subsequent persecution.'
      ],
      model_answer: 'It is essential to learn about children\'s everyday pre-war lives before studying discrimination because we must remember victims of persecution as real, living human beings rather than faceless statistics. Learning about their favorite school subjects, family holidays, pet dogs, and football matches restores their personal dignity and identity. This helps pupils understand that the Holocaust did not just destroy lives; it destroyed vibrant communities, cherished childhoods, and brilliant futures.'
    },
    {
      id: 'task_3',
      task_num: 3,
      type: 'living_history',
      topic: '3. Living History: Step Into Their Shoes',
      tag: 'Personal Experiences',
      question: 'How would you feel if a new rule suddenly told you that you could no longer go to school or play football with your friends?',
      starter: 'If an unjust decree suddenly banned me from attending school or playing with my friends, I would feel...',
      hints: [
        'Describe the bewildering confusion of being punished when you have done nothing wrong.',
        'Reflect on the betrayal of having friends or teachers look away or cross the street.',
        'Express the growing dread and isolation of having your world shrunk step-by-step.'
      ],
      model_answer: 'If an unjust decree suddenly banned me from attending school or playing football with my friends, I would feel deeply confused, heartbroken, and angry. It would be bewildering to be told that you are forbidden from entering your own classroom or swimming pool simply because of who you are, especially when you have done nothing wrong. The hardest part would be seeing former teammates and neighbours ignore you in the street, creating a painful sense of loneliness and fear as your world was stripped away.'
    },
    {
      id: 'task_4',
      task_num: 4,
      type: 'big_question',
      topic: '4. Mission Challenge • The Big Question',
      tag: 'Historian Challenge',
      question: 'Big Question: Why did the gradual stripping of rights step-by-step make it so difficult for families to foresee what lay ahead?',
      starter: 'The gradual, step-by-step stripping of civil rights made it extraordinarily difficult for families to foresee catastrophe because...',
      hints: [
        'Explain that each law seemed small or temporary at first (parks, radios, schools).',
        'Highlight how families adapted and hoped that each decree would be the last.',
        'Conclude on the dangerous trap of creeping intolerance and the need to protect rights early.'
      ],
      model_answer: 'The gradual, step-by-step stripping of civil rights made it extraordinarily difficult for families to foresee catastrophe because the persecution was rolled out slowly over six years. Because laws were introduced incrementally—first banning sports clubs, then bicycles, then park benches, and finally schools—many families hoped each indignity was the worst that would happen and tried to adapt. Having lived in Germany and Austria as patriotic citizens for generations, they could never have imagined that school bans would eventually escalate into mass deportation and genocide.'
    }
  ],

  // Lesson 8
  [
    {
      id: 'task_1',
      task_num: 1,
      type: 'source_clues',
      topic: '1. Primary Evidence Detective',
      tag: 'Source Clues',
      question: 'Look at Source A. Why did the German military believe that no human codebreaker could ever crack the Enigma machine?',
      starter: 'The German military believed the Enigma machine was completely uncrackable because...',
      hints: [
        'Examine the mechanical rotors that changed electrical circuits with every single keypress.',
        'Highlight the plugboard cables multiplying combinations into 158 million million million.',
        'Explain how the machine reset its cipher keys daily at midnight.'
      ],
      model_answer: 'The German military believed the Enigma machine was completely uncrackable because of its staggering mechanical complexity. Every time an operator pressed a key, internal rotor wheels clicked forward, changing the internal electrical pathway and substituting a different letter every single time. Combined with front plugboard cables that swapped pairs of letters, Enigma generated over 158 quintillion possible cipher combinations that were reset every midnight, making pencil-and-paper human decoding mathematically impossible.'
    },
    {
      id: 'task_2',
      task_num: 2,
      type: 'historical_explanation',
      topic: '2. Historical Explanation',
      tag: 'Cause & Effect',
      question: 'Why did the codebreakers at Bletchley Park have to build a machine (the Bombe) to defeat another machine?',
      starter: 'Alan Turing and the Bletchley Park codebreakers had to invent the Bombe machine because...',
      hints: [
        'Recall Turing\'s quote: "Only a machine can defeat a machine".',
        'Explain that mathematical trial-and-error by hand took months, but orders were decoded daily.',
        'Describe the spinning drum cylinders checking thousands of wheel settings in minutes.'
      ],
      model_answer: 'Alan Turing and the Bletchley Park codebreakers had to invent the Bombe machine because human brains could never calculate combinations fast enough to be useful. As Turing famously realized, "only a machine can defeat a machine". By building electrical computing machines with rows of rapidly spinning drums that simulated multiple Enigma rotors at once, the Bombe could test and eliminate thousands of rotor combinations in minutes, finding the correct daily cipher settings before German armies launched their attacks.'
    },
    {
      id: 'task_3',
      task_num: 3,
      type: 'living_history',
      topic: '3. Living History: Step Into Their Shoes',
      tag: 'Personal Experiences',
      question: 'Over 10,000 staff worked at Bletchley, mostly young women. Why did they never speak about their work to their own families for 30 years?',
      starter: 'The staff at Bletchley Park maintained absolute silence about their wartime achievements because...',
      hints: [
        'Mention swearing the strict Official Secrets Act under penalty of treason.',
        'Explain the real danger that foreign enemies might realize their codes were broken.',
        'Reflect on enduring decades being thought of as having "ordinary clerical jobs".'
      ],
      model_answer: 'The staff at Bletchley Park maintained absolute silence about their wartime achievements because they took the Official Secrets Act with sacred seriousness. Over 7,000 young women worked tirelessly in freezing wooden huts deciphering intercepted signals, but revealing their work risked alerting foreign adversaries that British intelligence could read their ciphers. For over thirty years, these modest heroes never spoke to their spouses or children, willingly enduring being viewed as ordinary clerks while knowing in their hearts they had saved the free world.'
    },
    {
      id: 'task_4',
      task_num: 4,
      type: 'big_question',
      topic: '4. Mission Challenge • The Big Question',
      tag: 'Historian Challenge',
      question: 'Big Question: Historians estimate Bletchley Park shortened the war by up to two years. How did codebreaking save millions of lives?',
      starter: 'Intelligence decrypted at Bletchley Park shortened the war by up to two years and saved millions of lives by...',
      hints: [
        'Describe Ultra intelligence locating Atlantic U-boat wolfpacks to protect merchant food ships.',
        'Mention forewarning Allied commanders of German troop movements before D-Day.',
        'Conclude on Alan Turing\'s computing legacy pioneering modern computers.'
      ],
      model_answer: 'Intelligence decrypted at Bletchley Park shortened the war by up to two years and saved millions of lives by giving Allied commanders total foresight into enemy strategy. Codenamed "Ultra", decrypted naval ciphers directed Allied supply convoys safely around German U-boat wolfpacks in the Battle of the Atlantic, preventing British starvation. In 1944, codebreakers confirmed that Hitler believed the D-Day deception, allowing Allied armies to break into Europe with far fewer casualties and hastening Nazi Germany\'s total collapse.'
    }
  ],

  // Lesson 9
  [
    {
      id: 'task_1',
      task_num: 1,
      type: 'source_clues',
      topic: '1. Primary Evidence Detective',
      tag: 'Source Clues',
      question: 'Look at Source A. What qualities make someone like Nicholas Winton step forward as a rescuer when others choose to look away?',
      starter: 'Examining Source A, the qualities that led Nicholas Winton to step forward as a rescuer include...',
      hints: [
        'Look at the tenderness with which he holds the vulnerable refugee child in Prague.',
        'Note his decisive initiative to cancel a skiing holiday and confront bureaucracy.',
        'Reflect on his deep moral conviction that human lives matter more than personal convenience.'
      ],
      model_answer: 'Examining Source A, the qualities that led Nicholas Winton to step forward as a rescuer were moral courage, decisive initiative, and profound practical empathy. Instead of taking a leisurely skiing holiday in Switzerland, 29-year-old Winton cancelled his plans to visit freezing refugee camps in Prague. Seeing terrified children facing imminent danger, he refused to say "it is someone else\'s problem" and took personal responsibility, spending weeks cutting through government red tape to save human lives.'
    },
    {
      id: 'task_2',
      task_num: 2,
      type: 'historical_explanation',
      topic: '2. Historical Explanation',
      tag: 'Cause & Effect',
      question: "Winton recorded every child's name, transport number, and foster family in a leather scrapbook. Why were these records so important?",
      starter: "The detailed records and photographs kept in Nicholas Winton's leather scrapbook were vital because...",
      hints: [
        'Explain legal requirements: convincing the Home Office that each child had a £50 guarantee.',
        'Highlight reunion and identity: ensuring children could trace their roots decades later.',
        'Describe the dramatic discovery 50 years later by his wife Grete in their attic.'
      ],
      model_answer: 'The detailed records and photographs kept in Nicholas Winton\'s leather scrapbook were vital because they legally proved to British immigration authorities that every single refugee had a verified foster home and a £50 deposit. More profoundly, these ledger pages preserved the identities, original names, and origins of 669 children whose parents were later murdered. Kept quietly in an attic for fifty years until found by his wife Grete, the scrapbook eventually allowed generations of descendants to discover the identity of the man who saved their lives.'
    },
    {
      id: 'task_3',
      task_num: 3,
      type: 'living_history',
      topic: '3. Living History: Step Into Their Shoes',
      tag: 'Personal Experiences',
      question: 'What is the vital difference between a "bystander" who watches injustice happen and an "upstander" who takes action?',
      starter: 'The vital distinction between a bystander and an upstander is that...',
      hints: [
        'Define a bystander as someone who ignores wrongdoing because of fear, apathy, or convenience.',
        'Define an upstander like Winton or Chadwick as someone who speaks up and takes moral action.',
        'Apply the lesson to modern playground, school, and community life today.'
      ],
      model_answer: 'The vital distinction between a bystander and an upstander is that a bystander watches injustice happen and does nothing, whereas an upstander chooses to intervene and protect those in danger. Bystanders often tell themselves that the problem is not their fault or that someone else will act. In contrast, upstanders like Nicholas Winton and Trevor Chadwick demonstrate that when we witness discrimination or suffering, doing nothing is a choice, and that one determined person taking action can alter the course of history.'
    },
    {
      id: 'task_4',
      task_num: 4,
      type: 'big_question',
      topic: '4. Mission Challenge • The Big Question',
      tag: 'Historian Challenge',
      question: 'Big Question: What can young people today learn from the moral courage of Nicholas Winton and Trevor Chadwick?',
      starter: 'Young people today can draw vital life lessons from the moral courage of Winton and Chadwick, including...',
      hints: [
        'Highlight that ordinary individuals—a stockbroker and a teacher—saved 669 lives without superpowers.',
        'Emphasize moral humility: Winton never bragged or sought fame for his rescue.',
        'Encourage pupils to stand up against bullying and prejudice in their own everyday lives.'
      ],
      model_answer: 'Young people today can draw vital life lessons from Nicholas Winton and Trevor Chadwick: you do not need wealth, authority, or superpowers to defeat injustice; you simply need the courage to care. Winton was an ordinary London clerk and Chadwick was a schoolteacher, yet together they organized rescue trains against impossible odds. Furthermore, Winton\'s fifty years of modest silence teaches that genuine goodness seeks no applause. Their legacy challenges every young person to stand up against prejudice, protect the vulnerable, and choose compassion over apathy.'
    }
  ],

  // Lesson 10
  [
    {
      id: 'task_1',
      task_num: 1,
      type: 'source_clues',
      topic: '1. Primary Evidence Detective',
      tag: 'Source Clues',
      question: "Look at Source A. What does this immense crowd celebrating in the heart of London tell us about the nation's relief when war finally ended?",
      starter: "The immense, sea of celebrating faces filling Trafalgar Square in Source A shows that...",
      hints: [
        'Observe people dancing in fountains, climbing statues, and waving Union flags.',
        'Reflect on nearly six years of terror bombing, blackout, and bereavement suddenly lifting.',
        'Explain the overwhelming collective release of tension across all social classes.'
      ],
      model_answer: 'The immense sea of celebrating faces filling Trafalgar Square in Source A shows the colossal wave of relief that swept across Britain when the war in Europe finally ended on 8 May 1945. After nearly six long years of nightly blackouts, falling V-weapons, and constant fear of telegrams reporting fallen loved ones, the sight of thousands dancing in fountains, hugging strangers, and waving flags captures an unforgettable moment of collective liberation, joy, and triumph over tyranny.'
    },
    {
      id: 'task_2',
      task_num: 2,
      type: 'historical_explanation',
      topic: '2. Historical Explanation',
      tag: 'Cause & Effect',
      question: 'Why was VE Day both a moment of ecstatic celebration and a time of quiet heartache for millions of families?',
      starter: 'VE Day was both a moment of wild celebration and a time of quiet heartache because...',
      hints: [
        'Contrast street parties and bonfires with empty chairs at the family dinner table.',
        'Acknowledge that war was still raging in the Pacific against Japan.',
        'Describe how grief and relief mingled in every British community.'
      ],
      model_answer: 'VE Day was both a moment of wild celebration and a time of quiet heartache because the end of fighting in Europe brought sharp reminders of terrible personal loss. While streets hosted joyous trestle-table tea parties and bonfires, hundreds of thousands of British families looked at empty chairs where fathers, sons, and brothers should have been sitting. Furthermore, the war was not fully over: tens of thousands of British soldiers were still fighting and enduring brutal prisoner-of-war camps in the Pacific.'
    },
    {
      id: 'task_3',
      task_num: 3,
      type: 'living_history',
      topic: '3. Living History: Step Into Their Shoes',
      tag: 'Personal Experiences',
      question: 'Even though war ended in Europe, why did rationing of food and clothes continue in Britain until 1954?',
      starter: 'Even after victory was declared, strict rationing continued across Britain until 1954 because...',
      hints: [
        'Explain that Britain was nearly bankrupt after spending its national wealth on defence.',
        'Mention Britain\'s duty to send food supplies to feed starving, war-ravaged Europe.',
        'Note how rebuilding shattered cities took priority over importing consumer luxuries.'
      ],
      model_answer: 'Even after victory was declared, strict rationing continued across Britain until 1954 because the nation had poured its entire financial wealth into defeating Nazi Germany and was essentially bankrupt. Millions of homes and factories lay in ruins, global shipping was disrupted, and Britain committed to sending food aid to prevent starvation across liberated Europe. In fact, bread was even rationed in 1946—something that had never occurred during the war—meaning families had to wait nearly a decade for peacetime abundance.'
    },
    {
      id: 'task_4',
      task_num: 4,
      type: 'big_question',
      topic: '4. Mission Challenge • The Big Question',
      tag: 'Historian Challenge',
      question: 'Big Question: Why is it vital that we continue to remember the sacrifices and courage of the Second World War generation today?',
      starter: 'It is vital that modern generations continue to honour and remember the Second World War generation because...',
      hints: [
        'Reflect on the democratic freedoms, civil liberties, and human rights defended at great cost.',
        'Consider the lessons of resisting totalitarianism and protecting refugees.',
        'Conclude on the duty to pass these first-hand memories forward as living veterans pass away.'
      ],
      model_answer: 'It is vital that modern generations continue to honour and remember the Second World War generation because the democratic freedoms, peace, and human rights we enjoy today were purchased through their extraordinary endurance. From radar operators and codebreakers to soldiers on Normandy beaches and civilians in ruined cities, ordinary people united to defend human dignity against horrific tyranny. As the final eyewitnesses pass away, it becomes our solemn historical duty to carry their stories forward, ensuring that hatred and division are never allowed to rise again.'
    }
  ],

  // Lesson 11
  [
    {
      id: 'task_1',
      task_num: 1,
      type: 'source_clues',
      topic: '1. Primary Evidence Detective',
      tag: 'Source Clues',
      question: 'Look at the photograph of child survivors arriving in Cumbria. What details show the mixture of exhaustion and relief on their faces?',
      starter: 'Examining the photograph of the child survivors landing at RAF Crosby-on-Eden, the key details reveal...',
      hints: [
        'Notice their thin frames, oversized donated clothes, and fragile postures.',
        'Observe their watchful, cautious eyes after surviving concentration camps.',
        'Highlight the compassionate RAF airmen gently assisting them down the aircraft steps.'
      ],
      model_answer: 'Examining the photograph of child survivors landing at RAF Crosby-on-Eden in August 1945, the poignant details reveal profound physical trauma mingled with cautious relief. Emerging from heavy RAF Stirling bombers, the children appear gaunt, hollow-cheeked, and swallowed up by oversized donated British coats. Yet in their cautious eyes, one can see the very first glimmer of safety as gentle British airmen and nurses assist them down the aircraft steps into a land where no one was shouting or threatening them with violence.'
    },
    {
      id: 'task_2',
      task_num: 2,
      type: 'historical_explanation',
      topic: '2. Historical Explanation',
      tag: 'Cause & Effect',
      question: 'Explain the difference between how children on the Kindertransport (1938–39) and the Windermere Children (1945) arrived in Britain, and why both groups needed help.',
      starter: 'The children on the Kindertransport and the Windermere Children arrived under very different circumstances because...',
      hints: [
        'Contrast pre-war railway rescue from homes with post-liberation air transport from concentration camps.',
        'Explain that Kindertransport children arrived with packed suitcases; Windermere children arrived in camp rags.',
        'Conclude why both groups required safety, medical care, and psychological sanctuary.'
      ],
      model_answer: 'The children on the Kindertransport and the Windermere Children arrived under very different circumstances because of the timeline of the war. The 10,000 Kindertransport refugees arrived in 1938–39 before the fighting started, travelling by train with small suitcases and luggage labels to foster families. In contrast, the 300 Windermere Children were liberated survivor orphans flown in military aircraft directly from concentration camps like Theresienstadt in August 1945. Both groups required compassionate sanctuary because both had been targeted for murder by the Nazi regime and lost everything.'
    },
    {
      id: 'task_3',
      task_num: 3,
      type: 'living_history',
      topic: '3. Living History: Step Into Their Shoes',
      tag: 'Personal Experiences',
      question: 'Imagine arriving at Lake Windermere after years of trauma in concentration camps. How would having your own clean bed and a red bicycle feel?',
      starter: 'Arriving at the peaceful Calgarth Estate by Lake Windermere after years of camp starvation would feel...',
      hints: [
        'Describe the initial disbelief: hiding bread under pillows because you feared food would vanish.',
        'Reflect on the profound joy of riding a red bicycle and swimming in fresh lake waters.',
        'Highlight the life-saving psychological impact of unconditional kindness and clean sheets.'
      ],
      model_answer: 'Arriving at the peaceful Calgarth Estate by Lake Windermere after years of camp starvation would feel like waking up in a miraculous dream that you were terrified might end. At first, children were so traumatised they hid bread rolls under their mattresses, unable to believe breakfast would still be served tomorrow. But feeling soft, clean sheets, receiving patient smiles from Dr Oscar Friedman, swimming in the blue waters of Lake Windermere, and riding donated red bicycles restored their stolen childhoods and proved that human warmth still existed.'
    },
    {
      id: 'task_4',
      task_num: 4,
      type: 'big_question',
      topic: '4. Mission Challenge • The Big Question',
      tag: 'Historian Challenge',
      question: 'Big Question: What does the story of the Windermere Children teach us about human compassion, recovery, and hope after the Second World War?',
      starter: 'The remarkable recovery of the Windermere Children provides an enduring lesson about human resilience, compassion, and hope because...',
      hints: [
        'Show how love, patient therapy, nature, and community healed deep trauma.',
        'Emphasize that these 300 orphans became British citizens, doctors, teachers, and grandparents.',
        'Conclude that compassion has the power to rebuild lives after the deepest darkness.'
      ],
      model_answer: 'The remarkable recovery of the Windermere Children provides an enduring lesson that even after the deepest imaginable trauma, human beings can heal through compassion, friendship, and patience. Brought to the tranquil shores of Lake Windermere, these 300 child survivors were not treated as broken victims, but were nurtured with unconditional kindness, medical care, and the freedom to play and learn. Against all odds, they formed a lifelong family of brothers and sisters, going on to build flourishing families, careers, and contributions in Britain, proving that love and life will always triumph over hate.'
    }
  ]
];

function run() {
  console.log('🚀 Enriching KS2 WW2 with complete 4-Task Disciplinary Writing suite...');

  const dataPath = path.join(__dirname, '..', 'data', 'ks2_ww2.json');
  const pubDataPath = path.join(__dirname, '..', 'public', 'data', 'ks2_ww2.json');
  const unitsDataPath = path.join(__dirname, '..', 'units', 'ks2_ww2', 'data.js');

  const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  raw.lessons.forEach((lesson, idx) => {
    if (idx < KS2_TASKS.length) {
      lesson.tasks = KS2_TASKS[idx];
      console.log(`✅ Lesson ${idx + 1} (${lesson.id}) updated with 4 tasks.`);
    }
  });

  const updatedJson = JSON.stringify(raw, null, 2);
  fs.writeFileSync(dataPath, updatedJson, 'utf8');
  fs.writeFileSync(pubDataPath, updatedJson, 'utf8');

  // Also sync units/ks2_ww2/data.js
  const unitsDataJs = `window.ks2Ww2Data = ${updatedJson};\nif (typeof module !== 'undefined') { module.exports = window.ks2Ww2Data; }`;
  fs.writeFileSync(unitsDataPath, unitsDataJs, 'utf8');

  console.log('✨ Successfully synced data/ks2_ww2.json, public/data/ks2_ww2.json, and units/ks2_ww2/data.js!');
}

run();

