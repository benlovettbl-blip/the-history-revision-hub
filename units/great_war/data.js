const great_war_data = {
  debatePrompts: [
    {
      title: 'Bismarck & Unification',
      prompt:
        "<strong>Debate:</strong> Was Otto von Bismarck a political genius who unified Germany through master diplomacy, or a ruthless warmonger who built an empire entirely on 'blood and iron'?",
    },
    {
      title: 'The Scramble for Africa',
      prompt:
        "<strong>Debate:</strong> 'The Scramble for Africa was purely about economic greed for raw materials, not national pride or status.' Do you agree? Use evidence from the Moroccan Crises.",
    },
    {
      title: 'The Alliance System',
      prompt:
        "<strong>Roleplay:</strong> You are Kaiser Wilhelm II in 1914. Justify giving Austria-Hungary the 'Blank Cheque' after the assassination of Franz Ferdinand. Why must Germany stand by its only reliable ally?",
    },
  ],
  specification_file: '/data/great_war_overview.json',
  title: 'KS3: Causes of the Great War',
  homepage_background: 'assets/somme_trench_1916.jpg',
  enquiry: 'How did decades of imperial rivalry and fear culminate in thirty days of madness?',
  cover_image: '/images/great_war_cover.jpg',
  cover_caption:
    "Primary Photograph: The Royal Navy battleship HMS Dreadnought at sea (c. 1906–1907), whose revolutionary steam-turbine propulsion and 'all-big-gun' armament rendered all existing battleships obsolete and triggered the Anglo-German naval arms race.",
  workbooks: [
    {
      id: 'full',
      name: 'full',
      title: 'Complete Unit',
    },
  ],
  lessons: [
    {
      id: 'lesson_1',
      causal_domino_spine: {
        title: 'German Unification & Alsace-Lorraine: Chronology Spine',
        subtitle: 'Key Turning Points & Causal Dominoes (M-A-I-N Framework)',
        stages: [
          {
            step: 1,
            para_ref: '[1.1]',
            date: '1862–1866',
            title: 'Prussian Rise & "Blood and Iron"',
            actor: 'Kingdom of Prussia',
            tag: '🚩 NATIONALISM',
            trigger:
              'Chief Minister Otto von Bismarck uses military expansion and short wars against Denmark and Austria to unite northern German states under Prussian dominance.',
            connective:
              'Shattered the traditional European balance of power, deeply alarming France who feared a powerful united neighbour on its eastern border.',
            question: 'What enabled Prussia to overturn the 1815 balance of power?',
          },
          {
            step: 2,
            para_ref: '[1.2]',
            date: 'September 1870',
            title: 'The Battle of Sedan & French Defeat',
            actor: 'Prussia & France',
            tag: '🎖️ MILITARISM',
            trigger:
              'Prussian armies encircle the French army at Sedan, capturing Emperor Napoleon III and 100,000 troops in a crushing French defeat.',
            connective:
              'Toppled the French imperial government, leaving Paris under siege and compelling southern German states to join the new Empire.',
            question: 'How was the German Empire proclaimed at Versailles in 1871?',
          },
          {
            step: 3,
            para_ref: '[1.3]',
            date: 'Jan–May 1871',
            title: 'Hall of Mirrors & Alsace-Lorraine Seized',
            actor: 'The German Empire',
            tag: '🚩 NATIONALISM',
            trigger:
              "Wilhelm I is proclaimed German Kaiser in Versailles' Hall of Mirrors; Germany annexes mineral-rich Alsace-Lorraine and imposes a 5 billion franc indemnity.",
            connective:
              'Inflicted deep national humiliation on France, creating permanent resentment and an unshakeable national obsession with revenge.',
            question: 'Why did the annexation of Alsace-Lorraine shatter peace?',
          },
          {
            step: 4,
            para_ref: '[1.4]',
            date: '1871–1889',
            title: 'The Cult of French "Revanche"',
            actor: 'The French Republic',
            tag: '🚩 NATIONALISM',
            trigger:
              'French schools, politics, and culture rally around "Revanche" (revenge)—a national determination to reclaim Alsace-Lorraine from Germany.',
            connective:
              'Convinced German leaders that France was a permanent enemy who would attack the moment an alliance was formed.',
            question: 'In what ways did French "Revanche" shape patriotic culture?',
          },
          {
            step: 5,
            para_ref: '[1.5]',
            date: '1873–1890',
            title: "Bismarck's Web & Two-Front Dread",
            actor: 'Chancellor Bismarck',
            tag: '🤝 ALLIANCES',
            trigger:
              'Bismarck constructs complex treaties (Dual Alliance, Reinsurance Treaty) to keep France isolated and avoid a two-front war with Russia.',
            connective:
              'Maintained fragile peace until Wilhelm II abandoned Russia in 1890, opening the door for rival European alliance blocs.',
            question: "Evaluate how Bismarck's diplomacy isolated the French Republic.",
          },
        ],
      },
      video: [
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=j1Yk0lzV40Q',
          title: 'The Franco Prussian War - History Matters (Short Animated Documentary)',
          duration: '3 mins 49 secs',
          pathway: 'Starter Hook',
          teacher_guidance:
            "Fast animated breakdown of Otto von Bismarck's diplomacy, the Ems Dispatch, the defeat of Napoleon III at Sedan in 1870, and the proclamation of the German Empire in Versailles. Recommended Watch Window: 00:00–03:30 • Lesson Phase: Quick Starter Check (0–3m). Tone Alert: Fast, accessible animated educational summary.",
          viewing_task:
            "<ol><li><strong>[01:10] Quick Check:</strong> In which palace's Hall of Mirrors did the German princes proclaim King Wilhelm I of Prussia as German Emperor (Kaiser) on 18 January 1871?</li><li><strong>[02:40] Hinge Question:</strong> Why did the German annexation of the French border provinces of Alsace and Lorraine guarantee permanent French hostility and revanchism leading up to 1914?</li></ol>",
          model_answer:
            '<ol><li><strong>Quick Check:</strong> The Palace of Versailles, near Paris.</li><li><strong>Hinge Question:</strong> Annexing Alsace-Lorraine was seen in France as a humiliating violation of French national sovereignty. Generations of French schoolchildren were taught to gaze eastward at the "lost provinces" draped in black mourning, creating an unshakeable French determination for revenge (<em>revanche</em>) and guaranteeing that France would ally with any power hostile to Germany.</li></ol>',
        },
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=-PAEmgYv0DE',
          title: 'German Unification and Empire - History in 5 Minutes',
          duration: '5 mins 21 secs',
          pathway: 'Enquiry Evidence',
          teacher_guidance:
            'Examines Otto von Bismarck\'s strategy of "Blood and Iron", the three wars of unification (Denmark 1864, Austria 1866, France 1870), and how unified Germany disrupted the European balance of power. Recommended Watch Window: 00:45–04:45 • Lesson Phase: Guided Instruction & Archival Investigation. Tone Alert: Structured historical overview exploring the European balance of power.',
          viewing_task:
            "<ol><li><strong>[01:30] Recall:</strong> What famous phrase did Chancellor Otto von Bismarck use in 1862 to declare that the great questions of the day would be resolved not by speeches and majority resolutions, but by military force?</li><li><strong>[03:15] Explain:</strong> Explain how Chancellor Bismarck's complex network of alliances (such as the 1879 Dual Alliance and 1887 Reinsurance Treaty) sought to keep France diplomatically isolated and prevent a two-front war.</li><li><strong>[04:20] Challenge:</strong> Evaluate how Kaiser Wilhelm II's dismissal of Bismarck in 1890 and abandonment of the Reinsurance Treaty allowed France to break out of isolation by signing the 1894 Franco-Russian Alliance.</li></ol>",
          model_answer:
            '<ol><li><strong>Recall:</strong> "Blood and Iron" (<em>Eisen und Blut</em>).</li><li><strong>Explain:</strong> Bismarck understood that Germany\'s central European geography made it vulnerable to encirclement. He prioritized maintaining friendly relations with Russia and Austria-Hungary while keeping France isolated without great power allies, ensuring France could never mount a war of revenge to recover Alsace-Lorraine.</li><li><strong>Challenge:</strong> Kaiser Wilhelm II foolishly allowed the secret Reinsurance Treaty with Tsarist Russia to lapse, believing dynamic British ties would compensate. Deprived of German diplomatic support and needing capital loans, autocratic Russia allied with republican France in 1894, creating Bismarck\'s ultimate nightmare: a hostile military coalition encircling Germany on both its western and eastern frontiers.</li></ol>',
        },
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=xVISzFmBiPU',
          title: 'How Prussia Ended The French Empire: Franco-Prussian War | Animated History',
          duration: '27 mins 56 secs',
          pathway: 'Strategic Analysis',
          teacher_guidance:
            'In-depth tactical and strategic analysis by The Armchair Historian: Prussian needle-guns, rail logistics, Krupp breech-loading artillery, and the Siege of Paris. Recommended Watch Window: 01:30–08:00 • Lesson Phase: High-Attainer Stretch & Military Analysis. Tone Alert: Deep military and technological history.',
          viewing_task:
            '<ol><li><strong>[03:00] Recall:</strong> At which decisive frontier fortress did Field Marshal Helmuth von Moltke encircle Emperor Napoleon III and 100,000 French soldiers in September 1870?</li><li><strong>[05:30] Explain:</strong> How did Prussian mastery of modern railway mobilization and Krupp steel rifled artillery revolutionize 19th-century European warfare?</li><li><strong>[07:15] Challenge:</strong> Analyze the siege of Paris (September 1870–January 1871) and the Paris Commune: how did civilian suffering and revolutionary uprising intensify Franco-German hatred?</li></ol>',
          model_answer:
            '<ol><li><strong>Recall:</strong> The Battle of Sedan.</li><li><strong>Explain:</strong> The Prussian General Staff used comprehensive railway timetables to mobilize hundreds of thousands of reservists to the frontier in days, far outstripping French preparations. Furthermore, Krupp steel breech-loading cannons had twice the range and rate of fire of French bronze muzzle-loaders, allowing Prussian batteries to destroy French positions from beyond retaliatory range.</li><li><strong>Challenge:</strong> Prussian bombardment and the starvation of Paris (where citizens were reduced to eating horses, dogs, and zoo animals) created deep psychological trauma. When the revolutionary Paris Commune was subsequently crushed with 20,000 French deaths, French society blamed Prussian militarism for tearing their nation apart, cementing generational enmity.</li></ol>',
        },
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=o_PKusG7NFs',
          title: '"The Great War" 1 | What Made Germany So Successful Before World War 1?',
          duration: '23 mins 7 secs',
          pathway: 'Documentary Depth',
          teacher_guidance:
            "Authoritative archival documentary exploring Germany's explosive economic expansion between 1871 and 1914: steel production overtaking Britain, chemical dominance, and population growth. Recommended Watch Window: 02:00–07:30 • Lesson Phase: Guided Instruction & Economic Deconstruction. Tone Alert: Scholarly archival documentary.",
          viewing_task:
            '<ol><li><strong>[03:15] Recall:</strong> By 1914, by how much had unified Germany\'s steel production overtaken that of Great Britain, the original "workshop of the world"?</li><li><strong>[05:10] Explain:</strong> Describe how Germany\'s world-leading electrical, chemical, and precision engineering sectors created a sense of national invincibility and technological superiority.</li><li><strong>[07:00] Challenge:</strong> Evaluate how rapid German industrialization created domestic political tension between the conservative Junker military aristocracy and the rising socialist working-class SPD electorate.</li></ol>',
          model_answer:
            "<ol><li><strong>Recall:</strong> Germany produced over 17 million tons of steel annually by 1914, more than double Great Britain's 7.6 million tons.</li><li><strong>Explain:</strong> German chemical conglomerates like Bayer, BASF, and Hoechst produced over 80% of the world's synthetic dyes, pharmaceuticals, and industrial fertilizers, while engineering giants like Siemens and AEG dominated global electrical infrastructure, fostering imperial confidence that German science and industry were destined to dominate Europe.</li><li><strong>Challenge:</strong> While heavy industry made Germany an economic superpower, political power remained concentrated in the autocratic Kaiser and aristocratic Prussian military elite. As the socialist SPD grew into the largest party in the Reichstag, conservative elites feared socialist revolution at home, viewing aggressive imperial foreign policy and military expansion as a way to rally patriotic national unity and neutralize working-class dissent.</li></ol>",
        },
      ],
      skill: 'Change & Continuity: Balance of Power & Revanche',
      title: 'Enquiry 1: German Unification, Franco-Prussian War & Bismarck (1871–1890)',
      subtitle: 'From Blood & Iron to the Hall of Mirrors and the Seizure of Alsace-Lorraine',
      enquiryQuestion:
        'How did the creation of the German Empire and the seizure of Alsace-Lorraine permanently rupture European peace?',
      a4_map: ['/images/german_empire_1871.png', '/images/modern_germany_map.png'],
      margin_spine: [
        {
          year: '1862–1866',
          label: 'Balance of Power',
        },
        {
          year: '1870–1871',
          label: 'Versailles Proclamation',
        },
        {
          year: 'May 1871',
          label: 'Alsace-Lorraine Annexed',
        },
        {
          year: '1871–1889',
          label: 'French Revanche',
        },
        {
          year: '1871–1890',
          label: 'Bismarckian Isolation',
        },
      ],
      teacher_notes: {
        primer:
          'This enquiry introduces students to the foundational geopolitical shockwave of modern European history: the creation of a unified, militaristic German Empire in 1871. Students examine how Otto von Bismarck used three calculated wars to unite 39 sovereign states under Prussian dominance, culminated in the coronation of Kaiser Wilhelm I inside the Hall of Mirrors at Versailles, and provoked permanent French hostility through the annexation of Alsace-Lorraine. The enquiry concludes by examining Bismarck’s intricate web of defensive alliances designed to isolate France and prevent Germany’s strategic nightmare: a two-front encirclement.',
        objectives: [
          {
            objective:
              "Understand how Otto von Bismarck used 'blood and iron' and the Franco-Prussian War to unify the German states.",
            primer:
              'Focus on paragraphs [1.1] and [1.2]. Emphasize that Bismarck rejected liberal parliamentary democracy in favor of military force, railway mobilization, and Krupp steel artillery.',
            question:
              "What did Bismarck mean by 'iron and blood', and why did crowning the Kaiser at Versailles deliberately humiliate France?",
          },
          {
            objective:
              "Analyze why the annexation of Alsace-Lorraine created permanent French 'Revanche' and shattered the European balance of power.",
            primer:
              "Direct students to paragraphs [1.3] and [1.4] alongside Bettannier’s painting 'La Tache Noire'. Show how losing border fortress cities and coalfields turned revenge into a civic religion.",
            question:
              'Why was the annexation of Alsace-Lorraine a far more dangerous penalty than the 5 billion gold franc indemnity?',
          },
          {
            objective:
              "Evaluate how Bismarck's post-1871 alliance system sought to prevent a two-front encirclement.",
            primer:
              'Focus on paragraph [1.5]. Explain Gordon Craig’s paradox: seizing Alsace-Lorraine gave Germany fortified borders but trapped it in permanent strategic paranoia.',
            question:
              'Why was maintaining friendship with Russia Bismarck’s supreme foreign policy rule after 1871?',
          },
        ],
        source_context:
          'Anton von Werner’s iconic oil painting depicts the proclamation of the German Empire on 18 January 1871 in the Hall of Mirrors at Versailles. Commissioned by the Prussian royal family for Bismarck’s 70th birthday, Werner places Bismarck in immaculate white at the visual centre of the composition, symbolizing that the Empire was forged not through democratic consensus, but through Prussian military dominance. **Hinge Question:** Why did Anton von Werner place Chancellor Otto von Bismarck in pure white at the visual centre of the painting, rather than Kaiser Wilhelm I on the raised dais?',
      },
      do_now: {
        title: 'Do Now: Foundations of European Power',
        type: 'mixed',
        items: [
          {
            question:
              'How many sovereign states formed the German Confederation before unification in 1871?',
            answer: '39 states',
          },
          {
            question: 'What was the Prussian-led customs union established in 1834 called?',
            answer: 'The Zollverein',
          },
          {
            question:
              'Which Prussian Minister-President famously declared that questions would be settled by "iron and blood"?',
            answer: 'Otto von Bismarck',
          },
          {
            question: 'In what year was the Franco-Prussian War fought?',
            answer: '1870–1871',
          },
          {
            question: 'What is meant by the diplomatic term "Balance of Power"?',
            answer:
              'An international system where power is distributed roughly equally among Great Powers, preventing any single state from dominating.',
          },
        ],
      },
      vocab: [
        {
          term: 'Realpolitik',
          definition:
            'Ruthless, practical statecraft based on national self-interest, industrial power, and military force rather than moral ideals.',
          syllables: 'Rea-lpo-litik',
          phonetic: 'realpolitik',
          tier: '3',
        },
        {
          term: 'Revanche',
          definition:
            'The deep-seated French national desire for vengeance against Germany and the recovery of Alsace-Lorraine following the 1871 defeat.',
          syllables: 'Re-va-nche',
          phonetic: 'revanche',
          tier: '2',
        },
        {
          term: 'Zollverein',
          definition:
            'The Prussian-led customs union formed in 1834 that created economic unity among German states while excluding Austria.',
          syllables: 'Zo-llve-rein',
          phonetic: 'zollverein',
          tier: '2',
        },
        {
          term: 'Alsace-Lorraine',
          definition:
            'Mineral-rich French border provinces containing major iron-ore deposits and textile industries annexed by Germany in 1871.',
          syllables: 'A-lsa-ce-Lo-rrai-ne',
          phonetic: 'alsace-lorraine',
          tier: '2',
        },
        {
          term: 'Reinsurance Treaty',
          definition:
            'A secret 1887 defensive agreement between Germany and Russia pledging benevolent neutrality if either faced war, preventing encirclement.',
          syllables: 'Rei-nsu-ra-nce Trea-ty',
          phonetic: 'reinsurance treaty',
          tier: '3',
        },
      ],
      narrative_blocks: [
        {
          act: 1,
          title: 'The Fragmented Chessboard, Zollverein & Prussian Power (1862–1866)',
          text: '<span class="para-ref">[1.1]</span> Before 1871, Central Europe was deeply divided. In 1815, the Congress of Vienna organized the region into **thirty-nine independent states (39 independent states)**. Two rival powers competed for control. Catholic Austria ruled a vast, multinational empire. In contrast, Protestant **Prussia** was a disciplined military powerhouse, rich in coal, railways, and Krupp steel.<br><br><span class="para-ref">[1.2]</span> In 1834, Prussia launched the **Zollverein** (Customs Union). This agreement removed internal taxes between German states while deliberately locking out Austria. German trade boomed on Prussian railways. In 1862, **Otto von Bismarck** became Prussian Minister-President. Bismarck bypassed parliament and declared his ruthless philosophy: <em>"The great questions of the day will not be decided by speeches and majority votes... but by iron and blood."</em> Practicing pure <em>Realpolitik</em>, Bismarck led Prussia to swift military victories over Denmark in 1864 and Austria in 1866.',
          image: '/images/otto_von_bismarck_portrait.jpg',
          image_alt:
            'Archival oil portrait of Prince Otto von Bismarck, architect of German unification',
          caption:
            'Prince Otto von Bismarck (1815–1898), Minister-President of Prussia and first Chancellor of the German Empire, whose diplomatic dexterity engineered German unification.',
          source: {
            letter: 'A',
            type: 'visual',
            title: 'Source A (Cartographic Record): The German Empire in Central Europe (1871)',
            image: '/images/german_empire_1871.png',
            src: '/images/german_empire_1871.png',
            caption:
              'Official administrative map showing the newly proclaimed German Empire in 1871, uniting 39 disparate German kingdoms, grand duchies, and free cities under Prussian Hohenzollern rule.',
            citation:
              'Prussian State Library, Map Department / The British Library, London (Maps 28.b.11).',
            context:
              'The unification of Germany in 1871 shattered the traditional balance of power established at the Congress of Vienna in 1815. In place of a fragmented buffer zone of weak German principalities, a single industrial and military titan emerged at the heart of Europe. **Hinge Question:** Why did the sudden creation of a unified, industrialized Germany in Central Europe inherently threaten the strategic security of both France and Russia?',
            hinge_question:
              'Why did the sudden creation of a unified, industrialized Germany in Central Europe inherently threaten the strategic security of both France and Russia?',
            question_badge: 'Source Inference',
            question:
              "What does this map reveal about the dramatic transformation of Central Europe's balance of power in 1871?",
            enquiry_question:
              "What does this map reveal about the dramatic transformation of Central Europe's balance of power in 1871?",
            model_answer:
              'The map demonstrates that German unification consolidated 39 separate states into a massive, contiguous empire in Central Europe, replacing a weak buffer zone with a dominant military power that directly bordered France and Russia.',
            discussion_ideas: [
              'Consolidation of Central Europe: Replaced vulnerable smaller states with a unified industrial giant.',
              'Strategic encirclement fears: Placed a potential military superpower between France and Russia.',
              'Disruption of Vienna Settlement: Overturned the 1815 balance of power that had kept major European wars contained for over fifty years.',
            ],
            source_context:
              'The unification of Germany in 1871 shattered the traditional balance of power established at the Congress of Vienna in 1815. In place of a fragmented buffer zone of weak German principalities, a single industrial and military titan emerged at the heart of Europe. **Hinge Question:** Why did the sudden creation of a unified, industrialized Germany in Central Europe inherently threaten the strategic security of both France and Russia?',
            teacher_notes: {
              source_context:
                'The unification of Germany in 1871 shattered the traditional balance of power established at the Congress of Vienna in 1815. In place of a fragmented buffer zone of weak German principalities, a single industrial and military titan emerged at the heart of Europe. **Hinge Question:** Why did the sudden creation of a unified, industrialized Germany in Central Europe inherently threaten the strategic security of both France and Russia?',
            },
            id: 'gw_l1_src_a',
          },
          sources: [
            {
              letter: 'A',
              type: 'visual',
              title: 'Source A (Cartographic Record): The German Empire in Central Europe (1871)',
              image: '/images/german_empire_1871.png',
              src: '/images/german_empire_1871.png',
              caption:
                'Official administrative map showing the newly proclaimed German Empire in 1871, uniting 39 disparate German kingdoms, grand duchies, and free cities under Prussian Hohenzollern rule.',
              citation:
                'Prussian State Library, Map Department / The British Library, London (Maps 28.b.11).',
              context:
                'The unification of Germany in 1871 shattered the traditional balance of power established at the Congress of Vienna in 1815. In place of a fragmented buffer zone of weak German principalities, a single industrial and military titan emerged at the heart of Europe. **Hinge Question:** Why did the sudden creation of a unified, industrialized Germany in Central Europe inherently threaten the strategic security of both France and Russia?',
              hinge_question:
                'Why did the sudden creation of a unified, industrialized Germany in Central Europe inherently threaten the strategic security of both France and Russia?',
              question_badge: 'Source Inference',
              question:
                "What does this map reveal about the dramatic transformation of Central Europe's balance of power in 1871?",
              enquiry_question:
                "What does this map reveal about the dramatic transformation of Central Europe's balance of power in 1871?",
              model_answer:
                'The map demonstrates that German unification consolidated 39 separate states into a massive, contiguous empire in Central Europe, replacing a weak buffer zone with a dominant military power that directly bordered France and Russia.',
              discussion_ideas: [
                'Consolidation of Central Europe: Replaced vulnerable smaller states with a unified industrial giant.',
                'Strategic encirclement fears: Placed a potential military superpower between France and Russia.',
                'Disruption of Vienna Settlement: Overturned the 1815 balance of power that had kept major European wars contained for over fifty years.',
              ],
              source_context:
                'The unification of Germany in 1871 shattered the traditional balance of power established at the Congress of Vienna in 1815. In place of a fragmented buffer zone of weak German principalities, a single industrial and military titan emerged at the heart of Europe. **Hinge Question:** Why did the sudden creation of a unified, industrialized Germany in Central Europe inherently threaten the strategic security of both France and Russia?',
              teacher_notes: {
                source_context:
                  'The unification of Germany in 1871 shattered the traditional balance of power established at the Congress of Vienna in 1815. In place of a fragmented buffer zone of weak German principalities, a single industrial and military titan emerged at the heart of Europe. **Hinge Question:** Why did the sudden creation of a unified, industrialized Germany in Central Europe inherently threaten the strategic security of both France and Russia?',
              },
              id: 'gw_l1_src_a',
            },
          ],
        },
        {
          act: 2,
          title: 'The Sedan Debacle & Proclamation at Versailles (1870–1871)',
          text: '<span class="para-ref">[1.2]</span> To unite the southern German states with Prussia, Bismarck needed a common enemy. In July 1870, he edited the famous **Ems Telegram** to make it look like King Wilhelm I had insulted the French ambassador. Furious, Emperor Napoleon III declared war. France was completely unprepared. Prussian railways and heavy Krupp artillery crushed French defenses. On 1 September 1870, German forces encircled the French army at the **Battle of Sedan**, capturing Napoleon III and 104,000 soldiers.<br><br><span class="para-ref">[1.3]</span> The French government refused to surrender, triggering the brutal **Siege of Paris**. Starving citizens survived by eating horses and zoo animals. On **18 January 1871**, Bismarck delivered the ultimate humiliation. Inside the famous **Hall of Mirrors at the Palace of Versailles**, German princes proclaimed King Wilhelm I the first German Emperor (Kaiser). The German Empire was forged through war.',
          source: {
            letter: 'B',
            type: 'visual',
            title:
              'Source B (Historical Painting): Anton von Werner, The Proclamation of the German Empire at Versailles (1871)',
            image: '/units/great_war/assets/werner_versailles_1871_highres.jpg',
            src: '/units/great_war/assets/werner_versailles_1871_highres.jpg',
            is_artwork: true,
            caption:
              "Anton von Werner's famous painting depicting Prussian King Wilhelm I being acclaimed German Emperor in the Hall of Mirrors at the Palace of Versailles, with Chancellor Bismarck standing centrally in white uniform.",
            citation:
              'Bismarck Museum, Friedrichsruh / Staatliche Museen zu Berlin (Inv. Werner-1885-Versailles).',
            context:
              'Following the catastrophic French defeat at Sedan, Bismarck orchestrated the coronation of Kaiser Wilhelm I inside the Hall of Mirrors at Versailles—the historic palace of French royalty and power. This deliberate humiliation of France on its own soil ignited an enduring desire for national revenge (revanche). **Hinge Question:** How did staging the German coronation inside the French Palace of Versailles transform a military defeat into an irreconcilable national feud?',
            hinge_question:
              'How did staging the German coronation inside the French Palace of Versailles transform a military defeat into an irreconcilable national feud?',
            question_badge: 'Author’s Purpose',
            question:
              'Why did Bismarck intentionally stage the imperial proclamation inside the Hall of Mirrors at Versailles?',
            enquiry_question:
              'Why did Bismarck intentionally stage the imperial proclamation inside the Hall of Mirrors at Versailles?',
            model_answer:
              'Bismarck staged the proclamation in the Hall of Mirrors to inflict maximum psychological and symbolic humiliation on defeated France, visibly demonstrating that German military supremacy had superseded historic French dominance in Europe.',
            discussion_ideas: [
              'Symbolic humiliation: Usurping the ancestral palace of Louis XIV to declare Prussian ascendancy.',
              'Psychological scarring: Cemented deep French resentment that persisted until 1914.',
              'Centrality of Bismarck: Visually placing Bismarck in brilliant white at the centre of the composition to highlight his political mastery.',
            ],
            source_context:
              'Following the catastrophic French defeat at Sedan, Bismarck orchestrated the coronation of Kaiser Wilhelm I inside the Hall of Mirrors at Versailles—the historic palace of French royalty and power. This deliberate humiliation of France on its own soil ignited an enduring desire for national revenge (revanche). **Hinge Question:** How did staging the German coronation inside the French Palace of Versailles transform a military defeat into an irreconcilable national feud?',
            teacher_notes: {
              source_context:
                'Following the catastrophic French defeat at Sedan, Bismarck orchestrated the coronation of Kaiser Wilhelm I inside the Hall of Mirrors at Versailles—the historic palace of French royalty and power. This deliberate humiliation of France on its own soil ignited an enduring desire for national revenge (revanche). **Hinge Question:** How did staging the German coronation inside the French Palace of Versailles transform a military defeat into an irreconcilable national feud?',
            },
            id: 'gw_l1_src_b',
          },
          sources: [
            {
              letter: 'B',
              type: 'visual',
              title:
                'Source B (Historical Painting): Anton von Werner, The Proclamation of the German Empire at Versailles (1871)',
              image: '/units/great_war/assets/werner_versailles_1871_highres.jpg',
              src: '/units/great_war/assets/werner_versailles_1871_highres.jpg',
              is_artwork: true,
              caption:
                "Anton von Werner's famous painting depicting Prussian King Wilhelm I being acclaimed German Emperor in the Hall of Mirrors at the Palace of Versailles, with Chancellor Bismarck standing centrally in white uniform.",
              citation:
                'Bismarck Museum, Friedrichsruh / Staatliche Museen zu Berlin (Inv. Werner-1885-Versailles).',
              context:
                'Following the catastrophic French defeat at Sedan, Bismarck orchestrated the coronation of Kaiser Wilhelm I inside the Hall of Mirrors at Versailles—the historic palace of French royalty and power. This deliberate humiliation of France on its own soil ignited an enduring desire for national revenge (revanche). **Hinge Question:** How did staging the German coronation inside the French Palace of Versailles transform a military defeat into an irreconcilable national feud?',
              hinge_question:
                'How did staging the German coronation inside the French Palace of Versailles transform a military defeat into an irreconcilable national feud?',
              question_badge: 'Author’s Purpose',
              question:
                'Why did Bismarck intentionally stage the imperial proclamation inside the Hall of Mirrors at Versailles?',
              enquiry_question:
                'Why did Bismarck intentionally stage the imperial proclamation inside the Hall of Mirrors at Versailles?',
              model_answer:
                'Bismarck staged the proclamation in the Hall of Mirrors to inflict maximum psychological and symbolic humiliation on defeated France, visibly demonstrating that German military supremacy had superseded historic French dominance in Europe.',
              discussion_ideas: [
                'Symbolic humiliation: Usurping the ancestral palace of Louis XIV to declare Prussian ascendancy.',
                'Psychological scarring: Cemented deep French resentment that persisted until 1914.',
                'Centrality of Bismarck: Visually placing Bismarck in brilliant white at the centre of the composition to highlight his political mastery.',
              ],
              source_context:
                'Following the catastrophic French defeat at Sedan, Bismarck orchestrated the coronation of Kaiser Wilhelm I inside the Hall of Mirrors at Versailles—the historic palace of French royalty and power. This deliberate humiliation of France on its own soil ignited an enduring desire for national revenge (revanche). **Hinge Question:** How did staging the German coronation inside the French Palace of Versailles transform a military defeat into an irreconcilable national feud?',
              teacher_notes: {
                source_context:
                  'Following the catastrophic French defeat at Sedan, Bismarck orchestrated the coronation of Kaiser Wilhelm I inside the Hall of Mirrors at Versailles—the historic palace of French royalty and power. This deliberate humiliation of France on its own soil ignited an enduring desire for national revenge (revanche). **Hinge Question:** How did staging the German coronation inside the French Palace of Versailles transform a military defeat into an irreconcilable national feud?',
              },
              id: 'gw_l1_src_b',
            },
          ],
        },
        {
          act: 3,
          title: 'The Treaty of Frankfurt & Annexation of Alsace-Lorraine (May 1871)',
          text: '<span class="para-ref">[1.3]</span> In May 1871, the two nations signed the **Treaty of Frankfurt**. German leaders designed the treaty to crush French military power. France had to pay a massive fine of **five billion gold francs (5 billion gold francs)**. German occupation troops remained on French soil until every centime was paid. Even worse was the territorial loss: Germany seized the border provinces of **Alsace** and **Lorraine**.<br><br><span class="para-ref">[1.4]</span> This annexation tore away 1.6 million French citizens and vital iron-ore basins. The ancient fortress city of Metz and the cathedral city of Strasbourg became fortified German strongholds. Overnight, forty-one million people and the Krupp arms foundries merged into a giant military empire. A united Germany now stood at the heart of Europe.',
          source: {
            letter: 'C',
            type: 'written',
            title:
              'Source C (State Treaty): The Treaty of Frankfurt, Articles I & VII (10 May 1871)',
            text: 'Article I: The French Republic cedes to His Majesty the Emperor of Germany all sovereign rights and titles over the territories situated east of the frontier specified hereafter: the provinces of Upper and Lower Alsace... and the eastern districts of Lorraine including the fortress city of Metz.<br><br>Article VII: The payment of the war indemnity of five thousand million francs (5,000,000,000 francs) shall take place within three years. German occupation troops shall evacuate French departments sequentially only as each instalment is paid in gold coin.',
            caption:
              'Official diplomatic text of the Treaty of Frankfurt (10 May 1871), imposing severe territorial annexations and financial penalties on the defeated French Third Republic.',
            citation: 'French Diplomatic Archives, La Courneuve / Reichsgesetzblatt 1871, No. 23.',
            context:
              'Under the Treaty of Frankfurt, Germany annexed the mineral-rich provinces of Alsace and eastern Lorraine without a plebiscite and forced France to pay a staggering 5 billion gold franc indemnity. This treaty created a permanent grievance in French political life. **Hinge Question:** Why did the seizure of Alsace-Lorraine guarantee that Franco-German relations could never be genuinely normalized under Bismarck?',
            hinge_question:
              'Why did the seizure of Alsace-Lorraine guarantee that Franco-German relations could never be genuinely normalized under Bismarck?',
            question_badge: 'Reliability & Provenance',
            question:
              "What does the severe language of the Treaty of Frankfurt reveal about Bismarck's strategic intentions towards France?",
            enquiry_question:
              "What does the severe language of the Treaty of Frankfurt reveal about Bismarck's strategic intentions towards France?",
            model_answer:
              "The treaty reveals Bismarck's intention to cripple France economically with a colossal five billion franc indemnity and strip away its strategic frontier fortresses, attempting to prevent France from recovering quickly enough to challenge Germany.",
            discussion_ideas: [
              'Economic and military cripplement: The indemnity and loss of the fortress of Metz were designed to keep France weak.',
              'National outrage: Denying the inhabitants of Alsace-Lorraine a vote generated a permanent grievance.',
              'Geopolitical trap: The annexation locked Germany into an adversarial relationship with France for over four decades.',
            ],
            source_context:
              'Under the Treaty of Frankfurt, Germany annexed the mineral-rich provinces of Alsace and eastern Lorraine without a plebiscite and forced France to pay a staggering 5 billion gold franc indemnity. This treaty created a permanent grievance in French political life. **Hinge Question:** Why did the seizure of Alsace-Lorraine guarantee that Franco-German relations could never be genuinely normalized under Bismarck?',
            teacher_notes: {
              source_context:
                'Under the Treaty of Frankfurt, Germany annexed the mineral-rich provinces of Alsace and eastern Lorraine without a plebiscite and forced France to pay a staggering 5 billion gold franc indemnity. This treaty created a permanent grievance in French political life. **Hinge Question:** Why did the seizure of Alsace-Lorraine guarantee that Franco-German relations could never be genuinely normalized under Bismarck?',
            },
            id: 'gw_l1_src_c',
            src: '',
            image: '',
          },
          sources: [
            {
              letter: 'C',
              type: 'written',
              title:
                'Source C (State Treaty): The Treaty of Frankfurt, Articles I & VII (10 May 1871)',
              text: 'Article I: The French Republic cedes to His Majesty the Emperor of Germany all sovereign rights and titles over the territories situated east of the frontier specified hereafter: the provinces of Upper and Lower Alsace... and the eastern districts of Lorraine including the fortress city of Metz.<br><br>Article VII: The payment of the war indemnity of five thousand million francs (5,000,000,000 francs) shall take place within three years. German occupation troops shall evacuate French departments sequentially only as each instalment is paid in gold coin.',
              caption:
                'Official diplomatic text of the Treaty of Frankfurt (10 May 1871), imposing severe territorial annexations and financial penalties on the defeated French Third Republic.',
              citation:
                'French Diplomatic Archives, La Courneuve / Reichsgesetzblatt 1871, No. 23.',
              context:
                'Under the Treaty of Frankfurt, Germany annexed the mineral-rich provinces of Alsace and eastern Lorraine without a plebiscite and forced France to pay a staggering 5 billion gold franc indemnity. This treaty created a permanent grievance in French political life. **Hinge Question:** Why did the seizure of Alsace-Lorraine guarantee that Franco-German relations could never be genuinely normalized under Bismarck?',
              hinge_question:
                'Why did the seizure of Alsace-Lorraine guarantee that Franco-German relations could never be genuinely normalized under Bismarck?',
              question_badge: 'Reliability & Provenance',
              question:
                "What does the severe language of the Treaty of Frankfurt reveal about Bismarck's strategic intentions towards France?",
              enquiry_question:
                "What does the severe language of the Treaty of Frankfurt reveal about Bismarck's strategic intentions towards France?",
              model_answer:
                "The treaty reveals Bismarck's intention to cripple France economically with a colossal five billion franc indemnity and strip away its strategic frontier fortresses, attempting to prevent France from recovering quickly enough to challenge Germany.",
              discussion_ideas: [
                'Economic and military cripplement: The indemnity and loss of the fortress of Metz were designed to keep France weak.',
                'National outrage: Denying the inhabitants of Alsace-Lorraine a vote generated a permanent grievance.',
                'Geopolitical trap: The annexation locked Germany into an adversarial relationship with France for over four decades.',
              ],
              source_context:
                'Under the Treaty of Frankfurt, Germany annexed the mineral-rich provinces of Alsace and eastern Lorraine without a plebiscite and forced France to pay a staggering 5 billion gold franc indemnity. This treaty created a permanent grievance in French political life. **Hinge Question:** Why did the seizure of Alsace-Lorraine guarantee that Franco-German relations could never be genuinely normalized under Bismarck?',
              teacher_notes: {
                source_context:
                  'Under the Treaty of Frankfurt, Germany annexed the mineral-rich provinces of Alsace and eastern Lorraine without a plebiscite and forced France to pay a staggering 5 billion gold franc indemnity. This treaty created a permanent grievance in French political life. **Hinge Question:** Why did the seizure of Alsace-Lorraine guarantee that Franco-German relations could never be genuinely normalized under Bismarck?',
              },
              id: 'gw_l1_src_c',
              src: '',
              image: '',
            },
          ],
        },
        {
          act: 4,
          title: 'French Revanche & The Cult of the Lost Provinces (1871–1889)',
          text: '<span class="para-ref">[1.4]</span> Losing Alsace-Lorraine deeply scarred the French nation for over forty years. In Paris, the statue of Strasbourg on the Place de la Concorde was draped in black mourning cloth. French schools taught generations of boys that their greatest duty was **Revanche** (revenge)—the recovery of their lost land.<br><br><span class="para-ref">[1.5]</span> In classrooms, wall maps showed Alsace-Lorraine shaded pitch-black as the <em>"tache noire"</em> (black spot). France introduced compulsory military training, and children practiced military marching in school drills. As French statesman Léon Gambetta declared: <em>"Think of it always; speak of it never."</em> No French politician could ever make peace with Berlin while German troops occupied Strasbourg and Metz.',
          image: '/units/great_war/assets/alsace_lorraine_1871_map.png',
          image_alt:
            'Archival cartographic map detailing the German annexation of Alsace and Lorraine in 1871',
          caption:
            'Contemporary 1871 boundary map illustrating the French provinces of Alsace and eastern Lorraine annexed by the German Empire under the Treaty of Frankfurt.',
          source: {
            letter: 'D',
            type: 'visual',
            title:
              'Source D (Visual Record): Albert Bettannier, La Tache Noire (The Black Spot, 1887)',
            image: '/units/great_war/assets/la_tache_noire_1887.jpg',
            src: '/units/great_war/assets/la_tache_noire_1887.jpg',
            is_artwork: true,
            caption:
              "Albert Bettannier's 1887 painting showing a French schoolmaster pointing out the blacked-out provinces of Alsace-Lorraine to young schoolboys wearing military-style cadet uniforms.",
            citation: "Musée de la Cour d'Or, Metz (Inv. Bettannier-1887-Metz).",
            context:
              "Following 1871, the French Third Republic mobilized the state education system to keep the memory of the 'lost provinces' alive. Schoolboys were instructed in military drill, gymnastics, and patriotic history under the doctrine of revanche (revenge). **Hinge Question:** How did state-sponsored schoolroom indoctrination like that shown in Bettannier's painting ensure the hatred of Germany was passed down across generations?",
            hinge_question:
              "How did state-sponsored schoolroom indoctrination like that shown in Bettannier's painting ensure the hatred of Germany was passed down across generations?",
            question_badge: 'Author’s Purpose',
            question:
              'What message was Albert Bettannier communicating about French national identity and schooling in the late nineteenth century?',
            enquiry_question:
              'What message was Albert Bettannier communicating about French national identity and schooling in the late nineteenth century?',
            model_answer:
              'Bettannier was highlighting how French schools deliberately educated boys from childhood to view the recovery of Alsace-Lorraine as an sacred national duty, preparing the next generation for future war against Germany.',
            discussion_ideas: [
              'Generational transmission: Ensuring children who never saw the 1870 war felt intense personal loss.',
              'Militarisation of education: The students wear cadet-style battalion uniforms and hold military focus.',
              'Cultural permanence: Illustrates why peaceful reconciliation was politically impossible for any French leader.',
            ],
            source_context:
              "Following 1871, the French Third Republic mobilized the state education system to keep the memory of the 'lost provinces' alive. Schoolboys were instructed in military drill, gymnastics, and patriotic history under the doctrine of revanche (revenge). **Hinge Question:** How did state-sponsored schoolroom indoctrination like that shown in Bettannier's painting ensure the hatred of Germany was passed down across generations?",
            teacher_notes: {
              source_context:
                "Following 1871, the French Third Republic mobilized the state education system to keep the memory of the 'lost provinces' alive. Schoolboys were instructed in military drill, gymnastics, and patriotic history under the doctrine of revanche (revenge). **Hinge Question:** How did state-sponsored schoolroom indoctrination like that shown in Bettannier's painting ensure the hatred of Germany was passed down across generations?",
            },
            id: 'gw_l1_src_d',
          },
          sources: [
            {
              letter: 'D',
              type: 'visual',
              title:
                'Source D (Visual Record): Albert Bettannier, La Tache Noire (The Black Spot, 1887)',
              image: '/units/great_war/assets/la_tache_noire_1887.jpg',
              src: '/units/great_war/assets/la_tache_noire_1887.jpg',
              is_artwork: true,
              caption:
                "Albert Bettannier's 1887 painting showing a French schoolmaster pointing out the blacked-out provinces of Alsace-Lorraine to young schoolboys wearing military-style cadet uniforms.",
              citation: "Musée de la Cour d'Or, Metz (Inv. Bettannier-1887-Metz).",
              context:
                "Following 1871, the French Third Republic mobilized the state education system to keep the memory of the 'lost provinces' alive. Schoolboys were instructed in military drill, gymnastics, and patriotic history under the doctrine of revanche (revenge). **Hinge Question:** How did state-sponsored schoolroom indoctrination like that shown in Bettannier's painting ensure the hatred of Germany was passed down across generations?",
              hinge_question:
                "How did state-sponsored schoolroom indoctrination like that shown in Bettannier's painting ensure the hatred of Germany was passed down across generations?",
              question_badge: 'Author’s Purpose',
              question:
                'What message was Albert Bettannier communicating about French national identity and schooling in the late nineteenth century?',
              enquiry_question:
                'What message was Albert Bettannier communicating about French national identity and schooling in the late nineteenth century?',
              model_answer:
                'Bettannier was highlighting how French schools deliberately educated boys from childhood to view the recovery of Alsace-Lorraine as an sacred national duty, preparing the next generation for future war against Germany.',
              discussion_ideas: [
                'Generational transmission: Ensuring children who never saw the 1870 war felt intense personal loss.',
                'Militarisation of education: The students wear cadet-style battalion uniforms and hold military focus.',
                'Cultural permanence: Illustrates why peaceful reconciliation was politically impossible for any French leader.',
              ],
              source_context:
                "Following 1871, the French Third Republic mobilized the state education system to keep the memory of the 'lost provinces' alive. Schoolboys were instructed in military drill, gymnastics, and patriotic history under the doctrine of revanche (revenge). **Hinge Question:** How did state-sponsored schoolroom indoctrination like that shown in Bettannier's painting ensure the hatred of Germany was passed down across generations?",
              teacher_notes: {
                source_context:
                  "Following 1871, the French Third Republic mobilized the state education system to keep the memory of the 'lost provinces' alive. Schoolboys were instructed in military drill, gymnastics, and patriotic history under the doctrine of revanche (revenge). **Hinge Question:** How did state-sponsored schoolroom indoctrination like that shown in Bettannier's painting ensure the hatred of Germany was passed down across generations?",
              },
              id: 'gw_l1_src_d',
            },
          ],
        },
        {
          act: 5,
          title: 'Bismarckian Isolation, The Reinsurance Treaty & Two-Front Dread (1871–1890)',
          text: '<span class="para-ref">[1.5]</span> British statesman **Benjamin Disraeli** warned Parliament that German unification had destroyed the balance of power. Bismarck knew France would never forgive its defeat. For the next twenty years, Bismarck had one central goal: **keep France diplomatically isolated to protect German peace**.<br><br><span class="para-ref">[1.6]</span> Germany dreaded a **war on two fronts (encirclement)**, attacked by France from the west and Russia from the east. To prevent this, Bismarck built a network of defensive alliances. His masterpiece was the secret 1887 **Reinsurance Treaty** with Russia, promising neutrality if either empire faced war. Bismarck\'s diplomacy kept Europe peaceful. However, in 1888, the impetuous young **Kaiser Wilhelm II** took power. In 1890, Wilhelm fired Bismarck and let the Russian treaty lapse. Germany had stepped onto the path toward dangerous two-front encirclement.',
          source: {
            letter: 'E',
            type: 'written',
            title:
              'Source E (Secret Treaty): The Reinsurance Treaty Between Germany and Russia (18 June 1887)',
            text: 'Article I: In case one of the High Contracting Parties should find itself at war with a third Great Power, the other would maintain a benevolent neutrality toward it, and would devote its efforts to the localization of the conflict. This provision would not apply to a war against Austria or France in case this war should result from an attack directed against one of these two latter Powers by one of the High Contracting Parties.<br><br>Article II: Germany recognizes the legitimacy of the decisive influence which Russia exercises in Bulgaria... Both courts pledge to take diplomatic steps to prevent any alteration of the territorial status quo on the Balkan Peninsula.',
            caption:
              'Confidential treaty negotiated secretly by Bismarck in Berlin, binding Germany and the Russian Empire in mutual benevolent neutrality.',
            citation:
              'Political Archive of the German Foreign Office, Berlin (PA AA, Geheimverträge 1887).',
            context:
              "Bismarck recognized that if France ever allied with Tsarist Russia, Germany would face the existential nightmare of a two-front war. To prevent this, he negotiated the ultra-secret Reinsurance Treaty of 1887, guaranteeing Russian neutrality. When Kaiser Wilhelm II dismissed Bismarck in 1890, he disastrously refused to renew this treaty. **Hinge Question:** Why did Kaiser Wilhelm II's abandonment of the Reinsurance Treaty in 1890 create the exact strategic catastrophe that Bismarck had spent twenty years preventing?",
            hinge_question:
              "Why did Kaiser Wilhelm II's abandonment of the Reinsurance Treaty in 1890 create the exact strategic catastrophe that Bismarck had spent twenty years preventing?",
            question_badge: 'Cross-Referencing',
            question:
              "How does the Reinsurance Treaty demonstrate Bismarck's obsession with avoiding a two-front war against France and Russia?",
            enquiry_question:
              "How does the Reinsurance Treaty demonstrate Bismarck's obsession with avoiding a two-front war against France and Russia?",
            model_answer:
              'The treaty shows Bismarck was willing to grant Russia secret diplomatic concessions in the Balkans in order to secure Russian neutrality, ensuring France could never form an alliance that would trap Germany between two hostile fronts.',
            discussion_ideas: [
              'Diplomatic acrobatics: Juggling conflicting commitments to both Austria and Russia simultaneously.',
              "Prevention of two-front trap: Bismarck's overriding strategic terror was a hostile coalition east and west.",
              "Consequences of abandonment: Dropping the treaty in 1890 immediately drove Tsarist Russia into France's arms.",
            ],
            source_context:
              "Bismarck recognized that if France ever allied with Tsarist Russia, Germany would face the existential nightmare of a two-front war. To prevent this, he negotiated the ultra-secret Reinsurance Treaty of 1887, guaranteeing Russian neutrality. When Kaiser Wilhelm II dismissed Bismarck in 1890, he disastrously refused to renew this treaty. **Hinge Question:** Why did Kaiser Wilhelm II's abandonment of the Reinsurance Treaty in 1890 create the exact strategic catastrophe that Bismarck had spent twenty years preventing?",
            teacher_notes: {
              source_context:
                "Bismarck recognized that if France ever allied with Tsarist Russia, Germany would face the existential nightmare of a two-front war. To prevent this, he negotiated the ultra-secret Reinsurance Treaty of 1887, guaranteeing Russian neutrality. When Kaiser Wilhelm II dismissed Bismarck in 1890, he disastrously refused to renew this treaty. **Hinge Question:** Why did Kaiser Wilhelm II's abandonment of the Reinsurance Treaty in 1890 create the exact strategic catastrophe that Bismarck had spent twenty years preventing?",
            },
            id: 'gw_l1_src_e',
            src: '',
            image: '',
          },
          sources: [
            {
              letter: 'E',
              type: 'written',
              title:
                'Source E (Secret Treaty): The Reinsurance Treaty Between Germany and Russia (18 June 1887)',
              text: 'Article I: In case one of the High Contracting Parties should find itself at war with a third Great Power, the other would maintain a benevolent neutrality toward it, and would devote its efforts to the localization of the conflict. This provision would not apply to a war against Austria or France in case this war should result from an attack directed against one of these two latter Powers by one of the High Contracting Parties.<br><br>Article II: Germany recognizes the legitimacy of the decisive influence which Russia exercises in Bulgaria... Both courts pledge to take diplomatic steps to prevent any alteration of the territorial status quo on the Balkan Peninsula.',
              caption:
                'Confidential treaty negotiated secretly by Bismarck in Berlin, binding Germany and the Russian Empire in mutual benevolent neutrality.',
              citation:
                'Political Archive of the German Foreign Office, Berlin (PA AA, Geheimverträge 1887).',
              context:
                "Bismarck recognized that if France ever allied with Tsarist Russia, Germany would face the existential nightmare of a two-front war. To prevent this, he negotiated the ultra-secret Reinsurance Treaty of 1887, guaranteeing Russian neutrality. When Kaiser Wilhelm II dismissed Bismarck in 1890, he disastrously refused to renew this treaty. **Hinge Question:** Why did Kaiser Wilhelm II's abandonment of the Reinsurance Treaty in 1890 create the exact strategic catastrophe that Bismarck had spent twenty years preventing?",
              hinge_question:
                "Why did Kaiser Wilhelm II's abandonment of the Reinsurance Treaty in 1890 create the exact strategic catastrophe that Bismarck had spent twenty years preventing?",
              question_badge: 'Cross-Referencing',
              question:
                "How does the Reinsurance Treaty demonstrate Bismarck's obsession with avoiding a two-front war against France and Russia?",
              enquiry_question:
                "How does the Reinsurance Treaty demonstrate Bismarck's obsession with avoiding a two-front war against France and Russia?",
              model_answer:
                'The treaty shows Bismarck was willing to grant Russia secret diplomatic concessions in the Balkans in order to secure Russian neutrality, ensuring France could never form an alliance that would trap Germany between two hostile fronts.',
              discussion_ideas: [
                'Diplomatic acrobatics: Juggling conflicting commitments to both Austria and Russia simultaneously.',
                "Prevention of two-front trap: Bismarck's overriding strategic terror was a hostile coalition east and west.",
                "Consequences of abandonment: Dropping the treaty in 1890 immediately drove Tsarist Russia into France's arms.",
              ],
              source_context:
                "Bismarck recognized that if France ever allied with Tsarist Russia, Germany would face the existential nightmare of a two-front war. To prevent this, he negotiated the ultra-secret Reinsurance Treaty of 1887, guaranteeing Russian neutrality. When Kaiser Wilhelm II dismissed Bismarck in 1890, he disastrously refused to renew this treaty. **Hinge Question:** Why did Kaiser Wilhelm II's abandonment of the Reinsurance Treaty in 1890 create the exact strategic catastrophe that Bismarck had spent twenty years preventing?",
              teacher_notes: {
                source_context:
                  "Bismarck recognized that if France ever allied with Tsarist Russia, Germany would face the existential nightmare of a two-front war. To prevent this, he negotiated the ultra-secret Reinsurance Treaty of 1887, guaranteeing Russian neutrality. When Kaiser Wilhelm II dismissed Bismarck in 1890, he disastrously refused to renew this treaty. **Hinge Question:** Why did Kaiser Wilhelm II's abandonment of the Reinsurance Treaty in 1890 create the exact strategic catastrophe that Bismarck had spent twenty years preventing?",
              },
              id: 'gw_l1_src_e',
              src: '',
              image: '',
            },
          ],
        },
      ],
      pair_share: {
        prompt:
          "Discuss with your partner: Was the German Empire created 'from below' by the people or 'from above' by military force and statecraft?",
        think: 'Spend 1 minute quietly considering the question and forming your own opinion.',
        pair: 'Discuss your thoughts with your partner. Identify where your ideas agree and where they differ.',
        share: "Share your pair's combined conclusion with the class.",
      },
      tasks: [
        {
          type: 'extended_writing',
          topic: 'Question 2: Explain Why [12 marks • 15 mins]',
          question:
            'Explain why the creation of the German Empire in 1871 created long-term instability in Europe. [12 marks]',
          stimulus: ['The annexation of Alsace-Lorraine', 'Bismarck’s dread of a two-front war'],
          hints: [
            {
              label: 'Point',
              prompt:
                'State a clear causal factor (e.g. the annexation of Alsace-Lorraine or Bismarck’s dread of a two-front war) that destabilised the European balance of power.',
            },
            {
              label: 'Evidence',
              prompt:
                'Deploy precise factual evidence: the 1871 Treaty of Frankfurt, the 5 billion franc indemnity, French revanchism, or the 1887 Reinsurance Treaty.',
            },
            {
              label: 'Explanation',
              prompt:
                'Analyse HOW this factor generated permanent diplomatic paranoia, forced military alliances, or shattered the 1815 Congress of Vienna balance of power.',
            },
            {
              label: 'Link',
              prompt:
                'Connect directly back to the question stem, demonstrating why this long-term instability set Europe on an inevitable path toward military conflict.',
            },
          ],
          scaffolding: {
            structure_strip: [
              {
                col: 'Paragraph 1: Alsace-Lorraine & Revanche',
                prompt:
                  'Explain how the annexation of Alsace-Lorraine under the Treaty of Frankfurt permanently poisoned Franco-German relations.',
                starter:
                  'A decisive factor creating long-term European instability was the annexation of Alsace-Lorraine in 1871...',
              },
              {
                col: 'Paragraph 2: Two-Front War & Alliances',
                prompt:
                  'Explain how Bismarck’s dread of a two-front war led to a complex web of secret defensive alliances that divided Europe.',
                starter:
                  'Furthermore, German foreign policy was dominated by Bismarck’s existential dread of a two-front war...',
              },
              {
                col: 'Paragraph 3: European Balance of Power',
                prompt:
                  'Explain how the sudden rise of a massive, industrialised German Empire overturned the 1815 Congress of Vienna balance of power.',
                starter:
                  'Ultimately, the fundamental cause of instability was the rupture of the traditional European balance of power...',
              },
            ],
            sentence_starters: [
              'A decisive factor creating long-term instability was...',
              'This rupture was intensified by the Treaty of Frankfurt because...',
              'In France, this triggered the cult of "Revanche", meaning that...',
              'To prevent encirclement, Bismarck attempted to isolate France through...',
              'Consequently, the creation of the German Empire divided Europe into...',
            ],
            connective_bank: [
              'A decisive factor was...',
              'This led directly to...',
              'Furthermore...',
              'In consequence of this...',
              'Ultimately, this meant that...',
            ],
            word_bank: [
              'Otto von Bismarck',
              'Realpolitik',
              'Blood and Iron',
              'Hall of Mirrors',
              'Treaty of Frankfurt',
              'Alsace-Lorraine',
              'Revanche',
              'Balance of Power',
              'Two-Front War',
            ],
          },
          model_answer:
            'The creation of the German Empire in 1871 created profound and enduring instability in Europe, fundamentally because it violently overturned the balance of power established by the 1815 Congress of Vienna. The emergence of a united Germany under Prussian military dominance placed an economic and industrial colossus at the physical centre of Europe, instantly threatening the security of its neighbours.\n\nFirst and foremost, the annexation of Alsace-Lorraine under the 1871 Treaty of Frankfurt permanently poisoned Franco-German relations. By seizing these mineral-rich border provinces and imposing a crushing 5 billion franc indemnity, Bismarck inflicted an unbearable national humiliation upon the French Republic. In France, this cultivated the powerful ideology of "Revanche" (revenge), symbolised by classroom maps veiling the lost provinces in black mourning crepe. French political leaders could never reconcile with Berlin while German garrisons occupied Strasbourg and Metz, ensuring that France remained an irreconcilable enemy permanently seeking allies to reverse the verdict of 1871.\n\nSecondly, the creation of the Empire generated permanent structural instability through Bismarck’s desperate attempts to prevent a two-front war. Realising France would seek vengeance, Bismarck’s supreme foreign policy objective was to keep France diplomatically isolated. This compelled him to construct an increasingly intricate, contradictory web of secret treaties—most notably the Dual Alliance with Austria-Hungary (1879) and the Reinsurance Treaty with Russia (1887). While Bismarck’s Realpolitik preserved peace during his tenure, it divided the continent into rigid armed camps. When Kaiser Wilhelm II dismissed Bismarck in 1890 and allowed the Russian treaty to lapse, Tsarist Russia naturally aligned with republican France in 1894, creating the very two-front encirclement Germany dreaded and locking Europe into competing alliance blocs.',
        },
      ],
      quiz: [
        {
          q: 'How many independent states existed in Central Europe before 1871?',
          a: '39',
          options: ['15', '39', '50', '300'],
        },
        {
          q: 'Which state was the most powerful among the German states before 1871?',
          a: 'Prussia',
          options: ['Austria', 'Bavaria', 'Saxony', 'Prussia'],
        },
        {
          q: 'Who became the Prime Minister of Prussia in 1862?',
          a: 'Otto von Bismarck',
          options: [
            'Wilhelm I',
            'Frederick the Great',
            'Otto von Bismarck',
            'Klemens von Metternich',
          ],
        },
        {
          q: "What was Bismarck's famous phrase for how Germany would be unified?",
          a: 'Blood and iron',
          options: [
            'Blood and iron',
            'Peace and diplomacy',
            'Gold and silver',
            'Speeches and majority decisions',
          ],
        },
        {
          q: 'What did Bismarck declare would decide the great questions of the day instead of speeches and votes?',
          a: 'Iron and blood',
          options: [
            'Speeches and majority votes',
            'Iron and blood',
            'Peaceful treaties',
            'Religious prayers',
          ],
        },
        {
          q: 'Which three countries did Prussia defeat to unify Germany?',
          a: 'Denmark, Austria, France',
          options: [
            'Britain, Russia, France',
            'Italy, Austria, Spain',
            'Denmark, Austria, France',
            'Sweden, Denmark, Russia',
          ],
        },
        {
          q: 'In what year did the Franco-Prussian War begin?',
          a: '1870',
          options: ['1864', '1866', '1914', '1870'],
        },
        {
          q: 'Where was the King of Prussia proclaimed the first German Emperor?',
          a: 'Palace of Versailles',
          options: [
            'Palace of Versailles',
            'Schönbrunn Palace',
            'Tower of London',
            'Reichstag in Berlin',
          ],
        },
        {
          q: 'When was the German Empire officially created?',
          a: '18 January 1871',
          options: ['1 September 1870', '28 June 1914', '18 January 1871', '11 November 1918'],
        },
        {
          q: 'Which valuable French territory did Germany seize in 1871?',
          a: 'Alsace-Lorraine',
          options: ['Brittany', 'Burgundy', 'Normandy', 'Alsace-Lorraine'],
        },
        {
          q: 'What was the economic union created by Prussia in 1834 called?',
          a: 'Zollverein',
          options: ['Reichstag', 'Zollverein', 'Kaiserreich', 'Wehrmacht'],
        },
        {
          q: 'Which major German-speaking power was deliberately excluded from the Zollverein?',
          a: 'Austria',
          options: ['Austria', 'Bavaria', 'Saxony', 'Hanover'],
        },
        {
          q: 'Where was King Wilhelm I proclaimed the first German Emperor (Kaiser) on 18 January 1871?',
          a: 'The Hall of Mirrors at the Palace of Versailles',
          options: [
            'The Brandenburg Gate in Berlin',
            'The Hall of Mirrors at the Palace of Versailles',
            'St Paul\'s Cathedral in London',
            'The Hofburg Palace in Vienna',
          ],
        },
        {
          q: 'Which two rival powers competed for control over the 39 independent German states before 1871?',
          a: 'Catholic Austria and Protestant Prussia',
          options: [
            'Catholic Austria and Protestant Prussia',
            'Britain and Spain',
            'France and Russia',
            'Sweden and Italy',
          ],
        },
        {
          q: 'Who was the first Emperor (Kaiser) of the newly unified Germany?',
          a: 'Wilhelm I',
          options: ['Wilhelm II', 'Otto von Bismarck', 'Frederick III', 'Wilhelm I'],
        },
        {
          q: 'Why did Bismarck provoke a war with France in 1870?',
          a: 'To unite the southern German states with the north',
          options: [
            'To steal French gold',
            'To unite the southern German states with the north',
            'To impress the British',
            'Because France attacked first',
          ],
        },
        {
          q: 'Which French Emperor was captured by the Prussian military?',
          a: 'Napoleon III',
          options: ['Napoleon III', 'Louis XIV', 'Napoleon Bonaparte', 'Charles de Gaulle'],
        },
        {
          q: 'What natural resources was Alsace-Lorraine rich in?',
          a: 'Coal and iron',
          options: ['Gold and silver', 'Oil and gas', 'Coal and iron', 'Timber and wheat'],
        },
        {
          q: 'What long-term effect did the taking of Alsace-Lorraine have?',
          a: 'It created long-term rivalry and hatred between France and Germany',
          options: [
            'It led directly to the Russian Revolution',
            'It made France and Germany permanent allies',
            'It caused the collapse of the British Empire',
            'It created long-term rivalry and hatred between France and Germany',
          ],
        },
        {
          q: 'Which British statesman warned Parliament that German unification had destroyed the balance of power?',
          a: 'Benjamin Disraeli',
          options: [
            'Benjamin Disraeli',
            'William Gladstone',
            'Lord Salisbury',
            'Winston Churchill',
          ],
        },
      ],
      prologue:
        'In 1871, in the opulent Hall of Mirrors at Versailles, Prussian Chancellor Otto von Bismarck proclaimed a united German Empire, forged through three swift military victories. France lay humiliated, stripped of Alsace-Lorraine. To protect his new empire, Bismarck built a complex web of alliances. How did German unification upset Europe’s balance of power?',
      exam_practice: {
        title: 'Key Stage 3 Disciplinary Writing: German Unification & Bismarckian Diplomacy',
        tariff: '12 marks (Explain Why Causal Analysis)',
        questions: [
          {
            tariff: '12 marks',
            type: 'explain_why_12m',
            question:
              'Explain why the creation of the German Empire in 1871 created long-term instability in Europe. [12 marks]',
            stimulus: ['The annexation of Alsace-Lorraine', 'Bismarck’s dread of a two-front war'],
            prompt:
              'Explain three distinct causal reasons: the permanent humiliation and revanchism caused by annexing Alsace-Lorraine from France, Bismarck’s complex web of secret alliances to prevent a two-front war, and the dramatic economic and industrial disruption to the European balance of power.',
            model:
              'One primary reason the unification of Germany created enduring instability was the territorial annexation of Alsace-Lorraine following the Franco-Prussian War (1870–1871). By proclaiming the German Empire inside the Hall of Mirrors at Versailles and seizing these border provinces, Chancellor Otto von Bismarck inflicted deep national humiliation on France. This fueled an enduring French desire for vengeance ("revanchisme") and guaranteed that post-war France would seek to dismantle German hegemony at the first strategic opportunity, permanently poisoning relations between the two continental powers.<br><br>Furthermore, a second decisive factor was Bismarck’s desperate dread of a two-front war ("cauchemar des coalitions"). Recognizing that a vengeful France would seek an ally on Germany’s eastern border, Bismarck constructed an intricate, secret web of diplomatic alliances—most notably the Dreikaiserbund (Three Emperors’ League) and the 1887 Reinsurance Treaty with Tsarist Russia. However, maintaining simultaneous friendships with rival empires like Austria-Hungary and Russia proved impossible. When Kaiser Wilhelm II dismissed Bismarck in 1890 and allowed the Reinsurance Treaty to lapse, Russia immediately allied with France in 1894, making Bismarck’s nightmare of encirclement a permanent geopolitical reality.<br><br>Finally, the sheer industrial and demographic power of the unified Reich disrupted the historic European balance of power. Germany rapidly overtook Britain and France in steel production, chemical manufacturing, and heavy engineering, while its population surged towards 65 million. This unprecedented economic supremacy fostered aggressive militarism and nationalistic confidence among German elites, who demanded a "place in the sun" (Weltpolitik) commensurate with their strength. Consequently, neighbouring great powers felt fundamentally threatened by German industrial preponderance, transforming Europe into an armed, competitive camp.',
            scaffolding: {
              acronym: '3-Paragraph Causal Analysis (PEEL)',
              acronym_title: '12-Mark Explain Why Standard',
              steps: [
                {
                  letter: 'REASON 1',
                  name: 'Alsace-Lorraine & French Revanchism',
                  prompt:
                    'Explain the Versailles proclamation, annexation of border provinces, and French vengeance.',
                  starter:
                    'One primary reason the creation of the German Empire caused instability was...',
                },
                {
                  letter: 'REASON 2',
                  name: 'Bismarck’s Dread of Two-Front War & Franco-Russian Alliance',
                  prompt:
                    'Explain Bismarck’s secret treaties, Wilhelm II dropping Russia, and 1894 Franco-Russian pact.',
                  starter: 'Furthermore, a second decisive factor was...',
                },
                {
                  letter: 'REASON 3',
                  name: 'Industrial Supremacy & Balance of Power Shift',
                  prompt:
                    'Explain steel production, demographic growth, and Weltpolitik challenging European equilibrium.',
                  starter: 'Finally, the unprecedented industrial power of the unified Reich...',
                },
              ],
              sentence_starters: [
                'One primary reason was that...',
                'For example, the annexation of...',
                'This led directly to instability because...',
                'A second critical factor was...',
                'Consequently, this meant that...',
                'Ultimately, this resulted in...',
              ],
              connectives_bank: [
                'Alsace-Lorraine',
                'revanchisme',
                'Otto von Bismarck',
                'two-front war',
                'Reinsurance Treaty (1887)',
                'Franco-Russian Alliance (1894)',
                'balance of power',
                'Weltpolitik',
              ],
            },
          },
        ],
      },
      sources: [
        {
          letter: 'A',
          type: 'visual',
          title: 'Source A (Cartographic Record): The German Empire in Central Europe (1871)',
          image: '/images/german_empire_1871.png',
          src: '/images/german_empire_1871.png',
          caption:
            'Official administrative map showing the newly proclaimed German Empire in 1871, uniting 39 disparate German kingdoms, grand duchies, and free cities under Prussian Hohenzollern rule.',
          citation:
            'Prussian State Library, Map Department / The British Library, London (Maps 28.b.11).',
          context:
            'The unification of Germany in 1871 shattered the traditional balance of power established at the Congress of Vienna in 1815. In place of a fragmented buffer zone of weak German principalities, a single industrial and military titan emerged at the heart of Europe. **Hinge Question:** Why did the sudden creation of a unified, industrialized Germany in Central Europe inherently threaten the strategic security of both France and Russia?',
          hinge_question:
            'Why did the sudden creation of a unified, industrialized Germany in Central Europe inherently threaten the strategic security of both France and Russia?',
          question_badge: 'Source Inference',
          question:
            "What does this map reveal about the dramatic transformation of Central Europe's balance of power in 1871?",
          enquiry_question:
            "What does this map reveal about the dramatic transformation of Central Europe's balance of power in 1871?",
          model_answer:
            'The map demonstrates that German unification consolidated 39 separate states into a massive, contiguous empire in Central Europe, replacing a weak buffer zone with a dominant military power that directly bordered France and Russia.',
          discussion_ideas: [
            'Consolidation of Central Europe: Replaced vulnerable smaller states with a unified industrial giant.',
            'Strategic encirclement fears: Placed a potential military superpower between France and Russia.',
            'Disruption of Vienna Settlement: Overturned the 1815 balance of power that had kept major European wars contained for over fifty years.',
          ],
          source_context:
            'The unification of Germany in 1871 shattered the traditional balance of power established at the Congress of Vienna in 1815. In place of a fragmented buffer zone of weak German principalities, a single industrial and military titan emerged at the heart of Europe. **Hinge Question:** Why did the sudden creation of a unified, industrialized Germany in Central Europe inherently threaten the strategic security of both France and Russia?',
          teacher_notes: {
            source_context:
              'The unification of Germany in 1871 shattered the traditional balance of power established at the Congress of Vienna in 1815. In place of a fragmented buffer zone of weak German principalities, a single industrial and military titan emerged at the heart of Europe. **Hinge Question:** Why did the sudden creation of a unified, industrialized Germany in Central Europe inherently threaten the strategic security of both France and Russia?',
          },
          id: 'gw_l1_src_a',
        },
        {
          letter: 'B',
          type: 'visual',
          title:
            'Source B (Historical Painting): Anton von Werner, The Proclamation of the German Empire at Versailles (1871)',
          image: '/units/great_war/assets/werner_versailles_1871_highres.jpg',
          src: '/units/great_war/assets/werner_versailles_1871_highres.jpg',
          is_artwork: true,
          caption:
            "Anton von Werner's famous painting depicting Prussian King Wilhelm I being acclaimed German Emperor in the Hall of Mirrors at the Palace of Versailles, with Chancellor Bismarck standing centrally in white uniform.",
          citation:
            'Bismarck Museum, Friedrichsruh / Staatliche Museen zu Berlin (Inv. Werner-1885-Versailles).',
          context:
            'Following the catastrophic French defeat at Sedan, Bismarck orchestrated the coronation of Kaiser Wilhelm I inside the Hall of Mirrors at Versailles—the historic palace of French royalty and power. This deliberate humiliation of France on its own soil ignited an enduring desire for national revenge (revanche). **Hinge Question:** How did staging the German coronation inside the French Palace of Versailles transform a military defeat into an irreconcilable national feud?',
          hinge_question:
            'How did staging the German coronation inside the French Palace of Versailles transform a military defeat into an irreconcilable national feud?',
          question_badge: 'Author’s Purpose',
          question:
            'Why did Bismarck intentionally stage the imperial proclamation inside the Hall of Mirrors at Versailles?',
          enquiry_question:
            'Why did Bismarck intentionally stage the imperial proclamation inside the Hall of Mirrors at Versailles?',
          model_answer:
            'Bismarck staged the proclamation in the Hall of Mirrors to inflict maximum psychological and symbolic humiliation on defeated France, visibly demonstrating that German military supremacy had superseded historic French dominance in Europe.',
          discussion_ideas: [
            'Symbolic humiliation: Usurping the ancestral palace of Louis XIV to declare Prussian ascendancy.',
            'Psychological scarring: Cemented deep French resentment that persisted until 1914.',
            'Centrality of Bismarck: Visually placing Bismarck in brilliant white at the centre of the composition to highlight his political mastery.',
          ],
          source_context:
            'Following the catastrophic French defeat at Sedan, Bismarck orchestrated the coronation of Kaiser Wilhelm I inside the Hall of Mirrors at Versailles—the historic palace of French royalty and power. This deliberate humiliation of France on its own soil ignited an enduring desire for national revenge (revanche). **Hinge Question:** How did staging the German coronation inside the French Palace of Versailles transform a military defeat into an irreconcilable national feud?',
          teacher_notes: {
            source_context:
              'Following the catastrophic French defeat at Sedan, Bismarck orchestrated the coronation of Kaiser Wilhelm I inside the Hall of Mirrors at Versailles—the historic palace of French royalty and power. This deliberate humiliation of France on its own soil ignited an enduring desire for national revenge (revanche). **Hinge Question:** How did staging the German coronation inside the French Palace of Versailles transform a military defeat into an irreconcilable national feud?',
          },
          id: 'gw_l1_src_b',
        },
        {
          letter: 'C',
          type: 'written',
          title: 'Source C (State Treaty): The Treaty of Frankfurt, Articles I & VII (10 May 1871)',
          text: 'Article I: The French Republic cedes to His Majesty the Emperor of Germany all sovereign rights and titles over the territories situated east of the frontier specified hereafter: the provinces of Upper and Lower Alsace... and the eastern districts of Lorraine including the fortress city of Metz.<br><br>Article VII: The payment of the war indemnity of five thousand million francs (5,000,000,000 francs) shall take place within three years. German occupation troops shall evacuate French departments sequentially only as each instalment is paid in gold coin.',
          caption:
            'Official diplomatic text of the Treaty of Frankfurt (10 May 1871), imposing severe territorial annexations and financial penalties on the defeated French Third Republic.',
          citation: 'French Diplomatic Archives, La Courneuve / Reichsgesetzblatt 1871, No. 23.',
          context:
            'Under the Treaty of Frankfurt, Germany annexed the mineral-rich provinces of Alsace and eastern Lorraine without a plebiscite and forced France to pay a staggering 5 billion gold franc indemnity. This treaty created a permanent grievance in French political life. **Hinge Question:** Why did the seizure of Alsace-Lorraine guarantee that Franco-German relations could never be genuinely normalized under Bismarck?',
          hinge_question:
            'Why did the seizure of Alsace-Lorraine guarantee that Franco-German relations could never be genuinely normalized under Bismarck?',
          question_badge: 'Reliability & Provenance',
          question:
            "What does the severe language of the Treaty of Frankfurt reveal about Bismarck's strategic intentions towards France?",
          enquiry_question:
            "What does the severe language of the Treaty of Frankfurt reveal about Bismarck's strategic intentions towards France?",
          model_answer:
            "The treaty reveals Bismarck's intention to cripple France economically with a colossal five billion franc indemnity and strip away its strategic frontier fortresses, attempting to prevent France from recovering quickly enough to challenge Germany.",
          discussion_ideas: [
            'Economic and military cripplement: The indemnity and loss of the fortress of Metz were designed to keep France weak.',
            'National outrage: Denying the inhabitants of Alsace-Lorraine a vote generated a permanent grievance.',
            'Geopolitical trap: The annexation locked Germany into an adversarial relationship with France for over four decades.',
          ],
          source_context:
            'Under the Treaty of Frankfurt, Germany annexed the mineral-rich provinces of Alsace and eastern Lorraine without a plebiscite and forced France to pay a staggering 5 billion gold franc indemnity. This treaty created a permanent grievance in French political life. **Hinge Question:** Why did the seizure of Alsace-Lorraine guarantee that Franco-German relations could never be genuinely normalized under Bismarck?',
          teacher_notes: {
            source_context:
              'Under the Treaty of Frankfurt, Germany annexed the mineral-rich provinces of Alsace and eastern Lorraine without a plebiscite and forced France to pay a staggering 5 billion gold franc indemnity. This treaty created a permanent grievance in French political life. **Hinge Question:** Why did the seizure of Alsace-Lorraine guarantee that Franco-German relations could never be genuinely normalized under Bismarck?',
          },
          id: 'gw_l1_src_c',
          src: '',
          image: '',
        },
        {
          letter: 'D',
          type: 'visual',
          title:
            'Source D (Visual Record): Albert Bettannier, La Tache Noire (The Black Spot, 1887)',
          image: '/units/great_war/assets/la_tache_noire_1887.jpg',
          src: '/units/great_war/assets/la_tache_noire_1887.jpg',
          is_artwork: true,
          caption:
            "Albert Bettannier's 1887 painting showing a French schoolmaster pointing out the blacked-out provinces of Alsace-Lorraine to young schoolboys wearing military-style cadet uniforms.",
          citation: "Musée de la Cour d'Or, Metz (Inv. Bettannier-1887-Metz).",
          context:
            "Following 1871, the French Third Republic mobilized the state education system to keep the memory of the 'lost provinces' alive. Schoolboys were instructed in military drill, gymnastics, and patriotic history under the doctrine of revanche (revenge). **Hinge Question:** How did state-sponsored schoolroom indoctrination like that shown in Bettannier's painting ensure the hatred of Germany was passed down across generations?",
          hinge_question:
            "How did state-sponsored schoolroom indoctrination like that shown in Bettannier's painting ensure the hatred of Germany was passed down across generations?",
          question_badge: 'Author’s Purpose',
          question:
            'What message was Albert Bettannier communicating about French national identity and schooling in the late nineteenth century?',
          enquiry_question:
            'What message was Albert Bettannier communicating about French national identity and schooling in the late nineteenth century?',
          model_answer:
            'Bettannier was highlighting how French schools deliberately educated boys from childhood to view the recovery of Alsace-Lorraine as an sacred national duty, preparing the next generation for future war against Germany.',
          discussion_ideas: [
            'Generational transmission: Ensuring children who never saw the 1870 war felt intense personal loss.',
            'Militarisation of education: The students wear cadet-style battalion uniforms and hold military focus.',
            'Cultural permanence: Illustrates why peaceful reconciliation was politically impossible for any French leader.',
          ],
          source_context:
            "Following 1871, the French Third Republic mobilized the state education system to keep the memory of the 'lost provinces' alive. Schoolboys were instructed in military drill, gymnastics, and patriotic history under the doctrine of revanche (revenge). **Hinge Question:** How did state-sponsored schoolroom indoctrination like that shown in Bettannier's painting ensure the hatred of Germany was passed down across generations?",
          teacher_notes: {
            source_context:
              "Following 1871, the French Third Republic mobilized the state education system to keep the memory of the 'lost provinces' alive. Schoolboys were instructed in military drill, gymnastics, and patriotic history under the doctrine of revanche (revenge). **Hinge Question:** How did state-sponsored schoolroom indoctrination like that shown in Bettannier's painting ensure the hatred of Germany was passed down across generations?",
          },
          id: 'gw_l1_src_d',
        },
        {
          letter: 'E',
          type: 'written',
          title:
            'Source E (Secret Treaty): The Reinsurance Treaty Between Germany and Russia (18 June 1887)',
          text: 'Article I: In case one of the High Contracting Parties should find itself at war with a third Great Power, the other would maintain a benevolent neutrality toward it, and would devote its efforts to the localization of the conflict. This provision would not apply to a war against Austria or France in case this war should result from an attack directed against one of these two latter Powers by one of the High Contracting Parties.<br><br>Article II: Germany recognizes the legitimacy of the decisive influence which Russia exercises in Bulgaria... Both courts pledge to take diplomatic steps to prevent any alteration of the territorial status quo on the Balkan Peninsula.',
          caption:
            'Confidential treaty negotiated secretly by Bismarck in Berlin, binding Germany and the Russian Empire in mutual benevolent neutrality.',
          citation:
            'Political Archive of the German Foreign Office, Berlin (PA AA, Geheimverträge 1887).',
          context:
            "Bismarck recognized that if France ever allied with Tsarist Russia, Germany would face the existential nightmare of a two-front war. To prevent this, he negotiated the ultra-secret Reinsurance Treaty of 1887, guaranteeing Russian neutrality. When Kaiser Wilhelm II dismissed Bismarck in 1890, he disastrously refused to renew this treaty. **Hinge Question:** Why did Kaiser Wilhelm II's abandonment of the Reinsurance Treaty in 1890 create the exact strategic catastrophe that Bismarck had spent twenty years preventing?",
          hinge_question:
            "Why did Kaiser Wilhelm II's abandonment of the Reinsurance Treaty in 1890 create the exact strategic catastrophe that Bismarck had spent twenty years preventing?",
          question_badge: 'Cross-Referencing',
          question:
            "How does the Reinsurance Treaty demonstrate Bismarck's obsession with avoiding a two-front war against France and Russia?",
          enquiry_question:
            "How does the Reinsurance Treaty demonstrate Bismarck's obsession with avoiding a two-front war against France and Russia?",
          model_answer:
            'The treaty shows Bismarck was willing to grant Russia secret diplomatic concessions in the Balkans in order to secure Russian neutrality, ensuring France could never form an alliance that would trap Germany between two hostile fronts.',
          discussion_ideas: [
            'Diplomatic acrobatics: Juggling conflicting commitments to both Austria and Russia simultaneously.',
            "Prevention of two-front trap: Bismarck's overriding strategic terror was a hostile coalition east and west.",
            "Consequences of abandonment: Dropping the treaty in 1890 immediately drove Tsarist Russia into France's arms.",
          ],
          source_context:
            "Bismarck recognized that if France ever allied with Tsarist Russia, Germany would face the existential nightmare of a two-front war. To prevent this, he negotiated the ultra-secret Reinsurance Treaty of 1887, guaranteeing Russian neutrality. When Kaiser Wilhelm II dismissed Bismarck in 1890, he disastrously refused to renew this treaty. **Hinge Question:** Why did Kaiser Wilhelm II's abandonment of the Reinsurance Treaty in 1890 create the exact strategic catastrophe that Bismarck had spent twenty years preventing?",
          teacher_notes: {
            source_context:
              "Bismarck recognized that if France ever allied with Tsarist Russia, Germany would face the existential nightmare of a two-front war. To prevent this, he negotiated the ultra-secret Reinsurance Treaty of 1887, guaranteeing Russian neutrality. When Kaiser Wilhelm II dismissed Bismarck in 1890, he disastrously refused to renew this treaty. **Hinge Question:** Why did Kaiser Wilhelm II's abandonment of the Reinsurance Treaty in 1890 create the exact strategic catastrophe that Bismarck had spent twenty years preventing?",
          },
          id: 'gw_l1_src_e',
          src: '',
          image: '',
        },
      ],
    },
    {
      id: 'lesson_2',
      causal_domino_spine: {
        title: 'Imperialism & Moroccan Crises: Chronology Spine',
        subtitle: 'Key Turning Points & Causal Dominoes (M-A-I-N Framework)',
        stages: [
          {
            step: 1,
            para_ref: '[2.1]',
            date: '1884–1885',
            title: 'The Berlin Conference & Africa Carve-Up',
            actor: 'European Great Powers',
            tag: '🌍 IMPERIALISM',
            trigger:
              'Fourteen European powers meet in Berlin to establish rules for partitioning Africa, securing raw materials and colonial markets.',
            connective:
              'Britain and France gained the richest territories, leaving newly unified Germany with smaller colonies and growing resentment.',
            question: 'Why did European empires carve up Africa in the 1880s Scramble?',
          },
          {
            step: 2,
            para_ref: '[2.2]',
            date: '1890–1897',
            title: 'Weltpolitik & "A Place in the Sun"',
            actor: 'Kaiser Wilhelm II',
            tag: '🌍 IMPERIALISM',
            trigger:
              'Wilhelm II dismisses Bismarck and launches "Weltpolitik", declaring that Germany must build a battlefleet and conquer a global empire equal to Britain.',
            connective:
              'Alarmed Britain and France, who viewed German imperial ambition as a direct threat to their overseas colonies and trade.',
            question: 'Explain why Wilhelm II launched "Weltpolitik" in the 1890s.',
          },
          {
            step: 3,
            para_ref: '[2.3]',
            date: 'March 1905',
            title: 'The First Moroccan Crisis (Tangier)',
            actor: 'Imperial Germany & France',
            tag: '🌍 IMPERIALISM',
            trigger:
              'Kaiser Wilhelm II lands at Tangier on a white horse, publicly backing Moroccan independence to challenge French colonial dominance.',
            connective:
              'Attempted to test and divide the 1904 Entente Cordiale, but instead brought the European powers to the brink of war.',
            question: 'What happened when the Kaiser landed at Tangier in 1905?',
          },
          {
            step: 4,
            para_ref: '[2.4]',
            date: 'January–April 1906',
            title: 'The Algeciras Conference Humiliation',
            actor: 'Great Powers at Algeciras',
            tag: '🤝 ALLIANCES',
            trigger:
              'At the conference in Spain, Britain, Russia, and Italy all vote to back French control in Morocco, leaving Germany isolated.',
            connective:
              'Deeply humiliated Germany and convinced Britain and France to begin secret joint military conversations for mutual defence.',
            question: 'To what extent did the 1906 Algeciras Conference isolate Germany?',
          },
          {
            step: 5,
            para_ref: '[2.5]',
            date: 'July 1911',
            title: 'The Agadir Crisis (The Panther’s Leap)',
            actor: 'Germany, France & Britain',
            tag: '🌍 IMPERIALISM',
            trigger:
              'Germany sends the gunboat SMS Panther to Agadir, demanding the French Congo in exchange for accepting French control of Morocco.',
            connective:
              'Britain firmly backed France with the Mansion House speech; Germany backed down, feeling encircled and preparing for war.',
            question: 'Why did the gunboat Panther at Agadir bring Europe close to war?',
          },
        ],
      },
      video: [
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=DduN1cU2p9U',
          title: "What was the 'Scramble for Africa'? - BBC What's New",
          duration: '3 mins 0 secs',
          pathway: 'Starter Hook',
          teacher_guidance:
            'Concise BBC animated explainer of the 1884–85 Berlin Conference, European colonial partition of the African continent, and economic exploitation. Recommended Watch Window: 00:00–02:45 • Lesson Phase: Quick Starter Check (0–3m). Tone Alert: Fast, accessible animated educational summary.',
          viewing_task:
            '<ol><li><strong>[00:45] Quick Check:</strong> What percentage of the African continent was colonized by European imperial powers between 1881 and 1914 during the "Scramble for Africa"?</li><li><strong>[02:00] Hinge Question:</strong> Why did Kaiser Wilhelm II\'s demand for Germany to have a "place in the sun" (<em>Platz an der Sonne</em>) alarm the established British and French global empires?</li></ol>',
          model_answer:
            '<ol><li><strong>Quick Check:</strong> Approximately 90% of the continent (up from only 10% in 1870).</li><li><strong>Hinge Question:</strong> By the time Germany unified in 1871, Britain and France had already seized the most lucrative colonial territories, shipping routes, and mineral reserves. When Wilhelm II announced his aggressive policy of <em>Weltpolitik</em> (world policy) to build a global colonial empire, Germany could expand only by challenging British and French spheres of influence, directly creating colonial flashpoints like the Moroccan Crises.</li></ol>',
        },
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=efV3uZqc3so',
          title:
            'The Scramble for Africa Explained: Imperialism, Empire, and the Road to World War I',
          duration: '12 mins 49 secs',
          pathway: 'Enquiry Evidence',
          teacher_guidance:
            'Detailed analysis of the 1884 Berlin Conference convened by Bismarck, the First Moroccan Crisis (Tangier 1905), the Second Moroccan Crisis (Agadir 1911), and the consolidation of the Entente Cordiale. Recommended Watch Window: 01:15–07:45 • Lesson Phase: Guided Instruction & Archival Investigation. Tone Alert: Comprehensive, analytical imperial history.',
          viewing_task:
            "<ol><li><strong>[02:15] Recall:</strong> Which German gunboat did Kaiser Wilhelm II dispatch to the Atlantic port of Agadir in July 1911 to challenge French colonial dominance in Morocco?</li><li><strong>[04:45] Explain:</strong> Explain the outcome of the 1906 Algeciras Conference: how did Germany's attempt to drive a wedge between Britain and France backfire catastrophically?</li><li><strong>[06:50] Challenge:</strong> Evaluate how imperial rivalry in Africa cemented the 1904 Anglo-French <em>Entente Cordiale</em>: why did colonial crises transform a colonial settlement into a de facto military alliance?</li></ol>",
          model_answer:
            '<ol><li><strong>Recall:</strong> The gunboat SMS <em>Panther</em> (the "Panther\'s Spring").</li><li><strong>Explain:</strong> At Algeciras, only Austria-Hungary supported Germany, while Britain, Russia, Italy, and the United States backed France\'s special police mandate in Morocco. Germany suffered a humiliating diplomatic isolation, while Britain and France were drawn into secret naval and military staff conversations, strengthening the very Anglo-French alliance the Kaiser had sought to shatter.</li><li><strong>Challenge:</strong> The 1904 Entente Cordiale was initially merely an agreement resolving overseas colonial disputes (recognizing British control of Egypt and French influence in Morocco). However, German gunboat intimidation at Tangier and Agadir convinced British foreign policy leaders that Germany sought naval dominance on the Atlantic and hegemonial conquest of Europe, leading Britain to commit to defending French northern coastal waters.</li></ol>',
        },
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=5y8DZUShVis',
          title: 'Cinematic: Imperial Clashes & The European Scramble',
          duration: '2 mins 56 secs',
          pathway: 'Cinematic',
          teacher_guidance:
            'Dramatizes the hubris and military power projection of European colonial empires in Africa and Asia. Recommended Watch Window: 00:00–02:56 (Full Trailer). Lesson Phase: Cinematic Starter Hook & Imperial Competition. Tone Alert: Grand historical drama on colonial ambition.',
          viewing_task:
            '<p><strong>Cinematic Discussion Focus:</strong> Notice the sheer military confidence and racial superiority projected by European colonial administrations in the late 19th century. How does this film capture why imperial competition in Africa and Asia heightened national rivalries in Europe, convincing each power that retreating from a colonial crisis was a humiliation they could not endure?</p>',
          model_answer:
            '<p><strong>Cinematic Analysis:</strong> The trailer illustrates how European imperial powers treated overseas territories as chessboard pawns for national prestige. Clashes like the 1898 Fashoda incident and the 1905/1911 Moroccan Crises proved that imperial brinkmanship was directly tied to domestic patriotic pride, creating explosive geopolitical friction that carried over into Europe.</p>',
        },
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=0SEgckAL-xc',
          title: 'Powder Keg: Europe 1900 to 1914 | Historical Documentary | Lucasfilm',
          duration: '26 mins 6 secs',
          pathway: 'Documentary Depth',
          teacher_guidance:
            'Examines the global web of imperial competition, the tension between autocracy and democracy, and how colonial disputes hardened national rivalries into armed camps. Recommended Watch Window: 02:00–08:30 • Lesson Phase: Guided Instruction & Synoptic Evaluation. Tone Alert: High-production archival documentary featuring primary footage and scholar commentary.',
          viewing_task:
            '<ol><li><strong>[03:30] Recall:</strong> What crucial waterway connecting the Mediterranean to the Red Sea did Great Britain regard as the indispensable imperial lifeline to British India?</li><li><strong>[05:45] Explain:</strong> How did social Darwinist theories and competitive imperial nationalism convince European publics and military leaders that war was a natural, purifying test of national vitality?</li><li><strong>[07:50] Challenge:</strong> Evaluate whether imperial competition in Africa and Asia was a primary cause of World War I or merely a symptom of European national rivalries.</li></ol>',
          model_answer:
            '<ol><li><strong>Recall:</strong> The Suez Canal (opened in 1869).</li><li><strong>Explain:</strong> Pervasive imperial propaganda and pseudoscience argued that nations, like biological species, were engaged in a struggle for "survival of the fittest." Newspapers and school textbooks glorified military conquest and imperial expansion, cultivating an arrogant bellicosity where compromise was viewed as national weakness and decadence.</li><li><strong>Challenge:</strong> While colonial crises (such as Fashoda, Tangier, and Agadir) nearly sparked war, European powers repeatedly resolved them through negotiated territorial trade-offs. The crucial danger of imperialism was indirect: it fueled the naval arms race, deepened psychological paranoia, and solidified the Anglo-French-Russian alliance system that made a localized Balkan conflict uncontrollable.</li></ol>',
        },
      ],
      skill: 'Causation & Imperial Rivalry: The Scramble for Africa & Morocco',
      title:
        'Enquiry 2: Imperial Rivalry, the Scramble for Africa & the Moroccan Crises (1884–1911)',
      subtitle:
        'From the Berlin Conference and Weltpolitik to the Brink of War at Tangier and Agadir',
      enquiryQuestion:
        'How did imperial ambition in Africa and Kaiser Wilhelm II’s "Weltpolitik" bring European powers to the brink of war?',
      margin_spine: [
        {
          year: '1884–1885',
          label: 'Berlin Conference',
        },
        {
          year: '1890–1897',
          label: 'Weltpolitik',
        },
        {
          year: 'Mar 1905',
          label: 'Tangier Crisis',
        },
        {
          year: '1906',
          label: 'Algeciras Isolation',
        },
        {
          year: 'Jul 1911',
          label: 'Panther at Agadir',
        },
      ],
      teacher_notes: {
        primer:
          'This enquiry explores how imperial competition outside Europe poisoned relations between the Great Powers. In 1884, Bismarck convened the Berlin Conference to peacefully divide Africa under the doctrine of "effective occupation." But when Kaiser Wilhelm II dismissed Bismarck in 1890 and launched "Weltpolitik" demanding Germany’s "place in the sun," imperial expansion became aggressive and confrontational. The lesson focuses on the First Moroccan Crisis (1905, Tangier) and Second Moroccan Crisis (1911, Agadir), demonstrating how German attempts to fracture the Anglo-French Entente Cordiale completely backfired, driving Britain and France into secret joint military and naval planning.',
        objectives: [
          {
            objective:
              'Explain why European powers partitioned Africa at the 1884–85 Berlin Conference.',
            primer:
              'Focus on paragraph [2.1]. Emphasize the search for raw materials (rubber, minerals, cotton) and national prestige, regulated by Bismarck’s doctrine of effective occupation.',
            question:
              'Why did European empires prefer to establish rules at Berlin rather than fight wars directly over African territory?',
          },
          {
            objective:
              'Analyze how Kaiser Wilhelm II’s policy of "Weltpolitik" altered German foreign policy.',
            primer:
              'Direct students to paragraph [2.2]. Compare Bismarck’s cautious European balance of power with Wilhelm II’s bellicose demand for a global colonial empire.',
            question:
              'What did Wilhelm II mean by demanding Germany’s "place in the sun", and why did this alarm Great Britain?',
          },
          {
            objective:
              'Evaluate how the Moroccan Crises cemented the Anglo-French Entente and isolated Germany.',
            primer:
              'Focus on paragraphs [2.3] to [2.5]. Show how the Kaiser’s landing at Tangier and the dispatch of the gunboat Panther to Agadir united Britain and France against Germany.',
            question:
              'Why did Germany’s aggressive "gunboat diplomacy" in Morocco achieve the exact opposite of what Berlin intended?',
          },
        ],
        source_context:
          'Primary photograph depicting the German imperial gunboat SMS Panther anchored off the Atlantic port of Agadir, Morocco, in July 1911. Dispatched by the German Foreign Office under the pretext of protecting German commercial interests during local unrest, the Panther was actually sent to bully France into ceding territory in the Congo. This reckless act of "gunboat diplomacy" provoked widespread British fury, prompting Chancellor David Lloyd George’s famous Mansion House speech and initiating joint Anglo-French military staff talks. **Hinge Question:** Why did the deployment of a single small gunboat to an Atlantic port bring Europe to the threshold of a general war?',
      },
      do_now: {
        title: 'Do Now: Unification & European Alliances Recall',
        type: 'mixed',
        items: [
          {
            question: 'Which Prussian Minister-President unified Germany through "blood and iron"?',
            answer: 'Otto von Bismarck',
          },
          {
            question: 'In what year was the German Empire proclaimed at Versailles?',
            answer: '1871',
          },
          {
            question: 'Which mineral-rich border province did Germany seize from France in 1871?',
            answer: 'Alsace-Lorraine',
          },
          {
            question: 'What was the French term for their desire for national revenge?',
            answer: 'Revanche',
          },
          {
            question: 'Which Kaiser dismissed Bismarck in 1890?',
            answer: 'Kaiser Wilhelm II',
          },
        ],
      },
      vocab: [
        {
          term: 'Weltpolitik',
          definition:
            'Kaiser Wilhelm II’s aggressive "World Policy" aiming to transform Germany into a global superpower with overseas colonies and a battlefleet.',
          syllables: 'We-ltpo-litik',
          phonetic: 'weltpolitik',
          tier: '3',
        },
        {
          term: 'Gunboat Diplomacy',
          definition:
            'The pursuit of foreign policy objectives through conspicuous displays of naval military force to intimidate rivals.',
          syllables: 'Gu-nboat Di-plo-macy',
          phonetic: 'gunboat diplomacy',
          tier: '2',
        },
        {
          term: 'Entente Cordiale',
          definition:
            'The 1904 diplomatic agreement between Great Britain and France resolving colonial disputes and inaugurating diplomatic cooperation.',
          syllables: 'E-ntente Co-rdia-le',
          phonetic: 'entente cordiale',
          tier: '2',
        },
        {
          term: 'Algeciras Conference',
          definition:
            'The 1906 international summit where twelve nations backed France in Morocco, leaving Germany diplomatically isolated.',
          syllables: 'A-lge-ciras Co-nfe-re-nce',
          phonetic: 'algeciras conference',
          tier: '2',
        },
        {
          term: 'Mansion House Speech',
          definition:
            'A 1911 public speech by British Chancellor David Lloyd George warning Germany that Britain would not allow France to be bullied.',
          syllables: 'Ma-nsion Hou-se Speech',
          phonetic: 'mansion house speech',
          tier: '3',
        },
      ],
      narrative_blocks: [
        {
          act: 1,
          title: 'The Scramble for Africa & The Berlin Conference (1884–1885)',
          text: '<span class="para-ref">[2.1]</span> Between 1881 and 1914, European powers raced to conquer Africa in the **Scramble for Africa**. Factories in Europe demanded cheap raw materials—rubber, copper, cotton, and palm oil. Rulers also wanted new trade markets and imperial prestige. In 1870, Europeans controlled under ten percent of Africa; by 1914, they ruled ninety percent.<br><br><span class="para-ref">[2.2]</span> To avoid war among European powers, Bismarck organized the **Berlin Conference (1884–1885)**. Fourteen nations met to agree rules for carving up the continent. They agreed the rule of **effective occupation**: countries had to set up physical offices, soldiers, and administration before claiming land. European diplomats drew straight borders across maps, completely ignoring African languages, cultures, and historic tribal kingdoms.',
          image: '/units/great_war/assets/map_africa_1914.png',
          image_alt:
            'Archival geopolitical map showing the partition of Africa among European imperial powers by 1914',
          caption:
            'Geopolitical partition of Africa following the 1884–1885 Berlin Conference, showing vast British and French colonial empires alongside late-arriving German territories.',
          source: {
            letter: 'A',
            type: 'visual',
            title:
              'Source A (Political Cartoon): John Tenniel, "The Greedy Boy" (Punch, 10 January 1885)',
            image: '/units/great_war/assets/was_greedy_boy.png',
            src: '/units/great_war/assets/was_greedy_boy.png',
            is_artwork: true,
            caption:
              "John Tenniel's 1885 cartoon for Punch showing German Chancellor Otto von Bismarck carving large slices of colonial pudding ('Angra Pequena' and 'New Guinea'), leaving John Bull with an empty plate following the Berlin Conference.",
            citation:
              'Punch, or the London Charivari, London (Vol. 88, 10 January 1885, p. 19) / British Cartoon Archive.',
            context:
              "At the 1884–1885 Berlin Conference, Chancellor Bismarck orchestrated the formal partition of Africa, acquiring Germany's first official protectorates in South-West Africa (Angra Pequena/Namibia), Togoland, Cameroon, and German New Guinea. British public opinion was startled by Germany's sudden entry into colonial expansion, portraying Bismarck as a greedy table-companion taking colonial territories Britain considered its natural sphere of influence. **Hinge Question:** How does Tenniel's depiction of Bismarck taking 'Angra Pequena' reveal Britain's resentment when other European powers claimed colonial territory?",
            hinge_question:
              "How does Tenniel's depiction of Bismarck taking 'Angra Pequena' reveal Britain's resentment when other European powers claimed colonial territory?",
            question_badge: 'Source Inference',
            question:
              "What does this cartoon reveal about British reactions to Germany's sudden entry into colonial competition in 1884–1885?",
            enquiry_question:
              "What does this cartoon reveal about British reactions to Germany's sudden entry into colonial competition in 1884–1885?",
            model_answer:
              "The cartoon reveals British resentment and shock at German colonial claims, portraying Bismarck as an aggressive 'greedy boy' taking territories like Angra Pequena and New Guinea that Britain assumed it could dominate without competition.",
            discussion_ideas: [
              "Scramble for Africa: Marks Germany's emergence as an imperial rival under Bismarck in 1884–1885.",
              'British entitlement: Reflects the assumption among British elites that unclaimed territories naturally belonged to Britain.',
              "Early colonial tension: Shows that Anglo-German imperial friction began well before Wilhelm II's 'Place in the Sun' speech.",
            ],
            source_context:
              "At the 1884–1885 Berlin Conference, Chancellor Bismarck orchestrated the formal partition of Africa, acquiring Germany's first official protectorates in South-West Africa (Angra Pequena/Namibia), Togoland, Cameroon, and German New Guinea. British public opinion was startled by Germany's sudden entry into colonial expansion, portraying Bismarck as a greedy table-companion taking colonial territories Britain considered its natural sphere of influence. **Hinge Question:** How does Tenniel's depiction of Bismarck taking 'Angra Pequena' reveal Britain's resentment when other European powers claimed colonial territory?",
            teacher_notes: {
              source_context:
                "At the 1884–1885 Berlin Conference, Chancellor Bismarck orchestrated the formal partition of Africa, acquiring Germany's first official protectorates in South-West Africa (Angra Pequena/Namibia), Togoland, Cameroon, and German New Guinea. British public opinion was startled by Germany's sudden entry into colonial expansion, portraying Bismarck as a greedy table-companion taking colonial territories Britain considered its natural sphere of influence. **Hinge Question:** How does Tenniel's depiction of Bismarck taking 'Angra Pequena' reveal Britain's resentment when other European powers claimed colonial territory?",
            },
            id: 'gw_l2_src_a',
          },
          sources: [
            {
              letter: 'A',
              type: 'visual',
              title:
                'Source A (Political Cartoon): John Tenniel, "The Greedy Boy" (Punch, 10 January 1885)',
              image: '/units/great_war/assets/was_greedy_boy.png',
              src: '/units/great_war/assets/was_greedy_boy.png',
              is_artwork: true,
              caption:
                "John Tenniel's 1885 cartoon for Punch showing German Chancellor Otto von Bismarck carving large slices of colonial pudding ('Angra Pequena' and 'New Guinea'), leaving John Bull with an empty plate following the Berlin Conference.",
              citation:
                'Punch, or the London Charivari, London (Vol. 88, 10 January 1885, p. 19) / British Cartoon Archive.',
              context:
                "At the 1884–1885 Berlin Conference, Chancellor Bismarck orchestrated the formal partition of Africa, acquiring Germany's first official protectorates in South-West Africa (Angra Pequena/Namibia), Togoland, Cameroon, and German New Guinea. British public opinion was startled by Germany's sudden entry into colonial expansion, portraying Bismarck as a greedy table-companion taking colonial territories Britain considered its natural sphere of influence. **Hinge Question:** How does Tenniel's depiction of Bismarck taking 'Angra Pequena' reveal Britain's resentment when other European powers claimed colonial territory?",
              hinge_question:
                "How does Tenniel's depiction of Bismarck taking 'Angra Pequena' reveal Britain's resentment when other European powers claimed colonial territory?",
              question_badge: 'Source Inference',
              question:
                "What does this cartoon reveal about British reactions to Germany's sudden entry into colonial competition in 1884–1885?",
              enquiry_question:
                "What does this cartoon reveal about British reactions to Germany's sudden entry into colonial competition in 1884–1885?",
              model_answer:
                "The cartoon reveals British resentment and shock at German colonial claims, portraying Bismarck as an aggressive 'greedy boy' taking territories like Angra Pequena and New Guinea that Britain assumed it could dominate without competition.",
              discussion_ideas: [
                "Scramble for Africa: Marks Germany's emergence as an imperial rival under Bismarck in 1884–1885.",
                'British entitlement: Reflects the assumption among British elites that unclaimed territories naturally belonged to Britain.',
                "Early colonial tension: Shows that Anglo-German imperial friction began well before Wilhelm II's 'Place in the Sun' speech.",
              ],
              source_context:
                "At the 1884–1885 Berlin Conference, Chancellor Bismarck orchestrated the formal partition of Africa, acquiring Germany's first official protectorates in South-West Africa (Angra Pequena/Namibia), Togoland, Cameroon, and German New Guinea. British public opinion was startled by Germany's sudden entry into colonial expansion, portraying Bismarck as a greedy table-companion taking colonial territories Britain considered its natural sphere of influence. **Hinge Question:** How does Tenniel's depiction of Bismarck taking 'Angra Pequena' reveal Britain's resentment when other European powers claimed colonial territory?",
              teacher_notes: {
                source_context:
                  "At the 1884–1885 Berlin Conference, Chancellor Bismarck orchestrated the formal partition of Africa, acquiring Germany's first official protectorates in South-West Africa (Angra Pequena/Namibia), Togoland, Cameroon, and German New Guinea. British public opinion was startled by Germany's sudden entry into colonial expansion, portraying Bismarck as a greedy table-companion taking colonial territories Britain considered its natural sphere of influence. **Hinge Question:** How does Tenniel's depiction of Bismarck taking 'Angra Pequena' reveal Britain's resentment when other European powers claimed colonial territory?",
              },
              id: 'gw_l2_src_a',
            },
          ],
        },
        {
          act: 2,
          title: 'Kaiser Wilhelm II,"Weltpolitik" & "A Place in the Sun" (1890–1897)',
          text: '<span class="para-ref">[2.2]</span> Bismarck insisted Germany was a satisfied European power with no need for distant colonies. Pointing to a map, he declared: <em>"Here lies Russia, and here lies France, and we are in the middle; that is my map of Africa."</em> But in 1888, the young, ambitious **Kaiser Wilhelm II** took the German throne. Wilhelm wanted personal glory and dismissed Bismarck in 1890, an event dubbed "Dropping the Pilot."<br><br><span class="para-ref">[2.3]</span> The Kaiser demanded that Germany become a global superpower. In 1897, Bernhard von Bülow announced that Germany demanded its **"place in the sun" (Platz an der Sonne)**. This aggressive imperial policy was called **Weltpolitik** ("World Policy"). Because Britain and France already owned the richest territories, Wilhelm decided to build a mighty battlefleet, putting Germany on a direct collision course with Britain.',
          source: {
            letter: 'B',
            type: 'written',
            title:
              'Source B (Parliamentary Speech): Bernhard von Bülow, Speech on Germany\'s "Place in the Sun" (1897)',
            text: 'The days when Germans abandoned the land to one neighbor and the sea to another, reserving for themselves only the heavens where pure doctrine reigns—those days are over! We do not want to put anyone into the shade, but we too demand our place in the sun (*einen Platz an der Sonne*). In East Asia and Africa, we cannot and will not allow any foreign power to push us aside or monopolize economic trade.',
            caption:
              "Speech delivered by German Foreign Secretary (later Chancellor) Bernhard von Bülow to the Reichstag in Berlin, inaugurating Germany's aggressive global foreign policy (*Weltpolitik*).",
            citation:
              'Stenographische Berichte über die Verhandlungen des Deutschen Reichstages, 1897, Vol. 1, p. 60.',
            context:
              "In 1897, the German government abandoned Bismarck's cautious continental diplomacy in favour of Weltpolitik (world policy), demanding global colonies and prestige equivalent to Britain's. **Hinge Question:** How did the rhetoric of demanding a 'place in the sun' convince other European powers that Germany was no longer a satisfied power, but an aggressive challenger?",
            hinge_question:
              "How did the rhetoric of demanding a 'place in the sun' convince other European powers that Germany was no longer a satisfied power, but an aggressive challenger?",
            question_badge: 'Author’s Purpose',
            question:
              'Why did Bernhard von Bülow deliver this speech to the German Reichstag in December 1897?',
            enquiry_question:
              'Why did Bernhard von Bülow deliver this speech to the German Reichstag in December 1897?',
            model_answer:
              "Bülow delivered the speech to rally parliamentary and public support for expanding Germany's colonial empire and navy, declaring that Germany would aggressively challenge existing British and French dominance to secure global prestige.",
            discussion_ideas: [
              'Break with Bismarckian caution: Marked the end of seeing Germany as a satisfied European power.',
              'Imperial envy: Evident frustration that Britain and France had claimed the most lucrative territories.',
              'Domestic mobilisation: Used patriotic colonial rhetoric to unite disparate German political parties.',
            ],
            source_context:
              "In 1897, the German government abandoned Bismarck's cautious continental diplomacy in favour of Weltpolitik (world policy), demanding global colonies and prestige equivalent to Britain's. **Hinge Question:** How did the rhetoric of demanding a 'place in the sun' convince other European powers that Germany was no longer a satisfied power, but an aggressive challenger?",
            teacher_notes: {
              source_context:
                "In 1897, the German government abandoned Bismarck's cautious continental diplomacy in favour of Weltpolitik (world policy), demanding global colonies and prestige equivalent to Britain's. **Hinge Question:** How did the rhetoric of demanding a 'place in the sun' convince other European powers that Germany was no longer a satisfied power, but an aggressive challenger?",
            },
            id: 'gw_l2_src_b',
            src: '',
            image: '',
          },
          sources: [
            {
              letter: 'B',
              type: 'written',
              title:
                'Source B (Parliamentary Speech): Bernhard von Bülow, Speech on Germany\'s "Place in the Sun" (1897)',
              text: 'The days when Germans abandoned the land to one neighbor and the sea to another, reserving for themselves only the heavens where pure doctrine reigns—those days are over! We do not want to put anyone into the shade, but we too demand our place in the sun (*einen Platz an der Sonne*). In East Asia and Africa, we cannot and will not allow any foreign power to push us aside or monopolize economic trade.',
              caption:
                "Speech delivered by German Foreign Secretary (later Chancellor) Bernhard von Bülow to the Reichstag in Berlin, inaugurating Germany's aggressive global foreign policy (*Weltpolitik*).",
              citation:
                'Stenographische Berichte über die Verhandlungen des Deutschen Reichstages, 1897, Vol. 1, p. 60.',
              context:
                "In 1897, the German government abandoned Bismarck's cautious continental diplomacy in favour of Weltpolitik (world policy), demanding global colonies and prestige equivalent to Britain's. **Hinge Question:** How did the rhetoric of demanding a 'place in the sun' convince other European powers that Germany was no longer a satisfied power, but an aggressive challenger?",
              hinge_question:
                "How did the rhetoric of demanding a 'place in the sun' convince other European powers that Germany was no longer a satisfied power, but an aggressive challenger?",
              question_badge: 'Author’s Purpose',
              question:
                'Why did Bernhard von Bülow deliver this speech to the German Reichstag in December 1897?',
              enquiry_question:
                'Why did Bernhard von Bülow deliver this speech to the German Reichstag in December 1897?',
              model_answer:
                "Bülow delivered the speech to rally parliamentary and public support for expanding Germany's colonial empire and navy, declaring that Germany would aggressively challenge existing British and French dominance to secure global prestige.",
              discussion_ideas: [
                'Break with Bismarckian caution: Marked the end of seeing Germany as a satisfied European power.',
                'Imperial envy: Evident frustration that Britain and France had claimed the most lucrative territories.',
                'Domestic mobilisation: Used patriotic colonial rhetoric to unite disparate German political parties.',
              ],
              source_context:
                "In 1897, the German government abandoned Bismarck's cautious continental diplomacy in favour of Weltpolitik (world policy), demanding global colonies and prestige equivalent to Britain's. **Hinge Question:** How did the rhetoric of demanding a 'place in the sun' convince other European powers that Germany was no longer a satisfied power, but an aggressive challenger?",
              teacher_notes: {
                source_context:
                  "In 1897, the German government abandoned Bismarck's cautious continental diplomacy in favour of Weltpolitik (world policy), demanding global colonies and prestige equivalent to Britain's. **Hinge Question:** How did the rhetoric of demanding a 'place in the sun' convince other European powers that Germany was no longer a satisfied power, but an aggressive challenger?",
              },
              id: 'gw_l2_src_b',
              src: '',
              image: '',
            },
          ],
        },
        {
          act: 3,
          title: 'The First Moroccan Crisis & The Landing at Tangier (March 1905)',
          text: '<span class="para-ref">[2.3]</span> In April 1904, alarmed by rising German power, Britain and France signed the **Entente Cordiale** ("Friendly Understanding"). This was a colonial pact rather than a military alliance. France accepted British control of Egypt, while Britain accepted French influence over the Sultanate of **Morocco**. German leaders feared this new friendship would surround them.<br><br><span class="para-ref">[2.4]</span> On 31 March 1905, Kaiser Wilhelm II triggered the **First Moroccan Crisis**. Arriving in the Moroccan port of **Tangier** on a white horse, Wilhelm announced his support for the Sultan\'s independence. He challenged French control and demanded equal German trading rights. The Kaiser gambled that France would back down and that Britain would not support Paris. His gamble failed completely.',
          source: {
            letter: 'C',
            type: 'visual',
            title:
              'Source C (Archival Cartography): Walter Crane, Imperial Federation Map of the World (1886)',
            image: '/units/great_war/assets/map_lesson2_b.png',
            src: '/units/great_war/assets/map_lesson2_b.png',
            caption:
              "Walter Crane's iconic 1886 map for The Graphic, illustrating the vast global expanse of the British Empire (shaded in red), Britannia seated on the globe, and imperial statistics compiled by Captain J.C.R. Colomb.",
            citation:
              'The Graphic, London (24 July 1886) / Norman B. Leventhal Map Center, Boston Public Library (Call No. G3201.F7 1886 .C7).',
            context:
              "By the late 19th century, Great Britain governed an empire covering approximately a quarter of the globe and one-fifth of the world's population. When Kaiser Wilhelm II and Chancellor Bülow demanded Germany's 'place in the sun' in the late 1890s, they looked with intense envy at British global dominance illustrated in imperial maps like Crane's, feeling that Germany was confined to Central Europe while Britain monopolized global commerce and colonies. **Hinge Question:** Why did the overwhelming visual reality of the British Empire across the globe make German leaders believe that peaceful commercial expansion was impossible without challenging British hegemony?",
            hinge_question:
              'Why did the overwhelming visual reality of the British Empire across the globe make German leaders believe that peaceful commercial expansion was impossible without challenging British hegemony?',
            question_badge: 'Cartographic Evidence',
            question:
              "What does this map reveal about why Imperial Germany felt 'in the shade' during the late nineteenth-century Scramble for Empire?",
            enquiry_question:
              "What does this map reveal about why Imperial Germany felt 'in the shade' during the late nineteenth-century Scramble for Empire?",
            model_answer:
              'The map illustrates that the British Empire already encompassed a vast global network across every ocean—including Canada, India, Australia, and key African territories—demonstrating to German leaders that the most valuable colonial and maritime positions were already monopolized by Britain.',
            discussion_ideas: [
              'Global dominance: The British Empire colored pink across five continents left virtually no room for newly unified nations like Germany.',
              "Imperial envy: Explains German rhetoric about wanting 'our place in the sun' rather than remaining in Britain's shadow.",
              'Naval dependency: Emphasizes why an empire of this scale required the Royal Navy and why German naval expansion was seen as an existential threat.',
            ],
            source_context:
              "By the late 19th century, Great Britain governed an empire covering approximately a quarter of the globe and one-fifth of the world's population. When Kaiser Wilhelm II and Chancellor Bülow demanded Germany's 'place in the sun' in the late 1890s, they looked with intense envy at British global dominance illustrated in imperial maps like Crane's, feeling that Germany was confined to Central Europe while Britain monopolized global commerce and colonies. **Hinge Question:** Why did the overwhelming visual reality of the British Empire across the globe make German leaders believe that peaceful commercial expansion was impossible without challenging British hegemony?",
            teacher_notes: {
              source_context:
                "By the late 19th century, Great Britain governed an empire covering approximately a quarter of the globe and one-fifth of the world's population. When Kaiser Wilhelm II and Chancellor Bülow demanded Germany's 'place in the sun' in the late 1890s, they looked with intense envy at British global dominance illustrated in imperial maps like Crane's, feeling that Germany was confined to Central Europe while Britain monopolized global commerce and colonies. **Hinge Question:** Why did the overwhelming visual reality of the British Empire across the globe make German leaders believe that peaceful commercial expansion was impossible without challenging British hegemony?",
            },
            id: 'gw_l2_src_c',
          },
          sources: [
            {
              letter: 'C',
              type: 'visual',
              title:
                'Source C (Archival Cartography): Walter Crane, Imperial Federation Map of the World (1886)',
              image: '/units/great_war/assets/map_lesson2_b.png',
              src: '/units/great_war/assets/map_lesson2_b.png',
              caption:
                "Walter Crane's iconic 1886 map for The Graphic, illustrating the vast global expanse of the British Empire (shaded in red), Britannia seated on the globe, and imperial statistics compiled by Captain J.C.R. Colomb.",
              citation:
                'The Graphic, London (24 July 1886) / Norman B. Leventhal Map Center, Boston Public Library (Call No. G3201.F7 1886 .C7).',
              context:
                "By the late 19th century, Great Britain governed an empire covering approximately a quarter of the globe and one-fifth of the world's population. When Kaiser Wilhelm II and Chancellor Bülow demanded Germany's 'place in the sun' in the late 1890s, they looked with intense envy at British global dominance illustrated in imperial maps like Crane's, feeling that Germany was confined to Central Europe while Britain monopolized global commerce and colonies. **Hinge Question:** Why did the overwhelming visual reality of the British Empire across the globe make German leaders believe that peaceful commercial expansion was impossible without challenging British hegemony?",
              hinge_question:
                'Why did the overwhelming visual reality of the British Empire across the globe make German leaders believe that peaceful commercial expansion was impossible without challenging British hegemony?',
              question_badge: 'Cartographic Evidence',
              question:
                "What does this map reveal about why Imperial Germany felt 'in the shade' during the late nineteenth-century Scramble for Empire?",
              enquiry_question:
                "What does this map reveal about why Imperial Germany felt 'in the shade' during the late nineteenth-century Scramble for Empire?",
              model_answer:
                'The map illustrates that the British Empire already encompassed a vast global network across every ocean—including Canada, India, Australia, and key African territories—demonstrating to German leaders that the most valuable colonial and maritime positions were already monopolized by Britain.',
              discussion_ideas: [
                'Global dominance: The British Empire colored pink across five continents left virtually no room for newly unified nations like Germany.',
                "Imperial envy: Explains German rhetoric about wanting 'our place in the sun' rather than remaining in Britain's shadow.",
                'Naval dependency: Emphasizes why an empire of this scale required the Royal Navy and why German naval expansion was seen as an existential threat.',
              ],
              source_context:
                "By the late 19th century, Great Britain governed an empire covering approximately a quarter of the globe and one-fifth of the world's population. When Kaiser Wilhelm II and Chancellor Bülow demanded Germany's 'place in the sun' in the late 1890s, they looked with intense envy at British global dominance illustrated in imperial maps like Crane's, feeling that Germany was confined to Central Europe while Britain monopolized global commerce and colonies. **Hinge Question:** Why did the overwhelming visual reality of the British Empire across the globe make German leaders believe that peaceful commercial expansion was impossible without challenging British hegemony?",
              teacher_notes: {
                source_context:
                  "By the late 19th century, Great Britain governed an empire covering approximately a quarter of the globe and one-fifth of the world's population. When Kaiser Wilhelm II and Chancellor Bülow demanded Germany's 'place in the sun' in the late 1890s, they looked with intense envy at British global dominance illustrated in imperial maps like Crane's, feeling that Germany was confined to Central Europe while Britain monopolized global commerce and colonies. **Hinge Question:** Why did the overwhelming visual reality of the British Empire across the globe make German leaders believe that peaceful commercial expansion was impossible without challenging British hegemony?",
              },
              id: 'gw_l2_src_c',
            },
          ],
        },
        {
          act: 4,
          title: 'The Algeciras Conference & German Diplomatic Isolation (1906)',
          text: '<span class="para-ref">[2.4]</span> To resolve the Moroccan standoff, Germany demanded an international conference, expecting global support. In January 1906, diplomats met at the **Algeciras Conference** in southern Spain. The meeting ended in complete humiliation for Germany.<br><br><span class="para-ref">[2.5]</span> Instead of splitting Britain and France, German pressure pushed them closer together. British Foreign Secretary Sir Edward Grey firmly backed France. Russia, Italy, Spain, and the United States all voted to give France control over Moroccan police and banking. Only Austria-Hungary voted alongside Germany. Kaiser Wilhelm II left Algeciras furious. He was now convinced that the Great Powers were conspiring to encircle Germany, a paranoid fear known as **Einkreisung** (encirclement).',
          image: '/units/great_war/assets/sms_panther_agadir_1911.jpg',
          image_alt:
            'Archival photograph of the German Imperial Navy gunboat SMS Panther deployed to Agadir harbour in July 1911',
          caption:
            "The German gunboat SMS Panther anchored off the Moroccan port of Agadir in July 1911, a classic display of aggressive 'gunboat diplomacy' that precipitated the Second Moroccan Crisis.",
          source: {
            letter: 'D',
            type: 'written',
            title:
              'Source D (Imperial Telegram): Kaiser Wilhelm II, Telegram from Tangier to Chancellor Bülow (1905)',
            text: "Today I visited the Sultan's representative in Tangier and announced in person that I regard the Sultan of Morocco as an absolutely free and independent sovereign, subject to no foreign control. I declared that Germany insists upon equal commercial rights for all nations, and will never suffer any other power [France] to establish an exclusive protectorate here without international consent.",
            caption:
              "Kaiser Wilhelm II's official dispatch describing his provocative visit to Tangier, Morocco, designed to test and break the newly signed 1904 Anglo-French Entente Cordiale.",
            citation:
              'Die Große Politik der Europäischen Kabinette 1871–1914, Vol. 20, Part 2, Document 6589.',
            context:
              "In 1905, Germany provoked the First Moroccan Crisis by landing Kaiser Wilhelm II at Tangier to champion Moroccan independence against French colonial claims. Germany hoped to expose the 1904 Entente Cordiale as weak; instead, the crisis backfired and drew Britain and France closer together. **Hinge Question:** Why did the Kaiser's dramatic intervention at Tangier ultimately strengthen Anglo-French military cooperation instead of fracturing it?",
            hinge_question:
              "Why did the Kaiser's dramatic intervention at Tangier ultimately strengthen Anglo-French military cooperation instead of fracturing it?",
            question_badge: 'Source Inference',
            question:
              "What does this dispatch reveal about Kaiser Wilhelm II's underlying strategy during the First Moroccan Crisis?",
            enquiry_question:
              "What does this dispatch reveal about Kaiser Wilhelm II's underlying strategy during the First Moroccan Crisis?",
            model_answer:
              'The dispatch reveals that the Kaiser used the pretence of Moroccan independence to directly challenge French colonial expansion, aiming to humiliate France and test whether Britain would honour its diplomatic support.',
            discussion_ideas: [
              'Testing the Entente: Germany believed Britain would not risk a war over French colonial ambitions in North Africa.',
              "Public posturing: Wilhelm II's theatrical arrival on a white horse created intense international drama.",
              'Diplomatic misfire: Rather than isolating France, only Austria-Hungary supported Germany at the resulting Algeciras Conference.',
            ],
            source_context:
              "In 1905, Germany provoked the First Moroccan Crisis by landing Kaiser Wilhelm II at Tangier to champion Moroccan independence against French colonial claims. Germany hoped to expose the 1904 Entente Cordiale as weak; instead, the crisis backfired and drew Britain and France closer together. **Hinge Question:** Why did the Kaiser's dramatic intervention at Tangier ultimately strengthen Anglo-French military cooperation instead of fracturing it?",
            teacher_notes: {
              source_context:
                "In 1905, Germany provoked the First Moroccan Crisis by landing Kaiser Wilhelm II at Tangier to champion Moroccan independence against French colonial claims. Germany hoped to expose the 1904 Entente Cordiale as weak; instead, the crisis backfired and drew Britain and France closer together. **Hinge Question:** Why did the Kaiser's dramatic intervention at Tangier ultimately strengthen Anglo-French military cooperation instead of fracturing it?",
            },
            id: 'gw_l2_src_d',
            src: '',
            image: '',
          },
          sources: [
            {
              letter: 'D',
              type: 'written',
              title:
                'Source D (Imperial Telegram): Kaiser Wilhelm II, Telegram from Tangier to Chancellor Bülow (1905)',
              text: "Today I visited the Sultan's representative in Tangier and announced in person that I regard the Sultan of Morocco as an absolutely free and independent sovereign, subject to no foreign control. I declared that Germany insists upon equal commercial rights for all nations, and will never suffer any other power [France] to establish an exclusive protectorate here without international consent.",
              caption:
                "Kaiser Wilhelm II's official dispatch describing his provocative visit to Tangier, Morocco, designed to test and break the newly signed 1904 Anglo-French Entente Cordiale.",
              citation:
                'Die Große Politik der Europäischen Kabinette 1871–1914, Vol. 20, Part 2, Document 6589.',
              context:
                "In 1905, Germany provoked the First Moroccan Crisis by landing Kaiser Wilhelm II at Tangier to champion Moroccan independence against French colonial claims. Germany hoped to expose the 1904 Entente Cordiale as weak; instead, the crisis backfired and drew Britain and France closer together. **Hinge Question:** Why did the Kaiser's dramatic intervention at Tangier ultimately strengthen Anglo-French military cooperation instead of fracturing it?",
              hinge_question:
                "Why did the Kaiser's dramatic intervention at Tangier ultimately strengthen Anglo-French military cooperation instead of fracturing it?",
              question_badge: 'Source Inference',
              question:
                "What does this dispatch reveal about Kaiser Wilhelm II's underlying strategy during the First Moroccan Crisis?",
              enquiry_question:
                "What does this dispatch reveal about Kaiser Wilhelm II's underlying strategy during the First Moroccan Crisis?",
              model_answer:
                'The dispatch reveals that the Kaiser used the pretence of Moroccan independence to directly challenge French colonial expansion, aiming to humiliate France and test whether Britain would honour its diplomatic support.',
              discussion_ideas: [
                'Testing the Entente: Germany believed Britain would not risk a war over French colonial ambitions in North Africa.',
                "Public posturing: Wilhelm II's theatrical arrival on a white horse created intense international drama.",
                'Diplomatic misfire: Rather than isolating France, only Austria-Hungary supported Germany at the resulting Algeciras Conference.',
              ],
              source_context:
                "In 1905, Germany provoked the First Moroccan Crisis by landing Kaiser Wilhelm II at Tangier to champion Moroccan independence against French colonial claims. Germany hoped to expose the 1904 Entente Cordiale as weak; instead, the crisis backfired and drew Britain and France closer together. **Hinge Question:** Why did the Kaiser's dramatic intervention at Tangier ultimately strengthen Anglo-French military cooperation instead of fracturing it?",
              teacher_notes: {
                source_context:
                  "In 1905, Germany provoked the First Moroccan Crisis by landing Kaiser Wilhelm II at Tangier to champion Moroccan independence against French colonial claims. Germany hoped to expose the 1904 Entente Cordiale as weak; instead, the crisis backfired and drew Britain and France closer together. **Hinge Question:** Why did the Kaiser's dramatic intervention at Tangier ultimately strengthen Anglo-French military cooperation instead of fracturing it?",
              },
              id: 'gw_l2_src_d',
              src: '',
              image: '',
            },
          ],
        },
        {
          act: 5,
          title: 'The Second Moroccan Crisis: The Panther at Agadir & Mansion House (July 1911)',
          text: '<span class="para-ref">[2.5]</span> In spring 1911, Moroccan tribes rebelled against the Sultan in Fez. France sent troops to restore order. Accusing France of breaking the Algeciras agreement, Germany used **gunboat diplomacy**. On **1 July 1911**, Germany sent the gunboat **SMS Panther** to the Atlantic port of **Agadir**, trying to force France into handing over the French Congo.<br><br><span class="para-ref">[2.6]</span> The gunboat provoked outrage in London because Agadir lay near vital British shipping routes. On 21 July 1911, British Chancellor **David Lloyd George** gave his famous **Mansion House Speech**. He warned that Britain would fight rather than accept peace through national humiliation. Germany backed down and accepted a small piece of the Congo. The crisis backfired on Germany: Britain and France were pushed into secret joint military talks to defend against a German invasion.',
          source: {
            letter: 'E',
            type: 'written',
            title:
              'Source E (Ministerial Speech): David Lloyd George, The Mansion House Speech (21 July 1911)',
            text: "I am also bound to say this: that I believe it is essential in the highest interests, not merely of this country, but of the world, that Britain should at all hazards maintain her place and her prestige amongst the Great Powers of the world... If a situation were to be forced upon us in which peace could only be preserved by the surrender of the great and beneficent position Britain has won with centuries of heroism and achievement, by allowing Britain to be treated where her interests were vitally affected as if she didn't count in the Cabinet of Nations, then I say emphatically that peace at that price would be a humiliation intolerable for a great country like ours to endure.",
            caption:
              "David Lloyd George addressing the annual Bankers' Dinner at Mansion House, delivering an unambiguous public warning to Germany following the dispatch of the gunboat Panther to Agadir.",
            citation: 'The Times (London), 22 July 1911, p. 7; Hansard Parliamentary Debates.',
            context:
              "During the Second Moroccan Crisis (1911), Chancellor David Lloyd George—previously regarded as a pacifist-leaning Radical—delivered a blistering public warning that Britain would fight rather than allow Germany to bully France or threaten maritime routes. **Hinge Question:** Why was Lloyd George's Mansion House speech a decisive psychological turning point in the road to the Great War?",
            hinge_question:
              "Why was Lloyd George's Mansion House speech a decisive psychological turning point in the road to the Great War?",
            question_badge: 'Reliability & Provenance',
            question:
              "What makes Lloyd George's Mansion House speech particularly significant as evidence of British foreign policy in 1911?",
            enquiry_question:
              "What makes Lloyd George's Mansion House speech particularly significant as evidence of British foreign policy in 1911?",
            model_answer:
              'The speech is exceptionally significant because Lloyd George was a leading radical politician who had previously opposed war; his firm warning demonstrated that the entire British Cabinet was unified in standing militarily with France against German intimidation.',
            discussion_ideas: [
              'Cabinet solidarity: Ended German hopes that Liberal internal divisions would prevent British action.',
              'Deterrence signaling: Clearly staked British prestige on opposing unilateral German expansion in the Atlantic.',
              'German domestic backlash: German nationalists felt publicly insulted and demanded accelerated naval construction.',
            ],
            source_context:
              "During the Second Moroccan Crisis (1911), Chancellor David Lloyd George—previously regarded as a pacifist-leaning Radical—delivered a blistering public warning that Britain would fight rather than allow Germany to bully France or threaten maritime routes. **Hinge Question:** Why was Lloyd George's Mansion House speech a decisive psychological turning point in the road to the Great War?",
            teacher_notes: {
              source_context:
                "During the Second Moroccan Crisis (1911), Chancellor David Lloyd George—previously regarded as a pacifist-leaning Radical—delivered a blistering public warning that Britain would fight rather than allow Germany to bully France or threaten maritime routes. **Hinge Question:** Why was Lloyd George's Mansion House speech a decisive psychological turning point in the road to the Great War?",
            },
            id: 'gw_l2_src_e',
            src: '',
            image: '',
          },
          sources: [
            {
              letter: 'E',
              type: 'written',
              title:
                'Source E (Ministerial Speech): David Lloyd George, The Mansion House Speech (21 July 1911)',
              text: "I am also bound to say this: that I believe it is essential in the highest interests, not merely of this country, but of the world, that Britain should at all hazards maintain her place and her prestige amongst the Great Powers of the world... If a situation were to be forced upon us in which peace could only be preserved by the surrender of the great and beneficent position Britain has won with centuries of heroism and achievement, by allowing Britain to be treated where her interests were vitally affected as if she didn't count in the Cabinet of Nations, then I say emphatically that peace at that price would be a humiliation intolerable for a great country like ours to endure.",
              caption:
                "David Lloyd George addressing the annual Bankers' Dinner at Mansion House, delivering an unambiguous public warning to Germany following the dispatch of the gunboat Panther to Agadir.",
              citation: 'The Times (London), 22 July 1911, p. 7; Hansard Parliamentary Debates.',
              context:
                "During the Second Moroccan Crisis (1911), Chancellor David Lloyd George—previously regarded as a pacifist-leaning Radical—delivered a blistering public warning that Britain would fight rather than allow Germany to bully France or threaten maritime routes. **Hinge Question:** Why was Lloyd George's Mansion House speech a decisive psychological turning point in the road to the Great War?",
              hinge_question:
                "Why was Lloyd George's Mansion House speech a decisive psychological turning point in the road to the Great War?",
              question_badge: 'Reliability & Provenance',
              question:
                "What makes Lloyd George's Mansion House speech particularly significant as evidence of British foreign policy in 1911?",
              enquiry_question:
                "What makes Lloyd George's Mansion House speech particularly significant as evidence of British foreign policy in 1911?",
              model_answer:
                'The speech is exceptionally significant because Lloyd George was a leading radical politician who had previously opposed war; his firm warning demonstrated that the entire British Cabinet was unified in standing militarily with France against German intimidation.',
              discussion_ideas: [
                'Cabinet solidarity: Ended German hopes that Liberal internal divisions would prevent British action.',
                'Deterrence signaling: Clearly staked British prestige on opposing unilateral German expansion in the Atlantic.',
                'German domestic backlash: German nationalists felt publicly insulted and demanded accelerated naval construction.',
              ],
              source_context:
                "During the Second Moroccan Crisis (1911), Chancellor David Lloyd George—previously regarded as a pacifist-leaning Radical—delivered a blistering public warning that Britain would fight rather than allow Germany to bully France or threaten maritime routes. **Hinge Question:** Why was Lloyd George's Mansion House speech a decisive psychological turning point in the road to the Great War?",
              teacher_notes: {
                source_context:
                  "During the Second Moroccan Crisis (1911), Chancellor David Lloyd George—previously regarded as a pacifist-leaning Radical—delivered a blistering public warning that Britain would fight rather than allow Germany to bully France or threaten maritime routes. **Hinge Question:** Why was Lloyd George's Mansion House speech a decisive psychological turning point in the road to the Great War?",
              },
              id: 'gw_l2_src_e',
              src: '',
              image: '',
            },
          ],
        },
      ],
      pair_share: {
        prompt:
          "Discuss with your partner: Did Kaiser Wilhelm II's 'Weltpolitik' make war inevitable, or did Britain and France overreact to legitimate German colonial ambitions?",
        think: 'Spend 1 minute reflecting on the Moroccan Crises and the Kaiser’s goals.',
        pair: 'Take turns debating with your partner whether Germany was unfairly denied colonies.',
        share: 'Be prepared to report your partner’s best argument to the class.',
      },
      tasks: [
        {
          type: 'short_answer',
          topic: 'Question 1: Describe Two Features [4 marks • 5 mins]',
          qNum: 1,
          question:
            'Describe two features of the 1911 Agadir Crisis (Second Moroccan Crisis). [4 marks]',
          starter: 'One feature of the 1911 Agadir Crisis was... A second feature was...',
          model_answer:
            'One feature of the 1911 Agadir Crisis was Germany’s provocative deployment of the gunboat SMS Panther to the Moroccan port of Agadir, using military intimidation ("gunboat diplomacy") to challenge French colonial dominance and demand territorial compensation in the Congo. A second feature was the robust British diplomatic reaction, notably David Lloyd George’s Mansion House speech, which publicly warned Germany that Britain would fight alongside France rather than allow its maritime interests to be undermined, resulting in secret Anglo-French joint military staff talks.',
        },
        {
          type: 'extended_writing',
          topic: 'Question 2: Explain One Consequence [4 marks • 5 mins]',
          question:
            'Explain one consequence of the Moroccan Crises for relations between Great Britain and France. [4 marks]',
          stimulus: ['The 1906 Algeciras Conference', 'The 1911 Mansion House Speech'],
          hints: [
            {
              label: 'Point',
              prompt:
                'State a decisive consequence of the Moroccan Crises for Anglo-French relations (e.g., transforming a loose colonial agreement into a binding military partnership).',
            },
            {
              label: 'Evidence',
              prompt:
                'Deploy specific historical evidence: British backing of France at Algeciras (1906), Lloyd George’s Mansion House speech (1911), or secret joint military staff talks.',
            },
            {
              label: 'Explanation',
              prompt:
                'Explain HOW German imperial bullying backfired by convincing British and French leaders that German Weltpolitik posed a mortal threat to European security.',
            },
            {
              label: 'Link',
              prompt:
                'Conclude by showing how this solidified the Entente Cordiale into a de facto military alliance before 1914.',
            },
          ],
          scaffolding: {
            structure_strip: [
              {
                col: 'Consequence & Evidence',
                prompt:
                  'Identify how German aggression at Tangier and Agadir drove Britain and France together.',
                starter:
                  'A decisive consequence of the Moroccan Crises was the dramatic strengthening of diplomatic and military ties between Great Britain and France...',
              },
              {
                col: 'Causal Explanation & Impact',
                prompt:
                  'Explain how the 1906 Algeciras Conference and the 1911 Mansion House speech established joint military planning.',
                starter:
                  'This occurred because Kaiser Wilhelm II’s attempts to test the Entente Cordiale completely backfired...',
              },
            ],
            sentence_starters: [
              'A decisive consequence of the Moroccan Crises was...',
              'This happened because Kaiser Wilhelm II attempted to...',
              'At the 1906 Algeciras Conference, Britain firmly supported France by...',
              'Following the dispatch of the Panther in 1911, David Lloyd George warned that...',
              'Consequently, the crises transformed a colonial agreement into...',
            ],
            connective_bank: [
              'A decisive consequence was...',
              'This happened because...',
              'As a direct result...',
              'Consequently, this led to...',
              'Ultimately, this meant that...',
            ],
            word_bank: [
              'Kaiser Wilhelm II',
              'Weltpolitik',
              'Tangier (1905)',
              'Algeciras Conference',
              'Panther at Agadir (1911)',
              'David Lloyd George',
              'Mansion House Speech',
              'Entente Cordiale',
            ],
          },
          model_answer:
            'A decisive consequence of the Moroccan Crises was the fundamental transformation of the 1904 Anglo-French Entente Cordiale from a loose colonial understanding into a solid, unshakeable military partnership. Rather than driving Britain and France apart as Kaiser Wilhelm II had intended, German bullying at Tangier in 1905 and Agadir in 1911 convinced British statesmen that German Weltpolitik sought European hegemony. At the 1906 Algeciras Conference, Britain firmly backed France, leaving Germany diplomatically isolated with only Austria-Hungary for support. Following the 1911 Agadir Crisis and Lloyd George’s defiant Mansion House speech, the two nations initiated secret joint military staff conversations and agreed to divide naval responsibilities—with the Royal Navy safeguarding the North Sea and the French Navy securing the Mediterranean—locking both powers into an informal military alliance.',
        },
      ],
      quiz: [
        {
          q: 'What term describes the rapid colonization of Africa by European powers in the late 19th century?',
          a: 'The Scramble for Africa',
          options: [
            'The Great Game',
            'Manifest Destiny',
            'The African Partition',
            'The Scramble for Africa',
          ],
        },
        {
          q: "Which German leader famously stated that Germany wanted its 'place in the sun'?",
          a: 'Kaiser Wilhelm II',
          options: [
            'Otto von Bismarck',
            'Adolf Hitler',
            'Kaiser Wilhelm II',
            'Paul von Hindenburg',
          ],
        },
        {
          q: 'In which year did the First Moroccan Crisis occur?',
          a: '1905',
          options: ['1911', '1905', '1898', '1914'],
        },
        {
          q: 'What was the purpose of the 1884 Berlin Conference?',
          a: 'To regulate European colonization and trade in Africa',
          options: [
            'To regulate European colonization and trade in Africa',
            'To form a military alliance against Britain',
            'To ban slavery worldwide',
            'To divide Asia among European powers',
          ],
        },
        {
          q: 'Which European power controlled the largest empire in Africa by 1914?',
          a: 'Britain',
          options: ['Britain', 'France', 'Germany', 'Belgium'],
        },
        {
          q: "Why did Kaiser Wilhelm II demand a 'place in the sun'?",
          a: 'He wanted Germany to have a global empire like Britain and France',
          options: [
            'He wanted to control the Mediterranean Sea',
            'He wanted Germany to have a global empire like Britain and France',
            'He wanted a holiday home in Africa',
            'He wanted to conquer South America',
          ],
        },
        {
          q: 'What happened during the First Moroccan Crisis (1905)?',
          a: 'The Kaiser visited Tangier and declared support for Moroccan independence',
          options: [
            'France surrendered Morocco to Britain',
            'The local sultan defeated the French army',
            'Germany invaded Morocco',
            'The Kaiser visited Tangier and declared support for Moroccan independence',
          ],
        },
        {
          q: 'What was the main result of the Algeciras Conference (1906)?',
          a: 'Germany was humiliated and France was given control of Moroccan police',
          options: [
            'Germany gained full control of Morocco',
            'Morocco became fully independent',
            'Germany was humiliated and France was given control of Moroccan police',
            'Britain took over Morocco',
          ],
        },
        {
          q: 'What sparked the Second Moroccan Crisis (Agadir Crisis) in 1911?',
          a: 'Germany sent the gunboat Panther to the port of Agadir',
          options: [
            'Germany sent the gunboat Panther to the port of Agadir',
            'France declared war on Germany',
            'Britain blockaded the Moroccan coast',
            'Moroccans attacked German tourists',
          ],
        },
        {
          q: 'How did the Agadir Crisis end?',
          a: 'Germany backed down after being given a small strip of the Congo',
          options: [
            'Germany successfully conquered Morocco',
            'Germany backed down after being given a small strip of the Congo',
            'Britain declared war on Germany',
            'France was forced to leave Africa',
          ],
        },
        {
          q: 'What effect did the Moroccan Crises have on Anglo-French relations?',
          a: 'It pushed Britain and France closer together in a strong alliance',
          options: [
            'It caused a war between them',
            'It made Britain ally with Germany instead',
            'It led to Britain abandoning its empire',
            'It pushed Britain and France closer together in a strong alliance',
          ],
        },
      ],
      prologue:
        "By the late nineteenth century, European empires raced to claim colonies across Africa and Asia. When Kaiser Wilhelm II demanded Germany’s 'place in the sun', colonial rivalries erupted into tense showdowns in Morocco. Was imperial greed in distant lands the spark that poisoned European relations before 1914?",
      exam_practice: {
        title: 'Key Stage 3 Disciplinary Writing: Imperial Rivalry & The Moroccan Crises',
        tariff: '8 marks (Feature Drill [4m] & Consequence Writing [4m])',
        questions: [
          {
            tariff: '4 marks',
            type: 'feature_drills_4m',
            question:
              'Describe two features of the 1911 Agadir Crisis (Second Moroccan Crisis). [4 marks]',
            prompt:
              'Identify two distinct features of the 1911 Agadir Crisis. For each feature, provide a clear identification followed by supporting factual knowledge.',
            model:
              'Feature 1: One key feature was Germany’s aggressive deployment of naval gunboat diplomacy.<br>Detail: In July 1911, the German government dispatched the gunboat SMS Panther to the Moroccan Atlantic port of Agadir under the pretext of protecting German commercial firms, attempting to intimidate France during French troop deployments to Fez.<br><br>Feature 2: A second key feature was the firm diplomatic intervention of Great Britain in support of France.<br>Detail: British Chancellor David Lloyd George delivered his famous Mansion House speech warning that Britain would fight rather than allow Germany to bully European nations, prompting Britain to prepare the Royal Navy for war and forcing Germany to accept minor territorial concessions in the Congo.',
            scaffolding: {
              acronym: 'F1 + D1 • F2 + D2',
              acronym_title: '4-Mark Feature Drill Formula',
              steps: [
                {
                  letter: 'F1',
                  name: 'Feature 1 (SMS Panther Gunboat)',
                  prompt: 'Identify Germany sending SMS Panther to Agadir port.',
                  starter: 'One key feature was that...',
                },
                {
                  letter: 'D1',
                  name: 'Detail 1',
                  prompt:
                    'Add precise details (July 1911, Moroccan port, gunboat diplomacy, challenging France).',
                  starter: 'Specifically, this involved...',
                },
                {
                  letter: 'F2',
                  name: 'Feature 2 (British Lloyd George Intervention)',
                  prompt: 'Identify British backing for France in Mansion House speech.',
                  starter: 'A second key feature was...',
                },
                {
                  letter: 'D2',
                  name: 'Detail 2',
                  prompt:
                    'Add precise details (David Lloyd George, Mansion House speech, preparing Royal Navy, German retreat).',
                  starter: 'In particular, this meant that...',
                },
              ],
              sentence_starters: [
                'One key feature was that...',
                'Specifically, this involved...',
                'A second key feature was...',
                'In particular, this meant that...',
              ],
              connectives_bank: [
                'Agadir Crisis (1911)',
                'SMS Panther',
                'gunboat diplomacy',
                'David Lloyd George',
                'Mansion House speech',
                'Entente Cordiale',
                'Anglo-French naval agreement',
              ],
            },
          },
          {
            tariff: '4 marks',
            type: 'consequence_4m',
            question:
              'Explain one consequence of the Moroccan Crises for relations between Great Britain and France. [4 marks]',
            prompt:
              'Focus on how German aggression in Morocco solidified the Entente Cordiale into a de facto military and naval alliance with joint naval agreements in 1912.',
            model:
              'One significant consequence of the Moroccan Crises was the transformation of the 1904 Entente Cordiale from a loose colonial agreement into a binding, de facto military alliance between Great Britain and France. Kaiser Wilhelm II’s repeated attempts to split the Entente—at Tangier in 1905 and Agadir in 1911—had the exact opposite effect: British leaders became convinced that Germany was an aggressive power seeking European naval domination. Consequently, in 1912, Britain and France signed a secret naval agreement where the British Royal Navy agreed to protect the English Channel and French northern coastline, while the French navy concentrated its battleships in the Mediterranean. As a direct result, Britain became morally and strategically committed to defending France in the event of German aggression in 1914.',
            scaffolding: {
              acronym: 'P-F-C (Point • Fact • Consequence)',
              acronym_title: 'High-Yield Consequence Formula (1 Concise Paragraph)',
              steps: [
                {
                  letter: 'POINT',
                  name: 'Identify Consequence',
                  prompt:
                    'State the transformation of the Entente into a binding military/naval partnership.',
                  starter: 'One significant consequence of the Moroccan Crises was...',
                },
                {
                  letter: 'FACT',
                  name: 'Historical Evidence',
                  prompt:
                    'Cite the 1912 Anglo-French naval agreement (Channel defense and Mediterranean).',
                  starter: 'In particular, following the Agadir crisis...',
                },
                {
                  letter: 'CONSEQUENCE',
                  name: 'Explain Result',
                  prompt:
                    'Explain how this committed Britain morally and strategically to enter the war in 1914.',
                  starter: 'Consequently, this directly resulted in...',
                },
              ],
              sentence_starters: [
                'One significant consequence of the Moroccan Crises was that...',
                'In particular, this led Britain and France to...',
                'As a direct result...',
                'Consequently, this solidified Anglo-French relations because...',
              ],
              connectives_bank: [
                'Entente Cordiale',
                'Tangier (1905)',
                'Agadir (1911)',
                '1912 naval agreement',
                'Channel defense',
                'military commitment',
              ],
            },
          },
        ],
      },
      sources: [
        {
          letter: 'A',
          type: 'visual',
          title:
            'Source A (Political Cartoon): John Tenniel, "The Greedy Boy" (Punch, 10 January 1885)',
          image: '/units/great_war/assets/was_greedy_boy.png',
          src: '/units/great_war/assets/was_greedy_boy.png',
          is_artwork: true,
          caption:
            "John Tenniel's 1885 cartoon for Punch showing German Chancellor Otto von Bismarck carving large slices of colonial pudding ('Angra Pequena' and 'New Guinea'), leaving John Bull with an empty plate following the Berlin Conference.",
          citation:
            'Punch, or the London Charivari, London (Vol. 88, 10 January 1885, p. 19) / British Cartoon Archive.',
          context:
            "At the 1884–1885 Berlin Conference, Chancellor Bismarck orchestrated the formal partition of Africa, acquiring Germany's first official protectorates in South-West Africa (Angra Pequena/Namibia), Togoland, Cameroon, and German New Guinea. British public opinion was startled by Germany's sudden entry into colonial expansion, portraying Bismarck as a greedy table-companion taking colonial territories Britain considered its natural sphere of influence. **Hinge Question:** How does Tenniel's depiction of Bismarck taking 'Angra Pequena' reveal Britain's resentment when other European powers claimed colonial territory?",
          hinge_question:
            "How does Tenniel's depiction of Bismarck taking 'Angra Pequena' reveal Britain's resentment when other European powers claimed colonial territory?",
          question_badge: 'Source Inference',
          question:
            "What does this cartoon reveal about British reactions to Germany's sudden entry into colonial competition in 1884–1885?",
          enquiry_question:
            "What does this cartoon reveal about British reactions to Germany's sudden entry into colonial competition in 1884–1885?",
          model_answer:
            "The cartoon reveals British resentment and shock at German colonial claims, portraying Bismarck as an aggressive 'greedy boy' taking territories like Angra Pequena and New Guinea that Britain assumed it could dominate without competition.",
          discussion_ideas: [
            "Scramble for Africa: Marks Germany's emergence as an imperial rival under Bismarck in 1884–1885.",
            'British entitlement: Reflects the assumption among British elites that unclaimed territories naturally belonged to Britain.',
            "Early colonial tension: Shows that Anglo-German imperial friction began well before Wilhelm II's 'Place in the Sun' speech.",
          ],
          source_context:
            "At the 1884–1885 Berlin Conference, Chancellor Bismarck orchestrated the formal partition of Africa, acquiring Germany's first official protectorates in South-West Africa (Angra Pequena/Namibia), Togoland, Cameroon, and German New Guinea. British public opinion was startled by Germany's sudden entry into colonial expansion, portraying Bismarck as a greedy table-companion taking colonial territories Britain considered its natural sphere of influence. **Hinge Question:** How does Tenniel's depiction of Bismarck taking 'Angra Pequena' reveal Britain's resentment when other European powers claimed colonial territory?",
          teacher_notes: {
            source_context:
              "At the 1884–1885 Berlin Conference, Chancellor Bismarck orchestrated the formal partition of Africa, acquiring Germany's first official protectorates in South-West Africa (Angra Pequena/Namibia), Togoland, Cameroon, and German New Guinea. British public opinion was startled by Germany's sudden entry into colonial expansion, portraying Bismarck as a greedy table-companion taking colonial territories Britain considered its natural sphere of influence. **Hinge Question:** How does Tenniel's depiction of Bismarck taking 'Angra Pequena' reveal Britain's resentment when other European powers claimed colonial territory?",
          },
          id: 'gw_l2_src_a',
        },
        {
          letter: 'B',
          type: 'written',
          title:
            'Source B (Parliamentary Speech): Bernhard von Bülow, Speech on Germany\'s "Place in the Sun" (1897)',
          text: 'The days when Germans abandoned the land to one neighbor and the sea to another, reserving for themselves only the heavens where pure doctrine reigns—those days are over! We do not want to put anyone into the shade, but we too demand our place in the sun (*einen Platz an der Sonne*). In East Asia and Africa, we cannot and will not allow any foreign power to push us aside or monopolize economic trade.',
          caption:
            "Speech delivered by German Foreign Secretary (later Chancellor) Bernhard von Bülow to the Reichstag in Berlin, inaugurating Germany's aggressive global foreign policy (*Weltpolitik*).",
          citation:
            'Stenographische Berichte über die Verhandlungen des Deutschen Reichstages, 1897, Vol. 1, p. 60.',
          context:
            "In 1897, the German government abandoned Bismarck's cautious continental diplomacy in favour of Weltpolitik (world policy), demanding global colonies and prestige equivalent to Britain's. **Hinge Question:** How did the rhetoric of demanding a 'place in the sun' convince other European powers that Germany was no longer a satisfied power, but an aggressive challenger?",
          hinge_question:
            "How did the rhetoric of demanding a 'place in the sun' convince other European powers that Germany was no longer a satisfied power, but an aggressive challenger?",
          question_badge: 'Author’s Purpose',
          question:
            'Why did Bernhard von Bülow deliver this speech to the German Reichstag in December 1897?',
          enquiry_question:
            'Why did Bernhard von Bülow deliver this speech to the German Reichstag in December 1897?',
          model_answer:
            "Bülow delivered the speech to rally parliamentary and public support for expanding Germany's colonial empire and navy, declaring that Germany would aggressively challenge existing British and French dominance to secure global prestige.",
          discussion_ideas: [
            'Break with Bismarckian caution: Marked the end of seeing Germany as a satisfied European power.',
            'Imperial envy: Evident frustration that Britain and France had claimed the most lucrative territories.',
            'Domestic mobilisation: Used patriotic colonial rhetoric to unite disparate German political parties.',
          ],
          source_context:
            "In 1897, the German government abandoned Bismarck's cautious continental diplomacy in favour of Weltpolitik (world policy), demanding global colonies and prestige equivalent to Britain's. **Hinge Question:** How did the rhetoric of demanding a 'place in the sun' convince other European powers that Germany was no longer a satisfied power, but an aggressive challenger?",
          teacher_notes: {
            source_context:
              "In 1897, the German government abandoned Bismarck's cautious continental diplomacy in favour of Weltpolitik (world policy), demanding global colonies and prestige equivalent to Britain's. **Hinge Question:** How did the rhetoric of demanding a 'place in the sun' convince other European powers that Germany was no longer a satisfied power, but an aggressive challenger?",
          },
          id: 'gw_l2_src_b',
          src: '',
          image: '',
        },
        {
          letter: 'C',
          type: 'visual',
          title:
            'Source C (Archival Cartography): Walter Crane, Imperial Federation Map of the World (1886)',
          image: '/units/great_war/assets/map_lesson2_b.png',
          src: '/units/great_war/assets/map_lesson2_b.png',
          caption:
            "Walter Crane's iconic 1886 map for The Graphic, illustrating the vast global expanse of the British Empire (shaded in red), Britannia seated on the globe, and imperial statistics compiled by Captain J.C.R. Colomb.",
          citation:
            'The Graphic, London (24 July 1886) / Norman B. Leventhal Map Center, Boston Public Library (Call No. G3201.F7 1886 .C7).',
          context:
            "By the late 19th century, Great Britain governed an empire covering approximately a quarter of the globe and one-fifth of the world's population. When Kaiser Wilhelm II and Chancellor Bülow demanded Germany's 'place in the sun' in the late 1890s, they looked with intense envy at British global dominance illustrated in imperial maps like Crane's, feeling that Germany was confined to Central Europe while Britain monopolized global commerce and colonies. **Hinge Question:** Why did the overwhelming visual reality of the British Empire across the globe make German leaders believe that peaceful commercial expansion was impossible without challenging British hegemony?",
          hinge_question:
            'Why did the overwhelming visual reality of the British Empire across the globe make German leaders believe that peaceful commercial expansion was impossible without challenging British hegemony?',
          question_badge: 'Cartographic Evidence',
          question:
            "What does this map reveal about why Imperial Germany felt 'in the shade' during the late nineteenth-century Scramble for Empire?",
          enquiry_question:
            "What does this map reveal about why Imperial Germany felt 'in the shade' during the late nineteenth-century Scramble for Empire?",
          model_answer:
            'The map illustrates that the British Empire already encompassed a vast global network across every ocean—including Canada, India, Australia, and key African territories—demonstrating to German leaders that the most valuable colonial and maritime positions were already monopolized by Britain.',
          discussion_ideas: [
            'Global dominance: The British Empire colored pink across five continents left virtually no room for newly unified nations like Germany.',
            "Imperial envy: Explains German rhetoric about wanting 'our place in the sun' rather than remaining in Britain's shadow.",
            'Naval dependency: Emphasizes why an empire of this scale required the Royal Navy and why German naval expansion was seen as an existential threat.',
          ],
          source_context:
            "By the late 19th century, Great Britain governed an empire covering approximately a quarter of the globe and one-fifth of the world's population. When Kaiser Wilhelm II and Chancellor Bülow demanded Germany's 'place in the sun' in the late 1890s, they looked with intense envy at British global dominance illustrated in imperial maps like Crane's, feeling that Germany was confined to Central Europe while Britain monopolized global commerce and colonies. **Hinge Question:** Why did the overwhelming visual reality of the British Empire across the globe make German leaders believe that peaceful commercial expansion was impossible without challenging British hegemony?",
          teacher_notes: {
            source_context:
              "By the late 19th century, Great Britain governed an empire covering approximately a quarter of the globe and one-fifth of the world's population. When Kaiser Wilhelm II and Chancellor Bülow demanded Germany's 'place in the sun' in the late 1890s, they looked with intense envy at British global dominance illustrated in imperial maps like Crane's, feeling that Germany was confined to Central Europe while Britain monopolized global commerce and colonies. **Hinge Question:** Why did the overwhelming visual reality of the British Empire across the globe make German leaders believe that peaceful commercial expansion was impossible without challenging British hegemony?",
          },
          id: 'gw_l2_src_c',
        },
        {
          letter: 'D',
          type: 'written',
          title:
            'Source D (Imperial Telegram): Kaiser Wilhelm II, Telegram from Tangier to Chancellor Bülow (1905)',
          text: "Today I visited the Sultan's representative in Tangier and announced in person that I regard the Sultan of Morocco as an absolutely free and independent sovereign, subject to no foreign control. I declared that Germany insists upon equal commercial rights for all nations, and will never suffer any other power [France] to establish an exclusive protectorate here without international consent.",
          caption:
            "Kaiser Wilhelm II's official dispatch describing his provocative visit to Tangier, Morocco, designed to test and break the newly signed 1904 Anglo-French Entente Cordiale.",
          citation:
            'Die Große Politik der Europäischen Kabinette 1871–1914, Vol. 20, Part 2, Document 6589.',
          context:
            "In 1905, Germany provoked the First Moroccan Crisis by landing Kaiser Wilhelm II at Tangier to champion Moroccan independence against French colonial claims. Germany hoped to expose the 1904 Entente Cordiale as weak; instead, the crisis backfired and drew Britain and France closer together. **Hinge Question:** Why did the Kaiser's dramatic intervention at Tangier ultimately strengthen Anglo-French military cooperation instead of fracturing it?",
          hinge_question:
            "Why did the Kaiser's dramatic intervention at Tangier ultimately strengthen Anglo-French military cooperation instead of fracturing it?",
          question_badge: 'Source Inference',
          question:
            "What does this dispatch reveal about Kaiser Wilhelm II's underlying strategy during the First Moroccan Crisis?",
          enquiry_question:
            "What does this dispatch reveal about Kaiser Wilhelm II's underlying strategy during the First Moroccan Crisis?",
          model_answer:
            'The dispatch reveals that the Kaiser used the pretence of Moroccan independence to directly challenge French colonial expansion, aiming to humiliate France and test whether Britain would honour its diplomatic support.',
          discussion_ideas: [
            'Testing the Entente: Germany believed Britain would not risk a war over French colonial ambitions in North Africa.',
            "Public posturing: Wilhelm II's theatrical arrival on a white horse created intense international drama.",
            'Diplomatic misfire: Rather than isolating France, only Austria-Hungary supported Germany at the resulting Algeciras Conference.',
          ],
          source_context:
            "In 1905, Germany provoked the First Moroccan Crisis by landing Kaiser Wilhelm II at Tangier to champion Moroccan independence against French colonial claims. Germany hoped to expose the 1904 Entente Cordiale as weak; instead, the crisis backfired and drew Britain and France closer together. **Hinge Question:** Why did the Kaiser's dramatic intervention at Tangier ultimately strengthen Anglo-French military cooperation instead of fracturing it?",
          teacher_notes: {
            source_context:
              "In 1905, Germany provoked the First Moroccan Crisis by landing Kaiser Wilhelm II at Tangier to champion Moroccan independence against French colonial claims. Germany hoped to expose the 1904 Entente Cordiale as weak; instead, the crisis backfired and drew Britain and France closer together. **Hinge Question:** Why did the Kaiser's dramatic intervention at Tangier ultimately strengthen Anglo-French military cooperation instead of fracturing it?",
          },
          id: 'gw_l2_src_d',
          src: '',
          image: '',
        },
        {
          letter: 'E',
          type: 'written',
          title:
            'Source E (Ministerial Speech): David Lloyd George, The Mansion House Speech (21 July 1911)',
          text: "I am also bound to say this: that I believe it is essential in the highest interests, not merely of this country, but of the world, that Britain should at all hazards maintain her place and her prestige amongst the Great Powers of the world... If a situation were to be forced upon us in which peace could only be preserved by the surrender of the great and beneficent position Britain has won with centuries of heroism and achievement, by allowing Britain to be treated where her interests were vitally affected as if she didn't count in the Cabinet of Nations, then I say emphatically that peace at that price would be a humiliation intolerable for a great country like ours to endure.",
          caption:
            "David Lloyd George addressing the annual Bankers' Dinner at Mansion House, delivering an unambiguous public warning to Germany following the dispatch of the gunboat Panther to Agadir.",
          citation: 'The Times (London), 22 July 1911, p. 7; Hansard Parliamentary Debates.',
          context:
            "During the Second Moroccan Crisis (1911), Chancellor David Lloyd George—previously regarded as a pacifist-leaning Radical—delivered a blistering public warning that Britain would fight rather than allow Germany to bully France or threaten maritime routes. **Hinge Question:** Why was Lloyd George's Mansion House speech a decisive psychological turning point in the road to the Great War?",
          hinge_question:
            "Why was Lloyd George's Mansion House speech a decisive psychological turning point in the road to the Great War?",
          question_badge: 'Reliability & Provenance',
          question:
            "What makes Lloyd George's Mansion House speech particularly significant as evidence of British foreign policy in 1911?",
          enquiry_question:
            "What makes Lloyd George's Mansion House speech particularly significant as evidence of British foreign policy in 1911?",
          model_answer:
            'The speech is exceptionally significant because Lloyd George was a leading radical politician who had previously opposed war; his firm warning demonstrated that the entire British Cabinet was unified in standing militarily with France against German intimidation.',
          discussion_ideas: [
            'Cabinet solidarity: Ended German hopes that Liberal internal divisions would prevent British action.',
            'Deterrence signaling: Clearly staked British prestige on opposing unilateral German expansion in the Atlantic.',
            'German domestic backlash: German nationalists felt publicly insulted and demanded accelerated naval construction.',
          ],
          source_context:
            "During the Second Moroccan Crisis (1911), Chancellor David Lloyd George—previously regarded as a pacifist-leaning Radical—delivered a blistering public warning that Britain would fight rather than allow Germany to bully France or threaten maritime routes. **Hinge Question:** Why was Lloyd George's Mansion House speech a decisive psychological turning point in the road to the Great War?",
          teacher_notes: {
            source_context:
              "During the Second Moroccan Crisis (1911), Chancellor David Lloyd George—previously regarded as a pacifist-leaning Radical—delivered a blistering public warning that Britain would fight rather than allow Germany to bully France or threaten maritime routes. **Hinge Question:** Why was Lloyd George's Mansion House speech a decisive psychological turning point in the road to the Great War?",
          },
          id: 'gw_l2_src_e',
          src: '',
          image: '',
        },
      ],
    },
    {
      id: 'lesson_3',
      causal_domino_spine: {
        title: 'Naval Arms Race & HMS Dreadnought: Chronology Spine',
        subtitle: 'Key Turning Points & Causal Dominoes (M-A-I-N Framework)',
        stages: [
          {
            step: 1,
            para_ref: '[3.1]',
            date: '1889–1897',
            title: 'The British Two-Power Standard',
            actor: 'The British Empire',
            tag: '🎖️ MILITARISM',
            trigger:
              'Britain passes the Naval Defence Act 1889, decreeing the Royal Navy must equal the combined strength of the next two largest navies.',
            connective:
              'Secured Britain\'s vital sea lanes and food imports, maintaining British independence in "Splendid Isolation".',
            question: "Why was naval supremacy vital for Great Britain's survival?",
          },
          {
            step: 2,
            para_ref: '[3.2]',
            date: '1898–1900',
            title: "Tirpitz's Naval Laws & Risk Fleet",
            actor: 'Admiral von Tirpitz & Germany',
            tag: '🎖️ MILITARISM',
            trigger:
              'Germany passes Naval Laws to build 38 modern battleships directly facing Britain across the North Sea.',
            connective:
              'Britain viewed the German fleet as an existential threat to its survival, destroying Anglo-German diplomatic friendship.',
            question: 'How did Tirpitz\'s "Risk Theory" plan to challenge the Royal Navy?',
          },
          {
            step: 3,
            para_ref: '[3.3]',
            date: 'February 1906',
            title: 'The Dreadnought Revolution',
            actor: 'Admiral Jackie Fisher (Britain)',
            tag: '🎖️ MILITARISM',
            trigger:
              'Britain launches HMS Dreadnought, armed with ten 12-inch guns and steam turbines, rendering all previous battleships instantly obsolete.',
            connective:
              'Because older battleships were now obsolete, the naval race reset to zero: Germany rushed to build its own dreadnoughts.',
            question: 'Why did HMS Dreadnought reset naval supremacy to zero?',
          },
          {
            step: 4,
            para_ref: '[3.4]',
            date: '1908–1909',
            title: 'The 1909 British Naval Panic',
            actor: 'British Public & Government',
            tag: '🎖️ MILITARISM',
            trigger:
              'Amid fears Germany was secretly building dreadnoughts faster than Britain, the British public and press chant: "We want eight and we won\'t wait!"',
            connective:
              'Forced the British government to double its naval construction, spending vast sums to maintain its lead over Germany.',
            question: 'What triggered the 1909 British naval panic ("We want eight")?',
          },
          {
            step: 5,
            para_ref: '[3.5]',
            date: '1912–1914',
            title: 'Haldane Mission Failure & Redeployment',
            actor: 'Lord Haldane & Imperial Germany',
            tag: '🤝 ALLIANCES',
            trigger:
              'Talks for a naval truce collapse when Germany demands British neutrality in any European war; Britain redeploys its fleet to the North Sea.',
            connective:
              'Ended hopes of arms limitation; Britain agreed that France would guard the Mediterranean, sealing an unwritten military alliance.',
            question: 'Evaluate why the 1912 Haldane Mission failed to stop the arms race.',
          },
        ],
      },
      video: [
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=yryey5NVODs',
          title:
            '14th June 1900: Anglo-German naval arms race triggered by the Second German Naval Law',
          duration: '2 mins 35 secs',
          pathway: 'Starter Hook',
          teacher_guidance:
            'Concise overview of Admiral Alfred von Tirpitz\'s 1900 Navy Law, the "Risk Theory" (<em>Risikogedanke</em>), and how challenging the Royal Navy\'s "Two-Power Standard" turned Britain against Germany. Recommended Watch Window: 00:00–02:25 • Lesson Phase: Quick Starter Check (0–3m). Tone Alert: Fast, accessible primary calendar documentary.',
          viewing_task:
            '<ol><li><strong>[00:45] Quick Check:</strong> What was Admiral Alfred von Tirpitz\'s "Risk Theory", and why did Kaiser Wilhelm II believe building a powerful High Seas Fleet would force Britain into diplomatic concessions?</li><li><strong>[01:45] Hinge Question:</strong> Why did Great Britain view Germany\'s construction of an offensive battle fleet in the North Sea as a direct existential threat to the survival of the British Empire?</li></ol>',
          model_answer:
            "<ol><li><strong>Quick Check:</strong> The theory that Germany did not need a navy larger than Britain's, but merely one large enough that attacking it would inflict so much damage on the Royal Navy that Britain would be left vulnerable to other rivals, thereby forcing Britain to grant Germany colonial concessions.</li><li><strong>Hinge Question:</strong> As an island nation, Britain produced only a fraction of its own food and relied completely on maritime trade to prevent starvation and link its global empire. A large German army on land was a continental concern; a large German battle fleet stationed hours across the North Sea was an immediate dagger pointed at Britain's throat.</li></ol>",
        },
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=-osfjjJuY6U',
          title: 'Anglo-German Dreadnought Arms Race - Anything you can build I can build better!',
          duration: '32 mins 1 secs',
          pathway: 'Enquiry Evidence',
          teacher_guidance:
            'Drachinifel\'s naval engineering and strategic breakdown of HMS Dreadnought (1906), turbine propulsion, all-big-gun armament, and the British "We Want Eight and We Won\'t Wait" panic of 1909. Recommended Watch Window: 01:00–07:30 • Lesson Phase: Guided Instruction & Naval Analysis. Tone Alert: Highly rigorous, technical naval history.',
          viewing_task:
            '<ol><li><strong>[02:15] Recall:</strong> What revolutionary British battleship launched in 1906 under First Sea Lord Admiral Jackie Fisher rendered all existing battleships in the world instantly obsolete?</li><li><strong>[04:30] Explain:</strong> Explain the two revolutionary technological features of HMS <em>Dreadnought</em>: how did all-big-gun armament and steam turbine propulsion transform naval warfare?</li><li><strong>[06:45] Challenge:</strong> Evaluate the paradox of HMS <em>Dreadnought</em>: by inventing a warship that reset the naval race to zero, did Britain enhance its security or make it easier for Germany to compete?</li></ol>',
          model_answer:
            "<ol><li><strong>Recall:</strong> HMS <em>Dreadnought</em>.</li><li><strong>Explain:</strong> Previous battleships carried a mixed battery of guns with complex firing arcs and slow speeds. <em>Dreadnought</em> mounted ten uniform 12-inch heavy guns directed by centralized fire control, allowing it to unleash double the broadside firepower at twice the effective range, while revolutionary Parsons steam turbines propelled it to an unprecedented 21 knots.</li><li><strong>Challenge:</strong> Jackie Fisher's design made Britain's vast existing fleet of hundreds of pre-dreadnought battleships obsolete overnight. By creating a clean slate, Germany could match Britain ship-for-ship on modern dreadnought construction. However, Britain's superior shipbuilding industrial capacity allowed it to outbuild Germany (completing 29 dreadnoughts to Germany's 17 by 1914), decisively winning the race and forcing Germany to divert funds back to its army.</li></ol>",
        },
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=YlDA8cquOcU',
          title: 'Cinematic: Dreadnoughts & The Steel Leviathans of the North Sea',
          duration: '3 mins 10 secs',
          pathway: 'Cinematic',
          teacher_guidance:
            'Epic archival reconstruction of early 20th-century dreadnought battleships firing 12-inch main turrets. Recommended Watch Window: 00:00–03:10 • Lesson Phase: Cinematic Starter Hook & Naval Arms Race. Tone Alert: Thunderous naval gunnery and industrial maritime engineering.',
          viewing_task:
            "<p><strong>Cinematic Discussion Focus:</strong> Notice the colossal scale of dreadnought armor plating, steam turbines, and 12-inch rifled guns that rendered all previous warships obsolete overnight. How does the sight of these floating steel fortresses illustrate why Britain viewed Kaiser Wilhelm II's High Seas Fleet as an existential threat to the British Empire?</p>",
          model_answer:
            '<p><strong>Cinematic Analysis:</strong> The sequence captures the awe and terror of modern naval technology. Britain depended entirely on merchant shipping for food and raw materials; an enemy fleet capable of defeating the Royal Navy in the North Sea could starve the British population within six weeks. The naval race was not a mere arms build-up, but a life-or-death struggle for national survival.</p>',
        },
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=qmYJUYwsZqY',
          title: 'Anglo-German Relations and the Naval Race',
          duration: '52 mins 22 secs',
          pathway: 'Documentary Depth',
          teacher_guidance:
            "Academic lecture and documentary detailing Anglo-German diplomatic tensions: Joseph Chamberlain's failed alliance bids, the Daily Telegraph Affair (1908), and the Haldane Mission (1912). Recommended Watch Window: 02:00–08:45 • Lesson Phase: Guided Instruction & Historiographical Deconstruction. Tone Alert: Comprehensive academic diplomatic lecture.",
          viewing_task:
            '<ol><li><strong>[03:45] Recall:</strong> What was Great Britain\'s official naval policy doctrine known as the "Two-Power Standard" adopted in the Naval Defence Act of 1889?</li><li><strong>[05:30] Explain:</strong> Describe the failure of the 1912 Haldane Mission: why did Britain refuse to sign a neutrality pledge unless Germany halted its naval expansion?</li><li><strong>[07:45] Challenge:</strong> Evaluate how the naval race affected the British domestic political landscape: how did the popular slogan "We want eight and we won\'t wait!" reflect jingoistic public pressure?</li></ol>',
          model_answer:
            '<ol><li><strong>Recall:</strong> The doctrine requiring the Royal Navy to maintain a battle fleet of capital ships at least equal in strength to the combined navies of the next two largest naval powers in the world.</li><li><strong>Explain:</strong> British War Minister Lord Haldane traveled to Berlin offering colonial concessions in Africa if Germany slowed warship construction. The Kaiser and Tirpitz demanded that Britain sign a formal treaty guaranteeing absolute neutrality in any future continental war. Britain refused because promising neutrality would abandon France to German conquest and allow Germany to dominate Europe.</li><li><strong>Challenge:</strong> British newspapers, the Conservative opposition, and popular jingoistic campaigns demanded the government fund eight new dreadnoughts rather than the proposed four, demonstrating that public naval pride had become an uncontrollable political force. The naval panic convinced the British public that imperial Germany was an aggressive, untrustworthy enemy.</li></ol>',
        },
      ],
      skill: 'Technological Causation & Arms Race: The Anglo-German Naval Rivalry',
      title: 'Enquiry 3: The Anglo-German Naval Arms Race & HMS Dreadnought (1898–1914)',
      subtitle:
        'The Two-Power Standard, Admiral Tirpitz’s Risk Theory, and the Dreadnought Revolution',
      enquiryQuestion:
        'Why did a battleship building contest destroy Anglo-German relations and reset naval supremacy?',
      margin_spine: [
        {
          year: '1889–1897',
          label: 'Two-Power Standard',
        },
        {
          year: '1898–1900',
          label: 'Tirpitz Risk Theory',
        },
        {
          year: 'Feb 1906',
          label: 'HMS Dreadnought',
        },
        {
          year: '1909',
          label: 'Naval Panic',
        },
        {
          year: '1912–1914',
          label: 'Haldane Mission',
        },
      ],
      teacher_notes: {
        primer:
          'This enquiry investigates the technological and strategic arms race that turned Great Britain and Germany from natural commercial partners into bitter existential rivals. For island Britain, naval supremacy was vital to safeguard imported food supplies and imperial sea lanes. When Admiral Alfred von Tirpitz persuaded the Kaiser to build the High Seas Fleet using his "Risk Theory," Britain viewed it as an intolerable threat to the North Sea. The launch of HMS Dreadnought in 1906 revolutionized naval warfare but dangerously erased Britain’s existing numerical lead, sparking the 1909 public naval panic and prompting Britain to redeploy its fleet from the Mediterranean to the North Sea.',
        objectives: [
          {
            objective:
              'Explain why naval supremacy was vital for Great Britain’s national survival.',
            primer:
              'Focus on paragraph [3.1]. Highlight Britain’s dependence on sea lanes for four-fifths of its grain and raw materials, leading to the 1889 Two-Power Standard.',
            question:
              'Why did British strategists view a large German battlefleet across the North Sea as an existential threat rather than ordinary national defense?',
          },
          {
            objective:
              'Analyze how Admiral Tirpitz’s "Risk Theory" aimed to challenge the Royal Navy.',
            primer:
              'Direct students to paragraph [3.2]. Explain that Tirpitz did not expect to defeat the entire Royal Navy, but to build a fleet large enough that Britain would risk losing its global supremacy if it attacked.',
            question:
              'Why did Tirpitz believe a strong battlefleet would force Britain into diplomatic concessions, and why was this calculation flawed?',
          },
          {
            objective: 'Evaluate the paradoxical impact of the launch of HMS Dreadnought in 1906.',
            primer:
              'Focus on paragraphs [3.3] to [3.5]. Show how Jackie Fisher’s steam turbine, all-big-gun warship made all pre-dreadnoughts obsolete, resetting the naval score to 1–0.',
            question:
              'Did the launch of HMS Dreadnought protect British imperial security, or did it dangerously erase Britain’s numerical advantage?',
          },
        ],
        source_context:
          'Primary photograph depicting the Royal Navy battleship HMS Dreadnought at sea (c. 1906–1907). Designed under First Sea Lord Admiral Sir John Fisher and constructed in just twelve months at Portsmouth Dockyard, HMS Dreadnought featured ten 12-inch guns and revolutionary steam-turbine engines producing a top speed of 21 knots. By making every pre-existing battleship on earth obsolete overnight, Dreadnought created a global sensation but wiped out Britain’s massive pre-existing lead in pre-dreadnoughts, allowing Germany to compete on equal terms. **Hinge Question:** Did the launch of HMS Dreadnought protect British imperial security, or did it dangerously erase Britain’s established naval advantage?',
      },
      do_now: {
        title: 'Do Now: Imperial Rivalry & Crises Recall',
        type: 'mixed',
        items: [
          {
            question:
              'What was the 1884–85 conference that established rules for colonizing Africa?',
            answer: 'The Berlin West Africa Conference',
          },
          {
            question: 'Which aggressive German foreign policy demanded a "place in the sun"?',
            answer: 'Weltpolitik',
          },
          {
            question: 'In what year was the Entente Cordiale signed between Britain and France?',
            answer: '1904',
          },
          {
            question: 'At which Moroccan port did Kaiser Wilhelm II land on a white horse in 1905?',
            answer: 'Tangier',
          },
          {
            question:
              'Which German warship was sent to Agadir in 1911, sparking the Second Moroccan Crisis?',
            answer: 'SMS Panther',
          },
        ],
      },
      vocab: [
        {
          term: 'Two-Power Standard',
          definition:
            'The official British naval doctrine established in 1889 requiring the Royal Navy to maintain a battleship fleet equal to the next two largest navies combined.',
          syllables: 'Two-Po-wer Sta-ndard',
          phonetic: 'two-power standard',
          tier: '3',
        },
        {
          term: 'Risk Theory (Risikotheorie)',
          definition:
            'Admiral von Tirpitz’s strategic calculation that building a formidable German battlefleet in the North Sea would deter Britain from risking war.',
          syllables: 'Risk Theo-ry (Ri-siko-theo-rie)',
          phonetic: 'risk theory (risikotheorie)',
          tier: '3',
        },
        {
          term: 'Dreadnought',
          definition:
            'A revolutionary class of battleship introduced by Britain in 1906, powered by steam turbines and armed exclusively with heavy 12-inch guns.',
          syllables: 'dread-nought',
          phonetic: 'ˈdrɛdnɔːt',
          tier: '3',
        },
        {
          term: 'Naval Laws',
          definition:
            'A series of German parliamentary statutes passed in 1898 and 1900 authorizing the massive construction of the High Seas Fleet.',
          syllables: 'Na-val Laws',
          phonetic: 'naval laws',
          tier: '3',
        },
        {
          term: 'Haldane Mission',
          definition:
            'A failed 1912 diplomatic mission to Berlin by British War Secretary Lord Haldane seeking a naval building truce.',
          syllables: 'Ha-lda-ne Mi-ssion',
          phonetic: 'haldane mission',
          tier: '3',
        },
      ],
      narrative_blocks: [
        {
          act: 1,
          title: 'The Two-Power Standard & British Maritime Survival (1889–1897)',
          text: '<span class="para-ref">[3.1]</span> For Great Britain, naval supremacy was essential for national survival. As an island nation, Britain could not feed its people without ocean imports. By 1900, Britain imported four-fifths of its wheat and meat on merchant ships. If enemy battleships cut these supply routes, Britain would starve within six weeks. The Royal Navy also defended a global empire of four hundred million subjects.<br><br><span class="para-ref">[3.2]</span> In the **Naval Defence Act of 1889**, Britain established the **Two-Power Standard**. This law required the Royal Navy to be as large as the world\'s next two biggest navies combined (then France and Russia). British leaders believed that unmatched sea power was the best way to prevent continental wars.',
          source: {
            letter: 'A',
            id: 'gw_l3_src_a',
            type: 'written',
            title:
              'Source A (Statute Law): The Naval Defence Act 1889 (The Two-Power Standard, 52 & 53 Vict. c. 8)',
            context:
              'Passed in 1889, the Naval Defence Act legally committed Great Britain to maintain a Royal Navy battle fleet equal to or greater than the combined naval strength of the next two largest navies in the world (France and Russia). **Hinge Question:** Why did Great Britain consider maintaining a battlefleet twice the size of rival nations to be an existential necessity rather than an act of aggression?',
            hinge_question:
              'Why did Great Britain consider maintaining a battlefleet twice the size of rival nations to be an existential necessity rather than an act of aggression?',
            text: '“For the safety of the United Kingdom, the protection of commerce, and the security of the colonies, it is expedient to make provisions for building and equipping seventy ships of war... The standard of naval strength which this nation must invariably maintain is that the battle fleet of the Royal Navy should at least be equal to the combined strength of any two of the next strongest naval powers in the world.”',
            caption:
              'Source A: Extract from the preamble of the Naval Defence Act 1889 formalising the British Two-Power Standard.',
            question_badge: 'Strategic Doctrine',
            question:
              'According to the 1889 Act, why was the Royal Navy required to match the strength of the next two largest navies combined?',
            enquiry_question:
              'According to the 1889 Act, why was the Royal Navy required to match the strength of the next two largest navies combined?',
            model_answer:
              'The Act stated that maintaining a fleet equal to the next two largest navies was essential to protect Britain from invasion, secure its worldwide merchant trade routes, and protect its overseas empire.',
            source_context:
              'Passed in 1889, the Naval Defence Act legally committed Great Britain to maintain a Royal Navy battle fleet equal to or greater than the combined naval strength of the next two largest navies in the world (France and Russia). **Hinge Question:** Why did Great Britain consider maintaining a battlefleet twice the size of rival nations to be an existential necessity rather than an act of aggression?',
            teacher_notes: {
              source_context:
                'Passed in 1889, the Naval Defence Act legally committed Great Britain to maintain a Royal Navy battle fleet equal to or greater than the combined naval strength of the next two largest navies in the world (France and Russia). **Hinge Question:** Why did Great Britain consider maintaining a battlefleet twice the size of rival nations to be an existential necessity rather than an act of aggression?',
            },
            src: '',
            image: '',
          },
          sources: [
            {
              letter: 'A',
              id: 'gw_l3_src_a',
              type: 'written',
              title:
                'Source A (Statute Law): The Naval Defence Act 1889 (The Two-Power Standard, 52 & 53 Vict. c. 8)',
              context:
                'Passed in 1889, the Naval Defence Act legally committed Great Britain to maintain a Royal Navy battle fleet equal to or greater than the combined naval strength of the next two largest navies in the world (France and Russia). **Hinge Question:** Why did Great Britain consider maintaining a battlefleet twice the size of rival nations to be an existential necessity rather than an act of aggression?',
              hinge_question:
                'Why did Great Britain consider maintaining a battlefleet twice the size of rival nations to be an existential necessity rather than an act of aggression?',
              text: '“For the safety of the United Kingdom, the protection of commerce, and the security of the colonies, it is expedient to make provisions for building and equipping seventy ships of war... The standard of naval strength which this nation must invariably maintain is that the battle fleet of the Royal Navy should at least be equal to the combined strength of any two of the next strongest naval powers in the world.”',
              caption:
                'Source A: Extract from the preamble of the Naval Defence Act 1889 formalising the British Two-Power Standard.',
              question_badge: 'Strategic Doctrine',
              question:
                'According to the 1889 Act, why was the Royal Navy required to match the strength of the next two largest navies combined?',
              enquiry_question:
                'According to the 1889 Act, why was the Royal Navy required to match the strength of the next two largest navies combined?',
              model_answer:
                'The Act stated that maintaining a fleet equal to the next two largest navies was essential to protect Britain from invasion, secure its worldwide merchant trade routes, and protect its overseas empire.',
              source_context:
                'Passed in 1889, the Naval Defence Act legally committed Great Britain to maintain a Royal Navy battle fleet equal to or greater than the combined naval strength of the next two largest navies in the world (France and Russia). **Hinge Question:** Why did Great Britain consider maintaining a battlefleet twice the size of rival nations to be an existential necessity rather than an act of aggression?',
              teacher_notes: {
                source_context:
                  'Passed in 1889, the Naval Defence Act legally committed Great Britain to maintain a Royal Navy battle fleet equal to or greater than the combined naval strength of the next two largest navies in the world (France and Russia). **Hinge Question:** Why did Great Britain consider maintaining a battlefleet twice the size of rival nations to be an existential necessity rather than an act of aggression?',
              },
              src: '',
              image: '',
            },
          ],
        },
        {
          act: 2,
          title: 'Admiral von Tirpitz, German Naval Laws & "Risk Theory" (1898–1900)',
          text: '<span class="para-ref">[3.2]</span> In 1897, Kaiser Wilhelm II appointed **Admiral Alfred von Tirpitz** to run the Imperial Navy. Tirpitz believed Germany could not become a world empire without a powerful battlefleet. In 1898 and 1900, Tirpitz passed the famous **German Naval Laws** through the Reichstag, funding dozens of battleships for the new **High Seas Fleet**.<br><br><span class="para-ref">[3.3]</span> Tirpitz justified this cost using his **Risk Theory (Risikotheorie)**. Britain\'s navy was scattered around the globe protecting colonies. Germany would instead concentrate its fleet across the North Sea in ports like Wilhelmshaven and Kiel. Tirpitz argued that Britain would not risk a battle because heavy losses would ruin its naval supremacy over rivals. Tirpitz expected Britain to give in to German colonial demands. It was a disastrous miscalculation.',
          image: '/units/great_war/assets/was_dreadnought_blueprint.png',
          image_alt: 'Technical blueprint and cross-section schematic of HMS Dreadnought (1906)',
          caption:
            'Admiralty architectural blueprint showing the revolutionary all-big-gun centerline layout and Parsons steam-turbine arrangement of HMS Dreadnought.',
          source: {
            letter: 'B',
            type: 'written',
            title:
              'Source B (German Imperial Legislation): The Second German Naval Law (Flottengesetz), Preamble (1900)',
            text: "To protect Germany's sea trade and colonies, there is only one means: Germany must have a battle fleet so strong that even for the adversary with the greatest sea power [Great Britain], a war against it would involve such perils as to imperil the position of that Power as a world power... It is not necessary for this purpose that the German battle fleet should be as strong as that of the greatest sea power at all times, because the greatest sea power will generally not be in a position to concentrate all of its forces against us.",
            caption:
              "Official preamble to the Second German Naval Law drafted by State Secretary Alfred von Tirpitz, defining Germany's strategic 'Risk Theory' (Risikogedanke).",
            citation: 'Reichsgesetzblatt 1900, No. 21, pp. 255–259 (Imperial German Law Gazette).',
            context:
              "Under Admiral Alfred von Tirpitz, Germany passed a series of Naval Laws aiming to build a battle fleet so powerful that Britain would not dare challenge it without risking its own naval supremacy. This 'Risk Theory' directly threatened Britain's national security. **Hinge Question:** Why did Germany's 'Risk Theory' backfire catastrophically by pushing Britain to abandon its policy of 'splendid isolation'?",
            hinge_question:
              "Why did Germany's 'Risk Theory' backfire catastrophically by pushing Britain to abandon its policy of 'splendid isolation'?",
            question_badge: 'Author’s Purpose',
            question:
              "Why did Admiral von Tirpitz emphasize that Germany did not need a fleet as large as Britain's in this preamble?",
            enquiry_question:
              "Why did Admiral von Tirpitz emphasize that Germany did not need a fleet as large as Britain's in this preamble?",
            model_answer:
              "Tirpitz argued that because Britain's navy had to guard an enormous global empire, a concentrated German fleet in the North Sea only needed to be large enough to make a British attack too risky to contemplate.",
            discussion_ideas: [
              'Calculated deterrence: Tirpitz believed Britain would make diplomatic concessions rather than risk combat.',
              'Strategic delusion: Underestimated British willingness to concentrate its global fleets in the North Sea.',
              'Arms race catalyst: Triggered immediate British counter-construction rather than intimidation.',
            ],
            source_context:
              "Under Admiral Alfred von Tirpitz, Germany passed a series of Naval Laws aiming to build a battle fleet so powerful that Britain would not dare challenge it without risking its own naval supremacy. This 'Risk Theory' directly threatened Britain's national security. **Hinge Question:** Why did Germany's 'Risk Theory' backfire catastrophically by pushing Britain to abandon its policy of 'splendid isolation'?",
            teacher_notes: {
              source_context:
                "Under Admiral Alfred von Tirpitz, Germany passed a series of Naval Laws aiming to build a battle fleet so powerful that Britain would not dare challenge it without risking its own naval supremacy. This 'Risk Theory' directly threatened Britain's national security. **Hinge Question:** Why did Germany's 'Risk Theory' backfire catastrophically by pushing Britain to abandon its policy of 'splendid isolation'?",
            },
            id: 'gw_l3_src_b',
            src: '',
            image: '',
          },
          sources: [
            {
              letter: 'B',
              type: 'written',
              title:
                'Source B (German Imperial Legislation): The Second German Naval Law (Flottengesetz), Preamble (1900)',
              text: "To protect Germany's sea trade and colonies, there is only one means: Germany must have a battle fleet so strong that even for the adversary with the greatest sea power [Great Britain], a war against it would involve such perils as to imperil the position of that Power as a world power... It is not necessary for this purpose that the German battle fleet should be as strong as that of the greatest sea power at all times, because the greatest sea power will generally not be in a position to concentrate all of its forces against us.",
              caption:
                "Official preamble to the Second German Naval Law drafted by State Secretary Alfred von Tirpitz, defining Germany's strategic 'Risk Theory' (Risikogedanke).",
              citation:
                'Reichsgesetzblatt 1900, No. 21, pp. 255–259 (Imperial German Law Gazette).',
              context:
                "Under Admiral Alfred von Tirpitz, Germany passed a series of Naval Laws aiming to build a battle fleet so powerful that Britain would not dare challenge it without risking its own naval supremacy. This 'Risk Theory' directly threatened Britain's national security. **Hinge Question:** Why did Germany's 'Risk Theory' backfire catastrophically by pushing Britain to abandon its policy of 'splendid isolation'?",
              hinge_question:
                "Why did Germany's 'Risk Theory' backfire catastrophically by pushing Britain to abandon its policy of 'splendid isolation'?",
              question_badge: 'Author’s Purpose',
              question:
                "Why did Admiral von Tirpitz emphasize that Germany did not need a fleet as large as Britain's in this preamble?",
              enquiry_question:
                "Why did Admiral von Tirpitz emphasize that Germany did not need a fleet as large as Britain's in this preamble?",
              model_answer:
                "Tirpitz argued that because Britain's navy had to guard an enormous global empire, a concentrated German fleet in the North Sea only needed to be large enough to make a British attack too risky to contemplate.",
              discussion_ideas: [
                'Calculated deterrence: Tirpitz believed Britain would make diplomatic concessions rather than risk combat.',
                'Strategic delusion: Underestimated British willingness to concentrate its global fleets in the North Sea.',
                'Arms race catalyst: Triggered immediate British counter-construction rather than intimidation.',
              ],
              source_context:
                "Under Admiral Alfred von Tirpitz, Germany passed a series of Naval Laws aiming to build a battle fleet so powerful that Britain would not dare challenge it without risking its own naval supremacy. This 'Risk Theory' directly threatened Britain's national security. **Hinge Question:** Why did Germany's 'Risk Theory' backfire catastrophically by pushing Britain to abandon its policy of 'splendid isolation'?",
              teacher_notes: {
                source_context:
                  "Under Admiral Alfred von Tirpitz, Germany passed a series of Naval Laws aiming to build a battle fleet so powerful that Britain would not dare challenge it without risking its own naval supremacy. This 'Risk Theory' directly threatened Britain's national security. **Hinge Question:** Why did Germany's 'Risk Theory' backfire catastrophically by pushing Britain to abandon its policy of 'splendid isolation'?",
              },
              id: 'gw_l3_src_b',
              src: '',
              image: '',
            },
          ],
        },
        {
          act: 3,
          title: 'The Dreadnought Revolution: All-Big-Gun Technology (February 1906)',
          text: '<span class="para-ref">[3.3]</span> Britain met the German challenge under First Sea Lord **Admiral Sir John "Jackie" Fisher**. Fisher recognized that older warships with mixed gun sizes were outdated. Building in secret at Portsmouth Dockyard, Fisher launched **HMS Dreadnought** in February 1906.<br><br><span class="para-ref">[3.4]</span> <em>Dreadnought</em> transformed naval warfare. It was the world\'s first "all-big-gun" battleship, armed with ten 12-inch heavy guns that fired 850-pound shells over eight miles. Powered by modern steam turbines, it cruised at 21 knots, faster than any battleship afloat. However, <em>Dreadnought</em> created a serious problem for Britain. By making older ships obsolete, it erased Britain\'s big lead of fifty pre-dreadnoughts to Germany\'s twenty. The naval race was reset to zero: **Britain 1, Germany 0**. Germany could now build dreadnoughts of its own.',
          source: {
            letter: 'C',
            type: 'written',
            title:
              'Source C (Confidential Memorandum): Admiral Sir John Fisher, Memorandum to the Admiralty Board (1904)',
            text: 'The sole purpose of the British Navy is to strike the enemy instantly and decisively. Our only probable enemy is Germany. Germany keeps her whole fleet concentrated within a few hours of England. We must keep a fleet twice as powerful concentrated within a few hours of Germany... My new design of battleship [HMS Dreadnought] will be armed only with twelve-inch guns and driven by turbine engines. It will out-range and out-steam any warship floating, rendering every foreign navy obsolescent at a single stroke.',
            caption:
              "Confidential policy paper submitted by Admiral Sir John 'Jackie' Fisher to the British Board of Admiralty, detailing the strategic justification for building HMS Dreadnought.",
            citation: 'The National Archives, Kew (ADM 1/7734 / Fisher Papers, Vol. 1).',
            context:
              "Upon becoming First Sea Lord in 1904, Admiral Fisher reorganized the entire Royal Navy, recalling battleships from across the empire to concentrate overwhelming force in home waters against the German High Seas Fleet. **Hinge Question:** How did Fisher's decision to build Dreadnought paradoxically erase Britain's massive numerical advantage in older battleships?",
            hinge_question:
              "How did Fisher's decision to build Dreadnought paradoxically erase Britain's massive numerical advantage in older battleships?",
            question_badge: 'Source Inference',
            question:
              "What does Admiral Fisher's memorandum reveal about the Royal Navy's primary strategic focus by 1904?",
            enquiry_question:
              "What does Admiral Fisher's memorandum reveal about the Royal Navy's primary strategic focus by 1904?",
            model_answer:
              'The memorandum reveals that the Admiralty had completely reoriented British naval strategy to treat Germany as its primary existential threat, concentrating overwhelming firepower in the North Sea to counter the German fleet.',
            discussion_ideas: [
              'Single-minded focus on Germany: Replaced traditional French or Russian rivals with Berlin as the chief enemy.',
              "Technological radicalism: Willing to render Britain's own pre-dreadnought fleet obsolete to stay ahead.",
              'Global fleet recall: Ended the historic practice of scattering warships across distant colonial stations.',
            ],
            source_context:
              "Upon becoming First Sea Lord in 1904, Admiral Fisher reorganized the entire Royal Navy, recalling battleships from across the empire to concentrate overwhelming force in home waters against the German High Seas Fleet. **Hinge Question:** How did Fisher's decision to build Dreadnought paradoxically erase Britain's massive numerical advantage in older battleships?",
            teacher_notes: {
              source_context:
                "Upon becoming First Sea Lord in 1904, Admiral Fisher reorganized the entire Royal Navy, recalling battleships from across the empire to concentrate overwhelming force in home waters against the German High Seas Fleet. **Hinge Question:** How did Fisher's decision to build Dreadnought paradoxically erase Britain's massive numerical advantage in older battleships?",
            },
            id: 'gw_l3_src_c',
            src: '',
            image: '',
          },
          sources: [
            {
              letter: 'C',
              type: 'written',
              title:
                'Source C (Confidential Memorandum): Admiral Sir John Fisher, Memorandum to the Admiralty Board (1904)',
              text: 'The sole purpose of the British Navy is to strike the enemy instantly and decisively. Our only probable enemy is Germany. Germany keeps her whole fleet concentrated within a few hours of England. We must keep a fleet twice as powerful concentrated within a few hours of Germany... My new design of battleship [HMS Dreadnought] will be armed only with twelve-inch guns and driven by turbine engines. It will out-range and out-steam any warship floating, rendering every foreign navy obsolescent at a single stroke.',
              caption:
                "Confidential policy paper submitted by Admiral Sir John 'Jackie' Fisher to the British Board of Admiralty, detailing the strategic justification for building HMS Dreadnought.",
              citation: 'The National Archives, Kew (ADM 1/7734 / Fisher Papers, Vol. 1).',
              context:
                "Upon becoming First Sea Lord in 1904, Admiral Fisher reorganized the entire Royal Navy, recalling battleships from across the empire to concentrate overwhelming force in home waters against the German High Seas Fleet. **Hinge Question:** How did Fisher's decision to build Dreadnought paradoxically erase Britain's massive numerical advantage in older battleships?",
              hinge_question:
                "How did Fisher's decision to build Dreadnought paradoxically erase Britain's massive numerical advantage in older battleships?",
              question_badge: 'Source Inference',
              question:
                "What does Admiral Fisher's memorandum reveal about the Royal Navy's primary strategic focus by 1904?",
              enquiry_question:
                "What does Admiral Fisher's memorandum reveal about the Royal Navy's primary strategic focus by 1904?",
              model_answer:
                'The memorandum reveals that the Admiralty had completely reoriented British naval strategy to treat Germany as its primary existential threat, concentrating overwhelming firepower in the North Sea to counter the German fleet.',
              discussion_ideas: [
                'Single-minded focus on Germany: Replaced traditional French or Russian rivals with Berlin as the chief enemy.',
                "Technological radicalism: Willing to render Britain's own pre-dreadnought fleet obsolete to stay ahead.",
                'Global fleet recall: Ended the historic practice of scattering warships across distant colonial stations.',
              ],
              source_context:
                "Upon becoming First Sea Lord in 1904, Admiral Fisher reorganized the entire Royal Navy, recalling battleships from across the empire to concentrate overwhelming force in home waters against the German High Seas Fleet. **Hinge Question:** How did Fisher's decision to build Dreadnought paradoxically erase Britain's massive numerical advantage in older battleships?",
              teacher_notes: {
                source_context:
                  "Upon becoming First Sea Lord in 1904, Admiral Fisher reorganized the entire Royal Navy, recalling battleships from across the empire to concentrate overwhelming force in home waters against the German High Seas Fleet. **Hinge Question:** How did Fisher's decision to build Dreadnought paradoxically erase Britain's massive numerical advantage in older battleships?",
              },
              id: 'gw_l3_src_c',
              src: '',
              image: '',
            },
          ],
        },
        {
          act: 4,
          title: 'The 1909 Naval Panic: "We Want Eight and We Won\'t Wait!" (1909)',
          text: '<span class="para-ref">[3.4]</span> Between 1906 and 1908, Germany accelerated naval building, constructing four dreadnoughts each year. In late 1908, British intelligence discovered German shipyards were secretly stockpiling steel to build even faster. In January 1909, public alarm erupted in the **1909 Naval Panic**.<br><br><span class="para-ref">[3.5]</span> Prime Minister H.H. Asquith and Chancellor David Lloyd George had hoped to spend money on social reforms like pensions. However, newspapers, the public, and politicians launched a fierce campaign demanding more warships: <em>"We want eight and we won\'t wait!"</em> The government yielded to public pressure. Parliament voted to build eight super-dreadnoughts in a single year, comfortably out-building Germany but placing massive tax burdens on both countries.',
          image: '/images/hms_dreadnought_1906.jpg',
          image_alt:
            'Archival photograph of the Royal Navy battleship HMS Dreadnought underway at sea (1906)',
          caption:
            'HMS Dreadnought steaming at full speed during sea trials in 1906. Her commissioning instantly rendered every existing battleship in the world obsolete.',
          source: {
            letter: 'D',
            type: 'visual',
            title:
              'Source D (Political Cartoon): L. M. Glackens, "No Limit: A 1909 Cartoon on the Naval Race" (Puck, 1909)',
            image: '/units/great_war/assets/Naval-race-1909.jpg',
            src: '/units/great_war/assets/Naval-race-1909.jpg',
            is_artwork: true,
            caption:
              'Cover of American satirical magazine Puck (22 September 1909) drawn by L. M. Glackens, satirizing the global naval arms race as an uncapped poker game where Japan, Britain, Germany, and the United States gamble battleships and dreadnoughts.',
            citation:
              'Puck Magazine, New York (Vol. LXVI, No. 1699, 22 September 1909) / Library of Congress Prints and Photographs Division (LC-DIG-ppmsca-26327).',
            context:
              "By 1909, the dreadnought revolution had spread far beyond Britain and Germany into a global arms competition involving the United States and the Empire of Japan. American satirical illustrator L. M. Glackens depicted the Great Powers gathered around an uncapped poker table ('No Limit'), recklessly betting cruisers and dreadnoughts in a spiraling cycle of bluff and escalation where no player could afford to fold. **Hinge Question:** How does the poker metaphor in Glackens's cartoon explain why nations find it psychologically and strategically impossible to stop an arms race once it begins?",
            hinge_question:
              "How does the poker metaphor in Glackens's cartoon explain why nations find it psychologically and strategically impossible to stop an arms race once it begins?",
            question_badge: 'Author’s Purpose',
            question:
              "What does the artist's comparison of the naval arms race to an uncapped poker game suggest about international diplomacy in 1909?",
            enquiry_question:
              "What does the artist's comparison of the naval arms race to an uncapped poker game suggest about international diplomacy in 1909?",
            model_answer:
              'The artist suggests that the naval arms race had become a reckless, out-of-control gamble where imperial powers were compelled to continuously raise their military stakes with dreadnoughts, unable to stop without losing international prestige.',
            discussion_ideas: [
              'Global scope: Demonstrates that the dreadnought revolution impacted Japan and America alongside Britain and Germany.',
              'Psychological escalation: Depicting nations as poker players highlights how pride, bluff, and fear drove building programmes.',
              'Financial exhaustion: Shows the immense stacks of national wealth being gambled away on warships.',
            ],
            source_context:
              "By 1909, the dreadnought revolution had spread far beyond Britain and Germany into a global arms competition involving the United States and the Empire of Japan. American satirical illustrator L. M. Glackens depicted the Great Powers gathered around an uncapped poker table ('No Limit'), recklessly betting cruisers and dreadnoughts in a spiraling cycle of bluff and escalation where no player could afford to fold. **Hinge Question:** How does the poker metaphor in Glackens's cartoon explain why nations find it psychologically and strategically impossible to stop an arms race once it begins?",
            teacher_notes: {
              source_context:
                "By 1909, the dreadnought revolution had spread far beyond Britain and Germany into a global arms competition involving the United States and the Empire of Japan. American satirical illustrator L. M. Glackens depicted the Great Powers gathered around an uncapped poker table ('No Limit'), recklessly betting cruisers and dreadnoughts in a spiraling cycle of bluff and escalation where no player could afford to fold. **Hinge Question:** How does the poker metaphor in Glackens's cartoon explain why nations find it psychologically and strategically impossible to stop an arms race once it begins?",
            },
            id: 'gw_l3_src_d',
          },
          sources: [
            {
              letter: 'D',
              type: 'visual',
              title:
                'Source D (Political Cartoon): L. M. Glackens, "No Limit: A 1909 Cartoon on the Naval Race" (Puck, 1909)',
              image: '/units/great_war/assets/Naval-race-1909.jpg',
              src: '/units/great_war/assets/Naval-race-1909.jpg',
              is_artwork: true,
              caption:
                'Cover of American satirical magazine Puck (22 September 1909) drawn by L. M. Glackens, satirizing the global naval arms race as an uncapped poker game where Japan, Britain, Germany, and the United States gamble battleships and dreadnoughts.',
              citation:
                'Puck Magazine, New York (Vol. LXVI, No. 1699, 22 September 1909) / Library of Congress Prints and Photographs Division (LC-DIG-ppmsca-26327).',
              context:
                "By 1909, the dreadnought revolution had spread far beyond Britain and Germany into a global arms competition involving the United States and the Empire of Japan. American satirical illustrator L. M. Glackens depicted the Great Powers gathered around an uncapped poker table ('No Limit'), recklessly betting cruisers and dreadnoughts in a spiraling cycle of bluff and escalation where no player could afford to fold. **Hinge Question:** How does the poker metaphor in Glackens's cartoon explain why nations find it psychologically and strategically impossible to stop an arms race once it begins?",
              hinge_question:
                "How does the poker metaphor in Glackens's cartoon explain why nations find it psychologically and strategically impossible to stop an arms race once it begins?",
              question_badge: 'Author’s Purpose',
              question:
                "What does the artist's comparison of the naval arms race to an uncapped poker game suggest about international diplomacy in 1909?",
              enquiry_question:
                "What does the artist's comparison of the naval arms race to an uncapped poker game suggest about international diplomacy in 1909?",
              model_answer:
                'The artist suggests that the naval arms race had become a reckless, out-of-control gamble where imperial powers were compelled to continuously raise their military stakes with dreadnoughts, unable to stop without losing international prestige.',
              discussion_ideas: [
                'Global scope: Demonstrates that the dreadnought revolution impacted Japan and America alongside Britain and Germany.',
                'Psychological escalation: Depicting nations as poker players highlights how pride, bluff, and fear drove building programmes.',
                'Financial exhaustion: Shows the immense stacks of national wealth being gambled away on warships.',
              ],
              source_context:
                "By 1909, the dreadnought revolution had spread far beyond Britain and Germany into a global arms competition involving the United States and the Empire of Japan. American satirical illustrator L. M. Glackens depicted the Great Powers gathered around an uncapped poker table ('No Limit'), recklessly betting cruisers and dreadnoughts in a spiraling cycle of bluff and escalation where no player could afford to fold. **Hinge Question:** How does the poker metaphor in Glackens's cartoon explain why nations find it psychologically and strategically impossible to stop an arms race once it begins?",
              teacher_notes: {
                source_context:
                  "By 1909, the dreadnought revolution had spread far beyond Britain and Germany into a global arms competition involving the United States and the Empire of Japan. American satirical illustrator L. M. Glackens depicted the Great Powers gathered around an uncapped poker table ('No Limit'), recklessly betting cruisers and dreadnoughts in a spiraling cycle of bluff and escalation where no player could afford to fold. **Hinge Question:** How does the poker metaphor in Glackens's cartoon explain why nations find it psychologically and strategically impossible to stop an arms race once it begins?",
              },
              id: 'gw_l3_src_d',
            },
          ],
        },
        {
          act: 5,
          title: 'The Haldane Mission Failure & Strategic Redeployment (1912–1914)',
          text: '<span class="para-ref">[3.5]</span> By 1912, the crushing cost of the naval race led Britain to seek a truce. British War Secretary **Lord Haldane** traveled to Berlin to propose a "naval holiday." Haldane offered to slow down dreadnought construction if Germany restricted its fleet. However, the Kaiser insisted that **Britain must pledge strict neutrality in any future European war**.<br><br><span class="para-ref">[3.6]</span> Britain refused because this pledge would allow Germany to crush France. The mission collapsed. In response, First Lord of the Admiralty **Winston Churchill** reorganized British naval defense. Britain pulled its main battleships from the Mediterranean Sea and placed sixty percent of the Royal Navy in the North Sea. Under a new agreement, the French navy guarded the Mediterranean, while Britain guarded the French coast. Germany had lost the naval race, but the rivalry permanently wrecked relations between London and Berlin.',
          source: {
            letter: 'E',
            type: 'written',
            title:
              'Source E (Official Admiralty Statistics): British vs German Dreadnought Capital Ship Deliveries (1906–1914)',
            caption:
              'Official return presented to the British Parliament in March 1914 by the Admiralty, recording capital ship construction totals between Great Britain and Imperial Germany.',
            citation:
              'Admiralty Naval Intelligence Division, London / Parliamentary Command Paper (Cd. 7310, Naval Estimates Return, March 1914).',
            text: "Official Admiralty Return to the House of Commons (March 1914): Comparative Capital Ship Strength in Commission:\n\n• Great Britain (Royal Navy):\n  - Dreadnought Battleships completed (1906–1914): 29\n  - Battlecruisers completed (1908–1914): 9\n  - Total Modern Capital Ships in Commission: 38\n\n• Imperial Germany (Kaiserliche Marine):\n  - Dreadnought Battleships completed (1908–1914): 17\n  - Battlecruisers completed (1909–1914): 7\n  - Total Modern Capital Ships in Commission: 24\n\nResulting Ratio: British capital ship superiority stood at 38 to 24 (1.58 : 1 ratio). In 1913, recognizing that Britain's shipbuilding industry could out-build Germany at a rate of nearly two to one, Germany abandoned its bid for naval parity and redirected military spending back to expanding its land army.",
            context:
              "Despite massive German financial sacrifices and Tirpitz's 'Risk Theory', Britain's overwhelming industrial shipbuilding capacity allowed the Royal Navy to win the naval race decisively, entering August 1914 with a crushing 29-to-17 dreadnought superiority in the North Sea. **Hinge Question:** If Britain won the naval arms race so decisively by 1914, why did the race nevertheless make a European war far more likely?",
            hinge_question:
              'If Britain won the naval arms race so decisively by 1914, why did the race nevertheless make a European war far more likely?',
            question_badge: 'Source Inference',
            question:
              'What does this statistical comparison prove regarding the outcome of the naval race by August 1914?',
            enquiry_question:
              'What does this statistical comparison prove regarding the outcome of the naval race by August 1914?',
            model_answer:
              "The data proves that Great Britain maintained a decisive 29-to-17 superiority in dreadnought battleships, demonstrating that Germany had lost the naval race and could not hope to break Britain's command of the seas.",
            discussion_ideas: [
              'Decisive British industrial victory: Britain out-built Germany in every class of modern warship.',
              'Shift in German strategy: Having lost the naval race, Berlin diverted funds back to expanding its land army in 1912–1913.',
              'Enduring hostility: The naval rivalry permanently destroyed British trust in German intentions.',
            ],
            source_context:
              "Despite massive German financial sacrifices and Tirpitz's 'Risk Theory', Britain's overwhelming industrial shipbuilding capacity allowed the Royal Navy to win the naval race decisively, entering August 1914 with a crushing 29-to-17 dreadnought superiority in the North Sea. **Hinge Question:** If Britain won the naval arms race so decisively by 1914, why did the race nevertheless make a European war far more likely?",
            teacher_notes: {
              source_context:
                "Despite massive German financial sacrifices and Tirpitz's 'Risk Theory', Britain's overwhelming industrial shipbuilding capacity allowed the Royal Navy to win the naval race decisively, entering August 1914 with a crushing 29-to-17 dreadnought superiority in the North Sea. **Hinge Question:** If Britain won the naval arms race so decisively by 1914, why did the race nevertheless make a European war far more likely?",
            },
            id: 'gw_l3_src_e',
            src: '',
            image: '',
          },
          sources: [
            {
              letter: 'E',
              type: 'written',
              title:
                'Source E (Official Admiralty Statistics): British vs German Dreadnought Capital Ship Deliveries (1906–1914)',
              caption:
                'Official return presented to the British Parliament in March 1914 by the Admiralty, recording capital ship construction totals between Great Britain and Imperial Germany.',
              citation:
                'Admiralty Naval Intelligence Division, London / Parliamentary Command Paper (Cd. 7310, Naval Estimates Return, March 1914).',
              text: "Official Admiralty Return to the House of Commons (March 1914): Comparative Capital Ship Strength in Commission:\n\n• Great Britain (Royal Navy):\n  - Dreadnought Battleships completed (1906–1914): 29\n  - Battlecruisers completed (1908–1914): 9\n  - Total Modern Capital Ships in Commission: 38\n\n• Imperial Germany (Kaiserliche Marine):\n  - Dreadnought Battleships completed (1908–1914): 17\n  - Battlecruisers completed (1909–1914): 7\n  - Total Modern Capital Ships in Commission: 24\n\nResulting Ratio: British capital ship superiority stood at 38 to 24 (1.58 : 1 ratio). In 1913, recognizing that Britain's shipbuilding industry could out-build Germany at a rate of nearly two to one, Germany abandoned its bid for naval parity and redirected military spending back to expanding its land army.",
              context:
                "Despite massive German financial sacrifices and Tirpitz's 'Risk Theory', Britain's overwhelming industrial shipbuilding capacity allowed the Royal Navy to win the naval race decisively, entering August 1914 with a crushing 29-to-17 dreadnought superiority in the North Sea. **Hinge Question:** If Britain won the naval arms race so decisively by 1914, why did the race nevertheless make a European war far more likely?",
              hinge_question:
                'If Britain won the naval arms race so decisively by 1914, why did the race nevertheless make a European war far more likely?',
              question_badge: 'Source Inference',
              question:
                'What does this statistical comparison prove regarding the outcome of the naval race by August 1914?',
              enquiry_question:
                'What does this statistical comparison prove regarding the outcome of the naval race by August 1914?',
              model_answer:
                "The data proves that Great Britain maintained a decisive 29-to-17 superiority in dreadnought battleships, demonstrating that Germany had lost the naval race and could not hope to break Britain's command of the seas.",
              discussion_ideas: [
                'Decisive British industrial victory: Britain out-built Germany in every class of modern warship.',
                'Shift in German strategy: Having lost the naval race, Berlin diverted funds back to expanding its land army in 1912–1913.',
                'Enduring hostility: The naval rivalry permanently destroyed British trust in German intentions.',
              ],
              source_context:
                "Despite massive German financial sacrifices and Tirpitz's 'Risk Theory', Britain's overwhelming industrial shipbuilding capacity allowed the Royal Navy to win the naval race decisively, entering August 1914 with a crushing 29-to-17 dreadnought superiority in the North Sea. **Hinge Question:** If Britain won the naval arms race so decisively by 1914, why did the race nevertheless make a European war far more likely?",
              teacher_notes: {
                source_context:
                  "Despite massive German financial sacrifices and Tirpitz's 'Risk Theory', Britain's overwhelming industrial shipbuilding capacity allowed the Royal Navy to win the naval race decisively, entering August 1914 with a crushing 29-to-17 dreadnought superiority in the North Sea. **Hinge Question:** If Britain won the naval arms race so decisively by 1914, why did the race nevertheless make a European war far more likely?",
              },
              id: 'gw_l3_src_e',
              src: '',
              image: '',
            },
          ],
        },
      ],
      pair_share: {
        prompt:
          'Discuss with your partner: Was the Anglo-German naval arms race the primary cause of World War I, or merely a secondary symptom of deeper imperial tensions?',
        think:
          'Reflect on Paul Kennedy’s view of naval suspicion vs Christopher Clark’s view of Balkan instability.',
        pair: 'Compare the two interpretations with your partner.',
        share: 'Share your combined judgment with the class.',
      },
      tasks: [
        {
          type: 'historical_interpretations',
          topic: 'Question 3: Historiographical Analysis [8 marks • 10 mins]',
          title: 'Historiographical Analysis: The Impact of the Naval Arms Race',
          tariff: 'Question 3: Historiographical Analysis [8 marks • 10 mins]',
          question:
            'Study Interpretations 1 and 2. How do they differ about the causes and impact of the Anglo-German naval arms race? [4 marks] Suggest one reason why they differ. [4 marks]',
          interp1: {
            title: 'Interpretation 1: The Naval Race as Primary Catalyst',
            badge: 'Orthodox Historiography',
            author: 'Professor Paul Kennedy • The Rise of Anglo-German Antagonism',
            text: 'The naval race was the single most dangerous element in pre-1914 European diplomacy. For Britain, naval supremacy was not a luxury; it was the foundation of national survival and empire. When Germany began massing battleships directly across the North Sea, it transformed what had been friendly commercial relations into bitter existential suspicion. British leaders concluded that a German battlefleet could only be designed for one purpose: to destroy British naval power and dominate Europe.',
          },
          interp2: {
            title: 'Interpretation 2: Secondary Factor Overcome by 1912',
            badge: 'Revisionist Historiography',
            author: 'Professor Christopher Clark • The Sleepwalkers',
            text: 'Historians have greatly exaggerated the fatal impact of the naval race. By 1912, the battleship race was effectively over: Germany had abandoned the contest to concentrate resources on its land army, while Britain retained an insurmountable dreadnought lead. What ultimately triggered the catastrophe was not steel battleships in the North Sea, but unstable ethnic nationalism, crumbling imperial frontiers, and fatal alliance commitments in the volatile Balkan peninsula.',
          },
          matrix: [
            {
              col: '1. INTERPRETATION 1 (KENNEDY)',
              text: 'Argues the naval race was the primary existential catalyst that poisoned pre-1914 relations and made war inevitable.',
            },
            {
              col: '2. INTERPRETATION 2 (CLARK)',
              text: 'Argues the naval race was secondary, already resolved by 1912, and overshadowed by Balkan nationalism and land armies.',
            },
            {
              col: '3. HISTORIOGRAPHICAL VERDICT',
              text: 'Weigh both interpretations: Did naval rivalry create the structural hostility that made the 1914 July Crisis uncontrollable?',
            },
          ],
          connectives: [
            'Interpretation 1 contends that...',
            'Paul Kennedy emphasizes that naval supremacy was...',
            'In sharp contrast, Interpretation 2 argues that...',
            'Christopher Clark maintains that by 1912...',
            'One reason why Interpretations 1 and 2 differ is because they have a different focus...',
            'Specifically, Interpretation 1 focuses primarily on the long-term diplomatic polarization between 1898 and 1911...',
            'In contrast, Interpretation 2 focuses more on the immediate short-term Balkan triggers of 1912–1914...',
            'Weighing both perspectives against historical evidence, I conclude that...',
          ],
          model_answer:
            'Interpretations 1 and 2 differ fundamentally about the significance of the Anglo-German naval arms race in causing the outbreak of the First World War.\n\nInterpretation 1, by Paul Kennedy, argues that the naval race was the single most dangerous factor in pre-1914 European diplomacy. Kennedy emphasizes that British naval dominance was existential for national survival and food supply; consequently, Germany’s construction of a High Seas Fleet directly opposite the British coast poisoned friendly commercial ties and convinced British leaders that Berlin was bent on European hegemony.\n\nIn sharp contrast, Interpretation 2, by Christopher Clark, argues that historians have exaggerated the impact of the naval race. Clark stresses that by 1912 the contest was effectively over, as Germany conceded naval defeat to fund its army and Britain held an insurmountable lead. Instead, Clark identifies Balkan ethnic nationalism and rigid alliances as the true triggers of the war.\n\nThese interpretations differ because the historians focus on different chronological periods and causal mechanisms: Kennedy focuses on the long-term diplomatic polarization between 1898 and 1911 that drove Britain into the Entente with France and Russia, whereas Clark focuses on the immediate short-term triggers of 1912–1914 in south-eastern Europe.',
        },
      ],
      quiz: [
        {
          q: 'What revolutionary British battleship was launched in 1906?',
          a: 'HMS Dreadnought',
          options: ['HMS Victory', 'HMS Belfast', 'HMS Dreadnought', 'HMS Invincible'],
        },
        {
          q: 'Which German Admiral was in charge of expanding the German Navy?',
          a: 'Admiral von Tirpitz',
          options: ['Admiral von Tirpitz', 'Admiral Hipper', 'Kaiser Wilhelm II', 'Admiral Scheer'],
        },
        {
          q: 'What policy dictated that the British Royal Navy must be as large as the next two largest navies combined?',
          a: 'Two-Power Standard',
          options: [
            'Splendid Isolation',
            'Naval Supremacy Act',
            'Dreadnought Rule',
            'Two-Power Standard',
          ],
        },
        {
          q: 'Why did HMS Dreadnought transform naval warfare when launched in 1906?',
          a: 'It was the world\'s first all-big-gun battleship powered by modern steam turbines',
          options: [
            'It was the first submarine to dive underwater',
            'It was the world\'s first all-big-gun battleship powered by modern steam turbines',
            'It was completely invisible to enemy lookouts',
            'It could launch aircraft from a wooden flight deck',
          ],
        },
        {
          q: "What was the consequence of the Dreadnought's launch?",
          a: 'It made all older battleships instantly obsolete, resetting the naval race',
          options: [
            'Germany immediately surrendered',
            'It made all older battleships instantly obsolete, resetting the naval race',
            'Britain stopped building ships',
            'France allied with Germany',
          ],
        },
        {
          q: "What was the German 'Risk Theory' proposed by Admiral Tirpitz?",
          a: "Building a navy large enough that Britain wouldn't risk fighting it",
          options: [
            'Building only submarines',
            'Refusing to build any ships to avoid angering Britain',
            "Building a navy large enough that Britain wouldn't risk fighting it",
            'Attacking Britain immediately',
          ],
        },
        {
          q: 'What slogan did the British public chant in 1909 to demand more ships?',
          a: "'We want eight and we won't wait!'",
          options: [
            "'Rule Britannia!'",
            "'Sink the Kaiser!'",
            "'More dreadnoughts now!'",
            "'We want eight and we won't wait!'",
          ],
        },
        {
          q: 'Why did Britain feel so threatened by the German naval expansion?',
          a: 'Britain is an island and relied entirely on its navy for survival and trade',
          options: [
            'Britain is an island and relied entirely on its navy for survival and trade',
            'They were worried Germany would steal their ships',
            'They wanted to attack Germany',
            'They had no army at all',
          ],
        },
        {
          q: 'What laws were passed in Germany to fund their massive naval buildup?',
          a: 'The Naval Laws of 1898 and 1900',
          options: [
            'The Tirpitz Decrees',
            'The Naval Laws of 1898 and 1900',
            'The Imperial Fleet Bills',
            'The Shipyard Acts',
          ],
        },
        {
          q: 'By 1914, who had won the naval race?',
          a: "Britain, with 29 dreadnoughts to Germany's 17",
          options: [
            "Germany, with 30 dreadnoughts to Britain's 10",
            "Britain, with 29 dreadnoughts to Germany's 17",
            'They had exactly the same number',
            'France overtook both of them',
          ],
        },
        {
          q: 'How did the naval race affect British foreign policy?',
          a: "It forced Britain out of 'Splendid Isolation' and into an alliance with France and Russia",
          options: [
            "It forced Britain out of 'Splendid Isolation' and into an alliance with France and Russia",
            'It made them ally with Germany',
            'It caused them to declare war on America',
            'It made them give up their empire',
          ],
        },
      ],
      prologue:
        'For centuries, Britain relied on the Royal Navy to rule the waves and safeguard its global empire. But in 1898, Admiral Tirpitz began building a massive German battle fleet. In 1906, Britain answered with HMS Dreadnought, making all previous warships obsolete. Did the naval arms race make European war inevitable?',
      exam_practice: {
        title:
          'Key Stage 3 Disciplinary Writing: The Anglo-German Naval Arms Race & HMS Dreadnought',
        tariff: '8 marks (Contrasting Historical Interpretations)',
        questions: [
          {
            tariff: '4 marks',
            type: 'interpretations_diff_4m',
            question:
              'Study Interpretations 1 and 2. How do they differ about the causes of the Anglo-German naval arms race? [4 marks]',
            stimulus: [
              'Interpretation 1: Professor Paul Kennedy, The Rise of Anglo-German Antagonism — argues that German naval expansion under Admiral von Tirpitz was a deliberate, provocative bid for world empire and naval challenge to British survival.',
              'Interpretation 2: Professor Christopher Clark, The Sleepwalkers — argues that German naval expansion was defensive and reactive, reflecting legitimate commercial growth, while British panic and anti-German hysteria exaggerated the risk.',
            ],
            prompt:
              'Explain the difference between Kennedy’s view of aggressive German naval challenge and Clark’s view of defensive, legitimate commercial growth exaggerated by British alarm.',
            model:
              'Interpretations 1 and 2 differ fundamentally on the underlying motives behind Germany’s naval building programme. Interpretation 1, advanced by Paul Kennedy, argues that Germany’s naval expansion was a deliberate, aggressive challenge to British global supremacy. Kennedy contends that Admiral von Tirpitz built a high-seas battle fleet with the explicit intention of coercing Britain and securing world empire. In contrast, Interpretation 2, by Christopher Clark, suggests that Germany’s naval build-up was primarily defensive and legitimate, reflecting its burgeoning commercial shipping and overseas trade. Clark argues that German leaders did not intend to provoke war, but that hyper-sensitive British fears and political alarmism unnecessarily escalated the rivalry. Thus, Kennedy views the naval race as German aggression, while Clark views it as mutual miscalculation.',
            scaffolding: {
              acronym: 'Point • Interp 1 • Interp 2 • Contrast',
              acronym_title: 'Edexcel Paper 3 Q3(b) Interpretation Difference Formula',
              steps: [
                {
                  letter: 'POINT',
                  name: 'State the Core Difference',
                  prompt:
                    'State clearly that they differ on whether Germany was an aggressor or acting defensively.',
                  starter: 'Interpretations 1 and 2 differ fundamentally on...',
                },
                {
                  letter: 'INTERP 1',
                  name: 'Exemplify Kennedy (Deliberate Challenge)',
                  prompt:
                    'Quote or summarize Kennedy on Tirpitz, challenge to British survival, and bid for empire.',
                  starter: 'Interpretation 1 argues that...',
                },
                {
                  letter: 'INTERP 2',
                  name: 'Exemplify Clark (Defensive & Exaggerated)',
                  prompt:
                    'Quote or summarize Clark on legitimate trade, defensive intentions, and British panic.',
                  starter: 'In contrast, Interpretation 2 suggests that...',
                },
                {
                  letter: 'CONTRAST',
                  name: 'Synthesize the Divergence',
                  prompt:
                    'Explicitly synthesize the difference between intentional aggression and mutual misjudgment.',
                  starter: 'This is a fundamental difference because...',
                },
              ],
              sentence_starters: [
                'Interpretations 1 and 2 differ on...',
                'Interpretation 1 argues that...',
                'In contrast, Interpretation 2 suggests that...',
                'This is a difference because...',
              ],
              connectives_bank: [
                'Paul Kennedy',
                'Christopher Clark',
                'Admiral von Tirpitz',
                'Risk Theory',
                'HMS Dreadnought',
                'aggressive challenge vs defensive trade',
              ],
            },
          },
          {
            tariff: '4 marks',
            type: 'interpretations_reason_4m',
            question:
              'Suggest one reason why Interpretations 1 and 2 differ about the causes of the naval arms race. [4 marks]',
            prompt:
              'Explain why Kennedy and Clark arrive at different conclusions. Consider their differing evidence bases, historiographical perspectives (intentionalist vs revisionist), and focus.',
            model:
              'One reason why Interpretations 1 and 2 differ is that the historians prioritize different archival evidence and write from contrasting historiographical paradigms. Paul Kennedy adopts an intentionalist, geopolitical framework, focusing heavily on internal German Admiralty planning documents, Tirpitz’s "Risk Theory", and Kaiser Wilhelm II’s aggressive bellicose speeches. This evidence emphasizes Germany’s conscious intention to challenge Britain. In contrast, Christopher Clark adopts a revisionist, multi-polar approach in "The Sleepwalkers", focusing on diplomatic misunderstandings, domestic political pressures within the British cabinet, and the psychology of decision-makers across Europe. Because Clark examines how fear and domestic paranoia distorted rational diplomacy, he reaches a conclusion emphasizing mutual panic rather than one-sided German culpability.',
            scaffolding: {
              acronym: 'Historiographical Framework • Evidence Focus • Synthesis',
              acronym_title: 'Edexcel Paper 3 Q3(c) Why Interpretations Differ Formula',
              steps: [
                {
                  letter: 'REASON',
                  name: 'Historiographical Focus',
                  prompt:
                    'Identify that Kennedy uses German military planning, while Clark examines multi-polar psychology.',
                  starter:
                    'One reason why Interpretations 1 and 2 differ is because they focus on...',
                },
                {
                  letter: 'AUTHOR 1',
                  name: 'Kennedy’s Intentionalist Focus',
                  prompt:
                    'Explain Kennedy uses Tirpitz’s memos and Wilhelm II’s speeches to show deliberate planning.',
                  starter:
                    'Specifically, Paul Kennedy focuses on German Admiralty archives and Tirpitz’s Risk Theory...',
                },
                {
                  letter: 'AUTHOR 2',
                  name: 'Clark’s Multi-Polar Focus',
                  prompt:
                    'Explain Clark evaluates British domestic panic, cabinet rhetoric, and mutual sleepwalking.',
                  starter:
                    'In contrast, Christopher Clark analyzes broader diplomatic psychology and British over-reaction...',
                },
              ],
              sentence_starters: [
                'One reason why Interpretations 1 and 2 differ is because they rely on different evidence...',
                'Specifically, Interpretation 1 focuses primarily on German Admiralty documents that show...',
                'In contrast, Interpretation 2 evaluates multi-polar diplomatic fears and...',
                'As a result, the authors reach different conclusions because...',
              ],
              connectives_bank: [
                'intentionalist historiography',
                'revisionist history',
                'Tirpitz memos',
                'Risk Theory',
                'British naval panic',
                'multi-polar diplomacy',
              ],
            },
          },
        ],
      },
      sources: [
        {
          letter: 'A',
          id: 'gw_l3_src_a',
          type: 'written',
          title:
            'Source A (Statute Law): The Naval Defence Act 1889 (The Two-Power Standard, 52 & 53 Vict. c. 8)',
          context:
            'Passed in 1889, the Naval Defence Act legally committed Great Britain to maintain a Royal Navy battle fleet equal to or greater than the combined naval strength of the next two largest navies in the world (France and Russia). **Hinge Question:** Why did Great Britain consider maintaining a battlefleet twice the size of rival nations to be an existential necessity rather than an act of aggression?',
          hinge_question:
            'Why did Great Britain consider maintaining a battlefleet twice the size of rival nations to be an existential necessity rather than an act of aggression?',
          text: '“For the safety of the United Kingdom, the protection of commerce, and the security of the colonies, it is expedient to make provisions for building and equipping seventy ships of war... The standard of naval strength which this nation must invariably maintain is that the battle fleet of the Royal Navy should at least be equal to the combined strength of any two of the next strongest naval powers in the world.”',
          caption:
            'Source A: Extract from the preamble of the Naval Defence Act 1889 formalising the British Two-Power Standard.',
          question_badge: 'Strategic Doctrine',
          question:
            'According to the 1889 Act, why was the Royal Navy required to match the strength of the next two largest navies combined?',
          enquiry_question:
            'According to the 1889 Act, why was the Royal Navy required to match the strength of the next two largest navies combined?',
          model_answer:
            'The Act stated that maintaining a fleet equal to the next two largest navies was essential to protect Britain from invasion, secure its worldwide merchant trade routes, and protect its overseas empire.',
          source_context:
            'Passed in 1889, the Naval Defence Act legally committed Great Britain to maintain a Royal Navy battle fleet equal to or greater than the combined naval strength of the next two largest navies in the world (France and Russia). **Hinge Question:** Why did Great Britain consider maintaining a battlefleet twice the size of rival nations to be an existential necessity rather than an act of aggression?',
          teacher_notes: {
            source_context:
              'Passed in 1889, the Naval Defence Act legally committed Great Britain to maintain a Royal Navy battle fleet equal to or greater than the combined naval strength of the next two largest navies in the world (France and Russia). **Hinge Question:** Why did Great Britain consider maintaining a battlefleet twice the size of rival nations to be an existential necessity rather than an act of aggression?',
          },
          src: '',
          image: '',
        },
        {
          letter: 'B',
          type: 'written',
          title:
            'Source B (German Imperial Legislation): The Second German Naval Law (Flottengesetz), Preamble (1900)',
          text: "To protect Germany's sea trade and colonies, there is only one means: Germany must have a battle fleet so strong that even for the adversary with the greatest sea power [Great Britain], a war against it would involve such perils as to imperil the position of that Power as a world power... It is not necessary for this purpose that the German battle fleet should be as strong as that of the greatest sea power at all times, because the greatest sea power will generally not be in a position to concentrate all of its forces against us.",
          caption:
            "Official preamble to the Second German Naval Law drafted by State Secretary Alfred von Tirpitz, defining Germany's strategic 'Risk Theory' (Risikogedanke).",
          citation: 'Reichsgesetzblatt 1900, No. 21, pp. 255–259 (Imperial German Law Gazette).',
          context:
            "Under Admiral Alfred von Tirpitz, Germany passed a series of Naval Laws aiming to build a battle fleet so powerful that Britain would not dare challenge it without risking its own naval supremacy. This 'Risk Theory' directly threatened Britain's national security. **Hinge Question:** Why did Germany's 'Risk Theory' backfire catastrophically by pushing Britain to abandon its policy of 'splendid isolation'?",
          hinge_question:
            "Why did Germany's 'Risk Theory' backfire catastrophically by pushing Britain to abandon its policy of 'splendid isolation'?",
          question_badge: 'Author’s Purpose',
          question:
            "Why did Admiral von Tirpitz emphasize that Germany did not need a fleet as large as Britain's in this preamble?",
          enquiry_question:
            "Why did Admiral von Tirpitz emphasize that Germany did not need a fleet as large as Britain's in this preamble?",
          model_answer:
            "Tirpitz argued that because Britain's navy had to guard an enormous global empire, a concentrated German fleet in the North Sea only needed to be large enough to make a British attack too risky to contemplate.",
          discussion_ideas: [
            'Calculated deterrence: Tirpitz believed Britain would make diplomatic concessions rather than risk combat.',
            'Strategic delusion: Underestimated British willingness to concentrate its global fleets in the North Sea.',
            'Arms race catalyst: Triggered immediate British counter-construction rather than intimidation.',
          ],
          source_context:
            "Under Admiral Alfred von Tirpitz, Germany passed a series of Naval Laws aiming to build a battle fleet so powerful that Britain would not dare challenge it without risking its own naval supremacy. This 'Risk Theory' directly threatened Britain's national security. **Hinge Question:** Why did Germany's 'Risk Theory' backfire catastrophically by pushing Britain to abandon its policy of 'splendid isolation'?",
          teacher_notes: {
            source_context:
              "Under Admiral Alfred von Tirpitz, Germany passed a series of Naval Laws aiming to build a battle fleet so powerful that Britain would not dare challenge it without risking its own naval supremacy. This 'Risk Theory' directly threatened Britain's national security. **Hinge Question:** Why did Germany's 'Risk Theory' backfire catastrophically by pushing Britain to abandon its policy of 'splendid isolation'?",
          },
          id: 'gw_l3_src_b',
          src: '',
          image: '',
        },
        {
          letter: 'C',
          type: 'written',
          title:
            'Source C (Confidential Memorandum): Admiral Sir John Fisher, Memorandum to the Admiralty Board (1904)',
          text: 'The sole purpose of the British Navy is to strike the enemy instantly and decisively. Our only probable enemy is Germany. Germany keeps her whole fleet concentrated within a few hours of England. We must keep a fleet twice as powerful concentrated within a few hours of Germany... My new design of battleship [HMS Dreadnought] will be armed only with twelve-inch guns and driven by turbine engines. It will out-range and out-steam any warship floating, rendering every foreign navy obsolescent at a single stroke.',
          caption:
            "Confidential policy paper submitted by Admiral Sir John 'Jackie' Fisher to the British Board of Admiralty, detailing the strategic justification for building HMS Dreadnought.",
          citation: 'The National Archives, Kew (ADM 1/7734 / Fisher Papers, Vol. 1).',
          context:
            "Upon becoming First Sea Lord in 1904, Admiral Fisher reorganized the entire Royal Navy, recalling battleships from across the empire to concentrate overwhelming force in home waters against the German High Seas Fleet. **Hinge Question:** How did Fisher's decision to build Dreadnought paradoxically erase Britain's massive numerical advantage in older battleships?",
          hinge_question:
            "How did Fisher's decision to build Dreadnought paradoxically erase Britain's massive numerical advantage in older battleships?",
          question_badge: 'Source Inference',
          question:
            "What does Admiral Fisher's memorandum reveal about the Royal Navy's primary strategic focus by 1904?",
          enquiry_question:
            "What does Admiral Fisher's memorandum reveal about the Royal Navy's primary strategic focus by 1904?",
          model_answer:
            'The memorandum reveals that the Admiralty had completely reoriented British naval strategy to treat Germany as its primary existential threat, concentrating overwhelming firepower in the North Sea to counter the German fleet.',
          discussion_ideas: [
            'Single-minded focus on Germany: Replaced traditional French or Russian rivals with Berlin as the chief enemy.',
            "Technological radicalism: Willing to render Britain's own pre-dreadnought fleet obsolete to stay ahead.",
            'Global fleet recall: Ended the historic practice of scattering warships across distant colonial stations.',
          ],
          source_context:
            "Upon becoming First Sea Lord in 1904, Admiral Fisher reorganized the entire Royal Navy, recalling battleships from across the empire to concentrate overwhelming force in home waters against the German High Seas Fleet. **Hinge Question:** How did Fisher's decision to build Dreadnought paradoxically erase Britain's massive numerical advantage in older battleships?",
          teacher_notes: {
            source_context:
              "Upon becoming First Sea Lord in 1904, Admiral Fisher reorganized the entire Royal Navy, recalling battleships from across the empire to concentrate overwhelming force in home waters against the German High Seas Fleet. **Hinge Question:** How did Fisher's decision to build Dreadnought paradoxically erase Britain's massive numerical advantage in older battleships?",
          },
          id: 'gw_l3_src_c',
          src: '',
          image: '',
        },
        {
          letter: 'D',
          type: 'visual',
          title:
            'Source D (Political Cartoon): L. M. Glackens, "No Limit: A 1909 Cartoon on the Naval Race" (Puck, 1909)',
          image: '/units/great_war/assets/Naval-race-1909.jpg',
          src: '/units/great_war/assets/Naval-race-1909.jpg',
          is_artwork: true,
          caption:
            'Cover of American satirical magazine Puck (22 September 1909) drawn by L. M. Glackens, satirizing the global naval arms race as an uncapped poker game where Japan, Britain, Germany, and the United States gamble battleships and dreadnoughts.',
          citation:
            'Puck Magazine, New York (Vol. LXVI, No. 1699, 22 September 1909) / Library of Congress Prints and Photographs Division (LC-DIG-ppmsca-26327).',
          context:
            "By 1909, the dreadnought revolution had spread far beyond Britain and Germany into a global arms competition involving the United States and the Empire of Japan. American satirical illustrator L. M. Glackens depicted the Great Powers gathered around an uncapped poker table ('No Limit'), recklessly betting cruisers and dreadnoughts in a spiraling cycle of bluff and escalation where no player could afford to fold. **Hinge Question:** How does the poker metaphor in Glackens's cartoon explain why nations find it psychologically and strategically impossible to stop an arms race once it begins?",
          hinge_question:
            "How does the poker metaphor in Glackens's cartoon explain why nations find it psychologically and strategically impossible to stop an arms race once it begins?",
          question_badge: 'Author’s Purpose',
          question:
            "What does the artist's comparison of the naval arms race to an uncapped poker game suggest about international diplomacy in 1909?",
          enquiry_question:
            "What does the artist's comparison of the naval arms race to an uncapped poker game suggest about international diplomacy in 1909?",
          model_answer:
            'The artist suggests that the naval arms race had become a reckless, out-of-control gamble where imperial powers were compelled to continuously raise their military stakes with dreadnoughts, unable to stop without losing international prestige.',
          discussion_ideas: [
            'Global scope: Demonstrates that the dreadnought revolution impacted Japan and America alongside Britain and Germany.',
            'Psychological escalation: Depicting nations as poker players highlights how pride, bluff, and fear drove building programmes.',
            'Financial exhaustion: Shows the immense stacks of national wealth being gambled away on warships.',
          ],
          source_context:
            "By 1909, the dreadnought revolution had spread far beyond Britain and Germany into a global arms competition involving the United States and the Empire of Japan. American satirical illustrator L. M. Glackens depicted the Great Powers gathered around an uncapped poker table ('No Limit'), recklessly betting cruisers and dreadnoughts in a spiraling cycle of bluff and escalation where no player could afford to fold. **Hinge Question:** How does the poker metaphor in Glackens's cartoon explain why nations find it psychologically and strategically impossible to stop an arms race once it begins?",
          teacher_notes: {
            source_context:
              "By 1909, the dreadnought revolution had spread far beyond Britain and Germany into a global arms competition involving the United States and the Empire of Japan. American satirical illustrator L. M. Glackens depicted the Great Powers gathered around an uncapped poker table ('No Limit'), recklessly betting cruisers and dreadnoughts in a spiraling cycle of bluff and escalation where no player could afford to fold. **Hinge Question:** How does the poker metaphor in Glackens's cartoon explain why nations find it psychologically and strategically impossible to stop an arms race once it begins?",
          },
          id: 'gw_l3_src_d',
        },
        {
          letter: 'E',
          type: 'written',
          title:
            'Source E (Official Admiralty Statistics): British vs German Dreadnought Capital Ship Deliveries (1906–1914)',
          caption:
            'Official return presented to the British Parliament in March 1914 by the Admiralty, recording capital ship construction totals between Great Britain and Imperial Germany.',
          citation:
            'Admiralty Naval Intelligence Division, London / Parliamentary Command Paper (Cd. 7310, Naval Estimates Return, March 1914).',
          text: "Official Admiralty Return to the House of Commons (March 1914): Comparative Capital Ship Strength in Commission:\n\n• Great Britain (Royal Navy):\n  - Dreadnought Battleships completed (1906–1914): 29\n  - Battlecruisers completed (1908–1914): 9\n  - Total Modern Capital Ships in Commission: 38\n\n• Imperial Germany (Kaiserliche Marine):\n  - Dreadnought Battleships completed (1908–1914): 17\n  - Battlecruisers completed (1909–1914): 7\n  - Total Modern Capital Ships in Commission: 24\n\nResulting Ratio: British capital ship superiority stood at 38 to 24 (1.58 : 1 ratio). In 1913, recognizing that Britain's shipbuilding industry could out-build Germany at a rate of nearly two to one, Germany abandoned its bid for naval parity and redirected military spending back to expanding its land army.",
          context:
            "Despite massive German financial sacrifices and Tirpitz's 'Risk Theory', Britain's overwhelming industrial shipbuilding capacity allowed the Royal Navy to win the naval race decisively, entering August 1914 with a crushing 29-to-17 dreadnought superiority in the North Sea. **Hinge Question:** If Britain won the naval arms race so decisively by 1914, why did the race nevertheless make a European war far more likely?",
          hinge_question:
            'If Britain won the naval arms race so decisively by 1914, why did the race nevertheless make a European war far more likely?',
          question_badge: 'Source Inference',
          question:
            'What does this statistical comparison prove regarding the outcome of the naval race by August 1914?',
          enquiry_question:
            'What does this statistical comparison prove regarding the outcome of the naval race by August 1914?',
          model_answer:
            "The data proves that Great Britain maintained a decisive 29-to-17 superiority in dreadnought battleships, demonstrating that Germany had lost the naval race and could not hope to break Britain's command of the seas.",
          discussion_ideas: [
            'Decisive British industrial victory: Britain out-built Germany in every class of modern warship.',
            'Shift in German strategy: Having lost the naval race, Berlin diverted funds back to expanding its land army in 1912–1913.',
            'Enduring hostility: The naval rivalry permanently destroyed British trust in German intentions.',
          ],
          source_context:
            "Despite massive German financial sacrifices and Tirpitz's 'Risk Theory', Britain's overwhelming industrial shipbuilding capacity allowed the Royal Navy to win the naval race decisively, entering August 1914 with a crushing 29-to-17 dreadnought superiority in the North Sea. **Hinge Question:** If Britain won the naval arms race so decisively by 1914, why did the race nevertheless make a European war far more likely?",
          teacher_notes: {
            source_context:
              "Despite massive German financial sacrifices and Tirpitz's 'Risk Theory', Britain's overwhelming industrial shipbuilding capacity allowed the Royal Navy to win the naval race decisively, entering August 1914 with a crushing 29-to-17 dreadnought superiority in the North Sea. **Hinge Question:** If Britain won the naval arms race so decisively by 1914, why did the race nevertheless make a European war far more likely?",
          },
          id: 'gw_l3_src_e',
          src: '',
          image: '',
        },
      ],
    },
    {
      id: 'lesson_4',
      causal_domino_spine: {
        title: 'Alliance Systems & Balkan Powder Keg: Chronology Spine',
        subtitle: 'Key Turning Points & Causal Dominoes (M-A-I-N Framework)',
        stages: [
          {
            step: 1,
            para_ref: '[4.1]',
            date: '1879–1882',
            title: 'The Triple Alliance Formed',
            actor: 'Germany, Austria-Hungary & Italy',
            tag: '🤝 ALLIANCES',
            trigger:
              'Germany and Austria-Hungary sign the Dual Alliance (1879) for mutual defence against Russia; Italy joins in 1882 to form the Triple Alliance.',
            connective:
              'Created a formidable Central European military bloc that alarmed France and Tsarist Russia.',
            question: "How did Bismarck's Dual Alliance create a Central European bloc?",
          },
          {
            step: 2,
            para_ref: '[4.2]',
            date: '1894–1907',
            title: 'The Triple Entente Emerges',
            actor: 'France, Russia & Great Britain',
            tag: '🤝 ALLIANCES',
            trigger:
              'France and Russia sign a military alliance (1894); Britain settles colonial disputes with France (1904) and Russia (1907) to complete the Triple Entente.',
            connective:
              'Cleanly divided Europe into two rival armed camps, ensuring any localized clash would drag all major powers into war.',
            question: 'Explain why the 1894 Franco-Russian Alliance broke isolation.',
          },
          {
            step: 3,
            para_ref: '[4.3]',
            date: '1900–1908',
            title: 'The Balkan Powder Keg',
            actor: 'Balkan States & Ottoman Empire',
            tag: '🚩 NATIONALISM',
            trigger:
              'As the Ottoman Empire weakens in Southeastern Europe, newly independent Serbia seeks to unite all South Slavs into a "Greater Serbia".',
            connective:
              'Austria-Hungary viewed Serbian nationalism as a mortal threat to the survival of its multi-ethnic empire.',
            question: 'Why was south-eastern Europe known as the "Balkan Powder Keg"?',
          },
          {
            step: 4,
            para_ref: '[4.4]',
            date: 'October 1908',
            title: 'The Bosnian Annexation Crisis',
            actor: 'Austria-Hungary, Serbia & Russia',
            tag: '🚩 NATIONALISM',
            trigger:
              'Austria-Hungary formally annexes Bosnia; Germany threatens war if Russia intervenes to protect Serbia, forcing Russia to back down.',
            connective:
              'Humiliated Russia vowed it would never back down again in the Balkans, and Serbian hostility towards Austria peaked.',
            question: 'What were the consequences of the 1908 Bosnian Annexation Crisis?',
          },
          {
            step: 5,
            para_ref: '[4.5]',
            date: '1912–1913',
            title: 'The Balkan Wars (Serbia Doubles)',
            actor: 'The Balkan League & Serbia',
            tag: '🎖️ MILITARISM',
            trigger:
              'Two bloody wars push the Ottoman Empire out of Europe; Serbia doubles in size and equips an army of 400,000 battle-hardened troops.',
            connective:
              'Convinced Austrian military chiefs that Serbia must be crushed in a pre-emptive strike at the earliest opportunity.',
            question: 'To what extent did the 1912–13 Balkan Wars embolden Serbia?',
          },
        ],
      },
      video: [
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=dYrofaDfMKI',
          title: 'Tinderbox Europe - From Balkan Troubles to World War I | Prelude to WW1',
          duration: '7 mins 37 secs',
          pathway: 'Starter Hook',
          teacher_guidance:
            'The Great War channel explores the decaying Ottoman Empire ("Sick Man of Europe"), Austro-Hungarian expansionism, the Bosnian Crisis of 1908, and the Balkan Wars of 1912–13. Recommended Watch Window: 00:30–04:45 • Lesson Phase: Quick Starter Check (0–3m). Tone Alert: Fast, accessible military history breakdown of Balkan ethnic and geopolitical tensions.',
          viewing_task:
            "<ol><li><strong>[01:15] Quick Check:</strong> Which Slavic kingdom emerged doubled in size and military confidence following the First and Second Balkan Wars (1912–1913), becoming Austria-Hungary's deadliest regional adversary?</li><li><strong>[03:10] Hinge Question:</strong> How did Austria-Hungary's illegal annexation of Bosnia-Herzegovina in 1908 push Serbia into the arms of Tsarist Russia and plant the seeds for the assassination of Franz Ferdinand?</li></ol>",
          model_answer:
            '<ol><li><strong>Quick Check:</strong> The Kingdom of Serbia.</li><li><strong>Hinge Question:</strong> Bosnia had a large Slavic population that Serb nationalists believed belonged inside a unified "Greater Serbia". When Austria annexed Bosnia and Germany backed the move with an ultimatum ("the blank cheque of 1908"), Russia was forced to back down in humiliation because its military was unready after the Russo-Japanese War. Russia vowed never to back down again, while Serbian secret societies like the Black Hand swore to liberate Bosnia through revolutionary violence.</li></ol>',
        },
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=c7nUDLKKEBY',
          title: 'How Did WW1 Start? | Causes of the First World War | Imperial War Museums',
          duration: '9 mins 19 secs',
          pathway: 'Enquiry Evidence',
          teacher_guidance:
            'IWM senior historian Anthony Richards deconstructs the interconnected causes of 1914: the Triple Alliance vs. Triple Entente, militarism, the Schlieffen Plan, and mobilization timetables. Recommended Watch Window: 01:00–06:30 • Lesson Phase: Guided Instruction & Archival Investigation. Tone Alert: Authoritative museum curator documentary featuring original primary documents.',
          viewing_task:
            "<ol><li><strong>[01:45] Recall:</strong> Name the three nations comprising the Triple Alliance (formed 1882) and the three nations comprising the Triple Entente (formalized 1907).</li><li><strong>[03:30] Explain:</strong> Explain how Germany's Schlieffen Plan was trapped by strict railway mobilization timetables: why did German military dogma require declaring war on France the moment Russia began mobilizing?</li><li><strong>[05:15] Challenge:</strong> Evaluate whether the alliance system made World War I inevitable or whether it was intended as a defensive deterrent that failed under diplomatic pressure in 1914.</li></ol>",
          model_answer:
            "<ol><li><strong>Recall:</strong> Triple Alliance: Germany, Austria-Hungary, and Italy. Triple Entente: Great Britain, France, and Russia.</li><li><strong>Explain:</strong> The German General Staff calculated that vast, slow Russia would take six weeks to mobilize its army. Field Marshal Schlieffen's plan required Germany to launch an immediate, massive knockout blow against France through neutral Belgium, capture Paris in 39 days, and then turn its armies eastward by rail to face Russia before the Tsar's troops arrived. Because the plan depended entirely on rigid railway schedules, Germany could not wait for diplomacy; Russian mobilization forced Germany to attack France immediately.</li><li><strong>Challenge:</strong> The alliances were originally designed as defensive deterrents: Bismarck calculated that a power would hesitate to attack if it faced a coalition. However, by linking the great powers in reciprocal obligations, the system functioned like a string of dynamite. When Austria attacked Serbia, it dragged in Russia, which triggered German mobilization, French participation, and British intervention to defend Belgian neutrality.</li></ol>",
        },
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=f11CKYB2FCA',
          title: 'Europe Prior to World War I: Alliances and Enemies | Prelude to WW1',
          duration: '9 mins 47 secs',
          pathway: 'Strategic Overview',
          teacher_guidance:
            'In-depth strategic breakdown of European diplomatic treaties: the 1879 Dual Alliance, the 1882 Triple Alliance, the 1894 Franco-Russian Alliance, and the 1907 Anglo-Russian Convention. Recommended Watch Window: 00:45–06:00 • Lesson Phase: Guided Instruction & Disciplinary Analysis. Tone Alert: Comprehensive geopolitical analysis.',
          viewing_task:
            '<ol><li><strong>[01:30] Recall:</strong> In what year did Great Britain and Tsarist Russia settle their long-standing imperial rivalry across Central Asia (the "Great Game"), finalizing the Triple Entente?</li><li><strong>[03:40] Explain:</strong> Why was Italy the "weak link" of the Triple Alliance, and why did it declare neutrality in August 1914 before joining the Entente in 1915?</li><li><strong>[05:20] Challenge:</strong> Analyze the dilemma facing the Austro-Hungarian Dual Monarchy: why did Vienna fear that growing South Slav nationalism inside its empire would lead to total imperial dismemberment?</li></ol>',
          model_answer:
            '<ol><li><strong>Recall:</strong> 1907 (the Anglo-Russian Convention).</li><li><strong>Explain:</strong> Italy had deep historical and territorial rivalries with Austria-Hungary over ethnic Italian lands (such as Trentino and Trieste) controlled by the Habsburgs. Because the Triple Alliance treaty was strictly defensive and Austria-Hungary had acted as the aggressor by invading Serbia, Italy argued it was not legally obligated to fight, eventually entering the war on the Allied side in 1915 after being promised Austro-Hungarian territories in the secret Treaty of London.</li><li><strong>Challenge:</strong> The Habsburg Empire was a fragile mosaic of eleven distinct nationalities (Germans, Hungarians, Czechs, Slovaks, Poles, Ukrainians, Croats, Serbs, Slovenes, Romanians, and Italians). If Serbia succeeded in uniting all South Slavs under Belgrade, the Austro-Hungarian Empire would unravel from within. Vienna viewed Serbia not just as a pesky regional neighbor, but as a mortal threat that had to be crushed militarily to preserve imperial survival.</li></ol>',
        },
        {
          type: 'era',
          url: 'https://era.org.uk/streaming-service-resource/1-the-approach-of-war-history-file/',
          title: 'BBC / ERA: History File – The Approach of War',
          duration: '20 mins 00 secs',
          pathway: 'Archival Documentary',
          teacher_guidance:
            'Classic BBC educational documentary examining the diplomatic road to war: militarism, the naval race, arms budgets, and the fatal July Crisis. Recommended Watch Window: 01:30–07:45 • Lesson Phase: Guided Instruction & Archival Investigation. Tone Alert: Scholarly BBC educational documentary with primary newsreels.',
          viewing_task:
            '<ol><li><strong>[02:15] Recall:</strong> What percentage did military spending among the major European powers increase between 1870 and 1914?</li><li><strong>[04:30] Explain:</strong> How did universal conscription and the growth of standing peacetime armies of millions of men create a momentum towards war that civilian politicians could not halt?</li><li><strong>[06:45] Challenge:</strong> Evaluate the role of the press and public opinion in 1914: did bellicose newspaper headlines force politicians into aggressive stances?</li></ol>',
          model_answer:
            '<ol><li><strong>Recall:</strong> Military spending increased by over 300%.</li><li><strong>Explain:</strong> European powers (except Britain) maintained compulsory peacetime conscription, training millions of young men into reserves. Once a government ordered mobilization, millions of men reported to railheads within 24 hours. Because halting mobilization would leave a country completely defenseless against an advancing enemy, the military mobilization process effectively took decision-making away from diplomats and placed it in the hands of railway generals.</li><li><strong>Challenge:</strong> Cheap mass-circulation newspapers ("the gutter press") sensationalized international crises to boost sales, printing xenophobic cartoons and exaggerating foreign threats. This whipped up patriotic war hysteria among urban populations, making it politically suicidal for leaders like Bethmann-Hollweg or Sazonov to appear weak or propose compromise.</li></ol>',
        },
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=y-TmbOy4Jwg',
          title: '6 Key Steps to World War One | History Hit',
          duration: '24 mins 26 secs',
          pathway: 'Curricular Overview',
          teacher_guidance:
            'Structured analytical breakdown synthesizing the six structural causal steps to war: imperial friction, naval competition, military alliances, the Balkan powder keg, Sarajevo, and the July cascade. Recommended Watch Window: 02:00–08:15 • Lesson Phase: Synoptic Synthesis & Revision. Tone Alert: Clear, engaging presenter-led synthesis.',
          viewing_task:
            '<ol><li><strong>[03:00] Recall:</strong> What are the four traditional "MAIN" long-term causes of the First World War taught by historians?</li><li><strong>[05:15] Explain:</strong> How did Germany\'s decision to give Austria-Hungary the unconditional "Blank Cheque" (<em>Blankoscheck</em>) on 5 July 1914 transform a localized Balkan dispute into a world war?</li><li><strong>[07:30] Challenge:</strong> Historiographical Synthesis: Assess Fritz Fischer\'s controversial thesis that imperial Germany deliberately orchestrated the July Crisis to wage a pre-emptive war of European conquest.</li></ol>',
          model_answer:
            '<ol><li><strong>Recall:</strong> Militarism, Alliances, Imperialism, and Nationalism (MAIN).</li><li><strong>Explain:</strong> Kaiser Wilhelm II and Chancellor Bethmann-Hollweg promised unconditional German military support to Emperor Franz Joseph, even if punishing Serbia provoked Russia into war. This reckless pledge gave Austro-Hungarian hawks the confidence to issue an impossible ultimatum to Serbia, knowing Germany would protect them from Russian intervention.</li><li><strong>Challenge:</strong> Fischer argued that German leaders intentionally exploited Sarajevo to launch a pre-emptive war before Russia completed its "Great Military Programme" in 1917, seeking continental domination (the <em>Septemberprogramm</em>). However, contemporary historians (such as Christopher Clark in <em>The Sleepwalkers</em>) argue that war was an unintended tragedy of collective failure, where multiple leaders took reckless risks without anticipating the catastrophic conflagration they would unleash.</li></ol>',
        },
      ],
      skill: 'Interpretation & Alliances: The Alliance System & The Balkan Powder Keg',
      title: 'Enquiry 4: The Alliance Systems & the Balkan Powder Keg (1879–1913)',
      subtitle:
        'From the Dual Alliance and Triple Entente to the Bosnian Annexation and Balkan Wars',
      enquiryQuestion:
        'Did European military alliances protect continental peace or guarantee a domino-effect catastrophe?',
      a4_map: [
        '/units/great_war/assets/map_lesson4.png',
        '/units/great_war/assets/balkans_1914_simple_map.png',
      ],
      banner: {
        image: '/units/great_war/assets/map_lesson4.png',
        position: 'center 30%',
        caption:
          'Geopolitical cartography of Europe in 1914 illustrating the division into the Triple Entente and Triple Alliance.',
      },
      margin_spine: [
        {
          year: '1879–1882',
          label: 'Triple Alliance',
        },
        {
          year: '1894–1907',
          label: 'Triple Entente',
        },
        {
          year: '1900–1908',
          label: 'Balkan Powder Keg',
        },
        {
          year: 'Oct 1908',
          label: 'Bosnian Annexation',
        },
        {
          year: '1912–1913',
          label: 'Balkan Wars',
        },
      ],
      teacher_notes: {
        primer:
          'This enquiry examines how Europe was divided into two armed, rival treaty coalitions: the Triple Alliance (Germany, Austria-Hungary, Italy) and the Triple Entente (Britain, France, Russia). While originally intended as defensive deterrents to maintain peace through mutual balance, these rigid military pacts created an explosive tripwire mechanism. The enquiry investigates why south-eastern Europe was known as the "Balkan Powder Keg," analyzing how Ottoman imperial decay, Pan-Slavic nationalism, and Austro-Russian rivalry converged during the 1908 Bosnian Annexation Crisis and the 1912–13 Balkan Wars, leaving Serbia triumphant and Austrian leaders desperate for a pre-emptive strike.',
        objectives: [
          {
            objective:
              'Explain how the Triple Alliance and Triple Entente divided Europe into two armed camps.',
            primer:
              'Focus on paragraphs [4.1] and [4.2]. Trace the formation of Bismarck’s Dual Alliance (1879), the Franco-Russian Alliance (1894), and the 1907 Anglo-Russian Convention.',
            question:
              'How did alliances intended to deter enemies instead create a dangerous "domino effect"?',
          },
          {
            objective: 'Analyze why the Balkans became the "Powder Keg of Europe".',
            primer:
              'Direct students to paragraph [4.3]. Explain the collapse of Ottoman authority and the clash between Serbian Pan-Slavic dreams and Austro-Hungarian imperial survival.',
            question:
              'Why did the Austro-Hungarian Empire view a rising independent Serbia as a mortal threat?',
          },
          {
            objective:
              'Evaluate the consequences of the 1908 Bosnian Crisis and the 1912–13 Balkan Wars.',
            primer:
              'Focus on paragraphs [4.4] and [4.5]. Highlight Russian humiliation when forced to back down under German threats, vowing never to retreat again.',
            question:
              'Why did Russia’s retreat in 1908 guarantee that the Tsar would mobilize his army in 1914?',
          },
        ],
        source_context:
          'Primary political cartoon titled "The Boiling Point" (Punch, October 1912) depicting the major European monarchs (Kaiser Wilhelm II, Emperor Franz Joseph, King George V, Tsar Nicholas II, and the Sultan of Turkey) desperately sitting on the bubbling lid of a pot labeled "Balkan Troubles". The cartoon illustrates the widespread contemporary awareness that regional ethnic violence and nationalism in south-eastern Europe was threatening to boil over and engulf the entire continent in an uncontrollable conflagration. **Hinge Question:** Why did contemporary cartoonists depict the Balkans as an uncontrollable pot about to explode?',
      },
      do_now: {
        title: 'Do Now: Arms Race & Unification Recall',
        type: 'mixed',
        items: [
          {
            question: 'What was the revolutionary British battleship launched in 1906?',
            answer: 'HMS Dreadnought',
          },
          {
            question:
              'What official British policy required the Royal Navy to equal the next two navies combined?',
            answer: 'The Two-Power Standard',
          },
          {
            question: 'Which German Admiral drafted the Naval Laws and "Risk Theory"?',
            answer: 'Admiral Alfred von Tirpitz',
          },
          {
            question:
              'What secret treaty did Bismarck sign with Russia in 1887 that lapsed in 1890?',
            answer: 'The Reinsurance Treaty',
          },
          {
            question:
              'Which country allied with Russia in 1894 after the Reinsurance Treaty expired?',
            answer: 'France',
          },
        ],
      },
      vocab: [
        {
          term: 'Triple Alliance',
          definition:
            'The defensive military treaty signed in 1882 uniting Germany, Austria-Hungary, and Italy against rival Great Powers.',
          syllables: 'tri-ple al-li-ance',
          phonetic: 'ˈtrɪpl əˈlaɪəns',
          tier: '3',
        },
        {
          term: 'Triple Entente',
          definition:
            'The diplomatic alignment of Great Britain, France, and Russia completed in 1907 to counterbalance the Triple Alliance.',
          syllables: 'tri-ple en-tente',
          phonetic: 'ˈtrɪpl ɒnˈtɒnt',
          tier: '3',
        },
        {
          term: 'Balkan Powder Keg',
          definition:
            'The volatile south-eastern region of Europe where collapsing Ottoman authority and competing nationalisms created constant threat of war.',
          syllables: 'Ba-lkan Po-wder Keg',
          phonetic: 'balkan powder keg',
          tier: '3',
        },
        {
          term: 'Pan-Slavism',
          definition:
            'A nationalist movement aiming to unite all Slavic peoples of eastern and south-eastern Europe under Russian protection.',
          syllables: 'Pan-Sla-vism',
          phonetic: 'pan-slavism',
          tier: '2',
        },
        {
          term: 'Annexation',
          definition:
            'The formal, unilateral seizure and incorporation of a foreign territory into a sovereign state without the consent of its population.',
          syllables: 'A-nne-xation',
          phonetic: 'annexation',
          tier: '2',
        },
      ],
      narrative_blocks: [
        {
          act: 1,
          title: 'The Central European Bloc: Dual Alliance & Triple Alliance (1879–1882)',
          text: '<span class="para-ref">[4.1]</span> In October 1879, Chancellor Otto von Bismarck acted to prevent a hostile coalition between France and Russia. He negotiated the **Dual Alliance** with Austria-Hungary. Both empires promised mutual military support if attacked by Russia, and neutrality if attacked by another power. In 1882, Italy joined after losing Tunisia to France, creating the **Triple Alliance**.<br><br><span class="para-ref">[4.2]</span> Bismarck designed the alliance to defend Central Europe and deter foreign attacks. However, it had a dangerous flaw. The treaty tied Germany\'s military power to the weak, multi-ethnic Austro-Hungarian Empire. Ruled by the aging Emperor Franz Joseph, Austria-Hungary was fracturing under intense nationalist unrest.',
          source: {
            letter: 'A',
            type: 'written',
            title:
              'Source A (State Treaty): The Dual Alliance Between Germany and Austria-Hungary (1879)',
            text: 'Article I: Should, contrary to their hope, and against the sincere wish of the two High Contracting Parties, one of the two Empires be attacked by Russia, the High Contracting Parties are bound to come to the assistance one of the other with the whole war strength of their Empires, and accordingly only to conclude peace together and upon mutual agreement.<br><br>Article II: Should one of the High Contracting Parties be attacked by another Power [France], the other High Contracting Party binds itself hereby, not only not to stand by the side of the aggressor, but to maintain at least a benevolent neutrality toward its fellow Contracting Party.',
            caption:
              'Official treaty text signed in Vienna by Prince Bismarck and Count Andrássy, forming the foundational military pact of the Central Powers.',
            citation: 'Austrian State Archives (HHStA), Vienna / Reichsgesetzblatt 1879.',
            context:
              "The 1879 Dual Alliance bound Germany and Austria-Hungary in a mutual defence pact against Russia. While Bismarck intended the pact to restrain Austrian adventurism in the Balkans, by 1914 it functioned as a blank cheque that dragged Germany into Austria's local disputes. **Hinge Question:** Why did the Dual Alliance become dangerous to European peace once German chancellors stopped restraining Austrian foreign policy?",
            hinge_question:
              'Why did the Dual Alliance become dangerous to European peace once German chancellors stopped restraining Austrian foreign policy?',
            question_badge: 'Author’s Purpose',
            question:
              'Why did Bismarck insist upon strict mutual military assistance specifically in the event of an attack by Russia?',
            enquiry_question:
              'Why did Bismarck insist upon strict mutual military assistance specifically in the event of an attack by Russia?',
            model_answer:
              'Bismarck designed the treaty to deter Russia from attacking Austria-Hungary, calculating that the threat of facing the combined armies of Germany and Austria would preserve peace in Eastern Europe.',
            discussion_ideas: [
              'Defensive origin vs offensive trap: Began as a deterrent against Russia but evolved into an unconditional commitment.',
              'Austrian dependence: Tied Germany to the survival of a multi-ethnic, disintegrating empire.',
              'Rigidity of alliances: Locked Europe into automatic military obligations that limited diplomatic flexibility.',
            ],
            source_context:
              "The 1879 Dual Alliance bound Germany and Austria-Hungary in a mutual defence pact against Russia. While Bismarck intended the pact to restrain Austrian adventurism in the Balkans, by 1914 it functioned as a blank cheque that dragged Germany into Austria's local disputes. **Hinge Question:** Why did the Dual Alliance become dangerous to European peace once German chancellors stopped restraining Austrian foreign policy?",
            teacher_notes: {
              source_context:
                "The 1879 Dual Alliance bound Germany and Austria-Hungary in a mutual defence pact against Russia. While Bismarck intended the pact to restrain Austrian adventurism in the Balkans, by 1914 it functioned as a blank cheque that dragged Germany into Austria's local disputes. **Hinge Question:** Why did the Dual Alliance become dangerous to European peace once German chancellors stopped restraining Austrian foreign policy?",
            },
            id: 'gw_l4_src_a',
            src: '',
            image: '',
          },
          sources: [
            {
              letter: 'A',
              type: 'written',
              title:
                'Source A (State Treaty): The Dual Alliance Between Germany and Austria-Hungary (1879)',
              text: 'Article I: Should, contrary to their hope, and against the sincere wish of the two High Contracting Parties, one of the two Empires be attacked by Russia, the High Contracting Parties are bound to come to the assistance one of the other with the whole war strength of their Empires, and accordingly only to conclude peace together and upon mutual agreement.<br><br>Article II: Should one of the High Contracting Parties be attacked by another Power [France], the other High Contracting Party binds itself hereby, not only not to stand by the side of the aggressor, but to maintain at least a benevolent neutrality toward its fellow Contracting Party.',
              caption:
                'Official treaty text signed in Vienna by Prince Bismarck and Count Andrássy, forming the foundational military pact of the Central Powers.',
              citation: 'Austrian State Archives (HHStA), Vienna / Reichsgesetzblatt 1879.',
              context:
                "The 1879 Dual Alliance bound Germany and Austria-Hungary in a mutual defence pact against Russia. While Bismarck intended the pact to restrain Austrian adventurism in the Balkans, by 1914 it functioned as a blank cheque that dragged Germany into Austria's local disputes. **Hinge Question:** Why did the Dual Alliance become dangerous to European peace once German chancellors stopped restraining Austrian foreign policy?",
              hinge_question:
                'Why did the Dual Alliance become dangerous to European peace once German chancellors stopped restraining Austrian foreign policy?',
              question_badge: 'Author’s Purpose',
              question:
                'Why did Bismarck insist upon strict mutual military assistance specifically in the event of an attack by Russia?',
              enquiry_question:
                'Why did Bismarck insist upon strict mutual military assistance specifically in the event of an attack by Russia?',
              model_answer:
                'Bismarck designed the treaty to deter Russia from attacking Austria-Hungary, calculating that the threat of facing the combined armies of Germany and Austria would preserve peace in Eastern Europe.',
              discussion_ideas: [
                'Defensive origin vs offensive trap: Began as a deterrent against Russia but evolved into an unconditional commitment.',
                'Austrian dependence: Tied Germany to the survival of a multi-ethnic, disintegrating empire.',
                'Rigidity of alliances: Locked Europe into automatic military obligations that limited diplomatic flexibility.',
              ],
              source_context:
                "The 1879 Dual Alliance bound Germany and Austria-Hungary in a mutual defence pact against Russia. While Bismarck intended the pact to restrain Austrian adventurism in the Balkans, by 1914 it functioned as a blank cheque that dragged Germany into Austria's local disputes. **Hinge Question:** Why did the Dual Alliance become dangerous to European peace once German chancellors stopped restraining Austrian foreign policy?",
              teacher_notes: {
                source_context:
                  "The 1879 Dual Alliance bound Germany and Austria-Hungary in a mutual defence pact against Russia. While Bismarck intended the pact to restrain Austrian adventurism in the Balkans, by 1914 it functioned as a blank cheque that dragged Germany into Austria's local disputes. **Hinge Question:** Why did the Dual Alliance become dangerous to European peace once German chancellors stopped restraining Austrian foreign policy?",
              },
              id: 'gw_l4_src_a',
              src: '',
              image: '',
            },
          ],
        },
        {
          act: 2,
          title: 'The Counter-Alliance: Franco-Russian Alliance & Triple Entente (1894–1907)',
          text: '<span class="para-ref">[4.2]</span> In 1890, Kaiser Wilhelm II allowed Germany\'s secret Reinsurance Treaty with Russia to lapse. Needing money to build the Trans-Siberian Railway, Russia turned to France. In 1894, the two nations signed the **Franco-Russian Military Alliance**, promising mutual defense against Germany. Bismarck\'s worst fear—a two-front encirclement—had come true.<br><br><span class="para-ref">[4.3]</span> Alarmed by German naval expansion, Britain abandoned its traditional "Splendid Isolation." Britain settled colonial disputes with France in the 1904 **Entente Cordiale**, and with Russia in the 1907 **Anglo-Russian Convention**. Together, Britain, France, and Russia formed the **Triple Entente**. Europe was now split into two hostile armed camps. Like a chain of dynamite, a quarrel between any two powers threatened to drag all six into war.',
          image: '/units/great_war/assets/was_military_matrix.png',
          image_alt:
            "Primary political cartoon titled 'A Chain of Friendship' (July 1914) illustrating the alliance chain reaction",
          caption:
            "American press cartoon 'A Chain of Friendship' (July 1914), satirizing how the rigid alliance system turned an Austro-Serbian quarrel into a general European war: 'If you touch me I\\'ll—' (Serbia) through to Britain.",
          source: {
            letter: 'B',
            type: 'written',
            title:
              'Source B (Secret Military Convention): The Franco-Russian Military Convention (1892/1894)',
            text: '1. If France is attacked by Germany, or by Italy supported by Germany, Russia shall employ all her available forces to attack Germany. If Russia is attacked by Germany, or by Austria supported by Germany, France shall employ all her available forces to attack Germany.<br><br>2. In case the forces of the Triple Alliance, or of one of the Powers belonging to it, should mobilize, France and Russia, at the first news of the event and without previous consultation, shall immediately and simultaneously mobilize the whole of their forces and deploy them as near their frontiers as possible.',
            caption:
              'Confidential military convention ratified by the Tsar of Russia and the President of the French Republic, creating the two-front encirclement Germany feared.',
            citation:
              'French Ministry of Foreign Affairs (Archives Diplomatiques), Paris (Documents Diplomatiques Français, Ser. 1, Vol. 9).',
            context:
              "After Kaiser Wilhelm II severed ties with Russia in 1890, democratic France and autocratic Tsarist Russia signed a mutual defense pact. Article 2 was particularly lethal: it specified that mere mobilization by the Triple Alliance would trigger immediate, automatic total mobilization by France and Russia without further discussion. **Hinge Question:** Why did Article 2's clause making mobilization automatic ensure that a diplomatic crisis could not be halted once troops began moving?",
            hinge_question:
              "Why did Article 2's clause making mobilization automatic ensure that a diplomatic crisis could not be halted once troops began moving?",
            question_badge: 'Source Inference',
            question:
              'What does Article 2 reveal about how military timetables overtook diplomatic negotiations in European alliances?',
            enquiry_question:
              'What does Article 2 reveal about how military timetables overtook diplomatic negotiations in European alliances?',
            model_answer:
              'Article 2 reveals that European powers committed to automatic, immediate mobilization without prior consultation, meaning that once one power began mobilizing, all others were compelled to mobilize their entire armies instantly, removing any chance for diplomacy.',
            discussion_ideas: [
              "The two-front nightmare realized: Bismarck's worst strategic nightmare became institutionalized reality.",
              'Automatic tripwire: Mobilisation was legally equated with a declaration of war.',
              'Ideological contradiction: Catholic republican France allied with Orthodox autocratic Tsarist Russia purely out of anti-German strategic necessity.',
            ],
            source_context:
              "After Kaiser Wilhelm II severed ties with Russia in 1890, democratic France and autocratic Tsarist Russia signed a mutual defense pact. Article 2 was particularly lethal: it specified that mere mobilization by the Triple Alliance would trigger immediate, automatic total mobilization by France and Russia without further discussion. **Hinge Question:** Why did Article 2's clause making mobilization automatic ensure that a diplomatic crisis could not be halted once troops began moving?",
            teacher_notes: {
              source_context:
                "After Kaiser Wilhelm II severed ties with Russia in 1890, democratic France and autocratic Tsarist Russia signed a mutual defense pact. Article 2 was particularly lethal: it specified that mere mobilization by the Triple Alliance would trigger immediate, automatic total mobilization by France and Russia without further discussion. **Hinge Question:** Why did Article 2's clause making mobilization automatic ensure that a diplomatic crisis could not be halted once troops began moving?",
            },
            id: 'gw_l4_src_b',
            src: '',
            image: '',
          },
          sources: [
            {
              letter: 'B',
              type: 'written',
              title:
                'Source B (Secret Military Convention): The Franco-Russian Military Convention (1892/1894)',
              text: '1. If France is attacked by Germany, or by Italy supported by Germany, Russia shall employ all her available forces to attack Germany. If Russia is attacked by Germany, or by Austria supported by Germany, France shall employ all her available forces to attack Germany.<br><br>2. In case the forces of the Triple Alliance, or of one of the Powers belonging to it, should mobilize, France and Russia, at the first news of the event and without previous consultation, shall immediately and simultaneously mobilize the whole of their forces and deploy them as near their frontiers as possible.',
              caption:
                'Confidential military convention ratified by the Tsar of Russia and the President of the French Republic, creating the two-front encirclement Germany feared.',
              citation:
                'French Ministry of Foreign Affairs (Archives Diplomatiques), Paris (Documents Diplomatiques Français, Ser. 1, Vol. 9).',
              context:
                "After Kaiser Wilhelm II severed ties with Russia in 1890, democratic France and autocratic Tsarist Russia signed a mutual defense pact. Article 2 was particularly lethal: it specified that mere mobilization by the Triple Alliance would trigger immediate, automatic total mobilization by France and Russia without further discussion. **Hinge Question:** Why did Article 2's clause making mobilization automatic ensure that a diplomatic crisis could not be halted once troops began moving?",
              hinge_question:
                "Why did Article 2's clause making mobilization automatic ensure that a diplomatic crisis could not be halted once troops began moving?",
              question_badge: 'Source Inference',
              question:
                'What does Article 2 reveal about how military timetables overtook diplomatic negotiations in European alliances?',
              enquiry_question:
                'What does Article 2 reveal about how military timetables overtook diplomatic negotiations in European alliances?',
              model_answer:
                'Article 2 reveals that European powers committed to automatic, immediate mobilization without prior consultation, meaning that once one power began mobilizing, all others were compelled to mobilize their entire armies instantly, removing any chance for diplomacy.',
              discussion_ideas: [
                "The two-front nightmare realized: Bismarck's worst strategic nightmare became institutionalized reality.",
                'Automatic tripwire: Mobilisation was legally equated with a declaration of war.',
                'Ideological contradiction: Catholic republican France allied with Orthodox autocratic Tsarist Russia purely out of anti-German strategic necessity.',
              ],
              source_context:
                "After Kaiser Wilhelm II severed ties with Russia in 1890, democratic France and autocratic Tsarist Russia signed a mutual defense pact. Article 2 was particularly lethal: it specified that mere mobilization by the Triple Alliance would trigger immediate, automatic total mobilization by France and Russia without further discussion. **Hinge Question:** Why did Article 2's clause making mobilization automatic ensure that a diplomatic crisis could not be halted once troops began moving?",
              teacher_notes: {
                source_context:
                  "After Kaiser Wilhelm II severed ties with Russia in 1890, democratic France and autocratic Tsarist Russia signed a mutual defense pact. Article 2 was particularly lethal: it specified that mere mobilization by the Triple Alliance would trigger immediate, automatic total mobilization by France and Russia without further discussion. **Hinge Question:** Why did Article 2's clause making mobilization automatic ensure that a diplomatic crisis could not be halted once troops began moving?",
              },
              id: 'gw_l4_src_b',
              src: '',
              image: '',
            },
          ],
        },
        {
          act: 3,
          title: 'The "Balkan Powder Keg", Ottoman Decline & Pan-Slavism (1900–1908)',
          text: '<span class="para-ref">[4.3]</span> For centuries, the **Ottoman Empire** ruled the Balkan peninsula. By 1900, Ottoman power was fading rapidly, earning the nickname the "Sick Man of Europe." As Turkish rule collapsed, new independent nations—Greece, Bulgaria, Romania, and **Serbia**—broke away. This unstable power vacuum became known as the **"Balkan Powder Keg."**<br><br><span class="para-ref">[4.4]</span> Two rival empires competed for influence in the Balkans. Russia supported fellow Slavs and Orthodox Christians under the banner of **Pan-Slavism**, seeking warm-water sea routes to the Mediterranean. In contrast, Austria-Hungary feared that Slavic nationalism would tear its empire apart. Independent Serbia wanted to unite all South Slavs into a "Greater Serbia," making it Austria\'s fiercest rival.',
          source: {
            letter: 'C',
            id: 'gw_l4_src_c',
            type: 'written',
            title:
              'Source C (Imperial Proclamation): Emperor Franz Joseph, Proclamation on the Annexation of Bosnia and Herzegovina (5 October 1908)',
            context:
              'In October 1908, Austria-Hungary unilaterally annexed Bosnia and Herzegovina, breaking the Treaty of Berlin and enraging Serbia and Russia. When Germany threatened war in support of Vienna, Russia was forced to back down in humiliation, vowing never to retreat again. **Hinge Question:** Why did the 1908 Bosnian Crisis make a future European war almost inevitable when another Balkan crisis arose in 1914?',
            hinge_question:
              'Why did the 1908 Bosnian Crisis make a future European war almost inevitable when another Balkan crisis arose in 1914?',
            text: '“We, Franz Joseph, by the grace of God Emperor of Austria... have resolved to extend our sovereign rights over Bosnia and Herzegovina. The European powers must recognize that our military occupation has brought civilization and order to these territories. We hereby incorporate Bosnia and Herzegovina into our monarchy as an integral and perpetual territory of the Austro-Hungarian crown.”',
            caption:
              'Source C: Proclamation of Emperor Franz Joseph annexing Bosnia-Herzegovina, igniting the 1908 Bosnian Crisis.',
            question_badge: 'Imperial Aggression',
            question:
              'How did Austria-Hungary’s unilateral annexation of Bosnia and Herzegovina undermine European stability?',
            enquiry_question:
              'How did Austria-Hungary’s unilateral annexation of Bosnia and Herzegovina undermine European stability?',
            model_answer:
              'Austria-Hungary seized territory without European consent, outraging Serbia and humiliating Russia, which hardened alliance commitments and convinced Russia it could never back down in the Balkans again.',
            source_context:
              'In October 1908, Austria-Hungary unilaterally annexed Bosnia and Herzegovina, breaking the Treaty of Berlin and enraging Serbia and Russia. When Germany threatened war in support of Vienna, Russia was forced to back down in humiliation, vowing never to retreat again. **Hinge Question:** Why did the 1908 Bosnian Crisis make a future European war almost inevitable when another Balkan crisis arose in 1914?',
            teacher_notes: {
              source_context:
                'In October 1908, Austria-Hungary unilaterally annexed Bosnia and Herzegovina, breaking the Treaty of Berlin and enraging Serbia and Russia. When Germany threatened war in support of Vienna, Russia was forced to back down in humiliation, vowing never to retreat again. **Hinge Question:** Why did the 1908 Bosnian Crisis make a future European war almost inevitable when another Balkan crisis arose in 1914?',
            },
            src: '',
            image: '',
          },
          sources: [
            {
              letter: 'C',
              id: 'gw_l4_src_c',
              type: 'written',
              title:
                'Source C (Imperial Proclamation): Emperor Franz Joseph, Proclamation on the Annexation of Bosnia and Herzegovina (5 October 1908)',
              context:
                'In October 1908, Austria-Hungary unilaterally annexed Bosnia and Herzegovina, breaking the Treaty of Berlin and enraging Serbia and Russia. When Germany threatened war in support of Vienna, Russia was forced to back down in humiliation, vowing never to retreat again. **Hinge Question:** Why did the 1908 Bosnian Crisis make a future European war almost inevitable when another Balkan crisis arose in 1914?',
              hinge_question:
                'Why did the 1908 Bosnian Crisis make a future European war almost inevitable when another Balkan crisis arose in 1914?',
              text: '“We, Franz Joseph, by the grace of God Emperor of Austria... have resolved to extend our sovereign rights over Bosnia and Herzegovina. The European powers must recognize that our military occupation has brought civilization and order to these territories. We hereby incorporate Bosnia and Herzegovina into our monarchy as an integral and perpetual territory of the Austro-Hungarian crown.”',
              caption:
                'Source C: Proclamation of Emperor Franz Joseph annexing Bosnia-Herzegovina, igniting the 1908 Bosnian Crisis.',
              question_badge: 'Imperial Aggression',
              question:
                'How did Austria-Hungary’s unilateral annexation of Bosnia and Herzegovina undermine European stability?',
              enquiry_question:
                'How did Austria-Hungary’s unilateral annexation of Bosnia and Herzegovina undermine European stability?',
              model_answer:
                'Austria-Hungary seized territory without European consent, outraging Serbia and humiliating Russia, which hardened alliance commitments and convinced Russia it could never back down in the Balkans again.',
              source_context:
                'In October 1908, Austria-Hungary unilaterally annexed Bosnia and Herzegovina, breaking the Treaty of Berlin and enraging Serbia and Russia. When Germany threatened war in support of Vienna, Russia was forced to back down in humiliation, vowing never to retreat again. **Hinge Question:** Why did the 1908 Bosnian Crisis make a future European war almost inevitable when another Balkan crisis arose in 1914?',
              teacher_notes: {
                source_context:
                  'In October 1908, Austria-Hungary unilaterally annexed Bosnia and Herzegovina, breaking the Treaty of Berlin and enraging Serbia and Russia. When Germany threatened war in support of Vienna, Russia was forced to back down in humiliation, vowing never to retreat again. **Hinge Question:** Why did the 1908 Bosnian Crisis make a future European war almost inevitable when another Balkan crisis arose in 1914?',
              },
              src: '',
              image: '',
            },
          ],
        },
        {
          act: 4,
          title: 'The 1908 Bosnian Annexation Crisis & Russian Humiliation (October 1908)',
          text: '<span class="para-ref">[4.4]</span> In October 1908, the powder keg nearly exploded. Taking advantage of chaos in the Ottoman Empire, Austria-Hungary **annexed the provinces of Bosnia and Herzegovina**. This annexation outraged Serbia, which considered Bosnia its rightful territory. Serbian crowds protested in Belgrade, demanding war.<br><br><span class="para-ref">[4.5]</span> Russia supported Serbia and prepared its army. However, German Chancellor Bernhard von Bülow intervened. In March 1909, Germany delivered an ultimatum: Russia must accept the annexation, or face war with Germany and Austria. Still recovering from its 1905 defeat by Japan, Russia could not fight. Tsar Nicholas II backed down and forced Serbia to accept Austrian rule. The humiliation was painful: Russia began rapid military rearmament and resolved never to surrender in the Balkans again.',
          image: '/units/great_war/assets/balkans_1914_simple_map.png',
          image_alt:
            'Cartographic survey of the Balkan Peninsula showing territorial changes following the Balkan Wars of 1912–1913',
          caption:
            'The Balkan Peninsula in 1914 following the Balkan Wars, showing an expanded Serbia bordering Austro-Hungarian Bosnia-Herzegovina.',
          source: {
            letter: 'D',
            type: 'visual',
            title: 'Source D (Political Cartoon): "The Boiling Point" (Punch, October 1912)',
            image: '/units/great_war/assets/was_boiling_point.png',
            src: '/units/great_war/assets/was_boiling_point.png',
            is_artwork: true,
            caption:
              "British satirical cartoon by Leonard Raven-Hill in Punch depicting the leaders of Britain, France, Germany, Austria-Hungary, and Russia struggling to sit on the lid of a violently boiling pot labeled 'Balkan Troubles'.",
            citation: 'Punch, or the London Charivari, London (Vol. 143, 2 October 1912, p. 283).',
            context:
              "The First Balkan War (1912) broke out when the Balkan League attacked the decaying Ottoman Empire. The cartoon illustrates how the violent nationalist passions of the Balkans threatened to boil over and engulf the Great Powers, who desperately tried to contain the flames while pursuing conflicting regional ambitions. **Hinge Question:** Why was the metaphor of a 'boiling pot' an accurate description of how Balkan regional conflicts dragged the Great Powers into disaster?",
            hinge_question:
              "Why was the metaphor of a 'boiling pot' an accurate description of how Balkan regional conflicts dragged the Great Powers into disaster?",
            question_badge: 'Author’s Purpose',
            question:
              "What was the cartoonist Leonard Raven-Hill trying to communicate about the Great Powers' relationship to Balkan instability in 1912?",
            enquiry_question:
              "What was the cartoonist Leonard Raven-Hill trying to communicate about the Great Powers' relationship to Balkan instability in 1912?",
            model_answer:
              'The cartoonist was showing that ethnic and nationalist conflict in the Balkans was an uncontrollable explosive force that the Great Powers could barely suppress, and which threatened to destroy European peace despite their collective efforts.',
            discussion_ideas: [
              'Vivid visual metaphor: Depicts nationalism as boiling steam that cannot be permanently suppressed.',
              'Collective vulnerability: All five leaders are precariously balanced on the cauldron together.',
              'Foreshadowing Sarajevo: Directly presaged how a spark in Bosnia in 1914 would finally blow the lid off European peace.',
            ],
            source_context:
              "The First Balkan War (1912) broke out when the Balkan League attacked the decaying Ottoman Empire. The cartoon illustrates how the violent nationalist passions of the Balkans threatened to boil over and engulf the Great Powers, who desperately tried to contain the flames while pursuing conflicting regional ambitions. **Hinge Question:** Why was the metaphor of a 'boiling pot' an accurate description of how Balkan regional conflicts dragged the Great Powers into disaster?",
            teacher_notes: {
              source_context:
                "The First Balkan War (1912) broke out when the Balkan League attacked the decaying Ottoman Empire. The cartoon illustrates how the violent nationalist passions of the Balkans threatened to boil over and engulf the Great Powers, who desperately tried to contain the flames while pursuing conflicting regional ambitions. **Hinge Question:** Why was the metaphor of a 'boiling pot' an accurate description of how Balkan regional conflicts dragged the Great Powers into disaster?",
            },
            id: 'gw_l4_src_d',
          },
          sources: [
            {
              letter: 'D',
              type: 'visual',
              title: 'Source D (Political Cartoon): "The Boiling Point" (Punch, October 1912)',
              image: '/units/great_war/assets/was_boiling_point.png',
              src: '/units/great_war/assets/was_boiling_point.png',
              is_artwork: true,
              caption:
                "British satirical cartoon by Leonard Raven-Hill in Punch depicting the leaders of Britain, France, Germany, Austria-Hungary, and Russia struggling to sit on the lid of a violently boiling pot labeled 'Balkan Troubles'.",
              citation:
                'Punch, or the London Charivari, London (Vol. 143, 2 October 1912, p. 283).',
              context:
                "The First Balkan War (1912) broke out when the Balkan League attacked the decaying Ottoman Empire. The cartoon illustrates how the violent nationalist passions of the Balkans threatened to boil over and engulf the Great Powers, who desperately tried to contain the flames while pursuing conflicting regional ambitions. **Hinge Question:** Why was the metaphor of a 'boiling pot' an accurate description of how Balkan regional conflicts dragged the Great Powers into disaster?",
              hinge_question:
                "Why was the metaphor of a 'boiling pot' an accurate description of how Balkan regional conflicts dragged the Great Powers into disaster?",
              question_badge: 'Author’s Purpose',
              question:
                "What was the cartoonist Leonard Raven-Hill trying to communicate about the Great Powers' relationship to Balkan instability in 1912?",
              enquiry_question:
                "What was the cartoonist Leonard Raven-Hill trying to communicate about the Great Powers' relationship to Balkan instability in 1912?",
              model_answer:
                'The cartoonist was showing that ethnic and nationalist conflict in the Balkans was an uncontrollable explosive force that the Great Powers could barely suppress, and which threatened to destroy European peace despite their collective efforts.',
              discussion_ideas: [
                'Vivid visual metaphor: Depicts nationalism as boiling steam that cannot be permanently suppressed.',
                'Collective vulnerability: All five leaders are precariously balanced on the cauldron together.',
                'Foreshadowing Sarajevo: Directly presaged how a spark in Bosnia in 1914 would finally blow the lid off European peace.',
              ],
              source_context:
                "The First Balkan War (1912) broke out when the Balkan League attacked the decaying Ottoman Empire. The cartoon illustrates how the violent nationalist passions of the Balkans threatened to boil over and engulf the Great Powers, who desperately tried to contain the flames while pursuing conflicting regional ambitions. **Hinge Question:** Why was the metaphor of a 'boiling pot' an accurate description of how Balkan regional conflicts dragged the Great Powers into disaster?",
              teacher_notes: {
                source_context:
                  "The First Balkan War (1912) broke out when the Balkan League attacked the decaying Ottoman Empire. The cartoon illustrates how the violent nationalist passions of the Balkans threatened to boil over and engulf the Great Powers, who desperately tried to contain the flames while pursuing conflicting regional ambitions. **Hinge Question:** Why was the metaphor of a 'boiling pot' an accurate description of how Balkan regional conflicts dragged the Great Powers into disaster?",
              },
              id: 'gw_l4_src_d',
            },
          ],
        },
        {
          act: 5,
          title: 'The 1912–1913 Balkan Wars & The Pre-emptive War Urge (1912–1913)',
          text: '<span class="para-ref">[4.5]</span> In October 1912, the **First Balkan War** broke out. Serbia, Greece, Bulgaria, and Montenegro (the Balkan League) attacked the Ottoman Empire, expelling Turkish forces from Europe within six weeks. In 1913, the allies turned on each other in the **Second Balkan War**, where Serbia defeated Bulgaria.<br><br><span class="para-ref">[4.6]</span> These wars transformed Serbia into a formidable regional power. Serbia expanded its territory by eighty percent, and its population jumped from three to 4.5 million. Armed with modern French artillery, Serbian nationalists intensified secret agitation inside Austria-Hungary. In Vienna, Austrian General **Franz Conrad von Hötzendorf** demanded a **pre-emptive war** to crush Serbia before it grew even stronger: Conrad urged war over twenty times in 1913 alone. Europe stood on the edge of catastrophe.',
          source: {
            letter: 'E',
            type: 'visual',
            title: 'Source E (Operational Military Map): The German Schlieffen Plan (1905–1914)',
            image: '/units/great_war/assets/schlieffen_plan_simple_map.png',
            src: '/units/great_war/assets/schlieffen_plan_simple_map.png',
            caption:
              "Strategic cartographic diagram of Field Marshal Alfred von Schlieffen's military plan, showing the massive right-wing sweep of five German armies through neutral Belgium to encircle Paris within 42 days.",
            citation:
              'German Imperial General Staff (Großer Generalstab), Berlin / Militärgeschichtliches Forschungsamt (MGFA).',
            context:
              'Terrified of fighting a simultaneous two-front war against France and Russia, the German General Staff formulated the Schlieffen Plan. It gambled that slow Russian mobilization would allow Germany 42 days to invade neutral Belgium, bypass French border forts, encircle Paris, and knock France out before turning east to face Russia. **Hinge Question:** Why did the Schlieffen Plan guarantee that any dispute with Russia in the Balkans would automatically result in a German invasion of France and Belgium?',
            hinge_question:
              'Why did the Schlieffen Plan guarantee that any dispute with Russia in the Balkans would automatically result in a German invasion of France and Belgium?',
            question_badge: 'Cartographic Evidence',
            question:
              'How does this operational map demonstrate why the Schlieffen Plan made British neutrality impossible once war began?',
            enquiry_question:
              'How does this operational map demonstrate why the Schlieffen Plan made British neutrality impossible once war began?',
            model_answer:
              'The map shows that the entire German strategy required marching massive armies through neutral Belgium, directly violating the 1839 Treaty of London which Britain was legally and strategically committed to defend.',
            discussion_ideas: [
              'Inflexible military logic: Subordinated all political and diplomatic considerations to rigid railway timetables.',
              'Violation of Belgian neutrality: Made British intervention virtually guaranteed.',
              'Fatal gamble on Russian speed: Assumed Russia would take six weeks to mobilize, which proved disastrously incorrect in 1914.',
            ],
            source_context:
              'Terrified of fighting a simultaneous two-front war against France and Russia, the German General Staff formulated the Schlieffen Plan. It gambled that slow Russian mobilization would allow Germany 42 days to invade neutral Belgium, bypass French border forts, encircle Paris, and knock France out before turning east to face Russia. **Hinge Question:** Why did the Schlieffen Plan guarantee that any dispute with Russia in the Balkans would automatically result in a German invasion of France and Belgium?',
            teacher_notes: {
              source_context:
                'Terrified of fighting a simultaneous two-front war against France and Russia, the German General Staff formulated the Schlieffen Plan. It gambled that slow Russian mobilization would allow Germany 42 days to invade neutral Belgium, bypass French border forts, encircle Paris, and knock France out before turning east to face Russia. **Hinge Question:** Why did the Schlieffen Plan guarantee that any dispute with Russia in the Balkans would automatically result in a German invasion of France and Belgium?',
            },
            id: 'gw_l4_src_e',
          },
          sources: [
            {
              letter: 'E',
              type: 'visual',
              title: 'Source E (Operational Military Map): The German Schlieffen Plan (1905–1914)',
              image: '/units/great_war/assets/schlieffen_plan_simple_map.png',
              src: '/units/great_war/assets/schlieffen_plan_simple_map.png',
              caption:
                "Strategic cartographic diagram of Field Marshal Alfred von Schlieffen's military plan, showing the massive right-wing sweep of five German armies through neutral Belgium to encircle Paris within 42 days.",
              citation:
                'German Imperial General Staff (Großer Generalstab), Berlin / Militärgeschichtliches Forschungsamt (MGFA).',
              context:
                'Terrified of fighting a simultaneous two-front war against France and Russia, the German General Staff formulated the Schlieffen Plan. It gambled that slow Russian mobilization would allow Germany 42 days to invade neutral Belgium, bypass French border forts, encircle Paris, and knock France out before turning east to face Russia. **Hinge Question:** Why did the Schlieffen Plan guarantee that any dispute with Russia in the Balkans would automatically result in a German invasion of France and Belgium?',
              hinge_question:
                'Why did the Schlieffen Plan guarantee that any dispute with Russia in the Balkans would automatically result in a German invasion of France and Belgium?',
              question_badge: 'Cartographic Evidence',
              question:
                'How does this operational map demonstrate why the Schlieffen Plan made British neutrality impossible once war began?',
              enquiry_question:
                'How does this operational map demonstrate why the Schlieffen Plan made British neutrality impossible once war began?',
              model_answer:
                'The map shows that the entire German strategy required marching massive armies through neutral Belgium, directly violating the 1839 Treaty of London which Britain was legally and strategically committed to defend.',
              discussion_ideas: [
                'Inflexible military logic: Subordinated all political and diplomatic considerations to rigid railway timetables.',
                'Violation of Belgian neutrality: Made British intervention virtually guaranteed.',
                'Fatal gamble on Russian speed: Assumed Russia would take six weeks to mobilize, which proved disastrously incorrect in 1914.',
              ],
              source_context:
                'Terrified of fighting a simultaneous two-front war against France and Russia, the German General Staff formulated the Schlieffen Plan. It gambled that slow Russian mobilization would allow Germany 42 days to invade neutral Belgium, bypass French border forts, encircle Paris, and knock France out before turning east to face Russia. **Hinge Question:** Why did the Schlieffen Plan guarantee that any dispute with Russia in the Balkans would automatically result in a German invasion of France and Belgium?',
              teacher_notes: {
                source_context:
                  'Terrified of fighting a simultaneous two-front war against France and Russia, the German General Staff formulated the Schlieffen Plan. It gambled that slow Russian mobilization would allow Germany 42 days to invade neutral Belgium, bypass French border forts, encircle Paris, and knock France out before turning east to face Russia. **Hinge Question:** Why did the Schlieffen Plan guarantee that any dispute with Russia in the Balkans would automatically result in a German invasion of France and Belgium?',
              },
              id: 'gw_l4_src_e',
            },
          ],
        },
      ],
      pair_share: {
        prompt:
          'Discuss with your partner: Did the alliance systems cause the First World War, or were they merely the mechanism that spread a local Balkan conflict into a global war?',
        think: 'Reflect on whether alliances prevented war or made catastrophe inevitable.',
        pair: 'Take turns explaining your reasoning to your partner.',
        share: 'Be prepared to report your partner’s best argument to the class.',
      },
      tasks: [
        {
          type: 'extended_writing',
          topic: 'Question 1: Narrative Account [8 marks • 10 mins]',
          question:
            'Write a narrative account analysing how crises in the Balkans between 1908 and 1913 increased European tension. [8 marks]',
          stimulus: ['The Bosnian Annexation Crisis (1908)', 'The Balkan Wars (1912–1913)'],
          hints: [
            {
              label: 'Point',
              prompt:
                'Begin with the initial catalyst: Austria-Hungary’s 1908 annexation of Bosnia-Herzegovina and Russian humiliation.',
            },
            {
              label: 'Evidence',
              prompt:
                'Deploy chronological evidence: Serbian fury, German ultimatums backing Vienna, and the 1912–1913 Balkan Wars.',
            },
            {
              label: 'Explanation',
              prompt:
                'Trace how each event directly caused the next: Serbian territory doubling, Austro-Hungarian fear of Pan-Slavism, and Russian resolve never to retreat again.',
            },
            {
              label: 'Link',
              prompt:
                'Conclude with the outcome: the Balkans became a primed powder keg where any spark would trigger a general European war.',
            },
          ],
          scaffolding: {
            structure_strip: [
              {
                col: 'Phase 1: Bosnian Crisis (1908)',
                prompt:
                  'Describe the Austrian annexation of Bosnia and Germany’s military ultimatum to Russia.',
                starter:
                  'Initially, Balkan tensions escalated sharply in October 1908 when Austria-Hungary formally annexed Bosnia-Herzegovina...',
              },
              {
                col: 'Phase 2: Balkan Wars (1912–1913)',
                prompt:
                  'Explain how the defeat of the Ottoman Empire doubled Serbian territory and alarmed Vienna.',
                starter:
                  'Following this, the regional instability deepened during the Balkan Wars of 1912–1913...',
              },
              {
                col: 'Phase 3: The Primed Powder Keg',
                prompt:
                  'Analyse how these crises convinced Austria to seek pre-emptive war and Russia to mobilize next time.',
                starter:
                  'Consequently, the cumulative effect of these crises was to make south-eastern Europe the "powder keg of Europe"...',
              },
            ],
            sentence_starters: [
              'Initially, European tensions escalated in 1908 when...',
              'This provoked intense outrage in Serbia because...',
              'Russia was forced to back down when Germany issued an ultimatum stating that...',
              'Following this, the Balkan Wars of 1912–1913 dramatically altered the balance of power because...',
              'As an outcome of this, Austrian military leaders concluded that...',
              'Ultimately, Russia resolved that in any future Balkan confrontation it would...',
            ],
            connective_bank: [
              'Initially...',
              'This led directly to...',
              'Following this...',
              'Consequently...',
              'As an outcome of this...',
              'Ultimately...',
            ],
            word_bank: [
              'Balkan Powder Keg',
              'Bosnia-Herzegovina',
              'Pan-Slavism',
              'Tsar Nicholas II',
              'Franz Joseph',
              'Greater Serbia',
              'Balkan Wars',
              'pre-emptive war',
            ],
          },
          model_answer:
            'Between 1908 and 1913, a sequence of interconnected crises in the Balkans systematically dismantled regional stability and brought the Great Powers into acute confrontation.\n\nThe chain of events began in October 1908, when Austria-Hungary formally annexed Bosnia-Herzegovina, an Ottoman province populated largely by Serbs that Vienna had administered since 1878. This annexation provoked fury in Serbia, which harboured Pan-Slavic ambitions of creating a "Greater Serbia." Tsarist Russia moved to support its Slavic ally, but in March 1909 Germany intervened with a blunt ultimatum demanding that Russia accept the annexation without an international conference or face war. Humiliated and militarily unready following its 1905 defeat by Japan, Russia was forced to capitulate, leaving Tsar Nicholas II and his generals determined never to back down in the Balkans again.\n\nFollowing this crisis, the collapse of Ottoman authority sparked the First Balkan War (1912), in which the Balkan League (Serbia, Greece, Montenegro, and Bulgaria) drove the Turks almost entirely out of Europe. In the Second Balkan War (1913), Serbia defeated Bulgaria, resulting in Serbia doubling its territorial size and population. This explosive rise of an assertive, heavily armed Serbia terrified Austro-Hungarian leaders in Vienna, who feared that Pan-Slavic nationalism would tear their multi-ethnic empire apart.\n\nConsequently, the Balkan crises convinced Vienna’s military leadership, led by General Conrad von Hötzendorf, that a pre-emptive strike to crush Serbia was necessary for imperial survival. Combined with Russia’s vow to mobilize in any future crisis, south-eastern Europe had become a volatile powder keg awaiting a final trigger.',
        },
        {
          type: 'extended_writing',
          topic: 'Question 2: Explain Importance of Alliance Systems [8 marks • 10 mins]',
          question:
            'Explain the importance of the alliance systems for relations between European great powers before 1914. [8 marks]',
          stimulus: ['The Triple Alliance (1882)', 'The Triple Entente (1907)'],
          hints: [
            {
              label: 'Point',
              prompt:
                'State why the alliance systems were critically important (e.g. dividing Europe into two armed camps that transformed local crises into continental tripwires).',
            },
            {
              label: 'Evidence',
              prompt:
                'Deploy precise evidence: Dual Alliance (1879), Triple Alliance (1882), Franco-Russian Alliance (1894), Entente Cordiale (1904), and Triple Entente (1907).',
            },
            {
              label: 'Explanation',
              prompt:
                'Explain HOW mutual defence commitments eliminated diplomatic flexibility, heightened fears of encirclement, and created an automatic domino effect.',
            },
            {
              label: 'Link',
              prompt:
                'Link back to the question stem, showing how alliances locked great powers into supporting their allies regardless of the specific dispute.',
            },
          ],
          scaffolding: {
            structure_strip: [
              {
                col: 'Importance 1: Division into Two Armed Camps',
                prompt:
                  'Explain how the Triple Alliance and Triple Entente created mutual fear of encirclement and an arms race.',
                starter:
                  'The alliance systems were critically important because they divided Europe into two rigid, antagonistic coalitions...',
              },
              {
                col: 'Importance 2: The Domino Effect Tripwire',
                prompt:
                  'Explain how mutual military defence pledges converted localized disputes into general continental wars.',
                starter:
                  'Furthermore, the alliances were decisive because they operated as an automatic tripwire mechanism...',
              },
            ],
            sentence_starters: [
              'A decisive factor was...',
              'This was important because the formation of the Triple Alliance in 1882...',
              'In response, France and Russia formed a counter-bloc in 1894 which...',
              'By 1907, the Triple Entente completed the encirclement of Germany, leading to...',
              'As a direct result, any crisis involving one power automatically dragged in...',
              'Ultimately, this meant that the alliance system destroyed diplomatic compromise...',
            ],
            connective_bank: [
              'A decisive factor was...',
              'This was important because...',
              'Furthermore...',
              'As a direct result...',
              'Ultimately, this meant that...',
            ],
            word_bank: [
              'Dual Alliance',
              'Triple Alliance',
              'Franco-Russian Alliance',
              'Entente Cordiale',
              'Triple Entente',
              'Balance of Power',
              'Encirclement',
              'Domino Effect',
            ],
          },
          model_answer:
            'The alliance systems were of paramount importance for relations between the European great powers before 1914 because they polarized the continent into two heavily armed, mutually suspicious camps and created a dangerous domino-effect tripwire that made a general European conflict virtually impossible to contain.\n\nFirst, the development of the alliance blocs permanently altered the European balance of power. Bismarck had initially constructed the Dual Alliance (1879) with Austria-Hungary and expanded it into the Triple Alliance (1882) with Italy to isolate France. However, after Germany allowed its Reinsurance Treaty with Russia to lapse in 1890, France broke its isolation by securing the Franco-Russian Military Alliance in 1894. When Great Britain resolved its imperial disputes with France (1904) and Russia (1907) to form the Triple Entente, Europe became locked into two rigid coalitions. This created acute German paranoia regarding "encirclement" (Einkreisung), driving Berlin to cling unconditionally to its sole dependable ally, Austria-Hungary.\n\nSecond, the alliances were decisive because their mutual defence pledges removed diplomatic flexibility during international crises. Instead of regional disputes remaining localized, the commitments meant that a conflict involving one partner inevitably dragged in the entire coalition. In the July Crisis of 1914, Germany’s "Blank Cheque" to Vienna and France’s binding obligation to Russia ensured that a regional confrontation between Austria-Hungary and Serbia escalated into an all-out world war.',
        },
      ],
      quiz: [
        {
          q: 'Which three countries formed the Triple Entente in 1907?',
          a: 'Britain, France, Russia',
          options: [
            'Germany, Austria-Hungary, Italy',
            'Britain, France, Italy',
            'Britain, France, Russia',
            'Germany, Russia, Austria-Hungary',
          ],
        },
        {
          q: 'Which country left the Triple Alliance and joined the Entente in 1915?',
          a: 'Italy',
          options: ['Ottoman Empire', 'Bulgaria', 'Romania', 'Italy'],
        },
        {
          q: "What was Britain's traditional foreign policy before forming alliances?",
          a: 'Splendid Isolation',
          options: ['Splendid Isolation', 'Weltpolitik', 'Appeasement', 'Continental Commitment'],
        },
        {
          q: 'Which three countries made up the Triple Alliance of 1882?',
          a: 'Germany, Austria-Hungary, Italy',
          options: [
            'Germany, Russia, Austria-Hungary',
            'Britain, France, Russia',
            'Germany, Ottoman Empire, Italy',
            'Germany, Austria-Hungary, Italy',
          ],
        },
        {
          q: 'Which three countries formed the Triple Entente by 1907?',
          a: 'Britain, France, Russia',
          options: [
            'Germany, Austria-Hungary, Italy',
            'Britain, France, Russia',
            'Britain, USA, France',
            'France, Russia, Italy',
          ],
        },
        {
          q: 'What was a major flaw of the alliance system?',
          a: 'A small dispute between two nations could drag all major powers into war',
          options: [
            'It forced countries to disarm',
            'It prevented any trade between the blocs',
            'A small dispute between two nations could drag all major powers into war',
            'It made the armies too small',
          ],
        },
        {
          q: 'Why did Russia sign a military alliance with France in 1894?',
          a: 'Kaiser Wilhelm II allowed Germany\'s secret Reinsurance Treaty with Russia to lapse',
          options: [
            'They shared the same official state religion',
            'Kaiser Wilhelm II allowed Germany\'s secret Reinsurance Treaty with Russia to lapse',
            'France promised to surrender African colonies to Russia',
            'Britain launched an invasion of St Petersburg',
          ],
        },
        {
          q: "What was the 'Entente Cordiale' signed in 1904?",
          a: 'A friendly agreement between Britain and France, settling colonial disputes',
          options: [
            'A friendly agreement between Britain and France, settling colonial disputes',
            'A peace treaty ending a war',
            'An agreement to build dreadnoughts together',
            'A military alliance between Germany and Russia',
          ],
        },
        {
          q: 'Why did Britain abandon its traditional Splendid Isolation to negotiate ententes with France and Russia?',
          a: 'Alarmed by German naval expansion',
          options: [
            'Alarmed by German naval expansion',
            'To prepare for a joint invasion of Spain',
            'Because Britain lost all its overseas colonies',
            'Due to military threats from the United States',
          ],
        },
        {
          q: 'What banner of solidarity led Russia to support fellow Slavs and Serbia in the Balkans?',
          a: 'Pan-Slavism',
          options: [
            'Pan-Slavism',
            'Splendid Isolation',
            'Realpolitik',
            'Social Darwinism',
          ],
        },
        {
          q: "Which nation in the Triple Alliance was seen as the 'weak link'?",
          a: 'Italy',
          options: ['Germany', 'Austria-Hungary', 'Britain', 'Italy'],
        },
      ],
      prologue:
        "By 1914, Europe had divided into two heavily armed camps: the Triple Entente and the Triple Alliance. In the turbulent Balkans, crumbling Ottoman power and Slavic nationalism created a volatile 'powder keg' of regional tension. Why did interlocking alliance treaties turn a regional Balkan quarrel into a catastrophic continental war?",
      exam_practice: {
        title: 'Key Stage 3 Disciplinary Writing: The Alliance Systems & The Balkan Powder Keg',
        tariff: '16 marks (Narrative Account [8m] & Explain Importance [8m])',
        questions: [
          {
            tariff: '8 marks',
            type: 'narrative_account_8m',
            question:
              'Write a narrative account analysing how crises in the Balkans between 1908 and 1913 increased European tension. [8 marks]',
            stimulus: [
              'The Austrian annexation of Bosnia (1908)',
              'The Balkan Wars and the rise of a Greater Serbia (1912–1913)',
            ],
            prompt:
              'Write a chronological account examining the escalation: the 1908 Bosnian Crisis and Russian humiliation, the Balkan Wars of 1912–1913, and how this created intense Austro-Serbian hostility that led directly to 1914.',
            model:
              'Between 1908 and 1913, consecutive crises in the Balkans converted the region into the volatile "powder keg" of Europe, dragging the great power alliances into acute confrontation.<br><br>The instability began in October 1908 when Austria-Hungary formally annexed the Ottoman provinces of Bosnia and Herzegovina. This provoked furious outrage in neighbouring Serbia, which harboured dreams of uniting all South Slavs under a "Greater Serbia". Serbia turned to its Slavic protector, Russia, for military support. However, when Germany issued an ultimatum in March 1909 declaring unconditional support for Austria, Russia—still recovering from its 1905 defeat by Japan—was forced to back down in deep humiliation. Tsar Nicholas II vowed that Russia would never back down in the Balkans again, initiating a massive military modernisation programme.<br><br>Tensions escalated dramatically during the Balkan Wars of 1912–1913. In the First Balkan War, the Balkan League (Serbia, Greece, Bulgaria, Montenegro) successfully drove the Ottoman Empire out of Europe. Following a territorial dispute in the Second Balkan War, Serbia emerged victorious, doubling its territorial size and population. Elated by victory, militant Serb nationalists in organizations like the "Black Hand" expanded subversive propaganda inside Austro-Hungarian territory.<br><br>Consequently, the outcome of the Balkan crises created irreconcilable hostility between Austria-Hungary and Serbia. Austrian military leaders, led by Field Marshal Conrad von Hötzendorf, became convinced that Serbia represented an existential mortal threat that had to be crushed by preventive war. When Archduke Franz Ferdinand visited Sarajevo in June 1914, the powder keg was primed for detonation.',
            scaffolding: {
              acronym: '3-Stage Chronological Narrative Framework',
              acronym_title: 'Narrative Account Formula (Beginning • Escalation • Climax)',
              steps: [
                {
                  letter: 'STAGE 1',
                  name: '1908 Bosnian Annexation & Russian Humiliation',
                  prompt:
                    'Explain Austria seizing Bosnia, Serbian outrage, German ultimatum, and Russian humiliation.',
                  starter: 'Initially, the Balkan crisis began in October 1908 when...',
                },
                {
                  letter: 'STAGE 2',
                  name: '1912–1913 Balkan Wars & Greater Serbia',
                  prompt:
                    'Explain Balkan League, Ottoman expulsion, Serbia doubling in size, and Black Hand agitation.',
                  starter:
                    'Following this, tensions escalated sharply during the Balkan Wars of 1912–1913 when...',
                },
                {
                  letter: 'STAGE 3',
                  name: 'Austro-Serbian Hostility & Priming 1914',
                  prompt:
                    'Explain Austrian preventive war mentality (Conrad von Hötzendorf) and Sarajevo setting.',
                  starter: 'The outcome of these crises permanently destabilized Europe because...',
                },
              ],
              sentence_starters: [
                'Initially, the crisis began when...',
                'Following this, a major escalation occurred in 1912–1913 when...',
                'A dangerous turning point was reached when...',
                'Consequently, this culminated by 1914 in...',
              ],
              connectives_bank: [
                'Bosnian Crisis (1908)',
                'Greater Serbia',
                'Russian humiliation',
                'Balkan League',
                'Balkans Powder Keg',
                'Black Hand',
                'Conrad von Hötzendorf',
                'preventive war',
              ],
            },
          },
          {
            tariff: '8 marks',
            type: 'explain_importance_8m',
            question:
              'Explain the importance of the alliance systems for relations between European great powers before 1914. [8 marks]',
            prompt:
              'Explain two distinct reasons why the alliance systems were important: first, how they divided Europe into two armed, suspicious camps (Triple Alliance vs Triple Entente); second, how mutual defense obligations converted a localized Balkan dispute into a continent-wide total war in July 1914.',
            model:
              'One reason the alliance systems were profoundly important was that they divided Europe into two rigid, armed camps characterized by pervasive fear of encirclement and mutual paranoia. By 1907, the Triple Alliance (Germany, Austria-Hungary, Italy) faced the Triple Entente (Britain, France, Russia). Rather than preserving the peace through balance of power deterrence as originally intended, the alliances entrenched suspicion. Every diplomatic incident—such as the Moroccan Crises or the Bosnian Crisis—was viewed as a zero-sum test of alliance resolve, encouraging military staffs to coordinate joint war plans and accelerate the land and naval arms races.<br><br>Furthermore, the alliances were critical because their interlocking mutual defense treaties operated as a fatal transmission belt that converted a localized regional quarrel into a catastrophic world war. When Archduke Franz Ferdinand was assassinated by Gavrilo Princip in June 1914, the dispute was strictly between Austria-Hungary and Serbia. However, Germany’s "blank cheque" of 5 July emboldened Austria to issue an impossible ultimatum. In turn, Russia’s commitment to Serbia triggered general mobilization; Germany’s Schlieffen Plan demanded an immediate invasion of France via Belgium; and Britain’s guarantee of Belgian neutrality under the 1839 Treaty of London compelled British entry. Consequently, the alliance obligations ensured that no great power could remain neutral, plunging the entire continent into war within six weeks.',
            scaffolding: {
              acronym: 'Importance Point 1 • Importance Point 2',
              acronym_title: 'Edexcel Paper 2 Period Study 8-Mark Importance Standard',
              steps: [
                {
                  letter: 'IMPACT 1',
                  name: 'Division into Armed Camps & Zero-Sum Paranoia',
                  prompt:
                    'Explain Triple Alliance vs Triple Entente, fear of encirclement, and war plan coordination.',
                  starter: 'One reason the alliance systems were profoundly important was that...',
                },
                {
                  letter: 'IMPACT 2',
                  name: 'The Fatal Transmission Belt in July 1914',
                  prompt:
                    'Explain the blank cheque, Russian mobilization, Schlieffen Plan, Belgian neutrality, and world war.',
                  starter:
                    'Furthermore, the alliances were critical because their mutual obligations operated as...',
                },
              ],
              sentence_starters: [
                'One reason why the alliance systems were important was...',
                'In particular, they divided Europe into...',
                'Furthermore, the alliances were decisive because...',
                'Consequently, this transformed a regional dispute because...',
              ],
              connectives_bank: [
                'Triple Alliance',
                'Triple Entente',
                'blank cheque (5 July 1914)',
                'Russian mobilization',
                'Schlieffen Plan',
                'Treaty of London (1839)',
                'fatal transmission belt',
              ],
            },
          },
        ],
      },
      sources: [
        {
          letter: 'A',
          type: 'written',
          title:
            'Source A (State Treaty): The Dual Alliance Between Germany and Austria-Hungary (1879)',
          text: 'Article I: Should, contrary to their hope, and against the sincere wish of the two High Contracting Parties, one of the two Empires be attacked by Russia, the High Contracting Parties are bound to come to the assistance one of the other with the whole war strength of their Empires, and accordingly only to conclude peace together and upon mutual agreement.<br><br>Article II: Should one of the High Contracting Parties be attacked by another Power [France], the other High Contracting Party binds itself hereby, not only not to stand by the side of the aggressor, but to maintain at least a benevolent neutrality toward its fellow Contracting Party.',
          caption:
            'Official treaty text signed in Vienna by Prince Bismarck and Count Andrássy, forming the foundational military pact of the Central Powers.',
          citation: 'Austrian State Archives (HHStA), Vienna / Reichsgesetzblatt 1879.',
          context:
            "The 1879 Dual Alliance bound Germany and Austria-Hungary in a mutual defence pact against Russia. While Bismarck intended the pact to restrain Austrian adventurism in the Balkans, by 1914 it functioned as a blank cheque that dragged Germany into Austria's local disputes. **Hinge Question:** Why did the Dual Alliance become dangerous to European peace once German chancellors stopped restraining Austrian foreign policy?",
          hinge_question:
            'Why did the Dual Alliance become dangerous to European peace once German chancellors stopped restraining Austrian foreign policy?',
          question_badge: 'Author’s Purpose',
          question:
            'Why did Bismarck insist upon strict mutual military assistance specifically in the event of an attack by Russia?',
          enquiry_question:
            'Why did Bismarck insist upon strict mutual military assistance specifically in the event of an attack by Russia?',
          model_answer:
            'Bismarck designed the treaty to deter Russia from attacking Austria-Hungary, calculating that the threat of facing the combined armies of Germany and Austria would preserve peace in Eastern Europe.',
          discussion_ideas: [
            'Defensive origin vs offensive trap: Began as a deterrent against Russia but evolved into an unconditional commitment.',
            'Austrian dependence: Tied Germany to the survival of a multi-ethnic, disintegrating empire.',
            'Rigidity of alliances: Locked Europe into automatic military obligations that limited diplomatic flexibility.',
          ],
          source_context:
            "The 1879 Dual Alliance bound Germany and Austria-Hungary in a mutual defence pact against Russia. While Bismarck intended the pact to restrain Austrian adventurism in the Balkans, by 1914 it functioned as a blank cheque that dragged Germany into Austria's local disputes. **Hinge Question:** Why did the Dual Alliance become dangerous to European peace once German chancellors stopped restraining Austrian foreign policy?",
          teacher_notes: {
            source_context:
              "The 1879 Dual Alliance bound Germany and Austria-Hungary in a mutual defence pact against Russia. While Bismarck intended the pact to restrain Austrian adventurism in the Balkans, by 1914 it functioned as a blank cheque that dragged Germany into Austria's local disputes. **Hinge Question:** Why did the Dual Alliance become dangerous to European peace once German chancellors stopped restraining Austrian foreign policy?",
          },
          id: 'gw_l4_src_a',
          src: '',
          image: '',
        },
        {
          letter: 'B',
          type: 'written',
          title:
            'Source B (Secret Military Convention): The Franco-Russian Military Convention (1892/1894)',
          text: '1. If France is attacked by Germany, or by Italy supported by Germany, Russia shall employ all her available forces to attack Germany. If Russia is attacked by Germany, or by Austria supported by Germany, France shall employ all her available forces to attack Germany.<br><br>2. In case the forces of the Triple Alliance, or of one of the Powers belonging to it, should mobilize, France and Russia, at the first news of the event and without previous consultation, shall immediately and simultaneously mobilize the whole of their forces and deploy them as near their frontiers as possible.',
          caption:
            'Confidential military convention ratified by the Tsar of Russia and the President of the French Republic, creating the two-front encirclement Germany feared.',
          citation:
            'French Ministry of Foreign Affairs (Archives Diplomatiques), Paris (Documents Diplomatiques Français, Ser. 1, Vol. 9).',
          context:
            "After Kaiser Wilhelm II severed ties with Russia in 1890, democratic France and autocratic Tsarist Russia signed a mutual defense pact. Article 2 was particularly lethal: it specified that mere mobilization by the Triple Alliance would trigger immediate, automatic total mobilization by France and Russia without further discussion. **Hinge Question:** Why did Article 2's clause making mobilization automatic ensure that a diplomatic crisis could not be halted once troops began moving?",
          hinge_question:
            "Why did Article 2's clause making mobilization automatic ensure that a diplomatic crisis could not be halted once troops began moving?",
          question_badge: 'Source Inference',
          question:
            'What does Article 2 reveal about how military timetables overtook diplomatic negotiations in European alliances?',
          enquiry_question:
            'What does Article 2 reveal about how military timetables overtook diplomatic negotiations in European alliances?',
          model_answer:
            'Article 2 reveals that European powers committed to automatic, immediate mobilization without prior consultation, meaning that once one power began mobilizing, all others were compelled to mobilize their entire armies instantly, removing any chance for diplomacy.',
          discussion_ideas: [
            "The two-front nightmare realized: Bismarck's worst strategic nightmare became institutionalized reality.",
            'Automatic tripwire: Mobilisation was legally equated with a declaration of war.',
            'Ideological contradiction: Catholic republican France allied with Orthodox autocratic Tsarist Russia purely out of anti-German strategic necessity.',
          ],
          source_context:
            "After Kaiser Wilhelm II severed ties with Russia in 1890, democratic France and autocratic Tsarist Russia signed a mutual defense pact. Article 2 was particularly lethal: it specified that mere mobilization by the Triple Alliance would trigger immediate, automatic total mobilization by France and Russia without further discussion. **Hinge Question:** Why did Article 2's clause making mobilization automatic ensure that a diplomatic crisis could not be halted once troops began moving?",
          teacher_notes: {
            source_context:
              "After Kaiser Wilhelm II severed ties with Russia in 1890, democratic France and autocratic Tsarist Russia signed a mutual defense pact. Article 2 was particularly lethal: it specified that mere mobilization by the Triple Alliance would trigger immediate, automatic total mobilization by France and Russia without further discussion. **Hinge Question:** Why did Article 2's clause making mobilization automatic ensure that a diplomatic crisis could not be halted once troops began moving?",
          },
          id: 'gw_l4_src_b',
          src: '',
          image: '',
        },
        {
          letter: 'C',
          id: 'gw_l4_src_c',
          type: 'written',
          title:
            'Source C (Imperial Proclamation): Emperor Franz Joseph, Proclamation on the Annexation of Bosnia and Herzegovina (5 October 1908)',
          context:
            'In October 1908, Austria-Hungary unilaterally annexed Bosnia and Herzegovina, breaking the Treaty of Berlin and enraging Serbia and Russia. When Germany threatened war in support of Vienna, Russia was forced to back down in humiliation, vowing never to retreat again. **Hinge Question:** Why did the 1908 Bosnian Crisis make a future European war almost inevitable when another Balkan crisis arose in 1914?',
          hinge_question:
            'Why did the 1908 Bosnian Crisis make a future European war almost inevitable when another Balkan crisis arose in 1914?',
          text: '“We, Franz Joseph, by the grace of God Emperor of Austria... have resolved to extend our sovereign rights over Bosnia and Herzegovina. The European powers must recognize that our military occupation has brought civilization and order to these territories. We hereby incorporate Bosnia and Herzegovina into our monarchy as an integral and perpetual territory of the Austro-Hungarian crown.”',
          caption:
            'Source C: Proclamation of Emperor Franz Joseph annexing Bosnia-Herzegovina, igniting the 1908 Bosnian Crisis.',
          question_badge: 'Imperial Aggression',
          question:
            'How did Austria-Hungary’s unilateral annexation of Bosnia and Herzegovina undermine European stability?',
          enquiry_question:
            'How did Austria-Hungary’s unilateral annexation of Bosnia and Herzegovina undermine European stability?',
          model_answer:
            'Austria-Hungary seized territory without European consent, outraging Serbia and humiliating Russia, which hardened alliance commitments and convinced Russia it could never back down in the Balkans again.',
          source_context:
            'In October 1908, Austria-Hungary unilaterally annexed Bosnia and Herzegovina, breaking the Treaty of Berlin and enraging Serbia and Russia. When Germany threatened war in support of Vienna, Russia was forced to back down in humiliation, vowing never to retreat again. **Hinge Question:** Why did the 1908 Bosnian Crisis make a future European war almost inevitable when another Balkan crisis arose in 1914?',
          teacher_notes: {
            source_context:
              'In October 1908, Austria-Hungary unilaterally annexed Bosnia and Herzegovina, breaking the Treaty of Berlin and enraging Serbia and Russia. When Germany threatened war in support of Vienna, Russia was forced to back down in humiliation, vowing never to retreat again. **Hinge Question:** Why did the 1908 Bosnian Crisis make a future European war almost inevitable when another Balkan crisis arose in 1914?',
          },
          src: '',
          image: '',
        },
        {
          letter: 'D',
          type: 'visual',
          title: 'Source D (Political Cartoon): "The Boiling Point" (Punch, October 1912)',
          image: '/units/great_war/assets/was_boiling_point.png',
          src: '/units/great_war/assets/was_boiling_point.png',
          is_artwork: true,
          caption:
            "British satirical cartoon by Leonard Raven-Hill in Punch depicting the leaders of Britain, France, Germany, Austria-Hungary, and Russia struggling to sit on the lid of a violently boiling pot labeled 'Balkan Troubles'.",
          citation: 'Punch, or the London Charivari, London (Vol. 143, 2 October 1912, p. 283).',
          context:
            "The First Balkan War (1912) broke out when the Balkan League attacked the decaying Ottoman Empire. The cartoon illustrates how the violent nationalist passions of the Balkans threatened to boil over and engulf the Great Powers, who desperately tried to contain the flames while pursuing conflicting regional ambitions. **Hinge Question:** Why was the metaphor of a 'boiling pot' an accurate description of how Balkan regional conflicts dragged the Great Powers into disaster?",
          hinge_question:
            "Why was the metaphor of a 'boiling pot' an accurate description of how Balkan regional conflicts dragged the Great Powers into disaster?",
          question_badge: 'Author’s Purpose',
          question:
            "What was the cartoonist Leonard Raven-Hill trying to communicate about the Great Powers' relationship to Balkan instability in 1912?",
          enquiry_question:
            "What was the cartoonist Leonard Raven-Hill trying to communicate about the Great Powers' relationship to Balkan instability in 1912?",
          model_answer:
            'The cartoonist was showing that ethnic and nationalist conflict in the Balkans was an uncontrollable explosive force that the Great Powers could barely suppress, and which threatened to destroy European peace despite their collective efforts.',
          discussion_ideas: [
            'Vivid visual metaphor: Depicts nationalism as boiling steam that cannot be permanently suppressed.',
            'Collective vulnerability: All five leaders are precariously balanced on the cauldron together.',
            'Foreshadowing Sarajevo: Directly presaged how a spark in Bosnia in 1914 would finally blow the lid off European peace.',
          ],
          source_context:
            "The First Balkan War (1912) broke out when the Balkan League attacked the decaying Ottoman Empire. The cartoon illustrates how the violent nationalist passions of the Balkans threatened to boil over and engulf the Great Powers, who desperately tried to contain the flames while pursuing conflicting regional ambitions. **Hinge Question:** Why was the metaphor of a 'boiling pot' an accurate description of how Balkan regional conflicts dragged the Great Powers into disaster?",
          teacher_notes: {
            source_context:
              "The First Balkan War (1912) broke out when the Balkan League attacked the decaying Ottoman Empire. The cartoon illustrates how the violent nationalist passions of the Balkans threatened to boil over and engulf the Great Powers, who desperately tried to contain the flames while pursuing conflicting regional ambitions. **Hinge Question:** Why was the metaphor of a 'boiling pot' an accurate description of how Balkan regional conflicts dragged the Great Powers into disaster?",
          },
          id: 'gw_l4_src_d',
        },
        {
          letter: 'E',
          type: 'visual',
          title: 'Source E (Operational Military Map): The German Schlieffen Plan (1905–1914)',
          image: '/units/great_war/assets/schlieffen_plan_simple_map.png',
          src: '/units/great_war/assets/schlieffen_plan_simple_map.png',
          caption:
            "Strategic cartographic diagram of Field Marshal Alfred von Schlieffen's military plan, showing the massive right-wing sweep of five German armies through neutral Belgium to encircle Paris within 42 days.",
          citation:
            'German Imperial General Staff (Großer Generalstab), Berlin / Militärgeschichtliches Forschungsamt (MGFA).',
          context:
            'Terrified of fighting a simultaneous two-front war against France and Russia, the German General Staff formulated the Schlieffen Plan. It gambled that slow Russian mobilization would allow Germany 42 days to invade neutral Belgium, bypass French border forts, encircle Paris, and knock France out before turning east to face Russia. **Hinge Question:** Why did the Schlieffen Plan guarantee that any dispute with Russia in the Balkans would automatically result in a German invasion of France and Belgium?',
          hinge_question:
            'Why did the Schlieffen Plan guarantee that any dispute with Russia in the Balkans would automatically result in a German invasion of France and Belgium?',
          question_badge: 'Cartographic Evidence',
          question:
            'How does this operational map demonstrate why the Schlieffen Plan made British neutrality impossible once war began?',
          enquiry_question:
            'How does this operational map demonstrate why the Schlieffen Plan made British neutrality impossible once war began?',
          model_answer:
            'The map shows that the entire German strategy required marching massive armies through neutral Belgium, directly violating the 1839 Treaty of London which Britain was legally and strategically committed to defend.',
          discussion_ideas: [
            'Inflexible military logic: Subordinated all political and diplomatic considerations to rigid railway timetables.',
            'Violation of Belgian neutrality: Made British intervention virtually guaranteed.',
            'Fatal gamble on Russian speed: Assumed Russia would take six weeks to mobilize, which proved disastrously incorrect in 1914.',
          ],
          source_context:
            'Terrified of fighting a simultaneous two-front war against France and Russia, the German General Staff formulated the Schlieffen Plan. It gambled that slow Russian mobilization would allow Germany 42 days to invade neutral Belgium, bypass French border forts, encircle Paris, and knock France out before turning east to face Russia. **Hinge Question:** Why did the Schlieffen Plan guarantee that any dispute with Russia in the Balkans would automatically result in a German invasion of France and Belgium?',
          teacher_notes: {
            source_context:
              'Terrified of fighting a simultaneous two-front war against France and Russia, the German General Staff formulated the Schlieffen Plan. It gambled that slow Russian mobilization would allow Germany 42 days to invade neutral Belgium, bypass French border forts, encircle Paris, and knock France out before turning east to face Russia. **Hinge Question:** Why did the Schlieffen Plan guarantee that any dispute with Russia in the Balkans would automatically result in a German invasion of France and Belgium?',
          },
          id: 'gw_l4_src_e',
        },
      ],
    },
    {
      id: 'lesson_5',
      card_image: '/units/great_war/assets/archduke_sarajevo_car_1914.jpg',
      card_position: 'center 22%',
      banner: {
        image: '/units/great_war/assets/archduke_sarajevo_car_1914.jpg',
        position: 'center 22%',
        caption:
          'Archduke Franz Ferdinand and Sophie Duchess of Hohenberg in their open-top motor car in Sarajevo on 28 June 1914, shortly before the fatal shots at the Latin Bridge.',
      },
      causal_domino_spine: {
        title: 'The July Crisis & Countdown to War: Chronology Spine',
        subtitle: 'Key Turning Points & Causal Dominoes (M-A-I-N Framework)',
        stages: [
          {
            step: 1,
            para_ref: '[5.1]',
            date: '28 June 1914',
            title: 'The Sarajevo Assassination',
            actor: 'Gavrilo Princip & Franz Ferdinand',
            tag: '⚡ THE SPARK',
            trigger:
              'Nineteen-year-old Bosnian Serb Gavrilo Princip shoots Archduke Franz Ferdinand and his wife Sophie in Sarajevo.',
            connective:
              'Austria-Hungary resolved to crush Serbia once and for all, but urgently required German military guarantees first.',
            question: 'What motivated the Black Hand to assassinate Franz Ferdinand in Sarajevo?',
          },
          {
            step: 2,
            para_ref: '[5.2]',
            date: '5 July 1914',
            title: 'The German "Blank Cheque"',
            actor: 'Kaiser Wilhelm II & Austria',
            tag: '🤝 ALLIANCES',
            trigger:
              'Kaiser Wilhelm II promises Austria unconditional German military backing in whatever action it takes against Serbia.',
            connective:
              'Gave Austrian hawks reckless confidence to issue extreme demands that made peaceful compromise impossible.',
            question: 'How did Germany\'s "Blank Cheque" escalate the regional crisis?',
          },
          {
            step: 3,
            para_ref: '[5.3]',
            date: '23–28 July 1914',
            title: 'The Ultimatum & War Declared',
            actor: 'Austria-Hungary & Serbia',
            tag: '⚡ THE SPARK',
            trigger:
              'Austria delivers a harsh 10-point ultimatum; Serbia accepts nine points, but Austria declares war anyway on 28 July and bombards Belgrade.',
            connective:
              'Tsar Nicholas II ordered full Russian army mobilisation, activating the rigid chain reaction of European alliances.',
            question: 'Explain why Austria’s Ten-Point Ultimatum made war inevitable.',
          },
          {
            step: 4,
            para_ref: '[5.4]',
            date: '29–31 July 1914',
            title: 'Mobilisation & The Railway Trap',
            actor: 'Tsar Nicholas II & Germany',
            tag: '🎖️ MILITARISM',
            trigger:
              'Russia mobilizes its army; Germany demands a halt within 12 hours, then declares war on Russia on 1 August and mobilizes its own forces.',
            connective:
              'Diplomats lost control to military generals whose rigid railway mobilization timetables left no time for negotiation.',
            question:
              'In what ways did rigid railway mobilisation schedules trigger the domino effect?',
          },
          {
            step: 5,
            para_ref: '[5.5]',
            date: '1–4 August 1914',
            title: 'Schlieffen Plan & British Entry',
            actor: 'Germany, Belgium & Britain',
            tag: '🤝 ALLIANCES',
            trigger:
              'Germany invades neutral Belgium to execute the Schlieffen Plan against France; Britain honours the 1839 Treaty of London and declares war.',
            connective:
              'Thirty-seven days after the assassination, all five European great powers were plunged into the catastrophic First World War.',
            question: 'What forced Great Britain to declare war following the invasion of Belgium?',
          },
        ],
      },
      video: [
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=OfO7TduevHA',
          title: 'How the Assassination of Archduke Franz Ferdinand Unfolded with Dan Snow',
          duration: '4 mins 12 secs',
          pathway: 'Starter Hook',
          teacher_guidance:
            "Dan Snow retraces the steps of Gavrilo Princip and the Black Hand in Sarajevo on 28 June 1914, following the failed morning bomb and the wrong turn at Schiller's Delicatessen. Recommended Watch Window: 00:00–03:45 • Lesson Phase: Quick Starter Check (0–3m). Tone Alert: Fast-paced on-the-ground historical investigation.",
          viewing_task:
            "<ol><li><strong>[01:00] Quick Check:</strong> What was the date of Archduke Franz Ferdinand and Duchess Sophie's assassination in Sarajevo, Bosnia?</li><li><strong>[02:30] Hinge Question:</strong> How did an accidental wrong turn by the Archduke's chauffeur onto Franz Josef Street bring the car to a halt directly in front of 19-year-old Gavrilo Princip?</li></ol>",
          model_answer:
            "<ol><li><strong>Quick Check:</strong> 28 June 1914 (Vidovdan / St. Vitus' Day).</li><li><strong>Hinge Question:</strong> After Nedeljko Čabrinović's morning bomb bounced off the Archduke's convertible and injured bystanders, the Archduke altered his schedule to visit the wounded in hospital. However, his chauffeur was never informed of the route change and mistakenly turned down the original route. When ordered to reverse, the engine stalled right beside the Schiller delicatessen, where a dispirited Gavrilo Princip was standing with a Browning pistol, providing an unexpected point-blank opportunity.</li></ol>",
        },
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=Fmobm9pZtTg',
          title: 'The Bullet that Started WWI | Simple History',
          duration: '10 mins 27 secs',
          pathway: 'Enquiry Evidence',
          teacher_guidance:
            'Animated breakdown of the Black Hand conspirators (led by Colonel Apis), Serbian state complicity, the Austro-Hungarian 10-point Ultimatum, and the domino cascade of war declarations. Recommended Watch Window: 01:15–07:15 • Lesson Phase: Guided Instruction & Archival Investigation. Tone Alert: Accessible, detailed animated historical narrative.',
          viewing_task:
            "<ol><li><strong>[02:30] Recall:</strong> What was the secret Serbian nationalist society named that organized, armed, and trained the assassins, and what was its official motto?</li><li><strong>[04:45] Explain:</strong> Describe the Austro-Hungarian Ultimatum of 23 July 1914: why did point 6 deliberately violate Serbian sovereignty to guarantee Serbia's rejection?</li><li><strong>[06:30] Challenge:</strong> Trace the final chain of declarations from 28 July to 4 August 1914: why did Germany's invasion of neutral Belgium compel Great Britain to enter the war?</li></ol>",
          model_answer:
            '<ol><li><strong>Recall:</strong> The Black Hand (officially <em>Ujedinjenje ili Smrt</em> / "Union or Death").</li><li><strong>Explain:</strong> Vienna deliberately drafted the ultimatum with impossible demands, giving Serbia 48 hours to reply. Point 6 demanded that Austro-Hungarian police and judicial officials be permitted to enter Serbian territory to investigate and prosecute the plotters. Accepting this would strip Serbia of its judicial independence and sovereignty, effectively making it a Habsburg vassal state.</li><li><strong>Challenge:</strong> Although Serbia accepted nine of the ten demands, Austria declared war on 28 July and shelled Belgrade. Russia mobilized to protect its Slavic ally; Germany responded by mobilizing and declaring war on Russia and France, activating the Schlieffen Plan. When German armies invaded neutral Belgium, Germany violated the 1839 Treaty of London. Britain, unwilling to see the Channel ports fall to an aggressive superpower, declared war on Germany on 4 August at midnight.</li></ol>',
        },
        {
          type: 'era',
          url: 'https://era.org.uk/streaming-service-resource/learning-zone-britain-and-the-start-of-ww1-bbc-two/',
          title: 'BBC Two / ERA: Britain and the Start of WW1 | Learning Zone',
          duration: '15 mins 0 secs',
          pathway: 'Archival Documentary',
          teacher_guidance:
            "Archival examination of the British Cabinet debates during the July Crisis: Sir Edward Grey's diplomacy, the moral dilemma over Belgian neutrality, and the anti-war Liberal divide. Recommended Watch Window: 01:00–06:45 • Lesson Phase: Guided Instruction & Archival Investigation. Tone Alert: Classic BBC historical documentary featuring primary cabinet records.",
          viewing_task:
            '<ol><li><strong>[02:00] Recall:</strong> Name the 1839 international treaty that guaranteed the perpetual neutrality and territorial independence of Belgium, signed by Britain and Prussia.</li><li><strong>[04:15] Explain:</strong> What famous words did British Foreign Secretary Sir Edward Grey utter as he watched the gas street lamps being lit outside the Foreign Office on 3 August 1914?</li><li><strong>[05:50] Challenge:</strong> Evaluate why German Chancellor Bethmann-Hollweg expressed astonishment that Britain was going to war over a "scrap of paper": did Britain fight for Belgium or for the European balance of power?</li></ol>',
          model_answer:
            '<ol><li><strong>Recall:</strong> The Treaty of London (1839).</li><li><strong>Explain:</strong> "The lamps are going out all over Europe; we shall not see them lit again in our lifetime." Grey recognized that industrialization and mass conscription had created weapons of slaughter that would destroy European civilization and its old imperial order.</li><li><strong>Challenge:</strong> While Belgian neutrality provided a righteous moral justification that united a divided British Cabinet and public, the underlying strategic reality was balance of power. If Germany crushed France and occupied the Belgian coastline, Britain would face a single hostile military hegemon dominating the English Channel and North Sea, threatening the Royal Navy and the British homeland.</li></ol>',
        },
        {
          type: 'era',
          url: 'https://era.org.uk/streaming-service-resource/assassination-of-archduke-franz-ferdinand-days-that-shook-the-world/',
          title: 'BBC / ERA: Days That Shook the World – Assassination of Archduke Franz Ferdinand',
          duration: '28 mins 0 secs',
          pathway: 'Dramatized Investigation',
          teacher_guidance:
            'High-calibre BBC dramatization recreating the morning in Sarajevo with precise minute-by-minute reenactment, archival photographs, and forensic historical analysis. Recommended Watch Window: 02:00–09:30 • Lesson Phase: High-Attainer Stretch & Historical Reenactment. Tone Alert: Riveting BBC dramatized investigation.',
          viewing_task:
            "<ol><li><strong>[03:30] Recall:</strong> What weapon did Nedeljko Čabrinović use in his failed assassination attempt along the Appel Quay, and what happened when he swallowed an expired cyanide pill and jumped into the river?</li><li><strong>[06:00] Explain:</strong> Describe the tragic final moments inside the royal car: what were Archduke Franz Ferdinand's dying words to his pregnant wife Sophie?</li><li><strong>[08:45] Challenge:</strong> Evaluate the tragic irony of Franz Ferdinand's assassination: why was the Archduke actually the strongest voice for peace and moderation inside the Habsburg Empire?</li></ol>",
          model_answer:
            '<ol><li><strong>Recall:</strong> A percussion hand grenade; the cyanide pill merely induced vomiting, and the Miljacka River was only four inches deep in summer, allowing police to drag him out and arrest him.</li><li><strong>Explain:</strong> After Princip fired two shots, Sophie collapsed across her husband\'s knees. Bleeding profusely from a severed jugular vein, the Archduke begged: "Sophie, Sophie, don\'t die! Live for our children!", murmuring repeatedly "It is nothing... it is nothing..." before losing consciousness.</li><li><strong>Challenge:</strong> Franz Ferdinand was deeply opposed to military chief of staff Franz Conrad von Hötzendorf\'s plans for a pre-emptive war with Serbia, warning that war with Serbia would inevitably mean war with Russia, which would destroy both empires. The Archduke actually favored "Trialism"—reorganizing the empire into three equal parts to give Slavs full political rights. By assassinating the one man who could have restrained the military hawks, the Black Hand triggered the very war that destroyed their people.</li></ol>',
        },
      ],
      skill: 'Short-Term Causation & The July Crisis: From Sarajevo to World War',
      title: 'Enquiry 5: The July Crisis: Sarajevo to the Outbreak of War (June–August 1914)',
      subtitle:
        'From the Shots at the Latin Bridge and the Blank Cheque to the Invasion of Belgium',
      enquiryQuestion:
        'Why did a single assassination in Sarajevo ignite thirty-seven days of diplomatic madness and world war?',
      margin_spine: [
        {
          year: '28 Jun 1914',
          label: 'Sarajevo Shots',
        },
        {
          year: '5 Jul 1914',
          label: 'The Blank Cheque',
        },
        {
          year: '23–28 Jul',
          label: 'The Ultimatum',
        },
        {
          year: '29–31 Jul',
          label: 'Train Timetables',
        },
        {
          year: '1–4 Aug',
          label: 'Belgian Neutrality',
        },
      ],
      teacher_notes: {
        primer:
          'This final enquiry investigates the dramatic thirty-seven-day countdown from the assassination of Archduke Franz Ferdinand in Sarajevo to the general outbreak of the First World War in August 1914. Students analyze the mechanics of short-term escalation: the Black Hand assassination, Kaiser Wilhelm II’s unconditional "Blank Cheque" to Austria, the deliberately intolerable Ten-Point Ultimatum delivered to Serbia, the inexorable pull of railway mobilization timetables, and Germany’s execution of the Schlieffen Plan violating Belgian neutrality. The enquiry challenges students to construct a synoptic historical verdict balancing long-term structural rivalries (MAIN: Militarism, Alliances, Imperialism, Nationalism) against the immediate human blunders of the July Crisis.',
        objectives: [
          {
            objective:
              'Explain why Archduke Franz Ferdinand was assassinated in Sarajevo on 28 June 1914.',
            primer:
              'Focus on paragraph [5.1]. Describe Franz Ferdinand’s visit on Vidovdan (St Vitus Day), the conspirators of Young Bosnia, and the fatal wrong turn outside Schiller’s Delicatessen near the Latin Bridge.',
            question:
              'Why did Serbian nationalists choose Franz Ferdinand as their primary target, and how did a series of blunders place him in front of Gavrilo Princip?',
          },
          {
            objective:
              'Analyze how Germany’s "Blank Cheque" escalated a regional conflict into a continental crisis.',
            primer:
              'Direct students to paragraph [5.2]. Show how Kaiser Wilhelm II pledged unconditional military support to Austria-Hungary, encouraging Vienna to issue its harsh ultimatum to Serbia.',
            question: 'Why was Germany’s "Blank Cheque" considered reckless imperial brinkmanship?',
          },
          {
            objective:
              'Evaluate how rigid railway mobilization timetables and the Schlieffen Plan forced Great Britain into the war.',
            primer:
              'Focus on paragraphs [5.4] and [5.5]. Explain A.J.P. Taylor’s "war by timetable" and how the German invasion of neutral Belgium forced Britain to honor the 1839 Treaty of London.',
            question:
              'Why did German generals insist that invading neutral Belgium was a military necessity, even though it guaranteed British entry into the war?',
          },
        ],
        source_context:
          'Primary forensic map and archival evidence depicting the assassination route of Archduke Franz Ferdinand along the Appel Quay in Sarajevo on 28 June 1914. Following an earlier failed bomb attack by Nedeljko Čabrinović, the Archduke’s motorcade attempted to alter its route to visit injured officers in hospital. However, the chauffeur Leopold Lojka was not informed and turned right into Franz Josef Street outside Schiller’s Delicatessen beside the Latin Bridge. Attempting to reverse, the engine stalled directly in front of nineteen-year-old assassin Gavrilo Princip, who drew his Browning pistol and fired two fatal shots at point-blank range. **Hinge Question:** Was the assassination of Archduke Franz Ferdinand the fundamental cause of the First World War, or merely the trigger that exposed existing systemic rivalries?',
      },
      do_now: {
        title: 'Do Now: Alliances & Balkan Crises Recall',
        type: 'mixed',
        items: [
          {
            question: 'Which three countries formed the Triple Alliance in 1882?',
            answer: 'Germany, Austria-Hungary, and Italy',
          },
          {
            question: 'Which three countries formed the Triple Entente in 1907?',
            answer: 'Great Britain, France, and Russia',
          },
          {
            question: 'Which European region was known as the "Powder Keg of Europe"?',
            answer: 'The Balkans',
          },
          {
            question: 'Which territory did Austria-Hungary illegally annex in October 1908?',
            answer: 'Bosnia-Herzegovina',
          },
          {
            question:
              'Which country emerged triumphant from the 1912–1913 Balkan Wars, doubling in size?',
            answer: 'Serbia',
          },
        ],
      },
      vocab: [
        {
          term: 'Black Hand (Crna Ruka)',
          definition:
            'A secret Serbian nationalist military terrorist society dedicated to creating a "Greater Serbia" by liberating South Slavs from Austria-Hungary.',
          syllables: 'Black Hand (Crna Ru-ka)',
          phonetic: 'black hand (crna ruka)',
          tier: '2',
        },
        {
          term: 'Blank Cheque (Blankovollmacht)',
          definition:
            'Kaiser Wilhelm II’s unconditional guarantee of total German military backing given to Austria-Hungary on 5 July 1914.',
          syllables: 'Blank Che-que (Bla-nko-vo-llmacht)',
          phonetic: 'blank cheque (blankovollmacht)',
          tier: '3',
        },
        {
          term: 'Ultimatum',
          definition:
            'A final set of non-negotiable diplomatic demands with a rigid deadline, the rejection of which will result in an immediate declaration of war.',
          syllables: 'U-lti-matum',
          phonetic: 'ultimatum',
          tier: '3',
        },
        {
          term: 'Mobilisation',
          definition:
            'The rapid assembly and organization of a nation’s military reserves, troops, and railway supplies for active combat.',
          syllables: 'Mo-bili-sation',
          phonetic: 'mobilisation',
          tier: '3',
        },
        {
          term: 'Schlieffen Plan',
          definition:
            'Germany’s strategic war plan drafted by Count von Schlieffen to rapidly conquer France in 42 days via neutral Belgium before pivoting to defeat Russia.',
          syllables: 'Schlief-fen plan',
          phonetic: 'ˈʃliːfən plæn',
          tier: '3',
        },
      ],
      narrative_blocks: [
        {
          act: 1,
          title: 'The Assassination of Franz Ferdinand in Sarajevo (28 June 1914)',
          text: '<span class="para-ref">[5.1]</span> On Sunday, 28 June 1914, **Archduke Franz Ferdinand**, heir to the Austro-Hungarian throne, visited **Sarajevo** with his wife Sophie. The date was <em>Vidovdan</em> (St Vitus Day), a sacred Serbian national holiday. Six young assassins from **Young Bosnia** waited along the Appel Quay. They were armed with pistols and bombs supplied by the Serbian secret society, the **Black Hand**, led by Colonel Dragutin Dimitrijević ("Apis").<br><br><span class="para-ref">[5.2]</span> The first attack failed when a bomb bounced off the car, injuring bystanders. After a City Hall reception, Franz Ferdinand decided to visit the wounded in hospital. However, his driver took a wrong turn onto Franz Josef Street outside **Schiller\'s Delicatessen** near the **Latin Bridge**. When ordered to reverse, the car stalled. Standing nearby was nineteen-year-old student **Gavrilo Princip**. Princip stepped forward and fired two shots at close range, killing Sophie and Franz Ferdinand within minutes.',
          image: '/units/great_war/assets/archduke_sarajevo_car_1914.jpg',
          image_alt:
            'Archival photograph of Archduke Franz Ferdinand and Sophie in their open-top motorcar in Sarajevo, 28 June 1914',
          caption:
            'Archduke Franz Ferdinand and his wife Sophie departing the Sarajevo Town Hall in their Graf & Stift open-top motorcar on 28 June 1914, less than ten minutes before their assassination.',
          source: {
            letter: 'A',
            type: 'visual',
            title:
              'Source A (Official Cartographic Investigation): Motorcade Route and Assassination Site at the Latin Bridge, Sarajevo (28 June 1914)',
            image: '/units/great_war/assets/map_sarajevo_route.jpg',
            src: '/units/great_war/assets/map_sarajevo_route.jpg',
            caption:
              "Austro-Hungarian police investigation map showing the Appel Quay motorcade route along the Miljacka River and the fatal wrong turn into Franz Josef Street outside Schiller's Delicatessen.",
            citation:
              'Bosnian State Archives, Sarajevo / Austro-Hungarian District Court of Sarajevo (Inv. Akt-Pr-1914-Sarajevo).',
            context:
              'Following an earlier failed bomb attack by Nedeljko Čabrinović, Archduke Franz Ferdinand decided to alter his schedule to visit wounded officers in hospital. However, his chauffeurs were not informed; when lead driver Leopold Lojka turned into Franz Josef Street, Governor Potiorek ordered him to brake and reverse, stalling the car directly in front of Gavrilo Princip. **Hinge Question:** How did a series of administrative blunders and a wrong turn transform a bungled assassination plot into the catalyst for world war?',
            hinge_question:
              'How did a series of administrative blunders and a wrong turn transform a bungled assassination plot into the catalyst for world war?',
            question_badge: 'Cartographic Evidence',
            question:
              'What does this investigation map show about the role of chance and error in the assassination of Franz Ferdinand?',
            enquiry_question:
              'What does this investigation map show about the role of chance and error in the assassination of Franz Ferdinand?',
            model_answer:
              'The map shows that Princip had abandoned his post after the morning bomb attack failed; the royal car took an unplanned wrong turn and stalled right in front of him, giving him an unexpected, point-blank opportunity to shoot.',
            discussion_ideas: [
              'Accident vs inevitability: Highlights how contingency and human error intersected with structural tensions.',
              'Security failures: Astonishing lack of police escorts along the published motorcade route.',
              'Symbolic date: 28 June was St. Vitus Day (Vidovdan), a sacred anniversary of Serbian national suffering that provoked intense nationalist anger.',
            ],
            source_context:
              'Following an earlier failed bomb attack by Nedeljko Čabrinović, Archduke Franz Ferdinand decided to alter his schedule to visit wounded officers in hospital. However, his chauffeurs were not informed; when lead driver Leopold Lojka turned into Franz Josef Street, Governor Potiorek ordered him to brake and reverse, stalling the car directly in front of Gavrilo Princip. **Hinge Question:** How did a series of administrative blunders and a wrong turn transform a bungled assassination plot into the catalyst for world war?',
            teacher_notes: {
              source_context:
                'Following an earlier failed bomb attack by Nedeljko Čabrinović, Archduke Franz Ferdinand decided to alter his schedule to visit wounded officers in hospital. However, his chauffeurs were not informed; when lead driver Leopold Lojka turned into Franz Josef Street, Governor Potiorek ordered him to brake and reverse, stalling the car directly in front of Gavrilo Princip. **Hinge Question:** How did a series of administrative blunders and a wrong turn transform a bungled assassination plot into the catalyst for world war?',
            },
            id: 'gw_l5_src_a',
          },
          sources: [
            {
              letter: 'A',
              type: 'visual',
              title:
                'Source A (Official Cartographic Investigation): Motorcade Route and Assassination Site at the Latin Bridge, Sarajevo (28 June 1914)',
              image: '/units/great_war/assets/map_sarajevo_route.jpg',
              src: '/units/great_war/assets/map_sarajevo_route.jpg',
              caption:
                "Austro-Hungarian police investigation map showing the Appel Quay motorcade route along the Miljacka River and the fatal wrong turn into Franz Josef Street outside Schiller's Delicatessen.",
              citation:
                'Bosnian State Archives, Sarajevo / Austro-Hungarian District Court of Sarajevo (Inv. Akt-Pr-1914-Sarajevo).',
              context:
                'Following an earlier failed bomb attack by Nedeljko Čabrinović, Archduke Franz Ferdinand decided to alter his schedule to visit wounded officers in hospital. However, his chauffeurs were not informed; when lead driver Leopold Lojka turned into Franz Josef Street, Governor Potiorek ordered him to brake and reverse, stalling the car directly in front of Gavrilo Princip. **Hinge Question:** How did a series of administrative blunders and a wrong turn transform a bungled assassination plot into the catalyst for world war?',
              hinge_question:
                'How did a series of administrative blunders and a wrong turn transform a bungled assassination plot into the catalyst for world war?',
              question_badge: 'Cartographic Evidence',
              question:
                'What does this investigation map show about the role of chance and error in the assassination of Franz Ferdinand?',
              enquiry_question:
                'What does this investigation map show about the role of chance and error in the assassination of Franz Ferdinand?',
              model_answer:
                'The map shows that Princip had abandoned his post after the morning bomb attack failed; the royal car took an unplanned wrong turn and stalled right in front of him, giving him an unexpected, point-blank opportunity to shoot.',
              discussion_ideas: [
                'Accident vs inevitability: Highlights how contingency and human error intersected with structural tensions.',
                'Security failures: Astonishing lack of police escorts along the published motorcade route.',
                'Symbolic date: 28 June was St. Vitus Day (Vidovdan), a sacred anniversary of Serbian national suffering that provoked intense nationalist anger.',
              ],
              source_context:
                'Following an earlier failed bomb attack by Nedeljko Čabrinović, Archduke Franz Ferdinand decided to alter his schedule to visit wounded officers in hospital. However, his chauffeurs were not informed; when lead driver Leopold Lojka turned into Franz Josef Street, Governor Potiorek ordered him to brake and reverse, stalling the car directly in front of Gavrilo Princip. **Hinge Question:** How did a series of administrative blunders and a wrong turn transform a bungled assassination plot into the catalyst for world war?',
              teacher_notes: {
                source_context:
                  'Following an earlier failed bomb attack by Nedeljko Čabrinović, Archduke Franz Ferdinand decided to alter his schedule to visit wounded officers in hospital. However, his chauffeurs were not informed; when lead driver Leopold Lojka turned into Franz Josef Street, Governor Potiorek ordered him to brake and reverse, stalling the car directly in front of Gavrilo Princip. **Hinge Question:** How did a series of administrative blunders and a wrong turn transform a bungled assassination plot into the catalyst for world war?',
              },
              id: 'gw_l5_src_a',
            },
          ],
        },
        {
          act: 2,
          title: 'The "Blank Cheque" & The Escalation of the Crisis (5 July 1914)',
          text: '<span class="para-ref">[5.2]</span> The assassination caused shock and outrage across Europe. Austrian leaders decided to use the murders as an excuse to destroy the Serbian threat forever. However, attacking Serbia risked a war with Russia. On 5 July 1914, Austrian envoy Count Alexander Hoyos traveled to Berlin to secure German support.<br><br><span class="para-ref">[5.3]</span> Kaiser Wilhelm II and Chancellor Theobald von Bethmann-Hollweg made a fateful decision. They issued the famous **"Blank Cheque" (Blankovollmacht)**, promising unconditional German military backing to Austria-Hungary. Germany urged Vienna to strike quickly while international sympathy was high. German leaders gambled that Russia was not ready to fight and that Britain would remain neutral. Strengthened by German promises, Austrian leaders prepared for war.',
          source: {
            letter: 'B',
            type: 'written',
            title:
              'Source B (Imperial Diplomatic Dispatch): The German "Blank Cheque" to Austria-Hungary (6 July 1914)',
            text: "His Imperial Majesty [Kaiser Wilhelm II] authorized me to inform your Excellency that Austria-Hungary may rely upon Germany's full support... Even if matters should develop into a serious European war between Austria-Hungary and Russia, Vienna may feel assured that Germany, with her customary loyalty as an ally, will stand at her side. Finally, as far as concerns Serbia, His Majesty naturally cannot interfere in the dispute now taking place... But Emperor Franz Joseph may rest assured that His Majesty will faithfully stand by Austria-Hungary, as required by the obligations of his alliance and of his ancient friendship.",
            caption:
              "Official Austrian diplomatic record of Germany's unconditional pledge of military backing, famously known to historians as the 'Blank Cheque'.",
            citation:
              'Austrian State Archives (HHStA), Vienna / Politisches Archiv, Karton 521 (Österreich-Ungarns Aussenpolitik, Vol. 8, Document 10058).',
            context:
              "On 5–6 July 1914, Kaiser Wilhelm II and Chancellor Bethmann-Hollweg issued the 'Blank Cheque', promising unconditional military support if Austria-Hungary took military action against Serbia. German leaders believed Russia was unprepared for war and would back down, localizing the conflict. **Hinge Question:** Why did Germany's unconditional promise of support empower Austro-Hungarian hardliners to issue an impossible ultimatum to Serbia?",
            hinge_question:
              "Why did Germany's unconditional promise of support empower Austro-Hungarian hardliners to issue an impossible ultimatum to Serbia?",
            question_badge: 'Author’s Purpose',
            question:
              'Why did the German government issue this unconditional guarantee of support to Austria-Hungary in July 1914?',
            enquiry_question:
              'Why did the German government issue this unconditional guarantee of support to Austria-Hungary in July 1914?',
            model_answer:
              'The German government issued the guarantee to encourage Austria-Hungary to strike a swift, decisive blow against Serbia, gambling that firm German backing would intimidate Russia into staying out of the conflict.',
            discussion_ideas: [
              'Calculated risk: German leaders knew this could trigger world war, but preferred war in 1914 over war later when Russia was stronger.',
              'Loss of control: Berlin handed Vienna control over German foreign policy.',
              'Hubristic gamble: Overconfident assumption that Russia would back down as it had during the 1908 Bosnian Crisis.',
            ],
            source_context:
              "On 5–6 July 1914, Kaiser Wilhelm II and Chancellor Bethmann-Hollweg issued the 'Blank Cheque', promising unconditional military support if Austria-Hungary took military action against Serbia. German leaders believed Russia was unprepared for war and would back down, localizing the conflict. **Hinge Question:** Why did Germany's unconditional promise of support empower Austro-Hungarian hardliners to issue an impossible ultimatum to Serbia?",
            teacher_notes: {
              source_context:
                "On 5–6 July 1914, Kaiser Wilhelm II and Chancellor Bethmann-Hollweg issued the 'Blank Cheque', promising unconditional military support if Austria-Hungary took military action against Serbia. German leaders believed Russia was unprepared for war and would back down, localizing the conflict. **Hinge Question:** Why did Germany's unconditional promise of support empower Austro-Hungarian hardliners to issue an impossible ultimatum to Serbia?",
            },
            id: 'gw_l5_src_b',
            src: '',
            image: '',
          },
          sources: [
            {
              letter: 'B',
              type: 'written',
              title:
                'Source B (Imperial Diplomatic Dispatch): The German "Blank Cheque" to Austria-Hungary (6 July 1914)',
              text: "His Imperial Majesty [Kaiser Wilhelm II] authorized me to inform your Excellency that Austria-Hungary may rely upon Germany's full support... Even if matters should develop into a serious European war between Austria-Hungary and Russia, Vienna may feel assured that Germany, with her customary loyalty as an ally, will stand at her side. Finally, as far as concerns Serbia, His Majesty naturally cannot interfere in the dispute now taking place... But Emperor Franz Joseph may rest assured that His Majesty will faithfully stand by Austria-Hungary, as required by the obligations of his alliance and of his ancient friendship.",
              caption:
                "Official Austrian diplomatic record of Germany's unconditional pledge of military backing, famously known to historians as the 'Blank Cheque'.",
              citation:
                'Austrian State Archives (HHStA), Vienna / Politisches Archiv, Karton 521 (Österreich-Ungarns Aussenpolitik, Vol. 8, Document 10058).',
              context:
                "On 5–6 July 1914, Kaiser Wilhelm II and Chancellor Bethmann-Hollweg issued the 'Blank Cheque', promising unconditional military support if Austria-Hungary took military action against Serbia. German leaders believed Russia was unprepared for war and would back down, localizing the conflict. **Hinge Question:** Why did Germany's unconditional promise of support empower Austro-Hungarian hardliners to issue an impossible ultimatum to Serbia?",
              hinge_question:
                "Why did Germany's unconditional promise of support empower Austro-Hungarian hardliners to issue an impossible ultimatum to Serbia?",
              question_badge: 'Author’s Purpose',
              question:
                'Why did the German government issue this unconditional guarantee of support to Austria-Hungary in July 1914?',
              enquiry_question:
                'Why did the German government issue this unconditional guarantee of support to Austria-Hungary in July 1914?',
              model_answer:
                'The German government issued the guarantee to encourage Austria-Hungary to strike a swift, decisive blow against Serbia, gambling that firm German backing would intimidate Russia into staying out of the conflict.',
              discussion_ideas: [
                'Calculated risk: German leaders knew this could trigger world war, but preferred war in 1914 over war later when Russia was stronger.',
                'Loss of control: Berlin handed Vienna control over German foreign policy.',
                'Hubristic gamble: Overconfident assumption that Russia would back down as it had during the 1908 Bosnian Crisis.',
              ],
              source_context:
                "On 5–6 July 1914, Kaiser Wilhelm II and Chancellor Bethmann-Hollweg issued the 'Blank Cheque', promising unconditional military support if Austria-Hungary took military action against Serbia. German leaders believed Russia was unprepared for war and would back down, localizing the conflict. **Hinge Question:** Why did Germany's unconditional promise of support empower Austro-Hungarian hardliners to issue an impossible ultimatum to Serbia?",
              teacher_notes: {
                source_context:
                  "On 5–6 July 1914, Kaiser Wilhelm II and Chancellor Bethmann-Hollweg issued the 'Blank Cheque', promising unconditional military support if Austria-Hungary took military action against Serbia. German leaders believed Russia was unprepared for war and would back down, localizing the conflict. **Hinge Question:** Why did Germany's unconditional promise of support empower Austro-Hungarian hardliners to issue an impossible ultimatum to Serbia?",
              },
              id: 'gw_l5_src_b',
              src: '',
              image: '',
            },
          ],
        },
        {
          act: 3,
          title: 'The Ten-Point Ultimatum & Declaration of War on Serbia (23–28 July 1914)',
          text: '<span class="para-ref">[5.3]</span> On 23 July 1914, Austria-Hungary sent a harsh **Ten-Point Ultimatum** to Serbia, demanding an answer within forty-eight hours. The terms were deliberately designed to be impossible to accept. Austria demanded that Serbia ban anti-Austrian newspapers, dismiss hostile officers, and allow Austro-Hungarian police onto Serbian soil.<br><br><span class="para-ref">[5.4]</span> Allowing foreign police on sovereign soil would destroy Serbian independence. However, advised by Russia to show restraint, Serbia accepted eight demands and offered international arbitration for the other two. British Foreign Secretary Sir Edward Grey praised Serbia\'s peaceful reply. Nevertheless, Austria-Hungary was determined to fight. On **28 July 1914**, Austria declared war on Serbia. That night, Austrian gunboats shelled Belgrade from the Danube River. The July Crisis had turned into war.',
          source: {
            letter: 'C',
            type: 'written',
            title:
              'Source C (State Ultimatum): The Austro-Hungarian Ultimatum to Serbia (23 July 1914)',
            text: "The Royal Serbian Government shall pledge itself:<br>5. To accept the collaboration in Serbia of representatives of the Imperial and Royal Government [Austria-Hungary] for the suppression of the subversive movement directed against the territorial integrity of the Monarchy;<br>6. To take judicial proceedings against the accessories to the plot of June 28th who are on Serbian territory; delegates of the Austro-Hungarian Government will take part in the investigation relating thereto...<br><br>The Austro-Hungarian Government expects the reply of the Royal Government at the latest by Saturday, the 25th instant, at 6 o'clock in the evening.",
            caption:
              'Extract from the ten-point Austro-Hungarian diplomatic ultimatum delivered to the Serbian Foreign Ministry in Belgrade, intentionally drafted with a 48-hour deadline to force a military rejection.',
            citation:
              'Austrian State Archives (HHStA), Vienna / Ministerium des Äußern (Diplomatische Aktenstücke zur Vorgeschichte des Krieges 1914, Part 1, No. 7).',
            context:
              'Austria-Hungary delayed three weeks after the assassination before delivering a deliberately unacceptable ten-point ultimatum to Serbia. Points 5 and 6 demanded that Austrian police and judges enter Serbia to direct investigations, which Serbia could not accept without surrendering its sovereign independence. **Hinge Question:** Why did the Austro-Hungarian leadership intentionally draft the ultimatum so that Serbia could not possibly accept all its terms?',
            hinge_question:
              'Why did the Austro-Hungarian leadership intentionally draft the ultimatum so that Serbia could not possibly accept all its terms?',
            question_badge: 'Source Inference',
            question:
              "What does the inclusion of Points 5 and 6 reveal about Austria-Hungary's true objective in delivering this ultimatum?",
            enquiry_question:
              "What does the inclusion of Points 5 and 6 reveal about Austria-Hungary's true objective in delivering this ultimatum?",
            model_answer:
              'The inclusion of Points 5 and 6 reveals that Austria-Hungary never wanted a diplomatic compromise; Vienna intentionally demanded terms that violated Serbian national sovereignty so Serbia would reject them, providing an excuse for a military invasion.',
            discussion_ideas: [
              'Pretext for war: Designed from the start as an instrument of destruction rather than negotiation.',
              'Serbian masterstroke: Serbia accepted eight of ten points and conditionally accepted the rest, creating international sympathy.',
              "Austrian haste: Despite Serbia's extraordinarily conciliatory reply, Austria broke diplomatic relations within 45 minutes.",
            ],
            source_context:
              'Austria-Hungary delayed three weeks after the assassination before delivering a deliberately unacceptable ten-point ultimatum to Serbia. Points 5 and 6 demanded that Austrian police and judges enter Serbia to direct investigations, which Serbia could not accept without surrendering its sovereign independence. **Hinge Question:** Why did the Austro-Hungarian leadership intentionally draft the ultimatum so that Serbia could not possibly accept all its terms?',
            teacher_notes: {
              source_context:
                'Austria-Hungary delayed three weeks after the assassination before delivering a deliberately unacceptable ten-point ultimatum to Serbia. Points 5 and 6 demanded that Austrian police and judges enter Serbia to direct investigations, which Serbia could not accept without surrendering its sovereign independence. **Hinge Question:** Why did the Austro-Hungarian leadership intentionally draft the ultimatum so that Serbia could not possibly accept all its terms?',
            },
            id: 'gw_l5_src_c',
            src: '',
            image: '',
          },
          sources: [
            {
              letter: 'C',
              type: 'written',
              title:
                'Source C (State Ultimatum): The Austro-Hungarian Ultimatum to Serbia (23 July 1914)',
              text: "The Royal Serbian Government shall pledge itself:<br>5. To accept the collaboration in Serbia of representatives of the Imperial and Royal Government [Austria-Hungary] for the suppression of the subversive movement directed against the territorial integrity of the Monarchy;<br>6. To take judicial proceedings against the accessories to the plot of June 28th who are on Serbian territory; delegates of the Austro-Hungarian Government will take part in the investigation relating thereto...<br><br>The Austro-Hungarian Government expects the reply of the Royal Government at the latest by Saturday, the 25th instant, at 6 o'clock in the evening.",
              caption:
                'Extract from the ten-point Austro-Hungarian diplomatic ultimatum delivered to the Serbian Foreign Ministry in Belgrade, intentionally drafted with a 48-hour deadline to force a military rejection.',
              citation:
                'Austrian State Archives (HHStA), Vienna / Ministerium des Äußern (Diplomatische Aktenstücke zur Vorgeschichte des Krieges 1914, Part 1, No. 7).',
              context:
                'Austria-Hungary delayed three weeks after the assassination before delivering a deliberately unacceptable ten-point ultimatum to Serbia. Points 5 and 6 demanded that Austrian police and judges enter Serbia to direct investigations, which Serbia could not accept without surrendering its sovereign independence. **Hinge Question:** Why did the Austro-Hungarian leadership intentionally draft the ultimatum so that Serbia could not possibly accept all its terms?',
              hinge_question:
                'Why did the Austro-Hungarian leadership intentionally draft the ultimatum so that Serbia could not possibly accept all its terms?',
              question_badge: 'Source Inference',
              question:
                "What does the inclusion of Points 5 and 6 reveal about Austria-Hungary's true objective in delivering this ultimatum?",
              enquiry_question:
                "What does the inclusion of Points 5 and 6 reveal about Austria-Hungary's true objective in delivering this ultimatum?",
              model_answer:
                'The inclusion of Points 5 and 6 reveals that Austria-Hungary never wanted a diplomatic compromise; Vienna intentionally demanded terms that violated Serbian national sovereignty so Serbia would reject them, providing an excuse for a military invasion.',
              discussion_ideas: [
                'Pretext for war: Designed from the start as an instrument of destruction rather than negotiation.',
                'Serbian masterstroke: Serbia accepted eight of ten points and conditionally accepted the rest, creating international sympathy.',
                "Austrian haste: Despite Serbia's extraordinarily conciliatory reply, Austria broke diplomatic relations within 45 minutes.",
              ],
              source_context:
                'Austria-Hungary delayed three weeks after the assassination before delivering a deliberately unacceptable ten-point ultimatum to Serbia. Points 5 and 6 demanded that Austrian police and judges enter Serbia to direct investigations, which Serbia could not accept without surrendering its sovereign independence. **Hinge Question:** Why did the Austro-Hungarian leadership intentionally draft the ultimatum so that Serbia could not possibly accept all its terms?',
              teacher_notes: {
                source_context:
                  'Austria-Hungary delayed three weeks after the assassination before delivering a deliberately unacceptable ten-point ultimatum to Serbia. Points 5 and 6 demanded that Austrian police and judges enter Serbia to direct investigations, which Serbia could not accept without surrendering its sovereign independence. **Hinge Question:** Why did the Austro-Hungarian leadership intentionally draft the ultimatum so that Serbia could not possibly accept all its terms?',
              },
              id: 'gw_l5_src_c',
              src: '',
              image: '',
            },
          ],
        },
        {
          act: 4,
          title: 'Railway Mobilisation Schedules & The Domino Effect (29–31 July 1914)',
          text: '<span class="para-ref">[5.4]</span> The shelling of Belgrade set off the alliance system like dominoes. Russian commanders warned Tsar Nicholas II that if Russia failed to act, Austria would conquer the Balkans. Because Russia was vast with few railways, its army took six weeks to assemble. Delaying mobilization would leave Russia defenseless. On **30 July 1914**, the Tsar ordered **general mobilization**.<br><br><span class="para-ref">[5.5]</span> Russian mobilization triggered rigid military plans across Europe, a process historian A.J.P. Taylor called **"War by Timetable."** In 1914, mobilization was treated as an act of war involving millions of troops and inflexible train schedules. German Chief of Staff **Helmuth von Moltke the Younger** warned that war could no longer be stopped. Germany ordered Russia to halt mobilization, and demanded that France promise neutrality. Both refused. On 1 August, Germany declared war on Russia; on 3 August, Germany declared war on France.',
          image: '/units/great_war/assets/sarajevo_assassination_beltrame_1914.jpg',
          image_alt:
            'Illustration by Achille Beltrame depicting the assassination of Franz Ferdinand by Gavrilo Princip at the Latin Bridge',
          caption:
            "Achille Beltrame's famous contemporary cover illustration for La Domenica del Corriere (July 1914) depicting Gavrilo Princip firing his Browning automatic pistol at the royal couple.",
          source: {
            letter: 'D',
            id: 'gw_l5_src_d',
            type: 'written',
            title:
              'Source D (Imperial Mobilisation Decree): Tsar Nicholas II, Imperial Ukase on Russian General Mobilisation (30 July 1914)',
            context:
              'On 30 July 1914, following the Austrian bombardment of Belgrade, Tsar Nicholas II ordered full general mobilisation across the Russian Empire. Because Russian mobilisation threatened Germany’s eastern frontier, it triggered Berlin’s immediate decision to launch the Schlieffen Plan. **Hinge Question:** Why did Russia’s decision to mobilise its armies make a peaceful diplomatic solution impossible under the logic of European military plans?',
            hinge_question:
              'Why did Russia’s decision to mobilise its armies make a peaceful diplomatic solution impossible under the logic of European military plans?',
            text: '“In view of the opening of hostilities between Austria-Hungary and Serbia, We decree that the Army and Navy of the Russian Empire shall be brought to a complete war footing, and that general mobilisation shall begin immediately on 31 July. Let our brave troops answer the sovereign call of duty to defend Holy Orthodox Slavdom against Austrian aggression.”',
            caption:
              'Source D: Imperial decree ordering full general mobilisation of the Russian Armed Forces on 30 July 1914.',
            question_badge: 'Military Mobilisation',
            question:
              'Why did Russian mobilisation trigger an immediate declaration of war from Imperial Germany?',
            enquiry_question:
              'Why did Russian mobilisation trigger an immediate declaration of war from Imperial Germany?',
            model_answer:
              'Germany’s Schlieffen Plan depended on defeating France before Russian armies could mobilise; once Russia mobilised, German generals believed they had to attack immediately or face a fatal two-front war.',
            source_context:
              'On 30 July 1914, following the Austrian bombardment of Belgrade, Tsar Nicholas II ordered full general mobilisation across the Russian Empire. Because Russian mobilisation threatened Germany’s eastern frontier, it triggered Berlin’s immediate decision to launch the Schlieffen Plan. **Hinge Question:** Why did Russia’s decision to mobilise its armies make a peaceful diplomatic solution impossible under the logic of European military plans?',
            teacher_notes: {
              source_context:
                'On 30 July 1914, following the Austrian bombardment of Belgrade, Tsar Nicholas II ordered full general mobilisation across the Russian Empire. Because Russian mobilisation threatened Germany’s eastern frontier, it triggered Berlin’s immediate decision to launch the Schlieffen Plan. **Hinge Question:** Why did Russia’s decision to mobilise its armies make a peaceful diplomatic solution impossible under the logic of European military plans?',
            },
            src: '',
            image: '',
          },
          sources: [
            {
              letter: 'D',
              id: 'gw_l5_src_d',
              type: 'written',
              title:
                'Source D (Imperial Mobilisation Decree): Tsar Nicholas II, Imperial Ukase on Russian General Mobilisation (30 July 1914)',
              context:
                'On 30 July 1914, following the Austrian bombardment of Belgrade, Tsar Nicholas II ordered full general mobilisation across the Russian Empire. Because Russian mobilisation threatened Germany’s eastern frontier, it triggered Berlin’s immediate decision to launch the Schlieffen Plan. **Hinge Question:** Why did Russia’s decision to mobilise its armies make a peaceful diplomatic solution impossible under the logic of European military plans?',
              hinge_question:
                'Why did Russia’s decision to mobilise its armies make a peaceful diplomatic solution impossible under the logic of European military plans?',
              text: '“In view of the opening of hostilities between Austria-Hungary and Serbia, We decree that the Army and Navy of the Russian Empire shall be brought to a complete war footing, and that general mobilisation shall begin immediately on 31 July. Let our brave troops answer the sovereign call of duty to defend Holy Orthodox Slavdom against Austrian aggression.”',
              caption:
                'Source D: Imperial decree ordering full general mobilisation of the Russian Armed Forces on 30 July 1914.',
              question_badge: 'Military Mobilisation',
              question:
                'Why did Russian mobilisation trigger an immediate declaration of war from Imperial Germany?',
              enquiry_question:
                'Why did Russian mobilisation trigger an immediate declaration of war from Imperial Germany?',
              model_answer:
                'Germany’s Schlieffen Plan depended on defeating France before Russian armies could mobilise; once Russia mobilised, German generals believed they had to attack immediately or face a fatal two-front war.',
              source_context:
                'On 30 July 1914, following the Austrian bombardment of Belgrade, Tsar Nicholas II ordered full general mobilisation across the Russian Empire. Because Russian mobilisation threatened Germany’s eastern frontier, it triggered Berlin’s immediate decision to launch the Schlieffen Plan. **Hinge Question:** Why did Russia’s decision to mobilise its armies make a peaceful diplomatic solution impossible under the logic of European military plans?',
              teacher_notes: {
                source_context:
                  'On 30 July 1914, following the Austrian bombardment of Belgrade, Tsar Nicholas II ordered full general mobilisation across the Russian Empire. Because Russian mobilisation threatened Germany’s eastern frontier, it triggered Berlin’s immediate decision to launch the Schlieffen Plan. **Hinge Question:** Why did Russia’s decision to mobilise its armies make a peaceful diplomatic solution impossible under the logic of European military plans?',
              },
              src: '',
              image: '',
            },
          ],
        },
        {
          act: 5,
          title: 'The Schlieffen Plan, Belgian Neutrality & British Entry (1–4 August 1914)',
          text: '<span class="para-ref">[5.5]</span> Germany\'s strategy was dictated by the **Schlieffen Plan**, designed by Count Alfred von Schlieffen to prevent a two-front war. The plan assumed Russia would take six weeks to mobilize. During those six weeks, Germany would send ninety percent of its army through neutral **Belgium** to encircle Paris and knock France out in forty-two days, before turning east to fight Russia.<br><br><span class="para-ref">[5.6]</span> On 2 August, Germany demanded free passage through Belgium. King Albert refused, declaring: <em>"Belgium is a nation, not a road."</em> On **3 August 1914**, German armies invaded Belgium. This invasion brought Great Britain into the war. Britain had promised to protect Belgian neutrality in the **1839 Treaty of London**, and could not allow a hostile power to control Channel ports. When Germany dismissed the treaty as a <em>"scrap of paper,"</em> Britain declared war at 11:00 PM on **4 August 1914**. Watching London\'s street lamps, Sir Edward Grey remarked: <em>"The lamps are going out all over Europe; we shall not see them lit again in our lifetime."</em>',
          source: {
            letter: 'E',
            type: 'visual',
            title:
              'Source E (Police Record): Austro-Hungarian Police Mugshot of Gavrilo Princip (July 1914)',
            image: '/units/great_war/assets/card_princip.png',
            src: '/units/great_war/assets/card_princip.png',
            caption:
              'Austro-Hungarian imperial police identification photograph of 19-year-old Gavrilo Princip, taken in Sarajevo prison shortly after his arrest on 28 June 1914.',
            citation:
              'Austrian State Archives (HHStA), Vienna / Austrian Police Photographic Archive (Inv. Pol-1914-Princip).',
            context:
              "Too young under Austro-Hungarian law to receive the death penalty (which required a convict to be 20 years old at the time of the crime), Princip was sentenced to twenty years' hard labour in solitary confinement at the fortress of Theresienstadt. **Hinge Question:** Why did the physical youth and frail appearance of Gavrilo Princip contrast so sharply with the world-shattering geopolitical catastrophe his actions unleashed?",
            hinge_question:
              'Why did the physical youth and frail appearance of Gavrilo Princip contrast so sharply with the world-shattering geopolitical catastrophe his actions unleashed?',
            question_badge: 'Reliability & Provenance',
            question:
              'What does this primary police photograph reveal about the assassin whose actions triggered the First World War?',
            enquiry_question:
              'What does this primary police photograph reveal about the assassin whose actions triggered the First World War?',
            model_answer:
              'The photograph reveals an impoverished, slight, nineteen-year-old student, visually underscoring the astonishing disproportion between an individual teenage radical and the global catastrophe of industrialized war that followed.',
            discussion_ideas: [
              'Disproportion of cause and consequence: An obscure student ignited a clash of global empires.',
              'Legal protection of age: Missed the death penalty by only 27 days, saving him from execution but not slow death in prison.',
              'Mythology vs reality: Strips away romanticized heroic depictions to show the stark reality of political violence.',
            ],
            source_context:
              "Too young under Austro-Hungarian law to receive the death penalty (which required a convict to be 20 years old at the time of the crime), Princip was sentenced to twenty years' hard labour in solitary confinement at the fortress of Theresienstadt. **Hinge Question:** Why did the physical youth and frail appearance of Gavrilo Princip contrast so sharply with the world-shattering geopolitical catastrophe his actions unleashed?",
            teacher_notes: {
              source_context:
                "Too young under Austro-Hungarian law to receive the death penalty (which required a convict to be 20 years old at the time of the crime), Princip was sentenced to twenty years' hard labour in solitary confinement at the fortress of Theresienstadt. **Hinge Question:** Why did the physical youth and frail appearance of Gavrilo Princip contrast so sharply with the world-shattering geopolitical catastrophe his actions unleashed?",
            },
            id: 'gw_l5_src_e',
          },
          sources: [
            {
              letter: 'E',
              type: 'visual',
              title:
                'Source E (Police Record): Austro-Hungarian Police Mugshot of Gavrilo Princip (July 1914)',
              image: '/units/great_war/assets/card_princip.png',
              src: '/units/great_war/assets/card_princip.png',
              caption:
                'Austro-Hungarian imperial police identification photograph of 19-year-old Gavrilo Princip, taken in Sarajevo prison shortly after his arrest on 28 June 1914.',
              citation:
                'Austrian State Archives (HHStA), Vienna / Austrian Police Photographic Archive (Inv. Pol-1914-Princip).',
              context:
                "Too young under Austro-Hungarian law to receive the death penalty (which required a convict to be 20 years old at the time of the crime), Princip was sentenced to twenty years' hard labour in solitary confinement at the fortress of Theresienstadt. **Hinge Question:** Why did the physical youth and frail appearance of Gavrilo Princip contrast so sharply with the world-shattering geopolitical catastrophe his actions unleashed?",
              hinge_question:
                'Why did the physical youth and frail appearance of Gavrilo Princip contrast so sharply with the world-shattering geopolitical catastrophe his actions unleashed?',
              question_badge: 'Reliability & Provenance',
              question:
                'What does this primary police photograph reveal about the assassin whose actions triggered the First World War?',
              enquiry_question:
                'What does this primary police photograph reveal about the assassin whose actions triggered the First World War?',
              model_answer:
                'The photograph reveals an impoverished, slight, nineteen-year-old student, visually underscoring the astonishing disproportion between an individual teenage radical and the global catastrophe of industrialized war that followed.',
              discussion_ideas: [
                'Disproportion of cause and consequence: An obscure student ignited a clash of global empires.',
                'Legal protection of age: Missed the death penalty by only 27 days, saving him from execution but not slow death in prison.',
                'Mythology vs reality: Strips away romanticized heroic depictions to show the stark reality of political violence.',
              ],
              source_context:
                "Too young under Austro-Hungarian law to receive the death penalty (which required a convict to be 20 years old at the time of the crime), Princip was sentenced to twenty years' hard labour in solitary confinement at the fortress of Theresienstadt. **Hinge Question:** Why did the physical youth and frail appearance of Gavrilo Princip contrast so sharply with the world-shattering geopolitical catastrophe his actions unleashed?",
              teacher_notes: {
                source_context:
                  "Too young under Austro-Hungarian law to receive the death penalty (which required a convict to be 20 years old at the time of the crime), Princip was sentenced to twenty years' hard labour in solitary confinement at the fortress of Theresienstadt. **Hinge Question:** Why did the physical youth and frail appearance of Gavrilo Princip contrast so sharply with the world-shattering geopolitical catastrophe his actions unleashed?",
              },
              id: 'gw_l5_src_e',
            },
          ],
        },
      ],
      pair_share: {
        prompt:
          'Discuss with your partner: Could the First World War have been avoided during the July Crisis, or was Europe already doomed by decades of militarism and alliances?',
        think:
          'Reflect on whether individual leaders made fatal blunders or whether systemic forces made war inevitable.',
        pair: 'Take turns debating with your partner.',
        share: 'Share your pair’s conclusion with the class.',
      },
      tasks: [
        {
          type: 'extended_writing',
          topic: 'Question 5: Evaluative Statement Essay [12 marks • 15 mins]',
          question:
            '“The main cause of the First World War was alliance rivalries.” How far do you agree? Explain your answer. [12 marks]',
          stimulus: [
            'The Triple Alliance and Triple Entente rivalries',
            'The assassination of Archduke Franz Ferdinand',
          ],
          hints: [
            {
              label: 'Point',
              prompt:
                'State your thesis: evaluate whether alliance commitments or other factors (the July Crisis, militarism, rigid mobilisation timetables) were decisive.',
            },
            {
              label: 'Evidence',
              prompt:
                'Deploy balanced historical evidence: Triple Alliance vs Triple Entente, the "Blank Cheque", Gavrilo Princip at Sarajevo, the Schlieffen Plan, and Belgian neutrality.',
            },
            {
              label: 'Explanation',
              prompt:
                'Weigh how alliances created the fatal structural mechanism, while militarism and imperial brinkmanship provided the immediate catalyst that unleashed it.',
            },
            {
              label: 'Link',
              prompt:
                'Provide a sustained historical judgment weighing short-term triggers against long-term structural pressures to reach a clear verdict.',
            },
          ],
          scaffolding: {
            structure_strip: [
              {
                col: 'Paragraph 1: Alliance Rivalries (Agree)',
                prompt:
                  'Explain how the Triple Alliance and Triple Entente locked nations into automated escalation.',
                starter:
                  'On the one hand, it can be strongly argued that alliance rivalries were the decisive cause of the war because...',
              },
              {
                col: 'Paragraph 2: The July Crisis & Sarajevo (Counter-Argument)',
                prompt:
                  'Explain how the assassination of Franz Ferdinand and Austrian aggression sparked the conflict.',
                starter:
                  'On the other hand, the immediate trigger that ignited the conflict was the assassination of Archduke Franz Ferdinand at Sarajevo...',
              },
              {
                col: 'Paragraph 3: Militarism & Inflexible War Plans (Alternative Factor)',
                prompt:
                  'Explain how rigid railway timetables and the German Schlieffen Plan made peaceful compromise impossible.',
                starter:
                  'Furthermore, a crucial alternative factor was the role of militarism and inflexible mobilization timetables...',
              },
              {
                col: 'Historiographical Verdict (Conclusion)',
                prompt: 'Reach a sustained evaluative conclusion weighing the hierarchy of causes.',
                starter:
                  'In the final analysis, while the assassination in Sarajevo was the spark and the Schlieffen Plan determined the military timeline, the alliance system was the indispensable structural cause...',
              },
            ],
            sentence_starters: [
              'On one hand, it can be argued that alliance rivalries were the main cause because...',
              'A decisive factor supporting this argument was Germany’s "Blank Cheque" to Austria, which...',
              'On the other hand, an alternative argument is that the immediate trigger of Sarajevo was crucial because...',
              'Furthermore, militarism and the German Schlieffen Plan escalated the crisis because...',
              'The invasion of neutral Belgium was decisive because it brought Great Britain into the war...',
              'In the final analysis, I agree / disagree that alliances were the primary cause, because...',
            ],
            connective_bank: [
              'On one hand, it can be argued that...',
              'A decisive factor supporting this is...',
              'On the other hand...',
              'An alternative argument is that...',
              'Furthermore, it must be recognized that...',
              'Consequently...',
              'In the final analysis...',
            ],
            word_bank: [
              'Alliance Rivalries',
              'Triple Alliance',
              'Triple Entente',
              'Balance of Power',
              'Franz Ferdinand',
              'Blank Cheque',
              'Sarajevo',
              'Schlieffen Plan',
              'Neutrality of Belgium',
            ],
          },
          model_answer:
            'Historians remain divided over whether the First World War was primarily caused by alliance rivalries or by a lethal cocktail of militarism, aggressive imperialism, and short-term miscalculation during the July Crisis. While alliances provided the rigid structural tripwires that converted a localized Balkan dispute into a global conflagration, they alone did not make war inevitable; rather, it was aggressive brinkmanship and inflexible military war plans that detonated the system.\n\nOn the one hand, alliance rivalries were undeniably fundamental in establishing the structural conditions for general war. By 1914, Europe was polarized into two armed camps: the Triple Alliance (Germany, Austria-Hungary, and Italy) and the Triple Entente (Britain, France, and Russia). This division created deep existential paranoia in Berlin regarding "encirclement" (Einkreisung), convincing German leadership that any loss of Austria-Hungary’s Great Power status would be fatal. Consequently, when Kaiser Wilhelm II issued the unconditional "Blank Cheque" to Vienna on 5 July 1914, he guaranteed German military backing for an invasion of Serbia even if Russia intervened. Similarly, France’s commitment to Russia ensured that Tsarist mobilization would automatically bring French armies into the field. Without these mutual obligations, the conflict between Austria-Hungary and Serbia would have remained a third Balkan War.\n\nOn the other hand, alliance commitments were not purely automatic mechanisms; the war was triggered by specific human decisions and militant imperial ambition. The immediate spark was the 28 June 1914 assassination of Archduke Franz Ferdinand in Sarajevo by Gavrilo Princip and the Black Hand. Austrian Chief of Staff Conrad von Hötzendorf seized upon this outrage to advocate a pre-emptive war of annihilation against Serbia. Moreover, the July Crisis was rendered uncontrollable by militarism and rigid mobilization timetables. Once Tsar Nicholas II ordered Russian general mobilization on 30 July, military commanders insisted that railway schedules could not be halted. Germany’s war plan, the Schlieffen Plan, dictated an immediate, rapid invasion of France through neutral Belgium before Russian forces fully concentrated. It was this deliberate violation of Belgian neutrality—shattering the 1839 Treaty of London—that compelled Great Britain to declare war on 4 August 1914.\n\nIn the final analysis, the statement is largely convincing. While the assassination at Sarajevo provided the initial spark and the Schlieffen Plan dictated the military timetable, it was the entangling alliance network that bound the survival of great powers together, ensuring that a single shot on the Latin Bridge inevitably plunged the entire European continent into catastrophe.',
        },
      ],
      quiz: [
        {
          q: 'Who assassinated Archduke Franz Ferdinand?',
          a: 'Gavrilo Princip',
          options: [
            'Nedeljko Cabrinovic',
            'Dragutin Dimitrijevic',
            'Gavrilo Princip',
            'Leon Trotsky',
          ],
        },
        {
          q: 'To which radical student movement did Gavrilo Princip and the Sarajevo assassins belong?',
          a: 'Young Bosnia',
          options: ['Young Bosnia', 'The White Rose', 'The Red Guards', 'The Young Turks'],
        },
        {
          q: 'On what exact date was the Archduke assassinated?',
          a: '28 June 1914',
          options: ['28 July 1914', '28 June 1914', '11 November 1918', '4 August 1914'],
        },
        {
          q: 'Which empire had annexed Bosnia in 1908, angering Serbian nationalists?',
          a: 'Austria-Hungary',
          options: ['Russia', 'Germany', 'The Ottoman Empire', 'Austria-Hungary'],
        },
        {
          q: 'Who was the heir to the Austro-Hungarian throne that visited Sarajevo?',
          a: 'Archduke Franz Ferdinand',
          options: [
            'Archduke Franz Ferdinand',
            'Tsar Nicholas II',
            'Emperor Franz Joseph',
            'Kaiser Wilhelm II',
          ],
        },
        {
          q: 'Which clandestine Serbian secret society supplied the assassins with weapons and bombs?',
          a: 'The Black Hand',
          options: ['The Black Hand', 'The Serbian Guard', 'The Iron Guard', 'The Red Army'],
        },
        {
          q: 'What was the first, failed assassination attempt on the Archduke that morning?',
          a: 'A bomb was thrown at his car but bounced off',
          options: [
            'He was shot at but missed',
            'His driver was poisoned',
            'A bomb was thrown at his car but bounced off',
            'A bridge was blown up',
          ],
        },
        {
          q: "Why was Gavrilo Princip standing outside Schiller's Delicatessen when the Archduke's car stopped?",
          a: 'By total coincidence, the driver took a wrong turn and stalled the car right in front of him',
          options: [
            'The Archduke went in to buy a sandwich',
            'The police ordered the car to stop there',
            'By total coincidence, the driver took a wrong turn and stalled the car right in front of him',
            'Princip had planned the exact route',
          ],
        },
        {
          q: "What was the 'Blank Cheque'?",
          a: "Germany's promise of unconditional support to Austria-Hungary against Serbia",
          options: [
            'A bribe paid to the assassins',
            "Germany's promise of unconditional support to Austria-Hungary against Serbia",
            'A peace offer from Russia',
            'The money used to buy the guns',
          ],
        },
        {
          q: 'What happened on July 23, 1914?',
          a: 'Austria-Hungary sent an impossibly harsh ultimatum to Serbia',
          options: [
            'Austria-Hungary sent an impossibly harsh ultimatum to Serbia',
            'Germany invaded Belgium',
            'Russia declared war',
            'Britain joined the war',
          ],
        },
        {
          q: 'Why did Britain declare war on Germany on August 4, 1914?',
          a: 'Germany invaded neutral Belgium, violating the 1839 Treaty of London',
          options: [
            'Because France surrendered',
            'Because Germany sank a British ship',
            'Because of the assassination in Sarajevo',
            'Germany invaded neutral Belgium, violating the 1839 Treaty of London',
          ],
        },
      ],
      prologue:
        'On 28 June 1914, nineteen-year-old Gavrilo Princip fired two fatal pistol shots into the carriage of Archduke Franz Ferdinand in Sarajevo. Within thirty-seven days, ultimatums, imperial mobilisations, and German troops marching into neutral Belgium plunged Europe into total war. Could the catastrophic July Crisis have been avoided, or was war unstoppable?',
      exam_practice: {
        title: 'Key Stage 3 Disciplinary Writing: The July Crisis & The Outbreak of War',
        tariff: '12 marks (Evaluative Statement Essay)',
        questions: [
          {
            tariff: '12 marks',
            type: 'evaluative_essay_12m',
            question:
              '“The main cause of the First World War was alliance rivalries.” How far do you agree? Explain your answer. [12 marks]',
            stimulus: [
              'The Triple Alliance and Triple Entente rivalries',
              'The assassination of Archduke Franz Ferdinand',
            ],
            prompt:
              'Construct a balanced evaluative argument: on the one hand, evaluate how the rigid alliance commitments and mobilization timetables acted as the transmission belt that dragged all five great powers into war; on the other hand, evaluate alternative long-term causes—militarism (Schlieffen Plan), imperialism, and the immediate spark of the Sarajevo assassination. Reach a weighed conclusion.',
            model:
              'To a significant extent, it is accurate to argue that alliance rivalries were the primary structural cause of the First World War. While imperial rivalries, naval competition, and the immediate spark of the Sarajevo assassination supplied the fuel, it was the rigid, interlocking treaty commitments of the Triple Alliance and Triple Entente that converted a localized Balkan incident into an inescapable continental catastrophe.<br><br>On the one hand, alliance obligations were decisive because they bound great power survival to mutual military commitments. When Kaiser Wilhelm II and Theobald von Bethmann-Hollweg issued Germany’s unconditional "blank cheque" to Austria-Hungary on 5 July 1914, they encouraged Vienna to issue a draconian ultimatum designed to crush Serbia. When Austria bombarded Belgrade, Russia felt compelled to order general mobilization to defend its Slavic ally and prevent its alliance partner, France, from viewing it as unreliable. Crucially, the alliance treaties removed diplomatic flexibility: Germany declared war on Russia on 1 August and France on 3 August, while Britain entered on 4 August to honor its strategic alignment with France and uphold the 1839 Treaty of London guaranteeing Belgian neutrality. Without these binding alliances, the crisis would have remained a third localized Balkan war.<br><br>On the other hand, it can be argued that aggressive militarism and rigid railway mobilization timetables were the true culprits. Under the Schlieffen Plan, German military commanders believed that because Russia’s army took six weeks to mobilize, Germany had to strike and defeat France within forty days by violating Belgian neutrality. As historian A. J. P. Taylor argued, the great powers were dragged into conflict by "war by timetable", where military chiefs insisted that stopping troop trains would leave their nations defenceless. Furthermore, rampant nationalism in the Balkans and the specific terrorist act of the Black Hand in Sarajevo on 28 June 1914 provided the indispensable catalyst without which general mobilization would never have been triggered.<br><br>In conclusion, while militarism dictated the mechanical speed of escalation, alliance rivalries were the foundational cause. The division of Europe into two fortified blocs created the zero-sum atmosphere where every power believed that allowing an ally to be crushed meant its own eventual destruction, making general war inevitable once the trigger was pulled.',
            scaffolding: {
              acronym: 'PEEL Evaluative Essay Framework',
              acronym_title: '12-Mark Evaluative Statement Essay Standard',
              steps: [
                {
                  letter: 'THESIS',
                  name: 'State Position',
                  prompt:
                    'State clearly that alliance commitments converted a local dispute into a world war.',
                  starter:
                    'To a significant extent, it is accurate to argue that alliance rivalries were the primary cause because...',
                },
                {
                  letter: 'THEME 1',
                  name: 'Alliance Mechanics & Blank Cheque',
                  prompt:
                    'Explain the 5 July blank cheque, Russian mobilization, and mutual obligations dragging in Britain and France.',
                  starter: 'On the one hand, alliance rivalries were decisive because...',
                },
                {
                  letter: 'THEME 2',
                  name: 'Militarism, Timetables & Sarajevo Spark',
                  prompt:
                    'Evaluate alternative factors: the Schlieffen Plan, war by timetable (A.J.P. Taylor), and the Black Hand assassination.',
                  starter:
                    'On the other hand, it can be argued that rigid militarism and the Sarajevo spark were foundational because...',
                },
                {
                  letter: 'JUDGMENT',
                  name: 'Weighed Verdict',
                  prompt:
                    'Synthesize why alliances were the structural architecture without which world war was impossible.',
                  starter:
                    'In conclusion, while militarism determined the rapid execution of war, alliance rivalries were decisive because...',
                },
              ],
              sentence_starters: [
                'To a significant extent, it is accurate to argue that...',
                'On the one hand, alliance obligations were decisive because...',
                'In particular, Germany’s blank cheque to Austria-Hungary...',
                'On the other hand, an alternative argument highlights militarism and timetables, such as...',
                'In conclusion, the most decisive factor was... because...',
              ],
              connectives_bank: [
                'Triple Alliance',
                'Triple Entente',
                'blank cheque (5 July 1914)',
                'Sarajevo assassination',
                'Gavrilo Princip',
                'Black Hand',
                'Schlieffen Plan',
                'war by timetable',
                'A. J. P. Taylor',
              ],
            },
          },
        ],
      },
      sources: [
        {
          letter: 'A',
          type: 'visual',
          title:
            'Source A (Official Cartographic Investigation): Motorcade Route and Assassination Site at the Latin Bridge, Sarajevo (28 June 1914)',
          image: '/units/great_war/assets/map_sarajevo_route.jpg',
          src: '/units/great_war/assets/map_sarajevo_route.jpg',
          caption:
            "Austro-Hungarian police investigation map showing the Appel Quay motorcade route along the Miljacka River and the fatal wrong turn into Franz Josef Street outside Schiller's Delicatessen.",
          citation:
            'Bosnian State Archives, Sarajevo / Austro-Hungarian District Court of Sarajevo (Inv. Akt-Pr-1914-Sarajevo).',
          context:
            'Following an earlier failed bomb attack by Nedeljko Čabrinović, Archduke Franz Ferdinand decided to alter his schedule to visit wounded officers in hospital. However, his chauffeurs were not informed; when lead driver Leopold Lojka turned into Franz Josef Street, Governor Potiorek ordered him to brake and reverse, stalling the car directly in front of Gavrilo Princip. **Hinge Question:** How did a series of administrative blunders and a wrong turn transform a bungled assassination plot into the catalyst for world war?',
          hinge_question:
            'How did a series of administrative blunders and a wrong turn transform a bungled assassination plot into the catalyst for world war?',
          question_badge: 'Cartographic Evidence',
          question:
            'What does this investigation map show about the role of chance and error in the assassination of Franz Ferdinand?',
          enquiry_question:
            'What does this investigation map show about the role of chance and error in the assassination of Franz Ferdinand?',
          model_answer:
            'The map shows that Princip had abandoned his post after the morning bomb attack failed; the royal car took an unplanned wrong turn and stalled right in front of him, giving him an unexpected, point-blank opportunity to shoot.',
          discussion_ideas: [
            'Accident vs inevitability: Highlights how contingency and human error intersected with structural tensions.',
            'Security failures: Astonishing lack of police escorts along the published motorcade route.',
            'Symbolic date: 28 June was St. Vitus Day (Vidovdan), a sacred anniversary of Serbian national suffering that provoked intense nationalist anger.',
          ],
          source_context:
            'Following an earlier failed bomb attack by Nedeljko Čabrinović, Archduke Franz Ferdinand decided to alter his schedule to visit wounded officers in hospital. However, his chauffeurs were not informed; when lead driver Leopold Lojka turned into Franz Josef Street, Governor Potiorek ordered him to brake and reverse, stalling the car directly in front of Gavrilo Princip. **Hinge Question:** How did a series of administrative blunders and a wrong turn transform a bungled assassination plot into the catalyst for world war?',
          teacher_notes: {
            source_context:
              'Following an earlier failed bomb attack by Nedeljko Čabrinović, Archduke Franz Ferdinand decided to alter his schedule to visit wounded officers in hospital. However, his chauffeurs were not informed; when lead driver Leopold Lojka turned into Franz Josef Street, Governor Potiorek ordered him to brake and reverse, stalling the car directly in front of Gavrilo Princip. **Hinge Question:** How did a series of administrative blunders and a wrong turn transform a bungled assassination plot into the catalyst for world war?',
          },
          id: 'gw_l5_src_a',
        },
        {
          letter: 'B',
          type: 'written',
          title:
            'Source B (Imperial Diplomatic Dispatch): The German "Blank Cheque" to Austria-Hungary (6 July 1914)',
          text: "His Imperial Majesty [Kaiser Wilhelm II] authorized me to inform your Excellency that Austria-Hungary may rely upon Germany's full support... Even if matters should develop into a serious European war between Austria-Hungary and Russia, Vienna may feel assured that Germany, with her customary loyalty as an ally, will stand at her side. Finally, as far as concerns Serbia, His Majesty naturally cannot interfere in the dispute now taking place... But Emperor Franz Joseph may rest assured that His Majesty will faithfully stand by Austria-Hungary, as required by the obligations of his alliance and of his ancient friendship.",
          caption:
            "Official Austrian diplomatic record of Germany's unconditional pledge of military backing, famously known to historians as the 'Blank Cheque'.",
          citation:
            'Austrian State Archives (HHStA), Vienna / Politisches Archiv, Karton 521 (Österreich-Ungarns Aussenpolitik, Vol. 8, Document 10058).',
          context:
            "On 5–6 July 1914, Kaiser Wilhelm II and Chancellor Bethmann-Hollweg issued the 'Blank Cheque', promising unconditional military support if Austria-Hungary took military action against Serbia. German leaders believed Russia was unprepared for war and would back down, localizing the conflict. **Hinge Question:** Why did Germany's unconditional promise of support empower Austro-Hungarian hardliners to issue an impossible ultimatum to Serbia?",
          hinge_question:
            "Why did Germany's unconditional promise of support empower Austro-Hungarian hardliners to issue an impossible ultimatum to Serbia?",
          question_badge: 'Author’s Purpose',
          question:
            'Why did the German government issue this unconditional guarantee of support to Austria-Hungary in July 1914?',
          enquiry_question:
            'Why did the German government issue this unconditional guarantee of support to Austria-Hungary in July 1914?',
          model_answer:
            'The German government issued the guarantee to encourage Austria-Hungary to strike a swift, decisive blow against Serbia, gambling that firm German backing would intimidate Russia into staying out of the conflict.',
          discussion_ideas: [
            'Calculated risk: German leaders knew this could trigger world war, but preferred war in 1914 over war later when Russia was stronger.',
            'Loss of control: Berlin handed Vienna control over German foreign policy.',
            'Hubristic gamble: Overconfident assumption that Russia would back down as it had during the 1908 Bosnian Crisis.',
          ],
          source_context:
            "On 5–6 July 1914, Kaiser Wilhelm II and Chancellor Bethmann-Hollweg issued the 'Blank Cheque', promising unconditional military support if Austria-Hungary took military action against Serbia. German leaders believed Russia was unprepared for war and would back down, localizing the conflict. **Hinge Question:** Why did Germany's unconditional promise of support empower Austro-Hungarian hardliners to issue an impossible ultimatum to Serbia?",
          teacher_notes: {
            source_context:
              "On 5–6 July 1914, Kaiser Wilhelm II and Chancellor Bethmann-Hollweg issued the 'Blank Cheque', promising unconditional military support if Austria-Hungary took military action against Serbia. German leaders believed Russia was unprepared for war and would back down, localizing the conflict. **Hinge Question:** Why did Germany's unconditional promise of support empower Austro-Hungarian hardliners to issue an impossible ultimatum to Serbia?",
          },
          id: 'gw_l5_src_b',
          src: '',
          image: '',
        },
        {
          letter: 'C',
          type: 'written',
          title:
            'Source C (State Ultimatum): The Austro-Hungarian Ultimatum to Serbia (23 July 1914)',
          text: "The Royal Serbian Government shall pledge itself:<br>5. To accept the collaboration in Serbia of representatives of the Imperial and Royal Government [Austria-Hungary] for the suppression of the subversive movement directed against the territorial integrity of the Monarchy;<br>6. To take judicial proceedings against the accessories to the plot of June 28th who are on Serbian territory; delegates of the Austro-Hungarian Government will take part in the investigation relating thereto...<br><br>The Austro-Hungarian Government expects the reply of the Royal Government at the latest by Saturday, the 25th instant, at 6 o'clock in the evening.",
          caption:
            'Extract from the ten-point Austro-Hungarian diplomatic ultimatum delivered to the Serbian Foreign Ministry in Belgrade, intentionally drafted with a 48-hour deadline to force a military rejection.',
          citation:
            'Austrian State Archives (HHStA), Vienna / Ministerium des Äußern (Diplomatische Aktenstücke zur Vorgeschichte des Krieges 1914, Part 1, No. 7).',
          context:
            'Austria-Hungary delayed three weeks after the assassination before delivering a deliberately unacceptable ten-point ultimatum to Serbia. Points 5 and 6 demanded that Austrian police and judges enter Serbia to direct investigations, which Serbia could not accept without surrendering its sovereign independence. **Hinge Question:** Why did the Austro-Hungarian leadership intentionally draft the ultimatum so that Serbia could not possibly accept all its terms?',
          hinge_question:
            'Why did the Austro-Hungarian leadership intentionally draft the ultimatum so that Serbia could not possibly accept all its terms?',
          question_badge: 'Source Inference',
          question:
            "What does the inclusion of Points 5 and 6 reveal about Austria-Hungary's true objective in delivering this ultimatum?",
          enquiry_question:
            "What does the inclusion of Points 5 and 6 reveal about Austria-Hungary's true objective in delivering this ultimatum?",
          model_answer:
            'The inclusion of Points 5 and 6 reveals that Austria-Hungary never wanted a diplomatic compromise; Vienna intentionally demanded terms that violated Serbian national sovereignty so Serbia would reject them, providing an excuse for a military invasion.',
          discussion_ideas: [
            'Pretext for war: Designed from the start as an instrument of destruction rather than negotiation.',
            'Serbian masterstroke: Serbia accepted eight of ten points and conditionally accepted the rest, creating international sympathy.',
            "Austrian haste: Despite Serbia's extraordinarily conciliatory reply, Austria broke diplomatic relations within 45 minutes.",
          ],
          source_context:
            'Austria-Hungary delayed three weeks after the assassination before delivering a deliberately unacceptable ten-point ultimatum to Serbia. Points 5 and 6 demanded that Austrian police and judges enter Serbia to direct investigations, which Serbia could not accept without surrendering its sovereign independence. **Hinge Question:** Why did the Austro-Hungarian leadership intentionally draft the ultimatum so that Serbia could not possibly accept all its terms?',
          teacher_notes: {
            source_context:
              'Austria-Hungary delayed three weeks after the assassination before delivering a deliberately unacceptable ten-point ultimatum to Serbia. Points 5 and 6 demanded that Austrian police and judges enter Serbia to direct investigations, which Serbia could not accept without surrendering its sovereign independence. **Hinge Question:** Why did the Austro-Hungarian leadership intentionally draft the ultimatum so that Serbia could not possibly accept all its terms?',
          },
          id: 'gw_l5_src_c',
          src: '',
          image: '',
        },
        {
          letter: 'D',
          id: 'gw_l5_src_d',
          type: 'written',
          title:
            'Source D (Imperial Mobilisation Decree): Tsar Nicholas II, Imperial Ukase on Russian General Mobilisation (30 July 1914)',
          context:
            'On 30 July 1914, following the Austrian bombardment of Belgrade, Tsar Nicholas II ordered full general mobilisation across the Russian Empire. Because Russian mobilisation threatened Germany’s eastern frontier, it triggered Berlin’s immediate decision to launch the Schlieffen Plan. **Hinge Question:** Why did Russia’s decision to mobilise its armies make a peaceful diplomatic solution impossible under the logic of European military plans?',
          hinge_question:
            'Why did Russia’s decision to mobilise its armies make a peaceful diplomatic solution impossible under the logic of European military plans?',
          text: '“In view of the opening of hostilities between Austria-Hungary and Serbia, We decree that the Army and Navy of the Russian Empire shall be brought to a complete war footing, and that general mobilisation shall begin immediately on 31 July. Let our brave troops answer the sovereign call of duty to defend Holy Orthodox Slavdom against Austrian aggression.”',
          caption:
            'Source D: Imperial decree ordering full general mobilisation of the Russian Armed Forces on 30 July 1914.',
          question_badge: 'Military Mobilisation',
          question:
            'Why did Russian mobilisation trigger an immediate declaration of war from Imperial Germany?',
          enquiry_question:
            'Why did Russian mobilisation trigger an immediate declaration of war from Imperial Germany?',
          model_answer:
            'Germany’s Schlieffen Plan depended on defeating France before Russian armies could mobilise; once Russia mobilised, German generals believed they had to attack immediately or face a fatal two-front war.',
          source_context:
            'On 30 July 1914, following the Austrian bombardment of Belgrade, Tsar Nicholas II ordered full general mobilisation across the Russian Empire. Because Russian mobilisation threatened Germany’s eastern frontier, it triggered Berlin’s immediate decision to launch the Schlieffen Plan. **Hinge Question:** Why did Russia’s decision to mobilise its armies make a peaceful diplomatic solution impossible under the logic of European military plans?',
          teacher_notes: {
            source_context:
              'On 30 July 1914, following the Austrian bombardment of Belgrade, Tsar Nicholas II ordered full general mobilisation across the Russian Empire. Because Russian mobilisation threatened Germany’s eastern frontier, it triggered Berlin’s immediate decision to launch the Schlieffen Plan. **Hinge Question:** Why did Russia’s decision to mobilise its armies make a peaceful diplomatic solution impossible under the logic of European military plans?',
          },
          src: '',
          image: '',
        },
        {
          letter: 'E',
          type: 'visual',
          title:
            'Source E (Police Record): Austro-Hungarian Police Mugshot of Gavrilo Princip (July 1914)',
          image: '/units/great_war/assets/card_princip.png',
          src: '/units/great_war/assets/card_princip.png',
          caption:
            'Austro-Hungarian imperial police identification photograph of 19-year-old Gavrilo Princip, taken in Sarajevo prison shortly after his arrest on 28 June 1914.',
          citation:
            'Austrian State Archives (HHStA), Vienna / Austrian Police Photographic Archive (Inv. Pol-1914-Princip).',
          context:
            "Too young under Austro-Hungarian law to receive the death penalty (which required a convict to be 20 years old at the time of the crime), Princip was sentenced to twenty years' hard labour in solitary confinement at the fortress of Theresienstadt. **Hinge Question:** Why did the physical youth and frail appearance of Gavrilo Princip contrast so sharply with the world-shattering geopolitical catastrophe his actions unleashed?",
          hinge_question:
            'Why did the physical youth and frail appearance of Gavrilo Princip contrast so sharply with the world-shattering geopolitical catastrophe his actions unleashed?',
          question_badge: 'Reliability & Provenance',
          question:
            'What does this primary police photograph reveal about the assassin whose actions triggered the First World War?',
          enquiry_question:
            'What does this primary police photograph reveal about the assassin whose actions triggered the First World War?',
          model_answer:
            'The photograph reveals an impoverished, slight, nineteen-year-old student, visually underscoring the astonishing disproportion between an individual teenage radical and the global catastrophe of industrialized war that followed.',
          discussion_ideas: [
            'Disproportion of cause and consequence: An obscure student ignited a clash of global empires.',
            'Legal protection of age: Missed the death penalty by only 27 days, saving him from execution but not slow death in prison.',
            'Mythology vs reality: Strips away romanticized heroic depictions to show the stark reality of political violence.',
          ],
          source_context:
            "Too young under Austro-Hungarian law to receive the death penalty (which required a convict to be 20 years old at the time of the crime), Princip was sentenced to twenty years' hard labour in solitary confinement at the fortress of Theresienstadt. **Hinge Question:** Why did the physical youth and frail appearance of Gavrilo Princip contrast so sharply with the world-shattering geopolitical catastrophe his actions unleashed?",
          teacher_notes: {
            source_context:
              "Too young under Austro-Hungarian law to receive the death penalty (which required a convict to be 20 years old at the time of the crime), Princip was sentenced to twenty years' hard labour in solitary confinement at the fortress of Theresienstadt. **Hinge Question:** Why did the physical youth and frail appearance of Gavrilo Princip contrast so sharply with the world-shattering geopolitical catastrophe his actions unleashed?",
          },
          id: 'gw_l5_src_e',
        },
      ],
    },
    {
      id: 'lesson_6',
      title: 'November Assessment Masterclass: Why Did War Break Out in 1914?',
      enquiry: 'Why did war break out in 1914?',
      enquiryQuestion: 'Why did war break out in 1914?',
      subtitle:
        'Step-by-step PEEL Planning & Scaffolding Workshop: German Unification, Imperial Rivalry, Naval Arms Race, Alliances & Assassination',
      skill: 'Disciplinary Skill: Causal Explanation & Structured PEEL Synthesis',
      card_image: '/images/great_war_cover.jpg',
      card_position: 'center 45%',
      banner: '/images/great_war_cover.jpg',
      cover_image: '/images/great_war_cover.jpg',
      prologue:
        'Welcome to your Year 9 November Assessment Masterclass! In this workshop, you will prepare for your 30-minute formal assessment: "Why did war break out in 1914?". You will write three developed PEEL paragraphs choosing from four key historical catalysts: German unification, Imperial rivalry, the Naval arms race, or Alliances and the Sarajevo assassination. Remember: NO conclusion is needed for this question! Over your revision period, you are permitted to prepare ONE single sheet of A4 paper containing bullet points, mind maps, statistics, and dates to bring directly into the assessment room.',
      assessment_notice: {
        title: 'Year 9 November Formal Assessment Timetable & Rules',
        groups: [
          {
            set: 'Set 9Y',
            date: 'Monday 9th November',
            period: 'Formal Assessment (30 mins • 12 marks)',
          },
          {
            set: 'Set 9X',
            date: 'Thursday 12th November',
            period: 'Formal Assessment (30 mins • 12 marks)',
          },
        ],
        rules: [
          'You are permitted to bring ONE sheet of A4 lined paper with revision notes into the assessment.',
          'Notes MUST be in bullet points, timelines, or mind maps — strictly NO full continuous sentences or pre-written paragraphs.',
          'Write 3 developed PEEL paragraphs choosing 3 of the 4 key historical catalysts.',
          'Strictly 3 paragraphs — NO conclusion is required for this "Why" question!',
          'Total assessment time: 30 minutes (12 marks).',
        ],
      },
      margin_spine: [
        {
          year: 'Strategy',
          label: 'Assessment Strategy: 3 PEEL Paragraphs',
        },
        {
          year: '1871',
          label: 'Reason 1: German Unification',
        },
        {
          year: '1884–1911',
          label: 'Reason 2: Imperial Rivalry',
        },
        {
          year: '1898–1906',
          label: 'Reason 3: Naval Arms Race',
        },
        {
          year: '1879–1914',
          label: 'Reason 4: Alliances & Sarajevo',
        },
      ],
      causal_domino_spine: {
        title: 'The Catalysts of the Great War (1871–1914)',
        subtitle:
          'How Decades of Imperial Tension, Militarism and Alliances Culminated in Global Conflict',
        stages: [
          {
            step: 1,
            para_ref: '[6.1]',
            date: '30 Mins • 12 Marks',
            title: 'Assessment Strategy: 3 Developed PEEL Paragraphs',
            actor: 'Year 9 Historians',
            tag: '📝 EXAM STRATEGY',
            trigger:
              'Pupils plan a 30-minute formal assessment selecting 3 of the 4 core historical catalysts (Nationalism, Imperialism, Militarism, Alliances).',
            connective:
              'Structuring each paragraph with Point, Evidence, Explanation, and Link ensures full marks with no conclusion needed.',
            question:
              'How do you structure a 12-mark causal explanation on why war broke out in 1914?',
          },
          {
            step: 2,
            para_ref: '[6.2]',
            date: '1871',
            title: 'Reason 1: German Unification, Bismarck & French Revanche',
            actor: 'Chancellor Otto von Bismarck & Kaiser Wilhelm I',
            tag: '🚩 NATIONALISM',
            trigger:
              'Prussia unites 39 independent states into the German Empire at Versailles and annexes Alsace-Lorraine from France.',
            connective:
              'Created a massive new military superpower in the heart of Europe and instilled a permanent French desire for revenge (Revanche).',
            question:
              'Why did German unification in 1871 permanently destabilise the European balance of power?',
          },
          {
            step: 3,
            para_ref: '[6.3]',
            date: '1884–1911',
            title: 'Reason 2: Imperial Rivalry & The Scramble for Africa',
            actor: 'Kaiser Wilhelm II & European Imperial Powers',
            tag: '🌍 IMPERIALISM',
            trigger:
              'European powers carved up Africa at the 1884 Berlin Conference; Wilhelm II launched Weltpolitik demanding Germany’s "place in the sun", sparking crises in Morocco (1905, 1911).',
            connective:
              'Drove Britain and France into a closer defensive alliance while isolating Germany and intensifying international paranoia.',
            question:
              'How did imperial ambitions in Africa poison diplomatic relations between Germany, France, and Britain?',
          },
          {
            step: 4,
            para_ref: '[6.4]',
            date: '1898–1906',
            title: 'Reason 3: Anglo-German Naval Race & HMS Dreadnought',
            actor: 'Admiral Tirpitz & Admiral Jackie Fisher',
            tag: '🎖️ MILITARISM',
            trigger:
              'Tirpitz passed Naval Laws to
... [truncated for diff preview]