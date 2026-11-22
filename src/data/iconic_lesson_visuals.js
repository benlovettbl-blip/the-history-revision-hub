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
    lesson_2_1: {
      cardImage: '/units/usa/assets/sources/greensboro-sit-in-counter.jpg',
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
