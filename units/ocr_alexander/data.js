export default {
  id: 'ocr_alexander',
  title: 'OCR Paper 1: Alexander the Great, 356–323 BC',
  subtitle: 'OCR GCSE (9–1) Ancient History • J198/01 Section D (Greek Depth Study)',
  enquiry:
    'Visionary king, son of Zeus Ammon, or ruthless conqueror — how far do our prescribed ancient sources agree on Alexander the Great?',
  enquiry_question:
    'Visionary king, son of Zeus Ammon, or ruthless conqueror — how far do our prescribed ancient sources agree on Alexander the Great?',
  period: '356–323 BC',
  edition: 'OCR GCSE Ancient History (J198/01 Section D)',
  category: 'GCSE',
  keyStage: 'GCSE',
  key_stage: 'GCSE',
  yearGroup: 'GCSE (9–1)',
  year_group: 'GCSE (9–1)',
  exam_board: 'OCR_J198',
  is_ocr_depth_study: true,
  paper_code: 'J198/01 Section D',
  specification_file: '/data/specifications/ocr_j198_alexander.json',
  desc: 'OCR J198/01 (Section D)',
  icon: 'fa-helmet-safety',
  color: '#b45309',
  bg: 'rgba(180, 83, 9, 0.1)',
  cover_image: '/images/ocr_ancient/alexander_cover_mosaic.jpg',
  cover_caption:
    'Prescribed Archaeological Set Source: Floor mosaic from the House of the Faun at Pompeii (c. 100 BC, Museo Archeologico Nazionale di Napoli) depicting Alexander charging King Darius III.',
  homepage_background: '/images/ocr_ancient/alexander_cover_mosaic.jpg',
  groupings: [
    {
      prefix: 'KT1',
      name: 'Key Topic 1: Upbringing, Character, Beliefs and Succession, 356–334 BC',
      color: '#92400e',
      bg: '#fffbeb',
      border: '#f59e0b',
      icon: 'fa-bolt',
    },
    {
      prefix: 'KT2',
      name: 'Key Topic 2: Conquering Asia Minor, Egypt and Darius III, 334–330 BC',
      color: '#991b1b',
      bg: '#fef2f2',
      border: '#ef4444',
      icon: 'fa-shield-halved',
    },
    {
      prefix: 'KT3',
      name: 'Key Topic 3: Persian Court Dress, Plots and Mutiny in the East, 330–325 BC',
      color: '#3730a3',
      bg: '#eef2ff',
      border: '#6366f1',
      icon: 'fa-scale-unbalanced',
    },
    {
      prefix: 'KT4',
      name: 'Key Topic 4: Return to Babylon, Susa Weddings, Death and Legacy, 325–323 BC',
      color: '#115e59',
      bg: '#f0fdfa',
      border: '#14b8a6',
      icon: 'fa-scroll',
    },
  ],
  ancient_authors: [
    {
      id: 'plutarch_alex',
      name: 'Plutarch of Chaeronea',
      dates: 'c. AD 46–c. 120',
      time_gap: 'Wrote ~430 years after Alexander’s death',
      genre: 'Moral Biography (Parallel Lives: Alexander & Julius Caesar)',
      language: 'Koine Greek (Roman Imperial Greece)',
      strengths:
        'Consulted over twenty lost Hellenistic writers, royal letters, Aristobulus, Chares, and Callisthenes; preserves vivid character scenes from Alexander’s youth (Bucephalas, Attalus brawl) found nowhere else.',
      limitations:
        'Explicitly states in Chapter 1 that he writes "Lives, not Histories"—selecting dramatic omens, jokes, and domestic quarrels to teach moral lessons about ambition, self-control, and anger.',
      examiner_trap_warning:
        'Examiner Report Warning: NEVER write "Plutarch wasn’t born yet so it’s unreliable" or "he wanted a bestseller". Explain that as a 2nd-century AD moral biographer he shaped lost 4th-century BC court anecdotes to foreshadow Alexander’s adult virtues and temper.',
    },
    {
      id: 'arrian_alex',
      name: 'Arrian of Nicomedia',
      dates: 'c. AD 86–c. 160',
      time_gap: 'Wrote ~460 years after Alexander’s death',
      genre: 'Military & Campaign History (Anabasis / Campaigns of Alexander)',
      language: 'Atticizing Greek (Roman Senator & Military Commander)',
      strengths:
        'Experienced Roman provincial governor and general who grounded his narrative explicitly in two eyewitness campaign companions: King Ptolemy I and the engineer Aristobulus.',
      limitations:
        'Admired Alexander’s military genius and depended heavily on Ptolemy’s memoirs, which glorified Ptolemy’s own battlefield role and softened royal crimes.',
      examiner_trap_warning:
        'Always name Arrian’s two primary eyewitness sources—Ptolemy and Aristobulus—when explaining why his battle tactics (Granicus, Issus, Gaugamela) carry strong military credibility despite the 460-year time gap.',
    },
    {
      id: 'diodorus_alex',
      name: 'Diodorus Siculus',
      dates: 'c. 90–c. 30 BC',
      time_gap: 'Wrote ~270 years after Alexander’s death',
      genre: 'Universal History (Library of History, Books 16–17)',
      language: 'Greek (Late Roman Republic)',
      strengths:
        'Our earliest surviving continuous literary account of Philip II’s assassination at Aegae (16.91–94), drawing on Cleitarchus and Diyllus.',
      limitations:
        'Follows the sensationalist "Vulgate" tradition, loving theatrical spectacle, divine irony (Philip’s 13th statue), and court scandal.',
      examiner_trap_warning:
        'Use Diodorus 16.91–94 alongside Plutarch 9 to compare Pausanias’ personal grievance against Attalus with wider political suspicions around Olympias and Alexander.',
    },
    {
      id: 'hellenistic_coinage',
      name: 'Successor Royal Coinage (Lysimachus & Ptolemy I)',
      dates: 'c. 305–281 BC',
      time_gap: 'Minted 18–40 years after Alexander’s death by his own bodyguards/generals',
      genre: 'Official Hellenistic Silver Tetradrachms (Prescribed Archaeological Sources)',
      language: 'Greek legends & divine iconography',
      strengths:
        'Near-contemporary state objects minted by generals who knew Alexander personally, proving how divine imagery (ram’s horn of Zeus Ammon; elephant-scalp headdress) legitimised Successor kingship.',
      limitations:
        'Idealised posthumous royal propaganda—designed to transfer Alexander’s godlike charisma onto Lysimachus in Thrace/Asia Minor and Ptolemy in Egypt, not show realistic warts-and-all portraits.',
      examiner_trap_warning:
        '2025 Examiner Report Trap: NEVER confuse the ram’s horn of Zeus Ammon on Lysimachus’ coin with the Egyptian god Ptah, and NEVER claim the Alexander Sarcophagus held Alexander’s body (it belonged to King Abdalonymus of Sidon!).',
    },
  ],
  essay_source_trios: [
    {
      theme: 'Upbringing, Character & Relationship with Olympias and Philip II',
      sources: [
        'Plutarch, Life of Alexander 2–3 (Thunderbolt/snake birth omens, Achilles/Heracles lineage & Olympias’ Dionysian rites)',
        'Plutarch, Life of Alexander 6–9 (Taming Bucephalas via shadow + violent 337 BC wedding-feast brawl with Attalus & Philip)',
        'Silver Tetradrachm of Lysimachus, BM 1919,0820.1 (Deified Alexander wearing royal diadem + ram’s horn of Zeus Ammon)',
      ],
    },
    {
      theme: 'Military Genius, Heroic Leadership & Persian Battles',
      sources: [
        'Arrian, Campaigns of Alexander 1.14–16 (Granicus river charge, Cleitus the Black saving Alexander’s life)',
        'Plutarch, Life of Alexander 31–33 & Babylonian Astronomical Diary (Gaugamela tactics & Darius’ flight)',
        'House of the Faun Pompeii Mosaic + Sidon Alexander Sarcophagus (Visualizing Alexander’s personal frontline charge)',
      ],
    },
    {
      theme: 'Divine Kingship, Orientalism & Deteriorating Macedonian Relations',
      sources: [
        'Arrian, Campaigns 4.8–12 & Plutarch 50–51 (Murder of Cleitus at Maracanda & Callisthenes’ refusal of proskynesis)',
        'Arrian, Campaigns 7.4 (Susa mass weddings) & 7.24–30 (Death in Babylon & final character verdict)',
        'Silver Tetradrachms of Lysimachus (Zeus Ammon horn) & Ptolemy I (Elephant-scalp headdress)',
      ],
    },
  ],
  key_individuals: [
    {
      id: 'alexander_iii',
      name: 'Alexander III of Macedon ("Alexander the Great")',
      role: 'King of Macedon, Hegemon of Greece, Pharaoh of Egypt & King of Asia (r. 336–323 BC)',
      lifespan: '356–323 BC',
      entity_type: 'person',
      image: '/images/ocr_ancient/alexander_lysimachus_tetradrachm.jpg',
      achievements: [
        'Born at Pella in July 356 BC to Philip II and Olympias; tutored by Aristotle at Mieza, tamed Bucephalas, and led the decisive cavalry charge at Chaeronea (338 BC) aged eighteen.',
        'Overthrew Darius III’s Persian Empire across Granicus (334 BC), Issus (333 BC), Tyre (332 BC), Egypt/Siwah, and Gaugamela (331 BC), marching as far east as the River Hyphasis in India.',
        'Died in Babylon in June 323 BC aged thirty-two, leaving an empire stretching from Greece to the Indus that reshaped the Mediterranean world.',
      ],
      significance:
        'Combined Homeric personal bravery and brilliant combined-arms tactics with volatile pride, heavy drinking, and divine claims as son of Zeus Ammon that alienated veteran Macedonians.',
      exam_distinction:
        'On 20-mark Depth essays (Q20*), half your marks (10/20) come from AO3 evaluation of Prescribed Set Sources—always pair Plutarch/Arrian quotes with visual evidence like the Lysimachus coin or Pompeii mosaic.',
    },
    {
      id: 'olympias_epirus',
      name: 'Queen Olympias of Epirus',
      role: 'Molossian Princess, Fourth Wife of Philip II & Mother of Alexander',
      lifespan: 'c. 375–316 BC',
      entity_type: 'person',
      monogram: 'OE',
      achievements: [
        'Daughter of King Neoptolemus I of Epirus claiming heroic descent from Achilles (Aeacids); married Philip II around 357 BC to seal a northern border alliance.',
        'Practised ecstatic Orphic and Dionysian snake-handling mysteries and fostered beliefs that Alexander was fathered by Zeus Ammon via a thunderbolt or serpent (Plutarch 2–3).',
        'Went into angry exile in Epirus in 337 BC when Philip married the Macedonian noblewoman Cleopatra Eurydice, returning to immense influence at Pella after Philip’s assassination in 336 BC.',
      ],
      significance:
        'Olympias instilled in Alexander his lifelong identification with Achilles, fierce protective loyalty toward his mother, and openness to divine sonship crowned later at Siwah.',
      exam_distinction:
        'Evaluate hostile Greek gender stereotyping in Plutarch 2–3: male Greek writers sensationalised Olympias’ Molossian Dionysian cult as "barbaric" and "jealous" to contrast her against Macedonian norms.',
    },
    {
      id: 'philip_ii_macedon',
      name: 'King Philip II of Macedon',
      role: 'Reformer of the Macedonian Army, Hegemon of the League of Corinth & Father of Alexander',
      lifespan: '382–336 BC',
      entity_type: 'person',
      image: '/images/ocr_ancient/alexander_philip_ii_vergina.jpg',
      achievements: [
        'Transformed Macedon into a superpower by creating the professional 18-foot sarissa phalanx, elite Companion cavalry, and Pangaeum gold coinage.',
        'Hired Aristotle to tutor Alexander at Mieza (343 BC), appointed sixteen-year-old Alexander regent against the Maedi, and crushed Athens and Thebes at Chaeronea (338 BC).',
        'Prepared the pan-Hellenic invasion of Persia through the League of Corinth before being assassinated by his bodyguard Pausanias at Aegae in October 336 BC.',
      ],
      significance:
        'Without Philip’s professional army, siege corps, and Corinthian League, Alexander’s Asian conquests would have been impossible—fueling bitter father-son rivalry over glory.',
      exam_distinction:
        'Show both sides of Alexander’s relationship with Philip in Plutarch 6–9: proud mentorship (Bucephalas & Chaeronea) vs explosive dynastic insecurity (the 337 BC Attalus wedding brawl).',
    },
    {
      id: 'aristotle_stagira',
      name: 'Aristotle of Stagira',
      role: 'Greek Philosopher, Scientist & Royal Tutor to Alexander at Mieza',
      lifespan: '384–322 BC',
      entity_type: 'person',
      image: '/images/ocr_ancient/alexander_aristotle_bust.jpg',
      achievements: [
        'Summoned by Philip II around 343 BC (promising to rebuild Aristotle’s destroyed hometown of Stagira) to educate thirteen-year-old Alexander and his companions at the Nymphaeum of Mieza.',
        'Taught Alexander ethics, politics, medicine, natural science, and love of Greek literature, preparing the famous "casket edition" of Homer’s Iliad (Plutarch 7–8).',
        'Later grew estranged from Alexander after Aristotle’s great-nephew, the court historian Callisthenes, opposed proskynesis and was arrested in 327 BC.',
      ],
      significance:
        'Aristotle gave Alexander an enduring Greek cultural identity, curiosity for geography and medicine, and his obsession with rivalling Achilles from Homer’s Iliad.',
      exam_distinction:
        'Contrast Aristotle’s Greek view (treating non-Greeks as inferior "barbarians") with Alexander’s later pragmatic policy of adopting Persian dress and recruiting eastern troops.',
    },
  ],
  lessons: [
    {
      id: 'lesson_1_1',
      slug: 'kt1.1-alexander-youth-olympias-philip-bucephalas',
      alias_ids: ['lesson_1_1', 'lesson_1', 'kt1.1'],
      key_topic: 'KT1',
      prefix: 'KT 1',
      title: 'KT 1.1: Alexander’s Youth, Olympias, Philip II and Divine Lineage, 356–337 BC',
      period: '356–337 BC',
      enquiry:
        'How far did rival parents, divine myths, and Macedonian court ambition forge Alexander before he ever wore the crown?',
      enquiryQuestion:
        'How far did rival parents, divine myths, and Macedonian court ambition forge Alexander before he ever wore the crown?',
      specification_anchor:
        'OCR J198/01 Section D (1.1): Alexander’s youth; the character, political and personal influence of Olympias; Alexander’s relationship with Philip. Prescribed Sources: Plutarch, Life of Alexander 2–3, 6–9; Silver tetradrachm of Lysimachus (BM 1919,0820.1).',
      card_image: '/images/ocr_ancient/alexander_lysimachus_tetradrachm.jpg',
      card_position: 'center center',
      learning_objective:
        'Analyse Alexander’s youth and character, evaluate the personal and political influence of Olympias alongside his volatile relationship with Philip II, and assess our prescribed ancient sources.',
      learning_objectives: [
        'Explain how Olympias’ Molossian heritage, Dionysian religion, and divine birth omens shaped Alexander’s youth and character (Plutarch 2–3).',
        'Evaluate the mixture of pride and dynastic rivalry inside Alexander’s relationship with Philip II from Bucephalas and Mieza to the 337 BC Attalus brawl (Plutarch 6–9).',
        'Assess the accuracy and purpose of Plutarch’s moral biography alongside the prescribed Silver Tetradrachm of Lysimachus (BM 1919,0820.1).',
      ],
      do_now: [
        {
          question: 'Where did Macedon lie geographically in relation to classical Greek city-states like Athens, Thebes, and Sparta?',
          answer: 'To the north of mainland Greece (bordering Thessaly, Epirus, Illyria, and Thrace).',
          tag: 'Greek World Geography',
        },
        {
          question: 'In BC chronology, how old was someone born in 356 BC when a battle took place in 338 BC?',
          answer: 'Eighteen years old (356 minus 338 = 18; BC years count downwards towards AD 1).',
          tag: 'Classical Chronology',
        },
        {
          question: 'Which legendary Greek hero fought Hector outside Troy in Homer’s epic poem The Iliad?',
          answer: 'Achilles — the greatest warrior of the Greeks in the Trojan War.',
          tag: 'Classical Myth & Literature',
        },
        {
          question: 'Who was the king of the Greek gods on Mount Olympus whose sacred weapon was the thunderbolt?',
          answer: 'Zeus (often identified by Greeks with the North African oracle god Ammon as Zeus Ammon).',
          tag: 'Greek Religion',
        },
        {
          question: 'Why did ancient kings mint portraits and divine symbols onto silver coins across their kingdoms?',
          answer: 'Coins acted as mass-circulating political propaganda, broadcasting a ruler’s legitimacy, military victories, and divine favour to soldiers and subjects.',
          tag: 'Material Culture',
        },
      ],
      vocab: [
        {
          term: 'Pella',
          phonetic: 'PEL-uh',
          definition:
            'Royal capital of the Kingdom of Macedon where Alexander was born in July 356 BC at the court of Philip II.',
        },
        {
          term: 'Olympias',
          phonetic: 'oh-LIM-pee-us',
          definition:
            'Molossian princess from Epirus, fourth wife of Philip II and mother of Alexander, famed for Dionysian rites and fierce dynastic protection of her son.',
        },
        {
          term: 'Zeus Ammon',
          phonetic: 'ZOOSE AM-on',
          definition:
            'Supreme Graeco-Egyptian deity combining Greek Zeus with Egyptian Amun (depicted with curved ram’s horns), claimed as Alexander’s divine father.',
        },
        {
          term: 'Bucephalas',
          phonetic: 'byoo-SEF-uh-lus',
          definition:
            'Wild Thessalian warhorse ("Ox-Head") costing thirteen talents, tamed by young Alexander after he spotted the horse feared its own shadow.',
        },
        {
          term: 'Mieza',
          phonetic: 'mee-EE-zuh',
          definition:
            'Shaded sanctuary of the Nymphs in Macedon where Philip II sent thirteen-year-old Alexander to be educated by the philosopher Aristotle.',
        },
        {
          term: 'Attalus',
          phonetic: 'AT-uh-lus',
          definition:
            'Powerful Macedonian general and uncle of Philip’s new bride Cleopatra Eurydice whose toast to a "legitimate" heir in 337 BC provoked a violent brawl with Alexander.',
        },
        {
          term: 'Lysimachus',
          phonetic: 'ly-SIM-uh-kus',
          definition:
            'Former royal bodyguard of Alexander who ruled Thrace and Asia Minor (c. 305–281 BC) and minted silver tetradrachms showing Alexander with the ram’s horn of Zeus Ammon.',
        },
      ],
      vocab_cloze_text:
        'Born at the Macedonian royal capital of [Pella] in 356 BC, young Alexander was profoundly shaped by his Epirote mother [Olympias], who encouraged stories that his true divine father was [Zeus Ammon]. Early brilliance shone when he calmed the thirteen-talent stallion [Bucephalas] by turning him into the sun, before studying Homer and science under Aristotle at [Mieza]. Yet in 337 BC, when the Macedonian noble [Attalus] insulted his legitimacy at Philip’s wedding feast, Alexander fled into exile—while decades later the Successor king [Lysimachus] minted silver coins celebrating Alexander’s divine ram’s horn.',
      narrative_blocks: [
        {
          act: 1,
          title: 'Pella 356 BC: Philip II’s Macedon and Molossian Princess Olympias',
          heading: 'Pella 356 BC: Philip II’s Macedon and Molossian Princess Olympias',
          theme_heading: 'Pella 356 BC: Philip II’s Macedon and Molossian Princess Olympias',
          act_title:
            'Beat 1: Pella 356 BC — Why did Philip II marry Olympias, and what made Macedonian court politics volatile?',
          image: '/images/ocr_ancient/alexander_philip_ii_vergina.jpg',
          image_alt: 'Roman marble portrait head of King Philip II of Macedon in the Ny Carlsberg Glyptotek',
          caption:
            'Marble portrait head of King Philip II of Macedon (Ny Carlsberg Glyptotek, Copenhagen), whose military reforms and polygamous marriages shaped the court of Pella.',
          paragraphs: [
            '<span class="para-ref">[1.1]</span> **Alexander’s youth** unfolded inside the ruthless, hard-drinking royal court of **Pella**, where he was born in **July 356 BC**. His father, one-eyed warrior **King Philip II**, had rescued **Macedon** from near-collapse, forging a professional army armed with the eighteen-foot **sarissa** pike and funded by **Mount Pangaeum’s** gold mines. Unlike monogamous Athenians, Macedonian kings practised **polygamy**—marrying multiple wives simultaneously to cement military alliances.',
            '<span class="para-ref">[1.2]</span> Around **357 BC**, Philip sealed a western alliance with **Epirus** by marrying **Olympias**, an orphaned **Molossian** princess whom he had met during religious initiation on **Samothrace**. Because Philip had seven wives and no fixed law of eldest-son succession, every queen’s **political** survival depended on pushing her own son forward—making **Olympias** a formidable protector of Alexander’s claim from infancy.'
          ],
          text: '<span class="para-ref">[1.1]</span> **Alexander’s youth** unfolded inside the ruthless, hard-drinking royal court of **Pella**, where he was born in **July 356 BC**. His father, one-eyed warrior **King Philip II**, had rescued **Macedon** from near-collapse, forging a professional army armed with the eighteen-foot **sarissa** pike and funded by **Mount Pangaeum’s** gold mines. Unlike monogamous Athenians, Macedonian kings practised **polygamy**—marrying multiple wives simultaneously to cement military alliances.\n\n<span class="para-ref">[1.2]</span> Around **357 BC**, Philip sealed a western alliance with **Epirus** by marrying **Olympias**, an orphaned **Molossian** princess whom he had met during religious initiation on **Samothrace**. Because Philip had seven wives and no fixed law of eldest-son succession, every queen’s **political** survival depended on pushing her own son forward—making **Olympias** a formidable protector of Alexander’s claim from infancy.',
          content:
            '<span class="para-ref">[1.1]</span> **Alexander’s youth** unfolded inside the ruthless, hard-drinking royal court of **Pella**, where he was born in **July 356 BC**. His father, one-eyed warrior **King Philip II**, had rescued **Macedon** from near-collapse, forging a professional army armed with the eighteen-foot **sarissa** pike and funded by **Mount Pangaeum’s** gold mines. Unlike monogamous Athenians, Macedonian kings practised **polygamy**—marrying multiple wives simultaneously to cement military alliances.\n\n<span class="para-ref">[1.2]</span> Around **357 BC**, Philip sealed a western alliance with **Epirus** by marrying **Olympias**, an orphaned **Molossian** princess whom he had met during religious initiation on **Samothrace**. Because Philip had seven wives and no fixed law of eldest-son succession, every queen’s **political** survival depended on pushing her own son forward—making **Olympias** a formidable protector of Alexander’s claim from infancy.',
        },
        {
          act: 2,
          title: 'Thunderbolts, Serpents, and the Influence of Olympias',
          heading: 'Thunderbolts, Serpents, and the Influence of Olympias',
          theme_heading: 'Thunderbolts, Serpents, and the Influence of Olympias',
          act_title:
            'Beat 2: Thunderbolts, Serpents, and Olympias — How did Olympias’ religious beliefs and hero ancestry shape young Alexander’s character?',
          inlineSourceIds: ['src_alex_1_1_plut_2_3'],
          concept_widget: {
            type: 'svg_diagram',
            eyebrow: 'Heroic & Divine Bloodlines (Plutarch 2–3)',
            title: 'How Both Parents Fed Alexander’s Superhuman Identity',
            caption:
              'Every bedtime story at Pella told young Alexander that he carried the blood of Greece’s greatest demi-gods.',
            svg: '<svg viewBox="0 0 560 185" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#fffbeb;border-radius:10px;border:1px solid #fcd34d;"><style>svg g{opacity:1 !important;}</style><rect x="16" y="16" width="248" height="92" rx="9" fill="#eff6ff" stroke="#60a5fa" stroke-width="1.5"/><text x="30" y="39" font-size="11" font-weight="900" fill="#1e3a8a">FATHER: KING PHILIP II (ARGEADS)</text><text x="30" y="61" font-size="10.5" fill="#1e293b">• Claimed descent from Heracles</text><text x="30" y="80" font-size="10.5" fill="#1e293b">• Dreamed he sealed Olympias’ womb</text><text x="30" y="97" font-size="10.5" font-weight="700" fill="#1d4ed8">  with the crest of a courageous LION</text><rect x="296" y="16" width="248" height="92" rx="9" fill="#fdf2f8" stroke="#f472b6" stroke-width="1.5"/><text x="310" y="39" font-size="11" font-weight="900" fill="#9d174d">MOTHER: OLYMPIAS (AEACIDS)</text><text x="310" y="61" font-size="10.5" fill="#1e293b">• Claimed descent from Achilles</text><text x="310" y="80" font-size="10.5" fill="#1e293b">• Thunderbolt dream &amp; sacred serpent</text><text x="310" y="97" font-size="10.5" font-weight="700" fill="#be185d">  pointing to ZEUS AMMON</text><rect x="120" y="124" width="320" height="48" rx="9" fill="#7c2d12"/><text x="280" y="146" text-anchor="middle" font-size="11.5" font-weight="900" fill="#fde68a">ALEXANDER’S LIFELONG BELIEF</text><text x="280" y="163" text-anchor="middle" font-size="10.5" fill="#ffedd5">Rival Achilles in glory + claim divine sonship of Zeus Ammon</text></svg>',
          },
          paragraphs: [
            '<span class="para-ref">[2.1]</span> Few mothers in antiquity exerted stronger **personal** and **political** **influence** than **Olympias**. Through her Epirote royal house, she taught Alexander that he descended directly from **Achilles**, hero of Troy, while **Philip’s** Argead dynasty claimed **Heracles**. Passionate and fiercely devout, Olympias led ecstatic **Dionysian** mystery rites involving tame **serpents** coiled around ivy wreaths—practices Greek writers viewed with awe and suspicion.',
            '<span class="para-ref">[2.2]</span> In **Plutarch’s *Life of Alexander* (2–3)**, supernatural omens surrounded Alexander’s conception: Olympias dreamed a **thunderbolt** struck her womb, Philip dreamed he sealed it with a **lion** signet, and Philip supposedly glimpsed a giant **serpent** beside his sleeping wife—cooling his affection and inspiring rumours that **Zeus Ammon** had fathered the boy. On the very day Alexander was born, the **Temple of Artemis at Ephesus** burned down while Philip captured **Potidaea** and his racehorse won at **Olympia**, forging Alexander’s restless, glory-hungry **character**.'
          ],
          text: '<span class="para-ref">[2.1]</span> Few mothers in antiquity exerted stronger **personal** and **political** **influence** than **Olympias**. Through her Epirote royal house, she taught Alexander that he descended directly from **Achilles**, hero of Troy, while **Philip’s** Argead dynasty claimed **Heracles**. Passionate and fiercely devout, Olympias led ecstatic **Dionysian** mystery rites involving tame **serpents** coiled around ivy wreaths—practices Greek writers viewed with awe and suspicion.\n\n<span class="para-ref">[2.2]</span> In **Plutarch’s *Life of Alexander* (2–3)**, supernatural omens surrounded Alexander’s conception: Olympias dreamed a **thunderbolt** struck her womb, Philip dreamed he sealed it with a **lion** signet, and Philip supposedly glimpsed a giant **serpent** beside his sleeping wife—cooling his affection and inspiring rumours that **Zeus Ammon** had fathered the boy. On the very day Alexander was born, the **Temple of Artemis at Ephesus** burned down while Philip captured **Potidaea** and his racehorse won at **Olympia**, forging Alexander’s restless, glory-hungry **character**.',
          content:
            '<span class="para-ref">[2.1]</span> Few mothers in antiquity exerted stronger **personal** and **political** **influence** than **Olympias**. Through her Epirote royal house, she taught Alexander that he descended directly from **Achilles**, hero of Troy, while **Philip’s** Argead dynasty claimed **Heracles**. Passionate and fiercely devout, Olympias led ecstatic **Dionysian** mystery rites involving tame **serpents** coiled around ivy wreaths—practices Greek writers viewed with awe and suspicion.\n\n<span class="para-ref">[2.2]</span> In **Plutarch’s *Life of Alexander* (2–3)**, supernatural omens surrounded Alexander’s conception: Olympias dreamed a **thunderbolt** struck her womb, Philip dreamed he sealed it with a **lion** signet, and Philip supposedly glimpsed a giant **serpent** beside his sleeping wife—cooling his affection and inspiring rumours that **Zeus Ammon** had fathered the boy. On the very day Alexander was born, the **Temple of Artemis at Ephesus** burned down while Philip captured **Potidaea** and his racehorse won at **Olympia**, forging Alexander’s restless, glory-hungry **character**.',
        },
        {
          act: 3,
          title: 'Taming Bucephalas and Outgrowing Macedonia',
          heading: 'Taming Bucephalas and Outgrowing Macedonia',
          theme_heading: 'Taming Bucephalas and Outgrowing Macedonia',
          act_title:
            'Beat 3: Taming Bucephalas and Outgrowing Macedonia — How did taming Bucephalas reveal both Alexander’s character and his rivalry with Philip?',
          image: '/images/ocr_ancient/alexander_bucephalus_mosaic_or_statue.jpg',
          image_alt: 'Detail of Alexander the Great riding his warhorse Bucephalas from the Pompeii mosaic in Naples',
          caption:
            'Detail of Alexander riding his warhorse Bucephalas (Museo Archeologico Nazionale di Napoli), the black Thessalian stallion he tamed as a boy and rode across Asia until 326 BC.',
          hollywood_myth_buster: {
            myth: 'Modern dramas often flatten Philip II and Alexander into pure mutual hatred from childhood.',
            reality:
              'Plutarch 6–9 reveals a complex mixture of pride, mentorship, and competitive rivalry: Philip hired Aristotle for Alexander, wept with joy over Bucephalas, and trusted him with regency at sixteen and cavalry command at Chaeronea.',
          },
          paragraphs: [
            '<span class="para-ref">[3.1]</span> **Alexander’s relationship with Philip** combined deep paternal pride with fierce competition. Whenever news reached **Pella** that Philip had captured another famous city, young Alexander groaned to his friends that his father would leave him **nothing great or brilliant** left to achieve with them—caring far more for **courage and glory** than inherited luxury or wealth.',
            '<span class="para-ref">[3.2]</span> That observant **character** shone brightest when **Philonicus of Thessaly** offered to sell the wild black stallion **Bucephalas** for **thirteen talents**. When the horse reared at Philip’s grooms, Philip angrily ordered it led away until Alexander wagered the full price of the horse that he could ride it. Spotting that Bucephalas was terrified by its own moving **shadow**, Alexander gently turned its bridle **towards the sun**, vaulted aboard, and galloped back to a weeping Philip, who kissed his head and declared: **"My boy, you must find a kingdom big enough for your ambition; Macedonia is too small for you."**'
          ],
          text: '<span class="para-ref">[3.1]</span> **Alexander’s relationship with Philip** combined deep paternal pride with fierce competition. Whenever news reached **Pella** that Philip had captured another famous city, young Alexander groaned to his friends that his father would leave him **nothing great or brilliant** left to achieve with them—caring far more for **courage and glory** than inherited luxury or wealth.\n\n<span class="para-ref">[3.2]</span> That observant **character** shone brightest when **Philonicus of Thessaly** offered to sell the wild black stallion **Bucephalas** for **thirteen talents**. When the horse reared at Philip’s grooms, Philip angrily ordered it led away until Alexander wagered the full price of the horse that he could ride it. Spotting that Bucephalas was terrified by its own moving **shadow**, Alexander gently turned its bridle **towards the sun**, vaulted aboard, and galloped back to a weeping Philip, who kissed his head and declared: **"My boy, you must find a kingdom big enough for your ambition; Macedonia is too small for you."**',
          content:
            '<span class="para-ref">[3.1]</span> **Alexander’s relationship with Philip** combined deep paternal pride with fierce competition. Whenever news reached **Pella** that Philip had captured another famous city, young Alexander groaned to his friends that his father would leave him **nothing great or brilliant** left to achieve with them—caring far more for **courage and glory** than inherited luxury or wealth.\n\n<span class="para-ref">[3.2]</span> That observant **character** shone brightest when **Philonicus of Thessaly** offered to sell the wild black stallion **Bucephalas** for **thirteen talents**. When the horse reared at Philip’s grooms, Philip angrily ordered it led away until Alexander wagered the full price of the horse that he could ride it. Spotting that Bucephalas was terrified by its own moving **shadow**, Alexander gently turned its bridle **towards the sun**, vaulted aboard, and galloped back to a weeping Philip, who kissed his head and declared: **"My boy, you must find a kingdom big enough for your ambition; Macedonia is too small for you."**',
        },
        {
          act: 4,
          title: 'Aristotle at Mieza, Chaeronea, and the 337 BC Wedding Quarrel',
          heading: 'Aristotle at Mieza, Chaeronea, and the 337 BC Wedding Quarrel',
          theme_heading: 'Aristotle at Mieza, Chaeronea, and the 337 BC Wedding Quarrel',
          act_title:
            'Beat 4: Aristotle, Chaeronea, and the Attalus Quarrel — Why did Philip’s marriage to Cleopatra Eurydice in 337 BC fracture the royal family?',
          image: '/images/ocr_ancient/alexander_aristotle_bust.jpg',
          image_alt: 'Roman marble bust of the Greek philosopher Aristotle after a bronze original by Lysippos',
          caption:
            'Marble bust of Aristotle after Lysippos (Palazzo Altemps, Rome), hired by Philip II around 343 BC to tutor Alexander at the Nymphaeum of Mieza.',
          inlineSourceIds: ['src_alex_1_1_plut_6_9'],
          paragraphs: [
            '<span class="para-ref">[4.1]</span> Recognising that stubborn talent needed persuasion rather than force, **Philip** hired the Greek philosopher **Aristotle** to tutor thirteen-year-old Alexander at **Mieza**. Aristotle sparked Alexander’s lifelong passion for medicine, science, and **Homer’s *Iliad***—which Alexander slept with beside his dagger. At **sixteen** (340 BC), left as **regent** of Macedon, Alexander crushed the rebellious **Maedi** and named **Alexandropolis** after himself; at **eighteen**, he led the decisive cavalry charge against the **Theban Sacred Band** at **Chaeronea (338 BC)**.',
            '<span class="para-ref">[4.2]</span> Yet in **337 BC**, **Alexander’s relationship with Philip** exploded when Philip married **Cleopatra Eurydice**, young niece of the powerful Macedonian general **Attalus**. Because Olympias was Molossian rather than pure Macedonian, Attalus drunkenly urged guests at the wedding banquet to pray to the gods for a **"legitimate heir"** to the throne. Furious, Alexander shouted **"Do you take me for a bastard, you villain?"** and hurled his **drinking cup** at Attalus; when Philip drew his sword against his own son and tripped drunkenly between the couches, Alexander mocked a man preparing to cross from **Europe to Asia** who could not cross from couch to couch—before taking **Olympias** to **Epirus** and riding into self-exile in **Illyria**.'
          ],
          text: '<span class="para-ref">[4.1]</span> Recognising that stubborn talent needed persuasion rather than force, **Philip** hired the Greek philosopher **Aristotle** to tutor thirteen-year-old Alexander at **Mieza**. Aristotle sparked Alexander’s lifelong passion for medicine, science, and **Homer’s *Iliad***—which Alexander slept with beside his dagger. At **sixteen** (340 BC), left as **regent** of Macedon, Alexander crushed the rebellious **Maedi** and named **Alexandropolis** after himself; at **eighteen**, he led the decisive cavalry charge against the **Theban Sacred Band** at **Chaeronea (338 BC)**.\n\n<span class="para-ref">[4.2]</span> Yet in **337 BC**, **Alexander’s relationship with Philip** exploded when Philip married **Cleopatra Eurydice**, young niece of the powerful Macedonian general **Attalus**. Because Olympias was Molossian rather than pure Macedonian, Attalus drunkenly urged guests at the wedding banquet to pray to the gods for a **"legitimate heir"** to the throne. Furious, Alexander shouted **"Do you take me for a bastard, you villain?"** and hurled his **drinking cup** at Attalus; when Philip drew his sword against his own son and tripped drunkenly between the couches, Alexander mocked a man preparing to cross from **Europe to Asia** who could not cross from couch to couch—before taking **Olympias** to **Epirus** and riding into self-exile in **Illyria**.',
          content:
            '<span class="para-ref">[4.1]</span> Recognising that stubborn talent needed persuasion rather than force, **Philip** hired the Greek philosopher **Aristotle** to tutor thirteen-year-old Alexander at **Mieza**. Aristotle sparked Alexander’s lifelong passion for medicine, science, and **Homer’s *Iliad***—which Alexander slept with beside his dagger. At **sixteen** (340 BC), left as **regent** of Macedon, Alexander crushed the rebellious **Maedi** and named **Alexandropolis** after himself; at **eighteen**, he led the decisive cavalry charge against the **Theban Sacred Band** at **Chaeronea (338 BC)**.\n\n<span class="para-ref">[4.2]</span> Yet in **337 BC**, **Alexander’s relationship with Philip** exploded when Philip married **Cleopatra Eurydice**, young niece of the powerful Macedonian general **Attalus**. Because Olympias was Molossian rather than pure Macedonian, Attalus drunkenly urged guests at the wedding banquet to pray to the gods for a **"legitimate heir"** to the throne. Furious, Alexander shouted **"Do you take me for a bastard, you villain?"** and hurled his **drinking cup** at Attalus; when Philip drew his sword against his own son and tripped drunkenly between the couches, Alexander mocked a man preparing to cross from **Europe to Asia** who could not cross from couch to couch—before taking **Olympias** to **Epirus** and riding into self-exile in **Illyria**.',
        },
        {
          act: 5,
          title: 'Weighing Plutarch Against Royal Hellenistic Coinage',
          heading: 'Weighing Plutarch Against Royal Hellenistic Coinage',
          theme_heading: 'Weighing Plutarch Against Royal Hellenistic Coinage',
          act_title:
            'Beat 5: Weighing Our Prescribed Set Sources — Why did King Lysimachus mint coins showing Alexander with the ram’s horn of Zeus Ammon?',
          inlineSourceIds: ['src_alex_1_1_lysimachus_coin'],
          myth_vs_spade: {
            title: 'Moral Biography (AD 100) vs Hellenistic Silver Coinage (c. 305–281 BC)',
            literary_label: 'Plutarch, Life of Alexander 2–3 & 6–9',
            literary_claim:
              'Written ~430 years later under Rome as moral biography ("Lives, not Histories"), selecting vivid childhood omens and banquet quarrels to prefigure both Alexander’s brilliance and his fatal wine-fuelled temper.',
            archaeology_label: 'Silver Tetradrachm of Lysimachus (BM 1919,0820.1)',
            archaeology_fact:
              'Struck within a generation of Alexander’s death by his former bodyguard King Lysimachus, physically proving how Olympias’ Zeus Ammon myth became official Hellenistic royal propaganda.',
          },
          concept_widget: {
            type: 'svg_diagram',
            eyebrow: 'AO3 Source Provenance Timeline',
            title: 'Mind the 430-Year Time Gap on OCR Depth Questions',
            caption:
              'Never write "Plutarch wasn’t there"! Contrast near-contemporary Successor coinage (305–281 BC) with Plutarch’s 2nd-century AD moral selection of Hellenistic court memoirs.',
            svg: '<svg viewBox="0 0 520 155" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;background:#f8fafc;border-radius:10px;border:1px solid #cbd5e1;"><style>svg g{opacity:1 !important;}</style><line x1="55" y1="74" x2="465" y2="74" stroke="#64748b" stroke-width="3.5"/><circle cx="75" cy="74" r="10" fill="#b45309"/><text x="75" y="46" text-anchor="middle" font-size="14" font-weight="900" fill="#78350f">356–323 BC</text><text x="75" y="106" text-anchor="middle" font-size="13.5" font-weight="800" fill="#1e293b">Alexander’s</text><text x="75" y="125" text-anchor="middle" font-size="13" fill="#475569">Lifetime</text><circle cx="235" cy="74" r="10" fill="#059669"/><text x="235" y="46" text-anchor="middle" font-size="14" font-weight="900" fill="#065f46">c. 305–281 BC</text><text x="235" y="106" text-anchor="middle" font-size="13.5" font-weight="800" fill="#065f46">Lysimachus Coin</text><text x="235" y="125" text-anchor="middle" font-size="13" fill="#475569">(+18–42 yrs)</text><circle cx="430" cy="74" r="10" fill="#4f46e5"/><text x="430" y="46" text-anchor="middle" font-size="14" font-weight="900" fill="#312e81">c. AD 100–115</text><text x="430" y="106" text-anchor="middle" font-size="13.5" font-weight="800" fill="#312e81">Plutarch’s Life</text><text x="430" y="125" text-anchor="middle" font-size="13" fill="#475569">(+430 yrs · Bio)</text></svg>',
          },
          paragraphs: [
            '<span class="para-ref">[5.1]</span> Although **Demaratus of Corinth** soon brokered a truce allowing Alexander back to **Pella**—bluntly asking **Philip** how he could unite Greece while his own household was at war—trust never truly healed. When Alexander secretly tried to hijack a marriage alliance with the Carian satrap **Pixodarus** ahead of his half-brother Arrhidaeus, Philip raged at him for demeaning Macedon. Writing over **430 years** later, **Plutarch** preserved these fiery youth scenes as moral biography—contrasting the calm boy who tamed **Bucephalas** against the explosive temper that would one day haunt his adult court.',
            '<span class="para-ref">[5.2]</span> Yet one extraordinary object survives from within a single generation of Alexander’s death: the **Silver Tetradrachm** minted by his former bodyguard **King Lysimachus** (c. 305–281 BC, British Museum). To legitimise his own rule over Thrace and Asia Minor, Lysimachus stamped Alexander’s youthful portrait wearing the **royal diadem** and the curved **ram’s horn of Zeus Ammon**, backed by **Athena Nikephoros** holding winged Nike—turning **Olympias’** old divine-sonship whispers into empire-wide currency.'
          ],
          text: '<span class="para-ref">[5.1]</span> Although **Demaratus of Corinth** soon brokered a truce allowing Alexander back to **Pella**—bluntly asking **Philip** how he could unite Greece while his own household was at war—trust never truly healed. When Alexander secretly tried to hijack a marriage alliance with the Carian satrap **Pixodarus** ahead of his half-brother Arrhidaeus, Philip raged at him for demeaning Macedon. Writing over **430 years** later, **Plutarch** preserved these fiery youth scenes as moral biography—contrasting the calm boy who tamed **Bucephalas** against the explosive temper that would one day haunt his adult court.\n\n<span class="para-ref">[5.2]</span> Yet one extraordinary object survives from within a single generation of Alexander’s death: the **Silver Tetradrachm** minted by his former bodyguard **King Lysimachus** (c. 305–281 BC, British Museum). To legitimise his own rule over Thrace and Asia Minor, Lysimachus stamped Alexander’s youthful portrait wearing the **royal diadem** and the curved **ram’s horn of Zeus Ammon**, backed by **Athena Nikephoros** holding winged Nike—turning **Olympias’** old divine-sonship whispers into empire-wide currency.',
          content:
            '<span class="para-ref">[5.1]</span> Although **Demaratus of Corinth** soon brokered a truce allowing Alexander back to **Pella**—bluntly asking **Philip** how he could unite Greece while his own household was at war—trust never truly healed. When Alexander secretly tried to hijack a marriage alliance with the Carian satrap **Pixodarus** ahead of his half-brother Arrhidaeus, Philip raged at him for demeaning Macedon. Writing over **430 years** later, **Plutarch** preserved these fiery youth scenes as moral biography—contrasting the calm boy who tamed **Bucephalas** against the explosive temper that would one day haunt his adult court.\n\n<span class="para-ref">[5.2]</span> Yet one extraordinary object survives from within a single generation of Alexander’s death: the **Silver Tetradrachm** minted by his former bodyguard **King Lysimachus** (c. 305–281 BC, British Museum). To legitimise his own rule over Thrace and Asia Minor, Lysimachus stamped Alexander’s youthful portrait wearing the **royal diadem** and the curved **ram’s horn of Zeus Ammon**, backed by **Athena Nikephoros** holding winged Nike—turning **Olympias’** old divine-sonship whispers into empire-wide currency.',
        },
      ],
      workbook_stages: [
        {
          stage: 1,
          title: 'Polygamous Court Politics at Pella',
          date: '356 BC',
          question: 'Why did Philip II marry Olympias, and how did royal polygamy affect Pella?',
          questionHeading: 'Why did Philip II marry Olympias, and how did royal polygamy affect Pella?',
          summary:
            'Philip II married Molossian princess Olympias to seal an alliance with Epirus, while royal polygamy and no fixed eldest-son succession forced rival queens to fight for their sons.',
        },
        {
          stage: 2,
          title: 'Olympias and Divine Birth Omens',
          date: '356 BC',
          question: 'How did Olympias’ Dionysian rites and Achilles lineage shape Alexander?',
          questionHeading:
            'How did Olympias’ Dionysian rites and Achilles lineage shape Alexander?',
          summary:
            'Claiming descent from Achilles and practising Dionysian serpent rites, Olympias encouraged thunderbolt and snake omens pointing to Zeus Ammon that fuelled Alexander’s hunger for glory.',
        },
        {
          stage: 3,
          title: 'Taming the Stallion Bucephalas',
          date: 'c. 344 BC',
          question: 'What did taming Bucephalas reveal about Alexander’s character and ambition?',
          questionHeading:
            'What did taming Bucephalas reveal about Alexander’s character and ambition?',
          summary:
            'Alexander spotted Bucephalas feared its own shadow and turned it towards the sun, prompting Philip to declare Macedonia too small while Alexander feared Philip would leave no glory left.',
        },
        {
          stage: 4,
          title: 'Mieza, Chaeronea and the Attalus Brawl',
          date: '343–337 BC',
          question: 'Which wedding banquet quarrel in 337 BC drove Alexander into self-exile?',
          questionHeading:
            'Which wedding banquet quarrel in 337 BC drove Alexander into self-exile?',
          summary:
            'Cleopatra Eurydice’s uncle Attalus toasted a "legitimate heir", sparking a cup-throwing brawl in which Philip drew his sword on Alexander before Olympias fled to Epirus and Alexander to Illyria.',
        },
        {
          stage: 5,
          title: 'Lysimachus’ Zeus Ammon Silver Tetradrachm',
          date: 'c. 305–281 BC',
          question: 'In what ways did Lysimachus portray Alexander on his silver tetradrachm?',
          questionHeading: 'In what ways did Lysimachus portray Alexander on his silver tetradrachm?',
          summary:
            'Lysimachus minted tetradrachms showing Alexander wearing the royal diadem and ram’s horn of Zeus Ammon alongside Athena Nikephoros to legitimise his Successor rule over Thrace and Asia Minor.',
        },
      ],
      causal_domino_spine: {
        title: '5-Stage Chronological Spine: Alexander’s Youth, Olympias & Philip II (356–337 BC)',
        stages: [
          {
            stage: 1,
            title: 'Polygamous Court Politics at Pella',
            date: '356 BC',
            question: 'Why did Philip II marry Olympias, and how did royal polygamy affect Pella?',
            answer:
              'Philip married Olympias to secure an Epirote border alliance, but having multiple wives with no fixed succession law made every marriage a dynastic threat.',
          },
          {
            stage: 2,
            title: 'Olympias and Divine Birth Omens',
            date: '356 BC',
            question: 'How did Olympias’ Dionysian rites and Achilles lineage shape Alexander?',
            answer:
              'Olympias taught Alexander he descended from Achilles and fostered thunderbolt and serpent omens linking his birth to Zeus Ammon.',
          },
          {
            stage: 3,
            title: 'Taming the Stallion Bucephalas',
            date: 'c. 344 BC',
            question: 'What did taming Bucephalas reveal about Alexander’s character and ambition?',
            answer:
              'Turning Bucephalas into the sun proved Alexander’s sharp observation and courage, winning Philip’s praise that Macedonia was too small even as Alexander envied Philip’s conquests.',
          },
          {
            stage: 4,
            title: 'Mieza, Chaeronea and the Attalus Brawl',
            date: '343–337 BC',
            question: 'Which wedding banquet quarrel in 337 BC drove Alexander into self-exile?',
            answer:
              'General Attalus urged guests to pray for a "legitimate heir" from Philip’s Macedonian bride Cleopatra Eurydice, provoking a brawl with Philip and exile to Epirus and Illyria.',
          },
          {
            stage: 5,
            title: 'Lysimachus’ Zeus Ammon Silver Tetradrachm',
            date: 'c. 305–281 BC',
            question: 'In what ways did Lysimachus portray Alexander on his silver tetradrachm?',
            answer:
              'Lysimachus stamped Alexander with the royal diadem and curved ram’s horn of Zeus Ammon plus Athena holding Nike to borrow Alexander’s divine authority.',
          },
        ],
      },
      sources: [
        {
          id: 'src_alex_1_1_plut_2_3',
          letter: 'A',
          is_prescribed: true,
          prescribed_ref: 'OCR Appendix 5f Set Text • Plutarch, Life of Alexander 2–3',
          badge: 'OCR PRESCRIBED SET SOURCE',
          title: 'Set Source A: Plutarch, Life of Alexander 2–3 (Lineage, Conception Omens & Dionysian Rites)',
          provenance:
            'Plutarch of Chaeronea (c. AD 100–115), Moral Biography written ~430 years after Alexander. Hub Classroom Classics™ modern-English translation.',
          extract:
            'On his father’s side Alexander descended from Heracles through Caranus, and on his mother’s side from Aeacus and Achilles through Neoptolemus; nobody doubted this. Before the night they shared the marriage chamber, the bride Olympias dreamed that thunder crashed and a lightning bolt struck her womb, kindling a blazing fire that burst into flames flowing in every direction before dying out. Later, Philip dreamed he pressed a seal upon his wife’s womb carved with the likeness of a lion... Once, too, a huge tame serpent was seen stretched out beside Olympias’ body as she slept, which above all cooled Philip’s passion and made him visit her bed less often—either fearing magic spells from his wife, or shrinking back in awe because she was consorting with a higher divine power. Moreover, Olympias threw herself more zealously than other women into ecstatic Orphic and Dionysian rites, bringing huge tame snakes that slithered out of the ivy baskets and terrified the men. And on the very day Alexander was born, the Temple of Artemis at Ephesus burned down, while Philip received three messages at once: Parmenio had defeated the Illyrians, his racehorse had won at Olympia, and Alexander had been born.',
          golden_quotes: [
            'a lightning bolt struck her womb',
            'carved with the likeness of a lion',
            'a huge tame serpent was seen stretched out beside Olympias',
            'Temple of Artemis at Ephesus burned down',
          ],
          full_set_scenes: [
            {
              tab: '2.1–2.5: Lineage & Wedding Dreams',
              heading: 'Plutarch, Life of Alexander 2.1–2.5 — Heracles, Achilles, Thunderbolt & Lion Seal',
              text: 'Everyone agreed that on his father’s side Alexander descended from Heracles through Caranus, and on his mother’s side from Aeacus (and therefore Achilles) through Neoptolemus. Philip is said to have fallen in love with Olympias while both were still young, when they were initiated together into the sacred mysteries on the island of Samothrace, and with the consent of her brother Arybbas he arranged their marriage. Before the night on which they were locked into the bridal chamber, the bride dreamed that amid a crash of thunder a lightning bolt struck her womb, sparking a great fire that split into flames streaming everywhere before going out. Some time after the wedding, Philip dreamed he was pressing a signet seal onto his wife’s womb, and the carving on the seal, as he thought, bore the image of a lion. While other seers warned Philip to guard his marriage closely, Aristander of Telmessus declared the woman was pregnant—since nobody seals an empty vessel—and would bear a bold, lion-hearted son.',
            },
            {
              tab: '2.6–3.4: Serpents, Dionysus & Delphi',
              heading: 'Plutarch, Life of Alexander 2.6–3.4 — The Sacred Snake & Apollo’s Warning to Philip',
              text: 'Once a large serpent was seen stretched out beside Olympias’ body while she slept, and they say this above all cooled Philip’s love and closeness towards her, so that he rarely came to sleep beside her anymore—whether because he feared his wife might practise sorcery and enchantments against him, or because he held back out of religious dread, believing she had a divine partner greater than himself. Another tradition explains that all women of that northern region were devoted from ancient times to Orphic mysteries and ecstatic rites of Dionysus, and that Olympias threw herself into these possessions more wildly than anyone, bringing great tame snakes into the dances that coiled out of the ivy and sacred winnowing-baskets around the women’s wands and garlands, terrifying the men who watched. Nevertheless, after seeing that apparition, Philip sent Chaeron of Megalopolis to Delphi, where Apollo ordered him to sacrifice to Ammon and revere that god above all—warning he would lose the eye with which he had peeped through the crack of the bedroom door and seen the god in serpent form sharing his wife’s bed. And as Eratosthenes writes, Olympias privately told Alexander alone the secret of his conception when sending him off to war, urging him to think thoughts worthy of his birth; though others say she rejected the rumour indignantly, asking: "Will Alexander never stop slandering me in front of Hera?"',
            },
            {
              tab: '3.5–3.9: Ephesus Fire & Triple Victory',
              heading: 'Plutarch, Life of Alexander 3.5–3.9 — Birth on 6 Hecatombaeon (July 356 BC)',
              text: 'Alexander was born early in the month of Hecatombaeon, which the Macedonians call Loös, on the sixth day—the very same day on which the great Temple of Artemis at Ephesus burned to the ground. Hegesias of Magnesia made a remark cold enough to have put out that fire, joking that Artemis naturally let her temple burn down because she was busy acting as midwife at Alexander’s birth! Yet all the Persian Magi who were then at Ephesus treated the temple’s destruction as an omen of a far greater disaster, running through the streets beating their faces and crying out that that day had brought forth a terrible plague and ruin for Asia. To Philip himself, however, who had just captured Potidaea, three joyful dispatches arrived simultaneously: first, that Parmenio had defeated the Illyrians in a great battle; second, that his racehorse had won victory at the Olympic Games; and third, that Alexander had been born—and his seers heightened his joy still further by declaring that a son born alongside three victories would prove utterly invincible.',
            },
          ],
          question:
            'How accurate do you think Plutarch’s presentation of Olympias and Alexander’s birth in Chapters 2–3 is?',
          model_answer:
            'Plutarch accurately reflects real historical elements—Olympias’ Epirote claim to Achilles, Molossian Dionysian snake cults, and Philip’s 356 BC Olympic victory—but his "lightning bolt" and "lion" seal dreams are retrospective moral portents shaped centuries later to foreshadow Alexander’s fiery conquests and Siwah divinity.',
          source_context:
            'Notice Plutarch’s own honesty in Chapter 3: he actually records TWO clashing stories—Eratosthenes claiming Olympias whispered his divine birth to him, versus others claiming she joked "Will Alexander never stop getting me into trouble with Hera?" Class Discussion: Why do Greek male writers portray Olympias’ traditional Molossian snake worship as sinister "magic spells"?',
        },
        {
          id: 'src_alex_1_1_plut_6_9',
          letter: 'B',
          is_prescribed: true,
          prescribed_ref: 'OCR Appendix 5f Set Text • Plutarch, Life of Alexander 6–9',
          badge: 'OCR PRESCRIBED SET SOURCE',
          title: 'Set Source B: Plutarch, Life of Alexander 6–9 (Bucephalas, Aristotle & The 337 BC Attalus Quarrel)',
          provenance:
            'Plutarch of Chaeronea (c. AD 100–115). Hub Classroom Classics™ modern-English Exam-Cut + Complete Chapters 6–9 Scene Tabs.',
          extract:
            'Ch. 6 (Bucephalas): "Seeing at once that the horse was terrified by the fluttering of its own shadow in front of it, Alexander ran up, took the reins, and turned him straight towards the sun... When Alexander dismounted, Philip wept with joy, kissed his head, and said: ‘My boy, seek out a kingdom equal to yourself, for Macedonia does not have room for you.’" — Ch. 9 (337 BC Wedding Quarrel): "Philip’s marriages and love affairs threw the women’s quarters into turmoil and bred fierce quarrels... Most disastrous of all was his marriage to Cleopatra, a young girl far below his own age. At the wedding drinking-party, her uncle Attalus got drunk and urged the Macedonians to pray to the gods for a legitimate heir to the kingdom from Philip and Cleopatra. Stung to fury, Alexander shouted, ‘You villain, what do you take me for—a bastard?’ and hurled his cup at him. Philip leaped up drawing his sword against Alexander, but luckily for both, anger and wine made him trip and fall headlong. Mocking him, Alexander said: ‘Look, men! Here is the man preparing to cross from Europe into Asia, and he gets overturned crossing from one couch to another!’"',
          golden_quotes: [
            'terrified by the fluttering of its own shadow',
            'Macedonia does not have room for you',
            'pray to the gods for a legitimate heir',
            'overturned crossing from one couch to another',
          ],
          full_set_scenes: [
            {
              tab: 'Ch. 6: Taming Bucephalas',
              heading: 'Plutarch, Life of Alexander 6 — Thirteen Talents, the Shadow & Philip’s Tears',
              text: 'Philonicus the Thessalian brought the horse Bucephalas to sell to Philip for thirteen talents, and they went down into the plain to test him. The horse seemed wild and utterly unmanageable, letting none of Philip’s attendants mount him nor enduring the voice of anyone around Philip, rearing violently at them all. Displeased, Philip ordered them to lead the beast away as completely unbroken, when Alexander, standing nearby, remarked: "What a horse they are losing, just because they lack the skill and nerve to handle him!" At first Philip stayed silent, but when Alexander repeated it under his breath, Philip snapped: "Do you criticize your elders as if you knew more or could handle a horse better?" "I could certainly handle this one better than anyone else," Alexander replied. "And if you fail, what penalty will you pay for your rashness?" "By Zeus," said Alexander, "I will pay the full price of the horse!" Laughter broke out, they agreed the wager on the thirteen talents, and Alexander ran immediately to the horse, took the bridle, and turned him directly towards the sun—having noticed that Bucephalas was disturbed at seeing his own shadow falling and dancing in front of him. Trotting beside him gently and stroking him while the horse breathed fire with spirit, Alexander quietly slipped off his cloak, vaulted lightly onto his back, held him steady with the reins without striking or tearing his mouth, and then—once the horse dropped its fear and strained forward—gave him full rein with bold shouts and kicks. Philip and his court watched in silent terror at first, until Alexander wheeled proudly back to applause; Philip is said to have wept with joy, kissed his head as he dismounted, and declared: "My boy, seek out a kingdom equal to yourself, for Macedonia does not have room for you."',
            },
            {
              tab: 'Ch. 7–8: Aristotle & Homer',
              heading: 'Plutarch, Life of Alexander 7–8 — Mieza, Philosophy, Medicine & The Iliad',
              text: 'Seeing that Alexander’s nature was unyielding—resisting anyone who tried to drive him by force, yet easily guided towards duty by reasoned persuasion—Philip decided ordinary music and school teachers were not enough, and summoned the most famous and learned of philosophers, Aristotle, rewarding him nobly by rebuilding and repopulating Aristotle’s native city of Stagira, which Philip himself had earlier destroyed. For their school and study retreat he assigned the Sanctuary of the Nymphs near Mieza, where to this day visitors are shown Aristotle’s stone seats and shady walks. Alexander learned not only ethical and political teachings, but also the deeper oral doctrines philosophers called "acroamatic"; when he later heard in Asia that Aristotle had published books on those subjects, he wrote frankly complaining that he would rather excel other men in superior knowledge than in power! Aristotle also kindled Alexander’s love of medicine—so that he prescribed treatments and diets for sick friends—and above all his love of reading. Calling Homer’s Iliad a handbook of the art of war, Alexander took Aristotle’s corrected edition—known as "the Iliad of the casket"—and as Onesicritus relates, always slept with it under his pillow alongside his dagger. When few Greek books reached him inland in Asia, he ordered Harpalus to send him Philistus’ histories, plays of Euripides, Sophocles, and Aeschylus, and dithyrambs of Telestes and Philoxenus. Though he admired Aristotle as warmly as his own father at first—saying Philip gave him life, but Aristotle taught him how to live nobly—he later grew suspicious of him after the arrest of Callisthenes.',
            },
            {
              tab: 'Ch. 9.1–9.4: Maedi & Chaeronea',
              heading: 'Plutarch, Life of Alexander 9.1–9.4 — Regent at Sixteen & Commander at Chaeronea (338 BC)',
              text: 'While Philip marched against Byzantium, sixteen-year-old Alexander was left behind in Macedonia as regent and keeper of the royal seal. Far from sitting idle, he subdued the rebellious Thracian tribe of the Maedi, captured their stronghold, drove out its barbarian inhabitants, settled a mixed population there, and named the new city Alexandropolis. Soon afterwards, he fought in person at the great Battle of Chaeronea against the Greeks (338 BC), where he is said to have been the very first man to charge and break the famous Sacred Band of the Thebans; even in Plutarch’s own lifetime, locals pointed out an ancient oak tree beside the River Cephisus called "Alexander’s Oak", near which his tent had been pitched, not far from the common burial mound of the Macedonians.',
            },
            {
              tab: 'Ch. 9.5–9.11: Attalus Brawl & Exile',
              heading: 'Plutarch, Life of Alexander 9.5–9.11 — Wedding Insult, Drawn Sword & Demaratus’ Peace (337 BC)',
              text: 'Such early triumphs naturally filled Philip with affection—so much so that he beamed whenever Macedonians called Alexander "the king" and Philip "the general". Yet disturbances inside the royal household, sparked by Philip’s many marriages and love affairs, infected the kingdom through the women’s quarters and bred bitter accusations, made sharper by Olympias’ jealous, quick-tempered nature as she egged Alexander on. Above all, Attalus provoked an open rupture at Philip’s wedding to Cleopatra, a young Macedonian girl whom Philip fell in love with despite her youth. Being Cleopatra’s uncle, Attalus got drunk at the banquet and called on the Macedonians to pray to the gods that Philip and Cleopatra might produce a legitimate heir to the throne. Infuriated, Alexander cried out, "You scoundrel, do I look to you like a bastard?" and threw his drinking cup at him. Philip jumped up and drew his sword against Alexander, but fortunately for both men, rage and heavy wine made him stumble and fall flat. Insulting him, Alexander declared: "Look, men! Here is the man preparing to cross from Europe into Asia, and he is overturned crossing from one couch to another!" After this drunken uproar, Alexander took Olympias away and settled her in Epirus while spending time himself among the Illyrians. Meanwhile Demaratus the Corinthian, an old family guest-friend, visited Philip; when Philip politely asked how harmoniously the Greeks were getting along with one another, Demaratus replied pointedly: "It really suits you, Philip, to worry about Greece when you have filled your own household with such terrible strife and trouble!" Brought to his senses, Philip sent Demaratus to persuade Alexander to return home.',
            },
          ],
          question:
            'What can we learn from Set Source B (Plutarch, Alexander 6 & 9) about Alexander’s relationship with Philip II?',
          model_answer:
            'Set Source B shows a volatile mixture of admiration and dynastic threat: Philip wept with pride at Bucephalas saying "Macedonia does not have room for you", yet Attalus’ call for a "legitimate heir" in 337 BC exposed how Philip’s polygamy threatened Alexander’s succession and triggered armed fury.',
          source_context:
            'Click the 4 Scene Tabs above to read every word of your prescribed Chapters 6–9! Notice how Plutarch pairs Chapter 6 (self-control taming a wild horse) with Chapter 9 (drunken loss of temper at a Macedonian banquet)—setting up the exact theme that will haunt Alexander at Persepolis and Maracanda. Class Discussion: Why was Attalus’ word "legitimate" politically dangerous for Alexander even though Alexander was already eighteen and a hero of Chaeronea?',
        },
        {
          id: 'src_alex_1_1_lysimachus_coin',
          letter: 'C',
          is_prescribed: true,
          prescribed_ref: 'OCR Appendix 5f Set Artefact • Silver Tetradrachm of Lysimachus (BM 1919,0820.1)',
          badge: 'OCR PRESCRIBED COIN LAB',
          title: 'Set Source C: Silver Tetradrachm of King Lysimachus Showing Deified Alexander (c. 305–281 BC)',
          provenance:
            'British Museum (1919,0820.1), minted at Lampsacus by Alexander’s former bodyguard King Lysimachus (17.16g silver tetradrachm).',
          image: '/images/ocr_ancient/alexander_lysimachus_tetradrachm.jpg',
          reverse_svg:
            '<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" style="width:280px;height:280px;display:block;margin:0 auto;"><style>svg g{opacity:1 !important;}</style><defs><radialGradient id="silvRev" cx="42%" cy="38%" r="60%"><stop offset="0%" stop-color="#f8fafc"/><stop offset="65%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#64748b"/></radialGradient></defs><circle cx="160" cy="160" r="148" fill="url(#silvRev)" stroke="#475569" stroke-width="5"/><circle cx="160" cy="160" r="136" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,4"/><text x="64" y="170" transform="rotate(-90 64 170)" text-anchor="middle" font-family="serif" font-size="14" font-weight="900" fill="#1e293b" letter-spacing="2">ΒΑΣΙΛΕΩΣ</text><text x="258" y="170" transform="rotate(90 258 170)" text-anchor="middle" font-family="serif" font-size="14" font-weight="900" fill="#1e293b" letter-spacing="2">ΛΥΣΙΜΑΧΟΥ</text><path d="M138,225 L205,225 L205,235 L125,235 Z" fill="#334155"/><circle cx="196" cy="198" r="24" fill="#94a3b8" stroke="#334155" stroke-width="3"/><circle cx="196" cy="198" r="7" fill="#334155"/><path d="M168,108 C184,108 192,126 188,150 L195,224 L152,224 L155,165 L128,162 L128,152 L156,144 Z" fill="#334155"/><path d="M162,92 L182,82 L176,108 Z" fill="#1e293b"/><path d="M108,136 L124,118 L130,144 L116,148 Z" fill="#0f172a"/><circle cx="120" cy="126" r="14" fill="none" stroke="#15803d" stroke-width="2" stroke-dasharray="3,2"/><text x="160" y="274" text-anchor="middle" font-size="10.5" font-weight="800" fill="#1e293b">Reverse: Seated Athena Nikephoros + Nike</text></svg>',
          caption:
            'Obverse: Idealised head of deified Alexander facing right wearing the royal diadem and the curved ram’s horn of Zeus Ammon. Flip to inspect the Reverse (Athena Nikephoros + Greek legend ΒΑΣΙΛΕΩΣ ΛΥΣΙΜΑΧΟΥ).',
          hotspots: [
            {
              x: 48,
              y: 52,
              label: 'Curved Ram’s Horn of Zeus Ammon',
              detail:
                'Curling around Alexander’s ear—visual proof of his claim to be the divine son of Zeus Ammon (NEVER confuse this with the Egyptian god Ptah!).',
            },
            {
              x: 38,
              y: 30,
              label: 'Royal Hellenistic Diadem',
              detail:
                'White cloth headband tied behind the flowing hair (anastole), symbolising absolute Hellenistic kingship over conquered Asia.',
            },
            {
              x: 68,
              y: 40,
              label: 'Upward Divine Gaze & Youthful Portrait',
              detail:
                'Following court sculptor Lysippos’ famous style: parted lips, leonine hair, and upward gaze connecting Alexander to the gods.',
            },
            {
              x: 54,
              y: 78,
              label: 'Reverse: Seated Athena Holding Nike',
              detail:
                'Flip the coin! War-goddess Athena holds winged Victory (Nike) crowning the Greek name ΒΑΣΙΛΕΩΣ ΛΥΣΙΜΑΧΟΥ ("Of King Lysimachus"), transferring Alexander’s invincibility onto Lysimachus.',
            },
          ],
          question:
            'What can we learn from this prescribed coin about how Alexander’s divine parentage was used after his death?',
          model_answer:
            'The obverse pairs the royal diadem with the curved ram’s horn of Zeus Ammon while the reverse shows Athena holding Nike crowning Lysimachus’ name, proving that Alexander’s former bodyguard promoted Olympias’ and Siwah’s divine-sonship myth to legitimise his own Hellenistic kingdom.',
          source_context:
            'Examiner Gold Dust: Use the "Flip Coin (Obverse ↔ Reverse)" and "Test Me Cold" buttons above! In the 2025 OCR exam series, examiners praised students who discussed BOTH sides of set coins while warning against confusing Zeus Ammon with Ptah. Class Discussion: Why did Lysimachus put Alexander’s face—rather than his own face—on his silver coins?',
        },
      ],
      visual_story_sheet: {
        title: 'KT 1.1 Visual Story: Alexander’s Youth, Olympias and Philip II (356–337 BC)',
        topicLabel:
          'OCR J198/01 Section D • Alexander’s youth • Character, political and personal influence of Olympias • Alexander’s relationship with Philip',
        takeaway:
          'During Alexander’s youth at Pella, the personal and political influence of Olympias (Achilles lineage and Zeus Ammon omens) combined with Alexander’s proud yet volatile relationship with Philip II (Bucephalas, Mieza, Chaeronea, and the 337 BC Attalus brawl) to forge his restless character.',
        cards: [
          {
            step: 1,
            stat: '356 BC',
            heading: 'Youth at Pella and Influence of Olympias',
            html: 'Born at Pella to Philip II and Molossian princess Olympias, Alexander’s youth and character were shaped by personal and political court rivalry, Achilles lineage, Dionysian serpents, and Zeus Ammon birth omens (Plutarch 2–3).',
            spoken:
              'Alexander’s youth and character at Pella were shaped by the strong personal and political influence of Olympias and rumours of Zeus Ammon.',
          },
          {
            step: 2,
            stat: 'c. 344–343 BC',
            heading: 'Bucephalas and Aristotle at Mieza',
            html: 'Alexander calmed thirteen-talent Bucephalas by turning him away from his shadow towards the sun ("Macedonia does not have room for you") and studied Homer’s Iliad under Aristotle at Mieza.',
            spoken:
              'Taming Bucephalas and studying Homer’s Iliad under Aristotle at Mieza revealed Alexander’s observant character and hunger for glory.',
          },
          {
            step: 3,
            stat: '340–337 BC',
            heading: 'Chaeronea Pride to Wedding Exile',
            html: 'After regency against the Maedi and charging the Sacred Band at Chaeronea (338 BC), Alexander’s relationship with Philip ruptured when Attalus toasted a "legitimate heir" in 337 BC.',
            spoken:
              'Despite triumphing at Chaeronea, Alexander’s relationship with Philip fractured violently when Attalus demanded a legitimate Macedonian heir in 337 BC.',
          },
          {
            step: 4,
            stat: 'c. 305–281 BC',
            heading: 'Lysimachus’ Zeus Ammon Tetradrachm',
            html: 'King Lysimachus minted silver tetradrachms showing deified Alexander with the royal diadem and ram’s horn of Zeus Ammon plus Athena Nikephoros.',
            spoken:
              'King Lysimachus minted silver tetradrachms showing Alexander wearing the royal diadem and curved ram’s horn of Zeus Ammon.',
          },
        ],
      },
      exam_practice: {
        paper_code: 'J198/01 Section D',
        questions: [
          {
            id: 'alex_l1_q16',
            q_number: 'Q16(a)–(c)',
            type: 'ocr_discrete_5',
            marks: 5,
            question:
              '(a) Name the Greek philosopher hired by Philip II to tutor Alexander at Mieza. [1]\n(b) Name the Macedonian general whose toast at Philip’s 337 BC wedding feast provoked a violent quarrel with Alexander. [1]\n(c) Identify three omens connected with Alexander’s conception and birth in Plutarch’s Life of Alexander. [3]',
            examiner_tip:
              'Rapid 5-mark starter on Section D: keep answers crisp and specific so you save 25+ minutes for Question 20*!',
            model_answer:
              '<p><strong>(a)</strong> Aristotle. [1]</p><p><strong>(b)</strong> Attalus. [1]</p><p><strong>(c)</strong> Olympias dreamed a lightning bolt struck her womb [1]; Philip dreamed he sealed her womb with a lion signet (or saw a giant serpent beside her) [1]; and on the day of his birth the Temple of Artemis at Ephesus burned down while Philip’s racehorse won at Olympia [1].</p>',
          },
          {
            id: 'alex_l1_q17',
            q_number: 'Q17',
            type: 'ocr_source_learn_5',
            marks: 5,
            sources: [
              {
                letter: 'B',
                title: 'Passage B: Plutarch, Life of Alexander 6 (Prescribed Set Source)',
                provenance: 'Plutarch describes young Alexander taming the stallion Bucephalas in front of Philip II.',
                content:
                  'Seeing at once that the horse was terrified by the fluttering of its own shadow in front of it, Alexander ran up, took the reins, and turned him straight towards the sun... When Alexander dismounted, Philip wept with joy, kissed his head, and said: "My boy, seek out a kingdom equal to yourself, for Macedonia does not have room for you."',
              },
            ],
            question:
              'What can we learn from Passage B about Alexander’s character and ambitions during his youth? [5 marks]',
            examiner_tip:
              '5m AO3 Rule: Make 2 clear deductions directly supported by short "direct quotes" from Passage B.',
            model_answer:
              '<p>First, Passage B shows that even in his youth Alexander possessed sharp powers of observation and calm self-confidence where older courtiers failed: rather than beating Bucephalas, he noticed the horse was <mark class="ocr-quote-green">"terrified by the fluttering of its own shadow"</mark> and intelligently turned it towards the sun.</p><p>Second, Philip’s tearful prophecy that <mark class="ocr-quote-green">"Macedonia does not have room for you"</mark> reveals that Alexander’s ambition already reached far beyond Macedon’s borders, pointing towards future imperial conquest.</p>',
          },
          {
            id: 'alex_l1_q18',
            q_number: 'Q18',
            type: 'ocr_source_accuracy_5',
            marks: 5,
            sources: [
              {
                letter: 'C',
                title: 'Source C: Silver Tetradrachm Minted by Lysimachus (BM 1919,0820.1 — Prescribed Set Source)',
                provenance:
                  'Silver tetradrachm minted c. 305–281 BC showing Alexander with royal diadem and ram’s horn of Zeus Ammon (obverse) and seated Athena holding Nike (reverse).',
                image: '/images/ocr_ancient/alexander_lysimachus_tetradrachm.jpg',
              },
            ],
            question:
              'Using details from Source C, evaluate how accurate you think this presentation of Alexander is. [5 marks]',
            examiner_tip:
              'Judge BOTH what the coin accurately reflects about Alexander’s beliefs AND why Lysimachus idealised him as propaganda.',
            model_answer:
              '<p>Source C accurately captures the ideological image Alexander promoted during his own lifetime: the <mark class="ocr-quote-green">"royal diadem"</mark> reflects his kingship over Asia, while the curved <mark class="ocr-quote-green">"ram’s horn of Zeus Ammon"</mark> curling around his ear matches the divine-sonship beliefs nurtured by Olympias (Plutarch 2–3) and later confirmed at the Siwah oracle, alongside Lysippos’ upward-gazing portrait style.</p><p>However, as a physical portrait it is deliberate posthumous propaganda rather than literal realism: minted c. 305–281 BC by his former bodyguard King Lysimachus alongside <mark class="ocr-quote-green">"seated Athena holding Nike"</mark>, it idealises a perpetually youthful, godlike conqueror—erasing battle scars and human flaws—so Lysimachus could borrow Alexander’s divine charisma to legitimise ruling Thrace and Asia Minor.</p>',
          },
          {
            id: 'alex_l1_q19',
            q_number: 'Q19',
            type: 'ocr_depth_explain_10',
            marks: 10,
            question:
              'Explain why Alexander’s relationship with Philip II became increasingly strained by 337 BC. [10 marks]',
            examiner_tip:
              'Q19 tests 5 AO1 + 5 AO2 ONLY (zero AO3 source evaluation needed!). Write 2 analytical paragraphs explaining WHY tensions escalated.',
            model_answer:
              '<p>The root structural cause of tension was Macedon’s polygamous royal system combined with Olympias’ non-Macedonian origin. Because Philip II took seven wives without a fixed law of primogeniture, Alexander’s status as heir felt secure only while no pure-blooded Macedonian rival existed. When Philip married Cleopatra Eurydice—young niece of the influential Macedonian general Attalus—in 337 BC, Attalus’ drunken toast urging Macedonians to pray for a "legitimate heir" directly threatened to demote eighteen-year-old Alexander despite his proven service as regent against the Maedi and commander against the Sacred Band at Chaeronea (338 BC). That dynastic insecurity triggered the cup-throwing banquet brawl, Philip’s drawn sword, and Alexander and Olympias’ flight to Illyria and Epirus.</p><p>Second, deep personal and ideological rivalry between a proud father and an ambitious son magnified every court dispute. Raised by Olympias to revere Achilles and ponder divine parentage from Zeus Ammon, and educated by Aristotle at Mieza on Homer’s Iliad, Alexander craved unrivalled personal glory—complaining as a boy that Philip’s victories would leave him nothing great left to conquer. Even after Demaratus of Corinth reconciled them, the 336 BC Pixodarus affair—where Alexander secretly offered himself to wed a Carian satrap’s daughter ahead of his half-brother Arrhidaeus—proved that mutual suspicion over succession and authority remained unresolved.</p>',
          },
          {
            id: 'alex_l1_q20',
            q_number: 'Q20*',
            type: 'ocr_depth_essay_20',
            marks: 20,
            question:
              '‘Olympias had a far greater influence than Philip II on shaping Alexander’s character and ambitions during his youth.’ How far do you agree with this view? You must use ancient sources you have studied in your answer. [20 marks]',
            examiner_tip:
              '10 out of 20 marks are AO3! Quote Plutarch 2–3, Plutarch 6–9, AND the Lysimachus Tetradrachm in "quotation marks", and evaluate their provenance in historical context.',
            model_answer:
              '<p><span class="ocr-ao2-span">Olympias and Philip II shaped two inseparable halves of young Alexander: while Olympias forged his heroic religious identity and fierce dynastic pride, Philip II provided the intellectual training, military apprenticeship, and competitive benchmark without which Alexander’s ambitions could never have been realised.</span></p><p><span class="ocr-ao2-span">Olympias’ personal and spiritual influence was undoubtedly profound.</span> In <mark class="ocr-quote-green">"Plutarch, Life of Alexander 2–3"</mark>, <span class="ocr-ao1-span">Olympias passes on Aeacid descent from Achilles, practises ecstatic Dionysian snake rites,</span> and dreams <mark class="ocr-quote-green">"a lightning bolt struck her womb"</mark> alongside a <mark class="ocr-quote-green">"huge tame serpent"</mark> linked to Zeus Ammon. Writing moral biography over four centuries later under the Roman Empire, Plutarch deliberately selects portents that prefigure Alexander’s adult god-claims—and male Greek hostility exaggerates Olympias’ Molossian cult as sorcery—yet our near-contemporary <mark class="ocr-quote-green">"Silver Tetradrachm of Lysimachus"</mark> (c. 305–281 BC) corroborates the lasting power of that belief by stamping Alexander with the <mark class="ocr-quote-green">"ram’s horn of Zeus Ammon"</mark>. <span class="ocr-ao1-span">Politically, too,</span> <mark class="ocr-quote-green">"Plutarch 9"</mark> notes that Olympias <mark class="ocr-quote-green">"egged Alexander on"</mark> during Philip’s polygamous quarrels, <span class="ocr-ao1-span">taking him to Epirus in 337 BC</span> when Attalus demanded a <mark class="ocr-quote-green">"legitimate heir"</mark>.</p><p><span class="ocr-ao2-span">Nevertheless, arguing Olympias outweighed Philip underestimates how decisively Philip moulded Alexander’s practical kingship and competitive drive.</span> In <mark class="ocr-quote-green">"Plutarch 6"</mark>, when Alexander tames Bucephalas after spotting the stallion feared <mark class="ocr-quote-green">"the fluttering of its own shadow"</mark>, it is Philip who weeps with pride and declares <mark class="ocr-quote-green">"Macedonia does not have room for you"</mark>. Although Plutarch polishes this scene as a literary foreshadowing of Asian conquest, <span class="ocr-ao1-span">Philip’s concrete actions in <mark class="ocr-quote-green">"Plutarch 7–9"</mark> are indisputable historical fact: Philip hired Aristotle at Mieza (giving Alexander his prized casket Iliad), trusted him as regent at sixteen to subdue the Maedi, and gave him the decisive cavalry wing at Chaeronea in 338 BC.</span> <span class="ocr-ao2-span">Even Alexander’s complaint that Philip would leave him nothing great to conquer proves Philip was the benchmark driving his ambition.</span></p><p><span class="ocr-ao2-span">Overall, therefore, the two parents were equally decisive in different spheres: Olympias supplied the Achilles and Zeus Ammon mythology that inspired superhuman self-belief, whereas Philip II forged the educated commander and military machine capable of turning myth into empire.</span></p>',
          },
        ],
      },
      quiz: [
        {
          question: 'In which city and year was Alexander III of Macedon born?',
          options: ['Pella in July 356 BC', 'Athens in 338 BC', 'Babylon in 323 BC', 'Sparta in 360 BC'],
          correct: 0,
          explanation: 'Alexander was born at the Macedonian royal capital of Pella in July 356 BC.',
        },
        {
          question: 'From which neighbouring northern kingdom did Alexander’s mother Olympias come?',
          options: ['Epirus (the Molossians)', 'Persia', 'Egypt', 'Lydia'],
          correct: 0,
          explanation: 'Olympias was a princess of the royal Molossian house of Epirus.',
        },
        {
          question: 'Which two legendary Greek figures did Alexander’s parents claim descent from in Plutarch 2?',
          options: [
            'Heracles (via Philip II) and Achilles (via Olympias)',
            'Romulus and Remus',
            'Odysseus and Hector',
            'Theseus and Perseus',
          ],
          correct: 0,
          explanation: 'The Argeads claimed Heracles while Olympias’ Aeacid house claimed Achilles.',
        },
        {
          question: 'Where did Philip II and Olympias reportedly first meet during initiation into sacred mysteries?',
          options: ['The island of Samothrace', 'Delphi', 'Babylon', 'Crete'],
          correct: 0,
          explanation: 'Plutarch 2 records their initiation together into the mysteries at Samothrace.',
        },
        {
          question: 'What did Olympias dream struck her womb before her wedding night in Plutarch 2?',
          options: ['A thunderbolt and lightning flame', 'A golden eagle', 'A bronze spear', 'An olive tree'],
          correct: 0,
          explanation: 'Olympias dreamed a lightning bolt struck her womb, kindling flames in all directions.',
        },
        {
          question: 'What animal emblem was carved on the signet seal in Philip II’s dream in Plutarch 2?',
          options: ['A lion', 'A wolf', 'An owl', 'A crocodile'],
          correct: 0,
          explanation: 'Aristander of Telmessus interpreted the lion seal to mean she would bear a lion-hearted son.',
        },
        {
          question: 'Which ecstatic Greek mystery cult involving tame snakes did Olympias famously practise?',
          options: ['Orphic and Dionysian rites', 'Roman Vestal rites', 'Zoroastrian fire worship', 'Druidic rites'],
          correct: 0,
          explanation: 'Plutarch 2 describes tame serpents coiling around the women’s ivy baskets in Dionysian worship.',
        },
        {
          question: 'Which god did Apollo at Delphi reportedly instruct Philip II to revere after seeing a serpent beside Olympias?',
          options: ['Ammon (Zeus Ammon)', 'Poseidon', 'Ares', 'Hephaestus'],
          correct: 0,
          explanation: 'Apollo’s oracle told Philip to sacrifice to Ammon—linking Alexander’s birth to Zeus Ammon.',
        },
        {
          question: 'Which famous Greek wonder burned down on the very day Alexander was born in July 356 BC?',
          options: [
            'The Temple of Artemis at Ephesus',
            'The Parthenon in Athens',
            'The Lighthouse of Alexandria',
            'The Palace of Persepolis',
          ],
          correct: 0,
          explanation: 'Plutarch 3 notes the Magi at Ephesus lamented that Asia’s destroyer had been born that day.',
        },
        {
          question: 'How much did Philonicus the Thessalian ask Philip II to pay for the stallion Bucephalas?',
          options: ['Thirteen talents', 'One silver drachma', 'Fifty ships', 'One hundred talents'],
          correct: 0,
          explanation: 'Alexander wagered the full thirteen-talent price of the horse that he could ride him.',
        },
        {
          question: 'Why had Bucephalas reared wildly at Philip’s grooms before Alexander calmed him?',
          options: [
            'He was startled by his own moving shadow on the ground',
            'He had been wounded by an arrow',
            'He feared baggage camels',
            'He was blind in one eye',
          ],
          correct: 0,
          explanation: 'Alexander noticed the shadow and turned Bucephalas directly towards the sun.',
        },
        {
          question: 'Which Greek philosopher tutored thirteen-year-old Alexander at the Nymphaeum of Mieza?',
          options: ['Aristotle', 'Socrates', 'Plato', 'Diogenes'],
          correct: 0,
          explanation: 'Philip II hired Aristotle and rebuilt his hometown of Stagira as payment.',
        },
        {
          question: 'Which annotated book edited by Aristotle did Alexander keep under his pillow alongside his dagger?',
          options: ['Homer’s Iliad ("casket edition")', 'Herodotus’ Histories', 'Virgil’s Aeneid', 'Xenophon’s Anabasis'],
          correct: 0,
          explanation: 'Alexander revered Homer’s Iliad as a handbook of war and modelled himself on Achilles.',
        },
        {
          question: 'Which rebellious Thracian tribe did sixteen-year-old Alexander subdue while serving as regent in 340 BC?',
          options: ['The Maedi (founding Alexandropolis)', 'The Spartans', 'The Egyptians', 'The Scythians'],
          correct: 0,
          explanation: 'As regent while Philip besieged Byzantium, Alexander crushed the Maedi and founded Alexandropolis.',
        },
        {
          question: 'Which elite Greek unit did eighteen-year-old Alexander break at the Battle of Chaeronea in 338 BC?',
          options: ['The Sacred Band of Thebes', 'The Persian Immortals', 'The Roman Senate Guard', 'The Athenian Navy'],
          correct: 0,
          explanation: 'Plutarch 9 credits Alexander with leading the charge against the Theban Sacred Band at Chaeronea.',
        },
        {
          question: 'Why did Attalus’ wedding toast in 337 BC threaten Alexander’s position as heir?',
          options: [
            'Cleopatra Eurydice was pure-blooded Macedonian whereas Olympias was Molossian from Epirus',
            'Alexander had renounced the throne to become a philosopher',
            'Attalus was King of Persia',
            'Sparta controlled Macedonian succession',
          ],
          correct: 0,
          explanation: 'Attalus urged prayers for a "legitimate" Macedonian heir from Philip and Cleopatra Eurydice.',
        },
        {
          question: 'Where did Olympias and Alexander go into self-exile after the drunken 337 BC wedding quarrel?',
          options: [
            'Olympias went to Epirus and Alexander went to Illyria',
            'Both sailed to Egypt',
            'Both fled to Babylon',
            'Both moved to Sparta',
          ],
          correct: 0,
          explanation: 'Alexander escorted his mother to her homeland Epirus before staying among the Illyrians.',
        },
        {
          question: 'Which Corinthian guest-friend persuaded Philip II to recall Alexander from exile in 337 BC?',
          options: ['Demaratus of Corinth', 'Parmenio', 'Cleitus the Black', 'Harpalus'],
          correct: 0,
          explanation: 'Demaratus pointed out Philip could hardly unite Greece while his own house was torn by strife.',
        },
        {
          question: 'Approximately how many years after Alexander’s death did Plutarch write his Life of Alexander?',
          options: ['Around 430 years later (c. AD 100–115)', 'During Alexander’s childhood', 'Ten years later', 'One thousand years later'],
          correct: 0,
          explanation: 'Plutarch wrote moral biography in the Roman Imperial era using earlier Hellenistic sources.',
        },
        {
          question: 'Which divine attribute curls around Alexander’s ear on the prescribed Silver Tetradrachm of Lysimachus?',
          options: [
            'The curved ram’s horn of Zeus Ammon',
            'The crown of Egyptian Ptah',
            'Wings of Hermes',
            'Rays of Apollo Helios',
          ],
          correct: 0,
          explanation: 'Lysimachus paired the royal diadem with the ram’s horn of Zeus Ammon (never confuse with Ptah!).',
        },
      ],
      teacher_notes: {
        primer:
          'This flagship OCR J198/01 Section D Depth Study prototype replaces Bloomsbury’s thematic jumps with chronological storytelling from Pella (356 BC) to the eve of Aegae (337 BC), anchored 100% in official Appendix 5f Prescribed Set Sources: Plutarch, Life of Alexander 2–3 & 6–9 plus the British Museum Silver Tetradrachm of Lysimachus (BM 1919,0820.1). Every set extract uses accessible modern English with zero scroll fatigue (Exam-Cut + Scene-Tabbed Full Set Text Modal + 3D Coin Flip Hotspot Lab).',
        objectives: [
          {
            objective: 'Evaluate Olympias’ personal and political influence alongside Philip II’s mentorship and rivalry.',
            primer:
              'Contrast Olympias’ Achilles ancestry, Dionysian rites, and Zeus Ammon omens (Plutarch 2–3) against Philip’s practical pride at Bucephalas, Mieza, and Chaeronea before the 337 BC Attalus crisis (Plutarch 6–9).',
            question:
              'Was Alexander’s 337 BC explosion against Attalus driven more by loyalty to Olympias or fear of losing the Macedonian crown?',
          },
          {
            objective: 'Master AO3 evaluation of Plutarch’s moral biography and Hellenistic Successor coinage.',
            primer:
              'Train pupils to avoid generic clichés ("Plutarch wasn’t born yet") by explaining his genre ("Lives, not Histories") and contrasting it with Lysimachus’ c. 305–281 BC silver tetradrachm.',
            question:
              'Why is a silver coin minted twenty years after Alexander’s death still propaganda rather than neutral photography?',
          },
        ],
        delivery_plan: {
          sequence_title: '2-Lesson Sequence (50 mins each) — OCR J198/01 Section D',
          phases: [
            {
              phase: 'Lesson 1, Part 1 (20 mins)',
              focus: 'Spaced Do Now + Pronunciation Bar + Beats 1–2 & Set Source A (Plutarch 2–3)',
              activity:
                'Project the Divine Lineage diagram, read the Exam-Cut of Plutarch 2–3, and open Scene Tab 2 to inspect how Plutarch himself records two rival versions of Olympias’ words.',
            },
            {
              phase: 'Lesson 1, Part 2 (30 mins)',
              focus: 'Beats 3–4 & Set Source B (Plutarch 6–9: Bucephalas, Mieza, Chaeronea & Attalus Brawl)',
              activity:
                'Compare Chapter 6 (calm observation of Bucephalas’ shadow) against Chapter 9 (the hurled cup at Attalus and Philip tripping between couches), completing Spine Stages 1–4.',
            },
            {
              phase: 'Lesson 2, Part 1 (20 mins)',
              focus: 'Beat 5 + 3D Flip Lysimachus Tetradrachm Lab ("Test Me Cold" Mode)',
              activity:
                'Flip between the British Museum Obverse (Zeus Ammon horn + diadem) and Athena Nikephoros Reverse, then toggle "Test Me Cold" so pupils identify all 4 features from memory.',
            },
            {
              phase: 'Lesson 2, Part 2 (30 mins)',
              focus: '20m Set-Source Trio Matchmaker + Q18 [5m Accuracy] & Q20* [20m Essay] Practice',
              activity:
                'Use the Live Examiner Reductive-Trap Detector while drafting Q18 or planning Q20*, checking that every source reference uses "quotation marks" highlighted in Green.',
            },
          ],
        },
      },
    },
  ],
};
