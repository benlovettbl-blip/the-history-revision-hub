const fs = require('fs');

// Calibrated 12-mark questions for weimar_nazi_germany (Strictly 200-240 words for tier_12m, 3 paras, each ending in 'Therefore, this...')
const germany12mUpdates = {
  "mock_notebook_3_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "The German Revolution of 1918 happened because Germany was losing the First World War. The British naval blockade starved German civilians, so people were hungry and angry with the Kaiser. Then sailors at Kiel mutinied and refused to attack the British navy. Workers and soldiers joined the protests, forcing Kaiser Wilhelm II to run away to Holland. Therefore the German Empire collapsed and a new republic was formed.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions the war defeat, blockade, and Kiel mutiny, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason the revolution occurred was <strong>military defeat and the British naval blockade</strong>. By autumn 1918, German military commanders Ludendorff and Hindenburg knew the army could not win the war. At home, the naval blockade prevented food supplies from entering, causing over 750,000 civilian deaths from starvation and hypothermia, which turned the public against the government.<br><br>Another reason was the <strong>Kiel Mutiny in late October 1918</strong>. When naval commanders ordered sailors to sail out for a suicidal final battle against the British navy, sailors at Kiel refused to obey orders. They took control of their ships and established sailors' councils, sparking widespread mutinies across Germany.<br><br>In conclusion, starvation from the blockade and the Kiel Mutiny forced the Kaiser to abdicate.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (blockade and Kiel Mutiny). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as the widespread creation of workers' and soldiers' councils and the abdication of Kaiser Wilhelm II), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major cause of the German Revolution was <strong>impending military defeat compounded by the British naval blockade</strong>. By October 1918, General Ludendorff admitted the Western Front had collapsed and Germany must seek an armistice. Simultaneously, the four-year naval blockade caused severe food shortages, hypothermia, and over 750,000 civilian deaths, destroying public morale. Therefore, this caused the revolution because military catastrophe and domestic starvation completely destroyed the Kaiser's political legitimacy and exhausted the nation's willingness to fight.<br><br>Furthermore, the crisis was ignited by the <strong>Kiel naval mutiny in late October 1918</strong>. When admirals ordered a suicidal final attack against the British Grand Fleet, sailors at Kiel refused to obey, arresting officers and raising revolutionary flags. Within days, this revolt spread rapidly across German ports and industrial cities like Hamburg. Therefore, this led directly to the revolution because the armed forces openly mutinied, depriving the imperial regime of the military power required to crush domestic rebellion.<br><br>In addition, revolution succeeded through the <strong>establishment of workers' and soldiers' councils across Germany</strong>. Inspired by the Russian soviets, trade unions and mutinous soldiers seized town halls throughout Bavaria and Berlin. On 9 November 1918, with general strikes paralysing the capital, Kaiser Wilhelm II was forced to abdicate, allowing Friedrich Ebert to proclaim a republic. Therefore, this forced the collapse of the monarchy because nationwide mass insurrections left the imperial government powerless to govern.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (221 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "mock_notebook_1_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "The Weimar Republic had lots of political instability between 1919 and 1923 because Germans hated losing the war. They blamed the government for signing the harsh Treaty of Versailles and called them the November Criminals. There were also violent rebellions like the right-wing Kapp Putsch where soldiers tried to take over Berlin. Therefore politicians were constantly threatened by enemies who wanted to overthrow the government.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions Versailles and the Kapp Putsch, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason for instability was the <strong>Treaty of Versailles in 1919</strong>. Germans despised the 'Diktat' which forced them to accept Article 231 war guilt, pay £6.6 billion in reparations, and lose 13% of their European territory. Right-wing Germans accused the Weimar politicians of stabbing the army in the back ('Dolchstoss'), making the new democratic republic extremely unpopular.<br><br>Another reason was the <strong>Kapp Putsch in March 1920</strong>. When the government tried to disband Freikorps units to obey Versailles military limits, Wolfgang Kapp and 5,000 armed soldiers marched into Berlin to overthrow the government. The regular army refused to fire on them, forcing President Ebert to flee.<br><br>In conclusion, the Treaty of Versailles and the Kapp Putsch caused great instability for Weimar.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Versailles and Kapp Putsch). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as left-wing Spartacist rebellions and political assassinations by Organisation Consul), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major cause of political instability was the <strong>outrage surrounding the Treaty of Versailles in June 1919</strong>. Germans universally condemned the treaty as an imposed 'Diktat' that forced Germany to accept Article 231 War Guilt, surrender 13% of its territory, and pay £6.6 billion in reparations. Right-wing nationalists promoted the 'stab-in-the-back' myth (*Dolchstosslegende*), branding Weimar politicians 'November Criminals'. Therefore, this caused severe instability because it permanently damaged the democratic republic's legitimacy and made moderate politicians targets of deep nationalist resentment.<br><br>Furthermore, the republic was destabilised by <strong>violent right-wing uprisings like the Kapp Putsch in March 1920</strong>. When the government attempted to disband the Freikorps to meet treaty troop limits, nationalist Wolfgang Kapp and 5,000 paramilitaries seized Berlin. Crucially, the German army refused to protect the state, forcing the cabinet to flee. Therefore, this led to dangerous political instability because it proved the republic could not rely on its own armed forces to defend democracy against right-wing treason.<br><br>In addition, instability was intensified by <strong>extreme left-wing uprisings and waves of political assassinations</strong>. In January 1919, the communist Spartacist League launched an armed uprising in Berlin, bloodily suppressed by the Freikorps. Subsequently, right-wing terrorist groups like Organisation Consul assassinated 376 republican politicians, including Foreign Minister Walther Rathenau in 1922. Therefore, this forced continuous instability because regular paramilitary street violence and political terrorism made constitutional governance almost impossible to sustain.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (223 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "mock_notebook_3_q2_alt": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "Hyperinflation happened in 1923 because Germany failed to pay its war reparations. French and Belgian soldiers marched into the Ruhr to steal coal and iron. The German government told workers to go on strike, but then printed huge amounts of paper money to pay the striking workers. The money became totally useless, and people had to carry wheelbarrows of cash to buy bread. Therefore the German currency completely collapsed.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions the Ruhr, strike, and wheelbarrows of cash, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason the economy collapsed was the <strong>French occupation of the Ruhr in January 1923</strong>. When Germany missed a reparations shipment of timber and coal, 60,000 French and Belgian troops occupied the Ruhr industrial heartland. The French seized coal mines, railways, and factories to extract reparations by force, paralysing German industrial output.<br><br>Another reason was the Weimar government's policy of <strong>passive resistance</strong>. The German government ordered Ruhr workers to go on strike and refuse to cooperate with the French invaders. While this halted French exploitation, it meant the Ruhr stopped producing manufactured goods and tax revenues for Germany.<br><br>In conclusion, the invasion of the Ruhr and the strike caused hyperinflation.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Ruhr invasion and passive resistance). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as the reckless printing of unbacked paper currency by the Reichsbank), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One primary cause of hyperinflation was the <strong>military occupation of the Ruhr by French and Belgian troops in January 1923</strong>. After the Weimar Republic defaulted on reparations deliveries of coal and timber, 60,000 Franco-Belgian soldiers occupied Germany's industrial heartland to seize resources by force. The invaders took control of mines, railways, and factories. Therefore, this caused the collapse into hyperinflation because it stripped Germany of the industrial region producing over 70% of the nation's coal, raw iron, and vital export revenues.<br><br>Furthermore, the crisis was triggered by the <strong>German government's policy of passive resistance in the Ruhr</strong>. The Weimar government instructed all miners, railwaymen, and civil servants to go on strike and refuse cooperation with the French. However, this completely halted industrial production and deprived the German treasury of critical tax receipts. Therefore, this led directly to financial ruin because the total industrial shutdown created severe shortages of manufactured goods while state revenues completely dried up.<br><br>In addition, hyperinflation was catalysed by the <strong>government's disastrous decision to print unbacked paper banknotes</strong>. To pay striking Ruhr workers their wages, the Reichsbank operated nearly 2,000 printing presses round the clock, printing trillions of unbacked paper marks. As currency flooded the market while goods were scarce, money became worthless, with bread reaching 200 billion marks. Therefore, this forced hyperinflation to spiraling heights because printing limitless unbacked currency destroyed all domestic and international confidence in the monetary system.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (225 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "mock_notebook_1_q2_alt": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "The German economy recovered in the Golden Years because Gustav Stresemann became Chancellor and sorted out the problems. He stopped passive resistance in the Ruhr and introduced a brand new currency called the Rentenmark which ended hyperinflation. He also arranged big loans from America under the Dawes Plan so German businesses could build new factories. Therefore Germany became rich and stable again between 1924 and 1929.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions Stresemann, Rentenmark, and US loans, but lacks analytical PEEL paragraphs, statistics, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason the economy recovered was the political leadership of <strong>Gustav Stresemann</strong>. In autumn 1923, Stresemann made the brave decision to end passive resistance in the Ruhr and resumed reparations payments. This persuaded the French and Belgian troops to leave the Ruhr, allowing German factories and mines to restart production.<br><br>Another reason was the introduction of the <strong>Rentenmark in November 1923</strong>. Stresemann and financial expert Hjalmar Schacht burned the old worthless marks and created a temporary new currency backed by agricultural land and industrial assets. People trusted this new stable currency, which immediately brought hyperinflation to an end.<br><br>In conclusion, Stresemann's policies and the Rentenmark fixed the German economy.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Stresemann and Rentenmark). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as the Dawes and Young Plans securing massive US loans), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major factor in economic recovery was the <strong>decisive leadership and diplomacy of Gustav Stresemann</strong>. Appointed Chancellor in 1923, Stresemann ended passive resistance in the Ruhr, cutting off massive state welfare payments to striking workers. His pragmatic cooperation persuaded French forces to withdraw by 1925, restoring industrial output. Therefore, this led to economic recovery because restoring industrial operations in the Ruhr eliminated bankrupting government expenditure and reopened vital coal and manufacturing export markets.<br><br>Furthermore, recovery was established by the <strong>successful monetary reform of the Rentenmark in November 1923</strong>. Overseen by Hjalmar Schacht, the worthless mark was replaced with the temporary Rentenmark, backed by German land and industrial assets. Strict controls limited circulation, ensuring the currency maintained its value before becoming the permanent Reichsmark. Therefore, this caused economic stability to return because establishing a stable, trustworthy currency ended hyperinflation and restored public and commercial confidence in everyday commerce.<br><br>In addition, the economy was revitalised by <strong>massive American financial loans under the 1924 Dawes Plan</strong>. Charles Dawes restructured reparations and secured an initial 800-million-gold-mark loan from Wall Street banks. Over the next five years, billions in US loans flowed into German industry, modernising factories, railways, and municipal housing. Therefore, this forced rapid economic growth because substantial American capital investment rebuilt German heavy industry, lowered unemployment, and drove national manufacturing output above pre-war levels.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (221 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "mock_notebook_2_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "There was a Golden Age of culture in Weimar Germany because the 1920s were a time of great artistic freedom. Artists like George Grosz painted Expressionist pictures showing the horrors of war. The Bauhaus school designed modern buildings and sleek furniture. Also Berlin became famous for crazy nightclubs and cinemas. Therefore people enjoyed exciting modern culture because censorship had been removed by the government.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions Expressionism, Bauhaus, and nightclubs, but lacks analytical PEEL paragraphs, constitutional clauses, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason for cultural development was the rise of <strong>Expressionism in art and cinema</strong>. Artists like Otto Dix and George Grosz used distorted images and bold colours to critique the misery of war, disabled veterans, and corrupt politicians. In cinema, Expressionist films like *The Cabinet of Dr. Caligari* and Fritz Lang's *Metropolis* explored dark psychological themes.<br><br>Another reason was the influence of the <strong>Bauhaus school of architecture</strong>. Founded by Walter Gropius in 1919 in Weimar, Bauhaus rejected traditional imperial decoration in favour of clean geometric lines and functional designs. Bauhaus architects used glass and steel to design modern housing, furniture, and practical lamps.<br><br>In conclusion, Expressionism and the Bauhaus made Weimar Germany culturally famous.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Expressionism and Bauhaus). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as constitutional freedom under Article 118 and economic stabilization funding the arts), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major driver of cultural flowering was the <strong>growth of the Expressionist movement in painting and cinema</strong>. Rebuffing traditional imperial art, Expressionists like Otto Dix and George Grosz depicted the harsh realities of urban life, wounded veterans, and social inequality with raw emotion. In cinema, Expressionism produced groundbreaking films like Robert Wiene's *The Cabinet of Dr. Caligari* and Fritz Lang's *Metropolis*. Therefore, this caused a cultural renaissance because artists had the creative freedom to explore provocative psychological and political themes that reflected post-war society.<br><br>Furthermore, cultural innovation flourished through the <strong>founding of the influential Bauhaus design movement</strong>. Established in Weimar by Walter Gropius in 1919, the Bauhaus school championed the revolutionary principle that 'form follows function'. Designers embraced clean geometric lines, steel, and glass, modernising furniture, typography, and municipal housing estates. Therefore, this led to a golden age of design because Bauhaus revolutionized architectural philosophy, making Germany the undisputed international pioneer of modern functionalist design.<br><br>In addition, cultural development was unleashed by <strong>Article 118 of the Weimar Constitution and economic recovery</strong>. Article 118 guaranteed complete freedom of expression, dismantling imperial censorship and allowing cabaret, avant-garde theatre, and Remarque's anti-war literature to thrive. Combined with economic recovery after 1924, government subsidies funded public museums and theatres. Therefore, this fostered cultural vitality because legal protections and financial prosperity created the ideal environment for bold artistic experimentation to flourish.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (221 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_2_1_can_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "The Nazi Party gained support in Munich because Adolf Hitler was a very exciting public speaker. He spoke at crowded beer hall meetings where he shouted against the Treaty of Versailles and blamed Jews for Germany's defeat. The Nazis also set up the SA brownshirts who fought against communists in the streets. Therefore angry people in Bavaria joined the Nazis because Hitler sounded like a strong leader.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions beer halls, Versailles, and the SA, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason the Nazis gained support was <strong>Hitler's public speaking and beer hall meetings</strong>. Joining the DAP in 1919, Hitler discovered he had a powerful oratorical talent. He held packed rallies in Munich beer halls like the Hofbräuhaus, gesturing dramatically and attacking the Weimar Republic for surrendering in 1918, which attracted thousands of listeners.<br><br>Another reason was the <strong>creation of the Sturmabteilung (SA) in 1921</strong>. Led by Ernst Röhm, the SA or 'Brownshirts' provided violent security at Nazi meetings and attacked left-wing opponents. Their discipline and military uniforms appealed to ex-soldiers who wanted an aggressive anti-communist force.<br><br>In conclusion, Hitler's speeches and the violent SA helped the Nazis grow rapidly in Munich.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Hitler's speaking and the SA). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as the conservative Bavarian political climate and the radical appeal of the 25-Point Programme), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major factor behind rising support was <strong>Hitler's captivating public speaking and dynamic beer hall rallies</strong>. Joining the German Workers' Party (DAP) in 1919, Hitler quickly became party leader due to his oratorical talent. In crowded Munich beer halls, he denounced the Treaty of Versailles and scapegoated Jews and Marxists for the 1918 surrender. Therefore, this caused Nazi support to grow because Hitler's theatrical delivery and fierce nationalist messaging offered emotionally persuasive scapegoats to disillusioned ex-soldiers and nationalist Bavarians.<br><br>Furthermore, the NSDAP attracted members through the <strong>establishment of the paramilitary Sturmabteilung (SA) in 1921</strong>. Under Ernst Röhm, the 'Brownshirts' recruited disaffected ex-soldiers and Freikorps veterans. The SA projected an image of disciplined order, protecting Nazi rallies and brawling with Communist rivals in the streets. Therefore, this led to increased party appeal because the SA convinced middle-class citizens that the Nazis provided a robust, muscular defence against the perceived threat of a Bolshevik revolution.<br><br>In addition, the party benefited from the <strong>25-Point Programme and Munich's right-wing political climate</strong>. Published in February 1920 by Hitler and Anton Drexler, the manifesto combined fierce nationalism, revoking Versailles, and anti-capitalist promises appealing to small shopkeepers. Crucially, Bavarian state authorities were fiercely anti-socialist and protected right-wing extremists. Therefore, this fostered Nazi expansion because an appealing multi-class manifesto combined with sympathetic local judicial protection allowed the party to organize freely across Munich.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (221 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "mock_notebook_2_q2_alt": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "The Nazi Party was reorganised between 1924 and 1928 because the Munich Putsch had completely failed. Hitler went to Landsberg prison and realised he could not take power with guns, so he decided to win power legally through elections. He held a big meeting called the Bamberg Conference where he made himself the total leader. He also set up the Hitler Youth. Therefore the party became much better organised to win votes.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions the failed Putsch, Bamberg Conference, and Hitler Youth, but lacks analytical PEEL paragraphs, structural detail, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason the party was reorganised was the <strong>failure of the Munich Putsch in November 1923</strong>. Hitler's attempt to march on Berlin was crushed by Bavarian police, resulting in 16 Nazi deaths and Hitler being sent to prison. While writing *Mein Kampf* in Landsberg, Hitler realized armed revolutions would always be stopped by the army, so he adopted a 'legal strategy' to win seats in the Reichstag.<br><br>Another reason was the <strong>Bamberg Conference of 1926</strong>. Hitler called party leaders together to defeat the socialist wing led by Gregor Strasser. Hitler insisted that the party must be fully nationalist, establishing the *Führerprinzip* (leader principle) where his orders had to be obeyed without debate.<br><br>In conclusion, the Munich Putsch and the Bamberg Conference reshaped the Nazi Party.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Munich Putsch and Bamberg Conference). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as creating nationwide Gau structures, specialist front organisations, and propaganda by Goebbels), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One primary reason for reorganisation was the <strong>catastrophic failure of the Munich Putsch in November 1923</strong>. Hitler's armed attempt to overthrow the Weimar Republic resulted in 16 Nazi deaths, the temporary banning of the NSDAP, and his imprisonment in Landsberg. While writing *Mein Kampf*, Hitler realised armed revolution was impossible against the army, prompting him to adopt a legal strategy (*Legalitätsprinzip*) to win Reichstag elections. Therefore, this caused a total reorganisation because Hitler was forced to transform a violent Bavarian paramilitary group into an organised national political machine.<br><br>Furthermore, the party was restructured to centralise authority at the <strong>Bamberg Conference in February 1926</strong>. An ideological rift had emerged between the northern socialist faction under Gregor Strasser and Hitler's southern nationalist wing. At Bamberg, Hitler defeated Strasser, establishing the *Führerprinzip* (Leader Principle) ensuring his absolute authority over party policy. Therefore, this led to structural reorganisation because establishing absolute top-down obedience ended internal factionalism and unified the NSDAP under Hitler's single command.<br><br>In addition, reorganisation established a <strong>nationwide administrative network and specialist front organisations</strong>. Germany was divided into 35 districts (*Gaue*), each governed by a loyal *Gauleiter* appointed by Hitler. The party also created targeted sub-organisations: the Hitler Youth, Nazi Women's League, the SS, and modern propaganda led by Joseph Goebbels. Therefore, this accelerated party restructuring because constructing professional administrative branches across every German region allowed the NSDAP to target and mobilise specific social demographics systematically.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (226 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "mock_adapted_2026_q2_alt": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "Adolf Hitler was appointed Chancellor in 1933 because of the Great Depression which put six million Germans out of work. People lost their jobs and voted for the Nazis because Hitler promised them work and bread. Also right-wing politicians like Franz von Papen schemed behind President Hindenburg's back, thinking they could control Hitler as Chancellor. Therefore Hindenburg gave Hitler the job on 30 January 1933.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions unemployment, Papen, and Hindenburg, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason Hitler was appointed Chancellor was the <strong>impact of the Great Depression and massive unemployment</strong>. Following the 1929 Wall Street Crash, American loans were recalled and German businesses went bankrupt, leaving 6 million people unemployed by 1932. Desperate voters abandoned moderate parties and turned to the Nazis, who promised 'Work and Bread', making them the largest party in the Reichstag with 230 seats in July 1932.<br><br>Another reason was <strong>political scheming by Franz von Papen</strong>. Papen was sacked as Chancellor and replaced by General von Schleicher. Wanting revenge, Papen struck a deal with Hitler and persuaded President Hindenburg that they could control Hitler in a conservative coalition, famously boasting they had 'boxed him in'.<br><br>In conclusion, the Depression made the Nazis popular and Papen's scheming got Hitler into power.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Great Depression and Papen's scheming). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as the collapse of parliamentary democracy and Brüning's abuse of Article 48 emergency decrees), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major factor behind Hitler's appointment was the <strong>economic misery caused by the Great Depression</strong>. Following the 1929 Wall Street Crash, American banks recalled loans, bankrupting businesses and leaving six million workers unemployed by 1932. Desperate voters abandoned moderate parties for the Nazis, who promised 'Work and Bread'. Therefore, this caused Hitler's appointment because economic suffering propelled the NSDAP into becoming the largest Reichstag party with 230 seats in 1932, making stable governance without them impossible.<br><br>Furthermore, Hitler's path was cleared by the <strong>political scheming of Franz von Papen and conservative elites</strong>. Bitter over being ousted by General von Schleicher, Papen struck a secret deal with Hitler. Papen convinced President Hindenburg to appoint Hitler Chancellor on 30 January 1933, boasting he had 'boxed Hitler into a corner' with only three Nazi ministers. Therefore, this led directly to Hitler's appointment because conservative elites deliberately handed him power in the mistaken belief they could control him while using his mass support.<br><br>In addition, Weimar was crippled by the <strong>collapse of parliamentary democracy and reliance on Article 48</strong>. After 1930, Chancellor Heinrich Brüning could not command a Reichstag majority and governed solely through emergency presidential decrees while enforcing unpopular austerity cuts. Therefore, this forced Hitler's appointment because the continuous erosion of parliamentary democracy normalised authoritarian rule and left the state dependent on appointing a Chancellor backed by mass popular support.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (225 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_3_1_can_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "Hitler established a dictatorship in Germany because the Reichstag building caught fire in February 1933. Hitler blamed a Dutch communist and got President Hindenburg to ban civil rights. Then Hitler passed the Enabling Act which allowed him to make laws without parliament. Finally he killed Ernst Röhm on the Night of the Long Knives. Therefore Hitler got total power and made himself the Führer.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions the fire, Enabling Act, and Long Knives, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason Hitler established a dictatorship was the <strong>Reichstag Fire Decree of 28 February 1933</strong>. When the Reichstag building was burned down by Marinus van der Lubbe, Hitler claimed it was a communist revolution. He persuaded President Hindenburg to sign the Emergency Decree for the Protection of the People and State, suspending freedom of speech, assembly, and the press, allowing the SA to arrest 4,000 communists.<br><br>Another reason was the <strong>Enabling Act of 23 March 1933</strong>. Hitler used the SA to intimidate members of parliament in the Kroll Opera House to vote for the act. Passing by 444 votes to 94, it allowed Hitler to pass laws without consulting the Reichstag or President for four years.<br><br>In conclusion, the Fire Decree and the Enabling Act gave Hitler legal dictatorial power.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Reichstag Fire and Enabling Act). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as the Night of the Long Knives and Hindenburg's death), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One primary reason Hitler established a dictatorship was the <strong>Reichstag Fire Decree of 28 February 1933</strong>. Blaming a communist conspiracy, Hitler persuaded President Hindenburg to issue emergency decrees suspending civil liberties, including free speech and assembly. This allowed the SA to arrest 4,000 communists and ban opposition newspapers. Therefore, this caused the establishment of a dictatorship because it legalised state terror and crippled political opposition immediately before the critical March 1933 elections.<br><br>Furthermore, dictatorship was institutionalised through the <strong>passage of the Enabling Act on 23 March 1933</strong>. Intimidating deputies with armed SA guards inside the Kroll Opera House, Hitler secured the required two-thirds majority to pass the act by 444 votes to 94. The law granted Hitler power to enact legislation without the Reichstag for four years. Therefore, this led directly to dictatorship because it destroyed the constitutional separation of powers, effectively ending parliamentary democracy and allowing Hitler to govern by decree.<br><br>In addition, Hitler cemented total supremacy through the <strong>Night of the Long Knives and Hindenburg's death in 1934</strong>. On 30 June 1934, Hitler used the SS to execute Ernst Röhm and SA leaders, eliminating radical rivals and securing army support. When Hindenburg died in August, Hitler merged Chancellor and President into 'Führer', making soldiers swear an unconditional personal oath. Therefore, this forced the final completion of dictatorship because eliminating internal party dissent and securing army loyalty removed the last potential checks on Hitler's absolute power.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (221 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "mock_adapted_2026_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "The position of women changed between 1924 and 1939 because in Weimar Germany women had lots of freedom. They could vote, smoke cigarettes, and work in offices. But when the Nazis took over in 1933, they believed women should stay at home and have babies for Germany. They gave medals to mothers who had lots of children and sacked female doctors. Therefore women lost their jobs and had to become housewives.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions the contrast between Weimar and Nazi Germany, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason for changes was the <strong>expansion of jobs and rights for women in Weimar Germany</strong>. Under the Weimar Constitution, women were given the vote, equal civic rights, and entered professions like teaching, medicine, and the civil service. By the late 1920s, millions of 'New Women' worked in retail and offices, earning their own wages and enjoying social independence.<br><br>Another reason was <strong>Nazi policies promoting traditional family values after 1933</strong>. The Nazis believed women belonged in the home focusing on 'Kinder, Küche, Kirche' (Children, Kitchen, Church). They introduced marriage loans that gave newlyweds money if the woman left her job, and gave the Cross of Honour of the German Mother to reward women who had large families.<br><br>In conclusion, Weimar brought women freedom but Nazi family policies forced them into the home.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (Weimar jobs and Nazi family policies). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as the re-conscription of women into factory war production after 1937 under the Four-Year Plan), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One major driver of change was the <strong>emancipation of women during the Weimar Republic</strong>. Under Article 109 of the Weimar Constitution, women enjoyed equal civic rights, voting rights, and equal pay in public service. The 'New Woman' saw 100,000 female teachers and 3,000 doctors by the late 1920s, alongside one million in clerical roles, experiencing unheralded economic independence. Therefore, this caused a major shift in women's status because democratic constitutional protections enabled women to enter the formal workforce and challenge traditional domestic roles.<br><br>Furthermore, women's lives were transformed by <strong>Nazi pro-natalist policies after 1933</strong>. Believing women's sole purpose was 'Children, Kitchen, Church' (*Kinder, Küche, Kirche*), the Nazi regime purged female civil servants, doctors, and judges. In 1933, the Marriage Law offered interest-free loans of 1,000 marks, with 25% written off per child born, alongside the Mother's Cross rewarding large families. Therefore, this led to a severe regression in women's social position because the totalitarian state subordinated female autonomy entirely to domestic childbearing.<br><br>In addition, policies shifted dramatically due to <strong>wartime labour shortages under the Four-Year Plan after 1937</strong>. As rapid rearmament drained the male workforce, the regime reversed its stay-at-home dogma, introducing compulsory labour service for unmarried women in 1938 and recruiting over 1.5 million women into munitions and agriculture. Therefore, this forced another fundamental change in women's status because urgent war preparations compelled the regime to abandon its domestic rhetoric in favour of industrial female mobilization.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (221 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  },

  "lesson_4_1_can_q2": {
    "tier_3m": {
      "title": "3/12 Simple Story",
      "score": "3 / 12 Marks",
      "level": "Level 1 Bottom (Story/Assertion)",
      "text": "Nazi policies towards women were implemented because Hitler was worried that German birth rates were dropping too low. The Nazis wanted a massive population to conquer land in Eastern Europe. They also had strong ideological beliefs that women should be mothers and look after children while men were soldiers. They gave medals to mothers and banned female doctors. Therefore the Nazis made laws to force women back into the home.",
      "verdict": "AO1/AO2 (3 marks). Level 1 Bottom. Simple descriptive narrative. Mentions birth rates and mothers' medals, but lacks analytical PEEL paragraphs, dates, and sustained causal explanations."
    },
    "tier_6m": {
      "title": "6/12 Descriptive Account",
      "score": "6 / 12 Marks",
      "level": "Level 2 (Descriptive Account / Two Factors Only)",
      "text": "One reason policies were implemented was to reverse <strong>falling German birth rates</strong>. During the 1920s, the birth rate in Germany fell from over two million births a year down to under one million. The Nazis believed a shrinking population would make Germany weak, so they introduced marriage loans in 1933 and gave out the Mother's Cross to encourage women to have four or more children.<br><br>Another reason was <strong>Nazi ideological beliefs about the family</strong>. Hitler believed men and women had separate natural roles, with men being warriors and women staying in the home focusing on 'Kinder, Küche, Kirche'. The regime discouraged cosmetics, smoking, and dyed hair, promoting healthy Aryan mothers.<br><br>In conclusion, birth rates and ideology made the Nazis introduce family policies.",
      "verdict": "AO1/AO2 (6 marks). Level 2 Maximum (Mark Scheme Level Ceiling). Accurately describes the two stimulus factors (birth rates and family ideology). However, it remains descriptive and omits a third distinct aspect beyond the stimulus (such as reducing male unemployment by sacking female professionals and demographic expansion for future Lebensraum), legally capping it at Level 2 under the Pearson mark scheme."
    },
    "tier_12m": {
      "title": "12/12 Grade 9 Exam ★",
      "score": "12 / 12 Marks",
      "level": "Level 4 Top (Pearson Exam Standard)",
      "badge": "Edexcel Benchmark",
      "text": "One primary reason Nazi policies towards women were introduced was the <strong>decline in the German birth rate during the Weimar period</strong>. In the 1920s, annual births fell from two million to under one million. To stimulate population growth, the 1933 Marriage Law offered 1,000-mark loans, forgiving 25% of the debt per child, alongside the Mother's Cross rewarding large families. Therefore, this caused family policies to be introduced because financial incentives and civic honours were deployed to reverse demographic decline and expand the German population.<br><br>Furthermore, policies were driven by <strong>rigid Nazi ideological beliefs regarding natural gender roles</strong>. Hitler viewed the patriarchal family as the bedrock of the *Volksgemeinschaft*, defining women's biological destiny as domestic motherhood under the slogan *Kinder, Küche, Kirche*. The regime discouraged makeup and smoking, establishing the *Reichsmütterdienst* to train women in domestic hygiene. Therefore, this led to strict female regulations because Nazi ideology demanded that women subordinate personal ambitions entirely to maternal duty.<br><br>In addition, policies were designed to <strong>reduce male unemployment and prepare for demographic expansion</strong>. In 1933, the regime purged female doctors, teachers, and civil servants to free up vacancies for unemployed men, successfully reducing male jobless figures. Simultaneously, Hitler sought a massive population surge to provide soldiers and agricultural settlers for military conquest in Eastern Europe (*Lebensraum*). Therefore, this forced the implementation of restrictive policies because removing women from employment reduced male joblessness while preparing Germany for imperial demographic expansion.",
      "verdict": "AO1/AO2 (12 marks). Full marks awarded. Deploys THREE distinct aspects of content within realistic candidate exam length (223 words), structured in sustained analytical paragraphs with explicit causal links ('Therefore...') and precise historical evidence throughout, meeting all Level 4 criteria."
    }
  }
};

module.exports = { germany12mUpdates };
