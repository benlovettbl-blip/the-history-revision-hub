const fs = require('fs');

// 6 Narrative Accounts (strictly 165-185 words, 3 chronological phases with causal connectives)
// 6 Importance Questions (strictly 165-185 words, 2 distinct explanatory aspects with importance links)

const narrative_8 = {
  // L1 Q3: Superpower relations during WWII (1941-1944)
  "cw_1_3": {
    top: `The Grand Alliance was established out of practical military necessity following Operation Barbarossa in June 1941 and the Japanese attack on Pearl Harbor in December 1941. To keep the Soviet Red Army fighting against Nazi Germany, the United States immediately extended billions of dollars in vital industrial, transport, and military supplies through the Lend-Lease programme.<br><br>However, acute diplomatic friction arose over the timing of a 'second front' in Western Europe. Joseph Stalin repeatedly demanded an immediate Allied amphibious invasion of northern France to relieve catastrophic pressure on the Eastern Front. Instead, Winston Churchill persuaded Franklin D. Roosevelt to prioritise campaigns in North Africa and Italy, a delay that Stalin deeply resented, suspecting the West intended to let Germany and Russia exhaust each other.<br><br>This strategic tension was finally resolved at the Tehran Conference in November 1943, where the 'Big Three' met face-to-face. Roosevelt and Churchill formally guaranteed the launch of Operation Overlord by May 1944, while Stalin pledged to coordinate a massive eastern summer offensive. Consequently, this decisive agreement preserved the Grand Alliance, ensuring coordinated military victory over Germany despite deep ideological suspicion.`,
    tiers: [
      {
        level: "Level 1",
        marks: "1–2 marks",
        title: "Level 1 (1–2 Marks)",
        badge: "Simple Narrative",
        commentary: "Provides a brief, simple description of wartime events without establishing a clear chronological chain of causation or linkage.",
        text: `During the Second World War the USA and USSR were allies against Hitler. America sent supplies to Russia under Lend-Lease to help them fight. However, Stalin was angry because Britain and America would not invade France straight away to open a second front. They met at Tehran in 1943 and agreed to invade France in 1944, which kept the alliance going.`
      },
      {
        level: "Level 2",
        marks: "3–5 marks",
        title: "Level 2 (3–5 Marks)",
        badge: "Descriptive Narrative",
        commentary: "Provides a narrative with good chronological order and accurate factual detail, but causal linkages between the phases remain implicit rather than fully analysed.",
        text: `Superpower relations began when Germany invaded Russia and Japan attacked Pearl Harbor in 1941, bringing the US and USSR into the Grand Alliance. The USA gave massive aid through Lend-Lease.<br><br>Relations became strained because Stalin wanted an immediate second front in France to take pressure off the Red Army. Churchill delayed this by attacking Italy first, which made Stalin suspect the Western Allies wanted the USSR to suffer heavy casualties.<br><br>Finally, at Tehran in 1943, the leaders met and agreed that Operation Overlord would take place in May 1944. This resolved the second front dispute and allowed the Allies to coordinate their attacks to defeat Germany.`
      },
      {
        level: "Level 3",
        marks: "6–8 marks",
        title: "Level 3 (6–8 Marks)",
        badge: "Level 3 Top (Pearson Exam Standard)",
        commentary: "Produces an exceptional, coherent narrative account analysing the beginning, development, and outcome with explicit causal connectives and precise historical knowledge.",
        text: `The Grand Alliance was established out of practical military necessity following Operation Barbarossa in June 1941 and the Japanese attack on Pearl Harbor in December 1941. To keep the Soviet Red Army fighting against Nazi Germany, the United States immediately extended billions of dollars in vital industrial, transport, and military supplies through the Lend-Lease programme.<br><br>However, acute diplomatic friction arose over the timing of a 'second front' in Western Europe. Joseph Stalin repeatedly demanded an immediate Allied amphibious invasion of northern France to relieve catastrophic pressure on the Eastern Front. Instead, Winston Churchill persuaded Franklin D. Roosevelt to prioritise campaigns in North Africa and Italy, a delay that Stalin deeply resented, suspecting the West intended to let Germany and Russia exhaust each other.<br><br>This strategic tension was finally resolved at the Tehran Conference in November 1943, where the 'Big Three' met face-to-face. Roosevelt and Churchill formally guaranteed the launch of Operation Overlord by May 1944, while Stalin pledged to coordinate a massive eastern summer offensive. Consequently, this decisive agreement preserved the Grand Alliance, ensuring coordinated military victory over Germany despite deep ideological suspicion.`
      }
    ]
  },

  // L2 Q3: Breakdown of the Grand Alliance between Feb 1945 and Aug 1945
  "cw_2_3": {
    top: `The breakdown of the Grand Alliance began at the Yalta Conference in February 1945, where apparent wartime unity masked profound post-war disagreements. Although the leaders signed the Declaration on Liberated Europe promising free elections, Joseph Stalin prioritised creating a pro-Soviet buffer zone in Poland. Within weeks, the Red Army consolidated political control across Eastern Europe, arresting non-communist leaders and triggering acute Western alarm.<br><br>This breakdown accelerated rapidly in the spring of 1945 due to critical changes in leadership and economic policy. Following Franklin D. Roosevelt's death in April, the anti-communist Harry S. Truman became US President. Truman adopted an aggressive diplomatic stance, openly confronting Soviet Foreign Minister Molotov. Furthermore, Truman abruptly terminated Lend-Lease shipments upon Germany's surrender in May, convincing Moscow that Washington was using economic coercion against the USSR.<br><br>The final collapse culminated at the Potsdam Conference in July–August 1945. Relations soured over German reparations and borders. Crucially, Truman received news of the successful Trinity atomic bomb test during the conference, emboldening his refusal of Soviet demands. Consequently, the detonation of US atomic bombs over Japan days later cemented permanent superpower mistrust.`
    ,
    tiers: [
      {
        level: "Level 1",
        marks: "1–2 marks",
        title: "Level 1 (1–2 Marks)",
        badge: "Simple Narrative",
        commentary: "Presents a simple outline of events between Yalta and Potsdam without developing causal connections between diplomatic friction and the eventual breakdown.",
        text: `The Grand Alliance broke down in 1945. At Yalta in February, the leaders agreed on free elections, but Stalin set up communist governments in Poland anyway. Then Roosevelt died and Truman became President, and he was much harsher towards Russia. Finally at Potsdam in July they argued over reparations, and America tested the atomic bomb, which ended the alliance.`
      },
      {
        level: "Level 2",
        marks: "3–5 marks",
        title: "Level 2 (3–5 Marks)",
        badge: "Descriptive Narrative",
        commentary: "Narrates the key conferences with accurate detail, but links between the steps are partly descriptive rather than analytically sustained.",
        text: `The breakdown began at Yalta in February 1945. Although the Big Three agreed to divide Germany and promised free elections, Stalin took control of Poland to create a buffer zone, which angered the West.<br><br>Tensions increased in April when Truman became US President following Roosevelt's death. Truman was strongly anti-communist and took a hard line against Molotov. He also stopped Lend-Lease aid to Russia once the war in Europe ended.<br><br>At Potsdam in July, the leaders clashed over reparations. Truman learned that the US had successfully tested the atomic bomb, making him much less willing to compromise with Stalin. As a result, the Grand Alliance ended in suspicion.`
      },
      {
        level: "Level 3",
        marks: "6–8 marks",
        title: "Level 3 (6–8 Marks)",
        badge: "Level 3 Top (Pearson Exam Standard)",
        commentary: "Masterful narrative account clearly tracing the beginning, development, and outcome with analytical links demonstrating how mistrust escalated into formal breakdown.",
        text: `The breakdown of the Grand Alliance began at the Yalta Conference in February 1945, where apparent wartime unity masked profound post-war disagreements. Although the leaders signed the Declaration on Liberated Europe promising free elections, Joseph Stalin prioritised creating a pro-Soviet buffer zone in Poland. Within weeks, the Red Army consolidated political control across Eastern Europe, arresting non-communist leaders and triggering acute Western alarm.<br><br>This breakdown accelerated rapidly in the spring of 1945 due to critical changes in leadership and economic policy. Following Franklin D. Roosevelt's death in April, the anti-communist Harry S. Truman became US President. Truman adopted an aggressive diplomatic stance, openly confronting Soviet Foreign Minister Molotov. Furthermore, Truman abruptly terminated Lend-Lease shipments upon Germany's surrender in May, convincing Moscow that Washington was using economic coercion against the USSR.<br><br>The final collapse culminated at the Potsdam Conference in July–August 1945. Relations soured over German reparations and borders. Crucially, Truman received news of the successful Trinity atomic bomb test during the conference, emboldening his refusal of Soviet demands. Consequently, the detonation of US atomic bombs over Japan days later cemented permanent superpower mistrust.`
      }
    ]
  },

  // L3 Q3: Berlin Crisis of 1948-1949
  "cw_3_3": {
    top: `The Berlin Crisis began in early 1948 as Western powers took decisive steps to rebuild their occupation zones into a viable capitalist state. In March 1948, Britain and the United States merged their zones into Bizonia and introduced the new Deutschmark currency to stimulate recovery. Joseph Stalin viewed this economic revival, alongside the introduction of the currency into West Berlin deep inside Soviet territory, as a direct threat to Soviet security.<br><br>In response, Stalin launched the Berlin Blockade in June 1948, severing all road, rail, and canal routes between West Germany and West Berlin to starve the two million inhabitants into submission. Refusing to withdraw or initiate military conflict, President Truman and Britain launched Operation Plainfare, a massive around-the-clock aerial resupply operation that flew over 2.3 million tons of food, medicine, and coal into Tempelhof Airport for eleven months.<br><br>Recognising that the airlift had decisively defeated his economic siege without provoking war, Stalin lifted the blockade in May 1949. Consequently, the crisis formalised the political division of Germany into the FRG and GDR, accelerating the military alliance of NATO.`
    ,
    tiers: [
      {
        level: "Level 1",
        marks: "1–2 marks",
        title: "Level 1 (1–2 Marks)",
        badge: "Simple Narrative",
        commentary: "Outlines basic facts of the blockade and airlift without establishing the causal sequence between Western currency reform, Soviet blockade, and military outcomes.",
        text: `The Berlin Crisis started when the West created a new currency in West Berlin. Stalin got angry and blocked all roads and railways to the city to starve it out. The Americans and British responded with the Berlin Airlift, flying in food and coal for nearly a year. Stalin had to give up and reopen the roads in 1949.`
      },
      {
        level: "Level 2",
        marks: "3–5 marks",
        title: "Level 2 (3–5 Marks)",
        badge: "Descriptive Narrative",
        commentary: "Provides a well-sequenced narrative of the crisis with good factual recall, but treats events as separate episodes rather than an integrated causal chain.",
        text: `The crisis began when Britain and the USA merged zones into Bizonia and introduced the Deutschmark in 1948. Stalin saw this as an attempt to create a separate West German state and rejected the currency in Berlin.<br><br>In June 1948, Stalin cut off all surface access to West Berlin to force the Western Allies out. Instead of fighting their way in, Truman and Attlee launched the Berlin Airlift, flying thousands of tons of supplies into West Berlin every day.<br><br>The airlift was a huge success and showed Western determination. Stalin was forced to lift the blockade in May 1949. This resulted in the permanent division of Germany into two rival countries and led to NATO.`
      },
      {
        level: "Level 3",
        marks: "6–8 marks",
        title: "Level 3 (6–8 Marks)",
        badge: "Level 3 Top (Pearson Exam Standard)",
        commentary: "Exemplary narrative showing clear chronological progression, sophisticated causal reasoning, and precise factual knowledge of the causes, execution, and outcomes.",
        text: `The Berlin Crisis began in early 1948 as Western powers took decisive steps to rebuild their occupation zones into a viable capitalist state. In March 1948, Britain and the United States merged their zones into Bizonia and introduced the new Deutschmark currency to stimulate recovery. Joseph Stalin viewed this economic revival, alongside the introduction of the currency into West Berlin deep inside Soviet territory, as a direct threat to Soviet security.<br><br>In response, Stalin launched the Berlin Blockade in June 1948, severing all road, rail, and canal routes between West Germany and West Berlin to starve the two million inhabitants into submission. Refusing to withdraw or initiate military conflict, President Truman and Britain launched Operation Plainfare, a massive around-the-clock aerial resupply operation that flew over 2.3 million tons of food, medicine, and coal into Tempelhof Airport for eleven months.<br><br>Recognising that the airlift had decisively defeated his economic siege without provoking war, Stalin lifted the blockade in May 1949. Consequently, the crisis formalised the political division of Germany into the FRG and GDR, accelerating the military alliance of NATO.`
      }
    ]
  },

  // L4 Q3: Cuban Missile Crisis in October 1962
  "cw_4_3": {
    top: `The Cuban Missile Crisis began on 14 October 1962 when an American U-2 spy plane photographed Soviet R-12 medium-range ballistic missile launch pads under construction in San Cristóbal, Cuba. Having secretly allied with Fidel Castro after the failed Bay of Pigs invasion, Nikita Khrushchev deployed nuclear missiles just ninety miles from Florida to redress America's strategic missile superiority and deter another US invasion of Cuba.<br><br>This provocation triggered intense deliberation within President John F. Kennedy's executive committee (ExComm). Rejecting military demands for an immediate air strike, Kennedy announced a naval 'quarantine' on 22 October, deploying US warships to intercept Soviet vessels carrying military cargo and placing American strategic nuclear forces on DEFCON 2. For six days, superpower forces confronted each other at sea while Khrushchev sent conflicting diplomatic letters.<br><br>The crisis was finally resolved through secret backchannel diplomacy between Robert Kennedy and Anatoly Dobrynin. Kennedy publicly pledged not to invade Cuba, while privately agreeing to withdraw American Jupiter missiles from Turkey in exchange for Khrushchev dismantling the Cuban sites. Consequently, this peaceful resolution averted nuclear war and established the direct Moscow-Washington hotline.`
    ,
    tiers: [
      {
        level: "Level 1",
        marks: "1–2 marks",
        title: "Level 1 (1–2 Marks)",
        badge: "Simple Narrative",
        commentary: "Presents a simple outline of the 13 days without clear causal connections linking the discovery of missiles to the naval blockade and the secret deal.",
        text: `The crisis began when American U-2 planes found nuclear missiles in Cuba. Kennedy decided to put a naval blockade around Cuba to stop Soviet ships. For several days the world was close to nuclear war. Finally Khrushchev agreed to remove the missiles if the US promised not to invade Cuba, and the crisis ended peacefully.`
      },
      {
        level: "Level 2",
        marks: "3–5 marks",
        title: "Level 2 (3–5 Marks)",
        badge: "Descriptive Narrative",
        commentary: "Narrates the main events accurately in chronological order, but the analysis of how ExComm's decisions led to the settlement is descriptive.",
        text: `In October 1962, US spy planes took photos showing Soviet nuclear missile sites in Cuba. Khrushchev had sent them to protect Cuba and balance American missiles in Europe.<br><br>Kennedy set up ExComm and chose a naval quarantine instead of bombing Cuba. He demanded that Soviet ships turn back and that missiles be removed. Soviet ships stopped at the blockade line, preventing immediate conflict.<br><br>Khrushchev agreed to dismantle the missiles if Kennedy promised not to invade Cuba, and secretly removed US missiles from Turkey. Consequently, the crisis ended and both leaders realised they needed better communication, creating the Moscow hotline.`
      },
      {
        level: "Level 3",
        marks: "6–8 marks",
        title: "Level 3 (6–8 Marks)",
        badge: "Level 3 Top (Pearson Exam Standard)",
        commentary: "Outstanding chronological narrative linking the discovery, naval blockade, and secret diplomacy with precise terminology and explicit causal connectives.",
        text: `The Cuban Missile Crisis began on 14 October 1962 when an American U-2 spy plane photographed Soviet R-12 medium-range ballistic missile launch pads under construction in San Cristóbal, Cuba. Having secretly allied with Fidel Castro after the failed Bay of Pigs invasion, Nikita Khrushchev deployed nuclear missiles just ninety miles from Florida to redress America's strategic missile superiority and deter another US invasion of Cuba.<br><br>This provocation triggered intense deliberation within President John F. Kennedy's executive committee (ExComm). Rejecting military demands for an immediate air strike, Kennedy announced a naval 'quarantine' on 22 October, deploying US warships to intercept Soviet vessels carrying military cargo and placing American strategic nuclear forces on DEFCON 2. For six days, superpower forces confronted each other at sea while Khrushchev sent conflicting diplomatic letters.<br><br>The crisis was finally resolved through secret backchannel diplomacy between Robert Kennedy and Anatoly Dobrynin. Kennedy publicly pledged not to invade Cuba, while privately agreeing to withdraw American Jupiter missiles from Turkey in exchange for Khrushchev dismantling the Cuban sites. Consequently, this peaceful resolution averted nuclear war and established the direct Moscow-Washington hotline.`
      }
    ]
  },

  // L5 Q3: American military escalation in Vietnam (1964-1968)
  "cw_5_3": {
    top: `American military escalation in Vietnam began in August 1964 with the Gulf of Tonkin incident. Following alleged North Vietnamese torpedo attacks on US destroyers, President Lyndon B. Johnson secured the Gulf of Tonkin Resolution from Congress, granting him full constitutional authority to wage war in Southeast Asia without an official congressional declaration, laying the legal foundation for direct intervention.<br><br>This authorization led to rapid military escalation between 1965 and 1967. In February 1965, following Vietcong attacks on American bases at Pleiku, Johnson launched Operation Rolling Thunder, a relentless three-year bombing campaign against North Vietnamese infrastructure. Simultaneously, General William Westmoreland committed the first combat ground troops at Da Nang in March 1965. US troop levels rapidly surged from 184,000 in 1965 to over 500,000 by 1968, conducting brutal 'search and destroy' missions with napalm and Agent Orange.<br><br>This aggressive expansion culminated in the devastating Tet Offensive of January 1968. Although communist forces suffered massive military losses, graphic television coverage shattered White House claims of imminent victory. Consequently, public support collapsed, forcing Johnson to halt escalation and initiate peace negotiations.`
    ,
    tiers: [
      {
        level: "Level 1",
        marks: "1–2 marks",
        title: "Level 1 (1–2 Marks)",
        badge: "Simple Narrative",
        commentary: "Provides basic descriptive points about US involvement in Vietnam without establishing the causal steps connecting Tonkin, Rolling Thunder, and Tet.",
        text: `Escalation started after the Gulf of Tonkin incident in 1964, which let President Johnson send troops. He started bombing North Vietnam in Operation Rolling Thunder and sent thousands of soldiers to fight the Vietcong. By 1968 there were over 500,000 troops. Then the Tet Offensive happened, showing America was not winning, so Johnson had to stop escalating.`
      },
      {
        level: "Level 2",
        marks: "3–5 marks",
        title: "Level 2 (3–5 Marks)",
        badge: "Descriptive Narrative",
        commentary: "Sequences the main phases of escalation with accurate knowledge of bombing and troop deployments, but lacks sustained analytical explanation of the outcome.",
        text: `The escalation began with the Gulf of Tonkin incident in 1964. Congress passed the Tonkin Resolution, allowing President Johnson to use military force in Vietnam.<br><br>In 1965, Johnson escalated the war by starting Operation Rolling Thunder, bombing North Vietnam. He also landed the first combat troops at Da Nang. General Westmoreland used search and destroy tactics, and troop numbers grew to half a million by 1968.<br><br>The turning point was the Tet Offensive in January 1968. The Vietcong attacked South Vietnamese cities. Even though the US won militarily, American public opinion turned against the war, forcing Johnson to seek peace talks.`
      },
      {
        level: "Level 3",
        marks: "6–8 marks",
        title: "Level 3 (6–8 Marks)",
        badge: "Level 3 Top (Pearson Exam Standard)",
        commentary: "Comprehensive narrative linking the legal trigger, military expansion, and political fallout of Tet with clear causal connectives and exact statistics.",
        text: `American military escalation in Vietnam began in August 1964 with the Gulf of Tonkin incident. Following alleged North Vietnamese torpedo attacks on US destroyers, President Lyndon B. Johnson secured the Gulf of Tonkin Resolution from Congress, granting him full constitutional authority to wage war in Southeast Asia without an official congressional declaration, laying the legal foundation for direct intervention.<br><br>This authorization led to rapid military escalation between 1965 and 1967. In February 1965, following Vietcong attacks on American bases at Pleiku, Johnson launched Operation Rolling Thunder, a relentless three-year bombing campaign against North Vietnamese infrastructure. Simultaneously, General William Westmoreland committed the first combat ground troops at Da Nang in March 1965. US troop levels rapidly surged from 184,000 in 1965 to over 500,000 by 1968, conducting brutal 'search and destroy' missions with napalm and Agent Orange.<br><br>This aggressive expansion culminated in the devastating Tet Offensive of January 1968. Although communist forces suffered massive military losses, graphic television coverage shattered White House claims of imminent victory. Consequently, public support collapsed, forcing Johnson to halt escalation and initiate peace negotiations.`
      }
    ]
  },

  // L6 Q3: Collapse of Soviet control in Eastern Europe (1988-1990)
  "cw_6_3": {
    top: `The collapse of Soviet control began in December 1988 when Mikhail Gorbachev delivered a historic United Nations address abandoning the Brezhnev Doctrine. Gorbachev announced that the USSR would withdraw 500,000 troops from Eastern Europe, effectively establishing the 'Sinatra Doctrine' which granted satellite nations the sovereign right to determine their own internal politics without fearing Soviet military invasion.<br><br>This sudden ideological retreat unleashed irresistible democratic revolutions throughout 1989. In Poland, the previously banned Solidarity trade union won an overwhelming landslide in semi-free elections, leading Tadeusz Mazowiecki to form Eastern Europe's first non-communist government in August. Simultaneously, Hungary dismantled its barbed-wire border with Austria, creating an escape route for thousands of East Germans. When East German authorities mistakenly announced immediate travel concessions on 9 November 1989, ecstatic crowds dismantled the Berlin Wall entirely unchecked by Soviet border guards.<br><br>The domino effect spread rapidly across Czechoslovakia and Romania by late 1989. Consequently, with the Warsaw Pact rendered completely defunct, Germany achieved formal reunification in October 1990, peacefully extinguishing Soviet domination over Central Europe.`
    ,
    tiers: [
      {
        level: "Level 1",
        marks: "1–2 marks",
        title: "Level 1 (1–2 Marks)",
        badge: "Simple Narrative",
        commentary: "Simple outline of the fall of communism without tracing the causal sequence from Gorbachev's reforms to the collapse of the satellite regimes.",
        text: `Soviet control collapsed because Gorbachev said the Red Army would not stop reforms in Eastern Europe. In 1989 Poland held free elections and elected a non-communist government. Then Hungary opened its border, and East Germans fled. People tore down the Berlin Wall in November 1989. Soon all communist governments in Eastern Europe fell and Germany reunited.`
      },
      {
        level: "Level 2",
        marks: "3–5 marks",
        title: "Level 2 (3–5 Marks)",
        badge: "Descriptive Narrative",
        commentary: "Narrates the key turning points in Poland, Hungary, and East Germany in order, but the causal connections between events remain partially descriptive.",
        text: `The collapse began when Gorbachev abandoned the Brezhnev Doctrine in 1988, telling Eastern European countries they could choose their own path without fear of Soviet tanks.<br><br>This encouraged opposition movements. In Poland, Solidarity won free elections in 1989 and formed a non-communist government. Hungary opened its border with Austria, letting thousands of East Germans escape to the West. This pressure led to the fall of the Berlin Wall in November 1989 when crowds stormed the checkpoints.<br><br>Revolutions followed across Czechoslovakia and Romania. Consequently, the communist regimes collapsed and Germany was officially reunited in October 1990, ending Soviet control in Europe.`
      },
      {
        level: "Level 3",
        marks: "6–8 marks",
        title: "Level 3 (6–8 Marks)",
        badge: "Level 3 Top (Pearson Exam Standard)",
        commentary: "Masterful narrative account clearly tracing the beginning, development, and outcome with precise historical evidence and seamless causal connectives.",
        text: `The collapse of Soviet control began in December 1988 when Mikhail Gorbachev delivered a historic United Nations address abandoning the Brezhnev Doctrine. Gorbachev announced that the USSR would withdraw 500,000 troops from Eastern Europe, effectively establishing the 'Sinatra Doctrine' which granted satellite nations the sovereign right to determine their own internal politics without fearing Soviet military invasion.<br><br>This sudden ideological retreat unleashed irresistible democratic revolutions throughout 1989. In Poland, the previously banned Solidarity trade union won an overwhelming landslide in semi-free elections, leading Tadeusz Mazowiecki to form Eastern Europe's first non-communist government in August. Simultaneously, Hungary dismantled its barbed-wire border with Austria, creating an escape route for thousands of East Germans. When East German authorities mistakenly announced immediate travel concessions on 9 November 1989, ecstatic crowds dismantled the Berlin Wall entirely unchecked by Soviet border guards.<br><br>The domino effect spread rapidly across Czechoslovakia and Romania by late 1989. Consequently, with the Warsaw Pact rendered completely defunct, Germany achieved formal reunification in October 1990, peacefully extinguishing Soviet domination over Central Europe.`
      }
    ]
  }
};

