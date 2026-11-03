const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dataJsPath = path.join(root, 'units', 'weimar_nazi_germany', 'data.js');
const pubDataJsPath = path.join(root, 'public', 'units', 'weimar_nazi_germany', 'data.js');

const raw = fs.readFileSync(dataJsPath, 'utf8');
const jsonStr = raw.replace(/^export\s+default\s+/, '').replace(/;?\s*$/, '');
const weimarData = JSON.parse(jsonStr);

// Verified 3-video pathway map for all 16 Weimar & Nazi Germany lessons
const weimarVideoMap = {
  // L1: Origins of the Republic, 1918–1919
  "lesson_1_1": [
    {
      type: "youtube",
      id: "_W6JAqg6TPk",
      url: "https://www.youtube.com/watch?v=_W6JAqg6TPk",
      title: "1919-33: The Weimar Constitution | GCSE History Revision",
      duration: "6 mins 11 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Starter Hook | Tone Alert: Analytical breakdown of the Weimar Constitution, Reichstag voting, and the emergency powers granted by Article 48.",
      viewing_task: "[01:30] Quick Check: What was the voting system used to elect deputies to the Weimar Reichstag, and how did it encourage coalitions?\n[03:45] Disciplinary Question: Explain why Article 48 was described as a constitutional 'suicide pill' for the Republic.",
      model_answer: "The Weimar Constitution used Proportional Representation, where the percentage of votes cast directly determined the percentage of seats won. Because it was almost impossible for a single party to win an outright majority, governments were forced into fragile, unstable coalitions. Article 48 allowed the President to rule by emergency decree without Reichstag consent, creating a legal route to dictatorship."
    },
    {
      type: "youtube",
      id: "vrYhLNQMRro",
      url: "https://www.youtube.com/watch?v=vrYhLNQMRro",
      title: "The Treaty of Versailles, What Did the Big Three Want? | Simple History",
      duration: "2 mins 48 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–02:48 | Lesson Phase: Contextual Evidence | Tone Alert: Concise animated summary of the conflicting motivations of Clemenceau, Lloyd George, and Wilson in 1919.",
      viewing_task: "[00:50] Quick Check: Why did Georges Clemenceau demand the harshest possible terms against Germany at the Paris Peace Conference?\n[02:10] Analysis: How did the final Treaty terms set up German resentment regarding the 'Diktat' and War Guilt clause?",
      model_answer: "Clemenceau sought to permanently cripple Germany's military and economy to guarantee French security, given the devastation of northeastern France in WW1. The Germans felt betrayed because they were excluded from negotiations (a 'Diktat') and forced to sign Article 231 taking sole responsibility for causing the war."
    },
    {
      type: "youtube",
      id: "vO-_HXO7HwY",
      url: "https://www.youtube.com/watch?v=vO-_HXO7HwY",
      title: "Ten Minute History: The Weimar Republic and Nazi Germany | History Matters",
      duration: "9 mins 59 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–04:00 | Lesson Phase: Synoptic Overview | Tone Alert: Rapid, dryly humorous animated overview tracking the German Revolution, abdication of the Kaiser, and the Dolchstoßlegende (stab-in-the-back myth).",
      viewing_task: "[01:10] Key Recall: Why did German military commanders like Ludendorff shift blame for the 1918 defeat onto civilian politicians in Berlin?\n[02:40] Historical Inference: How did the 'November Criminals' myth undermine civilian trust in the new Weimar Republic from day one?",
      model_answer: "Ludendorff and Hindenburg sought to protect the Prussian military elite's honour by falsely claiming the German army remained undefeated in the field and was 'stabbed in the back' by socialists and politicians at home. This propaganda branded the democratic founders as 'November Criminals', creating deep, enduring delegitimisation of the Republic."
    }
  ],

  // L2: Early Challenges to the Republic, 1919–1923
  "lesson_1_2": [
    {
      type: "youtube",
      id: "FxeWA_AV3bo",
      url: "https://www.youtube.com/watch?v=FxeWA_AV3bo",
      title: "Jan 1919: The 'Spartacist' Revolt | GCSE History Revision | Weimar & Nazi Germany",
      duration: "3 mins 15 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–03:15 | Lesson Phase: Left-Wing Threat | Tone Alert: Focuses on the January 1919 Berlin uprising led by Rosa Luxemburg and Karl Liebknecht, and Ebert's reliance on the Freikorps.",
      viewing_task: "[00:55] Recall: Who were the leaders of the Spartacist League, and what type of government did they seek to establish?\n[02:15] Cause & Consequence: Why did President Ebert turn to the right-wing Freikorps to crush the Spartacists, and what dangerous precedent did this set?",
      model_answer: "The Spartacists were led by Rosa Luxemburg and Karl Liebknecht, seeking a communist council republic modelled on Soviet Russia. Ebert made a pact with the army and nationalist Freikorps paramilitaries because the regular army was demoralised; this set a fatal precedent of relying on violent anti-democratic soldiers to defend a democratic state."
    },
    {
      type: "youtube",
      id: "Nk_AZtB5yKc",
      url: "https://www.youtube.com/watch?v=Nk_AZtB5yKc",
      title: "1920: The Kapp Putsch (& Ongoing Political Violence) | GCSE History Revision",
      duration: "4 mins 18 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–04:00 | Lesson Phase: Right-Wing Threat | Tone Alert: Examines Wolfgang Kapp and General Lüttwitz's march on Berlin, the army's refusal to fire ('Reichswehr does not fire on Reichswehr'), and the general strike.",
      viewing_task: "[01:20] Key Question: When the Weimar government ordered the army to defend Berlin against the Kapp Putsch, how did General von Seeckt respond?\n[02:50] Evaluation: How was the Kapp Putsch ultimately defeated, and what did it reveal about the loyalty of the German civil service and army?",
      model_answer: "General von Seeckt famously declared 'Reichswehr does not fire on Reichswehr', refusing to deploy troops against right-wing former soldiers. The putsch was defeated by a nationwide general strike called by Berlin trade unions and workers that cut transport, water, and power, proving the army could not be relied upon to defend democracy."
    },
    {
      type: "youtube",
      id: "O2CIeNANQMM",
      url: "https://www.youtube.com/watch?v=O2CIeNANQMM",
      title: "1923: Hyperinflation | GCSE History | Weimar Germany",
      duration: "3 mins 49 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–03:49 | Lesson Phase: Economic Crisis | Tone Alert: Documents the French occupation of the Ruhr, passive resistance, endless paper money printing, and the total collapse of the Mark.",
      viewing_task: "[01:10] Cause: Why did French and Belgian troops occupy the Ruhr in January 1923?\n[02:30] Consequence: Which social class suffered the most devastating economic loss during the 1923 hyperinflation, and why?",
      model_answer: "France and Belgium invaded the industrial Ruhr because Germany failed to deliver promised timber and coal reparations installments. The German middle class (Mittelstand) suffered worst because lifelong savings, war bonds, and fixed pension incomes became completely worthless overnight, while debts and mortgages held by big industrialists were wiped out."
    }
  ],

  // L3: The Recovery of the Republic, 1924–1929
  "lesson_1_3": [
    {
      type: "youtube",
      id: "vWwG2VKDFpY",
      url: "https://www.youtube.com/watch?v=vWwG2VKDFpY",
      title: "Stresemann at Home: Rentenmark to Reichsmark, Dawes Plan & Young Plan | GCSE History",
      duration: "4 mins 58 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:45 | Lesson Phase: Domestic Economic Recovery | Tone Alert: Explains how Gustav Stresemann halted hyperinflation by introducing the Rentenmark and negotiating US loans under the Dawes Plan.",
      viewing_task: "[01:15] Mechanism: How did Stresemann restore monetary confidence through the temporary Rentenmark in late 1923?\n[03:10] Analysis: How did the Dawes Plan (1924) and Young Plan (1929) resolve Germany's reparations burden?",
      model_answer: "Stresemann replaced the worthless paper mark with the Rentenmark, tied to Germany's agricultural and industrial land assets rather than gold reserves. The Dawes Plan introduced American loans of 800 million marks and restructured reparations payments to scale with economic capacity, later extended and reduced by the Young Plan in 1929."
    },
    {
      type: "youtube",
      id: "OO3i2zEf4HQ",
      url: "https://www.youtube.com/watch?v=OO3i2zEf4HQ",
      title: "Stresemann Abroad: Locarno Treaties, League of Nations & Kellogg-Briand Pact",
      duration: "4 mins 18 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–04:18 | Lesson Phase: Foreign Policy Achievements | Tone Alert: Explores Stresemann's diplomatic reconciliation with Western powers, ending Germany's diplomatic isolation.",
      viewing_task: "[01:05] Key Term: What did Germany formally agree to in the 1925 Locarno Treaties regarding its western borders?\n[02:40] Significance: Why was Germany's admission to the League of Nations in 1926 a vital diplomatic triumph for Stresemann?",
      model_answer: "In the 1925 Locarno Treaties, Germany voluntarily accepted its western borders with France and Belgium, renouncing future territorial invasion and promising the permanent demilitarisation of the Rhineland. Admission to the League of Nations with a permanent Council seat restored Germany's status as an equal great power on the world stage."
    },
    {
      type: "youtube",
      id: "gYc8fX527PQ",
      url: "https://www.youtube.com/watch?v=gYc8fX527PQ",
      title: "1923-29: Stresemann's Strategy | GCSE History Revision | Weimar & Nazi Germany",
      duration: "6 mins 27 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Synoptic Evaluation | Tone Alert: Evaluates the strengths and fatal hidden fragilities of Stresemann's 'Golden Twenties' recovery.",
      viewing_task: "[03:20] Quote Analysis: What did Stresemann mean when he warned that Germany's economic recovery was 'dancing on a volcano'?\n[05:00] Historiographical Verdict: To what extent was the Weimar Republic truly stabilised between 1924 and 1929?",
      model_answer: "Stresemann warned Germany was 'dancing on a volcano' because its industrial resurgence was financed by short-term US loans that Wall Street could recall at any moment. While political violence dropped and culture flourished, underlying structural unemployment remained high and right-wing nationalists never accepted the Republic."
    }
  ],

  // L4: Changes in Society, 1924–1929
  "lesson_1_4": [
    {
      type: "youtube",
      id: "hSR3yehNYSk",
      url: "https://www.youtube.com/watch?v=hSR3yehNYSk",
      title: "The German 'New Woman', 1918-1933 | GCSE History | Weimar Germany",
      duration: "5 mins 34 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Social Transformation | Tone Alert: Examines women's suffrage under the 1919 Constitution, female employment in public sectors, and the emerging cultural archetype of the 'Neue Frau'.",
      viewing_task: "[01:10] Political Rights: What rights did Article 109 of the Weimar Constitution grant to German women in 1919?\n[03:15] Cultural Friction: Why did traditional conservatives and right-wing parties object to the modern 'New Woman' lifestyle in 1920s cities?",
      model_answer: "Article 109 granted women equal legal rights with men, including full voting rights at age 20 and equal civil service entry. Traditionalists and church leaders attacked the 'New Woman'—with short bobbed hair, cigarette smoking, and financial autonomy—for allegedly abandoning motherhood, driving down the birth rate, and corrupting German moral family values."
    },
    {
      type: "youtube",
      id: "Rv0Pz_YEk9M",
      url: "https://www.youtube.com/watch?v=Rv0Pz_YEk9M",
      title: "Cultural Changes in Weimar Germany, 1920s | GCSE History | Weimar & Nazi Germany",
      duration: "9 mins 42 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Artistic Modernism | Tone Alert: Surveys the explosion of creative freedom after the abolition of Imperial censorship, focusing on Expressionism, Otto Dix, and Fritz Lang's Metropolis.",
      viewing_task: "[01:45] Innovation: How did the abolition of wartime Imperial censorship unleash radical experimentation in German art and theatre?\n[04:20] Critical Realism: How did 'New Objectivity' (Neue Sachlichkeit) painters like Otto Dix and George Grosz critique post-war society?",
      model_answer: "The removal of censorship allowed avant-garde creators to confront raw social reality, satirise authority, and explore dark psychological themes. Painters like Otto Dix portrayed mutilated war veterans begging in streets alongside wealthy corrupt war profiteers, stripping away patriotic romance to reveal the grotesque social inequalities of Weimar Germany."
    },
    {
      type: "youtube",
      id: "Saa1UxNZIx8",
      url: "https://www.youtube.com/watch?v=Saa1UxNZIx8",
      title: "Weimar Culture: Art, Architecture & Bauhaus | GCSE History",
      duration: "3 mins 54 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–03:54 | Lesson Phase: Bauhaus Movement | Tone Alert: Focuses on Walter Gropius, the Bauhaus school of design in Weimar and Dessau, and functionalist modernist architecture.",
      viewing_task: "[01:00] Design Philosophy: What was the central principle of Walter Gropius and the Bauhaus design movement?\n[02:45] Cultural Polarization: Why did conservative nationalists view Bauhaus architecture and modern culture as 'un-German' and degenerate?",
      model_answer: "The Bauhaus philosophy was 'art into industry' and 'form follows function'—rejecting ornate imperial decoration in favour of clean geometric lines, steel, and glass suited to mass production. Right-wing traditionalists despised it as foreign, cosmopolitan, and communist-inspired, demanding a return to traditional Germanic pitched roofs and neo-classical styles."
    }
  ],

  // L5: Early Development of the Nazi Party, 1919–1922
  "lesson_2_1": [
    {
      type: "youtube",
      id: "5HFMQYN11P8",
      url: "https://www.youtube.com/watch?v=5HFMQYN11P8",
      title: "24th February 1920: Hitler Announces the 25 Point Programme | HistoryPod",
      duration: "2 mins 36 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–02:36 | Lesson Phase: Party Ideology | Tone Alert: Outlines the founding platform of the NSDAP at the Hofbräuhaus in Munich, combining radical antisemitism, anti-Versailles revanchism, and national socialism.",
      viewing_task: "[00:45] Key Fact: Under what name was the Nazi party originally founded by Anton Drexler in January 1919?\n[01:50] Core Demands: Identify two major demands outlined in the 25 Point Programme of February 1920.",
      model_answer: "The party was originally founded as the German Workers' Party (DAP) by Anton Drexler. Major demands in the 25 Point Programme included the total revocation of the Treaty of Versailles, the unification of all Germans in a Greater Germany (Großdeutschland), and the complete denial of German citizenship to Jews."
    },
    {
      type: "youtube",
      id: "9fkPOpyNVJ8",
      url: "https://www.youtube.com/watch?v=9fkPOpyNVJ8",
      title: "The Early Years of the Nazi Party 1919-1923 | GCSE History",
      duration: "2 mins 34 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–02:34 | Lesson Phase: Hitler's Leadership & SA | Tone Alert: Explains Hitler's oratory skills, the creation of the SA (Brownshirts) under Ernst Röhm, and the party newspaper Völkischer Beobachter.",
      viewing_task: "[00:50] Leadership Takeover: How did Adolf Hitler outmanoeuvre Anton Drexler to become absolute party chairman in July 1921?\n[01:40] Paramilitary Role: What specific functions did the Sturmabteilung (SA) perform for the early Nazi Party?",
      model_answer: "Hitler threatened to resign permanently unless he was granted dictatorial powers over the DAP; knowing Hitler was their only charismatic orator and crowd-puller, the party committee capitulated. The SA was established as a paramilitary wing to violently disrupt rival political meetings (especially communists) and protect Nazi speakers at beer hall rallies."
    },
    {
      type: "youtube",
      id: "3-P1U2e6Ozo",
      url: "https://www.youtube.com/watch?v=3-P1U2e6Ozo",
      title: "How Did Hitler Take Over the Nazi Party? | GCSE History",
      duration: "4 mins 59 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–04:30 | Lesson Phase: Oratory & Propaganda | Tone Alert: Examines how Hitler's theatrical delivery, gestures, swastika iconography, and populist appeal transformed a fringe Bavarian group.",
      viewing_task: "[01:30] Technique: What rhetorical methods did Hitler employ to captivate Bavarian beer hall audiences in the early 1920s?\n[03:20] Propaganda Design: Why was the swastika emblem and the renamed 'NSDAP' title so effectively targeted?",
      model_answer: "Hitler began speeches quietly and deliberately before building into theatrical crescendos of fury, exploiting audience grievances over the 1918 defeat, inflation, and communism. The swastika emblem created a striking visual brand, while adding 'National Socialist' appealed simultaneously to nationalist conservatives and disaffected working-class voters."
    }
  ],

  // L6: Munich Putsch and Lean Years, 1923–1929
  "lesson_2_2": [
    {
      type: "youtube",
      id: "pJVQZWLqSPE",
      url: "https://www.youtube.com/watch?v=pJVQZWLqSPE",
      title: "The Beer Hall Putsch (1923) | Simple History",
      duration: "10 mins 30 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: The Coup Attempt | Tone Alert: Animated narrative of the November 1923 coup in the Bürgerbräukeller, the confrontation at the Odeonsplatz, and its swift collapse.",
      viewing_task: "[02:15] Catalyst: Why did Hitler believe November 1923 was the ideal moment to launch a march on Berlin?\n[04:10] Turning Point: What happened when the Nazi marchers reached the Odeonsplatz armed police cordon?",
      model_answer: "Hitler believed hyperinflation, the Ruhr crisis, and nationalist fury made the Weimar government vulnerable, hoping to mimic Mussolini's successful 1922 March on Rome alongside WW1 hero General Ludendorff. At the Odeonsplatz, Bavarian state police fired upon the column; 16 Nazis and 4 police officers were killed, Göring was wounded, and Hitler fled."
    },
    {
      type: "youtube",
      id: "0qEsf7O1VM0",
      url: "https://www.youtube.com/watch?v=0qEsf7O1VM0",
      title: "20th December 1924: Adolf Hitler Released from Landsberg Prison | HistoryPod",
      duration: "2 mins 53 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–02:53 | Lesson Phase: Trial, Landsberg & Mein Kampf | Tone Alert: Reviews Hitler's trial, sympathetic Bavarian judges, lenient sentence, and the dictation of Mein Kampf.",
      viewing_task: "[00:50] Trial as Platform: How did Hitler transform his treason trial into a national propaganda triumph?\n[02:00] Strategic Pivot: What fundamental shift in Nazi strategy did Hitler formulate while imprisoned at Landsberg?",
      model_answer: "Hitler used the courtroom as a national megaphone to denounce the Weimar Republic, claiming his actions were patriotic rather than treasonous; sympathetic judges gave him the minimum sentence of 5 years with early parole. In prison, he dictated Mein Kampf and realised the Nazis could never take power through armed putsch; they had to win power legally through the ballot box."
    },
    {
      type: "youtube",
      id: "O2ec9nyPsdg",
      url: "https://www.youtube.com/watch?v=O2ec9nyPsdg",
      title: "What Was the Beer Hall (Munich) Putsch? | GCSE History Revision",
      duration: "1 mins 38 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–01:38 | Lesson Phase: Quick Revision Summary | Tone Alert: High-impact summary of causes, events, and long-term consequences of the 1923 putsch.",
      viewing_task: "[00:30] Recall: Name the two Bavarian leaders whom Hitler held at gunpoint in the Bürgerbräukeller.\n[01:15] Consequence: How did the Bamberg Conference of 1926 solidify Hitler's complete control over the party?",
      model_answer: "Hitler cornered Bavarian state commissioner Gustav von Kahr and army chief Otto von Lossow. At the 1926 Bamberg Conference, Hitler crushed the northern socialist wing led by Gregor Strasser, establishing the Führerprinzip (leader principle) and cementing his unquestioned dictatorial authority over the party."
    }
  ],

  // L7: Growth of Nazi Support, 1929–1932
  "lesson_2_3": [
    {
      type: "youtube",
      id: "62DxELjuRec",
      url: "https://www.youtube.com/watch?v=62DxELjuRec",
      title: "The Great Depression: 5 Minute History Lesson | The Plain Bagel",
      duration: "5 mins 40 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–04:30 | Lesson Phase: Economic Collapse | Tone Alert: Explains the October 1929 Wall Street Crash, sudden recall of American short-term loans, and the global credit contraction.",
      viewing_task: "[01:30] Economic Mechanism: Why did the Wall Street Crash in New York trigger an instantaneous economic crisis across Germany?\n[03:40] Human Cost: How high did German unemployment soar by the winter of 1932?",
      model_answer: "Germany's economic revival was heavily reliant on short-term American loans from the Dawes Plan; when US banks faced bankruptcy, they immediately recalled these loans. German banks collapsed, factories shuttered, and unemployment soared past 6 million (over 30% of the working population) by 1932."
    },
    {
      type: "youtube",
      id: "bj6RIHbU7bs",
      url: "https://www.youtube.com/watch?v=bj6RIHbU7bs",
      title: "The Wall Street Crash and Its Impact on Germany | GCSE History",
      duration: "5 mins 09 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Political Polarisation | Tone Alert: Details Chancellor Brüning's austerity policies ('Hunger Chancellor'), the collapse of Reichstag coalitions, and the surge in KPD and NSDAP votes.",
      viewing_task: "[01:40] Failure of Democracy: Why did Chancellor Brüning rely heavily on Article 48 emergency presidential decrees between 1930 and 1932?\n[03:30] Electoral Surge: How did the Nazi share of Reichstag seats change between May 1928 (12 seats) and July 1932 (230 seats)?",
      model_answer: "Brüning's deflationary spending cuts and tax rises alienated the Reichstag, causing coalition collapse; he increasingly bypassed parliament using Hindenburg's Article 48 decrees, crippling parliamentary democracy. Desperate voters abandoned moderate parties, propelling the Nazis from an irrelevant 12 seats (2.6%) in 1928 to 230 seats (37.3%) in July 1932, becoming the largest party."
    },
    {
      type: "youtube",
      id: "qqZjF3-dMzU",
      url: "https://www.youtube.com/watch?v=qqZjF3-dMzU",
      title: "Hitler’s Rise to Power 1929 – 1934: The Great Depression",
      duration: "5 mins 18 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Appeal of the Nazis | Tone Alert: Explores Goebbels' propaganda campaigns, the Hitler Flight over Germany, and targeted promises to workers, farmers, and big business.",
      viewing_task: "[01:50] Broad Appeal: How did Nazi propaganda tailor different messages to win over German farmers, the middle class, and industrialists?\n[03:45] SA Role: What role did the brownshirt SA play on the streets during the 1930–1932 election campaigns?",
      model_answer: "The Nazis promised farmers higher agricultural tariffs and debt relief, promised the middle class protection against communism and big department stores, and promised industrialists that trade unions and communists would be crushed. The SA presented an image of disciplined order while violently brawling with communist Red Front fighters, convincing anxious citizens that only Hitler could restore stability."
    }
  ],

  // L8: How Hitler Became Chancellor, 1932–1933
  "lesson_2_4": [
    {
      type: "youtube",
      id: "u_0KS4CUMcQ",
      url: "https://www.youtube.com/watch?v=u_0KS4CUMcQ",
      title: "30th January 1933: Adolf Hitler Appointed Chancellor of Germany | HistoryPod",
      duration: "2 mins 50 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–02:50 | Lesson Phase: Backroom Intrigue | Tone Alert: Explains the aristocratic conspiracy between Franz von Papen, Kurt von Schleicher, and President Paul von Hindenburg.",
      viewing_task: "[00:45] Elite Intrigue: Why did Franz von Papen persuade President Hindenburg to appoint Hitler as Chancellor on 30 January 1933?\n[01:55] The Fatal Calculation: What did Papen mean when he boastfully declared that they had 'hired Hitler' and would 'push him into a corner'?",
      model_answer: "Papen and the conservative aristocratic clique lacked popular support in the Reichstag after Schleicher's government collapsed; they needed Hitler's mass voter base to form a stable right-wing government. Papen foolishly believed that with only 3 Nazis in a cabinet of 12 (Hitler, Frick, Göring) and Papen as Vice-Chancellor, the conservative elite could easily control and tame Hitler."
    },
    {
      type: "youtube",
      id: "ux8bNLD4QWw",
      url: "https://www.youtube.com/watch?v=ux8bNLD4QWw",
      title: "Why Did Hitler Become Chancellor in 1933? | GCSE History Revision",
      duration: "4 mins 40 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–04:40 | Lesson Phase: Synthesis of Causes | Tone Alert: Clear, structured analysis balancing long-term weaknesses of Weimar, mid-term economic depression, and short-term political miscalculations.",
      viewing_task: "[01:20] Relative Weight: Which factor was more significant: the electoral appeal of the Nazi Party or the political backstabbing of Papen and Hindenburg?\n[03:10] Democratic Breakdown: Why did Hindenburg refuse to appoint Hitler in August 1932 despite the Nazis winning 37% of the vote?",
      model_answer: "Both factors were essential: without mass electoral support after the Wall Street Crash Hitler could never have demanded power, but without Papen's backroom intrigue to oust Schleicher Hitler would not have been appointed, especially as Nazi votes had fallen in November 1932. Hindenburg personally despised Hitler as a vulgar 'Bohemian corporal' and refused him the Chancellorship until Papen promised Hitler could be safely contained."
    },
    {
      type: "youtube",
      id: "Oo5u086L_3k",
      url: "https://www.youtube.com/watch?v=Oo5u086L_3k",
      title: "How Did Hitler Become Chancellor of Germany? | GCSE History",
      duration: "7 mins 43 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Deep-Dive Enquiry | Tone Alert: Comprehensive examination of the political maneuvering through 1932, the presidential election, and the final cabinet composition.",
      viewing_task: "[02:30] Electoral Setback: Why was the November 1932 election a crisis for the Nazi party, and why did it make Hitler desperate for a deal?\n[04:45] Cabinet Power: How did Hermann Göring use his position as Prussian Minister of the Interior to secure Nazi dominance over the police?",
      model_answer: "In the November 1932 election, Nazi support dropped by 2 million votes (from 230 to 196 seats) and the party ran out of campaign funds, making Hitler fearful that his momentum was slipping away. Göring took command of Prussia's 50,000-strong police force, deputising 50,000 SA brownshirts as auxiliary police and ordering them to shoot anti-Nazi opponents on sight."
    }
  ],

  // L9: The Creation of a Dictatorship, 1933–1934
  "lesson_3_1": [
    {
      type: "youtube",
      id: "x4RGDM_q0l8",
      url: "https://www.youtube.com/watch?v=x4RGDM_q0l8",
      title: "The Reichstag Fire | The Pacifist",
      duration: "3 mins 11 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–03:11 | Lesson Phase: Elimination of Civil Rights | Tone Alert: Explores the burning of the Reichstag on 27 February 1933, the arrest of Marinus van der Lubbe, and the Decree for the Protection of People and State.",
      viewing_task: "[01:05] Immediate Reaction: How did Hitler exploit the Reichstag fire to crack down on the German Communist Party (KPD)?\n[02:15] Legal Dictatorship: What basic civil liberties were suspended by Hindenburg's emergency decree on 28 February 1933?",
      model_answer: "Hitler blamed the fire on a planned communist armed insurrection, arresting 4,000 communist officials and banning their press. The emergency decree suspended freedom of speech, assembly, press, and privacy of postal communications, allowing the regime to indefinitely detain political opponents without charge."
    },
    {
      type: "youtube",
      id: "pBOK5FGhai0",
      url: "https://www.youtube.com/watch?v=pBOK5FGhai0",
      title: "The Night of the Long Knives | The Pacifist",
      duration: "4 mins 25 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–04:25 | Lesson Phase: Internal Party Purge | Tone Alert: Examines the 30 June 1934 purge of Ernst Röhm and the SA leadership, reconciling the regular army and eliminating conservative rivals.",
      viewing_task: "[01:15] Threat from Within: Why did the German army high command view Ernst Röhm and the 3-million-strong SA as a deadly threat?\n[03:00] Murder & Consolidation: Who carried out the killings during the Night of the Long Knives, and which prominent non-Nazis were assassinated?",
      model_answer: "Röhm demanded a 'Second Revolution' to absorb the regular German army into a people's militia under SA command, which the aristocratic army generals and industrial leaders fiercely rejected. Himmler's SS executed over 200 leaders, including Röhm, former Chancellor Kurt von Schleicher, and conservative leader Gregor Strasser."
    },
    {
      type: "youtube",
      id: "evFc-exxPlU",
      url: "https://www.youtube.com/watch?v=evFc-exxPlU",
      title: "30th June 1934: Hitler Purges the Nazi Party in the Night of the Long Knives | HistoryPod",
      duration: "2 mins 19 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:19 | Lesson Phase: Oath & Führer | Tone Alert: Documents how Hindenburg's death in August 1934 led to the merger of Chancellor and President into 'Führer' and the personal army oath.",
      viewing_task: "[00:55] Consolidation: Following the purge, what title did Hitler adopt upon President Hindenburg's death in August 1934?\n[01:45] The Soldier's Oath: How did the new military oath fundamentally alter the loyalty of every German soldier?",
      model_answer: "Hitler merged the offices of Chancellor and President to declare himself 'Führer und Reichskanzler'. German soldiers and officers swore a sacred personal oath of unconditional obedience to Adolf Hitler himself as supreme commander, rather than to the constitution or the nation."
    }
  ],

  // L10: The Police State and Religion, 1933–1939
  "lesson_3_2": [
    {
      type: "youtube",
      id: "Ggh9WpTqvLg",
      url: "https://www.youtube.com/watch?v=Ggh9WpTqvLg",
      title: "Nazi Terror: The Police State | GCSE History Revision",
      duration: "5 mins 22 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Instruments of Terror | Tone Alert: Reviews Heinrich Himmler's SS, Reinhard Heydrich's SD, the Gestapo secret police, and the establishment of Dachau concentration camp in 1933.",
      viewing_task: "[01:20] Terror Apparatus: What was the primary difference in jurisdiction between the regular police, the Gestapo, and the SS?\n[03:10] Climate of Fear: Why did the Gestapo rely so heavily on ordinary citizens' voluntary denunciations?",
      model_answer: "The regular police handled routine criminal law, while the Gestapo (secret police) investigated political subversion above the law, and the SS operated concentration camps and ideological enforcement. The Gestapo had surprisingly few full-time officers (only ~30,000 nationwide), meaning over 80% of investigations began with voluntary denunciations by neighbours, colleagues, and rivals."
    },
    {
      type: "youtube",
      id: "sBMu6atP1wA",
      url: "https://www.youtube.com/watch?v=sBMu6atP1wA",
      title: "Nazi Policies Towards the Church | GCSE History",
      duration: "3 mins 29 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–03:29 | Lesson Phase: Concordat & Reich Church | Tone Alert: Explores the July 1933 Reichskonkordat with the Vatican, the creation of the pro-Nazi Reich Church under Ludwig Müller, and subsequent persecution.",
      viewing_task: "[00:50] Agreement: What terms were agreed between Hitler and Pope Pius XI in the 1933 Concordat?\n[02:10] Subversion: How did the Nazi regime breach the Concordat, and how did the Pope respond in the 1937 encyclical Mit Brennender Sorge?",
      model_answer: "Hitler promised Catholic schools and youth groups would be protected in exchange for the Church withdrawing from German political life. The Nazis broke the pact by shutting Catholic schools and arresting priests; in 1937 Pope Pius XI issued 'Mit Brennender Sorge' ('With Burning Concern'), condemning Nazi racial idolatry and state worship."
    },
    {
      type: "youtube",
      id: "tbnQ1pCWg2c",
      url: "https://www.youtube.com/watch?v=tbnQ1pCWg2c",
      title: "The Nazi Policies Towards the Church and Resistance | GCSE Edexcel History",
      duration: "6 mins 53 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–05:30 | Lesson Phase: Protestant Schism & Niemöller | Tone Alert: Details the struggle between the German Christians ('Gottgläubig') and Martin Niemöller's Confessing Church.",
      viewing_task: "[02:00] Protestant Division: Why did Protestant pastors like Martin Niemöller and Dietrich Bonhoeffer break away to form the Confessing Church in 1934?\n[04:40] Persecution: What happened to Pastor Martin Niemöller when he refused to stop preaching against Nazi state control?",
      model_answer: "They opposed Nazi attempts to nazify Protestant Christianity by removing the Old Testament and banning converted Jews under the 'Aryan Paragraph'. Niemöller was arrested in 1937 and imprisoned in Sachsenhausen and Dachau concentration camps as Hitler's 'personal prisoner' until 1945."
    }
  ],

  // L11: Controlling and Influencing Attitudes, 1933–1939
  "lesson_3_3": [
    {
      type: "youtube",
      id: "_UF6zAqDSJE",
      url: "https://www.youtube.com/watch?v=_UF6zAqDSJE",
      title: "What Was Nazi Propaganda? | Holocaust Explainer (USHMM)",
      duration: "2 mins 49 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–02:49 | Lesson Phase: Propaganda Principles | Tone Alert: High-level overview by the US Holocaust Memorial Museum detailing Joseph Goebbels' Ministry of Public Enlightenment and Propaganda.",
      viewing_task: "[00:45] Definition: According to Joseph Goebbels, what was the primary purpose of state propaganda in the Third Reich?\n[01:50] Media Monopolies: Name three distinct communication media that the Nazi regime seized and censored to control public opinion.",
      model_answer: "Goebbels argued propaganda was not merely informative but intended to unify the German people's mindset so all citizens thought and acted in lockstep with the Führer. The regime monopolised radio broadcasting, daily newspapers through the Reich Press Law, and cinema through compulsory newsreels and film approval."
    },
    {
      type: "youtube",
      id: "aD6zpu0H6d4",
      url: "https://www.youtube.com/watch?v=aD6zpu0H6d4",
      title: "Nazi Germany Propaganda: The Radio (1923-45) | Simple History",
      duration: "6 mins 53 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–04:30 | Lesson Phase: Technological Indoctrination | Tone Alert: Explores the mass production of the Volksempfänger (People's Receiver), street loudspeakers, and criminal penalties for listening to foreign broadcasts.",
      viewing_task: "[01:20] Innovation: How did the Volksempfänger ensure Nazi messages reached millions of ordinary German households?\n[03:40] Control: Why were the cheaper radio sets intentionally manufactured without shortwave frequency dials?",
      model_answer: "The Volksempfänger (VE301) was subsidised to be sold cheaply for 76 marks (and later 35 marks), raising German household radio ownership to over 70% by 1939—the highest in the world. They were designed with limited range so ordinary citizens could only tune into domestic Nazi broadcasts and could not intercept foreign stations like the BBC."
    },
    {
      type: "youtube",
      id: "27HtAT5CsLY",
      url: "https://www.youtube.com/watch?v=27HtAT5CsLY",
      title: "The 1936 Berlin Olympics: Unveiling a Nazi Propaganda Masterpiece",
      duration: "2 mins 53 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:53 | Lesson Phase: International Showcase | Tone Alert: Documents how Hitler and Goebbels presented a modern, peaceful, and clean image of Germany during the Berlin Olympic Games.",
      viewing_task: "[00:55] Façade: How did the Nazi regime temporarily sanitize Berlin during the August 1936 Olympic Games?\n[01:50] Disruption: How did Jesse Owens' extraordinary performance in Berlin challenge Nazi racial theories of Aryan supremacy?",
      model_answer: "Antisemitic signs ('Jews not wanted here') and the vicious tabloid Der Stürmer were temporarily removed from Berlin streets, presenting a tranquil and welcoming image to foreign visitors. African-American sprinter Jesse Owens won four gold medals, humiliating Hitler's claims of Aryan biological and athletic supremacy before a global audience."
    }
  ],

  // L12: Opposition, Resistance and Conformity, 1933–1939
  "lesson_3_4": [
    {
      type: "youtube",
      id: "eJwnjFlYsyQ",
      url: "https://www.youtube.com/watch?v=eJwnjFlYsyQ",
      title: "Opposition, Resistance & Conformity: The Swing Youth and the Edelweiss Pirates",
      duration: "12 mins 13 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Youth Nonconformity | Tone Alert: Explores working-class youth rebellion (Edelweiss Pirates) versus middle-class cultural defiance (Swing Youth).",
      viewing_task: "[02:15] Cultural Resistance: In what ways did the Swing Youth express their rebellion against Nazi cultural regimentation?\n[04:30] Active Defiance: How did the Edelweiss Pirates in the Rhineland escalate from mocking Hitler Youth marches to sheltering deserters?",
      model_answer: "Swing Youth listened to banned American jazz and swing music, dressed in English clothes, and danced in clubs, rejecting Nazi militarism and racial purism. Edelweiss Pirates began by beating up Hitler Youth patrols and camping freely, but during wartime escalated to graffiti, distributing allied leaflets, and derailing munitions trains."
    },
    {
      type: "youtube",
      id: "ZtOKRsF6Rr0",
      url: "https://www.youtube.com/watch?v=ZtOKRsF6Rr0",
      title: "The Secret Student Resistance to Hitler | TED-Ed (Iseult Gillespie)",
      duration: "5 mins 32 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–05:32 | Lesson Phase: Student Resistance | Tone Alert: Beautifully animated account of Sophie Scholl, Hans Scholl, and the White Rose resistance movement at Munich University.",
      viewing_task: "[01:45] Intellectual Dissent: What prompted Hans and Sophie Scholl to form the White Rose resistance group?\n[03:50] Consequence: How were the White Rose leaflets distributed, and what was the fate of the students upon discovery in 1943?",
      model_answer: "Witnessing battlefield atrocities on the Eastern Front and learning of the extermination of Jewish civilians compelled them to awaken the German conscience. They secretly mailed and distributed leaflets calling for passive resistance against Hitler; in February 1943 they were caught dropping leaflets at Munich University, subjected to a sham trial by Roland Freisler, and executed by guillotine."
    },
    {
      type: "youtube",
      id: "IgPKPKi4KNk",
      url: "https://www.youtube.com/watch?v=IgPKPKi4KNk",
      title: "Martin Niemöller and The Sin of Silence",
      duration: "3 mins 23 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–03:23 | Lesson Phase: Church Resistance & Conformity | Tone Alert: Explores Pastor Martin Niemöller's courageous public stand, the psychology of bystander complicity, and his famous post-war poem.",
      viewing_task: "[01:10] Resistance Message: What is the core warning of Niemöller's poem 'First they came for the socialists...'?\n[02:30] Historical Assessment: Why did the vast majority of ordinary Germans conform to the Nazi regime between 1933 and 1939 rather than actively resist?",
      model_answer: "Niemöller warned that remaining silent when minorities are persecuted ensures that when tyranny turns on you, there will be no one left to speak out. Most ordinary Germans conformed due to fear of the Gestapo terror apparatus, genuine appreciation for economic recovery, jobs, and national pride, and effective propaganda."
    }
  ],

  // L13: Nazi Policies Towards Women, 1933–1939
  "lesson_4_1": [
    {
      type: "youtube",
      id: "arCs4X2rko4",
      url: "https://www.youtube.com/watch?v=arCs4X2rko4",
      title: "Life for Women: Weimar and Nazi Germany | GCSE History Revision",
      duration: "6 mins 05 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Domestic Ideology | Tone Alert: Examines Kinder, Küche, Kirche (Children, Kitchen, Church), the Law for the Encouragement of Marriage (1933), and the Mother's Cross.",
      viewing_task: "[01:15] Financial Incentive: How did the 1933 Marriage Loan scheme encourage German women to leave employment and have children?\n[03:30] Awards: What were the criteria for receiving Bronze, Silver, and Gold Honor Crosses of the German Mother?",
      model_answer: "Newlywed couples were given an interest-free loan of 1,000 marks (worth roughly 9 months' pay) on the condition that the bride left her job; for every child born, 25% of the loan was written off, making four children clear the entire debt. The Mother's Cross was awarded on Hitler's mother's birthday: Bronze for 4–5 children, Silver for 6–7, and Gold for 8 or more."
    },
    {
      type: "youtube",
      id: "Ma4ZlCSbPBM",
      url: "https://www.youtube.com/watch?v=Ma4ZlCSbPBM",
      title: "Kinder, Küche, Kirche: Nazi Germany’s Campaign to Push Women Back Home",
      duration: "8 mins 54 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: Professional Restrictions | Tone Alert: Documents how female civil servants, doctors, and teachers were dismissed from professional roles, followed by the wartime policy reversal.",
      viewing_task: "[02:10] Employment Purge: Which professional fields were German women barred from entering in the early years of the Third Reich?\n[04:40] Policy Contradiction: Why was the Nazi regime forced to reverse its anti-female employment policy after rearmament began in 1937?",
      model_answer: "Women were dismissed from civil service positions, excluded from the judiciary as judges and lawyers, and restricted to no more than 10% of university places. As rearmament accelerated and men were conscripted into the Wehrmacht, severe industrial labour shortages forced the regime to re-employ over 1.4 million women in factories by 1939."
    },
    {
      type: "youtube",
      id: "KlEKn6Bw6FQ",
      url: "https://www.youtube.com/watch?v=KlEKn6Bw6FQ",
      title: "Child of Lebensborn: The Racial Breeding Programme (JFI Short Documentary)",
      duration: "14 mins 39 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–04:30 | Lesson Phase: Racial Engineering | Tone Alert: Focuses on Heinrich Himmler's Lebensborn (Fount of Life) breeding homes aimed at raising the Aryan birth rate.",
      viewing_task: "[01:30] Programme Purpose: What was the primary ideological objective of Heinrich Himmler's Lebensborn programme founded in 1935?\n[03:15] Historical Significance: How did Lebensborn reflect the Nazi view of human beings as biological breeding assets for the state?",
      model_answer: "Lebensborn was created by the SS to encourage racially 'pure' unmarried Aryan women to bear children fathered by SS officers in secret maternity homes, with babies adopted by SS families. It treated women and infants as instruments of racial engineering, stripping away personal identity to populate the Reich with genetically engineered Aryans."
    }
  ],

  // L14: Nazi Policies Towards the Young, 1933–1939
  "lesson_4_2": [
    {
      type: "youtube",
      id: "_oxRrigvLEk",
      url: "https://www.youtube.com/watch?v=_oxRrigvLEk",
      title: "What Was the Hitler Youth? | Holocaust Explainer (USHMM)",
      duration: "3 mins 44 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–03:44 | Lesson Phase: Youth Organisations | Tone Alert: USHMM educational summary of the Hitler Youth (HJ) and League of German Girls (BDM), mandatory membership from 1936/1939.",
      viewing_task: "[01:00] Activities: What different skills were emphasised for boys in the Hitler Youth compared to girls in the Bund Deutscher Mädel (BDM)?\n[02:30] Loyalty: How did youth groups aim to replace family and religious loyalty with total allegiance to Adolf Hitler?",
      model_answer: "Boys focused on military drill, weapons cleaning, map-reading, obstacle courses, and endurance camping to prepare them for military service. Girls focused on physical fitness, gymnastics, camp cooking, hygiene, and mothercraft to prepare them for motherhood; both groups encouraged children to inform on parents if they expressed doubts about Hitler."
    },
    {
      type: "youtube",
      id: "B5E7WR8TINI",
      url: "https://www.youtube.com/watch?v=B5E7WR8TINI",
      title: "Oath and Opposition: Education in the Third Reich | USHMM",
      duration: "4 mins 40 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–04:40 | Lesson Phase: School Curriculum & Indoctrination | Tone Alert: Explores how biology, history, and physical education curricula were militarised and infused with racial science.",
      viewing_task: "[01:15] Curriculum Transformation: How was the school curriculum rewritten to promote antisemitism and racial hygiene in biology and history?\n[03:20] Teacher Control: What was the National Socialist Teachers' League (NSLB), and what happened to teachers who refused to conform?",
      model_answer: "Biology was repurposed to teach racial hierarchy and eugenics, history glorified German military past and scapegoated Jews for the 1918 defeat, and math problems calculated bombing distances and costs of caring for the disabled. Teachers were forced to join the NSLB and swear loyalty to Hitler; Jewish teachers and political dissidents were purged immediately in 1933."
    },
    {
      type: "youtube",
      id: "wFkb7vYZp8U",
      url: "https://www.youtube.com/watch?v=wFkb7vYZp8U",
      title: "Nazi Germany: Tomorrow's Wives and Warriors | timelinesTV",
      duration: "2 mins 48 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–02:48 | Lesson Phase: Visual Archival Footage | Tone Alert: Superb archival newsreel footage showing Hitler Youth assemblies, Nuremberg rally parades, and the militarisation of childhood.",
      viewing_task: "[00:45] Visual Evidence: How do the archival images demonstrate the physical regimentation of German children under the Nazi regime?\n[01:50] Evaluation: Why did some young Germans find the outdoor adventures of the Hitler Youth thrilling while others felt suffocated?",
      model_answer: "Newsreels show massive synchronized parades, uniform brown shirts, drum cadences, and military camp formations, instilling unquestioning obedience. Many working-class boys loved the camping, hiking, shooting, and escape from strict schooling, but others detested the harsh bullying, mindless repetitive drills, and loss of free weekends."
    }
  ],

  // L15: Employment and Living Standards, 1933–1939
  "lesson_4_3": [
    {
      type: "youtube",
      id: "SVSUBSiAtGA",
      url: "https://www.youtube.com/watch?v=SVSUBSiAtGA",
      title: "Policies to Reduce Unemployment: Weimar and Nazi Germany | GCSE History Revision",
      duration: "5 mins 30 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–05:00 | Lesson Phase: The 'Economic Miracle' | Tone Alert: Analyzes the National Labour Service (RAD), autobahn public works, invisible unemployment, and rearmament.",
      viewing_task: "[01:25] Compulsory Labour: What was the Reich Labour Service (RAD), and who was required to serve in it?\n[03:15] Invisible Unemployment: Identify two ways Nazi official unemployment figures were artificially reduced without creating real private-sector jobs.",
      model_answer: "From 1935, all 18–25 year-old men had to complete 6 months of manual labour in the RAD (clearing land, building motorways) for pocket money. Unemployment figures hid millions: Jews stripped of citizenship were excluded, women pressured out of work were uncounted, unmarried men in RAD were counted as employed, and political prisoners in camps were omitted."
    },
    {
      type: "youtube",
      id: "88Yoy6L2tXM",
      url: "https://www.youtube.com/watch?v=88Yoy6L2tXM",
      title: "Strength Through Joy (1938) | British Pathé Archival Film",
      duration: "1 mins 06 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–01:06 | Lesson Phase: Kraft durch Freude (KdF) | Tone Alert: Authentic 1938 newsreel footage of workers boarding subsidized cruise liners to Madeira and the Norwegian fjords.",
      viewing_task: "[00:25] Primary Source Observation: How does this 1938 newsreel present the recreational activities of ordinary German industrial workers?\n[00:50] Purpose of KdF: Why did Dr Robert Ley and the German Labour Front (DAF) invest heavily in affordable leisure and vacations?",
      model_answer: "The newsreel portrays happy, sunbathing factory workers enjoying luxury ocean cruises previously reserved only for the wealthy elite. Robert Ley used KdF to reward hard work, pacify workers whose trade unions and strikes had been banned, and boost industrial productivity for rearmament."
    },
    {
      type: "youtube",
      id: "3jTW2b3oGCc",
      url: "https://www.youtube.com/watch?v=3jTW2b3oGCc",
      title: "The Nazi's Relationship with Volkswagen | History's Darkest Questions",
      duration: "4 mins 15 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–04:00 | Lesson Phase: Standard of Living Reality | Tone Alert: Explores Ferdinand Porsche's People's Car (KdF-Wagen), the stamp savings scheme, and how workers' money was diverted to military jeeps.",
      viewing_task: "[01:10] The Promise: How was the KdF-Wagen (Volkswagen Beetle) marketed to ordinary German families?\n[03:00] The Reality: Did any German workers actually receive their promised car before the outbreak of war in 1939?",
      model_answer: "Hitler promised a car for every German family for just 990 marks, paid via a 5-mark weekly savings stamp book. Not a single consumer received a car; when war broke out in 1939, the Wolfsburg factory was converted to produce Kübelwagen military vehicles, and millions of marks in workers' savings were swallowed by the war effort."
    }
  ],

  // L16: The Persecution of Minorities, 1933–1939
  "lesson_4_4": [
    {
      type: "youtube",
      id: "L52e29SVyYc",
      url: "https://www.youtube.com/watch?v=L52e29SVyYc",
      title: "What Were the Nuremberg Race Laws? | Holocaust Explainer (USHMM)",
      duration: "2 mins 35 secs",
      pathway: "Starter Hook",
      teacher_guidance: "Recommended Watch Window: 00:00–02:35 | Lesson Phase: Legal Persecution | Tone Alert: Explains the Reich Citizenship Law and Law for the Protection of German Blood and German Honor passed in September 1935.",
      viewing_task: "[00:45] Loss of Citizenship: How did the Reich Citizenship Law legally distinguish between 'citizens of the Reich' and 'subjects'?\n[01:40] Racial Boundaries: What prohibitions did the Law for the Protection of German Blood enforce regarding marriage and relationships?",
      model_answer: "Only persons of 'German or related blood' were citizens with full political rights; Jews and Roma were stripped of citizenship and reduced to rightless state subjects. The Blood Protection Law outlawed marriages and sexual relations between Jews and German citizens, criminalising infractions as 'racial defilement' (Rassenschande)."
    },
    {
      type: "youtube",
      id: "mQ1E6wO9jXQ",
      url: "https://www.youtube.com/watch?v=mQ1E6wO9jXQ",
      title: "What Was Kristallnacht in the Holocaust? | Holocaust Explainer (USHMM)",
      duration: "3 mins 11 secs",
      pathway: "Enquiry Depth",
      teacher_guidance: "Recommended Watch Window: 00:00–03:11 | Lesson Phase: State-Sponsored Violence | Tone Alert: Explores the Night of Broken Glass (9–10 November 1938), the assassination of Ernst vom Rath, and the violent nationwide pogrom.",
      viewing_task: "[00:50] The Pretext: What event in Paris did Joseph Goebbels seize upon to orchestrate the Kristallnacht pogrom?\n[02:00] Scale of Destruction: What was the physical toll of Kristallnacht across Germany, Austria, and the Sudetenland?",
      model_answer: "The assassination of German diplomat Ernst vom Rath by 17-year-old Polish Jewish youth Herschel Grynszpan in Paris was exploited by Goebbels as an excuse for an alleged 'spontaneous' demonstration. Over 1,000 synagogues were burned, 7,500 Jewish-owned shops were ransacked, at least 91 Jews were murdered, and 30,000 Jewish men were arrested and sent to concentration camps."
    },
    {
      type: "youtube",
      id: "G7W8fT83h_k",
      url: "https://www.youtube.com/watch?v=G7W8fT83h_k",
      title: "The Night of Broken Glass: Kristallnacht 1938 | The Pacifist",
      duration: "4 mins 04 secs",
      pathway: "Cinematic",
      teacher_guidance: "Recommended Watch Window: 00:00–04:04 | Lesson Phase: Culmination & Aftermath | Tone Alert: Documents the 1 billion mark fine levied on the Jewish community, the confiscation of insurance payouts, and forced emigration.",
      viewing_task: "[01:30] State Extortion: How did Hermann Göring punish the victimised Jewish community following the destruction of Kristallnacht?\n[03:10] Turning Point: Why does Kristallnacht mark the decisive turning point from legislative discrimination to open violent terror?",
      model_answer: "Göring imposed a collective collective fine of 1 billion marks on the Jewish community for 'damage to the German economy' and confiscated all insurance payouts. It showed the world that the Nazi state would openly unleash mob violence, mass arrests without trial, and concentration camp deportation in broad daylight, marking the end of any secure Jewish existence in Germany."
    }
  ]
};

// Apply to all 16 lessons
let updatedCount = 0;
for (const lesson of weimarData.lessons) {
  if (weimarVideoMap[lesson.id]) {
    lesson.video = weimarVideoMap[lesson.id];
    updatedCount++;
    console.log(`Updated ${lesson.id} (${lesson.title}) with ${lesson.video.length} verified videos.`);
  } else {
    console.warn(`WARNING: No video mapping for ${lesson.id}`);
  }
}

const updatedContent = 'export default ' + JSON.stringify(weimarData, null, 2) + ';\n';
fs.writeFileSync(dataJsPath, updatedContent, 'utf8');
fs.writeFileSync(pubDataJsPath, updatedContent, 'utf8');

console.log(`\nSuccessfully updated ${updatedCount} lessons in both units/weimar_nazi_germany/data.js and public/units/weimar_nazi_germany/data.js!`);

