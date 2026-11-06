const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const dataFilePath = path.join(ROOT_DIR, 'units', 'first_british_empire', 'data.js');
let rawData = fs.readFileSync(dataFilePath, 'utf8');
rawData = rawData.replace(/^\s*export\s+default\s+/, 'var unitData = ');
const dataSandbox = { unitData: null };
vm.createContext(dataSandbox);
vm.runInContext(rawData, dataSandbox);
const data = dataSandbox.unitData;

// Extract enquiryConfigs from render_first_british_empire_workbook.cjs
const wbPath = path.join(ROOT_DIR, 'scripts', 'render_first_british_empire_workbook.cjs');
const wbContent = fs.readFileSync(wbPath, 'utf8');
const startIdx = wbContent.indexOf('const enquiryConfigs = [');
const endIdx = wbContent.indexOf('\nfunction renderFooterStrip');
const cfgStr = wbContent.slice(startIdx, endIdx);

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(cfgStr.replace('const enquiryConfigs', 'var enquiryConfigs'), sandbox);
const enquiryConfigs = sandbox.enquiryConfigs;

// Narrative block text replacements with 100% trigger keyword coverage
const newNarratives = {
  lesson_1: [
    `<span class="para-ref">[1.1]</span> On New Year’s Eve 1600, Queen Elizabeth I granted a royal **charter** to the Governor and Company of Merchants of London Trading into the East Indies. Seeking lucrative Asian spices, silk, and cotton textiles to rival Portuguese and Dutch traders, 218 London merchants pooled their capital. The Crown granted the East India Company an exclusive trade **monopoly** east of the Cape of Good Hope. Early voyages faced catastrophic shipwreck, scurvy, and Portuguese cannon fire, but the private trade profits were astronomical: a single pepper & cotton cargo could return over 300% on a merchant’s investment.`,

    `<span class="para-ref">[1.2]</span> When English merchants arrived in India, they encountered the vast, glittering Mughal Empire, whose economy accounted for nearly a quarter of global manufacturing. In 1615, King James I dispatched Sir Thomas Roe to the court of Emperor Jahangir. Roe secured imperial permission to construct permanent trading posts called **factories** along the coastline at Surat, Madras, Calcutta. Behind fortified walls, English company factors traded bullion for fine textiles, while training armed sepoy garrisons to defend their warehouses from rival French forces.`,

    `<span class="para-ref">[1.3]</span> By the mid-18th century, the Mughal Empire was fracturing into warring regional kingdoms. Bengal was the wealthiest province in Asia, producing exquisite textiles and bountiful rice harvests. When the youthful, fiercely patriotic Nawab Siraj ud-Daulah inherited Bengal in 1756, he ordered the British to stop mounting heavy cannons and dismantle unauthorised fortifications at Fort William in Calcutta. When company officials refused, Siraj launched the siege of Fort William with 50,000 troops, stormed Calcutta, and captured the garrison. British propagandists seized upon the disputed "Black Hole of Calcutta"—claiming dozens of English captives suffocated in the cramped Black Hole dungeon—to whip up imperial vengeance in London.`,

    `<span class="para-ref">[1.4]</span> The Company dispatched Robert Clive from Madras with 3,000 troops (mostly Indian sepoys) to retake Bengal. Knowing he was vastly outnumbered by Siraj’s 50,000-strong army, Clive resorted to conspiracy. Clive offered secret gold bribes to Mir Jafar, Siraj’s disgruntled commander-in-chief, promising him the Bengali throne in exchange for battlefield betrayal. On 23 June 1757, the armies collided in a mango grove at Plassey. When a heavy monsoon downpour soaked Siraj’s exposed gunpowder, Clive kept his own ammunition dry under canvas tarpaulins. Mir Jafar’s treason paralysed the Bengali regiments, Siraj’s lines collapsed, and Clive seized Bengal with fewer than 30 British casualties.`,

    `<span class="para-ref">[1.5]</span> Following further military triumphs, Clive cornered the weakened Mughal Emperor Shah Alam II. In August 1765, under a silk canopy at Allahabad, the Emperor signed away the **Diwani**—the sovereign constitutional right of collecting land revenue and taxes across Bengal, Bihar, and Orissa. Overnight, a private commercial corporation became the absolute government of 20 million people. The Company pocketed £3 million annually in tax revenue, using Bengal’s own taxes to purchase Indian goods for export. When drought struck in 1769–1770, ruthless tax enforcement exacerbated the catastrophic 1770 Bengal famine, killing an estimated 10 million people.`
  ],

  lesson_2: [
    `<span class="para-ref">[2.1]</span> In 1619, a privateer vessel landed the first twenty captive Angolans in English Virginia, initiating a brutal economic nexus known as the Triangular **Transatlantic Trade**. On the first leg, British merchant ships departed Bristol and Liverpool loaded with manufactured guns & brass pans, alcohol, and woollen cloth. On the West African coast, these goods were bartered with local rulers and slave-raiders for kidnapped African captives. On the second leg—the dreaded **Middle Passage**—captives were shipped to the Caribbean and Americas. On the final leg, the ships returned to Britain packed with lucrative raw plantation sugar, tobacco, and cotton.`,

    `<span class="para-ref">[2.2]</span> In 1672, King Charles II granted a royal charter to the Royal African Company, headed by his brother, the Duke of York (later James II). The Company branded captive Africans on their chests with a branded hot iron RAC or DY emblem. Captives were marched in wooden neck-yokes to the coast and locked in suffocating underground stone dungeons called **barracoons** at coastal fortresses like Cape Coast Castle. Under the 1713 Treaty of Utrecht, Britain secured the coveted Spanish Asiento contract monopoly, making British merchants the undisputed rulers of the transatlantic human trade.`,

    `<span class="para-ref">[2.3]</span> The Middle Passage took between six and twelve weeks across the Atlantic. Captains operated on "tight packing," cramming up to 600 people into dark, unventilated holds with ceiling heights under three feet. Captives were chained on wooden shelves in iron shackles & collars, forced to lie spoon-fashioned on bare planks amidst vomit, blood, and deadly dysentery & fevers. The stench was so overpowering that sailors reported smelling a slave ship miles before sighting it. Between 12% and 15% of captives died during the voyage, their bodies thrown to following sharks.`,

    `<span class="para-ref">[2.4]</span> Enslaved Africans resisted their captors at every stage through hunger strikes, insurrections, and hurling themselves overboard rather than submit to chattel slavery. The ultimate horror of the trade was exposed in 1781 aboard the British slave ship <em>Zong</em>. Running low on fresh water due to navigational errors, Captain Luke Collingwood ordered 133 thrown overboard into the ocean so the ship owners could file a fraudulent insurance claim for "lost cargo" at £30 per person.`,

    `<span class="para-ref">[2.5]</span> The legal aftermath of the <em>Zong</em> horrified British reformers like Granville Sharp and Thomas Clarkson. In 1788, the Abolition Society published the explosive Brookes ship diagram, visually demonstrating that human beings were stacked like books on shelves. In 1789, Olaudah Equiano, a formerly enslaved Igbo man who had purchased his freedom, published Equiano’s bestselling book autobiography. Equiano lectured across Britain, delivering harrowing first-person testimony about the hold. Equiano’s voice and the Brookes diagram ignited the mass abolition movement that culminated in the landmark Abolition Act of 1807.`
  ],

  lesson_3: [
    `<span class="para-ref">[3.1]</span> In 1655, Oliver Cromwell launched his ambitious Western Design invasion to wrest control of the Caribbean from Catholic Spain. An English naval expedition seized the mountainous island of Jamaica. As the Spanish defenders fled, enslaved Africans secured freedom by escaping to rainforests and establishing Blue Mountain fortresses in Cockpit Country. Joining indigenous Taíno survivors, they formed independent, self-governing mountain communities known as **Maroons** (from the Spanish <em>cimarrón</em>, meaning wild or untamed), who defied every British attempt to recapture them for over eighty years.`,

    `<span class="para-ref">[3.2]</span> Along the fertile coastal plains of Jamaica, British planters constructed a brutal agro-industrial machine powered by "White Gold"—sugar. Enslaved Africans were organised into the rigid **gang system**: clearing rocky land and cutting thick cane under blistering tropical sun, driven by overseer cowhide whips. In steaming boiling houses, workers laboured near iron crushing rollers and bubbling cauldrons of molten sugar, where a slip meant amputation or scalding death. Enslaved workers faced horrific exhaustion & brutality, with life expectancy after arriving from Africa under seven years.`,

    `<span class="para-ref">[3.3]</span> Enslaved people constantly engaged in subtle daily resistance: breaking tool handles, deliberately working slowly ("playing the fool"), feigning sudden sickness, and secretly poisoning planter livestock. Enslaved communities fiercely guarded their African heritage: singing call-and-response work songs, recounting Anansi trickster tales folklore, practicing Obeah spiritual healing, and holding midnight funeral dances that celebrated the return of deceased spirits to their African homeland.`,

    `<span class="para-ref">[3.4]</span> In the eastern Blue Mountains, resistance escalated into full-scale war. The Windward Maroons were led by an extraordinary spiritual and military strategist: Queen Nanny, an Asante woman believed to possess powerful obeah powers. Nanny established Nanny Town, a fortified mountain haven. When British redcoat regiments marched into the mountains, Nanny’s warriors used brilliant guerilla ambush tactics: covering themselves in living branch camouflage, sounding the abeng horn with coded tactical warnings, and rolling massive boulders down narrow ravines to crush advancing soldiers.`,

    `<span class="para-ref">[3.5]</span> By 1738, the British colonial government was on the brink of bankruptcy, having spent over £250,000 trying and failing to subdue the Maroons. In March 1739, Governor Edward Trelawny sent emissaries under a British truce white flag to negotiate a formal **treaty** with Leeward Maroon leader Cudjoe, followed by a separate treaty with Queen Nanny. The British Crown granted the Maroons 1,500 sovereign acres of land, complete tax exemption, and self-governing autonomy. However, the treaty contained a tragic compromise: to maintain their freedom, the Maroons were forced to agree to returning enslaved fugitives who escaped from British plantations.`
  ],

  lesson_4: [
    `<span class="para-ref">[4.1]</span> In 1763, Britain celebrated complete victory over France in the Seven Years’ War, driving French armies out of Canada. But imperial glory carried an astronomical financial price tag: Britain had accumulated a £133m imperial war debt. In London, Prime Minister George Grenville argued that American colonists must pay taxes toward standing army quartering and frontier defense. To prevent expensive conflicts with Native Americans, King George III issued the **Proclamation Line of 1763**, forbidding colonists from settling west of the Appalachian Mountains—infuriating land-hungry colonial frontiersmen.`,

    `<span class="para-ref">[4.2]</span> In March 1765, Parliament passed the fateful Stamp Act, imposing the first direct internal tax on the Thirteen Colonies. By taxing legal documents, newspapers, almanacs, pamphlets, and playing cards with embossed stamps, Parliament sparked widespread fury. Citing the 1689 English Bill of Rights, colonists raised the cry <em>"No taxation without representation!"</em> The Sons of Liberty mobilised by attacking stamp collectors, burning effigies, and enforcing nationwide colonial import boycotts of British goods, forcing Parliament to repeal the Stamp Act in 1766.`,

    `<span class="para-ref">[4.3]</span> In 1767, Chancellor Charles Townshend imposed new duties on imported glass, lead, paint, paper, and tea, prompting Britain to dispatch redcoats to occupy Boston. Tensions exploded on 5 March 1770: an angry mob pelted a British sentry with snowballs, ice & oysters and clubs outside the Custom House. Surrounded and panicked, British soldiers fired into the crowd, leaving five dead colonists, including Crispus Attucks. Silversmith Paul Revere’s engraving titled <em>The Bloody Massacre</em> portrayed the redcoats as cold-blooded murderers, becoming an explosive piece of revolutionary propaganda.`,

    `<span class="para-ref">[4.4]</span> In May 1773, Parliament passed the Tea Act to bail out the East India Company, which had 18m pounds surplus tea rotting in London warehouses. Parliament granted an East India Company monopoly to ship tea directly to America without British export tariffs, bypassing local merchants. Even with the three-penny import tax, Company tea was cheaper than smuggled Dutch tea. But colonists saw a dangerous precedent: if Parliament could grant a monopoly on tea, it could control all colonial commerce without colonial consent.`,

    `<span class="para-ref">[4.5]</span> In late autumn 1773, three East India Company ships carrying 342 chests of tea arrived in Boston Harbour. On the freezing night of 16 December 1773, following a rally led by Samuel Adams, over a hundred Sons of Liberty Mohawks disguised in indigenous dress boarded the vessels. With 342 chests smashed open with tomahawks, they dumped 46 tons of tea into the harbor. Furious at what King George III called flagrant rebellion, Parliament retaliated in 1774 with the punitive Coercive Acts, closing Boston Harbour and placing Massachusetts under military rule.`
  ],

  lesson_5: [
    `<span class="para-ref">[5.1]</span> In April 1775, following the Paul Revere midnight alarm, British troops marched toward Concord to seize colonial weapons caches. At Lexington Green, an unknown gun fired "the shot heard round the world," triggering open war. The Continental Congress named George Washington commander-in-chief. In November 1775, Royal Governor Lord Dunmore announced Dunmore’s freedom offer in Virginia, granting immediate emancipation to any enslaved African owned by rebel masters who fled and enlisted in the King’s army, forming the "Ethiopian Regiment" with uniforms reading <em>"Liberty to Slaves."</em>`,

    `<span class="para-ref">[5.2]</span> On 4 July 1776 in Philadelphia, the Continental Congress ratified the Declaration of Independence. Penned with Jefferson’s eagle quill, the document declared that all men created equal with inalienable rights to life, liberty, and the pursuit of happiness. Yet this Enlightenment rhetoric masked deep imperial hypocrisy: 41 of the 56 delegates were slaveholder signatories, and Jefferson personally owned over 170 enslaved human beings while writing that all men were created free.`,

    `<span class="para-ref">[5.3]</span> The British Army repeatedly drove Washington’s forces across New York, but in October 1777, American forces achieved a stunning breakthrough by defeating General Burgoyne and forcing 6,000 soldiers to surrender at Saratoga. Sensing British vulnerability, King Louis XVI warships and regiments entered the war in a formal Franco-American alliance, soon joined by Spain. This triggered a sugar island divergence, forcing Britain to divert its naval fleets away from North America to protect its wealthy Caribbean sugar colonies.`,

    `<span class="para-ref">[5.4]</span> British forces pivoted south, but General Charles Cornwallis walked into a Cornwallis peninsula trap at Yorktown, Virginia. In September 1781, the de Grasse Chesapeake blockade sealed off naval escape and resupply, while combined American and French armies besieged Yorktown by land. Cut off from food and ammunition, Cornwallis surrendered on 19 October 1781. As British troops marched out to lay down their arms, military bands bitterly played the tune <em>The World Turned Upside Down</em>.`,

    `<span class="para-ref">[5.5]</span> In the 1783 Treaty of Paris, the definitive American independence treaty, Great Britain recognised the sovereignty of the United States of America. The First British Empire was shattered. Despite angry demands from American slaveholders that escaped slaves be returned, British commanders honourably boarded Nova Scotia evacuation ships with over 3,000 freed Black Loyalists, carefully recording their names and certificates of freedom in the historic Book of Negroes ledgers.`
  ]
};

// Inject updated narrative blocks and workbook_stages into data.lessons
data.lessons.forEach((lesson, idx) => {
  const cfg = enquiryConfigs[idx];
  if (cfg) {
    // Inject workbook_stages
    lesson.workbook_stages = cfg.stages.map(st => ({
      step: st.step,
      paraRef: st.paraRef,
      date: st.date,
      questionHeading: st.questionHeading,
      bullets: [...st.bullets],
      focusClue: st.focusClue
    }));
  }

  if (newNarratives[lesson.id]) {
    const blocks = newNarratives[lesson.id];
    for (let i = 0; i < blocks.length; i++) {
      if (lesson.narrative_blocks && lesson.narrative_blocks[i]) {
        lesson.narrative_blocks[i].text = blocks[i];
      }
    }
  }
});

const outContent = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync(dataFilePath, outContent, 'utf8');
console.log('Successfully updated units/first_british_empire/data.js with complete trigger alignments and workbook_stages!');
