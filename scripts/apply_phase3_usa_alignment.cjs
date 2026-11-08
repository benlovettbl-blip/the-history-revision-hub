const fs = require('fs');

const usaPath = 'data/usa.json';
const d = JSON.parse(fs.readFileSync(usaPath, 'utf8'));
const wbData = JSON.parse(fs.readFileSync('scripts/usa_workbook_ground_truth.json', 'utf8'));

// High quality 12m and 4m models for USA
const models = [
  {
    lessonNum: 1,
    q12m_model: "<p>One major reason it was difficult for Black Americans to exercise their civil rights was the legal entrenchment of <strong>Jim Crow laws and disenfranchisement</strong> across the South. Southern states passed laws enforcing segregation in schools, public transit, and restaurants under the 1896 'separate but equal' doctrine of Plessy v. Ferguson. Crucially, white officials enacted discriminatory voter registration tests, poll taxes, and 'grandfather clauses' that effectively stripped Black citizens of their constitutional right to vote. Without the vote, Black communities had no political power to elect sympathetic officials, change unjust laws, or serve on all-white juries. Therefore, state-sponsored legal barriers systematically prevented Black citizens from seeking justice or political representation.</p><p>Furthermore, civil rights were violently suppressed through the terror of <strong>the Ku Klux Klan (KKK) and white supremacist groups</strong>. Any Black American who attempted to challenge segregation or register to vote faced immediate economic retaliation, such as being evicted by white landlords or fired by white employers. If economic intimidation failed, white supremacists turned to physical violence, beatings, and lynching, often carried out with the tacit approval or active participation of local police and sheriffs. The knowledge that murders of Black people went unpunished created a climate of pervasive fear. Therefore, terror and violent intimidation made open political resistance life-threatening.</p><p>Finally, the <strong>lack of federal intervention</strong> left Southern Black Americans completely vulnerable. While the 14th and 15th Amendments guaranteed citizenship and voting rights, the federal government in Washington refused to enforce these protections due to the powerful bloc of Southern Democrats ('Dixiecrats') in the US Senate, who filibustered civil rights bills. Consequently, local police, magistrates, and governors operated with total impunity, ensuring that Southern apartheid remained virtually unchallenged throughout the early 1950s.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that racial segregation was strictly and legally enforced in public transport facilities.<br><strong>Details in the source that tell me this:</strong><br>The statute mandates that railroad and bus operators provide 'equal but separate accommodations for the white and colored races'.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the state criminalized any mixing of races on passenger transit.<br><strong>Details in the source that tell me this:</strong><br>The law orders separate cars and partitioned compartments to ensure strict physical division between passengers.</p>"
  },
  {
    lessonNum: 2,
    q12m_model: "<p>One decisive reason Brown v. Board of Education was a turning point was that it <strong>demolished the legal doctrine of 'separate but equal'</strong>. On 17 May 1954, Chief Justice Earl Warren delivered a unanimous Supreme Court verdict declaring that segregation in public education was inherently unequal and violated the Equal Protection Clause of the 14th Amendment. This legally overturned the 1896 Plessy v. Ferguson precedent that had legitimized Jim Crow for nearly sixty years. Therefore, Brown established a constitutional benchmark that activists could use to challenge segregation across all public facilities.</p><p>Furthermore, the ruling was a monumental victory for <strong>the NAACP and Thurgood Marshall</strong>. Marshall's legal defense team had spent decades carefully litigating cases to prove that segregated Black schools suffered from devastating underfunding and psychological harm, citing psychological doll tests. Winning this case validated the NAACP's legal strategy and proved that the highest court in the nation could act as an instrument of civil rights progress. Therefore, it energized the wider movement and inspired activists to pursue active school integration.</p><p>However, the ruling's immediate impact was limited because the Supreme Court did not set a firm integration deadline, ruling in 1955 ('Brown II') that integration should proceed <strong>'with all deliberate speed'</strong>. Southern segregationists exploited this vague phrase to mount Massive Resistance, closing schools and creating private white academies. Nevertheless, Brown was a crucial constitutional catalyst because it placed the federal judiciary firmly on the side of racial equality and laid the legal foundation for the Little Rock Nine confrontation in 1957.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that Black students faced intense, hostile opposition from local white crowds when entering desegregated schools.<br><strong>Details in the source that tell me this:</strong><br>The source describes angry mobs shouting threats and spitting at students attempting to enter the school gates.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that state authorities initially assisted the resistance to integration.<br><strong>Details in the source that tell me this:</strong><br>National Guard troops were initially deployed by the state governor to physically bar the Black students from entering.</p>"
  },
  {
    lessonNum: 3,
    q12m_model: "<p>One primary reason the Montgomery Bus Boycott succeeded was the disciplined leadership of <strong>the Montgomery Improvement Association (MIA) and Martin Luther King Jr.</strong>. Following Rosa Parks's arrest in December 1955, the MIA organized an extraordinary carpool system involving hundreds of private cars and Black-owned taxis, while over 40,000 Black citizens walked to work for 381 consecutive days. King’s non-violent Christian philosophy united the community, kept morale high despite police harassment and church bombings, and attracted national media attention. Therefore, cohesive grassroots organization deprived the bus company of 75% of its passengers and caused catastrophic revenue loss.</p><p>Furthermore, the boycott's ultimate success was sealed by federal judicial action in <strong>Browder v. Gayle (1956)</strong>. While the boycott maintained economic pressure, the legal team filed a federal lawsuit challenging bus segregation directly under the 14th Amendment. In November 1956, the US Supreme Court upheld the federal district court ruling that segregation on public buses was unconstitutional. Therefore, economic boycott combined with constitutional litigation forced the city of Montgomery to fully desegregate its transit system in December 1956.</p><p>Finally, the boycott demonstrated the power of <strong>economic solidarity and the Black church</strong>. Black women, led by Jo Ann Robinson and the Women's Political Council, distributed 35,000 leaflets to launch the boycott within hours of Parks’s arrest, while church congregations funded vehicle maintenance and bail bonds. This demonstrated that unified non-violent economic resistance could defeat Southern segregation, providing a blueprint for the wider civil rights movement.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that the Black community in Montgomery showed immense collective endurance and unity.<br><strong>Details in the source that tell me this:</strong><br>Thousands of residents walked miles to work daily through rain and heat rather than riding the segregated buses.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that local authorities used intimidation and legal harassment to break the boycott.<br><strong>Details in the source that tell me this:</strong><br>Police repeatedly arrested carpool drivers and cited them for minor traffic offenses to disrupt the transport system.</p>"
  },
  {
    lessonNum: 4,
    q12m_model: "<p>One major reason white segregationists mounted Massive Resistance was the emergence of <strong>White Citizens' Councils and economic intimidation</strong>. Founded in Mississippi in 1954, these councils consisted of middle-class white professionals, businessmen, and politicians who used their economic stranglehold to crush civil rights activism. Black individuals who signed integration petitions or attempted to enroll children in white schools were instantly fired from jobs, denied bank loans, or evicted from rented homes. Therefore, organized economic retaliation terrified ordinary Black families and successfully blocked grassroots compliance with federal integration decrees.</p><p>Furthermore, resistance was legitimized by top state politicians through <strong>the 'Southern Manifesto' and state governors</strong>. In 1956, 101 Southern congressmen and senators signed the declaration denouncing the Supreme Court's Brown decision as a 'clear abuse of judicial power' and pledging resistance by all lawful means. Southern governors, such as Orval Faubus of Arkansas, openly defied federal court orders by deploying the Arkansas National Guard to block the Little Rock Nine in 1957, while Virginia passed laws cutting off state funding to any school that integrated. Therefore, state leaders provided constitutional cover and encouragement for widespread white defiance.</p><p>Finally, Massive Resistance was driven by deep-rooted <strong>white supremacist ideology and violent terror</strong>. Segregationists viewed school integration as an existential threat to white racial purity and social dominance. When legal resistance faltered, extremist groups like the Ku Klux Klan carried out terrorist bombings of Black homes, churches, and civil rights offices, illustrated by the brutal 1955 murder of 14-year-old Emmett Till. The acquittal of Till's killers by an all-white jury demonstrated that the Southern legal system was entirely weaponized to preserve white supremacy.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that racial violence against Black Americans in the South was extreme and unchecked by local law enforcement.<br><strong>Details in the source that tell me this:</strong><br>The extract details the brutal abduction and murder of Emmett Till after he allegedly whistled at a white woman.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the Southern judicial system actively protected white perpetrators of racial violence.<br><strong>Details in the source that tell me this:</strong><br>An all-white, all-male jury acquitted the confessed murderers after deliberating for barely an hour.</p>"
  },
  {
    lessonNum: 5,
    q12m_model: "<p>One major reason peaceful direct action succeeded was the strategic discipline of <strong>the Greensboro sit-ins and the Student Nonviolent Coordinating Committee (SNCC)</strong>. In February 1960, four Black college students sat at a segregated Woolworth’s lunch counter in Greensboro, North Carolina, refusing to leave after being denied service. Within weeks, the tactic spread to over 50 cities, organized by SNCC. Demonstrators maintained strict non-violent discipline while white mobs poured food, insulted them, and physically assaulted them. This stark visual contrast between dignified students and violent segregationists generated nationwide outrage and severe commercial boycotts, forcing Woolworth's and hundreds of Southern lunch counters to desegregate by summer 1960.</p><p>Furthermore, peaceful protest succeeded by forcing federal intervention through <strong>the Freedom Rides and the Interstate Commerce Commission (ICC)</strong>. In May 1961, CORE and SNCC activists boarded interstate buses into the Deep South to test Supreme Court rulings banning transit segregation. When riders were firebombed in Anniston, Alabama, and viciously beaten by KKK mobs in Birmingham while police looked on, Attorney General Robert F. Kennedy was compelled to send 500 federal marshals to protect them. In September 1961, the federal government ordered the ICC to enforce strict desegregation of all interstate bus terminals, successfully abolishing Jim Crow in interstate travel.</p><p>Finally, direct action was effective because it <strong>utilized television cameras to win northern public opinion</strong>. Millions of television viewers across the United States witnessed non-violent demonstrators being brutalized for simply attempting to buy a cup of coffee or take a bus. This created an irresistible political consensus that compelled the Kennedy administration to abandon caution and begin drafting comprehensive federal civil rights legislation.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that civil rights sit-in demonstrators were highly trained in non-violent discipline.<br><strong>Details in the source that tell me this:</strong><br>Students remained seated upright, reading textbooks quietly without retaliating while food and abuse were hurled at them.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that white segregationist opponents used physical provocation and humiliation to provoke a violent response.<br><strong>Details in the source that tell me this:</strong><br>The source describes white youths pouring hot coffee and smearing condiments over the demonstrators' heads.</p>"
  },
  {
    lessonNum: 6,
    q12m_model: "<p>One decisive catalyst for the 1964 Civil Rights Act was the national outrage sparked by <strong>the Birmingham Campaign of May 1963</strong>. The Southern Christian Leadership Conference (SCLC) targeted Birmingham, Alabama, one of the most segregated cities in America. Police Commissioner Bull Connor unleashed police attack dogs and high-pressure fire hoses on peaceful demonstrators, including hundreds of school children. Broadcast across the world on television, these harrowing images horrified the American public and international allies, embarrassing President John F. Kennedy and convincing him that segregation was a moral crisis requiring immediate federal legislation.</p><p>Furthermore, passage was accelerated by the political momentum generated by <strong>the March on Washington and the assassination of President Kennedy</strong>. In August 1963, over 250,000 Americans gathered at the Lincoln Memorial, where Martin Luther King Jr. delivered his iconic 'I Have a Dream' speech, demonstrating massive multi-racial support for reform. Following Kennedy's assassination in November 1963, President Lyndon B. Johnson framed the Civil Rights Bill as a sacred memorial to the fallen president. Johnson used his formidable legislative expertise to break a 54-day filibuster by Southern senators in the Senate. Therefore, moral pressure and presidential willpower combined to push the bill into law.</p><p>Finally, the Act succeeded because it possessed <strong>unprecedented federal enforcement mechanisms</strong>. Unlike earlier symbolic civil rights acts in 1957 and 1960, the 1964 Act officially banned racial segregation in all public accommodations, prohibited employment discrimination via the Equal Employment Opportunity Commission (EEOC), and empowered the federal government to withhold federal funding from any school district or institution that continued to practice segregation.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that the 1963 March on Washington demonstrated massive, disciplined, and multi-racial solidarity.<br><strong>Details in the source that tell me this:</strong><br>The source describes a quarter of a million Black and white citizens gathered peacefully together before the Lincoln Memorial.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that civil rights leaders explicitly demanded both racial equality and economic justice.<br><strong>Details in the source that tell me this:</strong><br>Banners and speeches prominently demanded 'Jobs and Freedom' alongside immediate voting rights protections.</p>"
  },
  {
    lessonNum: 7,
    q12m_model: "<p>One primary reason the Voting Rights Act of 1965 was passed was the moral revulsion created by <strong>the Selma to Montgomery marches and 'Bloody Sunday' (March 1965)</strong>. To highlight the disenfranchisement of Selma's Black population, where only 2% were registered to vote, John Lewis and Hosea Williams led 600 peaceful marchers across the Edmund Pettus Bridge. State troopers and mounted possemen tear-gassed and beat the marchers with clubs and bullwhips. Televised nationwide, the horrific violence outraged the country, prompting President Lyndon B. Johnson to address a joint session of Congress and declare 'We Shall Overcome'. Therefore, Selma generated irresistible national momentum for immediate voting reform.</p><p>Furthermore, passage was driven by <strong>the Mississippi Freedom Summer and the murder of civil rights workers (1964)</strong>. In the summer of 1964, SNCC recruited over 1,000 northern, mostly white college volunteers to establish Freedom Schools and register Black voters across Mississippi. The brutal murder of three volunteers—James Chaney, Andrew Goodman, and Michael Schwerner—by KKK members working alongside the local deputy sheriff exposed the violent reality of Southern voter suppression. The Mississippi Freedom Democratic Party’s challenge at the 1964 Democratic National Convention further humiliated segregationists on the national stage.</p><p>Finally, the Act was passed because it provided <strong>drastic federal intervention to strip states of voter suppression powers</strong>. The Voting Rights Act of 1965 banned literacy tests across the nation and authorized federal examiners to directly register Black voters in counties where registration was below 50%. Under federal supervision, Black voter registration in Mississippi soared from 7% in 1964 to 60% by 1968, transforming Southern electoral politics.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that Black athletes used global media platforms to protest continuing racial injustice in America.<br><strong>Details in the source that tell me this:</strong><br>Tommie Smith and John Carlos bowed their heads and raised gloved fists during the US national anthem at the Olympics.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the protest carried symbolic references to Black poverty and suffering.<br><strong>Details in the source that tell me this:</strong><br>The athletes wore black socks without shoes on the podium to represent Black poverty in the United States.</p>"
  },
  {
    lessonNum: 8,
    q12m_model: "<p>One decisive reason the Black Power movement grew in popularity was the radical appeal of <strong>the ideas of Malcolm X and the Black Panther Party</strong>. Malcolm X rejected the non-violent, integrationist philosophy of Martin Luther King Jr., arguing that Black Americans should defend themselves 'by any means necessary' and take pride in their African heritage. After his assassination in 1965, figures like Stokely Carmichael popularized the slogan 'Black Power'. In 1966, Huey Newton and Bobby Seale formed the Black Panther Party in Oakland, California, carrying loaded weapons to patrol police and establishing Free Breakfast programs for children. This emphasis on armed self-defense, racial dignity, and community self-reliance deeply inspired alienated Black youths.</p><p>Furthermore, growth was fueled by <strong>deep frustration with the limitations of civil rights laws in northern and western ghettos</strong>. The 1964 and 1965 Civil Rights Acts ended legal segregation in the South, but did nothing to tackle poverty, police brutality, crumbling housing, or massive youth unemployment in northern cities like New York, Chicago, and Los Angeles. Black residents realized that legal integration did not bring economic equality, leading to disillusionment with King’s non-violent campaigns in northern cities like Chicago in 1966. Therefore, urban Black communities embraced militant alternatives that addressed structural economic oppression.</p><p>Finally, the movement was accelerated by the outbreak of <strong>urban race riots between 1965 and 1968</strong>. Starting with the Watts Riot in Los Angeles (August 1965), devastating riots erupted in Detroit, Newark, and over 100 cities following the assassination of Martin Luther King Jr. in April 1968. The Kerner Commission (1968) warned that America was moving toward 'two societies, one black, one white—separate and unequal'. These uprisings reflected intense rage against white institutional neglect, providing fertile ground for Black Power militancy.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that urban riots in northern and western cities were triggered by deep frustration over police harassment and systemic poverty.<br><strong>Details in the source that tell me this:</strong><br>Community organizers describe boiling anger over constant aggressive police stops and chronic joblessness in the ghetto.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that mainstream non-violent civil rights victories had failed to improve daily living standards in northern inner cities.<br><strong>Details in the source that tell me this:</strong><br>Residents expressed bitterness that federal voting laws made zero difference to run-down tenements and segregated city schools.</p>"
  },
  {
    lessonNum: 9,
    q12m_model: "<p>One major reason the United States became increasingly involved in Vietnam was the influence of <strong>the Domino Theory and the Cold War containment policy</strong>. Following the communist takeover of China in 1949 and the Korean War (1950–53), American policymakers believed that global communism was an aggressive, monolithic conspiracy directed by Moscow and Beijing. In April 1954, President Dwight D. Eisenhower formulated the 'Domino Theory', warning that if Indochina fell to Ho Chi Minh’s communist Vietminh, neighboring countries like Laos, Cambodia, Thailand, and Burma would rapidly collapse like a row of dominos. Therefore, US strategic doctrine required defending South Vietnam to contain communist expansion in Southeast Asia.</p><p>Furthermore, involvement deepened through <strong>US support for Ngo Dinh Diem and the growth of the Vietcong</strong>. Following the 1954 Geneva Accords, which partitioned Vietnam at the 17th parallel, the US backed the Catholic, anti-communist leader Ngo Dinh Diem in the South, providing billions in financial and military aid. The US supported Diem's refusal to hold nationwide reunification elections in 1956, fearing Ho Chi Minh would win. However, Diem's corrupt, repressive regime alienated Buddhist majorities and peasants through the Strategic Hamlet program, prompting southern communists to form the National Liberation Front (Vietcong) in 1960. As Vietcong guerrilla warfare expanded, President John F. Kennedy increased US military advisers from 900 in 1960 to over 16,000 by 1963.</p><p>Finally, US commitment was sealed by <strong>the overthrow of Diem and Kennedy’s political commitment</strong>. By late 1963, Diem's persecution of Buddhists—exemplified by monk Thich Quang Duc's self-immolation—convinced the US to tacitly endorse a military coup that assassinated Diem in November 1963. The resulting political chaos left South Vietnam governed by weak military juntas, creating a vacuum that compelled the US to step in directly to prevent communist victory.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that American leadership believed the loss of Indochina would trigger a chain reaction of communist takeovers across Asia.<br><strong>Details in the source that tell me this:</strong><br>Eisenhower uses the 'falling domino' analogy to explain that knocking over the first country leads to the collapse of the rest.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the US considered Southeast Asia vital for its economic resources and strategic security.<br><strong>Details in the source that tell me this:</strong><br>The president warns that losing the region would deny the West access to valuable raw materials and trade routes.</p>"
  },
  {
    lessonNum: 10,
    q12m_model: "<p>One decisive trigger for US military escalation was <strong>the Gulf of Tonkin incident in August 1964</strong>. On 2 August, the US destroyer USS Maddox engaged North Vietnamese patrol boats in the Gulf of Tonkin, and on 4 August reported a second attack amid radar confusion and storm conditions. President Lyndon B. Johnson used this incident to persuade Congress to pass the Gulf of Tonkin Resolution by an overwhelming majority. The resolution gave the president extraordinary legal power to 'take all necessary measures to repel any armed attack against forces of the United States', effectively providing Johnson with a blank cheque to conduct war in Vietnam without a formal congressional declaration.</p><p>Furthermore, escalation accelerated dramatically following <strong>the attack on the US military base at Pleiku in February 1965</strong>. Vietcong guerrillas launched a mortar attack on Camp Holloway in Pleiku, killing eight American servicemen and wounding over one hundred. Johnson immediately authorized Operation Rolling Thunder, a continuous, sustained bombing campaign against North Vietnam designed to destroy supply routes and force Hanoi to negotiate. To protect the vital airbase at Da Nang from Vietcong counter-attacks, Johnson deployed 3,500 US Marines on 8 March 1965, marking the official introduction of US ground combat troops.</p><p>Finally, escalation was driven by <strong>the imminent collapse of the South Vietnamese government (ARVN)</strong>. Throughout late 1964 and early 1965, the Vietcong inflicted devastating defeats on the South Vietnamese army at battles like Binh Gia. US military commanders, led by General William Westmoreland, warned Johnson that without massive American ground combat intervention, South Vietnam would fall to communism within months. Fearing the domestic political damage of 'losing' Vietnam, Johnson chose rapid Americanization of the war, surging US troop numbers to 184,000 by the end of 1965.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that naval commanders in the Gulf of Tonkin faced severe confusion and doubted whether a second attack had actually occurred.<br><strong>Details in the source that tell me this:</strong><br>The cable reports freak weather effects on radar and overeager sonar men, warning that many contacts were erroneous.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that military officers urged caution and thorough daytime reconnaissance before launching retaliatory airstrikes.<br><strong>Details in the source that tell me this:</strong><br>The commander specifically recommends a complete evaluation before taking further retaliatory action.</p>"
  },
  {
    lessonNum: 11,
    q12m_model: "<p>One major reason US tactics failed was <strong>Vietcong guerrilla tactics and underground tunnel networks</strong>. Lacking tanks and aircraft, the Vietcong fought an asymmetrical war using the slogan 'clinging to the belt' of the enemy—fighting at close quarters so US air support and artillery could not be used without killing American soldiers. They utilized thousands of concealed booby traps (such as Punji stick pits and tripwires) that caused 11% of US casualties and inflicted immense psychological terror. Furthermore, extensive underground complexes like the Cu Chi tunnels allowed guerrillas to store weapons, treat wounded, and vanish into the jungle when US patrols arrived. Therefore, conventional US firepower could not eliminate an elusive, embedded guerrilla enemy.</p><p>Furthermore, failure resulted from <strong>the counterproductive nature of US Search and Destroy missions and chemical defoliants</strong>. General Westmoreland relied on a war of attrition, measuring success by 'body count'. US patrols in helicopters descended on villages suspected of harboring Vietcong, burning huts ('Zippo raids') and alienating the civilian peasant population. The widespread spraying of Agent Orange (defoliant) and Napalm destroyed crops and poisoned villagers, driving millions of peasant refugees into overcrowded cities and turning the rural population into committed supporters of the Vietcong. Therefore, search-and-destroy failed to win the 'hearts and minds' of the Vietnamese people.</p><p>Finally, the US failed because of <strong>the Ho Chi Minh Trail and external communist support</strong>. Despite dropping more bomb tonnage on North Vietnam and Laos than on all of Europe during World War II, the US could not sever the Ho Chi Minh Trail, a jungle supply network maintained by hundreds of thousands of laborers. Crucially, the Soviet Union and China provided North Vietnam with advanced anti-aircraft missiles, modern artillery, and economic aid. The Vietnamese communists were fighting a total patriotic war of national survival, demonstrating an endurance and morale that US conscript soldiers on one-year tours could not break.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that Vietcong tunnel networks were highly sophisticated, multi-level underground strongholds.<br><strong>Details in the source that tell me this:</strong><br>The intelligence diagram shows interconnected bunkers containing hospitals, sleeping quarters, and ammunition caches deep underground.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the tunnels provided complete concealment and protection from heavy US aerial bombing.<br><strong>Details in the source that tell me this:</strong><br>The tunnels featured blast baffles, camouflage trapdoors, and ventilation shafts hidden in tree roots to survive airstrikes.</p>"
  },
  {
    lessonNum: 12,
    q12m_model: "<p>One major reason the Tet Offensive was a decisive turning point was <strong>the military destruction of the Vietcong contrasted with political disaster for the US</strong>. On 31 January 1968, during the Vietnamese lunar new year truce, 84,000 communist troops launched coordinated surprise attacks on over 100 cities, towns, and military bases across South Vietnam, including the US Embassy in Saigon. Militarily, the offensive was a catastrophic failure for the communists: US and ARVN forces quickly recaptured every town, killing an estimated 45,000 Vietcong and effectively destroying the Vietcong as an independent fighting force. However, politically, it delivered a devastating shock to the American public.</p><p>Furthermore, Tet was a turning point because it shattered US public confidence by exposing <strong>the 'credibility gap' and Walter Cronkite's report</strong>. For years, President Johnson and General Westmoreland had assured the public that the war was being won and that the enemy was on the brink of defeat. The sight of Vietcong commandos fighting inside the US embassy compound on live television shattered these claims. Respected CBS news anchor Walter Cronkite traveled to Vietnam and broadcast that the war was mired in an unwinnable stalemate. President Johnson famously remarked, 'If I've lost Cronkite, I've lost Middle America.' Therefore, public trust in the presidency and military leadership completely collapsed.</p><p>Finally, Tet forced a <strong>complete reversal of US military strategy</strong>. Recognizing that the war could not be won militarily without catastrophic domestic turmoil, Johnson rejected Westmoreland's request for 206,000 additional troops. On 31 March 1968, Johnson announced a halt to bombing over most of North Vietnam, offered peace talks, and shocked the world by declaring he would not seek re-election. Tet marked the end of US escalation and began the long, agonizing retreat from Southeast Asia.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that respected media journalists concluded the war could no longer be won through military victory.<br><strong>Details in the source that tell me this:</strong><br>Walter Cronkite states directly on air that the only rational conclusion is that the war is mired in a bloody stalemate.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that television reporting urged the US government to negotiate a peaceful diplomatic exit.<br><strong>Details in the source that tell me this:</strong><br>Cronkite concludes that the United States must negotiate not as victors, but as an honorable people who did their best.</p>"
  },
  {
    lessonNum: 13,
    q12m_model: "<p>One major reason anti-war opposition intensified was <strong>the revelation of the My Lai massacre in November 1969</strong>. In March 1968, Charlie Company, led by Lieutenant William Calley, entered the village of My Lai on a search-and-destroy mission and systematically slaughtered between 347 and 504 unarmed Vietnamese civilians, including women, children, and babies. When investigative journalist Seymour Hersh uncovered the massacre and photographs were published in Life magazine, the American public was profoundly horrified. The atrocity shattered the moral justification for the war, proving to millions of Americans that US soldiers were committing war crimes rather than defending democracy. Therefore, My Lai fueled massive anti-war outrage.</p><p>Furthermore, opposition escalated violently over <strong>the Kent State University shootings in May 1970</strong>. When President Nixon announced on 30 April 1970 that US troops had invaded neutral Cambodia, massive student protests erupted across hundreds of universities. On 4 May 1970, Ohio National Guardsmen opened fire on an unarmed student demonstration at Kent State University, killing four students and wounding nine others. Ten days later, police killed two students at Jackson State. The shootings triggered a nationwide student strike that shut down over 400 college campuses, bringing the domestic social crisis into the heart of white, middle-class America.</p><p>Finally, opposition grew due to <strong>the military draft lottery and rising casualty counts</strong>. By 1969, over 36,000 American soldiers had been killed. In December 1969, Nixon introduced a televised draft lottery, meaning that middle-class college students could no longer easily defer military service. Nightly television news broadcasts brought the grim realities of combat, wounded veterans, and body bags directly into American living rooms, creating the world's first 'television war' and mobilizing millions of ordinary citizens into the Moratorium peace marches.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that state military forces used lethal, disproportionate violence against student demonstrators.<br><strong>Details in the source that tell me this:</strong><br>The source details National Guard soldiers firing 67 rounds into unarmed crowds of young demonstrators in broad daylight.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the shootings caused deep grief, shock, and nationwide student fury.<br><strong>Details in the source that tell me this:</strong><br>The iconic photograph shows a young woman kneeling over the body of a dead student screaming in despair.</p>"
  },
  {
    lessonNum: 14,
    q12m_model: "<p>One primary reason President Nixon introduced Vietnamization was the pressure of <strong>domestic anti-war protests and his appeal to the 'Silent Majority'</strong>. By 1969, domestic polarization threatened to tear the United States apart. In November 1969, Nixon delivered his landmark televised address appealing to the 'great silent majority' of Americans who supported the war but desired an end to casualties. Nixon understood that public tolerance for American soldier deaths had ended. Vietnamization—training and equipping the South Vietnamese army (ARVN) to take over combat operations while gradually withdrawing US troops—allowed Nixon to reduce American casualties from 11,780 in 1969 to 2,414 in 1971, dramatically easing domestic anti-war demonstrations.</p><p>Furthermore, the policy aimed to achieve <strong>'peace with honour'</strong>. Nixon and his National Security Adviser, Henry Kissinger, refused to accept an immediate, humiliating withdrawal, which they argued would destroy US credibility as a global superpower and trigger communist takeovers elsewhere. 'Peace with honour' meant ensuring South Vietnam survived long enough as an independent state to guarantee an honorable American exit. To buy time for ARVN modernization, Nixon secretly escalated the air war, ordering massive bombing raids on Cambodia (Operation Menu) and North Vietnam to disrupt communist supply lines.</p><p>Finally, Vietnamization was supported by <strong>diplomatic rapprochement with China and the Soviet Union ('triangular diplomacy')</strong>. Nixon and Kissinger realized they could exploit the Sino-Soviet split. By opening historic diplomatic relations with Mao Zedong in Beijing (1972) and signing the SALT I treaty with Brezhnev in Moscow, Nixon pressured both communist superpowers to reduce their military backing for North Vietnam and push Hanoi toward negotiated concessions at the Paris peace talks.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that Nixon claimed an immediate American withdrawal would lead to a catastrophic collapse of US international credibility.<br><strong>Details in the source that tell me this:</strong><br>Nixon warns that a precipitate withdrawal would spark violence wherever our commitments help maintain peace.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the president sought to unite non-protesting, patriotic citizens behind his gradual withdrawal strategy.<br><strong>Details in the source that tell me this:</strong><br>He explicitly appeals to 'the great silent majority of my fellow Americans' to support his search for honorable peace.</p>"
  },
  {
    lessonNum: 15,
    q12m_model: "<p>One decisive reason the Paris Peace Accords were signed in January 1973 was <strong>the devastating impact of the 'Christmas Bombings' (Operation Linebacker II, December 1972)</strong>. When peace negotiations stalled in late 1972, President Nixon ordered the most ferocious bombing campaign of the entire war: over 20,000 tons of bombs were dropped on Hanoi and Haiphong in eleven days, destroying North Vietnam’s electrical grid, transport depots, and air defenses. The ferocious destruction forced North Vietnamese negotiators back to the conference table in Paris, while simultaneously reassuring South Vietnamese President Thieu that the US would defend him if North Vietnam violated the treaty.</p><p>Furthermore, signing was driven by <strong>the diplomatic rapprochement between the US, China, and the Soviet Union</strong>. Nixon's historic visits to Beijing and Moscow in 1972 successfully isolated North Vietnam diplomatically. Eager for trade deals and arms limitation agreements with Washington, both the Soviets and Chinese pressured North Vietnam to accept a compromise peace agreement rather than holding out for unconditional victory. Therefore, great power diplomacy deprived Hanoi of unconditional geopolitical backing.</p><p>Finally, the agreement was reached because <strong>both sides made critical diplomatic compromises</strong>. The United States dropped its long-standing demand that all North Vietnamese troops withdraw from South Vietnam, allowing 150,000 communist troops to remain in place. In return, North Vietnam abandoned its demand for the immediate removal of South Vietnamese President Thieu, agreed to return all American prisoners of war (POWs), and allowed a total US troop withdrawal. This enabled Nixon to claim he had achieved 'peace with honour'.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that the Paris Peace Accords marked the formal end of direct American military combat involvement in Vietnam.<br><strong>Details in the source that tell me this:</strong><br>The treaty document specifies the complete withdrawal of all US military personnel and the dismantlement of US bases within sixty days.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that securing the release of American prisoners of war was an absolute priority for US negotiators.<br><strong>Details in the source that tell me this:</strong><br>The agreement contains strict clauses mandating the simultaneous return of all captured military personnel and foreign civilians.</p>"
  },
  {
    lessonNum: 16,
    q12m_model: "<p>One major reason South Vietnam collapsed so rapidly in 1975 was <strong>the corruption, low morale, and military weaknesses of the ARVN</strong>. Although the US had left billions of dollars worth of modern aircraft, tanks, and weapons with the South Vietnamese army, the military leadership was crippled by political patronage, nepotism, and ghost soldiers (commanders pocketing pay for non-existent troops). When North Vietnam launched its massive conventional offensive in early 1975, ARVN units panicked during a chaotic tactical retreat ordered by President Thieu, abandoning thousands of vehicles, artillery pieces, and ammunition stockpiles without firing a shot. Therefore, the ARVN lacked the internal cohesion and will to fight without direct American supervision.</p><p>Furthermore, the collapse was guaranteed by <strong>severe US congressional cuts to military and economic aid</strong>. Following the Watergate scandal, President Nixon resigned in August 1974, leaving a weakened President Gerald Ford facing an overwhelmingly Democratic anti-war Congress. In 1973, Congress passed the War Powers Act restricting presidential military action, and subsequently slashed military aid to South Vietnam by 50% while completely cutting off funding for US air strikes. ARVN troops were forced to ration fuel, bullets, and bandages, leaving them completely outgunned when North Vietnam attacked with modern Soviet-supplied artillery and tanks.</p><p>Finally, South Vietnam was overwhelmed by <strong>North Vietnam's massive spring offensive and the economic crisis in Saigon</strong>. The withdrawal of over 500,000 US soldiers shattered South Vietnam's wartime economy, causing runaway inflation and mass unemployment. Sensing American paralysis, North Vietnamese General Van Tien Dung launched the 'Ho Chi Minh Campaign' in March 1975, slicing through the Central Highlands and advancing rapidly on Saigon. On 30 April 1975, North Vietnamese tanks crashed through the gates of the Presidential Palace in Saigon, marking the total defeat of South Vietnam and the reunification of the country under communist rule.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that combat in Vietnam inflicted extreme, lasting physical trauma and psychological exhaustion on frontline US soldiers.<br><strong>Details in the source that tell me this:</strong><br>The archival photograph shows battle-fatigued infantrymen staring into space with hollow eyes while attending to severely wounded comrades.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that combat conditions in the tropical climate caused severe non-battle medical hardship.<br><strong>Details in the source that tell me this:</strong><br>The soldiers' uniforms are torn and mud-caked from constant monsoon rains, jungle rot, and difficult terrain.</p>"
  }
];

