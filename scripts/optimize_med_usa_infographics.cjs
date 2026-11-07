const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = 'G:\\My Drive\\AAMX\\RESOURCES';
const MED_SRC_DIR = path.join(SOURCE_DIR, 'Medicine');
const USA_SRC_DIR = path.join(SOURCE_DIR, 'USA');

const USA_MAPPINGS = [
  {
    src: 'GCSE Paper 3 3A-D advice.png',
    unit: 'usa',
    lessonId: 'exam_practice',
    slug: 'usa_paper3_exam_strategy_guide',
    title: 'Edexcel GCSE Paper 3: Examination Strategy (Q1–Q3d)',
    topic: 'Paper 3 Section A & B Skills: Inferences, Causation & Interpretations',
    type: 'exam_technique',
    aspect: 'landscape',
    keyPoints: [
      'Q1 Inference [4m]: Give two inferences supported by explicit quotes/details from Source A.',
      'Q2 Explain Why [12m]: Three structured PEEL paragraphs explaining causes using 2 stimulus points + 1 own knowledge.',
      'Q3(a) Utility [8m]: Content and provenance (COP) of Sources B & C for a specified line of enquiry.',
      'Q3(b/c) Interpretations [4m each]: Explain how and why Interpretations 1 & 2 differ in emphasis or evidence.',
      'Q3(d) Agree with Interpretation [16m + 4m SPaG]: Substantiated criteria-led judgement evaluating Interpretation 1 against Interpretation 2.'
    ]
  },
  {
    src: 'USA KT1.1 The position of Black Americans in the early 1950s\\1950s Black Equality Struggle Infographic.png',
    unit: 'usa',
    lessonId: 'lesson_1_1',
    slug: 'usa_kt1_1_black_equality_struggle_1950s',
    title: 'The Position of Black Americans in the Early 1950s',
    topic: 'Key Topic 1.1: Position of Black Americans in the Early 1950s',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Jim Crow laws enforced rigid legal segregation across Southern public facilities, schools, and transport.',
      'Disenfranchisement: Poll taxes, literacy tests, and violent intimidation blocked Black voter registration.',
      'The Great Migration: Millions of African Americans moved to northern cities, facing de facto segregation and ghettoization.',
      'Early activism: The NAACP pursued targeted legal challenges against the "separate but equal" doctrine.',
      'Plessy v Ferguson (1896) remained the constitutional foundation underpinning Southern white supremacy.'
    ]
  },
  {
    src: 'USA KT1.2 Developments in education\\The Fight for Equal Education.png',
    unit: 'usa',
    lessonId: 'lesson_1_2',
    slug: 'usa_kt1_2_fight_for_equal_education',
    title: 'Brown v Board of Education & The Little Rock Nine (1954–1957)',
    topic: 'Key Topic 1.2: Developments in Education',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Brown v Board of Education (May 1954): Supreme Court ruled school segregation unconstitutional, overturning Plessy.',
      'Chief Justice Earl Warren declared that "separate educational facilities are inherently unequal".',
      'Southern "Massive Resistance": Southern Manifesto signed by 101 congressmen; closure of public schools.',
      'Little Rock Central High (1957): Governor Orval Faubus deployed National Guard to block nine Black students.',
      'President Eisenhower sent the 101st Airborne Division to enforce federal court orders and protect the students.'
    ]
  },
  {
    src: 'USA KT1.3 The Montgomery Bus Boycott and its impact, 1955–60\\Resistance on Wheels Infographic.png',
    unit: 'usa',
    lessonId: 'lesson_1_3',
    slug: 'usa_kt1_3_montgomery_bus_boycott',
    title: 'The Montgomery Bus Boycott & The Rise of MLK (1955–1960)',
    topic: 'Key Topic 1.3: The Montgomery Bus Boycott',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'December 1, 1955: Rosa Parks arrested for refusing to surrender her seat to a white passenger in Montgomery, Alabama.',
      'Montgomery Improvement Association (MIA) formed, electing 26-year-old Dr Martin Luther King Jr as leader.',
      '381-day sustained boycott: ~40,000 Black residents organized carpools and walked, costing bus companies massive revenue.',
      'Browder v Gayle (November 1956): Supreme Court declared bus segregation laws unconstitutional under the 14th Amendment.',
      'Foundation of SCLC (1957): Cemented non-violent direct action and Christian pacifism as central civil rights strategy.'
    ]
  },
  {
    src: 'USA KT1.4 Opposition to the civil rights movement\\Resistance to Civil Rights.png',
    unit: 'usa',
    lessonId: 'lesson_1_4',
    slug: 'usa_kt1_4_resistance_to_civil_rights',
    title: 'White Supremacy & Opposition to Civil Rights (1950s–1960s)',
    topic: 'Key Topic 1.4: Opposition to the Civil Rights Movement',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Ku Klux Klan (KKK) resurgence: Terror campaigns, cross burnings, firebombings, and targeted murders.',
      'White Citizens\' Councils (WCC): Middle-class economic boycotts, sacking Black workers and evicting tenants.',
      'Emmett Till murder (August 1955): 14-year-old lynched in Mississippi; all-white jury acquitted killers in 67 minutes.',
      'Southern political resistance: Police forces (e.g. Bull Connor in Birmingham) colluded with violent vigilantes.',
      'Dixiecrats in Congress used filibusters to dilute and delay federal civil rights legislation.'
    ]
  },
  {
    src: 'USA KT2.1 Progress and Developments, 1960–62\\Civil Rights Struggle 1960-1962.png',
    unit: 'usa',
    lessonId: 'lesson_2_1',
    slug: 'usa_kt2_1_civil_rights_struggle_1960_1962',
    title: 'Direct Action & Student Activism: Sit-Ins & Freedom Rides (1960–1962)',
    topic: 'Key Topic 2.1: Progress and Developments, 1960–1962',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Greensboro sit-ins (Feb 1960): 4 Black students at Woolworth\'s lunch counter sparked nationwide sit-in movement.',
      'Formation of SNCC (Student Nonviolent Coordinating Committee) to mobilize grassroots student protests.',
      'Freedom Rides (May 1961): CORE activists rode interstate buses to test Supreme Court desegregation rulings.',
      'Anniston and Birmingham attacks: Buses firebombed and riders brutally beaten while police held back.',
      'Federal enforcement: Attorney General Robert Kennedy ordered Interstate Commerce Commission to desegregate transit.'
    ]
  },
  {
    src: 'USA KT2.1 Progress and Developments, 1960–62\\Greensboro Sit-ins Impact Infographic.png',
    unit: 'usa',
    lessonId: 'lesson_2_1',
    slug: 'usa_kt2_1_greensboro_sit_ins',
    title: 'The Greensboro Lunch Counter Sit-Ins (1960)',
    topic: 'Key Topic 2.1: Progress and Developments, 1960–1962',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'February 1, 1960: Ezell Blair Jr, David Richmond, Franklin McCain, and Joseph McNeil staged sit-in at Woolworth\'s.',
      'Rapid escalation: Within a week, 54 students joined; within months, 70,000 students participated across 55 cities.',
      'Economic pressure: Boycotts of downtown stores cost retailers substantial revenue, forcing integration.',
      'July 1960: Greensboro Woolworth\'s officially served its first Black employees at the counter.',
      'Catalyzed formation of SNCC under Ella Baker, creating student-led direct-action vanguard.'
    ]
  },
  {
    src: 'USA KT2.1 Progress and Developments, 1960–62\\GCSE USA Freedom Rides.png',
    unit: 'usa',
    lessonId: 'lesson_2_1',
    slug: 'usa_kt2_1_freedom_rides_1961',
    title: 'The Freedom Rides & Interstate Desegregation (1961)',
    topic: 'Key Topic 2.1: Progress and Developments, 1960–1962',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'May 4, 1961: 13 CORE riders (7 Black, 6 white) departed Washington DC bound for New Orleans.',
      'Boynton v Virginia (1960) integration mandate systematically ignored across Deep South states.',
      'May 14 (Mother\'s Day): Greyhound bus ambushed, firebombed, and passengers assaulted outside Anniston, Alabama.',
      'Over 400 riders arrested in Jackson, Mississippi and sent to notorious Parchman Penitentiary.',
      'November 1, 1961: ICC issued strict regulations enforcing total desegregation of all interstate transit terminals.'
    ]
  },
  {
    src: 'USA KT2.2 Peaceful protests and their impact, 1963–65\\Birmingham 1963 Infographic.png',
    unit: 'usa',
    lessonId: 'lesson_2_2',
    slug: 'usa_kt2_2_birmingham_campaign_1963',
    title: 'Project C & The Birmingham Campaign (1963)',
    topic: 'Key Topic 2.2: Peaceful Protests and Their Impact, 1963–1965',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'April 1963: SCLC launched Project C ("Confrontation") targeting Birmingham, the most segregated city in America.',
      'MLK arrested on Good Friday; penned his famous "Letter from Birmingham Jail" defending non-violent lawbreaking.',
      'Children\'s Crusade (May 2–3): Police Chief Eugene "Bull" Connor deployed high-pressure fire hoses and attack dogs.',
      'Media impact: Televised images of police brutality shocked international audiences and embarrassed President Kennedy.',
      'Kennedy announced comprehensive civil rights legislation on national television in June 1963.'
    ]
  },
  {
    src: 'USA KT2.2 Peaceful protests and their impact, 1963–65\\Civil Rights Milestones 1964-1965.png',
    unit: 'usa',
    lessonId: 'lesson_2_2',
    slug: 'usa_kt2_2_civil_rights_milestones_1964_1965',
    title: 'Civil Rights Act 1964 & Voting Rights Act 1965',
    topic: 'Key Topic 2.2: Peaceful Protests and Their Impact, 1963–1965',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Civil Rights Act (July 1964): Banned discrimination in public accommodations, schools, and federally funded programs.',
      'Equal Employment Opportunity Commission (EEOC) established to prevent employment discrimination.',
      'Selma to Montgomery marches (March 1965): "Bloody Sunday" at Edmund Pettus Bridge televised state trooper violence.',
      'Voting Rights Act (August 1965): Suspended literacy tests and authorized federal examiners to register Black voters.',
      'African American voter registration in the South soared: Mississippi jumped from 6.7% in 1964 to 59.8% in 1967.'
    ]
  },
  {
    src: 'USA KT2.2 Peaceful protests and their impact, 1963–65\\Edexcel GCSE History 2.2 Civil Rights successes 1963-65 infographic.png',
    unit: 'usa',
    lessonId: 'lesson_2_2',
    slug: 'usa_kt2_2_civil_rights_successes_1963_1965',
    title: 'The Turning Point: March on Washington to Voting Rights (1963–1965)',
    topic: 'Key Topic 2.2: Peaceful Protests and Their Impact, 1963–1965',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'March on Washington (August 28, 1963): 250,000 marchers gathered at Lincoln Memorial; MLK delivered "I Have a Dream".',
      '16th Street Baptist Church bombing (Sept 1963): 4 young Black girls killed by KKK dynamite in Birmingham.',
      'President Lyndon B Johnson leveraged national grief after JFK\'s assassination to pass the 1964 Civil Rights Act.',
      'Selma Marches (1965) mobilized moral outrage that directly forced the passage of the Voting Rights Act.',
      '24th Amendment (1964) outlawed poll taxes in federal elections, eliminating a key barrier to Black suffrage.'
    ]
  },
  {
    src: 'USA KT2.2 Peaceful protests and their impact, 1963–65\\Freedom Summer 1964 History.png',
    unit: 'usa',
    lessonId: 'lesson_2_2',
    slug: 'usa_kt2_2_freedom_summer_1964',
    title: 'Mississippi Freedom Summer & The Murders of Chaney, Goodman & Schwerner (1964)',
    topic: 'Key Topic 2.2: Peaceful Protests and Their Impact, 1963–1965',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'Summer 1964: ~1,000 mostly white northern college volunteers went to Mississippi to register Black voters.',
      'Freedom Schools established: 41 schools taught 3,000 Black children reading, math, and Black history.',
      'June 21, 1964: Civil rights workers James Chaney, Andrew Goodman, and Michael Schwerner abducted and murdered by KKK.',
      'Mississippi Freedom Democratic Party (MFDP) organized under Fannie Lou Hamer to challenge all-white state delegation.',
      'Backlash exposed depths of Southern defiance: 37 Black churches bombed, 80 workers beaten, 1,000 arrested.'
    ]
  },
  {
    src: 'USA KT2.3 Malcolm X and Black Power, 1963–70\\Black Power Movement Radical Shift.png',
    unit: 'usa',
    lessonId: 'lesson_2_3',
    slug: 'usa_kt2_3_black_power_movement_radical_shift',
    title: 'The Black Power Movement & Radical Shift (1965–1970)',
    topic: 'Key Topic 2.3: Malcolm X and Black Power, 1963–1970',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Growing disillusionment: Legal civil rights did not solve Northern urban poverty, police brutality, or slum housing.',
      'Stokely Carmichael popularized "Black Power" slogan during the 1966 March Against Fear in Mississippi.',
      'Shift in SNCC & CORE: Expelled white members and abandoned non-violence in favour of armed self-defence.',
      '1968 Mexico City Olympics: Tommie Smith and John Carlos gave Black Power salute on the medal podium.',
      'Cultural revolution: Promoted Black pride, Afro hairstyles, African heritage, and economic self-sufficiency.'
    ]
  },
  {
    src: 'USA KT2.3 Malcolm X and Black Power, 1963–70\\Malcolm X Revolutionary Evolution.png',
    unit: 'usa',
    lessonId: 'lesson_2_3',
    slug: 'usa_kt2_3_malcolm_x_evolution',
    title: 'Malcolm X: Nation of Islam to Pan-African Unity (1952–1965)',
    topic: 'Key Topic 2.3: Malcolm X and Black Power, 1963–1970',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'Nation of Islam (NOI) spokesman: Preached Black separatism, self-reliance, and rejected non-violent integration.',
      'Advocated self-defence: Defended Black Americans\' right to protect themselves "by any means necessary".',
      'March 1964 split: Broke with Elijah Muhammad over moral scandals and strict political inactivity rules.',
      '1964 Hajj to Mecca: Transformed his views, embracing orthodox Sunni Islam and multiracial brotherhood.',
      'February 21, 1965: Assassinated in Harlem by three NOI members; posthumous autobiography inspired Black Power.'
    ]
  },
  {
    src: 'USA KT2.3 Malcolm X and Black Power, 1963–70\\The Black Panther Party Infographic.png',
    unit: 'usa',
    lessonId: 'lesson_2_3',
    slug: 'usa_kt2_3_black_panther_party',
    title: 'The Black Panther Party for Self-Defense (1966–1972)',
    topic: 'Key Topic 2.3: Malcolm X and Black Power, 1963–1970',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'October 1966: Founded in Oakland, California by Huey P Newton and Bobby Seale.',
      'Ten-Point Program demanded full employment, decent housing, education, and exemption of Black men from military draft.',
      'Armed cop-watching: Exercised 2nd Amendment rights to openly carry firearms while monitoring police arrests.',
      'Community Survival Programs: Free Breakfast for School Children fed 10,000+ daily; free health clinics and sickle-cell testing.',
      'FBI COINTELPRO: Director J Edgar Hoover labeled Panthers greatest internal security threat, targeting leaders for disruption.'
    ]
  },
  {
    src: 'USA KT2.4 The civil rights movement, 1965–75\\Civil Rights 65 to 75  Law vs Reality.png',
    unit: 'usa',
    lessonId: 'lesson_2_4',
    slug: 'usa_kt2_4_civil_rights_law_vs_reality',
    title: 'Urban Riots, The Kerner Report & De Facto Segregation (1965–1968)',
    topic: 'Key Topic 2.4: The Civil Rights Movement, 1965–1975',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Watts Riot, Los Angeles (August 1965): 6 days of violence; 34 dead, 1,000 injured, $40 million in property damage.',
      '"Long Hot Summers" (1966–1967): Over 150 race riots in northern/midwestern cities, including Detroit (43 dead) and Newark.',
      'Kerner Commission (1968): Concluded America was "moving toward two societies, one black, one white—separate and unequal".',
      'MLK\'s Chicago Campaign (1966): Highlighted northern housing discrimination and entrenched economic deprivation.',
      'April 4, 1968: MLK assassinated in Memphis, triggering riots in over 100 American cities.'
    ]
  },
  {
    src: 'USA KT2.4 The civil rights movement, 1965–75\\US Civil Rights 1965–1975.png',
    unit: 'usa',
    lessonId: 'lesson_2_4',
    slug: 'usa_kt2_4_us_civil_rights_1965_1975_overview',
    title: 'Civil Rights in the Nixon Era: Fair Housing & Affirmative Action (1968–1975)',
    topic: 'Key Topic 2.4: The Civil Rights Movement, 1965–1975',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Civil Rights Act 1968 (Fair Housing Act): Banned discrimination in sale, rental, and financing of housing.',
      'Swann v Charlotte-Mecklenburg (1971): Supreme Court approved busing students to achieve racial balance in schools.',
      'Affirmative Action: Philadelphia Plan required federal contractors to set specific minority hiring goals.',
      'Political progress: Rapid growth of Black elected officials, mayors in major cities, and Congressional Black Caucus (1971).',
      'White backlash: "Southern Strategy" mobilized suburban and Southern white voters against busing and welfare reforms.'
    ]
  },
  {
    src: 'USA KT3.1 Reasons for US involvement in the conflict in Vietnam, 1954–63\\Vetnam 54-63.png',
    unit: 'usa',
    lessonId: 'lesson_3_1',
    slug: 'usa_kt3_1_vietnam_roots_1954_1963',
    title: 'The Cold War Roots of Vietnam: Geneva to Diem\'s Fall (1954–1963)',
    topic: 'Key Topic 3.1: US Involvement in Vietnam, 1954–1963',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Domino Theory: Eisenhower warned that if South Vietnam fell to communism, neighbouring Asian nations would topple.',
      'Geneva Accords (1954): French departure; Vietnam temporarily divided at 17th parallel with nationwide elections promised for 1956.',
      'US backs Ngo Dinh Diem in South Vietnam; Diem refused to hold 1956 elections, knowing Ho Chi Minh would win.',
      'Diem\'s oppressive regime: Favoured Catholic elite, repressed Buddhist majority, and alienated peasants through Strategic Hamlets.',
      '1960: National Liberation Front (NLF / Vietcong) formed to overthrow Diem and unify Vietnam under communist rule.'
    ]
  },
  {
    src: 'USA KT3.1 Reasons for US involvement in the conflict in Vietnam, 1954–63\\History of Ngo Dinh Diem.png',
    unit: 'usa',
    lessonId: 'lesson_3_1',
    slug: 'usa_kt3_1_history_ngo_dinh_diem',
    title: 'Ngo Dinh Diem: Repression, Buddhist Crisis & The 1963 Coup',
    topic: 'Key Topic 3.1: US Involvement in Vietnam, 1954–1963',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'Anti-communist dictator: Appointed family members to key posts and used secret police under brother Ngo Dinh Nhu.',
      'Strategic Hamlets Program (1962): Forcibly relocated peasants behind barbed-wire fences, breeding hatred and VC sympathies.',
      'Buddhist Crisis (May 1963): Diem banned Buddhist flags on the Buddha\'s birthday; troops fired into peaceful crowds.',
      'Self-immolation of Thich Quang Duc (June 1963): Photograph shocked world; Madame Nhu dismissed it as a "barbecue".',
      'November 2, 1963: South Vietnamese military coup backed by US ambassador Cabot Lodge overthrew and assassinated Diem.'
    ]
  },
  {
    src: 'USA KT3.1 Reasons for US involvement in the conflict in Vietnam, 1954–63\\Vietnam War Escalation 1954-1963 Timeline.png',
    unit: 'usa',
    lessonId: 'lesson_3_1',
    slug: 'usa_kt3_1_vietnam_escalation_timeline_1954_1963',
    title: 'Kennedy\'s "Flexible Response" & The Escalation of US Advisers (1961–1963)',
    topic: 'Key Topic 3.1: US Involvement in Vietnam, 1954–1963',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Kennedy doctrine: Shifted from massive nuclear retaliation to counter-insurgency ("Flexible Response").',
      'Expansion of military advisers (MACV): US troop presence surged from ~700 in 1961 to over 16,000 by late 1963.',
      'Green Berets (Special Forces) trained South Vietnamese army (ARVN) in counter-guerrilla tactics.',
      'Operation Ranch Hand (1961): Initial defoliation spraying of Agent Orange to strip jungle canopy and destroy food crops.',
      'Battle of Ap Bac (Jan 1963): Outnumbered VC forces routed 1,500 ARVN troops equipped with US helicopters and armor.'
    ]
  },
  {
    src: 'USA KT3.2 Escalation of the conflict under Johnson\\Vietnam War Escalation 1964–1965.png',
    unit: 'usa',
    lessonId: 'lesson_3_2',
    slug: 'usa_kt3_2_vietnam_escalation_1964_1965',
    title: 'The Gulf of Tonkin Incident & Operation Rolling Thunder (1964–1965)',
    topic: 'Key Topic 3.2: Escalation Under Johnson',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Gulf of Tonkin Incident (August 1964): USS Maddox reported North Vietnamese torpedo boat attack; second attack disputed.',
      'Gulf of Tonkin Resolution (August 1964): Congress gave Johnson authority to "take all necessary measures to repel armed attack".',
      'February 1965: Vietcong mortar attack on US base at Pleiku killed 8 Americans, triggering aerial retaliation.',
      'Operation Rolling Thunder (March 1965): Sustained bombing campaign of North Vietnam lasting over 3 years (864,000 tons of bombs).',
      'March 8, 1965: 3,500 US Marines landed at Da Nang—the first official American combat troops deployed in Vietnam.'
    ]
  },
  {
    src: 'USA KT3.3 The nature of the conflict in Vietnam, 1964–68\\Asymmetric Warfare in Vietnam Infographic.png',
    unit: 'usa',
    lessonId: 'lesson_3_3',
    slug: 'usa_kt3_3_asymmetric_warfare_vietnam',
    title: 'Guerrilla Warfare vs Modern Technology: Vietcong vs US Military Tactics (1965–1968)',
    topic: 'Key Topic 3.3: Nature of the Conflict in Vietnam, 1964–1968',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Vietcong guerrilla tactics: "Hanging onto the belts" of American troops to negate US air support and artillery.',
      'Cu Chi tunnel network: Hundreds of miles of underground bunkers, hospitals, and command posts safe from B-52 strikes.',
      'Booby traps: Punji stick pits smeared with excrement, tripwires, and unexploded US ordnance recycled into landmines.',
      'US Search and Destroy missions: Helicopters dropped troops into "Zippo raids" burning suspected VC hamlets.',
      'Chemical defoliants: 20 million gallons of Agent Orange and incendiary Napalm dropped, poisoning farmland and civilians.'
    ]
  },
  {
    src: 'USA KT3.3 The nature of the conflict in Vietnam, 1964–68\\Tet Offensive 1968 Infographic Overview.png',
    unit: 'usa',
    lessonId: 'lesson_3_3',
    slug: 'usa_kt3_3_tet_offensive_1968',
    title: 'The Tet Offensive: Military Victory, Psychological Defeat (1968)',
    topic: 'Key Topic 3.3: Nature of the Conflict in Vietnam, 1964–1968',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'January 31, 1968: 84,000 VC and North Vietnamese troops launched surprise attacks during the Tet lunar new year truce.',
      'Over 100 cities and military installations struck simultaneously, including the US Embassy in Saigon and ancient city of Hue.',
      'Military outcome: Decisive tactical defeat for communists; ~45,000 VC killed, virtually wiping out VC guerrilla cadre.',
      'Psychological turning point: General Westmoreland had claimed "light at the end of the tunnel"; Tet exposed the credibility gap.',
      'March 31, 1968: President Lyndon B Johnson announced a partial bombing halt and declared he would not seek re-election.'
    ]
  },
  {
    src: 'USA KT3.4 Changes under Nixon, 1969–73\\Nixon\'s Vietnam Strategy Infographic.png',
    unit: 'usa',
    lessonId: 'lesson_3_4',
    slug: 'usa_kt3_4_nixon_vietnam_strategy',
    title: 'Vietnamization, The Madman Theory & Cambodia Incursion (1969–1973)',
    topic: 'Key Topic 3.4: Changes Under Nixon, 1969–1973',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Nixon Doctrine & Vietnamization: Gradual withdrawal of US ground troops while heavily arming ARVN to fight the war.',
      'Secret bombing of Cambodia (Operation Menu, 1969): Target Ho Chi Minh Trail sanctuaries without congressional approval.',
      'April 1970 Cambodia Incursion: 30,000 US and ARVN troops invaded Cambodia, sparking massive campus protests at home.',
      'Operation Linebacker (1972): Massive B-52 Christmas Bombing of Hanoi and Haiphong to force North Vietnam back to Paris talks.',
      'Linkage diplomacy: Henry Kissinger opened relations with China and USSR (Détente) to isolate North Vietnam diplomatically.'
    ]
  },
  {
    src: 'USA KT4.1 Opposition to the war\\Vietnam War Support Collapse.png',
    unit: 'usa',
    lessonId: 'lesson_4_1',
    slug: 'usa_kt4_1_vietnam_war_support_collapse',
    title: 'The Anti-War Movement, The Draft & Kent State (1965–1971)',
    topic: 'Key Topic 4.1: Opposition to the War',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'The "Living Room War": First televised conflict brought graphic footage of body bags, burning villages, and casualties daily.',
      'The Draft lottery: Deeply unpopular; disproportionately drafted working-class youth; draft-card burning and Canada exile.',
      'My Lai Massacre revealed (Nov 1969): 504 unarmed Vietnamese villagers murdered by Charlie Company under Lt William Calley.',
      'Kent State shootings (May 4, 1970): Ohio National Guardsmen opened fire on student anti-war protest, killing 4 students.',
      'Vietnam Veterans Against the War (VVAW): Returning soldiers threw war medals over Capitol barricades in protest.'
    ]
  },
  {
    src: 'USA KT4.2 Support for the war\\American Support for Vietnam War.png',
    unit: 'usa',
    lessonId: 'lesson_4_2',
    slug: 'usa_kt4_2_american_support_for_war',
    title: 'The "Silent Majority", Hawks & Hard Hat Riots (1965–1972)',
    topic: 'Key Topic 4.2: Support for the War',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Hawks vs Doves: Hawks argued US military withdrawal would dishonour fallen soldiers and trigger global communist takeover.',
      'Nixon\'s "Silent Majority" speech (Nov 3, 1969): Appealed to patriotic, law-abiding working-class Americans against radical protesters.',
      'Hard Hat Riot (May 8, 1970): 200 construction workers attacked anti-war student demonstrators in Manhattan.',
      'Patriotism and anti-communism: Strong support in southern states, military families, and conservative church communities.',
      'Fear of betrayal: Widespread belief that the US military was being "stabbed in the back" by politicians and biased liberal media.'
    ]
  },
  {
    src: 'USA KT4.3 The peace process and end of the war\\Vietnam War Ending and Costs.png',
    unit: 'usa',
    lessonId: 'lesson_4_3',
    slug: 'usa_kt4_3_vietnam_peace_process_and_end',
    title: 'Paris Peace Accords & The Fall of Saigon (1973–1975)',
    topic: 'Key Topic 4.3: The Peace Process and End of the War',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Paris Peace Accords (Jan 27, 1973): Immediate ceasefire, total withdrawal of US forces within 60 days, return of all POWs.',
      'North Vietnamese Army (PAVN) permitted to remain in South Vietnam; Nguyen Van Thieu\'s regime felt abandoned.',
      'War Powers Act (Nov 1973): Congress restricted presidential war-making powers, preventing Nixon from intervening again.',
      'April 1975 Spring Offensive: North Vietnamese forces rapidly overran South Vietnam in just 55 days.',
      'Fall of Saigon (April 30, 1975): Iconic rooftop helicopter evacuations from US Embassy; Vietnam unified under communism.'
    ]
  },
  {
    src: 'USA KT4.4 Reasons for the failure of the USA in Vietnam\\Reasons for US Vietnam Defeat.png',
    unit: 'usa',
    lessonId: 'lesson_4_4',
    slug: 'usa_kt4_4_reasons_us_vietnam_defeat',
    title: 'Why Did America Lose? Causal Analysis of US Defeat in Vietnam',
    topic: 'Key Topic 4.4: Reasons for the Failure of the USA in Vietnam',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Vietcong tenacity and knowledge of terrain: Commitment to nationalist independence outweighed US technological superiority.',
      'Failure of "Hearts and Minds": Bombing, Napalm, and Search & Destroy pushed rural peasants into supporting the VC.',
      'Weakness and corruption of South Vietnam: ARVN lacked morale; Saigon government seen as US puppet regime.',
      'Loss of the domestic home front: Anti-war protests, media scrutiny, and draft resistance destroyed political will to continue.',
      'Inappropriate conventional military tactics: US forces prepared for European tank warfare, ill-equipped for jungle insurgency.'
    ]
  },
  {
    src: 'USA KT4.4 Reasons for the failure of the USA in Vietnam\\Ho Chi Minh Independence Infographic.png',
    unit: 'usa',
    lessonId: 'lesson_4_4',
    slug: 'usa_kt4_4_ho_chi_minh_independence',
    title: 'Ho Chi Minh & The Trail: Nationalism, Logistics & Victory',
    topic: 'Key Topic 4.4: Reasons for the Failure of the USA in Vietnam',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'Nationalist visionary: Ho Chi Minh blended Marxist-Leninist ideology with Vietnamese anti-colonial struggle.',
      'The Ho Chi Minh Trail: 10,000-mile labyrinth of supply roads through Laos and Cambodia delivering 400 tons of supplies daily.',
      'Sustained despite relentless US bombing: Hundreds of thousands of youth and women rebuilt roads overnight by hand.',
      'Soviet and Chinese military aid: North Vietnam received modern surface-to-air missiles (SAMs), MiGs, and artillery.',
      'Causal verdict: Superior determination and asymmetric logistics defeated the world\'s greatest superpower.'
    ]
  }
];

