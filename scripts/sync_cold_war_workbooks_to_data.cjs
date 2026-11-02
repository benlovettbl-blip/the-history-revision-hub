/**
 * scripts/sync_cold_war_workbooks_to_data.cjs
 *
 * Synchronizes the 7 canonical enquiries of The Cold War (1945–1991) from
 * scripts/render_cold_war_twopage_workbook.cjs into units/cold_war/data.js.
 *
 * Guarantees 100% parity between the physical 20-Page Gold Standard Pupil Workbook
 * (public/pdfs/cold_war_pupil_workbook.pdf) and the digital interactive application.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const dataFilePath = path.join(ROOT_DIR, 'units', 'cold_war', 'data.js');

const coldWarTasks = [
  // Lesson 1: Ideological Clash: Capitalism vs Communism
  [
    {
      id: 'cold_war_l1_two_features_ideology',
      type: 'two_features',
      tariff: 'Question 1: Describe Two Features [4 marks • 5 mins]',
      title: 'Question 1: Describe Two Features [4 marks • 5 mins]',
      question: 'Describe two features of the ideological differences between the USA and the USSR in 1945. [4 marks]',
      feature_1: {
        prompt: 'Feature 1: Identify one fundamental political or economic characteristic of the American system in 1945.',
        starter: 'One key ideological feature was that the United States operated on... Specifically, this meant that...',
        model: 'One key ideological feature was that the United States was a liberal democracy founded upon free-market capitalism [1.1]. Specifically, citizens elected multiple political parties through open elections, and economic production was driven by private enterprise, the profit motive, and individual liberty.'
      },
      feature_2: {
        prompt: 'Feature 2: Identify a second fundamental characteristic regarding the Soviet Marxist-Leninist system.',
        starter: 'A second fundamental feature was that the Soviet Union was based on... In particular, this meant that...',
        model: 'A second fundamental feature was that the Soviet Union was a Marxist-Leninist one-party dictatorship with a command economy [1.1]. In particular, all political opposition was suppressed by the state, and the government owned and planned all factories, farmland, and resources in the name of the proletariat.'
      },
      topic: 'Question 1: Describe Two Features [4 marks • 5 mins]'
    },
    {
      id: 'cold_war_l1_consequence_atomic_bomb',
      type: 'extended_writing',
      tariff: 'Question 2: Explain One Consequence [4 marks • 5 mins]',
      title: 'Question 2: Explain One Consequence [4 marks • 5 mins]',
      question: 'Explain one consequence of the American development of the atomic bomb for superpower relations in 1945. [4 marks]',
      hints: [
        'Point: State how Truman’s nuclear monopoly created acute Soviet insecurity and accelerated an atomic arms race [1.5].',
        'Evidence: Reference the Trinity test, Hiroshima (6 August 1945), and Truman informing Stalin at Potsdam.',
        'Explanation: Explain how this shattered wartime trust and motivated Stalin to construct a defensive satellite empire.'
      ],
      scaffolding: {
        structure_strip: [
          'Point: State the consequence—the introduction of an atomic monopoly that transformed diplomatic negotiations into nuclear intimidation [1.5].',
          'Evidence: Cite the Trinity nuclear test (July 1945), the detonation at Hiroshima, and Klaus Fuchs\' spy network.',
          'Explanation: Explain why this compelled Stalin to launch an immediate crash nuclear programme and harden control over Eastern Europe.'
        ],
        sentence_starters: [
          'One significant consequence of the American development of the atomic bomb was...',
          'At the Potsdam Conference in July 1945, President Truman attempted to use...',
          'However, instead of intimidating Moscow, this development caused Stalin to...',
          'Consequently, this accelerated a dangerous nuclear arms race and directly led to...'
        ],
        connective_bank: [
          'One significant consequence was that...',
          'In particular, this meant that...',
          'As a direct result...',
          'Consequently, the impact was...'
        ],
        word_bank: [
          'atomic monopoly',
          'Trinity test',
          'Hiroshima (1945)',
          'Harry S. Truman',
          'Joseph Stalin',
          'Potsdam Conference',
          'Klaus Fuchs',
          'arms race',
          'buffer zone'
        ]
      },
      model_answer: 'One significant consequence of the American development of the atomic bomb was that it shattered post-war diplomatic trust and ignited a high-stakes nuclear arms race between the superpowers [1.5]. When President Truman successfully tested the plutonium bomb in the New Mexico desert (Trinity test) and deployed it against Hiroshima on 6 August 1945, the United States gained an absolute military monopoly. Truman attempted to use this atomic leverage at the Potsdam Conference to compel Soviet concessions in Eastern Europe. However, rather than backing down, Stalin viewed the bomb as direct capitalist blackmail. Consequently, Stalin ordered Soviet scientists to accelerate their own crash nuclear research programme—culminating in the USSR’s first atomic test in August 1949—while hardening the Red Army’s grip across Poland and Eastern Europe to create a physical buffer zone against Western attack.',
      topic: 'Question 2: Explain One Consequence [4 marks • 5 mins]'
    }
  ],

  // Lesson 2: Yalta to Potsdam (1945): The Breakdown of the Grand Alliance
  [
    {
      id: 'cold_war_l2_narrative_account_1945',
      type: 'narrative_account',
      tariff: 'Question 2: Narrative Account [8 marks • 12 mins]',
      title: 'Question 2: Narrative Account [8 marks • 12 mins]',
      question: 'Write a narrative account analysing how relations between the Grand Alliance deteriorated between February and August 1945. [8 marks]',
      stimulus: [
        'The agreements reached at the Yalta Conference (February 1945)',
        'The successful Trinity nuclear test and the Potsdam Conference (July–August 1945)'
      ],
      hints: [
        'Beginning: Explain the high point of wartime cooperation and compromise at Yalta (4 zones, UN Charter, Declaration on Liberated Europe) [2.1].',
        'Escalation: Detail the death of Roosevelt, Truman’s aggressive stance, Soviet arrest of non-communist Poles, and installation of the Lublin committee [2.2, 2.3].',
        'Climax & Outcome: Explain how the Trinity test, Clement Attlee replacing Churchill, and disputes over reparations and borders at Potsdam cemented permanent division [2.4, 2.5].'
      ],
      scaffolding: {
        structure_strip: [
          'Phase 1 (Yalta Consensus & Compromise): Four occupation zones, UN Charter, and free election pledges in the Declaration on Liberated Europe [2.1].',
          'Phase 2 (The Polish Dispute & Leadership Changes): Death of FDR, Truman’s hardline diplomacy, and Soviet installation of the Lublin puppet regime [2.2, 2.3].',
          'Phase 3 (Potsdam Deadlock & Atomic Leverage): Trinity test, Attlee replaces Churchill, and bitter deadlock over German reparations and Polish borders [2.4, 2.5].'
        ],
        sentence_starters: [
          'Initially, at the Yalta Conference in February 1945, the Big Three reached broad agreement on...',
          'Following this, relations began to sour rapidly over the political future of Poland when...',
          'A decisive turning point occurred in April 1945 with the death of Roosevelt and the accession of...',
          'Consequently, by the time the leaders assembled at Potsdam in July 1945, the atmosphere had become...',
          'This breakdown culminated in bitter deadlock over German reparations, confirming that...'
        ],
        connective_bank: [
          'Initially, at Yalta...',
          'Following this initial compromise...',
          'A decisive shift occurred when...',
          'Consequently, at Potsdam...',
          'This ultimately culminated in...'
        ],
        word_bank: [
          'Yalta Conference (Feb 1945)',
          'Big Three',
          'Four Zones',
          'Declaration on Liberated Europe',
          'Lublin Poles',
          'Harry S. Truman',
          'Clement Attlee',
          'Trinity atomic test',
          'Potsdam Conference',
          'industrial reparations'
        ]
      },
      model_answer: 'Between February and August 1945, relations between the Grand Alliance rapidly disintegrated from pragmatic wartime cooperation into bitter ideological suspicion. Initially, at the Yalta Conference in February 1945, Churchill, Roosevelt, and Stalin maintained a facade of unity [2.1]. They agreed to divide Germany and Berlin into four occupation zones, establish the United Nations, and signed the Declaration on Liberated Europe promising democratic elections in liberated territories. In return, Stalin agreed to enter the war against Japan within three months of Germany’s surrender.\n\nHowever, this diplomatic consensus collapsed almost immediately over the fate of Poland [2.2, 2.3]. Stalin violated the Yalta accords by refusing to allow free elections, arresting leaders of the non-communist London Polish government-in-exile, and installing the pro-Soviet Lublin puppet regime. Friction intensified sharply following the sudden death of President Roosevelt in April 1945. His successor, Harry S. Truman, adopted a confrontational stance, famously berating Soviet Foreign Minister Molotov at the White House and accusing Moscow of breaking its solemn agreements.\n\nThe final rupture occurred at the Potsdam Conference in July–August 1945 [2.4, 2.5]. The dynamic among the leaders had completely altered: Roosevelt was dead, and midway through the summit, Churchill was replaced by Labour leader Clement Attlee. Crucially, on the eve of the conference, the US successfully detonated the world’s first atomic weapon in New Mexico (the Trinity test). Armed with nuclear monopoly, Truman adopted an unyielding posture, refusing Stalin’s demands for $10 billion in industrial reparations from the Western German zones. Consequently, Potsdam ended without genuine agreement on Germany’s long-term future, cementing the division of Europe into hostile spheres of influence.',
      topic: 'Question 2: Narrative Account [8 marks • 12 mins]'
    }
  ],

  // Lesson 3: The Iron Curtain & The Berlin Blockade (1948–1949)
  [
    {
      id: 'cold_war_l3_source_utility_berlin_blockade',
      type: 'source_utility',
      tariff: 'Question 3: Forensic Source Utility [8 marks • 10 mins]',
      title: 'Question 3: Forensic Source Utility [8 marks • 10 mins]',
      question: 'How useful are Sources A and B for an enquiry into the reasons for the Berlin Blockade and the Allied response (1948–1949)? [8 marks]',
      stimulus: [
        'Source A: Extract from a speech by British Foreign Secretary Ernest Bevin to the House of Commons, 30 June 1948.',
        'Source B: British political cartoon by David Low in the Evening Standard, July 1948, depicting the Berlin Airlift.'
      ],
      hints: [
        'Content & Context: Evaluate Source A for Bevin’s statement of Allied resolve and the decision to supply 2.5 million West Berliners by air [3.4].',
        'Corroborate with historical facts: Operation Vittles, 278,000 flights, Deutsche Mark introduction, and Stalin’s aim to force Allies out.',
        'Provenance & Purpose: Analyse Bevin’s political motive to maintain parliamentary and civilian morale vs cartoon commentary in Source B.'
      ],
      scaffolding: {
        structure_strip: [
          'Source A Content & Context: Bevin’s identification of Soviet starvation tactics and Allied determination to sustain Berlin via air [3.4].',
          'Source A Provenance: Authoritative statement of British foreign policy in Parliament vs need to project public confidence.',
          'Source B Content & Context: Low’s visual depiction of Soviet frustration at the endless skyway of cargo planes landing at Tempelhof.',
          'Overall Judgment: Synthesize how both sources together provide valuable insight into Allied political resolve and logistical triumph.'
        ],
        sentence_starters: [
          'Source A is highly useful because its content reveals the British government’s official resolve to...',
          'From my own historical knowledge, I know that Stalin severed all road and rail access because...',
          'Furthermore, the provenance of Source A adds significant value because it was delivered by...',
          'However, a historian must recognize its limitations, such as...',
          'Source B complements Source A by visually demonstrating...',
          'In conclusion, both sources are extremely valuable for understanding how the airlift defeated Soviet coercion.'
        ],
        connective_bank: [
          'Source A is useful for showing...',
          'This is corroborated by historical facts because...',
          'Regarding provenance, Source A is valuable because...',
          'Source B provides a complementary perspective by...',
          'In conclusion, both sources are highly useful because...'
        ],
        word_bank: [
          'Berlin Blockade (1948–49)',
          'Operation Vittles',
          'Ernest Bevin',
          'Tempelhof Airport',
          'Deutsche Mark',
          'Trizonia',
          'Gail Halvorsen',
          'David Low cartoon',
          'NATO (1949)'
        ]
      },
      model_answer: 'Source A is exceptionally useful because it provides direct evidence of the British government’s official determination to resist Soviet coercion in Berlin without triggering armed conflict [3.4]. Bevin explicitly identifies Stalin’s tactic—using the threatened starvation of 2.5 million West Berliners to force an Allied retreat following the introduction of the Deutsche Mark—and states Britain’s counter-strategy of supplying the city entirely by air. This is closely corroborated by historical facts: the Western Allies launched Operation Vittles, delivering over 2.3 million tons of food, fuel, and coal across 278,228 flights, ultimately forcing Stalin to lift the blockade in May 1949.\n\nThe provenance of Source A strongly enhances its utility as an authoritative statement of state policy. Delivered in the House of Commons by the British Foreign Secretary in June 1948, it reveals the immediate geopolitical calculation of the British Cabinet. However, an analytical limitation is its political purpose: Bevin is speaking publicly to maintain parliamentary and national morale, so he intentionally downplays the catastrophic logistical risks of the early airlift and genuine Allied fears of an accidental military clash.\n\nSource B complements Source A by illustrating contemporary public perceptions of Soviet strategic failure. David Low’s cartoon visually captures the psychological defeat of the USSR: a frustrated Russian bear sits powerless on blocked rail tracks while transport planes land uninterrupted behind him. Overall, both sources are exceptionally useful for revealing both the official policy rationale and the symbolic victory of the Berlin Airlift.',
      topic: 'Question 3: Forensic Source Utility [8 marks • 10 mins]'
    }
  ],

  // Lesson 4: Nuclear Brinkmanship: The Cuban Missile Crisis (1962)
  [
    {
      id: 'cold_war_l4_evaluative_essay_cuban_crisis',
      type: 'evaluative_essay',
      tariff: 'Question 4: Evaluative Statement Essay [12 marks • 15 mins]',
      title: 'Question 4: Evaluative Statement Essay [12 marks • 15 mins]',
      question: '‘President Kennedy’s decisive leadership and naval quarantine were the main reasons the Cuban Missile Crisis was resolved peacefully.’ How far do you agree? [12 marks]',
      stimulus: [
        'The US naval blockade (quarantine) and secret deal over Jupiter missiles in Turkey',
        'Khrushchev’s decision to dismantle Soviet missile sites and the Moscow-Washington hotline'
      ],
      hints: [
        'Argument (Kennedy\'s Leadership): Explain how Kennedy resisted military pressure from ExComm hawks for airstrikes and chose a calibrated naval quarantine [4.3].',
        'Counter-Argument (Soviet Concessions & Secret Diplomacy): Explain Khrushchev’s willingness to de-escalate and the secret removal of US Jupiter missiles from Turkey [4.4, 4.5].',
        'Counter-Argument (Structural Fear of Nuclear Annihilation): Explain how Mutually Assured Destruction (MAD) and near-catastrophes (Submarine B-59) forced compromise.',
        'Conclusion: Reach a balanced, sustained historical verdict.'
      ],
      scaffolding: {
        structure_strip: [
          'PEEL 1 (Kennedy’s Measured Crisis Management): Resisting airstrike hawks in ExComm, establishing the quarantine, and buying time for diplomacy [4.3].',
          'PEEL 2 (Soviet Pragmatism & The Secret Jupiter Deal): Khrushchev’s letters, backchannel negotiations, and Robert Kennedy’s secret swap of Turkey missiles [4.4, 4.5].',
          'PEEL 3 (The Shared Terror of Nuclear Annihilation): DEFCON 2, U-2 shootdown, and the realisation that conventional military escalation would cause global suicide.',
          'Conclusion: Balanced judgment synthesising individual presidential leadership with mutual structural terror.'
        ],
        sentence_starters: [
          'To a significant extent, it can be argued that Kennedy’s leadership was crucial because...',
          'Within the secret ExComm meetings, Kennedy resisted intense pressure from the Joint Chiefs of Staff who demanded...',
          'Instead, Kennedy opted for a calibrated naval quarantine, which successfully bought time for...',
          'On the other hand, the peaceful resolution was equally dependent on Khrushchev’s willingness to...',
          'Furthermore, backchannel diplomacy negotiated by Robert Kennedy and Soviet Ambassador Dobrynin resolved the crisis by secretly...',
          'In conclusion, while Kennedy’s restraint averted an immediate invasion, the decisive factor was...'
        ],
        connective_bank: [
          'To a large extent, it can be argued that...',
          'On the one hand, Kennedy’s leadership was decisive because...',
          'However, an alternative crucial factor was...',
          'Furthermore, backchannel diplomacy proved essential when...',
          'In conclusion, the primary reason was... because...'
        ],
        word_bank: [
          'Cuban Missile Crisis (1962)',
          'ExComm',
          'naval quarantine',
          'Operation Anadyr',
          'Nikita Khrushchev',
          'Jupiter missiles (Turkey)',
          'Robert Kennedy',
          'Anatoly Dobrynin',
          'Vasili Arkhipov (B-59)',
          'DEFCON 2',
          'Moscow-Washington Hotline'
        ]
      },
      model_answer: 'To a significant extent, it can be argued that President John F. Kennedy’s disciplined crisis management and implementation of a naval quarantine were fundamental in resolving the Cuban Missile Crisis peacefully. However, claiming this was the sole reason overlooks the decisive role of Soviet leader Nikita Khrushchev’s pragmatism, secret backchannel diplomacy, and the shared existential terror of Mutually Assured Destruction (MAD).\n\nOn the one hand, Kennedy’s personal leadership was critical in preventing military escalation [4.3]. When U-2 spy plane photographs revealed intermediate-range Soviet ballistic missile sites in Cuba in October 1962, the military Joint Chiefs of Staff in the Executive Committee (ExComm) aggressively lobbied for immediate surgical airstrikes followed by a full-scale amphibious invasion. Kennedy resisted this belligerent advice, recognising that bombing Soviet bases would trigger Red Army retaliation against West Berlin. Instead, Kennedy chose a calibrated naval blockade—termed a \"quarantine\" to circumvent international legal definitions of war. This naval barrier placed the onus of initiating violence directly on Moscow while buying critical diplomatic time for backchannel communication.\n\nOn the other hand, the peaceful outcome was equally dependent on Soviet willingness to compromise and reciprocal American concessions [4.4, 4.5]. Khrushchev recognised that placing missiles in Cuba had brought the superpowers to the edge of nuclear catastrophe. In emotional personal correspondence, Khrushchev appealed to Kennedy to de-escalate, warning that \"we and you ought not now to pull on the ends of the rope in which you have tied the knot of war.\" Crucially, resolution was only achieved when Attorney General Robert Kennedy met secretly with Soviet Ambassador Anatoly Dobrynin on 27 October, agreeing to Khrushchev’s private demand that the US dismantle its obsolete Jupiter nuclear missiles in Turkey within six months in exchange for the public removal of Soviet missiles from Cuba.\n\nUltimately, while Kennedy’s measured leadership prevented an immediate military strike, the overarching reason the crisis resolved peacefully was the mutual terror of thermonuclear annihilation. Once both leaders confronted the reality of 100 million immediate casualties, compromise became the only rational course.',
      topic: 'Question 4: Evaluative Statement Essay [12 marks • 15 mins]'
    }
  ],

  // Lesson 5: Proxy Wars: The Cold War in Asia (Korea & Vietnam)
  [
    {
      id: 'cold_war_l5_narrative_account_vietnam',
      type: 'narrative_account',
      tariff: 'Question 2: Narrative Account [8 marks • 12 mins]',
      title: 'Question 2: Narrative Account [8 marks • 12 mins]',
      question: 'Write a narrative account analysing the key events in the escalation of American involvement in the Vietnam War between 1954 and 1968. [8 marks]',
      stimulus: [
        'The 1954 Geneva Accords and the division of Vietnam',
        'The Gulf of Tonkin Incident (1964) and the launch of Operation Rolling Thunder'
      ],
      hints: [
        'Beginning: French collapse at Dien Bien Phu (1954), Geneva Accords dividing Vietnam at the 17th Parallel, and Eisenhower’s Domino Theory [5.1].',
        'Escalation: Kennedy sending 16,000 military advisers, overthrow of Ngo Dinh Diem, and the August 1964 Gulf of Tonkin incident giving President Johnson open authority [5.2, 5.3].',
        'Climax & Outcome: 1965 Operation Rolling Thunder aerial blitz, deployment of 500,000 ground troops, search-and-destroy tactics, and the shock of the 1968 Tet Offensive [5.4, 5.5].'
      ],
      scaffolding: {
        structure_strip: [
          'Phase 1 (1954–1960 Geneva Division & Domino Theory): French defeat, 17th Parallel division, and Eisenhower’s financial commitment to South Vietnam [5.1].',
          'Phase 2 (1961–1964 Advisers & The Gulf of Tonkin Incident): Kennedy’s Green Berets, Diem assassination, Tonkin Resolution giving LBJ open war powers [5.2, 5.3].',
          'Phase 3 (1965–1968 Operation Rolling Thunder & Ground Escalation): Air blitz, 500,000 US combat troops, search-and-destroy missions, and the 1968 Tet Offensive [5.4, 5.5].'
        ],
        sentence_starters: [
          'Initially, following the French defeat at Dien Bien Phu in 1954, the Geneva Accords divided Vietnam along...',
          'Fearing the spread of communism under the "Domino Theory", President Eisenhower committed millions in aid to...',
          'Under President Kennedy, American involvement escalated significantly through the deployment of...',
          'The decisive turning point occurred in August 1964 with the Gulf of Tonkin Incident, which prompted Congress to...',
          'Consequently, in 1965 President Johnson launched Operation Rolling Thunder and committed the first...',
          'This escalation culminated in 1968 with the massive communist Tet Offensive, which proved that...'
        ],
        connective_bank: [
          'Initially, following the 1954 Geneva Accords...',
          'Under the rationale of the Domino Theory...',
          'A decisive turning point occurred in August 1964 when...',
          'Consequently, in 1965...',
          'This massive escalation ultimately culminated in...'
        ],
        word_bank: [
          'Geneva Accords (1954)',
          '17th Parallel',
          'Domino Theory',
          'Dwight D. Eisenhower',
          'Ngo Dinh Diem',
          'military advisers',
          'Gulf of Tonkin Incident (1964)',
          'Lyndon B. Johnson',
          'Operation Rolling Thunder',
          'William Westmoreland',
          'Tet Offensive (1968)'
        ]
      },
      model_answer: 'Between 1954 and 1968, American involvement in Vietnam escalated systematically from financial backing and military advisory missions into a massive, open-ended ground war. The origin of direct US engagement began following the catastrophic French defeat at Dien Bien Phu in 1954 [5.1]. The subsequent Geneva Accords temporarily partitioned Vietnam along the 17th Parallel, with Ho Chi Minh’s communist Viet Minh governing the North and Ngo Dinh Diem ruling the anti-communist South. Guided by President Eisenhower’s \"Domino Theory\"—the belief that if Vietnam fell to communism, neighbouring Southeast Asian nations would topple like dominoes—the US replaced France as the primary patron of South Vietnam, pouring in financial aid.\n\nUnder President John F. Kennedy, American involvement transitioned from financial support to direct military assistance [5.2, 5.3]. By 1963, Kennedy had increased the number of US military \"advisers\" from 900 to over 16,000 Green Berets and authorized covert counter-insurgency operations. The critical turning point occurred in August 1964 under President Lyndon B. Johnson with the Gulf of Tonkin Incident, where North Vietnamese patrol boats allegedly fired upon US destroyers. Johnson used this skirmish to push the Gulf of Tonkin Resolution through Congress, granting him sweeping executive authority to \"take all necessary measures\" without a formal declaration of war.\n\nArmed with this congressional mandate, Johnson radically escalated the war in 1965 [5.4, 5.5]. Following a Viet Cong attack on Pleiku airbase, Johnson authorized Operation Rolling Thunder—a three-year strategic bombing campaign dropping more bomb tonnage on Vietnam than on all of Europe during World War Two. In March 1965, the first 3,500 US combat troops landed at Da Nang; by 1968, General Westmoreland commanded over 536,000 American soldiers conducting brutal \"search-and-destroy\" operations using napalm and Agent Orange. This phase of relentless escalation culminated in January 1968 with the Tet Offensive: although a military defeat for the Viet Cong, the surprise nationwide attacks shattered Washington’s claims of imminent victory and exposed the catastrophic limits of military containment.',
      topic: 'Question 2: Narrative Account [8 marks • 12 mins]'
    }
  ],

  // Lesson 6: The Fall of the Berlin Wall (1989) & The Collapse of the USSR (1991)
  [
    {
      id: 'cold_war_l6_evaluative_essay_gorbachev',
      type: 'evaluative_essay',
      tariff: 'Question 4: Evaluative Statement Essay [12 marks • 15 mins]',
      title: 'Question 4: Evaluative Statement Essay [12 marks • 15 mins]',
      question: '‘The reform policies of Mikhail Gorbachev were the main reason for the collapse of Soviet power in Eastern Europe between 1985 and 1989.’ How far do you agree? [12 marks]',
      stimulus: [
        'Glasnost, Perestroika, and the abandonment of the Brezhnev Doctrine (Sinatra Doctrine)',
        'Economic stagnation in the USSR and the rise of Solidarity in Poland'
      ],
      hints: [
        'Argument (Gorbachev\'s Reforms): Explain how Glasnost (free expression) and Perestroika (economic restructuring) unleashed uncontrollable popular demands [6.1].',
        'Argument (Renunciation of the Brezhnev Doctrine): Crucially explain the "Sinatra Doctrine"—Gorbachev explicitly refusing to deploy the Red Army to crush protests [6.2].',
        'Counter-Argument (Underlying Economic & Structural Failure): Detail chronic Soviet economic bankruptcy, consumer shortages, and the military spending burden of the Afghan war and arms race [6.3].',
        'Counter-Argument (Popular Resistance & National Movements): Explain Poland’s Solidarity union led by Lech Wałęsa and Hungary cutting the Iron Curtain fence [6.4, 6.5].',
        'Conclusion: Reach a nuanced verdict.'
      ],
      scaffolding: {
        structure_strip: [
          'PEEL 1 (Gorbachev’s Radical Reforms & The Sinatra Doctrine): Glasnost, Perestroika, and publicly refusing to use Soviet military force in Eastern Europe [6.1, 6.2].',
          'PEEL 2 (Deep Structural Economic Stagnation): Chronic bankruptcy, food lines, the Afghan quagmire, and inability to match Reagan’s SDI military spending [6.3].',
          'PEEL 3 (Grassroots Opposition & The Domino Effect): Solidarity in Poland, Hungarian border opening, and mass East German demonstrations opening the Wall [6.4, 6.5].',
          'Conclusion: Balanced verdict arguing Gorbachev’s reforms were the indispensable catalyst that removed the military barrier holding back systemic failure.'
        ],
        sentence_starters: [
          'To a large extent, it can be argued that Gorbachev’s reforms were the decisive catalyst because...',
          'Upon becoming General Secretary in 1985, Gorbachev introduced Glasnost (\"openness\") and Perestroika (\"restructuring\") to...',
          'Most crucially, Gorbachev repudiated the Brezhnev Doctrine, introducing what became known as the...',
          'On the other hand, historians argue that Soviet hegemony was already doomed by decades of severe economic...',
          'Furthermore, grassroots popular resistance—exemplified by Lech Wałęsa’s Solidarity movement in Poland—demonstrated that...',
          'In conclusion, while economic stagnation and public dissent created the explosive material, Gorbachev was the primary cause because...'
        ],
        connective_bank: [
          'To a large extent, it can be argued that...',
          'On the one hand, Gorbachev’s policies were transformative because...',
          'Crucially, the abandonment of the Brezhnev Doctrine meant that...',
          'However, underlying structural factors also contributed, such as...',
          'In conclusion, Gorbachev was the primary reason because... without his reforms...'
        ],
        word_bank: [
          'Mikhail Gorbachev (1985)',
          'Glasnost',
          'Perestroika',
          'Brezhnev Doctrine',
          'Sinatra Doctrine',
          'Solidarity (Solidarność)',
          'Lech Wałęsa',
          'Ronald Reagan',
          'Strategic Defense Initiative (SDI)',
          'Günter Schabowski',
          'Fall of the Berlin Wall (9 Nov 1989)'
        ]
      },
      model_answer: 'To a large extent, the reform policies introduced by Mikhail Gorbachev were the primary catalyst for the rapid collapse of Soviet dominion across Eastern Europe between 1985 and 1989. However, Gorbachev’s reforms did not act in isolation; they accelerated and unleashed deep structural economic insolvency, imperial overstretch, and decades of suppressed popular nationalism across the Warsaw Pact.\n\nOn the one hand, Gorbachev’s ideological departure from orthodox Soviet totalitarianism was indispensable [6.1, 6.2]. Becoming General Secretary in March 1985, Gorbachev inherited a sclerotic command economy. He introduced Glasnost (\"openness\") to encourage public debate and Perestroika (\"restructuring\") to inject market incentives. Crucially, Gorbachev realised that the USSR could no longer afford to subsidise or garrison Eastern Europe. At the UN in December 1988, he formally repudiated the Brezhnev Doctrine—the long-standing Soviet policy of using military tanks to crush anti-communist uprisings (as seen in Hungary 1956 and Prague 1968). By introducing the so-called \"Sinatra Doctrine\"—allowing satellite nations to determine their own internal politics \"their way\"—Gorbachev effectively notified Eastern European populations that the Red Army would not intervene to save local communist dictators.\n\nOn the other hand, profound structural economic failure and grassroots resistance made communist collapse inevitable once military intimidation was lifted [6.3, 6.4, 6.5]. By the mid-1980s, the Soviet economy was devastated by chronic industrial stagnation, catastrophic agricultural inefficiency, and the immense financial drain of the Afghanistan invasion (1979–1989). Compelled to spend 25% of its GDP on defense to counter President Reagan’s Strategic Defense Initiative (SDI), the USSR was essentially bankrupt. Concurrently, grassroots civil resistance eroded state legitimacy. In Poland, the independent trade union Solidarity (led by Lech Wałęsa) maintained mass underground defiance, forcing the regime into semi-free elections in June 1989. When Hungary opened its border with Austria in August 1989, thousands of East Germans fled to the West, sparking mass demonstrations that culminated in the accidental opening of the Berlin Wall on 9 November 1989.\n\nIn conclusion, while severe economic bankruptcy and resilient public resistance provided the dry timber of revolution, Mikhail Gorbachev’s refusal to deploy military violence was the primary and decisive reason Soviet power disintegrated so swiftly and bloodlessly in 1989.',
      topic: 'Question 4: Evaluative Statement Essay [12 marks • 15 mins]'
    }
  ],

  // Lesson 7: Assessment: Was the Cold War Ever Truly "Cold"?
  [
    {
      id: 'cold_war_l7_evaluative_essay_synoptic',
      type: 'evaluative_essay',
      tariff: 'Question 5: Synoptic Capstone Essay [12 marks • 15 mins]',
      title: 'Question 5: Synoptic Capstone Essay [12 marks • 15 mins]',
      question: '‘The Cold War was characterised far more by brutal global violence than by peaceful superpower coexistence.’ How far do you agree? [12 marks]',
      stimulus: [
        'Proxy wars in Korea, Vietnam, and Afghanistan, and civilian casualties across the Global South',
        'Nuclear deterrence (MAD), arms limitation treaties (SALT, INF), and summit diplomacy'
      ],
      hints: [
        'Argument (Brutal Global Violence & Proxy Carnage): Detail the devastating proxy wars in Korea, Vietnam, and Afghanistan, civilian massacres, and CIA/KGB covert coups in the Global South [7.1, 7.2, 7.3].',
        'Counter-Argument (The "Long Peace" & Superpower Deterrence): Detail how Mutually Assured Destruction (MAD), the Hotline, and arms treaties (SALT I 1972, INF 1987) averted World War Three in Europe [7.4].',
        'Counter-Argument (Ideological & Cultural Competition): Space race, Olympics, espionage, and propaganda as non-violent arenas of competition.',
        'Conclusion (The Eurocentric Myth): Reach a nuanced verdict demonstrating that the concept of a "cold" war is a Eurocentric illusion.'
      ],
      scaffolding: {
        structure_strip: [
          'PEEL 1 (The Bloodshed of the Global South): Korea (3M dead), Vietnam (3.8M dead), Afghanistan (1.5M dead), and CIA/KGB proxy interventions [7.1, 7.2, 7.3].',
          'PEEL 2 (Nuclear Deterrence & European Stability - The "Long Peace"): MAD, ExComm de-escalation, SALT I, INF Treaty, and avoiding direct superpower clashes [7.4].',
          'PEEL 3 (Espionage, Ideological Rivalry & Covert Warfare): Propaganda, Space Race, sports boycotted, and domestic police states (Stasi, McCarthyism).',
          'Conclusion (Deconstructing the Eurocentric Myth): Synthesising why the term "Cold War" is accurate only for Washington and Moscow, but completely false for the developing world.'
        ],
        sentence_starters: [
          'To a large extent, the assertion is historically valid because while direct nuclear conflict between Washington and Moscow was avoided, violence was...',
          'In peripheral theatres across the Global South, the superpowers waged intensely destructive proxy conflicts, including...',
          'In the Korean War (1950–1953) and Vietnam War (1954–1975), over seven million civilians and combatants perished in...',
          'On the other hand, historians of the \"Long Peace\" argue that the Cold War was fundamentally characterised by nuclear deterrence, which...',
          'Through bilateral summit diplomacy and treaties like the 1972 SALT I and 1987 INF Treaty, the superpowers established...',
          'In conclusion, the label \"Cold War\" is a profound Eurocentric misnomer: for populations across Asia, Africa, and Latin America, the era was defined by...'
        ],
        connective_bank: [
          'To a large extent, the assertion is valid because...',
          'In the Global South, the Cold War was intensely hot because...',
          'On the other hand, proponents of the "Long Peace" emphasize that...',
          'Furthermore, nuclear deterrence functioned to prevent...',
          'In conclusion, the concept of a "Cold" war is an illusion because... for millions of people...'
        ],
        word_bank: [
          'Eurocentric myth',
          'Proxy wars',
          'Korean War (3 million dead)',
          'Vietnam War (3.8 million dead)',
          'Soviet-Afghan War',
          'Mutually Assured Destruction (MAD)',
          'The Long Peace',
          'SALT I (1972)',
          'INF Treaty (1987)',
          'Operation Condor',
          '20 million proxy casualties'
        ]
      },
      model_answer: 'To a significant extent, the historical claim that the Cold War was characterised far more by brutal global violence than by peaceful superpower coexistence is profoundly accurate. While historians often describe the era from 1945 to 1991 as the \"Long Peace\" because nuclear deterrence prevented World War Three in Europe, this represents an exclusionary, Eurocentric perspective. For populations across Asia, Africa, and Latin America, the Cold War was an era of catastrophic and unrelenting hot warfare.\n\nOn the one hand, the devastating violence of superpower proxy warfare was staggering in both scale and lethality [7.1, 7.2, 7.3]. Recognizing that direct clash in Europe would trigger Mutually Assured Destruction (MAD), Washington and Moscow displaced their ideological competition into the developing world. In the Korean War (1950–1953), American carpet bombing and Chinese human-wave assaults claimed over three million lives. In the Vietnam War (1954–1975), nearly four million Vietnamese and 58,220 Americans died amidst the deployment of napalm, chemical defoliants, and free-fire zones. Similarly, the Soviet invasion of Afghanistan (1979–1989) killed over 1.5 million Afghans and displaced a third of the nation’s population. Beyond open wars, covert superpower interventions—such as CIA-orchestrated coups in Iran (1953), Guatemala (1954), and Chile (1973), alongside KGB support for brutal authoritarian regimes in Angola and Ethiopia—inflicted widespread atrocities and military dictatorships. In total, proxy warfare claimed over twenty million lives between 1945 and 1991.\n\nOn the other hand, proponents of the \"coexistence\" argument emphasize that the superpowers developed sophisticated mechanisms to prevent systemic collapse [7.4]. When confronted with existential crises like the Berlin Blockade (1948) and the Cuban Missile Crisis (1962), leaders like Kennedy and Khrushchev ultimately prioritized survival over military victory. In the 1970s, the era of Détente produced the 1972 SALT I treaty, limiting anti-ballistic missiles, and the 1975 Helsinki Accords. In the late 1980s, summit diplomacy between Reagan and Gorbachev achieved the historic 1987 INF Treaty, eliminating an entire class of ground-launched nuclear missiles.\n\nIn conclusion, while nuclear deterrence successfully prevented direct military confrontation between the superpower capitals, this stability was purchased at the immense human cost of proxy warfare. The Cold War was \"cold\" only for citizens living in North America and Western Europe; for the Global South, it was one of the bloodiest eras in modern human history.',
      topic: 'Question 5: Synoptic Capstone Essay [12 marks • 15 mins]'
    }
  ]
];

async function syncColdWar() {
  console.log('🔄 Synchronizing Cold War workbook tasks into units/cold_war/data.js...');
  const mod = await import('file:///' + dataFilePath.replace(/\\/g, '/'));
  const coldWarData = mod.default || mod;

  if (!coldWarData.lessons || coldWarData.lessons.length !== 7) {
    throw new Error(`Expected 7 lessons in cold_war/data.js, found ${coldWarData.lessons ? coldWarData.lessons.length : 0}`);
  }

  coldWarData.lessons.forEach((lesson, idx) => {
    lesson.tasks = coldWarTasks[idx];
    console.log(`✅ Lesson ${idx + 1} (${lesson.id}): Injected ${lesson.tasks.length} canonical workbook task(s).`);
  });

  const serialized = `// Superpower Relations and the Cold War (1941–1991)\n// Complete 5-Stage Chronological Inquiry Spine & Canonical Workbook Tasks\nconst cold_war_data = ${JSON.stringify(coldWarData, null, 2)};\n\nexport default cold_war_data;\n`;

  fs.writeFileSync(dataFilePath, serialized, 'utf8');
  console.log(`🎉 Successfully written updated curriculum data to: ${dataFilePath}`);

  // Also update public/units/cold_war/data.js if it exists
  const publicDataPath = path.join(ROOT_DIR, 'public', 'units', 'cold_war', 'data.js');
  if (fs.existsSync(publicDataPath)) {
    fs.writeFileSync(publicDataPath, serialized, 'utf8');
    console.log(`✅ Also synchronized public unit copy: ${publicDataPath}`);
  }
}

syncColdWar().catch((err) => {
  console.error('❌ Error synchronizing Cold War data:', err);
  process.exit(1);
});

