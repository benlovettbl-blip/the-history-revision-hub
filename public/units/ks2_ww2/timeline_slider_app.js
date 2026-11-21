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
      'Eleven boys from a Jewish youth football team posing proudly in striped team shirts before Nazi laws banned them from public sports pitches (c. 1935).',
    provenance: 'United States Holocaust Memorial Museum / Pre-War Family Archive',
    refTextbook: 'p. 6 • Enquiry 3',
    textbookUrl: '/units/ks2_ww2/textbook.html#page-6',
    worksheetUrl: '/units/ks2_ww2/worksheets/lesson_03_prewar_life_worksheet.html',
    badgeColor: '#7c3aed',
    story:
      'Before 1933, Jewish families across Germany, Austria, and Czechoslovakia lived ordinary, settled lives as doctors, shopkeepers, musicians, and schoolchildren. Between 1933 and 1938, Adolf Hitler’s Nazi government passed hundreds of unfair laws taking away their rights step by step.',
    significance:
      'The 1935 Nuremberg Laws stripped Jewish people of citizenship. On 9–10 November 1938 (Kristallnacht), synagogues and Jewish shops were attacked, and days later Jewish children were banned from state schools.',
    childrenLife:
      'Children who had played in local football teams and studied beside friends suddenly saw "Jews are not served here" signs outside shops, swimming pools, and parks, and were shut out of their own classrooms.',
    quote:
      '“One morning our teacher told us we could no longer sit with our friends. Overnight, our school gate was closed to us.” — Pre-War School Pupil Memory',
    detectiveQuestion:
      'In which month and year were Jewish children officially banned from attending German state schools?',
    detectiveAnswer:
      'November 1938 (15 November 1938), just days after the violent Kristallnacht attacks across Germany and Austria.',
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
    textbookUrl: '/units/ks2_ww2/textbook.html#page-7',
    worksheetUrl: '/units/ks2_ww2/worksheets/lesson_04_kindertransport_worksheet.html',
    badgeColor: '#b45309',
    story:
      'Shocked by Kristallnacht in November 1938, the British Parliament agreed to waive visa delays for unaccompanied refugee children under seventeen, provided British sponsors guaranteed £50 per child. Parents were not allowed to travel with them.',
    significance:
      'Nearly 10,000 mostly Jewish children travelled by train across Europe to the Hook of Holland, sailed by ferry to Harwich, and took steam trains into London Liverpool Street Station before war closed the borders.',
    childrenLife:
      'Nine-year-old Vera Löwyová (later Vera Schaufeld) waved goodbye to her parents in Prague in May 1939 carrying just one small suitcase, her English porcelain doll, and a little autograph diary signed by her mother and father.',
    quote:
      '“I remember my mother holding my hand at Prague station. She told me to be brave and learn English quickly.” — Vera Schaufeld (née Löwyová), age 9',
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
    textbookUrl: '/units/ks2_ww2/textbook.html#page-8',
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
    textbookUrl: '/units/ks2_ww2/textbook.html#page-5',
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
    provenance: 'Imperial War Museum Photographic Archive',
    refTextbook: 'p. 4 • Enquiry 1',
    textbookUrl: '/units/ks2_ww2/textbook.html#page-4',
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
    textbookUrl: '/units/ks2_ww2/textbook.html#page-10',
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
      'British women factory workers cutting shiny aluminium-coated "Window" foil strips dropped by Royal Air Force crews to confuse enemy radar.',
    provenance: 'Imperial War Museum (D 21061)',
    refTextbook: 'p. 9 & p. 11 • Enquiries 6 & 8',
    textbookUrl: '/units/ks2_ww2/textbook.html#page-9',
    worksheetUrl: '/units/ks2_ww2/worksheets/lesson_08_women_at_war_land_army_worksheet.html',
    badgeColor: '#1d4ed8',
    story:
      'In May 1940, Winston Churchill became Prime Minister and "Little Ships" helped rescue 338,000 troops from Dunkirk. That summer, Royal Air Force Spitfire and Hurricane pilots defended the skies over southern England in the Battle of Britain.',
    significance:
      'Backed by WAAF plotters and skilled factory workers across Britain, the Royal Air Force stopped the Luftwaffe winning control of the skies, forcing Hitler to call off plans to invade Britain.',
    childrenLife:
      'Families listened to Churchill’s speeches around wireless radios, and schoolchildren collected old aluminium saucepans to support Britain’s aircraft effort.',
    quote:
      '“Never in the field of human conflict was so much owed by so many to so few.” — Winston Churchill, August 1940',
    detectiveQuestion:
      'Why did the women in this photograph cut thousands of shiny aluminium-coated "Window" foil strips for the Royal Air Force?',
    detectiveAnswer:
      'Dropped in bundles from RAF aircraft, the shiny foil strips reflected radio waves and confused enemy radar screens!',
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
    provenance: 'Imperial War Museum (D 1568)',
    refTextbook: 'p. 9 • Enquiry 6',
    textbookUrl: '/units/ks2_ww2/textbook.html#page-9',
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
      'Wartime campaign poster ("Come and help with the Victory Harvest") calling women and girls to help gather vital farm crops.',
    provenance: 'Wartime Harvest Poster Archive',
    refTextbook: 'p. 11 • Enquiry 8',
    textbookUrl: '/units/ks2_ww2/textbook.html#page-11',
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
      'Wrens operating the spinning drums of a Turing-Welchman Bombe machine to test daily Enigma settings.',
    provenance: 'Bletchley Park / Wartime Archive',
    refTextbook: 'p. 12 • Enquiry 9',
    textbookUrl: '/units/ks2_ww2/textbook.html#page-12',
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
      'Around three-quarters (75% — roughly 7,500 women), operating Bombe machines, listening at wireless stations, and indexing decoded signals.',
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
    textbookUrl: '/units/ks2_ww2/textbook.html#page-13',
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
      'An RAF Transport Command Short Stirling aircraft parked on the tarmac at Prague Airport during the August 1945 airlift bringing 300 orphaned child camp survivors to Carlisle and Lake Windermere.',
    provenance: 'Imperial War Museum (CH 15898)',
    refTextbook: 'p. 14 • Enquiry 11',
    textbookUrl: '/units/ks2_ww2/textbook.html#page-14',
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
      'Crowds gathered in Whitehall, London, for the unveiling of the permanent Cenotaph draped in Union Flags on 11 November 1920—later inscribed with the dates 1939–1945 to honour Second World War sacrifice.',
    provenance: 'Imperial War Museum (Q 31488)',
    refTextbook: 'p. 13 & p. 20 • Enquiry 10',
    textbookUrl: '/units/ks2_ww2/textbook.html#page-20',
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
      'The NHS opened in July 1948, and the very last wartime food rationing (meat) finally ended in July 1954!',
  },
];