const MEDICINE_MAPPINGS = [
  {
    src: 'medicine overview.png',
    unit: 'edexcel_medicine',
    lessonId: 'unit_overview',
    slug: 'med_course_overview_c1250_present',
    title: 'Medicine in Britain: c1250–Present Master Course Overview',
    topic: 'Paper 1 Thematic Study: 750 Years of Medical Change & Continuity',
    type: 'unit_overview',
    aspect: 'portrait',
    keyPoints: [
      '4 Core Eras: Medieval (c1250–1500), Renaissance (c1500–1700), Industrial (c1700–1900), Modern (c1900–present).',
      'Factors influencing medicine: The Church, Science & Technology, Individuals, Government, War, and Communication.',
      'Changing ideas on causes: From Divine punishment & Four Humours to Germ Theory (1861) and Genetics/DNA (1953).',
      'Advances in prevention: Flagellation and pomanders to Cowpox vaccine (1796), Clean Water Acts, and NHS mass screening.',
      'Western Front Historic Environment (1914–1918): Trench trauma, Gas gangrene, Mobile X-rays, and Blood banks.'
    ]
  },
  {
    src: 'The Ladder of Progress.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_3_5',
    slug: 'med_ladder_of_progress_synoptic',
    title: 'The Ladder of Progress: Government Intervention in Public Health (1800–1948)',
    topic: 'Key Topic 3.5: Public Health Legislation & The Welfare State (1848–1948)',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      '1848 Public Health Act (The Permissive Start): Created General Board of Health, but local town improvements remained optional.',
      '1875 Public Health Act (Compulsory Action): Ended laissez-faire; forced all local councils to provide clean water, sewers, and street lighting.',
      '1911 National Insurance Act (The Safety Net): Lloyd George provided sick pay and free medical care for low-income workers.',
      '1948 The NHS (Cradle to Grave Care): Aneurin Bevan launched free universal healthcare funded entirely through general taxation.',
      'Decisive shift: Government evolved from complete non-interference (laissez-faire) into a proactive protector of national health.'
    ]
  },
  {
    src: 'medieval.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_1_4',
    slug: 'med_medieval_era_overview',
    title: 'Medieval Medicine: Religion, Care Not Cure & The Healers (c1250–c1500)',
    topic: 'Key Topic 1.4: Medical Care Providers & Monastic Hospitals',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'The Spiritual Pillar: The Church dictated disease understanding and governed hospitals, focusing on prayer and spiritual salvation.',
      'Hospitals: Care, Not Cure: Monastic hospitals provided shelter, warmth, and food for the poor and dying, not medical surgery.',
      'The Practical Pillar: Ordinary sick people treated at home by women using garden herbs like marigolds.',
      'Comparison of Healers: University-trained Physicians diagnosed via urine/astrology; Apothecaries mixed herbs; Barber-Surgeons performed bloodletting.',
      'Control of Medical Knowledge: Monasteries and universities strictly preserved and taught Galen because his Creator theology aligned with Genesis.'
    ]
  },
  {
    src: 'KT1.1 Medieval c1250–c1500 Causes of Illness\\Medieval Causes of Illness Chart.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_1_1',
    slug: 'med_kt1_1_causes_of_illness_chart',
    title: 'Medieval Causes of Illness: God, Planets & The Four Humours',
    topic: 'Key Topic 1.1: Supernatural & Rational Explanations',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Divine retribution: Illness sent by God to cleanse sins or test religious faith; treated with prayer and pilgrimage.',
      'Astrological influences: Physicians checked planetary charts before bleeding patients or performing surgery.',
      'The Four Humours balance: Illness caused by an excess or deficiency of humours; linked to seasons and temperaments.',
      'Miasma theory: Bad air from decaying matter, stagnant water, or unburied corpses believed to corrupt the blood.',
      'Total stagnation: Medical knowledge remained unchanged for centuries because the Church forbade dissection of human bodies.'
    ]
  },
  {
    src: 'KT1.2 Medieval c1250–c1500 Prevention & Treatment\\KT1.2 Medieval c1250–c1500 Prevention & Treatment.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_1_3',
    slug: 'med_kt1_3_medieval_prevention_treatment',
    title: 'Medieval Approaches to Prevention & Treatment: Bleeding, Purging & Herbal Lore',
    topic: 'Key Topic 1.3: Approaches to Prevention and Treatment',
    type: 'lesson_summary',
    aspect: 'portrait',
    keyPoints: [
      'Phlebotomy (bloodletting): Cupping, leeching, and vein incisions used to restore humours; overseen by barber-surgeons.',
      'Purging and laxatives: Herbal emetics prescribed to empty the stomach and bowels according to Galen\'s Theory of Opposites.',
      'Regimen Sanitatis: Set of health rules advising exercise, moderate eating, fresh air, and regular bathing.',
      'Apothecaries and wise women: Prepared herbal remedies (e.g. theriac, garlic, rose hips) based on local herbal lore.',
      'Religious prevention: Chanting litanies, wearing amulets, fasting, and making monetary donations to monasteries.'
    ]
  },
  {
    src: 'KT1.3 Medieval c1250–c1500 The Black Death\\Black Death History Revision Guide.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_1_5',
    slug: 'med_kt1_5_black_death_revision_guide',
    title: 'The Black Death (1348–1349): Symptoms, Causes & Societal Impact',
    topic: 'Key Topic 1.5: Case Study: The Black Death, 1348–1349',
    type: 'lesson_summary',
    aspect: 'portrait',
    keyPoints: [
      'Arrival in England (summer 1348): Bubonic and pneumonic plague killed between 30% and 45% of the English population.',
      'Gruesome symptoms: Painful buboes in groins and armpits, black necrotic skin blotches, high fever, and spitting blood.',
      'Flawed contemporary explanations: Alignment of Saturn and Jupiter (1345), God\'s wrath, miasma, and poisonous fumes.',
      'Futile medical responses: Lance buboes, burn sweet-smelling herbs, ring church bells, and drink crushed emeralds.',
      'Social consequences: Severe agricultural labour shortages led to peasants demanding higher wages, weakening feudalism.'
    ]
  },
  {
    src: 'KT1.3 Medieval c1250–c1500 The Black Death\\Medieval Black Death History Overview.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_1_5',
    slug: 'med_kt1_5_black_death_overview',
    title: 'The Black Death (1348): Medieval Quarantine & The Flagellants',
    topic: 'Key Topic 1.5: Case Study: The Black Death, 1348–1349',
    type: 'thematic_deep_dive',
    aspect: 'portrait',
    keyPoints: [
      'Complete medical helplessness: Doctors had no understanding of Yersinia pestis or flea transmission on black rats.',
      'Religious extremism: The Brotherhood of Flagellants whipped themselves publicly in town squares to appease God\'s anger.',
      'Government failure: King Edward III ordered streets cleaned of human excrement, believing foul smells spread the pestilence.',
      'Quarantine measures: Gloucester attempted to shut its town gates to outsiders, but infection spread regardless.',
      'Breakdown of religious authority: So many parish priests died administering last rites that uneducated clergy were hastily ordained.'
    ]
  },
  {
    src: 'Renaissance.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_2_1',
    slug: 'med_renaissance_era_overview',
    title: 'The Medical Renaissance: Humanism, Dissection & Scientific Enquiry (c1500–c1700)',
    topic: 'Key Topic 2: Medical Renaissance in Britain, c1500–c1700',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Renaissance "rebirth": Decline of Church control over medical teaching; revival of direct observation and humanism.',
      'Johannes Gutenberg\'s printing press (c1440): Enabled rapid, accurate mass dissemination of medical textbooks without copying errors.',
      'The Royal Society (1660): Founded under King Charles II with motto "Nullius in Verba" (Take nobody\'s word for it); published Philosophical Transactions.',
      'Gradual change: Anatomy and physiology advanced dramatically, but patient treatments and everyday cures showed heavy continuity.',
      'Royal patronage: Monarchs granted anatomical charters allowing lawful dissection of executed criminals.'
    ]
  },
  {
    src: 'KT2.1 Renaissance c1500–c1700 Causes of Illness\\The Medical Renaissance Evolution.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_2_1',
    slug: 'med_kt2_1_medical_renaissance_evolution',
    title: 'The Medical Renaissance: Challenging Ancient Authority',
    topic: 'Key Topic 2.1: The New Spirit of Enquiry',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Humanist doctors retranslated original Greek texts of Hippocrates and Galen, discovering centuries of medieval distortions.',
      'Shift from scholastic theory to empirical dissection: Physicians began to verify anatomical claims with their own eyes.',
      'Foundation of Royal College of Physicians (1518): Began licensing doctors and prosecuting quack medicine practitioners.',
      'Microscopic discovery: Robert Hooke and Antonie van Leeuwenhoek observed microorganisms, though connection to disease was unknown.',
      'The Renaissance paradox: Medical theory transformed, but ordinary patients still purged, bled, and bought Galenic herbs.'
    ]
  },
  {
    src: 'Thomas Sydenham The English Hippocrates.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_2_2',
    slug: 'med_kt2_2_thomas_sydenham',
    title: 'Thomas Sydenham: "The English Hippocrates" & Bedside Observation (1676)',
    topic: 'Key Topic 2.2: Thomas Sydenham and Bedside Observation',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'Observationes Medicae (1676): Argued diseases had distinct species and life cycles, like plants in botany.',
      'Revolution in methodology: Urged doctors to sit at patient bedsides, record exact symptoms, and observe disease progression.',
      'Refusal of traditional theory: Rejected theoretical book learning and astrology; refused to bleed patients routinely.',
      'Pioneered cinchona bark (quinine) for malaria and cool air/rest treatments for smallpox rather than sweat rooms.',
      'Causal impact: Shifted medicine away from unique individual humeral imbalances toward diagnosing specific classified illnesses.'
    ]
  },
  {
    src: 'KT2.2 Renaissance c1500–c1700 Prevention & Treatment\\Andreas Vesalius.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_2_3',
    slug: 'med_kt2_3_andreas_vesalius_fabrica',
    title: 'Andreas Vesalius & The Anatomical Revolution (1543)',
    topic: 'Key Topic 2.3: Andreas Vesalius and the Anatomical Revolution',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'De Humani Corporis Fabrica ("On the Fabric of the Human Body", 1543): Groundbreaking textbook with detailed anatomical woodcuts.',
      'Direct human dissection: Vesalius dissected human corpses personally at University of Padua, urging students to verify evidence.',
      'Disproved Galen\'s 300 errors: Proved human jawbone is one single bone (not two), and septum of heart has no invisible holes.',
      'Explained Galen\'s mistakes: Revealed Galen had dissected apes, pigs, and dogs because human dissection was forbidden in ancient Rome.',
      'Lasting legacy: Inspired generations of anatomists to question ancient medical dogma and rely on direct empirical evidence.'
    ]
  },
  {
    src: 'William Harvey\'s Heart Circulation Infographic.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_2_4',
    slug: 'med_kt2_4_william_harvey_circulation',
    title: 'William Harvey & The Circulation of the Blood (1628)',
    topic: 'Key Topic 2.4: William Harvey and Circulation of Blood',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'De Motu Cordis ("On the Motion of the Heart and Blood", 1628): Proved blood circulates continuously in one direction around the body.',
      'Overturned Galen\'s orthodoxy: Disproved Galen\'s claim that liver manufactures new blood constantly from digested food.',
      'Mechanical understanding: Compared the heart to a mechanical fire-fighting water pump with valves preventing backflow.',
      'Mathematical evidence: Calculated that the heart pumps out 540 pints of blood per hour—impossible to produce from food.',
      'Limited immediate impact: Many contemporary physicians rejected his findings; bloodletting continued for another 200 years.'
    ]
  },
  {
    src: 'KT2.3 Renaissance c1500–c1700 Harvey & The Great Plague\\Renaissance Harvey and Great Plague.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_2_4',
    slug: 'med_kt2_4_renaissance_harvey_plague_mat',
    title: 'Renaissance Milestones: Harvey\'s Discovery & The Great Plague',
    topic: 'Key Topics 2.4 & 2.5: Circulation & The Great Plague',
    type: 'thematic_deep_dive',
    aspect: 'portrait',
    keyPoints: [
      'Scientific breakthrough: William Harvey proves one-way systemic circulation of blood powered by heart contraction.',
      'The 1665 Great Plague struck London: Killed approximately 100,000 people (20% of London\'s population).',
      'Government public health action: Mayor of London ordered "Searchers" to identify infected houses marked with red crosses.',
      'Watchmen posted outside boarded-up homes with inscription: "Lord Have Mercy Upon Us".',
      'Mass burial pits: Thousands buried in communal plague pits at night to prevent panic and contagion.'
    ]
  },
  {
    src: 'KT2.3 Renaissance c1500–c1700 Harvey & The Great Plague\\unnamed.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_2_5',
    slug: 'med_kt2_5_renaissance_harvey_and_plague_breakthrough',
    title: 'Harvey\'s Mechanical Heart & The 1665 Plague Quarantine',
    topic: 'Key Topics 2.4 & 2.5: Circulation and The Great Plague',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'The heart as a mechanical pump: Blood flows through arteries from the heart and returns through veins.',
      'The 1665 Plague response: Systematic slaughter of ~40,000 dogs and ~200,000 cats (which worsened the rat infestation).',
      'Miasma prevention: Streets fumigated with burning barrels of pitch; plague doctors wore bird-beak masks filled with herbs.',
      'Plague orders: Theatres, taverns, and public gatherings banned; curfew strictly enforced across London wards.',
      'End of the epidemic: Cold winter of 1665 and the Great Fire of London (September 1666) helped destroy rat habitats.'
    ]
  },
  {
    src: 'unnamed.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_2_5',
    slug: 'med_kt2_5_spot_difference_1348_vs_1665',
    title: 'Spot the Difference: The Black Death (1348) vs The Great Plague (1665)',
    topic: 'Key Topic 2.5: Comparison of Black Death and Great Plague',
    type: 'comparative_analysis',
    aspect: 'landscape',
    keyPoints: [
      'Causes: In both 1348 and 1665, people still blamed God, bad planetary alignment, and miasma (300 years of continuity).',
      'Medical knowledge: Germ Theory was still 200 years away; physicians still had zero understanding of flea or bacterial contagion.',
      'Treatment continuity: Patients in both eras were bled, purged, and given herbal concoctions like Venice Treacle.',
      'Key change in government action: In 1665, local authorities were far more organized, enforcing house quarantines and searchers.',
      'Pest houses: Purpose-built isolation wards established outside city boundaries in 1665 to isolate the sick.'
    ]
  },
  {
    src: 'KT2.2 Renaissance c1500–c1700 Prevention & Treatment\\Renaissance Medical Prevention and Treatment.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_2_5',
    slug: 'med_kt2_5_renaissance_prevention_treatment',
    title: 'Renaissance Prevention & Treatment: Chemical Cures & Transference',
    topic: 'Key Topic 2.5: Continuity in Treatment',
    type: 'lesson_summary',
    aspect: 'portrait',
    keyPoints: [
      'Transference theory: Belief that an illness could be transferred from a patient to an animal or object (e.g. strapping a plucked chicken to buboes).',
      'Iatrochemistry (chemical medicine): Paracelsus pioneered using mineral treatments like antimony and mercury rather than herbs.',
      'New World remedies: Exploration brought tobacco (heralded as universal cure), cinchona bark, and sarsaparilla to Britain.',
      'Persistent quackery: Charlatans sold patent medicines and "sovereign remedies" at fairs without any regulation.',
      'Royal Touch: Believed that monarchs possessed divine healing power to cure scrofula ("the King\'s Evil") with their touch.'
    ]
  },
  {
    src: 'Industrial.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_3_1',
    slug: 'med_industrial_era_overview',
    title: 'Industrial Medicine: The Scientific Revolution & Germs (c1700–c1900)',
    topic: 'Key Topic 3: Medicine in Eighteenth & Nineteenth Century Britain',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Rapid urbanization: Industrial cities (Manchester, Leeds, London) suffered catastrophic overcrowding, filth, and low life expectancy.',
      'Louis Pasteur\'s Germ Theory (1861): Destroyed spontaneous generation and proved microscopic bacteria cause decay and disease.',
      'Robert Koch\'s bacteriology: Identified specific microbes causing anthrax, tuberculosis, and cholera; used agar jelly and dyes.',
      'Surgical transformation: James Simpson introduced chloroform anaesthetic (1847); Joseph Lister introduced carbolic antiseptic (1867).',
      'Public health reform: John Snow proved cholera is waterborne (1854); 1875 Public Health Act mandated sewers and clean water.'
    ]
  },
  {
    src: 'KT3.1 18th & 19th Century c1700-c1900 - Causes of Illness\\The Germ Revolution History Timeline.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_3_1',
    slug: 'med_kt3_1_germ_revolution_timeline',
    title: 'The Germ Theory Revolution: Spontaneous Generation to Microbes (1861–1883)',
    topic: 'Key Topic 3.1: Pasteur and Koch',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Pre-1861 orthodoxy: Spontaneous generation claimed microbes appeared out of decaying matter automatically.',
      'Swan-neck flask experiments: Pasteur proved sterilized broth only decayed when exposed to airborne dust particles carrying germs.',
      '1861 publication: Pasteur publishes Germ Theory, though initially rejected by British doctors (e.g. Dr Henry Bastian).',
      'Anthrax and rabies vaccines: Pasteur developed attenuated (weakened) pathogen vaccines for animals and humans (1885).',
      'Decisive shift: Proved specific microscopic living organisms cause specific infections, establishing modern bacteriology.'
    ]
  },
  {
    src: 'Louis Pasteu Modern Medicine Architect.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_3_1',
    slug: 'med_kt3_1_louis_pasteur',
    title: 'Louis Pasteur: Architect of Germ Theory & Immunology (1822–1895)',
    topic: 'Key Topic 3.1: Ideas on Causes: Pasteur’s Germ Theory',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'French chemist hired by Lille brewing industry (1857) to explain why beer and wine soured into vinegar.',
      'Invented "Pasteurization": Gentle heating to 60°C killed harmful bacteria without ruining beverage taste.',
      '1865 Silkworm investigation: Proved pébrine disease in silkworms was caused by a living microscopic parasite.',
      'Chicken cholera breakthrough (1879): Charles Chamberland accidentally injected old cholera culture; chickens survived and gained immunity.',
      'Global triumph: In 1885, Pasteur successfully cured 9-year-old Joseph Meister of fatal rabies using attenuated spinal cord vaccine.'
    ]
  },
  {
    src: 'Robert Koch Father of Bacteriology.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_3_1',
    slug: 'med_kt3_1_robert_koch',
    title: 'Robert Koch: "Father of Modern Bacteriology" & Microbe Hunter (1843–1910)',
    topic: 'Key Topic 3.1: Koch\'s Microbe Hunters',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'German doctor who developed groundbreaking laboratory techniques: Solid agar jelly medium and industrial methyl violet dyes.',
      'High-magnification photography: Took photomicrographs of bacteria so scientists worldwide could identify specific species.',
      'Breakthrough discoveries: Identified anthrax bacillus (1876), Mycobacterium tuberculosis (1882), and Vibrio cholerae (1883).',
      'Koch\'s Postulates: Rigorous 4-step scientific protocol required to prove a specific microbe causes a specific disease.',
      'National rivalry: Franco-Prussian War intensified competition between Koch and Pasteur, accelerating government medical funding.'
    ]
  },
  {
    src: 'The Germ Theory Revolution.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_3_1',
    slug: 'med_kt3_1_germ_theory_revolution_infographic',
    title: 'From Miasma to Microbes: The 19th Century Germ Revolution',
    topic: 'Key Topic 3.1: Ideas on Causes',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Overturned 2,000 years of miasma theory: Proved that disease is not caused by bad air or poisonous smells.',
      'Transformed hospital hygiene: Provided scientific justification for antiseptic surgery, clean water supply, and sterilization.',
      'Inspired Joseph Lister: Realized carbolic acid destroyed aerial bacteria in surgical compound fractures.',
      'Government public health justification: Forced British Parliament to abandon laissez-faire policy and mandate clean sewers.',
      'Modern vaccine manufacturing: Opened the door to laboratory-developed vaccines for diphtheria, tetanus, and typhoid.'
    ]
  },
  {
    src: 'Edward Jenner.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_3_2',
    slug: 'med_kt3_2_edward_jenner',
    title: 'Edward Jenner & The Smallpox Vaccine Breakthrough (1796)',
    topic: 'Key Topic 3.2: Approaches to Prevention: Edward Jenner',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'Gloucestershire country doctor observed that dairy milkmaids never contracted deadly smallpox after having mild cowpox.',
      'May 1796 experiment: Inoculated 8-year-old James Phipps with pus from milkmaid Sarah Nelmes\'s cowpox lesion.',
      'Proof of immunity: Later inoculated Phipps with real smallpox multiple times; the boy showed zero symptoms of illness.',
      'Published findings (1798): Named procedure "vaccination" (from Latin vacca for cow); faced fierce initial opposition from inoculators.',
      'Government backing: Parliament awarded Jenner £30,000; smallpox vaccination made compulsory in Britain in 1853.'
    ]
  },
  {
    src: 'KT3.3 18th & 19th Century c1700–c1900 Jenner & Cholera\\Medical Revolutions 1700 to 1900.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_3_5',
    slug: 'med_kt3_2_medical_revolutions_1700_1900',
    title: 'Medical Revolutions: Jenner, Snow & The 1854 Broad Street Pump (1700–1900)',
    topic: 'Key Topic 3.5: Public Health, Snow & Cholera',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Inoculation danger: Lady Mary Wortley Montagu brought variolation from Turkey in 1721, but it killed 2–3% of patients.',
      'Jenner\'s cowpox vaccine eliminated the risk of triggering active smallpox epidemics.',
      'John Snow and the Blue Death (1854): Mapped cholera deaths to the Broad Street pump, proving water transmission before Germ Theory.',
      'The Great Stink (1858) and 1875 Public Health Act: Ended laissez-faire; forced councils to fund Bazalgette sewers and clean water.',
      'World Health Organization (WHO) declared smallpox totally eradicated worldwide in 1980 thanks to Jenner\'s technique.'
    ]
  },
  {
    src: 'Nightingale Transforming Modern Healthcare.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_3_4',
    slug: 'med_kt3_3_florence_nightingale',
    title: 'The Knife\'s Edge: How Surgery Evolved from Horror to High-Tech (1840–Present)',
    topic: 'Key Topic 3.4: The Surgical Revolution: Pain, Sepsis & High-Tech Precision',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'Triple surgical threats: For centuries, surgery was blocked by extreme pain, fatal wound infection, and uncontrollable blood loss.',
      '1840–1900 Breakthroughs: James Simpson discovered Chloroform (1847); Joseph Lister introduced carbolic acid spray (1865), reducing surgical death rates from 46% to 15%.',
      'Shift to Aseptic Surgery: By the 1890s, operating theatres moved from killing germs to keeping germs out using steam-sterilized instruments and gowns/gloves.',
      'War and Technology: WWI accelerated the Thomas Splint (cutting femur mortality 80% to 20%), mobile X-ray vans, and sodium citrate blood depots.',
      'Modern Robotic Precision: 20th and 21st-century micro-surgery and robotic laparoscopy allow complex internal operations through tiny incisions.'
    ]
  },
  {
    src: 'Surgery.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_3_4',
    slug: 'med_kt3_4_surgery_revolution_overview',
    title: 'The Surgical Revolution: Conquering Pain, Sepsis & Shock (1840–1890)',
    topic: 'Key Topic 3.4: The Surgical Revolution',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'The three surgical barriers: Extreme pain, massive blood loss (shock), and post-operative fatal infection (sepsis).',
      'Humphrey Davy (nitrous oxide) and Robert Liston (ether, 1846) attempted early anaesthetics with dangerous side effects.',
      'James Simpson (1847): Discovered chloroform properties during dinner party experiments; used by Queen Victoria in childbirth (1853).',
      'The "Black Period" of surgery (1870s): Anaesthetics led surgeons to operate deeper inside the body, increasing infection deaths.',
      'Joseph Lister (1867): Used carbolic acid spray and dressings, slashing surgical amputation mortality from 46% to 15%.'
    ]
  },
  {
    src: 'Conquering the Operating Theatre.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_3_4',
    slug: 'med_kt3_4_conquering_operating_theatre',
    title: 'Conquering the Operating Theatre: From Antiseptic to Aseptic Surgery',
    topic: 'Key Topic 3.4: Simpson, Lister and Sepsis',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'Carbolic acid spray: Joseph Lister soaked surgical catgut, dressings, and sprayed air over wounds to kill airborne microbes.',
      'Unpopular carbolic drawbacks: Irritated surgeons\' lungs, dried skin, and cracked nurses\' hands; slowed operations down.',
      'Transition to aseptic surgery (1890s): Moving from killing germs in the wound (antiseptic) to keeping germs out entirely (aseptic).',
      'Autoclave steam sterilizers: Ernst von Bergmann introduced pressurized steam to sterilize surgical instruments in 1886.',
      'Sterile apparel: William Halsted introduced sterilized rubber surgical gloves (1890); face masks and sterilized gowns followed.'
    ]
  },
  {
    src: 'KT3.2 18th & 19th Century c1700–c1900 Prevention & Treatment\\Medical Revolution Breakthroughs 1700-1900.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_3_3',
    slug: 'med_kt3_4_breakthroughs_1700_1900',
    title: '19th-Century Medical & Hospital Revolutions: Nightingale, Jenner & Lister (1700–1900)',
    topic: 'Key Topic 3.3: Improvements in Hospital Care & Nursing',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Foundations of Prevention: Edward Jenner developed the smallpox vaccine in 1796 using cowpox, establishing global scientific immunization.',
      'Florence Nightingale at Scutari (1854): Transformed military hospital hygiene and ventilation, slashing death rates from 42% to just 2%.',
      'Professionalization of Nursing (1860): Nightingale established the first professional training school for nurses at St Thomas\' Hospital.',
      'Scientific Breakthroughs: Louis Pasteur proved Germ Theory (1861); Joseph Lister created antiseptic carbolic spray (1865–1867).',
      'Compulsory Public Health: The 1875 Second Public Health Act forced local councils to provide clean water, sewers, and sanitary inspectors.'
    ]
  },
  {
    src: 'UK Public Health Evolution Timeline.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_3_5',
    slug: 'med_kt3_5_public_health_timeline',
    title: 'The Public Health Evolution: Edwin Chadwick to the 1875 Act (1842–1875)',
    topic: 'Key Topic 3.5: Public Health and Cholera',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Edwin Chadwick\'s 1842 Report: Proved filthy living conditions caused rampant disease and premature death among workers.',
      '1848 Public Health Act: Set up Central Board of Health; non-compulsory (permissive), so most town councils did nothing.',
      'Dr John Snow & Cholera (1854): Removed handle from Broad Street pump, proving cholera was waterborne before Germ Theory.',
      'The Great Stink (1858): Hot summer caused River Thames sewage smell to overwhelm Parliament, forcing MPs to fund sewers.',
      'Joseph Bazalgette\'s London sewer network (1865): 1,100 miles of brick sewers carried sewage east of London.',
      '1875 Public Health Act: Ended laissez-faire; mandated town councils provide clean water, sewers, street paving, and health inspectors.'
    ]
  },
  {
    src: '1900-present.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_4_1',
    slug: 'med_modern_era_overview',
    title: 'Modern Medicine: The High-Tech, Genetic & Pharmaceutical Era (c1900–Present)',
    topic: 'Key Topic 4: Medicine in Modern Britain, c1900–present',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Genetic breakthrough: Watson, Crick, Franklin & Wilkins discover the double helix structure of DNA in 1953.',
      'The Human Genome Project (1990–2003): Mapped all 3 billion chemical base pairs in human DNA to diagnose genetic diseases.',
      'High-tech diagnosis: X-rays, blood tests, CT scans, MRI scanners, endoscopes, and ultrasound revolutionized clinical accuracy.',
      'Magic bullets and antibiotics: Paul Ehrlich (Salvarsan 606, 1909), Alexander Fleming (Penicillin, 1928), Domagk (Prontosil, 1932).',
      'Welfare state and NHS: Aneurin Bevan launches National Health Service on July 5, 1948—free care at the point of delivery.'
    ]
  },
  {
    src: 'KT4.1 Modern c1900–present Causes of Illness\\Evolution of Modern Medical Science.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_4_2',
    slug: 'med_kt4_1_evolution_modern_medical_science',
    title: 'Evolution of Modern Medical Science: Lifestyle Factors & Diagnosis (c1900–Present)',
    topic: 'Key Topic 4.2: Lifestyle Factors & Technological Revolution in Diagnosis',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Discovery of hereditary mechanisms: Shifted focus from fighting external bacteria to understanding inherited chromosomal traits.',
      'Lifestyle disease links: Sir Richard Doll and Austin Bradford Hill proved smoking directly causes lung cancer in 1950.',
      'Blood pressure and blood sugar monitors: Enabled early diagnosis of chronic conditions before fatal strokes or organ failure.',
      'Shift toward preventive healthcare: Screening programs, breast cancer mammograms, and genetic testing for BRCA mutations.',
      'Government public health legislation: Banning tobacco advertising (1965), seatbelt laws (1983), and indoor smoking bans (2007).'
    ]
  },
  {
    src: 'The Genomic Revolution Timeline.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_4_1',
    slug: 'med_kt4_1_genomic_revolution_timeline',
    title: 'The Genomic Revolution: DNA, Genetic Engineering & Gene Therapy (1953–2003)',
    topic: 'Key Topic 4.1: Genetics, DNA and Human Genome',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'April 1953: James Watson and Francis Crick published double-helix model, building on Rosalind Franklin\'s Photo 51 X-ray crystallography.',
      'Understanding hereditary code: Revealed how genetic instructions determine human growth, cellular function, and hereditary faults.',
      'The Human Genome Project (launched 1990): Global scientific collaboration led by scientists across 6 nations to map all human DNA.',
      'Completion in 2003: Unlocked customized medical treatments, targeted chemotherapy drugs, and pre-natal genetic disorder screening.',
      'Modern ethical dilemmas: Controversies over stem-cell cloning, gene editing (CRISPR), and genetic discrimination by insurers.'
    ]
  },
  {
    src: 'KT4.2 Modern c1900–present Prevention & Treatment\\History of Modern Medicine Timeline.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_4_3',
    slug: 'med_kt4_2_history_modern_medicine_timeline',
    title: 'From Magic Bullets to the NHS: Modern Medical Breakthroughs (1900–1948)',
    topic: 'Key Topic 4.3: Magic Bullets and the Birth of the NHS',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Paul Ehrlich & Chemical Therapy: Searched for antibodies called "magic bullets" that destroyed specific microbes without harming the body.',
      '1909: Discovery of Salvarsan 606 to cure syphilis; Gerhard Domagk discovered Prontosil (first sulphonamide) for blood poisoning (1932).',
      'Alexander Fleming discovered Penicillin mould (1928); Howard Florey and Ernst Chain mass-produced it during WWII (1941–1944).',
      'William Beveridge Report (1942): Proposed government war on the "Five Giant Evils" (Want, Disease, Ignorance, Squalor, Idleness).',
      'Launch of the NHS (July 5, 1948): Replaced uneven voluntary/private medical care with universal free healthcare for all citizens.'
    ]
  },
  {
    src: 'KT4.3 Modern c1900–present Penicillin\\History of Penicillin Revision Guide.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_4_4',
    slug: 'med_kt4_4_history_penicillin_guide',
    title: 'Penicillin: The World\'s First True Miracle Antibiotic (1928–1945)',
    topic: 'Key Topic 4.4: The Antibiotic Revolution: Fleming, Florey & Chain',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'September 1928: Alexander Fleming noticed Penicillium notatum mould dissolved Staphylococcus bacteria on an untidy petri dish.',
      'Fleming published findings (1929) but could not purify the unstable mould and lacked chemical engineering expertise.',
      'Oxford team breakthrough (1938–1940): Howard Florey and Ernst Chain purified penicillin liquid and tested it on mice.',
      '1941 Albert Alexander trial: Policeman with severe septic scratch dramatically improved, but died when drug supply ran out.',
      'US industrial mass production: Pearl Harbor spurred US War Production Board to mass produce penicillin in deep-fermentation corn steep vats.',
      'D-Day (June 1944): 2.3 million doses available; saved an estimated 15% of wounded Allied soldiers from fatal infection.'
    ]
  },
  {
    src: 'History of the Penicillin Breakthrough.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_4_4',
    slug: 'med_kt4_4_penicillin_breakthrough_deepdive',
    title: 'The Penicillin Trio: Fleming, Florey, Chain & Industrial Mass Production',
    topic: 'Key Topic 4.4: Antibiotics and War',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'Factor collaboration: Chance (Fleming\'s open window), Individual genius (Florey & Chain), Government & War (US funding).',
      'In 1945, Fleming, Florey, and Chain were jointly awarded the Nobel Prize in Physiology or Medicine.',
      'Transformed global health: Penicillin cured syphilis, gonorrhea, pneumonia, gangrene, and common bacterial infections.',
      'Inspired antibiotic explosion: Spurred discovery of streptomycin (1943) for tuberculosis and tetracyclines.',
      'Modern crisis: Over-prescription and animal feed misuse created "superbugs" like MRSA resistant to common antibiotics.'
    ]
  },
  {
    src: 'KT4.4 Modern c1900–present Lung Cancer\\Lung Cancer Medical Case Study.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_4_5',
    slug: 'med_kt4_5_lung_cancer_case_study',
    title: 'Case Study: The Battle Against Lung Cancer (1950–Present)',
    topic: 'Key Topic 4.5: Public Health and Lung Cancer',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Epidemiological evidence: In 1950, Richard Doll and Austin Bradford Hill demonstrated that 90% of lung cancer cases link to smoking.',
      'Lethal statistics: Lung cancer is the leading cause of cancer death in Britain, killing over 35,000 people annually.',
      'Advanced diagnosis: CT scans, bronchoscopies with miniature biopsy cameras, and PET scans pinpoint tumor stages.',
      'Modern treatment: Targeted radiotherapy, chemotherapy cocktails, lobectomy robotic surgery, and genetic immunotherapy.',
      'Prevention focus: Government intervention proved far more effective than treatment in reducing disease rates.'
    ]
  },
  {
    src: 'Modern Lung Cancer Case Study.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_4_5',
    slug: 'med_kt4_5_modern_lung_cancer_campaigns',
    title: 'Government Intervention & Anti-Smoking Campaigns (1962–2020)',
    topic: 'Key Topic 4.5: Public Health Legislation and Cancer',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      '1962 Royal College of Physicians report: Formally warned that cigarette smoking was causing a national health catastrophe.',
      '1965: British government banned cigarette advertising on television.',
      '2007: Legal smoking age raised from 16 to 18; public smoking ban introduced across all enclosed workplaces and pubs.',
      '2016: Plain standardized cigarette packaging mandated by law with graphic pictorial health warnings.',
      'Heavy taxation: Cigarette duties steadily increased to discourage youth uptake and fund NHS healthcare.'
    ]
  },
  {
    src: 'WWI Medical Evacuation Chain Map.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_5_4',
    slug: 'med_kt5_4_evacuation_chain_map',
    title: 'The Western Front Chain of Evacuation (1914–1918)',
    topic: 'Key Topic 5.4: The Chain of Evacuation',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'Regimental Aid Post (RAP): 200m behind front lines; Regimental Medical Officer (RMO) administered basic first aid and bandages.',
      'Dressing Stations (Advanced & Main): 1,000m back; run by Field Ambulances (RAMC); sorted casualties into walking, wounded, and dying (Triage).',
      'Casualty Clearing Station (CCS): 10 miles back; near railway lines; performed emergency surgery, amputations, and blood transfusions.',
      'Base Hospitals: At French coast ports (Calais, Boulogne); large general hospitals with operating theatres and recovery beds.',
      'Medical transport: Motor ambulances, horse-drawn carts, hospital canal barges, and dedicated hospital trains with surgical wards.'
    ]
  },
  {
    src: 'KT5.5 Western Front 1914–1918 Medical Advances\\World War I Medical Innovations.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_5_5',
    slug: 'med_kt5_5_wwi_medical_innovations',
    title: 'WWI Battlefield Trauma: Gas Gangrene, Splints & Transfusions',
    topic: 'Key Topic 5.5 & 5.6: Surgical Breakthroughs and Innovations',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Soil contamination: Heavily manured Belgian and French farmland harboured lethal anaerobic bacteria causing gas gangrene.',
      'Wound debridement: Surgical cutting away of all dead, infected tissue to starve bacteria of oxygen before suturing.',
      'Carrel-Dakin method: Continuous irrigation of deep wounds with sterile sodium hypochlorite antiseptic solution.',
      'The Thomas Splint (1916): Reduced compound femur fracture mortality from 80% to just 20% by immobilizing the broken bone.',
      'Mobile X-ray vans: Marie Curie and British army deployed mobile X-ray units to locate shrapnel and bullets before surgery.'
    ]
  },
  {
    src: 'Fighting WWI Wound Infections.png',
    unit: 'edexcel_medicine',
    lessonId: 'lesson_5_3',
    slug: 'med_kt5_5_fighting_wwi_wound_infections',
    title: 'The Invisible Foe: Fighting Wound Infection on the Western Front (1914–1918)',
    topic: 'Key Topic 5.3: Battlefield Trauma: Shrapnel, Soil Bacteria & Gas Gangrene',
    type: 'thematic_deep_dive',
    aspect: 'portrait',
    keyPoints: [
      'High-explosive shrapnel shells caused 58% of all battlefield wounds, driving muddy uniform fabric deep into shattered bones.',
      'Trench foot and trench fever: Caused by standing in cold water and body lice; treated with whale oil, dry socks, and delousing stations.',
      'Soil contamination: Heavily manured farmland harboured lethal anaerobic tetanus and gas gangrene spores.',
      'Wound excision (debridement): Cutting away dead/damaged tissue and flushing with Carrel-Dakin antiseptic solution.',
      'Amputation as last resort: Over 240,000 British limbs amputated by 1918 to stop fatal gangrene spreading.'
    ]
  }
];

