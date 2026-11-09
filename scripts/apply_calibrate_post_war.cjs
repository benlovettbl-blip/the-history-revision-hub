const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const updates = {
  // Lesson 1
  '0_0': '<p class="prose-p"><span class="para-ref">[1.1]</span> In 1897, seventeen regional suffrage groups united under Dame Millicent Garrett Fawcett to establish the National Union of Women\'s Suffrage Societies (NUWSS). Known as Suffragists, the democratic organisation rapidly grew to over 50,000 peaceful members across Great Britain.</p><p class="prose-p">Fawcett championed constitutional campaigning, arguing that law-abiding methods, mass petitions, and reasoned parliamentary lobbying were the only way to win voting rights. By demonstrating moral responsibility, the NUWSS persuaded politicians that women were mature citizens capable of exercising the democratic franchise.</p>',

  '0_1': '<p class="prose-p"><span class="para-ref">[1.2]</span> Frustrated by decades of parliamentary delay, Emmeline Pankhurst and her daughters founded the Women\'s Social and Political Union (WSPU) in Manchester in October 1903. Members adopted the radical motto \'Deeds, not words\' militancy, becoming universally known as the Suffragettes.</p><p class="prose-p">Unlike peaceful suffragists, the militant WSPU operated as a disciplined military hierarchy. Suffragettes embraced direct action to capture national headlines, chaining themselves to parliamentary railings, interrupting political rallies, and confronting police outside Buckingham Palace to force the government to grant female suffrage.</p>',

  '0_2': '<p class="prose-p"><span class="para-ref">[1.3]</span> Imprisoned in Holloway and other jails, Suffragettes initiated defiant hunger strike protests demanding to be treated as political prisoners. To prevent inmate deaths, the Liberal government introduced agonizing forced tube-feeding, shoving rubber hoses down prisoners\' throats and provoking widespread public outrage.</p><p class="prose-p">In response, Parliament passed the notorious 1913 \'Cat and Mouse Act\', allowing severely weakened hunger strikers to be released on license and re-arrested once recovered. Honoring their physical sacrifice, the WSPU awarded military-style silver Hunger Strike Medals to courageous survivors.</p>',

  '0_3': '<p class="prose-p"><span class="para-ref">[1.4]</span> As police violence escalated, the WSPU formed an elite thirty-woman security unit known as \'The Bodyguard\'. Directed by martial arts pioneer Edith Garrud, these athletic women were trained in jiu-jitsu self-defence to shield Emmeline Pankhurst from aggressive police batons.</p><p class="prose-p">Concealing wooden clubs beneath their Edwardian dresses, the bodyguards successfully fought off arresting officers during public speeches. Physical conflict peaked in June 1913 when Emily Wilding Davison stepped before King George V’s horse at the Epsom Derby, dying from catastrophic injuries.</p>',

  '0_4': '<p class="prose-p"><span class="para-ref">[1.5]</span> In August 1914, the outbreak of the First World War suspended militant campaigning. Over 1.5 million women entered factories, farms, and hospitals, performing vital wartime patriotic service as munitions Canary Girls handling toxic explosives to sustain the national war effort.</p><p class="prose-p">Their indispensable contribution broke down parliamentary opposition. In February 1918, Parliament passed the historic Representation of the People Act 1918, granting the parliamentary vote to 8.4 million women over thirty. Although retaining a temporary property qualification enfranchisement, the statute marked a decisive constitutional breakthrough.</p>',

  // Lesson 2 Block 1 & Block 5
  '1_0': '<p class="prose-p"><span class="para-ref">[2.1]</span> In September 1939, the massive Operation Pied Piper evacuation relocated 1.5 million city children and mothers to rural foster families. The arrival of impoverished urban children caused immense shock, exposing widespread rickets, lice, and malnutrition to affluent host families.</p><p class="prose-p">On the home front, the Blitz, rationing, and shared wartime trauma forged powerful cross-class social solidarity. Citizens queued together at shops and served side by side as ARP wardens, cementing a collective determination that post-war Britain must eliminate poverty and build a fairer society.</p>',

  '1_4': '<p class="prose-p"><span class="para-ref">[2.5]</span> The crowning achievement of post-war welfare was the National Health Service (NHS), founded on 5 July 1948 under Health Minister Aneurin Bevan. Bevan faced intense resistance from private doctors in the British Medical Association, who threatened a total boycott rather than becoming salaried state employees.</p><p class="prose-p">Bevan overcame opposition through his famous \'stuffed their mouths with gold\' compromise, allowing senior hospital consultants to treat lucrative private patients in NHS beds. When the NHS opened, it guaranteed free medical care for all at the point of delivery, transforming healthcare from a privileged luxury into a universal civil right.</p>',

  // Lesson 3 Block 3
  '2_2': '<p class="prose-p"><span class="para-ref">[3.3]</span> On 22 June 1948, the converted troopship HMT Empire Windrush docked at Tilbury Docks in Essex. Carrying 492 passengers from Jamaica, Trinidad, and Barbados, the ship brought eager Caribbean pioneer arrivals answering Britain’s urgent post-war labour shortage.</p><p class="prose-p">As British Pathé newsreel cameras filmed the historic arrival, Trinidadian calypso singer Aldwyn Roberts performed his legendary Lord Kitchener calypso recording, singing "London is the place for me" from the deck. These pioneering arrivals included RAF veterans, nurses, and artisans who laid the foundation of modern multicultural Britain.</p>'
};

function applyToUnit() {
  const jsonPath = path.join(ROOT, 'data', 'post_war_britain.json');
  const pubJsonPath = path.join(ROOT, 'public', 'data', 'post_war_britain.json');
  const jsPath = path.join(ROOT, 'units', 'post_war_britain', 'data.js');
  const pubJsPath = path.join(ROOT, 'public', 'units', 'post_war_britain', 'data.js');
  const dbPath = path.join(ROOT, 'database.json');
  const pubDbPath = path.join(ROOT, 'public', 'database.json');

  const rawJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  Object.entries(updates).forEach(([key, text]) => {
    const [lIdx, bIdx] = key.split('_').map(Number);
    if (rawJson.lessons[lIdx] && rawJson.lessons[lIdx].narrative_blocks[bIdx]) {
      rawJson.lessons[lIdx].narrative_blocks[bIdx].text = text;
      if (rawJson.lessons[lIdx].narrative_blocks[bIdx].content) {
        rawJson.lessons[lIdx].narrative_blocks[bIdx].content = text;
      }
      if (rawJson.lessons[lIdx].narrative_blocks[bIdx].body) {
        rawJson.lessons[lIdx].narrative_blocks[bIdx].body = text;
      }
    }
  });

  const formattedJson = JSON.stringify(rawJson, null, 2);
  fs.writeFileSync(jsonPath, formattedJson, 'utf8');
  fs.writeFileSync(pubJsonPath, formattedJson, 'utf8');

  // data.js files
  const jsContent = 'export default ' + formattedJson + ';\n';
  fs.writeFileSync(jsPath, jsContent, 'utf8');
  fs.writeFileSync(pubJsPath, jsContent, 'utf8');

  // database.json files
  [dbPath, pubDbPath].forEach(p => {
    if (fs.existsSync(p)) {
      const db = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (db.units && db.units['post_war_britain']) {
        db.units['post_war_britain'].lessons = rawJson.lessons;
      } else if (db['post_war_britain']) {
        db['post_war_britain'].lessons = rawJson.lessons;
      }
      fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
    }
  });

  console.log('Successfully calibrated post_war_britain across all 5 stores!');
}

applyToUnit();
