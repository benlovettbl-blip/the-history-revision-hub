// scripts/calibrate_cw_consequences.cjs
// Calibrates all 14 4-mark consequence questions in Superpower Relations & Cold War (cold_war.json)
// Target budget: strictly 60-75 words for tier_4m
// 1 PEEL paragraph ending with explicit consequence link

const cw4m = {
  "lesson_1_q1": {
    "tier_1m": {
      "title": "1/4 Simple Statement",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p>One consequence of ideological differences was that the USA and Soviet Union distrusted each other after 1945.</p>",
      "verdict": "AO1/AO2 (1 mark). Simple assertion identifying a consequence but lacking supporting historical evidence."
    },
    "tier_2m": {
      "title": "2/4 Partial Explanation",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Partial Explanation)",
      "text": "<p>One consequence was growing suspicion because the USA believed in democratic capitalism while the USSR was a communist dictatorship. This created mutual fear once their common Nazi enemy was defeated.</p>",
      "verdict": "AO1/AO2 (2 marks). Identifies and describes a valid consequence with basic context, but lacks specific factual detail or developed causal explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One significant consequence of ideological differences was the emergence of deep post-war mistrust between the superpowers. While the USA championed liberal democracy, free-market capitalism, and individual liberty, the Soviet Union was a Marxist-Leninist dictatorship enforcing state command economics. Once Nazi Germany was defeated in 1945, this fundamental ideological clash resurfaced. Therefore, this had a major consequence because it destroyed wartime cooperation and convinced both powers that peaceful coexistence was impossible.</p>",
      "verdict": "AO1/AO2 (4 marks). Full marks awarded. Clearly identifies a consequence, provides precise factual evidence, and fully explains the resulting impact."
    }
  },

  "lesson_1_q2": {
    "tier_1m": {
      "title": "1/4 Simple Statement",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p>One consequence of the Tehran Conference was that the Big Three agreed to invade France to help the Soviet Union.</p>",
      "verdict": "AO1/AO2 (1 mark). Simple assertion identifying a consequence but lacking supporting historical evidence."
    },
    "tier_2m": {
      "title": "2/4 Partial Explanation",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Partial Explanation)",
      "text": "<p>One consequence was that Britain and the USA agreed to open a second front in Western Europe in May 1944. This pleased Stalin because the Red Army had faced the brunt of German forces.</p>",
      "verdict": "AO1/AO2 (2 marks). Identifies and describes a valid consequence with basic context, but lacks specific factual detail or developed causal explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One significant consequence of the Tehran Conference was the formal agreement to open a second front in Western Europe. Churchill and Roosevelt agreed to launch Operation Overlord across the English Channel in May 1944, easing military pressure on the Soviet Red Army. Therefore, this had a vital consequence for the Grand Alliance because fulfilling Stalin’s long-standing demand established temporary strategic unity and boosted Soviet trust in Western military commitments.</p>",
      "verdict": "AO1/AO2 (4 marks). Full marks awarded. Clearly identifies a consequence, provides precise factual evidence, and fully explains the resulting impact."
    }
  },

  "lesson_2_q1": {
    "tier_1m": {
      "title": "1/4 Simple Statement",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p>One consequence of the Yalta Conference was that the Allies decided to divide Germany into four occupation zones.</p>",
      "verdict": "AO1/AO2 (1 mark). Simple assertion identifying a consequence but lacking supporting historical evidence."
    },
    "tier_2m": {
      "title": "2/4 Partial Explanation",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Partial Explanation)",
      "text": "<p>One consequence was that Germany and Berlin were partitioned into four zones for Britain, the USA, the USSR, and France. Stalin also promised free elections in Eastern Europe under the Declaration on Liberated Europe.</p>",
      "verdict": "AO1/AO2 (2 marks). Identifies and describes a valid consequence with basic context, but lacks specific factual detail or developed causal explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One significant consequence of the Yalta Conference was the agreement to divide post-war Germany and Berlin into four occupation zones. The Big Three allocated zones to Britain, the USA, the USSR, and France, managed through the Allied Control Council. Therefore, this was a decisive consequence because physically dividing German territory institutionalised superpower rivalry in the heart of Europe, creating the geographic fault line for future Cold War confrontation.</p>",
      "verdict": "AO1/AO2 (4 marks). Full marks awarded. Clearly identifies a consequence, provides precise factual evidence, and fully explains the resulting impact."
    }
  },

  "lesson_2_q2": {
    "tier_1m": {
      "title": "1/4 Simple Statement",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p>One consequence of the US atomic bomb was that Stalin felt threatened and started his own nuclear programme.</p>",
      "verdict": "AO1/AO2 (1 mark). Simple assertion identifying a consequence but lacking supporting historical evidence."
    },
    "tier_2m": {
      "title": "2/4 Partial Explanation",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Partial Explanation)",
      "text": "<p>One consequence was that Truman used the bomb at Hiroshima and Nagasaki to end the war, which increased suspicion at Potsdam. Stalin realised America possessed a weapon of mass destruction that threatened the USSR.</p>",
      "verdict": "AO1/AO2 (2 marks). Identifies and describes a valid consequence with basic context, but lacks specific factual detail or developed causal explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One significant consequence of American development of the atomic bomb was the dramatic escalation of nuclear rivalry. The successful Trinity test in July 1945 gave President Truman immense diplomatic confidence at Potsdam, while the bombings of Hiroshima and Nagasaki alarmed Stalin. Therefore, this had a major consequence because it convinced Stalin that the USA intended nuclear intimidation, forcing the Soviet Union to accelerate its own atomic bomb programme by August 1949.</p>",
      "verdict": "AO1/AO2 (4 marks). Full marks awarded. Clearly identifies a consequence, provides precise factual evidence, and fully explains the resulting impact."
    }
  },

  "lesson_3_q1": {
    "tier_1m": {
      "title": "1/4 Simple Statement",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p>One consequence of Churchill's Iron Curtain speech was that it angered Stalin and made Cold War tensions worse.</p>",
      "verdict": "AO1/AO2 (1 mark). Simple assertion identifying a consequence but lacking supporting historical evidence."
    },
    "tier_2m": {
      "title": "2/4 Partial Explanation",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Partial Explanation)",
      "text": "<p>One consequence was that Churchill openly accused the Soviet Union of creating an 'iron curtain' dividing Europe. Stalin reacted furiously in *Pravda*, comparing Churchill to Adolf Hitler and claiming the speech was a call to war.</p>",
      "verdict": "AO1/AO2 (2 marks). Identifies and describes a valid consequence with basic context, but lacks specific factual detail or developed causal explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One significant consequence of Churchill’s 'Iron Curtain' speech in March 1946 was the public hardening of ideological hostility between East and West. Speaking in Fulton, Missouri, Churchill declared that an 'iron curtain has descended across the Continent', warning against Soviet expansion. Therefore, this had a major consequence because Stalin responded aggressively in *Pravda*, comparing Churchill to Hitler and framing the speech as Western warmongering that justified Soviet satellite domination.</p>",
      "verdict": "AO1/AO2 (4 marks). Full marks awarded. Clearly identifies a consequence, provides precise factual evidence, and fully explains the resulting impact."
    }
  },

  "lesson_3_q2": {
    "tier_1m": {
      "title": "1/4 Simple Statement",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p>One consequence of the Truman Doctrine was that the USA gave $400 million to stop communism in Greece and Turkey.</p>",
      "verdict": "AO1/AO2 (1 mark). Simple assertion identifying a consequence but lacking supporting historical evidence."
    },
    "tier_2m": {
      "title": "2/4 Partial Explanation",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Partial Explanation)",
      "text": "<p>One consequence was that America adopted a policy of containment to stop Soviet expansion. Truman provided $400 million in military and economic aid to Greece and Turkey, which prevented communist rebels from seizing power.</p>",
      "verdict": "AO1/AO2 (2 marks). Identifies and describes a valid consequence with basic context, but lacks specific factual detail or developed causal explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One significant consequence of the Truman Doctrine in March 1947 was the official commitment of the United States to a global policy of containment. Truman pledged $400 million in economic and military aid to resist communist subversion in Greece and Turkey. Therefore, this was a decisive consequence because it ended American peacetime isolationism and committed the US government to actively resisting Soviet expansionism anywhere in the world.</p>",
      "verdict": "AO1/AO2 (4 marks). Full marks awarded. Clearly identifies a consequence, provides precise factual evidence, and fully explains the resulting impact."
    }
  },

  "lesson_4_q1": {
    "tier_1m": {
      "title": "1/4 Simple Statement",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p>One consequence of the Cuban Revolution was that Fidel Castro overthrew Batista and allied Cuba with the Soviet Union.</p>",
      "verdict": "AO1/AO2 (1 mark). Simple assertion identifying a consequence but lacking supporting historical evidence."
    },
    "tier_2m": {
      "title": "2/4 Partial Explanation",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Partial Explanation)",
      "text": "<p>One consequence was that Cuba nationalised American sugar plantations and businesses in 1959. In response, Eisenhower imposed a trade embargo, so Castro signed trade agreements with Khrushchev and bought Soviet oil.</p>",
      "verdict": "AO1/AO2 (2 marks). Identifies and describes a valid consequence with basic context, but lacks specific factual detail or developed causal explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One significant consequence of the 1959 Cuban Revolution was the establishment of a pro-Soviet communist ally on the USA’s doorstep. After Fidel Castro seized power, he nationalised $1 billion of American-owned businesses and sugar refineries. Following the US sugar embargo, Castro turned to Moscow, securing Soviet oil and economic subsidies. Therefore, this had a profound consequence because it gave the USSR a strategic military foothold just ninety miles from Florida.</p>",
      "verdict": "AO1/AO2 (4 marks). Full marks awarded. Clearly identifies a consequence, provides precise factual evidence, and fully explains the resulting impact."
    }
  },

  "lesson_4_q2": {
    "tier_1m": {
      "title": "1/4 Simple Statement",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p>One consequence of the Bay of Pigs was that it humiliated President Kennedy and pushed Castro closer to Khrushchev.</p>",
      "verdict": "AO1/AO2 (1 mark). Simple assertion identifying a consequence but lacking supporting historical evidence."
    },
    "tier_2m": {
      "title": "2/4 Partial Explanation",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Partial Explanation)",
      "text": "<p>One consequence was that the CIA invasion of 1,400 Cuban exiles in April 1961 failed completely. Kennedy refused air support, so Castro's troops defeated the invaders within three days, making the US look weak.</p>",
      "verdict": "AO1/AO2 (2 marks). Identifies and describes a valid consequence with basic context, but lacks specific factual detail or developed causal explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One significant consequence of the disastrous Bay of Pigs invasion in April 1961 was the direct deployment of Soviet nuclear weapons to Cuba. The botched CIA landing by 1,400 Cuban exiles publicly humiliated President Kennedy and exposed American aggression. Convinced another invasion was imminent, Castro appealed to Khrushchev for military protection. Therefore, this was a decisive consequence because it led Khrushchev to secretly install medium-range nuclear missiles in Cuba in 1962.</p>",
      "verdict": "AO1/AO2 (4 marks). Full marks awarded. Clearly identifies a consequence, provides precise factual evidence, and fully explains the resulting impact."
    }
  },

  "lesson_5_q1": {
    "tier_1m": {
      "title": "1/4 Simple Statement",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p>One consequence of the Korean War was that the USA expanded NATO and spent much more money on its military.</p>",
      "verdict": "AO1/AO2 (1 mark). Simple assertion identifying a consequence but lacking supporting historical evidence."
    },
    "tier_2m": {
      "title": "2/4 Partial Explanation",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Partial Explanation)",
      "text": "<p>One consequence was that the Cold War expanded into Asia. The USA defended South Korea under the United Nations, and President Truman quadrupled American defence spending under NSC-68 while adding Greece and Turkey to NATO.</p>",
      "verdict": "AO1/AO2 (2 marks). Identifies and describes a valid consequence with basic context, but lacks specific factual detail or developed causal explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One significant consequence of the Korean War (1950–1953) was the globalisation and militarisation of the Cold War. Following North Korea’s invasion, the USA committed troops under the UN flag and implemented NSC-68, quadrupling American military spending. America also formed regional anti-communist alliances like SEATO. Therefore, this had a profound consequence because it transformed containment from a European economic policy into an aggressive worldwide armed confrontation across Asia.</p>",
      "verdict": "AO1/AO2 (4 marks). Full marks awarded. Clearly identifies a consequence, provides precise factual evidence, and fully explains the resulting impact."
    }
  },

  "lesson_5_q2": {
    "tier_1m": {
      "title": "1/4 Simple Statement",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p>One consequence of the Gulf of Tonkin incident was that Congress let President Johnson send combat troops to Vietnam.</p>",
      "verdict": "AO1/AO2 (1 mark). Simple assertion identifying a consequence but lacking supporting historical evidence."
    },
    "tier_2m": {
      "title": "2/4 Partial Explanation",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Partial Explanation)",
      "text": "<p>One consequence was that Congress passed the Gulf of Tonkin Resolution in August 1964. This gave President Johnson power to take all necessary measures in Vietnam without declaring war, leading to Operation Rolling Thunder.</p>",
      "verdict": "AO1/AO2 (2 marks). Identifies and describes a valid consequence with basic context, but lacks specific factual detail or developed causal explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One significant consequence of the Gulf of Tonkin incident in August 1964 was the dramatic escalation of direct US military intervention in Vietnam. Following alleged North Vietnamese torpedo attacks on US destroyers, Congress passed the Gulf of Tonkin Resolution, granting President Johnson authority to wage undeclared war. Therefore, this was a vital consequence because it authorised Operation Rolling Thunder bombing and committed over 500,000 American combat troops by 1968.</p>",
      "verdict": "AO1/AO2 (4 marks). Full marks awarded. Clearly identifies a consequence, provides precise factual evidence, and fully explains the resulting impact."
    }
  },

  "lesson_6_q1": {
    "tier_1m": {
      "title": "1/4 Simple Statement",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p>One consequence of Glasnost was that Soviet citizens were allowed to criticise the communist government and history.</p>",
      "verdict": "AO1/AO2 (1 mark). Simple assertion identifying a consequence but lacking supporting historical evidence."
    },
    "tier_2m": {
      "title": "2/4 Partial Explanation",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Partial Explanation)",
      "text": "<p>One consequence was that Gorbachev's policy of 'openness' lifted censorship. Soviet citizens learned the truth about Stalin’s crimes, state corruption, and economic failures, which made people openly question the Communist Party's right to rule.</p>",
      "verdict": "AO1/AO2 (2 marks). Identifies and describes a valid consequence with basic context, but lacks specific factual detail or developed causal explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One significant consequence of Mikhail Gorbachev’s policy of *Glasnost* ('openness') was the collapse of totalitarian state censorship across the Soviet Union. Introduced in 1986, citizens gained unprecedented freedom to read banned literature and investigate historical atrocities like Stalin’s purges. Therefore, this had a revolutionary consequence because exposing state corruption and economic dysfunction shattered public trust in the Communist Party, fueling nationalist protests in non-Russian republics.</p>",
      "verdict": "AO1/AO2 (4 marks). Full marks awarded. Clearly identifies a consequence, provides precise factual evidence, and fully explains the resulting impact."
    }
  },

  "lesson_6_q2": {
    "tier_1m": {
      "title": "1/4 Simple Statement",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p>One consequence of the INF Treaty was that Reagan and Gorbachev agreed to scrap an entire class of nuclear missiles.</p>",
      "verdict": "AO1/AO2 (1 mark). Simple assertion identifying a consequence but lacking supporting historical evidence."
    },
    "tier_2m": {
      "title": "2/4 Partial Explanation",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Partial Explanation)",
      "text": "<p>One consequence was that the INF Treaty in December 1987 banned all intermediate-range nuclear missiles with ranges between 500 and 5,500 km. Over 2,600 missiles were destroyed and mutual inspections began.</p>",
      "verdict": "AO1/AO2 (2 marks). Identifies and describes a valid consequence with basic context, but lacks specific factual detail or developed causal explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One significant consequence of the Intermediate-Range Nuclear Forces (INF) Treaty in December 1987 was the historic elimination of an entire category of nuclear weapons. Signed by Reagan and Gorbachev, the treaty banned all ground-launched ballistic and cruise missiles with ranges of 500 to 5,500 kilometres, destroying 2,692 weapons. Therefore, this was a vital consequence because mutual on-site verification inspections established unprecedented diplomatic trust that effectively ended the nuclear arms race.</p>",
      "verdict": "AO1/AO2 (4 marks). Full marks awarded. Clearly identifies a consequence, provides precise factual evidence, and fully explains the resulting impact."
    }
  },

  "lesson_7_q1": {
    "tier_1m": {
      "title": "1/4 Simple Statement",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p>One consequence of the Berlin Wall was that it stopped East Germans escaping to West Berlin.</p>",
      "verdict": "AO1/AO2 (1 mark). Simple assertion identifying a consequence but lacking supporting historical evidence."
    },
    "tier_2m": {
      "title": "2/4 Partial Explanation",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Partial Explanation)",
      "text": "<p>One consequence was that Khrushchev halted the refugee crisis in August 1961. Over 2.7 million East Germans had fled through Berlin, so the concrete wall physically divided families and stabilized East Germany's workforce.</p>",
      "verdict": "AO1/AO2 (2 marks). Identifies and describes a valid consequence with basic context, but lacks specific factual detail or developed causal explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One significant consequence of the construction of the Berlin Wall in August 1961 was the immediate halt to the East German refugee crisis. Between 1949 and 1961, 2.7 million skilled citizens had escaped through West Berlin, threatening the GDR with economic collapse. The barbed wire and concrete wall sealed the border overnight. Therefore, this had a major consequence because it defused acute military crisis over Berlin while creating a permanent visual symbol of communist oppression.</p>",
      "verdict": "AO1/AO2 (4 marks). Full marks awarded. Clearly identifies a consequence, provides precise factual evidence, and fully explains the resulting impact."
    }
  },

  "lesson_7_q2": {
    "tier_1m": {
      "title": "1/4 Simple Statement",
      "score": "1 / 4 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p>One consequence of the collapse of the Soviet Union was that the Cold War ended and America became the only superpower.</p>",
      "verdict": "AO1/AO2 (1 mark). Simple assertion identifying a consequence but lacking supporting historical evidence."
    },
    "tier_2m": {
      "title": "2/4 Partial Explanation",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top / Level 2 Bottom (Partial Explanation)",
      "text": "<p>One consequence was that on 25 December 1991, Mikhail Gorbachev resigned and the Soviet flag was lowered from the Kremlin. The USSR split into 15 independent nations, including Russia, Ukraine, and the Baltic states.</p>",
      "verdict": "AO1/AO2 (2 marks). Identifies and describes a valid consequence with basic context, but lacks specific factual detail or developed causal explanation."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p>One significant consequence of the dissolution of the Soviet Union in December 1991 was the definitive end of the Cold War and bipolar world order. Following Gorbachev’s resignation on Christmas Day, the USSR fractured into 15 sovereign independent republics, with the Warsaw Pact dissolved. Therefore, this had a momentous consequence because it eliminated America's primary global rival, leaving the United States as the world's sole unchallenged superpower in a unipolar international system.</p>",
      "verdict": "AO1/AO2 (4 marks). Full marks awarded. Clearly identifies a consequence, provides precise factual evidence, and fully explains the resulting impact."
    }
  }
};

module.exports = { cw4m };

