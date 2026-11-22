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
      heroCameo: '/images/eee/iconic/elizabeth_i_coronation_portrait_npg_hires.jpg',
      cameoAlt: 'Queen Elizabeth I in her cloth-of-gold Coronation robes (1559, NPG 5175)',
    },
    lesson_1_2: {
      cardImage: '/images/elizabeth_i_in_parliament_1559.jpg',
      heroCameo: '/images/elizabeth_ermine_portrait.jpg',
      cameoAlt: 'The Ermine Portrait of Queen Elizabeth I (1585)',
    },
    lesson_1_3: {
      cardImage: '/images/eee/kt1/duke_of_alba_antonis_mor_1549.jpg',
      heroCameo: '/images/eee/kt1/duke_of_alba_antonis_mor_1549.jpg',
      cameoAlt: 'Fernando Álvarez de Toledo, 3rd Duke of Alba (Antonis Mor, 1549)',
    },
    lesson_1_4: {
      cardImage: '/images/upgraded/gcse-med-eee/eee_mary_queen_of_scots_hilliard.jpg',
      heroCameo: '/images/upgraded/gcse-med-eee/eee_mary_queen_of_scots_hilliard.jpg',
      cameoAlt: 'Mary, Queen of Scots (Sheffield portrait type after Nicholas Hilliard)',
    },
    lesson_2_1: {
      cardImage: '/images/mary_queen_of_scots_execution_fotheringhay_1587.jpg',
      heroCameo: '/images/eee/kt2/sir_francis_walsingham_npg.jpg',
      cameoAlt: 'Sir Francis Walsingham, Principal Secretary and Spymaster (NPG 1807)',
    },
    lesson_2_2: {
      cardImage: '/images/upgraded/gcse-med-eee/eee_sir_francis_drake_npg4037.jpg',
      heroCameo: '/images/upgraded/gcse-med-eee/eee_sir_francis_drake_npg4037.jpg',
      cameoAlt: 'Sir Francis Drake (NPG 4037)',
    },
    lesson_2_3: {
      cardImage: '/images/eee/kt2/robert_dudley_leicester_waddesdon.jpg',
      heroCameo: '/images/upgraded/gcse-med-eee/eee_alexander_farnese_parma_lacma.jpg',
      cameoAlt: 'Alexander Farnese, Duke of Parma, commander of the Spanish Army of Flanders',
    },
    lesson_2_4: {
      cardImage: '/images/eee/iconic/elizabeth_i_armada_portrait_woburn_hires.jpg',
      heroCameo: '/images/eee/iconic/elizabeth_i_armada_portrait_woburn_hires.jpg',
      cameoAlt: 'The Armada Portrait of Queen Elizabeth I (c. 1588, Woburn Abbey)',
    },
    lesson_3_1: {
      cardImage: '/images/theatre.jpg',
      heroCameo: '/images/theatre.jpg',
      cameoAlt: 'The Chandos Portrait of William Shakespeare (NPG 1)',
    },
    lesson_3_2: {
      cardImage: '/images/eee/kt3/l10_s3_harman_caveat_vagabonds_1567.jpg',
      heroCameo: '/images/eee/kt3/l10_s3_harman_caveat_vagabonds_1567.jpg',
      cameoAlt: 'Elizabethan woodcut of vagrants from Thomas Harman (1567)',
    },
    lesson_3_3: {
      cardImage: '/images/upgraded/gcse-med-eee/eee_drake_1591_rmg_bhc2662.jpg',
      heroCameo: '/images/upgraded/gcse-med-eee/eee_drake_1591_rmg_bhc2662.jpg',
      cameoAlt: 'Sir Francis Drake with his hand on the terrestrial globe (1591, RMG)',
    },
    lesson_3_4: {
      cardImage: '/images/sir_walter_raleigh.jpg',
      heroCameo: '/images/sir_walter_raleigh.jpg',
      cameoAlt: 'Sir Walter Raleigh (1588, NPG 7)',
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
      cardImage: '/units/great_war/assets/werner_versailles_1871_highres.jpg',
      heroCameo: '/images/otto_von_bismarck_portrait.jpg',
      cameoAlt: 'Otto von Bismarck, Chancellor of the German Empire',
    },
    lesson_3: {
      cardImage: '/images/hms_dreadnought_1906.jpg',
    },
    lesson_5: {
      cardImage: '/units/great_war/assets/sarajevo_assassination_beltrame_1914.jpg',
      heroCameo: '/units/great_war/assets/sarajevo_assassination_beltrame_1914.jpg',
      cameoAlt: 'Assassination of Archduke Franz Ferdinand at Sarajevo (28 June 1914)',
    },
  },

  great_war_part2: {
    lesson_1_enlistment: {
      cardImage: '/images/gw_kitchener_poster.jpg',
      heroCameo: '/images/gw_kitchener_poster.jpg',
      cameoAlt: 'Lord Kitchener "Wants You" recruitment poster (1914)',
    },
    lesson_3_empire_troops: {
      cardImage: '/images/upgraded/ks3-empire-gw/gw2_l3_srcc_walter_tull_1917.jpg',
      heroCameo: '/images/upgraded/ks3-empire-gw/gw2_l3_srcc_walter_tull_1917.jpg',
      cameoAlt: 'Second Lieutenant Walter Tull (1917)',
    },
  },

  second_british_empire: {
    lesson_3: {
      cardImage: '/images/upgraded/ks3-empire-gw/sbe_l3_srcb_rani_lakshmibai_sword_shield.jpg',
      heroCameo: '/images/upgraded/ks3-empire-gw/sbe_l3_srcb_rani_lakshmibai_sword_shield.jpg',
      cameoAlt: 'Rani Lakshmibai of Jhansi (1857)',
    },
    lesson_4: {
      cardImage: '/images/cetshwayo_king_of_zulus.jpg',
    },
    lesson_5: {
      cardImage: '/images/rhodes_colossus.png',
    },
  },

  post_war_britain: {
    lesson_1: {
      cardImage: '/images/post_war_britain/pankhurst_arrest_1914.jpg',
    },
    lesson_2: {
      cardImage: '/images/bevan_first_day_nhs_1948.jpg',
    },
    lesson_3: {
      cardImage: '/images/empire_windrush_1948.jpg',
      heroCameo: '/images/upgraded/ks3-modern/pwb_l3_block4_claudia_jones_1948.jpg',
      cameoAlt: 'Claudia Jones, founder of the West Indian Gazette',
    },
    lesson_4: {
      cardImage: '/images/bristol_bus_boycott_mural.jpg',
    },
  },

  // =========================================================================
  // GCSE: Medicine, USA, Weimar & Nazi Germany, Cold War, Middle East
  // =========================================================================
  edexcel_medicine: {
    lesson_2_4: {
      cardImage: '/images/harvey_demonstrating_heart.jpg',
      heroCameo: '/images/william_harvey_npg.jpg',
      cameoAlt: 'Dr William Harvey (c. 1627, National Portrait Gallery)',
    },
    lesson_3_2: {
      cardImage: '/images/jenner_vaccinating_phipps.jpg',
    },
    lesson_3_3: {
      cardImage: '/images/nightingale_scutari.jpg',
      heroCameo: '/images/upgraded/gcse-med-eee/med_l3_3_mary_seacole_challen_1869.jpg',
      cameoAlt: 'Mary Seacole (1869, NPG 6805)',
    },
    lesson_4_1: {
      cardImage: '/images/dna_structure.jpg',
      heroCameo: '/images/dna_structure.jpg',
      cameoAlt: 'Watson and Crick with the 1953 DNA Double Helix model',
    },
    lesson_4_3: {
      cardImage: '/images/bevan_first_day_nhs_1948.jpg',
    },
    lesson_4_4: {
      cardImage: '/images/penicillin_mould.jpg',
      heroCameo: '/images/penicillin_mould.jpg',
      cameoAlt: "Alexander Fleming in his St Mary's Hospital laboratory",
    },
  },

  usa: {
    lesson_1_2: {
      cardImage: '/units/usa/assets/sources/little-rock-nine-1957.jpg',
    },
    lesson_1_3: {
      cardImage: '/units/usa/assets/sources/rosa-parks-bus-1956.jpg',
      heroCameo: '/units/usa/assets/sources/rosa-parks-bus-1956.jpg',
      cameoAlt: 'Rosa Parks seated at the front of a Montgomery bus (December 1956)',
    },
    lesson_2_2: {
      cardImage: '/units/usa/assets/sources/mlk-dream-speech-1963.jpg',
      heroCameo: '/units/usa/assets/sources/mlk-dream-speech-1963.jpg',
      cameoAlt: "Dr Martin Luther King Jr. delivering his 'I Have a Dream' speech (1963)",
    },
    lesson_2_3: {
      cardImage: '/units/usa/assets/sources/olympics-black-power-1968.jpg',
      heroCameo: '/units/usa/assets/sources/olympics-black-power-1968.jpg',
      cameoAlt: 'Tommie Smith and John Carlos Black Power salute (1968 Olympics)',
    },
    lesson_4_1: {
      cardImage: '/units/usa/assets/sources/kent-state-protests-1970.jpg',
    },
  },

  weimar_nazi_germany: {
    lesson_1_2: {
      cardImage: '/images/upgraded/gcse-p3/weimar_l02_b4_hyperinflation_berlin_bread_1923.jpg',
    },
    lesson_1_4: {
      cardImage: '/images/weimar_new_woman_1920s.jpg',
    },
    lesson_2_2: {
      cardImage: '/images/munich_putsch_defendants.jpg',
    },
    lesson_2_3: {
      cardImage: '/images/nazi_poster_our_last_hope.jpg',
      heroCameo: '/images/nazi_poster_our_last_hope.jpg',
      cameoAlt: '1932 Election Poster: "Our Last Hope: Hitler"',
    },
    lesson_2_4: {
      cardImage: '/images/papen_hitler_cartoon.jpg',
      heroCameo: '/images/papen_hitler_cartoon.jpg',
      cameoAlt: '"The Temporary Triangle" cartoon — Hindenburg and Von Papen carrying Hitler (January 1933)',
    },
    lesson_3_1: {
      cardImage: '/images/hitler_hindenburg_1933.jpg',
    },
    lesson_3_2: {
      cardImage: '/images/weimar_individuals/heinrich_himmler.jpg',
      heroCameo: '/images/weimar_individuals/martin_niem_ller.jpg',
      cameoAlt: 'Pastor Martin Niemöller, Confessing Church opposition leader',
    },
    lesson_4_1: {
      cardImage: '/images/upgraded/gcse-p3/weimar_l13_b3_mothers_cross_award.jpg',
    },
  },

  cme_new: {
    lesson_2: {
      cardImage: '/images/cme_bengurion_declaration_1948.jpg',
    },
    lesson_5: {
      cardImage: '/units/cme_new/assets/nasser_1958.jpg',
    },
    lesson_6: {
      cardImage: '/images/cme_paratroopers_western_wall_1967.jpg',
    },
    lesson_7: {
      cardImage: '/images/cme_munich_1972_balcony.jpg',
    },
    lesson_9: {
      cardImage: '/units/cme_new/assets/camp_david_accords.png',
    },
    lesson_11: {
      cardImage: '/images/cme_oslo_handshake_1993.jpg',
    },
  },

  gcse_cold_war: {
    lesson_1: {
      cardImage: '/images/cold_war/yalta_conference_1945.jpg',
    },
    lesson_6: {
      cardImage: '/images/portraits/fidel_castro_1959.jpg',
      heroCameo: '/images/portraits/fidel_castro_1959.jpg',
      cameoAlt: 'Fidel Castro (1959)',
    },
    lesson_7: {
      cardImage: '/images/gcse_cold_war/alexander_dubcek_portrait.png',
    },
    lesson_10: {
      cardImage: '/images/upgraded/gcse-cw-cme/cw_l10_reagan_sdi_oval_office_1983.jpg',
    },
  },
};

export function getIconicLessonVisuals(unitId, lesson) {
  if (!unitId || !lesson) return null;
  const uMap = ICONIC_LESSON_VISUALS[unitId];
  if (!uMap) return null;
  return (lesson.id && uMap[lesson.id]) || null;
}
