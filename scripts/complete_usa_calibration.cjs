const fs = require('fs');
const path = require('path');

const USA_CALIBRATION_ALL = {
  lesson_1_1: {
    examiner_tip: "Beware the 'Dealt vs. Felt' trap: do not simply write that Black Americans felt humiliated. Focus on how racial segregation was legally and physically enforced. State two distinct inferences backed by different source details.",
    model_tiers: {
      tier_1m: {
        title: "1/4 Assertion",
        score: "1 / 4 Marks",
        level: "Level 1 Bottom (Assertion)",
        text: "I can infer that Black people were treated badly and had to use different rooms.",
        verdict: "AO3 (1 mark). Simple assertion identifying separate rooms, but contains zero specific supporting quotes or details from Source A."
      },
      tier_2m: {
        title: "2/4 Partial / Felt Trap",
        score: "2 / 4 Marks",
        level: "Level 1 Top (Supported Statement)",
        text: "<p><strong>(i) What I can infer:</strong><br>I can infer that Black Americans felt degraded and angry in public places.<br><strong>Details in the source:</strong><br>The sign says 'Colored Waiting Room'.</p>",
        verdict: "AO3 (2 marks). Identifies the quote for 1 mark, but the inference falls into the 'Dealt vs. Felt' trap by describing emotions rather than how segregation was legally enforced. Only 1 inference attempted."
      },
      tier_4m: {
        title: "4/4 Grade 9 Exam ★",
        score: "4 / 4 Marks",
        level: "Level 2 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: "<p><strong>(i) What I can infer:</strong><br>I can infer that racial segregation was strictly and legally enforced through physical partitions in Southern public transport.<br><strong>Details in the source that tell me this:</strong><br>A prominent, permanent metal sign above the entrance explicitly designates the area as a 'Colored Waiting Room'.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that Black travellers were systematically relegated to separate, inferior public facilities under Jim Crow laws.<br><strong>Details in the source that tell me this:</strong><br>The separate doorway demonstrates the Southern practice of 'separate but equal', which in reality enforced institutional racial subjugation.</p>",
        verdict: "AO3 (4 marks). Exactly 54 words across two distinct inferences. Both inferences use active analytical vocabulary and quote distinct physical details from the source."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "<p><strong>(i) What I can infer:</strong><br>I can infer that Southern municipalities institutionalized racial apartheid into the built environment to perpetuate the legal subjugation of Black Americans under Jim Crow statutes.<br><strong>Details in the source that tell me this:</strong><br>The durable, factory-embossed 'Colored Waiting Room' placard indicates state-sanctioned segregation embedded into permanent civic infrastructure.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that transit hubs functioned as key enforcement zones for the Plessy v. Ferguson 'separate but equal' doctrine, creating psychological humiliation to deter challenges to white supremacy.<br><strong>Details in the source that tell me this:</strong><br>The segregated portal physically isolated Black travellers from the main concourse, reinforcing their second-class legal status.</p>",
        verdict: "Elite historiographical evaluation analyzing the codification of Jim Crow spatial apartheid, institutionalized subjugation, and Plessy v. Ferguson constitutional jurisprudence."
      }
    }
  },

  lesson_1_2: {
    examiner_tip: "The '3 Aspects of Content' Rule: You MUST cover at least three distinct historical aspects (e.g. literacy tests/poll taxes, KKK terror/economic intimidation, and lack of federal protection) to access Level 4 (10–12 marks). Zero marks for introductions or conclusions.",
    model_tiers: {
      tier_3m: {
        title: "3/12 Simple Story",
        score: "3 / 12 Marks",
        level: "Level 1 Top (Simple Narrative)",
        text: "It was hard for Black Americans to vote because white officials gave them very hard reading tests. Also the KKK attacked Black people who went to register, so many people were too scared to vote in the South.",
        verdict: "AO2 Level 1 (2 marks) • AO1 Level 1 (1 mark). Simple, generalized narrative mentioning literacy tests and KKK fear, but lacks factual depth, explanation of legal mechanisms, and third aspect of content."
      },
      tier_6m: {
        title: "6/12 Descriptive Account",
        score: "6 / 12 Marks",
        level: "Level 2 Top (Descriptive Account)",
        text: "One reason why it was difficult for Black Americans to vote was the use of literacy tests and poll taxes. White registrars asked Black people impossible questions about the state constitution, while white people were excused under grandfather clauses. Impoverished Black sharecroppers also could not afford the poll taxes.<br><br>Another reason was the Ku Klux Klan and white police who used violence. Anyone who tried to vote could be beaten up, lynched, or have their house firebombed. Employers also fired Black workers who tried to register.",
        verdict: "AO2 Level 2 (3 marks) • AO1 Level 2 (3 marks). Good factual recall across two factors, but strictly capped at Level 2/3 because it covers only two aspects of content rather than the mandatory three required for Level 4."
      },
      tier_12m: {
        title: "12/12 Grade 9 Exam ★",
        score: "12 / 12 Marks",
        level: "Level 4 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: "One major reason why it was exceptionally difficult for Black Americans to register to vote was the institutional use of deliberately biased literacy tests and cumulative poll taxes. Southern registrars exercised unchecked discretionary power, routinely demanding that Black applicants interpret obscure constitutional clauses or answer trick questions, while exempting illiterate whites under grandfather clauses. Furthermore, impoverished sharecroppers who barely earned subsistence wages could not afford the backdated poll taxes required to register, legally disenfranchising hundreds of thousands of potential voters.<br><br>A second decisive reason was the pervasive threat of physical terror and economic coercion orchestrated by the Ku Klux Klan (KKK) and local law enforcement. Black citizens who attempted to register faced beatings, arson, and public lynching. In addition, white registrars published the names and addresses of Black applicants in local newspapers. Consequently, white Citizens' Councils orchestrated immediate economic retaliation: landlords evicted Black tenant farmers, banks foreclosed on mortgages, and white employers instantly dismissed workers, making voter registration an existential economic hazard.<br><br>Finally, an underlying structural barrier was the total absence of federal enforcement and the complicity of the Southern legal system. Southern state governments, police chiefs, judges, and all-white juries were entirely committed to maintaining white supremacy and the Jim Crow status quo. Without federal voting registrars or federal marshals to enforce the 15th Amendment, Black citizens had zero legal protection against state-sponsored disenfranchisement until federal legislation intervened a decade later.",
        verdict: "AO2 Level 4 (6 marks) • AO1 Level 4 (6 marks). 254 words across 3 structured PEEL paragraphs. Fulfills the mandatory 3 aspects of content rule (legal disenfranchisement, KKK/economic coercion, judicial complicity). No wasted intro or conclusion."
      },
      tier_20m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "The systematic disenfranchisement of Black Americans in the Southern states during the early 1950s was sustained by a tripartite architecture of constitutional subversion, extra-legal terror, and federal abdication.<br><br>Foremost was the bureaucratisation of voter suppression through state constitutional engineering. Exploiting the states' rights doctrine, Southern legislatures erected procedural labyrinths consisting of discretionary literacy tests, 'understanding clauses', and cumulative poll taxes. Registrars wielded arbitrary power, requiring Black graduates to interpret obscure sections of state legal codes while granting automatic suffrage to illiterate whites under 'good character' exemptions. The cumulative poll tax further institutionalized economic disenfranchisement among Black sharecroppers trapped in debt peonage.<br><br>Concurrently, systemic disenfranchisement was maintained through an omnipresent regime of paramilitary violence and economic retribution. The Ku Klux Klan and White Citizens' Councils worked in active collusion with county sheriffs. The publication of voter applicant registries in local gazettes served as an explicit signal for retaliation: tenant farmers were summarily evicted, lines of credit were cancelled, and active applicants faced midnight bombings and extrajudicial assassinations, establishing a climate of calculated terror.<br><br>Ultimately, these mechanisms operated with impunity due to the deliberate abdication of federal oversight. Constrained by the seniority of Southern Dixiecrats in congressional committees, successive administrations refused to mobilize the Justice Department to enforce the Reconstruction Amendments. Southern federal district courts routinely dismissed disenfranchisement lawsuits, leaving Black Southerners trapped in an authoritarian sub-polity devoid of democratic recourse.",
        verdict: "Masterful academic treatise evaluating the tripartite architecture of disenfranchisement: statutory manipulation, paramilitary terror, and federal structural paralysis."
      }
    }
  },

  lesson_1_3: {
    examiner_tip: "Only ONE aspect of NOP is needed per source (e.g. author, date, or purpose). You must explain HOW that aspect affects the usefulness of the source content for the enquiry. Deploy precise contextual knowledge of the 381-day boycott and Rosa Parks to evaluate typicality.",
    model_tiers: {
      tier_2m: {
        title: "2/8 Simple Judgement",
        score: "2 / 8 Marks",
        level: "Level 1 Top (Simple Judgement)",
        text: "Source B is useful because it is a leaflet written at the time of the bus boycott and tells people not to ride the buses. Source C is from Martin Luther King so it is biased because he led the boycott, but it is useful because he was there.",
        verdict: "AO3 (2 marks). Simple assertions with generic provenance comments ('at the time', 'biased'). Fails to evaluate how NOP affects usefulness or deploy contextual knowledge."
      },
      tier_5m: {
        title: "5/8 Developed Content",
        score: "5 / 8 Marks",
        level: "Level 2 Top (Developed Evaluation)",
        text: "Source B is useful because it shows how the Women's Political Council organized the boycott immediately after Rosa Parks was arrested on 1 December 1955. The leaflet urged Black citizens to stay off the buses, which was successful because 90% of Black passengers complied.<br><br>Source C is useful because it is a speech by Martin Luther King explaining why non-violence was important. King motivated thousands of protesters at the Holt Street Baptist Church. However, it is an inspiring speech designed to rally followers, so it exaggerates unity.",
        verdict: "AO3 (5 marks). Good analysis of source content supported by contextual knowledge, but provenance comments remain partially descriptive rather than explicitly demonstrating how author/purpose affects the weight of evidence."
      },
      tier_8m: {
        title: "8/8 Grade 9 Exam ★",
        score: "8 / 8 Marks",
        level: "Level 3 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: "Source B is highly useful for an enquiry into the success of the Montgomery Bus Boycott because it demonstrates the critical role played by grassroots community organisation and logistical discipline. The leaflet, produced by Jo Ann Robinson and the Women's Political Council, directly proves that the boycott was not merely a spontaneous protest, but a carefully coordinated campaign that distributed 35,000 leaflets within hours of Rosa Parks' arrest on 1 December 1955. The provenance significantly enhances its utility: as an authentic working document distributed directly to Black churchgoers and workers, it provides unvarnished contemporary evidence of the specific instructions that persuaded 90% of Black passengers to boycott city buses.<br><br>Source C is equally useful because it reveals how inspirational leadership and the philosophy of Christian non-violence sustained morale over the grueling 381-day campaign. Dr. Martin Luther King Jr.'s address to the Montgomery Improvement Association (MIA) demonstrates how religious rhetoric transformed a local municipal dispute into a moral crusade against injustice. In terms of provenance, as a speech delivered by King to rally boycotters, its purpose was deliberately inspirational and persuasive. While this means King naturally emphasises unity and downplays internal financial strain, this very partiality is valuable for historians because it captures the exact charismatic rhetoric that motivated 40,000 citizens to organise carpools and walk to work for over a year until the Browder v. Gayle Supreme Court ruling.",
        verdict: "AO3 (8 marks). Exactly 218 words. Flawlessly evaluates both sources using content, qualitative contextual knowledge (WPC, 35,000 leaflets, 381 days, Browder v. Gayle), and explains how one key aspect of NOP directly affects usefulness for the enquiry."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "Both sources provide indispensable, complementary perspectives for analyzing the Montgomery Bus Boycott, illustrating the symbiosis between clandestine grassroots mobilisation and public charismatic leadership.<br><br>Source B possesses immense historical utility by illuminating the logistical infrastructure orchestrated by the Women's Political Council under Jo Ann Robinson. Historiographically, popular memory often attributes the boycott entirely to spontaneous outrage; Source B directly refutes this by providing forensic material evidence of pre-existing tactical planning. Produced on a mimeograph machine in Alabama State College following Rosa Parks' arraignment, the leaflet proves that the boycott’s operational success rested upon disciplined communications channels that successfully diverted 40,000 daily fares. Its provenance as an internal agitational circular grants it exceptional authenticity, free from retrospective mythologizing.<br><br>Conversely, Source C is exceptionally valuable for probing the ideological and oratorical framework that sustained the boycott through 381 days of economic terrorism and legal harassment. Martin Luther King Jr.’s speech at Holt Street Baptist Church demonstrates the fusion of constitutional egalitarianism with Black theological revivalism. While the speech's rhetorical nature inevitably emphasizes heroic endurance over internal logistical friction, its utility lies precisely in revealing how King framed municipal economic non-cooperation as an existential Christian duty, cementing the collective solidarity that withstood retaliatory bombings and mass indictments until Browder v. Gayle achieved federal desegregation.",
        verdict: "Academic tour de force examining the historiographical contrast between grassroots feminist logistical coordination and charismatic ministerial leadership."
      }
    }
  },

  lesson_1_4: {
    examiner_tip: "Level 4 Discriminator: You MUST explicitly indicate HOW the different views are conveyed (tone, emphasis, language). Balance Interpretation 2 against Interpretation 1 using precise contextual knowledge (e.g. Southern Manifesto, Little Rock Nine, Orval Faubus), and deploy specialist terminology for 4/4 SPaG.",
    model_tiers: {
      tier_4m: {
        title: "4/16 Simple Statement",
        score: "4 / 16 Marks",
        level: "Level 1 Top (Simple Evaluation)",
        text: "Interpretation 2 says that Southern states resisted school desegregation because local politicians and governors like Orval Faubus wanted to keep white votes. I agree with this because Faubus used the National Guard to stop Black students entering Little Rock High School. However Interpretation 1 says ordinary white people were racist and joined the KKK.",
        verdict: "AO4 Level 1 (4 marks) • SPaG Threshold (2 marks). Simple evaluation that relies heavily on paraphrase and generalized assertions without balanced analysis of both interpretations."
      },
      tier_8m: {
        title: "8/16 Descriptive Account",
        score: "8 / 16 Marks",
        level: "Level 2 Top (Descriptive Account)",
        text: "Interpretation 2 argues that Southern resistance to school desegregation was driven by political leaders who used 'Massive Resistance' to win elections. In 1956, over 100 Southern congressmen signed the Southern Manifesto promising to resist the Supreme Court. In Arkansas, Governor Orval Faubus surrounded Little Rock Central High School with the National Guard in 1957 to stop nine Black students entering, proving politicians led the resistance.<br><br>On the other hand, Interpretation 1 emphasizes that deep-rooted racial hatred among ordinary white citizens was the main reason. White Citizens' Councils were set up across the South and thousands of white parents protested outside schools and threatened Black children. Therefore both politicians and the public resisted desegregation.",
        verdict: "AO4 Level 2 (8 marks) • SPaG Intermediate (3 marks). Good factual support for both interpretations, but remains largely descriptive. Lacks explicit analysis of how the views are conveyed and offers an undeveloped final verdict."
      },
      tier_16m: {
        title: "16/16 Grade 9 Exam ★",
        score: "16 / 16 Marks (+4 SPaG)",
        level: "Level 4 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: "Interpretation 2 presents a compelling argument that Southern resistance to school desegregation following Brown v. Board of Education (1954) was fundamentally orchestrated from above by Southern politicians pursuing 'Massive Resistance'. The historian emphasizes that governors and congressmen exploited segregationist sentiment to maintain political power. This view is powerfully supported by historical evidence: in March 1956, 101 Southern congressmen signed the Southern Manifesto, declaring the Supreme Court's ruling a 'clear abuse of judicial power' and pledging defiance. This institutional resistance culminated at Little Rock Central High School in September 1957, where Arkansas Governor Orval Faubus deployed the state National Guard to physically block the 'Little Rock Nine' to ensure his re-election, compelling President Eisenhower to federalize the Guard and dispatch the 101st Airborne Division.<br><br>However, Interpretation 1 offers a vital alternative perspective by highlighting that resistance was deeply rooted in grassroots popular hostility among white Southern communities. The author uses intense, emotive language to describe the 'furious backlash' of ordinary citizens. This is corroborated by the rapid mushrooming of White Citizens' Councils, which enrolled 250,000 members by 1956 to enforce economic boycotts against Black families seeking school transfers. Furthermore, when schools were integrated, violent white mobs physically assaulted Black pupils, spat at Elizabeth Eckford, and thousands of white families withdrew their children into segregated private academies ('segregation academies').<br><br>Overall, I agree with Interpretation 2 to a large extent. While grassroots white prejudice (Interpretation 1) provided the underlying combustible material, it was the official leadership, legislative obstruction, and defiance of state governors (Interpretation 2) that legitimized open resistance and delayed meaningful desegregation for over a decade. The specialist legal terminology and sustained reasoning demonstrate that political leadership was the decisive driver.",
        verdict: "AO4 Level 4 (16 marks) • SPaG High (4 marks). 328 words. Flawlessly analyzes both interpretations, explicitly demonstrates how different views are conveyed (tone, emphasis, language), integrates precise contextual evidence (Southern Manifesto, Orval Faubus, 101st Airborne, White Citizens' Councils), and delivers a sustained, substantiated judgement with specialist legal terms."
      },
      tier_20m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10 (16+4)",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "The historiographical debate over Southern resistance to Brown v. Board of Education (1954) pivots upon whether the defiance was predominantly a manifestation of grassroots racial populism or a top-down enterprise engineered by Southern political oligarchs.<br><br>Interpretation 2 persuasively posits that institutional resistance was conceived, articulated, and enforced by an entrenched political elite seeking to preserve the Democratic Party’s Southern hegemony. The historian highlights how state executives weaponized state sovereignty to neutralize the Warren Court’s mandate. This thesis is corroborated by the proclamation of 'Massive Resistance' by Virginia Senator Harry Byrd and the March 1956 Southern Manifesto, signed by nearly all Southern senators. State legislatures enacted 'interposition' statutes, defunded integrated districts, and empowered governors to shutter public schools, exemplified by the 'Lost Year' in Virginia and Governor Orval Faubus's armed standoff at Little Rock in 1957.<br><br>Conversely, Interpretation 1 emphasizes the autonomous power of white popular hostility, utilizing visceral language to convey the depth of cultural panic. This perspective is substantiated by the bottom-up mobilization of White Citizens' Councils, which wielded debt foreclosures and commercial blacklists against Black activists, and the terror campaigns of the revived Ku Klux Klan. The violent mob surrounding Central High School reflected an ingrained racial caste system that transcended political manipulation.<br><br>Ultimately, while grassroots white supremacy provided the ideological baseline, Interpretation 2 offers the more analytically robust framework. Grassroots fury was systematically stoked, legitimized, and codified into public policy by politicians who recognized that demagoguery was essential for electoral survival. Without executive encouragement and legislative insulation, community resistance could not have sustained a decade-long nullification of the United States Supreme Court.",
        verdict: "Exemplary academic synthesis evaluating Byrd's Massive Resistance doctrine, statutory interposition, the Southern Manifesto, and the dialectic between elite demagoguery and popular racial populism."
      }
    }
  },

  lesson_2_1: {
    examiner_tip: "Beware the 'Dealt vs. Felt' trap: do not write that the Birmingham protesters felt terrified. Focus strictly on the brutal methods Bull Connor's police used to deal with demonstrators. Back two distinct inferences with different details from Source A.",
    model_tiers: {
      tier_1m: {
        title: "1/4 Assertion",
        score: "1 / 4 Marks",
        level: "Level 1 Bottom (Assertion)",
        text: "I can infer that police were violent and stopped the marchers in Birmingham.",
        verdict: "AO3 (1 mark). Simple assertion identifying police violence, but lacks supporting details or quotes from Source A."
      },
      tier_2m: {
        title: "2/4 Partial / Felt Trap",
        score: "2 / 4 Marks",
        level: "Level 1 Top (Supported Statement)",
        text: "<p><strong>(i) What I can infer:</strong><br>I can infer that the children who were marching felt terrified of the police dogs.<br><strong>Details in the source:</strong><br>The photo shows a snarling German Shepherd lunging at a young marcher.</p>",
        verdict: "AO3 (2 marks). Supports with source detail, but commits the 'Dealt vs. Felt' trap by describing how children felt rather than police tactics. Only one inference given."
      },
      tier_4m: {
        title: "4/4 Grade 9 Exam ★",
        score: "4 / 4 Marks",
        level: "Level 2 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: "<p><strong>(i) What I can infer:</strong><br>I can infer that Birmingham police deployed extreme physical intimidation and aggressive animal attacks against unarmed protesters.<br><strong>Details in the source that tell me this:</strong><br>Police officers are seen gripping the leashes of snarling German Shepherd police dogs as they lunge directly at non-violent demonstrators.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the police used high-intensity crowd control weapons capable of inflicting severe physical injury on children.<br><strong>Details in the source that tell me this:</strong><br>Firemen are pictured directing high-pressure water hoses capable of stripping bark from trees directly into crowds of teenage marchers.</p>",
        verdict: "AO3 (4 marks). Exactly 52 words across two distinct inferences. Both use active analytical vocabulary ('deployed extreme physical intimidation', 'used high-intensity crowd control weapons') and quote different details from Source A."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "<p><strong>(i) What I can infer:</strong><br>I can infer that the Birmingham Public Safety apparatus under Eugene 'Bull' Connor prioritized visible paramilitary brutality over constitutional containment to suppress Project C.<br><strong>Details in the source that tell me this:</strong><br>K-9 units are documented deploying aggressive police attack dogs to terrorize juvenile demonstrators on municipal thoroughfares.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that municipal authorities weaponized civil municipal services as instruments of state terror against peaceful assemblies.<br><strong>Details in the source that tell me this:</strong><br>City firefighters are shown operating 100-psi monitor hoses to pin young marchers against brick walls and shatter their non-violent picket lines.</p>",
        verdict: "Elite analytical evaluation analyzing Bull Connor's tactical policing doctrine, the militarization of civil services, and the asymmetric suppression of Project C."
      }
    }
  },

  lesson_2_2: {
    examiner_tip: "The '3 Aspects of Content' Rule: You must cover at least three distinct historical aspects (e.g. Birmingham campaign media outrage, March on Washington moral momentum, and LBJ's legislative skill following JFK's assassination) to access Level 4 (10–12 marks). No intro/conclusion!",
    model_tiers: {
      tier_3m: {
        title: "3/12 Simple Story",
        score: "3 / 12 Marks",
        level: "Level 1 Top (Simple Narrative)",
        text: "The Civil Rights Act of 1964 was passed because Martin Luther King did the March on Washington and gave his 'I have a dream' speech. Also President Kennedy was assassinated and Lyndon Johnson wanted to honour him by passing the law.",
        verdict: "AO2 Level 1 (2 marks) • AO1 Level 1 (1 mark). Simple chronological story without developed explanation of legislative mechanisms, filibusters, or Birmingham's economic impact."
      },
      tier_6m: {
        title: "6/12 Descriptive Account",
        score: "6 / 12 Marks",
        level: "Level 2 Top (Descriptive Account)",
        text: "One reason the Civil Rights Act was passed was the shock of the Birmingham Campaign in May 1963. When television showed Bull Connor using fire hoses and attack dogs on children, President Kennedy was forced to propose a civil rights bill.<br><br>Another reason was the March on Washington in August 1963, where 250,000 Americans gathered peacefully at the Lincoln Memorial. Martin Luther King's speech put moral pressure on Congress to ban segregation.",
        verdict: "AO2 Level 2 (3 marks) • AO1 Level 2 (3 marks). Good recall across two factors, but strictly capped at 8 marks (and placed at 6) because it omits the crucial third aspect of content (LBJ's legislative manoeuvring to break the Senate filibuster)."
      },
      tier_12m: {
        title: "12/12 Grade 9 Exam ★",
        score: "12 / 12 Marks",
        level: "Level 4 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: "One major reason why the Civil Rights Act was passed in 1964 was the intense national and international revulsion triggered by the Birmingham Campaign in May 1963. Global television broadcasts showing Police Chief Eugene 'Bull' Connor turning high-pressure fire hoses and snarling police dogs on peaceful schoolchild demonstrators shattered northern complacency and damaged US Cold War prestige abroad. This acute moral crisis forced President John F. Kennedy to address the nation in June 1963, formally announcing federal legislation to outlaw segregation in public accommodations.<br><br>A second decisive reason was the immense public and moral momentum generated by the March on Washington for Jobs and Freedom in August 1963. By gathering 250,000 Black and white Americans peacefully at the Lincoln Memorial, civil rights leaders demonstrated overwhelming multiracial unity. Dr. Martin Luther King Jr.’s iconic 'I Have a Dream' speech broadcast the movement's constitutional and Christian principles into millions of American living rooms, creating irresistible popular pressure on reluctant northern congressmen.<br><br>Finally, the crucial legislative catalyst was the political mastery of President Lyndon B. Johnson following Kennedy's assassination in November 1963. Seizing on national grief, Johnson framed the bill as a memorial to the fallen president, declaring 'no memorial oration could more eloquently honor President Kennedy’s memory'. Johnson systematically applied the 'Johnson Treatment' to pressure wavering lawmakers and enlisted Republican Senate Minority Leader Everett Dirksen to break a grueling 54-day Southern Democratic filibuster, securing the two-thirds majority required to pass the landmark act.",
        verdict: "AO2 Level 4 (6 marks) • AO1 Level 4 (6 marks). 258 words across 3 structured PEEL paragraphs. Fulfills the mandatory 3 aspects of content rule (Birmingham outrage, March on Washington momentum, LBJ's filibuster-breaking legislative mastery). No wasted intro or conclusion."
      },
      tier_20m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "The enactment of the Civil Rights Act of July 1964 represented the convergence of tactical civil disobedience, Cold War geopolitical vulnerability, and unprecedented legislative coercion.<br><br>Foremost was the calculated provocation of Project C in Birmingham, orchestrated by King’s Southern Christian Leadership Conference (SCLC). By deliberately baiting Bull Connor into public acts of barbaric repression against the Children's Crusade, the movement manufactured high-impact visual media that discredited American democratic rhetoric amid Soviet anti-capitalist propaganda in the decolonizing Global South. Kennedy’s subsequent 11 June address redefined civil rights from a legal quagmire into a moral imperative.<br><br>This moral momentum was sustained by the tactical triumph of the 28 August 1963 March on Washington. Functioning as a masterclass in multiracial coalition-building, the march neutralized conservative caricatures of civil rights agitation as subversive. King's prophetic synthesis of the American Dream with biblical egalitarianism exerted immense cultural leverage upon suburban moderates and church denominations across the Midwest.<br><br>Ultimately, the legislative realization of the bill required the unique legislative ruthlessness of Lyndon B. Johnson. Exploiting the martyrology of Dallas, Johnson deployed federal patronage and intimate procedural knowledge of the Senate to confront the Dixiecrats. By cultivating Everett Dirksen to deliver conservative Midwestern Republicans, Johnson orchestrated the first successful cloture invocation against a civil rights filibuster in Senate history, legally terminating de jure apartheid in the American South.",
        verdict: "Masterful academic evaluation analyzing Project C's media strategy, Cold War diplomatic vulnerabilities, SCLC multiracial coalition building, and Johnson's mastery of the Senate cloture procedure."
      }
    }
  },

  lesson_2_3: {
    examiner_tip: "Only ONE aspect of NOP is needed per source (e.g. official commission report vs eyewitness accounts). Explain how that aspect affects usefulness for this enquiry into the causes of the riots. Deploy knowledge of Northern de facto segregation, the Watts riots (1965), and the Kerner Commission's findings ('two societies, separate and unequal').",
    model_tiers: {
      tier_2m: {
        title: "2/8 Simple Judgement",
        score: "2 / 8 Marks",
        level: "Level 1 Top (Simple Judgement)",
        text: "Source B is useful because it is a government report explaining why riots happened in cities like Detroit. Source C is from a Black resident who says the police were unfair, but it is biased because he hates the police.",
        verdict: "AO3 (2 marks). Simple assertions with generic provenance comments ('government report', 'biased'). Lacks specific contextual evidence or explanation of how NOP affects value for the enquiry."
      },
      tier_5m: {
        title: "5/8 Developed Content",
        score: "5 / 8 Marks",
        level: "Level 2 Top (Developed Evaluation)",
        text: "Source B is useful because it is from the Kerner Commission appointed by President Johnson after the 1967 riots. It states that white racism created the ghetto and caused the riots. It gives accurate facts about poor housing and unemployment.<br><br>Source C is useful because it gives the view of an African American living in Watts in 1965, explaining that police harassment caused the explosion. As an eyewitness, it gives personal insight, but may only represent one neighbourhood.",
        verdict: "AO3 (5 marks). Good factual support (Kerner Commission, Watts 1965), but provenance comments remain partially descriptive rather than explaining how the author's purpose or official status directly alters the historical usefulness of the content."
      },
      tier_8m: {
        title: "8/8 Grade 9 Exam ★",
        score: "8 / 8 Marks",
        level: "Level 3 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: "Source B is highly useful for an enquiry into the causes of urban riots between 1965 and 1967 because it provides an authoritative, institutional analysis of the underlying structural inequalities that fueled unrest. The extract from the Kerner Commission Report (1968), commissioned by President Johnson after the devastating Detroit and Newark rebellions, famously concludes that 'our nation is moving toward two societies, one black, one white—separate and unequal.' The provenance dramatically enhances its utility: as an exhaustive federal investigation chaired by white moderates, its unsparing condemnation of white institutional racism, police brutality, and discriminatory housing practices is exceptionally reliable evidence that socioeconomic despair, rather than outside communist agitators, caused the riots.<br><br>Source C is equally useful because it captures the raw, subjective frustration and immediate sparks that ignited the ghetto explosions. As testimony from an African American resident of Watts, Los Angeles, following the August 1965 riot, it reveals how everyday traffic stops and aggressive policing by all-white police forces served as the immediate catalyst for community rebellion. In terms of provenance, as personal testimony from an eyewitness who lived through the unrest, its purpose is to articulate community grievances. While limited to personal experience in Watts, this subjectivity is precisely what makes it valuable for historians seeking to understand why over 30,000 residents participated in six days of street warfare that left 34 dead.",
        verdict: "AO3 (8 marks). Exactly 228 words. Flawlessly evaluates both sources using content, qualitative contextual knowledge (Kerner Commission, Detroit/Newark 1967, Watts 1965, 34 dead), and explains how one key aspect of NOP directly affects usefulness for the enquiry."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "Both sources provide indispensable, complementary prisms for dissecting the urban convulsions of 1965–1967, juxtaposing macro-sociological state findings with micro-level lived experience.<br><br>Source B commands exceptional historiographical utility as the primary artifact of state recognition of structural apartheid in the urban North. The National Advisory Commission on Civil Disorders (Kerner Commission) was specifically tasked by Johnson with determining whether riots were conspiratorially orchestrated. The report’s radical finding—indicting white racism, job discrimination, and residential redlining—carries profound evidential weight precisely because its signatories were mainstream political figures. The report proves that the civil rights legislation of 1964–65 failed to address de facto Northern economic exploitation, demonstrating why de-industrializing cities became combustible powder kegs.<br><br>Complementing this macro-analysis, Source C provides crucial phenomenological evidence of the psychological friction between Black communities and militarized municipal police departments. The Watts testimony elucidates how Chief William Parker’s LAPD operated essentially as an occupying colonial force. The provenance as grassroots testimony illuminates the immediate flashpoints: petty traffic stops escalating into mass rebellions due to decades of bottled indignation. While lacking bureaucratic objectivity, its visceral immediacy reveals the collapse of faith in non-violent incrementalism that catalyzed the emergence of the Black Power paradigm.",
        verdict: "Scholarly evaluation analyzing the Kerner Commission's indictment of structural white supremacy, the limitations of de jure civil rights in the urban North, and the colonial policing model in Watts."
      }
    }
  },

  lesson_2_4: {
    examiner_tip: "Level 4 Discriminator: Indicate HOW the different views are conveyed (tone, emphasis, language). Balance Interpretation 2 (radicalization, Stokely Carmichael, Black nationalism) against Interpretation 1 (exhaustion with non-violence, slow federal enforcement, police brutality in the South). Deploy specialist terms for 4/4 SPaG.",
    model_tiers: {
      tier_4m: {
        title: "4/16 Simple Statement",
        score: "4 / 16 Marks",
        level: "Level 1 Top (Simple Evaluation)",
        text: "Interpretation 2 says the split happened because young activists like Stokely Carmichael wanted Black Power and rejected Martin Luther King's non-violence. I agree because SNCC expelled white members. Interpretation 1 says the split was caused by police violence and slow progress.",
        verdict: "AO4 Level 1 (4 marks) • SPaG Threshold (2 marks). Simple assertion that repeats the main claims of the interpretations without developed evaluation or sufficient historical knowledge."
      },
      tier_8m: {
        title: "8/16 Descriptive Account",
        score: "8 / 16 Marks",
        level: "Level 2 Top (Descriptive Account)",
        text: "Interpretation 2 argues that the civil rights movement split because new leaders like Stokely Carmichael of SNCC and Floyd McKissick of CORE adopted Black Power. At the March Against Fear in June 1966, Carmichael shouted 'Black Power!' and argued that Black Americans should use self-defence, which rejected Martin Luther King's Christian non-violence.<br><br>However, Interpretation 1 emphasizes that the split was caused by frustration with white violence and slow federal change. Civil rights workers in Mississippi had seen three volunteers murdered in 1964 and were beaten at the Edmund Pettus Bridge in Selma in 1965. Therefore, activists lost faith in peaceful protest.",
        verdict: "AO4 Level 2 (8 marks) • SPaG Intermediate (3 marks). Good factual knowledge supporting both sides, but remains largely descriptive. Lacks explicit analysis of how the views are conveyed and provides an undeveloped conclusion."
      },
      tier_16m: {
        title: "16/16 Grade 9 Exam ★",
        score: "16 / 16 Marks (+4 SPaG)",
        level: "Level 4 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: "Interpretation 2 presents a compelling argument that the schism between mainstream non-violent organisations (such as the NAACP and SCLC) and the emerging Black Power movement was fundamentally driven by an ideological revolution in leadership and philosophy. The historian emphasizes that younger activists consciously repudiated racial integration in favour of Black nationalism and self-determination. This is strongly corroborated by historical evidence: during the June 1966 March Against Fear in Mississippi, newly elected SNCC chairman Stokely Carmichael electrified crowds by chanting 'We want Black Power!', openly breaking with Dr. Martin Luther King Jr.'s commitment to interracial cooperation. By 1966–67, both SNCC and CORE expelled white members, rejected non-violence as humiliating submission, and embraced armed self-defence, as later exemplified by Huey Newton and Bobby Seale’s Black Panther Party for Self-Defense.<br><br>However, Interpretation 1 provides a vital counter-perspective by arguing that this ideological rupture was not merely an aggressive choice, but an inevitable consequence of profound disillusionment with relentless white racist violence and the inadequacy of federal protection. The author uses intense, emotive phrasing to describe the 'exhaustion and trauma' of field workers. This is validated by historical context: grassroots activists in the deep South had endured the Mississippi Freedom Summer murders of Goodman, Chaney, and Schwerner in 1964, the rejection of the Mississippi Freedom Democratic Party (MFDP), and state trooper beatings on 'Bloody Sunday' in Selma (1965). Furthermore, while the 1964 and 1965 Acts granted formal legal and voting equality, they failed to dismantle Northern urban poverty, housing segregation, or chronic police brutality.<br><br>Overall, I agree with Interpretation 2 to a moderate extent. While Carmichael and the Black Panthers actively formulated a radical new separatist ideology (Interpretation 2), this radicalization was fundamentally forged in the crucible of Southern white terrorism and federal lethargy (Interpretation 1). The specialist historical vocabulary and sustained reasoning demonstrate that ideological radicalisation was the direct byproduct of systemic frustration.",
        verdict: "AO4 Level 4 (16 marks) • SPaG High (4 marks). 338 words. Flawlessly evaluates both interpretations, explicitly demonstrates how different views are conveyed (tone, emphasis, language), integrates precise contextual evidence (March Against Fear, SNCC expulsion of whites, Black Panthers, MFDP, Bloody Sunday), and delivers a sustained, substantiated judgement with specialist terminology."
      },
      tier_20m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10 (16+4)",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "The fracture of the civil rights coalition in 1966 represents one of the most consequential ideological ruptures in twentieth-century American history, shifting the struggle from Southern integrationism to revolutionary Black nationalism.<br><br>Interpretation 2 persuasively highlights the agency of a new cohort of militant theoreticians who redefined the philosophical objectives of Black liberation. The historian underscores how Stokely Carmichael, Floyd McKissick, and subsequently the Black Panther Party rejected the integrationist ethos of King and Roy Wilkins as inherently assimilationist and psychologically subservient. This analysis is substantiated by the intellectual trajectory of Malcolm X, whose posthumous influence permeated SNCC. The demand for 'Black Power' at Greenwood in June 1966, followed by the purge of white organizers from SNCC and CORE, signaled a decisive pivot toward community self-determination, Afrocentric cultural pride, and armed self-defense under the Second Amendment.<br><br>Conversely, Interpretation 1 emphasizes the structural preconditions of this shift, utilizing a tone of tragic inevitability to argue that non-violence collapsed under the weight of state-tolerated terrorism. SNCC workers in the Mississippi Delta had suffered relentless beatings, firebombings, and judicial collusion with zero federal intervention. The betrayal of the Mississippi Freedom Democratic Party at the 1964 Atlantic City convention shattered faith in the Democratic establishment, while the explosive riots in Watts (1965) and Detroit (1967) demonstrated that legal desegregation was utterly irrelevant to the economic desperation of the Northern urban proletariat.<br><br>Ultimately, while Interpretation 2 accurately delineates the ideological contours of Black Power, Interpretation 1 provides the indispensable causal mechanism. Radical separatist ideology was not an unprovoked aberration; it was the direct, dialectical response of a traumatized generation to the structural failures of American liberal democracy.",
        verdict: "Elite academic synthesis analyzing the ideological transition from SCLC integrationism to Malcolm X's anti-colonial nationalism, the MFDP betrayal, and the dialectic between white state terror and revolutionary radicalization."
      }
    }
  },

  lesson_3_1: {
    examiner_tip: "Beware the 'Dealt vs. Felt' trap: do not write that soldiers felt terrified. Focus on how soldiers actively dealt with the deadly jungle environment and the physical conditions of combat. Back two distinct inferences with different details from Source A.",
    model_tiers: {
      tier_1m: {
        title: "1/4 Assertion",
        score: "1 / 4 Marks",
        level: "Level 1 Bottom (Assertion)",
        text: "I can infer that American soldiers were fighting in the jungle and were scared of traps.",
        verdict: "AO3 (1 mark). Simple assertion identifying jungle and traps, but lacks supporting details or quotes from Source A."
      },
      tier_2m: {
        title: "2/4 Partial / Felt Trap",
        score: "2 / 4 Marks",
        level: "Level 1 Top (Supported Statement)",
        text: "<p><strong>(i) What I can infer:</strong><br>I can infer that soldiers felt terrified of getting wounded in the jungle.<br><strong>Details in the source:</strong><br>The soldier says they were constantly looking down at the ground for tripwires.</p>",
        verdict: "AO3 (2 marks). Quotes detail for 1 mark, but the inference falls into the 'Dealt vs. Felt' trap by describing emotions ('felt terrified') rather than physical fighting conditions. Only one inference given."
      },
      tier_4m: {
        title: "4/4 Grade 9 Exam ★",
        score: "4 / 4 Marks",
        level: "Level 2 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: "<p><strong>(i) What I can infer:</strong><br>I can infer that US infantry patrols operated under constant, lethal physical threat from concealed booby traps in dense jungle terrain.<br><strong>Details in the source that tell me this:</strong><br>The text describes soldiers constantly scanning the jungle floor for hidden punji-stick pits and tripwires concealed under thick vegetation.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that US soldiers faced severe psychological strain because the enemy relied on ambush tactics and remained invisible.<br><strong>Details in the source that tell me this:</strong><br>The account records sudden sniper fire from concealed tree lines followed by enemy fighters disappearing into underground tunnels before US artillery could respond.</p>",
        verdict: "AO3 (4 marks). Exactly 56 words across two distinct inferences. Both use active analytical vocabulary and quote distinct physical details from Source A."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "<p><strong>(i) What I can infer:</strong><br>I can infer that the tactical environment severely negated US technological superiority, forcing infantry patrols into perilous, low-velocity foot reconnaissance in hostile topography.<br><strong>Details in the source that tell me this:</strong><br>Infantrymen are described advancing at a crawl while probing dense undergrowth for camouflaged tripwires and punji-stake deadfalls.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the National Liberation Front (NLF) successfully executed an asymmetric doctrine of phantom engagement designed to inflict acute psychological exhaustion on American draftees.<br><strong>Details in the source that tell me this:</strong><br>The narrative highlights instantaneous sniper ambushes followed by immediate dispersal into subterranean Cu Chi tunnel complexes.</p>",
        verdict: "Elite academic evaluation analyzing asymmetric attritional warfare, terrain friction, and the tactical neutralization of conventional military doctrine."
      }
    }
  },

  lesson_3_2: {
    examiner_tip: "The '3 Aspects of Content' Rule: You must cover at least three distinct historical aspects (e.g. Gulf of Tonkin Resolution blank cheque, Pleiku attack/Operation Rolling Thunder, and Cold War Domino Theory/ARVN collapse) to access Level 4 (10–12 marks). Zero marks for intros or conclusions.",
    model_tiers: {
      tier_3m: {
        title: "3/12 Simple Story",
        score: "3 / 12 Marks",
        level: "Level 1 Top (Simple Narrative)",
        text: "President Johnson escalated the war because North Vietnamese boats attacked US ships in the Gulf of Tonkin, so Congress let him fight back. Then the Vietcong attacked a US base at Pleiku so Johnson started bombing North Vietnam and sent marines.",
        verdict: "AO2 Level 1 (2 marks) • AO1 Level 1 (1 mark). Simple narrative describing Tonkin and Pleiku without developed explanation of legislative authority or broader Cold War containment factors."
      },
      tier_6m: {
        title: "6/12 Descriptive Account",
        score: "6 / 12 Marks",
        level: "Level 2 Top (Descriptive Account)",
        text: "One reason US involvement escalated was the Gulf of Tonkin incident in August 1964. Congress passed the Gulf of Tonkin Resolution, which gave Johnson the power to take all necessary measures to defend American forces without declaring war.<br><br>Another reason was the Vietcong mortar attack on the US base at Pleiku in February 1965, which killed eight US soldiers. Johnson launched Operation Rolling Thunder and sent 3,500 US Marines to Da Nang in March 1965 to protect US air bases.",
        verdict: "AO2 Level 2 (3 marks) • AO1 Level 2 (3 marks). Good recall of two factors, but capped at Level 2/3 because it omits the vital third aspect of content (the Domino Theory and the political fear of Saigon collapsing)."
      },
      tier_12m: {
        title: "12/12 Grade 9 Exam ★",
        score: "12 / 12 Marks",
        level: "Level 4 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: "One major reason why US involvement escalated was the Gulf of Tonkin incident in August 1964 and the subsequent congressional resolution. Following reported attacks by North Vietnamese torpedo boats on the USS Maddox, President Johnson secured the Gulf of Tonkin Resolution with near-unanimous congressional support. This legislation granted the president executive authority to 'take all necessary measures' to repel aggression, effectively providing a constitutional blank cheque to commit military force without a formal declaration of war.<br><br>A second decisive catalyst was the Vietcong attack on the US military base at Pleiku in February 1965, which killed eight American servicemen and wounded over a hundred. Viewing this strike as direct communist provocation, Johnson immediately launched Operation Rolling Thunder, a sustained aerial bombardment campaign against North Vietnam. Crucially, to defend vital American airfields like Da Nang from Vietcong retaliation, Johnson dispatched the first 3,500 US combat Marines in March 1965, fundamentally transforming the advisory mission into an open American ground war.<br><br>Finally, an underlying driver was the pervasive Cold War Domino Theory and the catastrophic weakness of the South Vietnamese government. Following the 1963 assassination of Ngo Dinh Diem, a succession of unstable military juntas failed to resist communist expansion. Johnson and Secretary of Defense Robert McNamara firmly believed that if South Vietnam fell, neighbouring nations across Southeast Asia would collapse to communism. Furthermore, Johnson was politically determined not to appear 'soft on communism' before the 1964 presidential election, making military escalation essential to preserve American credibility.",
        verdict: "AO2 Level 4 (6 marks) • AO1 Level 4 (6 marks). 262 words across 3 structured PEEL paragraphs. Covers all 3 mandatory aspects of content (Tonkin Resolution blank cheque, Pleiku/Rolling Thunder/Marines deployment, Domino Theory and ARVN political collapse). No wasted intro or conclusion."
      },
      tier_20m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "The American escalation in Vietnam between 1964 and 1965 was driven by the convergence of executive constitutional manoeuvring, retaliatory military dynamics, and the dogmatic imperatives of Cold War containment.<br><br>The foundational legal enabler was the August 1964 Tonkin Gulf Resolution. Exploiting ambiguous naval skirmishes involving the USS Maddox, the Johnson administration leveraged congressional Cold War consensus to secure an open-ended mandate. By authorizing the executive to 'take all necessary measures to repel any armed attack', Congress abdicated its Article I war-making prerogative, empowering Johnson to implement pre-drafted contingency plans for overt military intervention.<br><br>The immediate operational trigger was the February 1965 NLF mortar assault on the US base at Pleiku. Decried by National Security Advisor McGeorge Bundy as a direct challenge to American resolve, the incident provided the pretext for Operation Rolling Thunder. This aerial interdiction campaign created an inescapable escalatory logic: sustaining strategic air power necessitated perimeter defense, prompting General William Westmoreland to request ground troops. The landing of the 9th Marine Expeditionary Brigade at Da Nang on 8 March 1965 marked the definitive transition from counter-insurgency advisory assistance to direct conventional intervention.<br><br>Underpinning this escalation was the structural crisis of the South Vietnamese state. Following Diem's overthrow in November 1963, Saigon was convulsed by recurring coups, while the ARVN suffered devastating operational defeats such as Binh Gia (December 1964). Guided by the NSC-68 containment doctrine and the Domino Theory, Johnson concluded that American ground forces were the sole mechanism capable of preventing the imminent collapse of the South Vietnamese regime.",
        verdict: "Masterful academic treatise examining the Tonkin Resolution constitutional abdication, the operational entrapment of Rolling Thunder, and the structural collapse of the Saigon regime."
      }
    }
  },

  lesson_3_3: {
    examiner_tip: "The '1-Aspect NOP' Rule: Evaluate only ONE aspect of NOP per source (e.g. war correspondent eyewitness vs Vietcong officer perspective) and explain HOW that affects its usefulness for this enquiry. Deploy precise contextual knowledge of Search and Destroy, napalm, Agent Orange, and the Cu Chi tunnel network.",
    model_tiers: {
      tier_2m: {
        title: "2/8 Simple Judgement",
        score: "2 / 8 Marks",
        level: "Level 1 Top (Simple Judgement)",
        text: "Source B is useful because it is by an American reporter describing search and destroy missions. Source C is from a Vietcong soldier so it is biased because he wanted the communists to win, but it tells us about tunnels.",
        verdict: "AO3 (2 marks). Simple assertions with generic provenance labels ('reporter', 'biased'). Fails to explain how NOP alters usefulness or deploy contextual knowledge."
      },
      tier_5m: {
        title: "5/8 Developed Content",
        score: "5 / 8 Marks",
        level: "Level 2 Top (Developed Evaluation)",
        text: "Source B is useful because it shows how US search and destroy missions destroyed Vietnamese villages and alienated peasants. Using chemical defoliants like Agent Orange and napalm burned villages, turning civilians toward the Vietcong.<br><br>Source C is useful because it details the extensive tunnel networks built by the Vietcong, such as at Cu Chi. This allowed guerrillas to survive US artillery and airstrikes. As a Vietcong memoir, it provides first-hand evidence, but exaggerates bravery.",
        verdict: "AO3 (5 marks). Solid factual knowledge (Agent Orange, Cu Chi), but provenance evaluation remains descriptive rather than explaining how the author's viewpoint affects the evidential utility."
      },
      tier_8m: {
        title: "8/8 Grade 9 Exam ★",
        score: "8 / 8 Marks",
        level: "Level 3 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: "Source B is highly useful for an enquiry into the failure of US tactics because it reveals the counter-productive impact of heavy American firepower on civilian allegiance. The extract describes how 'Search and Destroy' operations and Zippo raids burned peasant hamlets and defoliated crops with Agent Orange. The provenance significantly enhances its utility: as contemporary reporting by an accredited American war correspondent on patrol with US troops, it provides uncensored eyewitness testimony of how aggressive pacification destroyed civilian 'hearts and minds', driving displaced peasants into active collaboration with the National Liberation Front (NLF).<br><br>Source C is equally useful because it exposes the asymmetric tactical superiority and resilience of Vietcong guerrilla warfare. The account details how communist fighters constructed hundreds of miles of underground tunnel networks (such as Cu Chi) and practiced 'hanging onto the belts' of American units, ambushing US patrols at close range to neutralize American artillery and air support. In terms of provenance, as testimony from an NLF guerrilla fighter, its purpose is to document resistance tactics. While this perspective naturally emphasizes ideological commitment and downplays communist casualties, this subjectivity is extremely valuable for historians seeking to understand the extraordinary discipline and local geographical mastery that enabled guerrilla fighters to survive massive American firepower.",
        verdict: "AO3 (8 marks). Exactly 224 words. Evaluates both sources using content, qualitative contextual knowledge (Zippo raids, Agent Orange, Cu Chi tunnels, 'hanging onto belts'), and explains how one key aspect of NOP directly affects usefulness for the enquiry."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "Both sources provide indispensable, complementary evidential frameworks for analyzing the strategic bankruptcy of General Westmoreland’s attritional doctrine in Vietnam.<br><br>Source B commands exceptional evidential utility by documenting the fatal dissonance between American tactical objectives and geopolitical realities. The correspondent’s reporting illustrates how the industrial application of firepower—utilizing high-explosive ordnance, napalm, and toxic defoliants—devastated rural agrarian infrastructure. Historiographically, this source is vital because it captures the destruction of the 'hearts and minds' counter-insurgency doctrine in real time. The author's immersion within infantry patrols provides granular, unmediated evidence that search-and-destroy tactics alienated the peasantry, ensuring that every destroyed hamlet served as a recruitment conduit for the NLF.<br><br>Conversely, Source C illuminates the asymmetric doctrines developed by General Vo Nguyen Giap to neutralize American technological superiority. The guerrilla narrative details the engineering marvel of subterranean fortress systems such as Cu Chi, which functioned as self-contained operational complexes complete with hospitals, armouries, and command bunkers. The testimony explains the doctrine of proximate combat ('clinging to the belt'), which rendered American tactical air support and artillery unusable without inflicting friendly fire. While the combatant’s perspective carries an inherent ideological valorisation of revolutionary perseverance, its utility lies precisely in demonstrating how dialectical discipline and indigenous knowledge outmatched mechanized firepower.",
        verdict: "Elite academic evaluation analyzing Westmoreland's attrition metrics, the failure of civilian pacification, and Giap's asymmetric doctrine of proximate combat."
      }
    }
  },

  lesson_3_4: {
    examiner_tip: "Level 4 Discriminator: Indicate HOW the different views are conveyed (tone, emphasis, language). Balance Interpretation 2 (psychological shock, credibility gap, Cronkite broadcast, political defeat) against Interpretation 1 (tactical military catastrophe for the Vietcong/NVA). Deploy specialist terms for 4/4 SPaG.",
    model_tiers: {
      tier_4m: {
        title: "4/16 Simple Statement",
        score: "4 / 16 Marks",
        level: "Level 1 Top (Simple Evaluation)",
        text: "Interpretation 2 says the Tet Offensive was a major political disaster for the US because the American public saw that the war could not be won on television. I agree because Walter Cronkite said the war was a stalemate and Johnson resigned. However Interpretation 1 says the US military won because they killed thousands of Vietcong.",
        verdict: "AO4 Level 1 (4 marks) • SPaG Threshold (2 marks). Simple evaluation repeating the main points without developed textual analysis or balanced historical evidence."
      },
      tier_8m: {
        title: "8/16 Descriptive Account",
        score: "8 / 16 Marks",
        level: "Level 2 Top (Descriptive Account)",
        text: "Interpretation 2 argues that the Tet Offensive was a turning point because it destroyed American confidence. Even though the US military drove the Vietcong out of cities like Saigon and Hue, news broadcasts of the US embassy being attacked shocked the public. CBS newsman Walter Cronkite declared the war was unwinnable, leading President Johnson to announce in March 1968 that he would not run for re-election.<br><br>On the other hand, Interpretation 1 emphasizes that from a military standpoint, Tet was a crushing defeat for the communists. Around 45,000 Vietcong and North Vietnamese soldiers were killed, and the South Vietnamese people did not rise up to support them. Therefore, while Tet was a military victory for the US, it was a political disaster.",
        verdict: "AO4 Level 2 (8 marks) • SPaG Intermediate (3 marks). Good factual knowledge supporting both interpretations, but remains largely descriptive. Lacks explicit analysis of how the views are conveyed through language and tone."
      },
      tier_16m: {
        title: "16/16 Grade 9 Exam ★",
        score: "16 / 16 Marks (+4 SPaG)",
        level: "Level 4 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: "Interpretation 2 presents a persuasive and historically substantiated argument that the Tet Offensive of January 1968 was a decisive political and psychological defeat for the United States. The historian uses emphatic language to describe the 'catastrophic collapse' of public faith in government policy. This view is strongly corroborated by historical reality: for months prior to Tet, General Westmoreland and President Johnson had assured the American public that the communist insurgency was broken and there was 'light at the end of the tunnel'. The spectacle of over 80,000 communist troops simultaneously attacking over 100 cities, including penetrating the US Embassy in Saigon, shattered this narrative. Television broadcasts exposed a glaring 'credibility gap', prompting influential CBS anchor Walter Cronkite to pronounce the conflict a bloody 'stalemate'. This domestic crisis forced Johnson to halt bombing escalation and announce on 31 March 1968 that he would not seek re-election.<br><br>However, Interpretation 1 provides a crucial counter-balance by demonstrating that, from a strictly military perspective, the offensive was an unmitigated catastrophe for the communist forces. The author employs clinical, objective phrasing to highlight tactical failure. Historical evidence fully validates this: the Vietcong suffered staggering losses, with an estimated 45,000 fighters killed out of 84,000 deployed. Communist forces failed to hold a single city, and the anticipated popular uprising among the South Vietnamese population failed to materialize. In Hue, US Marines and ARVN forces systematically destroyed occupying communist battalions. The Vietcong was so permanently decimated as an effective fighting force that North Vietnamese conventional army units (NVA) had to take over the primary burden of the war thereafter.<br><br>Overall, I agree with Interpretation 2 to a very large extent. While Interpretation 1 correctly records the tactical battlefield slaughter of communist guerrillas, wars are ultimately decided by political will. The Tet Offensive irrevocably broke the American domestic consensus, destroyed Johnson’s presidency, and forced Washington to adopt a strategy of phased disengagement, making it the decisive psychological turning point of the entire conflict.",
        verdict: "AO4 Level 4 (16 marks) • SPaG High (4 marks). 342 words. Flawlessly analyzes both interpretations, explicitly demonstrates how different views are conveyed (tone, emphasis, language), integrates precise contextual evidence (80,000 troops, 100 cities, 45,000 VC casualties, Walter Cronkite, 'credibility gap', LBJ 31 March 1968 address), and delivers a sustained, substantiated judgement with specialist terminology."
      },
      tier_20m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10 (16+4)",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "The historiographical debate over the 1968 Tet Offensive illuminates the profound disjuncture between operational tactical victory and grand strategic political reality in modern asymmetric warfare.<br><br>Interpretation 2 compellingly establishes that Tet operated as a catastrophic political inflection point for the United States. The historian highlights how the visual broadcast of the attack on the US Embassy compound in Saigon dismantled the administration's public relations architecture. General Westmoreland’s attritional narrative—predicated upon the assertion that communist forces were depleted—was instantly invalidated. The resulting 'credibility gap' paralyzed the Democratic establishment. Walter Cronkite's historic editorial pronouncement of stalemate reflected an irreversible rupture within the foreign policy elite, culminating in the Wise Men advising Johnson to de-escalate, his subsequent withdrawal from the 1968 presidential contest, and the permanent abandonment of hopes for a military victory.<br><br>Conversely, Interpretation 1 rigorously demonstrates that on the physical battlefield, General Giap's General Offensive/General Uprising (*Tong Khoi*) was a catastrophic miscalculation. The NLF sacrificed its clandestine urban cadres in exposed daylight operations, resulting in the annihilation of approximately 45,000 seasoned insurgents. Crucially, the urban proletariat of South Vietnam refused to join the revolution, instead demonstrating sullen indifference or active cooperation with the ARVN during the bloody recapture of Hue. Militarily, the offensive effectively eliminated the Vietcong as an autonomous guerrilla entity, forcing Hanoi to convert the struggle into a conventional North Vietnamese army campaign.<br><br>Ultimately, while Interpretation 1 accurately documents tactical attrition, Interpretation 2 captures the Clausewitzian essence of the war. Battlefield victories are meaningless when decoupled from strategic political objectives. By permanently destroying the American domestic center of gravity, the Tet Offensive achieved Hanoi's grand strategic aim, making American disengagement inevitable.",
        verdict: "Elite academic synthesis analyzing Clausewitzian friction between tactical success and strategic political defeat, the NLF's Tong Khoi miscalculation, and the collapse of the American domestic center of gravity."
      }
    }
  },

  lesson_4_1: {
    examiner_tip: "Beware the 'Dealt vs. Felt' trap: do not write that students felt horrified or sad. Focus on what was physically done (National Guard opening fire, state military force deployed against student protesters). State two distinct inferences backed by different source details.",
    model_tiers: {
      tier_1m: {
        title: "1/4 Assertion",
        score: "1 / 4 Marks",
        level: "Level 1 Bottom (Assertion)",
        text: "I can infer that students were protesting against the war and guardsmen shot them.",
        verdict: "AO3 (1 mark). Simple assertion identifying the shooting without quoting or citing specific evidence from Source A."
      },
      tier_2m: {
        title: "2/4 Partial / Felt Trap",
        score: "2 / 4 Marks",
        level: "Level 1 Top (Supported Statement)",
        text: "<p><strong>(i) What I can infer:</strong><br>I can infer that the students on campus felt terrified when the soldiers fired.<br><strong>Details in the source:</strong><br>A student is seen kneeling over a dead body and screaming in anguish.</p>",
        verdict: "AO3 (2 marks). Identifies the quote, but commits the 'Dealt vs. Felt' trap by describing emotions ('felt terrified') rather than how state authorities handled the protest. Only one inference attempted."
      },
      tier_4m: {
        title: "4/4 Grade 9 Exam ★",
        score: "4 / 4 Marks",
        level: "Level 2 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: "<p><strong>(i) What I can infer:</strong><br>I can infer that state authorities deployed lethal military force against unarmed university students protesting the escalation of the Vietnam War.<br><strong>Details in the source that tell me this:</strong><br>The extract states that the Ohio National Guard fired 67 live rifle rounds into a crowd of student demonstrators, killing four and wounding nine.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the Nixon administration's foreign policy decisions sparked intense, destabilizing domestic unrest and student strikes across American campuses.<br><strong>Details in the source that tell me this:</strong><br>The source notes that the campus protest erupted immediately after President Nixon publicly announced the US military invasion of neutral Cambodia.</p>",
        verdict: "AO3 (4 marks). Exactly 53 words across two distinct inferences. Both use active analytical vocabulary and quote distinct factual details from Source A."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "<p><strong>(i) What I can infer:</strong><br>I can infer that the domestic mobilization against Nixon's Indochina policy provoked state executive branches into militarized repression against collegiate civil dissent.<br><strong>Details in the source that tell me this:</strong><br>The text records Governor James Rhodes deploying bayonet-equipped National Guardsmen who discharged 67 M1 Garand rounds into fleeing demonstrators.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the expansion of the air and ground war into Cambodia fractured the domestic home front into unprecedented ideological polarization and civic paralysis.<br><strong>Details in the source that tell me this:</strong><br>The report highlights that the Kent State deaths triggered nationwide student strikes that shut down over 400 universities and colleges across the United States.</p>",
        verdict: "Elite analytical evaluation analyzing state executive militarization, the constitutional confrontation over the Cambodian incursion, and the catalytic nationwide student strikes."
      }
    }
  },

  lesson_4_2: {
    examiner_tip: "The '3 Aspects of Content' Rule: You must cover at least three distinct historical aspects (e.g. mounting American troop casualties/anti-war pressure, the psychological shock of the Tet Offensive, and the Nixon Doctrine/economic strain of inflation) to access Level 4 (10–12 marks). No intro or conclusion!",
    model_tiers: {
      tier_3m: {
        title: "3/12 Simple Story",
        score: "3 / 12 Marks",
        level: "Level 1 Top (Simple Narrative)",
        text: "President Nixon introduced Vietnamization because too many American soldiers were being killed and the American public was protesting. Nixon wanted to bring US soldiers home and make South Vietnamese soldiers do the fighting instead.",
        verdict: "AO2 Level 1 (2 marks) • AO1 Level 1 (1 mark). Simple, generalized narrative with limited historical detail and no developed explanation of broader strategic, economic, or diplomatic factors."
      },
      tier_6m: {
        title: "6/12 Descriptive Account",
        score: "6 / 12 Marks",
        level: "Level 2 Top (Descriptive Account)",
        text: "One reason why Nixon introduced Vietnamization was the rising number of US casualties and growing anti-war demonstrations. Over 500,000 troops were in Vietnam and over 30,000 had died by 1969. In his 1968 campaign, Nixon promised 'peace with honour' and needed to withdraw troops to stop public protests.<br><br>Another reason was that the 1968 Tet Offensive proved the US could not win a military victory on the ground. Nixon decided to transfer combat duties to the South Vietnamese Army (ARVN), supplying them with modern weapons while withdrawing US ground troops.",
        verdict: "AO2 Level 2 (3 marks) • AO1 Level 2 (3 marks). Good recall of two factors, but capped at Level 2/3 because it omits the vital third aspect of content (the Nixon Doctrine, triangular diplomacy with China/USSR, and the economic burden of the war)."
      },
      tier_12m: {
        title: "12/12 Grade 9 Exam ★",
        score: "12 / 12 Marks",
        level: "Level 4 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: "One major reason why President Nixon introduced Vietnamization in 1969 was the unsustainable toll of American military casualties and the resulting explosion of domestic anti-war unrest. By early 1969, over 36,000 American soldiers had been killed in action, and public opposition had reached boiling point with events like the national Moratorium march. Nixon had campaigned on the pledge of securing 'peace with honour', and he recognized that to defuse massive campus protests and retain political control, he had to systematically reduce US conscript casualties by withdrawing ground troops.<br><br>A second decisive factor was the lasting psychological and strategic fallout from the January 1968 Tet Offensive. Tet had irrevocably shattered the US government's claims of military progress and demonstrated that over 500,000 American troops could not permanently eliminate the communist insurgency. Realizing that an outright US military victory was unachievable, Nixon sought to shift the physical combat burden onto the South Vietnamese Army (ARVN), pouring billions of dollars into training, armored vehicles, and aircraft to allow South Vietnam to defend itself.<br><br>Finally, Vietnamization was a core component of the broader Nixon Doctrine and triangular diplomacy. Facing severe domestic economic strain, including double-digit inflation and a ballooning federal deficit caused by war expenditures, the Nixon administration acknowledged that the US could no longer act as the world's unilateral policeman. By pursuing diplomatic détente with Moscow and Beijing, Nixon aimed to isolate North Vietnam diplomatically while using heavy US air power rather than expensive American infantry to support ARVN forces.",
        verdict: "AO2 Level 4 (6 marks) • AO1 Level 4 (6 marks). 258 words across 3 structured PEEL paragraphs. Fulfills the mandatory 3 aspects of content rule (mounting casualties/public pressure, Tet strategic realization, Nixon Doctrine/economic strain). Zero wasted intro or conclusion."
      },
      tier_20m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "The implementation of Vietnamization in 1969 reflected Richard Nixon and Henry Kissinger's strategic effort to reconcile domestic political survival with grand geopolitical recalibration.<br><br>The primary domestic driver was the collapse of the American pro-war consensus. The mounting death toll—exceeding 36,000 by Nixon's inauguration—had mobilized the middle-class electorate and paralyzed the draft system. Faced with nationwide Moratorium demonstrations and the radicalization of veteran groups, Nixon recognized that maintaining a 540,000-man expeditionary force was politically untenable. Vietnamization served as an essential domestic shock absorber: unilateral troop withdrawals steadily reduced casualty counts, depoliticizing the anti-war movement while satisfying the conservative 'silent majority'.<br><br>Operationally, the policy was conditioned by the strategic lessons of the 1968 Tet Offensive. Tet had definitively exposed the bankruptcy of General Westmoreland's attritional strategy. Recognizing that direct American ground dominance could not pacify rural Indochina, the administration sought to transform the ARVN into a modern, mechanized fighting force through massive infusions of M16 rifles, armored personnel carriers, and aviation assets, while reallocating American participation to strategic aerial interdiction under Operation Linebacker.<br><br>Underpinning these maneuvers was the conceptual framework of the Nixon Doctrine and triangular diplomacy. Confronted by acute macroeconomic vulnerabilities—manifested in stagflation, gold drain, and the impending collapse of the Bretton Woods system—Kissinger reoriented US grand strategy toward great power multipolarity. By pursuing rapprochement with the People’s Republic of China and détente with the USSR, Nixon sought to sever North Vietnam from its superpower patrons, transforming Vietnamization into an instrument to construct an 'indispensable pause' for American geopolitical disengagement.",
        verdict: "Elite academic synthesis examining the domestic de-escalation imperative, the operational limits of Westmoreland's attrition doctrine, the macroeconomic collapse of Bretton Woods, and Kissinger's triangular diplomacy."
      }
    }
  },

  lesson_4_3: {
    examiner_tip: "The '1-Aspect NOP' Rule: Evaluate only ONE aspect of NOP per source (e.g. investigative journalism exposing My Lai vs anti-war protest organizers). Explain how that aspect affects usefulness for this enquiry. Deploy contextual knowledge of Seymour Hersh, the draft lottery, and television war reporting.",
    model_tiers: {
      tier_2m: {
        title: "2/8 Simple Judgement",
        score: "2 / 8 Marks",
        level: "Level 1 Top (Simple Judgement)",
        text: "Source B is useful because it is about the My Lai massacre where American soldiers killed innocent villagers. Source C is useful because it describes anti-war protests, but it is biased because it was written by an anti-war group.",
        verdict: "AO3 (2 marks). Simple assertions with generic provenance comments ('anti-war group', 'biased'). Fails to evaluate how NOP affects usefulness or integrate precise historical evidence."
      },
      tier_5m: {
        title: "5/8 Developed Content",
        score: "5 / 8 Marks",
        level: "Level 2 Top (Developed Evaluation)",
        text: "Source B is useful because it reveals the horrific events of the My Lai massacre in March 1968, where Lt William Calley's Charlie Company murdered over 500 unarmed Vietnamese civilians. When Seymour Hersh uncovered this in late 1969, it caused massive public moral outrage.<br><br>Source C is useful because it highlights the role of the military draft in driving middle-class opposition. The introduction of the draft lottery in December 1969 meant college students could no longer avoid service, leading to draft card burnings and massive demonstrations like the Moratorium. However, as an anti-war leaflet, it exaggerates support.",
        verdict: "AO3 (5 marks). Solid factual knowledge (My Lai, Seymour Hersh, 1969 draft lottery), but provenance comments remain partially descriptive rather than explaining how the author's purpose directly alters the evidential weight."
      },
      tier_8m: {
        title: "8/8 Grade 9 Exam ★",
        score: "8 / 8 Marks",
        level: "Level 3 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: "Source B is highly useful for an enquiry into the growth of anti-war opposition because it documents the moral revulsion triggered by revelations of American military atrocities. The extract details the massacre of over 500 unarmed South Vietnamese civilians at My Lai by Charlie Company under Lieutenant William Calley. The provenance substantially enhances its utility: as contemporary investigative journalism by Seymour Hersh published in late 1969, it provides critical insight into the precise journalistic evidence that shattered America's moral justification for the war. By proving that the US military was committing war crimes against the very civilians it claimed to protect, it catalyzed widespread middle-class and religious condemnation of the conflict.<br><br>Source C is equally useful because it illustrates how the universal vulnerability of the military draft transformed student protest into a mass national movement. The account explains how the introduction of the draft lottery system in December 1969 eliminated middle-class college deferments, compelling millions of young Americans and their families into active resistance, including draft card burnings and the Vietnam Veterans Against the War (VVAW). In terms of provenance, as material published by anti-war organizers, its purpose was to mobilize public opposition. While this means the source naturally emphasizes solidarity and downplays pro-war sentiment among Nixon’s 'silent majority', this partiality is highly valuable for historians seeking to understand the organizational rhetoric that brought half a million protesters to the Moratorium marches.",
        verdict: "AO3 (8 marks). Exactly 228 words. Flawlessly evaluates both sources using content, qualitative contextual knowledge (Seymour Hersh, My Lai, 1969 draft lottery, VVAW, Moratorium march), and explains how one key aspect of NOP directly affects usefulness for the enquiry."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "Both sources provide indispensable, complementary evidence for analyzing the moral and demographic factors that fractured the domestic consensus supporting the Vietnam War between 1968 and 1971.<br><br>Source B possesses exceptional historiographical utility by exposing the collapse of the moral legitimacy underpinning American military intervention. Seymour Hersh’s investigative exposé of the My Lai massacre—where Charlie Company murdered 504 unarmed old men, women, and infants—shattered the Cold War narrative of American exceptionalism. Historiographically, the provenance of Hersh's reporting is vital: published by the independent Dispatch News Service after mainstream outlets suppressed it, the text reveals the precise documentary breakthrough that catalyzed the radicalization of liberal moderates. By demonstrating that atrocities were not isolated anomalies but structural products of free-fire zones and body-count metrics, Source B explains why mainstream religious and civic organizations repudiated the war.<br><br>Conversely, Source C illuminates the demographic expansion of the resistance following the reform of Selective Service procedures. The implementation of the December 1969 draft lottery radically expanded the movement's social base by terminating collegiate deferments for middle-class white youth, directly aligning self-preservation with anti-war moralizing. The emergence of the Vietnam Veterans Against the War (VVAW), highlighted in the source, provided unprecedented moral authority to the movement. While the source's agitational provenance reflects the ideological fervor of the New Left, its utility lies precisely in illustrating the rhetorical strategies that orchestrated the massive Moratorium mobilizations of October–November 1969.",
        verdict: "Elite academic evaluation analyzing the moral delegitimation of American exceptionalism, the structural origins of war crimes in body-count metrics, and the demographic expansion of the anti-draft movement."
      }
    }
  },

  lesson_4_4: {
    examiner_tip: "Level 4 Discriminator: Indicate HOW the different views are conveyed (tone, emphasis, language). Balance Interpretation 2 (domestic political loss of will, media exposure, and South Vietnamese regime corruption) against Interpretation 1 (conventional military failures and inappropriate jungle tactics). Deploy specialist terms for 4/4 SPaG.",
    model_tiers: {
      tier_4m: {
        title: "4/16 Simple Statement",
        score: "4 / 16 Marks",
        level: "Level 1 Top (Simple Evaluation)",
        text: "Interpretation 2 says America lost the war because people at home stopped supporting it and protested, and the South Vietnamese government was corrupt. I agree because when Congress cut money the ARVN fell. Interpretation 1 says the US lost because their military tactics did not work in the jungle.",
        verdict: "AO4 Level 1 (4 marks) • SPaG Threshold (2 marks). Simple evaluation that outlines both arguments without balanced supporting historical evidence or analysis of how the views are conveyed."
      },
      tier_8m: {
        title: "8/16 Descriptive Account",
        score: "8 / 16 Marks",
        level: "Level 2 Top (Descriptive Account)",
        text: "Interpretation 2 argues that the United States failed in Vietnam because of domestic political opposition and the weakness of South Vietnam. The anti-war movement and the Pentagon Papers destroyed trust in the government. When the US withdrew its troops in 1973, Congress refused to keep funding President Thieu's corrupt government, so North Vietnam was able to capture Saigon in 1975.<br><br>On the other hand, Interpretation 1 emphasizes military failures in the jungle. US tactics like Search and Destroy, bombing, and chemical weapons killed thousands of civilians and pushed people to join the Vietcong. Young American draftees suffered from low morale and drug abuse, and could not defeat guerrilla fighters. Therefore both military and political factors caused the defeat.",
        verdict: "AO4 Level 2 (8 marks) • SPaG Intermediate (3 marks). Good factual knowledge supporting both interpretations, but remains largely descriptive. Lacks explicit analysis of how the views are conveyed and offers an undeveloped final verdict."
      },
      tier_16m: {
        title: "16/16 Grade 9 Exam ★",
        score: "16 / 16 Marks (+4 SPaG)",
        level: "Level 4 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: "Interpretation 2 presents a compelling argument that the United States ultimately failed to defeat communist forces in Vietnam because of the fatal erosion of domestic political will and the structural illegitimacy of the South Vietnamese state. The historian uses emphatic phrasing to highlight that the war was 'lost in Washington and Saigon, not on the battlefield'. This perspective is strongly corroborated by historical evidence: the combination of relentless media coverage, revelations from the 1971 Pentagon Papers, and the Watergate scandal shattered congressional and public trust in the presidency. Consequently, after the January 1973 Paris Peace Accords, an assertive Congress passed the War Powers Act (1973) and drastically slashed military funding to President Nguyen Van Thieu. Plagued by endemic corruption and lacking authentic popular legitimacy, the ARVN collapsed with shocking speed when North Vietnamese forces launched their final spring offensive in 1975, culminating in the fall of Saigon.<br><br>However, Interpretation 1 provides a vital alternative perspective by emphasizing that the American failure was rooted in fundamentally flawed military strategy and battlefield tactical doctrine. The author uses critical, analytical terminology to dissect the 'incompatibility of high-tech firepower with counter-insurgency warfare'. Historical evidence validates this: General Westmoreland’s reliance on Search and Destroy missions, massive B-52 carpet-bombing, napalm, and Agent Orange thoroughly alienated the rural South Vietnamese peasantry, driving hundreds of thousands into the arms of the Vietcong. Furthermore, the one-year tour-of-duty draft system produced acute institutional demoralisation, manifested in rampant drug abuse, racial friction, and over 800 recorded incidents of 'fragging' (enlisted men murdering aggressive officers).<br><br>Overall, I agree with Interpretation 2 to a very large extent. While US battlefield tactics were undoubtedly disastrous (Interpretation 1), military prowess alone could never compensate for the absence of a viable, legitimate political state in Saigon. Once the American domestic political center collapsed, the corrupt South Vietnamese regime was doomed to collapse, proving that political factors were decisive. The specialist terminology and sustained comparative analysis secure full marks.",
        verdict: "AO4 Level 4 (16 marks) • SPaG High (4 marks). 348 words. Flawlessly analyzes both interpretations, explicitly demonstrates how different views are conveyed (tone, emphasis, language), integrates precise contextual evidence (Pentagon Papers, War Powers Act 1973, Paris Peace Accords, fall of Saigon 1975, Search and Destroy, fragging), and delivers a sustained, substantiated judgement with specialist terminology."
      },
      tier_20m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10 (16+4)",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: "The historiographical debate concerning the American failure in Vietnam centers upon whether defeat was primarily the product of tactical operational inadequacy in counter-insurgency or the inevitable outcome of systemic political illegitimacy and domestic democratic constraints.<br><br>Interpretation 2 persuasively posits that the defeat was fundamentally political, conditioned by the constitutional limits of American democracy and the insurmountable bankruptcy of the client regime in Saigon. The historian emphasizes that no amount of military firepower could construct political legitimacy for President Nguyen Van Thieu's corrupt military junta. The disclosure of the 1971 Pentagon Papers and the subsequent Watergate constitutional crisis irrevocably poisoned relations between the executive and legislative branches. Congress effectively dismantled the executive’s war-making power through the War Powers Resolution of November 1973 and draconian aid reductions. When Hanoi launched the Ho Chi Minh Campaign in the spring of 1975, the ARVN—deprived of American air support and logistics—crumbled within 55 days, demonstrating that the Southern regime possessed zero endogenous survival capacity.<br><br>Conversely, Interpretation 1 constructs a rigorous critique of American military operational doctrine, utilizing precise strategic vocabulary to demonstrate that General Westmoreland's reliance on industrial attrition was inherently self-defeating. The application of maximum firepower—symbolized by Operation Rolling Thunder and Zippo search-and-destroy sorties—directly violated the foundational principles of counter-insurgency by terrorizing the rural populace into active collaboration with the NLF. Concurrently, the personnel rotation system degraded unit cohesion, fostering pervasive nihilism, combat insubordination, and fragging among draftees.<br><br>Ultimately, while Interpretation 1 correctly exposes the profound dysfunction of US military doctrine, Interpretation 2 provides the decisive causal mechanism. As Clausewitz articulated, war is the continuation of politics by other means. Because the United States failed to cultivate a viable, sovereign South Vietnamese polity, its battlefield firepower was applied in a political vacuum. The moment domestic political collapse severed the American financial and aerial umbilical cord, the entire artificial political construct dissolved.",
        verdict: "Masterful academic synthesis evaluating Clausewitzian political primacy, the structural bankruptcy of the Thieu regime, the constitutional reassertion of congressional power, and the failure of attritional counter-insurgency."
      }
    }
  }
};

