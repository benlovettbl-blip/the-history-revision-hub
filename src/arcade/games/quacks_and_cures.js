/**
 * Visual Showcase Game 1: "Quacks & Cures: 800 Years on Call (c.1250–Present)"
 * Gold Standard v3 — Official History Escape Room & Medical Career Edition
 *
 * Spanning all 5 Edexcel GCSE Medicine eras:
 *   Shift 1: 1348 Medieval Apothecary (Causes, Prevention, Treatment -> 0/3 Saved, 100% Guild Distinction!)
 *   Shift 2: 1665 Renaissance Plague & Anatomy Room (Vesalius, Charles II Continuity, Sydenham Quinine -> 2/3 Saved!)
 *   Shift 3: 1796–1867 Industrial Operating Theatre (Snow's Pump, Lister's Carbolic Spray, Jenner -> 3/3 Saved!)
 *   Shift 4: 1917 RAMC Western Front Chain of Evacuation (RAP -> ADS -> CCS -> Base Hospital -> 3/3 Saved!)
 *   Shift 5: 1948–Present Modern NHS Ward (Bevan Free Care, Florey & Chain Penicillin, MRSA Superbug -> 3/3 Saved!)
 *
 * Includes:
 *   - Unified History Revision Hub Escape Room Brand Bar & Cover Launchpad
 *   - 2-Scene Voiced Atmospheric 1348–1948 Cinematic Opening (`quacks_pro_1..2`)
 *   - Interactive 2.4× Brass Magnifying Loupe + Hotspot Clues + Explicit Task Directive Banners
 *   - Grounded 5-Era Medical Case File + Mistake Suspicion / Gold Surgeon-General Seal
 *   - 2-Scene Voiced Atmospheric 800-Year Medical Ending (`quacks_end_1..2`) + Workbook Homework Code Card
 */

import { arcadeAudio, getArcadePersonalBest, saveArcadePersonalBest } from '../arcade_audio.js';
import { generateQuestionId, recordQuestionResult } from '../../storage.js';
import {
  renderEscapeBrandBarHTML,
  renderEscapeCoverSealHTML,
  renderTaskDirectiveBannerHTML,
  bindArchivalLoupeDelegation,
  renderHistoricalCaseFileHTML,
  renderAtmosphericCinemaHTML,
  renderWorkbookCodeCardHTML,
  createEscapeCinemaVoicePlayer,
} from '../../interactive_labs/escape_room_brand.js';

const QUACKS_PROLOGUE = [
  {
    voClip: 'quacks_pro_1',
    credit: 'THE HISTORY REVISION HUB PRESENTS • LONDON, 1348',
    heading: 'Blind to the Invisible Enemy',
    img: '/images/medieval_physician_bedside.jpg',
    alt: 'Medieval woodcut (Silvaticus No. 300) showing three robed physicians examining a patient’s pulse and holding a glass urine flask',
    caption:
      'Medieval Bedside Consultation (Silvaticus Woodcut) • University physicians check pulse and urine flask under Galen’s Four Humours',
    vignette: 'crimson',
    narration:
      'London, 1348. As the Black Death sweeps through crowded medieval lanes, university physicians consult star charts and Galen’s Four Humours—utterly blind to the microscopic bacteria killing half the city.',
  },
  {
    voClip: 'quacks_pro_2',
    credit: 'EIGHT HUNDRED YEARS ON CALL • c.1250 TO THE MODERN N.H.S.',
    heading: 'How Science Transformed Human Survival',
    img: '/images/med_banner_kt3_1_pasteur_lab.jpg',
    alt: 'Nineteenth-century engraving of Louis Pasteur peering through a microscope in his laboratory surrounded by swan-neck flasks',
    caption:
      'Louis Pasteur in His Laboratory (c.1885 Engraving) • Pasteur’s 1861 Germ Theory shattered 1,400 years of Galenic continuity',
    vignette: 'emerald',
    narration:
      'Across eight hundred years—from Renaissance anatomy and Pasteur’s 1861 Germ Theory to Western Front triage and the 1948 NHS—take your place on call and witness how science transformed human survival!',
  },
];

const QUACKS_EPILOGUE = [
  {
    voClip: 'quacks_end_1',
    credit: 'FINALE SCENE 1 OF 2 • THE SCIENTIFIC TURNING POINT (1854–1900)',
    heading: 'Five Centuries of Continuity Shattered',
    img: '/images/lister_carbolic_spray.jpg',
    alt: '1882 surgical engraving showing Joseph Lister’s carbolic acid steam spray misting over an antiseptic operation',
    caption:
      'Antiseptic Operating Theatre (Fig. 23, 1882) • Joseph Lister’s carbolic acid spray cut post-operative gangrene mortality from 46% to 15%',
    vignette: 'emerald',
    narration:
      'Eight centuries on call complete! For five hundred years, continuity ruled because nobody knew germs caused disease. Once Pasteur, Koch, Nightingale, Lister, and Snow shattered old ideas, survival soared.',
  },
  {
    voClip: 'quacks_end_2',
    credit: 'FINALE SCENE 2 OF 2 • 5 JULY 1948 TO MODERN MEDICINE',
    heading: 'Universal Care, Penicillin & DNA',
    img: '/images/bevan_first_day_nhs_1948.jpg',
    alt: 'Health Minister Aneurin Bevan greeting 13-year-old Sylvia Diggory at Park Hospital, Manchester on 5 July 1948, the first day of the NHS',
    caption:
      'Park Hospital, Manchester, 5 July 1948 • Health Minister Aneurin Bevan greets 13-year-old Sylvia Diggory on Day 1 of the National Health Service',
    vignette: 'gold',
    narration:
      'In the twentieth century, government funding, wartime urgency, Florey and Chain’s penicillin, Crick and Watson’s DNA, and Bevan’s NHS turned medicine into a modern life-saving system!',
  },
];

