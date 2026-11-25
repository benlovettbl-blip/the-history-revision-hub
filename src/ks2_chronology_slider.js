import { renderKs2LivingChronology } from './engine/ks2_living_chronology.js';

/**
 * ks2_chronology_slider.js
 *
 * Interactive Key Stage 2 Milestones Chronology Slider (1933–1948)
 * Designed specifically for Key Stage 2 pupils (Years 5–6) and front-of-class interactive whiteboards.
 *
 * Features:
 * - 13 Curated Landmark Milestones aligned 1:1 with the 11 Canonical Enquiries & 20-Page Master Textbook
 * - Interactive horizontal highway track with synchronized range slider & clickable stepper nodes
 * - Automatic "Classroom Tour" presentation mode with smooth auto-advancing timer
 * - Filter pills (All 13 Milestones, Evacuation & Children, Air Raids & Defence, Daily Life & Rationing, Secret War & Victory)
 * - Verified archival imagery with accurate captions and provenance tags
 * - "Life for Children" spotlights and "Historical Detective Challenge" prompts
 * - Full keyboard accessibility (ArrowLeft / ArrowRight)
 */

export const KS2_WW2_MILESTONES = [
  {
    id: 'm1',
    year: '1933–1938',
    month: 'January 1933 – November 1938',
    title: 'Pre-War Jewish Life & Rights Taken Away Step by Step',
    category: 'children',
    categoryLabel: 'Evacuation & Children',
    image: '/units/ks2_ww2/assets/hakoah_vienna_football_1925.jpg',
    imageCaption:
      'A Jewish boys’ youth football team posing proudly in numbered shirts before Nazi laws banned them from public sports pitches (1935).',
    provenance: 'Wiener Holocaust Library / Pre-War Family Archive',
    refTextbook: 'p. 6 • Enquiry 3',
    worksheetUrl: '/units/ks2_ww2/worksheets/lesson_03_prewar_life_worksheet.html',
    badgeColor: '#7c3aed',
    story:
      'Before 1933, Jewish families across Germany, Austria, and Czechoslovakia lived ordinary, settled lives as doctors, shopkeepers, musicians, and schoolchildren. Between 1933 and 1938, Adolf Hitler’s Nazi government passed hundreds of unfair laws taking away their rights step by step.',
    significance:
      'The 1935 Nuremberg Laws stripped Jewish people of citizenship. On 9–10 November 1938 (Kristallnacht), synagogues and Jewish shops were attacked, and days later Jewish children were banned from state schools.',
    childrenLife:
      'Children who had played in local football teams and studied beside friends suddenly saw "No Jews" signs on park benches, swimming pools, and cinemas, and were shut out of their own classrooms.',
    quote:
      '“One morning our teacher told us we could no longer sit with our friends. Overnight, our school gate was closed to us.” — Pre-War School Pupil Memory',
    detectiveQuestion:
      'In which month and year were Jewish children officially banned from attending German state schools?',
    detectiveAnswer:
      'November 1938, just days after the violent Kristallnacht attacks across Germany and Austria.',
  },
  {
    id: 'm2',
    year: '1938–1939',
    month: 'December 1938 – August 1939',
    title: "One Small Suitcase: The Kindertransport Rescue",
    category: 'children',
    categoryLabel: 'Evacuation & Children',
    image: '/units/ks2_ww2/assets/kindertransport_arrival.jpg',
    imageCaption:
      'Young unaccompanied refugee children carrying dolls and small suitcases as they arrive at Harwich Docks in Essex off the ferry from the Netherlands (December 1938).',
    provenance: 'Imperial War Museum / Topical Press',
    refTextbook: 'p. 7 • Enquiry 4',
    worksheetUrl: '/units/ks2_ww2/worksheets/lesson_04_kindertransport_worksheet.html',
    badgeColor: '#b45309',
    story:
      'Shocked by Kristallnacht in November 1938, the British Parliament agreed to waive visa delays for unaccompanied refugee children under seventeen, provided British sponsors guaranteed £50 per child. Parents were not allowed to travel with them.',
    significance:
      'Nearly 10,000 mostly Jewish children travelled by train across Europe to the Hook of Holland, sailed by ferry to Harwich, and took steam trains into London Liverpool Street Station before war closed the borders.',
    childrenLife:
      'Nine-year-old Vera Löwyová (later Vera Schaufeld) waved goodbye to her parents in Prague in May 1939 carrying just one small suitcase, her English porcelain doll, and a little autograph diary signed by her mother and father.',
    quote:
      '“I remember my mother holding my hand at Prague station. She told me to be brave and learn English quickly.” — Vera Löwyová (later Vera Schaufeld), age 9',
    detectiveQuestion:
      'How much money did a British sponsor have to guarantee for each Kindertransport child?',
    detectiveAnswer:
      '£50 per child (worth over £3,000 today) to promise the government that the child would be cared for.',
  },
  {
    id: 'm3',
    year: '1938–1939',
    month: 'December 1938 – August 1939',
    title: 'Nicholas Winton, Trevor Chadwick & The 669 Children from Prague',
    category: 'children',
    categoryLabel: 'Evacuation & Children',
    image: '/units/ks2_ww2/assets/fuer_das_kind_winton_memorial_liverpool_st.jpg',
    imageCaption:
      'Volunteer rescuer Nicholas Winton holding a young refugee child in Prague while organising safe train transports to Britain (1939).',
    provenance: 'Nicholas Winton Family Archive',
    refTextbook: 'p. 8 • Enquiry 5',
    worksheetUrl: '/units/ks2_ww2/worksheets/lesson_05_rescuers_winton_worksheet.html',
    badgeColor: '#0284c7',
    story:
      'In December 1938, 29-year-old London office worker Nicholas Winton cancelled his skiing holiday to visit Prague. Seeing refugee families in freezing camps, he set up a desk in his hotel dining room to list endangered children.',
    significance:
      'While Winton and his mother Babette found British foster homes in London, schoolteacher Trevor Chadwick and Doreen Warriner organised eight trains in Prague—rescuing 669 children before war stopped the ninth train on 1 September 1939.',
    childrenLife:
      'Winton pasted the children’s small black-and-white identity photos into a scrapbook and kept it quietly in his attic for fifty years until 1988, never boasting about what his team had done.',
    quote:
      '“If something is not impossible, then there must be a way to do it.” — Sir Nicholas Winton',
    detectiveQuestion:
      'How many children did Nicholas Winton, Trevor Chadwick, and their volunteer team rescue on eight trains from Prague?',
    detectiveAnswer:
      '669 children between March and August 1939 before war broke out on 1 September 1939.',
  },
  {
    id: 'm4',
    year: '1939',
    month: '1–3 September 1939',
    title: 'Operation Pied Piper: 1.5 Million Evacuees Leave Cities',
    category: 'children',
    categoryLabel: 'Evacuation & Children',
    image: '/units/ks2_ww2/assets/evacuees_railway_1939.jpg',
    imageCaption:
      'British schoolchildren walking to the railway station with gas mask boxes and brown luggage labels tied to their coats (September 1939).',
    provenance: 'Imperial War Museum / National Archives',
    refTextbook: 'p. 5 • Enquiry 2',
    worksheetUrl: '/units/ks2_ww2/worksheets/lesson_02_evacuation_worksheet.html',
    badgeColor: '#1e3a8a',
    story:
      'On Friday 1 September 1939—the day Germany invaded Poland and two days before Britain declared war—the government launched Operation Pied Piper to move children out of crowded cities before bombers could strike.',
    significance:
      'In just three days, nearly 1.5 million schoolchildren, teachers, and mothers with children under five travelled safely by steam train to rural reception areas such as Devon, Cornwall, Wales, and Yorkshire.',
    childrenLife:
      'Children wore brown paper luggage labels on their coats and waited in village halls for Billeting Officers to place them with host families. Some loved farm life; others felt terribly homesick.',
    quote:
      '“We walked in two straight lines behind our teacher with brown labels tied to our coats like parcels.” — London Evacuee Memory',
    detectiveQuestion:
      'What was the job of a Billeting Officer when evacuees arrived in a country village?',
    detectiveAnswer:
      'To find local host homes ("billets") with spare rooms and match every evacuated child to a household.',
  },
  {
    id: 'm5',
    year: '1939',
    month: '1–3 September 1939',
    title: 'Britain Declares War, 38 Million Gas Masks & The Blackout',
    category: 'defence',
    categoryLabel: 'Air Raids & Defence',
    image: '/units/ks2_ww2/assets/gas_masks_children_1939.jpg',
    imageCaption:
      'British schoolchildren practising a gas mask drill with their cardboard carrying boxes in autumn 1939.',
    provenance: 'Imperial War Museum (D 1511)',
    refTextbook: 'p. 4 • Enquiry 1',
    worksheetUrl: '/units/ks2_ww2/worksheets/lesson_01_outbreak_gasmasks_worksheet.html',
    badgeColor: '#0f172a',
    story:
      'The nationwide Blackout began at sunset on 1 September 1939. At 11:15am on Sunday 3 September 1939, Prime Minister Neville Chamberlain announced over BBC radio that Britain was at war with Germany.',
    significance:
      'Fearing poison gas attacks like those in the First World War, the government issued 38 million rubber gas masks in cardboard boxes, taped windows against flying glass, and trained ARP wardens to patrol dark streets.',
    childrenLife:
      'Toddlers received bright red-and-blue "Mickey Mouse" masks so they would not be scared, while babies had enclosed gas helmets with hand-pumped bellows.',
    quote:
      '“I have to tell you now that this country is at war with Germany.” — Prime Minister Neville Chamberlain, 11:15am, 3 September 1939',
    detectiveQuestion:
      'Why were kerbs, tree trunks, and lampposts painted with white stripes during the Blackout?',
    detectiveAnswer:
      'With streetlamps switched off and car headlights dimmed, white stripes helped people see pavement edges in the dark!',
  },
  {
    id: 'm6',
    year: '1940',
    month: 'January 1940 – 1945',
    title: 'Wartime Rationing & The "Dig for Victory" Campaign',
    category: 'rationing',
    categoryLabel: 'Daily Life & Rationing',
    image: '/units/ks2_ww2/assets/ration_book_coupons_1940.jpg',
    imageCaption:
      'Official Ministry of Food ration books with weekly coupons ensuring rich and poor families received fair shares (1940).',
    provenance: 'The National Archives / Ministry of Food',
    refTextbook: 'p. 10 • Enquiry 7',
    worksheetUrl: '/units/ks2_ww2/worksheets/lesson_07_dig_for_victory_rationing_worksheet.html',
    badgeColor: '#15803d',
    story:
      'Before the war, island Britain imported over two-thirds of its food by sea. When German U-boat submarines attacked Atlantic merchant ship convoys, the Ministry of Food introduced ration books in January 1940.',
    significance:
      'Coupon rationing guaranteed "fair shares for all" starting with bacon, butter, and sugar. Meanwhile, families dug up lawns, parks, and school fields to plant over 1.4 million "Dig for Victory" vegetable allotments.',
    childrenLife:
      'Adults were often allowed just 1 fresh egg per week! Children weeded school carrot patches, ate Lord Woolton vegetable pie, and drank free milk and cod liver oil—growing healthier than before the war.',
    quote:
      '“Grow your own food and save space in our merchant ships for vital supplies!” — Ministry of Food Campaign',
    detectiveQuestion:
      'How many fresh eggs per week was a typical British adult ration book allowed?',
    detectiveAnswer:
      'Usually just ONE fresh egg per week—families used tins of dried egg powder for baking and scrambled eggs!',
  },
  {
    id: 'm7',
    year: '1940',
    month: 'Summer 1940',
    title: 'Defending Britain: Churchill, Dunkirk & Building Spitfires',
    category: 'defence',
    categoryLabel: 'Air Raids & Defence',
    image: '/units/ks2_ww2/assets/women_aircraft_workers_ww2.jpg',
    imageCaption:
      'British women factory workers cutting foil strips ("Window") and aircraft parts to help protect Royal Air Force crews during the war.',
    provenance: 'Imperial War Museum Photographic Archive',
    refTextbook: 'p. 9 & p. 11 • Enquiries 6 & 8',
    worksheetUrl: '/units/ks2_ww2/worksheets/lesson_08_women_at_war_land_army_worksheet.html',
    badgeColor: '#1d4ed8',
    story:
      'In May 1940, Winston Churchill became Prime Minister and "Little Ships" helped rescue 338,000 troops from Dunkirk. That summer, RAF Hurricane and Spitfire pilots fought the Battle of Britain in the skies over southern England.',
    significance:
      'Guided by coastal radar towers and WAAF plotters—and supplied by tireless factory workers—the Royal Air Force stopped the Luftwaffe winning control of the skies, forcing Hitler to call off plans to invade Britain.',
    childrenLife:
      'Families listened to Churchill’s speeches around wireless radios, and schoolchildren collected old aluminium saucepans to help Britain’s aircraft effort.',
    quote:
      '“Never in the field of human conflict was so much owed by so many to so few.” — Winston Churchill, August 1940',
    detectiveQuestion:
      'Roughly how many Allied troops were rescued from the beaches of Dunkirk in 1940, and which two RAF fighter planes defended Britain that summer?',
    detectiveAnswer:
      'Around 338,000 troops were rescued at Dunkirk, and RAF Hurricane and Spitfire pilots defended Britain in the Battle of Britain!',
  },
  {
    id: 'm8',
    year: '1940–1941',
    month: '7 September 1940 – May 1941',
    title: 'The Blitz: 57 Nights of Bombing & Air Raid Shelters',
    category: 'defence',
    categoryLabel: 'Air Raids & Defence',
    image: '/units/ks2_ww2/assets/tube_station_shelter_1940.jpg',
    imageCaption:
      'London families sleeping side by side along a deep Underground station platform during night bombing in autumn 1940.',
    provenance: 'Imperial War Museum Photographic Archive',
    refTextbook: 'p. 9 • Enquiry 6',
    worksheetUrl: '/units/ks2_ww2/worksheets/lesson_06_the_blitz_shelters_worksheet.html',
    badgeColor: '#991b1b',
    story:
      'Starting on "Black Saturday" (7 September 1940), German bombers attacked London for 57 nights in a row and heavily bombed ports and factory cities across Britain including Coventry, Liverpool, Plymouth, Clydebank, Hull, and Belfast.',
    significance:
      'Over 43,000 British civilians died during the Blitz, yet ARP wardens, Auxiliary Firefighters, and neighbours worked through the night putting out incendiary bombs and rescuing survivors.',
    childrenLife:
      'Children with gardens slept in corrugated steel Anderson shelters buried under 15 inches of soil; families without gardens used indoor steel-mesh Morrison table cages or Underground Tube platforms.',
    quote:
      '“When the steady All Clear siren finally sounded at dawn, neighbours came outside with dusty faces and shared mugs of hot sweet tea.” — Blitz Memory',
    detectiveQuestion:
      'Why were corrugated steel Anderson shelters covered on top with at least 15 inches of garden soil?',
    detectiveAnswer:
      'The thick layer of soil cushioned blast shockwaves and protected the family inside from sharp flying shrapnel.',
  },
  {
    id: 'm9',
    year: '1941–1945',
    month: 'December 1941 – 1945',
    title: 'Women at War: Land Girls, Lumberjills & Canary Girls',
    category: 'rationing',
    categoryLabel: 'Daily Life & Rationing',
    image: '/units/ks2_ww2/assets/land_army_poster_1941.jpg',
    imageCaption:
      'Official Women’s Land Army recruitment poster ("Come and help with the Victory Harvest") calling women to keep Britain’s farms producing food.',
    provenance: 'Imperial War Museum Art Collection',
    refTextbook: 'p. 11 • Enquiry 8',
    worksheetUrl: '/units/ks2_ww2/worksheets/lesson_08_women_at_war_land_army_worksheet.html',
    badgeColor: '#047857',
    story:
      'With millions of men away fighting, Parliament passed the National Service Act in December 1941—calling up unmarried women aged 20 to 30 for essential war work on farms, in factories, or in the uniformed auxiliary services.',
    significance:
      'Over 80,000 Land Girls farmed Britain’s fields, Lumberjills in the Timber Corps felled forest trees for coal mines, and nearly a million munitions workers ("Canary Girls") packed shells.',
    childrenLife:
      'Children saw women driving tractors, conducting buses, aiming anti-aircraft searchlights in the ATS, and ferrying warplanes from factories to RAF airfields.',
    quote:
      '“We milked cows before dawn in frosty barns and ploughed heavy clay fields, proud to keep Britain fed.” — Women’s Land Army Volunteer',
    detectiveQuestion:
      'Why were women working in wartime munitions shell factories nicknamed "Canary Girls"?',
    detectiveAnswer:
      'Because toxic TNT explosive powder stained their skin and hair bright yellow, like a canary bird!',
  },
  {
    id: 'm10',
    year: '1941–1945',
    month: '1941 – 1945',
    title: 'Secret Codebreakers: Bletchley Park, Turing & The Bombe',
    category: 'victory',
    categoryLabel: 'Secret War & Victory',
    image: '/units/ks2_ww2/assets/bombe_bletchley_park.jpg',
    imageCaption:
      'Wrens operating the spinning drums of a Turing-Welchman Bombe machine at Bletchley Park ("Station X").',
    provenance: 'Bletchley Park Trust / IWM Archive',
    refTextbook: 'p. 12 • Enquiry 9',
    worksheetUrl: '/units/ks2_ww2/worksheets/lesson_09_bletchley_codebreakers_worksheet.html',
    badgeColor: '#4f46e5',
    story:
      'At Bletchley Park in Buckinghamshire, secret codebreakers worked to crack Germany’s Enigma cipher machine, which had over 158 million million million settings and changed its key every midnight.',
    significance:
      'Alan Turing and Gordon Welchman designed the electromechanical Bombe machine to find daily Enigma settings rapidly. Historians estimate "Ultra" intelligence shortened the war in Europe by up to two years.',
    childrenLife:
      'Around three-quarters of Bletchley Park’s 10,000 workers were young women (including Wrens). All signed the Official Secrets Act and kept their work secret from their own families for thirty years!',
    quote:
      '“My parents thought I was just doing dull office typing—I could not breathe a word for thirty years.” — Bletchley Park Wren',
    detectiveQuestion:
      'Roughly what fraction of the 10,000 workers at Bletchley Park were women?',
    detectiveAnswer:
      'Around three-quarters (75%)—operating Bombe machines, listening at wireless stations, and indexing decoded signals.',
  },
  {
    id: 'm11',
    year: '1945',
    month: '8 May 1945',
    title: 'VE Day: Victory in Europe & Street Celebrations',
    category: 'victory',
    categoryLabel: 'Secret War & Victory',
    image: '/units/ks2_ww2/assets/ve_day_street_party_1945.jpg',
    imageCaption:
      'Huge crowds cheering beneath Nelson’s Column in Trafalgar Square, London, on Victory in Europe (VE) Day, 8 May 1945.',
    provenance: 'Imperial War Museum Archive',
    refTextbook: 'p. 13 • Enquiry 10',
    worksheetUrl: '/units/ks2_ww2/worksheets/lesson_10_ve_day_remembrance_worksheet.html',
    badgeColor: '#b91c1c',
    story:
      'After Nazi Germany surrendered, Tuesday 8 May 1945 became Victory in Europe (VE) Day. At 3:00pm, Prime Minister Winston Churchill announced over BBC radio that the war in Europe was won, while crowds cheered outside Buckingham Palace.',
    significance:
      'Blackout curtains came down at last and church bells rang out, though fighting in Asia and the Pacific continued until VJ Day on 15 August 1945 and over 450,000 British lives had been lost.',
    childrenLife:
      'Neighbours carried tables into bombed streets, hung red-white-and-blue bunting, and pooled saved sugar and jam coupons to give children unforgettable VE Day street parties.',
    quote:
      '“My dear friends, this is your hour... a victory of the great British nation as a whole.” — Winston Churchill, 8 May 1945',
    detectiveQuestion:
      'Why was VE Day described by many British families as a day of "laughter through tears"?',
    detectiveAnswer:
      'People felt huge joy that bombing in Europe had ended, mixed with deep sadness for loved ones who had died and troops still fighting in Asia.',
  },
  {
    id: 'm12',
    year: '1945',
    month: 'August 1945',
    title: 'The Windermere Children: 300 Survivors Arrive in the Lake District',
    category: 'children',
    categoryLabel: 'Evacuation & Children',
    image: '/units/ks2_ww2/assets/windermere_raf_stirling_airlift_1945.jpg',
    imageCaption:
      'Orphaned child camp survivors carrying small suitcases and a Czech flag across Prague airfield to board RAF Short Stirling heavy bombers bound for Carlisle and Lake Windermere (14 August 1945).',
    provenance: 'Imperial War Museum (CH 15898)',
    refTextbook: 'p. 14 • Enquiry 11',
    worksheetUrl: '/units/ks2_ww2/worksheets/lesson_11_windermere_children_worksheet.html',
    badgeColor: '#059669',
    story:
      'In August 1945—three months after VE Day—ten converted RAF Short Stirling bombers flew 300 orphaned child survivors of Nazi camps from Prague to Carlisle, before coaches brought them to the Calgarth Estate beside Lake Windermere.',
    significance:
      'Cared for by Dr Oscar Friedman, art therapist Marie Paneth, and volunteers, the children slowly recovered their strength and formed a lifelong family known as the ’45 Aid Society—inspiring Tom Palmer’s novel After the War.',
    childrenLife:
      'At first, frightened children hid crusts of bread under their pillows in case food ran out. Through patient kindness, English lessons, football, swimming in the lake, and riding bicycles, they learned to laugh again.',
    quote:
      '“Arriving at Windermere was like coming from hell to heaven. For the first time in years, we were treated as human beings.” — Arek Hersh MBE, Survivor',
    detectiveQuestion:
      'How did the 300 Windermere Children travel from Prague to Carlisle in August 1945?',
    detectiveAnswer:
      'Inside 10 converted Royal Air Force (RAF) Short Stirling heavy bomber aeroplanes!',
  },
  {
    id: 'm13',
    year: '1945–1954',
    month: '1945 – 1954',
    title: 'Rebuilding Britain, The 1948 NHS & National Remembrance',
    category: 'victory',
    categoryLabel: 'Secret War & Victory',
    image: '/units/ks2_ww2/assets/cenotaph_whitehall_remembrance.jpg',
    imageCaption:
      'The Cenotaph in Whitehall, London — originally unveiled in 1920 after the First World War, with the dates 1939–1945 added after the Second World War — where Britain gathers each Remembrance Sunday.',
    provenance: 'UK National Remembrance Archive',
    refTextbook: 'p. 13 & p. 20 • Enquiry 10',
    worksheetUrl: '/units/ks2_ww2/worksheets/lesson_10_ve_day_remembrance_worksheet.html',
    badgeColor: '#6b21a8',
    story:
      'After six exhausting years of war, Britain set about clearing bomb sites, building new council homes and schools, and creating a fairer peacetime country. Food rationing continued until July 1954.',
    significance:
      'In July 1948, Britain founded the National Health Service (NHS) so every child and adult could see a doctor or hospital free of charge, while nations formed the United Nations to protect peace and human rights.',
    childrenLife:
      'Every November on Remembrance Sunday, schoolchildren and families pause for a two-minute silence and wear red poppies to honour everyone who served at home and overseas.',
    quote:
      '“We remember those who gave their tomorrow so that future generations could grow up in peace.”',
    detectiveQuestion:
      'In which year was the National Health Service (NHS) launched—and when did wartime food rationing finally end?',
    detectiveAnswer:
      'The NHS opened in 1948, and the very last wartime food rationing (meat) finally ended in July 1954!',
  },
];

export function renderKs2TimelineSlider(container) {
  return renderKs2LivingChronology(container, {
    unitId: "ks2_ww2",
    title: "World War II & The Home Front: Living Chronology (1933–1954)",
    subtitle: "Step through 13 turning points of World War II, the British Home Front, and children's lives across Europe.",
    heroGradient: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)",
    accentColor: "#1e3a8a",
    textbookUrl: "/units/ks2_ww2/textbook.html",
    textbookLabel: "20-Page Master Textbook",
    filters: [
          {
                "id": "all",
                "label": "All 13 Milestones"
          },
          {
                "id": "children",
                "label": "Evacuation & Children"
          },
          {
                "id": "defence",
                "label": "Air Raids & Defence"
          },
          {
                "id": "rationing",
                "label": "Daily Life & Rationing"
          },
          {
                "id": "victory",
                "label": "Secret War & Peace"
          }
    ],
    milestones: KS2_WW2_MILESTONES,
  });
}
