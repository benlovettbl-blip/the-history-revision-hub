const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dataJsPath = path.join(root, 'units', 'usa', 'data.js');
const pubDataJsPath = path.join(root, 'public', 'units', 'usa', 'data.js');

const raw = fs.readFileSync(dataJsPath, 'utf8');
const jsonStr = raw.replace(/^export\s+default\s+/, '').replace(/;?\s*$/, '');
const usaData = JSON.parse(jsonStr);

// Verified 3-video pathway map for all 16 USA 1954-1975 lessons
const usaVideoMap = {
  // L1: What was the position of Black Americans in the early 1950s?
  "lesson_1_1": [
    {
      type: "youtube",
      id: "rYynBR7heVQ",
      url: "https://www.youtube.com/watch?v=rYynBR7heVQ",
      title: "Jim Crow Laws and the Segregated South | Daily Dose Documentary",
      duration: "3 mins 09 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–03:09 | Lesson Phase: Starter Hook | Tone Alert: Archival footage examining Plessy v Ferguson (1896) 'Separate but Equal' doctrine, disenfranchisement through poll taxes and literacy tests, and violent enforcement by the KKK.",
      viewing_task: "[01:00] Recall: What legal doctrine was established by Plessy v Ferguson in 1896, and how did Southern states use it?\n[02:15] Mechanism: Identify two voting restrictions used in Mississippi and Alabama to disenfranchise Black citizens.",
      model_answer: "Plessy v Ferguson established the 'Separate but Equal' doctrine, giving constitutional protection for state-mandated racial segregation across public facilities. Southern states used racially discriminatory literacy tests administered arbitrarily by white registrars and regressive poll taxes to strip Black Americans of their 15th Amendment voting rights."
    },
    {
      type: "youtube",
      id: "SYiI7j6GW68",
      url: "https://www.youtube.com/watch?v=SYiI7j6GW68",
      title: "Emmett Till, Age 14, Abducted and Murdered | Voices of the Civil Rights Movement",
      duration: "3 mins 33 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–03:33 | Lesson Phase: Enquiry Depth | Tone Alert: Explores the abduction and lynching of Emmett Till in Money, Mississippi (August 1955), the all-white jury acquittal, and Mamie Till-Mobley's open-casket decision.",
      viewing_task: "[01:10] Evidence: Why did Mamie Till-Mobley insist on holding an open-casket funeral in Chicago for her murdered son?\n[02:45] Historical Significance: How did the acquittal of Roy Bryant and J.W. Milam galvanise the national Civil Rights movement?",
      model_answer: "Mamie Till-Mobley insisted on an open-casket funeral so the world could witness the horrifying brutality of Southern white supremacist lynching, drawing 50,000 mourners and global press coverage. The rapid acquittal of Till's self-confessed killers by an all-white male jury exposed the complete lack of justice in Southern courts, inspiring a new generation of activists to demand federal intervention."
    },
    {
      type: "youtube",
      id: "rkQi6GBwmSA",
      url: "https://www.youtube.com/watch?v=rkQi6GBwmSA",
      title: "Till (2022) | Official Trailer | MGM Studios",
      duration: "2 mins 30 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:30 | Lesson Phase: Cinematic Dramatization | Tone Alert: Powerful cinematic trailer focusing on Mamie Till-Mobley's transformation into an international civil rights advocate.",
      viewing_task: "[00:50] Perspective: How does the film portray the stark contrast between Black life in Chicago versus the dangers of Jim Crow Mississippi?\n[01:45] Disciplinary Question: How did media publicity become a vital tactical weapon for civil rights leaders in the 1950s?",
      model_answer: "The film contrasts the relative freedom of Chicago with the deadly racial terror and required subservience in rural Mississippi. Civil rights leaders realized that Northern white public opinion could only be swayed when visual evidence of Southern racist violence was broadcast directly into American living rooms via national television and photojournalism."
    }
  ],

  // L2: How did developments in education challenge segregation (1954–57)?
  "lesson_1_2": [
    {
      type: "youtube",
      id: "auATIIhUXVU",
      url: "https://www.youtube.com/watch?v=auATIIhUXVU",
      title: "Civil Rights Movement: The Little Rock Nine | Homeschool History",
      duration: "1 min 43 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–01:43 | Lesson Phase: Starter Hook | Tone Alert: Concise animated summary of the 1957 crisis at Central High School in Little Rock, Arkansas.",
      viewing_task: "[00:40] Conflict: Why did Arkansas Governor Orval Faubus deploy the state National Guard to Central High School in September 1957?\n[01:15] Constitutional Power: How did President Dwight D. Eisenhower intervene to enforce federal court desegregation orders?",
      model_answer: "Governor Faubus used the Arkansas National Guard to block nine Black students from entering Central High, defying federal court orders to win re-election votes from segregationists. President Eisenhower federalized the Arkansas National Guard and dispatched 1,000 troops of the 101st Airborne Division to escort and protect the Little Rock Nine, demonstrating that states could not defy federal law."
    },
    {
      type: "youtube",
      id: "jRYK4RWyUAo",
      url: "https://www.youtube.com/watch?v=jRYK4RWyUAo",
      title: "Brown v. Board of Education Explained | Landmark Cases in a Nutshell",
      duration: "3 mins 46 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–03:46 | Lesson Phase: Legal History | Tone Alert: Analytical breakdown of the NAACP's legal strategy led by Thurgood Marshall and Chief Justice Earl Warren's unanimous 1954 ruling.",
      viewing_task: "[01:30] Legal Argument: What psychological and sociological evidence did Thurgood Marshall present to prove segregation harmed Black children?\n[02:50] The Ruling: What was Earl Warren's core constitutional declaration regarding separate educational facilities?",
      model_answer: "Marshall cited the 'doll tests' by psychologists Kenneth and Mamie Clark, proving that state-enforced segregation generated a permanent sense of inferiority in Black children that violated the 14th Amendment's Equal Protection Clause. Chief Justice Earl Warren declared unanimously that 'in the field of public education, the doctrine of separate but equal has no place; separate educational facilities are inherently unequal.'"
    },
    {
      type: "youtube",
      id: "Y4jBXQM7mIk",
      url: "https://www.youtube.com/watch?v=Y4jBXQM7mIk",
      title: "Separate But Equal: The Little Rock Nine | Dramatic Recreation",
      duration: "2 mins 40 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:40 | Lesson Phase: Eye-Witness Drama | Tone Alert: Dramatic reconstruction of Elizabeth Eckford walking alone through an abusive, screaming mob outside Central High.",
      viewing_task: "[01:00] Emotional Context: What dangers faced Elizabeth Eckford when she arrived alone at Central High on 4 September 1957?\n[02:10] Consequence: How did Governor Faubus react in 1958 during the 'Lost Year' to resist integrated schooling?",
      model_answer: "Eckford did not receive the phone call coordinating the group arrival and walked into an enraged mob of hundreds of white adults spitting, shouting lynch threats, and barring her path. In 1958, rather than integrate, Faubus closed all four Little Rock public high schools for an entire academic year (the 'Lost Year'), forcing families to seek private or correspondence tuition."
    }
  ],

  // L3: How did the Montgomery Bus Boycott happen, and why did it succeed?
  "lesson_1_3": [
    {
      type: "youtube",
      id: "_omQ841ZAWg",
      url: "https://www.youtube.com/watch?v=_omQ841ZAWg",
      title: "The Montgomery Bus Boycott of 1955 | Black American Heroes | HISTORY",
      duration: "5 mins 33 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Starter Hook | Tone Alert: Comprehensive documentary tracking Rosa Parks' arrest on 1 December 1955 and the 381-day community boycott.",
      viewing_task: "[01:15] Action: Why was Rosa Parks' refusal to surrender her seat on a Montgomery bus a planned act of defiance rather than mere physical tiredness?\n[03:40] Logistics: How did the Montgomery Improvement Association (MIA) organize transportation to sustain the 381-day boycott?",
      model_answer: "Rosa Parks was an experienced NAACP secretary who had attended training at the Highlander Folk School; she and local leaders deliberately chose her arrest as an unblemished test case to challenge bus segregation in federal courts. The MIA organized a sophisticated church-funded carpool system with over 300 private vehicles and 40 pickup stations, while Black-owned taxi companies offered reduced 10-cent fares."
    },
    {
      type: "youtube",
      id: "ylOpide9dus",
      url: "https://www.youtube.com/watch?v=ylOpide9dus",
      title: "The Montgomery Bus Boycott: Crash Course Black American History #35 | CrashCourse",
      duration: "12 mins 44 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–06:00 | Lesson Phase: Enquiry Depth | Tone Alert: Analytical evaluation of Jo Ann Robinson, the Women's Political Council, Martin Luther King Jr's non-violent philosophy, and Browder v Gayle.",
      viewing_task: "[02:20] Leadership: How did Jo Ann Robinson and the Women's Political Council initiate the boycott within 24 hours of Parks' arrest?\n[05:10] Legal Victory: What was the Supreme Court's ruling in Browder v Gayle (November 1956)?",
      model_answer: "Robinson and university volunteers mimeographed 35,000 leaflets overnight distributing them to Black schools and churches, calling for a one-day strike that proved 90% effective and launched the sustained boycott. In Browder v Gayle, the Supreme Court affirmed that segregation on state and municipal public buses was unconstitutional under the 14th Amendment, forcing Montgomery to desegregate on 20 December 1956."
    },
    {
      type: "youtube",
      id: "5y8DZUShVis",
      url: "https://www.youtube.com/watch?v=5y8DZUShVis",
      title: "Boycott (2001) | HBO Dramatic Trailer",
      duration: "2 mins 15 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:15 | Lesson Phase: Leadership Study | Tone Alert: Jeffrey Wright's portrayal of a 26-year-old Martin Luther King Jr emerging as leader of the MIA.",
      viewing_task: "[00:50] Character Focus: Why was young newcomer MLK chosen to lead the Montgomery Improvement Association?\n[01:40] Philosophy: What core Christian and Gandhian principles guided King's doctrine of non-violent direct action?",
      model_answer: "King was chosen because as a newly arrived 26-year-old pastor at Dexter Avenue Baptist Church, he had not been compromised by existing political rivalries among Montgomery's veteran Black leadership. King blended Christian agape love ('turn the other cheek') with Mahatma Gandhi's satyagraha (soul-force), teaching that moral non-violence would shame oppressors and win national sympathy."
    }
  ],

  // L4: Why did white people in the South resist integration, and how did they do it?
  "lesson_1_4": [
    {
      type: "youtube",
      id: "2vxRVCj9Unc",
      url: "https://www.youtube.com/watch?v=2vxRVCj9Unc",
      title: "The Civil Rights Act of 1957: Support, Filibuster and Opposition | Wise Society",
      duration: "7 mins 24 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Starter Hook | Tone Alert: Explores the passage of the first civil rights legislation since Reconstruction and Strom Thurmond's 24-hour filibuster.",
      viewing_task: "[01:45] Congressional Obstruction: How did Southern 'Dixiecrat' senators use the Senate filibuster to delay and dilute the 1957 Civil Rights Bill?\n[04:10] Assessment: Why was the 1957 Act considered largely toothless in practice despite its symbolic significance?",
      model_answer: "Senator Strom Thurmond staged a record-breaking 24-hour, 18-minute filibuster, and Southern senators forced amendments requiring all-white Southern juries to try election officials accused of voter denial. The Act proved largely ineffective because white registrars easily bypassed federal voting monitors, adding only 3% more Black registered voters across the South by 1960."
    },
    {
      type: "youtube",
      id: "S64zRnnn4Po",
      url: "https://www.youtube.com/watch?v=S64zRnnn4Po",
      title: "Civil Rights and the 1950s: Crash Course US History #39 | CrashCourse",
      duration: "11 mins 58 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–06:30 | Lesson Phase: Disciplinary Analysis | Tone Alert: High-level overview of the 'Southern Manifesto' (1956), White Citizens' Councils, and economic intimidation.",
      viewing_task: "[02:30] Southern Manifesto: What declaration did 101 Southern congressmen sign in 1956 pledging resistance to Supreme Court desegregation rulings?\n[05:20] Economic Retaliation: How did White Citizens' Councils use financial weapons against Black civil rights activists?",
      model_answer: "In the 1956 Southern Manifesto, 101 Southern congressmen denounced the Brown ruling as a 'clear abuse of judicial power' and pledged to use 'all lawful means' to resist integration. White Citizens' Councils used economic terrorism: firing Black employees who signed school petitions, evicting tenant farmers, calling in bank mortgages, and cutting off credit lines for Black businesses."
    },
    {
      type: "youtube",
      id: "6WuoiR0I8Es",
      url: "https://www.youtube.com/watch?v=6WuoiR0I8Es",
      title: "Mississippi Burning (1988) | Official Feature Trailer",
      duration: "2 mins 20 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:20 | Lesson Phase: Racial Terror in the Deep South | Tone Alert: Dramatic thriller examining the violent grip of the Ku Klux Klan and local law enforcement complicity.",
      viewing_task: "[00:50] Tone & Setting: How does the film capture the code of silence and intimidation surrounding Klan violence in rural Mississippi?\n[01:40] Law Enforcement: Why were federal FBI agents required to intervene against local sheriffs and police deputies?",
      model_answer: "The film illustrates how the Ku Klux Klan operated with complete impunity through terrifying cross-burnings, beatings, and murders protected by a wall of white silence. Local law enforcement officers and sheriffs were often active Klan members or sympathizers, making local prosecution of racial terror crimes impossible without federal intervention."
    }
  ],

  // L5: How did peaceful protests (like sit-ins and Freedom Rides) force the government to act?
  "lesson_2_1": [
    {
      type: "youtube",
      id: "1zBY6gkpbTg",
      url: "https://www.youtube.com/watch?v=1zBY6gkpbTg",
      title: "The Freedom Riders History | Smithsonian Magazine",
      duration: "2 mins 13 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–02:13 | Lesson Phase: Starter Hook | Tone Alert: Overview of the May 1961 CORE bus rides testing the desegregation of interstate travel.",
      viewing_task: "[00:45] Strategic Aim: What Supreme Court ruling (Boynton v Virginia, 1960) did CORE Freedom Riders travel South to test?\n[01:30] Federal Action: How did Attorney General Robert F. Kennedy eventually respond to protect the riders?",
      model_answer: "The Freedom Riders sought to test whether Southern states were obeying the Supreme Court's Boynton v Virginia ruling, which banned racial segregation in interstate buses and terminal facilities. Attorney General Robert Kennedy dispatched 400 federal marshals to protect the riders and petitioned the Interstate Commerce Commission (ICC) to enforce complete desegregation on all interstate bus lines by November 1961."
    },
    {
      type: "youtube",
      id: "F624q1jBd0Y",
      url: "https://www.youtube.com/watch?v=F624q1jBd0Y",
      title: "Student Civil Rights Activism: Crash Course Black American History #37 | CrashCourse",
      duration: "11 mins 53 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–06:00 | Lesson Phase: Youth Mobilization | Tone Alert: Detailed breakdown of the Greensboro lunch counter sit-ins (February 1960) and the creation of SNCC.",
      viewing_task: "[01:50] Greensboro Four: How did four North Carolina A&T college students ignite a nationwide sit-in movement on 1 February 1960?\n[04:30] SNCC: What role did activist Ella Baker play in establishing the Student Nonviolent Coordinating Committee (SNCC)?",
      model_answer: "Four Black students sat at Woolworth's whites-only lunch counter and politely refused to leave after being denied service; within days, hundreds of students joined the sit-in, spreading to 55 cities in 13 states. Ella Baker organized the Raleigh conference for student demonstrators, advising them to remain independent from older groups like the SCLC to form SNCC and maintain radical, frontline grassroots protest."
    },
    {
      type: "youtube",
      id: "r1EDOL9II0s",
      url: "https://www.youtube.com/watch?v=r1EDOL9II0s",
      title: "AMERICAN EXPERIENCE: Freedom Riders: The Young Witness | PBS",
      duration: "5 mins 00 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Eye-Witness Testimony | Tone Alert: Chilling eye-witness account of the Mother's Day firebombing of the Greyhound bus outside Anniston, Alabama (14 May 1961).",
      viewing_task: "[01:30] Anniston Ambush: What happened when the Greyhound bus arrived outside Anniston, Alabama on 14 May 1961?\n[03:45] Personal Testimony: How does eyewitness Janie Forsyth McKinney describe bringing water to the choking, bloodied passengers?",
      model_answer: "A Ku Klux Klan mob armed with iron pipes and axes slashed the bus tyres, chased it outside town, smashed its windows, and threw an incendiary firebomb inside while barricading the doors to burn the riders alive. Twelve-year-old Janie Forsyth McKinney bravely walked into the violent mob with a pitcher of water and cups to wash the burning eyes and wounds of the escaping, choking passengers."
    }
  ],

  // L6: How did protests in Birmingham and Selma lead to the Civil and Voting Rights Acts?
  "lesson_2_2": [
    {
      type: "youtube",
      id: "TLberHUJgHY",
      url: "https://www.youtube.com/watch?v=TLberHUJgHY",
      title: "The Fight Against Segregation in Birmingham | Black American Heroes | HISTORY",
      duration: "3 mins 47 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–03:47 | Lesson Phase: Starter Hook | Tone Alert: Explores Project C (Confrontation) in Birmingham, Alabama (May 1963) and Eugene 'Bull' Connor's violent response.",
      viewing_task: "[01:10] Project C: Why did King and the SCLC choose Birmingham, Alabama as the target for non-violent direct action in spring 1963?\n[02:40] Bull Connor: What brutal methods did Police Commissioner Bull Connor unleash against student marchers in the Children's Crusade?",
      model_answer: "Birmingham was recognized as America's most thoroughly segregated and violent city ('Bombingham'); King knew that challenging the notorious segregationist Bull Connor would provoke dramatic media confrontations. Connor unleashed snarling police attack dogs and directed high-pressure 100-pound firehoses capable of ripping bark off trees directly at singing schoolchildren, horrifying international audiences."
    },
    {
      type: "youtube",
      id: "Vd6D64Ai49I",
      url: "https://www.youtube.com/watch?v=Vd6D64Ai49I",
      title: "The Story of Bloody Sunday | Black American Heroes | HISTORY",
      duration: "4 mins 14 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–04:14 | Lesson Phase: Enquiry Depth | Tone Alert: Focuses on the 7 March 1965 march from Selma to Montgomery and the assault on the Edmund Pettus Bridge.",
      viewing_task: "[01:15] Selma Voting: Why were only 383 Black citizens registered to vote out of 15,000 eligible adults in Dallas County, Alabama in 1965?\n[02:50] Edmund Pettus Bridge: What happened when 600 peaceful marchers crossed the bridge on 'Bloody Sunday'?",
      model_answer: "Local registrars required Black applicants to answer absurdly impossible constitutional questions and operated registration offices for only two days a month under Sheriff Jim Clark's intimidation. On 'Bloody Sunday', Alabama State Troopers on horseback and possemen armed with tear gas, billy clubs, and bullwhips brutally charged and beat the peaceful marchers on live television, fracturing John Lewis's skull."
    },
    {
      type: "youtube",
      id: "x6t7vVTxaic",
      url: "https://www.youtube.com/watch?v=x6t7vVTxaic",
      title: "Selma (2014, dir. Ava DuVernay) Theatrical Trailer | Paramount Pictures",
      duration: "2 mins 32 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:32 | Lesson Phase: Cinematic Turning Point | Tone Alert: Academy Award-winning portrayal of MLK's political maneuvering with President Lyndon B. Johnson leading to the Voting Rights Act of 1965.",
      viewing_task: "[00:55] Political Pressure: How did the national outrage over Selma force President Lyndon B. Johnson to address Congress in March 1965?\n[01:50] Legislative Milestone: What core protections did the Voting Rights Act of 1965 establish for minority voters?",
      model_answer: "President Johnson delivered a historic televised joint session address adopting the movement's slogan 'And we shall overcome' and demanding immediate voting legislation. The Voting Rights Act of 1965 outlawed all literacy tests, authorized federal examiners to register voters in recalcitrant Southern counties, and required states with histories of discrimination to obtain federal preclearance before changing voting laws."
    }
  ],

  // L7: What was the Black Power movement, and how did it differ from non-violent protests?
  "lesson_2_3": [
    {
      type: "youtube",
      id: "6UBOl5Yq-ms",
      url: "https://www.youtube.com/watch?v=6UBOl5Yq-ms",
      title: "The Birth of the Black Panthers | Black History in Two Minutes",
      duration: "2 mins 54 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–02:54 | Lesson Phase: Starter Hook | Tone Alert: Explores Huey P. Newton and Bobby Seale founding the Black Panther Party for Self-Defense in Oakland, California (1966).",
      viewing_task: "[00:50] Armed Self-Defense: What was the primary motivation behind Huey Newton and Bobby Seale carrying loaded shotguns to monitor Oakland police patrols?\n[01:45] Survival Programs: What community services did the Black Panthers provide beyond their militant public image?",
      model_answer: "The Panthers armed themselves under California open-carry law to follow police cars and protect Black citizens from chronic police brutality and unlawful harassment. Beyond their military uniforms, the Panthers ran over 60 community survival programs, most famously the Free Breakfast for Children Program which fed tens of thousands of impoverished urban youth daily."
    },
    {
      type: "youtube",
      id: "8woU9Rq0cPI",
      url: "https://www.youtube.com/watch?v=8woU9Rq0cPI",
      title: "Malcolm X and the Rise of Black Power: Crash Course Black American History #38 | CrashCourse",
      duration: "12 mins 17 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–06:00 | Lesson Phase: Ideological Divergence | Tone Alert: Contrasts Malcolm X's philosophy of Black nationalism and self-defense ('by any means necessary') with King's non-violent integrationism.",
      viewing_task: "[02:15] Nation of Islam: What core religious and separatist beliefs did Malcolm X preach as spokesman for the Nation of Islam?\n[05:10] Slogan 'Black Power': How did Stokely Carmichael's declaration of 'Black Power' in Greenwood, Mississippi (June 1966) fracture the civil rights alliance?",
      model_answer: "Malcolm X preached Black pride, economic self-sufficiency, and racial separation, rejecting integration into what he described as a corrupt, white supremacist society and asserting the constitutional right to self-defense against violence. Carmichael's cry of 'Black Power' rejected King's non-violent moral pleading, expelling white members from SNCC and advocating Black political and economic self-determination, alienating moderate white allies."
    },
    {
      type: "youtube",
      id: "sx4sEvhYeVE",
      url: "https://www.youtube.com/watch?v=sx4sEvhYeVE",
      title: "Malcolm X (1992) | Official Movie Trailer | Spike Lee / Denzel Washington",
      duration: "2 mins 45 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:45 | Lesson Phase: Character Study | Tone Alert: Dramatic portrayal of Malcolm X's intellectual transformation following his 1964 pilgrimage to Mecca (Hajj).",
      viewing_task: "[01:00] Transformation: How did Malcolm X's pilgrimage to Mecca alter his perspective on race and universal human rights?\n[02:10] Legacy: How did the 1968 Mexico City Olympic protest by Tommie Smith and John Carlos reflect the global impact of Black Power?",
      model_answer: "In Mecca, Malcolm prayed alongside white-skinned, blue-eyed Muslims, realizing that orthodox Islam fostered genuine racial brotherhood; he broke with Elijah Muhammad and embraced universal human rights before his 1965 assassination. At the 1968 Olympics, Smith and Carlos raised black-gloved fists on the medal podium during the US anthem, creating an enduring international symbol of Black Power against racial injustice and poverty."
    }
  ],

  // L8: Why did riots break out in American cities between 1965 and 1968?
  "lesson_2_4": [
    {
      type: "youtube",
      id: "6dlmBco7zsc",
      url: "https://www.youtube.com/watch?v=6dlmBco7zsc",
      title: "The Watts Riots | Voices of the Civil Rights Movement",
      duration: "3 mins 11 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–03:11 | Lesson Phase: Starter Hook | Tone Alert: Archival footage of the six-day uprising in Los Angeles in August 1965 sparked by the roadside arrest of Marquette Frye.",
      viewing_task: "[00:55] Trigger: What traffic stop incident sparked the explosion of unrest in the Watts neighbourhood of Los Angeles on 11 August 1965?\n[02:10] Human Cost: What was the toll of the six days of rioting in terms of casualties, arrests, and property damage?",
      model_answer: "The riot was sparked when white California Highway Patrol officers violently arrested 21-year-old Marquette Frye for suspected drunk driving in front of a growing, angry crowd on a sweltering summer evening. The six days of unrest resulted in 34 deaths, over 1,000 injuries, nearly 4,000 arrests, and over $40 million in property destruction, requiring 14,000 National Guardsmen to quell."
    },
    {
      type: "youtube",
      id: "OX33xb8kbpA",
      url: "https://www.youtube.com/watch?v=OX33xb8kbpA",
      title: "Detroit Riots & Kerner Commission | TheLBJLibrary",
      duration: "4 mins 20 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–04:20 | Lesson Phase: Official Inquiry | Tone Alert: Examines President Johnson dispatching the 82nd and 101st Airborne Divisions to Detroit (July 1967) and establishing the Kerner Commission.",
      viewing_task: "[01:30] Detroit Crisis: Why did the police raid on an unlicensed after-hours drinking club ('blind pig') trigger the deadliest urban riot of the 1960s?\n[03:15] Kerner Finding: What was the famous warning issued by the Kerner Commission regarding American society in 1968?",
      model_answer: "The raid on a party celebrating the return of two Black Vietnam veterans sparked fury among residents suffering from decades of police brutality, job discrimination, and slum housing; 43 people died as tanks rolled through Detroit streets. The Kerner Commission famously concluded that 'our nation is moving toward two societies, one black, one white—separate and unequal,' identifying pervasive white racism and ghetto poverty as the root cause."
    },
    {
      type: "youtube",
      id: "HFeWsDpy9y0",
      url: "https://www.youtube.com/watch?v=HFeWsDpy9y0",
      title: "Detroit (2017) | Official Movie Trailer | Kathryn Bigelow",
      duration: "2 mins 25 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:25 | Lesson Phase: Cinematic Trauma | Tone Alert: Visceral recreation of the Algiers Motel incident during the 1967 Detroit riot, showing rogue police interrogating unarmed Black youths.",
      viewing_task: "[01:00] Police Abuse: How does the trailer convey the lawless terror inflicted by rogue officers during the Algiers Motel incident?\n[01:50] King Assassination: How did the assassination of Martin Luther King Jr on 4 April 1968 ignite riots in over 100 American cities?",
      model_answer: "The film recreates how Detroit police officers and guardsmen subjected innocent Black guests to mock executions and brutal beatings, ultimately murdering three unarmed teenagers. King's assassination in Memphis shattered faith in non-violence; within hours, despairing Black communities erupted in violent rebellions across 125 cities, including Washington D.C., Baltimore, and Chicago."
    }
  ],

  // L9: Why did the US support the unpopular government of Ngo Dinh Diem in South Vietnam?
  "lesson_3_1": [
    {
      type: "youtube",
      id: "44cnzhzcYjs",
      url: "https://www.youtube.com/watch?v=44cnzhzcYjs",
      title: "Drawn History: What is Domino Theory? | HISTORY",
      duration: "2 mins 38 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–02:38 | Lesson Phase: Starter Hook | Tone Alert: Animated explainer of President Eisenhower's geopolitical concept that the fall of Indochina would cause Southeast Asian nations to topple like dominos.",
      viewing_task: "[00:50] The Analogy: Explain Eisenhower's 'Domino Theory' regarding the spread of communism in Southeast Asia.\n[01:50] Geneva Accords: Why did the US and Ngo Dinh Diem refuse to hold the nationwide democratic elections scheduled for 1956?",
      model_answer: "Eisenhower argued that if South Vietnam fell to communism, neighboring nations (Laos, Cambodia, Thailand, Burma) would inevitably collapse in sequence like falling dominoes under Chinese and Soviet influence. The US and Diem blocked the 1956 elections because intelligence confirmed that North Vietnamese communist leader Ho Chi Minh would win over 80% of the nationwide popular vote."
    },
    {
      type: "youtube",
      id: "028fwjzsAOc",
      url: "https://www.youtube.com/watch?v=028fwjzsAOc",
      title: "The Cold War: Diem in South Vietnam - Strategic Hamlets & Assassination | I'm Stuck GCSE History",
      duration: "6 mins 45 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Deep Governance Crisis | Tone Alert: Structured breakdown of Diem's Catholic nepotism, the unpopular Strategic Hamlet Program (1962), and Buddhist self-immolations.",
      viewing_task: "[02:00] Strategic Hamlets: Why did the Strategic Hamlet Program alienate South Vietnamese peasants and drive them into the arms of the Vietcong?\n[04:15] Buddhist Crisis: How did the self-immolation of monk Thich Quang Duc in June 1963 destroy Diem's international legitimacy?",
      model_answer: "Peasants were forcibly uprooted from ancestral villages and ancestral burial grounds to live behind barbed wire fortifications, while corrupt officials stole building funds; resentment drove peasants to support the Vietcong. Thich Quang Duc set himself on fire in a busy Saigon intersection to protest Diem's violent repression of Buddhism; Malcolm Browne's photograph shocked President Kennedy and convinced Washington that Diem had to be replaced."
    },
    {
      type: "youtube",
      id: "i2LdlqW26zc",
      url: "https://www.youtube.com/watch?v=i2LdlqW26zc",
      title: "The Quiet American (2002) | Official Trailer | Michael Caine",
      duration: "2 mins 18 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:18 | Lesson Phase: Geopolitical Fiction | Tone Alert: Adaptation of Graham Greene's novel exploring CIA operative Alden Pyle backing a 'Third Force' in Saigon in the early 1950s.",
      viewing_task: "[00:50] Character Conflict: How does the film contrast British cynical detachment with naive American interventionist idealism in Vietnam?\n[01:35] Historical Context: How did CIA involvement in South Vietnam set up the military coup against Diem in November 1963?",
      model_answer: "The film contrasts veteran journalist Thomas Fowler's understanding of Vietnamese anticolonial pride with CIA agent Alden Pyle's dangerous, naive belief that Western democracy could be engineered through military covert ops. In November 1963, with covert CIA backing, South Vietnamese generals assassinated Diem and his brother Nhu, leaving South Vietnam ruled by a revolving door of weak military juntas."
    }
  ],

  // L10: Why did the US send combat troops to Vietnam after the Gulf of Tonkin incident?
  "lesson_3_2": [
    {
      type: "youtube",
      id: "crALHjTiXbk",
      url: "https://www.youtube.com/watch?v=crALHjTiXbk",
      title: "The Gulf of Tonkin Incident (1964) | Simple History",
      duration: "3 mins 22 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–03:22 | Lesson Phase: Starter Hook | Tone Alert: Animated breakdown of the USS Maddox skirmish on 2 August and the disputed second incident on 4 August 1964.",
      viewing_task: "[01:10] The Skirmish: What occurred in the Gulf of Tonkin on 2 August 1964 between the USS Maddox and North Vietnamese torpedo boats?\n[02:25] The Mystery: What evidence later revealed that the alleged second attack on 4 August was likely a false sonar contact in stormy seas?",
      model_answer: "The destroyer USS Maddox, conducting electronic espionage while supporting South Vietnamese commando raids, clashed with three North Vietnamese torpedo boats, firing warning shots before damaging them. Declassified records revealed that the 'second attack' on 4 August never occurred: freak weather, nervous young sonar operators misinterpreting wave echoes, and Captain Herrick's own cables casting doubt were suppressed by the Pentagon."
    },
    {
      type: "youtube",
      id: "gMhx8R7IL8M",
      url: "https://www.youtube.com/watch?v=gMhx8R7IL8M",
      title: "The Gulf of Tonkin Resolution | HISTORY",
      duration: "4 mins 18 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–04:18 | Lesson Phase: Constitutional Transformation | Tone Alert: Examines President Johnson securing congressional approval to wage war without a formal declaration of war.",
      viewing_task: "[01:30] Congressional Blank Cheque: What extraordinary military powers did the Gulf of Tonkin Resolution grant President Lyndon B. Johnson?\n[03:10] Vote Count: How many members of Congress voted against the Tonkin Resolution in August 1964?",
      model_answer: "The Resolution gave Johnson constitutional authority 'to take all necessary measures to repel any armed attack against the forces of the United States and to prevent further aggression,' functioning as an undeclared declaration of war. Congress passed it near-unanimously: 416-0 in the House of Representatives and 88-2 in the Senate, with only Senators Wayne Morse and Ernest Gruening dissenting."
    },
    {
      type: "youtube",
      id: "R5gSxeiCBMY",
      url: "https://www.youtube.com/watch?v=R5gSxeiCBMY",
      title: "Operation Rolling Thunder (1965 - 68) | Simple History",
      duration: "10 mins 07 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Tactical Bombing Campaign | Tone Alert: Detailed tactical analysis of the 3-year sustained aerial bombardment of North Vietnam and the deployment of the first US combat troops at Da Nang.",
      viewing_task: "[01:45] Sustained Bombardment: What were the strategic objectives of Operation Rolling Thunder launched in March 1965?\n[04:20] Combat Troops: Why did General William Westmoreland demand the deployment of 3,500 US Marines to Da Nang in March 1965?",
      model_answer: "Operation Rolling Thunder aimed to destroy North Vietnam's transport infrastructure, interdict the Ho Chi Minh Trail, boost South Vietnamese morale, and force Hanoi to negotiate from weakness. General Westmoreland argued that South Vietnamese ARVN forces were incapable of defending the vital US airbase at Da Nang from Vietcong guerrilla mortar attacks, beginning the ground troop commitment that reached 536,000 troops by 1968."
    }
  ],

  // L11: Why did US military tactics (like bombing and search & destroy) fail to defeat the Vietcong?
  "lesson_3_3": [
    {
      type: "youtube",
      id: "huRWshoW7T8",
      url: "https://www.youtube.com/watch?v=huRWshoW7T8",
      title: "Vietcong Guerrilla (Vietnam War) | Simple History",
      duration: "3 mins 35 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–03:35 | Lesson Phase: Starter Hook | Tone Alert: Animated guide to Vietcong guerrilla tactics: camouflage, booby traps, hit-and-run ambushes, and blending with civilians.",
      viewing_task: "[01:00] Guerrilla Warfare: What rules of guerrilla combat laid down by Mao Zedong did the National Liberation Front (Vietcong) follow?\n[02:20] Deadly Traps: How did punji stick pits and tripwire grenades inflict severe psychological terror on American conscripts?",
      model_answer: "The Vietcong followed Mao's doctrine: 'The enemy advances, we retreat; the enemy camps, we harass; the enemy tires, we attack; the enemy retreats, we pursue,' avoiding large-scale set-piece battles. Punji traps (sharpened bamboo stakes smeared with human excrement) and toe-popper cartridge traps caused non-fatal, maiming injuries and gangrene, instilling constant fear and slowing American patrols to a crawl."
    },
    {
      type: "youtube",
      id: "XsLE6EtrvhM",
      url: "https://www.youtube.com/watch?v=XsLE6EtrvhM",
      title: "Viet Cong Tunnels and Traps - Platoon: The True Story | Discovery UK",
      duration: "4 mins 52 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–04:52 | Lesson Phase: Underground Warfare | Tone Alert: Documentary exploration of the 250-kilometre Cu Chi tunnel network outside Saigon and the hazardous missions of American 'Tunnel Rats'.",
      viewing_task: "[01:30] Subterranean Network: What facilities were housed inside the multi-level Cu Chi tunnel complexes?\n[03:40] Tunnel Rats: What extreme hazards faced volunteer 'Tunnel Rats' armed only with a flashlight and a .45 pistol?",
      model_answer: "The Cu Chi tunnels contained blast-proof command posts, field hospitals, weapons workshops, kitchens with smoke-dispersing baffles, and sleeping quarters, allowing thousands of guerrillas to survive beneath US bases. 'Tunnel Rats' crawled through pitch-black, narrow crawlways confronting booby-trapped trapdoors, venomous bamboo pit vipers, scorpions, and enemy soldiers waiting around blind corners."
    },
    {
      type: "youtube",
      id: "hGsyEkfjhQk",
      url: "https://www.youtube.com/watch?v=hGsyEkfjhQk",
      title: "Platoon (1986, dir. Oliver Stone) Theatrical Trailer | MGM",
      duration: "2 mins 18 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:18 | Lesson Phase: Conscript Experience | Tone Alert: Oliver Stone's Oscar-winning, semi-autobiographical depiction of grunt life, moral confusion, and jungle warfare in Vietnam.",
      viewing_task: "[00:50] Realism: How does Oliver Stone draw on his own combat experience as a US infantryman to convey the claustrophobic terror of jungle ambushes?\n[01:40] Chemical Weapons: Why did US forces deploy Agent Orange and napalm, and what devastating environmental consequences followed?",
      model_answer: "Stone strips away romanticized war heroism, portraying exhausted 19-year-old draftees battling mud, monsoons, and unseen enemies who vanished into the foliage. Operation Ranch Hand sprayed 20 million gallons of toxic defoliants like Agent Orange to strip forest canopies and destroy crops, poisoning water systems, causing cancer and birth defects, and alienating the civilian population."
    }
  ],

  // L12: What was Nixon's 'Vietnamization' policy, and did it achieve peace with honour?
  "lesson_3_4": [
    {
      type: "youtube",
      id: "JUzTdiaiHhQ",
      url: "https://www.youtube.com/watch?v=JUzTdiaiHhQ",
      title: "Why Did Kissinger Wage A Secret War On Cambodia? | American Experience | PBS",
      duration: "4 mins 28 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:28 | Lesson Phase: Starter Hook | Tone Alert: Explores Nixon and Henry Kissinger's clandestine 'Operation Menu' carpet-bombing of neutral Cambodia beginning March 1969.",
      viewing_task: "[01:15] Covert Action: Why did Nixon conceal the B-52 bombing of Cambodia from the American public and Congress for four years?\n[03:20] Geopolitical Blowback: How did the destabilization of Cambodia facilitate the rise of Pol Pot and the genocidal Khmer Rouge?",
      model_answer: "Nixon hid Operation Menu because bombing a neutral, sovereign nation without congressional approval violated the Constitution and international law, risking massive domestic outrage. The carpet-bombing killed an estimated 100,000 Cambodian peasants and destabilized Prince Sihanouk's government, driving traumatized rural populations into the extremist ranks of Pol Pot's Khmer Rouge."
    },
    {
      type: "youtube",
      id: "n4fzowrmYh8",
      url: "https://www.youtube.com/watch?v=n4fzowrmYh8",
      title: "The Cold War: Nixon in Vietnam - Vietnamisation, Cambodia and Laos | I'm Stuck GCSE History",
      duration: "7 mins 10 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Policy Transition | Tone Alert: Structured breakdown of the Nixon Doctrine, Vietnamization policy, the Madman Theory, and the ARVN invasion of Laos (1971).",
      viewing_task: "[01:45] Vietnamization: What was Nixon's strategy of 'Vietnamization', and how did it aim to achieve 'Peace with Honour'?\n[04:00] Operation Lam Son 719: What did the disastrous ARVN retreat from Laos in February 1971 reveal about South Vietnamese military capability?",
      model_answer: "Vietnamization aimed to withdraw American ground troops gradually while massively arming and training South Vietnam's ARVN forces to bear the burden of combat, backed by US air power. The rout in Laos demonstrated that despite billions in US military hardware, ARVN units could not survive conventional battles against North Vietnamese regulars without US ground advisors and tactical air cover."
    },
    {
      type: "youtube",
      id: "nrXlY6gzTTM",
      url: "https://www.youtube.com/watch?v=nrXlY6gzTTM",
      title: "The Post (2017) | Official Trailer | Steven Spielberg",
      duration: "2 mins 30 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:30 | Lesson Phase: Investigative Journalism | Tone Alert: Steven Spielberg's thriller on the 1971 publication of the leaked Pentagon Papers by Daniel Ellsberg.",
      viewing_task: "[01:00] Pentagon Papers: What shocking truths did the top-secret McNamara study leaked by Daniel Ellsberg reveal about four presidential administrations?\n[01:55] First Amendment: How did the Supreme Court ruling in New York Times v US strike a blow against government secrecy?",
      model_answer: "The Pentagon Papers proved that four consecutive presidents (Truman, Eisenhower, Kennedy, Johnson) had systematically lied to Congress and the public, knowing the war was unwinnable while expanding covert escalation. The Supreme Court rejected Nixon's attempt to use 'prior restraint' on national security grounds, ruling 6-3 that newspapers had a First Amendment right to publish truthful governmental records."
    }
  ],

  // L13: Why did so many Americans oppose the Vietnam War (like at My Lai and Kent State)?
  "lesson_4_1": [
    {
      type: "youtube",
      id: "ydo1TLuOHiY",
      url: "https://www.youtube.com/watch?v=ydo1TLuOHiY",
      title: "The Hero Who Stood Up to the My Lai Massacre (1968) | Simple History",
      duration: "3 mins 15 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–03:15 | Lesson Phase: Starter Hook | Tone Alert: Animated account of the 16 March 1968 My Lai massacre of over 500 unarmed Vietnamese civilians by Charlie Company and helicopter pilot Hugh Thompson's intervention.",
      viewing_task: "[01:10] The Massacre: What atrocities were committed by Lt. William Calley's soldiers in the hamlet of Son My (My Lai)?\n[02:25] The Intervention: How did warrant officer Hugh Thompson risk his life to confront American troops and rescue surviving villagers?",
      model_answer: "Charlie Company slaughtered between 347 and 504 unarmed old men, women, and infants, raping women and burning homes, despite discovering zero Vietcong weapons. Observation helicopter pilot Hugh Thompson landed his craft between Charlie Company soldiers and trapped Vietnamese civilians, ordering his gunners to fire on fellow US soldiers if they continued murdering civilians, and airlifted survivors to safety."
    },
    {
      type: "youtube",
      id: "9Pwro3vCUdU",
      url: "https://www.youtube.com/watch?v=9Pwro3vCUdU",
      title: "The Kent State Shootings, Explained | HISTORY",
      duration: "4 mins 12 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–04:12 | Lesson Phase: Domestic Tragedy | Tone Alert: Archival footage examining the 4 May 1970 Ohio National Guard shooting of student protesters demonstrating against the invasion of Cambodia.",
      viewing_task: "[01:20] Campus Outrage: Why did Nixon's announcement of the Cambodian Incursion on 30 April 1970 trigger student strikes across 400 universities?\n[02:50] The Tragedy: What occurred on 4 May 1970 when 28 Ohio National Guardsmen fired 67 rounds into a crowd of student demonstrators?",
      model_answer: "Nixon had promised he was ending the war through troop withdrawals; announcing the invasion of Cambodia appeared as an outright escalation, sparking massive student walkouts nationwide. Ohio National Guardsmen fired into unarmed crowds at Kent State University, killing four students (Allison Krause, Jeffrey Miller, Sandra Scheuer, William Schroeder) and wounding nine, triggering a nationwide student strike of four million youth."
    },
    {
      type: "youtube",
      id: "FVb6EdKDBfU",
      url: "https://www.youtube.com/watch?v=FVb6EdKDBfU",
      title: "The Trial of the Chicago 7 (2020) | Official Trailer | Netflix / Aaron Sorkin",
      duration: "2 mins 30 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:30 | Lesson Phase: Political Trial & Civil Disobedience | Tone Alert: Aaron Sorkin's courtroom drama depicting the federal trial of anti-war organizers following the riots outside the 1968 Chicago Democratic National Convention.",
      viewing_task: "[00:50] Chicago 1968: What caused the violent clashes between police and anti-war demonstrators outside the Democratic Convention in August 1968?\n[01:45] Cultural Divide: How did the trial symbolize the deep generational and political fissure dividing 1960s America?",
      model_answer: "Mayor Richard J. Daley ordered 12,000 police and 6,000 National Guardsmen to crack down on peaceful youth demonstrators; a federal report later condemned the bloody clashes as a 'police riot'. The prosecution of the Chicago 7 exposed the generational chasm between an entrenched, conservative establishment terrified of social revolution and an idealistic youth culture demanding an immediate end to an immoral war."
    }
  ],

  // L14: Why did some Americans support the Vietnam War and the 'Silent Majority'?
  "lesson_4_2": [
    {
      type: "youtube",
      id: "Hqz0i83Jqxg",
      url: "https://www.youtube.com/watch?v=Hqz0i83Jqxg",
      title: "Nixon's 'Great Silent Majority' | American Experience | PBS",
      duration: "4 mins 05 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:05 | Lesson Phase: Starter Hook | Tone Alert: Explores Richard Nixon's 3 November 1969 address calling on everyday, patriotic working-class Americans to reject anti-war protests.",
      viewing_task: "[01:25] Rhetoric: Whom did Nixon define as the 'Silent Majority', and how did he distinguish them from student demonstrators?\n[03:10] Political Strategy: How did Nixon's appeal consolidate working-class 'Hard Hat' voters behind the Republican presidency?",
      model_answer: "Nixon defined the Silent Majority as law-abiding, hardworking, patriotic citizens who paid taxes, went to church, and did not participate in street demonstrations or burn draft cards. Nixon tapped into deep resentment among middle- and working-class Americans who felt insulted by privileged college students protesting while working-class sons fought and died in uniform."
    },
    {
      type: "youtube",
      id: "CYjxP7un91U",
      url: "https://www.youtube.com/watch?v=CYjxP7un91U",
      title: "The 1970 Riot that Split America (Hard Hat Riot) | American Experience | PBS",
      duration: "6 mins 15 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Polarized Society | Tone Alert: Explores the 8 May 1970 'Hard Hat Riot' in Lower Manhattan where 200 construction workers attacked anti-war student demonstrators.",
      viewing_task: "[01:40] Lower Manhattan Clash: Why did construction workers charge student demonstrators protesting the Kent State shootings at Federal Hall?\n[04:00] Union Politics: How did Peter J. Brennan and union leaders turn labor patriotism into political support for Nixon?",
      model_answer: "Construction workers building the World Trade Center were enraged by students disrespecting the American flag and celebrating Vietcong flags just days after four students died at Kent State; they charged with helmets and steel pipes. Union leader Peter Brennan organized a 100,000-strong pro-war rally in New York and was invited to the White House by Nixon, cementing a historic realignment of blue-collar workers toward conservatism."
    },
    {
      type: "youtube",
      id: "OSajkR2JvJE",
      url: "https://www.youtube.com/watch?v=OSajkR2JvJE",
      title: "Nixon Asks for Support: The Great Silent Majority | Archival Broadcast",
      duration: "17 mins 10 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–04:30 | Lesson Phase: Primary Source Address | Tone Alert: Primary television broadcast of President Nixon speaking directly from the Oval Office on 3 November 1969.",
      viewing_task: "[01:30] Cold War Framing: How did Nixon argue that a precipitate American withdrawal from Vietnam would lead to a communist bloodbath?\n[03:45] National Pride: Analyze Nixon's famous closing plea: 'And so tonight—to you, the great silent majority of my fellow Americans—I ask for your support.'",
      model_answer: "Nixon argued that immediate withdrawal would result in the massacre of hundreds of thousands of innocent South Vietnamese and destroy international confidence in American military commitments worldwide. Nixon framed domestic protest as giving comfort to the enemy, declaring that America could only be defeated from within by losing its national resolve and moral courage."
    }
  ],

  // L15: How did the US exit Vietnam, and why did South Vietnam fall so quickly in 1975?
  "lesson_4_3": [
    {
      type: "youtube",
      id: "k3SfcSageUk",
      url: "https://www.youtube.com/watch?v=k3SfcSageUk",
      title: "Fall of Saigon - Vietnam War Ends - April 30, 1975 | NBCUniversal Archives",
      duration: "3 mins 48 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–03:48 | Lesson Phase: Starter Hook | Tone Alert: Dramatic archival news bulletin tracking North Vietnamese tanks crashing through the gates of Saigon's Presidential Palace.",
      viewing_task: "[01:10] The Collapse: What happened at 11:30 AM on 30 April 1975 when Tank 390 rammed the gates of the Independence Palace in Saigon?\n[02:40] Historical Significance: How did the immediate renaming of Saigon to Ho Chi Minh City symbolize the total conclusion of thirty years of war?",
      model_answer: "North Vietnamese Army Tank 390 smashed through the wrought-iron gates of the Independence Palace, and soldiers ran to the roof to hoist the Vietcong flag, forcing President Duong Van Minh to broadcast an unconditional surrender. The rapid renaming of Saigon to Ho Chi Minh City cemented the final triumph of Vietnamese communist nationalism and the complete reunification of Vietnam under Hanoi."
    },
    {
      type: "youtube",
      id: "mfBTw2UejO0",
      url: "https://www.youtube.com/watch?v=mfBTw2UejO0",
      title: "The Cold War: The Paris Peace Agreement 1973 & End of War | I'm Stuck GCSE History",
      duration: "7 mins 30 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Diplomatic Collapse | Tone Alert: Structured breakdown of the January 1973 Paris Peace Accords, the return of US POWs, and the 1975 Spring Offensive.",
      viewing_task: "[02:00] Paris Accords: What were the key terms negotiated by Henry Kissinger and Le Duc Tho in the January 1973 Paris Peace Accords?\n[04:45] Abandonment: Why did the US Congress refuse President Gerald Ford's desperate request for emergency military aid to save South Vietnam in April 1975?",
      model_answer: "The 1973 Paris Accords required all remaining US forces to withdraw within 60 days, North Vietnam to release American prisoners of war, and recognized the 17th parallel while crucially allowing 150,000 North Vietnamese troops to remain inside South Vietnam. Congress refused Ford's request because the American public was exhausted by a decade of futile casualties and Watergate had destroyed presidential authority, leading lawmakers to bar all direct military intervention."
    },
    {
      type: "youtube",
      id: "RTWX-BB4aAA",
      url: "https://www.youtube.com/watch?v=RTWX-BB4aAA",
      title: "Last Days in Vietnam (2014) | Official Trailer | PBS / Rory Kennedy",
      duration: "2 mins 20 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:20 | Lesson Phase: Humanitarian Extraction | Tone Alert: Academy Award-nominated documentary on 'Operation Frequent Wind'—the desperate helicopter evacuation from the US Embassy roof.",
      viewing_task: "[00:50] Chaos at the Embassy: What scenes of panic unfolded around the US Embassy in Saigon as North Vietnamese artillery shelled Tan Son Nhut airport?\n[01:40] Moral Dilemma: How did American military personnel push millions of dollars worth of Huey helicopters off aircraft carriers into the sea?",
      model_answer: "Thousands of terrified South Vietnamese who had collaborated with the US climbed over razor wire outside the embassy compound, pleading to be rescued before the arrival of communist forces. Flight decks on US aircraft carriers became so overcrowded that sailors pushed millions of dollars worth of empty Huey helicopters over the side into the ocean to clear deck landing space for incoming helicopters crammed with refugees."
    }
  ],

  // L16: What were the main reasons why the US failed to win the war in Vietnam?
  "lesson_4_4": [
    {
      type: "youtube",
      id: "XMLZamqVifg",
      url: "https://www.youtube.com/watch?v=XMLZamqVifg",
      title: "GCSE History Rapid Revision: Why Did the USA Fail in Vietnam? | MrClokeHistory",
      duration: "6 mins 12 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Starter Hook | Tone Alert: Essential 4-pillar exam revision summary: military tactics, guerrilla resilience, domestic opposition, and South Vietnamese political corruption.",
      viewing_task: "[01:40] Military Mismatch: Why was modern industrial firepower (B-52s, artillery, chemical defoliants) unable to defeat peasant guerrilla warfare?\n[04:10] Disciplinary Assessment: Explain why the war was described as lost in 'the living rooms of America' rather than on the battlefields of Vietnam.",
      model_answer: "Heavy US firepower relied on clear targets and front lines, but the Vietcong operated without fixed bases, melted into the civilian peasantry, used underground tunnels, and were sustained by external Soviet and Chinese aid. The Vietnam War was the first uncensored 'television war'; nightly graphic colour broadcasts of body bags, burning villages, and civilian casualties shattered public trust and made continued military commitment politically impossible."
    },
    {
      type: "youtube",
      id: "zAq6MrYgLr0",
      url: "https://www.youtube.com/watch?v=zAq6MrYgLr0",
      title: "How Did the U.S. Fail in Vietnam? | Animated History | The Armchair Historian",
      duration: "14 mins 22 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–07:00 | Lesson Phase: Comprehensive Strategic Synthesis | Tone Alert: Masterpiece animated tactical overview examining conscription morale, the draft lottery, body count metrics, and hearts-and-minds failure.",
      viewing_task: "[03:00] Conscript Morale: How did one-year tours of duty and the draft lottery contribute to combat fragging, drug abuse, and declining morale?\n[06:20] Body Count Metric: Why was General Westmoreland's reliance on the 'Body Count' as a metric of victory a fatal strategic delusion?",
      model_answer: "The one-year rotation meant soldiers lacked unit cohesion and experienced soldiers were constantly replaced by terrified raw recruits; by 1971, over 500 'fragging' incidents (assassinating officers with grenades) and widespread heroin addiction reflected complete breakdown of discipline. Westmoreland assumed high casualty counts would reach a 'crossover point' breaking enemy will, but North Vietnam viewed the conflict as an existential struggle for national liberation and was willing to absorb catastrophic casualties that no democratic Western government could endure."
    },
    {
      type: "youtube",
      id: "k_O7bD8Swxk",
      url: "https://www.youtube.com/watch?v=k_O7bD8Swxk",
      title: "The Fog of War (2003) | Official Trailer | Errol Morris / Robert McNamara",
      duration: "2 mins 10 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:10 | Lesson Phase: Historiographical Reflection | Tone Alert: Academy Award-winning interview with former Secretary of Defense Robert S. McNamara reflecting on the fatal hubris and miscalculations of the Vietnam War.",
      viewing_task: "[00:50] McNamara's Confession: What was Robert McNamara's primary admission regarding the nature of the Vietnamese conflict?\n[01:40] Historical Lesson: How does 'The Fog of War' illustrate the danger of applying cold mathematical systems to human ideological conflicts?",
      model_answer: "McNamara admitted that the US fundamentally misread the Vietnam War: Washington viewed it through a Cold War lens as a communist domino plot controlled by Moscow and Beijing, failing to see it was primarily a fierce, century-old nationalist struggle for self-determination. The film demonstrates that relying on computer simulations, tonnage of bombs dropped, and body counts blinded policymakers to intangible factors like nationalist morale, cultural identity, and human resilience."
    }
  ]
};

// Apply video arrays to usaData
let updatedCount = 0;
usaData.lessons.forEach(lesson => {
  if (usaVideoMap[lesson.id]) {
    lesson.video = usaVideoMap[lesson.id];
    updatedCount++;
    console.log(`Updated lesson ${lesson.id} with ${lesson.video.length} verified videos.`);
  } else {
    console.warn(`No video map for lesson ${lesson.id}`);
  }
});

// Write to units/usa/data.js
const serialized = `export default ${JSON.stringify(usaData, null, 2)};\n`;
fs.writeFileSync(dataJsPath, serialized, 'utf8');
console.log(`Wrote updated data to ${dataJsPath}`);

// Write to public/units/usa/data.js
fs.writeFileSync(pubDataJsPath, serialized, 'utf8');
console.log(`Wrote updated data to ${pubDataJsPath}`);

console.log(`Successfully recalibrated all ${updatedCount} USA 1954-1975 lessons!`);