const SHIFTS = [
  {
    id: 'medieval',
    shortTab: '1. Medieval (1348)',
    eraBadge: 'SHIFT 1 • MEDIEVAL ENGLAND (1348)',
    eraTitle: 'Ye Olde Humour & Leech Apothecary',
    inspectorTitle: 'Guild Master & Parish Priest',
    accent: '#d97706',
    bgGrad: 'linear-gradient(135deg, #271709 0%, #170f07 100%)',
    propHint: 'Tap hotspots or drag across the apothecary plate to magnify 2.4×!',
    taskWhat:
      'Inspect the 1348 apothecary source hotspots (or hover/tap 🔍 2.4× Loupe), then prescribe the authentic medieval Galenic method for all 3 patients—avoiding modern time-traveller traps!',
    taskWhy:
      'In c.1250–1500 the Church enforced Galen’s Four Humours and nobody knew bacteria existed—so even 100% "correct" medieval medicine saved 0/3 plague victims!',
    caseRecordTitle: '1348 Galenic & Supernatural Continuity',
    caseRecordSummary:
      'Astrology, uroscopy, bleeding, and anti-miasma posies dominated because Church authority protected Galen and germs were invisible.',
    cases: [
      {
        patient: 'Lord Percy of York',
        ailment: 'Egg-sized black buboes in the armpits, roaring fever, and foul breath during the 1348 Pestilence!',
        avatarMood: 'sick-plague',
        prompt: 'The Parish Priest & Guild Examiner are watching! What do you diagnose as the PRIMARY CAUSE and Official Treatment?',
        options: [
          {
            label: 'Blame microscopic bacteria carried by rat fleas & prescribe antibiotics',
            isOrthodox: false,
            survived: false,
            inspectorQuip:
              '🔥 HERESY & LUNACY! "Invisible tiny beasts?!" The Guild confiscates your urine flask! Neither microscopes nor germ theory exist for another 500 years!',
            examNote: 'In 1348, nobody knew about bacteria (Yersinia pestis). Doctors relied on supernatural, astrological, and humoral explanations.',
          },
          {
            label: "Diagnose God's wrath & Mars-Jupiter alignment; strap a shaved live chicken to his buboes!",
            isOrthodox: true,
            survived: false,
            inspectorQuip:
              '📜 FULL GUILD DISTINCTION! Classic medieval plague method! Sadly, Lord Percy died on Tuesday... though the chicken made a full recovery.',
            examNote:
              'Medieval physicians blamed God’s punishment for sin, astrology (1345 alignment of Mars, Jupiter & Saturn), and miasma, using sympathetic magic like strapping a shaved chicken (or bleeding/lancing).',
          },
          {
            label: 'Tell him to exercise vigorously for 3 hours to sweat out the black bile',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '❌ Amateur! Vigorous exercise overheats choleric blood! He collapsed on the cobbles in four minutes.',
            examNote: 'Galenic Regimen Sanitatis advised gentle moderation, prayer, confession, and humoral balancing—never exhausting a feverish plague victim.',
          },
        ],
      },
      {
        patient: 'Dame Margery the Baker',
        ailment: 'Flushed red cheeks, throbbing headache, and dark crimson urine in your glass Matula flask!',
        avatarMood: 'flushed',
        prompt: 'Using Galen’s Theory of Opposites & the Four Humours, how do you balance Dame Margery?',
        options: [
          {
            label: 'Check the Zodiac Man chart so the Moon isn’t in Aries, then bleed her arm vein into a pewter bowl!',
            isOrthodox: true,
            survived: false,
            inspectorQuip:
              '🩸 TEXTBOOK GALEN! You drained two pints of "excess hot blood" under a favourable constellation! Tragically she fainted and expired, so your humours paperwork is spotless.',
            examNote: 'University-trained physicians used uroscopy charts and the Zodiac Man (astrology) to time phlebotomy (bloodletting) and balance excess blood.',
          },
          {
            label: 'Feed her spicy roast peppered boar and red wine to boost her blood',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '❌ Backwards! Galen’s Theory of Opposites says hot/wet excess blood requires COOLING cucumber—not hot pepper!',
            examNote: 'Claudius Galen’s Theory of Opposites treated hot/wet conditions with cold/dry remedies (like cucumber) and excess blood with bleeding or leeches.',
          },
          {
            label: 'Perform keyhole laparoscopic surgery under anaesthetic gas',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🕰️ Time-traveller alert! Anaesthetics aren’t invented until the 1800s and keyhole surgery until the late 20th century!',
            examNote: 'Medieval surgery had no effective anaesthetics or antiseptics—only opium/hemlock (dwale) which easily overdosed patients.',
          },
        ],
      },
      {
        patient: 'Alderman Giles of London',
        ailment: 'Terrified of catching the Black Death from overflowing city cesspits and smelly butcher lanes!',
        avatarMood: 'panicked',
        prompt: 'King Edward III demands civic & religious PREVENTION advice. What is authentic 1348 prevention?',
        options: [
          {
            label: 'Order compulsory smallpox cowpox vaccination across every parish',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🐄 Cowpox?! Edward Jenner isn’t born for another 400 years! The Alderman thinks you’ve gone mad!',
            examNote: 'Vaccination was discovered by Edward Jenner in 1796 for smallpox—medieval prevention focused on prayer, fasting, and clearing miasma.',
          },
          {
            label: 'Carry a sweet-smelling pomander posy, burn tar barrels against Miasma, and join barefoot prayer processions!',
            isOrthodox: true,
            survived: false,
            inspectorQuip:
              '🌿 MAGNIFICENT! The streets smell of rosemary and smoke! Unfortunately, fleas don’t care about posies, so Giles still caught bubonic plague on Friday.',
            examNote:
              'Medieval prevention targeted Miasma (corrupt air) with pomanders, burning herbs, and King Edward III’s street-cleaning orders alongside fasting and confession.',
          },
          {
            label: 'Dump carbolic acid spray into the River Thames',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🧪 Joseph Lister won’t invent carbolic antiseptics until 1865! Stick to rosemary and Latin prayers!',
            examNote: 'Medieval towns had rakers and gongfermors to clear foul-smelling muck (miasma), not chemical antiseptics.',
          },
        ],
      },
    ],
  },
  {
    id: 'renaissance',
    shortTab: '2. Renaissance (1665)',
    eraBadge: 'SHIFT 2 • MEDICAL RENAISSANCE (1543–1685)',
    eraTitle: 'Beaked Masks, Royal Bleeding & New World Bark',
    inspectorTitle: 'Royal Society Fellow',
    accent: '#a855f7',
    bgGrad: 'linear-gradient(135deg, #211336 0%, #110a1f 100%)',
    propHint: 'Inspect the 1665 Great Plague broadsheet clues & magnify 2.4×!',
    taskWhat:
      'Examine the 1665 Great Plague broadsheet clues, then navigate Vesalius’s human dissections, King Charles II’s deathbed, and Thomas Sydenham’s Peruvian bark!',
    taskWhy:
      'Renaissance printing and human dissection overturned Galenic anatomy (Vesalius 1543, Harvey 1628), yet bedside treatment barely changed because germs remained unknown.',
    caseRecordTitle: '1543–1685 Anatomical Change vs Bedside Continuity',
    caseRecordSummary:
      'Vesalius and Harvey transformed anatomy and Sydenham used quinine bark, yet Charles II was still bled to death in 1685.',
    cases: [
      {
        patient: 'Anatomy Student at Padua (1543)',
        ailment: 'Dissecting a real human cadaver alongside Andreas Vesalius—something looks VERY different from Galen’s ancient books!',
        avatarMood: 'scholar',
        prompt: 'What breakthrough does Vesalius prove in "On the Fabric of the Human Body" (1543)?',
        options: [
          {
            label: 'Galen dissected animals, not humans! The human jaw has ONE bone (not two) and blood does NOT pass through invisible holes in the heart septum!',
            isOrthodox: true,
            survived: true,
            inspectorQuip:
              '📖 PRINT IT IMMEDIATELY! Thanks to Gutenberg’s printing press, 300 woodcut illustrations spread across Europe! (Count that cadaver lesson as a WIN!)',
            examNote: 'Vesalius (1543) proved over 300 of Galen’s anatomical errors (made on monkeys/pigs), encouraging doctors to dissect humans themselves.',
          },
          {
            label: 'Galen was 100% infallible—ignore your own eyes and blame a deformed corpse!',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🦴 Old-school medieval dogmatism! Renaissance humanists test ancient texts through direct observation!',
            examNote: 'Declining Church censorship and the printing press allowed Vesalius and William Harvey (1628 circulation of blood) to overturn Galenic anatomy.',
          },
          {
            label: 'Vesalius discovers DNA’s double helix inside the cadaver’s liver',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🧬 Slow down! Watson, Crick, Franklin & Wilkins are 410 years away (1953)!',
            examNote: 'Renaissance breakthroughs improved anatomical knowledge (Vesalius, Harvey), though microscopic causes of disease remained unknown.',
          },
        ],
      },
      {
        patient: 'King Charles II (February 1685)',
        ailment: 'The King collapsed while shaving at Whitehall Palace with a kidney seizure!',
        avatarMood: 'royal',
        prompt: 'Despite Harvey proving blood circulates in 1628, how do Charles II’s 14 royal physicians ACTUALLY treat him?',
        options: [
          {
            label: 'Put him on a kidney dialysis machine and administer intravenous saline',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '👑 Impossible in 1685! Harvey knew blood circulated like a pump, not how to filter toxins or transfuse human blood safely!',
            examNote: 'Anatomical discoveries (Vesalius/Harvey) took centuries to produce practical life-saving treatments.',
          },
          {
            label: 'Drain 24 ounces of royal blood, apply blister-beetle plasters, a hot frying pan to his head, and crushed human skull drops!',
            isOrthodox: true,
            survived: false,
            inspectorQuip:
              '💀 HISTORICALLY SPOT-ON CONTINUITY! Charles II apologised for taking "an unconscionable time a-dying" and expired! Proof that treatment barely changed!',
            examNote: 'Key GCSE Continuity Point: Even at the very top of society in 1685, doctors still fell back on humoral bleeding, purging, and desperate alchemy.',
          },
          {
            label: 'Leave him completely untouched in a darkened quiet room',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '❌ Fourteen ambitious court physicians would NEVER pass up billing the Crown for crushed pearls and hot irons!',
            examNote: 'Charles II’s treatment illustrates why Renaissance ideas changed faster than practical bedside treatments.',
          },
        ],
      },
      {
        patient: 'Merchant Samuel (Ague / Malaria Fever, 1676)',
        ailment: 'Violent shivering bouts every third day after trading ships returned from the Americas!',
        avatarMood: 'shivering',
        prompt: '"English Hippocrates" Thomas Sydenham arrives! What genuinely effective New World remedy does he prescribe?',
        options: [
          {
            label: 'Lock him in his house with a red cross painted on the door and burn tobacco',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🚪 That’s the 1665 Great Plague Lord Mayor’s quarantine order—it won’t cure Samuel’s malaria!',
            examNote: 'Quarantine (28–40 days with watchmen) was strong 1665 government plague prevention, whereas Sydenham pioneered clinical observation for fevers.',
          },
          {
            label: 'Observe his exact symptoms (not his star sign!) and prescribe Cinchona ("Jesuits’ Bark" containing quinine) imported from Peru!',
            isOrthodox: true,
            survived: true,
            inspectorQuip:
              '🎉 STOP EVERYTHING—A SICK PATIENT ACTUALLY SURVIVED!! Sydenham classified diseases like plant species and Peruvian bark genuinely cured malaria!',
            examNote: 'Thomas Sydenham (Observationes Medicae, 1676) rejected astrology/uroscopy in favour of bedside observation, popularising cinchona bark (quinine) for malaria.',
          },
          {
            label: 'Inject Salvarsan 606 chemical magic bullet',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🧪 Paul Ehrlich doesn’t synthesise Salvarsan 606 until 1909!',
            examNote: 'Overseas exploration brought natural botanical remedies (cinchona bark, ipecacuanha), whereas synthetic chemical magic bullets arrived in the 1900s.',
          },
        ],
      },
    ],
  },
  {
    id: 'industrial',
    shortTab: '3. Industrial (1865)',
    eraBadge: 'SHIFT 3 • INDUSTRIAL BRITAIN (1796–1875)',
    eraTitle: 'Pumps, Chloroform & Carbolic Spray',
    inspectorTitle: 'Victorian Hospital Matron & Surgeon',
    accent: '#10b981',
    bgGrad: 'linear-gradient(135deg, #092622 0%, #071717 100%)',
    propHint: 'Inspect Lister’s 1867 carbolic steam spray & sterile tray!',
    taskWhat:
      'Inspect Lister’s antiseptic operating theatre plate, then halt Soho’s 1854 cholera outbreak, conquer hospital gangrene, and eradicate smallpox!',
    taskWhy:
      'Pasteur’s 1861 Germ Theory + Koch’s microbe hunting finally revealed the true cause of infection—turning vaccines, clean water, and carbolic antiseptics into real life-savers!',
    caseRecordTitle: '1796–1875 Germ Theory, Snow, Jenner & Lister',
    caseRecordSummary:
      'Jenner’s cowpox vaccine, Snow’s Broad Street pump, Pasteur’s 1861 Germ Theory, and Lister’s carbolic acid lifted survival to 3/3.',
    cases: [
      {
        patient: 'Soho Residents on Broad Street (August 1854)',
        ailment: 'Over 500 neighbours around Golden Square have collapsed with fatal rice-water cholera within 10 days!',
        avatarMood: 'panicked',
        prompt: 'Dr John Snow has mapped every death onto a street grid. How do you halt the outbreak?',
        options: [
          {
            label: 'Flush all London sewers straight into the Thames to blow away Miasma',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🌊 DISASTER! Edwin Chadwick did that earlier—dumping sewage into drinking water intakes spread MORE cholera!',
            examNote: 'Chadwick believed Miasma caused disease, inadvertently washing sewage into London’s water supply before Bazalgette’s 1860s intercepting sewers.',
          },
          {
            label: 'Remove the handle from the Broad Street water pump (contaminated by a leaking cesspit 3 feet away)!',
            isOrthodox: true,
            survived: true,
            inspectorQuip:
              '🔧 CLANG! Handle removed—new Soho cholera deaths plummet overnight! Even though Snow couldn’t yet show the comma bacteria (Koch, 1883), his spot-map saved hundreds!',
            examNote: 'John Snow (1854) proved cholera was waterborne rather than airborne miasma, paving the way for Bazalgette’s sewers and the compulsory 1875 Public Health Act.',
          },
          {
            label: 'Do nothing—strict Laissez-Faire says ratepayers shouldn’t fund clean water',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🎩 Early 1800s MPs loved Laissez-Faire, and thousands died because of it! By 1875 Disraeli finally made public health compulsory!',
            examNote: 'Working-class male suffrage (1867), Pasteur’s Germ Theory (1861), and Snow’s evidence forced the government to abandon laissez-faire in the 1875 Public Health Act.',
          },
        ],
      },
      {
        patient: 'Compound Leg Fracture in Glasgow Royal Infirmary (1867)',
        ailment: 'Anaesthetic chloroform stops pain—but 46% of amputation patients are dying of "Hospital Gangrene" during Surgery’s Black Period!',
        avatarMood: 'bandaged',
        prompt: 'Joseph Lister has just read Louis Pasteur’s 1861 Germ Theory! What do you do BEFORE & DURING surgery?',
        options: [
          {
            label: 'Wear your proudest unwashed blood-stiffened frock coat and saw as fast as Robert Liston!',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🩸 "The good old surgical stink!" The operation hurt zero percent thanks to Simpson’s chloroform—and then sepsis killed the patient 4 days later!',
            examNote: 'Between 1847 (Simpson’s chloroform) and 1865 (Lister’s antiseptics), longer invasive operations with dirty hands caused the "Black Period" spike in infection deaths.',
          },
          {
            label: 'Soak instruments, bandages, and the wound in Carbolic Acid mist to kill airborne microbes on contact!',
            isOrthodox: true,
            survived: true,
            inspectorQuip:
              '💨 HISSSSS! Carbolic mist fills the theatre! Your knuckles are cracked and yellow, yet amputation mortality crashes from 46% down to 15%! PATIENT SAVED!',
            examNote: 'Joseph Lister (1865–67) applied Pasteur’s Germ Theory using carbolic acid (earlier used on Carlisle sewage), cutting ward sepsis from 46% to 15% and leading to aseptic surgery by 1900.',
          },
          {
            label: 'Give the patient nitrous oxide laughing gas and hope that kills bacteria',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '😂 Anaesthetics block PAIN, not INFECTION! Without Lister’s antiseptics, bacteria feast on deep incisions!',
            examNote: 'Students must never confuse anaesthetics (pain relief: Simpson 1847 chloroform) with antiseptics (infection control: Lister 1865 carbolic acid).',
          },
        ],
      },
      {
        patient: 'Eight-Year-Old James Phipps in Gloucestershire (1796)',
        ailment: 'Deadly Smallpox is sweeping English villages, scarring and killing rich and poor alike!',
        avatarMood: 'healthy',
        prompt: 'Country doctor Edward Jenner notices milkmaids like Sarah Nelmes never catch smallpox. What is your move?',
        options: [
          {
            label: 'Use risky Variolation (rubbing live human smallpox scabs into a cut—which can kill the patient and infect the whole village!)',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '⚠️ Lady Mary Wortley Montagu’s variolation worked sometimes, when it didn’t trigger a full fatal smallpox outbreak!',
            examNote: 'Inoculation/variolation used live smallpox matter—expensive, uncalibrated, and capable of killing patients or spreading epidemics.',
          },
          {
            label: 'Vaccinate him with harmless Cowpox pus (vacca = cow), then test immunity six weeks later!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '💉 IMMUNE! James Phipps doesn’t get a single smallpox spot! Parliament makes vaccination compulsory in 1852—the first disease eventually eradicated worldwide!',
            examNote: 'Jenner (1796) proved cowpox vaccination prevented smallpox (though he could not explain how until Pasteur/Koch, and faced Anti-Vaccine Society opposition).',
          },
          {
            label: 'Wait for Alexander Fleming to discover Penicillin to cure the smallpox virus',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🦠 DOUBLE EXAM TRAP! Not only is Penicillin 1928, Smallpox is a VIRUS—antibiotics NEVER work on viruses!',
            examNote: 'Vaccines prevent viral infections like smallpox; antibiotics (penicillin) only treat bacterial infections.',
          },
        ],
      },
    ],
  },
  {
    id: 'ramc',
    shortTab: '4. 1917 RAMC',
    eraBadge: 'SHIFT 4 • 1917 RAMC WESTERN FRONT TRIAGE',
    eraTitle: 'Chain of Evacuation: Ypres & Arras Sector',
    inspectorTitle: 'RAMC Commanding Officer',
    accent: '#eab308',
    bgGrad: 'linear-gradient(135deg, #262110 0%, #14120a 100%)',
    isEvacShift: true,
    propHint: 'Match each casualty to RAP → ADS → CCS → Base Hospital!',
    taskWhat:
      'Check the highlighted Chain of Evacuation station (RAP → ADS → CCS → Base Hospital) and deploy the exact 1915–1917 Western Front surgical breakthrough!',
    taskWhy:
      'Industrial shellfire and manured Flanders mud forced urgent wartime innovation—producing the Thomas Splint, mobile X-rays, Carrel-Dakin irrigation, and the 1917 Cambrai Blood Depot.',
    caseRecordTitle: '1914–18 Western Front Chain of Evacuation',
    caseRecordSummary:
      'Thomas Splints (82% survival), Carrel-Dakin tubes, mobile X-rays, and Robertson’s citrated blood bank at Cambrai saved thousands at the CCS.',
    cases: [
      {
        patient: 'Pte. Thomas Atkins (Compound Femur Fracture)',
        ailment: 'Hit by shell shrapnel in No Man’s Land! Thigh bone shattered, jagged bone ends slicing into muscle & arteries—80% fatal in 1914!',
        avatarMood: 'soldier-leg',
        prompt: 'Stretcher-bearers haul him through Ypres mud! Which Chain of Evacuation protocol & invention raises femur survival from 20% to 82%?',
        highlightNode: 1,
        options: [
          {
            label: 'Attempt full 3-hour leg surgery right in the muddy dugout at the Regimental Aid Post (RAP, 200m from front line)',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '💥 SHELLFIRE HIT THE DUGOUT! The RAP has ONE Regimental Medical Officer, bandages, and morphine—NEVER major surgery!',
            examNote: 'The Regimental Aid Post (RAP) was within 200m of the front trench to patch light wounds ("walking wounded") and move serious cases back immediately.',
          },
          {
            label: 'Stabilise at RAP/ADS with the Thomas Splint (keeping the leg rigid in traction!) & evacuate via motor ambulance to the CCS!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '🎖️ TEXTBOOK RAMC! Introduced across the front from Dec 1915 by Robert Jones, the Thomas Splint stopped bone ends severing arteries—survival soared from 20% to 82%!',
            examNote: 'In 1914–15, 80% of soldiers with compound femur fractures died from blood loss/gas gangrene; widespread training in the Thomas Splint raised survival to 82%.',
          },
          {
            label: 'Leave the leg un-splinted on a jolting horse-drawn wagon all the way to London',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '❌ Every bump ground the broken femur into his femoral artery—catastrophic blood loss before reaching the railhead!',
            examNote: 'FANY volunteer motor ambulances alongside horse wagons (in deep Ypres mud) and ambulance trains moved splinted casualties smoothly.',
          },
        ],
      },
      {
        patient: 'Cpl. Arthur Jenkins (Flanders Manure-Soil Shrapnel Wound)',
        ailment: 'Deep shrapnel wound packed with heavily manured Belgian farmland soil—crackling, foul-smelling Gas Gangrene is spreading fast!',
        avatarMood: 'soldier-arm',
        prompt: 'Lister’s surface carbolic spray cannot reach deep inside jagged shrapnel tracks, and penicillin doesn’t exist yet! Where & how do you save him?',
        highlightNode: 2,
        options: [
          {
            label: 'Rush to Casualty Clearing Station (CCS): X-ray for metal, surgical debridement (cut away dead tissue), & flush via Carrel-Dakin sterilised salt tubes!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '🚑 LIFE SAVED AT THE CCS! Mobile X-rays spotted every shrapnel shard, debridement cleared infected mud, and Carrel-Dakin solution irrigated deep inside the wound!',
            examNote: 'Casualty Clearing Stations (CCS, 7–10 miles back near railheads) became the crucial hub for urgent life- and limb-saving anti-gangrene surgery.',
          },
          {
            label: 'Wrap tight bandages over the mud at the ADS and wait 5 days before opening it',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '☠️ Anaerobic Clostridium perfringens bacteria thrive without oxygen! Sealing Flanders mud inside killed him within 24 hours!',
            examNote: 'Manured Western Front soil teemed with gas gangrene spores; wounds had to be opened, debrided, and irrigated via the Carrel-Dakin method within hours.',
          },
          {
            label: 'Inject mass-produced Florey & Chain Penicillin at the ADS',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '⏳ Wrong World War! Mass penicillin saved WWII D-Day troops (1944)—in 1917 WWI, surgeons had ZERO antibiotics!',
            examNote: 'Crucial WWI vs WWII distinction: WWI relied on debridement and Carrel-Dakin antiseptics; penicillin was only mass-produced in WWII.',
          },
        ],
      },
      {
        patient: 'Pte. Harry Briggs (Severe Shock & Blood Loss — Cambrai, Nov 1917)',
        ailment: 'Pale, freezing pulse—he will bleed to death from shock before any ambulance train could ever reach a coastal Base Hospital!',
        avatarMood: 'soldier-pale',
        prompt: 'How did RAMC & US Army Captain Oswald Robertson revolutionise blood transfusions before the Battle of Cambrai (1917)?',
        highlightNode: 2,
        options: [
          {
            label: 'Require a live donor to lie side-by-side on the trench floor connected tube-to-vein',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🩸 Direct syringe/tube transfusion worked in quiet hospitals, not when 500 casualties hit a CCS at once—blood clots in minutes outside the body!',
            examNote: 'Early 1915 transfusions required donor and patient side-by-side because blood clotted immediately.',
          },
          {
            label: 'Deploy the World’s First Blood Bank at the CCS: Type-O blood mixed with Sodium Citrate & Citrate-Glucose chilled on ice in glass bottles!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '🧊 MIRACLE AT CAMBRAI! Sodium citrate stopped clotting and glucose kept red cells alive on ice for up to 26 days! Pte. Briggs’s pulse roars back—off to the Base Hospital for recovery!',
            examNote: 'Lewisohn (1915 sodium citrate), Rous & Turner (1916 citrate-glucose), and Oswald Robertson (1917 Cambrai Blood Depot) made stored blood transfusions possible.',
          },
          {
            label: 'Bleed him with medieval leeches to equalize blood pressure',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🤦 Court-martialled on the spot! Leave the leeches in 1348!',
            examNote: 'Blood group matching (Landsteiner 1901) and citrated storage transformed surgical shock survival on the Western Front.',
          },
        ],
      },
    ],
  },
  {
    id: 'modern',
    shortTab: '5. NHS (1948+)',
    eraBadge: 'SHIFT 5 • MODERN NHS BRITAIN (1948–PRESENT)',
    eraTitle: 'Penicillin, Free Healthcare & The Superbug Boss',
    inspectorTitle: 'NHS Chief Medical Officer',
    accent: '#38bdf8',
    bgGrad: 'linear-gradient(135deg, #0b2239 0%, #071322 100%)',
    propHint: 'Inspect Bevan & 13-year-old Sylvia at Park Hospital (5 July 1948)!',
    taskWhat:
      'Inspect the 1948 NHS launch photograph, treat bacterial pneumonia with mass-produced penicillin, deploy high-tech lung cancer diagnostics, and defeat MRSA!',
    taskWhy:
      'Modern survival combines Big Government (1948 NHS + smoking bans), Wartime/Industrial Mass Production (penicillin), and High-Tech DNA & CT Diagnostics.',
    caseRecordTitle: '1948–Present NHS, Mass Penicillin & DNA',
    caseRecordSummary:
      'Bevan’s tax-funded NHS, Florey & Chain’s penicillin, CT/DNA screening, and strict MRSA stewardship completed an 800-year revolution.',
    cases: [
      {
        patient: 'Working-Class Mother & Child (5 July 1948)',
        ailment: 'Severe bacterial pneumonia—before 1948 she couldn’t afford a GP consultation fee (not covered by the 1911 National Insurance Act, which only covered working men)!',
        avatarMood: 'nhs-patient',
        prompt: 'Aneurin Bevan has just launched the National Health Service AND WWII factories scaled a miracle drug. What happens today?',
        options: [
          {
            label: 'Charge her 10 shillings at the door and hand her an herbal posy',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🏥 Fired on Day 1 of the NHS! Bevan made hospitals, GPs, and prescriptions universal and free at the point of delivery funded by taxation!',
            examNote: 'The 1911 National Insurance Act excluded most women, children, and the elderly; the 1948 NHS guaranteed universal care from cradle to grave.',
          },
          {
            label: 'Treat her FREE at the point of use under the NHS and administer mass-produced Penicillin (developed by Florey & Chain from Fleming’s 1928 mould)!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '💚 FULL RECOVERY IN 48 HOURS! Fleming spotted the Penicillium mould (1928), Florey & Chain purified it in Oxford (1940), and US/UK wartime funding mass-produced the first true antibiotic!',
            examNote: 'Penicillin combined Individual Genius (Fleming, Florey, Chain), War & Government funding (US/UK WWII), and Science/Tech fermentation.',
          },
          {
            label: 'Perform open exploratory chest surgery to look at her lungs because X-rays and CT scans don’t exist',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🩻 Stethoscopes, X-rays, blood tests, and later CT/MRI scans diagnose chest disease non-invasively!',
            examNote: 'Modern high-tech diagnostics (CT, MRI, ultrasound, endoscopes, genetic screening) allow precise diagnosis without exploratory surgery.',
          },
        ],
      },
      {
        patient: '62-Year-Old Persistent Cough & Chest Shadow (Modern Oncology)',
        ailment: 'Suspected early-stage lung tumour—the UK’s second biggest cancer killer.',
        avatarMood: 'modern-scan',
        prompt: 'How do modern NHS high-tech DIAGNOSIS, TREATMENT, and Government PREVENTION combine here?',
        options: [
          {
            label: 'Confirm via CT/PET scan + bronchoscopy biopsy, treat with targeted radiotherapy/keyhole lobectomy, & back government smoking bans/plain packaging!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '🔬 GOLD-STANDARD MODERN MEDICINE! Early CT detection + keyhole robotics + government anti-smoking legislation (2007 indoor ban, plain packs, tax) attack cancer from both ends!',
            examNote: 'Edexcel Case Study (Lung Cancer): High-tech diagnosis (CT/PET/bronchoscopy), combined treatment (keyhole surgery, radiotherapy, chemo, immunotherapy), and active state prevention.',
          },
          {
            label: 'Prescribe a course of Penicillin to dissolve the tumour',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🧬 Cancer is mutated human cells (DNA damage), NOT a bacterial infection—antibiotics do nothing against cancer!',
            examNote: 'Understanding DNA (Crick, Watson, Franklin & Wilkins, 1953) unlocked genetic screening and targeted cancer immunotherapies, whereas antibiotics only target bacteria.',
          },
          {
            label: 'Run TV adverts claiming cigarettes "soothe the throat" like in the 1940s',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🚭 TV cigarette adverts were banned in 1965 (and all tobacco ads in 2002) once Richard Doll proved the smoking-lung cancer link!',
            examNote: 'Modern governments intervene actively in lifestyle prevention (Clean Air Acts 1956, smoking bans 2007, vaccination & screening campaigns).',
          },
        ],
      },
      {
        patient: 'FINAL BOSS: Ward Outbreak of MRSA + Patient Demanding Antibiotics for Flu!',
        ailment: 'Two crises at once: a sneezing viral flu patient demands penicillin, while a post-op patient has antibiotic-resistant MRSA!',
        avatarMood: 'superbug',
        prompt: 'Final Career Exam! How do you defeat the 21st-century Antibiotic Resistance crisis?',
        options: [
          {
            label: 'Hand out double-strength antibiotics for every viral cold and skip handwashing between beds',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🦠 SUPERBUG APOCALYPSE! Over-prescribing antibiotics breeds resistant bacteria through natural selection!',
            examNote: 'Fleming himself warned in 1945 that misusing penicillin would select for resistant strains like MRSA.',
          },
          {
            label: 'Refuse antibiotics for viral flu, enforce strict aseptic isolation/hand-hygiene for MRSA, & use DNA-targeted lab sensitivity testing!',
            isOrthodox: true,
            survived: true,
            inspectorQuip: '🏆 IMMORTAL SURGEON-GENERAL! Zero unnecessary prescriptions, MRSA contained, and 800 years of medical history mastered!',
            examNote: 'Modern hospitals combat superbugs (MRSA, C. diff) via antibiotic stewardship, strict hygiene/screening, and research into new classes of drugs.',
          },
          {
            label: 'Bring back the 1348 shaved chicken just in case',
            isOrthodox: false,
            survived: false,
            inspectorQuip: '🐔 Respectfully, the NHS Infection Control Matron just escorted both you and the chicken out of the building!',
            examNote: 'Evidence-based clinical trials and microbiological testing govern all modern NHS treatments.',
          },
        ],
      },
    ],
  },
];

