const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Projects/the-history-revision-hub';

const usaBlockCalibrations = {
  lesson_1_1: {
    block_index: 4, // Block 5
    title: "Emergence of Non-Violent Direct Action",
    text: `<span class="para-ref">[5.1]</span> **Black Veterans and the Double V Campaign:** Over one million Black soldiers returned from the Second World War having fought against fascist tyranny under the banner of democracy. Black newspapers championed the "Double V Campaign"—demanding victory over fascism abroad and victory over racism at home. Returning veterans refused to accept pre-war subservience, providing disciplined leadership and swelling local NAACP branches across the South.<br><br><span class="para-ref">[5.2]</span> **Executive Order 9981 & Emerging Defiance:** Violence against returning Black veterans shocked President Harry S. Truman. In July 1948, Truman signed Executive Order 9981, desegregating the United States Armed Forces. Although Southern Jim Crow laws remained firmly entrenched, grassroots resistance grew rapidly, laying the essential foundation for the modern non-violent civil rights movement.`
  },
  lesson_1_2: {
    block_index: 1, // Block 2
    title: "Southern Massive Resistance",
    text: `<span class="para-ref">[2.1]</span> **Chief Justice Earl Warren & The Unanimous Verdict:** On 17 May 1954, Chief Justice Earl Warren delivered a unanimous 9–0 Supreme Court ruling. Warren forged total consensus to prevent segregationist dissent, declaring: *"In the field of public education, the doctrine of 'separate but equal' has no place. Separate educational facilities are inherently unequal."* The 58-year-old legal precedent of Jim Crow was constitutionally broken.<br><br><span class="para-ref">[2.2]</span> **The Flaw of Brown II & "Massive Resistance":** However, in May 1955 the Court issued *Brown II*, ordering desegregation to proceed only *"with all deliberate speed"*. Southern school boards exploited this vague phrase to delay integration indefinitely. Southern congressmen signed the "Southern Manifesto", pledging "Massive Resistance" and threatening to shut public schools rather than admit Black children.`
  },
  lesson_1_2_block_5: {
    lesson_id: 'lesson_1_2',
    block_index: 4, // Block 5
    title: "The Lost Year in Little Rock",
    text: `<span class="para-ref">[5.1]</span> **The "Lost Year" in Little Rock (1958–1959):** In September 1958, Governor Faubus escalated white resistance by shutting all four Little Rock public high schools for an entire year (the "Lost Year"), attempting to divert white pupils into segregated private academies. Only in 1959 did federal courts force Little Rock schools to reopen on an integrated basis.<br><br><span class="para-ref">[5.2]</span> **The Reality of Desegregation by 1960:** The Little Rock crisis exposed the limits of judicial rulings without executive enforcement. By 1960, six years after *Brown v. Board*, fewer than 1% of Black children in the former Confederate states attended school with white children. The legal victory was won, but desegregation on the ground remained agonizingly slow.`
  },
  lesson_1_3: {
    block_index: 0, // Block 1
    title: "The Arrest of Rosa Parks",
    text: `<span class="para-ref">[1.1]</span> **Municipal Bus Segregation in Montgomery:** In Montgomery, Alabama, municipal bus segregation was a daily humiliation for Black residents, who made up over 70% of passengers. Black riders had to pay at the front, enter through the rear, and give up their seats in the middle section if white rows filled up. Drivers carried pistols and routinely shouted racial abuse at Black passengers.<br><br><span class="para-ref">[1.2]</span> **The Arrest of Rosa Parks (1 Dec 1955):** On 1 December 1955, seamstress and NAACP activist Rosa Parks refused a driver's order to give her seat to a white man. Her arrest triggered immediate action: Jo Ann Robinson and the Women’s Political Council printed 35,000 leaflets calling for a one-day boycott on 5 December, launching the historic Montgomery Bus Boycott.`
  },
  lesson_2_1_b3: {
    lesson_id: 'lesson_2_1',
    block_index: 2, // Block 3
    title: "The Launch of the Freedom Rides",
    text: `<span class="para-ref">[3.1]</span> **Testing Federal Law: The CORE Freedom Rides:** On 4 May 1961, James Farmer and the Congress of Racial Equality (CORE) launched the "Freedom Rides". Interracial teams of Black and white activists boarded Greyhound and Trailways buses in Washington, D.C., bound for New Orleans, determined to test whether Southern authorities would obey the Supreme Court ruling banning segregation in interstate bus terminals.<br><br><span class="para-ref">[3.2]</span> **The Anniston Firebomb & Birmingham Ambush:** On 14 May 1961, a Ku Klux Klan mob intercepted the Greyhound bus outside Anniston, Alabama, slashing its tires and firebombing the vehicle. In Birmingham, Police Commissioner "Bull" Connor allowed Klansmen fifteen minutes to beat the riders with iron pipes. Shocking international photographs of the burning bus forced the federal government to intervene.`
  },
  lesson_2_1_b4: {
    lesson_id: 'lesson_2_1',
    block_index: 3, // Block 4
    title: "The Anniston & Montgomery Ambush",
    text: `<span class="para-ref">[4.1]</span> **Robert Kennedy Deploys Federal Marshals:** The violence in Alabama embarrassed President John F. Kennedy during the Cold War. Attorney General Robert Kennedy deployed 400 federal marshals to protect riders in Montgomery, Alabama, after local police abandoned them to another violent white mob at the bus terminal.<br><br><span class="para-ref">[4.2]</span> **The ICC Desegregation Order (Nov 1961):** Robert Kennedy petitioned the Interstate Commerce Commission (ICC) to enforce compliance. On 1 November 1961, the ICC issued strict nationwide regulations ordering the removal of all "whites only" signs in interstate bus and train terminals, proving that non-violent direct action could force the federal government to act.`
  },
  lesson_2_2_b1: {
    lesson_id: 'lesson_2_2',
    block_index: 0, // Block 1
    title: "Project C & The Children's Crusade in Birmingham",
    text: `<span class="para-ref">[1.1]</span> **Project C in Birmingham (April 1963):** In April 1963, Dr Martin Luther King Jr., the SCLC, and Rev. Fred Shuttlesworth launched "Project C" (Confrontation) in Birmingham, Alabama—one of America's most segregated cities. Activists boycotted downtown stores and held sit-ins. When arrested, King penned his famous *Letter from Birmingham Jail*, declaring that "justice too long delayed is justice denied."<br><br><span class="para-ref">[1.2]</span> **The Children's Crusade & Televised Outrage:** In May, thousands of schoolchildren joined the protests. Police Commissioner "Bull" Connor unleashed snarling police attack dogs and high-pressure fire hoses on the young marchers. Televised footage of children being knocked down by water jets horrified the world, forcing Birmingham business leaders to agree to desegregate downtown facilities.`
  },
  lesson_2_2_b5: {
    lesson_id: 'lesson_2_2',
    block_index: 4, // Block 5
    title: "Enactment of the Voting Rights Act of 1965",
    text: `<span class="para-ref">[5.1]</span> **Enactment of the Voting Rights Act (6 Aug 1965):** Shocked by the televised brutality at Selma, President Lyndon B. Johnson addressed Congress, declaring that "we shall overcome". On 6 August 1965, Johnson signed the historic Voting Rights Act. The law banned all discriminatory literacy tests and empowered federal examiners to directly register Black voters in Southern counties where registration fell below 50%.<br><br><span class="para-ref">[5.2]</span> **Transformative Impact & New Challenges:** The Voting Rights Act transformed Southern politics: within three years, Black voter registration in Mississippi jumped from 7% to over 60%. However, while federal legislation abolished *de jure* legal barriers in the South, it did not solve urban poverty, substandard ghetto housing, or police brutality in Northern cities.`
  },
  lesson_3_2_b5: {
    lesson_id: 'lesson_3_2',
    block_index: 4, // Block 5
    title: "First US Ground Combat Troops Land at Da Nang",
    text: `<span class="para-ref">[5.1]</span> **The Landing at Da Nang (8 March 1965):** To defend the vital US air base at Da Nang from Vietcong guerrilla attacks, General William Westmoreland requested combat troops. On 8 March 1965, 3,500 heavily armed US Marines waded ashore at Red Beach, Da Nang. This marked the fateful shift from American military advisors to direct ground combat.<br><br><span class="para-ref">[5.2]</span> **Rapid Escalation & General Westmoreland:** Within months, the Marines' defensive perimeter expanded into offensive search-and-destroy combat across South Vietnam. By the close of 1965, President Johnson had escalated American troop strength from 23,000 advisors to over 184,000 ground troops, committing the United States to a full-scale land war in Asia.`
  },
  lesson_3_3_b3: {
    lesson_id: 'lesson_3_3',
    block_index: 2, // Block 3
    title: "The Ho Chi Minh Trail Supply Lifeline",
    text: `<span class="para-ref">[3.1]</span> **The Logistics of the Ho Chi Minh Trail:** The lifeblood of the communist insurgency was the Ho Chi Minh Trail: an intricate 16,000-kilometre corridor of jungle roads, paths, and river waterways snaking from North Vietnam through neutral Laos and Cambodia into South Vietnam. Despite the US Air Force dropping millions of tons of bombs, over 300,000 North Vietnamese volunteer youth brigades repaired bomb craters overnight.<br><br><span class="para-ref">[3.2]</span> **Sustaining the War Effort:** Cargo bicycles, pack animals, and Soviet-supplied trucks carried an uninterrupted flow of heavy artillery, rockets, ammunition, and fresh troops southward, ensuring that the Vietcong could never be starved of supplies.`
  },
  lesson_3_3_b4: {
    lesson_id: 'lesson_3_3',
    block_index: 3, // Block 4
    title: "Chemical Defoliation & Napalm Warfare",
    text: `<span class="para-ref">[4.1]</span> **Operation Ranch Hand & Agent Orange:** To strip away dense jungle canopy that hid guerrillas and wipe out food crops, the US military launched Operation Ranch Hand. Specially modified cargo planes sprayed over 20 million gallons of toxic chemical herbicides across South Vietnam, primarily Agent Orange. Dioxin contamination caused severe long-term cancers, birth defects, and permanent ecological destruction.<br><br><span class="para-ref">[4.2]</span> **Napalm Air Strikes:** Furthermore, US aircraft dropped nearly 400,000 tons of napalm: jellied petroleum that ignited at over 1,000°C, clinging to human skin and suffocating victims. The horrific burns inflicted on civilian villagers turned world opinion sharply against American tactics.`
  },
  lesson_4_1_b2: {
    lesson_id: 'lesson_4_1',
    block_index: 1, // Block 2
    title: "The Draft System & Class Inequity",
    text: `<span class="para-ref">[2.1]</span> **A Discriminatory Draft System:** Opposition to the war centered on the military draft (Selective Service). Over two million young men were conscripted between 1965 and 1973. The draft system favoured the wealthy: middle-class youths obtained college deferments or doctor excuses, while working-class and minority men were sent to fight. Black Americans made up 11% of the US population but over 20% of combat deaths in the early war years.<br><br><span class="para-ref">[2.2]</span> **Draft Resistance & Muhammad Ali:** In response, young men staged mass rallies to publicly burn draft cards, while thousands fled to Canada. In 1967, world boxing champion Muhammad Ali refused the draft on moral and religious grounds, declaring: "I ain't got no quarrel with them Vietcong." The draft galvanized millions of students into active protest.`
  },
  lesson_4_1_b3: {
    lesson_id: 'lesson_4_1',
    block_index: 2, // Block 3
    title: "Exposure of the My Lai Massacre",
    text: `<span class="para-ref">[3.1]</span> **The Slaughter at My Lai (16 March 1968):** On 16 March 1968, American troops of Charlie Company, commanded by Lieutenant William Calley, entered the village of My Lai. Frustrated by booby-trap casualties and finding no enemy soldiers, the unit murdered up to 504 unarmed Vietnamese civilians—mostly women, children, and elderly men—herding them into ditches and executing them.<br><br><span class="para-ref">[3.2]</span> **Exposure & Shattered Moral Authority:** The massacre was concealed by military officials until November 1969, when investigative reporter Seymour Hersh published the story alongside horrifying photographs of bodies piled in ditches. The revelations destroyed the belief that the US was fighting a noble war, severely deepening anti-war feeling across America.`
  }
};

