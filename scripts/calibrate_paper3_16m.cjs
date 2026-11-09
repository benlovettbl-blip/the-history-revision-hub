// scripts/calibrate_paper3_16m.cjs
// Calibrate all 8 16-mark interpretation verdict essays (USA: 4, Germany: 4)
// Strict word count budget:
// - tier_16m: strictly 240-280 words (Grade 9 Exam ★)
// - tier_8m: ~110-130 words (Two-Sided Account)
// - tier_4m: ~45-55 words (Basic Description)
// - Explicit evaluative link formulas in every paragraph of tier_16m

const usa16m = {
  "lesson_1_4": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Basic Description)",
      "text": "<p>Interpretation 2 says white people in the South resisted school integration because they were racist and set up private academies. This is true because the KKK attacked Black students. However, politicians also stopped integration because governors like Faubus used troops at Little Rock to block Black children.</p>",
      "verdict": "AO4 Level 1 (4 marks) • SPaG Threshold (1 mark). Simple, generalized description of one view with brief mention of the other, lacking sustained historical analysis or criteria-driven evaluation."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 2 Top / Level 3 Bottom (Two-Sided Account)",
      "text": "<p>On the one hand, Interpretation 2 is convincing because grassroots racism was intense. White Citizens' Councils grew to 250,000 members, using boycotts and closing public schools to stop integration, such as in Prince Edward County. Angry white mobs also attacked Black children attempting to enter schools.<br><br>On the other hand, Interpretation 1 emphasizes top-down political resistance. In 1956, 101 Southern congressmen signed the Southern Manifesto, promising to resist desegregation. Governor Orval Faubus deployed the National Guard at Little Rock to block nine Black pupils.<br><br>Overall, I agree with Interpretation 2 because ordinary white communities resisted desegregation every day on the ground.</p>",
      "verdict": "AO4 Level 2 (8 marks) • SPaG Intermediate (2 marks). Explains both interpretations with relevant contextual facts, but lacks deep historiographical evaluation or a developed criteria-based verdict."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Interpretation 2 presents a compelling argument that Southern resistance to school desegregation was fundamentally driven from below by entrenched grassroots white hostility. The historian highlights how ordinary citizens mobilised to preserve white supremacy. This view is strongly substantiated by contextual evidence: White Citizens' Councils rapidly enrolled 250,000 members across the South, using economic intimidation, mortgage cancellations, and dismissals against Black parents who registered their children. In Prince Edward County, Virginia, authorities closed all public schools for five years rather than integrate, funding private 'segregation academies' for white children. Furthermore, violent white mobs physically assaulted Black pupils, spitting at Elizabeth Eckford outside Little Rock Central High. Therefore, Interpretation 2 is supported because the day-to-day enforcement of desegregation was thwarted by violent communal resistance rather than political speeches alone.</p><p>However, Interpretation 1 provides a vital counter-perspective by demonstrating that grassroots bigotry required state-sanctioned legitimacy to remain effective. In 1956, 101 Southern congressmen signed the 'Southern Manifesto', declaring Brown a judicial abuse and pledging resistance by all lawful means. Furthermore, Southern governors like Orval Faubus actively deployed the Arkansas National Guard in September 1957 to bar the 'Little Rock Nine', forcing President Eisenhower to dispatch the 101st Airborne Division. Therefore, Interpretation 1 is persuasive because political leaders created the legal shelter and institutional defiance that emboldened local communities to resist federal rulings.</p><p>In conclusion, I agree with Interpretation 2 to a substantial extent. While Southern politicians provided institutional cover (Interpretation 1), it was the ferocious grassroots backlash, economic terrorism, and community school closures (Interpretation 2) that made desegregation painfully slow and hazardous for Black children across the Deep South.</p>",
      "verdict": "AO4 Level 4 (16 marks) • SPaG High (4 marks). Analytical, balanced evaluation of both interpretations against detailed historical context, culminating in a sustained, criteria-driven verdict with accurate specialist terminology."
    }
  },

  "lesson_2_4": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Basic Description)",
      "text": "<p>Interpretation 2 argues that the civil rights movement split because Black Power leaders like Stokely Carmichael wanted self-defence and rejected non-violence. This is true because Carmichael shouted Black Power in 1966. However, Interpretation 1 says northern riots and poverty caused the split because people in ghettos were angry.</p>",
      "verdict": "AO4 Level 1 (4 marks) • SPaG Threshold (1 mark). Simple, generalized description of one view with brief mention of the other, lacking sustained historical analysis or criteria-driven evaluation."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 2 Top / Level 3 Bottom (Two-Sided Account)",
      "text": "<p>On the one hand, Interpretation 2 is persuasive because radical leaders changed civil rights ideology. In 1966, Stokely Carmichael took over SNCC and expelled white members, demanding 'Black Power' and racial separatism rather than peaceful integration. Malcolm X had also inspired activists to reject non-violence and practice armed self-defence.<br><br>On the other hand, Interpretation 1 emphasizes economic frustration in northern cities. Despite the 1964 Civil Rights Act, African Americans still faced ghetto poverty, job discrimination, and police brutality, sparking riots in Watts (1965) and Detroit (1967).<br><br>Overall, I agree with Interpretation 2 because ideological shifts in SNCC and the Black Panthers formally broke the movement.</p>",
      "verdict": "AO4 Level 2 (8 marks) • SPaG Intermediate (2 marks). Explains both interpretations with relevant contextual facts, but lacks deep historiographical evaluation or a developed criteria-based verdict."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Interpretation 2 presents a compelling argument that the split in the civil rights movement was primarily ideological, driven by radical young activists who rejected non-violence in favour of Black nationalism. Following the assassination of Malcolm X, leaders like Stokely Carmichael became disillusioned with peaceful assimilation. In June 1966, during the March Against Fear, Carmichael popularised the slogan 'Black Power' and subsequently expelled white members from SNCC, while CORE under Floyd McKissick also endorsed armed self-defence. Furthermore, the Black Panther Party, founded in October 1966 by Huey Newton and Bobby Seale, openly carried firearms and promoted revolutionary separatism, directly contradicting Martin Luther King's Christian non-violence. Therefore, Interpretation 2 is supported because this ideological transformation produced irreconcilable strategic divisions that shattered the coalition.</p><p>However, Interpretation 1 offers an equally convincing counter-argument by emphasising that this ideological radicalisation was caused by continuing socio-economic misery and police brutality in northern urban ghettos. While legislative triumphs like the 1964 Civil Rights Act ended Southern *de jure* segregation, they did nothing to alleviate northern *de facto* inequality, poor housing, and mass unemployment. The explosive Watts riots of August 1965 (leaving 34 dead) and the 1967 Detroit rebellion proved that northern Black youths viewed King's Southern tactics as irrelevant to their everyday oppression. Therefore, Interpretation 1 is valid because economic despair and systemic violence created the bitter disillusionment that fed Black Power.</p><p>In conclusion, I agree with Interpretation 2 to a large extent. While urban economic misery (Interpretation 1) provided the underlying combustible anger, it was the formal ideological rejection of non-violence and integration by Carmichael, CORE, and the Black Panthers (Interpretation 2) that turned community frustration into a permanent institutional schism.</p>",
      "verdict": "AO4 Level 4 (16 marks) • SPaG High (4 marks). Analytical, balanced evaluation of both interpretations against detailed historical context, culminating in a sustained, criteria-driven verdict with accurate specialist terminology."
    }
  },

  "lesson_3_4": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Basic Description)",
      "text": "<p>Interpretation 2 says anti-war feeling grew because of student protests and the draft, which made young men fear dying in Vietnam. This happened at Kent State where four students were shot. However, Interpretation 1 says television showed the horrors of war like the Tet Offensive, turning Americans against the war.</p>",
      "verdict": "AO4 Level 1 (4 marks) • SPaG Threshold (1 mark). Simple, generalized description of one view with brief mention of the other, lacking sustained historical analysis or criteria-driven evaluation."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 2 Top / Level 3 Bottom (Two-Sided Account)",
      "text": "<p>On the one hand, Interpretation 2 is convincing because conscription directly threatened millions of young Americans. The draft lottery introduced in 1969 created intense campus protests, culminating in May 1970 when Ohio National Guardsmen shot dead four students at Kent State University, sparking a nationwide student strike of over four million youths.<br><br>On the other hand, Interpretation 1 highlights the decisive role of the media. As the first 'television war', evening news broadcasts brought graphic combat footage into American living rooms. Walter Cronkite's report after the 1968 Tet Offensive and revelations of the My Lai massacre shattered public trust in government claims.<br><br>Overall, I agree with Interpretation 2 because draft resistance mobilised active protest.</p>",
      "verdict": "AO4 Level 2 (8 marks) • SPaG Intermediate (2 marks). Explains both interpretations with relevant contextual facts, but lacks deep historiographical evaluation or a developed criteria-based verdict."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Interpretation 2 presents a compelling argument that anti-war sentiment grew primarily because of the direct human burden of conscription and youth activism. The historian argues that the military draft threatened millions of young men, disproportionately falling upon working-class families while affluent youths secured college deferments. This created widespread resistance, including draft-card burnings and 40,000 youths fleeing to Canada. Campus radicalism reached a violent climax in May 1970, when National Guardsmen shot dead four student demonstrators at Kent State University, triggering nationwide strikes across 450 universities and closing hundreds of campuses. Furthermore, Vietnam Veterans Against the War dramatically threw their medals over the Capitol steps in 1971. Therefore, Interpretation 2 is supported because the personal threat of the draft mobilised unprecedented, active mass resistance.</p><p>However, Interpretation 1 provides a vital counter-balance by highlighting the transformative power of television media. As the first uncensored 'living room war', nightly news broadcasts delivered graphic footage of wounded soldiers and napalmed villages directly into American homes. In February 1968, following the surprise Tet Offensive, CBS anchorman Walter Cronkite declared the war an unwinnable 'stalemate', prompting President Johnson to remark, 'If I've lost Cronkite, I've lost Middle America'. Furthermore, investigative reports exposing the 1968 My Lai massacre and the 1971 Pentagon Papers fatally destroyed government credibility. Therefore, Interpretation 1 is persuasive because media exposure eroded the silent majority's patriotic faith in official narratives.</p><p>In conclusion, I agree with Interpretation 2 to a moderate extent, but Interpretation 1 provides the deeper catalyst. While draft resistance (Interpretation 2) drove youth mobilization, it was the television exposure of military stalemate and atrocities (Interpretation 1) that convinced mainstream middle America that continuing the Vietnam War was morally indefensible.</p>",
      "verdict": "AO4 Level 4 (16 marks) • SPaG High (4 marks). Analytical, balanced evaluation of both interpretations against detailed historical context, culminating in a sustained, criteria-driven verdict with accurate specialist terminology."
    }
  },

  "lesson_4_4": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Basic Description)",
      "text": "<p>Interpretation 2 argues that Nixon resigned because the 'Smoking Gun' tape proved he broke the law and covered up the Watergate break-in. This is true because Republicans told him he would be impeached. However, Interpretation 1 says journalists Woodward and Bernstein and the Senate investigation exposed his crimes first.</p>",
      "verdict": "AO4 Level 1 (4 marks) • SPaG Threshold (1 mark). Simple, generalized description of one view with brief mention of the other, lacking sustained historical analysis or criteria-driven evaluation."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 2 Top / Level 3 Bottom (Two-Sided Account)",
      "text": "<p>On the one hand, Interpretation 2 is persuasive because the release of the White House audio tapes delivered the final blow. When the Supreme Court ruled in *US v. Nixon* (July 1974) that Nixon had to surrender the tapes, the 'Smoking Gun' recording revealed he had ordered the CIA to obstruct the FBI's investigation six days after the break-in. Senior Republicans told Nixon he faced certain impeachment.<br><br>On the other hand, Interpretation 1 emphasizes the relentless work of the Senate Watergate Committee and investigative journalists. Carl Bernstein and Bob Woodward traced slush funds to CREEP, while the Ervin Committee televised hearings exposed the secret taping system.<br><br>Overall, I agree with Interpretation 2 because the tape made resignation unavoidable.</p>",
      "verdict": "AO4 Level 2 (8 marks) • SPaG Intermediate (2 marks). Explains both interpretations with relevant contextual facts, but lacks deep historiographical evaluation or a developed criteria-based verdict."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Interpretation 2 presents a compelling argument that President Nixon's resignation in August 1974 was the direct, inevitable result of the 'Smoking Gun' tape and the consequent collapse of his congressional support. Nixon had consistently claimed executive privilege to conceal White House recordings. However, on 24 July 1974, the Supreme Court ruled unanimously in *United States v. Nixon* that presidential privilege did not shield criminal evidence. The subpoenaed tape from 23 June 1972 proved that Nixon had ordered Chief of Staff H.R. Haldeman to use the CIA to halt the FBI's investigation. On 7 August 1974, senior Republican leaders informed Nixon he faced certain conviction in the Senate. Therefore, Interpretation 2 is supported because the definitive legal proof of obstruction destroyed his political survival.</p><p>However, Interpretation 1 offers a vital counter-perspective by arguing that the crisis was engineered over two years of relentless investigative journalism and congressional scrutiny. Reporters Bob Woodward and Carl Bernstein at the *Washington Post* uncovered secret CREEP campaign slush funds, while the televised Senate Watergate Committee chaired by Sam Ervin gripped 85% of American households. Furthermore, Alexander Butterfield's sensational disclosure of the White House taping system provided the key that allowed Special Prosecutor Archibald Cox to demand evidence, despite Nixon's 'Saturday Night Massacre'. Therefore, Interpretation 1 is valid because sustained democratic oversight prevented the initial burglary from being successfully buried.</p><p>In conclusion, I agree with Interpretation 2 to a large extent. While congressional investigations and journalism (Interpretation 1) uncovered the sprawling conspiracy, it was the unassailable audio proof of the 'Smoking Gun' tape (Interpretation 2) that stripped Nixon of his remaining party defenders and forced his resignation on 9 August 1974.</p>",
      "verdict": "AO4 Level 4 (16 marks) • SPaG High (4 marks). Analytical, balanced evaluation of both interpretations against detailed historical context, culminating in a sustained, criteria-driven verdict with accurate specialist terminology."
    }
  }
};

