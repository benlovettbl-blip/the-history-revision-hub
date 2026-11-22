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

// Backwards-compatible alias normalization for KS2 Prehistory, Romans & Saxons guidance
[
  ...Object.values(KS2_STONE_AGE_TEACHER_GUIDANCE),
  ...Object.values(KS2_ROMANS_TEACHER_GUIDANCE),
  ...Object.values(KS2_SAXONS_TEACHER_GUIDANCE),
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
      sowUrl: '/units/ks2_stone_to_iron_age/ks2_stone_to_iron_age_scheme_of_work.html',
      sowLabel: '6-Lesson Scheme of Work',
      wagollAgeLabel: 'Key Stage 2 Dual-Scaffolded Model Answer',
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
      sowUrl: '/units/ks2_romans/ks2_romans_scheme_of_work.html',
      sowLabel: '6-Lesson Scheme of Work',
      wagollAgeLabel: 'Key Stage 2 Dual-Scaffolded Model Answer',
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
      sowUrl: '/units/ks2_anglo_saxons_vikings/ks2_anglo_saxons_vikings_scheme_of_work.html',
      sowLabel: '6-Lesson Scheme of Work',
      wagollAgeLabel: 'Key Stage 2 Dual-Scaffolded Model Answer',
      skillsPeriod: 'AD 410–1066',
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
    sowUrl: '/units/ks2_ww2/ks2_ww2_scheme_of_work.html',
    sowLabel: '11-Lesson Scheme of Work',
    wagollAgeLabel: 'Key Stage 2 Model Answer',
    skillsPeriod: '1933–1945',
  };
}

export const KS2_WORKSHEETS_MAP = {
  lesson_1: {
    num: 1,
    id: 'lesson_1',
    title: 'Enquiry 1: Outbreak 1939 & Home Front Mobilisation',
    subtitle: 'Cardboard Gas Mask Boxes & Blackout Preparations in September 1939',
    enquiryQuestion:
      'Why did ordinary British families carry cardboard boxes and tape their windows in September 1939?',
    html: '/units/ks2_ww2/worksheets/lesson_01_outbreak_gasmasks_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_01_outbreak_gasmasks_worksheet.pdf',
    desc: `2-page A4 enquiry worksheet with gas mask inspection, September 1939 timeline, gas mask box sketch, and contrasting viewpoints.`,
  },
  lesson_2: {
    num: 2,
    id: 'lesson_2',
    title: 'Enquiry 2: Operation Pied Piper & British Evacuation',
    subtitle: '1.5 Million Children Sent to the Countryside with Brown Luggage Labels',
    enquiryQuestion:
      'What was it like for 1.5 million British children to be sent away from home with a brown paper luggage label?',
    html: '/units/ks2_ww2/worksheets/lesson_02_evacuation_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_02_evacuation_worksheet.pdf',
    desc: `2-page A4 enquiry worksheet plus optional Sheet 3 vintage suitcase activity on Operation Pied Piper and billeting.`,
  },
  lesson_3: {
    num: 3,
    id: 'lesson_3',
    title: 'Enquiry 3: Pre-War Life & Rights Lost (1933–1938)',
    subtitle: 'Everyday Childhoods & How Anti-Jewish Laws Took Away Rights Step by Step',
    enquiryQuestion:
      'What was everyday life like for Jewish children in Europe before 1933, and how were their rights taken away step by step?',
    html: '/units/ks2_ww2/worksheets/lesson_03_prewar_life_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_03_prewar_life_worksheet.pdf',
    desc: `2-page A4 enquiry worksheet contrasting pre-war childhoods, the step-by-step loss of rights (1933–1938), and contrasting viewpoints.`,
  },
  lesson_4: {
    num: 4,
    id: 'lesson_4',
    title: "Enquiry 4: One Small Suitcase — The Kindertransport (1938–1939)",
    subtitle: '10,000 Unaccompanied Refugee Children Rescued Across Europe to Britain',
    enquiryQuestion:
      'How did 10,000 refugee children travel alone across Europe to safety in Britain in 1938–1939?',
    html: '/units/ks2_ww2/worksheets/lesson_04_kindertransport_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_04_kindertransport_worksheet.pdf',
    desc: `2-page A4 enquiry worksheet plus optional Sheet 3 vintage suitcase activity following nine-year-old Vera Löwyová's (later Vera Schaufeld) journey from Prague to London.`,
  },
  lesson_5: {
    num: 5,
    id: 'lesson_5',
    title: 'Enquiry 5: Who Were the Rescuers? (1938–1939)',
    subtitle: 'Nicholas Winton, Trevor Chadwick & The Rescue of 669 Children from Prague',
    enquiryQuestion:
      'How did ordinary volunteers like Nicholas Winton and Trevor Chadwick rescue 669 children from Prague before war broke out?',
    html: '/units/ks2_ww2/worksheets/lesson_05_rescuers_winton_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_05_rescuers_winton_worksheet.pdf',
    desc: `2-page A4 enquiry worksheet exploring Nicholas Winton's scrapbook, the Prague-to-London rescue chain, and moral courage.`,
  },
  lesson_6: {
    num: 6,
    id: 'lesson_6',
    title: 'Enquiry 6: The Blitz & Air Raids (1940–1941)',
    subtitle: '57 Consecutive Nights of Bombing, Shelters & Community Survival',
    enquiryQuestion:
      'How did ordinary families protect themselves when bombs fell night after night during the Blitz?',
    html: '/units/ks2_ww2/worksheets/lesson_06_the_blitz_shelters_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_06_the_blitz_shelters_worksheet.pdf',
    desc: `2-page A4 enquiry worksheet exploring Anderson and Morrison shelters, London Underground platforms, and fire watchers.`,
  },
  lesson_7: {
    num: 7,
    id: 'lesson_7',
    title: 'Enquiry 7: Dig for Victory & Wartime Rationing (1940–1945)',
    subtitle: 'Coupon Books, Atlantic Convoys & Growing Vegetables Across Britain',
    enquiryQuestion:
      'Why did the British government ration butter, sugar, and meat, and ask families to "Dig for Victory"?',
    html: '/units/ks2_ww2/worksheets/lesson_07_dig_for_victory_rationing_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_07_dig_for_victory_rationing_worksheet.pdf',
    desc: `2-page A4 enquiry worksheet on coupon rationing, Atlantic U-boat blockades, and Dig for Victory allotments.`,
  },
  lesson_8: {
    num: 8,
    id: 'lesson_8',
    title: 'Enquiry 8: Women at War (1941–1945)',
    subtitle: 'Munitions Factories, Lumberjills & 80,000 Women in the Land Army',
    enquiryQuestion:
      'How did women on farms, in forests, and in factories keep Britain fighting during the Second World War?',
    html: '/units/ks2_ww2/worksheets/lesson_08_women_at_war_land_army_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_08_women_at_war_land_army_worksheet.pdf',
    desc: `2-page A4 enquiry worksheet on the Women's Land Army, Lumberjills in the Timber Corps, munitions factories, and the ATS.`,
  },
  lesson_9: {
    num: 9,
    id: 'lesson_9',
    title: 'Enquiry 9: Secret Codebreakers & Bletchley Park (1941–1945)',
    subtitle: 'Enigma Machines, Alan Turing, Bombe Computers & Keeping Ultra Secret',
    enquiryQuestion:
      'How did secret codebreakers working in wooden huts at Bletchley Park help shorten the Second World War?',
    html: '/units/ks2_ww2/worksheets/lesson_09_bletchley_codebreakers_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_09_bletchley_codebreakers_worksheet.pdf',
    desc: `2-page A4 enquiry worksheet examining Enigma rotors, Alan Turing's Bombe machine, and the women who ran Station X.`,
  },
  lesson_10: {
    num: 10,
    id: 'lesson_10',
    title: 'Enquiry 10: VE Day, Rebuilding Britain & Remembrance (1945)',
    subtitle: '8 May 1945 Celebrations, Mixed Emotions & Remembering Sacrifice',
    enquiryQuestion:
      'Why was VE Day on 8 May 1945 a day of both joyful street parties and quiet sadness for British families?',
    html: '/units/ks2_ww2/worksheets/lesson_10_ve_day_remembrance_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_10_ve_day_remembrance_worksheet.pdf',
    desc: `2-page A4 enquiry worksheet exploring VE Day celebrations, post-war rebuilding, and why we remember.`,
  },
  lesson_11: {
    num: 11,
    id: 'lesson_11',
    title: 'Enquiry 11: After the War — The Windermere Children (1945)',
    subtitle: 'From Prague to Lake Windermere • The Calgarth Estate & Rebuilding Lives',
    enquiryQuestion:
      'How did 300 child survivors begin to rebuild their lives by Lake Windermere in August 1945?',
    html: '/units/ks2_ww2/worksheets/lesson_11_windermere_children_worksheet.html',
    pdf: '/pdfs/ks2_ww2/lesson_11_windermere_children_worksheet.pdf',
    desc: `2-page A4 enquiry worksheet exploring the August 1945 RAF Stirling flight to Carlisle, Calgarth Estate, and Tom Palmer's After the War.`,
  },
};