const ERA_DIORAMAS = {
  medieval: {
    img: '/images/theriac_compounding_apothecary.jpg',
    fxClass: 'diorama-candle-glow',
    hotspots: [
      { x: 26, y: 65, label: '🧪 Humoral Consultation', quip: 'Uroscopy & Four Humours: Galen taught that illness came from imbalanced blood, phlegm, yellow bile, or black bile—checked by urine chart and star signs!' },
      { x: 48, y: 46, label: '🏺 Theriac Shelf Jars', quip: 'Master Apothecary’s Theriac: Up to 60 exotic spices, viper flesh, and herbs compounded into pricey "cure-all" electuaries for wealthy guild patrons.' },
      { x: 73, y: 60, label: '🌿 Mortar & Herbs', quip: 'Apprentice grinding sage, rue, and mint—affordable herbal simples mixed alongside prayers, charms, and seasonal bloodletting!' },
    ],
  },
  renaissance: {
    img: '/images/med_banner_kt2_5_great_plague_1665.jpg',
    fxClass: 'diorama-candle-glow',
    hotspots: [
      { x: 18, y: 22, label: '🛏️ 1665 Sickroom', quip: 'Great Plague Sickroom: Dried lavender, pomanders, and smoking pitch burned to ward off "Miasma"—utterly powerless against rat fleas!' },
      { x: 50, y: 52, label: '⚰️ Watchmen & Dead-Carts', quip: '1665 Mayoral Orders: Infected houses nailed shut with a red cross ("Lord have mercy upon us") while dead-carts rolled out by torchlight.' },
      { x: 82, y: 22, label: '⛵ Flight & New Science', quip: 'While courtiers fled down the Thames, Vesalius (1543), Harvey (1628), and Sydenham (1676) quietly overturned 1,400 years of blind faith in Galen!' },
    ],
  },
  industrial: {
    img: '/images/lister_carbolic_spray.jpg',
    fxClass: 'diorama-mist-glow',
    hotspots: [
      { x: 28, y: 52, label: '💨 Carbolic Steam Spray', quip: 'Joseph Lister’s 1865 Carbolic Acid Steam Sprayer: Smells like Carlisle sewage works, cracks your knuckles yellow, and slashes surgical sepsis from 46% to 15%!' },
      { x: 48, y: 44, label: '🛌 Anaesthesia & Antisepsis', quip: 'Simpson’s 1847 Chloroform ended agonising awake surgery—and Lister’s carbolic mist finally conquered post-operative ward gangrene!' },
      { x: 80, y: 54, label: '🧴 Sterile Instrument Tray', quip: 'Scalpels and catgut ligatures soaked in carbolic acid—paving the way to 1890s aseptic steam sterilisation, rubber gloves, and surgical masks!' },
    ],
  },
  ramc: {
    img: '/images/edexcel_medicine/kt5/med_kt5_l55_banner_ccs_operating_theatre_l0030464.jpg',
    fxClass: 'diorama-candle-glow',
    hotspots: [
      { x: 38, y: 56, label: '🩺 CCS Operating Hut', quip: 'Casualty Clearing Station (CCS): Positioned near railheads outside artillery range so mobile X-rays and urgent surgery stopped gas gangrene in time!' },
      { x: 64, y: 74, label: '🧊 Citrated Blood & Splint', quip: '1917 Cambrai Blood Depot & Thomas Splint: Sodium citrate stored blood on ice for 26 days, while traction splints lifted femur survival from 20% to 82%!' },
      { x: 90, y: 56, label: '🧪 Carrel-Dakin Solution', quip: 'Sterilised salt solution pumped through perforated tubes deep into shrapnel wounds where surface antiseptics could not reach!' },
    ],
  },
  modern: {
    img: '/images/bevan_first_day_nhs_1948.jpg',
    fxClass: '',
    hotspots: [
      { x: 16, y: 66, label: '🏥 First NHS Patient', quip: '5 July 1948 at Park Hospital, Manchester: 13-year-old Sylvia Diggory receives universal hospital care free at the point of delivery!' },
      { x: 34, y: 44, label: '💚 Aneurin Bevan', quip: 'Health Minister Aneurin Bevan united 2,688 voluntary and municipal hospitals into one National Health Service funded through national taxation.' },
      { x: 74, y: 52, label: '💊 Antibiotics & Stewardship', quip: 'From Florey & Chain’s mass-produced wartime penicillin to modern DNA screening, CT/MRI imaging, and strict MRSA antibiotic stewardship!' },
    ],
  },
};

