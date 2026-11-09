// scripts/calibrate_paper3_8m.cjs
// Calibrates all 12 8-mark utility questions across USA (4) and Germany (8)
// Target budget for tier_8m: strictly 165-185 words
// Clean 3-tier rungs: tier_2m (~30-40w), tier_5m (~75-90w), tier_8m (165-185w)

const usa8m = {
  "lesson_1_3": {
    "tier_2m": {
      "title": "2/8 Simple Comment",
      "score": "2 / 8 Marks",
      "level": "Level 1 (Simple Comment on Surface Feature)",
      "text": "<p>Source B is useful because it tells people to stay off the buses. Source C is also useful because Martin Luther King gave a speech saying people were tired of oppression. Both sources show people were unhappy.</p>",
      "verdict": "AO3 (2 marks). Simple surface-level comments without evaluating provenance, context, or specific utility for the enquiry."
    },
    "tier_5m": {
      "title": "5/8 Partial Utility",
      "score": "5 / 8 Marks",
      "level": "Level 2 (Developed Content Analysis)",
      "text": "<p>Source B is useful because it explains the economic power of Black citizens, who made up over 70% of passengers, showing why the boycott worked. Source C is useful because King inspired people with Christian values to keep walking for 381 days.<br><br>However, neither source is evaluated for provenance, so reliability and purpose are not considered.</p>",
      "verdict": "AO3 (5 marks). Clear explanation of content and context for both sources, but lacks evaluation of provenance and tone."
    },
    "tier_8m": {
      "title": "8/8 Grade 9 Exam ★",
      "score": "8 / 8 Marks",
      "level": "Level 3 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Source B is highly useful for investigating the boycott’s success because it reveals the community's economic leverage, urging residents to 'stay off the buses' as 'Negroes did not ride, they could not operate'. Since Black citizens provided over 70% of passenger revenue, this leaflet demonstrates how financial pressure crippled the transit company. Produced by Jo Ann Robinson's Women's Political Council immediately following Rosa Parks' arrest, its purpose was mass mobilisation, making it authentic evidence of how local organisers coordinated 40,000 boycotters.</p><p>Source C is equally useful because it captures the moral and religious leadership that sustained the movement. King proclaimed that citizens were 'tired of being trampled over by the iron feet of oppression'. This Christian rhetoric sustained morale through 381 days of bombings and economic retaliation until *Browder v. Gayle*. As King’s opening address at Holt Street Baptist Church, its purpose was inspiration, providing valuable insight into how charismatic oratory maintained non-violent unity.</p><p>Together, both sources are valuable because they show practical economic organisation alongside spiritual resolve.</p>",
      "verdict": "AO3 (8 marks). Detailed evaluation of content, provenance, and historical context for both sources, assessing how they complement each other for the enquiry."
    }
  },

  "lesson_2_3": {
    "tier_2m": {
      "title": "2/8 Simple Comment",
      "score": "2 / 8 Marks",
      "level": "Level 1 (Simple Comment on Surface Feature)",
      "text": "<p>Source B is useful because it says America was divided into two societies. Source C is useful because an eyewitness says police treated them badly. Both sources show why people were angry and rioted.</p>",
      "verdict": "AO3 (2 marks). Simple surface-level comments without evaluating provenance, context, or specific utility for the enquiry."
    },
    "tier_5m": {
      "title": "5/8 Partial Utility",
      "score": "5 / 8 Marks",
      "level": "Level 2 (Developed Content Analysis)",
      "text": "<p>Source B is useful because the Kerner Commission proved that white racism and ghetto poverty created northern riots. Source C is useful because it gives an eyewitness view of police brutality in Watts that caused six days of violence.<br><br>However, the answer does not properly analyze the provenance or contrasting purposes of official reports versus personal accounts.</p>",
      "verdict": "AO3 (5 marks). Clear explanation of content and context for both sources, but lacks evaluation of provenance and tone."
    },
    "tier_8m": {
      "title": "8/8 Grade 9 Exam ★",
      "score": "8 / 8 Marks",
      "level": "Level 3 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Source B is highly useful for investigating the causes of urban riots because it provides an unsparing official diagnosis of structural inequality, warning that America was becoming 'two societies, one black, one white—separate and unequal'. This was accurate: northern *de facto* segregation trapped African Americans in redlined ghettos with double the white unemployment rate. As an official federal report commissioned by President Johnson after the 1967 Detroit riots, its purpose was objective sociological analysis, providing reliable proof that institutional white racism, not outside agitators, drove the uprisings.</p><p>Source C is equally useful because it captures the raw psychological fury on the streets, testifying that residents were 'treated like dogs by the police every single day'. This confirms that heavy-handed policing was the immediate spark in the 1965 Watts rebellion, which left 34 dead. As personal testimony from a Watts resident living through the violence, its purpose was to express community grief, offering invaluable insight into why peaceful protest lost credibility.</p><p>Together, both sources combine official systemic findings with authentic eyewitness testimony to explain urban unrest.</p>",
      "verdict": "AO3 (8 marks). Detailed evaluation of content, provenance, and historical context for both sources, assessing how they complement each other for the enquiry."
    }
  },

  "lesson_3_3": {
    "tier_2m": {
      "title": "2/8 Simple Comment",
      "score": "2 / 8 Marks",
      "level": "Level 1 (Simple Comment on Surface Feature)",
      "text": "<p>Source B is useful because it shows guerrilla traps were made from bamboo. Source C is useful because it shows Vietnamese porters carrying supplies on bicycles. Both sources show the Vietcong fought hard.</p>",
      "verdict": "AO3 (2 marks). Simple surface-level comments without evaluating provenance, context, or specific utility for the enquiry."
    },
    "tier_5m": {
      "title": "5/8 Partial Utility",
      "score": "5 / 8 Marks",
      "level": "Level 2 (Developed Content Analysis)",
      "text": "<p>Source B is useful because the military manual explains that punji traps were designed to maim US soldiers, slowing patrols. Source C is useful because it shows the Ho Chi Minh Trail used bicycles to keep supplies moving despite bombing.<br><br>However, the response focuses mainly on information without assessing provenance or military context in depth.</p>",
      "verdict": "AO3 (5 marks). Clear explanation of content and context for both sources, but lacks evaluation of provenance and tone."
    },
    "tier_8m": {
      "title": "8/8 Grade 9 Exam ★",
      "score": "8 / 8 Marks",
      "level": "Level 3 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Source B is highly useful for investigating why US military tactics failed because it details the asymmetric nature of guerrilla warfare, noting Vietcong traps were built from 'local bamboo, barbed wire, and unexploded American ordnance'. This explains how cheap punji pits neutralized superior US technology, designed 'to maim rather than kill' and paralyze infantry patrols. As an official US Army training manual from 1967, its purpose was practical tactical instruction, giving candid, highly reliable evidence of how guerrilla traps eroded American troop morale and destroyed mobility.</p><p>Source C is equally useful because it reveals the logistical resilience that defeated General Westmoreland's search-and-destroy doctrine. The photograph shows porters moving vital supplies on 'reinforced pack bicycles' along concealed jungle trails. Despite Operation Rolling Thunder dropping millions of tons of bombs, the Ho Chi Minh Trail kept supplies flowing south. As documentary wartime photography, its purpose was recording supply operations, providing valuable visual proof of Vietnamese perseverance.</p><p>Together, both sources explain why high-tech conventional warfare failed against cheap, resilient guerrilla tactics.</p>",
      "verdict": "AO3 (8 marks). Detailed evaluation of content, provenance, and historical context for both sources, assessing how they complement each other for the enquiry."
    }
  },

  "lesson_4_3": {
    "tier_2m": {
      "title": "2/8 Simple Comment",
      "score": "2 / 8 Marks",
      "level": "Level 1 (Simple Comment on Surface Feature)",
      "text": "<p>Source B is useful because it shows John Dean testifying before Congress. Source C is useful because it shows newspaper headlines about Watergate. Both sources show people were investigating President Nixon.</p>",
      "verdict": "AO3 (2 marks). Simple surface-level comments without evaluating provenance, context, or specific utility for the enquiry."
    },
    "tier_5m": {
      "title": "5/8 Partial Utility",
      "score": "5 / 8 Marks",
      "level": "Level 2 (Developed Content Analysis)",
      "text": "<p>Source B is useful because White House counsel John Dean testified under oath that Nixon was personally involved in the cover-up. Source C is useful because the Washington Post articles revealed hush money was paid to the burglars.<br><br>However, provenance is treated briefly and the sources are not compared for overall utility.</p>",
      "verdict": "AO3 (5 marks). Clear explanation of content and context for both sources, but lacks evaluation of provenance and tone."
    },
    "tier_8m": {
      "title": "8/8 Grade 9 Exam ★",
      "score": "8 / 8 Marks",
      "level": "Level 3 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Source B is highly useful for investigating the Watergate cover-up because it reveals direct White House complicity, with White House counsel John Dean testifying that there was 'a cancer growing on the presidency'. Dean admitted that hush money exceeding $400,000 was paid to buy the silence of the Watergate burglars. As sworn testimony before the televised Senate Watergate Committee in June 1973, Dean faced perjury charges, giving his insider allegations immense credibility in demonstrating criminal obstruction within Nixon's inner circle.</p><p>Source C is equally useful because it illustrates the crucial role of investigative journalism in exposing the conspiracy. The *Washington Post* report details how Woodward and Bernstein traced laundered funds from the burglars directly back to the Committee to Re-elect the President (CREEP). As contemporary news reporting based on confidential source 'Deep Throat', its purpose was public disclosure, providing reliable evidence of how investigative press pressure prevented the administration from suppressing the scandal.</p><p>Together, both sources combine insider political testimony with investigative press reporting to illuminate the cover-up.</p>",
      "verdict": "AO3 (8 marks). Detailed evaluation of content, provenance, and historical context for both sources, assessing how they complement each other for the enquiry."
    }
  }
};

