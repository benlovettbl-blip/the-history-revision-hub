/**
 * Curated Iconic Visual Hooks for Unit Overview Lesson Cards & Split-Hero Cameos.
 *
 * Design Principle:
 * - Wide panoramic scenes (`lesson.banner`) work well for ultra-wide 1100x164 ribbons,
 *   but Unit Overview Lesson Cards (`cardImage`) and key portrait-led lessons (`heroCameo`)
 *   need instant, high-recognition historical faces, famous paintings, or signature artefacts
 *   (e.g. Elizabeth I in Coronation robes, the Armada Portrait, Sutton Hoo Helmet, Boudicca,
 *   Lord Kitchener, Rosa Parks, MLK) so pupils immediately recognise the topic at a glance.
 * - Keeping this registry decoupled in `src/data/` also avoids touching `data/ks2_*.json`
 *   while parallel KS2 units are authored on separate branches.
 */

export const ICONIC_LESSON_VISUALS = {
  // =========================================================================
  // GCSE: Early Elizabethan England, 1558–88 (eee)
  // =========================================================================
  eee: {
    lesson_1_1: {
      cardImage: '/images/eee/iconic/elizabeth_i_coronation_portrait_npg_hires.jpg',
      heroCameo: '/images/eee/kt1/cameo_l1_elizabeth_darnley_portrait_npg2082.jpg',
      cameoAlt: 'The Darnley Portrait of Queen Elizabeth I (c. 1575, National Portrait Gallery, London, NPG 2082)',
    },
    lesson_1_2: {
      cardImage: '/images/elizabeth_i_in_parliament_1559.jpg',
      heroCameo: '/images/eee/kt1/cameo_l2_elizabeth_pelican_portrait_1575.jpg',
      cameoAlt: 'The Pelican Portrait of Queen Elizabeth I (c. 1575, attributed to Nicholas Hilliard, Walker Art Gallery)',
    },
    lesson_1_3: {
      cardImage: '/images/eee/kt1/duke_of_alba_antonis_mor_1549.jpg',
      heroCameo: '/images/eee/kt1/cameo_l3_pope_pius_iv_pulzone.jpg',
      cameoAlt: 'Portrait of Pope Pius IV (1559–65, Circle of Scipione Pulzone)',
    },
    lesson_1_4: {
      cardImage: '/images/upgraded/gcse-med-eee/eee_mary_queen_of_scots_hilliard.jpg',
      heroCameo: '/images/eee/kt1/cameo_l4_mary_stuart_clouet_miniature.jpg',
      cameoAlt: 'Portrait miniature of Mary, Queen of Scots in crimson Renaissance court dress (François Clouet, c. 1558–60, Royal Collection)',
    },
    lesson_2_1: {
      cardImage: '/images/mary_queen_of_scots_execution_fotheringhay_1587.jpg',
      heroCameo: '/images/eee/kt2/pope_pius_v_passarotti_walters.jpg',
      cameoAlt: 'Pope Pius V (c. 1566, by Bartolomeo Passarotti, Walters Art Museum 37.453), author of the 1570 papal bull Regnans in Excelsis',
    },
    lesson_2_2: {
      cardImage: '/images/upgraded/gcse-med-eee/eee_sir_francis_drake_npg4037.jpg',
      heroCameo: '/images/eee/kt2/elizabeth_i_sieve_portrait_1583.jpg',
      cameoAlt: 'Queen Elizabeth I, The Sieve Portrait (1583, by Quentin Metsys the Younger, Pinacoteca Nazionale di Siena)',
    },
    lesson_2_3: {
      cardImage: '/images/eee/kt2/robert_dudley_leicester_waddesdon.jpg',
      heroCameo: '/images/eee/kt2/charles_howard_nottingham_admiral.jpg',
      cameoAlt: 'Charles Howard, 1st Earl of Nottingham and 2nd Baron Howard of Effingham, Lord High Admiral of England in 1588',
    },
    lesson_2_4: {
      cardImage: '/images/eee/iconic/elizabeth_i_armada_portrait_woburn_hires.jpg',
      heroCameo: '/images/eee/kt2/sir_martin_frobisher_ketel_1577.jpg',
      cameoAlt: 'Sir Martin Frobisher (1577, by Cornelis Ketel, Bodleian Libraries LP 50), English squadron commander knighted after Gravelines in 1588',
    },
    lesson_3_1: {
      cardImage: '/images/eee/kt3/eee_l9_b4_shakespeare_chandos_npg1.jpg',
      heroCameo: '/images/eee/kt3/eee_l9_cameo_bess_of_hardwick_npg203.jpg',
      cameoAlt: 'Elizabeth Talbot (“Bess of Hardwick”), Countess of Shrewsbury (c. 1590, National Portrait Gallery NPG 203)',
    },
    lesson_3_2: {
      cardImage: '/images/eee/kt3/l10_s3_harman_caveat_vagabonds_1567.jpg',
      heroCameo: '/images/eee/kt3/eee_l10_cameo_elizabeth_i_silver_shilling.jpg',
      cameoAlt: 'Hammered silver shilling of Queen Elizabeth I showing crowned royal bust and quartered Tudor shield (1583–1603)',
    },
    lesson_3_3: {
      cardImage: '/images/upgraded/gcse-med-eee/eee_drake_1591_rmg_bhc2662.jpg',
      heroCameo: '/images/upgraded/gcse-med-eee/eee_drake_1591_rmg_bhc2662.jpg',
      cameoAlt: 'Sir Francis Drake with his hand resting on the terrestrial globe (Marcus Gheeraerts the Younger, 1591, RMG BHC2662)',
    },
    lesson_3_4: {
      cardImage: '/images/eee/kt3/eee_l12_s0_sir_walter_raleigh_1588_npg7.jpg',
      heroCameo: '/images/eee/kt3/eee_l12_cameo_raleigh_hilliard_miniature_1585.jpg',
      cameoAlt: 'Portrait miniature of Sir Walter Raleigh in a fine lace ruff by Nicholas Hilliard (c. 1585, National Portrait Gallery NPG 4106)',
    },
  },

  // =========================================================================
  // KS2 Primary Units (Zero-Conflict External Visual Mapping)
  // =========================================================================
  ks2_romans: {
    lesson_1: {
      cardImage: '/units/ks2_romans/assets/butser_iron_age_roundhouse.jpg',
      heroCameo: '/units/ks2_romans/assets/snettisham_great_torc.jpg',
      cameoAlt: 'The Snettisham Great Gold Torc (British Museum)',
    },
    lesson_2: {
      cardImage: '/units/ks2_romans/assets/roman_testudo_formation.jpg',
      heroCameo: '/units/ks2_romans/assets/emperor_claudius_bust.jpg',
      cameoAlt: 'Marble Bust of Roman Emperor Claudius',
    },
    lesson_3: {
      cardImage: '/units/ks2_romans/assets/boudicca_chariot_westminster.jpg',
      heroCameo: '/units/ks2_romans/assets/boudicca_chariot_westminster.jpg',
      cameoAlt: 'Queen Boudicca in Her War Chariot (Westminster)',
    },
    lesson_5: {
      cardImage: '/units/ks2_romans/assets/great_bath_aquae_sulis.jpg',
      heroCameo: '/units/ks2_romans/assets/fishbourne_cupid_dolphin_mosaic.jpg',
      cameoAlt: 'Cupid on a Dolphin Roman Mosaic at Fishbourne Palace',
    },
    lesson_6: {
      cardImage: '/units/ks2_romans/assets/mildenhall_great_silver_dish.jpg',
      heroCameo: '/units/ks2_romans/assets/constantine_statue_york_minster.jpg',
      cameoAlt: 'Emperor Constantine the Great at York (Eboracum)',
    },
  },

  ks2_anglo_saxons_vikings: {
    lesson_1: {
      cardImage: '/units/ks2_anglo_saxons_vikings/assets/nydam_oak_boat_migration.jpg',
    },
    lesson_2: {
      cardImage: '/units/ks2_anglo_saxons_vikings/assets/sutton_hoo_helmet_closeup.jpg',
      heroCameo: '/units/ks2_anglo_saxons_vikings/assets/sutton_hoo_helmet_closeup.jpg',
      cameoAlt: 'The Iconic Sutton Hoo Helmet (British Museum)',
    },
    lesson_3: {
      cardImage: '/units/ks2_anglo_saxons_vikings/assets/gokstad_viking_longship.jpg',
    },
    lesson_4: {
      cardImage: '/images/upgraded/ks2-ancient/asv_l4_blk1_alfred_statue_winchester.jpg',
      heroCameo: '/units/ks2_anglo_saxons_vikings/assets/alfred_jewel_ashmolean.jpg',
      cameoAlt: 'The Gold and Rock-Crystal Alfred Jewel (Ashmolean Museum)',
    },
    lesson_5: {
      cardImage: '/units/ks2_anglo_saxons_vikings/assets/coppergate_helmet_york.jpg',
      heroCameo: '/units/ks2_anglo_saxons_vikings/assets/coppergate_helmet_york.jpg',
      cameoAlt: 'Coppergate Helmet from Viking-Age York',
    },
    lesson_6: {
      cardImage: '/units/ks2_anglo_saxons_vikings/assets/hastings_1066_shield_wall.jpg',
      heroCameo: '/units/ks2_anglo_saxons_vikings/assets/king_athelstan_portrait_934.jpg',
      cameoAlt: 'Illuminated Portrait of King Athelstan (c. AD 934)',
    },
  },

  ks2_ww2: {
    lesson_1: {
      cardImage: '/units/ks2_ww2/assets/gas_masks_children_1939.jpg',
    },
    lesson_3: {
      cardImage: '/units/ks2_ww2/assets/kracowski_family_bialystok_1935.jpg',
    },
    lesson_4: {
      cardImage: '/units/ks2_ww2/assets/kindertransport_arrival.jpg',
    },
    lesson_5: {
      cardImage: '/units/ks2_ww2/assets/nicholas_winton_memorial_prague_station.jpg',
      heroCameo: '/units/ks2_ww2/assets/sir_nicholas_winton_portrait_2007.jpg',
      cameoAlt: 'Sir Nicholas Winton (1909–2015)',
    },
    lesson_6: {
      cardImage: '/units/ks2_ww2/assets/st_pauls_survives_blitz_1940.jpg',
      heroCameo: '/units/ks2_ww2/assets/st_pauls_survives_blitz_1940.jpg',
      cameoAlt: "St Paul's Cathedral standing amidst Blitz smoke (December 1940)",
    },
    lesson_8: {
      cardImage: '/units/ks2_ww2/assets/land_girl_tractor_ww2.jpg',
    },
    lesson_9: {
      cardImage: '/units/ks2_ww2/assets/enigma_machine_bletchley.jpg',
      heroCameo: '/units/ks2_ww2/assets/alan_turing_portrait.jpg',
      cameoAlt: 'Alan Turing (1912–1954)',
    },
    lesson_11: {
      cardImage: '/units/ks2_ww2/assets/windermere_children_airlift_prague_1945.jpg',
    },
  },

  ks2_stone_to_iron_age: {
    lesson_1: {
      cardImage: '/units/ks2_stone_to_iron_age/assets/woolly_mammoth_reconstruction.jpg',
      heroCameo: '/units/ks2_stone_to_iron_age/assets/star_carr_antler_headdress.jpg',
      cameoAlt: '11,000-Year-Old Carved Red-Deer Antler Headdress from Star Carr',
    },
    lesson_2: {
      cardImage: '/units/ks2_stone_to_iron_age/assets/skara_brae_stone_dresser_hero.jpg',
    },
    lesson_3: {
      cardImage: '/units/ks2_stone_to_iron_age/assets/stonehenge_sarsen_trilithons.jpg',
    },
    lesson_4: {
      cardImage: '/units/ks2_stone_to_iron_age/assets/mold_bronze_age_gold_cape.jpg',
      heroCameo: '/units/ks2_stone_to_iron_age/assets/mold_bronze_age_gold_cape.jpg',
      cameoAlt: 'The Mold Bronze Age Gold Cape (c. 1900–1600 BC)',
    },
    lesson_5: {
      cardImage: '/units/ks2_stone_to_iron_age/assets/must_farm_stilt_village_dig.jpg',
    },
    lesson_6: {
      cardImage: '/units/ks2_stone_to_iron_age/assets/maiden_castle_earth_ramparts.jpg',
      heroCameo: '/units/ks2_stone_to_iron_age/assets/waterloo_bridge_horned_helmet.jpg',
      cameoAlt: 'The Waterloo Bridge Ceremonial Bronze Horned Helmet (British Museum)',
    },
  },

  ks2_ancient_egypt: {
    lesson_1: {
      cardImage: '/units/ks2_ancient_egypt/assets/nile_delta_satellite_space.jpg',
      heroCameo: '/units/ks2_ancient_egypt/assets/narmer_palette_unification.jpg',
      cameoAlt: 'The Carved Narmer Palette Uniting Upper and Lower Egypt (c. 3100 BC)',
    },
    lesson_2: {
      cardImage: '/units/ks2_ancient_egypt/assets/great_sphinx_giza_khafre.jpg',
    },
    lesson_3: {
      cardImage: '/units/ks2_ancient_egypt/assets/seated_scribe_statue_louvre.jpg',
      heroCameo: '/units/ks2_ancient_egypt/assets/rosetta_stone_three_scripts.jpg',
      cameoAlt: 'The Rosetta Stone Inscribed in Three Scripts (196 BC)',
    },
    lesson_4: {
      cardImage: '/units/ks2_ancient_egypt/assets/hunefer_weighing_of_the_heart.jpg',
      heroCameo: '/units/ks2_ancient_egypt/assets/anubis_jackal_shrine_statue.jpg',
      cameoAlt: 'Black and Gold Jackal Shrine Statue of Anubis',
    },
    lesson_5: {
      cardImage: '/units/ks2_ancient_egypt/assets/abu_simbel_ramesses_temples.jpg',
      heroCameo: '/units/ks2_ancient_egypt/assets/queen_nefertiti_painted_bust.jpg',
      cameoAlt: 'Painted Limestone Royal Bust of Queen Nefertiti',
    },
    lesson_6: {
      cardImage: '/units/ks2_ancient_egypt/assets/tutankhamun_golden_death_mask.jpg',
      heroCameo: '/units/ks2_ancient_egypt/assets/tutankhamun_golden_death_mask.jpg',
      cameoAlt: 'Golden Funerary Mask of Boy-Pharaoh Tutankhamun (KV62)',
    },
  },

  ks2_ancient_greece: {
    lesson_1: {
      cardImage: '/units/ks2_ancient_greece/assets/cape_sounion_poseidon_aegean.jpg',
    },
    lesson_2: {
      cardImage: '/units/ks2_ancient_greece/assets/erechtheion_caryatid_porch.jpg',
      heroCameo: '/units/ks2_ancient_greece/assets/pericles_helmeted_marble_bust.jpg',
      cameoAlt: 'Helmeted Marble Portrait Bust of Athenian Leader Pericles',
    },
    lesson_3: {
      cardImage: '/units/ks2_ancient_greece/assets/parthenon_doric_marble_columns.jpg',
    },
    lesson_4: {
      cardImage: '/units/ks2_ancient_greece/assets/olympias_wooden_greek_trireme.jpg',
      heroCameo: '/units/ks2_ancient_greece/assets/spartan_warrior_leonidas_statue.jpg',
      cameoAlt: 'Marble Statue of a Helmeted Spartan Hoplite ("Leonidas")',
    },
    lesson_5: {
      cardImage: '/units/ks2_ancient_greece/assets/death_of_socrates_david_painting.jpg',
      heroCameo: '/units/ks2_ancient_greece/assets/hippocrates_inscribed_bust.jpg',
      cameoAlt: 'Inscribed Marble Bust of Physician Hippocrates of Kos',
    },
    lesson_6: {
      cardImage: '/units/ks2_ancient_greece/assets/alexander_mosaic_bucephalus.jpg',
      heroCameo: '/units/ks2_ancient_greece/assets/alexander_heracles_silver_coin.jpg',
      cameoAlt: 'Silver Coin of Alexander the Great Wearing Heracles’s Lion Skin',
    },
  },

  ks2_early_islamic_baghdad: {
    lesson_1: {
      cardImage: '/images/upgraded/ks2-world/baghdad_l1_banner_samarra_malwiya_minaret.jpg',
      heroCameo: '/units/ks2_early_islamic_baghdad/assets/harun_al_rashid_gold_dinar.jpg',
      cameoAlt: 'Abbasid Gold Dinar Coin Minted in Baghdad',
    },
    lesson_2: {
      cardImage: '/units/ks2_early_islamic_baghdad/assets/yahya_al_wasiti_baghdad_library.jpg',
    },
    lesson_3: {
      cardImage: '/units/ks2_early_islamic_baghdad/assets/islamic_brass_planispheric_astrolabe.jpg',
      heroCameo: '/units/ks2_early_islamic_baghdad/assets/al_khwarizmi_algebra_manuscript.jpg',
      cameoAlt: 'Arabic Manuscript Page from Al-Khwarizmi’s Kitab al-Jabr (Algebra)',
    },
    lesson_4: {
      cardImage: '/units/ks2_early_islamic_baghdad/assets/wasiti_camel_caravan_silk_road.jpg',
      heroCameo: '/units/ks2_early_islamic_baghdad/assets/abbasid_silver_dirham_coin.jpg',
      cameoAlt: 'Abbasid Silver Dirham Trade Coin Found Across Silk & Viking Routes',
    },
    lesson_5: {
      cardImage: '/units/ks2_early_islamic_baghdad/assets/islamic_geometric_star_tilework.jpg',
      heroCameo: '/units/ks2_early_islamic_baghdad/assets/gilded_enameled_mosque_lamp_met.jpg',
      cameoAlt: 'Gilded and Enamelled Islamic Glass Mosque Lamp',
    },
    lesson_6: {
      cardImage: '/units/ks2_early_islamic_baghdad/assets/hulagu_mongol_siege_baghdad_1258.jpg',
    },
  },

  ks2_maya_civilisation: {
    lesson_1: {
      cardImage: '/units/ks2_maya_civilisation/assets/tikal_pyramids_above_rainforest.jpg',
    },
    lesson_2: {
      cardImage: '/units/ks2_maya_civilisation/assets/tikal_temple_of_the_great_jaguar.jpg',
      heroCameo: '/units/ks2_maya_civilisation/assets/king_pakal_jade_funerary_mask.jpg',
      cameoAlt: 'Green Jade Mosaic Funerary Mask of King K’inich Janaab’ Pakal',
    },
    lesson_3: {
      cardImage: '/units/ks2_maya_civilisation/assets/el_caracol_observatory_chichen_itza.jpg',
      heroCameo: '/units/ks2_maya_civilisation/assets/dresden_codex_bark_paper_numbers.jpg',
      cameoAlt: 'Painted Fig-Bark Page from the Maya Dresden Codex',
    },
    lesson_4: {
      cardImage: '/units/ks2_maya_civilisation/assets/copan_ballcourt_macaw_marker.jpg',
      heroCameo: '/units/ks2_maya_civilisation/assets/carved_maya_cacao_drinking_vase.jpg',
      cameoAlt: 'Classic Maya Cylinder Vase Used for Frothy Cacao Drinks',
    },
    lesson_5: {
      cardImage: '/units/ks2_maya_civilisation/assets/kukulkan_feathered_serpent_head.jpg',
      heroCameo: '/units/ks2_maya_civilisation/assets/palenque_terracotta_god_censer.jpg',
      cameoAlt: 'Tall Terracotta God-Effigy Incense Burner from Palenque',
    },
    lesson_6: {
      cardImage: '/units/ks2_maya_civilisation/assets/tulum_cliffside_coastal_maya_temple.jpg',
    },
  },

  // =========================================================================
  // KS3 Secondary Units — Iconic Focal Overrides Where Needed
  // =========================================================================
  medieval_england: {
    lesson_3: {
      cardImage: '/images/medieval_england/plate_3_2_henry_ii_penance_becket.jpg',
      heroCameo: '/images/medieval_england/plate_3_2_henry_ii_penance_becket.jpg',
      cameoAlt: "Henry II doing penance at Thomas Becket's shrine",
    },
    lesson_4: {
      cardImage: '/images/medieval_england/plate_4_2_king_john_runnymede.jpg',
      heroCameo: '/images/medieval_england/plate_4_2_king_john_runnymede.jpg',
      cameoAlt: 'King John granting Magna Carta at Runnymede (1215)',
    },
    lesson_5: {
      cardImage: '/images/medieval_england/source_d_richard_ii_meeting_rebels.jpg',
    },
  },

  monarchy_religion_power: {
    lesson_1: {
      cardImage: '/images/henry_viii.jpg',
      heroCameo: '/images/henry_viii.jpg',
      cameoAlt: 'King Henry VIII (after Hans Holbein the Younger)',
    },
    lesson_2: {
      cardImage: '/images/eee/iconic/elizabeth_i_coronation_portrait_npg_hires.jpg',
      heroCameo: '/images/eee/iconic/elizabeth_i_coronation_portrait_npg_hires.jpg',
      cameoAlt: 'Queen Elizabeth I in Coronation robes (1559)',
    },
    lesson_4: {
      cardImage: '/images/monarchy_religion_power/trial_charles_i_westminster_1649.jpg',
      heroCameo: '/images/oliver_cromwell.jpg',
      cameoAlt: 'Oliver Cromwell (1599–1658)',
    },
    lesson_5: {
      cardImage: '/images/william_mary_declaration_of_rights_1689.jpg',
    },
  },

  great_war: {
    lesson_1: {
      cardImage: "/images/great_war/gw1_l1_b1_bismarck_napoleon_iii_sedan_1870.jpg",
      heroCameo: "/images/great_war/gw1_l1_cameo_bismarck_lenbach.jpg",
      cameoAlt: "Prince Otto von Bismarck (1815–1898), Minister-President of Prussia and first Chancellor of the German Empire, wearing Halberstadt Cuirassier uniform (Franz von Lenbach, 1890)",
    },
    lesson_2: {
      cardImage: "/units/great_war/assets/sms_panther_agadir_1911.jpg",
      heroCameo: "/images/great_war/gw1_l2_cameo_kaiser_wilhelm_ii.jpg",
      cameoAlt: "Kaiser Wilhelm II (1859–1941), German Emperor who dismissed Bismarck in 1890 to pursue aggressive overseas Weltpolitik and \"a place in the sun\" (1902 portrait)",
    },
    lesson_3: {
      cardImage: "/images/hms_dreadnought_1906.jpg",
      heroCameo: "/images/great_war/gw1_l3_cameo_jackie_fisher.jpg",
      cameoAlt: "Admiral of the Fleet Sir John \"Jackie\" Fisher (1841–1920), First Sea Lord of the Royal Navy who championed HMS Dreadnought in 1906",
    },
    lesson_4: {
      cardImage: "/images/great_war/gw1_l4_b3_bosnian_crisis_1908_petit_journal.jpg",
      heroCameo: "/units/great_war/assets/alfred_von_schlieffen.jpg",
      cameoAlt: "Field Marshal Count Alfred von Schlieffen (1833–1913), Chief of the Imperial German General Staff (1891–1906) who devised the 1905 plan to knock out France via Belgium",
    },
    lesson_5: {
      cardImage: "/units/great_war/assets/sarajevo_assassination_beltrame_1914.jpg",
      heroCameo: "/images/great_war/gw1_l5_cameo_archduke_franz_ferdinand.jpg",
      cameoAlt: "Archduke Franz Ferdinand of Austria-Este (1863–1914), Heir Presumptive to the Austro-Hungarian throne whose assassination in Sarajevo ignited the July Crisis",
    },
    lesson_6: {
      cardImage: "/images/great_war/gw1_l6_b4_chain_of_friendship_1914.jpg",
      heroCameo: "/images/great_war/gw1_l6_cameo_tsar_nicholas_ii.jpg",
      cameoAlt: "Tsar Nicholas II of Russia (1868–1918), painted by Valentin Serov (1900, Tretyakov Gallery), whose 30 July 1914 general mobilisation order to defend Serbia triggered German war declarations",
    },
  },

  great_war_part2: {
    lesson_1_enlistment: {
      cardImage: "/images/great_war_part2/gw2_l1_b0_kitchener_wants_you_leete_1914.jpg",
      heroCameo: "/images/great_war_part2/gw2_l1_cameo_lord_kitchener_portrait.jpg",
      cameoAlt: "Field Marshal Horatio Herbert Kitchener, 1st Earl Kitchener (1850–1916), Secretary of State for War who foresaw a multi-year conflict and launched the August 1914 appeal for New Army volunteers",
    },
    lesson_2_trenches_haig: {
      cardImage: "/images/great_war_part2/gw2_l2_cameo_douglas_haig_portrait.jpg",
      heroCameo: "/images/great_war_part2/gw2_l2_cameo_douglas_haig_portrait.jpg",
      cameoAlt: "Field Marshal Sir Douglas Haig (1861–1928), Commander-in-Chief of the British Expeditionary Force on the Western Front from December 1915 to 1918 (Library of Congress Bain Collection)",
    },
    lesson_3_empire_troops: {
      cardImage: "/images/great_war_part2/gw2_l3_b1_indian_mg_crew_flanders_1914.jpg",
      heroCameo: "/images/great_war_part2/gw2_l3_cameo_maharaja_pratap_singh_1914.jpg",
      cameoAlt: "Lieutenant-General Maharaja Sir Pratap Singh of Idar (1845–1922), veteran seventy-year-old Rajput commander who served alongside the Indian Expeditionary Force in France and Flanders in 1914–1915",
    },
    lesson_4_home_front_dora: {
      cardImage: "/images/great_war_part2/gw2_l4_b3_forbes_the_munition_girls_1918.jpg",
      heroCameo: "/images/great_war_part2/gw2_l4_cameo_david_lloyd_george_portrait.jpg",
      cameoAlt: "David Lloyd George (1863–1945), appointed Britain’s first Minister of Munitions during the May 1915 Shell Crisis before serving as wartime Coalition Prime Minister from December 1916",
    },
    lesson_5_versailles: {
      cardImage: "/images/great_war_part2/gw2_l5_b0_compiegne_armistice_carriage_1918.jpg",
      heroCameo: "/images/great_war_part2/gw2_l5_cameo_georges_clemenceau_portrait.jpg",
      cameoAlt: "French Prime Minister Georges Clemenceau (“The Tiger”, 1841–1929), President of the 1919 Paris Peace Conference who demanded French border security and heavy German reparations (Agence Rol, BnF Gallica)",
    },
  },

  first_british_empire: {
    lesson_1: {
      cardImage: "/images/ks3_fbe/fbe_l1_card_clive_mir_jafar_plassey_hayman.jpg",
      heroCameo: "/images/ks3_fbe/fbe_l1_cameo_emperor_jahangir_bichitr.jpg",
      cameoAlt: "Mughal Emperor Jahangir (r. 1605–1627) enthroned atop an allegorical hourglass before a golden solar halo while King James I of England waits among tributary rulers below (painted by imperial artist Bichitr, c. 1615–1618, Freer Gallery of Art)",
    },
    lesson_2: {
      cardImage: "/images/ks3_fbe/fbe_l2_card_turner_slave_ship_1840.jpg",
      heroCameo: "/images/ks3_fbe/fbe_l2_cameo_granville_sharp_portrait.jpg",
      cameoAlt: "Profile portrait engraving of British abolitionist campaigner Granville Sharp (1735–1813), who fought chattel slavery in the English courts and exposed the 1781 Zong slave-ship massacre alongside Olaudah Equiano",
    },
    lesson_3: {
      cardImage: "/images/ks3_fbe/fbe_l3_card_maroon_pacification_brunias.jpg",
      heroCameo: "/images/ks3_fbe/fbe_l3_cameo_oliver_cromwell_cooper.jpg",
      cameoAlt: "Lord Protector Oliver Cromwell (1599–1658) in steel armour (after Samuel Cooper, 1656, National Portrait Gallery), whose 1655 Western Design expedition seized Jamaica from Spain and sparked Maroon mountain resistance",
    },
    lesson_4: {
      cardImage: "/images/ks3_fbe/fbe_l4_card_samuel_adams_copley_1772.jpg",
      heroCameo: "/images/king_george_iii.jpg",
      cameoAlt: "Coronation portrait of King George III (r. 1760–1820) in gold-embroidered robes and ermine mantle (Allan Ramsay, 1762), whose ministers sought to tax the Thirteen Colonies after the Seven Years’ War",
    },
    lesson_5: {
      cardImage: "/images/ks3_fbe/fbe_l5_card_treaty_of_paris_commissioners_west_1783.jpg",
      heroCameo: "/images/ks3_fbe/fbe_l5_cameo_george_washington_stuart.jpg",
      cameoAlt: "General George Washington (1732–1799), Commander-in-Chief of the Continental Army who besieged British forces at Yorktown in 1781 and became first President of the United States (Gilbert Stuart, 1796)",
    },
  },

  industrialisation_and_empire: {
    lesson_1: {
      cardImage: "/images/ks3_ind/ind_l1_card_wright_iron_forge_1772.jpg",
      heroCameo: "/images/ks3_ind/ind_l1_cameo_matthew_boulton_beechey.jpg",
      cameoAlt: "Matthew Boulton FRS (1728–1809), Birmingham industrialist and Soho Manufactory partner of James Watt who commercialised rotary steam power across Britain (engraved by William Sharp after Sir William Beechey, 1801, Wellcome Collection V0006455)",
    },
    lesson_2: {
      cardImage: "/images/ks3_ind/ind_l2_card_dinner_hour_wigan_1874.jpg",
      heroCameo: "/images/ks3_ind/ind_l2_cameo_sir_richard_arkwright.jpg",
      cameoAlt: "Sir Richard Arkwright (1732–1792), pioneer of the regimented mechanized cotton-mill factory system at Cromford, painted by Joseph Wright of Derby (c. 1790)",
    },
    lesson_3: {
      cardImage: "/images/ks3_ind/ind_l3_card_abbey_mills_pumping_station.jpg",
      heroCameo: "/images/ks3_ind/ind_l3_cameo_john_snow_1856.jpg",
      cameoAlt: "Dr John Snow (1813–1858), London physician whose 1854 Soho Broad Street water-pump investigation proved that cholera spread through sewage-contaminated water rather than foul-smelling miasma (1856 portrait, Wellcome Collection M0009238)",
    },
    lesson_4: {
      cardImage: "/images/ks3_ind/ind_l4_b4_tolpuddle_six_cottages.jpg",
      heroCameo: "/images/ks3_ind/ind_l4_cameo_henry_hunt_cup_1819.jpg",
      cameoAlt: "1819 Staffordshire lustreware portrait cup of radical speaker Henry \"Orator\" Hunt (1773–1835) inscribed \"HUNT AND LIBERTY\", made to commemorate his arrest on the hustings at the Peterloo Massacre (British Museum)",
    },
    lesson_5: {
      cardImage: "/images/ks3_ind/ind_l5_card_old_sarum_constable.jpg",
      heroCameo: "/images/ks3_ind/ind_l5_cameo_feargus_oconnor_1847.jpg",
      cameoAlt: "Feargus O’Connor MP (1796–1855), charismatic Chartist orator, founder of the Northern Star newspaper, and organiser of the April 1848 Kennington Common mass rally",
    },
  },

  australia: {
    lesson_1: {
      cardImage: "/images/ks3_aus/aus_l1_card_endeavour_bark_new_holland.jpg",
      heroCameo: "/images/ks3_aus/aus_l1_cameo_sir_joseph_banks_portrait.jpg",
      cameoAlt: "Sir Joseph Banks (1743–1820), Royal Society naturalist aboard HMS Endeavour at Botany Bay in 1770 who later urged Parliament to establish a convict colony in New South Wales (engraved by Niccolò Schiavonetti after Thomas Phillips RA, 1812)",
    },
    lesson_2: {
      cardImage: "/images/ks3_aus/aus_l2_card_founding_australia_sydney_cove_1788.jpg",
      heroCameo: "/images/ks3_aus/aus_l2_cameo_arthur_phillip_wheatley_1786.jpg",
      cameoAlt: "Captain Arthur Phillip RN (1738–1814), commander of the 1787–1788 First Fleet and first Governor of New South Wales, holding a 1787 plan of the colony (oil portrait by Francis Wheatley, 1786, State Library of New South Wales ML 124)",
    },
    lesson_3: {
      cardImage: "/images/ks3_aus/aus_l3_card_taking_bennelong_colbee_1789.jpg",
      heroCameo: "/images/ks3_aus/aus_l3_cameo_governor_philip_gidley_king.jpg",
      cameoAlt: "Governor Philip Gidley King RN (1758–1808), third Governor of New South Wales who issued the May 1801 government proclamation outlawing Bidjigal resistance leader Pemulwuy during the Hawkesbury Frontier War (State Library of New South Wales)",
    },
    lesson_4: {
      cardImage: "/images/ks3_aus/aus_l4_card_ouse_river_tasmania_glover_1838.jpg",
      heroCameo: "/images/ks3_aus/aus_l4_cameo_woureddy_duterrau_1834.jpg",
      cameoAlt: "Woureddy (d. 1842), senior Nuennonne (Palawa) warrior, storyteller, and husband of Truganini who survived Tasmania's Black War before forced exile to Wybalenna on Flinders Island (oil portrait by Benjamin Duterrau, 1834, British Museum Oc2006,Ptg.22)",
    },
    lesson_5: {
      cardImage: "/images/ks3_aus/aus_l5_card_forest_creek_diggings_gill_1852.jpg",
      heroCameo: "/images/ks3_aus/aus_l5_cameo_peter_lalor_portrait.jpg",
      cameoAlt: "Peter Lalor (1827–1889), Irish-born Ballarat miner elected leader of the 1854 Eureka Stockade rebellion who lost his left arm in the fighting before winning election to the Victorian Parliament in 1855 (portrait after Ludwig Becker, 1856)",
    },
  },

  second_british_empire: {
    lesson_1: {
      cardImage: "/images/ks3_sbe/sbe_l1_card_hms_victory_portsmouth.jpg",
      heroCameo: "/images/ks3_sbe/sbe_l1_cameo_horatio_nelson_abbott.jpg",
      cameoAlt: "Vice-Admiral Horatio, Lord Nelson (1758–1805), painted by Lemuel Francis Abbott (1797, National Portrait Gallery NPG 394), whose 1805 victory at Cape Trafalgar secured a century of Royal Navy ocean mastery",
    },
    lesson_2: {
      cardImage: "/images/east_india_house.jpg",
      heroCameo: "/images/ks3_sbe/sbe_l2_cameo_robert_clive_dance.jpg",
      cameoAlt: "Robert Clive, 1st Baron Clive (1725–1774), painted by Nathaniel Dance (National Portrait Gallery NPG 39), who secured the 1765 Bengal Diwani giving the East India Company sovereign tax-collecting power",
    },
    lesson_3: {
      cardImage: "/images/ks3_sbe/sbe_l3_card_cashmere_gate_delhi_1858.jpg",
      heroCameo: "/images/ks3_sbe/sbe_l3_cameo_rani_lakshmibai_equestrian.jpg",
      cameoAlt: "Contemporary Indian equestrian gouache painting of Rani Lakshmibai of Jhansi (1828–1858) armed on a rearing white charger (c. 1860), celebrated commander of the 1857–1858 Indian Rebellion",
    },
    lesson_4: {
      cardImage: "/images/ks3_sbe/sbe_l4_card_battle_of_isandlwana_fripp.jpg",
      heroCameo: "/images/ks3_sbe/sbe_l4_cameo_cecil_rhodes_portrait.jpg",
      cameoAlt: "Cecil John Rhodes (1853–1902), De Beers diamond financier, founder of the Chartered British South Africa Company, and Prime Minister of the Cape Colony who championed 'Cape to Cairo' imperial expansion",
    },
    lesson_5: {
      cardImage: "/images/ks3_sbe/sbe_l5_card_rhodes_colossus_1892.jpg",
      heroCameo: "/images/ks3_sbe/sbe_l5_cameo_lord_curzon_viceroy.jpg",
      cameoAlt: "George Nathaniel Curzon, 1st Marquess Curzon of Kedleston (1859–1925), Viceroy of India from 1899 to 1905 in ceremonial Star of India robes, chief defender of Britain’s imperial 'civilising' mission (Library of Congress)",
    },
  },

  the_shoah: {
    lesson_1: {
      cardImage: "/images/upgraded/ks3-modern/shoah_l1_block1_tarbut_school_poland_1933.jpg",
      heroCameo: "/images/the_shoah/shoah_l1_cameo_albert_einstein_1921.jpg",
      cameoAlt: "German-Jewish physicist and 1921 Nobel Prize laureate Professor Albert Einstein (1879–1955) lecturing at a chalkboard in 1921 (photographed by Ferdinand Schmutzer), exemplifying Jewish scientific and cultural contributions in Central Europe before 1933",
    },
    lesson_2: {
      cardImage: "/images/the_shoah/shoah_l2_b0_sa_boycott_shop_window_1933.jpg",
      heroCameo: "/images/the_shoah/shoah_l2_cameo_leo_baeck_bust.jpg",
      cameoAlt: "Bronze portrait bust of Rabbi Dr Leo Baeck (1873–1956), scholar and President of the Reichsvertretung der Deutschen Juden who led and defended Germany’s persecuted Jewish community from 1933 until his deportation to Theresienstadt",
    },
    lesson_3: {
      cardImage: "/images/the_shoah/shoah_l3_b3_krochmalna_street_warsaw_ghetto.jpg",
      heroCameo: "/images/the_shoah/shoah_l3_cameo_janusz_korczak.jpg",
      cameoAlt: "Polish-Jewish paediatrician, children’s author, and Warsaw Ghetto orphanage director Dr Janusz Korczak (Henryk Goldszmit, 1878–1942), who refused offers of personal escape in August 1942 so he would not abandon his 192 Jewish orphans on the deportation train to Treblinka",
    },
    lesson_4: {
      cardImage: "/images/the_shoah/shoah_l4_b2_babi_yar_clothes_haehle_1941.jpg",
      heroCameo: "/images/the_shoah/shoah_l4_cameo_benjamin_ferencz_nuremberg.jpg",
      cameoAlt: "Twenty-seven-year-old US Chief Prosecutor Benjamin B. Ferencz (1920–2023) at the Nuremberg Einsatzgruppen Trial (1947–1948), where captured SS daily tally reports convicted mobile killing squad commanders of murdering over one million civilians",
    },
    lesson_5: {
      cardImage: "/images/the_shoah/shoah_l5_b3_warsaw_ghetto_uprising_burning_1943.jpg",
      heroCameo: "/images/the_shoah/shoah_l5_cameo_marek_edelman.jpg",
      cameoAlt: "Marek Edelman (1919–2009), co-founder and surviving deputy commander of the Jewish Combat Organisation (ŻOB) during the April–May 1943 Warsaw Ghetto Uprising after commander Mordechai Anielewicz fell at Miła 18",
    },
    lesson_6: {
      cardImage: "/images/the_shoah/shoah_l6_b4_auschwitz_birkenau_aerial_1944_nara.jpg",
      heroCameo: "/images/the_shoah/shoah_l6_cameo_raoul_wallenberg.jpg",
      cameoAlt: "Swedish diplomat Raoul Wallenberg (1912–c. 1947) at his desk in 1944, who issued thousands of protective Swedish Schutz-Pass documents and established safe houses in Budapest to rescue tens of thousands of Hungarian Jews",
    },
    lesson_7: {
      cardImage: "/images/the_shoah/shoah_l7_b2_bergen_belsen_dp_camp_1946.jpg",
      heroCameo: "/images/the_shoah/shoah_l7_cameo_robert_jackson_nuremberg.jpg",
      cameoAlt: "United States Supreme Court Justice and Chief Prosecutor Robert H. Jackson (1892–1954) addressing the International Military Tribunal from the podium in Courtroom 600 at Nuremberg (November 1945)",
    },
  },

  cold_war: {
    lesson_1: {
      cardImage: "/images/gcse_cold_war/tehran_conference_1943.jpg",
      heroCameo: "/images/ks3_cold_war/cw_l1_cameo_stalin_portrait_1942.jpg",
      cameoAlt: "Soviet Premier Joseph Stalin (1878–1953) seated at his Kremlin desk in tunic and riding boots (c. 1942, U.S. Office of War Information / Library of Congress)",
    },
    lesson_2: {
      cardImage: "/images/gcse_cold_war/kt1/cw_l1_banner_cecilienhof_potsdam.jpg",
      heroCameo: "/images/ks3_cold_war/cw_l2_cameo_truman_portrait_1945.jpg",
      cameoAlt: "U.S. President Harry S. Truman (1884–1972), who succeeded Franklin D. Roosevelt in April 1945 and confronted Joseph Stalin at the July 1945 Potsdam Conference",
    },
    lesson_3: {
      cardImage: "/images/ks3_cold_war/cw_l3_b4_eisenhower_shape_nato_nara.jpg",
      heroCameo: "/images/gcse_cold_war/kt1/cw_l2_iconic_truman_churchill_fulton_1946.jpg",
      cameoAlt: "Winston Churchill flashing his V-for-Victory sign beside President Harry S. Truman aboard the special train to Fulton, Missouri before delivering the \"Iron Curtain\" speech (March 1946, NARA)",
    },
    lesson_4: {
      cardImage: "/images/gcse_cold_war/kt2/cw_l6_banner_us_navy_quarantine_1962.jpg",
      heroCameo: "/images/ks3_cold_war/cw_l4_cameo_jfk_white_house_portrait_1963.jpg",
      cameoAlt: "U.S. President John F. Kennedy (1917–1963), whose naval quarantine and secret back-channel diplomacy steered the October 1962 Cuban Missile Crisis away from nuclear war (Cecil Stoughton, White House)",
    },
    lesson_5: {
      cardImage: "/images/usa/kt3/usa_l11_b3_ranch_hand_c123_agent_orange_run.jpg",
      heroCameo: "/units/usa/assets/sources/portraits/ho_chi_minh.jpg",
      cameoAlt: "Vietnamese revolutionary and North Vietnamese President Ho Chi Minh (1890–1969), who led communist independence struggles against French colonial rule and American containment",
    },
    lesson_6: {
      cardImage: "/images/gcse_cold_war/kt3/cw_l12_banner_brandenburg_gate_wall_1989.jpg",
      heroCameo: "/images/ks3_cold_war/cw_l6_s4_gorbachev_white_house_1987.jpg",
      cameoAlt: "Soviet General Secretary Mikhail Gorbachev (1931–2022), whose Glasnost, Perestroika, and refusal to use Red Army tanks in 1989 peacefully ended the Cold War (White House Photo Office)",
    },
    lesson_7: {
      cardImage: "/images/gcse_cold_war/kt3/cw_l9_b2_apollo_soyuz_docked_1975.jpg",
      heroCameo: "/images/ks3_cold_war/cw_l7_cameo_yuri_gagarin_1961.jpg",
      cameoAlt: "Soviet Air Force cosmonaut Major Yuri Gagarin (1934–1968), who became the first human in space aboard Vostok 1 on 12 April 1961 at the height of the superpower Space Race",
    },
  },

  post_war_britain: {
    lesson_1: {
      cardImage: "/images/post_war_britain/canary_girls_chilwell_1917.jpg",
      heroCameo: "/images/post_war_britain/pwb_l1_cameo_emmeline_pankhurst_1913.jpg",
      cameoAlt: "Emmeline Pankhurst (1858–1928), founder of the Women’s Social and Political Union (WSPU), photographed in November 1913 during her 'Freedom or Death' speaking tour (Library of Congress)",
    },
    lesson_2: {
      cardImage: "/images/bevan_first_day_nhs_1948.jpg",
      heroCameo: "/images/post_war_britain/pwb_l2_cameo_aneurin_bevan_1952_nlw.jpg",
      cameoAlt: "Aneurin 'Nye' Bevan (1897–1960), Minister of Health from 1945 to 1951 and founder of the National Health Service, addressing a rally at a microphone in 1952 (Geoff Charles Collection, National Library of Wales)",
    },
    lesson_3: {
      cardImage: "/images/empire_windrush_1948.jpg",
      heroCameo: "/images/upgraded/ks3-modern/pwb_l3_block4_claudia_jones_1948.jpg",
      cameoAlt: "Claudia Jones (1915–1964), Trinidadian-born journalist and civil rights pioneer who founded the West Indian Gazette in Brixton (1958) and launched London’s first Caribbean Carnival in January 1959 (Library of Congress)",
    },
    lesson_4: {
      cardImage: "/images/bristol_bus_boycott_mural.jpg",
      heroCameo: "/images/post_war_britain/harold_wilson_1967.jpg",
      cameoAlt: "Prime Minister Harold Wilson (1916–1995), who publicly backed the 1963 Bristol Bus Boycott as Opposition Leader before enacting Britain’s first Race Relations Acts in 1965 and 1968 (Nationaal Archief)",
    },
    lesson_5: {
      cardImage: "/images/post_war_britain/aldermaston_cnd_demo.jpg",
      heroCameo: "/images/post_war_britain/pwb_l5_cameo_bertrand_russell_1950.jpg",
      cameoAlt: "Philosopher and Nobel laureate Bertrand Russell (1872–1970), co-author of the 1955 Russell–Einstein Manifesto and founding president of the Campaign for Nuclear Disarmament in 1958 (Rijksmuseum)",
    },
  },

  // =========================================================================
  // GCSE: Medicine, USA, Weimar & Nazi Germany, Cold War, Middle East
  // =========================================================================
  edexcel_medicine: {
    lesson_1_1: {
      cardImage: "/images/medieval_church_interior.jpg",
      heroCameo: "/images/edexcel_medicine/kt12/med_l1_1_cameo_roger_bacon_wellcome.jpg",
      cameoAlt: "Franciscan friar and Oxford scholar Roger Bacon (c.1219–c.1292), imprisoned after urging direct experimental observation over blind obedience to ancient authority (Wellcome Collection M0004257)",
    },
    lesson_1_2: {
      cardImage: "/images/edexcel_medicine/kt12/med_l1_2_b0_hippocrates_portrait_wellcome.jpg",
      heroCameo: "/images/edexcel_medicine/kt12/med_l1_2_cameo_avicenna_wellcome.jpg",
      cameoAlt: "Persian polymath Avicenna (Ibn Sina, 980–1037), author of The Canon of Medicine, whose systematic synthesis of Hippocratic and Galenic humoralism anchored medieval European university curricula (Wellcome Collection M0000768)",
    },
    lesson_1_3: {
      cardImage: "/images/upgraded/gcse-med-eee/med_l1_3_preparation_of_theriac_wellcome.jpg",
      heroCameo: "/images/edexcel_medicine/kt12/med_l1_3_cameo_dioscorides_mandrake_wellcome.jpg",
      cameoAlt: "Greek physician-botanist Pedanius Dioscorides compiling De Materia Medica while an assistant holds a mandrake root (Oil painting by Ernest Board, Wellcome Collection L0068371)",
    },
    lesson_1_4: {
      cardImage: "/images/upgraded/gcse-med-eee/med_l1_4_hotel_dieu_paris_nuns.jpg",
      heroCameo: "/images/edexcel_medicine/kt12/med_l1_4_cameo_ellesmere_physician.jpg",
      cameoAlt: "Geoffrey Chaucer’s university-trained \"Doctour of Phisik\" in scarlet robes holding up a glass uroscopy matula flask on horseback (Ellesmere Chaucer Manuscript, c.1400–1410, Huntington Library EL 26 C 9, f. 133r)",
    },
    lesson_1_5: {
      cardImage: "/images/edexcel_medicine/kt12/med_l1_5_b4_tournai_plague_coffin_burial_1349.jpg",
      heroCameo: "/images/edexcel_medicine/kt12/med_l1_5_cameo_king_edward_iii_npg.jpg",
      cameoAlt: "King Edward III of England (r. 1327–1377), who issued the April 1349 London street-cleansing writ against corrupt miasma and the 1349 Ordinance of Labourers (National Portrait Gallery NPG 4980)",
    },
    lesson_2_1: {
      cardImage: "/images/renaissance_printing_house_stradanus.jpg",
      heroCameo: "/images/edexcel_medicine/kt12/med_l2_1_cameo_robert_boyle_shannon.jpg",
      cameoAlt: "Experimental chemist Robert Boyle (1627–1691), founding Fellow of the Royal Society of London chartered in 1662 under the empirical motto Nullius in verba (Shannon Portrait by Johann Kerseboom, 1689)",
    },
    lesson_2_2: {
      cardImage: "/images/edexcel_medicine/kt12/med_l2_2_b0_thomas_sydenham_mary_beale.jpg",
      heroCameo: "/images/edexcel_medicine/kt12/med_l2_2_cameo_john_locke_kneller.jpg",
      cameoAlt: "Physician and empiricist philosopher John Locke (1632–1704), close clinical collaborator who accompanied Dr Thomas Sydenham on London bedside rounds during smallpox and fever epidemics (Portrait by Sir Godfrey Kneller, NPG 3912)",
    },
    lesson_2_3: {
      cardImage: "/images/edexcel_medicine/kt12/med_l2_3_b1_vesalius_third_muscle_man_wellcome.jpg",
      heroCameo: "/images/edexcel_medicine/kt12/med_l2_3_cameo_emperor_charles_v_titian.jpg",
      cameoAlt: "Holy Roman Emperor Charles V (1500–1558), to whom Andreas Vesalius dedicated De Humani Corporis Fabrica in 1543 before serving as his Imperial Physician from 1544 (Portrait by Titian, Museo di Capodimonte)",
    },
    lesson_2_4: {
      cardImage: "/images/harvey_demonstrating_heart.jpg",
      heroCameo: "/images/edexcel_medicine/kt12/med_l2_4_cameo_girolamo_fabricius_wellcome.jpg",
      cameoAlt: "Professor Girolamo Fabricius of Acquapendente (1533–1619), Paduan anatomist who taught William Harvey and published the discovery of one-way venous valves in 1603 (Wellcome Collection V0001828)",
    },
    lesson_2_5: {
      cardImage: "/images/plague_in_london_1665_wellcome.jpg",
      heroCameo: "/images/edexcel_medicine/kt12/med_l2_5_cameo_samuel_pepys_hayls_1666.jpg",
      cameoAlt: "Naval administrator and eyewitness diarist Samuel Pepys (1633–1703), whose 1665 diary vividly recorded red-crossed houses, deserted streets, and soaring weekly plague mortality in London (Oil portrait by John Hayls, 1666, NPG 211)",
    },
    lesson_3_1: {
      cardImage: "/images/pasteur_actual_flask.jpg",
      heroCameo: "/images/edexcel_medicine/kt3/med_kt3_l1_cameo_louis_pasteur.jpg",
      cameoAlt: "Studio portrait photograph of French chemist and microbiologist Louis Pasteur (1822–1895) by Paul Nadar, whose 1861 Germ Theory overturned spontaneous generation",
    },
    lesson_3_2: {
      cardImage: "/images/jenner_vaccinating_phipps.jpg",
      heroCameo: "/images/edexcel_medicine/kt3/med_kt3_l2_cameo_edward_jenner.jpg",
      cameoAlt: "Portrait of Dr Edward Jenner FRS (1749–1823) after James Northcote (1803, Wellcome Collection M0009130), seated beside an open plate of a cow and his treatise on vaccine inoculation",
    },
    lesson_3_3: {
      cardImage: "/images/edexcel_medicine/kt3/med_kt3_l3_b1_scutari_ward_simpson.jpg",
      heroCameo: "/images/edexcel_medicine/kt3/med_kt3_l3_cameo_florence_nightingale.jpg",
      cameoAlt: "Three-quarter-length studio portrait photograph of Florence Nightingale (1820–1910) in lace cap and dark dress taken by Henry Hering in London c. 1858 after her return from the Crimean War",
    },
    lesson_3_4: {
      cardImage: "/images/lister_carbolic_spray_apparatus.jpg",
      heroCameo: "/images/edexcel_medicine/kt3/med_kt3_l4_cameo_joseph_lister.jpg",
      cameoAlt: "Engraved portrait of pioneering antiseptic surgeon Joseph Lister, 1st Baron Lister (1827–1912), who introduced carbolic acid wound antisepsis in 1865 after reading Pasteur’s Germ Theory",
    },
    lesson_3_5: {
      cardImage: "/images/edexcel_medicine/kt3/med_kt3_l5_b3_bazalgette_old_ford_sewers.jpg",
      heroCameo: "/images/edexcel_medicine/kt3/med_kt3_l5_cameo_john_snow_1856.jpg",
      cameoAlt: "Seated studio portrait photograph of Soho physician and epidemiologist Dr John Snow (1813–1858) taken in 1856, two years after he traced the Broad Street cholera outbreak to contaminated pump water",
    },
    lesson_4_1: {
      cardImage: "/images/edexcel_medicine/kt4/med_kt4_1_cameo_francis_crick_wellcome.jpg",
      heroCameo: "/images/edexcel_medicine/kt4/med_kt4_1_cameo_francis_crick_wellcome.jpg",
      cameoAlt: "Molecular biologist Francis Crick (1916–2004) lecturing at a podium at the University of Cambridge, where he and James Watson deduced the double-helix structure of DNA in 1953 using Rosalind Franklin’s X-ray diffraction data (Wellcome Collection L0042633)",
    },
    lesson_4_2: {
      cardImage: "/images/edexcel_medicine/kt4/med_kt4_2_cameo_wilhelm_roentgen.jpg",
      heroCameo: "/images/edexcel_medicine/kt4/med_kt4_2_cameo_wilhelm_roentgen.jpg",
      cameoAlt: "Studio portrait of German physicist Wilhelm Conrad Röntgen (1845–1923), whose November 1895 discovery of X-rays launched non-invasive internal medical diagnosis (Erwin Hanfstaengl, Frankfurt)",
    },
    lesson_4_3: {
      cardImage: "/images/bevan_first_day_nhs_1948.jpg",
      heroCameo: "/images/edexcel_medicine/kt4/med_kt4_3_cameo_william_beveridge_1943_iwm.jpg",
      cameoAlt: "Economist Sir William Beveridge (1879–1963) in his study at University College, Oxford in 1943 in front of David Low’s cartoon celebrating the November 1942 Beveridge Report (Imperial War Museums D 17134)",
    },
    lesson_4_4: {
      cardImage: "/images/edexcel_medicine/kt4/med_kt4_4_cameo_howard_florey_1960.jpg",
      heroCameo: "/images/edexcel_medicine/kt4/med_kt4_4_cameo_howard_florey_1960.jpg",
      cameoAlt: "Australian pathologist Professor Sir Howard Florey (1898–1968), who led the Oxford team with Ernst Chain and Norman Heatley that purified penicillin and secured US wartime mass production (National Library of Australia)",
    },
    lesson_4_5: {
      cardImage: "/images/edexcel_medicine/kt4/med_kt4_5_cameo_sir_richard_doll_nlm.jpg",
      heroCameo: "/images/edexcel_medicine/kt4/med_kt4_5_cameo_sir_richard_doll_nlm.jpg",
      cameoAlt: "British epidemiologist Sir Richard Doll (1912–2005, centre) with his wife Dr Joan Faulkner and daughter at Green College, Oxford; with Austin Bradford Hill in 1950, Doll proved the link between cigarette smoking and lung cancer (National Cancer Institute / NIH ID 8174)",
    },
    lesson_5_1: {
      cardImage: "/images/med_stage_trench_stretcher_bottleneck.jpg",
      heroCameo: "/images/edexcel_medicine/kt5/med_kt5_l51_cameo_ypres_cloth_hall.jpg",
      cameoAlt: "Shell-shattered Gothic belfry and arcade of the medieval Cloth Hall at Ypres (c. 1915, Canadian Expeditionary Force Archive), focal landmark of the Ypres Salient",
    },
    lesson_5_2: {
      cardImage: "/images/divisional_baths_delousing.jpg",
      heroCameo: "/images/edexcel_medicine/kt5/med_kt5_l52_cameo_noel_chavasse_q67309.jpg",
      cameoAlt: "Captain Noel Godfrey Chavasse VC and Bar, MC (1884–1917), Royal Army Medical Corps Medical Officer to the 1/10th King’s (Liverpool Scottish), the only man awarded two Victoria Crosses in the First World War (IWM Q 67309)",
    },
    lesson_5_3: {
      cardImage: "/images/edexcel_medicine/kt5/med_kt5_l53_b4_55th_div_gas_casualties_q11586.jpg",
      heroCameo: "/images/edexcel_medicine/kt5/med_kt5_l53_cameo_edward_harrison_1916.jpg",
      cameoAlt: "Lieutenant-Colonel Edward Frank Harrison (1869–1918), RAMC chemist who led the development of the life-saving British Small Box Respirator in 1916",
    },
    lesson_5_4: {
      cardImage: "/images/source_b_ambulance_somme_1916.jpg",
      heroCameo: "/images/edexcel_medicine/kt5/med_kt5_l54_cameo_fany_drivers_1917.jpg",
      cameoAlt: "Volunteer women ambulance drivers of the First Aid Nursing Yeomanry (FANY) in winter fur coats beside their motor ambulance convoy in northern France (January 1917, IWM)",
    },
    lesson_5_5: {
      cardImage: "/images/thomas_splint_authentic.jpg",
      heroCameo: "/images/edexcel_medicine/kt5/med_kt5_l55_cameo_hugh_owen_thomas_l0018018.jpg",
      cameoAlt: "Liverpool orthopaedic pioneer Hugh Owen Thomas (1834–1891), inventor of the traction splint introduced to the Western Front by his nephew Sir Robert Jones in December 1915 (Wellcome Collection)",
    },
    lesson_5_6: {
      cardImage: "/images/med_stage_cushing_neurosurgery.jpg",
      heroCameo: "/images/edexcel_medicine/kt5/med_kt5_l56_cameo_harold_gillies_v0011539.jpg",
      cameoAlt: "Major Sir Harold Delf Gillies (1882–1960) in surgical gown, cap, and rubber gloves, pioneer of the tubed pedicle skin graft at The Queen’s Hospital, Sidcup (Wellcome Collection)",
    },
  },

  usa: {
    lesson_1_1: {
      cardImage: "/images/usa/kt1/usa_l01_b1_colored_water_cooler_oklahoma_1939.jpg",
      heroCameo: "/images/usa/kt1/usa_l01_cameo_a_philip_randolph_1942.jpg",
      cameoAlt: "A. Philip Randolph (1889–1979), trade unionist and civil rights strategist whose pressure helped secure Executive Order 9981 desegregating the U.S. Armed Forces (photographed by Gordon Parks, 1942, Library of Congress)",
    },
    lesson_1_2: {
      cardImage: "/images/usa/kt1/usa_l02_s3_elizabeth_eckford_central_high_1957.jpg",
      heroCameo: "/images/usa/kt1/usa_l02_cameo_linda_brown_loc.jpg",
      cameoAlt: "Linda Brown (later Linda Brown Smith), whose exclusion from Topeka’s Sumner Elementary School anchored the landmark Brown v. Board of Education class-action lawsuit (Library of Congress)",
    },
    lesson_1_3: {
      cardImage: "/images/usa/kt1/usa_l03_cameo_rosa_parks_1956_loc.jpg",
      heroCameo: "/images/usa/kt1/usa_l03_cameo_rosa_parks_1956_loc.jpg",
      cameoAlt: "Rosa Parks (1913–2005), Montgomery NAACP branch secretary whose refusal to surrender her bus seat on 1 December 1955 sparked the 381-day Montgomery Bus Boycott (November 1956, Library of Congress)",
    },
    lesson_1_4: {
      cardImage: "/images/usa/kt1/usa_l04_b4_eisenhower_signing_1957_civil_rights_act.jpg",
      heroCameo: "/images/usa/kt1/usa_l04_cameo_strom_thurmond_1961_loc.jpg",
      cameoAlt: "Senator Strom Thurmond of South Carolina, co-drafter of the 1956 Southern Manifesto who staged a 24-hour-18-minute Senate filibuster against the Civil Rights Act of 1957 (Library of Congress)",
    },
    lesson_2_1: {
      cardImage: "/images/usa/kt2/usa_l2_1_cameo_john_lewis_1964.jpg",
      heroCameo: "/images/usa/kt2/usa_l2_1_cameo_john_lewis_1964.jpg",
      cameoAlt: "SNCC Chairman and original May 1961 Freedom Rider John Lewis speaking at a press conference (16 April 1964, Library of Congress)",
    },
    lesson_2_2: {
      cardImage: "/images/usa/kt2/usa_l2_2_cameo_lbj_mlk_capitol_1965.jpg",
      heroCameo: "/images/usa/kt2/usa_l2_2_cameo_lbj_mlk_capitol_1965.jpg",
      cameoAlt: "President Lyndon B. Johnson shaking hands with Dr Martin Luther King Jr. alongside Rev. Ralph Abernathy, Coretta Scott King, and Rosa Parks at the U.S. Capitol after signing the Voting Rights Act (6 August 1965)",
    },
    lesson_2_3: {
      cardImage: "/images/usa/kt2/usa_l2_3_cameo_bobby_seale_panthers.jpg",
      heroCameo: "/images/usa/kt2/usa_l2_3_cameo_bobby_seale_panthers.jpg",
      cameoAlt: "Bobby Seale, co-founder and Chairman of the Black Panther Party for Self-Defense, photographed in California",
    },
    lesson_2_4: {
      cardImage: "/images/usa/kt2/usa_l2_4_cameo_mlk_1968_portrait.jpg",
      heroCameo: "/images/usa/kt2/usa_l2_4_cameo_mlk_1968_portrait.jpg",
      cameoAlt: "Dr Martin Luther King Jr. speaking with right hand raised during his northern open-housing and economic justice campaigns (Library of Congress)",
    },
    lesson_3_1: {
      cardImage: "/images/usa/kt3/usa_l09_cameo_ngo_dinh_diem_1957.jpg",
      heroCameo: "/images/usa/kt3/usa_l09_cameo_ngo_dinh_diem_1957.jpg",
      cameoAlt: "South Vietnamese President Ngo Dinh Diem (1901–1963) during his official arrival in Washington, D.C. (8 May 1957, U.S. Air Force / NARA ARC 542189)",
    },
    lesson_3_2: {
      cardImage: "/images/usa/kt3/usa_l10_cameo_lbj_tonkin_midnight_address_1964.jpg",
      heroCameo: "/images/usa/kt3/usa_l10_cameo_lbj_tonkin_midnight_address_1964.jpg",
      cameoAlt: "President Lyndon B. Johnson at the White House podium delivering his televised late-night address to the nation on the Gulf of Tonkin incident (4 August 1964, LBJ Presidential Library)",
    },
    lesson_3_3: {
      cardImage: "/images/usa/kt3/usa_l11_cameo_westmoreland_1st_cav_vietnam.jpg",
      heroCameo: "/images/usa/kt3/usa_l11_cameo_westmoreland_1st_cav_vietnam.jpg",
      cameoAlt: "General William C. Westmoreland, Commander of U.S. Military Assistance Command, Vietnam (MACV), standing atop a jeep to address troopers of the 1st Cavalry Division (Airmobile) at LZ Hammond (6 December 1966)",
    },
    lesson_3_4: {
      cardImage: "/images/usa/kt3/usa_l12_cameo_richard_nixon_portrait_1969.jpg",
      heroCameo: "/images/usa/kt3/usa_l12_cameo_richard_nixon_portrait_1969.jpg",
      cameoAlt: "Official White House close-up portrait of President Richard M. Nixon (1969, White House Photo Office / National Archives)",
    },
    lesson_4_1: {
      cardImage: "/images/usa/kt4/usa_kt4_l13_cameo_muhammad_ali_1967.jpg",
      heroCameo: "/images/usa/kt4/usa_kt4_l13_cameo_muhammad_ali_1967.jpg",
      cameoAlt: "World heavyweight boxing champion Muhammad Ali in 1967, the year he refused Selective Service induction into the U.S. Army on religious and moral grounds",
    },
    lesson_4_2: {
      cardImage: "/images/usa/kt4/usa_kt4_l14_cameo_richard_nixon_1971.jpg",
      heroCameo: "/images/usa/kt4/usa_kt4_l14_cameo_richard_nixon_1971.jpg",
      cameoAlt: "Official White House portrait of President Richard M. Nixon (July 1971), architect of Vietnamization and the \"Silent Majority\" electoral coalition",
    },
    lesson_4_3: {
      cardImage: "/images/usa/kt4/usa_kt4_l15_cameo_henry_kissinger_1973.jpg",
      heroCameo: "/images/usa/kt4/usa_kt4_l15_cameo_henry_kissinger_1973.jpg",
      cameoAlt: "Official portrait of Dr Henry A. Kissinger (1973), National Security Advisor and Secretary of State who negotiated the January 1973 Paris Peace Accords with Le Duc Tho",
    },
    lesson_4_4: {
      cardImage: "/images/usa/kt4/usa_kt4_l16_cameo_creighton_abrams.jpg",
      heroCameo: "/images/usa/kt4/usa_kt4_l16_cameo_creighton_abrams.jpg",
      cameoAlt: "General Creighton W. Abrams (Commander, U.S. Military Assistance Command, Vietnam, 1968–1972), who oversaw the drawdown of U.S. ground forces and ARVN handover",
    },
  },

  weimar_nazi_germany: {
    lesson_1_1: {
      cardImage: "/images/weimar_assembly_1919.jpg",
      heroCameo: "/images/weimar_nazi_germany/kt1/wng_l01_cameo_friedrich_ebert.jpg",
      cameoAlt: "Reich President Friedrich Ebert (1871–1925), Social Democratic leader and first democratically elected President of the Weimar Republic",
    },
    lesson_1_2: {
      cardImage: "/images/upgraded/gcse-p3/weimar_l02_b4_hyperinflation_berlin_bread_1923.jpg",
      heroCameo: "/images/weimar_nazi_germany/kt1/wng_l02_cameo_walther_rathenau.jpg",
      cameoAlt: "Weimar Foreign Minister Walther Rathenau (1867–1922), assassinated in Berlin by far-right Organisation Consul gunmen in June 1922",
    },
    lesson_1_3: {
      cardImage: "/images/weimar_nazi_germany/kt1/wng_l03_b3_stresemann_geneva_league_1926.jpg",
      heroCameo: "/images/weimar_nazi_germany/kt1/wng_l03_cameo_gustav_stresemann.jpg",
      cameoAlt: "Chancellor and Foreign Minister Gustav Stresemann (1878–1929), Nobel Peace Prize laureate who stabilised Weimar currency and foreign relations",
    },
    lesson_1_4: {
      cardImage: "/images/weimar_nazi_germany/kt1/wng_l04_b2_bauhaus_dessau_gropius.jpg",
      heroCameo: "/images/weimar_nazi_germany/kt1/wng_l04_cameo_walter_gropius_1919.jpg",
      cameoAlt: "Architect Walter Gropius (1883–1969), founder of the modernist Bauhaus school of functionalist art and architecture in Weimar and Dessau",
    },
    lesson_2_1: {
      cardImage: "/images/weimar_nazi_germany/kt2/wng_l2_1_cameo_hitler_early_1923.jpg",
      heroCameo: "/images/weimar_nazi_germany/kt2/wng_l2_1_cameo_hitler_early_1923.jpg",
      cameoAlt: "Early Munich studio portrait of Adolf Hitler in civilian suit and collar pin as Chairman of the NSDAP (c. 1921–1923)",
    },
    lesson_2_2: {
      cardImage: "/images/weimar_nazi_germany/kt2/wng_l2_2_cameo_erich_ludendorff.jpg",
      heroCameo: "/images/weimar_nazi_germany/kt2/wng_l2_2_cameo_erich_ludendorff.jpg",
      cameoAlt: "General Erich Ludendorff wearing the Pour le Mérite, First World War commander and co-leader of the November 1923 Munich Putsch",
    },
    lesson_2_3: {
      cardImage: "/images/weimar_nazi_germany/kt2/wng_l2_3_cameo_heinrich_bruning_1931.jpg",
      heroCameo: "/images/weimar_nazi_germany/kt2/wng_l2_3_cameo_heinrich_bruning_1931.jpg",
      cameoAlt: "Centre Party Chancellor Heinrich Brüning (\"The Hunger Chancellor\", 1930–1932) reading press dispatches in 1931",
    },
    lesson_2_4: {
      cardImage: "/images/weimar_nazi_germany/kt2/wng_l2_4_cameo_paul_von_hindenburg.jpg",
      heroCameo: "/images/weimar_nazi_germany/kt2/wng_l2_4_cameo_paul_von_hindenburg.jpg",
      cameoAlt: "Reich President Paul von Hindenburg, photographed in civilian statesman’s attire during his Weimar presidency (1927)",
    },
    lesson_3_1: {
      cardImage: "/images/weimar_nazi_germany/kt3/wng_l9_iconic_potsdam_hitler_hindenburg_1933.jpg",
      heroCameo: "/images/weimar_nazi_germany/kt3/wng_l9_iconic_potsdam_hitler_hindenburg_1933.jpg",
      cameoAlt: "Chancellor Adolf Hitler bowing respectfully to Reich President Field Marshal Paul von Hindenburg on the Day of Potsdam (21 March 1933, Bundesarchiv Bild 183-S38324)",
    },
    lesson_3_2: {
      cardImage: "/images/weimar_nazi_germany/kt3/wng_l10_iconic_himmler_heydrich_1938.jpg",
      heroCameo: "/images/weimar_nazi_germany/kt3/wng_l10_iconic_himmler_heydrich_1938.jpg",
      cameoAlt: "Reichsführer-SS Heinrich Himmler (left) alongside SD and Gestapo Chief Reinhard Heydrich (right) in SS greatcoats (March 1938)",
    },
    lesson_3_3: {
      cardImage: "/images/weimar_nazi_germany/kt3/wng_l11_b0_hitler_goebbels_1934.jpg",
      heroCameo: "/images/weimar_nazi_germany/kt3/wng_l11_cameo_book_burning_opernplatz_1933.jpg",
      cameoAlt: "SA stormtroopers and nationalist university students marching past towering pyres of banned books on Berlin’s Opernplatz (10 May 1933)",
    },
    lesson_3_4: {
      cardImage: "/images/weimar_nazi_germany/kt3/wng_l12_b4_galen_monument_muenster.jpg",
      heroCameo: "/images/weimar_nazi_germany/kt3/wng_l12_cameo_confessing_church_red_card_1934.jpg",
      cameoAlt: "Confessing Church (Bekennende Kirche) Berlin-Dahlem membership declaration card signed by Pastor Martin Niemöller (19 July 1934)",
    },
    lesson_4_1: {
      cardImage: "/images/weimar_nazi_germany/kt4/wng_kt4_l13_cameo_mutter_und_kind_1934.jpg",
      heroCameo: "/images/weimar_nazi_germany/kt4/wng_kt4_l13_cameo_mutter_und_kind_1934.jpg",
      cameoAlt: "1934 NSV welfare poster by Werner Beucke ('Deutschland muß stärker werden — Spendet für Mutter und Kind') depicting an Aryan mother and young boy waving a swastika pennant",
    },
    lesson_4_2: {
      cardImage: "/images/weimar_nazi_germany/kt4/wng_kt4_l14_cameo_baldur_von_schirach_1937.jpg",
      heroCameo: "/images/weimar_nazi_germany/kt4/wng_kt4_l14_cameo_baldur_von_schirach_1937.jpg",
      cameoAlt: "Reich Youth Leader Baldur von Schirach seated beside Count Yoshinori Futara reviewing a Hitlerjugend rally in Bremen (1937)",
    },
    lesson_4_3: {
      cardImage: "/images/weimar_nazi_germany/kt4/wng_kt4_l15_cameo_robert_ley_1930s.jpg",
      heroCameo: "/images/weimar_nazi_germany/kt4/wng_kt4_l15_cameo_robert_ley_1930s.jpg",
      cameoAlt: "Dr Robert Ley, Reichsorganisationsleiter and head of the German Labour Front (Deutsche Arbeitsfront, DAF), in party uniform (1930s)",
    },
    lesson_4_4: {
      cardImage: "/images/weimar_nazi_germany/kt4/wng_kt4_l16_cameo_kindertransport_harwich_1938.jpg",
      heroCameo: "/images/weimar_nazi_germany/kt4/wng_kt4_l16_cameo_kindertransport_harwich_1938.jpg",
      cameoAlt: "Jewish refugee children from Germany arriving at Harwich docks in England aboard the first Kindertransport rescue ship (December 1938)",
    },
  },

  cme_new: {
    lesson_0: {
      cardImage: "/images/upgraded/gcse-cw-cme/cme_l0_cairo_conference_1921.jpg",
      heroCameo: "/images/upgraded/gcse-cw-cme/cme_l0_cairo_conference_1921.jpg",
      cameoAlt: "Winston Churchill, Gertrude Bell, and T. E. Lawrence mounted on camels before the Great Sphinx during the March 1921 Cairo Conference",
    },
    lesson_1: {
      cardImage: "/images/cme_new/kt1/cme_l1_iconic_ernest_bevin.jpg",
      heroCameo: "/images/cme_new/kt1/cme_l1_iconic_ernest_bevin.jpg",
      cameoAlt: "British Foreign Secretary Ernest Bevin (1945–51), who enforced Mandate refugee quotas before handing the Palestine question to the United Nations",
    },
    lesson_2: {
      cardImage: "/images/cme_bengurion_declaration_1948.jpg",
      heroCameo: "/images/cme_new/kt1/cme_l2_cameo_chaim_weizmann_1949.jpg",
      cameoAlt: "Dr Chaim Weizmann, veteran Zionist statesman and first President of the State of Israel (1949)",
    },
    lesson_3: {
      cardImage: "/images/cme_new/kt1/cme_l3_iconic_nasser_cairo_1956.jpg",
      heroCameo: "/images/cme_new/kt1/cme_l3_iconic_nasser_cairo_1956.jpg",
      cameoAlt: "Egyptian President Gamal Abdel Nasser cheered by vast crowds in Cairo after nationalising the Suez Canal Company (1 August 1956)",
    },
    lesson_4: {
      cardImage: "/images/cme_new/kt2/cme_l4_cameo_eshkol_rabin_1964_67.jpg",
      heroCameo: "/images/cme_new/kt2/cme_l4_cameo_eshkol_rabin_1964_67.jpg",
      cameoAlt: "Israeli Prime Minister and Defence Minister Levi Eshkol conferring with IDF Chief of Staff Yitzhak Rabin (October 1966)",
    },
    lesson_5: {
      cardImage: "/units/cme_new/assets/nasser_1958.jpg",
      heroCameo: "/images/cme_new/kt2/cme_l5_cameo_moshe_dayan_june_1967.jpg",
      cameoAlt: "Israeli Defence Minister Moshe Dayan buckling his combat helmet beside Central Command chief Major General Uzi Narkis during the Six-Day War (8 June 1967)",
    },
    lesson_6: {
      cardImage: "/images/cme_paratroopers_western_wall_1967.jpg",
      heroCameo: "/images/upgraded/gcse-cw-cme/cme_l6_rabin_mount_scopus_june_1967.jpg",
      cameoAlt: "IDF Chief of Staff Yitzhak Rabin delivering his landmark address at the Hebrew University amphitheatre on Mount Scopus, Jerusalem (June 1967)",
    },
    lesson_7: {
      cardImage: "/images/cme_munich_1972_balcony.jpg",
      heroCameo: "/images/cme_new/kt2/cme_l7_cameo_king_hussein_amman.jpg",
      cameoAlt: "King Hussein bin Talal of Jordan in military uniform addressing international journalists at a palace press conference in Amman",
    },
    lesson_8: {
      cardImage: "/images/cme_new/kt2/cme_l8_cameo_anwar_sadat_october_1973.jpg",
      heroCameo: "/images/cme_new/kt2/cme_l8_cameo_anwar_sadat_october_1973.jpg",
      cameoAlt: "Egyptian President Anwar Sadat in field uniform holding his marshal’s baton during the October 1973 Yom Kippur War",
    },
    lesson_9: {
      cardImage: "/units/cme_new/assets/camp_david_accords.png",
      heroCameo: "/images/cme_new/kt3/cme_l9_cameo_carter_sadat_begin_camp_david_1978.jpg",
      cameoAlt: "Israeli Prime Minister Menachem Begin, US President Jimmy Carter, and Egyptian President Anwar Sadat standing together outside Aspen Lodge at Camp David (7 September 1978)",
    },
    lesson_10: {
      cardImage: "/images/cme_new/kt3/cme_l10_iconic_lebanon_sea_evacuation_1982.jpg",
      heroCameo: "/images/cme_new/kt3/cme_l10_iconic_lebanon_sea_evacuation_1982.jpg",
      cameoAlt: "US Navy utility landing craft evacuating civilians and foreign personnel across a Lebanese harbour against the backdrop of Mount Lebanon during the June 1982 invasion of Lebanon",
    },
    lesson_11: {
      cardImage: "/images/cme_oslo_handshake_1993.jpg",
      heroCameo: "/images/cme_new/kt3/cme_l11_cameo_oslo_ii_leaders_white_house_1995.jpg",
      cameoAlt: "Prime Minister Yitzhak Rabin, President Hosni Mubarak, King Hussein of Jordan, President Bill Clinton, and PLO Chairman Yasser Arafat inside the White House ahead of signing the Oslo II Interim Agreement (28 September 1995)",
    },
  },

  gcse_cold_war: {
    lesson_1: {
      cardImage: '/images/cold_war/yalta_conference_1945.jpg',
      heroCameo: '/images/cold_war/yalta_conference_1945.jpg',
      cameoAlt: "Winston Churchill, Franklin D. Roosevelt, and Joseph Stalin seated at Livadia Palace during the Yalta Conference, February 1945",
    },
    lesson_2: {
      cardImage: '/images/gcse_cold_war/kt1/cw_l2_iconic_truman_churchill_fulton_1946.jpg',
      heroCameo: '/images/gcse_cold_war/kt1/cw_l2_iconic_truman_churchill_fulton_1946.jpg',
      cameoAlt: "Winston Churchill flashing his V-for-Victory sign beside President Harry S. Truman aboard the special train to Fulton, Missouri, March 1946",
    },
    lesson_3: {
      cardImage: '/images/cold_war/berlin_airlift_c54_tempelhof.jpg',
      heroCameo: '/images/cold_war/candy_bomber_gail_halvorsen_1948.jpg',
      cameoAlt: "USAF Lieutenant Gail Halvorsen ('The Candy Bomber') rigging miniature handkerchief parachutes for West Berlin children, 1948",
    },
    lesson_4: {
      cardImage: '/images/gcse_cold_war/budapest_damaged_tank_1956.jpg',
      heroCameo: '/images/gcse_cold_war/imre_nagy_portrait.jpg',
      cameoAlt: "Imre Nagy, Reformist Prime Minister of Hungary during the October–November 1956 Hungarian Uprising",
    },
    lesson_5: {
      cardImage: '/images/upgraded/gcse-cw-cme/cw_l5_kennedy_khrushchev_vienna_1961.jpg',
      heroCameo: '/images/upgraded/gcse-cw-cme/cw_l5_kennedy_khrushchev_vienna_1961.jpg',
      cameoAlt: "US President John F. Kennedy and Soviet Premier Nikita Khrushchev seated face-to-face during the Vienna Summit (June 1961)",
    },
    lesson_6: {
      cardImage: '/images/upgraded/gcse-cw-cme/cw_l6_excomm_cabinet_room_oct_1962.jpg',
      heroCameo: '/images/upgraded/gcse-cw-cme/cw_l6_excomm_cabinet_room_oct_1962.jpg',
      cameoAlt: "President John F. Kennedy meeting with ExComm advisers in the White House Cabinet Room during the Cuban Missile Crisis (October 1962)",
    },
    lesson_7: {
      cardImage: '/images/gcse_cold_war/alexander_dubcek_portrait.png',
      heroCameo: '/images/gcse_cold_war/alexander_dubcek_portrait.png',
      cameoAlt: "Alexander Dubček, First Secretary of the Communist Party of Czechoslovakia and architect of the 1968 Prague Spring",
    },
    lesson_8: {
      cardImage: '/images/upgraded/gcse-cw-cme/cw_l8_prague_warsaw_pact_invasion_aug_1968.jpg',
      heroCameo: '/images/upgraded/gcse-cw-cme/cw_l8_prague_warsaw_pact_invasion_aug_1968.jpg',
      cameoAlt: "Soviet soldier manning a heavy machine gun atop an armoured scout car in Prague during Operation Danube (August 1968)",
    },
    lesson_9: {
      cardImage: '/images/gcse_cold_war/nixon_brezhnev_salt1_1972.jpg',
      heroCameo: '/images/gcse_cold_war/nixon_brezhnev_salt1_1972.jpg',
      cameoAlt: "US President Richard Nixon and Soviet leader Leonid Brezhnev signing the SALT 1 agreements in the Grand Kremlin Palace, Moscow (26 May 1972)",
    },
    lesson_10: {
      cardImage: '/images/upgraded/gcse-cw-cme/cw_l10_reagan_afghan_delegation_1983.jpg',
      heroCameo: '/images/upgraded/gcse-cw-cme/cw_l10_reagan_afghan_delegation_1983.jpg',
      cameoAlt: "President Ronald Reagan meeting Afghan Mujahideen resistance representatives in the White House Oval Office (February 1983)",
    },
    lesson_11: {
      cardImage: '/images/upgraded/gcse-cw-cme/cw_l11_reagan_gorbachev_reykjavik_1986.jpg',
      heroCameo: '/images/upgraded/gcse-cw-cme/cw_l11_reagan_gorbachev_reykjavik_1986.jpg',
      cameoAlt: "Mikhail Gorbachev and Ronald Reagan in one-to-one talks inside Höfði House at the Reykjavik Summit (October 1986)",
    },
    lesson_12: {
      cardImage: '/images/upgraded/gcse-cw-cme/cw_l12_berlin_wall_mauerfall_nov_1989.jpg',
      heroCameo: '/images/upgraded/gcse-cw-cme/cw_l12_berlin_wall_mauerfall_nov_1989.jpg',
      cameoAlt: "Jubilant Berliners helping one another climb atop the graffiti-covered Berlin Wall following the opening of the East German border (10 November 1989)",
    },
  },
};

export function getIconicLessonVisuals(unitId, lesson) {
  if (!unitId || !lesson) return null;
  const uMap = ICONIC_LESSON_VISUALS[unitId];
  if (!uMap) return null;
  return (lesson.id && uMap[lesson.id]) || null;
}