function ensureQuacksStyles() {
  if (typeof document === 'undefined' || document.getElementById('qac-scoped-styles')) return;
  const style = document.createElement('style');
  style.id = 'qac-scoped-styles';
  style.textContent = `
    .qac-shell, .qac-shell * {
      box-sizing: border-box;
    }
    .qac-shell {
      max-width: 1080px;
      width: 100%;
      margin: 0 auto;
      background: #070b14;
      border: 1.5px solid rgba(245, 158, 11, 0.42);
      border-radius: 16px;
      overflow: hidden;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      min-height: 640px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65);
    }
    .qac-shell.qac-is-fullscreen {
      position: fixed !important;
      inset: 0 !important;
      z-index: 99995 !important;
      max-width: none !important;
      width: 100vw !important;
      height: 100vh !important;
      height: 100dvh !important;
      border-radius: 0 !important;
      margin: 0 !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
    }
    .qac-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
      padding: 8px 14px;
      background: #0b1120;
      border-bottom: 1px solid rgba(148, 163, 184, 0.22);
    }
    .qac-nav-pills {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
    }
    .qac-step-pill {
      appearance: none;
      border: 1px solid #334155;
      background: #111827;
      color: #cbd5e1;
      font-size: 0.72rem;
      font-weight: 800;
      padding: 5px 10px;
      border-radius: 999px;
      cursor: pointer;
    }
    .qac-step-pill.is-active {
      background: linear-gradient(135deg, #0284c7, #0369a1);
      border-color: #fde047;
      color: #ffffff;
    }
    .qac-step-pill.is-done:not(.is-active) {
      border-color: #10b981;
      color: #6ee7b7;
    }
    .qac-util-btn {
      appearance: none;
      border: 1px solid rgba(251, 191, 36, 0.45);
      background: rgba(15, 23, 42, 0.9);
      color: #fef3c7;
      font-size: 0.73rem;
      font-weight: 800;
      padding: 5px 10px;
      border-radius: 8px;
      cursor: pointer;
    }
    .qac-body-slot {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .qac-cover-stage {
      flex: 1;
      display: grid;
      grid-template-columns: minmax(260px, 1.02fr) minmax(300px, 1.18fr);
      gap: 24px;
      align-items: center;
      padding: 24px 26px;
      background:
        radial-gradient(ellipse at 25% 35%, rgba(16, 185, 129, 0.16), transparent 60%),
        linear-gradient(180deg, #080d19 0%, #050811 100%);
    }
    .qac-cover-plate {
      background: #f8fafc;
      border: 1.5px solid rgba(245, 158, 11, 0.55);
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 18px 44px rgba(0, 0, 0, 0.75);
    }
    .qac-cover-plate img {
      width: 100%;
      max-height: 320px;
      object-fit: contain;
      display: block;
    }
    .qac-cover-cta-primary {
      width: 100%;
      padding: 12px 18px;
      border-radius: 10px;
      border: 1.5px solid #fde047;
      background: linear-gradient(135deg, #059669 0%, #065f46 100%);
      color: #ffffff;
      font-size: 0.9rem;
      font-weight: 900;
      letter-spacing: 0.03em;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(5, 150, 105, 0.35);
      margin-bottom: 8px;
    }
    .qac-trail-strip {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 8px;
      padding: 10px 16px;
      background: #050811;
      border-top: 1px solid rgba(245, 158, 11, 0.28);
    }
    .qac-trail-node {
      background: rgba(15, 23, 42, 0.78);
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 6px 8px;
      font-size: 0.7rem;
      color: #94a3b8;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .qac-trail-node.is-solved {
      border-color: #10b981;
      color: #d1fae5;
      background: rgba(6, 78, 59, 0.25);
    }
    .qac-wrap {
      padding: 14px 16px;
      width: 100%;
      flex: 1;
      overflow-x: clip;
    }
    .qac-main-split {
      display: grid;
      grid-template-columns: minmax(270px, 0.96fr) minmax(300px, 1.14fr);
      gap: 16px;
      align-items: start;
      margin-top: 12px;
    }
    .qac-stage-card {
      border-radius: 14px;
      padding: 13px;
    }
    .qac-case-card {
      background: #111827;
      border: 1.5px solid #334155;
      border-radius: 14px;
      padding: 18px;
      color: #f8fafc;
    }
    .qac-remedy-grid {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }
    .qac-opt-btn,
    .qac-hotspot-btn,
    .qac-shell .arcade-btn-primary {
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    @media (max-width: 896px) {
      .qac-cover-stage,
      .qac-main-split {
        grid-template-columns: 1fr;
        padding: 14px;
      }
      .qac-trail-strip {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `;
  document.head.appendChild(style);
}

