/**
 * KS2 Junior School Teacher Planning Hub & Worksheet Companion Engine
 * Provides non-specialist primary teachers with:
 * - 1-Click access to 2-Page A4 Enquiry Worksheets & 28-Page Master Pupil Workbook (PDF & Print)
 * - Key Stage 2 National Curriculum links & 4-part lesson timelines
 * - Factual subject knowledge primers (including map and historical context)
 * - Common primary misconceptions & hinge discussion questions
 * - Complete worksheet answer keys corresponding 1:1 with Tasks 1–5 on the A4 worksheets & Pupil Workbook
 *
 * Strict School Anonymity & Institutional Neutrality under 'The History Revision Hub'.
 */

import {
  KS2_STONE_AGE_WORKSHEETS_MAP,
  KS2_STONE_AGE_TEACHER_GUIDANCE,
} from './ks2_stone_age_guidance.js';
import {
  KS2_ROMANS_WORKSHEETS_MAP,
  KS2_ROMANS_TEACHER_GUIDANCE,
} from './ks2_romans_guidance.js';
import {
  KS2_SAXONS_WORKSHEETS_MAP,
  KS2_SAXONS_TEACHER_GUIDANCE,
} from './ks2_saxons_guidance.js';
import {
  KS2_EGYPT_WORKSHEETS_MAP,
  KS2_EGYPT_TEACHER_GUIDANCE,
} from './ks2_egypt_guidance.js';
import {
  KS2_GREECE_WORKSHEETS_MAP,
  KS2_GREECE_TEACHER_GUIDANCE,
} from './ks2_greece_guidance.js';
import {
  KS2_BAGHDAD_WORKSHEETS_MAP,
  KS2_BAGHDAD_TEACHER_GUIDANCE,
} from './ks2_baghdad_guidance.js';
import {
  KS2_MAYA_WORKSHEETS_MAP,
  KS2_MAYA_TEACHER_GUIDANCE,
} from './ks2_maya_guidance.js';

// Backwards-compatible alias normalization across all KS2 modular guidance packs
[
  ...Object.values(KS2_STONE_AGE_TEACHER_GUIDANCE),
  ...Object.values(KS2_ROMANS_TEACHER_GUIDANCE),
  ...Object.values(KS2_SAXONS_TEACHER_GUIDANCE),
  ...Object.values(KS2_EGYPT_TEACHER_GUIDANCE),
  ...Object.values(KS2_GREECE_TEACHER_GUIDANCE),
  ...Object.values(KS2_BAGHDAD_TEACHER_GUIDANCE),
  ...Object.values(KS2_MAYA_TEACHER_GUIDANCE),
].forEach((g) => {
  if (g && g.answers) {
    g.answers.block1 = g.answers.task1;
    g.answers.block2 = g.answers.task2;
    g.answers.block3 = g.answers.task3;
    g.answers.block4 = g.answers.task4;
    g.answers.block5_wagoll = g.answers.task5_wagoll;
  }
});

function detectActiveKs2UnitId() {
  if (typeof window === 'undefined') return 'ks2_ww2';
  const cand =
    window.currentUnitId ||
    window.appStore?.state?.currentUnitId ||
    window.appStore?.state?.activeUnitData?.id ||
    window.currentUnitData?.id ||
    '';
  if (cand === 'ks2_stone_to_iron_age') return 'ks2_stone_to_iron_age';
  if (cand === 'ks2_romans') return 'ks2_romans';
  if (cand === 'ks2_anglo_saxons_vikings') return 'ks2_anglo_saxons_vikings';
  if (cand === 'ks2_ancient_egypt') return 'ks2_ancient_egypt';
  if (cand === 'ks2_ancient_greece') return 'ks2_ancient_greece';
  if (cand === 'ks2_early_islamic_baghdad') return 'ks2_early_islamic_baghdad';
  if (cand === 'ks2_maya_civilisation') return 'ks2_maya_civilisation';
  return 'ks2_ww2';
}

function getActiveKs2UnitConfig(explicitUnitId) {
  const unitId = explicitUnitId || detectActiveKs2UnitId();
  if (unitId === 'ks2_stone_to_iron_age') {
    return {
      unitId: 'ks2_stone_to_iron_age',
      worksheetsMap: KS2_STONE_AGE_WORKSHEETS_MAP,
      guidanceMap: KS2_STONE_AGE_TEACHER_GUIDANCE,
      totalLessons: 6,
      workbookPagesLabel: '16-Page',
      fullWorkbookUrl: '/units/ks2_stone_to_iron_age/pupil_workbook.html',
      fullWorkbookPdf: '/pdfs/ks2_stone_to_iron_age_pupil_workbook.pdf',
      spineWorkbookUrl: '/units/ks2_stone_to_iron_age/pupil_workbook_spine.html',
      spineWorkbookPdf: '/pdfs/ks2_stone_to_iron_age_pupil_workbook_spine.pdf',
      sowUrl: '/units/ks2_stone_to_iron_age/ks2_stone_to_iron_age_scheme_of_work.html',
      sowLabel: '6-Lesson Scheme of Work',
      wagollAgeLabel: 'Key Stage 2 Aspirational Model Answer',
      skillsPeriod: 'c. 800,000 BC–AD 43',
    };
  }
  if (unitId === 'ks2_romans') {
    return {
      unitId: 'ks2_romans',
      worksheetsMap: KS2_ROMANS_WORKSHEETS_MAP,
      guidanceMap: KS2_ROMANS_TEACHER_GUIDANCE,
      totalLessons: 6,
      workbookPagesLabel: '16-Page',
      fullWorkbookUrl: '/units/ks2_romans/pupil_workbook.html',
      fullWorkbookPdf: '/pdfs/ks2_romans_pupil_workbook.pdf',
      spineWorkbookUrl: '/units/ks2_romans/pupil_workbook_spine.html',
      spineWorkbookPdf: '/pdfs/ks2_romans_pupil_workbook_spine.pdf',
      sowUrl: '/units/ks2_romans/ks2_romans_scheme_of_work.html',
      sowLabel: '6-Lesson Scheme of Work',
      wagollAgeLabel: 'Key Stage 2 Aspirational Model Answer',
      skillsPeriod: '55 BC–AD 410',
    };
  }
  if (unitId === 'ks2_anglo_saxons_vikings') {
    return {
      unitId: 'ks2_anglo_saxons_vikings',
      worksheetsMap: KS2_SAXONS_WORKSHEETS_MAP,
      guidanceMap: KS2_SAXONS_TEACHER_GUIDANCE,
      totalLessons: 6,
      workbookPagesLabel: '16-Page',
      fullWorkbookUrl: '/units/ks2_anglo_saxons_vikings/pupil_workbook.html',
      fullWorkbookPdf: '/pdfs/ks2_anglo_saxons_vikings_pupil_workbook.pdf',
      spineWorkbookUrl: '/units/ks2_anglo_saxons_vikings/pupil_workbook_spine.html',
      spineWorkbookPdf: '/pdfs/ks2_anglo_saxons_vikings_pupil_workbook_spine.pdf',
      sowUrl: '/units/ks2_anglo_saxons_vikings/ks2_anglo_saxons_vikings_scheme_of_work.html',
      sowLabel: '6-Lesson Scheme of Work',
      wagollAgeLabel: 'Key Stage 2 Aspirational Model Answer',
      skillsPeriod: 'AD 410–1066',
    };
  }
  if (unitId === 'ks2_ancient_egypt') {
    return {
      unitId: 'ks2_ancient_egypt',
      worksheetsMap: KS2_EGYPT_WORKSHEETS_MAP,
      guidanceMap: KS2_EGYPT_TEACHER_GUIDANCE,
      totalLessons: 6,
      workbookPagesLabel: '16-Page',
      fullWorkbookUrl: '/units/ks2_ancient_egypt/pupil_workbook.html',
      fullWorkbookPdf: '/pdfs/ks2_ancient_egypt_pupil_workbook.pdf',
      spineWorkbookUrl: '/units/ks2_ancient_egypt/pupil_workbook_spine.html',
      spineWorkbookPdf: '/pdfs/ks2_ancient_egypt_pupil_workbook_spine.pdf',
      sowUrl: '/units/ks2_ancient_egypt/ks2_ancient_egypt_scheme_of_work.html',
      sowLabel: '6-Lesson Scheme of Work',
      wagollAgeLabel: 'Key Stage 2 Aspirational Model Answer',
      skillsPeriod: 'c. 3100–30 BC',
    };
  }
  if (unitId === 'ks2_ancient_greece') {
    return {
      unitId: 'ks2_ancient_greece',
      worksheetsMap: KS2_GREECE_WORKSHEETS_MAP,
      guidanceMap: KS2_GREECE_TEACHER_GUIDANCE,
      totalLessons: 6,
      workbookPagesLabel: '16-Page',
      fullWorkbookUrl: '/units/ks2_ancient_greece/pupil_workbook.html',
      fullWorkbookPdf: '/pdfs/ks2_ancient_greece_pupil_workbook.pdf',
      spineWorkbookUrl: '/units/ks2_ancient_greece/pupil_workbook_spine.html',
      spineWorkbookPdf: '/pdfs/ks2_ancient_greece_pupil_workbook_spine.pdf',
      sowUrl: '/units/ks2_ancient_greece/ks2_ancient_greece_scheme_of_work.html',
      sowLabel: '6-Lesson Scheme of Work',
      wagollAgeLabel: 'Key Stage 2 Aspirational Model Answer',
      skillsPeriod: 'c. 800–146 BC',
    };
  }
  if (unitId === 'ks2_early_islamic_baghdad') {
    return {
      unitId: 'ks2_early_islamic_baghdad',
      worksheetsMap: KS2_BAGHDAD_WORKSHEETS_MAP,
      guidanceMap: KS2_BAGHDAD_TEACHER_GUIDANCE,
      totalLessons: 6,
      workbookPagesLabel: '16-Page',
      fullWorkbookUrl: '/units/ks2_early_islamic_baghdad/pupil_workbook.html',
      fullWorkbookPdf: '/pdfs/ks2_early_islamic_baghdad_pupil_workbook.pdf',
      spineWorkbookUrl: '/units/ks2_early_islamic_baghdad/pupil_workbook_spine.html',
      spineWorkbookPdf: '/pdfs/ks2_early_islamic_baghdad_pupil_workbook_spine.pdf',
      sowUrl: '/units/ks2_early_islamic_baghdad/ks2_early_islamic_baghdad_scheme_of_work.html',
      sowLabel: '6-Lesson Scheme of Work',
      wagollAgeLabel: 'Key Stage 2 Aspirational Model Answer',
      skillsPeriod: 'c. AD 750–1258',
    };
  }
  if (unitId === 'ks2_maya_civilisation') {
    return {
      unitId: 'ks2_maya_civilisation',
      worksheetsMap: KS2_MAYA_WORKSHEETS_MAP,
      guidanceMap: KS2_MAYA_TEACHER_GUIDANCE,
      totalLessons: 6,
      workbookPagesLabel: '16-Page',
      fullWorkbookUrl: '/units/ks2_maya_civilisation/pupil_workbook.html',
      fullWorkbookPdf: '/pdfs/ks2_maya_civilisation_pupil_workbook.pdf',
      spineWorkbookUrl: '/units/ks2_maya_civilisation/pupil_workbook_spine.html',
      spineWorkbookPdf: '/pdfs/ks2_maya_civilisation_pupil_workbook_spine.pdf',
      sowUrl: '/units/ks2_maya_civilisation/ks2_maya_civilisation_scheme_of_work.html',
      sowLabel: '6-Lesson Scheme of Work',
      wagollAgeLabel: 'Key Stage 2 Aspirational Model Answer',
      skillsPeriod: 'c. 2000 BC–AD 1500',
    };
  }
  return {
    unitId: 'ks2_ww2',
    worksheetsMap: KS2_WORKSHEETS_MAP,
    guidanceMap: KS2_TEACHER_GUIDANCE_DATA,
    totalLessons: 11,
    workbookPagesLabel: '28-Page',
    fullWorkbookUrl: '/units/ks2_ww2/pupil_workbook.html',
    fullWorkbookPdf: '/pdfs/ks2_ww2_pupil_workbook.pdf',
    spineWorkbookUrl: '/units/ks2_ww2/pupil_workbook_spine.html',
    spineWorkbookPdf: '/pdfs/ks2_ww2_pupil_workbook_spine.pdf',
    sowUrl: '/units/ks2_ww2/ks2_ww2_scheme_of_work.html',
    sowLabel: '11-Lesson Scheme of Work',
    wagollAgeLabel: 'Key Stage 2 Aspirational Model Answer',
    skillsPeriod: '1933–1945',
  };
}

