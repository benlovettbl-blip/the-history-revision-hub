const fs = require('fs');

// Calibrated 12-mark questions for usa (Strictly 200-240 words for tier_12m, 3 paras, each ending in 'Therefore, this...')
const usa12mUpdates = {
  "usa_mock_1_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "Black Americans faced segregation and discrimination in the South in the 1950s because of Jim Crow laws that separated Black and white people. The Supreme Court had said segregation was legal in Plessy v Ferguson. Also the Ku Klux Klan used violence, burning crosses and lynching Black people who tried to stand up for their rights. Therefore Black people lived in fear and could not get equal treatment.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions Jim Crow, Plessy, and the KKK, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason Black Americans faced segregation was <strong>Supreme Court rulings like Plessy v Ferguson (1896)</strong>. The Supreme Court ruled that 'separate but equal' public facilities were constitutional under the 14th Amendment. Southern states used this legal precedent to enforce strict Jim Crow laws separating Black and white citizens on buses, trains, restaurants, and schools, although Black facilities were always inferior.<br><br>Another reason was the terror created by <strong>the Ku Klux Klan</strong>. The KKK was a white supremacist terrorist group that used beatings, cross burnings, and lynchings to terrorise Black communities. Because local sheriffs and judges were often Klan members, Klansmen committed racial murders with total impunity.<br><br>In conclusion, legal rulings and Klan violence enforced segregation in the South.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Plessy v Ferguson and the KKK). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as state-level disenfranchisement through poll taxes and literacy tests), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major factor entrenching segregation was the <strong>federal legal doctrine established by Plessy v. Ferguson (1896)</strong>. The US Supreme Court ruled that racial segregation did not violate the Fourteenth Amendment provided facilities were 'separate but equal'. Southern states exploited this constitutional loophole to enact Jim Crow laws segregating transport, schools, and hospitals, maintaining substandard facilities for Black citizens. Therefore, this caused widespread segregation because judicial rulings gave Southern states authority to enforce racial separation in every aspect of public life.<br><br>Furthermore, discrimination was brutally maintained through <strong>vigilante terrorism by the Ku Klux Klan</strong>. Re-emerging in the post-war era, the Klan used night-riding, church bombings, cross burnings, and lynchings to terrorise Black citizens who challenged the racial status quo. Crucially, local police officers, sheriffs, and judges were often active Klan sympathisers, shielding white perpetrators from criminal prosecution. Therefore, this forced Black Americans to endure discrimination because the pervasive threat of racial violence and state collusion made challenging segregation life-threatening.<br><br>In addition, segregation persisted through <strong>systematic political disenfranchisement across Southern states</strong>. To prevent Black Americans from electing reformist officials, state authorities enforced discriminatory voting barriers, including impossible literacy tests, grandfather clauses, and expensive poll taxes. As a result, less than 20% of eligible Southern Black adults were registered to vote by 1950. Therefore, this perpetuated discrimination because disenfranchisement stripped Black communities of political influence, leaving Southern white supremacists in unchallenged control of local law enforcement and government institutions.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (232 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "usa_mock_11_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "School desegregation met with huge opposition because white people in the South did not want Black children in their schools. When the Supreme Court ruled in Brown v. Board of Education that schools must mix, Southern politicians were furious. White Citizens' Councils were formed to stop integration and threatened Black parents. Therefore Southern whites fought hard to keep schools segregated.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions Brown, White Citizens' Councils, and resistance, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason for opposition was the anger over the <strong>Brown v. Board of Education ruling in 1954</strong>. Chief Justice Earl Warren declared that 'separate educational facilities are inherently unequal', ordering schools to desegregate. Southern segregationists felt their traditional way of life and state rights were being attacked by the federal government, sparking widespread fury across the South.<br><br>Another reason was the creation of <strong>White Citizens' Councils</strong>. Formed in Mississippi in 1954, these councils spread across the South with hundreds of thousands of middle-class white members. They used economic retaliation, sacking Black parents and denying bank loans to anyone who applied for their children to attend white schools.<br><br>In conclusion, the Brown ruling and White Citizens' Councils led to intense opposition against desegregation.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Brown v. Board and White Citizens' Councils). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as political 'Massive Resistance' and Governor Orval Faubus at Little Rock), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One primary cause of fierce opposition was the <strong>judicial breakthrough of Brown v. Board of Education (1954)</strong>. Led by Chief Justice Earl Warren, the Supreme Court unanimously overturned *Plessy*, ruling that segregated schools were 'inherently unequal' and unconstitutional. Southern whites viewed the decision as a tyrannical federal assault on states' rights and traditional Southern racial hierarchy. However, the subsequent 1955 'Brown II' ruling vaguely ordered desegregation 'with all deliberate speed', inviting Southern authorities to obstruct integration. Therefore, this caused massive resistance because Southern whites resisted federal intervention while exploiting vague judicial timelines to delay compliance.<br><br>Furthermore, opposition was mobilised by the <strong>rapid growth of middle-class White Citizens' Councils</strong>. Founded in Mississippi in 1954, these councils reached 250,000 members, using economic intimidation rather than Klan violence. Councils pressured banks to deny mortgages and forced employers to fire Black parents who attempted to enroll children in white schools, alongside boycotting white moderates. Therefore, this led to effective delays in desegregation because economic retaliation terrorised Black families into withdrawing desegregation petitions.<br><br>In addition, opposition was entrenched by <strong>political 'Massive Resistance' orchestrated by Southern governors</strong>. In 1956, 101 Southern congressmen signed the Southern Manifesto pledging to resist desegregation. In 1957, Governor Orval Faubus deployed the Arkansas National Guard to block the 'Little Rock Nine' from Central High School. Therefore, this forced intense political confrontation because state governors used state troops and legislative obstruction to directly defy federal integration orders.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (234 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "usa_mock_3_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "The civil rights movement grew between 1954 and 1960 because Black people were inspired by Rosa Parks who refused to give up her bus seat. The Montgomery Bus Boycott lasted over a year and proved that peaceful protests worked. Then Congress passed the 1957 Civil Rights Act and students started sit-ins at lunch counters. Therefore more Black people joined the fight for equal rights across America.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions Rosa Parks, the boycott, and lunch counters, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason the movement grew was the success of the <strong>Montgomery Bus Boycott of 1955–56</strong>. When Rosa Parks was arrested for refusing to give up her bus seat, Black residents boycotted city buses for 381 days. Led by Martin Luther King Jr., the boycott cost the bus company thousands of dollars until the Supreme Court integrated the buses, inspiring activists nationwide.<br><br>Another reason was the introduction of <strong>federal civil rights legislation</strong>. President Eisenhower passed the Civil Rights Act of 1957, the first civil rights law since Reconstruction, aimed at protecting voting rights. Although weak, it established a federal Civil Rights Commission to investigate abuses.<br><br>In conclusion, the Montgomery Boycott and federal legislation helped the civil rights movement expand.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Montgomery Boycott and legislation). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as the Brown v. Board legal victory and student-led direct action like the 1960 Greensboro sit-ins), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major catalyst for the movement's growth was the <strong>inspirational triumph of the Montgomery Bus Boycott (1955–56)</strong>. Sparked by Rosa Parks' arrest, the Black community maintained a 381-day boycott under the Montgomery Improvement Association led by Dr Martin Luther King Jr. Relying on carpools, activists inflicted heavy losses on the bus company until the Supreme Court ruled bus segregation unconstitutional in *Browder v. Gayle*. Therefore, this caused the movement to grow rapidly because it proved disciplined, non-violent mass collective action could defeat segregation and catapulted King into a nationally respected civil rights leader.<br><br>Furthermore, momentum was generated by the <strong>symbolic passage of federal civil rights legislation</strong>. In 1957 and 1960, the Eisenhower administration passed the first federal civil rights acts since Reconstruction. Although filibusters diluted enforcement, the 1957 Act established the Civil Rights Commission to monitor voter suppression. Therefore, this led to organizational expansion because federal legislative recognition demonstrated to activists that grassroots campaigning could successfully compel Washington to intervene in Southern racial affairs.<br><br>In addition, the movement expanded through <strong>youth direct action and the establishment of SNCC in 1960</strong>. In February 1960, four students staged a sit-in at a segregated Woolworth's lunch counter in Greensboro, North Carolina. Within weeks, the tactic spread to 55 cities, drawing 70,000 participants and leading to the Student Nonviolent Coordinating Committee (SNCC). Therefore, this accelerated movement growth because youth direct action expanded protests into nationwide student campaigns that forced commercial integration.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (233 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "usa_mock_7_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "The Montgomery Bus Boycott was successful because Black people refused to ride the buses for over a year after Rosa Parks was arrested. The Montgomery Improvement Association was led by Martin Luther King who made inspiring speeches in church. Black taxi drivers gave cheap rides and people walked miles to work. Finally the Supreme Court ruled segregation on buses was illegal. Therefore the boycott achieved its goal and buses were desegregated.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions Rosa Parks, King, walking, and the Supreme Court, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason the boycott succeeded was the leadership of the <strong>Montgomery Improvement Association (MIA)</strong>. Formed in December 1955, the MIA chose Dr Martin Luther King Jr. as its president. King organised regular church rallies to keep spirits high, organised carpools, and insisted on peaceful, non-violent Christian protest even when his home was bombed.<br><br>Another reason was the ruling of the <strong>US Supreme Court in Browder v. Gayle</strong>. In November 1956, the Supreme Court affirmed that segregation on public buses violated the Fourteenth Amendment. This legal decision overruled Alabama state laws and forced the city of Montgomery to integrate its buses on 21 December 1956.<br><br>In conclusion, the MIA's leadership and the Supreme Court ruling made the boycott a great success.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (MIA and Supreme Court). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as community economic solidarity, carpool logistics, and financial damage to the bus company), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One primary reason for success was the <strong>outstanding strategic leadership of the Montgomery Improvement Association (MIA)</strong>. Formed after Rosa Parks' arrest in December 1955, the MIA elected Dr Martin Luther King Jr. as president. King provided inspirational moral leadership, articulating non-violent resistance that kept the community unified and disciplined despite police harassment and the firebombing of his home. Therefore, this caused the boycott to succeed because King's charismatic leadership maintained community resolve and prevented protesters from resorting to violence that would justify police suppression.<br><br>Furthermore, the boycott triumphed through the <strong>decisive legal ruling of the US Supreme Court in *Browder v. Gayle* (1956)</strong>. While the boycott maintained street-level pressure, NAACP lawyers challenged Montgomery's bus segregation laws in federal court. In November 1956, the Supreme Court upheld the district court ruling that bus segregation violated the Fourteenth Amendment's Equal Protection Clause. Therefore, this led directly to the boycott's victory because the Supreme Court provided binding authority that legally forced Montgomery to desegregate public buses.<br><br>In addition, success was achieved through <strong>meticulous community logistics and devastating economic pressure</strong>. Black residents formed 70% of ridership; by boycotting buses for 381 days, they pushed the company into near-bankruptcy. The MIA organised a sophisticated carpool network of 300 private cars and church station wagons alongside Black taxi drivers offering discounted fares. Therefore, this forced city authorities to yield because prolonged economic devastation combined with unbreakable community self-sufficiency made continuing segregation commercially impossible.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (233 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "usa_mock_12_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "Opposition delayed civil rights progress between 1954 and 1960 because Southern politicians refused to obey the Supreme Court. Over 100 congressmen signed the Southern Manifesto promising to resist integration. Also the Ku Klux Klan attacked civil rights workers, bombing churches and beating Black people. Governors also closed down schools rather than let Black children in. Therefore civil rights made very slow progress in the South.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions the Southern Manifesto, KKK, and closed schools, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason opposition delayed progress was the <strong>Southern Manifesto of 1956</strong>. Signed by 101 Southern congressmen and senators, including Strom Thurmond, the document attacked the Supreme Court's *Brown* decision as an abuse of judicial power. It encouraged Southern state legislatures to enact laws preventing desegregation and defying federal authority.<br><br>Another reason was violent terrorism by the <strong>Ku Klux Klan (KKK)</strong>. The Klan reformed into violent klaverns, carrying out bombings, cross burnings, and murders of civil rights activists, such as the murder of Emmett Till in 1955. Their violence terrified Black communities and made them afraid to challenge segregation.<br><br>In conclusion, the Southern Manifesto and Klan terror successfully delayed civil rights progress.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Southern Manifesto and KKK). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as state-level 'Massive Resistance' closing public schools and White Citizens' Councils), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major factor delaying civil rights progress was the <strong>political defiance legitimised by the Southern Manifesto in 1956</strong>. Signed by 101 Southern congressmen, the manifesto denounced the *Brown* ruling as an abuse of power infringing states' rights. By giving federal political sanction to resistance, Southern congressmen encouraged state legislatures to enact hundreds of segregationist obstruction statutes. Therefore, this caused progress to be delayed because prominent national politicians legitimized open defiance of the Supreme Court, assuring Southern officials that federal orders could be safely disregarded.<br><br>Furthermore, progress was obstructed by the <strong>violent intimidation and domestic terrorism of the Ku Klux Klan</strong>. With police collusion, the KKK carried out bombings and murders, notably the 1955 murder of 14-year-old Emmett Till in Mississippi. All-white juries routinely acquitted white assailants despite overwhelming evidence. Therefore, this led directly to delayed progress because lethal violence and institutionalised judicial corruption terrorised rural Black communities into abandoning voter registration and integration efforts.<br><br>In addition, progress was impeded by <strong>state-sponsored 'Massive Resistance' and public school closures</strong>. Southern governors exploited the ambiguous phrase 'with all deliberate speed' from *Brown II* to block integration entirely. In Virginia, Senator Harry Byrd led policies that defunded integrated schools; Prince Edward County closed public schools for five years rather than integrate, funding private academies for whites. Therefore, this forced civil rights progress to stall because state governments proved willing to dismantle public education rather than comply with federal desegregation mandates.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (233 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "usa_mock_9_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "The Birmingham Campaign was launched in 1963 because Birmingham, Alabama was the most segregated city in America. Dr Martin Luther King and the SCLC launched Project C to challenge racist businesses. They knew Police Commissioner Bull Connor was extremely violent and would attack peaceful protesters. By putting children into the marches, they got the attacks filmed on television. Therefore the campaign forced the city to desegregate.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions Birmingham, Project C, Bull Connor, and television, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason the campaign was launched was the SCLC's strategy of <strong>Project C (Confrontation)</strong>. After failing to achieve progress in Albany, Georgia in 1962, Dr King and Reverend Fred Shuttlesworth designed Project C to deliberately create public disruption. They planned peaceful marches, boycotts of downtown department stores, and lunch-counter sit-ins to provoke a crisis that could not be ignored.<br><br>Another reason was the notorious brutality of <strong>Police Commissioner Bull Connor</strong>. Connor was a vicious segregationist who had close ties to the Ku Klux Klan. The SCLC knew Connor would overreact with violence, using high-pressure fire hoses and police attack dogs against demonstrators, creating international media attention.<br><br>In conclusion, Project C and Bull Connor's racism made Birmingham the ideal battleground.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Project C and Bull Connor). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as Birmingham's reputation as 'Bombingham' and the SCLC's urgent need for a decisive victory after Albany), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One primary reason the campaign was launched was the <strong>SCLC's strategic design of Project C (Confrontation)</strong>. Following the disappointing Albany Campaign of 1962, where police avoided brutality, Martin Luther King Jr. developed 'Project C'. The plan aimed to apply coordinated direct action—boycotts of downtown stores, sit-ins, and street marches—to cause complete economic paralysis. Therefore, this caused the launch of the campaign because the SCLC needed a calculated direct-action crisis to compel municipal white business owners to negotiate desegregation.<br><br>Furthermore, Birmingham was deliberately selected due to the <strong>predictable, aggressive temperament of Police Commissioner Eugene 'Bull' Connor</strong>. Connor was a fierce white supremacist who used uncompromising force against civil rights activists. King recognised that Connor's authoritarian instincts would lead to severe police overreaction, contrasting peaceful demonstrators against brutal state aggression on national television. Therefore, this led directly to the campaign's launch because activists intentionally exploited Connor's predictable brutality to generate shocking media footage that would compel federal intervention.<br><br>In addition, the campaign was launched because <strong>Birmingham was the most violently segregated metropolis in the United States</strong>. Nicknamed 'Bombingham' after 50 bombings of Black homes and churches, the city closed public parks and pools to avoid integration. Local leader Reverend Fred Shuttlesworth appealed for SCLC assistance to dismantle total apartheid. Therefore, this forced the campaign's initiation because cracking the South's most entrenched citadel of white supremacy was essential to reviving national momentum for civil rights legislation.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (234 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "usa_mock_10_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "The campaign in Selma in 1965 was successful because Black people were trying to register to vote. State troopers attacked peaceful marchers on the Edmund Pettus Bridge on Bloody Sunday using tear gas and clubs. The shocking violence was shown on national television, which horrified the American public. President Lyndon B. Johnson then gave a famous speech and passed the Voting Rights Act. Therefore the marchers achieved voting rights.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions Bloody Sunday, television, LBJ, and the Voting Rights Act, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason the Selma campaign succeeded was the impact of <strong>televised media coverage of 'Bloody Sunday'</strong>. On 7 March 1965, 600 civil rights marchers crossing the Edmund Pettus Bridge were brutally attacked by Alabama state troopers using tear gas, whips, and billy clubs. Television networks interrupted regular programming to broadcast the violence, outraging 50 million American viewers.<br><br>Another reason was the intervention of <strong>President Lyndon B. Johnson</strong>. Outraged by the brutality, Johnson federalised the Alabama National Guard to protect marchers on their 54-mile march to Montgomery. He delivered an address to Congress echoing the movement's anthem 'We Shall Overcome' and introduced the Voting Rights Act.<br><br>In conclusion, television news and President Johnson's political support made Selma successful.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (televised media and LBJ). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as King's tactical leadership and the passage of the Voting Rights Act of 1965 banning literacy tests), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One primary reason for success was the <strong>national moral outrage generated by televised media coverage of 'Bloody Sunday'</strong>. On 7 March 1965, 600 peaceful marchers crossing the Edmund Pettus Bridge were charged by Alabama troopers using tear gas, whips, and clubs. Television networks interrupted regular evening broadcasts to show graphic footage of defenceless marchers being beaten unconscious. Therefore, this caused the campaign to succeed because shocking television imagery horrified 50 million white viewers nationwide, generating irresistible public demand for federal intervention.<br><br>Furthermore, the campaign achieved victory through the <strong>decisive political leadership of President Lyndon B. Johnson</strong>. Recognizing that the Civil Rights Act of 1964 had left voting disenfranchisement unresolved, Johnson intervened decisively. On 15 March 1965, he addressed Congress adopting the slogan 'We Shall Overcome', federalising National Guardsmen to protect marchers to Montgomery. Therefore, this led to campaign success because presidential power placed federal authority directly behind the protesters, making state obstruction impossible.<br><br>In addition, victory was secured by the <strong>strategic genius of Martin Luther King and passage of the Voting Rights Act of 1965</strong>. King selected Selma because only 1% of eligible Black adults were registered to vote, and his leadership maintained non-violence. In August 1965, Johnson signed the Voting Rights Act, outlawing literacy tests and authorising federal examiners to register voters. Therefore, this forced the realization of the campaign's ultimate objective because federal legislation permanently ended disenfranchisement, registering 250,000 Black voters by late 1965.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (234 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "usa_mock_13_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "The civil rights movement faced growing challenges after 1965 because riots broke out in Northern cities like Watts and Detroit. The Kerner Report said America was moving towards two separate societies. When Martin Luther King went to Chicago, he was hit by a brick and faced angry white mobs. Also younger activists like Malcolm X and the Black Panthers rejected non-violence. Therefore the movement split apart and lost white support.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions riots, Kerner Report, Chicago, and Black Panthers, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason for growing challenges was the <strong>findings of the Kerner Report in 1968</strong>. Commissioned by President Johnson after devastating ghetto riots in Watts, Detroit, and Newark, the report concluded that America was moving towards 'two societies, one black, one white—separate and unequal'. It highlighted systemic police brutality, unemployment, and poor housing, but white politicians refused to fund its anti-poverty recommendations.<br><br>Another reason was the failure of the <strong>Chicago Freedom Movement in 1966</strong>. Dr King moved into a Chicago slum to campaign against discriminatory housing practices. However, King faced violent hostility from white working-class residents and Mayor Daley outmanoeuvred him with vague promises.<br><br>In conclusion, urban poverty and the failure of Northern campaigns created huge obstacles for civil rights.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Kerner Report and Chicago Campaign). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as ideological fracture over Black Power, white backlash, and King's assassination in 1968), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major factor limiting progress was the <strong>deep structural economic inequalities highlighted by the Kerner Report (1968)</strong>. Investigating ghetto riots in Watts (1965) and Detroit, the Kerner Commission concluded America was 'moving toward two societies, one black, one white—separate and unequal'. Unlike Southern de jure segregation, Northern de facto economic deprivation in housing and employment could not be dismantled simply by passing federal voting laws. Therefore, this caused progress to stall because resolving entrenched socio-economic decay required billions in federal taxation that white voters and congressmen refused to authorise.<br><br>Furthermore, progress was obstructed by the <strong>fierce white resistance encountered during the Chicago Freedom Movement (1966)</strong>. Focusing on Chicago housing, King faced violent white mobs throwing bricks, remarking he had never seen such hatred in Alabama. Crucially, Chicago Mayor Richard Daley outmanoeuvred King with unfulfilled paper agreements. Therefore, this led directly to limitations in progress because Northern white working-class communities bitterly resisted residential integration, proving civil rights tactics were ineffective against systemic Northern prejudice.<br><br>In addition, the movement was crippled by <strong>internal ideological fractures over Black Power and the assassination of King</strong>. Frustrated by the slow pace of change, leaders like Stokely Carmichael popularized 'Black Power', rejecting non-violence and interracial cooperation. This radicalization and King's 1968 assassination alienated white allies, prompting conservative backlash under Richard Nixon. Therefore, this forced the movement into fragmentation because bitter ideological divisions destroyed the broad multiracial coalition that had delivered previous legislative triumphs.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (233 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "usa_mock_6_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "The USA was not able to win against the Vietcong because the Vietcong used guerrilla warfare. They built hidden booby traps like punji stick pits that injured American soldiers. The US tried to drop Agent Orange to kill the jungle, but this made Vietnamese peasants hate the Americans. The Vietcong also hid in underground tunnels. Therefore American soldiers could not find the enemy and could not defeat them.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions guerrilla warfare, booby traps, and Agent Orange, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason the USA could not win was the <strong>Vietcong's extensive use of booby traps</strong>. The Vietcong laid punji traps with sharpened bamboo sticks smeared with excrement, tripwires connected to grenades, and unexploded American bombs. These traps caused 11% of American deaths and 17% of wounds, causing constant fear among US patrols in the jungle.<br><br>Another reason was the <strong>US military's use of Agent Orange and defoliants</strong>. To strip away the dense jungle canopy that hid Vietcong fighters, US planes sprayed over 20 million gallons of toxic chemical herbicides. This poisoned crops and water supplies, causing horrific birth defects and alienating the rural population.<br><br>In conclusion, booby traps and the destruction caused by Agent Orange prevented a US victory.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (booby traps and Agent Orange). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as the Ho Chi Minh Trail and the Cu Chi tunnel network), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One primary reason the USA failed to win was the <strong>devastating psychological and physical toll of Vietcong booby traps</strong>. The Vietcong deployed concealed traps: sharpened bamboo punji stakes, landmines, and tripwire grenades. These hidden hazards caused 11% of all American deaths and 17% of disabling wounds. Therefore, this caused American failure because booby traps inflicted continuous casualties without pitched battles, destroying the combat morale of young conscript soldiers who never saw the enemy.<br><br>Furthermore, the US war effort was crippled by the <strong>counterproductive destruction caused by chemical defoliants like Agent Orange</strong>. To strip jungle foliage, the US Air Force sprayed 20 million gallons of herbicides under Operation Ranch Hand. However, this poisoned water supplies, devastated rural farming livelihoods, and caused catastrophic birth defects. Therefore, this led directly to US defeat because chemical warfare completely alienated the South Vietnamese peasantry, driving thousands of recruits into the arms of the Vietcong insurgency.<br><br>In addition, the US military was outmanoeuvred by <strong>vast underground tunnel systems and the Ho Chi Minh Trail</strong>. Networks like the 250-kilometre Cu Chi tunnels provided the Vietcong with bomb-proof barracks, hospitals, and weapons caches beneath US bases. Simultaneously, the Ho Chi Minh Trail delivered 60 tons of Soviet and Chinese supplies daily. Therefore, this forced the war into an unwinnable stalemate because massive US aerial bombardment could neither sever enemy logistics nor locate guerrilla fighters operating underground.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (233 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "usa_mock_8_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "Search and Destroy tactics failed between 1965 and 1968 because American troops in helicopters could not find the Vietcong who hid among ordinary villagers. The Vietcong used guerrilla tactics to set ambushes and then disappear into the jungle. US soldiers got frustrated and burned villages with Zippo lighters, which ruined the hearts and minds campaign. Therefore the local people supported the Vietcong instead of America.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions helicopters, Zippo lighters, and hearts and minds, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason Search and Destroy failed was the <strong>effectiveness of Vietcong guerrilla tactics</strong>. The Vietcong used hit-and-run ambushes, attacking US patrols at close range ('grabbing them by the belt') so American artillery could not be used. When US troops landed in helicopters, the Vietcong vanished into tunnels or melted into local villages without uniforms.<br><br>Another reason was the total failure to win <strong>'hearts and minds' of the Vietnamese people</strong>. General Westmoreland judged success by body counts. US soldiers burned peasant huts in 'Zippo raids', killed livestock, and destroyed rice paddies. This brutality made ordinary peasants hate the Americans.<br><br>In conclusion, guerrilla warfare and losing hearts and minds made Search and Destroy ineffective.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (guerrilla tactics and hearts and minds). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as civilian atrocities like the 1968 My Lai massacre and the flawed 'body count' metric), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major reason Search and Destroy tactics failed was the <strong>superiority of Vietcong asymmetric guerrilla tactics</strong>. The Vietcong fought at close quarters ('hanging onto belts') to prevent US forces from calling in artillery and air strikes. Because the guerrillas wore peasant clothes and retreated instantly into complex underground tunnel complexes, American patrols rarely caught enemy units in open battle. Therefore, this caused Search and Destroy to fail because high-technology firepower was rendered useless against an elusive enemy that dictated every engagement.<br><br>Furthermore, the tactic catastrophically undermined the <strong>essential struggle to win the 'hearts and minds' of the rural peasantry</strong>. Searching for guerrillas, US troops carried out 'Zippo raids', torching peasant huts, killing livestock, and burning grain stores. These scorched-earth operations generated millions of destitute rural refugees. Therefore, this led directly to tactical failure because brutal search missions alienated ordinary villagers, driving agrarian communities into actively supplying intelligence, shelter, and recruits to the Vietcong.<br><br>In addition, the strategy was fatally compromised by its <strong>reliance on inflated 'body counts' and civilian atrocities</strong>. General Westmoreland measured success purely through enemy deaths rather than territory secured. Pressure for high body counts encouraged indiscriminate killing, culminating in the 1968 My Lai massacre where US soldiers murdered over 500 unarmed villagers. Therefore, this forced the complete moral collapse of the strategy because slaughtering non-combatants destroyed international legitimacy and convinced the Vietnamese population that American troops were brutal foreign oppressors.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (233 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "usa_mock_2_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "US involvement changed under Nixon because American people were sick of the war. Nixon introduced Vietnamisation to train the South Vietnamese army so American troops could come home. He also announced the Nixon Doctrine saying Asian nations must defend themselves. However, Nixon secretly bombed Cambodia to destroy communist supply lines. Therefore Nixon reduced US ground soldiers while expanding air bombing.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions Vietnamisation, Nixon Doctrine, and Cambodia, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason involvement changed was the introduction of <strong>Vietnamisation in 1969</strong>. Nixon aimed to withdraw US combat troops while building up the South Vietnamese Army (ARVN) with modern American weapons, tanks, and helicopters so they could fight the war themselves. Between 1969 and 1972, Nixon reduced US troop numbers from 543,000 to under 50,000.<br><br>Another reason was the adoption of the <strong>Nixon Doctrine</strong>. Announced in Guam in 1969, the doctrine stated that the USA would honour treaty commitments and provide nuclear protection, but Asian allies had to supply their own ground troops for defence.<br><br>In conclusion, Vietnamisation and the Nixon Doctrine shifted the fighting onto the ARVN.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Vietnamisation and Nixon Doctrine). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as domestic anti-war pressure and expanding aerial bombing into Cambodia and Laos), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major reason for changed involvement was the <strong>implementation of Vietnamisation from 1969 onwards</strong>. Faced with anti-war protests, Nixon withdrew US ground forces while supplying the South Vietnamese Army (ARVN) with artillery, aircraft, and training. Consequently, US troop deployments plummeted from 543,000 in 1969 to under 25,000 by 1972. Therefore, this caused a profound change in US policy because it transformed America's role from fighting a direct ground war to providing technological and logistical support to local South Vietnamese forces.<br><br>Furthermore, policy shifted due to the <strong>overarching geopolitical realignment of the Nixon Doctrine (1969)</strong>. Outlined in Guam, the doctrine declared that while the US would maintain its nuclear umbrella and treaty alliances, Asian nations were now responsible for providing their own ground troops for military defence. Nixon recognized that American public opinion would no longer tolerate open-ended foreign troop commitments. Therefore, this led directly to reduced direct military intervention because Washington formally abandoned the open-ended interventionist policies established under the Truman Doctrine.<br><br>In addition, involvement changed through <strong>Nixon's aggressive aerial escalation into Cambodia and Laos</strong>. While withdrawing ground troops to placate domestic voters, Nixon authorised secret B-52 bombing (Operation Menu) and incursions into Cambodia to cut the Ho Chi Minh Trail. Therefore, this forced a major transformation in military strategy because Nixon compensated for withdrawing American infantry by drastically expanding covert aerial warfare across Indochina.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (232 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "usa_mock_4_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "There was opposition to the Vietnam War because people watched television news every night showing American soldiers dying and burning villages. Also young men hated the draft system because it seemed unfair that rich college boys could avoid the draft while working-class and Black men were sent to fight. Protests spread to universities like Kent State where four students were shot dead. Therefore millions protested to end the war.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions TV news, the draft, and Kent State, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason for opposition was <strong>television and media coverage of the war</strong>. Vietnam was the first 'living-room war', with journalists broadcasting uncensored footage of combat, casualties, and burning villages. When respected news anchor Walter Cronkite declared the war was an unwinnable stalemate after the 1968 Tet Offensive, millions of Americans lost faith in the government.<br><br>Another reason was the unfairness of <strong>the military draft system</strong>. The Selective Service system conscripted young men aged 18 to 26. Because middle-class college students could get deferments, working-class and Black Americans were drafted in disproportionate numbers, leading to mass draft-card burnings.<br><br>In conclusion, media reports and the draft system caused immense public protest against the war.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (media and the draft). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as atrocities like My Lai and the killing of students at Kent State in 1970), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One primary cause of anti-war opposition was <strong>uncensored television and media coverage of the conflict</strong>. As the first 'living-room war', networks broadcast raw combat footage into American homes each evening, showing body bags and casualties. Crucially, following the 1968 Tet Offensive, CBS anchorman Walter Cronkite declared the war an unwinnable stalemate, shattering government claims that victory was near. Therefore, this caused public opposition to surge because transparent media reporting exposed a profound 'credibility gap' between upbeat official Pentagon statements and the grim reality of military stalemate.<br><br>Furthermore, protest was fuelled by the <strong>glaring social and racial inequality of the military draft system</strong>. The draft conscripted men aged 18 to 26, but granted college deferments to middle-class youths. Consequently, working-class and Black Americans were drafted in disproportionate numbers. Therefore, this led to furious domestic resistance because young people viewed the draft as an immoral system that forced underprivileged citizens to fight in an unjust foreign war.<br><br>In addition, opposition escalated due to <strong>horrific civilian atrocities and domestic state violence against protesters</strong>. In 1969, revelations of the My Lai massacre of 500 civilians shocked the public. In May 1970, National Guardsmen shot dead four student protesters at Kent State University. Therefore, this forced widespread anti-war mobilisations because blatant war crimes and the killing of student demonstrators convinced millions that the conflict was morally corrupting American democracy.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (234 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_4_2_can_q1": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "President Nixon introduced Vietnamization in 1969 because too many American soldiers were dying in Vietnam. The 1968 Tet Offensive had shocked everyone and proved the communists were not beaten. The American public held huge anti-war marches and demanded that troops come home. So Nixon decided to train South Vietnamese soldiers to fight while American soldiers returned home. Therefore Nixon started bringing US soldiers back to America.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions casualties, the Tet Offensive, and bringing troops home, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason Nixon introduced Vietnamization was the <strong>heavy toll of rising American military casualties</strong>. By 1968, over 30,000 US soldiers had been killed in Vietnam, with weekly death counts exceeding 500. This heavy loss of life created widespread grief and anger at home, turning public opinion against continuing the war.<br><br>Another reason was the psychological impact of the <strong>Tet Offensive in January 1968</strong>. Over 80,000 communist fighters launched coordinated attacks across 100 cities. Although the US military repelled the offensive, it proved that the Vietcong could still launch massive attacks, destroying President Johnson's political credibility.<br><br>In conclusion, heavy casualties and the Tet Offensive convinced Nixon to adopt Vietnamization.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (rising casualties and Tet Offensive). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as domestic electoral pressure and fulfilling Nixon's promise of 'peace with honor'), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major reason President Nixon introduced Vietnamization was the <strong>unsustainable domestic political cost of rising American casualties</strong>. By late 1968, US battle deaths exceeded 30,000, with weekly casualties routinely surpassing 500 conscripts. This rising death toll triggered public outrage, draft card burnings, and mass Moratorium marches across American cities. Therefore, this forced Nixon to introduce Vietnamization because continuing a war requiring continuous high casualties among American soldiers was politically unsustainable for an elected president.<br><br>Furthermore, policy change was compelled by the <strong>shattering psychological aftermath of the January 1968 Tet Offensive</strong>. When communist troops attacked over 100 towns and breached the US Embassy in Saigon, official credibility collapsed. Tet conclusively demonstrated to political leaders that massive US ground intervention had failed to destroy the communist insurgency. Therefore, this led directly to Vietnamization because the offensive proved a decisive military victory was unattainable, convincing policymakers that American ground forces must be phased out.<br><br>In addition, Nixon introduced the policy to <strong>fulfill his 1968 election campaign pledge of securing 'peace with honour'</strong>. Having campaigned on a 'secret plan' to end the conflict, Nixon needed a strategy that allowed US disengagement without abandoning South Vietnam to immediate communist conquest. Equipping the ARVN with modern tanks and artillery allowed Nixon to withdraw troops while claiming to preserve South Vietnamese independence. Therefore, this caused the adoption of Vietnamization because equipping local forces provided a face-saving exit strategy that facilitated American military withdrawal.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (232 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "usa_mock_5_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "The USA was involved in peace negotiations in 1972–73 because Nixon wanted to end the war and get all American prisoners of war back home. Vietnamisation had allowed many US troops to leave, but the North Vietnamese kept sending supplies down the Ho Chi Minh Trail. Nixon also visited China and Russia to get them to pressure North Vietnam. Finally they signed the Paris Peace Accords in 1973. Therefore the US was able to withdraw from the war.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions prisoners of war, the Ho Chi Minh Trail, and Paris Accords, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason the USA negotiated was the progress of <strong>Vietnamisation</strong>. By 1972, President Nixon had withdrawn almost all US combat troops, leaving fewer than 25,000 soldiers in South Vietnam. Because the American public refused to allow ground troops to return, Nixon had to use diplomacy to secure a peace deal and retrieve captured US pilots.<br><br>Another reason was the failure to shut down the <strong>Ho Chi Minh Trail</strong>. Despite dropping millions of tons of bombs on Laos and Cambodia, the North Vietnamese continued moving troops and artillery south along the trail, proving that US military power could not prevent North Vietnam from fighting.<br><br>In conclusion, troop withdrawals under Vietnamisation and the failure to block the trail forced the US to negotiate.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Vietnamisation and Ho Chi Minh Trail). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as triangular diplomacy with Beijing and Moscow, and the December 1972 Christmas Bombings), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One primary reason the USA pursued negotiations was the <strong>advanced state of Vietnamisation and domestic war weariness</strong>. By late 1972, Nixon had withdrawn over 500,000 troops, leaving fewer than 25,000. With the public exhausted and Congress threatening to cut funds, escalation was impossible. Therefore, this forced the USA into negotiations because diplomacy represented the only viable mechanism to exit the conflict, secure the return of 591 American prisoners of war, and fulfill Nixon's promise of 'peace with honour'.<br><br>Furthermore, negotiations were compelled by the <strong>inability of US air power to sever the Ho Chi Minh Trail</strong>. Running through Laos and Cambodia, this corridor supplied North Vietnamese units with thousands of tons of Soviet and Chinese weapons. Even after years of heavy B-52 carpet bombing, supply lines remained resilient. Therefore, this led directly to peace talks because American military leadership recognized that air strikes alone could never choke off communist logistics or force North Vietnam into unconditional surrender.<br><br>In addition, negotiations were unlocked through <strong>Nixon's 'triangular diplomacy' with Moscow and Beijing</strong>. By visiting Beijing in February 1972 and signing the SALT I treaty in Moscow in May 1972, Nixon successfully exploited the Sino-Soviet split. Both communist superpowers, seeking improved economic relations with Washington, pressured North Vietnam to negotiate pragmatically. Therefore, this caused a diplomatic breakthrough because isolating Hanoi from unconditional superpower backing made the signing of the January 1973 Paris Peace Accords possible.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (233 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  }
};

module.exports = { usa12mUpdates };
