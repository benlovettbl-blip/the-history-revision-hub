const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const dataJsPath = path.join(ROOT, 'units', 'usa', 'data.js');

async function applyFixes() {
  console.log('Loading units/usa/data.js...');
  const fileUrl = 'file:///' + dataJsPath.replace(/\\/g, '/');
  const mod = await import(fileUrl);
  const data = mod.default;

  const lessons = data.lessons;
  console.log(`Loaded ${lessons.length} lessons.`);

  // Verified Source Fixes Dictionary keyed by source ID
  const sourceUpdates = {
    // Lesson 1
    "usa_lesson_1_1_d": {
      title: "Source D: From an Address by Thurgood Marshall, Chief Legal Counsel for the NAACP, to the National Convention (July 1953)",
      image: "/units/usa/assets/sources/thurgood_marshall_naacp_counsel.jpg",
      image_url: "/units/usa/assets/sources/thurgood_marshall_naacp_counsel.jpg",
      caption: "Thurgood Marshall (1908–1993), Chief Legal Counsel for the NAACP Legal Defense Fund, who formulated and argued the landmark Brown v. Board of Education case before the US Supreme Court (Library of Congress, c. 1953).",
      text: "We are not asking for charity. We are not asking for special treatment. We are asking for the rights guaranteed to us under the Constitution of the United States. We have established beyond question that 'separate but equal' is a myth, designed for one purpose and one purpose only—to perpetuate the badge of slavery upon an entire race of people. The time has come to destroy segregation at its very root.",
      attribution: "NAACP Annual Convention Records, Library of Congress Manuscript Division"
    },

    // Lesson 2
    "usa_lesson_1_2_d": {
      title: "Source A: From the Unanimous Supreme Court Opinion Delivered by Chief Justice Earl Warren in Brown v. Board of Education (17 May 1954)",
      image: "/units/usa/assets/sources/warren-court-1954.jpg",
      image_url: "/units/usa/assets/sources/warren-court-1954.jpg",
      caption: "The nine justices of the Warren Court in judicial robes (May 1954). Chief Justice Earl Warren (seated center) forged a unanimous 9–0 decision outlawing racial segregation in public schools.",
      text: "Does segregation of children in public schools solely on the basis of race, even though the physical facilities and other 'tangible' factors may be equal, deprive the children of the minority group of equal educational opportunities? We believe that it does... To separate them from others of similar age and qualifications solely because of their race generates a feeling of inferiority as to their status in the community that may affect their hearts and minds in a way unlikely ever to be undone... We conclude that in the field of public education the doctrine of 'separate but equal' has no place. Separate educational facilities are inherently unequal.",
      attribution: "United States Supreme Court, Brown v. Board of Education of Topeka, 347 U.S. 483 (1954)"
    },
    "usa_lesson_1_2_c": {
      title: "Source B: Declaration of Constitutional Principles (The Southern Manifesto) Signed by 101 Southern Congressmen (12 March 1956)",
      image: "/units/usa/assets/sources/southern_manifesto_congressional_record_1956.png",
      image_url: "/units/usa/assets/sources/southern_manifesto_congressional_record_1956.png",
      caption: "Facsimile of the 12 March 1956 Congressional Record publishing the 'Declaration of Constitutional Principles' (Southern Manifesto), signed by 101 Southern senators and representatives pledging 'Massive Resistance' to school desegregation.",
      text: "The unwarranted decision of the Supreme Court in the public school cases is now bearing the fruit always produced when men substitute naked power for established law... We regard the decisions of the Supreme Court as a clear abuse of judicial power. It climaxes a trend in the Federal judiciary undertaking to legislate, in derogation of the authority of Congress, and to encroach upon the reserved rights of the States and the people... We pledge ourselves to use all lawful means to bring about a reversal of this decision which is contrary to the Constitution and to prevent the use of force in its implementation.",
      attribution: "Congressional Record, 84th Congress, 2nd Session, Vol. 102, Part 4 (12 March 1956)"
    },
    "usa_lesson_1_2_e": {
      title: "Source C: Arkansas Governor Orval Faubus Televised Address Announcing the Deployment of the Arkansas National Guard (2 September 1957)",
      image: "/units/usa/assets/sources/orval_faubus_little_rock_1957.jpg",
      image_url: "/units/usa/assets/sources/orval_faubus_little_rock_1957.jpg",
      caption: "Arkansas Governor Orval Faubus speaking before press microphones backed by state police in Little Rock, September 1957, announcing troops would surround Central High School to block the Little Rock Nine.",
      text: "Now that a federal court has chosen for the first time to issue an order to forcibly integrate a high school, it becomes my duty as Governor of Arkansas to preserve the peace and public order. Evidence has been presented to me that violence and civil disorder are imminent if this integration is attempted tomorrow morning. Therefore, in the interest of public safety and tranquility, I have issued orders to Major General Sherman T. Clinger to place units of the Arkansas National Guard around Central High School. These troops are not there to enforce integration, but to maintain the status quo and prevent disorder.",
      attribution: "Office of the Governor of Arkansas, Executive Press Release and Televised Address (2 September 1957)"
    },

    // Lesson 3
    "usa_lesson_1_3_c": {
      title: "Source B: Mimeographed Boycott Leaflet Authored by Jo Ann Robinson and the Women's Political Council (2 December 1955)",
      image: "/units/usa/assets/sources/jo_ann_robinson_booking_photo_1956.jpg",
      image_url: "/units/usa/assets/sources/jo_ann_robinson_booking_photo_1956.jpg",
      caption: "Police arrest booking photograph of Jo Ann Robinson (1912–1992), President of the Women's Political Council (WPC), following the mass boycott indictments in Montgomery, Alabama (February 1956). Robinson spent the night of 1 December 1955 mimeographing 35,000 boycott leaflets following Rosa Parks' arrest.",
      text: "Another woman has been arrested and thrown into jail because she refused to get up out of her seat on the bus for a white person to sit down. It is the second time since the Claudette Colvin case that a Negro woman has been arrested for the same thing. This has to be stopped. Negroes have rights too, for if Negroes did not ride the buses, they could not operate. Three-fourths of the riders are Negroes, yet we are arrested, or have to stand over empty seats. If we do not do something to stop these arrests, they will continue. The next time it may be you, or your daughter, or mother. We are, therefore, asking every Negro to stay off the buses Monday in protest of the arrest and trial. Don't ride the buses to work, to town, to school, or anywhere on Monday.",
      attribution: "Women's Political Council (WPC) Mimeographed Flyer, Montgomery, Alabama (2 December 1955)"
    },
    "usa_lesson_1_3_d": {
      title: "Source E: From the Federal District Court Ruling in Browder v. Gayle Outlawing Bus Segregation (5 June 1956)",
      image: "/units/usa/assets/sources/rosa-parks-bus-1956.jpg",
      image_url: "/units/usa/assets/sources/rosa-parks-bus-1956.jpg",
      caption: "Rosa Parks seated near the front of a Montgomery city bus on 21 December 1956, the morning the Supreme Court mandate in Browder v. Gayle took effect, ending 381 days of boycott.",
      text: "We hold that the statutes and ordinances requiring segregation of the white and colored races on the motor buses of a common carrier of passengers in the City of Montgomery and the State of Alabama violate the due process and equal protection clauses of the Fourteenth Amendment to the Constitution of the United States. In the light of Brown v. Board of Education, the separate but equal doctrine can no longer be safely followed as a correct statement of the law. There is no rational basis for the segregation of races in public transportation.",
      attribution: "United States District Court for the Middle District of Alabama, Browder v. Gayle, 142 F. Supp. 707 (1956)"
    },

    // Lesson 4
    "usa_lesson_1_4_a": {
      title: "Source B: Front-Page Report from the Chicago Defender on the Lynching of Emmett Till (10 September 1955)",
      image: "/units/usa/assets/sources/emmett_till_open_casket_mamie_1955.jpg",
      image_url: "/units/usa/assets/sources/emmett_till_open_casket_mamie_1955.jpg",
      caption: "Mamie Till Bradley weeping over the open casket of her 14-year-old lynched son, Emmett Till, at Roberts Temple Church of God in Christ in Chicago (September 1955).",
      text: "NATION SHOCKED BY TERROR LYNCHING OF CHICAGO BOY IN MISSISSIPPI. The mutilated, bullet-shattered body of 14-year-old Emmett Till was returned to Chicago this week after being dragged from the Tallahatchie River with a 75-pound cotton gin fan barbed-wired to his neck. His grieving mother, Mrs. Mamie Till Bradley, insisted on an open-casket funeral so that 'all the world can see what they did to my boy.' More than 50,000 mourners filed past the casket at Roberts Temple, weeping and shuddering in horror at the savagery of Southern racism.",
      attribution: "The Chicago Defender, Front-Page Report (10 September 1955)"
    },
    "usa_lesson_1_4_d": {
      title: "Source D: Excerpt from the Civil Rights Act of 1957 Passed by the United States Congress (9 September 1957)",
      image: "/units/usa/assets/sources/eisenhower-little-rock-speech.jpg",
      image_url: "/units/usa/assets/sources/eisenhower-little-rock-speech.jpg",
      caption: "President Dwight D. Eisenhower addressing the American public from the Oval Office. On 9 September 1957, Eisenhower signed the Civil Rights Act of 1957, the first federal civil rights legislation since Reconstruction.",
      text: "An Act to provide means of further securing and protecting the civil rights of persons within the jurisdiction of the United States. Be it enacted by the Senate and House of Representatives: Section 101. There is created in the executive branch of the Government a Commission on Civil Rights... Section 131. Whenever any person has engaged or there are reasonable grounds to believe that any person is about to engage in any act or practice which would deprive any other person of any right or privilege secured by subsection (a) or (b) [the right to vote without racial discrimination], the Attorney General may institute for the United States a civil action for preventive relief, including an application for a permanent or temporary injunction.",
      attribution: "Public Law 85-315, 85th United States Congress, 71 Stat. 634 (9 September 1957)"
    },

    // Lesson 5
    "usa_lesson_2_1_e": {
      title: "Source E: Interstate Commerce Commission (ICC) Order Docket No. MC-C-3358 Outlawing Terminal Segregation (22 September 1961)",
      image: "/units/usa/assets/sources/icc_order_mc_c_3358_1961.png",
      image_url: "/units/usa/assets/sources/icc_order_mc_c_3358_1961.png",
      caption: "Facsimile of the official Interstate Commerce Commission Order Docket No. MC-C-3358 (22 September 1961), issued at the petition of Attorney General Robert F. Kennedy following the Freedom Rides.",
      text: "No motor common carrier of passengers subject to the Interstate Commerce Act shall, in the operation of passenger vehicles in interstate or foreign commerce, utilize or permit the use of any terminal facilities which are in any manner segregated on the basis of race, color, creed, or national origin. All signs, placards, or notices displaying designations such as 'White Waiting Room', 'Colored Waiting Room', or similarly segregating restrooms, dining counters, or waiting spaces are hereby declared unlawful and ordered removed from all interstate passenger terminals forthwith.",
      attribution: "Interstate Commerce Commission, Docket No. MC-C-3358, Washington, D.C. (22 September 1961)"
    },

    // Lesson 6
    "usa_lesson_2_2_a": {
      title: "Source B: Dr Martin Luther King Jr. Delivering His 'I Have a Dream' Address at the Lincoln Memorial (28 August 1963)",
      image: "/units/usa/assets/sources/mlk-dream-speech-1963.jpg",
      image_url: "/units/usa/assets/sources/mlk-dream-speech-1963.jpg",
      caption: "Dr. Martin Luther King Jr. addressing an estimated 250,000 civil rights demonstrators gathered at the Lincoln Memorial during the March on Washington for Jobs and Freedom, 28 August 1963.",
      text: "I say to you today, my friends, that in spite of the difficulties and frustrations of the moment, I still have a dream. It is a dream deeply rooted in the American dream. I have a dream that one day this nation will rise up and live out the true meaning of its creed: 'We hold these truths to be self-evident, that all men are created equal.' I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character. I have a dream today!",
      attribution: "Dr. Martin Luther King Jr., Address at the March on Washington for Jobs and Freedom, Washington D.C. (28 August 1963)"
    },
    "usa_lesson_2_2_c": {
      title: "Source C: Archival Photograph of President Lyndon B. Johnson Signing the Civil Rights Act of 1964 in the East Room of the White House (2 July 1964)",
      image: "/units/usa/assets/sources/lbj-mlk-signing-1964.jpg",
      image_url: "/units/usa/assets/sources/lbj-mlk-signing-1964.jpg",
      caption: "President Lyndon B. Johnson signs the historic Civil Rights Act of 1964 in the East Room of the White House, handing a ceremonial pen to Dr. Martin Luther King Jr. standing behind him (White House Photo Office, 2 July 1964).",
      text: "We believe that all men are created equal. Yet many are denied equal treatment. We believe that all men have certain unalienable rights. Yet many Americans do not enjoy those rights. We believe that all men are entitled to the blessings of liberty. Yet millions are being deprived of those blessings—not because of their own failures, but because of the color of their skin... Its purpose is to promote a more abiding commitment to freedom, a more pursuit of justice, and a deeper respect for human dignity. We have come now to a time of testing. We must not fail. Let us close the springs of racial poison.",
      attribution: "President Lyndon B. Johnson, Remarks upon Signing the Civil Rights Bill, East Room of the White House (2 July 1964)"
    },
    "usa_lesson_2_2_d": {
      title: "Source E: Archival Photograph of President Johnson Signing the Voting Rights Act of 1965 in the President's Room of the Capitol (6 August 1965)",
      image: "/units/usa/assets/sources/lbj-signing-voting-rights-1965.jpg",
      image_url: "/units/usa/assets/sources/lbj-signing-voting-rights-1965.jpg",
      caption: "President Lyndon B. Johnson signs the Voting Rights Act of 1965 in the President's Room of the Capitol in Washington D.C., with Rosa Parks, Martin Luther King Jr., and congressional leaders looking on (6 August 1965).",
      text: "This act flows from a clear and simple wrong. Millions of Americans are denied the right to vote because of their color. This law will strike away the last major shackle of those fierce and ancient bonds. Today the Negro citizen takes his place at the ballot box. The command of the Constitution is clear. No American may be denied the right to vote because of his race or color. Every American citizen must have an equal right to vote in every election where he is entitled to vote under the Constitution.",
      attribution: "President Lyndon B. Johnson, Remarks on the Signing of the Voting Rights Act, United States Capitol (6 August 1965)"
    },
    "usa_lesson_2_2_e": {
      title: "Source A: From Dr Martin Luther King Jr.'s 'Letter from Birmingham Jail' Written to Moderate White Clergymen (16 April 1963)",
      image: "/units/usa/assets/sources/birmingham-protests-dogs-1963.jpg",
      image_url: "/units/usa/assets/sources/birmingham-protests-dogs-1963.jpg",
      caption: "Police attack dogs deployed by Public Safety Commissioner Eugene 'Bull' Connor against civil rights demonstrators in Birmingham, Alabama, May 1963.",
      text: "We know through painful experience that freedom is never voluntarily given by the oppressor; it must be demanded by the oppressed. Frankly, I have yet to engage in a direct action campaign that was 'well timed' in the view of those who have not suffered unduly from the disease of segregation. For years now I have heard the word 'Wait!' It rings in the ear of every Negro with piercing familiarity. This 'Wait' has almost always meant 'Never.' We must come to see, with one of our distinguished jurists, that 'justice too long delayed is justice denied.'",
      attribution: "Dr Martin Luther King Jr., Letter from Birmingham Jail (16 April 1963)"
    },

    // Lesson 7
    "usa_lesson_2_3_c": {
      title: "Source B: From Malcolm X's Landmark Address 'The Ballot or the Bullet' Delivered in Cleveland, Ohio (3 April 1964)",
      image: "/units/usa/assets/sources/malcolm-x-speaking.jpg",
      image_url: "/units/usa/assets/sources/malcolm-x-speaking.jpg",
      caption: "Malcolm X speaking at a press conference in 1964, articulating the philosophy of Black nationalism, self-defense, and political accountability.",
      text: "It's got to be the ballot or the bullet. The ballot or the bullet. If you're afraid to use an expression like that, you should get on out of the country, you should get back in the cotton patch... In 1964, it's the ballot or the bullet. Don't be throwing out any ballots. A ballot is like a bullet. You don't throw your ballots until you see a target, and if that target is not within your reach, keep your ballot in your pocket... It's time for us to see that every time we look at our community, we see our people suffering from exploitation, poverty, and brutality. If the government is unwilling or unable to defend the lives and properties of Negroes, it's time for Negroes to defend themselves.",
      attribution: "Malcolm X, The Ballot or the Bullet, Cory Methodist Church, Cleveland, Ohio (3 April 1964)"
    },
    "usa_lesson_2_3_e": {
      title: "Source C: SNCC Chairman Stokely Carmichael Speaking in Mississippi During the March Against Fear (June 1966)",
      image: "/units/usa/assets/sources/stokely_carmichael_mississippi_1966.jpg",
      image_url: "/units/usa/assets/sources/stokely_carmichael_mississippi_1966.jpg",
      caption: "SNCC Chairman Stokely Carmichael addressing a mass civil rights rally in Greenwood, Mississippi during the June 1966 March Against Fear, where he first electrified the crowd with the cry 'Black Power!'.",
      text: "This is the twenty-seventh time that I've been arrested. I ain't going to jail no more! The only way we gonna stop them white men from whuppin' us is to take over. We been saying 'freedom' for six years and we ain't got nothin'. What we gonna start saying now is Black Power! We want Black Power! Every county where we are the majority, we want to elect Black sheriffs, Black mayors, and control our own communities!",
      attribution: "Stokely Carmichael, Address at Greenwood, Mississippi, March Against Fear (16 June 1966)"
    },
    "usa_lesson_2_3_d": {
      title: "Source D: Excerpt from the Black Panther Party for Self-Defense Ten-Point Platform and Program (15 October 1966)",
      image: "/units/usa/assets/sources/black-panthers-marching.jpg",
      image_url: "/units/usa/assets/sources/black-panthers-marching.jpg",
      caption: "Black Panther Party members drilling and standing in uniform with black leather jackets and berets in Oakland, California.",
      text: "1. We want freedom. We want power to determine the destiny of our Black Community.<br>2. We want full employment for our people.<br>3. We want an end to the robbery by the white man of our Black Community.<br>4. We want decent housing, fit for the shelter of human beings.<br>7. We want an immediate end to POLICE BRUTALITY and MURDER of Black people.<br>8. We want freedom for all Black men held in federal, state, county and city prisons and jails.<br>10. We want land, bread, housing, education, clothing, justice and peace.",
      attribution: "Huey P. Newton and Bobby Seale, Black Panther Party Platform and Program, Oakland, California (October 1966)"
    },

    // Lesson 8
    "usa_lesson_2_4_c": {
      title: "Source A: Statement of Watts Resident Tommy Jacquette on the Causes of the Los Angeles Uprising (August 1965)",
      image: "/units/usa/assets/sources/watts_riots_avalon_blvd_1965.jpg",
      image_url: "/units/usa/assets/sources/watts_riots_avalon_blvd_1965.jpg",
      caption: "Aerial view of Avalon Boulevard during the Watts Rebellion in Los Angeles, August 1965, with dense black smoke rising from burning commercial blocks.",
      text: "Since August 1965, where are we going? Where is Watts going? We didn't burn our own community; we burned the property of white slumlords and merchants who bled our people dry for generations. It was a revolt, not a riot. It was a rebellion of young Black people standing up and declaring: 'We are tired of being brutalized by the Los Angeles Police Department, tired of living in rat-infested tenements, and tired of being treated like second-class citizens in our own country.'",
      attribution: "Statement of Tommy Jacquette, Watts Community Organizer, Los Angeles (August 1965)"
    },
    "usa_lesson_2_4_a": {
      title: "Source B: From the Summary of the Report of the National Advisory Commission on Civil Disorders (The Kerner Commission) (29 February 1968)",
      image: "/units/usa/assets/sources/detroit-riot-guard-1967.jpg",
      image_url: "/units/usa/assets/sources/detroit-riot-guard-1967.jpg",
      caption: "Remains of burned-out residential structures in Detroit following the July 1967 rebellion, where 43 people died and paratroopers of the 82nd Airborne were deployed.",
      text: "This is our basic conclusion: Our nation is moving toward two societies, one black, one white—separate and unequal. Reaction to Detroit, Newark, and other riots of 1967 should not be planned on the basis of suppressing disorder, but on enriching the lives of the millions of ghetto dwellers who have lost hope. What white Americans have never fully understood—but what the Negro can never forget—is that white society is deeply implicated in the ghetto. White institutions created it, white institutions maintain it, and white society condones it.",
      attribution: "Report of the National Advisory Commission on Civil Disorders (Kerner Report), Washington, D.C. (March 1968)"
    },
    "usa_lesson_2_4_d": {
      title: "Source C: Senator Robert F. Kennedy Announcing the Assassination of Martin Luther King Jr. to a Crowd in Indianapolis (4 April 1968)",
      image: "/units/usa/assets/sources/mourners-mlk-assassination.jpg",
      image_url: "/units/usa/assets/sources/mourners-mlk-assassination.jpg",
      caption: "Soldiers of the 3rd Infantry Regiment and National Guardsmen patrol 7th Street NW in Washington D.C. as firefighters hose down buildings destroyed in the April 1968 uprisings following the assassination of Martin Luther King Jr.",
      text: "I have very sad news for all of you, and I think sad news for all of our fellow citizens, and people who love peace all over the world, and that is that Martin Luther King was shot and was killed tonight in Memphis, Tennessee. Martin Luther King dedicated his life to love and to justice between fellow human beings. For those of you who are black—considering the evidence evidently that there were white people who were responsible—you can be filled with bitterness, and with hatred, and a desire for revenge. But what we need in the United States is not division; what we need in the United States is not hatred; what we need in the United States is not violence and lawlessness, but is love, and wisdom, and compassion toward one another.",
      attribution: "Senator Robert F. Kennedy, Remarks on the Death of Martin Luther King Jr., Indianapolis, Indiana (4 April 1968)"
    },
    "usa_lesson_2_4_e": {
      title: "Source D: Excerpt from the Civil Rights Act of 1968 (The Fair Housing Act) Signed by President Johnson (11 April 1968)",
      image: "/units/usa/assets/sources/lbj-mlk-signing-1964.jpg",
      image_url: "/units/usa/assets/sources/lbj-mlk-signing-1964.jpg",
      caption: "President Lyndon B. Johnson signing federal civil rights legislation in the East Room of the White House. On 11 April 1968, amid national grief following MLK's assassination, Johnson signed the Civil Rights Act of 1968.",
      text: "An Act to prescribe penalties for certain acts of violence or intimidation, and for other purposes. Be it enacted by the Senate and House of Representatives: Section 804. It shall be unlawful—(a) To refuse to sell or rent after the making of a bona fide offer, or to refuse to negotiate for the sale or rental of, or otherwise make unavailable or deny, a dwelling to any person because of race, color, religion, or national origin. (b) To discriminate against any person in the terms, conditions, or privileges of sale or rental of a dwelling... because of race, color, religion, or national origin.",
      attribution: "Public Law 90-284, 90th United States Congress, 82 Stat. 73 (11 April 1968)"
    },

    // Lesson 9
    "usa_lesson_3_1_a": {
      title: "Source A: President Dwight D. Eisenhower Press Conference Formulating the 'Domino Theory' in Southeast Asia (7 April 1954)",
      image: "/units/usa/assets/sources/eisenhower-little-rock-speech.jpg",
      image_url: "/units/usa/assets/sources/eisenhower-little-rock-speech.jpg",
      caption: "President Dwight D. Eisenhower addressing news reporters during an executive press conference.",
      text: "You have, of course, both the specific and the general when you talk about such things. First of all, you have the specific value of a locality in its production of materials that the world needs, like rubber and tin. Then you have the possibility that many human beings pass under a dictatorship that is inimical to the free world. Finally, you have broader considerations that might follow what you would call the 'falling domino' principle. You have a row of dominoes set up, you knock over the first one, and what will happen to the last one is the certainty that it will go over very quickly. So you could have a beginning of a disintegration that would have the most profound influences.",
      attribution: "President Dwight D. Eisenhower, The President's News Conference (7 April 1954), Public Papers of the Presidents"
    },
    "usa_lesson_3_1_c": {
      title: "Source D: State Department Telegram No. 243 (Cable 243) Sent to US Ambassador Henry Cabot Lodge Jr. in Saigon (24 August 1963)",
      image: "/units/usa/assets/sources/state_dept_cable_243_1963.png",
      image_url: "/units/usa/assets/sources/state_dept_cable_243_1963.png",
      caption: "Facsimile of declassified State Department Telegram No. 243 (Cable 243), sent on 24 August 1963 authorizing Ambassador Henry Cabot Lodge Jr. to signal support for a military coup against Ngo Dinh Diem.",
      text: "It is now clear that whether military proposed martial law or whether Nhu tricked them into it, Nhu took advantage of it to smash Pagodas with police and Tung's Special Forces loyal to him. The US Government cannot tolerate situation in which power lies in Nhu's hands. Diem must be given chance remove Nhu and his coterie and replace them with best military and political personalities available. If Diem remains obdurate and refuses, then we must face the possibility that Diem himself cannot be preserved... You may also tell appropriate military commanders that we will give them direct support in any interim period of breakdown central government mechanism.",
      attribution: "Department of State, Outgoing Telegram No. 243, Top Secret, Declassified (24 August 1963)"
    },
    "usa_lesson_3_1_d": {
      title: "Source E: CIA Special National Intelligence Estimate: 'The Prospects for South Vietnam' (22 October 1963)",
      image: "/units/usa/assets/sources/cia_snie_53_63_south_vietnam.png",
      image_url: "/units/usa/assets/sources/cia_snie_53_63_south_vietnam.png",
      caption: "Facsimile of declassified CIA Special National Intelligence Estimate (SNIE 53-2-63), concluding that the Diem regime had lost all authority and that a military coup was imminent.",
      text: "We believe that the Buddhist crisis and the repression of students and intellectuals have alienated virtually all educated urban Vietnamese from the Diem regime. Respect for Ngo Dinh Diem has evaporated, and his brother Ngo Dinh Nhu is universally loathed and feared throughout Saigon. Concurrently, the military leadership in Saigon is divided, suspicious of Diem and Nhu, and increasingly convinced that victory over the Viet Cong is impossible under the present political leadership. A successful military coup against the Diem government appears increasingly likely within the coming weeks.",
      attribution: "Central Intelligence Agency, SNIE 53-2-63, Top Secret / Controlled Dissem (22 October 1963)"
    },

    // Lesson 10
    "usa_lesson_3_2_c": {
      title: "Source A: Declassified Flash Precedence Cable from Captain John Herrick of the USS Maddox (4 August 1964)",
      image: "/units/usa/assets/sources/uss-maddox.jpg",
      image_url: "/units/usa/assets/sources/uss-maddox.jpg",
      caption: "Declassified US Navy operational track chart showing the reported naval maneuvers and torpedo contacts of the USS Maddox (DD-731) in the Gulf of Tonkin (4 August 1964).",
      text: "Review of action makes many reported contacts and torpedoes fired appear doubtful. Freak weather effects on radar and overeager sonarmen may have accounted for many reports. No actual visual sightings by Maddox. Suggest complete evaluation before any further action taken.",
      attribution: "Commander, Task Group 72.1 (USS Maddox) to Commander Seventh Fleet, Flash Precedence Cable (4 August 1964)"
    },
    "usa_lesson_3_2_e": {
      title: "Source B: Official Statement Broadcast by Radio Hanoi Condemning US Fabrications in the Gulf of Tonkin (6 August 1964)",
      image: "/units/usa/assets/sources/ho-chi-minh-trail-bicycles.jpg",
      image_url: "/units/usa/assets/sources/ho-chi-minh-trail-bicycles.jpg",
      caption: "North Vietnamese transport column moving through jungle staging areas. On 6 August 1964, Radio Hanoi broadcast an official statement condemning US naval aggression.",
      text: "The Government of the Democratic Republic of Vietnam vehemently denounces before world public opinion the extremely serious provocative acts of the United States imperialists in dispatching warships to violate our territorial waters and fabricate so-called 'second attacks' on 4 August. This is a transparent pretext manufactured by the Johnson administration to justify unprovoked air strikes against North Vietnamese naval bases and expand the aggressive war into the North.",
      attribution: "Voice of Vietnam (Radio Hanoi), Official Government Broadcast (6 August 1964)"
    },
    "usa_lesson_3_2_b": {
      title: "Source C: Joint Resolution of Congress: The Gulf of Tonkin Resolution (Public Law 88-408) (7 August 1964)",
      image: "/units/usa/assets/sources/gulf_of_tonkin_resolution_statute_1964.png",
      image_url: "/units/usa/assets/sources/gulf_of_tonkin_resolution_statute_1964.png",
      caption: "Facsimile of the Gulf of Tonkin Resolution (Public Law 88-408), passed overwhelmingly by Congress on 7 August 1964 granting President Johnson authority to wage undeclared war in Vietnam.",
      text: "Whereas naval units of the Communist regime in Vietnam, in violation of the principles of the Charter of the United Nations and of international law, have deliberately and repeatedly attacked United States naval vessels lawfully present in international waters... Resolved by the Senate and House of Representatives of the United States of America in Congress assembled: That the Congress approves and supports the determination of the President, as Commander in Chief, to take all necessary measures to repel any armed attack against the forces of the United States and to prevent further aggression.",
      attribution: "Public Law 88-408, 88th United States Congress, 78 Stat. 384 (7 August 1964)"
    },

    // Lesson 11
    "usa_lesson_3_3_d": {
      title: "Source E: Testimony of Platoon Leader Lieutenant Philip Caputo on the Attrition Strategy and 'Search and Destroy' Missions (1966)",
      image: "/units/usa/assets/sources/us-soldier-patrolling-swamp.jpg",
      image_url: "/units/usa/assets/sources/us-soldier-patrolling-swamp.jpg",
      caption: "US soldier on point patrol through murky swamp water in the Mekong Delta. Search and destroy operations pitted American infantry against unseen snipers and booby traps.",
      text: "Our mission was not to win terrain or seize cities, but simply to kill: to kill communists and to count the bodies. It was an attrition strategy of body counts. But out in the rice paddies and jungle elephant grass, you couldn't tell who was Vietcong and who was a simple rice farmer. The VC didn't wear uniforms; they carried farming hoes by day and AK-47s by night. Every booby trap that tore a friend apart made us hate the villagers more, because we knew they knew where the punji stakes were buried and didn't warn us. In trying to destroy the enemy, we ended up destroying villages and driving the very people we were supposed to protect into the arms of the Vietcong.",
      attribution: "Philip Caputo, A Rumor of War (1977), memoir of service with 1st Battalion, 3rd Marines (1965–1966)"
    },

    // Lesson 12
    "usa_lesson_3_4_d": {
      title: "Source A: Editorial Declaration by CBS Evening News Anchor Walter Cronkite Following the Tet Offensive (27 February 1968)",
      image: "/units/usa/assets/sources/walter_cronkite_vietnam_hue_1968.jpg",
      image_url: "/units/usa/assets/sources/walter_cronkite_vietnam_hue_1968.jpg",
      caption: "CBS Evening News anchor Walter Cronkite reporting from the battlefield at Hue during the 1968 Tet Offensive.",
      text: "To say that we are closer to victory today is to believe, in the face of the evidence, the optimists who have been wrong in the past. To suggest we are on the edge of defeat is to yield to unreasonable pessimism. To say that we are mired in stalemate seems the only realistic, yet unsatisfactory, conclusion. It is increasingly clear to this reporter that the only rational way out then will be to negotiate, not as victors, but as an honorable people who lived up to their pledge to defend democracy, and did the best they could.",
      attribution: "Walter Cronkite, CBS News Special Report: Report from Vietnam (27 February 1968)"
    },
    "usa_lesson_3_4_c": {
      title: "Source C: From President Nixon’s Address to the Nation Announcing the Cambodian Incursion (30 April 1970)",
      image: "/units/usa/assets/sources/nixon-television-address.jpg",
      image_url: "/units/usa/assets/sources/nixon-television-address.jpg",
      caption: "President Richard Nixon delivering a televised address from the Oval Office with a map of Cambodia, 30 April 1970.",
      text: "Tonight, American and South Vietnamese units will attack the headquarters for the entire Communist military operation in South Vietnam. A major responsibility for the ground operations is being assumed by South Vietnamese forces... This is not an invasion of Cambodia. The areas in which these attacks will take place are completely occupied and controlled by North Vietnamese forces... Our purpose is not to expand the war into Cambodia, but to end the war in Vietnam and to win the just peace we all desire.",
      attribution: "President Richard Nixon, Address to the Nation on the Situation in Southeast Asia (30 April 1970)"
    },
    "usa_lesson_3_4_e": {
      title: "Source E: Declassified Oval Office Tape Recording: President Nixon and National Security Advisor Henry Kissinger (3 August 1972)",
      image: "/units/usa/assets/sources/nixon_kissinger_oval_office_1972.jpg",
      image_url: "/units/usa/assets/sources/nixon_kissinger_oval_office_1972.jpg",
      caption: "President Richard Nixon seated on the Oval Office desk conferring in private with National Security Advisor Dr. Henry Kissinger during strategic deliberations over Vietnam exit terms (White House Photo Office, 1972).",
      text: "Dr. Henry Kissinger: \"We require a decent interval. If a year or two years from now South Vietnam goes down the drain, it will look like a hell of an achievement to have got out, and it will be blamed on the South Vietnamese and on Congress.\"<br><br>President Richard Nixon: \"If we can get them out by November... then we've got to find a formula that holds the thing together until after the election. Then, if South Vietnam collapses in two years, that's their problem. We will have done our best.\"",
      attribution: "Nixon Presidential Materials Project, White House Tapes, National Archives, College Park"
    },

    // Lesson 14
    "usa_lesson_4_2_a": {
      title: "Source A: President Richard Nixon's Televised 'Silent Majority' Address to the Nation (3 November 1969)",
      image: "/units/usa/assets/sources/nixon-television-address.jpg",
      image_url: "/units/usa/assets/sources/nixon-television-address.jpg",
      caption: "President Richard Nixon in the Oval Office surrounded by thousands of letters and telegrams sent by citizens supporting his 3 November 1969 'Silent Majority' address.",
      text: "Let historians not record that when America was the most powerful nation in the world we passed on the other side of the road and allowed the last hopes for peace and freedom of millions of people to be suffocated by the forces of totalitarianism. And so tonight—to you, the great silent majority of my fellow Americans—I ask for your support. I pledged in my campaign for the Presidency to end the war in a way that we could win the peace... Let us be united for peace. Let us also be united against defeat. Because let us understand: North Vietnam cannot defeat or humiliate the United States. Only Americans can do that.",
      attribution: "President Richard Nixon, Address to the Nation on the War in Vietnam (3 November 1969)"
    },
    "usa_lesson_4_2_e": {
      title: "Source C: Archival Photograph of Construction Union Hard Hats on the White House Cabinet Table Following the Hard Hat Riots (26 May 1970)"
    },
    "usa_lesson_4_2_d": {
      title: "Source D: Gallup Opinion Poll Findings on Public Attitudes Toward the Anti-War Movement and the Nixon Administration (May 1970)",
      image: "/units/usa/assets/sources/pro-war-rally-nyc.jpg",
      image_url: "/units/usa/assets/sources/pro-war-rally-nyc.jpg",
      caption: "Thousands of construction workers, longshoremen, and blue-collar citizens rallying in lower Manhattan waving American flags in support of President Nixon and American troops (May 1970).",
      text: "Gallup Special Survey on Campus Protests and the Cambodian Incursion (May 1970):<br>• 58% of respondents held student anti-war demonstrators primarily responsible for the fatal shootings at Kent State University, compared to only 11% who blamed the Ohio National Guard.<br>• 50% approved of President Nixon's decision to order US ground troops into Cambodia to attack communist sanctuaries, with 39% disapproving.<br>• 65% expressed favorable views of the 'Silent Majority' and believed anti-war protesters were hurting the country's international standing.",
      attribution: "Gallup Opinion Index, Report No. 60 (June 1970)"
    },

    // Lesson 15
    "usa_lesson_4_3_d": {
      title: "Source D: From General Van Tien Dung's Official Account of the Final Communist 'Ho Chi Minh Campaign' on Saigon (April 1975)",
      image: "/units/usa/assets/sources/saigon-embassy-evacuation.jpg",
      image_url: "/units/usa/assets/sources/saigon-embassy-evacuation.jpg",
      caption: "Civilians scramble up a rooftop ladder to board an Air America helicopter in Saigon on 29 April 1975 as communist forces led by General Van Tien Dung surround the capital.",
      text: "The puppet troops fled in complete panic, abandoning their heavy tanks, howitzers, and aircraft at Da Nang and Cam Ranh Bay. Our revolutionary tanks smashed directly through the iron gates of the Independence Palace in Saigon at 11:30 a.m. on 30 April. The red-and-blue flag with the gold star was hoisted over the presidential palace. General Duong Van Minh surrendered unconditionally. Thirty years of liberation struggle had achieved glorious, total victory.",
      attribution: "General Van Tien Dung, Our Great Spring Victory (Hanoi, 1976; translated 1977)"
    },
    "usa_lesson_4_3_e": {
      title: "Source E: President Gerald R. Ford's Address at Tulane University Declaring the Vietnam War 'Finished' (23 April 1975)",
      image: "/units/usa/assets/sources/ch53_frequent_wind_saigon_1975.jpg",
      image_url: "/units/usa/assets/sources/ch53_frequent_wind_saigon_1975.jpg",
      caption: "A US Marine guards the perimeter at Tan Son Nhut Air Base during Operation Frequent Wind, the final evacuation of Saigon in late April 1975.",
      text: "Today, America can again feel the pride that existed in New Orleans that day 160 years ago. But it is not a pride that will be achieved by fighting again a war that is finished as far as America is concerned. I believe it is time for us to look forward to the future, to direct our energies and our resources towards the great goals of which we are capable, and to restore the confidence of the American people in their own destiny.",
      attribution: "President Gerald R. Ford, Address at a Tulane University Convocation, New Orleans (23 April 1975)"
    },

    // Lesson 16
    "usa_lesson_4_4_c": {
      title: "Source C: Excerpt from the War Powers Resolution Passed by Congress Over President Nixon's Veto (7 November 1973)",
      image: "/units/usa/assets/sources/war_powers_resolution_1973_statute.png",
      image_url: "/units/usa/assets/sources/war_powers_resolution_1973_statute.png",
      caption: "Facsimile of the opening section of the War Powers Resolution (Public Law 93-148), passed by Congress on 7 November 1973 to restrict presidential war-making power.",
      text: "Resolved by the Senate and House of Representatives of the United States of America in Congress assembled... Section 2(c). The constitutional powers of the President as Commander-in-Chief to introduce United States Armed Forces into hostilities are exercised only pursuant to (1) a declaration of war, (2) specific statutory authorization, or (3) a national emergency created by attack upon the United States... Section 5(b). Within sixty calendar days after a report is submitted, the President shall terminate any use of United States Armed Forces unless Congress has declared war or enacted a specific authorization.",
      attribution: "Public Law 93-148, 93rd United States Congress, 87 Stat. 555 (7 November 1973)"
    },
    "usa_lesson_4_4_d": {
      title: "Source E: From an Analysis by Military Historian George C. Herring in 'America's Longest War' (1979)",
      image: "/units/usa/assets/sources/us-troops-bogged-down.jpg",
      image_url: "/units/usa/assets/sources/us-troops-bogged-down.jpg",
      caption: "US soldiers wading through swamp under thick canopy in the Mekong Delta (US Army Combat Art Program).",
      text: "The United States intervened in Vietnam to contain communist expansion, but it fundamentally misperceived the nature of the conflict. Washington viewed the struggle through the rigid ideological lens of the global Cold War, failing to recognize that Vietnamese communism was deeply rooted in a century-long, ferocious struggle for national independence against foreign colonial domination. By intervening to prop up an artificial, corrupt, and illegitimate client regime in Saigon, the United States embarked upon an unwinnable war in which no amount of modern industrial technology or high-explosive firepower could compensate for the lack of political legitimacy.",
      attribution: "George C. Herring, America's Longest War: The United States and Vietnam, 1950–1975 (1979)"
    }
  };

  // Correct Flashcard and Cloze Packs for Lessons 7 through 16 to fix the shift!
  const curriculumAlignments = {
    // Lesson 7: Black Power
    "lesson_2_3": {
      flashcards: [
        {
          term: "Malcolm X (El-Hajj Malik El-Shabazz)",
          definition: "Charismatic minister of the Nation of Islam who advocated Black nationalism, racial pride, and self-defense 'by any means necessary' before his assassination in 1965.",
          q: "What was Malcolm X's core philosophy during his time with the Nation of Islam?",
          a: "He rejected non-violence and racial integration, advocating Black pride, economic independence, and armed self-defense."
        },
        {
          term: "The Ballot or the Bullet (1964)",
          definition: "Landmark speech by Malcolm X warning white politicians that Black Americans would use armed self-defense if denied their constitutional voting rights.",
          q: "What was the message of Malcolm X's 'Ballot or the Bullet' speech?",
          a: "If the government failed to protect Black voting rights, African Americans would be forced to resort to armed revolution."
        },
        {
          term: "Black Power (June 1966)",
          definition: "Political slogan and philosophy popularized by SNCC Chairman Stokely Carmichael, emphasizing racial pride, political autonomy, and self-determination.",
          q: "What was the significance of the cry 'Black Power' in 1966?",
          a: "It marked a decisive break from the non-violent integrationist goals of MLK toward militant Black political and economic control."
        },
        {
          term: "Stokely Carmichael (Kwame Ture)",
          definition: "SNCC leader who expelled white members in 1966 and re-oriented the organisation toward militant Black nationalism and anti-imperialism.",
          q: "How did Stokely Carmichael transform SNCC in 1966?",
          a: "He abandoned non-violence, expelled white organizers, and made 'Black Power' the official ideology of the group."
        },
        {
          term: "Black Panther Party for Self-Defense",
          definition: "Revolutionary socialist organization founded in Oakland in 1966 by Huey Newton and Bobby Seale to conduct armed citizen patrols and provide free community survival programs.",
          q: "What were the main goals of the Black Panther Party?",
          a: "To monitor racist police brutality through armed patrols and operate community survival programs like Free Breakfast for Children."
        },
        {
          term: "1968 Mexico Olympics Salute",
          definition: "Historic protest by Black American sprinters Tommie Smith and John Carlos on the medal podium, raising black-gloved fists during the US national anthem.",
          q: "Why did Tommie Smith and John Carlos give the Black Power salute at the 1968 Olympics?",
          a: "To protest racial injustice and poverty in America on an international stage, wearing black socks to represent Black poverty."
        }
      ],
      vocab_cloze_text: "During the mid-1960s, a fiery alternative to the Southern non-violent movement emerged in northern and western urban centers, personified by [Malcolm X]. Rejecting Martin Luther King Jr.'s call for integration, Malcolm warned white politicians in his iconic 1964 address that Black Americans would embrace [The Ballot or the Bullet] if denied their constitutional rights. Following Malcolm's assassination, SNCC Chairman [Stokely Carmichael] electrified the 1966 March Against Fear by raising the militant cry of [Black Power], breaking decisively from non-violent direct action. In Oakland, California, Huey Newton and Bobby Seale established the [Black Panther Party], carrying loaded firearms on street patrols to protect Black citizens against police brutality while distributing thousands of free breakfasts to children. The global impact of this militant awakening culminated at the [1968 Mexico Olympics], when track stars Tommie Smith and John Carlos raised black-gloved fists on the medal podium to protest American racial oppression."
    },

    // Lesson 8: Urban Riots 1965-1968
    "lesson_2_4": {
      flashcards: [
        {
          term: "Watts Riots (August 1965)",
          definition: "Six days of violent urban rebellion in the Watts district of Los Angeles triggered by police mistreatment, resulting in 34 deaths, 1,000 injuries, and $40 million in property destruction.",
          q: "What caused the Watts Riots in Los Angeles in August 1965?",
          a: "Simmering rage over police brutality, high unemployment, and miserable ghetto housing erupted after an aggressive traffic arrest."
        },
        {
          term: "'Long, Hot Summers' (1965–1967)",
          definition: "A wave of over 150 race riots that erupted in northern and western industrial cities (such as Newark and Detroit in 1967), exposing deep racial divisions outside the South.",
          q: "What were the 'Long, Hot Summers' of 1965–1967?",
          a: "Outbreaks of violent urban rioting across dozens of northern cities including Detroit and Newark, fueled by poverty and police abuse."
        },
        {
          term: "Kerner Commission Report (1968)",
          definition: "President Johnson's investigative commission that concluded white racism was the primary cause of urban riots, warning the nation was 'moving toward two societies, one black, one white—separate and unequal'.",
          q: "What was the conclusion of the 1968 Kerner Commission Report?",
          a: "It blamed white racism for ghetto poverty and police abuse, famously warning America was dividing into two separate and unequal societies."
        },
        {
          term: "De Facto Segregation",
          definition: "Racial segregation that occurs by socioeconomic reality, discriminatory bank redlining, and residential practice rather than by Southern Jim Crow laws.",
          q: "What was de facto segregation in northern cities?",
          a: "Segregation in housing and schools enforced by white prejudice, bank lending restrictions (redlining), and job discrimination, not by law."
        },
        {
          term: "Detroit Riot of 1967",
          definition: "One of the deadliest urban rebellions in US history, lasting five days after police raided an unlicensed bar, requiring 82nd Airborne paratroopers and resulting in 43 deaths.",
          q: "How severe was the 1967 Detroit rebellion?",
          a: "43 people were killed, over 1,000 injured, and 7,000 arrested, requiring federal army tanks and paratroopers to suppress."
        },
        {
          term: "White Backlash ('Law and Order')",
          definition: "The political reaction among white suburban voters who blamed civil rights militants and rioters for disorder, leading to Richard Nixon's 'law and order' presidential victory in 1968.",
          q: "How did white suburban Americans react to the urban riots?",
          a: "With a conservative backlash demanding strict 'law and order', turning against civil rights funding and electing Richard Nixon."
        }
      ],
      vocab_cloze_text: "Just five days after President Johnson signed the Voting Rights Act, the streets of Los Angeles exploded in the catastrophic [Watts Riots] of August 1965, requiring 14,000 National Guardsmen to suppress six days of arson, looting, and gunfire that left 34 dead. This erupted into the [Long, Hot Summers] of 1966 and 1967, as more than 150 northern industrial metropolises—most catastrophically Detroit, where 43 people perished—rebelled against miserable ghetto housing, corrupt slumlords, and aggressive white police forces. Investigating the unprecedented urban turmoil, the presidentially appointed [Kerner Commission] issued a scathing report in 1968, warning that the nation was rapidly 'moving toward two societies, one black, one white—separate and unequal'. The commission made clear that northern cities suffered not from southern Jim Crow laws, but from entrenched [De Facto Segregation] enforced by predatory bank redlining and job discrimination. Instead of funding the commission's sweeping recommendations for billions in federal housing and school investment, white suburban voters experienced a furious [White Backlash], embracing Richard Nixon's conservative 'law and order' campaign in the 1968 presidential election."
    },

    // Lesson 9: Early Involvement & Diem
    "lesson_3_1": {
      flashcards: [
        {
          term: "Domino Theory",
          definition: "President Eisenhower's Cold War belief that if South Vietnam fell to communism, neighboring Southeast Asian nations (Laos, Cambodia, Thailand, Burma) would topple like a row of dominoes.",
          q: "What was Eisenhower's 'Domino Theory' regarding Southeast Asia?",
          a: "The geopolitical concept that a communist victory in Vietnam would trigger the rapid collapse of all surrounding Southeast Asian states."
        },
        {
          term: "Geneva Accords (1954)",
          definition: "International conference agreement that temporarily divided Vietnam along the 17th Parallel and scheduled nationwide democratic unification elections for July 1956.",
          q: "How did the 1954 Geneva Accords divide Vietnam?",
          a: "Temporarily divided the nation along the 17th Parallel between Ho Chi Minh's communist North and a Western-backed South, pending 1956 elections."
        },
        {
          term: "Ngo Dinh Diem",
          definition: "Catholic, fiercely anti-communist leader of South Vietnam (1954–1963) backed by the US, whose nepotism, corruption, and persecution of Buddhists alienated the Vietnamese population.",
          q: "Why was Ngo Dinh Diem's regime so unpopular among ordinary Vietnamese?",
          a: "He favored his Catholic minority, jailed political opponents, appointed corrupt family members, and brutally persecuted Buddhist monks."
        },
        {
          term: "Strategic Hamlets Program",
          definition: "US-backed military scheme in 1962 that forcibly relocated Vietnamese peasants into fortified barbed-wire villages to isolate them from Vietcong guerrillas.",
          q: "Why did the Strategic Hamlets program backfire on the Diem regime?",
          a: "It uprooted peasants from their sacred ancestral burial lands, breeding intense hatred and driving thousands to join the Vietcong."
        },
        {
          term: "Buddhist Crisis (1963)",
          definition: "Nationwide Buddhist protests against Diem's religious persecution, dramatized globally when monk Thich Quang Duc burned himself to death in central Saigon.",
          q: "What was the historical impact of Thich Quang Duc's self-immolation in June 1963?",
          a: "The shocking photograph exposed Diem's brutality worldwide, convincing President Kennedy that Diem could no longer be supported."
        },
        {
          term: "Diem Coup (November 1963)",
          definition: "Overthrow and assassination of Ngo Dinh Diem by South Vietnamese military generals with the covert approval and encouragement of the US government.",
          q: "What happened to Ngo Dinh Diem in November 1963?",
          a: "He was overthrown and murdered in a military coup tacitly authorized by the Kennedy administration via State Department Cable 243."
        }
      ],
      vocab_cloze_text: "Following the humiliating defeat of French colonial forces at Dien Bien Phu in 1954, the international [Geneva Accords] temporarily partitioned the nation along the [17th Parallel]. Fearing that a communist takeover would trigger the [Domino Theory] across Southeast Asia, the United States installed and financed the authoritarian, anti-communist regime of [Ngo Dinh Diem] in Saigon. Diem refused to hold the promised 1956 reunification elections, rigged his own presidency, and alienated the rural peasantry by forcing them into fortified [Strategic Hamlets] surrounded by barbed wire. Diem's overt favoritism toward his Roman Catholic minority triggered the nationwide [Buddhist Crisis] of 1963, broadcast to a horrified world when monk Thich Quang Duc performed public self-immolation on a Saigon street corner. Realizing Diem's regime had lost all legitimacy, the Kennedy administration sent secret State Department Cable 243 approving the [Diem Coup] of November 1963, resulting in Diem's execution and leaving South Vietnam in severe political instability."
    },

    // Lesson 10: Tonkin & Escalation
    "lesson_3_2": {
      flashcards: [
        {
          term: "Gulf of Tonkin Incident (August 1964)",
          definition: "Naval skirmishes off North Vietnam involving the destroyer USS Maddox and questionable second sonar reports, used by President Johnson to justify direct US military intervention.",
          q: "What occurred during the Gulf of Tonkin Incident in August 1964?",
          a: "The USS Maddox fired on North Vietnamese patrol boats; a disputed second attack two nights later was used by LBJ to escalate the war."
        },
        {
          term: "Gulf of Tonkin Resolution",
          definition: "Congressional statute (Public Law 88-408) passed almost unanimously granting President Johnson authority to 'take all necessary measures' to repel attacks in Southeast Asia.",
          q: "What power did the Gulf of Tonkin Resolution give President Johnson?",
          a: "It gave the president a constitutional 'blank check' to wage full-scale undeclared war in Vietnam without consulting Congress."
        },
        {
          term: "Pleiku Attack (February 1965)",
          definition: "Vietcong mortar assault on a US helicopter base at Pleiku that killed 9 Americans, used by LBJ as the immediate trigger to launch sustained air bombing.",
          q: "Why was the attack on Pleiku in February 1965 a turning point?",
          a: "It provided the immediate catalyst for Johnson to order Operation Rolling Thunder and commit the first American ground combat troops."
        },
        {
          term: "Operation Rolling Thunder (1965–1968)",
          definition: "Massive, continuous three-year US aerial bombing campaign against North Vietnam and the Ho Chi Minh Trail aimed at halting communist infiltration.",
          q: "What was the purpose of Operation Rolling Thunder?",
          a: "A sustained aerial bombardment designed to destroy North Vietnamese infrastructure, military depots, and force Hanoi to negotiate."
        },
        {
          term: "General William Westmoreland",
          definition: "Commander of US Military Assistance Command, Vietnam (MACV) from 1964 to 1968 who advocated conventional search-and-destroy warfare and an attrition body-count strategy.",
          q: "What military doctrine did General Westmoreland pursue in Vietnam?",
          a: "An attrition strategy relying on massive artillery, B-52 air strikes, and 'Search and Destroy' patrols to inflict unsustainable casualties on the enemy."
        },
        {
          term: "Da Nang Landing (8 March 1965)",
          definition: "Historic deployment of 3,500 United States Marines of the 9th Marine Expeditionary Brigade wading ashore at Red Beach, marking the formal arrival of US ground combat units.",
          q: "What was the significance of the US Marine landing at Da Nang in March 1965?",
          a: "It transformed the American role from military advisory support to full-scale offensive ground combat warfare in Asia."
        }
      ],
      vocab_cloze_text: "In August 1964, following skirmishes involving the USS Maddox off North Vietnam, President Lyndon B. Johnson seized upon the contested [Gulf of Tonkin Incident] to seek sweeping executive wartime powers. Congress responded by overwhelmingly passing the [Gulf of Tonkin Resolution], handing Johnson a virtual blank check to wage undeclared warfare. Following a deadly Vietcong mortar strike on the American air base at [Pleiku] in February 1965, LBJ unleashed [Operation Rolling Thunder], raining more explosive tonnage on North Vietnam than on all of Europe during World War II. To defend American airfields from communist sabotage, 3,500 United States Marines conducted the historic [Da Nang Landing] on 8 March 1965. Under the command of [General William Westmoreland], American forces transitioned rapidly from static perimeter defense to aggressive 'Search and Destroy' attrition warfare, escalating US troop commitments from 23,000 advisors to over 536,000 combat soldiers by 1968."
    },

    // Lesson 11: Military Tactics
    "lesson_3_3": {
      flashcards: [
        {
          term: "Vietcong Asymmetric Guerrilla Tactics",
          definition: "Combat doctrine of fighting without uniforms, avoiding pitched battles, relying on ambushes, booby traps, and 'hanging onto the belts' of American units to neutralize air power.",
          q: "How did the Vietcong fight an 'asymmetric' guerrilla war?",
          a: "They avoided open conventional battles, hid among villagers, ambushed US patrols at point-blank range, and vanished into jungles and tunnels."
        },
        {
          term: "Cu Chi Tunnels",
          definition: "Complex 250-kilometer subterranean network of multi-level tunnels beneath South Vietnam featuring barracks, hospitals, munitions factories, and hidden trapdoors.",
          q: "Why were the Cu Chi tunnels so vital to Vietcong survival?",
          a: "They protected communist guerrillas from massive B-52 carpet bombing and allowed unseen fighters to stage surprise ambushes behind US patrols."
        },
        {
          term: "Ho Chi Minh Trail",
          definition: "Massive 16,000-kilometer logistics corridor running through Laos and Cambodia used by North Vietnam to transport troops, heavy artillery, and Soviet munitions into South Vietnam.",
          q: "Why couldn't the US military cut the Ho Chi Minh Trail?",
          a: "It ran through sovereign neutral countries (Laos and Cambodia) beneath thick jungle canopy, and tens of thousands of workers repaired bombing damage overnight."
        },
        {
          term: "Search and Destroy ('Zippo Raids')",
          definition: "US infantry doctrine of inserting helicopter platoons into rural hamlets to locate Vietcong, often resulting in the burning of peasant huts and alienation of civilians.",
          q: "Why were Search and Destroy operations counterproductive?",
          a: "US troops could rarely identify hidden guerrillas, so they burned peasant homes and crops, fueling intense peasant hatred and boosting Vietcong recruitment."
        },
        {
          term: "Agent Orange Defoliant",
          definition: "Toxic chemical herbicide sprayed by US C-123 aircraft over millions of acres of South Vietnamese forest to strip jungle canopy and destroy food supplies.",
          q: "What were the consequences of using Agent Orange in Vietnam?",
          a: "It caused devastating long-term cancer, horrific birth defects in hundreds of thousands of Vietnamese children, and catastrophic environmental destruction."
        },
        {
          term: "Napalm Warfare",
          definition: "Jellied gasoline weapon dropped in firebombs that clung to human skin and burned at 1,000°C, causing horrific burns and terrorizing civilian populations.",
          q: "Why did the use of Napalm inflame domestic anti-war sentiment?",
          a: "Photographs of civilian children severely burned by incendiary napalm destroyed the moral credibility of the American intervention."
        }
      ],
      vocab_cloze_text: "In the dense tropical jungles of Vietnam, US troops struggled against an elusive enemy utilizing [Asymmetric Guerrilla Tactics]. Rather than engaging superior American firepower in pitched battle, the Vietcong practiced 'hanging onto the belts' of US patrols to prevent air strikes, and vanished into complex subterranean fortresses like the [Cu Chi Tunnels]. Reinforcements and heavy Soviet weaponry poured continuously into the South along the rugged [Ho Chi Minh Trail], a 16,000-kilometer logistical lifeline traversing Laos and Cambodia that American B-52 bombing could never sever. To locate the hidden guerrillas, General Westmoreland deployed helicopter platoons on aggressive [Search and Destroy] sweeps, nicknamed 'Zippo raids' because soldiers torched thatched peasant dwellings, driving enraged villagers into the insurgency. To strip the dense forest canopy concealing enemy positions, the US military sprayed over 19 million gallons of the carcinogenic defoliant [Agent Orange] and dropped devastating firebombs of incendiary [Napalm], inflicting horrific civilian casualties and generating worldwide outrage."
    },

    // Lesson 12: Tet Offensive & Vietnamization
    "lesson_3_4": {
      flashcards: [
        {
          term: "Tet Offensive (January 1968)",
          definition: "Massive, coordinated surprise offensive launched by 84,000 Vietcong and NVA troops across 36 provincial capitals and Saigon during the Lunar New Year holiday.",
          q: "What was the 1968 Tet Offensive?",
          a: "A simultaneous surprise assault on over 100 cities, provincial capitals, and the US Embassy in Saigon on 30 January 1968."
        },
        {
          term: "Credibility Gap",
          definition: "The unbridgeable divide between optimistic US government assurances that victory was near and the shocking battlefield combat broadcast nightly into American living rooms.",
          q: "What was the 'credibility gap' following the Tet Offensive?",
          a: "The public realization that President Johnson and General Westmoreland had misled the nation regarding the true progress and winnability of the war."
        },
        {
          term: "Walter Cronkite Editorial (February 1968)",
          definition: "Unprecedented broadcast by America's most trusted news anchor concluding the war was 'mired in stalemate', prompting LBJ to declare 'If I've lost Cronkite, I've lost middle America'.",
          q: "What was the impact of Walter Cronkite's broadcast from Vietnam?",
          a: "It shattered mainstream public faith in the war and directly convinced President Johnson that military victory was unattainable."
        },
        {
          term: "Johnson's Resignation Announcement (March 1968)",
          definition: "Stunning televised address on 31 March 1968 in which President Lyndon B. Johnson announced a bombing pause and declared he would neither seek nor accept re-election.",
          q: "Why did Lyndon B. Johnson refuse to seek re-election in 1968?",
          a: "Crushed by the political fallout of the Tet Offensive, anti-war protests, and deep divisions within his own Democratic party."
        },
        {
          term: "Vietnamization Policy (1969)",
          definition: "President Richard Nixon's policy to expand, train, and equip the South Vietnamese army (ARVN) to assume combat operations while gradually withdrawing US ground troops.",
          q: "What was the goal of Nixon's 'Vietnamization' policy?",
          a: "To withdraw 500,000 American combat soldiers and transfer the fighting to the South Vietnamese ARVN while avoiding the appearance of defeat."
        },
        {
          term: "Cambodian Incursion (April 1970)",
          definition: "Nixon's controversial military invasion of neutral Cambodia to destroy communist sanctuaries and supply dumps, sparking massive domestic university riots and student strikes.",
          q: "Why did Nixon's secret invasion of Cambodia trigger fury at home?",
          a: "It appeared to drastically expand the war into a neutral country despite Nixon's campaign promises to wind down US involvement."
        }
      ],
      vocab_cloze_text: "On 30 January 1968, communist forces detonated the decisive turning point of the conflict by launching the massive [Tet Offensive], assaulting over 100 South Vietnamese cities and breaching the US Embassy compound in Saigon. Although US and ARVN forces recaptured every objective and inflicted catastrophic military losses on the Vietcong, the graphic television footage created an unbridgeable [Credibility Gap] at home. Respected CBS anchor [Walter Cronkite] traveled to the smoldering ruins of Hue, concluding on national television that the war was hopelessly 'mired in stalemate'. Shattered by plunging public approval, President Johnson made the historic [Resignation Announcement] on 31 March 1968, halting bombing and abandoning his re-election campaign. Taking office in 1969 on a pledge of 'Peace with Honor', President Richard Nixon introduced the policy of [Vietnamization], transferring combat responsibilities to the ARVN while withdrawing US soldiers. However, Nixon's secret decision to expand the war through the [Cambodian Incursion] in April 1970 ignited unprecedented domestic student strikes and protests across American universities."
    },

    // Lesson 13: Opposition (My Lai & Kent State)
    "lesson_4_1": {
      flashcards: [
        {
          term: "The Living Room War",
          definition: "The reality that Vietnam was the first televised conflict, bringing uncensored battlefield carnage, body bags, and civilian destruction into American homes every evening.",
          q: "Why was Vietnam referred to as the 'Living Room War'?",
          a: "Uncensored nightly television news broadcast graphic footage of combat, wounded GIs, and burning villages directly into civilian living rooms."
        },
        {
          term: "Military Draft Lottery (1969)",
          definition: "Selective Service system that drew birthdates from a glass bowl to determine conscription priority, widely protested because college deferments favored wealthy white youths.",
          q: "Why did the military draft provoke widespread outrage on college campuses?",
          a: "Because young men faced conscription into a deadly, unpopular war, while college deferments disproportionately protected middle- and upper-class youths."
        },
        {
          term: "My Lai Massacre (March 1968)",
          definition: "Mass murder of over 500 unarmed Vietnamese women, children, and elderly villagers by US Charlie Company led by Lieutenant William Calley, exposed to the world in late 1969.",
          q: "What occurred at the village of My Lai on 16 March 1968?",
          a: "American soldiers systematically massacred between 347 and 504 unarmed civilians, an atrocity covered up by the military for over a year."
        },
        {
          term: "Kent State University Shootings (4 May 1970)",
          definition: "The fatal shooting of four unarmed college students by Ohio National Guardsmen during an anti-war rally protesting Nixon's Cambodian invasion, sparking a nationwide student strike of 4 million.",
          q: "What was the significance of the Kent State shootings in May 1970?",
          a: "The murder of four unarmed American students on their own campus galvanized over 450 universities to close down in the largest student strike in US history."
        },
        {
          term: "Pentagon Papers (June 1971)",
          definition: "Classified 7,000-page Department of Defense study leaked by Daniel Ellsberg proving that the US government had systematically lied about Tonkin, bombing raids, and casualty statistics.",
          q: "What did the Pentagon Papers reveal when leaked to the New York Times in 1971?",
          a: "They proved that four successive presidential administrations had deliberately deceived Congress and the public about the true scope and nature of the war."
        },
        {
          term: "Vietnam Veterans Against the War (VVAW)",
          definition: "Organization of returned combat veterans led by John Kerry who testified before Congress and threw their purple hearts and combat medals over the Capitol fence in April 1971.",
          q: "Why was the protest of Vietnam Veterans Against the War (VVAW) so impactful?",
          a: "Because decorated combat heroes publicly rejected the war as a moral disaster, giving enormous credibility to the anti-war movement."
        }
      ],
      vocab_cloze_text: "Public disillusionment with the conflict deepened profoundly because Vietnam was America's first [Living Room War], with uncensored television footage of wounded soldiers and napalmed children broadcast nightly into family dining rooms. Campus unrest exploded across the nation as young men faced the dreaded [Military Draft], which disproportionately conscripted working-class and Black youths while the wealthy secured university deferments. The moral justification for the American war effort collapsed entirely in late 1969 with the exposure of the [My Lai Massacre], in which Lieutenant William Calley's platoon slaughtered over 500 unarmed women, infants, and elderly peasants. When President Nixon ordered troops into Cambodia in May 1970, students at [Kent State University] organized mass rallies, culminating in tragedy when Ohio National Guardsmen opened fire, killing four unarmed students and triggering a nationwide strike of four million students. The crisis of trust reached its climax in June 1971 when whistleblower Daniel Ellsberg leaked the [Pentagon Papers], proving that the US government had systematically deceived the public, while thousands of decorated soldiers in [Vietnam Veterans Against the War] hurled their combat medals over the Capitol fence."
    },

    // Lesson 14: Support & Silent Majority
    "lesson_4_2": {
      flashcards: [
        {
          term: "The 'Silent Majority'",
          definition: "President Nixon's term for the millions of conservative, patriotic, blue-collar, and suburban Americans who supported the war and opposed anti-war student demonstrations.",
          q: "Who was Richard Nixon referring to as the 'Silent Majority' in November 1969?",
          a: "The large, quiet majority of law-abiding Americans who supported their country, respected the military, and rejected radical counterculture protests."
        },
        {
          term: "Cold War Patriotism & Anti-Communism",
          definition: "The deep-seated belief held by millions of Americans that the Vietnam War was a noble, necessary struggle to defend the free world against global Soviet and Chinese totalitarianism.",
          q: "Why did millions of ordinary Americans continue to support the Vietnam War?",
          a: "Out of deep patriotic loyalty, respect for American soldiers, and genuine fear that communist expansion would threaten global democracy."
        },
        {
          term: "Hard Hat Riots (8 May 1970)",
          definition: "Violent confrontation in lower Manhattan where 200 pro-war construction workers armed with iron pipes assaulted anti-war student demonstrators near Wall Street.",
          q: "What were the 'Hard Hat Riots' of May 1970 in New York City?",
          a: "A violent clash in which union construction workers attacked anti-war student protesters, demonstrating working-class support for Nixon and the military."
        },
        {
          term: "Congressional Hawks vs. Doves",
          definition: "The political division between 'Hawks' (conservatives who demanded total military victory and increased bombing) and 'Doves' (liberals who demanded an immediate negotiated US withdrawal).",
          q: "What was the difference between 'Hawks' and 'Doves' in Congress?",
          a: "Hawks supported aggressive military action to crush communism; Doves argued the war was unwinnable, immoral, and demanded rapid withdrawal."
        },
        {
          term: "Honor and National Credibility",
          definition: "The widespread argument that an abrupt American retreat from South Vietnam would dishonor fallen soldiers, betray loyal South Vietnamese allies, and destroy US global credibility.",
          q: "Why did Nixon insist on 'Peace with Honor' rather than immediate withdrawal?",
          a: "He believed that abandoning Saigon would destroy American credibility worldwide and embolden the Soviet Union and China to launch further aggression."
        },
        {
          term: "1972 49-State Presidential Landslide",
          definition: "Richard Nixon's historic electoral triumph over anti-war Democrat George McGovern, winning 60.7% of the popular vote and 520 out of 537 electoral votes.",
          q: "What did Richard Nixon's 1972 election victory prove about American public opinion?",
          a: "It demonstrated that the conservative Silent Majority overwhelmingly rejected the radical anti-war movement and supported Nixon's measured exit strategy."
        }
      ],
      vocab_cloze_text: "Despite the high-profile visibility of campus protests, millions of ordinary citizens viewed the conflict through the prism of traditional [Cold War Patriotism], convinced that halting communist aggression was essential for the survival of the free world. On 3 November 1969, President Nixon rallied this constituency in a landmark televised address, appealing directly to the great [Silent Majority] of law-abiding citizens who rejected flag burnings and supported American troops. Tensions between the working class and college students erupted into violence during the [Hard Hat Riots] of May 1970, when hundreds of construction workers attacked anti-war demonstrators near Wall Street while chanting 'USA, All the Way!'. In Washington, political debate divided bitterly between pro-military [Congressional Hawks] who demanded increased air power and anti-war 'Doves'. President Nixon repeatedly emphasized that America could not abandon South Vietnam without irreparably destroying American [Honor and National Credibility]. The enduring strength of conservative public sentiment was proven conclusively in the [1972 Presidential Landslide], when Nixon defeated anti-war Democrat George McGovern in 49 of 50 states."
    },

    // Lesson 15: Exit & Fall of Saigon
    "lesson_4_3": {
      flashcards: [
        {
          term: "Henry Kissinger's Secret Diplomacy",
          definition: "Covert negotiations conducted in Paris by Nixon's National Security Advisor with North Vietnamese diplomat Le Duc Tho to secure a US military withdrawal.",
          q: "How did Henry Kissinger negotiate the American exit from Vietnam?",
          a: "Through clandestine meetings in Paris with North Vietnamese negotiator Le Duc Tho, agreeing to a 'decent interval' before Saigon fell."
        },
        {
          term: "Operation Linebacker II ('Christmas Bombing', 1972)",
          definition: "Fierce eleven-day B-52 carpet bombing of Hanoi and Haiphong in December 1972 ordered by Nixon to force North Vietnam back to the negotiating table.",
          q: "What was the purpose of the 1972 Christmas Bombing?",
          a: "To compel Hanoi to sign the Paris Accords and convince South Vietnamese President Thieu that the US would defend Saigon if North Vietnam violated the treaty."
        },
        {
          term: "Paris Peace Accords (27 January 1973)",
          definition: "Formally signed treaty ending direct US military involvement: complete withdrawal of all US combat troops, release of all American POWs, but allowing 150,000 NVA troops to remain in South Vietnam.",
          q: "What were the key terms of the January 1973 Paris Peace Accords?",
          a: "All US combat forces withdrew within 60 days, US POWs were returned, but North Vietnamese troops were permitted to stay in South Vietnam."
        },
        {
          term: "Operation Homecoming (1973)",
          definition: "The repatriation of 591 American prisoners of war (including John McCain) held in North Vietnamese captivity, welcomed home as national heroes.",
          q: "What was Operation Homecoming in early 1973?",
          a: "The formal release and return of nearly 600 American POWs held in Hanoi prisons following the signing of the Paris Peace Accords."
        },
        {
          term: "The Ho Chi Minh Campaign (1975)",
          definition: "The final massive conventional blitzkrieg launched by the North Vietnamese Army in spring 1975 under General Van Tien Dung, sweeping through South Vietnam in 55 days.",
          q: "Why did South Vietnam collapse so rapidly in spring 1975?",
          a: "The ARVN suffered from corruption and fuel shortages, while the US Congress refused to authorize military aid or B-52 air strikes to defend them."
        },
        {
          term: "Operation Frequent Wind & The Fall of Saigon (30 April 1975)",
          definition: "The dramatic emergency helicopter evacuation of over 7,000 Americans and South Vietnamese allies as North Vietnamese tanks smashed through the gates of the Independence Palace.",
          q: "What happened in Saigon on 30 April 1975?",
          a: "Communist tanks crashed through the gates of the Presidential Palace, Saigon surrendered unconditionally, and Vietnam was reunited under communist rule."
        }
      ],
      vocab_cloze_text: "Seeking an exit that preserved American credibility, National Security Advisor [Henry Kissinger] engaged in secret talks in Paris with North Vietnamese diplomat Le Duc Tho. When negotiations stalled in late 1972, Nixon unleashed [Operation Linebacker II], an unprecedented eleven-day B-52 bombing blitz on Hanoi to force concessions. On 27 January 1973, all parties formally signed the [Paris Peace Accords], requiring the total withdrawal of all American combat forces within 60 days, while fatally permitting over 150,000 North Vietnamese troops to remain in the South. In early 1973, the emotional release of nearly 600 American prisoners of war took place under [Operation Homecoming]. Deprived of American air support and crippled by corruption, the South Vietnamese military collapsed catastrophically in spring 1975 under the communist [Ho Chi Minh Campaign]. In late April 1975, the United States conducted [Operation Frequent Wind], evacuating thousands by helicopter from rooftops as North Vietnamese tanks crashed through the gates of the Independence Palace, concluding 30 years of war."
    },

    // Lesson 16: Reasons for US Failure
    "lesson_4_4": {
      flashcards: [
        {
          term: "Asymmetric Warfare and Military Doctrine",
          definition: "The fundamental mismatch between American reliance on high-tech industrial firepower and the Vietcong's low-tech guerrilla attrition warfare.",
          q: "Why did American conventional firepower fail against the Vietcong?",
          a: "Heavy artillery and air strikes could destroy terrain but could not defeat an unseen guerrilla force that blended with the civilian population."
        },
        {
          term: "Failure to Win 'Hearts and Minds'",
          definition: "The fatal alienation of the South Vietnamese peasantry caused by civilian bombing casualties, napalm burns, Agent Orange poisoning, and the burning of villages during search-and-destroy missions.",
          q: "Why did the US campaign to win 'hearts and minds' fail?",
          a: "Brutal tactics like napalm, defoliation, and Zippo raids turned ordinary rural peasants against the US and made them willing allies of the Vietcong."
        },
        {
          term: "Corruption and Illegitimacy of the Saigon Regime",
          definition: "The chronic political instability, military incompetence, and widespread corruption of South Vietnam's military dictatorships (Diem, Ky, Thieu), which never gained popular legitimacy.",
          q: "Why was the South Vietnamese government (ARVN) an ineffective ally?",
          a: "Its leaders were perceived as corrupt American puppets who pocketed US aid, while conscripted soldiers suffered from low morale and astronomical desertion rates."
        },
        {
          term: "Domestic Political Collapse & The Credibility Gap",
          definition: "The erosion of American home front support caused by uncensored television coverage, draft protests, the My Lai scandal, and the Watergate crisis.",
          q: "How did domestic politics contribute to the US defeat in Vietnam?",
          a: "Relentless anti-war opposition and deception scandals forced Congress to cut funding and eventually ban further military intervention in Southeast Asia."
        },
        {
          term: "Soviet and Chinese Military Aid",
          definition: "The billions of dollars in modern surface-to-air missiles (SAMs), radar, tanks, AK-47s, and logistics personnel provided to North Vietnam by the USSR and China.",
          q: "What role did the Soviet Union and China play in the communist victory?",
          a: "They supplied North Vietnam with advanced anti-aircraft missiles, heavy artillery, and economic aid, enabling Hanoi to withstand US air attacks."
        },
        {
          term: "War Powers Act of 1973 (Public Law 93-148)",
          definition: "Landmark federal law passed over Nixon's veto requiring the President to consult Congress before committing US forces abroad and limiting deployments to 60 days without authorization.",
          q: "What was the significance of the 1973 War Powers Resolution?",
          a: "It revoked the imperial presidency and prevented future presidents from waging undeclared wars without explicit congressional approval."
        }
      ],
      vocab_cloze_text: "The ultimate defeat of the United States in Vietnam resulted from interconnected military, political, and cultural factors. Militarily, the Pentagon's conventional doctrine failed against the enemy's masterclass in [Asymmetric Warfare], where hidden tunnel networks and camouflage neutralized multi-billion-dollar technology. Politically, the US completely failed in its mission to [Win Hearts and Minds], as chemical defoliation and search-and-destroy missions alienated the very peasantry the US sought to defend. Furthermore, the South Vietnamese regime suffered from chronic [Saigon Regime Corruption], with generals pocketing American aid while conscripts deserted in massive numbers. On the domestic home front, an unbridgeable [Domestic Political Collapse] erupted as television broadcasts and scandals destroyed public trust, leading Congress to slash funding. Meanwhile, North Vietnam was bolstered by billions in advanced [Soviet and Chinese Aid], equipping their army with sophisticated anti-aircraft missiles. Determined to prevent future imperial presidencies, Congress enacted the historic [War Powers Act of 1973], permanently curtailing executive authority to wage undeclared foreign wars."
    }
  };

  // Perform updates
  let updatedSourcesCount = 0;
  let updatedLessonsCount = 0;

  for (const lesson of lessons) {
    let lessonModified = false;

    // 1. Wipe out any stray tasks array at the lesson level
    if (lesson.tasks && Array.isArray(lesson.tasks)) {
      lesson.tasks = [];
      lessonModified = true;
    }

    // 2. Wipe out any stray tasks array inside narrative blocks / stages
    if (lesson.narrative_blocks) {
      for (const b of lesson.narrative_blocks) {
        if (b.tasks && Array.isArray(b.tasks)) {
          b.tasks = [];
          lessonModified = true;
        }
      }
    }
    if (lesson.stages) {
      for (const s of lesson.stages) {
        if (s.tasks && Array.isArray(s.tasks)) {
          s.tasks = [];
          lessonModified = true;
        }
      }
    }

    // 3. Update root lesson.sources
    if (lesson.sources && Array.isArray(lesson.sources)) {
      for (let s of lesson.sources) {
        const update = sourceUpdates[s.id];
        if (update) {
          Object.assign(s, update);
          if (s.image) s.src = s.image;
          updatedSourcesCount++;
          lessonModified = true;
        }
      }
    }

    // 4. Update stage.sources
    if (lesson.stages && Array.isArray(lesson.stages)) {
      for (const stage of lesson.stages) {
        if (stage.sources && Array.isArray(stage.sources)) {
          for (let s of stage.sources) {
            const update = sourceUpdates[s.id];
            if (update) {
              Object.assign(s, update);
              if (s.image) s.src = s.image;
              lessonModified = true;
            }
          }
        }
      }
    }

    // 4b. Also update narrative_blocks sources if present
    if (lesson.narrative_blocks && Array.isArray(lesson.narrative_blocks)) {
      for (const b of lesson.narrative_blocks) {
        if (b.sources && Array.isArray(b.sources)) {
          for (let s of b.sources) {
            const update = sourceUpdates[s.id];
            if (update) {
              Object.assign(s, update);
              if (s.image) s.src = s.image;
              lessonModified = true;
            }
          }
        }
      }
    }

    // 5. Update flashcards and cloze text if defined in curriculumAlignments
    const align = curriculumAlignments[lesson.id];
    if (align) {
      if (align.flashcards) {
        lesson.flashcards = align.flashcards;
        lessonModified = true;
      }
      if (align.vocab_cloze_text) {
        lesson.vocab_cloze_text = align.vocab_cloze_text;
        lessonModified = true;
      }
    }

    if (lessonModified) {
      updatedLessonsCount++;
    }
  }

  console.log(`Updated ${updatedSourcesCount} source entries across ${updatedLessonsCount} lessons.`);

  // Serialize back to units/usa/data.js
  const serialized = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
  fs.writeFileSync(dataJsPath, serialized, 'utf8');
  console.log(`✅ Saved units/usa/data.js (${fs.statSync(dataJsPath).size} bytes)`);

  // Also sync to public/units/usa/data.js
  const pubDataJsPath = path.join(ROOT, 'public', 'units', 'usa', 'data.js');
  fs.writeFileSync(pubDataJsPath, serialized, 'utf8');
  console.log(`✅ Saved public/units/usa/data.js (${fs.statSync(pubDataJsPath).size} bytes)`);

  // Also sync to public/data/usa.json and data/usa.json
  const jsonStr = JSON.stringify(data, null, 2);
  const pubJsonPath = path.join(ROOT, 'public', 'data', 'usa.json');
  const rootJsonPath = path.join(ROOT, 'data', 'usa.json');
  fs.writeFileSync(pubJsonPath, jsonStr, 'utf8');
  fs.writeFileSync(rootJsonPath, jsonStr, 'utf8');
  console.log(`✅ Synchronized public/data/usa.json and data/usa.json`);
}

applyFixes().catch(err => {
  console.error('Fatal error applying fixes:', err);
  process.exit(1);
});
