const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const dataJsPath = path.join(ROOT_DIR, 'units', 'usa', 'data.js');

const raw = fs.readFileSync(dataJsPath, 'utf8');
const trimmed = raw.trim();
const jsonCandidate = trimmed.replace(/^export\s+default\s+/, '').replace(/;$/, '');
const usaData = JSON.parse(jsonCandidate);

// Define the 16 Escalation Ladder Exam Practice configurations
const EXAM_PRACTICE_LADDER = {
  // =========================================================================
  // KEY TOPIC 1: THE DEVELOPMENT OF THE CIVIL RIGHTS MOVEMENT, 1954–60
  // =========================================================================
  lesson_1_1: {
    title: 'Edexcel GCSE (9–1) Paper 3 Exam Practice',
    tariff: 'Section A: Questions 1 & 2 (4 marks & 12 marks)',
    stimulus: [
      {
        title: 'Source A: Segregated Municipal Railway Waiting Room, Jacksonville, Florida, early 1950s',
        image: '/units/usa/assets/sources/colored-waiting-room-sign.jpg',
        caption: 'A metal sign reading \'COLORED WAITING ROOM\' with directional arrows directing Black passengers away from white municipal facilities.',
        provenance: 'Official photograph documenting Jim Crow segregation signage at a Southern passenger terminal, early 1950s (US National Archives · Record Group 21 / Southern Railway Photographic Records).',
        extract: 'A large metal sign suspended above the municipal terminal entrance reads: "COLORED WAITING ROOM" with dual directional arrows pointing towards the segregated facility. Under Jim Crow laws, Black travelers were strictly relegated to separate facilities under penalty of fine or imprisonment.'
      }
    ],
    questions: [
      {
        tariff: '4 marks',
        type: 'inference_4m',
        marks: 4,
        question: 'Give two things you can infer from Source A about racial segregation in the American South in the early 1950s.',
        prompt: 'Give two separate valid inferences. Support each inference with direct factual details from Source A.',
        model: '<p><strong>(i) What I can infer:</strong><br>I can infer that racial segregation was strictly enforced by law and physical infrastructure in public transport facilities.<br><strong>Details in the source that tell me this:</strong><br>A prominent, permanent metal sign suspended above the entrance explicitly designates the facility for \'Colored\' passengers only, with directional arrows enforcing physical separation.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that Black Americans were systematically treated as second-class citizens and relegated to separate, inferior public accommodations.<br><strong>Details in the source that tell me this:</strong><br>The separate, designated entrance reflects the Jim Crow legal doctrine of \'separate but equal\', which in practice enforced racial humiliation and public subjugation.</p>',
        scaffolding: {
          acronym: 'Inference Formula (AO3)',
          acronym_title: 'Inference + Supporting Detail (2 Points • 4 Marks)',
          steps: [
            { letter: 'I1', name: '1. First Valid Inference', prompt: 'State what the source suggests beyond obvious surface facts.' },
            { letter: 'D1', name: '2. Supporting Detail', prompt: 'Quote or describe specific evidence from Source A to prove your first inference.' },
            { letter: 'I2', name: '3. Second Valid Inference', prompt: 'Identify a distinct second historical insight from the source.' },
            { letter: 'D2', name: '4. Supporting Detail', prompt: 'Provide specific textual or visual evidence from Source A for the second inference.' }
          ]
        }
      },
      {
        tariff: '12 marks',
        type: 'explain_why_12',
        marks: 12,
        question: 'Explain why it was difficult for Black Americans in the Southern states to register to vote in the early 1950s.',
        stimulus: [
          'Literacy tests',
          'Ku Klux Klan (KKK)'
        ],
        prompt: 'You may use the following in your answer: (1) Literacy tests, (2) Ku Klux Klan (KKK). You must also use information of your own.',
        model: 'One major reason why voter registration was exceedingly difficult was the institutional use of deliberately biased <strong>literacy tests and poll taxes</strong> by white state registrars. Under the doctrine of states\' rights, Southern registrars held unchecked authority to administer registration tests. Black applicants were routinely asked impossible, obscure questions—such as reciting complex sections of the state constitution or guessing the number of bubbles in a bar of soap. Furthermore, impoverished Black sharecroppers could rarely afford cumulative poll taxes, legally barring hundreds of thousands from the ballot box despite the 15th Amendment.<br><br>A second decisive reason was the pervasive threat of physical terror and extralegal violence orchestrated by white supremacist groups like the <strong>Ku Klux Klan (KKK)</strong> and local police forces. Black citizens who attempted to register faced beatings, arson, and lynching, while their names were published in local newspapers. Because local sheriffs and judges were frequently Klan members or sympathizers, Black applicants knew that the law would offer no protection, creating a paralyzing climate of fear that suppressed political mobilization.<br><br>Finally, voter registration was systematically blocked by <strong>economic coercion orchestrated by White Citizens\' Councils</strong>. Founded in 1954, these networks of white bankers, merchants, and landlords retaliated against any Black individual attempting to exercise civil rights. Black applicants were immediately dismissed from employment, evicted from tenant farms, and denied bank credit and mortgages. This economic stranglehold ensured that even Black citizens willing to risk physical violence were deterred by the immediate prospect of financial ruin for their families.',
        scaffolding: {
          acronym: 'PEEL Structure Strip',
          acronym_title: '3-Paragraph Causal Analysis (PEEL • 12 Marks)',
          steps: [
            { letter: 'P1', name: '1. Legal & Bureaucratic Barriers', prompt: 'Biased literacy tests and poll taxes enforced arbitrarily by all-white registrars.' },
            { letter: 'P2', name: '2. Terror & Physical Violence', prompt: 'KKK night raids, firebombings, and lynchings operating with total judicial immunity.' },
            { letter: 'P3', name: '3. Economic Coercion (Own Knowledge)', prompt: 'White Citizens\' Councils firing activists, canceling mortgages, and evicting sharecroppers.' }
          ]
        }
      }
    ]
  },

  lesson_1_2: {
    title: 'Edexcel GCSE (9–1) Paper 3 Exam Practice',
    tariff: 'Section B: Question 3(a) (8 marks)',
    stimulus: [
      {
        title: 'Source B: From the Unanimous Supreme Court Ruling in Brown v. Board of Education, Delivered by Chief Justice Earl Warren, 17 May 1954',
        image: '/units/usa/assets/sources/warren-court-1954.jpg',
        caption: 'Chief Justice Earl Warren and the associate justices of the US Supreme Court who ruled unanimously (9-0) that racial segregation in public schools violates the 14th Amendment.',
        provenance: 'From the official unanimous opinion delivered by Chief Justice Earl Warren in Brown v. Board of Education of Topeka, 347 U.S. 483 (1954).',
        extract: '"Does segregation of children in public schools solely on the basis of race, even though the physical facilities and other \'tangible\' factors may be equal, deprive the children of the minority group of equal educational opportunities? We believe that it does... To separate them from others of similar age and qualifications solely because of their race generates a feeling of inferiority as to their status in the community that may affect their hearts and minds in a way unlikely ever to be undone... We conclude that in the field of public education the doctrine of \'separate but equal\' has no place. Separate educational facilities are inherently unequal."'
      },
      {
        title: 'Source C: Contemporary Press Photograph of Elizabeth Eckford Facing a Hostile Segregationist Mob Outside Little Rock Central High School, Arkansas, 4 September 1957',
        image: '/units/usa/assets/sources/elizabeth-eckford-mob.jpg',
        caption: 'Fifteen-year-old Elizabeth Eckford walking calmly towards Central High School while surrounded by an angry crowd of white adults and teenagers screaming racial insults.',
        provenance: 'Photograph by Will Counts for the Arkansas Democrat, 4 September 1957; published internationally across newspapers and magazines.',
        extract: 'Fifteen-year-old Elizabeth Eckford, one of the nine Black students attempting to desegregate Little Rock Central High School, clutches her school books and walks calmly forward as an enraged crowd of white segregationist adults and students shout racial epithets and threats behind her. National Guardsmen deployed by Governor Faubus turned her away with bayonets.'
      }
    ],
    questions: [
      {
        tariff: '8 marks',
        type: 'utility_8m',
        marks: 8,
        question: 'Study Sources B and C. How useful are Sources B and C for an enquiry into the challenges facing the desegregation of schools in the Southern states between 1954 and 1957?',
        prompt: 'Evaluate both sources using Content, Contextual Knowledge (Brown v. Board 1954, Brown II \'all deliberate speed\', Southern Manifesto 1956, Little Rock Nine 1957, Eisenhower deploying 101st Airborne), and Provenance.',
        model: 'Source B is exceptionally useful because it provides the official legal foundation of the challenge to educational segregation. In his unanimous 9–0 opinion, Chief Justice Earl Warren overturns the 1896 Plessy v. Ferguson doctrine, ruling that separate educational facilities are \'inherently unequal\' and generate irreversible psychological harm. From my historical knowledge, this was a revolutionary judicial turning point, inspiring the NAACP and civil rights legal teams led by Thurgood Marshall. As an official Supreme Court ruling, its provenance gives it the highest legal authority, demonstrating the federal government\'s constitutional commitment to integration.<br><br>Source C is equally useful because it exposes the fierce, grassroots resistance to desegregation on the ground in the Deep South. The photograph captures 15-year-old Elizabeth Eckford facing a snarling white mob at Little Rock Central High School in September 1957. From my knowledge, Arkansas Governor Orval Faubus had deployed the National Guard to block the \'Little Rock Nine\', forcing President Eisenhower to send 1,200 soldiers of the 101st Airborne Division to escort the students with fixed bayonets. As an uncensored press photograph published internationally, Source C provides authentic visual evidence of the violent social hostility that made federal enforcement necessary. However, neither source details the legislative resistance of the 101 congressmen who signed the 1956 Southern Manifesto. Overall, both sources are highly useful: Source B reveals the legal breakthrough of desegregation, while Source C captures the explosive community backlash it provoked.',
        scaffolding: {
          acronym: 'Source Utility Framework (AO3)',
          acronym_title: 'Section B: Question 3(a) • Utility of Sources B & C [8 Marks • 12 Mins]',
          steps: [
            { letter: 'SOURCE B', name: '1. Source B Content & Context', prompt: 'Explain how Warren\'s 9-0 ruling overturned \'separate but equal\' and analyse its legal authority.' },
            { letter: 'SOURCE C', name: '2. Source C Content & Context', prompt: 'Analyse the Little Rock mob photograph and Faubus\'s defiance requiring Eisenhower\'s 101st Airborne.' },
            { letter: 'SYNTHESIS', name: '3. Provenance & Synthesis', prompt: 'Interrogate the nature and origin of both official judicial text and photojournalism; reach a balanced conclusion.' }
          ]
        }
      }
    ]
  },

  lesson_1_3: {
    title: 'Edexcel GCSE (9–1) Paper 3 Exam Practice',
    tariff: 'Section B: Questions 3(b) & 3(c) (4 marks & 4 marks)',
    stimulus: [
      {
        title: 'Interpretation 1: From historian Danielle L. McGuire, \'At the Dark End of the Street: Black Women, Rape, and Resistance\', published in 2010',
        content: '"The Montgomery Bus Boycott was fundamentally the achievement of organized Black working-class women. Long before national male leaders arrived, Jo Ann Robinson and the Women’s Political Council had methodically planned a bus strike. Within hours of Rosa Parks’ arrest, Robinson spent the night mimeographing 35,000 leaflets. Over the next 381 days, thousands of domestic maids and cooks walked up to twelve miles a day in freezing winter and blistering summer, while local drivers ran an intricate 300-car dispatch network. It was this daily grassroots courage and economic sacrifice—depriving the bus company of over 70% of its passengers—that brought Montgomery to its knees."'
      },
      {
        title: 'Interpretation 2: From historian David L. Lewis, \'King: A Critical Biography\', published in 1970',
        content: '"While grassroots logistics sustained the boycott, the movement achieved national momentum and ultimate victory because of the charismatic moral leadership of Dr Martin Luther King Jr. King provided the strategic vision and rhetorical genius that unified disparate local factions and prevented violent retaliation despite firebombings and arrests. He framed the local dispute as a national crusade for Christian justice, attracting essential northern financial support and national media coverage. Crucially, local economic pressure alone could not change municipal segregation laws; success ultimately depended on the legal strategy that secured the Supreme Court’s Browder v. Gayle ruling."'
      },
      {
        title: 'Source B: From a protest flyer mimeographed and distributed in Montgomery, 2 December 1955',
        content: '"Another woman has been arrested and thrown into jail because she refused to get up out of her seat on the bus for a white person... This has to be stopped. Negroes have rights too. If Negroes did not ride the buses, they could not operate; three-fourths of the riders are Negroes. We are asking every Negro to stay off the buses on Monday in protest of the arrest and trial. Don’t ride the buses to work, to town, to school, or anywhere on Monday. If you must work, take a cab, or share a ride, or walk."',
        provenance: 'Protest leaflet written and mimeographed overnight by Jo Ann Robinson and the Women’s Political Council (WPC), distributing 35,000 copies across Montgomery.'
      },
      {
        title: 'Source C: From an address by Dr Martin Luther King Jr. to the Montgomery Improvement Association, 5 December 1955',
        content: '"We are here this evening for serious business. We are here in a general sense because first and foremost we are American citizens, and we are determined to apply our citizenship to the fullness of its meaning... There comes a time when people get tired of being trampled over by the iron feet of oppression. Our method will be that of persuasion, not coercion. We will say to the people: let your conscience be your guide. Our actions must be guided by the highest Christian principles of love and non-violence."',
        provenance: 'Delivered by Dr Martin Luther King Jr. at Holt Street Baptist Church to over 5,000 citizens at the first mass rally of the boycott.'
      }
    ],
    questions: [
      {
        tariff: '4 marks',
        type: 'difference_4m',
        marks: 4,
        question: 'Study Interpretations 1 and 2. They give different views about the main reason why the Montgomery Bus Boycott succeeded (1955–56). What is the main difference between these views? Explain your answer, using details from both interpretations.',
        prompt: 'Explain the fundamental difference between the two interpretations, quoting details from both to support your answer.',
        model: 'The main difference is that Interpretation 1 attributes the success of the boycott to the grassroots mobilization, planning, and economic sacrifice of working-class Black women, whereas Interpretation 2 argues that success was primarily driven by Dr Martin Luther King Jr.\'s charismatic moral leadership and federal legal action.<br><br>Interpretation 1 states that the boycott was \'fundamentally the achievement of organized Black working-class women\' like Jo Ann Robinson and domestic workers who walked up to twelve miles daily and ran an intricate 300-car pool. In contrast, Interpretation 2 emphasizes King\'s \'rhetorical genius\' in preventing violence and framing the boycott as a national Christian crusade, arguing that local economic pressure was insufficient and that success ultimately depended on the Supreme Court\'s Browder v. Gayle ruling.',
        scaffolding: {
          acronym: 'Difference + Quotes Formula (AO4)',
          acronym_title: 'Historiographical Comparison [4 Marks • 6 Mins]',
          steps: [
            { letter: 'D', name: '1. Main Difference', prompt: 'State the fundamental disagreement: grassroots women\'s economic sacrifice vs Dr King\'s charismatic leadership and legal ruling.' },
            { letter: 'I1', name: '2. Detail from Interp 1', prompt: 'Quote and explain specific details from Interpretation 1 (WPC leaflets, walking 12 miles, 70% passenger loss).' },
            { letter: 'I2', name: '3. Detail from Interp 2', prompt: 'Quote and explain contrasting details from Interpretation 2 (King\'s Christian non-violence, national media, Browder v Gayle).' }
          ]
        }
      },
      {
        tariff: '4 marks',
        type: 'reason_4m',
        marks: 4,
        question: 'Suggest one reason why Interpretations 1 and 2 give different views about the main reason why the Montgomery Bus Boycott succeeded (1955–56). You may use Sources B and C to help explain your answer.',
        prompt: 'Explain why the historians reached contrasting conclusions by analysing how they investigated different types of primary evidence.',
        model: 'The historians give different views because they have investigated different types of primary evidence. The author of Interpretation 1 has focused on grassroots evidence such as Source B, which highlights how Jo Ann Robinson and the Women\'s Political Council organized 35,000 flyers overnight and leveraged the economic power of Black riders (who made up three-fourths of bus passengers). In contrast, the author of Interpretation 2 has drawn upon evidence such as Source C, emphasizing Dr King\'s philosophical oratory at Holt Street Baptist Church and his leadership in preaching Christian non-violence and constitutional citizenship to national audiences.',
        scaffolding: {
          acronym: 'Reason for Difference Formula (AO4)',
          acronym_title: 'Why Historians Disagree [4 Marks • 6 Mins]',
          steps: [
            { letter: 'R', name: '1. Root Reason', prompt: 'State clearly that the historians relied on different types of sources or emphasized different aspects of the boycott.' },
            { letter: 'SB', name: '2. Evidence for Interp 1', prompt: 'Show how Source B (WPC flyer, economic pressure) supports the grassroots focus of Interpretation 1.' },
            { letter: 'SC', name: '3. Evidence for Interp 2', prompt: 'Show how Source C (King\'s church address, moral non-violence) supports the leadership focus of Interpretation 2.' }
          ]
        }
      }
    ]
  },

  lesson_1_4: {
    title: 'Edexcel GCSE (9–1) Paper 3 Exam Practice',
    tariff: 'Section B: Question 3(d) (16 marks (+4 SPaG))',
    stimulus: [
      {
        title: 'Interpretation 1: From an academic study of Southern politics and the civil rights movement, published in 2004',
        content: '"The primary obstacle to school desegregation was the top-down campaign of \'Massive Resistance\' coordinated by Southern political elites. When 101 congressmen signed the Southern Manifesto in 1956, they gave official state-sanctioned legitimacy to defiance against the federal judiciary. Southern governors and state legislatures passed dozens of laws to block integration, cut off state funding to integrated schools, and mobilized state troopers to bar Black children at schoolhouse doors. Without this active political leadership, local resistance would have fragmented and collapsed far more quickly."'
      },
      {
        title: 'Interpretation 2: From a social history of white resistance in the American South, published in 2011',
        content: '"The real engine of resistance to school integration came from below, through deep-rooted white racial hostility and grassroots mobilisation. Organisations like the White Citizens\' Councils—which enrolled over 250,000 members—wielded devastating economic coercion against Black families, while the Ku Klux Klan engaged in terrorist bombings and intimidation. In communities across Virginia, Mississippi, and Alabama, white parents and local school boards closed public schools altogether and established private \'segregation academies\'. Resistance was a deeply held communal conviction rather than a creation of politicians."'
      }
    ],
    questions: [
      {
        tariff: '16 marks (+4 SPaG)',
        type: 'verdict_16m',
        marks: 16,
        question: 'How far do you agree with Interpretation 2 about the reasons why Southern states resisted school desegregation after Brown v. Board of Education (1954)? Explain your answer, using both interpretations and your knowledge of the historical context.',
        prompt: 'Use the structure strip and historical guidance below to structure your response.',
        model: 'On the one hand, Interpretation 1 is supported by compelling historical evidence showing that top-down political leadership and the policy of \'Massive Resistance\' organised by Southern elites were fundamental in blocking school desegregation. Following the Brown ruling, 101 Southern congressmen signed the \'Southern Manifesto\' in March 1956, declaring the Supreme Court decision a \'clear abuse of judicial power\' and pledging to resist federal orders by all lawful means. State governors translated this rhetoric into direct executive obstruction: at Little Rock in 1957, Arkansas Governor Orval Faubus deployed the state National Guard with fixed bayonets to turn away nine Black students. This state-level resistance gave legal respectability and official encouragement to white resistance.<br><br>On the other hand, Interpretation 2 offers an equally powerful argument by showing that resistance was driven from below by entrenched grassroots white racism and economic terrorism. White Citizens\' Councils grew rapidly to over 250,000 members across the Deep South, orchestrating coordinated economic warfare against Black families: activists had their names published in local papers, resulting in immediate job dismissals, mortgage cancellations, and eviction of sharecroppers. Concurrently, the Ku Klux Klan engaged in terrorist firebombings and lynchings (such as the murder of Emmett Till in 1955). In Prince Edward County, Virginia, local white authorities closed down the entire public school system for five years rather than integrate, funding private all-white \'segregation academies\'. This proves that defiance was deeply woven into white Southern culture, rather than being an elite fabrication.<br><br>Furthermore, contextual analysis demonstrates that the Supreme Court itself inadvertently facilitated resistance through its 1955 Brown II ruling, which ambiguously ordered desegregation with \'all deliberate speed\'. This lack of a rigid timetable allowed Southern school boards to obstruct integration through endless legal appeals and bureaucratic pupil-placement laws.<br><br>In conclusion, having evaluated both interpretations, I agree with Interpretation 2 to a very large extent. While Southern governors and congressmen provided ideological justification and legal cover, it was the ferocious, community-wide white backlash, economic boycotts, and vigilante terror at the grassroots level that made school integration virtually non-existent across the Deep South for over a decade after Brown.',
        scaffolding: {
          acronym: 'Interpretation Verdict Framework (AO4)',
          acronym_title: 'Section B: Question 3(d) • Evaluative Assessment [16 Marks + 4 SPaG • 25 Mins]',
          steps: [
            { letter: 'INTERP 2', name: '1. Support Interpretation 2 (Grassroots Terror & Economic Pressure)', prompt: 'Deploy evidence of White Citizens\' Councils (250,000 members), KKK violence, and closure of public schools.' },
            { letter: 'INTERP 1', name: '2. Support Interpretation 1 (Top-Down Massive Resistance)', prompt: 'Deploy evidence of the Southern Manifesto (101 congressmen) and Faubus\'s deployment of the National Guard.' },
            { letter: 'VERDICT', name: '3. Sustained Historical Conclusion', prompt: 'Weigh both interpretations alongside Brown II (\'all deliberate speed\') to judge whether grassroots terror was decisive.' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // KEY TOPIC 2: THE RADICALISATION OF THE CIVIL RIGHTS MOVEMENT, 1965–68
  // =========================================================================
  lesson_2_1: {
    title: 'Edexcel GCSE (9–1) Paper 3 Exam Practice',
    tariff: 'Section A: Questions 1 & 2 (4 marks & 12 marks)',
    stimulus: [
      {
        title: 'Source A: Police Dogs Lunging at High School Demonstrators, Birmingham, Alabama, 3 May 1963',
        image: '/units/usa/assets/sources/birmingham-protests-dogs-1963.jpg',
        caption: 'Birmingham police officer Dick Pence holds the leash of a German Shepherd attack dog lunging at fifteen-year-old Walter Gadsden during the Children’s Crusade.',
        provenance: 'Photograph taken by Bill Hudson for the Associated Press on 3 May 1963; published across front pages of national and international newspapers.',
        extract: 'Birmingham police officer Dick Pence holds the leash of a German Shepherd attack dog as it lunges at fifteen-year-old student Walter Gadsden during the Children’s Crusade. High-pressure fire hoses and attack dogs were deployed on unarmed teenage marchers on the orders of Eugene ‘Bull’ Connor.'
      }
    ],
    questions: [
      {
        tariff: '4 marks',
        type: 'inference_4m',
        marks: 4,
        question: 'Give two things you can infer from Source A about the methods used by Southern police against civil rights demonstrators in Birmingham, Alabama (1963).',
        prompt: 'Give two separate valid inferences. Support each inference with direct visual or textual details from Source A.',
        model: '<p><strong>(i) What I can infer:</strong><br>I can infer that Southern police authorities deployed extreme physical intimidation and vicious attack dogs against young civil rights demonstrators.<br><strong>Details in the source that tell me this:</strong><br>The photograph shows a uniformed police officer gripping the leash of a snarling German Shepherd attack dog as it lunges directly at the stomach of a teenage demonstrator.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that civil rights marchers maintained non-violent discipline and composure even when confronted with terrifying police aggression.<br><strong>Details in the source that tell me this:</strong><br>The high school student (Walter Gadsden) stands calmly with his hands down, not running away, attacking the officer, or retaliating violently.</p>',
        scaffolding: {
          acronym: 'Inference Formula (AO3)',
          acronym_title: 'Inference + Supporting Detail (2 Points • 4 Marks)',
          steps: [
            { letter: 'I1', name: '1. First Valid Inference', prompt: 'State what the source reveals about police methods in Birmingham.' },
            { letter: 'D1', name: '2. Supporting Detail', prompt: 'Quote or describe specific visual evidence of police dogs and handlers from Source A.' },
            { letter: 'I2', name: '3. Second Valid Inference', prompt: 'Identify a second valid insight regarding demonstrator discipline or authority brutality.' },
            { letter: 'D2', name: '4. Supporting Detail', prompt: 'Provide specific visual details confirming the student\'s calm demeanor.' }
          ]
        }
      },
      {
        tariff: '12 marks',
        type: 'explain_why_12',
        marks: 12,
        question: 'Explain why the Civil Rights Act was passed in 1964.',
        stimulus: [
          'The Birmingham Campaign (1963)',
          'The assassination of President Kennedy (November 1963)'
        ],
        prompt: 'You may use the following in your answer: (1) The Birmingham Campaign (1963), (2) The assassination of President Kennedy (November 1963). You must also use information of your own.',
        model: 'A primary catalyst for the passage of the 1964 Civil Rights Act was the national and international outrage generated by the <strong>Birmingham Campaign</strong> in May 1963. SCLC leader Martin Luther King Jr. deliberately chose Birmingham to expose the extreme violence of segregationist authorities. When Public Safety Commissioner Eugene ‘Bull’ Connor turned high-pressure fire hoses and police attack dogs on marching schoolchildren, the scenes were broadcast on television across the globe. This visual brutality horrified millions of northern white voters and severely damaged American diplomatic prestige during the Cold War, forcing President John F. Kennedy to publicly announce comprehensive civil rights legislation on national television in June 1963.<br><br>Furthermore, the <strong>assassination of President Kennedy</strong> in November 1963 provided the crucial moral and emotional impetus needed to pass the bill. When Lyndon B. Johnson assumed the presidency, he skillfully utilized Kennedy’s martyrdom to overcome legislative obstruction. Johnson addressed a joint session of Congress, declaring that "no memorial oration or eulogy could more eloquently honor President Kennedy’s memory than the earliest possible passage of the civil rights bill." This emotional appeal made it politically toxic for moderate congressmen to oppose the legislation, transforming Kennedy’s draft into an urgent national tribute.<br><br>Finally, the passage of the Act was secured by the immense public pressure generated by the <strong>March on Washington in August 1963</strong>, combined with President Johnson’s legislative mastery. Over 250,000 peaceful demonstrators gathered at the Lincoln Memorial, where King delivered his iconic ‘I Have a Dream’ speech. When Southern Democratic senators launched a historic 54-day filibuster to kill the bill, Johnson utilized his formidable Senate expertise to forge a bipartisan coalition with Republican leader Everett Dirksen, securing the two-thirds supermajority required to break the filibuster and sign the historic Act on 2 July 1964.',
        scaffolding: {
          acronym: 'PEEL Structure Strip',
          acronym_title: '3-Paragraph Causal Analysis (PEEL • 12 Marks)',
          steps: [
            { letter: 'P1', name: '1. Birmingham & Televised Shock', prompt: 'Connor’s brutal crackdown on children horrified northern public opinion and damaged US global prestige.' },
            { letter: 'P2', name: '2. Kennedy’s Assassination & LBJ', prompt: 'Johnson used JFK’s martyrdom as an unstoppable moral mandate to push the bill through Congress.' },
            { letter: 'P3', name: '3. March on Washington & Breaking Filibuster', prompt: '250,000 demonstrators and LBJ\'s coalition breaking the 54-day Senate filibuster.' }
          ]
        }
      }
    ]
  },

  lesson_2_2: {
    title: 'Edexcel GCSE (9–1) Paper 3 Exam Practice',
    tariff: 'Section B: Question 3(a) (8 marks)',
    stimulus: [
      {
        title: 'Source B: From the Official Report of the National Advisory Commission on Civil Disorders (The Kerner Commission), March 1968',
        provenance: 'From the official report presented to President Lyndon B. Johnson by the Kerner Commission, established to investigate the causes of urban riots.',
        extract: '"Our nation is moving toward two societies, one black, one white—separate and unequal... Segregation and poverty have created in the racial ghetto a destructive environment totally unknown to white Americans. What white Americans have never fully understood—but what the Negro can never forget—is that white society is deeply implicated in the ghetto. White institutions created it, white institutions maintain it, and white society condones it. Pervasive discrimination in employment and housing, coupled with routine police harassment, has generated a reservoir of frustration that ignited in Watts, Newark, and Detroit."'
      },
      {
        title: 'Source C: From a Speech by Stokely Carmichael, Chairman of SNCC, Addressing a Mass Rally in Chicago, July 1966',
        provenance: 'Speech delivered by SNCC chairman Stokely Carmichael to young Black activists at a Chicago civil rights rally, July 1966.',
        extract: '"We have been begging the white man for freedom for over a century, singing ‘We Shall Overcome’ while his police beat our heads and his judges throw us in jail. Non-violence has failed to protect Black people in the northern slums. The Civil Rights Act did not give our brothers jobs; it did not tear down the rats and roaches in Harlem and Chicago! Black Power means Black people coming together to build a power base, so that when the police come into our communities with clubs and guns, they know we can defend ourselves!"'
      }
    ],
    questions: [
      {
        tariff: '8 marks',
        type: 'utility_8m',
        marks: 8,
        question: 'Study Sources B and C. How useful are Sources B and C for an enquiry into the causes of the riots in northern and western cities between 1965 and 1967?',
        prompt: 'Evaluate both sources using Content, Contextual Knowledge (Watts 1965, Chicago Movement 1966, Newark & Detroit 1967, Kerner Commission findings, rise of Black Power), and Provenance.',
        model: 'Source B is highly useful because it provides official, authoritative government evidence of the deep structural and economic causes of urban unrest. Commissioned by President Johnson following the devastating Detroit and Newark riots of 1967, the Kerner Report boldly concluded that "white society is deeply implicated in the ghetto." The content reveals that discriminatory employment, redlined housing, and routine police harassment created an explosive "reservoir of frustration." Its provenance as an official federal investigation gives it exceptional utility, as it represents the first time the US government officially acknowledged institutional white racism and economic deprivation as the root causes of urban rebellion.<br><br>Source C is equally useful because it provides immediate eyewitness insight into the radical ideological mindset of young Black activists in the northern ghettos. In this July 1966 Chicago speech, SNCC leader Stokely Carmichael explicitly repudiates Martin Luther King’s philosophy of Christian non-violence, arguing that the 1964 Civil Rights Act brought no material benefits to northern slums. He calls for Black Power and armed self-defense against police brutality. Its provenance as a contemporary political speech by the foremost proponent of Black Power gives it tremendous utility for showing how ideological radicalisation and anger at police misconduct turned urban youth toward active defiance. However, Carmichael was deliberately using fiery rhetoric to mobilize crowds, meaning he focuses on political militancy rather than detailed statistics. Overall, both sources are extremely useful: Source B reveals the socio-economic conditions of the ghetto, while Source C captures the explosive ideological fury that ignited the riots.',
        scaffolding: {
          acronym: 'Source Utility Framework (AO3)',
          acronym_title: 'Section B: Question 3(a) • Utility of Sources B & C [8 Marks • 12 Mins]',
          steps: [
            { letter: 'SOURCE B', name: '1. Source B Content & Context', prompt: 'Examine the Kerner Commission findings on systemic racism, redlining, and police harassment.' },
            { letter: 'SOURCE C', name: '2. Source C Content & Context', prompt: 'Analyse Carmichael\'s rejection of non-violence and demand for armed community self-defense.' },
            { letter: 'SYNTHESIS', name: '3. Provenance & Synthesis', prompt: 'Interrogate the contrast between an official government report and a radical activist speech; reach a balanced verdict.' }
          ]
        }
      }
    ]
  },

  lesson_2_3: {
    title: 'Edexcel GCSE (9–1) Paper 3 Exam Practice',
    tariff: 'Section B: Questions 3(b) & 3(c) (4 marks & 4 marks)',
    stimulus: [
      {
        title: 'Interpretation 1: From historian Thomas J. Sugrue, \'Sweet Land of Liberty: The Forgotten Struggle for Civil Rights in the North\', published in 2008',
        content: '"The urban rebellions of 1965 to 1967 were fundamentally explosions of anger against entrenched economic inequality, racial ghettoization, and pervasive employment discrimination in the urban North and West. For decades, Black families migrating from the South were trapped in substandard, overpriced housing by predatory real estate practices and bank redlining. De-industrialisation eliminated well-paying manufacturing jobs, leaving young Black men facing unemployment rates exceeding thirty percent. When white police forces—viewed by residents as occupying armies—engaged in routine brutality, neighborhoods erupted in spontaneous, desperate fury against a system that denied them economic dignity."'
      },
      {
        title: 'Interpretation 2: From historian Clayborne Carson, \'In Struggle: SNCC and the Black Awakening of the 1960s\', published in 1981',
        content: '"The urban outbreaks cannot be understood simply as economic distress; they were catalyzed by a profound ideological transformation: the rise of Black Power and militant Black nationalism. Inspired by the uncompromising rhetoric of Malcolm X and popularized by Stokely Carmichael, younger activists completely rejected Martin Luther King’s philosophy of non-violence and interracial integration. Black Power taught urban youth that non-violence was humiliating and ineffective, encouraging them instead to confront white institutional power directly. The fiery speeches of SNCC and Black Panther leaders gave voice and political legitimacy to rebellion, transforming street unrest into conscious acts of defiance against white authority."'
      },
      {
        title: 'Source B: From the Official Report of the National Advisory Commission on Civil Disorders (Kerner Commission), March 1968',
        content: '"Segregation and poverty have created in the racial ghetto a destructive environment totally unknown to white Americans... Pervasive discrimination in employment and housing, coupled with routine police harassment, has generated a reservoir of frustration that ignited in Watts, Newark, and Detroit."',
        provenance: 'From the official report presented to President Lyndon B. Johnson by the Kerner Commission, March 1968.'
      },
      {
        title: 'Source C: From a Speech by Stokely Carmichael, Chairman of SNCC, Chicago, July 1966',
        content: '"Non-violence has failed to protect Black people in the northern slums. The Civil Rights Act did not give our brothers jobs; it did not tear down the rats and roaches in Harlem and Chicago! Black Power means Black people coming together to build a power base, so that when the police come into our communities with clubs and guns, they know we can defend ourselves!"',
        provenance: 'Speech delivered by SNCC chairman Stokely Carmichael at a Chicago mass rally, July 1966.'
      }
    ],
    questions: [
      {
        tariff: '4 marks',
        type: 'difference_4m',
        marks: 4,
        question: 'Study Interpretations 1 and 2. They give different views about the main cause of the urban riots between 1965 and 1967. What is the main difference between these views? Explain your answer, using details from both interpretations.',
        prompt: 'Explain the fundamental disagreement between the two interpretations, quoting details from both to support your answer.',
        model: 'The main difference is that Interpretation 1 argues that the urban riots were driven primarily by entrenched economic inequality, poverty, and housing redlining, whereas Interpretation 2 argues that the riots were catalyzed by an ideological shift towards Black Power, militant nationalism, and the rejection of non-violence.<br><br>Interpretation 1 emphasizes that riots were \'explosions of anger against entrenched economic inequality\' where Black citizens were trapped in substandard housing and faced \'unemployment rates exceeding thirty percent\'. In contrast, Interpretation 2 asserts that unrest was caused by a \'profound ideological transformation\' inspired by Malcolm X and Stokely Carmichael, which taught youth that non-violence was \'humiliating and ineffective\' and legitimized direct confrontation against white authority.',
        scaffolding: {
          acronym: 'Difference + Quotes Formula (AO4)',
          acronym_title: 'Historiographical Comparison [4 Marks • 6 Mins]',
          steps: [
            { letter: 'D', name: '1. Main Difference', prompt: 'State the fundamental disagreement: socio-economic deprivation vs Black Power ideological radicalisation.' },
            { letter: 'I1', name: '2. Detail from Interp 1', prompt: 'Quote and explain details from Interpretation 1 (economic inequality, redlining, 30% unemployment).' },
            { letter: 'I2', name: '3. Detail from Interp 2', prompt: 'Quote and explain details from Interpretation 2 (Black Power, Malcolm X, rejection of non-violence).' }
          ]
        }
      },
      {
        tariff: '4 marks',
        type: 'reason_4m',
        marks: 4,
        question: 'Suggest one reason why Interpretations 1 and 2 give different views about the main cause of the urban riots between 1965 and 1967. You may use Sources B and C to help explain your answer.',
        prompt: 'Explain why the historians reached contrasting conclusions by analysing how they investigated different types of primary evidence.',
        model: 'The historians have different views because they have relied on different types of historical evidence. The author of Interpretation 1 has focused on official socio-economic investigations such as the Kerner Commission Report in Source B, which emphasized structural poverty, housing redlining, and police harassment as the root causes creating a \'reservoir of frustration\'. In contrast, the author of Interpretation 2 has examined radical political speeches and activist manifestos such as Source C, emphasizing the fiery rhetoric of Stokely Carmichael and the appeal of Black Power in encouraging urban youth to abandon non-violence and defend themselves against police.',
        scaffolding: {
          acronym: 'Reason for Difference Formula (AO4)',
          acronym_title: 'Why Historians Disagree [4 Marks • 6 Mins]',
          steps: [
            { letter: 'R', name: '1. Root Reason', prompt: 'State clearly that the historians investigated different types of primary records and historical dimensions.' },
            { letter: 'SB', name: '2. Evidence for Interp 1', prompt: 'Show how Source B (Kerner Report, poverty, redlining) influenced the socio-economic view in Interpretation 1.' },
            { letter: 'SC', name: '3. Evidence for Interp 2', prompt: 'Show how Source C (Carmichael speech, Black Power, self-defense) influenced the ideological view in Interpretation 2.' }
          ]
        }
      }
    ]
  },

  lesson_2_4: {
    title: 'Edexcel GCSE (9–1) Paper 3 Exam Practice',
    tariff: 'Section B: Question 3(d) (16 marks (+4 SPaG))',
    stimulus: [
      {
        title: 'Interpretation 1: From an academic study of the Black Power movement and civil rights, published in 2008',
        content: '"The urban rebellions were fundamentally the outcome of severe, unaddressed socio-economic deprivation in northern ghettos. African Americans in cities like Los Angeles, Detroit, and Newark were trapped in substandard housing, suffered from substandard schools, and faced catastrophic youth unemployment rates above 30%. The civil rights legislation of 1964 and 1965 addressed Southern legal segregation but did virtually nothing to alleviate the economic misery of northern inner cities. When oppressive police forces acted with routine brutality, communities exploded in spontaneous, desperate anger against structural economic racism."'
      },
      {
        title: 'Interpretation 2: From a social and economic history of urban America in the 1960s, published in 2014',
        content: '"The spread and intensity of urban riots cannot be understood without examining the ideological transformation wrought by Black Power and Malcolm X. Younger African Americans in northern cities became completely disillusioned with Martin Luther King\'s philosophy of non-violence, viewing it as slow, passive, and humiliating. The fiery militant rhetoric of Stokely Carmichael, the Nation of Islam, and the Black Panther Party gave ideological legitimacy to confrontation and anti-police violence. It was this radicalized consciousness, rather than economic conditions alone, that transformed localized street disturbances into revolutionary urban rebellions."'
      }
    ],
    questions: [
      {
        tariff: '16 marks (+4 SPaG)',
        type: 'verdict_16m',
        marks: 16,
        question: 'How far do you agree with Interpretation 2 about the causes of the riots in northern and western cities between 1965 and 1967? Explain your answer, using both interpretations and your knowledge of the historical context.',
        prompt: 'Use the structure strip and historical guidance below to structure your response.',
        model: 'On the one hand, Interpretation 2 correctly highlights the decisive influence of Black Power and militant Black nationalism in fostering an uncompromising climate of resistance. Following the assassination of Malcolm X in 1965 and Stokely Carmichael’s declaration of \'Black Power\' in 1966, younger northern activists decisively broke with Martin Luther King’s philosophy of Christian non-violence. Groups like the Black Panther Party for Self-Defense, founded in Oakland in 1966 by Huey Newton and Bobby Seale, armed themselves to monitor police activities and openly advocated armed community defense. This radical rhetoric gave ideological justification to young men in northern cities who felt that passive integration was a failure, transforming street altercations into conscious political revolts against white authority.<br><br>On the other hand, Interpretation 1 provides an equally compelling explanation by demonstrating that the fundamental, underlying causes of the riots were entrenched socio-economic deprivation and institutional racism. While the 1964 Civil Rights Act and 1965 Voting Rights Act dismantled de jure Jim Crow laws in the South, they did almost nothing to tackle de facto segregation, job discrimination, and poverty in northern slums. The landmark 1968 Kerner Commission report confirmed this reality, famously warning that America was \'moving toward two societies, one black, one white—separate and unequal\'. In cities like Watts (1965), Newark (1967), and Detroit (1967), Black unemployment hovered around 30%, while predatory real estate redlining confined families to overcrowded, rat-infested tenements with underfunded schools. These miserable conditions created an explosive reservoir of despair.<br><br>Furthermore, contextual knowledge reveals that in virtually every riot (such as Watts in August 1965, which resulted in 34 deaths and $40m damage), the immediate spark was an incident of police brutality by overwhelmingly white police departments viewed by local residents as an occupying army. King himself acknowledged this during his 1966 Chicago Campaign, when he was struck by a rock and admitted that northern white hostility was even more vicious than in the South.<br><br>In conclusion, having evaluated both interpretations, I agree with Interpretation 2 only to a moderate extent. While Black Power rhetoric provided the fiery vocabulary and militant confidence for urban unrest, it was the crushing reality of economic deprivation, ghetto redlining, and systemic police brutality outlined in Interpretation 1 that provided the explosive fuel without which no riots could have occurred.',
        scaffolding: {
          acronym: 'Interpretation Verdict Framework (AO4)',
          acronym_title: 'Section B: Question 3(d) • Evaluative Assessment [16 Marks + 4 SPaG • 25 Mins]',
          steps: [
            { letter: 'INTERP 2', name: '1. Support Interpretation 2 (Black Power & Ideological Militancy)', prompt: 'Deploy evidence of Malcolm X, Stokely Carmichael, the Black Panthers (Oakland 1966), and the rejection of non-violence.' },
            { letter: 'INTERP 1', name: '2. Support Interpretation 1 (Socio-Economic Ghetto Misery)', prompt: 'Deploy evidence from the Kerner Commission (1968), bank redlining, 30% youth unemployment, and Watts (1965).' },
            { letter: 'VERDICT', name: '3. Sustained Historical Conclusion', prompt: 'Weigh both views: judge whether economic misery was the foundational cause while Black Power was the catalyst.' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // KEY TOPIC 3: US INVOLVEMENT IN THE VIETNAM WAR, 1954–68
  // =========================================================================
  lesson_3_1: {
    title: 'Edexcel GCSE (9–1) Paper 3 Exam Practice',
    tariff: 'Section A: Questions 1 & 2 (4 marks & 12 marks)',
    stimulus: [
      {
        title: 'Source A: A US Soldier on Combat Patrol in the Swamps of South Vietnam, 1966',
        image: '/units/usa/assets/sources/us-soldier-patrolling-swamp.jpg',
        caption: 'An American infantryman wades through chest-deep swamp water carrying an M60 machine gun and bandoliers of ammunition during a search-and-destroy mission in the Mekong Delta.',
        provenance: 'Official combat photograph taken by US Army military photographers in South Vietnam, 1966 (US National Archives · Record Group 111).',
        extract: 'An American soldier from the 9th Infantry Division wades through chest-deep swamp water carrying an M60 machine gun and bandoliers of ammunition during a search-and-destroy mission against Vietcong guerrillas in the Mekong Delta.'
      }
    ],
    questions: [
      {
        tariff: '4 marks',
        type: 'inference_4m',
        marks: 4,
        question: 'Give two things you can infer from Source A about the conditions faced by US infantry patrols fighting in South Vietnam (1965–68).',
        prompt: 'Give two separate valid inferences. Support each inference with direct visual or textual details from Source A.',
        model: '<p><strong>(i) What I can infer:</strong><br>I can infer that American soldiers faced exhausting and physically treacherous environmental conditions while patrolling in South Vietnam.<br><strong>Details in the source that tell me this:</strong><br>The soldier is shown submerged up to his chest in murky, stagnant swamp water while pushing through thick wetland vegetation.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that US ground troops were heavily encumbered with cumbersome combat gear and ammunition in an environment unsuited to conventional industrial warfare.<br><strong>Details in the source that tell me this:</strong><br>The soldier must physically hoist a heavy M60 machine gun above his head while draped in multiple heavy bandoliers of metal ammunition belts.</p>',
        scaffolding: {
          acronym: 'Inference Formula (AO3)',
          acronym_title: 'Inference + Supporting Detail (2 Points • 4 Marks)',
          steps: [
            { letter: 'I1', name: '1. First Valid Inference', prompt: 'State what the source reveals about the physical jungle and swamp conditions.' },
            { letter: 'D1', name: '2. Supporting Detail', prompt: 'Quote or describe the chest-deep swamp water from Source A.' },
            { letter: 'I2', name: '3. Second Valid Inference', prompt: 'Identify an insight regarding military equipment and terrain mismatch.' },
            { letter: 'D2', name: '4. Supporting Detail', prompt: 'Describe the heavy M60 machine gun held above the water.' }
          ]
        }
      },
      {
        tariff: '12 marks',
        type: 'explain_why_12',
        marks: 12,
        question: 'Explain why US involvement in Vietnam escalated under President Johnson between 1964 and 1965.',
        stimulus: [
          'The Gulf of Tonkin incident (August 1964)',
          'The attack on the US base at Pleiku (February 1965)'
        ],
        prompt: 'You may use the following in your answer: (1) The Gulf of Tonkin incident (August 1964), (2) The attack on the US base at Pleiku (February 1965). You must also use information of your own.',
        model: 'A decisive turning point that triggered escalation was the <strong>Gulf of Tonkin incident in August 1964</strong>. Following alleged torpedo attacks by North Vietnamese patrol boats against the destroyer USS Maddox, President Johnson used the event to secure the Gulf of Tonkin Resolution from Congress. Passed almost unanimously, this resolution gave Johnson authority to \'take all necessary measures to repel any armed attack\' and prevent further aggression. Crucially, it functioned as a constitutional \'blank check\', allowing the President to wage undeclared, full-scale war in Southeast Asia without needing formal congressional approval.<br><br>This escalation was drastically accelerated by the <strong>Vietcong attack on the US military base at Pleiku</strong> in February 1965. Communist guerrillas launched a surprise mortar strike that killed eight American servicemen and wounded over a hundred. Viewing this as a direct test of American resolve, Johnson immediately authorized Operation Rolling Thunder—a sustained three-year aerial bombing campaign targeting North Vietnamese infrastructure, military installations, and the Ho Chi Minh Trail. This marked the definitive shift from advisory support to active direct warfare.<br><br>Finally, military escalation became inevitable due to the <strong>weakness of the South Vietnamese ARVN and the landing of US combat troops at Da Nang</strong> in March 1965. Air bases housing American bombers required ground security that the demoralized ARVN could not provide. In response, Johnson deployed 3,500 US Marines to Da Nang, marking the first official commitment of American ground combat troops. Driven by the Domino Theory and the fear that South Vietnam would fall to communism, Johnson rapidly expanded US troop levels to over 184,000 by the end of 1965, transforming the conflict into an American-run war.',
        scaffolding: {
          acronym: 'PEEL Structure Strip',
          acronym_title: '3-Paragraph Causal Analysis (PEEL • 12 Marks)',
          steps: [
            { letter: 'P1', name: '1. Gulf of Tonkin Incident & Resolution', prompt: 'Alleged torpedo boat attack giving LBJ congressional authority to wage war without declaration.' },
            { letter: 'P2', name: '2. Pleiku Attack & Operation Rolling Thunder', prompt: 'Vietcong mortar attack on US airbase prompting 3-year sustained aerial bombing campaign.' },
            { letter: 'P3', name: '3. Troop Deployments & Da Nang (Own Knowledge)', prompt: 'Landing of 3,500 Marines in March 1965 to defend air bases, beginning full ground combat commitment.' }
          ]
        }
      }
    ]
  },

  lesson_3_2: {
    title: 'Edexcel GCSE (9–1) Paper 3 Exam Practice',
    tariff: 'Section B: Question 3(a) (8 marks)',
    stimulus: [
      {
        title: 'Source B: From Combat Memoirs by US Marine Lieutenant Philip Caputo, Published in ‘A Rumor of War’ (1977)',
        provenance: 'Written by Philip Caputo, a US Marine lieutenant who commanded combat infantry units in South Vietnam in 1965–66.',
        extract: '"We were sent on ‘search and destroy’ patrols through dense jungle and steaming swamps. The strategy was simple: find the enemy, fix him, and destroy him with massive artillery and air strikes. But we could almost never locate him. The Vietcong fought on their own terms: a sudden burst of fire from concealed tree lines, a sniper round, or an explosive booby trap made from a recycled artillery shell and bamboo punji sticks. When we entered a village, we could not distinguish a friendly farmer by day from a guerrilla fighter by night. Frustrated soldiers burned thatched huts with Zippo lighters, turning the very peasants we were sent to defend into sworn enemies."'
      },
      {
        title: 'Source C: From an Interview with Vo Thi Mo, a Female Vietcong Guerrilla Fighter in Cu Chi District, Recorded in 1982',
        provenance: 'Oral history interview with a veteran Vietcong combatant who operated in the Cu Chi tunnel network throughout the war.',
        extract: '"The Americans possessed immense firepower—jets, helicopters, tanks, and chemical poisons that destroyed our rice crops. But they did not know the forest, and they did not know our people. Beneath the soil, we built over two hundred kilometers of multi-level tunnels with barracks, hospitals, and weapons factories. When their planes bombed, we remained safe twenty feet underground. When their infantry advanced, our booby traps—punji stakes smeared with animal dung, tripwires, and toe-poppers—inflicted daily casualties and wrecked their nerves. We were fighting for our own homeland; their soldiers fought only because they were drafted."'
      }
    ],
    questions: [
      {
        tariff: '8 marks',
        type: 'utility_8m',
        marks: 8,
        question: 'Study Sources B and C. How useful are Sources B and C for an enquiry into the reasons why US military tactics failed to defeat the Vietcong (1965–68)?',
        prompt: 'Evaluate both sources using Content, Contextual Knowledge (Search & Destroy, Operation Rolling Thunder, Agent Orange & Napalm, body counts vs Cu Chi tunnels, punji traps, Ho Chi Minh Trail), and Provenance.',
        model: 'Source B is exceptionally useful because it provides an honest, frontline combat officer’s diagnosis of why American counter-insurgency tactics failed. Written by Marine Lieutenant Philip Caputo, it exposes the fundamental flaws of General Westmoreland’s \'search and destroy\' doctrine. Caputo reveals that US troops could rarely locate the elusive guerrilla enemy, who dictated combat on their own terms using booby traps and ambushes. Furthermore, he explains how \'Zippo raids\' burning peasant villages fatally alienated the civilian population, destroying any hope of winning \'hearts and minds\'. Its provenance as a published memoir by a combat platoon commander gives it high value for explaining the demoralization of American soldiers, although writing a decade later may introduce retrospective reflection.<br><br>Source C is equally valuable because it provides a rare, authentic primary perspective from an active Vietcong guerrilla fighter. Vo Thi Mo details how communist forces effectively neutralized American technological and aerial superiority through asymmetrical warfare: constructing over 200 kilometers of subterranean tunnels in Cu Chi with underground hospitals and workshops, and using homemade booby traps to inflict continuous psychological casualties. She also highlights the immense motivational advantage of fighting for national independence compared to conscripted US draftees. As an oral history interview recorded after the war, Source C may contain patriotic bias, but it accurately reflects the tactical ingenuity and ideological resolve that enabled the Vietcong to survive. Overall, both sources are extremely useful: Source B reveals the fatal flaws of American conventional search-and-destroy methods, while Source C demonstrates the extraordinary resilience and tactical ingenuity of the communist underground resistance.',
        scaffolding: {
          acronym: 'Source Utility Framework (AO3)',
          acronym_title: 'Section B: Question 3(a) • Utility of Sources B & C [8 Marks • 12 Mins]',
          steps: [
            { letter: 'SOURCE B', name: '1. Source B Content & Context', prompt: 'Examine Caputo\'s testimony on search-and-destroy failures, hidden booby traps, and burning peasant huts.' },
            { letter: 'SOURCE C', name: '2. Source C Content & Context', prompt: 'Analyse Vo Thi Mo on Cu Chi tunnels, homemade punji traps, and ideological determination.' },
            { letter: 'SYNTHESIS', name: '3. Provenance & Synthesis', prompt: 'Contrast an American officer\'s combat memoir with a Vietcong guerrilla\'s oral testimony; reach an evaluative verdict.' }
          ]
        }
      }
    ]
  },

  lesson_3_3: {
    title: 'Edexcel GCSE (9–1) Paper 3 Exam Practice',
    tariff: 'Section B: Questions 3(b) & 3(c) (4 marks & 4 marks)',
    stimulus: [
      {
        title: 'Interpretation 1: From historian Christian G. Appy, \'Working-Class War: American Combat Soldiers and Vietnam\', published in 1993',
        content: '"American military tactics were fundamentally mismatched with the political realities of guerrilla warfare in Vietnam. General Westmoreland’s strategy of ‘search and destroy’ relied on attrition—measuring progress through enemy ‘body counts’ rather than securing territory. Because US troops were dropped into hostile territory by helicopter and evacuated immediately after contact, they never established permanent security for South Vietnamese villagers. Furthermore, the massive reliance on indiscriminate firepower—napalm, defoliants (Agent Orange), and artillery—inflicted horrific civilian casualties, alienating the rural population and pushing thousands of previously neutral peasants into active support for the National Liberation Front."'
      },
      {
        title: 'Interpretation 2: From historian Guenter Lewy, \'America in Vietnam\', published in 1978',
        content: '"The failure of the American military effort was not primarily due to flawed US tactics, but to the extraordinary effectiveness, discipline, and strategic design of the communist insurgency. The Vietcong and North Vietnamese Army operated an exceptionally sophisticated underground logistics infrastructure. Their vast network of subterranean tunnels in Cu Chi and the Iron Triangle neutralized American air superiority. Moreover, the Vietcong enforced strict discipline, utilized terror ruthlessly to eliminate uncooperative village leaders, and benefited from an inexhaustible flow of Soviet and Chinese weapons down the Ho Chi Minh Trail. The tenacity and survival techniques of the communist cadres made them impervious to military defeat."'
      },
      {
        title: 'Source B: From combat memoirs by US Marine Lieutenant Philip Caputo, ‘A Rumor of War’ (1977)',
        content: '"The strategy was simple: find the enemy, fix him, and destroy him with massive artillery and air strikes. But we could almost never locate him... Frustrated soldiers burned thatched huts with Zippo lighters, turning the very peasants we were sent to defend into sworn enemies."',
        provenance: 'Written by Philip Caputo, a US Marine lieutenant who commanded combat infantry units in South Vietnam in 1965–66.'
      },
      {
        title: 'Source C: From an interview with Vo Thi Mo, a female Vietcong guerrilla fighter in Cu Chi, recorded in 1982',
        content: '"Beneath the soil, we built over two hundred kilometers of multi-level tunnels with barracks, hospitals, and weapons factories. When their planes bombed, we remained safe twenty feet underground... We were fighting for our own homeland; their soldiers fought only because they were drafted."',
        provenance: 'Oral history interview with a veteran Vietcong combatant who operated in the Cu Chi tunnel network throughout the war.'
      }
    ],
    questions: [
      {
        tariff: '4 marks',
        type: 'difference_4m',
        marks: 4,
        question: 'Study Interpretations 1 and 2. They give different views about the reasons why US military tactics failed to defeat the Vietcong (1965–68). What is the main difference between these views? Explain your answer, using details from both interpretations.',
        prompt: 'Explain the fundamental disagreement between the two interpretations, quoting details from both to support your answer.',
        model: 'The main difference is that Interpretation 1 attributes US failure to flawed American military strategies—specifically search-and-destroy, body count attrition, and the excessive use of firepower (napalm, Agent Orange) that turned the peasant population against the US. On the other hand, Interpretation 2 argues that failure was primarily caused by the extraordinary resilience, discipline, and subterranean tunnel engineering of the Vietcong, supported by Chinese and Soviet arms supplies down the Ho Chi Minh Trail.<br><br>Interpretation 1 states that tactics were \'fundamentally mismatched\' because search-and-destroy never established permanent security and indiscriminate firepower \'alienated the rural population\'. In contrast, Interpretation 2 asserts that failure was due to the \'extraordinary effectiveness, discipline, and strategic design of the communist insurgency\', emphasizing the vast underground tunnel networks in Cu Chi that neutralized American airpower.',
        scaffolding: {
          acronym: 'Difference + Quotes Formula (AO4)',
          acronym_title: 'Historiographical Comparison [4 Marks • 6 Mins]',
          steps: [
            { letter: 'D', name: '1. Main Difference', prompt: 'State the contrast: flawed US search-and-destroy tactics vs Vietcong subterranean resilience and logistics.' },
            { letter: 'I1', name: '2. Detail from Interp 1', prompt: 'Quote and explain Appy on body counts, search-and-destroy, and alienating peasant support.' },
            { letter: 'I2', name: '3. Detail from Interp 2', prompt: 'Quote and explain Lewy on Cu Chi tunnel networks, communist discipline, and the Ho Chi Minh Trail.' }
          ]
        }
      },
      {
        tariff: '4 marks',
        type: 'reason_4m',
        marks: 4,
        question: 'Suggest one reason why Interpretations 1 and 2 give different views about the reasons why US military tactics failed to defeat the Vietcong (1965–68). You may use Sources B and C to help explain your answer.',
        prompt: 'Explain why the historians reached contrasting conclusions by analysing how they investigated different types of primary evidence.',
        model: 'Interpretations 1 and 2 differ because the historians have investigated different dimensions of the war. The author of Interpretation 1 has focused on American military command records and veteran testimonies like Source B, analyzing the failure of search-and-destroy tactics, the inability to distinguish friend from foe, and the moral alienation caused by burning peasant villages. In contrast, the author of Interpretation 2 has focused on Vietnamese guerrilla engineering and communist military archives like Source C, evaluating the military effectiveness of the Cu Chi tunnel systems, homemade booby traps, and the logistical resilience of the National Liberation Front.',
        scaffolding: {
          acronym: 'Reason for Difference Formula (AO4)',
          acronym_title: 'Why Historians Disagree [4 Marks • 6 Mins]',
          steps: [
            { letter: 'R', name: '1. Root Reason', prompt: 'State that the historians focused on different aspects: American operational blunders vs communist guerrilla infrastructure.' },
            { letter: 'SB', name: '2. Evidence for Interp 1', prompt: 'Show how Source B (Caputo, search-and-destroy failure, Zippo raids) informs Interpretation 1.' },
            { letter: 'SC', name: '3. Evidence for Interp 2', prompt: 'Show how Source C (Vo Thi Mo, Cu Chi tunnels, traps) informs Interpretation 2.' }
          ]
        }
      }
    ]
  },

  lesson_3_4: {
    title: 'Edexcel GCSE (9–1) Paper 3 Exam Practice',
    tariff: 'Section B: Question 3(d) (16 marks (+4 SPaG))',
    stimulus: [
      {
        title: 'Interpretation 1: From a modern military history of the Vietnam War, published in 2009',
        content: '"The Tet Offensive was the decisive psychological and political turning point that doomed the American war effort. Prior to January 1968, General Westmoreland and President Johnson had repeatedly assured the public that the \'light at the end of the tunnel\' was visible and that the enemy was running out of men. When over 84,000 communist troops struck simultaneously at dozens of cities and breached the US Embassy in Saigon, that official illusion was permanently shattered. The graphic television coverage—especially Walter Cronkite declaring the conflict a \'stalemate\'—exposed an unbridgeable credibility gap. Tet broke the political will of Washington and convinced the American middle class that the war was unwinnable."'
      },
      {
        title: 'Interpretation 2: From an academic analysis of American strategic doctrine in Vietnam, published in 2016',
        content: '"In purely military terms, the Tet Offensive was an absolute catastrophe for the communist forces. The Vietcong had expected the urban population of South Vietnam to rise up in a mass popular rebellion; this never occurred. Instead, American and ARVN troops responded with overwhelming firepower, driving the attackers out of every city and inflicting staggering casualties of over 45,000 guerrilla fighters. The Vietcong infrastructure was so thoroughly decimated that they ceased to exist as an effective independent fighting force, forcing Hanoi to take over the war with regular North Vietnamese troops. Tet was a decisive US military victory that was mistakenly portrayed by a sensationalist media as a defeat."'
      }
    ],
    questions: [
      {
        tariff: '16 marks (+4 SPaG)',
        type: 'verdict_16m',
        marks: 16,
        question: 'How far do you agree with Interpretation 2 about the military and political significance of the Tet Offensive (1968)? Explain your answer, using both interpretations and your knowledge of the historical context.',
        prompt: 'Use the structure strip and historical guidance below to structure your response.',
        model: 'On the one hand, Interpretation 2 is supported by formidable military evidence proving that the Tet Offensive was a catastrophic tactical defeat for the communist forces. Launched during the lunar new year truce in January 1968, the Vietcong deployed over 84,000 fighters with the objective of inciting a mass urban insurrection across South Vietnam. That popular uprising completely failed to materialize. Instead, US forces and the ARVN rallied rapidly, recapturing every captured city (including Hue after fierce urban combat). General Westmoreland’s forces inflicted an estimated 45,000 casualties, virtually annihilating the southern Vietcong guerrilla network and forcing North Vietnam’s regular army (PAVN) to take over the fighting. In tactical terms, the offensive failed in all its primary military objectives.<br><br>On the other hand, Interpretation 1 provides the more perceptive and historically profound assessment by arguing that Tet was a catastrophic political and psychological turning point for the United States. In the months leading up to Tet, President Johnson and military command had conducted a vigorous public relations campaign claiming the enemy was broken and victory was imminent. When live television footage showed Vietcong suicide commandos penetrating the US Embassy compound in Saigon, the \'credibility gap\' between government claims and reality became unbridgeable. The uncensored media coverage—such as Eddie Adams\' photograph of General Loan executing a Vietcong prisoner and Walter Cronkite’s broadcast declaring the war mired in stalemate—shattered the domestic consensus. In the aftermath of Tet, anti-war protests escalated, Secretary of Defense Clark Clifford advised against sending more troops, and on 31 March 1968, Johnson shocked the world by announcing he would not seek re-election and ordering an end to Rolling Thunder bombings above the 20th parallel to open peace talks.<br><br>Furthermore, contextual knowledge reveals that Tet fundamentally shifted American grand strategy. Following Tet, Richard Nixon won the presidency on the pledge of \'Peace with Honor\' and introduced \'Vietnamization\' in 1969 to begin withdrawing US troops, proving that Tet had permanently destroyed the political sustainability of maintaining US ground combat forces in Southeast Asia.<br><br>In conclusion, having evaluated both interpretations, I agree with Interpretation 2 only to a limited extent regarding the immediate tactical body count. In warfare, political outcomes supersede tactical statistics: while the US won the physical battles of Tet, North Vietnam achieved an irreversible strategic triumph by breaking the political resolve of the American presidency and the American public, making American defeat inevitable.',
        scaffolding: {
          acronym: 'Interpretation Verdict Framework (AO4)',
          acronym_title: 'Section B: Question 3(d) • Evaluative Assessment [16 Marks + 4 SPaG • 25 Mins]',
          steps: [
            { letter: 'INTERP 2', name: '1. Support Interpretation 2 (Tactical Military Victory for US/ARVN)', prompt: 'Deploy evidence of 45,000 Vietcong casualties, failure of urban rebellion, and ARVN resilience.' },
            { letter: 'INTERP 1', name: '2. Support Interpretation 1 (Decisive Political & Psychological Shock)', prompt: 'Deploy evidence of the credibility gap, Walter Cronkite broadcast, LBJ refusing to run, and the opening of peace talks.' },
            { letter: 'VERDICT', name: '3. Sustained Historical Conclusion', prompt: 'Judge whether political turning points supersede tactical battle statistics in determining the war\'s outcome.' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // KEY TOPIC 4: THE END OF THE VIETNAM WAR, 1968–75
  // =========================================================================
  lesson_4_1: {
    title: 'Edexcel GCSE (9–1) Paper 3 Exam Practice',
    tariff: 'Section A: Questions 1 & 2 (4 marks & 12 marks)',
    stimulus: [
      {
        title: 'Source A: Ohio National Guard Confronting Anti-War Student Protesters at Kent State University, 4 May 1970',
        image: '/units/usa/assets/sources/kent-state-protests-1970.jpg',
        caption: 'Armed Ohio National Guardsmen in military formation and gas masks deploy tear gas against student demonstrators protesting Nixon’s invasion of Cambodia.',
        provenance: 'Contemporary news photograph documenting the confrontation between the Ohio National Guard and anti-war student demonstrators at Kent State University, 4 May 1970 (Kent State University Libraries).',
        extract: 'Armed Ohio National Guardsmen in military formation and gas masks deploy tear gas canisters against unarmed student demonstrators on the campus commons protesting President Nixon’s invasion of Cambodia. Minutes later, troops fired sixty-seven live rounds, killing four students.'
      }
    ],
    questions: [
      {
        tariff: '4 marks',
        type: 'inference_4m',
        marks: 4,
        question: 'Give two things you can infer from Source A about the confrontation at Kent State University in May 1970.',
        prompt: 'Give two separate valid inferences. Support each inference with direct visual or textual details from Source A.',
        model: '<p><strong>(i) What I can infer:</strong><br>I can infer that the university campus confrontation was heavily militarized and treated by state authorities as an armed combat situation.<br><strong>Details in the source that tell me this:</strong><br>The National Guardsmen are advancing in strict military formation wearing gas masks and carrying military rifles with fixed bayonets across the student commons.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that student demonstrators were determined to protest despite facing severe armed force and tear gas from state authorities.<br><strong>Details in the source that tell me this:</strong><br>Unarmed students remain visible on the hill opposite the troops, standing their ground amid clouds of deployed tear gas.</p>',
        scaffolding: {
          acronym: 'Inference Formula (AO3)',
          acronym_title: 'Inference + Supporting Detail (2 Points • 4 Marks)',
          steps: [
            { letter: 'I1', name: '1. First Valid Inference', prompt: 'State what the source reveals regarding the militarization of state authority on campus.' },
            { letter: 'D1', name: '2. Supporting Detail', prompt: 'Describe the troops advancing in gas masks carrying military weapons.' },
            { letter: 'I2', name: '3. Second Valid Inference', prompt: 'Identify an insight about student determination or domestic crisis.' },
            { letter: 'D2', name: '4. Supporting Detail', prompt: 'Describe the unarmed students standing opposite the troops in the tear gas.' }
          ]
        }
      },
      {
        tariff: '12 marks',
        type: 'explain_why_12',
        marks: 12,
        question: 'Explain why President Richard Nixon introduced the policy of Vietnamization in 1969.',
        stimulus: [
          'Rising US casualties',
          'The impact of the Tet Offensive (1968)'
        ],
        prompt: 'You may use the following in your answer: (1) Rising US casualties, (2) The impact of the Tet Offensive (1968). You must also use information of your own.',
        model: 'A primary reason why President Nixon introduced Vietnamization was the unsustainable toll of <strong>rising American casualties</strong> and the widespread domestic anger it provoked. By 1968, American combat deaths exceeded 14,000 in that single year, bringing total fatalities above 30,000. Each week, television networks broadcast lists of dead teenagers, fueling widespread draft-resistance, campus protests, and public disgust. Nixon understood that public patience had run out: in order to defuse the anti-war movement and maintain political viability, he had to drastically lower American body counts by transferring ground combat responsibilities to South Vietnamese forces.<br><br>Furthermore, Vietnamization was directly driven by the <strong>political and psychological shock of the 1968 Tet Offensive</strong>. Although Tet was a tactical defeat for the Vietcong, it obliterated public and congressional trust in the military’s optimistic victory projections. The resulting \'credibility gap\' convinced both Congress and middle-class voters that total military victory was unachievable. Having campaigned in 1968 on the pledge to secure \'Peace with Honor\', Nixon needed an exit strategy that avoided the appearance of outright American defeat or abandoning an ally, making the modernization and expansion of the ARVN the only acceptable policy path.<br><br>Finally, Vietnamization was motivated by the desire to <strong>rebalance American strategic doctrine under the Nixon Doctrine (1969)</strong>. Nixon and National Security Advisor Henry Kissinger recognized that the US could no longer act as the world\'s unilateral policeman. By providing massive shipments of modern aircraft, tanks, and artillery to expand the ARVN to over one million soldiers, Nixon hoped to enable South Vietnam to defend itself while allowing the phased withdrawal of over 500,000 US combat troops between 1969 and 1972, thereby facilitating historic diplomatic breakthroughs with Beijing and Moscow.',
        scaffolding: {
          acronym: 'PEEL Structure Strip',
          acronym_title: '3-Paragraph Causal Analysis (PEEL • 12 Marks)',
          steps: [
            { letter: 'P1', name: '1. Rising Casualties & Draft Backlash', prompt: 'Over 14,000 deaths in 1968 forcing Nixon to lower body counts and defuse anti-war anger.' },
            { letter: 'P2', name: '2. Impact of the Tet Offensive (1968)', prompt: 'Tet shattered claims of imminent victory and created an unbridgeable credibility gap.' },
            { letter: 'P3', name: '3. Nixon Doctrine & Building ARVN (Own Knowledge)', prompt: 'Equipping 1m South Vietnamese troops while withdrawing 500,000 US combat troops.' }
          ]
        }
      }
    ]
  },

  lesson_4_2: {
    title: 'Edexcel GCSE (9–1) Paper 3 Exam Practice',
    tariff: 'Section B: Question 3(a) (8 marks)',
    stimulus: [
      {
        title: 'Source B: From a Special CBS News Television Broadcast by Walter Cronkite, 27 February 1968',
        provenance: 'Broadcast to millions of American households by CBS Evening News anchor Walter Cronkite following his fact-finding mission to Vietnam after the Tet Offensive.',
        extract: '"It seems now more certain than ever that the bloody experience of Vietnam is to end in a stalemate. To say that we are closer to victory today is to believe, in the face of the evidence, the optimists who have been wrong in the past. To suggest we are on the edge of defeat is to yield to unreasonable despair. To say that we are mired in stalemate seems the only realistic, yet unsatisfactory, conclusion. It is increasingly clear to this reporter that the only rational way out will be to negotiate, not as victors, but as an honorable people who lived up to their pledge to defend democracy and did the best they could."'
      },
      {
        title: 'Source C: From an Anti-Draft Flyer Distributed by Students for a Democratic Society (SDS) at University Campuses, October 1969',
        provenance: 'Protest pamphlet produced and circulated by the student anti-war organization Students for a Democratic Society (SDS) prior to the October 1969 Moratorium.',
        extract: '"Rich young men with political connections go to prestigious colleges and receive student deferments. Working-class and Black youth who cannot afford university are handed M16 rifles and shipped off to die in the jungles for a corrupt dictatorship in Saigon. Over 35,000 American boys have already come home in aluminum coffins, while Washington politicians lie about ‘progress’. We refuse to participate in the slaughter of Vietnamese peasants. Burn your draft cards! Join the nationwide Moratorium on October 15! Strike against the war machine!"'
      }
    ],
    questions: [
      {
        tariff: '8 marks',
        type: 'utility_8m',
        marks: 8,
        question: 'Study Sources B and C. How useful are Sources B and C for an enquiry into the main reason for the growth of opposition to the Vietnam War in the USA (1968–71)?',
        prompt: 'Evaluate both sources using Content, Contextual Knowledge (Tet Offensive, Walter Cronkite broadcast, My Lai revelations 1969, the military draft lottery, campus student protests, Moratorium rallies), and Provenance.',
        model: 'Source B is highly useful because it demonstrates the critical moment when mainstream, respectable American journalism turned against the war. Walter Cronkite was universally revered as \'the most trusted man in America\'. In this special February 1968 broadcast following his personal investigation of the Tet Offensive, Cronkite dismantles government propaganda, declaring that the war is hopelessly \'mired in stalemate\' and that negotiation is the only rational path. From my historical knowledge, President Johnson famously reacted to this broadcast by stating, \'If I\'ve lost Cronkite, I\'ve lost middle America\'. Its provenance as a national primetime broadcast gives it immense utility, illustrating how television destroyed the credibility of Washington politicians among ordinary, moderate citizens.<br><br>Source C is equally useful because it exposes the passionate, grassroots fury of the youth and student anti-war movement. Produced by Students for a Democratic Society (SDS) for the nationwide October 1969 Moratorium, the leaflet targets the deep class and racial inequalities of the Selective Service conscription system. It exposes how wealthy students secured college deferments while poor and minority draftees were sent to die in the jungle. It explicitly calls for civil disobedience, urging young men to burn their draft cards. From my knowledge, over two million Americans participated in the Moratorium demonstrations on 15 October 1969, showing how the draft mobilized mass resistance. As a polemical propaganda leaflet, Source C uses emotive language to recruit activists, but it accurately captures the moral outrage and fear of conscription that animated campus rebellions. Overall, both sources are highly useful: Source B reveals the collapse of mainstream faith in military victory, while Source C illustrates the militant grassroots resistance provoked by the draft.',
        scaffolding: {
          acronym: 'Source Utility Framework (AO3)',
          acronym_title: 'Section B: Question 3(a) • Utility of Sources B & C [8 Marks • 12 Mins]',
          steps: [
            { letter: 'SOURCE B', name: '1. Source B Content & Context', prompt: 'Examine Cronkite\'s declaration of stalemate and its impact on middle-class public opinion.' },
            { letter: 'SOURCE C', name: '2. Source C Content & Context', prompt: 'Analyse the SDS leaflet targeting the unfair draft lottery, class deferments, and draft-card burning.' },
            { letter: 'SYNTHESIS', name: '3. Provenance & Synthesis', prompt: 'Contrast mainstream broadcast journalism with student activist protest literature; reach a balanced conclusion.' }
          ]
        }
      }
    ]
  },

  lesson_4_3: {
    title: 'Edexcel GCSE (9–1) Paper 3 Exam Practice',
    tariff: 'Section B: Questions 3(b) & 3(c) (4 marks & 4 marks)',
    stimulus: [
      {
        title: 'Interpretation 1: From historian Chester Pach, \'The Real Media War on Vietnam\', published in 1996',
        content: '"The fundamental engine driving mass opposition to the war was television journalism and the uncensored visual exposure of combat horrors. Vietnam was America’s first ‘living-room war’. Night after night, millions of ordinary Americans watched unedited color footage of wounded soldiers, burning huts, civilian body counts, and napalmed children alongside their evening dinners. When trusted national figures like Walter Cronkite declared the war unwinnable after the Tet Offensive, it shattered the government’s credibility. The media’s subsequent exposure of atrocities like the My Lai massacre in 1969 made it impossible for the moral conscience of middle America to support the war any longer."'
      },
      {
        title: 'Interpretation 2: From historian Melvin Small, \'Antiwarriors: The Vietnam War and the Battle for America’s Hearts and Minds\', published in 2002',
        content: '"While television coverage was vivid, the primary catalyst for mass domestic opposition was the personal, immediate threat posed by the military draft system combined with skyrocketing American casualties. Young men faced the terrifying prospect of conscription into an ambiguous conflict, producing a massive student rebellion across college campuses. Student organizations like SDS, energized by civil rights techniques, transformed anti-war sentiment into sustained street mobilization, draft-card burnings, and nationwide moratoriums involving millions of demonstrators. It was the visceral fear of the draft, coupled with the rising toll of over 50,000 American deaths, that galvanized grassroots resistance and made the war politically unsustainable."'
      },
      {
        title: 'Source B: From a television broadcast by CBS News anchor Walter Cronkite, 27 February 1968',
        content: '"To say that we are mired in stalemate seems the only realistic, yet unsatisfactory, conclusion. It is increasingly clear to this reporter that the only rational way out will be to negotiate, not as victors, but as an honorable people who lived up to their pledge to defend democracy and did the best they could."',
        provenance: 'Broadcast to millions of American households by CBS Evening News anchor Walter Cronkite following his trip to Vietnam after Tet.'
      },
      {
        title: 'Source C: From an anti-draft flyer distributed by Students for a Democratic Society (SDS), October 1969',
        content: '"Working-class and Black youth who cannot afford university are handed M16 rifles and shipped off to die in the jungles for a corrupt dictatorship in Saigon. Over 35,000 American boys have already come home in aluminum coffins... Burn your draft cards! Strike against the war machine!"',
        provenance: 'Protest pamphlet produced and circulated by SDS on US university campuses prior to the October 1969 Moratorium.'
      }
    ],
    questions: [
      {
        tariff: '4 marks',
        type: 'difference_4m',
        marks: 4,
        question: 'Study Interpretations 1 and 2. They give different views about the main reason for the growth of opposition to the Vietnam War in the USA (1968–71). What is the main difference between these views? Explain your answer, using details from both interpretations.',
        prompt: 'Explain the fundamental disagreement between the two interpretations, quoting details from both to support your answer.',
        model: 'The main difference is that Interpretation 1 argues that television journalism and the visual exposure of combat horrors was the fundamental engine driving anti-war opposition, whereas Interpretation 2 argues that opposition was primarily catalyzed by the personal threat of the military draft system and escalating casualties.<br><br>Interpretation 1 emphasizes that Vietnam was a \'living-room war\' where unedited color footage of napalmed children and Cronkite’s broadcast \'shattered the government’s credibility\', making it morally impossible for middle America to support the conflict. In contrast, Interpretation 2 asserts that the \'primary catalyst\' was the \'visceral fear of the draft\' and rising death toll of over 50,000 soldiers, which mobilized student groups like SDS to burn draft cards and stage massive national moratoriums.',
        scaffolding: {
          acronym: 'Difference + Quotes Formula (AO4)',
          acronym_title: 'Historiographical Comparison [4 Marks • 6 Mins]',
          steps: [
            { letter: 'D', name: '1. Main Difference', prompt: 'State the fundamental disagreement: television coverage and moral shock vs the personal threat of the military draft and casualties.' },
            { letter: 'I1', name: '2. Detail from Interp 1', prompt: 'Quote and explain Pach on television journalism, living-room war, and Walter Cronkite.' },
            { letter: 'I2', name: '3. Detail from Interp 2', prompt: 'Quote and explain Small on the military draft system, 50,000 casualties, and SDS campus rebellions.' }
          ]
        }
      },
      {
        tariff: '4 marks',
        type: 'reason_4m',
        marks: 4,
        question: 'Suggest one reason why Interpretations 1 and 2 give different views about the main reason for the growth of opposition to the Vietnam War in the USA (1968–71). You may use Sources B and C to help explain your answer.',
        prompt: 'Explain why the historians reached contrasting conclusions by analysing how they investigated different types of primary evidence.',
        model: 'The historians give different views because they have investigated different types of primary evidence. The author of Interpretation 1 has focused on mainstream broadcast journalism such as Walter Cronkite\'s CBS commentary in Source B, which exposed the government\'s credibility gap and turned middle-class television viewers against the war. In contrast, the author of Interpretation 2 has drawn upon student activist literature and draft-resistance records such as Source C, emphasizing the anger of student draftees against unfair class deferments, rising body counts in aluminum coffins, and the organizational power of campus strikes.',
        scaffolding: {
          acronym: 'Reason for Difference Formula (AO4)',
          acronym_title: 'Why Historians Disagree [4 Marks • 6 Mins]',
          steps: [
            { letter: 'R', name: '1. Root Reason', prompt: 'State clearly that the historians examined different sources: mainstream television archives vs student anti-draft protest records.' },
            { letter: 'SB', name: '2. Evidence for Interp 1', prompt: 'Show how Source B (Cronkite broadcast, government credibility gap) supports the media focus of Interpretation 1.' },
            { letter: 'SC', name: '3. Evidence for Interp 2', prompt: 'Show how Source C (SDS anti-draft flyer, aluminum coffins) supports the conscription focus of Interpretation 2.' }
          ]
        }
      }
    ]
  },

  lesson_4_4: {
    title: 'Edexcel GCSE (9–1) Paper 3 Exam Practice',
    tariff: 'Section B: Question 3(d) (16 marks (+4 SPaG))',
    stimulus: [
      {
        title: 'Interpretation 1: From a military history of the Vietnam War, published in 2011',
        content: '"The fundamental cause of American defeat in Vietnam lay on the battlefield: the United States military attempted to wage a conventional war of firepower and attrition in an environment completely unsuited to it. General Westmoreland’s \'search and destroy\' operations and reliance on body counts could never overcome the tactical adaptability and deep ideological motivation of the Vietcong and North Vietnamese Army. Communist forces exploited the dense jungle terrain, constructed impervious underground tunnel complexes, and absorbed horrific casualties without breaking. America\'s reliance on massive bombing and defoliation simply alienated the rural population, ensuring that US forces could never establish permanent control over South Vietnam."'
      },
      {
        title: 'Interpretation 2: From a political study of the conflict and American foreign policy, published in 2015',
        content: '"The United States lost the Vietnam War not in the jungles of Southeast Asia, but in the corridors of Washington and on the streets of America. US forces never lost a major tactical battle throughout the entire conflict. Defeat occurred because the American political leadership failed to sustain domestic support for a protracted war. A hostile media, surging anti-war demonstrations, and the draft caused public opinion to collapse. Once Congress slashed military funding and passed the War Powers Act in 1973, it became impossible for President Nixon or Ford to uphold their commitments to Saigon. When North Vietnam launched its final invasion in 1975, South Vietnam collapsed because its American lifeline had been severed by political exhaustion."'
      }
    ],
    questions: [
      {
        tariff: '16 marks (+4 SPaG)',
        type: 'verdict_16m',
        marks: 16,
        question: 'How far do you agree with Interpretation 2 about the main reasons why the United States failed to achieve its objectives in Vietnam? Explain your answer, using both interpretations and your knowledge of the historical context.',
        prompt: 'Use the structure strip and historical guidance below to structure your response.',
        model: 'On the one hand, Interpretation 2 presents a persuasive argument that political collapse at home was the decisive cause of American failure. American forces never lost a single major tactical engagement during the war; from the Ia Drang Valley (1965) to the Tet Offensive (1968), superior American firepower consistently prevailed on the battlefield. Defeat was ultimately political: the conflict became unsustainable because the American public, demoralized by television footage of body counts and atrocities like My Lai, withdrew its consent. Following the 1973 Paris Peace Accords and the withdrawal of US troops, the Watergate scandal critically weakened the presidency, prompting Congress to pass the War Powers Act (1973) and drastically cut military and financial aid to South Vietnam. Consequently, when North Vietnam launched its conventional Spring Offensive in 1975, President Gerald Ford was legally and politically powerless to intervene, leading to the rapid fall of Saigon in April 1975.<br><br>On the other hand, Interpretation 1 provides an equally essential counter-argument by demonstrating that military tactics in Vietnam were fundamentally flawed from the outset. American command mistakenly believed that overwhelming industrial firepower—dropping over 7 million tons of bombs and spraying 20 million gallons of Agent Orange—could break an adversary fighting an anti-colonial war for national reunification. General Westmoreland’s strategy of search-and-destroy, measured purely by body counts, was completely ineffective against guerrilla fighters who used the Ho Chi Minh Trail and subterranean tunnels in Cu Chi to dictate when and where they fought. Crucially, the destruction of civilian villages and high collateral casualties completely alienated the South Vietnamese peasantry, whose political loyalty was vital for counter-insurgency victory.<br><br>Furthermore, contextual analysis reveals that the Saigon government (led by Ngo Dinh Diem, Nguyen Cao Ky, and Nguyen Van Thieu) was viewed by the majority of ordinary Vietnamese citizens as a corrupt, undemocratic, and illegitimate puppet of the United States. Without popular domestic legitimacy, the South Vietnamese ARVN could never maintain civilian support or resist northern unification, regardless of US military supplies.<br><br>In conclusion, having evaluated both interpretations, I agree with Interpretation 2 only to a moderate extent. While the domestic collapse of political will and Congressional defunding dictated the timing and manner of American withdrawal, that political collapse was itself the direct consequence of the military quagmire highlighted in Interpretation 1. Because the US military could not defeat a resilient guerrilla insurgency in the jungle, the war dragged on indefinitely until American democracy could no longer bear the moral, human, and economic cost.',
        scaffolding: {
          acronym: 'Interpretation Verdict Framework (AO4)',
          acronym_title: 'Section B: Question 3(d) • Evaluative Assessment [16 Marks + 4 SPaG • 25 Mins]',
          steps: [
            { letter: 'INTERP 2', name: '1. Support Interpretation 2 (Domestic Political Collapse & Aid Cut)', prompt: 'Deploy evidence of anti-war protests, media impact, Watergate, the 1973 War Powers Act, and Congressional aid cuts.' },
            { letter: 'INTERP 1', name: '2. Support Interpretation 1 (Flawed Military Tactics & Guerrilla Resilience)', prompt: 'Deploy evidence of search-and-destroy failure, Cu Chi tunnels, Ho Chi Minh trail logistics, and Agent Orange alienating peasants.' },
            { letter: 'VERDICT', name: '3. Sustained Historical Conclusion', prompt: 'Synthesize both arguments alongside the corruption of the Saigon regime to reach a nuanced historical judgement.' }
          ]
        }
      }
    ]
  }
};

// Update each lesson in usaData
let updatedCount = 0;
usaData.lessons.forEach((lesson) => {
  if (EXAM_PRACTICE_LADDER[lesson.id]) {
    lesson.exam_practice = EXAM_PRACTICE_LADDER[lesson.id];
    updatedCount++;
    console.log(`✓ Updated exam_practice for ${lesson.id}: ${lesson.title}`);
  } else {
    console.warn(`⚠ No configuration found for ${lesson.id}`);
  }
});

console.log(`\nUpdated ${updatedCount}/16 lessons in USA dataset.`);

// Format back to ES Module string
const output = `export default ${JSON.stringify(usaData, null, 2)};\n`;
fs.writeFileSync(dataJsPath, output, 'utf8');
console.log(`✓ Successfully saved updated data to ${dataJsPath}`);

