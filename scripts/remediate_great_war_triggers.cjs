const fs = require('fs');
const vm = require('vm');

const filePath = 'units/great_war/data.js';
const rawCode = fs.readFileSync(filePath, 'utf8');

const additionsPerLesson = {
  'lesson_1': {
    1: " Before 1871, Germany did not exist as a single nation; instead, the German lands were divided into 39 separate German states, which were unified under Prussian leadership backed by deadly Krupp steel guns.",
    2: " At the Battle of Sedan, the French Emperor was captured at Sedan, leading to the new German Empire being crowned at Versailles in the Hall of Mirrors as Prussia dominates Europe.",
    3: " Under the 1871 Treaty of Frankfurt, the French were forced to pay 5 billion francs, losing coal and iron land in Alsace-Lorraine, cementing deep hatred between France and Germany.",
    4: " In French schools, pupils saw classroom maps veiled in black crepe, dreaming of French revenge (revanche) while the state enforced army conscription for boys.",
    5: " Chancellor Otto von Bismarck negotiated a secret deal with Russia to avoid the nightmare fear of war on two fronts, with the overarching aim of keeping France isolated."
  },
  'lesson_2': {
    1: " European powers carved up the African continent in search of rubber, copper & mineral riches, setting ground rules made at the Berlin meeting of 1884–1885.",
    2: " In 1890, the impetuous young Kaiser sacks old Bismarck, pursuing Weltpolitik and demanding a place in the sun to match Britain by building a German empire.",
    3: " In 1905, the Kaiser rides a white horse into Tangier, testing Britain and France by promising to protect Morocco as an independent sultanate.",
    4: " At the 1906 Algeciras Conference, Germany was defeated in the vote as Britain backs up France, leaving Berlin isolated and fearing being surrounded by rivals.",
    5: " In the 1911 Agadir Crisis, the German gunboat Panther was sent to bully France; Chancellor David Lloyd George issues a warning in his Mansion House speech, prompting Britain and France to plan for war together."
  },
  'lesson_3': {
    1: " As an island nation, Britain was surrounded by sea, with essential food brought by ships from across the globe; to survive, the Two-Power Standard required a fleet twice as big as rivals combined.",
    2: " Under Admiral von Tirpitz, Germany plans the High Seas Fleet, building warships in the North Sea and directly threatening British waters.",
    3: " In 1906, Britain launched HMS Dreadnought with ten huge 12-inch guns and fast steam turbine engines, rendering all older pre-dreadnought battleships now useless overnight.",
    4: " Fearing secret German docks and naval expansion, newspaper headlines cause panic, sparking the public cry: 'We want eight and we won't wait!', leading to Britain building eight battleships in 1909.",
    5: " When diplomatic talks in Berlin fail because Germany refuses to stop building dreadnoughts, Royal Navy ships guard the North Sea from Scapa Flow, ready for battle."
  },
  'lesson_4': {
    1: " Under the Dual Alliance of 1879, Germany backs Austria-Hungary, and in 1882 Italy joins the Triple Alliance with a mutual promise of help against Russia.",
    2: " To counter Berlin, French money helps Russia build strategic railways, while in 1904 Britain and France shake hands on the Entente Cordiale.",
    3: " In south-eastern Europe, the decaying Ottoman Empire was falling apart, while Slavic peoples want freedom, creating a dangerous powder keg where Austria clashes with Russia.",
    4: " In the 1908 Bosnian Crisis, Austria grabs Bosnia, causing humiliation in St Petersburg and intense Serbian fury at the land grab.",
    5: " During the Balkan Wars of 1912–1913, Serbia wins two wars, emerging with double the land and army, while leaders in Austria plan to crush Serbia before it grew even stronger."
  },
  'lesson_5': {
    1: " On 28 June 1914, Archduke Franz Ferdinand rode in an open-top car in Sarajevo; after a wrong turn at the sandwich shop, assassin Gavrilo Princip fires two shots, killing the Archduke and his wife Sophie.",
    2: " In early July, Kaiser Wilhelm II promises total support to Vienna, with a formal 'blank cheque' given to Austria to take action against Serbia.",
    3: " After Serbia rejected the harsh Austro-Hungarian ultimatum, Austrian gunboats began shelling Serbia from the river Danube into Belgrade on 28 July.",
    4: " The crisis escalated as mobilization orders saw thousands of soldiers boarding trains, while the clock ticking for generals forced rigid railroad timetables into motion.",
    5: " When German troops march into Belgium, Chancellor Bethmann-Hollweg dismissed the 1839 Treaty of London as a 'scrap of paper' broken by war; as the ultimatum expired, Britain enters the war at midnight on 4 August."
  }
};

const code = rawCode.replace(/^\s*export\s+default\s+/m, 'global.data = ');
const ctx = { global: {} };
vm.createContext(ctx);
vm.runInContext(code, ctx);
const data = ctx.global.data;

let totalUpdated = 0;

data.lessons.forEach(lesson => {
  const adds = additionsPerLesson[lesson.id];
  if (!adds) return;
  
  lesson.narrative_blocks.forEach((block, bIdx) => {
    const stageNum = bIdx + 1;
    const addText = adds[stageNum];
    if (addText && !block.text.includes(addText.trim().slice(0, 30))) {
      block.text = block.text.trim() + " " + addText.trim();
      totalUpdated++;
    }
  });
});

console.log(`Updated ${totalUpdated} narrative blocks in units/great_war/data.js.`);
const newFileContent = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync(filePath, newFileContent, 'utf8');
console.log('Saved units/great_war/data.js successfully.');

