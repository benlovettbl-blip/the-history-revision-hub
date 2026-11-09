// scripts/calibrate_paper3_4m.cjs
// Calibrates all 32 4-mark inference questions across USA (16) and Germany (16)
// Target word budget:
// - tier_4m: strictly 50-65 words (Grade 9 Exam ★)
// - tier_2m: strictly 20-30 words (One Supported Inference, clean)
// - tier_1m: strictly 10-15 words (Simple Assertion)

const usa4m = {
  "lesson_1_1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that racial segregation was strictly enforced on public transport in the South.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from Source A."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Public transport was legally segregated by race.<br><strong>Details in the source that tell me this:</strong><br>'equal but separate accommodations for the white and colored races'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from Source A, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Public transport was strictly segregated by law.<br><strong>Details in the source that tell me this:</strong><br>'equal but separate accommodations for the white and colored races'.</p><p><strong>(ii) What I can infer:</strong><br>Mixing between racial groups was strictly prohibited.<br><strong>Details in the source that tell me this:</strong><br>'separate cars and partitioned compartments'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
    }
  },

  "lesson_1_2": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that Black students faced angry white crowds when entering desegregated schools.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from Source A."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Black pupils faced intense hostility and threats from white mobs.<br><strong>Details in the source that tell me this:</strong><br>'angry mobs shouting threats and spitting at students'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from Source A, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Black pupils faced intense hostility and threats from white crowds.<br><strong>Details in the source that tell me this:</strong><br>'angry mobs shouting threats and spitting at students'.</p><p><strong>(ii) What I can infer:</strong><br>State authorities deployed armed soldiers to block integration.<br><strong>Details in the source that tell me this:</strong><br>'National Guard troops were deployed by the governor to bar entry'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
    }
  },

  "lesson_1_3": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that Black citizens in Montgomery were determined to boycott buses.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from Source A."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Black citizens showed immense endurance to sustain the boycott.<br><strong>Details in the source that tell me this:</strong><br>'Thousands walked miles to work daily through rain and heat'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from Source A, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Black citizens showed immense collective endurance and unity.<br><strong>Details in the source that tell me this:</strong><br>'Thousands walked miles to work daily through rain and heat'.</p><p><strong>(ii) What I can infer:</strong><br>Local authorities used police harassment to disrupt the protest.<br><strong>Details in the source that tell me this:</strong><br>'Police repeatedly arrested carpool drivers for minor offenses'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
    }
  },

  "lesson_1_4": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that Black people suffered extreme racial violence in Mississippi.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from Source A."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Racial violence against Black Americans was brutal and unpunished.<br><strong>Details in the source that tell me this:</strong><br>'brutally abducted and murdered after allegedly whistling at a white woman'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from Source A, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Racial violence against Black Americans was brutal and unprovoked.<br><strong>Details in the source that tell me this:</strong><br>'brutally abducted and murdered after allegedly whistling at a white woman'.</p><p><strong>(ii) What I can infer:</strong><br>The Southern judicial system protected white murderers.<br><strong>Details in the source that tell me this:</strong><br>'An all-white jury acquitted the confessed murderers after barely an hour'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
    }
  },

  "lesson_2_1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that lunch counter sit-in demonstrators stayed calm and peaceful.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from Source A."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Demonstrators were disciplined in non-violent resistance.<br><strong>Details in the source that tell me this:</strong><br>'Students remained seated upright, reading quietly without retaliating'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from Source A, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Demonstrators maintained disciplined non-violent restraint.<br><strong>Details in the source that tell me this:</strong><br>'Students remained seated upright, reading quietly without retaliating'.</p><p><strong>(ii) What I can infer:</strong><br>White segregationists used physical humiliation to provoke violence.<br><strong>Details in the source that tell me this:</strong><br>'pouring hot coffee and smearing condiments over demonstrators'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
    }
  },

  "lesson_2_2": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that the March on Washington was huge and brought many people together.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from Source A."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>The march demonstrated massive, peaceful multiracial solidarity.<br><strong>Details in the source that tell me this:</strong><br>'a quarter of a million Black and white citizens gathered peacefully'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from Source A, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>The march demonstrated massive multiracial solidarity.<br><strong>Details in the source that tell me this:</strong><br>'a quarter of a million Black and white citizens gathered peacefully'.</p><p><strong>(ii) What I can infer:</strong><br>Civil rights leaders demanded economic justice alongside legal equality.<br><strong>Details in the source that tell me this:</strong><br>'Banners and speeches prominently demanded Jobs and Freedom'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
    }
  },

  "lesson_2_3": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that Black Olympic athletes protested against American racism.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from Source A."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Athletes used global sporting events to protest racial injustice.<br><strong>Details in the source that tell me this:</strong><br>'bowed their heads and raised gloved fists during the national anthem'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from Source A, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Athletes used global stages to protest domestic racism.<br><strong>Details in the source that tell me this:</strong><br>'bowed their heads and raised gloved fists during the anthem'.</p><p><strong>(ii) What I can infer:</strong><br>The protest highlighted Black poverty and victims of lynchings.<br><strong>Details in the source that tell me this:</strong><br>'wore black socks with no shoes to represent Black poverty'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
    }
  },

  "lesson_2_4": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that Black residents in Watts were furious about their living conditions.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from Source A."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Residents viewed the riots as a rebellion against economic exclusion.<br><strong>Details in the source that tell me this:</strong><br>'a rebellion against being shut out of America'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from Source A, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Residents viewed the riots as a rebellion against economic exclusion.<br><strong>Details in the source that tell me this:</strong><br>'a rebellion against being shut out of America'.</p><p><strong>(ii) What I can infer:</strong><br>Violence targeted commercial businesses exploiting the Black community.<br><strong>Details in the source that tell me this:</strong><br>'burned the property of white merchants who exploited us'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
    }
  },

  "lesson_3_1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that American soldiers faced invisible enemies and snipers in Vietnam.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from Source A."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>US patrols were vulnerable to unseen guerrilla ambushes in the jungle.<br><strong>Details in the source that tell me this:</strong><br>'patrols were ambushed by unseen snipers from concealed tunnels'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from Source A, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>US patrols faced invisible guerrilla snipers in dense jungle.<br><strong>Details in the source that tell me this:</strong><br>'patrols were ambushed by unseen snipers from concealed tunnels'.</p><p><strong>(ii) What I can infer:</strong><br>Search-and-destroy tactics displaced local peasant villagers.<br><strong>Details in the source that tell me this:</strong><br>'burning thatched huts and driving terrified peasant families into camps'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
    }
  },

  "lesson_3_2": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that the Tet Offensive shocked the American government.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from Source A."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>The Vietcong launched massive coordinated attacks in cities.<br><strong>Details in the source that tell me this:</strong><br>'assault teams struck over one hundred urban centres including the US Embassy'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from Source A, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>The Vietcong launched simultaneous attacks across urban areas.<br><strong>Details in the source that tell me this:</strong><br>'assault teams struck over one hundred urban centres including the US Embassy'.</p><p><strong>(ii) What I can infer:</strong><br>The assault undermined official claims of imminent victory.<br><strong>Details in the source that tell me this:</strong><br>'contradicted military briefings claiming the war was nearly won'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
    }
  },

  "lesson_3_3": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that Vietcong traps were cheap and dangerous for US soldiers.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from Source A."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Guerrilla booby traps were designed to injure soldiers to halt patrols.<br><strong>Details in the source that tell me this:</strong><br>'constructed to maim rather than kill, halting patrol movements'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from Source A, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Guerrilla traps aimed to maim soldiers rather than kill.<br><strong>Details in the source that tell me this:</strong><br>'constructed to maim rather than kill, halting patrol movements'.</p><p><strong>(ii) What I can infer:</strong><br>The Vietcong recycled discarded American weaponry to build traps.<br><strong>Details in the source that tell me this:</strong><br>'built from bamboo, tripwires, and unexploded American ordnance'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
    }
  },

  "lesson_3_4": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that the Kent State shootings caused huge student outrage.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from Source A."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>The confrontation between Guardsmen and student demonstrators proved fatal.<br><strong>Details in the source that tell me this:</strong><br>'National Guardsmen opened fire, killing four student demonstrators'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from Source A, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Military force was turned fatally upon unarmed students.<br><strong>Details in the source that tell me this:</strong><br>'National Guardsmen opened fire, killing four student demonstrators'.</p><p><strong>(ii) What I can infer:</strong><br>The killings triggered nationwide shutdowns of higher education.<br><strong>Details in the source that tell me this:</strong><br>'hundreds of universities closed as four million students went on strike'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
    }
  },

  "lesson_4_1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that the Watergate burglars had spying equipment to bug phones.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from Source A."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>The break-in involved professional espionage and electronic wiretapping.<br><strong>Details in the source that tell me this:</strong><br>'arrested with wiretapping devices, cameras, and bugging equipment'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from Source A, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>The burglars used sophisticated electronic surveillance equipment.<br><strong>Details in the source that tell me this:</strong><br>'arrested with wiretapping devices, cameras, and bugging equipment'.</p><p><strong>(ii) What I can infer:</strong><br>The intruders had direct links to the presidential administration.<br><strong>Details in the source that tell me this:</strong><br>'address books carried the telephone number of the White House'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
    }
  },

  "lesson_4_2": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that White House officials covered up the Watergate break-in.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from Source A."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Senior officials paid large sums of hush money to the burglars.<br><strong>Details in the source that tell me this:</strong><br>'John Dean testified that over 400,000 dollars was paid to buy silence'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from Source A, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>White House officials paid huge sums to buy the burglars' silence.<br><strong>Details in the source that tell me this:</strong><br>'John Dean testified that over 400,000 dollars was paid to buy silence'.</p><p><strong>(ii) What I can infer:</strong><br>Nixon secretly recorded all Oval Office meetings.<br><strong>Details in the source that tell me this:</strong><br>'Alexander Butterfield revealed all conversations were secretly recorded'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
    }
  },

  "lesson_4_3": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that the audio tape proved President Nixon broke the law.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from Source A."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Nixon personally ordered government agencies to halt the investigation.<br><strong>Details in the source that tell me this:</strong><br>'ordered Haldeman to tell the CIA to obstruct the FBI enquiry'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from Source A, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Nixon personally ordered the cover-up to obstruct justice.<br><strong>Details in the source that tell me this:</strong><br>'ordered Haldeman to tell the CIA to obstruct the FBI enquiry'.</p><p><strong>(ii) What I can infer:</strong><br>Congressional Republicans withdrew their political defence of Nixon.<br><strong>Details in the source that tell me this:</strong><br>'party leaders warned him that impeachment and conviction were certain'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
    }
  },

  "lesson_4_4": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that President Nixon resigned because Congress no longer supported him.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from Source A."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Nixon lost the political backing required to survive in office.<br><strong>Details in the source that tell me this:</strong><br>'I no longer have a strong enough political base in Congress'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from Source A, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Nixon lost congressional support needed to remain in office.<br><strong>Details in the source that tell me this:</strong><br>'no longer have a strong enough political base in Congress'.</p><p><strong>(ii) What I can infer:</strong><br>Nixon claimed resignation was needed to heal the country.<br><strong>Details in the source that tell me this:</strong><br>'healing process requires that the nation put this tragedy behind it'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from Source A."
    }
  }
};