const usaGuidedReading = {
  lesson_1_1: [
    {
      question: "According to paragraph [1.1], what 1896 Supreme Court ruling established the doctrine of 'separate but equal'?",
      answer: "Plessy v. Ferguson, which sanctioned legal racial segregation across the American South."
    },
    {
      question: "Using paragraph [2.1], what two methods were used by Southern states to disenfranchise Black voters?",
      answer: "Discriminatory poll taxes and arbitrary literacy tests administered by white registrars."
    },
    {
      question: "According to paragraph [3.1], what legal strategy did Thurgood Marshall and the NAACP use to attack Jim Crow?",
      answer: "Taking cases to federal courts using the Equal Protection Clause of the 14th Amendment to prove segregated facilities were inherently unequal."
    },
    {
      question: "Using paragraph [5.1], what was the 'Double V Campaign' championed by Black veterans of the Second World War?",
      answer: "Demanding victory over fascist tyranny abroad and victory over racial segregation and discrimination at home."
    }
  ],
  lesson_1_2: [
    {
      question: "According to paragraph [1.1], why did Oliver Brown and the NAACP challenge school segregation in Topeka, Kansas?",
      answer: "His daughter Linda had to walk past a white school through dangerous railroad tracks to reach a distant, segregated Black school."
    },
    {
      question: "Using paragraph [2.1], what historic verdict did Chief Justice Earl Warren deliver on 17 May 1954?",
      answer: "A unanimous 9–0 ruling declaring that 'separate educational facilities are inherently unequal', overturning Plessy v. Ferguson."
    },
    {
      question: "According to paragraph [3.1], how did Arkansas Governor Orval Faubus attempt to prevent integration at Little Rock Central High School in 1957?",
      answer: "He deployed the armed Arkansas National Guard to surround the school and physically block the Little Rock Nine from entering."
    },
    {
      question: "Using paragraph [4.1], how did President Dwight D. Eisenhower enforce the desegregation of Central High School?",
      answer: "He sent 1,000 paratroopers of the 101st Airborne Division and federalized the Arkansas National Guard to escort the students."
    }
  ],
  lesson_1_3: [
    {
      question: "According to paragraph [1.2], what action by Rosa Parks on 1 December 1955 triggered the Montgomery Bus Boycott?",
      answer: "She refused a bus driver's order to give up her seat in the coloured section to a white passenger."
    },
    {
      question: "Using paragraph [2.1], who was elected leader of the newly formed Montgomery Improvement Association (MIA)?",
      answer: "Dr Martin Luther King Jr., a 26-year-old Baptist minister at Dexter Avenue Baptist Church."
    },
    {
      question: "According to paragraph [3.1], how did the Black community maintain the bus boycott for 381 days without municipal transit?",
      answer: "By organizing an elaborate private carpool system with dispatch stations, supplemented by church volunteer drivers and walking miles to work."
    },
    {
      question: "Using paragraph [4.1], what Supreme Court ruling permanently ended segregation on Montgomery's buses in November 1956?",
      answer: "Browder v. Gayle, which declared segregated seating on municipal public transport unconstitutional."
    }
  ],
  lesson_1_4: [
    {
      question: "According to paragraph [1.1], what were the White Citizens' Councils and what tactics did they use?",
      answer: "Middle-class segregationist groups who used economic boycotts, sacking Black workers and denying bank loans to civil rights activists."
    },
    {
      question: "Using paragraph [2.1], why was 14-year-old Emmett Till murdered in Money, Mississippi, in August 1955?",
      answer: "He was accused of whistling at a white woman, Carolyn Bryant, in a grocery store."
    },
    {
      question: "According to paragraph [3.1], why did Emmett Till's mother, Mamie Till-Mobley, insist on an open-casket funeral in Chicago?",
      answer: "So the entire world could see the horrific facial disfigurement inflicted by his white murderers."
    },
    {
      question: "Using paragraph [5.1], why was the Civil Rights Act of 1957 criticized as weak and ineffective?",
      answer: "Southern senators weakened the bill, requiring all-white juries to try voting obstruction cases, resulting in almost zero new voter registrations."
    }
  ],
  lesson_2_1: [
    {
      question: "According to paragraph [1.1], what action did four Black college students take at Woolworth’s in Greensboro, North Carolina, on 1 February 1960?",
      answer: "They sat at the segregated, 'whites-only' lunch counter and refused to leave after being denied service."
    },
    {
      question: "Using paragraph [2.1], what student organization was founded in April 1960 to coordinate non-violent direct action?",
      answer: "The Student Nonviolent Coordinating Committee (SNCC), advised by veteran organizer Ella Baker."
    },
    {
      question: "According to paragraph [3.1], what was the purpose of the 1961 Freedom Rides organized by CORE?",
      answer: "Interracial teams rode interstate buses through the South to test whether authorities were obeying federal court bans on terminal segregation."
    },
    {
      question: "Using paragraph [4.2], what government regulation resulted from the Freedom Rides in November 1961?",
      answer: "The Interstate Commerce Commission (ICC) ordered all racial segregation signs removed from interstate bus and rail stations."
    }
  ],
  lesson_2_2: [
    {
      question: "According to paragraph [1.2], what brutal tactics did Police Commissioner 'Bull' Connor use against child marchers in Birmingham in May 1963?",
      answer: "He unleashed snarling police attack dogs and blasted schoolchildren with high-pressure fire hoses."
    },
    {
      question: "Using paragraph [2.1], what historic speech was delivered by Dr Martin Luther King Jr. during the August 1963 March on Washington?",
      answer: "His famous 'I Have a Dream' speech, delivered to 250,000 marchers at the Lincoln Memorial."
    },
    {
      question: "According to paragraph [3.1], what major discriminatory practices were outlawed by the Civil Rights Act of 1964?",
      answer: "Segregation in public accommodations, schools, and employment discrimination based on race, colour, religion, or sex."
    },
    {
      question: "Using paragraph [4.1], what happened to peaceful marchers on 'Bloody Sunday' (7 March 1965) at Edmund Pettus Bridge in Selma, Alabama?",
      answer: "Alabama state troopers fired tear gas and savagely beat marchers with clubs and bullwhips on horseback."
    }
  ],
  lesson_2_3: [
    {
      question: "According to paragraph [1.1], how did Malcolm X's philosophy differ from Dr Martin Luther King Jr.'s?",
      answer: "Malcolm X rejected white integration, preaching Black self-defence, racial pride, and armed resistance 'by any means necessary'."
    },
    {
      question: "Using paragraph [2.1], who popularized the slogan 'Black Power' during the June 1966 Meredith March against Fear?",
      answer: "Stokely Carmichael, the newly elected chairman of SNCC."
    },
    {
      question: "According to paragraph [3.1], who founded the Black Panther Party in Oakland, California, in October 1966?",
      answer: "Huey P. Newton and Bobby Seale."
    },
    {
      question: "Using paragraph [4.1], what community survival programs were operated by the Black Panthers alongside armed patrols?",
      answer: "Free Breakfast for Children programs, free community health clinics, and educational liberation schools."
    }
  ],
  lesson_2_4: [
    {
      question: "According to paragraph [1.1], what caused the devastating Watts riot in Los Angeles in August 1965?",
      answer: "The aggressive arrest of a young Black motorist by California highway patrol sparked six days of arson, looting, and street clashes."
    },
    {
      question: "Using paragraph [2.1], why did race riots erupt across more than 120 American cities during the 'Long Hot Summers' of 1967?",
      answer: "Deep anger over police brutality, substandard ghetto housing, unemployment, and institutional racial discrimination."
    },
    {
      question: "According to paragraph [3.1], what famous conclusion did the 1968 Kerner Commission report reach about American society?",
      answer: "That America was 'moving toward two societies, one black, one white—separate and unequal', blaming pervasive white racism."
    },
    {
      question: "Using paragraph [5.1], what national tragedy occurred on 4 April 1968 in Memphis, Tennessee?",
      answer: "Dr Martin Luther King Jr. was assassinated on the Lorraine Motel balcony by James Earl Ray, triggering riots in over 100 cities."
    }
  ],
  lesson_3_1: [
    {
      question: "According to paragraph [1.1], what was President Eisenhower's 'Domino Theory'?",
      answer: "The belief that if South Vietnam fell to communism, neighbouring Southeast Asian nations would topple like a row of falling dominoes."
    },
    {
      question: "Using paragraph [2.1], how was Vietnam divided at the 1954 Geneva Accords following France's defeat at Dien Bien Phu?",
      answer: "Along the 17th Parallel into communist North Vietnam (under Ho Chi Minh) and capitalist South Vietnam (under Ngo Dinh Diem)."
    },
    {
      question: "According to paragraph [3.1], why was South Vietnamese President Ngo Dinh Diem widely loathed by ordinary Vietnamese peasants?",
      answer: "He was deeply corrupt, favoured the Catholic elite while persecuting the Buddhist majority, and forced peasants into fortified 'Strategic Hamlets'."
    },
    {
      question: "Using paragraph [5.1], what happened to President Diem in November 1963?",
      answer: "He was overthrown and assassinated in a military coup tacitly approved by President John F. Kennedy's administration."
    }
  ],
  lesson_3_2: [
    {
      question: "According to paragraph [1.1], what occurred during the Gulf of Tonkin incident in August 1964?",
      answer: "The US destroyer USS Maddox reported being fired upon by North Vietnamese torpedo boats in the Gulf of Tonkin."
    },
    {
      question: "Using paragraph [2.1], what powers did the Gulf of Tonkin Resolution grant to President Lyndon B. Johnson?",
      answer: "Complete authority to 'take all necessary measures' to repel armed attacks without needing a formal declaration of war from Congress."
    },
    {
      question: "According to paragraph [3.1], what was Operation Rolling Thunder, launched in March 1965?",
      answer: "A massive, continuous three-year aerial bombing campaign against military targets and supply routes in North Vietnam."
    },
    {
      question: "Using paragraph [5.1], why did the landing of 3,500 US Marines at Da Nang on 8 March 1965 represent a critical turning point?",
      answer: "It marked the introduction of direct American ground combat troops, shifting the US role from advising to fighting a land war."
    }
  ],
  lesson_3_3: [
    {
      question: "According to paragraph [1.1], what guerrilla tactics did the Vietcong use to neutralize superior American firepower?",
      answer: "Ambushes, 'clinging to the belt' in close combat to prevent US airstrikes, retreating into the jungle, and disappearing into local villages."
    },
    {
      question: "Using paragraph [2.1], how did the underground tunnel network at Cu Chi protect communist guerrillas?",
      answer: "They provided bomb-proof shelters, underground hospitals, weapons factories, and hidden trapdoors for surprise attacks."
    },
    {
      question: "According to paragraph [3.1], what was the Ho Chi Minh Trail and why was it so vital to the communist war effort?",
      answer: "A 16,000-km network of jungle roads through neutral Laos and Cambodia delivering continuous Soviet and Chinese weapons to the South."
    },
    {
      question: "Using paragraph [4.1], what was Agent Orange and why did the US military spray over 20 million gallons of it?",
      answer: "A toxic chemical herbicide sprayed from aircraft to destroy jungle foliage concealing guerrillas and kill enemy food crops."
    }
  ],
  lesson_3_4: [
    {
      question: "According to paragraph [1.1], what was the Tet Offensive, launched by the Vietcong and North Vietnamese in January 1968?",
      answer: "A coordinated surprise attack on over 100 South Vietnamese towns, cities, and the US Embassy in Saigon during the Lunar New Year truce."
    },
    {
      question: "Using paragraph [2.1], why was the Tet Offensive a massive psychological and political defeat for the United States despite military victory?",
      answer: "It proved to the American public that the government was lying about imminent victory, creating a massive 'credibility gap'."
    },
    {
      question: "According to paragraph [3.1], what was President Richard Nixon's policy of 'Vietnamization'?",
      answer: "Withdrawing American combat troops and training and equipping the South Vietnamese Army (ARVN) to fight the war alone."
    },
    {
      question: "Using paragraph [4.1], what secret military operations did Nixon order in 1969–1970 that sparked fury at home?",
      answer: "Secret bombing and military ground incursions into neutral Cambodia and Laos to destroy communist sanctuaries."
    }
  ],
  lesson_4_1: [
    {
      question: "According to paragraph [1.1], why was Vietnam called America’s first 'living room war'?",
      answer: "Television networks broadcast nightly, uncensored colour combat footage of wounded soldiers and burning villages directly into family living rooms."
    },
    {
      question: "Using paragraph [2.1], why was the military draft system criticized as unfair and discriminatory?",
      answer: "Wealthier and middle-class youths obtained college deferments or doctor excuses, while working-class and minority men were disproportionately conscripted."
    },
    {
      question: "According to paragraph [3.1], what occurred at the village of My Lai on 16 March 1968 under Lieutenant William Calley?",
      answer: "US troops of Charlie Company systematically murdered up to 504 unarmed Vietnamese women, children, and elderly civilians."
    },
    {
      question: "Using paragraph [4.1], what happened at Kent State University in Ohio on 4 May 1970?",
      answer: "National Guardsmen fired 67 rounds into unarmed student anti-war protesters, killing four students and wounding nine others."
    }
  ],
  lesson_4_2: [
    {
      question: "According to paragraph [1.1], why did millions of working-class and conservative Americans support the Vietnam War?",
      answer: "Out of anti-communist patriotism, respect for the armed forces, and disgust at student protesters burning American flags."
    },
    {
      question: "Using paragraph [2.1], who were the 'Silent Majority' addressed by President Richard Nixon in November 1969?",
      answer: "Law-abiding, patriotic Americans who supported the war and government policies but did not join vocal street demonstrations."
    },
    {
      question: "According to paragraph [3.1], what were the 'Hard Hat Riots' in New York City in May 1970?",
      answer: "Pro-war construction workers wearing hard hats attacked anti-war student demonstrators near Wall Street, supported by police."
    },
    {
      question: "Using paragraph [5.1], what was the result of the 1972 US Presidential Election?",
      answer: "Richard Nixon won an overwhelming 49-state landslide re-election victory over anti-war Democratic candidate George McGovern."
    }
  ],
  lesson_4_3: [
    {
      question: "According to paragraph [1.1], who conducted the secret Paris peace negotiations between 1969 and 1973?",
      answer: "US National Security Advisor Henry Kissinger and North Vietnamese diplomat Le Duc Tho."
    },
    {
      question: "Using paragraph [2.1], what was Operation Linebacker II (the 'Christmas Bombings') in December 1972?",
      answer: "Twelve days of massive, around-the-clock B-52 bombing raids on Hanoi and Haiphong to force North Vietnam back to the negotiating table."
    },
    {
      question: "According to paragraph [3.1], what did the Paris Peace Accords of January 1973 stipulate?",
      answer: "A complete ceasefire, the withdrawal of all remaining US combat troops within 60 days, and the release of all American prisoners of war."
    },
    {
      question: "Using paragraph [5.1], what restriction did Congress pass in November 1973 under the War Powers Act?",
      answer: "The President had to inform Congress within 48 hours of deploying troops and could not keep troops committed for over 60 days without congressional approval."
    }
  ],
  lesson_4_4: [
    {
      question: "According to paragraph [1.1], how quickly did the South Vietnamese Army (ARVN) collapse during the 1975 Spring Offensive?",
      answer: "Within just 55 days, as ARVN troops panicked and fled south despite possessing billions of dollars of American weaponry."
    },
    {
      question: "Using paragraph [2.1], what was Operation Frequent Wind in April 1975?",
      answer: "The emergency helicopter evacuation of over 7,000 Americans and South Vietnamese allies from the US Embassy roof as Saigon fell."
    },
    {
      question: "According to paragraph [3.1], why was Vietnamese nationalist determination a decisive factor in American defeat?",
      answer: "The Vietcong and North Vietnamese viewed the conflict as a holy war for national independence and were willing to sustain catastrophic casualties."
    },
    {
      question: "Using paragraph [5.1], how did the collapse of the American domestic home front prevent further US military intervention?",
      answer: "Deep public disillusionment, student protests, the Watergate scandal, and congressional funding cutoffs made continuing the war politically impossible."
    }
  ]
};