async function optimizeImage(fullSrc, destSlug, unitFolder) {
  if (!fs.existsSync(fullSrc)) {
    console.error(`[NOT FOUND] ${fullSrc}`);
    return null;
  }

  const outDir = path.join(PROJECT_ROOT, 'public', 'images', 'infographics', unitFolder);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, `${destSlug}.webp`);
  const origStat = fs.statSync(fullSrc);
  const origKb = Math.round(origStat.size / 1024);

  await sharp(fullSrc)
    .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 86, effort: 4 })
    .toFile(outPath);

  const newStat = fs.statSync(outPath);
  const newKb = Math.round(newStat.size / 1024);
  const reduction = Math.round((1 - newStat.size / origStat.size) * 100);

  console.log(`[OPTIMIZED] ${destSlug}.webp: ${origKb}KB -> ${newKb}KB (-${reduction}%)`);
  return {
    webPath: `/images/infographics/${unitFolder}/${destSlug}.webp`,
    fileSizeKb: newKb,
    originalSizeKb: origKb,
    reductionPercent: reduction
  };
}

async function run() {
  console.log('=== Optimizing Medicine Through Time & USA 1954–1975 Infographics ===\n');
  
  const manifestPath = path.join(PROJECT_ROOT, 'public', 'data', 'infographics_manifest.json');
  let manifest = {
    cme_new: [],
    eee: [],
    edexcel_medicine: [],
    usa: [],
    generated_at: new Date().toISOString()
  };

  if (fs.existsSync(manifestPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      manifest.cme_new = existing.cme_new || [];
      manifest.eee = existing.eee || [];
    } catch (e) {
      console.warn('Could not read existing manifest, recreating:', e.message);
    }
  }

  // Optimize Medicine (39 files)
  console.log(`\n--- Processing Medicine Through Time (${MEDICINE_MAPPINGS.length} files) ---`);
  for (const item of MEDICINE_MAPPINGS) {
    const fullPath = path.join(MED_SRC_DIR, item.src);
    const res = await optimizeImage(fullPath, item.slug, 'medicine');
    if (res) {
      manifest.edexcel_medicine.push({
        unit: item.unit,
        lessonId: item.lessonId,
        slug: item.slug,
        title: item.title,
        topic: item.topic,
        type: item.type,
        aspect: item.aspect,
        keyPoints: item.keyPoints,
        image: res.webPath,
        fileSizeKb: res.fileSizeKb
      });
    }
  }

  // Optimize USA (29 files)
  console.log(`\n--- Processing USA 1954–1975 (${USA_MAPPINGS.length} files) ---`);
  for (const item of USA_MAPPINGS) {
    const fullPath = path.join(USA_SRC_DIR, item.src);
    const res = await optimizeImage(fullPath, item.slug, 'usa');
    if (res) {
      manifest.usa.push({
        unit: item.unit,
        lessonId: item.lessonId,
        slug: item.slug,
        title: item.title,
        topic: item.topic,
        type: item.type,
        aspect: item.aspect,
        keyPoints: item.keyPoints,
        image: res.webPath,
        fileSizeKb: res.fileSizeKb
      });
    }
  }

  manifest.generated_at = new Date().toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log('\n================ SUMMARY ================');
  console.log(`CME Items:      ${manifest.cme_new.length}`);
  console.log(`EEE Items:      ${manifest.eee.length}`);
  console.log(`Medicine Items: ${manifest.edexcel_medicine.length} (Target: 39)`);
  console.log(`USA Items:      ${manifest.usa.length} (Target: 29)`);
  console.log(`Total Infographics: ${manifest.cme_new.length + manifest.eee.length + manifest.edexcel_medicine.length + manifest.usa.length}`);
  console.log(`Manifest written to: ${manifestPath}`);
  console.log('=========================================\n');
}

run().catch(err => {
  console.error('Fatal error optimizing infographics:', err);
  process.exit(1);
});