function renderEraSceneWithLoupe(shift, currentCase, activeInspectText, loupePinned) {
  const dio = ERA_DIORAMAS[shift.id] || ERA_DIORAMAS.medieval;
  const activeNode = currentCase?.highlightNode ?? 1;
  const loupeId = `qac-loupe-${shift.id}`;
  const firstHotspot = dio.hotspots[0] || { x: 50, y: 50 };

  const ramcStrip =
    shift.id === 'ramc'
      ? `
      <div class="qac-ramc-strip" style="position:absolute;top:10px;left:10px;right:10px;display:flex;gap:5px;flex-wrap:wrap;z-index:4;">
        ${['1. RAP (200m)', '2. ADS (Triage)', '3. CCS (X-Ray & Blood)', '4. Base Hospital']
          .map(
            (lbl, i) => `
            <span style="flex:1 1 95px;text-align:center;padding:3px 7px;border-radius:7px;font-size:0.68rem;font-weight:900;background:${i === activeNode ? 'rgba(234,179,8,0.94)' : 'rgba(15,23,42,0.88)'};color:${i === activeNode ? '#0f172a' : '#cbd5e1'};border:1.5px solid ${i === activeNode ? '#fef08a' : '#475569'};">
              ${i === activeNode ? '📍 ' : ''}${lbl}
            </span>
          `,
          )
          .join('')}
      </div>
    `
      : '';

  return `
    <div data-loupe-wrap="${loupeId}" data-clue-x="${firstHotspot.x}" data-clue-y="${firstHotspot.y}">
      <div class="diorama-viewport hh-er-loupe-stage" data-loupe-stage="${loupeId}" style="min-height:260px;border-radius:10px;">
        <img src="${dio.img}" alt="${shift.eraTitle}" class="diorama-img" data-loupe-img="${loupeId}" style="object-fit:contain;max-height:310px;" />
        <div class="diorama-vignette"></div>
        ${dio.fxClass ? `<div class="${dio.fxClass}"></div>` : ''}
        ${ramcStrip}
        ${dio.hotspots
          .map(
            (h, hIdx) => `
            <button type="button" class="diorama-hotspot qac-hotspot-btn" data-hidx="${hIdx}" style="left:${h.x}%;top:${h.y}%;z-index:6;">
              ${h.label}
            </button>
          `,
          )
          .join('')}
        <div class="hh-er-loupe-lens" data-loupe-lens="${loupeId}" style="background-image:url('${dio.img}');"></div>
      </div>
      <div class="hh-er-loupe-toolbar" style="border-radius:0 0 10px 10px;">
        <button type="button" class="hh-er-loupe-btn ${loupePinned ? 'is-active' : ''}" data-loupe-spot="${loupeId}">
          ${loupePinned ? '✓ 2.4× Brass Loupe Pinned' : '🔍 Magnify Source 2.4×'}
        </button>
        <span style="font-size:0.69rem;color:#cbd5e1;font-weight:700;">Tap hotspots or hover plate to inspect</span>
      </div>
      ${
        activeInspectText
          ? `<div style="margin-top:8px;padding:8px 11px;border-radius:9px;background:rgba(15,23,42,0.92);border:1px solid ${shift.accent};color:#fef3c7;font-size:0.78rem;line-height:1.4;">🔍 ${activeInspectText}</div>`
          : ''
      }
    </div>
  `;
}