let updatedLessons = 0;

models.forEach(m => {
  const l = d.lessons[m.lessonNum - 1];
  if (!l) return;
  
  const wb = wbData[m.lessonNum - 1];
  
  // Existing questions to preserve
  const existingQs = l.exam_practice?.questions || [];
  const utilityQ = existingQs.find(q => q.tariff && q.tariff.includes('8'));
  const interpQ = existingQs.find(q => q.tariff && (q.tariff.includes('16') || q.tariff.includes('SPaG')));
  
  // Question 1: 4m inference
  const q4m = {
    tariff: "4 marks",
    type: "inference_4m",
    marks: 4,
    question: `1. Give two things you can infer from Source A about ${wb.q4m_topic}. [4 marks]`,
    prompt: "Use the structure strip and historical guidance below to structure your response.",
    model: m.q4m_model,
    scaffolding: {
      acronym: "Point & Detail (4 Marks)",
      acronym_title: "Inference Formula: (i) Inference + Detail, (ii) Inference + Detail",
      sentence_starters: [
        "From Source A I can infer that...",
        "Details in Source A that tell me this are...",
        "Secondly, I can also infer that...",
        "Details in the source that support this are..."
      ]
    },
    examiner_tip: "Beware the 'Dealt vs. Felt' trap: do not simply write about emotions. State two distinct factual inferences backed by separate details or quotes from Source A.",
    model_tiers: {
      tier_1m: {
        title: "1/4 Assertion",
        score: "1 / 4 Marks",
        level: "Level 1 Bottom (Assertion)",
        text: "<p>I can infer that conditions were bad and people were angry.</p>",
        verdict: "AO3 (1 mark). Simple assertion without quoting or citing specific evidence from Source A."
      },
      tier_2m: {
        title: "2/4 Partial / Quote Trap",
        score: "2 / 4 Marks",
        level: "Level 1 Top (Supported Statement)",
        text: `<p><strong>(i) What I can infer:</strong><br>I can infer that people faced difficulties.<br><strong>Details in the source:</strong><br>${(wb.source_text || '').substring(0, 50)}...</p>`,
        verdict: "AO3 (2 marks). 1 valid inference supported by a quote, but second inference omitted."
      },
      tier_4m: {
        title: "4/4 Grade 9 Exam ★",
        score: "4 / 4 Marks",
        level: "Level 2 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: m.q4m_model,
        verdict: "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: `<p>Historical inference reveals the underlying political and structural tensions governing American civil rights and Cold War strategy.<br><br>${m.q4m_model}</p>`,
        verdict: "Elite historiographical evaluation analyzing structural context and institutional ideology."
      }
    }
  };
  
  // Question 2: 12m explain why
  const q12m = {
    tariff: "12 marks",
    type: "causation_12m",
    marks: 12,
    question: `2. ${wb.q12m}`,
    stimulus: wb.stimuli,
    prompt: "Explain at least three distinct causal factors using specific historical evidence (including both stimulus points and your own knowledge), and link each paragraph back to the question stem.",
    model: m.q12m_model,
    scaffolding: {
      acronym: "P-E-E-L",
      acronym_title: "12-Mark Causation Formula: Point, Evidence, Explanation, Link",
      sentence_starters: [
        "One decisive reason was that...",
        "For example, this meant that...",
        "Consequently, this was critical because...",
        "Furthermore, another decisive factor was..."
      ]
    },
    model_tiers: {
      tier_1m: {
        title: "Level 1 (1–3 marks)",
        score: "1–3 Marks",
        level: "Level 1 (Basic / Generalised)",
        text: `<p>${m.q12m_model.split('</p>')[0].replace(/<[^>]+>/g, '').split('.')[0]}.</p>`,
        verdict: "AO1/AO2. Generalised narrative with minimal supporting factual evidence."
      },
      tier_2m: {
        title: "Level 2 (4–6 marks)",
        score: "4–6 Marks",
        level: "Level 2 (Simple Explanation)",
        text: m.q12m_model.split('</p>').slice(0, 2).join('</p>') + '</p>',
        verdict: "AO1/AO2. Identifies two factors with limited factual detail; one stimulus point addressed."
      },
      tier_3m: {
        title: "Level 3 (7–9 marks)",
        score: "7–9 Marks",
        level: "Level 3 (Developed Explanation)",
        text: m.q12m_model,
        verdict: "AO1/AO2. Both stimulus points and outside knowledge developed; clear causal explanation."
      },
      tier_4m: {
        title: "Level 4 (10–12 marks ★)",
        score: "10–12 Marks",
        level: "Level 4 Top (Pearson Benchmark)",
        badge: "Edexcel Benchmark",
        text: m.q12m_model,
        verdict: "AO1/AO2. Sustained, analytical causal argument integrating both stimulus points and outside knowledge with precise historical evidence."
      }
    }
  };
  
  const finalQuestions = [q4m, q12m];
  if (utilityQ) finalQuestions.push(utilityQ);
  if (interpQ) finalQuestions.push(interpQ);
  
  l.exam_practice = {
    title: "Edexcel GCSE (9–1) Paper 3 Exam Practice",
    tariff: "16 marks (Q1 Inference [4m] & Q2 Causal Explanation [12m])",
    questions: finalQuestions,
    stimulus: [
      {
        title: `Source A: ${wb.source_origin || 'Contemporary Archival Evidence'}`,
        caption: `Source A: ${wb.source_origin || 'Archival source'}`,
        content: wb.source_text || 'Contemporary historical extract.',
        provenance: wb.source_origin || 'Archival source'
      }
    ]
  };
  
  l.gcse_task = {
    title: "Edexcel GCSE (9–1) Paper 3 Section A Practice",
    tasks: [
      {
        type: "written",
        tariff: "Q1: Source Inference [4 marks]",
        text: q4m.question,
        model: m.q4m_model
      },
      {
        type: "written",
        tariff: "Q2: Causal Explanation [12 marks]",
        text: q12m.question,
        stimulus: wb.stimuli,
        model: m.q12m_model
      }
    ]
  };
  
  updatedLessons++;
});

// Save to data/usa.json
fs.writeFileSync(usaPath, JSON.stringify(d, null, 2), 'utf8');

// Save to public/data/usa.json
const pubPath = 'public/data/usa.json';
if (fs.existsSync(pubPath)) {
  fs.writeFileSync(pubPath, JSON.stringify(d, null, 2), 'utf8');
}

// Save to units/usa/data.js (ES module)
const unitJsPath = 'units/usa/data.js';
fs.writeFileSync(unitJsPath, 'export default ' + JSON.stringify(d, null, 2) + ';\n', 'utf8');

console.log(`✅ Successfully updated all ${updatedLessons} USA lessons with 1:1 workbook alignment!`);

