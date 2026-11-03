const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'units', 'water_and_sanitation', 'data.js');
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

const l4Start = 4804;
const l4End = 4885;
const l5Start = 5488;
const l5End = 5566;

console.log(`Verifying L4: "${lines[l4Start]}" to "${lines[l4End-1]}"`);
console.log(`Verifying L5: "${lines[l5Start]}" to "${lines[l5End-1]}"`);

const newL4SourcesLines = `      sources: [
        {
          id: 'water_l4_src_a',
          letter: 'Source A',
          type: 'written',
          title: "Dr James Phillips Kay-Shuttleworth on Manchester Slum Courts & Cellar Dwellings (1832)",
          author: 'Dr James Phillips Kay-Shuttleworth (Physician to the Manchester Board of Health)',
          date: '1832',
          text: '"The houses of the working classes are built in narrow, unpaved courts, surrounded by heaps of refuse and stagnant filth. Cellar dwellings, dark, damp, and unventilated, are crowded with entire families sleeping on damp straw laid upon the bare earth. Single privies are shared by scores of households, overflowing continuously into the gutters. In such a poisoned atmosphere, contagious fevers find perpetual nourishment, and the human constitution is rapidly undermined before middle age."',
          source_context:
            'Published in Kay-Shuttleworth’s groundbreaking investigation, The Moral and Physical Condition of the Working Classes in Manchester (1832). Investigating Manchester cotton districts during the 1832 cholera outbreak, Kay-Shuttleworth was among the first physicians to demonstrate that unregulated boomtown construction and overflowing privies condemned industrial workers to chronic disease. **Hinge Question:** Why were speculative landlords permitted to construct unventilated back-to-backs and cellars without any legal sanitary regulations before 1848?',
          prompt:
            'What does Source A reveal about the living conditions and lack of sanitary infrastructure in rapidly growing industrial boomtowns?',
          model_answer:
            'Source A reveals that rapid urban growth created lethal overcrowding and squalor, where entire families lived in unventilated cellars on bare earth. With scores of people sharing a single overflowing privy, raw sewage contaminated living spaces and directly fostered epidemic disease.',
        },
        {
          id: 'water_l4_src_b',
          letter: 'Source B',
          type: 'visual',
          title: "'A Court for King Cholera' by John Leech (Punch Magazine, September 1852)",
          caption:
            'A Court for King Cholera (Punch, 1852). Satirical political cartoon showing personified pestilence, open cesspools, and poverty in an urban court.',
          image: '/images/court_for_king_cholera.png',
          source_context:
            'Published by British satirist John Leech in the reformist middle-class magazine Punch following London’s second cholera pandemic of 1848–49. The cartoon depicts an unpaved slum court dominated by a coffin merchant, a child playing on a dungheap, and raw sewage seeping from broken privies. **Hinge Question:** Did mid-Victorian cartoonists like Leech believe cholera was spread by bad smells (miasma) or by contaminated water?',
          prompt:
            "What is the cartoonist's main message in Source B regarding the relationship between urban squalor and the spread of epidemic disease?",
          model_answer:
            'The cartoonist is arguing that neglected slum courts filled with overflowing cesspools and raw sewage are direct breeding grounds for cholera. By personifying cholera as a king ruling over squalor, Punch criticized landlords and local councils for tolerating filthy conditions that invited preventable death.',
        },
        {
          id: 'water_l4_src_c',
          letter: 'Source C',
          type: 'visual',
          title:
            "Edwin Chadwick's 'Report on the Sanitary Condition of the Labouring Population' (1842)",
          caption:
            "Title page of Chadwick's pioneering 1842 Parliamentary Blue Book presenting the first nationwide statistical analysis of poverty and disease.",
          image: '/images/chadwick_sanitary_report_1842.jpg',
          source_context:
            'Written by barrister and Poor Law commissioner Edwin Chadwick in 1842 after surveying over 2,000 local doctors across England, Wales, and Scotland. Chadwick compiled death rates, wage levels, and drainage conditions to show that filth caused premature death and cost taxpayers millions in poor relief. **Hinge Question:** Why did Chadwick believe that spending public taxes on sewers would actually make Britain richer rather than poorer?',
          prompt:
            'How did Edwin Chadwick use evidence in Source C to challenge traditional Victorian beliefs about poverty and public health?',
          model_answer:
            'Chadwick used rigorous statistical data to prove that disease was not caused by moral weakness or laziness, but was the direct physical result of living alongside raw human waste and filthy water. By linking squalor directly to high death rates and rising poor relief costs, Chadwick proved that state-funded sanitation would actually save taxpayers money.',
        },
        {
          id: 'water_l4_src_d',
          letter: 'Source D',
          type: 'visual',
          title:
            "'Father Thames Introducing His Offspring to the Fair City of London' (Punch, July 1858)",
          caption:
            'Father Thames Introducing His Offspring (Punch, 1858). Satirical cartoon personifying the Thames delivering Diphtheria, Scrofula, and Cholera to London.',
          image: '/images/father_thames_punch_1858.jpg',
          source_context:
            'Published in Punch magazine at the peak of the Great Stink in July 1858. The cartoon personifies the River Thames as a decrepit, slime-covered old man presenting his deadly children—Diphtheria, Scrofula, and Cholera—to the female embodiment of the City of London. **Hinge Question:** Why did the stench of the Thames in 1858 succeed in forcing Parliament to act when thirty years of cholera deaths in the slums had failed?',
          prompt:
            'What can you infer from Source D about public attitudes toward the pollution of the River Thames in the summer of 1858?',
          model_answer:
            'Source D reveals deep public anger and disgust towards the toxic condition of the River Thames, portraying it as a lethal source of pestilence and preventable death. By depicting the river introducing diseases directly to London, Punch mocked the failure of government authorities to clean up the river until it threatened the entire metropolis.',
        },
        {
          id: 'water_l4_src_e',
          letter: 'Source E',
          type: 'visual',
          title:
            'Construction of the Low-Level Intercepting Sewer (The Illustrated London News, 1862)',
          caption:
            "Wood engraving showing navvies constructing Sir Joseph Bazalgette's egg-shaped brick sewer tunnels beneath London, 1862.",
          image: '/units/water_and_sanitation/assets/bazalgette_sewer.jpg',
          source_context:
            "Published in The Illustrated London News during the peak construction of Bazalgette's 82-mile sewer system. Navvies excavated deep trenches through London streets, laying egg-shaped brick tunnels that used natural gravity gradients to carry waste away from the Thames. **Hinge Question:** Why was the egg-shaped cross-section of Bazalgette's brick sewers essential for preventing blockages during dry summer spells?",
          prompt:
            'What does Source E demonstrate about the scale, engineering techniques, and materials used in Bazalgette’s sewer revolution?',
          model_answer:
            'Source E shows the immense industrial scale and precision of Victorian civil engineering, with teams of skilled bricklayers constructing massive egg-shaped tunnels using waterproof Portland cement. The curved profile allowed water to flow rapidly even at low volumes, preventing sludge buildup and ensuring self-cleansing drainage.',
        },
      ],`.split('\n');