export function mountQuacksAndCures(stageEl, pools, ctx = {}) {
  ensureQuacksStyles();
  const unitId = ctx.unitId || 'edexcel_medicine';

  let mode = 'cover'; // 'cover' | 'prologue' | 'clinic' | 'epilogue' | 'report'
  let cinemaIdx = 0;
  let shiftIdx = 0;
  let caseIdx = 0;
  let score = 0;
  let orthodoxyHits = 0;
  let totalDecisions = 0;
  let guildSuspicion = 0;
  let activeInspectText = '';
  let answeredOutcome = null;
  let xpAwarded = false;
  let isFullscreen = false;
  let audioMuted = false;
  let savedByShift = SHIFTS.map(() => 0);
  const completedShifts = new Set();
  const pinnedLoupes = new Set();
  let pb = getArcadePersonalBest(unitId, 'quacks', 'all');

  const cinemaVoice = createEscapeCinemaVoicePlayer();

  function wakeQuacksAudio() {
    const aCtx = arcadeAudio.ensureContext();
    if (aCtx) window.__hhRegisterAudioCtx?.(aCtx);
  }

  function toggleFullscreen(forceVal) {
    isFullscreen = typeof forceVal === 'boolean' ? forceVal : !isFullscreen;
    if (typeof document !== 'undefined') {
      if (isFullscreen && document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (!isFullscreen && document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
    render();
  }

  const onFsChange = () => {
    if (typeof document !== 'undefined' && !document.fullscreenElement && isFullscreen) {
      isFullscreen = false;
      render();
    }
  };
  if (typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', onFsChange);
  }

  function startCinema(targetMode) {
    wakeQuacksAudio();
    mode = targetMode;
    cinemaIdx = 0;
    const prefix = targetMode === 'epilogue' ? 'quacks_end' : 'quacks_pro';
    render();
    cinemaVoice.play(`${prefix}_1`);
  }

  function restartCareer() {
    wakeQuacksAudio();
    cinemaVoice.stop();
    arcadeAudio.levelUp();
    shiftIdx = 0;
    caseIdx = 0;
    score = 0;
    orthodoxyHits = 0;
    totalDecisions = 0;
    guildSuspicion = 0;
    activeInspectText = '';
    answeredOutcome = null;
    xpAwarded = false;
    savedByShift = SHIFTS.map(() => 0);
    completedShifts.clear();
    pinnedLoupes.clear();
    mode = 'clinic';
    render();
  }

  function pickOption(optIdx) {
    if (answeredOutcome) return;
    wakeQuacksAudio();
    const shift = SHIFTS[shiftIdx];
    const curCase = shift.cases[caseIdx];
    const chosen = curCase.options[optIdx];
    if (!chosen) return;

    totalDecisions++;
    const qId = generateQuestionId(unitId, shift.eraBadge, curCase.prompt);

    if (chosen.isOrthodox) {
      orthodoxyHits++;
      score += 200;
      if (chosen.survived) {
        savedByShift[shiftIdx]++;
        score += 50;
      }
      arcadeAudio.correct();
      recordQuestionResult(
        qId,
        true,
        {
          id: qId,
          q: `${shift.eraBadge}: ${curCase.prompt}`,
          a: chosen.label,
          source: shift.eraTitle,
          explanation: chosen.examNote,
        },
        unitId,
      );
    } else {
      guildSuspicion = Math.min(100, guildSuspicion + 10);
      arcadeAudio.wrong();
      const rightOpt = curCase.options.find((o) => o.isOrthodox);
      recordQuestionResult(
        qId,
        false,
        {
          id: qId,
          q: `${shift.eraBadge}: ${curCase.prompt}`,
          a: rightOpt ? rightOpt.label : '',
          source: shift.eraTitle,
          explanation: chosen.examNote,
        },
        unitId,
      );
    }

    if (caseIdx + 1 >= shift.cases.length) {
      completedShifts.add(shift.id);
    }

    answeredOutcome = { chosen, optIdx };
    render();
  }

  function advanceNext() {
    wakeQuacksAudio();
    const shift = SHIFTS[shiftIdx];
    answeredOutcome = null;
    activeInspectText = '';
    if (caseIdx + 1 < shift.cases.length) {
      caseIdx++;
      render();
    } else if (shiftIdx + 1 < SHIFTS.length) {
      completedShifts.add(shift.id);
      shiftIdx++;
      caseIdx = 0;
      arcadeAudio.levelUp();
      render();
    } else {
      completedShifts.add(shift.id);
      startCinema('epilogue');
    }
  }

  function renderTrailStripHTML() {
    return `
      <div class="qac-trail-strip" aria-label="800-Year Medical Era Trail">
        ${SHIFTS.map((s, sIdx) => {
          const done = completedShifts.has(s.id);
          return `
            <div class="qac-trail-node ${done ? 'is-solved' : ''}">
              <strong style="color:${done ? '#6ee7b7' : '#fbbf24'};">${done ? '🔓' : '🔒'} ${s.shortTab}</strong>
              <span>Saved: ${savedByShift[sIdx]}/${s.cases.length}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderTopChromeHTML() {
    const totalSavedSoFar = savedByShift.reduce((a, b) => a + b, 0);
    const extraBadge = `
      <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(15,23,42,0.9);border:1px solid #34d399;font-size:0.72rem;font-weight:800;color:#6ee7b7;">
        💚 SAVED: ${totalSavedSoFar}/15 ${guildSuspicion > 0 ? `• ⚠️ ANACHRONISM ALERT: ${guildSuspicion}%` : ''}
      </span>
    `;
    return `
      ${renderEscapeBrandBarHTML({
        eraTag: 'GCSE • MEDICINE IN BRITAIN (c.1250–PRESENT)',
        locksCracked: completedShifts.size,
        totalLocks: SHIFTS.length,
        extraBadge,
      })}
      <div class="qac-topbar">
        <div class="qac-nav-pills">
          <button type="button" class="qac-step-pill ${mode === 'cover' ? 'is-active' : ''}" data-qac-mode="cover">🏛️ Cover</button>
          <button type="button" class="qac-step-pill ${mode === 'prologue' ? 'is-active' : ''}" data-qac-cinema="prologue">🎬 Opening</button>
          ${SHIFTS.map(
            (s, sIdx) => `
              <button type="button" class="qac-step-pill ${mode === 'clinic' && shiftIdx === sIdx ? 'is-active' : ''} ${completedShifts.has(s.id) ? 'is-done' : ''}" data-qac-shift="${sIdx}">
                ${completedShifts.has(s.id) ? '✓ ' : ''}${s.shortTab}
              </button>
            `,
          ).join('')}
          <button type="button" class="qac-step-pill ${mode === 'epilogue' ? 'is-active' : ''}" data-qac-cinema="epilogue">🎬 Finale</button>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button type="button" class="qac-util-btn" id="qac-audio-btn">
            ${audioMuted ? '🔇 Audio Off' : '🔊 Audio On'}
          </button>
          <button type="button" class="qac-util-btn" id="qac-fs-btn">
            ${isFullscreen ? '✕ Exit Full Screen' : '⛶ Full Screen'}
          </button>
        </div>
      </div>
    `;
  }

  function renderCoverBodyHTML() {
    return `
      <div class="qac-cover-stage">
        <div class="qac-cover-plate">
          <img src="/images/med_banner_kt3_1_pasteur_lab.jpg" alt="Nineteenth-century engraving of Louis Pasteur peering through a microscope in his laboratory" />
          <div class="hh-er-cinema-caption">
            Monsieur Pasteur in His Laboratory (c.1885) • The 1861 Germ Theory breakthrough that ended five centuries of Galenic guesswork
          </div>
        </div>
        <div>
          ${renderEscapeCoverSealHTML('THE HISTORY REVISION HUB • OFFICIAL MEDICAL ESCAPE CLINIC')}
          <div style="font-size:0.74rem;font-weight:900;letter-spacing:0.12em;color:#34d399;text-transform:uppercase;margin-bottom:6px;">
            FIVE-ERA HOSPITAL SHIFT • EDEXCEL PAPER 1 (c.1250–PRESENT)
          </div>
          <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.65rem,2.8vw,2.25rem);margin:0 0 10px 0;color:#fef3c7;line-height:1.12;">
            Quacks &amp; Cures: 800 Years on Call
          </h2>
          <p style="color:#cbd5e1;font-size:0.92rem;line-height:1.58;margin:0 0 14px 0;">
            Step onto the ward across five historical eras—from <strong>1348 plague apothecaries</strong> and <strong>Vesalius’s Padua anatomy</strong> to <strong>Lister’s carbolic steam spray</strong>, <strong>1917 Western Front triage</strong>, and <strong>Aneurin Bevan’s 1948 NHS</strong>. Magnify authentic medical engravings with your <strong>2.4× Brass Loupe</strong>, spot time-traveller traps, and unlock your Workbook Verification Code!
          </p>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">
            <span class="hh-er-era-pill">🔍 2.4× Medical Plate Loupe</span>
            <span class="hh-er-era-pill">🚑 1917 RAMC Evacuation Map</span>
            <span class="hh-er-era-pill">💚 Live Era Survival Graph</span>
            <span class="hh-er-era-pill">🎙️ Voiced 1348 &amp; 1948 Cinema</span>
          </div>
          <button type="button" class="qac-cover-cta-primary" data-qac-cinema="prologue">
            🎬 WATCH VOICED 800-YEAR CINEMATIC OPENING →
          </button>
          <button type="button" class="hh-er-cover-secondary-cta" data-qac-mode="clinic">
            ⚡ Skip Opening Credits → Start Shift 1: Medieval 1348
          </button>
        </div>
      </div>
      ${renderTrailStripHTML()}
    `;
  }

  function renderCinemaBodyHTML(isEnding) {
    const slides = isEnding ? QUACKS_EPILOGUE : QUACKS_PROLOGUE;
    const s = slides[cinemaIdx] || slides[0];
    const isLast = cinemaIdx >= slides.length - 1;

    const actionsHTML = isEnding
      ? `
        ${
          !isLast
            ? `<button type="button" class="qac-cover-cta-primary" style="width:auto;margin:0;" id="qac-cinema-next-btn">▶ Next Finale Scene (${cinemaIdx + 2}/${slides.length}) →</button>`
            : `<button type="button" class="qac-cover-cta-primary" style="width:auto;margin:0;" id="qac-open-report-btn">🏆 View 800-Year Career Report &amp; Workbook Code →</button>`
        }
        <button type="button" class="qac-util-btn" id="qac-cinema-replay-btn">🔊 Replay Voiceover</button>
      `
      : `
        ${
          !isLast
            ? `<button type="button" class="qac-cover-cta-primary" style="width:auto;margin:0;" id="qac-cinema-next-btn">▶ Next Opening Scene (${cinemaIdx + 2}/${slides.length}) →</button>`
            : `<button type="button" class="qac-cover-cta-primary" style="width:auto;margin:0;" data-qac-mode="clinic">🩺 Start Shift 1: 1348 Medieval Apothecary →</button>`
        }
        <button type="button" class="qac-util-btn" id="qac-cinema-replay-btn">🔊 Replay Voiceover</button>
        <button type="button" class="qac-util-btn" data-qac-mode="clinic">Skip Prologue →</button>
      `;

    return renderAtmosphericCinemaHTML({
      topLeftLabel: isEnding
        ? 'THE HISTORY REVISION HUB • 800-YEAR MEDICAL FINALE CINEMA'
        : 'THE HISTORY REVISION HUB • MEDICINE ARCHIVE CINEMA (1348–1948)',
      topRightLabel: `SCENE ${cinemaIdx + 1} OF ${slides.length} • 🎙️ STUDIO VOICEOVER`,
      slideIndex: cinemaIdx,
      totalSlides: slides.length,
      vignetteTone: s.vignette,
      imgSrc: s.img,
      imgAlt: s.alt,
      caption: s.caption,
      credit: s.credit,
      heading: s.heading,
      narrationHTML: `<p style="margin:0;">${s.narration}</p>`,
      actionsHTML,
      dotAttr: 'data-qac-cdot',
      extraFooterHTML: renderTrailStripHTML(),
    });
  }

  function renderClinicBodyHTML() {
    const shift = SHIFTS[shiftIdx];
    const curCase = shift.cases[caseIdx];
    const totalSavedSoFar = savedByShift.reduce((a, b) => a + b, 0);
    const shiftSaved = savedByShift[shiftIdx];
    const loupeId = `qac-loupe-${shift.id}`;

    const caseItems = SHIFTS.map((s, sIdx) => ({
      collected: completedShifts.has(s.id),
      title: s.caseRecordTitle,
      summary: s.caseRecordSummary,
      lockedLabel: `Era Record #${sIdx + 1} (${s.shortTab.replace(/^\d+\.\s*/, '')})`,
      lockedHint: 'Complete all 3 patients in this shift to archive its medical breakthrough.',
    }));

    return `
      <div class="qac-wrap">
        <div class="tlb-hud qac-hud" style="border-color:${shift.accent};margin-bottom:10px;">
          <div class="tlb-stat"><span>Score</span><strong class="cyan">${score}</strong></div>
          <div class="tlb-stat"><span>Period Accuracy</span><strong class="amber">${orthodoxyHits}/${totalDecisions}</strong></div>
          <div class="tlb-stat"><span>Shift Saved</span><strong class="${shiftSaved > 0 ? 'green' : ''}">${shiftSaved}/${shift.cases.length}</strong></div>
          <div class="tlb-stat"><span>Total Saved</span><strong class="green">${totalSavedSoFar}/15</strong></div>
          <div class="tlb-stat"><span>Best</span><strong>${Math.max(pb, score)}</strong></div>
        </div>

        ${renderTaskDirectiveBannerHTML({
          kicker: `🎯 ${shift.eraBadge} • PATIENT ${caseIdx + 1} OF ${shift.cases.length}`,
          whatToDo: shift.taskWhat,
          whyItMatters: shift.taskWhy,
          solved: Boolean(answeredOutcome),
        })}

        <div class="qac-main-split">
          <div class="qac-stage-card" style="background:${shift.bgGrad};border:2px solid ${shift.accent};">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px;">
              <span style="background:rgba(0,0,0,0.45);border:1px solid ${shift.accent};color:#fde047;padding:3px 10px;border-radius:999px;font-size:0.71rem;font-weight:900;">
                ${shift.eraTitle}
              </span>
              <span style="font-size:0.73rem;color:#cbd5e1;font-weight:700;">${shift.propHint}</span>
            </div>
            ${renderEraSceneWithLoupe(shift, curCase, activeInspectText, pinnedLoupes.has(loupeId))}
          </div>

          <div class="qac-case-card">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:10px;">
              <div>
                <div style="font-size:0.72rem;font-weight:800;text-transform:uppercase;color:${shift.accent};">PATIENT ON THE COUCH</div>
                <h3 style="margin:2px 0 0 0;font-size:1.2rem;color:#ffffff;">${curCase.patient}</h3>
              </div>
              <span style="background:#1e293b;border:1px solid #475569;color:#cbd5e1;font-size:0.74rem;font-weight:700;padding:4px 10px;border-radius:6px;">
                Inspector: ${shift.inspectorTitle}
              </span>
            </div>

            <div style="background:#0b1120;border-left:4px solid #ef4444;border-radius:8px;padding:10px 13px;margin-bottom:12px;color:#fecaca;font-size:0.9rem;line-height:1.45;">
              <strong>Symptoms:</strong> &ldquo;${curCase.ailment}&rdquo;
            </div>

            <p style="margin:0 0 12px 0;font-weight:800;color:#f8fafc;font-size:0.95rem;">
              ${curCase.prompt}
            </p>

            <div class="qac-remedy-grid">
              ${curCase.options
                .map((opt, oIdx) => {
                  let cls = '';
                  if (answeredOutcome) {
                    if (opt.isOrthodox) cls = 'right';
                    else if (answeredOutcome.optIdx === oIdx) cls = 'wrong';
                  }
                  return `
                    <button type="button" class="bsp-opt-btn qac-opt-btn ${cls}" data-idx="${oIdx}" ${answeredOutcome ? 'disabled' : ''}>
                      <span class="bsp-key">${String.fromCharCode(65 + oIdx)}</span>
                      <span>${opt.label}</span>
                    </button>
                  `;
                })
                .join('')}
            </div>

            ${
              answeredOutcome
                ? `
              <div style="margin-top:14px;background:${answeredOutcome.chosen.isOrthodox ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'};border:1.5px solid ${answeredOutcome.chosen.isOrthodox ? '#10b981' : '#ef4444'};border-radius:12px;padding:13px 15px;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
                  <strong style="color:${answeredOutcome.chosen.isOrthodox ? '#6ee7b7' : '#fca5a5'};font-size:0.9rem;">
                    ${answeredOutcome.chosen.inspectorQuip}
                  </strong>
                  <span style="background:#0f172a;border:1px solid #475569;padding:3px 10px;border-radius:999px;font-size:0.73rem;font-weight:800;color:${answeredOutcome.chosen.survived ? '#34d399' : '#f87171'};">
                    ${answeredOutcome.chosen.survived ? '💚 PATIENT LIVED!' : '💀 PATIENT DIED!'}
                  </span>
                </div>
                <p style="margin:0 0 12px 0;font-size:0.84rem;color:#cbd5e1;line-height:1.45;">
                  <strong>🎓 Edexcel Paper 1 Exam Link:</strong> ${answeredOutcome.chosen.examNote}
                </p>
                <button type="button" class="arcade-btn-primary" id="qac-next-btn">
                  ${
                    caseIdx + 1 < shift.cases.length
                      ? 'See Next Patient'
                      : shiftIdx + 1 < SHIFTS.length
                        ? `Advance Time Machine → ${SHIFTS[shiftIdx + 1].eraBadge.split('•')[1].trim()}`
                        : '🎬 Watch Voiced 800-Year Medical Finale'
                  }
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            `
                : ''
            }
          </div>
        </div>
      </div>
      ${renderHistoricalCaseFileHTML({
        heading: '📂 ROYAL MEDICAL ARCHIVE CASE FILE — 800 YEARS OF CHANGE & CONTINUITY',
        items: caseItems,
      })}
    `;
  }

  function renderCareerReportBodyHTML() {
    wakeQuacksAudio();
    if (!xpAwarded) {
      xpAwarded = true;
      arcadeAudio.levelUp();
      window.hhAwardXp?.({ amount: 30, source: 'quacks_and_cures', unitId: 'edexcel_medicine' });
    }
    const { isNewBest, best } = saveArcadePersonalBest(unitId, 'quacks', 'all', score);
    pb = best;
    const totalSaved = savedByShift.reduce((a, b) => a + b, 0);
    const isGold = orthodoxyHits >= 12 && guildSuspicion <= 20;

    const rank =
      orthodoxyHits >= 13
        ? '👑 Immortal Surgeon-General of the NHS'
        : orthodoxyHits >= 10
          ? '🩺 Fellow of the Royal Society & RAMC'
          : '🐔 Master of the Medieval Plague Chicken';

    return `
      <div class="qac-wrap" style="display:flex;align-items:center;justify-content:center;padding:24px 16px;">
        <div class="arcade-result-panel" style="max-width:790px;width:100%;margin:0 auto;">
          <div style="font-size:2.7rem;margin-bottom:4px;">${isGold ? '🥇' : isNewBest ? '🏆' : '🩺'}</div>
          <div style="display:inline-block;background:rgba(56,189,248,0.15);border:1.5px solid #38bdf8;color:#bae6fd;font-weight:800;padding:5px 16px;border-radius:999px;margin-bottom:12px;">
            ${isGold ? '🥇 GOLD MEDICAL HISTORIAN SEAL • ' : ''}${rank}
          </div>

          <div class="arcade-gameover-stats">
            <div><span>Career Score</span><strong>${score}</strong></div>
            <div><span>Period Accuracy</span><strong>${orthodoxyHits} / 15</strong></div>
            <div><span>Patients Saved</span><strong>${totalSaved} / 15</strong></div>
            <div><span>Personal Best</span><strong>${best}</strong></div>
          </div>

          <div style="background:#0f172a;border:1.5px solid #334155;border-radius:14px;padding:15px 18px;text-align:left;margin-bottom:14px;">
            <div style="font-size:0.77rem;font-weight:800;text-transform:uppercase;color:#fde047;margin-bottom:9px;">
              📊 Edexcel Paper 1 Change &amp; Continuity — Patients Saved by Era:
            </div>
            ${SHIFTS.map((s, sIdx) => {
              const pct = Math.round((savedByShift[sIdx] / s.cases.length) * 100);
              return `
                <div style="margin-bottom:7px;">
                  <div style="display:flex;justify-content:space-between;font-size:0.81rem;color:#e2e8f0;margin-bottom:2px;">
                    <span><strong>${s.eraBadge.split('•')[1].trim()}</strong></span>
                    <span style="color:${pct === 0 ? '#f87171' : '#34d399'};font-weight:800;">${savedByShift[sIdx]}/${s.cases.length} Saved (${pct === 0 && sIdx === 0 ? '0% — Historical Reality!' : pct + '%'})</span>
                  </div>
                  <div style="height:8px;background:#1e293b;border-radius:999px;overflow:hidden;">
                    <div style="height:100%;width:${Math.max(4, pct)}%;background:${s.accent};border-radius:999px;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div style="text-align:left;margin-bottom:16px;">
            ${renderWorkbookCodeCardHTML({
              slotLabel: 'MEDICINE IN BRITAIN WORKBOOK • BACK COVER VERDICT LEDGER',
              phrase: 'GERM THEORY PENICILLIN AND NHS TRANSFORMED SURVIVAL',
              instruction:
                'Write this exact unlocked verdict phrase into the Escape Room Verdict Ledger on the Back Cover of your Medicine in Britain Pupil Workbook!',
            })}
          </div>

          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
            <button type="button" class="qac-util-btn" data-qac-cinema="epilogue" style="padding:10px 16px;">
              🎬 Replay 800-Year Cinema Finale
            </button>
            <button type="button" class="arcade-btn-primary" id="qac-replay-btn">
              <i class="fa-solid fa-rotate-right"></i> Start Another 800-Year Career
            </button>
          </div>
        </div>
      </div>
    `;
  }

  stageEl.innerHTML = `<div class="qac-shell" id="qac-root-shell"></div>`;
  const shellEl = stageEl.querySelector('#qac-root-shell');

  bindArchivalLoupeDelegation(shellEl, (loupeId) => {
    if (pinnedLoupes.has(loupeId)) pinnedLoupes.delete(loupeId);
    else {
      pinnedLoupes.add(loupeId);
      score += 15;
    }
    wakeQuacksAudio();
    arcadeAudio.zoom?.();
  });

  function render() {
    if (!shellEl) return;
    shellEl.classList.toggle('qac-is-fullscreen', isFullscreen);

    let bodyHTML = '';
    if (mode === 'cover') bodyHTML = renderCoverBodyHTML();
    else if (mode === 'prologue') bodyHTML = renderCinemaBodyHTML(false);
    else if (mode === 'epilogue') bodyHTML = renderCinemaBodyHTML(true);
    else if (mode === 'report') bodyHTML = renderCareerReportBodyHTML();
    else bodyHTML = renderClinicBodyHTML();

    shellEl.innerHTML = `
      ${renderTopChromeHTML()}
      <div class="qac-body-slot">${bodyHTML}</div>
    `;

    shellEl.querySelector('#qac-audio-btn')?.addEventListener('click', () => {
      audioMuted = !audioMuted;
      cinemaVoice.setMuted(audioMuted);
      render();
    });

    shellEl.querySelector('#qac-fs-btn')?.addEventListener('click', () => toggleFullscreen());

    shellEl.querySelectorAll('[data-qac-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        cinemaVoice.stop();
        mode = btn.getAttribute('data-qac-mode') || 'clinic';
        render();
      });
    });

    shellEl.querySelectorAll('[data-qac-cinema]').forEach((btn) => {
      btn.addEventListener('click', () => {
        startCinema(btn.getAttribute('data-qac-cinema'));
      });
    });

    shellEl.querySelectorAll('[data-qac-shift]').forEach((btn) => {
      btn.addEventListener('click', () => {
        cinemaVoice.stop();
        const nextShift = parseInt(btn.getAttribute('data-qac-shift'), 10);
        if (!Number.isNaN(nextShift)) {
          shiftIdx = nextShift;
          caseIdx = 0;
          answeredOutcome = null;
          activeInspectText = '';
          mode = 'clinic';
          render();
        }
      });
    });

    shellEl.querySelector('#qac-cinema-next-btn')?.addEventListener('click', () => {
      const isEnd = mode === 'epilogue';
      const arr = isEnd ? QUACKS_EPILOGUE : QUACKS_PROLOGUE;
      cinemaIdx = Math.min(arr.length - 1, cinemaIdx + 1);
      render();
      cinemaVoice.play(`${isEnd ? 'quacks_end' : 'quacks_pro'}_${cinemaIdx + 1}`);
    });

    shellEl.querySelectorAll('[data-qac-cdot]').forEach((dot) => {
      dot.addEventListener('click', () => {
        cinemaIdx = parseInt(dot.getAttribute('data-qac-cdot'), 10) || 0;
        const isEnd = mode === 'epilogue';
        render();
        cinemaVoice.play(`${isEnd ? 'quacks_end' : 'quacks_pro'}_${cinemaIdx + 1}`);
      });
    });

    shellEl.querySelector('#qac-cinema-replay-btn')?.addEventListener('click', () => {
      cinemaVoice.replay();
    });

    shellEl.querySelector('#qac-open-report-btn')?.addEventListener('click', () => {
      cinemaVoice.stop();
      mode = 'report';
      render();
    });

    shellEl.querySelectorAll('.qac-hotspot-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        wakeQuacksAudio();
        const shift = SHIFTS[shiftIdx];
        const dio = ERA_DIORAMAS[shift.id] || ERA_DIORAMAS.medieval;
        const h = dio.hotspots[parseInt(btn.dataset.hidx, 10)];
        if (h) {
          activeInspectText = h.quip;
          arcadeAudio.zoom?.();
          render();
        }
      });
    });

    shellEl.querySelectorAll('.qac-opt-btn').forEach((btn) => {
      btn.addEventListener('click', () => pickOption(parseInt(btn.dataset.idx, 10)));
    });

    shellEl.querySelector('#qac-next-btn')?.addEventListener('click', advanceNext);
    shellEl.querySelector('#qac-replay-btn')?.addEventListener('click', restartCareer);
  }

  render();

  return () => {
    cinemaVoice.destroy();
    if (typeof document !== 'undefined') {
      document.removeEventListener('fullscreenchange', onFsChange);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };
}
