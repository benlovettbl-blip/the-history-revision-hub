const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const puppeteer = require('puppeteer');
const { renderVersoLessonQr } = require('./components/render_verso_lesson_qr.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');

function getBase64Image(relPath) {
  if (!relPath) return null;
  const clean = relPath.replace(/^\//, '');
  const candidates = [
    path.join(ROOT_DIR, 'public', clean),
    path.join(ROOT_DIR, clean),
    path.join(ROOT_DIR, 'public', 'images', path.basename(clean)),
    path.join(ROOT_DIR, 'images', path.basename(clean)),
  ];

  for (const cand of candidates) {
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
      const ext = path.extname(cand).toLowerCase();
      let mime = 'image/jpeg';
      if (ext === '.png') mime = 'image/png';
      else if (ext === '.webp') mime = 'image/webp';
      else if (ext === '.svg') mime = 'image/svg+xml';
      const buf = fs.readFileSync(cand);
      return `data:${mime};base64,${buf.toString('base64')}`;
    }
  }
  return null;
}

function generateQrSvg(url) {
  const qr = QRCode.create(url, { margin: 1 });
  const size = qr.modules.size;
  const data = qr.modules.data;
  let pathD = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (data[r * size + c]) {
        pathD += `M${c},${r}h1v1h-1z `;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" style="width: 100%; height: 100%;"><path fill="#ffffff" d="M0,0h${size}v${size}H0z"/><path fill="#000000" d="${pathD.trim()}"/></svg>`;
}

// ============================================================================
// 7 Dedicated Shoah Enquiry Configurations (Gold Standard 5-Stage Standard)
// ============================================================================

const ENQUIRY_SHORT_TITLES = {
  1: 'Pre-War Diversity & Antisemitism',
  2: 'Stripping Rights & Kristallnacht',
  3: 'WWII Outbreak & Ghettoisation',
  4: 'Barbarossa & Mass Murder',
  5: 'Final Solution & Resistance',
  6: 'Complicity, Rescue & Bystanders',
  7: 'Liberation, Aftermath & Memory'
};

const enquiryConfigs = [
  {
    lessonNum: 1,
    id: 'lesson_1',
    title: 'Pre-War Diversity & Antisemitism',
    enquiryQuestion: 'Who were the Jews of Europe before the Second World War?',
    specAnchor:
      '9.5 million European Jews; demographic diversity; Yiddishland in Eastern Europe (shtetls, Warsaw, Vilna); Western integration in Berlin & Paris; 100,000 German Jewish WWI soldiers; Sephardic heritage in Thessaloniki; religious anti-Judaism vs modern racial antisemitism.',
    stages: [
        {
                    "step": 1,
                    "date": "c. 1930s",
                    "questionHeading": "Where did most of Europe's 9.5 million Jewish people live before 1939?"
            },
            {
                    "step": 2,
                    "date": "c. 1930s",
                    "questionHeading": "What was daily life and culture like in the Jewish towns (shtetls) of Eastern Europe?"
            },
            {
                    "step": 3,
                    "date": "1871–1933",
                    "questionHeading": "How did German Jews show their loyalty to Germany during the First World War?"
            },
            {
                    "step": 4,
                    "date": "c. 1930s",
                    "questionHeading": "What made the Sephardic Jewish community in Thessaloniki unique?"
            },
            {
                    "step": 5,
                    "date": "19th–20th C.",
                    "questionHeading": "Why was Nazi hatred based on 'blood' and race far deadlier than older religious hatred?"
            }
      ],
    vocabPrompt:
      'Define <strong>Racial Antisemitism</strong> and explain how it fundamentally differed from medieval Christian anti-Judaism:',
    rightPage: {
      type: 'split',
      partA: {
        tariff: 'Question 1: Describe Two Features [4 marks • 5 mins]',
        badge: 'FEATURE DRILL',
        question: 'Describe two features of pre-war Jewish life in Eastern Europe. [4 marks]',
        stems:
          'Feature 1: One key feature was that... • Detail: Specifically, this involved... • Feature 2: A second key feature was... • Detail: In particular, this meant that...',
      },
      partB: {
        tariff: 'Question 2: Explain One Consequence [4 marks • 5 mins]',
        badge: 'STRUCTURED WRITING',
        question:
          'Explain one consequence of the development of 19th-century racial antisemitism for European Jews. [4 marks]',
        hint: 'Focus on how pseudo-scientific biology treated Jewish identity as an unalterable genetic trait in the blood, removing baptism as an escape.',
        stems:
          'One consequence was that... • In particular, this meant that... • This was significant because... • Consequently, the impact was...',
        connectives:
          'A significant consequence was that... • In particular, this meant that... • Furthermore, this led to... • Consequently, the impact was...',
        wordBank:
          'Yiddishland • shtetl • assimilation • 100,000 German soldiers • Thessaloniki • anti-Judaism • biological racism • Wilhelm Marr',
      },
      timelineMissionTitle: 'Timeline Task • pp. 10–11',
      timelineMission:
        '<strong>Milestone 1 (c. 1933):</strong> Choose <strong>(A) Creative Sketch:</strong> Draw a vibrant scene of pre-war life — e.g. an open book glowing with Yiddish words, a bustling town market, or a German WWI Iron Cross medal showing proud patriotism &bull; OR &bull; <strong>(B) Mind Map:</strong> "Pre-War Life" (9.5M Jews, Yiddish culture, WWI service)',
    },
    leftPageQuip:
      'Over 100,000 German Jews fought patriotically for Germany in WWI; 12,000 gave their lives and 18,000 earned the Iron Cross for bravery.',
    rightPageQuip:
      'Before 1939, over three million Jewish people lived in Poland, creating an irreplaceable millennium of Yiddish language, music, and art.',
  },
  {
    lessonNum: 2,
    id: 'lesson_2',
    title: 'Stripping Rights & Kristallnacht (1933–1939)',
    enquiryQuestion:
      'How were German Jews progressively stripped of citizenship and rights (1933–1939)?',
    specAnchor:
      '1 April 1933 Boycott; Civil Service Law; 1935 Nuremberg Laws (Reich Citizenship Law, Blood Protection Law); 400 anti-Jewish decrees; Victor Klemperer’s diary ("social death"); November Pogrom (Kristallnacht 1938); Evian Conference; Kindertransport.',
    stages: [
        {
                    "step": 1,
                    "date": "1933–1934",
                    "questionHeading": "Why did the Nazis start their persecution by boycotting Jewish shops and firing workers?"
            },
            {
                    "step": 2,
                    "date": "1935–1936",
                    "questionHeading": "How did the 1935 Nuremberg Laws take away German citizenship from Jewish people?"
            },
            {
                    "step": 3,
                    "date": "1935–1938",
                    "questionHeading": "How did daily Nazi bans and rules cut Jewish people off from their neighbours?"
            },
            {
                    "step": 4,
                    "date": "Nov 1938",
                    "questionHeading": "Why was the violence of Kristallnacht (the November Pogrom) a major turning point?"
            },
            {
                    "step": 5,
                    "date": "1938–1939",
                    "questionHeading": "What was the Kindertransport, and why were borders closed to adult Jewish refugees?"
            }
      ],
    vocabPrompt:
      'Define <strong>Social Death</strong> and explain how bureaucratic decrees and the Nuremberg Laws enforced it between 1933 and 1939:',
    rightPage: {
      type: 'narrative_8',
      tariff: 'Question 2: Narrative Account [8 marks • 12 mins]',
      badge: 'NARRATIVE ACCOUNT',
      examStem:
        'Write a narrative account analysing the key stages in the persecution of German Jews between 1933 and 1939. [8 marks]',
      stimulus: [
        'The enactment of the Nuremberg Laws (1935)',
        'The November Pogrom (Kristallnacht, 1938)',
      ],
      connectives:
        'Initially, the persecution began when... • Following this, a major escalation occurred in 1935 when... • A violent turning point was reached when... • Consequently... • This ultimately resulted in...',
      wordBank:
        'April Boycott (1933) • Civil Service Law • Reich Citizenship Law • Blood Protection Law • Victor Klemperer • Kristallnacht • 30,000 arrested • Evian Conference • Kindertransport',
      timelineMissionTitle: 'Timeline Task • pp. 10–11',
      timelineMission:
        '<strong>Milestones 2 &amp; 3 (1933–1938):</strong> Choose <strong>(A) Creative Sketch:</strong> Draw a powerful image of rights being destroyed — e.g. the scales of justice tilting and cracking under a swastika, or a shop window shattered into jagged shards reflecting a burning synagogue &bull; OR &bull; <strong>(B) Mind Map:</strong> "Nazi Persecution" (Boycott, Nuremberg Laws, Kristallnacht)',
    },
    leftPageQuip:
      'During Kristallnacht, police were ordered not to intervene while SA men burned over 1,400 synagogues across Germany and Austria.',
    rightPageQuip:
      'Victor Klemperer wrote: "It is not the big blows that break you, but the thousand small humiliations repeated each single day."',
  },
  {
    lessonNum: 3,
    id: 'lesson_3',
    title: 'WWII Outbreak & Ghettoisation (1939–1941)',
    enquiryQuestion: 'How did the outbreak of WWII transform Nazi anti-Jewish policy (1939–1941)?',
    specAnchor:
      'Invasion of Poland (1 Sept 1939); Heydrich’s Schnellbrief; Star of David armbands; forced labour; Warsaw Ghetto established (Nov 1940); 450,000 crammed into 1.3 sq miles; 180–220 calories/day; typhus epidemics; child food smugglers; Emanuel Ringelblum & Oneg Shabbat archive.',
    stages: [
        {
                    "step": 1,
                    "date": "Sept 1939",
                    "questionHeading": "How did the invasion of Poland bring two million more Jewish people under Nazi rule?"
            },
            {
                    "step": 2,
                    "date": "1939–1940",
                    "questionHeading": "Why did the Nazis force Jewish people to wear the Yellow Star badge and do slave labour?"
            },
            {
                    "step": 3,
                    "date": "1940–1941",
                    "questionHeading": "How were the Warsaw and Łódź ghettos created, and how were they cut off from the world?"
            },
            {
                    "step": 4,
                    "date": "1940–1942",
                    "questionHeading": "What hardships did families face inside the ghettos, and how did children smuggle food?"
            },
            {
                    "step": 5,
                    "date": "1940–1943",
                    "questionHeading": "How did Emanuel Ringelblum and the Oneg Shabbat archive secretly preserve the truth?"
            }
      ],
    vocabPrompt:
      'Define <strong>Spiritual Resistance</strong> and explain how Emanuel Ringelblum’s Oneg Shabbat archive preserved human dignity:',
    rightPage: {
      type: 'source_utility_8',
      tariff: 'Question 3: Source Utility [8 marks • 12 mins]',
      badge: 'FORENSIC SOURCE EVALUATION',
      question:
        'Study Sources A and B on the digital portal. How useful are Sources A and B for an enquiry into living conditions and physical confinement in the Warsaw Ghetto? Explain your answer using Sources A and B and your knowledge of the historical context. [8 marks]',
      sourceA_badge: 'SOURCE A (WRITTEN DIARY EXTRACT)',
      sourceA_caption:
        'Extract from the secret diary of 16-year-old Mary Berg inside the Warsaw Ghetto (January 1941), describing brick walls, starvation rations, and secret underground classes.',
      sourceB_badge: 'SOURCE B (ARCHIVAL RECORD & TESTAMENT)',
      sourceB_caption:
        'Underground report from Emanuel Ringelblum’s Oneg Shabbat archive buried in aluminium milk cans beneath the ghetto rubble (1942), documenting child food smugglers and typhus mortality.',
    },
    leftPageQuip:
      'Official rations in the Warsaw Ghetto provided only 180 calories per day; over 80,000 people died of hunger and disease before deportations began.',
    rightPageQuip:
      'David Graber, 19, wrote before burying the archive: "What we were unable to shout out to the world, we buried in the ground."',
  },
  {
    lessonNum: 4,
    id: 'lesson_4',
    title: 'Barbarossa & The Holocaust by Bullets (1941–1942)',
    enquiryQuestion: 'How and why did persecution turn into systematic mass murder (1941–1942)?',
    specAnchor:
      'Operation Barbarossa (22 June 1941); war of extermination (Vernichtungskrieg); Commissar Order; Einsatzgruppen (A, B, C, D); Order Police (Reserve Police Battalion 101); Babi Yar ravine massacre (33,771 murdered in 36 hours); Ponary forest; local collaboration in Baltics/Ukraine; perpetrator psychological strain; gas vans at Chełmno.',
    stages: [
        {
                    "step": 1,
                    "date": "June 1941",
                    "questionHeading": "Why was the German invasion of the Soviet Union treated as a war of total destruction?"
            },
            {
                    "step": 2,
                    "date": "Summer 1941",
                    "questionHeading": "How did the Einsatzgruppen mobile death squads carry out the 'Holocaust by Bullets'?"
            },
            {
                    "step": 3,
                    "date": "Sept 1941",
                    "questionHeading": "What happened during the mass shooting at Babi Yar ravine outside Kyiv?"
            },
            {
                    "step": 4,
                    "date": "Autumn 1941",
                    "questionHeading": "How did local helpers in the Baltic states and Ukraine assist Nazi death squads?"
            },
            {
                    "step": 5,
                    "date": "Late 1941",
                    "questionHeading": "Why did Nazi leaders switch from face-to-face shootings to using poison gas vans at Chełmno?"
            }
      ],
    vocabPrompt:
      'Define <strong>The Holocaust by Bullets</strong> and explain why Operation Barbarossa was the decisive turning point into total genocide:',
    rightPage: {
      type: 'interpretations_8',
      tariff: 'Question 4: Historical Interpretations [8 marks • 12 mins]',
      badge: 'HISTORIOGRAPHICAL DEBATE',
      question:
        'Study Interpretations 1 and 2 on the digital portal. How do Interpretations 1 and 2 differ about why ordinary German policemen participated in mass shootings during the Holocaust? Explain your answer using both interpretations and your own knowledge. [8 marks]',
      interpretation1_badge: 'INTERPRETATION 1 (SITUATIONAL / PEER PRESSURE)',
      interpretation1_caption:
        'Historian Christopher Browning, Ordinary Men (1992), arguing that group conformity, situational peer pressure, and fear of isolation drove ordinary reservists in Battalion 101 to shoot.',
      interpretation2_badge: 'INTERPRETATION 2 (CULTURAL / IDEOLOGICAL MOTIVE)',
      interpretation2_caption:
        'Historian Daniel Goldhagen, Hitler’s Willing Executioners (1996), arguing that deeply rooted "eliminationist antisemitism" in German culture led ordinary men to kill eagerly and willingly.',
    },
    leftPageQuip:
      'Over 1.5 million Jewish people were murdered in open pits and ravines during the "Holocaust by Bullets" before death camps were built.',
    rightPageQuip:
      'Christopher Browning’s study "Ordinary Men" proved that Reserve Police Battalion 101 members were permitted to step out, yet 80% chose to shoot.',
  },
  {
    lessonNum: 5,
    id: 'lesson_5',
    title: 'The "Final Solution" & Armed Resistance (1942–1944)',
    enquiryQuestion: 'How did the "Final Solution" operate, and how did Jews resist?',
    specAnchor:
      'Wannsee Conference (20 Jan 1942); Reinhard Heydrich & Adolf Eichmann; coordination of state ministries; Operation Reinhard death camps (Bełżec, Sobibór, Treblinka); carbon monoxide chambers; Auschwitz-Birkenau dual function; Zyklon B; ramp selection; Warsaw Ghetto Uprising (April 1943); Mordechai Anielewicz & ŻOB; Treblinka & Sobibór camp revolts; Sonderkommando revolt (Oct 1944).',
    stages: [
        {
                    "step": 1,
                    "date": "Jan 1942",
                    "questionHeading": "What was the purpose of the 1942 Wannsee Conference, and what did leaders coordinate?"
            },
            {
                    "step": 2,
                    "date": "1942–1943",
                    "questionHeading": "What made the three Operation Reinhard camps (Belzec, Sobibor, Treblinka) pure death camps?"
            },
            {
                    "step": 3,
                    "date": "1942–1944",
                    "questionHeading": "How did Auschwitz-Birkenau combine slave labour with industrial gas chambers?"
            },
            {
                    "step": 4,
                    "date": "April–May 1943",
                    "questionHeading": "How did young Jewish fighters resist Nazi forces in the 1943 Warsaw Ghetto Uprising?"
            },
            {
                    "step": 5,
                    "date": "1943–1944",
                    "questionHeading": "How did revolts at Treblinka, Sobibór, and Auschwitz prove that prisoners fought back?"
            }
      ],
    vocabPrompt:
      'Define <strong>Operation Reinhard</strong> and explain the crucial distinction between a concentration camp and an extermination camp:',
    rightPage: {
      type: 'split',
      partA: {
        tariff: 'Question 1: Describe Two Features [4 marks • 5 mins]',
        badge: 'FEATURE DRILL',
        question: 'Describe two features of the Operation Reinhard extermination camps. [4 marks]',
        stems:
          'Feature 1: One key feature was that... • Detail: Specifically, this involved... • Feature 2: A second key feature was... • Detail: This served the purpose of...',
      },
      partB: {
        tariff: 'Question 2: Explain Why [8 marks • 12 mins]',
        badge: 'CAUSAL ANALYSIS',
        question:
          'Explain why Jewish fighters in the Warsaw Ghetto chose to launch an armed uprising in April 1943. [8 marks]',
        hint: 'Focus on the deportation of 300,000 residents to Treblinka, the determination to die with honour, and the creation of the ŻOB.',
        stems:
          'One reason was that... • In particular, this meant that... • This led to the uprising because... • A second reason was... • Consequently, this resulted in...',
        connectives:
          'A primary reason was that... • In particular, this meant that... • Furthermore, this was significant because... • A secondary factor was... • Consequently, this resulted in...',
        wordBank:
          'Wannsee Protocol • Operation Reinhard • Treblinka • Auschwitz-Birkenau • Zyklon B • selection • Mordechai Anielewicz • ŻOB • Sonderkommando revolt',
      },
      timelineMissionTitle: 'Timeline Task • pp. 10–11',
      timelineMission:
        '<strong>Milestones 7 &amp; 8 (1942–1944):</strong> Choose <strong>(A) Creative Sketch:</strong> Capture industrial terror or defiant resistance — e.g. railway tracks narrowing into the ominous archway of Birkenau, or a raised fist breaking through barbed wire clutching a secret resistance leaflet &bull; OR &bull; <strong>(B) Mind Map:</strong> "Death Camps &amp; Resistance" (Wannsee, Treblinka, Warsaw Uprising)',
    },
    leftPageQuip:
      'At Treblinka, Bełżec, and Sobibór, there was zero selection for labour; arriving transports of 5,000 people were murdered within two hours.',
    rightPageQuip:
      'Mordechai Anielewicz, 23, commander of the Warsaw Ghetto Uprising, wrote: "My life’s dream has come true: Jewish self-defence has become a reality."',
  },
  {
    lessonNum: 6,
    id: 'lesson_6',
    title: 'Responsibility, Complicity & Rescue across Europe',
    enquiryQuestion: 'Who was responsible, who collaborated, and who tried to save?',
    specAnchor:
      'Raul Hilberg’s spectrum (perpetrators, victims, bystanders); German civil service & Deutsche Reichsbahn; European collaboration (Vichy France & Vel’ d’Hiv roundup; Hungarian deportations); bystander indifference & Ian Kershaw; Righteous Among the Nations; rescue of Danish Jewry (Oct 1943); Le Chambon-sur-Lignon; White Rose (Sophie Scholl); Allied knowledge & Jan Karski; bombing Auschwitz debate.',
    stages: [
        {
                    "step": 1,
                    "date": "1941–1945",
                    "questionHeading": "How did railway planners, clerks, and civil servants help make the Holocaust happen?"
            },
            {
                    "step": 2,
                    "date": "1940–1944",
                    "questionHeading": "How did foreign police and governments (like Vichy France and Hungary) help the Nazis?"
            },
            {
                    "step": 3,
                    "date": "1940–1945",
                    "questionHeading": "Why did so many ordinary people across Europe remain silent bystanders?"
            },
            {
                    "step": 4,
                    "date": "1940–1945",
                    "questionHeading": "How did rescuers in Denmark and the village of Le Chambon risk their lives to save Jewish people?"
            },
            {
                    "step": 5,
                    "date": "1942–1944",
                    "questionHeading": "What did Allied leaders know about the death camps, and why did they not bomb the railway tracks?"
            }
      ],
    vocabPrompt:
      'Define <strong>Righteous Among the Nations</strong> and explain the extraordinary moral risk faced by rescuers in occupied Europe:',
    rightPage: {
      type: 'source_utility_8',
      tariff: 'Question 6: Source Utility [8 marks • 12 mins]',
      badge: 'FORENSIC SOURCE EVALUATION',
      question:
        'Study Sources C and D on the digital portal. How useful are Sources C and D for an enquiry into the responses of ordinary people and authorities to Nazi persecution and deportations? Explain your answer using Sources C and D and your knowledge of the historical context. [8 marks]',
      sourceA_badge: 'SOURCE C (EYEWITNESS TESTIMONY & RESCUE)',
      sourceA_caption:
        'Eyewitness testimony from a Danish fisherman on the clandestine civilian flotilla across the Øresund to neutral Sweden (October 1943), saving over 7,200 Jewish people.',
      sourceB_badge: 'SOURCE D (OFFICIAL POLICE CIRCULAR & COMPLICITY)',
      sourceB_caption:
        'Secret circular from the Paris Prefecture of Police ordering French municipal officers to arrest and intern 13,000 Jewish families at the Vélodrome d’Hiver (July 1942).',
    },
    leftPageQuip:
      'In occupied Poland, sheltering a Jewish person carried an automatic death penalty for the rescuer and their entire family.',
    rightPageQuip:
      'Sophie Scholl, 21, of the White Rose declared before her execution: "Someone had to make a start. What we wrote is what many believe."',
  },
  {
    lessonNum: 7,
    id: 'lesson_7',
    title: 'Liberation, Aftermath & Legacy of Memory (1944–1948)',
    enquiryQuestion: 'What was lost, and what does survivor testimony teach us?',
    specAnchor:
      'Death marches (winter 1944–45; 250,000 forced west, 70,000 dead); liberation of Auschwitz (27 Jan 1945), Buchenwald, and Bergen-Belsen (15 April 1945; British 11th Armoured Division); Richard Dimbleby BBC broadcast; 250,000 in DP camps; Kielce Pogrom (1946); Windermere Children in UK; Nuremberg Trials (IMT 1945–46); Raphael Lemkin and the UN Genocide Convention (1948); the obliteration of Yiddishland; ethical duty of memory.',
    stages: [
        {
                    "step": 1,
                    "date": "Winter 1944–45",
                    "questionHeading": "Why did the SS force starving prisoners onto freezing death marches at the end of the war?"
            },
            {
                    "step": 2,
                    "date": "Spring 1945",
                    "questionHeading": "What terrible conditions did British and Allied soldiers find when liberating Bergen-Belsen?"
            },
            {
                    "step": 3,
                    "date": "1945–1948",
                    "questionHeading": "What challenges did survivors face in Displaced Persons (DP) camps after liberation?"
            },
            {
                    "step": 4,
                    "date": "1945–1948",
                    "questionHeading": "How did the Nuremberg Trials and Raphael Lemkin establish new laws against genocide?"
            },
            {
                    "step": 5,
                    "date": "Post-1945",
                    "questionHeading": "What human and cultural life was destroyed in the Shoah, and why must we remember?"
            }
      ],
    vocabPrompt:
      'Define <strong>Genocide</strong> as coined by Raphael Lemkin in 1944 and explain its significance in international law:',
    rightPage: {
      type: 'single_12',
      tariff: 'Question 5: Evaluative Statement Essay [12 marks • 15 mins]',
      badge: 'EXTENDED EVALUATIVE ESSAY',
      examStem:
        '‘The liberation of the concentration camps in 1945 marked the end of the suffering of Holocaust survivors.’ How far do you agree? [12 marks]',
      stimulus: [
        'The liberation of Bergen-Belsen and Auschwitz (1945)',
        'Ongoing mortality and homelessness in Displaced Persons (DP) camps',
      ],
      structureStrip: [
        {
          col: '1. PHYSICAL LIBERATION & RELIEF',
          text: 'Evaluate how far Allied liberation of camps immediately ended physical danger, starvation, and persecution.',
        },
        {
          col: '2. ONGOING LOSS, HOMELESSNESS & TRAUMA',
          text: 'Evaluate the ongoing hardship: bereavement, destroyed communities, post-war antisemitism, and DP camps.',
        },
        {
          col: '3. COMPARATIVE VERDICT',
          text: 'Reach an overall evaluative judgement weighing immediate deliverance against lingering trauma and hardship.',
        },
      ],
    },
    leftPageQuip:
      'Even after British troops liberated Bergen-Belsen, over 14,000 survivors died within weeks due to advanced starvation and typhus.',
    rightPageQuip:
      'Raphael Lemkin lost 49 family members in the Shoah; he devoted his life to ensuring international law recognized the crime of Genocide.',
  },
];

// ============================================================================
// HELPER RENDERERS
// ============================================================================

function renderNotesPage(pageNum, quip, totalPages = 20) {
  const isEven = pageNum % 2 === 0;
  const pageClass = isEven ? 'verso-page' : 'recto-page';

  const numLines = 34;
  let linesHtml = '';
  for (let i = 0; i < numLines; i++) {
    linesHtml += `          <div class="note-line" style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box; margin: 0; width: 100%;"></div>\n`;
  }

  return `
  <!-- PAGE ${pageNum}: NOTES PAGE -->
  <div class="page page-container ${pageClass}" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full">
      <!-- Notes Header -->
      <div style="border-bottom: 2px solid #000000; padding-bottom: 3px; margin-bottom: 5px;">
        <h2 style="margin: 0; font-family: 'Inter', sans-serif; font-size: 13pt; color: #000000; text-transform: uppercase; font-weight: 900; letter-spacing: 0.5px;">
          Notes &amp; Extended Writing Canvas
        </h2>
      </div>

      <!-- Ruled Lined Canvas with Left Margin (Exercise Book Standard) -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; position: relative; border-top: 1.2px solid #000000; margin-bottom: 4px;">
        <!-- Vertical Margin Line (26mm from left edge) - British Exercise Book Standard Margin -->
        <div style="position: absolute; top: 0; bottom: 0; left: 26mm; width: 1.5px; background: #000000; z-index: 2;"></div>
        
        <!-- Ruled Horizontal Lines (Standard 8mm school pitch, flex-filled) -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0;">
${linesHtml}        </div>
      </div>

      ${renderFooterStrip(pageNum, quip, totalPages)}
    </div>
  </div>`;
}

function renderModelAnswersPage(pageNum = 18, totalPages = 20) {
  const isEven = pageNum % 2 === 0;
  const pageClass = isEven ? 'verso-page' : 'recto-page';

  return `
  <!-- PAGE ${pageNum}: DISCIPLINARY WRITING SCAFFOLDING & MODEL ANSWERS -->
  <div class="page page-container ${pageClass}" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full">
      
      <!-- Page Header -->
      <div style="border-bottom: 2px solid #000000; padding-bottom: 3px; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: baseline;">
        <div>
          <span style="font-family: 'Inter', sans-serif; font-size: 8pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1.5px 6px; border-radius: 2px; text-transform: uppercase;">
            WRITING SCAFFOLDING PORTFOLIO
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 8.5pt; font-weight: 800; color: #000000; margin-left: 6px; text-transform: uppercase;">
            Master Model Answers &bull; Questions 1–3
          </span>
        </div>
        <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; color: #475569;">
          Key Stage 3 &bull; Disciplinary Rigour
        </span>
      </div>

      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 4px; min-height: 0; margin-bottom: 3px;">
        
        <!-- MODEL 1: Question 1 Feature Drill (4 marks) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 4px 7px; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #000000; padding-bottom: 2px; margin-bottom: 3px;">
            <strong style="font-family: 'Playfair Display', serif; font-size: 9.8pt; color: #000000; font-weight: 900;">
              Model Answer 1 &bull; Describe Two Features Drill [4 Marks]
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7pt; font-weight: 800; background: #000000; color: #ffffff; padding: 1px 5px; border-radius: 2px;">
              SCORE: 4/4
            </span>
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
            Task: Describe two features of pre-war Jewish life in Eastern Europe. [4 marks]
          </div>
          <div style="font-family: 'Georgia', serif; font-size: 7.6pt; line-height: 1.25; color: #000000;">
            <p style="margin: 0 0 2px 0;">
              <strong>Feature 1:</strong> One key feature was that Eastern Europe was the vibrant heartland of Yiddish culture and language. <strong>Detail:</strong> Over three million Jewish people lived in Poland, creating an irreplaceable intellectual world of Yiddish daily newspapers, professional theatre, literature, and secular schools like the Tarbut network in towns such as Kostopol.
            </p>
            <p style="margin: 0;">
              <strong>Feature 2:</strong> A second key feature was the distinct demographic division between traditional rural shtetls and urban centers. <strong>Detail:</strong> While thousands lived in small close-knit market towns maintaining observant religious traditions, cities like Warsaw and Vilna hosted renowned talmudic academies and active trade union movements.
            </p>
          </div>
          <div style="border-top: 1px dashed #cbd5e1; margin-top: 3px; padding-top: 2px; font-family: 'Inter', sans-serif; font-size: 6.8pt; color: #334155; font-style: italic;">
            <strong>Examiner Breakdown:</strong> Full marks awarded. Two distinct features identified with specific historical evidence (Tarbut network, Warsaw, Vilna, Yiddish language).
          </div>
        </div>

        <!-- MODEL 2: Question 2 Consequence Writing (4 marks) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 4px 7px; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #000000; padding-bottom: 2px; margin-bottom: 3px;">
            <strong style="font-family: 'Playfair Display', serif; font-size: 9.8pt; color: #000000; font-weight: 900;">
              Model Answer 2 &bull; Explain One Consequence [4 Marks]
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7pt; font-weight: 800; background: #000000; color: #ffffff; padding: 1px 5px; border-radius: 2px;">
              SCORE: 4/4
            </span>
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
            Task: Explain one consequence of the development of 19th-century racial antisemitism. [4 marks]
          </div>
          <div style="font-family: 'Georgia', serif; font-size: 7.6pt; line-height: 1.25; color: #000000;">
            <p style="margin: 0;">
              One significant consequence of 19th-century racial antisemitism was the shift from religious prejudice to biological determinism. Under medieval Christian anti-Judaism, hostility was rooted in religious beliefs, meaning conversion or baptism offered a path to societal acceptance. However, 19th-century theorists like Wilhelm Marr redefined Jewish identity as an immutable biological race carried in the blood. <strong>As a direct result</strong>, religious conversion was rendered completely irrelevant; Jews were categorized as permanent racial enemies of the state. <strong>Consequently</strong>, this biological racism provided the ideological foundation for the 1935 Nuremberg Laws and the Nazi regime’s eventual policy of total physical annihilation.
            </p>
          </div>
          <div style="border-top: 1px dashed #cbd5e1; margin-top: 3px; padding-top: 2px; font-family: 'Inter', sans-serif; font-size: 6.8pt; color: #334155; font-style: italic;">
            <strong>Examiner Breakdown:</strong> Full marks awarded. Clearly demonstrates cause and consequence using explicit connectives ('As a direct result', 'Consequently') to link 19th-century ideology directly to 1935 legal persecution.
          </div>
        </div>

        <!-- MODEL 3: Question 3 Forensic Source Utility (8 marks) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 4px 7px; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #000000; padding-bottom: 2px; margin-bottom: 3px;">
            <strong style="font-family: 'Playfair Display', serif; font-size: 9.8pt; color: #000000; font-weight: 900;">
              Model Answer 3 &bull; Forensic Source Utility [8 Marks]
            </strong>
            <span style="font-family: 'Inter', sans-serif; font-size: 7pt; font-weight: 800; background: #000000; color: #ffffff; padding: 1px 5px; border-radius: 2px;">
              SCORE: 8/8
            </span>
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
            Task: How useful is Source A (Mary Berg’s diary) for an enquiry into living conditions in the Warsaw Ghetto? [8 marks]
          </div>
          <div style="font-family: 'Georgia', serif; font-size: 7.4pt; line-height: 1.24; color: #000000;">
            <p style="margin: 0 0 2px 0;">
              <strong>Content &amp; Context:</strong> Source A is highly useful because it provides vivid, direct eyewitness evidence of the physical and psychological enclosure imposed on Warsaw's Jews. Berg details how the 3-metre brick wall severed contact with the outside world and documents the severe starvation and cold suffered by children. This aligns precisely with historical knowledge: official ghetto rations supplied merely 180 calories per day, causing over 80,000 deaths from starvation and typhus. Crucially, Berg also reveals spiritual resistance—describing clandestine cellar classes defying Nazi bans.
            </p>
            <p style="margin: 0;">
              <strong>Provenance &amp; Limitations:</strong> The provenance significantly enhances its utility. Written contemporaneously in January 1941 by a 16-year-old resident inside the sealed ghetto, it captures immediate raw observations free from the distortion of post-war hindsight. However, a historian must recognize its limitations: as a private diary, it reflects only Berg’s localized sector of the ghetto, and she could not possess knowledge of the high-level extermination directives being formulated in Berlin. Overall, Source A remains exceptionally valuable for understanding daily human survival under confinement.
            </p>
          </div>
          <div style="border-top: 1px dashed #cbd5e1; margin-top: 3px; padding-top: 2px; font-family: 'Inter', sans-serif; font-size: 6.8pt; color: #334155; font-style: italic;">
            <strong>Examiner Breakdown:</strong> Level 3 (8/8). Evaluates content with contextual corroboration, interrogates provenance (contemporaneous eye-witness), and identifies valid analytical boundaries without dismissing usefulness.
          </div>
        </div>

      </div>

      ${renderFooterStrip(pageNum, 'Master writing scaffolds: Explicit paragraph structure and precise historical data secure top examination marks.', totalPages)}
    </div>
  </div>`;
}

function renderEvaluativeEssayModelPage(pageNum = 19, totalPages = 20) {
  const isEven = pageNum % 2 === 0;
  const pageClass = isEven ? 'verso-page' : 'recto-page';

  return `
  <!-- PAGE ${pageNum}: GRADE 9 EXTENDED ESSAY EXEMPLAR & ARCHIVAL PROVENANCE -->
  <div class="page page-container ${pageClass}" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full">
      
      <!-- Page Header -->
      <div style="border-bottom: 2px solid #000000; padding-bottom: 3px; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: baseline;">
        <div>
          <span style="font-family: 'Inter', sans-serif; font-size: 8pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1.5px 6px; border-radius: 2px; text-transform: uppercase;">
            EXTENDED WRITING EXEMPLAR
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 8.5pt; font-weight: 800; color: #000000; margin-left: 6px; text-transform: uppercase;">
            Question 5 Model Essay &bull; Grade 9 Standard
          </span>
        </div>
        <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; color: #475569;">
          Cross-Curricular GCSE Bridging
        </span>
      </div>

      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 4px; min-height: 0; margin-bottom: 3px;">
        
        <!-- Question Prompt & Overview -->
        <div style="border: 1.2px solid #000000; border-left: 3.5px solid #000000; border-radius: 3px; padding: 3px 7px; background: #ffffff;">
          <div style="font-family: 'Playfair Display', serif; font-size: 9.6pt; font-weight: 900; color: #000000; line-height: 1.22;">
            ‘The liberation of the concentration camps in 1945 marked the end of the suffering of Holocaust survivors.’ How far do you agree? [12 marks]
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.8pt; color: #475569; margin-top: 1px;">
            <strong>Stimulus Points:</strong> (1) Allied liberation of camps (1945); (2) Post-war DP camps, the British Mandate &amp; the SS Exodus (1945–1948).
          </div>
        </div>

        <!-- The Exemplar Essay -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 5px 8px; background: #ffffff; font-family: 'Georgia', serif; font-size: 7.2pt; line-height: 1.26; color: #000000;">
          <p style="margin: 0 0 3px 0;">
            To a significant extent, it is inaccurate to claim that liberation in 1945 marked the end of survivor suffering. While the arrival of Allied forces halted industrial mass murder, liberation was not a moment of sudden joy, but the beginning of an agonizing period of physical collapse, bereavement, statelessness, and geopolitical conflict.
          </p>
          <p style="margin: 0 0 3px 0;">
            <strong>On the one hand</strong>, liberation brought immediate deliverance from Nazi extermination and the winter death marches. When British troops entered Bergen-Belsen on 15 April 1945, they disarmed the SS guards and established emergency hospital wards, ending the gas chambers and summary shootings. For survivors, liberation meant physical survival was finally possible under international protection.
          </p>
          <p style="margin: 0 0 3px 0;">
            <strong>However</strong>, profound physical and emotional suffering persisted long after the guns fell silent. Extreme starvation and virulent typhus meant that over 14,000 liberated prisoners died at Bergen-Belsen within weeks of British arrival. Furthermore, when survivors attempted to return to their hometowns in Poland, they discovered their entire families had been murdered, their homes confiscated, and they faced violent pogroms—most infamously at Kielce in July 1946, where 42 Jewish survivors were murdered by local mobs. Consequently, over 250,000 homeless Jewish survivors were forced to live behind barbed wire in Allied Displaced Persons (DP) camps across Germany for years.
          </p>
          <p style="margin: 0 0 3px 0;">
            <strong>Crucially, survivor suffering was compounded by the geopolitical crisis in British Mandate Palestine.</strong> Enforcing the 1939 White Paper immigration quotas, the British government blockaded Palestine and turned back refugee vessels. In July 1947, the Royal Navy intercepted the <em>SS Exodus 1947</em> carrying 4,500 Holocaust survivors, attacking the ship in international waters and forcibly returning the refugees to camps in Germany. This outrage galvanized global Zionist resolve, convincing survivors that true safety required sovereign self-determination. This pressure directly accelerated the 1947 UN Partition Plan (Resolution 181) and the establishment of the State of Israel in May 1948.
          </p>
          <p style="margin: 0;">
            <strong>In conclusion</strong>, liberation was not the end of suffering, but the conclusion of physical extermination. The psychological trauma of the obliterated Yiddishland, the loss of entire family trees, and the desperate post-war struggle for a sovereign homeland meant that for survivors, the struggle to rebuild their lives lasted for decades.
          </p>
        </div>

        <!-- Archival Provenance & Academic Rights Matrix -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 4px 7px; background: #f8fafc;">
          <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; color: #000000; text-transform: uppercase; border-bottom: 1px solid #000000; padding-bottom: 2px; margin-bottom: 3px;">
            Archival Rights &amp; Provenance Guarantee &bull; Academic Neutrality
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 6.6pt; line-height: 1.22; color: #334155;">
            All primary photographic plates and textual extracts in this workbook are verified historical artifacts drawn from official national repositories: <strong>Imperial War Museum (IWM)</strong>, <strong>Yad Vashem Photo Archives</strong>, <strong>United States Holocaust Memorial Museum (USHMM)</strong>, <strong>Emanuel Ringelblum Jewish Historical Institute (ŻIH)</strong>, and <strong>The National Archives</strong>. Every image is held under UK Educational Fair Dealing (CDPA 1988) or Public Domain. <strong>STRICTLY ZERO AI GENERATION</strong>: Educational authenticity and historical integrity are unconditionally guaranteed.
          </div>
        </div>

      </div>

      ${renderFooterStrip(pageNum, 'The History Revision Hub &bull; Master Provenance &amp; Disciplinary Writing Standard 2026', totalPages)}
    </div>
  </div>`;
}

function renderFooterStrip(pageNum, quip, totalPages = 20) {
  const isEven = pageNum % 2 === 0;
  if (isEven) {
    return `
      <div class="page-footer-strip">
        <span class="footer-page-num" style="margin-right: 8px;">${pageNum}/${totalPages}</span>
        <span class="footer-quip" style="text-align: right; flex: 1;">${quip}</span>
      </div>`;
  } else {
    return `
      <div class="page-footer-strip">
        <span class="footer-quip" style="text-align: left; flex: 1; margin-right: 8px;">${quip}</span>
        <span class="footer-page-num">${pageNum}/${totalPages}</span>
      </div>`;
  }
}

// ============================================================================
// LEFT PAGE RENDERER: 4-SECTION CHRONOLOGICAL & EVALUATIVE SPINE (OPTION A)
// ============================================================================
function renderSpinePage(cfg, pageNum, totalPages = 20) {
  // 1. Build Top 5-Question Reference Roadmap Block (under title)
  const questionRowsHtml = cfg.stages.slice(0, 5).map((st, sIdx) => {
    const stageNum = st.step || sIdx + 1;
    const qText = (st.questionHeading || st.focusClue || st.title || '').replace(/^\[[\d\.]+\]\s*/, '').trim();
    const rawDate = (st.date || '').trim();
    const isVerdictWord = /verdict|evaluation|judgment/i.test(rawDate);
    const dateStr = !isVerdictWord ? rawDate : '';

    return `
          <div style="display: flex; align-items: baseline; gap: 6px; line-height: 1.35;">
            <span style="background: #000000; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; padding: 0.5px 4.5px; border-radius: 2px; white-space: nowrap; flex-shrink: 0;">${stageNum}</span>
            ${dateStr ? `<span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; color: #000000; text-transform: uppercase; white-space: nowrap; flex-shrink: 0;">${dateStr}</span><span style="color: #000000; font-weight: 900; font-size: 7.5pt;">&bull;</span>` : ''}
            <span style="font-family: 'Inter', sans-serif; font-size: 8.5pt; font-weight: 700; color: #000000; flex: 1; letter-spacing: -0.1px; line-height: 1.25;">${qText}</span>
          </div>`;
  }).join('');

  // 2. Generate 24 Full-Width A4 Ruled Exercise Book Lines with Stage Badges in the 26mm Left Margin
  const totalRuledLines = 25;
  const stageBadgesByLine = {
    0: { num: 1, date: cfg.stages[0]?.date || '' },
    5: { num: 2, date: cfg.stages[1]?.date || '' },
    10: { num: 3, date: cfg.stages[2]?.date || '' },
    15: { num: 4, date: cfg.stages[3]?.date || '' },
    20: { num: 5, date: cfg.stages[4]?.date || '' }
  };

  let ruledLinesHtml = '';
  for (let i = 0; i < totalRuledLines; i++) {
    const badgeInfo = stageBadgesByLine[i];
    let marginContent = '';
    if (badgeInfo) {
      const isVerdict = /verdict|evaluation|judgment/i.test(badgeInfo.date || '');
      const cleanDate = !isVerdict ? (badgeInfo.date || '') : '';
      marginContent = `<span style="background: #000000; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; padding: 0.5px 4px; border-radius: 2px; white-space: nowrap;">${badgeInfo.num}</span>${cleanDate ? ` <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; color: #000000; text-transform: uppercase;">${cleanDate}</span>` : ''}`;
    }

    ruledLinesHtml += `
            <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; display: flex; width: 100%; box-sizing: border-box; margin: 0;">
              <!-- 26mm Left Margin Rule -->
              <div style="width: 26mm; flex-shrink: 0; border-right: 1.5px solid #000000; padding-right: 2mm; display: flex; align-items: center; justify-content: flex-start; gap: 3px; box-sizing: border-box;">
                ${marginContent}
              </div>
              <!-- Full-Width Notes Handwriting Line -->
              <div style="flex: 1; min-width: 0;"></div>
            </div>`;
  }

  const isEven = pageNum % 2 === 0;
  const pageClass = isEven ? 'verso-page' : 'recto-page';

  return `
  <!-- LESSON SPREAD: ${isEven ? 'LEFT PAGE (VERSO)' : 'RIGHT PAGE (RECTO)'} • 5-QUESTION ROADMAP & EXERCISE CANVAS -->
  <div class="page page-container ${pageClass}" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      
      <!-- Lesson Header with Topic Title, Inquiry Question & 14mm Micro-QR -->
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2.2px; margin-bottom: 2.5px; display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #ffffff; color: #000000; border: 1.4px solid #000000; padding: 1.5px 7px; border-radius: 2px;">
              ENQUIRY ${cfg.lessonNum} &bull; LESSON NOTEBOOK
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 800; text-transform: uppercase; color: #000000; white-space: nowrap;">
              YEAR 9 &bull; THE SHOAH: 1933–1945
            </span>
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 11.2pt; font-weight: 900; color: #000000; line-height: 1.18; margin-top: 1.5px;">
            Enquiry ${cfg.lessonNum}: ${cfg.title}
          </div>
          <div style="font-family: 'Georgia', serif; font-size: 9.6pt; font-style: italic; color: #000000; line-height: 1.2; margin-top: 1px;">
            &ldquo;${cfg.enquiryQuestion}&rdquo;
          </div>
        </div>
        ${renderVersoLessonQr({ unitId: 'the_shoah', lessonId: cfg.id || `lesson_${cfg.lessonNum}` })}
      </div>

      <!-- 5 Core Inquiry Questions Reference Roadmap (Under Title) -->
      <div style="border: 1.2px solid #000000; border-radius: 2px; padding: 2.5px 5px; margin-bottom: 2.5mm; background: #ffffff; flex-shrink: 0;">
        <div style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; color: #000000; border-bottom: 1.2px solid #000000; padding-bottom: 1.5px; margin-bottom: 2px; display: flex; justify-content: space-between;">
          <span style="font-size: 7.8pt;">5 Core Inquiry Questions &bull; Chronological Roadmap</span>
          <span>Questions 1–5</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1.5px;">
          ${questionRowsHtml}
        </div>
      </div>

      <!-- Authentic British Exercise Book Canvas: 26mm Margin + 24 Full-Width Ruled Lines -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0;">
        ${ruledLinesHtml}
      </div>

      ${renderFooterStrip(pageNum, cfg.leftPageQuip, totalPages)}
    </div>
  </div>`;
}

function renderRightPage(cfg, pageNum, totalPages = 20) {
  const rp = cfg.rightPage;
  const isEven = pageNum % 2 === 0;
  const pageClass = isEven ? 'verso-page' : 'recto-page';

  // 12-MARK EVALUATIVE STATEMENT ESSAY (ENQUIRY 7)
  if (rp.type === 'single_12') {
    let linesHtml = '';
    const numLines = 27;
    for (let i = 0; i < numLines; i++) {
      linesHtml += `          <div class="note-line" style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box; margin: 0; width: 100%;"></div>\n`;
    }

    return `
  <!-- LESSON SPREAD: ${isEven ? 'LEFT PAGE (VERSO)' : 'RIGHT PAGE (RECTO)'} • 12-MARK EXTENDED ESSAY -->
  <div class="page page-container ${pageClass}" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">
      
      <!-- Top Writing Block (Header + Enquiry Focus + Question + Structural Guide) -->
      <div style="flex-shrink: 0; display: flex; flex-direction: column; gap: 2px;">
        
        <!-- Disciplinary Assessment Header with Enquiry Question -->
        <div style="border-bottom: 2px solid #000000; padding-bottom: 2.2px; margin-bottom: 2.5px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
              ENQUIRY ${cfg.lessonNum} &bull; DISCIPLINARY ASSESSMENT
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 800; text-transform: uppercase; color: #000000; white-space: nowrap;">
              YEAR 9 &bull; THE SHOAH: 1933–1945
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 1.5px;">
            <div style="font-family: 'Inter', sans-serif; font-size: 11.2pt; font-weight: 900; color: #000000; line-height: 1.18;">
              Enquiry ${cfg.lessonNum}: ${cfg.title}
            </div>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 800; text-transform: uppercase; color: #000000; border: 1.2px solid #000000; padding: 1px 6px; border-radius: 2px; white-space: nowrap; margin-left: 8px;">
              EXTENDED EVALUATIVE ESSAY
            </span>
          </div>
        </div>
          <div style="font-family: 'Georgia', serif; font-size: 9.6pt; font-style: italic; color: #000000; line-height: 1.2; margin-top: 1px;">
            &ldquo;${cfg.enquiryQuestion}&rdquo;
          </div>

        <!-- Tariff Subheader Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.2px solid #000000; padding-bottom: 1.5px; margin-bottom: 2px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.6pt; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 0.3px;">
            ${rp.tariff}
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-style: italic; color: #000000;">
            Independent Examination Practice
          </span>
        </div>

        <!-- Question Stem & Stimulus Box -->
        <div style="border: 1px solid #000000; border-left: 3.5px solid #000000; border-radius: 2.5px; padding: 4px 8px; background: #ffffff;">
          <div style="font-family: 'Playfair Display', serif; font-size: 10.8pt; font-weight: 900; color: #000000; margin-bottom: 3px; line-height: 1.24;">
            ${rp.examStem}
          </div>
          <div style="display: flex; align-items: center; gap: 8px; font-family: 'Inter', sans-serif; font-size: 8.2pt; color: #000000;">
            <strong style="color: #000000;">Stimulus:</strong>
            <span style="border: 1.2px solid #000000; padding: 1.5px 7px; border-radius: 2px; font-weight: 800; color: #000000; background: #ffffff;">${rp.stimulus[0]}</span>
            <span style="border: 1.2px solid #000000; padding: 1.5px 7px; border-radius: 2px; font-weight: 800; color: #000000; background: #ffffff;">${rp.stimulus[1]}</span>
            <span style="font-style: italic; color: #000000; font-size: 7.8pt;">(Support each factor with precise historical evidence)</span>
          </div>
        </div>

        ${
          rp.structureStrip
            ? `
        <!-- Evaluative Structure Strip (Disciplinary Architecture Only - Zero Giveaways) -->
        <div style="border: 1.2px solid #000000; border-radius: 2.5px; padding: 2.5px 6px; background: #ffffff; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px;">
          ${rp.structureStrip
            .map(
              (col) => `
            <div style="border-right: 1px solid #000000; padding-right: 4px;">
              <div style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; text-transform: uppercase; color: #000000;">${col.col}</div>
              <div style="font-family: 'Georgia', serif; font-size: 7.6pt; line-height: 1.2; color: #000000; margin-top: 1px;">${col.text}</div>
            </div>`,
            )
            .join('')}
        </div>`
            : ''
        }
      </div>

      <!-- Ruled Writing Area: flex: 1 fills ALL remaining space down to footer strip -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin-top: 3px; margin-bottom: 3px; border-top: 1.2px solid #000000;">
${linesHtml}      </div>

      ${renderFooterStrip(pageNum, cfg.rightPageQuip, totalPages)}
    </div>
  </div>`;
  }

  // 8-MARK NARRATIVE ACCOUNT (ENQUIRY 2)
  if (rp.type === 'narrative_8') {
    let linesHtml = '';
    const numLines = 29;
    for (let i = 0; i < numLines; i++) {
      linesHtml += `          <div class="note-line" style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box; margin: 0; width: 100%;"></div>\n`;
    }

    return `
  <!-- LESSON SPREAD: ${isEven ? 'LEFT PAGE (VERSO)' : 'RIGHT PAGE (RECTO)'} • NARRATIVE ACCOUNT -->
  <div class="page page-container ${pageClass}" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">
      
      <!-- Top Writing Block (Header + Enquiry Focus + Question) -->
      <div style="flex-shrink: 0; display: flex; flex-direction: column; gap: 2px;">
        
        <!-- Disciplinary Assessment Header with Enquiry Question -->
        <div style="border-bottom: 2px solid #000000; padding-bottom: 2.2px; margin-bottom: 2.5px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
              ENQUIRY ${cfg.lessonNum} &bull; DISCIPLINARY ASSESSMENT
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 800; text-transform: uppercase; color: #000000; white-space: nowrap;">
              YEAR 9 &bull; THE SHOAH: 1933–1945
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 1.5px;">
            <div style="font-family: 'Inter', sans-serif; font-size: 11.2pt; font-weight: 900; color: #000000; line-height: 1.18;">
              Enquiry ${cfg.lessonNum}: ${cfg.title}
            </div>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 800; text-transform: uppercase; color: #000000; border: 1.2px solid #000000; padding: 1px 6px; border-radius: 2px; white-space: nowrap; margin-left: 8px;">
              CHRONOLOGICAL CAUSAL ACCOUNT
            </span>
          </div>
        </div>
          <div style="font-family: 'Georgia', serif; font-size: 9.6pt; font-style: italic; color: #000000; line-height: 1.2; margin-top: 1px;">
            &ldquo;${cfg.enquiryQuestion}&rdquo;
          </div>

        <!-- Tariff Subheader Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.2px solid #000000; padding-bottom: 1.5px; margin-bottom: 2px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.6pt; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 0.3px;">
            ${rp.tariff}
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-style: italic; color: #000000;">
            Independent Examination Practice
          </span>
        </div>

        <!-- Question Stem & Stimulus Box -->
        <div style="border: 1px solid #000000; border-left: 3.5px solid #000000; border-radius: 2.5px; padding: 4px 8px; background: #ffffff;">
          <div style="font-family: 'Playfair Display', serif; font-size: 10.8pt; font-weight: 900; color: #000000; margin-bottom: 3px; line-height: 1.24;">
            ${rp.examStem}
          </div>
          <div style="display: flex; align-items: center; gap: 8px; font-family: 'Inter', sans-serif; font-size: 7.6pt; color: #000000;">
            <strong style="color: #000000;">Stimulus:</strong>
            <span style="border: 1.2px solid #000000; padding: 1px 7px; border-radius: 2px; font-weight: 800; color: #000000; background: #ffffff;">${rp.stimulus[0]}</span>
            <span style="border: 1.2px solid #000000; padding: 1px 7px; border-radius: 2px; font-weight: 800; color: #000000; background: #ffffff;">${rp.stimulus[1]}</span>
            <span style="font-style: italic; color: #000000;">(Support each factor with precise historical evidence)</span>
          </div>
        </div>
      </div>

      <!-- Ruled Writing Area: flex: 1 fills ALL remaining space down to footer strip -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin-top: 3px; margin-bottom: 3px; border-top: 1.2px solid #000000;">
${linesHtml}      </div>

      ${renderFooterStrip(pageNum, cfg.rightPageQuip, totalPages)}
    </div>
  </div>`;
  }

  // 8-MARK SOURCE UTILITY (ENQUIRIES 3 & 6 • TWO SOURCES FOCUS)
  if (rp.type === 'source_utility_8') {
    let linesHtml = '';
    const numLines = 27;
    for (let i = 0; i < numLines; i++) {
      linesHtml += `          <div class="note-line" style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box; margin: 0; width: 100%;"></div>\n`;
    }

    return `
  <!-- LESSON SPREAD: ${isEven ? 'LEFT PAGE (VERSO)' : 'RIGHT PAGE (RECTO)'} • SOURCE UTILITY (TWO SOURCES) -->
  <div class="page page-container ${pageClass}" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">
      
      <!-- Top Writing Block (Header + Enquiry Focus + Question + Dual Source Provenance) -->
      <div style="flex-shrink: 0; display: flex; flex-direction: column; gap: 2px;">
        
        <!-- Disciplinary Assessment Header with Enquiry Question -->
        <div style="border-bottom: 2px solid #000000; padding-bottom: 2.2px; margin-bottom: 2.5px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
              ENQUIRY ${cfg.lessonNum} &bull; DISCIPLINARY ASSESSMENT
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 800; text-transform: uppercase; color: #000000; white-space: nowrap;">
              YEAR 9 &bull; THE SHOAH: 1933–1945
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 1.5px;">
            <div style="font-family: 'Inter', sans-serif; font-size: 11.2pt; font-weight: 900; color: #000000; line-height: 1.18;">
              Enquiry ${cfg.lessonNum}: ${cfg.title}
            </div>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 800; text-transform: uppercase; color: #000000; border: 1.2px solid #000000; padding: 1px 6px; border-radius: 2px; white-space: nowrap; margin-left: 8px;">
              FORENSIC SOURCE EVALUATION
            </span>
          </div>
        </div>
          <div style="font-family: 'Georgia', serif; font-size: 9.6pt; font-style: italic; color: #000000; line-height: 1.2; margin-top: 1px;">
            &ldquo;${cfg.enquiryQuestion}&rdquo;
          </div>

        <!-- Tariff Subheader Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.2px solid #000000; padding-bottom: 1.5px; margin-bottom: 2px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.6pt; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 0.3px;">
            ${rp.tariff}
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-style: italic; color: #000000;">
            Independent Examination Practice
          </span>
        </div>

        <!-- Question Stem Box -->
        <div style="border: 1px solid #000000; border-left: 3.5px solid #000000; border-radius: 2.5px; padding: 3.5px 7px; background: #ffffff;">
          <div style="font-family: 'Playfair Display', serif; font-size: 10.5pt; font-weight: 900; color: #000000; line-height: 1.22;">
            ${rp.question}
          </div>
        </div>

        <!-- Dual Sources Reference Strip (Digital Eyes Standard: Full Texts & High-Res Visuals in App) -->
        <div style="border: 1.2px solid #000000; border-radius: 2.5px; padding: 3px 6px; background: #ffffff; display: flex; flex-direction: column; gap: 2.5px;">
          <div style="display: flex; align-items: baseline; gap: 6px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1.5px 5.5px; border-radius: 2px; text-transform: uppercase; white-space: nowrap;">
              ${rp.sourceA_badge || 'Source A'}
            </span>
            <span style="font-family: 'Georgia', serif; font-size: 8.4pt; color: #000000; line-height: 1.24;">
              ${rp.sourceA_caption || rp.sourceCaption}
            </span>
          </div>
          <div style="display: flex; align-items: baseline; gap: 6px; border-top: 1px dashed #000000; padding-top: 2px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1.5px 5.5px; border-radius: 2px; text-transform: uppercase; white-space: nowrap;">
              ${rp.sourceB_badge || 'Source B'}
            </span>
            <span style="font-family: 'Georgia', serif; font-size: 8.4pt; color: #000000; line-height: 1.24;">
              ${rp.sourceB_caption}
            </span>
          </div>
        </div>
      </div>

      <!-- Ruled Writing Area: flex: 1 fills ALL remaining space down to footer strip -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin-top: 3px; margin-bottom: 3px; border-top: 1.2px solid #000000;">
${linesHtml}      </div>

      ${renderFooterStrip(pageNum, cfg.rightPageQuip, totalPages)}
    </div>
  </div>`;
  }

  // 8-MARK HISTORICAL INTERPRETATIONS (ENQUIRY 4 • TWO INTERPRETATIONS FOCUS)
  if (rp.type === 'interpretations_8') {
    let linesHtml = '';
    const numLines = 27;
    for (let i = 0; i < numLines; i++) {
      linesHtml += `          <div class="note-line" style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box; margin: 0; width: 100%;"></div>\n`;
    }

    return `
  <!-- LESSON SPREAD: ${isEven ? 'LEFT PAGE (VERSO)' : 'RIGHT PAGE (RECTO)'} • HISTORICAL INTERPRETATIONS -->
  <div class="page page-container ${pageClass}" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">
      
      <!-- Top Writing Block (Header + Enquiry Focus + Question + Dual Interpretations Provenance) -->
      <div style="flex-shrink: 0; display: flex; flex-direction: column; gap: 2px;">
        
        <!-- Disciplinary Assessment Header with Enquiry Question -->
        <div style="border-bottom: 2px solid #000000; padding-bottom: 2.2px; margin-bottom: 2.5px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
              ENQUIRY ${cfg.lessonNum} &bull; DISCIPLINARY ASSESSMENT
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 800; text-transform: uppercase; color: #000000; white-space: nowrap;">
              YEAR 9 &bull; THE SHOAH: 1933–1945
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 1.5px;">
            <div style="font-family: 'Inter', sans-serif; font-size: 11.2pt; font-weight: 900; color: #000000; line-height: 1.18;">
              Enquiry ${cfg.lessonNum}: ${cfg.title}
            </div>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 800; text-transform: uppercase; color: #000000; border: 1.2px solid #000000; padding: 1px 6px; border-radius: 2px; white-space: nowrap; margin-left: 8px;">
              HISTORIOGRAPHICAL DEBATE
            </span>
          </div>
        </div>
          <div style="font-family: 'Georgia', serif; font-size: 9.6pt; font-style: italic; color: #000000; line-height: 1.2; margin-top: 1px;">
            &ldquo;${cfg.enquiryQuestion}&rdquo;
          </div>

        <!-- Tariff Subheader Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.2px solid #000000; padding-bottom: 1.5px; margin-bottom: 2px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.6pt; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 0.3px;">
            ${rp.tariff}
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-style: italic; color: #000000;">
            Independent Examination Practice
          </span>
        </div>

        <!-- Question Stem Box -->
        <div style="border: 1px solid #000000; border-left: 3.5px solid #000000; border-radius: 2.5px; padding: 3.5px 7px; background: #ffffff;">
          <div style="font-family: 'Playfair Display', serif; font-size: 10.5pt; font-weight: 900; color: #000000; line-height: 1.22;">
            ${rp.question}
          </div>
        </div>

        <!-- Dual Interpretations Reference Strip (Digital Eyes Standard: Full Texts in App) -->
        <div style="border: 1.2px solid #000000; border-radius: 2.5px; padding: 3px 6px; background: #ffffff; display: flex; flex-direction: column; gap: 2.5px;">
          <div style="display: flex; align-items: baseline; gap: 6px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1.5px 5.5px; border-radius: 2px; text-transform: uppercase; white-space: nowrap;">
              ${rp.interpretation1_badge || 'Interpretation 1'}
            </span>
            <span style="font-family: 'Georgia', serif; font-size: 8.4pt; color: #000000; line-height: 1.24;">
              ${rp.interpretation1_caption}
            </span>
          </div>
          <div style="display: flex; align-items: baseline; gap: 6px; border-top: 1px dashed #000000; padding-top: 2px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1.5px 5.5px; border-radius: 2px; text-transform: uppercase; white-space: nowrap;">
              ${rp.interpretation2_badge || 'Interpretation 2'}
            </span>
            <span style="font-family: 'Georgia', serif; font-size: 8.4pt; color: #000000; line-height: 1.24;">
              ${rp.interpretation2_caption}
            </span>
          </div>
        </div>
      </div>

      <!-- Ruled Writing Area: flex: 1 fills ALL remaining space down to footer strip -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin-top: 3px; margin-bottom: 3px; border-top: 1.2px solid #000000;">
${linesHtml}      </div>

      ${renderFooterStrip(pageNum, cfg.rightPageQuip, totalPages)}
    </div>
  </div>`;
  }

  // Default: Split Short Drills (4m Features + 4m Consequence / 8m Why) (ENQUIRIES 1 & 5)
  let partBLinesHtml = '';
  const numPartBLines = 21;
  for (let i = 0; i < numPartBLines; i++) {
    partBLinesHtml += `          <div class="note-line" style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box; margin: 0; width: 100%;"></div>\n`;
  }

  return `
  <!-- LESSON SPREAD: ${isEven ? 'LEFT PAGE (VERSO)' : 'RIGHT PAGE (RECTO)'} • DUAL DISCIPLINARY DRILLS -->
  <div class="page page-container ${pageClass}" id="page-${pageNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%;">
      
      <!-- Top Writing Block (Header + Enquiry Focus) -->
      <div style="flex-shrink: 0; display: flex; flex-direction: column; gap: 2px; margin-bottom: 3px;">
        <div style="border-bottom: 2px solid #000000; padding-bottom: 2.2px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
              ENQUIRY ${cfg.lessonNum} &bull; DISCIPLINARY ASSESSMENT
            </span>
            <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 800; text-transform: uppercase; color: #000000; white-space: nowrap;">
              YEAR 9 &bull; THE SHOAH: 1933–1945
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 1.5px;">
            <div style="font-family: 'Inter', sans-serif; font-size: 11.2pt; font-weight: 900; color: #000000; line-height: 1.18;">
              Enquiry ${cfg.lessonNum}: ${cfg.title}
            </div>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 800; text-transform: uppercase; color: #000000; border: 1.2px solid #000000; padding: 1px 6px; border-radius: 2px; white-space: nowrap; margin-left: 8px;">
              FEATURE DRILL &amp; EXTENDED WRITING
            </span>
          </div>
        </div>
          <div style="font-family: 'Georgia', serif; font-size: 9.6pt; font-style: italic; color: #000000; line-height: 1.2; margin-top: 1px;">
            &ldquo;${cfg.enquiryQuestion}&rdquo;
          </div>
      </div>

      <!-- PART A: Feature Drill Block (flex-shrink: 0) -->
      <div style="flex-shrink: 0; display: flex; flex-direction: column; gap: 2px; margin-bottom: 3px;">
        <div style="border-bottom: 1.5px solid #000000; padding-bottom: 2px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <h3 style="font-family: 'Playfair Display', serif; font-size: 11.0pt; color: #000000; margin: 0; font-weight: 900;">
              ${rp.partA.tariff}
            </h3>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 800; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 6px; border-radius: 2px;">
              ${rp.partA.badge}
            </span>
          </div>
        </div>
        <div style="border: 1px solid #000000; border-left: 3px solid #000000; border-radius: 2px; padding: 2.5px 6px; background: #ffffff; font-family: 'Playfair Display', serif; font-size: 10.0pt; font-weight: 900; line-height: 1.22;">
          ${rp.partA.question}
        </div>
        <!-- Ruled Lines for Part A @ consistent 7.8mm -->
        <div class="ruled-lines-block" style="margin-top: 1px;">
          ${Array.from({ length: 8 })
            .map(() => `<div class="task-line"></div>`)
            .join('')}
        </div>
      </div>

      <!-- PART B Top Block (flex-shrink: 0) -->
      <div style="flex-shrink: 0; display: flex; flex-direction: column; gap: 2px;">
        <div style="border-bottom: 1.5px solid #000000; padding-bottom: 2px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <h3 style="font-family: 'Playfair Display', serif; font-size: 11.0pt; color: #000000; margin: 0; font-weight: 900;">
              ${rp.partB.tariff}
            </h3>
            <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 800; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 6px; border-radius: 2px;">
              ${rp.partB.badge}
            </span>
          </div>
        </div>
        <div style="border: 1px solid #000000; border-left: 3px solid #000000; border-radius: 2px; padding: 2.5px 6px; background: #ffffff; font-family: 'Playfair Display', serif; font-size: 10.0pt; font-weight: 900; line-height: 1.22;">
          ${rp.partB.question}
        </div>
      </div>

      <!-- Ruled Lines for Part B: flex: 1 fills ALL remaining space down to footer strip -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; margin-top: 3px; margin-bottom: 3px; border-top: 1.2px solid #000000;">
${partBLinesHtml}      </div>

      ${renderFooterStrip(pageNum, cfg.rightPageQuip, totalPages)}
    </div>
  </div>`;
}

function renderCentrefold(pLeftNum, pRightNum, totalPages = 20) {
  const leftHtml = `
  <!-- PAGE ${pLeftNum}: CENTREFOLD PART I • SIX LIVES MICRO-HISTORIES -->
  <div class="page page-container verso-page" id="page-${pLeftNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%; justify-content: space-between;">
      
      <!-- Top Spread Masthead -->
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 2.5px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.5pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
            CENTREFOLD SPREAD &bull; PART I
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 8.5pt; font-weight: 800; text-transform: uppercase; color: #000000;">
            SIX LIVES: MICRO-HISTORIES OF THE HOLOCAUST (1933–1945)
          </span>
        </div>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 12.0pt; color: #000000; margin: 1px 0 2px 0; font-weight: 900; line-height: 1.16;">
          Diversity, Persecution &amp; The Enclosed Ghettos
        </h2>
        <div style="border: 1.2px solid #000000; border-radius: 2.5px; background: #ffffff; padding: 2.5px 6px; font-family: 'Inter', sans-serif; font-size: 8.2pt; color: #000000; line-height: 1.22;">
          <strong style="text-transform: uppercase;">Disciplinary Anchor:</strong> Six million is not a statistic; it was six million individual human lives. By investigating real micro-histories across diverse regions, pupils trace how state persecution dismantled individual worlds.
        </div>
      </div>

      <!-- 3 Case Study Cards on Left Page -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; gap: 4px; margin-bottom: 2px;">
        
        <!-- Case Study 1: Richard Stern (Cologne, Germany) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 3.5px 6px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; flex: 1;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #000000; padding-bottom: 1.5px; margin-bottom: 2px;">
              <span style="font-family: 'Inter', sans-serif; font-size: 8.6pt; font-weight: 900; color: #000000; text-transform: uppercase;">
                Case Study 1: Richard Stern &bull; Cologne, Germany
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1.5px 5.5px; border-radius: 2px; text-transform: uppercase;">
                German-Jewish Veteran
              </span>
            </div>
            <p style="font-family: 'Georgia', serif; font-size: 8.5pt; line-height: 1.26; color: #000000; margin: 0 0 2px 0;">
              A decorated German-Jewish soldier awarded the Iron Cross in the First World War, Richard ran a business in Cologne. On 1 April 1933, when SA stormtroopers launched the nationwide anti-Jewish boycott outside his shop, Richard pinned his Iron Cross to his chest and stood defiantly beside the stormtrooper, handing out leaflets protesting the regime's betrayal. He escaped to America in 1939 and enlisted in the US Army at age 43 to fight Hitler.
            </p>
            <div style="border-left: 2.5px solid #000000; padding-left: 5px; margin: 2px 0; background: #fbfbfb;">
              <div style="font-family: 'Georgia', serif; font-size: 8.0pt; font-style: italic; color: #000000; line-height: 1.2;">
                &ldquo;I do not fight for revenge. I fight for the honour of those who believed in a free Germany and were betrayed by criminals.&rdquo;
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; color: #000000;">
                &mdash; Richard Stern, letter from Camp Ritchie training depot (1942)
              </div>
            </div>
            <div style="font-family: 'Inter', sans-serif; font-size: 8.0pt; color: #000000; line-height: 1.2; margin-top: 1px;">
              <strong>Historical Significance:</strong> Proves German Jews were deeply integrated, patriotic citizens who actively protested Nazi injustice from the earliest days of the regime.
            </div>
          </div>
          <div style="border-top: 1px dashed #000000; padding-top: 2px; margin-top: 2px;">
            <div style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 800; color: #000000; margin-bottom: 1.5px; display: flex; justify-content: space-between;">
              <span><strong>PUPIL ANALYSIS:</strong> Why was Richard Stern wearing his Iron Cross an act of profound political defiance?</span>
              <span style="font-size: 7.2pt; font-weight: 800; text-transform: uppercase; color: #000000;">Ref: Enquiry 1 &bull; 2</span>
            </div>
            <div style="display: flex; flex-direction: column;">
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
            </div>
          </div>
        </div>

        <!-- Case Study 2: Heinz Salvator Kounio (Thessaloniki, Greece) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 3.5px 6px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; flex: 1;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #000000; padding-bottom: 1.5px; margin-bottom: 2px;">
              <span style="font-family: 'Inter', sans-serif; font-size: 8.6pt; font-weight: 900; color: #000000; text-transform: uppercase;">
                Case Study 2: Heinz Salvator Kounio &bull; Thessaloniki, Greece
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1.5px 5.5px; border-radius: 2px; text-transform: uppercase;">
                Sephardic Greek Jewry
              </span>
            </div>
            <p style="font-family: 'Georgia', serif; font-size: 8.5pt; line-height: 1.26; color: #000000; margin: 0 0 2px 0;">
              Born in 1927 in Thessaloniki, Greece—the historic heart of Sephardic Jewry where over 50,000 people spoke Ladino (Judeo-Spanish). In March 1943, Nazi forces enclosed the community in the Baron Hirsch ghetto before deporting 45,000 people in 19 transports to Auschwitz-Birkenau. Over 96% were murdered. 15-year-old Heinz survived on the selection ramp because he spoke fluent German and was ordered to interpret for arriving Greek transports.
            </p>
            <div style="border-left: 2.5px solid #000000; padding-left: 5px; margin: 2px 0; background: #fbfbfb;">
              <div style="font-family: 'Georgia', serif; font-size: 8.0pt; font-style: italic; color: #000000; line-height: 1.2;">
                &ldquo;In one hour, five people became two. My mother and sister disappeared into the smoke. I had to interpret orders for the SS.&rdquo;
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; color: #000000;">
                &mdash; Heinz Salvator Kounio, A Liter of Soup and 60 Grams of Bread
              </div>
            </div>
            <div style="font-family: 'Inter', sans-serif; font-size: 8.0pt; color: #000000; line-height: 1.2; margin-top: 1px;">
              <strong>Historical Significance:</strong> Demonstrates that the Holocaust was not confined to Eastern Europe; it destroyed ancient Mediterranean Sephardic communities thousands of miles away.
            </div>
          </div>
          <div style="border-top: 1px dashed #000000; padding-top: 2px; margin-top: 2px;">
            <div style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 800; color: #000000; margin-bottom: 1.5px; display: flex; justify-content: space-between;">
              <span><strong>PUPIL ANALYSIS:</strong> How does Heinz Kounio's experience prove the continent-wide reach of Nazi extermination?</span>
              <span style="font-size: 7.2pt; font-weight: 800; text-transform: uppercase; color: #000000;">Ref: Enquiry 1 &bull; 5</span>
            </div>
            <div style="display: flex; flex-direction: column;">
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
            </div>
          </div>
        </div>

        <!-- Case Study 3: Dawid Sierakowiak (Łódź Ghetto, Poland) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 3.5px 6px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; flex: 1;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #000000; padding-bottom: 1.5px; margin-bottom: 2px;">
              <span style="font-family: 'Inter', sans-serif; font-size: 8.6pt; font-weight: 900; color: #000000; text-transform: uppercase;">
                Case Study 3: Dawid Sierakowiak &bull; Łódź Ghetto, Poland
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1.5px 5.5px; border-radius: 2px; text-transform: uppercase;">
                Ghetto Youth & Diarist
              </span>
            </div>
            <p style="font-family: 'Georgia', serif; font-size: 8.5pt; line-height: 1.26; color: #000000; margin: 0 0 2px 0;">
              A 15-year-old high school student in Łódź, Poland, Dawid kept five detailed notebooks after 160,000 Jews were trapped behind barbed wire in 1940. He recorded the daily agony of starvation rations, slave labour in ghetto workshops, and the horrific September 1942 Gehsperre roundup when the SS deported 15,000 children and elderly people—including his mother—to Chełmno gas vans. Dawid died of starvation and tuberculosis in August 1943 at age 19.
            </p>
            <div style="border-left: 2.5px solid #000000; padding-left: 5px; margin: 2px 0; background: #fbfbfb;">
              <div style="font-family: 'Georgia', serif; font-size: 8.0pt; font-style: italic; color: #000000; line-height: 1.2;">
                &ldquo;Hunger, only hunger. My poor mother was taken away before my eyes. In the ghetto, tears do not flow; they freeze in your heart.&rdquo;
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; color: #000000;">
                &mdash; Dawid Sierakowiak, Łódź Ghetto Diary (September 1942)
              </div>
            </div>
            <div style="font-family: 'Inter', sans-serif; font-size: 8.0pt; color: #000000; line-height: 1.2; margin-top: 1px;">
              <strong>Historical Significance:</strong> Provides an authentic contemporary record of how enclosed ghettos were engineered as deliberate instruments of physical exhaustion and slow starvation.
            </div>
          </div>
          <div style="border-top: 1px dashed #000000; padding-top: 2px; margin-top: 2px;">
            <div style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 800; color: #000000; margin-bottom: 1.5px; display: flex; justify-content: space-between;">
              <span><strong>PUPIL ANALYSIS:</strong> How do Dawid's diary entries reveal the physical and emotional cruelty of the ghetto system?</span>
              <span style="font-size: 7.2pt; font-weight: 800; text-transform: uppercase; color: #000000;">Ref: Enquiry 3</span>
            </div>
            <div style="display: flex; flex-direction: column;">
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
            </div>
          </div>
        </div>

      </div>

      ${renderFooterStrip(pLeftNum, 'Six Lives &bull; Part I: Pre-War Integration, Sephardic Heritage &amp; Ghettoisation.', totalPages)}
    </div>
  </div>`;

  const rightHtml = `
  <!-- PAGE ${pRightNum}: CENTREFOLD PART II • RESISTANCE, WITNESS & RENEWAL -->
  <div class="page page-container recto-page" id="page-${pRightNum}" style="padding: 4mm 6mm;">
    <div class="page-body-full" style="display: flex; flex-direction: column; height: 100%; justify-content: space-between;">
      
      <!-- Top Spread Masthead -->
      <div style="border-bottom: 2px solid #000000; padding-bottom: 2px; margin-bottom: 2.5px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.5pt; font-weight: 800; text-transform: uppercase; color: #000000;">
            SIX LIVES: MICRO-HISTORIES OF THE HOLOCAUST (1933–1945)
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 8.5pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; background: #000000; color: #ffffff; padding: 1.5px 7px; border-radius: 2px;">
            CENTREFOLD SPREAD &bull; PART II
          </span>
        </div>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 12.0pt; color: #000000; margin: 1px 0 2px 0; font-weight: 900; line-height: 1.16;">
          Resistance, Moral Witness &amp; Rebuilding Life
        </h2>
        <div style="border: 1.2px solid #000000; border-radius: 2.5px; background: #ffffff; padding: 2.5px 6px; font-family: 'Inter', sans-serif; font-size: 8.2pt; color: #000000; line-height: 1.22;">
          <strong style="text-transform: uppercase;">Disciplinary Anchor:</strong> Across concentration camps, transit depots, and post-war Europe, individuals asserted agency: through clandestine armed revolt, unyielding moral witness, and the courageous determination to rebuild life.
        </div>
      </div>

      <!-- 3 Case Study Cards on Right Page -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-height: 0; gap: 4px; margin-bottom: 2px;">
        
        <!-- Case Study 4: Roza Robota (Ciechanów / Auschwitz-Birkenau) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 3.5px 6px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; flex: 1;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #000000; padding-bottom: 1.5px; margin-bottom: 2px;">
              <span style="font-family: 'Inter', sans-serif; font-size: 8.6pt; font-weight: 900; color: #000000; text-transform: uppercase;">
                Case Study 4: Roza Robota &bull; Ciechanów / Auschwitz-Birkenau
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1.5px 5.5px; border-radius: 2px; text-transform: uppercase;">
                Camp Armed Resistance
              </span>
            </div>
            <p style="font-family: 'Georgia', serif; font-size: 8.5pt; line-height: 1.26; color: #000000; margin: 0 0 2px 0;">
              Born in Ciechanów, Poland, 21-year-old Roza joined the underground youth movement before deportation to Auschwitz-Birkenau in 1942. Working under armed SS guard in the Weichsel-Union munitions factory, Roza and a clandestine network of young Jewish women smuggled gunpowder in matchboxes to the Sonderkommando prisoners. This explosive enabled them to blow up Crematorium IV on 7 October 1944. Tortured brutally by the Gestapo, Roza never betrayed her comrades.
            </p>
            <div style="border-left: 2.5px solid #000000; padding-left: 5px; margin: 2px 0; background: #fbfbfb;">
              <div style="font-family: 'Georgia', serif; font-size: 8.0pt; font-style: italic; color: #000000; line-height: 1.2;">
                &ldquo;Her final whispered message from the torture bunker was 'Hazak V'Amatz'—Be strong and of good courage.&rdquo;
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; color: #000000;">
                &mdash; Noah Zabludowicz, Auschwitz underground resistance record (January 1945)
              </div>
            </div>
            <div style="font-family: 'Inter', sans-serif; font-size: 8.0pt; color: #000000; line-height: 1.2; margin-top: 1px;">
              <strong>Historical Significance:</strong> Shatters the misconception of Jewish passivity, proving that prisoners organized clandestine armed sabotage inside the deadliest extermination camp on earth.
            </div>
          </div>
          <div style="border-top: 1px dashed #000000; padding-top: 2px; margin-top: 2px;">
            <div style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 800; color: #000000; margin-bottom: 1.5px; display: flex; justify-content: space-between;">
              <span><strong>PUPIL ANALYSIS:</strong> Why was Roza Robota's smuggling network inside Auschwitz an act of extraordinary courage?</span>
              <span style="font-size: 7.2pt; font-weight: 800; text-transform: uppercase; color: #000000;">Ref: Enquiry 5</span>
            </div>
            <div style="display: flex; flex-direction: column;">
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
            </div>
          </div>
        </div>

        <!-- Case Study 5: Etty Hillesum (Amsterdam & Westerbork Transit Camp) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 3.5px 6px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; flex: 1;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #000000; padding-bottom: 1.5px; margin-bottom: 2px;">
              <span style="font-family: 'Inter', sans-serif; font-size: 8.6pt; font-weight: 900; color: #000000; text-transform: uppercase;">
                Case Study 5: Etty Hillesum &bull; Amsterdam / Westerbork
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1.5px 5.5px; border-radius: 2px; text-transform: uppercase;">
                Spiritual Witness
              </span>
            </div>
            <p style="font-family: 'Georgia', serif; font-size: 8.5pt; line-height: 1.26; color: #000000; margin: 0 0 2px 0;">
              A 27-year-old Dutch Jewish writer and intellectual in occupied Amsterdam, Etty volunteered at Westerbork transit camp to support families facing cattle-truck deportation to the East. Her diaries document the weekly terror of deportation lists while maintaining an unshakeable belief in human decency. On 7 September 1943, Etty and her family were deported to Auschwitz; she threw a postcard from the train window reading: 'We left the camp singing.' She was murdered on 30 November 1943.
            </p>
            <div style="border-left: 2.5px solid #000000; padding-left: 5px; margin: 2px 0; background: #fbfbfb;">
              <div style="font-family: 'Georgia', serif; font-size: 8.0pt; font-style: italic; color: #000000; line-height: 1.2;">
                &ldquo;I want to be the thinking heart of the barracks. If nothing else is saved from this time, let it be that we did not lose our humanity.&rdquo;
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; color: #000000;">
                &mdash; Etty Hillesum, Westerbork Letters (August 1943)
              </div>
            </div>
            <div style="font-family: 'Inter', sans-serif; font-size: 8.0pt; color: #000000; line-height: 1.2; margin-top: 1px;">
              <strong>Historical Significance:</strong> Exemplifies spiritual and intellectual resistance—asserting human dignity, compassion, and moral witness against the dehumanising machinery of genocide.
            </div>
          </div>
          <div style="border-top: 1px dashed #000000; padding-top: 2px; margin-top: 2px;">
            <div style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 800; color: #000000; margin-bottom: 1.5px; display: flex; justify-content: space-between;">
              <span><strong>PUPIL ANALYSIS:</strong> How did Etty Hillesum use writing and compassion to resist Nazi attempts to dehumanise victims?</span>
              <span style="font-size: 7.2pt; font-weight: 800; text-transform: uppercase; color: #000000;">Ref: Enquiry 3 &bull; 5</span>
            </div>
            <div style="display: flex; flex-direction: column;">
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
            </div>
          </div>
        </div>

        <!-- Case Study 6: Arek Hersh MBE (Sieradz, Poland & Windermere, UK) -->
        <div style="border: 1.2px solid #000000; border-radius: 3px; padding: 3.5px 6px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; flex: 1;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #000000; padding-bottom: 1.5px; margin-bottom: 2px;">
              <span style="font-family: 'Inter', sans-serif; font-size: 8.6pt; font-weight: 900; color: #000000; text-transform: uppercase;">
                Case Study 6: Arek Hersh MBE &bull; Poland & The Windermere Children
              </span>
              <span style="font-family: 'Inter', sans-serif; font-size: 7.4pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1.5px 5.5px; border-radius: 2px; text-transform: uppercase;">
                Child Survivor & Renewal
              </span>
            </div>
            <p style="font-family: 'Georgia', serif; font-size: 8.5pt; line-height: 1.26; color: #000000; margin: 0 0 2px 0;">
              Born in Sieradz, Poland in 1928, Arek was 11 when war broke out. He survived the Łódź Ghetto, slave labour camps, Auschwitz-Birkenau (surviving selection by pretending to be an adult tailor), and the freezing death march to Theresienstadt. Liberated by the Red Army in May 1945 weighing just four stone, Arek was one of 300 child survivors flown to the British Lake District (The Windermere Children) to heal and rebuild life. He settled in Leeds, dedicating his life to education.
            </p>
            <div style="border-left: 2.5px solid #000000; padding-left: 5px; margin: 2px 0; background: #fbfbfb;">
              <div style="font-family: 'Georgia', serif; font-size: 8.0pt; font-style: italic; color: #000000; line-height: 1.2;">
                &ldquo;When we landed in England and saw the mountains of Windermere, we felt we had entered paradise. We learned to laugh again, to trust human beings.&rdquo;
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; color: #000000;">
                &mdash; Arek Hersh MBE, A Detail of History (Windermere survivor testimony)
              </div>
            </div>
            <div style="font-family: 'Inter', sans-serif; font-size: 8.0pt; color: #000000; line-height: 1.2; margin-top: 1px;">
              <strong>Historical Significance:</strong> Connects Holocaust survival directly to Britain’s post-war humanitarian response, child trauma rehabilitation, and lifelong educational testimony.
            </div>
          </div>
          <div style="border-top: 1px dashed #000000; padding-top: 2px; margin-top: 2px;">
            <div style="font-family: 'Inter', sans-serif; font-size: 8.2pt; font-weight: 800; color: #000000; margin-bottom: 1.5px; display: flex; justify-content: space-between;">
              <span><strong>PUPIL ANALYSIS:</strong> What challenges did child survivors face after liberation when attempting to rebuild their lives?</span>
              <span style="font-size: 7.2pt; font-weight: 800; text-transform: uppercase; color: #000000;">Ref: Enquiry 7</span>
            </div>
            <div style="display: flex; flex-direction: column;">
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
              <div style="height: 8.0mm; border-bottom: 0.85px solid #000000; box-sizing: border-box;"></div>
            </div>
          </div>
        </div>

      </div>

      ${renderFooterStrip(pRightNum, 'Six Lives &bull; Part II: Camp Revolt, Moral Witness &amp; The Windermere Children.', totalPages)}
    </div>
  </div>`;

  return leftHtml + '\n' + rightHtml;
}

function renderCoverPage() {
  const heroImageBase64 = getBase64Image('/images/shoah_cover.jpg');

  return `
  <!-- PAGE 1: MASTER FRONT COVER -->
  <div class="page page-container verso-page" id="page-1" style="padding: 4mm 6mm; background: #ffffff;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
      
      <!-- Top Masthead Strip -->
      <div style="border-bottom: 2.5px solid #0f172a; padding-bottom: 3px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <div style="font-family: 'Inter', sans-serif; font-size: 9.0pt; font-weight: 900; color: #0f172a; letter-spacing: 1.2px; text-transform: uppercase;" data-department-name="The History Revision Hub">
            <span class="school-brand-target">The History Revision Hub</span> &bull; Key Stage 3 Disciplinary Curriculum
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.6px; margin-top: 1px;">
            Year 9 Master Classroom Workbook &bull; 20-Page Saddle-Stitch Edition
          </div>
        </div>
        <div style="display: flex; gap: 4px; align-items: center;">
          <span style="background: #0f172a; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 8pt; font-weight: 900; padding: 2.5px 8px; border-radius: 2px; letter-spacing: 0.5px;">
            UNIT 8
          </span>
          <span style="background: #991b1b; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 8pt; font-weight: 900; padding: 2.5px 8px; border-radius: 2px; letter-spacing: 0.5px;">
            1933–1948
          </span>
        </div>
      </div>

      <!-- Pupil Details Strip -->
      <div style="border: 1.5px solid #0f172a; border-radius: 3px; padding: 4.5px 12px; background: #ffffff; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 14px; align-items: center; margin: 3px 0 4px 0;">
        <div style="display: flex; align-items: baseline;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 8.5pt; color: #0f172a; text-transform: uppercase; margin-right: 8px;">Pupil Name:</strong>
          <div style="flex: 1; border-bottom: 1.5px solid #0f172a; height: 14px;"></div>
        </div>
        <div style="display: flex; align-items: baseline;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 8.5pt; color: #0f172a; text-transform: uppercase; margin-right: 8px;">Class:</strong>
          <div style="flex: 1; border-bottom: 1.5px solid #0f172a; height: 14px;"></div>
        </div>
        <div style="display: flex; align-items: baseline;">
          <strong style="font-family: 'Inter', sans-serif; font-size: 8.5pt; color: #0f172a; text-transform: uppercase; margin-right: 8px;">Teacher:</strong>
          <div style="flex: 1; border-bottom: 1.5px solid #0f172a; height: 14px;"></div>
        </div>
      </div>

      <!-- Striking Monumental Title Block -->
      <div style="text-align: center; border: 1.5px solid #0f172a; border-radius: 3px; background: #fafaf9; padding: 6px 10px; margin-bottom: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 2px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; color: #78350f;">
            HISTORICAL DEPTH STUDY &bull; MODERN EUROPEAN HISTORY
          </span>
        </div>
        <h1 style="font-family: 'Cinzel', serif; font-size: 35pt; font-weight: 900; color: #090d16; margin: 1px 0 2px 0; line-height: 1.0; letter-spacing: 3.5px; text-transform: uppercase;">
          THE SHOAH
        </h1>
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin: 2px 0;">
          <div style="height: 1px; width: 36px; background: #b45309;"></div>
          <span style="font-family: 'Times New Roman', serif; font-size: 13.0pt; letter-spacing: 2px; color: #991b1b; font-weight: 700;">
            הַשּׁוֹאָה &bull; THE CATASTROPHE
          </span>
          <div style="height: 1px; width: 36px; background: #b45309;"></div>
        </div>
        <div style="font-family: 'Playfair Display', serif; font-size: 12.0pt; font-style: italic; font-weight: 700; color: #1e3a8a; margin-top: 1px; letter-spacing: 0.3px;">
          Persecution, Resistance, and the Memory of the Holocaust (1933–1948)
        </div>
      </div>

      <!-- Prominent Enquiry Question Placement -->
      <div style="border: 1.5px solid #0f172a; border-left: 5px solid #991b1b; border-radius: 3px; padding: 4px 10px; background: #fdfbf7; margin-bottom: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 900; color: #991b1b; text-transform: uppercase; letter-spacing: 0.6px;">
            OVERARCHING HISTORICAL ENQUIRY QUESTION
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 800; color: #475569; text-transform: uppercase;">
            HET &bull; UCL PEDAGOGICAL STANDARD
          </span>
        </div>
        <div style="font-family: 'Playfair Display', serif; font-size: 10.6pt; font-weight: 900; color: #090d16; line-height: 1.22;">
          "How and why did civilized modern society collapse into state-sponsored industrial genocide, and what was permanently lost?"
        </div>
      </div>

      <!-- Hero Primary Archival Plate (Full-Bleed 100% Width, Zero Dark Sidebars) -->
      <div style="border: 1.8px solid #0f172a; border-radius: 4px; overflow: hidden; background: #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.08); margin-bottom: 4px;">
        <div style="height: 70mm; width: 100%; overflow: hidden; background: #0f172a; display: flex; align-items: center; justify-content: center;">
          ${
            heroImageBase64
              ? `<img src="${heroImageBase64}" style="height: 100%; width: auto; max-width: 100%; object-fit: contain; display: block; box-shadow: 0 2px 10px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12);" alt="The Pitel Family in Parczew, Poland (1938)" />`
              : `<div style="font-family: 'Inter', sans-serif; font-size: 11pt; color: #94a3b8; font-weight: bold;">[Primary Archival Plate: The Pitel Family, Poland 1938]</div>`
          }
        </div>
        <div style="padding: 3.5px 8px; background: #0f172a; color: #ffffff; display: flex; justify-content: space-between; align-items: center; font-size: 7.0pt; font-family: 'Inter', sans-serif;">
          <span><strong style="color: #fde047;">Archival Plate:</strong> The Pitel Family of Parczew, Poland (1938) &bull; 26 members across 4 generations; 25 murdered at Treblinka (1943)</span>
          <span style="color: #93c5fd; font-weight: 700; white-space: nowrap;">YAD VASHEM PHOTO ARCHIVE &bull; UCL CENTRE FOR HOLOCAUST EDUCATION</span>
        </div>
      </div>

      <!-- Unit Narrative Overview Blurb (Underneath Archival Photograph) -->
      <div style="border: 1.4px solid #0f172a; border-left: 5px solid #1e3a8a; border-radius: 3px; background: #fdfbf7; padding: 6px 10px; margin-bottom: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; text-transform: uppercase; color: #0f172a; letter-spacing: 0.8px;">
            HISTORICAL NARRATIVE OVERVIEW &bull; 1933–1948
          </span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.2pt; font-weight: 800; color: #991b1b; text-transform: uppercase; letter-spacing: 0.5px;">
            CORE DISCIPLINARY SYNOPSIS
          </span>
        </div>
        <p style="font-family: 'Georgia', serif; font-size: 9.2pt; color: #0f172a; line-height: 1.42; margin: 0; text-align: justify;">
          Before the catastrophe of the Second World War, over nine million Jewish people inhabited Europe in vibrant, diverse communities—from traditional Yiddish shtetls in Poland to decorated patriotic veterans in Berlin. This unit investigates how the Nazi regime weaponised racial antisemitism to strip German Jews of civil rights, before exploiting total war to engineer the continent-wide industrial murder of six million human beings. Across seven historical enquiries, pupils trace the terror of the ghettos, the mass shootings of the Einsatzgruppen, the death camp factories, and the defiant courage of armed resistance, righteous rescue, and the post-war struggle for justice.
        </p>
      </div>

      <!-- 4 Core Disciplinary Enquiry Strands (Analytical Question Grid) -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 5px; margin-bottom: 4px;">
        <div style="border: 1.2px solid #0f172a; border-radius: 3px; padding: 5px 6px; background: #ffffff; display: flex; flex-direction: column;">
          <div style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 800; color: #0f172a; line-height: 1.22; border-bottom: 1.2px solid #0f172a; padding-bottom: 3px; margin-bottom: 4px; min-height: 28px; display: flex; align-items: center;">
            1. Who Were Europe's Jews Before 1939?
          </div>
          <ul style="margin: 0; padding-left: 12px; font-family: 'Georgia', serif; font-size: 7.2pt; color: #1e293b; line-height: 1.24;">
            <li>9.5M diverse European Jews</li>
            <li>Yiddishland, culture &amp; shtetls</li>
            <li>100,000 patriotic WWI veterans</li>
          </ul>
        </div>
        <div style="border: 1.2px solid #0f172a; border-radius: 3px; padding: 5px 6px; background: #ffffff; display: flex; flex-direction: column;">
          <div style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 800; color: #0f172a; line-height: 1.22; border-bottom: 1.2px solid #0f172a; padding-bottom: 3px; margin-bottom: 4px; min-height: 28px; display: flex; align-items: center;">
            2. How Did the Nazi State Strip Civil Rights?
          </div>
          <ul style="margin: 0; padding-left: 12px; font-family: 'Georgia', serif; font-size: 7.2pt; color: #1e293b; line-height: 1.24;">
            <li>1935 Nuremberg Race Laws</li>
            <li>400+ anti-Jewish legal decrees</li>
            <li>November 1938 Kristallnacht terror</li>
          </ul>
        </div>
        <div style="border: 1.2px solid #0f172a; border-radius: 3px; padding: 5px 6px; background: #ffffff; display: flex; flex-direction: column;">
          <div style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 800; color: #0f172a; line-height: 1.22; border-bottom: 1.2px solid #0f172a; padding-bottom: 3px; margin-bottom: 4px; min-height: 28px; display: flex; align-items: center;">
            3. Why Did Wartime Persecution Turn to Genocide?
          </div>
          <ul style="margin: 0; padding-left: 12px; font-family: 'Georgia', serif; font-size: 7.2pt; color: #1e293b; line-height: 1.24;">
            <li>1941 Holocaust by Bullets</li>
            <li>1942 Wannsee coordination</li>
            <li>Six dedicated death camps</li>
          </ul>
        </div>
        <div style="border: 1.2px solid #0f172a; border-radius: 3px; padding: 5px 6px; background: #ffffff; display: flex; flex-direction: column;">
          <div style="font-family: 'Inter', sans-serif; font-size: 7.6pt; font-weight: 800; color: #0f172a; line-height: 1.22; border-bottom: 1.2px solid #0f172a; padding-bottom: 3px; margin-bottom: 4px; min-height: 28px; display: flex; align-items: center;">
            4. How Did People Resist and Seek Justice?
          </div>
          <ul style="margin: 0; padding-left: 12px; font-family: 'Georgia', serif; font-size: 7.2pt; color: #1e293b; line-height: 1.24;">
            <li>Warsaw Ghetto armed resistance</li>
            <li>DP camps &amp; SS Exodus struggle</li>
            <li>Nuremberg &amp; UN Genocide Law</li>
          </ul>
        </div>
      </div>

      <!-- Running Cover Footer -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.2px solid #0f172a; padding-top: 3px; font-family: 'Inter', sans-serif; font-size: 7.0pt; color: #475569;">
        <span>The History Revision Hub &bull; Master Classroom Publication &bull; 20-Page Saddle-Stitch Format</span>
        <span>Institutional Neutrality &bull; Reprographic Edition 2026.1</span>
      </div>

    </div>
  </div>`;
}

function renderBackCover() {
  const shoahTableRowsHtml = enquiryConfigs.map((enq) => {
    const url = `https://the-history-revision-hub.netlify.app/?unit=the_shoah&lesson=${enq.lessonNum}&quiz=true`;
    const qrSvg = generateQrSvg(url);
      return `
        <tr style="border-bottom: 1.5px solid #000000;">
          <!-- Column 1: HW Dates & QR Code (Medicine Standard 21mm) -->
          <td style="padding: 2px 2px 2px 2px; border-right: 1.5px solid #000000; vertical-align: top; width: 21mm;">
            <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; height: 100%; min-height: 25mm; box-sizing: border-box;">
              <div style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 900; color: #000000; white-space: nowrap; margin-top: 1px;">
                SET: <span style="display: inline-block; border-bottom: 1.4px solid #000000; width: 11mm;">&nbsp;</span>
              </div>
              <div style="width: 14mm; height: 14mm; margin: auto 0; display: flex; align-items: center; justify-content: center;">
                ${qrSvg}
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 6.8pt; font-weight: 900; color: #000000; white-space: nowrap; margin-bottom: 1px;">
                DUE: <span style="display: inline-block; border-bottom: 1.4px solid #000000; width: 11mm;">&nbsp;</span>
              </div>
            </div>
          </td>

          <!-- Column 2: Enquiry & Homework Passport -->
          <td style="padding: 3px 6px; border-right: 1.5px solid #000000; vertical-align: top;">
            <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; box-sizing: border-box;">
              <div>
                <div style="font-weight: 900; color: #000000; font-size: 10.2pt; line-height: 1.22;">
                  Enquiry ${enq.lessonNum}: ${enq.title}
                </div>
                <div style="font-size: 8.0pt; color: #1e293b; font-style: italic; margin-top: 2px; line-height: 1.25;">
                  &ldquo;${enq.enquiryQuestion}&rdquo;
                </div>
              </div>

              <!-- Homework Passport Strip (Clean Borderless Format) -->
              <div style="padding-top: 2px; margin-top: 2px;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 7.2pt; font-family: 'Inter', sans-serif; font-weight: 800; color: #000000; white-space: nowrap;">
                  <span><span style="font-size: 8.0pt;">&#9633;</span> <strong>Read Aloud / Audio Tracked</strong></span>
                  <span style="margin-left: 6px;"><strong>5-Q Online Quiz:</strong> <span style="display: inline-block; border-bottom: 1.4px solid #000000; width: 10mm; margin: 0 2px;">&nbsp;</span><strong style="font-size: 8.6pt;">/ 5</strong></span>
                </div>
                <div style="display: flex; align-items: flex-end; font-size: 7.2pt; font-family: 'Inter', sans-serif; font-weight: 900; color: #000000; margin-top: 1px;">
                  <span style="white-space: nowrap; margin-right: 6px;">Parent / Carer Signature:</span>
                  <div style="flex: 1; border-bottom: 1.4px solid #000000; height: 13px;"></div>
                </div>
              </div>
            </div>
          </td>

          <!-- Column 3: In-Class Do Now (Recall) -->
          <td style="padding: 2px 2px; border-right: 1.5px solid #000000; text-align: center; vertical-align: middle; width: 18mm; white-space: nowrap;">
            <span style="font-size: 9.6pt; font-weight: 900;"><span style="display: inline-block; border-bottom: 1.5px solid #000; width: 10mm; margin-right: 2px;">&nbsp;</span><strong>/ 5</strong></span>
          </td>

          <!-- Column 4: KS3 Level / Effort (Open Cell for Teacher Hand-Marking) -->
          <td style="padding: 4px 4px; border-right: 1.5px solid #000000; text-align: center; vertical-align: middle; width: 22mm;">
            &nbsp;
          </td>

          <!-- Column 5: Spellings / Feedback (Clean Writing Lines for the Teacher) -->
          <td style="padding: 3px 5px; vertical-align: middle; width: 34mm;">
            <div style="display: flex; flex-direction: column; justify-content: space-between; height: 23mm; box-sizing: border-box; padding: 1px 0;">
              <div style="border-bottom: 1px dashed #cbd5e1; height: 6.5mm;"></div>
              <div style="border-bottom: 1px dashed #cbd5e1; height: 6.5mm;"></div>
              <div style="border-bottom: 1px dashed #cbd5e1; height: 6.5mm;"></div>
            </div>
          </td>
        </tr>
      `;
    })
    .join('\n');

  return `
  <!-- PAGE 20: OUTSIDE BACK COVER (COLOR COVERS) -->
  <div class="page page-container recto-page" id="page-20" style="padding: 4mm 6mm; background: #ffffff;">
    <div class="page-body-full" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; box-sizing: border-box;">
      
      <!-- Top Departmental Header Bar -->
      <div style="border-bottom: 2px solid #000000; padding-bottom: 3px; margin-bottom: 3px;" data-department-name="The History Department">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span class="school-brand-target" style="font-family: 'Inter', sans-serif; font-size: 11pt; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase;">The History Department</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #000000;">
            Key Stage 3 Progress &amp; Homework Passport
          </span>
        </div>
      </div>

      <!-- Pupil Information & Target Level Strip -->
      <div style="border: 1.5px solid #000000; border-radius: 4px; padding: 4px 10px; background: #ffffff; display: grid; grid-template-columns: 2.2fr 1fr 1.6fr; gap: 12px; align-items: center; margin-bottom: 3px;">
        <div style="display: flex; align-items: baseline; gap: 6px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 900; text-transform: uppercase;">Pupil Name:</span>
          <div style="border-bottom: 1.4px solid #000000; flex: 1; height: 14px;"></div>
        </div>
        <div style="display: flex; align-items: baseline; gap: 6px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 8.0pt; font-weight: 900; text-transform: uppercase;">Class:</span>
          <div style="border-bottom: 1.4px solid #000000; flex: 1; height: 14px;"></div>
        </div>
        <div style="display: flex; align-items: baseline; gap: 6px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 7.8pt; font-weight: 900; text-transform: uppercase;">Target KS3 Level:</span>
          <div style="border-bottom: 1.4px solid #000000; flex: 1; height: 14px;"></div>
        </div>
      </div>

      <!-- KS3 History Progress Pathways & Descriptors (Universal KS3 Years 7–9 Standard) -->
      <div style="border: 1.5px solid #000000; border-radius: 4px; padding: 5.5px 6px; background: #ffffff; margin-bottom: 6px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.2px solid #000000; background: #ffffff; padding: 2.5px 6px; margin-bottom: 3px;">
          <strong style="font-size: 7.4pt; text-transform: uppercase; letter-spacing: 0.5px; color: #000000;">
            Key Stage 3 History Assessment Pathways &bull; Level Descriptors &amp; Criteria
          </strong>
          <span style="font-size: 6.8pt; font-weight: 900; background: #000000; color: #ffffff; padding: 1px 6px; border-radius: 2px; text-transform: uppercase;">
            Years 7–9 Standards
          </span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; font-family: 'Inter', sans-serif; font-size: 6.6pt; line-height: 1.25;">
          
          <!-- Emerging (1–2) -->
          <div style="border: 1px solid #000000; border-radius: 3px; padding: 4px 5px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-weight: 900; font-size: 6.8pt; text-transform: uppercase; color: #000000; border-bottom: 1px solid #000000; padding-bottom: 1.5px; margin-bottom: 2.5px;">
                Emerging (1–2)
              </div>
              Recalls key facts, dates, and people; describes what happened using simple sentences or writing frames.
            </div>
            <div style="margin-top: 3px; font-size: 6.1pt; font-style: italic; border-top: 1px dashed #000000; padding-top: 2px; color: #000000;">
              <strong style="color: #000000; font-style: normal;">Recall &amp; Retention:</strong> Remembers basic names, dates, and keywords when supported with prompts.
            </div>
          </div>

          <!-- Emerging+ (3) -->
          <div style="border: 1px solid #000000; border-radius: 3px; padding: 4px 5px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-weight: 900; font-size: 6.8pt; text-transform: uppercase; color: #000000; border-bottom: 1px solid #000000; padding-bottom: 1.5px; margin-bottom: 2.5px;">
                Emerging+ (3)
              </div>
              Explains reasons why events happened; begins to describe causes and consequences using clear historical examples.
            </div>
            <div style="margin-top: 3px; font-size: 6.1pt; font-style: italic; border-top: 1px dashed #000000; padding-top: 2px; color: #000000;">
              <strong style="color: #000000; font-style: normal;">Recall &amp; Retention:</strong> Remembers why events happened; explains causes and consequences using clear examples.
            </div>
          </div>

          <!-- Expected (4–5) -->
          <div style="border: 1px solid #000000; border-radius: 3px; padding: 4px 5px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-weight: 900; font-size: 6.8pt; text-transform: uppercase; color: #000000; border-bottom: 1px solid #000000; padding-bottom: 1.5px; margin-bottom: 2.5px;">
                Expected (4–5)
              </div>
              Explains multiple causes and consequences in clear paragraphs using precise historical vocabulary.
            </div>
            <div style="margin-top: 3px; font-size: 6.1pt; font-style: italic; border-top: 1px dashed #000000; padding-top: 2px; color: #000000;">
              <strong style="color: #000000; font-style: normal;">Recall &amp; Retention:</strong> Securely recalls vocabulary, dates, and multi-step causes from previous weeks.
            </div>
          </div>

          <!-- Expected+ (6–7) -->
          <div style="border: 1px solid #000000; border-radius: 3px; padding: 4px 5px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-weight: 900; font-size: 6.8pt; text-transform: uppercase; color: #000000; border-bottom: 1px solid #000000; padding-bottom: 1.5px; margin-bottom: 2.5px;">
                Expected+ (6–7)
              </div>
              Weighs up different causes and historical viewpoints; explains why certain factors mattered more using evidence.
            </div>
            <div style="margin-top: 3px; font-size: 6.1pt; font-style: italic; border-top: 1px dashed #000000; padding-top: 2px; color: #000000;">
              <strong style="color: #000000; font-style: normal;">Recall &amp; Retention:</strong> Independently retrieves detailed evidence and connects factors across the whole unit.
            </div>
          </div>

          <!-- Greater Depth (8–9) -->
          <div style="border: 1px solid #000000; border-radius: 3px; padding: 4px 5px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-weight: 900; font-size: 6.8pt; text-transform: uppercase; color: #000000; border-bottom: 1px solid #000000; padding-bottom: 1.5px; margin-bottom: 2.5px;">
                Greater Depth (8–9)
              </div>
              Reaches a convincing, well-argued overall judgement; explains how long-term causes and turning points connect.
            </div>
            <div style="margin-top: 3px; font-size: 6.1pt; font-style: italic; border-top: 1px dashed #000000; padding-top: 2px; color: #000000;">
              <strong style="color: #000000; font-style: normal;">Recall &amp; Retention:</strong> Effortlessly retrieves long-term schema; connects prior units and eras to present topics.
            </div>
          </div>

        </div>
      </div>

      <!-- Main Assessment Ledger Table (Medicine Style, Zero Mark Tallying) -->
      <div style="border: 1.5px solid #000000; border-radius: 4px; overflow: hidden; margin-bottom: 3px; flex: 1; display: flex; flex-direction: column;">
        <table style="width: 100%; height: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif; flex: 1;">
          <thead>
            <tr style="border-bottom: 1.5px solid #000000; background: #f8fafc; height: 7.5mm;">
              <th style="padding: 2px 2px; width: 21mm; text-align: center; font-size: 7.4pt; font-weight: 900; text-transform: uppercase; border-right: 1.5px solid #000000;">
                HW &amp; QR
              </th>
              <th style="padding: 2px 6px; text-align: left; font-size: 7.6pt; font-weight: 900; text-transform: uppercase; border-right: 1.5px solid #000000;">
                Enquiry / Disciplinary Inquiry Focus
              </th>
              <th style="padding: 2px 2px; width: 18mm; text-align: center; font-size: 7.4pt; font-weight: 900; text-transform: uppercase; border-right: 1.5px solid #000000;">
                Do Now (/5)
              </th>
              <th style="padding: 2px 2px; width: 22mm; text-align: center; font-size: 7.4pt; font-weight: 900; text-transform: uppercase; border-right: 1.5px solid #000000;">
                KS3 Level / Effort
              </th>
              <th style="padding: 2px 5px; width: 34mm; text-align: left; font-size: 7.4pt; font-weight: 900; text-transform: uppercase;">
                Spellings / Feedback
              </th>
            </tr>
          </thead>
          <tbody>
            ${shoahTableRowsHtml}
            <!-- Formative Unit Sign-off Row (Zero Mark Tallying) -->
            <tr style="background: #f8fafc; border-top: 1.8px solid #000000;">
              <td colspan="2" style="padding: 4px 8px; border-right: 1.5px solid #000000; font-size: 7.8pt; font-weight: 900; text-transform: uppercase;">
                Unit Overall Outcome: &nbsp;&nbsp;
                <span style="font-weight: 700; color: #475569; font-size: 7.2pt;">[ Emerging &bull; Emerging+ &bull; Expected &bull; Expected+ &bull; Greater Depth ]</span>
              </td>
              <td colspan="3" style="padding: 4px 8px; font-size: 7.4pt; font-weight: 800; color: #000000;">
                Teacher Signature: <span style="display: inline-block; border-bottom: 1.4px solid #000000; width: 30mm; margin-right: 8px;">&nbsp;</span> 
                Date: <span style="display: inline-block; border-bottom: 1.4px solid #000000; width: 18mm;">&nbsp;</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Reprographics Running Footer -->
      <div style="font-family: 'Inter', sans-serif; font-size: 6.8pt; color: #475569; display: flex; justify-content: space-between; border-top: 1.2px solid #000000; padding-top: 2px;">
        <span>The History Revision Hub &bull; Key Stage 3 Master Curriculum Series &bull; Retain for Parent Consultations</span>
        <span>Page 20 / 20</span>
      </div>

    </div>
  </div>`;
}

// ============================================================================
// MASTER COMPILER FUNCTION: 20-PAGE SADDLE-STITCH WORKBOOK
// ============================================================================
async function compileTheShoahWorkbook() {
  console.log('🚀 Compiling 20-Page Gold Standard Workbook for [the_shoah]...');

  let pagesHtml = '';

  // Page 1: Color Master Cover
  pagesHtml += renderCoverPage() + '\n';

  // Enquiry 1 (Pages 2 & 3)
  pagesHtml += renderSpinePage(enquiryConfigs[0], 2, 20) + '\n';
  pagesHtml += renderRightPage(enquiryConfigs[0], 3, 20) + '\n';

  // Enquiry 2 (Pages 4 & 5)
  pagesHtml += renderSpinePage(enquiryConfigs[1], 4, 20) + '\n';
  pagesHtml += renderRightPage(enquiryConfigs[1], 5, 20) + '\n';

  // Enquiry 3 (Pages 6 & 7)
  pagesHtml += renderSpinePage(enquiryConfigs[2], 6, 20) + '\n';
  pagesHtml += renderRightPage(enquiryConfigs[2], 7, 20) + '\n';

  // Enquiry 4 (Pages 8 & 9)
  pagesHtml += renderSpinePage(enquiryConfigs[3], 8, 20) + '\n';
  pagesHtml += renderRightPage(enquiryConfigs[3], 9, 20) + '\n';

  // Pages 10 & 11: Centrefold Panoramic Living Timeline
  pagesHtml += renderCentrefold(10, 11, 20) + '\n';

  // Enquiry 5 (Pages 12 & 13)
  pagesHtml += renderSpinePage(enquiryConfigs[4], 12, 20) + '\n';
  pagesHtml += renderRightPage(enquiryConfigs[4], 13, 20) + '\n';

  // Enquiry 6 (Pages 14 & 15)
  pagesHtml += renderSpinePage(enquiryConfigs[5], 14, 20) + '\n';
  pagesHtml += renderRightPage(enquiryConfigs[5], 15, 20) + '\n';

  // Enquiry 7 (Pages 16 & 17)
  pagesHtml += renderSpinePage(enquiryConfigs[6], 16, 20) + '\n';
  pagesHtml += renderRightPage(enquiryConfigs[6], 17, 20) + '\n';

  // Page 18: Notes & Extended Writing Canvas (Exercise Book Standard - Zero Model Answers)
  pagesHtml += renderNotesPage(18, 'Evidence, Chronology & Contextual Analysis', 20) + '\n';

  // Page 19: Notes & Extended Writing Canvas (Exercise Book Standard - Zero Model Answers)
  pagesHtml += renderNotesPage(19, 'Historical Judgment, Significance & Disciplinary Synthesis', 20) + '\n';

  // Page 20: Outside Back Cover
  pagesHtml += renderBackCover() + '\n';

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Shoah: 1933–1945 • Gold Standard Pupil Workbook (20-Page Saddle-Stitch Edition)</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Georgia:ital@0;1&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      background: #e2e8f0;
      color: #000000;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .page-container {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      overflow: hidden;
      margin: 10mm auto;
      background: #ffffff;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      break-after: page;
      box-sizing: border-box;
    }
    .verso-page {
      border-left: 1.5px solid #000000;
    }
    .recto-page {
      border-right: 1.5px solid #000000;
    }
    .page-body-full {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 0;
    }
    .task-line {
      height: 8.0mm;
      border-bottom: 0.85px solid #000000;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
    }
    .spine-stage-block {
      display: flex;
      flex-direction: column;
      width: 100%;
      border: none !important;
      background: transparent !important;
      box-sizing: border-box;
    }
    .evaluative-stage-block {
      border: none !important;
    }
    .stage-writing-canvas {
      width: 100%;
      display: flex;
      flex-direction: column;
      background: transparent;
      box-sizing: border-box;
      padding: 0 !important;
      margin: 0 !important;
    }
    .evaluative-banner {
      background: #000000 !important;
      color: #ffffff !important;
    }
    .cornell-note-line {
      height: 8.0mm;
      border-bottom: 0.85px solid #000000;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
    }
    .ruled-line {
      height: 7.8mm;
      border-bottom: 0.9px solid #000000 !important;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
    }
.ruled-lines-block {
      display: flex;
      flex-direction: column;
      gap: 0;
      margin: 1px 0;
      border-top: 1.2px solid #000000;
    }
    .page-footer-strip {
      border-top: 1.2px solid #000000;
      padding-top: 2px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Inter', sans-serif;
      font-size: 7.0pt;
      color: #000000;
      font-weight: 700;
      height: 14px;
    }
    .footer-quip {
      font-style: italic;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .footer-page-num {
      font-weight: 900;
      flex-shrink: 0;
    }
    @media print {
      body {
        background: transparent !important;
      }
      .page-container {
        margin: 0 !important;
        box-shadow: none !important;
        border: none !important;
        page-break-after: always !important;
        break-after: page !important;
      }
    }
  </style>
</head>
<body>
${pagesHtml}
</body>
</html>`;

  // Output paths
  const publicHtmlPath = path.join(ROOT_DIR, 'public', 'units', 'the_shoah', 'pupil_workbook.html');
  const unitsHtmlPath = path.join(ROOT_DIR, 'units', 'the_shoah', 'pupil_workbook.html');
  const pdfOutPath = path.join(ROOT_DIR, 'public', 'pdfs', 'the_shoah_pupil_workbook.pdf');

  fs.writeFileSync(publicHtmlPath, fullHtml, 'utf8');
  if (fs.existsSync(path.dirname(unitsHtmlPath))) {
    fs.writeFileSync(unitsHtmlPath, fullHtml, 'utf8');
  }
  console.log(`✅ Saved 20-Page Gold Standard Workbook HTML to: ${publicHtmlPath}`);

  // Render PDF using Puppeteer
  try {
    const chromePath =
      process.env.PUPPETEER_EXECUTABLE_PATH ||
      (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        : undefined);

    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: chromePath,
      protocolTimeout: 600000,
      args: ['--allow-file-access-from-files', '--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: pdfOutPath,
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    await browser.close();
    console.log(`🎉 Successfully rendered 20-Page Gold Standard PDF to: ${pdfOutPath}`);
  } catch (err) {
    console.warn(`⚠️ Puppeteer PDF generation failed or skipped: ${err.message}`);
    console.log(
      `(HTML output remains valid and printable directly via browser at ${publicHtmlPath})`,
    );
  }
}

// Execute compiler if called directly
if (require.main === module) {
  compileTheShoahWorkbook().catch((err) => {
    console.error('❌ Compilation failed:', err);
    process.exit(1);
  });
}

module.exports = { compileTheShoahWorkbook, enquiryConfigs };