const ger16m = {
  "lesson_1_4": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Basic Description)",
      "text": "<p>Interpretation 2 argues that women's lives did not change that much in Weimar Germany because most women were still expected to be mothers and were paid less than men. This is true because of conservative attitudes. However, Interpretation 1 says women gained freedom because they got the vote in 1919 and became deputies in the Reichstag.</p>",
      "verdict": "AO4 Level 1 (4 marks) • SPaG Threshold (1 mark). Simple, generalized description of one view with brief mention of the other, lacking sustained historical analysis or criteria-driven evaluation."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 2 Top / Level 3 Bottom (Two-Sided Account)",
      "text": "<p>On the one hand, Interpretation 2 is convincing because traditional gender roles remained dominant. Women were paid roughly 33% less than men for identical work, and female civil servants were dismissed if they married. The 'New Woman' was mainly a myth restricted to young city women, while rural women faced poverty.<br><br>On the other hand, Interpretation 1 highlights revolutionary legal and political liberation. Article 109 of the Weimar Constitution gave women equal voting rights, resulting in 90% female turnout. By 1926, women made up almost 10% of Reichstag deputies, and female employment in clerical roles surged.<br><br>Overall, I agree with Interpretation 2 because most women still bore traditional domestic burdens.</p>",
      "verdict": "AO4 Level 2 (8 marks) • SPaG Intermediate (2 marks). Explains both interpretations with relevant contextual facts, but lacks deep historiographical evaluation or a developed criteria-based verdict."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Interpretation 2 presents a compelling argument that the concept of the liberated 'New Woman' was largely an exaggerated media illusion, and that structural continuity dominated women's lives in Weimar Germany. The historian rightly points out that entrenched social conservatism and legal double standards persisted. While single urban women embraced modern fashions, working women earned on average 33% less than men. Furthermore, the 1900 Civil Code kept husbands in legal control of finances, while female civil servants were dismissed upon marriage. Conservative churches and right-wing parties fiercely condemned working women as threats to family life. Therefore, Interpretation 2 is supported because economic inequality and domestic expectations remained the daily reality for the vast majority of German women.</p><p>However, Interpretation 1 provides an indispensable counter-argument by highlighting the profound, unprecedented constitutional and political rights granted to women after 1918. Article 109 of the Weimar Constitution declared complete legal equality between the sexes and granted universal female suffrage. Women exercised this right enthusiastically, maintaining an average turnout of nearly 90% in national elections, and by 1926 female deputies comprised almost 10% of the Reichstag—a far higher proportion than in Britain or the USA. Additionally, female employment expanded in white-collar sectors, with over 100,000 female teachers and 3,000 doctors by 1930. Therefore, Interpretation 1 is valid because women achieved unprecedented civic representation and professional careers.</p><p>In conclusion, I agree with Interpretation 2 to a large extent. While constitutional enfranchisement and political presence were revolutionary milestones (Interpretation 1), the cultural liberation of the 'New Woman' was confined to a small, affluent urban minority, leaving working-class and rural women bound by severe economic inequality and conservative domestic burdens.</p>",
      "verdict": "AO4 Level 4 (16 marks) • SPaG High (4 marks). Analytical, balanced evaluation of both interpretations against detailed historical context, culminating in a sustained, criteria-driven verdict with accurate specialist terminology."
    }
  },

  "lesson_2_4": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Basic Description)",
      "text": "<p>Interpretation 2 says Hitler became Chancellor because the Nazis were popular and won lots of votes during the Great Depression when six million people were unemployed. This is true because they were the biggest party. However, Interpretation 1 says conservative politicians like von Papen and Hindenburg plotted to give Hitler power thinking they could control him.</p>",
      "verdict": "AO4 Level 1 (4 marks) • SPaG Threshold (1 mark). Simple, generalized description of one view with brief mention of the other, lacking sustained historical analysis or criteria-driven evaluation."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 2 Top / Level 3 Bottom (Two-Sided Account)",
      "text": "<p>On the one hand, Interpretation 2 is persuasive because the economic collapse of the Great Depression created mass support for Hitler. By 1932, six million Germans were unemployed, and middle-class voters feared a communist revolution. In July 1932, the Nazis won 230 seats, making them the largest party.<br><br>On the other hand, Interpretation 1 emphasizes backroom intrigue by conservative elites. In the November 1932 election, Nazi seats dropped to 196 and the party was running out of money. Franz von Papen persuaded President Hindenburg to appoint Hitler Chancellor, boasting he had 'hired' him and could control him with a conservative cabinet.<br><br>Overall, I agree with Interpretation 1 because intrigue delivered power when votes were falling.</p>",
      "verdict": "AO4 Level 2 (8 marks) • SPaG Intermediate (2 marks). Explains both interpretations with relevant contextual facts, but lacks deep historiographical evaluation or a developed criteria-based verdict."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Interpretation 2 argues that Hitler's appointment as Chancellor in January 1933 was primarily the result of the Nazi Party's mass electoral breakthrough, powered by the economic devastation of the Great Depression. This argument is strongly supported by historical context: the Wall Street Crash caused US loans to be recalled, driving German unemployment to over six million by 1932 and destroying middle-class faith in the Weimar Republic. Joseph Goebbels' modern propaganda and Hitler's charismatic rallies promising 'Work and Bread' transformed the NSDAP from 12 seats in 1928 into the Reichstag's largest party with 230 seats in July 1932, as fear of communism drove middle-class voters toward the Nazis. Therefore, Interpretation 2 is supported because mass electoral popularity made Hitler an unavoidable national force that democratic institutions could no longer ignore.</p><p>However, Interpretation 1 provides an indispensable counter-argument by demonstrating that mass popularity alone did not hand Hitler power; rather, he was appointed through the backroom intrigues of aristocratic conservative elites. In the November 1932 election, Nazi support dropped to 196 seats, leaving the party demoralised. Hitler was rescued by Franz von Papen, who conspired with Oskar von Hindenburg to depose Chancellor Schleicher. Papen foolishly believed he could 'box Hitler in' with eight conservative cabinet ministers. Therefore, Interpretation 1 is valid because backroom intrigue opened the doors of the Chancellery when Hitler's democratic momentum was visibly receding.</p><p>In conclusion, I agree with Interpretation 2 to a moderate extent, but Interpretation 1 provides the decisive causal mechanism. While mass electoral support (Interpretation 2) made Hitler a viable candidate, it was Papen's fatal miscalculation and conservative scheming (Interpretation 1) that ultimately installed him as Chancellor on 30 January 1933.</p>",
      "verdict": "AO4 Level 4 (16 marks) • SPaG High (4 marks). Analytical, balanced evaluation of both interpretations against detailed historical context, culminating in a sustained, criteria-driven verdict with accurate specialist terminology."
    }
  },

  "lesson_3_4": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Basic Description)",
      "text": "<p>Interpretation 2 says that Christian churches largely cooperated with the Nazi regime because they were afraid of communism and wanted to protect themselves. This is true because the Pope signed the Concordat in 1933. However, Interpretation 1 says some churchmen were very brave, like Martin Niemöller who spoke out and was imprisoned in a concentration camp.</p>",
      "verdict": "AO4 Level 1 (4 marks) • SPaG Threshold (1 mark). Simple, generalized description of one view with brief mention of the other, lacking sustained historical analysis or criteria-driven evaluation."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 2 Top / Level 3 Bottom (Two-Sided Account)",
      "text": "<p>On the one hand, Interpretation 2 is persuasive because both main churches pursued self-preservation. In July 1933, the Catholic Church signed the Reichskonkordat with Hitler, agreeing that priests would stay out of politics in return for religious freedom. Protestant 'German Christians' actively supported Hitler, displaying swastikas on altars, and churches failed to publicly condemn the persecution of Jews.<br><br>On the other hand, Interpretation 1 emphasizes courageous individual resistance. Martin Niemöller and Dietrich Bonhoeffer formed the Confessing Church in 1934 to resist Nazi control, leading to Niemöller's imprisonment in Dachau. In 1941, Catholic Bishop von Galen successfully led public protests against the Nazi T4 euthanasia programme.<br><br>Overall, I agree with Interpretation 2 because official church resistance was limited to protecting church autonomy.</p>",
      "verdict": "AO4 Level 2 (8 marks) • SPaG Intermediate (2 marks). Explains both interpretations with relevant contextual facts, but lacks deep historiographical evaluation or a developed criteria-based verdict."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Interpretation 2 presents a compelling argument that the Christian churches in Nazi Germany primarily engaged in institutional compromise and accommodation rather than broad opposition to the regime. Fearful of godless Soviet communism and desperate to safeguard their traditions, church hierarchies sought co-existence. In July 1933, the Vatican signed the *Reichskonkordat*, agreeing that Catholic clergy would withdraw from politics in exchange for religious freedom. Similarly, Protestant churches established the pro-Nazi 'German Christians', displaying swastikas on altars and hailing Hitler as a saviour. Crucially, neither church leadership mounted official protests against the Nuremberg Laws or *Kristallnacht*. Therefore, Interpretation 2 is supported because institutional self-preservation and ideological overlap repeatedly superseded moral resistance.</p><p>However, Interpretation 1 provides a vital counter-balance by highlighting that courageous factions and individual churchmen mounted principled, perilous resistance. In 1934, pastors Martin Niemöller and Dietrich Bonhoeffer established the Confessing Church (*Bekennende Kirche*), rallying 6,000 clergy against Nazi paganisation under the Barmen Declaration; Niemöller spent seven years in Sachsenhausen and Dachau concentration camps for his defiance. Furthermore, in 1937 Pope Pius XI issued the encyclical *Mit brennender Sorge* condemning Nazi racial idolatry, and in 1941 Catholic Bishop von Galen led courageous public sermons that forced Hitler to temporarily halt the Action T4 euthanasia programme. Therefore, Interpretation 1 is valid because individual church leaders displayed profound moral courage against totalitarian control.</p><p>In conclusion, I agree with Interpretation 2 to a substantial extent. While courageous figures like Niemöller and Galen proved individual heroism (Interpretation 1), ecclesiastical resistance was almost entirely defensive and aimed at preserving religious independence (*Selbstbehauptung*), rather than overthrowing the Nazi dictatorship or defending persecuted minorities.</p>",
      "verdict": "AO4 Level 4 (16 marks) • SPaG High (4 marks). Analytical, balanced evaluation of both interpretations against detailed historical context, culminating in a sustained, criteria-driven verdict with accurate specialist terminology."
    }
  },

  "lesson_4_4": {
    "tier_4m": {
      "title": "4/16 Basic Description",
      "score": "4 / 16 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Basic Description)",
      "text": "<p>Interpretation 2 argues that Kristallnacht was planned and organized by Nazi leaders rather than being a spontaneous riot. This is true because Goebbels made a speech telling the SA to attack synagogues. However, Interpretation 1 says the public were genuinely furious because a Polish Jew shot a German diplomat in Paris.</p>",
      "verdict": "AO4 Level 1 (4 marks) • SPaG Threshold (1 mark). Simple, generalized description of one view with brief mention of the other, lacking sustained historical analysis or criteria-driven evaluation."
    },
    "tier_8m": {
      "title": "8/16 Two-Sided Account",
      "score": "8 / 16 Marks",
      "level": "Level 2 Top / Level 3 Bottom (Two-Sided Account)",
      "text": "<p>On the one hand, Interpretation 2 is persuasive because the pogrom was directed from above. On 9 November 1938, Joseph Goebbels gave an inflammatory speech in Munich instructing party leaders that 'spontaneous' demonstrations should not be prevented. Reinhard Heydrich sent secret telegrams ordering police not to stop the arson and instructing fire brigades only to protect German property, while 20,000 Jewish men were arrested.<br><br>On the other hand, Interpretation 1 reflects the regime's claim that violence was an uncontrollable eruption of popular anger sparked by Herschel Grynszpan's assassination of Ernst vom Rath in Paris. Years of anti-Semitic propaganda had incited some public hatred.<br><br>Overall, I agree with Interpretation 2 because police orders prove it was coordinated state terror.</p>",
      "verdict": "AO4 Level 2 (8 marks) • SPaG Intermediate (2 marks). Explains both interpretations with relevant contextual facts, but lacks deep historiographical evaluation or a developed criteria-based verdict."
    },
    "tier_16m": {
      "title": "16/16 Grade 9 Exam ★",
      "score": "16 / 16 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Interpretation 2 presents a compelling and historically unimpeachable argument that the violence of *Kristallnacht* (9–10 November 1938) was a calculated, centrally orchestrated state pogrom rather than an uncontrollable public outburst. Following the assassination of diplomat Ernst vom Rath in Paris, Joseph Goebbels gave an incendiary speech in Munich signalling that anti-Jewish demonstrations should not be prevented. This was taken as a direct order. Security Police chief Reinhard Heydrich sent midnight telegrams ordering police not to intervene while SA men burned synagogues, but merely to protect German property. Over 91 Jews were murdered, 1,000 synagogues torched, and 30,000 Jewish men deported to camps. Therefore, Interpretation 2 is supported because secret police telegrams and coordinated SA arson prove systematic state orchestration.</p><p>However, Interpretation 1 provides a vital perspective by examining the regime's pretext and the pervasive atmosphere of radical antisemitic incitement that allowed the pogrom to occur. Vom Rath's murder provoked genuine fury among committed Nazis and radicalised youths. Five years of propaganda and the tabloid *Der Stürmer* had deeply dehumanised Jews. While most Germans watched in shocked silence, substantial numbers of off-duty SA men and Hitler Youth eagerly looted 7,500 businesses. Therefore, Interpretation 1 is valid because relentless ideological radicalisation created the public compliance necessary to execute the pogrom.</p><p>In conclusion, I agree with Interpretation 2 to a very large extent. While the assassination provided the pretext (Interpretation 1), plainclothes stormtroopers carried out the arson, fire brigades were ordered to stand down, and Göring imposed a punitive one billion mark fine, proving *Kristallnacht* was a state-directed pogrom.</p>",
      "verdict": "AO4 Level 4 (16 marks) • SPaG High (4 marks). Analytical, balanced evaluation of both interpretations against detailed historical context, culminating in a sustained, criteria-driven verdict with accurate specialist terminology."
    }
  }
};

module.exports = { usa16m, ger16m };
