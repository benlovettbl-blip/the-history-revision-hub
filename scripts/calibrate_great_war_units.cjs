const fs = require('fs');
const path = require('path');

function calibrateUnit(unitId, updateFn) {
  const p1 = path.resolve(__dirname, `../units/${unitId}/data.js`);
  const p2 = path.resolve(__dirname, `../public/units/${unitId}/data.js`);

  [p1, p2].forEach(fp => {
    if (!fs.existsSync(fp)) return;
    const data = require(fp).default;
    updateFn(data);
    fs.writeFileSync(fp, `export default ${JSON.stringify(data, null, 2)};\n`, 'utf8');
    console.log(`Calibrated ${unitId} in ${fp}`);
  });
}

// 1. great_war_part2
calibrateUnit('great_war_part2', (data) => {
  // L1: Recruitment 1914 (12m)
  const l1Model = "A primary reason British men volunteered in huge numbers in autumn 1914 was powerful patriotic enthusiasm and anti-German propaganda. Lord Kitchener’s famous recruitment poster and newspaper reports of German atrocities in neutral Belgium convinced men it was their moral duty to defend King and country.<br><br>Furthermore, social pressure and 'Pals Battalions' drove mass enlistment. The War Office encouraged friends, sports teams, and factory workmates to join up together with the promise of serving side by side. Fearing public shame or being handed a white feather for cowardice, over 750,000 men enlisted by the end of September.";
  if (data.lessons[0].tasks?.[0]) data.lessons[0].tasks[0].model_answer = l1Model;
  if (data.lessons[0].exam_practice?.questions?.[0]) data.lessons[0].exam_practice.questions[0].model = l1Model;

  // L2: Features of trenches (4m) & Somme casualties (8m)
  if (data.lessons[1].exam_practice?.questions?.[0]) {
    data.lessons[1].exam_practice.questions[0].model = "One feature of trench defence systems was the three-tier line consisting of frontline, support, and reserve trenches connected by communication trenches. Another feature was defensive reinforcement, including thick belts of barbed wire and sandbagged parapets with machine-gun posts protecting the firestep.";
  }
  const l2Somme = "A primary reason the First Day of the Somme resulted in catastrophic casualties (57,470 British casualties, with 19,240 killed) was the complete failure of the preliminary artillery bombardment. The seven-day artillery barrage failed to cut the German barbed wire or destroy deep underground German concrete dugouts.<br><br>Furthermore, rigid British tactical orders proved disastrous. British soldiers were ordered to walk slowly in straight lines across No Man's Land burdened with 30kg of equipment. When the bombardment lifted, German machine gunners emerged from their deep shelters and mowed down advancing infantry in open daylight.";
  if (data.lessons[1].tasks?.[1]) data.lessons[1].tasks[1].model_answer = l2Somme;
  if (data.lessons[1].exam_practice?.questions?.[1]) data.lessons[1].exam_practice.questions[1].model = l2Somme;

  // L3: Colonial troops interpretations (4m each) & task (8m)
  if (data.lessons[2].exam_practice?.questions?.[0]) {
    data.lessons[2].exam_practice.questions[0].model = "Interpretation 1 emphasises that colonial troops faced severe racial discrimination, unequal pay, and were restricted largely to dangerous labour battalions. In contrast, Interpretation 2 highlights their crucial combat heroism and equal valor in major front-line battles like Neuve Chapelle and Gallipoli.";
  }
  if (data.lessons[2].exam_practice?.questions?.[1]) {
    data.lessons[2].exam_practice.questions[1].model = "The interpretations differ because the historians focus on different aspects of colonial service. The author of Interpretation 1 investigates British official colonial policy and labour records, whereas Interpretation 2 relies on soldier memoirs and battlefield citations celebrating frontline military sacrifice.";
  }
  if (data.lessons[2].tasks?.[0]) {
    data.lessons[2].tasks[0].model_answer = "Colonial troops from India, Africa, and the Caribbean played a vital role in sustaining the Allied war effort. Over 1.3 million Indian soldiers served on the Western Front and in Mesopotamia, providing essential combat manpower at crucial moments like the 1914 Battle of Ypres. However, they faced systemic racism from British commanders, receiving inferior rations and lower pay while being excluded from becoming commissioned officers.";
  }

  // L4: Shell crisis to conscription (8m) & female munitions workers (8m)
  const l4Narrative = "Initially, the May 1915 Battle of Aubers Ridge exposed a disastrous lack of high-explosive artillery ammunition, known as the 'Shell Crisis'. This scandal forced Prime Minister Asquith to form a wartime coalition and create the Ministry of Munitions under David Lloyd George.<br><br>As voluntary recruitment plunged while casualties soared on the Western Front, the government passed the National Registration Act (1915) and Derby Scheme, which failed to produce enough men.<br><br>Finally, the Military Service Act of January 1916 introduced compulsory conscription for single men aged 18 to 41, ending Britain's tradition of a volunteer army.";
  if (data.lessons[3].tasks?.[0]) data.lessons[3].tasks[0].model_answer = l4Narrative;
  if (data.lessons[3].exam_practice?.questions?.[0]) data.lessons[3].exam_practice.questions[0].model = l4Narrative;

  const l4Munitionettes = "Female munitions workers ('munitionettes') were of decisive importance because they sustained the essential flow of weapons and shells to the frontline after millions of men were conscripted. By 1918, nearly one million women worked in munitions factories, producing 80% of Britain’s shells and risking their lives handling toxic TNT powder, which turned their skin yellow ('canary girls').<br><br>Furthermore, their vital contribution transformed public attitudes toward female capability. Demonstrating industrial stamina shattered anti-suffrage arguments, leading directly to the Representation of the People Act 1918 granting voting rights to women over 30.";
  if (data.lessons[3].tasks?.[1]) data.lessons[3].tasks[1].model_answer = l4Munitionettes;
  if (data.lessons[3].exam_practice?.questions?.[1]) data.lessons[3].exam_practice.questions[1].model = l4Munitionettes;

  // L5: Versailles harshness essay (12m)
  const l5Versailles = "On the one hand, the Treaty of Versailles was exceptionally harsh and humiliated Germany. Article 231 (War Guilt Clause) forced Germany to accept total blame, justifying crushing reparations of £6.6 billion. Germany lost 13% of its European territory, including Alsace-Lorraine and the Polish Corridor, while its military was slashed to 100,000 men with no air force or tanks. German citizens denounced it as a dictated peace ('Diktat') and sought revenge.<br><br>On the other hand, the treaty left Germany fundamentally intact as a major European industrial power. Unlike the Austro-Hungarian and Ottoman empires, which were completely dismantled, Germany retained its industrial heartlands in the Ruhr and Rhineland. Therefore, while its terms created intense political bitterness, the war was caused by the failure of Britain and France to enforce the treaty in the 1930s rather than the treaty terms alone.";
  if (data.lessons[4].tasks?.[0]) data.lessons[4].tasks[0].model_answer = l5Versailles;
  if (data.lessons[4].exam_practice?.questions?.[0]) data.lessons[4].exam_practice.questions[0].model = l5Versailles;
});

