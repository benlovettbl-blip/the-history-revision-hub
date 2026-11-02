const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'units', 'weimar_nazi_germany', 'data.js');
let content = fs.readFileSync(dataFilePath, 'utf8');

const replacements = [
  {
    oldText: "doomed to sign an armistice the army refused to acknowledge.",
    newText: "doomed to sign an armistice the army refused to acknowledge. Were the democratic foundations of the new Weimar Constitution fatally flawed from the very moment of its creation?"
  },
  {
    oldText: "leaving millions carrying laundry baskets of worthless cash to buy a single loaf of bread.",
    newText: "leaving millions carrying laundry baskets of worthless cash to buy a single loaf of bread. How did the young republic manage to survive the combined onslaught of political assassinations, extremist putsches, and catastrophic hyperinflation?"
  },
  {
    oldText: "the republic was 'dancing on a volcano' of short-term foreign debt.",
    newText: "the republic was 'dancing on a volcano' of short-term foreign debt. Did Gustav Stresemann genuinely stabilize the Weimar Republic, or was Germany's economic recovery built on dangerous illusions?"
  },
  {
    oldText: "viewing modern Weimar culture as a decadent, unpatriotic cesspool.",
    newText: "viewing modern Weimar culture as a decadent, unpatriotic cesspool. To what extent did the social and cultural liberation of the 'Golden Twenties' deepen the political divisions tearing Germany apart?"
  },
  {
    oldText: "Hitler seized absolute dictatorial control of the party through the Führerprinzip.",
    newText: "Hitler seized absolute dictatorial control of the party through the Führerprinzip. How did Adolf Hitler transform an obscure fringe party into a disciplined, paramilitary instrument of radical nationalism?"
  },
  {
    oldText: "power would never be taken by bullets, but through the ballot box.",
    newText: "power would never be taken by bullets, but through the ballot box. Why did the Munich Putsch fail so catastrophically, and how did Hitler turn that humiliation into a legal pathway to power?"
  },
  {
    oldText: "suddenly transformed the Nazi fringe into an electoral juggernaut.",
    newText: "suddenly transformed the Nazi fringe into an electoral juggernaut. Why did the economic devastation of the Great Depression propel millions of desperate German voters toward the Nazi Party?"
  },
  {
    oldText: "a fatal miscalculation that opened the gates of the Chancellery to Adolf Hitler on 30 January 1933.",
    newText: "a fatal miscalculation that opened the gates of the Chancellery to Adolf Hitler on 30 January 1933. Why did conservative elites invite Hitler into the Chancellery, and why was their belief that they could control him so fatal?"
  },
  {
    oldText: "officers took a personal oath of unconditional loyalty not to the constitution, but to Adolf Hitler himself.",
    newText: "officers took a personal oath of unconditional loyalty not to the constitution, but to Adolf Hitler himself. How did Hitler dismantle German democracy in just eighteen months to establish absolute personal dictatorship?"
  },
  {
    oldText: "actively denounced their neighbours, colleagues, and spouses to prove their ideological conformity.",
    newText: "actively denounced their neighbours, colleagues, and spouses to prove their ideological conformity. How did the SS, Gestapo, and concentration camps engineer a climate of universal fear and total surveillance across German society?"
  },
  {
    oldText: "projected a deceptive image of order, vitality, and peace to a gullible international audience.",
    newText: "projected a deceptive image of order, vitality, and peace to a gullible international audience. How did Joseph Goebbels use censorship, mass media, and spectacles to control public opinion and engineer conformity?"
  },
  {
    oldText: "while middle-class Swing Youth danced to banned American swing music.",
    newText: "while middle-class Swing Youth danced to banned American swing music. Why was open opposition so rare, and how did dissenting churchmen, youth groups, and underground workers attempt to resist Nazi rule?"
  },
  {
    oldText: "desperately dragging female labour back into the munitions factories.",
    newText: "desperately dragging female labour back into the munitions factories. How did the Nazi ideal of domestic motherhood collide with the desperate economic demands of wartime rearmament?"
  },
  {
    oldText: "calculated the fuel consumption of bomber squadrons.",
    newText: "calculated the fuel consumption of bomber squadrons. How did the Nazi regime indoctrinate German youth through schools and youth movements, and how successful was their control?"
  },
  {
    oldText: "through the Strength Through Joy (KdF) movement.",
    newText: "through the Strength Through Joy (KdF) movement. Did Nazi economic policies genuinely improve the standard of living for German workers, or merely disguise coercion and militarisation?"
  },
  {
    oldText: "thirty thousand Jewish men were dragged to concentration camps.",
    newText: "thirty thousand Jewish men were dragged to concentration camps. Why did the Nazi persecution of German Jews and minority groups escalate from legal exclusion to systematic, state-sponsored violence?"
  }
];

let totalReplacements = 0;
replacements.forEach((r, idx) => {
  // Count occurrences
  const count = (content.split(r.oldText).length - 1);
  if (count === 0) {
    console.error(`Target ${idx + 1} not found: "${r.oldText.substring(0, 30)}..."`);
  } else {
    // Replace all occurrences (both prologue and hook_text)
    content = content.replaceAll(r.oldText, r.newText);
    totalReplacements += count;
    console.log(`Target ${idx + 1}: replaced ${count} occurrence(s)`);
  }
});

if (totalReplacements >= 16) {
  fs.writeFileSync(dataFilePath, content, 'utf8');
  console.log(`✅ Successfully updated Weimar blurbs with ${totalReplacements} replacements!`);
} else {
  console.error(`❌ Only replaced ${totalReplacements} times. Aborting.`);
  process.exit(1);
}

