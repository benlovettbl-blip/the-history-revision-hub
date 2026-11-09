const fs = require('fs');

const d = JSON.parse(fs.readFileSync('./data/the_shoah.json', 'utf8'));

const updates = {
  // L1 B1
  '0_0': '<p class="prose-p"><span class="para-ref">[1.1]</span> In the early 1930s, approximately 9.5 million Jewish people lived across continental Europe, representing under two percent of the total population. European Jewry was immensely diverse, spanning distinct traditions, occupations, and vibrant civic cultures.</p><p class="prose-p">Over sixty percent lived in Central and Eastern Europe, predominantly across Poland, Hungary, Romania, and the Soviet Union, where millions spoke Yiddish as their mother tongue. Smaller communities flourished in Western Europe, including Germany, Britain, and France, contributing richly to science, arts, and civic life.</p>',

  // L1 B2
  '0_1': '<p class="prose-p"><span class="para-ref">[1.2]</span> Across the countryside of Eastern Europe lay a distinct cultural world known as Yiddishland. Millions of Jews lived in rural shtetls (small market towns) and expanding cities like Warsaw and Kraków, creating a flourishing Yiddish culture with its own literature, theatre, and newspapers.</p><p class="prose-p">In cities like Vilna, celebrated as the "Jerusalem of the North", Jewish community life hummed with energy. World-renowned talmudic academies existed alongside modern socialist political parties, Zionist youth organisations, and avant-garde art collectives, creating a deeply rooted, vibrant civilization.</p>',

  // L1 B3
  '0_2': '<p class="prose-p"><span class="para-ref">[1.3]</span> The experience of Jewish communities in Western and Central Europe was markedly different. Following emancipation in 1871, German & Western Jews were thoroughly assimilated: they spoke German, attended universities, and integrated deeply into professional, cultural, and political life.</p><p class="prose-p">During the First World War, over 100,000 German Jewish soldiers served loyally in the imperial armed forces, with 12,000 dying on European battlefields. German Jews viewed themselves not as outsiders, but as proud, patriotic citizens who contributed monumental achievements to science, industry, and the arts.</p>',

  // L1 B5
  '0_4': '<p class="prose-p"><span class="para-ref">[1.5]</span> For centuries, medieval Christian Europe harboured deep religious anti-Judaism, blaming Jewish communities for the death of Christ, restricting guild membership, and carrying out violent expulsions. However, in the late nineteenth century, a fatal ideological mutation occurred.</p><p class="prose-p">Theorists invented modern racial antisemitism, treating Jewish identity not as a religious faith that could be escaped through Christian baptism, but as pseudo-scientific biological racism carried in the blood. Adolf Hitler and the Nazi Party adopted this toxic racial theory as the foundation of their totalitarian worldview.</p>',

  // L2 B3
  '1_2': '<p class="prose-p"><span class="para-ref">[2.3]</span> Between 1933 and 1938, the Nazi regime issued over 400 separate anti-Jewish decrees to strip Jewish citizens of their livelihoods and rights. Systematic Aryanization of businesses forced Jewish owners to sell shops and factories to German buyers at rock-bottom prices.</p><p class="prose-p">These pervasive regulations enforced brutal \'social death\' exclusion from public life. Jews were expelled from schools, barred from cinemas and parks, restricted to yellow benches, and forbidden from owning radios or pets, as former neighbours crossed the street to avoid greeting them.</p>',

  // L2 B4
  '1_3': '<p class="prose-p"><span class="para-ref">[2.4]</span> On the night of 9–10 November 1938, the Nazi regime orchestrated a nationwide pogrom known as Kristallnacht (the Night of Broken Glass). Propaganda Minister Joseph Goebbels unleashed the SA, SS, and Hitler Youth to launch violent coordinated assaults on Jewish communities.</p><p class="prose-p">Across forty-eight hours, over 1,400 synagogues were burned or destroyed, 7,500 businesses trashed, and ninety-one Jews murdered. The Gestapo arrested 30,000 Jewish men and sent them to concentration camps, while imposing a punitive one-billion-mark fine on the Jewish community to pay for the destruction.</p>',

  // L4 B2
  '3_1': '<p class="prose-p"><span class="para-ref">[4.2]</span> Following directly behind front-line Wehrmacht combat divisions in June 1941 were four mobile paramilitary death squads known as the SS Einsatzgruppen (A, B, C, and D). These execution units were reinforced by militarized Order Police battalions to round up and execute Soviet Jews.</p><p class="prose-p">By August 1941, German orders escalated to total annihilation, shooting entire communities of women and children beside pre-dug ravines. This horrific phase, known as the \'Holocaust by Bullets\', murdered over 1.5 million Jewish civilians in face-to-face mass executions across Soviet territories.</p>',

  // L4 B3
  '3_2': '<p class="prose-p"><span class="para-ref">[4.3]</span> The most notorious massacre of the Holocaust by Bullets occurred outside Kyiv in Ukraine. On 29 September 1941, Sonderkommando 4a & Order Police battalions marched tens of thousands of Jewish residents to a vast ravine, ordering them to surrender valuables and undress.</p><p class="prose-p">Victims were forced into the gorge and shot in layers atop one another. In this horrific Babyn Yar ravine massacre, exactly 33,771 shot in 36 hours were murdered, while German commanders sent meticulous administrative reports to Berlin documenting the mass execution.</p>',

  // L4 B4
  '3_3': '<p class="prose-p"><span class="para-ref">[4.4]</span> Mass shootings swept across Lithuania, Latvia, Belarus, and Ukraine. Operating in the Baltic states, Einsatzgruppe A killing squads slaughtered nearly 250,000 Jewish victims within six months of the invasion, devastating centuries-old centers of Jewish learning.</p><p class="prose-p">In the Ponary Forest massacres outside Vilnius, over 70,000 Jewish victims were systematically executed in wooded pits. The German death squads relied heavily on local Baltic collaboration, using auxiliary police battalions from Lithuania and Latvia who volunteered to round up, guard, and shoot their Jewish neighbours.</p>',

  // L7 B4
  '6_3': '<p class="prose-p"><span class="para-ref">[7.4]</span> In November 1945, the Allied powers convened the International Military Tribunal (IMT) at Nuremberg to try senior Nazi leaders for war crimes. The court established that following superior orders was no legal defence, sentencing twelve defendants to death for crimes against humanity.</p><p class="prose-p">Simultaneously, Polish-Jewish legal scholar Raphael Lemkin, who lost forty-nine relatives in the Shoah, pioneered Raphael Lemkin\'s concept of genocide to define the deliberate destruction of a national group. Lemkin’s tireless campaign led directly to the 1948 United Nations Genocide Convention, establishing universal legal protections under international law.</p>',

  // L7 B5
  '6_4': '<p class="prose-p"><span class="para-ref">[7.5]</span> The Shoah extinguished six million human lives—two-thirds of European Jewry, including 1.5 million children. Beyond the staggering death toll, an entire millennium of Yiddish civilisation across Central and Eastern Europe was permanently destroyed.</p><p class="prose-p">As eyewitnesses pass away, preserving Shoah historical memory depends upon survivor oral testimony from voices like Elie Wiesel and Primo Levi. Upholding this imperative of remembrance requires every generation to confront antisemitism, defend human rights, and ensure the solemn pledge of "Never Again" endures across civilized society.</p>'
};

// Check all 35 blocks after applying updates
let totalWords = 0;
let blockCount = 0;
let fails = 0;

d.lessons.forEach((l, lIdx) => {
  l.narrative_blocks.forEach((b, bIdx) => {
    blockCount++;
    const key = `${lIdx}_${bIdx}`;
    const text = updates[key] || b.text;
    const words = text.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    totalWords += words;
    const isOk = (words >= 75 && words <= 115);
    if (!isOk) fails++;
    console.log(`L${lIdx+1} B${bIdx+1}: ${words}w -> ${isOk ? 'OK' : 'FAIL'}`);
  });
});

console.log(`\nAverage word count: ${(totalWords / blockCount).toFixed(1)}w`);
console.log(`Blocks failing 75-115w range: ${fails}`);

module.exports = { updates };

