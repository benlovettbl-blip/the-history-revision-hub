/**
 * scripts/render_standard_textbook_ks2_ww2.cjs
 *
 * THE HISTORY REVISION HUB — KEY STAGE 2 MASTER CLASSROOM TEXTBOOK COMPILER
 * Unit: World War II & The Home Front (1933–1945) [ks2_ww2]
 *
 * Reprographic Architecture (20-Page A4 / 5 Folded A3 Saddle-Stitch Sheets):
 * - Page 1: Master Front Cover (banner_unit_hero.jpg, plain KS2 labels, 11-Lesson Directory).
 * - Page 2: Inside Front Cover — "Your Journey Through World War II" (11 pupil-friendly blurbs).
 * - Page 3: Master Chronological Turning Points (12 milestones, 1933–1948, zero Ref tags).
 * - Pages 4–14: All 11 Canonical Lessons (1 full page per lesson, Single Wide-Margin Column,
 *               pure verbatim reading narrative from data/ks2_ww2.json, zero worksheet clutter).
 * - Pages 15–16: Facing 2-Page Master Knowledge Retrieval Quiz (55 questions, 5 per lesson,
 *                100% answerable from pp. 4–14, non-consumable oral/partner format, zero answers).
 * - Pages 17–18: Facing 2-Page Master Historical Vocabulary Bank (all 44 key words with syllables
 *                and plain KS2 definitions across Lessons 1–11).
 * - Page 19: Big Picture Connections — Children's Journeys & Wartime Maps.
 * - Page 20: Back Cover — Remembering World War II Today & Rebuilding Peacetime Britain.
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT_DIR = path.resolve(__dirname, '..');

function cleanProse(text) {
  if (!text) return '';
  return String(text)
    .replace(/<span\s+class=["'](?:para-ref|para-pill|archival-meta-tag)["']>[^<]*<\/span>\s*/gi, '')
    .replace(/\[\d+\.\d+[A-Z]?\]\s*/g, '')
    .replace(/\[Key Individual:\s*([^\]]+)\]/gi, '$1')
    .replace(/\s*\((?:<strong>)?(?:Source|Interpretation|Figure)\s+[A-Z0-9]+(?:<\/strong>)?\)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .trim();
}

