const fs = require('fs');

const weimarPath = 'data/weimar_nazi_germany.json';
const d = JSON.parse(fs.readFileSync(weimarPath, 'utf8'));
const wbData = JSON.parse(fs.readFileSync('scripts/weimar_workbook_ground_truth.json', 'utf8'));

// High quality 12m and 4m models for Weimar
const models = [
  {
    lessonNum: 1,
    q12m_model: "<p>One major reason why the Weimar Republic was established was the outbreak of the German Revolution and naval mutinies in November 1918. Refusing suicidal orders to engage the British fleet, sailors mutinied at Kiel and Wilhelmshaven, establishing workers' and soldiers' councils that spread rapidly across Germany. Fearing a violent communist revolution like the Bolshevik takeover in Russia, Chancellor Max von Baden announced the Kaiser's abdication on 9 November, and SPD leader Friedrich Ebert formed a provisional republic to restore democratic order.</p><p>Furthermore, establishment was driven by Germany’s catastrophic military defeat in the First World War. Following the failure of the 1918 Spring Offensive and the breakthrough of Allied forces on the Western Front, the Supreme Army Command under Field Marshal Hindenburg and General Ludendorff recognized that Germany could not win. They advised the government to establish a democratic parliamentary system to secure more favorable armistice terms from US President Woodrow Wilson.</p><p>Finally, the Allied powers, particularly US President Woodrow Wilson, made the removal of autocratic militarism and the Kaiser a mandatory condition for peace. To stop the starvation caused by the Allied naval blockade and prevent a total Allied military invasion of Germany, democratic politicians in the Reichstag drafted a progressive democratic constitution at Weimar in 1919.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that German civilians and returning soldiers were suffering from extreme starvation and economic exhaustion in November 1918.<br><strong>Details in the source that tell me this:</strong><br>The British journalist describes 'silent, emaciated crowds' with faces 'yellow from starvation' and no bread in the bakeries.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that imperial government authority had completely broken down into revolutionary unrest.<br><strong>Details in the source that tell me this:</strong><br>The source observes 'red flags hang from government windows' while soldiers sit begging on street curbs.</p>"
  },
  {
    lessonNum: 2,
    q12m_model: "<p>One major reason the Weimar Republic faced severe challenges was the outrage caused by <strong>the Treaty of Versailles (1919)</strong>. Signed in June 1919, the treaty imposed the devastating Article 231 War Guilt clause, £6.6 billion in reparations, lost 13% of German European territory, and drastically reduced the army to 100,000 men. German nationalists condemned the Weimar politicians as the 'November Criminals' who had 'stabbed Germany in the back' (the Dolchstoss myth). This fueled right-wing paramilitary putsches, such as the 1920 Kapp Putsch, where Wolfgang Kapp and the Freikorps seized Berlin while the army refused to defend the republic.</p><p>Furthermore, the Republic was threatened by violent uprisings from the extreme left, notably <strong>the Spartacist Uprising of January 1919</strong>. Led by Rosa Luxemburg and Karl Liebknecht, communist revolutionaries seized newspaper offices and attempted to establish a Soviet-style communist state. President Ebert was forced to rely on right-wing Freikorps paramilitaries to violently crush the workers, permanently fracturing the German working class and leaving left-wing parties bitter enemies of the moderate SPD.</p><p>Finally, challenges culminated in <strong>the 1923 French occupation of the Ruhr and runaway hyperinflation</strong>. When Germany missed timber and coal reparations, 60,000 French and Belgian troops occupied the industrial heartland of the Ruhr. The government called for passive resistance and printed trillions of paper marks to pay striking workers, causing catastrophic hyperinflation that destroyed the savings of the middle class and severely undermined faith in democratic institutions.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that the German public felt intense national humiliation and furious indignation toward the Treaty of Versailles.<br><strong>Details in the source that tell me this:</strong><br>The newspaper editorial warns that 'German honor is dragged through the dirt' and vows never to forget the shame.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that right-wing nationalists intended to militarize future generations to seek revenge and overturn the treaty.<br><strong>Details in the source that tell me this:</strong><br>The editor pledges to 'educate our sons for revenge' so the nation will reconquer its rightful position.</p>"
  },
  {
    lessonNum: 3,
    q12m_model: "<p>One decisive reason for economic recovery was <strong>the introduction of the Rentenmark by Gustav Stresemann in November 1923</strong>. As Chancellor, Stresemann abolished the worthless, hyperinflated Old Mark and replaced it with a strictly limited temporary currency backed by agricultural land and industrial mortgages. In 1924, this was converted into the permanent Reichsmark backed by gold reserves under the independent leadership of Hjalmar Schacht at the Reichsbank. This killed hyperinflation, restored public and business confidence in the currency, and created stable conditions for industrial investment.</p><p>Furthermore, recovery was powered by <strong>the Dawes Plan of 1924</strong>, negotiated by Stresemann with the United States. The plan restructured reparations payments to start at 1 billion marks annually and granted Germany an immediate loan of 800 million gold marks from American banks. Over the next five years, American financial institutions invested nearly $3 billion into German industry, enabling municipal councils to build modern housing, schools, roads, and hospitals, while industrial production surpassed pre-war 1913 levels by 1928.</p><p>Finally, Stresemann restored Germany's international position through brilliant diplomacy in <strong>the Locarno Treaties (1925) and admission to the League of Nations (1926)</strong>. By formally accepting Germany's western borders with France and Belgium, Stresemann ended Germany's post-war diplomatic isolation and secured a permanent seat on the League of Nations Council, followed by the 1929 Young Plan which reduced reparations to £2 billion.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that the Rentenmark successfully restored public trust and stability to daily German trade.<br><strong>Details in the source that tell me this:</strong><br>Shopkeepers immediately accepted the new currency without raising prices and wheelbarrows of cash disappeared from streets.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that foreign financial backing was essential in stabilizing the German banking system.<br><strong>Details in the source that tell me this:</strong><br>The source highlights American capital and Dawes Plan loans flowing into German municipal reconstruction projects.</p>"
  },
  {
    lessonNum: 4,
    q12m_model: "<p>One major reason for cultural and social change was <strong>the emergence of the 'New Woman' (Neue Frau)</strong> under the progressive Weimar Constitution. Women gained the vote in 1919 and Article 109 guaranteed equal civil rights. Young, urban, working women embraced financial independence, short bobbed hairstyles, fashionable clothing, and unchaperoned leisure in cafes and dance halls. By 1925, over 36% of the workforce was female, with rising numbers entering professions like medicine, teaching, and clerical office work, challenging traditional patriarchal family expectations.</p><p>Furthermore, artistic transformation was driven by avant-garde movements like <strong>the Bauhaus movement in design and architecture</strong>. Founded by Walter Gropius in Weimar (1919) and later Dessau, Bauhaus pioneered modernist functionalism with the motto 'art into industry', designing sleek steel-and-glass buildings and mass-produced furniture. In painting, Otto Dix and George Grosz created 'New Objectivity' (Neue Sachlichkeit), using raw, biting realism to critique war profiteers, corruption, and social decay.</p><p>Finally, social changes flourished because <strong>the Weimar Constitution abolished imperial censorship and protected free expression</strong>. Berlin became the cultural capital of Europe, renowned for innovative theater directed by Bertolt Brecht, cutting-edge cinema produced at UFA studios (like Fritz Lang's *Metropolis*), and vibrant nightlife, cabaret, and jazz clubs, reflecting the freedom and experimentation of the Golden Twenties.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that young women enjoyed greater personal freedom and independence in Weimar Germany during the 1920s.<br><strong>Details in the source that tell me this:</strong><br>The extract describes working women spending their own earnings on fashionable clothes and enjoying unchaperoned evenings at cabarets.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that traditional conservatives disapproved of modern female lifestyles.<br><strong>Details in the source that tell me this:</strong><br>Traditionalists criticized short haircuts and smoking as unladylike behaviors that threatened traditional family motherhood.</p>"
  },
  {
    lessonNum: 5,
    q12m_model: "<p>One primary reason the Nazi Party developed rapidly in Munich was <strong>Hitler’s personal oratory and charismatic leadership</strong>. Joining the tiny German Workers' Party (DAP) in 1919 as member 555, Hitler transformed the group into the NSDAP (National Socialist German Workers' Party) by 1920. Hitler was an electrifying public speaker in Munich beer halls, exploiting public outrage over the Treaty of Versailles, the November Criminals, and anti-communist fears. His theatrical speeches with dramatic gestures, passionate crescendos, and scapegoating of Jews and Marxists drew thousands of paying listeners, turning Hitler into the party's undisputed Führer by July 1921.</p><p>Furthermore, growth was driven by <strong>the creation and violent discipline of the SA (Sturmabteilung) in 1921</strong>. Led by Ernst Röhm, the SA ('Brownshirts') was formed from ex-soldiers and Freikorps veterans. The SA protected Nazi meetings from communist disruptions, violently assaulted political opponents on the streets of Munich, and distributed party newspapers like the *Völkischer Beobachter*. Their brown uniforms, swastika banners, and disciplined marching conveyed an impression of strength and order that appealed to disaffected war veterans.</p><p>Finally, the party gained support through <strong>the 25-Point Programme published in February 1920</strong>. Co-authored by Hitler and Anton Drexler, the manifesto cleverly combined nationalist demands (scrapping Versailles, uniting all Germans into Greater Germany) with socialist appeals to workers and small businesses (abolishing unearned income, profit-sharing in heavy industry, protecting shopkeepers from department stores), allowing the party to attract a broad cross-section of disgruntled Bavarian society.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that Adolf Hitler used theatrical, intense speaking techniques to electrify beer hall crowds.<br><strong>Details in the source that tell me this:</strong><br>Eyewitnesses describe Hitler starting with quiet, hoarse sentences before building into passionate, hypnotic shouting.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that early Nazi meetings relied on armed intimidation to prevent political heckling.<br><strong>Details in the source that tell me this:</strong><br>Brownshirt stormtroopers guarded every doorway with heavy walking sticks, ready to eject anyone who disagreed.</p>"
  },
  {
    lessonNum: 6,
    q12m_model: "<p>One decisive reason the Nazi Party changed its strategy was <strong>the total failure of the Munich Putsch in November 1923</strong>. Attempting to seize the Bavarian government and march on Berlin like Mussolini's March on Rome, Hitler and 2,000 stormtroopers were easily stopped by armed Bavarian police at the Odeonsplatz, leaving 16 Nazis dead. At his 1924 trial, Hitler realized that direct armed rebellion against the German army and state police was impossible. While in Landsberg prison writing *Mein Kampf*, Hitler resolved to adopt the 'legal path to power'—holding his nose and entering the Reichstag to destroy democracy from within through democratic elections.</p><p>Furthermore, change was necessitated by <strong>Hitler's reorganization of party leadership at the Bamberg Conference (1926)</strong>. In the mid-1920s, the northern wing of the party, led by Gregor and Otto Strasser, emphasized socialist policies like redistributing land and nationalizing banks. At Bamberg in February 1926, Hitler decisively crushed the socialist faction, establishing the *Führerprinzip* (leader principle) and cementing total personal authority over party ideology, which reassured wealthy industrialists and conservative landowners.</p><p>Finally, the party utilized the 'Lean Years' to build <strong>a sophisticated national party infrastructure</strong>. Although the party won only 12 seats (2.6% of the vote) in the prosperous 1928 election, Goebbels was appointed propaganda leader, while specialized auxiliary organizations were established across Germany: the Hitler Youth, the Nazi Teachers' League, the Nazi Doctors' League, and the elite black-uniformed SS (Schutzstaffel) founded in 1925. This meant that when economic crisis struck in 1929, the Nazi machine was primed to mobilize millions of votes.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that Adolf Hitler turned his 1924 treason trial into a national propaganda triumph.<br><strong>Details in the source that tell me this:</strong><br>Hitler gave multi-hour speeches attacking the Weimar Republic, which sympathetic judges allowed to be printed in major newspapers.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the Bavarian judiciary treated right-wing nationalists with extraordinary leniency.<br><strong>Details in the source that tell me this:</strong><br>Hitler was given the minimum possible five-year sentence in comfortable Landsberg fortress and released after barely nine months.</p>"
  },
  {
    lessonNum: 7,
    q12m_model: "<p>One fundamental reason support for the Nazi Party surged was <strong>the Wall Street Crash of October 1929 and catastrophic mass unemployment</strong>. When American banks called in their short-term Dawes Plan loans, the German economy collapsed. Over 50,000 businesses went bankrupt, industrial production halved, and unemployment skyrocketed from 1.3 million in 1929 to over 6 million by early 1932 (one in three workers). Desperate families lost homes and savings. Weimar coalition governments under Chancellor Brüning slashed unemployment benefits and raised taxes ('the Hunger Chancellor'). In their misery, millions of desperate voters turned to the political extremes: the Communists (KPD) and the Nazis (NSDAP).</p><p>Furthermore, support was magnified by <strong>the sophisticated propaganda machine of Joseph Goebbels</strong>. Goebbels pioneered modern political marketing: flying Hitler across Germany in chartered airplanes ('Hitler over Germany') to speak to mass rallies, distributing millions of leaflets, utilizing dynamic posters, and using radio and records. Crucially, the Nazis tailored their message to specific social groups: promising farmers guaranteed agricultural prices, promising small shopkeepers protection against Jewish-owned department stores, and promising the middle class that the SA would smash the communist threat.</p><p>Finally, the Nazis gained decisive momentum by <strong>projecting strength, order, and anti-communist protection</strong>. As street battles raged between the Red Front Fighters' League and the SA, middle-class and wealthy Germans feared a Bolshevik revolution. The disciplined, uniformed stormtroopers marching in torchlight parades gave the impression of firm patriotic discipline amid chaotic Weimar democratic paralysis, driving Nazi electoral seats from 12 in 1928 to 230 in July 1932, making the NSDAP the largest party in the Reichstag.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that desperate unemployed workers turned to extremist parties because democratic politicians offered no solutions.<br><strong>Details in the source that tell me this:</strong><br>The extract describes queues of shivering men at soup kitchens listening to radical speakers after unemployment benefits were cut.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the Nazi Party promised immediate jobs and bread to suffering German families.<br><strong>Details in the source that tell me this:</strong><br>Posters throughout working-class suburbs prominently bore the slogan 'Work and Bread' alongside Hitler's portrait.</p>"
  },
  {
    lessonNum: 8,
    q12m_model: "<p>One decisive reason Hitler was appointed Chancellor was <strong>the backroom political intrigue of Franz von Papen and the conservative elite</strong>. Following the November 1932 elections, the Nazis lost two million votes, and party finances were exhausted. However, former Chancellor Franz von Papen wanted revenge against his rival, Chancellor Kurt von Schleicher. Papen formed an alliance with wealthy industrialists, landowners, and the military, convincing President Paul von Hindenburg to appoint Hitler as Chancellor on 30 January 1933 with Papen as Vice-Chancellor. Papen foolishly believed that with only three Nazis in a cabinet of twelve, they could control Hitler, boasting: 'Within two months, we will have pushed Hitler into a corner so hard he will be squeaking!'</p><p>Furthermore, appointment was enabled by <strong>the collapse of parliamentary democracy and rule by emergency decree</strong>. Since March 1930, no chancellor could command a stable Reichstag majority. President Hindenburg had used Article 48 of the constitution to govern by presidential emergency decree (passing 66 laws by decree in 1932 compared to only 5 passed by the Reichstag). This accustomed the German public to authoritarian rule and sidelined parliament, leaving the appointment of the chancellor entirely to Hindenburg’s small inner circle of aristocratic advisers (the Camarilla).</p><p>Finally, Hitler was appointed because the elites needed <strong>the mass electoral backing and anti-communist street power of the Nazi Party</strong>. Despite the slight vote dip in November 1932, the NSDAP remained by far the largest party with 196 seats, while the Communist Party (KPD) surged to 100 seats. General Werner von Blomberg and business leaders recognized that von Schleicher’s government had no popular support, and concluded that bringing Hitler into government was the only way to avoid civil war and crush the communist threat.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that Franz von Papen arrogantly believed he could manipulate and control Adolf Hitler in government.<br><strong>Details in the source that tell me this:</strong><br>Von Papen assured conservative colleagues that they had hired Hitler and boxed him in with a cabinet of non-Nazi ministers.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that President Hindenburg was deeply reluctant to appoint Hitler and had to be heavily persuaded.<br><strong>Details in the source that tell me this:</strong><br>The president initially refused to appoint the 'Bohemian corporal', agreeing only when Papen convinced him no other coalition could govern.</p>"
  },
  {
    lessonNum: 9,
    q12m_model: "<p>One major reason Hitler established a dictatorship was <strong>the Reichstag Fire of 27 February 1933 and the Reichstag Fire Decree</strong>. When the parliament building burnt down, Dutch communist Marinus van der Lubbe was arrested. Hitler immediately claimed this was the signal for a communist insurrection. The next day, Hitler persuaded President Hindenburg to sign the Emergency Decree for the Protection of People and State (Reichstag Fire Decree). This suspended basic civil liberties—free speech, freedom of the press, and trial before arrest—allowing the police and SA to arrest 4,000 communists, ban left-wing newspapers, and terrify voters ahead of the March 1933 elections.</p><p>Furthermore, Hitler legalized his autocracy through <strong>the Enabling Act of 23 March 1933</strong>. Intimidating Reichstag deputies with armed SS and SA guards surrounding the Kroll Opera House, Hitler secured the required two-thirds majority with the support of the Catholic Centre Party. The Enabling Act transferred full legislative power to Hitler's cabinet for four years, allowing him to pass laws without the Reichstag or the President, effectively destroying the Weimar Constitution and legalizing dictatorship.</p><p>Finally, Hitler consolidated totalitarian control through <strong>Gleichschaltung (co-ordination) and the Night of the Long Knives (June 1934)</strong>. In May 1933, trade unions were banned, followed by the Law Against the Formation of Parties in July 1933, making the NSDAP the only legal party. In June 1934, Hitler launched the Night of the Long Knives, using the SS to assassinate SA leader Ernst Röhm and over 80 potential rivals. This secured the absolute loyalty of the German army, so when Hindenburg died on 2 August 1934, the army swore a personal oath of unconditional loyalty to Hitler as Führer and Reich Chancellor.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that the Nazi regime used the Reichstag Fire Decree to destroy all civil and legal protections in Germany.<br><strong>Details in the source that tell me this:</strong><br>The decree suspended freedom of speech, assembly, and habeas corpus, allowing indefinite detention without trial.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the state police used the decree specifically to crush the Communist and Social Democratic opposition.<br><strong>Details in the source that tell me this:</strong><br>Within 24 hours, thousands of left-wing deputies were arrested and their printing presses permanently confiscated.</p>"
  },
  {
    lessonNum: 10,
    q12m_model: "<p>One primary reason the Nazi police state maintained control was <strong>the pervasive terror of the SS, Gestapo, and concentration camps</strong>. Under Heinrich Himmler and Reinhard Heydrich, the SS (Schutzstaffel) became a ruthless state within a state. The Gestapo (Secret State Police) operated above the law, arresting anyone suspected of anti-Nazi jokes, listening to foreign radio, or political dissent. Gestapo arrest meant brutal interrogation and imprisonment without trial in concentration camps like Dachau. Although the Gestapo had relatively few officers, pervasive public denunciations created an all-encompassing atmosphere of paranoia where citizens self-censored out of fear.</p><p>Furthermore, control was achieved by <strong>subverting the legal system and the judiciary</strong>. Judges were compelled to join the National Socialist League for the Maintenance of the Law (BSRB), and swearing a personal oath to Hitler. In 1934, Hitler established the People's Court (Volksgerichtshof) under Roland Freisler to try political treason cases without juries, where death sentences were handed down routinely. Therefore, citizens had no legal protection against state terror.</p><p>Finally, the regime neutralized religious opposition through <strong>the 1933 Concordat and the creation of the Reich Church</strong>. In July 1933, Hitler signed a Concordat with Pope Pius XI, promising that the Catholic Church could keep its schools and youth groups if priests remained out of politics. When the regime broke its promises, closing Catholic schools, Pope Pius XI issued the encyclical *Mit Brennender Sorge* (1937), but priests like Cardinal Galen faced Gestapo surveillance. For Protestants, the regime set up the pro-Nazi Reich Church under Ludwig Müller; opposing pastors who formed the Confessing Church, like Martin Niemöller and Dietrich Bonhoeffer, were arrested and sent to concentration camps, successfully preventing coordinated religious rebellion.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that German citizens lived in continuous dread of being reported to the secret police by neighbors.<br><strong>Details in the source that tell me this:</strong><br>The report notes that ordinary people lowered their voices in public places and feared speaking freely even in their own living rooms.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the Gestapo relied heavily on voluntary civilian informers to uncover dissent.<br><strong>Details in the source that tell me this:</strong><br>Archival records show that the majority of Gestapo investigations were initiated by written denunciations from ordinary citizens.</p>"
  },
  {
    lessonNum: 11,
    q12m_model: "<p>One major reason the regime successfully influenced attitudes was <strong>the total control of the radio and the Volksempfänger (People’s Receiver)</strong>. Joseph Goebbels and the Ministry of Public Enlightenment and Propaganda recognized radio as the most powerful modern communication tool. In 1933, the government produced the cheap, mass-market *Volksempfänger 301*, making radio sets affordable to ordinary families. By 1939, over 70% of German households owned a radio—the highest percentage in the world. Crucially, sets were engineered to receive only German state frequencies, and communal loudspeakers were installed in factories, cafes, and town squares, ensuring Hitler’s speeches reached every citizen.</p><p>Furthermore, the regime maintained control through <strong>strict censorship of newspapers, literature, and the arts via the Reich Chamber of Culture (RKK)</strong>. Founded in September 1933, the RKK forced all journalists, writers, musicians, and artists to register, banning Jews and anti-Nazis. Over 2,500 independent writers and artists, including Thomas Mann and Albert Einstein, fled abroad. In May 1933, student bonfires burnt 20,000 'un-German' books in Berlin. Goebbels held daily press conferences instructing editors on exact headlines, while modern art was condemned as 'Degenerate Art' (Entartete Kunst) and replaced by heroic, classical Aryan painting.</p><p>Finally, attitudes were shaped by <strong>cinema and public mass spectacles</strong>. Goebbels commissioned epic propaganda films, such as Leni Riefenstahl's *Triumph of the Will* (documenting the 1934 Nuremberg Rally) and *Olympia* (the 1936 Berlin Olympics). The annual week-long Nuremberg Rallies brought hundreds of thousands of uniformed participants into gigantic stadium formations under searchlight 'cathedrals of light', overwhelming individual identity and reinforcing absolute obedience to the Führer.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that the Ministry of Propaganda exercised total editorial control over daily news reporting.<br><strong>Details in the source that tell me this:</strong><br>Editors received daily instruction sheets from Goebbels specifying front-page headlines and banning critical commentary.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the regime engineered inexpensive domestic radios to broadcast state messages into every household.<br><strong>Details in the source that tell me this:</strong><br>The source highlights the mass distribution of cheap 'People's Receivers' that could only tune into Nazi-controlled stations.</p>"
  },
  {
    lessonNum: 12,
    q12m_model: "<p>One decisive reason active opposition was limited was <strong>the ruthless terror apparatus of the Gestapo and concentration camps</strong>. The Nazi regime eliminated traditional legal rights, making any criticism of Hitler punishable as high treason. The Gestapo and block wardens (Blockleiter) monitored neighborhood loyalty, while the SS ran early concentration camps to brutalize political opponents. The total destruction of independent trade unions and opposition parties in 1933 left resistance groups with no legal platform or organizational structure to mobilize mass protest, forcing opponents into isolated, secret cells where betrayal meant death.</p><p>Furthermore, opposition was suppressed because <strong>Hitler delivered genuine popular economic recovery and foreign policy triumphs</strong>. Between 1933 and 1938, unemployment fell from 6 million to virtually zero, giving working families regular wages and a sense of stability. The KdF (Strength Through Joy) provided subsidized holidays and theatre tickets. Concurrently, Hitler’s bloodless foreign policy victories—remilitarizing the Rhineland (1936), the Anschluss with Austria (1938), and regaining the Sudetenland (1938)—overturned the hated Treaty of Versailles and made Hitler extraordinarily popular among patriotic Germans.</p><p>Finally, youth and religious resistance remained <strong>fragmented, small-scale, and non-violent</strong>. Groups like the Edelweiss Pirates beat up Hitler Youth patrols and sang banned songs, while the Swing Youth danced to American jazz. In religion, Pastor Martin Niemöller formed the Confessing Church, but opposition focused on defending church autonomy rather than actively trying to overthrow the Nazi government. Without arms or military support, civilian resistance could not challenge the armed power of the totalitarian state.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that the Edelweiss Pirates engaged in cultural defiance and non-conformity against Nazi regimentation.<br><strong>Details in the source that tell me this:</strong><br>Youths wore checked shirts and edelweiss flower badges, meeting secretly in forests to sing forbidden folk songs.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that youth groups engaged in minor acts of physical harassment against the Hitler Youth.<br><strong>Details in the source that tell me this:</strong><br>Police reports state that Pirate gangs ambushed and beat up Hitler Youth patrols in working-class neighborhoods.</p>"
  },
  {
    lessonNum: 13,
    q12m_model: "<p>One primary reason Nazi policies towards women were implemented was <strong>the regime's racial and demographic obsession with boosting the Aryan birth rate</strong>. Alarmist Nazi demographers noted that the German birth rate had fallen from 2 million in 1900 to under 1 million in 1933. Under the slogan *Kinder, Küche, Kirche* (Children, Kitchen, Church), the regime aimed to return women to domestic motherhood to breed pure Aryan children for the Reich. In June 1933, the Law for the Encouragement of Marriage offered interest-free loans of 1,000 marks to newlywed couples, with 25% of the loan written off for each child born. Motherhood was celebrated like military service, with the Honour Cross of the German Mother awarded on Hitler's mother's birthday (Bronze for 4 children, Silver for 6, Gold for 8).</p><p>Furthermore, policies aimed to <strong>remove women from the workplace to reduce male unemployment and enforce traditional gender roles</strong>. From 1933, female civil servants, doctors, and lawyers were dismissed from public service, and girls were limited to 10% of university places. Women were discouraged from wearing makeup, dying their hair, or smoking, and were instructed to dress in traditional German peasant dresses to embody healthy rural motherhood.</p><p>Finally, policies reversed dramatically after 1937 due to <strong>the acute labor shortages of the rearmament economy</strong>. As the Four-Year Plan prepared Germany for war and conscription expanded the Wehrmacht, factories desperately needed workers. The regime was forced to abandon its ban on female employment, introducing compulsory 'duty year' service for unmarried women in agriculture and industry. By 1939, despite official propaganda celebrating stay-at-home mothers, there were actually 1.2 million *more* women working in Germany than in 1933.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that the Nazi state treated motherhood as an ideological duty equivalent to frontline military service.<br><strong>Details in the source that tell me this:</strong><br>Propaganda posters describe German mothers as 'soldiers on the home front' fighting the battle for births.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the regime used financial incentives and public honors to persuade women to have large families.<br><strong>Details in the source that tell me this:</strong><br>The source details marriage loans forgiven after four children and medals awarded on Hitler's mother's birthday.</p>"
  },
  {
    lessonNum: 14,
    q12m_model: "<p>One major reason the regime placed supreme importance on youth was <strong>the goal of indoctrinating the next generation into fanatical Nazi ideology ('the Thousand-Year Reich')</strong>. As Hitler declared, 'Whoever has the youth has the future.' The regime understood that adults might conform out of fear, but children could be completely molded from infancy. In March 1936, the Hitler Youth Law made membership in Nazi youth organizations mandatory for all boys aged 10 to 18, and in 1939, non-membership was criminalized. Girls joined the League of German Girls (BDM), where they were trained in mothercraft, gymnastics, and racial hygiene, while boys in the Hitler Youth were trained in military drilling, rifle shooting, and unconditional obedience to Hitler.</p><p>Furthermore, control was achieved by <strong>thoroughly Nazifying the school curriculum and purging teachers</strong>. All teachers were forced to join the National Socialist Teachers' League (NSLB) and swear a loyalty oath to Hitler. School textbooks were rewritten: History taught the betrayal of Versailles and the glory of German wars; Biology taught racial hierarchy, Aryan supremacy, and the 'subhuman' status of Jews and Slavs; Mathematics set word problems calculating the cost of caring for the mentally disabled compared to building bomber aircraft. PE was expanded to take up 15% of the school week to produce physically hardened soldiers.</p><p>Finally, control was intended to <strong>break the influence of the family and the churches</strong>. By occupying children's evenings, weekends, and holidays with camping trips, rallies, and paramilitary training, the Hitler Youth alienated children from traditional parental authority and Christian Sunday schools, encouraging children to denounce parents or teachers who expressed anti-Nazi views.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that training in the Hitler Youth was designed specifically to prepare young boys for military combat.<br><strong>Details in the source that tell me this:</strong><br>Boys spent weekends marching with heavy packs, practicing rifle shooting, and learning map reading under military discipline.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that physical toughness and discipline were prioritized over academic or intellectual development.<br><strong>Details in the source that tell me this:</strong><br>The instructor reports that physical endurance drills and survival training took precedence over traditional studies.</p>"
  },
  {
    lessonNum: 15,
    q12m_model: "<p>One primary reason the standard of living changed was <strong>the total regimentation of the workforce by the German Labour Front (DAF)</strong>. In May 1933, SA stormtroopers raided trade union offices, seized funds, and arrested union leaders. The DAF, headed by Robert Ley, replaced all 169 independent trade unions. Workers lost the right to strike, negotiate wages, or change jobs freely without employer permission (enforced by the Work Book in 1935). Average weekly working hours increased from 43 hours in 1933 to 47 hours in 1939 (and up to 60 hours in arms factories), while take-home wages rose only marginally after compulsory DAF dues, taxes, and Winter Relief donations were deducted.</p><p>Furthermore, living standards were compensated through <strong>the popular social incentives of 'Strength Through Joy' (Kraft durch Freude, KdF) and 'Beauty of Labour' (SdA)</strong>. To keep working-class morale high and prevent industrial sabotage, the KdF provided subsidized cultural leisure: low-cost opera tickets, museum visits, gym memberships, and cruise ship holidays to Norway and Italy. The *Beauty of Labour* improved factory canteens, lighting, and ventilation. Furthermore, millions of workers saved 5 marks a week into a stamp scheme to buy a *Volkswagen* ('People’s Car'), though none were actually delivered before war diverted factories to military jeeps.</p><p>Finally, living standards were shaped by <strong>the rearmament boom and shortages of consumer goods under the Four-Year Plan</strong>. While the eradication of unemployment brought food to millions of impoverished families, the drive for economic autarky (self-sufficiency) introduced by Göring in 1936 resulted in shortages of consumer luxury goods. Food items like butter, meat, and fruit were restricted to pay for raw materials like steel and oil ('Guns before Butter'), meaning that while employment security improved, daily material quality of life remained austere.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that German industrial workers experienced longer working hours and strict factory discipline under the Labour Front.<br><strong>Details in the source that tell me this:</strong><br>The secret report notes that men worked ten to twelve hours a day without overtime pay and complaints were treated as sabotage.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that the regime used subsidized entertainment to keep working-class discontent from boiling over.<br><strong>Details in the source that tell me this:</strong><br>Subsidized theater tickets and weekend excursions through Strength Through Joy kept grumbling in check among young workers.</p>"
  },
  {
    lessonNum: 16,
    q12m_model: "<p>One decisive catalyst for the escalation of persecution was <strong>the institutionalization of racial laws, notably the Nuremberg Laws of September 1935</strong>. Rooted in Hitler's racial ideology that Jews were biological parasites infecting the Aryan Volk, the Reich Citizenship Act stripped German Jews of their citizenship, voting rights, and legal protection under the state, reducing them to second-class 'subjects'. Concurrently, the Law for the Protection of German Blood and German Honour banned marriages and sexual relations between Jews and German citizens. This transformed social antisemitism into formal statutory law, paving the way for total exclusion from German society.</p><p>Furthermore, persecution escalated into massive state-sponsored violence during <strong>the Kristallnacht pogrom of 9–10 November 1938</strong>. Following the assassination of a German diplomat in Paris by a young Polish Jew, Goebbels orchestrated a nationwide wave of terror. Over 1,000 synagogues were burned, 7,000 Jewish businesses looted, 91 Jews murdered, and 30,000 Jewish men arrested and sent to concentration camps. The Nazi regime then imposed a collective fine of 1 billion marks on the Jewish community to pay for the damage, barred Jews from German schools and universities, and forced the 'Aryanization' of all remaining Jewish businesses.</p><p>Finally, escalation was driven by <strong>the radicalization of Nazi policy toward forced emigration and racial hygiene programs</strong>. In early 1939, Reinhard Heydrich was put in charge of the Central Office for Jewish Emigration to violently expel all Jews from the Reich. Meanwhile, the regime expanded persecution to other minority groups outside the *Volksgemeinschaft*: forcibly sterilizing 350,000 people under the 1933 Prevention of Hereditarily Diseased Offspring Act, persecuting Roma and Sinti Gypsies, and launching the secret T4 euthanasia program in 1939 to murder mentally and physically disabled children.</p>",
    q4m_model: "<p><strong>(i) What I can infer:</strong><br>I can infer that Kristallnacht involved catastrophic, systematic destruction of Jewish commercial and religious property.<br><strong>Details in the source that tell me this:</strong><br>The British consular report describes shattered shop glass covering pavements like gravel and ancient synagogues burning to ruins.</p><p><strong>(ii) What I can infer:</strong><br>I can infer that state emergency services and police actively colluded with the stormtroopers during the pogrom.<br><strong>Details in the source that tell me this:</strong><br>Fire brigades stood by merely protecting adjacent Aryan buildings while stormtroopers dragged Jewish shopkeepers away.</p>"
  }
];