export const KS2_TEACHER_GUIDANCE_DATA = {
  lesson_1: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Home Front: Outbreak & Civilian Defences).`,
    timeline: [
      {
        time: '00–10 mins',
        phase: 'Do Now Starter',
        activity:
          'Pupils complete the 5-question retrieval starter checking prior knowledge of 1939 Britain, maps of Europe, and air travel.',
      },
      {
        time: '10–25 mins',
        phase: 'Primary Source Enquiry',
        activity:
          'Project Source A (school gas mask drill) and Source B (blackout poster). Discuss using the Hinge Question.',
      },
      {
        time: '25–50 mins',
        phase: 'Worksheet Application',
        activity:
          'Pupils complete Task 1 (Source Detective), Task 2 (September 1939 Timeline), Task 3 (Gas Mask Box & Home Front Kit), and Task 4 (Thinking Heads).',
      },
      {
        time: '50–60 mins',
        phase: 'Plenary & Quiz',
        activity:
          'Pupils write their Task 5 Mission Challenge paragraph and complete the 5-question retrieval check.',
      },
    ],
    subjectPrimer: `On 1 September 1939, Nazi Germany invaded Poland and Britain immediately enforced a nationwide Blackout at sunset. Two days later, on Sunday 3 September 1939 at 11:15am, Prime Minister Neville Chamberlain announced on BBC wireless radio that Britain was at war with Germany. Within minutes, a false-alarm air raid siren wailed across London. Remembering poison gas from the First World War, the government issued 38 million rubber gas masks in cardboard boxes with string shoulder straps. Streetlamps were switched off, car headlights were fitted with slotted covers, windows were covered with heavy black curtains, and families taped brown gummed paper across glass panes to stop flying splinters. Every citizen also received a National Identity Card.`,
    misconceptions: [
      {
        misconception: `Children often believe heavy German bombing started on the very first day of the war.`,
        correction: `Explain that the first eight months in Britain became known as the "Phoney War" because heavy bombing of cities did not begin until late summer 1940. Gas masks, blackout curtains, and shelters were prepared early to protect families in advance.`,
      },
      {
        misconception: `Children assume gas masks were optional or only given to soldiers.`,
        correction: `Gas masks were issued to every civilian. Toddlers aged two to four were given bright red and blue "Mickey Mouse" masks so they would be less frightened, and babies had enclosed gas helmets with hand-pumped air bellows.`,
      },
    ],
    hingeQuestion: `Why did the British government give a gas mask to every baby, child, and adult before a single bomb had fallen on Britain?`,
    hingeGuidance: `Look for pupils explaining that leaders remembered poison gas in the First World War and feared enemy bomber planes might drop gas on crowded cities without warning, so families had to be ready first.`,
    answers: {
      task1: `1) Gas Mask Design: Made of thick black rubber with a clear eyepiece and a metal filter tin at the front to clean poisonous gas from the air. 2) Cardboard Box & String Strap: Carried over the shoulder everywhere (to school, the shops, and play) so nobody would be caught outside without protection if a gas warning sounded, while keeping the rubber safe from damage.`,
      task2: `Step 1: Germany invades Poland and the British Blackout begins at sunset (1 September 1939). Step 2: Prime Minister Neville Chamberlain announces on BBC radio that Britain is at war (3 September 1939, 11:15am). Step 3: Air raid sirens sound a false alarm over London minutes later. Step 4: 38 million gas masks, taped windows, and ARP wardens become part of daily life.`,
      task3: `1) Cardboard Gas Mask Box: Kept the rubber mask safe and dry over your shoulder. 2) Anti-Dimming Stick: Rubbed onto the eyepieces so warm breath did not steam up the glass. 3) Criss-Cross Window Tape: Stopped glass shattering into sharp flying splinters during bomb blasts. 4) National Identity Card: Proved who every citizen was and helped reunite separated families.`,
      task4: `Perspective 1 (10-Year-Old Schoolchild): Nervous and uncomfortable smelling hot rubber during school drills, finding it hard to talk through the mask, yet comforted that classmates are practising together. Perspective 2 (ARP Warden): Serious and watchful walking pitch-black streets at night, checking that no chink of light shows from curtains ("Put that light out!").`,
      task5_wagoll: `In September 1939, ordinary British families carried cardboard boxes and taped their windows because the government feared enemy planes would drop poison gas and high-explosive bombs on towns and cities. Every man, woman, and child was given one of 38 million rubber gas masks to carry on a string strap wherever they went. At home, families hung thick blackout curtains on 1 September so enemy pilots could not spot towns from the sky, and stuck criss-cross paper tape onto glass panes to stop sharp splinters flying indoors. Even before the big air raids began, ordinary streets and homes had become part of the Home Front.`,
    },
  },

  lesson_2: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Home Front: Evacuation & Operation Pied Piper).`,
    timeline: [
      {
        time: '00–10 mins',
        phase: 'Do Now Starter',
        activity:
          '5-question retrieval check recapping Lesson 1 (3 September 1939, Blackout, gas masks, and ARP wardens).',
      },
      {
        time: '10–25 mins',
        phase: 'Dual Source Enquiry',
        activity:
          'Examine Source A (children walking with luggage labels and gas mask boxes) and Source B (British Evacuation Map of danger zones and reception areas).',
      },
      {
        time: '25–50 mins',
        phase: 'Worksheet Application',
        activity:
          'Pupils complete Task 1 (Luggage Label Detective), Task 2 (Pied Piper Timeline), Task 3 (Evacuee Suitcase List), and Task 4 (Thinking Heads).',
      },
      {
        time: '50–60 mins',
        phase: 'Plenary & Postcard',
        activity:
          'Pupils write their Task 5 Postcard Home to Mum and Dad and complete the 5-question retrieval check.',
      },
    ],
    subjectPrimer: `On Friday 1 September 1939—two days before war was officially declared—the government launched Operation Pied Piper. Across three days, 1.5 million schoolchildren, teachers, and mothers with children under five left industrial cities such as London, Manchester, Liverpool, Birmingham, and Glasgow for safer countryside "reception areas" in Devon, Cornwall, Wales, and rural counties. Each child wore a brown cardboard luggage label tied to their coat showing their name, school, and destination. At village halls, Billeting Officers matched children with local host families. Experiences varied hugely: many city children loved seeing cows, orchards, and green fields for the first time, while others felt terribly homesick or were placed with strict, unkind hosts.`,
    misconceptions: [
      {
        misconception: `Pupils often assume every evacuee had a happy countryside holiday—or that every host family was cruel.`,
        correction: `Show pupils that experiences were mixed. Some evacuees stayed in touch with loving host families for the rest of their lives, while others missed home terribly or faced unkindness and returned to cities during the quiet "Phoney War" months.`,
      },
      {
        misconception: `Children assume parents travelled on the trains with school-age evacuees.`,
        correction: `Explain that mothers only travelled with babies and toddlers under five. School-age children travelled in class groups with their schoolteachers and waved goodbye to their parents at railway barriers.`,
      },
    ],
    hingeQuestion: `Looking at the map of Britain, why did trains take London children west to Devon, Cornwall, and Wales rather than south-east to Kent?`,
    hingeGuidance: `Guide pupils to spot that Kent lay closest to mainland Europe underneath bomber flight paths, whereas western countryside counties were much further from enemy airfields and had fewer large factories or docks.`,
    answers: {
      task1: `1) Brown Luggage Label: Pinned or tied to each child's coat with their full name, home address, school, and reception area so teachers and officials would not lose track of any child among 1.5 million travellers. 2) Helpers at the Station: Police officers, railway staff, and Women's Voluntary Services helpers guided school lines safely onto the right steam trains.`,
      task2: `Step 1: Operation Pied Piper begins on 1 September 1939 before war is even declared. Step 2: 1.5 million children wave goodbye to parents at city railway stations with teachers. Step 3: Steam trains arrive in country towns and children gather in village halls. Step 4: Billeting Officers place children into rural host homes.`,
      task3: `Essential Suitcase Items: 1) Gas mask in its cardboard box (compulsory everywhere). 2) Change of underwear, nightclothes, and warm woollen jumper (for cold country houses). 3) Toothbrush, comb, towel, and soap. 4) Strong walking boots or plimsolls. 5) Packet of sandwiches, an apple, and a family photo or postcard to write home.`,
      task4: `Perspective 1 (City Evacuee Child): Heartbroken waving goodbye at the station and nervous standing in the village hall waiting to be chosen, amazed by pitch-dark country lanes and farm animals. Perspective 2 (Country Host Mother): Wanting to keep city children safe from bombs, busy making up spare beds and cooking extra meals for tired, homesick strangers.`,
      task5_wagoll: `Dear Mum and Dad, I arrived safely in Devon after a very long steam train ride with my school class. My brown luggage label stayed tied to my coat all the way, and I kept my gas mask box over my shoulder just like you told me! At the village hall, the Billeting Officer introduced me to Mrs Evans, who lives in a stone cottage near a dairy farm. Today I saw real cows being milked for the first time, though the dark country lanes feel strangely quiet without London buses. I miss you both every night, so please write back soon. Lots of love, Tommy.`,
    },
  },

  lesson_3: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Holocaust: Pre-War Jewish Life & Step-by-Step Loss of Rights, 1933–1938). Grounded in trauma-informed primary history safeguarding principles.`,
    safeguardingNote: `<strong>HET Primary Safeguarding &amp; Trauma-Informed Practice (Enquiry 3):</strong> Always begin with rich pre-war Jewish family life, hobbies, and individuality before introducing Nazi persecution. <strong>Never</strong> use classroom roleplay, simulations, or "imagine you are banned" segregation games, and <strong>never</strong> display graphic atrocity imagery to KS2 pupils. Check pastorally in advance for pupils with refugee backgrounds or family experiences of discrimination.`,
    timeline: [
      {
        time: '00–10 mins',
        phase: 'Do Now Starter',
        activity:
          '5-question retrieval check recapping Lessons 1–2 (outbreak of war, blackout, and Operation Pied Piper).',
      },
      {
        time: '10–25 mins',
        phase: 'Dual Source Enquiry',
        activity:
          'Examine Source A (1935 Jewish boys’ football team photograph) and Source B (c. 1935–1937 German anti-Jewish exclusion sign reading "Juden werden hier nicht bedient" / "Jews are not served here"), alongside the November 1938 decree banning Jewish children from German state schools.',
      },
      {
        time: '25–50 mins',
        phase: 'Worksheet Application',
        activity:
          'Pupils complete Task 1 (Pre-War Photo & Exclusion Sign Detective), Task 2 (1933–1938 Rights Lost Timeline), Task 3 (Before & After 1938 Comparison), and Task 4 (Thinking Heads).',
      },
      {
        time: '50–60 mins',
        phase: 'Plenary & Reflection',
        activity:
          'Pupils write their Task 5 Mission Challenge paragraph on why learning about pre-war family life matters and complete the 5-question quiz.',
      },
    ],
    subjectPrimer: `Before Adolf Hitler and the Nazi Party took power in Germany in January 1933, Jewish families across Germany, Austria, and Czechoslovakia lived ordinary, settled lives as neighbours, doctors, shopkeepers, musicians, teachers, and schoolchildren. Children played in local football teams, swam at public lidos, rode bicycles, and studied alongside non-Jewish friends. Between 1933 and 1938, the Nazi government passed hundreds of unfair anti-Jewish laws step by step: putting up street and shop exclusion signs (such as <em>"Juden werden hier nicht bedient"</em> — "Jews are not served here"), excluding Jewish people from sports clubs and public parks, stripping away German citizenship under the 1935 Nuremberg Laws, attacking synagogues and Jewish shops on 9–10 November 1938 (Kristallnacht), and banning Jewish children from state schools days later.`,
    misconceptions: [
      {
        misconception: `Pupils sometimes imagine Jewish families lived completely separately from everyone else before 1933.`,
        correction: `Show pupils through pre-war family and sports photographs that Jewish families were proud citizens who went to the same schools, supported the same football clubs, and loved their home towns.`,
      },
      {
        misconception: `Pupils assume all rights vanished on a single day in 1939 when war began.`,
        correction: `Explain that unfair laws built up gradually over five peacetime years (1933–1938)—from shop exclusion signs, park benches, and swimming pools to citizenship and schools—making life unsafe before the war had even started.`,
      },
    ],
    hingeQuestion: `What does the 1935 photograph of the boys' football team prove about life for Jewish children before anti-Jewish laws shut them out?`,
    hingeGuidance: `Look for pupils explaining that Jewish children had ordinary hobbies, teammates, pride, and friendships just like pupils today, showing how much was unfairly taken from them between 1933 and 1938.`,
    answers: {
      task1: `1) Source A — Football Team Photograph (1935): Shows eleven boys standing proudly in numbered football shirts with a trophy/football, proving Jewish children enjoyed ordinary sports, clubs, and friendships. 2) Source B — Anti-Jewish Exclusion Sign ("Juden werden hier nicht bedient" / "Jews are not served here", Germany, c. 1935–1937): Proves how unfair public signs openly excluded Jewish families from everyday shops, cafés, and community spaces step by step, culminating in the November 1938 ban from state schools.`,
      task2: `Step 1: January 1933 — Hitler becomes Chancellor of Germany; early boycotts and bans from sports clubs begin. Step 2: September 1935 — Nuremberg Laws take away German citizenship from Jewish people and exclusion signs spread across towns. Step 3: 9–10 November 1938 — Kristallnacht attacks burn synagogues and smash Jewish shop windows. Step 4: 15 November 1938 — Official order expels all Jewish children from German state schools.`,
      task3: `1) Everyday Life Before 1933: Attending local school with friends, playing in football clubs, visiting swimming pools and cinemas, and celebrating birthdays and Jewish festivals freely. 2) Rights Lost by Late 1938: Turned away by shop exclusion signs, shut out of state schools, banned from public parks, cinemas, and pools, stripped of citizenship, and frightened after Kristallnacht.`,
      task4: `Perspective 1 (Jewish Pupil Shut Out of School, Nov 1938): Upset, confused, and lonely standing outside the school gates, missing classmates and lessons despite having done nothing wrong. Perspective 2 (Non-Jewish Classmate Inside): Uncomfortable staring at a best friend's empty desk, afraid to speak out against unfair adult rules.`,
      task5_wagoll: `Learning about Jewish children's everyday lives before 1933 is important because it shows us who they really were as ordinary boys and girls with hobbies, families, and dreams. Photographs from cities like Berlin, Vienna, and Prague show children smiling in football teams, playing music, and learning beside their friends. Between 1933 and 1938, unfair Nazi laws and public signs ("Jews are not served here") took away their rights step by step: the 1935 Nuremberg Laws removed their citizenship, and after Kristallnacht in November 1938 Jewish children were banned from state schools altogether. Seeing their happy lives first helps us understand how cruel those laws were and why Jewish parents urgently looked for ways to get their children to safety.`,
    },
  },

  lesson_4: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Holocaust: One Small Suitcase — The Kindertransport, 1938–1939). Grounded in trauma-informed primary history safeguarding principles.`,
    safeguardingNote: `<strong>HET Primary Safeguarding &amp; Trauma-Informed Practice (Enquiry 4):</strong> Frame the Kindertransport honestly—celebrating rescue while acknowledging painful family separation without graphic detail. Avoid asking pupils "What would you pack if you never saw your parents again?"; instead ask historically grounded questions ("What did nine-year-old Vera pack in her suitcase and why?"). Be especially mindful of looked-after, adopted, refugee, or bereaved pupils.`,
    timeline: [
      {
        time: '00–10 mins',
        phase: 'Do Now Starter',
        activity:
          '5-question retrieval check recapping Lesson 3 (1935 Nuremberg Laws, exclusion signs, Kristallnacht in November 1938, school bans, and why families sought safety).',
      },
      {
        time: '10–25 mins',
        phase: 'Dual Source Enquiry',
        activity:
          'Investigate Source A (refugee children arriving in Britain wearing numbered tags) and Source B (Kindertransport railway and ferry map across Europe to Harwich and London).',
      },
      {
        time: '25–50 mins',
        phase: 'Worksheet Application',
        activity:
          "Pupils complete Task 1 (Identity Tag Detective), Task 2 (Kindertransport Rescue Timeline), Task 3 (One Small Suitcase Packing Choice), and Task 4 (Thinking Heads).",
      },
      {
        time: '50–60 mins',
        phase: 'Plenary & Quiz',
        activity:
          'Pupils write their Task 5 Mission Challenge paragraph explaining why the Kindertransport brought both safety and heartbreak, then complete the 5-question quiz.',
      },
    ],
    subjectPrimer: `Just days after Kristallnacht in November 1938, refugee charities appealed to Prime Minister Neville Chamberlain and the British Parliament. Britain agreed to waive normal visa delays for unaccompanied refugee children aged under seventeen, provided private sponsors guaranteed £50 per child (worth over £3,000 today). Parents were not allowed to travel with them. Between December 1938 and the outbreak of war in September 1939, nearly 10,000 mostly Jewish children travelled from Germany, Austria, Czechoslovakia, and Poland by train across the Dutch border at Bentheim, took the ferry from Hook of Holland to Harwich in Essex, and rode steam trains into London Liverpool Street Station. Nine-year-old Vera Löwyová (later Vera Schaufeld) left Prague in May 1939 carrying one small suitcase, an English porcelain doll, and a little autograph diary signed by her parents.`,
    misconceptions: [
      {
        misconception: `Pupils confuse British evacuation (Operation Pied Piper) with the Kindertransport.`,
        correction: `Draw a clear contrast: British evacuees moved inside Britain in September 1939 to escape air raids and most went home to their parents; Kindertransport children fled Nazi persecution in Europe BEFORE war started (Dec 1938–Aug 1939), spoke little or no English, and most never saw their parents again.`,
      },
      {
        misconception: `Pupils assume the British government paid for the trains and let whole families enter together.`,
        correction: `Explain that adult parents were refused visas under the scheme and private charities and British families had to raise the £50 guarantee for every child.`,
      },
    ],
    hingeQuestion: `Why did crossing the border into the Netherlands feel like the first moment of real safety for children on Kindertransport trains?`,
    hingeGuidance: `Use the route map: while inside German-controlled territory, armed border guards searched suitcases and frightened children; once across the Dutch border, kind Dutch volunteers handed out hot cocoa, buns, and smiles before the ferry to Harwich.`,
    answers: {
      task1: `1) Numbered Neck Tag: Worn on string around each child's neck showing their transport number and name so British helpers at Harwich and Liverpool Street could match children who spoke no English with their foster families. 2) What the Photo Shows: The children carry small suitcases and dolls safely in Britain, yet look tired and bewildered after leaving their parents behind.`,
      task2: `Step 1: After Kristallnacht (November 1938), Parliament allows unaccompanied refugee children into Britain with a £50 sponsor guarantee. Step 2: Nine-year-old Vera Löwyová waves goodbye to her parents in Prague with one suitcase (May 1939). Step 3: The train crosses the Dutch border to safety and children sail from Hook of Holland to Harwich. Step 4: Trains pull into London Liverpool Street Station where foster families meet the children.`,
      task3: `Vera's One Small Suitcase: Allowed only one small case and no money or valuables. Key items: 1) Warm coat, dresses, and sturdy shoes. 2) Family photograph of Mum, Dad, and Grandmother. 3) Vera's treasured English porcelain doll for comfort. 4) Her small autograph diary containing loving messages written by her parents in Czech.`,
      task4: `Perspective 1 (Nine-Year-Old Vera on the Train): Heartbroken watching her parents grow smaller on Prague station platform, clutching her doll and diary, nervous about arriving in a country where she cannot yet speak English. Perspective 2 (British Foster Mother at Liverpool Street): Waiting warmly on the station platform, determined to make a frightened refugee child feel safe and welcome in a strange new home.`,
      task5_wagoll: `The Kindertransport of 1938–1939 saved nearly 10,000 children's lives, yet it was also full of heartbreak for their families. After Kristallnacht in November 1938, Britain allowed unaccompanied refugee children in if a sponsor paid a £50 guarantee, but mothers and fathers were not allowed to come with them. Nine-year-old Vera Löwyová (later Vera Schaufeld) had to say goodbye to her parents at Prague station with just one suitcase, her porcelain doll, and an autograph diary, before travelling by train and ferry to Harwich and London Liverpool Street. Although kind foster families kept Vera safe in Britain, war broke out in September 1939 and most Kindertransport children never saw their parents again.`,
    },
  },

  lesson_5: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Holocaust: Rescuers & Upstanders, 1938–1939). Grounded in trauma-informed primary history safeguarding principles.`,
    safeguardingNote: `<strong>HET Primary Safeguarding &amp; Trauma-Informed Practice (Enquiry 5):</strong> Highlight practical moral courage and teamwork (Nicholas Winton, Babette Winton, Doreen Warriner, Trevor Chadwick, and Jewish parents) without turning history into a simplistic fairy tale—handle the cancelled 1 September 1939 train gently and factually without graphic speculation.`,
    timeline: [
      {
        time: '00–10 mins',
        phase: 'Do Now Starter',
        activity:
          "5-question retrieval check recapping Lesson 4 (10,000 Kindertransport children, £50 guarantee, Vera's Prague journey, and Harwich/Liverpool Street).",
      },
      {
        time: '10–25 mins',
        phase: 'Dual Source Enquiry',
        activity:
          "Examine Source A (Nicholas Winton holding a young child in Prague) and Source B (page from Winton's scrapbook of rescued children).",
      },
      {
        time: '25–50 mins',
        phase: 'Worksheet Application',
        activity:
          "Pupils complete Task 1 (Scrapbook Detective), Task 2 (Prague Rescue Chain), Task 3 (The 50-Year Attic Secret), and Task 4 (Thinking Heads).",
      },
      {
        time: '50–60 mins',
        phase: 'Plenary & Quiz',
        activity:
          'Pupils write their Task 5 Mission Challenge paragraph explaining what makes someone an "upstander" and complete the 5-question quiz.',
      },
    ],
    subjectPrimer: `Most early Kindertransport trains left Berlin and Vienna, leaving refugee children in Prague in terrible danger without an organised rescue scheme. In December 1938, a 29-year-old London stockbroker named Nicholas Winton cancelled his Swiss skiing holiday after a friend asked him to come to Prague. Shocked by freezing refugee camps, Winton set up a desk in his hotel dining room to take parents' applications. Returning to his day job in London, he worked every evening with his mother Babette, while British schoolteacher Trevor Chadwick and Doreen Warriner stayed in Prague facing Nazi secret police (Gestapo) checks and putting children onto trains. Between March and August 1939, eight trains brought 669 children from Prague to London. A ninth train for 1 September 1939 was stopped when Germany invaded Poland. Winton kept his scrapbook in his attic without seeking praise until 1988.`,
    misconceptions: [
      {
        misconception: `Pupils assume Nicholas Winton was a famous government minister with official power.`,
        correction: `Clarify that Winton was an ordinary 29-year-old office worker who used his own holiday and evenings to write letters, print photo cards, and persuade officials and foster families to help.`,
      },
      {
        misconception: `Pupils think Nicholas Winton rescued all 669 children single-handedly.`,
        correction: `Highlight the teamwork: Doreen Warriner, schoolteacher Trevor Chadwick on the platforms in Prague, Babette Winton in London, and hundreds of British foster families who paid £50 guarantees and opened their homes.`,
      },
    ],
    hingeQuestion: `Why did Nicholas Winton need a team of helpers in both Prague and London for even a single train to leave safely?`,
    hingeGuidance: `Look for pupils connecting both ends of the rescue chain: Trevor Chadwick and Doreen Warriner had to gather children and exit papers in Prague, while Winton and his mother in London had to find a named British foster home and £50 guarantee before the Home Office issued each visa.`,
    answers: {
      task1: `1) Winton's Scrapbook: Contains small black-and-white identity photos, children's names, dates of birth, and the names and addresses of British foster families for the 669 rescued children. 2) Why Careful Records Mattered: Matched every child safely to a verified home in Britain and preserved proof of who they were so grown-up survivors could trace their story fifty years later.`,
      task2: `Link 1: December 1938 — Nicholas Winton visits Prague instead of going skiing and records thousands of endangered children's details. Link 2: Spring–Summer 1939 — Winton and his mother find British foster families and £50 guarantees in London while Trevor Chadwick organises trains in Prague. Link 3: March–August 1939 — Eight trains carry 669 children safely to London. Link 4: 1 September 1939 — War breaks out and borders slam shut, stopping the ninth train.`,
      task3: `1) Kept Quiet for 50 Years: Winton put the scrapbook in his attic after the war and got on with ordinary life because he did not help children to win medals or fame, and he felt deep sorrow for the 250 children on the ninth train that never left on 1 September 1939. 2) Upstander vs Bystander: An upstander steps forward to help when others are treated unfairly instead of looking away.`,
      task4: `Perspective 1 (Trevor Chadwick on Prague Platform): Staying calm while armed guards watch the platform, checking every child's travel permit and comforting crying parents as the train doors close. Perspective 2 (Nicholas Winton in London): Working late into the night after his office job, writing letters to newspapers and chasing Home Office permits before war starts.`,
      task5_wagoll: `Ordinary volunteers like Nicholas Winton and Trevor Chadwick rescued 669 children from Prague because they chose to be upstanders rather than bystanders. In December 1938, 29-year-old Nicholas Winton cancelled his skiing holiday to visit Prague and began listing endangered children in his hotel room. Back in London, he and his mother worked late every night finding British foster families and £50 guarantees, while teacher Trevor Chadwick stayed in Prague putting children safely onto eight trains before war closed the borders on 1 September 1939. Winton did not even talk about his attic scrapbook for fifty years, proving that ordinary people working together can save hundreds of lives.`,
    },
  },

  lesson_6: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Home Front: The Blitz & Air Raid Defences, 1940–1941).`,
    safeguardingNote: `<strong>Sensory &amp; Conflict-Sensitive Classroom Note (Enquiry 6):</strong> Be mindful of pupils who have experienced modern armed conflict, displacement, house fires, or sensory anxiety around loud alarms. Warn the class before playing any wartime siren audio clip, keep volume low, and emphasise how neighbours, ARP wardens, and firefighters worked together to keep people safe.`,
    timeline: [
      {
        time: '00–10 mins',
        phase: 'Do Now Starter',
        activity:
          '5-question retrieval check recapping Lessons 1–5 (Blackout, evacuation reception areas, and pre-war rescue timelines).',
      },
      {
        time: '10–25 mins',
        phase: 'Dual Source Enquiry',
        activity:
          'Examine Source A/B (Anderson garden shelter & families sheltering on Underground platforms) alongside the Map of Blitz Target Cities.',
      },
      {
        time: '25–50 mins',
        phase: 'Worksheet Application',
        activity:
          'Pupils complete Task 1 (Shelter Detective), Task 2 (Night in the Blitz Timeline), Task 3 (Anderson Shelter Diagram & Kit), and Task 4 (Thinking Heads).',
      },
      {
        time: '50–60 mins',
        phase: 'Plenary & Quiz',
        activity:
          'Pupils write their Task 5 Mission Challenge paragraph explaining how families and wardens survived the Blitz, then complete the 5-question quiz.',
      },
    ],
    subjectPrimer: `From 7 September 1940 ("Black Saturday") until May 1941, the German air force (Luftwaffe) launched the Blitz—from the German word Blitzkrieg ("lightning war"). London was bombed for 57 nights in a row, alongside major ports and factory cities including Coventry, Liverpool, Birmingham, Plymouth, Portsmouth, Glasgow (Clydebank), Hull, Bristol, and Belfast. Families with gardens half-buried corrugated steel Anderson shelters under 15 inches of soil, while families without gardens used indoor steel-mesh Morrison table cages or bought tickets to sleep on deep London Underground platforms. Above ground, ARP wardens, the Auxiliary Fire Service (AFS), and rooftop fire watchers tackled incendiary bombs and rescued trapped neighbours, as over 43,000 British civilians lost their lives.`,
    misconceptions: [
      {
        misconception: `Pupils often think the Blitz only happened in London.`,
        correction: `Point to Coventry, Liverpool, Plymouth, Clydebank, Hull, Birmingham, and Belfast on the Blitz map—ports, shipyards, and aircraft factories across the whole UK were heavily bombed.`,
      },
      {
        misconception: `Pupils assume every family had an Anderson shelter in a back garden.`,
        correction: `Explain that inner-city flats and terraced houses often had concrete yards or no gardens at all, which is why steel indoor Morrison table shelters (from 1941) and Underground stations were so important.`,
      },
    ],
    hingeQuestion: `Why did German bombers target port cities like Liverpool and factory cities like Coventry as fiercely as London?`,
    hingeGuidance: `Look for pupils explaining that Liverpool's docks unloaded food and supplies from ships, while Coventry's factories built aircraft engines—destroying ports and factories aimed to stop Britain fighting.`,
    answers: {
      task1: `1) Shelter Protection: Deep Underground Tube platforms protected thousands of city dwellers under thick earth and concrete, while corrugated steel Anderson shelters cushioned blast waves and flying shrapnel in back gardens. 2) Everyday Life in Shelters: Families brought blankets, flasks of hot tea, knitting, and singing to keep spirits up during noisy night raids.`,
      task2: `Step 1: Dusk falls, blackout curtains are drawn, and the rising-and-falling air raid siren warns bombers are approaching. Step 2: Families hurry into garden Anderson shelters, indoor Morrison cages, or Underground stations. Step 3: Bombs fall overhead while AFS firefighters and rooftop fire watchers put out incendiary blazes with sand and stirrup pumps. Step 4: The steady "All Clear" siren sounds at dawn and neighbours help clear rubble.`,
      task3: `1) Anderson Shelter Design: Six curved corrugated steel sheets bolted together, sunk 3 feet into the garden and covered with at least 15 inches of earth (families often grew vegetables on top!). 2) Shelter Survival Kit: Warm woollen blankets, torch, flask of sweet tea, biscuits, first-aid tin, and storybooks or cards.`,
      task4: `Perspective 1 (Child Inside a Damp Anderson Shelter): Shivering under blankets, listening to the whistle and thud of bombs outside, singing songs with Mum to block out the noise. Perspective 2 (Auxiliary Firefighter / Fire Watcher): Braving sparks and falling shrapnel in the dark street to pump water onto burning buildings and keep neighbours safe.`,
      task5_wagoll: `During the Blitz of 1940–1941, ordinary British families protected themselves through clever shelters, strict air raid rules, and brave teamwork. When the wailing siren sounded across cities like London, Coventry, and Liverpool, families with gardens hurried into corrugated steel Anderson shelters covered with 15 inches of earth. Families without gardens slept inside steel-mesh Morrison table cages in their living rooms or deep down on London Underground station platforms. Meanwhile, ARP wardens and Auxiliary Firefighters risked their lives putting out incendiary fires above ground until the steady All Clear siren sounded at dawn.`,
    },
  },

  lesson_7: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Home Front: Rationing & Dig for Victory, 1940–1945).`,
    timeline: [
      {
        time: '00–10 mins',
        phase: 'Do Now Starter',
        activity:
          '5-question retrieval check recapping Lesson 6 (7 September 1940, Anderson vs Morrison shelters, Coventry/Liverpool, and All Clear sirens).',
      },
      {
        time: '10–25 mins',
        phase: 'Dual Source Enquiry',
        activity:
          'Investigate Source A/C (Ration Books & the Dig for Victory poster) alongside Source B (Atlantic Convoy & U-Boat Map).',
      },
      {
        time: '25–50 mins',
        phase: 'Worksheet Application',
        activity:
          'Pupils complete Task 1 (Ration & Poster Detective), Task 2 (Feeding Britain Timeline), Task 3 (Weekly Ration Ledger & Woolton Pie Menu), and Task 4 (Thinking Heads).',
      },
      {
        time: '50–60 mins',
        phase: 'Plenary & Quiz',
        activity:
          'Pupils write their Task 5 Mission Challenge paragraph explaining why rationing meant "fair shares for all" and complete the 5-question quiz.',
      },
    ],
    subjectPrimer: `Before 1939, island Britain imported more than two-thirds of its food—around 55 million tons a year—by merchant ship across the oceans. During the Battle of the Atlantic, German U-boat submarines hunted merchant convoys to starve Britain into surrender. In January 1940, the Ministry of Food introduced rationing using coupon books (buff for adults, green with extra milk and vitamins for expectant mothers and children under five, blue for older children). Money alone could not buy rationed bacon, butter, or sugar without coupons. At the same time, the "Dig for Victory" campaign turned over 1.4 million allotments, parks, school fields, and even the Tower of London moat into vegetable patches. Families cooked inventive dishes like Lord Woolton Pie (made from carrots, potatoes, swede, and oatmeal pastry) and dried egg omelettes.`,
    misconceptions: [
      {
        misconception: `Pupils assume British children starved and became less healthy under rationing.`,
        correction: `Surprise pupils with the historical evidence: because sweets and fats were limited, vegetables were plentiful, and poor families received guaranteed rations plus free milk and cod liver oil, British children grew taller and healthier than in the 1930s!`,
      },
      {
        misconception: `Pupils think vegetables and potatoes were heavily rationed just like sugar and bacon.`,
        correction: `Clarify that home-grown vegetables and potatoes remained unrationed during the war—which is why "Dig for Victory" allotments were so helpful for filling hungry stomachs.`,
      },
    ],
    hingeQuestion: `Looking at the map of Atlantic ship convoys, how did planting potatoes in a British back garden help save sailors' lives at sea?`,
    hingeGuidance: `Guide pupils to link home allotments with ocean shipping: every sack of potatoes and carrots grown in Britain freed up space on merchant ships for fuel and equipment, meaning fewer sailors had to risk crossing U-boat danger zones.`,
    answers: {
      task1: `1) Ration Book & Dig for Victory Poster: Shopkeepers clipped or stamped weekly coupons so rich families could not buy up all the food, while the poster shows even a young child with a garden spade helping grow vegetables. 2) Why Fair Shares Mattered: Kept everyone fed fairly and stopped food running out in poorer neighbourhoods.`,
      task2: `Step 1: German U-boats attack merchant ships bringing imported food across the Atlantic Ocean. Step 2: Ministry of Food introduces ration books in January 1940 (starting with bacon, butter, and sugar). Step 3: Families dig up lawns, parks, and school fields for "Dig for Victory" vegetable allotments. Step 4: Home cooks invent wartime recipes like Lord Woolton Pie and carrot biscuits.`,
      task3: `1) Typical Weekly Adult Ration: 4oz bacon/ham, 2oz butter, 2oz cheese, 4oz margarine, 8oz sugar, 2oz tea, and 1 fresh egg per week (plus dried egg powder). 2) Wartime Menu: Vegetable soup, Lord Woolton Pie with potatoes and carrots, and carrot pudding—nutritious meals using unrationed garden produce.`,
      task4: `Perspective 1 (Shopkeeper / Grocer): Carefully snipping coupons from customers' registered ration books and explaining politely when bananas or sweets are unavailable. Perspective 2 (Parent Cooking at Home): Queuing outside shops with a basket, tending cabbages on the allotment, and mashing carrots and parsnips to feed growing children.`,
      task5_wagoll: `The British government rationed food and asked families to "Dig for Victory" because before the war Britain imported over two-thirds of its food by sea, and German U-boat submarines were sinking merchant ships in the Atlantic. From January 1940, everyone had to register a ration book with local shops so rich and poor families received the same fair share, such as 8oz of sugar, 2oz of butter, and just 1 fresh egg per week. Because vegetables were not rationed, families dug up flowerbeds and public parks to grow over a million allotments of potatoes and carrots, keeping British children healthy throughout the war.`,
    },
  },

  lesson_8: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Home Front: Women's Wartime Work, 1941–1945).`,
    safeguardingNote: `<strong>Classroom Framing Note (Enquiry 8):</strong> When explaining why munitions workers were nicknamed "Canary Girls", describe the yellow skin staining from TNT powder factually as an example of tough industrial conditions rather than dwelling on graphic factory injuries, and highlight the skill and pride of women across Britain and the wider Empire.`,
    timeline: [
      {
        time: '00–10 mins',
        phase: 'Do Now Starter',
        activity:
          '5-question retrieval check recapping Lesson 7 (U-boats, January 1940 rationing, Dig for Victory, and Lord Woolton Pie).',
      },
      {
        time: '10–25 mins',
        phase: 'Visual & Poster Enquiry',
        activity:
          'Examine the war artist watercolour of Women’s Land Army workers resting beside a haystack with pitchforks and wartime factory photographs.',
      },
      {
        time: '25–50 mins',
        phase: 'Worksheet Application',
        activity:
          'Pupils complete Task 1 (Source Detective), Task 2 (Women Mobilised Timeline), Task 3 (Land Girls, Lumberjills & Canary Girls Roles), and Task 4 (Thinking Heads).',
      },
      {
        time: '50–60 mins',
        phase: 'Plenary & Quiz',
        activity:
          'Pupils write their Task 5 Mission Challenge paragraph explaining how women kept Britain fighting and complete the 5-question quiz.',
      },
    ],
    subjectPrimer: `With millions of men away in the armed forces, Britain faced severe shortages of farmworkers, engineers, and factory staff. In December 1941, Parliament passed the National Service Act (No. 2), making Britain the first country in the war to conscript unmarried women aged 20–30 into vital war work or the auxiliary services. Over 80,000 women joined the Women's Land Army ("Land Girls"), ploughing fields, milking cows at dawn, and harvesting crops, while the Women's Timber Corps ("Lumberjills") felled trees for coal-mine pit props and telegraph poles. Nearly a million women worked in munitions factories filling explosive shells—nicknamed "Canary Girls" because toxic TNT powder turned their skin and hair bright yellow—while hundreds of thousands served in the ATS (operating searchlights and anti-aircraft predictors), WAAF, and WRNS.`,
    misconceptions: [
      {
        misconception: `Pupils assume Land Girls only did light gardening in sunny weather.`,
        correction: `Explain that farm and forest work meant 48-to-50-hour weeks in winter mud and frost: lifting heavy milk churns, driving tractors, clearing ditches, catching farm rats, and sawing tall pine trees as Lumberjills.`,
      },
      {
        misconception: `Pupils think all women chose war work purely as volunteers.`,
        correction: `While millions volunteered proudly from 1939, from December 1941 unmarried women aged 20–30 were legally called up (conscripted) and chose between farming, factory engineering, or uniformed auxiliary branches.`,
      },
    ],
    hingeQuestion: `Why did Parliament pass a law in December 1941 calling up women aged 20 to 30 for war work?`,
    hingeGuidance: `Look for pupils explaining that millions of men were away fighting overseas, so factories making Spitfire planes and farms growing Britain's food would have ground to a halt without millions of women stepping into those skilled jobs.`,
    answers: {
      task1: `1) Land Army Watercolour & Recruitment Posters: Shows Land Girls in practical jumpers, breeches, boots, and headscarves resting briefly by a haystack with pitchforks after heavy harvest labour. 2) Why Their Work Mattered: Replaced male farmworkers called into the army so Britain could harvest grain, milk, and timber during the U-boat blockade.`,
      task2: `Step 1: Millions of British men join the army, navy, and air force, leaving farms and factories short of workers. Step 2: Volunteers join the revived Women's Land Army, factories, and nursing services (1939–1940). Step 3: December 1941 — National Service Act calls up unmarried women aged 20–30. Step 4: Over 7 million British women work across farms, forests, factories, and uniformed services by 1943.`,
      task3: `1) Land Girls & Lumberjills: 80,000 WLA farmworkers ploughed fields and milked herds; Timber Corps Lumberjills felled trees for pit props. 2) Canary Girls & Engineers: Welded Spitfire wings and packed explosive artillery shells in munitions factories where TNT turned skin yellow. 3) ATS, WAAF & WRNS: Operated radar screens, searchlights, dispatch motorcycles, and naval communications.`,
      task4: `Perspective 1 (Canary Girl in a Munitions Factory): Working long noisy night shifts wearing hairnets and overalls, careful with explosive powder that stains skin yellow, proud to supply the troops. Perspective 2 (City Office Clerk Turned Land Girl): Waking at 5:00am with blistered hands in muddy fields, proud to drive a tractor and feed the country.`,
      task5_wagoll: `Women kept Britain fighting during the Second World War by taking on tough, skilled jobs across farms, forests, factories, and the armed services. After millions of men left to fight overseas, Parliament passed the December 1941 National Service Act calling up unmarried women aged 20 to 30. Over 80,000 Land Girls ploughed fields and harvested crops, while Lumberjills cut timber for coal mines. In dangerous munitions factories, "Canary Girls" packed explosive shells even though toxic powder turned their skin yellow, and women in the ATS and WAAF operated searchlights and radar. Without women's hard work, Britain could not have fed its people or built its planes.`,
    },
  },

  lesson_9: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Home Front: Bletchley Park & Secret Intelligence, 1941–1945).`,
    timeline: [
      {
        time: '00–10 mins',
        phase: 'Do Now Starter',
        activity:
          '5-question retrieval check recapping Lesson 8 (December 1941 call-up, Land Girls, Lumberjills, and Canary Girls).',
      },
      {
        time: '10–25 mins',
        phase: 'Dual Source Enquiry',
        activity:
          "Examine Source A (German Enigma cipher machine) and Source B (Alan Turing and Gordon Welchman's Bombe machine operated by Wrens at Bletchley Park).",
      },
      {
        time: '25–50 mins',
        phase: 'Worksheet Application',
        activity:
          'Pupils complete Task 1 (Bombe Detective), Task 2 (Secret Signal Pipeline), Task 3 (How Enigma & Secrecy Worked), and Task 4 (Thinking Heads).',
      },
      {
        time: '50–60 mins',
        phase: 'Plenary & Quiz',
        activity:
          'Pupils write their Task 5 Mission Challenge paragraph explaining how Bletchley Park helped shorten the war and complete the 5-question quiz.',
      },
    ],
    subjectPrimer: `At Bletchley Park ("Station X"), a Victorian country estate in Buckinghamshire, Britain ran its top-secret wartime codebreaking centre. German commanders sent radio orders scrambled by the portable Enigma cipher machine, whose rotating wheels and plugboard wires created over 158 million million million possible settings—and German operators changed those settings every midnight! Building on earlier breakthroughs shared by Polish mathematicians, Alan Turing and Gordon Welchman designed the electromechanical Bombe machine, whose spinning drums rapidly ruled out impossible settings each morning. Around three-quarters of Bletchley Park's 10,000 staff were women (including Wrens of the WRNS and civilian clerks). Everyone signed the Official Secrets Act and kept silent for thirty years so no enemy ever knew Enigma had been broken.`,
    misconceptions: [
      {
        misconception: `Pupils often picture Alan Turing working completely alone in a shed with pencil and paper.`,
        correction: `Explain that Bletchley Park grew to around 10,000 people—around 75% of them women—building on Polish maths breakthroughs, wireless Y-station listeners, engineers, and Wrens running Bombe machines in shifts.`,
      },
      {
        misconception: `Pupils assume Bletchley Park codebreakers were celebrated with parades straight after VE Day in 1945.`,
        correction: `Explain that because they signed the Official Secrets Act, codebreakers could not even tell their parents, husbands, or wives what they had done until the secret became public in the 1970s.`,
      },
    ],
    hingeQuestion: `Why would the whole Enigma breakthrough have failed if just one worker at Bletchley Park had boasted about their job?`,
    hingeGuidance: `Ensure pupils grasp that if German commanders had discovered Britain could read Enigma messages, they would immediately have replaced or redesigned their cipher machines, leaving Allied ships in the dark again.`,
    answers: {
      task1: `1) The Bombe Machine: A large cabinet filled with rows of spinning metal drums designed by Alan Turing and Gordon Welchman to test Enigma wheel positions automatically. 2) Why Humans Needed a Machine: Because Enigma had over 158 million million million settings and reset at midnight every 24 hours, checking by hand would have taken far too long.`,
      task2: `Step 1: German commanders type secret U-boat or army orders into an Enigma machine and send Morse code by radio. Step 2: British wireless Y-stations listen in, write down the scrambled letters, and rush them to Bletchley Park. Step 3: Mathematicians and Wrens run Bombe machines in wooden huts to find that day's Enigma key. Step 4: Decoded "Ultra" intelligence helps the Royal Navy steer food convoys safely past U-boats.`,
      task3: `1) Inside Enigma: Pressing a letter key sent electricity through spinning numbered rotors and front plugboard wires so a completely different letter lit up on the lampboard. 2) Official Secrets Act: All 10,000 staff promised total silence—even to their own families—so Germany never suspected its code was broken.`,
      task4: `Perspective 1 (Alan Turing in Hut 8): Focused on solving logical puzzles under huge time pressure before midnight resets, designing machines to help save sailors at sea. Perspective 2 (Young Wren Operating a Bombe): Working 8-hour shifts beside clattering hot metal drums, unable to tell her parents why her "typing job" is so important.`,
      task5_wagoll: `Secret codebreakers at Bletchley Park helped shorten the Second World War by cracking Germany's Enigma cipher and protecting Allied ships and soldiers. Every midnight, German operators reset their Enigma machines across millions of millions of possible combinations, making them impossible to solve quickly by hand. Mathematicians Alan Turing and Gordon Welchman designed the spinning Bombe machine to hunt down the right daily settings, while thousands of women—who made up three-quarters of Bletchley's 10,000 staff—ran the machines and logged secret messages. Because everyone obeyed the Official Secrets Act, Allied leaders could steer Atlantic food convoys safely away from U-boat wolf packs.`,
    },
  },

  lesson_10: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Home Front: VE Day, Rebuilding & Remembrance, 1945).`,
    safeguardingNote: `<strong>Bereavement &amp; Service-Family Sensitivity Note (Enquiry 10):</strong> Handle discussions of wartime bereavement ("empty chairs at the street party") gently and pastorally, particularly if any pupils in the class have experienced recent family bereavement or have close relatives serving in the armed forces today.`,
    timeline: [
      {
        time: '00–10 mins',
        phase: 'Do Now Starter',
        activity:
          '5-question retrieval check recapping Lesson 9 (Bletchley Park, Enigma, Alan Turing’s Bombe, and the Official Secrets Act).',
      },
      {
        time: '10–25 mins',
        phase: 'Archival Photograph Enquiry',
        activity:
          'Project photographs of cheering crowds in Trafalgar Square and children waving Union Flags beside bomb-damaged London streets on 8 May 1945.',
      },
      {
        time: '25–50 mins',
        phase: 'Worksheet Application',
        activity:
          'Pupils complete Task 1 (VE Day Photo Detective), Task 2 (May 1945 Peace Timeline), Task 3 (Street Party & Rebuilding Ledger), and Task 4 (Thinking Heads).',
      },
      {
        time: '50–60 mins',
        phase: 'Plenary & Quiz',
        activity:
          'Pupils write their Task 5 Mission Challenge paragraph explaining why VE Day mixed joy with sorrow and complete the 5-question quiz.',
      },
    ],
    subjectPrimer: `Following Nazi Germany's unconditional surrender on 7 May 1945, Tuesday 8 May 1945 was declared Victory in Europe (VE) Day. At 3:00pm, Prime Minister Winston Churchill broadcast to the nation over BBC radio that the war in Europe was won, and King George VI, Queen Elizabeth, and Princesses Elizabeth and Margaret waved to cheering crowds from Buckingham Palace balcony. Across Britain, blackout curtains came down, bonfires were lit, and neighbours carried kitchen tables into streets still scarred by bomb rubble, pooling saved sugar and jam coupons to give children street parties. Yet feelings were deeply mixed: over 450,000 British service personnel and civilians had died, rationing continued until 1954, millions of homes needed rebuilding, and fighting against Japan in Asia and the Pacific continued until VJ Day on 15 August 1945.`,
    misconceptions: [
      {
        misconception: `Pupils assume VE Day on 8 May 1945 ended all fighting everywhere in the world—and ended rationing straight away.`,
        correction: `Clarify two key facts: first, fighting in the Pacific continued for three more months until VJ Day (15 August 1945); second, food rationing in Britain did not fully end until July 1954!`,
      },
      {
        misconception: `Pupils think everyone on VE Day felt pure excitement with no sadness.`,
        correction: `Help pupils empathise with bereaved families whose fathers, brothers, sons, daughters, or neighbours had died, and servicemen still fighting far away in Asia.`,
      },
    ],
    hingeQuestion: `Why did so many British adults describe VE Day on 8 May 1945 as a day of "laughter through tears"?`,
    hingeGuidance: `Look for pupils balancing both emotions: huge relief that nightly air raids and blackouts in Europe were finally over, alongside grief for empty chairs at family tables, bombed homes, and troops still fighting in the Pacific.`,
    answers: {
      task1: `1) VE Day Photographs: Show huge cheering crowds packed beneath Nelson's Column in Trafalgar Square and young girls waving Union Flags on piles of bomb rubble, alongside trestle-table street parties. 2) Contrast in the Photos: Joyful flags and smiling children sit right beside bombed bricks, showing how communities celebrated peace even amid heavy war damage.`,
      task2: `Step 1: Germany signs unconditional surrender (7 May 1945). Step 2: Winston Churchill announces Victory in Europe at 3:00pm on Tuesday 8 May 1945 (VE Day); crowds cheer outside Buckingham Palace. Step 3: War in Asia and the Pacific ends three months later on VJ Day (15 August 1945). Step 4: Britain rebuilds bombed towns, launches the NHS in 1948, and finally ends food rationing in 1954.`,
      task3: `1) Street Party Sharing: Neighbours pooled saved margarine, flour, jam, and sugar coupons to make paste sandwiches, scones, and homemade red-white-and-blue bunting. 2) Why Remembrance Matters: Honouring soldiers, sailors, pilots, Commonwealth volunteers, and Home Front civilians on Remembrance Sunday ensures we value peace.`,
      task4: `Perspective 1 (Young Child at a VE Day Street Party): Thrilled to stay up late with bright streetlamps switched back on, wearing a paper crown and eating jam sandwiches without fearing sirens. Perspective 2 (Mother Whose Husband Died Overseas): Smiling bravely for the children's party while quietly grieving for a loved one who will never walk home.`,
      task5_wagoll: `VE Day on 8 May 1945 was a day of both joyful celebration and quiet sadness across Britain. When Prime Minister Winston Churchill announced at 3:00pm that the war in Europe was over, crowds cheered in Trafalgar Square and outside Buckingham Palace, tore down blackout curtains, and laid long tables in the street using shared ration coupons to make sandwiches and cakes for children. However, many families also felt deep sorrow for the 450,000 British soldiers and civilians who had died, for bombed homes, and for troops still fighting in the Pacific until VJ Day in August 1945.`,
    },
  },

  lesson_11: {
    curriculumLinks: `A study of an aspect or theme in British history that extends pupils’ chronological knowledge beyond 1066 (World War II & The Holocaust: The Windermere Children & Post-War Healing, August 1945).`,
    safeguardingNote: `<strong>HET Primary Safeguarding &amp; Trauma-Informed Practice (Enquiry 11):</strong> Focus on post-war sanctuary, patient care, friendship, and recovery at Calgarth Estate by Lake Windermere. <strong>Never</strong> ask pupils to imagine or describe camp conditions, and <strong>never</strong> show liberation/atrocity photographs. Explain details such as hiding bread under pillows gently as evidence of why patient kindness mattered.`,
    timeline: [
      {
        time: '00–10 mins',
        phase: 'Do Now Starter',
        activity:
          '5-question retrieval check bridging Kindertransport (1938–39) and VE Day (May 1945) to set up August 1945.',
      },
      {
        time: '10–25 mins',
        phase: 'Archival & Literary Enquiry',
        activity:
          "Explore photographs of the Calgarth Estate by Lake Windermere and Tom Palmer's novel After the War, discussing how historical fiction uses real survivor memories.",
      },
      {
        time: '25–50 mins',
        phase: 'Worksheet Application',
        activity:
          'Pupils complete Task 1 (Archive & Novel Detective), Task 2 (Prague to Windermere Timeline), Task 3 (Calgarth Sanctuary & Recovery), and Task 4 (Thinking Heads).',
      },
      {
        time: '50–60 mins',
        phase: 'Plenary & Unit Synthesis',
        activity:
          'Pupils write their Task 5 Mission Challenge paragraph on how kindness helped the Windermere Children heal and complete the final 5-question quiz.',
      },
    ],
    subjectPrimer: `In August 1945—three months after VE Day—the British government permitted the Central British Fund for German Jewry (led by Leonard Montefiore) to bring child survivors of Nazi camps to Britain. Ten converted RAF Short Stirling heavy bombers flew the first 300 orphaned teenagers and children (such as Arek Hersh, Ben Helfgott, and Salek Falinower) from Prague to Crosby-on-Eden airfield near Carlisle. From there, coaches drove them to wooden wartime huts on the Calgarth Estate beside Lake Windermere in the Lake District. Under caring staff including Dr Oscar Friedman and art therapist Marie Paneth, the children received nourishing meals, clean beds, English lessons, art, football, swimming, and donated bicycles. Having lost most of their families, they formed a lifelong family of friends known as the '45 Aid Society. Author Tom Palmer worked closely with survivors and the Lake District Holocaust Project to write his children's novel After the War.`,
    misconceptions: [
      {
        misconception: `Pupils confuse the Windermere Children (August 1945) with Kindertransport refugees (1938–1939).`,
        correction: `Use the timeline clearly: Kindertransport children escaped to Britain BEFORE war broke out in 1938–39; the Windermere Children had been trapped inside Nazi-occupied Europe throughout the war, survived ghettos and camps, and arrived in August 1945 AFTER victory in Europe.`,
      },
      {
        misconception: `Pupils think that once the war ended, camp survivors felt completely safe straight away.`,
        correction: `Explain gently why many children hid crusts of bread under their pillows at night—years of terrible hunger meant it took patient, gentle reassurance from staff before they trusted that breakfast would always be there tomorrow.`,
      },
    ],
    hingeQuestion: `Why did caring staff at Calgarth Estate let the children keep bread under their pillows instead of telling them off?`,
    hingeGuidance: `Look for empathetic understanding: staff recognised that hiding bread came from years of starvation and fear, so showing patience and plenty of food each morning helped the children trust adults and feel safe again.`,
    answers: {
      task1: `1) Clues in Source B (IWM CH 15903 Arrival Photograph): Older boys smile down from the doorway of the converted RAF Short Stirling holding their small suitcase while a gentle British helper lifts the youngest child safely down the ladder onto British soil, showing relief, protection, and a fresh start (later shared with schools and authors by The '45 Aid Society). 2) Bread Under Pillows: Years of starvation in Nazi camps made children fear food would vanish overnight; gentle Calgarth staff never scolded them so they could rebuild trust at their own pace.`,
      task2: `Step 1: Camps are liberated in 1945 and Leonard Montefiore's charity arranges homes in Britain for child survivors. Step 2: August 1945 — 10 RAF Short Stirling bombers fly 300 children from Prague to Carlisle. Step 3: Children stay at the Calgarth Estate by Lake Windermere with clean beds, English classes, art, swimming, and bicycles. Step 4: Survivors stay lifelong friends and form the '45 Aid Society.`,
      task3: `1) Healing at Calgarth Estate: Peaceful mountains and lake water, three hot meals a day, football matches, painting with Marie Paneth, and freedom on bicycles. 2) Giving Back: Many survivors built remarkable lives in Britain—for example, Ben Helfgott captained Britain's Olympic weightlifting team and survivors visited schools for decades to teach kindness and tolerance.`,
      task4: `Perspective 1 (Young Survivor Arriving at Windermere): Amazed to sleep in white sheets with no guards outside, quietly tucking bread under the pillow at first before feeling free riding a bicycle beside the lake. Perspective 2 (Calgarth Care Worker / Marie Paneth): Listening patiently without rushing the children, using art, sport, and kindness to help them smile and trust again.`,
      task5_wagoll: `In August 1945, 300 orphaned child survivors began to rebuild their lives by Lake Windermere thanks to patient kindness and their own courage. Flown from Prague to Carlisle inside 10 RAF Short Stirling bombers, the children arrived at the Calgarth Estate exhausted and afraid, even hiding bread under their pillows in case food ran out. Instead of scolding them, caring helpers like Dr Oscar Friedman and Marie Paneth gave them hot meals, art lessons, English classes, football, and bicycles by the peaceful lake. Although most had lost their families during the war, the Windermere Children supported each other for life through the '45 Aid Society.`,
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
export function openKs2WorksheetModal(lessonId, lessonIndex) {
  const cfg = getActiveKs2UnitConfig();
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
              <span id="activeDocModeLabel" style="font-size: 0.72rem; font-weight: 600; color: #94a3b8;">Lesson ${currentSheet.num} of ${Object.keys(activeWsMap).length}</span>
            </div>
            <h2 id="activeDocTitle" style="margin: 3px 0 0 0; font-size: 1.15rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">${currentSheet.title}</h2>
          </div>
        </div>

        <!-- Center: Quick View Toggle (This Lesson vs Full Master Workbook) -->
        <div style="background: #0f172a; padding: 3px; border-radius: 8px; border: 1px solid #334155; display: flex; gap: 2px;">
          <button id="toggleSingleWorksheet" class="active-doc-toggle" style="background: #2563eb; color: #ffffff; border: none; padding: 6px 14px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;">
            <i class="fa-solid fa-file-lines"></i>
            <span>This Lesson Worksheet</span>
          </button>
          <button id="toggleMasterWorkbook" class="inactive-doc-toggle" style="background: transparent; color: #94a3b8; border: none; padding: 6px 14px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;">
            <i class="fa-solid fa-book-bookmark" style="color: #f59e0b;"></i>
            <span>Full ${cfg.workbookPagesLabel} Pupil Workbook</span>
          </button>
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
  };

  const setMasterView = () => {
    isViewingMaster = true;
    iframe.src = fullWorkbookUrl;
    titleEl.textContent = `${cfg.workbookPagesLabel} Master Pupil Workbook`;
    modeLabel.textContent = `Complete ${cfg.totalLessons}-Enquiry Course Companion`;
    downloadLink.href = fullWorkbookPdf;
    lessonSelect.style.display = 'none';

    masterBtn.style.background = '#f59e0b';
    masterBtn.style.color = '#0f172a';
    singleBtn.style.background = 'transparent';
    singleBtn.style.color = '#94a3b8';
  };

  singleBtn.onclick = () => setSingleView(lessonSelect.value);
  masterBtn.onclick = () => setMasterView();

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