function loadUnitData() {
  const jsonPath = path.join(ROOT_DIR, 'data', 'ks2_ww2.json');
  return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

const TURNING_POINTS = [
  {
    date: '1933–1938',
    title: 'Anti-Jewish Laws & Kristallnacht in Nazi Germany',
    desc: 'Hitler’s Nazi regime strips Jewish families of citizenship under the 1935 Nuremberg Laws, attacks synagogues on Kristallnacht (Nov 1938), and bans Jewish children from state schools.',
  },
  {
    date: 'Dec 1938–Aug 1939',
    title: 'The Kindertransport & Prague Rescue Trains',
    desc: 'Britain waives visa delays for nearly 10,000 unaccompanied refugee children with £50 sponsor guarantees. Nicholas Winton and Trevor Chadwick rescue 669 children from Prague.',
  },
  {
    date: '1 Sept 1939',
    title: 'Operation Pied Piper & The Total Blackout Begin',
    desc: 'Germany invades Poland. Britain launches Operation Pied Piper, moving 1.5 million children and mothers to the countryside in three days, and switches off streetlamps at sunset.',
  },
  {
    date: '3 Sept 1939',
    title: 'Britain Declares War & 38 Million Gas Masks Issued',
    desc: 'At 11:15am, Prime Minister Neville Chamberlain announces on BBC radio that Britain is at war. Families carry cardboard gas mask boxes everywhere and tape window panes.',
  },
  {
    date: 'Jan 1940',
    title: 'Food Rationing & "Dig for Victory" Allotments',
    desc: 'As U-boats attack Atlantic food ships, the Ministry of Food introduces ration coupon books for fair shares while families turn lawns and parks into 1.4 million vegetable plots.',
  },
  {
    date: 'May–Oct 1940',
    title: 'Churchill, Dunkirk & The Battle of Britain',
    desc: 'Winston Churchill becomes Prime Minister, "Little Ships" help rescue 338,000 troops from Dunkirk, and RAF pilots guided by coastal radar defend Britain’s skies.',
  },
  {
    date: 'Sept 1940–May 1941',
    title: 'The Blitz Across British Cities',
    desc: 'Starting on 7 September 1940, Luftwaffe bombers attack London for 57 nights in a row and strike Coventry, Liverpool, Plymouth, Clydebank, Hull, and Belfast.',
  },
  {
    date: 'Dec 1941',
    title: 'Women Called Up for Vital War Work',
    desc: 'Parliament passes the National Service Act calling up unmarried women aged 20–30. Over 80,000 Land Girls, Timber Corps Lumberjills, and munitions "Canary Girls" keep Britain running.',
  },
  {
    date: '1941–1945',
    title: 'Secret Codebreakers at Bletchley Park',
    desc: 'Alan Turing, Gordon Welchman, and thousands of women (75% of the 10,000 staff) run spinning Bombe machines to break daily German Enigma ciphers in total secrecy.',
  },
  {
    date: '8 May 1945',
    title: 'VE Day: Victory in Europe & Street Parties',
    desc: 'Nazi Germany surrenders unconditionally. Crowds cheer Churchill and the Royal Family, tear down blackout curtains, and share rationed jam at street parties amid grief for the fallen.',
  },
  {
    date: 'Aug 1945',
    title: 'The Windermere Children Arrive in Cumbria',
    desc: 'Ten RAF Short Stirling bombers fly 300 orphaned child camp survivors from Prague to Carlisle; caring staff at Calgarth Estate by Lake Windermere help them heal.',
  },
  {
    date: '1948–1954',
    title: 'Rebuilding Britain, The NHS & Remembrance',
    desc: 'Britain rebuilds bombed neighbourhoods, opens the free National Health Service (NHS) in 1948, ends food rationing in 1954, and honours wartime sacrifice every November.',
  },
];

// 55 Retrieval Questions (5 per lesson, 100% answerable from the verbatim prose on Pages 4–14)
const TEXTBOOK_QUIZ = {
  lesson_1: [
    'On what date did Nazi Germany invade Poland and the British Blackout begin?',
    'At what exact time on Sunday 3 September 1939 did Neville Chamberlain speak on BBC radio?',
    'How many rubber gas masks were handed out to civilians across Britain?',
    'What bright mask was designed so toddlers would not feel frightened during drills?',
    'What did ARP wardens shout if a strip of light showed behind a house curtain?',
  ],
  lesson_2: [
    'What was the codename for evacuating 1.5 million children and mothers from 1 September 1939?',
    'What item was tied to every evacuee child’s coat lapel at the railway station?',
    'Who met evacuees in country village halls and matched them with local host homes?',
    'Name two safe rural reception areas mentioned in Lesson 2 where city children were sent.',
    'Why did many evacuees drift back to cities by Christmas 1939?',
  ],
  lesson_3: [
    'Roughly what fraction of Germany’s population was Jewish when Hitler took power in January 1933?',
    'Which September 1935 laws stripped German Jewish families of their citizenship?',
    'What happened across Germany and Austria on the night of 9–10 November 1938 (Kristallnacht)?',
    'What unfair rule shut Jewish children out of German state schools in November 1938?',
    'Why do historians study pre-war family photographs of sports teams and school life?',
  ],
  lesson_4: [
    'Approximately how many unaccompanied children came to Britain on the Kindertransport?',
    'How much money did a British sponsor have to guarantee for each refugee child?',
    'Why could mothers and fathers not board the Kindertransport trains with their children?',
    'Which Essex port and London station welcomed Kindertransport ferries and trains?',
    'Which two treasured personal items did nine-year-old Vera Löwyová (Vera Schaufeld) pack in Prague?',
  ],
  lesson_5: [
    'What holiday did 29-year-old Nicholas Winton cancel in December 1938 to visit Prague?',
    'Which British schoolteacher stayed in Prague putting children safely onto rescue trains?',
    'How many children escaped from Prague on eight trains between March and August 1939?',
    'Why was the ninth train from Prague stopped on 1 September 1939?',
    'Where did Nicholas Winton’s wife Grete find his rescue scrapbook fifty years later in 1988?',
  ],
  lesson_6: [
    'On what date ("Black Saturday") did the Blitz begin, and for how many nights in a row was London bombed?',
    'Name three British cities outside London that were heavily bombed during the Blitz.',
    'How many inches of garden soil were piled on top of a corrugated steel Anderson shelter?',
    'What indoor steel-mesh table shelter was introduced in 1941 for homes without gardens?',
    'Where did up to 177,000 Londoners sleep on peak nights of bombing?',
  ],
  lesson_7: [
    'What fraction of its food did Britain import by sea before the Second World War?',
    'Which three foods were the first to be rationed in January 1940?',
    'How many fresh eggs per week was a typical adult ration book allowed?',
    'How many wartime vegetable allotments were planted across Britain by 1943?',
    'What vegetable pie was named after the Minister of Food, Lord Woolton?',
  ],
  lesson_8: [
    'Which December 1941 law called up unmarried British women aged 20 to 30 for war work?',
    'Why were women packing explosive shells in munitions factories nicknamed "Canary Girls"?',
    'Over how many women worked on farms in the Women’s Land Army by 1944?',
    'What nickname was given to women in the Women’s Timber Corps who felled forest trees?',
    'Name two wartime jobs performed by uniformed women in the ATS or WAAF.',
  ],
  lesson_9: [
    'What was the name of Britain’s top-secret codebreaking estate in Buckinghamshire?',
    'Why was the German Enigma cipher machine impossible to solve quickly by hand?',
    'Which two mathematicians designed the spinning-drum Bombe machine at Bletchley Park?',
    'Roughly what fraction of the 10,000 workers at Bletchley Park were women?',
    'Which law required Bletchley Park workers to keep silent for thirty years after the war?',
  ],
  lesson_10: [
    'On what exact date did Britain celebrate Victory in Europe (VE) Day?',
    'Who announced on BBC radio at 3:00pm on VE Day that the war in Europe was won?',
    'Why did fighting continue in Asia and the Pacific until VJ Day on 15 August 1945?',
    'Which free healthcare service was launched in Britain in July 1948?',
    'In which year did the very last wartime food rationing finally end in Britain?',
  ],
  lesson_11: [
    'How many orphaned child camp survivors were flown from Prague to Carlisle in August 1945?',
    'Which type of Royal Air Force bomber carried the children to Britain?',
    'What was the name of the housing estate beside Lake Windermere where the children stayed?',
    'Why did many of the children hide crusts of bread under their pillows at first?',
    'What lifelong group did the Windermere survivors form, and which Tom Palmer novel tells their story?',
  ],
};

function buildHtml() {
  const unitData = loadUnitData();
  const lessons = unitData.lessons; // All 11 canonical lessons

  const journeyTop10 = lessons.slice(0, 10);
  const journeyL11 = lessons[10];

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <title>Key Stage 2 History: World War II &amp; The Home Front (1933–1945) — 20-Page Master Classroom Textbook</title>
  <link rel="icon" href="data:,">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400;1,600&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Lora', Georgia, serif;
      background: #cbd5e1;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }

    .screen-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #0f172a;
      color: #f8fafc;
      padding: 8px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Inter', sans-serif;
      font-size: 9pt;
      border-bottom: 2px solid #f59e0b;
    }
    .screen-toolbar a, .screen-toolbar button {
      background: #1e3a8a;
      color: #ffffff;
      border: 1px solid #3b82f6;
      padding: 5px 12px;
      border-radius: 5px;
      text-decoration: none;
      font-weight: 700;
      font-size: 8.5pt;
      cursor: pointer;
      margin-left: 6px;
    }
    .screen-toolbar button.gold {
      background: #f59e0b;
      color: #0f172a;
      border-color: #f59e0b;
    }

    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      position: relative;
      background: #ffffff;
      margin: 8mm auto;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10mm 14mm 9mm 14mm;
      box-shadow: 0 6px 18px rgba(15, 23, 42, 0.16);
      page-break-after: always;
      break-after: page;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    @media print {
      body { background: #ffffff; }
      .screen-toolbar { display: none !important; }
      .page {
        margin: 0;
        box-shadow: none;
      }
    }

    /* RUNNING HEADERS & FOOTERS */
    .running-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 2.5px;
      margin-bottom: 5px;
      font-family: 'Inter', sans-serif;
      font-size: 7.2pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: #475569;
      flex-shrink: 0;
    }

    .running-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 3px;
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Inter', sans-serif;
      font-size: 7.2pt;
      color: #64748b;
      flex-shrink: 0;
    }

    .running-footer .page-pill {
      background: #1e3a8a;
      color: #ffffff;
      padding: 1.5px 8px;
      border-radius: 3px;
      font-weight: 800;
      font-size: 7.2pt;
    }

    /* PAGE 1: FRONT COVER */
    .cover-masthead {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 3px;
      margin-bottom: 4px;
      font-family: 'Inter', sans-serif;
      font-size: 7.5pt;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #0f172a;
      text-transform: uppercase;
    }
    .cover-date-pill {
      background: #1e3a8a;
      color: #ffffff;
      padding: 2px 8px;
      border-radius: 3px;
      font-weight: 800;
      font-size: 7.5pt;
    }
    .cover-title-block {
      text-align: center;
      margin-bottom: 4px;
    }
    .cover-main-title {
      font-family: 'Cinzel', serif;
      font-size: 20pt;
      font-weight: 900;
      letter-spacing: 0.03em;
      color: #0f172a;
      line-height: 1.1;
      margin: 0;
    }
    .cover-subtitle {
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      font-size: 9.2pt;
      color: #334155;
      margin-top: 2px;
    }
    .cover-enquiry-banner {
      background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
      border: 1.5px solid #3b82f6;
      border-radius: 4px;
      padding: 5px 12px;
      margin-bottom: 3mm;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .cover-enquiry-badge {
      background: #f59e0b;
      color: #0f172a;
      font-family: 'Inter', sans-serif;
      font-size: 7.4pt;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 2.5px 8px;
      border-radius: 3px;
      white-space: nowrap;
    }
    .cover-enquiry-text {
      font-family: 'Lora', Georgia, serif;
      font-size: 10pt;
      font-weight: 700;
      font-style: italic;
      color: #ffffff;
      line-height: 1.25;
    }
    .cover-hero-wrap {
      width: 100%;
      height: 62mm;
      border: 1.5px solid #0f172a;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 1.5mm;
      background: #0f172a;
    }
    .cover-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      display: block;
    }
    .cover-hero-caption {
      font-family: 'Inter', sans-serif;
      font-size: 7.1pt;
      line-height: 1.25;
      color: #475569;
      font-style: italic;
      text-align: center;
      margin-bottom: 2.5mm;
    }
    .cover-overview-box {
      background: #fdfbf7;
      border: 1.5px solid #e2d9cc;
      border-left: 4px solid #1e3a8a;
      border-radius: 4px;
      padding: 7px 11px;
      margin-bottom: 2.5mm;
    }
    .cover-overview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2d9cc;
      padding-bottom: 2px;
      margin-bottom: 4px;
      font-family: 'Inter', sans-serif;
      font-size: 7.4pt;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #1e3a8a;
    }
    .cover-overview-text {
      font-family: 'Lora', Georgia, serif;
      font-size: 9.4pt;
      line-height: 1.38;
      color: #1e293b;
      margin: 0;
    }
    .cover-directory {
      border: 1.5px solid #0f172a;
      border-radius: 4px;
      overflow: hidden;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .cover-directory-head {
      background: #0f172a;
      color: #ffffff;
      padding: 4px 9px;
      font-family: 'Inter', sans-serif;
      font-size: 7.3pt;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
    }
    .cover-directory-table {
      width: 100%;
      border-collapse: collapse;
      font-family: 'Inter', sans-serif;
      font-size: 7.4pt;
      background: #ffffff;
      flex: 1;
    }
    .cover-directory-table tr {
      border-bottom: 0.5px solid #e2e8f0;
    }
    .cover-directory-table tr:last-child { border-bottom: none; }
    .cover-directory-table td {
      padding: 3.2px 7px;
      vertical-align: middle;
    }
    .col-num { width: 56px; font-weight: 800; color: #1e3a8a; white-space: nowrap; }
    .col-title { font-weight: 700; color: #0f172a; width: 39%; line-height: 1.18; }
    .col-eq { font-family: 'Lora', Georgia, serif; font-style: italic; color: #475569; font-size: 7.3pt; line-height: 1.18; }
    .col-page { width: 48px; text-align: right; font-weight: 800; color: #1e3a8a; white-space: nowrap; }

    /* PAGE 2: LEARNING JOURNEY */
    .section-page-header {
      text-align: center;
      margin-bottom: 5px;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 3px;
      flex-shrink: 0;
    }
    .section-page-title {
      font-family: 'Cinzel', serif;
      font-size: 13.5pt;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: #0f172a;
      margin: 0;
    }
    .section-page-subtitle {
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      font-size: 8.4pt;
      color: #475569;
      margin-top: 1.5px;
    }
    .journey-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px 8px;
      flex: 1;
    }
    .journey-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 3.5px solid #1e3a8a;
      border-radius: 3px;
      padding: 5.5px 9px;
      display: flex;
      flex-direction: column;
      gap: 2.5px;
    }
    .journey-card.span-two {
      grid-column: 1 / -1;
      border-left-color: #059669;
      background: #f0fdf4;
    }
    .journey-card-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 0.5px solid #e2e8f0;
      padding-bottom: 1.5px;
    }
    .journey-card-title {
      font-family: 'Inter', sans-serif;
      font-size: 8.2pt;
      font-weight: 800;
      color: #0f172a;
    }
    .journey-card-page {
      font-family: 'Inter', sans-serif;
      font-size: 7.2pt;
      font-weight: 800;
      color: #1e3a8a;
      background: #eff6ff;
      padding: 0.5px 5px;
      border-radius: 2px;
      white-space: nowrap;
    }
    .journey-card-question {
      font-family: 'Lora', Georgia, serif;
      font-size: 7.6pt;
      font-style: italic;
      font-weight: 700;
      color: #1e3a8a;
      line-height: 1.22;
    }
    .journey-card-desc {
      font-family: 'Lora', Georgia, serif;
      font-size: 7.8pt;
      line-height: 1.28;
      color: #334155;
      margin: 0;
    }

    /* PAGE 3: CHRONOLOGICAL TURNING POINTS */
    .milestone-timeline {
      display: flex;
      flex-direction: column;
      position: relative;
      flex: 1;
      justify-content: space-between;
      gap: 3px;
    }
    .milestone-timeline::before {
      content: '';
      position: absolute;
      top: 6px;
      bottom: 6px;
      left: 86px;
      width: 2px;
      background: #cbd5e1;
      z-index: 1;
    }
    .milestone-row {
      display: flex;
      align-items: flex-start;
      position: relative;
      z-index: 2;
    }
    .milestone-date-box {
      width: 80px;
      text-align: right;
      padding-right: 8px;
      font-family: 'Inter', sans-serif;
      font-size: 7.2pt;
      font-weight: 800;
      color: #1e3a8a;
      padding-top: 3px;
      flex-shrink: 0;
    }
    .milestone-node {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #1e3a8a;
      border: 2px solid #ffffff;
      box-shadow: 0 0 0 1.5px #1e3a8a;
      margin-top: 4px;
      margin-right: 8px;
      flex-shrink: 0;
    }
    .milestone-content {
      flex: 1;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 3px solid #1e3a8a;
      border-radius: 3px;
      padding: 3.5px 8px;
    }
    .milestone-title {
      font-family: 'Inter', sans-serif;
      font-size: 8pt;
      font-weight: 800;
      color: #0f172a;
      display: block;
      margin-bottom: 1px;
    }
    .milestone-desc {
      font-family: 'Lora', Georgia, serif;
      font-size: 7.7pt;
      line-height: 1.28;
      color: #334155;
      margin: 0;
    }

    /* PAGES 4–14: ELEVEN CANONICAL LESSONS (PURE SINGLE-COLUMN READING PROSE) */
    .lesson-page {
      --lesson-font-size: 12.1pt;
      --lesson-lh: 1.62;
      --block-gap: 14px;
    }
    .enquiry-banner {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 5px;
      margin-bottom: 9px;
      flex-shrink: 0;
    }
    .enquiry-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
    }
    .enquiry-pill {
      background: #0f172a;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      font-size: 7.4pt;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 3px;
    }
    .enquiry-canon-tag {
      font-family: 'Inter', sans-serif;
      font-size: 7.4pt;
      font-weight: 700;
      color: #475569;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .enquiry-title {
      font-family: 'Cinzel', serif;
      font-size: 14pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.18;
      margin: 0 0 4px 0;
    }
    .enquiry-core-question {
      background: #eff6ff;
      border-left: 3.5px solid #1e3a8a;
      padding: 4px 9px;
      font-family: 'Lora', Georgia, serif;
      font-size: 8.8pt;
      font-weight: 700;
      font-style: italic;
      color: #1e3a8a;
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .enquiry-core-question span.label {
      background: #1e3a8a;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      font-style: normal;
      padding: 1.5px 6px;
      border-radius: 2px;
      font-size: 6.8pt;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .prose-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      margin: 0 auto;
      width: 100%;
      max-width: 146mm;
    }
    .block-section {
      margin-bottom: var(--block-gap);
    }
    .block-section:last-child {
      margin-bottom: 0;
    }
    .block-header {
      display: flex;
      align-items: baseline;
      gap: 7px;
      margin-bottom: 2mm;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
    }
    .block-part-badge {
      font-family: 'Inter', sans-serif;
      font-size: 7.4pt;
      font-weight: 800;
      color: #1e3a8a;
      background: #eff6ff;
      padding: 1px 6px;
      border-radius: 2px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .block-title {
      font-family: 'Cinzel', serif;
      font-size: 10.2pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.02em;
    }
    .prose-p {
      font-family: 'Lora', Georgia, serif;
      font-size: var(--lesson-font-size);
      line-height: var(--lesson-lh);
      color: #1e293b;
      text-align: left;
      margin: 0;
    }
    .prose-p strong {
      color: #0f172a;
      font-weight: 700;
    }
    .lesson-words-strip {
      margin-top: auto;
      padding-top: 6px;
      border-top: 1px dashed #cbd5e1;
      display: flex;
      flex-wrap: wrap;
      gap: 5px 10px;
      align-items: center;
      font-family: 'Inter', sans-serif;
      font-size: 7.5pt;
      color: #334155;
    }
    .lesson-words-label {
      font-weight: 800;
      text-transform: uppercase;
      color: #1e3a8a;
      letter-spacing: 0.05em;
      font-size: 7.2pt;
    }
    .lesson-word-chip {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      padding: 1.5px 6px;
      border-radius: 3px;
      font-weight: 600;
    }

    /* PAGES 15–16: MASTER KNOWLEDGE RETRIEVAL QUIZ (55 QUESTIONS, ZERO WRITE-IN CLUTTER) */
    .quiz-instructions {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-left: 4px solid #1e3a8a;
      padding: 4px 10px;
      border-radius: 3px;
      font-family: 'Inter', sans-serif;
      font-size: 7.5pt;
      font-weight: 600;
      color: #1e3a8a;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
      flex-shrink: 0;
    }
    .quiz-stack {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      justify-content: space-between;
    }
    .quiz-topic-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-left: 3.5px solid #1e3a8a;
      border-radius: 4px;
      padding: 6.5px 11px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .quiz-topic-card.synthesis-card {
      background: #fdfbf7;
      border-left-color: #d97706;
    }
    .quiz-topic-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 0.5px solid #e2e8f0;
      padding-bottom: 2.5px;
      margin-bottom: 3.5px;
    }
    .quiz-topic-title {
      font-family: 'Inter', sans-serif;
      font-size: 8.7pt;
      font-weight: 800;
      color: #0f172a;
    }
    .quiz-topic-ref {
      font-family: 'Inter', sans-serif;
      font-size: 7.2pt;
      font-weight: 800;
      color: #1e3a8a;
      background: #eff6ff;
      padding: 1px 6px;
      border-radius: 2px;
    }
    .quiz-questions-list {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 2.5px;
      flex: 1;
    }
    .quiz-q-item {
      font-family: 'Inter', sans-serif;
      font-size: 8.05pt;
      line-height: 1.32;
      color: #1e293b;
      display: flex;
      align-items: baseline;
      gap: 5px;
    }
    .quiz-q-num {
      color: #1e3a8a;
      font-weight: 800;
      min-width: 26px;
      flex-shrink: 0;
    }

    /* PAGES 17–18: 48-WORD VOCABULARY BANK */
    .vocab-lesson-stack {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      justify-content: space-between;
    }
    .vocab-lesson-group {
      border: 1px solid #cbd5e1;
      border-left: 3.5px solid #1e3a8a;
      border-radius: 4px;
      padding: 6px 10px;
      background: #f8fafc;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .vocab-lesson-group.toolkit-group {
      background: #fdfbf7;
      border-left-color: #d97706;
    }
    .vocab-lesson-title {
      font-family: 'Inter', sans-serif;
      font-size: 8.1pt;
      font-weight: 800;
      color: #1e3a8a;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 4px;
      border-bottom: 0.5px solid #e2e8f0;
      padding-bottom: 2px;
      display: flex;
      justify-content: space-between;
    }
    .vocab-terms-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px 12px;
    }
    .vocab-entry {
      font-size: 7.85pt;
      line-height: 1.3;
      color: #1e293b;
    }
    .vocab-entry-word {
      font-family: 'Inter', sans-serif;
      font-weight: 800;
      color: #0f172a;
    }
    .vocab-entry-syl {
      font-family: 'Inter', sans-serif;
      font-size: 7.1pt;
      color: #64748b;
      margin-left: 3px;
    }
    .vocab-entry-def {
      font-family: 'Lora', Georgia, serif;
      display: block;
      color: #334155;
    }

    /* PAGE 19 & PAGE 20: ATLAS, COMPARISON & BACK COVER */
    .atlas-grid-2x2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 7px;
      margin-bottom: 7px;
    }
    .map-plate-card {
      border: 1.2px solid #cbd5e1;
      border-radius: 4px;
      padding: 4.5px;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
    }
    .map-plate-img {
      width: 100%;
      height: 59mm;
      object-fit: contain;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 3px;
      display: block;
    }
    .gallery-plate-img {
      width: 100%;
      height: 50mm;
      object-fit: cover;
      background: #0f172a;
      border: 1px solid #cbd5e1;
      border-radius: 3px;
      display: block;
    }
    .map-plate-cap {
      font-family: 'Inter', sans-serif;
      font-size: 7.1pt;
      color: #1e293b;
      line-height: 1.25;
      margin-top: 3.5px;
      text-align: left;
    }
    .themes-grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 7px;
      flex: 1;
    }
    .theme-card {
      background: #fdfbf7;
      border: 1px solid #e2d9cc;
      border-left: 4px solid #1e3a8a;
      border-radius: 4px;
      padding: 7px 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 4.5px;
    }
    .theme-card h3 {
      font-family: 'Inter', sans-serif;
      font-size: 8.5pt;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
      border-bottom: 0.5px solid #e2d9cc;
      padding-bottom: 2.5px;
    }
    .theme-card p {
      font-family: 'Lora', Georgia, serif;
      font-size: 8pt;
      line-height: 1.34;
      color: #334155;
      margin: 0;
    }
    .theme-bullets {
      margin: 0;
      padding-left: 14px;
      font-family: 'Inter', sans-serif;
      font-size: 7.3pt;
      line-height: 1.34;
      color: #1e293b;
    }
    .theme-bullets li { margin-bottom: 2px; }
    .theme-bullets li:last-child { margin-bottom: 0; }
    .theme-meta {
      margin-top: auto;
      font-family: 'Inter', sans-serif;
      font-size: 7pt;
      font-weight: 700;
      color: #1e3a8a;
      background: #eff6ff;
      padding: 2.5px 6px;
      border-radius: 3px;
      border: 0.5px solid #bfdbfe;
    }
    .back-discussion-box {
      background: #eff6ff;
      border: 1.5px solid #bfdbfe;
      border-left: 4.5px solid #1e3a8a;
      border-radius: 4px;
      padding: 8px 12px;
      margin-top: 7px;
    }
    .back-discussion-title {
      font-family: 'Inter', sans-serif;
      font-size: 8pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #1e3a8a;
      margin-bottom: 4px;
    }
    .back-discussion-list {
      margin: 0;
      padding-left: 17px;
      font-family: 'Lora', Georgia, serif;
      font-size: 8.15pt;
      line-height: 1.36;
      color: #0f172a;
    }
    .back-discussion-list li { margin-bottom: 2.5px; }
    .back-discussion-list li:last-child { margin-bottom: 0; }
  </style>
