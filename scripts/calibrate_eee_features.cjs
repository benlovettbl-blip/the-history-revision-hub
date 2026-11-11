// scripts/calibrate_eee_features.cjs
// Calibrate all 24 2-mark feature questions in Early Elizabethan England (eee.json)
// Target budget: strictly 25-35 words for tier_2m

const eee2m = {
  "lesson_1_1_q1": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> The Privy Council was a group of noble advisers who advised Queen Elizabeth.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> The Privy Council was a core group of 19 trusted noble advisers led by William Cecil.<br><strong>Detail:</strong> They met daily to manage finance, military defence, and law enforcement.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_1_1_q2": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> Elizabeth inherited huge royal debts when she became queen in 1558.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> Elizabeth inherited a crippling Crown debt of £300,000 from Mary I.<br><strong>Detail:</strong> Much of this was owed to foreign bankers on the Antwerp Exchange at 14% interest.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_1_2_q1": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> The Act of Supremacy made Elizabeth the head of the English Church.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> The Act established Elizabeth as 'Supreme Governor' of the Church of England.<br><strong>Detail:</strong> All clergy and royal officials had to swear an Oath of Supremacy to her.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_1_2_q2": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> The Royal Injunctions ordered all parish churches to follow new Protestant rules.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> The Injunctions were 57 practical instructions issued to enforce religious uniformity.<br><strong>Detail:</strong> Every parish church was ordered to possess an English Bible and clergy wore the surplice.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_1_3_q1": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> Puritans protested against priests wearing Catholic vestments during church services.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> Puritans mounted the 1566 Vestiarian Controversy over traditional clerical dress.<br><strong>Detail:</strong> Thirty-seven London priests were dismissed for refusing to wear the white linen surplice.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_1_3_q2": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> The Pope excommunicated Queen Elizabeth and told Catholics to disobey her.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> Pope Pius V issued the Papal Bull *Regnans in Excelsis* excommunicating Elizabeth in 1570.<br><strong>Detail:</strong> It released English Catholics from their allegiance and urged her overthrow.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_1_4_q1": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> Mary, Queen of Scots had a legitimate hereditary claim to the English crown.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> Mary was Henry VII’s great-granddaughter through his eldest daughter Margaret Tudor.<br><strong>Detail:</strong> English Catholics viewed her as the legitimate rightful heir because Elizabeth was born illegitimate.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_1_4_q2": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> Elizabeth held an official inquiry to investigate Mary's role in Darnley's murder.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> Elizabeth conducted an official inquiry at York using the controversial Casket Letters.<br><strong>Detail:</strong> The inquiry gave a 'not proven' verdict, allowing Elizabeth to keep Mary under house arrest.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_2_1_q1": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> Northern Catholic earls launched an armed rebellion against Queen Elizabeth in 1569.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> The Earls of Northumberland and Westmorland led 4,600 Catholic rebels in November 1569.<br><strong>Detail:</strong> They seized Durham Cathedral, restored the Latin Mass, and aimed to free Mary Stuart.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_2_1_q2": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> Anthony Babington plotted to kill Elizabeth and put Mary on the throne.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> Anthony Babington smuggled coded letters hidden inside beer barrels to Mary in 1586.<br><strong>Detail:</strong> Francis Walsingham intercepted and decoded the letters, proving Mary approved Elizabeth’s assassination.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_2_2_q1": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> English privateers attacked Spanish treasure ships and ports in the Americas.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> English captains operated under royal letters of marque to raid Spanish Atlantic shipping.<br><strong>Detail:</strong> In 1579, Drake captured the galleon *Cacafuego*, seizing £400,000 of silver with Elizabeth taking half.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_2_2_q2": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> Francis Drake sailed into the Pacific Ocean to plunder Spanish colonies.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> Drake conducted surprise privateering raids along South America's unfortified Pacific coastline.<br><strong>Detail:</strong> In 1579, he captured 26 tons of silver from Spanish galleons aboard the *Golden Hind*.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_2_3_q1": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> The Treaty of Nonsuch sent an English army to help Dutch Protestant rebels.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> Signed in August 1585, England sent 7,300 soldiers under Robert Dudley to aid Dutch rebels.<br><strong>Detail:</strong> England received the cautionary ports of Brill and Flushing as security for costs.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_2_3_q2": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> Robert Dudley commanded the English military campaign in the Netherlands.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> Dudley provoked Elizabeth by accepting the title 'Governor-General of the United Provinces'.<br><strong>Detail:</strong> His campaign struggled with unpaid troops and commanders betraying Zutphen to Spain.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_2_4_q1": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> The Spanish Armada planned to join with Parma's army to invade England.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> Medina Sidonia’s fleet of 130 ships sailed to escort Parma’s 27,000 veteran soldiers.<br><strong>Detail:</strong> Parma’s troops were to cross the Channel on flat-bottomed barges to invade Kent.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_2_4_q2": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> The English sent fireships into the Spanish fleet anchored at Calais.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> The English dispatched eight pitch-soaked fireships into the anchored Armada on 7 August 1588.<br><strong>Detail:</strong> This panicked Spanish captains into cutting anchors, shattering their protective crescent formation.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_3_1_q1": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> Grammar schools taught Latin and classical literature to middle-class boys.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> Grammar schools were fee-paying secondary institutions for sons of gentry and wealthy merchants.<br><strong>Detail:</strong> Boys aged 7 to 14 endured ten-hour school days focusing on Latin, Greek, and rhetoric.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_3_1_q2": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> Elizabethan theatres were large open-air playhouses built outside London.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> Purpose-built playhouses like The Globe were circular open-air amphitheatres holding up to 3,000 spectators.<br><strong>Detail:</strong> Poorer 'groundlings' paid 1d to stand in the yard, while wealthy nobles paid 6d for covered galleries.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_3_2_q1": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> The 1572 Vagabonds Act punished beggars and introduced a poor rate.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> The Act introduced harsh corporal punishments, including whipping and burning ear gristle for vagrants.<br><strong>Detail:</strong> Crucially, it established a compulsory local poor rate to support the elderly and sick impotent poor.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_3_2_q2": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> The 1576 Poor Act provided raw materials so the poor could work.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> Justices of the Peace had to supply wool and flax so the able-bodied poor could work.<br><strong>Detail:</strong> It also mandated building Houses of Correction (Bridewells) to punish those refusing to work.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_3_3_q1": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> Navigators used the astrolabe to calculate latitude at sea.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> Navigators adopted precision astrolabes and quadrants to calculate exact latitude from the sun.<br><strong>Detail:</strong> The 1569 Mercator map projection enabled sailors to navigate straight compass courses across oceans.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_3_3_q2": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> Francis Drake was the first Englishman to sail completely around the world.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> Drake circumnavigated the globe between 1577 and 1580 aboard his flagship, the *Golden Hind*.<br><strong>Detail:</strong> He returned with £400,000 of plundered Spanish silver, earning a royal knighthood from Elizabeth.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_3_4_q1": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> Walter Raleigh planned to colonise Roanoke Island in Virginia.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> Raleigh obtained a royal patent in 1584 to colonise Roanoke to grow tobacco and sugar.<br><strong>Detail:</strong> The settlement was also planned as a naval privateering base to raid Spanish treasure ships.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  },

  "lesson_3_4_q2": {
    "tier_1m": {
      "title": "1/2 Simple Statement",
      "score": "1 / 2 Marks",
      "level": "Level 1 (Simple Statement)",
      "text": "<p><strong>Feature:</strong> The 1585 Roanoke colony failed because settlers ran out of food supplies.</p>",
      "verdict": "AO1 (1 mark). Identifies a valid feature but lacks supporting historical detail."
    },
    "tier_2m": {
      "title": "2/2 Grade 9 Exam ★",
      "score": "2 / 2 Marks",
      "level": "Level 1 Top (Supported Feature)",
      "badge": "Edexcel Benchmark",
      "text": "<p><strong>Feature:</strong> The flagship *Tiger* ran aground on arrival, ruining almost all seed corn and provisions.<br><strong>Detail:</strong> Hostile clashes with the local Secotan tribe forced colonists to evacuate aboard Drake’s fleet in 1586.</p>",
      "verdict": "AO1 (2 marks). Full marks awarded. Feature accurately identified and supported by specific factual detail."
    }
  }
};

module.exports = { eee2m };