export const KS2_WORKSHEETS_MAP = {
  lesson_1: {
    num: 1,
    id: 'lesson_1',
    title: 'Enquiry 1: Outbreak 1939 & Home Front Mobilisation',
    subtitle: 'Cardboard Gas Mask Boxes & Blackout Preparations in September 1939',
    enquiryQuestion: 'Why did British families carry gas masks and black out windows in 1939?',
    html: '/units/ks2_ww2/worksheets/lesson_01_outbreak_gasmasks_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_01_outbreak_gasmasks_worksheet.pdf',
    desc: '2-page A4 enquiry worksheet with civilian gas mask inspection, 3-stage September 1939 timeline, illustrated Home Front kit & carrier label SVG, and contrasting viewpoints.',
  },
  lesson_2: {
    num: 2,
    id: 'lesson_2',
    title: 'Enquiry 2: Operation Pied Piper & British Evacuation',
    subtitle: '1.5 Million Children Sent to the Countryside with Brown Luggage Labels',
    enquiryQuestion: 'What was it like for evacuated children to be sent away in 1939?',
    html: '/units/ks2_ww2/worksheets/lesson_02_evacuation_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_02_evacuation_worksheet.pdf',
    hasOptionalCraftPage3: true,
    desc: '2-page core A4 enquiry worksheet (Evacuation GIS map, 3-stage timeline, tie-on coat label SVG & postcard) + optional Sheet 3 stitched suitcase craft.',
  },
  lesson_3: {
    num: 3,
    id: 'lesson_3',
    title: 'Enquiry 3: Pre-War Life & Rights Lost (1933–1938)',
    subtitle: 'Everyday Childhoods & How Anti-Jewish Laws Took Away Rights Step by Step',
    enquiryQuestion: 'How were Jewish children’s everyday rights taken away in Nazi Germany?',
    html: '/units/ks2_ww2/worksheets/lesson_03_prewar_life_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_03_prewar_life_worksheet.pdf',
    desc: '2-page A4 enquiry worksheet contrasting pre-war sports & family life, exclusion signs, the 1933–1938 step-down staircase SVG, and contrasting viewpoints.',
  },
  lesson_4: {
    num: 4,
    id: 'lesson_4',
    title: 'Enquiry 4: One Small Suitcase — The Kindertransport (1938–1939)',
    subtitle: '10,000 Unaccompanied Refugee Children Rescued Across Europe to Britain',
    enquiryQuestion: 'How did 10,000 Kindertransport children travel alone to safety in Britain?',
    html: '/units/ks2_ww2/worksheets/lesson_04_kindertransport_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_04_kindertransport_worksheet.pdf',
    hasOptionalCraftPage3: true,
    desc: "2-page core A4 enquiry worksheet (Kindertransport GIS route map, 3-stage timeline & Vera's numbered pass SVG) + optional Sheet 3 stitched suitcase craft.",
  },
  lesson_5: {
    num: 5,
    id: 'lesson_5',
    title: 'Enquiry 5: Who Were the Rescuers? (1938–1939)',
    subtitle: 'Nicholas Winton, Trevor Chadwick & The Rescue of 669 Children from Prague',
    enquiryQuestion: 'How did ordinary volunteers rescue 669 children from Prague before war began?',
    html: '/units/ks2_ww2/worksheets/lesson_05_rescuers_winton_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_05_rescuers_winton_worksheet.pdf',
    desc: "2-page A4 enquiry worksheet exploring Nicholas Winton's 1939 newspaper foster appeal, the Prague-to-London rescue chain SVG, and being an upstander.",
  },
  lesson_6: {
    num: 6,
    id: 'lesson_6',
    title: 'Enquiry 6: The Blitz & Air Raids (1940–1941)',
    subtitle: '57 Consecutive Nights of Bombing, Shelters & Community Survival',
    enquiryQuestion: 'How did British families keep safe when bombs fell during the Blitz?',
    html: '/units/ks2_ww2/worksheets/lesson_06_the_blitz_shelters_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_06_the_blitz_shelters_worksheet.pdf',
    desc: '2-page A4 enquiry worksheet with Anderson vs Morrison shelter architectural cutaway SVG, Underground platforms, and fire watchers.',
  },
  lesson_7: {
    num: 7,
    id: 'lesson_7',
    title: 'Enquiry 7: Dig for Victory & Wartime Rationing (1940–1945)',
    subtitle: 'Coupon Books, Atlantic Convoys & Growing Vegetables Across Britain',
    enquiryQuestion: 'Why did Britain ration food and ask families to ‘Dig for Victory’?',
    html: '/units/ks2_ww2/worksheets/lesson_07_dig_for_victory_rationing_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_07_dig_for_victory_rationing_worksheet.pdf',
    desc: '2-page A4 enquiry worksheet with coupon book & poster enquiry, 1942 weekly adult ration plate & allotment basket SVG, and wartime menu planning.',
  },
  lesson_8: {
    num: 8,
    id: 'lesson_8',
    title: 'Enquiry 8: Women at War (1941–1945)',
    subtitle: 'Munitions Factories, Lumberjills & 80,000 Women in the Land Army',
    enquiryQuestion: 'How did women’s work on farms and in factories keep Britain fighting?',
    html: '/units/ks2_ww2/worksheets/lesson_08_women_at_war_land_army_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_08_women_at_war_land_army_worksheet.pdf',
    desc: "2-page A4 enquiry worksheet on the Women's Land Army, Lumberjills, Canary Girls, ATA ferry pilots, and four wartime role insignia SVG.",
  },
  lesson_9: {
    num: 9,
    id: 'lesson_9',
    title: 'Enquiry 9: Secret Codebreakers & Bletchley Park (1941–1945)',
    subtitle: 'Enigma Machines, Alan Turing, Bombe Machines & Keeping Station X Secret',
    enquiryQuestion: 'How did secret codebreakers at Bletchley Park help win the war?',
    html: '/units/ks2_ww2/worksheets/lesson_09_bletchley_codebreakers_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_09_bletchley_codebreakers_worksheet.pdf',
    desc: "2-page A4 enquiry worksheet examining Enigma rotors, Alan Turing's Bombe, the Station X cipher wheel SVG ('HUT EIGHT'), and the Official Secrets Act.",
  },
  lesson_10: {
    num: 10,
    id: 'lesson_10',
    title: 'Enquiry 10: VE Day, Rebuilding Britain & Remembrance (1945)',
    subtitle: '8 May 1945 Celebrations, Mixed Emotions & Remembering Sacrifice',
    enquiryQuestion: 'Why did VE Day bring both street parties and sadness across Britain?',
    html: '/units/ks2_ww2/worksheets/lesson_10_ve_day_remembrance_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_10_ve_day_remembrance_worksheet.pdf',
    desc: '2-page A4 enquiry worksheet exploring VE Day street parties, VJ Day, the 1948 NHS, the 1945–1954 milestone ribbon SVG, and Remembrance.',
  },
  lesson_11: {
    num: 11,
    id: 'lesson_11',
    title: 'Enquiry 11: After the War — The Windermere Children (1945)',
    subtitle: 'From Prague to Lake Windermere • The Calgarth Estate & Rebuilding Lives',
    enquiryQuestion: 'How did 300 child survivors rebuild their lives by Lake Windermere?',
    html: '/units/ks2_ww2/worksheets/lesson_11_windermere_children_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_11_windermere_children_worksheet.pdf',
    desc: '2-page A4 enquiry worksheet exploring the August 1945 RAF Stirling airlift to Carlisle, healing at Calgarth Estate, and Kindertransport vs Windermere SVG.',
  },
};