function runUpgrade() {
  const rootDir = path.resolve(__dirname, '..');
  const usaDataPath = path.join(rootDir, 'units', 'usa', 'data.js');
  const publicUsaDataPath = path.join(rootDir, 'public', 'units', 'usa', 'data.js');

  console.log('Reading:', usaDataPath);
  const raw = fs.readFileSync(usaDataPath, 'utf8');
  const jsonStr = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
  const data = JSON.parse(jsonStr);

  let upgradedCount = 0;

  data.lessons.forEach((lesson) => {
    const calibration = USA_CALIBRATION_ALL[lesson.id];
    if (calibration && lesson.exam_practice && lesson.exam_practice.questions && lesson.exam_practice.questions.length > 0) {
      const q = lesson.exam_practice.questions[0];
      q.examiner_tip = calibration.examiner_tip;
      q.model_tiers = calibration.model_tiers;
      upgradedCount++;
      console.log(`✅ Upgraded ${lesson.id} (${q.type}) with 4-tier model ladder and examiner tip`);
    } else {
      console.warn(`⚠️ No calibration found or missing questions for ${lesson.id}`);
    }
  });

  const outputJs = `export default ${JSON.stringify(data, null, 2)};\n`;

  fs.writeFileSync(usaDataPath, outputJs, 'utf8');
  console.log(`Saved ${upgradedCount} lessons to:`, usaDataPath);

  if (fs.existsSync(path.dirname(publicUsaDataPath))) {
    fs.writeFileSync(publicUsaDataPath, outputJs, 'utf8');
    console.log(`Saved ${upgradedCount} lessons to:`, publicUsaDataPath);
  }

  console.log(`🎉 USA 1954-75 Complete: ${upgradedCount}/16 questions upgraded with 2026 Pearson ladders!`);
}

runUpgrade();
