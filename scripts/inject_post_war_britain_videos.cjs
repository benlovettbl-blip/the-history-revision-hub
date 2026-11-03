const fs = require('fs');
const path = require('path');

const pwbVideos = [
  // Lesson 1: Votes for Women
  [
    {
      type: "youtube",
      id: "pw0IAFIhVfA",
      url: "https://www.youtube.com/watch?v=pw0IAFIhVfA",
      title: "Suffragettes vs Suffragists: Did violent protest get women the vote? | Channel 4 News",
      duration: "6 mins 33 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Deep historical evaluation comparing Millicent Fawcett's constitutional NUWSS (lobbying, peaceful marches) with Emmeline Pankhurst's militant WSPU ('Deeds, not words', arson, window smashing, hunger strikes). Explores which faction was truly decisive in achieving the 1918 Representation of the People Act. Recommended Watch Window: 00:00–03:45 • Lesson Phase: Quick Starter Check (0–3m). Tone Alert: Fast, balanced historiographical debate.",
      viewing_task: "<ol><li><strong>[01:10] Quick Check:</strong> What were the contrasting slogans and methods used by Millicent Fawcett's Suffragists (NUWSS) versus Emmeline Pankhurst's Suffragettes (WSPU)?</li><li><strong>[03:20] Hinge Question:</strong> Did militant direct action accelerate parliamentary support for female suffrage or provide an excuse for Herbert Asquith's government to delay reform?</li></ol>",
      model_answer: "<ol><li><strong>Quick Check:</strong> The Suffragists used law-abiding methods (petitions, peaceful rallies, reasoned debate), while the Suffragettes used militant direct action under the slogan 'Deeds, not words' (chaining themselves to railings, arson, heckling politicians, tax evasion).</li><li><strong>Hinge Question:</strong> Historians debate this deeply: militancy kept female suffrage on front-page headlines and forced politicians to confront the issue, but it also alienated moderate MPs who argued that granting votes in response to violence would establish a dangerous constitutional precedent.</li></ol>"
    },
    {
      type: "youtube",
      id: "uiMIBzQWkIU",
      url: "https://www.youtube.com/watch?v=uiMIBzQWkIU",
      title: "History | KS3: Suffrage, Fawcett & Pankhurst | BBC Teach",
      duration: "3 mins 04 secs",
      pathway: "Core Enquiry",
      teacher_guidance: "Concise secondary curriculum overview examining constitutional lobbying versus militant civil disobedience. Recommended Watch Window: 00:00–03:00 • Lesson Phase: Core Enquiry & Ideological Comparison. Tone Alert: Accessible, curriculum-focused comparison of NUWSS and WSPU tactics.",
      viewing_task: "<ol><li><strong>[00:45] Recall:</strong> In what year did Millicent Fawcett unite local suffrage groups into the National Union of Women's Suffrage Societies (NUWSS)?</li><li><strong>[01:50] Explain:</strong> Why did Emmeline Pankhurst and her daughters break away from the Suffragists to found the WSPU in Manchester in 1903?</li><li><strong>[02:40] Challenge:</strong> How did the outbreak of World War One in August 1914 dramatically reshape public attitudes toward women's capacity for national citizenship?</li></ol>",
      model_answer: "<ol><li><strong>Recall:</strong> 1897.</li><li><strong>Explain:</strong> After decades of peaceful lobbying had produced zero legislative breakthroughs, Pankhurst concluded that polite constitutional methods were ignored by male politicians; direct, disruptive action was essential to force Parliament to capitulate.</li><li><strong>Challenge:</strong> Both suffrage factions suspended campaigning to support the war effort; over a million women took on vital industrial, agricultural, and transport work (munitions factories, railway porters, land army), proving their indispensable civic value to the nation.</li></ol>"
    },
    {
      type: "youtube",
      id: "056FI2Pq9RY",
      url: "https://www.youtube.com/watch?v=056FI2Pq9RY",
      title: "Suffragette (2015) Official Movie Trailer (Carey Mulligan, Meryl Streep)",
      duration: "2 mins 31 secs",
      pathway: "Cinematic",
      teacher_guidance: "Depicts working-class laundry worker Maud Watts drawn into militant WSPU activism in London. Recommended Watch Window: 00:00–02:30 • Lesson Phase: Visual & Cultural Representation. Tone Alert: Emotional period drama capturing police brutality, prison force-feeding, and social stigma.",
      viewing_task: "<ol><li><strong>[00:50] Context:</strong> How does the trailer depict the brutal working conditions of ordinary working-class women in Edwardian laundries?</li><li><strong>[01:40] Analysis:</strong> How does the film illustrate the severe personal sacrifices made by Suffragettes (imprisonment, losing custody of children, force-feeding under the 'Cat and Mouse Act')?</li></ol>",
      model_answer: "<ol><li><strong>Context:</strong> Working-class women laboured 14-hour days in toxic steam and scalding water for a fraction of male wages, with zero legal protection or political representation to reform labour laws.</li><li><strong>Analysis:</strong> Suffragettes faced total ostracism from their communities: husbands threw them out of homes, the state stripped them of child custody, and in prison they endured agonizing nasal force-feeding when hunger striking against political prisoner abuse.</li></ol>"
    },
    {
      type: "youtube",
      id: "wVrlLKAR1S0",
      url: "https://www.youtube.com/watch?v=wVrlLKAR1S0",
      title: "Emily Davison: Suffragette Killed by King's Horse at Derby (1913) | British Pathé",
      duration: "6 mins 55 secs",
      pathway: "Primary Archive",
      teacher_guidance: "Rare original 1913 newsreel footage of the Epsom Derby, showing Emily Wilding Davison stepping out in front of King George V's horse, Anmer. Recommended Watch Window: 01:00–05:00 • Lesson Phase: Primary Evidence & Historiographical Investigation. Tone Alert: Sombre primary archive recording a fatal turning point.",
      viewing_task: "<ol><li><strong>[01:45] Primary Evidence:</strong> What does the literal camera footage show Emily Davison doing at Tattenham Corner during the 1913 Epsom Derby?</li><li><strong>[03:30] Historical Debate:</strong> What evidence found in Davison's possession (a return train ticket, a helper's badge for a victory rally) challenges the historical accusation that she intended to commit suicide?</li></ol>",
      model_answer: "<ol><li><strong>Primary Evidence:</strong> Davison ducks under the track railings onto the racecourse and reaches up toward the bridle of King George V's charging horse, which collides with her at full gallop, flipping jockey and horse onto her.</li><li><strong>Historical Debate:</strong> The return railway ticket, racecard with winning bets, and purse receipts strongly suggest she intended to survive, planning to attach the purple, white, and green WSPU suffragette flag to the King's horse to secure global news coverage.</li></ol>"
    }
  ],
  // Lesson 2: 1945 Welfare State & NHS
  [
    {
      type: "youtube",
      id: "YokrY_G8L-c",
      url: "https://www.youtube.com/watch?v=YokrY_G8L-c",
      title: "Why was Churchill voted out of office after WW2? | History Matters",
      duration: "3 mins 17 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Explores the shock 1945 Labour landslide: why the British electorate celebrated Churchill as a war hero but overwhelmingly rejected his Conservative party for peacetime reconstruction. Recommended Watch Window: 00:00–03:17 • Lesson Phase: Quick Starter Check (0–3m). Tone Alert: Fast, accessible animated explanation of post-war political priorities.",
      viewing_task: "<ol><li><strong>[01:05] Quick Check:</strong> Why did millions of British soldiers and working-class voters fear a return to 1930s Conservative governance after the Second World War?</li><li><strong>[02:30] Hinge Question:</strong> Why was Clement Attlee's promise of a cradle-to-grave Welfare State more compelling than Winston Churchill's imperial prestige in the summer of 1945?</li></ol>",
      model_answer: "<ol><li><strong>Quick Check:</strong> Voters vividly remembered 1930s mass unemployment, slum housing, means tests, and lack of healthcare; having sacrificed everything to defeat fascism, they refused to return to pre-war austerity and inequality.</li><li><strong>Hinge Question:</strong> Churchill focused on foreign diplomacy and imperial prestige while warning that social reform required a 'Gestapo'-like bureaucracy. In contrast, Labour offered a concrete blueprint to reconstruct British society: free healthcare, decent council housing, social security, and full employment.</li></ol>"
    },
    {
      type: "youtube",
      id: "GYyYnohQvMM",
      url: "https://www.youtube.com/watch?v=GYyYnohQvMM",
      title: "Beveridge and the Five Giants Revision Guide | The Foundation of Welfare",
      duration: "8 mins 18 secs",
      pathway: "Core Enquiry",
      teacher_guidance: "Detailed breakdown of Sir William Beveridge's 1942 blueprint and his allegorical 'Five Giants' on the road to post-war recovery. Recommended Watch Window: 00:45–06:30 • Lesson Phase: Core Enquiry & Structural Analysis. Tone Alert: Comprehensive educational review of social security pillars.",
      viewing_task: "<ol><li><strong>[01:30] Recall:</strong> What were the 'Five Giants' identified by Sir William Beveridge in his bestselling December 1942 social report?</li><li><strong>[03:45] Explain:</strong> How did Beveridge propose funding universal social insurance through mandatory weekly National Insurance contributions?</li><li><strong>[05:50] Challenge:</strong> Why was the Beveridge Report hailed as a social revolution, and how did it establish the principle of 'cradle to grave' collective security?</li></ol>",
      model_answer: "<ol><li><strong>Recall:</strong> Want (poverty), Disease (ill health), Ignorance (poor education), Squalor (bad housing), and Idleness (unemployment).</li><li><strong>Explain:</strong> A single flat-rate weekly contribution deducted from wages, paid by employees, employers, and the state into a national fund that guaranteed benefits during sickness, injury, unemployment, or old age.</li><li><strong>Challenge:</strong> It replaced the degrading Victorian workhouse and means-tested charity with universal legal entitlement: every citizen was entitled to healthcare and security as a basic right of British citizenship.</li></ol>"
    },
    {
      type: "youtube",
      id: "l2DhvTCuK_s",
      url: "https://www.youtube.com/watch?v=l2DhvTCuK_s",
      title: "Sir William Beveridge Talks To Pathé Gazette on Social Security (1942) | British Pathé",
      duration: "2 mins 36 secs",
      pathway: "Primary Archive",
      teacher_guidance: "Historic newsreel of Sir William Beveridge personally explaining his landmark plan to the British cinema public during the dark days of 1942. Recommended Watch Window: 00:00–02:30 • Lesson Phase: Primary Source & Archival Resonance. Tone Alert: Rare primary spoken testimony from the architect of the welfare state.",
      viewing_task: "<ol><li><strong>[00:40] Primary Evidence:</strong> How does Sir William Beveridge describe the purpose of his plan in his own words to the cinema audience?</li><li><strong>[01:50] Analysis:</strong> Why was it vital for British civilian morale in 1942 that the government plan a fairer, healthier society before the war was even won?</li></ol>",
      model_answer: "<ol><li><strong>Primary Evidence:</strong> He explains the plan is designed to abolish want by ensuring that every family has adequate income during times of adversity, retirement, or illness.</li><li><strong>Analysis:</strong> Civilians enduring rationing, blitz bombing, and total war mobilization needed reassurance that their wartime sacrifices would result in a fundamentally better, more just peace.</li></ol>"
    },
    {
      type: "youtube",
      id: "r30XDrcIqOY",
      url: "https://www.youtube.com/watch?v=r30XDrcIqOY",
      title: "Britain in 1945 and the Creation of the Welfare State | Historical Overview",
      duration: "11 mins 59 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Examines Clement Attlee's Labour administration (1945–1951) and Minister of Health Aneurin Bevan's fierce battle with the British Medical Association to establish the NHS on 5 July 1948. Recommended Watch Window: 02:00–09:30 • Lesson Phase: High-Attainer Extension & Political Struggle. Tone Alert: Analytical documentary examining Bevan's political triumph.",
      viewing_task: "<ol><li><strong>[03:15] Recall:</strong> On what date was the National Health Service officially launched in Britain?</li><li><strong>[05:40] Explain:</strong> Why did the British Medical Association (BMA) and private doctors fiercely oppose the creation of a state-run health service?</li><li><strong>[08:10] Challenge:</strong> How did Aneurin Bevan famously overcome doctor opposition ('stuffing their mouths with gold'), and what did this compromise cost the Treasury?</li></ol>",
      model_answer: "<ol><li><strong>Recall:</strong> 5 July 1948 (Park Hospital, Davyhulme, Manchester).</li><li><strong>Explain:</strong> Doctors feared becoming salaried civil servants under state control, losing clinical independence, and forfeiting lucrative private consulting fees.</li><li><strong>Challenge:</strong> Bevan allowed hospital consultants to continue treating private fee-paying patients alongside NHS beds and granted generous salary caps; while it won doctors' consent, it built private profit directly into state hospitals.</li></ol>"
    }
  ],
  // Lesson 3: The Windrush Generation
  [
    {
      type: "youtube",
      id: "MbNH4JBQiSY",
      url: "https://www.youtube.com/watch?v=MbNH4JBQiSY",
      title: "HMT Empire Windrush: The Arrival at Tilbury (1948) | BBC Archive",
      duration: "4 mins 20 secs",
      pathway: "Starter Hook",
      teacher_guidance: "BBC archival coverage of the arrival of 492 Jamaican and Caribbean passengers at Tilbury Docks, Essex, on 22 June 1948. Features iconic interviews with Lord Kitchener singing 'London is the place for me'. Recommended Watch Window: 00:00–03:45 • Lesson Phase: Historical Catalyst & Cultural Introduction. Tone Alert: Historic news footage capturing Caribbean optimism confronting post-war British austerity.",
      viewing_task: "<ol><li><strong>[01:00] Recall:</strong> What British passenger ship docked at Tilbury on 22 June 1948, bringing Caribbean immigrants to help rebuild post-war Britain?</li><li><strong>[02:15] Explain:</strong> Why did calypsonian Lord Kitchener compose and sing 'London is the place for me' upon stepping onto British soil?</li><li><strong>[03:30] Challenge:</strong> How did the 1948 British Nationality Act confer full British citizenship on subjects of the Commonwealth, and why did this legal reality clash with racial prejudice on the ground?</li></ol>",
      model_answer: "<ol><li><strong>Recall:</strong> The HMT Empire Windrush.</li><li><strong>Explain:</strong> Kitchener expressed the genuine optimism and affection Caribbean migrants felt for the 'Mother Country', having been educated under the British school curriculum and taught that Britain was their homeland.</li><li><strong>Challenge:</strong> Legally, Commonwealth citizens were full British subjects with equal rights to live and work in the UK; socially, however, arrivals faced pervasive discrimination in private housing ('No blacks, no Irish, no dogs') and employment exclusions.</li></ol>"
    },
    {
      type: "youtube",
      id: "Si3IRAPJkkU",
      url: "https://www.youtube.com/watch?v=Si3IRAPJkkU",
      title: "What is the Windrush Generation? | Finding My Family Windrush Special",
      duration: "2 mins 09 secs",
      pathway: "Core Enquiry",
      teacher_guidance: "Clear, youth-accessible explainer illustrating why Britain urgently recruited Caribbean labour for the newly formed NHS, London Transport, and British Rail. Recommended Watch Window: 00:00–02:00 • Lesson Phase: Core Enquiry & Economic Context. Tone Alert: Accessible educational summary of the push and pull factors.",
      viewing_task: "<ol><li><strong>[00:40] Recall:</strong> Why was there a severe labour shortage in Britain following the Second World War?</li><li><strong>[01:25] Explain:</strong> What vital public services in post-war Britain depended directly on Caribbean nurses, drivers, and conductors?</li></ol>",
      model_answer: "<ol><li><strong>Recall:</strong> Britain had lost hundreds of thousands of working-age men during the war and had to rebuild bombed cities, transport networks, and public services simultaneously.</li><li><strong>Explain:</strong> The National Health Service (NHS), London Underground, British Rail, and municipal bus companies recruited heavily across Jamaica, Barbados, and Trinidad to fill critical frontline vacancies.</li></ol>"
    },
    {
      type: "youtube",
      id: "NME-9ot2Lqw",
      url: "https://www.youtube.com/watch?v=NME-9ot2Lqw",
      title: "Windrush Generation: Three Eyewitness Stories of Prejudice & Resilience | BBC News",
      duration: "6 mins 52 secs",
      pathway: "Primary Archive",
      teacher_guidance: "Deeply moving first-hand oral testimonies from three Windrush pioneers describing cold weather, housing discrimination, street hostility, and community solidarity. Recommended Watch Window: 01:00–05:30 • Lesson Phase: Primary Oral History & Lived Experience. Tone Alert: Moving personal accounts of dignity and perseverance.",
      viewing_task: "<ol><li><strong>[01:30] Primary Testimony:</strong> What discriminatory signs and practices did Caribbean migrants encounter when searching for rental rooms in London boarding houses?</li><li><strong>[03:45] Historical Significance:</strong> How did Caribbean arrivals respond to isolation by forming supportive grassroots networks, such as 'pardner' community savings schemes and Pentecostal churches?</li></ol>",
      model_answer: "<ol><li><strong>Primary Testimony:</strong> Landlords openly displayed window signs reading 'No Blacks, No Irish, No Dogs', turned people away at the door upon seeing their skin, or charged double rent for freezing unheated attics.</li><li><strong>Historical Significance:</strong> Excluded from British banks and mainstream churches, the community established rotating credit unions ('pardner' schemes) to buy homes and established independent black churches, creating resilient civic pillars.</li></ol>"
    },
    {
      type: "youtube",
      id: "1PsNmTB4LEA",
      url: "https://www.youtube.com/watch?v=1PsNmTB4LEA",
      title: "The Notting Hill Riots of 1958 & The Origins of Notting Hill Carnival",
      duration: "3 mins 51 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Examines the racist street violence in Notting Hill in late August 1958 fueled by Teddy Boys, and Claudia Jones' creation of the Caribbean Carnival in 1959. Recommended Watch Window: 00:30–03:30 • Lesson Phase: Racial Conflict & Cultural Triumph. Tone Alert: Frank historical examination of racial violence and cultural resilience.",
      viewing_task: "<ol><li><strong>[01:15] Recall:</strong> What fascist street gangs ('Teddy Boys') attacked black residents in Notting Hill, London, in late August 1958?</li><li><strong>[02:30] Explain:</strong> How did Trinidadian activist Claudia Jones respond to the riots by establishing the London Caribbean Carnival in January 1959?</li><li><strong>[03:20] Challenge:</strong> How did the 1958 riots expose the myth of British racial tolerance and pave the way for Britain's first Race Relations Acts?</li></ol>",
      model_answer: "<ol><li><strong>Recall:</strong> Working-class youth gangs known as 'Teddy Boys', incited by Oswald Mosley's far-right Union Movement chanting 'Keep Britain White'.</li><li><strong>Explain:</strong> She organized an indoor carnival in St Pancras Town Hall to celebrate Caribbean art, music, and steelpan culture, using joyful cultural expression to bridge community divides and defy racism.</li><li><strong>Challenge:</strong> The violence shattered Britain's claim to moral superiority over American segregation, proving state legislation was needed to outlaw racial discrimination in public venues.</li></ol>"
    }
  ],
  // Lesson 4: 1963 Bristol Bus Boycott
  [
    {
      type: "youtube",
      id: "uSyzaXXKUaQ",
      url: "https://www.youtube.com/watch?v=uSyzaXXKUaQ",
      title: "The Story of the Bristol Bus Boycott (1963) | Black History Month",
      duration: "1 min 54 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Succinct animated overview of how young social worker Paul Stephenson, Roy Hackett, and the West Indian Development Council organized a 4-month total boycott of the Bristol Omnibus Company in 1963. Recommended Watch Window: 00:00–01:54 • Lesson Phase: Quick Starter Check (0–2m). Tone Alert: Fast, high-energy introduction to Britain's civil rights struggle.",
      viewing_task: "<ol><li><strong>[00:45] Quick Check:</strong> What was the 'colour bar' operated by the Bristol Omnibus Company and the local Transport and General Workers' Union?</li><li><strong>[01:30] Hinge Question:</strong> How did the Bristol Bus Boycott mirror the tactics of Martin Luther King's 1955 Montgomery Bus Boycott in the United States?</li></ol>",
      model_answer: "<ol><li><strong>Quick Check:</strong> The bus company and union had an explicit secret agreement barring black and Asian individuals from being employed as bus drivers or conductors, restricting them strictly to dirty maintenance garage work.</li><li><strong>Hinge Question:</strong> Like Montgomery, civil rights campaigners organized a disciplined, peaceful consumer boycott where the black community and university students refused to ride Bristol buses, hitting the company's profits and shaming them in national headlines until the colour bar was dismantled.</li></ol>"
    },
    {
      type: "youtube",
      id: "rQXwh__d2S4",
      url: "https://www.youtube.com/watch?v=rQXwh__d2S4",
      title: "How the Bristol Bus Boycott Changed UK Civil Rights | BBC Witness History",
      duration: "3 mins 44 secs",
      pathway: "Core Enquiry",
      teacher_guidance: "BBC oral history exploring Guy Bailey's rejected job interview, Paul Stephenson's press campaign, and national solidarity. Recommended Watch Window: 00:30–03:30 • Lesson Phase: Core Enquiry & Investigative Tactics. Tone Alert: Compelling journalistic breakdown of grassroots civil rights activism.",
      viewing_task: "<ol><li><strong>[01:00] Recall:</strong> What test case did Paul Stephenson arrange using 18-year-old Guy Bailey to prove the Bristol Omnibus Company operated a racist hiring policy?</li><li><strong>[02:15] Explain:</strong> How did Bristol University students and local Labour MP Tony Benn support the boycott and mobilize national political pressure?</li><li><strong>[03:10] Challenge:</strong> On what historic day in August 1963 did the Bristol Omnibus Company finally surrender and overturn its colour bar?</li></ol>",
      model_answer: "<ol><li><strong>Recall:</strong> Stephenson booked a job interview for Bailey, but when the bus manager discovered Bailey was black, the interview was instantly cancelled, providing undeniable proof of racial discrimination.</li><li><strong>Explain:</strong> University students marched through city streets carrying placards, while Tony Benn intervened with the national Labour party leadership, bringing international media shame upon the company.</li><li><strong>Challenge:</strong> On 28 August 1963—the exact same day that Dr Martin Luther King Jr delivered his 'I Have a Dream' speech at the March on Washington—Bristol bus management voted to end the colour bar.</li></ol>"
    },
    {
      type: "youtube",
      id: "swAiI_ovs4I",
      url: "https://www.youtube.com/watch?v=swAiI_ovs4I",
      title: "The Bristol Bus Boycott & The Fight Against the Colour Bar | BBC One Show",
      duration: "4 mins 36 secs",
      pathway: "Primary Archive",
      teacher_guidance: "Vivid BBC feature profiling Raghbir Singh, Bristol's first non-white bus conductor hired in September 1963, and the pioneers who led the boycott. Recommended Watch Window: 00:45–04:00 • Lesson Phase: Primary Archive & Personal Triumph. Tone Alert: Celebratory and reflective look at British civil rights history.",
      viewing_task: "<ol><li><strong>[01:15] Historical Context:</strong> Who was Raghbir Singh, and what was the public reaction when he began work as Bristol's first Sikh bus conductor in September 1963?</li><li><strong>[03:00] Legislative Impact:</strong> How did the success of the Bristol Bus Boycott directly inspire Harold Wilson's government to introduce the Race Relations Act of 1965?</li></ol>",
      model_answer: "<ol><li><strong>Historical Context:</strong> Raghbir Singh was an Indian-born Sikh who was hired as the first minority conductor; while some passengers were surprised, most ordinary Bristolians welcomed him warmly and supported fair employment.</li><li><strong>Legislative Impact:</strong> It proved to lawmakers that racial discrimination could not be handled through polite informal guidelines; the 1965 Act made racial discrimination unlawful in public places across Great Britain for the first time.</li></ol>"
    },
    {
      type: "youtube",
      id: "TT-PTCtw4sk",
      url: "https://www.youtube.com/watch?v=TT-PTCtw4sk",
      title: "Dr Paul Stephenson & The Bristol Bus Boycott | British Civil Rights Leaders",
      duration: "9 mins 49 secs",
      pathway: "Documentary Depth",
      teacher_guidance: "Comprehensive documentary examining Paul Stephenson's subsequent victory at the Bay Horse Pub (where he was arrested for refusing to leave a segregated bar), leading directly to national anti-discrimination law. Recommended Watch Window: 01:00–07:30 • Lesson Phase: High-Attainer Stretch & Legal Landmark. Tone Alert: Biographical documentary celebrating Black British leadership.",
      viewing_task: "<ol><li><strong>[02:15] Recall:</strong> What incident at the Bay Horse Pub in Bristol in 1964 led to Paul Stephenson's arrest and another major national race-relations trial?</li><li><strong>[05:30] Explain:</strong> How did Stephenson's acquittal in court demonstrate the total absence of legal protection for minorities in Britain prior to 1965?</li><li><strong>[07:15] Challenge:</strong> To what extent should the Bristol Bus Boycott be taught in British schools alongside the American Civil Rights Movement?</li></ol>",
      model_answer: "<ol><li><strong>Recall:</strong> Stephenson ordered a beer in the pub and was told 'we don't serve black people'; when he refused to leave on principle, he was arrested for refusing to quit licensed premises.</li><li><strong>Explain:</strong> The magistrate dismissed the charge and ordered the landlord to pay costs, exposing that British law provided zero civil rights remedies for victims of discrimination.</li><li><strong>Challenge:</strong> British students often learn about Rosa Parks and Martin Luther King while remaining entirely unaware of Britain's own indigenous civil rights struggles, leaders (Stephenson, Hackett, Bailey), and legislative milestones.</li></ol>"
    }
  ],
  // Lesson 5: Cold War Home Front
  [
    {
      type: "youtube",
      id: "UgOybc8Jdoo",
      url: "https://www.youtube.com/watch?v=UgOybc8Jdoo",
      title: "Nuclear Attack: Protect & Survive: Action After Warnings (1975) | British Government Archives",
      duration: "4 mins 14 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Authentic Central Office of Information civil defence broadcast detailing DIY 'inner core fallout shelters' made of unhinged doors, sandbags, and canned food. Recommended Watch Window: 00:00–04:14 • Lesson Phase: Cold War Home Front Hook. Tone Alert: Uncanny, detached bureaucratic advice for surviving a thermonuclear apocalypse.",
      viewing_task: "<ol><li><strong>[01:00] Quick Check:</strong> What advice did the British government give citizens for building an 'inner refuge' inside their homes in the event of nuclear war?</li><li><strong>[02:45] Hinge Question:</strong> Was the 'Protect and Survive' campaign a genuine civil defence plan or political propaganda designed to convince the public that nuclear war was survivable?</li></ol>",
      model_answer: "<ol><li><strong>Quick Check:</strong> Remove heavy doors, prop them against an inner wall at an angle, cover them with mattresses and sandbags, and stay inside for 14 days with bottled water and non-perishable canned food.</li><li><strong>Hinge Question:</strong> Independent scientific analysis proved that suburban brick houses would be instantly incinerated by blast and firestorms; critics argued the pamphlets were cynical psychological reassurance to suppress public panic.</li></ol>"
    },
    {
      type: "youtube",
      id: "womr3xymgE8",
      url: "https://www.youtube.com/watch?v=womr3xymgE8",
      title: "Aldermaston Marches: Ban the Bomb Campaign (1958) | British Pathé",
      duration: "1 min 31 secs",
      pathway: "Primary Archive",
      teacher_guidance: "Historic newsreel of the inaugural Campaign for Nuclear Disarmament (CND) march from Trafalgar Square to the Atomic Weapons Research Establishment at Aldermaston at Easter 1958. Recommended Watch Window: 00:00–01:31 • Lesson Phase: Anti-Nuclear Protest Movement. Tone Alert: Authentic black-and-white archival record of the birth of the CND peace symbol.",
      viewing_task: "<ol><li><strong>[00:30] Primary Evidence:</strong> What famous circular peace symbol, designed by artist Gerald Holtom using semaphore letters N (Nuclear) and D (Disarmament), appears on banners in this 1958 footage?</li><li><strong>[01:10] Analysis:</strong> Why did over 10,000 ordinary British citizens march 52 miles in the freezing rain to the gates of Aldermaston weapons factory?</li></ol>",
      model_answer: "<ol><li><strong>Primary Evidence:</strong> The iconic CND peace symbol: a circle enclosing the naval semaphore signals for 'N' and 'D'.</li><li><strong>Analysis:</strong> They demanded that Britain unilaterally abandon its nuclear arsenal, refusing to participate in superpower nuclear brinkmanship and radioactive atmospheric testing.</li></ol>"
    },
    {
      type: "youtube",
      id: "7SBJ1V5iS_g",
      url: "https://www.youtube.com/watch?v=7SBJ1V5iS_g",
      title: "The Women of Greenham Common Peace Camp | BBC World Service",
      duration: "4 mins 19 secs",
      pathway: "Core Enquiry",
      teacher_guidance: "Inspiring examination of the women-only peace camp established at RAF Greenham Common in Berkshire in September 1981 to protest the stationing of US Cruise missiles on British soil. Recommended Watch Window: 00:30–04:00 • Lesson Phase: Feminist Direct Action & Cold War Resistance. Tone Alert: Moving oral history of peaceful civil disobedience.",
      viewing_task: "<ol><li><strong>[01:00] Recall:</strong> Why did 36 women march from Cardiff to Berkshire in 1981 and set up a permanent protest camp outside RAF Greenham Common?</li><li><strong>[02:20] Explain:</strong> How did 30,000 women peacefully protest on 12 December 1982 by 'Embracing the Base'?</li><li><strong>[03:40] Challenge:</strong> How did the women's peaceful blockade challenge traditional gender roles and redefine anti-war protest in Britain?</li></ol>",
      model_answer: "<ol><li><strong>Recall:</strong> To protest NATO's decision to deploy 96 American nuclear-armed BGM-109G Ground Launched Cruise Missiles at the base.</li><li><strong>Explain:</strong> They joined hands in an unbroken human chain surrounding the entire nine-mile perimeter fence of the military airfield, weaving photos of their children, toys, and peace ribbons into the wire.</li><li><strong>Challenge:</strong> Women left comfortable homes to live in muddy bivouacs through harsh winters, facing police harassment and media smear campaigns, asserting that motherhood gave them a direct moral duty to protect human life from annihilation.</li></ol>"
    },
    {
      type: "youtube",
      id: "vgT4Y30DkaA",
      url: "https://www.youtube.com/watch?v=vgT4Y30DkaA",
      title: "Threads (1984) Official Theatrical Trailer: Nuclear Apocalypse in Britain | BBC",
      duration: "2 mins 23 secs",
      pathway: "Cinematic",
      teacher_guidance: "Harrowing trailer for director Mick Jackson and writer Barry Hines' 1984 BBC film portraying the nuclear destruction of Sheffield and the ensuing medieval regression of Britain. Recommended Watch Window: 00:00–02:23 • Lesson Phase: Cold War Culture & Apocalyptic Realism. Tone Alert: Intense psychological drama; stark depiction of medical catastrophe and nuclear winter.",
      viewing_task: "<ol><li><strong>[00:45] Cultural Analysis:</strong> How does the trailer depict ordinary family life in Sheffield disintegrating as superpower tensions escalate in the Persian Gulf?</li><li><strong>[01:40] Historical Impact:</strong> Why did the broadcast of Threads on BBC television on 23 September 1984 completely shatter public confidence in government civil defence pamphlets like 'Protect and Survive'?</li></ol>",
      model_answer: "<ol><li><strong>Cultural Analysis:</strong> It contrasts domestic routines (hanging laundry, planning weddings, supermarket shopping) with frantic panic-buying, sandbagging, and the blinding thermonuclear flash.</li><li><strong>Historical Impact:</strong> By showing real scientific estimates of nuclear winter, radiation sickness, starvation, and societal collapse into primitive barbarism, it exposed government advice to hide under doors as absurdly inadequate, sparking massive surges in CND membership.</li></ol>"
    }
  ]
];

function updatePWBData(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Strip leading comments and assign to variable
  const pos = content.indexOf('const post_war_britain_data =');
  if (pos === -1) throw new Error('Could not find const post_war_britain_data in ' + filePath);

  const header = content.slice(0, pos);
  let rest = content.slice(pos).replace(/^const\s+post_war_britain_data\s*=\s*/, '');
  rest = rest.replace(/;\s*export\s+default\s+post_war_britain_data;\s*$/, '');

  const data = JSON.parse(rest);

  data.lessons.forEach((l, idx) => {
    l.video = pwbVideos[idx];
  });

  const out = header + 'const post_war_britain_data = ' + JSON.stringify(data, null, 2) + ';\n\nexport default post_war_britain_data;\n';
  fs.writeFileSync(filePath, out, 'utf8');
  console.log('Successfully injected 20 videos into Post-War Britain:', filePath);
}

updatePWBData(path.join(__dirname, '..', 'units', 'post_war_britain', 'data.js'));
updatePWBData(path.join(__dirname, '..', 'public', 'units', 'post_war_britain', 'data.js'));
