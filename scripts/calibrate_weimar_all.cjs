const fs = require('fs');
const path = require('path');

const pUnit = path.join(__dirname, '..', 'units', 'weimar_nazi_germany', 'data.js');
const pPublic = path.join(__dirname, '..', 'public', 'units', 'weimar_nazi_germany', 'data.js');

async function run() {
  const mod = (await import('file:///' + pUnit.replace(/\\/g, '/'))).default;

  // Let's calibrate each lesson in Weimar
  console.log('Calibrating Weimar & Nazi Germany...');

  // --- LESSON 1 ---
  // Q1: Inference (4 marks)
  mod.lessons[0].exam_practice.questions[0].model = 
    "<strong>Inference 1:</strong> Military discipline in the German armed forces had completely broken down by November 1918. <strong>Detail:</strong> The source shows armed sailors in open mutiny against their officers, raising red flags.<br><br><strong>Inference 2:</strong> The mutiny was a major threat to imperial authority. <strong>Detail:</strong> Thousands of armed sailors are occupying public buildings and forming revolutionary councils in northern ports.";
  // Q2: Explain why Kaiser Wilhelm II abdicated (12 marks)
  mod.lessons[0].exam_practice.questions[1].model = 
    "One major reason Kaiser Wilhelm II was forced to abdicate was the loss of military support. By early November 1918, mutiny spread from the navy at Kiel across German cities. Crucially, on 9 November, Army Chief of Staff General Groener informed the Kaiser that the army would no longer follow his orders to suppress domestic unrest, leaving him without armed protection.<br><br>Furthermore, the German public had turned against the monarchy due to extreme war weariness and starvation. The British naval blockade caused severe food shortages, leading to widespread strikes and the creation of workers' and soldiers' councils across Germany, threatening a full-scale communist revolution like Russia's in 1917.<br><br>Finally, Allied pressure made the Kaiser's removal essential for peace. US President Woodrow Wilson made it clear that peace negotiations would only proceed with a representative government, not an autocratic emperor. To prevent civil war and secure an immediate armistice, Chancellor Max von Baden announced the Kaiser's abdication.";

  // Sources L1
  mod.lessons[0].sources[0].model_answer = "Source A shows that by November 1918, German soldiers and workers were heavily armed and in open revolt, proving military authority had completely collapsed.";
  mod.lessons[0].sources[1].model_answer = "Prince Max announced the Kaiser's abdication to pre-empt a violent communist uprising and manage an orderly handover to moderate Social Democrats.";
  mod.lessons[0].sources[2].model_answer = "Scheidemann proclaimed the republic to establish democratic legitimacy and stop Karl Liebknecht declaring a Soviet-style communist state in Berlin.";
  mod.lessons[0].sources[3].model_answer = "Ebert's priority was restoring public order, food supplies, and parliamentary elections, working with the existing civil service to prevent chaos.";
  mod.lessons[0].sources[4].model_answer = "The Weimar Constitution was exceptionally democratic, granting universal suffrage, proportional representation, and a Bill of Rights to all German adults.";

  // --- LESSON 2 ---
  // Q1: 12 marks Explain why Treaty of Versailles caused challenges
  mod.lessons[1].exam_practice.questions[0].model = 
    "One reason the Treaty of Versailles caused severe challenges was the extreme anger over Article 231, the War Guilt Clause. Germans believed the war had been fought defensively and felt humiliated by having to accept sole blame. Opponents labeled the Weimar politicians the 'November Criminals' who had delivered a *Diktat* (dictated peace), permanently damaging the new republic's legitimacy.<br><br>Furthermore, the harsh territorial and military terms weakened Germany's security and pride. Germany lost 13% of its European territory, including Alsace-Lorraine and the Polish Corridor, cutting off East Prussia. The armed forces were cut to 100,000 men with no air force or tanks, leaving the country feeling defenseless and sparking resentment among ex-soldiers.<br><br>Finally, the massive £6.6 billion reparations bill crippled the German economy. Paying reparations drained government revenues, leading to defaulting on coal deliveries in 1923, the French invasion of the Ruhr, and the catastrophic hyperinflation crisis that wiped out middle-class savings.";
  // Q2: 8 marks Utility Sources B and C
  mod.lessons[1].exam_practice.questions[1].model = 
    "Source B is useful for an enquiry into right-wing opposition because it illustrates the *Dolchstoß* (stab-in-the-back) myth, showing a masked civilian stabbing a German soldier from behind. From my knowledge, nationalists falsely claimed the army had not been defeated militarily, but betrayed by socialist politicians signing the 1918 armistice. As a nationalist postcard, it shows how effectively right-wing groups weaponized the Treaty of Versailles to undermine the Weimar government.<br><br>Source C is useful because it depicts armed Freikorps troops during the 1920 Kapp Putsch with swastikas painted on helmets. Contextually, when the government attempted to disband paramilitary units under treaty army limits, 12,000 Freikorps troops marched on Berlin, and the regular army refused to fire on them. As an authentic photograph, it provides reliable visual evidence of armed right-wing defiance, although it does not show the left-wing general strike that ultimately defeated the putsch. Overall, both sources are highly useful for showing how treaty terms fueled political extremism.";

  // Sources L2
  mod.lessons[1].sources[0].model_answer = "Source A illustrates that the Spartacist uprising was heavily armed and violent, seizing key buildings in Berlin before being brutally crushed by Freikorps paramilitaries.";
  mod.lessons[1].sources[1].model_answer = "The postcard shows the nationalist 'stab-in-the-back' myth, blaming socialists and Jews for Germany's 1918 defeat rather than military exhaustion.";
  mod.lessons[1].sources[2].model_answer = "Source C provides direct visual evidence of Freikorps paramilitaries seizing Berlin during the Kapp Putsch, demonstrating the military's unwillingness to defend the republic.";
  mod.lessons[1].sources[3].model_answer = "Chancellor Wirth warns that political assassinations by right-wing death squads like Organisation Consul threatened to destroy democratic stability from within.";
  mod.lessons[1].sources[4].model_answer = "The one-billion-mark overprint banknote provides material evidence of the complete collapse of currency value during the 1923 hyperinflation crisis.";

  // --- LESSON 3 ---
  // Q1: 4 marks COP
  mod.lessons[2].exam_practice.questions[0].model = 
    "<strong>Content:</strong> Source B shows Germany relying heavily on private American loans ($1,000 bond), while Source C warns that this reliance made Germany vulnerable to sudden US withdrawals.<br><br><strong>Provenance:</strong> Source B is an official financial bond, showing public economic confidence, whereas Source C is Stresemann's private warning, revealing genuine governmental anxiety.";
  // Q2: 8 marks Utility Sources B and C
  mod.lessons[2].exam_practice.questions[1].model = 
    "Source B is useful because it provides material evidence of the Dawes Plan (1924), showing how American capital funded German recovery through 800 million gold marks in foreign loans. From my knowledge, these loans financed public works, hospitals, and industrial modernization, helping unemployment fall and trade expand. As an official Wall Street bond certificate, it accurately reflects foreign investor confidence in Weimar Germany.<br><br>Source C is useful because Stresemann privately admits that Germany's economic prosperity was superficial, describing the country as 'dancing on a volcano' because short-term US loans could be recalled at any moment. As a confidential speech to party colleagues, Stresemann was speaking honestly about hidden financial risks. However, neither source shows social reforms like pensions and unemployment insurance. Overall, both sources are very useful for showing both the strength and the fragile dependency of Weimar's economic recovery.";

  // Sources L3
  mod.lessons[2].sources[0].model_answer = "Stresemann explains that halting the printing presses and introducing the temporary Rentenmark backed by land values restored public trust and ended hyperinflation.";
  mod.lessons[2].sources[1].model_answer = "Source B demonstrates that Weimar's industrial revival depended directly on private American loans provided under the 1924 Dawes Plan.";
  mod.lessons[2].sources[2].model_answer = "Stresemann warned that Germany's economic recovery was fragile and dangerously dependent on short-term US loans that could be recalled at any moment.";
  mod.lessons[2].sources[3].model_answer = "Stresemann argued that signing the Locarno Treaties and joining the League of Nations restored Germany's international standing and secured peaceful borders.";
  mod.lessons[2].sources[4].model_answer = "Nationalist posters attacked the Young Plan as financial slavery, claiming it committed German workers to paying foreign reparations until 1988.";

  // --- LESSON 4 ---
  // Q1: 4 marks Interpretation Views
  mod.lessons[3].exam_practice.questions[0].model = 
    "One key difference is that Interpretation 1 suggests the 1920s brought genuine liberation for 'New Women' through increased employment, voting rights, and financial independence. In contrast, Interpretation 2 argues this freedom was an illusion, as women faced wage inequality, social hostility, and expectations to return to domestic motherly roles.";
  // Q2: 16 marks (+4 SPaG)
  mod.lessons[3].exam_practice.questions[1].model = 
    "Interpretation 2 argues that the Weimar golden age saw limited real progress for women, emphasizing that traditional patriarchal attitudes remained deeply entrenched. There is strong evidence to support this view: although Article 109 of the Weimar Constitution established legal equality, in practice women were paid on average 33% less than men for the same work. Furthermore, married women who worked were stigmatized as 'double-earners' stealing jobs from male breadwinners, and the number of female Reichstag deputies actually fell during the late 1920s.<br><br>On the other hand, Interpretation 1 emphasizes the genuine, unprecedented freedoms achieved by women in the 1920s. Weimar women gained the vote in 1919 with high voter turnout, and by 1925 over 1.5 million women were employed in clerical, retail, and service jobs. The visible emergence of the 'New Woman'—with bobbed hair, modern fashion, financial independence, and leisure routines—represented a clear cultural break from the imperial Kaiserreich.<br><br>However, this cultural liberation was mostly concentrated among young, single, middle-class women in large cities like Berlin, whereas rural and conservative communities viewed it as moral decay.<br><br>In conclusion, I agree with Interpretation 2 to a large extent. While the Weimar Constitution opened legal and cultural doors, deep economic discrimination and conservative social backlash meant that most ordinary German women experienced little lasting change in status.";

  // Sources L4
  mod.lessons[3].sources[0].model_answer = "The Hufeisen estate illustrates Weimar's commitment to social welfare, using modernist architecture to provide working-class families with affordable, sunlit homes.";
  mod.lessons[3].sources[1].model_answer = "Rühle-Gerstel shows that despite the image of the independent 'New Woman', working women faced intense exhaustion from balancing low-wage employment with traditional domestic duties.";
  mod.lessons[3].sources[2].model_answer = "Gropius argues that Bauhaus design should integrate artistic beauty with functional mass-produced technology to serve modern democratic society.";
  mod.lessons[3].sources[3].model_answer = "Otto Dix's painting exposes the physical and psychological trauma endured by disabled war veterans, satirizing the neglect they faced in Weimar society.";
  mod.lessons[3].sources[4].model_answer = "The DNVP poster illustrates right-wing moral outrage against Weimar cultural experimentation, claiming Berlin had become a degenerate center of corruption.";

  // --- LESSON 5 ---
  // Q1: Inference (4 marks)
  mod.lessons[4].exam_practice.questions[0].model = 
    "<strong>Inference 1:</strong> The early Nazi Party was violently antisemitic and nationalist. <strong>Detail:</strong> Point 4 of the 25-Point Programme states that no Jew could ever be a German citizen.<br><br><strong>Inference 2:</strong> The party sought to destroy the post-war European order. <strong>Detail:</strong> Point 2 demands the complete revocation of the treaties of Versailles and Saint-Germain.";
  // Q2: 12 marks Explain why Nazi Party gained support in Munich 1919-1922
  mod.lessons[4].exam_practice.questions[1].model = 
    "One reason the Nazi Party gained support in Munich was Adolf Hitler's powerful oratorical talent. Joining the German Workers' Party (DAP) in 1919, Hitler captivated crowds in Munich beer halls with passionate, theatrical speeches blaming Jews, communists, and the 'November Criminals' for Germany's wartime defeat, rapidly building a personal following.<br><br>Furthermore, the 25-Point Programme (1920) offered broad appeal across different social groups. It combined intense nationalism (demanding *Lebensraum* and abolishing the Treaty of Versailles) with socialist promises like profit-sharing in heavy industry and pensions for the elderly, attracting bitter veterans and struggling lower-middle-class workers.<br><br>Finally, the creation of the SA (Stormtroopers) in 1921 gave the party a powerful physical presence. Led by Ernst Röhm, the brownshirts protected Nazi meetings, violently attacked political rivals, and provided unemployed young men with uniforms, purpose, and meals, projecting an image of disciplined strength amidst Munich's political chaos.";

  // Sources L5
  mod.lessons[4].sources[0].model_answer = "Drexler's manifesto combined virulent antisemitism with anti-capitalist rhetoric, aiming to attract working-class Germans away from Marxist socialism.";
  mod.lessons[4].sources[1].model_answer = "The 25-Point Programme demonstrates that the NSDAP combined radical nationalism (rejecting Versailles) with socialist promises (profit-sharing) to broaden its appeal.";
  mod.lessons[4].sources[2].model_answer = "The Völkischer Beobachter was purchased as the official Nazi newspaper to spread aggressive propaganda, promote party rallies, and attack political enemies.";
  mod.lessons[4].sources[3].model_answer = "The police report confirms Hitler's remarkable rhetorical skill, noting his ability to whip up beer hall audiences into frenzied fanatical enthusiasm.";
  mod.lessons[4].sources[4].model_answer = "Source E shows early SA stormtroopers in military uniform, reflecting the paramilitary discipline and violence at the core of early Nazi organizing.";

  // --- LESSON 6 ---
  // Q1: 12 marks Lean Years
  mod.lessons[5].exam_practice.questions[0].model = 
    "One reason the Nazi Party entered the 'Lean Years' was the humiliation of the failed Munich Putsch in November 1923. When Hitler attempted to seize power, the Bavarian police crushed the march, killing 16 Nazis. Hitler was imprisoned in Landsberg, and the party was banned, demonstrating that armed putsches could not overthrow the Weimar Republic.<br><br>Furthermore, Gustav Stresemann's economic and foreign policies stabilized Germany between 1924 and 1929. The Dawes Plan and Rentenmark ended hyperinflation, US loans funded employment, and international agreements like Locarno eased treaty tensions. As prosperity returned, support for extreme parties collapsed, with the Nazis winning just 2.6% of votes in May 1928.<br><br>Finally, party reorganization took years to bear fruit. At the 1926 Bamberg Conference, Hitler established his supreme authority (*Führerprinzip*), created the SS and Hitler Youth, and adopted legal electoral methods, but these structural changes could not attract mass votes while Germany remained stable.";
  // Q2: 8 marks Utility Sources A and B
  mod.lessons[5].exam_practice.questions[1].model = 
    "Source A is useful because it records Bavarian State Commissioner von Kahr ordering the armed suppression of the Munich Putsch and banning the Nazi Party. From my knowledge, Kahr had initially negotiated with Hitler in the Bürgerbräukeller at gunpoint, but betrayed him once released, calling in the army and police. As an official state proclamation issued during the crisis, it provides reliable evidence of the government's decisive decision to crush the coup.<br><br>Source B is useful because it depicts armed SA stormtroopers barricaded behind barbed wire outside the Munich War Ministry under Ernst Röhm. It visually demonstrates the military equipment, steel helmets, and Imperial war flags used by Nazi paramilitaries during the putsch. However, as a static photograph, it does not show the collapse of the march at the Odeonsplatz or the subsequent trial where Hitler turned defeat into a propaganda triumph. Overall, both sources are very useful for understanding how the putsch was executed and suppressed.";

  // Sources L6
  mod.lessons[5].sources[0].model_answer = "Von Kahr's proclamation shows the Bavarian government repudiating Hitler's armed putsch and ordering the immediate dissolution of the Nazi Party.";
  mod.lessons[5].sources[1].model_answer = "Source B shows armed SA troops under Ernst Röhm occupying the Munich War Ministry, demonstrating their military equipment and determination to overthrow the state.";
  mod.lessons[5].sources[2].model_answer = "Hitler used his 1924 trial to deliver patriotic speeches, transforming armed treason into heroic nationalist defense and winning nationwide fame.";
  mod.lessons[5].sources[3].model_answer = "Goebbels' diary reveals the intense relief and euphoria among party leaders when Hitler re-established unchallenged authority at the 1926 Bamberg Conference.";
  mod.lessons[5].sources[4].model_answer = "The 1928 election data illustrates the 'Lean Years', showing the Nazis polled only 2.6% of votes while the Weimar economy remained prosperous.";

  // --- LESSON 7 ---
  // Q1: 4 marks COP
  mod.lessons[6].exam_practice.questions[0].model = 
    "<strong>Content:</strong> Source B reveals Chancellor Brüning cutting public spending and welfare to manage the financial crisis, while Source D shows the Nazis exploiting this desperation by promising 'Work and Bread'.<br><br><strong>Provenance:</strong> Source B is an official government emergency decree showing administrative paralysis, whereas Source D is a propaganda election poster designed to convert economic misery into votes.";
  // Q2: 8 marks Utility Sources A and B
  mod.lessons[6].exam_practice.questions[1].model = 
    "Source A is useful for an enquiry into the impact of the Great Depression because it records Berlin police reports on rising political violence, poverty, and communist agitation among the unemployed. From my knowledge, the 1929 Wall Street Crash caused American banks to recall loans, pushing German unemployment to 6 million by 1932. As an official police intelligence report, it gives an objective assessment of growing urban unrest.<br><br>Source B is useful because Chancellor Brüning explains his deflationary policy of cutting civil service wages, unemployment benefits, and raising taxes. Because the Reichstag rejected these unpopular cuts, Brüning ruled through President Hindenburg's Article 48 emergency decrees, bypassing democracy. As an official government defense, it reveals the government's inability to solve the crisis. However, it does not show how this failure drove millions of voters toward the Nazis. Overall, both sources are highly useful for showing the economic and political collapse of Weimar.";

  // Sources L7
  mod.lessons[6].sources[0].model_answer = "The police report documents how the Great Depression triggered surging communist recruitment and violent street clashes among desperate unemployed workers in Berlin.";
  mod.lessons[6].sources[1].model_answer = "Brüning's decree illustrates his hated deflationary policy: cutting unemployment benefits and wages by emergency decree, which earned him the nickname 'Hunger Chancellor'.";
  mod.lessons[6].sources[2].model_answer = "The photograph demonstrates how the SA projected order and strength through disciplined mass parades, contrasting with the chaotic paralysis of the Weimar government.";
  mod.lessons[6].sources[3].model_answer = "The famous 'Work and Bread' poster illustrates how Nazi propaganda targeted working-class and peasant voters by promising jobs and economic rescue.";
  mod.lessons[6].sources[4].model_answer = "Maschmann recalls how Nazi rallies provided disillusioned youth with a sense of purpose, national unity, and exciting escape from the bleak misery of the Depression.";

  // --- LESSON 8 ---
  // Q1: 4 marks Interpretation Views
  mod.lessons[7].exam_practice.questions[0].model = 
    "One main difference is that Interpretation 1 suggests Hitler came to power primarily through backroom political intrigue by conservative elites like Franz von Papen. In contrast, Interpretation 2 argues that Hitler's appointment was driven by the massive democratic mandate won by the Nazi Party in free elections.";
  // Q2: 16 marks (+4 SPaG)
  mod.lessons[7].exam_practice.questions[1].model = 
    "Interpretation 1 argues that Hitler was appointed Chancellor in January 1933 primarily because of political intrigue among conservative elites. There is strong evidence for this: in November 1932, Nazi electoral support had actually dropped from 37% to 33%, and the party was running out of funds. Hitler was only rescued because Franz von Papen, furious at being ousted by Kurt von Schleicher, convinced President Hindenburg to appoint Hitler Chancellor with Papen as Vice-Chancellor, boasting they could 'box Hitler in' and control him in a cabinet with only two other Nazis.<br><br>On the other hand, Interpretation 2 emphasizes that Hitler could never have been considered for the chancellorship without the Nazi Party's overwhelming electoral success. Following the Wall Street Crash, the Nazis became the largest party in the Reichstag, winning 230 seats in July 1932. Hitler consistently refused ministerial posts under other chancellors, insisting on the top job because of his millions of voters and the street power of 400,000 SA stormtroopers.<br><br>Furthermore, Hindenburg's reliance on Article 48 emergency decrees had already destroyed parliamentary democracy between 1930 and 1932, creating a constitutional vacuum that paved the way for an authoritarian leader.<br><br>In conclusion, I agree with Interpretation 1 to a greater extent. While mass votes made Hitler a candidate, it was Papen's fateful miscalculation and conservative scheming that actually handed Hitler power when his electoral support was declining.";

  // Sources L8
  mod.lessons[7].sources[0].model_answer = "The election data proves that while the Nazis remained the largest party in November 1932, their vote dropped by 2 million, showing their momentum was slowing.";
  mod.lessons[7].sources[1].model_answer = "Schleicher's failed attempt to split the Nazi Party by offering Gregor Strasser the vice-chancellorship alienated both Hitler and conservative industrialists.";
  mod.lessons[7].sources[2].model_answer = "Papen's arrogant boast reveals that conservative elites fatally believed they could 'box Hitler into a corner' and use him as a puppet.";
  mod.lessons[7].sources[3].model_answer = "The cartoon satirizes Hindenburg and Papen lifting Hitler onto the horse of power, warning that they were recklessly creating a monster they could not control.";
  mod.lessons[7].sources[4].model_answer = "The cabinet photograph shows that only three of eleven ministers were Nazis, illustrating Papen's initial plan to keep the radical NSDAP heavily outnumbered.";

  // --- LESSON 9 ---
  // Q1: Inference (4 marks)
  mod.lessons[8].exam_practice.questions[0].model = 
    "<strong>Inference 1:</strong> The Nazi regime used the Reichstag fire to immediately strip citizens of basic civil liberties. <strong>Detail:</strong> The decree suspended freedom of speech, assembly, and the press.<br><br><strong>Inference 2:</strong> The state granted police unlimited powers of arbitrary arrest. <strong>Detail:</strong> Police were legally empowered to search homes and detain political suspects without trial.";
  // Q2: 12 marks Explain why Hitler established a dictatorship 1933-1934
  mod.lessons[8].exam_practice.questions[1].model = 
    "One reason Hitler was able to establish a dictatorship was the Reichstag Fire in February 1933. Blaming a communist conspiracy, Hitler persuaded President Hindenburg to sign the Emergency Decree 'For the Protection of People and State'. This suspended basic civil liberties and allowed the SA and police to arrest 4,000 communists, crushing political opposition before the March election.<br><br>Furthermore, the Enabling Act (March 1933) gave Hitler full dictatorial powers. Intimidating the Reichstag with armed SS and SA troops and securing the Centre Party's support, Hitler passed the law allowing him to make laws without Reichstag or presidential approval for four years, legally dismantling the Weimar Constitution.<br><br>Finally, the Night of the Long Knives (June 1934) eliminated internal rivals. Fearing Ernst Röhm's 2-million-strong SA and needing the army's support, Hitler had Röhm and hundreds of SA leaders executed. When Hindenburg died in August 1934, the army swore an oath of personal loyalty to Hitler as *Führer*, completing the dictatorship.";

  // Sources L9
  mod.lessons[8].sources[0].model_answer = "The Reichstag Fire Decree suspended all fundamental civil liberties, allowing the Nazi regime to legally detain thousands of communist rivals without charge.";
  mod.lessons[8].sources[1].model_answer = "Otto Wels' courageous speech in the Kroll Opera House marked the final democratic defiance against the Enabling Act before the SPD was outlawed.";
  mod.lessons[8].sources[2].model_answer = "The July 1933 decree officially established the one-party state, declaring the NSDAP the only legal political party in Germany and banning all opposition.";
  mod.lessons[8].sources[3].model_answer = "Hitler's speech justified the Night of the Long Knives murders by claiming he acted as the 'supreme judge' of the nation to avert treason.";
  mod.lessons[8].sources[4].model_answer = "The soldier's oath bound the entire German military personally to Adolf Hitler as Supreme Commander, eliminating the armed forces as an independent check on his power.";

  // --- LESSON 10 ---
  // Q1: 12 marks Police State Control
  mod.lessons[9].exam_practice.questions[0].model = 
    "One reason the Nazi police state maintained control was the terror created by the SS (Schutzstaffel) and Gestapo. Led by Heinrich Himmler, the SS ran the concentration camps (starting with Dachau in 1933) where political opponents were tortured. The Gestapo (Secret State Police) used wiretaps and arbitrary arrest, operating above the law so that anyone suspected of disloyalty disappeared into 'protective custody'.<br><br>Furthermore, the regime relied heavily on civilian informers and denunciations. Contrary to myth, the Gestapo was small (only 28 officers in Frankfurt), but ordinary citizens regularly denounced neighbors, colleagues, and family members to settle personal grudges or display loyalty, creating an atmosphere of paranoia where people self-censored.<br><br>Finally, the Nazis placed the legal system under total political control. Judges had to join the National Socialist League for the Maintenance of the Law, swearing loyalty to Hitler. In 1934, Hitler created the People's Court (*Volksgerichtshof*) to try treason cases without juries, ensuring guilty verdicts and frequent death sentences for dissidents.";
  // Q2: 8 marks Utility Sources A and B
  mod.lessons[9].exam_practice.questions[1].model = 
    "Source A is useful for an enquiry into police state methods because it records Himmler's official announcement of Dachau concentration camp in March 1933, stating it would hold 5,000 communist and socialist political prisoners. From my knowledge, Dachau was the first camp built to isolate left-wing opponents and intimidate the public. As an official press release, it shows how openly the regime publicized concentration camps as a deterrent against resistance.<br><br>Source B is useful because it is a Gestapo interrogation dossier documenting an ordinary citizen denounced by a neighbor for telling an anti-Hitler joke. Contextually, the Gestapo relied on voluntary public denunciations to police society, generating widespread fear. As a secret internal police file, it provides highly reliable, unfiltered evidence of surveillance methods. However, it does not reveal the wider role of the SS or People's Court. Overall, both sources are very useful for showing how state terror and public denunciations enforced obedience.";

  // Sources L10
  mod.lessons[9].sources[0].model_answer = "Himmler's announcement of Dachau demonstrates that early concentration camps were openly publicized to terrify the public and neutralize political opposition.";
  mod.lessons[9].sources[1].model_answer = "The Gestapo file shows that ordinary civilian denunciations, rather than massive secret police numbers, were the primary driver of everyday surveillance.";
  mod.lessons[9].sources[2].model_answer = "The People's Court law abolished independent trials, ensuring that political dissenters were tried by fanatical Nazi judges with no right of appeal.";
  mod.lessons[9].sources[3].model_answer = "Pope Pius XI's encyclical *Mit brennender Sorge* publicly condemned the Nazi regime for violating the 1933 Concordat and promoting idolatrous racial paganism.";
  mod.lessons[9].sources[4].model_answer = "The Barmen Declaration shows the Confessing Church rejecting Nazi control and opposing the state-backed 'German Christians' who tried to Nazify Protestant theology.";

  // --- LESSON 11 ---
  // Q1: 4 marks COP
  mod.lessons[10].exam_practice.questions[0].model = 
    "<strong>Content:</strong> Source B illustrates how cheap radios (the *Volksempfänger*) were mass-produced to bring Nazi propaganda directly into living rooms, while Source C describes the intense emotional power of mass rallies.<br><br><strong>Provenance:</strong> Source B is an official commercial artifact promoting cheap technology, whereas Source C is an American journalist's critical eyewitness account of crowd hypnosis in Nuremberg.";
  // Q2: 8 marks Utility Sources B and C
  mod.lessons[10].exam_practice.questions[1].model = 
    "Source B is useful for an enquiry into propaganda methods because it shows the *Volksempfänger* (People's Receiver), an affordable radio manufactured to broadcast Hitler's speeches into every household. From my knowledge, Joseph Goebbels ensured radios had short wavelengths so Germans could not listen to foreign broadcasts like the BBC, increasing radio ownership to 70% by 1939. As an authentic material artifact, it provides physical evidence of technological indoctrination.<br><br>Source C is useful because American journalist William Shirer describes the 1934 Nuremberg Rally, capturing the theatrical manipulation of searchlights, banners, and synchronized marching to create religious devotion to Hitler. As an independent foreign eyewitness, Shirer had no motive to produce Nazi propaganda, giving an objective record of psychological conditioning. However, neither source shows newspaper censorship or cinema films like *Triumph of the Will*. Overall, both sources are highly useful for showing technological and theatrical propaganda.";

  // Sources L11
  mod.lessons[10].sources[0].model_answer = "Goebbels explains that the Propaganda Ministry aimed to unite the entire German population behind Hitler's policies through total control of culture.";
  mod.lessons[10].sources[1].model_answer = "The Volksempfänger brought state propaganda directly into millions of homes at an affordable price, with short-range tuning preventing foreign radio listening.";
  mod.lessons[10].sources[2].model_answer = "Shirer's diary captures how Nuremberg rallies created quasi-religious fanaticism, using massive parades and spotlights to overwhelm individual critical thought.";
  mod.lessons[10].sources[3].model_answer = "The report reveals how strict Reich Press Chamber guidelines dictated exact headlines and banned independent journalism, ensuring uniform pro-Nazi news.";
  mod.lessons[10].sources[4].model_answer = "The 'Degenerate Music' exhibition poster demonstrates how the regime banned jazz and modern music, labeling cultural diversity as racial poisoning.";

  // --- LESSON 12 ---
  // Q1: 4 marks Interpretation Views
  mod.lessons[11].exam_practice.questions[0].model = 
    "One key difference is that Interpretation 1 argues that religious opposition to the Nazis was widespread, heroic, and organized through institutions like the Confessing Church. In contrast, Interpretation 2 suggests religious opposition was timid, fragmented, and mostly limited to defending church autonomy rather than defending Jewish victims or overthrowing the regime.";
  // Q2: 16 marks (+4 SPaG)
  mod.lessons[11].exam_practice.questions[1].model = 
    "Interpretation 1 emphasizes that Christian churches mounted courageous resistance to Nazi totalitarianism. Notable figures like Protestant pastor Martin Niemöller and Dietrich Bonhoeffer established the Confessing Church in 1934, with over 6,000 pastors refusing to join the state-backed 'German Christians'. Furthermore, Catholic Bishop Galen gave fiery sermons in 1941 exposing the secret T4 euthanasia programme, which forced Hitler to suspend public killings. These actions prove that individuals took immense moral risks to defy Nazi policies.<br><br>On the other hand, Interpretation 2 provides a more realistic assessment: church leaders largely cooperated with the regime to protect their own privileges. In 1933, the Catholic Church signed the Reichskonkordat with Hitler, agreeing that priests would stay out of politics in return for protected Catholic schools. When the regime began persecuting Jews, passing the Nuremberg Laws, and launching *Kristallnacht*, church hierarchies remained largely silent, offering no collective protest.<br><br>Furthermore, the vast majority of German Christians complied with the state, welcoming Hitler’s anti-communism and restoration of national pride, meaning active religious opposition remained an exceptional minority.<br><br>In conclusion, I agree with Interpretation 2 to a greater extent. While brave individuals like Bonhoeffer and Galen resisted, both the Catholic and Protestant leadership chose institutional self-preservation over moral confrontation, failing to offer broad resistance.";

  // Sources L12
  mod.lessons[11].sources[0].model_answer = "The underground Sopade report documents persistent working-class resistance, showing trade unionists secretly distributing anti-Nazi newsletters in factory districts.";
  mod.lessons[11].sources[1].model_answer = "The camouflaged leaflet demonstrates the dangerous methods used by underground socialists, disguising anti-regime propaganda as innocent shampoo adverts.";
  mod.lessons[11].sources[2].model_answer = "The Gestapo report reveals growing official concern over youth rebellion, noting the Edelweiss Pirates refused to join the Hitler Youth and beat up Nazi officials.";
  mod.lessons[11].sources[3].model_answer = "The SD report shows that while passive grumbling over food shortages was widespread, it rarely developed into organized political resistance against the state.";
  mod.lessons[11].sources[4].model_answer = "Bonhoeffer's clandestine theological seminary represents deep Christian resistance, training pastors to reject Nazi racial ideology and state control.";

  // --- LESSON 13 ---
  // Q1: Inference (4 marks)
  mod.lessons[12].exam_practice.questions[0].model = 
    "<strong>Inference 1:</strong> The Nazi regime viewed women's role as strictly domestic and motherly. <strong>Detail:</strong> Goebbels stated that a woman's highest mission was to give children to the nation.<br><br><strong>Inference 2:</strong> Women were deliberately excluded from public and professional life. <strong>Detail:</strong> Goebbels insisted politics and leadership belonged entirely to men.";
  // Q2: 12 marks Explain why policies towards women implemented
  mod.lessons[12].exam_practice.questions[1].model = 
    "One reason Nazi policies towards women were implemented was to reverse the sharp decline in Germany's birth rate. During the 1920s, births fell to under one million per year, which threatened Hitler’s military ambitions. To boost births, the regime offered Marriage Loans of 1,000 marks, deducting 25% for each child born, and awarded the Honour Cross of the German Mother (bronze for 4, gold for 8) to reward large families.<br><br>Furthermore, the regime wanted to remove women from employment to reduce male unemployment. Under the policy of *Kinder, Küche, Kirche* (Children, Kitchen, Church), women were dismissed from civil service, legal, and medical professions. Banning female doctors and judges freed up professional jobs for men, fulfilling Nazi ideological beliefs about gender roles.<br><br>Finally, racial eugenics shaped policies toward women. Under the Law for the Prevention of Hereditarily Diseased Offspring (1933), over 300,000 women deemed 'genetically unfit' or racially inferior were forcibly sterilized to ensure only 'pure Aryan' children were born.";

  // Sources L13
  mod.lessons[12].sources[0].model_answer = "Goebbels asserts that woman's natural role is motherhood and domestic devotion, arguing that politics and statecraft belong exclusively to men.";
  mod.lessons[12].sources[1].model_answer = "The Marriage Loan law provided financial incentives for couples to marry and have children, deducting 25% of the debt per newborn infant.";
  mod.lessons[12].sources[2].model_answer = "Scholtz-Klink's speech emphasizes that German women should serve the state through domestic self-sacrifice, cooking frugally and raising patriotic soldiers.";
  mod.lessons[12].sources[3].model_answer = "The 1933 Sterilization Law demonstrates the brutal eugenic core of Nazi policy, forcing sterilization on hundreds of thousands judged 'hereditarily diseased'.";
  mod.lessons[12].sources[4].model_answer = "The Sopade report reveals growing friction after 1937, as the regime hypocritically forced women back into rearmament factories to meet labor shortages.";

  // --- LESSON 14 ---
  // Q1: 12 marks Youth policies
  mod.lessons[13].exam_practice.questions[0].model = 
    "One reason the Nazi regime prioritized controlling the young was to ensure the long-term survival of the 'Thousand-Year Reich'. Hitler understood that adults who grew up under the Weimar Republic might hold democratic loyalties, whereas children could be conditioned from infancy to accept Nazi ideology without questioning authority.<br><br>Furthermore, controlling youth was essential for preparing boys for military conquest. In the Hitler Youth (*Hitlerjugend*), made compulsory in 1939, boys engaged in military drills, map-reading, shooting practice, and grueling marches, turning them into obedient, physically hardened soldiers ready for war.<br><br>Finally, the regime reorganized school curricula to brainwash young minds. History was rewritten to praise Germanic victories, Biology focused on Nazi racial purity and eugenics, and PE occupied 15% of timetables. Girls in the BDM (League of German Girls) were trained in hygiene, cooking, and child-rearing to become mothers of future soldiers.";
  // Q2: 8 marks Utility Sources A and B
  mod.lessons[13].exam_practice.questions[1].model = 
    "Source A is useful for an enquiry into youth indoctrination because it details the 1936 Hitler Youth Law, making membership compulsory and stating that all German youth would be educated 'physically, intellectually, and morally in the spirit of National Socialism'. Contextually, the law forced non-Nazi clubs like Catholic and scouting groups to close. As an official state decree, it gives exact legal evidence of the regime's total control over young people.<br><br>Source B is useful because it depicts Hitler addressing 54,000 disciplined Hitler Youth members at the 1938 Nuremberg Rally. The vast, uniformed stadium visualizes the scale of militarization and hero-worship directed at the *Führer*. However, as official propaganda, it hides the growing dissatisfaction of young rebels like the Edelweiss Pirates and Swing Youth who avoided meetings. Overall, both sources are highly useful for showing the legal compulsion and propaganda spectacles used to control youth.";

  // Sources L14
  mod.lessons[13].sources[0].model_answer = "The 1936 decree made Hitler Youth membership compulsory, giving the state legal authority over children's education outside of school and family.";
  mod.lessons[13].sources[1].model_answer = "The rally photograph captures how massive pageantry was used to make boys feel like proud, uniformed members of an invincible military army.";
  mod.lessons[13].sources[2].model_answer = "The BDM pamphlet shows girls participating in calisthenics, designed to build healthy, fit bodies capable of bearing strong Aryan children.";
  mod.lessons[13].sources[3].model_answer = "The school mathematics problem shows how antisemitic propaganda was injected into ordinary subjects, calculating the cost of caring for the disabled.";
  mod.lessons[13].sources[4].model_answer = "The Sopade report documents that teenagers increasingly resented boring military drill and endless propaganda in the compulsory Hitler Youth.";

  // --- LESSON 15 ---
  // Q1: 4 marks COP
  mod.lessons[14].exam_practice.questions[0].model = 
    "<strong>Content:</strong> Source B highlights Dr. Todt praising the Autobahn as a triumph of employment and engineering, while Source C provides statistical evidence of unemployment dropping from 6 million to under 500,000.<br><br><strong>Provenance:</strong> Source B is an official propaganda speech celebrating state achievements, whereas Source C contains official statistical records that hide women and Jews to make recovery look miraculous.";
  // Q2: 8 marks Utility Sources B and C
  mod.lessons[14].exam_practice.questions[1].model = 
    "Source B is useful for an enquiry into living standards because it shows Dr. Fritz Todt celebrating the construction of the Autobahn highway network, claiming it provided thousands of jobs and restored national dignity. From my knowledge, public works and rearmament significantly reduced unemployment. As an official speech, it reflects how the regime promoted public works to convince workers of economic recovery.<br><br>Source C is useful because it provides official government statistics showing unemployment plunging from 6 million in 1933 to under 500,000 by 1938. However, contextual knowledge reveals these figures were distorted through 'invisible unemployment': Jews, married women, and men in compulsory Reich Labour Service (RAD) or conscripted into the army were excluded from figures. Furthermore, independent trade unions were abolished and replaced by the German Labour Front (DAF), which lengthened working hours. Overall, both sources are very useful for showing how the regime achieved and publicized economic recovery.";

  // Sources L15
  mod.lessons[14].sources[0].model_answer = "The RAD law made six months of hard manual labor compulsory for young men, keeping them off the unemployment register while building public works.";
  mod.lessons[14].sources[1].model_answer = "Todt's speech celebrates the Autobahns as an engineering triumph, masking their strategic military value for rapidly moving troops across Germany.";
  mod.lessons[14].sources[2].model_answer = "Official unemployment charts showed dramatic drops, but excluded women, Jews, and conscripts to create an exaggerated impression of economic miracle.";
  mod.lessons[14].sources[3].model_answer = "Ley's proclamation outlawed independent trade unions, forcing all German workers into the Nazi DAF where strikes were banned and wages capped.";
  mod.lessons[14].sources[4].model_answer = "The KdF emblem represented subsidized leisure rewards (concerts, theater, cruise holidays) designed to win working-class loyalty to the regime.";

  // --- LESSON 16 ---
  // Q1: 4 marks Interpretation Views
  mod.lessons[15].exam_practice.questions[0].model = 
    "One key difference is that Interpretation 1 suggests *Kristallnacht* in November 1938 was a spontaneous outburst of public fury triggered by the murder of diplomat von Rath in Paris. In contrast, Interpretation 2 argues the violence was a planned, state-orchestrated pogrom carefully organized by Goebbels, the SA, and the SS.";
  // Q2: 16 marks (+4 SPaG)
  mod.lessons[15].exam_practice.questions[1].model = 
    "Interpretation 2 argues that the anti-Jewish violence of *Kristallnacht* (November 1938) was deliberately orchestrated by Nazi leaders rather than a spontaneous public riot. There is overwhelming historical evidence for this: following the assassination of Ernst vom Rath by Herschel Grynszpan, Joseph Goebbels delivered an inflammatory speech to SA and party leaders in Munich, explicitly instructing that anti-Jewish demonstrations should 'not be prevented'. Secret telegraphs sent by Reinhard Heydrich to police and fire brigades ordered them not to intervene while SA men burned synagogues, but only to protect neighboring German property. Over 91 Jews were murdered, 1,000 synagogues burned, and 20,000 Jewish men were sent to concentration camps, proving systematic coordination.<br><br>On the other hand, Interpretation 1 reflects Nazi propaganda, which falsely claimed the pogrom was an uncontrollable eruption of popular German outrage. While some fanatic party members and civilians joined in the destruction of Jewish shops, widespread reports from the British Consul and ordinary diaries show that most Germans were shocked and disgusted by the open violence and destruction of property in the streets.<br><br>Furthermore, the aftermath proved the state's calculated economic motive: the regime fined the Jewish community 1 billion marks for the damage and banned them from operating businesses.<br><br>In conclusion, I agree entirely with Interpretation 2. *Kristallnacht* was not a spontaneous riot, but a state-organized turning point that marked the transition from legal discrimination to violent physical persecution.";

  // Sources L16
  mod.lessons[15].sources[0].model_answer = "The textbook shows how Nazi children were taught pseudo-scientific racial theory, indoctrinating pupils to view Jews as racial parasites.";
  mod.lessons[15].sources[1].model_answer = "The photograph captures SA stormtroopers intimidating German shoppers outside Jewish stores during the nationwide boycott of April 1933.";
  mod.lessons[15].sources[2].model_answer = "The 1935 Nuremberg Laws stripped German Jews of citizenship rights and banned marriage or sexual relations between Jews and Aryans.";
  mod.lessons[15].sources[3].model_answer = "Heydrich's secret instructions prove *Kristallnacht* was officially planned, commanding police not to halt SA violence and to arrest 20,000 wealthy Jews.";
  mod.lessons[15].sources[4].model_answer = "The British Consul's report documents that ordinary German citizens were largely horrified by the brutal violence, looting, and arson of *Kristallnacht*.";

  // Write out changes
  fs.writeFileSync(pUnit, 'export default ' + JSON.stringify(mod, null, 2) + ';\n', 'utf8');
  fs.writeFileSync(pPublic, 'export default ' + JSON.stringify(mod, null, 2) + ';\n', 'utf8');
  console.log('✅ Successfully calibrated all 32 exam models and 80 source drawers in Weimar & Nazi Germany!');
}

run().catch(console.error);