const importance_8 = {
  // L3 Q4: Formation of NATO (1949)
  "cw_3_4": {
    top: `The formation of NATO in April 1949 was important for superpower relations because it established a permanent, US-led collective military alliance that formally ended American isolationism in Europe. Prompted by the Berlin Blockade and the 1948 Czechoslovakian coup, twelve Western nations signed the Washington Treaty, underpinned by Article 5, which declared that an attack against one member was an attack against all. By committing American nuclear and conventional forces to Western Europe, NATO deterred Soviet expansion and cemented the geopolitical division of the continent into hostile armed blocs.<br><br>Furthermore, NATO was important because it provoked an institutionalised military counter-response from the Soviet Union, accelerating the Cold War arms race. Joseph Stalin viewed NATO as an aggressive coalition designed to encircle the USSR. When West Germany was admitted to NATO and rearmed in May 1955, the Soviet Union immediately formed the Warsaw Pact, formalising its own military alliance with seven Eastern European satellite states. Therefore, NATO was critically important because it transformed ideological rivalry into a permanent, highly militarised confrontation between two opposing alliance systems.`
    ,
    tiers: [
      {
        level: "Level 1",
        marks: "1–2 marks",
        title: "Level 1 (1–2 Marks)",
        badge: "Simple Identification",
        commentary: "Identifies basic aspects of NATO without explaining in depth its specific importance for superpower relations and the militarisation of the Cold War.",
        text: `NATO was important because it was a military alliance set up by the USA and Western countries in 1949. It meant if one country was attacked, all the others would help. This stopped Stalin taking over more of Europe. Later on, Russia made the Warsaw Pact to oppose NATO, which split Europe in two.`
      },
      {
        level: "Level 2",
        marks: "3–5 marks",
        title: "Level 2 (3–5 Marks)",
        badge: "Descriptive Explanation",
        commentary: "Explains one or two reasons why NATO was important with relevant historical context, but lacks sustained analytical depth or explicit evaluative links.",
        text: `NATO was important because it committed the USA to defending Western Europe after the Berlin Blockade. Under Article 5, an attack on one member was seen as an attack on all. This gave Western Europe American military protection and deterred Soviet aggression.<br><br>It was also important because it made the USSR feel threatened. When West Germany joined NATO in 1955, the Soviet Union responded by creating the Warsaw Pact with its satellite states. This meant Europe was divided into two armed military camps, increasing Cold War tensions.`
      },
      {
        level: "Level 3",
        marks: "6–8 marks",
        title: "Level 3 (6–8 Marks)",
        badge: "Level 3 Top (Pearson Exam Standard)",
        commentary: "Provides a sustained, focused explanation of two distinct aspects of importance with precise factual support and explicit analytical links to superpower relations.",
        text: `The formation of NATO in April 1949 was important for superpower relations because it established a permanent, US-led collective military alliance that formally ended American isolationism in Europe. Prompted by the Berlin Blockade and the 1948 Czechoslovakian coup, twelve Western nations signed the Washington Treaty, underpinned by Article 5, which declared that an attack against one member was an attack against all. By committing American nuclear and conventional forces to Western Europe, NATO deterred Soviet expansion and cemented the geopolitical division of the continent into hostile armed blocs.<br><br>Furthermore, NATO was important because it provoked an institutionalised military counter-response from the Soviet Union, accelerating the Cold War arms race. Joseph Stalin viewed NATO as an aggressive coalition designed to encircle the USSR. When West Germany was admitted to NATO and rearmed in May 1955, the Soviet Union immediately formed the Warsaw Pact, formalising its own military alliance with seven Eastern European satellite states. Therefore, NATO was critically important because it transformed ideological rivalry into a permanent, highly militarised confrontation between two opposing alliance systems.`
      }
    ]
  },

  // L4 Q4: Cuban Missile Crisis (1962)
  "cw_4_4": {
    top: `The Cuban Missile Crisis of October 1962 was critically important for superpower relations because it brought the superpowers to the very precipice of thermonuclear destruction, compelling both leaders to recognise the mortal danger of brinkmanship. Having discovered Soviet ballistic missiles in Cuba, President Kennedy imposed a naval quarantine while Premier Khrushchev readied strategic forces. Confronted with the reality that an accidental clash could trigger global devastation, both leaders negotiated a peaceful compromise. Consequently, this near-catastrophe shattered their illusion that nuclear weapons could be deployed for diplomatic intimidation.<br><br>Furthermore, the crisis was important because it initiated a constructive era of institutionalized crisis management and nuclear arms limitation. Recognising that communication delays had nearly caused accidental war, the superpowers installed the direct Washington-Moscow 'Hotline' in June 1963 to facilitate rapid presidential dialogue during emergencies. In August 1963, they also signed the Partial Test Ban Treaty, prohibiting atmospheric and underwater nuclear testing. Therefore, the Cuban Missile Crisis was profoundly important because it catalysed the initial thaw in superpower hostility, directly laying the foundations for the détente of the 1970s.`
    ,
    tiers: [
      {
        level: "Level 1",
        marks: "1–2 marks",
        title: "Level 1 (1–2 Marks)",
        badge: "Simple Identification",
        commentary: "Identifies basic outcomes of the crisis without explaining in depth how brinkmanship compelled both leaders to change their diplomatic approaches.",
        text: `The Cuban Missile Crisis was important because it was the closest the world came to nuclear war. Kennedy and Khrushchev both got very scared of destroying each other. Afterwards they set up the hotline telephone between Washington and Moscow so they could talk directly, and they signed the Partial Test Ban Treaty to limit nuclear tests.`
      },
      {
        level: "Level 2",
        marks: "3–5 marks",
        title: "Level 2 (3–5 Marks)",
        badge: "Descriptive Explanation",
        commentary: "Explains the significance of avoiding war and the creation of communication treaties, but the analytical links regarding long-term relations remain basic.",
        text: `The Cuban Missile Crisis was important because it showed both superpowers how dangerous nuclear brinkmanship was. Having come so close to nuclear war, both Kennedy and Khrushchev were shocked by the danger and became more cautious about threatening each other with nuclear weapons.<br><br>It was also important because it led to practical steps to improve relations. In 1963, they created the Moscow-Washington hotline so leaders could communicate instantly in an emergency. They also signed the Test Ban Treaty, stopping nuclear tests in the air. This helped reduce tensions and started détente.`
      },
      {
        level: "Level 3",
        marks: "6–8 marks",
        title: "Level 3 (6–8 Marks)",
        badge: "Level 3 Top (Pearson Exam Standard)",
        commentary: "Sustained, analytically rigorous explanation analysing two distinct dimensions of importance: the shift away from brinkmanship and the institutionalisation of arms control.",
        text: `The Cuban Missile Crisis of October 1962 was critically important for superpower relations because it brought the superpowers to the very precipice of thermonuclear destruction, compelling both leaders to recognise the mortal danger of brinkmanship. Having discovered Soviet ballistic missiles in Cuba, President Kennedy imposed a naval quarantine while Premier Khrushchev readied strategic forces. Confronted with the reality that an accidental clash could trigger global devastation, both leaders negotiated a peaceful compromise. Consequently, this near-catastrophe shattered their illusion that nuclear weapons could be deployed for diplomatic intimidation.<br><br>Furthermore, the crisis was important because it initiated a constructive era of institutionalized crisis management and nuclear arms limitation. Recognising that communication delays had nearly caused accidental war, the superpowers installed the direct Washington-Moscow 'Hotline' in June 1963 to facilitate rapid presidential dialogue during emergencies. In August 1963, they also signed the Partial Test Ban Treaty, prohibiting atmospheric and underwater nuclear testing. Therefore, the Cuban Missile Crisis was profoundly important because it catalysed the initial thaw in superpower hostility, directly laying the foundations for the détente of the 1970s.`
      }
    ]
  },

  // L5 Q4: Domino Theory in Asia
  "cw_5_4": {
    top: `The Domino Theory was critically important for American foreign policy in Asia because it provided the core ideological justification for expanding containment into Southeast Asia. Articulated by President Eisenhower in 1954, the theory posited that if one nation fell to communism—such as Indochina—neighbouring states like Thailand, Burma, and Malaysia would inexorably topple like falling dominoes. By framing regional insurgencies as coordinated Soviet-Chinese expansion, this doctrine convinced American policymakers that defending South Vietnam was essential to safeguarding capitalist trade routes and American credibility in the Pacific.<br><br>Furthermore, the Domino Theory was important because it directly propelled incremental US military escalation from financial aid into a massive conventional ground war. Operating under the conviction that communist victory in Vietnam would destabilise all of Asia, Presidents Kennedy and Johnson expanded commitments. Kennedy deployed 16,000 military advisers, while Johnson used the Gulf of Tonkin Resolution to dispatch over 500,000 combat troops and launch Operation Rolling Thunder. Therefore, the Domino Theory was decisive because it locked Washington into an open-ended, unwinnable military intervention that cost 58,000 American lives.`
    ,
    tiers: [
      {
        level: "Level 1",
        marks: "1–2 marks",
        title: "Level 1 (1–2 Marks)",
        badge: "Simple Identification",
        commentary: "Identifies the Domino Theory simply as the fear of countries falling to communism without fully explaining its impact on policy and military escalation.",
        text: `The Domino Theory was important because Eisenhower said if one country became communist, like Vietnam, its neighbours would fall like dominoes. This made America very scared of communism spreading in Asia. Because of this fear, America sent money, weapons, and eventually half a million troops to Vietnam to stop the dominoes falling.`
      },
      {
        level: "Level 2",
        marks: "3–5 marks",
        title: "Level 2 (3–5 Marks)",
        badge: "Descriptive Explanation",
        commentary: "Explains how the theory justified containment and led to US involvement in Vietnam, but the link to specific escalating policy decisions is partly descriptive.",
        text: `The Domino Theory was important because it shaped American foreign policy in Asia. President Eisenhower argued that if Vietnam fell to communism, other countries like Laos, Cambodia, and Thailand would follow. This made US presidents believe that containment had to be applied to Southeast Asia.<br><br>It was also important because it caused direct US military intervention. Presidents Kennedy and Johnson believed they could not let South Vietnam fall without losing the Cold War in Asia. This led Johnson to send over 500,000 troops and bomb North Vietnam, pulling America into a massive and costly war.`
      },
      {
        level: "Level 3",
        marks: "6–8 marks",
        title: "Level 3 (6–8 Marks)",
        badge: "Level 3 Top (Pearson Exam Standard)",
        commentary: "Sustained, rigorous analysis explaining both the strategic-ideological dimension and the practical military escalation driven by the Domino Theory.",
        text: `The Domino Theory was critically important for American foreign policy in Asia because it provided the core ideological justification for expanding containment into Southeast Asia. Articulated by President Eisenhower in 1954, the theory posited that if one nation fell to communism—such as Indochina—neighbouring states like Thailand, Burma, and Malaysia would inexorably topple like falling dominoes. By framing regional insurgencies as coordinated Soviet-Chinese expansion, this doctrine convinced American policymakers that defending South Vietnam was essential to safeguarding capitalist trade routes and American credibility in the Pacific.<br><br>Furthermore, the Domino Theory was important because it directly propelled incremental US military escalation from financial aid into a massive conventional ground war. Operating under the conviction that communist victory in Vietnam would destabilise all of Asia, Presidents Kennedy and Johnson expanded commitments. Kennedy deployed 16,000 military advisers, while Johnson used the Gulf of Tonkin Resolution to dispatch over 500,000 combat troops and launch Operation Rolling Thunder. Therefore, the Domino Theory was decisive because it locked Washington into an open-ended, unwinnable military intervention that cost 58,000 American lives.`
      }
    ]
  },

  // L6 Q4: Summit meetings between Reagan and Gorbachev (1985-1988)
  "cw_6_4": {
    top: `The summit meetings between Ronald Reagan and Mikhail Gorbachev between 1985 and 1988 were critically important for superpower relations because they dismantled decades of deep ideological hostility and established a genuine personal partnership. Beginning at Geneva in November 1985, the two leaders issued a landmark declaration that 'a nuclear war cannot be won and must never be fought.' This personal rapport continued at Reykjavik in October 1986, where, despite disagreements over Reagan's Strategic Defense Initiative (SDI), both leaders debated abolishing all ballistic missiles, breaking the diplomatic stalemate that had frozen relations since 1979.<br><br>Furthermore, the summits were of historic importance because they produced the first genuine nuclear disarmament agreement in history, reversing the arms race. At the Washington Summit in December 1987, the leaders signed the Intermediate-Range Nuclear Forces (INF) Treaty, eliminating 2,692 ground-launched missiles with rigorous on-site verification. When Reagan visited Moscow in May 1988, he publicly stated the USSR was no longer an 'evil empire.' Therefore, these summits were decisively important because they physically dismantled nuclear arsenals and peacefully de-escalated Cold War conflict.`
    ,
    tiers: [
      {
        level: "Level 1",
        marks: "1–2 marks",
        title: "Level 1 (1–2 Marks)",
        badge: "Simple Identification",
        commentary: "Identifies basic summits and the INF treaty without developing a sustained explanation of their importance for ending the Cold War.",
        text: `The summits between Reagan and Gorbachev were important because they became friends and stopped being hostile. They met at Geneva and Reykjavik to talk about banning nuclear weapons. At the Washington Summit in 1987 they signed the INF Treaty which got rid of intermediate missiles. This showed the Cold War was coming to an end.`
      },
      {
        level: "Level 2",
        marks: "3–5 marks",
        title: "Level 2 (3–5 Marks)",
        badge: "Descriptive Explanation",
        commentary: "Explains how the personal relationship and the INF treaty improved relations, but analytical connections to the wider de-escalation are partly descriptive.",
        text: `The summits were important because they built trust between the leaders. At Geneva in 1985, Reagan and Gorbachev agreed that a nuclear war could never be won. Even though they argued over SDI at Reykjavik in 1986, they showed a real willingness to cut weapons.<br><br>They were also important because they led to the INF Treaty in Washington in 1987. This was the first treaty that actually destroyed a whole category of nuclear missiles, rather than just capping them. By the Moscow summit in 1988, Reagan said Russia was no longer an evil empire, showing the Cold War had changed.`
      },
      {
        level: "Level 3",
        marks: "6–8 marks",
        title: "Level 3 (6–8 Marks)",
        badge: "Level 3 Top (Pearson Exam Standard)",
        commentary: "Masterful, focused explanation of two distinct aspects of importance: the transformation of diplomatic trust and the concrete disarmament achieved via the INF Treaty.",
        text: `The summit meetings between Ronald Reagan and Mikhail Gorbachev between 1985 and 1988 were critically important for superpower relations because they dismantled decades of deep ideological hostility and established a genuine personal partnership. Beginning at Geneva in November 1985, the two leaders issued a landmark declaration that 'a nuclear war cannot be won and must never be fought.' This personal rapport continued at Reykjavik in October 1986, where, despite disagreements over Reagan's Strategic Defense Initiative (SDI), both leaders debated abolishing all ballistic missiles, breaking the diplomatic stalemate that had frozen relations since 1979.<br><br>Furthermore, the summits were of historic importance because they produced the first genuine nuclear disarmament agreement in history, reversing the arms race. At the Washington Summit in December 1987, the leaders signed the Intermediate-Range Nuclear Forces (INF) Treaty, eliminating 2,692 ground-launched missiles with rigorous on-site verification. When Reagan visited Moscow in May 1988, he publicly stated the USSR was no longer an 'evil empire.' Therefore, these summits were decisively important because they physically dismantled nuclear arsenals and peacefully de-escalated Cold War conflict.`
      }
    ]
  },

  // L7 Q3: Policy of Détente in the 1970s
  "cw_7_3": {
    top: `The policy of Détente during the 1970s was critically important for superpower relations because it replaced volatile nuclear brinkmanship with regulated arms control, significantly reducing the immediate risk of war. Driven by President Richard Nixon and Soviet Premier Leonid Brezhnev, both superpowers recognized that expanding strategic arsenals was economically unsustainable. This pragmatism culminated in the signing of the Strategic Arms Limitation Treaty (SALT I) in May 1972, which placed strict numeric limits on Intercontinental Ballistic Missiles (ICBMs) and restricted Anti-Ballistic Missile (ABM) deployments. By locking both powers into strategic nuclear parity, SALT I established a predictable, stable strategic balance.<br><br>Furthermore, Détente was important because it expanded superpower engagement into diplomatic recognition and human rights through the Helsinki Accords of August 1975. Signed by thirty-five nations, the accords resolved post-war European border disputes ('Basket 1') while fostering trade ('Basket 2'). Crucially, 'Basket 3' committed all signatories to respecting human rights, which dissidents later used to challenge communist abuses. Therefore, Détente was fundamentally important because it proved the superpowers could manage coexistence peacefully through multilateral diplomacy.`
    ,
    tiers: [
      {
        level: "Level 1",
        marks: "1–2 marks",
        title: "Level 1 (1–2 Marks)",
        badge: "Simple Identification",
        commentary: "Identifies basic features of Détente such as SALT I and Helsinki without analysing in depth their importance for stabilizing superpower relations.",
        text: `Détente was important because it made the USA and USSR get along better in the 1970s. Nixon and Brezhnev signed SALT I in 1972 which limited the number of nuclear missiles they could have. They also signed the Helsinki Accords in 1975 agreeing to human rights and trade, which lowered the chance of nuclear war.`
      },
      {
        level: "Level 2",
        marks: "3–5 marks",
        title: "Level 2 (3–5 Marks)",
        badge: "Descriptive Explanation",
        commentary: "Explains how arms agreements and diplomacy eased tensions, but the analytical link to strategic stability and human rights accountability is partially descriptive.",
        text: `Détente was important because it reduced the danger of nuclear war through arms control. Both the USA and USSR were spending too much on weapons, so Nixon and Brezhnev signed SALT I in 1972. This placed caps on ICBMs and ABMs, helping to prevent an uncontrolled arms race.<br><br>It was also important because it improved diplomatic relations. The Helsinki Accords in 1975 recognized European borders and encouraged trade between East and West. It also included agreements on human rights, which dissidents used to challenge Soviet rule. This showed the superpowers could negotiate peacefully.`
      },
      {
        level: "Level 3",
        marks: "6–8 marks",
        title: "Level 3 (6–8 Marks)",
        badge: "Level 3 Top (Pearson Exam Standard)",
        commentary: "Sustained, analytically sophisticated explanation examining two distinct dimensions of importance: strategic nuclear stabilization (SALT I) and multilateral diplomacy (Helsinki Accords).",
        text: `The policy of Détente during the 1970s was critically important for superpower relations because it replaced volatile nuclear brinkmanship with regulated arms control, significantly reducing the immediate risk of war. Driven by President Richard Nixon and Soviet Premier Leonid Brezhnev, both superpowers recognized that expanding strategic arsenals was economically unsustainable. This pragmatism culminated in the signing of the Strategic Arms Limitation Treaty (SALT I) in May 1972, which placed strict numeric limits on Intercontinental Ballistic Missiles (ICBMs) and restricted Anti-Ballistic Missile (ABM) deployments. By locking both powers into strategic nuclear parity, SALT I established a predictable, stable strategic balance.<br><br>Furthermore, Détente was important because it expanded superpower engagement into diplomatic recognition and human rights through the Helsinki Accords of August 1975. Signed by thirty-five nations, the accords resolved post-war European border disputes ('Basket 1') while fostering trade ('Basket 2'). Crucially, 'Basket 3' committed all signatories to respecting human rights, which dissidents later used to challenge communist abuses. Therefore, Détente was fundamentally important because it proved the superpowers could manage coexistence peacefully through multilateral diplomacy.`
      }
    ]
  },

  // L7 Q4: Proxy wars for the nature of the Cold War
  "cw_7_4": {
    top: `Proxy wars were critically important for the nature of the Cold War because they provided a practical mechanism for the superpowers to wage intense military competition without triggering thermonuclear annihilation. Because Mutually Assured Destruction (MAD) made direct conflict in Europe suicidal, rivalry was displaced into developing nations across Asia, Africa, and Latin America. In conflicts like the Korean War (1950–53), the Vietnam War (1955–75), and the Soviet-Afghan War (1979–89), Washington and Moscow supplied opposing factions with advanced weapons, advisers, and combat troops. This enabled both superpowers to test each other's resolve while maintaining the diplomatic fiction that they were not in direct war.<br><br>Furthermore, proxy wars were important because they exposed the devastating human cost of a conflict considered 'cold' in the West. While Europeans experienced forty years of peace, millions of civilians died in Korea, Vietnam, and Afghanistan, with landscapes ravaged by chemical defoliants and bombing. Therefore, proxy wars were decisively important because they revealed that the Cold War was not a peaceful stalemate, but a lethal, globalised conflict that inflicted catastrophic devastation upon non-European societies.`
    ,
    tiers: [
      {
        level: "Level 1",
        marks: "1–2 marks",
        title: "Level 1 (1–2 Marks)",
        badge: "Simple Identification",
        commentary: "Identifies basic examples of proxy wars without explaining in depth their significance for avoiding direct nuclear war or shifting devastation overseas.",
        text: `Proxy wars were important because the USA and USSR could not fight each other directly due to nuclear weapons. Instead, they fought in proxy wars like Korea and Vietnam by backing opposite sides with weapons and money. This allowed them to compete without blowing up the world, but caused lots of deaths in those countries.`
      },
      {
        level: "Level 2",
        marks: "3–5 marks",
        title: "Level 2 (3–5 Marks)",
        badge: "Descriptive Explanation",
        commentary: "Explains how MAD prevented direct conflict and led to fighting in the developing world, but lacks sustained analytical depth regarding the nature of the Cold War.",
        text: `Proxy wars were important because they allowed the superpowers to compete without starting World War Three. Because of nuclear weapons and MAD, direct fighting in Europe was too dangerous. Instead, the USA and USSR fought through other nations in Asia and the Middle East, like Korea, Vietnam, and Afghanistan.<br><br>They were also important because they showed the Cold War was not actually peaceful. Millions of people died in these wars, and huge areas were destroyed by bombing and defoliants. This proved that although the superpowers avoided fighting each other directly, the conflict was still very destructive.`
      },
      {
        level: "Level 3",
        marks: "6–8 marks",
        title: "Level 3 (6–8 Marks)",
        badge: "Level 3 Top (Pearson Exam Standard)",
        commentary: "Sustained, incisive explanation demonstrating how proxy wars defined the Cold War by displacing conflict under MAD and revealing the horrific human cost beyond Europe.",
        text: `Proxy wars were critically important for the nature of the Cold War because they provided a practical mechanism for the superpowers to wage intense military competition without triggering thermonuclear annihilation. Because Mutually Assured Destruction (MAD) made direct conflict in Europe suicidal, rivalry was displaced into developing nations across Asia, Africa, and Latin America. In conflicts like the Korean War (1950–53), the Vietnam War (1955–75), and the Soviet-Afghan War (1979–89), Washington and Moscow supplied opposing factions with advanced weapons, advisers, and combat troops. This enabled both superpowers to test each other's resolve while maintaining the diplomatic fiction that they were not in direct war.<br><br>Furthermore, proxy wars were important because they exposed the devastating human cost of a conflict considered 'cold' in the West. While Europeans experienced forty years of peace, millions of civilians died in Korea, Vietnam, and Afghanistan, with landscapes ravaged by chemical defoliants and bombing. Therefore, proxy wars were decisively important because they revealed that the Cold War was not a peaceful stalemate, but a lethal, globalised conflict that inflicted catastrophic devastation upon non-European societies.`
      }
    ]
  }
};

module.exports = { narrative_8, importance_8 };