const ger8m = {
  "lesson_1_2": {
    "tier_2m": {
      "title": "2/8 Simple Comment",
      "score": "2 / 8 Marks",
      "level": "Level 1 (Simple Comment on Surface Feature)",
      "text": "<p>Source B is useful because Brockdorff-Rantzau says Germany will not admit sole guilt. Source C is useful because a British cartoon shows Germany forced to take medicine. Both sources show people were angry.</p>",
      "verdict": "AO3 (2 marks). Simple surface-level comments without evaluating provenance, context, or specific utility for the enquiry."
    },
    "tier_5m": {
      "title": "5/8 Partial Utility",
      "score": "5 / 8 Marks",
      "level": "Level 2 (Developed Content Analysis)",
      "text": "<p>Source B is useful because the German delegate refused to accept sole blame under Article 231, showing German outrage at being forced to sign a 'Diktat'. Source C is useful because Allied politicians like Lloyd George wanted reparations to punish Germany.<br><br>However, neither source is properly evaluated for provenance, so the author's motive and historical reliability are not addressed.</p>",
      "verdict": "AO3 (5 marks). Clear explanation of content and context for both sources, but lacks evaluation of provenance and tone."
    },
    "tier_8m": {
      "title": "8/8 Grade 9 Exam ★",
      "score": "8 / 8 Marks",
      "level": "Level 3 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Source B is highly useful for investigating German hostility to Versailles because it shows Count Brockdorff-Rantzau repudiating War Guilt, declaring that 'confessions of guilt would be a lie'. German delegates were excluded from negotiations and presented with a non-negotiable 'Diktat', forced to accept £6.6 billion reparations and military reduction to 100,000 men. As an official diplomatic speech delivered before the Paris Peace Conference in May 1919, its purpose was formal protest, providing reliable evidence of German outrage over Article 231.</p><p>Source C is equally useful because it exposes Allied determination to punish Germany. The British cartoon depicts the Allies forcing Germany to swallow the peace terms, reflecting Prime Minister Lloyd George's public promise to 'squeeze Germany until the pips squeak'. French Premier Georges Clemenceau sought to permanently crush Germany militarily to guarantee French border security. As contemporary political satire from *Punch*, its purpose was British public commentary, capturing the victor powers' uncompromising and punitive posture.</p><p>Together, both sources illustrate the irreconcilable divide between Allied retribution and German resentment.</p>",
      "verdict": "AO3 (8 marks). Detailed evaluation of content, provenance, and historical context for both sources, assessing how they complement each other for the enquiry."
    }
  },

  "lesson_1_3": {
    "tier_2m": {
      "title": "2/8 Simple Comment",
      "score": "2 / 8 Marks",
      "level": "Level 1 (Simple Comment on Surface Feature)",
      "text": "<p>Source B is useful because it shows children playing with stacks of worthless banknotes. Source C is useful because an old woman says her savings were wiped out. Both sources show money was useless.</p>",
      "verdict": "AO3 (2 marks). Simple surface-level comments without evaluating provenance, context, or specific utility for the enquiry."
    },
    "tier_5m": {
      "title": "5/8 Partial Utility",
      "score": "5 / 8 Marks",
      "level": "Level 2 (Developed Content Analysis)",
      "text": "<p>Source B is useful because the photograph proves money had lost all value, with a loaf of bread costing 200 billion marks. Source C is useful because it shows the middle classes lost all their savings and pensions.<br><br>However, the answer lacks detailed provenance evaluation and does not weigh their combined utility.</p>",
      "verdict": "AO3 (5 marks). Clear explanation of content and context for both sources, but lacks evaluation of provenance and tone."
    },
    "tier_8m": {
      "title": "8/8 Grade 9 Exam ★",
      "score": "8 / 8 Marks",
      "level": "Level 3 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Source B is highly useful for investigating the impact of hyperinflation because it provides stark visual proof of the mark's total collapse, showing children building pyramids with worthless bundles of cash. Following the French occupation of the Ruhr and the Weimar government's passive resistance strike, unbacked currency printing caused bread prices to surge to 201 billion marks by November 1923. As an authentic contemporary press photograph from Berlin, its purpose was photojournalism, offering indisputable evidence of how hyperinflation destroyed the monetary system.</p><p>Source C is equally useful because it articulates the psychological trauma inflicted upon the middle classes. The memoir recalls how a lifetime of savings was 'wiped out overnight, reducing respectable families to begging'. While workers' wages adjusted and debtors cleared mortgages cheaply, pensioners and civil servants lost everything. As reflective personal testimony written by a German schoolteacher, its purpose was recording private tragedy, giving deeply authentic insight into the bitterness that undermined Weimar democracy.</p><p>Together, both sources capture the economic absurdity and lasting social trauma of 1923.</p>",
      "verdict": "AO3 (8 marks). Detailed evaluation of content, provenance, and historical context for both sources, assessing how they complement each other for the enquiry."
    }
  },

  "lesson_2_2": {
    "tier_2m": {
      "title": "2/8 Simple Comment",
      "score": "2 / 8 Marks",
      "level": "Level 1 (Simple Comment on Surface Feature)",
      "text": "<p>Source B is useful because a Nazi poster promises jobs to unemployed workers. Source C is useful because a voter explains why they supported Hitler. Both sources show the Nazis were popular.</p>",
      "verdict": "AO3 (2 marks). Simple surface-level comments without evaluating provenance, context, or specific utility for the enquiry."
    },
    "tier_5m": {
      "title": "5/8 Partial Utility",
      "score": "5 / 8 Marks",
      "level": "Level 2 (Developed Content Analysis)",
      "text": "<p>Source B is useful because it shows the slogan 'Our Last Hope: Hitler', appealing to six million unemployed Germans. Source C is useful because a farmer explains that fear of communism drove him to the Nazis.<br><br>However, the answer lacks developed evaluation of propaganda techniques and provenance.</p>",
      "verdict": "AO3 (5 marks). Clear explanation of content and context for both sources, but lacks evaluation of provenance and tone."
    },
    "tier_8m": {
      "title": "8/8 Grade 9 Exam ★",
      "score": "8 / 8 Marks",
      "level": "Level 3 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Source B is highly useful for investigating Nazi electoral appeal because it shows how propaganda exploited economic despair, featuring desperate faces under the slogan 'Our Last Hope: Hitler'. Following the 1929 Wall Street Crash, unemployment reached six million by 1932, and Heinrich Brüning's welfare cuts caused mass destitution. As an official Reichstag election poster from July 1932 produced by Goebbels, its purpose was emotional persuasion, providing direct evidence of how the NSDAP framed Hitler as a providential saviour to win 230 seats.</p><p>Source C is equally useful because it explains why the middle classes and farmers abandoned moderate parties. The diary records a shopkeeper's fear that 'communists will seize our businesses unless we back Hitler'. The SA's street violence against communists appealed to terrified smallholders (*Mittelstand*). As private, unvarnished diary entries from 1931, the author had no propaganda motive, offering highly reliable insight into how anti-Marxist dread drove ordinary voters into the Nazi coalition.</p><p>Together, both sources reveal how visual propaganda and anti-communist panic combined to build mass electoral support.</p>",
      "verdict": "AO3 (8 marks). Detailed evaluation of content, provenance, and historical context for both sources, assessing how they complement each other for the enquiry."
    }
  },

  "lesson_2_3": {
    "tier_2m": {
      "title": "2/8 Simple Comment",
      "score": "2 / 8 Marks",
      "level": "Level 1 (Simple Comment on Surface Feature)",
      "text": "<p>Source B is useful because it shows the Reichstag building in flames. Source C is useful because it describes the SA attacking opposition voters before the election. Both sources show how the Nazis won.</p>",
      "verdict": "AO3 (2 marks). Simple surface-level comments without evaluating provenance, context, or specific utility for the enquiry."
    },
    "tier_5m": {
      "title": "5/8 Partial Utility",
      "score": "5 / 8 Marks",
      "level": "Level 2 (Developed Content Analysis)",
      "text": "<p>Source B is useful because the Reichstag Fire Decree suspended civil liberties and allowed Hitler to arrest 4,000 communists. Source C is useful because it shows 50,000 SA auxiliary police intimidated voters on polling day.<br><br>However, provenance and reliability are only briefly mentioned without detailed historical critique.</p>",
      "verdict": "AO3 (5 marks). Clear explanation of content and context for both sources, but lacks evaluation of provenance and tone."
    },
    "tier_8m": {
      "title": "8/8 Grade 9 Exam ★",
      "score": "8 / 8 Marks",
      "level": "Level 3 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Source B is highly useful for investigating how the Nazis secured victory in March 1933 because it shows the state's legal suppression of civil rights, decreeing 'restrictions on personal liberty and freedom of speech'. Following the Reichstag Fire of 27 February, Hitler persuaded Hindenburg to sign the Emergency Decree, enabling the arrest of 4,000 communist leaders and banning anti-Nazi newspapers. As an official statutory emergency decree, its purpose was legal coercion, providing unimpeachable evidence of how the state apparatus silenced political rivals.</p><p>Source C is equally useful because it exposes the physical terror on the streets. The British correspondent notes that 'uniformed stormtroopers stood over ballot boxes, checking voters' slips'. Hermann Göring enrolled 50,000 SA men as auxiliary police, terrorising SPD and KPD candidates. As reportage by an independent British journalist in Berlin, the author had no reason to flatter Hitler, giving the account high reliability in capturing the climate of fear during polling.</p><p>Together, both sources demonstrate how state emergency decrees and street-level SA violence combined to manipulate the election.</p>",
      "verdict": "AO3 (8 marks). Detailed evaluation of content, provenance, and historical context for both sources, assessing how they complement each other for the enquiry."
    }
  },

  "lesson_3_2": {
    "tier_2m": {
      "title": "2/8 Simple Comment",
      "score": "2 / 8 Marks",
      "level": "Level 1 (Simple Comment on Surface Feature)",
      "text": "<p>Source B is useful because it shows a Gestapo file with citizen denunciations. Source C is useful because people lowered their voices in public. Both sources show the Gestapo was scary.</p>",
      "verdict": "AO3 (2 marks). Simple surface-level comments without evaluating provenance, context, or specific utility for the enquiry."
    },
    "tier_5m": {
      "title": "5/8 Partial Utility",
      "score": "5 / 8 Marks",
      "level": "Level 2 (Developed Content Analysis)",
      "text": "<p>Source B is useful because Gestapo files prove that over 80% of investigations came from voluntary public denunciations. Source C is useful because it shows fear of the 'German glance' prevented dissent.<br><br>However, the answer lacks developed evaluation of police record provenance and surveillance limits.</p>",
      "verdict": "AO3 (5 marks). Clear explanation of content and context for both sources, but lacks evaluation of provenance and tone."
    },
    "tier_8m": {
      "title": "8/8 Grade 9 Exam ★",
      "score": "8 / 8 Marks",
      "level": "Level 3 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Source B is highly useful for investigating Gestapo terror because it exposes civilian complicity, detailing how a neighbour denounced a worker for 'listening to foreign broadcasts and insulting the Führer'. In reality, the Gestapo was remarkably small, with only 28 officers policing a city like Frankfurt, meaning the apparatus relied on voluntary citizen denunciations for 80% of cases. As a confidential internal Gestapo case file from 1936, its purpose was routine administrative record-keeping, providing objective, unvarnished proof of how civilian informers enabled state surveillance.</p><p>Source C is equally useful because it reveals the pervasive climate of paranoia among ordinary citizens. An eyewitness recalls the infamous 'German glance'—looking nervously over both shoulders before speaking to avoid arrest. Fear of *Schutzhaft* (indefinite protective custody) without judicial trial in Dachau deterred open public dissent. As personal testimony from an ordinary German civilian, its purpose was to describe daily life under totalitarianism, giving authentic insight into how psychological terror enforced self-censorship.</p><p>Together, both sources show how real terror combined with public informers to maintain totalitarian control.</p>",
      "verdict": "AO3 (8 marks). Detailed evaluation of content, provenance, and historical context for both sources, assessing how they complement each other for the enquiry."
    }
  },

  "lesson_3_3": {
    "tier_2m": {
      "title": "2/8 Simple Comment",
      "score": "2 / 8 Marks",
      "level": "Level 1 (Simple Comment on Surface Feature)",
      "text": "<p>Source B is useful because it advertises the cheap People's Receiver radio. Source C is useful because William Shirer describes Hitler speaking at the Nuremberg Rally. Both sources show propaganda.</p>",
      "verdict": "AO3 (2 marks). Simple surface-level comments without evaluating provenance, context, or specific utility for the enquiry."
    },
    "tier_5m": {
      "title": "5/8 Partial Utility",
      "score": "5 / 8 Marks",
      "level": "Level 2 (Developed Content Analysis)",
      "text": "<p>Source B is useful because subsidizing the radio to 76 Reichsmarks allowed Goebbels to reach 70% of households by 1939. Source C is useful because Shirer explains how rallies created mystical devotion to Hitler.<br><br>However, provenance and propaganda intent are not fully evaluated.</p>",
      "verdict": "AO3 (5 marks). Clear explanation of content and context for both sources, but lacks evaluation of provenance and tone."
    },
    "tier_8m": {
      "title": "8/8 Grade 9 Exam ★",
      "score": "8 / 8 Marks",
      "level": "Level 3 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Source B is highly useful for investigating Nazi propaganda because it shows how technology was monopolised, proclaiming that 'All Germany hears the Führer with the People's Receiver'. By subsidising the radio to 76 Reichsmarks, Goebbels ensured ownership surged from 25% to 70% by 1939, while technical limits prevented listening to foreign broadcasts. As an official commercial poster from 1933, its purpose was mass dissemination, providing authentic proof of how the regime prioritised acoustic control of German homes.</p><p>Source C is equally useful because it documents the hypnotic power of mass rallies. American correspondent William Shirer observed that 'Hitler is restoring pageantry, colour, and mystical excitement to a drab people', with Albert Speer's 'Cathedral of Light' inducing collective ecstasy. As a contemporary diary entry by an accredited foreign journalist in 1934, Shirer had no motive to flatter the regime, offering highly reliable evidence of how theatrical choreography bypassed rational thought to forge fanatical devotion.</p><p>Together, both sources illustrate how domestic broadcasting and public spectacles engineered total ideological compliance.</p>",
      "verdict": "AO3 (8 marks). Detailed evaluation of content, provenance, and historical context for both sources, assessing how they complement each other for the enquiry."
    }
  },

  "lesson_4_2": {
    "tier_2m": {
      "title": "2/8 Simple Comment",
      "score": "2 / 8 Marks",
      "level": "Level 1 (Simple Comment on Surface Feature)",
      "text": "<p>Source A is useful because it says joining the Hitler Youth was compulsory. Source B is useful because Hitler says boys must be tough as steel. Both sources show how children were trained.</p>",
      "verdict": "AO3 (2 marks). Simple surface-level comments without evaluating provenance, context, or specific utility for the enquiry."
    },
    "tier_5m": {
      "title": "5/8 Partial Utility",
      "score": "5 / 8 Marks",
      "level": "Level 2 (Developed Content Analysis)",
      "text": "<p>Source A is useful because the 1939 decree made Hitler Youth service compulsory for eight million boys and girls. Source B is useful because Hitler's speech demanded boys become 'tough as Krupp steel' for military service.<br><br>However, the answer lacks detailed provenance critique and utility comparison.</p>",
      "verdict": "AO3 (5 marks). Clear explanation of content and context for both sources, but lacks evaluation of provenance and tone."
    },
    "tier_8m": {
      "title": "8/8 Grade 9 Exam ★",
      "score": "8 / 8 Marks",
      "level": "Level 3 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Source A is highly useful for investigating Nazi youth control because it reveals the legal monopolisation of childhood, decreeing that 'all youths between 10 and 18 are obliged to serve in the Hitler Youth'. This statute subordinated parents and churches to the state, requiring children to be 'educated physically, intellectually, and morally in National Socialism'. As an official legislative decree issued in March 1939, its purpose was statutory conscription, providing unimpeachable legal evidence of the regime forcing eight million adolescents into ideological obedience.</p><p>Source B is equally useful because it exposes the militaristic ideals drilled into boys, with Hitler declaring that the German youth must be 'swift as a greyhound, tough as leather, and hard as Krupp steel'. This Spartan training prioritized combat readiness over academic study to prepare boys for the Wehrmacht. Delivered before 54,000 youths at the Nuremberg rally, Hitler’s purpose was inspirational indoctrination, offering direct evidence of martial conditioning.</p><p>Together, both sources demonstrate the statutory compulsion and physical militarisation used to control young Germans.</p>",
      "verdict": "AO3 (8 marks). Detailed evaluation of content, provenance, and historical context for both sources, assessing how they complement each other for the enquiry."
    }
  },

  "lesson_4_3": {
    "tier_2m": {
      "title": "2/8 Simple Comment",
      "score": "2 / 8 Marks",
      "level": "Level 1 (Simple Comment on Surface Feature)",
      "text": "<p>Source B is useful because it praises the Autobahn for giving workers jobs. Source C is useful because it shows workers worked longer hours for less money. Both sources show the effect on workers.</p>",
      "verdict": "AO3 (2 marks). Simple surface-level comments without evaluating provenance, context, or specific utility for the enquiry."
    },
    "tier_5m": {
      "title": "5/8 Partial Utility",
      "score": "5 / 8 Marks",
      "level": "Level 2 (Developed Content Analysis)",
      "text": "<p>Source B is useful because Fritz Todt claimed public works gave dignity back to workers. Source C is useful because statistical records show working hours rose from 43 to 49 per week with banned trade unions.<br><br>However, the answer lacks developed evaluation of official propaganda versus economic payroll data.</p>",
      "verdict": "AO3 (5 marks). Clear explanation of content and context for both sources, but lacks evaluation of provenance and tone."
    },
    "tier_8m": {
      "title": "8/8 Grade 9 Exam ★",
      "score": "8 / 8 Marks",
      "level": "Level 3 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>Source B is highly useful for investigating Nazi economic policies because it shows how public works were used for propaganda, celebrating the Autobahn as 'our primary weapon in conquering unemployment'. Todt framed manual construction as an honourable duty that restored national pride, even though only 125,000 men were directly employed on motorways. As an official progress report by the Inspector of Highways in 1936, its purpose was to glorify state infrastructure, providing authentic evidence of how the regime manufactured consent through engineering triumphs.</p><p>Source C is equally useful because it exposes the increased exploitation behind official employment figures, recording that 'weekly working hours increased from 43 in 1933 to 49 by 1939'. With trade unions banned and replaced by Robert Ley's German Labour Front (DAF), wage bargaining was outlawed and take-home pay was eroded by compulsory deductions. As an internal statistical payroll survey, its purpose was industrial planning, providing unvarnished proof of falling real living standards.</p><p>Together, both sources contrast official propaganda triumphs with the reality of working-class regimentation.</p>",
      "verdict": "AO3 (8 marks). Detailed evaluation of content, provenance, and historical context for both sources, assessing how they complement each other for the enquiry."
    }
  }
};

module.exports = { usa8m, ger8m };