const ger4m = {
  "lesson_1_1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that German civilians suffered from terrible starvation in November 1918.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from the source."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Civilians were suffering from extreme starvation and exhaustion.<br><strong>Details in the source that tell me this:</strong><br>'silent, emaciated crowds' with faces 'yellow from starvation'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from the source, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>German civilians suffered from severe malnutrition and starvation.<br><strong>Details in the source that tell me this:</strong><br>'silent, emaciated crowds' with faces 'yellow from starvation'.</p><p><strong>(ii) What I can infer:</strong><br>Government authority had completely collapsed into revolution.<br><strong>Details in the source that tell me this:</strong><br>'red flags hang from government windows while soldiers sit begging'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
    }
  },

  "lesson_1_2": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that Germans hated the Treaty of Versailles and war guilt.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from the source."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Germany refused to accept sole responsibility for the war.<br><strong>Details in the source that tell me this:</strong><br>'confessions of guilt on our lips would be a lie'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from the source, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Germany rejected sole moral responsibility for the war.<br><strong>Details in the source that tell me this:</strong><br>'confessions of guilt on our lips would be a lie'.</p><p><strong>(ii) What I can infer:</strong><br>Germans viewed the Allied naval blockade as an atrocity.<br><strong>Details in the source that tell me this:</strong><br>'hundreds of thousands of non-combatants perished through the blockade'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
    }
  },

  "lesson_1_3": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that money became completely worthless during hyperinflation in 1923.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from the source."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Paper currency lost all practical purchasing power.<br><strong>Details in the source that tell me this:</strong><br>'carried cash in laundry baskets to buy a single loaf of bread'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from the source, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Paper currency lost all practical purchasing power.<br><strong>Details in the source that tell me this:</strong><br>'carried cash in laundry baskets to buy a single loaf of bread'.</p><p><strong>(ii) What I can infer:</strong><br>Middle-class families had their lifetime savings wiped out.<br><strong>Details in the source that tell me this:</strong><br>'savings accumulated over decades were destroyed in a matter of hours'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
    }
  },

  "lesson_1_4": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that young women enjoyed more social freedom in Weimar Germany.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from the source."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Young women gained economic independence through office employment.<br><strong>Details in the source that tell me this:</strong><br>'earned independent wages as typists and crowded cinemas unchaperoned'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from the source, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Young women gained financial independence in white-collar jobs.<br><strong>Details in the source that tell me this:</strong><br>'earned independent wages as typists and crowded cinemas unchaperoned'.</p><p><strong>(ii) What I can infer:</strong><br>Women embraced modern fashions, rejecting traditional Victorian attire.<br><strong>Details in the source that tell me this:</strong><br>'wearing practical short-bobbed hair and simple modern dresses'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
    }
  },

  "lesson_2_1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that Hitler tried to seize power by force in the Munich Putsch.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from the source."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Hitler attempted an armed overthrow of the government.<br><strong>Details in the source that tell me this:</strong><br>'Hitler fired a pistol into the ceiling, declaring a national revolution'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from the source, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Hitler attempted an armed overthrow of the government.<br><strong>Details in the source that tell me this:</strong><br>'Hitler fired a pistol into the ceiling, declaring a national revolution'.</p><p><strong>(ii) What I can infer:</strong><br>State authorities resisted the Putsch with lethal armed force.<br><strong>Details in the source that tell me this:</strong><br>'state police opened fire on the marching stormtroopers'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
    }
  },

  "lesson_2_2": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that the Nazis appealed to millions of unemployed German workers.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from the source."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Nazi propaganda focused directly on economic hardship and starvation.<br><strong>Details in the source that tell me this:</strong><br>'election posters promised Work and Bread to millions of unemployed'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from the source, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Nazi propaganda promised economic relief to unemployed voters.<br><strong>Details in the source that tell me this:</strong><br>'election posters promised Work and Bread to millions of unemployed'.</p><p><strong>(ii) What I can infer:</strong><br>Hitler used air travel to project dynamic nationwide leadership.<br><strong>Details in the source that tell me this:</strong><br>'flew by aeroplane to speak at four mass rallies in a day'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
    }
  },

  "lesson_2_3": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that the March 1933 election was marked by Nazi violence.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from the source."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>The SA physically intimidated voters at polling stations.<br><strong>Details in the source that tell me this:</strong><br>'armed stormtroopers stood over ballot boxes inspecting voting slips'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from the source, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>The SA physically intimidated citizens at polling booths.<br><strong>Details in the source that tell me this:</strong><br>'armed stormtroopers stood over ballot boxes inspecting voting slips'.</p><p><strong>(ii) What I can infer:</strong><br>Opposition parties were systematically suppressed before voting began.<br><strong>Details in the source that tell me this:</strong><br>'communist candidates were arrested and socialist newspapers banned'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
    }
  },

  "lesson_2_4": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that the Reichstag Fire Decree abolished freedom of speech.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from the source."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>The government suspended constitutional civil liberties after the fire.<br><strong>Details in the source that tell me this:</strong><br>'suspended rights of free speech, assembly, and privacy of letters'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from the source, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>The decree abolished fundamental constitutional civil rights.<br><strong>Details in the source that tell me this:</strong><br>'suspended rights of free speech, assembly, and privacy of letters'.</p><p><strong>(ii) What I can infer:</strong><br>The state targeted communist leaders with arbitrary imprisonment.<br><strong>Details in the source that tell me this:</strong><br>'police arrested over four thousand communist officials without trial'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
    }
  },

  "lesson_3_1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that people lived in fear of being reported to the Gestapo.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from the source."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Germans feared speaking openly due to civilian denunciations.<br><strong>Details in the source that tell me this:</strong><br>'people lowered their voices in public, fearing denunciations by neighbours'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from the source, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Germans feared speaking openly due to private informers.<br><strong>Details in the source that tell me this:</strong><br>'people lowered their voices in public, fearing denunciations by neighbours'.</p><p><strong>(ii) What I can infer:</strong><br>The Gestapo relied heavily on voluntary tip-offs from ordinary citizens.<br><strong>Details in the source that tell me this:</strong><br>'most investigations began from letters written by private citizens'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
    }
  },

  "lesson_3_2": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that concentration camps were harsh places run by the SS.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from the source."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Inmates were imprisoned indefinitely without any legal trial.<br><strong>Details in the source that tell me this:</strong><br>'held under protective custody with no judicial review or release date'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from the source, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Prisoners were detained indefinitely without trial or judicial oversight.<br><strong>Details in the source that tell me this:</strong><br>'held under protective custody with no judicial review or release date'.</p><p><strong>(ii) What I can infer:</strong><br>Guards subjected inmates to brutal physical violence and labour.<br><strong>Details in the source that tell me this:</strong><br>'inmates endured forced labour, severe beatings, and malnutrition'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
    }
  },

  "lesson_3_3": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that radio broadcasts were used by Goebbels for propaganda.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from the source."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>The state designed cheap radios to reach every German household.<br><strong>Details in the source that tell me this:</strong><br>'subsidised People's Receivers that could only receive German stations'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from the source, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>The regime engineered cheap radios restricted to Nazi broadcasts.<br><strong>Details in the source that tell me this:</strong><br>'subsidised People's Receivers that could only receive German stations'.</p><p><strong>(ii) What I can infer:</strong><br>The Propaganda Ministry exercised total censorship over daily media.<br><strong>Details in the source that tell me this:</strong><br>'daily directive sheets dictated what music, speeches, and news could air'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
    }
  },

  "lesson_3_4": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that the Edelweiss Pirates refused to join the Hitler Youth.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from the source."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Youths expressed defiance through non-conformist clothing and symbols.<br><strong>Details in the source that tell me this:</strong><br>'refused to attend drills, wearing checked shirts and flower badges'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from the source, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Youths defied state regimentation through forbidden clothing.<br><strong>Details in the source that tell me this:</strong><br>'refused to attend drills, wearing checked shirts and flower badges'.</p><p><strong>(ii) What I can infer:</strong><br>Pirate groups engaged in direct attacks on Hitler Youth.<br><strong>Details in the source that tell me this:</strong><br>'ambushed Hitler Youth patrols and painted anti-Nazi slogans'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
    }
  },

  "lesson_4_1": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that the Nazi state wanted women to have as many babies as possible.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from the source."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Motherhood was glorified as an ideological duty equal to military service.<br><strong>Details in the source that tell me this:</strong><br>'described German mothers as soldiers fighting the battle for births'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from the source, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Motherhood was treated as military service on the home front.<br><strong>Details in the source that tell me this:</strong><br>'described German mothers as soldiers fighting the battle for births'.</p><p><strong>(ii) What I can infer:</strong><br>The regime rewarded high birth rates with national honours.<br><strong>Details in the source that tell me this:</strong><br>'gold medals awarded to mothers of eight or more children'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
    }
  },

  "lesson_4_2": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that Hitler Youth training prepared boys to be soldiers.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from the source."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Youth drills prioritised combat skills over academic education.<br><strong>Details in the source that tell me this:</strong><br>'drills focused on route marches, grenade throwing, and rifle practice'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from the source, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Youth drills prioritised combat skills over academic schooling.<br><strong>Details in the source that tell me this:</strong><br>'drills focused on route marches, grenade throwing, and rifle practice'.</p><p><strong>(ii) What I can infer:</strong><br>Boys were conditioned for uncomplaining endurance in battle.<br><strong>Details in the source that tell me this:</strong><br>'trained to suffer privation without complaint to become hard as steel'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
    }
  },

  "lesson_4_3": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that workers lost their rights under the German Labour Front.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from the source."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>Trade union rights were abolished, leaving workers unable to strike.<br><strong>Details in the source that tell me this:</strong><br>'trade unions were abolished and strikes banned under penalty of arrest'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from the source, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>Workers lost the legal right to strike or negotiate wages.<br><strong>Details in the source that tell me this:</strong><br>'trade unions were abolished and strikes banned under penalty of arrest'.</p><p><strong>(ii) What I can infer:</strong><br>The regime used subsidized trips to quell worker discontent.<br><strong>Details in the source that tell me this:</strong><br>'Strength Through Joy organised subsidised holidays, trips, and sports'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
    }
  },

  "lesson_4_4": {
    "tier_1m": {
      "title": "1/4 Assertion",
      "score": "1 / 4 Marks",
      "level": "Level 1 Bottom (Assertion)",
      "text": "<p>I can infer that Kristallnacht caused widespread destruction of Jewish property.</p>",
      "verdict": "AO3 (1 mark). Simple valid inference made, but completely unsupported by textual quotation from the source."
    },
    "tier_2m": {
      "title": "2/4 Partial / Quote Trap",
      "score": "2 / 4 Marks",
      "level": "Level 1 Top (Supported Statement)",
      "text": "<p><strong>(i) What I can infer:</strong><br>The pogrom caused catastrophic destruction of Jewish shops and temples.<br><strong>Details in the source that tell me this:</strong><br>'shattered glass covered pavements while ancient synagogues burned'.</p>",
      "verdict": "AO3 (2 marks). One valid inference supported by direct quotation from the source, but a second inference is missing."
    },
    "tier_4m": {
      "title": "4/4 Grade 9 Exam ★",
      "score": "4 / 4 Marks",
      "level": "Level 2 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>(i) What I can infer:</strong><br>The pogrom caused catastrophic destruction of Jewish property.<br><strong>Details in the source that tell me this:</strong><br>'shattered glass covered pavements while ancient synagogues burned'.</p><p><strong>(ii) What I can infer:</strong><br>Emergency services actively colluded by protecting only German buildings.<br><strong>Details in the source that tell me this:</strong><br>'fire brigades stood by merely protecting adjacent German buildings'.</p>",
      "verdict": "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
    }
  }
};

module.exports = { usa4m, ger4m };
