const fs = require('fs');
const path = require('path');

const mrpModels = {
  "1_1": "By attacking the corrupt sale of each papal <strong>indulgence</strong> promising release from <strong>Purgatory</strong>, Martin Luther launched the Protestant <strong>Reformation</strong> in 1517.",
  "1_2": "Desperate to resolve his <strong>dynastic</strong> anxiety and secure the Tudor <strong>succession</strong> with a male heir, Henry VIII sought a papal <strong>annulment</strong> of his marriage to Catherine of Aragon.",
  "1_3": "When political pressure from <strong>Pope Clement VII & Emperor Charles V</strong> blocked the divorce, Henry VIII repudiated the <strong>papacy</strong> to establish absolute royal <strong>sovereignty</strong>.",
  "1_4": "Guided by chief minister <strong>Thomas Cromwell & Reformation Parliament</strong>, the Crown used <strong>statute</strong> law to enact the English <strong>Reformation</strong> and dissolve the monasteries.",
  "2_1": "Following the brutal Catholic <strong>persecution</strong> under <strong>Queen Mary I & Protestant Returnees</strong>, the public venerated each Protestant <strong>martyr</strong> burned at Smithfield.",
  "2_2": "Seeking a moderate religious <strong>compromise</strong> in 1559, Parliament established Elizabeth as <strong>Supreme Governor</strong> following delicate negotiations between <strong>Elizabeth I & House of Lords</strong>.",
  "2_3": "Enforcing the 1559 Act of <strong>Uniformity</strong> through a moderate <strong>Via Media</strong>, the Elizabethan Church imposed weekly fines on any Catholic <strong>recusant</strong> who refused to attend services.",
  "2_4": "In response to the 1569 Northern Rebellion, a provocative <strong>papal bull</strong> issued by <strong>Pope Pius V & Northern Earls</strong> declared the Queen's <strong>excommunication</strong> and urged her overthrow.",
  "2_5": "Utilising a sophisticated network of <strong>espionage</strong> to intercept each coded <strong>cipher</strong>, <strong>Sir Francis Walsingham & Mary Stuart</strong> clashed over the Babington Plot leading to Mary's execution.",
  "3_1": "Viewing the invasion of England as a holy Catholic <strong>crusade</strong>, the imperial rivalry between <strong>King Philip II & Queen Elizabeth I</strong> escalated as each English <strong>privateer</strong> looted Spanish treasure fleets.",
  "3_2": "Disrupting Spanish naval <strong>logistics</strong> in April 1587, <strong>Sir Francis Drake & English Raiders</strong> delayed the Armada by twelve months through daring raids that crippled Spanish supply <strong>Logistics</strong>.",
  "3_3": "Employing long-range <strong>culverin</strong> guns to unleash repeated <strong>broadside</strong> firepower, English tactics outmanoeuvred the galleons commanded by <strong>Duke of Medina Sidonia & Lord Howard</strong>.",
  "3_4": "Deploying eight blazing <strong>fireship</strong> vessels into the crowded Calais <strong>anchorage</strong>, the clash between <strong>English Sea Captains & Spanish Galleons</strong> scattered the Spanish defensive formation.",
  "3_5": "Interpreting the Armada's ruin as divine <strong>providence</strong>, English victories guided by <strong>Lord Howard, Drake & Atlantic Gales</strong> battered each retreating Spanish <strong>Galleon</strong> around Scotland and Ireland.",
  "4_1": "Governing under the theological doctrine of <strong>Divine Right</strong> during his eleven-year <strong>Personal Rule</strong>, Charles I provoked fierce resistance by illegally levying <strong>Ship Money</strong> across the nation.",
  "4_2": "Tensions boiled over into parliamentary <strong>impeachment</strong> proceedings when <strong>Charles I & The Five MPs</strong> clashed over royal tyranny and the unconstitutional collection of <strong>Ship Money</strong>.",
  "4_3": "Organized under the joint command of <strong>Oliver Cromwell & Sir Thomas Fairfax</strong>, the disciplined <strong>New Model Army</strong> achieved the decisive <strong>Parliamentary Victory at Naseby</strong> in 1645.",
  "4_4": "Charged with <strong>high treason</strong> against his people, the king was tried after <strong>Colonel Thomas Pride & High Court of Justice</strong> purged moderate MPs with the backing of the <strong>New Model Army</strong>.",
  "4_5": "Following the 1660 Stuart <strong>Restoration</strong>, the 1689 <strong>Bill of Rights</strong> established parliamentary sovereignty under <strong>William III, Mary II & Convention Parliament</strong>.",
  "5_1": "Asserting undivided national <strong>sovereignty</strong> through <strong>statute law</strong>, the political alliance between <strong>Henry VIII & The Reformation Parliament</strong> forged the modern English state.",
  "5_2": "Requiring strict religious <strong>conformity</strong> while avoiding windows into men's souls, negotiations between <strong>Elizabeth I & Elizabethan Parliaments</strong> established long-term <strong>Conformity</strong>.",
  "5_3": "Early Stuart attempts to exercise monarchical <strong>absolutism</strong> created deep constitutional fissures between <strong>James I, Charles I & Dissident MPs</strong> over royal <strong>Absolutism</strong>.",
  "5_4": "The revolutionary birth of the English <strong>Commonwealth</strong> established an irreversible legal <strong>precedent</strong> enforced by the <strong>New Model Army & The Rump Parliament</strong>.",
  "5_5": "Establishing a modern <strong>constitutional monarchy</strong> where the Crown lost its royal <strong>veto</strong> over parliamentary statutes, the 1689 settlement was sealed by <strong>William & Mary & The English Parliament</strong>."
};

const filePath = path.join(__dirname, '../data/monarchy_religion_power.json');
const pubFilePath = path.join(__dirname, '../public/data/monarchy_religion_power.json');
const dbPath = path.join(__dirname, '../database.json');
const pubDbPath = path.join(__dirname, '../public/database.json');

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let updated = 0;
data.lessons.forEach((l, li) => {
  (l.workbook_stages || l.stages || []).forEach((s, si) => {
    const key = `${li+1}_${si+1}`;
    if (mrpModels[key]) {
      s.model_sentence = mrpModels[key];
      updated++;
    }
  });
});

console.log(`Updated ${updated} model sentences in Monarchy, Religion & Power.`);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
if (fs.existsSync(pubFilePath)) {
  fs.writeFileSync(pubFilePath, JSON.stringify(data, null, 2), 'utf8');
}

[dbPath, pubDbPath].forEach(p => {
  if (fs.existsSync(p)) {
    const db = JSON.parse(fs.readFileSync(p, 'utf8'));
    db.monarchy_religion_power = data;
    fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated monarchy_religion_power in ${p}`);
  }
});