export const KS2_TEACHER_GUIDANCE_DATA = {
  lesson_1: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Home Front: Outbreak & Civilian Defences).`,
    timeline: [
      { time: '00–10 mins', phase: 'Do Now Starter', activity: 'Pupils complete the retrieval starter checking prior knowledge of 1914–18, maps of Europe, wireless radio, and Britain in 1939.' },
      { time: '10–25 mins', phase: 'Primary Source Enquiry', activity: 'Project Source A (schoolchildren practising a playground gas mask drill) and Source B (1939 civilian black rubber gas mask & filter tin). Discuss using the Hinge Question.' },
      { time: '25–50 mins', phase: 'Worksheet Application', activity: 'Pupils complete Task 1 (Gas Mask Detective), Task 2 (3-Stage September 1939 Timeline synced with the board), Task 3 (Home Front Emergency Kit & Carrier Label), and Task 4 (Thinking Heads).' },
      { time: '50–60 mins', phase: 'Plenary & Quiz', activity: 'Pupils write their Task 5 Mission Challenge paragraph answering the Enquiry Question and complete the retrieval check.' },
    ],
    subjectPrimer: `On 1 September 1939, Nazi Germany invaded Poland and Britain immediately enforced a nationwide Blackout at sunset. Two days later, on Sunday 3 September 1939 at 11:15am, Prime Minister Neville Chamberlain announced on BBC wireless radio that Britain was at war with Germany. Within minutes, a false-alarm air raid siren wailed across London. Remembering poison gas from the First World War, the government issued 38 million rubber gas masks in cardboard boxes with string shoulder straps (including bright "Mickey Mouse" masks for toddlers). Streetlamps were switched off, car headlights were hooded, windows were covered with thick black curtains, and families taped brown gummed paper across glass panes to stop flying splinters.`,
    misconceptions: [
      { misconception: `Children often believe heavy German bombing started on the very first day of the war.`, correction: `Explain that the first eight months in Britain became known as the "Phoney War" because heavy night bombing of cities did not begin until September 1940. Gas masks, blackout curtains, and wardens prepared families early.` },
      { misconception: `Children assume gas masks were optional or only given to soldiers.`, correction: `Gas masks were issued free to every civilian—38 million in total. Toddlers aged two to four received bright red-and-blue "Mickey Mouse" masks, and babies had enclosed gas helmets with hand-pumped bellows.` },
    ],
    hingeQuestion: `Why did the British government give a gas mask to every baby, child, and adult before a single bomb had fallen on Britain?`,
    hingeGuidance: `Look for pupils explaining that leaders remembered poison gas in the First World War and feared enemy bomber planes might drop gas on crowded cities without warning, so families had to be protected in advance.`,
    answers: {
      task1: `1) Rubber Mask, Eyepiece & Filter Tin: The tight black rubber seal kept poisoned air out, the clear window let the wearer see, and chemicals inside the front green metal filter tin cleaned poisonous gas from the air breathed in. 2) Cardboard Box & String Strap: Carried over the shoulder everywhere (school, shops, and play) so nobody would be caught outdoors without protection if a gas rattle sounded, while protecting the rubber mask from tearing.`,
      task2: `Stage 1 (How families heard war had begun on 3 Sept 1939): Families gathered around wooden wireless radios at 11:15am on Sunday 3 September 1939 to hear Prime Minister Neville Chamberlain broadcast from 10 Downing Street. Stage 2 (Why 38 million gas masks were given out): Leaders remembered deadly poison gas in WWI and feared enemy bombers would drop gas on British towns. Stage 3 (How families & ARP wardens kept streets dark): Streetlamps were switched off, families hung thick black curtains over windows, kerbs were painted white, and 1.4 million volunteer ARP wardens patrolled calling "Put that light out!"`,
      task3: `1) Cardboard Box & String Strap: Protected the rubber mask from knocks and rain while leaving both hands free. 2) Anti-Dimming Stick: Rubbed inside the eyepieces so warm breath would not mist up the clear window. 3) Criss-Cross Window Tape: Stopped glass panes shattering into sharp flying splinters during bomb blasts. 4) National Identity Card: Proved every citizen’s identity for rationing and helped reunite families separated in air raids.`,
      task4: `Viewpoint 1 (10-Year-Old Schoolchild): Hot rubber smells strange and makes voices sound muffled, yet practising together with classmates and teachers makes air raid drills feel calmer. Viewpoint 2 (ARP Warden): Even one chink of bedroom light could guide night bombers towards the whole neighbourhood, so checking curtains protects every neighbour on the street.`,
      task5_wagoll: `In September 1939, British families carried cardboard gas mask boxes and blacked out their windows because the government feared enemy planes would drop poison gas and high-explosive bombs on towns and cities. Every citizen received one of 38 million rubber gas masks to carry on a shoulder string wherever they went. At sunset, strict Blackout curtains hid towns from bombers overhead, criss-cross brown paper tape stopped glass splintering indoors, and 1.4 million volunteer ARP wardens patrolled dark streets to keep the Home Front safe.`,
    },
  },

  lesson_2: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Home Front: Evacuation & Operation Pied Piper).`,
    timeline: [
      { time: '00–10 mins', phase: 'Do Now Starter', activity: 'Retrieval check recapping Lesson 1 (11:15am 3 September 1939, 38 million gas masks, Blackout, and ARP wardens).' },
      { time: '10–25 mins', phase: 'Dual Source Enquiry', activity: 'Examine Source A (schoolchildren walking to a station wearing luggage labels and gas mask boxes) and Source B (Operation Pied Piper GIS Map of danger cities and rural reception areas).' },
      { time: '25–50 mins', phase: 'Worksheet Application', activity: 'Pupils complete Task 1 (Luggage Label & Map Detective), Task 2 (3-Stage Pied Piper Timeline), Task 3 (Coat Label SVG & Packing List), and Task 4 (Thinking Heads). Optional Sheet 3 suitcase craft available.' },
      { time: '50–60 mins', phase: 'Plenary & Postcard', activity: 'Pupils write their Task 5 Postcard Home to Mum and Dad and complete the retrieval check.' },
    ],
    subjectPrimer: `On Friday 1 September 1939—two days before war was officially declared—the government launched Operation Pied Piper. Across three days, 1.5 million schoolchildren, teachers, and mothers with children under five left industrial and port cities such as London, Manchester, Liverpool, Birmingham, and Glasgow for safer countryside "reception areas" in Devon, Cornwall, Wales, East Anglia, and rural counties. Each child wore a brown cardboard luggage label tied to their coat. At village halls, Billeting Officers matched children with local host families.`,
    misconceptions: [
      { misconception: `Pupils often assume every evacuee had a happy countryside holiday—or that every host family was unkind.`, correction: `Show pupils that experiences varied enormously: many loved farm life and stayed friends with host families for decades, while others felt terribly homesick or faced strict, unkind hosts.` },
      { misconception: `Children assume parents travelled on the trains with school-age evacuees.`, correction: `Mothers only travelled with babies and toddlers under five. School-age children travelled in school groups with their teachers and WVS helpers.` },
    ],
    hingeQuestion: `Looking at Source B (the Evacuation Map), why did trains take London children west to Devon, Cornwall, and Wales rather than south-east to Kent?`,
    hingeGuidance: `Guide pupils to spot that Kent lay closest to mainland Europe directly beneath enemy bomber flight paths, whereas western rural counties were much further away and had fewer large factories or docks.`,
    answers: {
      task1: `1) Brown Luggage Label & Helpers: Every child wore a tied coat label showing their name, school, and destination so nobody got lost among 1.5 million travellers; schoolteachers, railway staff, police, and WVS volunteers guided lines onto the trains. 2) Why West to Devon, Cornwall & Wales Instead of Kent: Source B shows Kent lay right across the narrow English Channel near enemy bomber routes, whereas western countryside counties were far away from bomber airfields and crowded city docks.`,
      task2: `Stage 1 (Why Operation Pied Piper moved 1.5 million people): To move schoolchildren and mothers with toddlers out of industrial and port cities at high risk of bombing into safer rural reception areas before raids began. Stage 2 (Why evacuees felt nervous in the village hall): Tired after a long journey without their parents, children had to wait for Billeting Officers to match them with complete strangers. Stage 3 (Why city children had such different lives on farms): Country villages had green fields, farm animals, and fresh air—some host families were warm and loving, while other children felt homesick or worked for strict hosts.`,
      task3: `1) Compulsory Gas Mask: Enemy planes might still fly over or drop gas near country towns, so masks had to be carried everywhere. 2) Warm Jumper, Nightclothes & Boots: Country cottages had cold bedrooms and muddy lanes in autumn and winter. 3) Wash Kit (Toothbrush, Towel & Soap): Host families had limited supplies, so each child brought their own hygiene kit. 4) Sandwiches, Apple & Stamped Postcard: Kept children fed on long delayed train journeys and let them post their safe arrival address straight home to worried parents.`,
      task4: `Viewpoint 1 (City Evacuee in the Village Hall): Missing Mum and Dad after waving goodbye at the barrier, amazed by green fields and cows, yet anxious wondering which stranger will take me home. Viewpoint 2 (Countryside Host Mother): Preparing spare beds, hot soup, and a warm welcome to keep tired, homesick city children safe from air raids.`,
      task5_wagoll: `Dear Mum and Dad, I arrived safely in Devon after a long steam train ride with my school class! My brown luggage label stayed tied to my coat and I kept my gas mask box safe over my shoulder. At the village hall, the Billeting Officer placed me with Mrs Evans, who lives in a stone cottage beside a farm. Today I helped feed pigs and saw orchards for the first time, though it feels very quiet at night without London buses. I miss you both lots—please write soon! Love, Sam.`,
    },
  },

  lesson_3: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Holocaust: Pre-War Jewish Life & Step-by-Step Loss of Rights, 1933–1938). Grounded in trauma-informed primary history safeguarding principles.`,
    safeguardingNote: `<strong>HET Primary Safeguarding &amp; Trauma-Informed Practice (Enquiry 3):</strong> Always begin with rich pre-war Jewish family life, hobbies, and individuality before introducing Nazi persecution. <strong>Never</strong> use classroom roleplay, simulations, or "imagine you are banned" segregation games, and <strong>never</strong> display graphic atrocity imagery to KS2 pupils.`,
    timeline: [
      { time: '00–10 mins', phase: 'Do Now Starter', activity: 'Retrieval check recapping Lessons 1–2 (Operation Pied Piper, Billeting Officers, reception areas, and September 1939).' },
      { time: '10–25 mins', phase: 'Dual Source Enquiry', activity: 'Examine Source A (1925 SC Hakoah Vienna Jewish sports club football team) and Source B (c. 1935–1937 German anti-Jewish exclusion sign reading "Juden werden hier nicht bedient" / "Jews are not served here").' },
      { time: '25–50 mins', phase: 'Worksheet Application', activity: 'Pupils complete Task 1 (Photo & Exclusion Sign Detective), Task 2 (3-Stage 1933–1938 Timeline), Task 3 (Step-by-Step Rights Staircase Comparison), and Task 4 (Thinking Heads).' },
      { time: '50–60 mins', phase: 'Plenary & Reflection', activity: 'Pupils write their Task 5 Mission Challenge paragraph and complete the retrieval quiz.' },
    ],
    subjectPrimer: `Before Adolf Hitler and the Nazi Party took power in Germany in January 1933, Jewish families across Germany, Austria, and Czechoslovakia lived ordinary, settled lives as neighbours, doctors, shopkeepers, musicians, teachers, and schoolchildren. Between 1933 and 1938—before WWII began—the Nazi government passed hundreds of unfair anti-Jewish laws step by step: putting up exclusion signs ("Jews are not served here"), banning Jewish people from sports clubs and parks, stripping German citizenship under the 1935 Nuremberg Laws, attacking synagogues and shops on 9–10 November 1938 (Kristallnacht), and expelling all Jewish children from state schools on 15 November 1938.`,
    misconceptions: [
      { misconception: `Pupils sometimes imagine Jewish families lived completely separately from everyone else before 1933.`, correction: `Show through pre-war sports and school photos (like six-year-olds carrying their Schultüte sweet cones) that Jewish families were proud citizens integrated into everyday town life.` },
      { misconception: `Pupils assume all rights vanished on a single day in 1939 when war began.`, correction: `Explain that unfair laws built up step by step across five peacetime years (1933–1938), making life unsafe before war had even started.` },
    ],
    hingeQuestion: `What does Source A (the Jewish sports club football team) prove about Jewish communities before Nazi laws shut them out?`,
    hingeGuidance: `Look for pupils explaining that Jewish families enjoyed ordinary sports, teamwork, community pride, and everyday life, showing how much was unfairly taken away between 1933 and 1938.`,
    answers: {
      task1: `1) What Source A Proves: Shows proud footballers of Jewish club SC Hakoah Vienna before a packed stadium, proving Jewish communities had thriving hobbies, sports teams, pride, and ordinary everyday lives. 2) Why Study Pre-War Photos First: Seeing real families and children enjoying normal life first helps historians remember them as full human beings rather than only looking at Nazi exclusion signs like Source B.`,
      task2: `Stage 1 (Everyday childhoods before the war): Jewish children went to local schools with friends, carried a Schultüte sweet cone on their first school day, played in football teams, and rode bicycles. Stage 2 (How Nazi laws took away rights after 1933): Step by step, unfair laws banned Jewish people from sports clubs, parks, and pools, and the 1935 Nuremberg Laws stripped away citizenship. Stage 3 (November 1938): On 9–10 November 1938 (Kristallnacht), synagogues and Jewish shops were violently attacked, and on 15 November all Jewish children were expelled from German state schools.`,
      task3: `1) School & Friendships: Before 1933 Jewish children learned beside classmates in local schools; on 15 Nov 1938 they were banned from state schools altogether. 2) Football, Pools & Parks: Shut out of sports teams, swimming baths, cinemas, and park benches by exclusion signs. 3) 1935 Nuremberg Laws: Stripped German Jewish families of citizenship and equal legal protection. 4) After Kristallnacht (Nov 1938): Violent attacks on synagogues, homes, and shops showed staying had become physically dangerous, so parents searched urgently for rescue visas.`,
      task4: `Viewpoint 1 (Jewish Pupil Shut Out of School, Nov 1938): Hurt, bewildered, and lonely standing outside closed school gates despite having done nothing wrong. Viewpoint 2 (Non-Jewish Classmate Inside): Troubled looking at a friend’s empty desk, realising how unfair adult laws have separated classmates.`,
      task5_wagoll: `Jewish children’s everyday rights in Nazi Germany were taken away step by step between 1933 and 1938 before the war even began. Before 1933, Jewish families in cities like Berlin and Vienna lived settled lives, sharing schools and sports clubs. After Hitler took power in 1933, exclusion signs ("Jews are not served here") shut families out of shops, parks, and swimming pools, and the 1935 Nuremberg Laws stripped away their citizenship. Finally, after the violent Kristallnacht attacks in November 1938, Jewish children were banned from state schools altogether, forcing parents to seek urgent safety abroad.`,
    },
  },

  lesson_4: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Holocaust: One Small Suitcase — The Kindertransport, 1938–1939).`,
    safeguardingNote: `<strong>HET Primary Safeguarding &amp; Trauma-Informed Practice (Enquiry 4):</strong> Celebrate rescue while acknowledging painful family separation gently. Ask historically grounded questions ("What did nine-year-old Vera pack and why?") rather than personal trauma prompts ("What if you never saw your parents again?").`,
    timeline: [
      { time: '00–10 mins', phase: 'Do Now Starter', activity: 'Retrieval check recapping Lesson 3 (pre-war Jewish life, 1935 Nuremberg Laws, Kristallnacht, and November 1938 school ban).' },
      { time: '10–25 mins', phase: 'Dual Source Enquiry', activity: 'Investigate Source A (Kindertransport children arriving in Britain with numbered tags) and Source B (GIS Kindertransport Route Map via Bentheim, Hook of Holland, Harwich, and Liverpool Street).' },
      { time: '25–50 mins', phase: 'Worksheet Application', activity: "Pupils complete Task 1 (Identity Tag & Map Detective), Task 2 (3-Stage Kindertransport Timeline), Task 3 (Vera's One Small Suitcase & Pass), and Task 4 (Thinking Heads). Optional Sheet 3 suitcase craft available." },
      { time: '50–60 mins', phase: 'Plenary & Quiz', activity: 'Pupils write their Task 5 Mission Challenge paragraph and complete the retrieval check.' },
    ],
    subjectPrimer: `Days after Kristallnacht in November 1938, Parliament agreed to admit unaccompanied refugee children aged under 17 quickly if sponsors promised a £50 guarantee per child, though parents were not given visas. Between December 1938 and August 1939, nearly 10,000 mostly Jewish children escaped from Berlin, Vienna, Prague, and Frankfurt across the Dutch border to Hook of Holland, sailed overnight to Harwich, and took boat trains to London Liverpool Street Station. Nine-year-old Vera Löwyová (later Vera Schaufeld) left Prague in May 1939 with one small suitcase, her porcelain doll, and an autograph diary signed by her parents.`,
    misconceptions: [
      { misconception: `Pupils confuse British evacuation (Operation Pied Piper) with the Kindertransport.`, correction: `British evacuees moved inside the UK in Sept 1939 to escape air raids; Kindertransport children fled persecution across borders BEFORE war started (Dec 1938–Aug 1939), spoke little English, and most never saw their parents again.` },
      { misconception: `Pupils assume the government paid for the trains and let parents travel too.`, correction: `Parents were refused visas under the scheme, and charities and British families had to guarantee £50 per child.` },
    ],
    hingeQuestion: `Using Source B (the Route Map), why did crossing the border at Bentheim into the Netherlands feel like the first real moment of safety?`,
    hingeGuidance: `Inside Nazi-controlled territory, armed guards searched trains and suitcases; once across the Dutch border into the neutral Netherlands, kind volunteers welcomed the children with hot cocoa, buns, and reassurance before the ferry to Harwich.`,
    answers: {
      task1: `1) Numbered Neck Tags: Worn on string around each child’s neck so British helpers at Harwich and London Liverpool Street could safely match young children who spoke no English yet with their sponsors and foster families. 2) Crossing Into the Netherlands: Inside Nazi Germany armed guards inspected trains, so crossing the border at Bentheim meant leaving Nazi control behind and being greeted with hot cocoa and kindness by Dutch volunteers.`,
      task2: `Stage 1 (Why Parliament allowed 10,000 children in): British MPs and charities were shocked by the violent Kristallnacht attacks in November 1938 and waived visa delays for under-17s with a £50 sponsor guarantee. Stage 2 (Why Vera’s parents sent her with one suitcase): Nazi rules allowed only one small case with no valuables, and parents were refused visas, so sending nine-year-old Vera alone was the only way to save her life. Stage 3 (How trains & ferries brought children to London): Sealed steam trains crossed Europe into the Netherlands to Hook of Holland, overnight ferries sailed to Harwich in Essex, and boat trains steamed into London Liverpool Street Station.`,
      task3: `1) Slightly Larger Warm Clothes: Vera’s mother knew Vera was growing and did not know how long they would be apart. 2) Family Photograph: Kept precious faces of Mum, Dad, and Grandmother close in a strange country. 3) English Porcelain Doll: Familiar comfort object for a frightened 9-year-old travelling alone. 4) Signed Autograph Diary: Held her parents’ loving handwritten Czech messages, which Vera treasured all her life.`,
      task4: `Viewpoint 1 (Nine-Year-Old Vera on the Train): Trying to be brave waving to Mum and Dad on Prague platform, clutching my doll and diary while wondering what England will be like. Viewpoint 2 (British Foster Mother at Liverpool Street): Smiling gently, using simple gestures, a warm meal, and a cosy bedroom to help a tired Czech-speaking child feel safe.`,
      task5_wagoll: `Nearly 10,000 Kindertransport children travelled alone to safety in Britain between December 1938 and August 1939 after Parliament allowed under-17s in with a £50 sponsor guarantee following Kristallnacht. Because parents were not granted visas, nine-year-old Vera Löwyová (Vera Schaufeld) had to wave goodbye to her mother and father in Prague carrying just one small suitcase, her doll, and a signed diary. Travelling on sealed trains across the Dutch border, by overnight ferry from Hook of Holland to Harwich, and into London Liverpool Street Station brought life-saving safety alongside deep family heartbreak.`,
    },
  },

  lesson_5: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Holocaust: Rescuers & Upstanders, 1938–1939).`,
    safeguardingNote: `<strong>HET Primary Safeguarding &amp; Trauma-Informed Practice (Enquiry 5):</strong> Highlight practical moral courage and teamwork across Prague and London, handling the stopped ninth train on 1 September 1939 factually and gently without graphic detail.`,
    timeline: [
      { time: '00–10 mins', phase: 'Do Now Starter', activity: "Retrieval check recapping Lesson 4 (Kristallnacht, £50 guarantee, Vera's suitcase, Hook of Holland, and Liverpool Street)." },
      { time: '10–25 mins', phase: 'Dual Source Enquiry', activity: 'Examine Source A (Für Das Kind Kindertransport bronze sculpture at Liverpool Street) and Source B (1939 Stoke-on-Trent newspaper appeal pasted inside Nicholas Winton’s scrapbook).' },
      { time: '25–50 mins', phase: 'Worksheet Application', activity: 'Pupils complete Task 1 (Scrapbook Appeal Detective), Task 2 (3-Stage Rescue Chain), Task 3 (Attic Secret & Upstanders), and Task 4 (Thinking Heads).' },
      { time: '50–60 mins', phase: 'Plenary & Quiz', activity: 'Pupils write their Task 5 Mission Challenge paragraph and complete the retrieval check.' },
    ],
    subjectPrimer: `In December 1938, 29-year-old London office worker Nicholas Winton cancelled his Swiss skiing holiday to visit refugee camps in Prague. Setting up a desk in the Hotel Alcron dining room, he listed thousands of endangered children. Back in London, Winton and his mother Babette placed newspaper photo appeals to find British foster homes and £50 guarantees, while schoolteacher Trevor Chadwick and Doreen Warriner organised eight trains in Prague—saving 669 children before war closed the borders on 1 September 1939. Winton kept his scrapbook quietly in his attic until 1988.`,
    misconceptions: [
      { misconception: `Pupils assume Nicholas Winton was a powerful politician or worked alone.`, correction: `Winton was an ordinary 29-year-old clerk working evenings in London alongside his mother Babette, Doreen Warriner, Trevor Chadwick in Prague, and hundreds of British foster families.` },
    ],
    hingeQuestion: `Why could neither London volunteers nor Prague volunteers have rescued the 669 children without the other?`,
    hingeGuidance: `In London, Winton and Babette had to secure a named foster family and £50 Home Office permit for every child; in Prague, Chadwick and Warriner had to gather travel papers and get the children safely onto sealed trains.`,
    answers: {
      task1: `1) Newspaper Appeals (Source B): Placing children’s photographs and urgent appeals in local British papers like Stoke-on-Trent reached ordinary families across Britain willing to offer a foster home and £50 guarantee. 2) Why Accurate Scrapbook Records Mattered: Ensured every arriving child matched a verified foster address in 1939, and fifty years later in 1988 allowed grown-up "Nicky’s Children" to trace how they had been rescued.`,
      task2: `Stage 1 (Why Winton cancelled his ski holiday in Dec 1938): Friend Martin Blake asked him to come to Prague instead, where Winton saw families in freezing refugee camps and set up a rescue desk at his hotel. Stage 2 (How volunteers in Prague & London got children to safety): Winton and his mother Babette found British foster sponsors and £50 visas in London while Trevor Chadwick and Doreen Warriner organised 8 trains from Prague. Stage 3 (How the world discovered the scrapbook in 1988): Winton’s wife Grete found the 1939 scrapbook in their attic, leading to the famous BBC That’s Life! reunion with rescued survivors.`,
      task3: `1) Fitting Rescue Around a Day Job: Worked at the London Stock Exchange by day, then typed Home Office letters and foster appeals late every evening. 2) Kept Quiet for 50 Years: He helped children out of moral duty rather than for fame, and felt lasting sorrow for the ninth train stopped on 1 September 1939. 3) Upstander: Someone who steps forward to help others facing unfairness or danger instead of looking away as a bystander. 4) British Foster Families: Without hundreds of ordinary families opening their homes and promising £50, the Home Office would not have issued visas.`,
      task4: `Viewpoint 1 (Trevor Chadwick on Prague Platform): Keeping a steady voice while armed Gestapo guards watch, checking every visa stamp and comforting crying parents as the whistle blows. Viewpoint 2 (Nicholas Winton Late at Night in London): Every extra foster sponsor and Home Office permit completed tonight means another child reaches Britain before war slams borders shut.`,
      task5_wagoll: `Ordinary volunteers rescued 669 children from Prague before war began through determined teamwork across two countries. After cancelling his skiing holiday in December 1938, 29-year-old Nicholas Winton listed endangered children at Prague’s Hotel Alcron, then worked every evening in London with his mother Babette placing newspaper appeals for British foster homes and £50 guarantees. Meanwhile, Doreen Warriner and schoolteacher Trevor Chadwick braved danger in Prague to put children onto eight trains before war broke out on 1 September 1939—showing what ordinary upstanders can achieve.`,
    },
  },

  lesson_6: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Home Front: The Blitz & Air Raid Defences, 1940–1941).`,
    safeguardingNote: `<strong>Sensory &amp; Conflict-Sensitive Classroom Note (Enquiry 6):</strong> Warn the class before playing any wartime siren audio clip, keep volume low, and emphasise community teamwork and protection.`,
    timeline: [
      { time: '00–10 mins', phase: 'Do Now Starter', activity: 'Retrieval check recapping Lesson 5 (Nicholas Winton, Prague, Trevor Chadwick, 669 children, and 1988 scrapbook).' },
      { time: '10–25 mins', phase: 'Dual Source Enquiry', activity: 'Examine Source A (family outside a soil-covered garden Anderson shelter) and Source B (Londoners sleeping on a deep Underground platform), alongside the GIS Map of Blitz Cities.' },
      { time: '25–50 mins', phase: 'Worksheet Application', activity: 'Pupils complete Task 1 (Shelter Detective), Task 2 (3-Stage Blitz Timeline), Task 3 (Shelter Cutaway SVG & Night Survival Kit), and Task 4 (Thinking Heads).' },
      { time: '50–60 mins', phase: 'Plenary & Quiz', activity: 'Pupils write their Task 5 Mission Challenge paragraph and complete the retrieval check.' },
    ],
    subjectPrimer: `From 7 September 1940 ("Black Saturday") until May 1941, the Luftwaffe launched the Blitz—bombing London for 57 consecutive nights alongside major ports and industrial cities including Coventry, Liverpool, Birmingham, Plymouth, Portsmouth, Clydebank (Glasgow), Hull, Bristol, and Belfast. Households with gardens buried corrugated steel Anderson shelters under 15 inches of soil; families without gardens slept inside steel-mesh Morrison table cages (from 1941) or deep Underground stations, while ARP wardens and Auxiliary Firefighters battled blazes above.`,
    misconceptions: [
      { misconception: `Pupils often think the Blitz only hit London.`, correction: `Show on the GIS Blitz Map that Clydebank (Glasgow), Belfast, Liverpool, Hull, Coventry, Birmingham, and Plymouth were all heavily raided for their docks, shipyards, and Spitfire/shell factories.` },
      { misconception: `Pupils assume every family could dig an Anderson shelter.`, correction: `City flats and terraced streets often had no gardens, making indoor steel Morrison cages and deep Tube platforms essential.` },
    ],
    hingeQuestion: `Why did German bombers target port cities like Liverpool and Clydebank and factory cities like Coventry alongside London?`,
    hingeGuidance: `Liverpool and Clydebank unloaded and built Atlantic ships, while Coventry made aircraft engines—raiding ports and factories aimed to break Britain’s supplies and morale.`,
    answers: {
      task1: `1) How Anderson & Tube Shelters Protected Families: Curved corrugated steel buried under 15 inches of garden soil absorbed blast waves and flying shrapnel, while deep Underground Tube platforms lay tens of feet beneath London clay. 2) Why Not Everyone Built an Anderson Shelter & Keeping Spirits Up: Families in flats or paved terraces had no garden soil to dig into; underground, people shared blankets, WVS mugs of hot tea, and community singing.`,
      task2: `Stage 1 (Why Hitler launched The Blitz in Sept 1940): After failing to defeat the RAF in the Battle of Britain, Hitler ordered night raids on London, ports, and factories to break British morale and war production. Stage 2 (How Anderson & Morrison shelters protected families): Garden Anderson shelters used curved steel under 15 inches of earth against blasts, while indoor steel-topped Morrison cages shielded sleepers if upstairs ceilings collapsed. Stage 3 (Tube stations & rooftop teams): Up to 177,000 Londoners slept safely on Tube bunks below while ARP wardens, fire watchers, and Auxiliary Firefighters tackled incendiary bombs above.`,
      task3: `1) 15 Inches of Garden Soil: Thick earth cushioned blast shockwaves and stopped sharp metal shrapnel (and families even grew vegetables on top!). 2) Indoor Morrison Cage: Its thick steel tabletop supported falling brickwork if upper floors collapsed during a raid. 3) Blankets, Hot Tea & Biscuits: Sunken garden shelters were freezing and damp on winter nights. 4) Torch, First-Aid Tin & Games: Blackout rules meant pitch darkness, and quiet card games, knitting, or songs calmed frightened children during long raids.`,
      task4: `Viewpoint 1 (Child in a Garden Anderson Shelter): Shivering under woollen blankets listening to distant thuds, feeling braver singing together with Mum by torchlight. Viewpoint 2 (Auxiliary Firefighter / Fire Watcher): Braving smoke, sparks, and falling shrapnel with sand buckets and hoses so incendiary fires do not spread down the street.`,
      task5_wagoll: `British families kept safe during the Blitz of 1940–1941 through clever shelter engineering and brave community teamwork. When the wailing siren sounded across cities from London to Coventry, Liverpool, and Clydebank, families with gardens hurried into corrugated steel Anderson shelters buried under 15 inches of blast-absorbing soil. Families without gardens slept inside strong steel-mesh Morrison table cages indoors or on deep London Underground platforms, while ARP wardens and Auxiliary Firefighters risked their lives fighting fires until the All Clear sounded at dawn.`,
    },
  },

  lesson_7: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Home Front: Rationing & Dig for Victory, 1940–1945).`,
    timeline: [
      { time: '00–10 mins', phase: 'Do Now Starter', activity: 'Retrieval check recapping Lesson 6 (Black Saturday 7 Sept 1940, Anderson & Morrison shelters, Tube platforms, and Blitz cities).' },
      { time: '10–25 mins', phase: 'Dual Source Enquiry', activity: 'Investigate Source A (1940 Ministry of Food Ration Book) and Source B (Dig for Victory poster), alongside the GIS Atlantic Lifeline Map.' },
      { time: '25–50 mins', phase: 'Worksheet Application', activity: 'Pupils complete Task 1 (Ration Book & Poster Detective), Task 2 (3-Stage Rationing Timeline), Task 3 (1942 Weekly Ration Plate SVG & Wartime Menu), and Task 4 (Thinking Heads).' },
      { time: '50–60 mins', phase: 'Plenary & Quiz', activity: 'Pupils write their Task 5 Mission Challenge paragraph and complete the retrieval check.' },
    ],
    subjectPrimer: `Before 1939, island Britain imported over two-thirds of its food across the Atlantic. When German U-boats attacked merchant convoys, the Ministry of Food introduced coupon rationing in January 1940 under "Fair Shares for All" (buff books for adults, green priority books with extra milk and vitamins for expectant mothers and toddlers). Meanwhile, "Dig for Victory" turned 1.4 million allotments, parks, and school fields into unrationed vegetable patches.`,
    misconceptions: [
      { misconception: `Pupils assume British children grew weaker and less healthy under rationing.`, correction: `With guaranteed fair rations, less sugar, plenty of home-grown vegetables, and free milk and cod liver oil, British children actually grew taller and healthier than before the war!` },
      { misconception: `Pupils think home-grown potatoes and carrots were rationed.`, correction: `Fresh garden vegetables and potatoes stayed unrationed throughout the war.` },
    ],
    hingeQuestion: `How did growing potatoes and carrots in a British back garden help protect merchant sailors crossing the Atlantic Ocean?`,
    hingeGuidance: `Every ton of food grown at home freed up cargo space on ships and meant fewer sailors had to risk crossing U-boat wolf-pack danger zones.`,
    answers: {
      task1: `1) Coupons in Source A: Shopkeepers snipped or stamped dated coupons for every rationed item, so wealthy shoppers could not buy extra bacon, butter, or sugar without coupons. 2) Source B ("Dig for Victory" Poster): Showing a young child in a sunhat proudly carrying a spade and hoe persuaded everyone—even schoolchildren—that growing vegetables at home directly helped win the war.`,
      task2: `Stage 1 (Why U-boat attacks forced Britain to ration food): Britain imported over two-thirds of its food by sea, and German submarines were sinking merchant ships in the Atlantic. Stage 2 (How ration books & coupons ensured fair shares): Every citizen registered with local shops and used weekly coupons (e.g. 1 fresh egg, 2oz butter, 4oz bacon) so rich and poor received equal shares. Stage 3 (How Dig for Victory helped children grow healthier): Families planted 1.4 million unrationed vegetable allotments and Priority green books gave toddlers extra milk, orange juice, and vitamins.`,
      task3: `1) Baking with 1 Egg & 2oz Butter: Cooks reconstituted tins of dried egg powder with water and grated naturally sweet carrots into cakes and puddings instead of sugar and fat. 2) Digging Up Lawns & Parks: Fresh vegetables and potatoes were unrationed and filled hungry stomachs while saving ship space. 3) Lord Woolton Pie: Chopped carrots, potatoes, cauliflower, and swede baked under oatmeal pastry instead of rationed beef. 4) Sample 1942 Dinner: Allotment leek & potato soup, Lord Woolton vegetable pie, and steamed carrot sponge pudding.`,
      task4: `Viewpoint 1 (Local Corner Grocer): Clipping every registered coupon book strictly and fairly guarantees poorer families down the road still get their weekly share of butter, bacon, and tea. Viewpoint 2 (Parent Tending an Allotment): Combining small weekly meat and cheese rations with baskets of home-grown potatoes, cabbages, and carrots keeps my children full and healthy.`,
      task5_wagoll: `Britain rationed food from January 1940 and asked families to "Dig for Victory" because the island imported over two-thirds of its food by ship and German U-boats were attacking Atlantic convoys. Registered coupon books guaranteed "Fair Shares for All"—such as 1 fresh egg, 2oz of butter, and 4oz of bacon per adult each week—so wealthy shoppers could not buy everything. Meanwhile, growing unrationed potatoes and carrots across 1.4 million allotments saved vital ship space and helped British children grow up healthier.`,
    },
  },

  lesson_8: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Home Front: Women's Wartime Work, 1941–1945).`,
    timeline: [
      { time: '00–10 mins', phase: 'Do Now Starter', activity: 'Retrieval check recapping Lesson 7 (Atlantic imports, January 1940 rationing, 1.4 million allotments, and Woolton Pie).' },
      { time: '10–25 mins', phase: 'Visual Source Enquiry', activity: 'Examine Source A (wartime watercolour of Women’s Land Army harvest workers) and Source B (1942 photograph of women inspecting artillery shells).' },
      { time: '25–50 mins', phase: 'Worksheet Application', activity: 'Pupils complete Task 1 (Visual Source Detective), Task 2 (3-Stage Mobilisation Timeline), Task 3 (Four Wartime Role Badges SVG), and Task 4 (Thinking Heads).' },
      { time: '50–60 mins', phase: 'Plenary & Quiz', activity: 'Pupils write their Task 5 Mission Challenge paragraph and complete the retrieval check.' },
    ],
    subjectPrimer: `With millions of men away in the armed forces, Parliament passed the National Service Act in December 1941 calling up unmarried women aged 20–30 for essential war work. Over 80,000 Land Girls ploughed fields and milked cows, Lumberjills in the Women’s Timber Corps felled trees for coal-mine pit props, nearly a million women made shells and aircraft ("Canary Girls"), 168 ATA women pilots ferried Spitfires and Lancaster bombers, and hundreds of thousands served in the ATS, WAAF, and WRNS.`,
    misconceptions: [
      { misconception: `Pupils think all women volunteered informally or only did light chores.`, correction: `From December 1941 unmarried women aged 20–30 were legally conscripted into demanding, skilled industrial, agricultural, and technical roles.` },
    ],
    hingeQuestion: `Why did Parliament take the historic step of calling up unmarried women aged 20 to 30 in December 1941?`,
    hingeGuidance: `Millions of men were fighting overseas, so without women stepping into farms, forests, shell factories, and radar stations, Britain’s food supply and air defence could not continue.`,
    answers: {
      task1: `1) Practical Clothes & Tools (Sources A & B): Land Girls wear sturdy jumpers, breeches, and boots with pitchforks for heavy harvest labour; munitions workers wear protective overalls and hair coverings while measuring metal shells with precision gauges. 2) Why Britain Needed Millions of Women: With millions of men away in the forces, women harvested food during the U-boat blockade and built the shells, Spitfires, and radar networks defending Britain.`,
      task2: `Stage 1 (Why Parliament called up unmarried women in Dec 1941): Millions of men were away fighting, creating an urgent shortage of workers on farms, in factories, and in defence services. Stage 2 (How Land Girls & Lumberjills kept Britain supplied): Over 80,000 Land Girls ploughed fields, milked cows, and harvested grain, while Lumberjills felled forest pine trees for coal-mine pit props and railways. Stage 3 (Canary Girls & ATA women pilots): Canary Girls packed explosive TNT shells in dangerous munitions factories, while 168 ATA female pilots ferried new Spitfires and four-engine bombers from factories to RAF airfields.`,
      task3: `1) Women’s Land Army (80,000): Milking cows before dawn, driving tractors, ploughing clay fields, digging ditches, and harvesting crops. 2) Lumberjills (Timber Corps): Sawing down tall pine trees so coal mines had wooden pit props to stay open. 3) Canary Girls: Toxic yellow TNT powder stained their skin and hair bright yellow, and a single metal spark could cause an explosion. 4) ATS, WAAF, WRNS & ATA: Operated coastal radar screens and anti-aircraft searchlights, crewed naval bases, and ferried warplanes.`,
      task4: `Viewpoint 1 ("Canary Girl" on Night Shift): Wearing wooden-soled shoes with no metal hairpins so nothing sparks near TNT powder—my hands and hair are stained yellow, but every shell protects our troops. Viewpoint 2 (Former Typist Turned Land Girl): My hands are calloused from tractor steering wheels and frosty 5am milking, yet I feel proud seeing fields of wheat ready for harvest.`,
      task5_wagoll: `Women’s work on farms, in forests, and in factories kept Britain fighting throughout the Second World War. After Parliament passed the December 1941 National Service Act calling up unmarried women aged 20 to 30, over 80,000 Land Girls harvested food and Lumberjills cut timber for coal mines. In munitions factories, nearly a million women including "Canary Girls" filled artillery shells despite dangerous TNT powder, while women in the ATS, WAAF, and ATA operated radar and ferried Spitfires to RAF airfields.`,
    },
  },

  lesson_9: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Home Front: Bletchley Park & Secret Intelligence, 1941–1945).`,
    timeline: [
      { time: '00–10 mins', phase: 'Do Now Starter', activity: 'Retrieval check recapping Lesson 8 (December 1941 National Service Act, Land Girls, Lumberjills, Canary Girls, and ATA pilots).' },
      { time: '10–25 mins', phase: 'Dual Source Enquiry', activity: "Examine Source A (3-rotor German Enigma machine) and Source B (Alan Turing and Gordon Welchman's spinning Bombe machine operated by Wrens at Bletchley Park)." },
      { time: '25–50 mins', phase: 'Worksheet Application', activity: "Pupils complete Task 1 (Machine Detective), Task 2 (3-Stage Signal Pipeline), Task 3 (Station X Cipher Wheel — decoding 'HUT EIGHT' — & 30-Year Secret), and Task 4 (Thinking Heads)." },
      { time: '50–60 mins', phase: 'Plenary & Quiz', activity: 'Pupils write their Task 5 Mission Challenge paragraph and complete the retrieval check.' },
    ],
    subjectPrimer: `At Bletchley Park ("Station X") in Buckinghamshire, Britain ran its top-secret codebreaking headquarters. German forces scrambled radio messages on portable Enigma machines with over 158 million million million settings that reset every midnight. Building on Polish maths breakthroughs, Alan Turing and Gordon Welchman designed the electromechanical Bombe machine. Around 75% of Bletchley’s 10,000 staff were women, and everyone kept total silence for 30 years under the Official Secrets Act.`,
    misconceptions: [
      { misconception: `Pupils picture Alan Turing working completely alone.`, correction: `Bletchley Park grew to 10,000 staff—around 7,500 of them women (Wrens and clerks)—building on Polish breakthroughs and wireless Y-station listeners.` },
    ],
    hingeQuestion: `What would have happened if just one Bletchley Park worker had boasted in a café that Britain could read Enigma?`,
    hingeGuidance: `Germany would immediately have changed its cipher machines, blinding Allied commanders and putting Atlantic food convoys back in mortal danger.`,
    answers: {
      task1: `1) Why Pencil & Paper Alone Couldn’t Crack Enigma in Time: Enigma had over 158 million million million possible settings and German operators changed the key every midnight, giving codebreakers less than 24 hours. 2) How the Bombe Helped (Source B): Its rows of spinning electrical drums tested thousands of wheel combinations automatically using clues like German weather reports to rule out wrong settings each morning.`,
      task2: `Stage 1 (Why German Enigma was almost impossible to crack): Moving wired rotors and plugboard cables created 158 million million million combinations that reset at midnight every night. Stage 2 (How Alan Turing’s Bombe helped at Station X): Built on Polish maths clues, spinning Bombe machines rapidly eliminated impossible rotor settings to find that day’s Enigma key. Stage 3 (How 7,500 women & strict secrecy shortened the war): Women ran Bombe rooms and wireless stations round the clock while keeping total silence under the Official Secrets Act, steering convoys away from U-boats and shortening the war by up to two years.`,
      task3: `Cipher Wheel Solution: I V U  F J H I U = H U T  E I G H T ("HUT EIGHT" — Alan Turing’s Naval Enigma hut!). 1) Pressing the Same Key Twice: Each key press stepped the rotors forward a notch, creating a brand-new electrical path so pressing A twice lit up two different letters. 2) Giant Team Effort (75% Women): Needed wireless listeners, engineers, mathematicians, and thousands of Wrens and clerks working 24-hour shifts. 3) Official Secrets Act: If Germany suspected Enigma was broken, it would replace the cipher immediately. 4) Silent for 30 Years: Wartime oaths remained classified until the 1970s, so workers never even told their parents.`,
      task4: `Viewpoint 1 (Alan Turing in Hut 8): Every hour saved finding today’s Naval Enigma key before midnight means Atlantic merchant ships can dodge U-boat wolf packs tonight. Viewpoint 2 (Young Wren Operating a Bombe): My ears ring from clattering metal drums on night shift, yet when I go home on leave I simply smile and say I do dull office filing.`,
      task5_wagoll: `Secret codebreakers at Bletchley Park helped win and shorten the Second World War by cracking Germany’s Enigma cipher. Because Enigma had 158 million million million settings and reset every midnight, Alan Turing and Gordon Welchman designed spinning Bombe machines to find the daily key rapidly. Around 7,500 women—three-quarters of Station X’s 10,000 staff—operated machines and wireless stations while keeping total silence under the Official Secrets Act, allowing "Ultra" warnings to steer Atlantic food convoys safely past U-boats.`,
    },
  },

  lesson_10: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Home Front: VE Day, Rebuilding & Remembrance, 1945).`,
    safeguardingNote: `<strong>Bereavement &amp; Service-Family Sensitivity Note (Enquiry 10):</strong> Handle discussions of wartime bereavement ("empty chairs at the table") gently, particularly for bereaved pupils or service families.`,
    timeline: [
      { time: '00–10 mins', phase: 'Do Now Starter', activity: 'Retrieval check recapping Lesson 9 (Enigma, Station X, Alan Turing’s Bombe, 75% women staff, and two years shortened).' },
      { time: '10–25 mins', phase: 'Archival Photograph Enquiry', activity: 'Examine Source A (jubilant crowds on Whitehall on 8 May 1945) and Source B (children smiling at a neighbourhood VE Day street party beside bombed buildings).' },
      { time: '25–50 mins', phase: 'Worksheet Application', activity: 'Pupils complete Task 1 (VE Day Photo Detective), Task 2 (3-Stage Peace & Rebuilding Timeline), Task 3 ("Laughter Through Tears" & Milestone Ribbon SVG), and Task 4 (Thinking Heads).' },
      { time: '50–60 mins', phase: 'Plenary & Quiz', activity: 'Pupils write their Task 5 Mission Challenge paragraph and complete the retrieval check.' },
    ],
    subjectPrimer: `After Germany surrendered unconditionally, Tuesday 8 May 1945 became Victory in Europe (VE) Day. At 3:00pm, Winston Churchill broadcast peace in Europe on BBC radio and waved beside King George VI on Buckingham Palace balcony. Blackout curtains came down for street parties, yet over 450,000 British lives had been lost, fighting continued in Asia until VJ Day (15 August 1945), Britain founded the free NHS in July 1948, and food rationing lasted until July 1954.`,
    misconceptions: [
      { misconception: `Pupils assume VE Day ended all fighting worldwide and ended rationing overnight.`, correction: `Fighting in Asia continued until VJ Day on 15 August 1945, and food rationing in Britain lasted nine more years until July 1954!` },
    ],
    hingeQuestion: `Why did many British families describe VE Day on 8 May 1945 as a day of "laughter through tears"?`,
    hingeGuidance: `Balance joyful relief that European air raids and blackouts were over with quiet grief for fallen loved ones, bombed homes, and troops still fighting in Asia.`,
    answers: {
      task1: `1) Celebrating Peace (Sources A & B): Huge crowds cheered along Whitehall, tore down blackout curtains, hung Union Flag bunting, and laid long tables in neighbourhood streets for children’s parties. 2) Bomb-Damaged Streets & Rationed Food: Over 2 million British homes had been damaged by raids, and neighbours pooled saved sugar, jam, and margarine coupons so every child on the street could share sandwiches and cake.`,
      task2: `Stage 1 (How families celebrated VE Day on 8 May 1945): Listened to Churchill’s 3:00pm radio broadcast, tore down blackout curtains, hung red-white-and-blue bunting, lit bonfires, and held street parties. Stage 2 (How Britain rebuilt homes & cared for families by 1948): Built prefab and council homes on bombed sites and launched the free National Health Service (NHS) in July 1948. Stage 3 (How people remember war dead each autumn): Wearing red poppies and keeping a two-minute silence on Armistice Day (11 November) and Remembrance Sunday at the Cenotaph and local memorials.`,
      task3: `1) Sharing Saved Coupons: Neighbours each brought a spoonful of saved sugar, jam, flour, or margarine to bake cakes together for the street’s children. 2) Empty Chairs: Over 450,000 British soldiers and civilians had died, and families still worried for loved ones fighting in Asia until VJ Day (15 Aug 1945). 3) Rebuilding & the 1948 NHS: Sharing wartime hardships inspired people to build new homes and free healthcare for rich and poor alike. 4) Poppies & Remembrance: Honours service and sacrifice across Britain and the Commonwealth so future generations value peace.`,
      task4: `Viewpoint 1 (Young Child at a VE Day Street Party): Magical staying up late seeing glowing streetlamps, bonfires, and red-white-and-blue flags without ever fearing the air raid siren again! Viewpoint 2 (Bereaved Parent at the Party): Clapping and smiling for the children’s joy while quietly remembering a loved one who never came home.`,
      task5_wagoll: `VE Day on 8 May 1945 brought both joyful street parties and quiet sadness across Britain. After Winston Churchill announced at 3:00pm that war in Europe was won, neighbours tore down blackout curtains, hung bunting, and pooled saved ration coupons to give children cakes and sandwiches in the street. At the same time, families grieved for over 450,000 British military and civilian dead, stood beside bombed houses, and worried for soldiers still fighting in Asia until VJ Day in August 1945.`,
    },
  },

  lesson_11: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Holocaust: The Windermere Children & Post-War Healing, August 1945).`,
    safeguardingNote: `<strong>HET Primary Safeguarding &amp; Trauma-Informed Practice (Enquiry 11):</strong> Focus on post-war sanctuary, patient care, friendship, and recovery by Lake Windermere. Never ask pupils to imagine camp conditions or show graphic liberation imagery.`,
    timeline: [
      { time: '00–10 mins', phase: 'Do Now Starter', activity: 'Retrieval check recapping Lesson 10 (VE Day 8 May 1945, 3:00pm Churchill broadcast, Cenotaph, and the 1948 NHS).' },
      { time: '10–25 mins', phase: 'Primary Photograph Enquiry', activity: 'Examine Source A (RAF Short Stirling aircraft at Prague Airport) and Source B (smiling child survivors lifted gently down the aircraft steps on arrival in Cumbria, August 1945), alongside the GIS Airlift Map.' },
      { time: '25–50 mins', phase: 'Worksheet Application', activity: 'Pupils complete Task 1 (Arrival & Recovery Detective), Task 2 (3-Stage Prague-to-Windermere Timeline), Task 3 (Kindertransport vs Windermere Comparison SVG & Calgarth Healing), and Task 4 (Thinking Heads).' },
      { time: '50–60 mins', phase: 'Plenary & Unit Synthesis', activity: 'Pupils write their Task 5 Mission Challenge paragraph and complete the final retrieval check.' },
    ],
    subjectPrimer: `In August 1945—three months after VE Day—Leonard Montefiore and the Central British Fund arranged for orphaned Jewish child camp survivors to recover in Britain. On 14 August 1945, ten converted RAF Short Stirling heavy bombers flew the first 300 children from Prague to RAF Crosby-on-Eden near Carlisle, and coaches brought them to the peaceful Calgarth Estate beside Lake Windermere. Cared for by Dr Oscar Friedman and art therapist Marie Paneth, they rebuilt their strength and formed a lifelong family in the ’45 Aid Society.`,
    misconceptions: [
      { misconception: `Pupils confuse the Windermere Children (August 1945) with Kindertransport refugees (1938–1939).`, correction: `Use the Task 3 Comparison SVG: Kindertransport rescued ~10,000 children by train and ferry BEFORE war started; Windermere flew 300 camp survivors in 10 RAF bombers AFTER VE Day in August 1945.` },
    ],
    hingeQuestion: `Why did caring staff at Calgarth Estate let newly arrived children hide crusts of bread under their pillows instead of scolding them?`,
    hingeGuidance: `Years of terrible hunger made children fear food might vanish overnight; gentle patience and plentiful breakfasts every morning helped them slowly trust that they were safe.`,
    answers: {
      task1: `1) Clues in Source B: Boys peer out smiling with their small suitcase while a British helper gently lifts the youngest child down the aircraft steps in his arms, showing safety, warmth, and a hopeful new start. 2) Hiding Bread Under Pillows: Years of starvation left children afraid food would run out; kind Calgarth staff never scolded them, letting plentiful daily meals rebuild trust naturally.`,
      task2: `Stage 1 (How 300 orphaned survivors reached Lake Windermere): Funded by the Central British Fund on 14 August 1945, 10 converted RAF Short Stirling bombers flew them from Prague to Carlisle, followed by coaches to Lake Windermere. Stage 2 (How gentle care & red bicycles helped them heal): Clean white beds, nourishing meals, Marie Paneth’s quiet art room, football, English lessons, and donated red bicycles restored freedom and joy. Stage 3 (How survivors thanked Britain): Forming the ’45 Aid Society in 1963, survivors became doctors, engineers, teachers, and Olympic captain Sir Ben Helfgott, sharing lessons of kindness across British schools.`,
      task3: `1) Plentiful Breakfasts & Clean Beds: Seeing warm food on the table every single morning proved they would never go hungry again. 2) Art Therapy & English Classes: Painting with Marie Paneth expressed feelings without forcing painful talk, while English unlocked new friendships and jobs. 3) Football, Swimming & Bicycles: After years locked behind barbed wire, pedalling freely along quiet Lake District lanes felt like pure freedom. 4) Lifelong ’45 Aid Society: Having lost parents and siblings, the 300 survivors supported one another as brothers and sisters for over 75 years.`,
      task4: `Viewpoint 1 (Teenage Survivor at Lake Windermere): Sleeping in clean white sheets with no guards outside and riding a bicycle beside sparkling water feels "like arriving in paradise". Viewpoint 2 (Care Worker / Marie Paneth): Never rushing or scolding traumatised children—offering hot food, quiet art materials, and patient kindness lets trust grow day by day.`,
      task5_wagoll: `In August 1945, 300 orphaned child survivors rebuilt their lives by Lake Windermere through patient British kindness and their own resilience. Flown from Prague to Carlisle inside 10 converted RAF Short Stirling bombers, they arrived at the Calgarth Estate exhausted and frightened, even hiding bread under their pillows at night. Caring helpers like Dr Oscar Friedman and art therapist Marie Paneth gave them nourishing meals, painting, English classes, football, and red bicycles, helping them form a lifelong family in the ’45 Aid Society.`,
    },
  },
};

// Aliases for backwards compatibility with any legacy code calling .block1-.block5
Object.values(KS2_TEACHER_GUIDANCE_DATA).forEach((g) => {
  if (g.answers) {
    g.answers.block1 = g.answers.task1;
    g.answers.block2 = g.answers.task2;
    g.answers.block3 = g.answers.task3;
    g.answers.block4 = g.answers.task4;
    g.answers.block5_wagoll = g.answers.task5_wagoll;
  }
});

/**
 * Resolves the live KS2 lesson JSON object for a given worksheet entry (lesson_1..lesson_11).
 */
function resolveLiveKs2Lesson(sheet, explicitUnitId) {
  const targetUnitId = explicitUnitId || detectActiveKs2UnitId();
  const cacheMap = window.__ks2GuidanceUnitCaches || {};
  const lessonsPool =
    (cacheMap[targetUnitId] && cacheMap[targetUnitId].lessons) ||
    (targetUnitId === 'ks2_ww2' &&
      window.__ks2GuidanceUnitCache &&
      window.__ks2GuidanceUnitCache.lessons) ||
    (window.currentUnitData &&
      window.currentUnitData.id === targetUnitId &&
      window.currentUnitData.lessons) ||
    (window.db &&
      window.db[targetUnitId] &&
      window.db[targetUnitId].data &&
      window.db[targetUnitId].data.lessons) ||
    (window.appStore &&
      window.appStore.state &&
      window.appStore.state.activeUnitData &&
      window.appStore.state.activeUnitData.id === targetUnitId &&
      window.appStore.state.activeUnitData.lessons) ||
    [];
  if (!Array.isArray(lessonsPool) || lessonsPool.length === 0) return null;
  return (
    lessonsPool.find((l) => l && l.id === sheet.id) ||
    lessonsPool[(sheet.num || 1) - 1] ||
    null
  );
}

/**
 * Renders the 5th Tab ("IWB Lesson Answers") crib key from the active KS2 lesson JSON.
 */
function renderIwbLessonAnswersHTML(liveLesson, sheet) {
  if (!liveLesson) {
    return `
      <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 24px; text-align: center; color: #475569; font-size: 0.9rem;">
        <i class="fa-solid fa-circle-notch fa-spin" style="color: #2563eb; margin-right: 8px;"></i>
        Loading interactive whiteboard lesson answers for <strong>${sheet.title}</strong>...
      </div>
    `;
  }

  const prevDoNow = Array.isArray(liveLesson.do_now?.items) ? liveLesson.do_now.items : [];
  const currDoNow = Array.isArray(liveLesson.do_now?.current_items)
    ? liveLesson.do_now.current_items
    : [];
  const sources = Array.isArray(liveLesson.sources) ? liveLesson.sources : [];
  const tasks = Array.isArray(liveLesson.tasks) ? liveLesson.tasks : [];
  const quiz = Array.isArray(liveLesson.quiz) ? liveLesson.quiz : [];

  const renderDoNowBlock = (items, badgeText, badgeBg, badgeColor) => {
    if (!items.length) return '';
    return `
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 14px; background: #ffffff;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
          <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">${badgeText}</span>
          <strong style="font-size: 0.88rem; color: #0f172a;">5-Question Do Now Starter Key</strong>
        </div>
        <ol style="margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 0.84rem; color: #334155; line-height: 1.55;">
          ${items
            .map(
              (item) => `
            <li>
              <div style="font-weight: 700; color: #0f172a;">${item.question || item.q || ''}</div>
              <div style="color: #15803d; font-weight: 600;">&#10003; Answer: ${item.answer || item.a || ''}</div>
            </li>
          `,
            )
            .join('')}
        </ol>
      </div>
    `;
  };

  const sourcesHtml = sources.length
    ? `
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 14px; background: #ffffff;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
          <span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">STAGE 3 SOURCES</span>
          <strong style="font-size: 0.88rem; color: #0f172a;">Primary Source Investigation Model Answers (${sources.length} Sources)</strong>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${sources
            .map((src, idx) => {
              const letter = src.letter || String.fromCharCode(65 + idx);
              const q =
                (src.utility_enquiry && src.utility_enquiry.question) ||
                src.question ||
                'Source Investigation Prompt';
              const bullets =
                src.utility_enquiry && Array.isArray(src.utility_enquiry.bullet_points)
                  ? src.utility_enquiry.bullet_points
                  : [];
              const fallbackAns =
                src.model_answer ||
                src.answer ||
                (src.utility_enquiry && src.utility_enquiry.answer) ||
                '';
              return `
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #d97706; border-radius: 6px; padding: 10px 14px; font-size: 0.84rem; line-height: 1.55;">
                <div style="font-weight: 800; color: #0f172a;">Source ${letter}: ${src.title || ''}</div>
                <div style="color: #475569; font-style: italic; margin: 3px 0 6px;">Enquiry Q: ${q}</div>
                ${
                  bullets.length
                    ? `<ul style="margin: 0; padding-left: 18px; color: #1e293b;">${bullets.map((b) => `<li>${b}</li>`).join('')}</ul>`
                    : `<div style="color: #1e293b;">${fallbackAns}</div>`
                }
              </div>
            `;
            })
            .join('')}
        </div>
      </div>
    `
    : '';

  const tasksHtml = tasks.length
    ? `
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 14px; background: #ffffff;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
          <span style="background: #ede9fe; color: #5b21b6; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">WRITING STATION</span>
          <strong style="font-size: 0.88rem; color: #0f172a;">Digital Historian Writing Challenges (${tasks.length} Tasks)</strong>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${tasks
            .map(
              (t, idx) => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #7c3aed; border-radius: 6px; padding: 10px 14px; font-size: 0.84rem; line-height: 1.55;">
              <div style="font-weight: 800; color: #312e81;">Challenge ${idx + 1}: ${t.title || t.type || ''}</div>
              <div style="color: #334155; margin: 3px 0 6px;"><strong>Prompt:</strong> ${t.question || t.prompt || ''}</div>
              <div style="color: #1e293b; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px 10px;"><strong>Model Answer:</strong> ${t.model_answer || t.model || ''}</div>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>
    `
    : '';

  const quizHtml = quiz.length
    ? `
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; background: #ffffff;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
          <span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">PLENARY QUIZ</span>
          <strong style="font-size: 0.88rem; color: #0f172a;">5-Question Consolidation Quiz Answer Key</strong>
        </div>
        <ol style="margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 0.84rem; color: #334155; line-height: 1.55;">
          ${quiz
            .map((q) => {
              const cIdx = typeof q.correct === 'number' ? q.correct : 0;
              const cLetter = String.fromCharCode(65 + cIdx);
              const cText =
                (Array.isArray(q.options) && q.options[cIdx]) || q.answer || '';
              return `
              <li>
                <div style="font-weight: 700; color: #0f172a;">${q.question || ''}</div>
                <div style="color: #15803d; font-weight: 700;">&#10003; Correct (${cLetter}): ${cText}</div>
                ${q.explanation ? `<div style="color: #475569; font-size: 0.8rem;">${q.explanation}</div>` : ''}
              </li>
            `;
            })
            .join('')}
        </ol>
      </div>
    `
    : '';

  return `
    <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-left: 5px solid #2563eb; border-radius: 6px; padding: 14px 18px; margin-bottom: 18px;">
      <strong style="color: #1e3a8a; font-size: 0.88rem;">Interactive Whiteboard (IWB) Live Lesson Key:</strong>
      <span style="color: #1e40af; font-size: 0.84rem; margin-left: 6px;">Complete crib answers for the on-screen Do Now starter, primary sources, digital writing challenges, and plenary quiz. Tip: Click <strong>Teacher Mode: Reveal Answers</strong> in the lesson header bar to reveal these directly on screen!</span>
    </div>
    ${renderDoNowBlock(prevDoNow, 'DO NOW • PREVIOUS LESSON', '#dbeafe', '#1e40af')}
    ${renderDoNowBlock(currDoNow, 'DO NOW • THIS LESSON', '#e0e7ff', '#3730a3')}
    ${sourcesHtml}
    ${tasksHtml}
    ${quizHtml}
  `;
}

/**
 * Opens a clean A4-formatted print popup rendering all 5 sections of the Teacher Guide
 * (fixes blank print caused by modal .no-print and hidden tab panels).
 */
function printKs2TeacherGuide(sheet, guide, liveLesson) {
  const printWin = window.open('', '_blank', 'width=900,height=800');
  if (!printWin) {
    window.print();
    return;
  }

  const cfg = getActiveKs2UnitConfig();
  const resolvedLesson = liveLesson || resolveLiveKs2Lesson(sheet, cfg.unitId);

  const safeguardingPrintHtml = guide.safeguardingNote
    ? `<div class="box" style="background:#fffbeb; border-left:4px solid #d97706; border-color:#fcd34d;">${guide.safeguardingNote}</div>`
    : '';

  const timelineHtml = (guide.timeline || [])
    .map(
      (step) =>
        `<tr><td style="font-weight:700; white-space:nowrap; width:105px; color:#1e3a8a;">${step.time}</td><td><strong>${step.phase}:</strong> ${step.activity}</td></tr>`,
    )
    .join('');

  const misconceptionsHtml = (guide.misconceptions || [])
    .map(
      (m, i) => `
      <div class="box misc">
        <div class="misc-title">Misconception ${i + 1}: ${m.misconception}</div>
        <div><strong>Historical Correction:</strong> ${m.correction}</div>
      </div>`,
    )
    .join('');

  const iwbPrintHtml = resolvedLesson
    ? `<h2>5. Interactive Whiteboard (IWB) Lesson Answer Key</h2>
       <div>${renderIwbLessonAnswersHTML(resolvedLesson, sheet)}</div>`
    : '';

  printWin.document.write(`<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <title>${sheet.title} — Teacher Guide & Answer Key</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Inter, Arial, sans-serif; color: #0f172a; line-height: 1.45; font-size: 9.5pt; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .hdr { background: #1e3a8a; color: #fff; padding: 12px 16px; border-radius: 6px; margin-bottom: 12px; border-bottom: 3px solid #d97706; }
    .hdr-kicker { font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.08em; color: #fde68a; font-weight: 700; }
    .hdr h1 { margin: 3px 0 4px; font-size: 13.5pt; }
    .hdr-eq { font-style: italic; font-size: 10pt; color: #e0f2fe; }
    h2 { font-size: 10.5pt; text-transform: uppercase; letter-spacing: 0.04em; color: #1e3a8a; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; margin: 12px 0 7px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    td { border: 1px solid #cbd5e1; padding: 5px 8px; vertical-align: top; font-size: 9pt; }
    .box { border: 1px solid #cbd5e1; border-radius: 5px; padding: 8px 11px; margin-bottom: 8px; break-inside: avoid; }
    .primer { background: #fffbeb; border-left: 4px solid #d97706; }
    .hinge { background: #eff6ff; border-left: 4px solid #2563eb; }
    .misc { background: #fef2f2; border-left: 4px solid #dc2626; }
    .misc-title { font-weight: 700; color: #991b1b; margin-bottom: 3px; }
    .ans { background: #f8fafc; border-left: 4px solid #0f766e; }
    .wagoll { background: #eef2ff; border-left: 4px solid #4338ca; font-style: italic; }
  </style>
</head>
<body>
  <div class="hdr">
    <div class="hdr-kicker">Key Stage 2 History • Walk-In Primary Teacher Guide • Lesson ${sheet.num} of ${cfg.totalLessons}</div>
    <h1>${sheet.title}</h1>
    <div class="hdr-eq">Key Enquiry: ${sheet.enquiryQuestion}</div>
  </div>

  ${safeguardingPrintHtml}

  <h2>1. 60-Minute Lesson Sequence</h2>
  <table><tbody>${timelineHtml}</tbody></table>

  <h2>2. Non-Specialist Subject Knowledge Primer</h2>
  <div class="box primer">${guide.subjectPrimer}</div>

  <h2>3. Hinge Question & Common Primary Misconceptions</h2>
  <div class="box hinge">
    <div><strong>Hinge Discussion Question:</strong> ${guide.hingeQuestion}</div>
    <div style="margin-top:4px;"><strong>What to Listen For:</strong> ${guide.hingeGuidance}</div>
  </div>
  ${misconceptionsHtml}

  <h2>4. Worksheet & Workbook Answer Key (Tasks 1–5)</h2>
  <div class="box ans"><strong>Task 1 (Source Detective):</strong> ${guide.answers.task1}</div>
  <div class="box ans"><strong>Task 2 (Chronology Challenge):</strong> ${guide.answers.task2}</div>
  <div class="box ans"><strong>Task 3 (Historical Investigation):</strong> ${guide.answers.task3}</div>
  <div class="box ans"><strong>Task 4 (Thinking Heads Perspectives):</strong> ${guide.answers.task4}</div>
  <div class="box wagoll"><strong>Task 5 WAGOLL (Expected KS2 Model Answer):</strong><br>"${guide.answers.task5_wagoll}"</div>

  ${iwbPrintHtml}
</body>
</html>`);
  printWin.document.close();
  printWin.focus();
  setTimeout(() => {
    printWin.print();
  }, 250);
}

/**
 * Open KS2 Worksheet Modal
 * Displays current lesson worksheet with quick 1-click toggle to Full 28-Page Pupil Workbook
 */
export function openKs2WorksheetModal(lessonId, lessonIndex, explicitUnitId) {
  const cfg = getActiveKs2UnitConfig(explicitUnitId);
  const activeWsMap = cfg.worksheetsMap;
  let targetId = lessonId;
  if (!targetId || !activeWsMap[targetId]) {
    if (typeof lessonIndex === 'number' && lessonIndex >= 0 && lessonIndex < cfg.totalLessons) {
      targetId = `lesson_${lessonIndex + 1}`;
    } else {
      targetId = 'lesson_1';
    }
  }

  const currentSheet = activeWsMap[targetId] || activeWsMap.lesson_1;
  const fullWorkbookUrl = cfg.fullWorkbookUrl;
  const fullWorkbookPdf = cfg.fullWorkbookPdf;
  const spineWorkbookUrl = cfg.spineWorkbookUrl || null;
  const spineWorkbookPdf = cfg.spineWorkbookPdf || null;

  // Close teacher guidance modal if open to prevent stacked modal overlays
  const existingGuidance = document.getElementById('ks2TeacherGuidanceModalOverlay');
  if (existingGuidance) existingGuidance.remove();

  // Remove existing modal if any
  const existing = document.getElementById('ks2WorksheetModalOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'ks2WorksheetModalOverlay';
  overlay.className = 'modal-overlay no-print';
  overlay.style.cssText =
    'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(8px); z-index: 99999; display: flex; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.25s ease;';

  overlay.innerHTML = `
    <div class="modal-content" style="background: #0f172a; border: 1.5px solid #334155; border-radius: 12px; width: 94vw; max-width: 1350px; height: 92vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); transform: scale(0.97); transition: transform 0.25s ease; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
      
      <!-- Modal Header -->
      <div style="background: #1e293b; border-bottom: 1px solid #334155; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        
        <!-- Left: Document Identity & Switcher -->
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 36px; height: 36px; border-radius: 8px; background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 1.1rem; box-shadow: 0 2px 8px rgba(37,99,235,0.35);">
            <i class="fa-solid fa-file-pdf"></i>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; background: rgba(59, 130, 246, 0.2); color: #93c5fd; padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(59, 130, 246, 0.3);">KS2 Print Materials</span>
              <span id="activeDocModeLabel" style="font-size: 0.72rem; font-weight: 600; color: #94a3b8;">Lesson ${currentSheet.num} of ${Object.keys(activeWsMap).length}${currentSheet.hasOptionalCraftPage3 ? " • Pages 1–2 Core + Optional p.3 Craft" : " • 2-Page A4 Worksheet"}</span>
            </div>
            <h2 id="activeDocTitle" style="margin: 3px 0 0 0; font-size: 1.15rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">${currentSheet.title}</h2>
          </div>
        </div>

        <!-- Center: Quick View Toggle (This Lesson vs Full Master Workbook) -->
        <div style="background: #0f172a; padding: 3px; border-radius: 8px; border: 1px solid #334155; display: flex; gap: 2px; flex-wrap: wrap;">
          <button id="toggleSingleWorksheet" class="active-doc-toggle" style="background: #2563eb; color: #ffffff; border: none; padding: 6px 14px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;">
            <i class="fa-solid fa-file-lines"></i>
            <span>This Lesson Worksheet</span>
          </button>
          <button id="toggleMasterWorkbook" class="inactive-doc-toggle" style="background: transparent; color: #94a3b8; border: none; padding: 6px 14px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;">
            <i class="fa-solid fa-book-bookmark" style="color: #f59e0b;"></i>
            <span>Full ${cfg.workbookPagesLabel} Workbook${spineWorkbookUrl ? ' (Illustrated)' : ''}</span>
          </button>
          ${
            spineWorkbookUrl
              ? `<button id="toggleSpineWorkbook" class="inactive-doc-toggle" style="background: transparent; color: #94a3b8; border: none; padding: 6px 14px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;">
            <i class="fa-solid fa-pen-nib" style="color: #38bdf8;"></i>
            <span>KS3-Style Spine Workbook</span>
          </button>`
              : ''
          }
        </div>

        <!-- Right: Actions & Close -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <!-- Lesson Jump Selector -->
          <select id="worksheetLessonSelect" style="background: #0f172a; color: #f1f5f9; border: 1px solid #475569; padding: 6px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; outline: none;">
            ${Object.values(activeWsMap)
      .map(
        (w) => `
              <option value="${w.id}" ${w.id === currentSheet.id ? 'selected' : ''}>Lesson ${w.num}:${w.title.split(':')[1] || ' ' + w.title}</option>
            `,
      )
      .join('')}
          </select>

          <!-- Direct Download PDF Button -->
          <a id="downloadPdfLink" href="${currentSheet.pdf}" download style="background: #10b981; color: #ffffff; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);">
            <i class="fa-solid fa-download"></i>
            <span>Download PDF</span>
          </a>

          <!-- Native Print Button -->
          <button id="printIframeBtn" style="background: #475569; color: #ffffff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-print"></i>
            <span>Print</span>
          </button>

          <!-- Modal Close Button -->
          <button id="worksheetModalClose" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; font-size: 1.1rem; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s ease;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

      </div>

      <!-- Modal Body (Embeds the exact printable HTML) -->
      <div style="flex: 1; position: relative; background: #334155; overflow: hidden;">
        <iframe id="worksheetPreviewFrame" src="${currentSheet.html}" style="width: 100%; height: 100%; border: none; background: #ffffff;"></iframe>
      </div>

      <!-- Modal Footer Status Bar -->
      <div style="background: #1e293b; border-top: 1px solid #334155; padding: 8px 20px; display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: #94a3b8;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span><i class="fa-solid fa-check" style="color: #10b981; margin-right: 4px;"></i> A4 Print-Ready Layout</span>
          <span>&bull;</span>
          <span><i class="fa-solid fa-scissors" style="color: #60a5fa; margin-right: 4px;"></i> Exercise Book Trim Guide</span>
          <span>&bull;</span>
          <span><i class="fa-solid fa-shield-halved" style="color: #f59e0b; margin-right: 4px;"></i> The History Revision Hub</span>
        </div>
        <div style="display: flex; gap: 10px;">
          <button id="launchTeacherGuidanceFromWorksheet" style="background: #fdf2f8; color: #9d174d; border: 1px solid #fbcfe8; font-weight: 700; padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
            <i class="fa-solid fa-chalkboard-user"></i> Open Teacher Guidance &amp; Answers
          </button>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(overlay);

  const iframe = overlay.querySelector('#worksheetPreviewFrame');
  const singleBtn = overlay.querySelector('#toggleSingleWorksheet');
  const masterBtn = overlay.querySelector('#toggleMasterWorkbook');
  const spineBtn = overlay.querySelector('#toggleSpineWorkbook');
  const titleEl = overlay.querySelector('#activeDocTitle');
  const modeLabel = overlay.querySelector('#activeDocModeLabel');
  const downloadLink = overlay.querySelector('#downloadPdfLink');
  const lessonSelect = overlay.querySelector('#worksheetLessonSelect');

  let isViewingMaster = false;

  const setSingleView = (wId) => {
    isViewingMaster = false;
    const s = activeWsMap[wId] || currentSheet;
    iframe.src = s.html;
    titleEl.textContent = s.title;
    modeLabel.textContent = `Lesson ${s.num} of ${Object.keys(activeWsMap).length}`;
    downloadLink.href = s.pdf;
    lessonSelect.value = s.id;
    lessonSelect.style.display = 'inline-block';

    singleBtn.style.background = '#2563eb';
    singleBtn.style.color = '#ffffff';
    masterBtn.style.background = 'transparent';
    masterBtn.style.color = '#94a3b8';
    if (spineBtn) {
      spineBtn.style.background = 'transparent';
      spineBtn.style.color = '#94a3b8';
    }
  };

  const setMasterView = () => {
    isViewingMaster = true;
    iframe.src = fullWorkbookUrl;
    titleEl.textContent = `${cfg.workbookPagesLabel} Master Pupil Workbook${spineWorkbookUrl ? ' (Illustrated)' : ''}`;
    modeLabel.textContent = `Complete ${cfg.totalLessons}-Enquiry Course Companion`;
    downloadLink.href = fullWorkbookPdf;
    lessonSelect.style.display = 'none';

    masterBtn.style.background = '#f59e0b';
    masterBtn.style.color = '#0f172a';
    singleBtn.style.background = 'transparent';
    singleBtn.style.color = '#94a3b8';
    if (spineBtn) {
      spineBtn.style.background = 'transparent';
      spineBtn.style.color = '#94a3b8';
    }
  };

  const setSpineView = () => {
    if (!spineWorkbookUrl) return;
    isViewingMaster = true;
    iframe.src = spineWorkbookUrl;
    titleEl.textContent = `${cfg.workbookPagesLabel} KS3-Style Spine Pupil Workbook`;
    modeLabel.textContent = `Complete ${cfg.totalLessons}-Enquiry B&W Chronological Spine & Extended Writing Companion`;
    downloadLink.href = spineWorkbookPdf || spineWorkbookUrl;
    lessonSelect.style.display = 'none';

    if (spineBtn) {
      spineBtn.style.background = '#0ea5e9';
      spineBtn.style.color = '#ffffff';
    }
    singleBtn.style.background = 'transparent';
    singleBtn.style.color = '#94a3b8';
    masterBtn.style.background = 'transparent';
    masterBtn.style.color = '#94a3b8';
  };

  singleBtn.onclick = () => setSingleView(lessonSelect.value);
  masterBtn.onclick = () => setMasterView();
  if (spineBtn) spineBtn.onclick = () => setSpineView();

  lessonSelect.onchange = (e) => {
    setSingleView(e.target.value);
  };

  overlay.querySelector('#printIframeBtn').onclick = () => {
    if (iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  };

  overlay.querySelector('#launchTeacherGuidanceFromWorksheet').onclick = () => {
    const currentLesson = isViewingMaster ? 'lesson_1' : lessonSelect.value;
    overlay.remove();
    openKs2TeacherGuidanceModal(currentLesson);
  };

  const closeModal = () => {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 250);
  };

  overlay.querySelector('#worksheetModalClose').onclick = closeModal;
  overlay.onclick = (e) => {
    if (e.target === overlay) closeModal();
  };

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      window.removeEventListener('keydown', handleEsc);
    }
  };
  window.addEventListener('keydown', handleEsc);

  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    overlay.querySelector('.modal-content').style.transform = 'scale(1)';
  });
}

/**
 * Open KS2 Teacher Guidance Modal
 * Non-specialist primary planning guide with subject knowledge, misconceptions, hinge questions, and 5-task worksheet answer keys.
 */
export function openKs2TeacherGuidanceModal(lessonId, lessonIndex) {
  const cfg = getActiveKs2UnitConfig();
  const activeWsMap = cfg.worksheetsMap;
  const activeGuideMap = cfg.guidanceMap;
  let targetId = lessonId;
  if (!targetId || !activeGuideMap[targetId]) {
    if (typeof lessonIndex === 'number' && lessonIndex >= 0 && lessonIndex < cfg.totalLessons) {
      targetId = `lesson_${lessonIndex + 1}`;
    } else {
      targetId = 'lesson_1';
    }
  }

  const sheet = activeWsMap[targetId] || activeWsMap.lesson_1;
  const guide = activeGuideMap[targetId] || activeGuideMap.lesson_1;
  let liveLesson = resolveLiveKs2Lesson(sheet, cfg.unitId);

  const safeguardingBannerHtml = guide.safeguardingNote
    ? `
      <div style="background: #fffbeb; border: 1.5px solid #fcd34d; border-left: 5px solid #d97706; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; display: flex; align-items: flex-start; gap: 12px;">
        <i class="fa-solid fa-shield-heart" style="color: #d97706; font-size: 1.2rem; margin-top: 2px; flex-shrink: 0;"></i>
        <div style="font-size: 0.85rem; color: #78350f; line-height: 1.6;">
          ${guide.safeguardingNote}
        </div>
      </div>
    `
    : '';

  // Close worksheet modal if open to prevent stacked modal overlays
  const existingWs = document.getElementById('ks2WorksheetModalOverlay');
  if (existingWs) existingWs.remove();

  // Remove existing
  const existing = document.getElementById('ks2TeacherGuidanceModalOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'ks2TeacherGuidanceModalOverlay';
  overlay.className = 'modal-overlay no-print';
  overlay.style.cssText =
    'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(8px); z-index: 99999; display: flex; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.25s ease;';

  overlay.innerHTML = `
    <div class="modal-content" style="background: #ffffff; border-radius: 12px; width: 94vw; max-width: 1200px; height: 92vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); transform: scale(0.97); transition: transform 0.25s ease; font-family: 'Inter', sans-serif; color: #0f172a;">
      
      <!-- Modal Header -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; border-bottom: 3px solid #b45309;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 42px; height: 42px; border-radius: 8px; background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 1.25rem;">
            <i class="fa-solid fa-chalkboard-user"></i>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; background: rgba(255, 255, 255, 0.2); color: #ffffff; padding: 2px 8px; border-radius: 4px;">Primary Teacher Companion</span>
              <span style="font-size: 0.72rem; font-weight: 600; color: #cbd5e1;">Key Stage 2 History • Lesson ${sheet.num} of ${cfg.totalLessons}</span>
            </div>
            <h2 style="margin: 3px 0 0 0; font-size: 1.25rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">${sheet.title}</h2>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <select id="guidanceLessonSelect" style="background: #0f172a; color: #f1f5f9; border: 1px solid #475569; padding: 7px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; cursor: pointer; outline: none;">
            ${Object.values(activeWsMap)
      .map(
        (w) => `
              <option value="${w.id}" ${w.id === sheet.id ? 'selected' : ''}>Lesson ${w.num}:${w.title.split(':')[1] || ' ' + w.title}</option>
            `,
      )
      .join('')}
          </select>

          <button id="printTeacherGuideBtn" style="background: rgba(255, 255, 255, 0.15); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.25); font-weight: 700; font-size: 0.8rem; padding: 7px 12px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-print"></i> Print Full Guide
          </button>

          <button id="guidanceModalClose" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; font-size: 1.1rem; width: 34px; height: 34px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 0 24px; display: flex; gap: 4px; overflow-x: auto;">
        <button class="tg-tab active" data-target="tg-glance" style="background: transparent; border: none; border-bottom: 3px solid #1e3a8a; color: #1e3a8a; font-weight: 800; font-size: 0.85rem; padding: 12px 16px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-clipboard-list"></i> <span>At A Glance</span>
        </button>
        <button class="tg-tab" data-target="tg-primer" style="background: transparent; border: none; border-bottom: 3px solid transparent; color: #64748b; font-weight: 700; font-size: 0.85rem; padding: 12px 16px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-brain"></i> <span>Subject Knowledge Primer</span>
        </button>
        <button class="tg-tab" data-target="tg-misconceptions" style="background: transparent; border: none; border-bottom: 3px solid transparent; color: #64748b; font-weight: 700; font-size: 0.85rem; padding: 12px 16px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-triangle-exclamation"></i> <span>Misconceptions &amp; Hinge Discussion</span>
        </button>
        <button class="tg-tab" data-target="tg-answers" style="background: transparent; border: none; border-bottom: 3px solid transparent; color: #64748b; font-weight: 700; font-size: 0.85rem; padding: 12px 16px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
          <i class="fa-solid fa-key"></i> <span>Worksheet &amp; Workbook Key</span>
        </button>
        <button class="tg-tab" data-target="tg-iwb-answers" style="background: transparent; border: none; border-bottom: 3px solid transparent; color: #64748b; font-weight: 700; font-size: 0.85rem; padding: 12px 16px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
          <i class="fa-solid fa-chalkboard"></i> <span>IWB Lesson Answers</span>
        </button>
      </div>

      <!-- Modal Body Content -->
      <div style="flex: 1; overflow-y: auto; padding: 24px; background: #ffffff;">
        
        <!-- SECTION 1: AT A GLANCE -->
        <div id="tg-glance" class="tg-section" style="display: block;">
          ${safeguardingBannerHtml}
          
          <!-- Key Enquiry Question Box -->
          <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-left: 5px solid #1e3a8a; border-radius: 6px; padding: 16px 20px; margin-bottom: 20px;">
            <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #1e3a8a; letter-spacing: 0.5px; margin-bottom: 4px;">Central Historical Enquiry Question</div>
            <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.25rem; font-weight: 700; color: #1e3a8a; line-height: 1.4;">
              ${sheet.enquiryQuestion}
            </div>
          </div>

          <!-- Curriculum Links Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; margin-bottom: 24px;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
              <h4 style="margin: 0 0 8px 0; font-size: 0.88rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-landmark" style="color: #2563eb;"></i> National Curriculum Link
              </h4>
              <p style="margin: 0; font-size: 0.85rem; color: #475569; line-height: 1.55;">
                ${guide.curriculumLinks}
              </p>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
              <h4 style="margin: 0 0 8px 0; font-size: 0.88rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-graduation-cap" style="color: #16a34a;"></i> Key Historical Skills
              </h4>
              <p style="margin: 0; font-size: 0.85rem; color: #475569; line-height: 1.55;">
                Historical Enquiry (primary artefacts, documents &amp; maps), Chronological Understanding (${cfg.skillsPeriod}), and Cause &amp; Consequence.
              </p>
            </div>
          </div>

          <!-- 4-Part Lesson Timeline -->
          <h3 style="font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0 0 12px 0;">Recommended 60-Minute Lesson Sequence</h3>
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
            ${guide.timeline
      .map(
        (step, idx) => `
              <div style="display: flex; align-items: flex-start; padding: 12px 16px; background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: ${idx < guide.timeline.length - 1 ? '1px solid #e2e8f0' : 'none'}; gap: 14px;">
                <span style="font-size: 0.76rem; font-weight: 800; background: #e0e7ff; color: #3730a3; padding: 3px 8px; border-radius: 4px; white-space: nowrap;">${step.time}</span>
                <div style="flex: 1;">
                  <strong style="color: #0f172a; font-size: 0.86rem;">${step.phase}:</strong>
                  <span style="color: #475569; font-size: 0.85rem; margin-left: 6px;">${step.activity}</span>
                </div>
              </div>
            `,
      )
      .join('')}
          </div>

          <!-- Fast Links to Printable Resources -->
          <div style="background: #f1f5f9; border-radius: 8px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <span style="font-size: 0.82rem; font-weight: 700; color: #334155;">
              <i class="fa-solid fa-print" style="color: #2563eb; margin-right: 6px;"></i>Printable Classroom Resources for this Lesson:
            </span>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button id="openWorksheetFromGuidanceBtn" style="background: #2563eb; color: #ffffff; border: none; font-size: 0.78rem; font-weight: 700; padding: 6px 12px; border-radius: 5px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-solid fa-file-pdf"></i> Open Lesson Worksheet
              </button>
              <a href="${cfg.fullWorkbookPdf}" target="_blank" style="background: #ffffff; color: #1e3a8a; border: 1.5px solid #bfdbfe; font-size: 0.78rem; font-weight: 700; padding: 6px 12px; border-radius: 5px; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-solid fa-book-bookmark"></i> ${cfg.workbookPagesLabel} Pupil Workbook (PDF)
              </a>
              ${
                cfg.spineWorkbookPdf
                  ? `<a href="${cfg.spineWorkbookPdf}" target="_blank" style="background: #ffffff; color: #0f172a; border: 1.5px solid #cbd5e1; font-size: 0.78rem; font-weight: 700; padding: 6px 12px; border-radius: 5px; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-solid fa-pen-nib"></i> KS3-Style Spine Workbook (PDF)
              </a>`
                  : ''
              }
              <a href="${cfg.sowUrl}" target="_blank" style="background: #ffffff; color: #0f766e; border: 1.5px solid #99f6e4; font-size: 0.78rem; font-weight: 700; padding: 6px 12px; border-radius: 5px; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-solid fa-table-list"></i> ${cfg.sowLabel}
              </a>
            </div>
          </div>

        </div>

        <!-- SECTION 2: SUBJECT KNOWLEDGE PRIMER -->
        <div id="tg-primer" class="tg-section" style="display: none;">
          ${safeguardingBannerHtml}
          <div style="background: #fffdfa; border: 1.5px solid #fed7aa; border-left: 5px solid #d97706; border-radius: 6px; padding: 18px 22px; margin-bottom: 20px;">
            <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #b45309; letter-spacing: 0.5px; margin-bottom: 6px;">Non-Specialist Teacher Background Briefing</div>
            <p style="font-size: 0.94rem; color: #334155; line-height: 1.7; margin: 0;">
              ${guide.subjectPrimer}
            </p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; font-size: 0.92rem; font-weight: 800; color: #0f172a;">Essential Historical Enquiry Focus</h4>
            <div style="font-size: 0.85rem; color: #475569; line-height: 1.6;">
              ${sheet.desc}
            </div>
          </div>
        </div>

        <!-- SECTION 3: MISCONCEPTIONS & DISCUSSION -->
        <div id="tg-misconceptions" class="tg-section" style="display: none;">
          
          <!-- Hinge Discussion Question Box -->
          <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-left: 5px solid #2563eb; border-radius: 6px; padding: 18px 22px; margin-bottom: 22px;">
            <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #1e40af; letter-spacing: 0.5px; margin-bottom: 4px;">Targeted Hinge Discussion Question</div>
            <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; font-weight: 700; color: #1e3a8a; line-height: 1.5; margin-bottom: 10px;">
              ${guide.hingeQuestion}
            </div>
            <div style="font-size: 0.82rem; color: #3b82f6; font-weight: 700;">
              <i class="fa-solid fa-lightbulb" style="margin-right: 4px;"></i> Teacher Guidance on Responses:
            </div>
            <div style="font-size: 0.85rem; color: #1e3a8a; margin-top: 4px; line-height: 1.55;">
              ${guide.hingeGuidance}
            </div>
          </div>

          <!-- Misconceptions Cards -->
          <h3 style="font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0 0 12px 0;">Common Primary Misconceptions &amp; How to Address Them</h3>
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${guide.misconceptions
      .map(
        (m, idx) => `
              <div style="background: #ffffff; border: 1.5px solid #fecaca; border-left: 5px solid #dc2626; border-radius: 6px; padding: 14px 18px;">
                <div style="display: flex; align-items: center; gap: 8px; color: #991b1b; font-size: 0.86rem; font-weight: 800; margin-bottom: 6px;">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  <span>Misconception ${idx + 1}: ${m.misconception}</span>
                </div>
                <div style="color: #1e293b; font-size: 0.84rem; line-height: 1.6; background: #fef2f2; padding: 10px 14px; border-radius: 4px;">
                  <strong>Historical Correction:</strong> ${m.correction}
                </div>
              </div>
            `,
      )
      .join('')}
          </div>

        </div>

        <!-- SECTION 4: WORKSHEET & WORKBOOK KEY -->
        <div id="tg-answers" class="tg-section" style="display: none;">
          
          <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 5px solid #16a34a; border-radius: 6px; padding: 14px 18px; margin-bottom: 20px;">
            <strong style="color: #166534; font-size: 0.88rem;">Worksheet &amp; Pupil Workbook Marking Guide:</strong>
            <span style="color: #15803d; font-size: 0.84rem; margin-left: 6px;">Marks both the standalone 2-page A4 Lesson ${sheet.num} Worksheet AND Mission ${String(sheet.num).padStart(2, '0')} in the ${cfg.workbookPagesLabel} Master Pupil Workbook (Tasks 1–5).</span>
          </div>

          <!-- Task 1: Source Detective -->
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 14px;">
            <h4 style="margin: 0 0 8px 0; font-size: 0.88rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 6px;">
              <span style="background: #e0f2fe; color: #0369a1; padding: 1px 6px; border-radius: 3px; font-size: 0.72rem; font-weight: 800;">TASK 1</span>
              <span>Source Detective • Primary Evidence Check</span>
            </h4>
            <div style="font-size: 0.84rem; color: #334155; line-height: 1.6;">
              ${guide.answers.task1 || guide.answers.block3}
            </div>
          </div>

          <!-- Task 2: Chronological Challenge -->
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 14px;">
            <h4 style="margin: 0 0 8px 0; font-size: 0.88rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 6px;">
              <span style="background: #fef3c7; color: #92400e; padding: 1px 6px; border-radius: 3px; font-size: 0.72rem; font-weight: 800;">TASK 2</span>
              <span>Chronology Challenge • Putting Events in Order</span>
            </h4>
            <div style="font-size: 0.84rem; color: #334155; line-height: 1.6;">
              ${guide.answers.task2 || guide.answers.block2}
            </div>
          </div>

          <!-- Task 3: Historical Investigation -->
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 14px;">
            <h4 style="margin: 0 0 8px 0; font-size: 0.88rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 6px;">
              <span style="background: #dbeafe; color: #1e40af; padding: 1px 6px; border-radius: 3px; font-size: 0.72rem; font-weight: 800;">TASK 3</span>
              <span>Historical Investigation • Key Facts &amp; Details</span>
            </h4>
            <div style="font-size: 0.84rem; color: #334155; line-height: 1.6;">
              ${guide.answers.task3 || guide.answers.block1}
            </div>
          </div>

          <!-- Task 4: Thinking Heads Contrasting Perspectives -->
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 18px;">
            <h4 style="margin: 0 0 8px 0; font-size: 0.88rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 6px;">
              <span style="background: #fce7f3; color: #9d174d; padding: 1px 6px; border-radius: 3px; font-size: 0.72rem; font-weight: 800;">TASK 4</span>
              <span>"Thinking Heads" • Two Viewpoints</span>
            </h4>
            <div style="font-size: 0.84rem; color: #334155; line-height: 1.6;">
              ${guide.answers.task4 || guide.answers.block4}
            </div>
          </div>

          <!-- Task 5: Mission Challenge WAGOLL Model Paragraph -->
          <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-left: 5px solid #4338ca; border-radius: 6px; padding: 16px 20px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <h4 style="margin: 0; font-size: 0.90rem; font-weight: 800; color: #312e81; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-star" style="color: #eab308;"></i>
                <span>Task 5 WAGOLL: What A Good One Looks Like (${cfg.wagollAgeLabel})</span>
              </h4>
              <span style="font-size: 0.72rem; font-weight: 700; background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px;">KS2 Expected Standard</span>
            </div>
            <p style="font-family: 'Lora', Georgia, serif; font-size: 0.94rem; color: #1e293b; line-height: 1.7; margin: 0; font-style: italic;">
              "${guide.answers.task5_wagoll || guide.answers.block5_wagoll}"
            </p>
          </div>

        </div>

        <!-- SECTION 5: IWB LESSON ANSWERS -->
        <div id="tg-iwb-answers" class="tg-section" style="display: none;">
          ${renderIwbLessonAnswersHTML(liveLesson, sheet)}
        </div>

      </div>

      <!-- Footer Bar -->
      <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; color: #64748b;">
        <div>
          <strong>The History Revision Hub:</strong> Key Stage 2 Primary History Teacher Companion.
        </div>
        <button id="guidanceModalBottomClose" style="background: #0f172a; color: #ffffff; border: none; font-weight: 700; font-size: 0.78rem; padding: 6px 14px; border-radius: 5px; cursor: pointer;">
          Close Guide
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(overlay);

  // Tab switching logic
  const tabs = overlay.querySelectorAll('.tg-tab');
  const sections = overlay.querySelectorAll('.tg-section');

  tabs.forEach((tab) => {
    tab.onclick = () => {
      tabs.forEach((t) => {
        t.style.borderBottomColor = 'transparent';
        t.style.color = '#64748b';
        t.classList.remove('active');
      });
      sections.forEach((s) => (s.style.display = 'none'));

      tab.style.borderBottomColor = '#1e3a8a';
      tab.style.color = '#1e3a8a';
      tab.classList.add('active');

      const targetSecId = tab.getAttribute('data-target');
      const targetSec = overlay.querySelector(`#${targetSecId}`);
      if (targetSec) targetSec.style.display = 'block';
    };
  });

  overlay.querySelector('#printTeacherGuideBtn').onclick = () => {
    printKs2TeacherGuide(sheet, guide, liveLesson);
  };

  if (!liveLesson) {
    fetch(`/data/${cfg.unitId}.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((unitJson) => {
        if (!unitJson || !Array.isArray(unitJson.lessons)) return;
        window.__ks2GuidanceUnitCaches = window.__ks2GuidanceUnitCaches || {};
        window.__ks2GuidanceUnitCaches[cfg.unitId] = unitJson;
        if (cfg.unitId === 'ks2_ww2') window.__ks2GuidanceUnitCache = unitJson;
        liveLesson = resolveLiveKs2Lesson(sheet, cfg.unitId);
        const iwbContainer = overlay.querySelector('#tg-iwb-answers');
        if (iwbContainer && liveLesson) {
          iwbContainer.innerHTML = renderIwbLessonAnswersHTML(liveLesson, sheet);
        }
      })
      .catch(() => {});
  }

  overlay.querySelector('#openWorksheetFromGuidanceBtn').onclick = () => {
    overlay.remove();
    openKs2WorksheetModal(sheet.id);
  };

  const lessonSelect = overlay.querySelector('#guidanceLessonSelect');
  lessonSelect.onchange = (e) => {
    openKs2TeacherGuidanceModal(e.target.value);
  };

  const closeModal = () => {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 250);
  };

  overlay.querySelector('#guidanceModalClose').onclick = closeModal;
  overlay.querySelector('#guidanceModalBottomClose').onclick = closeModal;
  overlay.onclick = (e) => {
    if (e.target === overlay) closeModal();
  };

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      window.removeEventListener('keydown', handleEsc);
    }
  };
  window.addEventListener('keydown', handleEsc);

  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    overlay.querySelector('.modal-content').style.transform = 'scale(1)';
  });
}

// Bind to window for universal availability
if (typeof window !== 'undefined') {
  window.openKs2WorksheetModal = openKs2WorksheetModal;
  window.openKs2TeacherGuidanceModal = openKs2TeacherGuidanceModal;
  window.KS2_WORKSHEETS_MAP = KS2_WORKSHEETS_MAP;
  window.KS2_TEACHER_GUIDANCE_DATA = KS2_TEACHER_GUIDANCE_DATA;
}