let updatedCount = 0;

models.forEach(m => {
  const l = d.lessons[m.lessonNum - 1];
  if (!l) return;
  
  const wb = wbData[m.lessonNum - 1];
  const existingQs = l.exam_practice?.questions || [];
  
  // Preserve utility or interpretation questions if they existed
  const utilityQ = existingQs.find(q => q.tariff && q.tariff.includes('8'));
  const interpQ = existingQs.find(q => q.tariff && (q.tariff.includes('16') || q.tariff.includes('SPaG')));
  
  // Question 1: 4m inference
  const q4m = {
    tariff: "4 marks",
    type: "4-mark",
    marks: 4,
    question: `Give two things you can infer from ${wb.source_name || 'Source A'} about ${wb.q4m_topic}.`,
    prompt: "Give two separate inferences. For each inference, provide a clear deduction and support it with a direct quote or detail from the source.",
    model: m.q4m_model,
    scaffolding: {
      acronym: "Inference + Detail Formula (AO3)",
      acronym_title: "Deduction & Quote Framework",
      steps: [
        { letter: "I1", name: "First Inference", prompt: "State what you can deduce from the source." },
        { letter: "Q1", name: "Supporting Quote", prompt: "Quote the exact detail from the source that supports your first inference." },
        { letter: "I2", name: "Second Inference", prompt: "State a second, different deduction about the topic." },
        { letter: "Q2", name: "Supporting Quote", prompt: "Quote the exact detail from the source that supports your second inference." }
      ]
    },
    examiner_tip: "Beware the 'Dealt vs. Felt' trap: do not simply write about emotions. Focus on what was actively happening. State two distinct inferences backed by different source details.",
    model_tiers: {
      tier_1m: {
        title: "1/4 Assertion",
        score: "1 / 4 Marks",
        level: "Level 1 Bottom (Assertion)",
        text: "<p>I can infer that conditions were bad and people were angry.</p>",
        verdict: "AO3 (1 mark). Simple assertion without quoting or citing specific evidence from the source."
      },
      tier_2m: {
        title: "2/4 Partial / Quote Trap",
        score: "2 / 4 Marks",
        level: "Level 1 Top (Supported Statement)",
        text: `<p><strong>(i) What I can infer:</strong><br>I can infer that people faced difficulties.<br><strong>Details in the source:</strong><br>${(wb.source_text || '').substring(0, 50)}...</p>`,
        verdict: "AO3 (2 marks). 1 valid inference supported by a quote, but second inference omitted."
      },
      tier_4m: {
        title: "4/4 Grade 9 Exam ★",
        score: "4 / 4 Marks",
        level: "Level 2 Top (Pearson Exam Standard)",
        badge: "Edexcel Benchmark",
        text: m.q4m_model,
        verdict: "AO3 (4 marks). Full marks awarded. Two distinct inferences, both supported by direct, quoted textual details from the source."
      },
      tier_10m: {
        title: "Level 10 Scholar 🚀",
        score: "Level 10",
        level: "Academic Distinction (Scholar)",
        badge: "A* Masterclass",
        text: `<p>Historical inference reveals the underlying structural and ideological mechanics governing Weimar and Nazi Germany.<br><br>${m.q4m_model}</p>`,
        verdict: "Elite historiographical evaluation analyzing structural context and institutional ideology."
      }
    }
  };
  
  // Question 2: 12m explain why
  const q12m = {
    tariff: "12 marks",
    type: "12-mark",
    marks: 12,
    question: wb.q12m,
    stimulus: wb.stimuli,
    prompt: "Explain at least three distinct causal factors using specific historical evidence (including both stimulus points and your own knowledge), and link each paragraph back to the question stem.",
    model: m.q12m_model,
    scaffolding: {
      acronym: "P-E-E-L",
      acronym_title: "12-Mark Causation Formula: Point, Evidence, Explanation, Link",
      sentence_starters: [
        "One major reason was...",
        "Furthermore, another decisive factor was...",
        "Finally, an underlying driver was..."
      ]
    },
    model_tiers: {
      tier_1m: {
        title: "Level 1 (1–3 marks)",
        score: "1–3 Marks",
        level: "Level 1 (Basic / Generalised)",
        text: `<p>${m.q12m_model.split('</p>')[0].replace(/<[^>]+>/g, '').split('.')[0]}.</p>`,
        verdict: "AO1/AO2. Generalised narrative with minimal supporting factual evidence."
      },
      tier_2m: {
        title: "Level 2 (4–6 marks)",
        score: "4–6 Marks",
        level: "Level 2 (Simple Explanation)",
        text: m.q12m_model.split('</p>').slice(0, 2).join('</p>') + '</p>',
        verdict: "AO1/AO2. Identifies two factors with limited factual detail; one stimulus point addressed."
      },
      tier_3m: {
        title: "Level 3 (7–9 marks)",
        score: "7–9 Marks",
        level: "Level 3 (Developed Explanation)",
        text: m.q12m_model,
        verdict: "AO1/AO2. Both stimulus points and outside knowledge developed; clear causal explanation."
      },
      tier_4m: {
        title: "Level 4 (10–12 marks ★)",
        score: "10–12 Marks",
        level: "Level 4 Top (Pearson Benchmark)",
        badge: "Edexcel Benchmark",
        text: m.q12m_model,
        verdict: "AO1/AO2. Sustained, analytical causal argument integrating both stimulus points and outside knowledge with precise historical evidence."
      }
    }
  };
  
  const finalQuestions = [q4m, q12m];
  if (utilityQ) finalQuestions.push(utilityQ);
  if (interpQ) finalQuestions.push(interpQ);
  
  l.exam_practice = {
    title: "Edexcel GCSE (9–1) Paper 3 Exam Practice",
    tariff: "Section A (4 marks & 12 marks)",
    questions: finalQuestions,
    stimulus: [
      {
        title: `${wb.source_name || 'Source A'}: ${wb.source_origin || 'Contemporary Archival Evidence'}`,
        caption: `${wb.source_name || 'Source A'}: ${wb.source_origin || 'Archival source'}`,
        content: wb.source_text || 'Contemporary historical extract.',
        provenance: wb.source_origin || 'Archival source'
      }
    ]
  };
  
  l.gcse_task = {
    title: "Edexcel GCSE (9–1) Paper 3 Section A Practice",
    tasks: [
      {
        type: "written",
        tariff: "Q1: Source Inference [4 marks]",
        text: q4m.question,
        model: m.q4m_model
      },
      {
        type: "written",
        tariff: "Q2: Causal Explanation [12 marks]",
        text: q12m.question,
        stimulus: wb.stimuli,
        model: m.q12m_model
      }
    ]
  };
  
  updatedCount++;
});

// Save to data/weimar_nazi_germany.json
fs.writeFileSync(weimarPath, JSON.stringify(d, null, 2), 'utf8');

// Save to public/data/weimar_nazi_germany.json
const pubPath = 'public/data/weimar_nazi_germany.json';
if (fs.existsSync(pubPath)) {
  fs.writeFileSync(pubPath, JSON.stringify(d, null, 2), 'utf8');
}

// Save to units/weimar_nazi_germany/data.js (ES module)
const unitJsPath = 'units/weimar_nazi_germany/data.js';
fs.writeFileSync(unitJsPath, 'export default ' + JSON.stringify(d, null, 2) + ';\n', 'utf8');

console.log(`✅ Successfully updated all ${updatedCount} Weimar lessons with 1:1 workbook alignment!`);