</head>
<body>

  <div class="screen-toolbar">
    <div><strong>KS2 Master Classroom Textbook (20 Pages)</strong> &bull; World War II &amp; The Home Front (1933–1945)</div>
    <div>
      <a href="/?unit=ks2_ww2&portal=ks2">&larr; Back to KS2 Unit Hub</a>
      <a href="/pdfs/ks2_ww2_textbook.pdf" download>Download PDF</a>
      <button class="gold" onclick="window.print()">Print Textbook</button>
    </div>
  </div>

  <!-- PAGE 1: MASTER FRONT COVER -->
  <div class="page" id="page-1">
    <div class="cover-masthead">
      <span>THE HISTORY REVISION HUB • KEY STAGE 2 CLASSROOM TEXTBOOK</span>
      <span class="cover-date-pill">1933 – 1945</span>
    </div>

    <div class="cover-title-block">
      <h1 class="cover-main-title">WORLD WAR II &amp; THE HOME FRONT</h1>
      <div class="cover-subtitle">Evacuation, Kindertransport, The Blitz, Rationing &amp; Rebuilding Lives</div>
    </div>

    <div class="cover-enquiry-banner">
      <span class="cover-enquiry-badge">BIG QUESTION</span>
      <span class="cover-enquiry-text">&ldquo;How did World War II change the lives of children and families across Britain and Europe?&rdquo;</span>
    </div>

    <div class="cover-hero-wrap">
      <img class="cover-hero-img" src="assets/banner_unit_hero.jpg" alt="British schoolchildren marching along a London railway station platform with gas mask boxes and luggage labels in 1940" />
    </div>
    <div class="cover-hero-caption">
      Primary Photograph: British schoolchildren carrying cardboard gas mask boxes and wearing luggage labels as they walk along a London railway platform during wartime evacuation, 1940 (Imperial War Museum HU 36871).
    </div>

    <div class="cover-overview-box">
      <div class="cover-overview-header">
        <span>ABOUT THIS UNIT</span>
        <span>YEARS 5 &amp; 6 HISTORY</span>
      </div>
      <p class="cover-overview-text">
        Between 1939 and 1945, the Second World War changed everyday life for millions of families. In Britain, children carried gas masks in cardboard boxes, left cities with brown luggage labels pinned to their coats, sheltered from night air raids, and grew vegetables in back gardens. Across Europe, Jewish children lost their rights step by step before brave rescue missions brought thousands to safety in Britain—both before the war on the Kindertransport and afterwards beside Lake Windermere.
      </p>
    </div>

    <div class="cover-directory">
      <div class="cover-directory-head">
        <span>CONTENTS • ELEVEN CLASSROOM ENQUIRIES</span>
        <span>20-PAGE READER</span>
      </div>
      <table class="cover-directory-table">
        <tbody>
          ${lessons
            .map((lesson, idx) => {
              const pageNum = idx + 4;
              const cleanTitle = lesson.title.replace(/^Enquiry \d+:\s*/i, '');
              return `
            <tr>
              <td class="col-num">Lesson ${idx + 1}</td>
              <td class="col-title">${cleanTitle}</td>
              <td class="col-eq">&ldquo;${lesson.enquiryQuestion}&rdquo;</td>
              <td class="col-page">Page ${pageNum}</td>
            </tr>`;
            })
            .join('')}
        </tbody>
      </table>
    </div>

    <div class="running-footer">
      <span>The History Revision Hub • Key Stage 2 Classroom Reader</span>
      <span class="page-pill">Page 1</span>
    </div>
  </div>

  <!-- PAGE 2: YOUR LEARNING JOURNEY -->
  <div class="page" id="page-2">
    <div class="running-header">
      <span>THE HISTORY REVISION HUB • KEY STAGE 2 TEXTBOOK</span>
      <span>YOUR LEARNING JOURNEY (LESSONS 1–11)</span>
    </div>

    <div class="section-page-header">
      <h2 class="section-page-title">Your Journey Through World War II</h2>
      <div class="section-page-subtitle">Eleven Historical Enquiries into How War Changed Children’s Lives</div>
    </div>

    <div class="journey-grid">
      ${journeyTop10
        .map((lesson, idx) => {
          const pageNum = idx + 4;
          const cleanTitle = lesson.title.replace(/^Enquiry \d+:\s*/i, '');
          return `
        <div class="journey-card">
          <div class="journey-card-head">
            <span class="journey-card-title">Lesson ${idx + 1}: ${cleanTitle}</span>
            <span class="journey-card-page">Page ${pageNum}</span>
          </div>
          <div class="journey-card-question">&ldquo;${lesson.enquiryQuestion}&rdquo;</div>
          <p class="journey-card-desc">${lesson.blurb || ''}</p>
        </div>`;
        })
        .join('')}
      ${
        journeyL11
          ? `
        <div class="journey-card span-two">
          <div class="journey-card-head">
            <span class="journey-card-title">Lesson 11: ${journeyL11.title.replace(/^Enquiry \d+:\s*/i, '')}</span>
            <span class="journey-card-page">Page 14</span>
          </div>
          <div class="journey-card-question">&ldquo;${journeyL11.enquiryQuestion}&rdquo;</div>
          <p class="journey-card-desc">${journeyL11.blurb || ''}</p>
        </div>`
          : ''
      }
    </div>

    <div class="running-footer">
      <span>The History Revision Hub • Key Stage 2 History • Eleven-Lesson Overview</span>
      <span class="page-pill">Page 2</span>
    </div>
  </div>

  <!-- PAGE 3: MASTER CHRONOLOGICAL TURNING POINTS -->
  <div class="page" id="page-3">
    <div class="running-header">
      <span>THE HISTORY REVISION HUB • KEY STAGE 2 TIMELINE</span>
      <span>KEY DATES &amp; TURNING POINTS (1933–1954)</span>
    </div>

    <div class="section-page-header">
      <h2 class="section-page-title">Key Dates &amp; Turning Points</h2>
      <div class="section-page-subtitle">Follow How Events Unfolded Step by Step Before, During, and After the War</div>
    </div>

    <div class="milestone-timeline">
      ${TURNING_POINTS.map(
        (m) => `
        <div class="milestone-row">
          <div class="milestone-date-box">${m.date}</div>
          <div class="milestone-node"></div>
          <div class="milestone-content">
            <span class="milestone-title">${m.title}</span>
            <p class="milestone-desc">${m.desc}</p>
          </div>
        </div>`,
      ).join('')}
    </div>

    <div class="running-footer">
      <span>The History Revision Hub • Key Stage 2 Timeline (1933–1954)</span>
      <span class="page-pill">Page 3</span>
    </div>
  </div>

  <!-- PAGES 4–14: ALL 11 CANONICAL LESSONS -->
  ${lessons
    .map((lesson, idx) => {
      const pageNum = idx + 4;
      const cleanTitle = lesson.title.replace(/^Enquiry \d+:\s*/i, '');
      const vocabWords = lesson.vocab || [];

      return `
  <div class="page lesson-page" id="page-${pageNum}">
    <div class="running-header">
      <span>THE HISTORY REVISION HUB • KEY STAGE 2 HISTORY</span>
      <span>Lesson ${idx + 1} of 11 &nbsp;|&nbsp; Page ${pageNum}</span>
    </div>

    <div class="enquiry-banner">
      <div class="enquiry-meta-row">
        <span class="enquiry-pill">LESSON ${idx + 1} • READING CHAPTER</span>
        <span class="enquiry-canon-tag">${lesson.period || '1939–1945'}</span>
      </div>
      <h2 class="enquiry-title">${cleanTitle}</h2>
      <div class="enquiry-core-question">
        <span class="label">Enquiry Question</span>
        <span>&ldquo;${lesson.enquiryQuestion}&rdquo;</span>
      </div>
    </div>

    <div class="prose-body">
      ${(lesson.narrative_blocks || [])
        .map((b, bIdx) => {
          const cleanText = cleanProse(b.text);
          return `
        <div class="block-section">
          <div class="block-header">
            <span class="block-part-badge">Part ${bIdx + 1}</span>
            <span class="block-title">${b.title || ''}</span>
          </div>
          <p class="prose-p">${cleanText}</p>
        </div>`;
        })
        .join('')}

      <div class="lesson-words-strip">
        <span class="lesson-words-label">Key Words (pp. 17–18):</span>
        ${vocabWords
          .map((v) => {
            const w = v.term || v.word;
            return `<span class="lesson-word-chip">${w} (${v.syllables || w})</span>`;
          })
          .join('')}
      </div>
    </div>

    <div class="running-footer">
      <span>The History Revision Hub • KS2 History • Lesson ${idx + 1}: ${cleanTitle}</span>
      <span class="page-pill">Page ${pageNum}</span>
    </div>
  </div>`;
    })
    .join('')}

  <!-- PAGE 15: MASTER KNOWLEDGE RETRIEVAL QUIZ — PART I (LESSONS 1–6) -->
  <div class="page" id="page-15">
    <div class="running-header">
      <span>THE HISTORY REVISION HUB • MEMORY CHECK</span>
      <span>PART I: LESSONS 1 TO 6 &nbsp;|&nbsp; QUESTIONS 1–30</span>
    </div>

    <div class="section-page-header">
      <h2 class="section-page-title">Master Knowledge Check: Part I (Lessons 1–6)</h2>
      <div class="section-page-subtitle">Test Yourself or Quiz a Partner Aloud — Do Not Write in This Textbook</div>
    </div>

    <div class="quiz-instructions">
      <span><strong>HOW TO USE:</strong> Take turns asking a partner these questions aloud, or write answers in your exercise book.</span>
      <span><strong>Check answers on Pages 4–9</strong></span>
    </div>

    <div class="quiz-stack">
      ${lessons
        .slice(0, 6)
        .map((lesson, idx) => {
          const pageNum = idx + 4;
          const cleanTopic = lesson.title.replace(/^Enquiry \d+:\s*/i, '');
          const qs = TEXTBOOK_QUIZ['lesson_' + (idx + 1)] || [];
          return `
        <div class="quiz-topic-card">
          <div class="quiz-topic-head">
            <span class="quiz-topic-title">Lesson ${idx + 1}: ${cleanTopic}</span>
            <span class="quiz-topic-ref">Read on Page ${pageNum}</span>
          </div>
          <div class="quiz-questions-list">
            ${qs
              .map(
                (qText, qIdx) => `
              <div class="quiz-q-item">
                <span class="quiz-q-num">Q${idx * 5 + qIdx + 1}.</span>
                <span>${qText}</span>
              </div>`,
              )
              .join('')}
          </div>
        </div>`;
        })
        .join('')}
    </div>

    <div class="running-footer">
      <span>The History Revision Hub • Master Knowledge Check • Questions 1–30</span>
      <span class="page-pill">Page 15</span>
    </div>
  </div>

  <!-- PAGE 16: MASTER KNOWLEDGE RETRIEVAL QUIZ — PART II (LESSONS 7–11 + BIG PICTURE) -->
  <div class="page" id="page-16">
    <div class="running-header">
      <span>THE HISTORY REVISION HUB • MEMORY CHECK</span>
      <span>PART II: LESSONS 7 TO 11 &amp; BIG PICTURE &nbsp;|&nbsp; QUESTIONS 31–60</span>
    </div>

    <div class="section-page-header">
      <h2 class="section-page-title">Master Knowledge Check: Part II (Questions 31–60)</h2>
      <div class="section-page-subtitle">Test Yourself or Quiz a Partner Aloud — Do Not Write in This Textbook</div>
    </div>

    <div class="quiz-instructions">
      <span><strong>HOW TO USE:</strong> Check Lessons 7–11 on Pages 10–14, then connect the whole unit in Questions 56–60!</span>
      <span><strong>Check answers on Pages 4–19</strong></span>
    </div>

    <div class="quiz-stack">
      ${lessons
        .slice(6, 11)
        .map((lesson, offset) => {
          const idx = offset + 6;
          const pageNum = idx + 4;
          const cleanTopic = lesson.title.replace(/^Enquiry \d+:\s*/i, '');
          const qs = TEXTBOOK_QUIZ['lesson_' + (idx + 1)] || [];
          return `
        <div class="quiz-topic-card">
          <div class="quiz-topic-head">
            <span class="quiz-topic-title">Lesson ${idx + 1}: ${cleanTopic}</span>
            <span class="quiz-topic-ref">Read on Page ${pageNum}</span>
          </div>
          <div class="quiz-questions-list">
            ${qs
              .map(
                (qText, qIdx) => `
              <div class="quiz-q-item">
                <span class="quiz-q-num">Q${idx * 5 + qIdx + 1}.</span>
                <span>${qText}</span>
              </div>`,
              )
              .join('')}
          </div>
        </div>`;
        })
        .join('')}

        <div class="quiz-topic-card synthesis-card">
          <div class="quiz-topic-head">
            <span class="quiz-topic-title">Connecting the Whole Story: Big-Picture Questions</span>
            <span class="quiz-topic-ref">Pages 3, 19 &amp; 20</span>
          </div>
          <div class="quiz-questions-list">
            <div class="quiz-q-item"><span class="quiz-q-num">Q56.</span><span>How was a Kindertransport child’s journey across borders in 1938–39 different from a British evacuee’s journey in Sept 1939?</span></div>
            <div class="quiz-q-item"><span class="quiz-q-num">Q57.</span><span>Why did German U-boats in the Atlantic make both Rationing (Lesson 7) and Bletchley Park codebreaking (Lesson 9) so vital?</span></div>
            <div class="quiz-q-item"><span class="quiz-q-num">Q58.</span><span>Give three different jobs women performed between 1941 and 1945 to keep Britain’s farms, factories, and secret huts running.</span></div>
            <div class="quiz-q-item"><span class="quiz-q-num">Q59.</span><span>Why could the 300 Windermere Children only be flown to Cumbria in August 1945 after Victory in Europe (VE) Day?</span></div>
            <div class="quiz-q-item"><span class="quiz-q-num">Q60.</span><span>What free health service opened in July 1948 to care for every family as peacetime Britain rebuilt after the war?</span></div>
          </div>
        </div>
    </div>

    <div class="running-footer">
      <span>The History Revision Hub • Master Knowledge Check • Questions 31–60</span>
      <span class="page-pill">Page 16</span>
    </div>
  </div>

  <!-- PAGE 17: HISTORICAL VOCABULARY BANK — PART I (LESSONS 1–6) -->
  <div class="page" id="page-17">
    <div class="running-header">
      <span>THE HISTORY REVISION HUB • KEY STAGE 2 GLOSSARY</span>
      <span>HISTORICAL VOCABULARY BANK (LESSONS 1–6)</span>
    </div>

    <div class="section-page-header">
      <h2 class="section-page-title">Key Words &amp; Meanings: Part I (Lessons 1–6)</h2>
      <div class="section-page-subtitle">Practise Saying Each Historical Word Aloud Using the Syllable Clues</div>
    </div>

    <div class="vocab-lesson-stack">
      ${lessons
        .slice(0, 6)
        .map((lesson, idx) => {
          const cleanTopic = lesson.title.replace(/^Enquiry \d+:\s*/i, '');
          return `
        <div class="vocab-lesson-group">
          <div class="vocab-lesson-title">
            <span>Lesson ${idx + 1}: ${cleanTopic}</span>
            <span>Page ${idx + 4}</span>
          </div>
          <div class="vocab-terms-2col">
            ${(lesson.vocab || [])
              .map(
                (v) => `
              <div class="vocab-entry">
                <span class="vocab-entry-word">${v.term || v.word}</span>
                <span class="vocab-entry-syl">[${v.syllables || v.term || v.word}]</span>
                <span class="vocab-entry-def">${v.definition || v.def}</span>
              </div>`,
              )
              .join('')}
          </div>
        </div>`;
        })
        .join('')}
    </div>

    <div class="running-footer">
      <span>The History Revision Hub • Key Stage 2 Vocabulary Bank (Words 1–24)</span>
      <span class="page-pill">Page 17</span>
    </div>
  </div>

  <!-- PAGE 18: HISTORICAL VOCABULARY BANK — PART II (LESSONS 7–11 + HISTORIAN'S TOOLKIT) -->
  <div class="page" id="page-18">
    <div class="running-header">
      <span>THE HISTORY REVISION HUB • KEY STAGE 2 GLOSSARY</span>
      <span>HISTORICAL VOCABULARY BANK (LESSONS 7–11 &amp; TOOLKIT)</span>
    </div>

    <div class="section-page-header">
      <h2 class="section-page-title">Key Words &amp; Meanings: Part II (Lessons 7–11 &amp; Toolkit)</h2>
      <div class="section-page-subtitle">Twenty-Four More Important Words for Speaking and Writing Like a Historian</div>
    </div>

    <div class="vocab-lesson-stack">
      ${lessons
        .slice(6, 11)
        .map((lesson, offset) => {
          const idx = offset + 6;
          const cleanTopic = lesson.title.replace(/^Enquiry \d+:\s*/i, '');
          return `
        <div class="vocab-lesson-group">
          <div class="vocab-lesson-title">
            <span>Lesson ${idx + 1}: ${cleanTopic}</span>
            <span>Page ${idx + 4}</span>
          </div>
          <div class="vocab-terms-2col">
            ${(lesson.vocab || [])
              .map(
                (v) => `
              <div class="vocab-entry">
                <span class="vocab-entry-word">${v.term || v.word}</span>
                <span class="vocab-entry-syl">[${v.syllables || v.term || v.word}]</span>
                <span class="vocab-entry-def">${v.definition || v.def}</span>
              </div>`,
              )
              .join('')}
          </div>
        </div>`;
        })
        .join('')}

        <div class="vocab-lesson-group toolkit-group">
          <div class="vocab-lesson-title">
            <span>Historian’s Toolkit: Working With Historical Evidence</span>
            <span>All Enquiries</span>
          </div>
          <div class="vocab-terms-2col">
            <div class="vocab-entry">
              <span class="vocab-entry-word">Primary Source</span>
              <span class="vocab-entry-syl">[pri-ma-ry source]</span>
              <span class="vocab-entry-def">A real object, photograph, diary, letter, or poster created at the time in the past being studied.</span>
            </div>
            <div class="vocab-entry">
              <span class="vocab-entry-word">Eyewitness Testimony</span>
              <span class="vocab-entry-syl">[eye-wit-ness tes-ti-mo-ny]</span>
              <span class="vocab-entry-def">Spoken or written memories shared by someone who personally lived through a historical event.</span>
            </div>
            <div class="vocab-entry">
              <span class="vocab-entry-word">Propaganda Poster</span>
              <span class="vocab-entry-syl">[prop-a-gan-da pos-ter]</span>
              <span class="vocab-entry-def">An official poster designed by a government to persuade citizens to help the war effort or stay safe.</span>
            </div>
            <div class="vocab-entry">
              <span class="vocab-entry-word">Chronology</span>
              <span class="vocab-entry-syl">[chro-nol-o-gy]</span>
              <span class="vocab-entry-def">Arranging historical events in the exact time order in which they happened, from earliest to latest.</span>
            </div>
          </div>
        </div>
    </div>

    <div class="running-footer">
      <span>The History Revision Hub • Key Stage 2 Vocabulary Bank (All 48 Words Complete)</span>
      <span class="page-pill">Page 18</span>
    </div>
  </div>

  <!-- PAGE 19: HISTORICAL ATLAS & COMPARING CHILDREN'S WARTIME JOURNEYS -->
  <div class="page" id="page-19">
    <div class="running-header">
      <span>THE HISTORY REVISION HUB • HISTORICAL ATLAS</span>
      <span>FOUR MAPS &amp; COMPARING CHILDREN’S JOURNEYS (1938–1945)</span>
    </div>

    <div class="section-page-header">
      <h2 class="section-page-title">Historical Atlas: Children’s Wartime Journeys</h2>
      <div class="section-page-subtitle">Compare Four Key Maps Across Britain and Europe (1938–1945)</div>
    </div>

    <div class="atlas-grid-2x2">
      <div class="map-plate-card">
        <img class="map-plate-img" src="assets/evacuation_map_ks2_pupil.png" alt="Map of Operation Pied Piper British evacuation routes" />
        <div class="map-plate-cap"><strong>Map A • Operation Pied Piper (Sept 1939):</strong> 1.5 million British children and mothers moved from city targets to rural counties.</div>
      </div>
      <div class="map-plate-card">
        <img class="map-plate-img" src="assets/kindertransport_route_map.jpg" alt="Map of Kindertransport rescue routes from Prague, Vienna and Berlin to London" />
        <div class="map-plate-cap"><strong>Map B • Kindertransport Routes (1938–39):</strong> Nearly 10,000 unaccompanied children escaped Nazi persecution by train and ferry to Britain.</div>
      </div>
      <div class="map-plate-card">
        <img class="map-plate-img" src="assets/uk_blitz_cities_map_1940.png" alt="Map of major British port and industrial cities bombed during the Blitz" />
        <div class="map-plate-cap"><strong>Map C • The Blitz Across Britain (1940–41):</strong> Night raids targeted London alongside docks and factories in Coventry, Liverpool, Hull &amp; Clydebank.</div>
      </div>
      <div class="map-plate-card">
        <img class="map-plate-img" src="assets/windermere_rescue_flight_map_1945.png" alt="Map of the August 1945 RAF Short Stirling airlift from Prague to Carlisle and Lake Windermere" />
        <div class="map-plate-cap"><strong>Map D • The Windermere Airlift (Aug 1945):</strong> Ten RAF Short Stirling bombers flew 300 child camp survivors from Prague to Cumbria.</div>
      </div>
    </div>

    <div class="themes-grid-2col">
      <div class="theme-card">
        <h3>1. British Evacuees (1–3 September 1939)</h3>
        <p>Travelled <strong>inside Britain</strong> before bombing started to stay safe from air raids. Children wore brown luggage labels, met the village Billeting Officer, and stayed with countryside host families.</p>
        <ul class="theme-bullets">
          <li><strong>Route:</strong> Big port &amp; factory cities &rarr; rural counties (Devon, Wales, Lake District).</li>
          <li><strong>Family &amp; Language:</strong> Spoke English, wrote postcards home, and mostly reunited in 1945.</li>
        </ul>
        <div class="theme-meta">Scale: 1.5 million evacuees • Key Link: Lesson 2 (Page 5)</div>
      </div>
      <div class="theme-card">
        <h3>2. Kindertransport Refugees (Dec 1938 – Aug 1939)</h3>
        <p>Travelled <strong>across international borders</strong> before war closed frontiers to escape unfair Nazi anti-Jewish laws. Parents had to stay behind when children boarded trains for Britain.</p>
        <ul class="theme-bullets">
          <li><strong>Route:</strong> Prague, Vienna &amp; Berlin &rarr; Dutch border &rarr; Hook of Holland ferry &rarr; Harwich.</li>
          <li><strong>Family &amp; Language:</strong> Arrived speaking Czech or German; most never saw their parents again.</li>
        </ul>
        <div class="theme-meta">Scale: ~10,000 children (669 from Prague) • Key Link: Lessons 4–5 (Pages 7–8)</div>
      </div>
      <div class="theme-card">
        <h3>3. Children on the Home Front (1940–1945)</h3>
        <p>Millions of British children experienced night sirens in garden Anderson shelters, indoor Morrison cages, or Tube platforms while helping tend family vegetable allotments.</p>
        <ul class="theme-bullets">
          <li><strong>Protection:</strong> Blackout curtains, taped glass, and 15 inches of garden soil over steel shelters.</li>
          <li><strong>Fair Shares:</strong> Coupon ration books, school milk &amp; 1.4m allotments improved child health.</li>
        </ul>
        <div class="theme-meta">Scale: 38 million gas masks issued • Key Link: Lessons 1, 6 &amp; 7 (Pages 4, 9–10)</div>
      </div>
      <div class="theme-card">
        <h3>4. The Windermere Survivors (August 1945)</h3>
        <p>Orphaned Jewish teenagers and children who survived wartime ghettos and camps in occupied Europe, brought to peaceful Cumbria three months after VE Day to heal.</p>
        <ul class="theme-bullets">
          <li><strong>Route:</strong> Liberated Theresienstadt &rarr; Prague Airfield &rarr; 10 RAF Stirling bombers &rarr; Carlisle.</li>
          <li><strong>Recovery:</strong> Art therapy, English classes, sport, bicycles &amp; the lifelong ’45 Aid Society.</li>
        </ul>
        <div class="theme-meta">Scale: 300 survivors in Cumbria • Key Link: Lesson 11 (Page 14)</div>
      </div>
    </div>

    <div class="running-footer">
      <span>The History Revision Hub • Historical Atlas &amp; Comparative Synthesis</span>
      <span class="page-pill">Page 19</span>
    </div>
  </div>

  <!-- PAGE 20: BACK COVER — PRIMARY SOURCE GALLERY & REMEMBERING TODAY -->
  <div class="page" id="page-20">
    <div class="running-header">
      <span>THE HISTORY REVISION HUB • KEY STAGE 2 BACK COVER</span>
      <span>PRIMARY SOURCE GALLERY &amp; REMEMBRANCE TODAY</span>
    </div>

    <div class="section-page-header">
      <h2 class="section-page-title">Remembering World War II Today</h2>
      <div class="section-page-subtitle">Iconic Primary Sources, Rebuilding Peacetime Britain &amp; Big Questions for Your Class</div>
    </div>

    <div class="atlas-grid-2x2">
      <div class="map-plate-card">
        <img class="gallery-plate-img" style="object-position: center 32%;" src="assets/st_pauls_survives_blitz_1940.jpg" alt="St Paul's Cathedral standing amidst Blitz smoke in December 1940" />
        <div class="map-plate-cap"><strong>Courage in the Blitz (Dec 1940):</strong> Volunteer fire watchers saved St Paul’s Cathedral through ferocious night raids on London.</div>
      </div>
      <div class="map-plate-card">
        <img class="gallery-plate-img" style="object-position: center 22%;" src="assets/land_girl_tractor_ww2.jpg" alt="Women's Land Army worker driving a farm tractor in wartime Britain" />
        <div class="map-plate-cap"><strong>Women on the Home Front (1941–45):</strong> Over 80,000 Land Girls, factory workers, and Bletchley codebreakers kept Britain running.</div>
      </div>
      <div class="map-plate-card">
        <img class="gallery-plate-img" style="object-position: center 22%;" src="assets/bevan_first_day_nhs_1948.jpg" alt="Aneurin Bevan visiting 13-year-old patient Sylvia Diggory on the first day of the NHS in July 1948" />
        <div class="map-plate-cap"><strong>Launching the Free NHS (5 July 1948):</strong> Thirteen-year-old Sylvia Diggory greets Health Minister Aneurin Bevan on day one of the NHS.</div>
      </div>
      <div class="map-plate-card">
        <img class="gallery-plate-img" style="object-position: center center;" src="assets/windermere_raf_stirling_airlift_1945.jpg" alt="RAF Short Stirling aircraft parked at Prague Airport during the August 1945 Windermere airlift" />
        <div class="map-plate-cap"><strong>Aeroplanes of Peace (Aug 1945):</strong> Ten RAF Short Stirling bombers flew 300 orphaned child camp survivors from Prague to Cumbria.</div>
      </div>
    </div>

    <div class="themes-grid-2col">
      <div class="theme-card">
        <h3>Rebuilding a Fairer Peacetime Britain (1945–1954)</h3>
        <p>Having shared rations and sheltered side by side for six years, British citizens determined to build a fairer country after 1945 so every family had decent housing, schooling, and healthcare.</p>
        <ul class="theme-bullets">
          <li><strong>New Homes &amp; Schools:</strong> Over one million new council homes and modern schools replaced bombed streets.</li>
          <li><strong>Free Healthcare (5 July 1948):</strong> Aneurin Bevan launched the <strong>National Health Service (NHS)</strong> free for all.</li>
          <li><strong>Fair Shares Continued:</strong> Bread and meat rationing continued until Britain’s recovery in <strong>July 1954</strong>.</li>
        </ul>
        <div class="theme-meta">Key Post-War Milestones: NHS Founded (July 1948) • Rationing Ends (July 1954)</div>
      </div>
      <div class="theme-card">
        <h3>Remembrance &amp; Passing Voices Forward</h3>
        <p>Every November on Remembrance Sunday, communities gather at the Whitehall Cenotaph and local town memorials wearing red poppies to honour all who served in Britain and across the Commonwealth.</p>
        <ul class="theme-bullets">
          <li><strong>Commonwealth Service:</strong> Volunteers from India, the Caribbean, Africa, Canada, and ANZAC served alongside Britain.</li>
          <li><strong>Living Testimonies:</strong> Vera Schaufeld’s suitcase, Winton’s scrapbook &amp; the ’45 Aid Society keep memories alive.</li>
          <li><strong>Our Responsibility:</strong> Choosing to be an <strong>upstander</strong> whenever neighbours face unfair treatment.</li>
        </ul>
        <div class="theme-meta">Key Legacy: Being an Upstander • Protecting Fairness, Peace &amp; Human Rights</div>
      </div>
    </div>

    <div class="back-discussion-box">
      <div class="back-discussion-title">Big Class Discussion Questions</div>
      <ol class="back-discussion-list">
        <li><strong>Everyday Courage:</strong> How did ordinary citizens at home—ARP wardens, parents, Land Girls, firefighters, and secret codebreakers—help Britain survive six years of war?</li>
        <li><strong>Being an Upstander:</strong> What can we learn today from volunteers like Nicholas Winton, Trevor Chadwick, and the British families who welcomed unaccompanied refugee children?</li>
        <li><strong>Fairness Under Pressure:</strong> Why did coupon rationing and Dig for Victory actually leave many British children healthier during wartime than before 1939?</li>
        <li><strong>Why History Matters:</strong> Why is it vital for Year 5 and Year 6 historians to keep sharing real eyewitness testimonies as fewer wartime survivors remain alive?</li>
      </ol>
    </div>

    <div class="running-footer">
      <span>The History Revision Hub • Key Stage 2 Primary Classroom Edition</span>
      <span class="page-pill">Page 20</span>
    </div>
  </div>

</body>
</html>`;
}

async function renderKs2Ww2Textbook() {
  console.log('='.repeat(75));
  console.log('🚀 Compiling 20-Page Master Classroom Textbook for KS2 [ks2_ww2]...');
  console.log('='.repeat(75));

  const html = buildHtml();

  const publicDir = path.join(ROOT_DIR, 'public', 'units', 'ks2_ww2');
  const rootDir = path.join(ROOT_DIR, 'units', 'ks2_ww2');
  const pdfRootDir = path.join(ROOT_DIR, 'public', 'pdfs');
  const pdfSubDir = path.join(ROOT_DIR, 'public', 'pdfs', 'ks2_ww2');

  [publicDir, rootDir, pdfRootDir, pdfSubDir].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const htmlTargets = [
    path.join(publicDir, 'textbook.html'),
    path.join(publicDir, 'textbook_PUBLISHER.html'),
    path.join(rootDir, 'textbook.html'),
    path.join(rootDir, 'textbook_PUBLISHER.html'),
  ];
  htmlTargets.forEach((p) => fs.writeFileSync(p, html, 'utf8'));

  const chromePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : undefined);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--allow-file-access-from-files', '--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    const fileUrl = 'file:///' + htmlTargets[0].replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);

    // Hide screen-only toolbar when measuring exact A4 page metrics
    await page.evaluate(() => {
      const tb = document.querySelector('.screen-toolbar');
      if (tb) tb.style.display = 'none';
    });

    // Deterministically calibrate Lesson pages (4..14) AFTER web fonts have loaded
    await page.evaluate(() => {
      const lessonPages = document.querySelectorAll('.lesson-page');
      lessonPages.forEach((pg) => {
        let fontPt = 12.4;
        let lh = 1.64;
        let gap = 15;
        pg.style.setProperty('--lesson-font-size', fontPt + 'pt');
        pg.style.setProperty('--lesson-lh', String(lh));
        pg.style.setProperty('--block-gap', gap + 'px');

        let guard = 0;
        while (pg.scrollHeight > pg.clientHeight && guard < 35) {
          fontPt = Math.max(10.4, +(fontPt - 0.15).toFixed(2));
          lh = Math.max(1.40, +(lh - 0.02).toFixed(2));
          gap = Math.max(6, gap - 1);
          pg.style.setProperty('--lesson-font-size', fontPt + 'pt');
          pg.style.setProperty('--lesson-lh', String(lh));
          pg.style.setProperty('--block-gap', gap + 'px');
          guard++;
        }
      });
    });

    // Verify all 20 pages for 0px overflow
    const report = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.page')).map((p, idx) => ({
        page: idx + 1,
        id: p.id,
        clientH: p.clientHeight,
        scrollH: p.scrollHeight,
        overflowPx: Math.max(0, p.scrollHeight - p.clientHeight),
      }));
    });

    // Restore screen toolbar in saved HTML (print CSS hides it automatically)
    await page.evaluate(() => {
      const tb = document.querySelector('.screen-toolbar');
      if (tb) tb.style.display = '';
    });

    const calibratedHtml = '<!DOCTYPE html>\n' + (await page.evaluate(() => document.documentElement.outerHTML));
    htmlTargets.forEach((p) => fs.writeFileSync(p, calibratedHtml, 'utf8'));

    console.log('\n📐 20-Page Textbook Space & Overflow Report:');
    let maxOverflow = 0;
    report.forEach((r) => {
      if (r.overflowPx > maxOverflow) maxOverflow = r.overflowPx;
      console.log(`  Page ${String(r.page).padStart(2, ' ')} (${r.id}): scroll=${r.scrollH}px / client=${r.clientH}px | overflow=${r.overflowPx}px`);
    });
    if (maxOverflow > 1) {
      throw new Error(`Textbook overflow detected (${maxOverflow}px)!`);
    }

    const pdfRootPath = path.join(pdfRootDir, 'ks2_ww2_textbook.pdf');
    const pdfSubPath = path.join(pdfSubDir, 'ks2_ww2_textbook.pdf');
    await page.pdf({
      path: pdfRootPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    fs.copyFileSync(pdfRootPath, pdfSubPath);
    console.log(`✅ Exported 20-Page Master Textbook PDF -> ${pdfRootPath} & ${pdfSubPath}`);
    return report;
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  renderKs2Ww2Textbook().catch((err) => {
    console.error('❌ Textbook compilation failed:', err);
    process.exit(1);
  });
}

module.exports = { buildHtml, renderKs2Ww2Textbook, run: renderKs2Ww2Textbook };