function calibrateUsaLessons(lessons) {
  lessons.forEach(l => {
    // 1. Apply calibrated blocks
    Object.keys(usaBlockCalibrations).forEach(k => {
      const cal = usaBlockCalibrations[k];
      const targetLessonId = cal.lesson_id || k;
      if (l.id === targetLessonId && l.narrative_blocks && l.narrative_blocks[cal.block_index]) {
        const b = l.narrative_blocks[cal.block_index];
        b.title = cal.title;
        b.theme_heading = cal.title;
        b.theme = cal.title;
        b.text = cal.text;
        b.content = cal.text;
      }
    });

    // 2. Attach Guided Reading
    if (usaGuidedReading[l.id]) {
      l.guided_reading = usaGuidedReading[l.id];
    }
  });
}

// 1. Update data/usa.json
const jsonPath = path.join(ROOT, 'data/usa.json');
const usaData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
calibrateUsaLessons(usaData.lessons);
fs.writeFileSync(jsonPath, JSON.stringify(usaData, null, 2), 'utf8');
console.log('Updated data/usa.json');

// 2. Update public/data/usa.json
const pubJsonPath = path.join(ROOT, 'public/data/usa.json');
if (fs.existsSync(pubJsonPath)) {
  fs.writeFileSync(pubJsonPath, JSON.stringify(usaData, null, 2), 'utf8');
  console.log('Updated public/data/usa.json');
}