export function renderKs2TimelineSlider(container) {
  if (!container) return;

  let activeIndex = 0;
  let activeFilter = 'all';
  let isPlaying = false;
  let playInterval = null;

  function getFilteredMilestones() {
    if (activeFilter === 'all') return KS2_WW2_MILESTONES;
    return KS2_WW2_MILESTONES.filter((m) => m.category === activeFilter);
  }

  function render() {
    const list = getFilteredMilestones();
    if (activeIndex >= list.length) activeIndex = 0;
    const current = list[activeIndex] || KS2_WW2_MILESTONES[0];

    container.innerHTML = `
      <style>
        .ks2-slider-view {
          max-width: 1260px;
          margin: 0 auto;
          padding: 16px 20px 60px 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #0f172a;
        }

        /* Top Hero Banner */
        .ks2-slider-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%);
          border-radius: 14px;
          padding: 22px 26px;
          color: #ffffff;
          box-shadow: 0 10px 25px -5px rgba(30, 58, 138, 0.35);
          margin-bottom: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .ks2-hero-title-wrap h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0 0 6px 0;
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ks2-hero-subtitle {
          font-size: 0.94rem;
          color: #e2e8f0;
          margin: 0;
          line-height: 1.45;
          max-width: 700px;
        }

        .ks2-hero-badge {
          background: rgba(255, 255, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #fde68a;
          display: inline-block;
          margin-bottom: 6px;
        }

        /* Filter Chips Strip */
        .ks2-filter-strip {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 16px;
          align-items: center;
        }

        .ks2-filter-chip {
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          color: #475569;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ks2-filter-chip:hover {
          border-color: #2563eb;
          color: #1e3a8a;
          transform: translateY(-1px);
        }

        .ks2-filter-chip.active {
          background: #1e3a8a;
          border-color: #1e3a8a;
          color: #ffffff;
          box-shadow: 0 3px 8px rgba(30, 58, 138, 0.25);
        }

        /* Chronology Highway Slider Component */
        .ks2-highway-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 18px 22px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
          margin-bottom: 20px;
        }

        .ks2-highway-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .ks2-highway-label {
          font-size: 0.82rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #1e3a8a;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ks2-highway-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ks2-ctrl-btn {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #1e293b;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .ks2-ctrl-btn:hover:not(:disabled) {
          background: #e2e8f0;
          border-color: #94a3b8;
        }

        .ks2-ctrl-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .ks2-ctrl-btn.play-btn {
          background: #2563eb;
          color: #ffffff;
          border-color: #1d4ed8;
        }

        .ks2-ctrl-btn.play-btn:hover {
          background: #1d4ed8;
        }

        /* Range Slider Track */
        .ks2-slider-container {
          position: relative;
          padding: 18px 8px 6px 8px;
        }

        .ks2-range-input {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: #e2e8f0;
          outline: none;
          cursor: pointer;
          margin: 0;
          position: relative;
          z-index: 2;
        }

        .ks2-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #2563eb;
          border: 3.5px solid #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
          cursor: grab;
          transition: transform 0.1s, background-color 0.2s;
        }

        .ks2-range-input::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          background: #1d4ed8;
        }

        /* Stepper Node Points along Highway */
        .ks2-nodes-track {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-top: 12px;
        }

        .ks2-node-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
          user-select: none;
          flex: 1;
        }

        .ks2-node-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #cbd5e1;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          margin-bottom: 6px;
          transition: all 0.2s;
        }

        .ks2-node-item:hover .ks2-node-dot {
          background: #60a5fa;
          transform: scale(1.3);
        }

        .ks2-node-item.active .ks2-node-dot {
          background: #2563eb;
          transform: scale(1.45);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
        }

        .ks2-node-year {
          font-size: 0.72rem;
          font-weight: 700;
          color: #64748b;
          text-align: center;
          white-space: nowrap;
        }

        .ks2-node-item.active .ks2-node-year {
          color: #1e3a8a;
          font-weight: 800;
        }

        /* Milestone Showcase Card */
        .ks2-milestone-card {
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
          display: grid;
          grid-template-columns: 420px 1fr;
          align-items: stretch;
          transition: all 0.25s ease;
        }

        @media (max-width: 960px) {
          .ks2-milestone-card {
            grid-template-columns: 1fr;
          }
        }

        .ks2-card-visual {
          background: #0f172a;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1.5px solid #cbd5e1;
          position: relative;
        }

        .ks2-visual-img-wrap {
          flex: 1;
          min-height: 310px;
          padding: 14px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
          position: relative;
        }

        .ks2-visual-img {
          max-width: 100%;
          max-height: 340px;
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 6px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
          transition: transform 0.35s ease;
        }

        .ks2-visual-img:hover {
          transform: scale(1.02);
        }

        .ks2-visual-caption-box {
          padding: 12px 16px;
          background: #1e293b;
          color: #f1f5f9;
          font-size: 0.8rem;
          line-height: 1.4;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .ks2-provenance-tag {
          font-size: 0.68rem;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* Detail Column */
        .ks2-card-detail {
          padding: 22px 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #fdfbf7;
        }

        .ks2-detail-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .ks2-date-pill {
          background: ${current.badgeColor || '#1e3a8a'};
          color: #ffffff;
          font-size: 0.76rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .ks2-step-counter {
          font-size: 0.76rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .ks2-milestone-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.52rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 10px 0;
          line-height: 1.25;
        }

        .ks2-story-box {
          font-size: 0.94rem;
          line-height: 1.55;
          color: #334155;
          margin-bottom: 14px;
        }

        .ks2-callouts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 14px;
        }

        @media (max-width: 600px) {
          .ks2-callouts-grid {
            grid-template-columns: 1fr;
          }
        }

        .ks2-callout-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-left: 3.5px solid #2563eb;
          border-radius: 6px;
          padding: 10px 12px;
        }

        .ks2-callout-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: #1e3a8a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .ks2-callout-text {
          font-size: 0.83rem;
          line-height: 1.42;
          color: #1e293b;
        }

        .ks2-quote-strip {
          background: #eff6ff;
          border: 1px dashed #bfdbfe;
          border-radius: 6px;
          padding: 9px 14px;
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: 0.88rem;
          color: #1e3a8a;
          line-height: 1.42;
          margin-bottom: 14px;
        }

        /* Detective Challenge Box */
        .ks2-detective-box {
          background: #fefce8;
          border: 1.5px solid #fef08a;
          border-left: 4px solid #ca8a04;
          border-radius: 6px;
          padding: 10px 14px;
          margin-bottom: 16px;
        }

        .ks2-detective-header {
          font-size: 0.74rem;
          font-weight: 800;
          color: #92400e;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .ks2-detective-q {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .ks2-reveal-btn {
          background: #ca8a04;
          color: #ffffff;
          border: none;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 4px;
          cursor: pointer;
        }

        .ks2-detective-a {
          font-size: 0.82rem;
          color: #713f12;
          background: #fffbeb;
          padding: 6px 10px;
          border-radius: 4px;
          margin-top: 6px;
          display: none;
          border: 1px solid #fef08a;
        }

        /* Bottom Action Navigation */
        .ks2-actions-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #cbd5e1;
          padding-top: 12px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .ks2-action-links {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .ks2-link-btn {
          font-size: 0.78rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 6px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s;
        }

        .ks2-link-btn.primary {
          background: #1e3a8a;
          color: #ffffff;
        }

        .ks2-link-btn.primary:hover {
          background: #1e40af;
        }

        .ks2-link-btn.secondary {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
        }

        .ks2-link-btn.secondary:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }
      </style>

      <div class="ks2-slider-view">
        <!-- Top Hero Banner -->
        <div class="ks2-slider-hero">
          <div class="ks2-hero-title-wrap">
            <span class="ks2-hero-badge"><i class="fa-solid fa-flag"></i> Key Stage 2 Historical Timeline</span>
            <h1><i class="fa-solid fa-clock-rotate-left"></i> World War II Chronology Slider (1933–1954)</h1>
            <p class="ks2-hero-subtitle">
              Step through ${KS2_WW2_MILESTONES.length} key turning points of World War II, the British Home Front, and children's lives across Europe. Drag the slider or click any year dot to explore.
            </p>
          </div>
          <div style="display: flex; gap: 8px; flex-shrink: 0;">
            <a href="/units/ks2_ww2/textbook.html" target="_blank" class="btn" style="background: rgba(255,255,255,0.15); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); font-weight: 700; font-size: 0.85rem; padding: 8px 14px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-book-open"></i> 20-Page Master Textbook
            </a>
          </div>
        </div>

        <!-- Filter Chips Strip -->
        <div class="ks2-filter-strip">
          <span style="font-size: 0.76rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin-right: 4px;">Filter Timeline:</span>
          <button class="ks2-filter-chip ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">
            <i class="fa-solid fa-layer-group"></i> All ${KS2_WW2_MILESTONES.length} Milestones
          </button>
          <button class="ks2-filter-chip ${activeFilter === 'children' ? 'active' : ''}" data-filter="children">
            <i class="fa-solid fa-child"></i> Evacuation &amp; Children
          </button>
          <button class="ks2-filter-chip ${activeFilter === 'defence' ? 'active' : ''}" data-filter="defence">
            <i class="fa-solid fa-shield-halved"></i> Air Raids &amp; Defence
          </button>
          <button class="ks2-filter-chip ${activeFilter === 'rationing' ? 'active' : ''}" data-filter="rationing">
            <i class="fa-solid fa-seedling"></i> Daily Life &amp; Rationing
          </button>
          <button class="ks2-filter-chip ${activeFilter === 'victory' ? 'active' : ''}" data-filter="victory">
            <i class="fa-solid fa-trophy"></i> Secret War &amp; Peace
          </button>
        </div>

        <!-- The Chronology Highway Interactive Card -->
        <div class="ks2-highway-card">
          <div class="ks2-highway-header">
            <div class="ks2-highway-label">
              <i class="fa-solid fa-route" style="color: #2563eb;"></i> Chronological Highway (1933–1954)
            </div>
            <div class="ks2-highway-controls">
              <button class="ks2-ctrl-btn" id="ks2-btn-prev" ${activeIndex === 0 ? 'disabled' : ''}>
                <i class="fa-solid fa-arrow-left"></i> Previous
              </button>
              <button class="ks2-ctrl-btn play-btn" id="ks2-btn-play">
                <i class="fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}"></i> ${isPlaying ? 'Pause Tour (Auto 5s)' : 'Classroom Tour'}
              </button>
              <button class="ks2-ctrl-btn" id="ks2-btn-next" ${activeIndex === list.length - 1 ? 'disabled' : ''}>
                Next <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- Slider Range -->
          <div class="ks2-slider-container">
            <input type="range" class="ks2-range-input" id="ks2-range-slider" min="0" max="${list.length - 1}" value="${activeIndex}" step="1" />
            
            <div class="ks2-nodes-track">
              ${list
                .map(
                  (m, idx) => `
                <div class="ks2-node-item ${idx === activeIndex ? 'active' : ''}" data-index="${idx}">
                  <div class="ks2-node-dot"></div>
                  <span class="ks2-node-year">${m.year.split('–')[0]}</span>
                </div>
              `,
                )
                .join('')}
            </div>
          </div>
        </div>

        <!-- Active Milestone Showcase Card -->
        <div class="ks2-milestone-card">
          <!-- Left Column: Archival Plate -->
          <div class="ks2-card-visual">
            <div class="ks2-visual-img-wrap">
              <img class="ks2-visual-img" src="${current.image}" alt="${current.title}" />
            </div>
            <div class="ks2-visual-caption-box">
              ${current.imageCaption}
              <div class="ks2-provenance-tag">
                <i class="fa-solid fa-building-columns"></i> ${current.provenance}
              </div>
            </div>
          </div>

          <!-- Right Column: Interactive Historical Investigation -->
          <div class="ks2-card-detail">
            <div>
              <div class="ks2-detail-top-row">
                <span class="ks2-date-pill">${current.month}</span>
                <span class="ks2-step-counter">Milestone ${activeIndex + 1} of ${list.length} • ${current.refTextbook}</span>
              </div>

              <h2 class="ks2-milestone-title">${current.title}</h2>

              <p class="ks2-story-box">${current.story}</p>

              <div class="ks2-callouts-grid">
                <div class="ks2-callout-card">
                  <div class="ks2-callout-title"><i class="fa-solid fa-lightbulb"></i> Why It Mattered</div>
                  <div class="ks2-callout-text">${current.significance}</div>
                </div>
                <div class="ks2-callout-card" style="border-left-color: #059669;">
                  <div class="ks2-callout-title" style="color: #059669;"><i class="fa-solid fa-children"></i> Life for Children</div>
                  <div class="ks2-callout-text">${current.childrenLife}</div>
                </div>
              </div>

              <div class="ks2-quote-strip">
                <i class="fa-solid fa-quote-left" style="margin-right: 6px; opacity: 0.6;"></i>
                ${current.quote}
              </div>

              <div class="ks2-detective-box">
                <div class="ks2-detective-header">
                  <span><i class="fa-solid fa-magnifying-glass"></i> Quick History Check</span>
                  <button class="ks2-reveal-btn" id="ks2-btn-reveal">Reveal Answer</button>
                </div>
                <div class="ks2-detective-q">${current.detectiveQuestion}</div>
                <div class="ks2-detective-a" id="ks2-detective-answer">
                  <strong>Answer:</strong> ${current.detectiveAnswer}
                </div>
              </div>
            </div>

            <!-- Bottom Action Navigation -->
            <div class="ks2-actions-row">
              <div class="ks2-action-links">
                <a href="${current.textbookUrl || '/units/ks2_ww2/textbook.html'}" target="_blank" class="ks2-link-btn primary">
                  <i class="fa-solid fa-book-open"></i> Master Textbook (${current.refTextbook.split('•')[0].trim()})
                </a>
                <a href="${current.worksheetUrl}" target="_blank" class="ks2-link-btn secondary">
                  <i class="fa-solid fa-file-pen"></i> Open Lesson Worksheet
                </a>
              </div>
              <span style="font-size: 0.74rem; color: #64748b; font-weight: 600;">
                <i class="fa-solid fa-keyboard" style="margin-right: 4px;"></i> Use &larr; &rarr; arrow keys to step through
              </span>
            </div>
          </div>
        </div>
      </div>
    `;

    setupEvents(list);
  }

  function setupEvents(list) {
    const rangeSlider = container.querySelector('#ks2-range-slider');
    if (rangeSlider) {
      rangeSlider.addEventListener('input', (e) => {
        activeIndex = parseInt(e.target.value, 10);
        render();
      });
    }

    container.querySelectorAll('.ks2-node-item').forEach((node) => {
      node.addEventListener('click', () => {
        activeIndex = parseInt(node.getAttribute('data-index'), 10);
        render();
      });
    });

    const btnPrev = container.querySelector('#ks2-btn-prev');
    const btnNext = container.querySelector('#ks2-btn-next');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (activeIndex > 0) {
          activeIndex--;
          render();
        }
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (activeIndex < list.length - 1) {
          activeIndex++;
          render();
        }
      });
    }

    const btnPlay = container.querySelector('#ks2-btn-play');
    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
          playInterval = setInterval(() => {
            const currentList = getFilteredMilestones();
            if (activeIndex < currentList.length - 1) {
              activeIndex++;
            } else {
              activeIndex = 0;
            }
            render();
          }, 6000);
        } else {
          clearInterval(playInterval);
        }
        render();
      });
    }

    container.querySelectorAll('.ks2-filter-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        activeFilter = chip.getAttribute('data-filter');
        activeIndex = 0;
        render();
      });
    });

    const btnReveal = container.querySelector('#ks2-btn-reveal');
    const ansBox = container.querySelector('#ks2-detective-answer');
    if (btnReveal && ansBox) {
      btnReveal.addEventListener('click', () => {
        const isShown = ansBox.style.display === 'block';
        ansBox.style.display = isShown ? 'none' : 'block';
        btnReveal.textContent = isShown ? 'Reveal Answer' : 'Hide Answer';
      });
    }
  }

  const keyHandler = (e) => {
    if (!document.getElementById('ks2-range-slider')) {
      window.removeEventListener('keydown', keyHandler);
      return;
    }
    const list = getFilteredMilestones();
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      if (activeIndex < list.length - 1) {
        activeIndex++;
        render();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      if (activeIndex > 0) {
        activeIndex--;
        render();
      }
    }
  };
  window.addEventListener('keydown', keyHandler);

  render();
}