const newL5SourcesLines = `      sources: [
        {
          id: 'water_l5_src_a',
          letter: 'Source A',
          type: 'visual',
          title: "Dr John Snow's 1854 Cholera Spot Map of Soho (Broad Street Area)",
          caption:
            "Detail of Dr John Snow's landmark 1854 cartographic spot map showing cholera deaths (bars) clustering tightly around the Broad Street water pump.",
          image: '/images/john_snow_cholera_map.jpg',
          source_context:
            'Drawn by Dr John Snow and lithographed by C.F. Cheffins for the second edition of Snow’s treatise On the Mode of Communication of Cholera (1855). Snow plotted 616 deaths across Soho, marking each address with stacked black lines indicating individual fatalities. **Hinge Question:** Why did Snow use a geographical spot map rather than a conventional statistical table to present his findings to the Board of Health?',
          prompt:
            'What can you infer from the distribution of black bars on Source A regarding the cause and source of the 1854 Soho cholera outbreak?',
          model_answer:
            'Source A clearly indicates that the Broad Street pump was the epicentre of the outbreak, as the thick clusters of black bars are densely concentrated directly on Broad Street and thin out rapidly as distance from that specific pump increases. This cartographic evidence demonstrates that residents using the Broad Street pump were exposed to a common, localized source of infection.',
        },
        {
          id: 'water_l5_src_b',
          letter: 'Source B',
          type: 'visual',
          title: "Dr John Snow's Published Case Study: The Lion Brewery Anomaly (1855)",
          caption:
            "Facsimile of page 42 from Dr John Snow's 1855 treatise detailing the total absence of cholera fatalities among workers at the Lion Brewery.",
          image: '/images/snow_treatise_page_42_brewery.jpg',
          source_context:
            'Published by Dr John Snow in On the Mode of Communication of Cholera (London: John Churchill, 1855). Snow documented how 70 workers in the Lion Brewery on Broad Street escaped cholera entirely because their employer supplied them with free beer, preventing them from drinking water from the contaminated pump. **Hinge Question:** How did the zero death rate at the Lion Brewery deal a fatal blow to the miasma theory of cholera transmission?',
          prompt:
            'How did Dr John Snow use the anomalous case of the Lion Brewery in Source B to test and confirm his waterborne hypothesis?',
          model_answer:
            'Snow used the brewery anomaly to disprove miasma theory by showing that people breathing the exact same foul Soho air survived completely unscathed if they did not swallow pump water. Because the 70 draymen and maltsters drank only fermented beer and possessed a private well on site, their total immunity provided positive proof that cholera was ingested through contaminated drinking water.',
        },
        {
          id: 'water_l5_src_c',
          letter: 'Source C',
          type: 'written',
          title: "Reverend Henry Whitehead's Vestry Report on the 40 Broad Street Cesspool (1855)",
          author: "Reverend Henry Whitehead (Curate of St Luke's, Soho)",
          date: '1855',
          text: '"I ascertained that an infant residing at No. 40 Broad Street had been attacked with diarrhoea on 28th August and died on 2nd September. The mother informed me that the soiled cloths and wash-water had been emptied into the cesspool in the cellar at the front of the house. Upon excavating the soil, the brickwork of the cesspool was discovered to be decayed and fractured, its liquid contents percolating directly through two feet eight inches of porous earth into the well of the Broad Street pump... This untoward circumstance solved the whole mystery of the outbreak, confirming Dr Snow’s conclusion beyond any doubt."',
          source_context:
            'Written by Reverend Henry Whitehead in the Report of the St James Vestry Cholera Inquiry Committee (1855). Whitehead originally believed in miasma and set out to disprove Dr John Snow’s water theory, but his thorough house-to-house pastoral interviews uncovered the index case and the physical breach between the cesspool and the well. **Hinge Question:** Why was Reverend Whitehead’s collaboration vital in convincing a sceptical medical establishment of Snow’s waterborne discovery?',
          prompt:
            'What does Source C prove about the physical mechanism that caused the Broad Street cholera outbreak in September 1854?',
          model_answer:
            'Source C proves that cholera entered the Broad Street drinking well through physical contamination from an adjacent domestic cesspool at No. 40 Broad Street. The washing of an infected infant’s soiled linen drained into decayed brickwork, allowing lethal fecal matter to seep directly into the pump water consumed by local residents.',
        },
        {
          id: 'water_l5_src_d',
          letter: 'Source D',
          type: 'visual',
          title: "Louis Pasteur's Swan-Neck Flask Microbiology Experiment (1861)",
          caption:
            "Diagram illustrating Louis Pasteur's famous swan-neck flask experiments disproving spontaneous generation and demonstrating airborne microbial contamination.",
          image: '/images/pasteur_swan_neck.jpg',
          source_context:
            "Published by French chemist Louis Pasteur in his 1861 treatise Mémoire sur les corpuscules organisés qui existent dans l'atmosphère. Pasteur demonstrated that nutrient broth remained sterile when curved flask necks trapped falling airborne dust particles, but fermented rapidly when the necks were broken. **Hinge Question:** Why did Robert Koch's 1884 identification of Vibrio cholerae depend fundamentally on Pasteur's earlier swan-neck flask discoveries?",
          prompt:
            'What does Source D demonstrate about how microscopic organisms cause fermentation and disease?',
          model_answer:
            'Source D demonstrates that living microbes enter liquids from external atmospheric dust rather than generating spontaneously from rotting matter. By showing that boiled broth remained sterile indefinitely inside unbroken curved flasks, Pasteur proved that specific biological micro-organisms—not bad smells—caused decomposition and disease.',
        },
        {
          id: 'water_l5_src_e',
          letter: 'Source E',
          type: 'written',
          title:
            'The Public Health Act 1875 (38 & 39 Vict. c. 55): Compulsory Municipal Sanitary Provision',
          author: 'Parliament of the United Kingdom (Prime Minister Benjamin Disraeli)',
          date: '11 August 1875',
          text: '"Every local authority shall within their district appertaining make provision for the proper cleansing of streets, the removal of house refuse, the regular paving and drainage of alleys, and the inspection of all slaughterhouses and common lodging-houses... Every local authority shall provide a supply of pure and wholesome water sufficient for the proper use of the inhabitants... and shall appoint a fit and proper person to be Medical Officer of Health, whose duty it shall be to inspect and report upon the sanitary condition of the district."',
          source_context:
            "Passed by Benjamin Disraeli's Conservative administration in 1875 to consolidate and replace over one hundred fragmented sanitary statutes. Unlike the 1848 Act, this statute was completely compulsory and legally binding on every town and rural district in England and Wales. **Hinge Question:** Why did it take until 1875 for the British Parliament to make sanitary provision legally compulsory rather than merely optional?",
          prompt:
            'What does Source E reveal about the fundamental shift in the British government’s approach to public health by 1875?',
          model_answer:
            'Source E reveals that the British state had completely abandoned its traditional laissez-faire policy of non-interference in favour of compulsory state intervention. By legally commanding every local authority to supply pure water, build drainage, and appoint a Medical Officer of Health, the 1875 Act established public health and sanitation as enforceable legal rights for all citizens.',
        },
      ],`.split('\n');

// Replace L5 first so line indices for L4 don't shift
lines.splice(l5Start, l5End - l5Start, ...newL5SourcesLines);
// Now replace L4
lines.splice(l4Start, l4End - l4Start, ...newL4SourcesLines);

const updatedContent = lines.join('\n');
fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log('Successfully updated units/water_and_sanitation/data.js');

const publicFilePath = path.join(__dirname, '..', 'public', 'units', 'water_and_sanitation', 'data.js');
fs.writeFileSync(publicFilePath, updatedContent, 'utf8');
console.log('Successfully updated public/units/water_and_sanitation/data.js');