// 3. Update units/usa/data.js
const unitJsPath = path.join(ROOT, 'units/usa/data.js');
if (fs.existsSync(unitJsPath)) {
  fs.writeFileSync(unitJsPath, 'window.unitData = ' + JSON.stringify(usaData, null, 2) + ';\nif (typeof module !== "undefined") { module.exports = window.unitData; }\n', 'utf8');
  console.log('Updated units/usa/data.js');
}

// 4. Update public/units/usa/data.js
const pubUnitJsPath = path.join(ROOT, 'public/units/usa/data.js');
if (fs.existsSync(pubUnitJsPath)) {
  fs.writeFileSync(pubUnitJsPath, 'window.unitData = ' + JSON.stringify(usaData, null, 2) + ';\nif (typeof module !== "undefined") { module.exports = window.unitData; }\n', 'utf8');
  console.log('Updated public/units/usa/data.js');
}

// 5. Update database.json and public/database.json
function updateDbFile(p) {
  if (!fs.existsSync(p)) return;
  const db = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (db.usa && db.usa.data && db.usa.data.lessons) {
    calibrateUsaLessons(db.usa.data.lessons);
    fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated ${path.basename(p)} via db.usa.data.lessons`);
  } else if (db.usa && db.usa.lessons) {
    calibrateUsaLessons(db.usa.lessons);
    fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated ${path.basename(p)} via db.usa.lessons`);
  }
}

updateDbFile(path.join(ROOT, 'database.json'));
updateDbFile(path.join(ROOT, 'public/database.json'));

console.log('ALL 5 USA STORES SYNCHRONIZED SUCCESSFULLY!');