// 2. great_war
calibrateUnit('great_war', (data) => {
  // L1: German Empire 1871 (12m)
  const l1Model = "A primary reason the creation of the German Empire in 1871 created long-term instability was that it radically altered the European balance of power. After defeating France, unified Germany became the dominant military and industrial superpower in central Europe. To prevent French revenge for the loss of Alsace-Lorraine, Chancellor Otto von Bismarck created complex alliances that divided Europe into competing camps.<br><br>Furthermore, Kaiser Wilhelm II’s aggressive foreign policy ('Weltpolitik') after 1890 increased friction. Demanding Germany's 'place in the sun', the Kaiser challenged British naval supremacy and meddled in colonial disputes, triggering a dangerous atmosphere of suspicion.";
  if (data.lessons[0].tasks?.[0]) data.lessons[0].tasks[0].model_answer = l1Model;
  if (data.lessons[0].exam_practice?.questions?.[0]) data.lessons[0].exam_practice.questions[0].model = l1Model;

  // L2: Agadir crisis features (4m) & consequence (4m)
  if (data.lessons[1].tasks?.[0]) data.lessons[1].tasks[0].model_answer = "One feature of the 1911 Agadir Crisis was the dispatch of the German gunboat SMS Panther to the Moroccan port of Agadir to challenge French influence. Another feature was British diplomatic intervention through Lloyd George’s Mansion House speech, warning Germany that Britain would fight alongside France.";
  if (data.lessons[1].exam_practice?.questions?.[0]) data.lessons[1].exam_practice.questions[0].model = data.lessons[1].tasks[0].model_answer;

  const l2Consequence = "One consequence of the Moroccan Crises was the strengthening of the Anglo-French Entente Cordiale. Specifically, British and French leaders grew deeply suspicious of German aggression, leading to secret military naval talks where Britain agreed to guard the North Sea while the French navy protected the Mediterranean.";
  if (data.lessons[1].tasks?.[1]) data.lessons[1].tasks[1].model_answer = l2Consequence;
  if (data.lessons[1].exam_practice?.questions?.[1]) data.lessons[1].exam_practice.questions[1].model = l2Consequence;

  // L3: Naval arms race interpretations (4m each) & task
  if (data.lessons[2].exam_practice?.questions?.[0]) {
    data.lessons[2].exam_practice.questions[0].model = "Interpretation 1 suggests that the naval race was driven by Kaiser Wilhelm’s personal vanity and Germany's legitimate desire for a world navy. In contrast, Interpretation 2 argues that Germany's naval expansion was a deliberate, aggressive challenge designed to threaten Britain's island security and empire.";
  }
  if (data.lessons[2].exam_practice?.questions?.[1]) {
    data.lessons[2].exam_practice.questions[1].model = "The interpretations differ because the historians focus on different evidence. Interpretation 1 examines German domestic politics and the Kaiser's diaries, while Interpretation 2 evaluates British Admiralty strategic reports and warship building statistics.";
  }
  if (data.lessons[2].tasks?.[0]) {
    data.lessons[2].tasks[0].model_answer = "The Anglo-German naval arms race was a major cause of pre-war tension. Following Britain's launch of HMS Dreadnought in 1906, Admiral Tirpitz and Kaiser Wilhelm passed Naval Laws to build German dreadnoughts. Britain viewed this as a direct existential threat to its maritime empire, forcing the British government to outbuild Germany by adopting a policy of constructing two battleships for every German one.";
  }

  // L4: Balkan crises narrative (8m) & alliance importance (8m)
  const l4Narrative = "Initially, tension in the Balkans erupted in 1908 when Austria-Hungary annexed Bosnia, outraging Serbia and Russia. Germany forced Russia to back down by threatening military support for Austria.<br><br>Following this, the Balkan Wars of 1912–1913 expelled the Ottoman Empire and doubled the size of Serbia. Serbia emerged as an aggressive Slavic power determined to liberate Serbs living under Austro-Hungarian rule.<br><br>Finally, the crisis peaked on 28 June 1914 when Bosnian Serb nationalist Gavrilo Princip assassinated Archduke Franz Ferdinand in Sarajevo. Austria-Hungary issued an ultimatum to crush Serbia, triggering the alliance system and dragging all European great powers into war.";
  if (data.lessons[3].tasks?.[0]) data.lessons[3].tasks[0].model_answer = l4Narrative;
  if (data.lessons[3].exam_practice?.questions?.[0]) data.lessons[3].exam_practice.questions[0].model = l4Narrative;

  const l4Alliances = "The alliance systems were of crucial importance because they transformed a localized Balkan quarrel into a continent-wide conflict. By 1914, Europe was divided into two armed camps: the Triple Alliance (Germany, Austria-Hungary, Italy) and the Triple Entente (Britain, France, Russia). When Germany gave Austria a 'blank cheque' to attack Serbia, Russia mobilised to protect its Slavic ally, which automatically triggered the German Schlieffen Plan against France, drawing Britain into war to defend Belgian neutrality.";
  if (data.lessons[3].tasks?.[1]) data.lessons[3].tasks[1].model_answer = l4Alliances;
  if (data.lessons[3].exam_practice?.questions?.[1]) data.lessons[3].exam_practice.questions[1].model = l4Alliances;

  // L5: Main cause of WW1 (12m)
  const l5Causes = "On the one hand, alliance rivalries were a vital cause of the war because they bound great powers together through mutual defense treaties. Germany’s unconditional 'blank cheque' encouraged Austria-Hungary to declare war on Serbia. Because Russia mobilised to defend Serbia, Germany invaded France via Belgium, forcing Britain into the conflict.<br><br>On the other hand, militarism and imperial rivalries were equally decisive in causing war. The Anglo-German naval arms race created intense paranoia, while rigid military timetables like Germany's Schlieffen Plan left no room for diplomatic compromise once mobilisation began. Therefore, while alliances created the chain reaction, aggressive militarism ensured that European leaders were willing to gamble on war in July 1914.";
  if (data.lessons[4].tasks?.[0]) data.lessons[4].tasks[0].model_answer = l5Causes;
  if (data.lessons[4].exam_practice?.questions?.[0]) data.lessons[4].exam_practice.questions[0].model = l5Causes;

  // L6: Assessment (12m)
  if (data.lessons[5]?.tasks?.[0]) data.lessons[5].tasks[0].model_answer = l5Causes;
});
