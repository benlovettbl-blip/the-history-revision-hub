const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'units', 'industrialisation_and_empire', 'data.js');
const raw = fs.readFileSync(dataFilePath, 'utf8');

const jsonText = raw.replace(/^\s*export\s+default\s+/, '').replace(/;\s*$/, '');
const data = JSON.parse(jsonText);

const lessonBlocks = {
  lesson_1: [
    `<span class="para-ref">[1.1]</span> Before the mid-eighteenth century, British industry was held hostage by an acute energy crisis. For generations, ironmasters used timber to **smelt** iron ore in **blast furnaces**. However, centuries of deforestation of English oaks had exhausted England's ancient woodlands. When ironmasters turned to abundant pit coal, they struck a chemical disaster: British coal was choked with yellow sulphur, which contaminated the molten metal. The resulting brittle impure pig iron was as brittle as glass: strike a bar with a hammer, and it shattered into lethal shards. To build tough anchors and ship bolts for the Royal Navy, Britain suffered a dependence on Swedish imports, importing over 50,000 tons of premium **wrought iron** every year from Sweden and Russia across the vulnerable Baltic Sea.`,

    `<span class="para-ref">[1.2]</span> While iron production floundered, a revolutionary power source erupted. In cramped cottages under the **domestic system**, spinning and weaving were limited by muscle and waterwheels that froze in winter. In 1769, Scottish instrument maker **James Watt** patented his separate condenser efficiency breakthrough, vastly improving steam engines. Partnering with industrialist Matthew Boulton in Birmingham, Watt adapted his engine to produce continuous rotary shaft motion. By converting coal's thermal energy into mechanical power, Watt achieved liberation from river valleys, allowing massive textile mills, deep mine pumps, and heavy iron hammers to operate relentlessly anywhere coal was shipped.`,

    `<span class="para-ref">[1.3]</span> Yet steam engines required durable metal. In 1775, former naval agent **Henry Cort** leased an old corn mill at Funtley on the River Meon near Fareham, just fifteen miles from Portsmouth Dockyard. In 1783, Cort patented the reverberatory furnace chamber (reverberatory puddling furnace). Cort separated the coal firebox from the molten metal hearth with a brick bridge wall, eliminating harmful sulphur while deflecting clean 1,200°C radiant heat onto the iron. Skilled puddlers stirred the boiling metal through a porthole with long iron paddles during stirring molten decarburisation, burning off carbon until pure wrought iron thickened into glowing balls.`,

    `<span class="para-ref">[1.4]</span> Instead of having teams of exhausted blacksmiths slowly hammer hot iron blooms by hand, Cort patented mechanical grooved cylinders in 1784. Driven by the River Meon waterwheel, these grooved rollers accomplished squeezing out slag impurities and compressed the metal into uniform naval bar production at fifteen times traditional speed. The physical archaeology of this triumph remains etched in the Hampshire landscape today at Funtley Ironworks, where Cort's stone weir, waterwheel housing, and dry-stone walls made of glassy puddling slag survive.`,

    `<span class="para-ref">[1.5]</span> In March 1787, Cort invited the **Navy Board** to **Portsmouth Royal Dockyard** for decisive Admiralty smith forge tests. In front of skeptical Admiralty commissioners, master smiths bent Funtley iron double, twisted bars into cold corkscrews, and pounded shatter-resistant anchors with twenty-pound sledgehammers without cracking. The official minutes declared Funtley iron superior to any British metal and fully equal to Swedish Orgrounds iron. Domestic iron production surged 400%, granting Britain complete naval independence on the eve of the Napoleonic Wars and forging the anchors of <em>HMS Victory</em>.`
  ],

  lesson_2: [
    `<span class="para-ref">[2.1]</span> Before industrialisation, most British goods were crafted under the domestic system on domestic home handlooms in family cottages. Weavers paced their labour to seasonal daylight and rested on 'Saint Monday'. The invention of mechanized spinning mules and steam powerlooms obliterated this ancient autonomy. Capitalist mill owners built colossal multi-storey centralised steam factories housing hundreds of machines. Handloom weavers could not compete against the torrent of cheap cloth pouring from steam mills at relentless machine speed, forcing thousands of rural families to seek factory wage labour in booming hubs like Manchester and Leeds.`,

    `<span class="para-ref">[2.2]</span> Inside the mills, natural rhythms were replaced by the tyranny of the factory clock. Operatives worked rigid fourteen-hour shifts from 5:30 am to 8:00 pm, six days a week. Mill managers imposed harsh pence-deduction lateness fines for being just minutes late or opening a window. Workers laboured in suffocating temperatures up to 32°C amidst choking dust & locked doors, with cotton fibers coating their lungs and causing chronic bronchitis.`,

    `<span class="para-ref">[2.3]</span> Mill owners discovered that children made the cheapest workforce, engaging in workhouse apprentice trafficking from London parishes to northern mills. Small children aged six to ten worked as 'piecers' and 'scavengers', crawling under spinning mules while machinery operated at full speed to sweep loose cotton and tie broken threads. Exhausted children suffered crushed fingers & hair scalpings when loose clothes caught in exposed spinning gears.`,

    `<span class="para-ref">[2.4]</span> Outrage over conditions culminated in the 1832 Parliamentary Sadler Committee investigation. Witnesses testified that sixteen-hour daily fatigue caused children to collapse asleep into running machinery. Overlookers kept sleepy children awake with overlooker leather strap beatings. Decades of working twelve-hour days caused permanent spinal stunting, deformed knee joints, and stunted growth among factory populations.`,

    `<span class="para-ref">[2.5]</span> Shocked by Sadler's revelations, humanitarian reformers led by Lord Shaftesbury pressured Parliament to pass the landmark **Factory Act 1833**. The Act banned child labour under nine in textile mills and enforced eight-hour workday limits for children aged nine to thirteen, alongside two hours of compulsory schooling. Crucially, the Act created four full-time inspectors to enter mills unannounced, establishing the principle of statutory state intervention in private industry.`
  ],

  lesson_3: [
    `<span class="para-ref">[3.1]</span> Between 1801 and 1851, populations quadrupled in industrial hubs. Driven by unregulated speculative building, landlords constructed dense back-to-back courtyard housing with windowless shared party walls and zero drainage. Entire streets shared a single water standpipe that ran for only an hour a week. Thousands of impoverished working-class families lived in damp, flooded earthen cellars beneath street level, where raw sewage seeped through porous walls during heavy rain.`,

    `<span class="para-ref">[3.2]</span> Urban sanitation was non-existent. A single shared forty-family privy often served an entire street over overflowing cesspools that accumulated into towering nightsoil dunghills in courtyards. In Leeds and Manchester, private water companies drew supplies from downstream rivers contaminated by upstream sewers and seeping groundwater wells, creating lethal breeding grounds for waterborne epidemics.`,

    `<span class="para-ref">[3.3]</span> In 1831, Asiatic cholera landed in Britain. Spread through water contaminated with human feces, cholera inflicted waterborne bacterial agony on its victims. Patients suffered violent vomiting and diarrhea, leading to dehydration, thick blue blood, and a blue-skinned twelve-hour collapse into death. The epidemic killed across class lines, terrorising terrified wealthy elites into recognizing that slum squalor could kill rich landowners in wealthy suburbs.`,

    `<span class="para-ref">[3.4]</span> In 1842, reformer **Edwin Chadwick** published his *Report on the Sanitary Condition of the Labouring Population*. Chadwick used pioneering statistical lifespan comparison data to reveal a shocking nineteen-year Manchester average life expectancy for working-class labourers, compared to forty years in rural Rutland. Chadwick demonstrated the enormous economic cost of epidemics on poor law tax rates, proving that investing in clean water and covered sewers would save money and lives.`,

    `<span class="para-ref">[3.5]</span> The turning point arrived in the stifling heat of 1858 with the Great Stink. Unusually high temperatures caused midsummer Thames fermentation of 200,000 gallons of untreated raw sewage in the river. The stench became so suffocating that MPs soaked Commons chloride curtains in lime to absorb the smell. Terrified for their lives, Parliament voted a £3m grant allowing Joseph Bazalgette to build 82 miles of brick-lined Bazalgette interceptor tunnels, modernizing London's sanitation.`
  ],

  lesson_4: [
    `<span class="para-ref">[4.1]</span> In the manufacturing valleys of northern England, industrialisation threatened skilled textile artisans with extinction. Powerloom wage collapses from twenty-five shillings to five shillings a week drove handloom weavers to desperation. In 1811, organized underground groups called **Luddites**, invoking mythical leader 'General Ned Ludd', began sledgehammer midnight raids to smash shearing frames. In response, Parliament passed the capital Frame-Breaking Act 1812, making machine-breaking a hanging offense and deploying 12,000 soldiers to northern counties.`,

    `<span class="para-ref">[4.2]</span> With industrial sabotage suppressed, workers turned to political reform. On 16 August 1819, a peaceful crowd of 60,000 gathered at St Peter's Field in Manchester to demand parliamentary representation. Local magistrates panicked and ordered the Manchester Yeomanry sabre charge into the defenceless crowd, killing eighteen and injuring over 650 in the infamous **Peterloo Massacre**. The government suppressed protest with the repressive Tory Six Acts, outlawing unauthorized public meetings and taxing political publications.`,

    `<span class="para-ref">[4.3]</span> A decade after Peterloo, agrarian rebellion exploded across southern England under the name **Captain Swing**. Starvation winter destitution drove agricultural labourers to resist wage cuts and steam-powered threshing machines. Disguised farmhands carried out sledgehammer threshing destruction by night and nocturnal hayrick arson on landlords' estates, sending warning letters demanding living wages.`,

    `<span class="para-ref">[4.4]</span> The ruling elite reacted with vengeance. In December 1830, the Winchester Special Commission convened for the Winchester Great Hall trials of over 300 Hampshire agricultural workers. The court sentenced nineteen-year-old ploughboy Henry Cook to a Micheldever youth execution for knocking off a magistrate's hat, while 250 Hampshire men were sentenced to Australian penal transportation to Van Diemen's Land (Tasmania).`,

    `<span class="para-ref">[4.5]</span> Landowners and the state treated working-class solidarity as treason. In 1833, six Dorset farmworkers led by George Loveless formed a Friendly Society mutual aid group in Tolpuddle to resist wage cuts. Local magistrates used an obscure secret oaths law to sentence the **Tolpuddle Martyrs** to seven years' transportation. The injustice ignited national outrage: over 100,000 trade unionists staged massive London protest marches, successfully forcing the government to grant full royal pardons in 1836.`
  ],

  lesson_5: [
    `<span class="para-ref">[5.1]</span> In 1830, an under-five-percent electorate of wealthy landowners controlled British parliamentary politics. Parliamentary seats were frozen in a medieval pattern: depopulated Old Sarum & Newtown rotten boroughs with virtually no residents returned two MPs each, while unrepresented industrial cities like Manchester, Birmingham, and Leeds, home to over a million factory workers and merchants, had zero Members of Parliament.`,

    `<span class="para-ref">[5.2]</span> When the House of Lords rejected the 1831 Reform Bill, the Bristol Reform riots & fires destroyed the Bishop's Palace and Queen Square. In May 1832, radical Francis Place coordinated a financial protest with the slogan 'To stop the Duke, go for gold!', triggering a bank run gold panic that drained £1.6m from the Bank of England in days. Faced with revolution, the King agreed to create pro-reform peers, forcing Tory House of Lords surrender.`,

    `<span class="para-ref">[5.3]</span> The **1832 Great Reform Act** disenfranchised 56 rotten boroughs and created Manchester, Birmingham & Leeds MPs, expanding the electorate by 50% to roughly 800,000 men. However, the vote required a strict ten-pound property qualification, ensuring deliberate working-class exclusion. Mill workers and handloom weavers denounced the Act as the 'Great Betrayal', recognizing power had shifted from landowners to factory bosses.`,

    `<span class="para-ref">[5.4]</span> Outraged by exclusion, William Lovett drafted the People’s Charter of 1838, demanding the Six Points, including universal male suffrage & secret ballot and the abolition of property requirements for MPs. Chartists presented three mammoth rejected petitions to Parliament in 1839, 1842, and 1848 with millions of signatures, forging Britain's first mass working-class democratic movement.`,

    `<span class="para-ref">[5.5]</span> Under the old system, voting took place on open platforms with public declarations. The Secret Ballot Act 1872 completed the abolition of public hustings. At the 1872 Pontefract by-election, voters cast confidential ballots in private booths & liquorice wax seals, guaranteeing freedom from landlord eviction and bribery, establishing modern electoral democracy.`
  ]
};

// Update narrative blocks
for (const lesson of data.lessons) {
  if (lessonBlocks[lesson.id]) {
    const blocks = lessonBlocks[lesson.id];
    for (let i = 0; i < blocks.length; i++) {
      if (lesson.narrative_blocks && lesson.narrative_blocks[i]) {
        lesson.narrative_blocks[i].text = blocks[i];
      }
    }
  }
}

const outContent = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync(dataFilePath, outContent, 'utf8');
console.log('Successfully updated units/industrialisation_and_empire/data.js with complete trigger alignments!');
